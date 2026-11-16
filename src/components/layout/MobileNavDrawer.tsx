import React from 'react';
import {
  Award,
  BookOpen,
  Calendar,
  Clock,
  Compass,
  Edit3,
  Flame,
  Grid,
  Heart,
  Moon,
  Plus,
  RotateCcw,
  Scroll,
  Settings,
  ShieldAlert,
  Sparkles,
  Star,
  Sun,
  UserCheck,
  X,
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
      titleEn: '🏛️ Vedic Astrology Workstation',
      titleHi: '🏛️ वैदिक ज्योतिष वर्कस्टेशन',
      items: [
        {
          tab: 'workstation' as MainTab,
          subTab: 'sarini',
          labelEn: '1. Basic Details & Avakhada Sheet',
          labelHi: '1. ज्योतिष सारिणी व मूल विवरण',
          icon: <UserCheck size={16} />,
        },
        {
          tab: 'workstation' as MainTab,
          subTab: 'charts_tables',
          labelEn: '2. All Vargas D1–D60, SAV & Tables',
          labelHi: '2. कुंडली व वर्ग चक्र / तालिकायें (D1–D60)',
          icon: <Grid size={16} />,
        },
        {
          tab: 'workstation' as MainTab,
          subTab: 'dasha',
          labelEn: '3. Multi-Dasha Systems (Vimshottari/Yogini)',
          labelHi: '3. दशा प्रणाली (विंशोत्तरी 5 स्तर, योगिनी)',
          icon: <Clock size={16} />,
        },
        {
          tab: 'workstation' as MainTab,
          subTab: 'varshphal',
          labelEn: '4. Annual Varshphal & Tajika Sahams',
          labelHi: '4. वर्षफल / ताजिक वार्षिक (मुन्था, वर्षेश, सहम)',
          icon: <Sun size={16} />,
        },
        {
          tab: 'workstation' as MainTab,
          subTab: 'chakras',
          labelEn: '5. Special Chakras (Sudarshan/Kota/Kurma)',
          labelHi: '5. विविध वैदिक चक्र (सुदर्शन, सर्वतोभद्र, कोटा, कूर्म)',
          icon: <Compass size={16} />,
        },
        {
          tab: 'workstation' as MainTab,
          subTab: 'yogas_doshas',
          labelEn: '6. Classical Yogas, Doshas & Conjunctions',
          labelHi: '6. योग, दोष एवं युति विश्लेषण (राजयोग, मांगलिक, कालसर्प)',
          icon: <Award size={16} />,
        },
        {
          tab: 'workstation' as MainTab,
          subTab: 'navamsha',
          labelEn: '7. Navamsha D9 Deep Reading & Pushkara',
          labelHi: '7. नवांश कुंडली विशेष विवेचन (कारकांश व पुष्कर भाग)',
          icon: <Sparkles size={16} />,
        },
        {
          tab: 'workstation' as MainTab,
          subTab: 'kp_system',
          labelEn: '8. KP Krishnamurti Paddhati (Sub-Lords)',
          labelHi: '8. के.पी. (KP) ज्योतिष प्रणाली (कस्प व 4-चरण कारक)',
          icon: <Star size={16} />,
        },
        {
          tab: 'workstation' as MainTab,
          subTab: 'lal_kitab',
          labelEn: '9. Lal Kitab System (Debts & Upay)',
          labelHi: '9. लाल किताब प्रणाली (टेवा, सोये भाव व ऋण)',
          icon: <Flame size={16} />,
        },
        {
          tab: 'workstation' as MainTab,
          subTab: 'predictions',
          labelEn: '10. Deep Predictions: Career, Appearance & Family',
          labelHi: '10. सटीक जीवन फलकथन (करियर, रूप-रंग व पारिवारिक यथार्थ)',
          icon: <BookOpen size={16} />,
        },
        {
          tab: 'workstation' as MainTab,
          subTab: 'past_future',
          labelEn: '11. Past Life D60 & Future Rebirth',
          labelHi: '11. पूर्व जन्म व भावी गति (D60 सभ्यता व योनि)',
          icon: <RotateCcw size={16} />,
        },
        {
          tab: 'workstation' as MainTab,
          subTab: 'matchmaking',
          labelEn: '12. Kundali Match Making (36 Gunas)',
          labelHi: '12. कुंडली मिलान (36 गुण अष्टकूट व दोष साम्य)',
          icon: <Heart size={16} />,
        },
        {
          tab: 'workstation' as MainTab,
          subTab: 'remedies',
          labelEn: '13. Comprehensive Shastric Remedies',
          labelHi: '13. सम्पूर्ण शास्त्रीय उपाय (मंत्र, दान, स्नान व रत्न)',
          icon: <ShieldAlert size={16} />,
        },
        {
          tab: 'workstation' as MainTab,
          subTab: 'panchang',
          labelEn: '14. Daily Drik Panchang & Muhurta',
          labelHi: '14. दैनिक पंचांग व मुहूर्त (चोघड़िया, होरा व पर्व)',
          icon: <Calendar size={16} />,
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

            {/* Chart Style Toggle */}
            <div className="pro-chart-style-toggle" role="group" aria-label="Chart Style">
              <button
                type="button"
                className={`pro-chart-btn ${settings.chartStyle === 'north' ? 'is-active' : ''}`}
                onClick={() => onChangeChartStyle('north')}
                title={isHi ? 'उत्तर भारतीय' : 'North Indian'}
              >
                {isHi ? 'उत्तर' : 'North'}
              </button>
              <button
                type="button"
                className={`pro-chart-btn ${settings.chartStyle === 'south' ? 'is-active' : ''}`}
                onClick={() => onChangeChartStyle('south')}
                title={isHi ? 'दक्षिण भारतीय' : 'South Indian'}
              >
                {isHi ? 'दक्षिण' : 'South'}
              </button>
              <button
                type="button"
                className={`pro-chart-btn ${settings.chartStyle === 'east' ? 'is-active' : ''}`}
                onClick={() => onChangeChartStyle('east')}
                title={isHi ? 'पूर्वी भारतीय' : 'East Indian'}
              >
                {isHi ? 'पूर्व' : 'East'}
              </button>
            </div>
          </div>

          <div className="pro-drawer-footer-row pro-footer-secondary">
            {/* Theme Toggle */}
            <button
              type="button"
              className="pro-footer-action-btn"
              onClick={onToggleTheme}
              title={isHi ? 'थीम बदलें' : 'Toggle Theme'}
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
              <span>{theme === 'dark' ? (isHi ? 'लाइट थीम' : 'Light') : (isHi ? 'डार्क थीम' : 'Dark')}</span>
            </button>

            {/* Settings Dialog Trigger */}
            <button
              type="button"
              className="pro-footer-action-btn"
              onClick={() => {
                onOpenSettings();
                onClose();
              }}
              title={isHi ? 'सेटिंग्स' : 'Settings'}
            >
              <Settings size={15} />
              <span>{isHi ? 'सेटिंग्स' : 'Settings'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
