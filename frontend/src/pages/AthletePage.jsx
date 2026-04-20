import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Trophy, Users, Scan, Activity, ChevronDown, ArrowRight, Swords, Star, Radio } from 'lucide-react';
import { InnerNavbar, InnerFooter, useSEO } from '../components/SharedLayout';
import { useTranslation } from 'react-i18next';
import SportSelector from '../components/SportSelector';
import usePageContent from '../hooks/usePageContent';
import { trackConversion } from '../utils/tracking';

const HERO_BG   = 'https://customer-assets.emergentagent.com/job_nexus-arena-11/artifacts/g6ba12ic_ChatGPT%20Image%20Apr%2015%2C%202026%2C%2011_23_53%20AM.png';
const IMG_DARK  = 'https://images.unsplash.com/photo-1543300722-222718fd8509?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400';
const IMG_SWEAT = 'https://images.unsplash.com/photo-1637651684506-07e16fcf7b06?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400';
const IMG_LONE  = 'https://images.unsplash.com/photo-1605296867724-fa87a8ef53fd?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400';

export default function AthletePage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.slice(0, 2) || 'en';
  const { content: cms } = usePageContent('for-athletes', lang);

  useSEO({
    title: cms('hero_h1', 'For Athletes | ArenaKore'),
    description: cms('hero_tagline', 'You are not just training. You are competing.'),
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
      <section data-testid="athlete-hero" className="relative min-h-screen flex flex-col justify-end pt-16"
        style={{ backgroundImage: `url(${HERO_BG})`, backgroundSize: 'cover', backgroundPosition: 'center 15%' }}>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(170deg,rgba(0,0,0,0.75) 0%,rgba(0,0,0,0.95) 100%)' }} />

        {/* Multi-discipline badge strip */}
        <div className="absolute top-20 left-0 right-0 z-10">
          <div className="max-w-4xl mx-auto px-6 sm:px-10">
            <div className="flex flex-wrap gap-2">
              {[t('ui.sport_fitness'),'CROSSFIT',t('ui.sport_running'),t('ui.sport_basketball'),t('ui.sport_swimming')].map((s, i) => (
                <span key={i} className="font-inter text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded"
                  style={{ background: i < 2 ? 'rgba(0,255,255,0.15)' : 'rgba(255,255,255,0.05)', color: i < 2 ? '#00FFFF' : 'rgba(255,255,255,0.35)', border: `1px solid ${i < 2 ? 'rgba(0,255,255,0.3)' : 'rgba(255,255,255,0.1)'}` }}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-10 pb-20 md:pb-28 w-full">
          <div className="ak-hero-badge flex items-center gap-3 mb-8">
            <span className="ak-blink w-2.5 h-2.5 rounded-full" style={{ background: '#FF2D2D', boxShadow: '0 0 10px #FF2D2D', display: 'inline-block' }} />
            <span className="font-inter text-xs font-bold tracking-[0.35em] uppercase text-white">
              {cms('hero_badge', t('athlete.badge'))}
            </span>
          </div>

          <h1 className="ak-hero-title font-anton uppercase leading-[0.88] text-white mb-6" style={{ fontSize: 'clamp(60px,9vw,108px)' }}>
            {cms('hero_h1', t('athlete.h1_line1'))}
          </h1>

          <p className="ak-hero-sub font-inter text-lg md:text-xl text-white mb-5 font-medium">
            {cms('hero_sub', t('athlete.sub'))}
          </p>

          <div className="ak-hero-btns flex flex-col sm:flex-row gap-4 mb-14">
            <Link to="/get-the-app" data-testid="athlete-hero-cta"
              onClick={() => trackConversion({ action: 'app_download', source_cta_key: 'hero_cta', page: 'for-athletes', position: 'hero' })}
              className="inline-flex items-center justify-center gap-3 font-inter font-black uppercase tracking-wider text-base px-10 rounded-[14px] bg-ak-gold text-black hover:scale-105 transition-transform"
              style={{ height: '60px' }}>
              <Zap size={20} fill="black" /> {cms('hero_cta', t('cta.downloadApp'))}
            </Link>
            <Link to="/arena-system" data-testid="athlete-enter-arena-btn"
              className="inline-flex items-center justify-center gap-3 font-inter font-semibold uppercase tracking-wider text-sm px-8 rounded-[14px] border border-white/25 text-white hover:border-ak-cyan hover:text-ak-cyan transition-all"
              style={{ height: '60px' }}>
              {cms('final_cta', 'Enter the Arena')} <ArrowRight size={16} />
            </Link>
          </div>

          <div className="ak-hero-scroll">
            <p className="font-inter text-xs font-bold tracking-widest uppercase mb-2" style={{ color: 'rgba(0,255,255,0.5)' }}>
              {cms('hero_tagline', t('athlete.hero_tagline'))}
            </p>
            <div className="flex flex-col items-start gap-2" style={{ color: 'rgba(255,255,255,0.25)' }}>
              <ChevronDown size={16} className="ak-bounce" />
            </div>
          </div>
        </div>
      </section>

      {/* ══ SPORT SELECTOR ══ */}
      <section className="border-b border-white/5" style={{ background: '#000' }}>
        <SportSelector compact={true} />
      </section>

      {/* ══ IDENTITY ══ */}
      <section className="py-28 md:py-36 px-6 sm:px-10 relative overflow-hidden" style={{ background: '#000' }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url(${IMG_DARK})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="relative z-10 max-w-4xl mx-auto text-center ak-reveal">
          <p className="font-inter text-sm font-bold tracking-[0.4em] uppercase mb-8" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {cms('identity_pretext', t('athlete.identity.pretext'))}
          </p>
          <h2 className="font-anton uppercase text-white" style={{ fontSize: 'clamp(64px,12vw,140px)', lineHeight: 0.88 }}>
            {cms('identity_h2_line1', t('athlete.identity.h2_line1'))}<br />
            <span style={{ color: '#00FFFF', textShadow: '0 0 60px rgba(0,255,255,0.4)' }}>
              {cms('identity_h2_line2', t('athlete.identity.h2_line2'))}
            </span>
          </h2>
          <p className="font-inter text-base text-white mt-10 max-w-lg mx-auto leading-relaxed">
            {cms('identity_body', t('athlete.identity.body'))}
          </p>
        </div>
      </section>

      {/* ══ WHAT IS A KORE ══ */}
      <section data-testid="kore-section" className="py-24 px-6 sm:px-10" style={{ background: '#050505' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 ak-reveal">
            <div className="font-inter text-xs font-bold tracking-[0.4em] uppercase mb-4 text-ak-cyan">
              {cms('kore_badge', t('athlete.whatIsKore.badge'))}
            </div>
            <h2 className="font-anton text-4xl md:text-6xl uppercase text-white leading-none">
              {cms('kore_h2', t('athlete.whatIsKore.h2_line1'))}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: <Swords size={28} />, key: 'kore_challenges', fallback: t('athlete.whatIsKore.challenges_title'), color: '#00FFFF' },
              { icon: <Trophy size={28} />, key: 'kore_ranking',    fallback: t('athlete.whatIsKore.ranking_title'),    color: '#FFD700' },
              { icon: <Activity size={28}/>, key: 'kore_competition',fallback: t('athlete.whatIsKore.competition_title'),color: '#00FFFF' },
              { icon: <Star size={28} />,   key: 'kore_visibility', fallback: t('athlete.whatIsKore.visibility_title'), color: '#FFD700' },
            ].map((item, i) => {
              const rawText = cms(item.key, item.fallback);
              const parts = rawText.split(' — ');
              const title = parts[0] || rawText;
              const desc  = parts[1] || '';
              return (
                <div key={i} className="ak-reveal p-7 rounded-[14px] flex flex-col gap-5"
                  style={{ background: '#0a0a0a', borderTop: `3px solid ${item.color}`, transitionDelay: `${i * 0.08}s` }}>
                  <div style={{ color: item.color }}>{item.icon}</div>
                  <div className="font-anton text-xl uppercase text-white">{title}</div>
                  {desc && <p className="font-inter text-sm text-white leading-relaxed">{desc}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ K-FLUX ══ */}
      <section data-testid="kflux-section" className="py-24 px-6 sm:px-10 bg-black">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="ak-reveal">
            <div className="flex items-center gap-3 mb-5">
              <Zap size={18} style={{ color: '#FFD700' }} />
              <span className="font-inter text-xs font-bold tracking-[0.3em] uppercase text-ak-gold">
                {cms('kflux_badge', 'K-FLUX')}
              </span>
            </div>
            <h2 className="font-anton text-4xl md:text-5xl uppercase leading-none text-white mb-6">
              {cms('kflux_h2', t('athlete.kflux.h2_line1'))}
            </h2>
            <p className="font-inter text-base text-white mb-8 leading-relaxed">
              {cms('kflux_body', t('athlete.kflux.body'))}
            </p>
            <div className="space-y-4">
              {[
                { key: 'kflux_f1', fallback: t('athlete.kflux.f1_label') + ' — ' + t('athlete.kflux.f1_desc'), color: '#FFD700' },
                { key: 'kflux_f2', fallback: t('athlete.kflux.f2_label') + ' — ' + t('athlete.kflux.f2_desc'), color: '#FFD700' },
                { key: 'kflux_f3', fallback: t('athlete.kflux.f3_label') + ' — ' + t('athlete.kflux.f3_desc'), color: '#00FFFF' },
              ].map((item, i) => {
                const raw = cms(item.key, item.fallback);
                const [label, ...rest] = raw.split(' — ');
                return (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-[12px]" style={{ background: '#0a0a0a', border: `1px solid ${item.color}15` }}>
                    <Zap size={14} style={{ color: item.color, marginTop: 2, flexShrink: 0 }} />
                    <div>
                      <span className="font-inter text-sm font-bold text-white">{label}</span>
                      {rest.length > 0 && <span className="font-inter text-sm text-white"> — {rest.join(' — ')}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="ak-reveal ak-delay-2">
            <div className="relative rounded-[16px] overflow-hidden" style={{ height: '420px' }}>
              <img src={IMG_SWEAT} alt="Athlete training" className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%)' }} />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="font-inter text-xs font-bold uppercase tracking-widest mb-2 text-ak-gold">
                  {cms('kflux_hud_label', t('athlete.kflux.hud_label'))}
                </div>
                <div className="font-anton text-5xl" style={{ color: '#FFD700', textShadow: '0 0 20px rgba(255,215,0,0.5)' }}>+346</div>
                <div className="font-inter text-xs text-white mt-1">{cms('kflux_hud_sub', t('athlete.kflux.hud_sub'))}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ NEXUS ══ */}
      <section data-testid="nexus-section" className="py-24 px-6 sm:px-10" style={{ background: '#050505' }}>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="ak-reveal order-2 md:order-1">
            <div className="relative rounded-[16px] overflow-hidden" style={{ height: '420px' }}>
              <img src={IMG_LONE} alt="NEXUS tracking" className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.15) 70%)' }} />
              <div className="absolute bottom-6 left-6 right-6 space-y-2">
                {[{ label: 'VEL', val: 87, color: '#00FFFF' }, { label: 'TEC', val: 88, color: '#00FFFF' }, { label: 'RES', val: 91, color: '#FFD700' }].map((a, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="font-inter text-[10px] font-bold uppercase w-8" style={{ color: a.color }}>{a.label}</span>
                    <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                      <div className="h-full rounded-full" style={{ width: `${a.val}%`, background: a.color }} />
                    </div>
                    <span className="font-inter text-[10px] font-bold" style={{ color: a.color }}>{a.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="ak-reveal ak-delay-2 order-1 md:order-2">
            <div className="flex items-center gap-3 mb-5">
              <Scan size={18} className="text-ak-cyan" />
              <span className="font-inter text-xs font-bold tracking-[0.3em] uppercase text-ak-cyan">
                {cms('nexus_badge', t('athlete.nexus.badge'))}
              </span>
            </div>
            <h2 className="font-anton text-4xl md:text-5xl uppercase leading-none text-white mb-6">
              {cms('nexus_h2', t('athlete.nexus.h2_line1'))}
            </h2>
            <p className="font-inter text-base text-white mb-8 leading-relaxed">
              {cms('nexus_body', t('athlete.nexus.body'))}
            </p>
            <div className="space-y-4">
              {[
                { key: 'nexus_f1', fallback: t('athlete.nexus.f1_title') + ' — ' + t('athlete.nexus.f1_desc') },
                { key: 'nexus_f2', fallback: t('athlete.nexus.f2_title') + ' — ' + t('athlete.nexus.f2_desc') },
                { key: 'nexus_f3', fallback: t('athlete.nexus.f3_title') + ' — ' + t('athlete.nexus.f3_desc') },
              ].map((item, i) => {
                const raw = cms(item.key, item.fallback);
                const [title, ...rest] = raw.split(' — ');
                return (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-ak-cyan mt-2 flex-shrink-0" />
                    <div>
                      <span className="font-inter text-sm font-bold text-white">{title}</span>
                      {rest.length > 0 && <span className="font-inter text-sm text-white"> — {rest.join(' — ')}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ══ MULTI-DISCIPLINE ══ */}
      <section className="py-16 px-6 sm:px-10 bg-black border-t border-white/8">
        <div className="max-w-5xl mx-auto ak-reveal">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            <div className="flex-shrink-0">
              <div className="font-inter text-xs font-bold tracking-[0.3em] uppercase mb-2 text-ak-cyan">
                {t('ui.arena_everywhere_badge')}
              </div>
              <h3 className="font-anton text-2xl md:text-3xl uppercase text-white leading-tight">
                {t('ui.arena_everywhere_h3_line1')}<br />
                <span style={{ color: '#00FFFF' }}>{t('ui.arena_everywhere_h3_line2')}</span><br />
                {t('ui.arena_everywhere_h3_line3')}
              </h3>
            </div>
            <div className="w-px h-16 bg-white/10 hidden md:block flex-shrink-0" />
            <div>
              <p className="font-inter text-sm text-white leading-relaxed mb-4">
                {t('ui.arena_everywhere_body')}
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  t('ui.sport_fitness'), t('ui.sport_running'), t('ui.sport_basketball'),
                  t('ui.sport_swimming'), t('ui.sport_golf'), t('ui.sport_team'), t('ui.sport_any')
                ].map((s, i) => (
                  <span key={i} className="font-inter text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                    style={{ border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.5)' }}>{s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ CHALLENGES ══ */}
      <section data-testid="challenges-section" className="py-24 px-6 sm:px-10 bg-black">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 ak-reveal">
            <div className="font-inter text-xs font-bold tracking-[0.4em] uppercase mb-4" style={{ color: '#FF2D2D' }}>
              {cms('challenges_badge', t('athlete.challenges.badge'))}
            </div>
            <h2 className="font-anton text-5xl md:text-7xl uppercase text-white leading-none">
              {cms('challenges_h2', t('athlete.challenges.h2_line1'))}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: <Activity size={22} />, titleKey: 'yourself_title', subKey: 'yourself_sub', descKey: 'yourself_desc', t_title: t('athlete.challenges.yourself_title'), t_sub: t('athlete.challenges.yourself_sub'), t_desc: t('athlete.challenges.yourself_desc'), color: '#00FFFF', highlight: true },
              { icon: <Swords size={22} />,   titleKey: 'friend_title',   subKey: 'friend_sub',   descKey: 'friend_desc',   t_title: t('athlete.challenges.friend_title'),   t_sub: t('athlete.challenges.friend_sub'),   t_desc: t('athlete.challenges.friend_desc'),   color: '#FFD700' },
              { icon: <Users size={22} />,    titleKey: 'crew_title',     subKey: 'crew_sub',     descKey: 'crew_desc',     t_title: t('athlete.challenges.crew_title'),     t_sub: t('athlete.challenges.crew_sub'),     t_desc: t('athlete.challenges.crew_desc'),     color: '#00FFFF' },
              { icon: <Radio size={22} />,    titleKey: 'live_title',     subKey: 'live_sub',     descKey: 'live_desc',     t_title: t('athlete.challenges.live_title'),     t_sub: t('athlete.challenges.live_sub'),     t_desc: t('athlete.challenges.live_desc'),     color: '#FF2D2D', highlight: true },
            ].map((item, i) => (
              <div key={i} data-testid={`challenge-card-${i}`}
                className="ak-reveal p-7 rounded-[14px] flex flex-col gap-5"
                style={{ background: '#0a0a0a', border: `1px solid ${item.color}25`, transitionDelay: `${i * 0.08}s` }}>
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-[12px] flex items-center justify-center" style={{ background: `${item.color}10`, color: item.color }}>{item.icon}</div>
                  {item.highlight && <span className="font-inter text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded" style={{ color: item.color, border: `1px solid ${item.color}30` }}>{t('athlete.challenges.mostUsed')}</span>}
                </div>
                <div>
                  <div className="font-anton text-2xl uppercase text-white">{item.t_title}</div>
                  <div className="font-inter text-xs font-bold uppercase tracking-wider mt-1" style={{ color: item.color }}>{item.t_sub}</div>
                </div>
                <p className="font-inter text-sm text-white leading-relaxed">{item.t_desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FINAL PUSH ══ */}
      <section data-testid="final-push-section" className="py-28 md:py-36 px-6 sm:px-10 relative overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage: `url(${HERO_BG})`, backgroundSize: 'cover', backgroundPosition: 'center 30%' }} />
        <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.90)' }} />
        <div className="relative z-10 max-w-3xl mx-auto text-center ak-reveal">
          <div className="inline-block relative px-10 pb-8 mb-10">
            {['-top-3 -left-3 border-t border-l', '-top-3 -right-3 border-t border-r', '-bottom-0 -left-3 border-b border-l', '-bottom-0 -right-3 border-b border-r'].map((cls, i) => (
              <div key={i} className={`absolute w-5 h-5 ${cls}`} style={{ borderColor: 'rgba(255,215,0,0.5)' }} />
            ))}
            <div className="font-inter text-xs font-bold tracking-[0.4em] uppercase mb-6" style={{ color: 'rgba(255,255,255,0.3)' }}>
              {cms('final_badge', t('athlete.finalPush.badge'))}
            </div>
            <h2 className="font-anton uppercase text-white leading-[0.88]" style={{ fontSize: 'clamp(56px,9vw,100px)' }}>
              {cms('final_h2', t('athlete.finalPush.h2_line1'))}
            </h2>
          </div>
          <p className="font-inter text-lg text-white mb-12 leading-relaxed">
            {cms('final_body', t('athlete.finalPush.body'))}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/get-the-app" data-testid="athlete-final-cta"
              onClick={() => trackConversion({ action: 'app_download', source_cta_key: 'final_cta', page: 'for-athletes', position: 'final_cta' })}
              className="inline-flex items-center justify-center gap-3 font-inter font-black uppercase tracking-wider text-lg px-12 rounded-[14px] bg-ak-gold text-black hover:scale-105 transition-transform"
              style={{ height: '64px' }}>
              <Zap size={22} fill="black" /> {cms('hero_cta', t('cta.downloadApp'))}
            </Link>
            <Link to="/arena-system" data-testid="athlete-final-arena"
              className="inline-flex items-center justify-center gap-2 font-inter font-bold uppercase tracking-wider text-sm px-8 rounded-[14px] border border-white/20 text-white hover:border-ak-cyan hover:text-ak-cyan transition-all"
              style={{ height: '64px' }}>
              {cms('final_cta', 'Enter the Arena')} <ArrowRight size={16} />
            </Link>
          </div>
          <div className="flex items-center justify-center gap-8 mt-12">
            {[
              { key: 'final_t1', fallback: t('athlete.finalPush.t1'), color: '#00FFFF' },
              { key: 'final_t2', fallback: t('athlete.finalPush.t2'), color: '#FFD700' },
              { key: 'final_t3', fallback: t('athlete.finalPush.t3'), color: '#00FFFF' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: item.color }} />
                <span className="font-inter text-xs font-semibold text-white">{cms(item.key, item.fallback)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <InnerFooter />
    </div>
  );
}
