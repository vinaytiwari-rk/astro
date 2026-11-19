import React, { useMemo, useState } from 'react';
import type { ChartData } from '../astro/types';
import { generatePredictionReport } from '../astro/predictions/engine';
import { useLanguage } from '../i18n/LanguageContext';
import { DeepLifePredictionsPanel } from './predictions/DeepLifePredictionsPanel';
import { TwelvePlanetsPanel } from './predictions/TwelvePlanetsPanel';
import { HouseWisePanel } from './predictions/HouseAndDegreePanels';
import { ParamayusLockBanner } from './ParamayusLockBanner';
import { DateDmyInput } from './DateDmyInput';

export type SimplePredictionMode = 'general' | 'planets' | 'houses';

interface SimplePredictionsViewProps {
  chart: ChartData;
  mode: SimplePredictionMode;
}

export const SimplePredictionsView: React.FC<SimplePredictionsViewProps> = ({ chart, mode }) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';
  const isGeneral = mode === 'general';
  const isPlanets = mode === 'planets';
  const [targetDate, setTargetDate] = useState(() => new Date().toISOString().slice(0, 10));
  const houseReport = useMemo(() => generatePredictionReport(chart, targetDate), [chart, targetDate]);

  const title = isGeneral
    ? (isHi ? 'सामान्य फलादेश' : 'General Prediction')
    : isPlanets
      ? (isHi ? 'ग्रह-वार फलादेश' : 'Planets-wise Prediction')
      : (isHi ? 'भाव-वार फलादेश' : 'House-wise Prediction');

  const description = isGeneral
    ? (isHi
      ? 'जन्म कुंडली के प्रमुख योग, भाव, भावेश, ग्रहबल और दशा संकेतों का समन्वित जीवन-विश्लेषण।'
      : 'An integrated life reading from the natal chart, combining key planetary and house indications with available strength and dasha context.')
    : isPlanets
      ? (isHi
        ? 'प्रत्येक ग्रह की राशि, भाव, नक्षत्र, गरिमा, वक्री/अस्त स्थिति और संबंधित संकेतों का अलग-अलग विश्लेषण।'
        : 'Separate analysis of each planet using its sign, house, nakshatra, dignity, retrograde/combust state and related indications.')
      : (isHi
        ? 'प्रथम से द्वादश भाव तक प्रत्येक भाव की राशि, भावेश, भावेश की स्थिति, स्थित ग्रह, दृष्टि और सर्वाष्टकवर्ग संकेतों के आधार पर विश्लेषण।'
        : 'A house-by-house reading of all twelve houses using sign, house lord, lord placement, occupants, aspects and Sarvashtakavarga indications.');

  return (
    <div className="view-stack">
      <header className="card" style={{ borderLeft: '4px solid var(--accent)' }}>
        <h1 style={{ margin: 0, fontSize: '20px' }}>{title}</h1>
        <p className="muted" style={{ margin: '6px 0 0', fontSize: '13px', lineHeight: 1.5 }}>{description}</p>
      </header>
      {isGeneral && <DeepLifePredictionsPanel chart={chart} />}
      {isPlanets && <TwelvePlanetsPanel chart={chart} />}
      {!isGeneral && !isPlanets && (
        <>
          <div className="card" style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span className="muted small-text">{isHi ? 'फलादेश की संदर्भ तिथि:' : 'Prediction reference date:'}</span>
            <DateDmyInput compact className="select-compact mono" value={targetDate} onChange={setTargetDate} ariaLabel={isHi ? 'फलादेश की तिथि' : 'Prediction date'} />
          </div>
          {houseReport.paramayus.exceeded
            ? <ParamayusLockBanner status={houseReport.paramayus} />
            : <HouseWisePanel houses={houseReport.houseWisePredictions} report={houseReport} />}
        </>
      )}
    </div>
  );
};
