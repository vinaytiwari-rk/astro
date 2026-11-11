import React, { useEffect, useMemo, useState } from 'react';
import {
  computeAvakahadaChakra,
  computeBhavaChalitPlacements,
  computeGhatakChakra,
} from '../astro/avakahadaChalit';
import { DIVISIONAL_META } from '../astro/constants';
import { formatDms, formatOffsetString } from '../astro/time';
import type { ChartData, ChartStyle, DivisionalChartId } from '../astro/types';
import { useLanguage } from '../i18n/LanguageContext';
import {
  trPlanet,
  trPlanetShort,
  trSign,
  trTerm,
  trVarga,
  type AppLanguage,
} from '../i18n/translations';
import { VedicChartSvg, type ChartBadgeItem } from './VedicChartSvg';

interface BasicsViewProps {
  chart: ChartData;
  chartStyle: ChartStyle;
  requestedSubTab?: { id?: string; nonce: number };
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
  requestedSubTab,
}) => {
  const { lang, t } = useLanguage();
  const isHi = lang === 'hi';
  const [rightVarga, setRightVarga] = useState<DivisionalChartId | 'CHALIT'>('CHALIT');
  const [showSpecialInChart, setShowSpecialInChart] = useState(false);
  const [showSavInChart, setShowSavInChart] = useState(false);
  const [subTab, setSubTab] = useState<'planets' | 'cusps' | 'avakahada' | 'chalit' | 'special'>('planets');

  useEffect(() => {
    const id = requestedSubTab?.id;
    if (
      id === 'planets' ||
      id === 'cusps' ||
      id === 'avakahada' ||
      id === 'chalit' ||
      id === 'special'
    ) {
      setSubTab(id);
      if (id === 'chalit') setRightVarga('CHALIT');
    }
  }, [requestedSubTab?.nonce, requestedSubTab?.id]);

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

  const rightChart = rightVarga === 'CHALIT' ? null : chart.divisionalCharts[rightVarga];
  const rightMeta = rightChart
    ? trVarga(rightChart.id, rightChart.name, rightChart.signification, lang)
    : {
        name: isHi ? 'भाव चलित (श्रीपति)' : 'Bhava Chalit (Sripati)',
        sig: isHi
          ? `${chalitData.shiftedBodies.length} ग्रह राशि से भिन्न चलित भाव में`
          : `${chalitData.shiftedBodies.length} planet(s) shift houses from D1 Rasi`,
      };

  const rightItems: ChartBadgeItem[] = useMemo(() => {
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
  }, [rightVarga, chalitData, rightChart, lang, t.common.house]);

  const allBodies = [chart.ascendant, ...chart.planets];

  return (
    <div className="view-stack">
      {/* Top Dual Charts + Chart Options */}
      <div className="charts-toolbar">
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
          <span className="label-muted">{t.basics.rightChart}</span>
          <select
            className="select-compact"
            value={rightVarga}
            onChange={(e) => setRightVarga(e.target.value as DivisionalChartId | 'CHALIT')}
          >
            <option value="CHALIT">
              {isHi ? 'CHALIT — भाव चलित (श्रीपति)' : 'CHALIT — Bhava Chalit (Sripati)'}
            </option>
            {DIVISIONAL_META.map((m) => {
              const vm = trVarga(m.id, m.name, m.signification, lang);
              return (
                <option key={m.id} value={m.id}>
                  {m.id} — {vm.name}
                </option>
              );
            })}
          </select>
        </div>
      </div>

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
          title={rightChart ? `${rightMeta.name} (${rightChart.id})` : rightMeta.name}
          subtitle={rightMeta.sig}
          style={chartStyle}
          lagnaSignIndex={rightChart ? rightChart.lagnaSignIndex : chalitData.ascSignIndex}
          items={rightItems}
          centerLabel={
            rightChart
              ? `${rightMeta.name} (${rightChart.id})`
              : (isHi ? 'भाव चलित' : 'CHALIT')
          }
        />
      </div>

      <div className="legend-strip">
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

      {/* Main Data Split: Planetary Table + Panchang/Astro Details */}
      <div className="basics-bottom-grid">
        <section className="panel">
          <div className="panel-header">
            <div className="subtab-bar">
              <button
                type="button"
                className={`subtab-btn ${subTab === 'planets' ? 'is-active' : ''}`}
                onClick={() => setSubTab('planets')}
              >
                {t.basics.grahaLongitudes}
              </button>
              <button
                type="button"
                className={`subtab-btn ${subTab === 'cusps' ? 'is-active' : ''}`}
                onClick={() => setSubTab('cusps')}
              >
                {t.basics.bhavaCusps} ({t.houseSystems[chart.settings.houseSystem] ?? chart.settings.houseSystem})
              </button>
              <button
                type="button"
                className={`subtab-btn ${subTab === 'avakahada' ? 'is-active' : ''}`}
                onClick={() => setSubTab('avakahada')}
              >
                {isHi ? 'अवकहड़ा व घातक चक्र' : 'Avakahada & Ghatak'}
              </button>
              <button
                type="button"
                className={`subtab-btn ${subTab === 'chalit' ? 'is-active' : ''}`}
                onClick={() => setSubTab('chalit')}
              >
                {isHi ? `भाव चलित (${chalitData.shiftedBodies.length})` : `Chalit Shifts (${chalitData.shiftedBodies.length})`}
              </button>
              <button
                type="button"
                className={`subtab-btn ${subTab === 'special' ? 'is-active' : ''}`}
                onClick={() => setSubTab('special')}
              >
                {t.basics.specialLagnas}
              </button>
            </div>
          </div>

          {subTab === 'planets' && (
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
          )}

          {subTab === 'cusps' && (
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{t.common.house}</th>
                    <th>{t.common.sign}</th>
                    <th>{lang === 'hi' ? 'भाव मध्य' : 'Bhava Madhya'}</th>
                    <th>{lang === 'hi' ? 'भाव संधि (आरंभ)' : 'Bhava Sandhi (Start)'}</th>
                  </tr>
                </thead>
                <tbody>
                  {chart.houses.map((h) => (
                    <tr key={h.house}>
                      <td className="mono">{lang === 'hi' ? `भाव ${h.house}` : `House ${h.house}`}</td>
                      <td>{trSign(h.signIndex, lang)}</td>
                      <td className="mono">{h.dms}</td>
                      <td className="mono">{formatDms(h.start % 30)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {subTab === 'avakahada' && (
            <div className="two-col-split-pad">
              <div>
                <h4 className="subpanel-heading">{isHi ? 'अवकहड़ा चक्र (Avakahada Chakra)' : 'Avakahada Chakra'}</h4>
                <div className="kv-list zero-pad">
                  <div className="kv-row"><span>{isHi ? 'पाया (Paya)' : 'Paya'}</span><strong>{isHi ? avakahada.payaHi : avakahada.payaEn}</strong></div>
                  <div className="kv-row"><span>{isHi ? 'जन्म राशि' : 'Janma Rashi'}</span><strong>{trSign(avakahada.moonSignIndex, lang)}</strong></div>
                  <div className="kv-row"><span>{isHi ? 'नक्षत्र / चरण' : 'Nakshatra / Pada'}</span><strong>{trTerm(chart.panchang.nakshatra.name, lang)} ({avakahada.pada})</strong></div>
                  <div className="kv-row"><span>{isHi ? 'नामाक्षर (मुख्य)' : 'Name Syllable'}</span><strong className="tag tag-karaka">{isHi ? avakahada.nameSyllableHi : avakahada.nameSyllableEn} ({isHi ? avakahada.allPadaSyllablesHi.join(', ') : avakahada.allPadaSyllablesEn.join(', ')})</strong></div>
                  <div className="kv-row"><span>{isHi ? 'वर्ण / वश्य' : 'Varna / Vashya'}</span><strong>{trTerm(avakahada.varna, lang)} / {trTerm(avakahada.vashya, lang)}</strong></div>
                  <div className="kv-row"><span>{isHi ? 'गण / योनि / नाड़ी' : 'Gana / Yoni / Nadi'}</span><strong>{trTerm(avakahada.gana, lang)} / {avakahada.yoni} / {trTerm(avakahada.nadi, lang)}</strong></div>
                  <div className="kv-row"><span>{isHi ? 'युंजा / तत्व' : 'Yunja / Tatva'}</span><strong>{isHi ? `${avakahada.yunjaHi} · ${avakahada.tatvaHi}` : `${avakahada.yunjaEn} · ${avakahada.tatvaEn}`}</strong></div>
                  <div className="kv-row"><span>{isHi ? 'जन्म दशा शेष' : 'Dasha Balance'}</span><strong>{isHi ? `${trPlanet(avakahada.birthDashaLord, lang)}: ${avakahada.remDashaHi}` : avakahada.dashaBalanceEn}</strong></div>
                </div>
              </div>
              <div>
                <h4 className="subpanel-heading">{isHi ? 'घातक चक्र (Ghatak / सावधानी कारक)' : 'Ghatak Chakra (Watchful Triggers)'}</h4>
                <div className="kv-list zero-pad">
                  <div className="kv-row"><span>{isHi ? 'घातक राशि' : 'Ghatak Rashi'}</span><strong>{trSign(ghatak.rashiIndex, lang)}</strong></div>
                  <div className="kv-row"><span>{isHi ? 'घातक वार' : 'Ghatak Day'}</span><strong>{trTerm(ghatak.varaEn, lang)}</strong></div>
                  <div className="kv-row"><span>{isHi ? 'घातक तिथि' : 'Ghatak Tithi'}</span><strong>{ghatak.tithiEn}</strong></div>
                  <div className="kv-row"><span>{isHi ? 'घातक नक्षत्र' : 'Ghatak Nakshatra'}</span><strong>{trTerm(ghatak.nakshatraEn, lang)}</strong></div>
                  <div className="kv-row"><span>{isHi ? 'घातक योग' : 'Ghatak Yoga'}</span><strong>{trTerm(ghatak.yogaEn, lang)}</strong></div>
                  <div className="kv-row"><span>{isHi ? 'घातक करण' : 'Ghatak Karana'}</span><strong>{trTerm(ghatak.karanaEn, lang)}</strong></div>
                  <div className="kv-row"><span>{isHi ? 'घातक लग्न' : 'Ghatak Lagna'}</span><strong>{trSign(ghatak.lagnaIndex, lang)}</strong></div>
                  <div className="kv-row"><span>{isHi ? 'घातक प्रहर / मास' : 'Prahar / Month'}</span><strong>{ghatak.praharEn} · {ghatak.monthEn}</strong></div>
                </div>
              </div>
            </div>
          )}

          {subTab === 'chalit' && (
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{t.common.body}</th>
                    <th>{isHi ? 'राशि भाव (D1)' : 'Rasi House (D1)'}</th>
                    <th>{isHi ? 'श्रीपति चलित भाव' : 'Bhava Chalit House'}</th>
                    <th>{isHi ? 'परिवर्तन' : 'Shift'}</th>
                    <th>{t.common.degree}</th>
                  </tr>
                </thead>
                <tbody>
                  {chalitData.placements.map((pl) => (
                    <tr key={pl.id}>
                      <td><strong>{trPlanet(pl.id, lang)}</strong></td>
                      <td className="mono">{t.common.house}{pl.rasiHouse} ({trSign(pl.rasiSignIndex, lang)})</td>
                      <td className="mono"><strong>{t.common.house}{pl.chalitHouse}</strong></td>
                      <td>
                        {pl.shifted ? (
                          <span className="tag tag-retro">
                            {isHi ? `भाव बदला (${pl.rasiHouse} → ${pl.chalitHouse})` : `Shifted (${pl.rasiHouse} → ${pl.chalitHouse})`}
                          </span>
                        ) : (
                          <span className="muted">{isHi ? 'समान' : 'Same'}</span>
                        )}
                      </td>
                      <td className="mono">{pl.dms}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {subTab === 'special' && (
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{t.common.body}</th>
                    <th>{t.common.sign}</th>
                    <th>{t.common.degree}</th>
                    <th>{t.common.nakshatra}</th>
                    <th>{t.common.house}</th>
                  </tr>
                </thead>
                <tbody>
                  {chart.specialPoints.map((sp) => (
                    <tr key={sp.id}>
                      <td>
                        <strong>{trPlanetShort(sp.shortLabel, lang)}</strong> — {sp.label}
                      </td>
                      <td>{trSign(sp.signIndex, lang)}</td>
                      <td className="mono">{sp.dms}</td>
                      <td>{trTerm(sp.nakshatraName, lang)} {lang === 'hi' ? 'च' : 'P'}{sp.pada}</td>
                      <td className="mono">{sp.houseNumber}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="panel">
          <div className="panel-header">
            <h3>{t.basics.panchangHeading}</h3>
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
              <span>{t.basics.moonriseMoonset}</span>
              <strong className="mono">
                {chart.panchang.moonriseLocal} / {chart.panchang.moonsetLocal}
              </strong>
            </div>
            <div className="kv-row">
              <span>{t.basics.dayDuration}</span>
              <strong className="mono">{chart.panchang.dayDurationStr}</strong>
            </div>
            <div className="kv-divider" />
            <div className="kv-row">
              <span>{t.common.ayanamsa}</span>
              <strong className="mono">{chart.ayanamsaDms}</strong>
            </div>
            <div className="kv-row">
              <span>{t.basics.effectiveTz}</span>
              <strong className="mono">UTC {formatOffsetString(chart.offsetMinutesUsed)}</strong>
            </div>
            <div className="kv-row">
              <span>{t.basics.lmst}</span>
              <strong className="mono">
                {Math.floor(chart.lmstHours)}h {Math.floor((chart.lmstHours % 1) * 60)}m
              </strong>
            </div>
            <div className="kv-row">
              <span>{t.basics.julianDay}</span>
              <strong className="mono">{chart.julianDayUT.toFixed(5)}</strong>
            </div>
            <div className="kv-row">
              <span>{t.basics.ganaYoniNadi}</span>
              <strong>
                {trTerm(chart.panchang.nakshatra.gana, lang)} · {chart.panchang.nakshatra.yoni} · {trTerm(chart.panchang.nakshatra.nadi, lang)}
              </strong>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
