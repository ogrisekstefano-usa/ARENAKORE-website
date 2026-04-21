import { useSEO } from '../components/SharedLayout';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/**
 * useCMSSEO — Reads ALL SEO meta from CMS and injects them.
 * Passes lang to useSEO for correct og:locale.
 */
export function useCMSSEO(cms, fallbackTitle = 'ArenaKore') {
  const { pathname } = useLocation();
  const { i18n } = useTranslation();
  const lang = i18n.language?.slice(0, 2) || 'en';

  useSEO({
    title:         cms('seo_title')       || fallbackTitle + ' | ArenaKore',
    description:   cms('seo_description') || '',
    ogTitle:       cms('og_title')        || cms('seo_title') || fallbackTitle,
    ogDescription: cms('og_description')  || cms('seo_description') || '',
    ogImage:       cms('og_image')        || '',
    canonical:     cms('canonical')       || '',
    keywords:      cms('seo_keywords')    || '',
    pathname,
    lang,
  });
}

export default useCMSSEO;
