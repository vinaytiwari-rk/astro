import React from 'react';
import { Sliders, X } from 'lucide-react';
import { AYANAMSA_META } from '../astro/constants';
import type {
  AyanamsaId,
  CalcSettings,
  ChartStyle,
  DashaYearType,
  HouseSystem,
  NodeMode,
} from '../astro/types';
import { useLanguage } from '../i18n/LanguageContext';

interface SettingsModalProps {
  open: boolean;
  settings: CalcSettings;
  onChange: (next: CalcSettings) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  open,
  settings,
  onChange,
  onClose,
}) => {
  const { lang, t } = useLanguage();
  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card modal-md" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-row">
            <Sliders size={18} />
            <h3>{lang === 'hi' ? 'ज्योतिष गणना एवं प्रदर्शन प्राथमिकताएँ' : 'Calculation & Display Preferences'}</h3>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label={t.common.close}>
            <X size={18} />
          </button>
        </div>

        <div className="settings-stack">
          <label className="field">
            <span>{lang === 'hi' ? 'अयनांश प्रणाली' : 'Ayanamsa System'}</span>
            <select
              className="text-input"
              value={settings.ayanamsa}
              onChange={(e) =>
                onChange({ ...settings, ayanamsa: e.target.value as AyanamsaId })
              }
            >
              {(Object.keys(AYANAMSA_META) as AyanamsaId[]).map((k) => (
                <option key={k} value={k}>
                  {t.ayanamsaLabels[k] ?? AYANAMSA_META[k].label}
                </option>
              ))}
            </select>
            <span className="hint-text">{AYANAMSA_META[settings.ayanamsa].description}</span>
          </label>

          <div className="settings-row-2">
            <label className="field">
              <span>{lang === 'hi' ? 'कुंडली शैली' : 'Chart Style'}</span>
              <select
                className="text-input"
                value={settings.chartStyle}
                onChange={(e) =>
                  onChange({ ...settings, chartStyle: e.target.value as ChartStyle })
                }
              >
                <option value="north">{t.chartStyles.north}</option>
                <option value="south">{t.chartStyles.south}</option>
                <option value="east">{t.chartStyles.east}</option>
              </select>
            </label>

            <label className="field">
              <span>{lang === 'hi' ? 'भाव प्रणाली (House System)' : 'House System (Bhava)'}</span>
              <select
                className="text-input"
                value={settings.houseSystem}
                onChange={(e) =>
                  onChange({ ...settings, houseSystem: e.target.value as HouseSystem })
                }
              >
                <option value="whole_sign">{t.houseSystems.whole_sign}</option>
                <option value="sripati">{t.houseSystems.sripati}</option>
                <option value="equal">{t.houseSystems.equal}</option>
              </select>
            </label>
          </div>

          <div className="settings-row-2">
            <label className="field">
              <span>{lang === 'hi' ? 'छाया ग्रह (राहु / केतु)' : 'Lunar Nodes (Rahu / Ketu)'}</span>
              <select
                className="text-input"
                value={settings.nodeMode}
                onChange={(e) =>
                  onChange({ ...settings, nodeMode: e.target.value as NodeMode })
                }
              >
                <option value="mean">{lang === 'hi' ? 'मध्य राहु-केतु (पारंपरिक मानक)' : 'Mean Node (Classical Default)'}</option>
                <option value="true">{lang === 'hi' ? 'स्पष्ट राहु-केतु (True Node)' : 'True Osculating Node'}</option>
              </select>
            </label>

            <label className="field">
              <span>{lang === 'hi' ? 'दशा वर्ष मान' : 'Dasha Year Length'}</span>
              <select
                className="text-input"
                value={settings.dashaYearType}
                onChange={(e) =>
                  onChange({ ...settings, dashaYearType: e.target.value as DashaYearType })
                }
              >
                <option value="tropical">{lang === 'hi' ? '365.2425 दिन (सौर वर्ष)' : '365.2425 days (Solar Year)'}</option>
                <option value="sidereal">{lang === 'hi' ? '365.2564 दिन (नक्षत्र वर्ष)' : '365.2564 days (Sidereal Year)'}</option>
                <option value="savana">{lang === 'hi' ? '360.0000 दिन (सावन वर्ष)' : '360.0000 days (Savana Year)'}</option>
              </select>
            </label>
          </div>

          <div className="settings-row-2">
            <label className="field">
              <span>{lang === 'hi' ? 'चर कारक' : 'Chara Karakas'}</span>
              <select
                className="text-input"
                value={settings.karakaCount}
                onChange={(e) =>
                  onChange({ ...settings, karakaCount: Number(e.target.value) as 7 | 8 })
                }
              >
                <option value={7}>{lang === 'hi' ? '7 कारक (सूर्य से शनि पाराशरी)' : '7 Karakas (Parashari Sun–Saturn)'}</option>
                <option value={8}>{lang === 'hi' ? '8 कारक (राहु सहित)' : '8 Karakas (incl. Rahu as PiK)'}</option>
              </select>
            </label>

            <label className="field">
              <span>{lang === 'hi' ? 'होरा (D2) गणना विधि' : 'Hora (D2) Method'}</span>
              <select
                className="text-input"
                value={settings.horaMode}
                onChange={(e) =>
                  onChange({
                    ...settings,
                    horaMode: e.target.value as CalcSettings['horaMode'],
                  })
                }
              >
                <option value="parashara">{lang === 'hi' ? 'पाराशरी (कर्क / सिंह)' : 'Parashari (Cancer / Leo)'}</option>
                <option value="samasaptama">{lang === 'hi' ? 'जगन्नाथ / समसप्तम' : 'Jagannatha / Samasaptama'}</option>
              </select>
            </label>
          </div>

          <label className="checkbox-inline">
            <input
              type="checkbox"
              checked={settings.includeOuterPlanets}
              onChange={(e) =>
                onChange({ ...settings, includeOuterPlanets: e.target.checked })
              }
            />
            <span>{lang === 'hi' ? 'बाहरी ग्रह शामिल करें (अरुण, वरुण, यम)' : 'Include Outer Planets (Uranus, Neptune, Pluto)'}</span>
          </label>
        </div>

        <div className="modal-footer">
          <span />
          <button type="button" className="btn btn-primary" onClick={onClose}>
            {t.common.done}
          </button>
        </div>
      </div>
    </div>
  );
};
