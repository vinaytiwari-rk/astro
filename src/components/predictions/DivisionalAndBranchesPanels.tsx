import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Award,
  BookOpen,
  Clock,
  Compass,
  Flame,
  Gem,
  Grid3x3,
  HelpCircle,
  Layers,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Star,
} from 'lucide-react';
import { computeLiveKpRulingPlanets, type KpRulingPlanets } from '../../astro/kp';
import { computeFullLalKitabReport } from '../../astro/lalKitabExtended';
import type { PredictionReport } from '../../astro/predictions/types';
import { computeGemstoneAndRudraksha } from '../../astro/rashifalBabyRudraksha';
import { formatDateDmy } from '../../astro/time';
import type { ChartData, ChartStyle, DivisionalChartId } from '../../astro/types';
import { trBadge } from '../../i18n/hindiPredictions';
import { useLanguage } from '../../i18n/LanguageContext';
import { trPlanet, trPlanetShort, trSign, trVarga } from '../../i18n/translations';
import { SpecializedAstrologyView } from '../SpecializedAstrologyView';
import { VedicChartSvg } from '../VedicChartSvg';
import { NumerologyPanel } from './NumerologyPanel';

export const DivisionalPredictionsPanel: React.FC<{
  chart: ChartData;
  chartStyle: ChartStyle;
  report: PredictionReport;
}> = ({ chart, chartStyle, report }) => {
  const { lang, t } = useLanguage();
  const isHi = lang === 'hi';
  const [selectedVargaPred, setSelectedVargaPred] = useState<DivisionalChartId>('D9');

  const focusChart = chart.divisionalCharts[selectedVargaPred];
  const focusMeta = trVarga(focusChart.id, focusChart.name, focusChart.signification, lang);
  const focusPred =
    report.divisionalPredictions.find((d) => d.vargaId === selectedVargaPred) ??
    report.divisionalPredictions[0];

  return (
    <div className="view-stack">
      <div className="varga-focus-grid">
        <VedicChartSvg
          title={`${focusMeta.name} (${focusChart.id})`}
          subtitle={focusMeta.sig}
          style={chartStyle}
          lagnaSignIndex={focusChart.lagnaSignIndex}
          centerLabel={focusChart.id}
          items={focusChart.placements.map((p) => ({
            id: p.id,
            label: trPlanetShort(p.id, lang),
            signIndex: p.signIndex,
            isLagna: p.id === 'Asc',
            isRetrograde: p.isRetrograde,
            dignity: p.dignity,
          }))}
        />

        <section className="panel">
          <div className="panel-header">
            <h3>
              {focusPred.vargaId} {focusPred.name} — {focusPred.domain}
            </h3>
            <span className="tag tag-karaka">{t.common.lagna}: {focusPred.lagnaSign}</span>
          </div>
          <div className="pred-card-body">
            <p className="lead-text">{focusPred.prediction}</p>
            <div className="pred-bullets">
              <div>
                <strong>
                  {isHi ? `वर्ग प्रमुख ग्रह (${focusPred.keyLord}):` : `Key Divisional Lord (${focusPred.keyLord}):`}
                </strong>{' '}
                {focusPred.keyLordStatus}
              </div>
              <div>
                <strong>{isHi ? 'वर्ग मुख्य बिंदु:' : 'Divisional Highlights:'}</strong>{' '}
                {focusPred.occupantsHighlight}
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="panel">
        <div className="panel-header">
          <h3>
            {isHi
              ? 'सभी वर्ग कुंडली फलादेश D2–D60 (कुंडली देखने हेतु किसी कार्ड पर क्लिक करें)'
              : 'All Divisional Chart Predictions (D2–D60 — Click any card to view SVG chart)'}
          </h3>
        </div>
        <div className="placement-cards">
          {report.divisionalPredictions.map((vp) => (
            <article
              key={vp.vargaId}
              className={`placement-card ${vp.vargaId === selectedVargaPred ? 'is-selected-card' : ''}`}
              style={{ cursor: 'pointer' }}
              onClick={() => setSelectedVargaPred(vp.vargaId)}
            >
              <div className="placement-card-top">
                <div>
                  <strong>
                    {vp.vargaId} · {vp.name} ({vp.domain})
                  </strong>
                  <div className="muted small-text">
                    {t.common.lagna}: {vp.lagnaSign} · {isHi ? 'स्वामी' : 'Lord'} {vp.keyLord}:{' '}
                    {vp.keyLordStatus}
                  </div>
                </div>
                <span className="tag tag-karaka">{vp.vargaId}</span>
              </div>
              <p className="yoga-desc">{vp.prediction}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

type BranchMode =
  | 'numerology'
  | 'life_branches'
  | 'kp'
  | 'lal_kitab'
  | 'varshaphala_jaimini'
  | 'doshas_remedies';

export const BranchesAndNumerologyPanel: React.FC<{
  chart: ChartData;
  chartStyle: ChartStyle;
  report: PredictionReport;
  requestedMode?: { id?: string; nonce: number };
}> = ({ chart, chartStyle, report, requestedMode }) => {
  const { lang, t } = useLanguage();
  const isHi = lang === 'hi';
  const [branchMode, setBranchMode] = useState<BranchMode>('numerology');

  useEffect(() => {
    const id = requestedMode?.id;
    if (
      id === 'numerology' ||
      id === 'life_branches' ||
      id === 'kp' ||
      id === 'lal_kitab' ||
      id === 'varshaphala_jaimini' ||
      id === 'doshas_remedies'
    ) {
      setBranchMode(id);
    }
  }, [requestedMode?.nonce, requestedMode?.id]);
  const [liveRp, setLiveRp] = useState<KpRulingPlanets | null>(null);
  const [lkVarshaYear, setLkVarshaYear] = useState<number>(() => new Date().getFullYear());

  const lkFullReport = useMemo(
    () => computeFullLalKitabReport(chart, lkVarshaYear),
    [chart, lkVarshaYear]
  );
  const gemReport = useMemo(() => computeGemstoneAndRudraksha(chart), [chart]);
  const displayedRp = liveRp ?? report.kpReport.chartRulingPlanets;

  const handleRefreshLiveRp = () => {
    setLiveRp(
      computeLiveKpRulingPlanets(
        Date.now(),
        chart.offsetMinutesUsed,
        chart.input.latitude,
        chart.input.longitude
      )
    );
  };

  return (
    <div className="view-stack">
      <div className="branch-grid-bar" role="tablist" aria-label="Astrology Branch Sections">
        <button
          type="button"
          className={`branch-grid-btn ${branchMode === 'numerology' ? 'is-active' : ''}`}
          onClick={() => setBranchMode('numerology')}
        >
          <Grid3x3 size={14} />
          <span>{isHi ? 'अंक ज्योतिष व लो शु' : 'Numerology & Lo Shu'}</span>
        </button>
        <button
          type="button"
          className={`branch-grid-btn ${branchMode === 'life_branches' ? 'is-active' : ''}`}
          onClick={() => setBranchMode('life_branches')}
        >
          <Compass size={14} />
          <span>{isHi ? 'जीवन शाखाएँ (वित्त/रोग)' : 'Vedic Life Branches'}</span>
        </button>
        <button
          type="button"
          className={`branch-grid-btn ${branchMode === 'kp' ? 'is-active' : ''}`}
          onClick={() => setBranchMode('kp')}
        >
          <Star size={14} />
          <span>{isHi ? 'KP व रूलिंग प्लैनेट्स' : 'KP & Ruling Planets'}</span>
        </button>
        <button
          type="button"
          className={`branch-grid-btn ${branchMode === 'lal_kitab' ? 'is-active' : ''}`}
          onClick={() => setBranchMode('lal_kitab')}
        >
          <Flame size={14} />
          <span>{isHi ? 'लाल किताब (टेवा/उपाय)' : 'Lal Kitab System'}</span>
        </button>
        <button
          type="button"
          className={`branch-grid-btn ${branchMode === 'varshaphala_jaimini' ? 'is-active' : ''}`}
          onClick={() => setBranchMode('varshaphala_jaimini')}
        >
          <Layers size={14} />
          <span>{isHi ? 'वर्षफल व जैमिनी' : 'Varshaphala & Jaimini'}</span>
        </button>
        <button
          type="button"
          className={`branch-grid-btn ${branchMode === 'doshas_remedies' ? 'is-active' : ''}`}
          onClick={() => setBranchMode('doshas_remedies')}
        >
          <ShieldCheck size={14} />
          <span>
            {isHi
              ? `दोष (${report.kundaliDoshas.presentCount}), उपाय व रत्न`
              : `Doshas (${report.kundaliDoshas.presentCount}) & Remedies`}
          </span>
        </button>
      </div>

      {/* 1. NUMEROLOGY & LO SHU GRID */}
      {branchMode === 'numerology' && <NumerologyPanel chart={chart} />}

      {/* 2. SPECIALIZED VEDIC LIFE BRANCHES */}
      {branchMode === 'life_branches' && (
        <SpecializedAstrologyView chart={chart} chartStyle={chartStyle} />
      )}

      {/* 3. KP SYSTEM */}
      {branchMode === 'kp' && (
        <>
          <section className="panel">
            <div className="panel-header">
              <h3>
                <Star size={15} />{' '}
                {isHi
                  ? `के.पी. (KP) भाव उप-स्वामी फलादेश (${report.kpReport.kpAyanamsaDms})`
                  : `KP Cuspal Sub-Lord Event Predictions (KP Ayanamsa ${report.kpReport.kpAyanamsaDms})`}
              </h3>
            </div>
            <div className="domains-grid">
              {report.kpReport.events.map((ev) => (
                <article key={ev.topic} className="domain-card">
                  <div className="domain-top">
                    <div>
                      <h4>{ev.topic}</h4>
                      <div className="muted small-text">
                        {isHi ? `भाव ${ev.cusp} उप-स्वामी:` : `Cusp ${ev.cusp} Sub-Lord:`}{' '}
                        <strong>{trPlanet(ev.cuspalSubLord, lang)}</strong>
                      </div>
                    </div>
                    <span
                      className={`tag ${
                        ev.verdict === 'Strong Promise'
                          ? 'tag-varg'
                          : ev.verdict === 'Moderate Promise'
                            ? 'tag-karaka'
                            : 'tag-retro'
                      }`}
                    >
                      {trBadge(ev.verdict, lang)}
                    </span>
                  </div>
                  <p className="domain-summary">{ev.reading}</p>
                </article>
              ))}
            </div>
          </section>

          <div className="pred-top-grid">
            <section className="panel">
              <div className="panel-header">
                <h3>{isHi ? 'KP रूलिंग प्लैनेट्स (शासक ग्रह)' : 'KP Ruling Planets (Natal & Live RP)'}</h3>
                <div className="toolbar-group">
                  <button type="button" className="btn btn-sm" onClick={handleRefreshLiveRp}>
                    <RefreshCw size={13} /> {isHi ? 'वर्तमान RP निकालें' : 'Live RP Now'}
                  </button>
                  {liveRp && (
                    <button type="button" className="btn btn-sm" onClick={() => setLiveRp(null)}>
                      {isHi ? 'जन्म RP' : 'Chart RP'}
                    </button>
                  )}
                </div>
              </div>
              <div className="two-col-split-pad">
                <p className="muted small-text">{displayedRp.timestampLocal}</p>
                <div className="rp-chip-row">
                  {displayedRp.rulingPlanets.map((rp) => (
                    <span key={rp} className="tag tag-karaka">{trPlanet(rp, lang)}</span>
                  ))}
                </div>
                <table className="data-table">
                  <tbody>
                    <tr>
                      <td>{isHi ? 'लग्न नक्षत्र / राशि / उप' : 'Lagna Star / Sign / Sub'}</td>
                      <td>
                        <strong>
                          {trPlanetShort(displayedRp.lagnaStarLord, lang)} /{' '}
                          {trPlanetShort(displayedRp.lagnaSignLord, lang)} /{' '}
                          {trPlanetShort(displayedRp.lagnaSubLord, lang)}
                        </strong>
                      </td>
                    </tr>
                    <tr>
                      <td>{isHi ? 'चंद्र नक्षत्र / राशि / उप' : 'Moon Star / Sign / Sub'}</td>
                      <td>
                        <strong>
                          {trPlanetShort(displayedRp.moonStarLord, lang)} /{' '}
                          {trPlanetShort(displayedRp.moonSignLord, lang)} /{' '}
                          {trPlanetShort(displayedRp.moonSubLord, lang)}
                        </strong>
                      </td>
                    </tr>
                    <tr>
                      <td>{isHi ? 'वार स्वामी (Day Lord)' : 'Day Lord'}</td>
                      <td><strong>{trPlanet(displayedRp.dayLord, lang)}</strong></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="panel">
              <div className="panel-header">
                <h3>{isHi ? 'KP नक्षत्र नाड़ी व 4-स्तरीय सूचक' : 'KP Nakshatra Nadi & Planet Links'}</h3>
              </div>
              <div className="table-scroll">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>{t.common.planet}</th>
                      <th>{isHi ? 'नक्षत्रेश' : 'Star Lord'}</th>
                      <th>{isHi ? 'उप-स्वामी' : 'Sub-Lord'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.kpReport.nakshatraNadi.map((n) => (
                      <tr key={n.planet}>
                        <td>
                          <strong>{trPlanetShort(n.planet, lang)}</strong>{' '}
                          <span className="mono muted">[{n.planetHouses.join(',')}]</span>
                        </td>
                        <td>
                          {trPlanetShort(n.starLord, lang)}{' '}
                          <span className="mono muted">[{n.starLordHouses.join(',')}]</span>
                        </td>
                        <td>
                          <span className="tag tag-karaka">{trPlanetShort(n.subLord, lang)}</span>{' '}
                          <span className="mono">[{n.subLordHouses.join(',')}]</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {report.kpFourStepReport && (
            <div className="view-stack" style={{ marginTop: 12 }}>
              <section className="panel">
                <div className="panel-header">
                  <div>
                    <h3>
                      <Award size={15} />{' '}
                      {isHi
                        ? 'के.पी. 4-चरणीय सिद्धांत (4-Step Event Fructification Theory)'
                        : 'KP 4-Step Event Fructification Theory'}
                    </h3>
                    <p className="muted small-text">
                      {isHi
                        ? 'ग्रह (चरण 1) → नक्षत्रेश (चरण 2) → उप-स्वामी (चरण 3) → उप के नक्षत्रेश (चरण 4) द्वारा सूक्ष्म घटना समय व फल सिद्धि।'
                        : 'Planet (Step 1) → Star Lord (Step 2) → Sub Lord (Step 3) → Star Lord of Sub (Step 4) event fructification.'}
                    </p>
                  </div>
                  <span className="tag tag-varg">
                    {isHi
                      ? `दशा स्वामी: ${report.kpFourStepReport.activeDashaEvaluation.dashaLord}`
                      : `Active Dasha: ${report.kpFourStepReport.activeDashaEvaluation.dashaLord}`}
                  </span>
                </div>

                <div className="gochar-banner is-info">
                  <strong>{isHi ? 'दशा फल संकेत:' : 'Active Dasha Verdict:'}</strong>{' '}
                  {isHi
                    ? report.kpFourStepReport.activeDashaEvaluation.verdictHi
                    : report.kpFourStepReport.activeDashaEvaluation.verdictEn}
                </div>

                <div className="panel-subblock">
                  <h4>
                    {isHi
                      ? 'प्रमुख 8 जीवन घटनाओं की फल सिद्धि संभावना (Event Fructification Audit):'
                      : '8 Core Life Events Fructification Audit (4-Step Sub-Lord Verdicts):'}
                  </h4>
                  <div className="domains-grid">
                    {report.kpFourStepReport.eventPromises.map((ev) => (
                      <article key={ev.relevantCusp} className="domain-card">
                        <div className="domain-top">
                          <div>
                            <h4>{isHi ? ev.eventNameHi : ev.eventNameEn}</h4>
                            <div className="muted small-text">
                              {isHi ? `भाव ${ev.relevantCusp} उप-स्वामी:` : `Cusp ${ev.relevantCusp} Sub Lord:`}{' '}
                              <strong>{trPlanet(ev.cuspSubLord, lang)}</strong>
                            </div>
                          </div>
                          <span
                            className={`tag ${
                              ev.fructificationPromise === 'Highly Favorable'
                                ? 'tag-varg'
                                : ev.fructificationPromise === 'Favorable / Supported'
                                  ? 'tag-karaka'
                                  : ev.fructificationPromise === 'Delayed / Challenging'
                                    ? 'tag-retro'
                                    : 'tag-combust'
                            }`}
                          >
                            {isHi ? ev.fructificationPromiseHi : ev.fructificationPromise}
                          </span>
                        </div>
                        <div className="pred-bullets" style={{ marginTop: 6 }}>
                          <div>
                            <strong>{isHi ? 'मुख्य भाव:' : 'Primary Houses:'}</strong>{' '}
                            <span className="mono">[{ev.primaryHouses.join(', ')}]</span> ·{' '}
                            <strong>{isHi ? 'सहयोगी:' : 'Support:'}</strong>{' '}
                            <span className="mono">[{ev.supportingHouses.join(', ')}]</span> ·{' '}
                            <strong>{isHi ? 'बाधक:' : 'Negate:'}</strong>{' '}
                            <span className="mono">[{ev.negatingHouses.join(', ')}]</span>
                          </div>
                          <p className="lead-text" style={{ fontSize: '0.85rem' }}>
                            {isHi ? ev.analysisHi : ev.analysisEn}
                          </p>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>

                <div className="panel-subblock">
                  <h4>
                    {isHi
                      ? 'समस्त 9 ग्रहों की 4-चरणीय संयुक्त कारकता सारणी (4-Step Significators Table):'
                      : 'All 9 Grahas 4-Step Composite Significators Table:'}
                  </h4>
                  <div className="table-scroll">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>{t.common.planet}</th>
                          <th>{isHi ? 'चरण 1 (ग्रह)' : 'Step 1 (Planet)'}</th>
                          <th>{isHi ? 'चरण 2 (नक्षत्रेश)' : 'Step 2 (Star Lord)'}</th>
                          <th>{isHi ? 'चरण 3 (उप-स्वामी)' : 'Step 3 (Sub Lord)'}</th>
                          <th>{isHi ? 'चरण 4 (उप नक्षत्रेश)' : 'Step 4 (Sub Star)'}</th>
                          <th>{isHi ? 'संयुक्त भाव' : 'Composite Houses'}</th>
                          <th>{isHi ? 'कारकता स्थिति' : 'Significator Status'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {report.kpFourStepReport.planetSignifications.map((row) => (
                          <tr key={row.planet}>
                            <td>
                              <strong>{trPlanetShort(row.planet, lang)}</strong>
                            </td>
                            <td>
                              {t.common.house}{row.step1Planet.residingHouse}{' '}
                              <span className="mono muted">
                                {row.step1Planet.ownedHouses.length > 0
                                  ? `(स्वा: ${row.step1Planet.ownedHouses.join(',')})`
                                  : ''}
                              </span>
                            </td>
                            <td>
                              {trPlanetShort(row.step2StarLord.starLord, lang)}{' '}
                              <span className="mono">H{row.step2StarLord.residingHouse}</span>{' '}
                              <span className="mono muted">[{row.step2StarLord.ownedHouses.join(',')}]</span>
                            </td>
                            <td>
                              <span className="tag tag-karaka">
                                {trPlanetShort(row.step3SubLord.subLord, lang)}
                              </span>{' '}
                              <span className="mono">H{row.step3SubLord.residingHouse}</span>
                            </td>
                            <td>
                              {trPlanetShort(row.step4SubStarLord.subStarLord, lang)}{' '}
                              <span className="mono">H{row.step4SubStarLord.residingHouse}</span>
                            </td>
                            <td>
                              <strong className="mono">[{row.compositeSignifications.join(', ')}]</strong>
                            </td>
                            <td>
                              <span className={`tag ${row.isStrongSignificator ? 'tag-varg' : 'tag-retro'}`}>
                                {row.isStrongSignificator
                                  ? isHi ? 'प्रबल सूचक (Strong)' : 'Strong'
                                  : isHi ? 'गौण सूचक (Secondary)' : 'Secondary'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            </div>
          )}
        </>
      )}

      {/* 4. LAL KITAB SYSTEM */}
      {branchMode === 'lal_kitab' && (
        <section className="panel">
          <div className="panel-header">
            <h3>
              {isHi
                ? 'संपूर्ण लाल किताब सिस्टम (टेवा, सोये ग्रह, वर्षफल व 35-Yr दशा)'
                : 'Lal Kitab Branch (Teva, Varshaphal Chart, Sleeping Planets & Remedies)'}
            </h3>
            <div className="toolbar-group">
              <input
                type="number"
                className="input-sm mono"
                style={{ width: 84 }}
                value={lkVarshaYear}
                min={1920}
                max={2120}
                onChange={(e) => {
                  const v = parseInt(e.target.value, 10);
                  if (!Number.isNaN(v)) setLkVarshaYear(v);
                }}
              />
              <span className="tag tag-karaka">
                {isHi ? `आयु ${lkFullReport.targetAge}` : `Age ${lkFullReport.targetAge}`}
              </span>
            </div>
          </div>

          <div className="two-col-split-pad">
            <div className="gochar-highlights">
              <div className={`gochar-banner ${lkFullReport.tevaTypeEn.includes('Andha') ? 'is-alert' : 'is-clear'}`}>
                <strong>{isHi ? lkFullReport.tevaTypeHi : lkFullReport.tevaTypeEn}:</strong>{' '}
                {isHi ? lkFullReport.tevaReasonHi : lkFullReport.tevaReasonEn}
              </div>
              <div className={`gochar-banner ${lkFullReport.sleepingPlanets.length ? 'is-alert' : 'is-clear'}`}>
                <strong>{isHi ? 'सोये हुए ग्रह:' : 'Sleeping Planets:'}</strong>{' '}
                {lkFullReport.sleepingPlanets.length
                  ? lkFullReport.sleepingPlanets.map((pl) => trPlanet(pl, lang)).join(', ')
                  : isHi ? 'सभी ग्रह जागृत हैं।' : 'All 9 grahas are awake.'}
              </div>
              {report.lalKitabReport.rins.map((rin, i) => (
                <div key={i} className="gochar-banner is-alert">
                  <strong>{rin.name}:</strong> {rin.meaning}{' '}
                  <strong>{isHi ? 'उपाय:' : 'Upay:'}</strong> {rin.remedy}
                </div>
              ))}
            </div>

            <div className="dual-chart-grid">
              <VedicChartSvg
                title={isHi ? 'जन्म लाल किताब (मेष = प्रथम भाव)' : 'Natal Lal Kitab (Aries = H1)'}
                style={chartStyle}
                lagnaSignIndex={0}
                centerLabel="LK NATAL"
                items={[
                  { id: 'Asc', label: trPlanetShort('Asc', lang), signIndex: 0, isLagna: true },
                  ...lkFullReport.planets.map((lp) => ({
                    id: lp.planet,
                    label: trPlanetShort(lp.planet, lang),
                    signIndex: lp.natalHouse - 1,
                  })),
                ]}
              />
              <VedicChartSvg
                title={
                  isHi
                    ? `लाल किताब वर्षफल (${lkFullReport.targetYear})`
                    : `Lal Kitab Varshaphal (${lkFullReport.targetYear})`
                }
                style={chartStyle}
                lagnaSignIndex={0}
                centerLabel={`LK ${lkFullReport.targetYear}`}
                items={[
                  { id: 'Asc', label: trPlanetShort('Asc', lang), signIndex: 0, isLagna: true },
                  ...lkFullReport.planets.map((lp) => ({
                    id: lp.planet,
                    label: trPlanetShort(lp.planet, lang),
                    signIndex: lp.varshaHouse - 1,
                  })),
                ]}
              />
            </div>
          </div>

          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t.common.planet}</th>
                  <th>{isHi ? 'जन्म' : 'Natal'}</th>
                  <th>{isHi ? 'वर्षफल' : 'Varsha'}</th>
                  <th>{isHi ? 'पक्का' : 'Pakka'}</th>
                  <th>{t.common.status}</th>
                  <th>{isHi ? 'लाल किताब उपाय' : 'Upay / Totka'}</th>
                </tr>
              </thead>
              <tbody>
                {lkFullReport.planets.map((row) => (
                  <tr key={row.planet}>
                    <td><strong>{trPlanet(row.planet, lang)}</strong></td>
                    <td className="mono">{t.common.house}{row.natalHouse}</td>
                    <td className="mono">{t.common.house}{row.varshaHouse}</td>
                    <td className="mono">{t.common.house}{row.pakkaGhar}</td>
                    <td>
                      <span className={`tag ${row.isSleeping ? 'tag-retro' : row.statusEn.includes('Debilitated') ? 'tag-combust' : 'tag-varg'}`}>
                        {isHi ? row.statusHi : row.statusEn}
                      </span>
                    </td>
                    <td className="wrap-cell">{isHi ? row.remedyHi : row.remedyEn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {report.lalKitabSystemReport && (
            <div className="view-stack" style={{ marginTop: 14 }}>
              <div className={`gochar-banner ${report.lalKitabSystemReport.isDharmiTeva ? 'is-clear' : 'is-info'}`}>
                <strong>{isHi ? 'लाल किताब तेवा स्वरूप:' : 'Lal Kitab Teva Status:'}</strong>{' '}
                {isHi ? report.lalKitabSystemReport.dharmiTevaNoteHi : report.lalKitabSystemReport.dharmiTevaNoteEn}
              </div>

              <div className="panel-subblock">
                <h4>
                  {isHi
                    ? 'लाल किताब 6 प्राचीन कर्मिक ऋण (Karmic Debts / Rin Audit):'
                    : 'Lal Kitab 6 Ancient Karmic Debts (Rin) Audit:'}
                </h4>
                <div className="domains-grid">
                  {report.lalKitabSystemReport.karmicDebts.map((deb) => (
                    <article key={deb.debtType} className="domain-card" style={{ borderLeft: deb.isTriggered ? '4px solid #ef4444' : '3px solid var(--border)' }}>
                      <div className="domain-top">
                        <h4>{isHi ? deb.debtTypeHi : deb.debtType}</h4>
                        <span className={`tag ${deb.isTriggered ? 'tag-combust' : 'tag-varg'}`}>
                          {deb.isTriggered ? (isHi ? 'सक्रिय ऋण (Active)' : 'Active Debt') : (isHi ? 'दोष मुक्त (Clear)' : 'Clear')}
                        </span>
                      </div>
                      <div className="pred-bullets" style={{ marginTop: 6 }}>
                        <div>
                          <strong>{isHi ? 'पौराणिक/कर्मिक कारण:' : 'Classical Ancestral Cause:'}</strong>{' '}
                          <span className="muted">{isHi ? deb.classicalCauseHi : deb.classicalCauseEn}</span>
                        </div>
                        <div>
                          <strong>{isHi ? 'शास्त्रोक्त अचूक उपाय:' : 'Authentic Remedial Protocol:'}</strong>{' '}
                          <span style={{ color: deb.isTriggered ? 'var(--accent)' : undefined }}>
                            {isHi ? deb.remedialProtocolHi : deb.remedialProtocolEn}
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              <div className="panel-subblock">
                <h4>
                  {isHi
                    ? '12 पक्के घर एवं सोये हुए भावों को जगाने के नियम (Awakening Dormant Houses):'
                    : '12 Pakka Ghars & Awakening Rules for Dormant Houses:'}
                </h4>
                <div className="table-scroll">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>{t.common.house}</th>
                        <th>{isHi ? 'पक्का स्वामी (Pakka Ruler)' : 'Pakka Ruler'}</th>
                        <th>{isHi ? 'भाव स्थिति' : 'House State'}</th>
                        <th>{isHi ? 'स्थित ग्रह' : 'Occupants'}</th>
                        <th>{isHi ? 'जगाने की विधि व उपाय' : 'Awakening Protocol'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.lalKitabSystemReport.sleepingHouses.map((sh) => (
                        <tr key={sh.houseNumber}>
                          <td className="mono"><strong>{t.common.house}{sh.houseNumber}</strong></td>
                          <td>{isHi ? sh.pakkaGharRulerHi : sh.pakkaGharRuler}</td>
                          <td>
                            <span className={`tag ${sh.isSleeping ? 'tag-retro' : 'tag-varg'}`}>
                              {sh.isSleeping ? (isHi ? 'सोया हुआ (Dormant)' : 'Dormant') : (isHi ? 'जागृत (Awake)' : 'Awake')}
                            </span>
                          </td>
                          <td>
                            {sh.occupants.length > 0 ? (
                              sh.occupants.map((o) => trPlanetShort(o, lang)).join(', ')
                            ) : (
                              <span className="muted">—</span>
                            )}
                          </td>
                          <td className="wrap-cell">{isHi ? sh.awakeningMethodHi : sh.awakeningMethodEn}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* 5. TAJIKA VARSHAPHALA & JAIMINI SUTRAS */}
      {branchMode === 'varshaphala_jaimini' && (
        <div className="view-stack">
          <div className="varga-focus-grid">
            <VedicChartSvg
              title={
                isHi
                  ? `वर्षफल ${report.varshaphala.year} (आयु ${report.varshaphala.completedYears})`
                  : `Varshaphala ${report.varshaphala.year} (Age ${report.varshaphala.completedYears})`
              }
              subtitle={`${formatDateDmy(report.varshaphala.varshaPraveshLocal)}`}
              style={chartStyle}
              lagnaSignIndex={report.varshaphala.varshaChart.ascendant.signIndex}
              centerLabel={`VARSHA ${report.varshaphala.year}`}
              items={[
                { id: 'Asc', label: trPlanetShort('Asc', lang), signIndex: report.varshaphala.varshaChart.ascendant.signIndex, isLagna: true },
                { id: 'Muntha', label: trPlanetShort('Muntha', lang), signIndex: report.varshaphala.munthaSignIndex },
                ...report.varshaphala.varshaChart.planets.map((p) => ({
                  id: p.id,
                  label: trPlanetShort(p.id, lang),
                  signIndex: p.signIndex,
                  isRetrograde: p.isRetrograde,
                  dignity: p.dignity,
                })),
              ]}
            />
            <section className="panel">
              <div className="panel-header">
                <h3>{isHi ? 'ताजिक वर्षफल एवं पंचाधिकारी' : 'Tajika Annual Reading & Panchadhikari'}</h3>
                <span className="tag tag-varg">{trPlanet(report.varshaphala.varshesh, lang)}</span>
              </div>
              <div className="pred-card-body">
                <p className="lead-text">{report.varshaphala.annualSummary}</p>
                <p>{report.varshaphala.varsheshStrengthNote}</p>
                <p><strong>Jaimini Karakamsha:</strong> {report.jaiminiReport.karakamshaReading}</p>
              </div>
            </section>
          </div>

          <section className="panel">
            <div className="panel-header">
              <h3>{isHi ? 'षोडश ताजिक सहम (16 Tajika Sahams)' : '16 Tajika Sahams'}</h3>
            </div>
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{isHi ? 'सहम' : 'Saham'}</th>
                    <th>{t.common.sign}</th>
                    <th>{t.common.degree}</th>
                    <th>{t.common.house}</th>
                    <th>{isHi ? 'स्वामी' : 'Lord'}</th>
                  </tr>
                </thead>
                <tbody>
                  {report.varshaphala.sahams.map((s) => (
                    <tr key={s.nameEn}>
                      <td><strong>{isHi ? s.nameHi : s.nameEn}</strong></td>
                      <td>{trSign(s.signIndex, lang)}</td>
                      <td className="mono">{s.dms}</td>
                      <td className="mono">{t.common.house}{s.house}</td>
                      <td>{trPlanetShort(s.lord, lang)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* BHRIGU SARAL PADDHATI (BSP) */}
          {report.bhriguSaralPaddhati && (
            <section className="panel" style={{ marginTop: 14 }}>
              <div className="panel-header">
                <div>
                  <h3>
                    <Clock size={15} />{' '}
                    {isHi
                      ? `भृगु सरल पद्धति (BSP — आयु चक्र व विशिष्ट सक्रिय बिंदु)`
                      : `Bhrigu Saral Paddhati (BSP — Age Triggers & House Cycles)`}
                  </h3>
                  <p className="muted small-text">
                    {isHi
                      ? `वर्तमान आयु ${report.bhriguSaralPaddhati.currentAge} वर्ष पर महर्षि भृगु के 29 अचूक फलित सूत्र।`
                      : `Sage Bhrigu's 29 Canonical Predictive Rules for running age ${report.bhriguSaralPaddhati.currentAge}.`}
                  </p>
                </div>
                <span className="tag tag-varg">
                  {isHi
                    ? `12-वर्षीय चक्र: भाव ${report.bhriguSaralPaddhati.cyclical12YearReading.cyclicalHouse}`
                    : `Cycle House: H${report.bhriguSaralPaddhati.cyclical12YearReading.cyclicalHouse}`}
                </span>
              </div>

              <div className="gochar-banner is-info">
                <strong>{isHi ? '12-वर्षीय चक्रीय फल:' : '12-Year Cyclical Reading:'}</strong>{' '}
                {isHi
                  ? report.bhriguSaralPaddhati.cyclical12YearReading.synthesisHi
                  : report.bhriguSaralPaddhati.cyclical12YearReading.synthesisEn}
              </div>

              <div className="panel-subblock">
                <h4>
                  {isHi
                    ? 'वर्तमान व निकटवर्ती आयु में सक्रिय भृगु बिंदु (Active Age Triggers):'
                    : 'Active Age Triggers for Current Life Phase:'}
                </h4>
                <div className="domains-grid">
                  {report.bhriguSaralPaddhati.activeSpecificTriggers.map((trig) => (
                    <article key={`${trig.age}-${trig.ruleCode}`} className="domain-card">
                      <div className="domain-top">
                        <div>
                          <h4>{trig.ruleCode} · {isHi ? trig.triggerThemeHi : trig.triggerThemeEn}</h4>
                          <div className="muted small-text">
                            {isHi ? `आयु: ${trig.age} वर्ष` : `Running Age: ${trig.age} Yrs`} ·{' '}
                            {isHi ? `भाव ${trig.triggeredHouse} (${trig.triggeredSignName})` : `House ${trig.triggeredHouse} (${trig.triggeredSignName})`}
                          </div>
                        </div>
                        <span className="tag tag-karaka">
                          {trPlanet(trig.sourcePlanet, lang)} + {trig.offsetHouse}H
                        </span>
                      </div>
                      <p className="lead-text" style={{ fontSize: '0.86rem', marginTop: 6 }}>
                        {isHi ? trig.readingHi : trig.readingEn}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* BHAVARTHA RATNAKARA LAGNA RULES */}
          {report.bhavarthaRatnakaraReport && (
            <section className="panel" style={{ marginTop: 14 }}>
              <div className="panel-header">
                <div>
                  <h3>
                    <BookOpen size={15} />{' '}
                    {isHi
                      ? `भावार्थ रत्नाकर — ${report.bhavarthaRatnakaraReport.lagnaNameHi} लग्न विशेष फलित सूत्र`
                      : `Bhavartha Ratnakara — ${report.bhavarthaRatnakaraReport.lagnaNameEn} Ascendant Rules`}
                  </h3>
                  <p className="muted small-text">
                    {isHi
                      ? `परम योगकारक: ${report.bhavarthaRatnakaraReport.primaryYogakaraka} · मुख्य धनकारक: ${report.bhavarthaRatnakaraReport.primaryDhanaKaraka} · बाधक/मारक: ${report.bhavarthaRatnakaraReport.functionalMalefics.join(', ')}`
                      : `Primary Yogakaraka: ${report.bhavarthaRatnakaraReport.primaryYogakaraka} · Wealth Karaka: ${report.bhavarthaRatnakaraReport.primaryDhanaKaraka} · Functional Malefics: ${report.bhavarthaRatnakaraReport.functionalMalefics.join(', ')}`}
                  </p>
                </div>
                <span className="tag tag-varg">
                  {isHi
                    ? `${report.bhavarthaRatnakaraReport.triggeredCount} सूत्र सक्रिय`
                    : `${report.bhavarthaRatnakaraReport.triggeredCount} Rules Active`}
                </span>
              </div>

              <div className="domains-grid">
                {report.bhavarthaRatnakaraReport.rulesEvaluated.map((br) => (
                  <article
                    key={br.ruleCode}
                    className="domain-card"
                    style={{
                      borderLeft: br.isTriggered ? '4px solid var(--accent)' : '3px solid var(--border)',
                      background: br.isTriggered ? 'rgba(217, 119, 6, 0.04)' : undefined,
                    }}
                  >
                    <div className="domain-top">
                      <div>
                        <h4>{br.ruleCode}</h4>
                        <div className="muted small-text">
                          {br.targetPlanets.map((p) => trPlanet(p, lang)).join(' + ')}
                        </div>
                      </div>
                      <span className={`tag ${br.isTriggered ? 'tag-varg' : 'tag-retro'}`}>
                        {br.isTriggered ? (isHi ? 'कुंडली में घटित (Formed)' : 'Formed') : (isHi ? 'अघटित' : 'Inactive')}
                      </span>
                    </div>
                    <div className="pred-bullets" style={{ marginTop: 6 }}>
                      <div>
                        <strong>{isHi ? 'शास्त्रीय सूत्र:' : 'Classical Sutra:'}</strong>{' '}
                        <span>{isHi ? br.classicalSutraHi : br.classicalSutraEn}</span>
                      </div>
                      <div>
                        <strong>{isHi ? 'फलित प्रभाव:' : 'Predictive Meaning:'}</strong>{' '}
                        <span className="muted">{isHi ? br.predictiveApplicationHi : br.predictiveApplicationEn}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* 6. DOSHAS, REMEDIES, GEMSTONES & RUDRAKSHA */}
      {branchMode === 'doshas_remedies' && (
        <div className="view-stack">
          <section className="panel">
            <div className="panel-header">
              <h3>
                <AlertTriangle size={15} />{' '}
                {isHi
                  ? `संपूर्ण कुंडली दोष जांच (${report.kundaliDoshas.presentCount} सक्रिय)`
                  : `Complete Kundali Dosha Check (${report.kundaliDoshas.presentCount} Active)`}
              </h3>
            </div>
            <div className="domains-grid">
              {report.kundaliDoshas.doshas.map((d) => (
                <article key={d.name} className="domain-card">
                  <div className="domain-top">
                    <h4>{d.name}</h4>
                    <span
                      className={`tag ${
                        d.status === 'Present'
                          ? 'tag-combust'
                          : d.status === 'Mitigated (Cancelled)'
                            ? 'tag-retro'
                            : 'tag-varg'
                      }`}
                    >
                      {trBadge(d.status, lang)}
                    </span>
                  </div>
                  <div className="pred-bullets">
                    <div><strong>{isHi ? 'जांच:' : 'Check:'}</strong> {d.trigger}</div>
                    <div><strong>{isHi ? 'परिहार:' : 'Bhanga:'}</strong> {d.mitigation}</div>
                    {d.status !== 'Clear' && (
                      <div><strong>{isHi ? 'उपाय:' : 'Remedy:'}</strong> {d.remedy}</div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="panel">
            <div className="panel-header">
              <h3>
                <Gem size={15} />{' '}
                {isHi ? 'वैदिक उपाय, रत्न एवं रुद्राक्ष सलाह' : 'Vedic Remedies, Gemstones & Rudraksha Advisor'}
              </h3>
            </div>
            <div className="yoga-grid">
              <article className="yoga-card cat-mahapurusha">
                <strong>{isHi ? gemReport.lifeStone.roleHi : gemReport.lifeStone.roleEn}: {isHi ? gemReport.lifeStone.stoneHi : gemReport.lifeStone.stoneEn}</strong>
                <p className="yoga-desc">{isHi ? gemReport.lifeStone.reasonHi : gemReport.lifeStone.reasonEn}</p>
                <span className="muted small-text">{isHi ? gemReport.lifeStone.metalHi : gemReport.lifeStone.metalEn} · {isHi ? gemReport.lifeStone.dayHi : gemReport.lifeStone.dayEn}</span>
              </article>
              <article className="yoga-card cat-raja">
                <strong>{isHi ? gemReport.luckyStone.roleHi : gemReport.luckyStone.roleEn}: {isHi ? gemReport.luckyStone.stoneHi : gemReport.luckyStone.stoneEn}</strong>
                <p className="yoga-desc">{isHi ? gemReport.luckyStone.reasonHi : gemReport.luckyStone.reasonEn}</p>
                <span className="muted small-text">{isHi ? gemReport.luckyStone.metalHi : gemReport.luckyStone.metalEn} · {isHi ? gemReport.luckyStone.dayHi : gemReport.luckyStone.dayEn}</span>
              </article>
              <article className="yoga-card cat-raja">
                <strong>{isHi ? gemReport.primaryRudraksha.titleHi : gemReport.primaryRudraksha.titleEn}</strong>
                <p className="yoga-desc">{isHi ? gemReport.primaryRudraksha.benefitHi : gemReport.primaryRudraksha.benefitEn}</p>
                <span className="muted small-text">{gemReport.primaryRudraksha.mantra}</span>
              </article>
              {report.remedies.map((r) => (
                <article key={r.planet} className="yoga-card">
                  <strong>{isHi ? `${trPlanet(r.planet, lang)} शांति उपाय` : `${r.planet} Remedy`}</strong>
                  <p className="yoga-desc">{r.reason}</p>
                  <div className="pred-bullets">
                    <div><strong>{isHi ? 'मंत्र:' : 'Mantra:'}</strong> {r.mantra}</div>
                    <div><strong>{isHi ? 'दान:' : 'Charity:'}</strong> {r.dana}</div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
