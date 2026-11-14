import React, { useEffect, useMemo, useState } from 'react';
import { DIVISIONAL_META, NINE_GRAHAS } from '../astro/constants';
import {
  computeHigherDivisionalCharts,
  computeMicroSensitivityShift,
  getNadiamsaTitle,
  HIGHER_VARGA_META,
  type HigherVargaId,
} from '../astro/higherVargas';
import type { ChartData, ChartStyle, DivisionalChartId } from '../astro/types';
import { useLanguage } from '../i18n/LanguageContext';
import { trPlanet, trPlanetShort, trSign, trTerm, trVarga } from '../i18n/translations';
import { VedicChartSvg } from './VedicChartSvg';

interface VargasViewProps {
  chart: ChartData;
  chartStyle: ChartStyle;
  requestedVarga?: { id?: string; nonce: number };
}

const HIGHER_IDS: HigherVargaId[] = ['D64', 'D72', 'D81', 'D108', 'D144', 'D150', 'D300', 'D360'];

export const VargasView: React.FC<VargasViewProps> = ({ chart, chartStyle, requestedVarga }) => {
  const { lang, t } = useLanguage();
  const isHi = lang === 'hi';

  const [vargaMode, setVargaMode] = useState<'standard' | 'higher'>('standard');
  const [selectedId, setSelectedId] = useState<DivisionalChartId>('D9');
  const [selectedHigherId, setSelectedHigherId] = useState<HigherVargaId>('D108');
  const [compareRef, setCompareRef] = useState<'D1' | 'D9' | 'NONE'>('NONE');

  useEffect(() => {
    const id = requestedVarga?.id;
    if (!id) return;
    if (id === 'higher') {
      setVargaMode('higher');
      return;
    }
    if (HIGHER_IDS.includes(id as HigherVargaId)) {
      setVargaMode('higher');
      setSelectedHigherId(id as HigherVargaId);
      return;
    }
    const stdId = id as DivisionalChartId;
    if (chart.divisionalCharts[stdId]) {
      setVargaMode('standard');
      setSelectedId(stdId);
    }
  }, [requestedVarga?.nonce, requestedVarga?.id, chart.divisionalCharts]);

  const higherCharts = useMemo(() => computeHigherDivisionalCharts(chart), [chart]);
  const sensitivityRows = useMemo(
    () => (vargaMode === 'higher' ? computeMicroSensitivityShift(chart, selectedHigherId) : []),
    [chart, selectedHigherId, vargaMode]
  );

  const selectedChart = chart.divisionalCharts[selectedId];
  const selectedMeta = trVarga(selectedChart.id, selectedChart.name, selectedChart.signification, lang);

  const focusedHigher = higherCharts[selectedHigherId];
  const compareChartObj =
    compareRef === 'D1'
      ? chart.divisionalCharts.D1
      : compareRef === 'D9'
        ? chart.divisionalCharts.D9
        : null;

  return (
    <div className="view-stack">
      {/* Top Mode Switcher: Standard Shodashavarga (D1-D60) vs Higher Micro/Nadi Vargas (D64-D360) */}
      <div className="varga-mode-bar">
        <div className="subtab-bar">
          <button
            type="button"
            className={`subtab-btn ${vargaMode === 'standard' ? 'is-active' : ''}`}
            onClick={() => setVargaMode('standard')}
          >
            {isHi ? 'पारंपरिक षोडशवर्ग (D1–D60)' : 'Standard Shodashavarga (D1–D60)'}
          </button>
          <button
            type="button"
            className={`subtab-btn ${vargaMode === 'higher' ? 'is-active' : ''}`}
            onClick={() => setVargaMode('higher')}
          >
            {isHi
              ? 'उच्च सूक्ष्म एवं नाड़ी वर्ग (D64 · D72 · D81 · D108 · D144 · D150 · D300 · D360)'
              : 'Higher Micro & Nadi Vargas (D64 · D72 · D81 · D108 · D144 · D150 · D300 · D360)'}
          </button>
        </div>
      </div>

      {vargaMode === 'standard' && (
        <>
          {/* Focused Selected Varga + Details */}
          <div className="varga-focus-grid">
            <VedicChartSvg
              title={`${selectedMeta.name} (${selectedChart.id})`}
              subtitle={selectedMeta.sig}
              style={chartStyle}
              lagnaSignIndex={selectedChart.lagnaSignIndex}
              items={selectedChart.placements.map((p) => ({
                id: p.id,
                label: trPlanetShort(p.id, lang),
                signIndex: p.signIndex,
                isLagna: p.id === 'Asc',
                isRetrograde: p.isRetrograde,
                isCombust: p.isCombust,
                dignity: p.dignity,
              }))}
              centerLabel={`${selectedMeta.name} (${selectedChart.id})`}
            />

            <section className="panel">
              <div className="panel-header">
                <h3>
                  {selectedChart.id} — {selectedMeta.name}
                </h3>
                <span className="muted">{selectedMeta.sig}</span>
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
                    {selectedChart.placements.map((p) => {
                      const natalBody =
                        chart.ascendant.id === p.id
                          ? chart.ascendant
                          : chart.planets.find((x) => x.id === p.id);
                      const charaKaraka = natalBody?.charaKaraka;

                      return (
                        <tr key={p.id}>
                          <td>
                            <strong>{trPlanet(p.id, lang)}</strong>
                            {p.isRetrograde && p.id !== 'Rahu' && p.id !== 'Ketu' ? (isHi ? ' (व)' : ' (R)') : ''}
                            {p.isCombust && <span className="tag tag-combust" style={{ marginLeft: 4 }}>{isHi ? 'अ' : 'C'}</span>}
                          </td>
                          <td>{trSign(p.signIndex, lang)}</td>
                          <td className="mono">{p.dms}</td>
                          <td>
                            {trTerm(p.nakshatraName, lang)}{' '}
                            <span className="muted">{lang === 'hi' ? 'च' : 'P'}{p.pada}</span>
                          </td>
                          <td className="mono small-cell">
                            {trPlanetShort(p.signLord, lang)} / {trPlanetShort(p.nakshatraLord, lang)} / {trPlanetShort(p.subLord, lang)}
                          </td>
                          <td className="mono">{isHi ? `भाव ${p.houseFromVargaLagna}` : `H${p.houseFromVargaLagna}`}</td>
                          <td>
                            {charaKaraka ? <span className="tag tag-karaka">{charaKaraka}</span> : '—'}
                          </td>
                          <td>
                            <span className={`dignity-pill dig-${p.dignity.toLowerCase().replace(/\s+/g, '-')}`}>
                              {trTerm(p.dignity, lang)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="panel-subblock">
                <h4>{isHi ? 'षोडशवर्ग विंशोपक बल (20 में से)' : 'Shodashavarga Vimshopaka Bala (out of 20)'}</h4>
                <div className="vimshopaka-grid">
                  {NINE_GRAHAS.map((g) => {
                    const val = chart.vimshopakaShodash[g];
                    const pct = Math.min(100, (val / 20) * 100);
                    return (
                      <div key={g} className="vimshopaka-item">
                        <div className="vimshopaka-top">
                          <span>{trPlanet(g, lang)}</span>
                          <strong className="mono">{val.toFixed(2)}</strong>
                        </div>
                        <div className="bar-track">
                          <div className="bar-fill" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          </div>

          {/* All 20 Divisional Charts Gallery */}
          <section className="panel">
            <div className="panel-header">
              <h3>{isHi ? 'सभी 20 वर्ग कुंडलियाँ (षोडशवर्ग + D1–D60)' : 'All 20 Divisional Charts (Shodashavarga + D1–D60)'}</h3>
              <span className="muted">
                {isHi
                  ? 'विस्तृत ग्रह तालिका देखने हेतु किसी भी कुंडली पर क्लिक करें'
                  : 'Click any chart to inspect its planetary table above'}
              </span>
            </div>
            <div className="varga-gallery">
              {DIVISIONAL_META.map((meta) => {
                const dc = chart.divisionalCharts[meta.id];
                const vm = trVarga(dc.id, dc.name, dc.signification, lang);
                const isSelected = meta.id === selectedId;
                return (
                  <div
                    key={meta.id}
                    className={`varga-thumb ${isSelected ? 'is-selected' : ''}`}
                    onClick={() => setSelectedId(meta.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') setSelectedId(meta.id);
                    }}
                  >
                    <VedicChartSvg
                      title={`${dc.id} · ${vm.name}`}
                      style={chartStyle}
                      lagnaSignIndex={dc.lagnaSignIndex}
                      compact
                      showDownload={false}
                      centerLabel={dc.id}
                      items={dc.placements.map((p) => ({
                        id: p.id,
                        label: trPlanetShort(p.id, lang),
                        signIndex: p.signIndex,
                        isLagna: p.id === 'Asc',
                        isRetrograde: p.isRetrograde,
                        dignity: p.dignity,
                      }))}
                    />
                  </div>
                );
              })}
            </div>
          </section>
        </>
      )}

      {vargaMode === 'higher' && (
        <>
          {/* Quick Selector Ribbon for D64..D360 */}
          <section className="panel higher-varga-selector-panel">
            <div className="higher-selector-top">
              <div>
                <h3 style={{ margin: 0 }}>
                  {isHi
                    ? 'उच्च सूक्ष्म एवं नाड़ी वर्ग विश्लेषक (D-64 से D-360)'
                    : 'Higher Micro-Harmonic & Nadi Vargas Explorer (D-64 to D-360)'}
                </h3>
                <span className="muted small-text">
                  {isHi ? focusedHigher.meta.methodHi : focusedHigher.meta.methodEn} ·{' '}
                  {isHi ? 'प्रत्येक अंश विस्तार:' : 'Amsa span:'}{' '}
                  <strong className="mono">{focusedHigher.meta.spanDms}</strong>
                </span>
              </div>
              <div className="higher-compare-controls">
                <span className="label-muted">{isHi ? 'तुलना चार्ट:' : 'Compare with:'}</span>
                {(['NONE', 'D1', 'D9'] as const).map((refOpt) => (
                  <button
                    key={refOpt}
                    type="button"
                    className={`subtab-btn ${compareRef === refOpt ? 'is-active' : ''}`}
                    onClick={() => setCompareRef(refOpt)}
                  >
                    {refOpt === 'NONE'
                      ? isHi
                        ? 'केवल सूक्ष्म चार्ट'
                        : 'Single Focus'
                      : refOpt === 'D1'
                        ? isHi
                          ? 'D1 लग्न'
                          : 'D1 Rasi'
                        : isHi
                          ? 'D9 नवांश'
                          : 'D9 Navamsa'}
                  </button>
                ))}
              </div>
            </div>

            <div className="higher-pill-row">
              {HIGHER_VARGA_META.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className={`higher-varga-pill ${selectedHigherId === m.id ? 'is-active' : ''}`}
                  onClick={() => setSelectedHigherId(m.id)}
                >
                  <strong>{m.id}</strong>
                  <span>{m.spanDms}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Focused Chart(s) + Detailed Micro-Harmonic Placement Table */}
          <div className={compareChartObj ? 'view-stack' : 'varga-focus-grid'}>
            <div className={compareChartObj ? 'dual-chart-grid' : ''}>
              <VedicChartSvg
                title={isHi ? focusedHigher.meta.nameHi : focusedHigher.meta.nameEn}
                subtitle={`${isHi ? 'लग्न' : 'Lagna'}: ${trSign(focusedHigher.lagnaSignIndex, lang)} · ${isHi ? 'अंश #' : 'Amsa #'}${focusedHigher.lagnaAmsaNumber}/${focusedHigher.meta.division}`}
                style={chartStyle}
                lagnaSignIndex={focusedHigher.lagnaSignIndex}
                items={focusedHigher.placements.map((p) => ({
                  id: p.id,
                  label: trPlanetShort(p.id, lang),
                  signIndex: p.vargaSignIndex,
                  isLagna: p.id === 'Asc',
                  isRetrograde: p.isRetrograde,
                  isCombust: p.isCombust,
                  isVargottama: p.isMicroVargottama,
                  dignity: p.dignity,
                  tooltip: `${trPlanet(p.id, lang)}: ${trSign(p.vargaSignIndex, lang)} ${p.vargaDms} (${isHi ? 'अंश' : 'Amsa'} #${p.amsaNumber}/${focusedHigher.meta.division})`,
                }))}
                centerLabel={focusedHigher.meta.id}
              />

              {compareChartObj && (
                <VedicChartSvg
                  title={`${compareChartObj.id} — ${trVarga(compareChartObj.id, compareChartObj.name, compareChartObj.signification, lang).name}`}
                  subtitle={`${isHi ? 'तुलनात्मक आधार चार्ट' : 'Reference Comparison Chart'} (${compareChartObj.id})`}
                  style={chartStyle}
                  lagnaSignIndex={compareChartObj.lagnaSignIndex}
                  items={compareChartObj.placements.map((p) => ({
                    id: p.id,
                    label: trPlanetShort(p.id, lang),
                    signIndex: p.signIndex,
                    isLagna: p.id === 'Asc',
                    isRetrograde: p.isRetrograde,
                    isCombust: p.isCombust,
                    dignity: p.dignity,
                  }))}
                  centerLabel={compareChartObj.id}
                />
              )}
            </div>

            <section className="panel">
              <div className="panel-header">
                <h3>
                  {focusedHigher.meta.id} — {isHi ? focusedHigher.meta.nameHi : focusedHigher.meta.nameEn}
                </h3>
                <span className="muted">
                  {isHi ? focusedHigher.meta.significationHi : focusedHigher.meta.significationEn}
                </span>
              </div>

              {/* Khara 64th Navamsa Special Highlight Banner */}
              <div className="higher-khara-strip">
                <div>
                  <span className="muted small-text">{isHi ? 'लग्न से 64वां खर नवांश:' : '64th Khara Navamsa from Lagna:'}</span>{' '}
                  <strong>{trSign(focusedHigher.khara64thNavamsaLagnaSignIndex, lang)}</strong>
                </div>
                <div>
                  <span className="muted small-text">{isHi ? 'चंद्र से 64वां खर नवांश:' : '64th Khara Navamsa from Moon:'}</span>{' '}
                  <strong>{trSign(focusedHigher.khara64thNavamsaMoonSignIndex, lang)}</strong>
                </div>
                <div>
                  <span className="muted small-text">{isHi ? 'नाड़ीअंश लग्न (D150):' : 'D150 Lagna Nadiamsa:'}</span>{' '}
                  <strong>
                    {isHi
                      ? getNadiamsaTitle(higherCharts.D150.lagnaAmsaNumber).hi
                      : getNadiamsaTitle(higherCharts.D150.lagnaAmsaNumber).en}
                  </strong>
                </div>
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
                      <th>{isHi ? 'अंश / सूक्ष्म संयोग' : 'Amsa & Resonance'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {focusedHigher.placements.map((p) => {
                      const natalBody =
                        chart.ascendant.id === p.id
                          ? chart.ascendant
                          : chart.planets.find((x) => x.id === p.id);
                      const charaKaraka = natalBody?.charaKaraka;

                      return (
                        <tr key={p.id}>
                          <td>
                            <strong>{trPlanet(p.id, lang)}</strong>
                            {p.isRetrograde && p.id !== 'Rahu' && p.id !== 'Ketu' ? (isHi ? ' (व)' : ' (R)') : ''}
                            {p.isCombust && <span className="tag tag-combust" style={{ marginLeft: 4 }}>{isHi ? 'अ' : 'C'}</span>}
                          </td>
                          <td>{trSign(p.vargaSignIndex, lang)}</td>
                          <td className="mono">{p.vargaDms}</td>
                          <td>
                            {natalBody ? (
                              <>
                                {trTerm(natalBody.nakshatraName, lang)}{' '}
                                <span className="muted">{lang === 'hi' ? 'च' : 'P'}{natalBody.pada}</span>
                              </>
                            ) : (
                              '—'
                            )}
                          </td>
                          <td className="mono small-cell">
                            {natalBody
                              ? `${trPlanetShort(natalBody.signLord, lang)} / ${trPlanetShort(natalBody.nakshatraLord, lang)} / ${trPlanetShort(natalBody.subLord, lang)}`
                              : trPlanetShort(p.signLord, lang)}
                          </td>
                          <td className="mono">{isHi ? `भाव ${p.houseFromVargaLagna}` : `H${p.houseFromVargaLagna}`}</td>
                          <td>
                            {charaKaraka ? <span className="tag tag-karaka">{charaKaraka}</span> : '—'}
                          </td>
                          <td>
                            <span className={`dignity-pill dig-${p.dignity.toLowerCase().replace(/\s+/g, '-')}`}>
                              {trTerm(p.dignity, lang)}
                            </span>
                          </td>
                          <td>
                            <strong className="mono">#{p.amsaNumber}</strong>
                            {selectedHigherId === 'D150' && (
                              <span className="muted small-text" style={{ display: 'block' }}>
                                {isHi ? getNadiamsaTitle(p.amsaNumber).hi : getNadiamsaTitle(p.amsaNumber).en}
                              </span>
                            )}
                            {p.isMicroVargottama && (
                              <span className="tag tag-varg" style={{ marginLeft: 4 }}>{isHi ? '= D1' : '= D1'}</span>
                            )}
                            {p.d9Match && (
                              <span className="tag tag-karaka" style={{ marginLeft: 4 }}>{isHi ? '= D9' : '= D9'}</span>
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

          {/* Twin-Birth & Seconds Micro-Rectification Sensitivity Analyzer (-60s..+60s) */}
          <section className="panel">
            <div className="panel-header">
              <h3>
                {isHi
                  ? `${focusedHigher.meta.id} सेकंड-स्तर जन्म समय संवेदनशीलता (±60 सेकंड / जुड़वाँ कुंडली शोध)`
                  : `${focusedHigher.meta.id} Seconds Sensitivity & Twin-Birth Analyzer (±60s Around Birth)`}
              </h3>
              <span className="muted small-text">
                {isHi
                  ? 'प्रत्येक ±5s/±15s/±30s/±60s पर वर्ग लग्न एवं अंश परिवर्तन देखें'
                  : 'Inspect exact second thresholds where the micro-varga Lagna or Amsa transitions'}
              </span>
            </div>
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{isHi ? 'समय अंतर' : 'Time Offset'}</th>
                    <th>{isHi ? 'स्थानीय समय' : 'Local Time'}</th>
                    <th>{isHi ? 'D1 लग्न' : 'D1 Lagna'}</th>
                    <th>{focusedHigher.meta.id} {isHi ? 'लग्न राशि' : 'Lagna Sign'}</th>
                    <th>{focusedHigher.meta.id} {isHi ? 'लग्न अंश #' : 'Lagna Amsa #'}</th>
                    <th>{focusedHigher.meta.id} {isHi ? 'चंद्र अंश' : 'Moon Sign / Amsa'}</th>
                  </tr>
                </thead>
                <tbody>
                  {sensitivityRows.map((row) => (
                    <tr
                      key={row.deltaSeconds}
                      className={row.deltaSeconds === 0 ? 'sensitivity-zero-row' : undefined}
                    >
                      <td className="mono">
                        <strong>{row.label}</strong>
                      </td>
                      <td className="mono">{row.localTime}</td>
                      <td>{trSign(row.d1LagnaSignIndex, lang)}</td>
                      <td>
                        <strong>{trSign(row.vargaLagnaSignIndex, lang)}</strong>{' '}
                        {row.lagnaShiftedFromZero && (
                          <span className="tag tag-retro">{isHi ? 'बदला' : 'Shift'}</span>
                        )}
                      </td>
                      <td className="mono">
                        #{row.vargaLagnaAmsa} / {focusedHigher.meta.division}
                      </td>
                      <td>
                        {trSign(row.vargaMoonSignIndex, lang)}{' '}
                        <span className="mono muted">(#{row.vargaMoonAmsa})</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* All 8 Higher Micro & Nadi Charts Simultaneous Comparison Grid */}
          <section className="panel">
            <div className="panel-header">
              <h3>
                {isHi
                  ? 'सभी 8 उच्च सूक्ष्म एवं नाड़ी वर्ग कुंडलियाँ (D64, D72, D81, D108, D144, D150, D300, D360)'
                  : 'All 8 Higher Harmonic & Nadi Charts (D64, D72, D81, D108, D144, D150, D300, D360)'}
              </h3>
              <span className="muted">
                {isHi
                  ? 'विस्तृत तालिका व ±60s विश्लेषण देखने हेतु किसी भी कुंडली पर क्लिक करें'
                  : 'Click any higher divisional chart to inspect its Amsa breakdown and seconds sensitivity above'}
              </span>
            </div>
            <div className="varga-gallery">
              {HIGHER_VARGA_META.map((meta) => {
                const hc = higherCharts[meta.id];
                const isSelected = meta.id === selectedHigherId;
                return (
                  <div
                    key={meta.id}
                    className={`varga-thumb ${isSelected ? 'is-selected' : ''}`}
                    onClick={() => setSelectedHigherId(meta.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') setSelectedHigherId(meta.id);
                    }}
                  >
                    <VedicChartSvg
                      title={`${meta.id} · ${isHi ? meta.nameHi : meta.nameEn}`}
                      style={chartStyle}
                      lagnaSignIndex={hc.lagnaSignIndex}
                      compact
                      showDownload={false}
                      centerLabel={meta.id}
                      items={hc.placements.map((p) => ({
                        id: p.id,
                        label: trPlanetShort(p.id, lang),
                        signIndex: p.vargaSignIndex,
                        isLagna: p.id === 'Asc',
                        isRetrograde: p.isRetrograde,
                        dignity: p.dignity,
                      }))}
                    />
                  </div>
                );
              })}
            </div>
          </section>
        </>
      )}
    </div>
  );
};
