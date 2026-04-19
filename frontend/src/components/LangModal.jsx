import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Globe, Check } from 'lucide-react';

const LANGUAGES = [
  { code: 'en', label: 'English',   flag: '🌍', region: 'Global' },
  { code: 'it', label: 'Italiano',  flag: '🇮🇹', region: 'Italia' },
  { code: 'es', label: 'Español',   flag: '🇪🇸', region: 'España / Latinoamérica' },
];

const COUNTRIES = [
  { code: 'en', flag: '🇺🇸', name: 'United States' },
  { code: 'en', flag: '🇬🇧', name: 'United Kingdom' },
  { code: 'en', flag: '🌍', name: 'International (English)' },
  { code: 'it', flag: '🇮🇹', name: 'Italia' },
  { code: 'es', flag: '🇪🇸', name: 'España' },
  { code: 'es', flag: '🇦🇷', name: 'Argentina' },
  { code: 'es', flag: '🇲🇽', name: 'México' },
  { code: 'es', flag: '🇨🇴', name: 'Colombia' },
  { code: 'es', flag: '🇨🇱', name: 'Chile' },
  { code: 'es', flag: '🇧🇷', name: 'Brasil (Español)' },
];

export default function LangModal({ open, onClose }) {
  const { i18n } = useTranslation();
  const current = i18n.language?.slice(0, 2) || 'en';

  const select = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem('ak_lang', code);
    onClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-[20px] overflow-hidden"
        style={{ background: '#111', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 40px 80px rgba(0,0,0,0.8)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Globe size={18} className="text-ak-cyan" />
            <span className="font-inter text-sm font-bold text-white uppercase tracking-wider">Language & Region</span>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors p-1">
            <X size={18} />
          </button>
        </div>

        {/* Language selection */}
        <div className="px-6 pt-5 pb-2">
          <div className="font-inter text-[10px] font-bold uppercase tracking-widest text-white/40 mb-3">LANGUAGE</div>
          <div className="space-y-1">
            {LANGUAGES.map(l => (
              <button
                key={l.code}
                onClick={() => select(l.code)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-[12px] transition-all"
                style={{
                  background: current === l.code ? 'rgba(0,255,255,0.08)' : 'transparent',
                  border: `1px solid ${current === l.code ? 'rgba(0,255,255,0.25)' : 'rgba(255,255,255,0.05)'}`,
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{l.flag}</span>
                  <div className="text-left">
                    <div className="font-inter text-sm font-semibold text-white">{l.label}</div>
                    <div className="font-inter text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{l.region}</div>
                  </div>
                </div>
                {current === l.code && <Check size={16} className="text-ak-cyan flex-shrink-0" />}
              </button>
            ))}
          </div>
        </div>

        {/* Country selector */}
        <div className="px-6 pt-3 pb-6">
          <div className="font-inter text-[10px] font-bold uppercase tracking-widest text-white/40 mb-3">COUNTRY / REGION</div>
          <div className="max-h-48 overflow-y-auto space-y-0.5 pr-1" style={{ scrollbarWidth: 'thin', scrollbarColor: '#333 transparent' }}>
            {COUNTRIES.map((c, i) => (
              <button
                key={i}
                onClick={() => select(c.code)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[10px] hover:bg-white/5 transition-colors text-left"
              >
                <span className="text-base">{c.flag}</span>
                <span className="font-inter text-sm text-white">{c.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Bottom note */}
        <div className="px-6 pb-5">
          <p className="font-inter text-xs text-center" style={{ color: 'rgba(255,255,255,0.25)' }}>
            Language selection is saved automatically.
          </p>
        </div>
      </div>
    </div>
  );
}
