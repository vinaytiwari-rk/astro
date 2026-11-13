import React from 'react';
import {
  BookOpen,
  Calendar,
  Clock,
  Compass,
  Edit3,
  FileText,
  Heart,
  Home,
  Menu,
  Moon,
  Plus,
  Scroll,
  Settings,
  Sparkles,
  Sun,
  X,
} from 'lucide-react';
import { formatDateDmy } from '../../astro/time';
import type { BirthInput, CalcSettings, ChartStyle } from '../../astro/types';
import { useLanguage } from '../../i18n/LanguageContext';
import type { MainTab } from '../../nav';

interface AppHeaderProps {
  activeTab: MainTab;
  onNavigate: (tab: MainTab, subTab?: string, nested?: string) => void;
  activeInput: BirthInput;
  profiles: BirthInput[];
  onSelectProfile: (id: string) => void;
  onOpenEditor: () => void;
  onNewKundli: () => void;
  onOpenBooklet: () => void;
  onOpenSettings: () => void;
  drawerOpen: boolean;
  onToggleDrawer: () => void;
  settings: CalcSettings;
  onChangeChartStyle: (style: ChartStyle) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  activeTab,
  onNavigate,
  activeInput,
  profiles,
  onSelectProfile,
  onOpenEditor,
  onNewKundli,
  onOpenBooklet,
  onOpenSettings,
  drawerOpen,
  onToggleDrawer,
  settings,
  onChangeChartStyle,
  theme,
  onToggleTheme,
}) => {
  const { lang, setLang } = useLanguage();
  const isHi = lang === 'hi';

  // Normalize active tab to one of the 8 primary tabs for header highlighting
  const getActivePrimaryTab = (tab: MainTab): MainTab => {
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

  const primaryActive = getActivePrimaryTab(activeTab);

  const navItems = [
    {
      id: 'home' as MainTab,
      labelEn: 'Home',
      labelHi: 'होम',
      icon: <Home size={15} />,
    },
    {
      id: 'kundli' as MainTab,
      labelEn: 'Kundli',
      labelHi: 'जन्म कुंडली',
      icon: <Scroll size={15} />,
    },
    {
      id: 'predictions' as MainTab,
      labelEn: 'Predictions',
      labelHi: 'सटीक फलादेश',
      icon: <Sparkles size={15} />,
    },
    {
      id: 'dasha_transits' as MainTab,
      labelEn: 'Dasha & Transits',
      labelHi: 'दशा व गोचर',
      icon: <Clock size={15} />,
    },
    {
      id: 'branches' as MainTab,
      labelEn: 'Systems & Branches',
      labelHi: 'शाखाएँ व पध्दतियाँ',
      icon: <Compass size={15} />,
    },
    {
      id: 'matchmaking' as MainTab,
      labelEn: 'Matching',
      labelHi: 'कुंडली मिलान',
      icon: <Heart size={15} />,
    },
    {
      id: 'panchang_muhurta' as MainTab,
      labelEn: 'Panchang & Muhurta',
      labelHi: 'पंचांग व मुहूर्त',
      icon: <Calendar size={15} />,
    },
    {
      id: 'patrika_booklet' as MainTab,
      labelEn: 'Patrika PDF',
      labelHi: 'बृहत् पत्रिका PDF',
      icon: <FileText size={15} />,
    },
  ];

  return (
    <header className="pro-header no-print">
      {/* Top Main Bar */}
      <div className="pro-top-row">
        {/* Left: Mobile Toggle + Brand Logo */}
        <div className="pro-brand-zone">
          <button
            type="button"
            className="pro-drawer-toggle-btn"
            onClick={onToggleDrawer}
            aria-label="Toggle Navigation Menu"
          >
            {drawerOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          <button
            type="button"
            className="pro-brand-btn"
            onClick={() => onNavigate('home')}
            title={isHi ? 'मुख्य डैशबोर्ड' : 'Worksheet Dashboard'}
          >
            <span className="pro-om-symbol" aria-hidden="true">
              ॐ
            </span>
            <div className="pro-brand-text">
              <span className="pro-brand-title">
                {isHi ? 'ज्योतिष होरा' : 'Jyotish Hora'}
              </span>
              <span className="pro-brand-tagline">
                {isHi ? 'वैदिक ज्योतिष एवं पंचांग संस्थान' : 'Vedic Astrology Studio'}
              </span>
            </div>
          </button>
        </div>

        {/* Center: Active Profile Card & Switcher (Web) */}
        <div className="pro-native-selector-zone">
          <div className="pro-native-card">
            <select
              aria-label="Select Native Profile"
              className="pro-profile-dropdown"
              value={activeInput.id}
              onChange={(e) => onSelectProfile(e.target.value)}
            >
              {profiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({formatDateDmy(p.date)} · {p.city})
                </option>
              ))}
            </select>

            <div className="pro-native-actions">
              <button
                type="button"
                className="pro-action-btn"
                onClick={onOpenEditor}
                title={isHi ? 'जन्म विवरण संशोधित करें' : 'Edit Native Details'}
              >
                <Edit3 size={13} />
                <span className="pro-btn-text">{isHi ? 'संशोधन' : 'Edit'}</span>
              </button>
              <button
                type="button"
                className="pro-action-btn"
                onClick={onNewKundli}
                title={isHi ? 'नई कुंडली बनाएँ' : 'New Horoscope'}
              >
                <Plus size={13} />
                <span className="pro-btn-text">{isHi ? 'नई' : 'New'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Language Pill, Chart Style, Theme, Settings */}
        <div className="pro-utilities-zone">
          {/* Language Switcher */}
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

          {/* Chart Style Switcher (Desktop) */}
          <select
            aria-label="Chart Style"
            className="pro-chart-style-select"
            value={settings.chartStyle}
            onChange={(e) => onChangeChartStyle(e.target.value as ChartStyle)}
          >
            <option value="north">{isHi ? 'उत्तर भारतीय' : 'North Indian'}</option>
            <option value="south">{isHi ? 'दक्षिण भारतीय' : 'South Indian'}</option>
            <option value="east">{isHi ? 'पूर्वी (बंगाली)' : 'East Indian'}</option>
          </select>

          {/* Theme Switcher */}
          <button
            type="button"
            className="pro-icon-tool-btn"
            onClick={onToggleTheme}
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          {/* Settings Modal Button */}
          <button
            type="button"
            className="pro-icon-tool-btn"
            onClick={onOpenSettings}
            title={isHi ? 'गणना सेटिंग्स (अयनांश/भाव)' : 'Calculation Settings'}
            aria-label="Settings"
          >
            <Settings size={16} />
          </button>
        </div>
      </div>

      {/* Desktop Primary Navigation Bar */}
      <nav className="pro-primary-nav" aria-label="Primary Navigation">
        <div className="pro-nav-scroll-container">
          {navItems.map((item) => {
            const isActive = primaryActive === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`pro-nav-tab-btn ${isActive ? 'is-active' : ''}`}
                onClick={() => onNavigate(item.id)}
              >
                <span className="pro-nav-icon">{item.icon}</span>
                <span className="pro-nav-label">
                  {isHi ? item.labelHi : item.labelEn}
                </span>
                {isActive && <span className="pro-nav-active-indicator" />}
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
};
