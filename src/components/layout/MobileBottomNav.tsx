import React from 'react';
import { FileText, Heart, Home, Menu, Sparkles } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { trNav } from '../../i18n/translations';

interface MobileBottomNavProps {
  currentView: string;
  onNavigate: (view: string, sub?: string) => void;
  onOpenDrawer: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentView,
  onNavigate,
  onOpenDrawer,
}) => {
  const { lang } = useLanguage();

  return (
    <nav className="pro-mobile-bottom-bar no-print" aria-label="Mobile Navigation">
      <button
        type="button"
        className={`pro-mob-btn ${currentView === 'home' ? 'is-active' : ''}`}
        onClick={() => onNavigate('home')}
      >
        <Home size={18} />
        <span className="pro-mob-label">{trNav('home', lang)}</span>
      </button>

      <button
        type="button"
        className={`pro-mob-btn ${currentView === 'vedic-horoscope' ? 'is-active' : ''}`}
        onClick={() => onNavigate('vedic-horoscope')}
      >
        <FileText size={18} />
        <span className="pro-mob-label">{trNav('kundliMob', lang)}</span>
      </button>

      <button
        type="button"
        className={`pro-mob-btn ${currentView === 'predictions' ? 'is-active' : ''}`}
        onClick={() => onNavigate('predictions', 'deep_life')}
      >
        <Sparkles size={18} />
        <span className="pro-mob-label">{trNav('predictions', lang)}</span>
      </button>

      <button
        type="button"
        className={`pro-mob-btn ${currentView === 'marriage-matching' ? 'is-active' : ''}`}
        onClick={() => onNavigate('marriage-matching')}
      >
        <Heart size={18} />
        <span className="pro-mob-label">{trNav('matchMob', lang)}</span>
      </button>

      <button
        type="button"
        className="pro-mob-btn"
        onClick={onOpenDrawer}
        aria-label="Open More Menu"
      >
        <Menu size={18} />
        <span className="pro-mob-label">{trNav('menu', lang)}</span>
      </button>
    </nav>
  );
};
