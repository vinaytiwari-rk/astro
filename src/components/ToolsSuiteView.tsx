import React, { useEffect, useMemo, useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  Feather,
  Flame,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { computeAvasthasAndUpagrahas } from '../astro/avasthasUpagrahas';
import { computeBtrSnapshot } from '../astro/btr';
import { calculateChart } from '../astro/calculator';
import {
  computeMultiYearCalendar,
  findAuspiciousMuhurtas,
  type MuhurtaPurpose,
} from '../astro/muhurtaCalendar';
import {
  ACTIVITY_META,
  BIRD_META,
  computePanchaPakshiDay,
} from '../astro/panchaPakshiAndKaksha';
import { computeAnnualHinduCalendar } from '../astro/panchangExtra';
import {
  computeDeepPanchangMuhurta,
  type LunarMonthSystem,
} from '../astro/panchangMuhurtaDeep';
import {
  compute24HourHoraTable,
  computeDoGhatiMuhurta,
  computeMonthlyPanchang,
} from '../astro/vedicUtilities';
import { evaluateParamayusStatus } from '../astro/predictions/paramayus';
import { formatDateDmy } from '../astro/time';
import type { BirthInput, CalcSettings, ChartData } from '../astro/types';
import {
  localizeAvasthasHi,
  localizeBtrHi,
  localizeCalendarHi,
  localizeMuhurtasHi,
  trBadge,
} from '../i18n/hindiPredictions';
import { useLanguage } from '../i18n/LanguageContext';
import { trPlanet, trPlanetShort, trTerm } from '../i18n/translations';
import { DateDmyInput } from './DateDmyInput';
import { ParamayusLockBanner } from './ParamayusLockBanner';

interface ToolsSuiteViewProps {
  chart: ChartData;
  baseInput: BirthInput;
  settings: CalcSettings;
  onApplyRectifiedTime: (newDate: string, newTime: string) => void;
  requestedSubTab?: { id?: string; nonce: number };
}

type ToolSubTab =
  | 'btr'
  | 'avasthas'
  | 'panchapakshi'
  | 'deep_panchang'
  | 'do_ghati'
  | 'hora_24'
  | 'monthly_panchang'
  | 'muhurta'
  | 'calendar';

export const ToolsSuiteView: React.FC<ToolsSuiteViewProps> = ({
  chart,
  baseInput,
  settings,
  onApplyRectifiedTime,
  requestedSubTab,
}) => {
  const { lang, t } = useLanguage();
  const [subTab, setSubTab] = useState<ToolSubTab>('btr');

  useEffect(() => {
    const id = requestedSubTab?.id;
    if (
      id === 'btr' ||
      id === 'avasthas' ||
      id === 'panchapakshi' ||
      id === 'deep_panchang' ||
      id === 'do_ghati' ||
      id === 'hora_24' ||
      id === 'monthly_panchang' ||
      id === 'muhurta' ||
      id === 'calendar'
    ) {
      setSubTab(id);
    } else if (id === 'calendar_2027') {
      setSubTab('calendar');
      setFestYear(2027);
    } else if (id === 'muhurta_2027') {
      setSubTab('muhurta');
      setMuhurtaStart('2027-01-01');
    }
  }, [requestedSubTab?.nonce, requestedSubTab?.id]);

  // Pancha Pakshi & Deep Panchang Date/Time/System controls
  const [pakshiDate, setPakshiDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [pakshiTime, setPakshiTime] = useState(() => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  });
  const [lunarSystem, setLunarSystem] = useState<LunarMonthSystem>('purnimanta');

  const momentChartForTools = useMemo(
    () =>
      calculateChart(
        {
          ...baseInput,
          id: 'tools-moment',
          name: 'Tools Moment',
          date: pakshiDate,
          time: `${pakshiTime}:00`,
        },
        settings
      ),
    [baseInput, pakshiDate, pakshiTime, settings]
  );

  const paramayus = useMemo(() => evaluateParamayusStatus(chart), [chart]);

  const pakshiReport = useMemo(
    () =>
      paramayus.exceeded
        ? null
        : computePanchaPakshiDay(
            chart,
            pakshiDate,
            pakshiTime,
            chart.input.latitude,
            chart.input.longitude,
            chart.offsetMinutesUsed,
            momentChartForTools.panchang.tithi.paksha
          ),
    [paramayus.exceeded, chart, pakshiDate, pakshiTime, momentChartForTools.panchang.tithi.paksha]
  );

  const deepPanchang = useMemo(
    () =>
      computeDeepPanchangMuhurta(
        pakshiDate,
        pakshiTime,
        chart.input.latitude,
        chart.input.longitude,
        chart.offsetMinutesUsed,
        settings,
        lunarSystem,
        momentChartForTools
      ),
    [pakshiDate, pakshiTime, chart.input.latitude, chart.input.longitude, chart.offsetMinutesUsed, settings, lunarSystem, momentChartForTools]
  );

  // BTR state
  const [offsetSeconds, setOffsetSeconds] = useState<number>(0);
  const rawBtr = useMemo(
    () => computeBtrSnapshot(baseInput, settings, offsetSeconds),
    [baseInput, settings, offsetSeconds]
  );
  const btr = useMemo(() => (lang === 'hi' ? localizeBtrHi(rawBtr) : rawBtr), [rawBtr, lang]);

  // Avasthas & Upagrahas
  const rawAvasthaReport = useMemo(
    () => (paramayus.exceeded ? null : computeAvasthasAndUpagrahas(chart)),
    [paramayus.exceeded, chart]
  );
  const avasthaReport = useMemo(
    () => (rawAvasthaReport ? (lang === 'hi' ? localizeAvasthasHi(rawAvasthaReport) : rawAvasthaReport) : null),
    [rawAvasthaReport, lang]
  );

  // Muhurta Finder state
  const [purpose, setPurpose] = useState<MuhurtaPurpose>('marriage');
  const [muhurtaStart, setMuhurtaStart] = useState(() => new Date().toISOString().slice(0, 10));
  const [scanDays, setScanDays] = useState<number>(45);
  const rawMuhurtaResults = useMemo(
    () => (paramayus.exceeded ? [] : findAuspiciousMuhurtas(chart, purpose, muhurtaStart, scanDays)),
    [paramayus.exceeded, chart, purpose, muhurtaStart, scanDays]
  );
  const muhurtaResults = useMemo(
    () => (lang === 'hi' ? localizeMuhurtasHi(rawMuhurtaResults) : rawMuhurtaResults),
    [rawMuhurtaResults, lang]
  );

  // 10-Year Transit & Eclipse Calendar
  const [calStart] = useState(() => new Date().toISOString().slice(0, 10));
  const rawCalendarReport = useMemo(
    () =>
      paramayus.exceeded
        ? { ingresses: [], sadeSatiWindows: [], eclipses: [] }
        : computeMultiYearCalendar(chart, calStart, 10),
    [paramayus.exceeded, chart, calStart]
  );
  const calendarReport = useMemo(
    () => (lang === 'hi' ? localizeCalendarHi(rawCalendarReport) : rawCalendarReport),
    [rawCalendarReport, lang]
  );

  // Annual Hindu Festival & Vrat Calendar
  const [festYear, setFestYear] = useState<number>(() => new Date().getFullYear());
  const [festCat, setFestCat] = useState<'all' | 'festival' | 'ekadashi' | 'sankranti' | 'purnima_amavasya'>('festival');
  const hinduEvents = useMemo(
    () =>
      computeAnnualHinduCalendar(
        festYear,
        settings.ayanamsa,
        chart.offsetMinutesUsed,
        chart.input.latitude,
        chart.input.longitude
      ),
    [festYear, settings.ayanamsa, chart.offsetMinutesUsed, chart.input.latitude, chart.input.longitude]
  );
  const filteredFestivals = useMemo(
    () => (festCat === 'all' ? hinduEvents : hinduEvents.filter((e) => e.category === festCat)),
    [hinduEvents, festCat]
  );

  // Do Ghati, 24h Hora & Monthly Panchang state
  const [monthYear, setMonthYear] = useState<number>(() => new Date().getFullYear());
  const [monthNum, setMonthNum] = useState<number>(() => new Date().getMonth() + 1);
  const doGhatiSlots = useMemo(
    () =>
      computeDoGhatiMuhurta(
        pakshiDate,
        chart.input.latitude,
        chart.input.longitude,
        chart.offsetMinutesUsed
      ),
    [pakshiDate, chart.input.latitude, chart.input.longitude, chart.offsetMinutesUsed]
  );
  const hora24Slots = useMemo(
    () =>
      compute24HourHoraTable(
        pakshiDate,
        chart.input.latitude,
        chart.input.longitude,
        chart.offsetMinutesUsed
      ),
    [pakshiDate, chart.input.latitude, chart.input.longitude, chart.offsetMinutesUsed]
  );
  const monthlyPanchangRows = useMemo(
    () =>
      subTab === 'monthly_panchang'
        ? computeMonthlyPanchang(monthYear, monthNum, baseInput, settings)
        : [],
    [subTab, monthYear, monthNum, baseInput, settings]
  );

  const formatOffsetLabel = (sec: number) => {
    const sign = sec >= 0 ? '+' : '-';
    const abs = Math.abs(sec);
    const m = Math.floor(abs / 60);
    const s = abs % 60;
    return `${sign}${m}${lang === 'hi' ? 'मि' : 'm'} ${String(s).padStart(2, '0')}${lang === 'hi' ? 'से' : 's'}`;
  };

  return (
    <div className="view-stack">
      <div className="tools-grouped-bar">
        <div className="tools-group-row">
          <span className="tools-group-label">
            {lang === 'hi' ? 'कुंडली एवं सूक्ष्म काल' : 'Natal & Subtle Timing'}
          </span>
          <div className="tools-group-pills">
            <button
              type="button"
              className={`subtab-btn ${subTab === 'btr' ? 'is-active' : ''}`}
              onClick={() => setSubTab('btr')}
            >
              <Clock size={13} /> {t.toolsTabs.btr}
            </button>
            <button
              type="button"
              className={`subtab-btn ${subTab === 'avasthas' ? 'is-active' : ''}`}
              onClick={() => setSubTab('avasthas')}
            >
              <Flame size={13} /> {t.toolsTabs.avasthas}
            </button>
            <button
              type="button"
              className={`subtab-btn ${subTab === 'panchapakshi' ? 'is-active' : ''}`}
              onClick={() => setSubTab('panchapakshi')}
            >
              <Feather size={13} /> {lang === 'hi' ? 'पंच पक्षी शास्त्र' : 'Pancha Pakshi (5-Bird)'}
            </button>
          </div>
        </div>

        <div className="tools-group-row">
          <span className="tools-group-label">
            {lang === 'hi' ? 'पंचांग, होरा व मुहूर्त' : 'Panchang, Hora & Calendars'}
          </span>
          <div className="tools-group-pills">
            <button
              type="button"
              className={`subtab-btn ${subTab === 'deep_panchang' ? 'is-active' : ''}`}
              onClick={() => setSubTab('deep_panchang')}
            >
              <ShieldCheck size={13} />{' '}
              {lang === 'hi' ? 'संवत्सर, शूल व वास' : 'Samvatsara · Shoola/Vaasa'}
            </button>
            <button
              type="button"
              className={`subtab-btn ${subTab === 'do_ghati' ? 'is-active' : ''}`}
              onClick={() => setSubTab('do_ghati')}
            >
              <Clock size={13} /> {lang === 'hi' ? 'दो-घटी मुहूर्त (30)' : 'Do Ghati Muhurat'}
            </button>
            <button
              type="button"
              className={`subtab-btn ${subTab === 'hora_24' ? 'is-active' : ''}`}
              onClick={() => setSubTab('hora_24')}
            >
              <Clock size={13} /> {lang === 'hi' ? '24 घंटे होरा' : '24h Hora'}
            </button>
            <button
              type="button"
              className={`subtab-btn ${subTab === 'monthly_panchang' ? 'is-active' : ''}`}
              onClick={() => setSubTab('monthly_panchang')}
            >
              <Calendar size={13} /> {lang === 'hi' ? 'मासिक पंचांग' : 'Monthly Panchang'}
            </button>
            <button
              type="button"
              className={`subtab-btn ${subTab === 'muhurta' ? 'is-active' : ''}`}
              onClick={() => setSubTab('muhurta')}
            >
              <Search size={13} /> {t.toolsTabs.muhurta}
            </button>
            <button
              type="button"
              className={`subtab-btn ${subTab === 'calendar' ? 'is-active' : ''}`}
              onClick={() => setSubTab('calendar')}
            >
              <Calendar size={13} /> {t.toolsTabs.calendar}
            </button>
          </div>
        </div>
      </div>

      {paramayus.exceeded &&
        (subTab === 'avasthas' ||
          subTab === 'panchapakshi' ||
          subTab === 'muhurta' ||
          subTab === 'calendar') && <ParamayusLockBanner status={paramayus} />}

      {/* 1. Birth Time Rectification (BTR) */}
      {subTab === 'btr' && (
        <section className="panel">
          <div className="panel-header">
            <h3>
              <Compass size={15} />{' '}
              {lang === 'hi'
                ? 'जन्म समय संशोधन (BTR — D9, D10, D60, KP एवं प्राणपद लग्न)'
                : 'Birth Time Rectification (BTR — D9, D10, D60, KP & Pranapada)'}
            </h3>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              disabled={offsetSeconds === 0}
              onClick={() => {
                onApplyRectifiedTime(btr.rectifiedDate, btr.rectifiedTime);
                setOffsetSeconds(0);
              }}
            >
              <CheckCircle2 size={14} />
              {lang === 'hi'
                ? `संशोधित समय लागू करें (${btr.rectifiedTime})`
                : `Apply Rectified Time (${btr.rectifiedTime})`}
            </button>
          </div>

          <div className="pred-card-body">
            <div className="btr-controls">
              <div className="btr-slider-row">
                <span className="muted">{lang === 'hi' ? 'समय बदलाव (±30 मिनट):' : 'Shift (±30 min):'}</span>
                <input
                  type="range"
                  min={-1800}
                  max={1800}
                  step={15}
                  value={offsetSeconds}
                  onChange={(e) => setOffsetSeconds(Number(e.target.value))}
                  className="btr-range"
                />
                <strong className="mono">{formatOffsetLabel(offsetSeconds)}</strong>
              </div>

              <div className="toolbar-group">
                {[-300, -60, -15, 0, 15, 60, 300].map((delta) => (
                  <button
                    key={delta}
                    type="button"
                    className="btn btn-secondary btn-sm mono"
                    onClick={() =>
                      setOffsetSeconds((cur) =>
                        delta === 0 ? 0 : Math.max(-1800, Math.min(1800, cur + delta))
                      )
                    }
                  >
                    {delta === 0
                      ? (lang === 'hi' ? 'रीसेट' : 'Reset')
                      : delta > 0
                        ? `+${delta}${lang === 'hi' ? 'से' : 's'}`
                        : `${delta}${lang === 'hi' ? 'से' : 's'}`}
                  </button>
                ))}
              </div>
            </div>

            <div className="branch-highlights">
              <div className="highlight-box">
                <span className="muted small-text">{lang === 'hi' ? 'संशोधित दिनांक व समय' : 'Rectified Date & Time'}</span>
                <strong className="mono">
                  {btr.rectifiedDate} {btr.rectifiedTime}
                </strong>
              </div>
              <div className="highlight-box">
                <span className="muted small-text">{lang === 'hi' ? 'D1 लग्न व KP उप-स्वामी' : 'D1 Lagna & KP Sub-Lord'}</span>
                <strong>
                  {btr.d1LagnaSign} <span className="mono">{btr.d1LagnaDms}</span> · {lang === 'hi' ? 'उप:' : 'SL:'}{' '}
                  {btr.kpAscSubLord}
                </strong>
              </div>
              <div className="highlight-box">
                <span className="muted small-text">{lang === 'hi' ? 'वर्ग लग्न (D9 · D10 · D60)' : 'Varga Lagnas (D9 · D10 · D60)'}</span>
                <strong>
                  D9: {btr.d9LagnaSign} · D10: {btr.d10LagnaSign} · D60: {btr.d60LagnaSign}
                </strong>
              </div>
              <div className="highlight-box">
                <span className="muted small-text">{lang === 'hi' ? 'प्राणपद व कुंद मिलान' : 'Pranapada & Kunda Check'}</span>
                <strong>
                  {lang === 'hi' ? 'प्राणपद:' : 'PP:'} {btr.pranapadaSign} ({btr.pranapadaAligned ? (lang === 'hi' ? 'मिलान ✓' : 'Aligned ✓') : (lang === 'hi' ? 'अंतर' : 'Offset')}) · {lang === 'hi' ? 'कुंद:' : 'Kunda:'}{' '}
                  {btr.kundaSign} ({btr.kundaAligned ? (lang === 'hi' ? 'मिलान ✓' : 'Aligned ✓') : (lang === 'hi' ? 'अंतर' : 'Offset')})
                </strong>
              </div>
            </div>

            <div className={`gochar-banner ${btr.pranapadaAligned || btr.kundaAligned ? 'is-clear' : 'is-info'}`}>
              <strong>{lang === 'hi' ? 'BPHS संशोधन टिप्पणी:' : 'BPHS Rectification Note:'}</strong> {btr.alignmentNote}
            </div>
          </div>
        </section>
      )}

      {/* 2. Planetary Avasthas, Graha Yuddha, Upagrahas & Bhrigu Bindu */}
      {subTab === 'avasthas' && !paramayus.exceeded && avasthaReport && (
        <div className="view-stack">
          <div className="branch-highlights">
            <div className="highlight-box">
              <span className="muted small-text">{lang === 'hi' ? 'भृगु बिंदु (राहु–चंद्र मध्य बिंदु)' : 'Bhrigu Bindu (Rahu–Moon Midpoint)'}</span>
              <strong>
                {avasthaReport.bhriguBindu.signName} {avasthaReport.bhriguBindu.dms} ({lang === 'hi' ? `भाव ${avasthaReport.bhriguBindu.house}` : `House ${avasthaReport.bhriguBindu.house}`})
              </strong>
              <span className="muted small-text">{avasthaReport.bhriguBindu.note}</span>
            </div>
            <div className="highlight-box">
              <span className="muted small-text">{lang === 'hi' ? 'बीज स्फुट (पुरुष संतान क्षमता बिंदु)' : 'Beeja Sphuta (Male Fertility Point)'}</span>
              <strong>
                {avasthaReport.beejaSphuta.signName} {avasthaReport.beejaSphuta.dms}
              </strong>
              <span className="muted small-text">{avasthaReport.beejaSphuta.strengthNote}</span>
            </div>
            <div className="highlight-box">
              <span className="muted small-text">{lang === 'hi' ? 'क्षेत्र स्फुट (स्त्री संतान क्षमता बिंदु)' : 'Kshetra Sphuta (Female Fertility Point)'}</span>
              <strong>
                {avasthaReport.kshetraSphuta.signName} {avasthaReport.kshetraSphuta.dms}
              </strong>
              <span className="muted small-text">{avasthaReport.kshetraSphuta.strengthNote}</span>
            </div>
          </div>

          {avasthaReport.grahaYuddha.length > 0 && (
            <section className="panel">
              <div className="panel-header">
                <h3>{lang === 'hi' ? 'ग्रह युद्ध (1° के भीतर ग्रहों का टकराव)' : 'Graha Yuddha (Planetary War Detected)'}</h3>
              </div>
              <div className="gochar-highlights">
                {avasthaReport.grahaYuddha.map((gy, i) => (
                  <div key={i} className="gochar-banner is-alert">
                    <strong>
                      {trPlanet(gy.winner, lang)} {lang === 'hi' ? 'बनाम' : 'vs'} {trPlanet(gy.loser, lang)} ({gy.separationDeg}°):
                    </strong>{' '}
                    {gy.note}
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="basics-bottom-grid">
            <section className="panel">
              <div className="panel-header">
                <h3>{lang === 'hi' ? 'ग्रह अवस्थाएँ (बालादि · जाग्रतादि · दीप्तादि)' : 'Planetary Avasthas (Baladi · Jagratadi · Deeptadi)'}</h3>
              </div>
              <div className="table-scroll">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>{t.common.planet}</th>
                      <th>{lang === 'hi' ? 'बालादि (आयु)' : 'Baladi (Age)'}</th>
                      <th>{lang === 'hi' ? 'जाग्रतादि' : 'Jagratadi'}</th>
                      <th>{lang === 'hi' ? 'दीप्तादि (भाव)' : 'Deeptadi (Mood)'}</th>
                      <th>{lang === 'hi' ? 'फल देने की क्षमता' : 'Delivery'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {avasthaReport.avasthas.map((a) => (
                      <tr key={a.planet}>
                        <td>
                          <strong>{trPlanet(a.planet, lang)}</strong>
                        </td>
                        <td>{a.baladi}</td>
                        <td>{trBadge(a.jagratadi, lang)}</td>
                        <td>{a.deeptadi}</td>
                        <td>
                          <span
                            className={`tag ${
                              a.resultCapacity.includes('Peak')
                                ? 'tag-varg'
                                : a.resultCapacity.includes('Subtle')
                                  ? 'tag-retro'
                                  : 'tag-karaka'
                            }`}
                          >
                            {a.resultCapacity}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="panel">
              <div className="panel-header">
                <h3>{lang === 'hi' ? 'उपग्रह (धूम से उपकेतु एवं कालवेला)' : 'Upagrahas (Dhuma..Upaketu & Kaalavelas)'}</h3>
              </div>
              <div className="table-scroll">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>{lang === 'hi' ? 'उपग्रह' : 'Upagraha'}</th>
                      <th>{lang === 'hi' ? 'राशि व अंश' : 'Sign & Deg'}</th>
                      <th>{t.common.house}</th>
                      <th>{lang === 'hi' ? 'प्रभाव' : 'Signification'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {avasthaReport.upagrahas.map((u) => (
                      <tr key={u.name}>
                        <td>
                          <strong>{u.name}</strong> ({trPlanetShort(u.shortLabel, lang)})
                        </td>
                        <td className="mono">
                          {u.signName} {u.dms}
                        </td>
                        <td className="mono">{t.common.house}{u.house}</td>
                        <td className="wrap-cell muted">{u.nature}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>
      )}

      {/* Pancha Pakshi Shastra (5-Bird Muhurta Biorhythm) */}
      {subTab === 'panchapakshi' && !paramayus.exceeded && pakshiReport && (
        <div className="view-stack">
          <div className="charts-toolbar">
            <div className="toolbar-group">
              <span className="label-muted">{t.common.date}:</span>
              <DateDmyInput
                compact
                className="select-compact mono"
                value={pakshiDate}
                ariaLabel={t.common.date}
                onChange={setPakshiDate}
              />
              <input
                type="time"
                className="select-compact mono"
                value={pakshiTime}
                onChange={(e) => setPakshiTime(e.target.value)}
              />
            </div>
            <span className="muted">
              {lang === 'hi' ? 'सूर्योदय / सूर्यास्त:' : 'Sunrise / Sunset:'}{' '}
              <strong className="mono">{pakshiReport.sunrise}</strong> /{' '}
              <strong className="mono">{pakshiReport.sunset}</strong>
            </span>
          </div>

          <section className="panel">
            <div className="panel-header">
              <h3>
                <Feather size={16} />{' '}
                {lang === 'hi'
                  ? 'पंच पक्षी शास्त्र (दैनिक याम एवं जन्म पक्षी शक्ति)'
                  : 'Pancha Pakshi Shastra (5-Bird Biorhythm & Daily Yamas)'}
              </h3>
              <span className="tag tag-varg">
                {lang === 'hi' ? pakshiReport.birthBirdHi : pakshiReport.birthBird} ·{' '}
                {pakshiReport.birthPaksha}
              </span>
            </div>

            <div className="two-col-split-pad">
              <div className="branch-highlights">
                <div className="highlight-box">
                  <span className="muted small-text">
                    {lang === 'hi' ? 'जन्म पक्षी व तत्व' : 'Janma Pakshi & Element'}
                  </span>
                  <strong>
                    {lang === 'hi' ? pakshiReport.birthBirdHi : pakshiReport.birthBird} (
                    {lang === 'hi' ? pakshiReport.elementHi : pakshiReport.elementEn})
                  </strong>
                </div>
                <div className="highlight-box">
                  <span className="muted small-text">
                    {lang === 'hi' ? 'वर्तमान सक्रिय अवस्था' : 'Current Active Bird State'}
                  </span>
                  <strong>
                    {lang === 'hi'
                      ? ACTIVITY_META[pakshiReport.currentYama.birthBirdActivity].hi
                      : pakshiReport.currentYama.birthBirdActivity}{' '}
                    ({pakshiReport.currentYama.startTime}–{pakshiReport.currentYama.endTime})
                  </strong>
                </div>
                <div className="highlight-box">
                  <span className="muted small-text">
                    {lang === 'hi' ? 'पुलिप्पानी शक्ति सूचकांक' : 'Pulippani Power Index'}
                  </span>
                  <strong className="mono">{pakshiReport.currentYama.strengthScore} / 1.00</strong>
                </div>
              </div>

              <div className="gochar-banner is-info">
                <strong>{lang === 'hi' ? 'सुझाव:' : 'Guidance:'}</strong>{' '}
                {lang === 'hi' ? pakshiReport.guidanceHi : pakshiReport.guidanceEn}
              </div>

              <div className="table-scroll">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>{lang === 'hi' ? 'काल / याम' : 'Period / Yama'}</th>
                      <th>{t.common.period}</th>
                      <th>{lang === 'hi' ? 'जन्म पक्षी अवस्था' : 'Your Bird State'}</th>
                      <th>{lang === 'hi' ? 'शक्ति' : 'Power'}</th>
                      <th>{lang === 'hi' ? 'सभी 5 पक्षी स्थिति' : 'All 5 Birds Status'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...pakshiReport.dayYamas, ...pakshiReport.nightYamas].map((y) => {
                      const isNow =
                        y.period === pakshiReport.currentYama.period &&
                        y.yamaNumber === pakshiReport.currentYama.yamaNumber;
                      const actMeta = ACTIVITY_META[y.birthBirdActivity];
                      const badgeCls =
                        actMeta.quality === 'best' || actMeta.quality === 'good'
                          ? 'tag-varg'
                          : actMeta.quality === 'neutral'
                            ? 'tag-karaka'
                            : 'tag-combust';
                      return (
                        <tr key={`${y.period}-${y.yamaNumber}`} className={isNow ? 'highlight-row' : ''}>
                          <td>
                            <strong>
                              {y.period === 'day' ? (lang === 'hi' ? 'दिन' : 'Day') : lang === 'hi' ? 'रात्रि' : 'Night'} Y{y.yamaNumber}
                            </strong>
                            {isNow && <span className="tag tag-varg" style={{ marginLeft: 6 }}>{t.common.now}</span>}
                          </td>
                          <td className="mono small-cell">{y.startTime} – {y.endTime}</td>
                          <td>
                            <span className={`tag ${badgeCls}`}>
                              {lang === 'hi' ? actMeta.hi : y.birthBirdActivity}
                            </span>
                          </td>
                          <td className="mono">{y.strengthScore.toFixed(2)}</td>
                          <td className="small-text muted">
                            {(['Vulture', 'Owl', 'Crow', 'Cock', 'Peacock'] as const)
                              .map((b) =>
                                lang === 'hi'
                                  ? `${BIRD_META[b].hi.split(' ')[0]}:${ACTIVITY_META[y.allBirds[b]].hi.split(' ')[0]}`
                                  : `${b}:${y.allBirds[b]}`
                              )
                              .join(' · ')}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Deep Panchang, 60-Year Samvatsara, Amanta/Purnimanta, Shoola/Vaasa & Muhurta Yogas */}
      {subTab === 'deep_panchang' && (
        <div className="view-stack">
          <div className="charts-toolbar">
            <div className="toolbar-group">
              <span className="label-muted">{t.common.date}:</span>
              <DateDmyInput
                compact
                className="select-compact mono"
                value={pakshiDate}
                ariaLabel={t.common.date}
                onChange={setPakshiDate}
              />
              <input
                type="time"
                className="select-compact mono"
                value={pakshiTime}
                onChange={(e) => setPakshiTime(e.target.value)}
              />
            </div>

            <div className="subtab-bar">
              <button
                type="button"
                className={`subtab-btn ${lunarSystem === 'purnimanta' ? 'is-active' : ''}`}
                onClick={() => setLunarSystem('purnimanta')}
              >
                {lang === 'hi' ? 'पूर्णिमांत मास (उत्तर भारत)' : 'Purnimanta (North)'}
              </button>
              <button
                type="button"
                className={`subtab-btn ${lunarSystem === 'amanta' ? 'is-active' : ''}`}
                onClick={() => setLunarSystem('amanta')}
              >
                {lang === 'hi' ? 'अमांत मास (दक्षिण/पश्चिम)' : 'Amanta (South/West)'}
              </button>
            </div>
          </div>

          <section className="panel">
            <div className="panel-header">
              <h3>
                {lang === 'hi'
                  ? 'बार्हस्पत्य 60-संवत्सर, चंद्र मास, शूल एवं वास निर्णय'
                  : '60-Year Samvatsara, Lunar Masa, Shoola & Vaasa Residence Engine'}
              </h3>
              {(lang === 'hi' ? deepPanchang.specialTithiHi : deepPanchang.specialTithiEn) && (
                <span className="tag tag-varg">
                  {lang === 'hi' ? deepPanchang.specialTithiHi : deepPanchang.specialTithiEn}
                </span>
              )}
            </div>

            <div className="two-col-split-pad">
              <div className="branch-highlights">
                <div className="highlight-box">
                  <span className="muted small-text">
                    {lang === 'hi' ? 'सक्रिय हिंदू मास (पक्ष व संवत)' : 'Hindu Lunar Month & Eras'}
                  </span>
                  <strong>
                    {lang === 'hi' ? deepPanchang.activeMasaHi : deepPanchang.activeMasaEn}
                    {deepPanchang.isAdhikaMasa ? (lang === 'hi' ? ' (अधिक मास)' : ' (Adhika Masa)') : ''}
                  </strong>
                  <span className="muted small-text">
                    {lang === 'hi'
                      ? `पूर्णिमांत: ${deepPanchang.purnimantaMasaHi} · अमांत: ${deepPanchang.amantaMasaHi}`
                      : `Purnimanta: ${deepPanchang.purnimantaMasaEn} · Amanta: ${deepPanchang.amantaMasaEn}`}
                  </span>
                </div>

                <div className="highlight-box">
                  <span className="muted small-text">
                    {lang === 'hi' ? 'संवत्सर (60-चक्र) · विक्रम व शक संवत' : '60-Yr Samvatsara · Vikram & Shaka'}
                  </span>
                  <strong>
                    #{deepPanchang.samvatsaraNumber}{' '}
                    {lang === 'hi' ? deepPanchang.samvatsaraHi : deepPanchang.samvatsaraEn}
                  </strong>
                  <span className="muted small-text mono">
                    VS {deepPanchang.vikramSamvat} · Shaka {deepPanchang.shakaSamvat} ·{' '}
                    {lang === 'hi' ? deepPanchang.ayanaHi : deepPanchang.ayanaEn} ({lang === 'hi' ? deepPanchang.rituHi : deepPanchang.rituEn})
                  </span>
                </div>

                <div className="highlight-box">
                  <span className="muted small-text">
                    {lang === 'hi' ? 'पंचक रहित व संक्रांति जाँच' : 'Panchaka Rahita & Sankramana'}
                  </span>
                  <strong>{lang === 'hi' ? deepPanchang.panchaka.nameHi : deepPanchang.panchaka.nameEn}</strong>
                  <span className="muted small-text">
                    {lang === 'hi' ? deepPanchang.sankramanaAlert.noteHi : deepPanchang.sankramanaAlert.noteEn}
                  </span>
                </div>
              </div>

              <div className="basics-bottom-grid">
                <div className="table-scroll">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>{lang === 'hi' ? 'शूल व वास विचार' : 'Shoola & Vaasa Check'}</th>
                        <th>{lang === 'hi' ? 'स्थिति / दिशा' : 'State / Direction'}</th>
                        <th>{lang === 'hi' ? 'फल व परिहार' : 'Effect / Remedy'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>{lang === 'hi' ? 'दिशा शूल (वार)' : 'Disha Shoola (Travel)'}</strong></td>
                        <td>
                          <span className="tag tag-combust">
                            {lang === 'hi' ? deepPanchang.dishaShool.directionHi : deepPanchang.dishaShool.directionEn}
                          </span>
                        </td>
                        <td className="wrap-cell">
                          {lang === 'hi' ? deepPanchang.dishaShool.remedyHi : deepPanchang.dishaShool.remedyEn}{' '}
                          <span className="muted small-text">
                            ({lang === 'hi' ? deepPanchang.dishaShool.exemptionHi : deepPanchang.dishaShool.exemptionEn})
                          </span>
                        </td>
                      </tr>
                      {deepPanchang.nakshatraShool.directionEn && (
                        <tr>
                          <td><strong>{lang === 'hi' ? 'नक्षत्र शूल' : 'Nakshatra Shoola'}</strong></td>
                          <td>
                            <span className="tag tag-karaka">
                              {lang === 'hi' ? deepPanchang.nakshatraShool.directionHi : deepPanchang.nakshatraShool.directionEn}
                            </span>
                          </td>
                          <td>{lang === 'hi' ? 'नक्षत्र विशेष से वर्जित दिशा' : 'Direction restricted by Moon Nakshatra'}</td>
                        </tr>
                      )}
                      <tr>
                        <td><strong>{lang === 'hi' ? 'शिव वास (रुद्राभिषेक)' : 'Shiva Vaasa (Puja)'}</strong></td>
                        <td><strong>{lang === 'hi' ? deepPanchang.vaasa.shivaStateHi : deepPanchang.vaasa.shivaStateEn}</strong></td>
                        <td className="wrap-cell">{lang === 'hi' ? deepPanchang.vaasa.shivaEffectHi : deepPanchang.vaasa.shivaEffectEn}</td>
                      </tr>
                      <tr>
                        <td><strong>{lang === 'hi' ? 'अग्नि वास (हवन)' : 'Agni Vaasa (Homa/Havan)'}</strong></td>
                        <td><strong>{lang === 'hi' ? deepPanchang.vaasa.agniStateHi : deepPanchang.vaasa.agniStateEn}</strong></td>
                        <td className="wrap-cell">{lang === 'hi' ? deepPanchang.vaasa.agniEffectHi : deepPanchang.vaasa.agniEffectEn}</td>
                      </tr>
                      <tr>
                        <td><strong>{lang === 'hi' ? 'चंद्र, राहु व योगिनी वास' : 'Chandra, Rahu & Yogini Vaasa'}</strong></td>
                        <td>{lang === 'hi' ? deepPanchang.vaasa.chandraDirHi : deepPanchang.vaasa.chandraDirEn}</td>
                        <td className="small-text">
                          {lang === 'hi' ? 'पद:' : 'Abode:'}{' '}
                          {lang === 'hi' ? deepPanchang.vaasa.chandraAbodeHi : deepPanchang.vaasa.chandraAbodeEn} · Rahu:{' '}
                          {lang === 'hi' ? deepPanchang.vaasa.rahuDirHi : deepPanchang.vaasa.rahuDirEn} · Yogini:{' '}
                          {lang === 'hi' ? deepPanchang.vaasa.yoginiDirHi : deepPanchang.vaasa.yoginiDirEn}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="cards-list">
                  {deepPanchang.muhurtaRules.map((mr) => (
                    <article
                      key={mr.id}
                      className={`yoga-card ${
                        mr.status === 'Good' ? 'tone-benefic' : mr.status === 'Avoid' ? 'tone-dosha' : 'tone-mixed'
                      }`}
                    >
                      <div className="yoga-head">
                        <strong>{lang === 'hi' ? mr.nameHi : mr.nameEn}</strong>
                        <span
                          className={`tag ${
                            mr.status === 'Good' ? 'tag-varg' : mr.status === 'Avoid' ? 'tag-combust' : 'tag-karaka'
                          }`}
                        >
                          {trBadge(mr.status, lang)}
                        </span>
                      </div>
                      <p className="yoga-desc">{lang === 'hi' ? mr.detailHi : mr.detailEn}</p>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* 3. Muhurta Date-Range Finder */}
      {subTab === 'muhurta' && !paramayus.exceeded && (
        <section className="panel">
          <div className="panel-header">
            <h3>
              <Sparkles size={15} /> {lang === 'hi' ? 'शुभ मुहूर्त खोजक (आपकी जन्म राशि के अनुसार)' : 'Electional Muhurta Finder (Personalized to Natal Moon)'}
            </h3>
            <div className="toolbar-group">
              <select
                className="select-compact"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value as MuhurtaPurpose)}
              >
                <option value="marriage">{lang === 'hi' ? 'विवाह मुहूर्त' : 'Marriage / Vivaha'}</option>
                <option value="griha_pravesh">{lang === 'hi' ? 'गृह प्रवेश' : 'Griha Pravesh / Housewarming'}</option>
                <option value="business">{lang === 'hi' ? 'व्यापार / दुकान प्रारंभ' : 'Business Launch / Venture'}</option>
                <option value="travel">{lang === 'hi' ? 'यात्रा एवं स्थान परिवर्तन' : 'Long Travel / Relocation'}</option>
                <option value="medical">{lang === 'hi' ? 'चिकित्सा / शल्य क्रिया' : 'Medical Procedure / Healing'}</option>
                <option value="education">{lang === 'hi' ? 'विद्यारंभ / शिक्षा प्रारंभ' : 'Education / Vidyarambha'}</option>
              </select>
              <DateDmyInput
                compact
                className="select-compact mono"
                value={muhurtaStart}
                ariaLabel={t.common.date}
                onChange={setMuhurtaStart}
              />
              <select
                className="select-compact"
                value={scanDays}
                onChange={(e) => setScanDays(Number(e.target.value))}
              >
                <option value={21}>{lang === 'hi' ? 'अगले 21 दिन' : 'Next 21 Days'}</option>
                <option value={45}>{lang === 'hi' ? 'अगले 45 दिन' : 'Next 45 Days'}</option>
                <option value={90}>{lang === 'hi' ? 'अगले 90 दिन' : 'Next 90 Days'}</option>
              </select>
            </div>
          </div>

          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t.common.date}</th>
                  <th>{lang === 'hi' ? 'वार' : 'Day'}</th>
                  <th>{lang === 'hi' ? 'तिथि व नक्षत्र' : 'Tithi & Nakshatra'}</th>
                  <th>{lang === 'hi' ? 'तारा / चंद्रबल' : 'Tara / Chandra Bala'}</th>
                  <th>{lang === 'hi' ? 'अभिजित मुहूर्त' : 'Abhijit Window'}</th>
                  <th>{lang === 'hi' ? 'वर्ज्य (राहु काल)' : 'Avoid (Rahu Kalam)'}</th>
                  <th>{t.common.score}</th>
                </tr>
              </thead>
              <tbody>
                {muhurtaResults.map((m) => (
                  <tr key={m.date}>
                    <td className="mono">
                      <strong>{formatDateDmy(m.date)}</strong>
                    </td>
                    <td>{m.weekday}</td>
                    <td>
                      {m.tithi} · <strong>{m.nakshatra}</strong>
                    </td>
                    <td className="small-cell">
                      {m.taraStatus} · {m.chandraBala}
                    </td>
                    <td className="mono cell-strong">{m.abhijitWindow}</td>
                    <td className="mono cell-weak">{m.rahuKalam}</td>
                    <td>
                      <span
                        className={`tag ${
                          m.score >= 76 ? 'tag-varg' : m.score >= 62 ? 'tag-karaka' : 'tag-retro'
                        }`}
                      >
                        {m.score}/100 ({trBadge(m.verdict, lang)})
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* 4. 10-Year Transit, Sade Sati & Eclipse Calendar */}
      {subTab === 'calendar' && !paramayus.exceeded && (
        <div className="view-stack">
          <section className="panel">
            <div className="panel-header">
              <h3>{lang === 'hi' ? '10-वर्षीय शनि साढ़ेसाती एवं अष्टम शनि अवधि' : '10-Year Sade Sati & Ashtama Shani Windows'}</h3>
            </div>
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{lang === 'hi' ? 'चरण' : 'Phase'}</th>
                    <th>{lang === 'hi' ? 'प्रारंभ तिथि' : 'Start Date'}</th>
                    <th>{lang === 'hi' ? 'समाप्ति तिथि' : 'End Date'}</th>
                    <th>{lang === 'hi' ? 'मार्गदर्शन' : 'Guidance'}</th>
                  </tr>
                </thead>
                <tbody>
                  {calendarReport.sadeSatiWindows.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="muted">
                        {lang === 'hi'
                          ? 'इस 10-वर्षीय अवधि में साढ़ेसाती या ढैया का कोई चरण नहीं है।'
                          : 'No Sade Sati / Ashtama Shani phases detected in this window.'}
                      </td>
                    </tr>
                  ) : (
                    calendarReport.sadeSatiWindows.map((w, i) => (
                      <tr key={i}>
                        <td>
                          <strong>{w.phase}</strong>
                        </td>
                        <td className="mono">{formatDateDmy(w.startDate)}</td>
                        <td className="mono">{formatDateDmy(w.endDate)}</td>
                        <td className="wrap-cell">{w.note}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <div className="basics-bottom-grid">
            <section className="panel">
              <div className="panel-header">
                <h3>{lang === 'hi' ? 'गुरु व शनि राशि परिवर्तन (अगले 10 वर्ष)' : 'Jupiter & Saturn Sign Ingresses (Next 10 Years)'}</h3>
              </div>
              <div className="table-scroll max-h-340">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>{t.common.date}</th>
                      <th>{t.common.planet}</th>
                      <th>{lang === 'hi' ? 'राशि परिवर्तन' : 'Transition'}</th>
                      <th>{lang === 'hi' ? 'चंद्र / लग्न भाव' : 'Moon / Lagna'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calendarReport.ingresses.map((ing, i) => (
                      <tr key={`${ing.planet}-${i}`}>
                        <td className="mono">{formatDateDmy(ing.date)}</td>
                        <td>
                          <strong>{trPlanet(ing.planet, lang)}</strong>
                        </td>
                        <td>
                          {ing.fromSign} → <strong>{ing.toSign}</strong>
                        </td>
                        <td className="mono">
                          {t.common.house}{ing.houseFromMoon} / {t.common.house}{ing.houseFromLagna}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="panel">
              <div className="panel-header">
                <h3>{lang === 'hi' ? 'आगामी सूर्य एवं चंद्र ग्रहण (अगले 3 वर्ष)' : 'Upcoming Solar & Lunar Eclipses (Next 3 Years)'}</h3>
              </div>
              <div className="table-scroll max-h-340">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>{t.common.date}</th>
                      <th>{lang === 'hi' ? 'ग्रहण प्रकार' : 'Eclipse'}</th>
                      <th>{t.common.sign}</th>
                      <th>{lang === 'hi' ? 'जन्म कुंडली प्रभाव (±6°)' : 'Natal Trigger (±6°)'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calendarReport.eclipses.map((ec, i) => (
                      <tr key={`${ec.type}-${i}`}>
                        <td className="mono small-cell">{formatDateDmy(ec.dateLocal)}</td>
                        <td>
                          <strong>{trBadge(ec.type, lang)}</strong> ({trBadge(ec.kind, lang)})
                        </td>
                        <td className="mono">
                          {ec.signName} {ec.dms}
                        </td>
                        <td>
                          {ec.impactedNatalBodies.length > 0 ? (
                            <span className="tag tag-combust">
                              {lang === 'hi' ? 'प्रभावित:' : 'Hits'} {ec.impactedNatalBodies.join(', ')}
                            </span>
                          ) : (
                            <span className="muted">
                              {lang === 'hi'
                                ? `भाव ${ec.houseFromLagna} (लग्न) / भाव ${ec.houseFromMoon} (चंद्र)`
                                : `H${ec.houseFromLagna} (Lagna) / H${ec.houseFromMoon} (Moon)`}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          <section className="panel">
            <div className="panel-header">
              <h3>
                {lang === 'hi'
                  ? `वार्षिक हिंदू पर्व, एकादशी, संक्रांति एवं व्रत कैलेंडर (${festYear})`
                  : `Hindu Festival, Ekadashi, Purnima & Sankranti Panchang (${festYear})`}
              </h3>
              <div className="toolbar-group">
                <select
                  className="select-compact mono"
                  value={festYear}
                  onChange={(e) => setFestYear(parseInt(e.target.value, 10))}
                >
                  {[2024, 2025, 2026, 2027, 2028, 2029, 2030].map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
                <select
                  className="select-compact"
                  value={festCat}
                  onChange={(e) => setFestCat(e.target.value as typeof festCat)}
                >
                  <option value="festival">{lang === 'hi' ? 'प्रमुख पर्व / त्योहार' : 'Major Festivals'}</option>
                  <option value="ekadashi">{lang === 'hi' ? 'सभी एकादशी व्रत' : 'Ekadashi Fasts'}</option>
                  <option value="purnima_amavasya">{lang === 'hi' ? 'पूर्णिमा व अमावस्या' : 'Purnima & Amavasya'}</option>
                  <option value="sankranti">{lang === 'hi' ? 'सभी 12 संक्रांतियाँ' : '12 Sankrantis'}</option>
                  <option value="all">{lang === 'hi' ? 'सभी तिथियाँ व पर्व' : 'All Panchang Dates'}</option>
                </select>
              </div>
            </div>
            <div className="table-scroll max-h-340">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{t.common.date}</th>
                    <th>{lang === 'hi' ? 'पर्व / व्रत / संक्रांति' : 'Event / Vrat'}</th>
                    <th>{lang === 'hi' ? 'तिथि / खगोलीय विवरण' : 'Tithi / Astronomical Note'}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFestivals.map((ev, idx) => (
                    <tr key={`${ev.date}-${ev.nameEn}-${idx}`}>
                      <td className="mono"><strong>{formatDateDmy(ev.date)}</strong></td>
                      <td><strong>{lang === 'hi' ? ev.nameHi : ev.nameEn}</strong></td>
                      <td className="muted">{lang === 'hi' ? ev.tithiNoteHi : ev.tithiNoteEn}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {/* 7. DO GHATI MUHURAT (30 SLOTS) */}
      {subTab === 'do_ghati' && (
        <section className="panel">
          <div className="panel-header">
            <h3>
              <Clock size={15} />{' '}
              {lang === 'hi'
                ? `दो-घटी मुहूर्त (30 दैनिक मुहूर्त व अभिजित — ${formatDateDmy(pakshiDate)})`
                : `Do Ghati Muhurat (30 Classical Day & Night Segments — ${formatDateDmy(pakshiDate)})`}
            </h3>
            <DateDmyInput
              compact
              className="select-compact mono"
              value={pakshiDate}
              ariaLabel="Do Ghati Date"
              onChange={setPakshiDate}
            />
          </div>
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>{lang === 'hi' ? 'काल' : 'Period'}</th>
                  <th>{lang === 'hi' ? 'मुहूर्त नाम' : 'Muhurat'}</th>
                  <th>{lang === 'hi' ? 'समय' : 'Time Window'}</th>
                  <th>{lang === 'hi' ? 'शुभत्व' : 'Quality'}</th>
                  <th>{lang === 'hi' ? 'विवरण' : 'Guidance'}</th>
                </tr>
              </thead>
              <tbody>
                {doGhatiSlots.map((slot) => (
                  <tr key={slot.index}>
                    <td className="mono">{slot.index}</td>
                    <td>{slot.period === 'day' ? (lang === 'hi' ? 'दिन' : 'Day') : (lang === 'hi' ? 'रात्रि' : 'Night')}</td>
                    <td>
                      <strong>{lang === 'hi' ? slot.nameHi : slot.nameEn}</strong>
                      {slot.isAbhijit && <span className="tag tag-varg" style={{ marginLeft: 6 }}>Abhijit</span>}
                    </td>
                    <td className="mono">{slot.startTime} – {slot.endTime}</td>
                    <td>
                      <span className={`badge ${slot.quality === 'Auspicious' ? 'badge-ok' : slot.quality === 'Avoid' ? 'badge-bad' : 'badge-warn'}`}>
                        {slot.quality}
                      </span>
                    </td>
                    <td className="small-cell">{lang === 'hi' ? slot.noteHi : slot.noteEn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* 8. 24-HOUR PLANETARY HORA CALCULATOR */}
      {subTab === 'hora_24' && (
        <section className="panel">
          <div className="panel-header">
            <h3>
              <Clock size={15} />{' '}
              {lang === 'hi'
                ? `24 घंटे ग्रह होरा कैलकुलेटर (${formatDateDmy(pakshiDate)})`
                : `24-Hour Planetary Hora Table (${formatDateDmy(pakshiDate)})`}
            </h3>
            <DateDmyInput
              compact
              className="select-compact mono"
              value={pakshiDate}
              ariaLabel="Hora Date"
              onChange={setPakshiDate}
            />
          </div>
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{lang === 'hi' ? 'होरा' : 'Hora #'}</th>
                  <th>{lang === 'hi' ? 'काल' : 'Period'}</th>
                  <th>{lang === 'hi' ? 'होरा स्वामी' : 'Hora Ruler'}</th>
                  <th>{lang === 'hi' ? 'समय' : 'Local Time'}</th>
                  <th>{lang === 'hi' ? 'उपयुक्त कार्य' : 'Recommended Activities'}</th>
                </tr>
              </thead>
              <tbody>
                {hora24Slots.map((h) => (
                  <tr key={h.index}>
                    <td className="mono">{h.index}</td>
                    <td>{h.period === 'day' ? (lang === 'hi' ? 'दिन' : 'Day') : (lang === 'hi' ? 'रात्रि' : 'Night')}</td>
                    <td><strong>{trPlanet(h.planet, lang)}</strong></td>
                    <td className="mono">{h.startTime} – {h.endTime}</td>
                    <td className="small-cell">{lang === 'hi' ? h.suitabilityHi : h.suitabilityEn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* 9. MONTHLY PANCHANG */}
      {subTab === 'monthly_panchang' && (
        <section className="panel">
          <div className="panel-header">
            <h3>
              <Calendar size={15} />{' '}
              {lang === 'hi' ? `मासिक पंचांग (${monthNum}/${monthYear})` : `Monthly Panchang (${monthNum}/${monthYear})`}
            </h3>
            <div className="toolbar-group">
              <select
                className="select-compact"
                value={monthNum}
                onChange={(e) => setMonthNum(parseInt(e.target.value, 10))}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>
                    {new Date(Date.UTC(2026, m - 1, 1)).toLocaleString('en-US', { month: 'long', timeZone: 'UTC' })}
                  </option>
                ))}
              </select>
              <select
                className="select-compact mono"
                value={monthYear}
                onChange={(e) => setMonthYear(parseInt(e.target.value, 10))}
              >
                {[2025, 2026, 2027, 2028].map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t.common.date}</th>
                  <th>{lang === 'hi' ? 'वार' : 'Day'}</th>
                  <th>{lang === 'hi' ? 'तिथि' : 'Tithi'}</th>
                  <th>{lang === 'hi' ? 'नक्षत्र' : 'Nakshatra'}</th>
                  <th>{lang === 'hi' ? 'योग' : 'Yoga'}</th>
                  <th>{lang === 'hi' ? 'सूर्योदय / अस्त' : 'Rise / Set'}</th>
                  <th>{lang === 'hi' ? 'राहुकाल' : 'Rahu Kaal'}</th>
                </tr>
              </thead>
              <tbody>
                {monthlyPanchangRows.map((row) => (
                  <tr key={row.isoDate}>
                    <td className="mono">
                      <strong>{row.dmyDate}</strong>
                      {row.highlightTagEn && (
                        <div>
                          <span className="tag tag-varg">{lang === 'hi' ? row.highlightTagHi : row.highlightTagEn}</span>
                        </div>
                      )}
                    </td>
                    <td>{trTerm(row.weekday, lang)}</td>
                    <td>{row.tithi.split(' (').map((part) => trTerm(part.replace(')', ''), lang)).join(' · ')}</td>
                    <td>{trTerm(row.nakshatra, lang)}</td>
                    <td>{trTerm(row.yoga, lang)}</td>
                    <td className="mono">{row.sunrise} / {row.sunset}</td>
                    <td className="mono">{row.rahuKalam}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
};
