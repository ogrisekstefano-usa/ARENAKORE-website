import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  LayoutDashboard, FileText, BookOpen, Image, Users,
  LogOut, Plus, Pencil, Trash2, Save, X, Eye,
  ChevronRight, AlertCircle, CheckCircle, Upload, Tag,
  Zap, ArrowLeft, Layers, ToggleLeft, ToggleRight,
  Activity, BarChart2, MousePointerClick, TrendingUp, RefreshCw,
  Globe, Languages, Sparkles, Copy, Menu
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
  { id: 'dashboard', label: 'Dashboard',       icon: LayoutDashboard },
  { id: 'analytics', label: 'Analytics',       icon: Activity },
  { id: 'content',   label: 'Content',         icon: FileText },
  { id: 'global',    label: 'Global Content',  icon: Globe },
  { id: 'nav',       label: 'Navigation',      icon: Menu },
  { id: 'coverage',  label: 'Key Coverage',    icon: BarChart2 },
  { id: 'hero',      label: 'Hero Slides',     icon: Layers },
  { id: 'blog',      label: 'Blog',            icon: BookOpen },
  { id: 'pages',     label: 'SEO Pages',       icon: FileText },
  { id: 'media',     label: 'Media',           icon: Image },
  { id: 'pilots',    label: 'Pilot Requests',  icon: Users },
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
  const [backendDown, setBackendDown] = useState(false);
  useEffect(() => {
    call('get', '/admin/stats')
      .then(d => { setStats(d); setBackendDown(false); })
      .catch(() => { setBackendDown(true); });
  }, [call]);
  const cards = stats ? [
    { label: 'Blog Posts', value: stats.blog_posts, color: '#00FFFF' },
    { label: 'Pages CMS', value: stats.pages, color: '#FFD700' },
    { label: 'Media Items', value: stats.media, color: '#00FFFF' },
    { label: 'Pilot Requests', value: stats.pilot_requests, color: '#FF2D2D' },
  ] : [];
  return (
    <div>
      <h2 className="font-anton text-2xl uppercase text-white mb-6">DASHBOARD</h2>
      {backendDown && (
        <div className="mb-6 p-4 rounded-[12px] flex items-center gap-3" style={{ background: 'rgba(255,45,45,0.08)', border: '1px solid rgba(255,45,45,0.25)' }}>
          <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
          <div>
            <div className="font-inter text-sm font-bold text-red-400">Backend offline</div>
            <div className="font-inter text-xs text-white/50">Il server non è raggiungibile. Il CMS non è modificabile. Il sito usa i contenuti in cache.</div>
          </div>
        </div>
      )}
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

/* ─── KEY COVERAGE VIEW ─── */
function KeyCoverageView({ call }) {
  const [coverage, setCoverage] = useState({});
  const [loading, setLoading]   = useState(true);
  const [expandedSlug, setExpandedSlug] = useState(null);

  const load = () => {
    setLoading(true);
    call('get', '/cms/coverage').then(setCoverage).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, [call]);

  // Summary stats
  const allSlugs = Object.keys(coverage);
  const totalKeys = allSlugs.reduce((sum, s) => sum + (coverage[s] || []).length, 0);
  const inCmsKeys = allSlugs.reduce((sum, s) => sum + (coverage[s] || []).filter(k => k.in_cms).length, 0);
  const usedKeys  = allSlugs.reduce((sum, s) => sum + (coverage[s] || []).filter(k => k.used).length, 0);
  const missingTotal = allSlugs.reduce((sum, s) => sum + (coverage[s] || []).filter(k => k.used && !k.in_cms).length, 0);
  const coveragePct = totalKeys > 0 ? Math.round((inCmsKeys / totalKeys) * 100) : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-anton text-2xl uppercase text-white">KEY COVERAGE</h2>
          <p className="font-inter text-xs mt-1" style={{ color: '#a1a1aa' }}>
            Tracks which CMS keys are used in the frontend
          </p>
        </div>
        <button onClick={load} className="font-inter text-xs text-white/40 hover:text-white transition-colors border border-white/10 px-3 py-1.5 rounded-full">
          <RefreshCw size={12} className="inline mr-1" />Refresh
        </button>
      </div>

      {/* Global summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'CMS Coverage', value: `${coveragePct}%`, color: coveragePct === 100 ? '#00FFFF' : coveragePct >= 80 ? '#FFD700' : '#FF2D2D' },
          { label: 'Keys in CMS', value: `${inCmsKeys}/${totalKeys}`, color: '#00FFFF' },
          { label: 'Used by Frontend', value: usedKeys, color: '#34d399' },
          { label: 'Missing from CMS', value: missingTotal, color: missingTotal === 0 ? '#34d399' : '#FF2D2D' },
        ].map((s, i) => (
          <div key={i} className="p-4 rounded-[12px] text-center" style={{ background: '#0a0a0a', border: `1px solid ${s.color}20` }}>
            <div className="font-anton text-3xl mb-1" style={{ color: s.color }}>{s.value}</div>
            <div className="font-inter text-[10px] font-semibold uppercase tracking-wider text-white">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Coverage bar */}
      <div className="mb-8 p-5 rounded-[14px]" style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center justify-between mb-3">
          <span className="font-inter text-xs font-bold uppercase tracking-wider text-white">Overall CMS Coverage</span>
          <span className="font-inter text-sm font-bold" style={{ color: coveragePct === 100 ? '#00FFFF' : '#FFD700' }}>{coveragePct}%</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${coveragePct}%`, background: coveragePct === 100 ? '#00FFFF' : coveragePct >= 80 ? '#FFD700' : '#FF2D2D' }} />
        </div>
        {missingTotal === 0 ? (
          <p className="font-inter text-xs text-green-400 mt-2">✅ Zero missing keys — CMS coverage complete</p>
        ) : (
          <p className="font-inter text-xs text-red-400 mt-2">❌ {missingTotal} keys used in frontend but missing from CMS</p>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-6 h-6 border-2 border-ak-cyan border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="space-y-4">
          {Object.entries(coverage).map(([slug, keys]) => {
            const total  = keys.length;
            const used   = keys.filter(k => k.used).length;
            const inCms  = keys.filter(k => k.in_cms).length;
            const missing = keys.filter(k => k.used && !k.in_cms).length;
            const unused  = keys.filter(k => !k.used && k.in_cms).length;
            const isExpanded = expandedSlug === slug;
            return (
              <div key={slug} className="rounded-[14px] overflow-hidden" style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.08)' }}>
                <button className="w-full flex items-center justify-between p-5" onClick={() => setExpandedSlug(isExpanded ? null : slug)}>
                  <div className="flex items-center gap-4">
                    <div className="font-anton text-lg uppercase text-white">/{slug}</div>
                    <div className="flex items-center gap-3 font-inter text-xs">
                      <span className="text-ak-cyan">{used} used</span>
                      <span className="text-white/30">·</span>
                      <span style={{ color: missing > 0 ? '#FF2D2D' : '#34d399' }}>{missing} missing from CMS</span>
                      <span className="text-white/30">·</span>
                      <span className="text-white/40">{unused} unused</span>
                    </div>
                  </div>
                  <ChevronRight size={14} className={`text-white/25 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                </button>
                {isExpanded && (
                  <div className="border-t border-white/8">
                    <div className="grid grid-cols-3 gap-px" style={{ background: 'rgba(255,255,255,0.04)' }}>
                      {keys.sort((a,b) => b.count - a.count).map(k => {
                        const color = !k.in_cms ? '#FF2D2D' : !k.used ? '#555' : '#34d399';
                        return (
                          <div key={k.key} className="p-3 flex items-start justify-between gap-2" style={{ background: '#0a0a0a' }}>
                            <div className="min-w-0">
                              <div className="font-inter text-[10px] font-bold truncate" style={{ color }}>{k.key}</div>
                              <div className="font-inter text-[9px] text-white/25">{k.count > 0 ? `${k.count}x · ${k.langs?.join(',')}` : 'not used'}</div>
                            </div>
                            <div className="flex-shrink-0">
                              {!k.in_cms && k.used && <span className="font-inter text-[9px] text-red-400">❌ missing</span>}
                              {k.in_cms && !k.used && <span className="font-inter text-[9px] text-white/25">unused</span>}
                              {k.in_cms && k.used && <span className="font-inter text-[9px] text-green-400">✓</span>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {Object.keys(coverage).length === 0 && (
            <div className="text-center py-16 border border-dashed border-white/10 rounded-[14px]">
              <BarChart2 size={24} className="text-white/15 mx-auto mb-2" />
              <p className="font-inter text-sm text-white/30">No usage data yet. Pages will be tracked as users visit them.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── GLOBAL CONTENT EDITOR ─── */
const GROUPS = { navbar: 'Navbar', cta: 'CTA Buttons', footer: 'Footer', system: 'System' };

function GlobalContentEditor({ call }) {
  const [items, setItems]     = useState([]);
  const [activeLang, setActiveLang] = useState('en');
  const [saving, setSaving]   = useState(false);
  const [translating, setTranslating] = useState('');
  const [msg, setMsg]         = useState('');

  const load = useCallback(() =>
    call('get', '/cms/global/full')
      .then(data => {
        setItems(data);
        // Auto-seed if DB is empty (fresh deployment)
        if (!data || data.length === 0) {
          call('post', '/cms/global/seed', {}).then(() => {
            call('get', '/cms/global/full').then(setItems).catch(() => {});
          }).catch(() => {});
        }
      })
      .catch(() => setItems([]))
  , [call]);

  useEffect(() => { load(); }, [load]);

  const updateItem = (key, lang, val) => {
    setItems(prev => prev.map(item =>
      item.key === key ? { ...item, translations: { ...item.translations, [lang]: val } } : item
    ));
  };

  const save = async () => {
    // Block save if active language has missing required items (nav_cta, cta_download_app required)
    const requiredGlobalKeys = ['nav_cta', 'cta_download_app', 'footer_tagline'];
    const missingRequired = requiredGlobalKeys.filter(k => {
      const item = items.find(i => i.key === k);
      return !item?.translations?.[activeLang];
    });
    if (missingRequired.length > 0 && activeLang !== 'en') {
      setMsg(`⚠ Cannot save: missing in ${activeLang.toUpperCase()}: ${missingRequired.join(', ')}`);
      return;
    }
    setSaving(true); setMsg('');
    try {
      await call('put', '/cms/global', items);
      setMsg('Saved!');
    } catch { setMsg('Error'); } finally { setSaving(false); }
  };

  const seed = async () => {
    setSaving(true);
    try {
      const r = await call('post', '/cms/global/seed', {});
      setMsg(r.message || `Seeded ${r.seeded} items`);
      load();
    } catch { setMsg('Error seeding'); } finally { setSaving(false); }
  };

  const translateLang = async (langCode, langName) => {
    setTranslating(langCode); setMsg('');
    try {
      const r = await call('post', '/cms/global/translate', { target_lang: langCode, target_lang_name: langName });
      setMsg(`✓ Translated ${r.translated} items to ${langCode.toUpperCase()}`);
      load();
    } catch (e) { setMsg(e?.response?.data?.detail || 'Translation failed'); }
    finally { setTranslating(''); }
  };

  const groupedItems = {};
  items.forEach(item => {
    const g = item.group || 'other';
    if (!groupedItems[g]) groupedItems[g] = [];
    groupedItems[g].push(item);
  });

  const inp = "w-full font-inter text-sm text-white placeholder-white/25 px-3 py-2 rounded-[10px] outline-none focus:border-ak-cyan transition-colors";
  const inpStyle = { background: '#111', border: '1px solid rgba(255,255,255,0.1)' };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-anton text-2xl uppercase text-white">GLOBAL CONTENT</h2>
          <p className="font-inter text-xs mt-1" style={{ color: '#a1a1aa' }}>
            Navbar · Footer · CTAs · System labels — {items.length} items
          </p>
        </div>
        <div className="flex items-center gap-2">
          {items.length === 0 && (
            <button onClick={seed} disabled={saving}
              className="font-inter text-xs font-bold uppercase px-4 rounded-[10px] border border-ak-cyan text-ak-cyan hover:bg-ak-cyan hover:text-black transition-all disabled:opacity-50"
              style={{ height: '34px' }}>
              Seed Defaults
            </button>
          )}
          <button onClick={save} disabled={saving}
            className="inline-flex items-center gap-2 font-inter font-bold text-xs uppercase px-5 rounded-[10px] bg-ak-gold text-black disabled:opacity-60"
            style={{ height: '36px' }}>
            <Save size={13} /> {saving ? 'Saving...' : 'Save All'}
          </button>
          {msg && <span className={`font-inter text-xs ${msg.startsWith('✓') || msg === 'Saved!' ? 'text-ak-cyan' : 'text-red-400'}`}>{msg}</span>}
        </div>
      </div>

      {/* Language tabs + AI translate */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {[{code:'en',label:'EN',flag:'🌍'},{code:'it',label:'IT',flag:'🇮🇹'},{code:'es',label:'ES',flag:'🇪🇸'}].map(l => (
          <button key={l.code} onClick={() => setActiveLang(l.code)}
            className={`inline-flex items-center gap-1.5 font-inter text-xs font-bold uppercase px-3 py-1.5 rounded-[8px] transition-all ${
              activeLang === l.code ? 'bg-ak-cyan/15 text-ak-cyan border border-ak-cyan/35' : 'text-white/50 hover:text-white border border-white/8'
            }`}>
            {l.flag} {l.label}
          </button>
        ))}
        {[{code:'it',name:'Italian'},{code:'es',name:'Spanish'}].map(l => (
          <button key={`tr-${l.code}`} onClick={() => translateLang(l.code, l.name)} disabled={!!translating}
            className="inline-flex items-center gap-1 font-inter text-[10px] text-white/30 hover:text-ak-gold transition-colors disabled:opacity-40 px-2 py-1.5 border border-white/5 rounded-[8px]">
            <Sparkles size={10} />
            {translating === l.code ? 'Translating...' : `AI ${l.code.toUpperCase()}`}
          </button>
        ))}
      </div>

      {/* Grouped items */}
      {Object.entries(groupedItems).map(([group, groupItems]) => (
        <div key={group} className="mb-8">
          <div className="font-inter text-[10px] font-bold uppercase tracking-widest text-white/30 mb-3">
            {GROUPS[group] || group.toUpperCase()}
          </div>
          <div className="space-y-2">
            {groupItems.map(item => {
              const val = item.translations?.[activeLang] || '';
              const enVal = item.translations?.en || '';
              return (
                <div key={item.key} className="flex items-center gap-3 p-3 rounded-[10px]"
                  style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="w-36 flex-shrink-0">
                    <div className="font-inter text-[10px] font-bold uppercase tracking-wider text-ak-cyan truncate">{item.key}</div>
                  </div>
                  <input type="text" value={val}
                    onChange={e => updateItem(item.key, activeLang, e.target.value)}
                    className={`${inp} flex-1`} style={inpStyle}
                    placeholder={activeLang !== 'en' ? `EN: ${enVal}` : 'Value...'} />
                  {activeLang !== 'en' && !val && enVal && (
                    <span className="font-inter text-[9px] text-yellow-500 flex-shrink-0">⚠ Missing</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
      {items.length === 0 && (
        <div className="text-center py-12 border border-dashed border-white/10 rounded-[14px]">
          <Globe size={24} className="text-white/15 mx-auto mb-2" />
          <p className="font-inter text-sm text-white/30">No global content. Click "Seed Defaults" to start.</p>
          <p className="font-inter text-xs text-white/20 mt-1">Se il backend è offline, i contenuti sono in cache nel browser.</p>
        </div>
      )}
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
  const [pageCompleteness, setPageCompleteness] = useState({});
  const [versions, setVersions]         = useState([]);
  const [showVersions, setShowVersions] = useState(false);
  const [publishing, setPublishing]     = useState('');
  const [abTests, setAbTests]           = useState({});
  const [editingAB, setEditingAB]       = useState(null); // key being AB edited

  const [versionNote, setVersionNote]   = useState('');
  const [versionAuthor, setVersionAuthor] = useState('admin');



  const [seeding, setSeeding] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    call('get', '/cms/pages-list')
      .then(data => { setPages(data); setLoadError(false); })
      .catch(() => { setPages([]); setLoadError(true); });
  }, [call]);
  const reseedAll = async () => {
    if (!window.confirm('Force reseed ALL pages? AI will translate EN → IT, ES. Existing content will be overwritten.')) return;
    setSeeding(true); setMsg('');
    try {
      const r = await call('post', '/cms/seed-all?force=true&translate=true', {});
      setMsg(`✓ Seeded ${r.total_seeded} pages · AI translations complete`);
      call('get', '/cms/pages-list').then(setPages).catch(() => {});
    } catch (e) { setMsg(e?.response?.data?.detail || 'Seed failed'); }
    finally { setSeeding(false); }
  };


  const loadPage = async (slug) => {
    setSelectedPage(slug); setMsg(''); setShowVersions(false);
    try {
      const [doc, completeness, vers, ab] = await Promise.all([
        call('get', `/cms/content/${slug}/full`),
        call('get', `/cms/content/${slug}/completeness`).catch(() => ({})),
        call('get', `/cms/versions/${slug}`).catch(() => []),
        call('get', `/cms/ab-tests/${slug}`).catch(() => ({})),
      ]);
      const secs = doc.sections || [];
      setSections(secs.map(s => ({ ...s, translations: { ...s.translations } })));
      const detected = new Set();
      secs.forEach(s => Object.keys(s.translations || {}).forEach(l => detected.add(l)));
      const extra = [...detected].filter(l => !LANGS.find(x => x.code === l));
      setCustomLangs(extra.map(c => ({ code: c, label: c.toUpperCase(), name: c })));
      setPageCompleteness(completeness || {});
      setVersions(vers || []);
      setAbTests(ab || {});
    } catch { setSections([]); }
  };

  const updateSection = (key, lang, value) => {
    setSections(prev => {
      const exists = prev.some(s => typeof s === 'object' && s.key === key);
      if (exists) {
        return prev.map(s =>
          (typeof s === 'object' && s.key === key)
            ? { ...s, translations: { ...(s.translations || {}), [lang]: value } }
            : s
        );
      }
      // Key not in sections yet (e.g. new pos keys) — add it
      return [...prev, { key, field_type: 'position', translations: { [lang]: value } }];
    });
  };

  const save = async () => {
    if (!selectedPage) return;
    // Block save if required fields missing for active language
    const status = pageCompleteness[activeLang];
    if (status && !status.has_required) {
      const required = ['hero_h1_line1', 'hero_h1_line2', 'hero_sub', 'hero_h1', 'hero_sub1'];
      const missingRequired = sections.filter(s => required.includes(s.key) && !(s.translations || {})[activeLang]);
      if (missingRequired.length > 0) {
        setMsg(`⚠ Cannot save: missing required fields in ${activeLang.toUpperCase()}: ${missingRequired.map(s => s.key).join(', ')}`);
        return;
      }
    }
    setSaving(true); setMsg('');
    try {
      const note   = versionNote.trim() || 'No note provided';
      const author = versionAuthor.trim() || 'admin';
      // auto_publish=true by default → changes are LIVE immediately
      await call('put', `/cms/content/${selectedPage}?note=${encodeURIComponent(note)}&created_by=${encodeURIComponent(author)}&auto_publish=true`, sections);
      setMsg('✓ Saved & Published — changes are LIVE');
      setVersionNote('');
      const completeness = await call('get', `/cms/content/${selectedPage}/completeness`).catch(() => ({}));
      setPageCompleteness(completeness || {});
      await call('get', `/cms/versions/${selectedPage}`).then(setVersions).catch(() => {});
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
        <button onClick={reseedAll} disabled={seeding}
          className="w-full mb-4 inline-flex items-center justify-center gap-2 font-inter font-bold text-xs uppercase tracking-wider px-4 rounded-[10px] border border-ak-gold text-ak-gold hover:bg-ak-gold hover:text-black transition-all disabled:opacity-40"
          style={{ height: '34px' }}>
          <Sparkles size={12} /> {seeding ? 'AI Translating...' : 'Force Reseed All + AI Translate'}
        </button>
        <div className="space-y-1">
          {loadError && (
            <div className="p-3 rounded-[10px] text-center" style={{ background: 'rgba(255,45,45,0.08)', border: '1px solid rgba(255,45,45,0.2)' }}>
              <div className="font-inter text-xs text-red-400 font-bold">Backend non raggiungibile</div>
              <div className="font-inter text-[10px] text-white/40 mt-1">Riconnetti il server e ricarica la pagina.</div>
            </div>
          )}
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
        {/* Completeness legend */}
        {pageCompleteness && Object.keys(pageCompleteness).length > 0 && (
          <div className="mt-4 p-3 rounded-[10px] space-y-1.5" style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="font-inter text-[9px] font-bold uppercase tracking-widest text-white/30 mb-2">Completeness</div>
            {Object.entries(pageCompleteness).sort(([a],[b])=>a.localeCompare(b)).map(([lang, info]) => (
              <div key={lang} className="flex items-center gap-2">
                <span className="font-inter text-[10px] font-bold uppercase w-6 text-white/50">{lang}</span>
                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div className="h-full rounded-full transition-all"
                    style={{ width: `${info.pct}%`, background: info.pct === 100 ? '#00FFFF' : info.pct >= 50 ? '#FFD700' : '#FF2D2D' }} />
                </div>
                <span className="font-inter text-[10px] font-bold" style={{ color: info.pct === 100 ? '#00FFFF' : info.pct >= 50 ? '#FFD700' : '#FF2D2D' }}>
                  {info.pct === 100 ? '✅' : info.pct >= 50 ? '⚠️' : '❌'} {info.pct}%
                </span>
              </div>
            ))}
          </div>
        )}
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
              <div className="flex flex-col gap-3">
                {/* Note + author row */}
                <div className="flex items-center gap-2">
                  <input
                    type="text" value={versionNote}
                    onChange={e => setVersionNote(e.target.value)}
                    placeholder="Version note (optional) — e.g. 'Updated hero for Q2 campaign'"
                    className="flex-1 font-inter text-xs text-white placeholder-white/25 px-3 py-2 rounded-[8px] outline-none focus:border-white/30 transition-colors"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', minWidth: '260px' }}
                  />
                  <input
                    type="text" value={versionAuthor}
                    onChange={e => setVersionAuthor(e.target.value)}
                    placeholder="Author"
                    className="font-inter text-xs text-white placeholder-white/25 px-3 py-2 rounded-[8px] outline-none focus:border-white/30 transition-colors"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', width: '100px' }}
                  />
                </div>
                {/* Action buttons row */}
                <div className="flex items-center gap-2 flex-wrap">
                <button onClick={save} disabled={saving}
                  className="inline-flex items-center gap-2 font-inter font-bold text-xs uppercase px-5 rounded-[10px] bg-ak-gold text-black disabled:opacity-60"
                  style={{ height: '36px' }}>
                  <Save size={13} /> {saving ? 'Saving...' : '⬆ Save & Publish'}
                </button>
                {/* Publish latest version */}
                {versions.length > 0 && versions[0]?.status !== 'published' && (
                  <button
                    onClick={async () => {
                      setPublishing(versions[0].version_id);
                      try {
                        await call('post', `/cms/versions/${selectedPage}/publish/${versions[0].version_id}`, {});
                        setMsg('✓ Published!');
                        loadPage(selectedPage);
                      } catch { setMsg('Publish failed'); }
                      finally { setPublishing(''); }
                    }}
                    disabled={!!publishing}
                    className="inline-flex items-center gap-2 font-inter font-bold text-xs uppercase px-4 rounded-[10px] border border-green-500 text-green-400 hover:bg-green-500 hover:text-black transition-all disabled:opacity-50"
                    style={{ height: '36px' }}>
                    {publishing ? '...' : '⬆ Publish'}
                  </button>
                )}
                {/* Version history toggle */}
                <button onClick={() => setShowVersions(!showVersions)}
                  className={`inline-flex items-center gap-1.5 font-inter text-xs px-3 rounded-[10px] border transition-colors ${showVersions ? 'border-ak-cyan text-ak-cyan' : 'border-white/10 text-white/40 hover:text-white'}`}
                  style={{ height: '36px' }}>
                  <RefreshCw size={11} /> {versions.length} versions
                </button>
                {msg && <span className={`font-inter text-xs ${msg.startsWith('✓') || msg === 'Saved!' ? 'text-ak-cyan' : 'text-red-400'}`}>{msg}</span>}
                </div>  {/* close action buttons row */}
              </div>   {/* close flex-col */}
            </div>

            {/* Version history panel */}
            {showVersions && versions.length > 0 && (
              <div className="mb-5 p-4 rounded-[12px]" style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="font-inter text-[10px] font-bold uppercase tracking-widest text-white/40 mb-3">VERSION HISTORY</div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {versions.map((v, i) => {
                    const isPublished = v.status === 'published';
                    const isDraft = v.status === 'draft';
                    return (
                      <div key={v.version_id} className="flex items-start justify-between p-3 rounded-[10px] gap-3"
                        style={{ background: '#111', border: `1px solid ${isPublished ? 'rgba(0,255,255,0.2)' : 'rgba(255,255,255,0.05)'}` }}>
                        <div className="flex items-start gap-3 min-w-0 flex-1">
                          <span className="font-inter text-[9px] font-bold uppercase px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5"
                            style={{ background: isPublished ? 'rgba(0,255,255,0.15)' : 'rgba(255,255,255,0.05)', color: isPublished ? '#00FFFF' : '#555' }}>
                            {v.status}
                          </span>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-inter text-xs text-white/70 font-semibold">v{versions.length - i}</span>
                              <span className="font-inter text-[10px] text-white/40">
                                {new Date(v.created_at).toLocaleString('en-GB', {month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'})}
                              </span>
                              {v.created_by && v.created_by !== 'admin' && (
                                <span className="font-inter text-[10px] text-ak-cyan">by {v.created_by}</span>
                              )}
                              <span className="font-inter text-[10px] text-white/25">{v.sections_count} fields</span>
                              {v.rolled_back_from && <span className="font-inter text-[9px] text-yellow-500">↩ rollback</span>}
                            </div>
                            <div className="font-inter text-[10px] mt-1 italic truncate max-w-xs"
                              style={{ color: v.note === 'No note provided' ? '#444' : '#a1a1aa' }}>
                              "{v.note || 'No note provided'}"
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {!isPublished && (
                            <button
                              onClick={async () => {
                                setPublishing(v.version_id);
                                try {
                                  await call('post', `/cms/versions/${selectedPage}/publish/${v.version_id}`, {});
                                  setMsg('✓ Published!'); loadPage(selectedPage);
                                } catch { setMsg('Error'); }
                                finally { setPublishing(''); }
                              }}
                              disabled={!!publishing}
                              className="font-inter text-[9px] uppercase text-green-400 hover:text-green-300 disabled:opacity-40 border border-green-500/30 px-2 py-1 rounded">
                              Publish
                            </button>
                          )}
                          {i > 0 && (
                            <button
                              onClick={async () => {
                                if (!window.confirm('Rollback to this version? Current draft will be overwritten.')) return;
                                try {
                                  const r = await call('post', `/cms/versions/${selectedPage}/rollback/${v.version_id}`, {});
                                  setMsg(`✓ Rolled back — new draft created`);
                                  loadPage(selectedPage);
                                } catch { setMsg('Rollback failed'); }
                              }}
                              className="font-inter text-[9px] uppercase text-yellow-500 hover:text-yellow-300 border border-yellow-500/30 px-2 py-1 rounded">
                              Restore
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

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

            {/* ── DISCIPLINE IMAGES PANEL (homepage only) ── */}
            {selectedPage === 'homepage' && (() => {
              const imgKeys = ['d1_img','d2_img','d3_img','d4_img','d5_img','d6_img','d7_img','d8_img'];
              const posKeys = ['d1_pos','d2_pos','d3_pos','d4_pos','d5_pos','d6_pos','d7_pos','d8_pos'];
              const imgLabels = ['Fitness & CrossFit','Running','Basket','Nuoto','Golf','Surf & Kitesurf','Sport di Squadra','Sfide Personali'];
              const imgSections = imgKeys.map(k => sections.find(s => (typeof s==='object' ? s.key : '') === k)).filter(Boolean);
              if (imgSections.length === 0) return null;
              return (
                <div className="mb-6 p-5 rounded-[14px]" style={{ background: 'rgba(0,255,255,0.03)', border: '1px solid rgba(0,255,255,0.15)' }}>
                  <div className="flex items-center gap-2 mb-1">
                    <Image size={14} className="text-ak-cyan flex-shrink-0" />
                    <span className="font-inter text-xs font-bold uppercase tracking-widest text-ak-cyan">IMMAGINI DISCIPLINE</span>
                  </div>
                  <p className="font-inter text-[10px] text-white/30 mb-4">
                    Cambia URL immagine · <strong className="text-white/50">Clic sul riquadro immagine</strong> per spostare il punto focale (croce bianca = centro attuale)
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {imgSections.map((s, i) => {
                      const imgKey = imgKeys[i];
                      const posKey = posKeys[i];
                      const label = imgLabels[i];
                      const currentImg = (s.translations || {})[activeLang] || (s.translations || {}).en || '';
                      const posSection = sections.find(sec => (typeof sec==='object' ? sec.key : '') === posKey);
                      const currentPos = posSection ? ((posSection.translations || {})[activeLang] || (posSection.translations || {}).en || '50% 50%') : '50% 50%';

                      // Parse position percentages for the focal point indicator
                      const [px, py] = (currentPos || '50% 50%').split(' ').map(v => parseFloat(v) || 50);

                      const handleFocalClick = (e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
                        const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
                        const newPos = `${x}% ${y}%`;
                        updateSection(posKey, activeLang || 'en', newPos);
                      };

                      return (
                        <div key={imgKey}>
                          {/* Label */}
                          <div className="font-inter text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1.5 truncate">{label}</div>

                          {/* Image with focal point editor */}
                          <div className="relative rounded-[8px] overflow-hidden mb-2 select-none"
                            style={{ height: 100, background: '#111', border: '1px solid rgba(255,255,255,0.1)', cursor: 'crosshair' }}
                            onClick={handleFocalClick}
                            title="Clic per spostare il punto focale">
                            {currentImg ? (
                              <img src={currentImg} alt={label}
                                className="w-full h-full object-cover pointer-events-none"
                                style={{ objectPosition: currentPos }}
                                loading="lazy"
                                onError={e => { e.currentTarget.style.opacity='0'; }} />
                            ) : (
                              <div className="flex items-center justify-center h-full">
                                <Image size={18} className="text-white/15" />
                              </div>
                            )}
                            {/* Focal point crosshair */}
                            {currentImg && (
                              <div className="absolute pointer-events-none"
                                style={{ left: `${px}%`, top: `${py}%`, transform: 'translate(-50%,-50%)', zIndex: 10 }}>
                                {/* Crosshair lines */}
                                <div style={{ position:'absolute', left:'50%', top:'50%', transform:'translate(-50%,-50%)',
                                  width:20, height:20 }}>
                                  <div style={{ position:'absolute', top:'50%', left:0, right:0, height:1,
                                    background:'rgba(255,255,255,0.9)', transform:'translateY(-50%)',
                                    boxShadow:'0 0 2px rgba(0,0,0,0.8)' }} />
                                  <div style={{ position:'absolute', left:'50%', top:0, bottom:0, width:1,
                                    background:'rgba(255,255,255,0.9)', transform:'translateX(-50%)',
                                    boxShadow:'0 0 2px rgba(0,0,0,0.8)' }} />
                                  <div style={{ position:'absolute', top:'50%', left:'50%',
                                    transform:'translate(-50%,-50%)', width:6, height:6,
                                    borderRadius:'50%', background:'#fff',
                                    border:'1.5px solid rgba(0,0,0,0.6)',
                                    boxShadow:'0 0 4px rgba(0,0,0,0.5)' }} />
                                </div>
                              </div>
                            )}
                            {/* Hover overlay hint */}
                            <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"
                              style={{ background:'rgba(0,0,0,0.35)' }}>
                              <span className="font-inter text-[9px] font-bold text-white uppercase tracking-wider">Clic per spostare</span>
                            </div>
                          </div>

                          {/* Position display */}
                          <div className="font-inter text-[9px] text-white/30 mb-1.5 font-mono">{currentPos}</div>

                          {/* URL input */}
                          <input type="url" value={currentImg}
                            onChange={e => updateSection(imgKey, activeLang || 'en', e.target.value)}
                            className="w-full font-mono text-[10px] text-white/70 placeholder-white/20 px-2 py-1.5 rounded-[6px] outline-none focus:border-ak-cyan transition-colors"
                            style={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.1)' }}
                            placeholder="URL immagine..." />
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* Fields */}
            <div className="space-y-3">
              {sections.map(section => {
                const s = typeof section === 'object' ? section : {};
                const key = s.key || '';
                const fieldType = s.field_type || 'text';
                const currentValue = (s.translations || {})[activeLang] || '';
                const enValue = (s.translations || {})['en'] || '';
                const isLong = fieldType === 'richtext';
                const hasAB = abTests[key] && abTests[key].length > 0;
                const isEditingAB = editingAB === key;
                return (
                  <div key={key} className="p-4 rounded-[12px]" style={{ background: '#0a0a0a', border: `1px solid ${hasAB ? 'rgba(167,139,250,0.25)' : 'rgba(255,255,255,0.07)'}` }}>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-inter text-[9px] font-bold uppercase tracking-widest text-ak-cyan">{key}</span>
                      <span className="font-inter text-[9px] text-white/25 border border-white/10 px-1.5 py-0.5 rounded">{fieldTypes[fieldType] || fieldType}</span>
                      {hasAB && <span className="font-inter text-[9px] font-bold text-purple-400 border border-purple-400/30 px-1.5 py-0.5 rounded">A/B {abTests[key].length} variants</span>}
                      {activeLang !== 'en' && enValue && (
                        <span className="font-inter text-[9px] text-white/30 truncate max-w-[160px]" title={enValue}>EN: {enValue.slice(0, 35)}...</span>
                      )}
                      <button onClick={() => setEditingAB(isEditingAB ? null : key)}
                        className={`ml-auto font-inter text-[9px] uppercase px-2 py-0.5 rounded border transition-colors ${isEditingAB ? 'border-purple-400 text-purple-400' : 'border-white/10 text-white/25 hover:text-purple-400 hover:border-purple-400'}`}>
                        {isEditingAB ? 'Done A/B' : 'A/B Test'}
                      </button>
                    </div>
                    {/* Main field input — text, richtext, or image */}
                    {fieldType === 'image' ? (
                      <div className="flex gap-3 items-start">
                        {/* Thumbnail preview */}
                        <div className="flex-shrink-0 w-20 h-14 rounded-[8px] overflow-hidden border border-white/10 relative" style={{ background: '#111' }}>
                          {currentValue ? (
                            <img src={currentValue} alt={key} className="w-full h-full object-cover" loading="lazy"
                              onError={e => { e.currentTarget.style.display='none'; e.currentTarget.nextSibling.style.display='flex'; }} />
                          ) : null}
                          <div className={`absolute inset-0 flex items-center justify-center ${currentValue ? 'hidden' : 'flex'}`}>
                            <Image size={14} className="text-white/20" />
                          </div>
                        </div>
                        <div className="flex-1 space-y-1.5">
                          <input type="url" value={currentValue}
                            onChange={e => updateSection(key, activeLang, e.target.value)}
                            className={`${inp} h-9 text-xs font-mono`} style={inpStyle}
                            placeholder="https://..." />
                          {activeLang !== 'en' && !currentValue && enValue && (
                            <p className="font-inter text-[9px] text-white/30">
                              Lascia vuoto per usare immagine EN. EN: {enValue.slice(0, 60)}...
                            </p>
                          )}
                        </div>
                      </div>
                    ) : isLong ? (
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
                    {/* A/B Editor */}
                    {isEditingAB && (
                      <div className="mt-3 p-3 rounded-[10px]" style={{ background: 'rgba(167,139,250,0.05)', border: '1px solid rgba(167,139,250,0.2)' }}>
                        <div className="font-inter text-[9px] font-bold uppercase tracking-widest text-purple-400 mb-2">A/B VARIANTS (EN base)</div>
                        {(abTests[key] || [{id:'A',text:enValue,weight:50},{id:'B',text:'',weight:50}]).map((v, vi) => (
                          <div key={v.id} className="flex items-center gap-2 mb-2">
                            <span className="font-inter text-[10px] font-bold w-5 text-purple-400">{v.id}</span>
                            <input type="text" value={v.text}
                              onChange={async (e) => {
                                const updated = [...(abTests[key] || [{id:'A',text:enValue,weight:50},{id:'B',text:'',weight:50}])];
                                updated[vi] = { ...updated[vi], text: e.target.value };
                                const newAb = { ...abTests, [key]: updated };
                                setAbTests(newAb);
                                await call('put', `/cms/ab-tests/${selectedPage}`,
                                  Object.entries(newAb).map(([k, variants]) => ({ key: k, variants }))
                                ).catch(() => {});
                              }}
                              className="flex-1 font-inter text-xs text-white placeholder-white/25 px-2 py-1.5 rounded-[8px]"
                              style={{ background: '#111', border: '1px solid rgba(167,139,250,0.2)' }}
                              placeholder={`Variant ${v.id} text`} />
                            <input type="number" value={v.weight} min={1} max={99}
                              onChange={async (e) => {
                                const updated = [...(abTests[key] || [])];
                                updated[vi] = { ...updated[vi], weight: parseInt(e.target.value) || 50 };
                                const newAb = { ...abTests, [key]: updated };
                                setAbTests(newAb);
                                await call('put', `/cms/ab-tests/${selectedPage}`,
                                  Object.entries(newAb).map(([k, variants]) => ({ key: k, variants }))
                                ).catch(() => {});
                              }}
                              className="w-14 font-inter text-xs text-white px-2 py-1.5 rounded-[8px] text-center"
                              style={{ background: '#111', border: '1px solid rgba(167,139,250,0.2)' }} />
                            <span className="font-inter text-[9px] text-white/30">%</span>
                          </div>
                        ))}
                        {!(abTests[key]) && (
                          <button onClick={async () => {
                            const variants = [{id:'A',text:enValue,weight:50},{id:'B',text:'',weight:50}];
                            const newAb = { ...abTests, [key]: variants };
                            setAbTests(newAb);
                            await call('put', `/cms/ab-tests/${selectedPage}`,
                              Object.entries(newAb).map(([k, v]) => ({ key: k, variants: v }))
                            ).catch(() => {});
                          }} className="font-inter text-[10px] text-purple-400 hover:underline">
                            + Create A/B test for this key
                          </button>
                        )}
                      </div>
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

/* ─── A/B TEST RESULTS ─── */
function ABTestResults({ call }) {
  const [data, setData] = useState({});

  useEffect(() => {
    // Load AB analytics for all pages that have tests
    Promise.all(
      ['homepage', 'get-the-app', 'for-athletes', 'gym-pilot', 'arena-system'].map(slug =>
        call('get', `/cms/ab-analytics/${slug}`)
          .then(d => d.length > 0 ? { slug, tests: d } : null)
          .catch(() => null)
      )
    ).then(results => {
      const r = {};
      results.filter(Boolean).forEach(({ slug, tests }) => { if (tests.length) r[slug] = tests; });
      setData(r);
    });
  }, [call]);

  if (Object.keys(data).length === 0) return null;

  return (
    <div className="p-5 rounded-[14px] mb-6" style={{ background: '#0a0a0a', border: '1px solid rgba(167,139,250,0.2)' }}>
      <div className="font-inter text-[10px] font-bold uppercase tracking-widest text-purple-400 mb-4">A/B TEST RESULTS</div>
      {Object.entries(data).map(([slug, tests]) => (
        <div key={slug} className="mb-5">
          <div className="font-inter text-xs font-semibold text-white mb-2">/{slug}</div>
          {tests.map(test => (
            <div key={test.key} className="mb-3">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-inter text-[10px] font-bold text-ak-cyan">{test.key}</span>
                <span className="font-inter text-[9px] text-white/30">{test.total_clicks} total clicks</span>
              </div>
              <div className="flex gap-2">
                {test.variants.map(v => (
                  <div key={v.variant_id} className="flex-1 p-2.5 rounded-[8px] text-center"
                    style={{ background: '#111', border: '1px solid rgba(167,139,250,0.15)' }}>
                    <div className="font-anton text-xl text-purple-400">{v.variant_id}</div>
                    <div className="font-inter text-sm font-bold text-white">{v.clicks}</div>
                    <div className="font-inter text-[9px] text-white/40">clicks</div>
                    <div className="mt-1.5 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <div className="h-full rounded-full" style={{ width: `${v.pct}%`, background: '#a78bfa' }} />
                    </div>
                    <div className="font-inter text-[9px] text-purple-400 mt-1">{v.pct}%</div>
                  </div>
                ))}
              </div>
              {test.variants.length >= 2 && test.total_clicks > 0 && (
                <div className="font-inter text-[9px] mt-1" style={{ color: '#a78bfa' }}>
                  Winner: Variant <strong>{test.variants.reduce((a, b) => a.clicks > b.clicks ? a : b).variant_id}</strong> (+{Math.abs(test.variants[0].pct - (test.variants[1]?.pct || 0))}% more clicks)
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ─── ANALYTICS DASHBOARD ─── */
function AnalyticsDashboard({ call }) {
  const [summary, setSummary]   = useState([]);
  const [recent, setRecent]     = useState([]);
  const [ctaStats, setCtaStats] = useState([]);
  const [convStats, setConvStats] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [lastRefresh, setLastRefresh] = useState(null);

  const load = useCallback(async () => {
    try {
      const [sum, rec, cta, conv] = await Promise.all([
        call('get', '/events/summary'),
        call('get', '/events/recent'),
        call('get', '/cms/cta-analytics').catch(() => []),
        call('get', '/cms/conversion-analytics').catch(() => []),
      ]);
      setSummary(sum || []);
      setRecent(rec || []);
      setCtaStats(cta || []);
      setConvStats(conv || []);
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


          {/* CTA Performance */}
          {ctaStats.length > 0 && (
            <div className="p-5 rounded-[14px] mb-6" style={{ background: '#0a0a0a', border: '1px solid rgba(255,215,0,0.15)' }}>
              <div className="font-inter text-[10px] font-bold uppercase tracking-widest text-ak-gold mb-4">CTA PERFORMANCE (by CMS key)</div>
              <div className="space-y-2">
                {ctaStats.slice(0, 10).map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="font-inter text-[10px] font-bold w-4 text-white/40 text-right">{i+1}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span className="font-inter text-xs font-semibold text-white truncate">{item.text || item.key}</span>
                        <span className="font-inter text-[9px] text-ak-cyan border border-ak-cyan/20 px-1 rounded">{item.key}</span>
                        {item.position && <span className="font-inter text-[9px] text-purple-400 border border-purple-400/20 px-1 rounded">📍 {item.position}</span>}
                        <span className="font-inter text-[9px] text-white/30">{item.language?.toUpperCase()} · {item.page}</span>
                      </div>
                      <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,215,0,0.08)' }}>
                        <div className="h-full rounded-full" style={{ width: `${(item.clicks / (ctaStats[0]?.clicks || 1)) * 100}%`, background: '#FFD700' }} />
                      </div>
                    </div>
                    <div className="font-inter text-sm font-bold flex-shrink-0 text-ak-gold">{item.clicks}</div>
                  </div>
                ))}
              </div>
            </div>
          )}


          {/* Recent events */}

          {/* CTA → Conversion Funnel */}
          {convStats.length > 0 && (
            <div className="p-5 rounded-[14px] mb-6" style={{ background: '#0a0a0a', border: '1px solid rgba(52,211,153,0.15)' }}>
              <div className="font-inter text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: '#34d399' }}>CTA → CONVERSION FUNNEL</div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      {['CTA Key', 'Page', 'Position', 'Clicks', 'Conversions', 'Conv. Rate'].map(h => (
                        <th key={h} className="text-left pb-2 pr-4 font-inter text-[9px] font-bold uppercase tracking-widest text-white/30">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {convStats.slice(0, 10).map((row, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                        <td className="py-2 pr-4 font-inter text-[10px] font-bold text-ak-cyan">{row.key}</td>
                        <td className="py-2 pr-4 font-inter text-[10px] text-white/50">{row.page || '—'}</td>
                        <td className="py-2 pr-4">
                          {row.position ? <span className="font-inter text-[9px] text-purple-400 border border-purple-400/20 px-1.5 py-0.5 rounded">{row.position}</span> : <span className="text-white/20">—</span>}
                        </td>
                        <td className="py-2 pr-4 font-inter text-sm font-bold text-white">{row.clicks || 0}</td>
                        <td className="py-2 pr-4 font-inter text-sm font-bold" style={{ color: '#34d399' }}>{row.conversions || 0}</td>
                        <td className="py-2 font-inter text-sm font-bold">
                          <span style={{ color: row.conversion_rate >= 10 ? '#34d399' : row.conversion_rate >= 3 ? '#FFD700' : '#a1a1aa' }}>
                            {row.conversion_rate > 0 ? `${row.conversion_rate}%` : '—'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}


          {/* A/B Test Results — show inline if any data */}
          <ABTestResults call={call} />


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

/* ─── BLOG MANAGER (Multilingual) ─── */
const BLOG_LANGS = [
  { code: 'en', label: 'EN', flag: '🌍', name: 'English' },
  { code: 'it', label: 'IT', flag: '🇮🇹', name: 'Italian' },
  { code: 'es', label: 'ES', flag: '🇪🇸', name: 'Spanish' },
];
const EMPTY_TRANS = { slug: '', title: '', seo_title: '', meta_description: '', excerpt: '', content: '' };

function BlogManager({ call }) {
  const [posts, setPosts]           = useState([]);
  const [editing, setEditing]       = useState(null);
  const [form, setForm]             = useState({});
  const [activeLang, setActiveLang] = useState('en');
  const [saving, setSaving]         = useState(false);
  const [translating, setTranslating] = useState('');
  const [msg, setMsg]               = useState('');

  const load = useCallback(() => call('get', '/blog').then(setPosts).catch(() => {}), [call]);
  useEffect(() => { load(); }, [load]);

  const newForm = {
    slug: '', title: '', seo_title: '', meta_description: '',
    category: 'General', read_time: '5 min read',
    date: new Date().toLocaleDateString('it-IT', { month: 'long', year: 'numeric' }),
    excerpt: '', content: '', featured_image: '', published: true,
    translations: { it: { ...EMPTY_TRANS }, es: { ...EMPTY_TRANS } },
  };

  const startEdit = (post) => {
    setEditing(post);
    setForm({
      ...post,
      translations: {
        it: { ...EMPTY_TRANS, ...(post.translations?.it || {}) },
        es: { ...EMPTY_TRANS, ...(post.translations?.es || {}) },
      },
    });
    setActiveLang('en'); setMsg('');
  };
  const startNew = () => { setEditing('new'); setForm({ ...newForm }); setActiveLang('en'); setMsg(''); };

  const getField = (field) => {
    if (activeLang === 'en') return form[field] || '';
    return form.translations?.[activeLang]?.[field] || '';
  };
  const setField = (field, val) => {
    if (activeLang === 'en') {
      setForm(prev => ({ ...prev, [field]: val }));
    } else {
      setForm(prev => ({
        ...prev,
        translations: { ...prev.translations, [activeLang]: { ...prev.translations?.[activeLang], [field]: val } },
      }));
    }
  };

  const langComplete = (lang) => {
    const fields = ['title', 'seo_title', 'meta_description', 'excerpt', 'content'];
    const src = lang === 'en' ? form : (form.translations?.[lang] || {});
    return fields.filter(f => (src[f] || '').trim()).length;
  };

  const aiTranslate = async (langCode, langName) => {
    if (!editing || editing === 'new') { setMsg('Salva prima l\'articolo per usare AI Translate'); return; }
    setTranslating(langCode); setMsg('');
    try {
      const r = await call('post', `/blog/${editing.id}/translate`, { target_lang: langCode, target_lang_name: langName });
      setMsg(`✓ ${r.translated} campi tradotti in ${langCode.toUpperCase()} con AI`);
      const updated = await call('get', `/blog/${editing.slug}`).catch(() => null);
      if (updated?.translations) {
        setForm(prev => ({
          ...prev,
          translations: {
            it: { ...EMPTY_TRANS, ...(updated.translations.it || {}) },
            es: { ...EMPTY_TRANS, ...(updated.translations.es || {}) },
          },
        }));
      }
    } catch (e) { setMsg(e?.response?.data?.detail || 'Errore traduzione AI'); }
    finally { setTranslating(''); }
  };

  const save = async () => {
    setSaving(true); setMsg('');
    try {
      if (editing === 'new') { await call('post', '/blog', form); }
      else { await call('put', `/blog/${editing.id}`, form); }
      setMsg('Salvato!'); load(); setTimeout(() => setEditing(null), 800);
    } catch (e) { setMsg(e?.response?.data?.detail || 'Errore'); }
    finally { setSaving(false); }
  };

  const del = async (post) => {
    if (!window.confirm(`Eliminare "${post.title}"?`)) return;
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
        }).catch(() => {});
      }
      load(); setMsg('Articoli demo importati!');
    } finally { setSaving(false); }
  };

  const inp = "w-full font-inter text-sm text-white placeholder-white/30 px-3 py-2.5 rounded-[10px] outline-none focus:border-ak-cyan transition-colors";
  const inpStyle = { background: '#111', border: '1px solid rgba(255,255,255,0.12)' };

  if (editing !== null) {
    const isNew = editing === 'new';
    const langName = BLOG_LANGS.find(l => l.code === activeLang)?.name || activeLang;
    return (
      <div>
        <button onClick={() => setEditing(null)} className="flex items-center gap-2 font-inter text-xs text-white/50 hover:text-white mb-5 transition-colors">
          <ArrowLeft size={14} /> Torna alla lista
        </button>
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h2 className="font-anton text-2xl uppercase text-white">{isNew ? 'NUOVO ARTICOLO' : 'MODIFICA ARTICOLO'}</h2>
          {!isNew && (
            <div className="flex items-center gap-2">
              {BLOG_LANGS.filter(l => l.code !== 'en').map(l => (
                <button key={l.code} onClick={() => aiTranslate(l.code, l.name)} disabled={!!translating}
                  className="inline-flex items-center gap-1.5 font-inter text-[10px] font-bold uppercase tracking-wider px-3 py-2 rounded-[8px] border transition-all disabled:opacity-40"
                  style={{
                    borderColor: translating === l.code ? '#FFD700' : 'rgba(255,215,0,0.3)',
                    color: translating === l.code ? '#FFD700' : 'rgba(255,215,0,0.7)',
                    background: translating === l.code ? 'rgba(255,215,0,0.08)' : 'transparent',
                  }}>
                  <Sparkles size={10} />
                  {translating === l.code ? `AI ${l.label}...` : `AI → ${l.label}`}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="max-w-3xl space-y-5">
          {/* ── LANGUAGE TABS ── */}
          <div className="rounded-[12px] overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="flex" style={{ background: '#0a0a0a', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              {BLOG_LANGS.map(l => {
                const filled = langComplete(l.code);
                const pct = Math.round((filled / 5) * 100);
                const isAct = activeLang === l.code;
                return (
                  <button key={l.code} onClick={() => setActiveLang(l.code)}
                    className="flex-1 flex flex-col items-center gap-1 px-4 py-3 transition-all"
                    style={{
                      borderBottom: isAct ? '2px solid #00FFFF' : '2px solid transparent',
                      color: isAct ? '#00FFFF' : 'rgba(255,255,255,0.4)',
                      background: isAct ? 'rgba(0,255,255,0.05)' : 'transparent',
                    }}>
                    <div className="flex items-center gap-1.5">
                      <span style={{ fontSize: 13 }}>{l.flag}</span>
                      <span className="font-inter text-xs font-bold uppercase tracking-wider">{l.label}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="rounded-full overflow-hidden" style={{ width: 36, height: 3, background: 'rgba(255,255,255,0.1)' }}>
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: pct === 100 ? '#34d399' : pct > 0 ? '#FFD700' : 'transparent', transition: 'width .3s' }} />
                      </div>
                      <span className="font-inter text-[9px]" style={{ color: pct === 100 ? '#34d399' : 'rgba(255,255,255,0.25)' }}>{filled}/5</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="p-5 space-y-4">
              {activeLang !== 'en' && (
                <div className="flex items-center gap-3 p-3 rounded-[8px]" style={{ background: 'rgba(255,215,0,0.05)', border: '1px solid rgba(255,215,0,0.12)' }}>
                  <Sparkles size={12} style={{ color: '#FFD700', flexShrink: 0 }} />
                  <span className="font-inter text-xs text-white/50">
                    Versione <strong className="text-ak-gold">{activeLang.toUpperCase()}</strong>.
                    {!isNew && <> Usa <strong className="text-ak-gold">AI → {activeLang.toUpperCase()}</strong> per tradurre automaticamente dall&apos;EN.</>}
                  </span>
                </div>
              )}

              {/* Slug */}
              <div>
                <label className="font-inter text-xs text-white/50 uppercase tracking-wider block mb-1">
                  Slug {activeLang.toUpperCase()} {activeLang === 'en' ? '* (URL base)' : '(per SEO hreflang)'}
                </label>
                <input className={inp} style={inpStyle}
                  value={activeLang === 'en' ? (form.slug || '') : getField('slug')}
                  onChange={e => activeLang === 'en' ? setForm({...form, slug: e.target.value}) : setField('slug', e.target.value)}
                  placeholder={activeLang === 'en' ? 'url-articolo-en' : `url-articolo-${activeLang}`} />
              </div>

              {/* Title */}
              <div>
                <label className="font-inter text-xs text-white/50 uppercase tracking-wider block mb-1">Titolo {activeLang.toUpperCase()} *</label>
                <input className={inp} style={inpStyle}
                  value={getField('title')} onChange={e => setField('title', e.target.value)}
                  placeholder={`Titolo articolo in ${langName}...`} />
              </div>

              {/* SEO Title */}
              <div>
                <label className="font-inter text-xs text-white/50 uppercase tracking-wider block mb-1">
                  SEO Title {activeLang.toUpperCase()}
                  {getField('seo_title') && (
                    <span className={`ml-2 font-normal ${getField('seo_title').length > 60 ? 'text-red-400' : 'text-white/25'}`}>
                      {getField('seo_title').length}/60
                    </span>
                  )}
                </label>
                <input className={inp} style={inpStyle}
                  value={getField('seo_title')} onChange={e => setField('seo_title', e.target.value)}
                  placeholder={`SEO Title in ${langName} (max 60 char)...`} />
              </div>

              {/* Meta Description */}
              <div>
                <label className="font-inter text-xs text-white/50 uppercase tracking-wider block mb-1">
                  Meta Description {activeLang.toUpperCase()}
                  {getField('meta_description') && (
                    <span className={`ml-2 font-normal ${getField('meta_description').length > 155 ? 'text-red-400' : 'text-white/25'}`}>
                      {getField('meta_description').length}/155
                    </span>
                  )}
                </label>
                <textarea className={`${inp} resize-none`} style={inpStyle} rows={2}
                  value={getField('meta_description')} onChange={e => setField('meta_description', e.target.value)}
                  placeholder={`Meta description in ${langName} (max 155 char)...`} />
              </div>

              {/* Excerpt */}
              <div>
                <label className="font-inter text-xs text-white/50 uppercase tracking-wider block mb-1">Excerpt {activeLang.toUpperCase()}</label>
                <textarea className={`${inp} resize-none`} style={inpStyle} rows={2}
                  value={getField('excerpt')} onChange={e => setField('excerpt', e.target.value)}
                  placeholder={`Anteprima breve in ${langName}...`} />
              </div>

              {/* Content */}
              <div>
                <label className="font-inter text-xs text-white/50 uppercase tracking-wider block mb-1">
                  Contenuto {activeLang.toUpperCase()} <span className="text-white/20 normal-case ml-1">(Markdown)</span>
                </label>
                <textarea className={`${inp} resize-y font-mono text-xs`}
                  style={{ ...inpStyle, minHeight: '280px' }}
                  value={getField('content')} onChange={e => setField('content', e.target.value)}
                  placeholder={`## Titolo\n\nContenuto in ${langName}...`} />
              </div>
            </div>
          </div>

          {/* ── CAMPI COMUNI ── */}
          <div className="p-5 rounded-[12px] space-y-4" style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="font-inter text-[10px] font-bold uppercase tracking-widest text-white/30">Campi comuni (tutte le lingue)</div>
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
              <label className="font-inter text-xs text-white/50 uppercase tracking-wider block mb-1">Immagine di copertina (URL)</label>
              <input className={inp} style={inpStyle} value={form.featured_image||''} onChange={e => setForm({...form,featured_image:e.target.value})} placeholder="https://..." />
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="pub" checked={form.published||false} onChange={e => setForm({...form,published:e.target.checked})} className="w-4 h-4 accent-yellow-400" />
              <label htmlFor="pub" className="font-inter text-sm text-white">Pubblicato</label>
            </div>
          </div>

          {/* ── SAVE ── */}
          <div className="flex items-center gap-4 pt-1">
            <button onClick={save} disabled={saving}
              className="inline-flex items-center gap-2 font-inter font-bold uppercase text-sm px-8 rounded-[12px] bg-ak-gold text-black disabled:opacity-60 hover:scale-[1.02] transition-transform"
              style={{ height: '46px' }}>
              <Save size={16} /> {saving ? 'Salvataggio...' : 'Salva Articolo'}
            </button>
            {msg && (
              <span className={`font-inter text-xs font-semibold ${msg.startsWith('✓') || msg === 'Salvato!' ? 'text-ak-cyan' : 'text-red-400'}`}>{msg}</span>
            )}
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
              Importa Demo
            </button>
          )}
          <button onClick={startNew} data-testid="blog-new-btn"
            className="inline-flex items-center gap-2 font-inter font-bold text-xs uppercase tracking-wider px-4 rounded-[10px] bg-ak-gold text-black hover:scale-105 transition-transform"
            style={{ height: '36px' }}>
            <Plus size={14} /> Nuovo Articolo
          </button>
        </div>
      </div>
      {posts.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-white/15 rounded-[14px]">
          <BookOpen size={32} className="text-white/20 mx-auto mb-3" />
          <p className="font-inter text-sm text-white/40">Nessun articolo. Crea il primo o importa i demo.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map(post => (
            <div key={post.id} className="flex items-center justify-between p-4 rounded-[12px]" style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-center gap-4 min-w-0">
                {post.featured_image && <img src={post.featured_image} alt="" className="w-12 h-12 object-cover rounded-[8px] flex-shrink-0" loading="lazy" />}
                <div className="min-w-0">
                  <div className="font-inter text-sm font-semibold text-white truncate">{post.title}</div>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="font-inter text-[10px] text-ak-cyan">{post.category}</span>
                    <span className="font-inter text-[10px] text-white/40">/{post.slug}</span>
                    {!post.published && <span className="font-inter text-[10px] text-yellow-500">Bozza</span>}
                    {BLOG_LANGS.filter(l => l.code !== 'en').map(l => {
                      const has = post.translations?.[l.code]?.title;
                      return (
                        <span key={l.code} className="font-inter text-[9px] font-bold px-1.5 py-0.5 rounded"
                          style={{
                            background: has ? 'rgba(52,211,153,0.1)' : 'rgba(255,255,255,0.04)',
                            color: has ? '#34d399' : 'rgba(255,255,255,0.2)',
                            border: `1px solid ${has ? 'rgba(52,211,153,0.2)' : 'rgba(255,255,255,0.06)'}`,
                          }}>
                          {l.flag} {l.label}
                        </span>
                      );
                    })}
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

/* ─── NAV MANAGER ─── */
const ALL_PAGES = [
  { key: 'home',         href: '/',                     labels: { en: 'Home',                  it: 'Home',                    es: 'Inicio' } },
  { key: 'arenaSystem',  href: '/arena-system',         labels: { en: 'Arena System',          it: 'Arena System',            es: 'Sistema Arena' } },
  { key: 'athletes',     href: '/for-athletes',         labels: { en: 'Athletes',              it: 'Atleti',                  es: 'Atletas' } },
  { key: 'competition',  href: '/competition',          labels: { en: 'Competition',           it: 'Competizione',            es: 'Competición' } },
  { key: 'amrap',        href: '/amrap',                labels: { en: 'AMRAP',                 it: 'AMRAP',                   es: 'AMRAP' } },
  { key: 'crossfit',     href: '/crossfit',             labels: { en: 'CrossFit',              it: 'CrossFit',                es: 'CrossFit' } },
  { key: 'gamification', href: '/gamification',         labels: { en: 'Gamification',          it: 'Gamification',            es: 'Gamificación' } },
  { key: 'gyms',         href: '/for-gyms-and-coaches', labels: { en: 'Business',              it: 'Business',                es: 'Business' } },
  { key: 'arenaMatches', href: '/arena-matches',        labels: { en: 'Arena Matches',         it: 'Arena Matches',           es: 'Arena Matches' } },
  { key: 'blog',         href: '/blog',                 labels: { en: 'Blog',                  it: 'Blog',                    es: 'Blog' } },
  { key: 'app',          href: '/get-the-app',          labels: { en: 'Get the App',           it: 'Scarica App',             es: 'Descargar App' } },
  { key: 'fitnessApp',   href: '/fitness-challenge-app',labels: { en: 'Fitness Challenge App', it: 'Fitness Challenge App',   es: 'Fitness Challenge App' } },
  { key: 'support',      href: '/support',              labels: { en: 'Support',               it: 'Supporto',                es: 'Soporte' } },
];

// Module-level drag source — persists across all React renders and browser events
let _dragSrc = null;

function NavManager({ call }) {
  const [topNav, setTopNav]       = useState([]);
  const [bottomNav, setBottomNav] = useState([]);
  const [saving, setSaving]       = useState(false);
  const [msg, setMsg]             = useState('');
  const [editItem, setEditItem]   = useState(null);
  const [dropTarget, setDropTarget] = useState(null); // visual feedback only

  const inp = "w-full font-inter text-sm text-white placeholder-white/30 px-2.5 py-1.5 rounded-[8px] outline-none focus:border-ak-cyan";
  const inpStyle = { background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.12)' };

  const load = useCallback(async () => {
    try {
      const r = await call('get', '/nav/config/full');
      setTopNav((r.top_nav || []).sort((a, b) => a.order - b.order));
      setBottomNav((r.bottom_nav || []).sort((a, b) => a.order - b.order));
    } catch {}
  }, [call]);
  useEffect(() => { load(); }, [load]);

  const save = async () => {
    setSaving(true); setMsg('');
    try {
      const payload = {
        top_nav:    topNav.map((item, i) => ({ ...item, order: i })),
        bottom_nav: bottomNav.map((item, i) => ({ ...item, order: i })),
      };
      await call('put', '/nav/config', payload);
      setMsg('✓ Salvato! Le modifiche sono live.');
      // Reload from DB to confirm saved state
      await load();
    } catch (e) {
      setMsg(e?.response?.data?.detail || 'Errore salvataggio — riprova');
    } finally { setSaving(false); }
  };

  /* ── Helpers ── */
  const getList  = (zone) => zone === 'top' ? topNav : bottomNav;
  const setList  = (zone) => zone === 'top' ? setTopNav : setBottomNav;
  const cloneList = (zone) => [...(zone === 'top' ? topNav : bottomNav)];

  const toggleActive = (zone, idx) =>
    setList(zone)(prev => prev.map((it, i) => i === idx ? { ...it, active: !it.active } : it));

  const removeItem = (zone, idx) =>
    setList(zone)(prev => prev.filter((_, i) => i !== idx));

  const updateLabel = (zone, idx, lang, val) =>
    setList(zone)(prev => prev.map((it, i) => i === idx ? { ...it, labels: { ...it.labels, [lang]: val } } : it));

  const addPage = (page, zone) =>
    setList(zone)(prev => [...prev, { ...page, active: true, order: prev.length }]);

  /* ── Drag & Drop — uses module-level _dragSrc for reliability ── */
  const onDragStart = (e, zone, idx) => {
    _dragSrc = { zone, idx };
    e.dataTransfer.effectAllowed = 'move';
    // Store as string for cross-browser compatibility
    e.dataTransfer.setData('text/plain', `${zone}::${idx}`);
    e.currentTarget.style.opacity = '0.4';
  };

  const onDragEnd = (e) => {
    e.currentTarget.style.opacity = '';
    setDropTarget(null);
    // Don't clear _dragSrc here — drop fires after dragend in some browsers
  };

  const onDragOver = (e, zone, idx) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDropTarget({ zone, idx });
  };

  const onDrop = (e, toZone, toIdx) => {
    e.preventDefault();
    e.stopPropagation();
    setDropTarget(null);

    // Read drag source (dataTransfer is most reliable)
    let src = _dragSrc;
    try {
      const raw = e.dataTransfer.getData('text/plain');
      if (raw && raw.includes('::')) {
        const [z, i] = raw.split('::');
        src = { zone: z, idx: parseInt(i, 10) };
      }
    } catch {}
    _dragSrc = null;

    if (!src) return;
    const { zone: fromZone, idx: fromIdx } = src;

    if (fromZone === toZone) {
      // ── Reorder within same column ──
      if (fromIdx === toIdx) return;
      const arr = cloneList(fromZone);
      const [item] = arr.splice(fromIdx, 1);
      arr.splice(toIdx > fromIdx ? toIdx - 1 : toIdx, 0, item);
      setList(fromZone)(arr.map((it, i) => ({ ...it, order: i })));
    } else {
      // ── Move between columns ──
      const srcArr = cloneList(fromZone);
      const dstArr = cloneList(toZone);
      const [item] = srcArr.splice(fromIdx, 1);
      dstArr.splice(toIdx, 0, item);
      setList(fromZone)(srcArr.map((it, i) => ({ ...it, order: i })));
      setList(toZone)(dstArr.map((it, i) => ({ ...it, order: i })));
    }
  };

  const onDropZone = (e, zone) => {
    // Dropped on empty zone area (append to end)
    onDrop(e, zone, getList(zone).length);
  };

  /* ── Render item ── */
  const renderItem = (item, zone, idx) => {
    const isEditing = editItem?.zone === zone && editItem?.idx === idx;
    const isOver    = dropTarget?.zone === zone && dropTarget?.idx === idx;
    return (
      <div key={`${zone}-${item.key}`}
        draggable={!isEditing}
        onDragStart={e => onDragStart(e, zone, idx)}
        onDragEnd={onDragEnd}
        onDragOver={e => onDragOver(e, zone, idx)}
        onDrop={e => onDrop(e, zone, idx)}
        style={{
          background: isOver ? 'rgba(0,255,255,0.07)' : '#0a0a0a',
          border: `1px solid ${isOver ? 'rgba(0,255,255,0.5)' : 'rgba(255,255,255,0.08)'}`,
          borderRadius: 10, padding: '10px 12px',
          marginBottom: 6,
          display: 'flex', alignItems: 'flex-start', gap: 8,
          cursor: isEditing ? 'default' : 'grab',
          opacity: item.active === false ? 0.4 : 1,
          transition: 'border-color .15s, background .15s',
          boxShadow: isOver ? '0 0 0 2px rgba(0,255,255,0.15)' : 'none',
        }}>

        {/* Drag handle */}
        <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 16, flexShrink: 0, marginTop: 1, cursor: 'grab', userSelect: 'none' }}
          title="Trascina">⠿</span>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {isEditing ? (
            <div>
              {['en','it','es'].map(l => (
                <div key={l} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                  <span style={{ fontFamily:'monospace', fontSize:10, color:'rgba(255,255,255,0.35)', width:16, flexShrink:0 }}>{l}</span>
                  <input className={inp} style={inpStyle}
                    value={item.labels?.[l] || ''}
                    onChange={e => updateLabel(zone, idx, l, e.target.value)}
                    placeholder={`Etichetta ${l.toUpperCase()}`} />
                </div>
              ))}
              <button onClick={() => setEditItem(null)}
                style={{ fontFamily:'Inter,sans-serif', fontSize:10, color:'#00FFFF', marginTop:4, cursor:'pointer', background:'none', border:'none' }}>
                ✓ Fatto
              </button>
            </div>
          ) : (
            <div>
              <div style={{ fontFamily:'Inter,sans-serif', fontWeight:600, fontSize:14, color:'#fff', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                {item.labels?.en || item.key}
              </div>
              <div style={{ display:'flex', gap:8, marginTop:2, flexWrap:'wrap' }}>
                <span style={{ fontFamily:'Inter,sans-serif', fontSize:10, color:'rgba(255,255,255,0.3)' }}>{item.href}</span>
                {item.labels?.it && <span style={{ fontFamily:'Inter,sans-serif', fontSize:9, color:'rgba(255,255,255,0.22)' }}>IT: {item.labels.it}</span>}
                {item.labels?.es && <span style={{ fontFamily:'Inter,sans-serif', fontSize:9, color:'rgba(255,255,255,0.22)' }}>ES: {item.labels.es}</span>}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        {!isEditing && (
          <div style={{ display:'flex', alignItems:'center', gap:4, flexShrink:0 }}>
            <button onClick={() => toggleActive(zone, idx)}
              title={item.active === false ? 'Rendi visibile' : 'Nascondi'}
              style={{ background:'none', border:'none', cursor:'pointer', fontSize:13, color: item.active === false ? 'rgba(255,255,255,0.2)' : '#00FFFF', padding:'2px 3px' }}>
              {item.active === false ? '○' : '●'}
            </button>
            <button onClick={() => setEditItem({ zone, idx })} title="Modifica etichette"
              style={{ background:'none', border:'none', cursor:'pointer', padding:'2px 3px', color:'rgba(255,255,255,0.3)' }}>
              <Pencil size={12} />
            </button>
            <button onClick={() => removeItem(zone, idx)} title="Rimuovi"
              style={{ background:'none', border:'none', cursor:'pointer', padding:'2px 3px', color:'rgba(255,255,255,0.3)' }}>
              <X size={12} />
            </button>
          </div>
        )}
      </div>
    );
  };

  const topKeys    = new Set(topNav.map(i => i.key));
  const bottomKeys = new Set(bottomNav.map(i => i.key));

  const ColumnHeader = ({ zone, items, color, title, hint }) => (
    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
      <div style={{ width:8, height:8, borderRadius:'50%', background:color, flexShrink:0 }} />
      <span style={{ fontFamily:'"Anton","Arial Black",sans-serif', fontSize:14, color:'#fff', letterSpacing:'0.08em', textTransform:'uppercase' }}>{title}</span>
      <span style={{ fontFamily:'Inter,sans-serif', fontSize:10, color:'rgba(255,255,255,0.3)' }}>
        {items.filter(i => i.active !== false).length}/{items.length} visibili
      </span>
      <span style={{ fontFamily:'Inter,sans-serif', fontSize:9, color:'rgba(255,255,255,0.18)', flex:1 }}>{hint}</span>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:24, flexWrap:'wrap', gap:12 }}>
        <div>
          <h2 className="font-anton text-2xl uppercase text-white mb-1">NAVIGATION MANAGER</h2>
          <p style={{ fontFamily:'Inter,sans-serif', fontSize:12, color:'#a1a1aa', maxWidth:560 }}>
            <strong style={{ color:'rgba(255,255,255,0.6)' }}>Come usarlo:</strong>{' '}
            Trascina il simbolo <strong style={{ color:'#fff' }}>⠿</strong> per riordinare o spostare tra i menù.
            Usa <strong style={{ color:'#00FFFF' }}>●</strong> per nascondere, <strong style={{ color:'#FFD700' }}>✏</strong> per cambiare etichetta,
            <strong style={{ color:'#ff4444' }}> ×</strong> per rimuovere.
          </p>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          {msg && <span style={{ fontFamily:'Inter,sans-serif', fontSize:12, fontWeight:600, color: msg.startsWith('✓') ? '#00FFFF' : '#f87171', maxWidth:280 }}>{msg}</span>}
          <button onClick={save} disabled={saving}
            className="inline-flex items-center gap-2 font-inter font-bold uppercase text-sm px-8 rounded-[12px] bg-ak-gold text-black disabled:opacity-60 hover:scale-[1.02] transition-transform"
            style={{ height:44 }}>
            <Save size={15} /> {saving ? 'Salvataggio...' : 'Salva Menù'}
          </button>
        </div>
      </div>

      {/* Two columns */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24, marginBottom:32 }}>
        {/* Top Nav */}
        <div>
          <ColumnHeader zone="top" items={topNav} color="#00FFFF" title="Menù Top (Navbar)" hint="— barra di navigazione in alto" />
          <div onDragOver={e => { e.preventDefault(); setDropTarget({ zone:'top', idx:-1 }); }}
               onDrop={e => onDropZone(e, 'top')}
               style={{ minHeight:80, borderRadius:12, padding:8,
                 background:'rgba(255,255,255,0.015)', border:'1px dashed rgba(255,255,255,0.08)' }}>
            {topNav.length === 0 && (
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:60, fontFamily:'Inter,sans-serif', fontSize:12, color:'rgba(255,255,255,0.2)', fontStyle:'italic' }}>
                Trascina qui o usa i pulsanti sotto
              </div>
            )}
            {topNav.map((item, i) => renderItem(item, 'top', i))}
          </div>
        </div>

        {/* Bottom Nav */}
        <div>
          <ColumnHeader zone="bottom" items={bottomNav} color="#FFD700" title="Menù Bottom (Footer)" hint="— footer del sito" />
          <div onDragOver={e => { e.preventDefault(); setDropTarget({ zone:'bottom', idx:-1 }); }}
               onDrop={e => onDropZone(e, 'bottom')}
               style={{ minHeight:80, borderRadius:12, padding:8,
                 background:'rgba(255,255,255,0.015)', border:'1px dashed rgba(255,255,255,0.08)' }}>
            {bottomNav.length === 0 && (
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:60, fontFamily:'Inter,sans-serif', fontSize:12, color:'rgba(255,255,255,0.2)', fontStyle:'italic' }}>
                Trascina qui o usa i pulsanti sotto
              </div>
            )}
            {bottomNav.map((item, i) => renderItem(item, 'bottom', i))}
          </div>
        </div>
      </div>

      {/* Pool — all pages with add buttons */}
      <div style={{ borderRadius:14, overflow:'hidden', border:'1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ padding:'12px 20px', background:'#0a0a0a', borderBottom:'1px solid rgba(255,255,255,0.06)',
          display:'flex', alignItems:'center', gap:8 }}>
          <Plus size={14} color="#00FFFF" />
          <span style={{ fontFamily:'"Anton","Arial Black",sans-serif', fontSize:13, color:'#fff', textTransform:'uppercase', letterSpacing:'0.08em' }}>
            Aggiungi voce al menù
          </span>
          <span style={{ fontFamily:'Inter,sans-serif', fontSize:10, color:'rgba(255,255,255,0.3)' }}>
            — clicca TOP o BOTTOM per aggiungere
          </span>
        </div>
        <div style={{ padding:16 }}>
          {ALL_PAGES.map(page => {
            const inTop    = topKeys.has(page.key);
            const inBottom = bottomKeys.has(page.key);
            return (
              <div key={page.key} style={{
                display:'flex', alignItems:'center', justifyContent:'space-between',
                padding:'10px 12px', marginBottom:4, borderRadius:10,
                background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.05)',
              }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, minWidth:0 }}>
                  <span style={{ fontFamily:'Inter,sans-serif', fontWeight:600, fontSize:13, color:'#fff' }}>{page.labels.en}</span>
                  <span style={{ fontFamily:'Inter,sans-serif', fontSize:10, color:'rgba(255,255,255,0.28)' }}>{page.href}</span>
                  <div style={{ display:'flex', gap:4 }}>
                    {inTop    && <span style={{ fontFamily:'Inter,sans-serif', fontSize:9, fontWeight:700, padding:'2px 6px', borderRadius:4, background:'rgba(0,255,255,0.1)', color:'#00FFFF', border:'1px solid rgba(0,255,255,0.2)' }}>TOP</span>}
                    {inBottom && <span style={{ fontFamily:'Inter,sans-serif', fontSize:9, fontWeight:700, padding:'2px 6px', borderRadius:4, background:'rgba(255,215,0,0.1)', color:'#FFD700', border:'1px solid rgba(255,215,0,0.2)' }}>BOTTOM</span>}
                  </div>
                </div>
                <div style={{ display:'flex', gap:6, flexShrink:0 }}>
                  <button onClick={() => !inTop && addPage(page, 'top')} disabled={inTop}
                    style={{ fontFamily:'Inter,sans-serif', fontSize:10, fontWeight:800, padding:'5px 10px', borderRadius:8, cursor: inTop ? 'not-allowed' : 'pointer', opacity: inTop ? 0.3 : 1,
                      background:'rgba(0,255,255,0.1)', color:'#00FFFF', border:'1px solid rgba(0,255,255,0.25)' }}>
                    {inTop ? '✓ TOP' : '+ TOP'}
                  </button>
                  <button onClick={() => !inBottom && addPage(page, 'bottom')} disabled={inBottom}
                    style={{ fontFamily:'Inter,sans-serif', fontSize:10, fontWeight:800, padding:'5px 10px', borderRadius:8, cursor: inBottom ? 'not-allowed' : 'pointer', opacity: inBottom ? 0.3 : 1,
                      background:'rgba(255,215,0,0.1)', color:'#FFD700', border:'1px solid rgba(255,215,0,0.25)' }}>
                    {inBottom ? '✓ BOTTOM' : '+ BOTTOM'}
                  </button>
                </div>
              </div>
            );
          })}
          <p style={{ fontFamily:'Inter,sans-serif', fontSize:10, color:'rgba(255,255,255,0.2)', marginTop:12, fontStyle:'italic' }}>
            Vuoi aggiungere una pagina che non è in lista? Scrivimi — la creo insieme a te.
          </p>
        </div>
      </div>
    </div>
  );
}


function PagesManager({ call }) {

  const [pages, setPages]           = useState([]);
  const [selected, setSelected]     = useState(null);
  const [form, setForm]             = useState({});
  const [activeLang, setActiveLang] = useState('en');
  const [saving, setSaving]         = useState(false);
  const [translating, setTranslating] = useState('');
  const [msg, setMsg]               = useState('');
  const [filter, setFilter]         = useState('all');

  const SEO_LANGS = [
    { code: 'en', label: 'EN', flag: '🌍', name: 'English' },
    { code: 'it', label: 'IT', flag: '🇮🇹', name: 'Italian' },
    { code: 'es', label: 'ES', flag: '🇪🇸', name: 'Spanish' },
  ];
  const EMPTY_SEO = { seo_title: '', meta_description: '', h1: '' };

  const load = useCallback(async () => {
    try { const data = await call('get', '/cms/pages'); setPages(data); }
    catch { setPages([]); }
  }, [call]);
  useEffect(() => { load(); }, [load]);

  const selectPage = (page) => {
    setSelected(page);
    setForm({
      seo_title: page.seo_title || '',
      meta_description: page.meta_description || '',
      h1: page.h1 || '',
      translations: {
        it: { ...EMPTY_SEO, ...(page.translations?.it || {}) },
        es: { ...EMPTY_SEO, ...(page.translations?.es || {}) },
      },
    });
    setActiveLang('en'); setMsg('');
  };

  // Get/set field for active language
  const getField = (field) => {
    if (activeLang === 'en') return form[field] || '';
    return form.translations?.[activeLang]?.[field] || '';
  };
  const setField = (field, val) => {
    if (activeLang === 'en') {
      setForm(prev => ({ ...prev, [field]: val }));
    } else {
      setForm(prev => ({
        ...prev,
        translations: { ...prev.translations, [activeLang]: { ...prev.translations?.[activeLang], [field]: val } },
      }));
    }
  };

  // Count filled fields per language
  const langFilled = (lang) => {
    const fields = ['seo_title', 'meta_description'];
    const src = lang === 'en' ? form : (form.translations?.[lang] || {});
    return fields.filter(f => (src[f] || '').trim()).length;
  };

  const save = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await call('put', `/pages${selected.slug}`, {
        seo_title: form.seo_title,
        meta_description: form.meta_description,
        h1: form.h1,
        translations: form.translations,
      });
      setMsg('Salvato!');
      load();
    } catch { setMsg('Errore'); } finally { setSaving(false); }
  };

  const clearOverride = async () => {
    if (!selected || !selected.has_override) return;
    if (!window.confirm(`Rimuovere override SEO per ${selected.slug}?`)) return;
    await call('put', `/pages${selected.slug}`, { seo_title: '', meta_description: '', h1: '' });
    setMsg('Override rimosso');
    load();
  };

  const aiTranslate = async (langCode, langName) => {
    if (!selected) return;
    setTranslating(langCode); setMsg('');
    try {
      const r = await call('post', `/pages${selected.slug}/translate`, { target_lang: langCode, target_lang_name: langName });
      setMsg(`✓ ${r.translated} campi tradotti in ${langCode.toUpperCase()} con AI`);
      // Refresh translations
      const updated = await call('get', `/pages/${selected.slug}`).catch(() => null);
      if (updated?.translations) {
        setForm(prev => ({
          ...prev,
          translations: {
            it: { ...EMPTY_SEO, ...(updated.translations.it || {}) },
            es: { ...EMPTY_SEO, ...(updated.translations.es || {}) },
          },
        }));
      }
    } catch (e) { setMsg(e?.response?.data?.detail || 'Errore traduzione AI'); }
    finally { setTranslating(''); }
  };

  const inp = "w-full font-inter text-sm text-white placeholder-white/30 px-3 py-2.5 rounded-[10px] outline-none focus:border-ak-cyan transition-colors";
  const inpStyle = { background: '#111', border: '1px solid rgba(255,255,255,0.12)' };

  const mainPages      = pages.filter(p => p.section === 'main');
  const secondaryPages = pages.filter(p => p.section === 'secondary');
  const supportPages   = pages.filter(p => p.section === 'support');
  const overriddenCount = pages.filter(p => p.has_override).length;

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {/* ── PAGE LIST ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-anton text-xl uppercase text-white">PAGES</h2>
          <span className="font-inter text-[10px] text-ak-cyan border border-ak-cyan/25 px-2 py-0.5 rounded">
            {overriddenCount} override
          </span>
        </div>

        {[
          { label: 'MAIN NAVIGATION', items: mainPages },
          { label: 'SEO PAGES', items: secondaryPages },
          ...(supportPages.length ? [{ label: 'OTHER', items: supportPages }] : []),
        ].map(group => (
          <div key={group.label} className="mb-4">
            <div className="font-inter text-[9px] font-bold uppercase tracking-widest text-white/30 mb-2">{group.label}</div>
            <div className="space-y-0.5">
              {group.items.map(p => {
                const hasIt = p.translations?.it?.seo_title;
                const hasEs = p.translations?.es?.seo_title;
                return (
                  <button key={p.slug} onClick={() => selectPage(p)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-[10px] text-left transition-all group ${
                      selected?.slug === p.slug ? 'bg-ak-cyan/10 border border-ak-cyan/30' : 'border border-transparent hover:bg-white/4'
                    }`}>
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${p.has_override ? 'bg-ak-cyan' : 'bg-white/15'}`} />
                      <span className={`font-inter text-sm truncate ${selected?.slug === p.slug ? 'text-ak-cyan' : 'text-white/70 group-hover:text-white'}`}>
                        {p.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {['it','es'].map(l => {
                        const has = l === 'it' ? hasIt : hasEs;
                        return (
                          <span key={l} className="font-inter text-[8px] font-bold px-1 py-0.5 rounded"
                            style={{
                              background: has ? 'rgba(52,211,153,0.1)' : 'rgba(255,255,255,0.04)',
                              color: has ? '#34d399' : 'rgba(255,255,255,0.2)',
                            }}>
                            {l.toUpperCase()}
                          </span>
                        );
                      })}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <div className="mt-4 p-3 rounded-[10px]" style={{ background: 'rgba(0,255,255,0.04)', border: '1px solid rgba(0,255,255,0.1)' }}>
          <p className="font-inter text-[10px] text-white/40 leading-relaxed">
            <span style={{ color: '#00FFFF' }}>●</span> Cyan = SEO override attivo<br />
            IT/ES verde = traduzione presente
          </p>
        </div>
      </div>

      {/* ── EDITOR ── */}
      <div className="md:col-span-2">
        {!selected ? (
          <div className="flex flex-col items-center justify-center h-full border border-dashed border-white/10 rounded-[14px] py-20 gap-3">
            <FileText size={28} className="text-white/15" />
            <p className="font-inter text-sm text-white/30">Seleziona una pagina per modificare i metadati SEO</p>
            <p className="font-inter text-xs text-white/20">EN + IT + ES — override senza toccare il codice</p>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="flex items-start justify-between mb-5 flex-wrap gap-3">
              <div>
                <h3 className="font-anton text-2xl uppercase text-white">{selected.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-inter text-xs text-white/40">{selected.slug}</span>
                  {selected.has_override && (
                    <span className="font-inter text-[9px] font-bold uppercase tracking-wider text-ak-cyan border border-ak-cyan/30 px-1.5 py-0.5 rounded">
                      Override attivo
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {SEO_LANGS.filter(l => l.code !== 'en').map(l => (
                  <button key={l.code} onClick={() => aiTranslate(l.code, l.name)} disabled={!!translating}
                    className="inline-flex items-center gap-1.5 font-inter text-[10px] font-bold uppercase tracking-wider px-3 py-2 rounded-[8px] border transition-all disabled:opacity-40"
                    style={{
                      borderColor: translating === l.code ? '#FFD700' : 'rgba(255,215,0,0.3)',
                      color: translating === l.code ? '#FFD700' : 'rgba(255,215,0,0.7)',
                      background: translating === l.code ? 'rgba(255,215,0,0.08)' : 'transparent',
                    }}>
                    <Sparkles size={10} />
                    {translating === l.code ? `AI ${l.label}...` : `AI → ${l.label}`}
                  </button>
                ))}
                {selected.has_override && (
                  <button onClick={clearOverride} className="font-inter text-xs text-red-400 hover:text-red-300 transition-colors ml-2">
                    Rimuovi override
                  </button>
                )}
              </div>
            </div>

            {/* Language Tabs */}
            <div className="rounded-[12px] overflow-hidden mb-5" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="flex" style={{ background: '#0a0a0a', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                {SEO_LANGS.map(l => {
                  const filled = langFilled(l.code);
                  const pct = Math.round((filled / 2) * 100);
                  const isAct = activeLang === l.code;
                  return (
                    <button key={l.code} onClick={() => setActiveLang(l.code)}
                      className="flex-1 flex flex-col items-center gap-1 px-4 py-3 transition-all"
                      style={{
                        borderBottom: isAct ? '2px solid #00FFFF' : '2px solid transparent',
                        color: isAct ? '#00FFFF' : 'rgba(255,255,255,0.4)',
                        background: isAct ? 'rgba(0,255,255,0.05)' : 'transparent',
                      }}>
                      <div className="flex items-center gap-1.5">
                        <span style={{ fontSize: 13 }}>{l.flag}</span>
                        <span className="font-inter text-xs font-bold uppercase tracking-wider">{l.label}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="rounded-full overflow-hidden" style={{ width: 36, height: 3, background: 'rgba(255,255,255,0.1)' }}>
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: pct === 100 ? '#34d399' : pct > 0 ? '#FFD700' : 'transparent', transition: 'width .3s' }} />
                        </div>
                        <span className="font-inter text-[9px]" style={{ color: pct === 100 ? '#34d399' : 'rgba(255,255,255,0.25)' }}>{filled}/2</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="p-5 space-y-4">
                {activeLang !== 'en' && (
                  <div className="flex items-center gap-3 p-3 rounded-[8px]" style={{ background: 'rgba(255,215,0,0.05)', border: '1px solid rgba(255,215,0,0.12)' }}>
                    <Sparkles size={12} style={{ color: '#FFD700', flexShrink: 0 }} />
                    <span className="font-inter text-xs text-white/50">
                      Versione <strong className="text-ak-gold">{activeLang.toUpperCase()}</strong>.
                      {' '}Usa <strong className="text-ak-gold">AI → {activeLang.toUpperCase()}</strong> per tradurre automaticamente dall&apos;EN.
                    </span>
                  </div>
                )}

                {/* SEO Title */}
                <div>
                  <label className="font-inter text-xs text-white/50 uppercase tracking-wider block mb-1">
                    SEO Title {activeLang.toUpperCase()}
                    <span className="text-white/20 ml-1 normal-case">max 60 char</span>
                    {getField('seo_title') && (
                      <span className={`ml-2 font-normal ${getField('seo_title').length > 60 ? 'text-red-400' : 'text-white/25'}`}>
                        {getField('seo_title').length}/60
                      </span>
                    )}
                  </label>
                  <input className={inp} style={inpStyle}
                    value={getField('seo_title')}
                    onChange={e => setField('seo_title', e.target.value)}
                    placeholder={activeLang === 'en' ? 'Lascia vuoto per usare il titolo default' : `SEO Title in ${SEO_LANGS.find(l=>l.code===activeLang)?.name}...`} />
                </div>

                {/* Meta Description */}
                <div>
                  <label className="font-inter text-xs text-white/50 uppercase tracking-wider block mb-1">
                    Meta Description {activeLang.toUpperCase()}
                    <span className="text-white/20 ml-1 normal-case">max 155 char</span>
                    {getField('meta_description') && (
                      <span className={`ml-2 font-normal ${getField('meta_description').length > 155 ? 'text-red-400' : getField('meta_description').length > 145 ? 'text-yellow-500' : 'text-white/25'}`}>
                        {getField('meta_description').length}/155
                      </span>
                    )}
                  </label>
                  <textarea className={`${inp} resize-none`} style={inpStyle} rows={3}
                    value={getField('meta_description')}
                    onChange={e => setField('meta_description', e.target.value)}
                    placeholder={activeLang === 'en' ? 'Lascia vuoto per usare la descrizione default' : `Meta description in ${SEO_LANGS.find(l=>l.code===activeLang)?.name}...`} />
                </div>

                {/* H1 Override */}
                <div>
                  <label className="font-inter text-xs text-white/50 uppercase tracking-wider block mb-1">
                    H1 Override {activeLang.toUpperCase()}
                    <span className="text-white/20 ml-1 normal-case">(heading principale)</span>
                  </label>
                  <input className={inp} style={inpStyle}
                    value={getField('h1')}
                    onChange={e => setField('h1', e.target.value)}
                    placeholder={activeLang === 'en' ? 'Lascia vuoto per usare H1 default' : `H1 in ${SEO_LANGS.find(l=>l.code===activeLang)?.name}...`} />
                </div>
              </div>
            </div>

            {/* Save */}
            <div className="flex items-center gap-4">
              <button onClick={save} disabled={saving}
                className="inline-flex items-center gap-2 font-inter font-bold uppercase text-sm px-8 rounded-[12px] bg-ak-gold text-black disabled:opacity-60 hover:scale-[1.02] transition-transform"
                style={{ height: '46px' }}>
                <Save size={16} /> {saving ? 'Salvataggio...' : 'Salva Override SEO'}
              </button>
              {msg && (
                <span className={`font-inter text-xs font-semibold ${msg.startsWith('✓') || msg === 'Salvato!' ? 'text-ak-cyan' : msg.includes('rimosso') ? 'text-white/50' : 'text-red-400'}`}>
                  {msg}
                </span>
              )}
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
        {tab === 'global'    && <GlobalContentEditor call={call} />}
        {tab === 'nav'       && <NavManager call={call} />}
        {tab === 'coverage'  && <KeyCoverageView call={call} />}
        {tab === 'hero'      && <HeroSlidesManager call={call} />}
        {tab === 'blog'      && <BlogManager call={call} />}
        {tab === 'pages'     && <PagesManager call={call} />}
        {tab === 'media'     && <MediaLibrary call={call} />}
        {tab === 'pilots'    && <PilotRequests call={call} />}
      </main>
    </div>
  );
}
