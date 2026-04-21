/**
 * ARENAKORE — Language-aware path helper
 * All internal links must use this to build correct /lang/path URLs.
 *
 * Usage:
 *   const lp = useLangPath();
 *   <Link to={lp(ROUTES.arenaSystem)}>Arena System</Link>
 *   // Result: /it/arena-system (when lang = 'it')
 */
import { useTranslation } from 'react-i18next';

export const VALID_LANGS = ['en', 'it', 'es'];
export const DEFAULT_LANG = 'it';

export function useLangPath() {
  const { i18n } = useTranslation();
  const lang = i18n.language?.slice(0, 2) || DEFAULT_LANG;
  const validLang = VALID_LANGS.includes(lang) ? lang : DEFAULT_LANG;
  return (path = '/') => {
    const clean = path === '/' ? '' : path;
    return `/${validLang}${clean}`;
  };
}

/**
 * Build a lang-prefixed path directly (without hook)
 */
export function langPath(lang, path = '/') {
  const clean = path === '/' ? '' : path;
  const validLang = VALID_LANGS.includes(lang) ? lang : DEFAULT_LANG;
  return `/${validLang}${clean}`;
}

/**
 * Strip lang prefix from a pathname
 * /it/arena-system → /arena-system
 * /it → /
 */
export function stripLang(pathname = '/') {
  const match = pathname.match(/^\/(en|it|es)(\/.*)?$/);
  if (!match) return pathname;
  return match[2] || '/';
}
