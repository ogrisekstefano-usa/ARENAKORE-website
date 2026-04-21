/**
 * ArenaKore Analytics — GTM + MongoDB
 *
 * Tracking source: Google Tag Manager (GTM-WJ9LQV5T)
 * GTM manages GA4 — NO direct GA4 initialization here.
 *
 * window.gtag is provided by GTM's GA4 Configuration Tag.
 * This file only fires custom events via the dataLayer.
 */

const IS_PROD  = process.env.NODE_ENV === 'production';
const DEBUG    = !IS_PROD;
const API_BASE = process.env.REACT_APP_BACKEND_URL + '/api';

/**
 * initGA — no-op. GTM handles GA4 initialization.
 * Kept for backward compat so existing callers don't break.
 */
export function initGA() {
  window.dataLayer = window.dataLayer || [];
  if (DEBUG) console.log('[Analytics] GTM active — GA4 managed by GTM-WJ9LQV5T');
}

/* ─── Core tracker ─── */
export function trackEvent(eventName, params = {}) {
  if (DEBUG) console.log(`%c[Analytics] ${eventName}`, 'color:#00FFFF;font-weight:bold', params);
  // Push to dataLayer — GTM GA4 tag picks it up
  if (window.dataLayer) {
    window.dataLayer.push({ event: eventName, ...params });
  }
  // Also call gtag directly if available (GTM GA4 exposes it)
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }
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
export function trackCMSCTAClick({ key, text, page, position = '', language, variant_id }) {
  const lang = language || localStorage.getItem('ak_lang') || 'en';
  trackEvent('cta_click', { key, text, language: lang, page, position, ...(variant_id && { variant_id }) });
  fetch(`${API_BASE}/cms/cta-click`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key, text, language: lang, page, position, variant_id: variant_id || null, url: window.location.pathname }),
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

/**
 * Track a real conversion (app download click or pilot form submit).
 * @param {Object} opts
 * @param {string} opts.action         - "app_download" | "pilot_submit"
 * @param {string} opts.source_cta_key - Which CMS key triggered this
 * @param {string} [opts.page]
 * @param {string} [opts.position]
 */
export function trackConversion({ action, source_cta_key, page = '', position = '' }) {
  const language = localStorage.getItem('ak_lang') || 'en';
  trackEvent('conversion_event', { action, source_cta_key, page, position, language });
  fetch(`${API_BASE}/cms/conversion`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, source_cta_key, page, position, language, url: window.location.pathname }),
  }).catch(() => {});
}

// ─────────────────────────────────────────────────────────────────────────────
// LANDING FUNNEL TRACKING
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Core landing event dispatcher.
 * Sends to GA4 + MongoDB. Non-blocking.
 */
export function trackLandingEvent(event_name, params = {}) {
  const lang    = localStorage.getItem('ak_lang') || 'it';
  const slug    = params.page_slug || window.location.pathname.split('/').pop() || 'unknown';
  const payload = { page_slug: slug, language: lang, ...params };
  if (DEBUG) console.log(`%c[Landing] ${event_name}`, 'color:#FFD700;font-weight:bold', payload);
  // Push to dataLayer — GTM picks it up
  if (window.dataLayer) window.dataLayer.push({ event: event_name, ...payload });
  if (typeof window.gtag === 'function') window.gtag('event', event_name, payload);
  _logToBackend(event_name, payload);
}

/** Track landing page view */
export function trackLandingView(slug) {
  const lang = localStorage.getItem('ak_lang') || 'it';
  const source = new URLSearchParams(window.location.search).get('utm_source') || 'organic';
  trackLandingEvent('landing_view', { page_slug: slug, language: lang, source });
}

/** Track scroll depth (50% and 90%) */
export function useLandingScrollTracking(slug) {
  // Called from components — returns a setup function
  return () => {
    let fired50 = false, fired90 = false;
    const lang = localStorage.getItem('ak_lang') || 'it';
    const onScroll = () => {
      const el  = document.documentElement;
      const pct = (el.scrollTop + window.innerHeight) / el.scrollHeight * 100;
      if (!fired50 && pct >= 50) {
        fired50 = true;
        trackLandingEvent('landing_scroll_50', { page_slug: slug, language: lang });
      }
      if (!fired90 && pct >= 90) {
        fired90 = true;
        trackLandingEvent('landing_scroll_90', { page_slug: slug, language: lang });
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  };
}

/** Track CTA "Start Test" click */
export function trackStartTestClick(slug, position = 'hero') {
  const lang = localStorage.getItem('ak_lang') || 'it';
  trackLandingEvent('cta_start_test_click', { page_slug: slug, language: lang, position });
}

/** Track Download App click from landing */
export function trackDownloadClick(slug, source = 'landing') {
  const lang = localStorage.getItem('ak_lang') || 'it';
  trackLandingEvent('cta_download_click', { page_slug: slug, language: lang, source });
}
