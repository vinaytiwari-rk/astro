import React, { useEffect, useMemo, useState } from 'react';
import { calculateChart } from './astro/calculator';
import type { BirthInput, CalcSettings, ChartStyle } from './astro/types';
import { BirthEditorModal } from './components/BirthEditorModal';
import { KundaliBookletModal } from './components/KundaliBookletModal';
import { SettingsModal } from './components/SettingsModal';
import { OnlineJyotishHomePortal } from './components/OnlineJyotishHomePortal';
import { OnlineJyotishVedicHoroscopeView } from './components/onlinejyotish/OnlineJyotishVedicHoroscopeView';
import { OnlineJyotishKpView } from './components/onlinejyotish/OnlineJyotishKpView';
import { OnlineJyotishMatchingView } from './components/onlinejyotish/OnlineJyotishMatchingView';
import { OnlineJyotishPanchangView } from './components/onlinejyotish/OnlineJyotishPanchangView';
import { OnlineJyotishSambhavitView } from './components/onlinejyotish/OnlineJyotishSambhavitView';
import { OnlineJyotishFestivalsView } from './components/onlinejyotish/OnlineJyotishFestivalsView';
import { OnlineJyotishToolsView, type AstroToolCategory } from './components/onlinejyotish/OnlineJyotishToolsView';
import SadeSatiView from './components/onlinejyotish/SadeSatiView';
import { JaiminiView } from './components/onlinejyotish/JaiminiView';
import { KPEnterpriseView } from './components/onlinejyotish/KPEnterpriseView';
import { MedicalAstrologyView } from './components/onlinejyotish/MedicalAstrologyView';
import { SynastryBTRView } from './components/onlinejyotish/SynastryBTRView';
import { MuhurtaPrashnaView } from './components/onlinejyotish/MuhurtaPrashnaView';
import { HolisticRemediesView } from './components/onlinejyotish/HolisticRemediesView';
import { DualTransitWheelView } from './components/onlinejyotish/DualTransitWheelView';
import { SarvatobhadraChakraView } from './components/onlinejyotish/SarvatobhadraChakraView';
import { LalKitabView } from './components/onlinejyotish/LalKitabView';
import { SplitStudioWorkstationView } from './components/onlinejyotish/SplitStudioWorkstationView';
import { MultiDashaMatrixView } from './components/onlinejyotish/MultiDashaMatrixView';
import { SudarshanaChakraView } from './components/onlinejyotish/SudarshanaChakraView';
import { ClientConsultationDiaryView } from './components/onlinejyotish/ClientConsultationDiaryView';
import { TransitCalendar365View } from './components/onlinejyotish/TransitCalendar365View';
import { FinancialAstrologyView } from './components/onlinejyotish/FinancialAstrologyView';
import { SamudrikaShastraView } from './components/onlinejyotish/SamudrikaShastraView';
import { AstrocartographyView } from './components/onlinejyotish/AstrocartographyView';
import { CelebrityTwinView } from './components/onlinejyotish/CelebrityTwinView';
import { HumanDesignView } from './components/onlinejyotish/HumanDesignView';
import { VarshaphalaView } from './components/onlinejyotish/VarshaphalaView';
import { WesternAstrologyView } from './components/WesternAstrologyView';
import { LifeDossierView } from './components/LifeDossierView';
import { LifeEventTimingView } from './components/predictions/LifeEventTimingView';
import { ClassicalDoshasView } from './components/predictions/ClassicalDoshasView';
import { DashaMatrix81View } from './components/predictions/DashaMatrix81View';
import { KotaAndAyurdayaView } from './components/predictions/KotaAndAyurdayaView';
import { VedicMasterWorkstation } from './components/VedicMasterWorkstation';
import { DropdownNavHeader } from './components/layout/DropdownNavHeader';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { MobileNavDrawer } from './components/layout/MobileNavDrawer';
import {
  createNowPrashnaInput,
  DEFAULT_SETTINGS,
} from './data/cities';
import { LanguageProvider } from './i18n/LanguageContext';

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

  // Current Active View in AV Astro Vibe
  const [currentView, setCurrentView] = useState<string>('home');
  const [workstationSubTab, setWorkstationSubTab] = useState<string>('1');

  const [language, setLanguage] = useState<'en' | 'hi'>(() => {
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

  useEffect(() => {
    const onOpenBooklet = () => setBookletOpen(true);
    window.addEventListener('jyotish:open-booklet', onOpenBooklet);
    return () => window.removeEventListener('jyotish:open-booklet', onOpenBooklet);
  }, []);

  const activeInput = useMemo(
    () => profiles.find((p) => p.id === activeId) || profiles[0],
    [profiles, activeId]
  );

  const chart = useMemo(
    () => calculateChart(activeInput, settings),
    [activeInput, settings]
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
      if (sub) setWorkstationSubTab(sub);
      return;
    }

    let target = view;
    if (view === 'tools' && sub) {
      target = sub;
    } else if (view === 'kp' || view === 'kp-horoscope') {
      target = 'kp-horoscope';
    } else if (view === 'matching' || view === 'marriage-matching') {
      target = 'marriage-matching';
    } else if (view === 'panchang' || view === 'daily-panchanga' || view === 'daily-panchang') {
      target = 'daily-panchanga';
    } else if (view === 'sambhavit' || view === 'sambhavit-falkathan' || view === 'falkathan') {
      target = 'sambhavit-falkathan';
    } else if (view === 'vedic' || view === 'vedic-horoscope' || view === 'janam-kundli') {
      target = 'vedic-horoscope';
    } else if (view === 'festivals' || view === 'festival-calendar') {
      target = 'festivals';
    }

    setCurrentView(target);
    if (sub) setWorkstationSubTab(sub);
  };

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
      <div className="app-shell">
        {/* AV Astro Vibe Navigation Header */}
        <DropdownNavHeader
          currentView={currentView}
          onNavigate={navigateTo}
          activeInput={activeInput}
          profiles={profiles}
          onSelectProfile={(id) => setActiveId(id)}
          onOpenEditor={() => setEditorOpen(true)}
          onNewKundli={() => {
            const newChart = createNowPrashnaInput();
            newChart.id = `kundli-${Date.now()}`;
            newChart.name = language === 'hi' ? 'नवीन जातक' : 'New Native';
            setProfiles((prev) => [newChart, ...prev]);
            setActiveId(newChart.id);
            setEditorOpen(true);
          }}
          onOpenBooklet={() => setBookletOpen(true)}
          onOpenSettings={() => setSettingsOpen(true)}
          onOpenDrawer={() => setDrawerOpen(true)}
          settings={settings}
          onChangeChartStyle={(st) => setSettings({ ...settings, chartStyle: st })}
          theme={theme}
          onToggleTheme={() => setTheme((th) => (th === 'light' ? 'dark' : 'light'))}
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
            newChart.name = language === 'hi' ? 'नवीन जातक' : 'New Native';
            setProfiles((prev) => [newChart, ...prev]);
            setActiveId(newChart.id);
            setEditorOpen(true);
          }}
          onOpenSettings={() => setSettingsOpen(true)}
          onOpenBooklet={() => setBookletOpen(true)}
          settings={settings}
          onChangeChartStyle={(st) => setSettings({ ...settings, chartStyle: st })}
          theme={theme}
          onToggleTheme={() => setTheme((th) => (th === 'light' ? 'dark' : 'light'))}
        />

        {/* View Router Shell */}
        <div className="workspace-shell">
          <main className="main-content">
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
              <OnlineJyotishMatchingView
                settings={settings}
                onChangeChartStyle={(st) => setSettings({ ...settings, chartStyle: st })}
                onNavigate={navigateTo}
              />
            )}

            {currentView === 'daily-panchanga' && (
              <OnlineJyotishPanchangView
                activeInput={activeInput}
                settings={settings}
                onNavigate={navigateTo}
              />
            )}

            {currentView === 'sambhavit-falkathan' && (
              <OnlineJyotishSambhavitView
                chart={chart}
                activeInput={activeInput}
                settings={settings}
                onNavigate={navigateTo}
                onOpenBooklet={() => setBookletOpen(true)}
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
                  newChart.name = language === 'hi' ? 'नवीन जातक' : 'New Native';
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

            {currentView === 'workstation' && (
              <VedicMasterWorkstation
                chart={chart}
                chartStyle={settings.chartStyle}
                onChangeChartStyle={(st) => setSettings({ ...settings, chartStyle: st })}
                settings={settings}
                profiles={profiles}
                activeProfileId={activeInput.id}
                onSelectProfile={(id) => setActiveId(id)}
                onOpenEditor={() => setEditorOpen(true)}
                onOpenBooklet={() => setBookletOpen(true)}
                onOpenMatchMaking={() => navigateTo('marriage-matching')}
                requestedMenu={{ id: workstationSubTab, nonce: 0 }}
              />
            )}
          </main>
        </div>

        {/* Mobile Bottom Navigation Bar */}
        <MobileBottomNav
          currentView={currentView}
          onNavigate={navigateTo}
          onOpenDrawer={() => setDrawerOpen(true)}
        />

        {/* Modals */}
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
      </div>
    </LanguageProvider>
  );
}
