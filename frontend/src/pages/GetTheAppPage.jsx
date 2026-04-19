import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Activity, Trophy, Swords, ArrowRight, ChevronDown } from 'lucide-react';
import { InnerNavbar, InnerFooter, useSEO } from '../components/SharedLayout';
import { trackGetAppClick } from '../utils/tracking';
import { useScrollTracking } from '../hooks/useScrollTracking';

/* ─── Config ─── */
const APP_STORE_URL  = process.env.REACT_APP_APPSTORE_URL  || '#';
const PLAY_STORE_URL = process.env.REACT_APP_PLAYSTORE_URL || '#';

/* ─── Assets ─── */
const SCREEN_MAIN = 'https://customer-assets.emergentagent.com/job_d04435a4-d02c-4e45-bfc3-de61c2e4c642/artifacts/z6iebv8u_Screenshot%202026-04-13%20at%208.05.30%E2%80%AFPM.png';
const SCREEN_NEXUS= 'https://customer-assets.emergentagent.com/job_d04435a4-d02c-4e45-bfc3-de61c2e4c642/artifacts/hiwev2hk_Screenshot%202026-04-13%20at%208.05.50%E2%80%AFPM.png';
const SCREEN_DNA  = 'https://customer-assets.emergentagent.com/job_d04435a4-d02c-4e45-bfc3-de61c2e4c642/artifacts/q1wbu4hw_Screenshot%202026-04-13%20at%208.06.21%E2%80%AFPM.png';

/* ─── Store buttons ─── */
function StoreButton({ href, type, source }) {
  const isApple = type === 'apple';
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-testid={isApple ? 'app-store-btn' : 'play-store-btn'}
      onClick={() => trackGetAppClick(source || 'get_the_app')}
      className="inline-flex items-center gap-4 rounded-[14px] border border-white/20 hover:border-white/60 transition-all group"
      style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', height: '64px', padding: '0 24px', minWidth: '180px' }}
    >
      {isApple ? (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white" style={{ flexShrink: 0 }}>
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
        </svg>
      ) : (
        <svg width="22" height="22" viewBox="0 0 512 512" fill="white" style={{ flexShrink: 0 }}>
          <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c17.1-9.8 17.1-35.2-.1-60.8h-1.1zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/>
        </svg>
      )}
      <div className="text-left">
        <div className="font-inter text-[10px] text-white/50 leading-none mb-0.5 uppercase tracking-wider">
          {isApple ? 'Download on the' : 'Get it on'}
        </div>
        <div className="font-inter text-base font-bold text-white leading-none group-hover:text-ak-cyan transition-colors">
          {isApple ? 'App Store' : 'Google Play'}
        </div>
      </div>
    </a>
  );
}

