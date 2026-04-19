import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Download, Zap, Trophy, Activity, Users, ChevronRight, CheckCircle } from 'lucide-react';
import { InnerNavbar, InnerFooter, useSEO } from '../components/SharedLayout';

const APP_STORE_URL = '#';
const PLAY_STORE_URL = '#';

const WHAT_YOU_GET = [
  { icon: <Zap size={20} style={{ color: '#00FFFF' }} />, title: 'Compete', desc: 'Daily challenges against real athletes. Every session has stakes.' },
  { icon: <Activity size={20} style={{ color: '#FFD700' }} />, title: 'Track performance', desc: 'NEXUS validates every rep. Your score is always real.' },
  { icon: <Trophy size={20} style={{ color: '#00FFFF' }} />, title: 'Rankings', desc: 'K-Rating from 0 to 1000. Public. Permanent. Undeniable.' },
  { icon: <Users size={20} style={{ color: '#FFD700' }} />, title: 'Multi-sport', desc: 'Fitness, running, basketball, swimming and beyond.' },
];

export default function GetTheAppPage() {
  const { t } = useTranslation();

  useSEO({
    title: 'Download ArenaKore — The Competition System',
    description: 'Download ArenaKore. Join the competition. Track performance, climb rankings and compete every day across any discipline.',
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
    <div className="bg-black text-white font-inter min-h-screen overflow-x-hidden">
      <InnerNavbar />

      {/* ── Hero ── */}
      <section data-testid="get-app-hero" className="pt-32 pb-20 px-6 sm:px-10 text-center" style={{ background: '#000' }}>
        <div className="max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-[20px] bg-ak-cyan/10 border border-ak-cyan/30 flex items-center justify-center mx-auto mb-8">
            <Download size={28} className="text-ak-cyan" />
          </div>
          <div className="font-inter text-xs font-bold tracking-[0.4em] uppercase mb-5 text-ak-cyan">FREE DOWNLOAD</div>
          <h1 className="font-anton text-5xl md:text-7xl uppercase leading-none text-white mb-5">
            DOWNLOAD<br /><span style={{ color: '#FFD700' }}>ARENAKORE</span>
          </h1>
          <p className="font-inter text-lg text-white mb-12 leading-relaxed">
            Join the competition.<br />Anytime. Anywhere.
          </p>

          {/* App store buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <a href={APP_STORE_URL} data-testid="app-store-btn"
              className="inline-flex items-center justify-center gap-4 px-8 rounded-[14px] border border-white/20 hover:border-white/50 transition-all"
              style={{ height: '64px', background: '#0a0a0a' }}>
              {/* Apple icon */}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <div className="text-left">
                <div className="font-inter text-[10px] text-white/60 leading-none mb-0.5">Download on the</div>
                <div className="font-inter text-base font-bold text-white leading-none">App Store</div>
              </div>
            </a>
            <a href={PLAY_STORE_URL} data-testid="play-store-btn"
              className="inline-flex items-center justify-center gap-4 px-8 rounded-[14px] border border-white/20 hover:border-white/50 transition-all"
              style={{ height: '64px', background: '#0a0a0a' }}>
              {/* Play Store icon */}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                <path d="M3 20.5v-17c0-.83.94-1.3 1.6-.8l14 8.5c.6.37.6 1.23 0 1.6l-14 8.5c-.66.5-1.6.03-1.6-.8z"/>
              </svg>
              <div className="text-left">
                <div className="font-inter text-[10px] text-white/60 leading-none mb-0.5">Get it on</div>
                <div className="font-inter text-base font-bold text-white leading-none">Google Play</div>
              </div>
            </a>
          </div>

          <p className="font-inter text-xs text-white/30 uppercase tracking-widest">Free to download · No credit card</p>
        </div>
      </section>

      {/* ── What you get ── */}
      <section data-testid="what-you-get-section" className="py-20 px-6 sm:px-10" style={{ background: '#050505' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14 ak-reveal">
            <div className="font-inter text-xs font-bold tracking-[0.4em] uppercase mb-4 text-ak-cyan">INCLUDED</div>
            <h2 className="font-anton text-4xl md:text-5xl uppercase text-white">WHAT YOU GET</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {WHAT_YOU_GET.map((item, i) => (
              <div key={i} data-testid={`get-item-${i}`}
                className="ak-reveal flex items-start gap-5 p-6 rounded-[14px]"
                style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.08)', transitionDelay: `${i * 0.08}s` }}>
                <div className="w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(0,255,255,0.06)' }}>
                  {item.icon}
                </div>
                <div>
                  <div className="font-anton text-lg uppercase text-white mb-1">{item.title}</div>
                  <p className="font-inter text-sm text-white leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Screen previews ── */}
      <section className="py-20 px-6 sm:px-10 bg-black overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 ak-reveal">
            <h2 className="font-anton text-3xl md:text-4xl uppercase text-white">INSIDE THE APP</h2>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 justify-center">
            {[
              'https://customer-assets.emergentagent.com/job_d04435a4-d02c-4e45-bfc3-de61c2e4c642/artifacts/z6iebv8u_Screenshot%202026-04-13%20at%208.05.30%E2%80%AFPM.png',
              'https://customer-assets.emergentagent.com/job_d04435a4-d02c-4e45-bfc3-de61c2e4c642/artifacts/hiwev2hk_Screenshot%202026-04-13%20at%208.05.50%E2%80%AFPM.png',
              'https://customer-assets.emergentagent.com/job_d04435a4-d02c-4e45-bfc3-de61c2e4c642/artifacts/jixj7v9x_Screenshot%202026-04-13%20at%208.06.10%E2%80%AFPM.png',
            ].map((src, i) => (
              <div key={i} className="flex-shrink-0 ak-reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="w-[180px] rounded-[22px] overflow-hidden"
                  style={{ border: '1.5px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 60px rgba(0,0,0,0.7)', transform: i === 1 ? 'translateY(-14px)' : 'none' }}>
                  <img src={src} alt="ArenaKore App" className="w-full block" loading="lazy" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="py-20 px-6 sm:px-10 text-center" style={{ background: '#050505' }}>
        <div className="max-w-xl mx-auto ak-reveal">
          <h2 className="font-anton text-4xl uppercase text-white mb-4">READY TO COMPETE?</h2>
          <p className="font-inter text-sm text-white mb-8">The Arena is open. Your rank is waiting.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
            <a href={APP_STORE_URL} data-testid="bottom-app-store"
              className="inline-flex items-center justify-center gap-2 font-inter font-black uppercase tracking-wider text-sm px-8 rounded-[14px] bg-ak-gold text-black hover:scale-105 transition-transform"
              style={{ height: '52px' }}>
              <Download size={16} /> App Store
            </a>
            <a href={PLAY_STORE_URL} data-testid="bottom-play-store"
              className="inline-flex items-center justify-center gap-2 font-inter font-black uppercase tracking-wider text-sm px-8 rounded-[14px] bg-ak-gold text-black hover:scale-105 transition-transform"
              style={{ height: '52px' }}>
              <Download size={16} /> Google Play
            </a>
          </div>
          <p className="font-inter text-xs text-white/30 mb-6">Or start a gym pilot:</p>
          <Link to="/gym-challenge-pilot" data-testid="gym-pilot-link"
            className="inline-flex items-center gap-2 font-inter text-sm font-bold text-ak-cyan hover:underline">
            For Gyms — Start a 14-day pilot <ChevronRight size={14} />
          </Link>
        </div>
      </section>

      <InnerFooter />
    </div>
  );
}
