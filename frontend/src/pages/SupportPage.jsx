import React from 'react';
import { Mail, MessageCircle, Zap, Shield, Activity, Bug, ArrowRight } from 'lucide-react';
import { InnerNavbar, InnerFooter, useSEO } from '../components/SharedLayout';
import { useTranslation } from 'react-i18next';

export default function SupportPage() {
  const { t } = useTranslation();

  const TOPICS = [
    { icon: <Shield size={20} />, title: t('support.t1_title'), desc: t('support.t1_desc') },
    { icon: <Zap size={20} />,    title: t('support.t2_title'), desc: t('support.t2_desc') },
    { icon: <Activity size={20} />, title: t('support.t3_title'), desc: t('support.t3_desc') },
    { icon: <Bug size={20} />,    title: t('support.t4_title'), desc: t('support.t4_desc') },
  ];
  useSEO({
    title: 'Support | ArenaKore',
    description: 'Get help with ArenaKore. Account issues, challenge problems, technical support. We respond within 24–48 hours.',
  });

  return (
    <div className="bg-black text-white min-h-screen font-inter">
      <InnerNavbar />

      {/* Hero */}
      <section className="pt-28 pb-16 px-6 sm:px-10" style={{ background: '#050505' }}>
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-12 h-12 rounded-full bg-ak-cyan/10 border border-ak-cyan/30 flex items-center justify-center mx-auto mb-6">
            <MessageCircle size={22} className="text-ak-cyan" />
          </div>
          <h1 className="font-anton text-4xl md:text-6xl uppercase text-white mb-4">{t('ui.support_h1')}</h1>
          <p className="font-inter text-base text-white leading-relaxed max-w-xl mx-auto">
            {t('ui.support_sub')}
          </p>
        </div>
      </section>

      {/* Topics */}
      <section className="py-16 px-6 sm:px-10 bg-black">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-anton text-2xl md:text-3xl uppercase text-white mb-8 text-center">{t('ui.support_topics')}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {TOPICS.map((t, i) => (
              <div key={i} className="flex items-start gap-4 p-6 rounded-[14px] border border-white/10 hover:border-ak-cyan/30 transition-all" style={{ background: '#0a0a0a' }}>
                <div className="w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0 text-ak-cyan" style={{ background: 'rgba(0,255,255,0.08)' }}>
                  {t.icon}
                </div>
                <div>
                  <div className="font-inter text-sm font-bold text-white mb-1">{t.title}</div>
                  <p className="font-inter text-xs text-white leading-relaxed">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 px-6 sm:px-10" style={{ background: '#050505' }}>
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-10 h-1 bg-ak-gold mx-auto mb-6 rounded" />
          <h2 className="font-anton text-2xl md:text-3xl uppercase text-white mb-4">{t('ui.support_contact')}</h2>
          <p className="font-inter text-sm text-white mb-8">
            {t('support.contact_response')} <strong className="text-white">{t('support.contact_time')}</strong>.
            {' '}{t('support.contact_tip')}
          </p>

          <a
            href="mailto:support@arenakore.com"
            data-testid="support-email-btn"
            className="inline-flex items-center gap-3 font-inter font-bold uppercase tracking-wider text-sm px-10 rounded-[14px] bg-ak-cyan text-black hover:scale-105 transition-transform mb-6"
            style={{ height: '52px' }}
          >
            <Mail size={18} />
            support@arenakore.com
          </a>

          <div className="mt-6 p-5 rounded-[14px] border border-white/10" style={{ background: '#0a0a0a' }}>
            <div className="font-inter text-xs font-bold uppercase tracking-wider text-ak-gold mb-2">{t('ui.support_response_badge')}</div>
            <p className="font-inter text-sm text-white">{t('ui.support_response_text')}</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-6 sm:px-10 bg-black">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-anton text-2xl md:text-3xl uppercase text-white mb-8 text-center">{t('ui.support_faq')}</h2>
          <div className="space-y-3">
            {[
              { q: t('support.faq_q1'), a: t('support.faq_a1') },
              { q: t('support.faq_q2'), a: t('support.faq_a2') },
              { q: t('support.faq_q3'), a: t('support.faq_a3') },
              { q: t('support.faq_q4'), a: t('support.faq_a4') },
              { q: t('support.faq_q5'), a: t('support.faq_a5') },
            ].map((f, i) => (
              <details key={i} className="group border border-white/10 rounded-[14px] overflow-hidden" style={{ background: '#0a0a0a' }}>
                <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                  <span className="font-inter text-sm font-semibold text-white">{f.q}</span>
                  <ArrowRight size={14} className="text-ak-cyan flex-shrink-0 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="px-5 pb-5">
                  <p className="font-inter text-sm text-white leading-relaxed">{f.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-12 px-6 sm:px-10" style={{ background: '#050505' }}>
        <div className="max-w-xl mx-auto text-center">
          <p className="font-inter text-sm text-white mb-4">{t('ui.support_still_need')}</p>
          <a href="mailto:support@arenakore.com" data-testid="support-contact-cta"
            className="inline-flex items-center gap-2 font-inter text-sm font-bold text-ak-cyan hover:underline">
            <Mail size={16} /> support@arenakore.com <ArrowRight size={14} />
          </a>
        </div>
      </section>

      <InnerFooter />
    </div>
  );
}
