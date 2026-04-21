import { ROUTES } from '../config/routes';
import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, ChevronDown, Zap } from 'lucide-react';
import { InnerNavbar, InnerFooter } from './SharedLayout';
import { useTranslation } from 'react-i18next';
import { getLocalizedPage } from '../data/seo-content';
import usePageContent from '../hooks/usePageContent';
import useCMSSEO from '../hooks/useCMSSEO';

/**
 * ContentPageTemplate — CMS-first architecture.
 *
 * Priority chain:
 *   1. CMS DB (usePageContent) — source of truth
 *   2. seo-content.js translations (getLocalizedPage) — structural fallback
 *
 * New pages: seed content via scripts/seed_cms.py, never hardcode.
 */
export default function ContentPageTemplate({ page }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.slice(0, 2) || 'en';
  const p = getLocalizedPage(page, lang);  // structural fallback
  const slug = page.slug?.replace(/^\//, '') || '';
  const { content: cms } = usePageContent(slug, lang);  // CMS source of truth

  // Helper: CMS first, then static page data
  const c = (cmsKey, staticVal = '') => cms(cmsKey) || staticVal;

  useCMSSEO(cms, p.badge || p.h1);

  return (
    <div className="bg-black text-white min-h-screen font-inter">
      <InnerNavbar />

      {/* ── HERO ── */}
      <section
        className="relative min-h-[70vh] flex flex-col justify-end pt-16"
        style={{ backgroundImage: `url(${p.heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center 30%' }}
      >
        <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, rgba(0,0,0,0.88) 0%, rgba(0,10,20,0.82) 100%)' }} />
        <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-10 pb-20 w-full">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-2 h-2 rounded-full bg-ak-cyan animate-pulse inline-block" />
            <span className="font-inter text-xs font-bold tracking-[0.3em] uppercase text-ak-cyan">
              {c('hero_badge', p.badge)}
            </span>
          </div>
          <h1 className="font-anton text-5xl md:text-7xl uppercase leading-[0.9] text-white mb-6 max-w-3xl">
            {c('hero_h1', p.h1)}
          </h1>
          <p className="font-inter text-base md:text-lg text-white mb-4 max-w-xl leading-relaxed">
            {c('hero_sub', p.intro.body.substring(0, 120)) + '...'}
          </p>
          {/* NEXUS coaches line */}
          {c('hero_nexus_line') && (
            <p className="font-inter text-sm max-w-xl leading-relaxed mb-8"
              style={{ color: 'rgba(0,255,255,0.6)', borderLeft: '2px solid rgba(0,255,255,0.3)', paddingLeft: '1rem' }}>
              {c('hero_nexus_line')}
            </p>
          )}
          <div className="flex flex-wrap gap-4 mt-8">
            <Link to={ROUTES.app} data-testid="hero-cta-btn"
              className="inline-flex items-center gap-3 font-inter font-black uppercase tracking-wider text-sm px-8 rounded-[14px] bg-ak-gold text-black hover:scale-105 transition-transform"
              style={{ height: '52px' }}>
              <Zap size={16} fill="black" /> {c('cta_primary', t('cta.downloadApp'))}
            </Link>
          </div>
        </div>
      </section>

      {/* ── INTRO ── */}
      <section className="py-20 px-6 sm:px-10" style={{ background: '#000' }}>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="font-anton text-3xl md:text-4xl uppercase text-white mb-5">
              {c('intro_h2', p.intro.heading)}
            </h2>
            <p className="font-inter text-sm md:text-base text-white leading-relaxed">
              {c('intro_body', p.intro.body)}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {p.keywords.slice(0, 4).map((kw, i) => (
              <div key={i} className="p-3 rounded-[10px] border border-white/10" style={{ background: '#0a0a0a' }}>
                <span className="font-inter text-xs text-white/50 leading-relaxed">{kw}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROBLEM ── */}
      <section className="py-20 px-6 sm:px-10" style={{ background: '#050505' }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="font-anton text-3xl md:text-4xl uppercase text-white mb-8">
            {c('problem_h2', p.problem.heading)}
          </h2>
          <ul className="space-y-4">
            {p.problem.points.map((pt, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 inline-block" style={{ background: '#FF2D2D' }} />
                <span className="font-inter text-base text-white">
                  {c(`problem_p${i + 1}`, pt)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── SOLUTION ── */}
      <section className="py-20 px-6 sm:px-10 text-center" style={{ background: '#000' }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="font-anton text-3xl md:text-5xl uppercase text-white mb-6">
            {c('solution_h2', p.solution.heading)}
          </h2>
          <p className="font-inter text-base md:text-lg text-white max-w-2xl mx-auto leading-relaxed">
            {c('solution_body', p.solution.body)}
          </p>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 px-6 sm:px-10" style={{ background: '#050505' }}>
        <div className="max-w-5xl mx-auto">
          <div className="font-inter text-xs font-bold tracking-[0.4em] uppercase mb-3 text-ak-cyan">
            {c('how_badge', t('ui.section_how_it_works'))}
          </div>
          <h2 className="font-anton text-3xl md:text-4xl uppercase text-white mb-10">
            {c('how_h2', '')}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {p.howItWorks.map((s, i) => {
              const title = c(`how_s${i + 1}_title`, s.title);
              const desc  = c(`how_s${i + 1}_desc`,  s.desc);
              return (
                <div key={i} className="flex items-start gap-4 p-5 rounded-[12px]"
                  style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="font-anton text-2xl flex-shrink-0" style={{ color: i % 2 === 0 ? '#00FFFF' : '#FFD700', minWidth: 36 }}>
                    {s.step}
                  </div>
                  <div>
                    <div className="font-inter text-sm font-bold uppercase tracking-wider text-white mb-1">{title}</div>
                    <div className="font-inter text-sm text-white/70 leading-relaxed">{desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── BENEFITS ── */}
      <section className="py-20 px-6 sm:px-10" style={{ background: '#000' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="font-anton text-3xl md:text-4xl uppercase text-white mb-10">{t('ui.section_why')}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {p.benefits.map((b, i) => (
              <div key={i} className="p-5 rounded-[12px]"
                style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="text-2xl mb-3">{b.icon}</div>
                <div className="font-inter text-sm font-bold text-white mb-1">{b.title}</div>
                <div className="font-inter text-xs text-white/60 leading-relaxed">{b.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 px-6 sm:px-10" style={{ background: '#050505' }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="font-anton text-3xl uppercase text-white mb-8">{t('ui.section_faq')}</h2>
          <div className="space-y-4">
            {p.faq.map((f, i) => (
              <div key={i} className="p-5 rounded-[12px]" style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="font-inter text-sm font-bold text-ak-gold mb-2">{f.q}</div>
                <div className="font-inter text-sm text-white/70 leading-relaxed">{f.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-20 px-6 sm:px-10 text-center" style={{ background: '#000' }}>
        <div className="max-w-2xl mx-auto">
          <div className="font-inter text-xs font-bold tracking-[0.4em] uppercase mb-4 text-ak-gold">
            {c('prove_it', 'PROVE IT.')}
          </div>
          <h2 className="font-anton text-4xl md:text-5xl uppercase text-white mb-6">
            {c('cta_primary', t('cta.enterArena'))}
          </h2>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to={ROUTES.app}
              className="inline-flex items-center gap-3 font-inter font-black uppercase tracking-wider text-base px-10 rounded-[14px] bg-ak-gold text-black hover:scale-105 transition-transform"
              style={{ height: '60px' }}>
              <Zap size={20} fill="black" /> {c('cta_primary', t('cta.enterArena'))}
            </Link>
            {p.relatedPages.slice(0, 2).map((rp, i) => (
              <Link key={i} to={rp.href}
                className="inline-flex items-center gap-2 font-inter text-sm font-semibold text-ak-cyan hover:underline"
                style={{ height: '60px' }}>
                {rp.label} <ArrowRight size={14} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <InnerFooter />
    </div>
  );
}
