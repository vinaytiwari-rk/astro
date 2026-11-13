import React, { useEffect, useMemo, useState } from 'react';
import {
  Award,
  BookOpen,
  Calendar,
  Clock,
  Compass,
  Download,
  GraduationCap,
  Layers,
  RotateCcw,
  Sparkles,
  Zap,
} from 'lucide-react';
import { computeNumerologyReport } from '../astro/numerology';
import { generatePredictionReport } from '../astro/predictions/engine';
import type { PredictionReport } from '../astro/predictions/types';
import { formatDateDmy } from '../astro/time';
import type { ChartData, ChartStyle } from '../astro/types';
import { localizePredictionReportHi, trBadge } from '../i18n/hindiPredictions';
import { useLanguage } from '../i18n/LanguageContext';
import { trPlanet, trSign, type AppLanguage } from '../i18n/translations';
import { DateDmyInput } from './DateDmyInput';
import { DashaWisePanel, GocharWisePanel } from './predictions/DashaAndGocharPanels';
import {
  BranchesAndNumerologyPanel,
  DivisionalPredictionsPanel,
} from './predictions/DivisionalAndBranchesPanels';
import {
  DegreeWisePanel,
  HouseWisePanel,
  PlanetInHousePanel,
} from './predictions/HouseAndDegreePanels';
import { LifeEventsLedgerPanel } from './predictions/LifeEventsLedgerPanel';
import {
  BhavatBhavamPanel,
  DrishtiWisePanel,
} from './predictions/BhavatAndDrishtiPanels';
import {
  Bhavesha144Panel,
  BhriguNadiPanel,
} from './predictions/BhriguNadiAndBhaveshaPanels';
import {
  PlanetInNakshatraPanel,
  PlanetInSignPanel,
} from './predictions/PlanetSignNakshatraPanels';
import { AdvancedTechniquesPanel } from './predictions/AdvancedTechniquesPanel';
import { PredictionsPatrikaFrame } from './predictions/PatrikaBookContent';
import { PastLifeFuturePanel } from './predictions/PastLifeFuturePanel';
import { YutiPanel } from './predictions/YutiPanel';
import { ClassicalYogasPanel } from './predictions/ClassicalYogasPanel';
import { DeepLifePredictionsPanel } from './predictions/DeepLifePredictionsPanel';
import { ParamayusLockBanner } from './ParamayusLockBanner';

interface PredictionsViewProps {
  chart: ChartData;
  chartStyle: ChartStyle;
  requestedRoute?: { subTab?: string; nested?: string; nonce: number };
  personaMode?: 'professional' | 'learner' | 'simple';
}

export type PredSubTab =
  | 'deep_life'
  | 'classicalYogas'
  | 'eventsLedger'
  | 'bhavas12'
  | 'bhriguNadi'
  | 'yuti'
  | 'pastFuture'
  | 'advancedTechniques'
  | 'bhavesha144'
  | 'bhavatBhavam'
  | 'drishtiWise'
  | 'planetInSign'
  | 'planetInNakshatra'
  | 'planetInHouse'
  | 'houseWise'
  | 'degreeWise'
  | 'dashaWise'
  | 'gocharWise'
  | 'divisional'
  | 'branchesNumerology';

