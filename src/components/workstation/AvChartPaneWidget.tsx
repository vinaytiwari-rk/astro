import React, { useMemo, useState } from 'react';
import { computeBhavaChalitPlacements } from '../../astro/avakahadaChalit';
import { computeBhavabalaReport } from '../../astro/bhavabalaEngine';
import { DIVISIONAL_META, NINE_GRAHAS, SIGNS } from '../../astro/constants';
import { computeArudhaPadas } from '../../astro/jaimini';
import { computeShadPhalaHouses } from '../../astro/shadPhalaEngine';
import type { ChartData, ChartStyle, DivisionalChartId } from '../../astro/types';
import type { AppLanguage } from '../../i18n/translations';
import { trPlanet, trPlanetShort, trSign, trVarga } from '../../i18n/translations';
import { VedicChartSvg, type ChartBadgeItem } from '../VedicChartSvg';
import type { ChartDisplayOptions } from './workstationTypes';

export function buildRasiBadges(
  chart: ChartData,
  displayOptions: ChartDisplayOptions,
  lang: AppLanguage
): { lagnaSignIndex: number; titleSuffix: string; items: ChartBadgeItem[] } {
  const { rasiRef, showArudhas, showDegrees } = displayOptions;
  let lagnaSignIndex = chart.ascendant.signIndex;
  let titleSuffix = lang === 'hi' ? 'लग्न कुंडली (D-1)' : 'Lagna Rasi (D-1)';

  const items: ChartBadgeItem[] = [];

  if (rasiRef === 'chalit') {
    titleSuffix = lang === 'hi' ? 'भाव चलित कुंडली' : 'Bhava Chalit (Cusps)';
    const chalit = computeBhavaChalitPlacements(chart);
    items.push({
      id: 'Asc',
      label: trPlanetShort('Asc', lang),
      signIndex: chart.ascendant.signIndex,
      isLagna: true,
    });
    for (const p of chart.planets) {
      const shiftedHouse = chalit.placements.find((c) => c.id === p.id)?.chalitHouse ?? p.houseNumber;
      const effSign = (chart.ascendant.signIndex + shiftedHouse - 1) % 12;
      items.push({
        id: p.id,
        label: showDegrees
          ? `${trPlanetShort(p.id, lang)} ${Math.floor(p.degreeInSign)}°`
          : trPlanetShort(p.id, lang),
        signIndex: effSign,
        isRetrograde: p.isRetrograde,
        isCombust: p.isCombust,
        isVargottama: p.isVargottama,
        dignity: p.dignity,
      });
    }
  } else {
    if (rasiRef === 'chandra') {
      const moon = chart.planets.find((p) => p.id === 'Moon');
      if (moon) lagnaSignIndex = moon.signIndex;
      titleSuffix = lang === 'hi' ? 'चंद्र लग्न कुंडली' : 'Chandra Kundli (Moon)';
    } else if (rasiRef === 'surya') {
      const sun = chart.planets.find((p) => p.id === 'Sun');
      if (sun) lagnaSignIndex = sun.signIndex;
      titleSuffix = lang === 'hi' ? 'सूर्य लग्न कुंडली' : 'Surya Kundli (Sun)';
    } else if (rasiRef === 'arudha') {
      const arudhas = computeArudhaPadas(chart);
      const al = arudhas.find((a) => a.label === 'AL');
      if (al) lagnaSignIndex = al.signIndex;
      titleSuffix = lang === 'hi' ? 'आरूढ़ लग्न कुंडली' : 'Arudha Lagna (AL)';
    } else if (rasiRef.startsWith('house:')) {
      const h = parseInt(rasiRef.split(':')[1] || '1', 10);
      lagnaSignIndex = (chart.ascendant.signIndex + Math.max(1, Math.min(12, h)) - 1) % 12;
      titleSuffix = lang === 'hi' ? `भाव-${h} आधारित कुंडली` : `Rotated Chart (H${h} Lagna)`;
    }

    items.push({
      id: 'Asc',
      label: showDegrees
        ? `${trPlanetShort('Asc', lang)} ${Math.floor(chart.ascendant.degreeInSign)}°`
        : trPlanetShort('Asc', lang),
      signIndex: chart.ascendant.signIndex,
      isLagna: true,
    });

    for (const p of chart.planets) {
      items.push({
        id: p.id,
        label: showDegrees
          ? `${trPlanetShort(p.id, lang)} ${Math.floor(p.degreeInSign)}°`
          : trPlanetShort(p.id, lang),
        signIndex: p.signIndex,
        isRetrograde: p.isRetrograde,
        isCombust: p.isCombust,
        isVargottama: p.isVargottama,
        dignity: p.dignity,
      });
    }
  }

  if (showArudhas) {
    const arudhas = computeArudhaPadas(chart);
    for (const a of arudhas) {
      if (a.label === 'AL' || a.label === 'UL' || a.label === 'A10' || a.label === 'A7') {
        items.push({
          id: a.label,
          label: a.label,
          signIndex: a.signIndex,
        });
      }
    }
  }

  return { lagnaSignIndex, titleSuffix, items };
}

