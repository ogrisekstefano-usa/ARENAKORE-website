import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronRight, Zap, Globe, LogIn, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LOGO } from '../data/seo-content';
import { ROUTES, NAV_ITEMS } from '../config/routes';
import LangModal from './LangModal';
import TranslationBanner from './TranslationBanner';
import { trackGetAppClick, trackBusinessClick } from '../utils/tracking';
import { useGlobalContent } from '../hooks/useGlobalContent';
import { useNavConfig } from '../hooks/useNavConfig';

// Lazy import to avoid circular dep
let _useAuth = null;
function getUseAuth() {
  if (!_useAuth) {
    try { _useAuth = require('../context/AuthContext').useAuth; } catch { _useAuth = () => ({ user: null }); }
  }
  return _useAuth;
}

export function useSEO({ title, description }) {
  useEffect(() => {
    document.title = title;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; document.head.appendChild(meta); }
    meta.content = description;
  }, [title, description]);
}

/* ─── Language Switcher ─── */
const LANGS = [
  { code: 'en', label: 'EN' },
  { code: 'it', label: 'IT' },
  { code: 'es', label: 'ES' },
];

function LangSwitcher() {
  const { i18n } = useTranslation();
  const current = i18n.language?.slice(0, 2) || 'en';

  const change = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem('ak_lang', code);
  };

  return (
    <div className="flex items-center gap-0.5" data-testid="lang-switcher">
      {LANGS.map((l, i) => (
        <React.Fragment key={l.code}>
          <button
            onClick={() => change(l.code)}
            data-testid={`lang-btn-${l.code}`}
            className={`font-inter text-[11px] font-bold uppercase tracking-wider px-2 py-1 rounded transition-colors ${
              current === l.code
                ? 'text-ak-cyan'
                : 'text-white/40 hover:text-white'
            }`}
          >
            {l.label}
          </button>
          {i < LANGS.length - 1 && <span className="text-white/20 text-xs">|</span>}
        </React.Fragment>
      ))}
    </div>
  );
}

