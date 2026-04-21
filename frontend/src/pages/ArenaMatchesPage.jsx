import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, ArrowRight, Shield, Target, BarChart2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { InnerNavbar, InnerFooter, useSEO } from '../components/SharedLayout';
import usePageContent from '../hooks/usePageContent';
import { ROUTES } from '../config/routes';

/**
 * ArenaMatchesPage — 100% CMS-driven.
 *
 * Content source: MongoDB → cms_content → slug: "arena-matches"
 * Managed via: /admin → Content → Arena Matches
 *
 * NO hardcoded strings. NO i18n fallbacks for page content.
 * If content is missing, the field is empty — not a hardcoded fallback.
 */
export default function ArenaMatchesPage() {
  const { i18n } = useTranslation();
  const lang = i18n.language?.slice(0, 2) || 'en';
  const { content: cms, loaded, offline } = usePageContent('arena-matches', lang);

  useSEO({
    title: cms('hero_h1') || 'Arena Matches | ArenaKore',
    description: cms('hero_sub'),
  });

  const HOW_STEPS = [
    { key: 'how_s1', icon: <Target size={20} /> },
    { key: 'how_s2', icon: <Zap size={20} /> },
    { key: 'how_s3', icon: <Shield size={20} /> },
    { key: 'how_s4', icon: <BarChart2 size={20} /> },
  ];

  return (
    <div className="bg-black min-h-screen">
      <InnerNavbar />

      {offline && (
        <div data-testid="offline-badge"
          className="fixed top-16 right-4 z-40 font-inter text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
          style={{ background: 'rgba(255,215,0,0.12)', border: '1px solid rgba(255,215,0,0.3)', color: 'rgba(255,215,0,0.7)' }}>
          Offline mode
        </div>
      )}

      {/* ── HERO ── */}
      <section data-testid="arena-matches-hero"
        className="pt-32 pb-20 px-6 sm:px-10 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg,#030303 0%,#000 100%)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%,rgba(0,255,255,0.04) 0%,transparent 60%)' }} />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#00FFFF' }} />
            <span className="font-inter text-xs font-bold tracking-[0.3em] uppercase" style={{ color: '#00FFFF' }}>
              {cms('hero_badge')}
            </span>
          </div>
          <h1 className="font-anton text-5xl md:text-7xl uppercase leading-[0.92] text-white mb-6">
            {cms('hero_h1')}
          </h1>
          <p className="font-inter text-lg md:text-xl text-white mb-4 max-w-2xl leading-relaxed">
            {cms('hero_sub')}
          </p>
          <p className="font-inter text-sm max-w-2xl leading-relaxed mb-10"
            style={{ color: 'rgba(0,255,255,0.6)', borderLeft: '2px solid rgba(0,255,255,0.3)', paddingLeft: '1rem' }}>
            {cms('hero_nexus_line')}
          </p>
          <Link to={ROUTES.app} data-testid="arena-matches-cta"
            className="inline-flex items-center gap-3 font-inter font-black uppercase tracking-wider text-base px-10 rounded-[14px] bg-ak-gold text-black hover:scale-105 transition-transform"
            style={{ height: '60px' }}>
            <Zap size={20} fill="black" /> {cms('cta_primary')}
          </Link>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section data-testid="arena-matches-how"
        className="py-20 px-6 sm:px-10" style={{ background: '#050505' }}>
        <div className="max-w-4xl mx-auto">
          <div className="font-inter text-xs font-bold tracking-[0.4em] uppercase mb-3" style={{ color: '#00FFFF' }}>
            {cms('how_badge')}
          </div>
          <h2 className="font-anton text-4xl md:text-5xl uppercase leading-none text-white mb-12">
            {cms('how_h2')}
          </h2>
          <div className="space-y-6">
            {HOW_STEPS.map((step, i) => (
              <div key={step.key} className="flex items-start gap-6 p-6 rounded-[14px]"
                style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="font-anton text-2xl flex-shrink-0" style={{ color: i < 2 ? '#00FFFF' : '#FFD700', minWidth: 40 }}>
                  0{i + 1}
                </div>
                <div>
                  <h3 className="font-anton text-xl uppercase text-white mb-2">
                    {cms(`${step.key}_title`)}
                  </h3>
                  <p className="font-inter text-sm text-white leading-relaxed">
                    {cms(`${step.key}_desc`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY MATCHES MATTER ── */}
      <section data-testid="arena-matches-why"
        className="py-20 px-6 sm:px-10" style={{ background: '#000' }}>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="font-inter text-xs font-bold tracking-[0.4em] uppercase mb-3" style={{ color: '#FFD700' }}>
              {cms('why_badge')}
            </div>
            <h2 className="font-anton text-4xl md:text-5xl uppercase leading-none text-white mb-6">
              {cms('why_h2')}
            </h2>
            <p className="font-inter text-base text-white leading-relaxed">
              {cms('why_body')}
            </p>
          </div>
          <div className="p-8 rounded-[16px]" style={{ background: '#0a0a0a', border: '1px solid rgba(255,215,0,0.15)' }}>
            <div className="font-inter text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ color: '#FFD700' }}>
              {cms('nexus_badge')}
            </div>
            <div className="font-anton text-2xl uppercase text-white mb-4">
              {cms('nexus_callout')}
            </div>
            <p className="font-inter text-sm text-white leading-relaxed">
              {cms('nexus_body')}
            </p>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section data-testid="arena-matches-final"
        className="py-24 px-6 sm:px-10 text-center" style={{ background: '#050505' }}>
        <div className="max-w-2xl mx-auto">
          <h2 className="font-anton uppercase leading-none text-white mb-4"
            style={{ fontSize: 'clamp(40px,6vw,72px)' }}>
            {cms('final_h2')}
          </h2>
          <p className="font-inter text-lg text-white mb-10">
            {cms('final_sub')}
          </p>
          <Link to={ROUTES.app} data-testid="arena-matches-final-cta"
            className="inline-flex items-center gap-3 font-inter font-black uppercase tracking-wider text-base px-12 rounded-[14px] bg-ak-gold text-black hover:scale-105 transition-transform"
            style={{ height: '60px' }}>
            <Zap size={20} fill="black" /> {cms('cta_primary')} <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <InnerFooter />
    </div>
  );
}
