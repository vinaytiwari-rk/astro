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

export interface DropdownNavHeaderProps {
  currentView: string;
  onNavigate: (view: string, sub?: string) => void;
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
  currentView,
  onNavigate,
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

  const handleLinkClick = (view: string, sub?: string) => {
    setOpenDropdown(null);
    onNavigate(view, sub);
  };

  return (
    <header className="dropdown-nav-header no-print">
      {/* Row 1: Brand Logo (AV Astro Vibe), Active Profile, Language & Tools */}
      <div className="dropdown-nav-top-row">
        {/* Brand: AV Astro Vibe */}
        <div
          className="dropdown-brand-btn"
          onClick={() => handleLinkClick('home')}
          title={isHi ? 'मुख्य पृष्ठ पर जाएं' : 'Go to Home'}
          style={{ cursor: 'pointer' }}
        >
          <span className="dropdown-brand-om" aria-hidden="true">
            ॐ
          </span>
          <div className="dropdown-brand-text">
            <span className="dropdown-brand-name">AV Astro Vibe</span>
            <span className="dropdown-brand-tag">
              {isHi ? 'वैदिक ज्योतिष, पंचांग एवं संपूर्ण फलादेश' : 'Vedic Astrology, Panchang & Free Predictions'}
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

        {/* Right Tools: Language, Chart Style, 118P Booklet, Theme, Settings */}
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
            <option value="south">{isHi ? 'दक्षिण (South)' : 'South Indian'}</option>
            <option value="north">{isHi ? 'उत्तर (North)' : 'North Indian'}</option>
            <option value="east">{isHi ? 'पूर्व (East)' : 'East Indian'}</option>
          </select>

          {/* Print PDF Booklet */}
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onOpenBooklet}
            title={isHi ? '118-पृष्ठीय बृहत पत्रिका PDF (100% निःशुल्क)' : '118-Page Patrika PDF (100% Free)'}
          >
            <FileText size={14} />
            <span className="hide-on-mobile">{isHi ? '118P पत्रिका' : '118P PDF'}</span>
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

      {/* Row 2: Main Navigation Bar with Direct Links & Necessary Dropdowns Only */}
      <div className="oj-navbar-row">
        <div className="oj-navbar-inner">
          <ul className="oj-nav-links">
            {/* 1. Home — Direct Link (No Dropdown) */}
            <li className="oj-nav-item">
              <button
                type="button"
                className={`oj-nav-link-btn ${currentView === 'home' ? 'is-current' : ''}`}
                onClick={() => handleLinkClick('home')}
              >
                <span>{isHi ? 'होम' : 'Home'}</span>
              </button>
            </li>

            {/* 2. Janam Kundli — Direct Link (No Dropdown) */}
            <li className="oj-nav-item">
              <button
                type="button"
                className={`oj-nav-link-btn ${currentView === 'vedic-horoscope' ? 'is-current' : ''}`}
                onClick={() => handleLinkClick('vedic-horoscope')}
              >
                <span>{isHi ? 'जन्म कुंडली' : 'Janam Kundli'}</span>
              </button>
            </li>

            {/* 3. Life Predictions (Sambhavit Falkathan) */}
            <li className="oj-nav-item">
              <button
                type="button"
                className={`oj-nav-link-btn ${currentView === 'sambhavit-falkathan' ? 'is-current' : ''}`}
                onClick={() => handleLinkClick('sambhavit-falkathan')}
              >
                <span>{isHi ? '50 फलादेश' : '50 Predictions'}</span>
              </button>
            </li>

