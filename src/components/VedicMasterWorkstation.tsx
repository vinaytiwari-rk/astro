import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Award,
  BookOpen,
  Briefcase,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Compass,
  Edit3,
  Eye,
  FileText,
  Flame,
  Gem,
  GraduationCap,
  Grid3x3,
  Heart,
  HelpCircle,
  IndianRupee,
  Layers,
  Moon,
  RefreshCw,
  RotateCcw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Star,
  Sun,
  Target,
  User,
  Users,
  Zap,
} from 'lucide-react';

import { computeAvakahadaChakra, computeBhavaChalitPlacements, computeGhatakChakra } from '../astro/avakahadaChalit';
import { computeAvasthasAndUpagrahas } from '../astro/avasthasUpagrahas';
import { calculateChart } from '../astro/calculator';
import { DIVISIONAL_META, NAKSHATRAS, NINE_GRAHAS, SEVEN_PLANETS, SIGNS } from '../astro/constants';
import { computeBasicDetailsSheet, HIGHER_VARGA_META, type BasicDetailRow } from '../astro/higherVargas';
import { computeKpReport, computeLiveKpRulingPlanets, type KpRulingPlanets } from '../astro/kp';
import { computeFullLalKitabReport } from '../astro/lalKitabExtended';
import { computeLalKitabSystemReport } from '../astro/predictions/lalKitabSystem';
import { computeKundaliDoshas } from '../astro/predictions/familyDoshas';
import { computePastFutureLifeReading } from '../astro/predictions/pastFutureLife';
import { computeDeepLifePredictions } from '../astro/predictions/deepLifePredictions';
import {
  computeDynamic12Epochs,
  computeDynamicCareerZenithSections,
  computeDynamicWealthInduLagnaSections,
  computeDynamicMarriageAndIntimacySections,
  computeDynamicHealthSections,
} from '../astro/predictions/dynamicDossierChapters';
import { CLASSICAL_YOGAS_KB, detectClassicalYogas } from '../astro/predictions/classicalYogasKb';
import { computeChartYutiReport } from '../astro/predictions/yutiPredictions';
import { computeGemstoneAndRudraksha } from '../astro/rashifalBabyRudraksha';
import {
  computeKotaChakra,
  computeKurmaChakra,
  computeSarvatobhadraChakra,
  computeSudarshanChakra,
} from '../astro/specialChakras';
import { computePushkaraAnalysis } from '../astro/specialSensitivities';
import { formatDateDmy, formatDms } from '../astro/time';
import type {
  BirthInput,
  CalcSettings,
  ChartData,
  ChartStyle,
  DivisionalChartId,
  NineGrahaId,
  PlanetId,
  SevenPlanetId,
} from '../astro/types';
import { computeVarshaphala } from '../astro/varshaphala';
import { useLanguage } from '../i18n/LanguageContext';
import { trPlanet, trPlanetShort, trSign, trTerm, trVarga, type AppLanguage } from '../i18n/translations';
import { DEFAULT_SETTINGS } from '../data/cities';
import { computeMasterIndividualPredictions, type PredictiveDomainDetail } from '../astro/predictions/masterIndividualPredictions';
import { AshtakavargaView } from './AshtakavargaView';
import { DashaView } from './DashaView';
import { MatchMakingView } from './MatchMakingView';
import { ToolsSuiteView } from './ToolsSuiteView';
import { VedicChartSvg, type ChartBadgeItem } from './VedicChartSvg';

export type WorkstationMenuId =
  | 'sarini'
  | 'charts_tables'
  | 'dasha'
  | 'varshphal'
  | 'chakras'
  | 'yogas_doshas'
  | 'navamsha'
  | 'kp_system'
  | 'lal_kitab'
  | 'predictions'
  | 'past_future'
  | 'matchmaking'
  | 'remedies'
  | 'panchang';

export interface VedicMasterWorkstationProps {
  chart: ChartData;
  chartStyle: ChartStyle;
  onChangeChartStyle?: (style: ChartStyle) => void;
  settings?: CalcSettings;
  profiles: BirthInput[];
  activeProfileId: string;
  onSelectProfile: (id: string) => void;
  onOpenEditor?: () => void;
  onOpenBooklet?: () => void;
  onOpenMatchMaking?: () => void;
  requestedMenu?: { id?: string; nonce: number };
}

function nowDateAndTime(): { date: string; time: string } {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return {
    date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
    time: `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`,
  };
}

