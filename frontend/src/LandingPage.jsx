import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Zap, ChevronDown, Shield, Trophy, Users, Dumbbell,
  Activity, Scan, ArrowRight, CheckCircle, Target,
  Waves, PersonStanding, Circle
} from 'lucide-react';
import { InnerNavbar, InnerFooter, useSEO } from './components/SharedLayout';
import { IMGS } from './data/seo-content';
import SchemaMarkup from './components/SchemaMarkup';
import { useTranslation } from 'react-i18next';

const HERO_BG = 'https://customer-assets.emergentagent.com/job_nexus-arena-11/artifacts/g6ba12ic_ChatGPT%20Image%20Apr%2015%2C%202026%2C%2011_23_53%20AM.png';

// Hero slider images — premium Nike-style multi-sport
const HERO_SLIDES_DEFAULT = [
  { img: HERO_BG,                                                                                                   sport: 'CROSSFIT',    pos: 'center 15%'  },
  { img: 'https://images.unsplash.com/photo-1726195221766-e4594ff9d025?crop=entropy&cs=srgb&fm=jpg&q=90&w=1600',  sport: 'RUNNING',     pos: 'center center' },
  { img: 'https://images.pexels.com/photos/30050101/pexels-photo-30050101.jpeg?auto=compress&cs=tinysrgb&w=1600', sport: 'BASKETBALL',  pos: 'center center' },
  { img: 'https://images.pexels.com/photos/6011896/pexels-photo-6011896.jpeg?auto=compress&cs=tinysrgb&w=1600',   sport: 'SWIMMING',    pos: 'center center' },
  { img: 'https://images.pexels.com/photos/29015508/pexels-photo-29015508.jpeg?auto=compress&cs=tinysrgb&w=1600', sport: 'MMA',         pos: 'center 20%'   },
  { img: 'https://images.pexels.com/photos/33453950/pexels-photo-33453950.jpeg?auto=compress&cs=tinysrgb&w=1600', sport: 'SURF',        pos: 'center center' },
];

const IMG_RUNNER     = 'https://images.unsplash.com/photo-1589104666851-dffe3a15aace?crop=entropy&cs=srgb&fm=jpg&q=85&w=800';
const IMG_BASKETBALL = 'https://images.pexels.com/photos/30050102/pexels-photo-30050102.jpeg?auto=compress&cs=tinysrgb&w=800';
const IMG_SWIMMER    = 'https://images.unsplash.com/photo-1682353242312-2e1f8c5dfd9a?crop=entropy&cs=srgb&fm=jpg&q=85&w=800';
const IMG_GOLF       = 'https://images.unsplash.com/photo-1609408960307-ed11e7fb151f?crop=entropy&cs=srgb&fm=jpg&q=85&w=800';

const DISCIPLINES = [
  {
    title: 'Fitness & CrossFit',
    sub: 'PRIMARY USE CASE',
    desc: 'Daily challenges, NEXUS rep validation, box vs box competition.',
    href: '/fitness-challenge-app',
    color: '#00FFFF', img: IMGS.barbell, primary: true,
  },
  {
    title: 'Running',
    sub: 'ANY DISTANCE',
    desc: 'Time, pace, splits. Compete against runners worldwide.',
    href: '/workout-competition',
    color: '#FFD700', img: IMG_RUNNER,
  },
  {
    title: 'Basketball',
    sub: 'REPS & DRILLS',
    desc: 'Shots, dribbling, 1v1. Your court becomes a leaderboard.',
    href: '/workout-competition',
    color: '#FF2D2D', img: IMG_BASKETBALL,
  },
  {
    title: 'Swimming',
    sub: 'SPEED & SPLITS',
    desc: 'Lap times, stroke analysis, competitive performance data.',
    href: '/workout-competition',
    color: '#00FFFF', img: IMG_SWIMMER,
  },
  {
    title: 'Golf',
    sub: 'STROKE PLAY',
    desc: 'Scorecard competition. Handicap-based ranking. Permanent results.',
    href: '/workout-competition',
    color: '#FFD700', bg: 'linear-gradient(135deg,#0a1a00 0%,#000 100%)',
  },
  {
    title: 'Surf & Kitesurf',
    sub: 'WAVE PERFORMANCE',
    desc: 'Session scoring, outdoor competition. The ocean is your arena.',
    href: '/workout-competition',
    color: '#00FFFF', bg: 'linear-gradient(135deg,#001a2a 0%,#000 100%)',
  },
  {
    title: 'Team Sports',
    sub: 'COLLECTIVE RANKING',
    desc: 'Group challenges, team K-Flux. Compete as a unit.',
    href: '/gym-challenge-pilot',
    color: '#FFD700', img: IMGS.competition,
  },
  {
    title: 'Personal Challenges',
    sub: 'ANY ACTIVITY',
    desc: 'Set your own standard. Any movement. Any goal. Your rules.',
    href: '/for-athletes',
    color: '#FF2D2D', img: IMGS.pullup,
  },
];

