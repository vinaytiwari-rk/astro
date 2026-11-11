import React, { useEffect, useState } from 'react';
import { Globe, Loader2, MapPin, Save, Search, Sparkles, Trash2, X } from 'lucide-react';
import { formatDateDmy, formatOffsetString, getIanaOffsetMinutes, parseOffsetString } from '../astro/time';
import type { BirthInput } from '../astro/types';
import {
  lookupTimezoneFromCoords,
  preloadExpandedAtlas,
  type CityEntry,
} from '../data/cities';
import { useCitySearch } from '../hooks/useCitySearch';
import { useLanguage } from '../i18n/LanguageContext';
import { CitySearchModal } from './CitySearchModal';
import { DateDmyInput } from './DateDmyInput';

interface BirthEditorModalProps {
  open: boolean;
  initial: BirthInput;
  profiles?: BirthInput[];
  onClose: () => void;
  onApply: (input: BirthInput, saveAsNew: boolean) => void;
  onSelectProfile?: (id: string) => void;
  onDeleteProfile?: (id: string) => void;
}

export const BirthEditorModal: React.FC<BirthEditorModalProps> = ({
  open,
  initial,
  profiles = [],
  onClose,
  onApply,
  onSelectProfile,
  onDeleteProfile,
}) => {
  const { lang, t } = useLanguage();
  const [form, setForm] = useState<BirthInput>(initial);
  const [cityModalOpen, setCityModalOpen] = useState(false);
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(0);
  const [manualTz, setManualTz] = useState(initial.timezone === 'MANUAL');
  const [offsetText, setOffsetText] = useState(() =>
    initial.timezone === 'MANUAL'
      ? formatOffsetString(initial.utcOffsetMinutes ?? 330)
      : formatOffsetString(getIanaOffsetMinutes(initial.date, initial.time, initial.timezone))
  );

  useEffect(() => {
    if (open) {
      setForm(initial);
      setSuggestOpen(false);
      setHighlightIdx(0);
      void preloadExpandedAtlas();
      const isManual = initial.timezone === 'MANUAL';
      setManualTz(isManual);
      setOffsetText(
        isManual
          ? formatOffsetString(initial.utcOffsetMinutes ?? 330)
          : formatOffsetString(getIanaOffsetMinutes(initial.date, initial.time, initial.timezone))
      );
    }
  }, [open, initial]);

  const { results: citySuggestions, isSearchingOnline } = useCitySearch({
    query: form.city,
    lang,
    active: open && suggestOpen,
    minChars: 3,
    limit: 25,
  });

  useEffect(() => {
    setHighlightIdx(0);
  }, [citySuggestions.length, form.city]);

  if (!open) return null;

  const handleCitySelect = (c: CityEntry) => {
    const updated = {
      ...form,
      city: c.city,
      country: c.country,
      latitude: Math.round(c.lat * 10000) / 10000,
      longitude: Math.round(c.lng * 10000) / 10000,
      timezone: c.timezone,
    };
    setForm(updated);
    setSuggestOpen(false);
    setManualTz(false);
    setOffsetText(formatOffsetString(getIanaOffsetMinutes(updated.date, updated.time, c.timezone)));
  };

  const handleAutoDetectTz = () => {
    const detected = lookupTimezoneFromCoords(form.latitude, form.longitude);
    setForm((prev) => ({ ...prev, timezone: detected }));
    setManualTz(false);
    setOffsetText(formatOffsetString(getIanaOffsetMinutes(form.date, form.time, detected)));
  };

  const handlePlaceKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!suggestOpen || citySuggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIdx((i) => (i + 1) % citySuggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIdx((i) => (i - 1 + citySuggestions.length) % citySuggestions.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const picked = citySuggestions[highlightIdx] || citySuggestions[0];
      if (picked) handleCitySelect(picked);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setSuggestOpen(false);
    }
  };

  const handleSubmit = (saveAsNew: boolean) => {
    let finalForm = { ...form };
    if (manualTz) {
      const parsed = parseOffsetString(offsetText);
      finalForm.timezone = 'MANUAL';
      finalForm.utcOffsetMinutes = parsed ?? 0;
    } else {
      finalForm.utcOffsetMinutes = undefined;
    }
    if (saveAsNew) {
      finalForm.id = `chart-${Date.now()}`;
    }
    onApply(finalForm, saveAsNew);
    onClose();
  };

  const previewAutoOffset =
    !manualTz && form.timezone !== 'MANUAL'
      ? formatOffsetString(getIanaOffsetMinutes(form.date, form.time, form.timezone))
      : offsetText;

  return (
    <>
      <div className="modal-backdrop" onClick={onClose}>
        <div className="modal-card modal-lg" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <div className="modal-title-row">
              <Sparkles size={18} />
              <h3>{lang === 'hi' ? 'जन्म / प्रश्न विवरण एवं निर्देशांक' : 'Birth / Event Data & Coordinates'}</h3>
            </div>
            <button type="button" className="icon-btn" onClick={onClose} aria-label={t.common.close}>
              <X size={18} />
            </button>
          </div>

          <div className="form-grid">
            <label className="field span-2">
              <span>{lang === 'hi' ? 'जातक / प्रश्न का नाम' : 'Native / Event Name'}</span>
              <input
                type="text"
                className="text-input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder={lang === 'hi' ? 'जैसे: जातक का नाम या प्रश्न' : 'e.g. Native Name or Prashna Query'}
              />
            </label>

            <label className="field">
              <span>{lang === 'hi' ? 'लिंग' : 'Gender'}</span>
              <select
                className="text-input"
                value={form.gender || 'other'}
                onChange={(e) =>
                  setForm({ ...form, gender: e.target.value as BirthInput['gender'] })
                }
              >
                <option value="male">{lang === 'hi' ? 'पुरुष' : 'Male'}</option>
                <option value="female">{lang === 'hi' ? 'महिला' : 'Female'}</option>
                <option value="other">{lang === 'hi' ? 'अन्य / सामान्य' : 'Other / Neutral'}</option>
              </select>
            </label>

            <label className="field">
              <span>{lang === 'hi' ? 'जन्म तिथि (DD-MM-YYYY)' : 'Birth Date (DD-MM-YYYY)'}</span>
              <DateDmyInput
                value={form.date}
                ariaLabel={lang === 'hi' ? 'जन्म तिथि (DD-MM-YYYY)' : 'Birth Date (DD-MM-YYYY)'}
                onChange={(iso) => setForm({ ...form, date: iso })}
              />
            </label>

            <label className="field">
              <span>{lang === 'hi' ? 'जन्म समय (24 घंटे HH:MM:SS)' : 'Birth Time (24h HH:MM:SS)'}</span>
              <input
                type="time"
                step="1"
                className="text-input mono"
                value={form.time}
                onChange={(e) =>
                  setForm({
                    ...form,
                    time: e.target.value.length === 5 ? `${e.target.value}:00` : e.target.value,
                  })
                }
              />
            </label>

            <div className="field span-2">
              <div className="tz-header-row">
                <span>
                  {lang === 'hi'
                    ? 'जन्म स्थान (3 अक्षर लिखते ही सुझाव दिखेंगे)'
                    : 'Place of Birth (type 3+ letters for instant suggestions)'}
                </span>
                {form.country && (
                  <span className="hint-text">
                    {lang === 'hi' ? 'देश:' : 'Country:'} <strong>{form.country}</strong>
                  </span>
                )}
              </div>
              <div className="inline-row">
                <div className="place-autocomplete-wrap">
                  <div className="place-input-shell">
                    <Search size={14} className="place-input-icon" />
                    <input
                      type="text"
                      className="text-input place-input-with-icon"
                      value={form.city}
                      autoComplete="off"
                      onChange={(e) => {
                        const val = e.target.value;
                        setForm({ ...form, city: val });
                        setSuggestOpen(val.trim().length > 0);
                      }}
                      onKeyDown={handlePlaceKeyDown}
                      onBlur={() => {
                        window.setTimeout(() => setSuggestOpen(false), 160);
                      }}
                      placeholder={
                        lang === 'hi'
                          ? 'कम से कम 3 अक्षर लिखें (जैसे Var, Mat, Vrind, Lon, Dub)...'
                          : 'Type 3+ characters (e.g. Var, Mat, Vrind, Lon, Dub)...'
                      }
                    />
                    {isSearchingOnline && (
                      <Loader2 size={14} className="place-input-spinner spin-icon" />
                    )}
                  </div>

                  {suggestOpen && form.city.trim().length > 0 && form.city.trim().length < 3 && (
                    <div className="place-min-hint">
                      {lang === 'hi'
                        ? 'सुझाव देखने के लिए कम से कम 3 अक्षर टाइप करें...'
                        : 'Type at least 3 characters to see global city suggestions...'}
                    </div>
                  )}

                  {suggestOpen && form.city.trim().length >= 3 && (
                    <div
                      className="place-suggest-dropdown"
                      role="listbox"
                      aria-label={lang === 'hi' ? 'स्थान सुझाव' : 'Place Suggestions'}
                    >
                      <div className="place-suggest-header">
                        <span>
                          {lang === 'hi'
                            ? `${citySuggestions.length} स्थान मिले (विश्व एटलस + ऑनलाइन)`
                            : `${citySuggestions.length} places found (Global Atlas + Online)`}
                        </span>
                        {isSearchingOnline && (
                          <span className="hint-text">
                            {lang === 'hi' ? 'अधिक स्थान खोज रहे हैं...' : 'Fetching global places...'}
                          </span>
                        )}
                      </div>

                      {citySuggestions.length === 0 ? (
                        <div className="place-suggest-empty">
                          {isSearchingOnline
                            ? lang === 'hi'
                              ? 'विश्व डेटाबेस में खोज जारी है...'
                              : 'Searching worldwide places...'
                            : lang === 'hi'
                              ? 'कोई सीधा परिणाम नहीं मिला — "शहर एटलस" खोलें या अक्षांश/देशांतर स्वयं भरें।'
                              : 'No direct match yet — try "Browse Atlas" or enter coordinates manually.'}
                        </div>
                      ) : (
                        citySuggestions.map((c, idx) => (
                          <button
                            key={`${c.city}-${c.country}-${c.lat}-${c.lng}-${idx}`}
                            type="button"
                            role="option"
                            aria-selected={idx === highlightIdx}
                            className={`place-suggest-item ${idx === highlightIdx ? 'is-active' : ''}`}
                            onMouseEnter={() => setHighlightIdx(idx)}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              handleCitySelect(c);
                            }}
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
                                    {lang === 'hi' ? 'ऑनलाइन' : 'Global'}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="city-coords">
                              <span>
                                {Math.abs(c.lat).toFixed(2)}°{c.lat >= 0 ? 'N' : 'S'},{' '}
                                {Math.abs(c.lng).toFixed(2)}°{c.lng >= 0 ? 'E' : 'W'}
                              </span>
                              <span className="tz-pill">{c.timezone}</span>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setCityModalOpen(true)}
                >
                  <MapPin size={15} />
                  {lang === 'hi' ? 'शहर एटलस' : 'Browse Atlas'}
                </button>
              </div>
            </div>

            <label className="field">
              <span>{lang === 'hi' ? 'अक्षांश (+उत्तर / -दक्षिण)' : 'Latitude (+North / -South)'}</span>
              <input
                type="number"
                step="0.0001"
                min="-89.9"
                max="89.9"
                className="text-input mono"
                value={form.latitude}
                onChange={(e) =>
                  setForm({ ...form, latitude: parseFloat(e.target.value) || 0 })
                }
              />
            </label>

            <label className="field">
              <span>{lang === 'hi' ? 'देशांतर (+पूर्व / -पश्चिम)' : 'Longitude (+East / -West)'}</span>
              <input
                type="number"
                step="0.0001"
                min="-180"
                max="180"
                className="text-input mono"
                value={form.longitude}
                onChange={(e) =>
                  setForm({ ...form, longitude: parseFloat(e.target.value) || 0 })
                }
              />
            </label>

            <div className="field span-2">
              <div className="tz-header-row">
                <span>{lang === 'hi' ? 'समय क्षेत्र एवं UTC अंतर' : 'Timezone & UTC Offset'}</span>
                <label className="checkbox-inline">
                  <input
                    type="checkbox"
                    checked={manualTz}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setManualTz(checked);
                      if (checked) {
                        setOffsetText(previewAutoOffset);
                      }
                    }}
                  />
                  <span>{lang === 'hi' ? 'मैन्युअल UTC अंतर दर्ज करें' : 'Override UTC Offset Manually'}</span>
                </label>
              </div>
              {manualTz ? (
                <div className="inline-row">
                  <input
                    type="text"
                    className="text-input mono"
                    value={offsetText}
                    onChange={(e) => setOffsetText(e.target.value)}
                    placeholder="+05:30 or -05:00"
                  />
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={handleAutoDetectTz}
                    title={lang === 'hi' ? 'अक्षांश/देशांतर से स्वतः समय क्षेत्र खोजें' : 'Detect Timezone from Coordinates'}
                  >
                    {lang === 'hi' ? 'ऑटो TZ' : 'Auto TZ'}
                  </button>
                </div>
              ) : (
                <div className="tz-readonly-box">
                  <Globe size={15} />
                  <span>{form.timezone}</span>
                  <span className="tz-pill">{lang === 'hi' ? 'प्रभावी UTC' : 'Effective UTC'} {previewAutoOffset}</span>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={handleAutoDetectTz}
                    title={lang === 'hi' ? 'निर्देशांक से समय क्षेत्र अद्यतन करें' : 'Refresh Timezone from Lat/Lng'}
                  >
                    {lang === 'hi' ? 'अद्यतन' : 'Sync'}
                  </button>
                </div>
              )}
            </div>

            <label className="field span-3">
              <span>{t.common.notes}</span>
              <input
                type="text"
                className="text-input"
                value={form.notes || ''}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder={lang === 'hi' ? 'वैकल्पिक कुंडली टिप्पणी...' : 'Optional birth chart notes...'}
              />
            </label>

            {profiles.length > 1 && onDeleteProfile && (
              <div className="field span-3">
                <span>
                  {lang === 'hi'
                    ? `सहेजी गई प्रोफ़ाइलें (${profiles.length}) — चुनें या हटाएँ`
                    : `Saved Profiles (${profiles.length}) — Switch or Delete`}
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                  {profiles.map((p) => {
                    const isCur = p.id === initial.id;
                    return (
                      <div
                        key={p.id}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          padding: '4px 8px',
                          borderRadius: 6,
                          border: isCur ? '1px solid var(--accent)' : '1px solid var(--border)',
                          background: isCur ? 'var(--bg-subtle)' : 'transparent',
                          fontSize: 12,
                        }}
                      >
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          style={{ padding: 0, height: 'auto' }}
                          onClick={() => onSelectProfile?.(p.id)}
                        >
                          <strong>{p.name}</strong> ({formatDateDmy(p.date)})
                        </button>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          style={{ padding: '2px 4px', height: 'auto', color: 'var(--bad)' }}
                          title={lang === 'hi' ? `${p.name} को हटाएँ` : `Delete ${p.name}`}
                          onClick={() => onDeleteProfile(p.id)}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button type="button" className="btn btn-ghost" onClick={onClose}>
                {t.common.cancel}
              </button>
              {profiles.length > 1 && onDeleteProfile && (
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  style={{ color: 'var(--bad)' }}
                  onClick={() => {
                    onDeleteProfile(initial.id);
                    onClose();
                  }}
                >
                  <Trash2 size={14} />
                  <span>{lang === 'hi' ? 'प्रोफ़ाइल हटाएँ' : 'Delete Profile'}</span>
                </button>
              )}
            </div>
            <div className="footer-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => handleSubmit(true)}
              >
                {t.common.saveNew}
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleSubmit(false)}
              >
                <Save size={15} />
                {t.common.saveApply}
              </button>
            </div>
          </div>
        </div>
      </div>

      <CitySearchModal
        open={cityModalOpen}
        onClose={() => setCityModalOpen(false)}
        onSelect={handleCitySelect}
      />
    </>
  );
};