export const VedicMasterWorkstation: React.FC<VedicMasterWorkstationProps> = ({
  chart,
  chartStyle,
  onChangeChartStyle,
  settings,
  profiles,
  activeProfileId,
  onSelectProfile,
  onOpenEditor,
  onOpenBooklet,
  onOpenMatchMaking,
  requestedMenu,
}) => {
  const { lang, t } = useLanguage();
  const isHi = lang === 'hi';
  const safeSettings = settings ?? chart.settings;

  // Active Menu State (Default to 'sarini')
  const [activeMenu, setActiveMenu] = useState<WorkstationMenuId>('sarini');

  // Left Column Chart Fast-Toggle State ('D1' | 'CHALIT' | 'D9' | 'GOCHAR')
  const [leftChartType, setLeftChartType] = useState<'D1' | 'CHALIT' | 'D9' | 'GOCHAR'>('D1');
  const [showSpecialPoints, setShowSpecialPoints] = useState(false);
  const [showSavPoints, setShowSavPoints] = useState(false);

  // Sub-tab States for internal tabs
  const [chartsSubTab, setChartsSubTab] = useState<'vargas' | 'ashtakavarga' | 'chalit' | 'shadbala'>('vargas');
  const [selectedVargaId, setSelectedVargaId] = useState<DivisionalChartId>('D9');
  const [chakrasSubTab, setChakrasSubTab] = useState<'sudarshan' | 'sarvatobhadra' | 'kota' | 'kurma'>('sudarshan');
  const [yogasSubTab, setYogasSubTab] = useState<'classical' | 'doshas' | 'yuti'>('classical');
  const [predCategoryFilter, setPredCategoryFilter] = useState<'individual' | 'family' | 'epochs'>('individual');

  // Varshphal target year
  const birthYear = parseInt(chart.input.date.split('-')[0], 10);
  const currentYear = new Date().getFullYear();
  const [varshYear, setVarshYear] = useState<number>(() => Math.max(birthYear, currentYear));

  // Live Ruling Planets for KP
  const [liveRp, setLiveRp] = useState<KpRulingPlanets | null>(null);

  // External routing listener
  useEffect(() => {
    const id = requestedMenu?.id;
    if (!id) return;
    const validMenus: WorkstationMenuId[] = [
      'sarini',
      'charts_tables',
      'dasha',
      'varshphal',
      'chakras',
      'yogas_doshas',
      'navamsha',
      'kp_system',
      'lal_kitab',
      'predictions',
      'past_future',
      'matchmaking',
      'remedies',
      'panchang',
    ];
    if (validMenus.includes(id as WorkstationMenuId)) {
      setActiveMenu(id as WorkstationMenuId);
    }
  }, [requestedMenu?.nonce, requestedMenu?.id]);

  // Live Gochar Chart Computation
  const gocharChart = useMemo(() => {
    const now = nowDateAndTime();
    return calculateChart({ ...chart.input, date: now.date, time: now.time }, safeSettings);
  }, [chart.input, safeSettings]);

  // Chalit & Avakhada computations
  const chalitData = useMemo(() => computeBhavaChalitPlacements(chart), [chart]);
  const basicSheet = useMemo(() => computeBasicDetailsSheet(chart), [chart]);
  const avasthasData = useMemo(() => computeAvasthasAndUpagrahas(chart), [chart]);

  // Special Chakras
  const sudarshanData = useMemo(() => computeSudarshanChakra(chart, varshYear), [chart, varshYear]);
  const sarvatobhadraData = useMemo(() => computeSarvatobhadraChakra(chart), [chart]);
  const kotaData = useMemo(() => computeKotaChakra(chart), [chart]);
  const kurmaData = useMemo(() => computeKurmaChakra(chart), [chart]);

  // Yogas & Doshas
  const classicalYogas = useMemo(() => detectClassicalYogas(chart), [chart]);
  const doshasData = useMemo(() => computeKundaliDoshas(chart), [chart]);
  const yutiReport = useMemo(() => computeChartYutiReport(chart), [chart]);

  // Navamsha & Special Sensitivities
  const pushkaraData = useMemo(() => computePushkaraAnalysis(chart), [chart]);

  // KP & Lal Kitab
  const kpReport = useMemo(() => computeKpReport(chart), [chart]);
  const lalKitabReport = useMemo(() => computeLalKitabSystemReport(chart), [chart]);
  const lalKitabExtended = useMemo(() => computeFullLalKitabReport(chart, varshYear), [chart, varshYear]);

  // Varshaphala
  const varshaphalaReport = useMemo(() => computeVarshaphala(chart, varshYear), [chart, varshYear]);

  // Deep Predictions & Past/Future Life
  const masterPredictions = useMemo(() => computeMasterIndividualPredictions(chart), [chart]);
  const deepPredictions = useMemo(() => computeDeepLifePredictions(chart), [chart]);
  const pastFutureLife = useMemo(() => computePastFutureLifeReading(chart), [chart]);
  const dynamicEpochs = useMemo(() => computeDynamic12Epochs(chart, false), [chart]);
  const careerSections = useMemo(() => computeDynamicCareerZenithSections(chart), [chart]);
  const wealthSections = useMemo(() => computeDynamicWealthInduLagnaSections(chart), [chart]);
  const marriageSections = useMemo(() => computeDynamicMarriageAndIntimacySections(chart, false), [chart]);
  const healthSections = useMemo(() => computeDynamicHealthSections(chart), [chart]);

  // Remedies
  const gemstoneData = useMemo(() => computeGemstoneAndRudraksha(chart), [chart]);

  // Active Vimshottari Dasha Hierarchy
  const activeDashaSummary = useMemo(() => {
    const nowMs = Date.now();
    const maha = chart.vimshottari.find((m) => nowMs >= m.startMs && nowMs <= m.endMs);
    const antar = maha?.children?.find((a) => nowMs >= a.startMs && nowMs <= a.endMs);
    const pratyantar = antar?.children?.find((p) => nowMs >= p.startMs && nowMs <= p.endMs);
    const sookshma = pratyantar?.children?.find((s) => nowMs >= s.startMs && nowMs <= s.endMs);
    return { maha, antar, pratyantar, sookshma };
  }, [chart.vimshottari]);

  // Build Left Chart Badges
  const leftChartBadges: ChartBadgeItem[] = useMemo(() => {
    if (leftChartType === 'CHALIT') {
      return chalitData.placements.map((pl) => ({
        id: pl.id,
        label: trPlanetShort(pl.id, lang),
        signIndex: pl.chalitDisplaySignIndex,
        houseNumber: pl.chalitHouse,
        isLagna: pl.id === 'Asc',
        isRetrograde: pl.isRetrograde,
        isCombust: pl.isCombust,
        dignity: pl.dignity,
        tooltip: `${trPlanet(pl.id, lang)}: Rasi H${pl.rasiHouse} → Chalit H${pl.chalitHouse} (${pl.dms})`,
      }));
    }

    if (leftChartType === 'D9') {
      const d9 = chart.divisionalCharts['D9'];
      return d9.placements.map((pl) => ({
        id: pl.id,
        label: trPlanetShort(pl.id, lang),
        signIndex: pl.signIndex,
        isLagna: pl.id === 'Asc',
        isRetrograde: pl.isRetrograde,
        isCombust: pl.isCombust,
        dignity: pl.dignity,
        tooltip: `${trPlanet(pl.id, lang)}: ${trSign(pl.signIndex, lang)} (H${pl.houseFromVargaLagna}) | ${trTerm(pl.dignity, lang)}`,
      }));
    }

    if (leftChartType === 'GOCHAR') {
      const gLagnaSign = gocharChart.ascendant.signIndex;
      return [
        {
          id: 'Asc',
          label: trPlanetShort('Asc', lang),
          signIndex: gLagnaSign,
          houseNumber: 1,
          isLagna: true,
          tooltip: `${trPlanet('Asc', lang)} (Gochar): ${trSign(gLagnaSign, lang)}`,
        },
        ...gocharChart.planets.map((p) => ({
          id: p.id,
          label: trPlanetShort(p.id, lang),
          signIndex: p.signIndex,
          houseNumber: p.houseNumber,
          isRetrograde: p.isRetrograde,
          isCombust: p.isCombust,
          dignity: p.dignity,
          tooltip: `Gochar ${trPlanet(p.id, lang)}: ${trSign(p.signIndex, lang)} H${p.houseNumber}`,
        })),
      ];
    }

    // Default D1 Lagna
    const items: ChartBadgeItem[] = [
      {
        id: 'Asc',
        label: trPlanetShort('Asc', lang),
        signIndex: chart.ascendant.signIndex,
        houseNumber: 1,
        isLagna: true,
        isVargottama: chart.ascendant.isVargottama,
        tooltip: `${trPlanet('Asc', lang)}: ${trSign(chart.ascendant.signIndex, lang)} ${chart.ascendant.dms}`,
      },
      ...chart.planets.map((p) => ({
        id: p.id,
        label: trPlanetShort(p.id, lang),
        signIndex: p.signIndex,
        houseNumber: p.houseNumber,
        isRetrograde: p.isRetrograde,
        isCombust: p.isCombust,
        isVargottama: p.isVargottama,
        dignity: p.dignity,
        tooltip: `${trPlanet(p.id, lang)}: ${trSign(p.signIndex, lang)} ${p.dms} | ${trTerm(p.dignity, lang)}`,
      })),
    ];

    if (showSpecialPoints) {
      for (const sp of chart.specialPoints) {
        items.push({
          id: sp.id,
          label: trPlanetShort(sp.shortLabel, lang),
          signIndex: sp.signIndex,
          houseNumber: sp.houseNumber,
          tooltip: `${sp.label}: ${trSign(sp.signIndex, lang)} ${sp.dms}`,
        });
      }
    }

    return items;
  }, [leftChartType, chalitData, chart, gocharChart, lang, showSpecialPoints]);

  const leftLagnaSignIndex = useMemo(() => {
    if (leftChartType === 'CHALIT') return chart.ascendant.signIndex;
    if (leftChartType === 'D9') return chart.divisionalCharts['D9'].lagnaSignIndex;
    if (leftChartType === 'GOCHAR') return gocharChart.ascendant.signIndex;
    return chart.ascendant.signIndex;
  }, [leftChartType, chart, gocharChart]);

  const leftChartTitle = useMemo(() => {
    if (leftChartType === 'D1') return isHi ? 'लग्न कुंडली (D-1 Rasi)' : 'Lagna Chart (D-1 Rasi)';
    if (leftChartType === 'CHALIT') return isHi ? 'भाव चलित (श्रीपति)' : 'Bhava Chalit (Sripati)';
    if (leftChartType === 'D9') return isHi ? 'नवांश कुंडली (D-9)' : 'Navamsha Chart (D-9)';
    return isHi ? 'गोचर कुंडली (Live Transit)' : 'Live Transit (Gochar)';
  }, [leftChartType, isHi]);

  const renderPredictiveDomainCard = (dom: PredictiveDomainDetail) => (
    <article key={dom.id} className="domain-card" style={{ borderLeft: '3px solid var(--accent)' }}>
      <div className="domain-top">
        <div>
          <h4>{isHi ? dom.titleHi : dom.titleEn}</h4>
          <span className="tag tag-strong mono">{dom.score}% {isHi ? 'सामर्थ्य' : 'Score'}</span>
        </div>
      </div>

      <div className="gochar-banner is-info" style={{ marginTop: 8, padding: '6px 10px', fontSize: '11.5px' }}>
        <strong>📜 {isHi ? 'शास्त्रीय प्रमाण:' : 'Classical Shastra:'}</strong> {dom.classicalSource}
        {dom.shlokaRef && <div className="mono small-text" style={{ marginTop: 2, color: 'var(--accent)' }}>{dom.shlokaRef}</div>}
      </div>

      <div style={{ marginTop: 10, padding: '8px 12px', background: 'var(--bg-subtle)', borderRadius: '6px', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
        🎯 {isHi ? dom.verdictHi : dom.verdictEn}
      </div>

      <div style={{ marginTop: 10 }}>
        <strong style={{ fontSize: '12px', color: 'var(--good)' }}>{isHi ? 'विस्तृत शास्त्रीय विवेचन:' : 'Detailed Shastric Analysis:'}</strong>
        <ul style={{ margin: '6px 0 0 16px', padding: 0, fontSize: '12px', lineHeight: 1.6 }}>
          {(isHi ? dom.detailedAnalysisHi : dom.detailedAnalysisEn).map((pt, i) => (
            <li key={i}>{pt}</li>
          ))}
        </ul>
      </div>

      {dom.conditionalBranchesHi && dom.conditionalBranchesHi.length > 0 && (
        <div style={{ marginTop: 10, padding: '8px 12px', background: 'rgba(234, 179, 8, 0.08)', border: '1px solid rgba(234, 179, 8, 0.25)', borderRadius: '6px' }}>
          <strong style={{ fontSize: '12px', color: 'var(--warn)' }}>⚖️ {isHi ? 'यथार्थवादी परिस्थितियां एवं जीवन शाखाएं:' : 'Realistic Conditional Scenarios:'}</strong>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
            {(isHi ? dom.conditionalBranchesHi : dom.conditionalBranchesEn).map((br, i) => (
              <div key={i} style={{ fontSize: '11.5px', lineHeight: 1.5 }}>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>• {br.condition}:</span>{' '}
                <span className="muted">{br.outcome}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {dom.remediesHi && dom.remediesHi.length > 0 && (
        <div style={{ marginTop: 10 }}>
          <strong style={{ fontSize: '12px', color: 'var(--accent)' }}>🕉️ {isHi ? 'सटीक शास्त्रीय उपाय:' : 'Tailored Vedic Remedies:'}</strong>
          <ul style={{ margin: '4px 0 0 16px', padding: 0, fontSize: '11.5px', color: 'var(--muted)' }}>
            {(isHi ? dom.remediesHi : dom.remediesEn).map((rem, i) => (
              <li key={i}>{rem}</li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );

  // Master Menus Definition
  const masterMenus: Array<{
    id: WorkstationMenuId;
    labelHi: string;
    labelEn: string;
    icon: string;
    badge?: string;
  }> = [
    { id: 'sarini', labelHi: 'ज्योतिष सारिणी व विवरण', labelEn: 'Basic & Avakhada Sheet', icon: '📋' },
    { id: 'charts_tables', labelHi: 'वर्ग चक्र व तालिकायें', labelEn: 'Charts & Tables (D1–D60)', icon: '📊' },
    { id: 'dasha', labelHi: 'दशा प्रणाली (विंशोत्तरी/योगिनी)', labelEn: 'Dasha Systems (5 Levels)', icon: '⏳' },
    { id: 'varshphal', labelHi: 'वर्षफल / ताजिक वार्षिक', labelEn: 'Varshphal / Tajika Solar', icon: '☀️' },
    { id: 'chakras', labelHi: 'विविध वैदिक चक्र (सुदर्शन/कोट)', labelEn: 'Vedic Chakras (Kota/Kurma)', icon: '☸️' },
    { id: 'yogas_doshas', labelHi: 'योग, दोष एवं युति', labelEn: 'Yogas, Doshas & Yuti', icon: '⚡' },
    { id: 'navamsha', labelHi: 'नवांश विशेष विवेचन (D9)', labelEn: 'Navamsha D9 Deep Reading', icon: '🌟' },
    { id: 'kp_system', labelHi: 'के.पी. (KP) ज्योतिष प्रणाली', labelEn: 'KP System & Sub-Lords', icon: '🎯', badge: 'KP' },
    { id: 'lal_kitab', labelHi: 'लाल किताब (टेवा व उपाय)', labelEn: 'Lal Kitab System & Debts', icon: '📕', badge: 'LK' },
    { id: 'predictions', labelHi: 'सटीक जीवन फलकथन', labelEn: 'Deep Predictive Analysis', icon: '🔮' },
    { id: 'past_future', labelHi: 'पूर्व जन्म व भावी गति (D60)', labelEn: 'Past Life & Future Rebirth', icon: '🌌' },
    { id: 'matchmaking', labelHi: 'कुंडली मिलान (अष्टकूट)', labelEn: 'Kundali Match Making (36)', icon: '💍' },
    { id: 'remedies', labelHi: 'सम्पूर्ण शास्त्रीय उपाय', labelEn: 'Comprehensive Remedies', icon: '🕉️' },
    { id: 'panchang', labelHi: 'दैनिक पंचांग व मुहूर्त', labelEn: 'Daily Panchang & Muhurta', icon: '📅' },
  ];

  return (
    <div className="vedic-master-workstation view-stack" style={{ width: '100%', maxWidth: '100%' }}>
      {/* 1. TOP NATIVE CONSOLE BANNER */}
      <div
        className="card"
        style={{
          padding: '12px 18px',
          background: 'var(--bg-elevated)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px 20px',
          borderLeft: '4px solid var(--accent)',
          borderRadius: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={20} style={{ color: 'var(--accent)' }} />
            <div>
              <span style={{ fontWeight: 800, fontSize: '16px' }}>{chart.input.name}</span>
              <span className="muted small-text" style={{ marginLeft: 8 }}>
                ({chart.input.gender ? (isHi ? (chart.input.gender === 'male' ? 'पुरुष' : 'महिला') : chart.input.gender.toUpperCase()) : ''})
              </span>
            </div>
          </div>
          <div className="muted small-text" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span>📅 {formatDateDmy(chart.input.date)} {chart.input.time}</span>
            <span>📍 {chart.input.city}, {chart.input.country}</span>
            <span className="mono">({Math.abs(chart.input.latitude).toFixed(2)}°{chart.input.latitude >= 0 ? 'N' : 'S'}, {Math.abs(chart.input.longitude).toFixed(2)}°{chart.input.longitude >= 0 ? 'E' : 'W'})</span>
            <span className="tag tag-varg mono">{chart.settings.ayanamsa.toUpperCase()}</span>
          </div>
        </div>

        {/* Profile Switcher & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {profiles.length > 1 && (
            <select
              className="select-input"
              value={activeProfileId}
              onChange={(e) => onSelectProfile(e.target.value)}
              style={{ padding: '4px 8px', fontSize: '12px', height: '32px' }}
              title={isHi ? 'कुंडली बदलें' : 'Switch Native Profile'}
            >
              {profiles.map((p) => (
                <option key={p.id} value={p.id}>
                  👤 {p.name} ({p.date})
                </option>
              ))}
            </select>
          )}

          {onOpenEditor && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={onOpenEditor}
              title={isHi ? 'जन्म विवरण संशोधित करें' : 'Edit Birth Details'}
            >
              <Edit3 size={13} />
              <span>{isHi ? 'विवरण बदलें' : 'Edit Data'}</span>
            </button>
          )}

          {onOpenBooklet && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={onOpenBooklet}
              title={isHi ? '34-अध्यायी बृहत् पत्रिका PDF' : 'Patrika PDF'}
            >
              <FileText size={13} />
              <span>{isHi ? 'पत्रिका PDF' : 'Patrika PDF'}</span>
            </button>
          )}

          {onChangeChartStyle && (
            <div style={{ display: 'flex', gap: '3px' }}>
              <button
                type="button"
                className={`btn btn-sm ${chartStyle === 'north' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => onChangeChartStyle('north')}
                style={{ padding: '3px 7px', fontSize: '11px' }}
                title="North Indian"
              >
                {isHi ? 'उत्तर' : 'North'}
              </button>
              <button
                type="button"
                className={`btn btn-sm ${chartStyle === 'south' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => onChangeChartStyle('south')}
                style={{ padding: '3px 7px', fontSize: '11px' }}
                title="South Indian"
              >
                {isHi ? 'दक्षिण' : 'South'}
              </button>
              <button
                type="button"
                className={`btn btn-sm ${chartStyle === 'east' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => onChangeChartStyle('east')}
                style={{ padding: '3px 7px', fontSize: '11px' }}
                title="East Indian"
              >
                {isHi ? 'पूर्व' : 'East'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. MAIN SPLIT WORKSPACE: LEFT PERSISTENT PANE + RIGHT MODULAR TABS */}
      <div className="workstation-split-layout">
        {/* ========================================================= */}
        {/* LEFT COLUMN: INTERACTIVE CHARTS, DASHA, STRENGTH & PLANETS */}
        {/* ========================================================= */}
        <aside className="workstation-left-pane">
          {/* A. Fast Interactive Kundali Viewport */}
          <section className="workstation-card">
            <div className="dossier-chart-nav-pills">
              <button
                type="button"
                className={`chart-pill-btn ${leftChartType === 'D1' ? 'active' : ''}`}
                onClick={() => setLeftChartType('D1')}
              >
                🏛️ {isHi ? 'D-1 लग्न' : 'D-1 Lagna'}
              </button>
              <button
                type="button"
                className={`chart-pill-btn ${leftChartType === 'CHALIT' ? 'active' : ''}`}
                onClick={() => setLeftChartType('CHALIT')}
              >
                ⚖️ {isHi ? 'भाव चलित' : 'Chalit'}
              </button>
              <button
                type="button"
                className={`chart-pill-btn ${leftChartType === 'D9' ? 'active' : ''}`}
                onClick={() => setLeftChartType('D9')}
              >
                💎 {isHi ? 'D-9 नवांश' : 'D-9 Navamsha'}
              </button>
              <button
                type="button"
                className={`chart-pill-btn ${leftChartType === 'GOCHAR' ? 'active' : ''}`}
                onClick={() => setLeftChartType('GOCHAR')}
              >
                🌌 {isHi ? 'गोचर' : 'Gochar'}
              </button>
            </div>

            <div className="dossier-svg-wrapper">
              <VedicChartSvg
                title={leftChartTitle}
                style={chartStyle}
                lagnaSignIndex={leftLagnaSignIndex}
                items={leftChartBadges}
                savBindus={showSavPoints ? chart.ashtakavarga?.sarva : undefined}
                centerLabel={leftChartType}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, fontSize: '11px', color: 'var(--text-muted)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={showSpecialPoints}
                  onChange={(e) => setShowSpecialPoints(e.target.checked)}
                />
                <span>{isHi ? 'विशेष बिंदु (मांदि/गुलिक)' : 'Special Points'}</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={showSavPoints}
                  onChange={(e) => setShowSavPoints(e.target.checked)}
                />
                <span>{isHi ? 'SAV बिंदु' : 'SAV Points'}</span>
              </label>
            </div>
          </section>

          {/* B. Active Running Dasha Card */}
          <section className="workstation-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ fontWeight: 700, fontSize: '13px', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Clock size={15} style={{ color: 'var(--accent)' }} />
                <span>{isHi ? 'सक्रिय विंशोत्तरी दशा' : 'Active Vimshottari Dasha'}</span>
              </div>
              <span className="tag tag-varg small-text">5-Level Live</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', textAlign: 'center' }}>
              {activeDashaSummary.maha && (
                <div style={{ padding: '6px 4px', background: 'var(--bg-subtle)', borderRadius: '6px', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>MD (महादशा)</div>
                  <div style={{ fontWeight: 700, color: 'var(--accent)' }}>{trPlanet(activeDashaSummary.maha.lord as PlanetId, lang)}</div>
                  <div style={{ fontSize: '9.5px', color: 'var(--text-muted)' }}>तक {formatDateDmy(new Date(activeDashaSummary.maha.endMs).toISOString().split('T')[0])}</div>
                </div>
              )}
              {activeDashaSummary.antar && (
                <div style={{ padding: '6px 4px', background: 'var(--bg-subtle)', borderRadius: '6px', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>AD (अंतर्दशा)</div>
                  <div style={{ fontWeight: 700, color: 'var(--good)' }}>{trPlanet(activeDashaSummary.antar.lord as PlanetId, lang)}</div>
                  <div style={{ fontSize: '9.5px', color: 'var(--text-muted)' }}>तक {formatDateDmy(new Date(activeDashaSummary.antar.endMs).toISOString().split('T')[0])}</div>
                </div>
              )}
              {activeDashaSummary.pratyantar && (
                <div style={{ padding: '6px 4px', background: 'var(--bg-subtle)', borderRadius: '6px', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>PD (प्रत्यंतर)</div>
                  <div style={{ fontWeight: 700, color: 'var(--indigo)' }}>{trPlanet(activeDashaSummary.pratyantar.lord as PlanetId, lang)}</div>
                  <div style={{ fontSize: '9.5px', color: 'var(--text-muted)' }}>तक {formatDateDmy(new Date(activeDashaSummary.pratyantar.endMs).toISOString().split('T')[0])}</div>
                </div>
              )}
            </div>
          </section>

          {/* C. Strength & Telemetry Strip */}
          <section className="workstation-card">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', fontSize: '11.5px' }}>
              <div style={{ padding: '6px 8px', background: 'var(--bg-subtle)', borderRadius: '6px' }}>
                <span className="muted">{isHi ? 'लग्न राशि:' : 'Asc Sign:'} </span>
                <strong>{trSign(chart.ascendant.signIndex, lang)} ({chart.ascendant.dms})</strong>
              </div>
              <div style={{ padding: '6px 8px', background: 'var(--bg-subtle)', borderRadius: '6px' }}>
                <span className="muted">{isHi ? 'चंद्र राशि:' : 'Moon Sign:'} </span>
                <strong>{trSign(chart.planets.find(p => p.id === 'Moon')?.signIndex ?? 0, lang)}</strong>
              </div>
              <div style={{ padding: '6px 8px', background: 'var(--bg-subtle)', borderRadius: '6px' }}>
                <span className="muted">{isHi ? 'नक्षत्र:' : 'Nakshatra:'} </span>
                <strong>{trTerm(chart.planets.find(p => p.id === 'Moon')?.nakshatraName ?? '', lang)} (प{chart.planets.find(p => p.id === 'Moon')?.pada})</strong>
              </div>
              <div style={{ padding: '6px 8px', background: 'var(--bg-subtle)', borderRadius: '6px' }}>
                <span className="muted">{isHi ? 'लग्न SAV:' : 'Lagna SAV:'} </span>
                <strong className="mono">{chart.ashtakavarga?.sarva[chart.ascendant.signIndex] ?? 28} / 337</strong>
              </div>
            </div>
          </section>

          {/* D. Compact Grah Stithi (Planetary Positions Table) */}
          <section className="workstation-card" style={{ padding: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontWeight: 700, fontSize: '12.5px' }}>
                {isHi ? 'ग्रह स्थिति तालिका (Grah Stithi)' : 'Planetary Positions Table'}
              </span>
              <span className="muted small-text">{chart.planets.length + 1} {isHi ? 'ग्रह' : 'bodies'}</span>
            </div>

            <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
              <table className="data-table" style={{ fontSize: '11px', width: '100%', minWidth: '340px' }}>
                <thead>
                  <tr>
                    <th>{isHi ? 'ग्रह' : 'Graha'}</th>
                    <th>{isHi ? 'राशि' : 'Rasi'}</th>
                    <th>{isHi ? 'अंश' : 'Deg'}</th>
                    <th>{isHi ? 'नक्षत्र' : 'Nak'}</th>
                    <th>{isHi ? 'स्थिति' : 'State'}</th>
                    <th>{isHi ? 'गरिमा' : 'Dignity'}</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Ascendant */}
                  <tr style={{ background: 'var(--bg-subtle)', fontWeight: 600 }}>
                    <td>{trPlanet('Asc', lang)}</td>
                    <td>{trSign(chart.ascendant.signIndex, lang)}</td>
                    <td className="mono">{chart.ascendant.dms}</td>
                    <td>{trTerm(chart.ascendant.nakshatraName, lang).slice(0, 6)} {chart.ascendant.pada}</td>
                    <td>-</td>
                    <td><span className="dignity-badge badge-neutral">{isHi ? 'लग्न' : 'Lagna'}</span></td>
                  </tr>

                  {/* 9 Planets */}
                  {chart.planets.map((p) => {
                    const isExalted = p.dignity === 'Exalted';
                    const isDebilitated = p.dignity === 'Debilitated';
                    const isOwn = p.dignity === 'Own Sign';

                    return (
                      <tr key={p.id}>
                        <td>
                          <strong>{trPlanet(p.id, lang)}</strong>
                          {p.isRetrograde && <span style={{ color: 'var(--bad)', marginLeft: 3 }} title="Retrograde">℞</span>}
                          {p.isCombust && <span style={{ color: 'var(--warn)', marginLeft: 3 }} title="Combust">🔥</span>}
                        </td>
                        <td>{trSign(p.signIndex, lang)}</td>
                        <td className="mono">{p.dms}</td>
                        <td>{trTerm(p.nakshatraName, lang).slice(0, 6)} {p.pada}</td>
                        <td>
                          {p.isRetrograde ? (isHi ? 'व' : 'R') : (isHi ? 'मा' : 'D')}
                          {p.isCombust ? (isHi ? '/अ' : '/C') : ''}
                        </td>
                        <td>
                          <span className={`dignity-badge ${isExalted ? 'badge-good' : isDebilitated ? 'badge-bad' : isOwn ? 'badge-blue' : 'badge-neutral'}`}>
                            {trTerm(p.dignity, lang)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </aside>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: 13 DEDICATED MODULAR MENUS                   */}
        {/* ========================================================= */}
        <main className="workstation-main-pane">
          {/* Horizontal Master Tab Bar (13 Menus) */}
          <nav className="workstation-tab-bar" role="tablist" aria-label="Workstation Menus">
            {masterMenus.map((m) => (
              <button
                key={m.id}
                type="button"
                className={`workstation-tab-btn ${activeMenu === m.id ? 'active' : ''}`}
                onClick={() => setActiveMenu(m.id)}
                role="tab"
                aria-selected={activeMenu === m.id}
              >
                <span>{m.icon}</span>
                <span>{isHi ? m.labelHi : m.labelEn}</span>
                {m.badge && <span className="workstation-tab-badge">{m.badge}</span>}
              </button>
            ))}
          </nav>

          {/* ========================================================= */}
          {/* MENU 1: ज्योतिष सारिणी व मूल विवरण (SARINI & BASICS)      */}
          {/* ========================================================= */}
          {activeMenu === 'sarini' && (
            <div className="view-stack">
              {/* 1. Basic Birth Details */}
              <section className="panel">
                <div className="panel-header">
                  <h3>
                    <Layers size={16} />{' '}
                    {isHi ? 'जन्म विवरण (Person Details)' : 'Birth & Person Details'}
                  </h3>
                  <span className="muted small-text">{chart.input.name}</span>
                </div>
                <div className="table-scroll">
                  <table className="data-table">
                    <tbody>
                      {basicSheet.personDetails.map((row) => (
                        <tr key={row.key}>
                          <td style={{ width: '35%', fontWeight: 600 }}>{isHi ? row.labelHi : row.labelEn}</td>
                          <td className={row.mono ? 'mono' : ''}>{isHi ? row.valueHi : row.valueEn}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* 2. Avakhada Chakra Table */}
              <section className="panel">
                <div className="panel-header">
                  <h3>
                    <Star size={16} />{' '}
                    {isHi ? 'अवकहड़ा चक्र (Avakhada Details)' : 'Avakhada Chakra Details'}
                  </h3>
                </div>
                <div className="table-scroll">
                  <table className="data-table">
                    <tbody>
                      {basicSheet.avakhadaDetails.map((row) => (
                        <tr key={row.key}>
                          <td style={{ width: '35%', fontWeight: 600 }}>{isHi ? row.labelHi : row.labelEn}</td>
                          <td className={row.mono ? 'mono' : ''}>{isHi ? row.valueHi : row.valueEn}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* 3. Ghatak Chakra & 4. Favourable Points */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                <section className="panel">
                  <div className="panel-header">
                    <h3>
                      <ShieldAlert size={16} />{' '}
                      {isHi ? 'घातक चक्र (Ghatak Chakra)' : 'Ghatak Inauspicious Periods'}
                    </h3>
                  </div>
                  <div className="table-scroll">
                    <table className="data-table">
                      <tbody>
                        {basicSheet.ghatakMalefics.map((row) => (
                          <tr key={row.key}>
                            <td style={{ fontWeight: 600 }}>{isHi ? row.labelHi : row.labelEn}</td>
                            <td>{isHi ? row.valueHi : row.valueEn}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                <section className="panel">
                  <div className="panel-header">
                    <h3>
                      <Sparkles size={16} />{' '}
                      {isHi ? 'शुभ तत्व व अनुकूलता (Favourable Points)' : 'Auspicious & Favourable Points'}
                    </h3>
                  </div>
                  <div className="table-scroll">
                    <table className="data-table">
                      <tbody>
                        {basicSheet.favourablePoints.map((row) => (
                          <tr key={row.key}>
                            <td style={{ fontWeight: 600 }}>{isHi ? row.labelHi : row.labelEn}</td>
                            <td>{isHi ? row.valueHi : row.valueEn}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* MENU 2: कुंडली व वर्ग चक्र (CHARTS & TABLES D1-D60)       */}
          {/* ========================================================= */}
          {activeMenu === 'charts_tables' && (
            <div className="view-stack">
              <div className="subtab-bar" style={{ marginBottom: 12 }}>
                <button
                  type="button"
                  className={`subtab-btn ${chartsSubTab === 'vargas' ? 'is-active' : ''}`}
                  onClick={() => setChartsSubTab('vargas')}
                >
                  <Grid3x3 size={14} /> {isHi ? 'षोडशवर्ग चक्र (D1-D60)' : 'Shodashavarga (D1-D60)'}
                </button>
                <button
                  type="button"
                  className={`subtab-btn ${chartsSubTab === 'ashtakavarga' ? 'is-active' : ''}`}
                  onClick={() => setChartsSubTab('ashtakavarga')}
                >
                  <Star size={14} /> {isHi ? 'अष्टकवर्ग (SAV/BAV)' : 'Ashtakavarga'}
                </button>
                <button
                  type="button"
                  className={`subtab-btn ${chartsSubTab === 'chalit' ? 'is-active' : ''}`}
                  onClick={() => setChartsSubTab('chalit')}
                >
                  <Compass size={14} /> {isHi ? 'श्रीपति भाव चलित' : 'Sripati Chalit'}
                </button>
                <button
                  type="button"
                  className={`subtab-btn ${chartsSubTab === 'shadbala' ? 'is-active' : ''}`}
                  onClick={() => setChartsSubTab('shadbala')}
                >
                  <Zap size={14} /> {isHi ? 'षड्बल तालिका' : 'Shadbala Strengths'}
                </button>
              </div>

              {chartsSubTab === 'vargas' && (
                <div className="view-stack">
                  {/* Divisional Selector Pills */}
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: 12 }}>
                    {(Object.keys(chart.divisionalCharts) as DivisionalChartId[]).map((vid) => {
                      const v = chart.divisionalCharts[vid];
                      return (
                        <button
                          key={vid}
                          type="button"
                          className={`btn-tag ${selectedVargaId === vid ? 'active' : ''}`}
                          onClick={() => setSelectedVargaId(vid)}
                          style={{ padding: '6px 12px', fontSize: '12px' }}
                        >
                          <strong>{vid}</strong> · {isHi ? v.name : v.name}
                        </button>
                      );
                    })}
                  </div>

                  {/* SVG & Placements View */}
                  {chart.divisionalCharts[selectedVargaId] && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
                      <div className="workstation-card" style={{ display: 'flex', justifyContent: 'center' }}>
                        <VedicChartSvg
                          title={`${selectedVargaId}: ${chart.divisionalCharts[selectedVargaId].name}`}
                          subtitle={chart.divisionalCharts[selectedVargaId].signification}
                          style={chartStyle}
                          lagnaSignIndex={chart.divisionalCharts[selectedVargaId].lagnaSignIndex}
                          centerLabel={selectedVargaId}
                          items={chart.divisionalCharts[selectedVargaId].placements.map((p) => ({
                            id: p.id,
                            label: trPlanetShort(p.id, lang),
                            signIndex: p.signIndex,
                            isLagna: p.id === 'Asc',
                            isRetrograde: p.isRetrograde,
                            dignity: p.dignity,
                          }))}
                        />
                      </div>

                      <section className="panel">
                        <div className="panel-header">
                          <h3>{selectedVargaId} {isHi ? 'ग्रह स्थिति' : 'Placements'}</h3>
                          <span className="tag tag-karaka">{chart.divisionalCharts[selectedVargaId].signification}</span>
                        </div>
                        <div className="table-scroll">
                          <table className="data-table">
                            <thead>
                              <tr>
                                <th>{isHi ? 'ग्रह' : 'Graha'}</th>
                                <th>{isHi ? 'वर्ग राशि' : 'Sign'}</th>
                                <th>{isHi ? 'भाव' : 'House'}</th>
                                <th>{isHi ? 'गरिमा' : 'Dignity'}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {chart.divisionalCharts[selectedVargaId].placements.map((pl) => (
                                <tr key={pl.id}>
                                  <td><strong>{trPlanet(pl.id, lang)}</strong></td>
                                  <td>{trSign(pl.signIndex, lang)}</td>
                                  <td>{pl.houseFromVargaLagna}</td>
                                  <td><span className="dignity-badge badge-neutral">{trTerm(pl.dignity, lang)}</span></td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </section>
                    </div>
                  )}
                </div>
              )}

              {chartsSubTab === 'ashtakavarga' && (
                <AshtakavargaView chart={chart} chartStyle={chartStyle} />
              )}

              {chartsSubTab === 'chalit' && (
                <section className="panel">
                  <div className="panel-header">
                    <h3>
                      <Compass size={16} />{' '}
                      {isHi ? 'श्रीपति भाव चलित तालिका (आरंभ, मध्य एवं संधि)' : 'Sripati Bhava Chalit Cusp Table'}
                    </h3>
                    <span className="tag tag-varg">
                      {chalitData.shiftedBodies.length} {isHi ? 'ग्रह राशि से भाव परिवर्तित' : 'shifted from Rasi'}
                    </span>
                  </div>
                  <div className="table-scroll">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>{isHi ? 'ग्रह / बिंदु' : 'Body'}</th>
                          <th>{isHi ? 'राशि भाव' : 'Rasi H'}</th>
                          <th>{isHi ? 'चलित भाव' : 'Chalit H'}</th>
                          <th>{isHi ? 'अंश (DMS)' : 'Degree'}</th>
                          <th>{isHi ? 'भाव परिवर्तन' : 'Shift'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {chalitData.placements.map((p) => (
                          <tr key={p.id}>
                            <td><strong>{trPlanet(p.id, lang)}</strong></td>
                            <td>{isHi ? `भाव ${p.rasiHouse}` : `H${p.rasiHouse}`}</td>
                            <td style={{ fontWeight: 700, color: p.shifted ? 'var(--accent)' : undefined }}>
                              {isHi ? `भाव ${p.chalitHouse}` : `H${p.chalitHouse}`}
                            </td>
                            <td className="mono">{p.dms}</td>
                            <td>
                              {p.shifted ? (
                                <span className="tag tag-combust">
                                  {isHi ? `भाव ${p.rasiHouse} → भाव ${p.chalitHouse}` : `Shifted ${p.rasiHouse} → ${p.chalitHouse}`}
                                </span>
                              ) : (
                                <span className="muted">{isHi ? 'यथावत' : 'Same'}</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              {chartsSubTab === 'shadbala' && (
                <section className="panel">
                  <div className="panel-header">
                    <h3>
                      <Zap size={16} />{' '}
                      {isHi ? 'षड्बल विस्तृत विश्लेषण (छह प्रकार के बल)' : 'Detailed Shadbala 6-Fold Strength Matrix'}
                    </h3>
                  </div>
                  <div className="table-scroll">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>{isHi ? 'ग्रह' : 'Graha'}</th>
                          <th>{isHi ? 'स्थान' : 'Sthana'}</th>
                          <th>{isHi ? 'दिग्' : 'Dig'}</th>
                          <th>{isHi ? 'काल' : 'Kala'}</th>
                          <th>{isHi ? 'चेष्टा' : 'Chesta'}</th>
                          <th>{isHi ? 'नैसर्गिक' : 'Naisargika'}</th>
                          <th>{isHi ? 'दृक्' : 'Drik'}</th>
                          <th>{isHi ? 'कुल रूप' : 'Rupas'}</th>
                          <th>{isHi ? 'आवश्यक' : 'Req.'}</th>
                          <th>{isHi ? 'प्रतिशत' : 'Ratio'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {chart.shadbala.map((sb) => (
                          <tr key={sb.planet}>
                            <td><strong>{trPlanet(sb.planet, lang)}</strong></td>
                            <td className="mono">{sb.sthanaBala.toFixed(1)}</td>
                            <td className="mono">{sb.digBala.toFixed(1)}</td>
                            <td className="mono">{sb.kalaBala.toFixed(1)}</td>
                            <td className="mono">{sb.cheshtaBala.toFixed(1)}</td>
                            <td className="mono">{sb.naisargikaBala.toFixed(1)}</td>
                            <td className="mono">{sb.drikBala.toFixed(1)}</td>
                            <td className="mono" style={{ fontWeight: 700, color: 'var(--accent)' }}>{sb.totalRupas.toFixed(2)}</td>
                            <td className="mono">{sb.requiredRupas.toFixed(1)}</td>
                            <td>
                              <span className={`tag ${sb.ratio >= 1.0 ? 'tag-strong' : 'tag-combust'}`}>
                                {(sb.ratio * 100).toFixed(0)}%
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* MENU 3: दशा प्रणाली (DASHA SYSTEMS)                        */}
          {/* ========================================================= */}
          {activeMenu === 'dasha' && (
            <DashaView chart={chart} />
          )}

          {/* ========================================================= */}
          {/* MENU 4: वर्षफल / ताजिक (VARSHPHAL / TAJIKA SOLAR)         */}
          {/* ========================================================= */}
          {activeMenu === 'varshphal' && (
            <div className="view-stack">
              <div className="card" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Sun size={20} style={{ color: 'var(--accent)' }} />
                  <div>
                    <span style={{ fontWeight: 700, fontSize: '15px' }}>
                      {isHi ? `ताजिक वर्षफल — वर्ष ${varshYear} (आयु ${varshYear - birthYear} वर्ष)` : `Tajika Varshaphala — Year ${varshYear} (Age ${varshYear - birthYear})`}
                    </span>
                    <div className="muted small-text">
                      {isHi ? 'सौर संक्रांति चक्र व वर्षेश विश्लेषण' : 'Exact Solar Return Longitude and Year Lord'}
                    </div>
                  </div>
                </div>

                {/* Target Year Selector */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="small-text">{isHi ? 'वर्ष चुनें:' : 'Select Year:'}</span>
                  <select
                    className="select-input"
                    value={varshYear}
                    onChange={(e) => setVarshYear(parseInt(e.target.value, 10))}
                    style={{ padding: '5px 10px', fontSize: '13px' }}
                  >
                    {Array.from({ length: 90 }, (_, i) => birthYear + i).map((yr) => (
                      <option key={yr} value={yr}>
                        {yr} ({isHi ? `आयु ${yr - birthYear}` : `Age ${yr - birthYear}`})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Varshphal Metrics Strip */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                <div className="workstation-card">
                  <div className="muted small-text">{isHi ? 'मुन्था (Muntha)' : 'Muntha Position'}</div>
                  <div style={{ fontWeight: 800, fontSize: '16px', color: 'var(--accent)' }}>
                    {trSign(varshaphalaReport.munthaSignIndex, lang)} ({isHi ? `भाव ${varshaphalaReport.munthaHouse}` : `H${varshaphalaReport.munthaHouse}`})
                  </div>
                  <div className="small-text muted">{isHi ? `मुन्था स्वामी: ${trPlanet(varshaphalaReport.panchadhikari.munthaLord, lang)}` : `Lord: ${varshaphalaReport.panchadhikari.munthaLord}`}</div>
                </div>

                <div className="workstation-card">
                  <div className="muted small-text">{isHi ? 'वर्षेश (Lord of the Year)' : 'Varshesh (Year Lord)'}</div>
                  <div style={{ fontWeight: 800, fontSize: '16px', color: 'var(--good)' }}>
                    {trPlanet(varshaphalaReport.varshesh, lang)}
                  </div>
                  <div className="small-text muted">{varshaphalaReport.varsheshStrengthNote}</div>
                </div>

                <div className="workstation-card">
                  <div className="muted small-text">{isHi ? 'वर्ष लग्न' : 'Varsha Lagna'}</div>
                  <div style={{ fontWeight: 800, fontSize: '16px', color: 'var(--indigo)' }}>
                    {trSign(varshaphalaReport.varshaChart.ascendant.signIndex, lang)} ({varshaphalaReport.varshaChart.ascendant.dms})
                  </div>
                  <div className="small-text muted">{isHi ? `लग्न स्वामी: ${trPlanet(varshaphalaReport.panchadhikari.varshaAscLord, lang)}` : `Lord: ${varshaphalaReport.panchadhikari.varshaAscLord}`}</div>
                </div>
              </div>

              {/* Tajika Sahams & Mudda Dasha */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
                <section className="panel">
                  <div className="panel-header">
                    <h3>
                      <Sparkles size={16} />{' '}
                      {isHi ? 'महत्वपूर्ण ताजिक सहम (Tajika Sahams)' : 'Key Tajika Sahams'}
                    </h3>
                  </div>
                  <div className="table-scroll">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>{isHi ? 'सहम नाम' : 'Saham'}</th>
                          <th>{isHi ? 'राशि' : 'Sign'}</th>
                          <th>{isHi ? 'अंश' : 'Degree'}</th>
                          <th>{isHi ? 'भाव' : 'House'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {varshaphalaReport.sahams.map((s) => (
                          <tr key={s.nameEn}>
                            <td><strong>{isHi ? s.nameHi : s.nameEn}</strong></td>
                            <td>{trSign(s.signIndex, lang)}</td>
                            <td className="mono">{s.dms}</td>
                            <td>{s.house}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                <section className="panel">
                  <div className="panel-header">
                    <h3>
                      <Clock size={16} />{' '}
                      {isHi ? 'मुद्दा दशा (Mudda Dasha 365 Days)' : 'Mudda Annual Dasha'}
                    </h3>
                  </div>
                  <div className="table-scroll">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>{isHi ? 'दशा स्वामी' : 'Lord'}</th>
                          <th>{isHi ? 'अवधि' : 'Days'}</th>
                          <th>{isHi ? 'आरंभ' : 'Start'}</th>
                          <th>{isHi ? 'समाप्ति' : 'End'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {varshaphalaReport.muddaDasha.map((m) => (
                          <tr key={m.lord}>
                            <td><strong>{trPlanet(m.lord, lang)}</strong></td>
                            <td>{m.days} {isHi ? 'दिन' : 'days'}</td>
                            <td className="mono">{formatDateDmy(m.startDate)}</td>
                            <td className="mono">{formatDateDmy(m.endDate)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* MENU 5: विविध वैदिक चक्र (VEDIC CHAKRAS)                   */}
          {/* ========================================================= */}
          {activeMenu === 'chakras' && (
            <div className="view-stack">
              <div className="subtab-bar" style={{ marginBottom: 12 }}>
                <button
                  type="button"
                  className={`subtab-btn ${chakrasSubTab === 'sudarshan' ? 'is-active' : ''}`}
                  onClick={() => setChakrasSubTab('sudarshan')}
                >
                  ☸️ {isHi ? 'सुदर्शन चक्र (त्रिवलय)' : 'Sudarshan Chakra'}
                </button>
                <button
                  type="button"
                  className={`subtab-btn ${chakrasSubTab === 'sarvatobhadra' ? 'is-active' : ''}`}
                  onClick={() => setChakrasSubTab('sarvatobhadra')}
                >
                  🛡️ {isHi ? 'सर्वतोभद्र चक्र (वेध)' : 'Sarvatobhadra Chakra'}
                </button>
                <button
                  type="button"
                  className={`subtab-btn ${chakrasSubTab === 'kota' ? 'is-active' : ''}`}
                  onClick={() => setChakrasSubTab('kota')}
                >
                  🏰 {isHi ? 'कोट चक्र (दुर्ग सुरक्षा)' : 'Kota Chakra'}
                </button>
                <button
                  type="button"
                  className={`subtab-btn ${chakrasSubTab === 'kurma' ? 'is-active' : ''}`}
                  onClick={() => setChakrasSubTab('kurma')}
                >
                  🐢 {isHi ? 'कूर्म चक्र (दिशा बल)' : 'Kurma Chakra'}
                </button>
              </div>

              {chakrasSubTab === 'sudarshan' && (
                <div className="view-stack">
                  <div className="gochar-banner is-info">
                    <strong>{isHi ? 'सुदर्शन चक्र वार्षिक फलादेश:' : 'Sudarshan Tripartite Annual Reading:'}</strong>{' '}
                    {isHi ? sudarshanData.annualSynthesisHi : sudarshanData.annualSynthesisEn}
                  </div>

                  <section className="panel">
                    <div className="panel-header">
                      <h3>{isHi ? 'सुदर्शन चक्र 12 भाव संरेखण तालिका' : 'Sudarshan Chakra 12 House Alignment Table'}</h3>
                      <span className="tag tag-karaka">{isHi ? `सक्रिय भाव: ${sudarshanData.activeHouse}` : `Active House: ${sudarshanData.activeHouse}`}</span>
                    </div>
                    <div className="table-scroll">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>{isHi ? 'भाव' : 'House'}</th>
                            <th>{isHi ? 'लग्न वलय (Lagna Wheel)' : 'Lagna Sign'}</th>
                            <th>{isHi ? 'चंद्र वलय (Moon Wheel)' : 'Moon Sign'}</th>
                            <th>{isHi ? 'सूर्य वलय (Sun Wheel)' : 'Sun Sign'}</th>
                            <th>{isHi ? 'संयुक्त स्थिति' : 'Active Status'}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sudarshanData.houses.map((h) => {
                            const isActive = h.houseNumber === sudarshanData.activeHouse;
                            return (
                              <tr key={h.houseNumber} style={{ background: isActive ? 'var(--accent-soft)' : undefined, fontWeight: isActive ? 600 : undefined }}>
                                <td><strong>{isHi ? `भाव ${h.houseNumber}` : `H${h.houseNumber}`}</strong> {isActive && '⭐'}</td>
                                <td>{trSign(h.lagnaSign, lang)} {h.lagnaOccupants.length > 0 && `(${h.lagnaOccupants.map(p => trPlanetShort(p, lang)).join(', ')})`}</td>
                                <td>{trSign(h.moonSign, lang)} {h.moonOccupants.length > 0 && `(${h.moonOccupants.map(p => trPlanetShort(p, lang)).join(', ')})`}</td>
                                <td>{trSign(h.sunSign, lang)} {h.sunOccupants.length > 0 && `(${h.sunOccupants.map(p => trPlanetShort(p, lang)).join(', ')})`}</td>
                                <td>
                                  {isActive ? (
                                    <span className="tag tag-strong">{isHi ? 'चालू वर्ष सक्रिय' : 'Active Year'}</span>
                                  ) : (
                                    <span className="muted">{isHi ? 'सुषुप्त' : 'Dormant'}</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </section>
                </div>
              )}

              {chakrasSubTab === 'sarvatobhadra' && (
                <div className="view-stack">
                  <div className="gochar-banner is-clear">
                    <strong>{isHi ? 'सर्वतोभद्र वेध विश्लेषण:' : 'Sarvatobhadra Vedha Synthesis:'}</strong>{' '}
                    {isHi ? sarvatobhadraData.summaryHi : sarvatobhadraData.summaryEn}
                  </div>

                  <section className="panel">
                    <div className="panel-header">
                      <h3>{isHi ? 'संवेदनशील नक्षत्र बिंदु एवं वेध' : 'Sensitive Nakshatra Points & Cross Vedhas'}</h3>
                      <span className="tag tag-varg mono">{sarvatobhadraData.specialPoints.length} {isHi ? 'बिंदु' : 'points'}</span>
                    </div>
                    <div className="table-scroll">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>{isHi ? 'संवेदनशील बिंदु' : 'Sensitive Point'}</th>
                            <th>{isHi ? 'नक्षत्र' : 'Nakshatra'}</th>
                            <th>{isHi ? 'स्थित ग्रह' : 'Occupants'}</th>
                            <th>{isHi ? 'वेध करने वाले ग्रह' : 'Cross Vedha By'}</th>
                            <th>{isHi ? 'फलादेश' : 'Status'}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sarvatobhadraData.specialPoints.map((sp) => (
                            <tr key={sp.key}>
                              <td><strong>{isHi ? sp.titleHi : sp.titleEn}</strong></td>
                              <td>{sp.nakshatraName}</td>
                              <td>{sp.occupants.length > 0 ? sp.occupants.map(p => trPlanet(p, lang)).join(', ') : '-'}</td>
                              <td>
                                {sp.vedhaBy.length > 0 ? (
                                  sp.vedhaBy.map((v, i) => (
                                    <span key={i} className={`tag ${v.isMalefic ? 'tag-combust' : 'tag-strong'}`} style={{ marginRight: 4 }}>
                                      {trPlanet(v.planet, lang)} ({v.type})
                                    </span>
                                  ))
                                ) : (
                                  <span className="muted">{isHi ? 'वेध रहित' : 'No Vedha'}</span>
                                )}
                              </td>
                              <td>{isHi ? sp.verdictHi : sp.verdictEn}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                </div>
              )}

              {chakrasSubTab === 'kota' && (
                <div className="view-stack">
                  <div className="gochar-banner is-alert">
                    <strong>{isHi ? 'कोट चक्र दुर्ग विश्लेषण:' : 'Kota Chakra Fortress Analysis:'}</strong>{' '}
                    {isHi ? kotaData.analysisHi : kotaData.analysisEn}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
                    <div className="workstation-card">
                      <div className="muted small-text">{isHi ? 'कोट स्वामी (Fortress Lord)' : 'Kota Swami'}</div>
                      <div style={{ fontWeight: 800, fontSize: '18px', color: 'var(--accent)' }}>
                        {trPlanet(kotaData.kotaSwami, lang)}
                      </div>
                      <div className="small-text muted">{isHi ? 'जन्म राशि का अधिपति' : 'Janma Rasi Lord'}</div>
                    </div>

                    <div className="workstation-card">
                      <div className="muted small-text">{isHi ? 'कोट पाल (Fortress Guard)' : 'Kota Pala'}</div>
                      <div style={{ fontWeight: 800, fontSize: '18px', color: 'var(--good)' }}>
                        {trPlanet(kotaData.kotaPala, lang)}
                      </div>
                      <div className="small-text muted">{isHi ? 'दुर्ग प्राचीर रक्षक ग्रह' : 'Boundary Patrol Guard'}</div>
                    </div>

                    <div className="workstation-card">
                      <div className="muted small-text">{isHi ? 'दुर्ग घेराबंदी जोखिम सूचकांक' : 'Siege Risk Index'}</div>
                      <div style={{ fontWeight: 800, fontSize: '18px', color: kotaData.siegeRiskScore > 50 ? 'var(--bad)' : 'var(--good)' }}>
                        {kotaData.siegeRiskScore}%
                      </div>
                      <div className="small-text muted">{isHi ? kotaData.defenseStrengthHi : kotaData.defenseStrengthEn}</div>
                    </div>
                  </div>

                  <section className="panel">
                    <div className="panel-header">
                      <h3>{isHi ? 'कोट प्राचीर में ग्रह स्थिति' : 'Planetary Distribution in Fortress Rings'}</h3>
                    </div>
                    <div className="table-scroll">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>{isHi ? 'ग्रह' : 'Graha'}</th>
                            <th>{isHi ? 'दुर्ग प्राचीर (Zone)' : 'Fortress Ring'}</th>
                            <th>{isHi ? 'नक्षत्र' : 'Nakshatra'}</th>
                            <th>{isHi ? 'गति दिशा' : 'Entry/Exit Direction'}</th>
                            <th>{isHi ? 'प्रकृति' : 'Nature'}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {kotaData.placements.map((pl) => (
                            <tr key={pl.planet}>
                              <td><strong>{trPlanet(pl.planet, lang)}</strong></td>
                              <td>
                                <span className={`tag ${pl.zone === 'stambha' ? 'tag-karaka' : pl.zone === 'madhya' ? 'tag-varg' : 'tag-neutral'}`}>
                                  {pl.zone.toUpperCase()}
                                </span>
                              </td>
                              <td>{pl.nakshatra}</td>
                              <td>{pl.direction === 'inward' ? (isHi ? 'अंतर्मुखी (Arohi)' : 'Inward') : (isHi ? 'बहिर्मुखी (Avarohi)' : 'Outward')}</td>
                              <td>{pl.isMalefic ? (isHi ? 'क्रूर/पाप' : 'Malefic') : (isHi ? 'सौम्य/शुभ' : 'Benefic')}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                </div>
              )}

              {chakrasSubTab === 'kurma' && (
                <div className="view-stack">
                  <div className="gochar-banner is-info">
                    <strong>{isHi ? 'कूर्म चक्र दिशा निर्देश:' : 'Kurma Chakra Directional Guidance:'}</strong>{' '}
                    {isHi ? kurmaData.guidanceHi : kurmaData.guidanceEn}
                  </div>

                  <section className="panel">
                    <div className="panel-header">
                      <h3>{isHi ? 'नव दिशा कूर्म चक्र तालिका' : '9-Directional Kurma Zones & Afflictions'}</h3>
                    </div>
                    <div className="table-scroll">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>{isHi ? 'दिशा (Direction)' : 'Direction'}</th>
                            <th>{isHi ? 'नक्षत्र' : 'Nakshatras'}</th>
                            <th>{isHi ? 'स्थित ग्रह' : 'Planets'}</th>
                            <th>{isHi ? 'स्थिति' : 'Status'}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {kurmaData.zones.map((z) => (
                            <tr key={z.direction}>
                              <td><strong>{isHi ? z.titleHi : z.titleEn}</strong></td>
                              <td style={{ fontSize: '11px' }}>{z.nakshatras.join(', ')}</td>
                              <td>{z.occupants.length > 0 ? z.occupants.map(p => trPlanet(p, lang)).join(', ') : '-'}</td>
                              <td>
                                <span className={`tag ${z.maleficScore > z.beneficScore ? 'tag-combust' : z.beneficScore > 0 ? 'tag-strong' : 'tag-neutral'}`}>
                                  {isHi ? z.statusHi : z.statusEn}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* MENU 6: योग, दोष एवं युति (YOGAS, DOSHAS & YUTI)           */}
          {/* ========================================================= */}
          {activeMenu === 'yogas_doshas' && (
            <div className="view-stack">
              <div className="subtab-bar" style={{ marginBottom: 12 }}>
                <button
                  type="button"
                  className={`subtab-btn ${yogasSubTab === 'classical' ? 'is-active' : ''}`}
                  onClick={() => setYogasSubTab('classical')}
                >
                  <Award size={14} /> {isHi ? `शास्त्रीय योग (${classicalYogas.length})` : `Classical Yogas (${classicalYogas.length})`}
                </button>
                <button
                  type="button"
                  className={`subtab-btn ${yogasSubTab === 'doshas' ? 'is-active' : ''}`}
                  onClick={() => setYogasSubTab('doshas')}
                >
                  <ShieldAlert size={14} /> {isHi ? `प्रमुख दोष (${doshasData.presentCount})` : `Major Doshas (${doshasData.presentCount})`}
                </button>
                <button
                  type="button"
                  className={`subtab-btn ${yogasSubTab === 'yuti' ? 'is-active' : ''}`}
                  onClick={() => setYogasSubTab('yuti')}
                >
                  <Flame size={14} /> {isHi ? `ग्रह युति व युद्ध (${yutiReport.groups.length})` : `Conjunctions & War (${yutiReport.groups.length})`}
                </button>
              </div>

              {yogasSubTab === 'classical' && (
                <section className="panel">
                  <div className="panel-header">
                    <h3>{isHi ? 'कुंडली में सक्रिय वैदिक योग' : 'Active Classical Vedic Yogas'}</h3>
                    <span className="tag tag-strong mono">{classicalYogas.length} {isHi ? 'सक्रिय' : 'Active'}</span>
                  </div>
                  <div className="domains-grid">
                    {classicalYogas.map((y) => (
                      <article key={y.id} className="domain-card" style={{ borderLeft: '3px solid var(--accent)' }}>
                        <div className="domain-top">
                          <div>
                            <h4>{isHi ? y.nameHi : y.name}</h4>
                            <div className="muted small-text">{y.category} · {y.source}</div>
                          </div>
                          <span className={`tag ${y.quality === 'Positive' ? 'tag-strong' : 'tag-combust'}`}>
                            {y.quality}
                          </span>
                        </div>
                        <p style={{ fontSize: '12.5px', marginTop: 8 }}>{y.conditionEn}</p>
                        <div className="small-text muted" style={{ marginTop: 6, fontStyle: 'italic' }}>
                          <strong>{isHi ? 'फल:' : 'Fruit:'}</strong> {isHi ? y.resultHi : y.resultEn}
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              )}

              {yogasSubTab === 'doshas' && (
                <div className="view-stack">
                  <div className="domains-grid">
                    {doshasData.doshas.map((d, idx) => (
                      <article key={idx} className="domain-card" style={{ borderLeft: `4px solid ${d.status === 'Present' ? 'var(--bad)' : 'var(--good)'}` }}>
                        <div className="domain-top">
                          <div>
                            <h4>{d.name}</h4>
                            <div className="muted small-text">{isHi ? `गंभीरता: ${d.severity}` : `Severity: ${d.severity}`}</div>
                          </div>
                          <span className={`tag ${d.status === 'Present' ? 'tag-combust' : 'tag-strong'}`}>
                            {d.status}
                          </span>
                        </div>
                        <p style={{ fontSize: '13px', marginTop: 8 }}>
                          <strong>{isHi ? 'कारण:' : 'Trigger:'}</strong> {d.trigger}
                        </p>
                        <p style={{ fontSize: '13px' }}>
                          <strong>{isHi ? 'प्रभाव:' : 'Effect:'}</strong> {d.effect}
                        </p>
                        {d.mitigation && (
                          <div className="gochar-banner is-clear" style={{ marginTop: 6 }}>
                            <strong>{isHi ? 'परिहार:' : 'Mitigation:'}</strong> {d.mitigation}
                          </div>
                        )}
                        {d.remedy && (
                          <div className="gochar-banner is-alert" style={{ marginTop: 6 }}>
                            <strong>{isHi ? 'शास्त्रीय उपाय:' : 'Remedy:'}</strong> {d.remedy}
                          </div>
                        )}
                      </article>
                    ))}
                  </div>
                </div>
              )}

              {yogasSubTab === 'yuti' && (
                <div className="view-stack">
                  {yutiReport.groups.map((grp, idx) => (
                    <article key={idx} className="panel" style={{ borderLeft: '3px solid var(--accent)' }}>
                      <div className="panel-header">
                        <div>
                          <h3>{isHi ? grp.headlineHi : grp.headlineEn}</h3>
                          <div className="muted small-text">{grp.planets.join(' + ')} · {isHi ? `अंश अंतर: ${grp.degreeSpanDeg}°` : `Orb: ${grp.degreeSpanDeg}°`}</div>
                        </div>
                        <span className="tag tag-karaka">{grp.count} {isHi ? 'ग्रह युति' : 'Planets'}</span>
                      </div>
                      <p style={{ fontSize: '13px' }}><strong>{isHi ? 'सकारात्मक प्रभाव:' : 'Positive:'}</strong> {isHi ? grp.positiveHi : grp.positiveEn}</p>
                      <p style={{ fontSize: '13px' }}><strong>{isHi ? 'सावधानी:' : 'Watchout:'}</strong> {isHi ? grp.negativeHi : grp.negativeEn}</p>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* MENU 7: नवांश विशेष विवेचन (NAVAMSHA D9 DEEP READING)     */}
          {/* ========================================================= */}
          {activeMenu === 'navamsha' && (
            <div className="view-stack">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
                <div className="workstation-card" style={{ display: 'flex', justifyContent: 'center' }}>
                  <VedicChartSvg
                    title={isHi ? 'नवांश कुंडली (D-9 Navamsha)' : 'Navamsha Chart (D-9)'}
                    subtitle={isHi ? 'भाग्य, विवाह एवं आत्मिक सामर्थ्य' : 'Dharma, Marriage & Inner Potential'}
                    style={chartStyle}
                    lagnaSignIndex={chart.divisionalCharts['D9'].lagnaSignIndex}
                    centerLabel="D9"
                    items={chart.divisionalCharts['D9'].placements.map((p) => ({
                      id: p.id,
                      label: trPlanetShort(p.id, lang),
                      signIndex: p.signIndex,
                      isLagna: p.id === 'Asc',
                      isRetrograde: p.isRetrograde,
                      dignity: p.dignity,
                    }))}
                  />
                </div>

                <div className="view-stack">
                  <section className="panel">
                    <div className="panel-header">
                      <h3>{isHi ? 'कारकांश लग्न एवं स्वांश फल' : 'Karakamsa Lagna & Swamsha'}</h3>
                      <span className="tag tag-karaka">Jaimini Sutas</span>
                    </div>
                    <div className="pred-card-body">
                      <p style={{ fontSize: '13px', lineHeight: 1.6 }}>
                        {isHi
                          ? `आत्मकारक ग्रह नवांश चक्र में जिस राशि में स्थित होता है, वह कारकांश लग्न कहलाता है। आपकी कुंडली में आत्मकारक ग्रह नवांश में स्थिति अनुसार जातक के गूढ़ आध्यात्मिक ध्येय, अंतःकरण और स्वाभाविक प्रवृत्तियों को निर्धारित करता है।`
                          : `The sign occupied by the Atmakaraka planet in the Navamsha (D9) chart is designated as the Karakamsa Lagna. It reveals the soul's prime incarnation trajectory, inherent inclinations, and supreme talent.`}
                      </p>
                    </div>
                  </section>

                  {/* Vargottama Planets */}
                  <section className="panel">
                    <div className="panel-header">
                      <h3>{isHi ? 'वर्गोत्तम ग्रह (Vargottama Planets)' : 'Vargottama Planets'}</h3>
                    </div>
                    <div className="pred-card-body">
                      {chart.planets.filter(p => p.isVargottama).length > 0 ? (
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {chart.planets.filter(p => p.isVargottama).map(p => (
                            <span key={p.id} className="tag tag-strong">
                              👑 {trPlanet(p.id, lang)} ({trSign(p.signIndex, lang)})
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="muted small-text">
                          {isHi ? 'कोई ग्रह D1 व D9 में समान राशि में वर्गोत्तम नहीं है।' : 'No planets occupy identical signs in D1 and D9.'}
                        </p>
                      )}
                    </div>
                  </section>
                </div>
              </div>

              {/* Pushkara Navamsha Table */}
              <section className="panel">
                <div className="panel-header">
                  <h3>
                    <Sparkles size={16} />{' '}
                    {isHi ? 'पुष्कर नवांश एवं पुष्कर भाग विश्लेषण' : 'Pushkara Navamsha & Pushkara Bhaga Analysis'}
                  </h3>
                  <span className="tag tag-varg">
                    {pushkaraData.filter(p => p.isPushkaraNavamsha).length} {isHi ? 'ग्रह पुष्कर नवांश में' : 'in Pushkara Navamsha'}
                  </span>
                </div>
                <div className="table-scroll">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>{isHi ? 'ग्रह' : 'Graha'}</th>
                        <th>{isHi ? 'नवांश राशि' : 'Navamsha Sign'}</th>
                        <th>{isHi ? 'पुष्कर नवांश' : 'Pushkara Navamsha'}</th>
                        <th>{isHi ? 'पुष्कर भाग' : 'Pushkara Bhaga'}</th>
                        <th>{isHi ? 'कायाकल्प फल' : 'Rejuvenation Power'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pushkaraData.map((pk) => (
                        <tr key={pk.planet}>
                          <td><strong>{trPlanet(pk.planet as PlanetId, lang)}</strong></td>
                          <td>{pk.pushkaraNavamshaSign}</td>
                          <td>
                            <span className={`tag ${pk.isPushkaraNavamsha ? 'tag-strong' : 'tag-neutral'}`}>
                              {pk.isPushkaraNavamsha ? (isHi ? 'हाँ' : 'Yes') : (isHi ? 'नहीं' : 'No')}
                            </span>
                          </td>
                          <td>
                            <span className={`tag ${pk.isPushkaraBhaga ? 'tag-strong' : 'tag-neutral'}`}>
                              {pk.isPushkaraBhaga ? (isHi ? 'हाँ' : 'Yes') : (isHi ? 'नहीं' : 'No')}
                            </span>
                          </td>
                          <td style={{ fontSize: '11.5px' }}>{isHi ? pk.rejuvenationPowerHi : pk.rejuvenationPowerEn}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}

          {/* ========================================================= */}
          {/* MENU 8: KP ज्योतिष प्रणाली (INDEPENDENT KP SYSTEM TAB)    */}
          {/* ========================================================= */}
          {activeMenu === 'kp_system' && (
            <div className="view-stack">
              <div className="card" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Target size={18} style={{ color: 'var(--accent)' }} />
                    <span>{isHi ? 'के.पी. (KP) ज्योतिष प्रणाली — भाव एवं ग्रह उप-स्वामी' : 'Krishnamurti Paddhati (KP) System — Cuspal & Planetary Sub-Lords'}</span>
                  </h3>
                  <div className="muted small-text">{isHi ? `के.पी. अयनांश: ${kpReport.kpAyanamsaDms}` : `KP Ayanamsa: ${kpReport.kpAyanamsaDms}`}</div>
                </div>

                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setLiveRp(computeLiveKpRulingPlanets(Date.now(), chart.offsetMinutesUsed, chart.input.latitude, chart.input.longitude))}
                >
                  <RefreshCw size={13} />
                  <span>{isHi ? 'लाइव रूलिंग प्लैनेट्स रिफ्रेश' : 'Refresh Live Ruling Planets'}</span>
                </button>
              </div>

              {/* Ruling Planets Strip */}
              <div className="gochar-banner is-info">
                <strong>{isHi ? 'रूलिंग प्लैनेट्स (RP):' : 'KP Ruling Planets:'}</strong>{' '}
                {isHi ? 'लग्न नक्षत्र स्वामी: ' : 'Asc Star Lord: '}<strong>{trPlanet((liveRp ?? kpReport.chartRulingPlanets).lagnaStarLord, lang)}</strong> |{' '}
                {isHi ? 'लग्न राशि स्वामी: ' : 'Asc Sign Lord: '}<strong>{trPlanet((liveRp ?? kpReport.chartRulingPlanets).lagnaSignLord, lang)}</strong> |{' '}
                {isHi ? 'चंद्र नक्षत्र स्वामी: ' : 'Moon Star Lord: '}<strong>{trPlanet((liveRp ?? kpReport.chartRulingPlanets).moonStarLord, lang)}</strong> |{' '}
                {isHi ? 'चंद्र राशि स्वामी: ' : 'Moon Sign Lord: '}<strong>{trPlanet((liveRp ?? kpReport.chartRulingPlanets).moonSignLord, lang)}</strong> |{' '}
                {isHi ? 'वार स्वामी: ' : 'Day Lord: '}<strong>{trPlanet((liveRp ?? kpReport.chartRulingPlanets).dayLord, lang)}</strong>
              </div>

              {/* KP Cusps Table */}
              <section className="panel">
                <div className="panel-header">
                  <h3>{isHi ? 'के.पी. 12 भाव कस्प तालिका (Placidus Cusps)' : 'KP 12 Cuspal Table (Placidus Cusps)'}</h3>
                </div>
                <div className="table-scroll">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>{isHi ? 'भाव' : 'Cusp'}</th>
                        <th>{isHi ? 'अंश' : 'Degree'}</th>
                        <th>{isHi ? 'राशि' : 'Sign'}</th>
                        <th>{isHi ? 'राशि स्वामी' : 'Sign Lord'}</th>
                        <th>{isHi ? 'नक्षत्र स्वामी' : 'Star Lord'}</th>
                        <th>{isHi ? 'उप-स्वामी' : 'Sub Lord'}</th>
                        <th>{isHi ? 'उप-उप स्वामी' : 'Sub-Sub'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {kpReport.cusps.map((c) => (
                        <tr key={c.house}>
                          <td><strong>{isHi ? `भाव ${c.house}` : `Cusp ${c.house}`}</strong></td>
                          <td className="mono">{c.dms}</td>
                          <td>{c.signName}</td>
                          <td>{trPlanet(c.signLord, lang)}</td>
                          <td>{trPlanet(c.starLord, lang)}</td>
                          <td><strong style={{ color: 'var(--accent)' }}>{trPlanet(c.subLord, lang)}</strong></td>
                          <td>{trPlanet(c.subSubLord, lang)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* KP Planets Table */}
              <section className="panel">
                <div className="panel-header">
                  <h3>{isHi ? 'के.पी. ग्रह तालिका (Sign, Star & Sub-Lords)' : 'KP Planets Table'}</h3>
                </div>
                <div className="table-scroll">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>{isHi ? 'ग्रह' : 'Graha'}</th>
                        <th>{isHi ? 'अंश' : 'Degree'}</th>
                        <th>{isHi ? 'के.पी. भाव' : 'KP House'}</th>
                        <th>{isHi ? 'राशि' : 'Sign'}</th>
                        <th>{isHi ? 'नक्षत्र स्वामी' : 'Star Lord'}</th>
                        <th>{isHi ? 'उप-स्वामी' : 'Sub Lord'}</th>
                        <th>{isHi ? 'उप-उप स्वामी' : 'Sub-Sub'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {kpReport.planets.map((p) => (
                        <tr key={p.planet}>
                          <td><strong>{trPlanet(p.planet, lang)}</strong></td>
                          <td className="mono">{p.dms}</td>
                          <td><strong>{p.kpHouse}</strong></td>
                          <td>{p.signName}</td>
                          <td>{trPlanet(p.starLord, lang)}</td>
                          <td><strong style={{ color: 'var(--accent)' }}>{trPlanet(p.subLord, lang)}</strong></td>
                          <td>{trPlanet(p.subSubLord, lang)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* 4-Step Significators Table */}
              <section className="panel">
                <div className="panel-header">
                  <h3>{isHi ? 'के.पी. 4-चरण कारक तालिका (4-Step Significators)' : 'KP 4-Step House Significators'}</h3>
                </div>
                <div className="table-scroll">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>{isHi ? 'भाव' : 'House'}</th>
                        <th>{isHi ? 'स्तर 1 (Level A: नक्षत्र स्थित)' : 'L1: In Star of Occupant'}</th>
                        <th>{isHi ? 'स्तर 2 (Level B: भाव स्थित)' : 'L2: Occupants'}</th>
                        <th>{isHi ? 'स्तर 3 (Level C: स्वामी के नक्षत्र)' : 'L3: In Star of Lord'}</th>
                        <th>{isHi ? 'स्तर 4 (Level D: भाव स्वामी)' : 'L4: House Lord'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {kpReport.houseSignificators.map((s) => (
                        <tr key={s.house}>
                          <td><strong>{isHi ? `भाव ${s.house}` : `House ${s.house}`}</strong></td>
                          <td>{s.levelA.length > 0 ? s.levelA.map((p) => trPlanetShort(p, lang)).join(', ') : '-'}</td>
                          <td>{s.levelB.length > 0 ? s.levelB.map((p) => trPlanetShort(p, lang)).join(', ') : '-'}</td>
                          <td>{s.levelC.length > 0 ? s.levelC.map((p) => trPlanetShort(p, lang)).join(', ') : '-'}</td>
                          <td><strong>{trPlanet(s.levelD[0], lang)}</strong></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}

          {/* ========================================================= */}
          {/* MENU 9: लाल किताब प्रणाली (INDEPENDENT LAL KITAB TAB)     */}
          {/* ========================================================= */}
          {activeMenu === 'lal_kitab' && (
            <div className="view-stack">
              <div className="card" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Flame size={18} style={{ color: 'var(--accent)' }} />
                    <span>{isHi ? 'लाल किताब प्रणाली — टेवा वर्गीकरण, सोये भाव व ऋण' : 'Lal Kitab System — Teva Classification, Sleeping Houses & Karmic Debts'}</span>
                  </h3>
                  <div className="muted small-text">{isHi ? 'स्थिर भाव कुंडली (मेष=1 से मीन=12)' : 'Fixed House System (Aries=H1 to Pisces=H12)'}</div>
                </div>

                <span className={`tag ${lalKitabReport.isDharmiTeva ? 'tag-strong' : 'tag-neutral'}`} style={{ fontSize: '13px' }}>
                  {isHi ? (lalKitabReport.isDharmiTeva ? '✨ धर्मी टेवा (Dharmi Teva)' : 'सामान्य टेवा') : (lalKitabReport.isDharmiTeva ? 'Dharmi Teva' : 'Standard Teva')}
                </span>
              </div>

              {/* Teva Note */}
              <div className="gochar-banner is-info">
                <strong>{isHi ? 'टेवा व्याख्या:' : 'Teva Assessment:'}</strong>{' '}
                {isHi ? lalKitabReport.dharmiTevaNoteHi : lalKitabReport.dharmiTevaNoteEn}
              </div>

              {/* Karmic Debts (Rinas) */}
              <section className="panel">
                <div className="panel-header">
                  <h3>
                    <AlertTriangle size={16} />{' '}
                    {isHi ? 'लाल किताब ऋण (Karmic Debts)' : 'Lal Kitab Karmic Debts (Rinas)'}
                  </h3>
                  <span className="tag tag-varg">
                    {lalKitabReport.karmicDebts.filter(d => d.isTriggered).length} {isHi ? 'ऋण सक्रिय' : 'Triggered'}
                  </span>
                </div>
                <div className="domains-grid">
                  {lalKitabReport.karmicDebts.map((d, i) => (
                    <article key={i} className="domain-card" style={{ borderLeft: `3px solid ${d.isTriggered ? 'var(--bad)' : 'var(--good)'}` }}>
                      <div className="domain-top">
                        <h4>{isHi ? d.debtTypeHi : d.debtType}</h4>
                        <span className={`tag ${d.isTriggered ? 'tag-combust' : 'tag-strong'}`}>
                          {d.isTriggered ? (isHi ? 'सक्रिय ऋण' : 'Active Debt') : (isHi ? 'ऋण मुक्त' : 'Clear')}
                        </span>
                      </div>
                      <p style={{ fontSize: '12.5px', marginTop: 6 }}>
                        <strong>{isHi ? 'शास्त्रीय कारण:' : 'Classical Cause:'}</strong> {isHi ? d.classicalCauseHi : d.classicalCauseEn}
                      </p>
                      {d.isTriggered && (
                        <div className="gochar-banner is-alert" style={{ marginTop: 8 }}>
                          <strong>{isHi ? 'निवारण उपाय:' : 'Remedy:'}</strong> {isHi ? d.remedialProtocolHi : d.remedialProtocolEn}
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              </section>

              {/* Sleeping Houses (Soya Hua Ghar) */}
              <section className="panel">
                <div className="panel-header">
                  <h3>{isHi ? 'सोये हुए भाव एवं जगाने के नियम' : 'Sleeping Houses & Awakening Methods'}</h3>
                </div>
                <div className="table-scroll">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>{isHi ? 'भाव' : 'House'}</th>
                        <th>{isHi ? 'पक्का घर स्वामी' : 'Pakka Ruler'}</th>
                        <th>{isHi ? 'स्थिति' : 'State'}</th>
                        <th>{isHi ? 'स्थित ग्रह' : 'Occupants'}</th>
                        <th>{isHi ? 'जगाने की शास्त्रीय विधि' : 'Awakening Protocol'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lalKitabReport.sleepingHouses.map((h) => (
                        <tr key={h.houseNumber}>
                          <td><strong>{isHi ? `भाव ${h.houseNumber}` : `H${h.houseNumber}`}</strong></td>
                          <td>{isHi ? h.pakkaGharRulerHi : h.pakkaGharRuler}</td>
                          <td>
                            <span className={`tag ${h.isSleeping ? 'tag-combust' : 'tag-strong'}`}>
                              {h.isSleeping ? (isHi ? 'सोया हुआ' : 'Sleeping') : (isHi ? 'जागृत' : 'Awake')}
                            </span>
                          </td>
                          <td>{h.occupants.length > 0 ? h.occupants.map(p => trPlanet(p, lang)).join(', ') : '-'}</td>
                          <td style={{ fontSize: '11.5px' }}>{isHi ? h.awakeningMethodHi : h.awakeningMethodEn}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Farman Remedies */}
              <section className="panel">
                <div className="panel-header">
                  <h3>{isHi ? 'लाल किताब विशिष्ट फरमान उपाय' : 'Specific Lal Kitab Farman Remedies'}</h3>
                </div>
                <div className="placement-cards">
                  {lalKitabExtended.planets.map((p) => (
                    <article key={p.planet} className="placement-card">
                      <div className="placement-card-top">
                        <strong>{trPlanet(p.planet, lang)} ({isHi ? `भाव ${p.natalHouse}` : `House ${p.natalHouse}`})</strong>
                        <span className="tag tag-karaka">{isHi ? p.statusHi : p.statusEn}</span>
                      </div>
                      <p style={{ fontSize: '12px', marginTop: 6 }}>
                        <strong>{isHi ? 'उपाय:' : 'Remedy:'}</strong> {isHi ? p.remedyHi : p.remedyEn}
                      </p>
                    </article>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* ========================================================= */}
          {/* MENU 10: सटीक जीवन फलकथन (DEEP PREDICTIVE ANALYSIS)      */}
          {/* ========================================================= */}
          {activeMenu === 'predictions' && (
            <div className="view-stack">
              <div className="subtab-bar" style={{ marginBottom: 12 }}>
                <button
                  type="button"
                  className={`subtab-btn ${predCategoryFilter === 'individual' ? 'is-active' : ''}`}
                  onClick={() => setPredCategoryFilter('individual')}
                >
                  🌟 {isHi ? 'जीवन के मुख्य आयाम (रूप, विद्या, करियर, व्यसन, शत्रु, प्रेम)' : 'Core Dimensions (Appearance, Education, Career, Habits, Adversaries, Love)'}
                </button>
                <button
                  type="button"
                  className={`subtab-btn ${predCategoryFilter === 'family' ? 'is-active' : ''}`}
                  onClick={() => setPredCategoryFilter('family')}
                >
                  👨‍👩‍👧‍👦 {isHi ? 'सम्पूर्ण पारिवारिक यथार्थ (माता-पिता, एकल संतान, ब्रह्मचर्य/विवाह, निःसंतानता)' : 'Family Dynamics (Parents, Sibling/Only Child, Single/Marriage, Children/Childless)'}
                </button>
                <button
                  type="button"
                  className={`subtab-btn ${predCategoryFilter === 'epochs' ? 'is-active' : ''}`}
                  onClick={() => setPredCategoryFilter('epochs')}
                >
                  ⏳ {isHi ? '12 पंचवर्षीय जीवन चक्र (0-60+ वर्ष)' : '12 5-Year Life Epochs (Ages 0-60+)'}
                </button>
              </div>

              {/* 1. Core Dimensions */}
              {predCategoryFilter === 'individual' && (
                <div className="domains-grid">
                  {renderPredictiveDomainCard(masterPredictions.appearanceDomain)}
                  {renderPredictiveDomainCard(masterPredictions.educationDomain)}
                  {renderPredictiveDomainCard(masterPredictions.careerAuditDomain)}
                  {renderPredictiveDomainCard(masterPredictions.vicesHabitsDomain)}
                  {renderPredictiveDomainCard(masterPredictions.litigationDomain)}
                  {renderPredictiveDomainCard(masterPredictions.romanceScandalsDomain)}
                </div>
              )}

              {/* 2. Family Realities with Conditional Branches */}
              {predCategoryFilter === 'family' && (
                <div className="domains-grid">
                  {renderPredictiveDomainCard(masterPredictions.familyDomains.father)}
                  {renderPredictiveDomainCard(masterPredictions.familyDomains.mother)}
                  {renderPredictiveDomainCard(masterPredictions.familyDomains.siblingsAndOnlyChild)}
                  {renderPredictiveDomainCard(masterPredictions.familyDomains.marriageVsBachelorhood)}
                  {renderPredictiveDomainCard(masterPredictions.familyDomains.childrenVsChildlessness)}
                  {renderPredictiveDomainCard(masterPredictions.familyDomains.grandparents)}
                  {renderPredictiveDomainCard(masterPredictions.familyDomains.inLaws)}
                  {renderPredictiveDomainCard(masterPredictions.familyDomains.unclesAuntsCousins)}
                  {renderPredictiveDomainCard(masterPredictions.familyDomains.friendsNeighbours)}
                </div>
              )}

              {/* 3. 12 Life Epochs */}
              {predCategoryFilter === 'epochs' && (
                <div className="view-stack">
                  <div className="gochar-banner is-clear">
                    <strong>{isHi ? '12 पंचवर्षीय जीवन कालखंड:' : '12 5-Year Life Epochs:'}</strong>{' '}
                    {isHi
                      ? 'यह कालखंड जातक की व्यक्तिगत दशा (विंशोत्तरी), शनि-गुरु के प्रमुख गोचर एवं लग्न-चंद्र की भाव सक्रियता पर आधारित है।'
                      : 'These 12 epochs are synchronized with individual Vimshottari dasha transitions and major Saturn/Jupiter transits.'}
                  </div>

                  <div className="domains-grid">
                    {dynamicEpochs.map((ep, idx) => (
                      <article key={idx} className="domain-card" style={{ borderLeft: '3px solid var(--indigo)' }}>
                        <div className="domain-top">
                          <h4>{isHi ? ep.titleHi : ep.titleEn}</h4>
                          <span className="tag tag-varg mono">Phase #{idx + 1}</span>
                        </div>
                        <p style={{ fontSize: '12.5px', lineHeight: 1.6, marginTop: 8 }}>
                          {isHi ? (ep.paragraphsHi?.join(' ') || ep.leadHi) : (ep.paragraphsEn?.join(' ') || ep.leadEn)}
                        </p>
                      </article>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* MENU 11: पूर्व जन्म व भावी गति (PAST & FUTURE LIFE D60)   */}
          {/* ========================================================= */}
          {activeMenu === 'past_future' && pastFutureLife && (
            <div className="view-stack">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
                {/* Past Life */}
                <section className="panel" style={{ borderLeft: '3px solid var(--accent)' }}>
                  <div className="panel-header">
                    <h3>
                      <Sparkles size={16} />{' '}
                      {isHi ? 'पूर्व जन्म विवरण (D-60 षष्ट्यंश विवेचन)' : 'Past Life Incarnation (D-60 Shashtiamsha)'}
                    </h3>
                  </div>
                  <div className="pred-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div>
                      <strong>{isHi ? 'पूर्व जन्म स्थान व सभ्यता:' : 'Birth Region & Civilization:'}</strong>{' '}
                      {isHi ? pastFutureLife.pastLife.civilizationHi : pastFutureLife.pastLife.civilizationEn} (
                      {isHi ? pastFutureLife.pastLife.birthPlaceOrCountryHi : pastFutureLife.pastLife.birthPlaceOrCountryEn})
                    </div>
                    <div>
                      <strong>{isHi ? 'पूर्व योनि व स्वरूप:' : 'Past Yoni & Archetype:'}</strong>{' '}
                      {isHi ? pastFutureLife.pastLife.lifeTypeHi : pastFutureLife.pastLife.lifeTypeEn}
                    </div>
                    <div>
                      <strong>{isHi ? 'षष्ट्यंश देवता:' : 'Shashtiamsha Deity:'}</strong>{' '}
                      {isHi ? pastFutureLife.pastLife.shashtiamsaDeityHi : pastFutureLife.pastLife.shashtiamsaDeityEn} ({pastFutureLife.pastLife.shashtiamsaNature})
                    </div>
                    <div>
                      <strong>{isHi ? 'पूर्व जन्म व्यवसाय:' : 'Profession:'}</strong>{' '}
                      {isHi ? pastFutureLife.pastLife.professionHi : pastFutureLife.pastLife.professionEn}
                    </div>
                    <div>
                      <strong>{isHi ? 'असंचित कर्म ऋण:' : 'Unfinished Karma & Debts:'}</strong>{' '}
                      {isHi ? pastFutureLife.pastLife.unfinishedKarmaAndDebtsHi : pastFutureLife.pastLife.unfinishedKarmaAndDebtsEn}
                    </div>
                  </div>
                </section>

                {/* Future Becoming */}
                <section className="panel" style={{ borderLeft: '3px solid var(--good)' }}>
                  <div className="panel-header">
                    <h3>
                      <Compass size={16} />{' '}
                      {isHi ? 'भावी गति व पुनर्जन्म (Future Becoming)' : 'Future Rebirth & Spiritual Trajectory'}
                    </h3>
                  </div>
                  <div className="pred-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div>
                      <strong>{isHi ? 'आगामी गति स्तर:' : 'Future Gati Tier:'}</strong>{' '}
                      {isHi ? pastFutureLife.futureBecoming.futureGatiHi : pastFutureLife.futureBecoming.futureGatiEn}
                    </div>
                    <div>
                      <strong>{isHi ? 'मोक्ष / मुक्ति संभावना:' : 'Moksha Probability:'}</strong>{' '}
                      {isHi ? pastFutureLife.futureBecoming.mokshaLikelihoodHi : pastFutureLife.futureBecoming.mokshaLikelihoodEn}
                    </div>
                    <div>
                      <strong>{isHi ? 'आगामी लोक:' : 'Next Realm / Loka:'}</strong>{' '}
                      {isHi ? pastFutureLife.futureBecoming.nextBirthLokaHi : pastFutureLife.futureBecoming.nextBirthLokaEn}
                    </div>
                    <div>
                      <strong>{isHi ? 'आगामी जन्म महाद्वीप / देश:' : 'Next Rebirth Continent:'}</strong>{' '}
                      {isHi ? pastFutureLife.futureBecoming.futureContinentHi : pastFutureLife.futureBecoming.futureContinentEn}
                    </div>
                    <div>
                      <strong>{isHi ? 'आध्यात्मिक विकास सूचकांक:' : 'Spiritual Evolution Index:'}</strong>{' '}
                      <strong className="mono">{pastFutureLife.futureBecoming.spiritualEvolutionIndex} / 100</strong>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* MENU 12: कुंडली मिलान (KUNDALI MATCH MAKING)              */}
          {/* ========================================================= */}
          {activeMenu === 'matchmaking' && (
            <MatchMakingView
              profiles={profiles}
              activeProfileId={activeProfileId}
              settings={safeSettings}
              chartStyle={chartStyle}
            />
          )}

          {/* ========================================================= */}
          {/* MENU 13: सम्पूर्ण शास्त्रीय उपाय (COMPREHENSIVE REMEDIES)  */}
          {/* ========================================================= */}
          {activeMenu === 'remedies' && (
            <div className="view-stack">
              {/* Gemstone Recommendations */}
              <section className="panel">
                <div className="panel-header">
                  <h3>
                    <Gem size={16} />{' '}
                    {isHi ? 'रत्न एवं रुद्राक्ष शास्त्रीय संस्तुति' : 'Gemstones & Rudraksha Recommendations'}
                  </h3>
                </div>
                <div className="domains-grid">
                  <div className="workstation-card">
                    <div className="muted small-text">{isHi ? 'जीवन रत्न (लग्न स्वामी)' : 'Life Stone (Lagna Lord)'}</div>
                    <div style={{ fontWeight: 800, fontSize: '16px', color: 'var(--accent)' }}>
                      {gemstoneData.lifeStone.stoneHi} ({gemstoneData.lifeStone.stoneEn})
                    </div>
                    <div className="small-text">{isHi ? `ग्रह: ${trPlanet(gemstoneData.lifeStone.planet, lang)}` : `Planet: ${gemstoneData.lifeStone.planet}`}</div>
                    <p style={{ fontSize: '11.5px', marginTop: 4 }}>{isHi ? gemstoneData.lifeStone.reasonHi : gemstoneData.lifeStone.reasonEn}</p>
                  </div>

                  <div className="workstation-card">
                    <div className="muted small-text">{isHi ? 'भाग्य रत्न (नवम स्वामी)' : 'Lucky Stone (9th Lord)'}</div>
                    <div style={{ fontWeight: 800, fontSize: '16px', color: 'var(--good)' }}>
                      {gemstoneData.luckyStone.stoneHi} ({gemstoneData.luckyStone.stoneEn})
                    </div>
                    <div className="small-text">{isHi ? `ग्रह: ${trPlanet(gemstoneData.luckyStone.planet, lang)}` : `Planet: ${gemstoneData.luckyStone.planet}`}</div>
                    <p style={{ fontSize: '11.5px', marginTop: 4 }}>{isHi ? gemstoneData.luckyStone.reasonHi : gemstoneData.luckyStone.reasonEn}</p>
                  </div>

                  <div className="workstation-card">
                    <div className="muted small-text">{isHi ? 'संस्तुत रुद्राक्ष' : 'Recommended Rudraksha'}</div>
                    <div style={{ fontWeight: 800, fontSize: '16px', color: 'var(--indigo)' }}>
                      {isHi ? gemstoneData.primaryRudraksha.titleHi : gemstoneData.primaryRudraksha.titleEn}
                    </div>
                    <div className="small-text">{isHi ? `अधिपति देव: ${gemstoneData.primaryRudraksha.deityHi}` : `Deity: ${gemstoneData.primaryRudraksha.deityEn}`}</div>
                    <p style={{ fontSize: '11.5px', marginTop: 4 }}>{isHi ? gemstoneData.primaryRudraksha.benefitHi : gemstoneData.primaryRudraksha.benefitEn}</p>
                  </div>
                </div>

                {gemstoneData.avoidStonesHi.length > 0 && (
                  <div className="gochar-banner is-alert" style={{ marginTop: 12 }}>
                    <strong>{isHi ? 'विशेष निषेध एवं चेतावनी (वर्जित रत्न):' : 'Caution Note (Avoid Stones):'}</strong>{' '}
                    {isHi ? gemstoneData.avoidStonesHi.join(', ') : gemstoneData.avoidStonesEn.join(', ')}
                  </div>
                )}
              </section>

              {/* Vedic Mantras & Dana */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
                <section className="panel">
                  <div className="panel-header">
                    <h3>{isHi ? 'वैदिक एवं तांत्रिक नवग्रह मंत्र' : 'Vedic & Tantrik Planetary Mantras'}</h3>
                  </div>
                  <div className="table-scroll">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>{isHi ? 'ग्रह' : 'Graha'}</th>
                          <th>{isHi ? 'बीज मंत्र' : 'Beej Mantra'}</th>
                          <th>{isHi ? 'जप संख्या' : 'Recitations'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr><td><strong>{isHi ? 'सूर्य' : 'Sun'}</strong></td><td className="mono">ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः</td><td>7,000</td></tr>
                        <tr><td><strong>{isHi ? 'चंद्र' : 'Moon'}</strong></td><td className="mono">ॐ श्रां श्रीं श्रौं सः चंद्रमसे नमः</td><td>11,000</td></tr>
                        <tr><td><strong>{isHi ? 'मंगल' : 'Mars'}</strong></td><td className="mono">ॐ क्रां क्रीं क्रौं सः भौमाय नमः</td><td>10,000</td></tr>
                        <tr><td><strong>{isHi ? 'बुध' : 'Mercury'}</strong></td><td className="mono">ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः</td><td>9,000</td></tr>
                        <tr><td><strong>{isHi ? 'बृहस्पति' : 'Jupiter'}</strong></td><td className="mono">ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः</td><td>19,000</td></tr>
                        <tr><td><strong>{isHi ? 'शुक्र' : 'Venus'}</strong></td><td className="mono">ॐ द्रां द्रीं द्रौं सः शुक्राय नमः</td><td>16,000</td></tr>
                        <tr><td><strong>{isHi ? 'शनि' : 'Saturn'}</strong></td><td className="mono">ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः</td><td>23,000</td></tr>
                        <tr><td><strong>{isHi ? 'राहु' : 'Rahu'}</strong></td><td className="mono">ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः</td><td>18,000</td></tr>
                        <tr><td><strong>{isHi ? 'केतु' : 'Ketu'}</strong></td><td className="mono">ॐ स्रां स्रीं स्रौं सः केतवे नमः</td><td>17,000</td></tr>
                      </tbody>
                    </table>
                  </div>
                </section>

                <section className="panel">
                  <div className="panel-header">
                    <h3>{isHi ? 'शास्त्रीय दान एवं नक्षत्र स्नान' : 'Classical Charity (Dana) & Herbal Baths'}</h3>
                  </div>
                  <div className="pred-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div>
                      <strong>{isHi ? 'नक्षत्र स्नान (Herbal Bath):' : 'Nakshatra Herbal Bath:'}</strong>{' '}
                      {isHi
                        ? 'जन्म नक्षत्र या चंद्रमा के गोचर दिन में मुलेठी, श्वेत चंदन, सुगंधित खस अथवा कुशा का अर्क जल में डालकर स्नान करने से मानसिक शांति व आरोग्यता प्राप्त होती है।'
                        : 'Herbal baths with white sandalwood, vetiver (khus), and sacred kusha roots on Moon nakshatra days rejuvenate the physical aura.'}
                    </div>
                    <div>
                      <strong>{isHi ? 'अन्न एवं द्रव्य दान:' : 'Food & Material Charity:'}</strong>{' '}
                      {isHi
                        ? 'गुरुवार को चने की दाल व बेसन का दान, शनिवार को काले तिल व सरसों के तेल का दान, तथा बुधवार को हरी मूंग व पक्षियों को दाना डालना सर्व-दोष नाशक है।'
                        : 'Donating split chickpeas on Thursdays, black sesame and mustard oil on Saturdays, and feeding birds on Wednesdays balances transiting malefic pressures.'}
                    </div>
                    <div>
                      <strong>{isHi ? 'आचरण व कर्म शुद्धि:' : 'Conduct & Lifestyle Conduct:'}</strong>{' '}
                      {isHi
                        ? 'सत्य भाषण, माता-पिता की सेवा, वाणी में सौम्यता, और नित्य प्रातः सूर्य को तांबे के पात्र से अर्घ्य देना सबसे महान उपाय है।'
                        : 'Respecting elders, truthfulness, soft speech, and offering morning water (Arghya) to the Sun in a copper vessel.'}
                    </div>
                  </div>
                </section>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* MENU 14: दैनिक पंचांग व मुहूर्त (DAILY PANCHANG & MUHURTA)   */}
          {/* ========================================================= */}
          {activeMenu === 'panchang' && (
            <div className="view-stack">
              <ToolsSuiteView
                chart={chart}
                baseInput={chart.input}
                settings={settings || DEFAULT_SETTINGS}
                onApplyRectifiedTime={() => {}}
                requestedSubTab={{ id: 'deep_panchang', nonce: Date.now() }}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
