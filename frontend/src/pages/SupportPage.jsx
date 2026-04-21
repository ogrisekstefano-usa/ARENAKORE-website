import React from 'react';
import { Shield, Zap, Activity, Bug, Mail, Clock } from 'lucide-react';
import { InnerNavbar, InnerFooter, useSEO } from '../components/SharedLayout';
import { useTranslation } from 'react-i18next';
import usePageContent from '../hooks/usePageContent';
import useCMSSEO from '../hooks/useCMSSEO';

/**
 * SupportPage — 100% CMS-driven.
 * Content source: MongoDB → cms_content → slug: "support"
 * Manage via: /admin → Content → Support
 */
export default function SupportPage() {
  const { i18n } = useTranslation();
  const lang = i18n.language?.slice(0, 2) || 'en';
  const { content: cms } = usePageContent('support', lang);

  useSEO({
    title: cms('h1') ? `${cms('h1')} | ArenaKore` : 'Support | ArenaKore',
    description: cms('sub'),
  });

  const TOPICS = [
    { icon: <Shield size={20} />, titleKey: 't1_title', descKey: 't1_desc' },
    { icon: <Zap    size={20} />, titleKey: 't2_title', descKey: 't2_desc' },
    { icon: <Activity size={20} />, titleKey: 't3_title', descKey: 't3_desc' },
    { icon: <Bug   size={20} />, titleKey: 't4_title', descKey: 't4_desc' },
  ];

  const FAQS = [
    { qKey: 'faq_q1', aKey: 'faq_a1' },
    { qKey: 'faq_q2', aKey: 'faq_a2' },
    { qKey: 'faq_q3', aKey: 'faq_a3' },
    { qKey: 'faq_q4', aKey: 'faq_a4' },
    { qKey: 'faq_q5', aKey: 'faq_a5' },
  ];

  return (
    <div className="bg-black text-white min-h-screen" data-testid="support-page">
      <InnerNavbar />

      {/* ── HERO ── */}
      <section className="pt-32 pb-16 px-6 sm:px-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-anton text-5xl md:text-6xl uppercase text-white mb-4">
            {cms('h1')}
          </h1>
          <p className="font-inter text-base text-white/60 leading-relaxed max-w-xl mx-auto">
            {cms('sub')}
          </p>
        </div>
      </section>

      {/* ── TOPICS ── */}
      <section className="py-16 px-6 sm:px-10" style={{ background: '#050505' }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="font-anton text-2xl uppercase text-white mb-8">{cms('topics_h2')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TOPICS.map((tp, i) => (
              <div key={i} className="flex items-start gap-4 p-5 rounded-[12px]"
                style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="text-ak-cyan flex-shrink-0 mt-0.5">{tp.icon}</div>
                <div>
                  <div className="font-inter text-sm font-bold text-white mb-1">{cms(tp.titleKey)}</div>
                  <div className="font-inter text-xs text-white/50 leading-relaxed">{cms(tp.descKey)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section className="py-16 px-6 sm:px-10" style={{ background: '#000' }}>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="font-anton text-2xl uppercase text-white mb-5">{cms('contact_h2')}</h2>
            <p className="font-inter text-sm text-white mb-6">
              {cms('contact_response')} <strong className="text-white">{cms('contact_time')}</strong>.
              {' '}{cms('contact_tip')}
            </p>
            <a href={`mailto:${cms('contact_cta')}`} data-testid="support-email-btn"
              className="inline-flex items-center gap-3 font-inter font-bold uppercase tracking-wider text-sm px-8 rounded-[14px] bg-ak-gold text-black hover:scale-105 transition-transform"
              style={{ height: '52px' }}>
              <Mail size={16} /> {cms('contact_cta')}
            </a>
            <p className="font-inter text-xs text-white/30 mt-4">{cms('still_need')}</p>
          </div>
          {/* Response time card */}
          <div className="p-6 rounded-[14px]" style={{ background: '#0a0a0a', border: '1px solid rgba(0,255,255,0.15)' }}>
            <div className="flex items-center gap-3 mb-3">
              <Clock size={18} className="text-ak-cyan" />
              <span className="font-inter text-xs font-bold uppercase tracking-widest text-ak-cyan">
                {cms('response_badge')}
              </span>
            </div>
            <p className="font-inter text-sm text-white leading-relaxed">
              {cms('response_text')}
            </p>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 px-6 sm:px-10" style={{ background: '#050505' }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="font-anton text-2xl uppercase text-white mb-8">{cms('faq_h2')}</h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="p-5 rounded-[12px]"
                style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="font-inter text-sm font-bold text-ak-gold mb-2">{cms(faq.qKey)}</div>
                <div className="font-inter text-sm text-white/70 leading-relaxed">{cms(faq.aKey)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <InnerFooter />
    </div>
  );
}
