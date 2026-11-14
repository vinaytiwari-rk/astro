import React, { useEffect, useMemo, useState } from 'react';
import { Baby, Compass, Gem, Grid3x3, Sparkles, Star } from 'lucide-react';
import { NAKSHATRAS } from '../astro/constants';
import { computeAvakahadaChakra } from '../astro/avakahadaChalit';
import {
  computeGemstoneAndRudraksha,
  computeRashifalReport,
  findBabyNames,
  type RashifalPeriod,
} from '../astro/rashifalBabyRudraksha';
import { evaluateParamayusStatus } from '../astro/predictions/paramayus';
import { formatDateDmy } from '../astro/time';
import type { ChartData } from '../astro/types';
import { useLanguage } from '../i18n/LanguageContext';
import { trPlanet, trSign, trTerm } from '../i18n/translations';
import { DateDmyInput } from './DateDmyInput';
import { ParamayusLockBanner } from './ParamayusLockBanner';
import { NumerologyPanel } from './predictions/NumerologyPanel';

interface AstroSageToolsViewProps {
  chart: ChartData;
  requestedMode?: { id?: string; nonce: number };
}

type ToolMode = 'rashifal' | 'baby_names' | 'gems_rudraksha';

export const AstroSageToolsView: React.FC<AstroSageToolsViewProps> = ({ chart, requestedMode }) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';
  const [mode, setMode] = useState<ToolMode>('rashifal');

  useEffect(() => {
    const id = requestedMode?.id;
    if (id === 'rashifal' || id === 'baby_names' || id === 'gems_rudraksha') {
      setMode(id);
    } else if (id === 'rashifal_tomorrow') {
      setMode('rashifal');
      setRashiPeriod('tomorrow');
    } else if (id === 'rashifal_weekly') {
      setMode('rashifal');
      setRashiPeriod('weekly');
    } else if (id === 'rashifal_weekly_love') {
      setMode('rashifal');
      setRashiPeriod('weekly_love');
    } else if (id === 'rashifal_monthly') {
      setMode('rashifal');
      setRashiPeriod('monthly');
    } else if (id === 'rashifal_2027') {
      setMode('rashifal');
      setRashiPeriod('yearly');
      setRashiDate('2027-01-15');
    }
  }, [requestedMode?.nonce, requestedMode?.id]);

  // Rashifal state
  const natalMoonSign = chart.planets.find((p) => p.id === 'Moon')!.signIndex;
  const [rashiDate, setRashiDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [rashiPeriod, setRashiPeriod] = useState<RashifalPeriod>('daily');
  const [selectedRashi, setSelectedRashi] = useState<number>(natalMoonSign);
  useEffect(() => {
    setSelectedRashi(natalMoonSign);
  }, [natalMoonSign]);

  const rashifalList = useMemo(
    () => computeRashifalReport(chart, rashiDate),
    [chart, rashiDate]
  );
  const activeRashifal = rashifalList[selectedRashi] ?? rashifalList[0];

  // Baby Names state
  const avakahada = useMemo(() => computeAvakahadaChakra(chart), [chart]);
  const [babyNak, setBabyNak] = useState<number | 'all'>(chart.panchang.nakshatra.index);
  const [babyGender, setBabyGender] = useState<'all' | 'boy' | 'girl'>('all');
  useEffect(() => {
    setBabyNak(chart.panchang.nakshatra.index);
  }, [chart.panchang.nakshatra.index]);

  const babyNames = useMemo(
    () => findBabyNames(babyNak, babyGender),
    [babyNak, babyGender]
  );

  // Gems & Rudraksha
  const gemReport = useMemo(() => computeGemstoneAndRudraksha(chart), [chart]);
  const paramayus = useMemo(
    () => evaluateParamayusStatus(chart, mode === 'rashifal' ? rashiDate : undefined),
    [chart, mode, rashiDate]
  );

  return (
    <div className="view-stack">
      <div className="charts-toolbar">
        <div className="subtab-bar">
          <button
            type="button"
            className={`subtab-btn branch-btn ${mode === 'rashifal' ? 'is-active' : ''}`}
            onClick={() => setMode('rashifal')}
          >
            <Star size={14} />
            <span>{isHi ? 'दैनिक / वार्षिक राशिफल' : 'Rashifal (Daily–Yearly)'}</span>
          </button>
          <button
            type="button"
            className={`subtab-btn branch-btn ${mode === 'baby_names' ? 'is-active' : ''}`}
            onClick={() => setMode('baby_names')}
          >
            <Baby size={14} />
            <span>{isHi ? 'शिशु नाम सुझाव (नक्षत्र)' : 'Baby Name Finder'}</span>
          </button>
          <button
            type="button"
            className={`subtab-btn branch-btn ${mode === 'gems_rudraksha' ? 'is-active' : ''}`}
            onClick={() => setMode('gems_rudraksha')}
          >
            <Gem size={14} />
            <span>{isHi ? 'रत्न व 1–14 मुखी रुद्राक्ष' : 'Gemstones & Rudraksha'}</span>
          </button>
        </div>
      </div>

      {paramayus.exceeded && mode !== 'baby_names' ? (
        <ParamayusLockBanner status={paramayus} />
      ) : (
        <>
      {/* 1. RASHIFAL (DAILY / WEEKLY / MONTHLY / YEARLY) */}
      {mode === 'rashifal' && (
        <div className="view-stack">
          <section className="panel">
            <div className="panel-header">
              <h3>
                <Star size={15} />{' '}
                {isHi
                  ? `राशिफल — दैनिक, साप्ताहिक, मासिक एवं वार्षिक (${formatDateDmy(rashiDate)})`
                  : `Rashifal Horoscope — Daily, Weekly, Monthly & Yearly (${formatDateDmy(rashiDate)})`}
              </h3>
              <div className="toolbar-group">
                <DateDmyInput
                  compact
                  className="select-compact mono"
                  value={rashiDate}
                  ariaLabel={isHi ? 'राशिफल दिनांक (DD-MM-YYYY)' : 'Rashifal Date (DD-MM-YYYY)'}
                  onChange={setRashiDate}
                />
                <div className="subtab-bar">
                  {(
                    [
                      ['daily', isHi ? 'दैनिक' : 'Daily'],
                      ['tomorrow', isHi ? 'कल' : 'Tomorrow'],
                      ['weekly', isHi ? 'साप्ताहिक' : 'Weekly'],
                      ['weekly_love', isHi ? 'साप्ताहिक प्रेम' : 'Weekly Love'],
                      ['monthly', isHi ? 'मासिक' : 'Monthly'],
                      ['yearly', isHi ? `वार्षिक (${rashiDate.slice(0, 4)})` : `Yearly (${rashiDate.slice(0, 4)})`],
                    ] as Array<[RashifalPeriod, string]>
                  ).map(([id, lbl]) => (
                    <button
                      key={id}
                      type="button"
                      className={`subtab-btn ${rashiPeriod === id ? 'is-active' : ''}`}
                      onClick={() => setRashiPeriod(id)}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="panel-subblock">
              <div className="rashi-pill-grid">
                {rashifalList.map((r) => (
                  <button
                    key={r.signIndex}
                    type="button"
                    className={`subtab-btn ${selectedRashi === r.signIndex ? 'is-active' : ''}`}
                    onClick={() => setSelectedRashi(r.signIndex)}
                  >
                    {trSign(r.signIndex, lang)} {r.isNatalMoon ? (isHi ? '(जन्म)' : '★') : ''}
                  </button>
                ))}
              </div>
            </div>

            <div className="pred-card-body">
              <div className="branch-highlights">
                <div className="highlight-box">
                  <span className="muted small-text">{isHi ? 'चयनित चंद्र राशि' : 'Selected Moon Rashi'}</span>
                  <strong>
                    {trSign(activeRashifal.signIndex, lang)}{' '}
                    {activeRashifal.isNatalMoon ? (isHi ? '· आपकी जन्म राशि ★' : '· Your Janma Rashi ★') : ''}
                  </strong>
                  <span className="tag tag-varg">
                    {isHi ? activeRashifal.moodHi : activeRashifal.moodEn} ({activeRashifal.score}/100)
                  </span>
                </div>
                <div className="highlight-box">
                  <span className="muted small-text">{isHi ? 'शुभ रंग व शुभ अंक' : 'Lucky Color & Number'}</span>
                  <strong>
                    {isHi ? activeRashifal.luckyColorHi : activeRashifal.luckyColorEn} ·{' '}
                    {isHi ? 'अंक' : '#'} {activeRashifal.luckyNumber}
                  </strong>
                </div>
              </div>

              <div className="gochar-banner is-info">
                <strong>
                  {rashiPeriod === 'daily'
                    ? (isHi ? 'आज का राशिफल:' : "Today's Overview:")
                    : rashiPeriod === 'tomorrow'
                      ? (isHi ? 'कल का राशिफल:' : "Tomorrow's Overview:")
                      : rashiPeriod === 'weekly'
                        ? (isHi ? 'साप्ताहिक फल:' : 'Weekly Forecast:')
                        : rashiPeriod === 'weekly_love'
                          ? (isHi ? 'साप्ताहिक प्रेम व संबंध:' : 'Weekly Love & Harmony:')
                          : rashiPeriod === 'monthly'
                            ? (isHi ? 'मासिक फल:' : 'Monthly Outlook:')
                            : (isHi ? 'वार्षिक भविष्यफल:' : 'Annual Horoscope:')}
                </strong>{' '}
                {rashiPeriod === 'daily'
                  ? (isHi ? activeRashifal.dailyHi : activeRashifal.dailyEn)
                  : rashiPeriod === 'tomorrow'
                    ? (isHi ? activeRashifal.tomorrowHi : activeRashifal.tomorrowEn)
                    : rashiPeriod === 'weekly'
                      ? (isHi ? activeRashifal.weeklyHi : activeRashifal.weeklyEn)
                      : rashiPeriod === 'weekly_love'
                        ? (isHi ? activeRashifal.weeklyLoveHi : activeRashifal.weeklyLoveEn)
                        : rashiPeriod === 'monthly'
                          ? (isHi ? activeRashifal.monthlyHi : activeRashifal.monthlyEn)
                          : (isHi ? activeRashifal.yearlyHi : activeRashifal.yearlyEn)}
              </div>

              <div className="pred-bullets">
                <div>
                  <strong>{isHi ? 'करियर एवं धन:' : 'Career & Wealth:'}</strong>{' '}
                  {isHi ? activeRashifal.careerHi : activeRashifal.careerEn}
                </div>
                <div>
                  <strong>{isHi ? 'प्रेम व दांपत्य:' : 'Love & Relationships:'}</strong>{' '}
                  {isHi ? activeRashifal.loveHi : activeRashifal.loveEn}
                </div>
                <div>
                  <strong>{isHi ? 'स्वास्थ्य:' : 'Health & Vitality:'}</strong>{' '}
                  {isHi ? activeRashifal.healthHi : activeRashifal.healthEn}
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* 3. BABY NAME FINDER BY NAKSHATRA PADA */}
      {mode === 'baby_names' && (
        <section className="panel">
          <div className="panel-header">
            <h3>
              <Baby size={15} />{' '}
              {isHi
                ? 'नक्षत्र व नामाक्षर अनुसार शिशु नाम खोजक'
                : 'Vedic Baby Name Finder (Nakshatra, Pada Syllable & Chaldean #)'}
            </h3>
            <div className="toolbar-group">
              <select
                className="select-compact"
                value={String(babyNak)}
                onChange={(e) =>
                  setBabyNak(e.target.value === 'all' ? 'all' : parseInt(e.target.value, 10))
                }
              >
                <option value="all">{isHi ? 'सभी 27 नक्षत्र' : 'All 27 Nakshatras'}</option>
                {NAKSHATRAS.map((n, idx) => (
                  <option key={n.name} value={idx}>
                    {idx + 1}. {trTerm(n.name, lang)}{' '}
                    {idx === chart.panchang.nakshatra.index ? (isHi ? '(जन्म नक्षत्र ★)' : '(Birth ★)') : ''}
                  </option>
                ))}
              </select>
              <select
                className="select-compact"
                value={babyGender}
                onChange={(e) => setBabyGender(e.target.value as 'all' | 'boy' | 'girl')}
              >
                <option value="all">{isHi ? 'लड़का व लड़की दोनों' : 'Boys & Girls'}</option>
                <option value="boy">{isHi ? 'केवल लड़का' : 'Boys'}</option>
                <option value="girl">{isHi ? 'केवल लड़की' : 'Girls'}</option>
              </select>
            </div>
          </div>

          <div className="gochar-highlights">
            <div className="gochar-banner is-info">
              <strong>{isHi ? 'जन्म नक्षत्र नामाक्षर:' : 'Birth Nakshatra Pada Syllables:'}</strong>{' '}
              {trTerm(chart.panchang.nakshatra.name, lang)} ({isHi ? 'चरण' : 'Pada'} {avakahada.pada}) →{' '}
              <strong>
                {isHi ? avakahada.nameSyllableHi : avakahada.nameSyllableEn}
              </strong>{' '}
              | {isHi ? 'सभी चरण अक्षर:' : 'All 4 Pada Letters:'}{' '}
              {(isHi ? avakahada.allPadaSyllablesHi : avakahada.allPadaSyllablesEn).join(', ')}
            </div>
          </div>

          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{isHi ? 'नाम' : 'Name'}</th>
                  <th>{isHi ? 'लिंग' : 'Gender'}</th>
                  <th>{isHi ? 'नक्षत्र व अक्षर' : 'Nakshatra & Sound'}</th>
                  <th>{isHi ? 'अर्थ (Meaning)' : 'Meaning'}</th>
                  <th>{isHi ? 'कीरो नामांक' : 'Chaldean #'}</th>
                </tr>
              </thead>
              <tbody>
                {babyNames.map((bn, idx) => (
                  <tr key={`${bn.name}-${idx}`}>
                    <td>
                      <strong>{bn.name}</strong>
                    </td>
                    <td>
                      <span className={`tag ${bn.gender === 'boy' ? 'tag-karaka' : 'tag-varg'}`}>
                        {bn.gender === 'boy' ? (isHi ? 'लड़का' : 'Boy') : (isHi ? 'लड़की' : 'Girl')}
                      </span>
                    </td>
                    <td>
                      {trTerm(NAKSHATRAS[bn.nakshatraIndex].name, lang)} ({bn.syllableEn})
                    </td>
                    <td className="wrap-cell">{isHi ? bn.meaningHi : bn.meaningEn}</td>
                    <td className="mono">
                      <span className="tag">{bn.chaldeanNum}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* 4. GEMSTONES & 1-14 MUKHI RUDRAKSHA */}
      {mode === 'gems_rudraksha' && (
        <div className="view-stack">
          <section className="panel">
            <div className="panel-header">
              <h3>
                <Gem size={15} />{' '}
                {isHi
                  ? 'व्यक्तिगत रत्न सलाहकार (जीवन रत्न, भाग्य रत्न एवं पुण्य रत्न)'
                  : 'Personalized Vedic Gemstone Advisor (Ratna Recommendation)'}
              </h3>
            </div>
            <div className="domains-grid panel-subblock">
              {[gemReport.lifeStone, gemReport.luckyStone, gemReport.beneficStone].map((g) => (
                <article key={g.roleEn} className="domain-card">
                  <div className="domain-top">
                    <div>
                      <h4>{isHi ? g.roleHi : g.roleEn}</h4>
                      <div className="muted small-text">
                        {trPlanet(g.planet, lang)}
                      </div>
                    </div>
                    <span className="tag tag-varg">{isHi ? g.stoneHi : g.stoneEn}</span>
                  </div>
                  <p className="domain-summary">{isHi ? g.reasonHi : g.reasonEn}</p>
                  <div className="pred-bullets">
                    <div>
                      <strong>{isHi ? 'वजन:' : 'Weight:'}</strong> {g.weightRatti}
                    </div>
                    <div>
                      <strong>{isHi ? 'धातु व उंगली:' : 'Metal & Finger:'}</strong>{' '}
                      {isHi ? `${g.metalHi}, ${g.fingerHi}` : `${g.metalEn}, ${g.fingerEn}`}
                    </div>
                    <div>
                      <strong>{isHi ? 'धारण दिन:' : 'Wearing Time:'}</strong>{' '}
                      {isHi ? g.dayHi : g.dayEn}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {gemReport.avoidStonesEn.length > 0 && (
              <div className="gochar-highlights">
                <div className="gochar-banner is-alert">
                  <strong>{isHi ? 'वर्ज्य रत्न (बिना विशेष सलाह न पहनें):' : 'Gemstones to Avoid (Dusthana Lords):'}</strong>{' '}
                  {(isHi ? gemReport.avoidStonesHi : gemReport.avoidStonesEn).join(' · ')}
                </div>
              </div>
            )}
          </section>

          <section className="panel">
            <div className="panel-header">
              <h3>
                <Compass size={15} />{' '}
                {isHi
                  ? '1–14 मुखी रुद्राक्ष सलाहकार (कुंडली एवं दशा आधारित)'
                  : '1–14 Mukhi Rudraksha Prescription'}
              </h3>
            </div>
            <div className="pred-top-grid panel-subblock">
              {[
                { labelEn: 'Primary Life Rudraksha', labelHi: 'मुख्य जीवन रुद्राक्ष', item: gemReport.primaryRudraksha },
                { labelEn: 'Active Dasha & Fortune Rudraksha', labelHi: 'वर्तमान दशा व भाग्य रुद्राक्ष', item: gemReport.secondaryRudraksha },
              ].map(({ labelEn, labelHi, item }) => (
                <article key={labelEn} className="domain-card">
                  <div className="domain-top">
                    <div>
                      <h4>{isHi ? item.titleHi : item.titleEn}</h4>
                      <div className="muted small-text">{isHi ? labelHi : labelEn}</div>
                    </div>
                    <span className="tag tag-karaka">{item.mukhi}</span>
                  </div>
                  <p className="domain-summary">{isHi ? item.benefitHi : item.benefitEn}</p>
                  <div className="pred-bullets">
                    <div>
                      <strong>{isHi ? 'देवता:' : 'Presiding Deity:'}</strong> {isHi ? item.deityHi : item.deityEn}
                    </div>
                    <div>
                      <strong>{isHi ? 'बीज मंत्र:' : 'Beeja Mantra:'}</strong>{' '}
                      <span className="mono">{item.mantra}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <div className="gochar-highlights">
              <div className="gochar-banner is-clear">
                <Sparkles size={13} />{' '}
                <strong>{isHi ? 'दोष निवारण रुद्राक्ष टिप:' : 'Dosha Relief Note:'}</strong>{' '}
                {isHi ? gemReport.doshaRudrakshaNoteHi : gemReport.doshaRudrakshaNoteEn}
              </div>
            </div>
          </section>
        </div>
      )}
        </>
      )}
    </div>
  );
};
