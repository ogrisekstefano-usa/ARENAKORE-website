/**
 * ArenaKore CMS Content Hook
 * 
 * Fetches page content from CMS database.
 * Falls back to i18n translation keys if CMS content is missing.
 * 
 * Usage:
 *   const content = usePageContent('homepage', language);
 *   const title = content('hero_h1_line1', t('home.h1_line1'));
 */
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_BACKEND_URL + '/api';

// In-memory cache per session
const _cache = {};

export function usePageContent(slug, language = 'en') {
  const [data, setData] = useState({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const cacheKey = `${slug}:${language}`;
    if (_cache[cacheKey]) {
      setData(_cache[cacheKey]);
      setLoaded(true);
      return;
    }
    axios.get(`${API}/cms/content/${slug}?lang=${language}`)
      .then(r => {
        _cache[cacheKey] = r.data || {};
        setData(r.data || {});
      })
      .catch(() => setData({}))
      .finally(() => setLoaded(true));
  }, [slug, language]);

  /**
   * Get a content value.
   * @param {string} key     - CMS section key (e.g. 'hero_h1_line1')
   * @param {string} fallback - Fallback text if CMS key missing
   * @returns {string}
   */
  const content = useCallback((key, fallback = '') => {
    if (!loaded) return fallback;
    return data[key] ?? fallback;
  }, [data, loaded]);

  return { content, loaded, raw: data };
}

/**
 * Standalone function for non-hook contexts.
 * Returns value from cache if available.
 */
export function getContent(slug, key, language = 'en', fallback = '') {
  const cacheKey = `${slug}:${language}`;
  return _cache[cacheKey]?.[key] ?? fallback;
}

/** Prefetch content for a page (call in parent before render) */
export async function prefetchPageContent(slug, language = 'en') {
  const cacheKey = `${slug}:${language}`;
  if (_cache[cacheKey]) return _cache[cacheKey];
  try {
    const r = await axios.get(`${API}/cms/content/${slug}?lang=${language}`);
    _cache[cacheKey] = r.data || {};
    return _cache[cacheKey];
  } catch {
    _cache[cacheKey] = {};
    return {};
  }
}

export default usePageContent;
