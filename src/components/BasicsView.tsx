import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  Edit3,
  Eye,
  FileText,
  Flame,
  Gem,
  Grid3x3,
  Heart,
  Layers,
  Moon,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  Star,
  Sun,
  Target,
  User,
  Zap,
} from 'lucide-react';
import {
  computeAvakahadaChakra,
  computeBhavaChalitPlacements,
  computeGhatakChakra,
} from '../astro/avakahadaChalit';
import { DIVISIONAL_META } from '../astro/constants';
import {
  computeBasicDetailsSheet,
  type BasicDetailRow,
} from '../astro/higherVargas';
import { formatDateDmy, formatDms, formatOffsetString } from '../astro/time';
import type {
  BirthInput,
  CalcSettings,
  ChartData,
  ChartStyle,
  DivisionalChartId,
  PlanetId,
} from '../astro/types';
import { useLanguage } from '../i18n/LanguageContext';
import {
  trPlanet,
  trPlanetShort,
  trSign,
  trTerm,
  trVarga,
  type AppLanguage,
} from '../i18n/translations';
import type { MainTab } from '../nav';
import { VedicChartSvg, type ChartBadgeItem } from './VedicChartSvg';

// Import All Astrological Sub-Engines for the Unified Workstation Console
import { DashaView } from './DashaView';
import { AshtakavargaView } from './AshtakavargaView';
import { StrengthYogasView } from './StrengthYogasView';
import { SpecializedAstrologyView } from './SpecializedAstrologyView';
import { WesternAstrologyView } from './WesternAstrologyView';
import { TransitsView } from './TransitsView';
import { PredictionsView, type PredSubTab } from './PredictionsView';
import { AstroSageToolsView } from './AstroSageToolsView';

export type WorkstationConsoleTool =
  | 'planets'
  | 'cusps'
  | 'dasha'
  | 'ashtakavarga'
  | 'shadbala'
  | 'kp'
  | 'lalkitab'
  | 'numerology'
  | 'remedies'
  | 'western'
  | 'transits'
  | 'varshaphala'
  | 'twelve_planets'
  | 'deep_predictions'
  | 'yogas'
  | 'timeline'
  | 'bhavas'
  | 'bnn'
  | 'yuti'
  | 'past_life'
  | 'avakahada'
  | 'chalit'
  | 'special';

interface BasicsViewProps {
  chart: ChartData;
  chartStyle: ChartStyle;
  settings?: CalcSettings;
  requestedSubTab?: { id?: string; nonce: number };
  onNavigate?: (tab: MainTab, subTab?: string, nested?: string) => void;
  onOpenBooklet?: () => void;
  onOpenEditor?: () => void;
}

function buildD1Badges(chart: ChartData, includeSpecial: boolean, lang: AppLanguage): ChartBadgeItem[] {
  const items: ChartBadgeItem[] = [
    {
      id: 'Asc',
      label: trPlanetShort('Asc', lang),
      signIndex: chart.ascendant.signIndex,
      houseNumber: 1,
      isLagna: true,
      isVargottama: chart.ascendant.isVargottama,
      tooltip: `${trPlanet('Asc', lang)}: ${trSign(chart.ascendant.signIndex, lang)} ${chart.ascendant.dms} (${trTerm(chart.ascendant.nakshatraName, lang)} ${lang === 'hi' ? 'च' : 'P'}${chart.ascendant.pada})`,
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
      tooltip: `${trPlanet(p.id, lang)}: ${trSign(p.signIndex, lang)} ${p.dms} | ${trTerm(p.nakshatraName, lang)} ${lang === 'hi' ? 'च' : 'P'}${p.pada} | ${trTerm(p.dignity, lang)}`,
    })),
  ];

  if (includeSpecial) {
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
}

