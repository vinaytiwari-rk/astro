import React, { useMemo, useState } from 'react';
import { calculateChart } from '../../astro/calculator';
import { DIVISIONAL_META, NINE_GRAHAS } from '../../astro/constants';
import { computeAshtakoota } from '../../astro/matchmaking';
import { computeSouthIndianPorutham } from '../../astro/porutham';
import { computeFullLalKitabReport } from '../../astro/lalKitabExtended';
import type { BirthInput, CalcSettings, ChartData, ChartStyle, DivisionalChartId } from '../../astro/types';
import {
  computeMonthlyEphemerisRows,
  computeRashiMutualDistances,
} from '../../astro/workstationUtils';
import { trPlanet, trPlanetShort, trSign, trSignShort, trVarga, type AppLanguage } from '../../i18n/translations';
import { VedicChartSvg } from '../VedicChartSvg';
import { buildVargaBadges } from './AvChartPaneWidget';
import {
  DossierSummaryWidget,
  JaiminiArudhasWidget,
  KpCuspsRulingWidget,
  RenderCustomWidget,
  VimsopakaWidget,
  YogasActiveWidget,
} from './AvWorksheetWidgets';
import {
  DEFAULT_CUSTOM_PRESETS,
  WIDGET_CATALOG,
  type ChartDisplayOptions,
  type CustomWidgetId,
  type CustomWorksheetPreset,
} from './workstationTypes';

/* ============================================================
 * WORKSHEET 2: ALL 20 VARGAS WALL + SIGN MATRIX + VIMSOPAKA
 * ============================================================ */
