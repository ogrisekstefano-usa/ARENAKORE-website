/**
 * ArenaKore CMS Global Content — OFFLINE-SAFE
 *
 * Chain: CMS(lang) → CMS(EN) → FALLBACK_GLOBAL → _deprecated → ""
 *
 * If backend is down → FALLBACK_GLOBAL provides navbar/footer content.
 */
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FALLBACK_GLOBAL } from '../content/fallbackContent';

const API = process.env.REACT_APP_BACKEND_URL + '/api';

const _globalCache = {};
let _globalFailed  = false;

export function useGlobalContent(language = 'en') {
  const [data, setData]       = useState({});
  const [enData, setEnData]   = useState({});
  const [loaded, setLoaded]   = useState(false);
  const [offline, setOffline] = useState(false);
  const lang = (language || 'en').slice(0, 2);

  useEffect(() => {
    const cacheKey = `global:${lang}`;
    const enKey    = `global:en`;

    const fetchLang = !_globalCache[cacheKey]
      ? axios.get(`${API}/cms/global?lang=${lang}`)
          .then(r => { _globalCache[cacheKey] = r.data || {}; _globalFailed = false; })
          .catch(() => { _globalCache[cacheKey] = {}; _globalFailed = true; })
      : Promise.resolve();

    const fetchEn = (lang !== 'en' && !_globalCache[enKey])
      ? axios.get(`${API}/cms/global?lang=en`)
          .then(r => { _globalCache[enKey] = r.data || {}; })
          .catch(() => { _globalCache[enKey] = {}; })
      : Promise.resolve();

    Promise.all([fetchLang, fetchEn]).then(() => {
      setData(_globalCache[cacheKey] || {});
      setEnData(lang === 'en' ? (_globalCache[cacheKey] || {}) : (_globalCache[enKey] || {}));
      setOffline(_globalFailed);
      setLoaded(true);
    });
  }, [lang]);

  /**
   * Chain: CMS(lang) → CMS(EN) → FALLBACK_GLOBAL → _deprecated → ""
   */
  const global = useCallback((key, _deprecated) => {
    if (!loaded) return _deprecated || FALLBACK_GLOBAL[key] || '';

    if (data[key] != null && data[key] !== '') return data[key];

    if (enData[key] != null && enData[key] !== '') return enData[key];

    // 3. Static fallback
    if (FALLBACK_GLOBAL[key] != null && FALLBACK_GLOBAL[key] !== '') return FALLBACK_GLOBAL[key];

    // 4. Deprecated parameter
    if (_deprecated != null && _deprecated !== '') return _deprecated;

    return '';
  }, [data, enData, loaded]);

  return { global, loaded, rawGlobal: data, offline };
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
    return _globalCache[key];
  }
}
