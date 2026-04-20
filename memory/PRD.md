# ARENAKORE — PRD (Product Requirements Document)

## Overview
Sito web ufficiale ARENAKORE (www.arenakore.com). Full-stack React SPA + FastAPI + MongoDB.

## Date
- Created: 2026-04-14 | Last updated: 2026-04-20

## Architecture
- **Frontend**: React 19, i18next (EN/IT/ES), Tailwind CSS | **Backend**: FastAPI, MongoDB | **CMS**: Headless custom

## Phase 5 — Navigation & Routing Fix (April 20, 2026) COMPLETED

### Routes — Single Source of Truth
`/src/config/routes.js` → ROUTES object + NAV_ITEMS + REDIRECTS

### Canonical routes (new → page):
| Route | Page |
|-------|------|
| `/` | LandingPage |
| `/arena-system` | ArenaSystemPage |
| `/for-athletes` | AthletePage |
| `/competition` | WorkoutCompetitionPage |
| `/amrap` | AmrapPage |
| `/crossfit` | CrossfitPage |
| `/gamification` | GamificationPage |
| `/for-gyms-and-coaches` | GymPilotPage |
| `/blog` | BlogPage |
| `/get-the-app` | GetTheAppPage |

### Legacy redirects (automatic Navigate redirect):
- `/workout-competition` → `/competition`
- `/amrap-training` → `/amrap`
- `/crossfit-challenge` → `/crossfit`
- `/fitness-gamification` → `/gamification`
- `/gym-challenge-pilot` → `/for-gyms-and-coaches`
- `/for-gyms` → `/for-gyms-and-coaches`
- `/competition-system` → `/arena-system`

### Changes:
- ✅ `/src/config/routes.js` — single source of truth
- ✅ `/src/utils/validateRoutes.js` — startup validation
- ✅ `App.js` — uses ROUTES + REDIRECTS
- ✅ `SharedLayout.jsx` — NAV from NAV_ITEMS, footer uses ROUTES
- ✅ All pages — hardcoded paths replaced with ROUTES.*
- ✅ `seo-content.js` — relatedPages use ROUTES.*
- ✅ `usePageTracking.js` — updated with new routes
- ✅ Backend KNOWN_ROUTES — synced with frontend routes
- ✅ CMS global re-seeded — nav_gyms/nav_gamification have IT/ES translations

## Credentials
- Admin: admin@arenakore.com / ArenaKore2026!
- Preview: https://talent-card-refactor.preview.emergentagent.com

## Backlog
- [ ] Language switcher desktop navbar
- [ ] App Store / Play Store link reali
- [ ] Split AdminPage.jsx in moduli separati