            {/* 4. Sade Sati & Dual Transit Wheel */}
            <li
              className="oj-nav-item oj-dropdown-parent"
              onMouseEnter={() => setOpenDropdown('transits-menu')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                type="button"
                className={`oj-nav-link-btn oj-nav-dropdown-btn ${openDropdown === 'transits-menu' ? 'is-open' : ''} ${currentView === 'sade-sati' || currentView === 'dual-transit' ? 'is-current' : ''}`}
                onClick={() => toggleDropdown('transits-menu')}
                aria-expanded={openDropdown === 'transits-menu'}
                aria-haspopup="true"
              >
                <span>{isHi ? 'गोचर व साढ़े साती' : 'Gochar & Sade Sati'}</span>
                <ChevronDown size={13} className="oj-chevron" />
              </button>

              {openDropdown === 'transits-menu' && (
                <div className="oj-dropdown-menu" role="menu">
                  <button type="button" onClick={() => handleLinkClick('dual-transit')}>
                    <strong>{isHi ? 'द्वि-चक्र गोचर सिम्युलेटर (Double Wheel)' : 'Live Double Transit Wheel'}</strong>
                    <span className="oj-dd-sub">{isHi ? 'जन्म कुंडली + लाइव गोचर दृष्टि किरणें' : 'Natal + Transit Aspect Rays'}</span>
                  </button>
                  <button type="button" onClick={() => handleLinkClick('sade-sati')}>
                    <strong>{isHi ? 'शनि साढ़े साती एवं ढैया टाइमलाइन' : 'Sade Sati & Dhaiya Timeline'}</strong>
                    <span className="oj-dd-sub">{isHi ? '3 चरण, कंटक, अष्टम शनि व मूर्ति निर्णय' : '3 Charans & Moorti Nirnaya'}</span>
                  </button>
                </div>
              )}
            </li>

            {/* Holistic Remedies */}
            <li className="oj-nav-item">
              <button
                type="button"
                className={`oj-nav-link-btn ${currentView === 'holistic-remedies' ? 'is-current' : ''}`}
                onClick={() => handleLinkClick('holistic-remedies')}
              >
                <span>{isHi ? 'वैदिक समग्र उपचार' : 'Holistic Remedies'}</span>
              </button>
            </li>

            {/* 5. Advanced Astrology Dropdown */}
            <li
              className="oj-nav-item oj-dropdown-parent"
              onMouseEnter={() => setOpenDropdown('advanced-astro')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                type="button"
                className={`oj-nav-link-btn oj-nav-dropdown-btn ${openDropdown === 'advanced-astro' ? 'is-open' : ''}`}
                onClick={() => toggleDropdown('advanced-astro')}
                aria-expanded={openDropdown === 'advanced-astro'}
                aria-haspopup="true"
              >
                <Layers size={13} />
                <span>{isHi ? 'विशिष्ट ज्योतिष' : 'Advanced Astrology'}</span>
                <ChevronDown size={13} className="oj-chevron" />
              </button>

              {openDropdown === 'advanced-astro' && (
                <div className="oj-dropdown-menu" role="menu">
                  <button type="button" onClick={() => handleLinkClick('kp-enterprise')}>
                    <strong>{isHi ? 'केपी सिस्टम (4-Fold & CSL)' : 'KP System (4-Fold & CSL)'}</strong>
                    <span className="oj-dd-sub">{isHi ? 'कस्पल सब-लॉर्ड एवं रूलिंग प्लैनेट्स' : 'Cuspal Sub-Lords & Ruling Planets'}</span>
                  </button>
                  <button type="button" onClick={() => handleLinkClick('jaimini')}>
                    <strong>{isHi ? 'जैमिनी सूत्र (Jaimini Sutra)' : 'Jaimini Sutra Suite'}</strong>
                    <span className="oj-dd-sub">{isHi ? 'चर कारक, आरूढ़ पद एवं चर दशा' : 'Chara Karakas, Arudhas & Chara Dasha'}</span>
                  </button>
                  <button type="button" onClick={() => handleLinkClick('varshaphala')}>
                    <strong>{isHi ? 'ताजिक वर्षफल (Annual Solar Return)' : 'Tajika Varshaphala'}</strong>
                    <span className="oj-dd-sub">{isHi ? 'मुन्था, वर्षेश, 16 योग एवं सहम' : 'Muntha, Varsheshwar & 50 Sahams'}</span>
                  </button>
                  <button type="button" onClick={() => handleLinkClick('nadi')}>
                    <strong>{isHi ? 'नाड़ी ज्योतिष (Agastya Kandams)' : 'Nadi Palm Leaf Shastra'}</strong>
                    <span className="oj-dd-sub">{isHi ? '14 कण्डम, नंदी त्रिकोण एवं शिव संवाद' : '14 Kandams & Nandi Trine Links'}</span>
                  </button>
                  <button type="button" onClick={() => handleLinkClick('ashtakavarga')}>
                    <strong>{isHi ? 'अष्टकवर्ग सारणी (SAV 337)' : 'Ashtakavarga (SAV 337)'}</strong>
                    <span className="oj-dd-sub">{isHi ? 'ग्रह बिंदु एवं 12 भाव फल' : 'Planetary Bindus & Houses'}</span>
                  </button>
                  <button type="button" onClick={() => handleLinkClick('shadbala')}>
                    <strong>{isHi ? 'षड्बल गणना (Shadbala)' : 'Shadbala Strengths'}</strong>
                    <span className="oj-dd-sub">{isHi ? 'छह प्रकार के ग्रह बल' : 'Six-fold Planetary Balas'}</span>
                  </button>
                </div>
              )}
            </li>

            {/* 6. Consultation Tools Dropdown */}
            <li
              className="oj-nav-item oj-dropdown-parent"
              onMouseEnter={() => setOpenDropdown('more-tools')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                type="button"
                className={`oj-nav-link-btn oj-nav-dropdown-btn ${openDropdown === 'more-tools' ? 'is-open' : ''}`}
                onClick={() => toggleDropdown('more-tools')}
                aria-expanded={openDropdown === 'more-tools'}
                aria-haspopup="true"
              >
                <Sparkles size={13} />
                <span>{isHi ? 'टूल्स व मुहूर्त' : 'Tools & Muhurta'}</span>
                <ChevronDown size={13} className="oj-chevron" />
              </button>

              {openDropdown === 'more-tools' && (
                <div className="oj-dropdown-menu" role="menu">
                  <button type="button" onClick={() => handleLinkClick('prashna')}>
                    <strong>{isHi ? 'केपी प्रश्न कुण्डली (1–249)' : 'KP Prashna Horary (1–249)'}</strong>
                    <span className="oj-dd-sub">{isHi ? 'तात्कालिक प्रश्न: हाँ/ना/सशर्त उत्तर' : 'Instant Yes/No/Conditional Outcome'}</span>
                  </button>
                  <button type="button" onClick={() => handleLinkClick('muhurta')}>
                    <strong>{isHi ? 'शुभ मुहूर्त फाइंडर (90 Days)' : 'Auspicious Muhurta Finder'}</strong>
                    <span className="oj-dd-sub">{isHi ? 'विवाह, गृह प्रवेश, वाहन, व्यापार मुहूर्त' : 'Marriage, House, Vehicle & Business'}</span>
                  </button>
                  <button type="button" onClick={() => handleLinkClick('synastry')}>
                    <strong>{isHi ? 'कुण्डली मिलान व सिनैस्ट्री' : 'Matching & Synastry'}</strong>
                    <span className="oj-dd-sub">{isHi ? '36 गुण मिलान, दोष भंग एवं सिनैस्ट्री' : 'Ashtakoota & Cross-Chart Overlays'}</span>
                  </button>
                  <button type="button" onClick={() => handleLinkClick('btr')}>
                    <strong>{isHi ? 'जन्म समय संशोधन (BTR)' : 'Birth Time Rectification (BTR)'}</strong>
                    <span className="oj-dd-sub">{isHi ? 'जीवन घटनाओं से समय सुधार' : 'Event Timeline Calibration'}</span>
                  </button>
                  <button type="button" onClick={() => handleLinkClick('holistic-remedies')}>
                    <strong>{isHi ? 'समग्र वैदिक उपचार एवं टोटके' : 'Holistic Remedies & Totke'}</strong>
                    <span className="oj-dd-sub">{isHi ? 'जड़ी-बूटी, रंग चिकित्सा, योग व स्तोत्र' : 'Herbal Roots, Colors & Stotras'}</span>
                  </button>
                  <button type="button" onClick={() => handleLinkClick('medical-astrology')}>
                    <strong>{isHi ? 'चिकित्सा ज्योतिष व लाल किताब' : 'Medical Astrology & Lal Kitab'}</strong>
                    <span className="oj-dd-sub">{isHi ? 'त्रिदोष, खरेश 22वां द्रेष्काण व फरमान' : 'Tridosha, Kharesh & Lal Kitab Upaya'}</span>
                  </button>
                  <button type="button" onClick={() => handleLinkClick('gemstones')}>
                    <strong>{isHi ? 'वैदिक रत्न व रुद्राक्ष' : 'Gemstones & Rudraksha'}</strong>
                    <span className="oj-dd-sub">{isHi ? 'प्राण रत्न, भाग्य रत्न व इष्ट' : 'Life & Lucky Stones'}</span>
                  </button>
                  <button type="button" onClick={() => handleLinkClick('workstation')}>
                    <strong>{isHi ? '12-भाग विस्तृत वर्कस्टेशन' : '12-Division Workstation'}</strong>
                    <span className="oj-dd-sub">{isHi ? 'उन्नत ज्योतिष अनुसंधान स्टूडियो' : 'Advanced Calculation Studio'}</span>
                  </button>
                </div>
              )}
            </li>

            {/* 8. Puja & Festivals — Highlighted High-Visibility Dropdown */}
            <li
              className="oj-nav-item oj-dropdown-parent"
              onMouseEnter={() => setOpenDropdown('festivals')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                type="button"
                className={`oj-nav-link-btn oj-nav-dropdown-btn ${openDropdown === 'festivals' ? 'is-open' : ''}`}
                onClick={() => toggleDropdown('festivals')}
                aria-expanded={openDropdown === 'festivals'}
                aria-haspopup="true"
              >
                <Calendar size={13} />
                <span>{isHi ? 'पर्व एवं व्रत' : 'Puja & Festivals'}</span>
                <ChevronDown size={13} className="oj-chevron" />
              </button>

              {openDropdown === 'festivals' && (
                <div className="oj-dropdown-menu align-right" role="menu">
                  <button type="button" onClick={() => handleLinkClick('festivals')}>
                    <strong>{isHi ? 'हिंदू पर्व एवं व्रत कैलेंडर' : 'Hindu Festival Calendar'}</strong>
                    <span className="oj-dd-sub">{isHi ? '2026-2027 के समस्त पर्व' : '2026-2027 All Festivals'}</span>
                  </button>
                  <button type="button" onClick={() => handleLinkClick('daily-panchanga')}>
                    <strong>{isHi ? 'दैनिक पंचांग एवं होरा' : "Today's Panchang & Hora"}</strong>
                    <span className="oj-dd-sub">{isHi ? 'सूर्योदय, राहु काल, 24 घंटे की होरा' : 'Sunrise, Rahu Kalam, 24-hr Hora'}</span>
                  </button>
                  <button type="button" onClick={() => handleLinkClick('festivals')}>
                    <strong>{isHi ? 'एकादशी एवं प्रदोष तिथियां' : 'Ekadashi & Pradosham Dates'}</strong>
                    <span className="oj-dd-sub">{isHi ? 'मासिक व्रत एवं पारणा समय' : 'Monthly Fasting Schedules'}</span>
                  </button>
                  <button type="button" onClick={() => handleLinkClick('choghadiya')}>
                    <strong>{isHi ? 'शुभ मुहूर्त चेकर' : 'Auspicious Muhurta Checker'}</strong>
                    <span className="oj-dd-sub">{isHi ? 'अभिजीत, अमृत, ब्रह्म मुहूर्त' : 'Abhijit, Brahma Muhurta'}</span>
                  </button>
                </div>
              )}
            </li>
          </ul>

          {/* 118-Page PDF Quick Action Button */}
          <div className="oj-nav-right-cta">
            <button
              type="button"
              className="oj-action-btn primary"
              onClick={onOpenBooklet}
              style={{ padding: '5px 12px', fontSize: '12px' }}
            >
              <FileText size={13} />
              <span>{isHi ? '118P पत्रिका (निःशुल्क)' : '118P Report (Free)'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
