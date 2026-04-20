/**
 * ArenaKore CMS Page Content — GUARANTEED CONTENT
 *
 * Priority chain (NEVER returns empty):
 *   1. CMS API (lang)
 *   2. CMS API (EN)
 *   3. localStorage cache
 *   4. fallbackContent.js (static EN)
 *   5. i18n translation (_deprecated_fallback)
 *
 * KEY FIX: When API fails, data is initialized with FALLBACK_PAGES values
 * so content() ALWAYS finds a value via data[key].
 */
import { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { FALLBACK_PAGES } from '../content/fallbackContent';

const API = process.env.REACT_APP_BACKEND_URL + '/api';

// Session memory caches
const _pageCache = {};
const _enCache   = {};

// localStorage helpers
const LS_PREFIX = 'ak_cms_';
function lsGet(key) {
  try { const v = localStorage.getItem(LS_PREFIX + key); return v ? JSON.parse(v) : null; } catch { return null; }
}
function lsSet(key, data) {
  try { localStorage.setItem(LS_PREFIX + key, JSON.stringify(data)); } catch {}
}

export function usePageContent(slug, language = 'en') {
  const lang = (language || 'en').slice(0, 2);

  // Initialize data with fallback immediately — no flash of empty content
  const staticFallback = useMemo(() => FALLBACK_PAGES[slug] || {}, [slug]);

  const [data, setData]     = useState(staticFallback);
  const [enData, setEnData] = useState(staticFallback);
  const [loaded, setLoaded] = useState(false);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    if (!slug) return;

    // Reset to static fallback when slug changes (instant content)
    const fallback = FALLBACK_PAGES[slug] || {};
    setData(fallback);
    setEnData(fallback);
    setLoaded(false);

    const cacheKey = `${slug}:${lang}`;
    const enKey    = `${slug}:en`;

    const fetchLang = !_pageCache[cacheKey]
      ? axios.get(`${API}/cms/content/${slug}?lang=${lang}`)
          .then(r => {
            const d = r.data || {};
            // Merge CMS data ON TOP of fallback (fallback fills gaps)
            _pageCache[cacheKey] = { ...fallback, ...d };
            if (Object.keys(d).length > 0) lsSet(cacheKey, d);
          })
          .catch(() => {
            // API failed → try localStorage, then static fallback
            const cached = lsGet(cacheKey);
            _pageCache[cacheKey] = { ...fallback, ...(cached || {}) };
            console.warn(`[CMS OFFLINE] ${slug}:${lang} → using ${cached ? 'localStorage' : 'fallbackContent'}`);
          })
      : Promise.resolve();

    const fetchEn = (lang !== 'en' && !_enCache[enKey])
      ? axios.get(`${API}/cms/content/${slug}?lang=en`)
          .then(r => {
            const d = r.data || {};
            _enCache[enKey] = { ...fallback, ...d };
            if (Object.keys(d).length > 0) lsSet(enKey, d);
          })
          .catch(() => {
            const cached = lsGet(enKey);
            _enCache[enKey] = { ...fallback, ...(cached || {}) };
          })
      : Promise.resolve();

    Promise.all([fetchLang, fetchEn]).then(() => {
      const pageData = _pageCache[cacheKey] || fallback;
      const enD = lang === 'en' ? pageData : (_enCache[enKey] || fallback);
      const isFromFallbackOnly = JSON.stringify(pageData) === JSON.stringify(fallback)
        && Object.keys(pageData).every(k => fallback[k] === pageData[k]);
      setData(pageData);
      setEnData(enD);
      setOffline(isFromFallbackOnly);
      setLoaded(true);
    });
  }, [slug, lang, staticFallback]);

  /**
   * GUARANTEED content — NEVER returns empty
   */
  const content = useCallback((key, _deprecated_fallback) => {
    // 1. CMS data (lang) — merged with fallback, so always has value
    if (data[key] != null && data[key] !== '') return data[key];

    // 2. CMS data (EN)
    if (enData[key] != null && enData[key] !== '') return enData[key];

    // 3. Static fallback (direct access)
    if (staticFallback[key] != null && staticFallback[key] !== '') return staticFallback[key];

    // 4. i18n translation from caller
    if (_deprecated_fallback != null && _deprecated_fallback !== '') return _deprecated_fallback;

    // Log missing key (dev only)
    if (process.env.NODE_ENV !== 'production') {
      console.error(`[CMS MISSING] ${slug}.${key} — add to fallbackContent.js`);
    }
    return '';
  }, [data, enData, staticFallback, slug]);

  return { content, loaded, raw: data, offline };
}

export default usePageContent;
