/**
 * ArenaKore CMS Page Content — STRICT PRODUCTION SYSTEM
 * 
 * Chain: CMS(lang) → CMS(EN) → "" (never another language, never hardcoded fallback)
 * 
 * In DEV: console.error for missing keys
 * In PROD: silent empty string
 * 
 * EN is the ONLY base language.
 * All new content MUST start in EN.
 */
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API    = process.env.REACT_APP_BACKEND_URL + '/api';
const IS_DEV = process.env.NODE_ENV !== 'production';

// Page content cache (session)
const _pageCache = {};
const _enCache   = {};

export function usePageContent(slug, language = 'en') {
  const [data, setData]     = useState({});
  const [enData, setEnData] = useState({});
  const [loaded, setLoaded] = useState(false);
  const lang = (language || 'en').slice(0, 2);

  useEffect(() => {
    if (!slug) return;
    const cacheKey = `${slug}:${lang}`;
    const enKey    = `${slug}:en`;

    const fetchLang = !_pageCache[cacheKey]
      ? axios.get(`${API}/cms/content/${slug}?lang=${lang}`)
          .then(r => { _pageCache[cacheKey] = r.data || {}; })
          .catch(() => { _pageCache[cacheKey] = {}; })
      : Promise.resolve();

    const fetchEn = (lang !== 'en' && !_enCache[enKey])
      ? axios.get(`${API}/cms/content/${slug}?lang=en`)
          .then(r => {
            _enCache[enKey] = r.data || {};
            // Log usage
            const keys = Object.keys(r.data || {});
            if (keys.length > 0) {
              axios.post(`${API}/cms/usage`, { slug, lang: 'en', keys, url: window.location.pathname })
                .catch(() => {});
            }
          })
          .catch(() => { _enCache[enKey] = {}; })
      : Promise.resolve();

    Promise.all([fetchLang, fetchEn]).then(() => {
      const pageData = _pageCache[cacheKey] || {};
      const enD = lang === 'en' ? pageData : (_enCache[enKey] || {});
      setData(pageData);
      setEnData(enD);
      setLoaded(true);
      // Log usage for requested language
      if (lang !== 'en') {
        const keys = Object.keys(pageData);
        if (keys.length > 0) {
          axios.post(`${API}/cms/usage`, { slug, lang, keys, url: window.location.pathname })
            .catch(() => {});
        }
      }
    });
  }, [slug, lang]);

  /**
   * Get content — STRICT chain: lang → EN → ""
   * @param {string} key
   * @param {string} [_deprecated_fallback] - IGNORED in strict mode, kept for API compat
   */
  const content = useCallback((key, _deprecated_fallback) => {
    if (!loaded) return '';

    // 1. Preferred language from CMS
    if (data[key] != null && data[key] !== '') return data[key];

    // 2. EN fallback (same language family, only if different lang requested)
    if (enData[key] != null && enData[key] !== '') {
      if (IS_DEV && lang !== 'en') {
        console.error(`[CMS] MISSING "${key}" for lang "${lang}" → showing EN`);
      }
      return enData[key];
    }

    // 3. Nothing found
    if (IS_DEV) {
      console.error(`[CMS STRICT] "${slug}.${key}" NOT IN CMS — key missing for "${lang}"`);
    }
    // Return deprecated fallback only in dev to avoid breaking existing pages during migration
    return IS_DEV ? (_deprecated_fallback || '') : '';
  }, [data, enData, loaded, lang, slug]);

  return { content, loaded, raw: data };
}

export default usePageContent;
