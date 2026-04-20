import { ROUTES } from '../config/routes';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Zap, ArrowRight, Activity, Trophy, Repeat,
  CheckCircle, ChevronDown, Download
} from 'lucide-react';
import { InnerNavbar, InnerFooter, useSEO } from '../components/SharedLayout';
import usePageContent from '../hooks/usePageContent';
import { useScrollTracking } from '../hooks/useScrollTracking';

const HERO_BG = 'https://customer-assets.emergentagent.com/job_nexus-arena-11/artifacts/g6ba12ic_ChatGPT%20Image%20Apr%2015%2C%202026%2C%2011_23_53%20AM.png';

const WHAT_BLOCKS = [
  { icon: <Activity size={32} />, titleKey: 'track_title', bodyKey: 'track_body', color: '#00FFFF' },
  { icon: <Trophy size={32} />,   titleKey: 'rank_title',  bodyKey: 'rank_body',  color: '#FFD700' },
  { icon: <Repeat size={32} />,   titleKey: 'challenge_title', bodyKey: 'challenge_body', color: '#FF2D2D' },
];

const WHY_BLOCKS = [
  { num: '01', headline_key: 'why_1', body_key: 'why_1_body', color: '#00FFFF' },
  { num: '02', headline_key: 'why_2', body_key: 'why_2_body', color: '#FFD700' },
  { num: '03', headline_key: 'why_3', body_key: 'why_3_body', color: '#00FFFF' },
];


