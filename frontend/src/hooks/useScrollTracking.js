import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackScrollDepth } from '../utils/tracking';

export function useScrollTracking(page_name) {
  const { pathname } = useLocation();
  const fired = useRef({ 50: false, 90: false });

  useEffect(() => {
    // Reset on route change
    fired.current = { 50: false, 90: false };

    const handleScroll = () => {
      const scrollTop    = window.scrollY;
      const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const pct = Math.round((scrollTop / docHeight) * 100);

      if (!fired.current[50] && pct >= 50) {
        fired.current[50] = true;
        trackScrollDepth(50, page_name || pathname);
      }
      if (!fired.current[90] && pct >= 90) {
        fired.current[90] = true;
        trackScrollDepth(90, page_name || pathname);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname, page_name]);
}
