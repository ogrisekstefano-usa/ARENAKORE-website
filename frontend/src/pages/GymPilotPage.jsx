import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  ChevronDown, CheckCircle, ArrowRight, Zap, Users,
  TrendingUp, Shield, Trophy, Calendar, Clock, AlertCircle, X
} from 'lucide-react';
import { LOGO } from '../data/seo-content';
import { useSEO } from '../components/SharedLayout';

const API = process.env.REACT_APP_BACKEND_URL + '/api';

const HERO_IMG    = 'https://images.unsplash.com/photo-1636634450055-51533cb3e0d6?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600';
const GROUP_IMG   = 'https://images.pexels.com/photos/16966342/pexels-photo-16966342.jpeg?auto=compress&cs=tinysrgb&w=1400';
const COMPETE_IMG = 'https://images.unsplash.com/photo-1739283180407-21e27d5c0735?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400';

/* ─ Sticky Nav ─ */
function PilotNav({ onCTA }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/95 backdrop-blur-md border-b border-white/10' : 'bg-transparent'}`}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8 flex items-center justify-between h-16">
        <Link to="/">
          <img src={LOGO} alt="ArenaKore" className="h-8 w-auto object-contain" />
        </Link>
        <button
          onClick={onCTA}
          data-testid="nav-cta-btn"
          className="font-inter font-black uppercase tracking-wider text-xs px-5 rounded-[14px] bg-ak-gold text-black hover:scale-105 transition-transform"
          style={{ height: '36px' }}
        >
          Avvia il Pilot
        </button>
      </div>
    </nav>
  );
}

/* ─ Section Heading ─ */
function SectionLabel({ text, color = '#00FFFF' }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
      <span className="font-inter text-xs font-bold tracking-[0.35em] uppercase" style={{ color }}>{text}</span>
    </div>
  );
}