function formatReportText(chart: ChartData, report: PredictionReport, lang: AppLanguage): string {
  if (report.paramayus.exceeded) {
    return lang === 'hi'
      ? [
          `ज्योतिष होरा — परमायु सीमा (120 वर्ष) अवरोध`,
          `जातक: ${chart.input.name} | जन्म: ${formatDateDmy(chart.input.date)}`,
          report.paramayus.titleHi,
          report.paramayus.messageHi,
          report.paramayus.noteHi,
        ].join('\n\n')
      : [
          `JYOTISH HORA — 120-YEAR PARAMAYUS LIMIT REACHED`,
          `Native: ${chart.input.name} | Birth: ${formatDateDmy(chart.input.date)}`,
          report.paramayus.titleEn,
          report.paramayus.messageEn,
          report.paramayus.noteEn,
        ].join('\n\n');
  }

  const lp = report.lagnaProfile;
  const num = computeNumerologyReport(
    chart.input.name,
    chart.input.date,
    chart.input.gender || 'other'
  );
  const leg = report.lifeEventsLedger;
  const pf = report.pastFutureLife;

  if (lang === 'hi') {
    return [
      `ज्योतिष होरा — संपूर्ण जीवन, पूर्व-जन्म, भविष्य गति, 120-वर्ष घटनाक्रम, युति (2–7 ग्रह) व अंक ज्योतिष फलादेश`,
      `जातक: ${chart.input.name} | जन्म: ${formatDateDmy(chart.input.date)} ${chart.input.time} | स्थान: ${chart.input.city}`,
      `लग्न: ${lp.signName} | नक्षत्र: ${report.nakshatraProfile.name} चरण ${report.nakshatraProfile.pada} | दिनांक: ${formatDateDmy(report.dashaForecast.targetDate)}`,
      ``,
      ...(pf
        ? [
            `=== 0A. पूर्व जन्म विश्लेषण व भविष्य गति (D60 / D12 / D20 / D9 कारकांश / राहु-केतु) ===`,
            `पूर्व जन्म: ${pf.pastLife.headlineHi} (${pf.pastLife.shashtiamsaDeityHi})`,
            pf.pastLife.previousRoleAndStationHi,
            pf.pastLife.purvaPunyaCarriedHi,
            pf.pastLife.unfinishedKarmaAndDebtsHi,
            pf.pastLife.ancestralD12ConnectionHi,
            `भविष्य रूप (इस जीवन में क्या बनेंगे): ${pf.futureBecoming.thisLifeMaturityHi}`,
            `आगामी जन्म/गति: ${pf.futureBecoming.nextBirthLokaHi} — ${pf.futureBecoming.futureIncarnationProfileHi}`,
            ``,
          ]
        : []),
      `=== 0. पाया, गंडमूल, इष्टदेव व प्रमुख स्वामी ===`,
      `जन्म पाया: ${leg.payaAndGandmool.payaNameHi} — ${leg.payaAndGandmool.payaMeaningHi}`,
      `गंडमूल जांच: ${leg.payaAndGandmool.gandmoolReadingHi}`,
      `इष्टदेव: ${leg.deityAndMainPlanet.ishtaDevataHi} (${leg.deityAndMainPlanet.ishtaMantra})`,
      `प्रमुख स्वामी ग्रह: ${leg.deityAndMainPlanet.mainPlanetHi}`,
      ``,
      `=== 0B. दुर्घटना, आयु-बल (अल्पायु जांच) व 0–120 वर्ष घटनाक्रम ===`,
      `दुर्घटना/चोट जोखिम (${leg.accidentProfile.riskLevelHi}): ${leg.accidentProfile.riskTypesHi}`,
      `सावधानी समय: ${leg.accidentProfile.cautionWindowsHi}`,
      `आयु परीक्षण: ${leg.longevity.categoryHi} — ${leg.longevity.summaryHi}`,
      ...leg.timelineEvents.map((e) => `- ${e.ageRange} (${e.yearRange}): ${e.titleHi} — ${e.detailHi}`),
      ``,
      `--- संपूर्ण 120 वर्षीय विंशोत्तरी जीवन घटनाक्रम (आयु 0–120) ---`,
      ...leg.timeline120Years.map(
        (ev) => `- ${ev.ageRange} (${ev.yearRange}) [${ev.mahadashaLord}/${ev.antardashaLord}]: ${ev.titleHi} — ${ev.detailHi}`
      ),
      ``,
      `=== 0C. माता-पिता, भाई-बहन, विवाह (समय/दिशा/अफेयर/संख्या), संतान व करियर-धन ===`,
      ...leg.qaLedger.flatMap((q) => [
        `• ${q.titleHi}: ${q.answerHi}`,
        `  + ${q.positiveHi}`,
        `  - ${q.negativeHi}`,
      ]),
      ``,
      `=== 1. युति फल (2 से 7 ग्रहों की युतियाँ) ===`,
      `${report.yutiReport.summaryHi}`,
      ...report.yutiReport.groups.map(
        (g) => `- ${g.headlineHi}: ${g.positiveHi} | सावधानी: ${g.negativeHi} | घटना: ${g.incidentRiskHi}`
      ),
      ``,
      `=== 2. राशियों, नक्षत्रों व भावों में ग्रह फल ===`,
      ...report.planetInSigns.map(
        (s) => `- ${trPlanet(s.planet, 'hi')} [${trSign(s.signIndex, 'hi')} ${s.degreeDms}]: ${s.readingHi}`
      ),
      ...report.planetInNakshatras.map(
        (n) => `- ${trPlanet(n.planet, 'hi')} [${n.nakshatraNameHi} च.${n.pada}]: ${n.readingHi}`
      ),
      ...report.planetPlacements.map((p) => `- ${p.headline}: ${p.classicalReading}`),
      ``,
      `=== 3. द्वादश भाव, भावेश (144), भावात् भावम्, भृगु नंदी नाड़ी, दृष्टि व अंश फल ===`,
      `${report.bhavatBhavamReport.summaryHi}`,
      `${report.drishtiReport.summaryHi}`,
      `भृगु नंदी नाड़ी (शनि कर्म): ${report.bhriguNandiNadi.karmaCareerHi}`,
      `BNN विवाह: ${report.bhriguNandiNadi.marriageNadiHi}`,
      ...report.houseLordships.map((h) => `- ${h.headline}: ${h.reading}`),
      ...report.houseWisePredictions.map(
        (h) => `- ${h.titleHi} [${h.score}/100]: ${h.synthesisHi}`
      ),
      ...report.degreePredictions.map(
        (d) => `- ${trPlanet(d.planet, 'hi')} (${d.dms}, ${d.avasthaHi} ${d.strengthPercent}%): ${d.readingHi}`
      ),
      ``,
      `=== 4. दशा, गोचर, वर्ग कुंडली व अंक ज्योतिष ===`,
      `सक्रिय दशा: ${report.dashaForecast.summary}`,
      `अंक ज्योतिष: मूलांक=${num.mulank}, भाग्यांक=${num.bhagyank}, कुआ=${num.kuaNumber}`,
      ...report.kundaliDoshas.doshas.map(
        (d) => `- ${d.name} [${trBadge(d.status, 'hi')}]: ${d.trigger}`
      ),
    ].join('\n');
  }

  return [
    `JYOTISH HORA — COMPLETE PREDICTIONS (YUTI, EVENTS/ACCIDENTS, LIFE Q&A, DEGREE, DASHA & NUMEROLOGY)`,
    `Native: ${chart.input.name} | Birth: ${formatDateDmy(chart.input.date)} ${chart.input.time} | Place: ${chart.input.city}`,
    `Lagna: ${lp.signName} | Birth Nakshatra: ${report.nakshatraProfile.name} Pada ${report.nakshatraProfile.pada}`,
    ``,
    `=== 0. PAYA, GANDMOOL, ISHTA DEVATA & MAIN GOVERNING PLANET ===`,
    `Birth Paya: ${leg.payaAndGandmool.payaNameEn} — ${leg.payaAndGandmool.payaMeaningEn}`,
    `Gandmool Check: ${leg.payaAndGandmool.gandmoolReadingEn}`,
    `Main Deity (Ishta Devata): ${leg.deityAndMainPlanet.ishtaDevataEn}`,
    `Main Planet: ${leg.deityAndMainPlanet.mainPlanetEn}`,
    ``,
    `=== 0B. ACCIDENTS, LONGEVITY (ALPAYU CHECK) & 0–120 YEAR EVENTS ===`,
    ...(pf
      ? [
          `PAST LIFE (D60/D12/D20/Ketu): ${pf.pastLife.headlineEn} — ${pf.pastLife.previousRoleAndStationEn}`,
          `FUTURE BECOMING: ${pf.futureBecoming.thisLifeMaturityEn} | Next Gati: ${pf.futureBecoming.nextBirthLokaEn}`,
          ``,
        ]
      : []),
    `Accident Risk (${leg.accidentProfile.riskLevelEn}): ${leg.accidentProfile.riskTypesEn}`,
    `Caution Dashas: ${leg.accidentProfile.cautionWindowsEn}`,
    `Longevity: ${leg.longevity.categoryEn} — ${leg.longevity.summaryEn}`,
    ...leg.timelineEvents.map((e) => `- ${e.ageRange} (${e.yearRange}): ${e.titleEn} — ${e.detailEn}`),
    `--- FULL 0–120 YEAR LIFE EVENTS CHRONICLE ---`,
    ...leg.timeline120Years.map(
      (ev) => `- ${ev.ageRange} (${ev.yearRange}) [${ev.mahadashaLord}/${ev.antardashaLord}]: ${ev.titleEn} — ${ev.detailEn}`
    ),
    ``,
    `=== 0C. LIFE Q&A LEDGER (PARENTS, SIBLINGS, MARRIAGE, AFFAIRS, CHILDREN, JOB/BIZ, WEALTH) ===`,
    ...leg.qaLedger.flatMap((q) => [
      `• ${q.titleEn}: ${q.answerEn}`,
      `  + ${q.positiveEn}`,
      `  - ${q.negativeEn}`,
    ]),
    ``,
    `=== 1. YUTI-WISE PREDICTIONS (2 TO 7 PLANET CONJUNCTIONS) ===`,
    `${report.yutiReport.summaryEn}`,
    ...report.yutiReport.groups.map(
      (g) => `- ${g.headlineEn}: ${g.positiveEn} | Risk: ${g.negativeEn} | Events: ${g.incidentRiskEn}`
    ),
    ``,
    `=== 2. PLANETS IN SIGNS, NAKSHATRAS & HOUSES ===`,
    ...report.planetInSigns.map(
      (s) => `- ${s.planet} in ${s.signNameEn} (${s.degreeDms}): ${s.readingEn}`
    ),
    ...report.planetInNakshatras.map(
      (n) => `- ${n.planet} in ${n.nakshatraNameEn} P${n.pada}: ${n.readingEn}`
    ),
    ...report.planetPlacements.map(
      (p) => `- ${p.planet} in H${p.house} (${p.signName}): ${p.classicalReading}`
    ),
    ``,
    `=== 3. HOUSE LORDS (144), BHAVAT BHAVAM, BHRIGU NANDI NADI, DRISHTI & DEGREE ===`,
    `${report.bhavatBhavamReport.summaryEn}`,
    `${report.drishtiReport.summaryEn}`,
    `BNN Saturn Career: ${report.bhriguNandiNadi.karmaCareerEn}`,
    `BNN Marriage: ${report.bhriguNandiNadi.marriageNadiEn}`,
    ...report.houseLordships.map((h) => `- ${h.headline}: ${h.reading}`),
    ...report.houseWisePredictions.map(
      (h) => `- ${h.titleEn} [${h.score}/100]: ${h.synthesisEn}`
    ),
    ...report.degreePredictions.map(
      (d) => `- ${d.planet} (${d.dms} ${d.signNameEn}, ${d.avasthaEn} ${d.strengthPercent}%): ${d.readingEn}`
    ),
    ``,
    `=== 4. DASHA, GOCHAR, VARGAS & NUMEROLOGY ===`,
    `Active Dasha: ${report.dashaForecast.summary}`,
    `Numerology: Mulank=${num.mulank}, Bhagyank=${num.bhagyank}, Kua=${num.kuaNumber}`,
    ...(report.advancedTechniques
      ? [
          ``,
          `=== 5. ADVANCED PREDICTIVE SYNTHESIS (MEP=${report.advancedTechniques.mepDms}) ===`,
          `Career Empirical Track: ${report.advancedTechniques.careerAudit.verdictEn}`,
          `Rules Evaluated: ${report.advancedTechniques.totalRulesEvaluated} (${report.advancedTechniques.totalRulesTriggered} top triggers)`,
          ...report.advancedTechniques.triggeredRules
            .slice(0, 12)
            .map((r) => `- [${r.code}] ${r.titleEn}: ${r.verdictEn}`),
        ]
      : []),
  ].join('\n');
}

