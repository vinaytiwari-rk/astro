import React, { useEffect, useMemo, useState } from 'react';
import {
  BookOpen,
  Calculator,
  Compass,
  Flame,
  Hand,
  Heart,
  Moon,
  Sparkles,
  Wind,
} from 'lucide-react';
import { AYANAMSA_META, NAKSHATRAS, NATURAL_FRIENDSHIP, SIGNS } from '../astro/constants';
import { computeAyanamsaDeg } from '../astro/ephemeris';
import {
  computeChartHealingReport,
  computeSamudrikaPalmMounts,
  RAMSHALAKA_CELLS,
  resolveGaneshPrashna,
  resolveHanumanPrashna,
  resolveRamshalaka,
  SACRED_PRAYERS_LIB,
  type PrashnavaliOutcome,
} from '../astro/mysticAndHealing';
import { computeNameNumber, computeNumerologyReport } from '../astro/numerology';
import { evaluateParamayusStatus } from '../astro/predictions/paramayus';
import { formatDateDmy, formatDms } from '../astro/time';
import type { AyanamsaId, BirthInput, CalcSettings, ChartData, SevenPlanetId } from '../astro/types';
import { computeChineseHoroscope, computeShivaSwarodaya } from '../astro/vedicUtilities';
import { useLanguage } from '../i18n/LanguageContext';
import { trPlanet, trSign } from '../i18n/translations';
import type { MainTab } from '../nav';
import * as Astronomy from 'astronomy-engine';
import { DateDmyInput } from './DateDmyInput';

export type HubMode =
  | 'calculators'
  | 'healing'
  | 'swarodaya'
  | 'chinese'
  | 'palmistry'
  | 'prayers'
  | 'prashnavali'
  | 'reference';

interface PortalHubViewsProps {
  chart: ChartData;
  baseInput: BirthInput;
  profiles: BirthInput[];
  settings: CalcSettings;
  onNavigate: (tab: MainTab, subTab?: string, nested?: string) => void;
  requestedMode?: { subTab?: string; nested?: string; nonce: number };
}

