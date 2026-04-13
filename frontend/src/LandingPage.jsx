import React, { useEffect, useRef, useState } from 'react';
import {
  Zap, Shield, ChevronDown, Activity, Scan,
  Clock, Trophy, Users, MapPin, Radio, ArrowRight,
  Download, Dna, Swords, Target, Star
} from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

/* ─── ASSETS ─── */
const HERO_BG = 'https://static.prod-images.emergentagent.com/jobs/d04435a4-d02c-4e45-bfc3-de61c2e4c642/images/c5b2dfc4e0edbe689fdbcd4f3132e31fb03c31c3c737e73d954f17156fbd6bfe.png';
const NEXUS_BG = 'https://static.prod-images.emergentagent.com/jobs/d04435a4-d02c-4e45-bfc3-de61c2e4c642/images/3e690b084c9180f3a47455eb52a1241d171c46f9ca059be5705402adba209726.png';
const ARENA_BG = 'https://static.prod-images.emergentagent.com/jobs/d04435a4-d02c-4e45-bfc3-de61c2e4c642/images/e898a8cd56faef365707794c4911a5eaba889ef3fc8312afd1410cb3512738cb.png';
const SCREEN_1 = 'https://customer-assets.emergentagent.com/job_d04435a4-d02c-4e45-bfc3-de61c2e4c642/artifacts/z6iebv8u_Screenshot%202026-04-13%20at%208.05.30%E2%80%AFPM.png';
const SCREEN_2 = 'https://customer-assets.emergentagent.com/job_d04435a4-d02c-4e45-bfc3-de61c2e4c642/artifacts/hiwev2hk_Screenshot%202026-04-13%20at%208.05.50%E2%80%AFPM.png';
const SCREEN_3 = 'https://customer-assets.emergentagent.com/job_d04435a4-d02c-4e45-bfc3-de61c2e4c642/artifacts/umi4e3gw_Screenshot%202026-04-13%20at%208.06.01%E2%80%AFPM.png';
const SCREEN_4 = 'https://customer-assets.emergentagent.com/job_d04435a4-d02c-4e45-bfc3-de61c2e4c642/artifacts/jixj7v9x_Screenshot%202026-04-13%20at%208.06.10%E2%80%AFPM.png';
const SCREEN_5 = 'https://customer-assets.emergentagent.com/job_d04435a4-d02c-4e45-bfc3-de61c2e4c642/artifacts/q1wbu4hw_Screenshot%202026-04-13%20at%208.06.21%E2%80%AFPM.png';

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
        scrolled ? 'bg-black/90 backdrop-blur-md border-b border-white/10' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between h-16">
        <a href="#" data-testid="navbar-logo" className="font-anton text-2xl tracking-widest uppercase">
          <span className="text-white">ARENA</span>
          <span className="text-ak-cyan">KORE</span>
        </a>
        <a
          href="#"
          data-testid="navbar-accedi-btn"
          className="font-ibm-mono text-xs uppercase tracking-wider px-5 py-2 rounded-[14px] border border-white/30 text-white hover:border-ak-cyan hover:text-ak-cyan transition-all duration-200"
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
        backgroundPosition: 'center 20%',
      }}
    >
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.72)' }} />
      <div className="relative z-10 flex-1 flex flex-col justify-end pb-20 md:pb-28 px-6 sm:px-10 max-w-3xl mx-auto w-full">
        {/* Badge */}
        <div className="ak-hero-badge flex items-center gap-3 mb-6">
          <span
            className="ak-blink w-2 h-2 rounded-full flex-shrink-0"
            style={{ background: '#00FFFF', boxShadow: '0 0 8px #00FFFF' }}
          />
          <span className="font-ibm-mono text-xs tracking-[0.25em] uppercase text-ak-cyan">
            Sistema NÈXUS · Online
          </span>
        </div>
        {/* H1 */}
        <h1 className="ak-hero-title font-anton text-5xl sm:text-6xl md:text-7xl uppercase leading-[0.95] text-white mb-5">
          IL FUTURO<br />DELL'IDENTITÀ<br />SPORTIVA
        </h1>
        {/* Sub */}
        <p className="ak-hero-sub font-ibm-mono text-sm md:text-base mb-10 leading-relaxed" style={{ color: '#a1a1aa' }}>
          Calibrazione biometrica. Performance reale.<br />Zero compromessi.
        </p>
        {/* CTAs */}
        <div className="ak-hero-btns flex flex-col sm:flex-row gap-4 mb-14">
          <a
            href="#"
            data-testid="hero-scarica-app-btn"
            className="ak-btn-cyan flex items-center justify-center gap-3 font-ibm-mono font-bold uppercase text-sm px-8 py-4 rounded-[14px] bg-ak-cyan text-black"
          >
            <Zap size={18} />
            SCARICA APP
          </a>
          <a
            href="#"
            data-testid="hero-arena-business-btn"
            className="ak-btn-gold flex items-center justify-center gap-3 font-ibm-mono font-bold uppercase text-sm px-8 py-4 rounded-[14px] border-2 border-ak-gold text-ak-gold"
          >
            <Shield size={18} />
            ARENA BUSINESS
          </a>
        </div>
        {/* Scroll indicator */}
        <div className="ak-hero-scroll flex flex-col items-center gap-2" style={{ color: '#555' }}>
          <span className="font-ibm-mono text-[10px] tracking-[0.3em] uppercase">Scopri di più</span>
          <ChevronDown size={18} className="ak-bounce" />
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
      <div className="font-anton text-4xl md:text-5xl ak-glow-cyan" style={{ color }}>
        {count}{suffix}
      </div>
      <div className="font-ibm-mono text-[10px] uppercase tracking-widest" style={{ color: '#666' }}>{label}</div>
    </div>
  );
}

