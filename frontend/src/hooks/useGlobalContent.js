/**
 * ArenaKore CMS Global Content Hook
 * 
 * Fetches global UI content (navbar, footer, CTAs) from CMS.
 * EN is the base language and always used as fallback.
 * 
 * Usage:
 *   const { global: g } = useGlobalContent(language);
 *   const navHome = g('nav_home', 'Home');  // fallback = 'Home'
 */
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_BACKEND_URL + '/api';
const IS_DEV = process.env.NODE_ENV !== 'production';

// Global content cache
const _globalCache = {};

export function useGlobalContent(language = 'en') {
  const [data, setData]     = useState({});
  const [loaded, setLoaded] = useState(false);
  const lang = language?.slice(0, 2) || 'en';

  useEffect(() => {
    const cacheKey = `global:${lang}`;
    if (_globalCache[cacheKey]) {
      setData(_globalCache[cacheKey]);
      setLoaded(true);
      return;
    }
    axios.get(`${API}/cms/global?lang=${lang}`)
      .then(r => {
        _globalCache[cacheKey] = r.data || {};
        setData(r.data || {});
      })
      .catch(() => setData({}))
      .finally(() => setLoaded(true));
  }, [lang]);

  const global = useCallback((key, fallback = '') => {
    if (!loaded) return fallback;
    const val = data[key];
    if (!val || val === '') {
      if (IS_DEV) {
        console.warn(`[CMS Global] Missing key "${key}" for lang "${lang}" — using fallback: "${fallback}"`);
      } else {
        console.error(`[CMS] Missing global key: ${key} [${lang}]`);
      }
      return fallback;
    }
    return val;
  }, [data, loaded, lang]);

  return { global, loaded, rawGlobal: data };
}

export async function prefetchGlobalContent(language = 'en') {
  const lang = language?.slice(0, 2) || 'en';
  const cacheKey = `global:${lang}`;
  if (_globalCache[cacheKey]) return _globalCache[cacheKey];
  try {
    const r = await axios.get(`${API}/cms/global?lang=${lang}`);
    _globalCache[cacheKey] = r.data || {};
    return _globalCache[cacheKey];
  } catch {
    _globalCache[cacheKey] = {};
    return {};
  }
}
