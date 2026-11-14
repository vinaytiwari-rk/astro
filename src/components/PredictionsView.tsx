import React, { useMemo, useState } from 'react';
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
import { PastLifeFuturePanel } from './predictions/PastLifeFuturePanel';
import { ActiveYogasAndYutiPanel } from './predictions/ActiveYogasAndYutiPanel';
import { TwelvePlanetsPanel } from './predictions/TwelvePlanetsPanel';
import { DeepLifePredictionsPanel } from './predictions/DeepLifePredictionsPanel';
import { ParamayusLockBanner } from './ParamayusLockBanner';

interface PredictionsViewProps {
  chart: ChartData;
  chartStyle: ChartStyle;
  activeSubTab?: string;
  onSelectSubTab?: (subTab: string) => void;
  requestedRoute?: { subTab?: string; nested?: string; nonce: number };
}

export type PredSubTab =
  | 'twelve_planets'
  | 'active_yogas_yuti'
  | 'deep_life'
  | 'eventsLedger'
  | 'houseWise'
  | 'bhriguNadi'
  | 'pastFuture'
  | 'branchesNumerology'
  | 'advancedTechniques'
  | 'bhavesha144'
  | 'bhavatBhavam'
  | 'drishtiWise'
  | 'planetInSign'
  | 'planetInNakshatra'
  | 'planetInHouse'
  | 'degreeWise'
  | 'dashaWise'
  | 'gocharWise'
  | 'divisional';

function normalizeSubTab(id?: string): PredSubTab {
  if (!id) return 'twelve_planets';
  if (id === 'twelve_planets') return 'twelve_planets';
  if (
    id === 'active_yogas_yuti' ||
    id === 'classical_yogas' ||
    id === 'classicalYogas' ||
    id === 'yuti' ||
    id === 'yuti_aspects'
  ) {
    return 'active_yogas_yuti';
  }
  if (id === 'deep_life') return 'deep_life';
  if (id === 'eventsLedger' || id === 'timeline_120yr' || id === 'timeline') return 'eventsLedger';
  if (id === 'houseWise' || id === 'bhavas_12' || id === 'bhavas12' || id === 'bhavas') return 'houseWise';
  if (id === 'bhriguNadi' || id === 'bnn_bsp' || id === 'bnn') return 'bhriguNadi';
  if (id === 'pastFuture' || id === 'past_future' || id === 'past_life') return 'pastFuture';
  if (
    id === 'branchesNumerology' ||
    id === 'kp_4step_pred' ||
    id === 'lal_kitab_pred' ||
    id === 'bhavartha_pred' ||
    id === 'kp' ||
    id === 'lalkitab' ||
    id === 'numerology'
  ) {
    return 'branchesNumerology';
  }
  if (id === 'advancedTechniques') return 'advancedTechniques';
  if (id === 'bhavesha144') return 'bhavesha144';
  if (id === 'bhavatBhavam') return 'bhavatBhavam';
  if (id === 'drishtiWise') return 'drishtiWise';
  if (id === 'planetInSign') return 'planetInSign';
  if (id === 'planetInNakshatra') return 'planetInNakshatra';
  if (id === 'planetInHouse') return 'planetInHouse';
  if (id === 'degreeWise') return 'degreeWise';
  if (id === 'dashaWise') return 'dashaWise';
  if (id === 'gocharWise' || id === 'transits') return 'gocharWise';
  if (id === 'divisional') return 'divisional';
  return 'twelve_planets';
}