export function InnerNavbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const loc = useLocation();
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.slice(0, 2) || 'en';
  const { global: g, offline: isOffline } = useGlobalContent(lang);
  const { topNav } = useNavConfig();

  // Resolve label: 1. navConfig lang label, 2. CMS global, 3. i18n fallback
  const navLabel = (item) => {
    if (item.labels?.[lang]) return item.labels[lang];
    if (item.labels?.en)    return item.labels.en;
    const staticItem = NAV_ITEMS.find(n => n.key === item.key);
    if (staticItem) return g(staticItem.cmsKey, t(staticItem.i18nKey));
    return item.key;
  };

  // Safe auth access
  let authUser = null;
  let authLogout = null;
  try {
    const { user, logout } = getUseAuth()();
    authUser = user;
    authLogout = logout;
  } catch { }

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Nav built dynamically from CMS nav config (sorted, active only)
  const NAV = topNav
    .filter(item => item.active !== false)
    .sort((a, b) => a.order - b.order);

  const active = (href) => href === '/' ? loc.pathname === '/' : loc.pathname.startsWith(href);

  return (
    <>
      <nav
        data-testid="inner-navbar"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-black/95 backdrop-blur-md border-b border-white/10' : 'bg-black/80 backdrop-blur-sm border-b border-white/5'
        }`}
      >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between h-16">
        <Link to="/" data-testid="nav-logo" className="flex-shrink-0">
          <img src={LOGO} alt="ArenaKore" className="h-8 w-auto object-contain" loading="lazy" />
        </Link>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-0.5">
          {NAV.map(l => (
            <Link key={l.href} to={l.href}
              className={`font-inter text-xs font-semibold uppercase tracking-wider px-3 py-2 rounded-lg transition-colors ${
                active(l.href)
                  ? 'text-ak-cyan'
                  : l.highlight
                  ? 'text-white hover:text-ak-cyan'
                  : 'text-white/55 hover:text-white'
              }`}
              style={l.highlight && !active(l.href) ? { textShadow: '0 0 12px rgba(255,255,255,0.2)' } : {}}
            >
              {navLabel(l)}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={ROUTES.app}
            data-testid="nav-start-challenge-btn"
            onClick={() => trackGetAppClick('navbar')}
            className="hidden sm:inline-flex items-center gap-1.5 font-inter font-black text-[10px] uppercase tracking-wide px-3 rounded-[12px] bg-ak-gold text-black hover:scale-105 transition-transform whitespace-nowrap"
            style={{ height: '32px' }}
          >
            <Zap size={11} fill="black" /> {g('nav_cta', t('nav.startChallenge'))}
          </Link>
          <button onClick={() => setOpen(!open)} className="lg:hidden text-white p-1" data-testid="nav-mobile-toggle">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-black/98 border-t border-white/10 px-5 py-5 space-y-1">
          {NAV.map(l => (
            <Link key={l.href} to={l.href} onClick={() => setOpen(false)}
              className={`flex items-center justify-between py-3 border-b border-white/5 font-inter text-sm font-semibold uppercase tracking-wider ${
                active(l.href) ? 'text-ak-cyan' : l.highlight ? 'text-white' : 'text-white/70'
              }`}
            >
              {navLabel(l)} <ChevronRight size={14} className="text-white/30" />
            </Link>
          ))}
          <div className="pt-3 flex items-center justify-between">
            <LangSwitcher />
            <Link to={ROUTES.gyms} onClick={() => setOpen(false)}
              className="inline-flex items-center gap-2 font-inter font-black text-sm uppercase tracking-wider rounded-[14px] bg-ak-gold text-black px-5"
              style={{ height: '44px' }}>
              <Zap size={15} fill="black" /> {t('nav.startChallenge')}
            </Link>
          </div>
        </div>
      )}
    </nav>
    {/* Offline mode badge — shown when CMS API is unreachable */}
    {isOffline && (
      <div
        data-testid="offline-badge"
        className="fixed top-16 right-4 z-40 font-inter text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
        style={{ background: 'rgba(255,215,0,0.12)', border: '1px solid rgba(255,215,0,0.3)', color: 'rgba(255,215,0,0.7)' }}
      >
        Offline mode
      </div>
    )}
    {/* Translation completeness banner — appears below nav for non-EN when incomplete */}
    <TranslationBanner
      slug={loc.pathname.replace('/', '').replace(/-/g, '-') || 'homepage'}
      language={lang}
    />
  </>
  );
}

export function InnerFooter() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.slice(0, 2) || 'en';
  const { global: g } = useGlobalContent(lang);
  const { bottomNav } = useNavConfig();
  const [langOpen, setLangOpen] = useState(false);
  const currentLang    = i18n.language?.slice(0, 2).toUpperCase() || 'EN';
  const currentCountry = localStorage.getItem('arena_country') || '';

  const FLAGS = { IT: '🇮🇹', ES: '🇪🇸', EN: '🌍', US: '🇺🇸', GB: '🇬🇧', DE: '🇩🇪', FR: '🇫🇷', AU: '🇦🇺', CA: '🇨🇦', AE: '🇦🇪' };
  const displayFlag = FLAGS[currentCountry] || FLAGS[currentLang] || '🌍';

  // Resolve footer link label
  const footerLabel = (item) => {
    if (item.labels?.[lang]) return item.labels[lang];
    if (item.labels?.en)    return item.labels.en;
    const staticItem = NAV_ITEMS.find(n => n.key === item.key);
    if (staticItem) return t(staticItem.i18nKey);
    return item.key;
  };

  const activeFooterLinks = bottomNav
    .filter(item => item.active !== false)
    .sort((a, b) => a.order - b.order);

  return (
    <>
      <LangModal open={langOpen} onClose={() => setLangOpen(false)} />
      <footer data-testid="inner-footer" className="bg-black border-t border-white/8">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 pt-14 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
            {/* Col 1: Brand */}
            <div>
              <img src={LOGO} alt="ArenaKore" className="h-8 w-auto object-contain mb-4" loading="lazy" />
              <p className="font-inter text-xs text-white leading-relaxed max-w-xs mb-3">
                {g('footer_tagline', 'Global competition platform for athletes and gyms.')}
              </p>
              <p className="font-inter text-[10px] font-bold uppercase tracking-wider mb-4" style={{ color: 'rgba(0,255,255,0.6)' }}>
                {t('footer.universalSystem')}
              </p>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse inline-block" />
                <span className="font-inter text-[10px] font-bold uppercase tracking-widest text-white">{g('footer_nexus', t('footer.nexusOnline'))}</span>
              </div>
            </div>
            {/* Col 2: Pages — driven by CMS nav config */}
            <div>
              <div className="font-inter text-[10px] font-bold uppercase tracking-widest text-white/40 mb-5">{t('footer.pages')}</div>
              <ul className="space-y-2.5">
                {activeFooterLinks.map(item => (
                  <li key={item.key}>
                    <Link to={item.href} className="font-inter text-sm text-white hover:text-ak-cyan transition-colors">
                      {footerLabel(item)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            {/* Col 3: Support */}
            <div>
              <div className="font-inter text-[10px] font-bold uppercase tracking-widest text-white/40 mb-5">{t('footer.support')}</div>
              <ul className="space-y-2.5 mb-6">
                <li><Link to="/support" className="font-inter text-sm text-white hover:text-ak-cyan transition-colors">{t('footer.supportCenter')}</Link></li>
                <li><a href="mailto:support@arenakore.com" className="font-inter text-sm text-white hover:text-ak-cyan transition-colors">support@arenakore.com</a></li>
              </ul>
              <Link to={ROUTES.app}
                onClick={() => trackGetAppClick('footer')}
                className="inline-flex items-center gap-2 font-inter font-black text-xs uppercase tracking-wider px-5 rounded-[14px] bg-ak-gold text-black hover:scale-105 transition-transform"
                style={{ height: '38px' }}>
                <Zap size={13} fill="black" /> {t('cta.getApp')}
              </Link>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-white/8 gap-4">
            <div className="font-inter text-xs text-white">{g('footer_copyright', t('footer.copyright'))}</div>
            <div className="flex items-center gap-5">
              <a href="#" className="font-inter text-xs text-white/50 hover:text-white transition-colors">{t('footer.privacy')}</a>
              <a href="#" className="font-inter text-xs text-white/50 hover:text-white transition-colors">{t('footer.terms')}</a>
              <button
                onClick={() => setLangOpen(true)}
                data-testid="footer-lang-btn"
                className="flex items-center gap-2 font-inter text-xs text-white/50 hover:text-white transition-colors border border-white/10 hover:border-white/25 px-3 py-1.5 rounded-full"
              >
                <span>{displayFlag}</span>
                <span className="font-bold">{currentLang}</span>
                {currentCountry && <span className="text-white/30">· {currentCountry}</span>}
              </button>
              <Link to="/admin" data-testid="footer-signin-btn"
                className="flex items-center gap-1.5 font-inter text-xs text-white/30 hover:text-white transition-colors">
                <LogIn size={12} /> {t('ui.sign_in')}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
