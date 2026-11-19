import React from 'react';
import type { ChartData } from '../astro/types';
import { useLanguage } from '../i18n/LanguageContext';
import { DeepLifePredictionsPanel } from './predictions/DeepLifePredictionsPanel';
import { TwelvePlanetsPanel } from './predictions/TwelvePlanetsPanel';

export type SimplePredictionMode = 'general' | 'planets';

interface SimplePredictionsViewProps {
  chart: ChartData;
  mode: SimplePredictionMode;
}

export const SimplePredictionsView: React.FC<SimplePredictionsViewProps> = ({ chart, mode }) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';
  const isGeneral = mode === 'general';

  return (
    <div className="view-stack">
      <header className="card" style={{ borderLeft: '4px solid var(--accent)' }}>
        <h1 style={{ margin: 0, fontSize: '20px' }}>
          {isGeneral
            ? (isHi ? 'सामान्य फलादेश' : 'General Prediction')
            : (isHi ? 'ग्रह-वार फलादेश' : 'Planets-wise Prediction')}
        </h1>
        <p className="muted" style={{ margin: '6px 0 0', fontSize: '13px', lineHeight: 1.5 }}>
          {isGeneral
            ? (isHi
              ? 'जन्म कुंडली के प्रमुख योग, भाव, भावेश, ग्रहबल और दशा संकेतों का समन्वित जीवन-विश्लेषण।'
              : 'An integrated life reading from the natal chart, combining key planetary and house indications with available strength and dasha context.')
            : (isHi
              ? 'प्रत्येक ग्रह की राशि, भाव, नक्षत्र, गरिमा, वक्री/अस्त स्थिति और संबंधित संकेतों का अलग-अलग विश्लेषण।'
              : 'Separate analysis of each planet using its sign, house, nakshatra, dignity, retrograde/combust state and related indications.')}
        </p>
      </header>
      {isGeneral ? <DeepLifePredictionsPanel chart={chart} /> : <TwelvePlanetsPanel chart={chart} />}
    </div>
  );
};
