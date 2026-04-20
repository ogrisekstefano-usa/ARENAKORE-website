import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Activity, Trophy, Swords, ArrowRight, ChevronDown } from 'lucide-react';
import { InnerNavbar, InnerFooter, useSEO } from '../components/SharedLayout';
import { trackGetAppClick, trackConversion } from '../utils/tracking';
import { useScrollTracking } from '../hooks/useScrollTracking';
import usePageContent from '../hooks/usePageContent';

const APP_STORE_URL  = process.env.REACT_APP_APPSTORE_URL  || '#';
const PLAY_STORE_URL = process.env.REACT_APP_PLAYSTORE_URL || '#';

const SCREEN_MAIN = 'https://customer-assets.emergentagent.com/job_d04435a4-d02c-4e45-bfc3-de61c2e4c642/artifacts/z6iebv8u_Screenshot%202026-04-13%20at%208.05.30%E2%80%AFPM.png';
const SCREEN_NEXUS= 'https://customer-assets.emergentagent.com/job_d04435a4-d02c-4e45-bfc3-de61c2e4c642/artifacts/hiwev2hk_Screenshot%202026-04-13%20at%208.05.50%E2%80%AFPM.png';
const SCREEN_DNA  = 'https://customer-assets.emergentagent.com/job_d04435a4-d02c-4e45-bfc3-de61c2e4c642/artifacts/q1wbu4hw_Screenshot%202026-04-13%20at%208.06.21%E2%80%AFPM.png';

function StoreButton({ href, type, source }) {
  const { t } = useTranslation();
  const isApple = type === 'apple';
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      data-testid={isApple ? 'app-store-btn' : 'play-store-btn'}
      onClick={() => {
        trackGetAppClick(source || 'get_the_app');
        trackConversion({ action: 'app_download', source_cta_key: 'cta_get_app', page: 'get-the-app', position: source || 'hero' });
      }}
      className="inline-flex items-center gap-4 rounded-[14px] border border-white/20 hover:border-white/60 transition-all group"
      style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', height: '64px', padding: '0 24px', minWidth: '180px' }}>
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
          {isApple ? t('getApp.store_apple_top') : t('getApp.store_google_top')}
        </div>
        <div className="font-inter text-base font-bold text-white leading-none group-hover:text-ak-cyan transition-colors">
          {isApple ? t('getApp.store_apple_bottom') : t('getApp.store_google_bottom')}
        </div>
      </div>
    </a>
  );
}

