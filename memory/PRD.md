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
- **Cyan**: #00FFFF (Atleti / NÈXUS)
- **Gold**: #FFD700 (Business / Sfide / Arena)
- **Red**: #FF2D2D (errori/warning SOLO)
- **Style**: Cyber-Brutalist
- **Fonts**: Anton (headings) + IBM Plex Mono / Inter (body)

## Multi-Page Structure
- **/** — Homepage (LandingPage.jsx)
- **/arena-system** — Arena System
- **/for-athletes** — Per Atleti (AthletePage.jsx)
- **/gym-challenge-pilot** — Gym Pilot (GymPilotPage.jsx)
- **/get-the-app** — Download App (GetTheAppPage.jsx)
- **/fitness-challenge-app** — SEO (ContentPageTemplate)
- **/crossfit-challenge** — SEO (ContentPageTemplate)
- **/workout-competition** — SEO (ContentPageTemplate)
- **/amrap-training** — SEO (ContentPageTemplate)
- **/fitness-gamification** — SEO (ContentPageTemplate)
- **/for-gyms** — SEO (ContentPageTemplate)
- **/blog** — Blog lista (BlogPage.jsx)
- **/blog/:slug** — Blog articolo (BlogArticlePage.jsx)
- **/support** — Supporto (SupportPage.jsx)
- **/admin** — CMS Admin (AdminPage.jsx)

## What's Been Implemented

### Phase 1 (April 14-15, 2026)
- Single-page HTML/Tailwind prototype → Full-Stack React + FastAPI migration
- Headless CMS with strict validation, AI translation (OpenAI), versioning
- JWT Authentication (admin@arenakore.com / ArenaKore2026!)
- Hero Slider CMS-controlled
- A/B Testing system

### Phase 2 (April 15-18, 2026)
- Multilingual i18n (EN/IT/ES) via i18next
- Resend email integration (Gym Pilot notifications)
- SEO pages via ContentPageTemplate (5 pages)
- TranslationBanner component
- LangModal footer language switcher

### Phase 4 (April 20, 2026) — COMPLETED
**OFFLINE SAFE MODE — CMS FALLBACK SYSTEM**
- ✅ Created `/app/frontend/src/content/fallbackContent.js` — 128 keys EN for FALLBACK_PAGES + FALLBACK_GLOBAL
- ✅ Updated `usePageContent.js`: chain CMS(lang) → CMS(EN) → FALLBACK_PAGES[slug][key] → _deprecated_fallback → ""
- ✅ Updated `useGlobalContent.js`: chain CMS(lang) → CMS(EN) → FALLBACK_GLOBAL[key] → _deprecated → ""
- ✅ Added `offline` boolean returned from both hooks
- ✅ Added "Offline mode" badge in navbar when CMS API is down
- ✅ Frontend NEVER renders empty text — always shows EN content when CMS unavailable
**ZERO HARDCODED TEXT CAMPAIGN**
- ✅ SportSelector: "Other"→`t('ui.sport_other')`, placeholder→`t('ui.sport_type_placeholder')`, "Save"→`t('ui.sport_save')`, ALL 25 sport names now use i18n keys
- ✅ SharedLayout footer: "Universal Competition System"→`t('footer.universalSystem')`, "Sign in"→`t('ui.sign_in')`, footer links localized
- ✅ BlogPage: H1 uses `t('ui.blog_title')`, "Read"→`t('ui.blog_read')`
- ✅ BlogArticlePage: "PROVA ARENAKORE"→`t('ui.blog_try_arena')`, "ALTRI ARTICOLI"→`t('ui.blog_more_articles')`, language-aware post content via `translations` field
- ✅ LandingPage: DISCIPLINES and HOW_STEPS moved inside component, use t() keys. Positioning section, gyms section, solution stats all translated
- ✅ ArenaSystemPage: All `cms()` fallbacks now use `t('arena.*')` keys. DISCIPLINES inside component with `t('arena.d1-d8')`
- ✅ ContentPageTemplate: Uses `getLocalizedPage(page, lang)` to show IT/ES translations from seo-content.js
- ✅ seo-content.js: Added `PAGE_TRANSLATIONS` with full IT/ES translations for all 5 SEO pages + `getLocalizedPage()` function
- ✅ Blog multilingual: Backend `BlogPost` model has `translations: Optional[Dict]` field; AdminPage BlogManager has IT/ES language tabs; Frontend reads `post.translations[lang]` on render
- ✅ Locale files: 525 keys perfectly synced across EN/IT/ES (added `arena` namespace, `home.d1-d8`, `footer.universalSystem`, sport names, etc.)

## Key Files of Reference
- `/app/frontend/src/LandingPage.jsx` — Homepage
- `/app/frontend/src/pages/AdminPage.jsx` — CMS Admin (~2100 lines)
- `/app/frontend/src/pages/AthletePage.jsx` — For Athletes page
- `/app/frontend/src/pages/ArenaSystemPage.jsx` — Arena System
- `/app/frontend/src/components/SportSelector.jsx` — Sport selector (fully translated)
- `/app/frontend/src/components/SharedLayout.jsx` — Navbar + Footer
- `/app/frontend/src/components/ContentPageTemplate.jsx` — SEO template
- `/app/frontend/src/data/seo-content.js` — SEO page data + IT/ES translations
- `/app/frontend/src/locales/{en,it,es}/translation.json` — 525 keys each
- `/app/backend/server.py` — FastAPI backend

## DB Collections
- `ak_users`: `{id, email, name, password_hash, ak_credits, rank}`
- `cms_content`: `{slug, status, sections: [{key, value, lang}]}`
- `cms_global`: `{key, translations: {en, it, es}}`
- `cms_versions`: versioning
- `blog_posts`: `{id, slug, title, excerpt, content, translations: {it: {title,excerpt,content}, es: {...}}, ...}`
- `hero_slides`: `{id, image_url, sport_label, order, is_active}`

## Credentials
- Admin: admin@arenakore.com / ArenaKore2026!
- Preview URL: https://talent-card-refactor.preview.emergentagent.com

## Backlog
### P1
- [ ] Blog post content IT/ES translations (5 existing posts need content in IT/ES)
- [ ] CMS: populate IT/ES content for all pages (currently empty, falls back to i18n)

### P2
- [ ] Language fallbacks/AI auto-translation for Blog Posts (similar to cms_content)
- [ ] Add language selector to desktop navbar (currently only footer)

### P3
- [ ] Real App Store / Play Store links
- [ ] Admin: split AdminPage.jsx (~2100 lines) into separate modules
