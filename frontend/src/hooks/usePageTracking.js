import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../utils/tracking';

const PAGE_NAMES = {
  '/':                    'home',
  '/arena-system':        'arena_system',
  '/for-athletes':        'for_athletes',
  '/workout-competition': 'competition',
  '/amrap-training':      'amrap',
  '/crossfit-challenge':  'crossfit',
  '/for-gyms':            'for_gyms',
  '/gym-challenge-pilot': 'gym_pilot',
  '/get-the-app':         'get_the_app',
  '/blog':                'blog',
  '/support':             'support',
  '/for-athletes':        'for_athletes',
};

export function usePageTracking() {
  const { pathname } = useLocation();

  useEffect(() => {
    const page_name = PAGE_NAMES[pathname]
      || (pathname.startsWith('/blog/') ? `blog_article` : pathname.replace('/', '').replace(/-/g, '_'));

    // Small delay to ensure page title has updated
    const timer = setTimeout(() => {
      trackPageView({ page_name });
    }, 150);

    return () => clearTimeout(timer);
  }, [pathname]);
}
