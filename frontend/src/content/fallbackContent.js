/**
 * ARENAKORE — CMS Fallback Content
 * Used when the CMS backend is unavailable (offline mode).
 * All values are in English (EN) — the base language.
 *
 * Structure:
 *   FALLBACK_PAGES[slug][key] = value   → used by usePageContent
 *   FALLBACK_GLOBAL[key] = value        → used by useGlobalContent
 */

// ─── PAGE CONTENT ────────────────────────────────────────────────────────────

export const FALLBACK_PAGES = {

  // ── HOMEPAGE ──────────────────────────────────────────────────────────────
  homepage: {
    seo_title: 'ArenaKore — The Multi-Sport Competition Platform',
    seo_description: 'Every performance is ranked.',
    hero_badge: 'NEXUS LIVE · CHALLENGES OPEN',
    hero_h1_line1: 'The competition',
    hero_h1_line2: 'never ends.',
    hero_sub: 'Every performance is ranked.',
    cta_primary: 'Download the App',
    cta_secondary: 'For Gyms',
    positioning_badge: 'THE PLATFORM',
    positioning_h2: 'ONE SYSTEM. ANY DISCIPLINE.',
    positioning_body: 'ArenaKore is a competition platform for any performance-based activity — from fitness and CrossFit to basketball, running, swimming and beyond.',
    how_badge: 'HOW IT WORKS',
    how_h2: '4 STEPS. NO EXCUSES.',
    disciplines_badge: 'EVERY ARENA',
    disciplines_h2: 'BUILT FOR EVERY ARENA.',
    disciplines_sub: 'One ranking system. One identity. Any sport.',
    gyms_badge: 'FOR GYMS & COACHES',
    gyms_h2: 'BUILT FOR GYMS THAT WANT',
    gyms_engaged: 'ENGAGED MEMBERS.',
    gyms_body: 'The average gym loses 80% of new members within 6 months. ArenaKore gives you a competition layer that makes members come back — because now they have something to lose.',
    gyms_f1: '+40% member retention',
    gyms_f2: 'Live challenge system — no manual setup',
    gyms_f3: 'Box vs box competition across locations',
    gyms_f4: '14-day free pilot. No commitment.',
    gyms_cta: 'Start a 14-day Pilot',
  },

  // ── FOR ATHLETES ──────────────────────────────────────────────────────────
  'for-athletes': {
    hero_badge: 'FOR ATHLETES',
    hero_h1: "YOU DON'T TRAIN.",
    hero_sub: 'Enter the Arena.',
    hero_cta: 'Download the App',
    hero_tagline: 'You are not just training. You are competing.',
    final_cta: "Enter the Arena",
    identity_pretext: 'ONCE YOU ENTER, YOU ARE NO LONGER JUST AN ATHLETE.',
    identity_h2_line1: 'YOU ARE A',
    identity_h2_line2: 'KORE.',
    identity_body: 'A KORE is not a user. Not a subscriber. Not a member. A KORE is a competitor with a permanent record, a certified rank and an identity built entirely on real performance.',
    kore_badge: 'THE KORE SYSTEM',
    kore_h2: 'WHAT IT MEANS TO BE A KORE.',
    kflux_badge: 'K-FLUX',
    kflux_h2: 'EVERY ACTION GENERATES K-FLUX.',
    kflux_body: 'K-Flux is the currency of the Arena. It does not come from showing up. It comes from performing. From being consistent. From exceeding the rep you were about to skip.',
    kflux_f1: 'Training consistency — Show up 7 days in a row. K-Timeline tracks every session.',
    kflux_f2: 'Validated performance — Every rep certified by NEXUS. Every score earned, not declared.',
    kflux_f3: 'Competitive activity — Accept challenges. Win duels. Enter live events. K-Flux multiplies.',
    kflux_hud_label: 'K-FLUX EARNED TODAY',
    kflux_hud_sub: '3 sessions · 2 challenges · 1 day streak',
    nexus_badge: 'NEXUS ENGINE',
    nexus_h2: 'SCAN. TRACK. EVOLVE.',
    nexus_body: "NEXUS does not watch you train. It judges you. Puppet Motion Detection tracks every joint, every angle, every rep. A rep that doesn't meet the standard doesn't count. This is not punishment. It's truth.",
    nexus_f1: 'Biometric tracking — Joint angles, movement timing, range of motion — captured in real time.',
    nexus_f2: 'Performance data — Every session feeds your DNA profile: VEL, FOR, RES, AGI, TEC, POT.',
    nexus_f3: 'Evolution over time — Your DNA score evolves. Not on paper. In data. Visible to all.',
    challenges_badge: 'THE ARENA',
    challenges_h2: 'CHALLENGE ANYONE.',
    final_badge: 'THE FINAL CHOICE',
    final_h2: 'COMPETE OR STAY BEHIND.',
    final_body: 'Right now someone is training harder than you. They are in the Arena. Are you?',
    final_t1: 'Free to start',
    final_t2: 'Validated reps',
    final_t3: 'Earned rank',
  },

  // ── ARENA SYSTEM ──────────────────────────────────────────────────────────
  'arena-system': {
    hero_badge: 'UNIVERSAL COMPETITION SYSTEM',
    hero_h1: 'THE SYSTEM BEHIND THE COMPETITION.',
    hero_sub: 'Track performance. Rank results. Compete every day.',
    hero_sub2: 'Any sport. Any discipline. One system.',
    not_fitness_app: 'This is not a fitness app. This is a competition system.',
    what_badge: 'WHAT IT DOES',
    what_h2: 'THREE THINGS.',
    what_h2_2: 'NO COMPROMISE.',
    track_title: 'Track performance.',
    track_body: 'Every rep captured and certified by NEXUS in real-time.',
    rank_title: 'Rank every result.',
    rank_body: 'K-Rating from 0 to 1000. Updated after every session.',
    challenge_title: 'Create continuous competition.',
    challenge_body: 'New challenges every day. The Arena never closes.',
    why_badge: 'BEHAVIORAL SCIENCE',
    why_h2: 'COMPETITION CHANGES BEHAVIOR.',
    why_1: 'Visibility creates pressure.',
    why_1_body: 'When your score is public, skipping a session has a cost. Visibility is the most powerful behavioral lever in competitive sport.',
    why_2: 'Ranking creates engagement.',
    why_2_body: "Nobody ignores a leaderboard they're on. K-Rating gives every athlete a personal stake in every session.",
    why_3: 'Repetition creates consistency.',
    why_3_body: 'Daily challenges with real consequences build training habits that self-motivation alone cannot sustain.',
    sport_badge: 'THE ARENA IS EVERYWHERE',
    sport_h2: 'THE ARENA IS EVERYWHERE',
    sport_body: "ArenaKore is not built for one sport. It's built for any activity where performance can be measured, validated and compared.",
    nexus_badge: 'POWERED BY NEXUS',
    nexus_callout: 'NEXUS VALIDATES EVERY REP.',
    nexus_body: "Puppet Motion Detection. Real-time bio-analysis. Bad form doesn't count.",
    final_h2: 'ENTER THE SYSTEM.',
    final_body: 'ArenaKore is a universal competition system for any performance-based activity.',
  },

  // ── GET THE APP ───────────────────────────────────────────────────────────
  'get-the-app': {
    hero_badge: 'FREE DOWNLOAD',
    hero_h1: "ENTER THE ARENA.",
    hero_tension: 'Someone is already ahead of you.',
    hero_sub1: 'Track your performance.',
    hero_sub2: 'Get ranked. Compete.',
    available: 'Available now',
    download_time: 'Download in 10 seconds',
    free_note: 'Free · No credit card · Available everywhere',
    what_badge: 'WHAT YOU GET',
    what_h2: 'THREE THINGS.',
    what_h2_2: 'NO EXCUSES.',
    next_badge: 'THE PROCESS',
    next_title: 'What happens next',
    sport_badge: 'YOUR ARENA',
    sport_h2: 'Your sport.',
    sport_h2_line2: 'Your arena.',
    sport_body: 'ArenaKore works across any discipline. One identity. One ranking. Any sport.',
    proof_badge: 'LIVE NOW',
    proof_perf: '1,024 performances recorded today',
    proof_athletes: '28 athletes competing now',
    final_h2_line1: 'DOWNLOAD.',
    final_h2_line2: 'ENTER.',
    final_h2_line3: 'COMPETE.',
    final_body: 'The Arena is open. Your rank awaits. Every day you wait is a day someone else advances.',
    final_free: 'Free · Available everywhere',
    final_learn: 'See the Arena System',
  },

};

// ─── GLOBAL CONTENT ──────────────────────────────────────────────────────────
// Keys used by useGlobalContent (navbar, footer, global CTAs)

export const FALLBACK_GLOBAL = {
  // Navbar labels
  nav_home:         'Home',
  nav_arena_system: 'Arena System',
  nav_athletes:     'Athletes',
  nav_competition:  'Competition',
  nav_amrap:        'AMRAP',
  nav_crossfit:     'CrossFit',
  nav_business:     'Business',
  nav_blog:         'Blog',
  nav_cta:          'Start Your Challenge',

  // Footer
  footer_tagline:   'Global competition platform for athletes and gyms.',
  footer_nexus:     'NEXUS ONLINE',
  footer_copyright: '© 2026 ArenaKore. All rights reserved.',
};
