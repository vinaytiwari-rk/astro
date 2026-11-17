import React from 'react';
import { Clock, FileText, Home, Menu, Sparkles } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import type { MainTab } from '../../nav';

interface MobileBottomNavProps {
  activeTab: MainTab;
  activeSubTab?: string;
  onNavigate: (tab: MainTab, subTab?: string) => void;
  onOpenDrawer: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  activeSubTab,
  onNavigate,
  onOpenDrawer,
}) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';

  const isHome = activeTab === 'home';
  const isBasics = activeTab === 'workstation' && (!activeSubTab || activeSubTab === '1');
  const isDasha = activeTab === 'workstation' && activeSubTab === '6';
  const isPred = activeTab === 'workstation' && (activeSubTab === '8' || activeSubTab === '12');

  return (
    <nav className="pro-mobile-bottom-bar no-print" aria-label="Mobile Navigation">
      <button
        type="button"
        className={`pro-mob-btn ${isHome ? 'is-active' : ''}`}
        onClick={() => onNavigate('home')}
      >
        <Home size={18} />
        <span className="pro-mob-label">{isHi ? 'होम' : 'Home'}</span>
      </button>

      <button
        type="button"
        className={`pro-mob-btn ${isBasics ? 'is-active' : ''}`}
        onClick={() => onNavigate('workstation', '1')}
      >
        <FileText size={18} />
        <span className="pro-mob-label">{isHi ? 'कुंडली' : 'Kundli'}</span>
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
        <span className="pro-mob-label">{isHi ? 'फलादेश' : 'Predictions'}</span>
      </button>

      <button
        type="button"
        className="pro-mob-btn"
        onClick={onOpenDrawer}
        aria-label="Open Full Menu"
      >
        <Menu size={18} />
        <span className="pro-mob-label">{isHi ? '12 भाग' : '12 Divs'}</span>
      </button>
    </nav>
  );
};
