import { ROUTES } from '../config/routes';
import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, ChevronDown, Download, Zap } from 'lucide-react';
import { InnerNavbar, InnerFooter, useSEO } from './SharedLayout';
import { useTranslation } from 'react-i18next';
import { getLocalizedPage } from '../data/seo-content';

export default function ContentPageTemplate({ page }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.slice(0, 2) || 'en';
  const p = getLocalizedPage(page, lang);
  useSEO({ title: p.seo_title, description: p.meta_description });

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
            <span className="font-inter text-xs font-bold tracking-[0.3em] uppercase text-ak-cyan">{p.badge}</span>
          </div>
          <h1 className="font-anton text-5xl md:text-7xl uppercase leading-[0.9] text-white mb-6 max-w-3xl">{p.h1}</h1>
          <p className="font-inter text-base md:text-lg text-white mb-8 max-w-xl leading-relaxed">{p.intro.body.substring(0, 120)}...</p>
          <div className="flex flex-wrap gap-4">
            <a href="#" data-testid="hero-download-btn"
              className="inline-flex items-center gap-3 font-inter font-black uppercase tracking-wider text-sm px-8 rounded-[14px] bg-ak-gold text-black hover:scale-105 transition-transform"
              style={{ height: '52px' }}>
              <Download size={18} /> {t('cta.downloadApp')}
            </a>
            <a href="#how-it-works"
              className="inline-flex items-center gap-3 font-inter font-semibold uppercase tracking-wider text-sm px-8 rounded-[14px] border border-white/30 text-white hover:border-white transition-colors"
              style={{ height: '52px' }}>
              {t('ui.section_how_it_works')} <ChevronDown size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* ── INTRO ── */}
      <section className="py-20 md:py-24 px-6 sm:px-10" style={{ background: '#050505' }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="w-10 h-1 bg-ak-cyan mb-6 rounded" />
              <h2 className="font-anton text-3xl md:text-4xl uppercase text-white mb-5">{p.intro.heading}</h2>
              <p className="font-inter text-sm md:text-base text-white leading-relaxed">{p.intro.body}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {p.keywords.slice(0, 4).map((kw, i) => (
                <div key={i} className="p-4 rounded-[14px] font-inter text-xs font-bold uppercase tracking-wider text-ak-cyan border border-ak-cyan/20 bg-ak-cyan/5">
                  {kw.replace(/-/g, ' ')}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PROBLEM ── */}
      <section className="py-20 px-6 sm:px-10 bg-black">
        <div className="max-w-5xl mx-auto">
          <div className="border-l-4 border-red-500 pl-8">
            <h2 className="font-anton text-3xl md:text-4xl uppercase text-white mb-8">{p.problem.heading}</h2>
            <ul className="space-y-4">
              {p.problem.points.map((pt, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0 inline-block" />
                  <span className="font-inter text-base text-white">{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── SOLUTION ── */}
      <section className="py-20 px-6 sm:px-10" style={{ background: '#050505' }}>
        <div className="max-w-5xl mx-auto text-center">
          <div className="w-10 h-1 bg-ak-gold mx-auto mb-6 rounded" />
          <h2 className="font-anton text-3xl md:text-5xl uppercase text-white mb-6">{p.solution.heading}</h2>
          <p className="font-inter text-base md:text-lg text-white max-w-2xl mx-auto leading-relaxed">{p.solution.body}</p>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-20 px-6 sm:px-10 bg-black">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-anton text-3xl md:text-4xl uppercase text-white mb-12 text-center">
            {t('ui.section_how_it_works')}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {p.howItWorks.map((s, i) => (
              <div key={i} className="p-6 rounded-[14px] border border-white/10 hover:border-ak-cyan/40 transition-colors" style={{ background: '#0a0a0a' }}>
                <div className="font-anton text-4xl text-ak-gold mb-3">{s.step}</div>
                <div className="font-anton text-lg uppercase text-white mb-2">{s.title}</div>
                <p className="font-inter text-sm text-white leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENEFITS ── */}
      <section className="py-20 px-6 sm:px-10" style={{ background: '#050505' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="font-anton text-3xl md:text-4xl uppercase text-white mb-12 text-center">
            {t('ui.section_why')}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {p.benefits.map((b, i) => (
              <div key={i} className="p-6 rounded-[14px] border border-white/10 hover:border-ak-cyan/40 transition-all group" style={{ background: '#0a0a0a' }}>
                <div className="text-2xl mb-3">{b.icon}</div>
                <div className="font-anton text-lg uppercase text-white mb-2 group-hover:text-ak-cyan transition-colors">{b.title}</div>
                <p className="font-inter text-sm text-white leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 px-6 sm:px-10 bg-black">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-anton text-3xl md:text-4xl uppercase text-white mb-12 text-center">
            {t('ui.section_faq')}
          </h2>
          <div className="space-y-4">
            {p.faq.map((f, i) => (
              <details key={i} className="group border border-white/10 rounded-[14px] overflow-hidden" style={{ background: '#0a0a0a' }}>
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <span className="font-inter text-sm font-semibold text-white">{f.q}</span>
                  <ChevronDown size={16} className="text-ak-cyan flex-shrink-0 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-6 pb-6">
                  <p className="font-inter text-sm text-white leading-relaxed">{f.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── RELATED PAGES ── */}
      <section className="py-16 px-6 sm:px-10" style={{ background: '#050505' }}>
        <div className="max-w-5xl mx-auto">
          <h3 className="font-inter text-xs font-bold uppercase tracking-widest text-ak-cyan mb-6">
            {t('ui.section_explore')}
          </h3>
          <div className="flex flex-wrap gap-3">
            {p.relatedPages.map((rp, i) => (
              <Link key={i} to={rp.href}
                className="inline-flex items-center gap-2 font-inter text-sm font-semibold text-white border border-white/20 px-5 py-3 rounded-[14px] hover:border-ak-cyan hover:text-ak-cyan transition-all">
                {rp.label} <ArrowRight size={14} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-20 px-6 sm:px-10 bg-black text-center">
        <div className="max-w-2xl mx-auto">
          <Zap size={32} className="text-ak-gold mx-auto mb-4" />
          <h2 className="font-anton text-4xl md:text-5xl uppercase text-white mb-4">{t('ui.prove_it')}</h2>
          <p className="font-inter text-base text-white mb-8">{t('ui.no_excuses')}</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to={ROUTES.app} data-testid="bottom-cta-btn"
              className="inline-flex items-center gap-3 font-inter font-black uppercase tracking-wider text-sm px-10 rounded-[14px] bg-ak-gold text-black hover:scale-105 transition-transform"
              style={{ height: '52px' }}>
              <Download size={18} /> {t('cta.downloadApp')}
            </Link>
            <Link to={ROUTES.gyms}
              className="inline-flex items-center gap-3 font-inter font-bold uppercase tracking-wider text-sm px-8 rounded-[14px] border border-ak-gold text-ak-gold hover:bg-ak-gold hover:text-black transition-all"
              style={{ height: '52px' }}>
              {t('ui.for_gyms_coaches')}
            </Link>
          </div>
        </div>
      </section>

      <InnerFooter />
    </div>
  );
}
