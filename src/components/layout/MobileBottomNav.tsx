import React from 'react';
import { Calendar, Clock, Menu, Scroll, Sparkles } from 'lucide-react';
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

  const isKundli = !activeSubTab || activeSubTab === 'sarini' || activeSubTab === 'charts_tables';
  const isPredictions = activeSubTab === 'predictions';
  const isDasha = activeSubTab === 'dasha';
  const isRemedies = activeSubTab === 'remedies';
  const isPanchang = activeSubTab === 'panchang';

  return (
    <nav className="pro-mobile-bottom-bar no-print" aria-label="Mobile Navigation">
      <button
        type="button"
        className={`pro-mob-btn ${isKundli ? 'is-active' : ''}`}
        onClick={() => onNavigate('workstation', 'charts_tables')}
      >
        <Scroll size={19} />
        <span className="pro-mob-label">{isHi ? 'कुंडली' : 'Kundli'}</span>
      </button>

      <button
        type="button"
        className={`pro-mob-btn ${isPredictions ? 'is-active' : ''}`}
        onClick={() => onNavigate('workstation', 'predictions')}
      >
        <Sparkles size={19} />
        <span className="pro-mob-label">{isHi ? 'फलकथन' : 'Predictions'}</span>
      </button>

      <button
        type="button"
        className={`pro-mob-btn ${isDasha ? 'is-active' : ''}`}
        onClick={() => onNavigate('workstation', 'dasha')}
      >
        <Clock size={19} />
        <span className="pro-mob-label">{isHi ? 'दशा' : 'Dasha'}</span>
      </button>

      <button
        type="button"
        className={`pro-mob-btn ${isRemedies ? 'is-active' : ''}`}
        onClick={() => onNavigate('workstation', 'remedies')}
      >
        <Sparkles size={19} />
        <span className="pro-mob-label">{isHi ? 'उपाय' : 'Remedies'}</span>
      </button>

      <button
        type="button"
        className={`pro-mob-btn ${isPanchang ? 'is-active' : ''}`}
        onClick={() => onNavigate('workstation', 'panchang')}
      >
        <Calendar size={19} />
        <span className="pro-mob-label">{isHi ? 'पंचांग' : 'Panchang'}</span>
      </button>

      <button
        type="button"
        className="pro-mob-btn"
        onClick={onOpenDrawer}
        aria-label="Open Full Menu"
      >
        <Menu size={19} />
        <span className="pro-mob-label">{isHi ? 'मेन्यू' : 'Menu'}</span>
      </button>
    </nav>
  );
};
