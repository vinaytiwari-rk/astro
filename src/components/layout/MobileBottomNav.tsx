import React from 'react';
import { Calendar, Clock, Compass, FileText, Menu, Scroll, Sparkles } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import type { MainTab } from '../../nav';

interface MobileBottomNavProps {
  activeTab: MainTab;
  activeSubTab?: string;
  onNavigate: (tab: MainTab, subTab?: string) => void;
  onOpenDrawer: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeSubTab,
  onNavigate,
  onOpenDrawer,
}) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';

  const isBasics = !activeSubTab || activeSubTab === '1' || activeSubTab === 'sarini';
  const isCore = activeSubTab === '2' || activeSubTab === 'd1' || activeSubTab === 'charts_tables';
  const isDasha = activeSubTab === '6' || activeSubTab === 'dasha';
  const isPred = activeSubTab === '8' || activeSubTab === 'predictions';

  return (
    <nav className="pro-mobile-bottom-bar no-print" aria-label="Mobile Navigation">
      <button
        type="button"
        className={`pro-mob-btn ${isBasics ? 'is-active' : ''}`}
        onClick={() => onNavigate('workstation', '1')}
      >
        <FileText size={18} />
        <span className="pro-mob-label">{isHi ? 'मूल विवरण' : 'Basics'}</span>
      </button>

      <button
        type="button"
        className={`pro-mob-btn ${isCore ? 'is-active' : ''}`}
        onClick={() => onNavigate('workstation', '2')}
      >
        <Scroll size={18} />
        <span className="pro-mob-label">{isHi ? 'मुख्य चक्र' : 'Core Charts'}</span>
      </button>

      <button
        type="button"
        className={`pro-mob-btn ${isDasha ? 'is-active' : ''}`}
        onClick={() => onNavigate('workstation', '6')}
      >
        <Clock size={18} />
        <span className="pro-mob-label">{isHi ? 'दशा' : 'Dashas'}</span>
      </button>

      <button
        type="button"
        className={`pro-mob-btn ${isPred ? 'is-active' : ''}`}
        onClick={() => onNavigate('workstation', '8')}
      >
        <Sparkles size={18} />
        <span className="pro-mob-label">{isHi ? 'फलकथन' : 'Predictions'}</span>
      </button>

      <button
        type="button"
        className="pro-mob-btn"
        onClick={onOpenDrawer}
        aria-label="Open Full Menu"
      >
        <Menu size={18} />
        <span className="pro-mob-label">{isHi ? '11 भाग' : '11 Parts'}</span>
      </button>
    </nav>
  );
};
