import React from 'react';
import { Clock, Home, Menu, Scroll, Sparkles } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import type { MainTab } from '../../nav';

interface MobileBottomNavProps {
  activeTab: MainTab;
  onNavigate: (tab: MainTab) => void;
  onOpenDrawer: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onNavigate,
  onOpenDrawer,
}) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';

  const isKundli =
    activeTab === 'kundli' ||
    activeTab === 'basics' ||
    activeTab === 'vargas' ||
    activeTab === 'strength' ||
    activeTab === 'ashtakavarga';

  const isPredictions = activeTab === 'predictions';

  const isDasha =
    activeTab === 'dasha_transits' || activeTab === 'dasha' || activeTab === 'transits';

  return (
    <nav className="pro-mobile-bottom-bar no-print" aria-label="Mobile Navigation">
      <button
        type="button"
        className={`pro-mob-btn ${activeTab === 'home' ? 'is-active' : ''}`}
        onClick={() => onNavigate('home')}
      >
        <Home size={19} />
        <span className="pro-mob-label">{isHi ? 'होम' : 'Home'}</span>
      </button>

      <button
        type="button"
        className={`pro-mob-btn ${isKundli ? 'is-active' : ''}`}
        onClick={() => onNavigate('kundli')}
      >
        <Scroll size={19} />
        <span className="pro-mob-label">{isHi ? 'कुंडली' : 'Kundli'}</span>
      </button>

      <button
        type="button"
        className={`pro-mob-btn ${isPredictions ? 'is-active' : ''}`}
        onClick={() => onNavigate('predictions')}
      >
        <Sparkles size={19} />
        <span className="pro-mob-label">{isHi ? 'फलादेश' : 'Predictions'}</span>
      </button>

      <button
        type="button"
        className={`pro-mob-btn ${isDasha ? 'is-active' : ''}`}
        onClick={() => onNavigate('dasha_transits')}
      >
        <Clock size={19} />
        <span className="pro-mob-label">{isHi ? 'दशा' : 'Dasha'}</span>
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
