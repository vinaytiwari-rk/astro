import React, { useEffect, useState } from 'react';
import { Loader2, MapPin, Search, X } from 'lucide-react';
import { getCityDatabase, type CityEntry } from '../data/cities';
import { useCitySearch } from '../hooks/useCitySearch';
import { useLanguage } from '../i18n/LanguageContext';

interface CitySearchModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (city: CityEntry) => void;
}

export const CitySearchModal: React.FC<CitySearchModalProps> = ({ open, onClose, onSelect }) => {
  const { lang, t } = useLanguage();
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  const { results: searchResults, isSearchingOnline, trimmedQuery } = useCitySearch({
    query,
    lang,
    active: open,
    minChars: 1,
    limit: 45,
  });

  const results = trimmedQuery.length === 0 ? getCityDatabase().slice(0, 40) : searchResults;

  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card modal-md" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-row">
            <MapPin size={18} />
            <h3>
              {lang === 'hi'
                ? 'विश्व शहर व स्थान खोज (246 देश, 1.7 लाख+ स्थान + ऑनलाइन)'
                : 'Global Place Search (246 Countries, 171k+ Atlas + Online)'}
            </h3>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label={t.common.close}>
            <X size={18} />
          </button>
        </div>

        <div className="search-input-wrap">
          <Search size={16} />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              lang === 'hi'
                ? 'कम से कम 3 अक्षर लिखें (जैसे Vri, Math, Pokh, Dub, New York, London)...'
                : 'Type 3+ characters for city, town, district, or country (e.g. Vri, Math, Dubai, London)...'
            }
            className="text-input"
          />
          {isSearchingOnline && <Loader2 size={16} className="spin-icon muted" />}
        </div>

        <div className="atlas-status-strip">
          <span>
            {trimmedQuery.length < 3
              ? lang === 'hi'
                ? 'तत्काल सुझाव व विश्वव्यापी गाँव/कस्बा खोजने हेतु 3+ अक्षर टाइप करें।'
                : 'Type 3+ characters to search 171,737 offline towns & global GeoNames online.'
              : lang === 'hi'
                ? `"${trimmedQuery}" के लिए ${results.length} परिणाम${isSearchingOnline ? ' (ऑनलाइन खोज जारी...)' : ''}`
                : `${results.length} matches for "${trimmedQuery}"${isSearchingOnline ? ' (checking global places...)' : ''}`}
          </span>
        </div>

        <div className="city-list">
          {results.length === 0 ? (
            <div className="empty-state">
              {isSearchingOnline
                ? lang === 'hi'
                  ? 'विश्व डेटाबेस से स्थान खोजे जा रहे हैं...'
                  : 'Searching worldwide places...'
                : lang === 'hi'
                  ? 'कोई शहर नहीं मिला। आप जन्म विवरण में अक्षांश/देशांतर सीधे भी दर्ज कर सकते हैं।'
                  : 'No matching cities found. You can enter coordinates manually in the Birth Editor.'}
            </div>
          ) : (
            results.map((c, idx) => (
              <button
                key={`${c.city}-${c.country}-${c.lat}-${c.lng}-${idx}`}
                type="button"
                className="city-row"
                onClick={() => {
                  onSelect(c);
                  onClose();
                }}
              >
                <div>
                  <div className="city-name">
                    {c.city}
                    {c.province ? <span className="city-meta"> · {c.province}</span> : null}
                  </div>
                  <div className="city-country">
                    {c.country}
                    {c.source === 'online' && (
                      <span className="source-pill">
                        {lang === 'hi' ? 'ऑनलाइन' : 'Global'}
                      </span>
                    )}
                  </div>
                </div>
                <div className="city-coords">
                  <span>
                    {Math.abs(c.lat).toFixed(4)}°{c.lat >= 0 ? 'N' : 'S'},{' '}
                    {Math.abs(c.lng).toFixed(4)}°{c.lng >= 0 ? 'E' : 'W'}
                  </span>
                  <span className="tz-pill">{c.timezone}</span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
