/**
 * ARENAKORE — Single Source of Truth for all internal routes.
 * Import ROUTES everywhere instead of hardcoding paths.
 *
 * Usage:
 *   import { ROUTES } from '../config/routes';
 *   <Link to={ROUTES.gyms}>For Gyms & Coaches</Link>
 */

export const ROUTES = {
  home:         '/',
  arenaSystem:  '/arena-system',
  athletes:     '/for-athletes',
  competition:  '/competition',
  amrap:        '/amrap',
  crossfit:     '/crossfit',
  gamification: '/gamification',
  gyms:         '/for-gyms-and-coaches',
  blog:         '/blog',
  app:          '/get-the-app',
  support:      '/support',
  login:        '/login',
  admin:        '/admin',

  // Feature pages
  arenaMatches: '/arena-matches',

  // SEO-only pages (not in main nav, kept for backlinks/SEO juice)
  fitnessApp:   '/fitness-challenge-app',
};

/**
 * Canonical nav items for navbar + footer.
 * Each entry: { key, i18nKey, cmsKey, route }
 */
export const NAV_ITEMS = [
  { key: 'home',         i18nKey: 'nav.home',           cmsKey: 'nav_home',         route: ROUTES.home         },
  { key: 'arenaSystem',  i18nKey: 'nav.arenaSystem',    cmsKey: 'nav_arena_system',  route: ROUTES.arenaSystem  },
  { key: 'athletes',     i18nKey: 'nav.athletes',       cmsKey: 'nav_athletes',      route: ROUTES.athletes,    highlight: true },
  { key: 'competition',  i18nKey: 'nav.competition',    cmsKey: 'nav_competition',   route: ROUTES.competition  },
  { key: 'amrap',        i18nKey: 'nav.amrap',          cmsKey: 'nav_amrap',         route: ROUTES.amrap        },
  { key: 'crossfit',     i18nKey: 'nav.crossfit',       cmsKey: 'nav_crossfit',      route: ROUTES.crossfit     },
  { key: 'gamification', i18nKey: 'nav.gamification',   cmsKey: 'nav_gamification',  route: ROUTES.gamification },
  { key: 'gyms',         i18nKey: 'nav.business',       cmsKey: 'nav_business',      route: ROUTES.gyms         },
  { key: 'blog',         i18nKey: 'nav.blog',           cmsKey: 'nav_blog',          route: ROUTES.blog         },
];

/**
 * Redirect map: old route → new canonical route.
 * Used in App.js to set up <Navigate> redirects.
 */
export const REDIRECTS = {
  '/workout-competition':  ROUTES.competition,
  '/amrap-training':       ROUTES.amrap,
  '/crossfit-challenge':   ROUTES.crossfit,
  '/fitness-gamification': ROUTES.gamification,
  '/gym-challenge-pilot':  ROUTES.gyms,
  '/for-gyms':             ROUTES.gyms,
  '/competition-system':   ROUTES.arenaSystem,
};
