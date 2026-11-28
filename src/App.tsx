import React, { useEffect, useMemo, useState } from 'react';
import { calculateChart } from './astro/calculator';
import type { BirthInput, CalcSettings, ChartStyle } from './astro/types';
import { shiftBirthInputTime } from './astro/workstationUtils';
import { OnlineJyotishHomePortal } from './components/OnlineJyotishHomePortal';
import { GlobalCommandPaletteModal } from './components/GlobalCommandPaletteModal';
import type { MarriageSubTab } from './components/marriage/AdvanceMarriageMatchingView';
import type { AstroToolCategory } from './components/onlinejyotish/OnlineJyotishToolsView';
import type { SpecificCalculatorId } from './components/onlinejyotish/FortuneCalculatorsView';
import { AvProControlStrip } from './components/workstation/AvProControlStrip';
import type { WorksheetId } from './components/workstation/workstationTypes';

// Modals lazy-loaded on demand
const BirthEditorModal = React.lazy(() => import('./components/BirthEditorModal').then(m => ({ default: m.BirthEditorModal })));
const KundaliBookletModal = React.lazy(() => import('./components/KundaliBookletModal').then(m => ({ default: m.KundaliBookletModal })));
const SettingsModal = React.lazy(() => import('./components/SettingsModal').then(m => ({ default: m.SettingsModal })));

