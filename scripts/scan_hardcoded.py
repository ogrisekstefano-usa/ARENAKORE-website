#!/usr/bin/env python3
"""
ArenaKore CMS Scanner
Scans frontend code for hardcoded text strings that should be in CMS.

Usage:
  python3 scripts/scan_hardcoded.py [--strict]

Returns:
  0 = clean (no hardcoded text found)
  1 = hardcoded text found (use --strict to fail build)
"""
import os, re, sys, json
from pathlib import Path

FRONTEND_SRC = Path(__file__).parent.parent / 'frontend/src'

# Files to skip
SKIP_PATTERNS = ['node_modules', '.test.', 'AdminPage', 'seo-content', 
                 'i18n', 'tracking', '__', '.map', 'LangModal']

# Allowed patterns (not user-facing text)
ALLOWED = [
    r'console\.',        # console logs
    r'data-testid=',     # test IDs
    r'className=',       # CSS classes
    r'src=',             # image sources
    r'href=',            # links
    r'alt=',             # alt text (should also be in CMS but lower priority)
    r'placeholder=',     # placeholders
    r'//.*',             # comments
    r'/*.*',             # block comments
    r'^import ',         # imports
    r'font-inter|font-anton|text-',  # Tailwind
]

# Suspicious patterns — hardcoded visible text
SUSPICIOUS = [
    r'>([A-Z][A-Z ]{4,}\.?)<',      # ALL CAPS visible text > 5 chars
    r'>\s*([A-Z][a-z]+ [A-Z][a-z]+)',  # Title Case multi-word
]

def is_cms_call(line):
    return any(x in line for x in ['cms(', 'content(', 't(\'', 'global(', 'gContent(', 'navLabel('])

def scan_file(filepath):
    issues = []
    with open(filepath, 'r', errors='ignore') as f:
        lines = f.readlines()
    
    for line_no, line in enumerate(lines, 1):
        stripped = line.strip()
        if not stripped or stripped.startswith('//') or stripped.startswith('*'):
            continue
        if is_cms_call(line):
            continue
        if any(re.search(p, line) for p in ALLOWED):
            continue
        for pattern in SUSPICIOUS:
            matches = re.findall(pattern, stripped)
            for match in matches:
                if len(match) > 4 and not match.startswith('http') and not match.startswith('rgb'):
                    issues.append({'file': str(filepath.relative_to(FRONTEND_SRC)), 'line': line_no, 'text': match[:60], 'context': stripped[:80]})
    return issues

def main():
    strict = '--strict' in sys.argv
    all_issues = []
    
    jsx_files = list(FRONTEND_SRC.rglob('*.jsx')) + list(FRONTEND_SRC.rglob('*.js'))
    scanned = 0
    
    for f in jsx_files:
        skip = any(s in str(f) for s in SKIP_PATTERNS)
        if skip: continue
        issues = scan_file(f)
        if issues:
            all_issues.extend(issues)
        scanned += 1
    
    print(f"Scanned {scanned} files")
    print(f"Potential hardcoded text: {len(all_issues)} instances")
    
    if all_issues:
        print("\n--- Potential Issues ---")
        by_file = {}
        for issue in all_issues[:30]:  # show first 30
            f = issue['file']
            if f not in by_file: by_file[f] = []
            by_file[f].append(issue)
        
        for filepath, issues in by_file.items():
            print(f"\n  {filepath}:")
            for i in issues[:5]:
                print(f"    Line {i['line']}: \"{i['text']}\"")
    
    # Export results
    output = Path(__file__).parent / 'cms_scan_results.json'
    with open(output, 'w') as f:
        json.dump({'total': len(all_issues), 'issues': all_issues[:100]}, f, indent=2)
    print(f"\nFull results: {output}")
    
    if strict and all_issues:
        print("\n[STRICT] Hardcoded text found. Fix before deploy.")
        return 1
    return 0

if __name__ == '__main__':
    sys.exit(main())