export const BasicsView: React.FC<BasicsViewProps> = ({
  chart,
  chartStyle,
  settings,
  requestedSubTab,
  onNavigate,
  onOpenBooklet,
  onOpenEditor,
}) => {
  const { lang, t } = useLanguage();
  const isHi = lang === 'hi';
  const safeSettings: CalcSettings = settings ?? chart.settings;

  // Workstation View State
  const [rightVarga, setRightVarga] = useState<DivisionalChartId | 'CHALIT' | 'CHANDRA'>('D9');
  const [showSpecialInChart, setShowSpecialInChart] = useState(false);
  const [showSavInChart, setShowSavInChart] = useState(false);
  const [consoleTool, setConsoleTool] = useState<WorkstationConsoleTool>('planets');

  // Active Dasha Banner calculations (5 levels)
  const activeDashaSummary = useMemo(() => {
    const nowMs = Date.now();
    const maha = chart.vimshottari.find((m) => nowMs >= m.startMs && nowMs <= m.endMs);
    const antar = maha?.children?.find((a) => nowMs >= a.startMs && nowMs <= a.endMs);
    const pratyantar = antar?.children?.find((p) => nowMs >= p.startMs && nowMs <= p.endMs);
    const sookshma = pratyantar?.children?.find((s) => nowMs >= s.startMs && nowMs <= s.endMs);
    return { maha, antar, pratyantar, sookshma };
  }, [chart.vimshottari]);

  // Handle external requested subtab routing
  useEffect(() => {
    const id = requestedSubTab?.id;
    if (!id) return;
    if (id === 'basic_details' || id === 'overview') {
      setConsoleTool('avakahada');
    } else if (id === 'charts' || id === 'planets') {
      setConsoleTool('planets');
    } else if (id === 'cusps') {
      setConsoleTool('cusps');
    } else if (id === 'vargas') {
      setRightVarga('D9');
      setConsoleTool('planets');
    } else if (id === 'strength') {
      setConsoleTool('shadbala');
    } else if (id === 'ashtakavarga') {
      setConsoleTool('ashtakavarga');
    } else if (id === 'kp') {
      setConsoleTool('kp');
    } else if (id === 'lalkitab') {
      setConsoleTool('lalkitab');
    } else if (id === 'western') {
      setConsoleTool('western');
    } else if (id === 'chalit') {
      setRightVarga('CHALIT');
      setConsoleTool('chalit');
    } else if (id === 'special') {
      setConsoleTool('special');
    }
  }, [requestedSubTab?.nonce, requestedSubTab?.id]);

  const basicSheet = useMemo(() => computeBasicDetailsSheet(chart), [chart]);

  const d1Items = useMemo(
    () => buildD1Badges(chart, showSpecialInChart, lang),
    [chart, showSpecialInChart, lang]
  );

  const chalitData = useMemo(() => computeBhavaChalitPlacements(chart), [chart]);
  const avakahada = useMemo(() => computeAvakahadaChakra(chart), [chart]);
  const ghatak = useMemo(
    () => computeGhatakChakra(avakahada.moonSignIndex),
    [avakahada.moonSignIndex]
  );

  const moonSignIndex = chart.planets.find((p) => p.id === 'Moon')?.signIndex ?? 0;
  const isChandra = rightVarga === 'CHANDRA';
  const isChalit = rightVarga === 'CHALIT';
  const rightChart = isChandra || isChalit ? null : chart.divisionalCharts[rightVarga];
  const rightMeta = isChandra
    ? {
        name: isHi ? 'चंद्र कुंडली (Chandra Kundali)' : 'Moon Chart (Chandra Kundali)',
        sig: `${isHi ? 'चंद्र लग्न' : 'Moon as Lagna'}: ${trSign(moonSignIndex, lang)}`,
      }
    : rightChart
    ? trVarga(rightChart.id, rightChart.name, rightChart.signification, lang)
    : {
        name: isHi ? 'भाव चलित (श्रीपति)' : 'Bhava Chalit (Sripati)',
        sig: isHi
          ? `${chalitData.shiftedBodies.length} ग्रह राशि से भिन्न चलित भाव में`
          : `${chalitData.shiftedBodies.length} planet(s) shift houses from D1 Rasi`,
      };

  const rightItems: ChartBadgeItem[] = useMemo(() => {
    if (rightVarga === 'CHANDRA') {
      const moonSign = chart.planets.find((p) => p.id === 'Moon')?.signIndex ?? 0;
      return [
        {
          id: 'Moon',
          label: trPlanetShort('Moon', lang),
          signIndex: moonSign,
          houseNumber: 1,
          isLagna: true,
          tooltip: `${trPlanet('Moon', lang)} (${isHi ? 'चंद्र लग्न' : 'Moon Lagna'}): ${trSign(moonSign, lang)}`,
        },
        ...chart.planets
          .filter((p) => p.id !== 'Moon')
          .map((p) => {
            const hNum = ((p.signIndex - moonSign + 12) % 12) + 1;
            return {
              id: p.id,
              label: trPlanetShort(p.id, lang),
              signIndex: p.signIndex,
              houseNumber: hNum,
              isRetrograde: p.isRetrograde,
              isCombust: p.isCombust,
              dignity: p.dignity,
              tooltip: `${trPlanet(p.id, lang)}: ${trSign(p.signIndex, lang)} (H${hNum} ${isHi ? 'चंद्र से' : 'from Moon'}) | ${trTerm(p.dignity, lang)}`,
            };
          }),
      ];
    }
    if (rightVarga === 'CHALIT') {
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
    return rightChart!.placements.map((pl) => ({
      id: pl.id,
      label: trPlanetShort(pl.id, lang),
      signIndex: pl.signIndex,
      isLagna: pl.id === 'Asc',
      isRetrograde: pl.isRetrograde,
      isCombust: pl.isCombust,
      dignity: pl.dignity,
      tooltip: `${trPlanet(pl.id, lang)}: ${trSign(pl.signIndex, lang)} (${t.common.house}${pl.houseFromVargaLagna}) | ${trTerm(pl.dignity, lang)}`,
    }));
  }, [rightVarga, chalitData, rightChart, chart.planets, lang, isHi, t.common.house]);

  const allBodies = [chart.ascendant, ...chart.planets];

  const renderDetailValue = (row: BasicDetailRow) => {
    const raw = isHi ? row.valueHi : row.valueEn;
    if (isHi && row.valueHi === row.valueEn && !row.mono) {
      return trTerm(raw, lang);
    }
    return raw;
  };

  const renderDetailTable = (titleEn: string, titleHi: string, rows: BasicDetailRow[]) => (
    <section className="panel basic-sheet-card">
      <div className="panel-header basic-sheet-head">
        <h3>{isHi ? titleHi : titleEn}</h3>
        <span className="muted small-text">{rows.length} {isHi ? 'बिंदु' : 'fields'}</span>
      </div>
      <div className="table-scroll">
        <table className="data-table basic-kv-table">
          <tbody>
            {rows.map((row) => (
              <tr key={row.key}>
                <td className="basic-kv-key">{isHi ? row.labelHi : row.labelEn}</td>
                <td
                  className={`basic-kv-val ${row.mono ? 'mono' : ''} ${
                    row.tone ? `tone-${row.tone}` : ''
                  }`}
                >
                  {renderDetailValue(row)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );

  return (
    <div className="view-stack">
      {/* 1. Native Profile Quick Info & Action Header Bar */}
      <div
        className="card"
        style={{
          padding: '10px 16px',
          background: 'var(--bg-elevated)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px 16px',
          borderLeft: '4px solid var(--accent)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={18} style={{ color: 'var(--accent)' }} />
            <div>
              <span style={{ fontWeight: 800, fontSize: '15px' }}>{chart.input.name}</span>
              <span className="muted small-text" style={{ marginLeft: 8 }}>
                ({chart.input.gender ? (isHi ? (chart.input.gender === 'male' ? 'पुरुष' : 'महिला') : chart.input.gender.toUpperCase()) : ''})
              </span>
            </div>
          </div>
          <div className="muted small-text" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span>📅 {formatDateDmy(chart.input.date)} {chart.input.time}</span>
            <span>📍 {chart.input.city}, {chart.input.country}</span>
            <span className="mono">({Math.abs(chart.input.latitude).toFixed(2)}°{chart.input.latitude >= 0 ? 'N' : 'S'}, {Math.abs(chart.input.longitude).toFixed(2)}°{chart.input.longitude >= 0 ? 'E' : 'W'})</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {onOpenEditor && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={onOpenEditor}
              title={isHi ? 'जन्म विवरण संशोधित करें' : 'Edit Birth Details'}
            >
              <Edit3 size={13} />
              <span>{isHi ? 'विवरण बदलें' : 'Edit Birth Data'}</span>
            </button>
          )}
          {onOpenBooklet && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={onOpenBooklet}
              title={isHi ? '34-अध्यायी बृहत् पत्रिका PDF' : 'Print 34-Ch Patrika PDF'}
            >
              <FileText size={13} />
              <span>{isHi ? 'पत्रिका PDF' : 'Patrika PDF'}</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Active Vimshottari Dasha Hierarchy & Ephemeris Strip (Permanently Mounted) */}
      <div className="dasha-ephemeris-strip">
        <div className="dasha-status-item">
          <span className="dasha-status-label">
            {isHi ? 'वर्तमान विंशोत्तरी दशा:' : 'Active Vimshottari Dasha:'}
          </span>
          <div className="dasha-badge-pills">
            {activeDashaSummary.maha && (
              <span
                className="dasha-badge-pill is-maha"
                title={`End: ${formatDateDmy(new Date(activeDashaSummary.maha.endMs).toISOString().split('T')[0])}`}
              >
                <strong>MD:</strong> {trPlanet(activeDashaSummary.maha.lord as PlanetId, lang)}
              </span>
            )}
            {activeDashaSummary.antar && (
              <span
                className="dasha-badge-pill is-antar"
                title={`End: ${formatDateDmy(new Date(activeDashaSummary.antar.endMs).toISOString().split('T')[0])}`}
              >
                <strong>AD:</strong> {trPlanet(activeDashaSummary.antar.lord as PlanetId, lang)}
              </span>
            )}
            {activeDashaSummary.pratyantar && (
              <span
                className="dasha-badge-pill is-prat"
                title={`End: ${formatDateDmy(new Date(activeDashaSummary.pratyantar.endMs).toISOString().split('T')[0])}`}
              >
                <strong>PD:</strong> {trPlanet(activeDashaSummary.pratyantar.lord as PlanetId, lang)}
              </span>
            )}
            {activeDashaSummary.sookshma && (
              <span
                className="dasha-badge-pill is-sookshma"
                title={`End: ${formatDateDmy(new Date(activeDashaSummary.sookshma.endMs).toISOString().split('T')[0])}`}
              >
                <strong>SD:</strong> {trPlanet(activeDashaSummary.sookshma.lord as PlanetId, lang)}
              </span>
            )}
          </div>
        </div>

        <div className="dasha-status-item-right">
          <span className="dasha-meta-pill">
            <strong>{chart.settings.ayanamsa.toUpperCase()}</strong> ({chart.ayanamsaDeg.toFixed(2)}°)
          </span>
          <span className="dasha-meta-pill">
            <strong>{isHi ? 'लग्न:' : 'Asc:'}</strong> {trSign(chart.ascendant.signIndex, lang)} {chart.ascendant.dms}
          </span>
          <span className="dasha-meta-pill">
            <strong>{isHi ? 'चंद्र:' : 'Moon:'}</strong> {trSign(chart.planets.find(p => p.id === 'Moon')?.signIndex ?? 0, lang)}
          </span>
        </div>
      </div>

      {/* 3. Dual Interactive Charts Viewport (D1 Lagna + D9/Chalit/Vargas) */}
      <div className="card" style={{ padding: '14px', background: 'var(--bg-elevated)' }}>
        <div className="charts-toolbar" style={{ marginBottom: '12px' }}>
          <div className="toolbar-group">
            <label className="checkbox-inline">
              <input
                type="checkbox"
                checked={showSpecialInChart}
                onChange={(e) => setShowSpecialInChart(e.target.checked)}
              />
              <span>{t.basics.showSpecialLagnas}</span>
            </label>
            <label className="checkbox-inline">
              <input
                type="checkbox"
                checked={showSavInChart}
                onChange={(e) => setShowSavInChart(e.target.checked)}
              />
              <span>{t.basics.overlaySav}</span>
            </label>
          </div>

          <div className="toolbar-group">
            <span className="label-muted" style={{ fontWeight: 700 }}>
              {isHi ? 'द्वितीय कुंडली (2nd Chart):' : 'Second Chart Window:'}
            </span>
            <select
              aria-label="Select Second Chart"
              className="select-compact"
              value={rightVarga}
              onChange={(e) => setRightVarga(e.target.value as DivisionalChartId | 'CHALIT')}
              style={{ fontWeight: 600, borderColor: 'var(--accent)' }}
            >
              <option value="D9">
                {isHi ? 'D9 — नवांश कुंडली (Navamsha — धर्म व जीवनसाथी)' : 'D9 — Navamsha (Dharma & Spouse)'}
              </option>
              <option value="CHANDRA">
                {isHi ? 'CHANDRA — चंद्र कुंडली (Chandra Kundali — मन व राशि लग्न)' : 'CHANDRA — Moon Chart (Chandra Kundali)'}
              </option>
              <option value="CHALIT">
                {isHi ? 'CHALIT — भाव चलित कुंडली (श्रीपति भाव संधि)' : 'CHALIT — Bhava Chalit (Sripati House Shifts)'}
              </option>
              <option value="D1">
                {isHi ? 'D1 — लग्न कुंडली (Lagna / Rashi Chart)' : 'D1 — Rasi Lagna Duplicate'}
              </option>
              <option value="D2">
                {isHi ? 'D2 — होरा कुंडली (Hora — धन व कोष)' : 'D2 — Hora (Wealth & Assets)'}
              </option>
              <option value="D3">
                {isHi ? 'D3 — द्रेष्काण कुंडली (Drekkana — पराक्रम व भ्राता)' : 'D3 — Drekkana (Courage & Siblings)'}
              </option>
              <option value="D4">
                {isHi ? 'D4 — चतुर्थांश कुंडली (Chaturthamsha — गृह व भाग्य)' : 'D4 — Chaturthamsha (Property)'}
              </option>
              <option value="D7">
                {isHi ? 'D7 — सप्तांश कुंडली (Saptamsha — संतान व वंश)' : 'D7 — Saptamsha (Children & Progeny)'}
              </option>
              <option value="D10">
                {isHi ? 'D10 — दशमांश कुंडली (Dashamsha — करियर व प्रतिष्ठा)' : 'D10 — Dashamsha (Career & Stature)'}
              </option>
              <option value="D12">
                {isHi ? 'D12 — द्वादशांश कुंडली (Dwadashamsha — माता-पिता)' : 'D12 — Dwadashamsha (Parents)'}
              </option>
              <option value="D16">
                {isHi ? 'D16 — षोडशांश कुंडली (Shodashamsha — वाहन व सुख)' : 'D16 — Shodashamsha (Vehicles & Joy)'}
              </option>
              <option value="D20">
                {isHi ? 'D20 — विंशांश कुंडली (Vimshamsha — उपासना व साधना)' : 'D20 — Vimshamsha (Spiritual Practice)'}
              </option>
              <option value="D24">
                {isHi ? 'D24 — चतुर्विंशांश (Siddhamsha — उच्च विद्या)' : 'D24 — Siddhamsha (Higher Education)'}
              </option>
              <option value="D27">
                {isHi ? 'D27 — भ Ret/नक्षत्र (Saptavimshamsha — शक्ति व दुर्बलता)' : 'D27 — Saptavimshamsha (Strengths)'}
              </option>
              <option value="D30">
                {isHi ? 'D30 — त्रिंशांश कुंडली (Trimshamsha — अरिष्ट व विघ्न)' : 'D30 — Trimshamsha (Misfortunes)'}
              </option>
              <option value="D40">
                {isHi ? 'D40 — खवेदांश कुंडली (Khavedamsha — शुभ-अशुभ फल)' : 'D40 — Khavedamsha (Auspiciousness)'}
              </option>
              <option value="D45">
                {isHi ? 'D45 — अक्षवेदांश (Akshavedamsha — सूक्ष्म चरित्र)' : 'D45 — Akshavedamsha (General Well-being)'}
              </option>
              <option value="D60">
                {isHi ? 'D60 — षष्ट्यंश कुंडली (Shashtiamsha — पूर्व जन्म कर्म)' : 'D60 — Shashtiamsha (Past Karma Root)'}
              </option>
            </select>
          </div>
        </div>

        {/* Dual Chart Render */}
        <div className="dual-chart-grid">
          <VedicChartSvg
            title={isHi ? 'राशि कुंडली (D1)' : 'Rasi (D1)'}
            subtitle={`${t.common.lagna}: ${trSign(chart.ascendant.signIndex, lang)} ${chart.ascendant.shortDms}`}
            style={chartStyle}
            lagnaSignIndex={chart.ascendant.signIndex}
            items={d1Items}
            savBindus={showSavInChart ? chart.ashtakavarga.sarva : undefined}
            centerLabel={isHi ? 'राशि (D1)' : 'RASI (D1)'}
          />
          <VedicChartSvg
            title={rightMeta.name}
            subtitle={rightMeta.sig}
            style={chartStyle}
            lagnaSignIndex={
              rightVarga === 'CHANDRA'
                ? moonSignIndex
                : rightVarga === 'CHALIT'
                ? chart.ascendant.signIndex
                : rightChart!.placements.find((p) => p.id === 'Asc')?.signIndex ?? 0
            }
            items={rightItems}
            centerLabel={
              rightVarga === 'CHANDRA'
                ? (isHi ? 'चंद्र' : 'MOON')
                : rightVarga === 'CHALIT'
                ? (isHi ? 'चलित' : 'CHALIT')
                : rightChart!.id
            }
          />
        </div>

        {/* Chart Legend */}
        <div className="legend-strip" style={{ marginTop: '10px' }}>
          {lang === 'hi' ? (
            <>
              <span><strong>(व)</strong> वक्री</span>
              <span><strong>*</strong> अस्त</span>
              <span><strong>↑</strong> उच्च</span>
              <span><strong>↓</strong> नीच</span>
              <span><strong>□</strong> वर्गोत्तम (D1=D9)</span>
            </>
          ) : (
            <>
              <span><strong>(R)</strong> Retrograde</span>
              <span><strong>*</strong> Combust</span>
              <span><strong>↑</strong> Exalted</span>
              <span><strong>↓</strong> Debilitated</span>
              <span><strong>□</strong> Vargottama (D1=D9)</span>
            </>
          )}
        </div>
      </div>

      {/* 4. The Master Workstation Console Toolbar & Switcher (Dropdown-First) */}
      <div
        className="card"
        style={{
          padding: '12px 16px',
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1 1 360px', minWidth: '280px' }}>
            <span style={{ fontWeight: 800, fontSize: '14px', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Compass size={17} style={{ color: 'var(--accent)' }} />
              <span>{isHi ? 'वर्कस्टेशन विश्लेषक / गणना टूल:' : 'Astrology Workstation Console Tool:'}</span>
            </span>
            <select
              aria-label="Select Workstation Console Tool"
              className="select-compact"
              value={consoleTool}
              onChange={(e) => setConsoleTool(e.target.value as WorkstationConsoleTool)}
              style={{
                flex: 1,
                fontWeight: 700,
                borderColor: 'var(--accent)',
                minHeight: '38px',
                fontSize: '13.5px',
                background: 'var(--bg-subtle)',
              }}
            >
              <optgroup label={isHi ? '🪐 वैदिक मूल गणना व ग्रह सामर्थ्य' : '🪐 Core Fundamentals & Strengths'}>
                <option value="planets">🪐 {isHi ? 'ग्रह स्थिति, अंश, नक्षत्र, दृष्टि व चर कारक' : 'Planetary Longitudes, Nakshatras & Dignities'}</option>
                <option value="cusps">🏛️ {isHi ? 'द्वादश भाव संधि, भाव मध्य व भाव विस्तार' : 'House Cusps & Bhava Spans (12 Bhavas)'}</option>
                <option value="dasha">⏳ {isHi ? 'विंशोत्तरी 5-स्तरीय दशा वृक्ष व योगिनी दशा' : '5-Level Vimshottari & Yogini Dasha Explorer'}</option>
                <option value="ashtakavarga">🔢 {isHi ? 'अष्टकवर्ग तालिका (SAV, BAV व शोधन)' : 'Ashtakavarga Matrix (SAV, BAV & Shodhanas)'}</option>
                <option value="shadbala">⚖️ {isHi ? 'षड्बल सामर्थ्य (6 बल, रूपा व इष्ट/कष्ट फल)' : 'Shadbala Strength Assessment (6 Balas & Rupas)'}</option>
                <option value="avakahada">📋 {isHi ? 'अवकहड़ा चक्र, पाया, गण, नाड़ी व घातक चक्र' : 'Avakahada Chakra, Paya & Ghatak Malefics'}</option>
                <option value="chalit">🔄 {isHi ? 'भाव चलित (श्रीपति) भाव परिवर्तन तालिका' : 'Bhava Chalit Sripati Shifts & Table'}</option>
                <option value="special">🌟 {isHi ? 'विशेष लग्न, उपग्रह व आरूढ़ पद (A1–A12)' : 'Special Lagnas, Arudhas & Upa-Grahas'}</option>
              </optgroup>

              <optgroup label={isHi ? '🎯 विशिष्ट एवं पाश्चात्य पद्धतियाँ' : '🎯 Advanced & Specialized Astrology Systems'}>
                <option value="kp">🎯 {isHi ? 'के.पी. नक्षत्र पद्धति (12 भाव उप-स्वामी व 4-स्टेप)' : 'KP System (12 Cusp Sub-Lords & 4-Step Theory)'}</option>
                <option value="lalkitab">📕 {isHi ? 'लाल किताब नियत मेष टेवा (सोये घर, ऋण व उपाय)' : 'Traditional Fixed Aries Tewa (Lal Kitab Soya Ghar & Upays)'}</option>
                <option value="numerology">🔢 {isHi ? 'अंक ज्योतिष व लो शु 3×3 मैजिक ग्रिड (मूलांक/भाग्यांक)' : 'Numerology & Lo Shu 3×3 Grid (Driver, Conductor, Kua)'}</option>
                <option value="remedies">💎 {isHi ? 'रत्न, रुद्राक्ष, मंत्र व दोष परिहार (मांगलिक, कालसर्प)' : 'Gemstones, Rudraksha, Mantras & Dosha Remedies'}</option>
                <option value="western">🌌 {isHi ? 'पाश्चात्य सायन 360° सर्कुलर व्हील व दृष्टियां' : 'Western Tropical 360° Circular Wheel & Aspect Grid'}</option>
                <option value="transits">🔄 {isHi ? 'वर्तमान गोचर व शनि साढ़े साती कालचक्र' : 'Live Planetary Transits (Gochar & Sade Sati)'}</option>
                <option value="varshaphala">☀️ {isHi ? 'वार्षिक ताजिक वर्षफल कुंडली व मुद्धा दशा' : 'Varshaphala / Tajika Solar Return Year Chart'}</option>
              </optgroup>

              <optgroup label={isHi ? '🔮 विस्तृत एवं अचूक फलादेश (Predictions)' : '🔮 Comprehensive In-Depth Predictions & Phala'}>
                <option value="twelve_planets">🌟 {isHi ? 'द्वादश ग्रह विस्तृत घटना फलादेश (9 वैदिक + 3 बाह्य ग्रह: हर्षल, नेपच्यून, प्लूटो)' : '12 Planets Detailed Event Predictions (Sun to Pluto)'}</option>
                <option value="yogas">📜 {isHi ? 'सक्रिय राजयोग व ग्रह युति फल (2-7 ग्रह युति व 300+ योग)' : 'Active Yogas & Conjunctions (2-7 Planet Stelliums)'}</option>
                <option value="deep_predictions">🏛️ {isHi ? 'विस्तृत समग्र जीवन फलादेश (व्यक्तित्व, धन, करियर, विवाह)' : 'Comprehensive Detailed Life Predictions (All Spheres)'}</option>
                <option value="timeline">⏳ {isHi ? '120-वर्षीय जीवन घटनाक्रम रेखा व आयु मील के पत्थर' : '120-Year Complete Life Events Timeline & Milestones'}</option>
                <option value="bhavas">🏠 {isHi ? 'द्वादश भाव संपूर्ण विस्तृत फलादेश (H1 से H12)' : '12 Bhavas Comprehensive Analysis'}</option>
                <option value="bnn">✨ {isHi ? 'भृगु नंदी नाड़ी व BSP (29 आयु नियम व दिशा त्रिकोण)' : 'Bhrigu Nandi Nadi & BSP Age Rules'}</option>
                <option value="yuti">⚡ {isHi ? 'ग्रह युति फल (2 से 7 ग्रह) व पारस्परिक दृष्टियां' : 'Planetary Conjunctions (2–7 Grahas) & Mutual Drishti'}</option>
                <option value="past_life">🔄 {isHi ? 'पूर्व जन्म कर्म (D60) व आगामी जन्म गति' : 'Past Life Karma (D60) & Future Incarnation'}</option>
              </optgroup>
            </select>
          </div>
        </div>
      </div>

      {/* 5. Active Console Content (Rendered in-place directly under the dual charts!) */}
      <div className="workstation-console-body">
        {/* TOOL: Planetary Longitudes Table */}
        {consoleTool === 'planets' && (
          <div className="basics-bottom-grid">
            <section className="panel">
              <div className="panel-header">
                <h3>{t.basics.grahaLongitudes}</h3>
                <span className="muted small-text">{allBodies.length} {isHi ? 'ग्रह व बिंदु' : 'bodies'}</span>
              </div>
              <div className="table-scroll">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>{t.common.body}</th>
                      <th>{t.common.sign}</th>
                      <th>{t.common.degree}</th>
                      <th>{t.common.nakshatra}</th>
                      <th>{t.common.lords}</th>
                      <th>{t.common.house}</th>
                      <th>{t.common.karaka}</th>
                      <th>{t.common.dignity}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allBodies.map((b) => (
                      <tr key={b.id}>
                        <td>
                          <div className="body-cell">
                            <span className="body-name">{trPlanet(b.id, lang)}</span>
                            {b.isRetrograde && b.id !== 'Rahu' && b.id !== 'Ketu' && (
                              <span className="tag tag-retro">{lang === 'hi' ? 'व' : 'R'}</span>
                            )}
                            {b.isCombust && <span className="tag tag-combust">{lang === 'hi' ? 'अ' : 'C'}</span>}
                            {b.isVargottama && <span className="tag tag-varg">{lang === 'hi' ? 'व' : 'V'}</span>}
                          </div>
                        </td>
                        <td>{trSign(b.signIndex, lang)}</td>
                        <td className="mono">{b.dms}</td>
                        <td>
                          {trTerm(b.nakshatraName, lang)} <span className="muted">{lang === 'hi' ? 'च' : 'P'}{b.pada}</span>
                        </td>
                        <td className="mono small-cell">
                          {trPlanetShort(b.signLord, lang)} / {trPlanetShort(b.nakshatraLord, lang)} / {trPlanetShort(b.subLord, lang)}
                        </td>
                        <td className="mono">{b.houseNumber}</td>
                        <td>
                          {b.charaKaraka ? <span className="tag tag-karaka">{b.charaKaraka}</span> : '—'}
                        </td>
                        <td>
                          <span className={`dignity-pill dig-${b.dignity.toLowerCase().replace(/\s+/g, '-')}`}>
                            {trTerm(b.dignity, lang)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Sidebar: Panchang & Birth Particulars */}
            <section className="panel">
              <div className="panel-header">
                <h3>{t.basics.panchangHeading}</h3>
                <span className="muted small-text">{chart.input.city}</span>
              </div>
              <div className="kv-list">
                <div className="kv-row">
                  <span>{t.basics.vara}</span>
                  <strong>
                    {lang === 'hi'
                      ? `${trTerm(chart.panchang.vara.name, lang)} · ${trPlanet(chart.panchang.vara.lord, lang)}`
                      : `${chart.panchang.vara.name} · ${chart.panchang.vara.lord}`}
                  </strong>
                </div>
                <div className="kv-row">
                  <span>{t.basics.tithi}</span>
                  <strong>
                    {trTerm(chart.panchang.tithi.paksha, lang)} {trTerm(chart.panchang.tithi.name, lang)} ({chart.panchang.tithi.percentRemaining}% {t.basics.left})
                  </strong>
                </div>
                <div className="kv-row">
                  <span>{t.common.nakshatra}</span>
                  <strong>
                    {trTerm(chart.panchang.nakshatra.name, lang)} {lang === 'hi' ? 'च' : 'P'}{chart.panchang.nakshatra.pada} ({trPlanet(chart.panchang.nakshatra.lord, lang)}) · {chart.panchang.nakshatra.percentRemaining}% {t.basics.left}
                  </strong>
                </div>
                <div className="kv-row">
                  <span>{t.basics.yoga}</span>
                  <strong>
                    {trTerm(chart.panchang.yoga.name, lang)} <span className="muted">({chart.panchang.yoga.meaning})</span>
                  </strong>
                </div>
                <div className="kv-row">
                  <span>{t.basics.karana}</span>
                  <strong>
                    {trTerm(chart.panchang.karana.name, lang)} ({trTerm(chart.panchang.karana.type, lang)})
                  </strong>
                </div>
                <div className="kv-row">
                  <span>{t.basics.horaLord}</span>
                  <strong>{trPlanet(chart.panchang.horaLord, lang)}</strong>
                </div>
                <div className="kv-divider" />
                <div className="kv-row">
                  <span>{t.basics.sunriseSunset}</span>
                  <strong className="mono">
                    {chart.panchang.sunriseLocal} / {chart.panchang.sunsetLocal}
                  </strong>
                </div>
                <div className="kv-row">
                  <span>{t.basics.dayDuration}</span>
                  <strong className="mono">{chart.panchang.dayDurationStr}</strong>
                </div>
                <div className="kv-row">
                  <span>{t.common.ayanamsa}</span>
                  <strong className="mono">{chart.ayanamsaDms}</strong>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* TOOL: House Cusps & Bhava Spans */}
        {consoleTool === 'cusps' && (
          <section className="panel">
            <div className="panel-header">
              <h3>{t.basics.bhavaCusps} ({t.houseSystems[chart.settings.houseSystem] ?? chart.settings.houseSystem})</h3>
              <span className="muted small-text">12 {isHi ? 'भाव' : 'Houses'}</span>
            </div>
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{t.common.house}</th>
                    <th>{t.common.sign}</th>
                    <th>{isHi ? 'भाव मध्य (Bhava Madhya)' : 'Bhava Cusp (Madhya)'}</th>
                    <th>{isHi ? 'भाव संधि आरंभ (Sandhi Start)' : 'Bhava Sandhi Start'}</th>
                    <th>{isHi ? 'डिग्री विस्तार' : 'Longitude'}</th>
                  </tr>
                </thead>
                <tbody>
                  {chart.houses.map((h) => (
                    <tr key={h.house}>
                      <td className="mono"><strong>{h.house}</strong></td>
                      <td>{trSign(h.signIndex, lang)}</td>
                      <td className="mono">{h.dms}</td>
                      <td className="mono small-cell">{formatDms(h.start)}</td>
                      <td className="mono small-cell">{formatDms(h.midpoint)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* TOOL: Complete 5-Level Vimshottari & Yogini Dasha Explorer */}
        {consoleTool === 'dasha' && (
          <DashaView chart={chart} />
        )}

        {/* TOOL: Ashtakavarga Matrix (SAV, BAV & Shodhanas) */}
        {consoleTool === 'ashtakavarga' && (
          <AshtakavargaView chart={chart} chartStyle={chartStyle} />
        )}

        {/* TOOL: Shadbala & Planetary Strengths */}
        {consoleTool === 'shadbala' && (
          <StrengthYogasView chart={chart} />
        )}

        {/* TOOL: KP System (12 Cusps, Sub-Lords & 4-Step) */}
        {consoleTool === 'kp' && (
          <PredictionsView
            chart={chart}
            chartStyle={chartStyle}
            requestedRoute={{ subTab: 'branchesNumerology', nested: 'kp', nonce: Date.now() }}
          />
        )}

        {/* TOOL: Lal Kitab (Fixed Aries Tewa, Pakka Ghar, Soya Ghar & Upays) */}
        {consoleTool === 'lalkitab' && (
          <PredictionsView
            chart={chart}
            chartStyle={chartStyle}
            requestedRoute={{ subTab: 'branchesNumerology', nested: 'lal_kitab', nonce: Date.now() }}
          />
        )}

        {/* TOOL: Numerology & Lo Shu 3×3 Grid */}
        {consoleTool === 'numerology' && (
          <AstroSageToolsView
            chart={chart}
            requestedMode={{ id: 'numerology', nonce: Date.now() }}
          />
        )}

        {/* TOOL: Gemstones, Rudraksha & Remedies */}
        {consoleTool === 'remedies' && (
          <AstroSageToolsView
            chart={chart}
            requestedMode={{ id: 'gems_rudraksha', nonce: Date.now() }}
          />
        )}

        {/* TOOL: Western Tropical 360° Circular Wheel & Aspect Grid */}
        {consoleTool === 'western' && (
          <WesternAstrologyView chart={chart} />
        )}

        {/* TOOL: Live Planetary Transits (Gochar & Sade Sati) */}
        {consoleTool === 'transits' && (
          <TransitsView natalChart={chart} settings={safeSettings} chartStyle={chartStyle} />
        )}

        {/* TOOL: Varshaphala / Tajika Solar Return Year Chart */}
        {consoleTool === 'varshaphala' && (
          <SpecializedAstrologyView
            chart={chart}
            chartStyle={chartStyle}
            requestedBranch={{ id: 'varshaphala', nonce: Date.now() }}
          />
        )}

        {/* TOOL: 12 Planets Detailed Event Predictions (9 Vedic + 3 Outer) */}
        {consoleTool === 'twelve_planets' && (
          <PredictionsView
            chart={chart}
            chartStyle={chartStyle}
            requestedRoute={{ subTab: 'twelve_planets', nonce: Date.now() }}
          />
        )}

        {/* TOOL: Comprehensive Detailed Life Predictions */}
        {consoleTool === 'deep_predictions' && (
          <PredictionsView
            chart={chart}
            chartStyle={chartStyle}
            requestedRoute={{ subTab: 'deep_life', nonce: Date.now() }}
          />
        )}

        {/* TOOL: 300+ Classical Vedic Yogas */}
        {consoleTool === 'yogas' && (
          <PredictionsView
            chart={chart}
            chartStyle={chartStyle}
            requestedRoute={{ subTab: 'classicalYogas', nonce: Date.now() }}
          />
        )}

        {/* TOOL: 120-Year Complete Life Events Timeline */}
        {consoleTool === 'timeline' && (
          <PredictionsView
            chart={chart}
            chartStyle={chartStyle}
            requestedRoute={{ subTab: 'eventsLedger', nonce: Date.now() }}
          />
        )}

        {/* TOOL: 12 Bhavas Comprehensive Analysis */}
        {consoleTool === 'bhavas' && (
          <PredictionsView
            chart={chart}
            chartStyle={chartStyle}
            requestedRoute={{ subTab: 'houseWise', nonce: Date.now() }}
          />
        )}

        {/* TOOL: Bhrigu Nandi Nadi & BSP Age Rules */}
        {consoleTool === 'bnn' && (
          <PredictionsView
            chart={chart}
            chartStyle={chartStyle}
            requestedRoute={{ subTab: 'bhriguNadi', nonce: Date.now() }}
          />
        )}

        {/* TOOL: Planetary Conjunctions (2-7 Grahas) & Mutual Drishti */}
        {consoleTool === 'yuti' && (
          <PredictionsView
            chart={chart}
            chartStyle={chartStyle}
            requestedRoute={{ subTab: 'yuti', nonce: Date.now() }}
          />
        )}

        {/* TOOL: Past Life Karma (D60) & Future Incarnation */}
        {consoleTool === 'past_life' && (
          <PredictionsView
            chart={chart}
            chartStyle={chartStyle}
            requestedRoute={{ subTab: 'pastFuture', nonce: Date.now() }}
          />
        )}

        {/* TOOL: Avakahada Chakra, Paya & Ghatak Chakra */}
        {consoleTool === 'avakahada' && (
          <div className="basic-sheet-grid">
            {renderDetailTable('Avakhada Chakra', 'अवकहड़ा चक्र', basicSheet.avakhadaDetails)}
            {renderDetailTable('Favourable Points', 'शुभ / अनुकूल बिंदु', basicSheet.favourablePoints)}
            {renderDetailTable('Ghatak Chakra (Malefics)', 'घातक चक्र (अशुभ प्रभाव)', basicSheet.ghatakMalefics)}
            {renderDetailTable('Person & Birth Details', 'व्यक्तिगत एवं जन्म विवरण', basicSheet.personDetails)}
          </div>
        )}

        {/* TOOL: Bhava Chalit Sripati Shifts & Table */}
        {consoleTool === 'chalit' && (
          <section className="panel">
            <div className="panel-header">
              <h3>{isHi ? 'भाव चलित (श्रीपति) भाव परिवर्तन विश्लेषण' : 'Bhava Chalit (Sripati) House Shifts Analysis'}</h3>
              <span className="muted small-text">
                {chalitData.shiftedBodies.length} {isHi ? 'ग्रहों का भाव परिवर्तन' : 'planet(s) shift houses'}
              </span>
            </div>
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{t.common.planet}</th>
                    <th>{isHi ? 'राशि भाव (D1)' : 'Rasi House (D1)'}</th>
                    <th>{isHi ? 'चलित भाव (Sripati)' : 'Chalit House'}</th>
                    <th>{isHi ? 'अंश स्थिति' : 'Longitude'}</th>
                    <th>{isHi ? 'भाव प्रभाव' : 'Shift Status'}</th>
                  </tr>
                </thead>
                <tbody>
                  {chalitData.placements.map((pl) => (
                    <tr key={pl.id}>
                      <td><strong>{trPlanet(pl.id, lang)}</strong></td>
                      <td className="mono">{pl.rasiHouse}</td>
                      <td className="mono"><strong>{pl.chalitHouse}</strong></td>
                      <td className="mono">{pl.dms}</td>
                      <td>
                        {pl.shifted ? (
                          <span className="tag tag-retro">
                            {isHi ? `H${pl.rasiHouse} से H${pl.chalitHouse} में विस्थापन` : `Shifted H${pl.rasiHouse} → H${pl.chalitHouse}`}
                          </span>
                        ) : (
                          <span className="tag tag-varg">
                            {isHi ? 'यथावत (Same House)' : 'Same House'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* TOOL: Special Lagnas & Upa-Grahas */}
        {consoleTool === 'special' && (
          <section className="panel">
            <div className="panel-header">
              <h3>{t.basics.specialLagnas} &amp; {isHi ? 'उपग्रह' : 'Upa-Grahas'}</h3>
              <span className="muted small-text">{chart.specialPoints.length} {isHi ? 'बिंदु' : 'points'}</span>
            </div>
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{isHi ? 'नाम' : 'Name'}</th>
                    <th>{t.common.sign}</th>
                    <th>{t.common.degree}</th>
                    <th>{t.common.house}</th>
                    <th>{t.common.nakshatra}</th>
                  </tr>
                </thead>
                <tbody>
                  {chart.specialPoints.map((sp) => (
                    <tr key={sp.id}>
                      <td><strong>{sp.label}</strong> <span className="muted mono">({sp.shortLabel})</span></td>
                      <td>{trSign(sp.signIndex, lang)}</td>
                      <td className="mono">{sp.dms}</td>
                      <td className="mono">{sp.houseNumber}</td>
                      <td>{trTerm(sp.nakshatraName, lang)} <span className="muted">{lang === 'hi' ? 'च' : 'P'}{sp.pada}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
