import type { JaiminiReport, LalKitabReport } from '../jaiminiLalKitab';
import type { KpReport } from '../kp';
import type { DivisionalChartId, NineGrahaId, SevenPlanetId } from '../types';
import type { VarshaphalaReport } from '../varshaphala';
import type { FamilyChildhoodReport, KundaliDoshaReport } from './familyDoshas';
import type { DeepGocharReport } from './gocharDeep';
import type { DegreePredictionItem } from './degreeWise';
import type { HouseWisePrediction } from './houseWise';
import type { PlanetInNakshatraPrediction } from './planetInNakshatra';
import type { PlanetInSignPrediction } from './planetInSign';
import type { LifeEventsAndLedgerReport } from './lifeEventsLedger';
import type { AdvancedPredictiveReport } from './advancedTechniques';
import type { BhavatBhavamReport } from './bhavatBhavam';
import type { BhriguNandiNadiReport } from './bhriguNandiNadi';
import type { DrishtiReport } from './drishtiPredictions';
import type { ParamayusStatus } from './paramayus';
import type { PastFutureLifeReport } from './pastFutureLife';
import type { YutiReport } from './yutiPredictions';

export interface DivisionalPredictionItem {
  vargaId: DivisionalChartId;
  name: string;
  domain: string;
  lagnaSign: string;
  keyLord: string;
  keyLordStatus: string;
  occupantsHighlight: string;
  prediction: string;
}

export interface PredictionSourceRef {
  book: string;
  section?: string;
}

export interface LifeDomainPrediction {
  id:
    | 'personality'
    | 'wealth'
    | 'career'
    | 'marriage'
    | 'education'
    | 'health'
    | 'fortune'
    | 'spirituality';
  title: string;
  sanskritFocus: string;
  rating: number; // 1..100 computed synthesis score
  verdict: 'Highly Auspicious' | 'Favorable' | 'Balanced / Mixed' | 'Requires Effort';
  summary: string;
  details: string[];
  keyFactors: string[];
  sources: string[];
}

export interface PlanetHousePrediction {
  planet: NineGrahaId;
  house: number;
  signName: string;
  dignity: string;
  lordOfHouses: number[];
  headline: string;
  classicalReading: string;
  dignityModifier: string;
  sources: string[];
}

export interface HouseLordPrediction {
  lordHouse: number;
  planet: SevenPlanetId;
  placedHouse: number;
  placedSign: string;
  headline: string;
  reading: string;
  source: string;
}

export interface DashaPrediction {
  targetDate: string;
  mahadashaLord: string;
  antardashaLord: string;
  pratyantardashaLord: string;
  mdHousesRuled: number[];
  adHousesRuled: number[];
  mdPlacedHouse: number;
  adPlacedHouse: number;
  mutualRelation: string;
  favorability: 'Very Favorable' | 'Supportive' | 'Mixed / Transformative' | 'Challenging';
  summary: string;
  mahadashaReading: string;
  antardashaReading: string;
  guidance: string;
  sources: string[];
}

export interface TransitPredictionItem {
  planet: NineGrahaId;
  transitSign: string;
  houseFromMoon: number;
  isClassicalGood: boolean;
  hasVedha: boolean;
  vedhaPlanet?: string;
  savBindus: number;
  verdict: 'Auspicious' | 'Obstructed (Vedha)' | 'Neutral' | 'Testing';
  reading: string;
}

export interface TransitForecast {
  targetDate: string;
  janmaRasi: string;
  sadeSatiStatus: {
    active: boolean;
    phase: string;
    description: string;
  };
  jupiterTransitNote: string;
  items: TransitPredictionItem[];
  sources: string[];
}

export interface RemedyItem {
  planet: NineGrahaId;
  reason: string;
  mantra: string;
  dana: string;
  lifestyle: string;
  gemNote: string;
}

export interface PredictionReport {
  paramayus: ParamayusStatus;
  pastFutureLife: PastFutureLifeReport | null;
  advancedTechniques: AdvancedPredictiveReport | null;
  lagnaProfile: {
    signName: string;
    sanskritName: string;
    ruler: SevenPlanetId;
    functionalBenefics: SevenPlanetId[];
    beneficList: SevenPlanetId[];
    maleficList: SevenPlanetId[];
    neutralList: SevenPlanetId[];
    marakaList: SevenPlanetId[];
    yogakaraka: SevenPlanetId | null;
    temperament: string;
    physicalAppearance: string;
    mentalQualities: string;
    careerIndicators: string;
    luckyColors: string;
    luckyDays: string;
    luckyNumbers: string;
    luckyGem: string;
    strengths: string;
    cautions: string;
    sources: string[];
  };
  nakshatraProfile: {
    name: string;
    pada: number;
    lord: NineGrahaId;
    deity: string;
    coreNature: string;
    vocation: string;
    growthPath: string;
    sources: string[];
  };
  atmakarakaInsight: {
    planet: string;
    signName: string;
    house: number;
    soulTheme: string;
    source: string;
  };
  lifeDomains: LifeDomainPrediction[];
  planetInSigns: PlanetInSignPrediction[];
  planetInNakshatras: PlanetInNakshatraPrediction[];
  planetPlacements: PlanetHousePrediction[];
  houseWisePredictions: HouseWisePrediction[];
  houseLordships: HouseLordPrediction[];
  degreePredictions: DegreePredictionItem[];
  dashaForecast: DashaPrediction;
  transitForecast: TransitForecast;
  deepGochar: DeepGocharReport;
  divisionalPredictions: DivisionalPredictionItem[];
  kpReport: KpReport;
  varshaphala: VarshaphalaReport;
  jaiminiReport: JaiminiReport;
  lalKitabReport: LalKitabReport;
  familyReport: FamilyChildhoodReport;
  kundaliDoshas: KundaliDoshaReport;
  remedies: RemedyItem[];
  yutiReport: YutiReport;
  lifeEventsLedger: LifeEventsAndLedgerReport;
  bhavatBhavamReport: BhavatBhavamReport;
  drishtiReport: DrishtiReport;
  bhriguNandiNadi: BhriguNandiNadiReport;
  classicalYogas?: import('./classicalYogasKb').DetectedClassicalYoga[];
  bhriguSaralPaddhati?: import('./bhriguSaralPaddhati').BhriguSaralPaddhatiReport;
  kpFourStepReport?: import('./kpFourStepEngine').KpFourStepReport;
  lalKitabSystemReport?: import('./lalKitabSystem').LalKitabFullSystemReport;
  bhavarthaRatnakaraReport?: import('./bhavarthaRatnakara').BhavarthaRatnakaraReport;
}