export const PredictionsView: React.FC<PredictionsViewProps> = ({
  chart,
  chartStyle,
  requestedRoute,
  personaMode = 'simple',
}) => {
  const { lang, t } = useLanguage();
  const isHi = lang === 'hi';
  const [targetDate, setTargetDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [subTab, setSubTab] = useState<PredSubTab>('deep_life');
  const [gocharRef, setGocharRef] = useState<'moon' | 'lagna'>('moon');
  const [activePersona, setActivePersona] = useState<'professional' | 'learner' | 'simple'>(personaMode);

  useEffect(() => {
    const id = requestedRoute?.subTab as PredSubTab | undefined;
    if (id) {
      setSubTab(id);
    }
  }, [requestedRoute?.nonce, requestedRoute?.subTab]);

  const rawReport = useMemo(
    () => generatePredictionReport(chart, targetDate),
    [chart, targetDate]
  );
  const report = useMemo(
    () => (lang === 'hi' ? localizePredictionReportHi(rawReport, chart) : rawReport),
    [rawReport, lang, chart]
  );

  const handleExportTxt = () => {
    const content = formatReportText(chart, report, lang);
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${chart.input.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-full-predictions.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const predictionOptions: Array<{ id: PredSubTab; labelEn: string; labelHi: string }> = [
    { id: 'deep_life', labelEn: '🌟 In-Depth Comprehensive Life Predictions (All Domains)', labelHi: '🌟 विस्तृत समग्र जीवन फलादेश (करियर, धन, विवाह, स्वास्थ्य)' },
    { id: 'classicalYogas', labelEn: '📜 300+ Classical Yogas (Parashara, Saravali, BV Raman)', labelHi: '📜 300+ वैदिक राजयोग व फल (पाराशरी, सारावली)' },
    { id: 'eventsLedger', labelEn: '⏳ 120-Year Complete Life Events Timeline & Milestones', labelHi: '⏳ 120-वर्षीय विंशोत्तरी जीवन घटनाक्रम व दुर्घटना जांच' },
    { id: 'houseWise', labelEn: '🏛 12 Bhavas Comprehensive Analysis (1st to 12th House)', labelHi: '🏛 द्वादश भाव विस्तृत फलादेश (तनु से मोक्ष तक)' },
    { id: 'bhriguNadi', labelEn: '✨ Bhrigu Nandi Nadi & BSP (29 Classical Age Rules)', labelHi: '✨ भृगु नंदी नाड़ी व BSP (29 नियम, शनि कर्म, राहु-केतु अक्ष)' },
    { id: 'yuti', labelEn: '⚡ Planetary Conjunctions (2-7 Grahas) & Mutual Drishti', labelHi: '⚡ ग्रह युति फल (2 से 7 ग्रह) व दृष्टि संबंध' },
    { id: 'pastFuture', labelEn: '🔄 Past Life Karma (D60/D12/D20) & Future Incarnation', labelHi: '🔄 पूर्व जन्म (D60 षष्ट्यंश) व आगामी जन्म गति' },
    { id: 'advancedTechniques', labelEn: '🎯 1000+ Empirical Rules & Systems Approach MEP', labelHi: '🎯 1000+ उन्नत नियम व सिस्टम MEP' },
    { id: 'bhavesha144', labelEn: '🔢 144 Bhavesha Placement Matrix', labelHi: '🔢 144 भावेश स्थिति तालिका' },
    { id: 'bhavatBhavam', labelEn: '🔍 Bhavat Bhavam & Mutual Planetary Aspects', labelHi: '🔍 भावात् भावम् व दृष्टि फल' },
    { id: 'degreeWise', labelEn: '📐 Degree-Wise Ansha & Avastha Report', labelHi: '📐 अंश बल व अवस्था फल' },
    { id: 'planetInSign', labelEn: '🪐 Planets in Signs (Rashi Phala)', labelHi: '🪐 राशियों में ग्रह फल' },
    { id: 'planetInNakshatra', labelEn: '⭐ Planets in Nakshatras & Padas', labelHi: '⭐ नक्षत्रों व चरणों में ग्रह फल' },
    { id: 'planetInHouse', labelEn: '🏠 Planets in Houses (Bhava Phala)', labelHi: '🏠 भावों में ग्रह फल' },
    { id: 'dashaWise', labelEn: '📊 Active Dasha Period Forecast', labelHi: '📊 सक्रिय दशा फलादेश' },
    { id: 'gocharWise', labelEn: '🌌 Current Planetary Transit Analysis', labelHi: '🌌 वर्तमान गोचर फलादेश' },
    { id: 'branchesNumerology', labelEn: '🌿 KP 4-Step, Lal Kitab, Numerology & Remedies', labelHi: '🌿 KP 4-स्टेप, लाल किताब, अंक ज्योतिष व उपाय' },
  ];

  return (
    <div className="view-stack">
      {/* Top Dropdown Control Toolbar for Predictions */}
      <div className="card" style={{ padding: '12px 16px', background: 'var(--bg-elevated)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          {/* Main Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1 1 320px', minWidth: '260px' }}>
            <span style={{ fontWeight: 700, fontSize: '13.5px', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={16} style={{ color: 'var(--accent)' }} />
              <span>{isHi ? 'फलादेश विषय चुनें:' : 'Select Prediction System:'}</span>
            </span>
            <select
              aria-label="Select Prediction System"
              className="select-compact"
              value={subTab}
              onChange={(e) => setSubTab(e.target.value as PredSubTab)}
              style={{ flex: 1, fontWeight: 600, borderColor: 'var(--accent)', minHeight: '38px', fontSize: '13px' }}
            >
              {predictionOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {isHi ? opt.labelHi : opt.labelEn}
                </option>
              ))}
            </select>
          </div>

          {/* Right Toolbar: Persona Mode, Date & Export */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {/* Persona Switcher */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <GraduationCap size={15} className="muted" />
              <select
                aria-label="Persona Mode"
                className="select-compact"
                value={activePersona}
                onChange={(e) => setActivePersona(e.target.value as any)}
                style={{ fontWeight: 600, minHeight: '36px', fontSize: '12.5px' }}
              >
                <option value="simple">{isHi ? '👤 सामान्य जातक (Simple)' : '👤 Non-Astrologer (Simple)'}</option>
                <option value="learner">{isHi ? '📖 विद्यार्थी (Learner)' : '📖 Student / Learner'}</option>
                <option value="professional">{isHi ? '🎓 ज्योतिषी (Professional)' : '🎓 Professional Astrologer'}</option>
              </select>
            </div>

            {/* Forecast Date */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={15} className="muted" />
              <DateDmyInput
                compact
                className="select-compact mono"
                value={targetDate}
                ariaLabel={t.common.forecastDate}
                onChange={setTargetDate}
              />
            </div>

            {/* Export Report */}
            <button type="button" className="btn btn-secondary btn-sm" onClick={handleExportTxt} style={{ minHeight: '36px' }}>
              <Download size={13} />
              <span>{t.common.exportReport}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Paramayus Check or Content */}
      {report.paramayus.exceeded ? (
        <ParamayusLockBanner status={report.paramayus} />
      ) : (
        <PredictionsPatrikaFrame chart={chart} report={report}>
          {subTab === 'deep_life' && (
            <DeepLifePredictionsPanel chart={chart} personaMode={activePersona} />
          )}
          {subTab === 'eventsLedger' && <LifeEventsLedgerPanel ledger={report.lifeEventsLedger} />}
          {subTab === 'classicalYogas' && (
            <ClassicalYogasPanel chart={chart} detectedYogas={report.classicalYogas} />
          )}
          {subTab === 'pastFuture' && report.pastFutureLife && (
            <PastLifeFuturePanel report={report.pastFutureLife} />
          )}
          {subTab === 'advancedTechniques' && report.advancedTechniques && (
            <AdvancedTechniquesPanel report={report.advancedTechniques} />
          )}
          {subTab === 'bhriguNadi' && <BhriguNadiPanel report={report.bhriguNandiNadi} />}
          {subTab === 'bhavesha144' && <Bhavesha144Panel houseLordships={report.houseLordships} />}
          {subTab === 'yuti' && <YutiPanel report={report.yutiReport} />}
          {subTab === 'bhavatBhavam' && (
            <BhavatBhavamPanel report={report.bhavatBhavamReport} chart={chart} />
          )}
          {subTab === 'drishtiWise' && <DrishtiWisePanel report={report.drishtiReport} />}
          {subTab === 'planetInSign' && <PlanetInSignPanel items={report.planetInSigns} />}
          {subTab === 'planetInNakshatra' && (
            <PlanetInNakshatraPanel items={report.planetInNakshatras} />
          )}
          {subTab === 'planetInHouse' && <PlanetInHousePanel report={report} />}
          {subTab === 'houseWise' && (
            <HouseWisePanel houses={report.houseWisePredictions} report={report} />
          )}
          {subTab === 'degreeWise' && <DegreeWisePanel items={report.degreePredictions} />}
          {subTab === 'dashaWise' && <DashaWisePanel chart={chart} report={report} />}
          {subTab === 'gocharWise' && (
            <GocharWisePanel
              chart={chart}
              chartStyle={chartStyle}
              report={report}
              gocharRef={gocharRef}
              setGocharRef={setGocharRef}
            />
          )}
          {subTab === 'divisional' && (
            <DivisionalPredictionsPanel chart={chart} chartStyle={chartStyle} report={report} />
          )}
          {subTab === 'branchesNumerology' && (
            <BranchesAndNumerologyPanel
              chart={chart}
              chartStyle={chartStyle}
              report={report}
              requestedMode={
                requestedRoute
                  ? { id: requestedRoute.nested, nonce: requestedRoute.nonce }
                  : undefined
              }
            />
          )}
        </PredictionsPatrikaFrame>
      )}
    </div>
  );
};
