import React, { useEffect, useState } from 'react';
import { DIVISIONAL_META, NINE_GRAHAS } from '../astro/constants';
import type { ChartData, ChartStyle, DivisionalChartId } from '../astro/types';
import { useLanguage } from '../i18n/LanguageContext';
import { trPlanet, trPlanetShort, trSign, trTerm, trVarga } from '../i18n/translations';
import { VedicChartSvg } from './VedicChartSvg';

interface VargasViewProps {
  chart: ChartData;
  chartStyle: ChartStyle;
  requestedVarga?: { id?: string; nonce: number };
}

export const VargasView: React.FC<VargasViewProps> = ({ chart, chartStyle, requestedVarga }) => {
  const { lang, t } = useLanguage();
  const [selectedId, setSelectedId] = useState<DivisionalChartId>('D9');

  useEffect(() => {
    const id = requestedVarga?.id as DivisionalChartId | undefined;
    if (id && chart.divisionalCharts[id]) {
      setSelectedId(id);
    }
  }, [requestedVarga?.nonce, requestedVarga?.id, chart.divisionalCharts]);
  const selectedChart = chart.divisionalCharts[selectedId];
  const selectedMeta = trVarga(selectedChart.id, selectedChart.name, selectedChart.signification, lang);

  return (
    <div className="view-stack">
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
                  <th>{lang === 'hi' ? 'वर्ग राशि' : 'Varga Sign'}</th>
                  <th>{t.common.house}</th>
                  <th>{lang === 'hi' ? 'राशि स्वामी' : 'Sign Lord'}</th>
                  <th>{t.common.dignity}</th>
                </tr>
              </thead>
              <tbody>
                {selectedChart.placements.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <strong>{trPlanet(p.id, lang)}</strong>
                      {p.isRetrograde && p.id !== 'Rahu' && p.id !== 'Ketu' ? (lang === 'hi' ? ' (व)' : ' (R)') : ''}
                    </td>
                    <td>{trSign(p.signIndex, lang)}</td>
                    <td className="mono">{lang === 'hi' ? `भाव ${p.houseFromVargaLagna}` : `H${p.houseFromVargaLagna}`}</td>
                    <td>{trPlanet(p.signLord, lang)}</td>
                    <td>
                      <span className={`dignity-pill dig-${p.dignity.toLowerCase().replace(/\s+/g, '-')}`}>
                        {trTerm(p.dignity, lang)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="panel-subblock">
            <h4>{lang === 'hi' ? 'षोडशवर्ग विंशोपक बल (20 में से)' : 'Shodashavarga Vimshopaka Bala (out of 20)'}</h4>
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
          <h3>{lang === 'hi' ? 'सभी 20 वर्ग कुंडलियाँ (षोडशवर्ग + D1–D60)' : 'All 20 Divisional Charts (Shodashavarga + D1–D60)'}</h3>
          <span className="muted">{lang === 'hi' ? 'विस्तृत ग्रह तालिका देखने हेतु किसी भी कुंडली पर क्लिक करें' : 'Click any chart to inspect its planetary table above'}</span>
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
    </div>
  );
};
