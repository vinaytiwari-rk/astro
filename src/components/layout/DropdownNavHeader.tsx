import React, { useState } from 'react';
import {
  BookOpen,
  Calendar,
  ChevronDown,
  Clock,
  Compass,
  Edit3,
  FileText,
  Heart,
  Home,
  Layers,
  Moon,
  Plus,
  Settings,
  Sparkles,
  Star,
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
  activeTab,
  activeSubTab,
  onSelectPrimaryTab,
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

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (key: string) => {
    setOpenDropdown((prev) => (prev === key ? null : key));
  };

  const handleNavClick = (divisionNumber: number) => {
    setOpenDropdown(null);
    onSelectPrimaryTab('workstation');
    onSelectSubTab(String(divisionNumber));
  };

  return (
    <header className="dropdown-nav-header no-print">
      {/* Row 1: Brand Logo, Native Selector, View Mode Switcher, Language & Utilities */}
      <div className="dropdown-nav-top-row">
        {/* Brand */}
        <div
          className="dropdown-brand-btn"
          onClick={() => {
            setOpenDropdown(null);
            onSelectPrimaryTab('home');
          }}
          title={isHi ? 'मुख्य पोर्टल पर जाएं' : 'Go to Home Portal'}
          style={{ cursor: 'pointer' }}
        >
          <span className="dropdown-brand-om" aria-hidden="true">
            ॐ
          </span>
          <div className="dropdown-brand-text">
            <span className="dropdown-brand-name">OnlineJyotish</span>
            <span className="dropdown-brand-tag">
              {isHi ? 'श्री साईं ज्योतिष विद्यापीठम् · 2004 से' : 'Om Sri Sai Jyotisha Vidyapeetham · Since 2004'}
            </span>
          </div>
        </div>

        {/* View Mode Switcher Pills: Portal vs Workstation */}
        <div className="oj-view-mode-pills hide-on-mobile">
          <button
            type="button"
            className={`oj-mode-btn ${activeTab === 'home' ? 'is-active' : ''}`}
            onClick={() => onSelectPrimaryTab('home')}
          >
            <Home size={14} />
            <span>{isHi ? 'मुख्य पोर्टल' : 'Home Portal'}</span>
          </button>
          <button
            type="button"
            className={`oj-mode-btn ${activeTab === 'workstation' ? 'is-active' : ''}`}
            onClick={() => onSelectPrimaryTab('workstation')}
          >
            <Compass size={14} />
            <span>{isHi ? '12-भाग वर्कस्टेशन' : '12-Div Workstation'}</span>
          </button>
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

        {/* Right Tools: Language, Chart Style, Booklet, Theme, Settings */}
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
            title={isHi ? '118-पृष्ठीय बृहत पत्रिका PDF (निःशुल्क)' : '118-Page Patrika PDF (Free)'}
          >
            <FileText size={14} />
            <span className="hide-on-mobile">{isHi ? '118P पत्रिका' : '118P Report'}</span>
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

      {/* Row 2: OnlineJyotish Style Menu Bar with Dropdowns */}
      <div className="oj-navbar-row">
        <div className="oj-navbar-inner">
          <ul className="oj-nav-links">
            {/* 1. Home */}
            <li className="oj-nav-item">
              <button
                type="button"
                className={`oj-nav-link-btn ${activeTab === 'home' ? 'is-current' : ''}`}
                onClick={() => {
                  setOpenDropdown(null);
                  onSelectPrimaryTab('home');
                }}
              >
                <Home size={15} />
                <span>{isHi ? 'होम' : 'Home'}</span>
              </button>
            </li>

            {/* 2. Free Tools Menu */}
            <li className="oj-nav-item oj-dropdown-parent">
              <button
                type="button"
                className={`oj-nav-link-btn ${openDropdown === 'tools' ? 'is-open' : ''}`}
                onClick={() => toggleDropdown('tools')}
              >
                <span>{isHi ? 'निःशुल्क सेवाएं' : 'Free tools'}</span>
                <ChevronDown size={12} className="oj-chevron" />
              </button>

              {openDropdown === 'tools' && (
                <div className="oj-dropdown-menu">
                  <button type="button" onClick={() => handleNavClick(1)}>
                    <strong>{isHi ? 'वैदिक जन्म कुंडली (D-1 & Basic Details)' : 'Vedic Birth Chart (D-1 & Basics)'}</strong>
                    <span className="oj-dd-sub">{isHi ? 'भाग 1: अवकहड़ा, पंचांग, घात चक्र' : 'Division 1: Avakahada & Core'}</span>
                  </button>
                  <button type="button" onClick={() => handleNavClick(2)}>
                    <strong>{isHi ? 'मुख्य गणनाएं (Lagna, Chalit, Chandra, D9)' : 'Core Calculations (Lagna, Chalit, D9)'}</strong>
                    <span className="oj-dd-sub">{isHi ? 'भाग 2: भाव चलित व नवांश' : 'Division 2: Chalit & Navamsha'}</span>
                  </button>
                  <button type="button" onClick={() => handleNavClick(9)}>
                    <strong>{isHi ? 'केपी कुंडली (KP Horoscope)' : 'KP Horoscope & Sub-Lords'}</strong>
                    <span className="oj-dd-sub">{isHi ? 'भाग 9: भाव संधि व उप-स्वामी' : 'Division 9: Cusps & Significators'}</span>
                  </button>
                  <button type="button" onClick={() => handleNavClick(10)}>
                    <strong>{isHi ? 'कुंडली मिलान (Marriage Matching)' : 'Marriage Matching (Guna Milan)'}</strong>
                    <span className="oj-dd-sub">{isHi ? 'भाग 10: अष्टकूट 36 गुण व दश कूट' : 'Division 10: 36 Gunas & 10 Poruthams'}</span>
                  </button>
                  <button type="button" onClick={() => handleNavClick(12)}>
                    <strong>{isHi ? 'शिशु नामकरण व नामाक्षर (Newborn Horoscope)' : 'Newborn Horoscope & Namakshar'}</strong>
                    <span className="oj-dd-sub">{isHi ? 'भाग 12: नक्षत्र नामाक्षर व गंडमूल' : 'Division 12: Name Syllables'}</span>
                  </button>
                </div>
              )}
            </li>

            {/* 3. Puja & Festivals Menu */}
            <li className="oj-nav-item oj-dropdown-parent">
              <button
                type="button"
                className={`oj-nav-link-btn ${openDropdown === 'festivals' ? 'is-open' : ''}`}
                onClick={() => toggleDropdown('festivals')}
              >
                <span>{isHi ? 'पंचांग एवं पर्व' : 'Puja & Festivals'}</span>
                <ChevronDown size={12} className="oj-chevron" />
              </button>

              {openDropdown === 'festivals' && (
                <div className="oj-dropdown-menu">
                  <button type="button" onClick={() => handleNavClick(11)}>
                    <strong>{isHi ? 'दैनिक पंचांग (Daily Panchang)' : 'Daily Panchang (Tithi, Nakshatra, Yoga)'}</strong>
                    <span className="oj-dd-sub">{isHi ? 'सूर्योदय, सूर्यास्त व राहु काल' : 'Sunrise, Sunset & Rahu Kalam'}</span>
                  </button>
                  <button type="button" onClick={() => handleNavClick(11)}>
                    <strong>{isHi ? 'मासिक पंचांग कैलेंडर (Monthly Calendar)' : 'Monthly Panchang Calendar'}</strong>
                    <span className="oj-dd-sub">{isHi ? 'माह के समस्त दिन व तिथियां' : 'Month-wise Tithis & Dates'}</span>
                  </button>
                  <button type="button" onClick={() => handleNavClick(11)}>
                    <strong>{isHi ? 'हिंदू पर्व एवं व्रत सूची (Festivals & Vrats)' : 'Hindu Festivals & Vrats Calendar'}</strong>
                    <span className="oj-dd-sub">{isHi ? 'एकादशी, प्रदोष, पूर्णिमा, अमावस्या' : 'Navaratri, Shivaratri, Vrats'}</span>
                  </button>
                  <button type="button" onClick={() => handleNavClick(11)}>
                    <strong>{isHi ? 'चौघड़िया मुहूर्त (Choghadiya Times)' : "Today's Choghadiya Times"}</strong>
                    <span className="oj-dd-sub">{isHi ? 'दिन व रात के 8-8 चौघड़िया' : 'Day & Night Choghadiya Slots'}</span>
                  </button>
                  <button type="button" onClick={() => handleNavClick(11)}>
                    <strong>{isHi ? 'होरा चक्र (Planetary Hora Times)' : "Today's Hora Times"}</strong>
                    <span className="oj-dd-sub">{isHi ? '24 घंटे का ग्रह होरा चक्र' : '24-Hour Planetary Hours'}</span>
                  </button>
                  <button type="button" onClick={() => handleNavClick(11)}>
                    <strong>{isHi ? 'शुभ मुहूर्त एवं मुहूर्त चेकर (Muhurta Checker)' : 'Muhurta Checker & Timings'}</strong>
                    <span className="oj-dd-sub">{isHi ? 'अभिजीत, ब्रह्म, विजय मुहूर्त' : 'Abhijit, Brahma, Amrit'}</span>
                  </button>
                </div>
              )}
            </li>

            {/* 4. Astro Tools Menu */}
            <li className="oj-nav-item oj-dropdown-parent">
              <button
                type="button"
                className={`oj-nav-link-btn ${openDropdown === 'astro' ? 'is-open' : ''}`}
                onClick={() => toggleDropdown('astro')}
              >
                <span>{isHi ? 'ज्योतिष टूल्स' : 'Astro Tools'}</span>
                <ChevronDown size={12} className="oj-chevron" />
              </button>

              {openDropdown === 'astro' && (
                <div className="oj-dropdown-menu">
                  <button type="button" onClick={() => handleNavClick(3)}>
                    <strong>{isHi ? 'समस्त वर्ग कुंडलियां (D-1 से D-60)' : 'Shodashavargas (D-1 to D-60)'}</strong>
                    <span className="oj-dd-sub">{isHi ? 'भाग 3: उपग्रह, आरूढ़, 64वां नवांश' : 'Division 3: Higher Vargas & Sensitive Points'}</span>
                  </button>
                  <button type="button" onClick={() => handleNavClick(4)}>
                    <strong>{isHi ? 'ग्रह बल व अष्टकवर्ग (Balas & Ashtakavarga)' : 'Shadbala & Ashtakavarga (SAV/BAV)'}</strong>
                    <span className="oj-dd-sub">{isHi ? 'भाग 4: षड्बल, भावबल, बिन्दु प्रास्तार' : 'Division 4: Planetary Strengths'}</span>
                  </button>
                  <button type="button" onClick={() => handleNavClick(5)}>
                    <strong>{isHi ? 'विशेष चक्र व सारणी (Vedic Special Chakras)' : 'Special Chakras & Tables'}</strong>
                    <span className="oj-dd-sub">{isHi ? 'भाग 5: सुदर्शन, सर्वतोभद्र, कोटा' : 'Division 5: Sudarshan, Sarvatobhadra, Kota'}</span>
                  </button>
                  <button type="button" onClick={() => handleNavClick(6)}>
                    <strong>{isHi ? 'समस्त दशाएं (All Vedic Dashas)' : 'All Dashas (Vimshottari, Tribhagi, Yogini)'}</strong>
                    <span className="oj-dd-sub">{isHi ? 'भाग 6: चर, योगिनी व त्रिभागी' : 'Division 6: 4-Level Dashas'}</span>
                  </button>
                  <button type="button" onClick={() => handleNavClick(7)}>
                    <strong>{isHi ? 'ग्रह गोचर (Live Transits & Sade Sati)' : 'Planetary Transits & Sade Sati'}</strong>
                    <span className="oj-dd-sub">{isHi ? 'भाग 7: शनि, गुरु, राहु गोचर' : 'Division 7: Real-time Transit Charts'}</span>
                  </button>
                  <button type="button" onClick={() => handleNavClick(9)}>
                    <strong>{isHi ? 'लाल किताब एवं पाश्चात्य (Lal Kitab & Multi-System)' : 'Lal Kitab & Multi-System Astrology'}</strong>
                    <span className="oj-dd-sub">{isHi ? 'भाग 9: ऋण, दृष्टि व ग्रह युति' : 'Division 9: Nadi, Western, Lal Kitab'}</span>
                  </button>
                </div>
              )}
            </li>

            {/* 5. Reports & Predictions Menu (100% Free / निःशुल्क) */}
            <li className="oj-nav-item oj-dropdown-parent">
              <button
                type="button"
                className={`oj-nav-link-btn ${openDropdown === 'reports' ? 'is-open' : ''}`}
                onClick={() => toggleDropdown('reports')}
              >
                <span>{isHi ? 'पत्रिका व फलादेश (निःशुल्क)' : 'Reports & Predictions (Free)'}</span>
                <ChevronDown size={12} className="oj-chevron" />
              </button>

              {openDropdown === 'reports' && (
                <div className="oj-dropdown-menu">
                  <button
                    type="button"
                    onClick={() => {
                      setOpenDropdown(null);
                      onOpenBooklet();
                    }}
                  >
                    <strong style={{ color: 'var(--accent)' }}>
                      {isHi ? '118-पृष्ठीय बृहत जन्म पत्रिका PDF' : 'Complete 118-Page Patrika PDF Report'}
                    </strong>
                    <span className="oj-dd-sub">{isHi ? '100% निःशुल्क (Zero Cost / No ₹599 charge)' : '100% Free (Zero Cost / No Fee)'}</span>
                  </button>
                  <button type="button" onClick={() => handleNavClick(12)}>
                    <strong>{isHi ? 'संभावित फलकथन (25 जीवन आयाम)' : 'Probable Predictions (Sambhavit Falkathan)'}</strong>
                    <span className="oj-dd-sub">{isHi ? 'भाग 12: शिक्षा, नौकरी, विवाह, संतान, आयु' : 'Division 12: 25 Vital Dimensions'}</span>
                  </button>
                  <button type="button" onClick={() => handleNavClick(8)}>
                    <strong>{isHi ? 'द्वादश भाव व भावेश फलादेश' : '12 Houses & House Lords Predictions'}</strong>
                    <span className="oj-dd-sub">{isHi ? 'भाग 8: पराशर होराशास्त्र फलादेश' : 'Division 8: Parashari Bhavesha'}</span>
                  </button>
                  <button type="button" onClick={() => handleNavClick(8)}>
                    <strong>{isHi ? 'सर्वाष्टकवर्ग 12 भाव फल व उपाय' : 'SAV 12 Houses Analysis & Remedies'}</strong>
                    <span className="oj-dd-sub">{isHi ? 'भाग 8: 111-113 संदर्भ पीडीएफ के अनुरूप' : 'Division 8: Reference PDF Parity'}</span>
                  </button>
                  <button type="button" onClick={() => handleNavClick(8)}>
                    <strong>{isHi ? 'आजीवन विंशोत्तरी महादशा फलादेश' : 'Lifelong Vimshottari Dasha Predictions'}</strong>
                    <span className="oj-dd-sub">{isHi ? 'भाग 8: जन्म से 100+ वर्ष तक' : 'Division 8: Birth to 100+ Years'}</span>
                  </button>
                  <button type="button" onClick={() => handleNavClick(8)}>
                    <strong>{isHi ? 'चंद्र से प्रमुख गोचर (शनि/गुरु/राहु-केतु)' : 'Major Transits from Moon (Saturn/Jupiter)'}</strong>
                    <span className="oj-dd-sub">{isHi ? 'भाग 8: कर्म शनि, साढ़ेसाती, कंटक' : 'Division 8: Transit Predictions'}</span>
                  </button>
                </div>
              )}
            </li>
          </ul>

          {/* Direct Workstation Division Jumper */}
          <div className="oj-division-jumper">
            <label className="oj-jumper-label">
              <Compass size={13} />
              <span>{isHi ? 'वर्कस्टेशन भाग:' : 'Division:'}</span>
            </label>
            <select
              aria-label="Select Workstation Division"
              className="oj-select-division"
              value={activeSubTab || '1'}
              onChange={(e) => handleNavClick(parseInt(e.target.value, 10))}
            >
              {WORKSTATION_DIVISIONS.map((div) => (
                <option key={div.divisionNumber} value={String(div.divisionNumber)}>
                  {isHi ? div.shortLabelHi : div.shortLabelEn}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};
