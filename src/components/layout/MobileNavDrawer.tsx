import React from 'react';
import {
  Activity,
  Award,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Compass,
  Edit3,
  FileSpreadsheet,
  FileText,
  Flame,
  Grid,
  Heart,
  Home,
  Layers,
  Moon,
  Orbit,
  Plus,
  RotateCcw,
  Scale,
  Scroll,
  Settings,
  ShieldAlert,
  Sparkles,
  Star,
  Sun,
  UserCheck,
  X,
  Zap,
} from 'lucide-react';
import { formatDateDmy } from '../../astro/time';
import type { BirthInput, CalcSettings, ChartStyle } from '../../astro/types';
import { useLanguage } from '../../i18n/LanguageContext';
import type { MainTab } from '../../nav';

interface MobileNavDrawerProps {
  open: boolean;
  onClose: () => void;
  activeTab: MainTab;
  onNavigate: (tab: MainTab, subTab?: string, nested?: string) => void;
  activeInput: BirthInput;
  profiles: BirthInput[];
  onSelectProfile: (id: string) => void;
  onOpenEditor: () => void;
  onNewKundli: () => void;
  onOpenSettings: () => void;
  onOpenBooklet: () => void;
  settings: CalcSettings;
  onChangeChartStyle: (style: ChartStyle) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({
  open,
  onClose,
  activeTab,
  onNavigate,
  activeInput,
  profiles,
  onSelectProfile,
  onOpenEditor,
  onNewKundli,
  onOpenSettings,
  onOpenBooklet,
  settings,
  onChangeChartStyle,
  theme,
  onToggleTheme,
}) => {
  const { lang, setLang } = useLanguage();
  const isHi = lang === 'hi';

  if (!open) return null;

  const handleItemClick = (tab: MainTab, subTab?: string, nested?: string) => {
    onNavigate(tab, subTab, nested);
    onClose();
  };

  const menuSections = [
    {
      titleEn: 'Flagship Life Dossier (10 Chapters)',
      titleHi: 'गोपनीय जीवन आलेख (स्प्लिट-स्टूडियो)',
      items: [
        {
          tab: 'dossier' as MainTab,
          subTab: 'ch1',
          labelEn: '🌟 Master Life Dossier & Split Kundali',
          labelHi: '🌟 10-अध्यायी गोपनीय जीवन आलेख व कुंडली',
          icon: <Sparkles size={16} />,
        },
      ],
    },
    {
      titleEn: 'Birth Chart & Calculations',
      titleHi: 'जन्म कुंडली व मूल गणना',
      items: [
        {
          tab: 'kundli' as MainTab,
          subTab: 'overview',
          labelEn: 'Basic Details & Avakhada',
          labelHi: 'मूल विवरण व अवकहड़ा चक्र',
          icon: <UserCheck size={16} />,
        },
        {
          tab: 'kundli' as MainTab,
          subTab: 'charts',
          labelEn: 'Charts (D1, D9, Chalit)',
          labelHi: 'जन्म चक्र (D1, D9, चलित)',
          icon: <Scroll size={16} />,
        },
        {
          tab: 'kundli' as MainTab,
          subTab: 'planets',
          labelEn: 'Planetary Table & Degrees',
          labelHi: 'ग्रह स्थिति व अंश तालिका',
          icon: <FileSpreadsheet size={16} />,
        },
        {
          tab: 'kundli' as MainTab,
          subTab: 'vargas',
          labelEn: 'Shodashvarga & D108 Charts',
          labelHi: 'षोडशवर्ग व सूक्ष्म वर्ग (D108)',
          icon: <Grid size={16} />,
        },
        {
          tab: 'kundli' as MainTab,
          subTab: 'strength',
          labelEn: 'Shadbala & Planetary Strengths',
          labelHi: 'षड्बल व भाव बल',
          icon: <Scale size={16} />,
        },
        {
          tab: 'kundli' as MainTab,
          subTab: 'ashtakavarga',
          labelEn: 'Ashtakavarga & SAV Points',
          labelHi: 'अष्टकवर्ग व सर्वाष्टक बिंदु',
          icon: <Layers size={16} />,
        },
      ],
    },
    {
      titleEn: 'Accurate Predictions & Life Events',
      titleHi: 'सटीक फलादेश व जीवन घटनाक्रम',
      items: [
        {
          tab: 'predictions' as MainTab,
          subTab: 'classical_yogas',
          labelEn: '300+ Classical Yogas',
          labelHi: '300+ वैदिक राजयोग व फल',
          icon: <Award size={16} />,
        },
        {
          tab: 'predictions' as MainTab,
          subTab: 'timeline_120yr',
          labelEn: '120-Year Life Events Timeline',
          labelHi: '120-वर्षीय जीवन घटनाक्रम',
          icon: <Clock size={16} />,
        },
        {
          tab: 'predictions' as MainTab,
          subTab: 'bhavas_12',
          labelEn: '12 Bhavas Deep Analysis',
          labelHi: 'द्वादश भाव विस्तृत फलादेश',
          icon: <BookOpen size={16} />,
        },
        {
          tab: 'predictions' as MainTab,
          subTab: 'bnn_bsp',
          labelEn: 'Bhrigu Nandi Nadi & BSP Rules',
          labelHi: 'भृगु नंदी नाड़ी व BSP (29 नियम)',
          icon: <Sparkles size={16} />,
        },
        {
          tab: 'predictions' as MainTab,
          subTab: 'yuti_aspects',
          labelEn: 'Conjunctions (2-7) & Drishti',
          labelHi: 'ग्रह युति (2–7) व दृष्टि फल',
          icon: <Zap size={16} />,
        },
        {
          tab: 'predictions' as MainTab,
          subTab: 'past_future',
          labelEn: 'Past Life Karma & Future Gati',
          labelHi: 'पूर्व जन्म व आगामी गति',
          icon: <RotateCcw size={16} />,
        },
      ],
    },
    {
      titleEn: 'Dasha Systems & Transits',
      titleHi: 'दशा प्रणाली व गोचर',
      items: [
        {
          tab: 'dasha_transits' as MainTab,
          subTab: 'vimshottari',
          labelEn: 'Vimshottari Dasha (5 Levels)',
          labelHi: 'विंशोत्तरी दशा (5 स्तर)',
          icon: <Clock size={16} />,
        },
        {
          tab: 'dasha_transits' as MainTab,
          subTab: 'special_dashas',
          labelEn: 'Yogini, Char & Narayana Dasha',
          labelHi: 'योगिनी, चर व नारायण दशा',
          icon: <RotateCcw size={16} />,
        },
        {
          tab: 'dasha_transits' as MainTab,
          subTab: 'live_transits',
          labelEn: 'Live Gochar (Transits) & Kaksha',
          labelHi: 'वर्तमान गोचर स्थिति व वेध',
          icon: <Orbit size={16} />,
        },
        {
          tab: 'dasha_transits' as MainTab,
          subTab: 'sade_sati',
          labelEn: 'Saturn Sade Sati & Dhaiya',
          labelHi: 'शनि साढ़े साती व ढैय्या',
          icon: <ShieldAlert size={16} />,
        },
        {
          tab: 'dasha_transits' as MainTab,
          subTab: 'varshaphala',
          labelEn: 'Annual Solar Return (Varshaphala)',
          labelHi: 'वार्षिक ताजिक वर्षफल कुंडली',
          icon: <Sun size={16} />,
        },
      ],
    },
    {
      titleEn: 'Astrological Systems & Branches',
      titleHi: 'ज्योतिष पध्दतियाँ व शाखाएँ',
      items: [
        {
          tab: 'branches' as MainTab,
          subTab: 'kp_4step',
          labelEn: 'KP System & 4-Step Theory',
          labelHi: 'KP पद्धति व 4-स्टेप थ्योरी',
          icon: <Star size={16} />,
        },
        {
          tab: 'branches' as MainTab,
          subTab: 'lal_kitab',
          labelEn: 'Lal Kitab 1952 Classic Heritage',
          labelHi: 'लाल किताब 1952 (ऋण व सोये घर)',
          icon: <Flame size={16} />,
        },
        {
          tab: 'branches' as MainTab,
          subTab: 'bhavartha_ratnakara',
          labelEn: 'Bhavartha Ratnakara (12 Lagnas)',
          labelHi: 'भावार्थ रत्नाकर (12 लग्न सूत्र)',
          icon: <Scroll size={16} />,
        },
        {
          tab: 'branches' as MainTab,
          subTab: 'doshas_remedies',
          labelEn: 'Manglik, Kaalsarp & Gemstones',
          labelHi: 'मांगलिक, कालसर्प व रत्न परामर्श',
          icon: <ShieldAlert size={16} />,
        },
        {
          tab: 'branches' as MainTab,
          subTab: 'life_specialized',
          labelEn: 'Career, Wealth & Medical Jyotish',
          labelHi: 'करियर, धन व चिकित्सा ज्योतिष',
          icon: <Activity size={16} />,
        },
      ],
    },
    {
      titleEn: 'Matchmaking & Compatibility',
      titleHi: 'कुंडली मिलान व विवाह परामर्श',
      items: [
        {
          tab: 'matchmaking' as MainTab,
          subTab: 'ashtakoota',
          labelEn: '36 Guna Ashtakoota Milan',
          labelHi: 'अष्टकूट 36 गुण मिलान',
          icon: <Heart size={16} />,
        },
        {
          tab: 'matchmaking' as MainTab,
          subTab: 'manglik_match',
          labelEn: 'Mutual Manglik & Cancellations',
          labelHi: 'मांगलिक मिलान व परिहार',
          icon: <ShieldAlert size={16} />,
        },
        {
          tab: 'matchmaking' as MainTab,
          subTab: 'poruthams',
          labelEn: 'South Indian 10/20 Poruthams',
          labelHi: 'दक्षिण भारतीय पोरुथम (10/20)',
          icon: <CheckCircle size={16} />,
        },
        {
          tab: 'matchmaking' as MainTab,
          subTab: 'verdict',
          labelEn: 'Comprehensive Marriage Verdict',
          labelHi: 'विवाह निर्णय व शुभ मुहूर्त',
          icon: <Sparkles size={16} />,
        },
      ],
    },
    {
      titleEn: 'Panchang, Calendar & Muhurta',
      titleHi: 'पंचांग, कैलेंडर व मुहूर्त',
      items: [
        {
          tab: 'panchang_muhurta' as MainTab,
          subTab: 'daily_panchang',
          labelEn: 'Daily Drik Panchang',
          labelHi: 'दैनिक दृक पंचांग',
          icon: <Calendar size={16} />,
        },
        {
          tab: 'panchang_muhurta' as MainTab,
          subTab: 'calendar_festivals',
          labelEn: '2026–2027 Hindu Calendar & Festivals',
          labelHi: '2026–2027 हिन्दू पर्व व पंचांग',
          icon: <Calendar size={16} />,
        },
        {
          tab: 'panchang_muhurta' as MainTab,
          subTab: 'muhurta_finder',
          labelEn: 'Shubh Muhurta Finder',
          labelHi: 'शुभ मुहूर्त चयन (विवाह/गृह/वाहन)',
          icon: <Sparkles size={16} />,
        },
        {
          tab: 'panchang_muhurta' as MainTab,
          subTab: 'choghadiya_hora',
          labelEn: 'Choghadiya & 24-Hour Hora',
          labelHi: 'चौघड़िया व 24-घंटे होरा',
          icon: <Clock size={16} />,
        },
        {
          tab: 'panchang_muhurta' as MainTab,
          subTab: 'btr_pakshi_tools',
          labelEn: 'BTR & Pancha Pakshi Tools',
          labelHi: 'BTR समय शुद्धि व पंच पक्षी',
          icon: <Compass size={16} />,
        },
      ],
    },
  ];

  return (
    <div className="pro-drawer-overlay no-print" onClick={onClose} aria-hidden="true">
      <div
        className="pro-drawer-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Navigation Menu"
      >
        {/* Drawer Header */}
        <div className="pro-drawer-header">
          <div className="pro-drawer-brand">
            <span className="pro-om-symbol">ॐ</span>
            <div>
              <div className="pro-drawer-title">{isHi ? 'ज्योतिष होरा' : 'Jyotish Hora'}</div>
              <div className="pro-drawer-sub">
                {isHi ? 'वैदिक ज्योतिष संस्थान' : 'Professional Vedic Studio'}
              </div>
            </div>
          </div>
          <button
            type="button"
            className="pro-drawer-close-btn"
            onClick={onClose}
            aria-label="Close Menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Native Profile Card */}
        <div className="pro-drawer-native-card">
          <div className="pro-drawer-native-top">
            <div className="pro-drawer-native-info">
              <span className="pro-drawer-native-name">{activeInput.name}</span>
              <span className="pro-drawer-native-meta">
                {formatDateDmy(activeInput.date)} · {activeInput.city}
              </span>
            </div>
            <button
              type="button"
              className="pro-drawer-action-btn"
              onClick={() => {
                onOpenEditor();
                onClose();
              }}
              title={isHi ? 'सुधार करें' : 'Edit Profile'}
            >
              <Edit3 size={14} />
            </button>
          </div>

          <div className="pro-drawer-native-select-row">
            <select
              className="pro-drawer-select"
              value={activeInput.id}
              onChange={(e) => onSelectProfile(e.target.value)}
              aria-label="Select Native Profile"
            >
              {profiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({formatDateDmy(p.date)})
                </option>
              ))}
            </select>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                onNewKundli();
                onClose();
              }}
              title={isHi ? 'नई कुंडली' : 'New Chart'}
            >
              <Plus size={13} />
              <span>{isHi ? 'नई' : 'New'}</span>
            </button>
          </div>
        </div>

        {/* Quick Direct Links (Home & Print Patrika) */}
        <div className="pro-drawer-shortcuts">
          <button
            type="button"
            className={`pro-drawer-shortcut-btn ${activeTab === 'home' ? 'is-active' : ''}`}
            onClick={() => handleItemClick('home')}
          >
            <Home size={16} />
            <span>{isHi ? 'होम डैशबोर्ड' : 'Home Dashboard'}</span>
          </button>
          <button
            type="button"
            className="pro-drawer-shortcut-btn pro-patrika-highlight"
            onClick={() => {
              onOpenBooklet();
              onClose();
            }}
          >
            <FileText size={16} />
            <span>{isHi ? '34-अध्यायी बृहत् पत्रिका PDF' : '34-Chapter Patrika PDF'}</span>
          </button>
        </div>

        {/* Scrollable Navigation Categories */}
        <div className="pro-drawer-scroll-body">
          {menuSections.map((sec, sIdx) => (
            <div key={sIdx} className="pro-drawer-section">
              <div className="pro-drawer-section-title">
                {isHi ? sec.titleHi : sec.titleEn}
              </div>
              <div className="pro-drawer-section-items">
                {sec.items.map((item, iIdx) => (
                  <button
                    key={iIdx}
                    type="button"
                    className="pro-drawer-item-btn"
                    onClick={() => handleItemClick(item.tab, item.subTab)}
                  >
                    <span className="pro-drawer-item-icon">{item.icon}</span>
                    <span className="pro-drawer-item-label">
                      {isHi ? item.labelHi : item.labelEn}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Drawer Footer Utilities */}
        <div className="pro-drawer-footer">
          <div className="pro-drawer-footer-row">
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

            {/* Theme Toggle */}
            <button
              type="button"
              className="pro-icon-tool-btn"
              onClick={onToggleTheme}
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>

            {/* Settings */}
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                onOpenSettings();
                onClose();
              }}
            >
              <Settings size={14} />
              <span>{isHi ? 'सेटिंग्स' : 'Settings'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
