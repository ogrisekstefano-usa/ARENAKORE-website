import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { trackEvent } from '../utils/tracking';

const SPORTS = [
  { id: 'basketball', label: 'Basketball', emoji: '🏀' },
  { id: 'running',    label: 'Running',    emoji: '🏃' },
  { id: 'crossfit',   label: 'CrossFit',   emoji: '⚡' },
  { id: 'swimming',   label: 'Swimming',   emoji: '🏊' },
  { id: 'golf',       label: 'Golf',       emoji: '⛳' },
  { id: 'other',      label: 'Other',      emoji: '🎯' },
];

const STORAGE_KEY = 'arena_sport_preference';

export function useSportPreference() {
  return localStorage.getItem(STORAGE_KEY);
}

export default function SportSelector({ onSelect, compact = false }) {
  const [selected, setSelected] = useState(null);
  const [animating, setAnimating] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setSelected(saved);
  }, []);

  const handleSelect = (sport) => {
    setAnimating(sport.id);
    setSelected(sport.id);
    localStorage.setItem(STORAGE_KEY, sport.id);

    // Track event
    trackEvent('sport_selected', { sport: sport.id });

    // Callback
    if (onSelect) onSelect(sport.id);

    // Redirect with sport param
    setTimeout(() => {
      navigate(`/arena-system?sport=${sport.id}`);
    }, 280);
  };

  return (
    <div data-testid="sport-selector" className={compact ? 'py-10' : 'py-16'}>
      <div className={`max-w-3xl mx-auto px-6 sm:px-10 ${compact ? '' : 'text-center'}`}>
        <div className="font-inter text-xs font-bold tracking-[0.4em] uppercase mb-4 text-ak-cyan">
          CHOOSE YOUR DISCIPLINE
        </div>
        <h3 className={`font-anton uppercase text-white mb-8 leading-none ${compact ? 'text-2xl' : 'text-3xl md:text-4xl'}`}>
          What's your arena?
        </h3>
        <div className="flex flex-wrap gap-3 justify-center">
          {SPORTS.map(sport => {
            const isSelected = selected === sport.id;
            const isAnimating = animating === sport.id;
            return (
              <button
                key={sport.id}
                data-testid={`sport-btn-${sport.id}`}
                onClick={() => handleSelect(sport)}
                className="inline-flex items-center gap-2.5 font-inter font-bold text-sm uppercase tracking-wider rounded-[14px] transition-all duration-200"
                style={{
                  height: '48px',
                  padding: '0 20px',
                  background: isSelected
                    ? 'rgba(0,255,255,0.12)'
                    : 'rgba(255,255,255,0.04)',
                  border: `1.5px solid ${isSelected ? '#00FFFF' : 'rgba(255,255,255,0.12)'}`,
                  color: isSelected ? '#00FFFF' : 'rgba(255,255,255,0.7)',
                  transform: isAnimating ? 'scale(0.96)' : 'scale(1)',
                  boxShadow: isSelected ? '0 0 16px rgba(0,255,255,0.2)' : 'none',
                }}
              >
                <span style={{ fontSize: '16px' }}>{sport.emoji}</span>
                {sport.label}
              </button>
            );
          })}
        </div>
        {selected && (
          <p className="font-inter text-xs text-white/30 mt-5 uppercase tracking-widest">
            Arena: <span className="text-ak-cyan">{SPORTS.find(s => s.id === selected)?.label}</span> — tap to change
          </p>
        )}
      </div>
    </div>
  );
}
