import React, { useEffect, useState } from 'react';
import { Globe, Loader2, MapPin, Save, Search, Sparkles, Trash2, X } from 'lucide-react';
import { formatDateDmy, formatOffsetString, getIanaOffsetMinutes, parseOffsetString } from '../astro/time';
import type { BirthInput } from '../astro/types';
import {
  lookupTimezoneFromCoords,
  preloadExpandedAtlas,
  type CityEntry,
} from '../data/cities';
import { useLanguage } from '../i18n/LanguageContext';
import { CitySearchModal } from './CitySearchModal';
import { DateDmyInput } from './DateDmyInput';
import { InlineCityAutocomplete } from './InlineCityAutocomplete';

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
  const [manualTz, setManualTz] = useState(initial.timezone === 'MANUAL');
  const [offsetText, setOffsetText] = useState(() =>
    initial.timezone === 'MANUAL'
      ? formatOffsetString(initial.utcOffsetMinutes ?? 330)
      : formatOffsetString(getIanaOffsetMinutes(initial.date, initial.time, initial.timezone))
  );

  useEffect(() => {
    if (open) {
      setForm(initial);
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
    setManualTz(false);
    setOffsetText(formatOffsetString(getIanaOffsetMinutes(updated.date, updated.time, c.timezone)));
  };

  const handleAutoDetectTz = () => {
    const detected = lookupTimezoneFromCoords(form.latitude, form.longitude);
    setForm((prev) => ({ ...prev, timezone: detected }));
    setManualTz(false);
    setOffsetText(formatOffsetString(getIanaOffsetMinutes(form.date, form.time, detected)));
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
                  {lang === 'hi' ? 'जन्म स्थान' : 'Place of Birth'}
                </span>
                {form.country && (
                  <span className="hint-text">
                    {lang === 'hi' ? 'देश:' : 'Country:'} <strong>{form.country}</strong>
                  </span>
                )}
              </div>
              <div className="inline-row">
                <InlineCityAutocomplete
                  value={form.city}
                  country={form.country}
                  lang={lang}
                  placeholder={
                    lang === 'hi'
                      ? 'शहर का नाम लिखें (जैसे Delhi, Mumbai, Varanasi)...'
                      : 'Type city name (e.g. Delhi, Mumbai, Varanasi)...'
                  }
                  onChangeText={(val) => setForm({ ...form, city: val })}
                  onSelectCity={handleCitySelect}
                />
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setCityModalOpen(true)}
                  title={lang === 'hi' ? 'शहर एटलस से चुनें' : 'Browse Atlas'}
                >
                  <MapPin size={15} />
                  <span>{lang === 'hi' ? 'एटलस' : 'Atlas'}</span>
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