const HOW_STEPS = [
  { num: '01', title: 'Join a challenge', desc: 'Pick any discipline, set your target. Open challenge or 1v1.', color: '#00FFFF' },
  { num: '02', title: 'Track your performance', desc: 'NEXUS validates every rep. Bad form doesn\'t count. Anywhere.', color: '#00FFFF' },
  { num: '03', title: 'Climb the ranking', desc: 'K-Rating updates after every performance. Public. Permanent.', color: '#FFD700' },
  { num: '04', title: 'Compete daily', desc: 'New challenges every day across every discipline.', color: '#FFD700' },
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [slide, setSlide] = useState(0);
  const [heroSlides, setHeroSlides] = useState(HERO_SLIDES_DEFAULT);
  const { t } = useTranslation();
  const API = process.env.REACT_APP_BACKEND_URL + '/api';

  useSEO({
    title: 'ArenaKore — The Multi-Sport Competition Platform',
    description: 'Turn every performance into a challenge. Any sport, any discipline. Daily challenges, live rankings, validated performance. The competition never ends.',
  });

  // Load hero slides from DB, fallback to defaults
  useEffect(() => {
    axios.get(`${API}/hero-slides`).then(r => {
      if (r.data?.length >= 2) {
        setHeroSlides(r.data.map(s => ({ img: s.image_url, sport: s.sport_label, pos: s.position || 'center center' })));
      }
    }).catch(() => {});
  }, [API]);

  useSEO({
    title: 'ArenaKore — The Multi-Sport Competition Platform',
    description: 'Turn every performance into a challenge. Any sport, any discipline. Daily challenges, live rankings, validated performance. The competition never ends.',
  });

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Hero slider — auto-rotate every 4s
  useEffect(() => {
    const timer = setInterval(() => {
      setSlide(prev => (prev + 1) % heroSlides.length);
    }, 4000);
    return () => clearInterval(timer);
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

      {/* ══ HERO — FULLSCREEN MULTI-SPORT SLIDER ══ */}
      <section
        data-testid="hero-section"
        className="relative min-h-screen flex flex-col justify-end pt-16 overflow-hidden"
      >
        {/* Slider images — cross-fade stack */}
        {heroSlides.map((s, i) => (
          <div
            key={i}
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${s.img})`,
              backgroundSize: 'cover',
              backgroundPosition: s.pos,
              opacity: i === slide ? 1 : 0,
              transition: 'opacity 1.2s ease-in-out',
              willChange: 'opacity',
            }}
          />
        ))}

        {/* Dark overlay — ultra-thin veil 0.05, gradient for text readability */}
        <div className="absolute inset-0 z-[1]"
          style={{ background: 'linear-gradient(160deg,rgba(0,0,0,0.05) 0%,rgba(0,0,0,0.15) 40%,rgba(0,0,0,0.82) 100%)' }} />

        {/* Slide indicator dots */}
        <div className="absolute bottom-6 right-6 z-10 flex items-center gap-2">
          {heroSlides.map((s, i) => (
            <button key={i} onClick={() => setSlide(i)}
              className="flex items-center gap-1.5 transition-all"
              aria-label={`Slide ${i + 1}`}>
              <div className="rounded-full transition-all duration-300"
                style={{
                  width: i === slide ? '20px' : '6px',
                  height: '4px',
                  background: i === slide ? '#00FFFF' : 'rgba(255,255,255,0.2)',
                }} />
            </button>
          ))}
        </div>

        {/* Sport label — bottom right above dots */}
        <div className="absolute bottom-14 right-6 z-10">
          <span
            key={slide}
            className="font-inter text-[9px] font-black uppercase tracking-[0.4em]"
            style={{ color: 'rgba(0,255,255,0.6)',
              animation: 'ak-fade-label .4s ease both' }}
          >
            {heroSlides[slide].sport}
          </span>
        </div>

        {/* Hero content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-10 pb-20 md:pb-28 w-full">
          {/* Badge */}
          <div className="ak-hero-badge flex items-center gap-3 mb-6">
            <span className="ak-blink w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ background: '#FF2D2D', boxShadow: '0 0 8px #FF2D2D', display: 'inline-block' }} />
            <span className="font-inter text-xs font-bold tracking-[0.3em] uppercase text-white">
              NEXUS LIVE · GLOBAL COMPETITION ACTIVE
            </span>
          </div>
          {/* H1 */}
          <h1 className="ak-hero-title font-anton uppercase leading-[0.92] text-white mb-6"
            style={{ fontSize: 'clamp(52px,8vw,96px)' }}>
            {t('home.h1_line1')}<br />
            <span style={{ color: '#00FFFF' }}>{t('home.h1_line2')}</span>
          </h1>
          {/* Sub */}
          <p className="ak-hero-sub font-inter text-lg md:text-xl text-white mb-10 max-w-xl leading-relaxed">
            {t('home.sub')}
          </p>
          {/* CTAs */}
          <div className="ak-hero-btns flex flex-col sm:flex-row gap-4 mb-14">
            <Link to="/get-the-app" data-testid="hero-download-app-btn"
              className="inline-flex items-center justify-center gap-3 font-inter font-black uppercase tracking-wider text-base px-10 rounded-[14px] bg-ak-gold text-black hover:scale-105 transition-transform"
              style={{ height: '60px' }}>
              <Zap size={20} fill="black" /> {t('cta.downloadApp')}
            </Link>
            <Link to="/gym-challenge-pilot" data-testid="hero-for-gyms-btn"
              className="inline-flex items-center justify-center gap-3 font-inter font-semibold uppercase tracking-wider text-sm px-8 rounded-[14px] border border-white/30 text-white hover:border-white transition-colors"
              style={{ height: '60px' }}>
              For Gyms & Coaches <ArrowRight size={16} />
            </Link>
          </div>
          {/* Scroll indicator */}
          <div className="ak-hero-scroll flex flex-col items-start gap-2" style={{ color: 'rgba(255,255,255,0.3)' }}>
            <span className="font-inter text-[10px] font-semibold tracking-[0.3em] uppercase">{t('home.scrollHint')}</span>
            <ChevronDown size={16} className="ak-bounce" />
          </div>
        </div>
      </section>

      {/* ══ STATS STRIP ══ */}
      <section className="border-y border-white/5" style={{ background: '#080808' }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap justify-center">
            {[
              { icon: <Users size={16} />, value: '26+', label: t('home.stats.active'), color: '#00FFFF' },
              { icon: <Activity size={16} />, value: '1000', label: t('home.stats.rating'), color: '#FFD700' },
              { icon: <CheckCircle size={16} />, value: '100%', label: t('home.stats.validated'), color: '#00FFFF' },
              { icon: <Zap size={16} />, value: '0', label: t('home.stats.excuses'), color: '#FF2D2D' },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-2 py-10 px-8 md:px-14 relative">
                {i > 0 && <div className="absolute left-0 top-1/4 bottom-1/4 w-px" style={{ background: 'rgba(255,255,255,0.07)' }} />}
                <div style={{ color: s.color }}>{s.icon}</div>
                <div className="font-anton text-4xl md:text-5xl" style={{ color: s.color }}>{s.value}</div>
                <div className="font-inter text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.45)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ POSITIONING BLOCK ══ */}
      <section data-testid="positioning-section" className="py-20 md:py-24 px-6 sm:px-10 border-b border-white/8" style={{ background: '#000' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center ak-reveal">
            <div>
              <div className="font-inter text-xs font-bold tracking-[0.4em] uppercase mb-5 text-ak-cyan">THE PLATFORM</div>
              <h2 className="font-anton text-4xl md:text-6xl uppercase leading-none text-white">
                ONE SYSTEM.<br /><span style={{ color: '#00FFFF' }}>ANY DISCIPLINE.</span>
              </h2>
            </div>
            <div>
              <p className="font-inter text-base text-white leading-relaxed mb-8">
                ArenaKore is a competition platform designed for any performance-based activity — from fitness and CrossFit to basketball, running, swimming and beyond.
              </p>
              <p className="font-inter text-sm text-white mb-8 leading-relaxed" style={{ borderLeft: '3px solid #FFD700', paddingLeft: '1rem' }}>
                <strong className="text-ak-gold">Today:</strong> Fitness & CrossFit.<br />
                <strong className="text-white">Tomorrow:</strong> Every sport on the planet.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Fitness', 'CrossFit', 'Running', 'Basketball', 'Swimming', 'Golf', 'Surf', 'Team Sports'].map((s, i) => (
                  <span key={i} className="font-inter text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border"
                    style={{ borderColor: i < 2 ? 'rgba(0,255,255,0.4)' : 'rgba(255,255,255,0.15)', color: i < 2 ? '#00FFFF' : 'rgba(255,255,255,0.6)' }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
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

      {/* ══ DISCIPLINES GRID ══ */}
      <section data-testid="disciplines-section" className="py-24 px-6 sm:px-10" style={{ background: '#050505' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 ak-reveal">
            <div className="font-inter text-xs font-bold tracking-[0.4em] uppercase mb-4 text-ak-cyan">EVERY ARENA</div>
            <h2 className="font-anton text-4xl md:text-5xl uppercase text-white">BUILT FOR EVERY DISCIPLINE.</h2>
            <p className="font-inter text-sm text-white mt-4 max-w-xl mx-auto">One ranking system. One identity. Any sport.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {DISCIPLINES.map((d, i) => (
              <Link key={i} to={d.href} data-testid={`discipline-card-${i}`}
                className="group ak-reveal rounded-[14px] overflow-hidden border border-white/10 hover:border-white/25 transition-all flex flex-col"
                style={{ background: '#0a0a0a', transitionDelay: `${i * 0.06}s`, minHeight: '220px' }}
              >
                {/* Image or gradient bg */}
                <div className="relative overflow-hidden" style={{ height: '130px' }}>
                  {d.img ? (
                    <img src={d.img} alt={d.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  ) : (
                    <div className="w-full h-full" style={{ background: d.bg }} />
                  )}
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom,rgba(0,0,0,0.2) 0%,rgba(0,0,0,0.7) 100%)' }} />
                  {d.primary && (
                    <div className="absolute top-3 left-3 font-inter text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded" style={{ background: '#00FFFF', color: '#000' }}>
                      ★ Primary
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3">
                    <div className="font-inter text-[9px] font-bold uppercase tracking-widest" style={{ color: d.color }}>{d.sub}</div>
                  </div>
                </div>
                {/* Content */}
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-anton text-base uppercase text-white mb-1 group-hover:text-ak-cyan transition-colors leading-tight">{d.title}</h3>
                  <p className="font-inter text-xs text-white leading-relaxed flex-1">{d.desc}</p>
                  <div className="flex items-center gap-1 mt-3 font-inter text-[10px] font-bold" style={{ color: d.color }}>
                    Explore <ArrowRight size={10} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {/* Global positioning statement */}
          <div className="mt-12 ak-reveal p-6 rounded-[14px] text-center" style={{ background: '#0a0a0a', border: '1px solid rgba(0,255,255,0.15)' }}>
            <p className="font-inter text-sm text-white leading-relaxed">
              <span style={{ color: '#00FFFF' }} className="font-bold">ArenaKore</span> is a universal competition system for any performance-based activity.
              {' '}<Link to="/fitness-challenge-app" className="underline" style={{ color: '#FFD700' }}>Start with fitness</Link> — expand to any discipline.
            </p>
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
              <Link to="/for-athletes" data-testid="home-for-athletes-link"
                className="inline-flex items-center gap-2 font-inter font-semibold text-sm text-ak-cyan hover:underline">
                For Athletes <ArrowRight size={14} />
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
