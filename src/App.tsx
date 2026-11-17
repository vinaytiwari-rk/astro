import React, { useEffect, useMemo, useRef, useState } from 'react';
import { calculateChart } from './astro/calculator';
import type { BirthInput, CalcSettings, ChartStyle } from './astro/types';
import { BirthEditorModal } from './components/BirthEditorModal';
import { KundaliBookletModal } from './components/KundaliBookletModal';
import { SettingsModal } from './components/SettingsModal';
import { OnlineJyotishHomePortal } from './components/OnlineJyotishHomePortal';
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

  // Master Navigation State - Home Portal or Vedic Workstation Divisions 1 to 12
  const [activeTab, setActiveTab] = useState<MainTab>('home');
  const [activeSubTab, setActiveSubTab] = useState<string>('1');
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

  // Central Navigation Dispatcher - OnlineJyotish Portal or Workstation Divisions 1 to 12
  const navigateTo = (tab: MainTab | string, subTab?: string, nested?: string) => {
    if (tab === 'home' || tab === 'portal') {
      setActiveTab('home');
      setDrawerOpen(false);
      return;
    }

    let target = subTab || tab;
    if (target === 'home' || target === 'portal') {
      setActiveTab('home');
      setDrawerOpen(false);
      return;
    }

    // Check if target is already a division number 1..12
    const targetNum = parseInt(target, 10);
    if (!isNaN(targetNum) && targetNum >= 1 && targetNum <= 12) {
      target = String(targetNum);
    } else if (
      target === 'overview' ||
      target === 'basics' ||
      target === 'sarini' ||
      target === 'div_1_basics'
    ) {
      target = '1';
    } else if (
      target === 'core_charts' ||
      target === 'd1' ||
      target === 'chalit' ||
      target === 'chandra' ||
      target === 'calculations' ||
      target === 'div_2_core_charts'
    ) {
      target = '2';
    } else if (
      target === 'vargas' ||
      target === 'all_kundalis' ||
      target === 'all_vargas' ||
      target === 'd9' ||
      target === 'd60' ||
      target === 'upagrahas' ||
      target === 'div_3_all_vargas_sensitive'
    ) {
      target = '3';
    } else if (
      target === 'strength' ||
      target === 'shadbala' ||
      target === 'sav' ||
      target === 'bav' ||
      target === 'grahbala' ||
      target === 'div_4_strengths_balas'
    ) {
      target = '4';
    } else if (
      target === 'chakras' ||
      target === 'sudarshan' ||
      target === 'sarvatobhadra' ||
      target === 'kota' ||
      target === 'kurma' ||
      target === 'tables' ||
      target === 'div_5_special_chakras_tables'
    ) {
      target = '5';
    } else if (
      target === 'dasha' ||
      target === 'dasha_transits' ||
      target === 'vimshottari' ||
      target === 'tribhagi' ||
      target === 'yogini' ||
      target === 'char' ||
      target === 'div_6_all_dashas'
    ) {
      target = '6';
    } else if (
      target === 'gochar' ||
      target === 'transits' ||
      target === 'live_transits' ||
      target === 'sade_sati' ||
      target === 'div_7_gochar_transits'
    ) {
      target = '7';
    } else if (
      target === 'predictions' ||
      target === 'dossier' ||
      target === 'remedies' ||
      target === 'doshas' ||
      target === 'yuti' ||
      target === 'house_wise' ||
      target === 'planet_wise' ||
      target === 'bhavesha' ||
      target === 'bhavat_bhavam' ||
      target === 'div_8_deep_predictions_remedies'
    ) {
      target = '8';
    } else if (
      target === 'kp_system' ||
      target === 'kp' ||
      target === 'lal_kitab' ||
      target === 'western' ||
      target === 'nadi' ||
      target === 'branches' ||
      target === 'div_9_multi_system_astrology'
    ) {
      target = '9';
    } else if (
      target === 'match' ||
      target === 'matchmaking' ||
      target === 'ashtakoota' ||
      target === 'marriage' ||
      target === 'div_10_marriage_matching'
    ) {
      target = '10';
    } else if (
      target === 'tools' ||
      target === 'panchang' ||
      target === 'panchang_muhurta' ||
      target === 'daily_panchang' ||
      target === 'rashifal' ||
      target === 'festivals' ||
      target === 'choghadiya' ||
      target === 'muhurta' ||
      target === 'div_11_panchang_rashifal'
    ) {
      target = '11';
    } else if (
      target === 'sambhavit_falkathan' ||
      target === 'falkathan' ||
      target === 'probable_predictions' ||
      target === 'falan' ||
      target === 'div_12_sambhavit_falkathan'
    ) {
      target = '12';
    }

    setActiveTab('workstation');
    setActiveSubTab(target);
    setDrawerOpen(false);
    setRouteRequest((prev) => ({
      tab: 'workstation',
      subTab: target,
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

        {/* Full-Width Workspace Shell - OnlineJyotish Portal or 12-Division Workstation */}
        <div className="workspace-shell">
          <main className="main-content">
            {activeTab === 'home' ? (
              <OnlineJyotishHomePortal
                chart={chart}
                activeInput={activeInput}
                profiles={profiles}
                settings={settings}
                onSelectProfile={(id) => setActiveId(id)}
                onNavigateToDivision={(divNum) => {
                  navigateTo('workstation', String(divNum));
                }}
                onOpenEditor={() => setEditorOpen(true)}
                onOpenBooklet={() => setBookletOpen(true)}
                onApplyBirthInput={(input) => handleApplyBirth(input, false)}
              />
            ) : (
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
            )}
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