export default function GetTheAppPage() {
  const { t } = useTranslation();
  useScrollTracking('get_the_app');

  useSEO({
    title: 'Download ArenaKore — Enter the Arena',
    description: 'Track your performance. Get ranked. Compete in any discipline. Download ArenaKore on App Store and Google Play.',
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

      {/* ══ S1: HERO ══ */}
      <section data-testid="get-app-hero" className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(0,255,255,0.04) 0%, transparent 70%)' }} />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(255,215,0,0.03) 0%, transparent 70%)' }} />

        <div className="max-w-7xl mx-auto px-6 sm:px-10 w-full grid md:grid-cols-2 gap-12 items-center py-20 md:py-28">
          {/* Left: copy */}
          <div>
            <div className="ak-hero-badge flex items-center gap-3 mb-8">
              <span className="w-2 h-2 rounded-full bg-ak-cyan inline-block" style={{ boxShadow: '0 0 8px #00FFFF' }} />
              <span className="font-inter text-xs font-bold tracking-[0.35em] uppercase text-ak-cyan">FREE DOWNLOAD</span>
            </div>

            <h1 className="ak-hero-title font-anton uppercase leading-[0.88] text-white mb-6"
              style={{ fontSize: 'clamp(60px,9vw,108px)' }}>
              ENTER<br />THE<br />
              <span style={{ color: '#00FFFF' }}>ARENA.</span>
            </h1>

            <p className="ak-hero-sub font-inter text-lg md:text-xl text-white mb-3 leading-snug font-medium">
              Track your performance.
            </p>
            <p className="ak-hero-sub font-inter text-lg md:text-xl text-white mb-10 leading-snug" style={{ opacity: 0.6 }}>
              Get ranked. Compete.
            </p>

            {/* Store buttons */}
            <div className="ak-hero-btns flex flex-col sm:flex-row gap-3 mb-10">
              <StoreButton href={APP_STORE_URL} type="apple" source="hero" />
              <StoreButton href={PLAY_STORE_URL} type="android" source="hero" />
            </div>

            <p className="font-inter text-xs text-white/30 uppercase tracking-widest">
              Free · No credit card · Available worldwide
            </p>
          </div>

          {/* Right: Phone mockups */}
          <div className="ak-hero-btns flex items-end justify-center gap-4 relative">
            {/* Back phone */}
            <div className="relative flex-shrink-0"
              style={{ width: '180px', marginBottom: '32px', filter: 'brightness(0.6) blur(1px)' }}>
              <div className="rounded-[28px] overflow-hidden"
                style={{ border: '1.5px solid rgba(255,255,255,0.08)', boxShadow: '0 20px 60px rgba(0,0,0,0.8)' }}>
                <img src={SCREEN_DNA} alt="DNA" className="w-full block" loading="lazy" />
              </div>
            </div>
            {/* Main phone */}
            <div className="relative flex-shrink-0" style={{ width: '220px', zIndex: 2 }}>
              <div className="rounded-[32px] overflow-hidden"
                style={{ border: '2px solid rgba(0,255,255,0.25)', boxShadow: '0 0 60px rgba(0,255,255,0.12), 0 40px 80px rgba(0,0,0,0.9)' }}>
                <img src={SCREEN_MAIN} alt="ArenaKore App" className="w-full block" loading="lazy" />
              </div>
              {/* Live badge on phone */}
              <div className="absolute -top-3 -right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                style={{ background: '#0a0a0a', border: '1px solid rgba(255,45,45,0.4)' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block animate-pulse" />
                <span className="font-inter text-[9px] font-black uppercase tracking-wider text-white">LIVE</span>
              </div>
            </div>
            {/* Third phone */}
            <div className="relative flex-shrink-0"
              style={{ width: '160px', marginBottom: '48px', filter: 'brightness(0.55) blur(1px)' }}>
              <div className="rounded-[24px] overflow-hidden"
                style={{ border: '1.5px solid rgba(255,255,255,0.06)', boxShadow: '0 20px 60px rgba(0,0,0,0.8)' }}>
                <img src={SCREEN_NEXUS} alt="NEXUS" className="w-full block" loading="lazy" />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/25">
          <ChevronDown size={18} className="ak-bounce" />
        </div>
      </section>

      {/* ══ S2: WHAT YOU GET ══ */}
      <section data-testid="what-you-get-section" className="py-24 md:py-28 px-6 sm:px-10" style={{ background: '#050505' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 ak-reveal">
            <div className="font-inter text-xs font-bold tracking-[0.4em] uppercase mb-5 text-ak-cyan">WHAT YOU GET</div>
            <h2 className="font-anton text-4xl md:text-5xl uppercase leading-none text-white">
              THREE THINGS.<br /><span style={{ color: '#00FFFF' }}>ZERO EXCUSES.</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-px" style={{ background: 'rgba(255,255,255,0.05)' }}>
            {[
              {
                icon: <Activity size={32} />,
                num: '01',
                title: 'TRACK',
                headline: 'Every performance is recorded.',
                body: 'NEXUS validates every rep, every result. Nothing is lost. Nothing is inflated. Your history is permanent.',
                color: '#00FFFF',
              },
              {
                icon: <Trophy size={32} />,
                num: '02',
                title: 'RANK',
                headline: 'You are not training. You are competing.',
                body: 'K-Rating from 0 to 1000. Updated after every session. Compared globally. You always know where you stand.',
                color: '#FFD700',
              },
              {
                icon: <Swords size={32} />,
                num: '03',
                title: 'CHALLENGE',
                headline: 'Launch or accept challenges anytime.',
                body: 'Direct 1v1. Open events. Live competitions. The Arena is always open. There is always someone to beat.',
                color: '#00FFFF',
              },
            ].map((item, i) => (
              <div key={i} data-testid={`what-block-${i}`}
                className="ak-reveal p-10 flex flex-col gap-6"
                style={{ background: '#0a0a0a', transitionDelay: `${i * 0.1}s` }}>
                <div style={{ color: item.color }}>{item.icon}</div>
                <div>
                  <div className="font-inter text-[10px] font-bold uppercase tracking-[0.4em] mb-2" style={{ color: item.color }}>
                    {item.num} / {item.title}
                  </div>
                  <h3 className="font-anton text-2xl uppercase text-white leading-tight mb-3">{item.headline}</h3>
                  <p className="font-inter text-sm text-white leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ S3: MULTI-SPORT ══ */}
      <section data-testid="multi-sport-section" className="py-24 px-6 sm:px-10 bg-black">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="ak-reveal">
              <div className="font-inter text-xs font-bold tracking-[0.4em] uppercase mb-5 text-ak-gold">YOUR ARENA</div>
              <h2 className="font-anton text-4xl md:text-5xl uppercase leading-none text-white mb-6">
                YOUR SPORT.<br />
                <span style={{ color: '#FFD700' }}>YOUR ARENA.</span>
              </h2>
              <p className="font-inter text-base text-white mb-8 leading-relaxed">
                ArenaKore works across any discipline. One identity. One ranking. Any sport.
              </p>
              <Link to="/arena-system" className="inline-flex items-center gap-2 font-inter text-sm font-bold text-ak-cyan hover:underline">
                See how it works <ArrowRight size={14} />
              </Link>
            </div>
            <div className="ak-reveal ak-delay-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: 'Basketball',  color: '#FF2D2D' },
                { label: 'Running',     color: '#00FFFF' },
                { label: 'Swimming',    color: '#00FFFF' },
                { label: 'CrossFit',    color: '#FFD700' },
                { label: 'Golf',        color: '#FFD700' },
                { label: 'Surf',        color: '#00FFFF' },
              ].map((sport, i) => (
                <div key={i} className="flex items-center gap-2.5 p-4 rounded-[12px] group hover:scale-[1.02] transition-transform"
                  style={{ background: '#0a0a0a', border: `1px solid ${sport.color}18` }}>
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: sport.color }} />
                  <span className="font-inter text-sm font-semibold text-white">{sport.label}</span>
                </div>
              ))}
              <div className="flex items-center gap-2.5 p-4 rounded-[12px] col-span-2 sm:col-span-3"
                style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.08)' }}>
                <span className="font-inter text-xs text-white/40 uppercase tracking-wider">+ Any performance-based activity</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ S4: SOCIAL PROOF ══ */}
      <section data-testid="social-proof-section" className="py-20 px-6 sm:px-10 border-y border-white/5" style={{ background: '#050505' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 ak-reveal">
            <p className="font-inter text-base text-white leading-relaxed">
              Early athletes are already competing worldwide.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px ak-reveal" style={{ background: 'rgba(255,255,255,0.04)' }}>
            {[
              { value: '1,000+', label: 'Performances tracked', color: '#00FFFF' },
              { value: '26+',    label: 'Active KORE athletes', color: '#FFD700' },
              { value: '15+',    label: 'Disciplines covered',  color: '#00FFFF' },
              { value: '0',      label: 'Excuses accepted',     color: '#FF2D2D' },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-2 py-10 px-6 text-center" style={{ background: '#0a0a0a' }}>
                <div className="font-anton text-4xl md:text-5xl" style={{ color: s.color }}>{s.value}</div>
                <div className="font-inter text-xs font-semibold text-white uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ S5: FINAL CTA ══ */}
      <section data-testid="final-cta-section" className="py-28 md:py-36 px-6 sm:px-10 bg-black relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(0,255,255,0.04) 0%, transparent 65%)' }} />

        <div className="relative z-10 max-w-3xl mx-auto text-center ak-reveal">
          <div className="w-12 h-1 bg-ak-cyan mx-auto mb-10 rounded" />

          <h2 className="font-anton uppercase leading-none text-white mb-6"
            style={{ fontSize: 'clamp(52px,8vw,96px)' }}>
            STOP<br />TRAINING.
          </h2>
          <h2 className="font-anton uppercase leading-none mb-10"
            style={{ fontSize: 'clamp(52px,8vw,96px)', color: '#FFD700' }}>
            START<br />COMPETING.
          </h2>

          <p className="font-inter text-base text-white mb-12 max-w-md mx-auto leading-relaxed">
            The Arena is open. Your rank is waiting. Every day you delay is a day someone else moves ahead.
          </p>

          {/* Store buttons centered */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <StoreButton href={APP_STORE_URL} type="apple" source="final_cta" />
            <StoreButton href={PLAY_STORE_URL} type="android" source="final_cta" />
          </div>

          {/* Secondary CTA */}
          <Link to="/arena-system" data-testid="join-arena-link"
            className="inline-flex items-center gap-2 font-inter text-sm font-bold text-ak-cyan hover:underline">
            Learn about the Arena System <ArrowRight size={14} />
          </Link>

          <p className="font-inter text-xs text-white/25 mt-8 uppercase tracking-widest">
            Free to download · Available worldwide
          </p>
        </div>
      </section>

      <InnerFooter />
    </div>
  );
}
