import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import { PrashnaView } from './components/PrashnaView';
import { PredictionsView } from './components/PredictionsView';
import { SettingsModal } from './components/SettingsModal';
import { SpecializedAstrologyView } from './components/SpecializedAstrologyView';
import { StrengthYogasView } from './components/StrengthYogasView';
import { ToolsSuiteView } from './components/ToolsSuiteView';
import { TransitsView } from './components/TransitsView';
import { VargasView } from './components/VargasView';
import { WesternAstrologyView } from './components/WesternAstrologyView';
import { DropdownNavHeader } from './components/layout/DropdownNavHeader';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { MobileNavDrawer } from './components/layout/MobileNavDrawer';
import {
  createNowPrashnaInput,
  DEFAULT_SETTINGS,
  SAMPLE_CHARTS,
} from './data/cities';
import { LanguageProvider } from './i18n/LanguageContext';
import { UI_TEXT, type AppLanguage } from './i18n/translations';
import type { MainTab, RouteRequest } from './nav';

const STORAGE_PROFILES_KEY = 'jyotish_hora_profiles_v1';
const STORAGE_ACTIVE_KEY = 'jyotish_hora_active_v1';
const STORAGE_SETTINGS_KEY = 'jyotish_hora_settings_v1';
const STORAGE_THEME_KEY = 'jyotish_hora_theme_v1';
const STORAGE_LANG_KEY = 'jyotish_hora_lang_v1';
const STORAGE_PERSONA_KEY = 'jyotish_hora_persona_v1';

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

  // Master Navigation States
  const [activeTab, setActiveTab] = useState<MainTab>('home');
  const [activeSubTab, setActiveSubTab] = useState<string>('overview');
  const [personaMode, setPersonaMode] = useState<'professional' | 'learner' | 'simple'>(() => {
    const p = localStorage.getItem(STORAGE_PERSONA_KEY);
    return p === 'simple' || p === 'learner' ? p : 'professional';
  });

  const [routeRequest, setRouteRequest] = useState<RouteRequest | null>(null);
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
      localStorage.setItem(STORAGE_PERSONA_KEY, personaMode);
    } catch {
      // ignore
    }
  }, [personaMode]);

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
  const navigateTo = (tab: MainTab, subTab?: string, nested?: string) => {
    // Normalize aliases
    let targetTab: MainTab = tab;
    let targetSub = subTab;

    if (tab === 'basics') {
      targetTab = 'kundli';
      targetSub = subTab === 'basic_details' ? 'overview' : 'charts';
    } else if (tab === 'vargas') {
      targetTab = 'kundli';
      targetSub = 'vargas';
    } else if (tab === 'strength') {
      targetTab = 'kundli';
      targetSub = 'strength';
    } else if (tab === 'ashtakavarga') {
      targetTab = 'kundli';
      targetSub = 'ashtakavarga';
    } else if (tab === 'dasha') {
      targetTab = 'dasha_transits';
      targetSub = subTab || 'vimshottari';
    } else if (tab === 'transits') {
      targetTab = 'dasha_transits';
      targetSub = 'live_transits';
    } else if (tab === 'match') {
      targetTab = 'matchmaking';
      targetSub = subTab || 'ashtakoota';
    } else if (tab === 'tools') {
      targetTab = 'panchang_muhurta';
      targetSub = subTab || 'daily_panchang';
    } else if (tab === 'astro_tools') {
      targetTab = 'branches';
      targetSub = subTab || 'numerology';
    }

    setActiveTab(targetTab);
    if (targetSub) {
      setActiveSubTab(targetSub);
    } else {
      // Pick sensible defaults
      if (targetTab === 'kundli') setActiveSubTab('overview');
      else if (targetTab === 'predictions') setActiveSubTab('deep_life');
      else if (targetTab === 'dasha_transits') setActiveSubTab('vimshottari');
      else if (targetTab === 'branches') setActiveSubTab('kp_4step');
      else if (targetTab === 'western') setActiveSubTab('wheel_chart');
      else if (targetTab === 'matchmaking') setActiveSubTab('ashtakoota');
      else if (targetTab === 'panchang_muhurta') setActiveSubTab('daily_panchang');
      else if (targetTab === 'patrika_booklet') setActiveSubTab('full_edition');
    }

    setDrawerOpen(false);
    setRouteRequest((prev) => ({
      tab: targetTab,
      subTab: targetSub,
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
    navigateTo('kundli', 'overview');
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
    navigateTo('matchmaking', 'ashtakoota');
  };

  const handleNewPrashna = () => {
    const prashna = createNowPrashnaInput();
    prashna.id = `prashna-${Date.now()}`;
    setProfiles((prev) => [prashna, ...prev]);
    setActiveId(prashna.id);
    navigateTo('branches', 'kp_4step');
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

  const handleApplyRectifiedTime = (newDate: string, newTime: string) => {
    setProfiles((prev) =>
      prev.map((p) => (p.id === activeInput.id ? { ...p, date: newDate, time: newTime } : p))
    );
  };

  // Resolve normalized primary tab for conditional main content rendering
  const normalizedPrimaryTab = useMemo((): MainTab => {
    switch (activeTab) {
      case 'basics':
      case 'vargas':
      case 'strength':
      case 'ashtakavarga':
        return 'kundli';
      case 'dasha':
      case 'transits':
        return 'dasha_transits';
      case 'branches':
      case 'astro_tools':
      case 'prashna':
      case 'hub':
        return 'branches';
      case 'match':
        return 'matchmaking';
      case 'tools':
        return 'panchang_muhurta';
      default:
        return activeTab;
    }
  }, [activeTab]);

  return (
    <LanguageProvider lang={language} setLang={setLanguage}>
      <div className="app-shell">
        {/* Modern Unified Dropdown-First Header (Compatible with Web & Phone) */}
        <DropdownNavHeader
          activeTab={normalizedPrimaryTab}
          activeSubTab={activeSubTab}
          onSelectPrimaryTab={(tab) => navigateTo(tab)}
          onSelectSubTab={(sub) => {
            setActiveSubTab(sub);
            setRouteRequest((prev) => ({
              tab: normalizedPrimaryTab,
              subTab: sub,
              nonce: (prev?.nonce ?? 0) + 1,
            }));
          }}
          personaMode={personaMode}
          onSelectPersonaMode={setPersonaMode}
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
          activeTab={normalizedPrimaryTab}
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

        {/* Full-Width Workspace Shell */}
        <div className="workspace-shell">
          <main className="main-content">
            {/* 1. Home Dashboard */}
            {normalizedPrimaryTab === 'home' && (
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

            {/* 2. Vedic Kundli & Core Charts */}
            {normalizedPrimaryTab === 'kundli' && (
              <>
                {activeSubTab === 'overview' && (
                  <BasicsView
                    chart={chart}
                    chartStyle={settings.chartStyle}
                    requestedSubTab={{ id: 'basic_details', nonce: routeRequest?.nonce ?? 0 }}
                    onNavigate={navigateTo}
                    onOpenBooklet={() => setBookletOpen(true)}
                  />
                )}
                {activeSubTab === 'charts' && (
                  <BasicsView
                    chart={chart}
                    chartStyle={settings.chartStyle}
                    requestedSubTab={{ id: 'planets', nonce: routeRequest?.nonce ?? 0 }}
                    onNavigate={navigateTo}
                    onOpenBooklet={() => setBookletOpen(true)}
                  />
                )}
                {activeSubTab === 'planets' && (
                  <BasicsView
                    chart={chart}
                    chartStyle={settings.chartStyle}
                    requestedSubTab={{ id: 'planets', nonce: routeRequest?.nonce ?? 0 }}
                    onNavigate={navigateTo}
                    onOpenBooklet={() => setBookletOpen(true)}
                  />
                )}
                {activeSubTab === 'vargas' && (
                  <VargasView
                    chart={chart}
                    chartStyle={settings.chartStyle}
                    requestedVarga={{ id: 'D108', nonce: routeRequest?.nonce ?? 0 }}
                  />
                )}
                {activeSubTab === 'strength' && (
                  <StrengthYogasView chart={chart} />
                )}
                {activeSubTab === 'ashtakavarga' && (
                  <AshtakavargaView
                    chart={chart}
                    chartStyle={settings.chartStyle}
                    requestedMode={{ id: 'raw', nonce: routeRequest?.nonce ?? 0 }}
                  />
                )}
              </>
            )}

            {/* 3. In-Depth Accurate Predictions */}
            {normalizedPrimaryTab === 'predictions' && (
              <PredictionsView
                chart={chart}
                chartStyle={settings.chartStyle}
                requestedRoute={{
                  subTab: activeSubTab,
                  nonce: routeRequest?.nonce ?? 0,
                }}
                personaMode={personaMode}
              />
            )}

            {/* 4. Dasha Systems & Live Gochar */}
            {normalizedPrimaryTab === 'dasha_transits' && (
              <>
                {activeSubTab === 'live_transits' && (
                  <TransitsView
                    natalChart={chart}
                    settings={settings}
                    chartStyle={settings.chartStyle}
                  />
                )}
                {activeSubTab === 'sade_sati' && (
                  <TransitsView
                    natalChart={chart}
                    settings={settings}
                    chartStyle={settings.chartStyle}
                  />
                )}
                {activeSubTab === 'varshaphala' && (
                  <SpecializedAstrologyView
                    chart={chart}
                    chartStyle={settings.chartStyle}
                    requestedBranch={{ id: 'varshaphala', nonce: routeRequest?.nonce ?? 0 }}
                  />
                )}
                {activeSubTab !== 'live_transits' &&
                  activeSubTab !== 'sade_sati' &&
                  activeSubTab !== 'varshaphala' && (
                    <DashaView
                      chart={chart}
                      requestedSystem={{
                        id: activeSubTab === 'special_dashas' ? 'yogini' : 'vimshottari',
                        nonce: routeRequest?.nonce ?? 0,
                      }}
                    />
                  )}
              </>
            )}

            {/* 5. Classical Systems & Branches */}
            {normalizedPrimaryTab === 'branches' && (
              <>
                {activeSubTab === 'kp_4step' && (
                  <PredictionsView
                    chart={chart}
                    chartStyle={settings.chartStyle}
                    requestedRoute={{
                      subTab: 'branchesNumerology',
                      nested: 'kp',
                      nonce: routeRequest?.nonce ?? 0,
                    }}
                    personaMode={personaMode}
                  />
                )}
                {activeSubTab === 'lal_kitab' && (
                  <PredictionsView
                    chart={chart}
                    chartStyle={settings.chartStyle}
                    requestedRoute={{
                      subTab: 'branchesNumerology',
                      nested: 'lal_kitab',
                      nonce: routeRequest?.nonce ?? 0,
                    }}
                    personaMode={personaMode}
                  />
                )}
                {activeSubTab === 'bhavartha_ratnakara' && (
                  <PredictionsView
                    chart={chart}
                    chartStyle={settings.chartStyle}
                    requestedRoute={{
                      subTab: 'branchesNumerology',
                      nested: 'varshaphala_jaimini',
                      nonce: routeRequest?.nonce ?? 0,
                    }}
                    personaMode={personaMode}
                  />
                )}
                {activeSubTab === 'numerology' && (
                  <AstroSageToolsView
                    chart={chart}
                    requestedMode={{ id: 'numerology', nonce: routeRequest?.nonce ?? 0 }}
                  />
                )}
                {activeSubTab === 'doshas_remedies' && (
                  <AstroSageToolsView
                    chart={chart}
                    requestedMode={{ id: 'gems_rudraksha', nonce: routeRequest?.nonce ?? 0 }}
                  />
                )}
                {activeSubTab === 'life_specialized' && (
                  <SpecializedAstrologyView chart={chart} chartStyle={settings.chartStyle} />
                )}
              </>
            )}

            {/* 6. Western Astrology & Tropical Wheel */}
            {normalizedPrimaryTab === 'western' && (
              <WesternAstrologyView chart={chart} />
            )}

            {/* 7. Kundali Matching */}
            {normalizedPrimaryTab === 'matchmaking' && (
              <MatchMakingView
                profiles={profiles}
                activeProfileId={activeInput.id}
                settings={settings}
                chartStyle={settings.chartStyle}
                requestedPair={requestedMatchPair}
              />
            )}

            {/* 8. Panchang & Muhurta */}
            {normalizedPrimaryTab === 'panchang_muhurta' && (
              <ToolsSuiteView
                chart={chart}
                baseInput={activeInput}
                settings={settings}
                onApplyRectifiedTime={handleApplyRectifiedTime}
                requestedSubTab={{
                  id: activeSubTab === 'calendar_festivals' ? 'calendar_2027' : activeSubTab === 'muhurta_finder' ? 'muhurta' : activeSubTab === 'choghadiya_hora' ? 'do_ghati' : 'deep_panchang',
                  nonce: routeRequest?.nonce ?? 0,
                }}
              />
            )}

            {/* 9. 34-Chapter Janmakundali Deluxe PDF */}
            {normalizedPrimaryTab === 'patrika_booklet' && (
              <div className="card" style={{ padding: '20px' }}>
                <KundaliBookletModal
                  open={true}
                  onClose={() => navigateTo('home')}
                  chart={chart}
                  chartStyle={settings.chartStyle}
                  language={language}
                />
              </div>
            )}
          </main>
        </div>

        {/* Mobile Bottom Navigation Bar (Fixed 5 Thumb Actions) */}
        <MobileBottomNav
          activeTab={normalizedPrimaryTab}
          onNavigate={(tab) => navigateTo(tab)}
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
