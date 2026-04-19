import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Zap, ChevronDown, Shield, Trophy, Users,
  Activity, Scan, Clock, ArrowRight, CheckCircle
} from 'lucide-react';
import { InnerNavbar, InnerFooter, useSEO } from './components/SharedLayout';
import { IMGS } from './data/seo-content';
import SchemaMarkup from './components/SchemaMarkup';
import { useTranslation } from 'react-i18next';

const HERO_BG = 'https://customer-assets.emergentagent.com/job_nexus-arena-11/artifacts/g6ba12ic_ChatGPT%20Image%20Apr%2015%2C%202026%2C%2011_23_53%20AM.png';

const USE_CASES = [
  {
    title: 'Fitness Challenge App',
    desc: 'Rep validation. Live rankings. Your score, certified.',
    href: '/fitness-challenge-app',
    icon: <Zap size={20} />,
    color: '#00FFFF',
    img: IMGS.barbell,
  },
  {
    title: 'CrossFit Challenge',
    desc: 'Box vs box. WOD competition. NEXUS validates every rep.',
    href: '/crossfit-challenge',
    icon: <Shield size={20} />,
    color: '#FFD700',
    img: IMGS.crossfit,
  },
  {
    title: 'Workout Competition',
    desc: 'K-Rating. Global leaderboards. 1v1 direct challenges.',
    href: '/workout-competition',
    icon: <Trophy size={20} />,
    color: '#00FFFF',
    img: IMGS.competition,
  },
  {
    title: 'AMRAP Training',
    desc: 'Validated reps only. Your real AMRAP score, finally.',
    href: '/amrap-training',
    icon: <Activity size={20} />,
    color: '#FFD700',
    img: IMGS.pullup,
  },
];

