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
import { WORKSTATION_DIVISIONS } from '../VedicMasterWorkstation';

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
      titleEn: 'Workstation Divisions (1 to 12)',
      titleHi: 'वैदिक ज्योतिष वर्कस्टेशन (भाग 1 से 12)',
      items: WORKSTATION_DIVISIONS.map((div) => ({
        tab: 'workstation' as MainTab,
        subTab: String(div.divisionNumber),
        labelEn: div.labelEn,
        labelHi: div.labelHi,
        icon: <span style={{ fontWeight: 700, fontSize: '11px', color: 'var(--accent)' }}>#{div.divisionNumber}</span>,
      })),
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