export const VargasWorksheet: React.FC<{
  chart: ChartData;
  chartStyle: ChartStyle;
  lang: AppLanguage;
}> = ({ chart, chartStyle, lang }) => {
  const isHi = lang === 'hi';
  const [subMode, setSubMode] = useState<'grid' | 'matrix' | 'vimsopaka'>('grid');
  const [focusedVarga, setFocusedVarga] = useState<DivisionalChartId>('D9');

  return (
    <div className="av-ws-stack">
      <div className="av-pane-bar">
        <div className="av-subtabs-xs">
          <button type="button" className={subMode === 'grid' ? 'is-on' : ''} onClick={() => setSubMode('grid')}>
            {isHi ? 'सभी 20 वर्ग चक्र (D1–D60)' : 'All 20 Vargas Grid (D1–D60)'}
          </button>
          <button type="button" className={subMode === 'matrix' ? 'is-on' : ''} onClick={() => setSubMode('matrix')}>
            {isHi ? 'षोडशवर्ग राशि तालिका (Varga Table)' : 'Shodashvarga Sign Matrix Table'}
          </button>
          <button type="button" className={subMode === 'vimsopaka' ? 'is-on' : ''} onClick={() => setSubMode('vimsopaka')}>
            {isHi ? 'विंशोपक बल (4 श्रेणियां)' : 'Vimsopaka Bala (All 4 Sets)'}
          </button>
        </div>
        <span className="av-pane-sub">
          {isHi ? `चयनित वर्ग: ${focusedVarga}` : `Focused Chart: ${focusedVarga} · Vimsopaka Mean Score Included`}
        </span>
      </div>

      {subMode === 'grid' && (
        <div className="av-varga-wall">
          {DIVISIONAL_META.map((m) => {
            const dc = chart.divisionalCharts[m.id];
            const vm = trVarga(dc.id, dc.name, dc.signification, lang);
            return (
              <div
                key={m.id}
                className={`av-varga-tile ${focusedVarga === m.id ? 'is-sel' : ''}`}
                onClick={() => setFocusedVarga(m.id)}
              >
                <VedicChartSvg
                  title={`${dc.id} · ${vm.name}`}
                  style={chartStyle}
                  lagnaSignIndex={dc.lagnaSignIndex}
                  items={buildVargaBadges(chart, m.id, lang, false)}
                  centerLabel={dc.id}
                  compact
                  showDownload={false}
                />
              </div>
            );
          })}
        </div>
      )}

      {subMode === 'matrix' && (
        <div className="av-pane-card">
          <div className="av-pane-scroll">
            <table className="av-table-dense">
              <thead>
                <tr>
                  <th>Varga</th>
                  <th>Lagna</th>
                  {NINE_GRAHAS.map((g) => (
                    <th key={g}>{trPlanetShort(g, lang)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DIVISIONAL_META.map((m) => {
                  const dc = chart.divisionalCharts[m.id];
                  return (
                    <tr key={m.id}>
                      <td><strong>{m.id}</strong> ({m.name})</td>
                      <td><strong>{trSignShort(dc.lagnaSignIndex, lang)}</strong></td>
                      {NINE_GRAHAS.map((g) => {
                        const pl = dc.placements.find((x) => x.id === g);
                        return (
                          <td key={g}>
                            {pl ? trSignShort(pl.signIndex, lang) : '-'}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {subMode === 'vimsopaka' && <VimsopakaWidget chart={chart} lang={lang} />}
    </div>
  );
};

/* ============================================================
 * WORKSHEET 6: YOGAS & CLASSICAL SYSTEMS (KP / JAIMINI / LAL KITAB)
 * ============================================================ */
export const ResearchAndSystemsWorksheet: React.FC<{
  chart: ChartData;
  profiles?: BirthInput[];
  settings?: CalcSettings;
  lang: AppLanguage;
  onLoadProfileOrBenchmark?: (input: BirthInput) => void;
}> = ({ chart, lang }) => {
  const isHi = lang === 'hi';
  const [rightTab, setRightTab] = useState<'kp' | 'jaimini' | 'lalkitab' | 'dossier'>('kp');

  const lk = useMemo(() => computeFullLalKitabReport(chart, new Date().getFullYear()), [chart]);

  return (
    <div className="av-grid-2">
      {/* Left Pane: Active Classical Yogas & Encyclopedia */}
      <div className="av-pane-card">
        <div className="av-pane-header">
          <div className="av-pane-title">
            {isHi ? 'सक्रिय शास्त्रीय योग एवं फलित कोष' : 'Active Classical Yogas & Dictionary'}
          </div>
        </div>
        <div className="av-pane-inner-fill">
          <YogasActiveWidget chart={chart} lang={lang} />
        </div>
      </div>

      {/* Right Pane: KP / Jaimini / Lal Kitab / 360 Dossier */}
      <div className="av-pane-card">
        <div className="av-pane-header">
          <div className="av-subtabs-xs">
            <button type="button" className={rightTab === 'kp' ? 'is-on' : ''} onClick={() => setRightTab('kp')}>KP</button>
            <button type="button" className={rightTab === 'jaimini' ? 'is-on' : ''} onClick={() => setRightTab('jaimini')}>Jaimini</button>
            <button type="button" className={rightTab === 'lalkitab' ? 'is-on' : ''} onClick={() => setRightTab('lalkitab')}>Lal Kitab</button>
            <button type="button" className={rightTab === 'dossier' ? 'is-on' : ''} onClick={() => setRightTab('dossier')}>360° Matrix</button>
          </div>
        </div>

        <div className="av-pane-inner-fill">
          {rightTab === 'kp' && <KpCuspsRulingWidget chart={chart} lang={lang} />}
          {rightTab === 'jaimini' && <JaiminiArudhasWidget chart={chart} lang={lang} />}
          {rightTab === 'dossier' && <DossierSummaryWidget chart={chart} lang={lang} />}
          {rightTab === 'lalkitab' && (
            <div className="av-pane-scroll">
              <div className="av-mini-banner">
                <strong>Teva Type:</strong> {isHi ? lk.tevaTypeHi : lk.tevaTypeEn} — {isHi ? lk.tevaReasonHi : lk.tevaReasonEn}
              </div>
              <table className="av-table-dense">
                <thead><tr><th>Planet</th><th>Varsha Hs</th><th>Pakka</th><th>Status</th><th>Remedy</th></tr></thead>
                <tbody>
                  {lk.planets.map((p) => (
                    <tr key={p.planet}>
                      <td><strong>{trPlanetShort(p.planet, lang)}</strong></td>
                      <td className="mono">H{p.varshaHouse}</td>
                      <td className="mono">H{p.pakkaGhar}</td>
                      <td>{isHi ? p.statusHi : p.statusEn}</td>
                      <td>{isHi ? p.remedyHi : p.remedyEn}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ============================================================
 * WORKSHEET 7: MATCHMAKING (ASHTAKOOTA + DASHAKOOTA + RASHI DISTANCES)
 * ============================================================ */
export const MatchmakingWorksheet: React.FC<{
  chart: ChartData;
  chartStyle: ChartStyle;
  profiles: BirthInput[];
  settings: CalcSettings;
  lang: AppLanguage;
}> = ({ chart, chartStyle, profiles, settings, lang }) => {
  const isHi = lang === 'hi';
  const [matchTab, setMatchTab] = useState<'ashtakoota' | 'dashakoota' | 'rashi_dist'>('ashtakoota');
  const [partnerId, setPartnerId] = useState<string>(() => {
    const other = profiles.find((p) => p.id !== chart.input.id);
    return other?.id ?? profiles[0]?.id ?? chart.input.id;
  });

  const partnerInput = profiles.find((p) => p.id === partnerId) ?? profiles[0];
  const partnerChart = useMemo(() => calculateChart(partnerInput, settings), [partnerInput, settings]);
  const match = useMemo(() => computeAshtakoota(chart, partnerChart), [chart, partnerChart]);
  const dashaPorutham = useMemo(() => computeSouthIndianPorutham(chart, partnerChart), [chart, partnerChart]);
  const rashiDistances = useMemo(() => computeRashiMutualDistances(chart, partnerChart), [chart, partnerChart]);

  return (
    <div className="av-ws-stack">
      <div className="av-pane-bar">
        <div>
          <strong>Chart A:</strong> {chart.input.name} ({trSign(chart.ascendant.signIndex, lang)})
          {' '}vs{' '}
          <strong>Chart B:</strong>{' '}
          <select
            aria-label="Select Partner Chart"
            className="av-select-xs"
            value={partnerInput.id}
            onChange={(e) => setPartnerId(e.target.value)}
          >
            {profiles.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.date} · {p.city})
              </option>
            ))}
          </select>
        </div>
        <div className="av-score-pill">
          Ashtakoota: <strong>{match.totalObtained}/36</strong> · Dashakoota: <strong>{dashaPorutham.totalScore}/{dashaPorutham.maxScore}</strong>
        </div>
      </div>

      <div className="av-grid-2">
        <div className="av-pane-card">
          <div className="av-pane-header">
            <div className="av-pane-title">{chart.input.name} vs {partnerChart.input.name} — D1 Side-by-Side</div>
          </div>
          <div className="av-split-mini">
            <div style={{ flex: 1 }}>
              <VedicChartSvg
                title={chart.input.name}
                style={chartStyle}
                lagnaSignIndex={chart.ascendant.signIndex}
                items={buildVargaBadges(chart, 'D1', lang)}
                centerLabel="CHART A"
                compact
                showDownload={false}
              />
            </div>
            <div style={{ flex: 1 }}>
              <VedicChartSvg
                title={partnerChart.input.name}
                style={chartStyle}
                lagnaSignIndex={partnerChart.ascendant.signIndex}
                items={buildVargaBadges(partnerChart, 'D1', lang)}
                centerLabel="CHART B"
                compact
                showDownload={false}
              />
            </div>
          </div>
        </div>

        <div className="av-pane-card">
          <div className="av-pane-header">
            <div className="av-pane-title">
              {isHi ? 'विवाह मिलान, दशकूट व राशि दूरी' : 'Compatibility Matrix (Ashtakoota, Dashakoota & Rashi)'}
            </div>
            <div className="av-subtabs-xs">
              <button type="button" className={matchTab === 'ashtakoota' ? 'is-on' : ''} onClick={() => setMatchTab('ashtakoota')}>
                Ashtakoota (36)
              </button>
              <button type="button" className={matchTab === 'dashakoota' ? 'is-on' : ''} onClick={() => setMatchTab('dashakoota')}>
                Dashakoota (10)
              </button>
              <button type="button" className={matchTab === 'rashi_dist' ? 'is-on' : ''} onClick={() => setMatchTab('rashi_dist')}>
                Rashi Distances
              </button>
            </div>
          </div>
          <div className="av-pane-scroll">
            {matchTab === 'ashtakoota' && (
              <>
                <div className="av-mini-banner">
                  <strong>Manglik:</strong> A: {match.brideManglik.isManglik ? 'Yes' : 'No'} · B: {match.groomManglik.isManglik ? 'Yes' : 'No'} · Compatible: <strong>{match.manglikCompatible ? 'Yes' : 'Review'}</strong>
                </div>
                <table className="av-table-dense">
                  <thead><tr><th>Koota</th><th>Chart A</th><th>Chart B</th><th>Score</th><th>Note</th></tr></thead>
                  <tbody>
                    {match.kootas.map((k) => (
                      <tr key={k.name}>
                        <td><strong>{k.name}</strong></td>
                        <td>{k.brideValue}</td>
                        <td>{k.groomValue}</td>
                        <td className="mono"><strong>{k.obtainedPoints}/{k.maxPoints}</strong></td>
                        <td>{k.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            {matchTab === 'dashakoota' && (
              <>
                <div className="av-mini-banner">
                  <strong>10 Porutham Verdict:</strong> {isHi ? dashaPorutham.verdictHi : dashaPorutham.verdictEn}
                </div>
                <table className="av-table-dense">
                  <thead><tr><th>Porutham</th><th>Chart A</th><th>Chart B</th><th>Score</th><th>Note</th></tr></thead>
                  <tbody>
                    {dashaPorutham.items.map((it) => (
                      <tr key={it.key}>
                        <td><strong>{isHi ? it.nameHi : it.nameEn}</strong></td>
                        <td>{it.brideVal}</td>
                        <td>{it.groomVal}</td>
                        <td className="mono"><strong>{it.score}</strong> ({it.status.split(' ')[0]})</td>
                        <td>{isHi ? it.noteHi : it.noteEn}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            {matchTab === 'rashi_dist' && (
              <table className="av-table-dense">
                <thead>
                  <tr>
                    <th>Body</th>
                    <th>Sign A</th>
                    <th>Sign B</th>
                    <th>Rashi Dist</th>
                    <th>Star A</th>
                    <th>Star B</th>
                    <th>Nak Dist</th>
                  </tr>
                </thead>
                <tbody>
                  {rashiDistances.map((r) => (
                    <tr key={r.body}>
                      <td><strong>{r.body}</strong></td>
                      <td>{r.signA}</td>
                      <td>{r.signB}</td>
                      <td className="mono"><strong>{r.rashiDistance}</strong></td>
                      <td>{r.nakA}</td>
                      <td>{r.nakB}</td>
                      <td className="mono">{r.nakDistance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
 * WORKSHEET 8: MONTHLY EPHEMERIS & PANCHANGA TABLE
 * ============================================================ */
export const EphemerisWorksheet: React.FC<{
  chart: ChartData;
  settings: CalcSettings;
  lang: AppLanguage;
}> = ({ chart, settings, lang }) => {
  const [startDate, setStartDate] = useState<string>(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
  });
  const [daysCount, setDaysCount] = useState<number>(30);

  const rows = useMemo(
    () =>
      computeMonthlyEphemerisRows({
        startDateIso: startDate,
        daysCount,
        referenceTime: '05:30:00',
        timezone: chart.input.timezone,
        utcOffsetMinutes: chart.input.utcOffsetMinutes,
        settings,
      }),
    [startDate, daysCount, chart.input.timezone, chart.input.utcOffsetMinutes, settings]
  );

  return (
    <div className="av-pane-card" style={{ height: '100%' }}>
      <div className="av-pane-header">
        <div className="av-pane-title">
          {lang === 'hi' ? 'मासिक ग्रह पंचांग व ग्रह स्पष्ट सारणी (05:30 AM)' : 'Monthly Sidereal Ephemeris & Daily Panchanga (05:30 Local)'}
        </div>
        <div className="av-pane-actions">
          <input
            type="date"
            aria-label="Ephemeris Start Date"
            className="av-input-xs"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <select
            aria-label="Ephemeris Days"
            className="av-select-xs"
            value={daysCount}
            onChange={(e) => setDaysCount(Number(e.target.value))}
          >
            <option value={15}>15 Days</option>
            <option value={30}>30 Days</option>
          </select>
        </div>
      </div>
      <div className="av-pane-scroll">
        <table className="av-table-dense">
          <thead>
            <tr>
              <th>Date</th>
              <th>Day</th>
              <th>Tithi</th>
              <th>Nakshatra</th>
              <th>Sun</th>
              <th>Moon</th>
              <th>Mars</th>
              <th>Merc</th>
              <th>Jup</th>
              <th>Ven</th>
              <th>Sat</th>
              <th>Rahu</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.dateIso}>
                <td className="mono"><strong>{r.dateDmy}</strong></td>
                <td>{r.varaShort}</td>
                <td>{r.paksha[0]} {r.tithiName}</td>
                <td>{r.nakshatraName}</td>
                {(['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu'] as const).map((pl) => {
                  const c = r.planets[pl];
                  return (
                    <td key={pl} className="mono">
                      {c.signShort} {c.dmsShort}{c.isRetrograde ? 'R' : ''}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ============================================================
 * WORKSHEET 9: CUSTOMIZABLE MULTI-PANE WORKSHEET BUILDER
 * ============================================================ */
const STORAGE_CUSTOM_WS_KEY = 'av_astro_vibe_custom_ws_v1';

export const CustomBuilderWorksheet: React.FC<{
  chart: ChartData;
  chartStyle: ChartStyle;
  lang: AppLanguage;
  displayOptions: ChartDisplayOptions;
  onUpdateDisplayOptions: (next: ChartDisplayOptions) => void;
}> = ({ chart, chartStyle, lang, displayOptions, onUpdateDisplayOptions }) => {
  const isHi = lang === 'hi';
  const [preset, setPreset] = useState<CustomWorksheetPreset>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_CUSTOM_WS_KEY);
      if (raw) return JSON.parse(raw) as CustomWorksheetPreset;
    } catch {
      // ignore
    }
    return DEFAULT_CUSTOM_PRESETS[0];
  });

  const savePreset = (next: CustomWorksheetPreset) => {
    setPreset(next);
    try {
      localStorage.setItem(STORAGE_CUSTOM_WS_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const slotCount = preset.layout === '2-pane' ? 2 : preset.layout === '4-pane' ? 4 : 6;
  const activeSlots = preset.slots.slice(0, slotCount);
  while (activeSlots.length < slotCount) {
    activeSlots.push('planets_table');
  }

  return (
    <div className="av-ws-stack">
      <div className="av-pane-bar">
        <div className="av-pane-actions">
          <strong>{isHi ? 'वर्कशीट लेआउट:' : 'Custom Layout:'}</strong>
          <select
            aria-label="Custom Preset"
            className="av-select-xs"
            value={preset.id}
            onChange={(e) => {
              const found = DEFAULT_CUSTOM_PRESETS.find((p) => p.id === e.target.value);
              if (found) savePreset(found);
            }}
          >
            {DEFAULT_CUSTOM_PRESETS.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <select
            aria-label="Pane Count"
            className="av-select-xs"
            value={preset.layout}
            onChange={(e) =>
              savePreset({ ...preset, layout: e.target.value as CustomWorksheetPreset['layout'] })
            }
          >
            <option value="2-pane">2 Panes (Split)</option>
            <option value="4-pane">4 Panes (2×2 Quad)</option>
            <option value="6-pane">6 Panes (3×2 Pro)</option>
          </select>
        </div>

        <div className="av-pane-actions">
          {activeSlots.map((slotWidget, idx) => (
            <select
              key={idx}
              aria-label={`Pane ${idx + 1} Widget`}
              className="av-select-xs"
              value={slotWidget}
              onChange={(e) => {
                const nextSlots = [...activeSlots];
                nextSlots[idx] = e.target.value as CustomWidgetId;
                savePreset({ ...preset, slots: nextSlots });
              }}
            >
              {WIDGET_CATALOG.map((w) => (
                <option key={w.id} value={w.id}>
                  Pane {idx + 1}: {isHi ? w.labelHi : w.labelEn}
                </option>
              ))}
            </select>
          ))}
        </div>
      </div>

      <div className={preset.layout === '2-pane' ? 'av-grid-2' : preset.layout === '6-pane' ? 'av-grid-6' : 'av-grid-4'}>
        {activeSlots.map((widgetId, idx) => (
          <RenderCustomWidget
            key={`${widgetId}-${idx}`}
            widgetId={widgetId}
            chart={chart}
            chartStyle={chartStyle}
            lang={lang}
            displayOptions={displayOptions}
            vargaId={preset.vargaId}
            onUpdateDisplayOptions={onUpdateDisplayOptions}
            onChangeVargaId={(nextV) => savePreset({ ...preset, vargaId: nextV })}
          />
        ))}
      </div>
    </div>
  );
};
