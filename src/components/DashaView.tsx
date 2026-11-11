import React, { useEffect, useMemo, useState } from 'react';
import { Calendar, ChevronRight, Sparkles } from 'lucide-react';
import {
  computeAdvancedDashas,
  computeSudarshanaChakra,
} from '../astro/advancedDashas';
import { expandSookshmaDasha, findActiveDashaPath } from '../astro/dasha';
import { predictDashaDetail } from '../astro/predictions/dashaPrashna';
import { evaluateParamayusStatus } from '../astro/predictions/paramayus';
import { formatDateDmy, formatLocalDateTimeFromUtc } from '../astro/time';
import type { ChartData, DashaPeriod } from '../astro/types';
import {
  localizeAdvancedDashasHi,
  localizeDashaDetailHi,
  localizeSudarshanaHi,
  trBadge,
} from '../i18n/hindiPredictions';
import { useLanguage } from '../i18n/LanguageContext';
import { trPlanet } from '../i18n/translations';
import { DateDmyInput } from './DateDmyInput';
import { ParamayusLockBanner } from './ParamayusLockBanner';

const YOGINI_HI: Record<string, string> = {
  Mangala: 'मंगला',
  Pingala: 'पिंगला',
  Dhanya: 'धान्या',
  Bhramari: 'भ्रामरी',
  Bhadrika: 'भद्रिका',
  Ulka: 'उल्का',
  Siddha: 'सिद्धा',
  Sankata: 'संकटा',
};

function fmtDashaLord(lord: string, system: DashaSystemId, lang: 'en' | 'hi'): string {
  if (lang === 'en') return lord;
  if (system === 'yogini') {
    const clean = lord.split(' ')[0];
    return YOGINI_HI[clean] ?? lord;
  }
  return trPlanet(lord, lang);
}

interface DashaViewProps {
  chart: ChartData;
  requestedSystem?: { id?: string; nonce: number };
}

type DashaSystemId = 'vimshottari' | 'yogini' | 'ashtottari' | 'narayana' | 'sudarshana';

function formatDateOnly(ms: number, offsetMinutes: number): string {
  return formatDateDmy(formatLocalDateTimeFromUtc(ms, offsetMinutes).slice(0, 10));
}

