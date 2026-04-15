import React, { useEffect, useRef, useState } from 'react';
import {
  Zap, Shield, ChevronDown, Activity, Scan,
  Clock, Trophy, Users, MapPin, Radio, ArrowRight,
  Download, Dna, Swords, Target, BarChart3, Eye,
  AlertCircle, CheckCircle, XCircle, Crosshair
} from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

/* ─── ASSETS ─── */
const LOGO_DARK  = 'https://customer-assets.emergentagent.com/job_nexus-arena-11/artifacts/vefp23lc_ArenaKore-logo-dark-bg.png';
const HERO_BG    = 'https://customer-assets.emergentagent.com/job_nexus-arena-11/artifacts/g6ba12ic_ChatGPT%20Image%20Apr%2015%2C%202026%2C%2011_23_53%20AM.png';
const NEXUS_BG   = 'https://static.prod-images.emergentagent.com/jobs/d04435a4-d02c-4e45-bfc3-de61c2e4c642/images/3e690b084c9180f3a47455eb52a1241d171c46f9ca059be5705402adba209726.png';
const ARENA_BG   = 'https://static.prod-images.emergentagent.com/jobs/d04435a4-d02c-4e45-bfc3-de61c2e4c642/images/e898a8cd56faef365707794c4911a5eaba889ef3fc8312afd1410cb3512738cb.png';
const SCREEN_1   = 'https://customer-assets.emergentagent.com/job_d04435a4-d02c-4e45-bfc3-de61c2e4c642/artifacts/z6iebv8u_Screenshot%202026-04-13%20at%208.05.30%E2%80%AFPM.png';
const SCREEN_2   = 'https://customer-assets.emergentagent.com/job_d04435a4-d02c-4e45-bfc3-de61c2e4c642/artifacts/hiwev2hk_Screenshot%202026-04-13%20at%208.05.50%E2%80%AFPM.png';
const SCREEN_3   = 'https://customer-assets.emergentagent.com/job_d04435a4-d02c-4e45-bfc3-de61c2e4c642/artifacts/umi4e3gw_Screenshot%202026-04-13%20at%208.06.01%E2%80%AFPM.png';
const SCREEN_5   = 'https://customer-assets.emergentagent.com/job_d04435a4-d02c-4e45-bfc3-de61c2e4c642/artifacts/q1wbu4hw_Screenshot%202026-04-13%20at%208.06.21%E2%80%AFPM.png';

const DNA_DATA = [
  { attr: 'VEL', value: 87 }, { attr: 'FOR', value: 83 },
  { attr: 'RES', value: 91 }, { attr: 'AGI', value: 78 },
  { attr: 'TEC', value: 88 }, { attr: 'POT', value: 75 },
];

/* ─── COUNTER HOOK ─── */
function useCounter(target, duration = 1800) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const steps = 60;
        const inc = target / steps;
        let i = 0;
        const timer = setInterval(() => {
          i++;
          setCount(c => Math.min(Math.floor(c + inc), target));
          if (i >= steps) clearInterval(timer);
        }, duration / steps);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);
  return [count, ref];
}

/* ─── NAVBAR ─── */
function Navbar({ scrolled }) {
  return (
    <nav
      data-testid="navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/95 backdrop-blur-md border-b border-white/10' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between h-16">
        <a href="#" data-testid="navbar-logo">
          <img src={LOGO_DARK} alt="ArenaKore" className="h-9 w-auto object-contain" />
        </a>
        <a
          href="#"
          data-testid="navbar-accedi-btn"
          className="font-inter text-xs font-semibold uppercase tracking-widest px-5 py-2 rounded-[14px] border border-white/30 text-white hover:border-ak-cyan hover:text-ak-cyan transition-all duration-200"
        >
          ACCEDI
        </a>
      </div>
    </nav>
  );
}

