import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  LayoutDashboard, FileText, BookOpen, Image, Users,
  LogOut, Plus, Pencil, Trash2, Save, X, Eye,
  ChevronRight, AlertCircle, CheckCircle, Upload, Tag,
  Zap, ArrowLeft, Layers, ToggleLeft, ToggleRight,
  Activity, BarChart2, MousePointerClick, TrendingUp, RefreshCw,
  Globe, Languages, Sparkles, Copy
} from 'lucide-react';
import { LOGO, BLOG_POSTS } from '../data/seo-content';

const API = process.env.REACT_APP_BACKEND_URL + '/api';
const TOKEN_KEY = 'ak_admin_token';

/* ─── helpers ─── */
const api = (token) => axios.create({
  baseURL: API,
  headers: { Authorization: `Bearer ${token}` }
});

function useAdminAPI(token) {
  return useCallback((method, path, data) =>
    api(token)[method](path, data).then(r => r.data), [token]);
}

/* ─── LOGIN SCREEN ─── */
function LoginScreen({ onLogin }) {
  const [pwd, setPwd] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await axios.post(`${API}/admin/login`, { password: pwd });
      onLogin(res.data.token);
    } catch {
      setError('Wrong password. Try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <img src={LOGO} alt="ArenaKore" className="h-10 w-auto object-contain mx-auto mb-4" />
          <h1 className="font-anton text-3xl uppercase text-white">CMS ADMIN</h1>
          <p className="font-inter text-xs text-white/40 mt-1">Area riservata</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="font-inter text-xs font-bold uppercase tracking-wider text-white/50 block mb-2">Password</label>
            <input
              type="password" value={pwd} onChange={e => setPwd(e.target.value)}
              placeholder="••••••••••"
              className="w-full font-inter text-sm text-white placeholder-white/20 px-4 py-3 rounded-[12px] outline-none focus:border-ak-cyan transition-colors"
              style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.15)' }}
              data-testid="admin-password-input"
            />
          </div>
          {error && <div className="flex items-center gap-2 text-red-400"><AlertCircle size={14} /><span className="font-inter text-xs">{error}</span></div>}
          <button type="submit" disabled={loading}
            className="w-full font-inter font-black uppercase tracking-wider text-sm rounded-[14px] bg-ak-gold text-black disabled:opacity-60 flex items-center justify-center gap-2"
            style={{ height: '48px' }} data-testid="admin-login-btn">
            {loading ? 'Signing in...' : <><Zap size={16} fill="black" /> Sign In</>}
          </button>
        </form>
        <div className="mt-6 text-center">
          <Link to="/" className="font-inter text-xs text-white/30 hover:text-white transition-colors">
            ← Back to site
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ─── SIDEBAR ─── */
const TABS = [
  { id: 'dashboard', label: 'Dashboard',     icon: LayoutDashboard },
  { id: 'analytics', label: 'Analytics',     icon: Activity },
  { id: 'content',   label: 'Content',       icon: FileText },
  { id: 'hero',      label: 'Hero Slides',   icon: Layers },
  { id: 'blog',      label: 'Blog',          icon: BookOpen },
  { id: 'pages',     label: 'SEO Pages',     icon: Globe },
  { id: 'media',     label: 'Media',         icon: Image },
  { id: 'pilots',    label: 'Pilot Requests',icon: Users },
];

function Sidebar({ tab, setTab, onLogout }) {
  return (
    <aside className="w-56 flex-shrink-0 border-r border-white/8 flex flex-col" style={{ background: '#080808' }}>
      <div className="p-5 border-b border-white/8">
        <img src={LOGO} alt="ArenaKore" className="h-7 w-auto object-contain" />
        <div className="font-inter text-[10px] font-bold uppercase tracking-widest text-white/30 mt-1">CMS Admin</div>
      </div>
      <nav className="flex-1 py-3 px-2">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[10px] mb-1 font-inter text-sm font-semibold transition-all ${
              tab === t.id ? 'bg-ak-cyan/10 text-ak-cyan' : 'text-white/50 hover:text-white hover:bg-white/5'
            }`}>
            <t.icon size={16} />
            {t.label}
          </button>
        ))}
      </nav>
      <div className="p-3 border-t border-white/8">
        <Link to="/" className="flex items-center gap-2 px-3 py-2 rounded-[10px] font-inter text-xs text-white/40 hover:text-white transition-colors mb-1">
          <Eye size={14} /> Vedi sito
        </Link>
        <button onClick={onLogout} className="flex items-center gap-2 px-3 py-2 rounded-[10px] font-inter text-xs text-red-400 hover:text-red-300 transition-colors w-full">
          <LogOut size={14} /> Logout
        </button>
      </div>
    </aside>
  );
}

/* ─── DASHBOARD ─── */
function Dashboard({ call }) {
  const [stats, setStats] = useState(null);
  useEffect(() => { call('get', '/admin/stats').then(setStats).catch(() => {}); }, [call]);
  const cards = stats ? [
    { label: 'Blog Posts', value: stats.blog_posts, color: '#00FFFF' },
    { label: 'Pages CMS', value: stats.pages, color: '#FFD700' },
    { label: 'Media Items', value: stats.media, color: '#00FFFF' },
    { label: 'Pilot Requests', value: stats.pilot_requests, color: '#FF2D2D' },
  ] : [];
  return (
    <div>
      <h2 className="font-anton text-2xl uppercase text-white mb-6">DASHBOARD</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((c, i) => (
          <div key={i} className="p-6 rounded-[14px]" style={{ background: '#0a0a0a', border: `1px solid ${c.color}20` }}>
            <div className="font-anton text-4xl mb-1" style={{ color: c.color }}>{c.value}</div>
            <div className="font-inter text-xs font-bold uppercase tracking-wider text-white">{c.label}</div>
          </div>
        ))}
      </div>
      <div className="p-6 rounded-[14px]" style={{ background: '#0a0a0a', border: '1px solid rgba(255,215,0,0.2)' }}>
        <div className="font-inter text-xs font-bold uppercase tracking-wider text-ak-gold mb-3">AZIONI RAPIDE</div>
        <div className="flex flex-wrap gap-3">
          <button className="font-inter text-xs font-semibold text-white border border-white/20 px-4 py-2 rounded-[10px] hover:border-ak-cyan hover:text-ak-cyan transition-all">
            + New Blog Post
          </button>
          <button className="font-inter text-xs font-semibold text-white border border-white/20 px-4 py-2 rounded-[10px] hover:border-ak-cyan hover:text-ak-cyan transition-all">
            + Add Image
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── CONTENT EDITOR (CMS Multi-language) ─── */
const LANGS = [
  { code: 'en', label: 'EN', name: 'English',  flag: '🌍' },
  { code: 'it', label: 'IT', name: 'Italian',  flag: '🇮🇹' },
  { code: 'es', label: 'ES', name: 'Spanish',  flag: '🇪🇸' },
];

function ContentEditor({ call }) {
  const [pages, setPages]       = useState([]);
  const [selectedPage, setSelectedPage] = useState(null);
  const [sections, setSections] = useState([]);
  const [activeLang, setActiveLang] = useState('en');
  const [saving, setSaving]     = useState(false);
  const [translating, setTranslating] = useState(false);
  const [showAddLang, setShowAddLang] = useState(false);
  const [newLang, setNewLang]   = useState({ code: '', name: '' });
  const [msg, setMsg]           = useState('');
  const [customLangs, setCustomLangs] = useState([]);

  useEffect(() => {
    call('get', '/cms/pages-list').then(setPages).catch(() => setPages([]));
  }, [call]);

  const loadPage = async (slug) => {
    setSelectedPage(slug); setMsg('');
    try {
      const doc = await call('get', `/cms/content/${slug}/full`);
      const secs = doc.sections || [];
      setSections(secs.map(s => ({ ...s, translations: { ...s.translations } })));
      // Detect available languages from content
      const detected = new Set();
      secs.forEach(s => Object.keys(s.translations || {}).forEach(l => detected.add(l)));
      const extra = [...detected].filter(l => !LANGS.find(x => x.code === l));
      setCustomLangs(extra.map(c => ({ code: c, label: c.toUpperCase(), name: c })));
    } catch { setSections([]); }
  };

  const updateSection = (key, lang, value) => {
    setSections(prev => prev.map(s =>
      s.key === key ? { ...s, translations: { ...s.translations, [lang]: value } } : s
    ));
  };

  const save = async () => {
    if (!selectedPage) return;
    setSaving(true); setMsg('');
    try {
      await call('put', `/cms/content/${selectedPage}`, sections);
      setMsg('Saved!');
    } catch { setMsg('Error saving'); }
    finally { setSaving(false); }
  };

  const translateToLang = async (lang, langName) => {
    if (!selectedPage) return;
    setTranslating(true); setMsg('');
    try {
      const r = await call('post', `/cms/content/${selectedPage}/translate`, {
        target_lang: lang, target_lang_name: langName
      });
      setMsg(`✓ Translated ${r.translated} fields to ${lang.toUpperCase()}`);
      await loadPage(selectedPage);
    } catch (e) {
      setMsg(e?.response?.data?.detail || 'Translation failed');
    } finally { setTranslating(false); }
  };

  const addCustomLang = async () => {
    if (!newLang.code || !newLang.name) return;
    await translateToLang(newLang.code.toLowerCase(), newLang.name);
    setCustomLangs(prev => [...prev, { code: newLang.code.toLowerCase(), label: newLang.code.toUpperCase(), name: newLang.name }]);
    setShowAddLang(false);
    setNewLang({ code: '', name: '' });
  };

  const allLangs = [...LANGS, ...customLangs.filter(c => !LANGS.find(l => l.code === c.code))];
  const fieldTypes = { heading: 'Heading', text: 'Text', richtext: 'Rich Text', cta: 'CTA', label: 'Label' };
  const inp = "w-full font-inter text-sm text-white placeholder-white/30 px-3 py-2 rounded-[10px] outline-none focus:border-ak-cyan transition-colors resize-none";
  const inpStyle = { background: '#111', border: '1px solid rgba(255,255,255,0.1)' };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {/* Page list */}
      <div>
        <h2 className="font-anton text-xl uppercase text-white mb-4">PAGE CONTENT</h2>
        <p className="font-inter text-xs mb-4" style={{ color: '#a1a1aa' }}>
          Edit text content per page, per language.
        </p>
        <div className="space-y-1">
          {pages.map(p => (
            <button key={p.slug} onClick={() => loadPage(p.slug)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-[10px] text-left transition-all group ${
                selectedPage === p.slug ? 'bg-ak-cyan/10 border border-ak-cyan/30' : 'border border-transparent hover:bg-white/4'
              }`}>
              <div>
                <div className={`font-inter text-sm font-semibold ${selectedPage === p.slug ? 'text-ak-cyan' : 'text-white/70'}`}>
                  {p.name}
                </div>
                <div className="font-inter text-[10px] text-white/30">/{p.slug} · {p.section_count} fields</div>
              </div>
              <div className="flex items-center gap-1.5">
                {p.has_content && <span className="w-1.5 h-1.5 rounded-full bg-ak-cyan" title="Has CMS content" />}
                <ChevronRight size={12} className="text-white/25" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="md:col-span-2">
        {!selectedPage ? (
          <div className="flex flex-col items-center justify-center h-full border border-dashed border-white/10 rounded-[14px] py-20 gap-3">
            <Languages size={28} className="text-white/15" />
            <p className="font-inter text-sm text-white/30">Select a page to edit its content</p>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-anton text-2xl uppercase text-white">/{selectedPage}</h3>
                <p className="font-inter text-xs text-white/40 mt-1">{sections.length} editable fields</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={save} disabled={saving}
                  className="inline-flex items-center gap-2 font-inter font-bold text-xs uppercase px-5 rounded-[10px] bg-ak-gold text-black disabled:opacity-60"
                  style={{ height: '36px' }}>
                  <Save size={13} /> {saving ? 'Saving...' : 'Save All'}
                </button>
                {msg && <span className={`font-inter text-xs ${msg.startsWith('✓') || msg === 'Saved!' ? 'text-ak-cyan' : 'text-red-400'}`}>{msg}</span>}
              </div>
            </div>

            {/* Language tabs */}
            <div className="flex items-center gap-1 mb-6 flex-wrap">
              {allLangs.map(l => (
                <button key={l.code} onClick={() => setActiveLang(l.code)}
                  className={`inline-flex items-center gap-1.5 font-inter text-xs font-bold uppercase px-3 py-1.5 rounded-[8px] transition-all ${
                    activeLang === l.code ? 'bg-ak-cyan/15 text-ak-cyan border border-ak-cyan/35' : 'text-white/50 hover:text-white border border-white/8'
                  }`}>
                  {l.flag || ''} {l.label}
                </button>
              ))}
              {/* Translate buttons */}
              {LANGS.filter(l => l.code !== 'en').map(l => (
                <button key={`tr-${l.code}`}
                  onClick={() => translateToLang(l.code, l.name)}
                  disabled={translating}
                  className="inline-flex items-center gap-1 font-inter text-[10px] text-white/30 hover:text-ak-gold transition-colors disabled:opacity-40 px-2 py-1.5 border border-white/5 rounded-[8px]"
                  title={`AI translate EN → ${l.name}`}>
                  <Sparkles size={10} /> AI {l.label}
                </button>
              ))}
              {/* Add Language button */}
              <button onClick={() => setShowAddLang(!showAddLang)}
                className="inline-flex items-center gap-1 font-inter text-[10px] text-white/30 hover:text-ak-cyan transition-colors px-2 py-1.5 border border-dashed border-white/10 rounded-[8px]">
                <Plus size={10} /> Add Language
              </button>
            </div>

            {/* Add Language form */}
            {showAddLang && (
              <div className="flex gap-3 mb-5 p-4 rounded-[12px]" style={{ background: '#0a0a0a', border: '1px solid rgba(0,255,255,0.15)' }}>
                <div>
                  <label className="font-inter text-[10px] text-white/40 uppercase block mb-1">Code (e.g. fr)</label>
                  <input value={newLang.code} onChange={e => setNewLang({...newLang, code: e.target.value})}
                    placeholder="fr" className="w-16 font-inter text-sm text-white px-2 py-1.5 rounded-[8px]" style={inpStyle} />
                </div>
                <div className="flex-1">
                  <label className="font-inter text-[10px] text-white/40 uppercase block mb-1">Language Name</label>
                  <input value={newLang.name} onChange={e => setNewLang({...newLang, name: e.target.value})}
                    placeholder="French" className="w-full font-inter text-sm text-white px-3 py-1.5 rounded-[8px]" style={inpStyle} />
                </div>
                <div className="flex items-end gap-2">
                  <button onClick={addCustomLang} disabled={translating || !newLang.code || !newLang.name}
                    className="inline-flex items-center gap-1.5 font-inter text-xs font-bold uppercase px-4 rounded-[8px] bg-ak-gold text-black disabled:opacity-50"
                    style={{ height: '34px' }}>
                    <Sparkles size={12} /> AI Translate
                  </button>
                  {translating && <div className="w-4 h-4 border-2 border-ak-cyan border-t-transparent rounded-full animate-spin" />}
                </div>
              </div>
            )}

            {/* Fields */}
            <div className="space-y-3">
              {sections.map(section => {
                const s = typeof section === 'object' ? section : {};
                const key = s.key || '';
                const fieldType = s.field_type || 'text';
                const currentValue = (s.translations || {})[activeLang] || '';
                const enValue = (s.translations || {})['en'] || '';
                const isLong = fieldType === 'richtext';
                return (
                  <div key={key} className="p-4 rounded-[12px]" style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-inter text-[9px] font-bold uppercase tracking-widest text-ak-cyan">{key}</span>
                      <span className="font-inter text-[9px] text-white/25 border border-white/10 px-1.5 py-0.5 rounded">{fieldTypes[fieldType] || fieldType}</span>
                      {activeLang !== 'en' && enValue && (
                        <span className="font-inter text-[9px] text-white/30 truncate max-w-[200px]" title={enValue}>EN: {enValue.slice(0, 40)}{enValue.length > 40 ? '...' : ''}</span>
                      )}
                    </div>
                    {isLong ? (
                      <textarea rows={3} value={currentValue}
                        onChange={e => updateSection(key, activeLang, e.target.value)}
                        className={inp} style={inpStyle}
                        placeholder={activeLang !== 'en' ? `Translation (${activeLang.toUpperCase()}) — EN: ${enValue.slice(0, 50)}...` : 'Content...'} />
                    ) : (
                      <input type="text" value={currentValue}
                        onChange={e => updateSection(key, activeLang, e.target.value)}
                        className={`${inp} h-10`} style={inpStyle}
                        placeholder={activeLang !== 'en' ? `Translation (${activeLang.toUpperCase()})` : 'Content...'} />
                    )}
                  </div>
                );
              })}
            </div>

            {sections.length === 0 && (
              <div className="text-center py-10 border border-dashed border-white/10 rounded-[14px]">
                <p className="font-inter text-sm text-white/30">No content sections defined for this page.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── ANALYTICS DASHBOARD ─── */
function AnalyticsDashboard({ call }) {
  const [summary, setSummary]   = useState([]);
  const [recent, setRecent]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [lastRefresh, setLastRefresh] = useState(null);

  const load = useCallback(async () => {
    try {
      const [sum, rec] = await Promise.all([
        call('get', '/events/summary'),
        call('get', '/events/recent'),
      ]);
      setSummary(sum || []);
      setRecent(rec || []);
      setLastRefresh(new Date());
    } catch { }
    finally { setLoading(false); }
  }, [call]);

  useEffect(() => { load(); }, [load]);

  // Auto-refresh every 12 seconds
  useEffect(() => {
    const timer = setInterval(load, 12000);
    return () => clearInterval(timer);
  }, [load]);

  /* ── Derived stats ── */
  const total        = summary.reduce((s, e) => s + e.count, 0);
  const pageViews    = summary.filter(e => e.event === 'page_view_custom').reduce((s,e) => s+e.count, 0);
  const ctaClicks    = summary.filter(e => e.event?.includes('cta_')).reduce((s,e) => s+e.count, 0);
  const sportSelects = summary.filter(e => e.event === 'sport_selected').reduce((s,e) => s+e.count, 0);
  const heroViews    = summary.filter(e => e.event === 'hero_slide_view').reduce((s,e) => s+e.count, 0);

  // Top pages (from recent page_view_custom events)
  const pageMap = {};
  recent.filter(e => e.event === 'page_view_custom').forEach(e => {
    const page = e.params?.page_name || e.url || 'unknown';
    pageMap[page] = (pageMap[page] || 0) + 1;
  });
  const topPages = Object.entries(pageMap).sort((a,b) => b[1]-a[1]).slice(0, 8);

  // Top sports
  const sportMap = {};
  recent.filter(e => e.event === 'sport_selected').forEach(e => {
    const sport = e.params?.sport || 'unknown';
    sportMap[sport] = (sportMap[sport] || 0) + 1;
  });
  const topSports = Object.entries(sportMap).sort((a,b) => b[1]-a[1]).slice(0, 8);
  const maxSport  = topSports[0]?.[1] || 1;

  // Recent 15 events
  const recentEvents = recent.slice(0, 15);

  const fmt = (d) => {
    if (!d) return '—';
    const date = new Date(d.server_ts || d.ts || d);
    return isNaN(date) ? '—' : date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  const EVENT_COLOR = {
    page_view_custom:   '#00FFFF',
    hero_slide_view:    '#a78bfa',
    hero_slide_click:   '#c084fc',
    cta_get_app_click:  '#FFD700',
    cta_business_click: '#FFD700',
    sport_selected:     '#34d399',
    scroll_50:          '#94a3b8',
    scroll_90:          '#64748b',
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-anton text-2xl uppercase text-white">ANALYTICS</h2>
          <p className="font-inter text-xs mt-1" style={{ color: '#a1a1aa' }}>
            Auto-refresh every 12s
            {lastRefresh && ` · Last: ${lastRefresh.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`}
          </p>
        </div>
        <button onClick={load}
          className="inline-flex items-center gap-2 font-inter text-xs font-bold uppercase text-white/40 hover:text-white transition-colors border border-white/10 hover:border-white/25 px-3 py-1.5 rounded-full">
          <RefreshCw size={12} /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-6 h-6 border-2 border-ak-cyan border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
            {[
              { icon: <Activity size={16} />, label: 'Total Events', value: total,        color: '#a1a1aa' },
              { icon: <Eye size={16} />,      label: 'Page Views',   value: pageViews,    color: '#00FFFF' },
              { icon: <MousePointerClick size={16} />, label: 'CTA Clicks',value: ctaClicks, color: '#FFD700' },
              { icon: <TrendingUp size={16} />,label: 'Sport Selects',value: sportSelects,color: '#34d399' },
              { icon: <BarChart2 size={16} />, label: 'Hero Views',   value: heroViews,   color: '#a78bfa' },
            ].map((kpi, i) => (
              <div key={i} className="p-4 rounded-[12px] flex flex-col gap-2" style={{ background: '#0a0a0a', border: `1px solid ${kpi.color}18` }}>
                <div style={{ color: kpi.color }}>{kpi.icon}</div>
                <div className="font-anton text-3xl" style={{ color: kpi.color }}>{kpi.value.toLocaleString()}</div>
                <div className="font-inter text-[10px] font-semibold uppercase tracking-wider text-white">{kpi.label}</div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Top pages */}
            <div className="p-5 rounded-[14px]" style={{ background: '#0a0a0a', border: '1px solid rgba(0,255,255,0.1)' }}>
              <div className="font-inter text-[10px] font-bold uppercase tracking-widest text-ak-cyan mb-4">TOP PAGES</div>
              {topPages.length === 0 ? (
                <p className="font-inter text-xs text-white/30 py-4 text-center">No page view data yet</p>
              ) : (
                <div className="space-y-2">
                  {topPages.map(([page, count], i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="font-inter text-xs text-white/60 w-5 text-right flex-shrink-0">{i+1}</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-inter text-xs font-semibold text-white truncate">{page}</div>
                        <div className="mt-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(0,255,255,0.08)' }}>
                          <div className="h-full rounded-full" style={{ width: `${(count / (topPages[0]?.[1] || 1)) * 100}%`, background: '#00FFFF' }} />
                        </div>
                      </div>
                      <div className="font-inter text-xs font-bold flex-shrink-0" style={{ color: '#00FFFF' }}>{count}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Top sports */}
            <div className="p-5 rounded-[14px]" style={{ background: '#0a0a0a', border: '1px solid rgba(52,211,153,0.15)' }}>
              <div className="font-inter text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: '#34d399' }}>TOP SPORTS SELECTED</div>
              {topSports.length === 0 ? (
                <p className="font-inter text-xs text-white/30 py-4 text-center">No sport selection data yet</p>
              ) : (
                <div className="space-y-2">
                  {topSports.map(([sport, count], i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="font-inter text-xs text-white/60 w-5 text-right flex-shrink-0">{i+1}</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-inter text-xs font-semibold text-white capitalize">{sport}</div>
                        <div className="mt-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(52,211,153,0.1)' }}>
                          <div className="h-full rounded-full" style={{ width: `${(count / maxSport) * 100}%`, background: '#34d399' }} />
                        </div>
                      </div>
                      <div className="font-inter text-xs font-bold flex-shrink-0" style={{ color: '#34d399' }}>{count}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* All event types */}
          <div className="p-5 rounded-[14px] mb-6" style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="font-inter text-[10px] font-bold uppercase tracking-widest text-white/40 mb-4">ALL EVENTS</div>
            {summary.length === 0 ? (
              <p className="font-inter text-xs text-white/30 py-4 text-center">No events tracked yet</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {summary.map((e, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-[10px]"
                    style={{ background: '#111', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="min-w-0 flex-1">
                      <div className="font-inter text-[10px] truncate" style={{ color: EVENT_COLOR[e.event] || '#a1a1aa' }}>{e.event}</div>
                    </div>
                    <div className="font-inter text-sm font-bold text-white ml-2 flex-shrink-0">{e.count}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent events */}
          <div className="p-5 rounded-[14px]" style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="font-inter text-[10px] font-bold uppercase tracking-widest text-white/40 mb-4">RECENT EVENTS (last 15)</div>
            {recentEvents.length === 0 ? (
              <p className="font-inter text-xs text-white/30 py-4 text-center">No events yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      {['Time', 'Event', 'Page', 'Params'].map(h => (
                        <th key={h} className="text-left pb-2 font-inter text-[9px] font-bold uppercase tracking-widest text-white/30 pr-4">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recentEvents.map((e, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                        <td className="py-2 pr-4 font-inter text-[10px] text-white/40 whitespace-nowrap">{fmt(e)}</td>
                        <td className="py-2 pr-4">
                          <span className="font-inter text-[10px] font-semibold px-2 py-0.5 rounded-full"
                            style={{ background: `${EVENT_COLOR[e.event] || '#a1a1aa'}18`, color: EVENT_COLOR[e.event] || '#a1a1aa' }}>
                            {e.event}
                          </span>
                        </td>
                        <td className="py-2 pr-4 font-inter text-[10px] text-white/50">{e.url || '—'}</td>
                        <td className="py-2 font-inter text-[10px] text-white/30 truncate max-w-[160px]">
                          {e.params ? JSON.stringify(e.params).slice(0, 60) : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

/* ─── BLOG MANAGER ─── */
function BlogManager({ call }) {
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(null); // null=list, 'new'=create, post=edit
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const load = useCallback(() => call('get', '/blog').then(setPosts).catch(() => {}), [call]);
  useEffect(() => { load(); }, [load]);

  const newForm = { slug: '', title: '', seo_title: '', meta_description: '', category: 'General', read_time: '5 min read', date: new Date().toLocaleDateString('it-IT', { month: 'long', year: 'numeric' }), excerpt: '', content: '', featured_image: '', published: true };

  const startEdit = (post) => { setEditing(post); setForm({ ...post }); setMsg(''); };
  const startNew = () => { setEditing('new'); setForm({ ...newForm }); setMsg(''); };

  const save = async () => {
    setSaving(true); setMsg('');
    try {
      if (editing === 'new') { await call('post', '/blog', form); }
      else { await call('put', `/blog/${editing.id}`, form); }
      setMsg('Saved!'); load(); setTimeout(() => setEditing(null), 800);
    } catch (e) { setMsg(e?.response?.data?.detail || 'Errore'); }
    finally { setSaving(false); }
  };

  const del = async (post) => {
    if (!window.confirm(`Delete "${post.title}"?`)) return;
    await call('delete', `/blog/${post.id}`); load();
  };

  const seedDemo = async () => {
    setSaving(true);
    try {
      for (const p of BLOG_POSTS) {
        await call('post', '/blog', {
          slug: p.slug, title: p.title, seo_title: p.seo_title,
          meta_description: p.meta_description, category: p.category,
          read_time: p.readTime, date: p.date, excerpt: p.excerpt,
          content: p.content, featured_image: p.coverImage, published: true,
        }).catch(() => {}); // skip if slug exists
      }
      load(); setMsg('Demo articles seeded!');
    } finally { setSaving(false); }
  };

  const inp = "w-full font-inter text-sm text-white placeholder-white/30 px-3 py-2.5 rounded-[10px] outline-none focus:border-ak-cyan transition-colors";
  const inpStyle = { background: '#111', border: '1px solid rgba(255,255,255,0.12)' };

  if (editing !== null) {
    return (
      <div>
        <button onClick={() => setEditing(null)} className="flex items-center gap-2 font-inter text-xs text-white/50 hover:text-white mb-6 transition-colors">
          <ArrowLeft size={14} /> Back to list
        </button>
        <h2 className="font-anton text-2xl uppercase text-white mb-6">{editing === 'new' ? 'NUOVO ARTICOLO' : 'MODIFICA ARTICOLO'}</h2>
        <div className="space-y-4 max-w-3xl">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-inter text-xs text-white/50 uppercase tracking-wider block mb-1">Titolo *</label>
              <input className={inp} style={inpStyle} value={form.title||''} onChange={e => setForm({...form,title:e.target.value})} placeholder="Titolo articolo" />
            </div>
            <div>
              <label className="font-inter text-xs text-white/50 uppercase tracking-wider block mb-1">Slug *</label>
              <input className={inp} style={inpStyle} value={form.slug||''} onChange={e => setForm({...form,slug:e.target.value})} placeholder="url-del-articolo" />
            </div>
          </div>
          <div>
            <label className="font-inter text-xs text-white/50 uppercase tracking-wider block mb-1">SEO Title</label>
            <input className={inp} style={inpStyle} value={form.seo_title||''} onChange={e => setForm({...form,seo_title:e.target.value})} placeholder="Titolo SEO (max 60 char)" />
          </div>
          <div>
            <label className="font-inter text-xs text-white/50 uppercase tracking-wider block mb-1">Meta Description</label>
            <textarea className={`${inp} resize-none`} style={inpStyle} rows={2} value={form.meta_description||''} onChange={e => setForm({...form,meta_description:e.target.value})} placeholder="Descrizione SEO (max 155 char)" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="font-inter text-xs text-white/50 uppercase tracking-wider block mb-1">Categoria</label>
              <input className={inp} style={inpStyle} value={form.category||''} onChange={e => setForm({...form,category:e.target.value})} />
            </div>
            <div>
              <label className="font-inter text-xs text-white/50 uppercase tracking-wider block mb-1">Read Time</label>
              <input className={inp} style={inpStyle} value={form.read_time||''} onChange={e => setForm({...form,read_time:e.target.value})} placeholder="5 min read" />
            </div>
            <div>
              <label className="font-inter text-xs text-white/50 uppercase tracking-wider block mb-1">Data</label>
              <input className={inp} style={inpStyle} value={form.date||''} onChange={e => setForm({...form,date:e.target.value})} placeholder="Aprile 2026" />
            </div>
          </div>
          <div>
            <label className="font-inter text-xs text-white/50 uppercase tracking-wider block mb-1">Immagine (URL)</label>
            <input className={inp} style={inpStyle} value={form.featured_image||''} onChange={e => setForm({...form,featured_image:e.target.value})} placeholder="https://..." />
          </div>
          <div>
            <label className="font-inter text-xs text-white/50 uppercase tracking-wider block mb-1">Excerpt</label>
            <textarea className={`${inp} resize-none`} style={inpStyle} rows={2} value={form.excerpt||''} onChange={e => setForm({...form,excerpt:e.target.value})} placeholder="Short article preview" />
          </div>
          <div>
            <label className="font-inter text-xs text-white/50 uppercase tracking-wider block mb-1">Contenuto (Markdown)</label>
            <textarea className={`${inp} resize-y font-mono text-xs`} style={{ ...inpStyle, minHeight: '300px' }} value={form.content||''} onChange={e => setForm({...form,content:e.target.value})} placeholder="## Titolo&#10;&#10;Contenuto in markdown..." />
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="pub" checked={form.published||false} onChange={e => setForm({...form,published:e.target.checked})} className="w-4 h-4" />
            <label htmlFor="pub" className="font-inter text-sm text-white">Pubblicato</label>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={save} disabled={saving}
              className="inline-flex items-center gap-2 font-inter font-bold uppercase text-sm px-6 rounded-[12px] bg-ak-gold text-black disabled:opacity-60"
              style={{ height: '44px' }}>
              <Save size={16} /> {saving ? 'Saving...' : 'Salva'}
            </button>
            {msg && <span className={`font-inter text-xs ${msg.includes('Errore') ? 'text-red-400' : 'text-ak-cyan'}`}>{msg}</span>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-anton text-2xl uppercase text-white">BLOG ARTICLES ({posts.length})</h2>
        <div className="flex gap-3">
          {posts.length === 0 && (
            <button onClick={seedDemo} disabled={saving}
              className="inline-flex items-center gap-2 font-inter font-bold text-xs uppercase tracking-wider px-4 rounded-[10px] border border-ak-cyan text-ak-cyan hover:bg-ak-cyan hover:text-black transition-all"
              style={{ height: '36px' }}>
              Seed Demo Articles
            </button>
          )}
          <button onClick={startNew} data-testid="blog-new-btn"
            className="inline-flex items-center gap-2 font-inter font-bold text-xs uppercase tracking-wider px-4 rounded-[10px] bg-ak-gold text-black hover:scale-105 transition-transform"
            style={{ height: '36px' }}>
            <Plus size={14} /> New Article
          </button>
        </div>
      </div>
      {posts.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-white/15 rounded-[14px]">
          <BookOpen size={32} className="text-white/20 mx-auto mb-3" />
          <p className="font-inter text-sm text-white/40">No articles yet. Create the first or import demos.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map(post => (
            <div key={post.id} className="flex items-center justify-between p-4 rounded-[12px]" style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-center gap-4 min-w-0">
                {post.featured_image && <img src={post.featured_image} alt="" className="w-12 h-12 object-cover rounded-[8px] flex-shrink-0" loading="lazy" />}
                <div className="min-w-0">
                  <div className="font-inter text-sm font-semibold text-white truncate">{post.title}</div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="font-inter text-[10px] text-ak-cyan">{post.category}</span>
                    <span className="font-inter text-[10px] text-white/40">/{post.slug}</span>
                    {!post.published && <span className="font-inter text-[10px] text-yellow-500">Bozza</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link to={`/blog/${post.slug}`} target="_blank" className="p-2 text-white/40 hover:text-white transition-colors"><Eye size={15} /></Link>
                <button onClick={() => startEdit(post)} className="p-2 text-white/40 hover:text-ak-cyan transition-colors"><Pencil size={15} /></button>
                <button onClick={() => del(post)} className="p-2 text-white/40 hover:text-red-400 transition-colors"><Trash2 size={15} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── PAGES MANAGER ─── */
/* ─── PAGES MANAGER (Auto-sync) ─── */
function PagesManager({ call }) {
  const [pages, setPages]     = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm]       = useState({});
  const [saving, setSaving]   = useState(false);
  const [msg, setMsg]         = useState('');
  const [filter, setFilter]   = useState('all');

  const load = useCallback(async () => {
    try {
      const data = await call('get', '/cms/pages');
      setPages(data);
    } catch { setPages([]); }
  }, [call]);

  useEffect(() => { load(); }, [load]);

  const selectPage = (page) => {
    setSelected(page);
    setForm({ seo_title: page.seo_title || '', meta_description: page.meta_description || '', h1: page.h1 || '' });
    setMsg('');
  };

  const save = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await call('put', `/pages${selected.slug}`, { seo_title: form.seo_title, meta_description: form.meta_description, h1: form.h1 });
      setMsg('Saved!');
      load(); // refresh status
    } catch { setMsg('Error'); } finally { setSaving(false); }
  };

  const clearOverride = async () => {
    if (!selected || !selected.has_override) return;
    if (!window.confirm(`Remove SEO override for ${selected.slug}?`)) return;
    // Delete by setting empty values (effectively resetting to defaults)
    await call('put', `/pages${selected.slug}`, { seo_title: '', meta_description: '', h1: '' });
    setMsg('Override cleared');
    load();
  };

  const inp = "w-full font-inter text-sm text-white placeholder-white/30 px-3 py-2.5 rounded-[10px] outline-none focus:border-ak-cyan transition-colors";
  const inpStyle = { background: '#111', border: '1px solid rgba(255,255,255,0.12)' };

  const mainPages      = pages.filter(p => p.section === 'main');
  const secondaryPages = pages.filter(p => p.section === 'secondary');
  const supportPages   = pages.filter(p => p.section === 'support');
  const overriddenCount = pages.filter(p => p.has_override).length;

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {/* Page list */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-anton text-xl uppercase text-white">PAGES</h2>
          <span className="font-inter text-[10px] text-ak-cyan border border-ak-cyan/25 px-2 py-0.5 rounded">
            {overriddenCount} overridden
          </span>
        </div>

        {/* Main nav pages */}
        <div className="font-inter text-[9px] font-bold uppercase tracking-widest text-white/30 mb-2 mt-1">MAIN NAVIGATION</div>
        <div className="space-y-0.5 mb-4">
          {mainPages.map(p => (
            <button key={p.slug} onClick={() => selectPage(p)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-[10px] text-left transition-all group ${
                selected?.slug === p.slug
                  ? 'bg-ak-cyan/10 border border-ak-cyan/30'
                  : 'border border-transparent hover:bg-white/4'
              }`}>
              <div className="flex items-center gap-2 min-w-0">
                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${p.has_override ? 'bg-ak-cyan' : 'bg-white/15'}`} />
                <span className={`font-inter text-sm truncate ${selected?.slug === p.slug ? 'text-ak-cyan' : 'text-white/70 group-hover:text-white'}`}>
                  {p.name}
                </span>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {p.has_override && (
                  <span className="font-inter text-[8px] uppercase tracking-wider text-ak-cyan">SEO</span>
                )}
                <ChevronRight size={11} className="text-white/25" />
              </div>
            </button>
          ))}
        </div>

        {/* Secondary pages */}
        <div className="font-inter text-[9px] font-bold uppercase tracking-widest text-white/30 mb-2">SEO PAGES</div>
        <div className="space-y-0.5 mb-4">
          {secondaryPages.map(p => (
            <button key={p.slug} onClick={() => selectPage(p)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-[10px] text-left transition-all group ${
                selected?.slug === p.slug ? 'bg-ak-cyan/10 border border-ak-cyan/30' : 'border border-transparent hover:bg-white/4'
              }`}>
              <div className="flex items-center gap-2 min-w-0">
                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${p.has_override ? 'bg-ak-cyan' : 'bg-white/15'}`} />
                <span className={`font-inter text-sm truncate ${selected?.slug === p.slug ? 'text-ak-cyan' : 'text-white/50 group-hover:text-white'}`}>{p.name}</span>
              </div>
              {p.has_override && <span className="font-inter text-[8px] uppercase tracking-wider text-ak-cyan flex-shrink-0">SEO</span>}
            </button>
          ))}
        </div>

        {/* Support pages */}
        {supportPages.length > 0 && (
          <>
            <div className="font-inter text-[9px] font-bold uppercase tracking-widest text-white/30 mb-2">OTHER</div>
            <div className="space-y-0.5">
              {supportPages.map(p => (
                <button key={p.slug} onClick={() => selectPage(p)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-[10px] text-left transition-all group ${
                    selected?.slug === p.slug ? 'bg-ak-cyan/10 border border-ak-cyan/30' : 'border border-transparent hover:bg-white/4'
                  }`}>
                  <span className={`font-inter text-sm ${selected?.slug === p.slug ? 'text-ak-cyan' : 'text-white/50 group-hover:text-white'}`}>{p.name}</span>
                  {p.has_override && <span className="font-inter text-[8px] uppercase tracking-wider text-ak-cyan">SEO</span>}
                </button>
              ))}
            </div>
          </>
        )}

        <div className="mt-4 p-3 rounded-[10px]" style={{ background: 'rgba(0,255,255,0.04)', border: '1px solid rgba(0,255,255,0.1)' }}>
          <p className="font-inter text-[10px] text-white/40 leading-relaxed">
            <span style={{ color: '#00FFFF' }}>●</span> Cyan dot = has SEO override<br />
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>●</span> Grey dot = using default SEO
          </p>
        </div>
      </div>

      {/* Editor */}
      <div className="md:col-span-2">
        {!selected ? (
          <div className="flex flex-col items-center justify-center h-full border border-dashed border-white/10 rounded-[14px] py-20 gap-3">
            <FileText size={28} className="text-white/15" />
            <p className="font-inter text-sm text-white/30">Select a page to edit its SEO metadata</p>
            <p className="font-inter text-xs text-white/20">Changes override default values without touching code</p>
          </div>
        ) : (
          <div>
            {/* Page header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="font-anton text-2xl uppercase text-white">{selected.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-inter text-xs text-white/40">{selected.slug}</span>
                  {selected.has_override && (
                    <span className="font-inter text-[9px] font-bold uppercase tracking-wider text-ak-cyan border border-ak-cyan/30 px-1.5 py-0.5 rounded">
                      Override Active
                    </span>
                  )}
                </div>
              </div>
              {selected.has_override && (
                <button onClick={clearOverride}
                  className="font-inter text-xs text-red-400 hover:text-red-300 transition-colors">
                  Clear Override
                </button>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="font-inter text-xs text-white/50 uppercase tracking-wider block mb-1">
                  SEO Title <span className="text-white/20">(max 60 characters)</span>
                </label>
                <input className={inp} style={inpStyle}
                  value={form.seo_title||''}
                  onChange={e => setForm({...form, seo_title: e.target.value})}
                  placeholder="Leave empty to use default page title"
                  maxLength={60} />
                <div className="flex justify-between mt-1">
                  <span className="font-inter text-[10px] text-white/25">{(form.seo_title||'').length}/60</span>
                  {(form.seo_title||'').length > 55 && <span className="font-inter text-[10px] text-yellow-500">Too long for Google</span>}
                </div>
              </div>
              <div>
                <label className="font-inter text-xs text-white/50 uppercase tracking-wider block mb-1">
                  Meta Description <span className="text-white/20">(max 155 characters)</span>
                </label>
                <textarea className={`${inp} resize-none`} style={inpStyle} rows={3}
                  value={form.meta_description||''}
                  onChange={e => setForm({...form, meta_description: e.target.value})}
                  placeholder="Leave empty to use default description"
                  maxLength={155} />
                <div className="flex justify-between mt-1">
                  <span className="font-inter text-[10px] text-white/25">{(form.meta_description||'').length}/155</span>
                  {(form.meta_description||'').length > 145 && <span className="font-inter text-[10px] text-yellow-500">Near limit</span>}
                </div>
              </div>
              <div>
                <label className="font-inter text-xs text-white/50 uppercase tracking-wider block mb-1">H1 Override</label>
                <input className={inp} style={inpStyle}
                  value={form.h1||''}
                  onChange={e => setForm({...form, h1: e.target.value})}
                  placeholder="Leave empty to use default H1" />
                <p className="font-inter text-[10px] text-white/25 mt-1">Changes the main heading without touching code</p>
              </div>
              <div className="flex items-center gap-4 pt-2">
                <button onClick={save} disabled={saving}
                  className="inline-flex items-center gap-2 font-inter font-bold uppercase text-sm px-6 rounded-[12px] bg-ak-gold text-black disabled:opacity-60"
                  style={{ height: '44px' }}>
                  <Save size={16} /> {saving ? 'Saving...' : 'Save Override'}
                </button>
                {msg && <span className={`font-inter text-xs ${msg === 'Saved!' ? 'text-ak-cyan' : msg.includes('cleared') ? 'text-white/50' : 'text-red-400'}`}>{msg}</span>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── MEDIA LIBRARY ─── */
function MediaLibrary({ call }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ image_url: '', alt_text: '', tag: 'general' });
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => call('get', '/media').then(setItems).catch(() => {}), [call]);
  useEffect(() => { load(); }, [load]);

  const add = async (e) => {
    e.preventDefault(); if (!form.image_url) return;
    setSaving(true);
    try { await call('post', '/media', form); load(); setForm({ image_url: '', alt_text: '', tag: 'general' }); }
    finally { setSaving(false); }
  };

  const del = async (id) => { await call('delete', `/media/${id}`); load(); };

  const TAGS = ['general', 'hero', 'crossfit', 'amrap', 'gym', 'competition', 'blog'];
  const inp = "font-inter text-sm text-white placeholder-white/30 px-3 py-2 rounded-[10px] outline-none focus:border-ak-cyan transition-colors";
  const inpStyle = { background: '#111', border: '1px solid rgba(255,255,255,0.12)' };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-anton text-2xl uppercase text-white">MEDIA LIBRARY ({items.length})</h2>
      </div>

      {/* Add form */}
      <form onSubmit={add} className="flex flex-wrap gap-3 mb-8 p-5 rounded-[14px]" style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.08)' }}>
        <input className={`${inp} flex-1 min-w-[200px]`} style={inpStyle} value={form.image_url} onChange={e => setForm({...form,image_url:e.target.value})} placeholder="URL immagine (https://...)" required />
        <input className={`${inp} w-44`} style={inpStyle} value={form.alt_text} onChange={e => setForm({...form,alt_text:e.target.value})} placeholder="Alt text" />
        <select className={`${inp} w-36`} style={inpStyle} value={form.tag} onChange={e => setForm({...form,tag:e.target.value})}>
          {TAGS.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <button type="submit" disabled={saving}
          className="inline-flex items-center gap-2 font-inter font-bold text-xs uppercase px-5 rounded-[10px] bg-ak-gold text-black disabled:opacity-60"
          style={{ height: '40px' }}>
          <Upload size={14} /> Add
        </button>
      </form>

      {/* Grid */}
      {items.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-white/15 rounded-[14px]">
          <Image size={32} className="text-white/20 mx-auto mb-3" />
          <p className="font-inter text-sm text-white/40">No images yet. Add the first URL.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {items.map(item => (
            <div key={item.id} className="group relative rounded-[10px] overflow-hidden" style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.08)', aspectRatio: '1' }}>
              <img src={item.image_url} alt={item.alt_text} className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                <div>
                  <div className="inline-flex items-center gap-1 font-inter text-[10px] text-ak-cyan border border-ak-cyan/30 px-1.5 py-0.5 rounded">
                    <Tag size={9} /> {item.tag}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-inter text-[10px] text-white/60 truncate max-w-[80%]">{item.alt_text}</span>
                  <button onClick={() => del(item.id)} className="text-red-400 hover:text-red-300 transition-colors flex-shrink-0"><Trash2 size={13} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── PILOT REQUESTS ─── */
function PilotRequests({ call }) {
  const [requests, setRequests] = useState([]);
  useEffect(() => { call('get', '/pilot-requests').then(setRequests).catch(() => {}); }, [call]);

  return (
    <div>
      <h2 className="font-anton text-2xl uppercase text-white mb-6">PILOT REQUESTS ({requests.length})</h2>
      {requests.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-white/15 rounded-[14px]">
          <Users size={32} className="text-white/20 mx-auto mb-3" />
          <p className="font-inter text-sm text-white/40">No pilot requests yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map(r => (
            <div key={r.id} className="p-5 rounded-[12px] grid grid-cols-2 md:grid-cols-4 gap-4" style={{ background: '#0a0a0a', border: '1px solid rgba(255,215,0,0.15)' }}>
              <div>
                <div className="font-inter text-[10px] text-white/40 uppercase tracking-wider mb-1">Gym</div>
                <div className="font-inter text-sm font-semibold text-white">{r.gym_name}</div>
                <div className="font-inter text-xs text-white/60">{r.city}</div>
              </div>
              <div>
                <div className="font-inter text-[10px] text-white/40 uppercase tracking-wider mb-1">Owner</div>
                <div className="font-inter text-sm text-white">{r.owner_name}</div>
              </div>
              <div>
                <div className="font-inter text-[10px] text-white/40 uppercase tracking-wider mb-1">Contact</div>
                <div className="font-inter text-xs text-ak-cyan">{r.email}</div>
                {r.phone && <div className="font-inter text-xs text-white/60">{r.phone}</div>}
              </div>
              <div>
                <div className="font-inter text-[10px] text-white/40 uppercase tracking-wider mb-1">Date</div>
                <div className="font-inter text-xs text-white/60">{new Date(r.created_at).toLocaleDateString('en-GB')}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── HERO SLIDES MANAGER (Enhanced) ─── */
function HeroSlidesManager({ call }) {
  const [slides, setSlides]       = useState([]);
  const [form, setForm]           = useState({ image_url: '', sport_label: '', position: 'center center', order: 0, active: true });
  const [editing, setEditing]     = useState(null);  // null=list/add, id=edit
  const [saving, setSaving]       = useState(false);
  const [toggling, setToggling]   = useState(null);  // id being toggled
  const [deleteTarget, setDeleteTarget] = useState(null); // slide to confirm delete
  const [msg, setMsg]             = useState('');

  const load = useCallback(() => call('get', '/hero-slides/all').then(setSlides).catch(() => {}), [call]);
  useEffect(() => { load(); }, [load]);

  /* ── Save / Update ── */
  const save = async (e) => {
    e.preventDefault(); setSaving(true); setMsg('');
    try {
      if (editing) { await call('put', `/hero-slides/${editing}`, form); }
      else         { await call('post', '/hero-slides', form); }
      setMsg('Saved!'); load();
      setEditing(null);
      setForm({ image_url: '', sport_label: '', position: 'center center', order: 0, active: true });
    } catch(err) { setMsg(err?.response?.data?.detail || 'Error'); }
    finally { setSaving(false); }
  };

  /* ── Toggle active/inactive ── */
  const toggleActive = async (slide) => {
    setToggling(slide.id);
    try { await call('put', `/hero-slides/${slide.id}`, { active: !slide.active }); load(); }
    catch { }
    finally { setToggling(null); }
  };

  /* ── Delete with confirmation ── */
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await call('delete', `/hero-slides/${deleteTarget.id}`);
    setDeleteTarget(null); load();
  };

  const startEdit = (s) => {
    setEditing(s.id);
    setForm({ image_url: s.image_url, sport_label: s.sport_label, position: s.position, order: s.order, active: s.active });
    setMsg('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const POSITIONS = ['center center','center 20%','center 30%','center top','center bottom','top center'];
  const inp = "w-full font-inter text-sm text-white placeholder-white/30 px-3 py-2.5 rounded-[10px] outline-none focus:border-ak-cyan transition-colors";
  const inpStyle = { background: '#111', border: '1px solid rgba(255,255,255,0.12)' };

  const active = slides.filter(s => s.active).length;
  const total  = slides.length;

  const seedDefaults = async () => {
    setSaving(true);
    try {
      const r = await call('post', '/hero-slides/seed', {});
      if (r.seeded > 0) { load(); setMsg(`✓ Seeded ${r.seeded} default slides`); }
      else { setMsg(r.message || 'Already has slides'); }
    } catch { setMsg('Error seeding'); }
    finally { setSaving(false); }
  };

  return (
    <div>
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-anton text-2xl uppercase text-white">HERO SLIDES</h2>
          <p className="font-inter text-xs mt-1" style={{ color: '#a1a1aa' }}>
            {active} active / {total} total — <span style={{ color: '#00FFFF' }}>CMS = source of truth</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          {total === 0 && (
            <button onClick={seedDefaults} disabled={saving}
              className="inline-flex items-center gap-2 font-inter font-bold text-xs uppercase tracking-wider px-4 rounded-[10px] border border-ak-cyan text-ak-cyan hover:bg-ak-cyan hover:text-black transition-all disabled:opacity-50"
              style={{ height: '34px' }}>
              Load Default Slides
            </button>
          )}
          {editing && (
            <button onClick={() => { setEditing(null); setForm({ image_url: '', sport_label: '', position: 'center center', order: 0, active: true }); }}
              className="inline-flex items-center gap-2 font-inter text-xs text-white/50 hover:text-white transition-colors">
              <X size={14} /> Cancel Edit
            </button>
          )}
        </div>
      </div>

      {/* ── Add / Edit Form ── */}
      <form onSubmit={save} className="p-6 rounded-[14px] mb-8" style={{ background: '#0a0a0a', border: `1px solid ${editing ? 'rgba(0,255,255,0.3)' : 'rgba(255,255,255,0.08)'}` }}>
        <div className="font-inter text-xs font-bold uppercase tracking-wider mb-4" style={{ color: editing ? '#00FFFF' : '#a1a1aa' }}>
          {editing ? '✏ EDITING SLIDE' : '+ ADD NEW SLIDE'}
        </div>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div className="sm:col-span-2">
            <label className="font-inter text-xs text-white/50 uppercase tracking-wider block mb-1">Image URL *</label>
            <input className={inp} style={inpStyle} required value={form.image_url}
              onChange={e => setForm({...form, image_url: e.target.value})}
              placeholder="https://images.pexels.com/photos/..." />
          </div>
          <div>
            <label className="font-inter text-xs text-white/50 uppercase tracking-wider block mb-1">Sport Label</label>
            <input className={inp} style={inpStyle} value={form.sport_label}
              onChange={e => setForm({...form, sport_label: e.target.value.toUpperCase()})}
              placeholder="CROSSFIT · RUNNING · BASKETBALL..." />
          </div>
          <div>
            <label className="font-inter text-xs text-white/50 uppercase tracking-wider block mb-1">Image Position</label>
            <select className={inp} style={inpStyle} value={form.position} onChange={e => setForm({...form, position: e.target.value})}>
              {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="font-inter text-xs text-white/50 uppercase tracking-wider block mb-1">Order (0 = first)</label>
            <input type="number" className={inp} style={inpStyle} value={form.order}
              onChange={e => setForm({...form, order: parseInt(e.target.value)||0})} min={0} />
          </div>
          <div className="flex items-center gap-3 self-end pb-2">
            <button type="button" onClick={() => setForm({...form, active: !form.active})}
              className="flex items-center gap-2 transition-colors"
              style={{ color: form.active ? '#00FFFF' : '#666' }}>
              {form.active ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
              <span className="font-inter text-sm">{form.active ? 'Active' : 'Inactive'}</span>
            </button>
          </div>
        </div>
        {/* Live preview */}
        {form.image_url && (
          <div className="mb-4 rounded-[10px] overflow-hidden relative group" style={{ height: '130px' }}>
            <img src={form.image_url} alt="preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              style={{ objectPosition: form.position }} loading="lazy" />
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute bottom-2 left-2">
              <span className="font-inter text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded"
                style={{ background: 'rgba(0,255,255,0.8)', color: '#000' }}>
                {form.sport_label || 'PREVIEW'} · {form.position}
              </span>
            </div>
          </div>
        )}
        <div className="flex items-center gap-4">
          <button type="submit" disabled={saving}
            className="inline-flex items-center gap-2 font-inter font-bold uppercase text-sm px-6 rounded-[12px] bg-ak-gold text-black disabled:opacity-60"
            style={{ height: '40px' }}>
            <Save size={14} /> {saving ? 'Saving...' : editing ? 'Update Slide' : 'Add Slide'}
          </button>
          {editing && (
            <button type="button"
              onClick={() => { setEditing(null); setForm({ image_url: '', sport_label: '', position: 'center center', order: 0, active: true }); setMsg(''); }}
              className="font-inter text-xs text-white/50 hover:text-white px-4 py-2 rounded-[10px] border border-white/10 transition-colors">
              Cancel
            </button>
          )}
          {msg && <span className={`font-inter text-xs ${msg === 'Saved!' ? 'text-ak-cyan' : 'text-red-400'}`}>{msg}</span>}
        </div>
      </form>

      {/* ── Slides Grid ── */}
      {slides.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-white/10 rounded-[14px]">
          <Layers size={32} className="text-white/15 mx-auto mb-3" />
          <p className="font-inter text-sm text-white/35 mb-1">No slides configured.</p>
          <p className="font-inter text-xs text-white/20">Homepage uses default built-in slides until you add slides here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {slides.sort((a,b) => a.order - b.order).map(s => (
            <div key={s.id}
              className="rounded-[14px] overflow-hidden"
              style={{ background: '#0a0a0a', border: `1px solid ${s.active ? 'rgba(0,255,255,0.2)' : 'rgba(255,255,255,0.06)'}`, opacity: s.active ? 1 : 0.55 }}>

              {/* Thumbnail */}
              <div className="relative overflow-hidden group" style={{ height: '160px' }}>
                <img src={s.image_url} alt={s.sport_label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  style={{ objectPosition: s.position }} loading="lazy" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.7) 100%)' }} />

                {/* Order badge */}
                <div className="absolute top-3 left-3">
                  <span className="font-inter text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-full"
                    style={{ background: 'rgba(0,0,0,0.7)', color: '#a1a1aa', border: '1px solid rgba(255,255,255,0.15)' }}>
                    #{s.order}
                  </span>
                </div>

                {/* Sport label */}
                <div className="absolute bottom-3 left-3">
                  <span className="font-anton text-xl uppercase tracking-wide" style={{ color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
                    {s.sport_label || '—'}
                  </span>
                </div>

                {/* Inactive overlay */}
                {!s.active && (
                  <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)' }}>
                    <span className="font-inter text-xs font-bold uppercase tracking-widest text-white/50 border border-white/20 px-3 py-1 rounded-full">INACTIVE</span>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="p-4 flex items-center justify-between gap-3">
                {/* Toggle */}
                <button
                  onClick={() => toggleActive(s)}
                  disabled={toggling === s.id}
                  className="flex items-center gap-2 transition-colors disabled:opacity-50"
                  title={s.active ? 'Click to deactivate' : 'Click to activate'}
                  style={{ color: s.active ? '#00FFFF' : '#555' }}>
                  {toggling === s.id
                    ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    : s.active ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                  <span className="font-inter text-xs font-semibold">{s.active ? 'Active' : 'Inactive'}</span>
                </button>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <button onClick={() => startEdit(s)}
                    className="p-2 rounded-[8px] text-white/40 hover:text-ak-cyan hover:bg-ak-cyan/10 transition-all"
                    title="Edit slide">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => setDeleteTarget(s)}
                    className="p-2 rounded-[8px] text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-all"
                    title="Delete slide">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
          onClick={() => setDeleteTarget(null)}>
          <div className="w-full max-w-sm rounded-[20px] p-8 text-center"
            style={{ background: '#111', border: '1px solid rgba(255,45,45,0.3)', boxShadow: '0 40px 80px rgba(0,0,0,0.8)' }}
            onClick={e => e.stopPropagation()}>
            {/* Slide preview in modal */}
            <div className="w-full rounded-[12px] overflow-hidden mb-5" style={{ height: '100px' }}>
              <img src={deleteTarget.image_url} alt="" className="w-full h-full object-cover"
                style={{ objectPosition: deleteTarget.position }} loading="lazy" />
            </div>
            <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={18} className="text-red-400" />
            </div>
            <h3 className="font-anton text-xl uppercase text-white mb-2">Delete Slide?</h3>
            <p className="font-inter text-sm mb-1" style={{ color: '#a1a1aa' }}>
              Sport: <span className="text-white font-semibold">{deleteTarget.sport_label || '—'}</span>
            </p>
            <p className="font-inter text-xs mb-8" style={{ color: '#666' }}>This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)}
                className="flex-1 font-inter font-semibold text-sm rounded-[12px] border border-white/15 text-white hover:border-white/40 transition-colors"
                style={{ height: '44px' }}>
                Cancel
              </button>
              <button onClick={confirmDelete}
                className="flex-1 font-inter font-black text-sm rounded-[12px] bg-red-500 text-white hover:bg-red-400 transition-colors"
                style={{ height: '44px' }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── MAIN ADMIN PAGE ─── */
export default function AdminPage() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [tab, setTab] = useState('dashboard');
  const navigate = useNavigate();

  const login = (t) => { localStorage.setItem(TOKEN_KEY, t); setToken(t); };
  const logout = () => { localStorage.removeItem(TOKEN_KEY); setToken(null); };

  const call = useAdminAPI(token);

  if (!token) return <LoginScreen onLogin={login} />;

  return (
    <div className="min-h-screen bg-black font-inter flex">
      <Sidebar tab={tab} setTab={setTab} onLogout={logout} />
      <main className="flex-1 p-8 overflow-auto">
        {tab === 'dashboard' && <Dashboard call={call} />}
        {tab === 'analytics' && <AnalyticsDashboard call={call} />}
        {tab === 'content'   && <ContentEditor call={call} />}
        {tab === 'hero'      && <HeroSlidesManager call={call} />}
        {tab === 'blog'      && <BlogManager call={call} />}
        {tab === 'pages'     && <PagesManager call={call} />}
        {tab === 'media'     && <MediaLibrary call={call} />}
        {tab === 'pilots'    && <PilotRequests call={call} />}
      </main>
    </div>
  );
}
