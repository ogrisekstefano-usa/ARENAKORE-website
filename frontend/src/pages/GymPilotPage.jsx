import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { trackConversion } from '../utils/tracking';
import {
  ChevronDown, CheckCircle, ArrowRight, Zap, Users,
  TrendingUp, Shield, Trophy, Calendar, AlertCircle
} from 'lucide-react';
import { InnerNavbar, InnerFooter, useSEO } from '../components/SharedLayout';
import usePageContent from '../hooks/usePageContent';
import useCMSSEO from '../hooks/useCMSSEO';

const API = process.env.REACT_APP_BACKEND_URL + '/api';
const HERO_IMG    = 'https://images.unsplash.com/photo-1636634450055-51533cb3e0d6?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600';
const GROUP_IMG   = 'https://images.pexels.com/photos/16966342/pexels-photo-16966342.jpeg?auto=compress&cs=tinysrgb&w=1400';
const COMPETE_IMG = 'https://images.unsplash.com/photo-1739283180407-21e27d5c0735?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400';

function SectionLabel({ text, color = '#00FFFF' }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
      <span className="font-inter text-xs font-bold tracking-[0.35em] uppercase" style={{ color }}>{text}</span>
    </div>
  );
}

function PilotForm({ id = 'pilot-form', cms = () => '' }) {
  const { i18n } = useTranslation();
  const [form, setForm] = useState({ gym_name: '', city: '', owner_name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.gym_name || !form.city || !form.owner_name || !form.email) {
      setError(cms('form_error_required')); return;
    }
    setLoading(true); setError('');
    try {
      await axios.post(`${API}/pilot-requests`, {
        gym_name: form.gym_name, city: form.city,
        owner_name: form.owner_name, email: form.email,
        phone: form.phone || null,
      });
      trackConversion({ action: 'pilot_submit', source_cta_key: 'cta_pilot', page: 'gym-pilot', position: 'form' });
      setSuccess(true);
    } catch {
      setError(cms('form_error_send'));
    } finally { setLoading(false); }
  };

  if (success) {
    return (
      <div id={id} className="flex flex-col items-center justify-center py-12 px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-ak-cyan/10 border border-ak-cyan/40 flex items-center justify-center mb-6">
          <CheckCircle size={32} className="text-ak-cyan" />
        </div>
        <h3 className="font-anton text-3xl uppercase text-white mb-3">{cms('form_success_h3')}</h3>
        <p className="font-inter text-base text-white mb-2 max-w-sm">
          {cms('form_success_p1')} <strong>{cms('form_success_p2')}</strong> {cms('form_success_p3')}
        </p>
        <p className="font-inter text-sm text-white">{cms('form_success_p4')} <span className="text-ak-cyan font-semibold">{form.email}</span></p>
      </div>
    );
  }

  const inp = "w-full font-inter text-sm text-white placeholder-white/30 px-4 py-3 rounded-[12px] outline-none focus:border-ak-cyan transition-colors";
  const inpStyle = { border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.04)' };

  return (
    <form id={id} onSubmit={handleSubmit} className="space-y-4" data-testid="pilot-form">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="font-inter text-xs font-bold uppercase tracking-wider text-white/50 block mb-2">
            {cms('form_gymName')} <span className="text-ak-gold">*</span>
          </label>
          <input data-testid="form-gym-name" type="text" placeholder="CrossFit Arena"
            value={form.gym_name} onChange={e => setForm({ ...form, gym_name: e.target.value })}
            className={inp} style={inpStyle} />
        </div>
        <div>
          <label className="font-inter text-xs font-bold uppercase tracking-wider text-white/50 block mb-2">
            {cms('form_city')} <span className="text-ak-gold">*</span>
          </label>
          <input data-testid="form-city" type="text" placeholder="Rome"
            value={form.city} onChange={e => setForm({ ...form, city: e.target.value })}
            className={inp} style={inpStyle} />
        </div>
      </div>
      <div>
        <label className="font-inter text-xs font-bold uppercase tracking-wider text-white/50 block mb-2">
          {cms('form_ownerName')} <span className="text-ak-gold">*</span>
        </label>
        <input data-testid="form-owner-name" type="text" placeholder="Your name"
          value={form.owner_name} onChange={e => setForm({ ...form, owner_name: e.target.value })}
          className={inp} style={inpStyle} />
      </div>
      <div>
        <label className="font-inter text-xs font-bold uppercase tracking-wider text-white/50 block mb-2">
          {cms('form_email')} <span className="text-ak-gold">*</span>
        </label>
        <input data-testid="form-email" type="email" placeholder="you@yourgym.com"
          value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
          className={inp} style={inpStyle} />
      </div>
      <div>
        <label className="font-inter text-xs font-bold uppercase tracking-wider text-white/50 block mb-2">
          {cms('form_phone')} <span className="text-white/30">{cms('form_phoneOptional')}</span>
        </label>
        <input data-testid="form-phone" type="tel" placeholder="+1 555 000 0000"
          value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
          className={inp} style={inpStyle} />
      </div>
      {error && (
        <div className="flex items-center gap-3 p-3 rounded-[10px]" style={{ background: 'rgba(255,45,45,0.1)', border: '1px solid rgba(255,45,45,0.3)' }}>
          <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
          <span className="font-inter text-xs text-red-400">{error}</span>
        </div>
      )}
      <button type="submit" data-testid="form-submit-btn" disabled={loading}
        className="w-full font-inter font-black uppercase tracking-wider text-sm rounded-[14px] bg-ak-gold text-black hover:scale-[1.01] transition-transform disabled:opacity-60 flex items-center justify-center gap-3"
        style={{ height: '56px' }}>
        {loading ? (
          <><div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />{cms('form_sending')}</>
        ) : (
          <><Zap size={18} fill="black" />{cms('form_submit')}</>
        )}
      </button>
      <p className="font-inter text-xs text-white/40 text-center">{cms('form_trustLine')}</p>
    </form>
  );
}

