import React, { useEffect, useMemo, useState } from 'react';
import {
  Calendar,
  Sparkles,
} from 'lucide-react';
import { generatePredictionReport } from '../astro/predictions/engine';
import { formatDateDmy } from '../astro/time';
import type { ChartData, ChartStyle } from '../astro/types';
import { localizePredictionReportHi } from '../i18n/hindiPredictions';
import { useLanguage } from '../i18n/LanguageContext';
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

export const PredictionsView: React.FC<PredictionsViewProps> = ({
  chart,
  chartStyle,
  requestedRoute,
}) => {
  const { lang, t } = useLanguage();
  const isHi = lang === 'hi';
  const [targetDate, setTargetDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [subTab, setSubTab] = useState<PredSubTab>('deep_life');
  const [gocharRef, setGocharRef] = useState<'moon' | 'lagna'>('moon');

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

  // Clean Prediction Systems (Zero Author Names)
  const predictionOptions: Array<{ id: PredSubTab; labelEn: string; labelHi: string }> = [
    { id: 'deep_life', labelEn: '🌟 In-Depth Comprehensive Life Predictions (All Spheres)', labelHi: '🌟 विस्तृत समग्र जीवन फलादेश (व्यक्तित्व, धन, करियर, विवाह)' },
    { id: 'classicalYogas', labelEn: '📜 300+ Classical Vedic Yogas (Active & Corpus)', labelHi: '📜 300+ वैदिक राजयोग व फल (कुंडली सक्रिय योग)' },
    { id: 'eventsLedger', labelEn: '⏳ 120-Year Complete Life Events Timeline & Milestones', labelHi: '⏳ 120-वर्षीय विंशोत्तरी जीवन घटनाक्रम व दुर्घटना जांच' },
    { id: 'houseWise', labelEn: '🏛 12 Bhavas Comprehensive Analysis (1st to 12th House)', labelHi: '🏛 द्वादश भाव विस्तृत फलादेश (तनु से मोक्ष तक)' },
    { id: 'bhriguNadi', labelEn: '✨ Bhrigu Nandi Nadi & BSP (29 Classical Age Rules)', labelHi: '✨ भृगु नंदी नाड़ी व BSP (29 नियम, कर्म फल, राहु-केतु अक्ष)' },
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
      {/* Top Dropdown Control Toolbar for Predictions (No Export .txt, No Persona) */}
      <div className="card" style={{ padding: '12px 16px', background: 'var(--bg-elevated)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          {/* Main Prediction Selector Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1 1 340px', minWidth: '260px' }}>
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

          {/* Forecast Date Picker */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={15} className="muted" />
            <span className="muted small-text">{t.common.forecastDate}:</span>
            <DateDmyInput
              compact
              className="select-compact mono"
              value={targetDate}
              ariaLabel={t.common.forecastDate}
              onChange={setTargetDate}
            />
          </div>
        </div>
      </div>

      {/* Paramayus Check or Content */}
      {report.paramayus.exceeded ? (
        <ParamayusLockBanner status={report.paramayus} />
      ) : (
        <PredictionsPatrikaFrame chart={chart} report={report}>
          {subTab === 'deep_life' && (
            <DeepLifePredictionsPanel chart={chart} />
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
