import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../utils/tracking';
import { ROUTES } from '../config/routes';

const PAGE_NAMES = {
  [ROUTES.home]:         'home',
  [ROUTES.arenaSystem]:  'arena_system',
  [ROUTES.athletes]:     'for_athletes',
  [ROUTES.competition]:  'competition',
  [ROUTES.amrap]:        'amrap',
  [ROUTES.crossfit]:     'crossfit',
  [ROUTES.gamification]: 'gamification',
  [ROUTES.gyms]:         'for_gyms_coaches',
  [ROUTES.app]:          'get_the_app',
  [ROUTES.blog]:         'blog',
  [ROUTES.support]:      'support',
  [ROUTES.fitnessApp]:   'fitness_challenge_app',
  // Legacy routes (still tracked for analytics continuity)
  '/workout-competition': 'competition',
  '/amrap-training':      'amrap',
  '/crossfit-challenge':  'crossfit',
  '/gym-challenge-pilot': 'for_gyms_coaches',
  '/fitness-gamification':'gamification',
  '/for-gyms':            'for_gyms_coaches',
};

export function usePageTracking() {
  const { pathname } = useLocation();

  useEffect(() => {
    const page_name = PAGE_NAMES[pathname]
      || (pathname.startsWith('/blog/') ? 'blog_article' : pathname.replace('/', '').replace(/-/g, '_'));

    const timer = setTimeout(() => {
      trackPageView({ page_name });
    }, 150);

    return () => clearTimeout(timer);
  }, [pathname]);
}
