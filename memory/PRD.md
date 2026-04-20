# ARENAKORE — PRD (Product Requirements Document)

## Overview
Sito web ufficiale ARENAKORE (www.arenakore.com). Piattaforma di competizione fitness multi-sport. Full-stack React SPA + FastAPI + MongoDB.

## Date
- Created: 2026-04-14
- Last updated: 2026-04-20

## Architecture
- **Frontend**: React 19, i18next (EN/IT/ES), Tailwind CSS, Recharts
- **Backend**: FastAPI, MongoDB (Motor async), JWT Auth
- **CMS**: Headless CMS custom (cms_content, cms_global, cms_versions collections)
- **AI**: OpenAI GPT-4o-mini via Emergent LLM Key (auto-translations)
- **Email**: Resend (Gym Pilot notifications)

## Visual Identity
- **Background**: OLED Black (#000)
- **Cyan**: #00FFFF | **Gold**: #FFD700 | **Red**: #FF2D2D (errori ONLY)
- **Style**: Cyber-Brutalist | **Fonts**: Anton + IBM Plex Mono / Inter

## Multi-Page Structure
- **/** — Homepage | **/arena-system** — Arena System | **/for-athletes** — Per Atleti
- **/gym-challenge-pilot** — Gym Pilot | **/get-the-app** — Download App
- **/fitness-challenge-app, /crossfit-challenge, /workout-competition, /amrap-training, /fitness-gamification** — SEO (ContentPageTemplate)
- **/blog, /blog/:slug** — Blog | **/support** — Supporto | **/admin** — CMS Admin

## What's Been Implemented

### Phase 1-2 (April 14-18, 2026)
- Full-Stack React + FastAPI + MongoDB migration
- Headless CMS with AI translation (OpenAI), versioning, A/B testing
- JWT Auth, Resend email, Hero Slider, Analytics

### Phase 3 (April 20, 2026)
**ZERO HARDCODED TEXT CAMPAIGN**
- 543 i18n chiavi sincronizzate EN/IT/ES
- SportSelector, SharedLayout, BlogPage, BlogArticlePage, LoginPage, SupportPage, GymPilotPage, GetTheAppPage tutti tradotti
- ContentPageTemplate con IT/ES via seo-content.js
- Blog DB: 5 post con traduzioni IT/ES via API

### Phase 4 (April 20, 2026)
**OFFLINE SAFE MODE — CMS FALLBACK SYSTEM**

#### Hooks aggiornati:
- `usePageContent.js`: chain `CMS(lang) → CMS(EN) → localStorage → FALLBACK_PAGES[slug][key] → t() → ""`
- `useGlobalContent.js`: chain `CMS(lang) → CMS(EN) → localStorage → FALLBACK_GLOBAL[key] → t() → ""`

#### Fallback features:
- **localStorage caching**: salva risposta CMS in localStorage al successo
- **fallbackContent.js**: 163 chiavi EN per 4 pagine + 12 global keys
- **OFFLINE MODE badge**: visibile quando backend non raggiungibile
- **Auto-seeding**: GlobalContentEditor auto-seed quando DB vuoto
- **Admin offline banner**: messaggio rosso "Backend offline" nel Dashboard admin

#### Test risultati (backend DOWN):
- ✅ Homepage: hero, navbar, CTAs, tutte le sezioni visibili
- ✅ For Athletes: hero, CTA, sezioni completi
- ✅ Arena System: hero, sezioni visibili
- ✅ Gym Challenge Pilot: hero completo
- ✅ Get The App: hero, download buttons visibili

## Key Files
- `/app/frontend/src/content/fallbackContent.js` — 163 CMS keys fallback
- `/app/frontend/src/hooks/usePageContent.js` — Chain CMS→localStorage→fallback
- `/app/frontend/src/hooks/useGlobalContent.js` — Chain CMS→localStorage→fallback
- `/app/frontend/src/locales/{en,it,es}/translation.json` — 543 keys each
- `/app/frontend/src/data/seo-content.js` — IT/ES translations + getLocalizedPage()
- `/app/backend/server.py` — DEFAULT_PAGES (full content), GLOBAL_DEFAULTS

## DB State
- cms_content: 9 pages seeded | cms_global: 43 items | blog_posts: 5 (with IT/ES)
- hero_slides: 6 | pilot_requests: 3

## Credentials
- Admin: admin@arenakore.com / ArenaKore2026!
- Preview: https://talent-card-refactor.preview.emergentagent.com

## Backlog P1
- [ ] Language switcher nella navbar desktop (ora solo footer)
- [ ] Popolare CMS admin con contenuti IT/ES via "Force Reseed All + AI Translate"
- [ ] Aggiungere gym-pilot alle pagine in fallbackContent.js

## Backlog P2/P3
- [ ] Link reali App Store / Play Store
- [ ] Split AdminPage.jsx (~2100 righe) in moduli
- [ ] AI auto-traduzione per nuovi blog post