// Asynchronously code-split all heavy views for lightning-fast initial load
const OnlineJyotishVedicHoroscopeView = React.lazy(() => import('./components/onlinejyotish/OnlineJyotishVedicHoroscopeView').then(m => ({ default: m.OnlineJyotishVedicHoroscopeView })));
const OnlineJyotishKpView = React.lazy(() => import('./components/onlinejyotish/OnlineJyotishKpView').then(m => ({ default: m.OnlineJyotishKpView })));
const AdvanceMarriageMatchingView = React.lazy(() => import('./components/marriage/AdvanceMarriageMatchingView').then(m => ({ default: m.AdvanceMarriageMatchingView })));
const OnlineJyotishPanchangView = React.lazy(() => import('./components/onlinejyotish/OnlineJyotishPanchangView').then(m => ({ default: m.OnlineJyotishPanchangView })));
const OnlineJyotishFestivalsView = React.lazy(() => import('./components/onlinejyotish/OnlineJyotishFestivalsView').then(m => ({ default: m.OnlineJyotishFestivalsView })));
const OnlineJyotishToolsView = React.lazy(() => import('./components/onlinejyotish/OnlineJyotishToolsView').then(m => ({ default: m.OnlineJyotishToolsView })));
const SadeSatiView = React.lazy(() => import('./components/onlinejyotish/SadeSatiView'));
const JaiminiView = React.lazy(() => import('./components/onlinejyotish/JaiminiView').then(m => ({ default: m.JaiminiView })));
const KPEnterpriseView = React.lazy(() => import('./components/onlinejyotish/KPEnterpriseView').then(m => ({ default: m.KPEnterpriseView })));
const MedicalAstrologyView = React.lazy(() => import('./components/onlinejyotish/MedicalAstrologyView').then(m => ({ default: m.MedicalAstrologyView })));
const SynastryBTRView = React.lazy(() => import('./components/onlinejyotish/SynastryBTRView').then(m => ({ default: m.SynastryBTRView })));
const MuhurtaPrashnaView = React.lazy(() => import('./components/onlinejyotish/MuhurtaPrashnaView').then(m => ({ default: m.MuhurtaPrashnaView })));
const HolisticRemediesView = React.lazy(() => import('./components/onlinejyotish/HolisticRemediesView').then(m => ({ default: m.HolisticRemediesView })));
const DualTransitWheelView = React.lazy(() => import('./components/onlinejyotish/DualTransitWheelView').then(m => ({ default: m.DualTransitWheelView })));
const SarvatobhadraChakraView = React.lazy(() => import('./components/onlinejyotish/SarvatobhadraChakraView').then(m => ({ default: m.SarvatobhadraChakraView })));
const LalKitabView = React.lazy(() => import('./components/onlinejyotish/LalKitabView').then(m => ({ default: m.LalKitabView })));
const SplitStudioWorkstationView = React.lazy(() => import('./components/onlinejyotish/SplitStudioWorkstationView').then(m => ({ default: m.SplitStudioWorkstationView })));
const MultiDashaMatrixView = React.lazy(() => import('./components/onlinejyotish/MultiDashaMatrixView').then(m => ({ default: m.MultiDashaMatrixView })));
const SudarshanaChakraView = React.lazy(() => import('./components/onlinejyotish/SudarshanaChakraView').then(m => ({ default: m.SudarshanaChakraView })));
const ClientConsultationDiaryView = React.lazy(() => import('./components/onlinejyotish/ClientConsultationDiaryView').then(m => ({ default: m.ClientConsultationDiaryView })));
const TransitCalendar365View = React.lazy(() => import('./components/onlinejyotish/TransitCalendar365View').then(m => ({ default: m.TransitCalendar365View })));
const FinancialAstrologyView = React.lazy(() => import('./components/onlinejyotish/FinancialAstrologyView').then(m => ({ default: m.FinancialAstrologyView })));
const SamudrikaShastraView = React.lazy(() => import('./components/onlinejyotish/SamudrikaShastraView').then(m => ({ default: m.SamudrikaShastraView })));
const AstrocartographyView = React.lazy(() => import('./components/onlinejyotish/AstrocartographyView').then(m => ({ default: m.AstrocartographyView })));
const CelebrityTwinView = React.lazy(() => import('./components/onlinejyotish/CelebrityTwinView').then(m => ({ default: m.CelebrityTwinView })));
const HumanDesignView = React.lazy(() => import('./components/onlinejyotish/HumanDesignView').then(m => ({ default: m.HumanDesignView })));
const VarshaphalaView = React.lazy(() => import('./components/onlinejyotish/VarshaphalaView').then(m => ({ default: m.VarshaphalaView })));
const WesternAstrologyView = React.lazy(() => import('./components/WesternAstrologyView').then(m => ({ default: m.WesternAstrologyView })));
const LifeDossierView = React.lazy(() => import('./components/LifeDossierView').then(m => ({ default: m.LifeDossierView })));
const PredictionsView = React.lazy(() => import('./components/PredictionsView').then(m => ({ default: m.PredictionsView })));
const LifeEventTimingView = React.lazy(() => import('./components/predictions/LifeEventTimingView').then(m => ({ default: m.LifeEventTimingView })));
const ClassicalDoshasView = React.lazy(() => import('./components/predictions/ClassicalDoshasView').then(m => ({ default: m.ClassicalDoshasView })));
const DashaMatrix81View = React.lazy(() => import('./components/predictions/DashaMatrix81View').then(m => ({ default: m.DashaMatrix81View })));
const KotaAndAyurdayaView = React.lazy(() => import('./components/predictions/KotaAndAyurdayaView').then(m => ({ default: m.KotaAndAyurdayaView })));
const FortuneCalculatorsView = React.lazy(() => import('./components/onlinejyotish/FortuneCalculatorsView').then(m => ({ default: m.FortuneCalculatorsView })));
const InteractivePalmistryView = React.lazy(() => import('./components/onlinejyotish/InteractivePalmistryView').then(m => ({ default: m.InteractivePalmistryView })));
const NumerologyView = React.lazy(() => import('./components/onlinejyotish/NumerologyView').then(m => ({ default: m.NumerologyView })));
const AstroSageToolsView = React.lazy(() => import('./components/AstroSageToolsView').then(m => ({ default: m.AstroSageToolsView })));
const CalculationsDossierView = React.lazy(() => import('./components/CalculationsDossierView').then(m => ({ default: m.CalculationsDossierView })));
const PrasnaMargaWorkstationPanel = React.lazy(() => import('./components/predictions/PrasnaMargaWorkstationPanel').then(m => ({ default: m.PrasnaMargaWorkstationPanel })));
const ParasharaKalaWorkstationPanel = React.lazy(() => import('./components/predictions/ParasharaKalaWorkstationPanel').then(m => ({ default: m.ParasharaKalaWorkstationPanel })));
const AvAstroVibeWorkstation = React.lazy(() => import('./components/workstation/AvAstroVibeWorkstation').then(m => ({ default: m.AvAstroVibeWorkstation })));
import { DropdownNavHeader } from './components/layout/DropdownNavHeader';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { MobileNavDrawer } from './components/layout/MobileNavDrawer';
import {
  createNowPrashnaInput,
  DEFAULT_SETTINGS,
} from './data/cities';
import { LanguageProvider } from './i18n/LanguageContext';
import { type AppLanguage, LANGUAGE_LABELS } from './i18n/translations';

