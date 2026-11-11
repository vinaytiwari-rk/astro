import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  ChevronDown,
  ChevronRight,
  Clock,
  Compass,
  Download,
  Edit3,
  FileText,
  Flame,
  Grid3x3,
  Heart,
  Home,
  LayoutGrid,
  Menu,
  Moon,
  Plus,
  Printer,
  Sliders,
  Sparkles,
  Star,
  Sun,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { calculateChart } from './astro/calculator';
import { AYANAMSA_META } from './astro/constants';
import { formatDateDmy } from './astro/time';
import type { AyanamsaId, BirthInput, CalcSettings, ChartStyle } from './astro/types';
import { AshtakavargaView } from './components/AshtakavargaView';
import { AstroSageToolsView } from './components/AstroSageToolsView';
import { BasicsView } from './components/BasicsView';
import { BirthEditorModal } from './components/BirthEditorModal';
import { DashaView } from './components/DashaView';
import { HomeDashboardView } from './components/HomeDashboardView';
import { KundaliBookletModal } from './components/KundaliBookletModal';
import { MatchMakingView } from './components/MatchMakingView';
import { PortalHubViews } from './components/PortalHubViews';
import { PortalMegaNav } from './components/PortalMegaNav';
import { PrashnaView } from './components/PrashnaView';
import { PredictionsView } from './components/PredictionsView';
import { SettingsModal } from './components/SettingsModal';
import { SpecializedAstrologyView } from './components/SpecializedAstrologyView';
import { StrengthYogasView } from './components/StrengthYogasView';
import { ToolsSuiteView } from './components/ToolsSuiteView';
import { TransitsView } from './components/TransitsView';
import { VargasView } from './components/VargasView';
import {
  createNowPrashnaInput,
  DEFAULT_SETTINGS,
  SAMPLE_CHARTS,
} from './data/cities';
import { LanguageProvider } from './i18n/LanguageContext';
import { trSign, trTerm, UI_TEXT, type AppLanguage } from './i18n/translations';
import type { MainTab, RouteRequest } from './nav';

const STORAGE_PROFILES_KEY = 'jyotish_hora_profiles_v1';
const STORAGE_ACTIVE_KEY = 'jyotish_hora_active_v1';
const STORAGE_SETTINGS_KEY = 'jyotish_hora_settings_v1';
const STORAGE_THEME_KEY = 'jyotish_hora_theme_v1';
const STORAGE_LANG_KEY = 'jyotish_hora_lang_v1';

