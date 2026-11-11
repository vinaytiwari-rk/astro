import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Compass,
  Flame,
  Gem,
  Grid3x3,
  Layers,
  RefreshCw,
  ShieldCheck,
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
