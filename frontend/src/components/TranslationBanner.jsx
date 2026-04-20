import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Languages, X } from 'lucide-react';

const API = process.env.REACT_APP_BACKEND_URL + '/api';
const THRESHOLD = 100; // show banner if < 100%
const _completenessCache = {};

export function usePageCompleteness(slug, language) {
  const lang = (language || 'en').slice(0, 2);
  const [pct, setPct] = useState(null);

  useEffect(() => {
    if (!slug || lang === 'en') { setPct(100); return; } // EN is always complete
    const key = `${slug}:${lang}`;
    if (_completenessCache[key] !== undefined) { setPct(_completenessCache[key]); return; }
    axios.get(`${API}/cms/content/${slug}/completeness`)
      .then(r => {
        const info = r.data?.[lang];
        const val = info?.pct ?? 100;
        _completenessCache[key] = val;
        setPct(val);
      })
      .catch(() => setPct(100));
  }, [slug, lang]);

  return pct;
}

export default function TranslationBanner({ slug, language }) {
  const lang = (language || 'en').slice(0, 2);
  const pct  = usePageCompleteness(slug, lang);
  const [dismissed, setDismissed] = useState(false);

  if (lang === 'en') return null;         // EN is always complete
  if (pct === null) return null;          // still loading
  if (pct >= THRESHOLD) return null;      // complete
  if (dismissed) return null;

  return (
    <div
      data-testid="translation-banner"
      className="relative w-full flex items-center justify-center gap-3 px-4 py-2.5 z-40"
      style={{ background: 'linear-gradient(90deg, rgba(255,215,0,0.1) 0%, rgba(0,0,0,0.9) 50%, rgba(255,215,0,0.1) 100%)', borderBottom: '1px solid rgba(255,215,0,0.2)' }}
    >
      <Languages size={14} style={{ color: '#FFD700', flexShrink: 0 }} />
      <span className="font-inter text-xs font-semibold text-white text-center">
        This page is being translated —&nbsp;
        <span style={{ color: '#FFD700' }}>{pct}% complete</span>
        &nbsp;· Some content may appear in English.
      </span>
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-3 text-white/30 hover:text-white transition-colors"
        data-testid="translation-banner-close"
      >
        <X size={14} />
      </button>
    </div>
  );
}
