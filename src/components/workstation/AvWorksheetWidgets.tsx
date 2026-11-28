import React, { useMemo, useState } from 'react';
import { computeAvakahadaChakra, computeGhatakChakra } from '../../astro/avakahadaChalit';
import { computeBhavabalaReport } from '../../astro/bhavabalaEngine';
import { computeAvasthasAndUpagrahas } from '../../astro/avasthasUpagrahas';
import { computeComprehensiveSensitivePoints } from '../../astro/specialSensitivities';
import { DIVISIONAL_META, NINE_GRAHAS, SEVEN_PLANETS, SIGNS } from '../../astro/constants';
import { expandPranaDasha, expandSookshmaDasha, findActiveDashaPath } from '../../astro/dasha';
import { computeJaimini } from '../../astro/jaimini';
import { computeKpReport } from '../../astro/kp';
import { computeDeepGochar } from '../../astro/predictions/gocharDeep';
import { computeLifeSnapshotDossierReport } from '../../astro/predictions/lifeSnapshotDossierEngine';
import { PARASHARA_LIGHT_YOGAS_CORPUS } from '../../astro/predictions/parasharasLightYogasKb';
import { getSadeSatiCurrentStatus } from '../../astro/sadeSatiTransits';
import { computeShadPhalaHouses } from '../../astro/shadPhalaEngine';
import { formatDateDmy, formatLocalDateTimeFromUtc } from '../../astro/time';
import type { ChartData, ChartStyle, DashaPeriod, DivisionalChartId, NineGrahaId, SevenPlanetId } from '../../astro/types';
import { computeAllVimsopakaBalas } from '../../astro/vargas';
import { computeVarshaphala } from '../../astro/varshaphala';
import { computeTimeOfTransits, computeVarshaphala12MonthlyCharts } from '../../astro/workstationUtils';
import { trPlanet, trPlanetShort, trSign, trSignShort, type AppLanguage } from '../../i18n/translations';
import { VedicChartSvg } from '../VedicChartSvg';
import { AvRasiPane, AvVargaPane } from './AvChartPaneWidget';
import type { ChartDisplayOptions, CustomWidgetId } from './workstationTypes';

function fmtMsDate(ms: number, offsetMinutes: number): string {
  return formatDateDmy(formatLocalDateTimeFromUtc(ms, offsetMinutes).slice(0, 10));
}

function fmtMsDateTime(ms: number, offsetMinutes: number): string {
  const s = formatLocalDateTimeFromUtc(ms, offsetMinutes);
  return `${formatDateDmy(s.slice(0, 10))} ${s.slice(11, 16)}`;
}

/* ============================================================
 * 1. GRAHA SPHUTA (PLANETARY LONGITUDES) + HOUSE/PANCHANGA TABLE
 * ============================================================ */
