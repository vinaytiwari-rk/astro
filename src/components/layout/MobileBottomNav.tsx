import React from 'react';
import { Calendar, Clock, Compass, FileText, Menu, Scroll } from 'lucide-react';
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
  const isD1 = activeSubTab === '2' || activeSubTab === 'd1' || activeSubTab === 'charts_tables';
  const isDasha = activeSubTab === '31' || activeSubTab === 'dasha';
  const isGochar = activeSubTab === '30' || activeSubTab === 'gochar';

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
        className={`pro-mob-btn ${isD1 ? 'is-active' : ''}`}
        onClick={() => onNavigate('workstation', '2')}
      >
        <Scroll size={18} />
        <span className="pro-mob-label">{isHi ? 'D-1 लग्न' : 'D-1 Lagna'}</span>
      </button>

      <button
        type="button"
        className={`pro-mob-btn ${isDasha ? 'is-active' : ''}`}
        onClick={() => onNavigate('workstation', '31')}
      >
        <Clock size={18} />
        <span className="pro-mob-label">{isHi ? 'दशा' : 'Dasha'}</span>
      </button>

      <button
        type="button"
        className={`pro-mob-btn ${isGochar ? 'is-active' : ''}`}
        onClick={() => onNavigate('workstation', '30')}
      >
        <Compass size={18} />
        <span className="pro-mob-label">{isHi ? 'गोचर' : 'Gochar'}</span>
      </button>

      <button
        type="button"
        className="pro-mob-btn"
        onClick={onOpenDrawer}
        aria-label="Open Full Menu"
      >
        <Menu size={18} />
        <span className="pro-mob-label">{isHi ? '38 पेज' : '38 Pages'}</span>
      </button>
    </nav>
  );
};
