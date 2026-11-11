import React, { useMemo } from 'react';
import { Calendar, Sparkles } from 'lucide-react';
import { computeFullLalKitabReport } from '../../astro/lalKitabExtended';
import { predictDashaDetail } from '../../astro/predictions/dashaPrashna';
import type { PredictionReport } from '../../astro/predictions/types';
import { formatDateDmy, formatLocalDateTimeFromUtc } from '../../astro/time';
import type { ChartData, ChartStyle } from '../../astro/types';
import { localizeDashaDetailHi, trBadge } from '../../i18n/hindiPredictions';
import { useLanguage } from '../../i18n/LanguageContext';
import { trPlanet, trPlanetShort, trSign } from '../../i18n/translations';
import { VedicChartSvg } from '../VedicChartSvg';

export const DashaWisePanel: React.FC<{
  chart: ChartData;
  report: PredictionReport;
}> = ({ chart, report }) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';

  const allMahadashaCards = useMemo(() => {
    return chart.vimshottari.map((md) => {
      const startStr = formatDateDmy(formatLocalDateTimeFromUtc(md.startMs, chart.offsetMinutesUsed).slice(0, 10));
      const endStr = formatDateDmy(formatLocalDateTimeFromUtc(md.endMs, chart.offsetMinutesUsed).slice(0, 10));
      const rawDetail = predictDashaDetail({
        chart,
        system: 'vimshottari',
        mdLordRaw: md.lord,
        startMs: md.startMs,
        endMs: md.endMs,
      });
      const detail = isHi ? localizeDashaDetailHi(rawDetail, chart, 'mahadasha') : rawDetail;
      const isRunning = Date.now() >= md.startMs && Date.now() < md.endMs;
      return { md, startStr, endStr, detail, isRunning };
    });
  }, [chart, isHi]);

  const lkDashas = useMemo(() => computeFullLalKitabReport(chart).dasha35.slice(0, 9), [chart]);

  return (
    <div className="view-stack">
      {/* 1. Target Date Active MD/AD/PD */}
      <section className="panel">
        <div className="panel-header">
          <h3>
            <Calendar size={15} />{' '}
            {isHi
              ? `सक्रिय विंशोत्तरी दशा फलादेश (${formatDateDmy(report.dashaForecast.targetDate)})`
              : `Active Vimshottari Dasha Prediction (${formatDateDmy(report.dashaForecast.targetDate)})`}
          </h3>
          <div className="toolbar-group">
            <span className="tag tag-karaka">
              {report.dashaForecast.mahadashaLord} / {report.dashaForecast.antardashaLord} /{' '}
              {report.dashaForecast.pratyantardashaLord}
            </span>
            <span
              className={`tag ${
                report.dashaForecast.favorability === 'Very Favorable' ||
                report.dashaForecast.favorability === 'Supportive'
                  ? 'tag-varg'
                  : 'tag-retro'
              }`}
            >
              {trBadge(report.dashaForecast.favorability, lang)}
            </span>
          </div>
        </div>
        <div className="pred-card-body">
          <p className="lead-text">{report.dashaForecast.summary}</p>
          <div className="pred-bullets">
            <div>
              <strong>{isHi ? 'महादशा फल:' : 'Mahadasha'} ({report.dashaForecast.mahadashaLord}):</strong>{' '}
              {report.dashaForecast.mahadashaReading}
            </div>
            <div>
              <strong>{isHi ? 'अंतरदशा फल:' : 'Antardasha'} ({report.dashaForecast.antardashaLord}):</strong>{' '}
              {report.dashaForecast.antardashaReading}
            </div>
            <div>
              <strong>{isHi ? 'दशा मार्गदर्शन:' : 'Timing Guidance:'}</strong>{' '}
              {report.dashaForecast.guidance}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Complete 120-Year 9 Mahadasha Life Timeline */}
      <section className="panel">
        <div className="panel-header">
          <h3>
            <Sparkles size={15} />{' '}
            {isHi
              ? 'संपूर्ण जीवन विंशोत्तरी महादशा फलादेश (सभी 9 महादशाएँ — 120 वर्ष)'
              : 'Life-long Mahadasha Forecast Timeline (All Vimshottari Chapters · 120 Years)'}
          </h3>
        </div>
        <div className="domains-grid">
          {allMahadashaCards.map(({ md, startStr, endStr, detail, isRunning }, i) => (
            <article key={`${md.lord}-${i}`} className="domain-card">
              <div className="domain-top">
                <div>
                  <h4>
                    {trPlanet(md.lord, lang)} {isHi ? 'महादशा' : 'Mahadasha'}{' '}
                    {isRunning && (
                      <span className="tag tag-varg">{isHi ? 'वर्तमान सक्रिय' : 'Active Now'}</span>
                    )}
                  </h4>
                  <div className="muted small-text mono">
                    {startStr} → {endStr} ({(md.durationDays / 365.2425).toFixed(1)}{' '}
                    {isHi ? 'वर्ष' : 'yrs'})
                  </div>
                </div>
                <div className="domain-score-badge">
                  <strong className={`mono ${detail.score >= 65 ? 'tone-text-high' : 'tone-text-mid'}`}>
                    {detail.score}
                  </strong>
                  <span>/100</span>
                </div>
              </div>
              <div className="domain-verdict-row">
                <span className={`tag ${detail.score >= 62 ? 'tag-varg' : 'tag-retro'}`}>
                  {trBadge(detail.favorability, lang)}
                </span>
                <span className="muted small-text mono">
                  {isHi ? 'सक्रिय भाव:' : 'Houses:'} {detail.activatedHouses.join(', ')}
                </span>
              </div>
              <p className="domain-summary">{detail.mdSummary}</p>
              <p className="yoga-desc muted">{detail.guidance}</p>
            </article>
          ))}
        </div>
      </section>

      {/* 3. Jaimini Chara & Lal Kitab 35-Yr Dasha Comparison */}
      <div className="pred-top-grid">
        <section className="panel">
          <div className="panel-header">
            <h3>{isHi ? 'जैमिनी चर दशा फल' : 'Jaimini Chara Dasha Predictions'}</h3>
          </div>
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{isHi ? 'राशि' : 'Sign'}</th>
                  <th>{isHi ? 'अवधि' : 'Period'}</th>
                  <th>{isHi ? 'फलादेश' : 'Prediction'}</th>
                </tr>
              </thead>
              <tbody>
                {report.jaiminiReport.charaDasha.map((cd, i) => (
                  <tr key={i}>
                    <td><strong>{cd.signName}</strong></td>
                    <td className="mono">{formatDateDmy(cd.startDate)} → {formatDateDmy(cd.endDate)} ({cd.years}{isHi ? 'व' : 'y'})</td>
                    <td className="wrap-cell">{cd.reading}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <h3>{isHi ? 'लाल किताब 35-वर्षीय दशा चक्र (प्रथम चक्र)' : 'Lal Kitab 35-Year Dasha Cycle (Cycle 1)'}</h3>
          </div>
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{isHi ? 'ग्रह' : 'Planet'}</th>
                  <th>{isHi ? 'आयु / वर्ष' : 'Age'}</th>
                  <th>{isHi ? 'फलादेश' : 'Effect'}</th>
                </tr>
              </thead>
              <tbody>
                {lkDashas.map((row, idx) => (
                  <tr key={idx}>
                    <td><strong>{trPlanet(row.planet, lang)}</strong> ({row.years}{isHi ? 'व' : 'y'})</td>
                    <td className="mono">{row.startAge}–{row.endAge}</td>
                    <td className="wrap-cell">{isHi ? row.effectHi : row.effectEn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export const GocharWisePanel: React.FC<{
  chart: ChartData;
  chartStyle: ChartStyle;
  report: PredictionReport;
  gocharRef: 'moon' | 'lagna';
  setGocharRef: (r: 'moon' | 'lagna') => void;
}> = ({ chart, chartStyle, report, gocharRef, setGocharRef }) => {
  const { lang, t } = useLanguage();
  const isHi = lang === 'hi';
  const natalMoonSign = chart.planets.find((p) => p.id === 'Moon')!.signIndex;
  const refSign = gocharRef === 'moon' ? natalMoonSign : chart.ascendant.signIndex;

  return (
    <div className="view-stack">
      <div className="varga-focus-grid">
        <VedicChartSvg
          title={
            isHi
              ? `गोचर कुंडली (${formatDateDmy(report.deepGochar.targetDate)})`
              : `Gochar Chart (${formatDateDmy(report.deepGochar.targetDate)})`
          }
          subtitle={
            isHi
              ? `आधार: ${gocharRef === 'moon' ? `जन्म राशि (${report.transitForecast.janmaRasi})` : `जन्म लग्न (${trSign(chart.ascendant.signIndex, lang)})`}`
              : `From ${gocharRef === 'moon' ? `Janma Rasi (${report.transitForecast.janmaRasi})` : `Natal Lagna (${chart.ascendant.signName})`}`
          }
          style={chartStyle}
          lagnaSignIndex={refSign}
          savBindus={chart.ashtakavarga.sarva}
          centerLabel={isHi ? 'गोचर' : 'GOCHAR'}
          items={[
            {
              id: 'Ref',
              label: isHi ? (gocharRef === 'moon' ? 'जन्म' : 'लग्न') : (gocharRef === 'moon' ? 'Mo*' : 'As*'),
              signIndex: refSign,
              isLagna: true,
            },
            ...report.deepGochar.transitChart.planets.map((p) => ({
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
            <h3>
              {isHi
                ? 'गुरु–शनि दोहरा गोचर एवं साढ़ेसाती फलादेश'
                : 'Gochar Highlights: Double Transit (Guru–Shani) & Sade Sati'}
            </h3>
            <div className="subtab-bar">
              <button
                type="button"
                className={`subtab-btn ${gocharRef === 'moon' ? 'is-active' : ''}`}
                onClick={() => setGocharRef('moon')}
              >
                {isHi ? 'चंद्र से' : 'From Moon'}
              </button>
              <button
                type="button"
                className={`subtab-btn ${gocharRef === 'lagna' ? 'is-active' : ''}`}
                onClick={() => setGocharRef('lagna')}
              >
                {isHi ? 'लग्न से' : 'From Lagna'}
              </button>
            </div>
          </div>

          <div className="gochar-highlights">
            <div className="gochar-banner is-info">
              <strong>{isHi ? 'दोहरा गोचर प्रभाव:' : 'Double Transit Activation:'}</strong>{' '}
              {report.deepGochar.overallSummary}
            </div>
            <div
              className={`gochar-banner ${
                report.transitForecast.sadeSatiStatus.active ? 'is-alert' : 'is-clear'
              }`}
            >
              <strong>
                {isHi ? 'शनि चक्र' : 'Saturn Cycle'} ({report.transitForecast.sadeSatiStatus.phase}):
              </strong>{' '}
              {report.transitForecast.sadeSatiStatus.description}
            </div>
            <div className="gochar-banner is-clear">
              <strong>{isHi ? 'बृहस्पति गोचर:' : 'Jupiter Transit:'}</strong>{' '}
              {report.transitForecast.jupiterTransitNote}
            </div>
          </div>

          {report.deepGochar.doubleTransitHouses.length > 0 && (
            <div className="panel-subblock">
              <h4>
                {isHi ? 'गुरु व शनि दोनों से सक्रिय भाव' : 'Houses Triggered by Both Jupiter & Saturn'}
              </h4>
              <ul className="domain-details">
                {report.deepGochar.doubleTransitHouses.map((dt) => (
                  <li key={dt.house}>
                    <strong>
                      {isHi ? `भाव ${dt.house}` : `House ${dt.house}`} ({dt.signName}) — {dt.savBindus} SAV:
                    </strong>{' '}
                    {dt.meaning}{' '}
                    <em>
                      ({trPlanet('Jupiter', lang)}: {dt.jupiterLink}; {trPlanet('Saturn', lang)}:{' '}
                      {dt.saturnLink})
                    </em>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </div>

      <section className="panel">
        <div className="panel-header">
          <h3>
            {isHi
              ? `गोचर फलादेश तालिका: राशि, D9/D10, कक्ष्या बिंदु व वेध (${formatDateDmy(report.deepGochar.targetDate)})`
              : `Gochar Transit Matrix: Rasi, D9/D10, Kakshya Bindu & Vedha (${formatDateDmy(report.deepGochar.targetDate)})`}
          </h3>
          <span className="tag">{report.transitForecast.sources.join(' · ')}</span>
        </div>

        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t.common.planet}</th>
                <th>{isHi ? 'राशि गोचर' : 'Rasi Transit'}</th>
                <th>{isHi ? 'चंद्र / लग्न भाव' : 'Moon / Lagna H'}</th>
                <th>{isHi ? 'D9 / D10 गोचर' : 'D9 / D10 Transit'}</th>
                <th>{isHi ? 'कक्ष्या बिंदु' : 'Kakshya Bindu'}</th>
                <th>{isHi ? 'तारा / वेध' : 'Tara / Vedha'}</th>
                <th>{isHi ? 'परिणाम' : 'Verdict'}</th>
                <th>{isHi ? 'गहन फलादेश' : 'Gochar Interpretation'}</th>
              </tr>
            </thead>
            <tbody>
              {report.deepGochar.items.map((item) => (
                <tr key={item.planet}>
                  <td><strong>{trPlanet(item.planet, lang)}</strong></td>
                  <td>{item.transitSign}</td>
                  <td className="mono">
                    {t.common.house}{item.houseFromMoon} / {t.common.house}{item.houseFromLagna}
                  </td>
                  <td className="small-cell">
                    D9: {item.d9TransitSign} ({t.common.house}{item.d9HouseFromNatalD9Lagna}) · D10:{' '}
                    {item.d10TransitSign}
                  </td>
                  <td>
                    <span className={`tag ${item.kakshyaHasBindu ? 'tag-varg' : 'tag-retro'}`}>
                      {trPlanet(item.kakshyaLord, lang)} (
                      {item.kakshyaHasBindu ? (isHi ? 'बिंदु ✓' : 'Bindu ✓') : '0'})
                    </span>
                  </td>
                  <td className="small-cell">
                    <span className={item.taraGood ? 'cell-strong' : 'cell-weak'}>{item.taraName}</span>
                    {item.hasVedha ? ` · ${isHi ? 'वेध:' : 'Vedha:'} ${item.vedhaPlanet}` : ''}
                  </td>
                  <td>
                    <span
                      className={`tag ${
                        item.verdict.includes('Auspicious')
                          ? 'tag-varg'
                          : item.verdict === 'Testing'
                            ? 'tag-combust'
                            : 'tag-karaka'
                      }`}
                    >
                      {trBadge(item.verdict, lang)}
                    </span>
                  </td>
                  <td className="wrap-cell">{item.reading}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
