import React, { useEffect, useState } from 'react';
import { Loader2, Search } from 'lucide-react';
import type { CityEntry } from '../data/cities';
import { useCitySearch } from '../hooks/useCitySearch';
import type { AppLanguage } from '../i18n/translations';

interface InlineCityAutocompleteProps {
  value: string;
  country?: string;
  lang: AppLanguage;
  placeholder?: string;
  onChangeText: (text: string) => void;
  onSelectCity: (city: CityEntry) => void;
}

/**
 * Compact 3-character global city autocomplete input with keyboard navigation.
 */
export const InlineCityAutocomplete: React.FC<InlineCityAutocompleteProps> = ({
  value,
  country,
  lang,
  placeholder,
  onChangeText,
  onSelectCity,
}) => {
  const [open, setOpen] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(0);

  const { results, isSearchingOnline } = useCitySearch({
    query: value,
    lang,
    active: open,
    minChars: 3,
    limit: 20,
  });

  useEffect(() => {
    setHighlightIdx(0);
  }, [results.length, value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || results.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIdx((i) => (i + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIdx((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const picked = results[highlightIdx] || results[0];
      if (picked) {
        onSelectCity(picked);
        setOpen(false);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
    }
  };

  return (
    <div className="place-autocomplete-wrap">
      <div className="place-input-shell">
        <Search size={13} className="place-input-icon" />
        <input
          type="text"
          className="text-input place-input-with-icon"
          value={value}
          autoComplete="off"
          placeholder={
            placeholder ||
            (lang === 'hi'
              ? 'शहर के 3 अक्षर लिखें...'
              : 'Type 3+ city letters...')
          }
          onChange={(e) => {
            onChangeText(e.target.value);
            setOpen(e.target.value.trim().length > 0);
          }}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            window.setTimeout(() => setOpen(false), 160);
          }}
        />
        {isSearchingOnline && (
          <Loader2 size={13} className="place-input-spinner spin-icon" />
        )}
      </div>

      {country && !open && (
        <div className="portal-city-sub">
          {country}
        </div>
      )}

      {open && value.trim().length > 0 && value.trim().length < 3 && (
        <div className="place-min-hint">
          {lang === 'hi' ? 'कम से कम 3 अक्षर लिखें...' : 'Type at least 3 letters...'}
        </div>
      )}

      {open && value.trim().length >= 3 && (
        <div className="place-suggest-dropdown" role="listbox">
          {results.length === 0 ? (
            <div className="place-suggest-empty">
              {isSearchingOnline
                ? lang === 'hi'
                  ? 'खोज जारी है...'
                  : 'Searching global places...'
                : lang === 'hi'
                  ? 'कोई परिणाम नहीं मिला'
                  : 'No direct match found'}
            </div>
          ) : (
            results.map((c, idx) => (
              <button
                key={`${c.city}-${c.country}-${c.lat}-${c.lng}-${idx}`}
                type="button"
                role="option"
                aria-selected={idx === highlightIdx}
                className={`place-suggest-item ${idx === highlightIdx ? 'is-active' : ''}`}
                onMouseEnter={() => setHighlightIdx(idx)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  onSelectCity(c);
                  setOpen(false);
                }}
              >
                <div className="place-suggest-main">
                  <div className="place-suggest-title">
                    <strong>{c.city}</strong>
                    {c.province ? <span className="city-meta"> · {c.province}</span> : null}
                  </div>
                  <div className="city-country">{c.country}</div>
                </div>
                <div className="city-coords">
                  <span>
                    {Math.abs(c.lat).toFixed(1)}°{c.lat >= 0 ? 'N' : 'S'},{' '}
                    {Math.abs(c.lng).toFixed(1)}°{c.lng >= 0 ? 'E' : 'W'}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};
