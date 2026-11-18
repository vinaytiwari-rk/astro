import React, { useMemo, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { calculateChart } from '../astro/calculator';
import {
  computeGocharaKakshas,
  evaluateAshtakavargaYogas,
} from '../astro/panchaPakshiAndKaksha';
import { computeDailyChoghadiyaAndGowri } from '../astro/panchangExtra';
import {
  getGocharaBookRecord,
  type GocharaBookRecord,
} from '../astro/predictions/classicalBookData';
import { evaluateParamayusStatus } from '../astro/predictions/paramayus';
import { formatDateDmy } from '../astro/time';
import type { BirthInput, CalcSettings, ChartData, ChartStyle } from '../astro/types';
import { useLanguage } from '../i18n/LanguageContext';
import { trPlanet, trPlanetShort, trSign, trTerm } from '../i18n/translations';
import { DateDmyInput } from './DateDmyInput';
import { ParamayusLockBanner } from './ParamayusLockBanner';
import { VedicChartSvg } from './VedicChartSvg';

interface TransitsViewProps {
  natalChart: ChartData;
  settings: CalcSettings;
  chartStyle: ChartStyle;
}

function nowDateAndTime(): { date: string; time: string } {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return {
    date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
    time: `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`,
  };
}

export const TransitsView: React.FC<TransitsViewProps> = ({
  natalChart,
  settings,
  chartStyle,
}) => {
  const { lang, t } = useLanguage();
  const initial = useMemo(() => nowDateAndTime(), []);
  const [date, setDate] = useState(initial.date);
  const [time, setTime] = useState(initial.time);
  const [referenceMode, setReferenceMode] = useState<'lagna' | 'moon'>('moon');

  const natalMoon = natalChart.planets.find((p) => p.id === 'Moon')!;
  const paramayus = useMemo(
    () => evaluateParamayusStatus(natalChart, date),
    [natalChart, date]
  );

  const transitInput: BirthInput = useMemo(
    () => ({
      ...natalChart.input,
      id: 'transit-now',
      name: 'Gochar Transit',
      date,
      time,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || natalChart.input.timezone,
      utcOffsetMinutes: undefined,
    }),
    [natalChart.input, date, time]
  );

  const transitChart = useMemo(
    () => (paramayus.exceeded ? natalChart : calculateChart(transitInput, settings)),
    [paramayus.exceeded, natalChart, transitInput, settings]
  );

  const choghadiyaSuite = useMemo(
    () =>
      computeDailyChoghadiyaAndGowri(
        date,
        natalChart.input.latitude,
        natalChart.input.longitude,
        transitChart.offsetMinutesUsed
      ),
    [date, natalChart.input.latitude, natalChart.input.longitude, transitChart.offsetMinutesUsed]
  );

  const kakshaRows = useMemo(
    () => (paramayus.exceeded ? [] : computeGocharaKakshas(natalChart, transitChart)),
    [paramayus.exceeded, natalChart, transitChart]
  );
  const avYogas = useMemo(
    () => (paramayus.exceeded ? [] : evaluateAshtakavargaYogas(natalChart)),
    [paramayus.exceeded, natalChart]
  );

  const gocharaAnalysis = useMemo(() => {
    if (paramayus.exceeded) return [];
    return transitChart.planets.map((p) => {
      const houseFromMoon = ((p.signIndex - natalMoon.signIndex + 12) % 12) + 1;
      const rec = getGocharaBookRecord(p.id, houseFromMoon);

      let vedhaBlockedBy: string[] = [];
      if (rec && rec.vedhaHouse !== null) {
        vedhaBlockedBy = transitChart.planets
          .filter((tp) => {
            if (tp.id === p.id) return false;
            // Classical exception: Sun & Saturn do not cause mutual vedha
            if ((p.id === 'Sun' && tp.id === 'Saturn') || (p.id === 'Saturn' && tp.id === 'Sun')) return false;
            // Classical exception: Moon & Mercury do not cause mutual vedha
            if ((p.id === 'Moon' && tp.id === 'Mercury') || (p.id === 'Mercury' && tp.id === 'Moon')) return false;
            const h = ((tp.signIndex - natalMoon.signIndex + 12) % 12) + 1;
            return h === rec.vedhaHouse;
          })
          .map((tp) => trPlanet(tp.id, lang));
      }

      return {
        planet: p,
        houseFromMoon,
        rec,
        vedhaBlockedBy,
        hasVedha: vedhaBlockedBy.length > 0,
      };
    });
  }, [paramayus.exceeded, transitChart.planets, natalMoon.signIndex, lang]);
  const refSignIndex =
    referenceMode === 'moon' ? natalMoon.signIndex : natalChart.ascendant.signIndex;

  const transitBadges = [
    {
      id: 'Ref',
      label: lang === 'hi' ? (referenceMode === 'moon' ? 'जन्म' : 'लग्न') : (referenceMode === 'moon' ? 'Janma' : 'Lagna'),
      signIndex: refSignIndex,
      isLagna: true,
    },
    ...transitChart.planets.map((p) => ({
      id: p.id,
      label: trPlanetShort(p.id, lang),
      signIndex: p.signIndex,
      isRetrograde: p.isRetrograde,
      isCombust: p.isCombust,
      dignity: p.dignity,
      tooltip: `${trPlanet(p.id, lang)}: ${trSign(p.signIndex, lang)} ${p.dms} | ${trTerm(p.nakshatraName, lang)} ${lang === 'hi' ? 'च' : 'P'}${p.pada}`,
    })),
  ];

  const handleResetNow = () => {
    const cur = nowDateAndTime();
    setDate(cur.date);
    setTime(cur.time);
  };

  return (
    <div className="view-stack">
      <div className="charts-toolbar">
        <div className="toolbar-group">
          <span className="label-muted">{lang === 'hi' ? 'गोचर दिनांक व समय:' : 'Transit Date & Time:'}</span>
          <DateDmyInput
            compact
            className="select-compact mono"
            value={date}
            ariaLabel={lang === 'hi' ? 'गोचर दिनांक (DD-MM-YYYY)' : 'Transit Date (DD-MM-YYYY)'}
            onChange={setDate}
          />
          <input
            type="time"
            step="1"
            className="select-compact mono"
            value={time}
            onChange={(e) =>
              setTime(e.target.value.length === 5 ? `${e.target.value}:00` : e.target.value)
            }
          />
          <button type="button" className="btn btn-secondary btn-sm" onClick={handleResetNow}>
            <RefreshCw size={13} />
            {t.common.now}
          </button>
        </div>

        <div className="subtab-bar">
          <button
            type="button"
            className={`subtab-btn ${referenceMode === 'moon' ? 'is-active' : ''}`}
            onClick={() => setReferenceMode('moon')}
          >
            {lang === 'hi'
              ? `जन्म राशि से (चंद्र: ${trSign(natalMoon.signIndex, lang)})`
              : `From Janma Rasi (Moon: ${natalMoon.signName})`}
          </button>
          <button
            type="button"
            className={`subtab-btn ${referenceMode === 'lagna' ? 'is-active' : ''}`}
            onClick={() => setReferenceMode('lagna')}
          >
            {lang === 'hi'
              ? `जन्म लग्न से (${trSign(natalChart.ascendant.signIndex, lang)})`
              : `From Natal Lagna (${natalChart.ascendant.signName})`}
          </button>
        </div>
      </div>

      {paramayus.exceeded ? (
        <ParamayusLockBanner status={paramayus} />
      ) : (
        <>
        <div className="varga-focus-grid">
        <VedicChartSvg
          title={lang === 'hi' ? `गोचर कुंडली (${formatDateDmy(date)})` : `Gochar Transits (${formatDateDmy(date)})`}
          subtitle={
            lang === 'hi'
              ? `आधार: ${referenceMode === 'moon' ? `जन्म चंद्र (${trSign(natalMoon.signIndex, lang)})` : `जन्म लग्न (${trSign(natalChart.ascendant.signIndex, lang)})`}`
              : `Relative to ${referenceMode === 'moon' ? `Natal Moon (${natalMoon.signName})` : `Natal Lagna (${natalChart.ascendant.signName})`}`
          }
          style={chartStyle}
          lagnaSignIndex={refSignIndex}
          items={transitBadges}
          savBindus={natalChart.ashtakavarga.sarva}
          centerLabel={lang === 'hi' ? 'गोचर' : 'GOCHAR'}
        />

        <div className="view-stack">
          <section className="panel">
            <div className="panel-header">
              <h3>{lang === 'hi' ? 'दैनिक ग्रह गोचर तालिका' : 'Planetary Transit (Gochar) Table'}</h3>
            </div>
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{t.common.planet}</th>
                    <th>{lang === 'hi' ? 'गोचर राशि' : 'Transit Sign'}</th>
                    <th>{t.common.degree}</th>
                    <th>{t.common.nakshatra}</th>
                    <th>
                      {lang === 'hi'
                        ? `${referenceMode === 'moon' ? 'चंद्र' : 'लग्न'} से भाव`
                        : `House from ${referenceMode === 'moon' ? 'Moon' : 'Lagna'}`}
                    </th>
                    <th>{lang === 'hi' ? 'SAV बिंदु' : 'SAV Bindu'}</th>
                    <th>{lang === 'hi' ? 'गति' : 'Motion'}</th>
                  </tr>
                </thead>
                <tbody>
                  {transitChart.planets.map((p) => {
                    const houseFromRef = ((p.signIndex - refSignIndex + 12) % 12) + 1;
                    const savScore = natalChart.ashtakavarga.sarva[p.signIndex];
                    return (
                      <tr key={p.id}>
                        <td>
                          <strong>{trPlanet(p.id, lang)}</strong>
                        </td>
                        <td>{trSign(p.signIndex, lang)}</td>
                        <td className="mono">{p.dms}</td>
                        <td>
                          {trTerm(p.nakshatraName, lang)} {lang === 'hi' ? 'च' : 'P'}{p.pada}
                        </td>
                        <td className="mono">
                          <strong>{lang === 'hi' ? `भाव ${houseFromRef}` : `H${houseFromRef}`}</strong>
                        </td>
                        <td className={`mono ${savScore >= 30 ? 'cell-strong' : savScore < 25 ? 'cell-weak' : ''}`}>
                          {savScore}
                        </td>
                        <td>
                          {p.isRetrograde ? (
                            <span className="tag tag-retro">{lang === 'hi' ? 'वक्री' : 'Retro'}</span>
                          ) : (
                            <span className="muted mono">{p.speedDegPerDay.toFixed(2)}°/{lang === 'hi' ? 'दि' : 'd'}</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <section className="panel">
            <div className="panel-header">
              <h3>{lang === 'hi' ? `दैनिक पंचांग एवं मुहूर्त (${date})` : `Daily Panchang & Muhurta Timings (${date})`}</h3>
            </div>
            <div className="kv-list two-col-kv">
              <div className="kv-row">
                <span>{t.basics.tithi}</span>
                <strong>
                  {trTerm(transitChart.panchang.tithi.paksha, lang)} {trTerm(transitChart.panchang.tithi.name, lang)}
                </strong>
              </div>
              <div className="kv-row">
                <span>{t.common.nakshatra}</span>
                <strong>
                  {trTerm(transitChart.panchang.nakshatra.name, lang)} {lang === 'hi' ? 'च' : 'P'}{transitChart.panchang.nakshatra.pada}
                </strong>
              </div>
              <div className="kv-row">
                <span>{lang === 'hi' ? 'योग / करण' : 'Yoga / Karana'}</span>
                <strong>
                  {trTerm(transitChart.panchang.yoga.name, lang)} / {trTerm(transitChart.panchang.karana.name, lang)}
                </strong>
              </div>
              <div className="kv-row">
                <span>{t.basics.horaLord}</span>
                <strong>{trPlanet(transitChart.panchang.horaLord, lang)}</strong>
              </div>
              <div className="kv-row">
                <span>{lang === 'hi' ? 'अभिजित मुहूर्त (शुभ)' : 'Abhijit Muhurta (Auspicious)'}</span>
                <strong className="mono cell-strong">{transitChart.panchang.abhijitMuhurta}</strong>
              </div>
              <div className="kv-row">
                <span>{lang === 'hi' ? 'राहु काल (वर्ज्य)' : 'Rahu Kalam'}</span>
                <strong className="mono cell-weak">{transitChart.panchang.rahuKalam}</strong>
              </div>
              <div className="kv-row">
                <span>{lang === 'hi' ? 'यमगंड काल' : 'Yamaganda Kalam'}</span>
                <strong className="mono">{transitChart.panchang.yamaganda}</strong>
              </div>
              <div className="kv-row">
                <span>{lang === 'hi' ? 'गुलिक काल' : 'Gulika Kalam'}</span>
                <strong className="mono">{transitChart.panchang.gulikaKalam}</strong>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Classical Textbook Gochara Predictions (Ch. 12 - From Natal Moon with Vedha Analysis) */}
      <section className="panel" style={{ marginTop: '16px' }}>
        <div className="panel-header">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <h3 style={{ margin: 0 }}>
              {lang === 'hi'
                ? `शास्त्रीय गोचर फलादेश (अध्याय 12 — जन्म चंद्र: ${trSign(natalMoon.signIndex, lang)} से गोचर व वेध विचार)`
                : `Classical Textbook Gochara Predictions (Ch. 12 — From Natal Moon: ${natalMoon.signName} with Vedha Analysis)`}
            </h3>
            <span className="muted small-text">
              {lang === 'hi'
                ? 'गोचर का फल जन्म चंद्र राशि से देखा जाता है। वेध स्थान में ग्रह स्थित होने पर शुभ या अशुभ फल बाधित हो जाता है।'
                : 'Transits are classically judged from natal Moon. A transiting planet in the Vedha house obstructs the transit result.'}
            </span>
          </div>
        </div>
        <div className="cards-list pad-14" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '12px' }}>
          {gocharaAnalysis.map((item) => {
            const p = item.planet;
            const rec = item.rec;
            if (!rec) return null;
            const isFav = rec.isFavorable;
            return (
              <article
                key={p.id}
                className={`yoga-card ${
                  isFav
                    ? item.hasVedha ? 'tone-mixed' : 'tone-benefic'
                    : item.hasVedha ? 'tone-mixed' : 'tone-dosha'
                }`}
                style={{ padding: '14px', borderRadius: '8px', border: '1px solid var(--border)' }}
              >
                <div className="yoga-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <strong style={{ fontSize: '15px' }}>{trPlanet(p.id, lang)}</strong>
                    <span className="tag tag-karaka" style={{ fontSize: '11px' }}>
                      {trSign(p.signIndex, lang)} {p.dms}
                    </span>
                    <span className="tag" style={{ fontSize: '11px', fontWeight: 600 }}>
                      {lang === 'hi' ? `चंद्र से भाव ${item.houseFromMoon}` : `H${item.houseFromMoon} from Moon`}
                    </span>
                  </div>
                  <div>
                    {isFav ? (
                      <span className={`tag ${item.hasVedha ? 'tag-combust' : 'tag-varg'}`}>
                        {item.hasVedha
                          ? (lang === 'hi' ? 'शुभ (वेध बाधित)' : 'Benefic (Vedha Blocked)')
                          : (lang === 'hi' ? 'शुभ फलदायी' : 'Favorable')}
                      </span>
                    ) : (
                      <span className={`tag ${item.hasVedha ? 'tag-karaka' : 'tag-combust'}`}>
                        {item.hasVedha
                          ? (lang === 'hi' ? 'अशुभ (विपरीत वेध)' : 'Unfavorable (Restrained)')
                          : (lang === 'hi' ? 'अशुभ / सतर्कता' : 'Unfavorable')}
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ marginBottom: '6px', fontSize: '12px', fontWeight: 600 }}>
                  {rec.vedhaHouse !== null ? (
                    item.hasVedha ? (
                      <span style={{ color: '#dc2626' }}>
                        {lang === 'hi'
                          ? `वेध लगा: भाव ${rec.vedhaHouse} में ${item.vedhaBlockedBy.join(', ')} स्थित (फल निष्प्रभावी / बाधित)`
                          : `Vedha active: ${item.vedhaBlockedBy.join(', ')} in H${rec.vedhaHouse} (Transit obstructed)`}
                      </span>
                    ) : (
                      <span style={{ color: '#059669' }}>
                        {lang === 'hi'
                          ? `वेध मुक्त: वेध स्थान (भाव ${rec.vedhaHouse}) रिक्त (फल पूर्ण प्रभावी)`
                          : `Free from Vedha: H${rec.vedhaHouse} is vacant (Full effect)`}
                      </span>
                    )
                  ) : (
                    <span style={{ color: 'var(--text-muted)' }}>
                      {lang === 'hi' ? 'वेध रहित गोचर' : 'No Vedha house'}
                    </span>
                  )}
                </div>

                <p style={{ margin: '0 0 6px 0', fontSize: '13.5px', fontWeight: 600, color: 'var(--text)', lineHeight: 1.45 }}>
                  {lang === 'hi' ? rec.summaryHi : rec.summaryEn}
                </p>

                <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: 1.55 }}>
                  {lang === 'hi' ? rec.detailedHi : rec.detailedEn}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      {/* Day & Night Choghadiya + Gowri Panchangam */}
      <div className="basics-bottom-grid">
        <section className="panel">
          <div className="panel-header">
            <h3>
              {lang === 'hi'
                ? `दैनिक चौघड़िया मुहूर्त (${formatDateDmy(date)})`
                : `Day & Night Choghadiya Muhurta (${formatDateDmy(date)})`}
            </h3>
            <span className="muted mono small-text">
              {lang === 'hi' ? 'सूर्योदय:' : 'Rise:'} {choghadiyaSuite.sunrise} ·{' '}
              {lang === 'hi' ? 'सूर्यास्त:' : 'Set:'} {choghadiyaSuite.sunset}
            </span>
          </div>
          <div className="two-col-split-pad">
            <div>
              <h4 className="subpanel-heading">{lang === 'hi' ? 'दिन का चौघड़िया (Day)' : 'Day Choghadiya'}</h4>
              <div className="table-scroll">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>{lang === 'hi' ? 'चौघड़िया' : 'Muhurta'}</th>
                      <th>{t.common.period}</th>
                      <th>{lang === 'hi' ? 'शुभत्व' : 'Quality'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {choghadiyaSuite.dayChoghadiya.map((c) => (
                      <tr key={`day-${c.index}`}>
                        <td>
                          <strong>{lang === 'hi' ? c.nameHi : c.nameEn}</strong>{' '}
                          <span className="muted small-text">({lang === 'hi' ? c.rulerHi : c.rulerEn})</span>
                        </td>
                        <td className="mono small-cell">{c.startTime} – {c.endTime}</td>
                        <td>
                          <span
                            className={`tag ${
                              c.quality === 'best' || c.quality === 'good'
                                ? 'tag-varg'
                                : c.quality === 'neutral'
                                  ? 'tag-karaka'
                                  : 'tag-combust'
                            }`}
                          >
                            {lang === 'hi' ? c.qualityLabelHi : c.qualityLabelEn}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <h4 className="subpanel-heading">{lang === 'hi' ? 'रात का चौघड़िया (Night)' : 'Night Choghadiya'}</h4>
              <div className="table-scroll">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>{lang === 'hi' ? 'चौघड़िया' : 'Muhurta'}</th>
                      <th>{t.common.period}</th>
                      <th>{lang === 'hi' ? 'शुभत्व' : 'Quality'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {choghadiyaSuite.nightChoghadiya.map((c) => (
                      <tr key={`night-${c.index}`}>
                        <td>
                          <strong>{lang === 'hi' ? c.nameHi : c.nameEn}</strong>{' '}
                          <span className="muted small-text">({lang === 'hi' ? c.rulerHi : c.rulerEn})</span>
                        </td>
                        <td className="mono small-cell">{c.startTime} – {c.endTime}</td>
                        <td>
                          <span
                            className={`tag ${
                              c.quality === 'best' || c.quality === 'good'
                                ? 'tag-varg'
                                : c.quality === 'neutral'
                                  ? 'tag-karaka'
                                  : 'tag-combust'
                            }`}
                          >
                            {lang === 'hi' ? c.qualityLabelHi : c.qualityLabelEn}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <h3>{lang === 'hi' ? 'गौरी पंचांगम (Gowri Panchangam)' : 'Gowri Panchangam (Day & Night)'}</h3>
          </div>
          <div className="table-scroll max-h-340">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{lang === 'hi' ? 'भाग' : 'Span'}</th>
                  <th>{lang === 'hi' ? 'नाम' : 'Gowri Slot'}</th>
                  <th>{t.common.period}</th>
                </tr>
              </thead>
              <tbody>
                {[...choghadiyaSuite.dayGowri, ...choghadiyaSuite.nightGowri].map((g) => (
                  <tr key={`${g.period}-${g.index}`}>
                    <td>{g.period === 'day' ? (lang === 'hi' ? 'दिन' : 'Day') : (lang === 'hi' ? 'रात्रि' : 'Night')} #{g.index}</td>
                    <td>
                      <span
                        className={`tag ${
                          g.quality === 'good' ? 'tag-varg' : g.quality === 'neutral' ? 'tag-karaka' : 'tag-combust'
                        }`}
                      >
                        {lang === 'hi' ? g.nameHi : g.nameEn}
                      </span>
                    </td>
                    <td className="mono small-cell">{g.startTime} – {g.endTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Ashtakavarga Gochara Kakshas (3°45' Windows) & AV Yogas */}
      <div className="basics-bottom-grid">
        <section className="panel">
          <div className="panel-header">
            <h3>
              {lang === 'hi'
                ? 'अष्टकवर्ग गोचर कक्ष्या (3°45\' सूक्ष्म बिंदु फल)'
                : "Ashtakavarga Gochara Kakshas (3°45' Precision Transit Bands)"}
            </h3>
            <span className="muted">
              {lang === 'hi'
                ? 'शनि से लग्न तक 8 कक्ष्या स्वामी — 1 बिंदु होने पर गोचर फलदायी'
                : '8 Kaksha Lords (Saturn → Lagna) · Bindu = 1 yields concrete transit results'}
            </span>
          </div>
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t.common.planet}</th>
                  <th>{t.common.sign} / DMS</th>
                  <th>{lang === 'hi' ? 'कक्ष्या खंड' : 'Kaksha'}</th>
                  <th>{lang === 'hi' ? 'कक्ष्या स्वामी' : 'Lord'}</th>
                  <th>{lang === 'hi' ? 'बिंदु' : 'Bindu'}</th>
                  <th>BAV / SAV</th>
                </tr>
              </thead>
              <tbody>
                {kakshaRows.map((kr) => (
                  <tr key={kr.planet}>
                    <td><strong>{trPlanet(kr.planet, lang)}</strong></td>
                    <td className="mono small-cell">{trSign(kr.signIndex, lang)} {kr.dms}</td>
                    <td className="mono small-cell">#{kr.kakshaNumber} ({kr.kakshaRange})</td>
                    <td><strong>{kr.kakshaLord === 'Asc' ? (lang === 'hi' ? 'लग्न' : 'Lagna') : trPlanet(kr.kakshaLord, lang)}</strong></td>
                    <td>
                      <span className={`tag ${kr.kakshaBindu === 1 ? 'tag-varg' : 'tag-combust'}`}>
                        {kr.kakshaBindu === 1 ? (lang === 'hi' ? '1 (शुभ ✓)' : '1 ✓ Benefic') : (lang === 'hi' ? '0 (न्यून)' : '0 Weak')}
                      </span>
                    </td>
                    <td className="mono">{kr.bhinnaBindus}/8 · {kr.sarvaBindus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <h3>
              {lang === 'hi'
                ? 'सूर्य / चंद्र / SAV अष्टकवर्ग योग'
                : 'Classical Sun, Moon & SAV Ashtakavarga Yogas'}
            </h3>
          </div>
          <div className="cards-list pad-14">
            {avYogas.map((yg, idx) => (
              <article
                key={idx}
                className={`yoga-card ${
                  yg.nature === 'Benefic' ? 'tone-benefic' : yg.nature === 'Caution' ? 'tone-dosha' : 'tone-mixed'
                }`}
              >
                <div className="yoga-head">
                  <strong>{lang === 'hi' ? yg.nameHi : yg.nameEn}</strong>
                  <span className="tag tag-karaka">{yg.planetOrHouse}</span>
                </div>
                <p className="yoga-desc">{lang === 'hi' ? yg.effectHi : yg.effectEn}</p>
                <div className="muted small-text">{yg.basis}</div>
              </article>
            ))}
          </div>
        </section>
      </div>
        </>
      )}
    </div>
  );
};
