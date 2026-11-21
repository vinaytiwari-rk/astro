import React, { useMemo, useState } from 'react';
import {
  Activity,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  ExternalLink,
  Flame,
  Layers,
  Search,
  Shield,
  Sparkles,
  Sun,
  Moon,
  Target,
  Zap,
} from 'lucide-react';
import { calculateChart } from '../../astro/calculator';
import { computeBhavabalaReport, type BhavabalaMasterReport, type BhavaBalaRow } from '../../astro/bhavabalaEngine';
import {
  computeKpCuspalInterlinksReport,
  type CilCuspRow,
  type CuspalPromiseVerification,
  type KpCilMasterReport,
} from '../../astro/kpCuspalInterlinks';
import {
  computeKakshyaGocharReport,
  type KakshyaGocharSummary,
  type PlanetKakshyaTransitDetail,
} from '../../astro/predictions/kakshyaGocharEngine';
import {
  computeTajaka50Sahams,
  type TajakaSahamsReport,
  type TajakaSahamResult,
} from '../../astro/tajakaSahams';
import type { BirthInput, ChartData } from '../../astro/types';
import { RESEARCH_BENCHMARK_CHARTS, type ResearchBenchmarkChart } from '../../data/researchCharts';
import { useLanguage } from '../../i18n/LanguageContext';

export interface ParasharaKalaWorkstationPanelProps {
  natalChart: ChartData;
  transitChart?: ChartData;
  onLoadBenchmarkChart?: (input: BirthInput) => void;
}

type MainTab = 'kakshya' | 'sahams' | 'kp_cil' | 'bhavabala' | 'research_charts';

