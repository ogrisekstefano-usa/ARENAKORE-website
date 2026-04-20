/**
 * ArenaKore CMS Page Content Hook — STRICT MODE
 * 
 * Chain: CMS (lang) → CMS (EN fallback) → hardcoded fallback → console warning
 * 
 * EN is the base language. ALL new content starts in EN.
 * Missing translations show EN content, never another language.
 * 
 * Usage:
 *   const { content } = usePageContent('homepage', language);
 *   const title = content('hero_h1_line1', 'THE COMPETITION');
 */
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_BACKEND_URL + '/api';
const IS_PROD = process.env.NODE_ENV === 'production';
const IS_DEV  = !IS_PROD;

// Session cache
const _pageCache  = {};
const _enCache    = {};   // always keep EN separately

export function usePageContent(slug, language = 'en') {
  const [data, setData]       = useState({});
  const [enData, setEnData]   = useState({});
  const [loaded, setLoaded]   = useState(false);
  const lang = language?.slice(0, 2) || 'en';

  useEffect(() => {
    if (!slug) return;
    const isEn = lang === 'en';
    const cacheKey = `${slug}:${lang}`;
    const enKey    = `${slug}:en`;

    // Fetch requested language
    const fetchLang = !_pageCache[cacheKey]
      ? axios.get(`${API}/cms/content/${slug}?lang=${lang}`).then(r => { _pageCache[cacheKey] = r.data || {}; }).catch(() => { _pageCache[cacheKey] = {}; })
      : Promise.resolve();

    // Always fetch EN as fallback (unless already EN)
    const fetchEn = (!isEn && !_enCache[enKey])
      ? axios.get(`${API}/cms/content/${slug}?lang=en`).then(r => { _enCache[enKey] = r.data || {}; }).catch(() => { _enCache[enKey] = {}; })
      : Promise.resolve();

    Promise.all([fetchLang, fetchEn]).then(() => {
      setData(_pageCache[cacheKey] || {});
      setEnData(isEn ? (_pageCache[cacheKey] || {}) : (_enCache[enKey] || {}));
      setLoaded(true);
    });
  }, [slug, lang]);

  /**
   * Get content value. Strict chain: lang → EN → hardcoded fallback.
   * @param {string} key
   * @param {string} fallback  - Used ONLY if CMS has nothing. Logs warning.
   */
  const content = useCallback((key, fallback = '') => {
    if (!loaded) return fallback;

    // 1. Preferred language
    if (data[key]) return data[key];

    // 2. EN fallback (never show other language as fallback)
    if (enData[key]) {
      if (IS_DEV && lang !== 'en') {
        console.warn(`[CMS] "${slug}.${key}" missing for "${lang}" — showing EN`);
      }
      return enData[key];
    }

    // 3. Hardcoded fallback (log warning)
    if (IS_DEV) {
      console.warn(`[CMS] "${slug}.${key}" not in CMS — using hardcoded fallback: "${fallback}"`);
    } else {
      console.error(`[CMS] Missing content: ${slug}.${key} [${lang}]`);
    }
    return fallback;
  }, [data, enData, loaded, lang, slug]);

  return { content, loaded, raw: data };
}

export default usePageContent;
