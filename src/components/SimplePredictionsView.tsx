import React, { useMemo } from 'react';
import type { ChartData } from '../astro/types';
import { computeHouseWisePredictions } from '../astro/predictions/houseWise';
import { useLanguage } from '../i18n/LanguageContext';
import { DeepLifePredictionsPanel } from './predictions/DeepLifePredictionsPanel';
import { TwelvePlanetsPanel } from './predictions/TwelvePlanetsPanel';
import { HouseWisePanel } from './predictions/HouseAndDegreePanels';

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
  const housePredictions = useMemo(() => computeHouseWisePredictions(chart), [chart]);

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
        ? 'प्रथम से द्वादश भाव तक राशि, भावेश, स्थित ग्रह, दृष्टि और सर्वाष्टकवर्ग का जन्मकुंडली-आधारित विश्लेषण। इसमें दशा या गोचर के आधार पर समय-निर्धारण शामिल नहीं है।'
        : 'A natal-chart reading of all twelve houses using sign, house lord, lord placement, occupants, aspects and Sarvashtakavarga. Dasha- or transit-based timing is not included in this view.');

  return (
    <div className="view-stack">
      <header className="card" style={{ borderLeft: '4px solid var(--accent)' }}>
        <h1 style={{ margin: 0, fontSize: '20px' }}>{title}</h1>
        <p className="muted" style={{ margin: '6px 0 0', fontSize: '13px', lineHeight: 1.5 }}>{description}</p>
      </header>
      {isGeneral && <DeepLifePredictionsPanel chart={chart} />}
      {isPlanets && <TwelvePlanetsPanel chart={chart} />}
      {!isGeneral && !isPlanets && (
        <HouseWisePanel houses={housePredictions} simple />
      )}
    </div>
  );
};
