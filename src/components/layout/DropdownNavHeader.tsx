import React from 'react';
import {
  Compass,
  Edit3,
  FileText,
  Globe,
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

export interface DropdownSubOption {
  id: string;
  labelEn: string;
  labelHi: string;
  badge?: string;
}

interface DropdownNavHeaderProps {
  activeTab: MainTab;
  activeSubTab: string;
  onSelectPrimaryTab: (tab: MainTab) => void;
  onSelectSubTab: (subTabId: string) => void;
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

  // Master Primary Modules Definition
  const primaryModules: Array<{
    id: MainTab;
    labelEn: string;
    labelHi: string;
    emoji: string;
  }> = [
    {
      id: 'kundli',
      labelEn: 'Horoscope Workstation (Dual Charts, Dasha, Ashtakavarga, Shadbala, KP, Predictions)',
      labelHi: '1. जन्म कुंडली वर्कस्टेशन (लग्न, नवांश, दशा, अष्टकवर्ग, षड्बल, के.पी., फलादेश)',
      emoji: '📜',
    },
    {
      id: 'predictions',
      labelEn: 'In-Depth Predictions (300+ Yogas, 120-Yr Timeline, 12 Bhavas)',
      labelHi: '2. विस्तृत फलादेश (300+ राजयोग, 120-वर्षीय जीवन रेखा, 12 भाव)',
      emoji: '🔮',
    },
    {
      id: 'dasha_transits',
      labelEn: 'Dasha Systems & Gochar (Vimshottari, Yogini, Sade Sati)',
      labelHi: '3. दशा प्रणाली व गोचर (विंशोत्तरी 5 स्तर, योगिनी, साढ़े साती)',
      emoji: '⏳',
    },
    {
      id: 'branches',
      labelEn: 'Specialist Suites: KP Stellar, Traditional Tewa, Numerology & Gems',
      labelHi: '4. विशिष्ट पद्धतियाँ: KP नक्षत्र, परंपरागत टेवा, अंक व रत्न/रुद्राक्ष',
      emoji: '🌟',
    },
    {
      id: 'western',
      labelEn: 'Western Tropical Astrology (360° Circular Wheel & Aspects)',
      labelHi: '5. पाश्चात्य सायन ज्योतिष (360° सर्कुलर व्हील व ग्रह दृष्टियां)',
      emoji: '🪐',
    },
    {
      id: 'matchmaking',
      labelEn: 'Kundali Milan (36 Guna Ashtakoota, Manglik & Beeja Sphuta)',
      labelHi: '6. कुंडली मिलान (36 गुण अष्टकूट, मांगलिक परिहार व बीज/क्षेत्र)',
      emoji: '💍',
    },
    {
      id: 'panchang_muhurta',
      labelEn: 'Panchang & Muhurta Explorer (Drik, 24h Hora, Choghadiya, 30 Do Ghati)',
      labelHi: '7. पंचांग व मुहूर्त (दैनिक दृक, 24h होरा, चौघड़िया, 30 दो-घटी)',
      emoji: '📅',
    },
    {
      id: 'patrika_booklet',
      labelEn: '34-Chapter Deluxe Janmakundali Book (Print & PDF Export)',
      labelHi: '8. 34-अध्यायी बृहत् जन्मपत्रिका (प्रिंट व PDF एक्सपोर्ट)',
      emoji: '📖',
    },
    {
      id: 'home',
      labelEn: 'Quick Entry Form (Create New Kundali, Match & Panchang)',
      labelHi: '9. त्वरित प्रविष्टि पोर्टल (नया विवरण, मिलान व पंचांग फॉर्म)',
      emoji: '📝',
    },
  ];

  // Map sub-views for each master module (Zero Author Names)
  const subViewsMap: Record<string, DropdownSubOption[]> = {
    kundli: [
      { id: 'overview', labelEn: 'Basic Details & Avakhada Chakra', labelHi: 'मूल विवरण, अवकहड़ा व घातक चक्र' },
      { id: 'charts', labelEn: 'Interactive Charts (D1 Lagna, D9 Navamsha, Chalit)', labelHi: 'जन्म चक्र (D1 लग्न, D9 नवांश, चलित व चंद्र)' },
      { id: 'planets', labelEn: 'Planetary Table, Degrees & Karakas', labelHi: 'ग्रह स्थिति, अंश, नक्षत्र व चर कारक' },
      { id: 'vargas', labelEn: 'Shodashvarga (D1–D60) & Higher Micro Vargas (D108–D360)', labelHi: 'षोडशवर्ग (D1–D60) व सूक्ष्म वर्ग (D108, D150, D360)', badge: 'D1–D360' },
      { id: 'strength', labelEn: 'Shadbala, Bhava Bala & Planetary Strengths', labelHi: 'षड्बल, भाव बल व ग्रह सामर्थ्य' },
      { id: 'ashtakavarga', labelEn: 'Ashtakavarga, SAV Points & Prastara', labelHi: 'अष्टकवर्ग, सर्वाष्टक बिंदु व प्रस्तार' },
    ],
    predictions: [
      { id: 'twelve_planets', labelEn: '🌟 12 Planets Detailed Event Predictions (Sun to Pluto)', labelHi: '🌟 द्वादश ग्रह विस्तृत घटना फलादेश (9 वैदिक + 3 बाह्य ग्रह)' },
      { id: 'active_yogas_yuti', labelEn: '📜 Active Yogas & Planetary Conjunctions (2-7 Grahas)', labelHi: '📜 सक्रिय राजयोग व ग्रह युति फल (2-7 ग्रह युति व 300+ योग)' },
      { id: 'deep_life', labelEn: '🏛️ In-Depth Life Predictions (6 Core Domains)', labelHi: '🏛️ विस्तृत समग्र जीवन फलादेश (व्यक्तित्व, धन, करियर, विवाह)' },
      { id: 'eventsLedger', labelEn: '⏳ 120-Year Life Events Timeline & Milestones', labelHi: '⏳ 120-वर्षीय विंशोत्तरी जीवन घटनाक्रम कालचक्र' },
      { id: 'houseWise', labelEn: '🏠 12 Bhavas Comprehensive Analysis (1st to 12th House)', labelHi: '🏠 द्वादश भाव विस्तृत फलादेश (तनु से मोक्ष तक)' },
      { id: 'bhriguNadi', labelEn: '✨ Bhrigu Nandi Nadi & BSP (29 Classical Age Rules)', labelHi: '✨ भृगु नंदी नाड़ी व BSP (29 नियम, कर्म फल व कालचक्र)' },
      { id: 'pastFuture', labelEn: '🔄 Past Life Karma (D60) & Future Incarnation', labelHi: '🔄 पूर्व जन्म (D60 षष्ट्यंश) व आगामी जन्म गति' },
      { id: 'branchesNumerology', labelEn: '🌿 KP 4-Step, Lal Kitab, Numerology & Remedies', labelHi: '🌿 KP 4-स्टेप, लाल किताब, अंक ज्योतिष व उपाय' },
    ],
    dasha_transits: [
      { id: 'vimshottari', labelEn: 'Vimshottari Dasha 5 Levels (Maha, Antar, Pratyantar, Sookshma, Pran)', labelHi: 'विंशोत्तरी दशा (5 स्तर: महा, अंतर, प्रत्यंतर, सूक्ष्म, प्राण)' },
      { id: 'special_dashas', labelEn: 'Special Dashas: Yogini, Ashtottari, Narayana & Chara Dasha', labelHi: 'विशिष्ट दशाएं: योगिनी, अष्टोत्तरी, चर व नारायण दशा' },
      { id: 'live_transits', labelEn: 'Live Planetary Transits (Gochar) vs Natal Chart', labelHi: 'वर्तमान गोचर स्थिति व वेध चक्र' },
      { id: 'sade_sati', labelEn: 'Saturn Sade Sati & Dhaiya (Kantaka / Ashtama) Timeline', labelHi: 'शनि साढ़े साती व ढैय्या काल निर्धारण व उपाय' },
      { id: 'varshaphala', labelEn: 'Annual Solar Return (Varshaphala / Tajika) Year Chart', labelHi: 'वार्षिक ताजिक वर्षफल कुंडली व मुद्धा दशा' },
    ],
    branches: [
      { id: 'kp_4step', labelEn: 'KP 4-Step Theory & 12 Cusp Sub-Lords', labelHi: 'KP पद्धति, 4-स्टेप थ्योरी व 12 भाव उप-स्वामी' },
      { id: 'lal_kitab', labelEn: 'Fixed Aries Tewa (Pakka Ghar, Soya Ghar & Upay)', labelHi: 'नियत मेष लग्न टेवा, सोये घर व सरल उपाय' },
      { id: 'bhavartha_ratnakara', labelEn: '12 Lagnas Sign-Specific Functional Rules', labelHi: 'द्वादश लग्न कारक व मारक सूत्र' },
      { id: 'numerology', labelEn: 'Numerology & Lo Shu 3x3 Grid Analysis (Driver, Conductor, Kua)', labelHi: 'अंक ज्योतिष व लो शु ग्रिड (मूलांक, भाग्यांक, कुआ संख्या)' },
      { id: 'doshas_remedies', labelEn: 'Doshas: Manglik (10 Cancellations), Kaal Sarp & Gemstones', labelHi: 'मांगलिक (10 परिहार), कालसर्प, पितृ दोष व रत्न/रुद्राक्ष' },
      { id: 'life_specialized', labelEn: 'Specialized Jyotish: Career, Wealth, Medical & Intimacy', labelHi: 'विशिष्ट ज्योतिष: करियर, धन, चिकित्सा व दांपत्य' },
    ],
    western: [
      { id: 'wheel_chart', labelEn: 'Western Circular Wheel Chart (360° Tropical SVG)', labelHi: 'पाश्चात्य सायन चक्र (360° Circular Wheel)' },
      { id: 'aspects', labelEn: 'Planetary Aspects & Orbs (Conjunction, Trine, Square, Opposition)', labelHi: 'ग्रह दृष्टियां एवं अंश अंतर (Aspects & Orbs)' },
      { id: 'big_three', labelEn: 'The Big Three: Sun Sign, Moon Sign & Rising Ascendant', labelHi: 'पाश्चात्य बिग थ्री: सूर्य, चंद्र व लग्न' },
      { id: 'elements_modalities', labelEn: 'Elements (Fire/Earth/Air/Water) & Modalities Balance', labelHi: 'तत्व एवं स्वभाव संतुलन (Elements & Modalities)' },
      { id: 'sidereal_vs_tropical', labelEn: 'Vedic (Sidereal) vs Western (Tropical) Comparison', labelHi: 'वैदिक निरयन बनाम पाश्चात्य सायन तुलना' },
    ],
    matchmaking: [
      { id: 'ashtakoota', labelEn: 'Ashtakoota 36 Guna Milan with Detailed Points Breakdown', labelHi: 'अष्टकूट 36 गुण मिलान विस्तृत विवरण' },
      { id: 'manglik_match', labelEn: 'Mutual Manglik Dosha Analysis & 10 Classical Cancellations', labelHi: 'पारस्परिक मांगलिक मिलान व 10 शास्त्रीय परिहार' },
      { id: 'poruthams', labelEn: 'South Indian Poruthams (Dina, Gana, Yoni, Rasi, Nadi etc.)', labelHi: 'दक्षिण भारतीय पोरुथम (10/20 Poruthams)' },
      { id: 'verdict', labelEn: 'Comprehensive Marriage Compatibility Verdict & Vivaha Muhurta', labelHi: 'विवाह निर्णय, सामंजस्य समीक्षा व विवाह मुहूर्त' },
    ],
    panchang_muhurta: [
      { id: 'daily_panchang', labelEn: 'Daily Drik Panchang (Tithi, Vara, Nakshatra, Yoga, Karana, Rahu Kaal)', labelHi: 'दैनिक दृक पंचांग (तिथि, वार, नक्षत्र, योग, करण, राहु काल)' },
      { id: 'calendar_festivals', labelEn: '2026–2027 Hindu Calendar & Drik Astronomical Festivals', labelHi: '2026–2027 हिन्दू कैलेंडर एवं पर्व तिथियां (अधिक मास, ऋतु)' },
      { id: 'muhurta_finder', labelEn: 'Shubh Muhurta Finder (Marriage, Griha Pravesh, Vehicle, Business)', labelHi: 'शुभ मुहूर्त चयन (विवाह, गृह प्रवेश, वाहन, व्यापार)' },
      { id: 'choghadiya_hora', labelEn: 'Day & Night Choghadiya & 24-Hour Hora Calculator', labelHi: 'दिन-रात चौघड़िया, 24-घंटे होरा व दो-घटी मुहूर्त' },
      { id: 'btr_pakshi_tools', labelEn: 'Birth Time Rectification (BTR) & Pancha Pakshi Tools', labelHi: 'जन्म समय संशोधन (BTR) व पंच पक्षी शास्त्र' },
    ],
    patrika_booklet: [
      { id: 'full_edition', labelEn: 'Complete 34-Chapter Janmakundali Deluxe Edition', labelHi: 'संपूर्ण 34-अध्यायी बृहत् जन्मपत्रिका' },
      { id: 'branding_options', labelEn: 'Custom Header & Print Layout Options', labelHi: 'कस्टम हेडर व प्रिंट लेआउट सेटिंग' },
    ],
  };

  const getPrimaryTabKey = (tab: MainTab): string => {
    switch (tab) {
      case 'basics':
      case 'vargas':
      case 'strength':
      case 'ashtakavarga':
        return 'kundli';
      case 'dasha':
      case 'transits':
        return 'dasha_transits';
      case 'branches':
      case 'astro_tools':
      case 'prashna':
      case 'hub':
        return 'branches';
      case 'match':
        return 'matchmaking';
      case 'tools':
        return 'panchang_muhurta';
      default:
        return tab;
    }
  };

  const primaryKey = getPrimaryTabKey(activeTab);
  const currentSubOptions = subViewsMap[primaryKey] || [];

  return (
    <header className="dropdown-nav-header no-print">
      {/* Row 1: Brand Logo, Native Selector, Language & Global Utilities */}
      <div className="dropdown-nav-top-row">
        {/* Brand */}
        <button
          type="button"
          className="dropdown-brand-btn"
          onClick={() => onSelectPrimaryTab('kundli')}
          title={isHi ? 'मुख्य वर्कस्टेशन' : 'Go to Horoscope Workstation'}
        >
          <span className="dropdown-brand-om" aria-hidden="true">
            ॐ
          </span>
          <div className="dropdown-brand-text">
            <span className="dropdown-brand-name">
              {isHi ? 'ज्योतिष होरा' : 'Jyotish Hora'}
            </span>
            <span className="dropdown-brand-tag">
              {isHi ? 'व्यावसायिक वैदिक, केपी व पाश्चात्य ज्योतिष संस्थान' : 'Professional Vedic, KP & Western Astrology Studio'}
            </span>
          </div>
        </button>

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
            title={isHi ? '34-अध्यायी बृहत् पत्रिका PDF' : '34-Chapter Patrika PDF'}
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

      {/* Row 2: Master Dual Dropdowns (System Selector + Feature Selector) - Clean, Uncluttered */}
      <div className="dropdown-nav-control-bar">
        <div className="dropdown-control-wrapper">
          {/* 1. Master System / Module Dropdown */}
          <div className="dropdown-field-item">
            <label className="dropdown-field-label">
              <Compass size={13} />
              <span>{isHi ? 'ज्योतिष शाखा / मुख्य विषय:' : 'Astrology System / Module:'}</span>
            </label>
            <select
              aria-label="Select Astrology Module"
              className="dropdown-master-select"
              value={primaryKey}
              onChange={(e) => onSelectPrimaryTab(e.target.value as MainTab)}
            >
              {primaryModules.map((mod) => (
                <option key={mod.id} value={mod.id}>
                  {mod.emoji} {isHi ? mod.labelHi : mod.labelEn}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Specific Feature / Analysis Dropdown (If sub-options exist) */}
          {currentSubOptions.length > 0 && (
            <div className="dropdown-field-item">
              <label className="dropdown-field-label">
                <Globe size={13} />
                <span>{isHi ? 'विशिष्ट गणना / फलादेश विषय:' : 'Specific View / Analysis:'}</span>
              </label>
              <select
                aria-label="Select Specific Analysis"
                className="dropdown-sub-select"
                value={activeSubTab}
                onChange={(e) => onSelectSubTab(e.target.value)}
              >
                {currentSubOptions.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {isHi ? sub.labelHi : sub.labelEn} {sub.badge ? `[${sub.badge}]` : ''}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
