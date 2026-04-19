import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronRight, Zap } from 'lucide-react';
import { LOGO } from '../data/seo-content';

export function useSEO({ title, description }) {
  useEffect(() => {
    document.title = title;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; document.head.appendChild(meta); }
    meta.content = description;
  }, [title, description]);
}

const NAV = [
  { label: 'Home',        href: '/' },
  { label: 'Fitness App', href: '/fitness-challenge-app' },
  { label: 'CrossFit',    href: '/crossfit-challenge' },
  { label: 'Competition', href: '/workout-competition' },
  { label: 'AMRAP',       href: '/amrap-training' },
  { label: 'For Gyms',   href: '/for-gyms' },
  { label: 'Blog',        href: '/blog' },
];

export function InnerNavbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const loc = useLocation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const active = (href) => href === '/' ? loc.pathname === '/' : loc.pathname.startsWith(href);

  return (
    <nav
      data-testid="inner-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/95 backdrop-blur-md border-b border-white/10' : 'bg-black/80 backdrop-blur-sm border-b border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" data-testid="nav-logo" className="flex-shrink-0">
          <img src={LOGO} alt="ArenaKore" className="h-8 w-auto object-contain" loading="lazy" />
        </Link>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-1">
          {NAV.map(l => (
            <Link key={l.href} to={l.href}
              className={`font-inter text-xs font-semibold uppercase tracking-wider px-3 py-2 rounded-lg transition-colors ${
                active(l.href) ? 'text-ak-cyan' : 'text-white/60 hover:text-white'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Primary CTA */}
        <div className="flex items-center gap-3">
          <Link
            to="/gym-challenge-pilot"
            data-testid="nav-start-challenge-btn"
            className="hidden sm:inline-flex items-center gap-2 font-inter font-black text-xs uppercase tracking-wider px-4 rounded-[14px] bg-ak-gold text-black hover:scale-105 transition-transform"
            style={{ height: '36px' }}
          >
            <Zap size={13} fill="black" /> Start a Challenge
          </Link>
          <button onClick={() => setOpen(!open)} className="lg:hidden text-white p-1" data-testid="nav-mobile-toggle">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-black/98 border-t border-white/10 px-5 py-5 space-y-1">
          {NAV.map(l => (
            <Link key={l.href} to={l.href} onClick={() => setOpen(false)}
              className={`flex items-center justify-between py-3 border-b border-white/5 font-inter text-sm font-semibold uppercase tracking-wider ${
                active(l.href) ? 'text-ak-cyan' : 'text-white'
              }`}
            >
              {l.label} <ChevronRight size={14} className="text-white/30" />
            </Link>
          ))}
          <Link to="/gym-challenge-pilot" onClick={() => setOpen(false)}
            className="mt-4 flex items-center justify-center gap-2 font-inter font-black text-sm uppercase tracking-wider rounded-[14px] bg-ak-gold text-black"
            style={{ height: '48px' }}>
            <Zap size={16} fill="black" /> Start a Challenge
          </Link>
        </div>
      )}
    </nav>
  );
}

export function InnerFooter() {
  return (
    <footer data-testid="inner-footer" className="bg-black border-t border-white/8">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">

          {/* Col 1: Brand */}
          <div>
            <img src={LOGO} alt="ArenaKore" className="h-8 w-auto object-contain mb-4" loading="lazy" />
            <p className="font-inter text-xs text-white leading-relaxed max-w-xs">
              Fitness competition platform for real training.<br />
              The competition never ends.
            </p>
            <div className="flex items-center gap-2 mt-4">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse inline-block" />
              <span className="font-inter text-[10px] font-bold uppercase tracking-widest text-white">NEXUS ONLINE</span>
            </div>
          </div>

          {/* Col 2: Pages */}
          <div>
            <div className="font-inter text-[10px] font-bold uppercase tracking-widest text-white/40 mb-5">PAGES</div>
            <ul className="space-y-2.5">
              {[
                ['Home', '/'],
                ['Fitness Challenge App', '/fitness-challenge-app'],
                ['CrossFit Challenge', '/crossfit-challenge'],
                ['Workout Competition', '/workout-competition'],
                ['AMRAP Training', '/amrap-training'],
                ['For Gyms', '/for-gyms'],
                ['Blog', '/blog'],
                ['14-Day Pilot', '/gym-challenge-pilot'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link to={href} className="font-inter text-sm text-white hover:text-ak-cyan transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Support */}
          <div>
            <div className="font-inter text-[10px] font-bold uppercase tracking-widest text-white/40 mb-5">SUPPORT</div>
            <ul className="space-y-2.5 mb-6">
              <li><Link to="/support" className="font-inter text-sm text-white hover:text-ak-cyan transition-colors">Support Center</Link></li>
              <li><a href="mailto:support@arenakore.com" className="font-inter text-sm text-white hover:text-ak-cyan transition-colors">support@arenakore.com</a></li>
            </ul>
            <Link to="/gym-challenge-pilot"
              className="inline-flex items-center gap-2 font-inter font-black text-xs uppercase tracking-wider px-5 rounded-[14px] bg-ak-gold text-black hover:scale-105 transition-transform"
              style={{ height: '38px' }}>
              <Zap size={13} fill="black" /> Start Pilot
            </Link>
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-white/8 gap-3">
          <div className="font-inter text-xs text-white">© 2026 ArenaKore. All rights reserved.</div>
          <div className="flex items-center gap-6">
            <a href="#" className="font-inter text-xs text-white/50 hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="font-inter text-xs text-white/50 hover:text-white transition-colors">Terms of Service</a>
            <Link to="/support" className="font-inter text-xs text-white/50 hover:text-white transition-colors">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
