/**
 * ArenaKore A/B Testing Hook
 * Selects a text variant based on weights, persists in localStorage.
 */
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API    = process.env.REACT_APP_BACKEND_URL + '/api';
const PREFIX = 'ak_ab';

// Cache: slug+key → variant id
const _variantCache = {};

function selectVariant(variants) {
  const total = variants.reduce((s, v) => s + (v.weight ?? 50), 0);
  let rand = Math.random() * total;
  for (const v of variants) {
    rand -= (v.weight ?? 50);
    if (rand <= 0) return v;
  }
  return variants[0];
}

export function useABTest(slug, tests = {}) {
  const [selected, setSelected] = useState({});

  useEffect(() => {
    if (!slug || !tests || Object.keys(tests).length === 0) return;
    const result = {};
    for (const [key, variants] of Object.entries(tests)) {
      if (!variants || variants.length === 0) continue;
      if (variants.length === 1) { result[key] = variants[0]; continue; }
      const storageKey = `${PREFIX}_${slug}_${key}`;
      const savedId = localStorage.getItem(storageKey);
      const existing = savedId ? variants.find(v => v.id === savedId) : null;
      const chosen = existing || selectVariant(variants);
      if (!existing) localStorage.setItem(storageKey, chosen.id);
      result[key] = chosen;
      _variantCache[`${slug}:${key}`] = chosen.id;
    }
    setSelected(result);
  }, [slug, JSON.stringify(tests)]);

  /**
   * Get the selected variant text for a key.
   * Returns { text, variant_id, isTest }
   */
  const variant = useCallback((key, defaultText = '') => {
    const chosen = selected[key];
    if (!chosen) return { text: defaultText, variant_id: null, isTest: false };
    return { text: chosen.text || defaultText, variant_id: chosen.id, isTest: true };
  }, [selected]);

  return { variant, selected };
}

/**
 * Get current variant id for a key (for tracking).
 */
export function getVariantId(slug, key) {
  return _variantCache[`${slug}:${key}`] || localStorage.getItem(`${PREFIX}_${slug}_${key}`) || null;
}

/**
 * Fetch A/B tests config for a page from CMS.
 */
export async function fetchABTests(slug) {
  try {
    const r = await axios.get(`${API}/cms/ab-tests/${slug}`);
    return r.data || {};
  } catch { return {}; }
}
