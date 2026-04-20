import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { trackEvent } from '../utils/tracking';

const SPORTS = [
  { id: 'athletics',     label: 'Athletics',          emoji: '🏃' },
  { id: 'badminton',     label: 'Badminton',           emoji: '🏸' },
  { id: 'baseball',      label: 'Baseball',            emoji: '⚾' },
  { id: 'basketball',    label: 'Basketball',          emoji: '🏀' },
  { id: 'boxing',        label: 'Boxing',              emoji: '🥊' },
  { id: 'crossfit',      label: 'CrossFit',            emoji: '⚡' },
  { id: 'cycling',       label: 'Cycling',             emoji: '🚴' },
  { id: 'football',      label: 'Football',            emoji: '⚽' },
  { id: 'golf',          label: 'Golf',                emoji: '⛳' },
  { id: 'gymnastics',    label: 'Gymnastics',          emoji: '🤸' },
  { id: 'handball',      label: 'Handball',            emoji: '🤾' },
  { id: 'hockey',        label: 'Hockey',              emoji: '🏑' },
  { id: 'mma',           label: 'MMA',                 emoji: '🥋' },
  { id: 'motorsport',    label: 'Motorsport',          emoji: '🏎️' },
  { id: 'padel',         label: 'Padel',               emoji: '🎾' },
  { id: 'rugby',         label: 'Rugby',               emoji: '🏉' },
  { id: 'running',       label: 'Running',             emoji: '🏃‍♂️' },
  { id: 'skiing',        label: 'Skiing',              emoji: '🎿' },
  { id: 'surf',          label: 'Surf',                emoji: '🏄' },
  { id: 'swimming',      label: 'Swimming',            emoji: '🏊' },
  { id: 'tennis',        label: 'Tennis',              emoji: '🎾' },
  { id: 'triathlon',     label: 'Triathlon',           emoji: '🏊‍♂️' },
  { id: 'volleyball',    label: 'Volleyball',          emoji: '🏐' },
  { id: 'weightlifting', label: 'Weightlifting',       emoji: '🏋️' },
  { id: 'yoga',          label: 'Yoga',                emoji: '🧘' },
  { id: 'other',         label: 'Other',               emoji: '🎯' },
];

const STORAGE_KEY = 'arena_sport_preference';

export function useSportPreference() {
  return localStorage.getItem(STORAGE_KEY);
}