/* ─── HERO ─── */
function HeroSection() {
  return (
    <section
      data-testid="hero-section"
      className="relative min-h-screen flex flex-col"
      style={{
        backgroundImage: `url(${HERO_BG})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 15%',
      }}
    >
      {/* Overlay: dark + blue tech tint */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, rgba(0,0,0,0.85) 0%, rgba(0,10,30,0.80) 100%)' }} />

      <div className="relative z-10 flex-1 flex flex-col justify-end pb-20 md:pb-28 px-6 sm:px-10 max-w-4xl mx-auto w-full">
        {/* Live badge */}
        <div className="ak-hero-badge flex items-center gap-3 mb-8">
          <span className="ak-blink w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: '#FF2D2D', boxShadow: '0 0 10px #FF2D2D' }} />
          <span className="font-inter text-xs font-semibold tracking-[0.3em] uppercase text-white">
            SFIDA LIVE · NEXUS ONLINE
          </span>
        </div>

        {/* H1 */}
        <h1 className="ak-hero-title font-anton text-6xl sm:text-7xl md:text-8xl uppercase leading-[0.9] text-white mb-6">
          NON PUOI<br />
          <span style={{ color: '#00FFFF' }}>NASCONDERTI.</span>
        </h1>

        {/* Sub */}
        <p className="ak-hero-sub font-inter text-xl md:text-2xl font-semibold text-white mb-3 leading-snug">
          NEXUS vede tutto.
        </p>
        <p className="ak-hero-sub font-inter text-base md:text-lg text-white/80 mb-10">
          Ogni rep. Ogni errore. Ogni scusa.
        </p>

        {/* CTAs */}
        <div className="ak-hero-btns flex flex-col sm:flex-row gap-4 mb-14">
          <a
            href="#sfida-live"
            data-testid="hero-inizia-sfida-btn"
            className="ak-btn-gold flex items-center justify-center gap-3 font-inter font-black uppercase tracking-wider text-base px-10 rounded-[14px] bg-ak-gold text-black"
            style={{ height: '56px' }}
          >
            <Zap size={20} fill="black" />
            INIZIA LA SFIDA
          </a>
          <a
            href="#business"
            data-testid="hero-pro-btn"
            className="ak-btn-cyan flex items-center justify-center gap-3 font-inter font-bold uppercase tracking-wider text-sm px-8 rounded-[14px] border-2 border-ak-cyan text-ak-cyan"
            style={{ height: '56px' }}
          >
            <Shield size={18} />
            SEI UN PRO? ENTRA QUI
          </a>
        </div>

        {/* A/B variant line */}
        <div className="ak-hero-scroll">
          <p className="font-inter text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>
            QUI NON VINCE CHI DICE. VINCE CHI DIMOSTRA.
          </p>
          <div className="flex flex-col items-start gap-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
            <span className="font-inter text-[10px] tracking-[0.3em] uppercase">Scopri di più</span>
            <ChevronDown size={16} className="ak-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── VERITÀ BLOCK ─── */
function VeritaSection() {
  return (
    <section data-testid="verita-section" className="py-20 md:py-28 px-6 sm:px-10" style={{ background: '#050505' }}>
      <div className="max-w-5xl mx-auto ak-reveal">
        <div className="border-l-4 pl-8 md:pl-12" style={{ borderColor: '#FF2D2D' }}>
          <div className="font-inter text-xs font-bold tracking-[0.4em] uppercase mb-6" style={{ color: '#FF2D2D' }}>
            LA VERITÀ FA MALE
          </div>
          <h2 className="font-anton text-4xl md:text-6xl uppercase leading-none text-white mb-6">
            IL PROBLEMA<br />NON È ALLENARTI.
          </h2>
          <p className="font-inter text-xl md:text-2xl font-semibold text-white mb-8 leading-snug">
            È dimostrare che lo fai davvero.
          </p>
          <p className="font-inter text-base text-white max-w-2xl leading-relaxed">
            Chiunque dice di allenarsi. Pochi lo dimostrano. ArenaKore è il sistema che separa chi parla da chi agisce. Nessuna medaglia per la partecipazione.
          </p>
          <div className="mt-10 flex flex-wrap gap-6">
            {[
              { text: 'Niente scuse.', color: '#FF2D2D' },
              { text: 'Niente alibi.', color: '#FF2D2D' },
              { text: 'Solo dati.', color: '#00FFFF' },
            ].map((item, i) => (
              <span key={i} className="font-anton text-2xl md:text-3xl uppercase" style={{ color: item.color }}>
                {item.text}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── STATS STRIP ─── */
function StatItem({ icon, target, suffix = '', label, color }) {
  const [count, ref] = useCounter(target);
  return (
    <div ref={ref} className="flex flex-col items-center gap-2 py-8 px-4">
      <div style={{ color }}>{icon}</div>
      <div className="font-anton text-4xl md:text-5xl" style={{ color }}>{target === 0 ? '0' : count}{suffix}</div>
      <div className="font-inter text-[10px] font-semibold uppercase tracking-widest text-white">{label}</div>
    </div>
  );
}

function StatsStrip() {
  return (
    <section data-testid="stats-section" className="border-y border-white/8" style={{ background: '#080808' }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/8">
          <StatItem icon={<Users size={18} />} target={26} suffix="+" label="KORE ATTIVI" color="#00FFFF" />
          <StatItem icon={<Zap size={18} />} target={346} label="K-RATING MAX" color="#FFD700" />
          <StatItem icon={<CheckCircle size={18} />} target={100} suffix="%" label="VERIFICATO" color="#00FFFF" />
          <StatItem icon={<XCircle size={18} />} target={0} label="SCUSE ACCETTATE" color="#FF2D2D" />
        </div>
      </div>
    </section>
  );
}

/* ─── SFIDA LIVE ─── */
function SfidaLiveSection() {
  return (
    <section
      id="sfida-live"
      data-testid="sfida-live-section"
      className="py-24 md:py-32 px-6 sm:px-10 relative overflow-hidden"
      style={{ background: '#000' }}
    >
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `url(${ARENA_BG})`, backgroundSize: 'cover' }} />
      <div className="relative z-10 max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <div className="ak-reveal">
          <div className="flex items-center gap-3 mb-6">
            <span className="ak-blink w-2.5 h-2.5 rounded-full" style={{ background: '#FF2D2D', boxShadow: '0 0 10px #FF2D2D' }} />
            <span className="font-inter text-xs font-bold tracking-[0.3em] uppercase" style={{ color: '#FF2D2D' }}>SFIDA LIVE</span>
          </div>
          <h2 className="font-anton text-5xl md:text-7xl uppercase leading-none text-white mb-4">
            ORA.<br /><span style={{ color: '#FF2D2D' }}>NON DOPO.</span>
          </h2>
          <p className="font-inter text-base text-white mb-8 leading-relaxed max-w-md">
            Non rimandare. La sfida è aperta adesso. Chi aspetta, perde. Chi entra, dimostra.
          </p>
          <div className="space-y-3 mb-10">
            {[
              'Sfida diretta 1vs1 in tempo reale',
              'NEXUS valida ogni movimento live',
              'Il risultato è definitivo. Non si discute.',
            ].map((t, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#FF2D2D' }} />
                <span className="font-inter text-sm font-medium text-white">{t}</span>
              </div>
            ))}
          </div>
          <a
            href="#"
            data-testid="sfida-live-cta"
            className="inline-flex items-center gap-3 font-inter font-black uppercase tracking-wider text-sm px-10 rounded-[14px] text-white"
            style={{ height: '56px', background: '#FF2D2D', boxShadow: '0 0 30px rgba(255,45,45,0.3)' }}
          >
            <Radio size={18} />
            ENTRA NELLA SFIDA LIVE
          </a>
        </div>
        <div className="ak-reveal ak-delay-2">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'SFIDE ATTIVE', value: '12', color: '#FF2D2D' },
              { label: 'ONLINE ORA', value: '26', color: '#00FFFF' },
              { label: 'RECORD OGGI', value: '8', color: '#FFD700' },
              { label: 'IN CORSO', value: '3', color: '#FF2D2D' },
            ].map((s, i) => (
              <div key={i} className="p-6 rounded-[14px] flex flex-col gap-1" style={{ background: '#0a0a0a', border: `1px solid ${s.color}30` }}>
                <div className="font-anton text-4xl" style={{ color: s.color }}>{s.value}</div>
                <div className="font-inter text-[10px] font-bold uppercase tracking-widest text-white">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── NEXUS (IL GIUDICE) ─── */
function NexusSection() {
  const checks = [
    { icon: <Crosshair size={24} />, title: 'RILEVAMENTO', sub: 'Puppet Motion Detection', desc: 'Ogni articolazione. Ogni angolo. Il sistema vede quello che l\'occhio umano non può vedere.', color: '#00FFFF' },
    { icon: <CheckCircle size={24} />, title: 'VALIDAZIONE', sub: 'Rep certificata o nulla', desc: 'Una rep è valida solo se eseguita correttamente. Il sistema decide. Non tu.', color: '#00FFFF' },
    { icon: <XCircle size={24} />, title: 'ERRORE', sub: 'Non passa. Non conta.', desc: 'Se sbagli tecnica, non viene contata. Nessuna negoziazione. Nessuna pietà.', color: '#FF2D2D' },
    { icon: <Dna size={24} />, title: 'DNA SCORE', sub: 'Il tuo profilo reale', desc: 'Ogni sessione aggiorna il tuo DNA atletico. Non puoi gonfiare il numero. È reale.', color: '#FFD700' },
  ];
  return (
    <section
      id="nexus"
      data-testid="nexus-section"
      className="py-24 md:py-32 px-6 sm:px-10 relative overflow-hidden"
      style={{ background: '#000' }}
    >
      <div className="absolute inset-0" style={{ backgroundImage: `url(${NEXUS_BG})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.06 }} />
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="ak-reveal text-center mb-16">
          <div className="font-inter text-xs font-bold tracking-[0.4em] uppercase mb-4 text-ak-cyan">IL SISTEMA CHE GIUDICA</div>
          <h2 className="font-anton text-4xl md:text-6xl uppercase text-white leading-none mb-6">
            NEXUS NON CONTA<br />LE RIPETIZIONI.
          </h2>
          <p className="font-inter text-xl md:text-2xl font-semibold text-ak-cyan mb-3">
            Conta quelle fatte bene.
          </p>
          <p className="font-inter text-base text-white max-w-xl mx-auto">
            Se sbagli, non passi. Non ci sono scorciatoie. Non ci sono discussioni. I dati sono l'unico arbitro.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px" style={{ background: 'rgba(255,255,255,0.06)' }}>
          {checks.map((c, i) => (
            <div
              key={i}
              data-testid={`nexus-card-${i}`}
              className="ak-reveal ak-card p-8 flex flex-col gap-5"
              style={{ background: '#0a0a0a', borderTop: `3px solid ${c.color}`, transitionDelay: `${i * 0.08}s` }}
            >
              <div style={{ color: c.color }}>{c.icon}</div>
              <div>
                <div className="font-anton text-xl uppercase text-white tracking-wide">{c.title}</div>
                <div className="font-inter text-xs font-bold uppercase tracking-wider mt-1" style={{ color: c.color }}>{c.sub}</div>
              </div>
              <p className="font-inter text-sm text-white leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
        {/* Center verdict */}
        <div className="mt-12 ak-reveal">
          <div className="p-8 rounded-[14px] text-center" style={{ background: '#0a0a0a', border: '1px solid rgba(0,255,255,0.2)' }}>
            <div className="font-anton text-3xl md:text-4xl uppercase text-white mb-2">
              NEXUS HA <span style={{ color: '#00FFFF' }}>PARLATO.</span>
            </div>
            <p className="font-inter text-sm text-white">Il verdetto è definitivo. Accetti il risultato o esci dall'Arena.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── CREA SFIDA ─── */
function CreaSfidaSection() {
  return (
    <section data-testid="crea-sfida-section" className="py-24 md:py-32 px-6 sm:px-10" style={{ background: '#050505' }}>
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <div className="ak-reveal">
          <div className="font-inter text-xs font-bold tracking-[0.3em] uppercase mb-5 text-ak-gold">CONFRONTO DIRETTO</div>
          <h2 className="font-anton text-4xl md:text-6xl uppercase leading-none text-white mb-6">
            SCEGLI CHI<br />SFIDARE.<br />
            <span style={{ color: '#FFD700' }}>VINCI SE DIMOSTRI.</span>
          </h2>
          <p className="font-inter text-base text-white mb-8 leading-relaxed max-w-md">
            Crea una sfida. Scegli la disciplina. Imposta il numero di rep. Il resto lo decidono i dati. Non le parole.
          </p>
          <div className="space-y-4 mb-10">
            {[
              { step: '01', text: 'Scegli la disciplina e il livello' },
              { step: '02', text: 'Sfida un avversario o accetta una sfida aperta' },
              { step: '03', text: 'NEXUS valida le performance in tempo reale' },
              { step: '04', text: 'Il risultato è permanente. Pubblico. Definitivo.' },
            ].map((s, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="font-anton text-2xl leading-none flex-shrink-0" style={{ color: '#FFD700' }}>{s.step}</div>
                <span className="font-inter text-sm text-white pt-1">{s.text}</span>
              </div>
            ))}
          </div>
          <a
            href="#"
            data-testid="crea-sfida-cta"
            className="ak-btn-gold inline-flex items-center gap-3 font-inter font-black uppercase tracking-wider text-sm px-10 rounded-[14px] bg-ak-gold text-black"
            style={{ height: '56px' }}
          >
            <Swords size={18} />
            LANCIA LA SFIDA
          </a>
        </div>
        <div className="ak-reveal ak-delay-2">
          <div className="space-y-3">
            {[
              { disc: 'SQUAT JUMP', rep: '32 REP', score: '87/100', valid: true },
              { disc: 'TIRO DA 3', rep: '18 REP', score: '61/100', valid: false },
              { disc: 'SPRINT 40M', rep: '6 REP', score: '92/100', valid: true },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-5 rounded-[14px]" style={{ background: '#0a0a0a', border: `1px solid ${item.valid ? 'rgba(0,255,255,0.2)' : 'rgba(255,45,45,0.2)'}` }}>
                <div>
                  <div className="font-anton text-lg uppercase text-white">{item.disc}</div>
                  <div className="font-inter text-xs text-white">{item.rep}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="font-anton text-2xl" style={{ color: item.valid ? '#00FFFF' : '#FF2D2D' }}>{item.score}</div>
                  {item.valid
                    ? <CheckCircle size={20} style={{ color: '#00FFFF' }} />
                    : <XCircle size={20} style={{ color: '#FF2D2D' }} />
                  }
                </div>
              </div>
            ))}
            <div className="p-4 rounded-[14px] text-center" style={{ background: '#0a0a0a', border: '1px solid rgba(255,215,0,0.2)' }}>
              <span className="font-inter text-xs font-bold uppercase tracking-wider" style={{ color: '#FFD700' }}>NEXUS — VERDETTO EMESSO</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── APP PREVIEW ─── */
function AppPreviewSection() {
  const screens = [
    { img: SCREEN_1, label: 'Accesso' },
    { img: SCREEN_2, label: 'NÈXUS Dashboard' },
    { img: SCREEN_3, label: 'Arena' },
    { img: SCREEN_5, label: 'DNA Universale' },
  ];
  return (
    <section data-testid="app-preview-section" className="py-20 bg-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 mb-12">
        <div className="ak-reveal text-center">
          <div className="font-inter text-xs font-bold tracking-[0.35em] uppercase mb-4 text-ak-cyan">DISPONIBILE ORA</div>
          <h2 className="font-anton text-4xl md:text-5xl uppercase text-white">
            L'ARENA NEL TUO<br /><span className="text-ak-cyan">TELEFONO.</span>
          </h2>
        </div>
      </div>
      <div className="flex gap-4 px-6 sm:px-10 overflow-x-auto no-scrollbar pb-4 md:justify-center">
        {screens.map((s, i) => (
          <div key={i} className="flex-shrink-0 ak-reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
            <div
              className="w-[190px] md:w-[220px] rounded-[24px] overflow-hidden"
              style={{ border: '1.5px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 60px rgba(0,0,0,0.7)', transform: i % 2 === 1 ? 'translateY(-20px)' : 'translateY(0)' }}
            >
              <img src={s.img} alt={s.label} className="w-full block" />
            </div>
            <div className="font-inter text-[10px] font-semibold text-center mt-3 tracking-widest uppercase text-white">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── DNA SECTION ─── */
const DNA_ATTRS = [
  { name: 'VEL', value: 87, color: '#00FFFF' },
  { name: 'FOR', value: 83, color: '#00FFFF' },
  { name: 'RES', value: 91, color: '#00FFFF' },
  { name: 'AGI', value: 78, color: '#FFD700' },
  { name: 'TEC', value: 88, color: '#00FFFF' },
  { name: 'POT', value: 75, color: '#FFD700' },
];

function DNASection() {
  return (
    <section data-testid="dna-section" className="py-24 md:py-32 px-6 sm:px-10" style={{ background: '#050505' }}>
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <div className="ak-reveal order-2 md:order-1">
          <div className="font-inter text-xs font-bold tracking-[0.3em] uppercase mb-2 text-white">TALENT CARD</div>
          <h2 className="font-anton text-4xl md:text-5xl uppercase leading-none mb-4">
            <span className="text-ak-cyan">DNA</span> <span className="text-white">UNIVERSALE</span>
          </h2>
          <p className="font-inter text-base text-white mb-8 leading-relaxed">
            Vediamo quanto vali davvero. Sei attributi. Misurati. Verificati. Pubblici. Non puoi barare con i dati.
          </p>
          <div className="grid grid-cols-3 gap-4 mb-8">
            {DNA_ATTRS.map((a, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="font-inter text-xs font-bold uppercase text-white">{a.name}</span>
                  <span className="font-anton text-lg" style={{ color: a.color }}>{a.value}</span>
                </div>
                <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                  <div className="h-full rounded-full" style={{ width: `${a.value}%`, background: a.color, boxShadow: `0 0 6px ${a.color}60` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="font-inter text-xs font-medium p-4 rounded-[14px]" style={{ background: 'rgba(0,255,255,0.04)', border: '1px solid rgba(0,255,255,0.18)', color: '#FFFFFF' }}>
            <span className="text-ak-cyan font-bold">PROSSIMA EVOLUZIONE</span> — 7 sessioni consecutive per aggiornare il DNA. Zero eccezioni.
          </div>
        </div>
        <div className="ak-reveal ak-delay-2 order-1 md:order-2">
          <div className="p-8 rounded-[14px]" style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="font-inter text-xs font-bold uppercase tracking-widest mb-4 text-center text-white">DNA CHART · LIVE</div>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={DNA_DATA} margin={{ top: 15, right: 30, bottom: 15, left: 30 }}>
                <PolarGrid stroke="rgba(0,255,255,0.1)" />
                <PolarAngleAxis dataKey="attr" tick={{ fill: '#00FFFF', fontSize: 12, fontFamily: 'Inter', fontWeight: 700 }} />
                <Radar name="DNA" dataKey="value" stroke="#00FFFF" fill="#00FFFF" fillOpacity={0.1} strokeWidth={2} dot={{ fill: '#00FFFF', r: 4, strokeWidth: 0 }} />
              </RadarChart>
            </ResponsiveContainer>
            <div className="text-center mt-4">
              <div className="font-inter text-xs font-bold uppercase tracking-widest mb-1 text-white">K-RATING</div>
              <div className="font-anton text-4xl text-ak-cyan">346<span className="text-2xl text-white">/1000</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── HUB / MAPPA ─── */
function HubSection() {
  return (
    <section
      id="arena"
      data-testid="arena-section"
      className="py-24 md:py-32 px-6 sm:px-10 relative overflow-hidden"
    >
      <div className="absolute inset-0" style={{ backgroundImage: `url(${ARENA_BG})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.88)' }} />
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="ak-reveal text-center mb-16">
          <div className="inline-block relative px-8 pb-6">
            {['top-0 left-0 border-t border-l', 'top-0 right-0 border-t border-r', 'bottom-0 left-0 border-b border-l', 'bottom-0 right-0 border-b border-r'].map((cls, i) => (
              <div key={i} className={`absolute w-5 h-5 ${cls}`} style={{ borderColor: 'rgba(255,215,0,0.5)' }} />
            ))}
            <div className="font-inter text-xs font-bold tracking-[0.4em] uppercase mb-5 text-white">L'ÉLITE SI CONFRONTA</div>
            <h2 className="font-anton text-5xl md:text-7xl uppercase text-white leading-none">SFIDE.<br />RECORD.<br /><span className="text-ak-gold">DETERMINAZIONE.</span></h2>
          </div>
          <div className="grid grid-cols-3 gap-6 max-w-sm mx-auto mt-12">
            {[
              { icon: <Users size={16} />, value: '26', label: 'KORE ATTIVI' },
              { icon: <Zap size={16} />, value: '∞', label: 'SESSIONI' },
              { icon: <Trophy size={16} />, value: '99', label: 'RECORD' },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="text-ak-cyan">{s.icon}</div>
                <div className="font-anton text-3xl text-ak-cyan">{s.value}</div>
                <div className="font-inter text-[9px] font-bold uppercase tracking-widest text-white">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: <Swords size={22} />, title: 'SFIDA DNA', desc: 'Sfida diretta. I dati decidono. Nessuna scusa.' },
            { icon: <MapPin size={22} />, title: 'MAPPA HUB', desc: 'Trova palestre, coach e sfide vicino a te.' },
            { icon: <Radio size={22} />, title: 'LIVE', desc: 'Competizioni in tempo reale. L\'élite si guarda.' },
          ].map((f, i) => (
            <div
              key={i}
              data-testid={`arena-card-${i}`}
              className="ak-reveal ak-card-gold p-6 rounded-[14px] flex items-start gap-4"
              style={{ background: 'rgba(255,215,0,0.04)', border: '1px solid rgba(255,215,0,0.18)', transitionDelay: `${i * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-[12px] flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,215,0,0.08)', color: '#FFD700' }}>{f.icon}</div>
              <div>
                <div className="font-anton text-lg uppercase text-white mb-1">{f.title}</div>
                <p className="font-inter text-sm text-white leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── BUSINESS ─── */
function BusinessSection() {
  const features = [
    { icon: <Target size={22} />, title: 'CREA SFIDE', desc: 'Template professionali certificati. I tuoi atleti non hanno più scuse.' },
    { icon: <Users size={22} />, title: 'GESTISCI ATLETI', desc: 'K-Rating, performance, progress. Tutto sotto controllo.' },
    { icon: <BarChart3 size={22} />, title: 'ANALYTICS', desc: 'Dati reali. Trend reali. Nessuna metrica gonfiata.' },
    { icon: <MapPin size={22} />, title: 'HUB UFFICIALE', desc: 'La tua palestra sulla mappa. Visibilità verso migliaia di atleti.' },
  ];
  return (
    <section id="business" data-testid="business-section" className="py-24 md:py-32 px-6 sm:px-10 bg-black border-t border-white/8">
      <div className="max-w-7xl mx-auto">
        <div className="ak-reveal grid md:grid-cols-2 gap-8 items-end mb-16">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-px" style={{ background: '#FFD700' }} />
              <span className="font-inter text-xs font-bold tracking-[0.3em] uppercase text-ak-gold">ARENA BUSINESS</span>
            </div>
            <h2 className="font-anton text-4xl md:text-5xl uppercase leading-none text-white mb-4">
              PER COACH<br />E <span className="text-ak-gold">PALESTRE</span>
            </h2>
            <p className="font-inter text-base text-white leading-relaxed">
              Porta la tua struttura nell'Arena. Crea sfide certificate. Costruisci una reputazione che si misura in dati, non in parole.
            </p>
          </div>
          <div className="flex justify-start md:justify-end">
            <a href="#" data-testid="business-panel-btn" className="ak-btn-gold inline-flex items-center gap-3 font-inter font-black uppercase tracking-wider text-sm px-8 rounded-[14px] border-2 border-ak-gold text-ak-gold" style={{ height: '56px' }}>
              <ArrowRight size={18} />
              ENTRA NEL BUSINESS PANEL
            </a>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {features.map((f, i) => (
            <div key={i} data-testid={`business-card-${i}`} className="ak-reveal ak-card-gold p-6 rounded-[14px] flex flex-col gap-4" style={{ background: '#0a0a0a', border: '1px solid rgba(255,215,0,0.2)', transitionDelay: `${i * 0.08}s` }}>
              <div className="w-10 h-10 rounded-[10px] flex items-center justify-center" style={{ background: 'rgba(255,215,0,0.08)', color: '#FFD700' }}>{f.icon}</div>
              <div className="font-anton text-lg uppercase text-white">{f.title}</div>
              <p className="font-inter text-sm text-white leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
        <div className="ak-reveal grid grid-cols-3 gap-4">
          {[{ v: '50+', l: 'Hub Certificati' }, { v: '1K+', l: 'Atleti Connessi' }, { v: '15+', l: 'Discipline' }].map((s, i) => (
            <div key={i} className="text-center p-6 rounded-[14px]" style={{ background: '#0a0a0a', border: '1px solid rgba(255,215,0,0.15)' }}>
              <div className="font-anton text-3xl md:text-4xl mb-1" style={{ color: '#FFD700' }}>{s.v}</div>
              <div className="font-inter text-xs font-bold uppercase tracking-wider text-white">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── DOWNLOAD CTA ─── */
function DownloadCTA() {
  return (
    <section data-testid="download-cta-section" className="py-24 md:py-32 px-6 sm:px-10 bg-black">
      <div className="max-w-4xl mx-auto text-center ak-reveal">
        <div className="flex items-center gap-4 mb-12 justify-center">
          <div className="flex-1 max-w-[80px] h-px" style={{ background: 'rgba(255,45,45,0.4)' }} />
          <div className="w-2.5 h-2.5 rounded-full ak-blink" style={{ background: '#FF2D2D', boxShadow: '0 0 10px #FF2D2D' }} />
          <div className="flex-1 max-w-[80px] h-px" style={{ background: 'rgba(255,45,45,0.4)' }} />
        </div>
        <div className="font-inter text-xs font-bold tracking-[0.4em] uppercase mb-5 text-white">DIMOSTRALO.</div>
        <h2 className="font-anton text-5xl md:text-7xl uppercase leading-none text-white mb-6">
          ENTRA<br />NELL'<span className="text-ak-gold">ARENA</span>
        </h2>
        <p className="font-inter text-base text-white mb-10 max-w-xl mx-auto leading-relaxed">
          Niente scuse. Niente alibi. 100 K-FLUX di benvenuto. Il tuo record comincia adesso.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
          <a href="#" data-testid="download-app-store-btn" className="ak-btn-gold flex items-center justify-center gap-3 font-inter font-black uppercase tracking-wider text-sm px-10 rounded-[14px] bg-ak-gold text-black" style={{ height: '56px' }}>
            <Download size={20} />APP STORE
          </a>
          <a href="#" data-testid="download-play-store-btn" className="ak-btn-gold flex items-center justify-center gap-3 font-inter font-black uppercase tracking-wider text-sm px-10 rounded-[14px] bg-ak-gold text-black" style={{ height: '56px' }}>
            <Download size={20} />GOOGLE PLAY
          </a>
        </div>
        <div className="inline-flex items-center gap-3 font-inter text-xs font-semibold px-6 py-3 rounded-full" style={{ background: 'rgba(255,215,0,0.05)', border: '1px solid rgba(255,215,0,0.2)', color: '#FFFFFF' }}>
          <Zap size={14} style={{ color: '#FFD700' }} />
          <span><span style={{ color: '#FFD700' }}>+100 K-FLUX</span> — BONUS DI BENVENUTO</span>
        </div>
      </div>
    </section>
  );
}

/* ─── FOOTER ─── */
function FooterSection() {
  const cols = [
    { title: 'PRODOTTO', links: ['KORE ID', 'Sistema NÈXUS', 'K-Scan', 'DNA Universale'] },
    { title: 'ARENA', links: ['Sfide PvP', 'Sfida Live', 'Mappa Hub', 'KORE of the Day'] },
    { title: 'BUSINESS', links: ['Arena Business', 'Hub Partner', 'Coach Pro', 'Sponsorship'] },
    { title: 'LEGALE', links: ['Privacy Policy', 'Termini di Servizio', 'Cookie Policy', 'Contatti'] },
  ];
  return (
    <footer data-testid="footer" className="border-t border-white/8 bg-black">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-16">
        {/* Logo watermark */}
        <div className="mb-12 opacity-10">
          <img src={LOGO_DARK} alt="ArenaKore" className="h-20 w-auto object-contain" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {cols.map((col, i) => (
            <div key={i}>
              <div className="font-inter text-[10px] font-bold uppercase tracking-widest mb-4 text-white">{col.title}</div>
              <ul className="space-y-2">
                {col.links.map(link => (
                  <li key={link}><a href="#" className="font-inter text-sm text-white hover:text-ak-cyan transition-colors">{link}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/8 gap-4">
          <img src={LOGO_DARK} alt="ArenaKore" className="h-7 w-auto object-contain" />
          <div className="font-inter text-xs text-white">© 2026 ArenaKore. Tutti i diritti riservati.</div>
          <div className="flex items-center gap-2">
            <span className="ak-blink w-1.5 h-1.5 rounded-full" style={{ background: '#FF2D2D', display: 'inline-block' }} />
            <span className="font-inter text-xs font-bold uppercase tracking-wider text-white">NEXUS ONLINE</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─── MAIN ─── */
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && e.target.classList.add('ak-visible')),
      { threshold: 0.08 }
    );
    document.querySelectorAll('.ak-reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-black text-white overflow-x-hidden font-inter">
      <Navbar scrolled={scrolled} />
      <HeroSection />
      <VeritaSection />
      <StatsStrip />
      <SfidaLiveSection />
      <NexusSection />
      <CreaSfidaSection />
      <AppPreviewSection />
      <DNASection />
      <HubSection />
      <BusinessSection />
      <DownloadCTA />
      <FooterSection />
    </div>
  );
}