export default function ArenaSystemPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.slice(0, 2) || 'en';
  const { content: cms } = usePageContent('arena-system', lang);
  useScrollTracking('arena_system');

  const DISCIPLINES = [
    t('arena.d1'), t('arena.d2'), t('arena.d3'), t('arena.d4'),
    t('arena.d5'), t('arena.d6'), t('arena.d7'), t('arena.d8'),
  ];

  useSEO({
    title: 'Arena System | ArenaKore — The Competition Platform',
    description: 'Track performance. Rank results. Compete every day. ArenaKore Arena System works across any sport.',
  });

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && e.target.classList.add('ak-visible')),
      { threshold: 0.08 }
    );
    document.querySelectorAll('.ak-reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div className="bg-black text-white font-inter overflow-x-hidden">
      <InnerNavbar />

      {/* ══ HERO ══ */}
      <section
        data-testid="arena-system-hero"
        className="relative min-h-[80vh] flex flex-col justify-end pt-16"
        style={{ backgroundImage: `url(${HERO_BG})`, backgroundSize: 'cover', backgroundPosition: 'center 20%' }}
      >
        <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg,rgba(0,0,0,0.8) 0%,rgba(0,0,0,0.96) 100%)' }} />
        <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-10 pb-20 w-full">
          <div className="ak-hero-badge flex items-center gap-3 mb-6">
            <span className="w-2 h-2 rounded-full bg-ak-cyan inline-block" style={{ boxShadow: '0 0 8px #00FFFF' }} />
            <span className="font-inter text-xs font-bold tracking-[0.35em] uppercase text-ak-cyan">
              {cms('hero_badge', t('arena.hero_badge'))}
            </span>
          </div>
          <h1 className="ak-hero-title font-anton uppercase leading-[0.9] text-white mb-5"
            style={{ fontSize: 'clamp(52px,8vw,96px)' }}>
            {cms('hero_h1', t('arena.hero_h1'))}
          </h1>
          <p className="ak-hero-sub font-inter text-xl md:text-2xl font-semibold text-white mb-3">
            {cms('hero_sub', t('arena.hero_sub'))}
          </p>
          <p className="ak-hero-sub font-inter text-sm text-white mb-10" style={{ opacity: 0.6 }}>
            {cms('hero_sub2', t('arena.hero_sub2'))}
          </p>
          <div className="ak-hero-btns flex flex-col sm:flex-row gap-4 mb-10">
            <Link to={ROUTES.app} data-testid="arena-download-btn"
              className="inline-flex items-center justify-center gap-3 font-inter font-black uppercase tracking-wider text-base px-10 rounded-[14px] bg-ak-gold text-black hover:scale-105 transition-transform"
              style={{ height: '60px' }}>
              <Download size={20} /> {t('cta.downloadApp')}
            </Link>
            <a href="#what-it-does"
              className="inline-flex items-center justify-center gap-2 font-inter font-semibold uppercase tracking-wider text-sm px-8 rounded-[14px] border border-white/25 text-white hover:border-white transition-colors"
              style={{ height: '60px' }}>
              {t('ui.see_how')} <ChevronDown size={16} />
            </a>
          </div>
          {/* Not a fitness app statement */}
          <div className="inline-block font-inter text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full"
            style={{ background: 'rgba(255,45,45,0.08)', border: '1px solid rgba(255,45,45,0.25)', color: '#FF2D2D' }}>
            {cms('not_fitness_app', t('arena.not_fitness_app'))}
          </div>
        </div>
      </section>

      {/* ══ WHAT IT DOES ══ */}
      <section id="what-it-does" data-testid="what-it-does-section"
        className="py-24 px-6 sm:px-10" style={{ background: '#050505' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 ak-reveal">
            <div className="font-inter text-xs font-bold tracking-[0.4em] uppercase mb-4 text-ak-cyan">{cms('what_badge', t('arena.what_badge'))}</div>
            <h2 className="font-anton text-4xl md:text-5xl uppercase text-white leading-none">
              {cms('what_h2', t('arena.what_h2'))}<br /><span style={{ color: '#00FFFF' }}>{cms('what_h2_2', t('arena.what_h2_2'))}</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {WHAT_BLOCKS.map((b, i) => (
              <div key={i} data-testid={`what-block-${i}`}
                className="ak-reveal p-8 rounded-[14px] flex flex-col gap-5"
                style={{ background: '#0a0a0a', borderTop: `3px solid ${b.color}`, transitionDelay: `${i * 0.1}s` }}>
                <div style={{ color: b.color }}>{b.icon}</div>
                <h3 className="font-anton text-2xl uppercase text-white leading-none">{cms(b.titleKey, t(`arena.${b.titleKey}`))}</h3>
                <p className="font-inter text-sm text-white leading-relaxed">{cms(b.bodyKey, t(`arena.${b.bodyKey}`))}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ WHY IT WORKS ══ */}
      <section data-testid="why-it-works-section" className="py-24 px-6 sm:px-10 bg-black">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 ak-reveal">
            <div className="font-inter text-xs font-bold tracking-[0.4em] uppercase mb-4" style={{ color: '#FFD700' }}>
              {cms('why_badge', t('arena.why_badge'))}
            </div>
            <h2 className="font-anton text-4xl md:text-5xl uppercase text-white leading-none">
              {cms('why_h2', t('arena.why_h2'))}
            </h2>
          </div>
          <div className="space-y-4">
            {WHY_BLOCKS.map((b, i) => (
              <div key={i} data-testid={`why-block-${i}`}
                className="ak-reveal flex gap-6 items-start p-6 rounded-[14px]"
                style={{ background: '#0a0a0a', border: `1px solid ${b.color}15`, transitionDelay: `${i * 0.1}s` }}>
                <div className="font-anton text-4xl flex-shrink-0" style={{ color: b.color, minWidth: '3rem' }}>{b.num}</div>
                <div>
                  <h3 className="font-anton text-xl uppercase text-white mb-2">{cms(b.headline_key, t(`arena.${b.headline_key}`))}</h3>
                  <p className="font-inter text-sm text-white leading-relaxed">{cms(b.headline_key + "_body", t(`arena.${b.body_key}`))}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ MULTI-SPORT ══ */}
      <section data-testid="multi-sport-section" className="py-24 px-6 sm:px-10" style={{ background: '#050505' }}>
        <div className="max-w-5xl mx-auto ak-reveal">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="font-inter text-xs font-bold tracking-[0.4em] uppercase mb-5 text-ak-cyan">
                {cms('sport_badge', t('arena.sport_badge'))}
              </div>
              <h2 className="font-anton text-4xl md:text-5xl uppercase leading-none text-white mb-6">
                {cms('sport_h2', t('arena.sport_badge'))}
              </h2>
              <p className="font-inter text-base text-white leading-relaxed mb-8">
                {cms('sport_body', t('arena.sport_body'))}
              </p>
              <div className="flex flex-col gap-2">
                <Link to={ROUTES.gyms} data-testid="multisport-gyms-link"
                  className="inline-flex items-center gap-2 font-inter text-sm font-bold text-ak-gold hover:underline">
                  {t('ui.for_gyms_coaches')} <ArrowRight size={14} />
                </Link>
                <Link to={ROUTES.athletes} data-testid="multisport-athletes-link"
                  className="inline-flex items-center gap-2 font-inter text-sm font-semibold text-ak-cyan hover:underline">
                  {t('cta.enter_arena')} <ArrowRight size={14} />
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {DISCIPLINES.map((d, i) => (
                <div key={i} className="flex items-center gap-3 p-4 rounded-[12px]"
                  style={{ background: '#0a0a0a', border: `1px solid ${i < 2 ? 'rgba(0,255,255,0.2)' : 'rgba(255,255,255,0.07)'}` }}>
                  <CheckCircle size={14} style={{ color: i < 2 ? '#00FFFF' : 'rgba(255,255,255,0.3)', flexShrink: 0 }} />
                  <span className="font-inter text-sm font-semibold text-white">{d}</span>
                  {i < 2 && <span className="ml-auto font-inter text-[9px] font-black uppercase tracking-wider text-ak-cyan">Live</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ NEXUS CALLOUT ══ */}
      <section className="py-16 px-6 sm:px-10 bg-black">
        <div className="max-w-4xl mx-auto ak-reveal">
          <div className="p-8 rounded-[16px] text-center" style={{ background: '#0a0a0a', border: '1px solid rgba(0,255,255,0.15)' }}>
            <div className="font-inter text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(0,255,255,0.6)' }}>
              {cms('nexus_badge', t('arena.nexus_badge'))}
            </div>
            <p className="font-anton text-2xl md:text-3xl uppercase text-white mb-2">
              {cms('nexus_callout', t('arena.nexus_callout'))}
            </p>
            <p className="font-inter text-sm text-white max-w-lg mx-auto">
              {cms('nexus_body', t('arena.nexus_body'))}
            </p>
          </div>
        </div>
      </section>

      {/* ══ FINAL CTA ══ */}
      <section data-testid="arena-final-cta" className="py-24 px-6 sm:px-10" style={{ background: '#050505' }}>
        <div className="max-w-2xl mx-auto text-center ak-reveal">
          <div className="w-10 h-1 bg-ak-gold mx-auto mb-8 rounded" />
          <h2 className="font-anton text-5xl md:text-6xl uppercase text-white mb-4 leading-none">
            {cms('final_h2', t('arena.final_h2'))}
          </h2>
          <p className="font-inter text-base text-white mb-10">
            {cms('final_body', t('arena.final_body'))}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={ROUTES.app} data-testid="arena-final-download"
              className="inline-flex items-center justify-center gap-3 font-inter font-black uppercase tracking-wider text-sm px-12 rounded-[14px] bg-ak-gold text-black hover:scale-105 transition-transform"
              style={{ height: '56px' }}>
              <Download size={18} /> {t('cta.downloadApp')}
            </Link>
            <Link to={ROUTES.gyms} data-testid="arena-final-gyms"
              className="inline-flex items-center justify-center gap-3 font-inter font-bold uppercase tracking-wider text-sm px-8 rounded-[14px] border border-white/20 text-white hover:border-ak-gold hover:text-ak-gold transition-all"
              style={{ height: '56px' }}>
              {t('cta.forGyms')} <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      <InnerFooter />
    </div>
  );
}