const STORAGE_PROFILES_KEY = 'jyotish_hora_profiles_v1';
const STORAGE_ACTIVE_KEY = 'jyotish_hora_active_v1';
const STORAGE_SETTINGS_KEY = 'jyotish_hora_settings_v1';
const STORAGE_THEME_KEY = 'jyotish_hora_theme_v1';
const STORAGE_LANG_KEY = 'jyotish_hora_lang_v1';

export const DEFAULT_USER_PROFILE: BirthInput = {
  id: 'user-profile-default',
  name: 'जातक',
  gender: 'male',
  date: '2000-01-01',
  time: '12:00:00',
  city: 'New Delhi',
  country: 'India',
  latitude: 28.6139,
  longitude: 77.209,
  timezone: 'Asia/Kolkata',
  notes: 'Default native profile',
};

const DISALLOWED_PROFILE_PATTERNS = [
  'einstein',
  'vivekanand',
  'tagore',
  'aarav sharma',
  'sample native',
  'sample-vivekananda',
  'sample-einstein',
  'sample-tagore',
  'sample-partner-1998',
  'sample-new-delhi-modern',
];

export function filterOutDisallowedProfiles(list: BirthInput[]): BirthInput[] {
  return list.filter((p) => {
    if (!p) return false;
    const idLower = (p.id || '').toLowerCase();
    const nameLower = (p.name || '').toLowerCase();
    return !DISALLOWED_PROFILE_PATTERNS.some(
      (pattern) => idLower.includes(pattern) || nameLower.includes(pattern)
    );
  });
}

function loadStoredProfiles(): BirthInput[] {
  try {
    const raw = localStorage.getItem(STORAGE_PROFILES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const clean = filterOutDisallowedProfiles(parsed);
        if (clean.length > 0) {
          try {
            localStorage.setItem(STORAGE_PROFILES_KEY, JSON.stringify(clean));
          } catch {
            // ignore
          }
          return clean;
        }
      }
    }
  } catch {
    // ignore storage errors
  }
  const fallback = [DEFAULT_USER_PROFILE];
  try {
    localStorage.setItem(STORAGE_PROFILES_KEY, JSON.stringify(fallback));
  } catch {
    // ignore
  }
  return fallback;
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

const ViewLoadingFallback: React.FC = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      gap: '16px',
      color: '#64748b',
    }}
  >
    <div
      style={{
        width: '40px',
        height: '40px',
        border: '3px solid #e2e8f0',
        borderTopColor: '#2563eb',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }}
    />
    <div style={{ fontSize: '13px', fontWeight: 600 }}>
      गणना मॉड्यूल लोड हो रहा है... (Loading Module...)
    </div>
  </div>
);

