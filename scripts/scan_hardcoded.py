#!/usr/bin/env python3
"""
ArenaKore Hardcoded Text Scanner v2
Scans frontend for strings that bypass the CMS/i18n pipeline.

Rules:
  PASS: text wrapped in cms(), t(), usePageContent, useGlobalContent
  FAIL: raw string literals in JSX visible to users

Usage:
  python3 scripts/scan_hardcoded.py [--strict] [--fix-report]

Returns:
  0 = clean
  1 = hardcoded text found (blocks deploy in --strict mode)
"""
import os, re, sys, json
from pathlib import Path

FRONTEND_SRC = Path(__file__).parent.parent / 'frontend/src'

# Files to always skip (admin UI, i18n config, test files, non-content files)
SKIP_FILES = {
    'AdminPage', 'i18n.js', 'tracking', 'LangModal', 'ScrollToTop',
    'SchemaMarkup', 'TranslationBanner', 'validateRoutes', 'routes.js',
    '__', '.test.', 'spec.', 'index.js', 'App.js',
}

# Directories to skip entirely
SKIP_DIRS = {'node_modules', '__pycache__', '.git', 'locales', 'data'}

# Lines/contexts that are always allowed (CSS, props, non-visible)
ALLOWED_CONTEXTS = [
    'className=', 'data-testid=', 'src=', 'href=', 'alt=', 'type=',
    'id=', 'name=', 'key=', 'for=', 'htmlFor=', 'style=',
    'import ', 'require(', '// ', '/* ', ' * ', '* /',
    'console.', 'Error(', 'error.', '.log(', 'throw ',
    'localStorage', 'sessionStorage', 'window.', 'document.',
    'url=', 'URL(', 'path=', 'route=',
    '#', 'rgb', 'rgba', 'px', 'em', 'rem',
    'font-', 'text-', 'bg-', 'border-', 'rounded-', 'flex-',
    'md:', 'sm:', 'lg:', 'xl:',
    'AK_', 'ak_', 'KORE_',
    'mailto:', 'tel:', 'https://', 'http://',
]

# CMS/i18n pipeline patterns (these are CORRECT)
CMS_PATTERNS = [
    r'cms\(', r'content\(', r"t\('", r't\("', r't\(`',
    r'global\(', r'navLabel\(', r'footerLabel\(',
    r'usePageContent', r'useGlobalContent',
    r"t\('", r'i18n\.t\(',
]

# Patterns that indicate a raw visible string (VIOLATION)
VIOLATION_PATTERNS = [
    # Direct text in JSX tags (not in expressions)
    (r'>\s*([A-ZÀ-Ú][A-ZÀ-Ú &\'.,:!?]{4,})\s*<', 'ALL_CAPS_TEXT'),
    # Title case multi-word visible text
    (r'>\s*([A-ZÀ-Ú][a-zà-ú]+ [A-ZÀ-Ú][a-zà-ú][a-zà-ú ]{3,})\s*<', 'TITLE_CASE_TEXT'),
    # Common hardcoded phrases
    (r'"(NEXUS|ArenaKore|K-Rating|K-Flux)[^"]{5,}"', 'BRAND_HARDCODED'),
]

# False positives to ignore (known-safe patterns)
FALSE_POSITIVES = {
    'ArenaKore', 'NEXUS', 'CrossFit', 'K-Rating', 'K-Flux', 'KORE ID',
    'DNA', 'VEL', 'FOR', 'RES', 'AGI', 'TEC', 'POT',
    'EN', 'IT', 'ES', 'CMS', 'SEO', 'URL', 'ID', 'OK', 'API',
}

def is_cms_wrapped(line: str) -> bool:
    """Check if this line uses a CMS/i18n call."""
    return any(re.search(p, line) for p in CMS_PATTERNS)

def is_allowed_context(line: str) -> bool:
    """Check if the context is a non-visible or allowed use."""
    return any(ctx in line for ctx in ALLOWED_CONTEXTS)

def extract_violations(filepath: Path) -> list:
    violations = []
    try:
        with open(filepath, 'r', errors='ignore') as f:
            lines = f.readlines()
    except Exception:
        return []

    for line_no, line in enumerate(lines, 1):
        stripped = line.strip()
        if not stripped or stripped.startswith('//') or stripped.startswith('*'):
            continue
        if is_allowed_context(stripped):
            continue
        if is_cms_wrapped(stripped):
            continue

        for pattern, violation_type in VIOLATION_PATTERNS:
            matches = re.findall(pattern, stripped)
            for match in matches:
                if len(match) < 5:
                    continue
                if match.strip() in FALSE_POSITIVES:
                    continue
                if any(fp in match for fp in FALSE_POSITIVES):
                    continue
                violations.append({
                    'file': str(filepath.relative_to(FRONTEND_SRC)),
                    'line': line_no,
                    'type': violation_type,
                    'text': match[:80],
                    'context': stripped[:100],
                })
    return violations

def should_skip(filepath: Path) -> bool:
    parts = set(filepath.parts)
    if parts & SKIP_DIRS:
        return True
    filename = filepath.name
    return any(s in filename for s in SKIP_FILES)

def main():
    strict = '--strict' in sys.argv
    fix_report = '--fix-report' in sys.argv
    all_violations = []

    jsx_files = list(FRONTEND_SRC.rglob('*.jsx')) + list(FRONTEND_SRC.rglob('*.js'))
    scanned = 0
    skipped = 0

    for f in jsx_files:
        if should_skip(f):
            skipped += 1
            continue
        violations = extract_violations(f)
        all_violations.extend(violations)
        scanned += 1

    print(f"\n{'='*50}")
    print(f"ArenaKore Hardcoded Text Scanner v2")
    print(f"{'='*50}")
    print(f"Scanned:  {scanned} files")
    print(f"Skipped:  {skipped} files (admin, i18n, config)")
    print(f"{'='*50}")

    if not all_violations:
        print(f"✅  RESULT: 0 hardcoded strings found")
        print(f"   All visible text is CMS/i18n driven.")
    else:
        print(f"⚠️  RESULT: {len(all_violations)} potential hardcoded strings")

        by_file: dict[str, list] = {}
        for v in all_violations:
            k = v['file']
            if k not in by_file:
                by_file[k] = []
            by_file[k].append(v)

        for fpath, vs in list(by_file.items())[:10]:
            print(f"\n  📄 {fpath}")
            for v in vs[:3]:
                print(f"     Line {v['line']:4d} [{v['type']}]: \"{v['text']}\"")

        if len(by_file) > 10:
            print(f"\n  ... and {len(by_file)-10} more files")

    print(f"{'='*50}\n")

    # Save JSON report
    output = Path(__file__).parent / 'cms_scan_results.json'
    with open(output, 'w') as f:
        json.dump({
            'total': len(all_violations),
            'scanned_files': scanned,
            'skipped_files': skipped,
            'result': 'PASS' if not all_violations else 'FAIL',
            'violations': all_violations[:200],
        }, f, indent=2)
    print(f"Report saved: {output}")

    if strict and all_violations:
        print("\n[STRICT MODE] Hardcoded text found. Fix before deploy.")
        return 1

    return 0

if __name__ == '__main__':
    sys.exit(main())