export const DashaView: React.FC<DashaViewProps> = ({ chart, requestedSystem }) => {
  const { lang, t } = useLanguage();
  const [system, setSystem] = useState<DashaSystemId>('vimshottari');

  useEffect(() => {
    const id = requestedSystem?.id;
    if (
      id === 'vimshottari' ||
      id === 'yogini' ||
      id === 'ashtottari' ||
      id === 'narayana' ||
      id === 'sudarshana'
    ) {
      setSystem(id);
    }
  }, [requestedSystem?.nonce, requestedSystem?.id]);
  const [queryDate, setQueryDate] = useState(() => new Date().toISOString().slice(0, 10));

  const queryMs = useMemo(() => {
    const parsed = Date.parse(`${queryDate}T12:00:00Z`);
    return Number.isNaN(parsed) ? Date.now() : parsed;
  }, [queryDate]);

  const paramayus = useMemo(() => evaluateParamayusStatus(chart, queryDate), [chart, queryDate]);

  const rawAdvDashas = useMemo(
    () => (paramayus.exceeded ? null : computeAdvancedDashas(chart)),
    [chart, paramayus.exceeded]
  );
  const advDashas = useMemo(
    () => (rawAdvDashas ? (lang === 'hi' ? localizeAdvancedDashasHi(rawAdvDashas) : rawAdvDashas) : null),
    [rawAdvDashas, lang]
  );
  const queryYear = parseInt(queryDate.slice(0, 4), 10) || new Date().getFullYear();
  const rawSudarshana = useMemo(
    () => (paramayus.exceeded ? null : computeSudarshanaChakra(chart, queryYear)),
    [chart, queryYear, paramayus.exceeded]
  );
  const sudarshana = useMemo(
    () => (rawSudarshana ? (lang === 'hi' ? localizeSudarshanaHi(rawSudarshana) : rawSudarshana) : null),
    [rawSudarshana, lang]
  );

  const activeList = system === 'yogini' ? chart.yogini : chart.vimshottari;
  const activePath = useMemo(() => findActiveDashaPath(activeList, queryMs), [activeList, queryMs]);

  const [selectedMdIdx, setSelectedMdIdx] = useState<number>(0);
  const [selectedAdIdx, setSelectedAdIdx] = useState<number>(0);
  const [selectedPdIdx, setSelectedPdIdx] = useState<number>(0);

  const syncSelectionToDate = (list: DashaPeriod[], targetMs: number) => {
    const mdI = list.findIndex((p) => targetMs >= p.startMs && targetMs < p.endMs);
    if (mdI >= 0) {
      setSelectedMdIdx(mdI);
      const ads = list[mdI].children ?? [];
      const adI = ads.findIndex((p) => targetMs >= p.startMs && targetMs < p.endMs);
      if (adI >= 0) {
        setSelectedAdIdx(adI);
        const pds = ads[adI].children ?? [];
        const pdI = pds.findIndex((p) => targetMs >= p.startMs && targetMs < p.endMs);
        setSelectedPdIdx(pdI >= 0 ? pdI : 0);
      } else {
        setSelectedAdIdx(0);
        setSelectedPdIdx(0);
      }
    } else {
      setSelectedMdIdx(0);
      setSelectedAdIdx(0);
      setSelectedPdIdx(0);
    }
  };

  useEffect(() => {
    syncSelectionToDate(activeList, queryMs);
  }, [chart.utcMs, system]);

  const selectedMd: DashaPeriod | undefined = activeList[selectedMdIdx] ?? activeList[0];
  const adList = selectedMd?.children ?? [];
  const selectedAd: DashaPeriod | undefined = adList[selectedAdIdx] ?? adList[0];
  const pdList = selectedAd?.children ?? [];
  const selectedPd: DashaPeriod | undefined = pdList[selectedPdIdx] ?? pdList[0];

  const sdList = useMemo(() => {
    if (system !== 'vimshottari' || !selectedPd) return [];
    return expandSookshmaDasha(selectedPd);
  }, [system, selectedPd]);

  const rawSelectedPrediction = useMemo(() => {
    if (paramayus.exceeded || !selectedMd || (system !== 'vimshottari' && system !== 'yogini')) return null;
    return predictDashaDetail({
      chart,
      system,
      mdLordRaw: selectedMd.lord,
      adLordRaw: selectedAd?.lord,
      pdLordRaw: system === 'vimshottari' ? selectedPd?.lord : undefined,
      startMs: (selectedPd ?? selectedAd ?? selectedMd).startMs,
      endMs: (selectedPd ?? selectedAd ?? selectedMd).endMs,
    });
  }, [paramayus.exceeded, chart, system, selectedMd, selectedAd, selectedPd]);

  const selectedPrediction = useMemo(() => {
    if (!rawSelectedPrediction) return null;
    if (lang !== 'hi') return rawSelectedPrediction;
    const lvl = system === 'yogini' ? 'yogini' : selectedPd ? 'pratyantardasha' : selectedAd ? 'antardasha' : 'mahadasha';
    return localizeDashaDetailHi(rawSelectedPrediction, chart, lvl);
  }, [rawSelectedPrediction, lang, system, selectedPd, selectedAd, chart]);

  const rawAllMdSummaries = useMemo(
    () =>
      !paramayus.exceeded && (system === 'vimshottari' || system === 'yogini')
        ? activeList.slice(0, 9).map((md) =>
            predictDashaDetail({
              chart,
              system,
              mdLordRaw: md.lord,
              startMs: md.startMs,
              endMs: md.endMs,
            })
          )
        : [],
    [paramayus.exceeded, chart, system, activeList]
  );

  const allMdSummaries = useMemo(
    () =>
      lang === 'hi'
        ? rawAllMdSummaries.map((m) =>
            localizeDashaDetailHi(m, chart, system === 'yogini' ? 'yogini' : 'mahadasha')
          )
        : rawAllMdSummaries,
    [rawAllMdSummaries, lang, chart, system]
  );

  const jumpToQueryDate = () => {
    syncSelectionToDate(activeList, queryMs);
  };

  return (
    <div className="view-stack">
      <div className="charts-toolbar">
        <div className="subtab-bar">
          {(
            [
              ['vimshottari', t.dashaTabs.vimshottari],
              ['yogini', t.dashaTabs.yogini],
              ['ashtottari', t.dashaTabs.ashtottari],
              ['narayana', t.dashaTabs.narayana],
              ['sudarshana', t.dashaTabs.sudarshana],
            ] as Array<[DashaSystemId, string]>
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={`subtab-btn ${system === id ? 'is-active' : ''}`}
              onClick={() => {
                setSystem(id);
                setSelectedMdIdx(0);
                setSelectedAdIdx(0);
                setSelectedPdIdx(0);
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="toolbar-group">
          <Calendar size={15} />
          <span className="label-muted">{lang === 'hi' ? 'सक्रिय दशा दिनांक:' : 'Active Dasha on:'}</span>
          <DateDmyInput
            compact
            className="select-compact mono"
            value={queryDate}
            ariaLabel={lang === 'hi' ? 'सक्रिय दशा दिनांक (DD-MM-YYYY)' : 'Active Dasha Date (DD-MM-YYYY)'}
            onChange={setQueryDate}
          />
          <button type="button" className="btn btn-secondary btn-sm" onClick={jumpToQueryDate}>
            {t.common.jumpToDate}
          </button>
        </div>
      </div>

      {paramayus.exceeded || !advDashas || !sudarshana ? (
        <ParamayusLockBanner status={paramayus} />
      ) : (
        <>
      {system === 'ashtottari' && (
        <section className="panel">
          <div className="panel-header">
            <h3>{lang === 'hi' ? 'अष्टोत्तरी दशा (108-वर्षीय प्रणाली)' : 'Ashtottari Dasha (108-Year System)'}</h3>
            <span className={`tag ${advDashas.ashtottariEligible ? 'tag-varg' : 'tag-retro'}`}>
              {advDashas.ashtottariEligible
                ? (lang === 'hi' ? 'शर्त लागू' : 'Condition Met')
                : (lang === 'hi' ? 'तुलनात्मक' : 'Comparative')}
            </span>
          </div>
          <div className="gochar-highlights">
            <div className="gochar-banner is-info">{advDashas.ashtottariReason}</div>
          </div>
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{lang === 'hi' ? 'दशा स्वामी' : 'Lord'}</th>
                  <th>{lang === 'hi' ? 'वर्ष' : 'Years'}</th>
                  <th>{lang === 'hi' ? 'अवधि' : 'Dates'}</th>
                  <th>{t.common.status}</th>
                  <th>{lang === 'hi' ? 'मुख्य प्रभाव' : 'Focus'}</th>
                </tr>
              </thead>
              <tbody>
                {advDashas.ashtottari.map((p, i) => {
                  const running = queryMs >= p.startMs && queryMs < p.endMs;
                  return (
                    <tr key={`${p.lord}-${i}`}>
                      <td>
                        <strong>{trPlanet(p.lord, lang)}</strong>
                      </td>
                      <td className="mono">{p.years}{lang === 'hi' ? ' व' : 'y'}</td>
                      <td className="mono">
                        {formatDateDmy(p.startDate)} → {formatDateDmy(p.endDate)}
                      </td>
                      <td>
                        {running ? <span className="tag tag-varg">{lang === 'hi' ? 'वर्तमान' : 'Running'}</span> : '—'}
                      </td>
                      <td className="wrap-cell">{p.note}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {system === 'narayana' && (
        <section className="panel">
          <div className="panel-header">
            <h3>
              {lang === 'hi'
                ? `नारायण दशा (जैमिनी राशि दशा · आरंभ: ${advDashas.narayanaStartSign})`
                : `Narayana Dasha (Jaimini Sign Dasha · Seeded from ${advDashas.narayanaStartSign})`}
            </h3>
          </div>
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t.common.sign}</th>
                  <th>{lang === 'hi' ? 'वर्ष' : 'Yrs'}</th>
                  <th>{lang === 'hi' ? 'अवधि' : 'Dates'}</th>
                  <th>{lang === 'hi' ? 'पाक / भोग राशि' : 'Paka / Bhoga'}</th>
                  <th>{t.common.status}</th>
                  <th>{t.common.notes}</th>
                </tr>
              </thead>
              <tbody>
                {advDashas.narayana.map((n, i) => {
                  const running = queryMs >= n.startMs && queryMs < n.endMs;
                  return (
                    <tr key={`${n.signName}-${i}`}>
                      <td>
                        <strong>{n.signName}</strong>
                      </td>
                      <td className="mono">{n.years}{lang === 'hi' ? ' व' : 'y'}</td>
                      <td className="mono">
                        {formatDateDmy(n.startDate)} → {formatDateDmy(n.endDate)}
                      </td>
                      <td className="small-cell">
                        {lang === 'hi' ? `पाक: ${n.pakaSign} · भोग: ${n.bhogaSign}` : `Paka: ${n.pakaSign} · Bhoga: ${n.bhogaSign}`}
                      </td>
                      <td>
                        {running ? <span className="tag tag-varg">{lang === 'hi' ? 'वर्तमान' : 'Running'}</span> : '—'}
                      </td>
                      <td className="wrap-cell">{n.note}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {system === 'sudarshana' && (
        <section className="panel">
          <div className="panel-header">
            <h3>
              {lang === 'hi'
                ? `सुदर्शन चक्र त्रिवलय फलादेश — वर्ष ${sudarshana.year} (आयु ${sudarshana.age} वर्ष)`
                : `Sudarshana Chakra Tri-Wheel Progression — Year ${sudarshana.year} (Age ${sudarshana.age})`}
            </h3>
          </div>
          <div className="pred-card-body">
            <p className="lead-text">{sudarshana.synthesis}</p>
            <div className="branch-highlights">
              <div className="highlight-box">
                <span className="muted small-text">{lang === 'hi' ? `लग्न चक्र (भाव ${sudarshana.lagnaHouse})` : `Lagna Wheel (H${sudarshana.lagnaHouse})`}</span>
                <strong>{sudarshana.lagnaSign}</strong>
                <span className="muted small-text">
                  {lang === 'hi' ? 'ग्रह:' : 'Planets:'} {sudarshana.lagnaOccupants.join(', ') || (lang === 'hi' ? 'रिक्त' : 'Unoccupied')}
                </span>
              </div>
              <div className="highlight-box">
                <span className="muted small-text">{lang === 'hi' ? `चंद्र चक्र (भाव ${sudarshana.moonHouse})` : `Chandra / Moon Wheel (H${sudarshana.moonHouse})`}</span>
                <strong>{sudarshana.moonSign}</strong>
                <span className="muted small-text">
                  {lang === 'hi' ? 'ग्रह:' : 'Planets:'} {sudarshana.moonOccupants.join(', ') || (lang === 'hi' ? 'रिक्त' : 'Unoccupied')}
                </span>
              </div>
              <div className="highlight-box">
                <span className="muted small-text">{lang === 'hi' ? `सूर्य चक्र (भाव ${sudarshana.sunHouse})` : `Surya / Sun Wheel (H${sudarshana.sunHouse})`}</span>
                <strong>{sudarshana.sunSign}</strong>
                <span className="muted small-text">
                  {lang === 'hi' ? 'ग्रह:' : 'Planets:'} {sudarshana.sunOccupants.join(', ') || (lang === 'hi' ? 'रिक्त' : 'Unoccupied')}
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {(system === 'vimshottari' || system === 'yogini') && (
        <>
      {/* Active Dasha Banner */}
      <div className="dasha-banner">
        <span className="muted">{lang === 'hi' ? `${formatDateDmy(queryDate)} को वर्तमान दशा:` : `Running on ${formatDateDmy(queryDate)}:`}</span>
        {activePath.length === 0 ? (
          <strong>{lang === 'hi' ? 'गणना चक्र से बाहर' : 'Outside generated cycle window'}</strong>
        ) : (
          <div className="dasha-crumbs">
            {activePath.map((node, i) => (
              <React.Fragment key={`${node.lord}-${i}`}>
                {i > 0 && <ChevronRight size={14} className="muted" />}
                <span className="dasha-crumb-pill">
                  <strong>{fmtDashaLord(node.lord, system, lang)}</strong>
                  <span className="mono small-text">
                    ({formatDateOnly(node.startMs, chart.offsetMinutesUsed)} → {formatDateOnly(node.endMs, chart.offsetMinutesUsed)})
                  </span>
                </span>
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      {/* Multi-column drill-down browser */}
      <div className={`dasha-columns ${system === 'yogini' ? 'cols-2' : 'cols-4'}`}>
        {/* Level 1: Mahadasha */}
        <section className="panel dasha-col">
          <div className="panel-header">
            <h3>{lang === 'hi' ? 'महादशा (MD)' : 'Mahadasha (MD)'}</h3>
          </div>
          <div className="dasha-list">
            {activeList.map((md, idx) => {
              const isCurrent = queryMs >= md.startMs && queryMs < md.endMs;
              const isSelected = idx === selectedMdIdx;
              return (
                <button
                  key={`${md.lord}-${idx}`}
                  type="button"
                  className={`dasha-item ${isSelected ? 'is-selected' : ''} ${isCurrent ? 'is-running' : ''}`}
                  onClick={() => {
                    setSelectedMdIdx(idx);
                    setSelectedAdIdx(0);
                    setSelectedPdIdx(0);
                  }}
                >
                  <div className="dasha-item-top">
                    <strong>{fmtDashaLord(md.lord, system, lang)}</strong>
                    {isCurrent && <span className="tag tag-varg">{lang === 'hi' ? 'वर्तमान' : 'Running'}</span>}
                  </div>
                  <div className="dasha-dates mono">
                    {formatDateOnly(md.startMs, chart.offsetMinutesUsed)} →{' '}
                    {formatDateOnly(md.endMs, chart.offsetMinutesUsed)}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Level 2: Antardasha */}
        <section className="panel dasha-col">
          <div className="panel-header">
            <h3>{lang === 'hi' ? `अंतरदशा (${selectedMd ? fmtDashaLord(selectedMd.lord, system, lang) : ''})` : `Antardasha (${selectedMd?.lord})`}</h3>
          </div>
          <div className="dasha-list">
            {adList.map((ad, idx) => {
              const isCurrent = queryMs >= ad.startMs && queryMs < ad.endMs;
              const isSelected = idx === selectedAdIdx;
              return (
                <button
                  key={`${ad.lord}-${idx}`}
                  type="button"
                  className={`dasha-item ${isSelected ? 'is-selected' : ''} ${isCurrent ? 'is-running' : ''}`}
                  onClick={() => {
                    setSelectedAdIdx(idx);
                    setSelectedPdIdx(0);
                  }}
                >
                  <div className="dasha-item-top">
                    <strong>
                      {selectedMd ? fmtDashaLord(selectedMd.lord, system, lang) : ''} / {fmtDashaLord(ad.lord, system, lang)}
                    </strong>
                    {isCurrent && <span className="tag tag-varg">{lang === 'hi' ? 'वर्तमान' : 'Running'}</span>}
                  </div>
                  <div className="dasha-dates mono">
                    {formatDateOnly(ad.startMs, chart.offsetMinutesUsed)} →{' '}
                    {formatDateOnly(ad.endMs, chart.offsetMinutesUsed)}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {system === 'vimshottari' && (
          <>
            {/* Level 3: Pratyantardasha */}
            <section className="panel dasha-col">
              <div className="panel-header">
                <h3>{lang === 'hi' ? `प्रत्यंतरदशा (${selectedAd ? fmtDashaLord(selectedAd.lord, system, lang) : ''})` : `Pratyantardasha (${selectedAd?.lord})`}</h3>
              </div>
              <div className="dasha-list">
                {pdList.map((pd, idx) => {
                  const isCurrent = queryMs >= pd.startMs && queryMs < pd.endMs;
                  const isSelected = idx === selectedPdIdx;
                  return (
                    <button
                      key={`${pd.lord}-${idx}`}
                      type="button"
                      className={`dasha-item ${isSelected ? 'is-selected' : ''} ${isCurrent ? 'is-running' : ''}`}
                      onClick={() => setSelectedPdIdx(idx)}
                    >
                      <div className="dasha-item-top">
                        <strong>{fmtDashaLord(pd.lord, system, lang)}</strong>
                        {isCurrent && <span className="tag tag-varg">{lang === 'hi' ? 'वर्तमान' : 'Running'}</span>}
                      </div>
                      <div className="dasha-dates mono">
                        {formatDateOnly(pd.startMs, chart.offsetMinutesUsed)} →{' '}
                        {formatDateOnly(pd.endMs, chart.offsetMinutesUsed)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Level 4: Sookshma */}
            <section className="panel dasha-col">
              <div className="panel-header">
                <h3>{lang === 'hi' ? `सूक्ष्म दशा (${selectedPd ? fmtDashaLord(selectedPd.lord, system, lang) : ''})` : `Sookshma (${selectedPd?.lord})`}</h3>
              </div>
              <div className="dasha-list">
                {sdList.map((sd, idx) => {
                  const isCurrent = queryMs >= sd.startMs && queryMs < sd.endMs;
                  return (
                    <div
                      key={`${sd.lord}-${idx}`}
                      className={`dasha-item is-static ${isCurrent ? 'is-running' : ''}`}
                    >
                      <div className="dasha-item-top">
                        <strong>{fmtDashaLord(sd.lord, system, lang)}</strong>
                        <span className="muted mono small-text">{sd.durationDays.toFixed(1)}{lang === 'hi' ? ' दि' : 'd'}</span>
                      </div>
                      <div className="dasha-dates mono">
                        {formatDateOnly(sd.startMs, chart.offsetMinutesUsed)} →{' '}
                        {formatDateOnly(sd.endMs, chart.offsetMinutesUsed)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </>
        )}
      </div>

      {/* Live Dasha Prediction or 120+ Yr Paramayus Lock */}
      {selectedPrediction && (
        <section className="panel">
          <div className="panel-header">
            <h3>
              <Sparkles size={15} /> {lang === 'hi' ? 'चयनित दशा फलादेश:' : 'Dasha Prediction:'} {selectedPrediction.title} (
              <span className="mono">
                {formatDateDmy(selectedPrediction.startDate)} → {formatDateDmy(selectedPrediction.endDate)}
              </span>
              )
            </h3>
            <div className="toolbar-group">
              <span className="tag tag-karaka">{lang === 'hi' ? 'अंक:' : 'Score:'} {selectedPrediction.score}/100</span>
              <span
                className={`tag ${
                  selectedPrediction.favorability === 'Very Favorable' ||
                  selectedPrediction.favorability === 'Supportive'
                    ? 'tag-varg'
                    : 'tag-retro'
                }`}
              >
                {trBadge(selectedPrediction.favorability, lang)}
              </span>
            </div>
          </div>

          <div className="pred-card-body">
            <div className="pred-bullets">
              <div>
                <strong>{lang === 'hi' ? 'महादशा प्रभाव:' : 'Mahadasha Effect:'}</strong> {selectedPrediction.mdSummary}
              </div>
              {selectedPrediction.adSummary && (
                <div>
                  <strong>{lang === 'hi' ? 'अंतरदशा फल:' : 'Antardasha Trigger:'}</strong> {selectedPrediction.adSummary}
                </div>
              )}
              {selectedPrediction.pdSummary && (
                <div>
                  <strong>{lang === 'hi' ? 'प्रत्यंतर सूक्ष्म समय:' : 'Pratyantardasha Micro-Timing:'}</strong> {selectedPrediction.pdSummary}
                </div>
              )}
              <div>
                <strong>{lang === 'hi' ? 'नवांश (D9) व दशमांश (D10) आधार:' : 'Divisional (D9/D10) Backing:'}</strong> {selectedPrediction.d9AndD10Note}
              </div>
              <div>
                <strong>{lang === 'hi' ? 'दशा मार्गदर्शन:' : 'Timing Guidance:'}</strong> {selectedPrediction.guidance}
              </div>
            </div>

            <ul className="domain-details">
              {selectedPrediction.keyEffects.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Full Cycle Life Dasha Prediction Table */}
      <section className="panel">
        <div className="panel-header">
          <h3>
            {lang === 'hi'
              ? `संपूर्ण ${system === 'vimshottari' ? 'विंशोत्तरी' : 'योगिनी'} महादशा जीवन फलादेश`
              : `Complete ${system === 'vimshottari' ? 'Vimshottari' : 'Yogini'} Mahadasha Life Predictions`}
          </h3>
          <span className="muted">
            {lang === 'hi'
              ? 'अंतरदशा और प्रत्यंतरदशा फल देखने हेतु ऊपर किसी भी दशा पर क्लिक करें'
              : 'Click any period above to drill into Antardasha & Pratyantardasha predictions'}
          </span>
        </div>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t.common.period}</th>
                <th>{lang === 'hi' ? 'अवधि' : 'Dates'}</th>
                <th>{lang === 'hi' ? 'फल स्तर' : 'Rating'}</th>
                <th>{lang === 'hi' ? 'सक्रिय भाव' : 'Houses'}</th>
                <th>{lang === 'hi' ? 'संक्षिप्त फलादेश' : 'Summary Prediction'}</th>
              </tr>
            </thead>
            <tbody>
              {allMdSummaries.map((m, i) => (
                <tr key={`${m.mdLord}-${i}`}>
                  <td>
                    <strong>{m.mdLord}</strong>
                  </td>
                  <td className="mono small-cell">
                    {formatDateDmy(m.startDate)} → {formatDateDmy(m.endDate)}
                  </td>
                  <td>
                    <span
                      className={`tag ${
                        m.score >= 62 ? 'tag-varg' : m.score >= 48 ? 'tag-karaka' : 'tag-combust'
                      }`}
                    >
                      {m.score}/100 ({trBadge(m.favorability, lang)})
                    </span>
                  </td>
                  <td className="mono">
                    {m.activatedHouses.map((h) => `${t.common.house}${h}`).join(', ')}
                  </td>
                  <td className="wrap-cell">{m.mdSummary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
        </>
      )}
        </>
      )}
    </div>
  );
};
