# ARENAKORE Landing Page — PRD

## Overview
Sito web ufficiale ARENAKORE (www.arenakore.com). Landing page Cyber-Brutalist per l'app sportiva di identità atletica digitale.

## Date
- Created: 2026-04-14
- Last updated: 2026-04-14

## Architecture
- **Frontend**: React 19 (serving as the landing page via `LandingPage.jsx`)
- **Backend**: FastAPI (not used for landing page)
- **Database**: MongoDB (not used for landing page)
- **Standalone file**: `public/arenakore.html` — HTML5 + Tailwind CDN (for deployment on www.arenakore.com)

## Visual Identity
- **Background**: OLED Black (#000)
- **Primary Cyan**: #00FFFF (Atleti / NÈXUS)
- **Gold**: #FFD700 (Business / Sfide / Arena)
- **White**: #FFFFFF only
- **Style**: Cyber-Brutalist, tecnico, pulito
- **Fonts**: Anton (headings) + IBM Plex Mono (body/mono)
- **Buttons**: border-radius 14px, generous height

## Sections Implemented
1. **Navbar** — Fixed, backdrop-blur on scroll, Logo ARENAKORE (ARENA white + KORE cyan) + ACCEDI button
2. **Hero** — Fullscreen background (hooded founder figure) with rgba(0,0,0,0.72) overlay, "SISTEMA NÈXUS · ONLINE" badge, H1 headline, 2 CTA buttons (SCARICA APP cyan + ARENA BUSINESS gold), scroll indicator
3. **Stats Strip** — 4 animated counters: Kore Attivi, K-Rating Max, K-Flux Record, Discipline
4. **KORE ID** — Two-column layout: text + feature list + CTA, phone mockup right
5. **App Preview** — 4 phone screenshots in alternating heights layout
6. **Sistema NÈXUS** — 4-card grid: K-RATING, K-TIMELINE, K-SCAN, DNA UNIVERSALE (cyan top borders)
7. **DNA Universale** — Recharts RadarChart (VEL/FOR/RES/AGI/TEC/POT) + attribute progress bars
8. **ARENA Competitiva** — Athletes background + "L'ELITE SI CONFRONTA" + gold feature cards
9. **Download CTA** — "ENTRA NELL'ARENA" + App Store/Google Play buttons
10. **Footer** — Watermark logo + 4-column links + "SISTEMA ATTIVO" live indicator

## Files
- `/app/frontend/src/LandingPage.jsx` — Main React landing page
- `/app/frontend/src/App.js` — Simple wrapper
- `/app/frontend/src/App.css` — Animations & custom effects (glow, reveal, bounce)
- `/app/frontend/tailwind.config.js` — Extended with ak-cyan, ak-gold, font-anton, font-ibm-mono
- `/app/frontend/public/arenakore.html` — **STANDALONE HTML5 file for deployment**

## Backlog (P1)
- [ ] Replace AI-generated hero image with actual founder photo (high-res)
- [ ] Add App Store / Google Play real links
- [ ] Add ARENA BUSINESS landing page link
- [ ] Add ACCEDI link to app URL
- [ ] SEO meta tags, OG tags, Twitter Card
- [ ] Cookie consent banner
- [ ] Contact form or newsletter signup
- [ ] Performance: lazy-load images

## P2 Features
- [ ] Animated counter with smooth easing (requestAnimationFrame)
- [ ] Video background option for hero
- [ ] Testimonials section with athlete quotes
- [ ] Blog/news section
- [ ] Multi-language support (IT/EN)
