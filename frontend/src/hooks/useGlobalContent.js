/**
 * ArenaKore CMS Global Content — STRICT MODE
 * Chain: CMS(lang) → CMS(EN) → "" (never hardcoded fallback in production)
 * DEV: console.error for missing keys
 */
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API    = process.env.REACT_APP_BACKEND_URL + '/api';
const IS_DEV = process.env.NODE_ENV !== 'production';

const _globalCache = {};

export function useGlobalContent(language = 'en') {
  const [data, setData]     = useState({});
  const [enData, setEnData] = useState({});
  const [loaded, setLoaded] = useState(false);
  const lang = (language || 'en').slice(0, 2);

  useEffect(() => {
    const cacheKey = `global:${lang}`;
    const enKey    = `global:en`;

    const fetchLang = !_globalCache[cacheKey]
      ? axios.get(`${API}/cms/global?lang=${lang}`)
          .then(r => { _globalCache[cacheKey] = r.data || {}; })
          .catch(() => { _globalCache[cacheKey] = {}; })
      : Promise.resolve();

    const fetchEn = (lang !== 'en' && !_globalCache[enKey])
      ? axios.get(`${API}/cms/global?lang=en`)
          .then(r => { _globalCache[enKey] = r.data || {}; })
          .catch(() => { _globalCache[enKey] = {}; })
      : Promise.resolve();

    Promise.all([fetchLang, fetchEn]).then(() => {
      setData(_globalCache[cacheKey] || {});
      setEnData(lang === 'en' ? (_globalCache[cacheKey] || {}) : (_globalCache[enKey] || {}));
      setLoaded(true);
    });
  }, [lang]);

  /**
   * STRICT: CMS(lang) → CMS(EN) → ""
   * @param {string} key
   * @param {string} [_deprecated] - API compat only, ignored in prod
   */
  const global = useCallback((key, _deprecated) => {
    if (!loaded) return '';

    if (data[key] != null && data[key] !== '') return data[key];

    if (enData[key] != null && enData[key] !== '') {
      if (IS_DEV && lang !== 'en') {
        console.error(`[CMS Global] MISSING "${key}" for "${lang}" → EN fallback`);
      }
      return enData[key];
    }

    if (IS_DEV) {
      console.error(`[CMS Global STRICT] "${key}" NOT IN CMS for "${lang}"`);
    }
    return IS_DEV ? (_deprecated || '') : '';
  }, [data, enData, loaded, lang]);

  return { global, loaded, rawGlobal: data };
}

export async function prefetchGlobalContent(language = 'en') {
  const lang = (language || 'en').slice(0, 2);
  const key  = `global:${lang}`;
  if (_globalCache[key]) return _globalCache[key];
  try {
    const r = await axios.get(`${API}/cms/global?lang=${lang}`);
    _globalCache[key] = r.data || {};
    return _globalCache[key];
  } catch {
    _globalCache[key] = {};
    return {};
  }
}