const HOW_STEPS = [
  { num: '01', title: 'Join a challenge', desc: 'Pick a discipline, set your target. Challenge open or 1v1.', color: '#00FFFF' },
  { num: '02', title: 'Track your performance', desc: 'NEXUS validates every rep in real-time. Bad form doesn\'t count.', color: '#00FFFF' },
  { num: '03', title: 'Climb the ranking', desc: 'K-Rating updates after every session. Public. Permanent.', color: '#FFD700' },
  { num: '04', title: 'Compete daily', desc: 'New challenges every day. The competition never ends.', color: '#FFD700' },
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const { t } = useTranslation();

  useSEO({
    title: 'ArenaKore — The Fitness Competition Platform',
    description: 'Turn every workout into a challenge. Daily challenges, live rankings, validated performance. The competition never ends.',
  });

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

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
      <SchemaMarkup />
      <InnerNavbar />

      {/* ══ HERO ══ */}
      <section
        data-testid="hero-section"
        className="relative min-h-screen flex flex-col justify-end pt-16"
        style={{
          backgroundImage: `url(${HERO_BG})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 15%',
        }}
      >
        <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg,rgba(0,0,0,0.82) 0%,rgba(0,10,25,0.78) 100%)' }} />
        <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-10 pb-20 md:pb-28 w-full">
          {/* Badge */}
          <div className="ak-hero-badge flex items-center gap-3 mb-6">
            <span className="ak-blink w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: '#FF2D2D', boxShadow: '0 0 8px #FF2D2D', display: 'inline-block' }} />
            <span className="font-inter text-xs font-bold tracking-[0.3em] uppercase text-white">{t('home.badge')}</span>
          </div>
          {/* H1 */}
          <h1 className="ak-hero-title font-anton uppercase leading-[0.92] text-white mb-6" style={{ fontSize: 'clamp(52px,8vw,96px)' }}>
            {t('home.h1_line1')}<br />
            <span style={{ color: '#00FFFF' }}>{t('home.h1_line2')}</span>
          </h1>
          {/* Sub */}
          <p className="ak-hero-sub font-inter text-lg md:text-xl text-white mb-10 max-w-xl leading-relaxed">
            {t('home.sub')}
          </p>
          {/* CTAs */}
          <div className="ak-hero-btns flex flex-col sm:flex-row gap-4 mb-14">
            <Link to="/gym-challenge-pilot" data-testid="hero-start-challenge-btn"
              className="inline-flex items-center justify-center gap-3 font-inter font-black uppercase tracking-wider text-base px-10 rounded-[14px] bg-ak-gold text-black hover:scale-105 transition-transform"
              style={{ height: '60px' }}>
              <Zap size={20} fill="black" /> {t('home.cta_primary')}
            </Link>
            <Link to="/fitness-challenge-app" data-testid="hero-explore-btn"
              className="inline-flex items-center justify-center gap-3 font-inter font-semibold uppercase tracking-wider text-sm px-8 rounded-[14px] border border-white/30 text-white hover:border-white transition-colors"
              style={{ height: '60px' }}>
              {t('home.cta_secondary')} <ArrowRight size={16} />
            </Link>
          </div>
          {/* Scroll */}
          <div className="ak-hero-scroll flex flex-col items-start gap-2" style={{ color: 'rgba(255,255,255,0.3)' }}>
            <span className="font-inter text-[10px] font-semibold tracking-[0.3em] uppercase">{t('home.scrollHint')}</span>
            <ChevronDown size={16} className="ak-bounce" />
          </div>
        </div>
      </section>

      {/* ══ STATS STRIP ══ */}
      <section className="border-y border-white/8" style={{ background: '#080808' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/8">
            {[
              { icon: <Users size={18} />, value: '26+', label: 'Active KORE', color: '#00FFFF' },
              { icon: <Activity size={18} />, value: '1000', label: 'Max K-Rating', color: '#FFD700' },
              { icon: <CheckCircle size={18} />, value: '100%', label: 'Rep Validated', color: '#00FFFF' },
              { icon: <Zap size={18} />, value: '0', label: 'Excuses Accepted', color: '#FF2D2D' },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-2 py-8 px-4">
                <div style={{ color: s.color }}>{s.icon}</div>
                <div className="font-anton text-4xl md:text-5xl" style={{ color: s.color }}>{s.value}</div>
                <div className="font-inter text-[10px] font-semibold uppercase tracking-widest text-white">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PROBLEM ══ */}
      <section data-testid="problem-section" className="py-24 md:py-28 px-6 sm:px-10" style={{ background: '#050505' }}>
        <div className="max-w-5xl mx-auto ak-reveal">
          <div className="border-l-4 pl-8 md:pl-12" style={{ borderColor: '#FF2D2D' }}>
            <div className="font-inter text-xs font-bold tracking-[0.4em] uppercase mb-5" style={{ color: '#FF2D2D' }}>{t('home.problem.badge')}</div>
            <h2 className="font-anton text-4xl md:text-6xl uppercase leading-none text-white mb-8">
              {t('home.problem.h2')}
            </h2>
            <div className="space-y-4 max-w-2xl">
              {[t('home.problem.p1'), t('home.problem.p2'), t('home.problem.p3')].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 bg-red-500 inline-block" />
                  <p className="font-inter text-base text-white leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ INSIGHT ══ */}
      <section data-testid="insight-section" className="py-20 md:py-24 px-6 sm:px-10 bg-black">
        <div className="max-w-4xl mx-auto text-center ak-reveal">
          <div className="w-10 h-1 bg-ak-cyan mx-auto mb-8 rounded" />
          <blockquote className="font-anton uppercase leading-none text-white mb-8" style={{ fontSize: 'clamp(28px,4.5vw,56px)' }}>
            "{t('home.insight.line1')}<br />
            <span style={{ color: '#00FFFF' }}>{t('home.insight.line2')}</span><br />
            {t('home.insight.line3')}<br />
            <span style={{ color: '#FFD700' }}>{t('home.insight.line4')}"</span>
          </blockquote>
          <p className="font-inter text-base text-white max-w-2xl mx-auto leading-relaxed">
            {t('home.insight.body')}
          </p>
        </div>
      </section>

      {/* ══ SOLUTION ══ */}
      <section data-testid="solution-section" className="py-24 md:py-28 px-6 sm:px-10" style={{ background: '#050505' }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="ak-reveal">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-px bg-ak-cyan" />
                <span className="font-inter text-xs font-bold tracking-[0.3em] uppercase text-ak-cyan">{t('home.solution.badge')}</span>
              </div>
              <h2 className="font-anton text-4xl md:text-5xl uppercase leading-none text-white mb-6">
                {t('home.solution.h2_line1')}<br />{t('home.solution.h2_line2')}<br />
                <span style={{ color: '#00FFFF' }}>{t('home.solution.h2_line3')}</span>
              </h2>
              <div className="space-y-4 mb-8">
                {[
                  { label: t('home.solution.feat1_label'), desc: t('home.solution.feat1_desc') },
                  { label: t('home.solution.feat2_label'), desc: t('home.solution.feat2_desc') },
                  { label: t('home.solution.feat3_label'), desc: t('home.solution.feat3_desc') },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <CheckCircle size={16} className="text-ak-cyan mt-1 flex-shrink-0" />
                    <div>
                      <span className="font-inter text-sm font-bold text-white">{item.label}</span>
                      <span className="font-inter text-sm text-white"> — {item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                to="/fitness-challenge-app"
                data-testid="solution-learn-more"
                className="inline-flex items-center gap-2 font-inter font-bold text-sm text-ak-cyan hover:underline"
              >
                See how NEXUS works <ArrowRight size={14} />
              </Link>
            </div>
            {/* Right: quick stats */}
            <div className="ak-reveal ak-delay-2 grid grid-cols-2 gap-3">
              {[
                { value: '+30%', label: 'Engagement', color: '#00FFFF' },
                { value: '+40%', label: 'Retention', color: '#FFD700' },
                { value: '15+', label: 'Disciplines', color: '#00FFFF' },
                { value: '0', label: 'Self-reported reps', color: '#FF2D2D' },
              ].map((s, i) => (
                <div key={i} className="p-6 rounded-[14px] text-center" style={{ background: '#0a0a0a', border: `1px solid ${s.color}20` }}>
                  <div className="font-anton text-4xl mb-1" style={{ color: s.color }}>{s.value}</div>
                  <div className="font-inter text-xs font-semibold text-white uppercase tracking-wider">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section data-testid="how-it-works-section" className="py-24 px-6 sm:px-10 bg-black">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14 ak-reveal">
            <div className="font-inter text-xs font-bold tracking-[0.4em] uppercase mb-4 text-ak-cyan">HOW IT WORKS</div>
            <h2 className="font-anton text-4xl md:text-5xl uppercase text-white">4 STEPS. NO EXCUSES.</h2>
          </div>
          <div className="relative">
            {/* Connector line desktop */}
            <div className="absolute left-8 top-8 bottom-8 w-px hidden md:block" style={{ background: 'linear-gradient(to bottom, #00FFFF, #FFD700)' }} />
            <div className="space-y-5">
              {HOW_STEPS.map((s, i) => (
                <div key={i} className="ak-reveal relative flex gap-6 items-start pl-0 md:pl-20" style={{ transitionDelay: `${i * 0.1}s` }}>
                  <div className="hidden md:flex absolute left-0 top-0 w-16 h-16 rounded-full items-center justify-center flex-shrink-0 font-anton text-xl"
                    style={{ background: '#0a0a0a', border: `2px solid ${s.color}`, color: s.color }}>
                    {s.num}
                  </div>
                  <div className="flex-1 p-6 rounded-[14px]" style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="md:hidden font-anton text-2xl" style={{ color: s.color }}>{s.num}</span>
                      <h3 className="font-anton text-xl uppercase text-white">{s.title}</h3>
                    </div>
                    <p className="font-inter text-sm text-white leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ USE CASES ══ */}
      <section data-testid="use-cases-section" className="py-24 px-6 sm:px-10" style={{ background: '#050505' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 ak-reveal">
            <div className="font-inter text-xs font-bold tracking-[0.4em] uppercase mb-4 text-ak-cyan">THE PLATFORM</div>
            <h2 className="font-anton text-4xl md:text-5xl uppercase text-white">BUILT FOR EVERY ARENA.</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {USE_CASES.map((c, i) => (
              <Link
                key={i}
                to={c.href}
                data-testid={`use-case-card-${i}`}
                className="group ak-reveal rounded-[14px] overflow-hidden border border-white/10 hover:border-white/30 transition-all flex flex-col"
                style={{ background: '#0a0a0a', transitionDelay: `${i * 0.08}s` }}
              >
                <div className="h-44 overflow-hidden">
                  <img src={c.img} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  <div className="h-full w-full" style={{ marginTop: '-100%', background: 'rgba(0,0,0,0.4)' }} />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3" style={{ color: c.color }}>
                    {c.icon}
                    <div className="w-6 h-px" style={{ background: c.color }} />
                  </div>
                  <h3 className="font-anton text-lg uppercase text-white mb-2 group-hover:text-ak-cyan transition-colors">{c.title}</h3>
                  <p className="font-inter text-xs text-white leading-relaxed flex-1">{c.desc}</p>
                  <div className="flex items-center gap-2 mt-4 font-inter text-xs font-bold" style={{ color: c.color }}>
                    Learn more <ArrowRight size={12} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FOR GYMS ══ */}
      <section data-testid="for-gyms-section" className="py-24 px-6 sm:px-10 bg-black">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center ak-reveal">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-px" style={{ background: '#FFD700' }} />
                <span className="font-inter text-xs font-bold tracking-[0.3em] uppercase" style={{ color: '#FFD700' }}>FOR GYM OWNERS</span>
              </div>
              <h2 className="font-anton text-4xl md:text-5xl uppercase leading-none text-white mb-6">
                BUILT FOR GYMS<br />THAT WANT<br />
                <span style={{ color: '#FFD700' }}>ENGAGED MEMBERS.</span>
              </h2>
              <p className="font-inter text-base text-white mb-8 leading-relaxed">
                The average gym loses 80% of new members within 6 months.
                ArenaKore gives you a competition layer that makes members come back —
                because now they have something to lose.
              </p>
              <div className="space-y-3 mb-8">
                {[
                  '+40% member retention',
                  'Live challenge system — no manual setup',
                  'Box vs box competition across locations',
                  '14-day free pilot. No commitment.',
                ].map((t, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle size={15} style={{ color: '#FFD700', flexShrink: 0 }} />
                    <span className="font-inter text-sm text-white">{t}</span>
                  </div>
                ))}
              </div>
              <Link
                to="/gym-challenge-pilot"
                data-testid="gyms-pilot-cta"
                className="inline-flex items-center gap-3 font-inter font-black uppercase tracking-wider text-sm px-8 rounded-[14px] bg-ak-gold text-black hover:scale-105 transition-transform"
                style={{ height: '52px' }}
              >
                <Zap size={16} fill="black" /> Start a 14-day Pilot
              </Link>
            </div>
            {/* Stats */}
            <div className="ak-reveal ak-delay-2 grid grid-cols-2 gap-4">
              {[
                { val: '14', unit: 'days', desc: 'full pilot, free', color: '#FFD700' },
                { val: '20–30', unit: 'members', desc: 'activated on day 1', color: '#00FFFF' },
                { val: '€0', unit: 'cost', desc: 'zero commitment', color: '#FFD700' },
                { val: '48h', unit: 'setup', desc: 'first challenge live', color: '#00FFFF' },
              ].map((s, i) => (
                <div key={i} className="p-6 rounded-[14px] text-center" style={{ background: '#0a0a0a', border: `2px solid ${s.color}25` }}>
                  <div className="font-anton text-3xl md:text-4xl" style={{ color: s.color }}>{s.val}</div>
                  <div className="font-inter text-xs font-bold uppercase tracking-wider text-white mt-1">{s.unit}</div>
                  <div className="font-inter text-[10px] text-white/40 mt-1">{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ FINAL CTA ══ */}
      <section data-testid="final-cta-section" className="py-24 px-6 sm:px-10" style={{ background: '#050505' }}>
        <div className="max-w-3xl mx-auto text-center ak-reveal">
          <div className="flex items-center gap-4 mb-10 justify-center">
            <div className="flex-1 max-w-[80px] h-px" style={{ background: 'rgba(0,255,255,0.3)' }} />
            <span className="ak-blink w-2 h-2 rounded-full" style={{ background: '#00FFFF', boxShadow: '0 0 8px #00FFFF', display: 'inline-block' }} />
            <div className="flex-1 max-w-[80px] h-px" style={{ background: 'rgba(0,255,255,0.3)' }} />
          </div>
          <h2 className="font-anton uppercase leading-none text-white mb-4" style={{ fontSize: 'clamp(48px,7vw,88px)' }}>
            {t('home.finalCta.h2')}
          </h2>
          <p className="font-inter text-lg text-white mb-10">
            {t('home.finalCta.sub')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/gym-challenge-pilot" data-testid="final-cta-btn"
              className="inline-flex items-center justify-center gap-3 font-inter font-black uppercase tracking-wider text-base px-12 rounded-[14px] bg-ak-gold text-black hover:scale-105 transition-transform"
              style={{ height: '60px' }}>
              <Zap size={20} fill="black" /> {t('home.finalCta.cta')}
            </Link>
            <Link to="/for-gyms" data-testid="final-gyms-btn"
              className="inline-flex items-center justify-center gap-3 font-inter font-bold uppercase tracking-wider text-sm px-8 rounded-[14px] border border-white/20 text-white hover:border-white transition-colors"
              style={{ height: '60px' }}>
              {t('home.finalCta.gyms')} <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <InnerFooter />
    </div>
  );
}