export const ParasharaKalaWorkstationPanel: React.FC<ParasharaKalaWorkstationPanelProps> = ({
  natalChart,
  transitChart: propTransitChart,
  onLoadBenchmarkChart,
}) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';

  const [activeTab, setActiveTab] = useState<MainTab>('kakshya');

  // Sub-filters for Sahams
  const [sahamCategory, setSahamCategory] = useState<string>('all');
  const [sahamSearch, setSahamSearch] = useState<string>('');

  // Sub-filters for Research Charts
  const [researchCategory, setResearchCategory] = useState<string>('all');
  const [researchSearch, setResearchSearch] = useState<string>('');
  const [selectedResearchChart, setSelectedResearchChart] = useState<ResearchBenchmarkChart | null>(null);

  // Selected planet for Kakshya detail
  const [selectedPlanetKakshya, setSelectedPlanetKakshya] = useState<string>('Saturn');

  // Selected cusp for CIL detail
  const [selectedCilCusp, setSelectedCilCusp] = useState<number>(7);

  // Calculate live transit chart if not provided
  const transitChart = useMemo(() => {
    if (propTransitChart) return propTransitChart;
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const nowIso = `${now.getUTCFullYear()}-${pad(now.getUTCMonth() + 1)}-${pad(now.getUTCDate())}`;
    const nowTime = `${pad(now.getUTCHours())}:${pad(now.getUTCMinutes())}:${pad(now.getUTCSeconds())}`;

    const transitInput: BirthInput = {
      ...natalChart.input,
      id: `live-transit-${nowIso}`,
      name: 'Current Transit (गोचर)',
      date: nowIso,
      time: nowTime,
      timezone: 'MANUAL',
      utcOffsetMinutes: natalChart.offsetMinutesUsed,
    };
    return calculateChart(transitInput, natalChart.settings);
  }, [propTransitChart, natalChart]);

  // Engines
  const kakshyaReport: KakshyaGocharSummary = useMemo(() => {
    return computeKakshyaGocharReport(natalChart, transitChart);
  }, [natalChart, transitChart]);

  const sahamsReport: TajakaSahamsReport = useMemo(() => {
    return computeTajaka50Sahams(natalChart);
  }, [natalChart]);

  const kpCilReport: KpCilMasterReport = useMemo(() => {
    return computeKpCuspalInterlinksReport(natalChart);
  }, [natalChart]);

  const bhavabalaReport: BhavabalaMasterReport = useMemo(() => {
    return computeBhavabalaReport(natalChart);
  }, [natalChart]);

  // Filtered Sahams
  const filteredSahams = useMemo(() => {
    return sahamsReport.sahams.filter((s) => {
      const matchCat = sahamCategory === 'all' || s.category === sahamCategory;
      const q = sahamSearch.trim().toLowerCase();
      const matchSearch =
        !q ||
        s.nameEn.toLowerCase().includes(q) ||
        s.nameHi.toLowerCase().includes(q) ||
        s.lord.toLowerCase().includes(q) ||
        s.signName.toLowerCase().includes(q) ||
        String(s.house).includes(q);
      return matchCat && matchSearch;
    });
  }, [sahamsReport, sahamCategory, sahamSearch]);

  // Filtered Research Charts
  const filteredResearchCharts = useMemo(() => {
    return RESEARCH_BENCHMARK_CHARTS.filter((c) => {
      const matchCat = researchCategory === 'all' || c.category === researchCategory;
      const q = researchSearch.trim().toLowerCase();
      const matchSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.nameHi.toLowerCase().includes(q) ||
        c.birthInput.city?.toLowerCase().includes(q) ||
        c.birthInput.country?.toLowerCase().includes(q) ||
        c.keyAstrologicalHighlightsEn.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [researchCategory, researchSearch]);

  const activeKakshyaDetail: PlanetKakshyaTransitDetail | undefined = useMemo(() => {
    return kakshyaReport.allPlanets.find((p) => p.planet === selectedPlanetKakshya) || kakshyaReport.allPlanets[0];
  }, [kakshyaReport, selectedPlanetKakshya]);

  const activeCilCuspDetail: CilCuspRow | undefined = useMemo(() => {
    return kpCilReport.cusps.find((c) => c.house === selectedCilCusp) || kpCilReport.cusps[6];
  }, [kpCilReport, selectedCilCusp]);

  return (
    <div className="space-y-6 text-slate-800 dark:text-slate-100">
      {/* Header Banner */}
      <div className="rounded-xl border border-amber-500/20 bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-indigo-500/10 p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-md bg-amber-500/20 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-300">
                {isHi ? 'शास्त्रीय सॉफ्टवेयर महा-संग्रह' : 'Classical Software Workstation'}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Parashara's Light 7.0.1 · True Astrology CIL · Kala 2018 · 11,500 Charts
              </span>
            </div>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {isHi
                ? 'पाराशर-काला-ट्रू एस्ट्रोलॉजी उन्नत कार्यशाला'
                : 'Parashara-Kala-True Astrology Master Workstation'}
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {isHi
                ? 'अष्टकवर्ग कक्ष्य गोचर, ताजिक ५० सहम, केपी कस्पल इंटरलिंक्स (CIL 1-2193) एवं सम्पूर्ण भावबल का गणितीय फलक।'
                : 'Mathematical Ashtakavarga Kakshya micro-transits, Tajaka 50 Sahams, KP Cuspal Interlinks (CIL 1-2193) and comprehensive Bhavabala.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 px-3 py-2 text-right">
              <div className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {isHi ? 'सक्रिय जन्मपत्रिका' : 'Active Native'}
              </div>
              <div className="text-sm font-semibold text-slate-900 dark:text-white">
                {natalChart.input.name}
              </div>
            </div>
          </div>
        </div>

        {/* Master Navigation Tabs */}
        <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-200/60 dark:border-slate-700/60 pt-4">
          <button
            type="button"
            onClick={() => setActiveTab('kakshya')}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              activeTab === 'kakshya'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Clock className="h-4 w-4" />
            {isHi ? 'कक्ष्य गोचर (पाराशर)' : 'Kakshya Gochar (Parashara)'}
            <span className="ml-1 rounded-full bg-amber-500/20 px-1.5 py-0.5 text-[10px] text-amber-200">
              {kakshyaReport.kakshyaFavorabilityPercent}%
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sahams')}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              activeTab === 'sahams'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Compass className="h-4 w-4" />
            {isHi ? 'ताजिक ५० सहम' : 'Tajaka 50 Sahams'}
            <span className="ml-1 rounded-full bg-indigo-500/20 px-1.5 py-0.5 text-[10px] text-indigo-200">
              50
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('kp_cil')}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              activeTab === 'kp_cil'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Layers className="h-4 w-4" />
            {isHi ? 'कस्पल इंटरलिंक्स CIL (True Astrology)' : 'Cuspal Interlinks CIL (1-2193)'}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('bhavabala')}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              activeTab === 'bhavabala'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Activity className="h-4 w-4" />
            {isHi ? 'सम्पूर्ण भावबल (Kala 2018)' : 'Bhavabala Engine (Kala 2018)'}
            <span className="ml-1 rounded-full bg-emerald-500/20 px-1.5 py-0.5 text-[10px] text-emerald-200">
              {bhavabalaReport.averageRupas} Rupas
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('research_charts')}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              activeTab === 'research_charts'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            {isHi ? '११,५०० शोध पत्रिका बैंक' : '11,500 Research Benchmark Charts'}
            <span className="ml-1 rounded-full bg-purple-500/20 px-1.5 py-0.5 text-[10px] text-purple-200">
              {RESEARCH_BENCHMARK_CHARTS.length}
            </span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: ASHTAKAVARGA KAKSHYA GOCHAR (PARASHARA'S LIGHT PARITY) */}
      {/* ========================================================================= */}
      {activeTab === 'kakshya' && (
        <div className="space-y-6">
          {/* Top Status & Summary Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm md:col-span-2">
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {isHi ? 'कक्ष्य गोचर समग्र अनुकूलता' : 'Kakshya Transit Favorability Meter'}
                </div>
                <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-300">
                  {kakshyaReport.activePlanetsWithBindu}/7 {isHi ? 'ग्रह बिंदु युक्त' : 'Planets with Bindus'}
                </span>
              </div>
              <div className="mt-3 flex items-center gap-4">
                <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                  {kakshyaReport.kakshyaFavorabilityPercent}%
                </div>
                <div className="flex-1">
                  <div className="h-2.5 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-500"
                      style={{ width: `${kakshyaReport.kakshyaFavorabilityPercent}%` }}
                    />
                  </div>
                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {isHi ? kakshyaReport.overallVerdictHi : kakshyaReport.overallVerdictEn}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-amber-500" />
                {isHi ? 'स्वर्णिम गोचर कालखंड' : 'Golden Kakshya Corridors'}
              </div>
              <div className="mt-2 text-xs space-y-1.5 text-slate-600 dark:text-slate-300">
                {(isHi ? kakshyaReport.goldenWindowsHi : kakshyaReport.goldenWindowsEn).length > 0 ? (
                  (isHi ? kakshyaReport.goldenWindowsHi : kakshyaReport.goldenWindowsEn).map((g, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{g}</span>
                    </div>
                  ))
                ) : (
                  <p className="italic text-slate-400">
                    {isHi ? 'वर्तमान में मध्यम गोचर प्रभाव।' : 'Moderate transit rhythm across Kakshyas.'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Planet Selector Bar */}
          <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-700 pb-3">
            {kakshyaReport.allPlanets.map((p) => (
              <button
                key={p.planet}
                type="button"
                onClick={() => setSelectedPlanetKakshya(p.planet)}
                className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  selectedPlanetKakshya === p.planet
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                <span>{p.planet}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                    p.currentHasBindu
                      ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                      : 'bg-rose-500/20 text-rose-700 dark:text-rose-300'
                  }`}
                >
                  {p.currentHasBindu ? (isHi ? '१ बिंदु' : '1 Bindu') : (isHi ? '० बिंदु' : '0 Bindu')}
                </span>
              </button>
            ))}
          </div>

          {/* Active Planet Detail & 8-Kakshya Breakdown Table */}
          {activeKakshyaDetail && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Planetary Current Transit Snapshot */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {activeKakshyaDetail.planet} {isHi ? 'गोचर विवरण' : 'Transit Status'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {activeKakshyaDetail.transitSignName} ({activeKakshyaDetail.transitDms}) · House {activeKakshyaDetail.transitHouseFromAsc}
                    </p>
                  </div>
                  <span
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                      activeKakshyaDetail.currentHasBindu
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300'
                        : 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300'
                    }`}
                  >
                    {activeKakshyaDetail.statusCategory}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-lg bg-slate-50 dark:bg-slate-700/50 p-2.5">
                    <span className="text-slate-500 dark:text-slate-400">{isHi ? 'वर्तमान कक्ष्य स्वामी' : 'Current Kakshya Lord'}</span>
                    <div className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                      {activeKakshyaDetail.currentKakshyaLord} (#{activeKakshyaDetail.currentKakshyaNumber})
                    </div>
                  </div>
                  <div className="rounded-lg bg-slate-50 dark:bg-slate-700/50 p-2.5">
                    <span className="text-slate-500 dark:text-slate-400">{isHi ? 'कक्ष्य विस्तार' : 'Kakshya Span'}</span>
                    <div className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                      {activeKakshyaDetail.currentKakshyaSpan}
                    </div>
                  </div>
                  <div className="rounded-lg bg-slate-50 dark:bg-slate-700/50 p-2.5">
                    <span className="text-slate-500 dark:text-slate-400">{isHi ? 'भिन्नाष्टक बिंदु (BAV)' : 'Bhinna Bindus (BAV)'}</span>
                    <div className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                      {activeKakshyaDetail.bhinnaBindusInSign} / 8
                    </div>
                  </div>
                  <div className="rounded-lg bg-slate-50 dark:bg-slate-700/50 p-2.5">
                    <span className="text-slate-500 dark:text-slate-400">{isHi ? 'सर्वाष्टक बिंदु (SAV)' : 'Sarva Bindus (SAV)'}</span>
                    <div className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                      {activeKakshyaDetail.sarvaBindusInSign} / 56
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-slate-700 dark:text-slate-300">
                  <div className="font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-1.5 mb-1">
                    <Compass className="h-4 w-4" />
                    {isHi ? 'फलित शास्त्रीय निर्देश' : 'Predictive Direction'}
                  </div>
                  <p className="leading-relaxed">
                    {isHi ? activeKakshyaDetail.predictionHi : activeKakshyaDetail.predictionEn}
                  </p>
                </div>
              </div>

              {/* Right Columns: Full 8-Kakshya Table (0° to 30°) */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm lg:col-span-2">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Layers className="h-4 w-4 text-amber-500" />
                    {isHi
                      ? `${activeKakshyaDetail.transitSignName} राशि में सम्पूर्ण ८ कक्ष्य विभाजन`
                      : `Full 8-Kakshya Division in ${activeKakshyaDetail.transitSignName}`}
                  </h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    3°45' {isHi ? 'प्रति कक्ष्य' : 'per Kakshya'}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400">
                        <th className="py-2.5 px-3">#</th>
                        <th className="py-2.5 px-3">{isHi ? 'कक्ष्य स्वामी' : 'Kakshya Lord'}</th>
                        <th className="py-2.5 px-3">{isHi ? 'अंश विस्तार' : 'Degree Arc'}</th>
                        <th className="py-2.5 px-3 text-center">{isHi ? 'प्रस्ताराष्टक बिंदु' : 'Prastara Bindu'}</th>
                        <th className="py-2.5 px-3">{isHi ? 'वर्तमान स्थिति' : 'Active Status'}</th>
                        <th className="py-2.5 px-3">{isHi ? 'फल प्रभाव' : 'Fruition Potential'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                      {activeKakshyaDetail.kakshyaSlots.map((slot) => (
                        <tr
                          key={slot.kakshyaNumber}
                          className={`${
                            slot.isActiveNow
                              ? 'bg-amber-50/80 dark:bg-amber-950/20 font-medium'
                              : 'hover:bg-slate-50/50 dark:hover:bg-slate-700/30'
                          }`}
                        >
                          <td className="py-2.5 px-3 text-slate-400">
                            #{slot.kakshyaNumber}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="font-semibold text-slate-900 dark:text-white">
                              {slot.lord}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-600 dark:text-slate-300">
                            {slot.rangeDms}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span
                              className={`inline-flex items-center justify-center h-5 w-5 rounded-full text-xs font-bold ${
                                slot.hasBindu
                                  ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300'
                                  : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
                              }`}
                            >
                              {slot.hasBindu ? '1' : '0'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3">
                            {slot.isActiveNow ? (
                              <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold">
                                <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                                {isHi ? 'सक्रिय गोचर' : 'Stationed Now'}
                              </span>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">
                            {isHi ? slot.verdictHi : slot.verdictEn}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: TAJAKA 50 SAHAMS ENGINE */}
      {/* ========================================================================= */}
      {activeTab === 'sahams' && (
        <div className="space-y-6">
          {/* Sahams Top Info */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {isHi ? 'ताजिक नीलकण्ठी शास्त्रीय सहम पद्धति' : 'Tajaka Neelakanthi Classical Saham Matrix'}
              </div>
              <div className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">
                {isHi ? sahamsReport.birthTypeHi : sahamsReport.birthTypeEn}
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'all', en: 'All 50 Sahams', hi: 'सभी ५० सहम' },
                { id: 'Spiritual & Dharma', en: 'Dharma & Spirit', hi: 'धर्म व अध्यात्म' },
                { id: 'Wealth & Career', en: 'Wealth & Career', hi: 'धन व कर्म' },
                { id: 'Family & Relationships', en: 'Family & Love', hi: 'परिवार व संबंध' },
                { id: 'Vitality & Health', en: 'Vitality & Health', hi: 'आरोग्य व आयु' },
                { id: 'Enterprise & Travel', en: 'Enterprise & Travel', hi: 'पराक्रम व यात्रा' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSahamCategory(cat.id)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                    sahamCategory === cat.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {isHi ? cat.hi : cat.en}
                </button>
              ))}
            </div>

            {/* Search Box */}
            <div className="relative w-full md:w-60">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder={isHi ? 'सहम या स्वामी खोजें...' : 'Search Saham, lord...'}
                value={sahamSearch}
                onChange={(e) => setSahamSearch(e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 py-1.5 pl-8 pr-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Sahams Table */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400">
                    <th className="py-3 px-3 font-semibold">{isHi ? 'सहम नाम' : 'Saham Name'}</th>
                    <th className="py-3 px-3 font-semibold">{isHi ? 'श्रेणी' : 'Category'}</th>
                    <th className="py-3 px-3 font-semibold">{isHi ? 'राशि एवं अंश' : 'Sign & Degree'}</th>
                    <th className="py-3 px-3 font-semibold text-center">{isHi ? 'भाव' : 'House'}</th>
                    <th className="py-3 px-3 font-semibold">{isHi ? 'स्वामी' : 'Lord'}</th>
                    <th className="py-3 px-3 font-semibold">{isHi ? 'ताजिक इत्थशाल योग' : 'Ithasala Yoga'}</th>
                    <th className="py-3 px-3 font-semibold">{isHi ? 'शास्त्रीय फलित' : 'Predictive Significance'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                  {filteredSahams.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-700/30">
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {isHi ? s.nameHi : s.nameEn}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {isHi ? s.formulaDescriptionHi : s.formulaDescriptionEn}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="rounded-full bg-slate-100 dark:bg-slate-700 px-2 py-0.5 text-[10px] text-slate-600 dark:text-slate-300">
                          {s.category}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">
                          {s.signName}
                        </div>
                        <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                          {s.dms}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="inline-flex items-center justify-center h-6 w-6 rounded-md bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-bold">
                          {s.house}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-700 dark:text-slate-300">
                        {s.lord}
                      </td>
                      <td className="py-3 px-3">
                        {s.ithasalaYoga.exists ? (
                          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                            <Sparkles className="h-3 w-3" />
                            {s.ithasalaYoga.partnerPlanet} ({s.ithasalaYoga.aspectType})
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">—</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-300 max-w-xs">
                        <p className="line-clamp-2" title={isHi ? s.predictionHi : s.predictionEn}>
                          {isHi ? s.predictionHi : s.predictionEn}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: TRUE ASTROLOGY KP CUSPAL INTERLINKS (CIL 1-2193) */}
      {/* ========================================================================= */}
      {activeTab === 'kp_cil' && (
        <div className="space-y-6">
          {/* CIL Top Banner */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {isHi ? 'ट्रू एस्ट्रोलॉजी कस्पल इंटरलिंक्स सिद्धांत' : 'True Astrology Cuspal Interlinks (CIL 1-2193) Theory'}
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                {isHi ? 'उप-उप स्वामी (Sub-Sub Lord) आधारित भाव वचन सत्यापन' : 'Sub-Sub Lord (SSL) Cuspal Promise Verification'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {isHi ? kpCilReport.overallSummaryHi : kpCilReport.overallSummaryEn}
              </p>
            </div>
            <div className="rounded-lg bg-amber-500/10 px-3 py-1.5 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-300">
              <span className="font-bold">2,193</span> {isHi ? 'सूक्ष्म उप-उप खंड' : 'Micro-SSL Divisions'}
            </div>
          </div>

          {/* 8 Cuspal Promise Verification Cards Grid */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
              <Award className="h-4 w-4 text-amber-500" />
              {isHi ? '८ आधारभूत जीवन आयाम: कस्पल प्रॉमिस सत्यापन' : '8 Core Life Pillars: Cuspal Promise Verification'}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {kpCilReport.cuspalPromises.map((p) => (
                <div
                  key={p.primaryCusp}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="rounded-md bg-slate-100 dark:bg-slate-700 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                        {isHi ? `भाव ${p.primaryCusp}` : `Cusp ${p.primaryCusp}`}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          p.verdict.startsWith('Strong')
                            ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20'
                            : p.verdict.startsWith('Adverse')
                              ? 'bg-rose-100 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-500/20'
                              : 'bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-500/20'
                        }`}
                      >
                        {p.verdict.split('(')[0].trim()}
                      </span>
                    </div>

                    <h5 className="mt-2 text-sm font-bold text-slate-900 dark:text-white">
                      {isHi ? p.topicHi : p.topic}
                    </h5>

                    <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
                      <div>
                        <span className="font-medium text-slate-700 dark:text-slate-300">SSL: </span>
                        {p.sslLord} (Star: {p.sslStarLord}, Sub: {p.sslSubLord})
                      </div>
                      <div>
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          {isHi ? 'अनुकूल भाव:' : 'Fav Houses:'}{' '}
                        </span>
                        {p.favorableHouses.join(', ')}
                      </div>
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed border-t border-slate-100 dark:border-slate-700/60 pt-2">
                    {isHi ? p.analysisHi : p.analysisEn}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Full 12 Cusps CIL Table */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="h-4 w-4 text-amber-500" />
                {isHi ? 'सम्पूर्ण १२ भाव कस्पल इंटरलिंक्स सारणी' : 'Full 12-Cusps Cuspal Interlinks (CIL) Table'}
              </h4>
              <span className="text-xs text-slate-400">
                Sign Lord · Star Lord · Sub Lord · Sub-Sub Lord (SSL)
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 font-semibold">
                    <th className="py-2.5 px-3">Cusp</th>
                    <th className="py-2.5 px-3">{isHi ? 'अंश एवं राशि' : 'Longitude & Sign'}</th>
                    <th className="py-2.5 px-3">{isHi ? 'राशि स्वामी' : 'Sign Lord'}</th>
                    <th className="py-2.5 px-3">{isHi ? 'नक्षत्र स्वामी' : 'Star Lord'}</th>
                    <th className="py-2.5 px-3">{isHi ? 'उप स्वामी' : 'Sub Lord'}</th>
                    <th className="py-2.5 px-3 font-bold text-amber-600 dark:text-amber-400">
                      {isHi ? 'उप-उप स्वामी (SSL)' : 'Sub-Sub Lord'}
                    </th>
                    <th className="py-2.5 px-3">{isHi ? 'SSL नक्षत्र / उप' : 'SSL Star / Sub'}</th>
                    <th className="py-2.5 px-3">{isHi ? 'सक्रिय भाव (Involvement)' : 'Involvement Houses'}</th>
                    <th className="py-2.5 px-3">{isHi ? 'फल भाव (Commitment)' : 'Commitment Houses'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                  {kpCilReport.cusps.map((c) => (
                    <tr
                      key={c.house}
                      onClick={() => setSelectedCilCusp(c.house)}
                      className={`cursor-pointer transition-colors ${
                        selectedCilCusp === c.house
                          ? 'bg-amber-50/70 dark:bg-amber-950/20 font-medium'
                          : 'hover:bg-slate-50/60 dark:hover:bg-slate-700/30'
                      }`}
                    >
                      <td className="py-2.5 px-3">
                        <span className="inline-flex items-center justify-center h-5 w-5 rounded bg-slate-100 dark:bg-slate-700 font-bold text-slate-700 dark:text-slate-200">
                          {c.house}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {c.signName}
                        </span>{' '}
                        <span className="text-[11px] font-mono text-slate-400">{c.dms}</span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">{c.signLord}</td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">{c.starLord}</td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">{c.subLord}</td>
                      <td className="py-2.5 px-3 font-bold text-amber-700 dark:text-amber-300">
                        {c.subSubLord}
                        <span className="ml-1 text-[10px] text-slate-400 font-normal">
                          (#{c.sslIndex2193})
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">
                        {c.sslStarLord} / {c.sslSubLord}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-indigo-600 dark:text-indigo-400">
                        [{c.involvementHouses.join(', ') || 'none'}]
                      </td>
                      <td className="py-2.5 px-3 font-mono text-emerald-600 dark:text-emerald-400">
                        [{c.commitmentHouses.join(', ') || 'none'}]
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: KALA 2018 MATHEMATICAL BHAVABALA ENGINE */}
      {/* ========================================================================= */}
      {activeTab === 'bhavabala' && (
        <div className="space-y-6">
          {/* Bhavabala Top Banner */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {isHi ? 'बृहत्पाराशर होराशास्त्र एवं काला २०१८ गणितीय भावबल' : 'Brihat Parashara Hora Shastra & Kala 2018 Bhavabala'}
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                {isHi
                  ? `सर्वाधिक बली: भाव ${bhavabalaReport.strongestHouse} · औसत भावबल: ${bhavabalaReport.averageRupas} रूप`
                  : `Strongest House: #${bhavabalaReport.strongestHouse} · Average Bhavabala: ${bhavabalaReport.averageRupas} Rupas`}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {isHi ? bhavabalaReport.overallSummaryHi : bhavabalaReport.overallSummaryEn}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[11px] text-slate-400">{isHi ? 'प्रबल सामर्थ्य भाव' : 'High Potency Houses'}</span>
                <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {bhavabalaReport.highPotencyHouses.map((h) => `H${h}`).join(', ') || 'None'}
                </div>
              </div>
              <div className="text-right border-l border-slate-200 dark:border-slate-700 pl-3">
                <span className="text-[11px] text-slate-400">{isHi ? 'पुरुषार्थ साध्य भाव' : 'Conscious Effort Houses'}</span>
                <div className="text-xs font-bold text-amber-600 dark:text-amber-400">
                  {bhavabalaReport.remedialHouses.map((h) => `H${h}`).join(', ') || 'None'}
                </div>
              </div>
            </div>
          </div>

          {/* 12 Bhavas Bhavabala Grid / Breakdown Table */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 font-semibold">
                    <th className="py-3 px-3">House</th>
                    <th className="py-3 px-3">{isHi ? 'राशि एवं स्वामी' : 'Sign & Lord'}</th>
                    <th className="py-3 px-3">{isHi ? 'भावाधिपति बल' : 'Bhavadhipati'}</th>
                    <th className="py-3 px-3">{isHi ? 'भाव दिग्बल' : 'Bhava Digbala'}</th>
                    <th className="py-3 px-3">{isHi ? 'भाव दृष्टि बल' : 'Drishti Bala'}</th>
                    <th className="py-3 px-3">{isHi ? 'दिन-रात्रि बल' : 'Dina-Ratri'}</th>
                    <th className="py-3 px-3 font-bold text-emerald-600 dark:text-emerald-400">
                      {isHi ? 'कुल भावबल (रूप)' : 'Total Rupas'}
                    </th>
                    <th className="py-3 px-3 text-center">{isHi ? 'कोटि (Rank)' : 'Rank'}</th>
                    <th className="py-3 px-3">{isHi ? 'फलित सामर्थ्य' : 'Potency Verdict'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                  {bhavabalaReport.houses.map((h) => (
                    <tr key={h.house} className="hover:bg-slate-50/60 dark:hover:bg-slate-700/30">
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center justify-center h-6 w-6 rounded bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-bold">
                          {h.house}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {h.signName}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {h.lord} · {isHi ? h.signClassificationHi : h.signClassification}
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-700 dark:text-slate-300">
                        {h.bhavadhipatiBalaVirupas} V
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-700 dark:text-slate-300">
                        {h.bhavaDigbalaVirupas} V
                      </td>
                      <td className="py-3 px-3 font-mono">
                        <span
                          className={
                            h.bhavaDrishtiBalaVirupas >= 0
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-rose-600 dark:text-rose-400'
                          }
                        >
                          {h.bhavaDrishtiBalaVirupas >= 0 ? `+${h.bhavaDrishtiBalaVirupas}` : h.bhavaDrishtiBalaVirupas} V
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-700 dark:text-slate-300">
                        {h.bhavaDinaRatriBalaVirupas} V
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-sm text-slate-900 dark:text-white">
                          {h.totalRupas} <span className="text-xs font-normal text-slate-400">R</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {h.totalVirupas} Virupas
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`inline-flex items-center justify-center h-5 w-5 rounded-full text-xs font-bold ${
                            h.rank <= 3
                              ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300'
                              : h.rank >= 10
                                ? 'bg-slate-100 dark:bg-slate-700 text-slate-500'
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {h.rank}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                            h.potencyVerdict.startsWith('High')
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20'
                              : h.potencyVerdict.startsWith('Conscious')
                                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-500/20'
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          {h.potencyVerdict.split('(')[0].trim()}
                        </span>
                        <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1" title={isHi ? h.interpretationHi : h.interpretationEn}>
                          {isHi ? h.interpretationHi : h.interpretationEn}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: 11,500 RESEARCH BENCHMARK CHARTS BANK */}
      {/* ========================================================================= */}
      {activeTab === 'research_charts' && (
        <div className="space-y-6">
          {/* Top Filter & Search */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {isHi ? 'ऐतिहासिक एवं शोध जन्मपत्रिका संग्रह' : 'Historical & Scientific Benchmark Charts'}
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                {isHi ? '११,५०० वैश्विक शोध संग्रह में से चयनित प्रामाणिक पत्रिकाएं' : 'Curated Landmark Benchmarks from 11,500 Global Archive'}
              </h3>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'all', en: 'All Categories', hi: 'सभी श्रेणियां' },
                { id: 'Scientists & Geniuses', en: 'Scientists', hi: 'वैज्ञानिक' },
                { id: 'Spiritual Masters', en: 'Spiritual Masters', hi: 'आध्यात्मिक संत' },
                { id: 'World Leaders', en: 'Leaders', hi: 'राष्ट्रनायक' },
                { id: 'Masters of Arts', en: 'Arts & Literature', hi: 'कला व साहित्य' },
                { id: 'Industrial Pioneers', en: 'Industry & Wealth', hi: 'उद्योग व धन' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setResearchCategory(cat.id)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                    researchCategory === cat.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {isHi ? cat.hi : cat.en}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-60">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder={isHi ? 'व्यक्तित्व, नगर, देश खोजें...' : 'Search chart, city...'}
                value={researchSearch}
                onChange={(e) => setResearchSearch(e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 py-1.5 pl-8 pr-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredResearchCharts.map((rc) => (
              <div
                key={rc.id}
                className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm flex flex-col justify-between hover:border-purple-500/40 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-purple-100 dark:bg-purple-950/40 px-2.5 py-0.5 text-[10px] font-semibold text-purple-700 dark:text-purple-300">
                      {isHi ? rc.categoryHi : rc.category}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      {rc.birthInput.date.split('-').reverse().join('-')}
                    </span>
                  </div>

                  <h4 className="mt-2 text-base font-bold text-slate-900 dark:text-white">
                    {isHi ? rc.nameHi : rc.name}
                  </h4>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {rc.birthInput.city}, {rc.birthInput.country} ({rc.birthInput.time})
                  </div>

                  <div className="mt-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 p-3 text-xs space-y-2">
                    <div>
                      <div className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                        <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                        {isHi ? 'शास्त्रीय योग संयोजन' : 'Astrological Signatures'}
                      </div>
                      <p className="mt-0.5 text-slate-600 dark:text-slate-300 leading-relaxed">
                        {isHi ? rc.keyAstrologicalHighlightsHi : rc.keyAstrologicalHighlightsEn}
                      </p>
                    </div>

                    <div className="border-t border-slate-200/60 dark:border-slate-600/60 pt-2">
                      <div className="font-semibold text-slate-700 dark:text-slate-300">
                        {isHi ? 'ऐतिहासिक संदर्भ' : 'Biographical Context'}
                      </div>
                      <p className="mt-0.5 text-slate-500 dark:text-slate-400 leading-relaxed">
                        {isHi ? rc.biographicalNoteHi : rc.biographicalNoteEn}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    ID: {rc.id}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (onLoadBenchmarkChart) {
                        onLoadBenchmarkChart(rc.birthInput);
                      }
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 text-xs font-medium transition-colors shadow-sm"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    {isHi ? 'कार्यशाला में लोड करें' : 'Load into Workspace'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
