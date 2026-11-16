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

  const workstationMenus: Array<{
    id: string;
    labelEn: string;
    labelHi: string;
    icon: string;
    badge?: string;
  }> = [
    { id: 'sarini', labelEn: '1. Basic Details & Avakhada Sheet', labelHi: '1. ज्योतिष सारिणी व मूल विवरण', icon: '📋' },
    { id: 'charts_tables', labelEn: '2. All Vargas D1–D60, SAV & Tables', labelHi: '2. कुंडली व वर्ग चक्र / तालिकायें (D1–D60)', icon: '📊' },
    { id: 'dasha', labelEn: '3. Multi-Dasha Systems (Vimshottari/Yogini)', labelHi: '3. दशा प्रणाली (विंशोत्तरी 5 स्तर, योगिनी)', icon: '⏳' },
    { id: 'varshphal', labelEn: '4. Annual Varshphal & Tajika Sahams', labelHi: '4. वर्षफल / ताजिक वार्षिक (मुन्था, वर्षेश, सहम)', icon: '☀️' },
    { id: 'chakras', labelEn: '5. Special Chakras (Sudarshan/Kota/Kurma)', labelHi: '5. विविध वैदिक चक्र (सुदर्शन, सर्वतोभद्र, कोटा, कूर्म)', icon: '☸️' },
    { id: 'yogas_doshas', labelEn: '6. Classical Yogas, Doshas & Conjunctions', labelHi: '6. योग, दोष एवं युति विश्लेषण (राजयोग, मांगलिक, कालसर्प)', icon: '⚡' },
    { id: 'navamsha', labelEn: '7. Navamsha D9 Deep Reading & Pushkara', labelHi: '7. नवांश कुंडली विशेष विवेचन (कारकांश व पुष्कर भाग)', icon: '🌟' },
    { id: 'kp_system', labelEn: '8. KP Krishnamurti Paddhati (Sub-Lords)', labelHi: '8. के.पी. (KP) ज्योतिष प्रणाली (कस्प व 4-चरण कारक)', icon: '🎯', badge: 'KP' },
    { id: 'lal_kitab', labelEn: '9. Lal Kitab System (Debts & Upay)', labelHi: '9. लाल किताब प्रणाली (टेवा, सोये भाव व ऋण)', icon: '📕', badge: 'LK' },
    { id: 'predictions', labelEn: '10. Deep Predictions: Career, Appearance & Family', labelHi: '10. सटीक जीवन फलकथन (करियर, रूप-रंग व पारिवारिक यथार्थ)', icon: '🔮' },
    { id: 'past_future', labelEn: '11. Past Life D60 & Future Rebirth', labelHi: '11. पूर्व जन्म व भावी गति (D60 सभ्यता व योनि)', icon: '🌌' },
    { id: 'matchmaking', labelEn: '12. Kundali Match Making (36 Gunas)', labelHi: '12. कुंडली मिलान (36 गुण अष्टकूट व दोष साम्य)', icon: '💍' },
    { id: 'remedies', labelEn: '13. Comprehensive Shastric Remedies', labelHi: '13. सम्पूर्ण शास्त्रीय उपाय (मंत्र, दान, स्नान व रत्न)', icon: '🕉️' },
    { id: 'panchang', labelEn: '14. Daily Drik Panchang & Muhurta', labelHi: '14. दैनिक पंचांग व मुहूर्त (चोघड़िया, होरा व पर्व)', icon: '📅' },
  ];

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

      {/* Row 2: Workstation Menu Dropdown */}
      <div className="dropdown-nav-control-bar">
        <div className="dropdown-control-wrapper" style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
          <div className="dropdown-field-item" style={{ width: '100%' }}>
            <label className="dropdown-field-label">
              <Compass size={14} />
              <span>{isHi ? 'वर्कस्टेशन मुख्य विषय / मेन्यू चुनें:' : 'Workstation Main Module / Feature:'}</span>
            </label>
            <select
              aria-label="Select Workstation Module"
              className="dropdown-master-select"
              value={activeSubTab || 'sarini'}
              onChange={(e) => onSelectSubTab(e.target.value)}
              style={{ fontSize: '13.5px', fontWeight: 600 }}
            >
              {workstationMenus.map((mod) => (
                <option key={mod.id} value={mod.id}>
                  {mod.icon} {isHi ? mod.labelHi : mod.labelEn} {mod.badge ? `[${mod.badge}]` : ''}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};