/* ─ Lead Form ─ */
function PilotForm({ id = 'pilot-form' }) {
  const [form, setForm] = useState({ gym_name: '', city: '', owner_name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.gym_name || !form.city || !form.owner_name || !form.email) {
      setError('Compila tutti i campi obbligatori.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await axios.post(`${API}/pilot-requests`, {
        gym_name: form.gym_name,
        city: form.city,
        owner_name: form.owner_name,
        email: form.email,
        phone: form.phone || null,
      });
      setSuccess(true);
    } catch (err) {
      setError('Errore nell\'invio. Riprova o scrivi a support@arenakore.com');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div id={id} className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-ak-cyan/10 border border-ak-cyan/40 flex items-center justify-center mb-6">
          <CheckCircle size={32} className="text-ak-cyan" />
        </div>
        <h3 className="font-anton text-3xl uppercase text-white mb-3">RICHIESTA INVIATA.</h3>
        <p className="font-inter text-base text-white mb-2 max-w-sm">
          Ti contatteremo entro <strong>24 ore</strong> per attivare il tuo pilot.
        </p>
        <p className="font-inter text-sm text-white">Controlla la casella email: <span className="text-ak-cyan font-semibold">{form.email}</span></p>
      </div>
    );
  }

  const inputClass = "w-full font-inter text-sm text-white placeholder-white/40 px-4 py-3 rounded-[12px] outline-none focus:border-ak-cyan transition-colors bg-black/60";
  const inputStyle = { border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)' };

  return (
    <form id={id} onSubmit={handleSubmit} className="space-y-4" data-testid="pilot-form">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="font-inter text-xs font-bold uppercase tracking-wider text-white/60 block mb-2">
            Nome Palestra <span className="text-ak-gold">*</span>
          </label>
          <input
            data-testid="form-gym-name"
            type="text" placeholder="CrossFit Roma Est"
            value={form.gym_name}
            onChange={e => setForm({ ...form, gym_name: e.target.value })}
            className={inputClass} style={inputStyle}
          />
        </div>
        <div>
          <label className="font-inter text-xs font-bold uppercase tracking-wider text-white/60 block mb-2">
            Città <span className="text-ak-gold">*</span>
          </label>
          <input
            data-testid="form-city"
            type="text" placeholder="Roma"
            value={form.city}
            onChange={e => setForm({ ...form, city: e.target.value })}
            className={inputClass} style={inputStyle}
          />
        </div>
      </div>
      <div>
        <label className="font-inter text-xs font-bold uppercase tracking-wider text-white/60 block mb-2">
          Il tuo nome <span className="text-ak-gold">*</span>
        </label>
        <input
          data-testid="form-owner-name"
          type="text" placeholder="Marco Rossi"
          value={form.owner_name}
          onChange={e => setForm({ ...form, owner_name: e.target.value })}
          className={inputClass} style={inputStyle}
        />
      </div>
      <div>
        <label className="font-inter text-xs font-bold uppercase tracking-wider text-white/60 block mb-2">
          Email <span className="text-ak-gold">*</span>
        </label>
        <input
          data-testid="form-email"
          type="email" placeholder="marco@crossfitroma.it"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          className={inputClass} style={inputStyle}
        />
      </div>
      <div>
        <label className="font-inter text-xs font-bold uppercase tracking-wider text-white/60 block mb-2">
          Telefono <span className="text-white/30">(opzionale)</span>
        </label>
        <input
          data-testid="form-phone"
          type="tel" placeholder="+39 333 000 0000"
          value={form.phone}
          onChange={e => setForm({ ...form, phone: e.target.value })}
          className={inputClass} style={inputStyle}
        />
      </div>

      {error && (
        <div className="flex items-center gap-3 p-3 rounded-[10px]" style={{ background: 'rgba(255,45,45,0.1)', border: '1px solid rgba(255,45,45,0.3)' }}>
          <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
          <span className="font-inter text-xs text-red-400">{error}</span>
        </div>
      )}

      <button
        type="submit"
        data-testid="form-submit-btn"
        disabled={loading}
        className="w-full font-inter font-black uppercase tracking-wider text-sm rounded-[14px] bg-ak-gold text-black hover:scale-[1.01] transition-transform disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        style={{ height: '56px' }}
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            INVIO IN CORSO...
          </>
        ) : (
          <>
            <Zap size={18} fill="black" />
            RICHIEDI IL PILOT — GRATIS
          </>
        )}
      </button>

      <p className="font-inter text-xs text-white/40 text-center">
        Zero costi. Nessun impegno. Solo risultati.
      </p>
    </form>
  );
}

