import React, { useEffect, useRef, useState } from 'react';
import {
  BookOpen,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Compass,
  Edit3,
  FileSpreadsheet,
  FileText,
  Globe,
  Heart,
  Home,
  Layers,
  Menu,
  Moon,
  Plus,
  Search,
  Settings,
  Sparkles,
  Star,
  Sun,
  User,
} from 'lucide-react';
import { formatDateDmy, formatDateTimeDmyAmPm } from '../../astro/time';
import type { BirthInput, CalcSettings, ChartStyle } from '../../astro/types';
import { useLanguage } from '../../i18n/LanguageContext';
import { LANGUAGE_LABELS, type AppLanguage, trNav, NAV_ITEMS_I18N } from '../../i18n/translations';

export interface DropdownNavHeaderProps {
  currentView: string;
  onNavigate: (view: string, sub?: string) => void;
  activeInput: BirthInput;
  profiles: BirthInput[];
  onSelectProfile: (id: string) => void;
  onOpenEditor: () => void;
  onNewKundli: () => void;
  onOpenBooklet: () => void;
  onOpenSettings: () => void;
  onOpenCommandPalette?: () => void;
  settings: CalcSettings;
  onChangeChartStyle: (style: ChartStyle) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const DropdownNavHeader: React.FC<DropdownNavHeaderProps> = ({
  currentView,
  onNavigate,
  activeInput,
  profiles,
  onSelectProfile,
  onOpenEditor,
  onNewKundli,
  onOpenBooklet,
  onOpenSettings,
  onOpenCommandPalette,
  settings,
  onChangeChartStyle,
  theme,
  onToggleTheme,
}) => {
  const { lang, setLang } = useLanguage();
  const isHi = lang === 'hi';

  const trD = (key: string, hiText: string, enText: string): string => {
    if (lang === 'en') return enText;
    if (lang === 'hi') return hiText;
    const mapped = trNav(key, lang);
    if (mapped && mapped !== key) return mapped;
    return enText;
  };

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [dropdownCoords, setDropdownCoords] = useState<{ top: number; left: number } | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const navRef = useRef<HTMLDivElement | null>(null);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearHoverTimer = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  };