function StatsStrip() {
  return (
    <section data-testid="stats-section" className="border-y border-white/8" style={{ background: '#080808' }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/8">
          <StatItem icon={<Users size={20} />} target={26} suffix="+" label="Kore Attivi" color="#00FFFF" />
          <StatItem icon={<Activity size={20} />} target={1000} label="K-Rating Max" color="#FFD700" />
          <StatItem icon={<Zap size={20} />} target={346} label="K-Flux Record" color="#00FFFF" />
          <StatItem icon={<Trophy size={20} />} target={15} suffix="+" label="Discipline" color="#FFD700" />
        </div>
      </div>
    </section>
  );
}

/* ─── KORE ID ─── */
function KoreIDSection() {
  const features = [
    { icon: <Zap size={15} />, text: 'K-FLUX — la valuta delle tue performance' },
    { icon: <Scan size={15} />, text: 'K-SCAN — bio-analisi del movimento in tempo reale' },
    { icon: <Shield size={15} />, text: 'KORE ID — identità digitale unica e immutabile' },
    { icon: <Users size={15} />, text: 'KORE Network — la rete atletica sociale' },
  ];
  return (
    <section data-testid="kore-id-section" className="py-24 md:py-32 px-6 sm:px-10 bg-black">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        {/* Left */}
        <div className="ak-reveal">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-px bg-ak-cyan" />
            <span className="font-ibm-mono text-xs tracking-[0.3em] uppercase text-ak-cyan">KORE ID</span>
          </div>
          <h2 className="font-anton text-4xl md:text-5xl uppercase leading-[0.95] text-white mb-6">
            LA TUA<br />IDENTITÀ ATLETICA<br />DIGITALE
          </h2>
          <p className="font-ibm-mono text-sm md:text-base mb-8 leading-relaxed" style={{ color: '#a1a1aa' }}>
            Non sei solo un atleta. Sei un sistema. La KORE ID ti assegna un'identità digitale
            immutabile — un codice che porta i tuoi record, il tuo DNA atletico e la tua storia agonistica.
            Ogni dato è tuo. Per sempre.
          </p>
          <div className="space-y-3 mb-10">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-[10px] flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(0,255,255,0.08)', color: '#00FFFF' }}
                >
                  {f.icon}
                </div>
                <span className="font-ibm-mono text-sm text-white">{f.text}</span>
              </div>
            ))}
          </div>
          <a
            href="#"
            data-testid="kore-id-cta"
            className="ak-btn-cyan inline-flex items-center gap-2 font-ibm-mono text-sm font-bold uppercase px-7 py-3 rounded-[14px] bg-ak-cyan text-black"
          >
            SCOPRI KORE ID <ArrowRight size={15} />
          </a>
        </div>
        {/* Right: Phone mockup */}
        <div className="ak-reveal ak-delay-2 flex justify-center md:justify-end">
          <div
            className="relative w-[260px] md:w-[300px] rounded-[32px] overflow-hidden"
            style={{
              border: '1.5px solid rgba(255,255,255,0.12)',
              boxShadow: '0 0 80px rgba(0,255,255,0.1), 0 40px 80px rgba(0,0,0,0.7)',
            }}
          >
            <img src={SCREEN_4} alt="KORE Profile" className="w-full block" />
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
          <div className="font-ibm-mono text-xs tracking-[0.35em] uppercase mb-4 text-ak-cyan">DISPONIBILE ORA</div>
          <h2 className="font-anton text-4xl md:text-5xl uppercase text-white">
            L'ARENA È NEL TUO<br /><span className="text-ak-cyan">TELEFONO</span>
          </h2>
        </div>
      </div>
      <div className="flex gap-4 px-6 sm:px-10 overflow-x-auto no-scrollbar pb-4 md:justify-center">
        {screens.map((s, i) => (
          <div key={i} className="flex-shrink-0 ak-reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
            <div
              className="w-[190px] md:w-[220px] rounded-[24px] overflow-hidden"
              style={{
                border: '1.5px solid rgba(255,255,255,0.1)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
                transform: i % 2 === 1 ? 'translateY(-20px)' : 'translateY(0)',
              }}
            >
              <img src={s.img} alt={s.label} className="w-full block" />
            </div>
            <div className="font-ibm-mono text-[10px] text-center mt-3 tracking-widest uppercase" style={{ color: '#555' }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── NÈXUS SECTION ─── */
const NEXUS_FEATURES = [
  {
    icon: <Activity size={28} />,
    title: 'K-RATING',
    sub: 'Valutazione 0 – 1000',
    desc: 'Sistema di punteggio biomeccanico che traccia ogni performance. Ogni rep, ogni sprint. Il tuo punteggio non mente.',
    color: '#00FFFF',
  },
  {
    icon: <Clock size={28} />,
    title: 'K-TIMELINE',
    sub: 'Il tuo ritmo settimanale',
    desc: 'Tracker visuale a 7 giorni. Mantieni la continuità o brucia la streak. La disciplina ha un prezzo visibile.',
    color: '#00FFFF',
  },
  {
    icon: <Scan size={28} />,
    title: 'K-SCAN',
    sub: 'Bio-Analisi Puppet Motion',
    desc: 'Analisi cinematica del movimento in tempo reale. Il tuo corpo diventa dati. I dati diventano evoluzione.',
    color: '#00FFFF',
  },
  {
    icon: <Dna size={28} />,
    title: 'DNA UNIVERSALE',
    sub: 'Profilo atletico completo',
    desc: 'Sei attributi fondamentali: VEL, FOR, RES, AGI, TEC, POT. Il tuo DNA atletico tracciato con precisione chirurgica.',
    color: '#FFD700',
  },
];

function NexusSection() {
  return (
    <section
      data-testid="nexus-section"
      className="py-24 md:py-32 px-6 sm:px-10 relative overflow-hidden"
      style={{ background: '#000' }}
    >
      <div
        className="absolute inset-0 opacity-8"
        style={{ backgroundImage: `url(${NEXUS_BG})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      />
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="ak-reveal text-center mb-16">
          <div className="font-ibm-mono text-xs tracking-[0.4em] uppercase mb-4" style={{ color: '#a1a1aa' }}>
            AZIONI NÈXUS
          </div>
          <h2 className="font-anton text-4xl md:text-5xl uppercase text-white leading-none">
            IL SISTEMA CHE TI<br /><span className="text-ak-cyan">CALIBRA.</span>
          </h2>
          <p className="font-ibm-mono text-sm mt-5 max-w-xl mx-auto leading-relaxed" style={{ color: '#a1a1aa' }}>
            NÈXUS non è una semplice app. È un motore di misurazione atletica. Ogni azione è monitorata,
            ogni dato è analizzato, ogni risultato è permanente.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px" style={{ background: 'rgba(255,255,255,0.05)' }}>
          {NEXUS_FEATURES.map((f, i) => (
            <div
              key={i}
              data-testid={`nexus-card-${i}`}
              className="ak-reveal ak-card p-8 flex flex-col gap-5"
              style={{
                background: '#0a0a0a',
                borderTop: `2px solid ${f.color}`,
                transitionDelay: `${i * 0.08}s`,
              }}
            >
              <div style={{ color: f.color }}>{f.icon}</div>
              <div>
                <div className="font-anton text-xl uppercase text-white tracking-wide">{f.title}</div>
                <div className="font-ibm-mono text-xs uppercase tracking-wider mt-1" style={{ color: f.color }}>
                  {f.sub}
                </div>
              </div>
              <p className="font-ibm-mono text-xs leading-relaxed" style={{ color: '#a1a1aa' }}>{f.desc}</p>
            </div>
          ))}
        </div>
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
        {/* Left: Text */}
        <div className="ak-reveal order-2 md:order-1">
          <div className="font-ibm-mono text-xs tracking-[0.3em] uppercase mb-2" style={{ color: '#a1a1aa' }}>
            TALENT CARD
          </div>
          <h2 className="font-anton text-4xl md:text-5xl uppercase leading-none mb-6">
            <span className="text-ak-cyan">DNA</span> <span className="text-white">UNIVERSALE</span>
          </h2>
          <p className="font-ibm-mono text-sm md:text-base mb-8 leading-relaxed" style={{ color: '#a1a1aa' }}>
            Ogni atleta ha attributi unici. Il DNA Universale di ARENAKORE li misura tutti, li traccia nel
            tempo e li confronta con l'élite globale. Non puoi ingannare i dati. I dati non mentono.
          </p>
          <div className="grid grid-cols-3 gap-4 mb-8">
            {DNA_ATTRS.map((a, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="font-ibm-mono text-xs uppercase tracking-wider" style={{ color: '#555' }}>{a.name}</span>
                  <span className="font-anton text-lg ak-glow-cyan" style={{ color: a.color }}>{a.value}</span>
                </div>
                <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${a.value}%`, background: a.color, boxShadow: `0 0 6px ${a.color}60` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div
            className="font-ibm-mono text-xs p-4 rounded-[14px]"
            style={{ background: 'rgba(0,255,255,0.04)', border: '1px solid rgba(0,255,255,0.18)', color: '#a1a1aa' }}
          >
            <span className="text-ak-cyan">PROSSIMA EVOLUZIONE</span> — Completa 7 giorni
            consecutivi per sbloccare l'analisi avanzata del DNA.
          </div>
        </div>
        {/* Right: Radar Chart */}
        <div className="ak-reveal ak-delay-2 order-1 md:order-2">
          <div
            className="p-8 rounded-[14px]"
            style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div className="font-ibm-mono text-xs uppercase tracking-widest mb-4 text-center" style={{ color: '#555' }}>
              DNA CHART · LIVE
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={DNA_DATA} margin={{ top: 15, right: 30, bottom: 15, left: 30 }}>
                <PolarGrid stroke="rgba(0,255,255,0.1)" />
                <PolarAngleAxis
                  dataKey="attr"
                  tick={{ fill: '#00FFFF', fontSize: 12, fontFamily: '"IBM Plex Mono"', fontWeight: 600 }}
                />
                <Radar
                  name="DNA"
                  dataKey="value"
                  stroke="#00FFFF"
                  fill="#00FFFF"
                  fillOpacity={0.1}
                  strokeWidth={2}
                  dot={{ fill: '#00FFFF', r: 4, strokeWidth: 0 }}
                />
              </RadarChart>
            </ResponsiveContainer>
            <div className="text-center mt-4">
              <div className="font-ibm-mono text-xs uppercase tracking-widest mb-1" style={{ color: '#555' }}>K-RATING</div>
              <div className="font-anton text-4xl ak-glow-cyan" style={{ color: '#00FFFF' }}>
                346<span className="text-2xl text-white/60">/1000</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── ARENA SECTION ─── */
const ARENA_FEATURES = [
  {
    icon: <Swords size={22} />,
    title: 'LANCIA IL GUANTO',
    desc: 'Sfida un atleta nella tua disciplina. I dati decideranno chi vince. Nessuna scusa, solo numeri.',
    color: '#FFD700',
  },
  {
    icon: <MapPin size={22} />,
    title: 'MAPPA HUB',
    desc: 'Trova palestre, coach certificati e sfide nelle vicinanze. L\'Arena è ovunque tu sia.',
    color: '#FFD700',
  },
  {
    icon: <Radio size={22} />,
    title: 'SFIDA LIVE',
    desc: 'Competizioni in tempo reale. Trasmetti la tua performance. L\'élite si guarda e si giudica.',
    color: '#FFD700',
  },
];

function ArenaSection() {
  return (
    <section
      data-testid="arena-section"
      className="py-24 md:py-32 px-6 sm:px-10 relative overflow-hidden"
    >
      <div
        className="absolute inset-0"
        style={{ backgroundImage: `url(${ARENA_BG})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      />
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.87)' }} />
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Center header */}
        <div className="ak-reveal text-center mb-16">
          <div className="inline-block relative px-8 pb-6">
            {/* Corner brackets */}
            {['-top-3 -left-2', '-top-3 -right-2', '-bottom-0 -left-2', '-bottom-0 -right-2'].map((pos, i) => (
              <div
                key={i}
                className={`absolute ${pos} w-5 h-5`}
                style={{
                  borderTop: i < 2 ? '2px solid rgba(255,215,0,0.4)' : 'none',
                  borderBottom: i >= 2 ? '2px solid rgba(255,215,0,0.4)' : 'none',
                  borderLeft: i % 2 === 0 ? '2px solid rgba(255,215,0,0.4)' : 'none',
                  borderRight: i % 2 === 1 ? '2px solid rgba(255,215,0,0.4)' : 'none',
                }}
              />
            ))}
            <div className="font-ibm-mono text-xs tracking-[0.4em] uppercase mb-5" style={{ color: '#a1a1aa' }}>
              ARENAKORE
            </div>
            <h2 className="font-anton text-5xl md:text-7xl uppercase text-white leading-none">
              L'ELITE<br />SI CONFRONTA
            </h2>
            <div className="font-ibm-mono text-xs tracking-[0.4em] uppercase mt-5" style={{ color: '#a1a1aa' }}>
              SFIDE · RECORD · DETERMINAZIONE
            </div>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-sm mx-auto mt-12">
            {[
              { icon: <Users size={16} />, value: '26', label: 'KORE ATTIVI' },
              { icon: <Zap size={16} />, value: '∞', label: 'SESSIONI' },
              { icon: <Trophy size={16} />, value: '99', label: 'RECORD' },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="text-ak-cyan">{s.icon}</div>
                <div className="font-anton text-3xl ak-glow-cyan text-ak-cyan">{s.value}</div>
                <div className="font-ibm-mono text-[9px] uppercase tracking-widest" style={{ color: '#555' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Arena feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ARENA_FEATURES.map((f, i) => (
            <div
              key={i}
              data-testid={`arena-card-${i}`}
              className="ak-reveal ak-card-gold p-6 rounded-[14px] flex items-start gap-4"
              style={{
                background: 'rgba(255,215,0,0.04)',
                border: '1px solid rgba(255,215,0,0.18)',
                transitionDelay: `${i * 0.1}s`,
              }}
            >
              <div
                className="w-12 h-12 rounded-[12px] flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(255,215,0,0.08)', color: '#FFD700' }}
              >
                {f.icon}
              </div>
              <div>
                <div className="font-anton text-lg uppercase text-white mb-1">{f.title}</div>
                <p className="font-ibm-mono text-xs leading-relaxed" style={{ color: '#a1a1aa' }}>{f.desc}</p>
              </div>
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
          <div className="flex-1 max-w-[80px] h-px" style={{ background: 'rgba(0,255,255,0.25)' }} />
          <div className="w-2 h-2 rounded-full" style={{ background: '#00FFFF', boxShadow: '0 0 10px #00FFFF' }} />
          <div className="flex-1 max-w-[80px] h-px" style={{ background: 'rgba(0,255,255,0.25)' }} />
        </div>
        <div className="font-ibm-mono text-xs tracking-[0.4em] uppercase mb-5" style={{ color: '#a1a1aa' }}>
          INIZIA ORA · GRATIS
        </div>
        <h2 className="font-anton text-5xl md:text-7xl uppercase leading-none text-white mb-6">
          ENTRA<br />NELL'<span className="text-ak-cyan">ARENA</span>
        </h2>
        <p className="font-ibm-mono text-sm md:text-base mb-10 max-w-xl mx-auto leading-relaxed" style={{ color: '#a1a1aa' }}>
          Registrati ora e ricevi 100 K-FLUX di benvenuto. La tua identità atletica digitale ti aspetta.
          Il tuo record è pronto ad essere scritto.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
          <a
            href="#"
            data-testid="download-app-store-btn"
            className="ak-btn-cyan flex items-center justify-center gap-3 font-ibm-mono font-bold uppercase text-sm px-10 py-5 rounded-[14px] bg-ak-cyan text-black"
          >
            <Download size={20} />
            APP STORE
          </a>
          <a
            href="#"
            data-testid="download-play-store-btn"
            className="ak-btn-cyan flex items-center justify-center gap-3 font-ibm-mono font-bold uppercase text-sm px-10 py-5 rounded-[14px] bg-ak-cyan text-black"
          >
            <Download size={20} />
            GOOGLE PLAY
          </a>
        </div>
        <div
          className="inline-flex items-center gap-3 font-ibm-mono text-xs px-6 py-3 rounded-full"
          style={{ background: 'rgba(255,215,0,0.04)', border: '1px solid rgba(255,215,0,0.18)', color: '#a1a1aa' }}
        >
          <Zap size={14} style={{ color: '#FFD700' }} />
          <span><span className="text-ak-gold">+100 K-FLUX</span> BONUS DI BENVENUTO</span>
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
        {/* Watermark */}
        <div className="font-anton text-[clamp(40px,10vw,120px)] uppercase leading-none overflow-hidden mb-10" style={{ color: 'rgba(255,255,255,0.03)' }}>
          ARENAKORE
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {cols.map((col, i) => (
            <div key={i}>
              <div className="font-ibm-mono text-[10px] uppercase tracking-widest mb-4" style={{ color: '#444' }}>
                {col.title}
              </div>
              <ul className="space-y-2">
                {col.links.map(link => (
                  <li key={link}>
                    <a href="#" className="font-ibm-mono text-sm hover:text-white transition-colors" style={{ color: '#888' }}>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/8 gap-4">
          <div className="font-anton text-xl tracking-widest uppercase">
            <span className="text-white">ARENA</span><span className="text-ak-cyan">KORE</span>
          </div>
          <div className="font-ibm-mono text-xs" style={{ color: '#444' }}>
            © 2026 ARENAKORE. Tutti i diritti riservati.
          </div>
          <div className="flex items-center gap-2">
            <span className="ak-blink w-1.5 h-1.5 rounded-full" style={{ background: '#00FF66' }} />
            <span className="font-ibm-mono text-xs" style={{ color: '#444' }}>SISTEMA ATTIVO</span>
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
    <div className="bg-black text-white overflow-x-hidden font-ibm-mono">
      <Navbar scrolled={scrolled} />
      <HeroSection />
      <StatsStrip />
      <KoreIDSection />
      <AppPreviewSection />
      <NexusSection />
      <DNASection />
      <ArenaSection />
      <DownloadCTA />
      <FooterSection />
    </div>
  );
}
