import React, { useMemo, useState } from 'react';
import { HelpCircle, RefreshCw, Sparkles } from 'lucide-react';
import { calculateChart } from '../astro/calculator';
import {
  analyzePrashnaChart,
  type PrashnaCategory,
} from '../astro/predictions/dashaPrashna';
import type { BirthInput, CalcSettings, ChartStyle } from '../astro/types';
import { localizePrashnaHi, trBadge } from '../i18n/hindiPredictions';
import { useLanguage } from '../i18n/LanguageContext';
import { trPlanet, trPlanetShort, trSign } from '../i18n/translations';
import { DateDmyInput } from './DateDmyInput';
import { VedicChartSvg } from './VedicChartSvg';

interface PrashnaViewProps {
  baseInput: BirthInput;
  settings: CalcSettings;
  chartStyle: ChartStyle;
}

function getNowLocalDateTime(): { date: string; time: string } {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return {
    date: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`,
    time: `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`,
  };
}

const PRASHNA_CATEGORIES: Array<{ id: PrashnaCategory; en: string; hi: string }> = [
  { id: 'general', en: 'General / Yes-No Outcome (H1)', hi: 'सामान्य प्रश्न / हाँ-नहीं निर्णय (भाव 1)' },
  { id: 'career', en: 'Career, Job & Promotion (H10)', hi: 'करियर, नौकरी व पदोन्नति (भाव 10)' },
  { id: 'marriage', en: 'Marriage, Love & Reconciliation (H7)', hi: 'विवाह, प्रेम व दांपत्य मेल (भाव 7)' },
  { id: 'wealth', en: 'Wealth, Business & Debt Recovery (H11)', hi: 'धन, व्यापार व रुका धन प्राप्ति (भाव 11)' },
  { id: 'education', en: 'Education, Exams & Admission (H5)', hi: 'शिक्षा, परीक्षा व प्रवेश (भाव 5)' },
  { id: 'health', en: 'Health & Recovery from Illness (H6)', hi: 'स्वास्थ्य व रोग से मुक्ति (भाव 6)' },
  { id: 'litigation', en: 'Litigation, Rivals & Disputes (H6)', hi: 'न्यायालय, मुकदमा व विवाद (भाव 6)' },
  { id: 'travel', en: 'Travel, Relocation & Visa (H9)', hi: 'यात्रा, स्थान परिवर्तन व विदेश (भाव 9)' },
  { id: 'property', en: 'Property, Home & Vehicle (H4)', hi: 'भूमि, भवन, मकान व वाहन (भाव 4)' },
  { id: 'lost_object', en: 'Lost Item / Missing Recovery (H2)', hi: 'खोई वस्तु / गुम व्यक्ति की तलाश (भाव 2)' },
];

export const PrashnaView: React.FC<PrashnaViewProps> = ({
  baseInput,
  settings,
  chartStyle,
}) => {
  const { lang } = useLanguage();
  const initial = useMemo(() => getNowLocalDateTime(), []);
  const [question, setQuestion] = useState('Will this endeavor succeed smoothly?');
  const [category, setCategory] = useState<PrashnaCategory>('general');
  const [date, setDate] = useState(initial.date);
  const [time, setTime] = useState(initial.time);
  const [horaryInput, setHoraryInput] = useState<string>('');

  const prashnaInput: BirthInput = useMemo(
    () => ({
      ...baseInput,
      id: 'live-prashna',
      name: 'Prashna Kundali',
      date,
      time,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || baseInput.timezone,
      utcOffsetMinutes: undefined,
    }),
    [baseInput, date, time]
  );

  const prashnaChart = useMemo(
    () => calculateChart(prashnaInput, settings),
    [prashnaInput, settings]
  );

  const parsedHorary = useMemo(() => {
    const n = parseInt(horaryInput, 10);
    return !Number.isNaN(n) && n >= 1 && n <= 249 ? n : undefined;
  }, [horaryInput]);

  const rawAnalysis = useMemo(
    () => analyzePrashnaChart(prashnaChart, question, category, parsedHorary),
    [prashnaChart, question, category, parsedHorary]
  );

  const analysis = useMemo(
    () => (lang === 'hi' ? localizePrashnaHi(rawAnalysis, prashnaChart) : rawAnalysis),
    [rawAnalysis, lang, prashnaChart]
  );

  const handleCastNow = () => {
    const cur = getNowLocalDateTime();
    setDate(cur.date);
    setTime(cur.time);
  };

  const displayAscSign = rawAnalysis.horaryAscSign
    ? ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'].indexOf(rawAnalysis.horaryAscSign)
    : prashnaChart.ascendant.signIndex;

  return (
    <div className="view-stack">
      {/* Prashna Query Input Toolbar */}
      <section className="panel">
        <div className="panel-header">
          <h3>
            <HelpCircle size={16} />{' '}
            {lang === 'hi'
              ? 'प्रश्न कुंडली विश्लेषण (प्रश्न मार्ग, ताजिक एवं KP 1–249)'
              : 'Prashna Kundali (Horary Astrology — Prashna Marga, Tajika & KP 1–249)'}
          </h3>
          <button type="button" className="btn btn-primary btn-sm" onClick={handleCastNow}>
            <RefreshCw size={13} />
            {lang === 'hi' ? 'तत्काल अभी का प्रश्न बनाएं' : 'Cast Live Prashna Now'}
          </button>
        </div>

        <div className="form-grid">
          <label className="field span-2">
            <span>{lang === 'hi' ? 'प्रश्नकर्ता का प्रश्न' : "Querent's Question"}</span>
            <input
              type="text"
              className="text-input"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={
                lang === 'hi'
                  ? 'अपना स्पष्ट प्रश्न लिखें (जैसे: क्या मुझे नौकरी/पदोन्नति मिलेगी? क्या खोई वस्तु मिलेगी?)'
                  : 'Enter specific question (e.g. Will I get the promotion? Will my lost item return?)'
              }
            />
          </label>

          <label className="field">
            <span>{lang === 'hi' ? 'प्रश्न श्रेणी (कार्य भाव)' : 'Query Category (Karya Bhava)'}</span>
            <select
              className="text-input"
              value={category}
              onChange={(e) => setCategory(e.target.value as PrashnaCategory)}
            >
              {PRASHNA_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {lang === 'hi' ? c.hi : c.en}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>{lang === 'hi' ? 'प्रश्न दिनांक (DD-MM-YYYY)' : 'Prashna Date (DD-MM-YYYY)'}</span>
            <DateDmyInput
              value={date}
              ariaLabel={lang === 'hi' ? 'प्रश्न दिनांक (DD-MM-YYYY)' : 'Prashna Date (DD-MM-YYYY)'}
              onChange={setDate}
            />
          </label>

          <label className="field">
            <span>{lang === 'hi' ? 'प्रश्न समय (24 घंटे)' : 'Prashna Time (24h)'}</span>
            <input
              type="time"
              step="1"
              className="text-input mono"
              value={time}
              onChange={(e) =>
                setTime(e.target.value.length === 5 ? `${e.target.value}:00` : e.target.value)
              }
            />
          </label>

          <label className="field">
            <span>{lang === 'hi' ? 'वैकल्पिक KP प्रश्न अंक (1–249)' : 'Optional KP Horary Number (1–249)'}</span>
            <input
              type="number"
              min="1"
              max="249"
              className="text-input mono"
              value={horaryInput}
              onChange={(e) => setHoraryInput(e.target.value)}
              placeholder={lang === 'hi' ? 'लाइव उदय लग्न के लिए खाली छोड़ें' : 'Leave blank for Live Udaya Lagna'}
            />
          </label>
        </div>
      </section>

      {/* Prashna Chart & Verdict */}
      <div className="varga-focus-grid">
        <VedicChartSvg
          title={lang === 'hi' ? `प्रश्न कुंडली (${date} ${time})` : `Prashna Chart (${date} ${time})`}
          subtitle={
            analysis.horaryAscSign
              ? `KP #${analysis.horaryNumber}: ${analysis.horaryAscSign} ${analysis.horaryAscDms}`
              : `${lang === 'hi' ? 'उदय लग्न:' : 'Udaya Lagna:'} ${trSign(prashnaChart.ascendant.signIndex, lang)} ${prashnaChart.ascendant.shortDms}`
          }
          style={chartStyle}
          lagnaSignIndex={displayAscSign >= 0 ? displayAscSign : prashnaChart.ascendant.signIndex}
          centerLabel={lang === 'hi' ? 'प्रश्न' : 'PRASHNA'}
          items={[
            {
              id: 'Asc',
              label: trPlanetShort('Asc', lang),
              signIndex: displayAscSign >= 0 ? displayAscSign : prashnaChart.ascendant.signIndex,
              isLagna: true,
            },
            ...prashnaChart.planets.map((p) => ({
              id: p.id,
              label: trPlanetShort(p.id, lang),
              signIndex: p.signIndex,
              isRetrograde: p.isRetrograde,
              isCombust: p.isCombust,
              dignity: p.dignity,
            })),
          ]}
        />

        <div className="view-stack">
          <section className="panel">
            <div className="panel-header">
              <h3>
                <Sparkles size={15} /> {lang === 'hi' ? 'प्रश्न फल एवं ज्योतिषीय निर्णय' : 'Prashna Verdict & Judgment'}
              </h3>
              <div className="toolbar-group">
                <span className="tag tag-karaka">{lang === 'hi' ? 'अंक:' : 'Score:'} {analysis.outcomeScore}/100</span>
                <span
                  className={`tag ${
                    analysis.outcomeScore >= 74
                      ? 'tag-varg'
                      : analysis.outcomeScore >= 58
                        ? 'tag-karaka'
                        : 'tag-combust'
                  }`}
                >
                  {trBadge(analysis.verdict, lang)}
                </span>
              </div>
            </div>

            <div className="pred-card-body">
              <div className="branch-highlights">
                <div className="highlight-box">
                  <span className="muted small-text">
                    {lang === 'hi'
                      ? `प्रश्नकर्ता (लग्नेश: ${trPlanet(analysis.lagnaLord, lang)})`
                      : `Querent (Lagna Lord: ${analysis.lagnaLord})`}
                  </span>
                  <strong>{analysis.lagnaLordPlacement}</strong>
                </div>
                <div className="highlight-box">
                  <span className="muted small-text">
                    {lang === 'hi'
                      ? `कार्य भाव ${analysis.queryHouse} (कार्येश: ${trPlanet(analysis.karyesha, lang)})`
                      : `Query H${analysis.queryHouse} (Karyesha: ${analysis.karyesha})`}
                  </span>
                  <strong>{analysis.karyeshaPlacement}</strong>
                </div>
              </div>

              <div className="gochar-banner is-info">
                <strong>{lang === 'hi' ? 'ताजिक योग:' : 'Tajika Yoga:'} {analysis.tajikaYoga}</strong> — {analysis.tajikaDetail}
              </div>

              <div className="pred-bullets">
                <div>
                  <strong>{lang === 'hi' ? 'संभावित समयावधि:' : 'Timing Estimate:'}</strong> {analysis.timingEstimate}
                </div>
                <div>
                  <strong>{lang === 'hi' ? 'प्रश्न चंद्र (चंद्र शुद्धि):' : 'Prashna Moon (Chandra Shuddhi):'}</strong> {analysis.moonCondition}
                </div>
                <div>
                  <strong>{lang === 'hi' ? 'पंचांग व होरा शकुन:' : 'Panchang & Hora Omen:'}</strong> {analysis.panchangOmen}
                </div>
                <div>
                  <strong>{lang === 'hi' ? 'KP / प्रश्न लग्न विवरण:' : 'KP / Horary Lagna Note:'}</strong> {analysis.kpHoraryNote}
                </div>
                {category === 'lost_object' && (
                  <div>
                    <strong>{lang === 'hi' ? 'खोई वस्तु दिशा संकेत:' : 'Direction Hint (Missing/Lost Item):'}</strong>{' '}
                    {lang === 'hi' ? 'खोजने की संभावित दिशा:' : 'Look toward'}{' '}
                    <strong>{analysis.lostObjectDirection}</strong>.
                  </div>
                )}
              </div>

              <ul className="domain-details">
                {analysis.keyInsights.map((ins, i) => (
                  <li key={i}>{ins}</li>
                ))}
              </ul>

              <div className="gochar-banner is-clear">
                <strong>{lang === 'hi' ? 'ज्योतिषीय परामर्श:' : "Astrologer's Counsel:"}</strong> {analysis.advice}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
