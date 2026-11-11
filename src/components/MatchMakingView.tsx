import React, { useEffect, useMemo, useState } from 'react';
import { Baby, Calendar, Compass, Flame, Heart, ShieldAlert, Sparkles } from 'lucide-react';
import { calculateChart } from '../astro/calculator';
import { computeAshtakoota } from '../astro/matchmaking';
import { computeDeepMarriageMatch } from '../astro/matchmakingDeep';
import { computeSouthIndianPorutham } from '../astro/porutham';
import { evaluateParamayusStatus } from '../astro/predictions/paramayus';
import { formatDateDmy } from '../astro/time';
import type { BirthInput, CalcSettings, ChartData, ChartStyle } from '../astro/types';
import { localizeMatchResultHi, trBadge } from '../i18n/hindiPredictions';
import { useLanguage } from '../i18n/LanguageContext';
import { trPlanet, trPlanetShort, trSign, trTerm, type AppLanguage } from '../i18n/translations';
import { ParamayusLockBanner } from './ParamayusLockBanner';
import { VedicChartSvg, type ChartBadgeItem } from './VedicChartSvg';

interface MatchMakingViewProps {
  profiles: BirthInput[];
  activeProfileId: string;
  settings: CalcSettings;
  chartStyle: ChartStyle;
  requestedPair?: {
    brideId?: string;
    groomId?: string;
    subTab?: 'overview' | 'porutham' | 'sphuta' | 'vivaha' | 'pooja' | 'house_sign';
    nonce: number;
  };
}

function toChartBadges(chart: ChartData, varga: 'D1' | 'D9', lang: AppLanguage): ChartBadgeItem[] {
  return chart.divisionalCharts[varga].placements.map((p) => ({
    id: p.id,
    label: trPlanetShort(p.id, lang),
    signIndex: p.signIndex,
    isLagna: p.id === 'Asc',
    isRetrograde: p.isRetrograde,
    isCombust: p.isCombust,
    dignity: p.dignity,
  }));
}