export default function SportSelector({ onSelect, compact = false }) {
  const [selected, setSelected] = useState(null);
  const [customInput, setCustomInput] = useState('');
  const [customError, setCustomError] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setSelected(saved);
  }, []);

  // Focus custom input when "other" selected
  useEffect(() => {
    if (selected === 'other' && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [selected]);

  const commitSport = (sportId) => {
    localStorage.setItem(STORAGE_KEY, sportId);
    trackEvent('sport_selected', { sport: sportId });
    if (onSelect) onSelect(sportId);
    setTimeout(() => navigate(`/arena-system?sport=${sportId}`), 260);
  };

  const handleSportClick = (sport) => {
    setSelected(sport.id);
    setCustomError('');
    if (sport.id !== 'other') {
      commitSport(sport.id);
    }
  };

  const handleCustomSave = () => {
    const val = customInput.trim();
    if (val.length < 2) { setCustomError('Min 2 characters'); return; }
    commitSport(val.toLowerCase().replace(/\s+/g, '_'));
  };

  const selectedSport = SPORTS.find(s => s.id === selected);
  const displayName   = selectedSport
    ? (selected === 'other' && customInput.trim().length >= 2
        ? customInput.trim()
        : selectedSport.label)
    : null;

  return (
    <div data-testid="sport-selector" className={compact ? 'py-10 px-6 sm:px-10' : 'py-16 px-6 sm:px-10'}>
      <div className={compact ? 'max-w-4xl mx-auto' : 'max-w-5xl mx-auto text-center'}>
        {/* Header */}
        <div className="font-inter text-xs font-bold tracking-[0.4em] uppercase mb-3 text-ak-cyan">
          {t('ui.arena_everywhere_badge', 'CHOOSE YOUR DISCIPLINE')}
        </div>
        <h3 className={`font-anton uppercase text-white leading-none mb-2 ${compact ? 'text-2xl text-left' : 'text-3xl md:text-4xl'}`}>
          {t('ui.sport_selector_title', "What's your arena?")}
        </h3>
        <p className={`font-inter text-xs mb-8 ${compact ? 'text-left' : ''}`} style={{ color: 'rgba(255,255,255,0.35)' }}>
          {t('ui.sport_selector_sub', 'Choose your primary discipline')}
        </p>

        {/* Sport grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
          {SPORTS.map(sport => {
            const isSelected = selected === sport.id;
            const isOther    = sport.id === 'other';
            return (
              <button
                key={sport.id}
                data-testid={`sport-btn-${sport.id}`}
                onClick={() => handleSportClick(sport)}
                className="inline-flex items-center gap-2 font-inter font-semibold text-xs uppercase tracking-wide rounded-[12px] transition-all duration-150 text-left"
                style={{
                  height: '44px',
                  padding: '0 14px',
                  background: isSelected
                    ? 'rgba(0,255,255,0.1)'
                    : 'rgba(255,255,255,0.03)',
                  border: `1.5px solid ${isSelected ? '#00FFFF' : 'rgba(255,255,255,0.1)'}`,
                  color: isSelected ? '#00FFFF' : 'rgba(255,255,255,0.65)',
                  boxShadow: isSelected ? '0 0 16px rgba(0,255,255,0.15)' : 'none',
                  transform: 'scale(1)',
                }}
                onMouseEnter={e => { if (!isSelected) e.currentTarget.style.borderColor = 'rgba(0,255,255,0.3)'; }}
                onMouseLeave={e => { if (!isSelected) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
              >
                <span style={{ fontSize: '15px', flexShrink: 0 }}>{sport.emoji}</span>
                <span className="truncate">{sport.label}</span>
                {isSelected && !isOther && (
                  <span className="ml-auto flex-shrink-0 w-1.5 h-1.5 rounded-full bg-ak-cyan" />
                )}
              </button>
            );
          })}
        </div>

        {/* Other input */}
        {selected === 'other' && (
          <div className="mt-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center"
            style={{ maxWidth: compact ? '100%' : '420px', margin: compact ? '1rem 0 0' : '1rem auto 0' }}>
            <div className="flex-1 w-full">
              <input
                ref={inputRef}
                type="text"
                value={customInput}
                onChange={e => { setCustomInput(e.target.value); setCustomError(''); }}
                onKeyDown={e => e.key === 'Enter' && handleCustomSave()}
                placeholder="Type your discipline..."
                className="w-full font-inter text-sm text-white placeholder-white/30 px-4 py-2.5 rounded-[12px] outline-none transition-colors"
                style={{ background: 'rgba(255,255,255,0.05)', border: `1.5px solid ${customError ? '#FF2D2D' : 'rgba(0,255,255,0.3)'}` }}
                data-testid="custom-sport-input"
              />
              {customError && (
                <p className="font-inter text-xs text-red-400 mt-1">{customError}</p>
              )}
            </div>
            <button
              onClick={handleCustomSave}
              data-testid="custom-sport-save"
              className="font-inter font-black text-xs uppercase tracking-wider px-6 rounded-[12px] bg-ak-gold text-black hover:scale-105 transition-transform flex-shrink-0"
              style={{ height: '42px' }}>
              Save
            </button>
          </div>
        )}

        {/* Selected state */}
        {displayName && selected !== 'other' && (
          <p className="font-inter text-xs mt-5 uppercase tracking-widest"
            style={{ color: 'rgba(255,255,255,0.25)', textAlign: compact ? 'left' : 'center' }}>
            Arena: <span className="text-ak-cyan">{displayName}</span> — {t('ui.sport_selector_sub', 'tap to change')}
          </p>
        )}
      </div>
    </div>
  );
}
