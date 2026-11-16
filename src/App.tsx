import React, { useEffect, useMemo, useRef, useState } from 'react';
import { calculateChart } from './astro/calculator';
import type { BirthInput, CalcSettings, ChartStyle } from './astro/types';
import { BirthEditorModal } from './components/BirthEditorModal';
import { KundaliBookletModal } from './components/KundaliBookletModal';
import { SettingsModal } from './components/SettingsModal';
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

  // Master Navigation State - Exclusively Vedic Master Workstation
  const [activeTab, setActiveTab] = useState<MainTab>('workstation');
  const [activeSubTab, setActiveSubTab] = useState<string>('sarini');
  const [routeRequest, setRouteRequest] = useState<RouteRequest | null>(null);

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

  // Central Navigation Dispatcher - All routes map to Vedic Workstation Menus
  const navigateTo = (tab: MainTab | string, subTab?: string, nested?: string) => {
    let targetMenu = subTab || tab;

    // Normalize legacy tabs to corresponding workstation menus
    if (
      targetMenu === 'home' ||
      targetMenu === 'overview' ||
      targetMenu === 'basics' ||
      targetMenu === 'sarini'
    ) {
      targetMenu = 'sarini';
    } else if (
      targetMenu === 'kundli' ||
      targetMenu === 'vargas' ||
      targetMenu === 'strength' ||
      targetMenu === 'ashtakavarga' ||
      targetMenu === 'charts' ||
      targetMenu === 'charts_tables'
    ) {
      targetMenu = 'charts_tables';
    } else if (
      targetMenu === 'dasha' ||
      targetMenu === 'dasha_transits' ||
      targetMenu === 'transits' ||
      targetMenu === 'live_transits' ||
      targetMenu === 'vimshottari' ||
      targetMenu === 'yogini'
    ) {
      targetMenu = 'dasha';
    } else if (targetMenu === 'varshphal' || targetMenu === 'varshaphala') {
      targetMenu = 'varshphal';
    } else if (
      targetMenu === 'chakras' ||
      targetMenu === 'sudarshan' ||
      targetMenu === 'sarvatobhadra' ||
      targetMenu === 'kota' ||
      targetMenu === 'kurma'
    ) {
      targetMenu = 'chakras';
    } else if (targetMenu === 'yogas' || targetMenu === 'doshas' || targetMenu === 'yogas_doshas') {
      targetMenu = 'yogas_doshas';
    } else if (targetMenu === 'navamsha' || targetMenu === 'd9') {
      targetMenu = 'navamsha';
    } else if (targetMenu === 'kp' || targetMenu === 'kp_system' || targetMenu === 'branches') {
      targetMenu = 'kp_system';
    } else if (targetMenu === 'lal_kitab') {
      targetMenu = 'lal_kitab';
    } else if (
      targetMenu === 'predictions' ||
      targetMenu === 'dossier' ||
      targetMenu === 'twelve_planets'
    ) {
      targetMenu = 'predictions';
    } else if (targetMenu === 'past_future' || targetMenu === 'd60') {
      targetMenu = 'past_future';
    } else if (targetMenu === 'match' || targetMenu === 'matchmaking' || targetMenu === 'ashtakoota') {
      targetMenu = 'matchmaking';
    } else if (
      targetMenu === 'remedies' ||
      targetMenu === 'doshas_remedies' ||
      targetMenu === 'gems'
    ) {
      targetMenu = 'remedies';
    } else if (
      targetMenu === 'tools' ||
      targetMenu === 'panchang' ||
      targetMenu === 'panchang_muhurta' ||
      targetMenu === 'daily_panchang'
    ) {
      targetMenu = 'panchang';
    }

    setActiveTab('workstation');
    setActiveSubTab(targetMenu);
    setDrawerOpen(false);
    setRouteRequest((prev) => ({
      tab: 'workstation',
      subTab: targetMenu,
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
        {/* Modern Unified Dropdown-First Header (Compatible with Web & Phone) */}
        <DropdownNavHeader
          activeTab={activeTab}
          activeSubTab={activeSubTab}
          onSelectPrimaryTab={(tab) => navigateTo(tab)}
          onSelectSubTab={(sub) => {
            setActiveSubTab(sub);
            setRouteRequest((prev) => ({
              tab: 'workstation',
              subTab: sub,
              nonce: (prev?.nonce ?? 0) + 1,
            }));
          }}
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
          activeTab={activeTab}
          onNavigate={(tab, sub) => navigateTo(tab, sub)}
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

        {/* Full-Width Workspace Shell - EXCLUSIVELY VEDIC MASTER WORKSTATION */}
        <div className="workspace-shell">
          <main className="main-content">
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
              onOpenMatchMaking={() => navigateTo('workstation', 'matchmaking')}
              requestedMenu={{ id: activeSubTab, nonce: routeRequest?.nonce ?? 0 }}
            />
          </main>
        </div>

        {/* Mobile Bottom Navigation Bar (Fixed 5 Thumb Actions) */}
        <MobileBottomNav
          activeTab={activeTab}
          activeSubTab={activeSubTab}
          onNavigate={(tab, sub) => navigateTo(tab, sub)}
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
