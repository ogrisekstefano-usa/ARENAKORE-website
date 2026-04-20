/**
 * ArenaKore CMS Page Content — OFFLINE-SAFE with localStorage cache
 *
 * Chain: CMS(lang) → CMS(EN) → localStorage cache → fallbackContent → _deprecated_fallback → ""
 *
 * On success: saves to localStorage
 * If backend is DOWN: uses localStorage → then fallbackContent
 * Frontend NEVER renders empty text.
 */
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FALLBACK_PAGES } from '../content/fallbackContent';

const API = process.env.REACT_APP_BACKEND_URL + '/api';

// Session memory caches (fast, cleared on reload)
const _pageCache = {};
const _enCache   = {};
// Track failed slugs
const _failedSlugs = new Set();

// localStorage helpers
const LS_PREFIX = 'ak_cms_';
function lsGet(key) {
  try { const v = localStorage.getItem(LS_PREFIX + key); return v ? JSON.parse(v) : null; } catch { return null; }
}
function lsSet(key, data) {
  try { localStorage.setItem(LS_PREFIX + key, JSON.stringify(data)); } catch {}
}

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
          .then(r => {
            const d = r.data || {};
            _pageCache[cacheKey] = d;
            _failedSlugs.delete(slug);
            // Persist to localStorage on success
            if (Object.keys(d).length > 0) lsSet(cacheKey, d);
          })
          .catch(() => {
            // Try localStorage cache first
            const cached = lsGet(cacheKey);
            _pageCache[cacheKey] = cached || {};
            _failedSlugs.add(slug);
            if (cached) console.warn(`[CMS OFFLINE → localStorage cache active] ${slug}:${lang}`);
            else console.warn(`[CMS OFFLINE → fallbackContent active] ${slug}:${lang}`);
          })
      : Promise.resolve();

    const fetchEn = (lang !== 'en' && !_enCache[enKey])
      ? axios.get(`${API}/cms/content/${slug}?lang=en`)
          .then(r => {
            const d = r.data || {};
            _enCache[enKey] = d;
            if (Object.keys(d).length > 0) lsSet(enKey, d);
            const keys = Object.keys(d);
            if (keys.length > 0) {
              axios.post(`${API}/cms/usage`, { slug, lang: 'en', keys, url: window.location.pathname }).catch(() => {});
            }
          })
          .catch(() => {
            const cached = lsGet(enKey);
            _enCache[enKey] = cached || {};
          })
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
   * Get content — chain:
   * 1. CMS(lang)
   * 2. CMS(EN) 
   * 3. fallbackContent[slug][key]
   * 4. _deprecated_fallback (i18n translation from caller)
   * 5. "" (never reached if fallbackContent is complete)
   */
  const content = useCallback((key, _deprecated_fallback) => {
    // During initial load: immediately show i18n fallback or fallbackContent
    if (!loaded) {
      return _deprecated_fallback
        || FALLBACK_PAGES[slug]?.[key]
        || '';
    }

    // 1. Preferred language from CMS
    if (data[key] != null && data[key] !== '') return data[key];

    // 2. EN from CMS (cross-language fallback)
    if (enData[key] != null && enData[key] !== '') return enData[key];

    // 3. Static fallback from fallbackContent.js
    const fbPage = FALLBACK_PAGES[slug];
    if (fbPage?.[key] != null && fbPage[key] !== '') return fbPage[key];

    // 4. Deprecated i18n param from caller (cms('key', t('i18n.key')))
    if (_deprecated_fallback != null && _deprecated_fallback !== '') return _deprecated_fallback;

    // 5. Should never reach here — log missing key
    if (process.env.NODE_ENV !== 'production') {
      console.error(`[CMS MISSING KEY] ${slug}.${key}`);
    }
    return '';
  }, [data, enData, loaded, slug]);

  return { content, loaded, raw: data, offline };
}

export default usePageContent;
