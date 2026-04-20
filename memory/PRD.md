# ARENAKORE — PRD (Product Requirements Document)

## Overview
Sito web ufficiale ARENAKORE. Full-stack React SPA + FastAPI + MongoDB.
**Core Positioning (April 2026):** "NEXUS decides. The athlete executes."

## Phase 5 — Product Consistency & Positioning (April 20, 2026) COMPLETED

### New positioning:
- ArenaKore is NOT choice-based. NEXUS assigns. Athletes execute.
- Removed: choose, browse, select, pick, catalog, explore
- Added: assign, execute, system-driven flow

### Changes applied:
- **i18n EN/IT/ES**: HOW IT WORKS s1 = "NEXUS assigns your challenge", disciplines_explore = "Compete", arena.hero_sub = "NEXUS assigns. You execute."
- **Backend DEFAULT_PAGES**: All 9 pages reseeded with NEXUS positioning
- **seo-content.js**: All ContentPageTemplate howItWorks steps updated
- **fallbackContent.js**: Synced with new positioning
- **Footer**: "Support" filtered from PAGINE column (already in SUPPORTO section)
- **Nav config**: Backend now merges DEFAULT_TOP_NAV with stored MongoDB config (prevents disappearing items on new additions)

### QA Results (Testing Agent iteration_4):
- 100% pass rate — all 15 test requirements passing
- 4 bugs fixed: sport_selector_sub x3 locales + GAMIFICATION navbar missing
- Zero mixed language across all pages

## Credentials
- Admin: admin@arenakore.com / ArenaKore2026!
- Preview: https://talent-card-refactor.preview.emergentagent.com

## Next: SEO (hreflang, metadata, indexing)
- Only proceed AFTER product consistency is complete (DONE ✅)

## Backlog
- [ ] Language switcher navbar desktop
- [ ] App Store / Play Store link reali
- [ ] Split AdminPage.jsx in moduli separati
