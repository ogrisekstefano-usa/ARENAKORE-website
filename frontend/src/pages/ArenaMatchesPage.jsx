import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, ArrowRight, Database, Target, Shield, BarChart2, Users, Award } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { InnerNavbar, InnerFooter, useSEO } from '../components/SharedLayout';
import usePageContent from '../hooks/usePageContent';
import { ROUTES } from '../config/routes';

/**
 * ArenaMatchesPage — 100% CMS-driven.
 * Content: MongoDB → cms_content → slug: "arena-matches"
 * Manage via: /admin → Content → Arena Matches
 */
export default function ArenaMatchesPage() {
  const { i18n } = useTranslation();
  const lang = i18n.language?.slice(0, 2) || 'en';
  const { content: cms, offline } = usePageContent('arena-matches', lang);

  useSEO({
    title: cms('hero_h1') ? `${cms('hero_h1')} | ArenaKore` : 'Arena Matches | ArenaKore',
    description: cms('hero_sub'),
  });

  return (
    <div className="bg-black min-h-screen text-white font-inter overflow-x-hidden">
      <InnerNavbar />

      {offline && (
        <div data-testid="offline-badge" className="fixed top-16 right-4 z-40 font-inter text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
          style={{ background: 'rgba(255,215,0,0.12)', border: '1px solid rgba(255,215,0,0.3)', color: 'rgba(255,215,0,0.7)' }}>
          Offline mode
        </div>
      )}

      {/* ══ HERO ══ */}
      <section data-testid="arena-matches-hero"
        className="relative pt-32 pb-24 px-6 sm:px-10 overflow-hidden"
        style={{ background: 'linear-gradient(160deg,#000 0%,#040408 60%,#000 100%)' }}>
        {/* Background accent */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(ellipse 60% 50% at 10% 60%,rgba(0,255,255,0.05) 0%,transparent 70%)' }} />
        <div className="max-w-4xl mx-auto relative z-10">
          {/* Badge */}
          <div className="flex items-center gap-3 mb-6">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#00FFFF' }} />
            <span className="font-inter text-xs font-bold tracking-[0.35em] uppercase" style={{ color: '#00FFFF' }}>
              {cms('hero_badge')}
            </span>
          </div>
          {/* H1 */}
          <h1 className="font-anton text-6xl md:text-8xl uppercase leading-[0.88] text-white mb-4">
            {cms('hero_h1')}
          </h1>
          {/* H2 */}
          <h2 className="font-anton text-2xl md:text-4xl uppercase leading-tight mb-6" style={{ color: '#FFD700' }}>
            {cms('hero_h2')}
          </h2>
          {/* Sub */}
          <p className="font-inter text-base md:text-lg text-white mb-5 max-w-2xl leading-relaxed">
            {cms('hero_sub')}
          </p>
          {/* NEXUS coaches line */}
          <p className="font-inter text-sm max-w-2xl leading-relaxed mb-10"
            style={{ color: 'rgba(0,255,255,0.65)', borderLeft: '2px solid rgba(0,255,255,0.35)', paddingLeft: '1rem' }}>
            {cms('hero_nexus_line')}
          </p>
          {/* CTAs */}
          <div className="flex flex-wrap gap-4">
            <Link to={ROUTES.app} data-testid="arena-matches-cta-primary"
              className="inline-flex items-center gap-3 font-inter font-black uppercase tracking-wider text-base px-10 rounded-[14px] bg-ak-gold text-black hover:scale-105 transition-transform"
              style={{ height: '60px' }}>
              <Zap size={20} fill="black" /> {cms('cta_primary')}
            </Link>
            <Link to={ROUTES.app} data-testid="arena-matches-cta-secondary"
              className="inline-flex items-center gap-3 font-inter font-semibold uppercase tracking-wider text-sm px-8 rounded-[14px] border border-white/25 text-white hover:border-white transition-colors"
              style={{ height: '60px' }}>
              {cms('cta_secondary')} <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══ SECTION 1 — NON SONO SFIDE CASUALI ══ */}
      <section data-testid="arena-matches-intro" className="py-24 px-6 sm:px-10" style={{ background: '#050505' }}>
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="font-anton text-3xl md:text-5xl uppercase leading-none text-white mb-8">
                {cms('s1_title')}
              </h2>
              <p className="font-inter text-base text-white leading-relaxed mb-8">
                {cms('s1_text')}
              </p>
            </div>
            {/* NEXUS analysis points */}
            <div className="space-y-4">
              <div className="font-inter text-xs font-bold tracking-[0.35em] uppercase mb-4" style={{ color: '#00FFFF' }}>
                NEXUS ANALIZZA:
              </div>
              {['s1_nexus_point1', 's1_nexus_point2', 's1_nexus_point3'].map((k, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-[12px]"
                  style={{ background: '#0a0a0a', border: '1px solid rgba(0,255,255,0.12)' }}>
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#00FFFF' }} />
                  <span className="font-inter text-sm font-semibold text-white">{cms(k)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ SECTION 2 — HOW IT WORKS ══ */}
      <section data-testid="arena-matches-how" className="py-24 px-6 sm:px-10" style={{ background: '#000' }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="font-anton text-3xl md:text-5xl uppercase leading-none text-white mb-14">
            {cms('s2_title')}
          </h2>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[22px] top-0 bottom-0 w-px hidden md:block"
              style={{ background: 'linear-gradient(to bottom, rgba(0,255,255,0.4), rgba(255,215,0,0.4))' }} />
            <div className="space-y-8">
              {[
                { key: 'how_s1', color: '#00FFFF', icon: <Database size={16} /> },
                { key: 'how_s2', color: '#00FFFF', icon: <Target size={16} /> },
                { key: 'how_s3', color: '#FFD700', icon: <Zap size={16} /> },
                { key: 'how_s4', color: '#FFD700', icon: <BarChart2 size={16} /> },
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-6">
                  {/* Step indicator */}
                  <div className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center relative z-10 hidden md:flex"
                    style={{ background: '#000', border: `2px solid ${step.color}` }}>
                    <span style={{ color: step.color }}>{step.icon}</span>
                  </div>
                  <div className="flex-1 p-6 rounded-[14px]"
                    style={{ background: '#0a0a0a', border: `1px solid ${step.color}18` }}>
                    <div className="font-inter text-[10px] font-black tracking-[0.3em] uppercase mb-2"
                      style={{ color: step.color }}>0{i + 1}</div>
                    <h3 className="font-anton text-xl md:text-2xl uppercase text-white mb-2">
                      {cms(`${step.key}_title`)}
                    </h3>
                    <p className="font-inter text-sm text-white/70 leading-relaxed">
                      {cms(`${step.key}_desc`)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ SECTION 3 — MATCH TYPES ══ */}
      <section data-testid="arena-matches-types" className="py-24 px-6 sm:px-10" style={{ background: '#050505' }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="font-anton text-3xl md:text-5xl uppercase leading-none text-white mb-12">
            {cms('s3_title')}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Individual Challenge */}
            <div className="p-8 rounded-[16px]" style={{ background: '#0a0a0a', border: '1px solid rgba(0,255,255,0.2)' }}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(0,255,255,0.1)', border: '1px solid rgba(0,255,255,0.3)' }}>
                  <Target size={18} style={{ color: '#00FFFF' }} />
                </div>
                <h3 className="font-anton text-xl uppercase text-white">{cms('s3_b1_title')}</h3>
              </div>
              <p className="font-inter text-sm text-white/70 leading-relaxed">{cms('s3_b1_text')}</p>
            </div>
            {/* Athlete Match */}
            <div className="p-8 rounded-[16px]" style={{ background: '#0a0a0a', border: '1px solid rgba(255,215,0,0.2)' }}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.3)' }}>
                  <Users size={18} style={{ color: '#FFD700' }} />
                </div>
                <h3 className="font-anton text-xl uppercase text-white">{cms('s3_b2_title')}</h3>
              </div>
              <p className="font-inter text-sm text-white/70 leading-relaxed">{cms('s3_b2_text')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ SECTION 4 — DATA ══ */}
      <section data-testid="arena-matches-data" className="py-24 px-6 sm:px-10" style={{ background: '#000' }}>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-anton text-3xl md:text-5xl uppercase leading-none text-white mb-6">
              {cms('s4_title')}
            </h2>
            <p className="font-inter text-base text-white leading-relaxed">
              {cms('s4_text')}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {['s4_point1','s4_point2','s4_point3','s4_point4','s4_point5'].map((k, i) => {
              const colors = ['#00FFFF','#FFD700','#00FFFF','#FFD700','#00FFFF'];
              return (
                <div key={i} className="flex items-center gap-4 px-5 py-3 rounded-[10px]"
                  style={{ background: '#0a0a0a', border: `1px solid ${colors[i]}18` }}>
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: colors[i] }} />
                  <span className="font-inter text-sm font-semibold text-white uppercase tracking-wider">
                    {cms(k)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ SECTION 5 — COACH ROLE ══ */}
      <section data-testid="arena-matches-coach" className="py-24 px-6 sm:px-10" style={{ background: '#050505' }}>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Visual */}
          <div className="p-8 rounded-[16px] flex flex-col items-center justify-center text-center"
            style={{ background: 'rgba(255,215,0,0.04)', border: '1px solid rgba(255,215,0,0.15)', minHeight: '220px' }}>
            <Award size={40} style={{ color: '#FFD700', marginBottom: '1rem' }} />
            <div className="font-inter text-xs font-bold tracking-[0.3em] uppercase text-white/40 mb-2">
              NEXUS ENGINE
            </div>
            <div className="font-anton text-xl uppercase text-white leading-tight">
              {cms('hero_nexus_line')}
            </div>
          </div>
          <div>
            <h2 className="font-anton text-3xl md:text-4xl uppercase leading-none text-white mb-6">
              {cms('s5_title')}
            </h2>
            <p className="font-inter text-base text-white leading-relaxed">
              {cms('s5_text')}
            </p>
          </div>
        </div>
      </section>

      {/* ══ SECTION 6 — CHALLENGE VALUE ══ */}
      <section data-testid="arena-matches-value" className="py-24 px-6 sm:px-10" style={{ background: '#000' }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="font-anton text-3xl md:text-5xl uppercase leading-none text-white mb-6">
            {cms('s6_title')}
          </h2>
          <p className="font-inter text-base text-white leading-relaxed mb-10 max-w-2xl">
            {cms('s6_text')}
          </p>
          <div className="flex flex-wrap gap-4">
            {['s6_point1','s6_point2','s6_point3'].map((k, i) => (
              <div key={i} className="flex items-center gap-2 px-5 py-3 rounded-[10px]"
                style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)' }}>
                <Shield size={14} style={{ color: '#00FFFF', flexShrink: 0 }} />
                <span className="font-inter text-sm font-semibold text-white">{cms(k)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FINAL CTA ══ */}
      <section data-testid="arena-matches-final" className="py-28 px-6 sm:px-10 text-center"
        style={{ background: '#050505' }}>
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-10 justify-center">
            <div className="flex-1 max-w-[80px] h-px" style={{ background: 'rgba(0,255,255,0.3)' }} />
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#00FFFF', boxShadow: '0 0 8px #00FFFF', display: 'inline-block' }} />
            <div className="flex-1 max-w-[80px] h-px" style={{ background: 'rgba(0,255,255,0.3)' }} />
          </div>
          <h2 className="font-anton uppercase leading-none text-white mb-4"
            style={{ fontSize: 'clamp(48px,7vw,88px)' }}>
            {cms('final_h2')}
          </h2>
          <p className="font-inter text-lg text-white mb-10">
            {cms('final_sub')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={ROUTES.app} data-testid="arena-matches-final-cta"
              className="inline-flex items-center justify-center gap-3 font-inter font-black uppercase tracking-wider text-base px-12 rounded-[14px] bg-ak-gold text-black hover:scale-105 transition-transform"
              style={{ height: '60px' }}>
              <Zap size={20} fill="black" /> {cms('cta_primary')}
            </Link>
            <Link to={ROUTES.app} data-testid="arena-matches-download-cta"
              className="inline-flex items-center justify-center gap-3 font-inter font-bold uppercase tracking-wider text-sm px-8 rounded-[14px] border border-white/20 text-white hover:border-white transition-colors"
              style={{ height: '60px' }}>
              {cms('cta_secondary')} <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <InnerFooter />
    </div>
  );
}
