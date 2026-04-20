/**
 * ArenaKore — Navigation Config Hook
 * Fetches top/bottom nav configuration from the CMS backend.
 * Falls back to static NAV_ITEMS when API is unavailable.
 */
import { useState, useEffect } from 'react';
import axios from 'axios';
import { NAV_ITEMS, ROUTES } from '../config/routes';

const API = process.env.REACT_APP_BACKEND_URL + '/api';

// Session cache
let _navCache = null;
let _navFailed = false;

// Static fallback top nav (mirrors DEFAULT_TOP_NAV from backend)
const FALLBACK_TOP_NAV = NAV_ITEMS.map((item, i) => ({
  key:    item.key,
  href:   item.route,
  labels: {},  // resolved via i18n in SharedLayout
  active: true,
  order:  i,
}));

// Static fallback bottom nav
const FALLBACK_BOTTOM_NAV = [
  ...NAV_ITEMS.map((item, i) => ({ key: item.key, href: item.route, labels: {}, active: true, order: i })),
  { key: 'fitnessApp', href: ROUTES.fitnessApp, labels: { en: 'Fitness Challenge App', it: 'Fitness Challenge App', es: 'Fitness Challenge App' }, active: true, order: NAV_ITEMS.length },
  { key: 'app',        href: ROUTES.app,        labels: { en: 'Get the App', it: 'Scarica App', es: 'Descargar App' },                              active: true, order: NAV_ITEMS.length + 1 },
];

export function useNavConfig() {
  const [topNav, setTopNav]     = useState(FALLBACK_TOP_NAV);
  const [bottomNav, setBottomNav] = useState(FALLBACK_BOTTOM_NAV);
  const [loaded, setLoaded]     = useState(false);
  const [offline, setOffline]   = useState(false);

  useEffect(() => {
    if (_navCache) {
      setTopNav(_navCache.top_nav || FALLBACK_TOP_NAV);
      setBottomNav(_navCache.bottom_nav || FALLBACK_BOTTOM_NAV);
      setOffline(_navFailed);
      setLoaded(true);
      return;
    }

    axios.get(`${API}/nav/config`)
      .then(r => {
        _navCache = r.data;
        _navFailed = false;
        setTopNav(r.data.top_nav || FALLBACK_TOP_NAV);
        setBottomNav(r.data.bottom_nav || FALLBACK_BOTTOM_NAV);
      })
      .catch(() => {
        _navFailed = true;
        setTopNav(FALLBACK_TOP_NAV);
        setBottomNav(FALLBACK_BOTTOM_NAV);
      })
      .finally(() => { setLoaded(true); setOffline(_navFailed); });
  }, []);

  /** Invalidate cache (call after saving nav config in admin) */
  const invalidate = () => { _navCache = null; };

  return { topNav, bottomNav, loaded, offline, invalidate };
}

export default useNavConfig;
