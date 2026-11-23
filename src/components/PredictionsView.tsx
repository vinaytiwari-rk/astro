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
import { AscendantWisePanel } from './predictions/AscendantWisePanel';
import { GeneralPredictionPanel } from './predictions/GeneralPredictionPanel';
import { EducationAstrologyPanel } from './predictions/EducationAstrologyPanel';
import { ParasharaKalaWorkstationPanel } from './predictions/ParasharaKalaWorkstationPanel';
import { SpecializedVedicPanel } from './predictions/SpecializedVedicPanel';
import { PrasnaMargaWorkstationPanel } from './predictions/PrasnaMargaWorkstationPanel';
import { ParamayusLockBanner } from './ParamayusLockBanner';

interface PredictionsViewProps {
  chart: ChartData;
  chartStyle: ChartStyle;
  activeSubTab?: string;
  onSelectSubTab?: (subTab: string) => void;
  requestedRoute?: { subTab?: string; nested?: string; nonce: number };
}

export type PredSubTab =
  | 'prasnaMargaSuite'
  | 'specializedVedic'
  | 'parasharaKala'
  | 'ascendantWise'
  | 'educationWise'
  | 'twelve_planets'
  | 'active_yogas_yuti'
  | 'yutiWise'
  | 'yogaWise'
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
  if (!id) return 'deep_life';
  if (
    id === 'prasnaMargaSuite' ||
    id === 'prasnaMarga' ||
    id === 'prasna' ||
    id === 'vedastro' ||
    id === 'medical' ||
    id === 'rogaPrasna' ||
    id === 'beeja' ||
    id === 'kshetra' ||
    id === 'badhaka' ||
    id === 'vivahaPrasna' ||
    id === 'spouse' ||
    id === 'sodyaPinda' ||
    id === 'tripataki' ||
    id === 'mundane'
  ) {
    return 'prasnaMargaSuite';
  }
  if (
    id === 'specializedVedic' ||
    id === 'ishta' ||
    id === 'ishtaDevata' ||
    id === 'vakri' ||
    id === 'tarabalam' ||
    id === 'panchaPakshi' ||
    id === 'kujaDosha' ||
    id === 'manglik'
  ) {
    return 'specializedVedic';
  }
  if (
    id === 'parasharaKala' ||
    id === 'parashara' ||
    id === 'softwareSuite' ||
    id === 'software' ||
    id === 'kakshya' ||
    id === 'sahams' ||
    id === 'cil' ||
    id === 'bhavabala'
  ) {
    return 'parasharaKala';
  }
  if (id === 'deep_life' || id === 'general' || id === 'samanya') return 'deep_life';
  if (id === 'dashaWise' || id === 'dasha' || id === 'dashawise') return 'dashaWise';
  if (id === 'gocharWise' || id === 'gochar' || id === 'gocharwise' || id === 'transits') return 'gocharWise';
  if (id === 'houseWise' || id === 'house' || id === 'housewise' || id === 'bhavas_12' || id === 'bhavas') return 'houseWise';
  if (id === 'educationWise' || id === 'education' || id === 'vidya' || id === 'studies') return 'educationWise';
  if (id === 'ascendantWise' || id === 'ascendant' || id === 'lagnaWise' || id === 'lagna' || id === 'twelve_planets' || id === 'planet' || id === 'planets' || id === 'graha') return 'ascendantWise';
  if (id === 'planetInNakshatra' || id === 'nakshatra' || id === 'nakshatras') return 'planetInNakshatra';
  if (id === 'planetInSign' || id === 'planetinsign' || id === 'rasi' || id === 'rashi' || id === 'sign') return 'planetInSign';
  if (id === 'yutiWise' || id === 'yuti' || id === 'conjunction') return 'yutiWise';
  if (id === 'drishtiWise' || id === 'drishti' || id === 'aspect') return 'drishtiWise';
  if (id === 'yogaWise' || id === 'yoga' || id === 'yogas') return 'yogaWise';
  if (
    id === 'active_yogas_yuti' ||
    id === 'classical_yogas' ||
    id === 'classicalYogas' ||
    id === 'yuti_aspects'
  ) {
    return 'active_yogas_yuti';
  }
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
  const [localSubTab, setLocalSubTab] = useState<PredSubTab>('deep_life');

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

  // Pure prediction systems. Calculations and specialized horary modules reside in their dedicated workstations.
  const predictionPills: Array<{ id: PredSubTab; labelEn: string; labelHi: string }> = [
    { id: 'deep_life', labelEn: 'General Prediction', labelHi: 'सामान्य फलादेश' },
    { id: 'houseWise', labelEn: 'House-wise Prediction', labelHi: 'भाववार फलादेश' },
    { id: 'dashaWise', labelEn: 'Dasha Prediction', labelHi: 'दशा फलादेश' },
    { id: 'gocharWise', labelEn: 'Transit Prediction', labelHi: 'गोचर फलादेश' },
    { id: 'educationWise', labelEn: 'Education & Higher Studies', labelHi: 'शिक्षा व उच्च विद्या' },
    { id: 'ascendantWise', labelEn: 'Ascendant-wise Prediction', labelHi: 'लग्नवार फलादेश' },
    { id: 'planetInNakshatra', labelEn: 'Nakshatra-wise Prediction', labelHi: 'नक्षत्रवार फलादेश' },
    { id: 'planetInSign', labelEn: 'Sign-wise Prediction', labelHi: 'राशिवार फलादेश' },
    { id: 'yutiWise', labelEn: 'Yuti (Conjunction) Prediction', labelHi: 'युति फलादेश' },
    { id: 'drishtiWise', labelEn: 'Drishti (Aspect) Prediction', labelHi: 'दृष्टि फलादेश' },
    { id: 'yogaWise', labelEn: 'Yoga-wise Prediction', labelHi: 'योगवार फलादेश' },
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

        {/* Date selection is relevant only to timing-based prediction systems. */}
        {(currentTab === 'dashaWise' || currentTab === 'gocharWise') && (
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
        )}
      </div>

      {/* Direct Content Render (NO PATRIKA BOOK HIJACK! DIRECT PREDICTION DISPLAY) */}
      {report.paramayus.exceeded ? (
        <ParamayusLockBanner status={report.paramayus} />
      ) : (
        <div className="view-stack">
          {(currentTab === 'ascendantWise' || currentTab === 'twelve_planets') && (
            <AscendantWisePanel chart={chart} />
          )}

          {currentTab === 'educationWise' && (
            <EducationAstrologyPanel chart={chart} />
          )}

          {(currentTab === 'active_yogas_yuti' || currentTab === 'yutiWise' || currentTab === 'yogaWise') && (
            <ActiveYogasAndYutiPanel
              key={currentTab}
              chart={chart}
              yutiReport={report.yutiReport}
              detectedYogas={report.classicalYogas}
              initialTab={currentTab === 'yogaWise' ? 'detected' : 'yuti'}
            />
          )}

          {currentTab === 'prasnaMargaSuite' && (
            <PrasnaMargaWorkstationPanel chart={chart} />
          )}

          {currentTab === 'specializedVedic' && (
            <SpecializedVedicPanel chart={chart} />
          )}

          {currentTab === 'deep_life' && (
            <GeneralPredictionPanel chart={chart} />
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

          {currentTab === 'parasharaKala' && (
            <ParasharaKalaWorkstationPanel natalChart={chart} />
          )}
        </div>
      )}
    </div>
  );
};