export function buildVargaBadges(
  chart: ChartData,
  vargaId: DivisionalChartId,
  lang: AppLanguage,
  showDegrees = false
): ChartBadgeItem[] {
  const vc = chart.divisionalCharts[vargaId];
  return vc.placements.map((p) => ({
    id: p.id,
    label: showDegrees && p.id !== 'Asc'
      ? `${trPlanetShort(p.id, lang)} ${Math.floor(p.degreeInSign)}°`
      : trPlanetShort(p.id, lang),
    signIndex: p.signIndex,
    isLagna: p.id === 'Asc',
    isRetrograde: p.isRetrograde,
    isCombust: p.isCombust,
    dignity: p.dignity,
  }));
}

interface AvRasiPaneProps {
  chart: ChartData;
  chartStyle: ChartStyle;
  lang: AppLanguage;
  displayOptions: ChartDisplayOptions;
  onUpdateDisplayOptions: (next: ChartDisplayOptions) => void;
  onExploreSimilarPlanet?: (signIndex: number, yogaQuery?: string) => void;
}

export const AvRasiPane: React.FC<AvRasiPaneProps> = ({
  chart,
  chartStyle,
  lang,
  displayOptions,
  onUpdateDisplayOptions,
  onExploreSimilarPlanet,
}) => {
  const isHi = lang === 'hi';
  const { lagnaSignIndex, titleSuffix, items } = buildRasiBadges(chart, displayOptions, lang);
  const [inspector, setInspector] = useState<{ kind: 'planet' | 'house'; value: string | number } | null>(null);

  const shadPhala = useMemo(() => computeShadPhalaHouses(chart), [chart]);
  const bhavaReport = useMemo(() => computeBhavabalaReport(chart), [chart]);

  const inspectedPlanet = useMemo(() => {
    if (!inspector || inspector.kind !== 'planet') return null;
    const pl = chart.planets.find((p) => p.id === inspector.value);
    if (!pl) return null;
    const outgoing = chart.aspects.filter((a) => a.from === pl.id);
    const incoming = chart.aspects.filter((a) => a.to === pl.id);
    const yogas = chart.yogas.filter((y) => y.planets.includes(pl.id));
    return { pl, outgoing, incoming, yogas };
  }, [inspector, chart]);

  const inspectedHouse = useMemo(() => {
    if (!inspector || inspector.kind !== 'house') return null;
    const hNum = Number(inspector.value);
    const shad = shadPhala.find((s) => s.house === hNum);
    const bh = bhavaReport.houses.find((h) => h.house === hNum);
    return { hNum, shad, bh };
  }, [inspector, shadPhala, bhavaReport]);

  return (
    <div className="av-pane-card">
      <div className="av-pane-header">
        <div className="av-pane-title">{titleSuffix}</div>
        <div className="av-pane-actions">
          <select
            aria-label="Primary Rasi Reference"
            className="av-select-xs"
            value={displayOptions.rasiRef}
            onChange={(e) =>
              onUpdateDisplayOptions({
                ...displayOptions,
                rasiRef: e.target.value as ChartDisplayOptions['rasiRef'],
              })
            }
          >
            <option value="lagna">{isHi ? 'लग्न (D-1)' : 'Lagna (D-1)'}</option>
            <option value="chalit">{isHi ? 'भाव चलित' : 'Bhava Chalit'}</option>
            <option value="chandra">{isHi ? 'चंद्र लग्न' : 'Chandra'}</option>
            <option value="surya">{isHi ? 'सूर्य लग्न' : 'Surya'}</option>
            <option value="arudha">{isHi ? 'आरूढ़ लग्न' : 'Arudha (AL)'}</option>
          </select>
          <button
            type="button"
            className={`av-pill-xs ${displayOptions.showDegrees ? 'is-on' : ''}`}
            onClick={() =>
              onUpdateDisplayOptions({ ...displayOptions, showDegrees: !displayOptions.showDegrees })
            }
            title="Show planetary degrees"
          >
            °Deg
          </button>
          <button
            type="button"
            className={`av-pill-xs ${displayOptions.showArudhas ? 'is-on' : ''}`}
            onClick={() =>
              onUpdateDisplayOptions({ ...displayOptions, showArudhas: !displayOptions.showArudhas })
            }
            title="Toggle Arudha Padas (AL/UL)"
          >
            AL/UL
          </button>
          <button
            type="button"
            className={`av-pill-xs ${displayOptions.showSavInRasi ? 'is-on' : ''}`}
            onClick={() =>
              onUpdateDisplayOptions({ ...displayOptions, showSavInRasi: !displayOptions.showSavInRasi })
            }
            title="Toggle SAV Bindus"
          >
            SAV
          </button>
        </div>
      </div>

      <div className="av-pane-chart-wrap">
        <VedicChartSvg
          title={`${chart.input.name} · ${titleSuffix}`}
          subtitle={`${trSign(lagnaSignIndex, lang)} ${displayOptions.rasiRef === 'lagna' ? chart.ascendant.dms : ''}`}
          style={chartStyle}
          lagnaSignIndex={lagnaSignIndex}
          items={items}
          savBindus={displayOptions.showSavInRasi ? chart.ashtakavarga.sarva : undefined}
          centerLabel={displayOptions.rasiRef === 'lagna' ? 'D-1 RASI' : displayOptions.rasiRef.toUpperCase()}
          compact
          onSelectBody={(id) => {
            if (NINE_GRAHAS.includes(id as typeof NINE_GRAHAS[number])) {
              setInspector({ kind: 'planet', value: id });
            }
          }}
          onSelectHouse={(houseNum) => setInspector({ kind: 'house', value: houseNum })}
        />
      </div>

      {/* Interactive Graha / Bhava Explorer Strip */}
      <div className="av-explorer-strip">
        <span className="av-pane-sub">{isHi ? 'ग्रह / भाव एक्सप्लोरर:' : 'Explore Graha / House:'}</span>
        {NINE_GRAHAS.map((g) => (
          <button
            key={g}
            type="button"
            className={`av-pill-xs ${inspector?.kind === 'planet' && inspector.value === g ? 'is-on' : ''}`}
            onClick={() =>
              setInspector(
                inspector?.kind === 'planet' && inspector.value === g ? null : { kind: 'planet', value: g }
              )
            }
          >
            {trPlanetShort(g, lang)}
          </button>
        ))}
        <select
          aria-label="Inspect House or Rotate Chart"
          className="av-select-xs"
          value={inspector?.kind === 'house' ? String(inspector.value) : ''}
          onChange={(e) => {
            if (!e.target.value) setInspector(null);
            else setInspector({ kind: 'house', value: Number(e.target.value) });
          }}
        >
          <option value="">{isHi ? 'भाव (H1-H12)...' : 'House H1–H12...'}</option>
          {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
            <option key={h} value={h}>H{h}</option>
          ))}
        </select>
      </div>

      {/* Inline Explorer Inspector Card */}
      {inspectedPlanet && (
        <div className="av-explorer-box">
          <div className="av-explorer-head">
            <strong>
              {trPlanet(inspectedPlanet.pl.id, lang)} · {trSign(inspectedPlanet.pl.signIndex, lang)} ({inspectedPlanet.pl.dms}) · H{inspectedPlanet.pl.houseNumber}
            </strong>
            <div className="av-pane-actions">
              {onExploreSimilarPlanet && (
                <button
                  type="button"
                  className="av-pill-xs is-on"
                  onClick={() => onExploreSimilarPlanet(inspectedPlanet.pl.signIndex, inspectedPlanet.yogas[0]?.name)}
                >
                  Similar Charts
                </button>
              )}
              <button type="button" className="av-pill-xs" onClick={() => setInspector(null)}>×</button>
            </div>
          </div>
          <div className="av-explorer-meta">
            <span>Star: {inspectedPlanet.pl.nakshatraName}-{inspectedPlanet.pl.pada}</span>
            <span>Sub: {inspectedPlanet.pl.subLord}</span>
            <span>Dignity: {inspectedPlanet.pl.dignity}</span>
            <span>Yogas: {inspectedPlanet.yogas.map((y) => y.name).join(', ') || 'None'}</span>
          </div>
          <div className="av-aspect-bars">
            <div>
              <strong>Aspects On {inspectedPlanet.pl.id}:</strong>
              {inspectedPlanet.incoming.length === 0 ? ' None' : inspectedPlanet.incoming.slice(0, 4).map((a, i) => (
                <div key={i} className="av-bar-row">
                  <span>{a.from} ({a.type})</span>
                  <div className="av-bar-track"><div className="av-bar-fill" style={{ width: `${a.strengthPercent}%` }} /></div>
                  <span className="mono">{Math.round(a.strengthPercent)}%</span>
                </div>
              ))}
            </div>
            <div>
              <strong>Aspects From {inspectedPlanet.pl.id}:</strong>
              {inspectedPlanet.outgoing.length === 0 ? ' None' : inspectedPlanet.outgoing.slice(0, 4).map((a, i) => (
                <div key={i} className="av-bar-row">
                  <span>→ {a.to} ({a.type})</span>
                  <div className="av-bar-track"><div className="av-bar-fill is-out" style={{ width: `${a.strengthPercent}%` }} /></div>
                  <span className="mono">{Math.round(a.strengthPercent)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {inspectedHouse && inspectedHouse.shad && (
        <div className="av-explorer-box">
          <div className="av-explorer-head">
            <strong>
              House {inspectedHouse.hNum} ({inspectedHouse.shad.signName}) · Lord: {inspectedHouse.shad.lord} · Bhava Bala: {inspectedHouse.shad.bhavaRupas}R · SAV: {inspectedHouse.shad.savBindus}
            </strong>
            <div className="av-pane-actions">
              <button
                type="button"
                className="av-pill-xs is-on"
                onClick={() =>
                  onUpdateDisplayOptions({
                    ...displayOptions,
                    rasiRef: `house:${inspectedHouse.hNum}` as ChartDisplayOptions['rasiRef'],
                  })
                }
              >
                Rotate Lagna Here
              </button>
              <button type="button" className="av-pill-xs" onClick={() => setInspector(null)}>×</button>
            </div>
          </div>
          <div style={{ fontSize: '11px', marginTop: '4px' }}>
            <strong>{isHi ? inspectedHouse.shad.domainHi : inspectedHouse.shad.domainEn}:</strong>{' '}
            {isHi ? inspectedHouse.shad.readingHi : inspectedHouse.shad.readingEn}
          </div>
        </div>
      )}
    </div>
  );
};

interface AvVargaPaneProps {
  chart: ChartData;
  chartStyle: ChartStyle;
  lang: AppLanguage;
  vargaId: DivisionalChartId;
  onChangeVargaId?: (next: DivisionalChartId) => void;
  showDegrees?: boolean;
}

export const AvVargaPane: React.FC<AvVargaPaneProps> = ({
  chart,
  chartStyle,
  lang,
  vargaId,
  onChangeVargaId,
  showDegrees = false,
}) => {
  const dc = chart.divisionalCharts[vargaId];
  const meta = trVarga(dc.id, dc.name, dc.signification, lang);
  const items = buildVargaBadges(chart, vargaId, lang, showDegrees);

  return (
    <div className="av-pane-card">
      <div className="av-pane-header">
        <div className="av-pane-title">
          {dc.id} · {meta.name}
        </div>
        {onChangeVargaId && (
          <select
            aria-label="Select Divisional Chart"
            className="av-select-xs"
            value={vargaId}
            onChange={(e) => onChangeVargaId(e.target.value as DivisionalChartId)}
          >
            {DIVISIONAL_META.map((m) => (
              <option key={m.id} value={m.id}>
                {m.id} · {m.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="av-pane-chart-wrap">
        <VedicChartSvg
          title={`${dc.id} · ${meta.name}`}
          subtitle={meta.sig}
          style={chartStyle}
          lagnaSignIndex={dc.lagnaSignIndex}
          items={items}
          centerLabel={dc.id}
          compact
        />
      </div>
    </div>
  );
};
