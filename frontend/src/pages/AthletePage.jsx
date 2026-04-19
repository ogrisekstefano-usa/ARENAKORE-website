import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Trophy, Users, Scan, Activity, ChevronDown, ArrowRight, Swords, Star, Radio } from 'lucide-react';
import { InnerNavbar, InnerFooter, useSEO } from '../components/SharedLayout';
import { useTranslation } from 'react-i18next';
import SportSelector from '../components/SportSelector';

const HERO_BG   = 'https://customer-assets.emergentagent.com/job_nexus-arena-11/artifacts/g6ba12ic_ChatGPT%20Image%20Apr%2015%2C%202026%2C%2011_23_53%20AM.png';
const IMG_DARK  = 'https://images.unsplash.com/photo-1543300722-222718fd8509?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400';
const IMG_SWEAT = 'https://images.unsplash.com/photo-1637651684506-07e16fcf7b06?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400';
const IMG_LONE  = 'https://images.unsplash.com/photo-1605296867724-fa87a8ef53fd?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400';

export default function AthletePage() {
  const { t } = useTranslation();
  useSEO({
    title: 'For Athletes | ArenaKore — Enter the Arena',
    description: 'You don\'t train. You compete. ArenaKore turns every workout into a ranked challenge. Enter the Arena. Become a KORE.',
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
        data-testid="athlete-hero"
        className="relative min-h-screen flex flex-col justify-end pt-16"
        style={{ backgroundImage: `url(${HERO_BG})`, backgroundSize: 'cover', backgroundPosition: 'center 15%' }}
      >
        <div className="absolute inset-0" style={{ background: 'linear-gradient(170deg,rgba(0,0,0,0.75) 0%,rgba(0,0,0,0.95) 100%)' }} />
        {/* Multi-discipline badge strip */}
        <div className="absolute top-20 left-0 right-0 z-10">
          <div className="max-w-4xl mx-auto px-6 sm:px-10">
            <div className="flex flex-wrap gap-2">
              {['FITNESS', 'CROSSFIT', 'RUNNING', 'BASKETBALL', 'SWIMMING', 'ANY SPORT'].map((s, i) => (
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
            <span className="font-inter text-xs font-bold tracking-[0.35em] uppercase text-white">FOR ATHLETES</span>
          </div>
          <h1 className="ak-hero-title font-anton uppercase leading-[0.88] text-white mb-5" style={{ fontSize: 'clamp(60px,10vw,120px)' }}>
            YOU DON'T<br />TRAIN.<br />
            <span style={{ color: '#00FFFF' }}>YOU COMPETE.</span>
          </h1>
          <p className="ak-hero-sub font-anton uppercase text-white mb-10" style={{ fontSize: 'clamp(22px,3.5vw,40px)', color: 'rgba(255,255,255,0.55)' }}>
            Enter the Arena.
          </p>
          <div className="ak-hero-btns flex flex-col sm:flex-row gap-4 mb-14">
            <Link to="/get-the-app" data-testid="athlete-hero-cta"
              className="inline-flex items-center justify-center gap-3 font-inter font-black uppercase tracking-wider text-base px-10 rounded-[14px] bg-ak-gold text-black hover:scale-105 transition-transform"
              style={{ height: '60px' }}>
              <Zap size={20} fill="black" /> {t('cta.downloadApp')}
            </Link>
            <Link to="/arena-system" data-testid="athlete-enter-arena-btn"
              className="inline-flex items-center justify-center gap-3 font-inter font-semibold uppercase tracking-wider text-sm px-8 rounded-[14px] border border-white/25 text-white hover:border-ak-cyan hover:text-ak-cyan transition-all"
              style={{ height: '60px' }}>
              Enter the Arena <ArrowRight size={16} />
            </Link>
          </div>
          <div className="ak-hero-scroll flex flex-col items-start gap-2" style={{ color: 'rgba(255,255,255,0.25)' }}>
            <p className="font-inter text-xs font-bold tracking-widest uppercase mb-2" style={{ color: 'rgba(0,255,255,0.5)' }}>
              You are not just training. You are competing.
            </p>
            <span className="font-inter text-[10px] tracking-[0.3em] uppercase">What awaits you</span>
            <ChevronDown size={16} className="ak-bounce" />
          </div>
        </div>
      </section>

      {/* ══ SPORT SELECTOR (compact) ══ */}
      <section className="border-b border-white/5" style={{ background: '#000' }}>
        <SportSelector compact={true} />
      </section>

      {/* ══ S1: IDENTITY ══ */}
      <section data-testid="identity-section" className="relative py-28 md:py-36 px-6 sm:px-10 overflow-hidden" style={{ background: '#000' }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url(${IMG_DARK})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="relative z-10 max-w-4xl mx-auto text-center ak-reveal">
          <p className="font-inter text-sm font-bold tracking-[0.4em] uppercase mb-8" style={{ color: 'rgba(255,255,255,0.4)' }}>
            ONCE YOU ENTER,<br className="hidden sm:block" /> YOU'RE NOT JUST AN ATHLETE.
          </p>
          <h2 className="font-anton uppercase text-white" style={{ fontSize: 'clamp(64px,12vw,140px)', lineHeight: 0.88 }}>
            YOU ARE A<br />
            <span style={{ color: '#00FFFF', textShadow: '0 0 60px rgba(0,255,255,0.4)' }}>KORE.</span>
          </h2>
          <p className="font-inter text-base text-white mt-10 max-w-lg mx-auto leading-relaxed">
            A KORE is not a user. Not a member. Not a subscriber.
            A KORE is a competitor with a permanent record, a certified rank,
            and an identity built entirely on real performance.
          </p>
        </div>
      </section>

      {/* ══ S2: WHAT IS A KORE ══ */}
      <section data-testid="kore-section" className="py-24 px-6 sm:px-10" style={{ background: '#050505' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 ak-reveal">
            <div className="font-inter text-xs font-bold tracking-[0.4em] uppercase mb-4 text-ak-cyan">THE KORE SYSTEM</div>
            <h2 className="font-anton text-4xl md:text-6xl uppercase text-white leading-none">WHAT IT MEANS<br />TO BE A KORE.</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: <Swords size={28} />, title: 'CHALLENGES', desc: 'Daily. Direct. Permanent. Every challenge you accept becomes part of your record.', color: '#00FFFF' },
              { icon: <Trophy size={28} />, title: 'RANKING', desc: 'K-Rating from 0 to 1000. Earned through performance. Updated after every session.', color: '#FFD700' },
              { icon: <Activity size={28} />, title: 'COMPETITION', desc: 'The Arena never closes. There is always someone above you. Always someone coming for your rank.', color: '#00FFFF' },
              { icon: <Star size={28} />, title: 'VISIBILITY', desc: 'Your performance is public. Your history is permanent. You can\'t hide your numbers here.', color: '#FFD700' },
            ].map((item, i) => (
              <div key={i} className="ak-reveal p-7 rounded-[14px] flex flex-col gap-5" style={{ background: '#0a0a0a', borderTop: `3px solid ${item.color}`, transitionDelay: `${i * 0.08}s` }}>
                <div style={{ color: item.color }}>{item.icon}</div>
                <div className="font-anton text-xl uppercase text-white">{item.title}</div>
                <p className="font-inter text-sm text-white leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ S3: K-FLUX ══ */}
      <section data-testid="kflux-section" className="py-24 px-6 sm:px-10 bg-black">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="ak-reveal">
            <div className="flex items-center gap-3 mb-5">
              <Zap size={18} style={{ color: '#FFD700' }} />
              <span className="font-inter text-xs font-bold tracking-[0.3em] uppercase" style={{ color: '#FFD700' }}>K-FLUX</span>
            </div>
            <h2 className="font-anton text-4xl md:text-5xl uppercase leading-none text-white mb-6">
              EVERY ACTION<br />GENERATES<br />
              <span style={{ color: '#FFD700' }}>K-FLUX.</span>
            </h2>
            <p className="font-inter text-base text-white mb-8 leading-relaxed">
              K-Flux is the currency of the Arena. It doesn't come from showing up.
              It comes from performing. From being consistent. From pushing past the rep you were about to skip.
            </p>
            <div className="space-y-4">
              {[
                { label: 'Training consistency', desc: 'Show up 7 days in a row. The K-Timeline tracks every session.', color: '#FFD700' },
                { label: 'Validated performance', desc: 'Every rep certified by NEXUS. Every score earned, not claimed.', color: '#FFD700' },
                { label: 'Competitive activity', desc: 'Accept challenges. Win duels. Enter live events. K-Flux multiplies.', color: '#00FFFF' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-[12px]" style={{ background: '#0a0a0a', border: `1px solid ${item.color}15` }}>
                  <Zap size={14} style={{ color: item.color, marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <span className="font-inter text-sm font-bold text-white">{item.label}</span>
                    <span className="font-inter text-sm text-white"> — {item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Visual */}
          <div className="ak-reveal ak-delay-2">
            <div className="relative rounded-[16px] overflow-hidden" style={{ height: '420px' }}>
              <img src={IMG_SWEAT} alt="Athlete training" className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%)' }} />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="font-inter text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#FFD700' }}>K-FLUX EARNED TODAY</div>
                <div className="font-anton text-5xl" style={{ color: '#FFD700', textShadow: '0 0 20px rgba(255,215,0,0.5)' }}>+346</div>
                <div className="font-inter text-xs text-white mt-1">3 sessions · 2 challenges · 1 streak day</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ S4: NEXUS ══ */}
      <section data-testid="nexus-section" className="py-24 px-6 sm:px-10 relative overflow-hidden" style={{ background: '#050505' }}>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          {/* Visual */}
          <div className="ak-reveal order-2 md:order-1">
            <div className="relative rounded-[16px] overflow-hidden" style={{ height: '420px' }}>
              <img src={IMG_LONE} alt="NEXUS tracking" className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.15) 70%)' }} />
              {/* Overlay HUD */}
              <div className="absolute bottom-6 left-6 right-6 space-y-2">
                {[
                  { label: 'VEL', val: 87, color: '#00FFFF' },
                  { label: 'TEC', val: 88, color: '#00FFFF' },
                  { label: 'RES', val: 91, color: '#FFD700' },
                ].map((attr, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="font-inter text-[10px] font-bold uppercase w-8" style={{ color: attr.color }}>{attr.label}</span>
                    <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                      <div className="h-full rounded-full" style={{ width: `${attr.val}%`, background: attr.color, boxShadow: `0 0 6px ${attr.color}` }} />
                    </div>
                    <span className="font-inter text-[10px] font-bold" style={{ color: attr.color }}>{attr.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="ak-reveal ak-delay-2 order-1 md:order-2">
            <div className="flex items-center gap-3 mb-5">
              <Scan size={18} className="text-ak-cyan" />
              <span className="font-inter text-xs font-bold tracking-[0.3em] uppercase text-ak-cyan">NEXUS ENGINE</span>
            </div>
            <h2 className="font-anton text-4xl md:text-5xl uppercase leading-none text-white mb-6">
              SCAN.<br />TRACK.<br />
              <span style={{ color: '#00FFFF' }}>EVOLVE.</span>
            </h2>
            <p className="font-inter text-base text-white mb-8 leading-relaxed">
              NEXUS doesn't watch you train. It judges you.
              Puppet Motion Detection tracks every joint, every angle, every rep.
              A rep that doesn't meet standard doesn't count. That's not punishment. That's truth.
            </p>
            <div className="space-y-4">
              {[
                { title: 'Biometric tracking', desc: 'Joint angles, movement timing, range of motion — captured in real-time.' },
                { title: 'Performance data', desc: 'Every session feeds your DNA profile: VEL, FOR, RES, AGI, TEC, POT.' },
                { title: 'Evolution over time', desc: 'Your DNA score evolves. Not on paper. In data. Visible to everyone.' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-ak-cyan mt-2 flex-shrink-0" />
                  <div>
                    <span className="font-inter text-sm font-bold text-white">{item.title}</span>
                    <span className="font-inter text-sm text-white"> — {item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ MULTI-DISCIPLINE CLAIM ══ */}
      <section className="py-16 px-6 sm:px-10 bg-black border-t border-white/8">
        <div className="max-w-5xl mx-auto ak-reveal">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            <div className="flex-shrink-0">
              <div className="font-inter text-xs font-bold tracking-[0.3em] uppercase mb-2 text-ak-cyan">THE ARENA IS EVERYWHERE</div>
              <h3 className="font-anton text-2xl md:text-3xl uppercase text-white leading-tight">
                You compete in<br /><span style={{ color: '#00FFFF' }}>your arena.</span><br />ArenaKore tracks it.
              </h3>
            </div>
            <div className="w-px h-16 bg-white/10 hidden md:block flex-shrink-0" />
            <div>
              <p className="font-inter text-sm text-white leading-relaxed mb-4">
                ArenaKore isn't just for the gym. It's designed for any performance-based activity. Whether you're lifting, running, playing basketball or surfing — your KORE identity follows you across every discipline.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Fitness', 'Running', 'Basketball', 'Swimming', 'Golf', 'Team Sports', 'Any Sport'].map((s, i) => (
                  <span key={i} className="font-inter text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                    style={{ border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.5)' }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ S5: CHALLENGES ══ */}
      <section data-testid="challenges-section" className="py-24 px-6 sm:px-10 bg-black">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 ak-reveal">
            <div className="font-inter text-xs font-bold tracking-[0.4em] uppercase mb-4" style={{ color: '#FF2D2D' }}>THE ARENA</div>
            <h2 className="font-anton text-5xl md:text-7xl uppercase text-white leading-none">
              CHALLENGE<br />
              <span style={{ color: '#FF2D2D' }}>ANYONE.</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                icon: <Activity size={24} />,
                title: 'YOURSELF',
                sub: 'Beat your PR',
                desc: 'Your biggest opponent is yesterday\'s score. K-Rating never lets you forget what you\'ve already done.',
                color: '#00FFFF',
                highlight: true,
              },
              {
                icon: <Swords size={24} />,
                title: 'A FRIEND',
                sub: '1v1 direct challenge',
                desc: 'Send a challenge. They accept. NEXUS validates both. The result is public, permanent, undeniable.',
                color: '#FFD700',
                highlight: false,
              },
              {
                icon: <Users size={24} />,
                title: 'A CREW',
                sub: 'Team vs team',
                desc: 'Build or join a KORE Crew. Combined K-Flux. Shared ranking. Collective competition.',
                color: '#00FFFF',
                highlight: false,
              },
              {
                icon: <Radio size={24} />,
                title: 'LIVE EVENTS',
                sub: 'Real-time competition',
                desc: 'Synchronized challenges across the platform. Everyone competes simultaneously. One winner.',
                color: '#FF2D2D',
                highlight: true,
              },
            ].map((item, i) => (
              <div key={i}
                data-testid={`challenge-card-${i}`}
                className="ak-reveal p-7 rounded-[14px] flex flex-col gap-5"
                style={{
                  background: '#0a0a0a',
                  border: `1px solid ${item.color}25`,
                  transitionDelay: `${i * 0.08}s`,
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-[12px] flex items-center justify-center" style={{ background: `${item.color}10`, color: item.color }}>
                    {item.icon}
                  </div>
                  {item.highlight && (
                    <span className="font-inter text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded" style={{ color: item.color, border: `1px solid ${item.color}30` }}>
                      Most used
                    </span>
                  )}
                </div>
                <div>
                  <div className="font-anton text-2xl uppercase text-white">{item.title}</div>
                  <div className="font-inter text-xs font-bold uppercase tracking-wider mt-1" style={{ color: item.color }}>{item.sub}</div>
                </div>
                <p className="font-inter text-sm text-white leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ S6: FINAL PUSH ══ */}
      <section data-testid="final-push-section" className="py-28 md:py-36 px-6 sm:px-10 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0" style={{ backgroundImage: `url(${HERO_BG})`, backgroundSize: 'cover', backgroundPosition: 'center 30%' }} />
        <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.90)' }} />

        <div className="relative z-10 max-w-3xl mx-auto text-center ak-reveal">
          {/* Corner brackets */}
          <div className="inline-block relative px-10 pb-8 mb-10">
            {['-top-3 -left-3 border-t border-l', '-top-3 -right-3 border-t border-r', '-bottom-0 -left-3 border-b border-l', '-bottom-0 -right-3 border-b border-r'].map((cls, i) => (
              <div key={i} className={`absolute w-5 h-5 ${cls}`} style={{ borderColor: 'rgba(255,215,0,0.5)' }} />
            ))}
            <div className="font-inter text-xs font-bold tracking-[0.4em] uppercase mb-6" style={{ color: 'rgba(255,255,255,0.3)' }}>THE FINAL CHOICE</div>
            <h2 className="font-anton uppercase text-white leading-[0.88]" style={{ fontSize: 'clamp(56px,9vw,100px)' }}>
              COMPETE<br />
              <span style={{ color: '#FF2D2D' }}>OR FALL<br />BEHIND.</span>
            </h2>
          </div>

          <p className="font-inter text-lg text-white mb-12 leading-relaxed">
            Right now, someone is training harder than you.<br />
            They're in the Arena. Are you?
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/get-the-app" data-testid="athlete-final-cta"
              className="inline-flex items-center justify-center gap-3 font-inter font-black uppercase tracking-wider text-lg px-12 rounded-[14px] bg-ak-gold text-black hover:scale-105 transition-transform"
              style={{ height: '64px' }}>
              <Zap size={22} fill="black" /> {t('cta.downloadApp')}
            </Link>
            <Link to="/arena-system" data-testid="athlete-final-arena"
              className="inline-flex items-center justify-center gap-2 font-inter font-bold uppercase tracking-wider text-sm px-8 rounded-[14px] border border-white/20 text-white hover:border-ak-cyan hover:text-ak-cyan transition-all"
              style={{ height: '64px' }}>
              Enter the Arena <ArrowRight size={16} />
            </Link>
          </div>
          </div>

          {/* Bottom trust line */}
          <div className="flex items-center justify-center gap-8 mt-12">
            {[
              { label: 'Free to start', color: '#00FFFF' },
              { label: 'Reps validated', color: '#FFD700' },
              { label: 'Rank earned', color: '#00FFFF' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: item.color }} />
                <span className="font-inter text-xs font-semibold text-white">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <InnerFooter />
    </div>
  );
}
