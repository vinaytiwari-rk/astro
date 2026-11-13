import React, { useEffect, useState } from 'react';
import { Loader2, MapPin, Search } from 'lucide-react';
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
 * Compact 3-character global city autocomplete input with GPS geolocation & online assistance.
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
  const [isLocating, setIsLocating] = useState(false);

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

  const handleLocateMe = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!navigator.geolocation) {
      alert(
        lang === 'hi'
          ? 'आपके ब्राउज़र में जीपीएस स्थान सेवा समर्थित नहीं है।'
          : 'GPS geolocation is not supported by your browser.'
      );
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`
          );
          if (res.ok) {
            const data = await res.json();
            const cityName =
              data.address?.city ||
              data.address?.town ||
              data.address?.village ||
              data.address?.suburb ||
              data.address?.county ||
              'Current Location';
            const countryName = data.address?.country || 'Current Region';
            const provinceName = data.address?.state || data.address?.region || '';
            const tz =
              Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata';

            onSelectCity({
              city: cityName,
              cityAscii: cityName,
              country: countryName,
              province: provinceName,
              lat,
              lng,
              pop: 100000,
              timezone: tz,
              source: 'online',
            });
          } else {
            fallbackGps(lat, lng);
          }
        } catch {
          fallbackGps(lat, lng);
        } finally {
          setIsLocating(false);
        }
      },
      () => {
        setIsLocating(false);
        alert(
          lang === 'hi'
            ? 'जीपीएस स्थान प्राप्त करने की अनुमति नहीं मिली।'
            : 'Unable to access your current GPS location.'
        );
      },
      { timeout: 9000, enableHighAccuracy: true }
    );
  };

  const fallbackGps = (lat: number, lng: number) => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata';
    const cityName = `${lat >= 0 ? lat.toFixed(2) + '°N' : Math.abs(lat).toFixed(2) + '°S'}, ${
      lng >= 0 ? lng.toFixed(2) + '°E' : Math.abs(lng).toFixed(2) + '°W'
    }`;
    onSelectCity({
      city: cityName,
      cityAscii: cityName,
      country: 'GPS Location',
      province: '',
      lat,
      lng,
      pop: 100000,
      timezone: tz,
      source: 'online',
    });
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

        {/* GPS Geolocation Online Assistance Button */}
        <button
          type="button"
          className="place-gps-btn"
          onClick={handleLocateMe}
          title={
            lang === 'hi'
              ? 'वर्तमान जीपीएस स्थान प्राप्त करें (ऑनलाइन सहायता)'
              : 'Use My Current GPS Location (Online Geolocation)'
          }
          disabled={isLocating}
          aria-label="Use Current Location"
        >
          {isLocating ? (
            <Loader2 size={13} className="spin-icon" style={{ color: 'var(--accent)' }} />
          ) : (
            <MapPin size={13} style={{ color: 'var(--accent)' }} />
          )}
        </button>

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
          {lang === 'hi' ? 'कम से कम 3 अक्षर लिखें या 📍 जीपीएस दबाएँ...' : 'Type 3+ letters or click 📍 GPS...'}
        </div>
      )}

      {open && value.trim().length >= 3 && (
        <div className="place-suggest-dropdown" role="listbox">
          {results.length === 0 ? (
            <div className="place-suggest-empty">
              {isSearchingOnline
                ? lang === 'hi'
                  ? 'ऑनलाइन एटलस में खोज जारी है...'
                  : 'Searching online global atlas...'
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