export default function GetTheAppPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.slice(0, 2) || 'en';
  const { content: cms } = usePageContent('get-the-app', lang);
  useScrollTracking('get_the_app');

  useSEO({
    title: `${cms('hero_h1', t('getApp.h1_line1'))} ${t('getApp.h1_line2')} ${t('getApp.h1_line3')} | ArenaKore`,
    description: `${cms('hero_sub1', t('getApp.sub1'))} ${cms('hero_sub2', t('getApp.sub2'))} ${cms('hero_tension', t('getApp.tension'))}`,
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
          {/* Copy */}
          <div>
            <div className="ak-hero-badge flex items-center gap-3 mb-8">
              <span className="w-2 h-2 rounded-full bg-ak-cyan inline-block" style={{ boxShadow: '0 0 8px #00FFFF' }} />
              <span className="font-inter text-xs font-bold tracking-[0.35em] uppercase text-ak-cyan">{cms('hero_badge', t('getApp.badge'))}</span>
            </div>

            <h1 className="ak-hero-title font-anton uppercase leading-[0.88] text-white mb-5"
              style={{ fontSize: 'clamp(60px,9vw,108px)' }}>
              {cms('hero_h1', t('getApp.h1_line1'))}<br />{t('getApp.h1_line2')}<br />
              <span style={{ color: '#00FFFF' }}>{t('getApp.h1_line3')}</span>
            </h1>

            {/* Tension line */}
            <p className="ak-hero-sub font-inter text-sm font-bold uppercase tracking-[0.2em] mb-5"
              style={{ color: 'rgba(255,45,45,0.85)' }}>
              {cms('hero_tension', t('getApp.tension'))}
            </p>

            <p className="ak-hero-sub font-inter text-lg text-white mb-1 leading-snug font-medium">{cms('hero_sub1', t('getApp.sub1'))}</p>
            <p className="ak-hero-sub font-inter text-lg mb-10 leading-snug" style={{ color: 'rgba(255,255,255,0.55)' }}>{cms('hero_sub2', t('getApp.sub2'))}</p>

            {/* Available now */}
            <p className="font-inter text-xs font-bold uppercase tracking-[0.3em] mb-4 text-ak-gold">
              {cms('available', t('getApp.available'))}
            </p>

            {/* Store buttons */}
            <div className="ak-hero-btns flex flex-col sm:flex-row gap-3 mb-4">
              <StoreButton href={APP_STORE_URL} type="apple" source="hero" />
              <StoreButton href={PLAY_STORE_URL} type="android" source="hero" />
            </div>

            {/* Download time hint */}
            <p className="font-inter text-xs mb-6" style={{ color: 'rgba(255,255,255,0.25)' }}>
              {cms('download_time', t('getApp.download_time'))}
            </p>
            <p className="font-inter text-xs uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.2)' }}>
              {cms('free_note', t('getApp.free_note'))}
            </p>
          </div>

          {/* Phone mockups */}
          <div className="ak-hero-btns flex items-end justify-center gap-4">
            <div style={{ width: '180px', marginBottom: '32px', filter: 'brightness(0.55) blur(1px)', flexShrink: 0 }}>
              <div className="rounded-[28px] overflow-hidden"
                style={{ border: '1.5px solid rgba(255,255,255,0.06)', boxShadow: '0 20px 60px rgba(0,0,0,0.8)' }}>
                <img src={SCREEN_DNA} alt="DNA" className="w-full block" loading="lazy" />
              </div>
            </div>
            <div style={{ width: '220px', zIndex: 2, flexShrink: 0, position: 'relative' }}>
              <div className="rounded-[32px] overflow-hidden"
                style={{ border: '2px solid rgba(0,255,255,0.25)', boxShadow: '0 0 60px rgba(0,255,255,0.12),0 40px 80px rgba(0,0,0,0.9)' }}>
                <img src={SCREEN_MAIN} alt="ArenaKore" className="w-full block" loading="lazy" />
              </div>
              <div className="absolute -top-3 -right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                style={{ background: '#0a0a0a', border: '1px solid rgba(255,45,45,0.4)' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block animate-pulse" />
                <span className="font-inter text-[9px] font-black uppercase tracking-wider text-white">LIVE</span>
              </div>
            </div>
            <div style={{ width: '160px', marginBottom: '48px', filter: 'brightness(0.5) blur(1px)', flexShrink: 0 }}>
              <div className="rounded-[24px] overflow-hidden"
                style={{ border: '1.5px solid rgba(255,255,255,0.05)', boxShadow: '0 20px 60px rgba(0,0,0,0.8)' }}>
                <img src={SCREEN_NEXUS} alt="NEXUS" className="w-full block" loading="lazy" />
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/25">
          <ChevronDown size={18} className="ak-bounce" />
        </div>
      </section>

      {/* ══ S2: WHAT YOU GET ══ */}
      <section data-testid="what-you-get-section" className="py-24 md:py-28 px-6 sm:px-10" style={{ background: '#050505' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 ak-reveal">
            <div className="font-inter text-xs font-bold tracking-[0.4em] uppercase mb-5 text-ak-cyan">{cms('what_badge', t('getApp.what_label'))}</div>
            <h2 className="font-anton text-4xl md:text-5xl uppercase leading-none text-white">
              {cms('what_h2', t('getApp.what_h2_line1'))}<br /><span style={{ color: '#00FFFF' }}>{t('getApp.what_h2_line2')}</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-px" style={{ background: 'rgba(255,255,255,0.05)' }}>
            {[
              { icon: <Activity size={32} />, badge: 'track_badge', headline: 'track_headline', body: 'track_body', color: '#00FFFF' },
              { icon: <Trophy size={32} />,   badge: 'rank_badge',  headline: 'rank_headline',  body: 'rank_body',  color: '#FFD700' },
              { icon: <Swords size={32} />,   badge: 'challenge_badge', headline: 'challenge_headline', body: 'challenge_body', color: '#00FFFF' },
            ].map((item, i) => (
              <div key={i} data-testid={`what-block-${i}`}
                className="ak-reveal p-10 flex flex-col gap-6" style={{ background: '#0a0a0a', transitionDelay: `${i * 0.1}s` }}>
                <div style={{ color: item.color }}>{item.icon}</div>
                <div>
                  <div className="font-inter text-[10px] font-bold uppercase tracking-[0.4em] mb-2" style={{ color: item.color }}>
                    {t(`getApp.${item.badge}`)}
                  </div>
                  <h3 className="font-anton text-2xl uppercase text-white leading-tight mb-3">{t(`getApp.${item.headline}`)}</h3>
                  <p className="font-inter text-sm text-white leading-relaxed">{t(`getApp.${item.body}`)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ S3: WHAT HAPPENS NEXT ══ */}
      <section data-testid="what-happens-next-section" className="py-24 px-6 sm:px-10 bg-black">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 ak-reveal">
            <div className="font-inter text-xs font-bold tracking-[0.4em] uppercase mb-5 text-ak-gold">{cms('next_badge', t('getApp.next_label'))}</div>
            <h2 className="font-anton text-4xl md:text-5xl uppercase text-white">{cms('next_title', t('getApp.next_title'))}</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['next_1', 'next_2', 'next_3', 'next_4'].map((key, i) => (
              <div key={i} data-testid={`next-step-${i}`}
                className="ak-reveal flex flex-col items-center text-center gap-4 p-6 rounded-[14px]"
                style={{ background: '#0a0a0a', border: `1px solid ${i < 2 ? 'rgba(0,255,255,0.15)' : 'rgba(255,215,0,0.15)'}`, transitionDelay: `${i * 0.08}s` }}>
                <div className="font-anton text-5xl leading-none" style={{ color: i < 2 ? '#00FFFF' : '#FFD700' }}>
                  0{i + 1}
                </div>
                <p className="font-inter text-sm font-semibold text-white">{t(`getApp.${key}`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ S4: MULTI-SPORT ══ */}
      <section data-testid="multi-sport-section" className="py-24 px-6 sm:px-10" style={{ background: '#050505' }}>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="ak-reveal">
            <div className="font-inter text-xs font-bold tracking-[0.4em] uppercase mb-5 text-ak-gold">{cms('sport_badge', t('getApp.sport_label'))}</div>
            <h2 className="font-anton text-4xl md:text-5xl uppercase leading-none text-white mb-6">
              {cms('sport_h2_line1', t('getApp.sport_h2_line1'))}<br /><span style={{ color: '#FFD700' }}>{cms('sport_h2_line2', t('getApp.sport_h2_line2'))}</span>
            </h2>
            <p className="font-inter text-base text-white mb-8 leading-relaxed">{cms('sport_body', t('getApp.sport_body'))}</p>
            <Link to="/arena-system" className="inline-flex items-center gap-2 font-inter text-sm font-bold text-ak-cyan hover:underline">
              {t('getApp.sport_link')} <ArrowRight size={14} />
            </Link>
          </div>
          <div className="ak-reveal ak-delay-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {['Basketball','Running','Swimming','CrossFit','Golf','Surf'].map((sport, i) => (
              <div key={i} className="flex items-center gap-2.5 p-4 rounded-[12px]"
                style={{ background: '#0a0a0a', border: `1px solid ${['CrossFit','Running','Swimming'].includes(sport) ? 'rgba(0,255,255,0.15)' : 'rgba(255,215,0,0.12)'}` }}>
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: ['CrossFit','Running','Swimming'].includes(sport) ? '#00FFFF' : '#FFD700' }} />
                <span className="font-inter text-sm font-semibold text-white">{sport}</span>
              </div>
            ))}
            <div className="flex items-center gap-2 p-4 rounded-[12px] col-span-2 sm:col-span-3"
              style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span className="font-inter text-xs text-white/35 uppercase tracking-wider">+ Any performance-based activity</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══ S5: SOCIAL PROOF ══ */}
      <section data-testid="social-proof-section" className="py-16 px-6 sm:px-10 border-y border-white/5" style={{ background: '#080808' }}>
        <div className="max-w-5xl mx-auto ak-reveal">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-12">
            <div className="flex items-center gap-3">
              <span className="ak-blink w-2 h-2 rounded-full inline-block" style={{ background: '#FF2D2D', boxShadow: '0 0 8px #FF2D2D' }} />
              <span className="font-inter text-xs font-bold uppercase tracking-widest" style={{ color: '#FF2D2D' }}>{cms('proof_badge', t('getApp.proof_label'))}</span>
            </div>
            <div className="hidden sm:block w-px h-5 bg-white/10" />
            <p className="font-inter text-sm font-semibold text-white">{cms('proof_perf', t('getApp.proof_perf'))}</p>
            <div className="hidden sm:block w-px h-5 bg-white/10" />
            <p className="font-inter text-sm font-semibold text-white">{cms('proof_athletes', t('getApp.proof_athletes'))}</p>
          </div>
        </div>
      </section>

      {/* ══ S6: FINAL CTA ══ */}
      <section data-testid="final-cta-section" className="py-28 md:py-36 px-6 sm:px-10 bg-black relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(0,255,255,0.04) 0%, transparent 65%)' }} />
        <div className="relative z-10 max-w-3xl mx-auto text-center ak-reveal">
          <div className="w-12 h-1 bg-ak-cyan mx-auto mb-10 rounded" />
          <h2 className="font-anton uppercase leading-none text-white mb-2"
            style={{ fontSize: 'clamp(52px,8vw,96px)' }}>
            {cms('final_h2_line1', t('getApp.final_h2_line1'))}
          </h2>
          <h2 className="font-anton uppercase leading-none text-white mb-2"
            style={{ fontSize: 'clamp(52px,8vw,96px)' }}>
            {cms('final_h2_line2', t('getApp.final_h2_line2'))}
          </h2>
          <h2 className="font-anton uppercase leading-none mb-10"
            style={{ fontSize: 'clamp(52px,8vw,96px)', color: '#FFD700' }}>
            {cms('final_h2_line3', t('getApp.final_h2_line3'))}
          </h2>
          <p className="font-inter text-base text-white mb-4 max-w-md mx-auto leading-relaxed">{cms('final_body', t('getApp.final_body'))}</p>
          {/* Tension reinforcement */}
          <p className="font-inter text-xs font-bold uppercase tracking-[0.25em] mb-10" style={{ color: 'rgba(255,45,45,0.7)' }}>
            {cms('hero_tension', t('getApp.tension'))}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <StoreButton href={APP_STORE_URL} type="apple" source="final_cta" />
            <StoreButton href={PLAY_STORE_URL} type="android" source="final_cta" />
          </div>

          <Link to="/arena-system" data-testid="final-learn-link"
            className="inline-flex items-center gap-2 font-inter text-sm font-bold text-ak-cyan hover:underline">
            {cms('final_learn', t('getApp.final_learn'))} <ArrowRight size={14} />
          </Link>
          <p className="font-inter text-xs mt-6 uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.2)' }}>
            {cms('final_free', t('getApp.final_free'))}
          </p>
        </div>
      </section>

      <InnerFooter />
    </div>
  );
}