export function App() {
  const [profiles, setProfiles] = useState<BirthInput[]>(loadStoredProfiles);
  const [activeId, setActiveId] = useState<string>(() => {
    const stored = localStorage.getItem(STORAGE_ACTIVE_KEY);
    const list = loadStoredProfiles();
    if (stored && list.some((p) => p.id === stored)) return stored;
    return list[0]?.id || DEFAULT_USER_PROFILE.id;
  });
  const [settings, setSettings] = useState<CalcSettings>(loadStoredSettings);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const t = localStorage.getItem(STORAGE_THEME_KEY);
    return t === 'dark' ? 'dark' : 'light';
  });

  // Current Active View in AV Astro Vibe (single unified shell across all tools & worksheets)
  const [currentView, setCurrentView] = useState<string>('workstation');
  const [activeWorksheet, setActiveWorksheet] = useState<WorksheetId>('main');
  const [rectifySeconds, setRectifySeconds] = useState<number>(0);
  const [workstationSubTab, setWorkstationSubTab] = useState<string>('1');
  const [predictionsSubTab, setPredictionsSubTab] = useState<string>('deep_life');
  const [marriageSubTab, setMarriageSubTab] = useState<MarriageSubTab>('ashtakoota');
  const [fortuneCalcSubTab, setFortuneCalcSubTab] = useState<SpecificCalculatorId>('overview');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  const [language, setLanguage] = useState<AppLanguage>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_LANG_KEY);
      if (saved && saved in LANGUAGE_LABELS) {
        return saved as AppLanguage;
      }
      return 'en';
    } catch {
      return 'en';
    }
  });

  const [editorOpen, setEditorOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [bookletOpen, setBookletOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_THEME_KEY, theme);
  }, [theme]);

  // Global Ctrl + K and F1..F9 Worksheet Shortcuts
  useEffect(() => {
    const fKeyMap: Record<string, WorksheetId> = {
      F1: 'main',
      F2: 'vargas',
      F3: 'strengths',
      F4: 'dashas',
      F5: 'transits',
      F6: 'yogas_research',
      F7: 'matchmaking',
      F8: 'ephemeris_panchang',
      F9: 'custom',
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
        return;
      }
      if (fKeyMap[e.key]) {
        e.preventDefault();
        setCurrentView('workstation');
        setActiveWorksheet(fKeyMap[e.key]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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

  useEffect(() => {
    const onOpenBooklet = () => setBookletOpen(true);
    window.addEventListener('jyotish:open-booklet', onOpenBooklet);
    return () => window.removeEventListener('jyotish:open-booklet', onOpenBooklet);
  }, []);

  const activeInput = useMemo(
    () => profiles.find((p) => p.id === activeId) || profiles[0],
    [profiles, activeId]
  );

  useEffect(() => {
    setRectifySeconds(0);
  }, [activeInput.id, activeInput.date, activeInput.time]);

  const liveInput = useMemo(
    () => (rectifySeconds === 0 ? activeInput : shiftBirthInputTime(activeInput, rectifySeconds)),
    [activeInput, rectifySeconds]
  );

  const chart = useMemo(
    () => calculateChart(liveInput, settings),
    [liveInput, settings]
  );

  // Central Navigation Dispatcher
  const navigateTo = (view: string, sub?: string) => {
    setDrawerOpen(false);
    if (view === 'free-pdf' || view === 'booklet' || view === 'pdf') {
      setBookletOpen(true);
      return;
    }
    if (view === 'workstation') {
      setCurrentView('workstation');
      if (sub) {
        const wsIds: WorksheetId[] = [
          'main', 'vargas', 'strengths', 'dashas', 'transits',
          'yogas_research', 'matchmaking', 'ephemeris_panchang', 'custom',
        ];
        if (wsIds.includes(sub as WorksheetId)) {
          setActiveWorksheet(sub as WorksheetId);
        }
      }
      return;
    }

    let target = view;
    if (
      view === 'predictions' ||
      view === 'general-prediction' ||
      view === 'planet-wise-prediction' ||
      view === 'ascendant-wise-prediction' ||
      view === 'house-wise-prediction' ||
      view === 'sambhavit-falkathan' ||
      view === 'falkathan'
    ) {
      target = 'predictions';
      const legacySub = view === 'planet-wise-prediction' || view === 'ascendant-wise-prediction'
        ? 'ascendantWise'
        : view === 'house-wise-prediction'
          ? 'houseWise'
          : 'deep_life';
      setPredictionsSubTab(sub || legacySub);
    } else if (view === 'tools' && sub) {
      target = sub;
    } else if (view === 'kp' || view === 'kp-horoscope') {
      target = 'kp-horoscope';
    } else if (view === 'matching' || view === 'marriage-matching' || view === 'kundali-milan') {
      target = 'marriage-matching';
      if (sub && ['ashtakoota', 'dashakoota', 'dosha-parihara', 'tribala-pooja', 'muhurta', 'synastry-d9'].includes(sub)) {
        setMarriageSubTab(sub as MarriageSubTab);
      }
    } else if (view === 'panchang' || view === 'daily-panchanga' || view === 'daily-panchang') {
      target = 'daily-panchanga';
    } else if (view === 'sambhavit' || view === 'sambhavit-falkathan' || view === 'falkathan' || view === 'general-prediction') {
      target = 'general-prediction';
    } else if (view === 'planet-wise-prediction' || view === 'planets-prediction') {
      target = 'planet-wise-prediction';
    } else if (view === 'house-wise-prediction' || view === 'bhava-wise-prediction') {
      target = 'house-wise-prediction';
    } else if (view === 'vedic' || view === 'vedic-horoscope' || view === 'janam-kundli') {
      target = 'vedic-horoscope';
    } else if (view === 'calculations' || view === 'astrological-calculations') {
      target = 'calculations';
    } else if (view === 'prasna-marga') {
      target = 'prasna-marga';
    } else if (view === 'beeja-kshetra') {
      target = 'beeja-kshetra';
    } else if (view === 'festivals' || view === 'festival-calendar') {
      target = 'festivals';
    } else if (view === 'love-calculator' || view === 'love-percentage') {
      target = 'fortune-calculators';
      setFortuneCalcSubTab('love_calculator');
    } else if (view === 'marriage-calculator' || view === 'marriage-timing') {
      target = 'fortune-calculators';
      setFortuneCalcSubTab('marriage_timing');
    } else if (view === 'partner-initials' || view === 'spouse-initials') {
      target = 'fortune-calculators';
      setFortuneCalcSubTab('partner_initials');
    } else if (view === 'soulmate-calculator' || view === 'karmic-bond') {
      target = 'fortune-calculators';
      setFortuneCalcSubTab('karmic_soul_bond');
    } else if (view === 'ayurdaya-calculator' || view === 'longevity-calculator') {
      target = 'fortune-calculators';
      setFortuneCalcSubTab('ayurdaya_class');
    } else if (view === 'fortune-calculators') {
      target = 'fortune-calculators';
      if (sub) {
        setFortuneCalcSubTab(sub as SpecificCalculatorId);
      }
    }

    setCurrentView(target);
    if (sub) setWorkstationSubTab(sub);
    try {
      if (window.location.hash !== `#${target}`) {
        window.location.hash = target;
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    const applyHash = () => {
      const raw = window.location.hash.replace(/^#\/?/, '').trim();
      if (raw) {
        navigateTo(raw);
      }
    };
    applyHash();
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
  }, []);

  const handleApplyBirth = (updated: BirthInput, saveAsNew: boolean) => {
    if (saveAsNew) {
      setProfiles((prev) => [updated, ...prev]);
      setActiveId(updated.id);
    } else {
      setProfiles((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    }
  };

  const handleDeleteProfile = (targetId?: string) => {
    const idToDelete = targetId ?? activeInput.id;
    const remaining = profiles.filter((p) => p.id !== idToDelete);
    const nextList = remaining.length > 0 ? remaining : [DEFAULT_USER_PROFILE];
    setProfiles(nextList);
    if (activeInput.id === idToDelete || !nextList.some((p) => p.id === activeId)) {
      setActiveId(nextList[0].id);
    }
  };

  return (
    <LanguageProvider lang={language} setLang={setLanguage}>
      <div className={bookletOpen ? 'app-shell has-booklet-open' : 'app-shell'}>
        {/* Unified Single AV Astro Vibe Header across all views & worksheets */}
        <DropdownNavHeader
          currentView={currentView}
          onNavigate={navigateTo}
          activeInput={liveInput}
          profiles={profiles}
          onSelectProfile={(id) => setActiveId(id)}
          onOpenEditor={() => setEditorOpen(true)}
          onNewKundli={() => {
            const newChart = createNowPrashnaInput();
            newChart.id = `kundli-${Date.now()}`;
            newChart.name = language !== 'en' ? 'नवीन जातक' : 'New Native';
            setProfiles((prev) => [newChart, ...prev]);
            setActiveId(newChart.id);
            setEditorOpen(true);
          }}
          onOpenBooklet={() => setBookletOpen(true)}
          onOpenSettings={() => setSettingsOpen(true)}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          settings={settings}
          onChangeChartStyle={(st) => setSettings({ ...settings, chartStyle: st })}
          theme={theme}
          onToggleTheme={() => setTheme((th) => (th === 'light' ? 'dark' : 'light'))}
        />

        {/* Unified Global Pro Control Strip (Live Time Stepper, Ayanamsha, XML I/O & F1-F9 Worksheets) */}
        <AvProControlStrip
          chart={chart}
          activeInput={liveInput}
          settings={settings}
          lang={language}
          currentView={currentView}
          activeWorksheet={activeWorksheet}
          rectifySeconds={rectifySeconds}
          onSelectWorksheet={(ws) => {
            setCurrentView('workstation');
            setActiveWorksheet(ws);
          }}
          onStepBirthSeconds={(sec) => setRectifySeconds((prev) => prev + sec)}
          onResetRectify={() => setRectifySeconds(0)}
          onCommitRectify={() => {
            handleApplyBirth(liveInput, false);
            setRectifySeconds(0);
          }}
          onUpdateSettings={(next) => setSettings(next)}
          onImportXmlChart={(imported) => {
            setProfiles((prev) => [imported, ...prev]);
            setActiveId(imported.id);
            setCurrentView('workstation');
            setActiveWorksheet('main');
          }}
        />

        {/* Mobile Navigation Drawer */}
        <MobileNavDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          currentView={currentView}
          onNavigate={navigateTo}
          activeInput={activeInput}
          profiles={profiles}
          onSelectProfile={(id) => setActiveId(id)}
          onOpenEditor={() => setEditorOpen(true)}
          onNewKundli={() => {
            const newChart = createNowPrashnaInput();
            newChart.id = `kundli-${Date.now()}`;
            newChart.name = language !== 'en' ? 'नवीन जातक' : 'New Native';
            setProfiles((prev) => [newChart, ...prev]);
            setActiveId(newChart.id);
            setEditorOpen(true);
          }}
          onOpenSettings={() => setSettingsOpen(true)}
          onOpenBooklet={() => setBookletOpen(true)}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          settings={settings}
          onChangeChartStyle={(st) => setSettings({ ...settings, chartStyle: st })}
          theme={theme}
          onToggleTheme={() => setTheme((th) => (th === 'light' ? 'dark' : 'light'))}
        />

        {/* View Router Shell */}
        <div className="workspace-shell">
          <main className={currentView === 'workstation' ? 'main-content is-av-desktop' : 'main-content'}>
            <React.Suspense fallback={<ViewLoadingFallback />}>
            {currentView === 'home' && (
              <OnlineJyotishHomePortal
                chart={chart}
                activeInput={activeInput}
                profiles={profiles}
                settings={settings}
                onSelectProfile={(id) => setActiveId(id)}
                onNavigate={navigateTo}
                onOpenEditor={() => setEditorOpen(true)}
                onOpenBooklet={() => setBookletOpen(true)}
                onApplyBirthInput={(input) => handleApplyBirth(input, false)}
              />
            )}

            {currentView === 'vedic-horoscope' && (
              <OnlineJyotishVedicHoroscopeView
                chart={chart}
                activeInput={activeInput}
                settings={settings}
                onChangeChartStyle={(st) => setSettings({ ...settings, chartStyle: st })}
                onApplyBirthInput={(input) => handleApplyBirth(input, false)}
                onOpenBooklet={() => setBookletOpen(true)}
                onNavigate={navigateTo}
              />
            )}

            {currentView === 'calculations' && (
              <CalculationsDossierView
                chart={chart}
                activeInput={activeInput}
                settings={settings}
                onNavigate={navigateTo}
              />
            )}

            {currentView === 'kp-horoscope' && (
              <OnlineJyotishKpView
                chart={chart}
                activeInput={activeInput}
                settings={settings}
                onNavigate={navigateTo}
                onOpenBooklet={() => setBookletOpen(true)}
              />
            )}

            {currentView === 'marriage-matching' && (
              <AdvanceMarriageMatchingView
                settings={settings}
                profiles={profiles}
                activeProfileId={activeId}
                initialSubTab={marriageSubTab}
                onChangeChartStyle={(st) => setSettings({ ...settings, chartStyle: st })}
                onNavigate={navigateTo}
                onSaveProfile={(newProf) => {
                  setProfiles((prev) => [newProf, ...prev]);
                  setActiveId(newProf.id);
                }}
              />
            )}

            {currentView === 'daily-panchanga' && (
              <OnlineJyotishPanchangView
                activeInput={activeInput}
                settings={settings}
                onNavigate={navigateTo}
              />
            )}

            {currentView === 'predictions' && (
              <PredictionsView
                chart={chart}
                chartStyle={settings.chartStyle}
                activeSubTab={predictionsSubTab}
                onSelectSubTab={setPredictionsSubTab}
              />
            )}

            {(currentView === 'dossier' || currentView === 'life-dossier') && (
              <LifeDossierView
                chart={chart}
                chartStyle={settings.chartStyle}
                onChangeChartStyle={(st) => setSettings({ ...settings, chartStyle: st })}
                onOpenMatchMaking={() => navigateTo('marriage-matching')}
                onOpenBooklet={() => setBookletOpen(true)}
                onOpenEditor={() => setEditorOpen(true)}
              />
            )}

            {currentView === 'festivals' && (
              <OnlineJyotishFestivalsView
                onNavigate={navigateTo}
              />
            )}

            {(['ashtakavarga', 'shadbala', 'transit-today', 'baby-names', 'gemstones', 'choghadiya'] as const).includes(currentView as any) && (
              <OnlineJyotishToolsView
                tool={currentView as AstroToolCategory}
                chart={chart}
                activeInput={activeInput}
                settings={settings}
                onNavigate={navigateTo}
                onOpenBooklet={() => setBookletOpen(true)}
              />
            )}

            {currentView === 'sade-sati' && (
              <SadeSatiView
                chart={chart}
              />
            )}

            {currentView === 'jaimini' && (
              <JaiminiView
                chart={chart}
                activeInput={activeInput}
                settings={settings}
                onNavigate={navigateTo}
                onOpenBooklet={() => setBookletOpen(true)}
              />
            )}

            {currentView === 'varshaphala' && (
              <VarshaphalaView
                chart={chart}
                onNavigate={navigateTo}
              />
            )}

            {currentView === 'kp-enterprise' && (
              <KPEnterpriseView
                chart={chart}
                initialTab="fourfold"
              />
            )}

            {currentView === 'medical-astrology' && (
              <MedicalAstrologyView
                chart={chart}
              />
            )}

            {currentView === 'prasna-marga' && (
              <PrasnaMargaWorkstationPanel
                chart={chart}
                initialSubTab="badhaka"
              />
            )}

            {currentView === 'beeja-kshetra' && (
              <PrasnaMargaWorkstationPanel
                chart={chart}
                initialSubTab="progeny"
              />
            )}

            {(currentView === 'synastry' || currentView === 'btr') && (
              <SynastryBTRView
                chart={chart}
                profiles={profiles}
                settings={settings}
                initialTab={currentView === 'btr' ? 'btr' : 'synastry'}
                onOpenEditor={() => setEditorOpen(true)}
                onNewKundli={() => {
                  const newChart = createNowPrashnaInput();
                  newChart.id = `kundli-${Date.now()}`;
                  newChart.name = language !== 'en' ? 'नवीन जातक' : 'New Native';
                  setProfiles((prev) => [newChart, ...prev]);
                  setActiveId(newChart.id);
                  setEditorOpen(true);
                }}
                onSelectProfile={(id) => setActiveId(id)}
              />
            )}

            {(currentView === 'muhurta' || currentView === 'prashna' || currentView === 'nadi') && (
              <MuhurtaPrashnaView
                chart={chart}
                initialTab={currentView as 'muhurta' | 'prashna' | 'nadi'}
              />
            )}

            {(currentView === 'holistic-remedies' || currentView === 'remedies') && (
              <HolisticRemediesView
                chart={chart}
                settings={settings}
                onNavigate={navigateTo}
                onOpenBooklet={() => setBookletOpen(true)}
              />
            )}

            {(currentView === 'dual-transit' || currentView === 'transit-wheel') && (
              <DualTransitWheelView
                chart={chart}
                settings={settings}
                onNavigate={navigateTo}
              />
            )}

            {currentView === 'sarvatobhadra' && (
              <SarvatobhadraChakraView
                chart={chart}
                onNavigate={navigateTo}
              />
            )}

            {currentView === 'lal-kitab' && (
              <LalKitabView
                chart={chart}
                onNavigate={navigateTo}
              />
            )}

            {(currentView === 'split-studio' || currentView === 'multi-chart') && (
              <SplitStudioWorkstationView
                chart={chart}
                settings={settings}
                onChangeChartStyle={(st) => setSettings({ ...settings, chartStyle: st })}
                onNavigate={navigateTo}
                onOpenBooklet={() => setBookletOpen(true)}
              />
            )}

            {currentView === 'multi-dasha' && (
              <MultiDashaMatrixView
                chart={chart}
                settings={settings}
                onNavigate={navigateTo}
              />
            )}

            {currentView === 'sudarshana' && (
              <SudarshanaChakraView
                chart={chart}
                settings={settings}
                onNavigate={navigateTo}
              />
            )}

            {currentView === 'client-diary' && (
              <ClientConsultationDiaryView
                chart={chart}
                activeInput={activeInput}
                onNavigate={navigateTo}
              />
            )}

            {currentView === 'transit-calendar' && (
              <TransitCalendar365View
                chart={chart}
                onNavigate={navigateTo}
              />
            )}

            {currentView === 'financial-astrology' && (
              <FinancialAstrologyView
                chart={chart}
                onNavigate={navigateTo}
              />
            )}

            {currentView === 'samudrika-shastra' && (
              <SamudrikaShastraView
                chart={chart}
                onNavigate={navigateTo}
              />
            )}

            {currentView === 'astrocartography' && (
              <AstrocartographyView
                chart={chart}
                onNavigate={navigateTo}
              />
            )}

            {currentView === 'celebrity-twins' && (
              <CelebrityTwinView
                chart={chart}
                onNavigate={navigateTo}
              />
            )}

            {currentView === 'human-design' && (
              <HumanDesignView
                chart={chart}
                onNavigate={navigateTo}
              />
            )}

            {currentView === 'western-astrology' && (
              <WesternAstrologyView
                chart={chart}
              />
            )}

            {currentView === 'life-event-timing' && (
              <LifeEventTimingView
                chart={chart}
                onNavigate={navigateTo}
              />
            )}

            {currentView === 'classical-doshas' && (
              <ClassicalDoshasView
                chart={chart}
                onNavigate={navigateTo}
              />
            )}

            {currentView === 'dasha-matrix-81' && (
              <DashaMatrix81View
                chart={chart}
                onNavigate={navigateTo}
              />
            )}

            {currentView === 'kota-ayurdaya' && (
              <KotaAndAyurdayaView
                chart={chart}
                onNavigate={navigateTo}
              />
            )}

            {currentView === 'fortune-calculators' && (
              <FortuneCalculatorsView
                chart={chart}
                profiles={profiles}
                onSaveProfile={(newProf) => {
                  setProfiles((prev) => [newProf, ...prev]);
                  setActiveId(newProf.id);
                }}
                onNavigate={navigateTo}
                initialTab={fortuneCalcSubTab}
              />
            )}

            {currentView === 'interactive-palmistry' && (
              <InteractivePalmistryView
                chart={chart}
                onNavigate={navigateTo}
              />
            )}

            {currentView === 'numerology' && (
              <NumerologyView
                chart={chart}
                onNavigate={navigateTo}
              />
            )}

            {(currentView === 'rashifal' || currentView === 'astro_tools') && (
              <AstroSageToolsView
                chart={chart}
                requestedMode={{ id: 'rashifal', nonce: Date.now() }}
              />
            )}

            {(currentView === 'parashara-workstation' || currentView === 'software-suite') && (
              <ParasharaKalaWorkstationPanel
                natalChart={chart}
                onLoadBenchmarkChart={(bInput) => {
                  setProfiles((prev) => {
                    const exists = prev.find((p) => p.id === bInput.id);
                    if (exists) return prev;
                    return [bInput, ...prev];
                  });
                  setActiveId(bInput.id);
                }}
              />
            )}


            {currentView === 'workstation' && (
              <AvAstroVibeWorkstation
                chart={chart}
                profiles={profiles}
                settings={settings}
                lang={language}
                activeWorksheet={activeWorksheet}
                onSelectWorksheet={setActiveWorksheet}
                onAddAndLoadProfile={(input) => {
                  setProfiles((prev) => (prev.some((p) => p.id === input.id) ? prev : [input, ...prev]));
                  setActiveId(input.id);
                }}
              />
            )}
            </React.Suspense>
          </main>
        </div>

        {/* Mobile Bottom Navigation Bar */}
        <MobileBottomNav
          currentView={currentView}
          onNavigate={navigateTo}
          onOpenDrawer={() => setDrawerOpen(true)}
        />

        {/* Modals */}
        <React.Suspense fallback={null}>
          {editorOpen && (
            <BirthEditorModal
              open={editorOpen}
              initial={activeInput}
              profiles={profiles}
              onClose={() => setEditorOpen(false)}
              onApply={handleApplyBirth}
              onSelectProfile={(id) => setActiveId(id)}
              onDeleteProfile={(id) => handleDeleteProfile(id)}
            />
          )}

          {settingsOpen && (
            <SettingsModal
              open={settingsOpen}
              onClose={() => setSettingsOpen(false)}
              settings={settings}
              onChange={setSettings}
            />
          )}

          {bookletOpen && (
            <KundaliBookletModal
              open={bookletOpen}
              onClose={() => setBookletOpen(false)}
              chart={chart}
              chartStyle={settings.chartStyle}
              language={language}
            />
          )}
        </React.Suspense>

        {/* Global Command Palette & Quick Search Modal (Ctrl + K) */}
        <GlobalCommandPaletteModal
          isOpen={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)}
          onNavigate={(targetView, subTab) => {
            navigateTo(targetView, subTab);
          }}
        />
      </div>
    </LanguageProvider>
  );
}
