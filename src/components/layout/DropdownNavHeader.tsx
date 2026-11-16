import React from 'react';
import {
  Compass,
  Edit3,
  FileText,
  Moon,
  Plus,
  Settings,
  Sun,
  User,
} from 'lucide-react';
import { formatDateDmy } from '../../astro/time';
import type { BirthInput, CalcSettings, ChartStyle } from '../../astro/types';
import { useLanguage } from '../../i18n/LanguageContext';
import type { MainTab } from '../../nav';
import { WORKSTATION_DIVISIONS } from '../VedicMasterWorkstation';

interface DropdownNavHeaderProps {
  activeTab: MainTab;
  activeSubTab: string;
  onSelectPrimaryTab: (tab: MainTab) => void;
  onSelectSubTab: (subTab: string) => void;
  activeInput: BirthInput;
  profiles: BirthInput[];
  onSelectProfile: (id: string) => void;
  onOpenEditor: () => void;
  onNewKundli: () => void;
  onOpenBooklet: () => void;
  onOpenSettings: () => void;
  settings: CalcSettings;
  onChangeChartStyle: (style: ChartStyle) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const DropdownNavHeader: React.FC<DropdownNavHeaderProps> = ({
  activeSubTab,
  onSelectSubTab,
  activeInput,
  profiles,
  onSelectProfile,
  onOpenEditor,
  onNewKundli,
  onOpenBooklet,
  onOpenSettings,
  settings,
  onChangeChartStyle,
  theme,
  onToggleTheme,
}) => {
  const { lang, setLang } = useLanguage();
  const isHi = lang === 'hi';

  return (
    <header className="dropdown-nav-header no-print">
      {/* Row 1: Brand Logo, Native Selector, Language & Global Utilities */}
      <div className="dropdown-nav-top-row">
        {/* Brand */}
        <div className="dropdown-brand-btn" style={{ cursor: 'default' }}>
          <span className="dropdown-brand-om" aria-hidden="true">
            ॐ
          </span>
          <div className="dropdown-brand-text">
            <span className="dropdown-brand-name">
              {isHi ? 'ज्योतिष होरा' : 'Jyotish Hora'}
            </span>
            <span className="dropdown-brand-tag">
              {isHi ? 'वैदिक ज्योतिष वर्कस्टेशन' : 'Professional Vedic Astrology Workstation'}
            </span>
          </div>
        </div>

        {/* Center: Active Profile Selector */}
        <div className="dropdown-profile-group">
          <User size={15} className="muted" />
          <select
            aria-label="Select Native Profile"
            className="dropdown-select-profile"
            value={activeInput.id}
            onChange={(e) => onSelectProfile(e.target.value)}
          >
            {profiles.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({formatDateDmy(p.date)} · {p.city})
              </option>
            ))}
          </select>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onOpenEditor}
            title={isHi ? 'जन्म विवरण संशोधित करें' : 'Edit Native Details'}
          >
            <Edit3 size={13} />
            <span className="hide-on-mobile">{isHi ? 'संशोधन' : 'Edit'}</span>
          </button>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onNewKundli}
            title={isHi ? 'नई कुंडली' : 'New Horoscope'}
          >
            <Plus size={13} />
            <span className="hide-on-mobile">{isHi ? 'नई' : 'New'}</span>
          </button>
        </div>

        {/* Right Tools: Language, Chart Style, Theme, Settings */}
        <div className="dropdown-utilities-group">
          {/* Language Toggle */}
          <div className="pro-lang-toggle" role="group" aria-label="Language">
            <button
              type="button"
              className={`pro-lang-btn ${lang === 'en' ? 'is-active' : ''}`}
              onClick={() => setLang('en')}
            >
              EN
            </button>
            <button
              type="button"
              className={`pro-lang-btn ${lang === 'hi' ? 'is-active' : ''}`}
              onClick={() => setLang('hi')}
            >
              हिन्दी
            </button>
          </div>

          {/* Chart Style */}
          <select
            aria-label="Chart Style"
            className="select-compact hide-on-mobile"
            value={settings.chartStyle}
            onChange={(e) => onChangeChartStyle(e.target.value as ChartStyle)}
          >
            <option value="north">{isHi ? 'उत्तर (North)' : 'North Indian'}</option>
            <option value="south">{isHi ? 'दक्षिण (South)' : 'South Indian'}</option>
            <option value="east">{isHi ? 'पूर्व (East)' : 'East Indian'}</option>
          </select>

          {/* Print PDF Booklet */}
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onOpenBooklet}
            title={isHi ? '34-अध्यायी बृहत पत्रिका PDF' : '34-Chapter Patrika PDF'}
          >
            <FileText size={14} />
            <span className="hide-on-mobile">{isHi ? 'पत्रिका PDF' : 'Patrika PDF'}</span>
          </button>

          {/* Theme */}
          <button
            type="button"
            className="icon-tool-btn"
            onClick={onToggleTheme}
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
          </button>

          {/* Settings */}
          <button
            type="button"
            className="icon-tool-btn"
            onClick={onOpenSettings}
            title={isHi ? 'गणना सेटिंग्स' : 'Settings'}
          >
            <Settings size={15} />
          </button>
        </div>
      </div>

      {/* Row 2: Workstation Division Dropdown (No Emojis) */}
      <div className="dropdown-nav-control-bar">
        <div className="dropdown-control-wrapper" style={{ width: '100%', maxWidth: '850px', margin: '0 auto' }}>
          <div className="dropdown-field-item" style={{ width: '100%' }}>
            <label className="dropdown-field-label">
              <Compass size={14} />
              <span>{isHi ? 'वर्कस्टेशन भाग चुनें (भाग 1 से 11):' : 'Select Workstation Division (1 to 11):'}</span>
            </label>
            <select
              aria-label="Select Workstation Division"
              className="dropdown-master-select"
              value={activeSubTab || '1'}
              onChange={(e) => onSelectSubTab(e.target.value)}
              style={{ fontSize: '13.5px', fontWeight: 600 }}
            >
              {WORKSTATION_DIVISIONS.map((div) => (
                <option key={div.divisionNumber} value={String(div.divisionNumber)}>
                  {isHi ? div.labelHi : div.labelEn}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};
