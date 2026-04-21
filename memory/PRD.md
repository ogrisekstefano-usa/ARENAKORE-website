# ARENAKORE — PRD

## Core Positioning: "NEXUS mette alla prova. NEXUS crea e seleziona sfide progettate da coach professionisti e validate su migliaia di atleti."

## Phase 7 — Full CMS Migration (April 21, 2026) COMPLETED

### Architecture
- Frontend = renderer only. Database = source of truth.
- usePageContent(slug, lang) → reads from MongoDB cms_content
- NO hardcoded content strings in any .jsx file
- scan_hardcoded.py: 0 violations across 76 files

### DB State (420 CMS keys total):
| Page | Keys | Method |
|------|------|--------|
| homepage | 78 | DEFAULT_PAGES seed |
| for-athletes | 30 | DEFAULT_PAGES seed |
| arena-system | 30 | DEFAULT_PAGES seed |
| gym-pilot | 131 | seed_cms.py (migrated from i18n) |
| get-the-app | 38 | DEFAULT_PAGES seed |
| competition | 22 | seed_cms.py |
| amrap | 22 | seed_cms.py |
| crossfit | 22 | seed_cms.py |
| gamification | 24 | seed_cms.py |
| arena-matches | 23 | seed_cms.py (CMS-only from start) |

### Changes:
- GymPilotPage: 90 t('pilot.*') → cms('*') + usePageContent
- ContentPageTemplate: now uses usePageContent as CMS source + getLocalizedPage as fallback structure
- ArenaSystemPage/AthletePage/GetTheAppPage: removed t() fallbacks from cms() calls
- scripts/seed_cms.py: new pages seeded directly to DB (never modify server.py)

## Seed Workflow (for new content)
```bash
python3 scripts/seed_cms.py --slug new-page --force --api http://localhost:8001
```
NEVER edit DEFAULT_PAGES in server.py for content changes.

## Credentials
- Admin: admin@arenakore.com / ArenaKore2026!
- Preview: https://talent-card-refactor.preview.emergentagent.com

## Next: SEO (hreflang, metadata, sitemap)

## Backlog
- Language switcher desktop navbar
- App Store / Play Store link reali
