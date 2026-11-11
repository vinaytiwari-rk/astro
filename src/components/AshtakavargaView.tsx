import React, { useEffect, useState } from 'react';
import { SEVEN_PLANETS, SIGNS } from '../astro/constants';
import type { ChartData, ChartStyle, SevenPlanetId } from '../astro/types';
import { useLanguage } from '../i18n/LanguageContext';
import { trPlanet, trPlanetShort, trSignShort } from '../i18n/translations';
import { VedicChartSvg } from './VedicChartSvg';

interface AshtakavargaViewProps {
  chart: ChartData;
  chartStyle: ChartStyle;
  requestedMode?: { id?: string; nonce: number };
}

export const AshtakavargaView: React.FC<AshtakavargaViewProps> = ({
  chart,
  chartStyle,
  requestedMode,
}) => {
  const { lang, t } = useLanguage();
  const [mode, setMode] = useState<'raw' | 'prastara' | 'trikona' | 'ekadhipatya'>('raw');

  useEffect(() => {
    const id = requestedMode?.id;
    if (id === 'raw' || id === 'prastara' || id === 'trikona' || id === 'ekadhipatya') {
      setMode(id);
    }
  }, [requestedMode?.nonce, requestedMode?.id]);
  const [selectedPlanet, setSelectedPlanet] = useState<SevenPlanetId | 'SAV'>('SAV');
  const [prastaraTarget, setPrastaraTarget] = useState<SevenPlanetId | 'Asc'>('Sun');

  const av = chart.ashtakavarga;

  const activeBindus =
    selectedPlanet === 'SAV'
      ? av.sarva
      : mode === 'raw' || mode === 'prastara'
        ? av.bhinna[selectedPlanet]
        : mode === 'trikona'
          ? av.trikonaShodhana[selectedPlanet]
          : av.ekadhipatyaShodhana[selectedPlanet];

  const rows: Array<SevenPlanetId | 'Asc'> = [...SEVEN_PLANETS, 'Asc'];

  return (
    <div className="view-stack">
      <div className="charts-toolbar">
        <div className="subtab-bar">
          <button
            type="button"
            className={`subtab-btn ${mode === 'raw' ? 'is-active' : ''}`}
            onClick={() => setMode('raw')}
          >
            {lang === 'hi' ? `भिन्नाष्टक व सर्वाष्टकवर्ग (SAV = ${av.totalBindus})` : `Bhinna & Sarva (SAV = ${av.totalBindus})`}
          </button>
          <button
            type="button"
            className={`subtab-btn ${mode === 'prastara' ? 'is-active' : ''}`}
            onClick={() => setMode('prastara')}
          >
            {lang === 'hi' ? 'प्रस्ताराष्टकवर्ग (8×12)' : 'Prastarashtakavarga'}
          </button>
          <button
            type="button"
            className={`subtab-btn ${mode === 'trikona' ? 'is-active' : ''}`}
            onClick={() => setMode('trikona')}
          >
            {lang === 'hi' ? 'त्रिकोण शोधन' : 'Trikona Shodhana'}
          </button>
          <button
            type="button"
            className={`subtab-btn ${mode === 'ekadhipatya' ? 'is-active' : ''}`}
            onClick={() => setMode('ekadhipatya')}
          >
            {lang === 'hi' ? 'एकाधिपत्य शोधन' : 'Ekadhipatya Shodhana'}
          </button>
        </div>

        <div className="toolbar-group">
          <span className="label-muted">{lang === 'hi' ? 'कुंडली प्रदर्शन:' : 'Chart Overlay:'}</span>
          <select
            className="select-compact"
            value={selectedPlanet}
            onChange={(e) => setSelectedPlanet(e.target.value as SevenPlanetId | 'SAV')}
          >
            <option value="SAV">{lang === 'hi' ? 'सर्वाष्टकवर्ग (SAV)' : 'Sarva Ashtakavarga (SAV)'}</option>
            {SEVEN_PLANETS.map((p) => (
              <option key={p} value={p}>
                {lang === 'hi' ? `${trPlanet(p, lang)} भिन्नाष्टक` : `${p} BAV`}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="varga-focus-grid">
        <VedicChartSvg
          title={
            selectedPlanet === 'SAV'
              ? (lang === 'hi' ? 'सर्वाष्टकवर्ग (SAV)' : 'Sarva Ashtakavarga (SAV)')
              : (lang === 'hi' ? `${trPlanet(selectedPlanet, lang)} भिन्नाष्टक (BAV)` : `${selectedPlanet} BAV`)
          }
          subtitle={
            selectedPlanet === 'SAV'
              ? (lang === 'hi' ? 'प्रत्येक राशि में कुल शुभ बिंदु (≥28 शुभ, <25 कमजोर)' : 'Total benefic bindus per sign (≥28 favorable, <25 challenging)')
              : (lang === 'hi' ? 'राशि अनुसार ग्रह शुभ बिंदु' : `${mode === 'raw' ? 'Raw Bhinna' : mode === 'trikona' ? 'Trikona Reduced' : 'Ekadhipatya Reduced'} bindus`)
          }
          style={chartStyle}
          lagnaSignIndex={chart.ascendant.signIndex}
          savBindus={activeBindus}
          centerLabel={selectedPlanet === 'SAV' ? (lang === 'hi' ? 'सर्वाष्टक' : 'SARVA AV') : `${trPlanet(selectedPlanet, lang)} BAV`}
          items={[
            { id: 'Asc', label: trPlanetShort('Asc', lang), signIndex: chart.ascendant.signIndex, isLagna: true },
            ...chart.planets.map((p) => ({
              id: p.id,
              label: trPlanetShort(p.id, lang),
              signIndex: p.signIndex,
              isRetrograde: p.isRetrograde,
            })),
          ]}
        />

        <section className="panel">
          <div className="panel-header">
            <h3>{lang === 'hi' ? 'राशि अनुसार सर्वाष्टकवर्ग (SAV) बल' : 'Sign-wise SAV Distribution'}</h3>
            <span className="muted">{lang === 'hi' ? 'प्रत्येक राशि में 28 बिंदु औसत शुभ स्तर माना जाता है' : '28 is the classical average bindu threshold per Rasi'}</span>
          </div>
          <div className="sav-bars">
            {SIGNS.map((s) => {
              const house = ((s.index - chart.ascendant.signIndex + 12) % 12) + 1;
              const val = av.sarva[s.index];
              const pct = Math.min(100, (val / 48) * 100);
              const tone = val >= 30 ? 'high' : val >= 25 ? 'mid' : 'low';
              return (
                <div key={s.index} className="sav-bar-row">
                  <span className="sav-sign-label">
                    <strong>{trSignShort(s.index, lang)}</strong> <span className="muted">({t.common.house}{house})</span>
                  </span>
                  <div className="bar-track">
                    <div className={`bar-fill tone-${tone}`} style={{ width: `${pct}%` }} />
                  </div>
                  <strong className={`mono sav-num tone-text-${tone}`}>{val}</strong>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <section className="panel">
        <div className="panel-header">
          <h3>
            {mode === 'raw'
              ? (lang === 'hi' ? 'भिन्नाष्टकवर्ग तालिका (मूल बिंदु)' : 'Bhinna Ashtakavarga Matrix (Raw Bindus)')
              : mode === 'prastara'
                ? (lang === 'hi' ? `प्रस्ताराष्टकवर्ग — ${trPlanet(prastaraTarget, lang)} (योगदानकर्ता 8×12 बिंदु)` : `Prastarashtakavarga — ${prastaraTarget} (Contributor Breakdown)`)
                : mode === 'trikona'
                  ? (lang === 'hi' ? 'त्रिकोण शोधन तालिका' : 'Trikona Shodhana Matrix')
                  : (lang === 'hi' ? 'एकाधिपत्य शोधन तालिका' : 'Ekadhipatya Shodhana Matrix')}
          </h3>
          {mode === 'prastara' && (
            <div className="toolbar-group">
              <span className="label-muted">{lang === 'hi' ? 'ग्रह चुनें:' : 'Target Planet:'}</span>
              <select
                className="select-compact"
                value={prastaraTarget}
                onChange={(e) => setPrastaraTarget(e.target.value as SevenPlanetId | 'Asc')}
              >
                {rows.map((r) => (
                  <option key={r} value={r}>
                    {trPlanet(r, lang)}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        <div className="table-scroll">
          {mode === 'prastara' ? (
            <table className="data-table matrix-table">
              <thead>
                <tr>
                  <th>{lang === 'hi' ? 'प्रदाता (Contributor)' : 'Contributor'}</th>
                  {SIGNS.map((s) => (
                    <th key={s.index}>{trSignShort(s.index, lang)}</th>
                  ))}
                  <th>{t.common.total}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((contrib) => {
                  const arr = av.prastara?.[prastaraTarget]?.[contrib] ?? new Array(12).fill(0);
                  const total = arr.reduce((a, b) => a + b, 0);
                  return (
                    <tr key={contrib}>
                      <td><strong>{trPlanet(contrib, lang)}</strong></td>
                      {arr.map((v, idx) => (
                        <td key={idx} className={`mono ${v === 1 ? 'cell-strong' : 'muted'}`}>
                          {v === 1 ? '1' : '—'}
                        </td>
                      ))}
                      <td className="mono"><strong>{total}</strong></td>
                    </tr>
                  );
                })}
                <tr className="summary-row">
                  <td><strong>{lang === 'hi' ? 'कुल बिंदु' : 'BAV Total'}</strong></td>
                  {av.bhinna[prastaraTarget].map((v, idx) => (
                    <td key={idx} className={`mono ${v >= 5 ? 'cell-strong' : v <= 2 ? 'cell-weak' : ''}`}>
                      <strong>{v}</strong>
                    </td>
                  ))}
                  <td className="mono">
                    <strong>{av.bhinna[prastaraTarget].reduce((a, b) => a + b, 0)}</strong>
                  </td>
                </tr>
              </tbody>
            </table>
          ) : (
          <table className="data-table matrix-table">
            <thead>
              <tr>
                <th>{t.common.planet}</th>
                {SIGNS.map((s) => (
                  <th key={s.index}>{trSignShort(s.index, lang)}</th>
                ))}
                <th>{t.common.total}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                if (r === 'Asc' && mode !== 'raw') return null;
                const arr =
                  mode === 'raw'
                    ? av.bhinna[r]
                    : mode === 'trikona'
                      ? av.trikonaShodhana[r as SevenPlanetId]
                      : av.ekadhipatyaShodhana[r as SevenPlanetId];
                const total = arr.reduce((a, b) => a + b, 0);
                return (
                  <tr key={r}>
                    <td>
                      <strong>{r === 'Asc' ? (lang === 'hi' ? 'लग्न (प्रस्तार)' : 'Lagna (Prastara)') : trPlanet(r, lang)}</strong>
                    </td>
                    {arr.map((v, idx) => (
                      <td
                        key={idx}
                        className={`mono ${v >= 5 && r !== 'Asc' ? 'cell-strong' : v <= 2 ? 'cell-weak' : ''}`}
                      >
                        {v}
                      </td>
                    ))}
                    <td className="mono">
                      <strong>{total}</strong>
                    </td>
                  </tr>
                );
              })}
              {mode === 'raw' && (
                <tr className="summary-row">
                  <td>
                    <strong>{lang === 'hi' ? 'सर्वाष्टक योग (SAV)' : 'Sarva Total (SAV)'}</strong>
                  </td>
                  {av.sarva.map((v, idx) => (
                    <td key={idx} className={`mono ${v >= 30 ? 'cell-strong' : v < 25 ? 'cell-weak' : ''}`}>
                      <strong>{v}</strong>
                    </td>
                  ))}
                  <td className="mono">
                    <strong>{av.totalBindus}</strong>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          )}
        </div>
      </section>
    </div>
  );
};
