import React, { useEffect, useRef, useState } from 'react';
import { Loader2, MapPin, Search } from 'lucide-react';
import { lookupTimezoneFromCoords, type CityEntry } from '../data/cities';
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
 * High-precision, zero-gap global city autocomplete with smart upward/downward positioning,
 * instant 1-character local atlas matching, and online GPS reverse geocoding.
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
  const [openUpward, setOpenUpward] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);

  const { results, isSearchingOnline } = useCitySearch({
    query: value,
    lang,
    active: open,
    minChars: 1,
    limit: 25,
  });

  useEffect(() => {
    setHighlightIdx(0);
  }, [results.length, value]);

  // Click outside to safely close dropdown without blur race conditions
  useEffect(() => {
    const handleOutside = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('touchstart', handleOutside);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
    };
  }, []);

  // Smart upward/downward positioning check to ensure suggestions are never below the screen
  useEffect(() => {
    if (open && shellRef.current) {
      const rect = shellRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;
      // If less than 240px below and more room above, flip upward
      setOpenUpward(spaceBelow < 240 && spaceAbove > spaceBelow);
    }
  }, [open, results.length]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || results.length === 0) {
      if (e.key === 'ArrowDown' && value.trim().length >= 1) {
        setOpen(true);
      }
      return;
    }
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
        handlePickCity(picked);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
    }
  };

  const handlePickCity = (c: CityEntry) => {
    onSelectCity(c);
    setOpen(false);
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
          // 1. Try Nominatim reverse geocode
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
              lookupTimezoneFromCoords(lat, lng) ||
              Intl.DateTimeFormat().resolvedOptions().timeZone ||
              'Asia/Kolkata';

            handlePickCity({
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
            return;
          }
          // 2. Fallback to Photon
          await fallbackPhoton(lat, lng);
        } catch {
          await fallbackPhoton(lat, lng);
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

  const fallbackPhoton = async (lat: number, lng: number) => {
    try {
      const res = await fetch(`https://photon.komoot.io/reverse?lat=${lat}&lon=${lng}`);
      if (res.ok) {
        const data = await res.json();
        const feat = data.features?.[0]?.properties;
        if (feat) {
          const cityName = feat.city || feat.name || feat.district || 'Current Location';
          const countryName = feat.country || 'Current Region';
          const provinceName = feat.state || '';
          const tz = lookupTimezoneFromCoords(lat, lng) || 'Asia/Kolkata';
          handlePickCity({
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
          return;
        }
      }
    } catch {
      // ignore
    }
    fallbackCoords(lat, lng);
  };

  const fallbackCoords = (lat: number, lng: number) => {
    const tz = lookupTimezoneFromCoords(lat, lng) || 'Asia/Kolkata';
    const cityName = `${lat >= 0 ? lat.toFixed(2) + '°N' : Math.abs(lat).toFixed(2) + '°S'}, ${
      lng >= 0 ? lng.toFixed(2) + '°E' : Math.abs(lng).toFixed(2) + '°W'
    }`;
    handlePickCity({
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
    <div className="place-autocomplete-wrap" ref={containerRef}>
      <div className="place-input-shell" ref={shellRef}>
        <Search size={13} className="place-input-icon" />
        <input
          type="text"
          className="text-input place-input-with-icon"
          value={value}
          autoComplete="off"
          placeholder={
            placeholder ||
            (lang === 'hi'
              ? 'शहर का नाम लिखें (जैसे Delhi, Mumbai, Varanasi)...'
              : 'Type city name (e.g. Delhi, Mumbai, Varanasi)...')
          }
          onFocus={() => {
            if (value.trim().length >= 1) setOpen(true);
          }}
          onChange={(e) => {
            onChangeText(e.target.value);
            setOpen(e.target.value.trim().length >= 1);
          }}
          onKeyDown={handleKeyDown}
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

        {/* Suggestions Dropdown Anchored Directly To Input Shell */}
        {open && value.trim().length >= 1 && (
          <div
            className={`place-suggest-dropdown ${openUpward ? 'is-upward' : ''}`}
            role="listbox"
          >
            <div className="place-suggest-header">
              <span>
                {results.length > 0
                  ? lang === 'hi'
                    ? `${results.length} स्थान मिले (एटलस + ऑनलाइन)`
                    : `${results.length} places found`
                  : lang === 'hi'
                    ? 'स्थान खोज'
                    : 'City Search'}
              </span>
              {isSearchingOnline && (
                <span style={{ fontSize: '10.5px', color: 'var(--accent)', fontWeight: 600 }}>
                  {lang === 'hi' ? 'खोज जारी...' : 'Searching...'}
                </span>
              )}
            </div>

            {results.length === 0 ? (
              <div className="place-suggest-empty">
                {isSearchingOnline
                  ? lang === 'hi'
                    ? 'विश्व डेटाबेस में खोज जारी है...'
                    : 'Searching worldwide database...'
                  : lang === 'hi'
                    ? 'कोई परिणाम नहीं मिला — नाम की स्पेलिंग जांचें या जीपीएस दबाएँ'
                    : 'No direct match — check spelling or tap 📍 GPS'}
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
                  onPointerDown={(e) => {
                    e.preventDefault();
                    handlePickCity(c);
                  }}
                  onClick={() => handlePickCity(c)}
                >
                  <div className="place-suggest-main">
                    <div className="place-suggest-title">
                      <strong>{c.city}</strong>
                      {c.province ? <span className="city-meta"> · {c.province}</span> : null}
                    </div>
                    <div className="city-country">
                      {c.country}
                      {c.source === 'online' && (
                        <span className="source-pill">
                          {lang === 'hi' ? 'ऑनलाइन' : 'Online'}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="city-coords">
                    <span>
                      {Math.abs(c.lat).toFixed(2)}°{c.lat >= 0 ? 'N' : 'S'},{' '}
                      {Math.abs(c.lng).toFixed(2)}°{c.lng >= 0 ? 'E' : 'W'}
                    </span>
                    {c.timezone && <span className="tz-pill">{c.timezone}</span>}
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {country && !open && (
        <div className="portal-city-sub">
          {country}
        </div>
      )}
    </div>
  );
};
