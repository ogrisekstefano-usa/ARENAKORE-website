/**
 * ArenaKore Analytics — GA4 + CMS CTA Attribution
 * Works with: Google Analytics 4 (gtag.js)
 * Debug: console.log in non-production
 */

const GA_ID    = process.env.REACT_APP_GA_ID;
const IS_PROD  = process.env.NODE_ENV === 'production';
const DEBUG    = !IS_PROD;
const API_BASE = process.env.REACT_APP_BACKEND_URL + '/api';

let _ga_initialized = false;

/* ─── GA4 Init ─── */
export function initGA() {
  if (_ga_initialized || !GA_ID) return;
  _ga_initialized = true;
  const script = document.createElement('script');
  script.async = true;
  script.src   = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', GA_ID, { send_page_view: false, anonymize_ip: true });
  if (DEBUG) console.log('[Analytics] GA4 initialized →', GA_ID);
}

/* ─── Core tracker ─── */
export function trackEvent(eventName, params = {}) {
  if (DEBUG) console.log(`%c[Analytics] ${eventName}`, 'color:#00FFFF;font-weight:bold', params);
  if (typeof window.gtag === 'function' && GA_ID) window.gtag('event', eventName, params);
  _logToBackend(eventName, params);
}

async function _logToBackend(event, params) {
  try {
    await fetch(`${API_BASE}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, params, url: window.location.pathname, ts: new Date().toISOString() }),
    });
  } catch { }
}

/* ─── CMS CTA Attribution ─── */

/**
 * Track a CTA click with full context.
 * @param {Object} opts
 * @param {string} opts.key      - CMS content key (e.g. 'cta_primary')
 * @param {string} opts.text     - Actual button text (e.g. 'Download the App')
 * @param {string} opts.page     - Page slug (e.g. 'homepage')
 * @param {string} opts.position - Where on the page: 'hero' | 'kpi_block' | 'final_cta' | 'navbar' | 'footer'
 * @param {string} [opts.language]
 */
export function trackCMSCTAClick({ key, text, page, position = '', language }) {
  const lang = language || localStorage.getItem('ak_lang') || 'en';
  trackEvent('cta_click', { key, text, language: lang, page, position });
  fetch(`${API_BASE}/cms/cta-click`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key, text, language: lang, page, position, url: window.location.pathname }),
  }).catch(() => {});
}

/* ─── Pre-built helpers ─── */

export function trackPageView({ page_name, language, country } = {}) {
  const props = {
    page_name:     page_name || window.location.pathname,
    language:      language  || localStorage.getItem('ak_lang') || 'en',
    ...(country && { country }),
  };
  if (typeof window.gtag === 'function' && GA_ID) {
    window.gtag('event', 'page_view_custom', { ...props, page_location: window.location.href, page_title: document.title });
  }
  if (DEBUG) console.log('%c[Analytics] page_view_custom', 'color:#FFD700;font-weight:bold', props);
  _logToBackend('page_view_custom', props);
}

export function trackHeroSlideView(sport, slide_index) {
  trackEvent('hero_slide_view', { sport, slide_index });
}

export function trackHeroSlideClick(sport, slide_index) {
  trackEvent('hero_slide_click', { sport, slide_index });
}

export function trackGetAppClick(source, sport_context, cms_key) {
  trackEvent('cta_get_app_click', { source, ...(sport_context && { sport_context }), ...(cms_key && { content_key: cms_key }) });
  if (cms_key) {
    trackCMSCTAClick({ key: cms_key, text: 'Download the App', page: source || window.location.pathname.replace('/', '') || 'unknown', position: source || 'unknown' });
  }
}

export function trackBusinessClick(source, cms_key) {
  trackEvent('cta_business_click', { source, ...(cms_key && { content_key: cms_key }) });
  if (cms_key) {
    trackCMSCTAClick({ key: cms_key, text: 'For Gyms & Coaches', page: source || '', position: source || 'unknown' });
  }
}

export function trackScrollDepth(percent, page_name) {
  trackEvent(`scroll_${percent}`, { page_name });
}
