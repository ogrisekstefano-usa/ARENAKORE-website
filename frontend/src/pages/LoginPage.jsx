import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Zap, Mail, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { LOGO } from '../data/seo-content';

function formatError(err) {
  const detail = err?.response?.data?.detail;
  if (!detail) return err?.message || 'Something went wrong. Please try again.';
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) return detail.map(e => e?.msg || JSON.stringify(e)).join(' ');
  return String(detail);
}

export default function LoginPage() {
  const { t } = useTranslation();
  const [mode, setMode]           = useState('login'); // 'login' | 'register'
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [name, setName]           = useState('');
  const [showPwd, setShowPwd]     = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');

  const { login, register }       = useAuth();
  const navigate                  = useNavigate();
  const location                  = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        if (!name.trim()) { setError('Name is required'); setLoading(false); return; }
        await register(email, password, name);
      }
      navigate(from, { replace: true });
    } catch (err) {
      setError(formatError(err));
    } finally {
      setLoading(false);
    }
  };

  const inp = "w-full font-inter text-sm text-white placeholder-white/30 px-4 py-3 rounded-[12px] outline-none focus:border-ak-cyan transition-colors pl-11";
  const inpStyle = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,255,255,0.04) 0%, transparent 70%)' }} />

      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/">
            <img src={LOGO} alt="ArenaKore" className="h-10 w-auto object-contain mx-auto mb-4" />
          </Link>
          <h1 className="font-anton text-3xl uppercase text-white mb-1">
            {mode === 'login' ? 'ENTER THE ARENA' : 'JOIN THE ARENA'}
          </h1>
          <p className="font-inter text-xs text-white/40 uppercase tracking-widest">
            {mode === 'login' ? t('ui.sign_in') + ' to your KORE account' : 'Create your KORE identity'}
          </p>
        </div>

        {/* Card */}
        <div className="p-7 rounded-[20px]" style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)' }}>
          <form onSubmit={handleSubmit} className="space-y-4" data-testid="auth-form">
            {/* Name (register only) */}
            {mode === 'register' && (
              <div className="relative">
                <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input data-testid="auth-name" type="text" placeholder="Your name" value={name}
                  onChange={e => setName(e.target.value)} className={inp} style={inpStyle} />
              </div>
            )}

            {/* Email */}
            <div className="relative">
              <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input data-testid="auth-email" type="email" placeholder="Email" value={email}
                onChange={e => setEmail(e.target.value)} className={inp} style={inpStyle} required />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input data-testid="auth-password" type={showPwd ? 'text' : 'password'} placeholder="Password" value={password}
                onChange={e => setPassword(e.target.value)} className={`${inp} pr-11`} style={inpStyle} required />
              <button type="button" onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors p-1">
                {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-3 p-3 rounded-[10px]" style={{ background: 'rgba(255,45,45,0.08)', border: '1px solid rgba(255,45,45,0.2)' }}>
                <AlertCircle size={14} className="text-red-400 flex-shrink-0 mt-0.5" />
                <span className="font-inter text-xs text-red-400">{error}</span>
              </div>
            )}

            {/* Submit */}
            <button type="submit" disabled={loading} data-testid="auth-submit"
              className="w-full font-inter font-black uppercase tracking-wider text-sm rounded-[14px] bg-ak-gold text-black disabled:opacity-60 flex items-center justify-center gap-2 hover:scale-[1.01] transition-transform"
              style={{ height: '52px' }}>
              {loading ? (
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <><Zap size={16} fill="black" />{mode === 'login' ? 'Sign In' : 'Create Account'}</>
              )}
            </button>
          </form>

          {/* Toggle mode */}
          <div className="mt-5 text-center border-t border-white/8 pt-5">
            <p className="font-inter text-xs text-white/40">
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
                className="text-ak-cyan hover:underline font-semibold">
                {mode === 'login' ? 'Join now' : t('ui.sign_in')}
              </button>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="font-inter text-xs text-white/25 hover:text-white transition-colors">
            {t('ui.back_to_site')}
          </Link>
        </div>
      </div>
    </div>
  );
}
