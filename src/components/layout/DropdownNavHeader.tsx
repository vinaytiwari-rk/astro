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
  FileText,
  Grid,
  Heart,
  Home,
  Layers,
  Menu,
  Moon,
  Plus,
  Settings,
  Sparkles,
  Star,
  Sun,
  User,
} from 'lucide-react';
import { formatDateDmy } from '../../astro/time';
import type { BirthInput, CalcSettings, ChartStyle } from '../../astro/types';
import { useLanguage } from '../../i18n/LanguageContext';

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
  onOpenDrawer?: () => void;
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
  onOpenDrawer,
  settings,
  onChangeChartStyle,
  theme,
  onToggleTheme,
}) => {
  const { lang, setLang } = useLanguage();
  const isHi = lang === 'hi';

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
          title={isHi ? 'मुख्य पृष्ठ पर जाएं' : 'Go to Home'}
          style={{ cursor: 'pointer' }}
        >
          <span className="dropdown-brand-om" aria-hidden="true">
            ॐ
          </span>
          <div className="dropdown-brand-text">
            <span className="dropdown-brand-name">AV Astro Vibe</span>
            <span className="dropdown-brand-tag">
              {isHi ? 'वैदिक ज्योतिष, पंचांग एवं संपूर्ण फलादेश' : 'Vedic Astrology, Panchang & Free Predictions'}
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
                {p.name} ({formatDateDmy(p.date)} · {p.city})
              </option>
            ))}
          </select>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onOpenEditor}
            title={isHi ? 'जन्म विवरण संशोधित करें' : 'Edit Native Details'}
          >
            <Edit3 size={13} />
            <span className="hide-on-mobile">{isHi ? 'संशोधन' : 'Edit'}</span>
          </button>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onNewKundli}
            title={isHi ? 'नई कुंडली' : 'New Horoscope'}
          >
            <Plus size={13} />
            <span className="hide-on-mobile">{isHi ? 'नई' : 'New'}</span>
          </button>
        </div>

        {/* Right Tools: Language, Chart Style, Birth Report, Theme, Settings */}
        <div className="dropdown-utilities-group">
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
            title={isHi ? 'जन्म पत्रिका PDF (100% निःशुल्क)' : 'Birth Report PDF (100% Free)'}
          >
            <FileText size={14} />
            <span className="hide-on-mobile">{isHi ? 'जन्म पत्रिका' : 'Birth Report'}</span>
          </button>

          {/* All Menus Drawer Button (Desktop & Mobile) */}
          {onOpenDrawer && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={onOpenDrawer}
              title={isHi ? 'समस्त 38+ मुख्य विभाग (Master Hub)' : 'All 38+ Modules Hub'}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontWeight: 600 }}
            >
              <Grid size={13} />
              <span className="hide-on-mobile">{isHi ? 'समस्त मेनू' : 'All Menus'}</span>
            </button>
          )}

          {/* Settings */}
          <button
            type="button"
            className="icon-tool-btn"
            onClick={onOpenSettings}
            title={isHi ? 'गणना सेटिंग्स' : 'Settings'}
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
              {/* All Menus Drawer Pill */}
              {onOpenDrawer && (
                <li className="oj-nav-item">
                  <button
                    type="button"
                    className="oj-nav-link-btn"
                    onClick={onOpenDrawer}
                    style={{
                      background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.18) 0%, rgba(180, 83, 9, 0.28) 100%)',
                      borderColor: 'var(--accent)',
                      color: 'var(--accent)',
                      fontWeight: 700,
                    }}
                    title={isHi ? 'समस्त 38+ मुख्य विभाग देखें' : 'View all 38+ sections'}
                  >
                    <Grid size={12} />
                    <span>{isHi ? 'समस्त मेनू' : 'All Menus'}</span>
                  </button>
                </li>
              )}
            {/* 1. Home — Direct Link (No Dropdown) */}
            <li className="oj-nav-item">
              <button
                type="button"
                className={`oj-nav-link-btn ${currentView === 'home' ? 'is-current' : ''}`}
                onClick={() => handleLinkClick('home')}
              >
                <Home size={13} />
                <span>{isHi ? 'होम' : 'Home'}</span>
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
                <span>{isHi ? 'जन्म कुंडली' : 'Janam Kundli'}</span>
              </button>
            </li>

            {/* Simple prediction menu: two clear entry points */}
            <li className="oj-nav-item">
              <button
                type="button"
                className={`oj-nav-link-btn ${currentView === 'general-prediction' ? 'is-current' : ''}`}
                onClick={() => handleLinkClick('general-prediction')}
              >
                <Sparkles size={13} />
                <span>{isHi ? 'सामान्य फलादेश' : 'General Prediction'}</span>
              </button>
            </li>
            <li className="oj-nav-item">
              <button
                type="button"
                className={`oj-nav-link-btn ${currentView === 'planet-wise-prediction' ? 'is-current' : ''}`}
                onClick={() => handleLinkClick('planet-wise-prediction')}
              >
                <Star size={13} />
                <span>{isHi ? 'ग्रह-वार फलादेश' : 'Planets-wise Prediction'}</span>
              </button>
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
                <span>{isHi ? 'गोचर व साढ़े साती' : 'Gochar & Sade Sati'}</span>
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
                    <strong>{isHi ? 'द्वि-चक्र गोचर सिम्युलेटर (Double Wheel)' : 'Live Double Transit Wheel'}</strong>
                    <span className="oj-dd-sub">{isHi ? 'जन्म कुंडली + लाइव गोचर दृष्टि किरणें' : 'Natal + Transit Aspect Rays'}</span>
                  </button>
                  <button type="button" onClick={() => handleLinkClick('sade-sati')}>
                    <strong>{isHi ? 'शनि साढ़े साती एवं ढैया टाइमलाइन' : 'Sade Sati & Dhaiya Timeline'}</strong>
                    <span className="oj-dd-sub">{isHi ? '3 चरण, कंटक, अष्टम शनि व मूर्ति निर्णय' : '3 Charans & Moorti Nirnaya'}</span>
                  </button>
                  <button type="button" onClick={() => handleLinkClick('transit-calendar')}>
                    <strong>{isHi ? '365-दिवसीय व्यक्तिगत गोचर कैलेंडर' : 'Personal 365-Day Transit Calendar'}</strong>
                    <span className="oj-dd-sub">{isHi ? 'दैनिक शुभता स्कोर (0-100), तारा बल व हीटमैप' : 'Daily 0-100 Score & Monthly Heatmap'}</span>
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
                <span>{isHi ? 'विशिष्ट ज्योतिष' : 'Advanced Astrology'}</span>
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
                <span>{isHi ? 'टूल्स व मुहूर्त' : 'Tools & Muhurta'}</span>
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
                    <strong>{isHi ? 'भाग्य एवं कार्मिक कैलकुलेटर' : 'Fortune & Karmic Calculators'}</strong>
                    <span className="oj-dd-sub">{isHi ? 'प्रेम, मित्रता, पूर्व जन्म कर्म व अगला जन्म' : 'Love, Friendship, Past Life & Future Rebirth'}</span>
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
                  <button type="button" onClick={() => handleLinkClick('synastry')}>
                    <strong>{isHi ? 'कुण्डली मिलान व सिनैस्ट्री' : 'Matching & Synastry'}</strong>
                    <span className="oj-dd-sub">{isHi ? '36 गुण मिलान, दोष भंग एवं सिनैस्ट्री' : 'Ashtakoota & Cross-Chart Overlays'}</span>
                  </button>
                  <button type="button" onClick={() => handleLinkClick('btr')}>
                    <strong>{isHi ? 'जन्म समय संशोधन (BTR)' : 'Birth Time Rectification (BTR)'}</strong>
                    <span className="oj-dd-sub">{isHi ? 'जीवन घटनाओं से समय सुधार' : 'Event Timeline Calibration'}</span>
                  </button>
                  <button type="button" onClick={() => handleLinkClick('medical-astrology')}>
                    <strong>{isHi ? 'चिकित्सा ज्योतिष व लाल किताब' : 'Medical Astrology & Lal Kitab'}</strong>
                    <span className="oj-dd-sub">{isHi ? 'त्रिदोष, खरेश 22वां द्रेष्काण व फरमान' : 'Tridosha, Kharesh & Lal Kitab Upaya'}</span>
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
                  <button type="button" onClick={() => handleLinkClick('workstation')}>
                    <strong>{isHi ? '12-भाग विस्तृत वर्कस्टेशन' : '12-Division Workstation'}</strong>
                    <span className="oj-dd-sub">{isHi ? 'उन्नत ज्योतिष अनुसंधान स्टूडियो' : 'Advanced Calculation Studio'}</span>
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
                <span>{isHi ? 'उपचार व रत्न' : 'Remedies & Gems'}</span>
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
                <span>{isHi ? 'पर्व एवं व्रत' : 'Puja & Festivals'}</span>
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
              title={isHi ? 'जन्म पत्रिका PDF (100% निःशुल्क)' : 'Birth Report PDF (100% Free)'}
            >
              <FileText size={13} />
              <span>{isHi ? 'जन्म पत्रिका (निःशुल्क)' : 'Birth Report (Free)'}</span>
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