export default function GymPilotPage() {
  const { i18n } = useTranslation();
  const lang = i18n.language?.slice(0, 2) || 'en';
  const { content: cms } = usePageContent('gym-pilot', lang);

  useCMSSEO(cms, 'For Gyms & Coaches');

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && e.target.classList.add('ak-visible')),
      { threshold: 0.08 }
    );
    document.querySelectorAll('.ak-reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const scrollToForm = () => document.getElementById('pilot-form-section')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="bg-black text-white min-h-screen font-inter overflow-x-hidden">
      <InnerNavbar />

      {/* ══ HERO ══ */}
      <section data-testid="pilot-hero" className="relative min-h-screen flex flex-col justify-end pt-16"
        style={{ backgroundImage: `url(${HERO_IMG})`, backgroundSize: 'cover', backgroundPosition: 'center 30%' }}>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(170deg,rgba(0,0,0,0.78) 0%,rgba(0,0,0,0.95) 100%)' }} />
        <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-10 pb-20 md:pb-28 w-full">
          <SectionLabel text={cms('badge')} />
          <h1 className="font-anton uppercase leading-[0.9] text-white mb-5" style={{ fontSize: 'clamp(44px,7vw,80px)' }}>
            {cms('h1_line1')}<br />{cms('h1_line2')}<br />{cms('h1_line3')}<br />
            <span style={{ color: '#FFD700' }}>{cms('h1_line4')}<br />{cms('h1_line5')}</span>
          </h1>
          <p className="font-inter text-lg text-white mb-10 max-w-xl leading-relaxed">{cms('sub')}</p>
          <div className="flex flex-col sm:flex-row gap-4 mb-14">
            <button onClick={scrollToForm} data-testid="hero-cta-primary"
              className="inline-flex items-center justify-center gap-3 font-inter font-black uppercase tracking-wider text-base px-10 rounded-[14px] bg-ak-gold text-black hover:scale-105 transition-transform"
              style={{ height: '60px' }}>
              <Zap size={20} fill="black" /> {cms('cta_primary')}
            </button>
            <a href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 font-inter font-semibold uppercase tracking-wider text-sm px-8 rounded-[14px] border border-white/25 text-white hover:border-white transition-colors"
              style={{ height: '60px' }}>
              {cms('cta_secondary')} <ChevronDown size={16} />
            </a>
          </div>
          <div className="flex flex-wrap gap-6">
            {[cms('trust_1'), cms('trust_2'), cms('trust_3'), cms('trust_4')].map((txt, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle size={14} className="text-ak-cyan flex-shrink-0" />
                <span className="font-inter text-xs font-semibold text-white">{txt}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-white/30">
          <ChevronDown size={16} className="ak-bounce" />
        </div>
      </section>

      {/* ══ REINFORCEMENT STRIP ══ */}
      <section data-testid="pilot-reinforcement" className="py-6 px-6 sm:px-10" style={{ background: '#0a0a0a', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-ak-cyan flex-shrink-0" />
            <span className="font-inter text-sm font-semibold text-white">{cms('reinforcement_1')}</span>
          </div>
          <div className="hidden sm:block w-px h-5 bg-white/10" />
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-ak-gold flex-shrink-0" />
            <span className="font-inter text-sm font-semibold text-white">{cms('reinforcement_2')}</span>
          </div>
        </div>
      </section>

      {/* ══ PROBLEM ══ */}
      <section className="py-24 md:py-28 px-6 sm:px-10" style={{ background: '#050505' }}>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="ak-reveal">
            <SectionLabel text={cms('problem_badge')} color="#FF2D2D" />
            <h2 className="font-anton uppercase leading-none text-white mb-8" style={{ fontSize: 'clamp(32px,4vw,52px)' }}>
              {cms('problem_h2_line1')}<br />
              <span style={{ color: '#FF2D2D' }}>{cms('problem_h2_line2')}</span><br />
              {cms('problem_h2_line3')}
            </h2>
            <div className="space-y-4">
              {[
                { stat: '80%', desc: cms('stat1') },
                { stat: '0',   desc: cms('stat2') },
                { stat: '1/5', desc: cms('stat3') },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-5 p-5 rounded-[14px]" style={{ background: '#0a0a0a', border: '1px solid rgba(255,45,45,0.15)' }}>
                  <div className="font-anton text-3xl flex-shrink-0" style={{ color: '#FF2D2D' }}>{item.stat}</div>
                  <p className="font-inter text-sm text-white leading-relaxed pt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="ak-reveal ak-delay-2 relative rounded-[16px] overflow-hidden" style={{ height: '400px' }}>
            <img src={GROUP_IMG} alt="Gym competition" className="w-full h-full object-cover" loading="lazy" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top,rgba(0,0,0,0.75) 0%,transparent 60%)' }} />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="font-inter text-xs font-bold uppercase tracking-widest text-ak-gold mb-1">{cms('fact_badge')}</div>
              <p className="font-inter text-sm text-white font-semibold">{cms('fact_text')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ INSIGHT ══ */}
      <section className="py-20 px-6 sm:px-10 bg-black">
        <div className="max-w-4xl mx-auto text-center ak-reveal">
          <div className="w-12 h-1 bg-ak-cyan mx-auto mb-8 rounded" />
          <blockquote className="font-anton uppercase text-white mb-8" style={{ fontSize: 'clamp(28px,4vw,52px)', lineHeight: 1.05 }}>
            "{cms('insight_h2_line1')}<br />
            <span style={{ color: '#00FFFF' }}>{cms('insight_h2_line2')}</span><br />
            {cms('insight_h2_line3')}<br />
            <span style={{ color: '#FFD700' }}>{cms('insight_h2_line4')}"</span>
          </blockquote>
          <p className="font-inter text-base text-white max-w-2xl mx-auto leading-relaxed">{cms('insight_body')}</p>
        </div>
      </section>

      {/* ══ SOLUTION ══ */}
      <section className="py-24 px-6 sm:px-10" style={{ background: '#050505' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 ak-reveal">
            <SectionLabel text={cms('solution_badge')} />
            <h2 className="font-anton uppercase text-white leading-none" style={{ fontSize: 'clamp(32px,4vw,52px)' }}>
              {cms('solution_h2_line1')}<br />{cms('solution_h2_line2')}<br />
              <span style={{ color: '#00FFFF' }}>{cms('solution_h2_line3')}</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: <Zap size={24} />, title: cms('sol1_title'), desc: cms('sol1_desc'), color: '#00FFFF' },
              { icon: <Trophy size={24} />, title: cms('sol2_title'), desc: cms('sol2_desc'), color: '#FFD700' },
              { icon: <TrendingUp size={24} />, title: cms('sol3_title'), desc: cms('sol3_desc'), color: '#00FFFF' },
              { icon: <Users size={24} />, title: cms('sol4_title'), desc: cms('sol4_desc'), color: '#FFD700' },
            ].map((item, i) => (
              <div key={i} className="ak-reveal p-7 rounded-[14px] flex flex-col gap-4" style={{ background: '#0a0a0a', borderTop: `3px solid ${item.color}`, transitionDelay: `${i * 0.08}s` }}>
                <div style={{ color: item.color }}>{item.icon}</div>
                <div className="font-anton text-lg uppercase text-white">{item.title}</div>
                <p className="font-inter text-sm text-white leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section id="how-it-works" className="py-24 px-6 sm:px-10 bg-black">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 ak-reveal">
            <SectionLabel text={cms('how_badge')} />
            <h2 className="font-anton text-4xl md:text-5xl uppercase text-white">{cms('how_h2')}</h2>
          </div>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-px hidden md:block" style={{ background: 'linear-gradient(to bottom,#00FFFF,#FFD700)' }} />
            <div className="space-y-6">
              {[
                { num: '01', title: cms('step1_title'), desc: cms('step1_desc'), color: '#00FFFF' },
                { num: '02', title: cms('step2_title'), desc: cms('step2_desc'), color: '#00FFFF' },
                { num: '03', title: cms('step3_title'), desc: cms('step3_desc'), color: '#FFD700' },
                { num: '04', title: cms('step4_title'), desc: cms('step4_desc'), color: '#FFD700' },
              ].map((step, i) => (
                <div key={i} className="ak-reveal relative flex gap-6 items-start md:pl-20" style={{ transitionDelay: `${i * 0.1}s` }}>
                  <div className="hidden md:flex absolute left-0 top-0 w-16 h-16 rounded-full items-center justify-center font-anton text-xl"
                    style={{ background: '#0a0a0a', border: `2px solid ${step.color}`, color: step.color }}>
                    {step.num}
                  </div>
                  <div className="flex-1 p-6 rounded-[14px]" style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="md:hidden font-anton text-2xl" style={{ color: step.color }}>{step.num}</span>
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

      {/* ══ WHAT CHANGES ══ */}
      <section className="py-24 px-6 sm:px-10" style={{ background: '#050505' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 ak-reveal">
            <SectionLabel text={cms('whatChanges_badge')} />
            <h2 className="font-anton text-4xl md:text-5xl uppercase text-white leading-none">
              {cms('whatChanges_h2_line1')}<br />
              <span style={{ color: '#FFD700' }}>{cms('whatChanges_h2_line2')}</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              { before: cms('before1'), after: cms('after1'), icon: <Calendar size={22} />, color: '#00FFFF' },
              { before: cms('before2'), after: cms('after2'), icon: <Users size={22} />,    color: '#FFD700' },
              { before: cms('before3'), after: cms('after3'), icon: <TrendingUp size={22} />, color: '#00FFFF' },
              { before: cms('before4'), after: cms('after4'), icon: <Shield size={22} />,   color: '#FFD700' },
            ].map((item, i) => (
              <div key={i} className="ak-reveal p-6 rounded-[14px]" style={{ background: '#0a0a0a', border: `1px solid ${item.color}15` }}>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0" style={{ background: `${item.color}10`, color: item.color }}>
                    {item.icon}
                  </div>
                  <div>
                    <div className="font-inter text-xs text-white/40 line-through mb-1">{item.before}</div>
                    <p className="font-inter text-sm text-white leading-relaxed">{item.after}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ BOX VS BOX ══ */}
      <section className="relative py-24 px-6 sm:px-10 overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage: `url(${COMPETE_IMG})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.88)' }} />
        <div className="relative z-10 max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="ak-reveal">
            <SectionLabel text={cms('boxvbox_badge')} color="#FFD700" />
            <h2 className="font-anton uppercase leading-none text-white mb-6" style={{ fontSize: 'clamp(36px,5vw,60px)' }}>
              {cms('boxvbox_h2_line1')}<br /><span style={{ color: '#FFD700' }}>{cms('boxvbox_h2_line2')}</span>
            </h2>
            <p className="font-inter text-base text-white mb-4 leading-relaxed">{cms('boxvbox_p1')}</p>
            <p className="font-inter text-base text-white leading-relaxed">{cms('boxvbox_p2')}</p>
          </div>
          <div className="ak-reveal ak-delay-2 space-y-3">
            {[
              { label: cms('location_a'), score: '847', rank: '#1', color: '#FFD700' },
              { label: cms('location_b'), score: '783', rank: '#2', color: '#00FFFF' },
              { label: cms('rival_gym'),  score: '720', rank: '#3', color: 'rgba(255,255,255,0.4)' },
            ].map((team, i) => (
              <div key={i} className="flex items-center justify-between p-5 rounded-[14px]" style={{ background: '#0a0a0a', border: `1px solid ${team.color}30` }}>
                <div className="flex items-center gap-4">
                  <div className="font-anton text-2xl" style={{ color: team.color }}>{team.rank}</div>
                  <div>
                    <div className="font-anton text-lg uppercase text-white">{team.label}</div>
                    <div className="font-inter text-xs text-white/50">{cms('krating_avg')}</div>
                  </div>
                </div>
                <div className="font-anton text-3xl" style={{ color: team.color }}>{team.score}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ OFFER ══ */}
      <section className="py-24 px-6 sm:px-10 bg-black">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 ak-reveal">
            <SectionLabel text={cms('offer_badge')} />
            <h2 className="font-anton uppercase text-white mb-4" style={{ fontSize: 'clamp(40px,6vw,72px)' }}>
              {cms('offer_h2_line1')}<br /><span style={{ color: '#00FFFF' }}>{cms('offer_h2_line2')}</span>
            </h2>
            <p className="font-inter text-base text-white max-w-lg mx-auto">{cms('offer_body')}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {[
              { val: cms('offer_days'), label: cms('offer_days_label'), sub: cms('offer_days_sub'), color: '#00FFFF' },
              { val: '20–30', label: cms('offer_members_label'), sub: cms('offer_members_sub'), color: '#FFD700' },
              { val: cms('offer_managed'), label: cms('offer_managed_label'), sub: cms('offer_managed_sub'), color: '#00FFFF' },
              { val: cms('offer_cost'), label: cms('offer_cost_label'), sub: cms('offer_cost_sub'), color: '#FFD700' },
            ].map((item, i) => (
              <div key={i} className="ak-reveal p-6 rounded-[14px] text-center" style={{ background: '#0a0a0a', border: `2px solid ${item.color}30` }}>
                <div className="font-anton text-4xl mb-1" style={{ color: item.color }}>{item.val}</div>
                <div className="font-inter text-xs font-bold uppercase tracking-wider text-white">{item.label}</div>
                <div className="font-inter text-[10px] text-white/40 mt-1">{item.sub}</div>
              </div>
            ))}
          </div>
          <div className="text-center ak-reveal">
            <button onClick={scrollToForm} data-testid="offer-cta-btn"
              className="inline-flex items-center gap-3 font-inter font-black uppercase tracking-wider text-base px-12 rounded-[14px] bg-ak-gold text-black hover:scale-105 transition-transform"
              style={{ height: '60px' }}>
              <Zap size={20} fill="black" /> {cms('offer_cta')}
            </button>
          </div>
        </div>
      </section>

      {/* ══ FORM ══ */}
      <section id="pilot-form-section" className="py-24 px-6 sm:px-10" style={{ background: '#050505' }}>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          <div className="ak-reveal">
            <SectionLabel text={cms('formSection_badge')} />
            <h2 className="font-anton text-5xl md:text-6xl uppercase leading-none text-white mb-4">{cms('formSection_h2')}</h2>
            <p className="font-inter text-lg text-white mb-8 leading-relaxed">{cms('formSection_sub')}</p>
            <div className="space-y-4 mb-10">
              {[cms('step_form1'), cms('step_form2'), cms('step_form3'), cms('step_form4')].map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-ak-gold/10 border border-ak-gold/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="font-inter text-[10px] font-bold text-ak-gold">{i + 1}</span>
                  </div>
                  <span className="font-inter text-sm text-white">{step}</span>
                </div>
              ))}
            </div>
            <div className="p-5 rounded-[14px]" style={{ background: 'rgba(255,215,0,0.05)', border: '1px solid rgba(255,215,0,0.2)' }}>
              <div className="font-inter text-xs font-bold uppercase tracking-wider text-ak-gold mb-2">{cms('limited_badge')}</div>
              <p className="font-inter text-sm text-white">{cms('limited_text')}</p>
            </div>
          </div>
          <div className="ak-reveal ak-delay-2 p-8 rounded-[16px]" style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="mb-6">
              <h3 className="font-anton text-2xl uppercase text-white mb-1">{cms('form_title')}</h3>
              <p className="font-inter text-xs text-white/50">{cms('form_subtitle')}</p>
            </div>
            <PilotForm id="pilot-form" cms={cms} />
          </div>
        </div>
      </section>

      {/* ══ FAQ ══ */}
      <section className="py-20 px-6 sm:px-10 bg-black">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-anton text-3xl md:text-4xl uppercase text-white mb-10 text-center">{cms('faq_h2')}</h2>
          <div className="space-y-3">
            {[
              { q: cms('faq_q1'), a: cms('faq_a1') },
              { q: cms('faq_q2'), a: cms('faq_a2') },
              { q: cms('faq_q3'), a: cms('faq_a3') },
              { q: cms('faq_q4'), a: cms('faq_a4') },
              { q: cms('faq_q5'), a: cms('faq_a5') },
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

      {/* ══ FINAL CTA ══ */}
      <section className="py-16 px-6 sm:px-10 text-center" style={{ background: '#050505' }}>
        <div className="max-w-2xl mx-auto ak-reveal">
          <div className="w-10 h-1 bg-ak-gold mx-auto mb-6 rounded" />
          <h2 className="font-anton text-4xl md:text-5xl uppercase text-white mb-4">{cms('bottomCta_h2')}</h2>
          <p className="font-inter text-base text-white mb-8">{cms('bottomCta_sub')}</p>
          <button onClick={scrollToForm} data-testid="bottom-final-cta"
            className="inline-flex items-center gap-3 font-inter font-black uppercase tracking-wider text-sm px-12 rounded-[14px] bg-ak-gold text-black hover:scale-105 transition-transform"
            style={{ height: '56px' }}>
            <Zap size={18} fill="black" /> {cms('bottomCta_cta')}
          </button>
        </div>
      </section>

      <InnerFooter />
    </div>
  );
}
