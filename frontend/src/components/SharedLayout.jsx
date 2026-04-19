import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Download } from 'lucide-react';
import { LOGO, NAV_LINKS } from '../data/seo-content';

export function useSEO({ title, description }) {
  useEffect(() => {
    document.title = title;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; document.head.appendChild(meta); }
    meta.content = description;
  }, [title, description]);
}

export function InnerNavbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const loc = useLocation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/95 backdrop-blur-md border-b border-white/10' : 'bg-black/80 backdrop-blur-sm'}`}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between h-16">
        <Link to="/" data-testid="inner-navbar-logo">
          <img src={LOGO} alt="ArenaKore" className="h-8 w-auto object-contain" />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(l => (
            <Link
              key={l.href}
              to={l.href}
              className={`font-inter text-xs font-semibold uppercase tracking-wider transition-colors ${loc.pathname === l.href ? 'text-ak-cyan' : 'text-white/70 hover:text-white'}`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a
            href="#"
            data-testid="inner-navbar-download"
            className="hidden md:inline-flex items-center gap-2 font-inter font-bold text-xs uppercase tracking-wider px-4 rounded-[14px] bg-ak-gold text-black transition-all hover:scale-105"
            style={{ height: '36px' }}
          >
            <Download size={14} />
            App
          </a>
          <button onClick={() => setOpen(!open)} className="md:hidden text-white p-1">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-black/98 border-t border-white/10 px-5 py-4 space-y-3">
          {NAV_LINKS.map(l => (
            <Link key={l.href} to={l.href} onClick={() => setOpen(false)}
              className={`block font-inter text-sm font-semibold uppercase tracking-wider py-2 ${loc.pathname === l.href ? 'text-ak-cyan' : 'text-white'}`}>
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}

export function InnerFooter() {
  return (
    <footer className="border-t border-white/8 bg-black mt-0">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-10">
          <div>
            <img src={LOGO} alt="ArenaKore" className="h-8 w-auto object-contain mb-3" />
            <p className="font-inter text-xs text-white max-w-xs leading-relaxed">
              The fitness competition platform that validates every rep. NEXUS doesn't lie.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {[
              { title: 'PRODOTTO', links: [['Fitness App', '/fitness-challenge-app'], ['CrossFit', '/crossfit-challenge'], ['Competizione', '/workout-competition'], ['AMRAP', '/amrap-training']] },
              { title: 'PALESTRE', links: [['Per Palestre', '/for-gyms'], ['Gamification', '/fitness-gamification'], ['Prezzi', '/for-gyms']] },
              { title: 'LEARN', links: [['Blog', '/blog'], ['Support', '/support']] },
              { title: 'DOWNLOAD', links: [['App Store', '#'], ['Google Play', '#']] },
            ].map((col, i) => (
              <div key={i}>
                <div className="font-inter text-[10px] font-bold uppercase tracking-widest mb-3 text-white">{col.title}</div>
                <ul className="space-y-2">
                  {col.links.map(([label, href]) => (
                    <li key={label}><Link to={href} className="font-inter text-xs text-white hover:text-ak-cyan transition-colors">{label}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-white/8 gap-3">
          <div className="font-inter text-xs text-white">© 2026 ArenaKore. All rights reserved.</div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse inline-block" />
            <span className="font-inter text-xs font-bold uppercase tracking-wider text-white">NEXUS ONLINE</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
