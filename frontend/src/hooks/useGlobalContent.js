/**
 * ArenaKore CMS Global Content — OFFLINE-SAFE with localStorage cache
 *
 * Chain: CMS(lang) → CMS(EN) → localStorage cache → FALLBACK_GLOBAL → _deprecated → ""
 *
 * Navbar/Footer NEVER shows blank text even when backend is down.
 */
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FALLBACK_GLOBAL } from '../content/fallbackContent';

const API = process.env.REACT_APP_BACKEND_URL + '/api';

const _globalCache = {};
let _globalFailed  = false;

// localStorage helpers
const LS_GLOBAL = 'ak_cms_global';
function lsGet(key) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; } catch { return null; }
}
function lsSet(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
}

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
          .then(r => {
            const d = r.data || {};
            _globalCache[cacheKey] = d;
            _globalFailed = false;
            if (Object.keys(d).length > 0) lsSet(`${LS_GLOBAL}_${lang}`, d);
          })
          .catch(() => {
            const cached = lsGet(`${LS_GLOBAL}_${lang}`);
            _globalCache[cacheKey] = cached || {};
            _globalFailed = true;
            console.warn('[CMS OFFLINE → global fallback active]');
          })
      : Promise.resolve();

    const fetchEn = (lang !== 'en' && !_globalCache[enKey])
      ? axios.get(`${API}/cms/global?lang=en`)
          .then(r => {
            const d = r.data || {};
            _globalCache[enKey] = d;
            if (Object.keys(d).length > 0) lsSet(`${LS_GLOBAL}_en`, d);
          })
          .catch(() => {
            const cached = lsGet(`${LS_GLOBAL}_en`);
            _globalCache[enKey] = cached || {};
          })
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
    // During initial load: show fallback immediately (no flash of empty)
    if (!loaded) {
      return _deprecated
        || FALLBACK_GLOBAL[key]
        || '';
    }

    if (data[key] != null && data[key] !== '') return data[key];

    if (enData[key] != null && enData[key] !== '') return enData[key];

    if (FALLBACK_GLOBAL[key] != null && FALLBACK_GLOBAL[key] !== '') return FALLBACK_GLOBAL[key];

    if (_deprecated != null && _deprecated !== '') return _deprecated;

    if (process.env.NODE_ENV !== 'production') {
      console.error(`[CMS MISSING GLOBAL KEY] ${key}`);
    }
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
    // Try localStorage
    try {
      const cached = localStorage.getItem(`${LS_GLOBAL}_${lang}`);
      _globalCache[key] = cached ? JSON.parse(cached) : {};
    } catch {
      _globalCache[key] = {};
    }
    return _globalCache[key];
  }
}
