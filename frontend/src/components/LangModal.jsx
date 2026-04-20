import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Globe, Check, ChevronDown } from 'lucide-react';

/* ─── Config ─── */
const LANG_KEY    = 'ak_lang';          // used by i18next detector
const ARENA_LANG  = 'arena_language';  // human-readable alias
const ARENA_CTRY  = 'arena_country';

const LANGUAGES = [
  { code: 'en', label: 'English',   native: 'English',   flag: '🌍' },
  { code: 'it', label: 'Italian',   native: 'Italiano',  flag: '🇮🇹' },
  { code: 'es', label: 'Spanish',   native: 'Español',   flag: '🇪🇸' },
];

const COUNTRIES = [
  { code: 'US', flag: '🇺🇸', name: 'United States',  lang: 'en' },
  { code: 'GB', flag: '🇬🇧', name: 'United Kingdom', lang: 'en' },
  { code: 'AU', flag: '🇦🇺', name: 'Australia',       lang: 'en' },
  { code: 'CA', flag: '🇨🇦', name: 'Canada',          lang: 'en' },
  { code: 'IT', flag: '🇮🇹', name: 'Italy',           lang: 'it' },
  { code: 'ES', flag: '🇪🇸', name: 'Spain',           lang: 'es' },
  { code: 'MX', flag: '🇲🇽', name: 'Mexico',          lang: 'es' },
  { code: 'AR', flag: '🇦🇷', name: 'Argentina',       lang: 'es' },
  { code: 'BR', flag: '🇧🇷', name: 'Brazil',          lang: 'es' },
  { code: 'CO', flag: '🇨🇴', name: 'Colombia',        lang: 'es' },
  { code: 'DE', flag: '🇩🇪', name: 'Germany',         lang: 'en' },
  { code: 'FR', flag: '🇫🇷', name: 'France',          lang: 'en' },
  { code: 'NL', flag: '🇳🇱', name: 'Netherlands',     lang: 'en' },
  { code: 'PT', flag: '🇵🇹', name: 'Portugal',        lang: 'es' },
  { code: 'AE', flag: '🇦🇪', name: 'UAE',             lang: 'en' },
  { code: 'ZA', flag: '🇿🇦', name: 'South Africa',    lang: 'en' },
];

/* ─── Auto-detect from browser ─── */
function detectFromBrowser() {
  const nav = (navigator.language || navigator.userLanguage || 'en-US');
  const [rawLang, rawCountry = ''] = nav.split('-');
  const lang    = ['en', 'it', 'es'].includes(rawLang) ? rawLang : 'en';
  const country = rawCountry.toUpperCase() || null;
  return { lang, country };
}

/* ─── Hook: init on first visit ─── */
export function useGlobalSelector() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const storedLang    = localStorage.getItem(LANG_KEY);
    const storedCountry = localStorage.getItem(ARENA_CTRY);

    if (!storedLang) {
      const { lang, country } = detectFromBrowser();
      i18n.changeLanguage(lang);
      localStorage.setItem(LANG_KEY,   lang);
      localStorage.setItem(ARENA_LANG, lang);
      if (country && !storedCountry) {
        localStorage.setItem(ARENA_CTRY, country);
      }
    }
  }, []); // eslint-disable-line
}

/* ─── Main Modal ─── */
export default function LangModal({ open, onClose }) {
  const { i18n } = useTranslation();
  const currentLang    = i18n.language?.slice(0, 2) || 'en';
  const [currentCountry, setCurrentCountry] = useState(
    () => localStorage.getItem(ARENA_CTRY) || ''
  );
  const [showAllCountries, setShowAllCountries] = useState(false);

  const selectLang = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem(LANG_KEY,   code);
    localStorage.setItem(ARENA_LANG, code);
  };

  const selectCountry = (country) => {
    setCurrentCountry(country.code);
    localStorage.setItem(ARENA_CTRY, country.code);
    // Optionally auto-set language for country
    if (!localStorage.getItem(LANG_KEY)) {
      selectLang(country.lang);
    }
  };

  const visibleCountries = showAllCountries ? COUNTRIES : COUNTRIES.slice(0, 8);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full sm:max-w-md rounded-t-[24px] sm:rounded-[24px] overflow-hidden"
        style={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 40px 80px rgba(0,0,0,0.9)', maxHeight: '90vh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/8 sticky top-0" style={{ background: '#111', zIndex: 1 }}>
          <div className="flex items-center gap-3">
            <Globe size={18} className="text-ak-cyan" />
            <span className="font-inter text-sm font-bold text-white uppercase tracking-wider">Language & Region</span>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors p-1 rounded-full hover:bg-white/5">
            <X size={18} />
          </button>
        </div>

        <div className="px-6 pt-5">
          {/* ── Language ── */}
          <div className="mb-6">
            <div className="font-inter text-[10px] font-bold uppercase tracking-widest text-white/35 mb-3">LANGUAGE</div>
            <div className="grid grid-cols-3 gap-2">
              {LANGUAGES.map(l => (
                <button
                  key={l.code}
                  onClick={() => selectLang(l.code)}
                  data-testid={`modal-lang-${l.code}`}
                  className="flex flex-col items-center gap-1.5 p-4 rounded-[14px] transition-all"
                  style={{
                    background: currentLang === l.code ? 'rgba(0,255,255,0.08)' : 'rgba(255,255,255,0.03)',
                    border: `1.5px solid ${currentLang === l.code ? 'rgba(0,255,255,0.35)' : 'rgba(255,255,255,0.07)'}`,
                  }}
                >
                  <span className="text-2xl">{l.flag}</span>
                  <span className="font-inter text-xs font-semibold text-white">{l.native}</span>
                  <span className="font-inter text-[9px] uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>{l.code.toUpperCase()}</span>
                  {currentLang === l.code && (
                    <Check size={12} className="text-ak-cyan" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ── Country ── */}
          <div className="mb-2">
            <div className="font-inter text-[10px] font-bold uppercase tracking-widest text-white/35 mb-3">COUNTRY / REGION</div>
            <div className="grid grid-cols-2 gap-1.5">
              {visibleCountries.map((c) => (
                <button
                  key={c.code}
                  onClick={() => selectCountry(c)}
                  data-testid={`modal-country-${c.code}`}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-left transition-all"
                  style={{
                    background: currentCountry === c.code ? 'rgba(255,215,0,0.06)' : 'transparent',
                    border: `1px solid ${currentCountry === c.code ? 'rgba(255,215,0,0.3)' : 'rgba(255,255,255,0.05)'}`,
                  }}
                >
                  <span className="text-lg flex-shrink-0">{c.flag}</span>
                  <div className="min-w-0">
                    <div className="font-inter text-xs font-semibold text-white truncate">{c.name}</div>
                    {currentCountry === c.code && (
                      <div className="font-inter text-[9px] text-ak-gold">Selected</div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {!showAllCountries && (
              <button
                onClick={() => setShowAllCountries(true)}
                className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 font-inter text-xs text-white/40 hover:text-white transition-colors"
              >
                <ChevronDown size={14} />
                Show all countries
              </button>
            )}
          </div>
        </div>

        {/* Footer note */}
        <div className="px-6 py-4 border-t border-white/8 mt-2">
          <div className="flex items-center justify-between">
            <p className="font-inter text-[10px] text-white/25">
              {currentCountry ? `Region: ${COUNTRIES.find(c => c.code === currentCountry)?.flag || ''} ${currentCountry}` : 'No region selected'}
            </p>
            <button
              onClick={onClose}
              className="font-inter text-xs font-bold uppercase tracking-wider text-ak-gold hover:underline"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