function loadStoredProfiles(): BirthInput[] {
  try {
    const raw = localStorage.getItem(STORAGE_PROFILES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignore storage errors
  }
  return SAMPLE_CHARTS;
}

function loadStoredSettings(): CalcSettings {
  try {
    const raw = localStorage.getItem(STORAGE_SETTINGS_KEY);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    // ignore
  }
  return DEFAULT_SETTINGS;
}

interface SidebarSection {
  id: string;
  labelEn: string;
  labelHi: string;
  icon: React.ReactNode;
  children: Array<{
    labelEn: string;
    labelHi: string;
    tab: MainTab;
    subTab?: string;
    nested?: string;
  }>;
}

export function App() {
  const [profiles, setProfiles] = useState<BirthInput[]>(loadStoredProfiles);
  const [activeId, setActiveId] = useState<string>(() => {
    const stored = localStorage.getItem(STORAGE_ACTIVE_KEY);
    const list = loadStoredProfiles();
    if (list.some((p) => p.id === stored)) return stored!;
    return (list.find((p) => p.id === 'sample-new-delhi-modern') ?? list[0]).id;
  });
  const [settings, setSettings] = useState<CalcSettings>(loadStoredSettings);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const t = localStorage.getItem(STORAGE_THEME_KEY);
    return t === 'dark' ? 'dark' : 'light';
  });
  const [activeTab, setActiveTab] = useState<MainTab>('home');
  const [routeRequest, setRouteRequest] = useState<RouteRequest | null>(null);
  const [expandedGroup, setExpandedGroup] = useState<string | null>('calculations');
  const [language, setLanguage] = useState<AppLanguage>(() => {
    try {
      return localStorage.getItem(STORAGE_LANG_KEY) === 'hi' ? 'hi' : 'en';
    } catch {
      return 'en';
    }
  });
  const [editorOpen, setEditorOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [bookletOpen, setBookletOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [requestedMatchPair, setRequestedMatchPair] = useState<
    | {
        brideId?: string;
        groomId?: string;
        subTab?: 'overview' | 'porutham' | 'sphuta' | 'vivaha' | 'pooja' | 'house_sign';
        nonce: number;
      }
    | undefined
  >(undefined);
  const importRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_LANG_KEY, language);
    } catch {
      // ignore
    }
  }, [language]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PROFILES_KEY, JSON.stringify(profiles));
      localStorage.setItem(STORAGE_ACTIVE_KEY, activeId);
    } catch {
      // ignore
    }
  }, [profiles, activeId]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  const activeInput = useMemo(
    () => profiles.find((p) => p.id === activeId) || profiles[0],
    [profiles, activeId]
  );

  const chart = useMemo(
    () => calculateChart(activeInput, settings),
    [activeInput, settings]
  );

  const navigateTo = (tab: MainTab, subTab?: string, nested?: string) => {
    setActiveTab(tab);
    setDrawerOpen(false);
    setRouteRequest((prev) => ({
      tab,
      subTab,
      nested,
      nonce: (prev?.nonce ?? 0) + 1,
    }));
  };

  const handleApplyBirth = (updated: BirthInput, saveAsNew: boolean) => {
    if (saveAsNew) {
      setProfiles((prev) => [updated, ...prev]);
      setActiveId(updated.id);
    } else {
      setProfiles((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    }
  };

  const handleQuickGenerateKundali = (input: BirthInput) => {
    setProfiles((prev) => (prev.some((p) => p.id === input.id) ? prev : [input, ...prev]));
    setActiveId(input.id);
    navigateTo('basics', 'basic_details');
  };

  const handleQuickMatchKundali = (groom: BirthInput, bride: BirthInput) => {
    const resolvedGroom =
      groom.id && profiles.some((p) => p.id === groom.id)
        ? groom
        : { ...groom, id: `match-boy-${Date.now()}` };
    const resolvedBride =
      bride.id && profiles.some((p) => p.id === bride.id)
        ? bride
        : { ...bride, id: `match-girl-${Date.now() + 1}` };

    setProfiles((prev) => {
      let next = prev;
      if (!next.some((p) => p.id === resolvedGroom.id)) next = [resolvedGroom, ...next];
      else next = next.map((p) => (p.id === resolvedGroom.id ? resolvedGroom : p));
      if (!next.some((p) => p.id === resolvedBride.id)) next = [resolvedBride, ...next];
      else next = next.map((p) => (p.id === resolvedBride.id ? resolvedBride : p));
      return next;
    });

    setRequestedMatchPair({
      brideId: resolvedBride.id,
      groomId: resolvedGroom.id,
      nonce: Date.now(),
    });
    navigateTo('match');
  };

  const handleNewPrashna = () => {
    const prashna = createNowPrashnaInput();
    prashna.id = `prashna-${Date.now()}`;
    setProfiles((prev) => [prashna, ...prev]);
    setActiveId(prashna.id);
    navigateTo('prashna');
  };

  const handleDeleteProfile = (targetId?: string) => {
    if (profiles.length <= 1) return;
    const idToDelete = targetId ?? activeInput.id;
    const remaining = profiles.filter((p) => p.id !== idToDelete);
    if (remaining.length === 0) return;
    setProfiles(remaining);
    if (activeInput.id === idToDelete || !remaining.some((p) => p.id === activeId)) {
      const nextLiving =
        remaining.find((p) => {
          const y = parseInt(p.date.slice(0, 4), 10);
          return Number.isFinite(y) && new Date().getFullYear() - y <= 120;
        }) ?? remaining[0];
      setActiveId(nextLiving.id);
    }
  };

  const handleExportJson = () => {
    const payload = {
      app: 'Jyotish Hora',
      exportedAt: new Date().toISOString(),
      profile: activeInput,
      settings,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeInput.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.jhora.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        const prof: BirthInput = parsed.profile ?? parsed;
        if (prof && prof.date && prof.time && typeof prof.latitude === 'number') {
          const imported: BirthInput = {
            ...prof,
            id: `imported-${Date.now()}`,
            name: prof.name || file.name.replace(/\.json$/i, ''),
          };
          setProfiles((prev) => [imported, ...prev]);
          setActiveId(imported.id);
        }
      } catch {
        // ignore invalid json
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleApplyRectifiedTime = (newDate: string, newTime: string) => {
    setProfiles((prev) =>
      prev.map((p) => (p.id === activeInput.id ? { ...p, date: newDate, time: newTime } : p))
    );
  };

  const t = UI_TEXT[language];
  const isHi = language === 'hi';

  const sidebarSections: SidebarSection[] = [
    {
      id: 'calculations',
      labelEn: 'Calculations',
      labelHi: 'कुंडली एवं गणना',
      icon: <Sparkles size={15} />,
      children: [
        { labelEn: 'Basic Details (Person / Avakhada)', labelHi: 'मूल विवरण (अवकहड़ा व घातक)', tab: 'basics', subTab: 'basic_details' },
        { labelEn: 'Birth Chart & Degrees', labelHi: 'जन्म कुंडली व ग्रह अंश', tab: 'basics', subTab: 'planets' },
        { labelEn: 'Chalit & Avakahada', labelHi: 'चलित व अवकहड़ा चक्र', tab: 'basics', subTab: 'chalit' },
        { labelEn: 'Shodashvarga (D1–D60)', labelHi: 'षोडशवर्ग कुंडली (D1–D60)', tab: 'vargas', subTab: 'D9' },
        { labelEn: 'Higher Micro Vargas (D64–D360 / D108)', labelHi: 'उच्च सूक्ष्म वर्ग (D64–D360 / D108)', tab: 'vargas', subTab: 'D108' },
        { labelEn: 'Shadbala & Yogas', labelHi: 'षड्बल, मांगलिक व योग', tab: 'strength' },
        { labelEn: 'Ashtakavarga & Prastara', labelHi: 'अष्टकवर्ग व प्रस्तार', tab: 'ashtakavarga', subTab: 'raw' },
      ],
    },
    {
      id: 'predictions',
      labelEn: 'Predictions & Reports',
      labelHi: 'फलादेश व विशेष रिपोर्ट',
      icon: <BookOpen size={15} />,
      children: [
        { labelEn: '120-Yr Events, Q&A & Paya', labelHi: '120-वर्ष घटनाएँ, Q&A व पाया', tab: 'predictions', subTab: 'eventsLedger' },
        { labelEn: 'Past Life & Future Becoming', labelHi: 'पूर्व जन्म व भविष्य गति', tab: 'predictions', subTab: 'pastFuture' },
        { labelEn: '1000+ Empirical Rules & SA MEP', labelHi: '1000+ उन्नत सूत्र व सिस्टम MEP', tab: 'predictions', subTab: 'advancedTechniques' },
        { labelEn: 'Bhrigu Nandi Nadi (BNN)', labelHi: 'भृगु नंदी नाड़ी फलादेश', tab: 'predictions', subTab: 'bhriguNadi' },
        { labelEn: '144 Bhavesha Matrix', labelHi: '144 भावेश स्थिति तालिका', tab: 'predictions', subTab: 'bhavesha144' },
        { labelEn: 'Yuti Conjunctions (2–7)', labelHi: 'ग्रह युति फल (2 से 7)', tab: 'predictions', subTab: 'yuti' },
        { labelEn: 'Signs, Nakshatras & Houses', labelHi: 'राशि, नक्षत्र व द्वादश भाव', tab: 'predictions', subTab: 'planetInHouse' },
        { labelEn: 'Bhavat Bhavam & Drishti', labelHi: 'भावात् भावम् व दृष्टि फल', tab: 'predictions', subTab: 'bhavatBhavam' },
        { labelEn: 'Degree-Wise Ansha Report', labelHi: 'अंश बल व अवस्था फल', tab: 'predictions', subTab: 'degreeWise' },
      ],
    },
    {
      id: 'dasha',
      labelEn: 'Dasha Systems',
      labelHi: 'दशा प्रणाली',
      icon: <Clock size={15} />,
      children: [
        { labelEn: 'Vimshottari (5 Levels)', labelHi: 'विंशोत्तरी दशा (5 स्तर)', tab: 'dasha', subTab: 'vimshottari' },
        { labelEn: 'Yogini Dasha', labelHi: 'योगिनी दशा', tab: 'dasha', subTab: 'yogini' },
        { labelEn: 'Ashtottari & Narayana', labelHi: 'अष्टोत्तरी व नारायण दशा', tab: 'dasha', subTab: 'narayana' },
        { labelEn: 'Sudarshana Chakra', labelHi: 'सुदर्शन चक्र', tab: 'dasha', subTab: 'sudarshana' },
      ],
    },
    {
      id: 'lal_kitab',
      labelEn: 'Lal Kitab',
      labelHi: 'लाल किताब',
      icon: <Flame size={15} />,
      children: [
        { labelEn: 'Lal Kitab Tewa & Rin', labelHi: 'लाल किताब टेवा व ऋण', tab: 'predictions', subTab: 'branchesNumerology', nested: 'lal_kitab' },
        { labelEn: 'Varshaphal & Remedies', labelHi: 'वर्षफल व लाल किताब उपाय', tab: 'predictions', subTab: 'branchesNumerology', nested: 'varshaphala_jaimini' },
      ],
    },
    {
      id: 'kp_system',
      labelEn: 'KP System',
      labelHi: 'KP पध्दति',
      icon: <Star size={15} />,
      children: [
        { labelEn: 'KP Cusps & Significators', labelHi: 'KP भाव व उप-स्वामी', tab: 'predictions', subTab: 'branchesNumerology', nested: 'kp' },
        { labelEn: 'Prashna Horary (KP 1–249)', labelHi: 'प्रश्न कुंडली (KP 1–249)', tab: 'prashna' },
      ],
    },
    {
      id: 'numerology_branches',
      labelEn: 'Numerology & Branches',
      labelHi: 'अंक ज्योतिष व शाखाएँ',
      icon: <Grid3x3 size={15} />,
      children: [
        { labelEn: 'Lo Shu Grid Numerology', labelHi: 'अंक ज्योतिष व लो शु ग्रिड', tab: 'astro_tools', subTab: 'numerology' },
        { labelEn: 'Career, Wealth & Marriage', labelHi: 'धन, करियर, विवाह व चिकित्सा', tab: 'branches', subTab: 'career' },
        { labelEn: 'Gemstones & Rudraksha', labelHi: 'रत्न व रुद्राक्ष परामर्श', tab: 'astro_tools', subTab: 'gems_rudraksha' },
        { labelEn: 'Baby Names (Avakahada)', labelHi: 'नामकरण शिशु नाम', tab: 'astro_tools', subTab: 'baby_names' },
      ],
    },
    {
      id: 'transits_panchang',
      labelEn: 'Transits & Calendar',
      labelHi: 'गोचर व पंचांग उपकरण',
      icon: <Calendar size={15} />,
      children: [
        { labelEn: 'Live Gochar & Kakshas (3°45\')', labelHi: 'वर्तमान गोचर, कक्ष्या व वेध', tab: 'transits' },
        { labelEn: 'Pancha Pakshi (5-Bird Power)', labelHi: 'पंच पक्षी शास्त्र (दैनिक याम)', tab: 'tools', subTab: 'panchapakshi' },
        { labelEn: 'Samvatsara · Shoola/Vaasa', labelHi: 'संवत्सर, दिशाशूल, वास व मुहूर्त', tab: 'tools', subTab: 'deep_panchang' },
        { labelEn: 'Daily Rashifal', labelHi: 'दैनिक राशिफल व ताराबल', tab: 'astro_tools', subTab: 'rashifal' },
        { labelEn: 'Birth Time Rectification', labelHi: 'जन्म समय संशोधन (BTR)', tab: 'tools', subTab: 'btr' },
        { labelEn: 'Do Ghati · Hora · Monthly', labelHi: 'दो-घटी · होरा · मासिक पंचांग', tab: 'tools', subTab: 'do_ghati' },
        { labelEn: 'Muhurta & 10-Yr Calendar', labelHi: 'शुभ मुहूर्त व 10-वर्ष पंचांग', tab: 'tools', subTab: 'muhurta' },
      ],
    },
    {
      id: 'occult_healing',
      labelEn: 'Occult, Healing & Oracles',
      labelHi: 'गूढ़ विद्या, आरोग्य व प्रश्नावली',
      icon: <Compass size={15} />,
      children: [
        { labelEn: 'Calculators (Rasi / Lagna / Ayan)', labelHi: 'राशि, लग्न व अयनांश कैलकुलेटर', tab: 'hub', subTab: 'calculators', nested: 'signs' },
        { labelEn: 'Healing & Ayurveda (9 Therapies)', labelHi: 'आयुर्वेद, योग व 9 आरोग्य चिकित्सा', tab: 'hub', subTab: 'healing' },
        { labelEn: 'Shiva Swarodaya & Chinese', labelHi: 'शिव स्वरोदय व चाइनीज राशिफल', tab: 'hub', subTab: 'swarodaya' },
        { labelEn: 'Mantra, Chalisa & Aarti', labelHi: 'मंत्र, चालीसा, आरती व धर्म', tab: 'hub', subTab: 'prayers' },
        { labelEn: 'Ramshalaka & Hanuman Prashna', labelHi: 'रामशलाका व हनुमान प्रश्नावली', tab: 'hub', subTab: 'prashnavali' },
        { labelEn: 'Palmistry & Learn Jyotish', labelHi: 'सामुद्रिक हस्तरेखा व ज्योतिष सीखें', tab: 'hub', subTab: 'palmistry' },
      ],
    },
  ];

  const tabTitles: Record<MainTab, string> = {
    home: isHi ? 'मुख्य कार्यक्षेत्र (डैशबोर्ड)' : 'Worksheet Hub',
    basics: t.tabs.basics,
    predictions: t.tabs.predictions,
    branches: t.tabs.branches,
    prashna: t.tabs.prashna,
    vargas: t.tabs.vargas,
    dasha: t.tabs.dasha,
    ashtakavarga: t.tabs.ashtakavarga,
    strength: t.tabs.strength,
    transits: t.tabs.transits,
    tools: t.tabs.tools,
    astro_tools: t.tabs.astroTools,
    match: t.tabs.match,
    hub: isHi ? 'कैलकुलेटर, गूढ़ विद्या, आरोग्य व प्रश्नावली' : 'Calculators, Occult, Healing & Oracles',
  };

  return (
    <LanguageProvider lang={language} setLang={setLanguage}>
      <div className="app-shell">
        {/* Clean Slim Top Command & Icon Toolbar */}
        <header className="top-bar no-print">
          <div className="header-brand-slot">
            <button
              type="button"
              className="icon-btn mobile-menu-btn"
              onClick={() => setDrawerOpen((o) => !o)}
              aria-label="Open Navigation Menu"
            >
              {drawerOpen ? <X size={17} /> : <Menu size={17} />}
            </button>
            <button
              type="button"
              className="brand-home-btn"
              onClick={() => navigateTo('home')}
              title={isHi ? 'मुख्य डैशबोर्ड पर जाएँ' : 'Go to Worksheet Hub'}
            >
              <div className="brand-mark" aria-hidden="true">ॐ</div>
              <div>
                <h1 className="brand-title">{isHi ? 'ज्योतिष होरा' : 'Jyotish Hora'}</h1>
                <div className="brand-sub">{t.appSub}</div>
              </div>
            </button>
          </div>

          <div className="header-toolbar-zone">
            <button
              type="button"
              className={`icon-tool-btn ${activeTab === 'home' ? 'is-active' : ''}`}
              onClick={() => navigateTo('home')}
              title={isHi ? 'होम / मुख्य डैशबोर्ड' : 'Home / Worksheet Hub'}
            >
              <Home size={16} />
            </button>

            <select
              aria-label="Select Chart Profile"
              className="select-profile"
              value={activeInput.id}
              onChange={(e) => setActiveId(e.target.value)}
            >
              {profiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({formatDateDmy(p.date)})
                </option>
              ))}
            </select>

            <button
              type="button"
              className="icon-tool-btn"
              onClick={() => setEditorOpen(true)}
              title={t.editNew}
            >
              <Edit3 size={16} />
            </button>

            {profiles.length > 1 && (
              <button
                type="button"
                className="icon-tool-btn"
                onClick={() => handleDeleteProfile()}
                title={isHi ? 'वर्तमान प्रोफ़ाइल हटाएँ' : 'Delete Active Profile'}
                style={{ color: 'var(--bad)' }}
              >
                <Trash2 size={15} />
              </button>
            )}

            <button
              type="button"
              className="icon-tool-btn"
              onClick={handleNewPrashna}
              title={t.nowPrashna}
            >
              <Plus size={16} />
            </button>

            <button
              type="button"
              className="icon-tool-btn"
              onClick={() => setBookletOpen(true)}
              title={t.bookletBtn}
            >
              <FileText size={16} />
            </button>

            <button
              type="button"
              className="icon-tool-btn"
              onClick={handleExportJson}
              title={isHi ? 'JSON एक्सपोर्ट' : 'Export JSON'}
            >
              <Download size={16} />
            </button>

            <button
              type="button"
              className="icon-tool-btn"
              onClick={() => importRef.current?.click()}
              title={isHi ? 'JSON इम्पोर्ट' : 'Import JSON'}
            >
              <Upload size={16} />
            </button>

            <button
              type="button"
              className="icon-tool-btn"
              onClick={() => window.print()}
              title={isHi ? 'पेज प्रिंट करें' : 'Print Current View'}
            >
              <Printer size={16} />
            </button>

            <button
              type="button"
              className="icon-tool-btn"
              onClick={() => setSettingsOpen(true)}
              title={isHi ? 'गणना सेटिंग्स (अयनांश व भाव)' : 'Ayanamsa & House Preferences'}
            >
              <Sliders size={16} />
            </button>
          </div>

          <div className="header-right-zone">
            <div className="lang-pill-switch" role="group" aria-label="Language">
              <button
                type="button"
                className={language === 'en' ? 'is-active' : ''}
                onClick={() => setLanguage('en')}
              >
                EN
              </button>
              <button
                type="button"
                className={language === 'hi' ? 'is-active' : ''}
                onClick={() => setLanguage('hi')}
              >
                हिं
              </button>
            </div>

            <select
              aria-label="Chart Style"
              className="select-compact"
              value={settings.chartStyle}
              onChange={(e) =>
                setSettings({ ...settings, chartStyle: e.target.value as ChartStyle })
              }
            >
              <option value="north">{t.chartStyles.north}</option>
              <option value="south">{t.chartStyles.south}</option>
              <option value="east">{t.chartStyles.east}</option>
            </select>

            <button
              type="button"
              className="icon-tool-btn"
              onClick={() => setTheme((th) => (th === 'light' ? 'dark' : 'light'))}
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Theme`}
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>
          </div>
        </header>

        {/* Clean 2-Tier Portal Mega Navigation Bar */}
        <PortalMegaNav
          activeTab={activeTab}
          onNavigate={navigateTo}
          onOpenMatchSubTab={(sub) => {
            setRequestedMatchPair({ subTab: sub, nonce: Date.now() });
            navigateTo('match');
          }}
          onOpenEditor={() => setEditorOpen(true)}
          onOpenBooklet={() => setBookletOpen(true)}
        />

        {/* Mobile Drawer Backdrop */}
        {drawerOpen && (
          <div
            className="drawer-backdrop no-print"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Two-Column Studio Workspace (Clean Single-Column Portal on Home) */}
        <div className={`workspace-shell ${activeTab === 'home' ? 'is-home-portal' : ''}`}>
          <aside
            className={`side-rail no-print ${drawerOpen ? 'is-mobile-open' : ''}`}
            aria-label="Astrology Sidebar Menu"
          >
            <div className="side-scroll-area">
              <button
                type="button"
                className="side-profile-pill"
                onClick={() => {
                  setEditorOpen(true);
                  setDrawerOpen(false);
                }}
              >
                <div>
                  <div className="side-profile-name">{activeInput.name}</div>
                  <div className="side-profile-meta mono">
                    {formatDateDmy(activeInput.date)} · {activeInput.city}
                  </div>
                </div>
                <Edit3 size={13} />
              </button>

              <button
                type="button"
                className={`side-root-btn ${activeTab === 'home' ? 'is-active' : ''}`}
                onClick={() => navigateTo('home')}
              >
                <LayoutGrid size={15} />
                <span>{isHi ? 'मुख्य डैशबोर्ड (Home)' : 'Worksheet Hub (Home)'}</span>
              </button>

              <button
                type="button"
                className={`side-root-btn ${activeTab === 'match' ? 'is-active' : ''}`}
                onClick={() => navigateTo('match')}
              >
                <Heart size={15} />
                <span>{isHi ? 'कुंडली मिलान (36 गुण)' : 'Match Horoscope (36 Guna)'}</span>
              </button>

              <button
                type="button"
                className="side-root-btn"
                onClick={() => {
                  setBookletOpen(true);
                  setDrawerOpen(false);
                }}
              >
                <FileText size={15} />
                <span>{isHi ? 'बृहत् कुंडली प्रिंट / PDF' : 'Print Birth Chart / PDF'}</span>
              </button>

              {/* Expandable Accordion Sections */}
              <div className="side-accordions">
                {sidebarSections.map((sec) => {
                  const isOpen = expandedGroup === sec.id;
                  const hasActiveChild = sec.children.some((c) => c.tab === activeTab);
                  return (
                    <div key={sec.id} className="side-accordion-group">
                      <button
                        type="button"
                        className={`side-accordion-trigger ${hasActiveChild ? 'has-active' : ''}`}
                        onClick={() => setExpandedGroup(isOpen ? null : sec.id)}
                      >
                        <span className="side-trigger-label">
                          {sec.icon}
                          <span>{isHi ? sec.labelHi : sec.labelEn}</span>
                        </span>
                        {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      </button>

                      {isOpen && (
                        <div className="side-sublist">
                          {sec.children.map((child, idx) => (
                            <button
                              key={`${sec.id}-${idx}`}
                              type="button"
                              className={`side-sub-btn ${
                                activeTab === child.tab &&
                                (!child.subTab ||
                                  (routeRequest?.tab === child.tab &&
                                    routeRequest?.subTab === child.subTab &&
                                    (!child.nested || routeRequest?.nested === child.nested)))
                                  ? 'is-active'
                                  : ''
                              }`}
                              onClick={() => navigateTo(child.tab, child.subTab, child.nested)}
                            >
                              {isHi ? child.labelHi : child.labelEn}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="side-utilities">
              <div className="side-group-title">{t.common.ayanamsa}</div>
              <select
                aria-label="Ayanamsa"
                className="select-compact"
                style={{ width: '100%' }}
                value={settings.ayanamsa}
                onChange={(e) =>
                  setSettings({ ...settings, ayanamsa: e.target.value as AyanamsaId })
                }
              >
                {(Object.keys(AYANAMSA_META) as AyanamsaId[]).map((k) => (
                  <option key={k} value={k}>
                    {t.ayanamsaLabels[k] ?? AYANAMSA_META[k].label}
                  </option>
                ))}
              </select>

              {profiles.length > 1 && (
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  style={{ width: '100%', justifyContent: 'center', color: 'var(--bad)' }}
                  onClick={() => handleDeleteProfile()}
                >
                  <Trash2 size={13} />
                  <span>{isHi ? 'वर्तमान प्रोफ़ाइल हटाएँ' : 'Delete Active Profile'}</span>
                </button>
              )}

              <input
                ref={importRef}
                type="file"
                accept=".json"
                className="hidden-input"
                onChange={handleImportJson}
              />
            </div>
          </aside>

          {/* Right Workspace Content */}
          <div className="workspace-main">
            {activeTab !== 'home' && (
              <div className="native-strip-bar no-print">
                <div className="strip-left">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => navigateTo('home')}
                  >
                    <ArrowLeft size={13} />
                    <span>{isHi ? 'डैशबोर्ड' : 'Dashboard'}</span>
                  </button>
                  <span className="strip-section-title">{tabTitles[activeTab]}</span>
                </div>

                <div className="strip-meta muted">
                  <strong>{activeInput.name}</strong>
                  {' · '}
                  {trSign(chart.ascendant.signIndex, language)} {chart.ascendant.shortDms}
                  {' · '}
                  {trTerm(chart.panchang.nakshatra.name, language)}{' '}
                  {isHi ? 'च' : 'P'}
                  {chart.panchang.nakshatra.pada}
                  {' · '}
                  <span className="mono">{formatDateDmy(activeInput.date)}</span> · {activeInput.city}
                </div>
              </div>
            )}

            <main className="main-content">
              {activeTab === 'home' && (
                <HomeDashboardView
                  chart={chart}
                  activeInput={activeInput}
                  profiles={profiles}
                  settings={settings}
                  onSelectProfile={(id) => setActiveId(id)}
                  onNavigate={navigateTo}
                  onOpenEditor={() => setEditorOpen(true)}
                  onOpenBooklet={() => setBookletOpen(true)}
                  onQuickGenerateKundali={handleQuickGenerateKundali}
                  onQuickMatchKundali={handleQuickMatchKundali}
                  canDeleteProfile={profiles.length > 1}
                  onDeleteProfile={() => handleDeleteProfile()}
                />
              )}
              {activeTab === 'basics' && (
                <BasicsView
                  chart={chart}
                  chartStyle={settings.chartStyle}
                  requestedSubTab={
                    routeRequest?.tab === 'basics'
                      ? { id: routeRequest.subTab, nonce: routeRequest.nonce }
                      : undefined
                  }
                  onNavigate={navigateTo}
                  onOpenBooklet={() => setBookletOpen(true)}
                />
              )}
              {activeTab === 'predictions' && (
                <PredictionsView
                  chart={chart}
                  chartStyle={settings.chartStyle}
                  requestedRoute={
                    routeRequest?.tab === 'predictions'
                      ? {
                          subTab: routeRequest.subTab,
                          nested: routeRequest.nested,
                          nonce: routeRequest.nonce,
                        }
                      : undefined
                  }
                />
              )}
              {activeTab === 'branches' && (
                <SpecializedAstrologyView
                  chart={chart}
                  chartStyle={settings.chartStyle}
                  requestedBranch={
                    routeRequest?.tab === 'branches'
                      ? { id: routeRequest.subTab, nonce: routeRequest.nonce }
                      : undefined
                  }
                />
              )}
              {activeTab === 'prashna' && (
                <PrashnaView
                  baseInput={activeInput}
                  settings={settings}
                  chartStyle={settings.chartStyle}
                />
              )}
              {activeTab === 'vargas' && (
                <VargasView
                  chart={chart}
                  chartStyle={settings.chartStyle}
                  requestedVarga={
                    routeRequest?.tab === 'vargas'
                      ? { id: routeRequest.subTab, nonce: routeRequest.nonce }
                      : undefined
                  }
                />
              )}
              {activeTab === 'dasha' && (
                <DashaView
                  chart={chart}
                  requestedSystem={
                    routeRequest?.tab === 'dasha'
                      ? { id: routeRequest.subTab, nonce: routeRequest.nonce }
                      : undefined
                  }
                />
              )}
              {activeTab === 'ashtakavarga' && (
                <AshtakavargaView
                  chart={chart}
                  chartStyle={settings.chartStyle}
                  requestedMode={
                    routeRequest?.tab === 'ashtakavarga'
                      ? { id: routeRequest.subTab, nonce: routeRequest.nonce }
                      : undefined
                  }
                />
              )}
              {activeTab === 'strength' && <StrengthYogasView chart={chart} />}
              {activeTab === 'transits' && (
                <TransitsView
                  natalChart={chart}
                  settings={settings}
                  chartStyle={settings.chartStyle}
                />
              )}
              {activeTab === 'tools' && (
                <ToolsSuiteView
                  chart={chart}
                  baseInput={activeInput}
                  settings={settings}
                  onApplyRectifiedTime={handleApplyRectifiedTime}
                  requestedSubTab={
                    routeRequest?.tab === 'tools'
                      ? { id: routeRequest.subTab, nonce: routeRequest.nonce }
                      : undefined
                  }
                />
              )}
              {activeTab === 'astro_tools' && (
                <AstroSageToolsView
                  chart={chart}
                  requestedMode={
                    routeRequest?.tab === 'astro_tools'
                      ? { id: routeRequest.subTab, nonce: routeRequest.nonce }
                      : undefined
                  }
                />
              )}
              {activeTab === 'match' && (
                <MatchMakingView
                  profiles={profiles}
                  activeProfileId={activeInput.id}
                  settings={settings}
                  chartStyle={settings.chartStyle}
                  requestedPair={requestedMatchPair}
                />
              )}
              {activeTab === 'hub' && (
                <PortalHubViews
                  chart={chart}
                  baseInput={activeInput}
                  profiles={profiles}
                  settings={settings}
                  onNavigate={navigateTo}
                  requestedMode={
                    routeRequest?.tab === 'hub'
                      ? { subTab: routeRequest.subTab, nested: routeRequest.nested, nonce: routeRequest.nonce }
                      : undefined
                  }
                />
              )}
            </main>
          </div>
        </div>

        {/* Mobile Bottom Quick Nav */}
        <nav className="mobile-bottom-nav no-print" aria-label="Quick Mobile Navigation">
          {(
            [
              { id: 'home', label: isHi ? 'होम' : 'Home', icon: <Home size={17} /> },
              { id: 'basics', label: isHi ? 'कुंडली' : 'Kundali', icon: <Sparkles size={17} /> },
              { id: 'predictions', label: isHi ? 'फलादेश' : 'Predict', icon: <BookOpen size={17} /> },
              { id: 'dasha', label: isHi ? 'दशा' : 'Dashas', icon: <Clock size={17} /> },
              { id: 'match', label: isHi ? 'मिलान' : 'Match', icon: <Heart size={17} /> },
            ] as Array<{ id: MainTab; label: string; icon: React.ReactNode }>
          ).map((m) => (
            <button
              key={m.id}
              type="button"
              className={`mobile-nav-btn ${activeTab === m.id ? 'is-active' : ''}`}
              onClick={() => navigateTo(m.id)}
            >
              {m.icon}
              <span>{m.label}</span>
            </button>
          ))}
        </nav>

        <BirthEditorModal
          open={editorOpen}
          initial={activeInput}
          profiles={profiles}
          onClose={() => setEditorOpen(false)}
          onApply={handleApplyBirth}
          onSelectProfile={(id) => setActiveId(id)}
          onDeleteProfile={(id) => handleDeleteProfile(id)}
        />

        <SettingsModal
          open={settingsOpen}
          settings={settings}
          onChange={setSettings}
          onClose={() => setSettingsOpen(false)}
        />

        <KundaliBookletModal
          open={bookletOpen}
          onClose={() => setBookletOpen(false)}
          chart={chart}
          chartStyle={settings.chartStyle}
          language={language}
        />
      </div>
    </LanguageProvider>
  );
}

export default App;