export const MatchMakingView: React.FC<MatchMakingViewProps> = ({
  profiles,
  activeProfileId,
  settings,
  chartStyle,
  requestedPair,
}) => {
  const { lang, t } = useLanguage();
  const [brideId, setBrideId] = useState<string>(requestedPair?.brideId || activeProfileId);
  const [groomId, setGroomId] = useState<string>(() => {
    if (requestedPair?.groomId) return requestedPair.groomId;
    const livingAlt = profiles.find((p) => {
      if (p.id === activeProfileId) return false;
      const y = parseInt(p.date.slice(0, 4), 10);
      return Number.isFinite(y) && new Date().getFullYear() - y <= 120;
    });
    return livingAlt?.id || profiles.find((p) => p.id !== activeProfileId)?.id || activeProfileId;
  });

  useEffect(() => {
    if (requestedPair?.brideId && requestedPair?.groomId) {
      setBrideId(requestedPair.brideId);
      setGroomId(requestedPair.groomId);
    }
    if (requestedPair?.subTab) {
      setMatchSubTab(requestedPair.subTab);
    }
  }, [requestedPair?.nonce, requestedPair?.brideId, requestedPair?.groomId, requestedPair?.subTab]);
  const [chartView, setChartView] = useState<'D1' | 'D9'>('D1');
  const [matchSubTab, setMatchSubTab] = useState<'overview' | 'porutham' | 'sphuta' | 'vivaha' | 'pooja' | 'house_sign'>('overview');

  const brideInput = profiles.find((p) => p.id === brideId) || profiles[0];
  const groomInput = profiles.find((p) => p.id === groomId) || profiles[profiles.length - 1];

  const brideChart = useMemo(() => calculateChart(brideInput, settings), [brideInput, settings]);
  const groomChart = useMemo(() => calculateChart(groomInput, settings), [groomInput, settings]);
  const paramayusBride = useMemo(() => evaluateParamayusStatus(brideChart), [brideChart]);
  const paramayusGroom = useMemo(() => evaluateParamayusStatus(groomChart), [groomChart]);
  const matchLocked = paramayusBride.exceeded || paramayusGroom.exceeded;
  const rawResult = useMemo(
    () => computeAshtakoota(brideChart, groomChart),
    [brideChart, groomChart]
  );
  const result = useMemo(
    () => (lang === 'hi' ? localizeMatchResultHi(rawResult, brideChart, groomChart) : rawResult),
    [rawResult, lang, brideChart, groomChart]
  );
  const deepResult = useMemo(
    () => (matchLocked ? null : computeDeepMarriageMatch(brideChart, groomChart, rawResult)),
    [matchLocked, brideChart, groomChart, rawResult]
  );
  const poruthamReport = useMemo(
    () => computeSouthIndianPorutham(brideChart, groomChart),
    [brideChart, groomChart]
  );

  const gunaPct = Math.round((result.totalObtained / result.totalMax) * 100);
  const sex = result.sexualCompatibility;
  const houseAvgScore = useMemo(
    () =>
      deepResult && deepResult.houseMatches.length > 0
        ? Math.round(
            deepResult.houseMatches.reduce((acc, row) => acc + row.score, 0) /
              deepResult.houseMatches.length
          )
        : 0,
    [deepResult]
  );
  const poojaAlertCount = deepResult
    ? deepResult.doshaPoojas.filter((d) => d.severity !== 'Clear').length
    : 0;
  const earliestVivahaDate = deepResult?.vivahaTiming.auspiciousDates[0];

  const formatPlanets = (ids: string[]) =>
    ids.length ? ids.map((id) => trPlanet(id, lang)).join(', ') : lang === 'hi' ? 'खाली' : 'Empty';

  const batchMatches = useMemo(() => {
    if (paramayusBride.exceeded) return [];
    return profiles
      .filter((cand) => cand.id !== brideInput.id)
      .map((cand) => {
        const candChart = calculateChart(cand, settings);
        if (evaluateParamayusStatus(candChart).exceeded) return null;
        const rawMatch = computeAshtakoota(brideChart, candChart);
        const loc = lang === 'hi' ? localizeMatchResultHi(rawMatch, brideChart, candChart) : rawMatch;
        return {
          candidate: cand,
          candChart,
          res: loc,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .sort((a, b) => b.res.totalObtained - a.res.totalObtained || b.res.kundaliScore - a.res.kundaliScore);
  }, [paramayusBride.exceeded, profiles, brideInput.id, brideChart, settings, lang]);

  return (
    <div className="view-stack">
      <div className="charts-toolbar">
        <div className="toolbar-group">
          <span className="label-muted">{lang === 'hi' ? 'साथी A (वधू / कुंडली 1):' : 'Partner A (Bride / Chart 1):'}</span>
          <select
            className="select-compact"
            value={brideInput.id}
            onChange={(e) => setBrideId(e.target.value)}
          >
            {profiles.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({formatDateDmy(p.date)})
              </option>
            ))}
          </select>
        </div>

        <div className="toolbar-group">
          <span className="label-muted">{lang === 'hi' ? 'साथी B (वर / कुंडली 2):' : 'Partner B (Groom / Chart 2):'}</span>
          <select
            className="select-compact"
            value={groomInput.id}
            onChange={(e) => setGroomId(e.target.value)}
          >
            {profiles.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({formatDateDmy(p.date)})
              </option>
            ))}
          </select>
        </div>
      </div>

      {matchLocked || !deepResult || !deepResult.beejaKshetra ? (
        <ParamayusLockBanner status={paramayusBride.exceeded ? paramayusBride : paramayusGroom} />
      ) : (
        <>
      {/* Combined Kundali + Gun Milan Score Banner */}
      <section className="panel match-summary-card">
        <div className="match-score-circle">
          <Heart size={18} />
          <div className="match-score-num mono">
            {result.kundaliScore} <span>/ 100</span>
          </div>
          <div className="muted small-text">{lang === 'hi' ? 'पूर्ण कुंडली मिलान' : 'Kundali Match'}</div>
        </div>

        <div className="match-score-circle">
          <div className="match-score-num mono">
            {result.totalObtained} <span>/ 36</span>
          </div>
          <div className="muted small-text">{lang === 'hi' ? `गुण (${gunaPct}%)` : `Guna (${gunaPct}%)`}</div>
        </div>

        <div className="match-summary-info">
          <h3>{result.combinedVerdict}</h3>
          <p className="muted">
            {result.verdict} · <strong>{brideInput.name}</strong> ({trSign(brideChart.ascendant.signIndex, lang)} {t.common.lagna},{' '}
            {trTerm(brideChart.panchang.nakshatra.name, lang)} {lang === 'hi' ? 'च' : 'P'}{brideChart.panchang.nakshatra.pada}) ↔{' '}
            <strong>{groomInput.name}</strong> ({trSign(groomChart.ascendant.signIndex, lang)} {t.common.lagna},{' '}
            {trTerm(groomChart.panchang.nakshatra.name, lang)} {lang === 'hi' ? 'च' : 'P'}{groomChart.panchang.nakshatra.pada})
          </p>

          <div className="manglik-badges">
            <span className={`tag ${result.brideManglik.isManglik ? 'tag-combust' : 'tag-varg'}`}>
              {lang === 'hi' ? 'साथी A:' : 'Partner A:'} {result.brideManglik.note}
            </span>
            <span className={`tag ${result.groomManglik.isManglik ? 'tag-combust' : 'tag-varg'}`}>
              {lang === 'hi' ? 'साथी B:' : 'Partner B:'} {result.groomManglik.note}
            </span>
            <span className={`tag ${result.papaSamyam.status === 'Balanced' ? 'tag-varg' : 'tag-retro'}`}>
              {lang === 'hi' ? 'पापांश साम्य:' : 'Papa-Samyam:'} {result.papaSamyam.bridePapaPoints} vs {result.papaSamyam.groomPapaPoints} ({trBadge(result.papaSamyam.status, lang)})
            </span>
          </div>
        </div>
      </section>

      <div className="charts-toolbar">
        <div className="subtab-bar" role="tablist" aria-label={lang === 'hi' ? 'विवाह मिलान विभाग' : 'Marriage Matching Sections'}>
          <button
            type="button"
            className={`subtab-btn ${matchSubTab === 'overview' ? 'is-active' : ''}`}
            onClick={() => setMatchSubTab('overview')}
          >
            {lang === 'hi' ? 'अष्टकूट व कुंडली' : 'Ashtakoota & Charts'}
          </button>
          <button
            type="button"
            className={`subtab-btn ${matchSubTab === 'sphuta' ? 'is-active' : ''}`}
            onClick={() => setMatchSubTab('sphuta')}
          >
            {lang === 'hi' ? 'बीज व क्षेत्र स्फुट' : 'Beeja & Kshetra Sphuta'}
          </button>
          <button
            type="button"
            className={`subtab-btn ${matchSubTab === 'vivaha' ? 'is-active' : ''}`}
            onClick={() => setMatchSubTab('vivaha')}
          >
            {lang === 'hi' ? 'शुभ विवाह मुहूर्त व दशा' : 'Vivaha Dates & Dasha'}
          </button>
          <button
            type="button"
            className={`subtab-btn ${matchSubTab === 'pooja' ? 'is-active' : ''}`}
            onClick={() => setMatchSubTab('pooja')}
          >
            {lang === 'hi'
              ? `दोष व पूजा विधि (${poojaAlertCount})`
              : `Dosha & Pooja Remedies (${poojaAlertCount})`}
          </button>
          <button
            type="button"
            className={`subtab-btn ${matchSubTab === 'house_sign' ? 'is-active' : ''}`}
            onClick={() => setMatchSubTab('house_sign')}
          >
            {lang === 'hi' ? 'राशि व भाव (H1–H12) मिलान' : 'Sign & House (H1–H12) Match'}
          </button>
          <button
            type="button"
            className={`subtab-btn ${matchSubTab === 'porutham' ? 'is-active' : ''}`}
            onClick={() => setMatchSubTab('porutham')}
          >
            {lang === 'hi'
              ? `दश पोरुथम् (${poruthamReport.totalScore}/10)`
              : `10-Porutham (${poruthamReport.totalScore}/10)`}
          </button>
        </div>
      </div>

      {matchSubTab === 'overview' && (
        <>
          <section className="panel">
            <div className="panel-header">
              <h2>
                <Sparkles size={16} />{' '}
                {lang === 'hi'
                  ? 'गहन संतान, विवाह मुहूर्त, पूजा व राशि-भाव मिलान सारांश'
                  : 'Deep Synastry Highlights: Sphuta, Vivaha Dates, Pooja & House-Sign Match'}
              </h2>
            </div>
            <div className="branch-highlights" style={{ padding: '14px' }}>
              <button
                type="button"
                className="highlight-box"
                style={{ textAlign: 'left', cursor: 'pointer' }}
                onClick={() => setMatchSubTab('sphuta')}
              >
                <div className="hl-label">
                  {lang === 'hi' ? 'बीज व क्षेत्र स्फुट (संतान योग)' : 'Beeja & Kshetra Sphuta'}
                </div>
                <div className="hl-val">
                  {deepResult?.beejaKshetra
                    ? `${deepResult.beejaKshetra.score}/100 (${trTerm(deepResult.beejaKshetra.status, lang)})`
                    : '—'}
                </div>
                <div className="hl-sub">
                  {deepResult?.beejaKshetra
                    ? lang === 'hi'
                      ? `${deepResult.beejaKshetra.d1AxisLabelHi} · पूरा विश्लेषण देखें →`
                      : `${deepResult.beejaKshetra.d1AxisLabelEn} · Open Sphuta tab →`
                    : ''}
                </div>
              </button>

              <button
                type="button"
                className="highlight-box"
                style={{ textAlign: 'left', cursor: 'pointer' }}
                onClick={() => setMatchSubTab('vivaha')}
              >
                <div className="hl-label">
                  {lang === 'hi' ? 'प्रमुख शुभ विवाह तिथि' : 'Next Suitable Marriage Date'}
                </div>
                <div className="hl-val">
                  {earliestVivahaDate
                    ? formatDateDmy(earliestVivahaDate.date)
                    : lang === 'hi'
                    ? 'विवरण देखें'
                    : 'View Windows'}
                </div>
                <div className="hl-sub">
                  {earliestVivahaDate
                    ? lang === 'hi'
                      ? `${earliestVivahaDate.tithiNameHi} · ${trTerm(earliestVivahaDate.nakshatraName, lang)} · सभी तिथियाँ देखें →`
                      : `${earliestVivahaDate.tithiNameEn} · ${earliestVivahaDate.nakshatraName} · View all dates →`
                    : lang === 'hi'
                    ? 'विवाह दशा व मुहूर्त देखें →'
                    : 'Open Vivaha Dates & Dasha →'}
                </div>
              </button>

              <button
                type="button"
                className="highlight-box"
                style={{ textAlign: 'left', cursor: 'pointer' }}
                onClick={() => setMatchSubTab('pooja')}
              >
                <div className="hl-label">
                  {lang === 'hi' ? 'मिलान दोष व पूजा विधान' : 'Required Pooja Remedies'}
                </div>
                <div className="hl-val">
                  {poojaAlertCount > 0
                    ? lang === 'hi'
                      ? `${poojaAlertCount} निवारण पूजा`
                      : `${poojaAlertCount} Remedy Pooja(s)`
                    : lang === 'hi'
                    ? 'कोई मुख्य दोष नहीं'
                    : 'No Major Dosha'}
                </div>
                <div className="hl-sub">
                  {lang === 'hi' ? 'पूजा नाम, मंत्र व दान विधि देखें →' : 'Open Pooja & Mantra tab →'}
                </div>
              </button>

              <button
                type="button"
                className="highlight-box"
                style={{ textAlign: 'left', cursor: 'pointer' }}
                onClick={() => setMatchSubTab('house_sign')}
              >
                <div className="hl-label">
                  {lang === 'hi' ? '12 भाव व 7 राशि मिलान' : 'House (H1–H12) & Sign Match'}
                </div>
                <div className="hl-val">
                  {houseAvgScore}/100 {lang === 'hi' ? 'औसत' : 'Avg'}
                </div>
                <div className="hl-sub">
                  {lang === 'hi'
                    ? 'राशि व सभी 12 भावों की तुलना देखें →'
                    : 'Open Sign & House Synastry →'}
                </div>
              </button>
            </div>
          </section>

      {/* Side-by-Side Partner Kundali Charts (D1 Rasi & D9 Navamsa) */}
      <section className="panel">
        <div className="panel-header">
          <h3>
            {lang === 'hi'
              ? `दोनों साथियों की कुंडली तुलना (${chartView === 'D1' ? 'D1 राशि' : 'D9 नवांश'})`
              : `Side-by-Side Partner Kundalis (${chartView === 'D1' ? 'D1 Rasi' : 'D9 Navamsa'})`}
          </h3>
          <div className="subtab-bar">
            <button
              type="button"
              className={`subtab-btn ${chartView === 'D1' ? 'is-active' : ''}`}
              onClick={() => setChartView('D1')}
            >
              {lang === 'hi' ? 'D1 राशि कुंडली' : 'D1 Rasi Charts'}
            </button>
            <button
              type="button"
              className={`subtab-btn ${chartView === 'D9' ? 'is-active' : ''}`}
              onClick={() => setChartView('D9')}
            >
              {lang === 'hi' ? 'D9 नवांश कुंडली (विवाह)' : 'D9 Navamsa Charts (Marriage)'}
            </button>
          </div>
        </div>
        <div className="dual-chart-grid panel-subblock">
          <VedicChartSvg
            title={`${brideInput.name} — ${chartView}`}
            subtitle={`${t.common.lagna}: ${trSign(brideChart.divisionalCharts[chartView].lagnaSignIndex, lang)}`}
            style={chartStyle}
            lagnaSignIndex={brideChart.divisionalCharts[chartView].lagnaSignIndex}
            items={toChartBadges(brideChart, chartView, lang)}
            centerLabel={`A · ${chartView}`}
          />
          <VedicChartSvg
            title={`${groomInput.name} — ${chartView}`}
            subtitle={`${t.common.lagna}: ${trSign(groomChart.divisionalCharts[chartView].lagnaSignIndex, lang)}`}
            style={chartStyle}
            lagnaSignIndex={groomChart.divisionalCharts[chartView].lagnaSignIndex}
            items={toChartBadges(groomChart, chartView, lang)}
            centerLabel={`B · ${chartView}`}
          />
        </div>
      </section>

      {/* Full Kundali Matching Pillars */}
      <section className="panel">
        <div className="panel-header">
          <h3>{lang === 'hi' ? 'गहन पूर्ण कुंडली मिलान (गुण मिलान से आगे)' : 'Deep Kundali Synastry Pillars (Beyond Gun Milan)'}</h3>
          <span className="muted">
            {lang === 'hi'
              ? 'D1 लग्न/चंद्र · D9 नवांश · पापांश साम्य · D7 संतान · दशा समन्वय'
              : 'D1 Lagna/Moon · D9 Navamsa · Papa-Samyam · Progeny D7 · Dasha Sync'}
          </span>
        </div>
        <div className="domains-grid">
          {result.kundaliPillars.map((p) => {
            const tone = p.score >= 75 ? 'high' : p.score >= 58 ? 'mid' : 'low';
            return (
              <article key={p.title} className="domain-card">
                <div className="domain-top">
                  <h4>{p.title}</h4>
                  <div className="domain-score-badge">
                    <strong className={`mono tone-text-${tone}`}>{p.score}</strong>
                    <span>/100</span>
                  </div>
                </div>
                <div className="bar-track">
                  <div className={`bar-fill tone-${tone}`} style={{ width: `${p.score}%` }} />
                </div>
                <p className="domain-summary">{p.summary}</p>
                <ul className="domain-details">
                  {p.details.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </section>

      {/* Intimacy, Passion & Sexual Compatibility Card */}
      <section className="panel">
        <div className="panel-header">
          <h3>
            <Flame size={15} /> {lang === 'hi' ? 'काम, आकर्षण एवं शयन सुख (यौन) सामंजस्य' : 'Sexual, Passion & Shayana Sukha Compatibility'}
          </h3>
          <span className={`tag ${sex.score >= 70 ? 'tag-varg' : 'tag-karaka'}`}>
            {trBadge(sex.chemistryLevel, lang)} ({sex.score}/100)
          </span>
        </div>
        <div className="pred-card-body">
          <div className="branch-highlights">
            <div className="highlight-box">
              <span className="muted small-text">{brideInput.name} {lang === 'hi' ? 'अंतरंग स्वभाव' : 'Intimacy Style'}</span>
              <strong>{sex.brideArchetype} ({lang === 'hi' ? 'ऊर्जा:' : 'Drive:'} {sex.brideDrive}/100)</strong>
            </div>
            <div className="highlight-box">
              <span className="muted small-text">{groomInput.name} {lang === 'hi' ? 'अंतरंग स्वभाव' : 'Intimacy Style'}</span>
              <strong>{sex.groomArchetype} ({lang === 'hi' ? 'ऊर्जा:' : 'Drive:'} {sex.groomDrive}/100)</strong>
            </div>
          </div>

          <div className="pred-bullets">
            <div>
              <strong>{lang === 'hi' ? 'शुक्र–मंगल परस्पर आकर्षण:' : 'Venus–Mars Cross-Chemistry:'}</strong> {sex.venusMarsCrossLinks.join(' · ')}
            </div>
            <div>
              <strong>{lang === 'hi' ? '12वां (शयन सुख) व 8वां भाव मिलान:' : '12th (Shayana Sukha) & 8th House Synastry:'}</strong> {sex.shayanaAndEighthNote}
            </div>
            <div>
              <strong>{lang === 'hi' ? 'योनि व कामना संतुलन:' : 'Yoni & Libido Alignment:'}</strong> {sex.yoniAndLibidoNote}
            </div>
            <div>
              <strong>{lang === 'hi' ? 'दांपत्य मार्गदर्शन:' : 'Relationship Guidance:'}</strong> {sex.guidance}
            </div>
          </div>
        </div>
      </section>

      {/* Papa-Samyam + Ashtakoota Table */}
      <section className="panel">
        <div className="panel-header">
          <h3>{lang === 'hi' ? 'अष्टकूट गुण मिलान (36 गुण विस्तृत तालिका)' : 'Ashtakoota Guna Milan (36-Point Breakdown)'}</h3>
          <span className="muted">
            <ShieldAlert size={13} /> {lang === 'hi' ? 'पापांश साम्य:' : 'Papa-Samyam:'} {result.papaSamyam.note}
          </span>
        </div>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>{lang === 'hi' ? 'कूट' : 'Koota'}</th>
                <th>{lang === 'hi' ? 'क्षेत्र' : 'Area'}</th>
                <th>{lang === 'hi' ? 'साथी A' : 'Partner A'}</th>
                <th>{lang === 'hi' ? 'साथी B' : 'Partner B'}</th>
                <th>{t.common.score}</th>
                <th>{t.common.max}</th>
                <th>{t.common.status}</th>
                <th>{t.common.notes}</th>
              </tr>
            </thead>
            <tbody>
              {result.kootas.map((k) => (
                <tr key={k.name}>
                  <td>
                    <strong>{k.name}</strong>
                  </td>
                  <td>{k.sanskrit}</td>
                  <td>{k.brideValue}</td>
                  <td>{k.groomValue}</td>
                  <td className="mono">
                    <strong>{k.obtainedPoints}</strong>
                  </td>
                  <td className="mono muted">{k.maxPoints}</td>
                  <td>
                    <span
                      className={`tag ${
                        k.status === 'Good'
                          ? 'tag-varg'
                          : k.status === 'Average'
                            ? 'tag-karaka'
                            : 'tag-combust'
                      }`}
                    >
                      {trBadge(k.status, lang)}
                    </span>
                  </td>
                  <td className="wrap-cell muted">{k.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Prokerala-style Batch Matchmaking Matrix (1 vs All Saved Profiles) */}
      <section className="panel">
        <div className="panel-header">
          <h3>
            {lang === 'hi'
              ? `सामूहिक मिलान तालिका (${brideInput.name} बनाम सभी सहेजी गई कुंडलियाँ)`
              : `Batch Compatibility Matrix (${brideInput.name} vs All Saved Profiles)`}
          </h3>
          <span className="muted">
            {lang === 'hi'
              ? '36 गुण, पूर्ण स्कोर, नाड़ी व मांगलिक मिलान के आधार पर क्रमबद्ध'
              : 'Ranked by 36-Guna Ashtakoota, Kundali Match & Manglik Balance'}
          </span>
        </div>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>{lang === 'hi' ? 'साथी प्रोफ़ाइल' : 'Candidate Profile'}</th>
                <th>{lang === 'hi' ? 'लग्न / चंद्र' : 'Lagna / Moon'}</th>
                <th>{lang === 'hi' ? 'गुण (36)' : 'Guna (/36)'}</th>
                <th>{lang === 'hi' ? 'पूर्ण स्कोर' : 'Match (/100)'}</th>
                <th>{lang === 'hi' ? 'नाड़ी / भकूट' : 'Nadi & Bhakoot'}</th>
                <th>{lang === 'hi' ? 'मांगलिक' : 'Manglik'}</th>
                <th>{lang === 'hi' ? 'चयन' : 'Action'}</th>
              </tr>
            </thead>
            <tbody>
              {batchMatches.length === 0 ? (
                <tr>
                  <td colSpan={7} className="muted">
                    {lang === 'hi'
                      ? 'सक्रिय (120 वर्ष से कम आयु) अन्य प्रोफ़ाइल उपलब्ध नहीं; "Edit / New" से जोड़ें (120+ वर्ष वाले दिवंगत/अमर चार्ट मिलान में शामिल नहीं किए जाते)।'
                      : 'No other living profiles (<=120 yrs) available; add via "Edit / New" (profiles past 120 yrs are excluded as Dead or Amar).'}
                  </td>
                </tr>
              ) : (
                batchMatches.map((row) => {
                  const nadi = row.res.kootas.find((k) => k.name.toLowerCase().includes('nadi'));
                  const bhakoot = row.res.kootas.find((k) => k.name.toLowerCase().includes('bhakoot'));
                  const isCurrent = row.candidate.id === groomInput.id;
                  return (
                    <tr key={row.candidate.id} className={isCurrent ? 'highlight-row' : ''}>
                      <td>
                        <strong>{row.candidate.name}</strong>
                        <div className="muted small-text mono">{formatDateDmy(row.candidate.date)} · {row.candidate.city}</div>
                      </td>
                      <td>
                        {trSign(row.candChart.ascendant.signIndex, lang)} / {trTerm(row.candChart.panchang.nakshatra.name, lang)}
                      </td>
                      <td className="mono"><strong>{row.res.totalObtained} / 36</strong></td>
                      <td>
                        <span className={`tag ${row.res.kundaliScore >= 72 ? 'tag-varg' : row.res.kundaliScore >= 58 ? 'tag-karaka' : 'tag-combust'}`}>
                          {row.res.kundaliScore}%
                        </span>
                      </td>
                      <td className="small-text">
                        {lang === 'hi' ? 'नाड़ी:' : 'Nadi:'} {nadi?.obtainedPoints ?? 0}/8 · {lang === 'hi' ? 'भकूट:' : 'Bh:'} {bhakoot?.obtainedPoints ?? 0}/7
                      </td>
                      <td>
                        {row.res.manglikCompatible
                          ? lang === 'hi'
                            ? 'संगत ✓'
                            : 'Compatible ✓'
                          : lang === 'hi'
                            ? 'असमान ⚠'
                            : 'Mismatch ⚠'}
                      </td>
                      <td>
                        <button
                          type="button"
                          className={`btn btn-sm ${isCurrent ? 'btn-primary' : 'btn-secondary'}`}
                          onClick={() => setGroomId(row.candidate.id)}
                        >
                          {isCurrent
                            ? lang === 'hi' ? 'चयनित ✓' : 'Selected ✓'
                            : lang === 'hi' ? 'मिलान देखें' : 'Inspect Match'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
        </>
      )}

      {matchSubTab === 'sphuta' && (() => {
        const sp = deepResult.beejaKshetra!;
        return (
        <>
          <section className="panel">
            <div className="panel-header">
              <h2>
                <Baby size={16} />{' '}
                {lang === 'hi'
                  ? 'बीज स्फुट व क्षेत्र स्फुट मिलान (संतान एवं प्रजनन क्षमता विश्लेषण)'
                  : 'Beeja Sphuta & Kshetra Sphuta Matching (Progeny & Fertility Synastry)'}
              </h2>
              <span className="panel-subtitle">
                {lang === 'hi'
                  ? `${brideInput.name} व ${groomInput.name} · स्फुट स्कोर ${sp.score}/100`
                  : `${brideInput.name} & ${groomInput.name} · Sphuta Score ${sp.score}/100`}
              </span>
            </div>

            <div
              className={`gochar-banner ${
                sp.status === 'Strong'
                  ? 'is-clear'
                  : sp.status === 'Moderate'
                  ? 'is-info'
                  : 'is-alert'
              }`}
              style={{ margin: '14px' }}
            >
              <div>
                <strong>
                  {lang === 'hi'
                    ? sp.status === 'Strong'
                      ? 'शुभ व बलवान संतान-योग'
                      : sp.status === 'Moderate'
                      ? 'मध्यम संतान-योग'
                      : 'सावधानी व शांति उपाय आवश्यक'
                    : `Fertility & Progeny Status: ${sp.status}`}
                </strong>
                {' — '}
                {lang === 'hi' ? sp.primaryRoleNoteHi : sp.primaryRoleNoteEn}
                <div style={{ marginTop: 6 }}>
                  {lang === 'hi' ? sp.summaryHi : sp.summaryEn}
                </div>
                <div className="muted" style={{ marginTop: 6 }}>
                  {lang === 'hi'
                    ? `लग्न-स्फुट संबंध: ${sp.d1AxisLabelHi} · नवांश-स्फुट संबंध: ${sp.d9AxisLabelHi}`
                    : `D1 Sphuta Axis: ${sp.d1AxisLabelEn} · D9 Sphuta Axis: ${sp.d9AxisLabelEn}`}
                </div>
              </div>
            </div>

            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{lang === 'hi' ? 'साथी व स्फुट प्रकार' : 'Partner & Sphuta'}</th>
                    <th>{lang === 'hi' ? 'अंश (Longitude)' : 'Sphuta Degree'}</th>
                    <th>{lang === 'hi' ? 'D1 राशि व बल' : 'D1 Sign & Polarity'}</th>
                    <th>{lang === 'hi' ? 'D9 नवांश राशि' : 'D9 Navamsa Sign'}</th>
                    <th>{lang === 'hi' ? 'शुभ ग्रह प्रभाव' : 'Benefic Blessing'}</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      partner: brideInput.name,
                      item: sp.partnerABeeja,
                      kind: 'beeja',
                      isPrimary: sp.activeBeejaOwnerName === brideInput.name,
                    },
                    {
                      partner: brideInput.name,
                      item: sp.partnerAKshetra,
                      kind: 'kshetra',
                      isPrimary: sp.activeKshetraOwnerName === brideInput.name,
                    },
                    {
                      partner: groomInput.name,
                      item: sp.partnerBBeeja,
                      kind: 'beeja',
                      isPrimary: sp.activeBeejaOwnerName === groomInput.name,
                    },
                    {
                      partner: groomInput.name,
                      item: sp.partnerBKshetra,
                      kind: 'kshetra',
                      isPrimary: sp.activeKshetraOwnerName === groomInput.name,
                    },
                  ].map((row, idx) => (
                    <tr key={`${row.partner}-${row.kind}-${idx}`}>
                      <td>
                        <strong>{row.partner}</strong> —{' '}
                        {lang === 'hi' ? row.item.labelHi : row.item.labelEn}
                        {row.isPrimary && (
                          <span className="tag tag-varg" style={{ marginLeft: 8 }}>
                            {lang === 'hi' ? 'मुख्य स्फुट' : 'Primary'}
                          </span>
                        )}
                      </td>
                      <td className="mono">{row.item.dms}</td>
                      <td>
                        <span>{trSign(row.item.signIndex, lang)}</span>{' '}
                        <span
                          className={`badge ${row.item.polarityStrong ? 'badge-ok' : 'badge-warn'}`}
                        >
                          {row.item.polarityStrong
                            ? lang === 'hi'
                              ? 'बलवान (शुभ राशि)'
                              : 'Strong Polarity'
                            : lang === 'hi'
                            ? 'मध्यम/सम-विषम भेद'
                            : 'Needs Support'}
                        </span>
                      </td>
                      <td>{trSign(row.item.d9SignIndex, lang)}</td>
                      <td>
                        <span
                          className={`badge ${row.item.beneficSupport ? 'badge-ok' : 'badge-warn'}`}
                        >
                          {row.item.beneficSupport
                            ? lang === 'hi'
                              ? 'शुभ ग्रह युक्त/दृष्ट'
                              : 'Benefic Blessed'
                            : lang === 'hi'
                            ? 'शुभ दृष्टि की अपेक्षा'
                            : 'Neutral / Mixed'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="cards-list pad-14">
              <div
                className={`yoga-card ${
                  sp.status === 'Strong'
                    ? 'tone-benefic'
                    : sp.status === 'Moderate'
                    ? 'tone-mixed'
                    : 'tone-dosha'
                }`}
              >
                <div className="yoga-head">
                  <strong>
                    {lang === 'hi'
                      ? 'बीज-क्षेत्र संतान उपाय व पूजा सलाह'
                      : 'Beeja–Kshetra Santana Remedy & Guidance'}
                  </strong>
                  <span className="yoga-cat">
                    {lang === 'hi' ? 'सूर्य+शुक्र+गुरु / चंद्र+मंगल+गुरु' : 'Sun+Ven+Jup / Moo+Mar+Jup'}
                  </span>
                </div>
                <p className="yoga-desc">
                  {lang === 'hi' ? sp.remedyHi : sp.remedyEn}
                </p>
              </div>
            </div>
          </section>
        </>
        );
      })()}

      {matchSubTab === 'vivaha' && (
        <>
          <section className="panel">
            <div className="panel-header">
              <h2>
                <Calendar size={16} />{' '}
                {lang === 'hi'
                  ? 'शुभ विवाह समय, संयुक्त दशा अवधि व विवाह मुहूर्त तिथियाँ'
                  : 'Suitable Date of Marriage & Synchronized Vivaha Dasha Timing'}
              </h2>
              <span className="panel-subtitle">
                {lang === 'hi'
                  ? 'दोनों की विंशोत्तरी दशा + खरमास/चातुर्मास/गुरु-शुक्र अस्त वर्जित पंचांग गणना'
                  : 'Dual Vimshottari Dasha + Kharmas/Chaturmas/Jupiter-Venus Combustion Filtered Calendar'}
              </span>
            </div>

            <div className="gochar-banner is-info" style={{ margin: '14px' }}>
              <div>
                <strong>{lang === 'hi' ? 'विवाह काल सारांश: ' : 'Vivaha Timing Summary: '}</strong>
                {lang === 'hi'
                  ? deepResult.vivahaTiming.overallSummaryHi
                  : deepResult.vivahaTiming.overallSummaryEn}
              </div>
            </div>

            <div className="panel-header" style={{ borderTop: '1px solid var(--border)' }}>
              <h3>
                {lang === 'hi'
                  ? '1. दोनों की संयुक्त विवाह-दायक विंशोत्तरी दशा अवधियाँ (Marriage Activation Windows)'
                  : '1. Synchronized Marriage-Activating Vimshottari Dasha Windows'}
              </h3>
            </div>
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{lang === 'hi' ? 'अवधि (दिनांक से - तक)' : 'Window (From – To)'}</th>
                    <th>{brideInput.name}</th>
                    <th>{groomInput.name}</th>
                    <th>{lang === 'hi' ? 'अनुकूलता' : 'Strength'}</th>
                    <th>{lang === 'hi' ? 'विवरण' : 'Dasha Indication'}</th>
                  </tr>
                </thead>
                <tbody>
                  {deepResult.vivahaTiming.overlapWindows.length > 0 ? (
                    deepResult.vivahaTiming.overlapWindows.map((win, idx) => (
                      <tr key={`${win.startDate}-${win.endDate}-${idx}`}>
                        <td className="mono">
                          {formatDateDmy(win.startDate)} – {formatDateDmy(win.endDate)}
                        </td>
                        <td>
                          {win.partnerADasha
                            .split(/[–/-]/)
                            .map((p) => trPlanet(p.trim(), lang))
                            .join(' – ')}
                        </td>
                        <td>
                          {win.partnerBDasha
                            .split(/[–/-]/)
                            .map((p) => trPlanet(p.trim(), lang))
                            .join(' – ')}
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              win.strength >= 70
                                ? 'badge-ok'
                                : win.strength >= 52
                                ? 'badge-warn'
                                : 'badge-bad'
                            }`}
                          >
                            {win.strength}%
                          </span>
                        </td>
                        <td className="wrap-cell small-cell">
                          {lang === 'hi' ? win.noteHi : win.noteEn}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="wrap-cell">
                        {lang === 'hi'
                          ? 'दोनों कुंडलियों के जन्म-वर्षों में 120 वर्ष से अधिक का अंतर होने के कारण संयुक्त विंशोत्तरी दशा अवधि उपलब्ध नहीं है; नीचे पंचांग-आधारित विवाह तिथियाँ देखें।'
                          : 'Both charts span more than 120 years apart, so their Vimshottari lifetimes do not overlap; see Panchang marriage dates below.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="panel-header" style={{ borderTop: '1px solid var(--border)' }}>
              <h3>
                {lang === 'hi'
                  ? '2. दोनों के लिए व्यक्तिगत शुभ विवाह तिथियाँ (आगामी 18 माह — पंचांग व ताराबल सहित)'
                  : '2. Personalized Suitable Marriage Dates (Next 18 Months — Shuddha Muhurta + Tarabala)'}
              </h3>
            </div>
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{lang === 'hi' ? 'दिनांक (DD-MM-YYYY)' : 'Date (DD-MM-YYYY)'}</th>
                    <th>{lang === 'hi' ? 'वार' : 'Weekday'}</th>
                    <th>{lang === 'hi' ? 'तिथि' : 'Tithi'}</th>
                    <th>{lang === 'hi' ? 'विवाह नक्षत्र' : 'Vivaha Nakshatra'}</th>
                    <th>{lang === 'hi' ? 'शुभता स्कोर' : 'Suitability'}</th>
                    <th>{lang === 'hi' ? 'दोनों का ताराबल व चंद्रबल' : 'Dual Tarabala & Chandrabala Note'}</th>
                  </tr>
                </thead>
                <tbody>
                  {deepResult.vivahaTiming.auspiciousDates.length > 0 ? (
                    deepResult.vivahaTiming.auspiciousDates.map((d) => (
                      <tr key={d.date}>
                        <td className="mono">
                          <strong>{formatDateDmy(d.date)}</strong>
                        </td>
                        <td>{lang === 'hi' ? d.weekdayHi : d.weekdayEn}</td>
                        <td>{lang === 'hi' ? d.tithiNameHi : d.tithiNameEn}</td>
                        <td>{trTerm(d.nakshatraName, lang)}</td>
                        <td>
                          <span className={`badge ${d.score >= 82 ? 'badge-ok' : 'badge-warn'}`}>
                            {d.score}/100
                          </span>
                        </td>
                        <td className="wrap-cell small-cell">
                          {lang === 'hi' ? d.noteHi : d.noteEn}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="wrap-cell">
                        {lang === 'hi'
                          ? 'वर्तमान 18 माह की अवधि में सभी कठोर विवाह नियम पूर्ण करने वाली तिथि सीमित हैं; स्थानीय पुरोहित से अभिजित/विवाह लग्न शुद्धि देख कर तिथि सुनिश्चित करें।'
                          : 'Limited dates satisfy every strict Panchang & dual-Tarabala filter in the next 18 months; consult an auspicious Vivaha Lagna window.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      {matchSubTab === 'pooja' && (
        <section className="panel">
          <div className="panel-header">
            <h2>
              <Sparkles size={16} />{' '}
              {lang === 'hi'
                ? 'मिलान में पाए गए दोष एवं आवश्यक वैदिक पूजा-विधि व दान'
                : 'Detected Matchmaking Doshas & Recommended Vedic Pooja Remedies'}
            </h2>
            <span className="panel-subtitle">
              {poojaAlertCount > 0
                ? lang === 'hi'
                  ? `${poojaAlertCount} प्रमुख दोष निवारण पूजा चिन्हित`
                  : `${poojaAlertCount} Dosha Remedy Pooja(s) Identified`
                : lang === 'hi'
                ? 'कोई अशुभ दोष नहीं — मंगल शुभ विवाह पूजन'
                : 'Zero Major Doshas — Auspicious Blessing Protocol'}
            </span>
          </div>

          <div
            className={`gochar-banner ${poojaAlertCount > 0 ? 'is-alert' : 'is-clear'}`}
            style={{ margin: '14px' }}
          >
            <div>
              {poojaAlertCount > 0
                ? lang === 'hi'
                  ? `विवाह मिलान परीक्षण में ${poojaAlertCount} दोष/सावधानी बिंदुओं के लिए शास्त्रीय पूजा, हवन, मंत्र जप व दान नीचे दिए गए हैं। विवाह पूर्व इन पूजाओं को संपन्न करना शुभफलदायी रहेगा।`
                  : `${poojaAlertCount} dosha/sensitivity point(s) were detected in compatibility matching. Perform the specific Vedic Poojas, Havan, Mantra Japa, and Daan detailed below prior to marriage.`
                : lang === 'hi'
                ? 'इस मिलान में मांगलिक, नाड़ी, भकूट, गण या पापा-साम्य का कोई गंभीर दोष नहीं पाया गया है। नीचे केवल मंगलमय वैवाहिक आशीर्वाद हेतु शुभ पूजा दी गई है।'
                : 'No severe Manglik, Nadi, Bhakoot, Gana, or Papa-Samyam dosha was detected in this pairing. Follow the auspicious pre-wedding blessing below.'}
            </div>
          </div>

          <div className="cards-list pad-14">
            {deepResult.doshaPoojas.map((item) => {
              const toneClass =
                item.severity === 'High'
                  ? 'tone-dosha'
                  : item.severity === 'Moderate' || item.severity === 'Low'
                  ? 'tone-mixed'
                  : 'tone-benefic';
              const tagClass =
                item.severity === 'High'
                  ? 'tag-combust'
                  : item.severity === 'Moderate'
                  ? 'tag-karaka'
                  : item.severity === 'Low'
                  ? 'tag-retro'
                  : 'tag-varg';
              return (
                <div key={item.id} className={`yoga-card ${toneClass}`}>
                  <div className="yoga-head">
                    <div>
                      <strong>{lang === 'hi' ? item.doshaHi : item.doshaEn}</strong>
                      <div className="muted" style={{ marginTop: 2 }}>
                        {lang === 'hi' ? item.affectedHi : item.affectedEn}
                      </div>
                    </div>
                    <span className={`tag ${tagClass}`}>{trTerm(item.severity, lang)}</span>
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <strong>
                      {lang === 'hi' ? 'निर्धारित पूजा: ' : 'Recommended Pooja: '}
                      {lang === 'hi' ? item.poojaNameHi : item.poojaNameEn}
                    </strong>
                  </div>
                  <p className="yoga-desc" style={{ marginTop: 6 }}>
                    {lang === 'hi' ? item.mantraAndVidhiHi : item.mantraAndVidhiEn}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {matchSubTab === 'house_sign' && (
        <>
          <section className="panel">
            <div className="panel-header">
              <h2>
                <Compass size={16} />{' '}
                {lang === 'hi'
                  ? '1. राशि से राशि मिलान (Sign-to-Sign Synastry — D1 व D9 ग्रह राशियाँ)'
                  : '1. Sign-to-Sign Rashi Synastry Matrix (D1 & D9 Key Signs)'}
              </h2>
              <span className="panel-subtitle">
                {lang === 'hi'
                  ? `${brideInput.name} ↔ ${groomInput.name} की राशियों का 5/9, 3/11, 6/8 व स्वामी मैत्री संबंध`
                  : `Pairwise 1/1, 5/9, 6/8 & Rashi-Lord friendship between ${brideInput.name} & ${groomInput.name}`}
              </span>
            </div>
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{lang === 'hi' ? 'आयाम (Dimension)' : 'Dimension'}</th>
                    <th>{brideInput.name}</th>
                    <th>{groomInput.name}</th>
                    <th>{lang === 'hi' ? 'राशि अक्ष व स्वामी मैत्री' : 'Axis & Lordship'}</th>
                    <th>{lang === 'hi' ? 'स्कोर' : 'Score'}</th>
                    <th>{lang === 'hi' ? 'राशि मिलान फल' : 'Synastry Insight'}</th>
                  </tr>
                </thead>
                <tbody>
                  {deepResult.signMatches.map((row) => (
                    <tr key={row.key}>
                      <td>
                        <strong>{lang === 'hi' ? row.dimensionHi : row.dimensionEn}</strong>
                      </td>
                      <td>{trSign(row.signAIndex, lang)}</td>
                      <td>{trSign(row.signBIndex, lang)}</td>
                      <td className="small-cell">
                        <div>{lang === 'hi' ? row.axisLabelHi : row.axisLabelEn}</div>
                        <div className="muted">
                          {lang === 'hi' ? row.lordshipHi : row.lordshipEn}
                        </div>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            row.status === 'Strong'
                              ? 'badge-ok'
                              : row.status === 'Balanced'
                              ? 'badge-warn'
                              : 'badge-bad'
                          }`}
                        >
                          {row.score}%
                        </span>
                      </td>
                      <td className="wrap-cell small-cell">
                        {lang === 'hi' ? row.insightHi : row.insightEn}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="panel">
            <div className="panel-header">
              <h2>
                <Compass size={16} />{' '}
                {lang === 'hi'
                  ? `2. भाव से भाव मिलान — प्रथम से द्वादश भाव (House-to-House H1–H12 · औसत ${houseAvgScore}/100)`
                  : `2. House-to-House Synastry Matrix (H1–H12 · Avg ${houseAvgScore}/100)`}
              </h2>
              <span className="panel-subtitle">
                {lang === 'hi'
                  ? 'प्रत्येक भाव की राशि, भावेश, स्थित ग्रह व परस्पर ग्रह-दृष्टि मिलान'
                  : '12-House Rashi, House Lord, Occupants & Cross-Chart Planetary Overlays'}
              </span>
            </div>
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{lang === 'hi' ? 'भाव व जीवन क्षेत्र' : 'House & Theme'}</th>
                    <th>{brideInput.name} ({lang === 'hi' ? 'राशि / भावेश / ग्रह' : 'Sign / Lord / Occ.'})</th>
                    <th>{groomInput.name} ({lang === 'hi' ? 'राशि / भावेश / ग्रह' : 'Sign / Lord / Occ.'})</th>
                    <th>{lang === 'hi' ? 'परस्पर भाव प्रभाव' : 'Cross Overlays'}</th>
                    <th>{lang === 'hi' ? 'स्कोर' : 'Score'}</th>
                    <th>{lang === 'hi' ? 'भाव मिलान विश्लेषण' : 'House-to-House Reading'}</th>
                  </tr>
                </thead>
                <tbody>
                  {deepResult.houseMatches.map((row) => (
                    <tr key={`h-${row.house}`}>
                      <td>
                        <strong>H{row.house}</strong> —{' '}
                        {lang === 'hi' ? row.themeHi : row.themeEn}
                      </td>
                      <td className="small-cell">
                        <div>
                          <strong>{trSign(row.signAIndex, lang)}</strong> ({trPlanet(row.lordA, lang)})
                        </div>
                        <div className="muted">
                          {lang === 'hi' ? 'ग्रह: ' : 'Occ: '}
                          {formatPlanets(row.occupantsA)}
                        </div>
                      </td>
                      <td className="small-cell">
                        <div>
                          <strong>{trSign(row.signBIndex, lang)}</strong> ({trPlanet(row.lordB, lang)})
                        </div>
                        <div className="muted">
                          {lang === 'hi' ? 'ग्रह: ' : 'Occ: '}
                          {formatPlanets(row.occupantsB)}
                        </div>
                      </td>
                      <td className="small-cell">
                        <div>
                          B→A: {formatPlanets(row.crossFromBInAH)}
                        </div>
                        <div className="muted">
                          A→B: {formatPlanets(row.crossFromAInBH)}
                        </div>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            row.status === 'Strong'
                              ? 'badge-ok'
                              : row.status === 'Balanced'
                              ? 'badge-warn'
                              : 'badge-bad'
                          }`}
                        >
                          {row.score}%
                        </span>
                      </td>
                      <td className="wrap-cell small-cell">
                        {lang === 'hi' ? row.readingHi : row.readingEn}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      {matchSubTab === 'porutham' && (
        <section className="panel">
          <div className="panel-header">
            <h2>
              <Sparkles size={16} />{' '}
              {lang === 'hi'
                ? 'दक्षिण भारतीय दश पोरुथम् मिलान (10-Porutham Compatibility)'
                : 'South Indian Dasa Porutham (10-Fold Star & Rashi Compatibility)'}
            </h2>
            <span className={`tag ${poruthamReport.criticalRajjuPass ? 'tag-varg' : 'tag-combust'}`}>
              {poruthamReport.totalScore} / {poruthamReport.maxScore} ·{' '}
              {poruthamReport.criticalRajjuPass
                ? lang === 'hi'
                  ? 'रज्जु शुभ (PASS)'
                  : 'Rajju PASS'
                : lang === 'hi'
                  ? 'रज्जु दोष सावधानी'
                  : 'Rajju Caution'}
            </span>
          </div>

          <div className="pred-card-body">
            <div className="gochar-banner is-info" style={{ marginBottom: 12 }}>
              <strong>{lang === 'hi' ? poruthamReport.verdictHi : poruthamReport.verdictEn}</strong>
            </div>

            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{lang === 'hi' ? 'पोरुथम्' : 'Porutham'}</th>
                    <th>{lang === 'hi' ? 'वधू (Bride)' : 'Bride'}</th>
                    <th>{lang === 'hi' ? 'वर (Groom)' : 'Groom'}</th>
                    <th>{lang === 'hi' ? 'स्थिति' : 'Status'}</th>
                    <th>{lang === 'hi' ? 'विवरण' : 'Inference'}</th>
                  </tr>
                </thead>
                <tbody>
                  {poruthamReport.items.map((item) => (
                    <tr key={item.key}>
                      <td><strong>{lang === 'hi' ? item.nameHi : item.nameEn}</strong></td>
                      <td>{item.brideVal}</td>
                      <td>{item.groomVal}</td>
                      <td>
                        <span className={`badge ${item.passed ? 'badge-ok' : 'badge-bad'}`}>
                          {item.status} ({item.score})
                        </span>
                      </td>
                      <td className="wrap-cell small-cell">{lang === 'hi' ? item.noteHi : item.noteEn}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
        </>
      )}
    </div>
  );
};
