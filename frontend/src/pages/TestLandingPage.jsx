import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Zap, ArrowRight, Target, BarChart2, Clock, Settings, Layers } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { InnerNavbar, InnerFooter } from '../components/SharedLayout';
import usePageContent from '../hooks/usePageContent';
import useCMSSEO from '../hooks/useCMSSEO';
import { useLangPath } from '../utils/langPath';
import { ROUTES } from '../config/routes';
import {
  trackLandingView,
  useLandingScrollTracking,
  trackStartTestClick,
  trackDownloadClick,
} from '../utils/tracking';

/**
 * TestLandingPage — SEO + Conversion optimized.
 * 100% CMS-driven. Full funnel tracking.
 */
export default function TestLandingPage({ slug }) {
  const { i18n } = useTranslation();
  const lang = i18n.language?.slice(0, 2) || 'it';
  const { content: cms } = usePageContent(slug, lang);
  const lp = useLangPath();
  const setupScrollTracking = useLandingScrollTracking(slug);
  useCMSSEO(cms, slug.replace(/-/g, ' ').toUpperCase());

  // Track landing view + scroll depth
  useEffect(() => {
    trackLandingView(slug);
    const cleanup = setupScrollTracking();
    return cleanup;
  }, [slug, setupScrollTracking]);

  return (
    <div className="bg-black min-h-screen text-white font-inter overflow-x-hidden">
      <InnerNavbar />

      {/* ══ HERO ══ */}
      <section data-testid={`${slug}-hero`}
        className="pt-32 pb-14 px-6 sm:px-10"
        style={{ background: 'linear-gradient(160deg,#000 0%,#040408 100%)' }}>
        <div className="max-w-3xl mx-auto">
          {/* Badge */}
          <div className="flex items-center gap-3 mb-5">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#00FFFF' }} />
            <span className="font-inter text-xs font-bold tracking-[0.35em] uppercase" style={{ color: '#00FFFF' }}>
              {cms('hero_badge')}
            </span>
          </div>
          {/* H1 */}
          <h1 className="font-anton text-5xl md:text-7xl uppercase leading-[0.9] text-white mb-4">
            {cms('hero_h1')}
          </h1>
          {/* Sub */}
          <p className="font-inter text-base md:text-xl text-white mb-4 max-w-2xl leading-relaxed">
            {cms('hero_sub')}
          </p>
          {/* NEXUS coaches line */}
          <p className="font-inter text-sm max-w-2xl leading-relaxed mb-8"
            style={{ color: 'rgba(0,255,255,0.65)', borderLeft: '2px solid rgba(0,255,255,0.3)', paddingLeft: '1rem' }}>
            {cms('hero_nexus_line')}
          </p>

          {/* ── TENSION ── */}
          {cms('tension_text') && (
            <div className="mb-10 py-5 px-6 rounded-[12px]"
              style={{ background: 'rgba(255,215,0,0.04)', border: '1px solid rgba(255,215,0,0.15)' }}>
              <p className="font-anton text-2xl md:text-3xl uppercase text-white leading-tight"
                style={{ whiteSpace: 'pre-line' }}>
                {cms('tension_text')}
              </p>
            </div>
          )}

          {/* ── SOCIAL PROOF ── */}
          {cms('proof_1') && (
            <div className="flex flex-wrap items-center gap-6 mb-10">
              {[cms('proof_1'), cms('proof_2')].filter(Boolean).map((txt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: i === 0 ? '#00FFFF' : '#FFD700' }} />
                  <span className="font-inter text-sm font-semibold text-white/70">{txt}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══ FUNNEL: Cosa succede quando entri ══ */}
      {cms('funnel_title') && (
        <section data-testid={`${slug}-funnel`}
          className="py-16 px-6 sm:px-10" style={{ background: '#050505' }}>
          <div className="max-w-3xl mx-auto">
            <h2 className="font-anton text-3xl md:text-4xl uppercase leading-none text-white mb-10">
              {cms('funnel_title')}
            </h2>
            <div className="relative">
              {/* Vertical connector line */}
              <div className="absolute left-[20px] top-6 bottom-6 w-px hidden sm:block"
                style={{ background: 'linear-gradient(to bottom, rgba(0,255,255,0.4), rgba(255,215,0,0.4), rgba(0,255,255,0.4))' }} />
              <div className="space-y-5">
                {[
                  { key: 'funnel_s1', color: '#00FFFF', icon: <BarChart2 size={14} /> },
                  { key: 'funnel_s2', color: '#00FFFF', icon: <Target size={14} /> },
                  { key: 'funnel_s3', color: '#FFD700', icon: <Zap size={14} /> },
                  { key: 'funnel_s4', color: '#FFD700', icon: <Layers size={14} /> },
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-5">
                    {/* Step indicator */}
                    <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center relative z-10"
                      style={{ background: '#000', border: `2px solid ${step.color}` }}>
                      <span style={{ color: step.color }}>{step.icon}</span>
                    </div>
                    <div className="flex-1 px-5 py-3.5 rounded-[10px]"
                      style={{ background: '#0a0a0a', border: `1px solid ${step.color}18` }}>
                      <div className="flex items-center gap-3">
                        <span className="font-inter text-[10px] font-black uppercase tracking-wider"
                          style={{ color: step.color }}>0{i + 1}</span>
                        <span className="font-inter text-sm font-semibold text-white">
                          {cms(step.key)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── PRIMARY CTA BLOCK ── */}
            <div className="mt-12 p-8 rounded-[16px] text-center"
              style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                <Link to={lp(ROUTES.app)} data-testid={`${slug}-cta-primary`}
                  onClick={() => trackStartTestClick(slug, 'mid')}
                  className="inline-flex items-center justify-center gap-3 font-inter font-black uppercase tracking-wider text-base px-10 rounded-[14px] bg-ak-gold text-black hover:scale-105 transition-transform"
                  style={{ height: '60px' }}>
                  <Zap size={20} fill="black" /> {cms('cta_primary')}
                </Link>
                <Link to={lp(ROUTES.app)} data-testid={`${slug}-cta-secondary`}
                  onClick={() => trackDownloadClick(slug, 'landing')}
                  className="inline-flex items-center justify-center gap-3 font-inter font-semibold uppercase tracking-wider text-sm px-8 rounded-[14px] border border-white/20 text-white hover:border-white transition-colors"
                  style={{ height: '60px' }}>
                  {cms('cta_secondary')} <ArrowRight size={14} />
                </Link>
              </div>
              {/* Microcopy */}
              {cms('microcopy_1') && (
                <div className="flex flex-wrap items-center justify-center gap-6">
                  {[
                    { key: 'microcopy_1', icon: <Clock size={12} /> },
                    { key: 'microcopy_2', icon: <Settings size={12} /> },
                    { key: 'microcopy_3', icon: <Target size={12} /> },
                  ].map((mc, i) => (
                    <div key={i} className="flex items-center gap-2"
                      style={{ color: 'rgba(255,255,255,0.45)' }}>
                      {mc.icon}
                      <span className="font-inter text-xs">{cms(mc.key)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ══ WHAT IS THE TEST ══ */}
      <section className="py-20 px-6 sm:px-10" style={{ background: '#000' }}>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="font-anton text-3xl md:text-4xl uppercase leading-none text-white mb-6">
              {cms('s1_title')}
            </h2>
            <p className="font-inter text-base text-white leading-relaxed">
              {cms('s1_text')}
            </p>
          </div>
          <div className="space-y-3">
            {['s1_p1','s1_p2','s1_p3'].map((k, i) => cms(k) ? (
              <div key={i} className="flex items-center gap-4 p-4 rounded-[10px]"
                style={{ background: '#0a0a0a', border: '1px solid rgba(0,255,255,0.12)' }}>
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#00FFFF' }} />
                <span className="font-inter text-sm text-white">{cms(k)}</span>
              </div>
            ) : null)}
          </div>
        </div>
      </section>

      {/* ══ HOW NEXUS MEASURES ══ */}
      <section className="py-20 px-6 sm:px-10" style={{ background: '#050505' }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-anton text-3xl md:text-5xl uppercase leading-none text-white mb-4">
            {cms('s2_title')}
          </h2>
          <p className="font-inter text-base text-white leading-relaxed mb-10 max-w-xl mx-auto">
            {cms('s2_text')}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
            {['s2_m1','s2_m2','s2_m3','s2_m4'].map((k, i) => cms(k) ? (
              <div key={i} className="flex items-center gap-3 p-4 rounded-[10px]"
                style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.06)' }}>
                <BarChart2 size={12} style={{ color: '#FFD700', flexShrink: 0 }} />
                <span className="font-inter text-xs text-white/80">{cms(k)}</span>
              </div>
            ) : null)}
          </div>
        </div>
      </section>

      {/* ══ PROGRESSION HOOK ══ */}
      {cms('progression_title') && (
        <section data-testid={`${slug}-progression`}
          className="py-20 px-6 sm:px-10" style={{ background: '#000' }}>
          <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="font-anton text-3xl md:text-4xl uppercase leading-none text-white mb-5">
                {cms('progression_title')}
              </h2>
              <p className="font-inter text-base text-white leading-relaxed">
                {cms('progression_text')}
              </p>
            </div>
            {/* Visual: progression steps */}
            <div className="space-y-2.5">
              {['Test 1', 'Test 2', 'Test 3', '...'].map((label, i) => {
                const w = [40, 60, 80, 95][i];
                return (
                  <div key={i} className="flex items-center gap-4">
                    <span className="font-inter text-xs text-white/40 w-12 flex-shrink-0">{label}</span>
                    <div className="flex-1 h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <div className="h-full rounded-full transition-all"
                        style={{ width: `${w}%`, background: i === 3 ? 'rgba(0,255,255,0.3)' : `linear-gradient(to right, #00FFFF, #FFD700)` }} />
                    </div>
                    <span className="font-inter text-[10px] font-bold" style={{ color: '#00FFFF', width: 32, textAlign: 'right' }}>
                      {w}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ══ WHY IT MATTERS ══ */}
      <section className="py-20 px-6 sm:px-10" style={{ background: '#050505' }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="font-anton text-3xl md:text-4xl uppercase leading-none text-white mb-6">
            {cms('s3_title')}
          </h2>
          <p className="font-inter text-base text-white leading-relaxed mb-6">
            {cms('s3_text')}
          </p>
          <p className="font-inter text-sm leading-relaxed"
            style={{ color: 'rgba(0,255,255,0.6)', borderLeft: '2px solid rgba(0,255,255,0.3)', paddingLeft: '1rem' }}>
            {cms('hero_nexus_line')}
          </p>
        </div>
      </section>

      {/* ══ FINAL CTA ══ */}
      <section data-testid={`${slug}-final-cta`}
        className="py-24 px-6 sm:px-10" style={{ background: '#000' }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-anton uppercase leading-none text-white mb-4"
            style={{ fontSize: 'clamp(40px,6vw,72px)' }}>
            {cms('final_h2')}
          </h2>
          <p className="font-inter text-lg text-white mb-8">
            {cms('final_sub')}
          </p>

          {/* CTA Group */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-5">
            <Link to={lp(ROUTES.app)} data-testid={`${slug}-final-primary`}
              onClick={() => trackStartTestClick(slug, 'bottom')}
              className="inline-flex items-center justify-center gap-3 font-inter font-black uppercase tracking-wider text-base px-12 rounded-[14px] bg-ak-gold text-black hover:scale-105 transition-transform"
              style={{ height: '60px' }}>
              <Zap size={20} fill="black" /> {cms('cta_primary')}
            </Link>
          </div>

          {/* Microcopy */}
          {cms('microcopy_1') && (
            <div className="flex flex-wrap items-center justify-center gap-5">
              {[cms('microcopy_1'), cms('microcopy_2'), cms('microcopy_3')].filter(Boolean).map((txt, i) => (
                <span key={i} className="font-inter text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  {txt}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      <InnerFooter />
    </div>
  );
}
