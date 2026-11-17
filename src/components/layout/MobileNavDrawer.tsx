import React from 'react';
import {
  Award,
  BookOpen,
  Calendar,
  Clock,
  Compass,
  Edit3,
  FileText,
  Heart,
  Home,
  Plus,
  Settings,
  Sparkles,
  Star,
  UserCheck,
  X,
} from 'lucide-react';
import { formatDateDmy } from '../../astro/time';
import type { BirthInput, CalcSettings, ChartStyle } from '../../astro/types';
import { useLanguage } from '../../i18n/LanguageContext';

interface MobileNavDrawerProps {
  open: boolean;
  onClose: () => void;
  currentView: string;
  onNavigate: (view: string, sub?: string) => void;
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
  currentView,
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

  const handleItemClick = (view: string, sub?: string) => {
    onNavigate(view, sub);
    onClose();
  };

  const navLinks = [
    { view: 'home', labelEn: 'Home', labelHi: 'होम', icon: <Home size={16} /> },
    { view: 'vedic-horoscope', labelEn: 'Janam Kundli (Horoscope)', labelHi: 'वैदिक जन्म कुंडली', icon: <FileText size={16} /> },
    { view: 'life-dossier', labelEn: '12-Chapter Master Dossier', labelHi: '12-अध्याय जीवन डोजियर', icon: <BookOpen size={16} /> },
    { view: 'dual-transit', labelEn: 'Live Dual Transit & Event Machine', labelHi: 'द्वि-चक्र गोचर व टाइम मशीन', icon: <Clock size={16} /> },
    { view: 'split-studio', labelEn: '4-Screen Split Studio Workstation', labelHi: '4-स्क्रीन ज्योतिषी वर्कस्टेशन', icon: <Compass size={16} /> },
    { view: 'sarvatobhadra', labelEn: 'Sarvatobhadra 9x9 & Vedha', labelHi: 'सर्वतोभद्र चक्र व वेध फल', icon: <Sparkles size={16} /> },
    { view: 'lal-kitab', labelEn: 'Lal Kitab System & Varshphal', labelHi: 'लाल किताब एवं वर्षफल', icon: <BookOpen size={16} /> },
    { view: 'holistic-remedies', labelEn: 'Holistic Remedies & Vedic Chanting', labelHi: 'वैदिक समग्र उपचार व स्तोत्र', icon: <Heart size={16} /> },
    { view: 'kp-horoscope', labelEn: 'KP Horoscope & Sub-Lords', labelHi: 'केपी पद्धति कुंडली', icon: <Compass size={16} /> },
    { view: 'marriage-matching', labelEn: 'Marriage Matching (Guna Milan)', labelHi: 'विवाह मिलान (36 गुण)', icon: <Heart size={16} /> },
    { view: 'daily-panchanga', labelEn: "Daily Panchang & Hora", labelHi: 'दैनिक पंचांग व होरा', icon: <Calendar size={16} /> },
    { view: 'sambhavit-falkathan', labelEn: 'Life Predictions (51 Dimensions)', labelHi: 'संभावित फलकथन (51 आयाम)', icon: <Star size={16} /> },
    { view: 'festivals', labelEn: 'Hindu Festival Calendar 2026-2027', labelHi: 'हिंदू पर्व एवं व्रत कैलेंडर', icon: <Calendar size={16} /> },
    { view: 'ashtakavarga', labelEn: 'Ashtakavarga Table (SAV 337)', labelHi: 'अष्टकवर्ग सारणी (SAV)', icon: <Sparkles size={16} /> },
    { view: 'shadbala', labelEn: 'Shadbala Strengths', labelHi: 'षड्बल गणना', icon: <Sparkles size={16} /> },
    { view: 'transit-today', labelEn: 'Live Transits (Gochar)', labelHi: 'आज का गोचर', icon: <Clock size={16} /> },
    { view: 'baby-names', labelEn: 'Newborn Baby Names', labelHi: 'शिशु नामकरण व नामाक्षर', icon: <Star size={16} /> },
    { view: 'gemstones', labelEn: 'Gemstone & Rudraksha', labelHi: 'वैदिक रत्न व रुद्राक्ष', icon: <Sparkles size={16} /> },
    { view: 'choghadiya', labelEn: 'Choghadiya & Muhurta', labelHi: 'चौघड़िया मुहूर्त', icon: <Clock size={16} /> },
    { view: 'transit-calendar', labelEn: '365-Day Transit Calendar', labelHi: '365-दिवसीय गोचर कैलेंडर', icon: <Calendar size={16} /> },
    { view: 'financial-astrology', labelEn: 'Financial & Stock Market', labelHi: 'वित्तीय व शेयर बाजार ज्योतिष', icon: <Award size={16} /> },
    { view: 'samudrika-shastra', labelEn: 'Samudrika & Palmistry', labelHi: 'सामुद्रिक शास्त्र व हस्तरेखा', icon: <Sparkles size={16} /> },
    { view: 'workstation', labelEn: '12-Division Workstation', labelHi: '12-भाग विस्तृत वर्कस्टेशन', icon: <Compass size={16} /> },
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
              <div className="pro-drawer-title">AV Astro Vibe</div>
              <div className="pro-drawer-sub">
                {isHi ? 'वैदिक ज्योतिष एवं पंचांग संस्थान' : 'Vedic Astrology & Free Predictions'}
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
              title={isHi ? 'विवरण बदलें' : 'Edit Details'}
            >
              <Edit3 size={15} />
            </button>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="pro-drawer-content">
          <div className="pro-drawer-section">
            <div className="pro-drawer-section-title">
              {isHi ? 'नेविगेशन सेवाएं (100% निःशुल्क)' : 'Navigation Services (100% Free)'}
            </div>
            <div className="pro-drawer-list">
              {navLinks.map((item) => (
                <button
                  key={item.view}
                  type="button"
                  className={`pro-drawer-item ${currentView === item.view ? 'is-active' : ''}`}
                  onClick={() => handleItemClick(item.view)}
                >
                  <span className="pro-drawer-item-icon">{item.icon}</span>
                  <span className="pro-drawer-item-label">
                    {isHi ? item.labelHi : item.labelEn}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick PDF Report CTA */}
          <div style={{ padding: '12px' }}>
            <button
              type="button"
              className="oj-action-btn primary"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => {
                onOpenBooklet();
                onClose();
              }}
            >
              <FileText size={15} />
              <span>{isHi ? 'जन्म पत्रिका PDF (निःशुल्क)' : 'Birth Report (जन्म पत्रिका) (Free)'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
