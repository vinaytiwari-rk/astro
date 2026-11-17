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
import { VedicMasterWorkstation } from './components/VedicMasterWorkstation';
import { DropdownNavHeader } from './components/layout/DropdownNavHeader';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { MobileNavDrawer } from './components/layout/MobileNavDrawer';
import {
  createNowPrashnaInput,
  DEFAULT_SETTINGS,
  SAMPLE_CHARTS,
} from './data/cities';
import { LanguageProvider } from './i18n/LanguageContext';

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
    if (profiles.length <= 1) return;
    const idToDelete = targetId ?? activeInput.id;
    const remaining = profiles.filter((p) => p.id !== idToDelete);
    if (remaining.length === 0) return;
    setProfiles(remaining);
    if (activeInput.id === idToDelete || !remaining.some((p) => p.id === activeId)) {
      setActiveId(remaining[0].id);
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

            {(currentView === 'kp-enterprise' || currentView === 'varshaphala') && (
              <KPEnterpriseView
                chart={chart}
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
                initialTab={currentView === 'btr' ? 'btr' : 'synastry'}
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
