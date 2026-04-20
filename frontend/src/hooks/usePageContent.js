/**
 * ArenaKore CMS Page Content — OFFLINE-SAFE
 *
 * Chain: CMS(lang) → CMS(EN) → fallbackContent → _deprecated_fallback → ""
 *
 * If backend is down:
 *   → fallbackContent.js provides full EN content
 *   → site remains fully readable
 */
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FALLBACK_PAGES } from '../content/fallbackContent';

const API = process.env.REACT_APP_BACKEND_URL + '/api';

// Session caches
const _pageCache = {};
const _enCache   = {};
// Track which slugs failed to load (API down)
const _failedSlugs = new Set();

export function usePageContent(slug, language = 'en') {
  const [data, setData]       = useState({});
  const [enData, setEnData]   = useState({});
  const [loaded, setLoaded]   = useState(false);
  const [offline, setOffline] = useState(false);
  const lang = (language || 'en').slice(0, 2);

  useEffect(() => {
    if (!slug) return;
    const cacheKey = `${slug}:${lang}`;
    const enKey    = `${slug}:en`;

    const fetchLang = !_pageCache[cacheKey]
      ? axios.get(`${API}/cms/content/${slug}?lang=${lang}`)
          .then(r => { _pageCache[cacheKey] = r.data || {}; _failedSlugs.delete(slug); })
          .catch(() => { _pageCache[cacheKey] = {}; _failedSlugs.add(slug); })
      : Promise.resolve();

    const fetchEn = (lang !== 'en' && !_enCache[enKey])
      ? axios.get(`${API}/cms/content/${slug}?lang=en`)
          .then(r => {
            _enCache[enKey] = r.data || {};
            const keys = Object.keys(r.data || {});
            if (keys.length > 0) {
              axios.post(`${API}/cms/usage`, { slug, lang: 'en', keys, url: window.location.pathname }).catch(() => {});
            }
          })
          .catch(() => { _enCache[enKey] = {}; })
      : Promise.resolve();

    Promise.all([fetchLang, fetchEn]).then(() => {
      const pageData = _pageCache[cacheKey] || {};
      const enD = lang === 'en' ? pageData : (_enCache[enKey] || {});
      setData(pageData);
      setEnData(enD);
      setOffline(_failedSlugs.has(slug));
      setLoaded(true);

      if (lang !== 'en') {
        const keys = Object.keys(pageData);
        if (keys.length > 0) {
          axios.post(`${API}/cms/usage`, { slug, lang, keys, url: window.location.pathname }).catch(() => {});
        }
      }
    });
  }, [slug, lang]);

  /**
   * Get content — chain: CMS(lang) → CMS(EN) → fallbackContent[slug][key] → _deprecated_fallback → ""
   */
  const content = useCallback((key, _deprecated_fallback) => {
    if (!loaded) return _deprecated_fallback || '';

    // 1. Preferred language from CMS
    if (data[key] != null && data[key] !== '') return data[key];

    // 2. EN from CMS
    if (enData[key] != null && enData[key] !== '') return enData[key];

    // 3. Static fallback (EN) from fallbackContent.js
    const staticFallback = FALLBACK_PAGES[slug];
    if (staticFallback && staticFallback[key] != null && staticFallback[key] !== '') {
      return staticFallback[key];
    }

    // 4. Deprecated _deprecated_fallback parameter (i18n translation passed by caller)
    if (_deprecated_fallback != null && _deprecated_fallback !== '') return _deprecated_fallback;

    return '';
  }, [data, enData, loaded, slug]);

  return { content, loaded, raw: data, offline };
}

export default usePageContent;
