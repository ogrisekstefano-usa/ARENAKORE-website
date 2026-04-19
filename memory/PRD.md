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

## Multi-Page SEO Website Structure (Added April 2026)
- **/** — Home (LandingPage.jsx)
- **/fitness-challenge-app** — Fitness Challenge App page
- **/crossfit-challenge** — CrossFit Challenge & Box vs Box
- **/workout-competition** — Workout Competition Platform
- **/amrap-training** — AMRAP Training Tracker
- **/fitness-gamification** — Fitness Gamification (+40% retention data)
- **/for-gyms** — For Gyms & CrossFit Boxes (14-day pilot)
- **/blog** — Blog with 5 articles
- **/blog/:slug** — Individual article pages
- **/support** — Support page

## SEO Data
- Each page has unique SEO title (≤60 chars), meta description (≤155 chars)
- H1, structured sections, FAQs, internal links, keywords
- Managed via `src/data/seo-content.js`
- All meta tags updated dynamically via useSEO hook
1. **Navbar** — Fixed, backdrop-blur on scroll, Logo ARENAKORE (ARENA white + KORE cyan) + ACCEDI button
2. **Hero** — Fullscreen background (hooded founder figure) con overlay 72%, badge NÈXUS, H1, 2 CTA buttons 56px (INIZIA COME ATLETA cyan + SEI UN PRO? ENTRA QUI gold), scroll indicator
3. **Stats Strip** — 4 animated counters: Kore Attivi, K-Rating Max, K-Flux Record, Discipline
4. **KORE ID** — Two-column layout: text + feature list + CTA, phone mockup right
5. **App Preview** — 4 phone screenshots in alternating heights layout
6. **Sistema NÈXUS** (id="nexus") — 4-card grid: K-RATING, K-TIMELINE, K-SCAN, DNA UNIVERSALE (cyan top borders)
7. **DNA Universale** — Recharts RadarChart (VEL/FOR/RES/AGI/TEC/POT) + attribute progress bars
8. **ARENA Competitiva** (id="arena") — Athletes background + "L'ELITE SI CONFRONTA" + gold feature cards + SFIDA DNA
9. **Business** (id="business") — PER COACH E PALESTRE, 4 gold cards (CREA SFIDE, GESTISCI ATLETI, ANALYTICS, HUB UFFICIALE), stats 50+/1K+/15+
10. **Download CTA** — "ENTRA NELL'ARENA" + App Store/Google Play buttons
11. **Footer** — Watermark logo + 4-column links + "SISTEMA ATTIVO" live indicator

## Text Color System
- Primary: `#FFFFFF` (headings)
- Secondary: `#E0E0E0` Grigio Ghiaccio (descriptions, body)
- Technical: `#00FFFF` (numbers, data)
- Gold: `#FFD700` (business/arena accents)
- No opacity-based text colors anywhere

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
