import { useSEO } from '../components/SharedLayout';
import { useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const BASE = 'https://www.arenakore.com';
const LANGS = ['en', 'it', 'es'];

/**
 * useCMSSEO — Reads ALL SEO meta from CMS and injects them.
 * Uses language-prefixed canonical URLs: /it/arena-system, /en/arena-system
 */
export function useCMSSEO(cms, fallbackTitle = 'ArenaKore') {
  const { pathname } = useLocation();
  const { i18n } = useTranslation();
  const lang = i18n.language?.slice(0, 2) || 'it';

  // Strip lang prefix to get the page path (/it/arena-system → /arena-system)
  const pagePath = pathname.replace(/^\/(en|it|es)(\/|$)/, '/').replace(/\/$/, '') || '/';

  // Build lang-specific canonical + hreflang URLs
  const canonical = `${BASE}/${lang}${pagePath === '/' ? '' : pagePath}`;
  const hreflangUrls = Object.fromEntries(
    LANGS.map(l => [l, `${BASE}/${l}${pagePath === '/' ? '' : pagePath}`])
  );

  useSEO({
    title:         cms('seo_title')       || fallbackTitle + ' | ArenaKore',
    description:   cms('seo_description') || '',
    ogTitle:       cms('og_title')        || cms('seo_title') || fallbackTitle,
    ogDescription: cms('og_description')  || cms('seo_description') || '',
    ogImage:       cms('og_image')        || '',
    canonical,
    keywords:      cms('seo_keywords')    || '',
    hreflangUrls,
    pathname,
    lang,
  });
}

export default useCMSSEO;
