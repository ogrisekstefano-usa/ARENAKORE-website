/**
 * ArenaKore CMS Global Content — GUARANTEED CONTENT
 *
 * Priority chain (NEVER returns empty):
 *   1. CMS API (lang) — merged with FALLBACK_GLOBAL
 *   2. CMS API (EN) — merged with FALLBACK_GLOBAL
 *   3. localStorage cache
 *   4. FALLBACK_GLOBAL (static EN)
 *   5. i18n translation (_deprecated)
 */
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FALLBACK_GLOBAL } from '../content/fallbackContent';

const API = process.env.REACT_APP_BACKEND_URL + '/api';

const _globalCache = {};

// localStorage helpers
const LS_GLOBAL = 'ak_cms_global';
function lsGet(key) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; } catch { return null; }
}
function lsSet(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
}

export function useGlobalContent(language = 'en') {
  const lang = (language || 'en').slice(0, 2);

  // Initialize with fallback — instant content, no flash
  const [data, setData]     = useState(FALLBACK_GLOBAL);
  const [enData, setEnData] = useState(FALLBACK_GLOBAL);
  const [loaded, setLoaded] = useState(false);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const cacheKey = `global:${lang}`;
    const enKey    = `global:en`;

    const fetchLang = !_globalCache[cacheKey]
      ? axios.get(`${API}/cms/global?lang=${lang}`)
          .then(r => {
            const d = r.data || {};
            // Merge on top of fallback so all keys always have a value
            _globalCache[cacheKey] = { ...FALLBACK_GLOBAL, ...d };
            if (Object.keys(d).length > 0) lsSet(`${LS_GLOBAL}_${lang}`, d);
          })
          .catch(() => {
            const cached = lsGet(`${LS_GLOBAL}_${lang}`);
            _globalCache[cacheKey] = { ...FALLBACK_GLOBAL, ...(cached || {}) };
            console.warn('[CMS OFFLINE] global → using', cached ? 'localStorage' : 'fallbackContent');
          })
      : Promise.resolve();

    const fetchEn = (lang !== 'en' && !_globalCache[enKey])
      ? axios.get(`${API}/cms/global?lang=en`)
          .then(r => {
            const d = r.data || {};
            _globalCache[enKey] = { ...FALLBACK_GLOBAL, ...d };
            if (Object.keys(d).length > 0) lsSet(`${LS_GLOBAL}_en`, d);
          })
          .catch(() => {
            const cached = lsGet(`${LS_GLOBAL}_en`);
            _globalCache[enKey] = { ...FALLBACK_GLOBAL, ...(cached || {}) };
          })
      : Promise.resolve();

    Promise.all([fetchLang, fetchEn]).then(() => {
      setData(_globalCache[cacheKey] || FALLBACK_GLOBAL);
      setEnData(lang === 'en' ? (_globalCache[cacheKey] || FALLBACK_GLOBAL) : (_globalCache[enKey] || FALLBACK_GLOBAL));
      setOffline(!_globalCache[cacheKey] || Object.keys(_globalCache[cacheKey]).length === 0);
      setLoaded(true);
    });
  }, [lang]);

  /**
   * GUARANTEED global content — NEVER returns empty
   */
  const global = useCallback((key, _deprecated) => {
    // 1. CMS (lang) — already merged with fallback
    if (data[key] != null && data[key] !== '') return data[key];

    // 2. CMS (EN)
    if (enData[key] != null && enData[key] !== '') return enData[key];

    // 3. Direct fallback
    if (FALLBACK_GLOBAL[key] != null && FALLBACK_GLOBAL[key] !== '') return FALLBACK_GLOBAL[key];

    // 4. i18n
    if (_deprecated != null && _deprecated !== '') return _deprecated;

    if (process.env.NODE_ENV !== 'production') {
      console.error(`[CMS GLOBAL MISSING] ${key} — add to FALLBACK_GLOBAL`);
    }
    return '';
  }, [data, enData]);

  return { global, loaded, rawGlobal: data, offline };
}

export async function prefetchGlobalContent(language = 'en') {
  const lang = (language || 'en').slice(0, 2);
  const key  = `global:${lang}`;
  if (_globalCache[key]) return _globalCache[key];
  try {
    const r = await axios.get(`${API}/cms/global?lang=${lang}`);
    _globalCache[key] = { ...FALLBACK_GLOBAL, ...(r.data || {}) };
    return _globalCache[key];
  } catch {
    try {
      const cached = localStorage.getItem(`${LS_GLOBAL}_${lang}`);
      _globalCache[key] = { ...FALLBACK_GLOBAL, ...(cached ? JSON.parse(cached) : {}) };
    } catch {
      _globalCache[key] = { ...FALLBACK_GLOBAL };
    }
    return _globalCache[key];
  }
}