export const PlanetsTableWidget: React.FC<{ chart: ChartData; lang: AppLanguage }> = ({ chart, lang }) => {
  const isHi = lang === 'hi';
  const [subTab, setSubTab] = useState<'planets' | 'cusps' | 'panchanga'>('planets');
  const avakahada = useMemo(() => computeAvakahadaChakra(chart), [chart]);
  const ghatak = useMemo(() => {
    const moon = chart.planets.find((p) => p.id === 'Moon');
    return computeGhatakChakra(moon?.signIndex ?? 0);
  }, [chart]);

  return (
    <div className="av-pane-card">
      <div className="av-pane-header">
        <div className="av-pane-title">
          {isHi ? 'ग्रह स्पष्ट, भाव व पंचांग विवरण' : 'Planetary Longitudes, Cusps & Panchanga'}
        </div>
        <div className="av-subtabs-xs">
          <button type="button" className={subTab === 'planets' ? 'is-on' : ''} onClick={() => setSubTab('planets')}>
            {isHi ? 'ग्रह स्पष्ट' : 'Planets'}
          </button>
          <button type="button" className={subTab === 'cusps' ? 'is-on' : ''} onClick={() => setSubTab('cusps')}>
            {isHi ? 'भाव संधि' : 'Cusps'}
          </button>
          <button type="button" className={subTab === 'panchanga' ? 'is-on' : ''} onClick={() => setSubTab('panchanga')}>
            {isHi ? 'पंचांग/अवकहड़ा' : 'Panchanga'}
          </button>
        </div>
      </div>

      <div className="av-pane-scroll">
        {subTab === 'planets' && (
          <table className="av-table-dense">
            <thead>
              <tr>
                <th>{isHi ? 'ग्रह' : 'Body'}</th>
                <th>{isHi ? 'राशि' : 'Sign'}</th>
                <th>{isHi ? 'अंश' : 'Deg'}</th>
                <th>{isHi ? 'नक्षत्र (पद)' : 'Nakshatra'}</th>
                <th>RL/NL/SL</th>
                <th>{isHi ? 'भाव' : 'Hs'}</th>
                <th>D9</th>
                <th>{isHi ? 'स्थिति' : 'Dignity'}</th>
                <th>Karaka</th>
              </tr>
            </thead>
            <tbody>
              {[chart.ascendant, ...chart.planets].map((p) => {
                const d9 = chart.divisionalCharts.D9.placements.find((x) => x.id === p.id);
                return (
                  <tr key={p.id}>
                    <td>
                      <strong>{trPlanetShort(p.id, lang)}</strong>
                      {p.isRetrograde ? ' (R)' : ''}
                      {p.isCombust ? '*' : ''}
                      {p.isVargottama ? ' □' : ''}
                    </td>
                    <td>{trSignShort(p.signIndex, lang)}</td>
                    <td className="mono">{p.dms}</td>
                    <td>
                      {p.nakshatraName}-{p.pada}
                    </td>
                    <td className="mono">
                      {trPlanetShort(p.signLord, lang)}/{trPlanetShort(p.nakshatraLord, lang)}/
                      {trPlanetShort(p.subLord, lang)}
                    </td>
                    <td className="mono">{p.houseNumber}</td>
                    <td>{d9 ? trSignShort(d9.signIndex, lang) : '-'}</td>
                    <td>{p.dignity !== '-' ? p.dignity : '-'}</td>
                    <td className="mono">{p.charaKaraka ?? '-'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {subTab === 'cusps' && (
          <table className="av-table-dense">
            <thead>
              <tr>
                <th>{isHi ? 'भाव' : 'House'}</th>
                <th>{isHi ? 'राशि' : 'Sign'}</th>
                <th>{isHi ? 'भाव मध्य' : 'Bhava Madhya'}</th>
                <th>{isHi ? 'भाव संधि आरंभ' : 'Start Sandhi'}</th>
              </tr>
            </thead>
            <tbody>
              {chart.houses.map((h) => (
                <tr key={h.house}>
                  <td className="mono">
                    <strong>H{h.house}</strong>
                  </td>
                  <td>{trSign(h.signIndex, lang)}</td>
                  <td className="mono">{h.dms}</td>
                  <td className="mono">{h.start.toFixed(2)}°</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {subTab === 'panchanga' && (
          <div className="av-kv-grid">
            <div className="av-kv-row"><span>Vara:</span><strong>{chart.panchang.vara.sanskrit}</strong></div>
            <div className="av-kv-row"><span>Tithi:</span><strong>{chart.panchang.tithi.paksha} {chart.panchang.tithi.name}</strong></div>
            <div className="av-kv-row"><span>Nakshatra:</span><strong>{chart.panchang.nakshatra.name} (Pada {chart.panchang.nakshatra.pada})</strong></div>
            <div className="av-kv-row"><span>Nitya Yoga:</span><strong>{chart.panchang.yoga.name}</strong></div>
            <div className="av-kv-row"><span>Karana:</span><strong>{chart.panchang.karana.name}</strong></div>
            <div className="av-kv-row"><span>Sunrise / Set:</span><strong>{chart.panchang.sunriseLocal} / {chart.panchang.sunsetLocal}</strong></div>
            <div className="av-kv-row"><span>Varna / Vashya:</span><strong>{avakahada.varna} / {avakahada.vashya}</strong></div>
            <div className="av-kv-row"><span>Yoni / Gana / Nadi:</span><strong>{avakahada.yoni} / {avakahada.gana} / {avakahada.nadi}</strong></div>
            <div className="av-kv-row"><span>Paya / Name Letter:</span><strong>{avakahada.payaEn} / {avakahada.nameSyllableEn}</strong></div>
            <div className="av-kv-row"><span>Ghatak (Rasi/Day/Tithi):</span><strong>{SIGNS[ghatak.rashiIndex]?.name ?? ''} / {ghatak.varaEn} / {ghatak.tithiEn}</strong></div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ============================================================
 * 2. PANCHANGA + AVAKAHADA + SENSITIVE POINTS STANDALONE WIDGET
 * ============================================================ */
export const PanchangaAvakahadaWidget: React.FC<{ chart: ChartData; lang: AppLanguage }> = ({ chart, lang }) => {
  const avakahada = useMemo(() => computeAvakahadaChakra(chart), [chart]);
  const avasthas = useMemo(() => computeAvasthasAndUpagrahas(chart), [chart]);
  const sens = useMemo(() => computeComprehensiveSensitivePoints(chart), [chart]);

  return (
    <div className="av-pane-card">
      <div className="av-pane-header">
        <div className="av-pane-title">
          {lang === 'hi' ? 'अवकहड़ा, उपग्रह व सूक्ष्म बिंदु' : 'Avakahada, Upagrahas & Sensitive Points'}
        </div>
      </div>
      <div className="av-pane-scroll">
        <div className="av-kv-grid">
          <div className="av-kv-row"><span>Janma Rashi / Star:</span><strong>{trSign(chart.planets.find((p) => p.id === 'Moon')?.signIndex ?? 0, lang)} / {chart.panchang.nakshatra.name}</strong></div>
          <div className="av-kv-row"><span>Gana / Yoni / Nadi:</span><strong>{avakahada.gana} / {avakahada.yoni} / {avakahada.nadi}</strong></div>
          <div className="av-kv-row"><span>Tatva / Yunja / Paya:</span><strong>{avakahada.tatvaEn} / {avakahada.yunjaEn} / {avakahada.payaEn}</strong></div>
          <div className="av-kv-row"><span>Yogi / Avayogi Planet:</span><strong>{sens.yogiPlanetEn} / {sens.avaYogiPlanetEn}</strong></div>
          <div className="av-kv-row"><span>22nd Drekkana / 64th Nav:</span><strong>{sens.twentySecondDrekkanaLordEn} ({sens.twentySecondDrekkanaNature}) · {sens.sixtyFourthNavamshaLordEn}</strong></div>
          <div className="av-kv-row"><span>Special Points:</span><strong>{chart.specialPoints.slice(0, 5).map((sp) => `${sp.shortLabel}: ${trSignShort(sp.signIndex, lang)}`).join(' · ')}</strong></div>
          <div className="av-kv-row"><span>Mandi / Gulika:</span><strong>{avasthas.upagrahas.slice(0, 4).map((u) => `${u.name}: ${u.signName}`).join(' · ')}</strong></div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
 * 3. 5-LEVEL INTERACTIVE VIMSHOTTARI DASHA TREE (MD..PRANA)
 * ============================================================ */
export const Vimshottari5TierWidget: React.FC<{ chart: ChartData; lang: AppLanguage }> = ({ chart, lang }) => {
  const isHi = lang === 'hi';
  const nowMs = Date.now();
  const initialPath = useMemo(() => findActiveDashaPath(chart.vimshottari, nowMs), [chart.vimshottari]);

  const [mdIdx, setMdIdx] = useState<number>(() => {
    const idx = chart.vimshottari.findIndex((p) => nowMs >= p.startMs && nowMs < p.endMs);
    return idx >= 0 ? idx : 0;
  });
  const [adIdx, setAdIdx] = useState<number>(() => {
    if (initialPath.length < 2) return 0;
    const md = chart.vimshottari.find((p) => p.lord === initialPath[0].lord);
    const idx = md?.children?.findIndex((a) => a.lord === initialPath[1].lord) ?? 0;
    return idx >= 0 ? idx : 0;
  });
  const [pdIdx, setPdIdx] = useState<number>(0);
  const [sdIdx, setSdIdx] = useState<number>(0);

  const md = chart.vimshottari[mdIdx] ?? chart.vimshottari[0];
  const ads = md?.children ?? [];
  const ad = ads[adIdx] ?? ads[0];
  const pds = ad?.children ?? [];
  const pd = pds[pdIdx] ?? pds[0];
  const sds = useMemo(() => (pd ? expandSookshmaDasha(pd) : []), [pd]);
  const sd = sds[sdIdx] ?? sds[0];
  const pranas = useMemo(() => (sd ? expandPranaDasha(sd) : []), [sd]);

  const jumpNow = () => {
    const t = Date.now();
    const mI = chart.vimshottari.findIndex((m) => t >= m.startMs && t < m.endMs);
    if (mI < 0) return;
    setMdIdx(mI);
    const aList = chart.vimshottari[mI].children ?? [];
    const aI = aList.findIndex((a) => t >= a.startMs && t < a.endMs);
    if (aI < 0) return;
    setAdIdx(aI);
    const pList = aList[aI].children ?? [];
    const pI = pList.findIndex((p) => t >= p.startMs && t < p.endMs);
    if (pI < 0) return;
    setPdIdx(pI);
    const sList = expandSookshmaDasha(pList[pI]);
    const sI = sList.findIndex((s) => t >= s.startMs && t < s.endMs);
    setSdIdx(sI >= 0 ? sI : 0);
  };

  const renderCol = (
    title: string,
    items: DashaPeriod[],
    selectedIdx: number,
    onSelect: (idx: number) => void,
    withTime = false
  ) => (
    <div className="av-dasha-col">
      <div className="av-dasha-col-hd">{title}</div>
      <div className="av-dasha-list">
        {items.map((item, i) => {
          const isCurrent = nowMs >= item.startMs && nowMs < item.endMs;
          const isSel = i === selectedIdx;
          return (
            <button
              key={`${item.lord}-${i}`}
              type="button"
              className={`av-dasha-item ${isSel ? 'is-sel' : ''} ${isCurrent ? 'is-now' : ''}`}
              onClick={() => onSelect(i)}
            >
              <span className="av-dasha-lord">{trPlanetShort(item.lord, lang)}</span>
              <span className="av-dasha-dt">
                {withTime
                  ? fmtMsDateTime(item.endMs, chart.offsetMinutesUsed)
                  : fmtMsDate(item.endMs, chart.offsetMinutesUsed)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="av-pane-card">
      <div className="av-pane-header">
        <div className="av-pane-title">
          {isHi ? 'विंशोत्तरी दशा (5-स्तरीय: महा → अंतर् → प्रत्यंतर → सूक्ष्म → प्राण)' : 'Vimshottari Dasha (5 Levels: MD → AD → PD → Sookshma → Prana)'}
        </div>
        <button type="button" className="av-pill-xs is-on" onClick={jumpNow}>
          {isHi ? 'वर्तमान समय पर जाएं' : 'Jump Today'}
        </button>
      </div>

      <div className="av-dasha-5grid">
        {renderCol('1. MD', chart.vimshottari.slice(0, 9), mdIdx, (i) => {
          setMdIdx(i);
          setAdIdx(0);
          setPdIdx(0);
          setSdIdx(0);
        })}
        {renderCol('2. AD', ads, adIdx, (i) => {
          setAdIdx(i);
          setPdIdx(0);
          setSdIdx(0);
        })}
        {renderCol('3. PD', pds, pdIdx, (i) => {
          setPdIdx(i);
          setSdIdx(0);
        })}
        {renderCol('4. SD', sds, sdIdx, (i) => setSdIdx(i))}
        {renderCol('5. Prana', pranas, -1, () => {}, true)}
      </div>
    </div>
  );
};

/* ============================================================
 * 4. SHADBALA + BHAVABALA + ASHTAKAVARGA + VIMSOPAKA WIDGETS
 * ============================================================ */
export const ShadbalaWidget: React.FC<{ chart: ChartData; lang: AppLanguage }> = ({ chart, lang }) => (
  <div className="av-pane-card">
    <div className="av-pane-header">
      <div className="av-pane-title">{lang === 'hi' ? 'षड्बल (6-स्तरीय ग्रह बल)' : 'Shadbala (Six-Fold Strength)'}</div>
      <span className="av-pane-sub">Virupas / Rupas</span>
    </div>
    <div className="av-pane-scroll">
      <table className="av-table-dense">
        <thead>
          <tr>
            <th>Graha</th>
            <th>Sthana</th>
            <th>Dig</th>
            <th>Kala</th>
            <th>Cheshta</th>
            <th>Nais</th>
            <th>Drik</th>
            <th>Rupas</th>
            <th>Ratio</th>
            <th>Ishta/Kashta</th>
          </tr>
        </thead>
        <tbody>
          {chart.shadbala.map((r) => (
            <tr key={r.planet}>
              <td><strong>{trPlanetShort(r.planet, lang)}</strong></td>
              <td className="mono">{r.sthanaBala.toFixed(1)}</td>
              <td className="mono">{r.digBala.toFixed(1)}</td>
              <td className="mono">{r.kalaBala.toFixed(1)}</td>
              <td className="mono">{r.cheshtaBala.toFixed(1)}</td>
              <td className="mono">{r.naisargikaBala.toFixed(1)}</td>
              <td className="mono">{r.drikBala.toFixed(1)}</td>
              <td className="mono"><strong>{r.totalRupas.toFixed(2)}</strong></td>
              <td className={`mono ${r.isStrong ? 'av-good' : 'av-warn'}`}>{r.ratio.toFixed(2)}x</td>
              <td className="mono">{r.ishtaPhala.toFixed(0)}/{r.kashtaPhala.toFixed(0)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export const BhavabalaWidget: React.FC<{ chart: ChartData; lang: AppLanguage }> = ({ chart, lang }) => {
  const report = useMemo(() => computeBhavabalaReport(chart), [chart]);
  return (
    <div className="av-pane-card">
      <div className="av-pane-header">
        <div className="av-pane-title">{lang === 'hi' ? 'भाव बल (12 भाव)' : 'Bhava Bala (12 Houses)'}</div>
        <span className="av-pane-sub">Strongest: H{report.strongestHouse} · Weakest: H{report.weakestHouse}</span>
      </div>
      <div className="av-pane-scroll">
        <table className="av-table-dense">
          <thead>
            <tr>
              <th>Hs</th>
              <th>Sign</th>
              <th>Lord</th>
              <th>Adhipati</th>
              <th>Dig</th>
              <th>Drishti</th>
              <th>Rupas</th>
              <th>Rank</th>
            </tr>
          </thead>
          <tbody>
            {report.houses.map((h) => (
              <tr key={h.house}>
                <td className="mono"><strong>H{h.house}</strong></td>
                <td>{trSignShort(h.signIndex, lang)}</td>
                <td>{trPlanetShort(h.lord, lang)}</td>
                <td className="mono">{h.bhavadhipatiBalaVirupas.toFixed(0)}</td>
                <td className="mono">{h.bhavaDigbalaVirupas.toFixed(0)}</td>
                <td className="mono">{h.bhavaDrishtiBalaVirupas.toFixed(0)}</td>
                <td className="mono"><strong>{h.totalRupas.toFixed(2)}</strong></td>
                <td className="mono">#{h.rank}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const AshtakavargaSavWidget: React.FC<{ chart: ChartData; chartStyle: ChartStyle; lang: AppLanguage }> = ({
  chart,
  chartStyle,
  lang,
}) => {
  const av = chart.ashtakavarga;
  const [selectedPlanet, setSelectedPlanet] = useState<'SAV' | SevenPlanetId>('SAV');
  const activeVals = selectedPlanet === 'SAV' ? av.sarva : av.bhinna[selectedPlanet];

  return (
    <div className="av-pane-card">
      <div className="av-pane-header">
        <div className="av-pane-title">
          {lang === 'hi' ? `सर्वाष्टकवर्ग (SAV=${av.totalBindus}) व शोध्य पिंड` : `Ashtakavarga Matrix (SAV=${av.totalBindus}) & Shodhya Pinda`}
        </div>
        <select
          aria-label="Ashtakavarga Planet"
          className="av-select-xs"
          value={selectedPlanet}
          onChange={(e) => setSelectedPlanet(e.target.value as 'SAV' | SevenPlanetId)}
        >
          <option value="SAV">SAV (All 7)</option>
          {SEVEN_PLANETS.map((p) => (
            <option key={p} value={p}>{p} BAV</option>
          ))}
        </select>
      </div>
      <div className="av-pane-scroll">
        <div className="av-split-mini">
          <div style={{ minWidth: '170px', maxWidth: '210px' }}>
            <VedicChartSvg
              title={selectedPlanet}
              style={chartStyle}
              lagnaSignIndex={chart.ascendant.signIndex}
              items={[]}
              savBindus={activeVals}
              centerLabel={selectedPlanet}
              compact
              showDownload={false}
            />
          </div>
          <div style={{ flex: 1, overflowX: 'auto' }}>
            <table className="av-table-dense">
              <thead>
                <tr>
                  <th>Sign</th>
                  <th>SAV</th>
                  {SEVEN_PLANETS.map((p) => <th key={p}>{p.slice(0, 2)}</th>)}
                </tr>
              </thead>
              <tbody>
                {SIGNS.map((s, idx) => (
                  <tr key={s.name}>
                    <td><strong>{s.short}</strong></td>
                    <td className="mono"><strong>{av.sarva[idx]}</strong></td>
                    {SEVEN_PLANETS.map((p) => (
                      <td key={p} className="mono">{av.bhinna[p][idx]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {av.shodhyaPinda && (
          <table className="av-table-dense" style={{ marginTop: '6px' }}>
            <thead>
              <tr>
                <th>Shodhya Pinda</th>
                {SEVEN_PLANETS.map((p) => <th key={p}>{trPlanetShort(p, lang)}</th>)}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Rasi Pinda</td>
                {SEVEN_PLANETS.map((p) => <td key={p} className="mono">{av.shodhyaPinda![p].rasiPinda}</td>)}
              </tr>
              <tr>
                <td>Graha Pinda</td>
                {SEVEN_PLANETS.map((p) => <td key={p} className="mono">{av.shodhyaPinda![p].grahaPinda}</td>)}
              </tr>
              <tr>
                <td><strong>Total Shodhya</strong></td>
                {SEVEN_PLANETS.map((p) => <td key={p} className="mono"><strong>{av.shodhyaPinda![p].shodhyaPinda}</strong></td>)}
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export const VimsopakaWidget: React.FC<{ chart: ChartData; lang: AppLanguage }> = ({ chart, lang }) => {
  const rows = useMemo(() => computeAllVimsopakaBalas(chart.divisionalCharts, chart.maitriMatrix), [chart]);
  return (
    <div className="av-pane-card">
      <div className="av-pane-header">
        <div className="av-pane-title">{lang === 'hi' ? 'विंशोपक बल (4 वर्गीकरण)' : 'Vimsopaka Bala (All 4 Varga Hierarchies / 20)'}</div>
      </div>
      <div className="av-pane-scroll">
        <table className="av-table-dense">
          <thead>
            <tr>
              <th>Planet</th>
              <th>Shadvarga (6)</th>
              <th>Saptavarga (7)</th>
              <th>Dashavarga (10)</th>
              <th>Shodashvarga (16)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.planet}>
                <td><strong>{trPlanet(r.planet, lang)}</strong></td>
                <td className="mono">{r.shadvarga.toFixed(2)}</td>
                <td className="mono">{r.saptavarga.toFixed(2)}</td>
                <td className="mono">{r.dashavarga.toFixed(2)}</td>
                <td className="mono"><strong>{r.shodashavarga.toFixed(2)}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const ShadPhalaWidget: React.FC<{ chart: ChartData; lang: AppLanguage }> = ({ chart, lang }) => {
  const isHi = lang === 'hi';
  const rows = useMemo(() => computeShadPhalaHouses(chart), [chart]);
  return (
    <div className="av-pane-card">
      <div className="av-pane-header">
        <div className="av-pane-title">{isHi ? 'षड्फल (12 भाव शुभ-अशुभ बल विश्लेषण)' : 'Shad Phala (12-House Strength & Effects)'}</div>
      </div>
      <div className="av-pane-scroll">
        <table className="av-table-dense">
          <thead>
            <tr>
              <th>Hs</th>
              <th>Domain</th>
              <th>Lord</th>
              <th>SAV</th>
              <th>Score</th>
              <th>Reading</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.house}>
                <td className="mono"><strong>H{r.house}</strong></td>
                <td><strong>{isHi ? r.domainHi : r.domainEn}</strong></td>
                <td>{trPlanetShort(r.lord, lang)}</td>
                <td className="mono">{r.savBindus}</td>
                <td className={`mono ${r.shadPhalaScore >= 15 ? 'av-good' : r.shadPhalaScore <= -12 ? 'av-warn' : ''}`}>
                  <strong>{r.shadPhalaScore > 0 ? `+${r.shadPhalaScore}` : r.shadPhalaScore}</strong>
                </td>
                <td>{isHi ? r.readingHi : r.readingEn}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ============================================================
 * 5. LIVE GOCHAR + TIME OF TRANSITS + VARSHAPHALA (12 MONTHS)
 * ============================================================ */
export const GocharLiveWidget: React.FC<{ chart: ChartData; lang: AppLanguage }> = ({ chart, lang }) => {
  const [targetDate, setTargetDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [tab, setTab] = useState<'live' | 'upcoming'>('live');
  const [transitFilterPlanet, setTransitFilterPlanet] = useState<NineGrahaId | 'ALL'>('ALL');

  const stepDays = (days: number) => {
    const d = new Date(`${targetDate}T12:00:00Z`);
    d.setUTCDate(d.getUTCDate() + days);
    setTargetDate(d.toISOString().slice(0, 10));
  };

  const report = useMemo(() => computeDeepGochar(chart, targetDate), [chart, targetDate]);
  const sade = useMemo(() => {
    const ms = Date.parse(`${targetDate}T12:00:00Z`);
    return getSadeSatiCurrentStatus(chart, Number.isNaN(ms) ? Date.now() : ms);
  }, [chart, targetDate]);

  const upcomingEvents = useMemo(
    () =>
      tab === 'upcoming'
        ? computeTimeOfTransits({
            natalChart: chart,
            startDateIso: targetDate,
            horizonDays: 365,
            planetFilter: transitFilterPlanet,
          })
        : [],
    [tab, chart, targetDate, transitFilterPlanet]
  );

  return (
    <div className="av-pane-card">
      <div className="av-pane-header">
        <div className="av-pane-title">{lang === 'hi' ? 'गोचर, कक्ष्या व आगामी ग्रह परिवर्तन' : 'Live Transits (Gochar) & Time of Transits'}</div>
        <div className="av-pane-actions">
          <div className="av-subtabs-xs">
            <button type="button" className={tab === 'live' ? 'is-on' : ''} onClick={() => setTab('live')}>
              Live Gochar
            </button>
            <button type="button" className={tab === 'upcoming' ? 'is-on' : ''} onClick={() => setTab('upcoming')}>
              Time of Transits (1Y)
            </button>
          </div>
          <button type="button" className="av-step-btn" onClick={() => stepDays(-30)}>-1M</button>
          <button type="button" className="av-step-btn" onClick={() => stepDays(-1)}>-1D</button>
          <input
            type="date"
            aria-label="Transit Target Date"
            className="av-input-xs"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
          />
          <button type="button" className="av-step-btn" onClick={() => stepDays(1)}>+1D</button>
          <button type="button" className="av-step-btn" onClick={() => stepDays(30)}>+1M</button>
        </div>
      </div>

      <div className="av-pane-scroll">
        {tab === 'live' ? (
          <>
            <div className="av-mini-banner">
              <strong>Sade Sati / Saturn:</strong> {lang === 'hi' ? sade.statusSummaryHi : sade.statusSummaryEn}
            </div>
            <table className="av-table-dense">
              <thead>
                <tr>
                  <th>Planet</th>
                  <th>Sign</th>
                  <th>Hs(M)</th>
                  <th>BAV/SAV</th>
                  <th>Kakshya</th>
                  <th>Vedha</th>
                  <th>Verdict</th>
                </tr>
              </thead>
              <tbody>
                {report.items.map((it) => (
                  <tr key={it.planet}>
                    <td><strong>{trPlanetShort(it.planet, lang)}</strong>{it.isRetrograde ? ' (R)' : ''}</td>
                    <td>{it.transitSign} {it.degreeInSign.toFixed(1)}°</td>
                    <td className="mono">{it.houseFromMoon}</td>
                    <td className="mono">{it.bavBindus}/{it.savBindus}</td>
                    <td className="mono">{it.kakshyaLord} ({it.kakshyaHasBindu ? '1✓' : '0'})</td>
                    <td>{it.hasVedha ? it.vedhaPlanet : 'None'}</td>
                    <td>{it.verdict}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <>
            <div className="av-filter-bar" style={{ padding: '4px 0 6px' }}>
              <select
                aria-label="Filter Transit Planet"
                className="av-select-xs"
                value={transitFilterPlanet}
                onChange={(e) => setTransitFilterPlanet(e.target.value as NineGrahaId | 'ALL')}
              >
                <option value="ALL">All Major Planets</option>
                {NINE_GRAHAS.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
              <span className="av-pane-sub">Click any transit row to jump Live Gochar to that date</span>
            </div>
            <table className="av-table-dense">
              <thead><tr><th>Date</th><th>Type</th><th>Graha</th><th>Event</th></tr></thead>
              <tbody>
                {upcomingEvents.map((ev, i) => (
                  <tr
                    key={`${ev.dateIso}-${i}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      setTargetDate(ev.dateIso);
                      setTab('live');
                    }}
                  >
                    <td className="mono"><strong>{ev.dateDmy}</strong></td>
                    <td>{ev.eventType}</td>
                    <td><strong>{trPlanetShort(ev.transitPlanet, lang)}</strong></td>
                    <td>{ev.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

export const VarshaphalaSummaryWidget: React.FC<{ chart: ChartData; chartStyle: ChartStyle; lang: AppLanguage }> = ({
  chart,
  chartStyle,
  lang,
}) => {
  const birthYr = parseInt(chart.input.date.slice(0, 4), 10) || 2000;
  const [yr, setYr] = useState<number>(Math.max(birthYr, new Date().getFullYear()));
  const [tab, setTab] = useState<'annual' | 'monthly12'>('annual');
  const vp = useMemo(() => computeVarshaphala(chart, yr), [chart, yr]);
  const monthly12 = useMemo(
    () => (tab === 'monthly12' ? computeVarshaphala12MonthlyCharts(chart, yr) : []),
    [tab, chart, yr]
  );

  return (
    <div className="av-pane-card">
      <div className="av-pane-header">
        <div className="av-pane-title">{lang === 'hi' ? 'वार्षिक व मासिक वर्षफल' : 'Varshaphala (Annual & 12 Months)'}</div>
        <div className="av-pane-actions">
          <div className="av-subtabs-xs">
            <button type="button" className={tab === 'annual' ? 'is-on' : ''} onClick={() => setTab('annual')}>
              Annual & Mudda
            </button>
            <button type="button" className={tab === 'monthly12' ? 'is-on' : ''} onClick={() => setTab('monthly12')}>
              12 Monthly Charts
            </button>
          </div>
          <button type="button" className="av-step-btn" onClick={() => setYr((y) => Math.max(birthYr, y - 1))}>-1Y</button>
          <span className="av-yr-pill">{yr} (Age {vp.completedYears})</span>
          <button type="button" className="av-step-btn" onClick={() => setYr((y) => y + 1)}>+1Y</button>
        </div>
      </div>

      <div className="av-pane-scroll">
        {tab === 'annual' ? (
          <div className="av-split-mini">
            <div style={{ minWidth: '170px', maxWidth: '210px' }}>
              <VedicChartSvg
                title={`Varsha ${yr}`}
                style={chartStyle}
                lagnaSignIndex={vp.varshaChart.ascendant.signIndex}
                items={[
                  { id: 'Asc', label: 'Asc', signIndex: vp.varshaChart.ascendant.signIndex, isLagna: true },
                  ...vp.varshaChart.planets.map((p) => ({
                    id: p.id,
                    label: trPlanetShort(p.id, lang),
                    signIndex: p.signIndex,
                    isRetrograde: p.isRetrograde,
                  })),
                ]}
                centerLabel={`VARSHA ${yr}`}
                compact
                showDownload={false}
              />
            </div>
            <div style={{ flex: 1 }}>
              <div className="av-kv-grid">
                <div className="av-kv-row"><span>Varsha Pravesh:</span><strong>{vp.varshaPraveshLocal}</strong></div>
                <div className="av-kv-row"><span>Varshesh (Year Lord):</span><strong>{trPlanet(vp.varshesh, lang)}</strong></div>
                <div className="av-kv-row"><span>Muntha:</span><strong>{vp.munthaSignName} (House {vp.munthaHouse})</strong></div>
              </div>
              <table className="av-table-dense" style={{ marginTop: '6px' }}>
                <thead><tr><th>Mudda Dasha</th><th>Start</th><th>End</th><th>Days</th></tr></thead>
                <tbody>
                  {vp.muddaDasha.map((m, idx) => (
                    <tr key={idx}>
                      <td><strong>{trPlanetShort(m.lord, lang)}</strong></td>
                      <td className="mono">{m.startDate}</td>
                      <td className="mono">{m.endDate}</td>
                      <td className="mono">{Math.round(m.days)}d</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="av-monthly12-grid">
            {monthly12.map((m) => (
              <div key={m.monthNumber} className="av-varga-tile">
                <VedicChartSvg
                  title={`Month ${m.monthNumber} · ${m.dateDmy}`}
                  subtitle={`Muntha: ${m.munthaSignName}`}
                  style={chartStyle}
                  lagnaSignIndex={m.chart.ascendant.signIndex}
                  items={[
                    { id: 'Asc', label: 'As', signIndex: m.chart.ascendant.signIndex, isLagna: true },
                    ...m.chart.planets.map((p) => ({
                      id: p.id,
                      label: trPlanetShort(p.id, lang),
                      signIndex: p.signIndex,
                      isRetrograde: p.isRetrograde,
                    })),
                  ]}
                  centerLabel={`M${m.monthNumber}`}
                  compact
                  showDownload={false}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const YogasActiveWidget: React.FC<{ chart: ChartData; lang: AppLanguage }> = ({ chart, lang }) => {
  const [query, setQuery] = useState('');
  const [viewMode, setViewMode] = useState<'chart' | 'encyclopedia'>('chart');
  const filteredCorpus = useMemo(
    () =>
      PARASHARA_LIGHT_YOGAS_CORPUS.filter(
        (y) =>
          !query.trim() ||
          `${y.nameEn} ${y.conditionEn} ${y.category}`.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 60),
    [query]
  );

  return (
    <div className="av-pane-card">
      <div className="av-pane-header">
        <div className="av-pane-title">
          {viewMode === 'chart'
            ? lang === 'hi'
              ? `सक्रिय कुंडली योग (${chart.yogas.length})`
              : `Chart Yoga Analyzer (${chart.yogas.length} Found)`
            : lang === 'hi'
              ? 'शास्त्रीय योग विश्वकोश'
              : 'Classical Yoga Dictionary'}
        </div>
        <div className="av-subtabs-xs">
          <button type="button" className={viewMode === 'chart' ? 'is-on' : ''} onClick={() => setViewMode('chart')}>
            Chart ({chart.yogas.length})
          </button>
          <button type="button" className={viewMode === 'encyclopedia' ? 'is-on' : ''} onClick={() => setViewMode('encyclopedia')}>
            Dictionary ({PARASHARA_LIGHT_YOGAS_CORPUS.length})
          </button>
        </div>
      </div>

      <div className="av-pane-scroll">
        {viewMode === 'encyclopedia' && (
          <input
            type="text"
            className="av-input-search"
            placeholder="Filter Yogas (e.g. Gaja, Budhaditya, Nabhasa, Raja)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        )}
        <table className="av-table-dense">
          <thead>
            <tr>
              <th>Yoga</th>
              <th>Category</th>
              <th>Details / Condition</th>
            </tr>
          </thead>
          <tbody>
            {viewMode === 'chart'
              ? chart.yogas.map((y, idx) => (
                  <tr key={idx}>
                    <td><strong>{y.name}</strong></td>
                    <td>{y.category} ({y.strength})</td>
                    <td>{y.description}</td>
                  </tr>
                ))
              : filteredCorpus.map((y) => (
                  <tr key={y.id}>
                    <td><strong>{y.nameEn}</strong></td>
                    <td>{y.category}</td>
                    <td><strong>If:</strong> {y.conditionEn} <em>Result:</em> {y.resultEn}</td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const KpCuspsRulingWidget: React.FC<{ chart: ChartData; lang: AppLanguage }> = ({ chart, lang }) => {
  const kp = useMemo(() => computeKpReport(chart), [chart]);
  return (
    <div className="av-pane-card">
      <div className="av-pane-header">
        <div className="av-pane-title">{lang === 'hi' ? 'के.पी. भाव सब-लॉर्ड व रूलिंग ग्रह' : 'KP Cuspal Sub-Lords & Ruling Planets'}</div>
      </div>
      <div className="av-pane-scroll">
        <div className="av-mini-banner">
          <strong>Ruling Planets:</strong>{' '}
          {kp.chartRulingPlanets.rulingPlanets.map((p) => trPlanetShort(p, lang)).join(' · ')}
        </div>
        <table className="av-table-dense">
          <thead><tr><th>Cusp</th><th>Sign</th><th>Deg</th><th>SL</th><th>NL</th><th>Sub</th><th>SSL</th></tr></thead>
          <tbody>
            {kp.cusps.map((c) => (
              <tr key={c.house}>
                <td className="mono"><strong>H{c.house}</strong></td>
                <td>{c.signName.slice(0, 3)}</td>
                <td className="mono">{c.dms}</td>
                <td>{trPlanetShort(c.signLord, lang)}</td>
                <td>{trPlanetShort(c.starLord, lang)}</td>
                <td><strong>{trPlanetShort(c.subLord, lang)}</strong></td>
                <td>{trPlanetShort(c.subSubLord, lang)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const JaiminiArudhasWidget: React.FC<{ chart: ChartData; lang: AppLanguage }> = ({ chart, lang }) => {
  const jaimini = useMemo(() => computeJaimini(chart), [chart]);
  return (
    <div className="av-pane-card">
      <div className="av-pane-header">
        <div className="av-pane-title">{lang === 'hi' ? 'जैमिनी कारक व आरूढ़ पद' : 'Jaimini Karakas, Karakamsha & Arudha Padas'}</div>
      </div>
      <div className="av-pane-scroll">
        <div className="av-mini-banner">
          <strong>Karakamsha Lagna:</strong> {jaimini.karakamsha.karakamshaSignName} ({jaimini.karakamsha.akPlanet})
        </div>
        <table className="av-table-dense">
          <thead><tr><th>Karaka</th><th>Graha</th><th>Sign</th><th>D9</th><th>Deg</th></tr></thead>
          <tbody>
            {jaimini.karakas.map((k) => {
              const d9Pl = chart.divisionalCharts.D9.placements.find((x) => x.id === k.planet);
              return (
                <tr key={k.role}>
                  <td><strong>{k.role}</strong></td>
                  <td>{trPlanet(k.planet, lang)}</td>
                  <td>{k.signName}</td>
                  <td>{d9Pl ? trSignShort(d9Pl.signIndex, lang) : '-'}</td>
                  <td className="mono">{k.degreeInSign.toFixed(2)}°</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="av-kv-grid" style={{ marginTop: '6px' }}>
          {jaimini.arudhaPadas.slice(0, 12).map((a) => (
            <div key={a.label} className="av-kv-row">
              <span>{a.label}{a.specialLabel ? ` (${a.specialLabel})` : ''}:</span>
              <strong>{a.signName}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const DossierSummaryWidget: React.FC<{ chart: ChartData; lang: AppLanguage }> = ({ chart, lang }) => {
  const dossier = useMemo(() => computeLifeSnapshotDossierReport(chart), [chart]);
  const isHi = lang === 'hi';
  return (
    <div className="av-pane-card">
      <div className="av-pane-header">
        <div className="av-pane-title">
          {isHi ? '360° प्रामाणिक जीवन सारांश (74 तथ्य)' : '360° Authentic Life Matrix (16 Pillars / 74 Attr)'}
        </div>
      </div>
      <div className="av-pane-scroll">
        {dossier.pillars.map((pillar, idx) => (
          <details key={pillar.id} open={idx === 0 || pillar.id.includes('career')} className="av-dossier-acc">
            <summary>{isHi ? pillar.titleHi : pillar.titleEn} ({pillar.attributes.length})</summary>
            <table className="av-table-dense">
              <tbody>
                {pillar.attributes.map((attr) => (
                  <tr key={attr.id}>
                    <td style={{ width: '32%' }}><strong>{isHi ? attr.titleHi : attr.titleEn}</strong></td>
                    <td>{isHi ? attr.valueHi : attr.valueEn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </details>
        ))}
      </div>
    </div>
  );
};

export const RenderCustomWidget: React.FC<{
  widgetId: CustomWidgetId;
  chart: ChartData;
  chartStyle: ChartStyle;
  lang: AppLanguage;
  displayOptions: ChartDisplayOptions;
  vargaId: DivisionalChartId;
  onUpdateDisplayOptions: (next: ChartDisplayOptions) => void;
  onChangeVargaId: (next: DivisionalChartId) => void;
}> = ({
  widgetId,
  chart,
  chartStyle,
  lang,
  displayOptions,
  vargaId,
  onUpdateDisplayOptions,
  onChangeVargaId,
}) => {
  switch (widgetId) {
    case 'd1_chart':
      return (
        <AvRasiPane
          chart={chart}
          chartStyle={chartStyle}
          lang={lang}
          displayOptions={displayOptions}
          onUpdateDisplayOptions={onUpdateDisplayOptions}
        />
      );
    case 'd9_chart':
      return <AvVargaPane chart={chart} chartStyle={chartStyle} lang={lang} vargaId="D9" showDegrees={displayOptions.showDegrees} />;
    case 'varga_picker_chart':
      return (
        <AvVargaPane
          chart={chart}
          chartStyle={chartStyle}
          lang={lang}
          vargaId={vargaId}
          onChangeVargaId={onChangeVargaId}
          showDegrees={displayOptions.showDegrees}
        />
      );
    case 'planets_table':
      return <PlanetsTableWidget chart={chart} lang={lang} />;
    case 'panchanga_avakahada':
      return <PanchangaAvakahadaWidget chart={chart} lang={lang} />;
    case 'vimshottari_5tier':
      return <Vimshottari5TierWidget chart={chart} lang={lang} />;
    case 'shadbala_table':
      return <ShadbalaWidget chart={chart} lang={lang} />;
    case 'bhavabala_table':
      return <BhavabalaWidget chart={chart} lang={lang} />;
    case 'shad_phala':
      return <ShadPhalaWidget chart={chart} lang={lang} />;
    case 'ashtakavarga_sav':
      return <AshtakavargaSavWidget chart={chart} chartStyle={chartStyle} lang={lang} />;
    case 'vimsopaka_matrix':
      return <VimsopakaWidget chart={chart} lang={lang} />;
    case 'gochar_live':
      return <GocharLiveWidget chart={chart} lang={lang} />;
    case 'varshaphala_summary':
      return <VarshaphalaSummaryWidget chart={chart} chartStyle={chartStyle} lang={lang} />;
    case 'yogas_active':
      return <YogasActiveWidget chart={chart} lang={lang} />;
    case 'kp_cusps_ruling':
      return <KpCuspsRulingWidget chart={chart} lang={lang} />;
    case 'jaimini_arudhas':
      return <JaiminiArudhasWidget chart={chart} lang={lang} />;
    case 'dossier_summary':
      return <DossierSummaryWidget chart={chart} lang={lang} />;
  }
};