export const PortalHubViews: React.FC<PortalHubViewsProps> = ({
  chart,
  baseInput,
  profiles,
  settings,
  onNavigate,
  requestedMode,
}) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';
  const [mode, setMode] = useState<HubMode>('calculators');
  const [subFocus, setSubFocus] = useState<string>('rasi');

  useEffect(() => {
    const s = requestedMode?.subTab;
    if (
      s === 'calculators' ||
      s === 'healing' ||
      s === 'swarodaya' ||
      s === 'chinese' ||
      s === 'palmistry' ||
      s === 'prayers' ||
      s === 'prashnavali' ||
      s === 'reference'
    ) {
      setMode(s);
    }
    if (requestedMode?.nested) {
      setSubFocus(requestedMode.nested);
    }
  }, [requestedMode?.nonce, requestedMode?.subTab, requestedMode?.nested]);

  const paramayus = useMemo(() => evaluateParamayusStatus(chart), [chart]);

  // Calculators state
  const [calcSub, setCalcSub] = useState<'signs' | 'ayanamsa' | 'name_compat' | 'friendship'>('signs');
  const [partnerNameA, setPartnerNameA] = useState(baseInput.name || 'Aarav');
  const [partnerDateA, setPartnerDateA] = useState(baseInput.date || '2000-05-15');
  const [partnerNameB, setPartnerNameB] = useState(profiles[profiles.length - 1]?.name || 'Meera');
  const [partnerDateB, setPartnerDateB] = useState(profiles[profiles.length - 1]?.date || '2001-08-20');
  const [friendA, setFriendA] = useState<SevenPlanetId>('Jupiter');
  const [friendB, setFriendB] = useState<SevenPlanetId>('Venus');

  useEffect(() => {
    if (mode === 'calculators') {
      if (subFocus === 'ayanamsa') setCalcSub('ayanamsa');
      else if (subFocus === 'name_compat') setCalcSub('name_compat');
      else if (subFocus === 'friendship') setCalcSub('friendship');
      else setCalcSub('signs');
    }
  }, [mode, subFocus]);

  // Multi-Ayanamsa comparison for active chart
  const ayanComparison = useMemo(() => {
    const t = new Astronomy.AstroTime(new Date(chart.utcMs));
    return (Object.keys(AYANAMSA_META) as AyanamsaId[]).map((id) => ({
      id,
      label: AYANAMSA_META[id].label,
      deg: computeAyanamsaDeg(t, id),
    }));
  }, [chart.utcMs]);

  const nameCompatResult = useMemo(() => {
    const nA = computeNameNumber(partnerNameA, 'chaldean');
    const nB = computeNameNumber(partnerNameB, 'chaldean');
    const sumDigits = (d: string) => {
      let s = d.replace(/\D/g, '').split('').reduce((acc, ch) => acc + parseInt(ch, 10), 0);
      while (s > 9 && s !== 11 && s !== 22) {
        s = String(s).split('').reduce((acc, ch) => acc + parseInt(ch, 10), 0);
      }
      return s || 1;
    };
    const rootA = sumDigits(partnerDateA.split('-')[2] || '01');
    const rootB = sumDigits(partnerDateB.split('-')[2] || '01');
    const nameHarmonious = Math.abs(nA.reduced - nB.reduced) % 3 === 0 || (nA.reduced + nB.reduced) % 2 === 0;
    const dateHarmonious = Math.abs(rootA - rootB) <= 3 || rootA + rootB === 10;
    const score = (nameHarmonious ? 45 : 34) + (dateHarmonious ? 43 : 33);
    return { nA, nB, rootA, rootB, score, nameHarmonious, dateHarmonious };
  }, [partnerNameA, partnerDateA, partnerNameB, partnerDateB]);

  // Swarodaya state
  const [swaraDate, setSwaraDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [swaraTime, setSwaraTime] = useState(() => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:00`;
  });
  const swarodaya = useMemo(
    () => computeShivaSwarodaya(swaraDate, swaraTime, baseInput, settings),
    [swaraDate, swaraTime, baseInput, settings]
  );

  // Chinese Horoscope state
  const [chinYear, setChinYear] = useState<number>(
    () => parseInt(baseInput.date.slice(0, 4), 10) || 1995
  );
  const [chinTargetYear, setChinTargetYear] = useState<number>(2027);
  useEffect(() => {
    if (mode === 'chinese') {
      const y = parseInt(baseInput.date.slice(0, 4), 10);
      if (Number.isFinite(y) && y > 1900) setChinYear(y);
      if (subFocus === '2026') setChinTargetYear(2026);
      else if (subFocus === '2027') setChinTargetYear(2027);
    }
  }, [mode, subFocus, baseInput.date]);

  const chineseReport = useMemo(
    () => computeChineseHoroscope(chinYear, chinTargetYear),
    [chinYear, chinTargetYear]
  );

  // Healing & Palmistry
  const healingReport = useMemo(() => computeChartHealingReport(chart), [chart]);
  const palmMounts = useMemo(() => computeSamudrikaPalmMounts(chart), [chart]);

  // Sacred Prayers filter
  const [prayerCat, setPrayerCat] = useState<'All' | 'Mantra' | 'Chalisa' | 'Aarti' | 'Dharma'>('All');
  useEffect(() => {
    if (mode === 'prayers') {
      if (subFocus === 'mantra') setPrayerCat('Mantra');
      else if (subFocus === 'chalisa') setPrayerCat('Chalisa');
      else if (subFocus === 'aarti') setPrayerCat('Aarti');
      else if (subFocus === 'dharma') setPrayerCat('Dharma');
      else setPrayerCat('All');
    }
  }, [mode, subFocus]);

  // Prashnavali state (Ramshalaka / Hanuman / Ganesh)
  const [oracleMode, setOracleMode] = useState<'ramshalaka' | 'hanuman' | 'ganesh'>('ramshalaka');
  const [oracleOutcome, setOracleOutcome] = useState<PrashnavaliOutcome | null>(null);
  useEffect(() => {
    if (mode === 'prashnavali') {
      if (subFocus === 'hanuman') setOracleMode('hanuman');
      else if (subFocus === 'ganesh') setOracleMode('ganesh');
      else setOracleMode('ramshalaka');
      setOracleOutcome(null);
    }
  }, [mode, subFocus]);

  // Learn / Reference state
  const [refSub, setRefSub] = useState<'learn' | 'planets' | 'signs' | 'nakshatras'>('learn');
  useEffect(() => {
    if (mode === 'reference') {
      if (subFocus === 'planets') setRefSub('planets');
      else if (subFocus === 'signs') setRefSub('signs');
      else if (subFocus === 'nakshatras') setRefSub('nakshatras');
      else setRefSub('learn');
    }
  }, [mode, subFocus]);

  const sunBody = chart.planets.find((p) => p.id === 'Sun')!;
  const moonBody = chart.planets.find((p) => p.id === 'Moon')!;
  const numReport = useMemo(
    () =>
      computeNumerologyReport(
        baseInput.name,
        baseInput.date,
        baseInput.gender || 'other'
      ),
    [baseInput.name, baseInput.date, baseInput.gender]
  );

  return (
    <div className="view-stack">
      <div className="charts-toolbar">
        <div className="subtab-bar">
          {(
            [
              ['calculators', isHi ? 'कैलकुलेटर हब' : 'Calculators', <Calculator size={13} />],
              ['healing', isHi ? 'आरोग्य व चिकित्सा (9)' : 'Healing & Wellness', <Heart size={13} />],
              ['swarodaya', isHi ? 'शिव स्वरोदय' : 'Swarodaya', <Wind size={13} />],
              ['chinese', isHi ? 'चाइनीज राशिफल' : 'Chinese Astrology', <Moon size={13} />],
              ['palmistry', isHi ? 'हस्तरेखा (सामुद्रिक)' : 'Palmistry (Mounts)', <Hand size={13} />],
              ['prayers', isHi ? 'मंत्र, चालीसा व आरती' : 'Mantra · Chalisa · Aarti', <Flame size={13} />],
              ['prashnavali', isHi ? 'रामशलाका व प्रश्नावली' : 'Ramshalaka & Oracles', <Sparkles size={13} />],
              ['reference', isHi ? 'ज्योतिष ज्ञान (ग्रह/राशि)' : 'Learn · Planets · Naks', <BookOpen size={13} />],
            ] as Array<[HubMode, string, React.ReactNode]>
          ).map(([id, lbl, icon]) => (
            <button
              key={id}
              type="button"
              className={`subtab-btn ${mode === id ? 'is-active' : ''}`}
              onClick={() => setMode(id)}
            >
              {icon} {lbl}
            </button>
          ))}
        </div>
      </div>

      {/* 1. CALCULATORS HUB */}
      {mode === 'calculators' && (
        <section className="panel">
          <div className="panel-header">
            <h3>
              <Calculator size={15} />{' '}
              {isHi
                ? `तत्काल ज्योतिष कैलकुलेटर — ${baseInput.name}`
                : `Instant Vedic & Numerology Calculators — ${baseInput.name}`}
            </h3>
            <div className="subtab-bar">
              <button type="button" className={`subtab-btn ${calcSub === 'signs' ? 'is-active' : ''}`} onClick={() => setCalcSub('signs')}>
                {isHi ? 'लग्न, राशि, सूर्य व नक्षत्र' : 'Ascendant · Moon · Sun · Nakshatra'}
              </button>
              <button type="button" className={`subtab-btn ${calcSub === 'ayanamsa' ? 'is-active' : ''}`} onClick={() => setCalcSub('ayanamsa')}>
                {isHi ? 'अयनांश तुलना' : 'Ayanamsa Calculator'}
              </button>
              <button type="button" className={`subtab-btn ${calcSub === 'name_compat' ? 'is-active' : ''}`} onClick={() => setCalcSub('name_compat')}>
                {isHi ? 'नाम व जन्मतिथि मिलान' : 'Name & Birth Date Match'}
              </button>
              <button type="button" className={`subtab-btn ${calcSub === 'friendship' ? 'is-active' : ''}`} onClick={() => setCalcSub('friendship')}>
                {isHi ? 'ग्रह मैत्री जाँच' : 'Planetary Friendship'}
              </button>
            </div>
          </div>

          <div className="pred-card-body">
            {calcSub === 'signs' && (
              <div className="domains-grid">
                <article className="domain-card">
                  <div className="domain-top">
                    <h4>{isHi ? 'लग्न कैलकुलेटर (Ascendant)' : 'Ascendant / Lagna Calculator'}</h4>
                    <span className="tag tag-varg">{trSign(chart.ascendant.signIndex, lang)}</span>
                  </div>
                  <p className="domain-summary">
                    {chart.ascendant.dms} ({trPlanet(chart.ascendant.signLord, lang)} ruled) ·{' '}
                    {chart.ascendant.nakshatraName} P{chart.ascendant.pada}
                  </p>
                </article>
                <article className="domain-card">
                  <div className="domain-top">
                    <h4>{isHi ? 'चंद्र राशि कैलकुलेटर (Moon / Rasi)' : 'Moon Sign (Janma Rasi) Calculator'}</h4>
                    <span className="tag tag-varg">{trSign(moonBody.signIndex, lang)}</span>
                  </div>
                  <p className="domain-summary">
                    {moonBody.dms} ({trPlanet(moonBody.signLord, lang)} ruled) · Sub-Lord: {trPlanet(moonBody.subLord, lang)}
                  </p>
                </article>
                <article className="domain-card">
                  <div className="domain-top">
                    <h4>{isHi ? 'सूर्य राशि (Sidereal Sun Sign)' : 'Sidereal Sun Sign Calculator'}</h4>
                    <span className="tag tag-varg">{trSign(sunBody.signIndex, lang)}</span>
                  </div>
                  <p className="domain-summary">
                    {sunBody.dms} · {sunBody.nakshatraName} P{sunBody.pada} · Tropical:{' '}
                    {SIGNS[Math.floor(sunBody.tropicalLongitude / 30) % 12].name}
                  </p>
                </article>
                <article className="domain-card">
                  <div className="domain-top">
                    <h4>{isHi ? 'जन्म नक्षत्र व पाया कैलकुलेटर' : 'Nakshatra & Pada Calculator'}</h4>
                    <span className="tag">{chart.panchang.nakshatra.name}</span>
                  </div>
                  <p className="domain-summary">
                    Pada {chart.panchang.nakshatra.pada} · Gana: {chart.panchang.nakshatra.gana} · Nadi:{' '}
                    {chart.panchang.nakshatra.nadi} · Life Path #{numReport.bhagyank}
                  </p>
                </article>
              </div>
            )}

            {calcSub === 'ayanamsa' && (
              <div className="table-scroll">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Ayanamsa System</th>
                      <th>Offset at Birth ({formatDateDmy(baseInput.date)})</th>
                      <th>Resulting Ascendant Degree</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ayanComparison.map((row) => {
                      const tropAsc = chart.ascendant.tropicalLongitude;
                      const testSid = ((tropAsc - row.deg) % 360 + 360) % 360;
                      const sIdx = Math.floor(testSid / 30) % 12;
                      return (
                        <tr key={row.id}>
                          <td><strong>{row.label}</strong></td>
                          <td className="mono">{formatDms(row.deg)}</td>
                          <td className="mono">{trSign(sIdx, lang)} {formatDms(testSid % 30, false)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {calcSub === 'name_compat' && (
              <div className="view-stack">
                <div className="form-grid">
                  <label className="field">
                    <span>{isHi ? 'पहला नाम' : 'First Name'}</span>
                    <input type="text" className="text-input" value={partnerNameA} onChange={(e) => setPartnerNameA(e.target.value)} />
                  </label>
                  <div className="field">
                    <span>{isHi ? 'जन्म तिथि 1' : 'Birth Date 1'}</span>
                    <DateDmyInput value={partnerDateA} onChange={setPartnerDateA} />
                  </div>
                  <label className="field">
                    <span>{isHi ? 'दूसरा नाम' : 'Second Name'}</span>
                    <input type="text" className="text-input" value={partnerNameB} onChange={(e) => setPartnerNameB(e.target.value)} />
                  </label>
                  <div className="field">
                    <span>{isHi ? 'जन्म तिथि 2' : 'Birth Date 2'}</span>
                    <DateDmyInput value={partnerDateB} onChange={setPartnerDateB} />
                  </div>
                </div>
                <div className="gochar-banner is-info">
                  <strong>
                    {isHi ? `अंक संगति स्कोर: ${nameCompatResult.score}/100` : `Numerology & Birth Date Compatibility: ${nameCompatResult.score}/100`}
                  </strong>{' '}
                  — Chaldean Name Digits: {nameCompatResult.nA.reduced} ↔ {nameCompatResult.nB.reduced} | Mulank Roots:{' '}
                  {nameCompatResult.rootA} ↔ {nameCompatResult.rootB}
                </div>
              </div>
            )}

            {calcSub === 'friendship' && (
              <div className="view-stack">
                <div className="toolbar-group">
                  <select className="select-compact" value={friendA} onChange={(e) => setFriendA(e.target.value as SevenPlanetId)}>
                    {(['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'] as SevenPlanetId[]).map((p) => (
                      <option key={p} value={p}>{trPlanet(p, lang)}</option>
                    ))}
                  </select>
                  <span>↔</span>
                  <select className="select-compact" value={friendB} onChange={(e) => setFriendB(e.target.value as SevenPlanetId)}>
                    {(['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'] as SevenPlanetId[]).map((p) => (
                      <option key={p} value={p}>{trPlanet(p, lang)}</option>
                    ))}
                  </select>
                </div>
                <div className="gochar-banner is-info">
                  <strong>{isHi ? 'जन्म कुंडली पंचधा मैत्री:' : 'Natal Panchadha Maitri:'}</strong>{' '}
                  {trPlanet(friendA, lang)} sees {trPlanet(friendB, lang)} as{' '}
                  <strong>{chart.maitriMatrix[friendA]?.[friendB] || 'Neutral'}</strong> (Natural:{' '}
                  {NATURAL_FRIENDSHIP[friendA][friendB] === 1 ? 'Friend' : NATURAL_FRIENDSHIP[friendA][friendB] === -1 ? 'Enemy' : 'Neutral'}).
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 2. 9-FOLD HOLISTIC HEALING & WELLNESS STUDIO */}
      {mode === 'healing' && (
        <section className="panel">
          <div className="panel-header">
            <h3>
              <Heart size={15} />{' '}
              {isHi
                ? 'वैदिक आरोग्य एवं समग्र चिकित्सा — कुंडली आधारित 9 उपचार पद्धतियाँ'
                : 'Holistic Vedic Healing Studio — 9 Chart-Tuned Wellness Therapies'}
            </h3>
            <div className="toolbar-group">
              <span className="tag tag-varg">{isHi ? healingReport.doshaDominantHi : healingReport.doshaDominantEn}</span>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => onNavigate('branches', 'medical')}>
                {isHi ? 'मेडिकल ज्योतिष (D6)' : 'Medical Astrology →'}
              </button>
            </div>
          </div>
          <div className="pred-card-body">
            <div className="domains-grid">
              {healingReport.items.map((item) => (
                <article key={item.id} className="domain-card">
                  <div className="domain-top">
                    <h4>{isHi ? item.titleHi : item.titleEn}</h4>
                    <span className="tag">{isHi ? item.focusHi : item.focusEn}</span>
                  </div>
                  <p className="domain-summary">{isHi ? item.prescriptionHi : item.prescriptionEn}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. SHIVA SWARODAYA (BREATH & TATTVA) */}
      {mode === 'swarodaya' && (
        <section className="panel">
          <div className="panel-header">
            <h3>
              <Wind size={15} />{' '}
              {isHi
                ? `शिव स्वरोदय शास्त्र (स्वर एवं पंच-तत्व चक्र — ${swarodaya.dateDmy})`
                : `Shiva Swarodaya Calculator (Breath & 5-Tattva Cycle — ${swarodaya.dateDmy})`}
            </h3>
            <div className="toolbar-group">
              <DateDmyInput compact value={swaraDate} onChange={setSwaraDate} />
              <input
                type="time"
                step="1"
                className="text-input mono"
                style={{ width: 120 }}
                value={swaraTime}
                onChange={(e) => setSwaraTime(e.target.value.length === 5 ? `${e.target.value}:00` : e.target.value)}
              />
            </div>
          </div>
          <div className="pred-card-body">
            <div className="gochar-banner is-info" style={{ marginBottom: 12 }}>
              <strong>{isHi ? swarodaya.activeNostrilHi : swarodaya.activeNostril}</strong> ·{' '}
              {swarodaya.paksha} Tithi #{swarodaya.tithiNum} ·{' '}
              <strong>{isHi ? swarodaya.tattvaHi : swarodaya.tattvaEn}</strong>
            </div>
            <p className="domain-summary" style={{ marginBottom: 10 }}>
              {isHi ? swarodaya.guidanceHi : swarodaya.guidanceEn}
            </p>
            <div className="pred-bullets">
              {(isHi ? swarodaya.bestActivitiesHi : swarodaya.bestActivitiesEn).map((act, i) => (
                <div key={i}>• {act}</div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. CHINESE HOROSCOPE */}
      {mode === 'chinese' && (
        <section className="panel">
          <div className="panel-header">
            <h3>
              <Moon size={15} />{' '}
              {isHi ? 'चाइनीज राशिफल एवं वार्षिक सामंजस्य (2026–2027)' : 'Chinese Horoscope & Annual Synergy (2026–2027)'}
            </h3>
            <div className="toolbar-group">
              <label className="small-text muted">{isHi ? 'जन्म वर्ष:' : 'Birth Year:'}</label>
              <input
                type="number"
                className="text-input mono"
                style={{ width: 92 }}
                value={chinYear}
                onChange={(e) => setChinYear(parseInt(e.target.value, 10) || 1995)}
              />
              <select className="select-compact" value={chinTargetYear} onChange={(e) => setChinTargetYear(parseInt(e.target.value, 10))}>
                <option value={2026}>2026 (Fire Horse)</option>
                <option value={2027}>2027 (Fire Goat)</option>
              </select>
            </div>
          </div>
          <div className="pred-card-body">
            <div className="domains-grid">
              <article className="domain-card">
                <div className="domain-top">
                  <h4>{isHi ? chineseReport.animalHi : chineseReport.animalEn}</h4>
                  <span className="tag tag-varg">
                    {chineseReport.polarity} · {isHi ? chineseReport.elementHi : chineseReport.elementEn}
                  </span>
                </div>
                <p className="domain-summary">{isHi ? chineseReport.traitsHi : chineseReport.traitsEn}</p>
                <p className="label-muted" style={{ marginTop: 6, fontSize: 12 }}>
                  <strong>{isHi ? 'शुभ मित्र वर्ग:' : 'Best Allies:'}</strong>{' '}
                  {isHi ? chineseReport.trineAlliesHi : chineseReport.trineAlliesEn}
                </p>
              </article>
              <article className="domain-card">
                <div className="domain-top">
                  <h4>{isHi ? `वर्ष ${chineseReport.targetYear} फल` : `Forecast for ${chineseReport.targetYear} (${chineseReport.targetYearAnimalEn})`}</h4>
                  <span className="tag">{chineseReport.targetYear}</span>
                </div>
                <p className="domain-summary">
                  {isHi ? chineseReport.targetYearAffinityHi : chineseReport.targetYearAffinityEn}
                </p>
              </article>
            </div>
          </div>
        </section>
      )}

      {/* 5. PALMISTRY / SAMUDRIKA MOUNTS */}
      {mode === 'palmistry' && (
        <section className="panel">
          <div className="panel-header">
            <h3>
              <Hand size={15} />{' '}
              {isHi
                ? 'सामुद्रिक हस्तरेखा व सप्त-पर्वत संश्लेषण (षड्बल आधारित)'
                : 'Samudrika Shastra & Palmistry Mounts (Correlated with Natal Shadbala)'}
            </h3>
          </div>
          <div className="pred-card-body">
            <div className="domains-grid">
              {palmMounts.map((m) => (
                <article key={m.planet} className="domain-card">
                  <div className="domain-top">
                    <h4>{isHi ? m.mountHi : m.mountEn}</h4>
                    <span className={`tag ${m.strengthRatio >= 1 ? 'tag-varg' : ''}`}>
                      {m.strengthRatio.toFixed(2)}×
                    </span>
                  </div>
                  <div className="label-muted" style={{ fontSize: 11.5, marginBottom: 4 }}>
                    {isHi ? m.locationHi : m.locationEn}
                  </div>
                  <p className="domain-summary">{isHi ? m.readingHi : m.readingEn}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. MANTRA, CHALISA, AARTI & DHARMA-KARMA */}
      {mode === 'prayers' && (
        <section className="panel">
          <div className="panel-header">
            <h3>
              <Flame size={15} />{' '}
              {isHi ? 'नवग्रह मंत्र, चालीसा, आरती व धर्म-कर्म पाठ' : 'Sacred Mantras, Chalisa, Aarti & Dharma Guide'}
            </h3>
            <div className="subtab-bar">
              {(['All', 'Mantra', 'Chalisa', 'Aarti', 'Dharma'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`subtab-btn ${prayerCat === cat ? 'is-active' : ''}`}
                  onClick={() => setPrayerCat(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div className="pred-card-body">
            <div className="domains-grid">
              {SACRED_PRAYERS_LIB.filter((p) => prayerCat === 'All' || p.category === prayerCat).map((item) => (
                <article key={item.id} className="domain-card">
                  <div className="domain-top">
                    <h4>{isHi ? item.titleHi : item.titleEn}</h4>
                    <span className="tag tag-varg">{item.planetOrDeity}</span>
                  </div>
                  <pre className="prayer-text-block">{item.sanskritOrHindiText}</pre>
                  <p className="domain-summary">{isHi ? item.meaningHi : item.meaningEn}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. RAMSHALAKA, HANUMAN PRASHNA YANTRA & GANESH CHAKRA */}
      {mode === 'prashnavali' && (
        <section className="panel">
          <div className="panel-header">
            <h3>
              <Sparkles size={15} />{' '}
              {isHi ? 'श्री रामशलाका, हनुमान प्रश्नावली व गणेश प्रश्न चक्र' : 'Sacred Vedic Oracles — Ramshalaka, Hanuman & Ganesh Prashnavali'}
            </h3>
            <div className="subtab-bar">
              <button type="button" className={`subtab-btn ${oracleMode === 'ramshalaka' ? 'is-active' : ''}`} onClick={() => { setOracleMode('ramshalaka'); setOracleOutcome(null); }}>
                {isHi ? 'रामशलाका (15×15)' : 'Ramshalaka (15×15)'}
              </button>
              <button type="button" className={`subtab-btn ${oracleMode === 'hanuman' ? 'is-active' : ''}`} onClick={() => { setOracleMode('hanuman'); setOracleOutcome(null); }}>
                {isHi ? 'हनुमान प्रश्नावली (7×7)' : 'Hanuman Yantra (49)'}
              </button>
              <button type="button" className={`subtab-btn ${oracleMode === 'ganesh' ? 'is-active' : ''}`} onClick={() => { setOracleMode('ganesh'); setOracleOutcome(null); }}>
                {isHi ? 'गणेश प्रश्न चक्र' : 'Ask Ganesha Chakra'}
              </button>
            </div>
          </div>
          <div className="pred-card-body">
            <p className="muted" style={{ marginBottom: 10 }}>
              {isHi
                ? 'मन में अपना प्रश्न शांति व श्रद्धापूर्वक स्मरण करके किसी एक अक्षर या अंक पर स्पर्श/क्लिक करें:'
                : 'Hold your sincere question calmly in mind and click any syllable/cell below:'}
            </p>

            {oracleMode === 'ramshalaka' && (
              <div className="ramshalaka-grid">
                {RAMSHALAKA_CELLS.map((cell, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="oracle-cell-btn"
                    onClick={() => setOracleOutcome(resolveRamshalaka(idx))}
                  >
                    {cell.letter}
                  </button>
                ))}
              </div>
            )}

            {oracleMode === 'hanuman' && (
              <div className="hanuman-grid">
                {Array.from({ length: 49 }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    type="button"
                    className="oracle-cell-btn"
                    onClick={() => setOracleOutcome(resolveHanumanPrashna(num))}
                  >
                    {num}
                  </button>
                ))}
              </div>
            )}

            {oracleMode === 'ganesh' && (
              <div className="ganesh-grid">
                {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    type="button"
                    className="oracle-cell-btn is-wide"
                    onClick={() => setOracleOutcome(resolveGaneshPrashna(num))}
                  >
                    ॐ {num}
                  </button>
                ))}
              </div>
            )}

            {oracleOutcome && (
              <div className="gochar-banner is-info" style={{ marginTop: 14 }}>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{oracleOutcome.chaupai}</div>
                <div className="tag tag-varg" style={{ marginBottom: 6 }}>
                  {oracleOutcome.verdict} · {isHi ? oracleOutcome.sourceHi : oracleOutcome.sourceEn}
                </div>
                <div>{isHi ? oracleOutcome.meaningHi : oracleOutcome.meaningEn}</div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 8. LEARN ASTROLOGY & REFERENCE ENCYCLOPEDIA */}
      {mode === 'reference' && (
        <section className="panel">
          <div className="panel-header">
            <h3>
              <Compass size={15} />{' '}
              {isHi ? 'ज्योतिष शिक्षण, नवग्रह, 12 राशियाँ व 27 नक्षत्र' : 'Learn Jyotish Shastra — Grahas, Signs & 27 Nakshatras'}
            </h3>
            <div className="subtab-bar">
              <button type="button" className={`subtab-btn ${refSub === 'learn' ? 'is-active' : ''}`} onClick={() => setRefSub('learn')}>
                {isHi ? 'ज्योतिष सीखें' : 'Learn Astrology'}
              </button>
              <button type="button" className={`subtab-btn ${refSub === 'planets' ? 'is-active' : ''}`} onClick={() => setRefSub('planets')}>
                {isHi ? '9 ग्रह विवरण' : '9 Planets (Navagraha)'}
              </button>
              <button type="button" className={`subtab-btn ${refSub === 'signs' ? 'is-active' : ''}`} onClick={() => setRefSub('signs')}>
                {isHi ? '12 राशियाँ' : '12 Zodiac Signs'}
              </button>
              <button type="button" className={`subtab-btn ${refSub === 'nakshatras' ? 'is-active' : ''}`} onClick={() => setRefSub('nakshatras')}>
                {isHi ? '27 नक्षत्र' : '27 Nakshatras'}
              </button>
            </div>
          </div>
          <div className="pred-card-body">
            {refSub === 'learn' && (
              <div className="domains-grid">
                <article className="domain-card">
                  <h4>1. Rasi (D1) · 12 Houses & Ascendant (Lagna)</h4>
                  <p className="domain-summary">
                    {isHi
                      ? 'लग्न चक्र जीवन का आधार है। केंद्र (1,4,7,10), त्रिकोण (1,5,9) और त्रिक (6,8,12) भाव ग्रहों की शुभ-अशुभ स्थिति तय करते हैं।'
                      : 'The Rising Sign sets the 12 Houses. Kendras (1,4,7,10) provide action power, Trikonas (1,5,9) bless fortune/dharma, and Vargas refine each life sphere.'}
                  </p>
                </article>
                <article className="domain-card">
                  <h4>2. Vimshottari & Chara Dasha + Gochar Transits</h4>
                  <p className="domain-summary">
                    {isHi
                      ? 'दशा जीवन के प्रमुख घटनाक्रमों का समय तय करती है तथा गोचर व अष्टकवर्ग (BAV/SAV) घटना के घटित होने की सटीक अवधि बताते हैं।'
                      : 'Dashas unlock natal promises across 120 years; Transits (Jupiter/Saturn/Nodes) & Prasthara Ashtakavarga trigger events inside active Dasha/Antardasha windows.'}
                  </p>
                </article>
                <article className="domain-card">
                  <h4>3. Systems' Approach (MEP) · Nadi · KP</h4>
                  <p className="domain-summary">
                    {isHi
                      ? 'भाव का मध्य बिंदु (MEP) सटीक अंश फल देता है, भृगु नंदी नाड़ी कर्म श्रृंखला दिखाती है व KP उप-स्वामी घटना की निश्चितता दर्शाता है।'
                      : 'Ascendant degree serves as every house MEP (±5° orb), Bhrigu Nandi Nadi traces karaka chains, and KP Cuspal Sub-Lords pinpoint event confirmation.'}
                  </p>
                </article>
              </div>
            )}

            {refSub === 'planets' && (
              <div className="table-scroll">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Planet</th>
                      <th>Your House / Sign</th>
                      <th>Degree & Dignity</th>
                      <th>Shadbala Ratio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chart.planets.map((p) => {
                      const sh = chart.shadbala.find((s) => s.planet === p.id);
                      return (
                        <tr key={p.id}>
                          <td><strong>{trPlanet(p.id, lang)}</strong></td>
                          <td>H{p.rasiHouseNumber} · {trSign(p.signIndex, lang)}</td>
                          <td className="mono">{p.shortDms} ({p.dignity})</td>
                          <td className="mono">{paramayus.exceeded ? '—' : sh ? `${sh.ratio.toFixed(2)}×` : 'Nodal'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {refSub === 'signs' && (
              <div className="domains-grid">
                {SIGNS.map((s) => (
                  <article key={s.index} className="domain-card">
                    <div className="domain-top">
                      <h4>{s.index + 1}. {trSign(s.index, lang)} ({s.sanskrit})</h4>
                      <span className="tag">{s.element} · {s.modality}</span>
                    </div>
                    <p className="domain-summary">
                      Ruler: <strong>{trPlanet(s.lord, lang)}</strong> · Varna: {s.varna} · Vashya: {s.vashya}
                    </p>
                  </article>
                ))}
              </div>
            )}

            {refSub === 'nakshatras' && (
              <div className="table-scroll max-h-340">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Nakshatra</th>
                      <th>Ruler</th>
                      <th>Deity</th>
                      <th>Gana / Yoni / Nadi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {NAKSHATRAS.map((n) => (
                      <tr key={n.index}>
                        <td className="mono">{n.index + 1}</td>
                        <td>
                          <strong>{n.name}</strong>
                          {n.index === chart.panchang.nakshatra.index && <span className="tag tag-varg" style={{ marginLeft: 6 }}>Janma</span>}
                        </td>
                        <td>{trPlanet(n.lord, lang)}</td>
                        <td>{n.deity}</td>
                        <td>{n.gana} · {n.yoni} · {n.nadi}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};
