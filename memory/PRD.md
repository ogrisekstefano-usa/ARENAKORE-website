# ARENAKORE — PRD (Product Requirements Document)

## Overview
Sito web ufficiale ARENAKORE (www.arenakore.com). Piattaforma di competizione fitness multi-sport. Full-stack React SPA + FastAPI + MongoDB.

## Date
- Created: 2026-04-14 | Last updated: 2026-04-20

## Architecture
- **Frontend**: React 19, i18next (EN/IT/ES), Tailwind CSS, Recharts
- **Backend**: FastAPI, MongoDB (Motor async), JWT Auth
- **CMS**: Headless CMS custom (cms_content, cms_global, cms_versions)
- **AI**: OpenAI GPT-4o-mini via Emergent LLM Key | **Email**: Resend

## Phase 4 — Offline Resilience (April 20, 2026) COMPLETED

### Architecture del fallback (GUARANTEED CONTENT)
```
CMS API (lang) → CMS API (EN) → localStorage cache → fallbackContent.js → i18n(t()) → ""
```

### Key change in hooks:
- `data` initialized with `FALLBACK_PAGES[slug]` immediately (no flash)
- On API failure: `_pageCache[cacheKey] = { ...fallback, ...apiData }` (never empty)
- `content()` always finds value via `data[key]` since data = fallback + api merged

### fallbackContent.js: 273 keys total
- 226 page keys across 9 pages (homepage, for-athletes, arena-system, get-the-app, gym-pilot, competition, amrap, crossfit, gamification)
- 47 global keys (navbar, CTAs, footer, microcopy)

### Test risultati (backend DOWN):
- ✅ navbar: HOME / ARENA SYSTEM / ATHLETES / COMPETITION / ...
- ✅ hero: "THE COMPETITION NEVER ENDS." + CTAs
- ✅ problem: "TRAINING WITHOUT COMPETITION DOESN'T LAST."
- ✅ solution: "ARENAKORE TURNS TRAINING INTO COMPETITION."
- ✅ how: "HOW IT WORKS / 4 STEPS. NO EXCUSES."
- ✅ disciplines: "EVERY ARENA / BUILT FOR EVERY DISCIPLINE."
- ✅ gyms: "FOR GYM OWNERS / BUILT FOR GYMS THAT WANT ENGAGED MEMBERS."
- ✅ footer: "Global competition platform for athletes and gyms."

## Credentials
- Admin: admin@arenakore.com / ArenaKore2026!
- Preview: https://talent-card-refactor.preview.emergentagent.com

## Backlog
- [ ] Language switcher nella navbar desktop
- [ ] Link reali App Store / Play Store
- [ ] Split AdminPage.jsx in moduli separati
