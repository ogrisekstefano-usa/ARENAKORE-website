import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, ArrowRight, Target, BarChart2, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { InnerNavbar, InnerFooter } from '../components/SharedLayout';
import usePageContent from '../hooks/usePageContent';
import useCMSSEO from '../hooks/useCMSSEO';
import { useLangPath } from '../utils/langPath';
import { ROUTES } from '../config/routes';

/**
 * TestLandingPage — SEO-optimized test/assessment landing page.
 * 100% CMS-driven. Used for fitness-level-test, amrap-test, etc.
 */
export default function TestLandingPage({ slug }) {
  const { i18n } = useTranslation();
  const lang = i18n.language?.slice(0, 2) || 'it';
  const { content: cms } = usePageContent(slug, lang);
  const lp = useLangPath();
  useCMSSEO(cms, slug.replace(/-/g, ' ').toUpperCase());

  return (
    <div className="bg-black min-h-screen text-white font-inter overflow-x-hidden">
      <InnerNavbar />

      {/* HERO */}
      <section data-testid={`${slug}-hero`}
        className="pt-32 pb-20 px-6 sm:px-10"
        style={{ background: 'linear-gradient(160deg,#000 0%,#040408 100%)' }}>
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#00FFFF' }} />
            <span className="font-inter text-xs font-bold tracking-[0.35em] uppercase" style={{ color: '#00FFFF' }}>
              {cms('hero_badge')}
            </span>
          </div>
          <h1 className="font-anton text-5xl md:text-7xl uppercase leading-[0.9] text-white mb-4">
            {cms('hero_h1')}
          </h1>
          <p className="font-inter text-base md:text-xl text-white mb-4 max-w-2xl leading-relaxed">
            {cms('hero_sub')}
          </p>
          <p className="font-inter text-sm max-w-2xl leading-relaxed mb-10"
            style={{ color: 'rgba(0,255,255,0.65)', borderLeft: '2px solid rgba(0,255,255,0.3)', paddingLeft: '1rem' }}>
            {cms('hero_nexus_line')}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to={lp(ROUTES.app)} data-testid={`${slug}-cta-primary`}
              className="inline-flex items-center gap-3 font-inter font-black uppercase tracking-wider text-base px-10 rounded-[14px] bg-ak-gold text-black hover:scale-105 transition-transform"
              style={{ height: '60px' }}>
              <Zap size={20} fill="black" /> {cms('cta_primary')}
            </Link>
            <Link to={lp(ROUTES.athletes)} data-testid={`${slug}-cta-secondary`}
              className="inline-flex items-center gap-3 font-inter font-semibold uppercase tracking-wider text-sm px-8 rounded-[14px] border border-white/25 text-white hover:border-white transition-colors"
              style={{ height: '60px' }}>
              {cms('cta_secondary')} <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* WHAT IS THE TEST */}
      <section className="py-20 px-6 sm:px-10" style={{ background: '#050505' }}>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="font-anton text-3xl md:text-4xl uppercase leading-none text-white mb-6">
              {cms('s1_title')}
            </h2>
            <p className="font-inter text-base text-white leading-relaxed">
              {cms('s1_text')}
            </p>
          </div>
          <div className="space-y-4">
            {['s1_p1','s1_p2','s1_p3'].map((k, i) => cms(k) ? (
              <div key={i} className="flex items-start gap-4 p-4 rounded-[12px]"
                style={{ background: '#0a0a0a', border: '1px solid rgba(0,255,255,0.12)' }}>
                <Target size={16} style={{ color: '#00FFFF', flexShrink: 0, marginTop: 2 }} />
                <span className="font-inter text-sm text-white">{cms(k)}</span>
              </div>
            ) : null)}
          </div>
        </div>
      </section>

      {/* HOW NEXUS MEASURES */}
      <section className="py-20 px-6 sm:px-10" style={{ background: '#000' }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-anton text-3xl md:text-5xl uppercase leading-none text-white mb-4">
            {cms('s2_title')}
          </h2>
          <p className="font-inter text-base text-white leading-relaxed mb-10 max-w-xl mx-auto">
            {cms('s2_text')}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-left">
            {['s2_m1','s2_m2','s2_m3','s2_m4'].map((k, i) => cms(k) ? (
              <div key={i} className="flex items-center gap-3 p-4 rounded-[10px]"
                style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.07)' }}>
                <BarChart2 size={14} style={{ color: '#FFD700', flexShrink: 0 }} />
                <span className="font-inter text-sm text-white">{cms(k)}</span>
              </div>
            ) : null)}
          </div>
        </div>
      </section>

      {/* WHY IT MATTERS */}
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

      {/* FINAL CTA */}
      <section className="py-24 px-6 sm:px-10 text-center" style={{ background: '#000' }}>
        <div className="max-w-2xl mx-auto">
          <h2 className="font-anton uppercase leading-none text-white mb-4"
            style={{ fontSize: 'clamp(40px,6vw,72px)' }}>
            {cms('final_h2')}
          </h2>
          <p className="font-inter text-lg text-white mb-10">{cms('final_sub')}</p>
          <Link to={lp(ROUTES.app)}
            className="inline-flex items-center justify-center gap-3 font-inter font-black uppercase tracking-wider text-base px-12 rounded-[14px] bg-ak-gold text-black hover:scale-105 transition-transform"
            style={{ height: '60px' }}>
            <Zap size={20} fill="black" /> {cms('cta_primary')}
          </Link>
        </div>
      </section>

      <InnerFooter />
    </div>
  );
}