/* ─ Main Page ─ */
export default function GymPilotPage() {
  useSEO({
    title: 'Pilot 14 Giorni per Palestre | ArenaKore',
    description: 'Trasforma la tua palestra in un sistema competitivo. 14 giorni, 20–30 membri, zero costo. Avvia il pilot ArenaKore oggi.',
  });

  const scrollToForm = () => {
    document.getElementById('pilot-form-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-black text-white min-h-screen font-inter overflow-x-hidden">
      <PilotNav onCTA={scrollToForm} />

      {/* ══ S1: HERO ══ */}
      <section
        className="relative min-h-screen flex flex-col justify-end pt-16"
        data-testid="pilot-hero"
        style={{ backgroundImage: `url(${HERO_IMG})`, backgroundSize: 'cover', backgroundPosition: 'center 30%' }}
      >
        <div className="absolute inset-0" style={{ background: 'linear-gradient(170deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.92) 70%, rgba(0,0,0,1) 100%)' }} />
        <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-10 pb-20 w-full">
          <SectionLabel text="PILOT 14 GIORNI · PALESTRE" />
          <h1 className="font-anton text-5xl sm:text-6xl md:text-7xl uppercase leading-[0.9] text-white mb-6">
            I TUOI ISCRITTI<br />
            NON HANNO BISOGNO<br />
            DI PIÙ ALLENAMENTI.<br />
            <span style={{ color: '#FFD700' }}>HANNO BISOGNO<br />DI COMPETIZIONE.</span>
          </h1>
          <p className="font-inter text-lg md:text-xl text-white mb-10 max-w-xl leading-relaxed">
            Trasforma la tua palestra in un sistema di sfide quotidiane.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={scrollToForm} data-testid="hero-cta-primary"
              className="inline-flex items-center justify-center gap-3 font-inter font-black uppercase tracking-wider text-base px-10 rounded-[14px] bg-ak-gold text-black hover:scale-105 transition-transform"
              style={{ height: '60px' }}>
              <Zap size={20} fill="black" /> Avvia il tuo pilot — Gratis
            </button>
            <a href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 font-inter font-semibold uppercase tracking-wider text-sm px-8 rounded-[14px] border border-white/25 text-white hover:border-white transition-colors"
              style={{ height: '60px' }}>
              Come funziona <ChevronDown size={16} />
            </a>
          </div>
          <div className="mt-10 flex flex-wrap gap-6">
            {['14 giorni gratis', '20–30 membri', 'Zero setup', 'Risultati visibili'].map((t, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle size={14} className="text-ak-cyan flex-shrink-0" />
                <span className="font-inter text-xs font-semibold text-white">{t}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-white/30">
          <span className="font-inter text-[10px] tracking-[0.3em] uppercase">Scorri</span>
          <ChevronDown size={16} className="animate-bounce" />
        </div>
      </section>

      {/* ══ S2: PROBLEM ══ */}
      <section className="py-24 md:py-28 px-6 sm:px-10" style={{ background: '#050505' }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <SectionLabel text="IL VERO PROBLEMA" color="#FF2D2D" />
              <h2 className="font-anton text-4xl md:text-5xl uppercase leading-none text-white mb-8">
                IL PROBLEMA NON È<br />
                <span style={{ color: '#FF2D2D' }}>L'ACQUISIZIONE.</span><br />
                È LA RETENTION.
              </h2>
              <div className="space-y-5">
                {[
                  { stat: '80%', desc: 'degli iscritti sparisce entro 6 mesi dall\'iscrizione.' },
                  { stat: '0', desc: 'conseguenze per chi non si presenta. Nessuno lo nota.' },
                  { stat: '1/5', desc: 'degli iscritti torna dopo un mese di assenza senza uno stimolo esterno.' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-5 p-5 rounded-[14px]" style={{ background: '#0a0a0a', border: '1px solid rgba(255,45,45,0.15)' }}>
                    <div className="font-anton text-3xl flex-shrink-0" style={{ color: '#FF2D2D' }}>{item.stat}</div>
                    <p className="font-inter text-sm text-white leading-relaxed pt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative rounded-[16px] overflow-hidden" style={{ height: '420px' }}>
              <img src={GROUP_IMG} alt="Gym competition" className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)' }} />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="font-inter text-xs font-bold uppercase tracking-widest text-ak-gold mb-1">FATTO</div>
                <p className="font-inter text-sm text-white font-semibold">I tuoi migliori iscritti si allenano già 5 volte a settimana. Il problema sono gli altri.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ S3: INSIGHT ══ */}
      <section className="py-20 md:py-24 px-6 sm:px-10 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-12 h-1 bg-ak-cyan mx-auto mb-8 rounded" />
          <blockquote className="font-anton text-4xl md:text-6xl uppercase leading-none text-white mb-8">
            "LE PERSONE NON TORNANO<br />
            <span style={{ color: '#00FFFF' }}>AD ALLENARSI.</span><br />
            TORNANO PER<br />
            <span style={{ color: '#FFD700' }}>NON PERDERE."</span>
          </blockquote>
          <p className="font-inter text-base md:text-lg text-white max-w-2xl mx-auto leading-relaxed">
            La psicologia del comportamento è chiara: l'avversione alla perdita è 2x più motivante del desiderio di guadagno.
            Quando c'è un ranking visibile e un rivale che ti supera in classifica, il cervello si attiva diversamente.
            Non è teoria. È quello che succede in ogni palestra che introduce competizione strutturata.
          </p>
        </div>
      </section>

      {/* ══ S4: SOLUTION ══ */}
      <section className="py-24 px-6 sm:px-10" style={{ background: '#050505' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <SectionLabel text="LA SOLUZIONE" />
            <h2 className="font-anton text-4xl md:text-5xl uppercase leading-none text-white">
              ARENAKORE TRASFORMA LA<br />
              TUA PALESTRA IN UN<br />
              <span style={{ color: '#00FFFF' }}>SISTEMA COMPETITIVO.</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: <Zap size={24} />, title: 'SFIDE QUOTIDIANE', desc: 'Ogni giorno una nuova sfida con timer, target e validazione automatica delle rep.', color: '#00FFFF' },
              { icon: <Trophy size={24} />, title: 'RANKING LIVE', desc: 'Classifica in tempo reale. I tuoi iscritti si vedono, si confrontano, si sfiidano.', color: '#FFD700' },
              { icon: <TrendingUp size={24} />, title: 'PERFORMANCE VISIBILE', desc: 'Ogni sessione aggiorna il K-Rating. I progressi sono pubblici, certificati, reali.', color: '#00FFFF' },
              { icon: <Users size={24} />, title: 'COMPETIZIONE INTERNA', desc: 'Rivalità naturali tra membri. Chi è davanti, chi insegue, chi deve dimostrare.', color: '#FFD700' },
            ].map((item, i) => (
              <div key={i} className="p-7 rounded-[14px] flex flex-col gap-4" style={{ background: '#0a0a0a', border: `1px solid ${item.color}20` }}>
                <div style={{ color: item.color }}>{item.icon}</div>
                <div className="font-anton text-lg uppercase text-white">{item.title}</div>
                <p className="font-inter text-sm text-white leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ S5: HOW IT WORKS ══ */}
      <section id="how-it-works" className="py-24 px-6 sm:px-10 bg-black">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <SectionLabel text="COME FUNZIONA IL PILOT" />
            <h2 className="font-anton text-4xl md:text-5xl uppercase text-white">4 PASSI. 14 GIORNI.</h2>
          </div>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-px hidden md:block" style={{ background: 'linear-gradient(to bottom, #00FFFF, #FFD700)' }} />
            <div className="space-y-8">
              {[
                { num: '01', title: 'Attiviamo 20–30 membri', desc: 'Selezioniamo con te i membri più coinvolti per il lancio. Li onboardiamo in 30 minuti con KORE ID e primo challenge.', color: '#00FFFF' },
                { num: '02', title: 'Lanciamo le sfide', desc: 'Impostiamo la prima settimana di challenge personalizzate sulla tua programmazione. Nessun cambio al tuo metodo.', color: '#00FFFF' },
                { num: '03', title: 'Tracciamo le performance', desc: 'NEXUS valida ogni rep. Il K-Rating si aggiorna dopo ogni sessione. Tu vedi chi si allena, chi scala, chi rischia di mollare.', color: '#FFD700' },
                { num: '04', title: 'La palestra diventa competitiva', desc: 'Dopo 14 giorni hai dati reali: più presenze, più interazione, ranking visibile. Poi decidi tu.', color: '#FFD700' },
              ].map((step, i) => (
                <div key={i} className="relative flex gap-8 items-start pl-0 md:pl-20">
                  <div className="hidden md:flex absolute left-0 top-0 w-16 h-16 rounded-full items-center justify-center flex-shrink-0 font-anton text-2xl" style={{ background: '#0a0a0a', border: `2px solid ${step.color}`, color: step.color }}>
                    {step.num}
                  </div>
                  <div className="flex-1 p-7 rounded-[14px]" style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="md:hidden font-anton text-xl" style={{ color: step.color }}>{step.num}</span>
                      <h3 className="font-anton text-xl uppercase text-white">{step.title}</h3>
                    </div>
                    <p className="font-inter text-sm text-white leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ S6: WHAT CHANGES ══ */}
      <section className="py-24 px-6 sm:px-10 relative overflow-hidden" style={{ background: '#050505' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <SectionLabel text="COSA CAMBIA" />
            <h2 className="font-anton text-4xl md:text-5xl uppercase text-white">
              COSA SUCCEDE<br />
              <span style={{ color: '#FFD700' }}>IN 14 GIORNI</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              { before: 'Presenze piatte o in calo', after: 'Più sessioni per iscritto: la sfida attiva crea un motivo per tornare ogni giorno.', icon: <Calendar size={22} />, color: '#00FFFF' },
              { before: 'Iscritti silenziosi, nessuna interazione', after: 'Interazione naturale tra membri: ranking, rivalità, commenti sulla performance.', icon: <Users size={22} />, color: '#FFD700' },
              { before: 'Nessun confronto tra membri', after: 'Competizione interna strutturata: tutti sanno dove si trovano nella classifica.', icon: <TrendingUp size={22} />, color: '#00FFFF' },
              { before: 'Community debole, nessuna identità', after: 'Community più forte: l\'identità dell\'Arena è condivisa, orgogliosa, competitiva.', icon: <Shield size={22} />, color: '#FFD700' },
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-[14px]" style={{ background: '#0a0a0a', border: `1px solid ${item.color}20` }}>
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0" style={{ background: `${item.color}10`, color: item.color }}>
                    {item.icon}
                  </div>
                  <div>
                    <div className="font-inter text-xs text-white/40 line-through mb-1">{item.before}</div>
                    <div className="font-inter text-sm text-white font-medium leading-relaxed">{item.after}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ S7: BOX VS BOX ══ */}
      <section className="relative py-24 px-6 sm:px-10 overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage: `url(${COMPETE_IMG})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.88)' }} />
        <div className="relative z-10 max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <SectionLabel text="BOX VS BOX" color="#FFD700" />
            <h2 className="font-anton text-4xl md:text-5xl uppercase leading-none text-white mb-6">
              COMPETIZIONE<br />
              TRA<br />
              <span style={{ color: '#FFD700' }}>LOCATION.</span>
            </h2>
            <p className="font-inter text-base text-white mb-6 leading-relaxed">
              Hai più sedi? I tuoi membri possono gareggiare l'uno contro l'altro tra location diverse.
              La sede 1 sfida la sede 2. Il ranking mostra quale ha i membri più forti.
              Questo è il tipo di dinamica che fa parlare, fa tornare, fa restare.
            </p>
            <p className="font-inter text-base text-white leading-relaxed">
              Anche con una sola sede, il box vs box si gioca con le palestre vicine nella tua città
              attraverso la Mappa Hub di ArenaKore.
            </p>
          </div>
          <div className="space-y-4">
            {[
              { label: 'Sede A', score: '847', rank: '#1', color: '#FFD700' },
              { label: 'Sede B', score: '783', rank: '#2', color: '#00FFFF' },
              { label: 'CrossFit Rivali', score: '720', rank: '#3', color: 'rgba(255,255,255,0.4)' },
            ].map((team, i) => (
              <div key={i} className="flex items-center justify-between p-5 rounded-[14px]" style={{ background: '#0a0a0a', border: `1px solid ${team.color}30` }}>
                <div className="flex items-center gap-4">
                  <div className="font-anton text-2xl" style={{ color: team.color }}>{team.rank}</div>
                  <div>
                    <div className="font-anton text-lg uppercase text-white">{team.label}</div>
                    <div className="font-inter text-xs text-white/60">K-Rating medio</div>
                  </div>
                </div>
                <div className="font-anton text-3xl" style={{ color: team.color }}>{team.score}</div>
              </div>
            ))}
            <p className="font-inter text-xs text-white/40 text-center">Dati di esempio · aggiornati live durante le challenge</p>
          </div>
        </div>
      </section>

      {/* ══ S8: OFFER ══ */}
      <section className="py-24 px-6 sm:px-10 bg-black">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <SectionLabel text="L'OFFERTA PILOT" />
            <h2 className="font-anton text-4xl md:text-6xl uppercase text-white mb-4">
              TESTALO.<br />
              <span style={{ color: '#00FFFF' }}>ZERO RISCHI.</span>
            </h2>
            <p className="font-inter text-base text-white max-w-lg mx-auto">
              Nessun contratto. Nessuna carta di credito. Solo 14 giorni per vedere cosa succede quando la tua palestra diventa competitiva.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {[
              { icon: <Calendar size={28} />, value: '14', label: 'giorni', sub: 'del pilot completo', color: '#00FFFF' },
              { icon: <Users size={28} />, value: '20–30', label: 'membri', sub: 'attivati nel pilot', color: '#FFD700' },
              { icon: <Shield size={28} />, value: '100%', label: 'gestito', sub: 'da noi l\'onboarding', color: '#00FFFF' },
              { icon: <Zap size={28} />, value: '€0', label: 'costo', sub: 'nessun impegno', color: '#FFD700' },
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-[14px] text-center" style={{ background: '#0a0a0a', border: `2px solid ${item.color}30` }}>
                <div className="flex justify-center mb-3" style={{ color: item.color }}>{item.icon}</div>
                <div className="font-anton text-4xl mb-1" style={{ color: item.color }}>{item.value}</div>
                <div className="font-inter text-xs font-bold uppercase tracking-wider text-white">{item.label}</div>
                <div className="font-inter text-xs text-white/50 mt-1">{item.sub}</div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <button onClick={scrollToForm} data-testid="offer-cta-btn"
              className="inline-flex items-center gap-3 font-inter font-black uppercase tracking-wider text-base px-12 rounded-[14px] bg-ak-gold text-black hover:scale-105 transition-transform"
              style={{ height: '60px' }}>
              <Zap size={20} fill="black" /> Avvia il Pilot Ora
            </button>
          </div>
        </div>
      </section>

      {/* ══ S9: FINAL CTA + FORM ══ */}
      <section id="pilot-form-section" className="py-24 px-6 sm:px-10" style={{ background: '#050505' }}>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          {/* Left: CTA copy */}
          <div>
            <SectionLabel text="INIZIA" />
            <h2 className="font-anton text-5xl md:text-6xl uppercase leading-none text-white mb-4">
              INIZIAMO.
            </h2>
            <p className="font-inter text-lg text-white mb-8 leading-relaxed">
              Due settimane. Poi decidi tu.
            </p>
            <div className="space-y-4 mb-10">
              {[
                'Compili il form — ci mettiamo 2 minuti',
                'Ti contatteremo entro 24 ore',
                'Setup e onboarding in meno di 1 ora',
                'Primo challenge attivo entro 48 ore',
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-ak-gold/10 border border-ak-gold/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="font-inter text-[10px] font-bold text-ak-gold">{i + 1}</span>
                  </div>
                  <span className="font-inter text-sm text-white">{step}</span>
                </div>
              ))}
            </div>
            <div className="p-5 rounded-[14px]" style={{ background: 'rgba(255,215,0,0.05)', border: '1px solid rgba(255,215,0,0.2)' }}>
              <div className="font-inter text-xs font-bold uppercase tracking-wider text-ak-gold mb-2">POSTO LIMITATI</div>
              <p className="font-inter text-sm text-white">Accettiamo un numero limitato di palestre ogni mese per garantire un onboarding di qualità. Prenota ora il tuo slot.</p>
            </div>
          </div>

          {/* Right: Form */}
          <div className="p-8 rounded-[16px]" style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="mb-6">
              <h3 className="font-anton text-2xl uppercase text-white mb-1">RICHIEDI IL PILOT</h3>
              <p className="font-inter text-xs text-white/50">Nessuna carta di credito · Zero impegno</p>
            </div>
            <PilotForm id="pilot-form" />
          </div>
        </div>
      </section>

      {/* ══ S10: FAQ ══ */}
      <section className="py-20 px-6 sm:px-10 bg-black">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-anton text-3xl md:text-4xl uppercase text-white mb-10 text-center">DOMANDE FREQUENTI</h2>
          <div className="space-y-3">
            {[
              {
                q: 'Devo cambiare la mia programmazione?',
                a: 'No. ArenaKore si integra con qualsiasi tipo di programmazione. Non cambia il tuo metodo — aggiunge uno strato competitivo sopra quello che fai già. I tuoi WOD restano tuoi.',
              },
              {
                q: 'È solo per CrossFit?',
                a: 'No. ArenaKore funziona per CrossFit, functional training, bootcamp, palestre tradizionali e qualsiasi struttura che fa allenamenti di gruppo o individuali con movimenti verificabili.',
              },
              {
                q: 'Quanto tempo richiede il setup?',
                a: 'Il nostro team gestisce tutto l\'onboarding. Dal momento in cui ci confermi il pilot, i tuoi 20–30 membri sono operativi in meno di 48 ore. Non richiede intervento tecnico da parte tua.',
              },
              {
                q: 'E se non funziona?',
                a: 'Finisce il pilot. Nessun costo, nessun impegno. Ci teniamo i dati raccolti, tu tieni l\'esperienza e le informazioni sulle performance dei tuoi iscritti. Non hai nulla da perdere.',
              },
              {
                q: 'I miei iscritti devono scaricare un\'app?',
                a: 'Sì. Ogni iscritto crea un KORE ID gratuito su ArenaKore. L\'onboarding richiede circa 5 minuti. Il nostro team supporta i tuoi membri durante il primo setup.',
              },
            ].map((f, i) => (
              <details key={i} className="group border border-white/10 rounded-[14px] overflow-hidden" style={{ background: '#0a0a0a' }}>
                <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                  <span className="font-inter text-sm font-semibold text-white pr-4">{f.q}</span>
                  <ChevronDown size={16} className="text-ak-cyan flex-shrink-0 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-5 pb-5">
                  <p className="font-inter text-sm text-white leading-relaxed">{f.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FINAL BOTTOM CTA ══ */}
      <section className="py-16 px-6 sm:px-10 text-center" style={{ background: '#050505' }}>
        <div className="max-w-2xl mx-auto">
          <div className="w-10 h-1 bg-ak-gold mx-auto mb-6 rounded" />
          <h2 className="font-anton text-4xl md:text-5xl uppercase text-white mb-4">DUE SETTIMANE.</h2>
          <p className="font-inter text-base text-white mb-8">Poi decidi tu.</p>
          <button onClick={scrollToForm} data-testid="bottom-final-cta"
            className="inline-flex items-center gap-3 font-inter font-black uppercase tracking-wider text-sm px-12 rounded-[14px] bg-ak-gold text-black hover:scale-105 transition-transform"
            style={{ height: '56px' }}>
            <Zap size={18} fill="black" /> Avvia il Pilot
          </button>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="border-t border-white/8 bg-black py-8 px-6 sm:px-10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <img src={LOGO} alt="ArenaKore" className="h-7 w-auto object-contain" />
          <div className="flex items-center gap-6">
            <Link to="/for-gyms" className="font-inter text-xs text-white hover:text-ak-cyan transition-colors">Per Palestre</Link>
            <Link to="/support" className="font-inter text-xs text-white hover:text-ak-cyan transition-colors">Support</Link>
            <a href="mailto:support@arenakore.com" className="font-inter text-xs text-white hover:text-ak-cyan transition-colors">Contatti</a>
          </div>
          <div className="font-inter text-xs text-white/40">© 2026 ArenaKore</div>
        </div>
      </footer>
    </div>
  );
}