export const PredictionsView: React.FC<PredictionsViewProps> = ({
  chart,
  chartStyle,
  activeSubTab,
  onSelectSubTab,
  requestedRoute,
}) => {
  const { lang, t } = useLanguage();
  const isHi = lang === 'hi';
  const [targetDate, setTargetDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [gocharRef, setGocharRef] = useState<'moon' | 'lagna'>('moon');

  // Internal fallback state if onSelectSubTab not provided
  const [localSubTab, setLocalSubTab] = useState<PredSubTab>('twelve_planets');

  // Master Resolved Active SubTab (100% in sync with top header)
  const currentTab = useMemo(() => {
    const raw = activeSubTab || requestedRoute?.subTab;
    return raw ? normalizeSubTab(raw) : localSubTab;
  }, [activeSubTab, requestedRoute?.subTab, localSubTab]);

  const handleTabChange = (newTab: PredSubTab) => {
    setLocalSubTab(newTab);
    if (onSelectSubTab) {
      onSelectSubTab(newTab);
    }
  };

  const rawReport = useMemo(
    () => generatePredictionReport(chart, targetDate),
    [chart, targetDate]
  );
  const report = useMemo(
    () => (lang === 'hi' ? localizePredictionReportHi(rawReport, chart) : rawReport),
    [rawReport, lang, chart]
  );

  // Core Prediction Systems (Synchronized Navigation Pills)
  const predictionPills: Array<{ id: PredSubTab; labelEn: string; labelHi: string; icon: string }> = [
    {
      id: 'twelve_planets',
      labelEn: '🌟 12 Planets Event Predictions',
      labelHi: '🌟 द्वादश ग्रह घटना फलादेश',
      icon: '🌟',
    },
    {
      id: 'active_yogas_yuti',
      labelEn: '📜 Active Yogas & Conjunctions',
      labelHi: '📜 सक्रिय राजयोग व ग्रह युति',
      icon: '📜',
    },
    {
      id: 'deep_life',
      labelEn: '🏛️ 6-Domain Life Predictions',
      labelHi: '🏛️ समग्र जीवन फलादेश',
      icon: '🏛️',
    },
    {
      id: 'eventsLedger',
      labelEn: '⏳ 120-Year Timeline',
      labelHi: '⏳ 120-वर्षीय कालचक्र',
      icon: '⏳',
    },
    {
      id: 'houseWise',
      labelEn: '🏠 12 Bhavas Domains',
      labelHi: '🏠 द्वादश भाव फल',
      icon: '🏠',
    },
    {
      id: 'bhriguNadi',
      labelEn: '✨ Bhrigu Nandi Nadi',
      labelHi: '✨ भृगु नंदी नाड़ी व BSP',
      icon: '✨',
    },
    {
      id: 'pastFuture',
      labelEn: '🔄 Past Life Karma D60',
      labelHi: '🔄 पूर्व जन्म D60',
      icon: '🔄',
    },
    {
      id: 'branchesNumerology',
      labelEn: '🌿 KP & Lal Kitab',
      labelHi: '🌿 KP व लाल किताब',
      icon: '🌿',
    },
  ];

  return (
    <div className="view-stack">
      {/* Sleek Subtab Pill Strip & Forecast Date (NO 3RD DROPDOWN! 100% IN SYNC WITH TOP HEADER) */}
      <div
        className="card"
        style={{
          padding: '8px 14px',
          background: 'var(--bg-elevated)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        {/* Horizontal Navigation Pills */}
        <div
          role="tablist"
          aria-label={isHi ? 'फलादेश अनुभाग' : 'Prediction Sections'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            flexWrap: 'wrap',
            flex: '1 1 auto',
          }}
        >
          {predictionPills.map((pill) => {
            const isActive = currentTab === pill.id;
            return (
              <button
                key={pill.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => handleTabChange(pill.id)}
                style={{
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '12.5px',
                  padding: '5px 10px',
                  borderRadius: '6px',
                  whiteSpace: 'nowrap',
                }}
              >
                {isHi ? pill.labelHi : pill.labelEn}
              </button>
            );
          })}
        </div>

        {/* Forecast Date Picker */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
          <Calendar size={14} className="muted" />
          <span className="muted small-text" style={{ whiteSpace: 'nowrap' }}>
            {t.common.forecastDate}:
          </span>
          <DateDmyInput
            compact
            className="select-compact mono"
            value={targetDate}
            ariaLabel={t.common.forecastDate}
            onChange={setTargetDate}
          />
        </div>
      </div>

      {/* Direct Content Render (NO PATRIKA BOOK HIJACK! DIRECT PREDICTION DISPLAY) */}
      {report.paramayus.exceeded ? (
        <ParamayusLockBanner status={report.paramayus} />
      ) : (
        <div className="view-stack">
          {currentTab === 'twelve_planets' && (
            <TwelvePlanetsPanel chart={chart} />
          )}

          {currentTab === 'active_yogas_yuti' && (
            <ActiveYogasAndYutiPanel
              chart={chart}
              yutiReport={report.yutiReport}
              detectedYogas={report.classicalYogas}
            />
          )}

          {currentTab === 'deep_life' && (
            <DeepLifePredictionsPanel chart={chart} />
          )}

          {currentTab === 'eventsLedger' && (
            <LifeEventsLedgerPanel ledger={report.lifeEventsLedger} />
          )}

          {currentTab === 'houseWise' && (
            <HouseWisePanel houses={report.houseWisePredictions} report={report} />
          )}

          {currentTab === 'bhriguNadi' && (
            <BhriguNadiPanel report={report.bhriguNandiNadi} chart={chart} />
          )}

          {currentTab === 'pastFuture' && report.pastFutureLife && (
            <PastLifeFuturePanel report={report.pastFutureLife} />
          )}

          {currentTab === 'branchesNumerology' && (
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

          {currentTab === 'advancedTechniques' && report.advancedTechniques && (
            <AdvancedTechniquesPanel report={report.advancedTechniques} />
          )}

          {currentTab === 'bhavesha144' && (
            <Bhavesha144Panel houseLordships={report.houseLordships} />
          )}

          {currentTab === 'bhavatBhavam' && (
            <BhavatBhavamPanel report={report.bhavatBhavamReport} chart={chart} />
          )}

          {currentTab === 'drishtiWise' && (
            <DrishtiWisePanel report={report.drishtiReport} />
          )}

          {currentTab === 'planetInSign' && (
            <PlanetInSignPanel items={report.planetInSigns} />
          )}

          {currentTab === 'planetInNakshatra' && (
            <PlanetInNakshatraPanel items={report.planetInNakshatras} />
          )}

          {currentTab === 'planetInHouse' && (
            <PlanetInHousePanel report={report} />
          )}

          {currentTab === 'degreeWise' && (
            <DegreeWisePanel items={report.degreePredictions} />
          )}

          {currentTab === 'dashaWise' && (
            <DashaWisePanel chart={chart} report={report} />
          )}

          {currentTab === 'gocharWise' && (
            <GocharWisePanel
              chart={chart}
              chartStyle={chartStyle}
              report={report}
              gocharRef={gocharRef}
              setGocharRef={setGocharRef}
            />
          )}

          {currentTab === 'divisional' && (
            <DivisionalPredictionsPanel chart={chart} chartStyle={chartStyle} report={report} />
          )}
        </div>
      )}
    </div>
  );
};