  const checkScrollState = () => {
    if (navRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = navRef.current;
      setCanScrollLeft(scrollLeft > 6);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 6);
    }
  };

  useEffect(() => {
    checkScrollState();
    const handleResize = () => checkScrollState();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handlePointerOutside = (e: MouseEvent | TouchEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        clearHoverTimer();
        setOpenDropdown(null);
        setDropdownCoords(null);
      }
    };
    document.addEventListener('mousedown', handlePointerOutside);
    document.addEventListener('touchstart', handlePointerOutside, { passive: true });
    return () => {
      document.removeEventListener('mousedown', handlePointerOutside);
      document.removeEventListener('touchstart', handlePointerOutside);
      clearHoverTimer();
    };
  }, []);

  const calculateDropdownPos = (target: HTMLElement) => {
    const rect = target.getBoundingClientRect();
    const menuWidth = 320;
    let left = rect.left;
    if (typeof window !== 'undefined' && left + menuWidth > window.innerWidth - 14) {
      left = Math.max(12, window.innerWidth - menuWidth - 14);
    }
    return {
      top: Math.round(rect.bottom + 4),
      left: Math.round(Math.max(12, left)),
    };
  };

  const toggleDropdown = (key: string, e?: React.MouseEvent<HTMLElement>) => {
    clearHoverTimer();
    if (openDropdown === key) {
      setOpenDropdown(null);
      setDropdownCoords(null);
    } else {
      setOpenDropdown(key);
      if (e?.currentTarget) {
        setDropdownCoords(calculateDropdownPos(e.currentTarget));
      }
    }
  };

  const handleMouseEnter = (key: string, e: React.MouseEvent<HTMLElement>) => {
    if (typeof window !== 'undefined' && window.innerWidth > 768) {
      clearHoverTimer();
      setDropdownCoords(calculateDropdownPos(e.currentTarget));
      setOpenDropdown(key);
    }
  };

  const handleMouseLeave = () => {
    if (typeof window !== 'undefined' && window.innerWidth > 768) {
      clearHoverTimer();
      hoverTimerRef.current = setTimeout(() => {
        setOpenDropdown(null);
        setDropdownCoords(null);
      }, 240);
    }
  };

  const handleMenuMouseEnter = () => {
    clearHoverTimer();
  };

  const handleMenuMouseLeave = () => {
    handleMouseLeave();
  };

  const scrollNav = (direction: 'left' | 'right') => {
    if (navRef.current) {
      const amount = direction === 'left' ? -280 : 280;
      navRef.current.scrollBy({ left: amount, behavior: 'smooth' });
      setTimeout(checkScrollState, 350);
    }
  };

  const getDropdownMenuInlineStyle = () => {
    if (!dropdownCoords || typeof window === 'undefined') return undefined;
    const maxH = Math.max(260, window.innerHeight - dropdownCoords.top - 20);
    if (window.innerWidth <= 768) {
      return {
        position: 'fixed' as const,
        top: dropdownCoords.top,
        left: 12,
        right: 12,
        width: 'calc(100vw - 24px)',
        maxWidth: 'calc(100vw - 24px)',
        maxHeight: `${maxH}px`,
        overflowY: 'auto' as const,
      };
    }
    return {
      position: 'fixed' as const,
      top: dropdownCoords.top,
      left: dropdownCoords.left,
      maxHeight: `${maxH}px`,
      overflowY: 'auto' as const,
    };
  };

  const handleLinkClick = (view: string, sub?: string) => {
    clearHoverTimer();
    setOpenDropdown(null);
    setDropdownCoords(null);
    onNavigate(view, sub);
  };

  const isMatchingActive = currentView === 'marriage-matching' || currentView === 'kundali-milan';
  const isTransitsActive = currentView === 'sade-sati' || currentView === 'dual-transit' || currentView === 'transit-calendar';
  const isAdvancedActive = [
    'numerology',
    'multi-dasha',
    'dasha-matrix-81',
    'sudarshana',
    'sarvatobhadra',
    'kota-ayurdaya',
    'kp-enterprise',
    'jaimini',
    'lal-kitab',
    'varshaphala',
    'nadi',
    'ashtakavarga',
    'shadbala',
    'western-astrology',
    'human-design',
    'astrocartography',
    'parashara-workstation',
    'software-suite',
  ].includes(currentView);
  const isToolsActive = [
    'fortune-calculators',
    'interactive-palmistry',
    'samudrika-shastra',
    'life-event-timing',
    'classical-doshas',
    'muhurta',
    'prashna',
    'synastry',
    'btr',
    'medical-astrology',
    'financial-astrology',
    'celebrity-twins',
    'split-studio',
    'workstation',
    'client-diary',
  ].includes(currentView);
  const isRemediesActive = ['holistic-remedies', 'gemstones'].includes(currentView);
  const isFestivalsActive = ['festivals', 'daily-panchanga', 'choghadiya'].includes(currentView);

  return (
    <header className="dropdown-nav-header no-print">

      {/* Row 1: Brand Logo (AV Astro Vibe), Active Profile, Language & Tools */}
      <div className="dropdown-nav-top-row">
        {/* Brand: AV Astro Vibe */}
        <div
          className="dropdown-brand-btn"
          onClick={() => handleLinkClick('home')}
          title={trNav('home', lang)}
          style={{ cursor: 'pointer' }}
        >
          <img src="/logo.png" alt="AV Astro Vibe" className="app-brand-logo" />
          <div className="dropdown-brand-text">
            <span className="dropdown-brand-name">AV Astro Vibe</span>
            <span className="dropdown-brand-tag">
              {isHi ? 'वर्तमान में जिएं · LIVE IN PRESENT' : 'LIVE IN PRESENT'}
            </span>
          </div>
        </div>

        {/* Center: Active Profile Selector */}
        <div className="dropdown-profile-group">
          <User size={15} className="muted" />
          <select
            aria-label="Select Native Profile"
            className="dropdown-select-profile"
            value={activeInput.id}
            onChange={(e) => onSelectProfile(e.target.value)}
          >
            {profiles.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({formatDateTimeDmyAmPm(p.date, p.time)} · {p.city})
              </option>
            ))}
          </select>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onOpenEditor}
            title={trNav('edit', lang)}
          >
            <Edit3 size={13} />
            <span className="hide-on-mobile">{trNav('edit', lang)}</span>
          </button>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onNewKundli}
            title={trNav('new', lang)}
          >
            <Plus size={13} />
            <span className="hide-on-mobile">{trNav('new', lang)}</span>
          </button>
        </div>

        {/* Right Tools: Language, Chart Style, Birth Report, Theme, Settings */}
        <div className="dropdown-utilities-group">
          {/* Language Selector */}
          <div className="pro-lang-select-wrap" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Globe size={13} style={{ opacity: 0.7 }} />
            <select
              aria-label="Language Selector"
              className="select-compact"
              value={lang}
              onChange={(e) => setLang(e.target.value as AppLanguage)}
              style={{ fontWeight: 600, padding: '3px 6px', fontSize: '11px', height: '28px' }}
            >
              {Object.entries(LANGUAGE_LABELS).map(([code, label]) => (
                <option key={code} value={code}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Chart Style */}
          <select
            aria-label="Chart Style"
            className="select-compact hide-on-mobile"
            value={settings.chartStyle}
            onChange={(e) => onChangeChartStyle(e.target.value as ChartStyle)}
          >
            <option value="south">{isHi ? 'दक्षिण (South)' : 'South Indian'}</option>
            <option value="north">{isHi ? 'उत्तर (North)' : 'North Indian'}</option>
            <option value="east">{isHi ? 'पूर्व (East)' : 'East Indian'}</option>
          </select>

          {/* Print PDF Booklet */}
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onOpenBooklet}
            title={trNav('birthReport', lang)}
          >
            <FileText size={14} />
            <span className="hide-on-mobile">{trNav('birthReport', lang)}</span>
          </button>

          {/* Quick Search Palette (Ctrl + K) */}
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onOpenCommandPalette}
            title={trNav('search', lang)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Search size={14} />
            <span className="hide-on-mobile">{trNav('search', lang)}</span>
            <kbd
              style={{
                fontSize: '10px',
                opacity: 0.75,
                background: 'rgba(0,0,0,0.06)',
                padding: '1px 5px',
                borderRadius: '3px',
                fontWeight: 600,
              }}
            >
              Ctrl K
            </kbd>
          </button>

          {/* Settings */}
          <button
            type="button"
            className="icon-tool-btn"
            onClick={onOpenSettings}
            title={trNav('settings', lang)}
          >
            <Settings size={15} />
          </button>
        </div>
      </div>

      {/* Row 2: Main Navigation Bar with Direct Links & Necessary Dropdowns Only */}
      <div style={{ position: 'relative', width: '100%' }}>
        {canScrollLeft && (
          <button
            type="button"
            className="oj-nav-scroll-btn left"
            onClick={() => scrollNav('left')}
            aria-label="Scroll menu left"
            title={isHi ? 'बाएं स्क्रॉल करें' : 'Scroll left'}
          >
            <ChevronLeft size={16} />
          </button>
        )}

        <div
          className="oj-navbar-row"
          ref={navRef}
          onScroll={() => {
            checkScrollState();
            if (openDropdown) {
              clearHoverTimer();
              setOpenDropdown(null);
              setDropdownCoords(null);
            }
          }}
        >
          <div className="oj-navbar-inner">
            <ul className="oj-nav-links">
            {/* 1. Home — Direct Link (No Dropdown) */}
            <li className="oj-nav-item">
              <button
                type="button"
                className={`oj-nav-link-btn ${currentView === 'home' ? 'is-current' : ''}`}
                onClick={() => handleLinkClick('home')}
              >
                <Home size={13} />
                <span>{trNav('home', lang)}</span>
              </button>
            </li>

            {/* 2. Janam Kundli — Direct Link (No Dropdown) */}
            <li className="oj-nav-item">
              <button
                type="button"
                className={`oj-nav-link-btn ${currentView === 'vedic-horoscope' ? 'is-current' : ''}`}
                onClick={() => handleLinkClick('vedic-horoscope')}
              >
                <Compass size={13} />
                <span>{trNav('janamKundli', lang)}</span>
              </button>
            </li>

            {/* 2B. Astrological Calculations & Technical Details — Dedicated Link */}
            <li className="oj-nav-item">
              <button
                type="button"
                className={`oj-nav-link-btn ${currentView === 'calculations' ? 'is-current' : ''}`}
                onClick={() => handleLinkClick('calculations')}
              >
                <FileSpreadsheet size={13} />
                <span>{trNav('calculations', lang)}</span>
              </button>
            </li>

            {/* One Prediction menu with pure predictions */}
            <li
              className="oj-nav-item oj-dropdown-parent"
              onMouseEnter={(e) => handleMouseEnter('predictions-menu', e)}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                className={`oj-nav-link-btn oj-nav-dropdown-btn ${openDropdown === 'predictions-menu' ? 'is-open' : ''} ${currentView === 'predictions' || currentView.endsWith('-prediction') ? 'is-current' : ''}`}
                onClick={(e) => toggleDropdown('predictions-menu', e)}
                aria-expanded={openDropdown === 'predictions-menu'}
                aria-haspopup="true"
              >
                <Sparkles size={13} />
                <span>{trNav('predictions', lang)}</span>
                <ChevronDown size={13} className="oj-chevron" />
              </button>
              {openDropdown === 'predictions-menu' && (
                <div
                  className="oj-dropdown-menu"
                  role="menu"
                  onMouseEnter={handleMenuMouseEnter}
                  onMouseLeave={handleMenuMouseLeave}
                  style={getDropdownMenuInlineStyle()}
                >
                  <button type="button" onClick={() => handleLinkClick('predictions', 'deep_life')}>
                    <strong>{trD('pred_general', 'सामान्य फलादेश', 'General Prediction')}</strong>
                    <span className="oj-dd-sub">{trD('pred_general_sub', 'जीवन स्तर, स्वर्ण कालखंड, संकट काल व 6 जीवन क्षेत्र', 'Life Stature, Peak Era & 6 Life Domains')}</span>
                  </button>
                  <button type="button" onClick={() => handleLinkClick('predictions', 'houseWise')}>
                    <strong>{trD('pred_house', 'भाववार फलादेश', 'House-wise Prediction')}</strong>
                    <span className="oj-dd-sub">{trD('pred_house_sub', '1 से 12 भावों के प्रश्न-उत्तर, घटना समय व भावेष फल', '1st to 12th House Specific Events & Timing')}</span>
                  </button>
                  <button type="button" onClick={() => handleLinkClick('predictions', 'twelve_planets')}>
                    <strong>{trD('pred_planets', '12 ग्रह फलादेश', '12 Planets in Houses')}</strong>
                    <span className="oj-dd-sub">{trD('pred_planets_sub', 'सूर्य से केतु तक 12 ग्रहों का भाव फल, दृष्टि व प्रभाव', 'Planetary House Placements, Aspects & Prophecies')}</span>
                  </button>
                  <button type="button" onClick={() => handleLinkClick('predictions', 'dashaWise')}>
                    <strong>{trD('pred_dasha', 'दशा फलादेश', 'Dasha Prediction')}</strong>
                    <span className="oj-dd-sub">{trD('pred_dasha_sub', 'सक्रिय विंशोत्तरी महादशा-अंतर्दशा व 3 ठोस जीवन घटनाएं', 'Running Mahadasha/Antardasha Manifestation')}</span>
                  </button>
                  <button type="button" onClick={() => handleLinkClick('predictions', 'gocharWise')}>
                    <strong>{trD('pred_transit', 'गोचर फलादेश', 'Transit Prediction')}</strong>
                    <span className="oj-dd-sub">{trD('pred_transit_sub', '12-24 माह का गोचर रोडमैप, गुरु-शनि दोहरा गोचर फल', '12-24 Month Transit Roadmap & Double Transit')}</span>
                  </button>
                  <button type="button" onClick={() => handleLinkClick('predictions', 'educationWise')}>
                    <strong>{trD('pred_edu', 'शिक्षा व उच्च विद्या फलादेश', 'Education & Higher Studies')}</strong>
                    <span className="oj-dd-sub">{trD('pred_edu_sub', '१० भंग नियम, सर्वभौम व सरस्वती योग, शोध Ph.D. व संकाय', '10 Break Rules, Sarvabhouma, Ph.D. Research & College Streams')}</span>
                  </button>
                  <button type="button" onClick={() => handleLinkClick('predictions', 'ascendantWise')}>
                    <strong>{trD('pred_asc', 'लग्नवार फलादेश', 'Ascendant-wise Prediction')}</strong>
                    <span className="oj-dd-sub">{trD('pred_asc_sub', '१२ लग्न: स्वरूप, कारक-मारक, धन, दांपत्य, करियर व भाग्योदय वर्ष', '12 Ascendants: Temperament, Benefics, Marakas, Marriage & Milestones')}</span>
                  </button>
                  <button type="button" onClick={() => handleLinkClick('predictions', 'planetInNakshatra')}>
                    <strong>{trD('pred_nakshatra', 'नक्षत्रवार फलादेश', 'Nakshatra-wise Prediction')}</strong>
                    <span className="oj-dd-sub">{trD('pred_nakshatra_sub', '27 नक्षत्र, 4 चरण, तारा चक्र व अनुकूल कार्यक्षेत्र', '27 Nakshatras, 4 Padas, Tara & Career Nuance')}</span>
                  </button>
                  <button type="button" onClick={() => handleLinkClick('predictions', 'planetInSign')}>
                    <strong>{trD('pred_sign', 'राशिवार फलादेश', 'Sign-wise Prediction')}</strong>
                    <span className="oj-dd-sub">{trD('pred_sign_sub', '12 राशियों में ग्रहों की शास्त्रीय स्थिति व स्वभाव', 'Planets in 12 Signs Classical Findings')}</span>
                  </button>
                  <button type="button" onClick={() => handleLinkClick('predictions', 'yutiWise')}>
                    <strong>{trD('pred_yuti', 'युति फलादेश', 'Yuti (Conjunction) Prediction')}</strong>
                    <span className="oj-dd-sub">{trD('pred_yuti_sub', 'कुंडली के ग्रह युति योग, युति अंश व अनुकूल-प्रतिकूल फल', 'Planetary Conjunctions, Degrees & Exact Effects')}</span>
                  </button>
                  <button type="button" onClick={() => handleLinkClick('predictions', 'drishtiWise')}>
                    <strong>{trD('pred_drishti', 'दृष्टि फलादेश', 'Drishti (Aspect) Prediction')}</strong>
                    <span className="oj-dd-sub">{trD('pred_drishti_sub', 'समसप्तक व विशेष दृष्टियां, दृष्टि वीरुपा व घटना प्रभाव', 'Full & Special Aspects, Virupas & Event Impacts')}</span>
                  </button>
                  <button type="button" onClick={() => handleLinkClick('predictions', 'yogaWise')}>
                    <strong>{trD('pred_yoga', 'योगवार फलादेश', 'Yoga-wise Prediction')}</strong>
                    <span className="oj-dd-sub">{trD('pred_yoga_sub', 'पंचमहापुरुष, राजयोग, धनयोग, विपरीत व अरिष्ट योग', 'Raja, Dhana, Mahapurusha & Classical Yogas')}</span>
                  </button>
                  <button type="button" onClick={() => handleLinkClick('rashifal')}>
                    <strong>{trD('pred_rashifal', 'दैनिक व साप्ताहिक राशिफल (वैदिक गोचर व लाइव फीड्स)', 'Daily & Weekly Rashifal (Vedic Gochar & Live Feeds)')}</strong>
                    <span className="oj-dd-sub">{trD('pred_rashifal_sub', '५ प्रमुख जीवन क्षेत्र, १२ राशियां व लाइव गोचर वेब फीड्स', '5 Life Domains, 12 Signs & Live Gochar Feeds')}</span>
                  </button>
                </div>
              )}
            </li>

            {/* 4. Kundali Milan & Vivaha — Dedicated Top-Level Menu */}
            <li
              className="oj-nav-item oj-dropdown-parent"
              onMouseEnter={(e) => handleMouseEnter('milan-menu', e)}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                className={`oj-nav-link-btn oj-nav-dropdown-btn ${openDropdown === 'milan-menu' ? 'is-open' : ''} ${isMatchingActive ? 'is-current' : ''}`}
                onClick={(e) => toggleDropdown('milan-menu', e)}
                aria-expanded={openDropdown === 'milan-menu'}
                aria-haspopup="true"
              >
                <Heart size={13} />
                <span>{trNav('matching', lang)}</span>
                <ChevronDown size={13} className="oj-chevron" />
              </button>
              {openDropdown === 'milan-menu' && (
                <div
                  className="oj-dropdown-menu"
                  role="menu"
                  onMouseEnter={handleMenuMouseEnter}
                  onMouseLeave={handleMenuMouseLeave}
                  style={getDropdownMenuInlineStyle()}
                >
                  <button type="button" onClick={() => handleLinkClick('marriage-matching', 'ashtakoota')}>
                    <strong>{trD('match_ashtakoota', 'अष्टकूट ३६ गुण मिलान', 'Ashtakoota 36 Gunas')}</strong>
                    <span className="oj-dd-sub">{trD('match_ashtakoota_sub', 'वर्ण, वश्य, तारा, योनि, ग्रहमैत्री, गण, भकूट, नाड़ी', 'Complete 36-Point Vedic Guna Milan')}</span>
                  </button>
                  <button type="button" onClick={() => handleLinkClick('marriage-matching', 'dashakoota')}>
                    <strong>{trD('match_dashakoota', 'दक्षिण भारतीय दशकूट (१० कूट)', 'Dashakoota (10 Poruthams)')}</strong>
                    <span className="oj-dd-sub">{trD('match_dashakoota_sub', 'दीना, गणा, माहेन्द्रा, रज्जु व वेध सुरक्षा कूट', 'Dina, Gana, Mahendra, Rajju & Vedha Shield')}</span>
                  </button>
                  <button type="button" onClick={() => handleLinkClick('marriage-matching', 'dosha-parihara')}>
                    <strong>{trD('match_dosha', 'दोष विश्लेषण एवं १६ मांगलिक परिहार', '16 Manglik Bhanga & Pariharas')}</strong>
                    <span className="oj-dd-sub">{trD('match_dosha_sub', '१६ मांगलिक नियम, भकूट परिहार व नाड़ी दोष निवारण', 'Classical Exceptions, Bhakoot & Nadi Pariharas')}</span>
                  </button>
                  <button type="button" onClick={() => handleLinkClick('marriage-matching', 'tribala-pooja')}>
                    <strong>{trD('match_tribala', 'त्रिबल शुद्धि, लाल पूजा व पीली पूजा', 'Tribala Shuddhi & Puja Protocols')}</strong>
                    <span className="oj-dd-sub">{trD('match_tribala_sub', 'वर सूर्य बल, कन्या गुरु बल, चंद्र बल व संपूर्ण पूजा विधान', 'Groom Sun, Bride Jupiter, Moon & Remedial Pujas')}</span>
                  </button>
                  <button type="button" onClick={() => handleLinkClick('marriage-matching', 'muhurta')}>
                    <strong>{trD('match_muhurta', 'शास्त्रसम्मत विवाह, सगाई व तिलक मुहूर्त', 'Authentic Vivah, Sagai & Tilak Muhurta')}</strong>
                    <span className="oj-dd-sub">{trD('match_muhurta_sub', 'खरमास-चातुर्मास मुक्त, गोचर व दशा समर्थित शुद्ध मुहूर्त', 'Pure ephemeris calendar free from prohibited windows')}</span>
                  </button>
                  <button type="button" onClick={() => handleLinkClick('marriage-matching', 'synastry-d9')}>
                    <strong>{trD('match_synastry', 'द्वादश भाव, D9 नवांश व संतान स्फुट', 'Synastry, D9 Navamsha & Progeny')}</strong>
                    <span className="oj-dd-sub">{trD('match_synastry_sub', 'बीज स्फुट, क्षेत्र स्फुट व पारस्परिक भाव सादृश्य', 'Beeja & Kshetra Sphuta, Navamsha Overlay')}</span>
                  </button>
                  <button type="button" onClick={() => handleLinkClick('fortune-calculators')}>
                    <strong>{trD('match_calculators', 'दांपत्य, अंकज्योतिष व आयुर्दाय कैलकुलेटर (15 Tools)', 'Relationship, Numerology & Longevity Calculators (15 Tools)')}</strong>
                    <span className="oj-dd-sub">{trD('match_calculators_sub', 'प्रेम vs पारंपरिक, समय, नामाक्षर, अंक अनुकूलता, आयुर्दाय वर्ग', 'Love vs Arranged, Timing, Partner Initial, Numerology & Ayurdaya')}</span>
                  </button>
                </div>
              )}
            </li>

            {/* 4. Sade Sati & Dual Transit Wheel */}
            <li
              className="oj-nav-item oj-dropdown-parent"
              onMouseEnter={(e) => handleMouseEnter('transits-menu', e)}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                className={`oj-nav-link-btn oj-nav-dropdown-btn ${openDropdown === 'transits-menu' ? 'is-open' : ''} ${isTransitsActive ? 'is-current' : ''}`}
                onClick={(e) => toggleDropdown('transits-menu', e)}
                aria-expanded={openDropdown === 'transits-menu'}
                aria-haspopup="true"
              >
                <Clock size={13} />
                <span>{trNav('transits', lang)}</span>
                <ChevronDown size={13} className="oj-chevron" />
              </button>

              {openDropdown === 'transits-menu' && (
                <div
                  className="oj-dropdown-menu"
                  role="menu"
                  onMouseEnter={handleMenuMouseEnter}
                  onMouseLeave={handleMenuMouseLeave}
                  style={getDropdownMenuInlineStyle()}
                >
                  <button type="button" onClick={() => handleLinkClick('dual-transit')}>
                    <strong>{trD('trans_dual', 'द्वि-चक्र गोचर सिम्युलेटर (Double Wheel)', 'Live Double Transit Wheel')}</strong>
                    <span className="oj-dd-sub">{trD('trans_dual_sub', 'जन्म कुंडली + लाइव गोचर दृष्टि किरणें', 'Natal + Transit Aspect Rays')}</span>
                  </button>
                  <button type="button" onClick={() => handleLinkClick('sade-sati')}>
                    <strong>{trD('trans_sade', 'शनि साढ़े साती एवं ढैया टाइमलाइन', 'Sade Sati & Dhaiya Timeline')}</strong>
                    <span className="oj-dd-sub">{trD('trans_sade_sub', '3 चरण, कंटक, अष्टम शनि व मूर्ति निर्णय', '3 Charans & Moorti Nirnaya')}</span>
                  </button>
                  <button type="button" onClick={() => handleLinkClick('transit-calendar')}>
                    <strong>{trD('trans_cal', '365-दिवसीय व्यक्तिगत गोचर कैलेंडर', 'Personal 365-Day Transit Calendar')}</strong>
                    <span className="oj-dd-sub">{trD('trans_cal_sub', 'दैनिक शुभता स्कोर (0-100), तारा बल व हीटमैप', 'Daily 0-100 Score & Monthly Heatmap')}</span>
                  </button>
                </div>
              )}
            </li>

            {/* 5. Advanced Astrology Dropdown */}
            <li
              className="oj-nav-item oj-dropdown-parent"
              onMouseEnter={(e) => handleMouseEnter('advanced-astro', e)}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                className={`oj-nav-link-btn oj-nav-dropdown-btn ${openDropdown === 'advanced-astro' ? 'is-open' : ''} ${isAdvancedActive ? 'is-current' : ''}`}
                onClick={(e) => toggleDropdown('advanced-astro', e)}
                aria-expanded={openDropdown === 'advanced-astro'}
                aria-haspopup="true"
              >
                <Layers size={13} />
                <span>{trNav('advanced', lang)}</span>
                <ChevronDown size={13} className="oj-chevron" />
              </button>

              {openDropdown === 'advanced-astro' && (
                <div
                  className="oj-dropdown-menu"
                  role="menu"
                  onMouseEnter={handleMenuMouseEnter}
                  onMouseLeave={handleMenuMouseLeave}
                  style={getDropdownMenuInlineStyle()}
                >
                  <button type="button" onClick={() => handleLinkClick('prasna-marga')}>
                    <strong>{isHi ? 'प्रश्न मार्ग (Prasna Marga)' : 'Prasna Marga (Horary)'}</strong>
                    <span className="oj-dd-sub">{isHi ? 'आरूढ़ लग्न, त्रिसफुट, अष्टमंगल प्रश्न व तात्कालिक फल' : 'Arudha, Trisphuta, Ashtamangala & Horary'}</span>
                  </button>
                  <button type="button" onClick={() => handleLinkClick('medical-astrology')}>
                    <strong>{isHi ? 'चिकित्सा फलित (Medical Astrology)' : 'Medical Astrology & Tridosha'}</strong>
                    <span className="oj-dd-sub">{isHi ? 'रोग परीक्षा, वात-पित्त-कफ त्रिदोष व बाधक स्थान' : 'Tridosha Roga Prasna & Organ Vulnerability'}</span>
                  </button>
                  <button type="button" onClick={() => handleLinkClick('beeja-kshetra')}>
                    <strong>{isHi ? 'बीज एवं क्षेत्र स्फुट (Beeja & Kshetra Sphuta)' : 'Beeja & Kshetra Sphutas'}</strong>
                    <span className="oj-dd-sub">{isHi ? 'संतान सुख, पुरुष बीज स्फुट व स्त्री क्षेत्र स्फुट' : 'Fertility Sphutas & Progeny Windows'}</span>
                  </button>
                  <button type="button" onClick={() => handleLinkClick('numerology')}>
                    <strong>{isHi ? 'वैदिक व चालडियन अंकज्योतिष (Numerology)' : 'Vedic & Chaldean Numerology'}</strong>
                    <span className="oj-dd-sub">{isHi ? 'मूलांक, भाग्यांक, नामांक, ३x३ लो-शू ग्रिड व कुआ अंक' : 'Mulank, Bhagyank, Lo Shu Grid, Kua & Name Number'}</span>
                  </button>
                  <button type="button" onClick={() => handleLinkClick('multi-dasha')}>
                    <strong>{isHi ? 'त्रिवेणी दशा संगम (Multi-Dasha Matrix)' : 'Multi-Dasha Matrix (4 Dashas)'}</strong>
                    <span className="oj-dd-sub">{isHi ? 'विंशोत्तरी + योगिनी + चर + अष्टोत्तरी एक साथ' : 'Vimshottari, Yogini, Chara & Ashtottari'}</span>
                  </button>
                  <button type="button" onClick={() => handleLinkClick('dasha-matrix-81')}>
                    <strong>{isHi ? '८१ महादशा-अंतर्दशा फलकथन' : '81 Dasha Combinations Matrix'}</strong>
                    <span className="oj-dd-sub">{isHi ? 'षडाष्टक (६/८), द्वि-द्वादश व नवपंचम संबंध' : 'Mutual Angular Axes & Specific Predictions'}</span>
                  </button>
                  <button type="button" onClick={() => handleLinkClick('sudarshana')}>
                    <strong>{isHi ? 'सुदर्शन चक्र 3-इन-1 (Sudarshana Chakra)' : 'Sudarshana Chakra (3-in-1)'}</strong>
                    <span className="oj-dd-sub">{isHi ? 'लग्न + चंद्र + सूर्य 3-वलय व 100 वर्षीय आयु स्लाइडर' : 'Lagna + Moon + Sun Concentric Rings'}</span>
                  </button>
                  <button type="button" onClick={() => handleLinkClick('sarvatobhadra')}>
                    <strong>{isHi ? 'सर्वतोभद्र चक्र एवं वेध (9x9)' : 'Sarvatobhadra Chakra (9x9)'}</strong>
                    <span className="oj-dd-sub">{isHi ? '28 नक्षत्र, स्वर, व्यंजन व त्रि-दिशीय वेध' : '28 Nakshatras & Tri-Directional Vedha'}</span>
                  </button>
                  <button type="button" onClick={() => handleLinkClick('kota-ayurdaya')}>
                    <strong>{isHi ? 'कोटा चक्र, आयुर्दाय व उपग्रह' : 'Kota Chakra, Longevity & Upagrahas'}</strong>
                    <span className="oj-dd-sub">{isHi ? 'दुर्ग वेध, जैमिनी आयु एवं गुलिक-मांदि' : 'Fort Defense, Jaimini Longevity & Gulika'}</span>
                  </button>
                  <button type="button" onClick={() => handleLinkClick('kp-enterprise')}>
                    <strong>{isHi ? 'केपी सिस्टम (4-Fold & CSL)' : 'KP System (4-Fold & CSL)'}</strong>
                    <span className="oj-dd-sub">{isHi ? 'कस्पल सब-लॉर्ड एवं रूलिंग प्लैनेट्स' : 'Cuspal Sub-Lords & Ruling Planets'}</span>
                  </button>
                  <button type="button" onClick={() => handleLinkClick('jaimini')}>
                    <strong>{isHi ? 'जैमिनी सूत्र (Jaimini Sutra)' : 'Jaimini Sutra Suite'}</strong>
                    <span className="oj-dd-sub">{isHi ? 'चर कारक, आरूढ़ पद एवं चर दशा' : 'Chara Karakas, Arudhas & Chara Dasha'}</span>
                  </button>
                  <button type="button" onClick={() => handleLinkClick('lal-kitab')}>
                    <strong>{isHi ? 'लाल किताब एवं 100-वर्षीय वर्षफल' : 'Lal Kitab & Annual Varshphal'}</strong>
                    <span className="oj-dd-sub">{isHi ? 'सोए हुए ग्रह, 9 ऋण एवं वार्षिक टोटके' : 'Sleeping Planets, 9 Debts & Age Slider'}</span>
                  </button>
                  <button type="button" onClick={() => handleLinkClick('varshaphala')}>
                    <strong>{isHi ? 'ताजिक वर्षफल (Annual Solar Return)' : 'Tajika Varshaphala'}</strong>
                    <span className="oj-dd-sub">{isHi ? 'मुन्था, वर्षेश, 16 योग एवं सहम' : 'Muntha, Varsheshwar & 50 Sahams'}</span>
                  </button>
                  <button type="button" onClick={() => handleLinkClick('nadi')}>
                    <strong>{isHi ? 'नाड़ी ज्योतिष (Agastya Kandams)' : 'Nadi Palm Leaf Shastra'}</strong>
                    <span className="oj-dd-sub">{isHi ? '14 कण्डम, नंदी त्रिकोण एवं शिव संवाद' : '14 Kandams & Nandi Trine Links'}</span>
                  </button>
                  <button type="button" onClick={() => handleLinkClick('ashtakavarga')}>
                    <strong>{isHi ? 'अष्टकवर्ग व षड्बल (SAV 337)' : 'Ashtakavarga & Shadbala'}</strong>
                    <span className="oj-dd-sub">{isHi ? 'ग्रह बिंदु, कक्षा गोचर एवं ६-प्रकार के बल' : 'Planetary Bindus, Kakshya & 6-fold Balas'}</span>
                  </button>
                  <button type="button" onClick={() => handleLinkClick('western-astrology')}>
                    <strong>{isHi ? 'पाश्चात्य 360° राशि चक्र' : 'Western Tropical Wheel'}</strong>
                    <span className="oj-dd-sub">{isHi ? '360° सर्कुलर व्हील, दृष्टि व तत्व' : '360° Circular Wheel & Aspects'}</span>
                  </button>
                  <button type="button" onClick={() => handleLinkClick('human-design')}>
                    <strong>{isHi ? 'ह्यूमन डिज़ाइन व ९ चक्र' : 'Human Design & 9 Centers'}</strong>
                    <span className="oj-dd-sub">{isHi ? '६४ आई-चिंग द्वार, आंतरिक सत्ता व बॉडीग्राफ़' : '64 I-Ching Gates & BodyGraph'}</span>
                  </button>
                  <button type="button" onClick={() => handleLinkClick('astrocartography')}>
                    <strong>{isHi ? 'एस्ट्रोकार्टोग्राफी (विश्व मानचित्र)' : 'Astrocartography (World Lines)'}</strong>
                    <span className="oj-dd-sub">{isHi ? '१२०+ वैश्विक महानगर, MC/IC/AC रेखाएं' : '120+ Global Cities & Power Lines'}</span>
                  </button>
                  <button type="button" onClick={() => handleLinkClick('parashara-workstation')}>
                    <strong>{isHi ? 'उन्नत फलित एवं शोध कार्यशाला' : 'Advanced Predictive & Research Workstation'}</strong>
                    <span className="oj-dd-sub">{isHi ? 'कक्ष्य गोचर, 50 सहम, CIL 1-2193, भावबल एवं शोध पत्रिकाएं' : 'Kakshya Transit, 50 Sahams, CIL 1-2193, Bhavabala & Research Charts'}</span>
                  </button>
                </div>
              )}
            </li>

            {/* 6. Consultation Tools Dropdown */}
            <li
              className="oj-nav-item oj-dropdown-parent"
              onMouseEnter={(e) => handleMouseEnter('more-tools', e)}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                className={`oj-nav-link-btn oj-nav-dropdown-btn ${openDropdown === 'more-tools' ? 'is-open' : ''} ${isToolsActive ? 'is-current' : ''}`}
                onClick={(e) => toggleDropdown('more-tools', e)}
                aria-expanded={openDropdown === 'more-tools'}
                aria-haspopup="true"
              >
                <Sparkles size={13} />
                <span>{trNav('tools', lang)}</span>
                <ChevronDown size={13} className="oj-chevron" />
              </button>

              {openDropdown === 'more-tools' && (
                <div
                  className="oj-dropdown-menu"
                  role="menu"
                  onMouseEnter={handleMenuMouseEnter}
                  onMouseLeave={handleMenuMouseLeave}
                  style={getDropdownMenuInlineStyle()}
                >
                  <button type="button" onClick={() => handleLinkClick('fortune-calculators')}>
                    <strong>{isHi ? 'दांपत्य, अंकज्योतिष व आयुर्दाय कैलकुलेटर' : 'Relationship, Numerology & Longevity Calculators'}</strong>
                    <span className="oj-dd-sub">{isHi ? 'प्रेम vs पारंपरिक विवाह, समय, नामाक्षर, अंक अनुकूलता, आयुर्दाय' : 'Love vs Arranged, Timing, Partner Initial, Numerology & Ayurdaya'}</span>
                  </button>
                  <button type="button" onClick={() => handleLinkClick('interactive-palmistry')}>
                    <strong>{isHi ? 'इंटरैक्टिव हस्तरेखा प्रश्नावली' : 'Interactive Palmistry Q&A'}</strong>
                    <span className="oj-dd-sub">{isHi ? 'पूछ-पूछ कर हस्तरेखा फलकथन एवं 4 जीवन पड़ाव' : 'Visual Q&A-driven palmistry reading'}</span>
                  </button>
                  <button type="button" onClick={() => handleLinkClick('samudrika-shastra')}>
                    <strong>{isHi ? 'सामुद्रिक शास्त्र एवं हस्त लक्षण' : 'Samudrika Shastra & Signs'}</strong>
                    <span className="oj-dd-sub">{isHi ? 'हस्त रेखाएं, पर्वत व मत्स्य-त्रिशूल चिन्ह' : 'Palm Lines, Mounts & Sacred Marks'}</span>
                  </button>
                  <button type="button" onClick={() => handleLinkClick('life-event-timing')}>
                    <strong>{isHi ? 'सटीक घटना-काल (Life Event Timing)' : 'Life Event Timing Engine'}</strong>
                    <span className="oj-dd-sub">{isHi ? 'विवाह, संतान, पदोन्नति, विदेश कब?' : 'Exact Marriage, Career & Progeny Windows'}</span>
                  </button>
                  <button type="button" onClick={() => handleLinkClick('classical-doshas')}>
                    <strong>{isHi ? '१८ शास्त्रीय दोष व भंग निर्णय' : '18 Classical Doshas & Cancellations'}</strong>
                    <span className="oj-dd-sub">{isHi ? 'कालसर्प, मांगलिक भंग (१६ नियम), पितृ दोष' : 'Kaal Sarp, Kuja Dosha Bhanga, Pitru Dosha'}</span>
                  </button>
                  <button type="button" onClick={() => handleLinkClick('muhurta')}>
                    <strong>{isHi ? 'शुभ मुहूर्त फाइंडर (90 Days)' : 'Auspicious Muhurta Finder'}</strong>
                    <span className="oj-dd-sub">{isHi ? 'विवाह, गृह प्रवेश, वाहन, व्यापार मुहूर्त' : 'Marriage, House, Vehicle & Business'}</span>
                  </button>
                  <button type="button" onClick={() => handleLinkClick('prashna')}>
                    <strong>{isHi ? 'केपी प्रश्न कुण्डली (1–249)' : 'KP Prashna Horary (1–249)'}</strong>
                    <span className="oj-dd-sub">{isHi ? 'तात्कालिक प्रश्न: हाँ/ना/सशर्त उत्तर' : 'Instant Yes/No/Conditional Outcome'}</span>
                  </button>
                  <button type="button" onClick={() => handleLinkClick('btr')}>
                    <strong>{isHi ? 'जन्म समय संशोधन (BTR)' : 'Birth Time Rectification (BTR)'}</strong>
                    <span className="oj-dd-sub">{isHi ? 'जीवन घटनाओं से समय सुधार' : 'Event Timeline Calibration'}</span>
                  </button>
                  <button type="button" onClick={() => handleLinkClick('financial-astrology')}>
                    <strong>{isHi ? 'वित्तीय व शेयर बाजार ज्योतिष' : 'Financial & Stock Market Astrology'}</strong>
                    <span className="oj-dd-sub">{isHi ? 'इंदु लग्न, कुबेर संपदा व उद्योग क्षेत्र' : 'Indu Lagna, Dhana Yogas & Business'}</span>
                  </button>
                  <button type="button" onClick={() => handleLinkClick('celebrity-twins')}>
                    <strong>{isHi ? 'सेलिब्रिटी कुंडली ट्विन' : 'Celebrity Twin Matcher'}</strong>
                    <span className="oj-dd-sub">{isHi ? 'ऐतिहासिक युगद्रष्टाओं से कुंडली सादृश्य' : 'Match with Historical Luminaries'}</span>
                  </button>
                  <button type="button" onClick={() => handleLinkClick('split-studio')}>
                    <strong>{isHi ? '4-स्क्रीन ज्योतिषी वर्कस्टेशन' : '4-Screen Split Workstation'}</strong>
                    <span className="oj-dd-sub">{isHi ? 'D1 + D9 + दशा + गोचर एक ही स्क्रीन पर' : 'D1 + D9 + Dashas + Live Transits'}</span>
                  </button>
                  <button type="button" onClick={() => handleLinkClick('client-diary')}>
                    <strong>{isHi ? 'ज्योतिषी परामर्श डायरी (Client Case Notes)' : 'Client Consultation Diary'}</strong>
                    <span className="oj-dd-sub">{isHi ? 'जातक प्रश्न, समयसीमा, उपाय पर्ची व फॉलो-अप' : 'Case History, Predictions & Printable Slips'}</span>
                  </button>
                </div>
              )}
            </li>

            {/* 7. Vedic Remedies & Gemstones Dropdown */}
            <li
              className="oj-nav-item oj-dropdown-parent"
              onMouseEnter={(e) => handleMouseEnter('remedies-menu', e)}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                className={`oj-nav-link-btn oj-nav-dropdown-btn ${openDropdown === 'remedies-menu' ? 'is-open' : ''} ${isRemediesActive ? 'is-current' : ''}`}
                onClick={(e) => toggleDropdown('remedies-menu', e)}
                aria-expanded={openDropdown === 'remedies-menu'}
                aria-haspopup="true"
              >
                <Heart size={13} />
                <span>{trNav('remedies', lang)}</span>
                <ChevronDown size={13} className="oj-chevron" />
              </button>

              {openDropdown === 'remedies-menu' && (
                <div
                  className="oj-dropdown-menu"
                  role="menu"
                  onMouseEnter={handleMenuMouseEnter}
                  onMouseLeave={handleMenuMouseLeave}
                  style={getDropdownMenuInlineStyle()}
                >
                  <button type="button" onClick={() => handleLinkClick('holistic-remedies')}>
                    <strong>{isHi ? 'समग्र वैदिक उपचार एवं टोटके' : 'Holistic Remedies & Totke'}</strong>
                    <span className="oj-dd-sub">{isHi ? 'जड़ी-बूटी, रंग चिकित्सा, योग, यंत्र व स्तोत्र' : 'Herbal Roots, Colors, Yantras & Stotras'}</span>
                  </button>
                  <button type="button" onClick={() => handleLinkClick('gemstones')}>
                    <strong>{isHi ? 'वैदिक रत्न एवं रुद्राक्ष' : 'Gemstones & Rudraksha'}</strong>
                    <span className="oj-dd-sub">{isHi ? 'प्राण रत्न, भाग्य रत्न, कारक व इष्ट रत्न' : 'Life & Lucky Stones Prescription'}</span>
                  </button>
                </div>
              )}
            </li>

            {/* 8. Puja & Festivals — Highlighted High-Visibility Dropdown */}
            <li
              className="oj-nav-item oj-dropdown-parent"
              onMouseEnter={(e) => handleMouseEnter('festivals', e)}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                className={`oj-nav-link-btn oj-nav-dropdown-btn ${openDropdown === 'festivals' ? 'is-open' : ''} ${isFestivalsActive ? 'is-current' : ''}`}
                onClick={(e) => toggleDropdown('festivals', e)}
                aria-expanded={openDropdown === 'festivals'}
                aria-haspopup="true"
              >
                <Calendar size={13} />
                <span>{trNav('festivals', lang)}</span>
                <ChevronDown size={13} className="oj-chevron" />
              </button>

              {openDropdown === 'festivals' && (
                <div
                  className="oj-dropdown-menu align-right"
                  role="menu"
                  onMouseEnter={handleMenuMouseEnter}
                  onMouseLeave={handleMenuMouseLeave}
                  style={getDropdownMenuInlineStyle()}
                >
                  <button type="button" onClick={() => handleLinkClick('festivals')}>
                    <strong>{isHi ? 'हिंदू पर्व एवं व्रत कैलेंडर' : 'Hindu Festival Calendar'}</strong>
                    <span className="oj-dd-sub">{isHi ? '2026-2027 के समस्त पर्व' : '2026-2027 All Festivals'}</span>
                  </button>
                  <button type="button" onClick={() => handleLinkClick('daily-panchanga')}>
                    <strong>{isHi ? 'दैनिक पंचांग एवं होरा' : "Today's Panchang & Hora"}</strong>
                    <span className="oj-dd-sub">{isHi ? 'सूर्योदय, राहु काल, 24 घंटे की होरा' : 'Sunrise, Rahu Kalam, 24-hr Hora'}</span>
                  </button>
                  <button type="button" onClick={() => handleLinkClick('festivals')}>
                    <strong>{isHi ? 'एकादशी एवं प्रदोष तिथियां' : 'Ekadashi & Pradosham Dates'}</strong>
                    <span className="oj-dd-sub">{isHi ? 'मासिक व्रत एवं पारणा समय' : 'Monthly Fasting Schedules'}</span>
                  </button>
                  <button type="button" onClick={() => handleLinkClick('choghadiya')}>
                    <strong>{isHi ? 'शुभ मुहूर्त चेकर' : 'Auspicious Muhurta Checker'}</strong>
                    <span className="oj-dd-sub">{isHi ? 'अभिजीत, अमृत, ब्रह्म मुहूर्त' : 'Abhijit, Brahma Muhurta'}</span>
                  </button>
                </div>
              )}
            </li>
          </ul>

          {/* Quick PDF Report Action Button */}
          <div className="oj-nav-right-cta">
            <button
              type="button"
              className="oj-nav-link-btn oj-nav-cta-pill"
              onClick={onOpenBooklet}
              title={trNav('birthReport', lang)}
            >
              <FileText size={13} />
              <span>{trNav('birthReport', lang)}</span>
            </button>
          </div>
        </div>
      </div>

      {canScrollRight && (
        <button
          type="button"
          className="oj-nav-scroll-btn right"
          onClick={() => scrollNav('right')}
          aria-label="Scroll menu right"
          title={isHi ? 'दाएं स्क्रॉल करें' : 'Scroll right'}
        >
          <ChevronRight size={16} />
        </button>
      )}
    </div>
  </header>
  );
};
