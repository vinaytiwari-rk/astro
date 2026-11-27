import {
  CLASSICAL_VARA_PROFILES,
  CLASSICAL_TITHI_PROFILES,
  CLASSICAL_PRITHU_YASAS_NAVAMSHA,
  CLASSICAL_LUNAR_MAAS_PROFILES,
  CLASSICAL_RITU_PROFILES,
  CLASSICAL_AYANA_PROFILES,
  CLASSICAL_KAAL_PROFILES,
  CLASSICAL_NITYA_YOGAS,
  CLASSICAL_KARANAS,
  CLASSICAL_NAKSHATRAS,
  CLASSICAL_GREGORIAN_MONTHS,
  CLASSICAL_PAYA_PROFILES,
  CLASSICAL_ATMAKARAKA_PROFILES,
  CLASSICAL_GANA_PROFILES,
  CLASSICAL_NADI_PROFILES,
  CLASSICAL_VARNA_PROFILES,
  CLASSICAL_YONI_PROFILES,
  CLASSICAL_BIRTH_TATWA_PROFILES,
  getTithiVaraYoga,
  getHoraReading,
  getPadaDetail,
  getAtmakarakaProfile,
  getPayaProfile,
  getGanaProfile,
  getNadiProfile,
  getVarnaProfile,
  getYoniProfile,
  calculateBirthTimeTatwa,
  type NavamshaLagnaProfile,
  type TithiProfile,
  type PayaProfile,
  type NakshatraPadaDetail,
  type AtmakarakaProfile,
  type GanaProfile,
  type NadiProfile,
  type VarnaProfile,
  type YoniProfile,
  type BirthTatwaCalculationResult,
} from './classicalPanchangaNavamshaKb';
import type { ChartData, DivisionalChartId, NineGrahaId, SevenPlanetId } from '../types';
import { NAKSHATRAS, SIGNS } from '../constants';
import { computeCharaKarakas } from '../jaimini';
import { getFunctionalLordship } from './functionalLordship';
import { detectClassicalYogas, type DetectedClassicalYoga } from './classicalYogasKb';
import { computeDinaMrityuAndRoga, type DinaMrityuRogaResult } from './dinaMrityuRoga';
import { computeTwelveBhavaAndParivartanaYogas, type TwelveBhavaAndParivartanaReport } from './twelveBhavaYogas';
import { computeBadhakaAndFunctionalDoshas, type BadhakaAndFunctionalDoshaReport } from './badhakaAndKendradhipatya';
import {
  computeComprehensiveChikitsaReport,
  type ComprehensiveChikitsaReport,
  type SpecificDiseaseAlert,
  type ProgenyDiagnosticReport,
  type VulnerableOrganSystem,
} from './medicalAstrologyEngine';
import {
  computeComprehensiveMarriageReport,
  type ComprehensiveMarriageReport,
  type MarriageNature,
  type StreeJatakaDiagnostic,
  type DoubleTransitAndTimingWindow,
  type KootaLongevityAlert,
} from './marriageAstrologyEngine';
export type {
  DinaMrityuRogaResult,
  TwelveBhavaAndParivartanaReport,
  BadhakaAndFunctionalDoshaReport,
  ComprehensiveChikitsaReport,
  SpecificDiseaseAlert,
  ProgenyDiagnosticReport,
  VulnerableOrganSystem,
  ComprehensiveMarriageReport,
  MarriageNature,
  StreeJatakaDiagnostic,
  DoubleTransitAndTimingWindow,
  KootaLongevityAlert,
};
export { computeComprehensiveChikitsaReport, computeComprehensiveMarriageReport };

export interface DeepDomainPrediction {
  id: string; titleEn: string; titleHi: string; icon: string;
  /** Internal evidence-balance index, not a probability or event likelihood. */
  score: number;
  ratingEn: 'Excellent' | 'Very Good' | 'Moderate' | 'Challenging';
  ratingHi: 'अति उत्तम' | 'उत्तम' | 'मध्यम' | 'चुनौतीपूर्ण';
  summaryEn: string; summaryHi: string;
  predictionEn: string; predictionHi: string;
  timingWindowEn?: string;
  timingWindowHi?: string;
  concreteEventsEn?: string[];
  concreteEventsHi?: string[];
  keyStrengthsEn: string[]; keyStrengthsHi: string[];
  watchoutsEn: string[]; watchoutsHi: string[];
  astrologicalFactorsEn: string; astrologicalFactorsHi: string;
  classicalAdviceEn: string; classicalAdviceHi: string;
}

export interface GeneralBirthFactor {
  id: string;
  labelEn: string;
  labelHi: string;
  valueEn: string;
  valueHi: string;
  interpretationEn: string;
  interpretationHi: string;
}
export interface GeneralBirthProfile {
  factors: GeneralBirthFactor[];
  summaryEn: string;
  summaryHi: string;
  payaDetails?: PayaProfile;
  padaDetails?: NakshatraPadaDetail;
  atmakarakaProfile?: AtmakarakaProfile;
  ganaDetails?: GanaProfile;
  nadiDetails?: NadiProfile;
  varnaDetails?: VarnaProfile;
  yoniDetails?: YoniProfile;
  birthTatwaDetails?: BirthTatwaCalculationResult;
  navamshaLagna?: {
    signIndex: number;
    signNameEn: string;
    signNameHi: string;
    readingEn: string;
    readingHi: string;
    vulnerabilityAges: number[];
    isVargottama: boolean;
    sageWarningEn: string;
    sageWarningHi: string;
  };
  tithiDetails?: {
    tithiNumber: number;
    tithiNameEn: string;
    tithiNameHi: string;
    category: 'Nanda' | 'Bhadra' | 'Jaya' | 'Rikta' | 'Poorna';
    categoryHi: string;
    presidingDeityEn: string;
    presidingDeityHi: string;
    governingNityaDeviEn: string;
    governingNityaDeviHi: string;
    nityaDeviMantra: string;
    combinationYoga?: {
      isAuspicious: boolean;
      combinationTitleEn: string;
      combinationTitleHi: string;
      detailsEn: string;
      detailsHi: string;
      alertType?: 'Daghda' | 'Visha' | 'Hutashan';
    };
  };
  seasonalDetails?: {
    ayanaEn: string;
    ayanaHi: string;
    ayanaReadingEn: string;
    ayanaReadingHi: string;
    maasEn: string;
    maasHi: string;
    isAdhika: boolean;
    maasReadingEn: string;
    maasReadingHi: string;
    rituEn: string;
    rituHi: string;
    rituReadingEn: string;
    rituReadingHi: string;
    kaalEn: string;
    kaalHi: string;
    kaalReadingEn: string;
    kaalReadingHi: string;
    horaEn: string;
    horaHi: string;
    horaReadingEn: string;
    horaReadingHi: string;
    gregorianMonthEn: string;
    gregorianMonthHi: string;
    gregorianReadingEn: string;
    gregorianReadingHi: string;
  };
}

export interface PurusharthaTrineScore {
  type: 'Dharma' | 'Artha' | 'Kama' | 'Moksha';
  nameEn: string;
  nameHi: string;
  houses: number[];
  percentage: number;
  score: number;
  occupantPlanets: NineGrahaId[];
  savBindus: number;
  orientationEn: string;
  orientationHi: string;
  guidanceEn: string;
  guidanceHi: string;
  classicalSource: string;
}

export interface PurusharthaReport {
  dominant: 'Dharma' | 'Artha' | 'Kama' | 'Moksha';
  dominantTitleEn: string;
  dominantTitleHi: string;
  soulMissionEn: string;
  soulMissionHi: string;
  trines: PurusharthaTrineScore[];
  balanceSynthesisEn: string;
  balanceSynthesisHi: string;
  classicalReference: string;
}

export interface DeepLifePredictionsReport {
  purusharthas: PurusharthaReport;
  dinaMrityuRoga: DinaMrityuRogaResult;
  twelveBhavaYogas: TwelveBhavaAndParivartanaReport;
  badhakaDosha: BadhakaAndFunctionalDoshaReport;
  chikitsaReport: ComprehensiveChikitsaReport;
  marriageReport: ComprehensiveMarriageReport;
  /** Retained for compatibility; never presented as a statistical score. */
  overallLifeScore: number;
  lifeStatureClassEn?: string;
  lifeStatureClassHi?: string;
  lifeStatureMeaningEn?: string;
  lifeStatureMeaningHi?: string;
  peakRiseAgeWindowEn?: string;
  peakRiseAgeWindowHi?: string;
  crisisErasEn?: string[];
  crisisErasHi?: string[];
  karmicMissionEn?: string;
  karmicMissionHi?: string;
  executiveSummaryEn: string; executiveSummaryHi: string;
  domains: DeepDomainPrediction[];
  birthProfile: GeneralBirthProfile;
  classicalYogas: DetectedClassicalYoga[];
}
type DomainConfig = {
  id: string; titleEn: string; titleHi: string; icon: string;
  houses: number[]; karakas: NineGrahaId[]; varga: DivisionalChartId;
  adviceEn: string; adviceHi: string;
};
const DOMAINS: DomainConfig[] = [
  { id: 'personality', titleEn: 'Personality, Vitality & Temperament', titleHi: 'व्यक्तित्व, शारीरिक बनावट व स्वभाव', icon: 'user', houses: [1, 5, 9], karakas: ['Sun', 'Moon'], varga: 'D9', adviceEn: 'Develop natural self-awareness, leadership confidence and consistent physical routines.', adviceHi: 'आत्मविश्वास, आत्मजागरूकता और नियमित दिनचर्या से अपनी अंतर्निहित क्षमताओं को निरंतर निखारें।' },
  { id: 'education', titleEn: 'Education, Intellect & Field of Study', titleHi: 'शिक्षा, बौद्धिक क्षमता एवं अध्ययन क्षेत्र', icon: 'book', houses: [4, 5, 9], karakas: ['Mercury', 'Jupiter'], varga: 'D24', adviceEn: 'Focus deeply on specialized intellectual mastery, technical competence and structured analytical training.', adviceHi: 'गहन बौद्धिक अध्ययन, तकनीकी दक्षता एवं अनुशासित विश्लेषणात्मक प्रशिक्षण पर ध्यान केंद्रित करें।' },
  { id: 'career', titleEn: 'Career, Profession & Job vs Business', titleHi: 'आजीविका, करियर, नौकरी बनाम व्यवसाय', icon: 'briefcase', houses: [10, 6, 2, 11], karakas: ['Sun', 'Saturn', 'Mercury', 'Jupiter'], varga: 'D10', adviceEn: 'Build commanding executive competence, document professional milestones and foster dependable institutional alliances.', adviceHi: 'कार्यक्षेत्र में रणनीतिक नेतृत्व विकसित करें, उपलब्धियों का सम्मान करें और स्थायी संस्थागत संबंध बनाएं।' },
  { id: 'wealth', titleEn: 'Wealth, Savings & Financial Assets', titleHi: 'आर्थिक स्थिति, धन लाभ व संचित संपत्ति', icon: 'coins', houses: [2, 11, 5, 9], karakas: ['Jupiter', 'Venus', 'Mercury'], varga: 'D2', adviceEn: 'Build generational prosperity through disciplined capital accumulation, diversified investments and prudent asset preservation.', adviceHi: 'अनुशासित बचत, सुविचारित वित्तीय निवेश और अचल संपत्ति के संचय से स्थायी आर्थिक संप्रभुता स्थापित करें।' },
  { id: 'marriage', titleEn: 'Marriage, Spouse & Marital Harmony', titleHi: 'विवाह, दांपत्य जीवन, समय व जीवनसाथी', icon: 'heart', houses: [7, 2, 5, 8], karakas: ['Venus', 'Jupiter'], varga: 'D9', adviceEn: 'Cultivate enduring matrimonial serenity through mutual veneration, transparent dialogue and shared spiritual values.', adviceHi: 'परस्पर आदर, पारदर्शी संवाद और नैतिक जीवन-मूल्यों से दांपत्य जीवन में अखंड माधुर्य व सामंजस्य बनाए रखें।' },
  { id: 'children', titleEn: 'Children, Progeny & Family Lineage', titleHi: 'संतान सुख, पारिवारिक जीवन एवं कुल वृद्धि', icon: 'users', houses: [5, 9, 2], karakas: ['Jupiter'], varga: 'D7', adviceEn: 'Nurture familial bonds with warmth, instill virtuous ethical values and support children’s natural talents.', adviceHi: 'संतान को उच्च नैतिक संस्कार, गुणवत्तापूर्ण शिक्षा और स्नेहपूर्ण पारिवारिक वातावरण प्रदान करें।' },
  { id: 'property', titleEn: 'Property, Real Estate & Vehicles', titleHi: 'मकान, भूमि, वाहन एवं भौतिक सुख-साधन', icon: 'home', houses: [4, 11, 2], karakas: ['Mars', 'Venus', 'Saturn'], varga: 'D4', adviceEn: 'Channel capital into tangible real estate, verify legal documentation diligently and maintain home sanctity.', adviceHi: 'ठोस अचल संपत्ति (भूमि/भवन) व प्रतिष्ठित वाहन में पूंजी निवेश करें तथा गृह-शांति का वातावरण बनाए रखें।' },
  { id: 'health', titleEn: 'Health, Vitality & Disease Prevention', titleHi: 'स्वास्थ्य, शारीरिक संवेदनशीलता एवं रोग निवारण', icon: 'shield', houses: [1, 6, 8, 12], karakas: ['Sun', 'Moon', 'Saturn'], varga: 'D30', adviceEn: 'Preserve physical ojas through circadian rhythm alignment, sattvic nutrition, yogic breathing and preventive screenings.', adviceHi: 'सात्विक आहार, पर्याप्त निद्रा, योग-प्राणायाम और समयानुकूल स्वास्थ्य परीक्षणों से शारीरिक ओज व दीर्घायु सुरक्षित रखें।' },
  { id: 'travels', titleEn: 'Travels, Foreign Settlement & Location of Rise', titleHi: 'यात्राएं, विदेश गमन एवं भाग्योदय स्थल', icon: 'compass', houses: [9, 12, 3, 7], karakas: ['Moon', 'Rahu', 'Venus'], varga: 'D9', adviceEn: 'Embrace geographic mobility, explore global horizons and channel international connections for life elevation.', adviceHi: 'व्यावसायिक व व्यक्तिगत विकास हेतु देशांतर व विदेश यात्राओं के अवसरों का पूर्ण लाभ उठाएं।' },
  { id: 'spirituality', titleEn: 'Dharma, Learning & Spirituality', titleHi: 'धर्म, दर्शन, साधना एवं आत्मिक शांति', icon: 'sparkles', houses: [9, 12, 5, 8], karakas: ['Jupiter', 'Ketu'], varga: 'D20', adviceEn: 'Deepen spiritual evolution through sacred scriptural reflection, righteous karma, selfless charity and meditative stillness.', adviceHi: 'ईश्वरीय साधना, परोपकारी कर्म, सात्विक दान और अंतर्मुखी चिंतन से जीवन में परम आत्मिक शांति प्राप्त करें।' },
  { id: 'milestones', titleEn: 'Golden Milestone Ages of Fortune', titleHi: 'भाग्योदय के स्वर्णिम वर्ष एवं जीवन के प्रमुख पड़ाव', icon: 'award', houses: [1, 9, 10, 11], karakas: ['Sun', 'Jupiter'], varga: 'D1', adviceEn: 'Synchronize major enterprise initiatives with calculated astrological golden milestone windows.', adviceHi: 'अपने जीवन के प्रमुख कार्यों एवं निवेशों को ज्योतिषीय भाग्योदय स्वर्णिम वर्षों के साथ संयोजित करें।' },
  { id: 'remedies', titleEn: 'Authentic Shastric Remedies & Recommendations', titleHi: 'अचूक शास्त्रीय वैदिक समाधान एवं अनुकूल उपाय', icon: 'sparkles', houses: [1, 5, 9], karakas: ['Jupiter', 'Sun'], varga: 'D9', adviceEn: 'Perform prescribed daily Vedic japa, wear tested auspicious gemstones and observe righteous charitable daana.', adviceHi: 'नियमित इष्ट देव मंत्र जप, शास्त्रसम्मत अनुकूल रत्न धारण एवं निर्दिष्ट वार पर दान से समस्त ग्रह-दोषों का शमन करें।' },
];
const CLASSICAL_PLANETS = new Set<string>(['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn']);
const CLASSICAL_GRAHAS = new Set<string>(['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu']);
function functionalLordshipEvidence(chart: ChartData, planetId: string): { en: string; hi: string; adjustment: number } | null {
  if (!CLASSICAL_PLANETS.has(planetId)) return null;
  const lordship = getFunctionalLordship(planetId as SevenPlanetId, chart.ascendant.signIndex);
  const houses = lordship.ownedHouses;
  // Keep the influence deliberately modest: ownership is one layer, never a verdict.
  const adjustment = lordship.yogakarakaProfile
    ? 0.75
    : lordship.kendradhipatiCaution
      ? -0.25
      : lordship.ownsDusthana && !lordship.ownsTrikona
        ? -0.5
        : lordship.ownsTrikona && !lordship.ownsDusthana
          ? 0.5
          : 0;
  return {
    en: planetId + ' owns houses ' + houses.join(', ') + ' (' + lordship.rolesEn.join('; ') + ')',
    hi: planetId + ' भाव ' + houses.join(', ') + ' का स्वामी है (' + lordship.rolesHi.join('; ') + ')',
    adjustment,
  };
}
function dignityPoints(d: string): number {
  if (['Exalted', 'Moolatrikona', 'Own Sign'].includes(d)) return 2;
  if (['Great Friend', 'Friend'].includes(d)) return 1;
  if (['Enemy', 'Great Enemy', 'Debilitated'].includes(d)) return -2;
  return 0;
}
function houseSignIndex(chart: ChartData, house: number): number { return (chart.ascendant.signIndex + house - 1) % 12; }
function planetHouse(chart: ChartData, p: { signIndex: number }): number { return ((p.signIndex - chart.ascendant.signIndex + 12) % 12) + 1; }
function aspectsHouse(chart: ChartData, target: number): string[] {
  const found: string[] = [];
  for (const p of chart.planets) {
    if (!CLASSICAL_GRAHAS.has(String(p.id))) continue;
    const from = planetHouse(chart, p);
    const offsets = p.id === 'Mars' ? [3, 6, 7] : p.id === 'Jupiter' ? [4, 6, 8] : p.id === 'Saturn' ? [2, 6, 9] : [6];
    if (offsets.some((n) => ((from - 1 + n) % 12) + 1 === target)) found.push(String(p.id));
  }
  return [...new Set(found)];
}
const GRAHA_NAMES_HI: Record<string, string> = {
  Sun: 'सूर्य',
  Moon: 'चंद्र',
  Mars: 'मंगल',
  Mercury: 'बुध',
  Jupiter: 'देवगुरु बृहस्पति',
  Venus: 'शुक्र',
  Saturn: 'शनि देव',
  Rahu: 'राहु',
  Ketu: 'केतु',
};

const DIGNITY_NAMES_HI: Record<string, string> = {
  Exalted: 'उच्च',
  Moolatrikona: 'मूलत्रिकोण',
  'Own Sign': 'स्वराशि',
  'Great Friend': 'अति मित्र',
  Friend: 'मित्र',
  Neutral: 'सम',
  Enemy: 'शत्रु',
  'Great Enemy': 'अति शत्रु',
  Debilitated: 'नीच',
};

function getPlanetDesc(chart: ChartData, id: string): { en: string; hi: string } {
  const p = chart.planets.find((x) => x.id === id);
  if (!p) return { en: `${id} (position unavailable)`, hi: `${GRAHA_NAMES_HI[id] ?? id} (स्थिति अनुपलब्ध)` };
  const dHi = DIGNITY_NAMES_HI[p.dignity] ?? p.dignity;
  const sHi = SIGNS[p.signIndex]?.name ?? p.signName;
  return {
    en: `${p.id} in House ${p.rasiHouseNumber} (${p.signName}, ${p.dignity})`,
    hi: `${GRAHA_NAMES_HI[p.id] ?? p.id} भाव ${p.rasiHouseNumber} में (${sHi} राशि, ${dHi})`,
  };
}

function getOrdinalSuffix(n: number): string {
  if (n === 1) return '1st';
  if (n === 2) return '2nd';
  if (n === 3) return '3rd';
  return `${n}th`;
}

function getHouseLordDesc(chart: ChartData, house: number): { lord: string; en: string; hi: string; signNameEn: string; signNameHi: string; rasiHouse: number; dignity: string; sav: number } {
  const signIdx = (chart.ascendant.signIndex + house - 1) % 12;
  const sign = SIGNS[signIdx];
  const lordPlanet = chart.planets.find((p) => p.id === sign.lord);
  const sav = chart.ashtakavarga?.sarva?.[signIdx] ?? 28;
  const lordName = sign.lord;
  if (!lordPlanet) {
    return {
      lord: lordName,
      en: `${getOrdinalSuffix(house)} lord ${lordName}`,
      hi: `${house}वें भावेश ${GRAHA_NAMES_HI[lordName] ?? lordName}`,
      signNameEn: sign.name,
      signNameHi: sign.name,
      rasiHouse: 1,
      dignity: 'Neutral',
      sav,
    };
  }
  const dHi = DIGNITY_NAMES_HI[lordPlanet.dignity] ?? lordPlanet.dignity;
  const sHi = SIGNS[lordPlanet.signIndex]?.name ?? lordPlanet.signName;
  return {
    lord: lordName,
    en: `${getOrdinalSuffix(house)} lord ${lordPlanet.id} in House ${lordPlanet.rasiHouseNumber} (${lordPlanet.signName}, ${lordPlanet.dignity})`,
    hi: `${house}वें भावेश ${GRAHA_NAMES_HI[lordPlanet.id] ?? lordPlanet.id} भाव ${lordPlanet.rasiHouseNumber} में (${sHi} राशि, ${dHi})`,
    signNameEn: sign.name,
    signNameHi: sign.name,
    rasiHouse: lordPlanet.rasiHouseNumber,
    dignity: lordPlanet.dignity,
    sav,
  };
}

interface ChartEventSignals {
  coreCompromised: boolean;
  coreCompromiseReasonEn: string;
  coreCompromiseReasonHi: string;
  hasPravrajya: boolean;
  hasVipreet: boolean;
  hasVyayaErosion: boolean;
  marriageDelayed: boolean;
  marriageTurbulent: boolean;
  eduBreak5in8: boolean;
  eduResumption: boolean;
  progenyDelayed: boolean;
  progenyTested: boolean;
  hasBandhana: boolean;
  longevityTier: 'Dirghayu' | 'Madhyama' | 'Preventive';
  propertyTested: boolean;
  findDashaAges: (lords: string[], fallbackEn: string, fallbackHi: string) => { en: string; hi: string };
}

function getChartEventSignals(chart: ChartData, classicalYogas: DetectedClassicalYoga[]): ChartEventSignals {
  const getP = (id: string) => chart.planets.find((p) => p.id === id);
  const sun = getP('Sun');
  const moon = getP('Moon');
  const mars = getP('Mars');
  const jup = getP('Jupiter');
  const ven = getP('Venus');
  const sat = getP('Saturn');
  const rahu = getP('Rahu');
  const ketu = getP('Ketu');

  const lordOf = (h: number) => getP(SIGNS[(chart.ascendant.signIndex + h - 1) % 12].lord);
  const l1 = lordOf(1), l2 = lordOf(2), l4 = lordOf(4), l5 = lordOf(5), l6 = lordOf(6), l7 = lordOf(7), l8 = lordOf(8), l11 = lordOf(11), l12 = lordOf(12);

  const isGandantaLon = (signIdx: number, deg: number) =>
    ([3, 7, 11].includes(signIdx) && deg >= 26.6667) || ([0, 4, 8].includes(signIdx) && deg <= 3.3333);
  const ak = chart.planets.find((p) => p.charaKaraka === 'AK');
  const isAkDeb = ak?.dignity === 'Debilitated';
  const isAkGandanta = Boolean(ak && isGandantaLon(ak.signIndex, ak.degreeInSign));
  const isLagnaSandhi = chart.ascendant.degreeInSign < 1.0 || chart.ascendant.degreeInSign > 29.0;
  const isSatMarsSame = Boolean(sat && mars && sat.rasiHouseNumber === mars.rasiHouseNumber);
  const coreCompromised = (isAkDeb && (isAkGandanta || isSatMarsSame || isLagnaSandhi)) || (isLagnaSandhi && isSatMarsSame);

  const reasonsEn: string[] = [];
  const reasonsHi: string[] = [];
  if (isAkDeb && ak) { reasonsEn.push(`Debilitated AK ${ak.id}`); reasonsHi.push(`नीचस्थ आत्मकारक ${GRAHA_NAMES_HI[ak.id] ?? ak.id}`); }
  if (isAkGandanta && ak) { reasonsEn.push('Gandanta AK'); reasonsHi.push('गंडांत आत्मकारक'); }
  if (isLagnaSandhi) { reasonsEn.push('Lagna in Rashi Sandhi'); reasonsHi.push('लग्न राशि-संधि'); }
  if (isSatMarsSame) { reasonsEn.push(`Saturn–Mars conjunction in H${sat?.rasiHouseNumber}`); reasonsHi.push(`शनि-मंगल युति (भाव ${sat?.rasiHouseNumber})`); }

  const houseCounts = new Map<number, number>();
  for (const p of chart.planets) {
    if (!['Asc', 'Rahu', 'Ketu'].includes(p.id)) {
      houseCounts.set(p.rasiHouseNumber, (houseCounts.get(p.rasiHouseNumber) || 0) + 1);
    }
  }
  const hasPravrajya = Array.from(houseCounts.values()).some((c) => c >= 4);

  const hasVipreet = classicalYogas.some((y) => /Harsha|Sarala|Vimala|Viparita/i.test(y.name) && y.bhangaStatus !== 'Bhanga') ||
    (l1?.dignity !== 'Debilitated' && ([6, 8, 12].includes(l6?.rasiHouseNumber ?? 0) || [6, 8, 12].includes(l8?.rasiHouseNumber ?? 0) || [6, 8, 12].includes(l12?.rasiHouseNumber ?? 0)));

  const hasVyayaErosion = !coreCompromised && !hasVipreet && Boolean(
    (l2?.rasiHouseNumber === 12 && l1?.rasiHouseNumber === 12) ||
    (l2?.rasiHouseNumber === 12 && l11?.dignity === 'Debilitated') ||
    (l1?.rasiHouseNumber === 12 && l11?.dignity === 'Debilitated')
  );

  const marriageDelayed = Boolean(
    sat && ([1, 7].includes(sat.rasiHouseNumber) || aspectsHouse(chart, 7).includes('Saturn')) ||
    [6, 8, 12].includes(l7?.rasiHouseNumber ?? 0) ||
    (ven && [6, 8, 12].includes(ven.rasiHouseNumber)) ||
    rahu?.rasiHouseNumber === 7
  );
  const marriageTurbulent = Boolean(
    (l7 && [6, 8, 12].includes(l7.rasiHouseNumber) && ven && ([6, 8, 12].includes(ven.rasiHouseNumber) || ven.degreeInSign < 1.0 || ven.isCombust)) ||
    (sun?.rasiHouseNumber === 7 && mars?.rasiHouseNumber === 7) ||
    (jup?.dignity === 'Debilitated' && [6, 8, 12].includes(l7?.rasiHouseNumber ?? 0))
  );

  const eduBreak5in8 = l5?.rasiHouseNumber === 8 || Boolean(sat && l5 && sat.rasiHouseNumber === 5 && [6, 8].includes(l5.rasiHouseNumber));
  const eduResumption = eduBreak5in8 && Boolean(jup && [1, 4, 5, 7, 9, 10, 12].includes(jup.rasiHouseNumber) && jup.dignity !== 'Debilitated');

  const progenyDelayed = Boolean(
    [6, 8, 12].includes(l5?.rasiHouseNumber ?? 0) ||
    (sat && sat.rasiHouseNumber === 5) ||
    (rahu && rahu.rasiHouseNumber === 5) ||
    (ketu && ketu.rasiHouseNumber === 5)
  );
  const progenyTested = Boolean(
    [6, 8, 12].includes(l5?.rasiHouseNumber ?? 0) &&
    (jup?.dignity === 'Debilitated' || [6, 8, 12].includes(jup?.rasiHouseNumber ?? 0) || rahu?.rasiHouseNumber === 5)
  );

  const malSet = new Set(['Saturn', 'Mars', 'Rahu', 'Ketu', 'Sun']);
  const countMal = (h: number) => chart.planets.filter((p) => p.rasiHouseNumber === h && malSet.has(p.id)).length;
  const h12Cluster = [mars, sat, rahu].filter((p) => p && p.rasiHouseNumber === 12).length >= 2;
  const prashnaBandhana = Boolean(sat && [4, 5, 7, 8, 9].includes(sat.rasiHouseNumber) && [0, 4, 7, 9, 10].includes(sat.signIndex) &&
    chart.planets.some((p) => p.id !== 'Saturn' && p.rasiHouseNumber === sat.rasiHouseNumber && malSet.has(p.id)));
  const hasBandhana = (countMal(2) > 0 && countMal(2) === countMal(12)) || (countMal(5) > 0 && countMal(5) === countMal(9)) || h12Cluster || prashnaBandhana;

  const l1Bad = [6, 8, 12].includes(l1?.rasiHouseNumber ?? 0) || l1?.dignity === 'Debilitated';
  const l8Bad = [6, 12].includes(l8?.rasiHouseNumber ?? 0) || l8?.dignity === 'Debilitated';
  const satStrong = Boolean(sat && ([1, 7, 8, 10, 11].includes(sat.rasiHouseNumber) || ['Exalted', 'Own Sign', 'Moolatrikona'].includes(sat.dignity)));
  const longevityTier: 'Dirghayu' | 'Madhyama' | 'Preventive' =
    (l1Bad && l8Bad && !satStrong) ? 'Preventive' : ((l1Bad || l8Bad) && !satStrong) ? 'Madhyama' : 'Dirghayu';

  const propertyTested = Boolean(
    [6, 8, 12].includes(l4?.rasiHouseNumber ?? 0) ||
    [sat, rahu, ketu].some((p) => p && p.rasiHouseNumber === 4)
  );

  const birthMs = chart.utcMs;
  const YEAR_MS = 365.2425 * 86400 * 1000;
  const findDashaAges = (lords: string[], fallbackEn: string, fallbackHi: string): { en: string; hi: string } => {
    const matches = (chart.vimshottari || []).filter((d) => lords.includes(String(d.lord)));
    const active = matches.filter((d) => {
      const startAge = Math.max(0, Math.round((d.startMs - birthMs) / YEAR_MS));
      const endAge = Math.min(90, Math.round((d.endMs - birthMs) / YEAR_MS));
      return endAge >= 16 && startAge <= 75;
    }).slice(0, 2);
    if (!active.length) return { en: fallbackEn, hi: fallbackHi };
    const en = active.map((d) => {
      const a1 = Math.max(1, Math.round((d.startMs - birthMs) / YEAR_MS));
      const a2 = Math.min(90, Math.round((d.endMs - birthMs) / YEAR_MS));
      return `Ages ${a1}–${a2} (${d.lord} MD)`;
    }).join(' & ');
    const hi = active.map((d) => {
      const a1 = Math.max(1, Math.round((d.startMs - birthMs) / YEAR_MS));
      const a2 = Math.min(90, Math.round((d.endMs - birthMs) / YEAR_MS));
      return `आयु ${a1}–${a2} वर्ष (${GRAHA_NAMES_HI[String(d.lord)] ?? d.lord} महादशा)`;
    }).join(' व ');
    return { en, hi };
  };

  return {
    coreCompromised,
    coreCompromiseReasonEn: reasonsEn.join(' + '),
    coreCompromiseReasonHi: reasonsHi.join(' + '),
    hasPravrajya,
    hasVipreet,
    hasVyayaErosion,
    marriageDelayed,
    marriageTurbulent,
    eduBreak5in8,
    eduResumption,
    progenyDelayed,
    progenyTested,
    hasBandhana,
    longevityTier,
    propertyTested,
    findDashaAges,
  };
}

function synthesizeDeepClassicalDomainPrediction(
  chart: ChartData,
  domainId: string,
  config: DomainConfig,
  score: number,
  toneEn: string,
  toneHi: string,
  strengthsEn: string[],
  strengthsHi: string[],
  watchoutsEn: string[],
  watchoutsHi: string[],
  classicalYogas: DetectedClassicalYoga[]
): {
  predictionEn: string;
  predictionHi: string;
  summaryEn: string;
  summaryHi: string;
  timingWindowEn: string;
  timingWindowHi: string;
  concreteEventsEn: string[];
  concreteEventsHi: string[];
} {
  const ascSign = SIGNS[chart.ascendant.signIndex];
  const sig = getChartEventSignals(chart, classicalYogas);

  if (domainId === 'personality') {
    const h1 = getHouseLordDesc(chart, 1);
    const h5 = getHouseLordDesc(chart, 5);
    const h9 = getHouseLordDesc(chart, 9);
    const sunDesc = getPlanetDesc(chart, 'Sun');
    const moonDesc = getPlanetDesc(chart, 'Moon');
    const mdWin = sig.findDashaAges([h1.lord, h9.lord, 'Sun'], 'Lagna & 9th Lord Dashas', 'लग्नेश व नवमेश महादशा');

    const coreNoteEn = sig.coreCompromised
      ? `⚠️ Core Pillar Caution (${sig.coreCompromiseReasonEn}): Surface strengths require conscious self-discipline, emotional steadiness, and grounded expectations rather than relying on effortless luck.`
      : sig.hasPravrajya
      ? `Pravrajya / Spiritual Alignment: Strong renunciation and philosophical depth orient your personality toward higher purpose, service, or institutional leadership.`
      : ['Exalted', 'Moolatrikona', 'Own Sign'].includes(h1.dignity)
      ? 'The dignified status of your Lagna lord bestows natural societal honor, self-esteem, and executive autonomy.'
      : 'This placement fosters resilient self-determination, enabling you to sculpt an independent path through sustained enterprise.';
    const coreNoteHi = sig.coreCompromised
      ? `⚠️ मूल स्तंभ सावधानी (${sig.coreCompromiseReasonHi}): सतही योगों के बावजूद जीवन में सफलता निरंतर आत्म-अनुशासन, धैर्य व यथार्थवादी प्रयास से प्राप्त होती है।`
      : sig.hasPravrajya
      ? `प्रव्रज्या / आध्यात्मिक संयोग: आपके व्यक्तित्व में वैराग्य, गहन चिंतन व लोक-कल्याण अथवा संस्थागत नेतृत्व की प्रबल प्रवृत्ति विद्यमान है।`
      : ['Exalted', 'Moolatrikona', 'Own Sign'].includes(h1.dignity)
      ? 'लग्नेश की स्वराशि/उच्च गरिमा आपको समाज में स्वतः मान-प्रतिष्ठा एवं स्वतंत्र नेतृत्व की क्षमता प्रदान करती है।'
      : 'लग्नेश की यह स्थिति आपको स्वावलंबी बनाती है, जहाँ आप सतत पुरुषार्थ से अपनी स्वतंत्र पहचान स्थापित करते हैं।';

    return {
      predictionEn: `You are born with ${ascSign.name} ascendant, ruled by ${h1.en}. ${coreNoteEn}\n\n5th lord (${h5.en}) and 9th lord (${h9.en}) shape your intellect and worldview, while Sun (${sunDesc.en}) and Moon (${moonDesc.en}) govern vitality and emotional temperament.\n\nKey Identity Windows: ${mdWin.en} activate major personal turning points.`,
      predictionHi: `आपका जन्म ${ascSign.name} लग्न में हुआ है, जिसके स्वामी ${h1.hi} हैं। ${coreNoteHi}\n\nपंचमेश (${h5.hi}) एवं नवमेश (${h9.hi}) आपकी बौद्धिक दिशा तय करते हैं, जबकि सूर्य (${sunDesc.hi}) एवं चंद्र (${moonDesc.hi}) आत्मबल व मनःस्थिति का संचालन करते हैं।\n\nप्रमुख फलोदय काल: ${mdWin.hi} व्यक्तित्व व पहचान में निर्णायक मोड़ लाती हैं।`,
      summaryEn: `${config.titleEn}: ${toneEn} Shastric indications (score ${score}/100) across houses ${config.houses.join(', ')}.${sig.coreCompromised ? ` Caution: ${sig.coreCompromiseReasonEn}.` : ''}`,
      summaryHi: `${config.titleHi}: भाव ${config.houses.join(', ')} के संकेत ${toneHi} हैं (अंक ${score}/100)।`,
      timingWindowEn: `${mdWin.en} (Identity shaping & Lagna-lord maturation)`,
      timingWindowHi: `${mdWin.hi} (व्यक्तित्व निर्माण व लग्नेश परिपक्वता काल)`,
      concreteEventsEn: [
        `${mdWin.en}: Defining self-identity, public role, or philosophical turning point.`,
        sig.coreCompromised
          ? `Caution (${sig.coreCompromiseReasonEn}): Guard against mental restlessness, impulsive decisions, and over-extension.`
          : `Lagna & 9th-house synergy (${h1.lord}/${h9.lord}) anchors steady personal growth and reputation.`,
      ],
      concreteEventsHi: [
        `${mdWin.hi}: स्वतंत्र पहचान, भूमिका व जीवन-दशा का निर्णायक निर्धारण।`,
        sig.coreCompromised
          ? `सावधानी (${sig.coreCompromiseReasonHi}): आवेग, मानसिक अस्थिरता व जल्दबाजी से बचें।`
          : `लग्नेश व नवमेश (${GRAHA_NAMES_HI[h1.lord] ?? h1.lord}/${GRAHA_NAMES_HI[h9.lord] ?? h9.lord}) का समन्वय निरंतर प्रगति देता है।`,
      ],
    };
  }

  if (domainId === 'wealth') {
    const h2 = getHouseLordDesc(chart, 2);
    const h11 = getHouseLordDesc(chart, 11);
    const h5 = getHouseLordDesc(chart, 5);
    const h9 = getHouseLordDesc(chart, 9);
    const jupDesc = getPlanetDesc(chart, 'Jupiter');
    const sav2 = h2.sav, sav11 = h11.sav;
    const sav12 = chart.ashtakavarga?.sarva?.[(chart.ascendant.signIndex + 11) % 12] ?? 28;
    const wWin = sig.findDashaAges([h2.lord, h11.lord, h9.lord, 'Jupiter'], '2nd/11th Lord Dashas', 'धनेश/लाभेश महादशा');

    let wealthOutcomeEn = `Financial architecture links 2nd lord (${h2.en}) and 11th lord (${h11.en}) with ${sav2}/${sav11} SAV bindus (vs 12th house ${sav12}).`;
    let wealthOutcomeHi = `धन भाव के स्वामी ${h2.hi} व लाभेश ${h11.hi} का समन्वय (SAV ${sav2}/${sav11} बिंदु बनाम व्यय ${sav12} बिंदु) आर्थिक स्थिति तय करता है।`;
    let eventsEn: string[];
    let eventsHi: string[];

    if (sig.coreCompromised) {
      wealthOutcomeEn += ` ⚠️ Core Pillar Override (${sig.coreCompromiseReasonEn}): Surface Dhana/Raja yogas are curtailed; avoid speculative leverage and build savings steadily.`;
      wealthOutcomeHi += ` ⚠️ मूल स्तंभ अवरोध (${sig.coreCompromiseReasonHi}): सतही धन योग बाधित हैं; सट्टेबाजी व कर्ज से बचकर नियमित बचत करें।`;
      eventsEn = [
        `${wWin.en}: Gradual earned stabilization; avoid high-risk speculation or unverified partnerships.`,
        `Strict budgeting required where 12th expenditure (${sav12} bindus) can pressure reserves.`,
      ];
      eventsHi = [
        `${wWin.hi}: परिश्रम से क्रमिक आर्थिक स्थिरता; जोखिम भरे निवेश व साझेदारी से बचें।`,
        `व्यय नियंत्रण (${sav12} बिंदु) व सुरक्षित बचत दीर्घकालिक रक्षा प्रदान करते हैं।`,
      ];
    } else if (sig.hasVyayaErosion) {
      wealthOutcomeEn += ` ⚠️ Vyaya / Debt-Erosion Watch: 2nd/Lagna lord in 12th or debilitated 11th lord warns against over-leveraging and sudden capital drawdown despite peak earning phases.`;
      wealthOutcomeHi += ` ⚠️ व्यय व ऋण-क्षय सतर्कता: द्वितीयेश/लग्नेश का द्वादश में होना या एकादशेश का नीचस्थ होना अत्यधिक कर्ज व पूंजी-क्षय से बचने की चेतावनी देता है।`;
      eventsEn = [
        `${wWin.en}: High cashflow peaks possible, but ring-fence reserves against debt/drawdown cycles.`,
        `Conservative liquidity and zero personal debt-guarantees protect net worth.`,
      ];
      eventsHi = [
        `${wWin.hi}: आय के शिखर के साथ-साथ कर्ज व व्यय-क्षय से पूंजी की रक्षा अत्यंत आवश्यक।`,
        `सुरक्षित तरल कोष रखें व अनावश्यक ऋण गारंटी से दूर रहें।`,
      ];
    } else if (score >= 72 || sig.hasVipreet) {
      wealthOutcomeEn += ` Fortified Artha Trikona (${h5.en}; ${h9.en})${sig.hasVipreet ? ' + Vipreet Raj Yoga resilience' : ''} and Jupiter (${jupDesc.en}) support major asset compounding during ${wWin.en}.`;
      wealthOutcomeHi += ` सबल अर्थ त्रिकोण (${h5.hi}; ${h9.hi})${sig.hasVipreet ? ' व विपरीत राजयोग' : ''} एवं गुरु (${jupDesc.hi}) ${wWin.hi} में उच्च संपत्ति व धन-संचय देते हैं।`;
      eventsEn = [
        `${wWin.en}: Major income expansion, asset accumulation, or turnaround wealth breakthrough.`,
        `SAV balance (H2 ${sav2} / H11 ${sav11} vs H12 ${sav12}) supports compounding capital and property.`,
      ];
      eventsHi = [
        `${wWin.hi}: आय के स्रोतों में बड़ा विस्तार, संपत्ति निर्माण व दीर्घकालिक कोष वृद्धि।`,
        `SAV संतुलन (भाव 2: ${sav2} / भाव 11: ${sav11}) स्थायी पूंजी संचय को बल देता है।`,
      ];
    } else {
      wealthOutcomeEn += ` Jupiter (${jupDesc.en}) supports steady, earned financial growth through disciplined saving rather than windfalls.`;
      wealthOutcomeHi += ` गुरु (${jupDesc.hi}) परिश्रम व अनुशासित बचत से क्रमिक आर्थिक उन्नति का संकेत देते हैं।`;
      eventsEn = [
        `${wWin.en}: Primary window for income consolidation and disciplined asset building.`,
        `Steady earned cashflow and systematic savings outlast speculative swings.`,
      ];
      eventsHi = [
        `${wWin.hi}: नियमित आय सुदृढ़ करने और व्यवस्थित बचत बढ़ाने का प्रमुख काल।`,
        `आकस्मिक जोखिम की अपेक्षा अनुशासित निवेश स्थायी समृद्धि देता है।`,
      ];
    }

    return {
      predictionEn: wealthOutcomeEn,
      predictionHi: wealthOutcomeHi,
      summaryEn: `${config.titleEn}: ${toneEn} indications (score ${score}/100) across houses ${config.houses.join(', ')}.`,
      summaryHi: `${config.titleHi}: भाव ${config.houses.join(', ')} के संकेत ${toneHi} हैं (अंक ${score}/100)।`,
      timingWindowEn: `${wWin.en} (Wealth & Artha-Trikona activation)`,
      timingWindowHi: `${wWin.hi} (धन व अर्थ-त्रिकोण सक्रियता काल)`,
      concreteEventsEn: eventsEn,
      concreteEventsHi: eventsHi,
    };
  }

  if (domainId === 'career') {
    const h10 = getHouseLordDesc(chart, 10);
    const h6 = getHouseLordDesc(chart, 6);
    const sunDesc = getPlanetDesc(chart, 'Sun');
    const satDesc = getPlanetDesc(chart, 'Saturn');
    const cWin = sig.findDashaAges([h10.lord, 'Saturn', 'Sun'], '10th Lord / Saturn Dashas', 'दशमेश / शनि महादशा');
    const isPivot10 = h10.rasiHouse === 5 || [6, 8, 12].includes(h10.rasiHouse);

    let careerBodyEn = `Your career is governed by 10th lord ${h10.en}, Karma Karaka Saturn (${satDesc.en}), Sun (${sunDesc.en}), and 6th lord (${h6.en}).`;
    let careerBodyHi = `करियर का संचालन दशमेश ${h10.hi}, कर्मकारक शनि (${satDesc.hi}), सूर्य (${sunDesc.hi}) एवं षष्ठेश (${h6.hi}) द्वारा होता है।`;
    let eventsEn: string[];
    let eventsHi: string[];

    if (sig.coreCompromised) {
      careerBodyEn += ` ⚠️ Core Pillar Override (${sig.coreCompromiseReasonEn}): Surface Rajayogas do not deliver effortless authority; expect tests of patience and gradual rise through specialized skill.`;
      careerBodyHi += ` ⚠️ मूल स्तंभ अवरोध (${sig.coreCompromiseReasonHi}): सतही राजयोग के बजाय धैर्य, कौशल व निरंतर परिश्रम से ही करियर में स्थिरता आती है।`;
      eventsEn = [
        `${cWin.en}: Restructuring, role changes, or demanding responsibility requiring steady persistence.`,
        `Avoid ego clashes with superiors; documented work and niche skill protect career continuity.`,
      ];
      eventsHi = [
        `${cWin.hi}: कार्यक्षेत्र में परिवर्तन या परीक्षा काल; धैर्य व दक्षता से स्थिरता प्राप्त होगी।`,
        `अधिकारियों से टकराव से बचें और लिखित व प्रमाणिक कार्यप्रणाली अपनाएं।`,
      ];
    } else if (sig.hasPravrajya) {
      careerBodyEn += ` Pravrajya / Mission Signature: Career gravitates toward teaching, spiritual/philosophical leadership, research, or selfless public institutions rather than conventional corporate hierarchy.`;
      careerBodyHi += ` प्रव्रज्या / मिशन योग: आजीविका पारंपरिक नौकरी के बजाय ज्ञान, शोध, आध्यात्मिक/सामाजिक नेतृत्व या संस्थागत सेवा से जुड़ती है।`;
      eventsEn = [
        `${cWin.en}: Defining ideological, research, or institutional leadership chapter.`,
        `Influence stems from integrity, wisdom, and service rather than commercial rank alone.`,
      ];
      eventsHi = [
        `${cWin.hi}: शोध, शिक्षण, धर्म या सार्वजनिक सेवा के क्षेत्र में निर्णायक नेतृत्व।`,
        `पद की अपेक्षा ज्ञान, चरित्र व लोक-सेवा से स्थायी प्रतिष्ठा प्राप्त होती है।`,
      ];
    } else if (score >= 72 || sig.hasVipreet) {
      careerBodyEn += `${sig.hasVipreet ? ' Vipreet Raj Yoga resilience turns early competition or adversity into executive breakthroughs.' : ' Strong 10th/11th alignment favors high authority, leadership, and institutional recognition.'}${isPivot10 ? ' Note: 10th lord in H5/Trik indicates mid-career role pivots or foreign/independent shifts.' : ''}`;
      careerBodyHi += `${sig.hasVipreet ? ' विपरीत राजयोग प्रारंभिक संघर्ष व प्रतिस्पर्धा को उच्च पदोन्नति में बदलता है।' : ' प्रबल दशम-एकादश समन्वय उच्च अधिकार, नेतृत्व व प्रतिष्ठा प्रदान करता है।'}${isPivot10 ? ' दशमेश की स्थिति मध्य-करियर में बड़े बदलाव या स्वतंत्र मोड़ का संकेत देती है।' : ''}`;
      eventsEn = [
        `${cWin.en}: Major promotion, executive authority, or breakthrough enterprise expansion.`,
        isPivot10 ? 'Mid-career strategic pivot (foreign, independent, or research shift) unlocks peak stature.' : 'Sustained leadership recognition and institutional command.',
      ];
      eventsHi = [
        `${cWin.hi}: उच्च पदोन्नति, प्रशासनिक अधिकार अथवा बड़े उद्यम का विस्तार।`,
        isPivot10 ? 'करियर में रणनीतिक बदलाव या स्वतंत्र/विदेशी अवसर से शीर्ष उत्कर्ष।' : 'संस्थागत नेतृत्व व दीर्घकालिक प्रतिष्ठा की प्राप्ति।',
      ];
    } else {
      careerBodyEn += ` Growth unfolds steadily through structured work, technical competence, and ${isPivot10 ? 'periodic role pivots' : 'consistent reliability'}.`;
      careerBodyHi += ` करियर में उन्नति नियमित परिश्रम, तकनीकी दक्षता व ${isPivot10 ? 'समय-समय पर भूमिका परिवर्तन' : 'विश्वसनीयता'} से होती है।`;
      eventsEn = [
        `${cWin.en}: Key career consolidation and responsibility upgrade window.`,
        isPivot10 ? 'Prepare for role transitions or cross-functional shifts during 6th/8th/12th sub-periods.' : 'Steady progression through skill mastery and disciplined execution.',
      ];
      eventsHi = [
        `${cWin.hi}: करियर सुदृढ़ीकरण व उत्तरदायित्व वृद्धि का मुख्य काल।`,
        isPivot10 ? '६/८/१२ अंतर्दशाओं में नौकरी या कार्यक्षेत्र परिवर्तन की संभावना।' : 'कौशल व अनुशासन से क्रमिक पदोन्नति।',
      ];
    }

    return {
      predictionEn: careerBodyEn,
      predictionHi: careerBodyHi,
      summaryEn: `${config.titleEn}: ${toneEn} indications (score ${score}/100) across houses ${config.houses.join(', ')}.`,
      summaryHi: `${config.titleHi}: भाव ${config.houses.join(', ')} के संकेत ${toneHi} हैं (अंक ${score}/100)।`,
      timingWindowEn: `${cWin.en} (Primary Karma-Bhava activation)`,
      timingWindowHi: `${cWin.hi} (मुख्य कर्म-भाव सक्रियता काल)`,
      concreteEventsEn: eventsEn,
      concreteEventsHi: eventsHi,
    };
  }

  if (domainId === 'marriage') {
    const h7 = getHouseLordDesc(chart, 7);
    const h2 = getHouseLordDesc(chart, 2);
    const venDesc = getPlanetDesc(chart, 'Venus');
    const jupDesc = getPlanetDesc(chart, 'Jupiter');
    const mWin = sig.findDashaAges([h7.lord, 'Venus', h2.lord], '7th Lord / Venus Dashas', 'सप्तमेश / शुक्र महादशा');

    let marEn = `Matrimony is governed by 7th lord ${h7.en}, 2nd lord (${h2.en}), Venus (${venDesc.en}), and Jupiter (${jupDesc.en}).`;
    let marHi = `वैवाहिक जीवन का संचालन सप्तमेश ${h7.hi}, द्वितीयेश (${h2.hi}), शुक्र (${venDesc.hi}) एवं गुरु (${jupDesc.hi}) से होता है।`;
    let eventsEn: string[];
    let eventsHi: string[];

    if (sig.hasPravrajya) {
      marEn += ` Pravrajya / Detachment Indicator: Strong renunciation yogas prioritize spiritual/intellectual mission over conventional domestic life; marriage may be delayed, unconventional, or subordinated to higher duty.`;
      marHi += ` प्रव्रज्या / वैराग्य संकेत: कुंडली में प्रबल संन्यास या उच्च मिशन योग के कारण पारंपरिक गृहस्थ जीवन गौण या विलंबित रह सकता है।`;
      eventsEn = [
        'Primary focus gravitates toward higher mission, philosophy, or service rather than early domesticity.',
        `If partnership occurs (${mWin.en}), it requires shared ideological freedom and mutual respect.`,
      ];
      eventsHi = [
        'जीवन की मुख्य ऊर्जा गृहस्थ की अपेक्षा उच्च उद्देश्य, दर्शन या लोक-सेवा में लगती है।',
        `यदि विवाह हो (${mWin.hi}), तो वैचारिक स्वतंत्रता व परस्पर सम्मान अनिवार्य रहेगा।`,
      ];
    } else if (sig.marriageTurbulent) {
      marEn += ` ⚠️ Marital Turbulence / Separation Watch: 7th lord in 6/8/12 with afflicted Venus or 7th-house malefics warns of sharp ego clashes, legal/financial friction, or separation risk. Careful Kundali matching, transparent finances, and patient communication are vital.`;
      marHi += ` ⚠️ दांपत्य संघर्ष / अलगाव सतर्कता: सप्तमेश का ६/८/१२ में होना तथा शुक्र/सप्तम पर पाप प्रभाव तीव्र मतभेद, कानूनी या आर्थिक विवाद का संकेत देता है। गहन मिलान व संवाद आवश्यक है।`;
      eventsEn = [
        `${mWin.en}: High-sensitivity relationship window; avoid rushed commitments without thorough compatibility checks.`,
        'Guard against ego struggles and 2/6/7/8 financial/legal disputes through clear agreements and counseling.',
      ];
      eventsHi = [
        `${mWin.hi}: संवेदनशील वैवाहिक काल; बिना गहन कुंडली मिलान के जल्दबाजी में निर्णय न लें।`,
        'अहं के टकराव व वित्तीय/कानूनी विवादों से बचने हेतु पारदर्शिता व परामर्श अपनाएं।',
      ];
    } else if (sig.marriageDelayed) {
      marEn += ` Delayed / Maturation Yoga: Saturn/Rahu influence on 7th or Dusthana 7th lord favors marriage after emotional and career maturity rather than early haste.`;
      marHi += ` विलंबित / परिपक्व विवाह योग: सप्तम पर शनि/राहु या त्रिक सप्तमेश के कारण करियर व मानसिक परिपक्वता के बाद विवाह श्रेष्ठ रहता है।`;
      eventsEn = [
        `${mWin.en}: Mature-age relationship or marriage activation once career foundations settle.`,
        'Patience and realistic expectations foster durable long-term companionship.',
      ];
      eventsHi = [
        `${mWin.hi}: करियर स्थिर होने के पश्चात परिपक्व आयु में विवाह का अनुकूल योग।`,
        'धैर्य व यथार्थवादी अपेक्षाओं से दांपत्य जीवन में स्थायी मजबूती आती है।',
      ];
    } else {
      marEn += ` Balanced 7th/Venus/D9 alignment supports warm companionship, mutual respect, and steady domestic harmony during ${mWin.en}.`;
      marHi += ` संतुलित सप्तम-शुक्र-नवांश स्थिति ${mWin.hi} में सौहार्दपूर्ण विवाह व पारिवारिक सुख प्रदान करती है।`;
      eventsEn = [
        `${mWin.en}: Primary auspicious window for partnership commitment and domestic stability.`,
        'Mutual respect and shared values support joint household prosperity.',
      ];
      eventsHi = [
        `${mWin.hi}: शुभ विवाह व गृहस्थ स्थिरता का प्रमुख अनुकूल काल।`,
        'परस्पर सम्मान व साझा मूल्यों से परिवार में सुख-समृद्धि बढ़ती है।',
      ];
    }

    return {
      predictionEn: marEn,
      predictionHi: marHi,
      summaryEn: `${config.titleEn}: ${toneEn} indications (score ${score}/100) across houses ${config.houses.join(', ')}.`,
      summaryHi: `${config.titleHi}: भाव ${config.houses.join(', ')} के संकेत ${toneHi} हैं (अंक ${score}/100)।`,
      timingWindowEn: `${mWin.en} (${sig.marriageTurbulent ? 'Careful discernment required' : sig.marriageDelayed ? 'Mature-age window' : 'Auspicious union window'})`,
      timingWindowHi: `${mWin.hi} (${sig.marriageTurbulent ? 'सावधानी व विवेक अपेक्षित' : sig.marriageDelayed ? 'परिपक्व आयु योग' : 'अनुकूल विवाह काल'})`,
      concreteEventsEn: eventsEn,
      concreteEventsHi: eventsHi,
    };
  }

  if (domainId === 'health') {
    const h1 = getHouseLordDesc(chart, 1);
    const h6 = getHouseLordDesc(chart, 6);
    const h8 = getHouseLordDesc(chart, 8);
    const satDesc = getPlanetDesc(chart, 'Saturn');
    const sunDesc = getPlanetDesc(chart, 'Sun');
    const hWin = sig.findDashaAges([h6.lord, h8.lord, 'Saturn'], '6th/8th Lord Dashas', 'षष्ठेश/अष्टमेश महादशा');

    const longEn = sig.longevityTier === 'Dirghayu'
      ? 'Dirghayu (Strong Vitality & Longevity 75+ yrs) anchored by unbroken Lagna/8th/Saturn balance.'
      : sig.longevityTier === 'Madhyama'
      ? 'Madhyama Ayus (Moderate Vitality): Lagna or 8th lord in Trik houses makes preventive checkups, stress hygiene, and sleep discipline essential.'
      : '⚠️ Preventive Vitality Care: Both Lagna and 8th lords experience Trik/debilitation strain without strong Saturn stabilization — prioritize regular screening and lifestyle discipline.';
    const longHi = sig.longevityTier === 'Dirghayu'
      ? 'पूर्णायु / दीर्घायु योग (७५+ वर्ष): लग्नेश, अष्टमेश व शनि के संतुलन से उत्तम जीवनी शक्ति।'
      : sig.longevityTier === 'Madhyama'
      ? 'मध्यायु योग: लग्नेश या अष्टमेश पर दबाव के कारण नियमित स्वास्थ्य जांच व संतुलित दिनचर्या आवश्यक।'
      : '⚠️ सजग स्वास्थ्य संरक्षण: लग्नेश व अष्टमेश दोनों पर दबाव होने से नियमित चिकित्सा जांच, पर्याप्त निद्रा व तनाव नियंत्रण अनिवार्य है।';

    return {
      predictionEn: `${longEn}\n\nConstitutional markers: Lagna lord ${h1.en}, 8th lord ${h8.en}, 6th lord ${h6.en}, Saturn (${satDesc.en}), and Sun (${sunDesc.en}).${sig.hasBandhana ? ' Bandhana/Stress Watch: Guard against prolonged litigation, overwork, or nervous strain during Saturn/Rahu periods.' : ''}`,
      predictionHi: `${longHi}\n\nलग्नेश ${h1.hi}, अष्टमेश ${h8.hi}, षष्ठेश ${h6.hi}, शनि (${satDesc.hi}) एवं सूर्य (${sunDesc.hi}) शारीरिक प्रतिरोधक क्षमता तय करते हैं।${sig.hasBandhana ? ' बंधन/तनाव सतर्कता: शनि/राहु काल में कानूनी विवाद व अत्यधिक मानसिक तनाव से बचें।' : ''}`,
      summaryEn: `${config.titleEn}: ${toneEn} indications (score ${score}/100) across houses ${config.houses.join(', ')}.`,
      summaryHi: `${config.titleHi}: भाव ${config.houses.join(', ')} के संकेत ${toneHi} हैं (अंक ${score}/100)।`,
      timingWindowEn: `${hWin.en} (Health vigilance & recovery cycles)`,
      timingWindowHi: `${hWin.hi} (स्वास्थ्य सतर्कता व संरक्षण काल)`,
      concreteEventsEn: [
        longEn,
        `${hWin.en}: Key testing window for immunity, stress management, and preventive medical care.`,
      ],
      concreteEventsHi: [
        longHi,
        `${hWin.hi}: प्रतिरोधक क्षमता, तनाव नियंत्रण व नियमित स्वास्थ्य जांच का मुख्य काल।`,
      ],
    };
  }

  if (domainId === 'education') {
    const h4 = getHouseLordDesc(chart, 4);
    const h5 = getHouseLordDesc(chart, 5);
    const mercDesc = getPlanetDesc(chart, 'Mercury');
    const jupDesc = getPlanetDesc(chart, 'Jupiter');
    const eWin = sig.findDashaAges([h4.lord, h5.lord, 'Mercury', 'Jupiter'], '4th/5th/Mercury Dashas', 'चतुर्थेश/पंचमेश/बुध महादशा');

    const eduNoteEn = sig.eduBreak5in8
      ? (sig.eduResumption
        ? '⚠️ Education Break & Later-Life Resumption Yoga (5th Lord in 8th + Protective Jupiter): Early academic interruption or stream change is followed by successful degree completion later in life.'
        : '⚠️ Academic Interruption Watch (5th Lord in 8th): Expect stream shifts or pauses requiring persistent self-study to complete formal credentials.')
      : `Synergy of 4th lord (${h4.en}), 5th lord (${h5.en}), Mercury (${mercDesc.en}), and Jupiter (${jupDesc.en}) supports structured analytical learning.`;
    const eduNoteHi = sig.eduBreak5in8
      ? (sig.eduResumption
        ? '⚠️ शिक्षा अंतराल व पुनः पूर्णता योग (पंचमेश अष्टम में + शुभ गुरु): प्रारंभिक अध्ययन में विराम के बाद भी गुरु कृपा से बाद में डिग्री पूर्ण होती है।'
        : '⚠️ शिक्षा व्यवधान संकेत (पंचमेश अष्टम में): विषय परिवर्तन या अंतराल के बाद निरंतर परिश्रम से योग्यता पूर्ण होती है।')
      : `चतुर्थेश (${h4.hi}), पंचमेश (${h5.hi}), बुध (${mercDesc.hi}) एवं गुरु (${jupDesc.hi}) का समन्वय सुव्यवस्थित अध्ययन व मेधा प्रदान करता है।`;

    return {
      predictionEn: eduNoteEn,
      predictionHi: eduNoteHi,
      summaryEn: `${config.titleEn}: ${toneEn} indications (score ${score}/100) across houses ${config.houses.join(', ')}.`,
      summaryHi: `${config.titleHi}: भाव ${config.houses.join(', ')} के संकेत ${toneHi} हैं (अंक ${score}/100)।`,
      timingWindowEn: `${eWin.en} (Academic & credential activation)`,
      timingWindowHi: `${eWin.hi} (विद्या व उपाधि सक्रियता काल)`,
      concreteEventsEn: [
        eduNoteEn,
        `${eWin.en}: Key learning, specialization, or competitive qualification phase.`,
      ],
      concreteEventsHi: [
        eduNoteHi,
        `${eWin.hi}: अध्ययन, विशेषज्ञता या प्रतियोगी योग्यता प्राप्ति का प्रमुख काल।`,
      ],
    };
  }

  if (domainId === 'children') {
    const h5 = getHouseLordDesc(chart, 5);
    const h9 = getHouseLordDesc(chart, 9);
    const jupDesc = getPlanetDesc(chart, 'Jupiter');
    const pWin = sig.findDashaAges([h5.lord, h9.lord, 'Jupiter'], '5th/9th Lord / Jupiter Dashas', 'पंचमेश/नवमेश/गुरु महादशा');

    const childNoteEn = sig.hasPravrajya
      ? 'Pravrajya / Spiritual Lineage: Creative energy channels into disciples, intellectual legacy, or public service rather than conventional family expansion.'
      : sig.progenyTested
      ? `⚠️ Progeny Testing / Badha Watch: 5th lord in Dusthana with afflicted Jupiter/Rahu indicates delayed conception, medical support needs, or generational communication friction.`
      : sig.progenyDelayed
      ? `Delayed Progeny Timing: Saturn/Rahu/Dusthana influence on 5th delays childbirth until mature years, after which parental-child bond stabilizes.`
      : `Harmonious 5th lord (${h5.en}), 9th lord (${h9.en}), and Putrakaraka Jupiter (${jupDesc.en}) support virtuous progeny and emotional fulfillment.`;
    const childNoteHi = sig.hasPravrajya
      ? 'प्रव्रज्या / आध्यात्मिक परंपरा: सृजनात्मक ऊर्जा संतान के बजाय शिष्यों, ज्ञान-परंपरा या लोक-कल्याण में केंद्रित रहती है।'
      : sig.progenyTested
      ? `⚠️ संतान बाधा / सतर्कता: त्रिक भाव में पंचमेश व पीड़ित गुरु/राहु के कारण संतान में विलंब, चिकित्सीय सहायता या संवाद-दूरी की संभावना रहती है।`
      : sig.progenyDelayed
      ? `संतान विलंब योग: पंचम पर शनि/राहु प्रभाव से संतान प्राप्ति परिपक्व आयु में होती है।`
      : `पंचमेश (${h5.hi}), नवमेश (${h9.hi}) व पुत्रकारक गुरु (${jupDesc.hi}) सुयोग्य संतान व पारिवारिक सुख का संकेत देते हैं।`;

    return {
      predictionEn: childNoteEn,
      predictionHi: childNoteHi,
      summaryEn: `${config.titleEn}: ${toneEn} indications (score ${score}/100) across houses ${config.houses.join(', ')}.`,
      summaryHi: `${config.titleHi}: भाव ${config.houses.join(', ')} के संकेत ${toneHi} हैं (अंक ${score}/100)।`,
      timingWindowEn: `${pWin.en} (5th-house & Putrakaraka activation)`,
      timingWindowHi: `${pWin.hi} (पंचम भाव व पुत्रकारक सक्रियता काल)`,
      concreteEventsEn: [
        childNoteEn,
        `${pWin.en}: Key period for progeny milestones, creative mentoring, or family guidance.`,
      ],
      concreteEventsHi: [
        childNoteHi,
        `${pWin.hi}: संतान, सृजन या मार्गदर्शन से जुड़े प्रमुख अवसरों का काल।`,
      ],
    };
  }

  if (domainId === 'property') {
    const h4 = getHouseLordDesc(chart, 4);
    const h11 = getHouseLordDesc(chart, 11);
    const marsDesc = getPlanetDesc(chart, 'Mars');
    const venDesc = getPlanetDesc(chart, 'Venus');
    const prWin = sig.findDashaAges([h4.lord, 'Mars', 'Venus'], '4th Lord / Mars / Venus Dashas', 'चतुर्थेश / मंगल / शुक्र महादशा');

    const propEn = sig.propertyTested
      ? `Property & Domestic Vigilance: 4th lord (${h4.en}) or malefics in 4th advise verifying land titles carefully, avoiding hasty mortgages, and expecting residential changes before permanent property settles.`
      : `4th lord (${h4.en}), 11th lord (${h11.en}), Mars (${marsDesc.en}), and Venus (${venDesc.en}) support residential stability, conveyance comfort, and immovable assets.`;
    const propHi = sig.propertyTested
      ? `संपत्ति व आवास सतर्कता: चतुर्थेश (${h4.hi}) या चतुर्थ में क्रूर प्रभाव के कारण भूमि/मकान के कागजात की गहन जांच व स्थान परिवर्तन के बाद ही स्थायी संपत्ति बनती है।`
      : `चतुर्थेश (${h4.hi}), एकादशेश (${h11.hi}), मंगल (${marsDesc.hi}) व शुक्र (${venDesc.hi}) अचल संपत्ति, गृह व वाहन सुख प्रदान करते हैं।`;

    return {
      predictionEn: propEn,
      predictionHi: propHi,
      summaryEn: `${config.titleEn}: ${toneEn} indications (score ${score}/100) across houses ${config.houses.join(', ')}.`,
      summaryHi: `${config.titleHi}: भाव ${config.houses.join(', ')} के संकेत ${toneHi} हैं (अंक ${score}/100)।`,
      timingWindowEn: `${prWin.en} (4th-house & asset acquisition window)`,
      timingWindowHi: `${prWin.hi} (चतुर्थ भाव व संपत्ति सक्रियता काल)`,
      concreteEventsEn: [
        propEn,
        `${prWin.en}: Primary window for housing, vehicle, or real-estate decisions.`,
      ],
      concreteEventsHi: [
        propHi,
        `${prWin.hi}: आवास, वाहन अथवा अचल संपत्ति के निर्णयों का मुख्य काल।`,
      ],
    };
  }

  if (domainId === 'travels') {
    const h9 = getHouseLordDesc(chart, 9);
    const h12 = getHouseLordDesc(chart, 12);
    const moonDesc = getPlanetDesc(chart, 'Moon');
    const rahuDesc = getPlanetDesc(chart, 'Rahu');
    const tWin = sig.findDashaAges([h9.lord, h12.lord, 'Rahu', 'Moon'], '9th/12th Lord / Rahu Dashas', 'नवमेश/द्वादशेश/राहु महादशा');

    return {
      predictionEn: `Long-distance travel and relocation are shaped by 9th lord (${h9.en}), 12th lord (${h12.en}), Moon (${moonDesc.en}), and Rahu (${rahuDesc.en}). ${[9, 12].includes(h9.rasiHouse) || [9, 12].includes(h12.rasiHouse) || rahuDesc.en.includes('House 12') || rahuDesc.en.includes('House 9') ? 'Strong foreign/distant-place activation favors cross-border work or relocation.' : 'Journeys serve specific career, educational, or pilgrimage objectives.'}`,
      predictionHi: `यात्रा व प्रवास का संचालन नवमेश (${h9.hi}), द्वादशेश (${h12.hi}), चंद्र (${moonDesc.hi}) व राहु (${rahuDesc.hi}) से होता है। ${tWin.hi} में दूरस्थ यात्रा या स्थान परिवर्तन के प्रमुख योग बनते हैं।`,
      summaryEn: `${config.titleEn}: ${toneEn} indications (score ${score}/100) across houses ${config.houses.join(', ')}.`,
      summaryHi: `${config.titleHi}: भाव ${config.houses.join(', ')} के संकेत ${toneHi} हैं (अंक ${score}/100)।`,
      timingWindowEn: `${tWin.en} (Relocation & long-distance travel window)`,
      timingWindowHi: `${tWin.hi} (प्रवास व लंबी यात्रा सक्रियता काल)`,
      concreteEventsEn: [
        `${tWin.en}: Key window for relocation, overseas assignments, or sacred pilgrimages.`,
        `9th/12th axis (${h9.lord}/${h12.lord}) defines whether travel is temporary or long-term.`,
      ],
      concreteEventsHi: [
        `${tWin.hi}: देशांतर प्रवास, विदेश संपर्क या तीर्थ यात्राओं का मुख्य काल।`,
        `नवम-द्वादश अक्ष (${GRAHA_NAMES_HI[h9.lord] ?? h9.lord}/${GRAHA_NAMES_HI[h12.lord] ?? h12.lord}) यात्रा की अवधि तय करता है।`,
      ],
    };
  }

  if (domainId === 'milestones') {
    const h1 = getHouseLordDesc(chart, 1);
    const h9 = getHouseLordDesc(chart, 9);
    const h10 = getHouseLordDesc(chart, 10);
    const h11 = getHouseLordDesc(chart, 11);
    const m1 = sig.findDashaAges([h1.lord, h9.lord], 'Lagna/9th Lord Dashas', 'लग्नेश/नवमेश महादशा');
    const m2 = sig.findDashaAges([h10.lord, h11.lord], '10th/11th Lord Dashas', 'दशमेश/एकादशेश महादशा');
    const mTest = sig.findDashaAges(['Saturn', 'Rahu', 'Ketu'], 'Saturn/Nodal Maturation', 'शनि/राहु-केतु परिपक्वता');

    return {
      predictionEn: `Life turning points follow your actual Vimshottari Mahadasha sequence across Lagna (${h1.en}), 9th (${h9.en}), 10th (${h10.en}), and 11th (${h11.en}) lords rather than fixed generic ages.${sig.coreCompromised ? ` ⚠️ Note (${sig.coreCompromiseReasonEn}): Milestones reward steady perseverance over sudden shortcuts.` : ''}`,
      predictionHi: `जीवन के प्रमुख मोड़ किसी निश्चित सामान्य आयु के बजाय आपकी वास्तविक विंशोत्तरी महादशा (${h1.hi}, ${h9.hi}, ${h10.hi}, ${h11.hi}) के अनुसार सक्रिय होते हैं।${sig.coreCompromised ? ` ⚠️ (${sig.coreCompromiseReasonHi}): सफलता निरंतर परिश्रम से ही मिलती है।` : ''}`,
      summaryEn: `${config.titleEn}: ${toneEn} indications (score ${score}/100) anchored to real Vimshottari Mahadashas.`,
      summaryHi: `${config.titleHi}: वास्तविक विंशोत्तरी महादशाओं पर आधारित जीवन-मोड़ विश्लेषण (अंक ${score}/100)।`,
      timingWindowEn: `${m1.en} · ${m2.en}`,
      timingWindowHi: `${m1.hi} · ${m2.hi}`,
      concreteEventsEn: [
        `${m1.en}: Identity, fortune & foundational direction milestones.`,
        `${m2.en}: Career authority, income, or institutional recognition milestones.`,
        `${mTest.en}: Karmic testing, restructuring, and Saturn maturation cycles.`,
      ],
      concreteEventsHi: [
        `${m1.hi}: व्यक्तित्व, भाग्योदय व जीवन-दिशा के प्रमुख मोड़।`,
        `${m2.hi}: करियर, पद-प्रतिष्ठा व आय विस्तार का मुख्य काल।`,
        `${mTest.hi}: कर्म-परीक्षा, पुनर्गठन व शनि परिपक्वता चक्र।`,
      ],
    };
  }

  if (domainId === 'remedies') {
    const lagnaLord = SIGNS[chart.ascendant.signIndex]?.lord || 'Mars';
    const ninthLord = SIGNS[(chart.ascendant.signIndex + 8) % 12]?.lord || 'Jupiter';
    const GEM_MAP: Record<string, { hi: string; en: string; metalHi: string; metalEn: string; fingerHi: string; fingerEn: string }> = {
      Sun: { hi: 'माणिक्य (Ruby)', en: 'Ruby', metalHi: 'स्वर्ण या तांबा', metalEn: 'Gold or Copper', fingerHi: 'अनामिका', fingerEn: 'Ring Finger' },
      Moon: { hi: 'मोती (Pearl)', en: 'Pearl', metalHi: 'चांदी', metalEn: 'Silver', fingerHi: 'कनिष्ठिका', fingerEn: 'Little Finger' },
      Mars: { hi: 'मूंगा (Red Coral)', en: 'Red Coral', metalHi: 'तांबा या स्वर्ण', metalEn: 'Copper or Gold', fingerHi: 'अनामिका', fingerEn: 'Ring Finger' },
      Mercury: { hi: 'पन्ना (Emerald)', en: 'Emerald', metalHi: 'स्वर्ण या कांस्य', metalEn: 'Gold or Bronze', fingerHi: 'कनिष्ठिका', fingerEn: 'Little Finger' },
      Jupiter: { hi: 'पुखराज (Yellow Sapphire)', en: 'Yellow Sapphire', metalHi: 'स्वर्ण या पीतल', metalEn: 'Gold or Brass', fingerHi: 'तर्जनी', fingerEn: 'Index Finger' },
      Venus: { hi: 'हीरा / ओपल (Diamond/Opal)', en: 'Diamond or Opal', metalHi: 'चांदी या प्लैटिनम', metalEn: 'Silver or Platinum', fingerHi: 'मध्यमा या अनामिका', fingerEn: 'Middle or Ring Finger' },
      Saturn: { hi: 'नीलम / नीली (Blue Sapphire/Amethyst)', en: 'Blue Sapphire or Amethyst', metalHi: 'पंचधातु या चांदी', metalEn: 'Panchadhatu or Silver', fingerHi: 'मध्यमा', fingerEn: 'Middle Finger' },
    };
    const lagnaGem = GEM_MAP[lagnaLord] || GEM_MAP['Sun'];
    const bhagyaGem = GEM_MAP[ninthLord] || GEM_MAP['Jupiter'];

    return {
      predictionEn: `Classical Upaya protocol focuses on strengthening Lagna lord (${lagnaLord}) and 9th lord (${ninthLord}) while pacifying afflicted axes${sig.coreCompromised ? ` (${sig.coreCompromiseReasonEn})` : ''}: Mantra Japa (108x daily), targeted weekday Daana, and ethical conduct.${sig.coreCompromised ? ' Avoid wearing heavy gemstones blindly without verifying Dusthana/Gandanta lordships.' : ` Traditional stones: ${lagnaGem.en} (Lagna) / ${bhagyaGem.en} (9th) only after chart-specific verification.`}`,
      predictionHi: `शास्त्रीय उपाय लग्नेश (${GRAHA_NAMES_HI[lagnaLord] || lagnaLord}) व नवमेश (${GRAHA_NAMES_HI[ninthLord] || ninthLord}) के बल संवर्धन तथा पीड़ित भावों की शांति पर केंद्रित हैं: नित्य १०८ मंत्र जप, वार-अनुसार दान व सात्विक आचरण।${sig.coreCompromised ? ' गंडांत/नीचस्थ स्थिति में बिना विशेषज्ञ परामर्श भारी रत्न धारण न करें।' : ''}`,
      summaryEn: `${config.titleEn}: Targeted Vedic Mantra, Daana & Lagna-Bhagya remedial protocol.`,
      summaryHi: `${config.titleHi}: लग्नेश-नवमेश आधारित मंत्र, दान व शास्त्रीय उपाय संहिता।`,
      timingWindowEn: 'Lifelong practice (prioritize Mantra & Daana during 6th/8th/12th sub-periods)',
      timingWindowHi: 'आजीवन अनुपालन (६/८/१२ अंतर्दशा में मंत्र व दान विशेष लाभकारी)',
      concreteEventsEn: [
        `Daily 108x Gayatri / Ishta Devata Mantra Japa for mental clarity and karmic shielding.`,
        `Verify Lagna/9th lord dignity before any gemstone (${lagnaGem.en} / ${bhagyaGem.en}).`,
        'Weekly charitable Daana aligned with afflicted or Trik-lord planets.',
      ],
      concreteEventsHi: [
        'प्रतिदिन १०८ बार इष्ट देव या गायत्री मंत्र जप से मानसिक शांति व रक्षा।',
        `रत्न (${lagnaGem.hi} / ${bhagyaGem.hi}) धारण से पूर्व भाव-स्थिति की जांच आवश्यक।`,
        'पीड़ित ग्रहों के वार पर अन्न, वस्त्र या जल का नियमित दान।',
      ],
    };
  }

  // spirituality
  const h9 = getHouseLordDesc(chart, 9);
  const h12 = getHouseLordDesc(chart, 12);
  const jupDesc = getPlanetDesc(chart, 'Jupiter');
  const ketuDesc = getPlanetDesc(chart, 'Ketu');
  const sWin = sig.findDashaAges([h9.lord, h12.lord, 'Jupiter', 'Ketu'], '9th/12th/Jupiter/Ketu Dashas', 'नवमेश/द्वादशेश/गुरु/केतु महादशा');

  return {
    predictionEn: `Spiritual evolution is governed by 9th lord (${h9.en}), 12th lord (${h12.en}), Jupiter (${jupDesc.en}), and Ketu (${ketuDesc.en}).${sig.hasPravrajya ? ' Strong Pravrajya / Moksha alignment fosters deep detachment, philosophical insight, and selfless service.' : ' Grounded ethical conduct and contemplative practice deepen inner serenity.'}`,
    predictionHi: `आध्यात्मिक चेतना का संचालन नवमेश (${h9.hi}), द्वादशेश (${h12.hi}), गुरु (${jupDesc.hi}) एवं केतु (${ketuDesc.hi}) द्वारा होता है।${sig.hasPravrajya ? ' प्रबल प्रव्रज्या/मोक्ष योग गहन वैराग्य व आत्मिक ज्ञान प्रदान करता है।' : ' सदाचार व नियमित साधना से आंतरिक शांति बढ़ती है।'}`,
    summaryEn: `${config.titleEn}: ${toneEn} indications (score ${score}/100) across houses ${config.houses.join(', ')}.`,
    summaryHi: `${config.titleHi}: भाव ${config.houses.join(', ')} के संकेत ${toneHi} हैं (अंक ${score}/100)।`,
    timingWindowEn: `${sWin.en} (Dharma, pilgrimage & spiritual deepening)`,
    timingWindowHi: `${sWin.hi} (धर्म, तीर्थाटन व साधना काल)`,
    concreteEventsEn: [
      `${sWin.en}: Deepening philosophical inquiry, mentorship, or sacred pilgrimage.`,
      sig.hasPravrajya ? 'Strong Moksha/renunciation pull elevates selfless service above material attachment.' : 'Contemplative practice harmonizes worldly duty with inner peace.',
    ],
    concreteEventsHi: [
      `${sWin.hi}: आध्यात्मिक जागृति, गुरु सानिध्य या तीर्थ यात्राओं का मुख्य काल।`,
      sig.hasPravrajya ? 'प्रबल वैराग्य व मोक्ष-प्रवृत्ति भौतिक आसक्ति से ऊपर उठाती है।' : 'सांसारिक कर्तव्यों के साथ आंतरिक शांति का संतुलन।',
    ],
  };
}

function buildDomain(chart: ChartData, config: DomainConfig, classicalYogas: DetectedClassicalYoga[]): DeepDomainPrediction {
  const strengthsEn: string[] = [], strengthsHi: string[] = [], watchoutsEn: string[] = [], watchoutsHi: string[] = [];
  const houseEn: string[] = [], houseHi: string[] = [], yogaEvidence: string[] = [];
  const related = new Set<string>();
  let balance = 0, count = 0;
  for (const house of config.houses) {
    const signIndex = houseSignIndex(chart, house), sign = SIGNS[signIndex];
    const lord = chart.planets.find((p) => p.id === sign.lord);
    const occupants = chart.planets.filter((p) => p.id !== 'Asc' && p.rasiHouseNumber === house);
    const aspects = aspectsHouse(chart, house), sav = chart.ashtakavarga?.sarva?.[signIndex];
    const en: string[] = [], hi: string[] = [];
    let local = 0;
    related.add(String(sign.lord));
    if (lord) {
      const d = dignityPoints(lord.dignity); local += d; count++;
      en.push('lord ' + lord.id + ' in H' + lord.rasiHouseNumber + ' (' + lord.signName + ', ' + lord.dignity + ')');
      hi.push('भावेश ' + lord.id + ' भाव ' + lord.rasiHouseNumber + ' में ' + lord.signName + ' राशि में (' + lord.dignity + ')');
      const lordRole = functionalLordshipEvidence(chart, String(lord.id));
      if (lordRole) {
        local += lordRole.adjustment;
        en.push('house-lord functional roles: ' + lordRole.en);
        hi.push('भावेश का कार्यात्मक स्वामित्व: ' + lordRole.hi);
      }
      if (d > 0) { strengthsEn.push(getOrdinalSuffix(house) + '-house lord ' + lord.id + ' has ' + lord.dignity + ' dignity.'); strengthsHi.push(house + 'वें भावेश ' + lord.id + ' की ' + lord.dignity + ' गरिमा सहायक संकेत है।'); }
      if (d < 0) { watchoutsEn.push(getOrdinalSuffix(house) + '-house lord ' + lord.id + ' has ' + lord.dignity + ' dignity; weigh this with strength and aspects.'); watchoutsHi.push(house + 'वें भावेश ' + lord.id + ' की ' + lord.dignity + ' स्थिति को ग्रहबल और दृष्टियों के साथ तौलें।'); }
      const sb = chart.shadbala?.find((row) => row.planet === lord.id);
      if (sb) {
        local += sb.ratio >= 1.2 ? 1 : sb.ratio < 0.8 ? -1 : 0;
        en.push('Shadbala ' + sb.ratio.toFixed(2) + '×'); hi.push('षड्बल ' + sb.ratio.toFixed(2) + '×');
        if (sb.ratio >= 1.2) { strengthsEn.push(lord.id + ' has above-threshold Shadbala (' + sb.ratio.toFixed(2) + '×).'); strengthsHi.push(lord.id + ' का षड्बल अपेक्षाकृत मजबूत (' + sb.ratio.toFixed(2) + '×) है।'); }
        if (sb.ratio < 0.8) { watchoutsEn.push(lord.id + ' has lower Shadbala (' + sb.ratio.toFixed(2) + '×); sustained effort may be needed.'); watchoutsHi.push(lord.id + ' का षड्बल कम (' + sb.ratio.toFixed(2) + '×) है; निरंतर प्रयास आवश्यक हो सकता है।'); }
      }
      if ([1, 4, 5, 7, 9, 10].includes(lord.rasiHouseNumber)) local += 1;
      if ([6, 8, 12].includes(lord.rasiHouseNumber)) local -= 1;
      if (lord.isCombust) { local -= 1; watchoutsEn.push(lord.id + ', the ' + getOrdinalSuffix(house) + ' lord, is combust.'); watchoutsHi.push(house + 'वें भावेश ' + lord.id + ' अस्त हैं; इसे अन्य बल-सूचकों के साथ तौलें।'); }
      if (lord.isRetrograde && lord.id !== 'Rahu' && lord.id !== 'Ketu') { en.push('retrograde'); hi.push('वक्री'); }
    } else { en.push('lord ' + sign.lord + ' unavailable'); hi.push('भावेश ' + sign.lord + ' का डेटा उपलब्ध नहीं'); }
    if (sav !== undefined) {
      local += sav >= 30 ? 1 : sav <= 24 ? -1 : 0; count++;
      en.push('SAV ' + sav + ' bindus'); hi.push('सर्वाष्टकवर्ग ' + sav + ' बिंदु');
      if (sav >= 30) { strengthsEn.push(getOrdinalSuffix(house) + '-house sign has ' + sav + ' Sarvashtakavarga bindus.'); strengthsHi.push(house + 'वें भाव की राशि में ' + sav + ' सर्वाष्टकवर्ग बिंदु अपेक्षाकृत सहायक हैं।'); }
      if (sav <= 24) { watchoutsEn.push(getOrdinalSuffix(house) + '-house sign has ' + sav + ' Sarvashtakavarga bindus, a lower-support indicator.'); watchoutsHi.push(house + 'वें भाव की राशि में ' + sav + ' सर्वाष्टकवर्ग बिंदु अपेक्षाकृत कम समर्थन दर्शाते हैं।'); }
    }
    if (occupants.length) {
      const occupantEvidence = occupants.map((p) => {
        related.add(String(p.id));
        // Each occupant contributes one dignity observation and, where applicable,
        // one modest functional-lordship modifier. Keep the denominator at the
        // same evidence grain so crowded houses cannot distort the balance.
        const dignity = dignityPoints(p.dignity);
        local += dignity;
        count++;
        if (dignity > 0) {
          strengthsEn.push(p.id + ' occupies house ' + house + ' with ' + p.dignity + ' dignity.');
          strengthsHi.push(p.id + ' भाव ' + house + ' में ' + p.dignity + ' गरिमा के साथ स्थित है।');
        } else if (dignity < 0) {
          watchoutsEn.push(p.id + ' occupies house ' + house + ' with ' + p.dignity + ' dignity; weigh this with its strength and relationships.');
          watchoutsHi.push(p.id + ' भाव ' + house + ' में ' + p.dignity + ' स्थिति में है; इसे ग्रहबल और संबंधों के साथ तौलें।');
        }
        const role = functionalLordshipEvidence(chart, String(p.id));
        if (role) {
          local += role.adjustment;
          count++;
          return role.en;
        }
        return String(p.id) + ' has no assigned classical house lordship in this synthesis';
      });
      en.push('occupants ' + occupants.map((p) => p.id + ' (' + p.dignity + ')').join(', '));
      en.push('occupant functional roles: ' + occupantEvidence.join('; '));
      hi.push('स्थित ग्रह ' + occupants.map((p) => p.id + ' (' + p.dignity + ')').join(', '));
      hi.push('स्थित ग्रहों का कार्यात्मक स्वामित्व: ' + occupants.map((p) => functionalLordshipEvidence(chart, String(p.id))?.hi ?? String(p.id) + ' का पारंपरिक भाव-स्वामित्व नहीं').join('; '));
    } else { en.push('no classical graha occupant'); hi.push('कोई पारंपरिक ग्रह स्थित नहीं'); }
    if (aspects.length) {
      const aspectEvidence = aspects.map((id) => {
        related.add(id);
        const role = functionalLordshipEvidence(chart, id);
        if (role) {
          local += role.adjustment;
          count++;
          return role.en;
        }
        return id + ' has no assigned classical house lordship in this synthesis';
      });
      en.push('graha aspects ' + aspects.join(', '));
      en.push('aspecting planets functional roles: ' + aspectEvidence.join('; '));
      hi.push('ग्रह-दृष्टि ' + aspects.join(', '));
      hi.push('दृष्टि डालने वाले ग्रहों का कार्यात्मक स्वामित्व: ' + aspects.map((id) => functionalLordshipEvidence(chart, id)?.hi ?? id + ' का पारंपरिक भाव-स्वामित्व नहीं').join('; '));
    }
    balance += local;
    houseEn.push('H' + house + ' (' + sign.name + '): ' + en.join('; ') + '.');
    houseHi.push('भाव ' + house + ' (' + sign.name + '): ' + hi.join('; ') + '।');
  }
  for (const id of config.karakas) {
    const p = chart.planets.find((x) => x.id === id);
    if (!p) continue;
    related.add(String(id));
    const d = dignityPoints(p.dignity); balance += d * 0.5; count++;
    if (d > 0) { strengthsEn.push('Natural significator ' + id + ' has ' + p.dignity + ' dignity.'); strengthsHi.push('नैसर्गिक कारक ' + id + ' की ' + p.dignity + ' गरिमा सहायक है।'); }
    if (d < 0) { watchoutsEn.push('Natural significator ' + id + ' has ' + p.dignity + ' dignity.'); watchoutsHi.push('नैसर्गिक कारक ' + id + ' की ' + p.dignity + ' गरिमा पर ध्यान देना चाहिए।'); }
  }
  const varga = chart.divisionalCharts?.[config.varga], vargaEvidence: string[] = [];
  if (varga) for (const id of related) {
    const place = varga.placements.find((p) => p.id === id);
    if (!place) continue;
    vargaEvidence.push(id + ': ' + place.dignity + ', Varga H' + place.houseFromVargaLagna);
    const d = dignityPoints(place.dignity); balance += d * 0.5; count++;
    if (d > 0) { strengthsEn.push(id + ' is ' + place.dignity + ' in ' + config.varga + '.'); strengthsHi.push(id + ' ' + config.varga + ' में ' + place.dignity + ' स्थिति में हैं।'); }
    if (d < 0) { watchoutsEn.push(id + ' is ' + place.dignity + ' in ' + config.varga + '.'); watchoutsHi.push(id + ' की ' + config.varga + ' स्थिति ' + place.dignity + ' है।'); }
  }
  const relatedYogas = chart.yogas.filter((y) => y.planets.some((id) => related.has(id)));
  const relatedClassicalYogas = classicalYogas.filter((y) =>
    y.planets.some((id) => related.has(id)) || y.houses.some((house) => config.houses.includes(house))
  );
  for (const y of relatedClassicalYogas) {
    yogaEvidence.push(y.name + ' (' + y.strength + (y.bhangaStatus ? ', ' + y.bhangaStatus + ' bhanga status' : '') + ')');
    if (y.strength === 'Strong' || y.strength === 'Supreme') {
      strengthsEn.unshift('Classical yoga: ' + y.name + ' (' + y.strength + ').');
      strengthsHi.unshift('शास्त्रीय योग ' + y.nameHi + ' (' + y.strength + ') इस जीवन-क्षेत्र से संबंधित है।');
    }
    if (y.bhangaStatus === 'Bhanga' || y.bhangaStatus === 'Partial') {
      watchoutsEn.push(y.name + ' has ' + y.bhangaStatus.toLowerCase() + ' / reduced manifestation: ' + (y.bhangaReasonEn ?? 'review participating planets and conditions.'));
      watchoutsHi.push(y.nameHi + ' के फल में ' + (y.bhangaStatus === 'Bhanga' ? 'भंग' : 'आंशिक कमी') + ' का संकेत है: ' + (y.bhangaReasonHi ?? 'योग के ग्रहों और शर्तों की पुनः जांच करें।'));
    }
  }
  for (const y of relatedYogas) {
    yogaEvidence.push(y.name + ' (' + y.strength + ')');
    if (y.strength === 'Strong') {
      strengthsEn.unshift('Related yoga: ' + y.name + ' (strong).');
      strengthsHi.unshift('संबंधित योग ' + y.name + ' मजबूत रूप में दर्ज है।');
    }
    // Moderate/Present yogas remain visible as corroborating evidence, but are
    // not counted as supportive outcomes without a strong classification.

  }
  const hasSupport = strengthsEn.length > 0, hasCaution = watchoutsEn.length > 0;
  const toneEn = hasSupport && hasCaution ? 'mixed' : hasSupport ? 'more supportive' : hasCaution ? 'more challenging' : 'insufficient';
  const toneHi = hasSupport && hasCaution ? 'मिले-जुले' : hasSupport ? 'अपेक्षाकृत अनुकूल' : hasCaution ? 'अपेक्षाकृत चुनौतीपूर्ण' : 'अपर्याप्त';

  // Yoga, Gandanta/AK & Bhanga calibration so ratings span Challenging -> Moderate -> Very Good -> Excellent
  const isGandantaLon = (signIdx: number, deg: number) =>
    ([3, 7, 11].includes(signIdx) && deg >= 26.6667) || ([0, 4, 8].includes(signIdx) && deg <= 3.3333);
  const akPlanet = chart.planets.find((p) => p.charaKaraka === 'AK');
  const isAkDeb = akPlanet?.dignity === 'Debilitated';
  const isAkGandanta = Boolean(akPlanet && isGandantaLon(akPlanet.signIndex, akPlanet.degreeInSign));
  const isLagnaSandhi = chart.ascendant.degreeInSign < 1.0 || chart.ascendant.degreeInSign > 29.0;
  const satP = chart.planets.find((p) => p.id === 'Saturn');
  const marP = chart.planets.find((p) => p.id === 'Mars');
  const isSatMarsSame = Boolean(satP && marP && satP.rasiHouseNumber === marP.rasiHouseNumber);
  const coreCompromised = (isAkDeb && (isAkGandanta || isSatMarsSame || isLagnaSandhi)) || (isLagnaSandhi && isSatMarsSame);

  const activeClassicalPts = Math.min(
    18,
    relatedClassicalYogas
      .filter((y) => (y.strength === 'Strong' || y.strength === 'Supreme') && y.bhangaStatus !== 'Bhanga')
      .length * 5
  );
  const activeChartYogaPts = Math.min(
    9,
    relatedYogas.filter((y) => y.strength === 'Strong').length * 3
  );
  const bhangaPenalty = relatedClassicalYogas.filter((y) => y.bhangaStatus === 'Bhanga').length * 4;
  const coreOverridePenalty = coreCompromised ? 16 : (isAkDeb || isAkGandanta) ? 6 : 0;

  if (coreCompromised) {
    watchoutsEn.unshift(`Core Pillar Override: ${isAkDeb ? `Debilitated Atmakaraka (${akPlanet?.id})` : 'Lagna Sandhi'}${isAkGandanta ? ' in Gandanta' : ''} curtails surface yogas.`);
    watchoutsHi.unshift(`मूल स्तंभ अवरोध: ${isAkDeb ? `नीचस्थ आत्मकारक (${akPlanet?.id})` : 'लग्न संधि'}${isAkGandanta ? ' (गंडांत)' : ''} के कारण सतही योगों का फल सीमित होता है।`);
  }

  const rawScore = 50 + (count ? (balance / count) * 28 : 0) + activeClassicalPts + activeChartYogaPts - bhangaPenalty - coreOverridePenalty;
  const uncappedScore = Math.max(20, Math.min(95, Math.round(rawScore)));
  const score = coreCompromised ? Math.min(uncappedScore, 40) : uncappedScore;
  const ratingEn: DeepDomainPrediction['ratingEn'] =
    score >= 76 ? 'Excellent' : score >= 60 ? 'Very Good' : score <= 42 ? 'Challenging' : 'Moderate';
  const ratingHi: DeepDomainPrediction['ratingHi'] =
    score >= 76 ? 'अति उत्तम' : score >= 60 ? 'उत्तम' : score <= 42 ? 'चुनौतीपूर्ण' : 'मध्यम';
  const factorsEn = houseEn.join(' ') + ' Karakas: ' + config.karakas.join(', ') + '. ' + config.varga + ': ' + (vargaEvidence.length ? vargaEvidence.join('; ') : 'relevant placements unavailable') + '. Related yogas: ' + (yogaEvidence.length ? yogaEvidence.join('; ') : 'none identified in supplied yoga data') + '.';
  const factorsHi = houseHi.join(' ') + ' कारक ग्रह: ' + config.karakas.join(', ') + '। ' + config.varga + ': ' + (vargaEvidence.length ? vargaEvidence.join('; ') : 'संबंधित स्थिति उपलब्ध नहीं') + '। संबंधित योग: ' + (yogaEvidence.length ? yogaEvidence.join('; ') : 'प्रदत्त योग-डेटा में कोई संबंधित योग दर्ज नहीं') + '।';

  const classicalSynth = synthesizeDeepClassicalDomainPrediction(
    chart,
    config.id,
    config,
    score,
    toneEn,
    toneHi,
    strengthsEn,
    strengthsHi,
    watchoutsEn,
    watchoutsHi,
    classicalYogas
  );

  return {
    id: config.id, titleEn: config.titleEn, titleHi: config.titleHi, icon: config.icon, score, ratingEn, ratingHi,
    summaryEn: classicalSynth.summaryEn,
    summaryHi: classicalSynth.summaryHi,
    predictionEn: classicalSynth.predictionEn,
    predictionHi: classicalSynth.predictionHi,
    timingWindowEn: classicalSynth.timingWindowEn,
    timingWindowHi: classicalSynth.timingWindowHi,
    concreteEventsEn: classicalSynth.concreteEventsEn,
    concreteEventsHi: classicalSynth.concreteEventsHi,
    keyStrengthsEn: strengthsEn.length ? [...new Set(strengthsEn)].slice(0, 6) : ['No clearly supportive factor was established from the supplied chart data.'],
    keyStrengthsHi: strengthsHi.length ? [...new Set(strengthsHi)].slice(0, 6) : ['प्रदत्त कुंडली-डेटा से कोई स्पष्ट अनुकूल कारक स्थापित नहीं हुआ।'],
    watchoutsEn: watchoutsEn.length ? [...new Set(watchoutsEn)].slice(0, 6) : ['No prominent challenging factor appears among the assessed indicators.'],
    watchoutsHi: watchoutsHi.length ? [...new Set(watchoutsHi)].slice(0, 6) : ['जाँचे गए संकेतों में कोई प्रमुख चुनौतीपूर्ण कारक सामने नहीं आया।'],
    astrologicalFactorsEn: factorsEn, astrologicalFactorsHi: factorsHi,
    classicalAdviceEn: config.adviceEn, classicalAdviceHi: config.adviceHi,
  };
}


function interpretBirthFactor(
  id: string,
  valueEn: string,
  valueHi: string,
  chart: ChartData
): { en: string; hi: string } {
  const weekday = chart.panchang?.vara;
  const tithi = chart.panchang?.tithi;
  const sun = chart.planets.find((p) => p.id === 'Sun');
  const moon = chart.planets.find((p) => p.id === 'Moon');

  switch (id) {
    case 'weekday': {
      const lord = weekday?.lord ?? '';
      const varaProf = CLASSICAL_VARA_PROFILES[lord];
      if (varaProf) {
        return {
          en: `${varaProf.nameEn}: ${varaProf.psychologicalTraitsEn} Ambition & Work: ${varaProf.workAndAmbitionEn} Relationship dynamic: ${varaProf.relationshipNatureEn} Ruling planet: ${varaProf.rulingPlanet}.`,
          hi: `${varaProf.nameHi}: ${varaProf.psychologicalTraitsHi} कार्य व महत्वाकांक्षा: ${varaProf.workAndAmbitionHi} संबंध स्वभाव: ${varaProf.relationshipNatureHi} स्वामी ग्रह: ${varaProf.rulingPlanetHi}।`,
        };
      }
      return {
        en: `Born on ${valueEn}. Reflects planetary qualities of ${weekday?.lord ?? 'the day lord'}, shaping core drive and social role.`,
        hi: `${valueHi} का जन्म। यह वार स्वामी (${weekday?.sanskrit ?? 'वार स्वामी'}) के प्रभाव से जातक की कार्यशैली व स्वभाव का निर्धारण करता है।`,
      };
    }

    case 'tithi': {
      const tNum = Math.max(1, Math.min(15, tithi?.number ?? 1));
      const tProf = CLASSICAL_TITHI_PROFILES[tNum];
      const isShukla = tithi?.paksha === 'Shukla';
      const isPurnima = tNum === 15 && isShukla;
      const isAmavasya = tNum === 15 && !isShukla;
      const yogaRes = getTithiVaraYoga(tNum, weekday?.lord ?? '');

      if (tProf) {
        const titleEn = isPurnima ? 'Purnima (15th Shukla Tithi)' : isAmavasya ? 'Amavasya (15th Krishna Tithi)' : tProf.nameEn;
        const titleHi = isPurnima ? 'पूर्णिमा (१५वीं शुक्ल तिथि)' : isAmavasya ? 'अमावस्या (१५वीं कृष्ण तिथि)' : tProf.nameHi;
        const deityEn = isPurnima ? 'Chandra Deva & Goddess Lakshmi' : isAmavasya ? 'Pitrus & Lord Shani' : tProf.presidingDeityEn;
        const deityHi = isPurnima ? 'चंद्र देव एवं महालक्ष्मी' : isAmavasya ? 'पितृगण एवं शनि देव' : tProf.presidingDeityHi;
        const nityaEn = isPurnima ? 'Shodashi / Maha Nitya' : isAmavasya ? 'Chitra Nitya Devi' : tProf.governingNityaDeviEn;
        const nityaHi = isPurnima ? 'षोडशी / महानित्या' : isAmavasya ? 'चित्रा नित्या देवी' : tProf.governingNityaDeviHi;

        return {
          en: `${titleEn} [${tProf.category} Category - ${tProf.categorySignificanceEn}]: Presiding Deity: ${deityEn}; Governing Nitya Devi: ${nityaEn}. Classical Indication: ${tProf.classicalResultEn} Propitious activities: ${tProf.propitiousWorkEn}. Combination: ${yogaRes.combinationTitleEn} (${yogaRes.detailsEn}).`,
          hi: `${titleHi} [${tProf.categoryHi} वर्ग - ${tProf.categorySignificanceHi}]: अधिष्ठाता देव: ${deityHi}; अधिष्ठात्री नित्या देवी: ${nityaHi}। शास्त्रीय फलकथन: ${tProf.classicalResultHi} शुभ कार्य: ${tProf.propitiousWorkHi}। संयोग: ${yogaRes.combinationTitleHi} (${yogaRes.detailsHi})।`,
        };
      }
      return {
        en: `Tithi ${valueEn}: Governs vital lunar vitality, mental disposition, and timing of auspicious actions.`,
        hi: `तिथि ${valueHi}: चंद्र-कलाओं पर आधारित मानसिक स्थिति, आत्मबल और मांगलिक कार्यों की शुभता का निर्धारण करती है।`,
      };
    }

    case 'paksha': {
      const isShukla = tithi?.paksha === 'Shukla';
      if (isShukla) {
        return {
          en: 'Shukla Paksha (Bright Fortnight): Waxing lunar digits endow the native with flourishing progeny, wealth, righteous conduct, benevolence, and natural ascent in public esteem.',
          hi: 'शुक्ल पक्ष (शुक्ल पक्षीय जन्म): वर्धमान चंद्र किरणों के प्रभाव से जातक संतान-सुख, प्रचुर धन, धार्मिक रुचि, दया, उदारता और समाज में निरंतर यश व प्रगति प्राप्त करता है।',
        };
      }
      return {
        en: 'Krishna Paksha (Dark Fortnight): Deeply devoted to mother, pragmatic worldly karma, tenacious debater for self-advancement, building strength through perseverance and overcoming early hurdles.',
        hi: 'कृष्ण पक्ष (कृष्ण पक्षीय जन्म): माता के प्रति अनन्य भक्ति, व्यावहारिक कर्मठता, स्वावलंबन हेतु तार्किक दृढ़ता तथा आरंभिक चुनौतियों को पार कर अडिग सफलता पाने का सामर्थ्य।',
      };
    }

    case 'maas': {
      // Find clean maas name
      const cleanMaas = valueEn.replace('Adhika ', '').trim();
      const maasProf = CLASSICAL_LUNAR_MAAS_PROFILES[cleanMaas];
      const isAdhika = valueEn.startsWith('Adhika');
      const adhikaEn = isAdhika ? ' [Adhika Maas (Purushottama Maas): Sacred astronomical synchronization balancing solar and lunar cycles, extraordinarily auspicious for spiritual merit.]' : '';
      const adhikaHi = isAdhika ? ' [अधिक मास (पुरुषोत्तम मास): सौर व चांद्र वर्ष के सामंजस्य का पावन मास, जो आध्यात्मिक उत्थान व दान-पुण्य हेतु परम फलदायी है।]' : '';

      if (maasProf) {
        return {
          en: `${valueEn} (Sun in ${maasProf.sunSignEn}): ${maasProf.shastricResultEn}${adhikaEn}`,
          hi: `${valueHi} (सूर्य ${maasProf.sunSignHi} में): ${maasProf.shastricResultHi}${adhikaHi}`,
        };
      }
      return {
        en: `Lunar Month ${valueEn}: Marks seasonal solar-lunar alignment and societal inclination.`,
        hi: `चांद्र मास ${valueHi}: सौर-चांद्र संवत्सर के प्रभाव से जीवन की प्राथमिक प्रवृत्तियों को दिशा देता है।`,
      };
    }

    case 'ritu': {
      const cleanRitu = valueEn.split(' ')[0] ?? 'Vasanta';
      const rituProf = CLASSICAL_RITU_PROFILES[cleanRitu] ?? CLASSICAL_RITU_PROFILES['Vasanta'];
      return {
        en: `${rituProf.nameEn} (Lunar Months: ${rituProf.lunarMonthsEn}): ${rituProf.temperamentEn}`,
        hi: `${rituProf.nameHi} (${rituProf.lunarMonthsHi}): ${rituProf.temperamentHi}`,
      };
    }

    case 'prahar': {
      let kaalKey = 'Madhyahna';
      const sunHouse = sun?.rasiHouseNumber ?? 1;
      if (sunHouse === 12 || sunHouse === 1 || sunHouse === 2) kaalKey = 'Ushakaal';
      else if (sunHouse === 11 || sunHouse === 10) kaalKey = 'Pratushakaal';
      else if (sunHouse === 9 || sunHouse === 8) kaalKey = 'Madhyahna';
      else if (sunHouse === 7 || sunHouse === 6) kaalKey = 'Sayamkaal';
      else kaalKey = 'RatriKaal';

      const kaalProf = CLASSICAL_KAAL_PROFILES[kaalKey] ?? CLASSICAL_KAAL_PROFILES['Madhyahna'];
      return {
        en: `${valueEn} · ${kaalProf.nameEn} (Diurnal Phase): ${kaalProf.natureEn} Solar alignment in ${kaalProf.sunHousePosition}.`,
        hi: `${valueHi} · ${kaalProf.nameHi}: ${kaalProf.natureHi} सूर्य की भाव-स्थिति (${kaalProf.sunHousePosition})।`,
      };
    }

    case 'karana': {
      const karanaName = chart.panchang?.karana?.name ?? valueEn.split(' ')[0] ?? 'Bava';
      const kProf = CLASSICAL_KARANAS[karanaName];
      if (kProf) {
        return {
          en: `Karana ${kProf.nameEn} [${kProf.natureEn}]: ${kProf.classicalResultEn}`,
          hi: `करण ${kProf.nameHi} [${kProf.natureHi}]: ${kProf.classicalResultHi}`,
        };
      }
      return {
        en: `Karana ${valueEn}: Defines executive rhythm and immediate capacity to take decisive actions.`,
        hi: `करण ${valueHi}: कार्य-संपादन क्षमता, तात्कालिक निर्णय-शक्ति और पुरुषार्थ का प्रतीक है।`,
      };
    }

    case 'surya-yoga': {
      const yogaNum = chart.panchang?.yoga?.number ?? 1;
      const yProf = CLASSICAL_NITYA_YOGAS[yogaNum];
      if (yProf) {
        return {
          en: `Nitya Yoga ${yProf.nameEn} [${yProf.natureEn}]: ${yProf.classicalResultEn}`,
          hi: `नित्य योग ${yProf.nameHi} [${yProf.natureHi}]: ${yProf.classicalResultHi}`,
        };
      }
      return {
        en: `Surya-Chandra Yoga ${valueEn}: Shows harmonized coordination between vital consciousness and mind.`,
        hi: `सूर्य-चंद्र नित्य योग ${valueHi}: आत्मबल और मनोबल के पारस्परिक सामंजस्य का शास्त्रीय संकेत है।`,
      };
    }

    case 'nakshatra-charan': {
      const nakIndex = chart.panchang?.nakshatra?.index ?? moon?.nakshatraIndex ?? 0;
      const padaNum = Math.max(1, Math.min(4, chart.panchang?.nakshatra?.pada ?? moon?.pada ?? 1));
      const padaDetail = getPadaDetail(nakIndex, padaNum);
      const nakProf = CLASSICAL_NAKSHATRAS[nakIndex];
      const amsaDescEn = padaDetail ? ` [Amsa: ${padaDetail.amsaName} in ${padaDetail.navamshaSignEn} Navamsha · Element: ${padaDetail.element} · Aim: ${padaDetail.purushartha} - ${padaDetail.amsaSignificanceEn}]` : '';
      const amsaDescHi = padaDetail ? ` [अंश नाम: ${padaDetail.amsaName} (${padaDetail.navamshaSignHi} नवांश) · तत्त्व: ${padaDetail.elementHi} · पुरुषार्थ: ${padaDetail.purusharthaHi} - ${padaDetail.amsaSignificanceHi}]` : '';

      if (nakProf) {
        return {
          en: `${valueEn}${amsaDescEn}: Appearance: ${nakProf.physicalFeaturesEn} Personality: ${nakProf.psychologicalTraitsEn}${nakProf.lifeTrajectoryEn ? ` Life Trajectory: ${nakProf.lifeTrajectoryEn}` : ''}`,
          hi: `${valueHi}${amsaDescHi}: शारीरिक लक्षण: ${nakProf.physicalFeaturesHi} व्यक्तित्व: ${nakProf.psychologicalTraitsHi}${nakProf.lifeTrajectoryHi ? ` जीवन-दिशा: ${nakProf.lifeTrajectoryHi}` : ''}`,
        };
      }
      return {
        en: `Nakshatra Pada ${valueEn}${amsaDescEn}: Refines subconscious motivation and builds the D9 Navamsha degree.`,
        hi: `नक्षत्र चरण ${valueHi}${amsaDescHi}: मानसिक प्रेरणा और D9 नवांश की स्थिति का सूक्ष्म निर्धारण करता है।`,
      };
    }

    case 'varna': {
      const vProf = getVarnaProfile(valueEn);
      return {
        en: `${vProf.nameEn} [${vProf.moonSignsEn}]: ${vProf.archetypeEn}. Key Qualities: ${vProf.keyQualitiesEn.join('; ')}. Worldview: ${vProf.worldviewEn}`,
        hi: `${vProf.nameHi} [${vProf.moonSignsHi}]: ${vProf.archetypeHi}। मुख्य गुण: ${vProf.keyQualitiesHi.join('; ')}। जीवन-दृष्टिकोण: ${vProf.worldviewHi}`,
      };
    }

    case 'vashya':
      return {
        en: `Vashya (${valueEn}): Classical indicator of mutual influence, social adaptability, and magnetic relationship resonance.`,
        hi: `वश्य (${valueHi}): सामाजिक अनुकूलता, प्रभावशीलता और संबंधों में पारस्परिक आकर्षण का शास्त्रीय सूचक है।`,
      };

    case 'yoni': {
      const yProf = getYoniProfile(valueEn);
      return {
        en: `${yProf.animalEn}: ${yProf.personaEn} Relationship Style: ${yProf.relationshipStyleEn} Instinctive Traits: ${yProf.instinctiveTraitsEn.join(', ')}.`,
        hi: `${yProf.animalHi}: ${yProf.personaHi} दांपत्य व संबंध: ${yProf.relationshipStyleHi} मूल जैविक प्रवृत्तियां: ${yProf.instinctiveTraitsHi.join(', ')}।`,
      };
    }

    case 'gana': {
      const gProf = getGanaProfile(valueEn);
      return {
        en: `${gProf.nameEn}: ${gProf.natureEn}. Key Traits: ${gProf.keyTraitsEn.join('; ')}. Worldview: ${gProf.worldviewEn} Challenges to Watch: ${gProf.challengesEn.join('; ')}.`,
        hi: `${gProf.nameHi}: ${gProf.natureHi}। मुख्य लक्षण: ${gProf.keyTraitsHi.join('; ')}। जीवन-दृष्टिकोण: ${gProf.worldviewHi} ध्यान देने योग्य चुनौतियां: ${gProf.challengesHi.join('; ')}।`,
      };
    }

    case 'nadi': {
      const nProf = getNadiProfile(valueEn);
      return {
        en: `${nProf.nameEn} [Dosha: ${nProf.ayurvedicDoshaEn} · Energy Flow: ${nProf.energyFlowEn}]: ${nProf.coreNatureEn}. Marriage Impact: ${nProf.marriageImpactEn} Health Vulnerabilities: ${nProf.associatedDiseasesEn.join('; ')}.`,
        hi: `${nProf.nameHi} [दोष: ${nProf.ayurvedicDoshaHi} · ऊर्जा प्रवाह: ${nProf.energyFlowHi}]: ${nProf.coreNatureHi}। दांपत्य प्रभाव: ${nProf.marriageImpactHi} स्वास्थ्य संवेदनशीलता: ${nProf.associatedDiseasesHi.join('; ')}।`,
      };
    }

    case 'nadi-pad':
      return {
        en: `Nadi Pada (${valueEn}): Quarter-based refinement of physical constitution and micro-timing of constitutional health.`,
        hi: `नाड़ी पाद (${valueHi}): शारीरिक धातु-पुष्टि और स्वास्थ्य प्रवृत्तियों का सूक्ष्म शास्त्रीय संकेत है।`,
      };

    case 'tattva': {
      const birthMs = chart.utcMs;
      const sunriseMs = chart.panchang?.sunriseUtc ? Date.parse(chart.panchang.sunriseUtc) : NaN;
      const weekdayLord = chart.panchang?.vara?.lord ?? chart.panchang?.vara?.name ?? 'Sun';
      if (Number.isFinite(sunriseMs)) {
        const tRes = calculateBirthTimeTatwa(birthMs, sunriseMs, weekdayLord);
        return {
          en: `Birth Time Tatwa: ${tRes.nameEn} [${tRes.cycle} Cycle #${tRes.cycleNumber}, ${tRes.durationMinutes} min block, ruled by ${tRes.governingPlanetsEn}]. Core Drive: ${tRes.coreDesiresEn} Health & Susceptibilities: ${tRes.healthVulnerabilitiesEn} Astrological Warning: ${tRes.planetaryAfflictionsEn}`,
          hi: `जन्म समय पंचमहाभूत तत्त्व: ${tRes.nameHi} [${tRes.cycleHi} चक्र क्रम ${tRes.cycleNumber}, अवधि ${tRes.durationMinutes} मिनट, स्वामी: ${tRes.governingPlanetsHi}]। मूल चेतना व अभिलाषा: ${tRes.coreDesiresHi} स्वास्थ्य व अंग-संवेदनशीलता: ${tRes.healthVulnerabilitiesHi} शास्त्रीय चेतावनी: ${tRes.planetaryAfflictionsHi}`,
        };
      }
      return {
        en: `Tatva (${valueEn}): Elemental foundation of the psyche—Fire gives bold action, Earth gives steadfast pragmatism, Air gives intellectual agility, Water gives intuitive empathy.`,
        hi: `तत्त्व (${valueHi}): मानसिक चेतना का मूल तत्त्व—अग्नि पराक्रम देती है, पृथ्वी स्थिरता, वायु बौद्धिक संवेदनशीलता, और जल सहज अंतर्दृष्टि।`,
      };
    }

    case 'paya': {
      const mHouse = moon?.rasiHouseNumber ?? (moon ? ((moon.signIndex - chart.ascendant.signIndex + 12) % 12) + 1 : 1);
      const payaKey = mHouse === 1 || mHouse === 6 || mHouse === 11 ? 'gold' : mHouse === 2 || mHouse === 5 || mHouse === 9 ? 'silver' : mHouse === 3 || mHouse === 7 || mHouse === 10 ? 'copper' : 'iron';
      const payaProf = CLASSICAL_PAYA_PROFILES[payaKey];
      if (payaProf) {
        return {
          en: `${payaProf.nameEn} [${payaProf.metalEn} · ${payaProf.governingPlanetEn}]: ${payaProf.coreBlessingEn} Real Life: ${payaProf.realLifeManifestationEn} Sade Sati Armor: ${payaProf.sadeSatiExperienceEn} (Builds: ${payaProf.sadeSatiBuildsEn}). Crystals: ${payaProf.crystalsEn.join(', ')}.`,
          hi: `${payaProf.nameHi} [${payaProf.metalHi} · ${payaProf.governingPlanetHi}]: ${payaProf.coreBlessingHi} वास्तविक स्वरूप: ${payaProf.realLifeManifestationHi} साढ़ेसाती कवच: ${payaProf.sadeSatiExperienceHi} (फल: ${payaProf.sadeSatiBuildsHi})। रत्न/क्रिस्टल: ${payaProf.crystalsHi.join(', ')}।`,
        };
      }
      return {
        en: `Paya (${valueEn}): Classical indicator of baseline biological vitality, childhood environment, and energetic armor.`,
        hi: `पाया (${valueHi}): जीवनारंभ की परिस्थितियों, शारीरिक ऊर्जा और साढ़ेसाती के प्रभाव-कवच का मुख्य शास्त्रीय आधार है।`,
      };
    }

    case 'naam-akshar':
      return {
        en: `Birth Syllable (${valueEn}): Assigned from the Nakshatra Pada, activating the sacred sonic vibration for personal naming and vitality.`,
        hi: `जन्माक्षर (${valueHi}): नक्षत्र चरण से निर्धारित मंगल ध्वनि, जो नामकरण और आत्मिक आभा को बल प्रदान करती है।`,
      };

    case 'atmakaraka': {
      const karakasList = computeCharaKarakas(chart);
      const soulPlanet = karakasList.find((k) => k.role === 'AK')?.planet ?? 'Sun';
      const akProf = getAtmakarakaProfile(soulPlanet);
      return {
        en: `${valueEn} is the Jaimini Atmakaraka (King of the Chart & Soul Indicator). Archetype: ${akProf.soulArchetypeEn} Karmic Challenge: ${akProf.karmicChallengeEn} Soul Lesson: ${akProf.soulLessonEn} Karakamsa Alignment: ${akProf.karakamsaYogasEn}`,
        hi: `${valueHi} जैमिनी आत्मकारक (कुंडली का सम्राट व आत्मिक संकेतक) है। मूल स्वरूप: ${akProf.soulArchetypeHi} कर्म-चुनौती: ${akProf.karmicChallengeHi} आत्म-संस्कार: ${akProf.soulLessonHi} कारकांश प्रभाव: ${akProf.karakamsaYogasHi}`,
      };
    }

    case 'ishta-dev':
      return {
        en: `${valueEn} is the Ishta Devata derived from the 12th from Karakamsha in Navamsha (D9), serving as the supreme focus for personal meditation and divine protection.`,
        hi: `${valueHi} नवांश (D9) में कारकांश से १२वें भाव से प्राप्त इष्ट देव हैं, जो व्यक्तिगत साधना, मानसिक शांति और दैवीय संबल के सर्वोच्च केंद्र हैं।`,
      };

    default:
      return {
        en: `${valueEn} is a traditional birth foundation factor providing classical perspective on constitutional strengths.`,
        hi: `${valueHi} एक पारंपरिक जन्म कारक है, जो जातक की शास्त्रीय प्रवृत्तियों को स्पष्ट करता है।`,
      };
  }
}

const NAKSHATRA_NAME_AKSHAR: string[][] = [
  ['चू', 'चे', 'चो', 'ला'], ['ली', 'लू', 'ले', 'लो'], ['अ', 'ई', 'उ', 'ए'],
  ['ओ', 'वा', 'वी', 'वू'], ['वे', 'वो', 'का', 'की'], ['कू', 'घ', 'ङ', 'छ'],
  ['के', 'को', 'हा', 'ही'], ['हू', 'हे', 'हो', 'डा'], ['डी', 'डू', 'डे', 'डो'],
  ['मा', 'मी', 'मू', 'मे'], ['मो', 'टा', 'टी', 'टू'], ['टे', 'टो', 'पा', 'पी'],
  ['पू', 'ष', 'ण', 'ठ'], ['पे', 'पो', 'रा', 'री'], ['रू', 'रे', 'रो', 'ता'],
  ['ती', 'तू', 'ते', 'तो'], ['ना', 'नी', 'नू', 'ने'], ['नो', 'या', 'यी', 'यू'],
  ['ये', 'यो', 'भा', 'भी'], ['भू', 'धा', 'फा', 'ढा'], ['भे', 'भो', 'जा', 'जी'],
  ['खी', 'खू', 'खे', 'खो'], ['गा', 'गी', 'गू', 'गे'], ['गो', 'सा', 'सी', 'सू'],
  ['से', 'सो', 'दा', 'दी'], ['दू', 'थ', 'झ', 'ञ'], ['दे', 'दो', 'चा', 'ची'],
];
const PLANET_ISHTA_DEVATA: Record<string, string> = {
  Sun: 'Shiva', Moon: 'Gauri / Parvati', Mars: 'Skanda / Kartikeya',
  Mercury: 'Vishnu', Jupiter: 'Narayana', Venus: 'Lakshmi',
  Saturn: 'Hanuman / Brahma', Rahu: 'Durga', Ketu: 'Ganesha',
};
function normalize360(value: number): number { return ((value % 360) + 360) % 360; }
function buildGeneralBirthProfile(chart: ChartData): GeneralBirthProfile {
  const moon = chart.planets.find((p) => p.id === 'Moon');
  const sun = chart.planets.find((p) => p.id === 'Sun');
  const moonSign = moon ? SIGNS[moon.signIndex] : undefined;
  const nak = chart.panchang?.nakshatra;
  const pada = Math.max(1, Math.min(4, nak?.pada ?? moon?.pada ?? 1));
  const nakInfo = nak ? NAKSHATRAS[nak.index] : moon ? NAKSHATRAS[moon.nakshatraIndex] : undefined;
  const moonHouse = moon?.rasiHouseNumber ?? (moon ? ((moon.signIndex - chart.ascendant.signIndex + 12) % 12) + 1 : 0);
  const paya = moonHouse === 1 || moonHouse === 6 || moonHouse === 11
    ? ['Swarna Paya', 'स्वर्ण पाया']
    : moonHouse === 2 || moonHouse === 5 || moonHouse === 9
      ? ['Rajat Paya', 'रजत पाया']
      : moonHouse === 3 || moonHouse === 7 || moonHouse === 10
        ? ['Tamra Paya', 'ताम्र पाया']
        : ['Loha Paya', 'लौह पाया'];

  // Amanta lunar month is named from the Sun's sign at the month's full moon.
  // Estimate the full-moon instant from the current Sun-Moon elongation and daily speeds.
  const relativeSpeed = (moon?.speedDegPerDay ?? 13) - (sun?.speedDegPerDay ?? 1);
  const elongation = moon && sun ? normalize360(moon.longitude - sun.longitude) : 0;
  const fullMoonDelta = relativeSpeed > 0
    ? (elongation <= 180 ? (180 - elongation) : -(elongation - 180)) / relativeSpeed
    : 0;
  const fullMoonSunLongitude = sun ? normalize360(sun.longitude + sun.speedDegPerDay * fullMoonDelta) : 0;
  const fullMoonSunSign = Math.floor(fullMoonSunLongitude / 30);
  const lunarMonths = ['Chaitra', 'Vaishakha', 'Jyeshtha', 'Ashadha', 'Shravana', 'Bhadrapada', 'Ashwin', 'Kartika', 'Margashirsha', 'Pausha', 'Magha', 'Phalguna'];
  const lunarMonth = lunarMonths[fullMoonSunSign] ?? 'Not available';
  const elapsedSinceNewMoon = relativeSpeed > 0 ? elongation / relativeSpeed : 0;
  const untilNextNewMoon = relativeSpeed > 0 ? (360 - elongation) / relativeSpeed : 0;
  const previousNewMoonSun = sun ? normalize360(sun.longitude - sun.speedDegPerDay * elapsedSinceNewMoon) : 0;
  const nextNewMoonSun = sun ? normalize360(sun.longitude + sun.speedDegPerDay * untilNextNewMoon) : 0;
  const isAdhika = Math.floor(previousNewMoonSun / 30) === Math.floor(nextNewMoonSun / 30);
  const monthName = (isAdhika ? 'Adhika ' : '') + lunarMonth;
  const rituNames = ['Vasanta (वसंत)', 'Grishma (ग्रीष्म)', 'Varsha (वर्षा)', 'Sharad (शरद)', 'Hemanta (हेमंत)', 'Shishira (शिशिर)'];
  const rituIndex = Math.floor((fullMoonSunSign % 12) / 2);
  const ritu = rituNames[rituIndex];

  let prahar = 'Not available';
  let praharHi = 'उपलब्ध नहीं';
  const birthMs = chart.utcMs;
  const sunriseMs = chart.panchang?.sunriseUtc ? Date.parse(chart.panchang.sunriseUtc) : NaN;
  const sunsetMs = chart.panchang?.sunsetUtc ? Date.parse(chart.panchang.sunsetUtc) : NaN;
  const nextSunriseMs = chart.panchang?.nextSunriseUtc ? Date.parse(chart.panchang.nextSunriseUtc) : NaN;
  if (Number.isFinite(sunriseMs) && Number.isFinite(sunsetMs) && Number.isFinite(nextSunriseMs)) {
    if (birthMs >= sunriseMs && birthMs < sunsetMs && sunsetMs > sunriseMs) {
      const part = Math.min(3, Math.floor(((birthMs - sunriseMs) / (sunsetMs - sunriseMs)) * 4));
      prahar = `Day Prahar ${part + 1}`;
      praharHi = `दिन का ${part + 1}वाँ प्रहर`;
    } else if (birthMs >= sunsetMs && birthMs < nextSunriseMs && nextSunriseMs > sunsetMs) {
      const part = Math.min(3, Math.floor(((birthMs - sunsetMs) / (nextSunriseMs - sunsetMs)) * 4));
      prahar = `Night Prahar ${part + 1}`;
      praharHi = `रात्रि का ${part + 1}वाँ प्रहर`;
    }
  }

  const karakas = computeCharaKarakas(chart);
  const ak = karakas.find((k) => k.role === 'AK');
  const d9 = chart.divisionalCharts?.D9;
  const akD9 = ak ? d9?.placements.find((p) => p.id === ak.planet) : undefined;
  const karakamshaSign = akD9?.signIndex;
  const ishtaSign = karakamshaSign === undefined ? undefined : (karakamshaSign + 11) % 12;
  const d9Occupants = ishtaSign === undefined ? [] : d9?.placements.filter((p) => p.id !== 'Asc' && p.signIndex === ishtaSign) ?? [];
  const ishtaPlanets = d9Occupants.length
    ? d9Occupants.map((p) => String(p.id))
    : ishtaSign === undefined ? [] : [SIGNS[ishtaSign].lord];
  const ishtaNames = [...new Set(ishtaPlanets.map((p) => PLANET_ISHTA_DEVATA[p] ?? p))];
  const ishtaMethod = d9Occupants.length ? '12th from Karakamsha (D9 occupant)' : '12th-house lord from Karakamsha (D9 fallback)';
  const ishtaHi = d9Occupants.length ? 'कारकांश से 12वें नवांश में स्थित ग्रह के आधार पर' : 'कारकांश से 12वें नवांश के स्वामी के आधार पर';

  const weekday = chart.panchang?.vara;
  const tithi = chart.panchang?.tithi;
  const yoga = chart.panchang?.yoga;
  const karana = chart.panchang?.karana;
  const factors: Omit<GeneralBirthFactor, 'interpretationEn' | 'interpretationHi'>[] = [
    { id: 'weekday', labelEn: 'Weekday / Vaar', labelHi: 'वार', valueEn: weekday ? `${weekday.name} (${weekday.lord})` : 'Not available', valueHi: weekday ? `${weekday.sanskrit} (${weekday.lord})` : 'उपलब्ध नहीं' },
    { id: 'tithi', labelEn: 'Tithi', labelHi: 'तिथि', valueEn: tithi ? `${tithi.name} (Tithi ${tithi.number})` : 'Not available', valueHi: tithi ? `${tithi.name} (${tithi.number})` : 'उपलब्ध नहीं' },
    { id: 'paksha', labelEn: 'Paksha', labelHi: 'पक्ष', valueEn: tithi?.paksha ?? 'Not available', valueHi: tithi?.paksha === 'Shukla' ? 'शुक्ल पक्ष' : tithi?.paksha === 'Krishna' ? 'कृष्ण पक्ष' : 'उपलब्ध नहीं' },
    { id: 'maas', labelEn: 'Maas (Amanta)', labelHi: 'मास (अमान्त)', valueEn: monthName, valueHi: (isAdhika ? 'अधिक ' : '') + lunarMonth },
    { id: 'ritu', labelEn: 'Ritu', labelHi: 'ऋतु', valueEn: ritu, valueHi: ritu.split(' (')[1]?.replace(')', '') ?? ritu },
    { id: 'prahar', labelEn: 'Prahar (Day / Night)', labelHi: 'प्रहर (दिन / रात्रि)', valueEn: prahar, valueHi: praharHi },
    { id: 'karana', labelEn: 'Karana', labelHi: 'करण', valueEn: karana ? `${karana.name} (${karana.type})` : 'Not available', valueHi: karana ? karana.name : 'उपलब्ध नहीं' },
    { id: 'surya-yoga', labelEn: 'Surya Siddhanta Yoga (Nitya Yoga)', labelHi: 'सूर्य सिद्धांत योग (नित्य योग)', valueEn: yoga ? `${yoga.name} (#${yoga.number})` : 'Not available', valueHi: yoga ? `${yoga.name} (योग ${yoga.number})` : 'उपलब्ध नहीं' },
    { id: 'varna', labelEn: 'Varna (Moon Rashi)', labelHi: 'वर्ण (चंद्र राशि)', valueEn: moonSign?.varna ?? 'Not available', valueHi: moonSign?.varna === 'Brahmin' ? 'ब्राह्मण' : moonSign?.varna === 'Kshatriya' ? 'क्षत्रिय' : moonSign?.varna === 'Vaishya' ? 'वैश्य' : moonSign?.varna === 'Shudra' ? 'शूद्र' : 'उपलब्ध नहीं' },
    { id: 'vashya', labelEn: 'Vashya (Moon Rashi)', labelHi: 'वश्य (चंद्र राशि)', valueEn: moonSign?.vashya ?? 'Not available', valueHi: ({ Quadruped: 'चतुष्पद', Human: 'मानव', Aquatic: 'जलचर', Wild: 'वनचर', Insect: 'कीट' } as Record<string,string>)[moonSign?.vashya ?? ''] ?? 'उपलब्ध नहीं' },
    { id: 'yoni', labelEn: 'Yoni', labelHi: 'योनि', valueEn: nakInfo?.yoni ?? 'Not available', valueHi: nakInfo?.yoni ?? 'उपलब्ध नहीं' },
    { id: 'gana', labelEn: 'Gana', labelHi: 'गण', valueEn: nakInfo?.gana ?? 'Not available', valueHi: nakInfo?.gana === 'Deva' ? 'देव' : nakInfo?.gana === 'Manushya' ? 'मनुष्य' : nakInfo?.gana === 'Rakshasa' ? 'राक्षस' : 'उपलब्ध नहीं' },
    { id: 'nadi', labelEn: 'Nadi', labelHi: 'नाड़ी', valueEn: nakInfo?.nadi ?? 'Not available', valueHi: nakInfo?.nadi === 'Adi' ? 'आदि' : nakInfo?.nadi === 'Madhya' ? 'मध्य' : nakInfo?.nadi === 'Antya' ? 'अंत्य' : 'उपलब्ध नहीं' },
    { id: 'nadi-pad', labelEn: 'Nadi Pada', labelHi: 'नाड़ी पद', valueEn: nakInfo ? `${nakInfo.nadi} Nadi · Pada ${pada}` : 'Not available', valueHi: nakInfo ? `${nakInfo.nadi === 'Adi' ? 'आदि' : nakInfo.nadi === 'Madhya' ? 'मध्य' : 'अंत्य'} नाड़ी · पद ${pada}` : 'उपलब्ध नहीं' },
    { id: 'tattva', labelEn: 'Tattva (Moon Rashi)', labelHi: 'तत्त्व (चंद्र राशि)', valueEn: moonSign?.element ?? 'Not available', valueHi: ({ Fire: 'अग्नि', Earth: 'पृथ्वी', Air: 'वायु', Water: 'जल' } as Record<string,string>)[moonSign?.element ?? ''] ?? 'उपलब्ध नहीं' },
    { id: 'paya', labelEn: 'Paya (Moon from Lagna method)', labelHi: 'पाया (लग्न से चंद्र स्थिति)', valueEn: `${paya[0]} · Moon in H${moonHouse}`, valueHi: `${paya[1]} · चंद्रमा भाव ${moonHouse}` },
    { id: 'naam-akshar', labelEn: 'Naamakshar', labelHi: 'नामाक्षर', valueEn: nakInfo ? NAKSHATRA_NAME_AKSHAR[nakInfo.index]?.[pada - 1] ?? 'Not available' : 'Not available', valueHi: nakInfo ? NAKSHATRA_NAME_AKSHAR[nakInfo.index]?.[pada - 1] ?? 'उपलब्ध नहीं' : 'उपलब्ध नहीं' },
    { id: 'nakshatra-charan', labelEn: 'Nakshatra Charan', labelHi: 'नक्षत्र चरण', valueEn: nakInfo ? `${nakInfo.name} · Pada ${pada}` : 'Not available', valueHi: nakInfo ? `${nakInfo.name} · चरण ${pada}` : 'उपलब्ध नहीं' },
    { id: 'atmakaraka', labelEn: 'Atmakaraka', labelHi: 'आत्मकारक', valueEn: ak ? `${ak.planet} · ${ak.signName} · ${ak.degreeInSign.toFixed(2)}°` : 'Not available', valueHi: ak ? `${ak.planet} · ${ak.signName} · ${ak.degreeInSign.toFixed(2)}°` : 'उपलब्ध नहीं' },
    { id: 'ishta-dev', labelEn: 'Ishta Dev', labelHi: 'इष्ट देव', valueEn: ishtaNames.length ? `${ishtaNames.join(' / ')} (${ishtaMethod})` : 'Not available', valueHi: ishtaNames.length ? `${ishtaNames.join(' / ')} (${ishtaHi})` : 'उपलब्ध नहीं' },
  ];
  const summaryEn = `Birth foundation: ${weekday?.name ?? 'weekday unavailable'}, ${tithi?.name ?? 'tithi unavailable'} / ${tithi?.paksha ?? 'paksha unavailable'}, ${monthName}, ${ritu}; ${nakInfo?.name ?? 'birth nakshatra unavailable'} Pada ${pada}, ${nakInfo?.gana ?? ''} Gana, ${nakInfo?.nadi ?? ''} Nadi. The birth profile combines Panchanga, Nakshatra, Moon-sign attributes, Chara Atmakaraka and D9 Karakamsha indications.`;
  const summaryHi = `जन्म का आधार: ${weekday?.sanskrit ?? 'वार उपलब्ध नहीं'}, ${tithi?.name ?? 'तिथि उपलब्ध नहीं'} / ${tithi?.paksha === 'Shukla' ? 'शुक्ल पक्ष' : 'कृष्ण पक्ष'}, ${monthName}, ${ritu}; ${nakInfo?.name ?? 'नक्षत्र उपलब्ध नहीं'} चरण ${pada}, ${nakInfo?.gana ?? ''} गण, ${nakInfo?.nadi ?? ''} नाड़ी। इसमें पंचांग, नक्षत्र, चंद्र राशि के वर्ण-वश्य-तत्त्व, जैमिनी आत्मकारक और D9 कारकांश से प्राप्त इष्ट देव के संकेत सम्मिलित हैं।`;
  const interpretedFactors = factors.map((factor) => ({ ...factor, ...(() => { const meaning = interpretBirthFactor(factor.id, factor.valueEn, factor.valueHi, chart); return { interpretationEn: meaning.en, interpretationHi: meaning.hi }; })() }));
  // Compute Classical Navamsha Lagna (Prithu Yasas)
  const d9AscPlacement = chart.divisionalCharts?.D9?.placements?.find((p) => p.id === 'Asc');
  const navSignIndex = d9AscPlacement
    ? d9AscPlacement.signIndex
    : Math.floor(normalize360(chart.ascendant.longitude) / (30 / 9)) % 12;
  const navProf = CLASSICAL_PRITHU_YASAS_NAVAMSHA[navSignIndex] ?? CLASSICAL_PRITHU_YASAS_NAVAMSHA[0];
  const isVargottama = navSignIndex === chart.ascendant.signIndex;

  const navamshaLagna = {
    signIndex: navSignIndex,
    signNameEn: navProf.signNameEn,
    signNameHi: navProf.signNameHi,
    readingEn: navProf.prithuYasasDictumEn + (isVargottama ? ' [Vargottama Navamsha: Lagna in identical sign in D1 and D9 bestows two-fold happiness, great longevity and unshakeable prosperity.]' : ''),
    readingHi: navProf.prithuYasasDictumHi + (isVargottama ? ' [वर्गोत्तम नवांश: लग्न D1 व D9 दोनों में समान राशि में होने से जातक को दोगुना शुभ फल, उत्तम स्वास्थ्य और अखंड समृद्धि मिलती है।]' : ''),
    vulnerabilityAges: navProf.criticalVulnerabilityAges,
    isVargottama,
    sageWarningEn: navProf.sageWarningEn,
    sageWarningHi: navProf.sageWarningHi,
  };

  // Compute Tithi & Nitya Devi Profile
  const tNum = Math.max(1, Math.min(15, chart.panchang?.tithi?.number ?? 1));
  const tProf = CLASSICAL_TITHI_PROFILES[tNum] ?? CLASSICAL_TITHI_PROFILES[1];
  const tithiYoga = getTithiVaraYoga(tNum, chart.panchang?.vara?.lord ?? '');
  const isShukla = chart.panchang?.tithi?.paksha === 'Shukla';
  const tithiDetails = {
    tithiNumber: tNum,
    tithiNameEn: tNum === 15 ? (isShukla ? 'Purnima' : 'Amavasya') : tProf.nameEn,
    tithiNameHi: tNum === 15 ? (isShukla ? 'पूर्णिमा' : 'अमावस्या') : tProf.nameHi,
    category: tProf.category,
    categoryHi: tProf.categoryHi,
    presidingDeityEn: tNum === 15 ? (isShukla ? 'Chandra Deva & Mahalakshmi' : 'Pitrus & Lord Shani') : tProf.presidingDeityEn,
    presidingDeityHi: tNum === 15 ? (isShukla ? 'चंद्र देव एवं महालक्ष्मी' : 'पितृगण एवं शनि देव') : tProf.presidingDeityHi,
    governingNityaDeviEn: tNum === 15 ? (isShukla ? 'Shodashi / Maha Nitya' : 'Chitra Nitya Devi') : tProf.governingNityaDeviEn,
    governingNityaDeviHi: tNum === 15 ? (isShukla ? 'षोडशी / महानित्या' : 'चित्रा नित्या देवी') : tProf.governingNityaDeviHi,
    nityaDeviMantra: tProf.nityaDeviMantra,
    combinationYoga: tithiYoga,
  };

  // Compute Seasonal Details (Ayana, Maas, Ritu, Kaal, Hora, Gregorian Month)
  const sunSign = sun ? sun.signIndex : 0;
  const isUttarayana = sunSign === 9 || sunSign === 10 || sunSign === 11 || sunSign === 0 || sunSign === 1 || sunSign === 2;
  const ayanaData = isUttarayana ? CLASSICAL_AYANA_PROFILES.Uttarayana : CLASSICAL_AYANA_PROFILES.Dakshinayana;
  const maasProf = CLASSICAL_LUNAR_MAAS_PROFILES[lunarMonth] ?? CLASSICAL_LUNAR_MAAS_PROFILES['Chaitra'];
  const rituKey = ritu.split(' ')[0] ?? 'Vasanta';
  const rituProf = CLASSICAL_RITU_PROFILES[rituKey] ?? CLASSICAL_RITU_PROFILES['Vasanta'];

  let kaalKey = 'Madhyahna';
  const sHouse = sun?.rasiHouseNumber ?? 1;
  if (sHouse === 12 || sHouse === 1 || sHouse === 2) kaalKey = 'Ushakaal';
  else if (sHouse === 11 || sHouse === 10) kaalKey = 'Pratushakaal';
  else if (sHouse === 9 || sHouse === 8) kaalKey = 'Madhyahna';
  else if (sHouse === 7 || sHouse === 6) kaalKey = 'Sayamkaal';
  else kaalKey = 'RatriKaal';
  const kaalProf = CLASSICAL_KAAL_PROFILES[kaalKey] ?? CLASSICAL_KAAL_PROFILES['Madhyahna'];

  const horaRes = getHoraReading(chart.ascendant.signIndex, chart.ascendant.degreeInSign);

  // Gregorian Birth Month
  const birthDateObj = new Date(chart.utcMs);
  const gregMonthNum = (birthDateObj.getUTCMonth() + 1);
  const gregMonthProf = CLASSICAL_GREGORIAN_MONTHS[gregMonthNum] ?? CLASSICAL_GREGORIAN_MONTHS[1];

  const seasonalDetails = {
    ayanaEn: ayanaData.nameEn,
    ayanaHi: ayanaData.nameHi,
    ayanaReadingEn: ayanaData.natureEn,
    ayanaReadingHi: ayanaData.natureHi,
    maasEn: monthName,
    maasHi: (isAdhika ? 'अधिक ' : '') + (({ Chaitra: 'चैत्र', Vaishakha: 'वैशाख', Jyeshtha: 'ज्येष्ठ', Ashadha: 'आषाढ़', Shravana: 'श्रावण', Bhadrapada: 'भाद्रपद', Ashwin: 'आश्विन', Kartika: 'कार्तिक', Margashirsha: 'मार्गशीर्ष', Pausha: 'पौष', Magha: 'माघ', Phalguna: 'फाल्गुन' } as Record<string, string>)[lunarMonth] ?? lunarMonth),
    isAdhika,
    maasReadingEn: maasProf.shastricResultEn,
    maasReadingHi: maasProf.shastricResultHi,
    rituEn: rituProf.nameEn,
    rituHi: rituProf.nameHi,
    rituReadingEn: rituProf.temperamentEn,
    rituReadingHi: rituProf.temperamentHi,
    kaalEn: kaalProf.nameEn,
    kaalHi: kaalProf.nameHi,
    kaalReadingEn: kaalProf.natureEn,
    kaalReadingHi: kaalProf.natureHi,
    horaEn: `${horaRes.horaLord} Hora (${horaRes.isOddSign ? 'Odd Sign' : 'Even Sign'})`,
    horaHi: `${horaRes.horaLordHi} होरा (${horaRes.isOddSign ? 'विषम राशि' : 'सम राशि'})`,
    horaReadingEn: horaRes.readingEn,
    horaReadingHi: horaRes.readingHi,
    gregorianMonthEn: gregMonthProf.monthNameEn,
    gregorianMonthHi: gregMonthProf.monthNameHi,
    gregorianReadingEn: gregMonthProf.archetypeEn,
    gregorianReadingHi: gregMonthProf.archetypeHi,
  };

  // Compute Paya, Pada, Atmakaraka, Gana, Nadi, Varna, Yoni, and Birth Tatwa Profiles
  const payaKey = moonHouse === 1 || moonHouse === 6 || moonHouse === 11 ? 'gold' : moonHouse === 2 || moonHouse === 5 || moonHouse === 9 ? 'silver' : moonHouse === 3 || moonHouse === 7 || moonHouse === 10 ? 'copper' : 'iron';
  const payaDetails = CLASSICAL_PAYA_PROFILES[payaKey];
  const padaDetails = getPadaDetail(nakInfo?.index ?? 0, pada);
  const atmakarakaProfile = ak ? getAtmakarakaProfile(ak.planet) : undefined;
  const ganaDetails = nakInfo ? getGanaProfile(nakInfo.gana) : undefined;
  const nadiDetails = nakInfo ? getNadiProfile(nakInfo.nadi) : undefined;
  const varnaDetails = moonSign ? getVarnaProfile(moonSign.varna) : undefined;
  const yoniDetails = nakInfo ? getYoniProfile(nakInfo.yoni) : undefined;

  let birthTatwaDetails: BirthTatwaCalculationResult | undefined;
  if (Number.isFinite(sunriseMs)) {
    const weekdayLord = weekday?.lord ?? weekday?.name ?? 'Sun';
    birthTatwaDetails = calculateBirthTimeTatwa(birthMs, sunriseMs, weekdayLord);
  }

  return {
    factors: interpretedFactors,
    summaryEn,
    summaryHi,
    payaDetails,
    padaDetails,
    atmakarakaProfile,
    ganaDetails,
    nadiDetails,
    varnaDetails,
    yoniDetails,
    birthTatwaDetails,
    navamshaLagna,
    tithiDetails,
    seasonalDetails,
  };
}

export function computePurusharthaBalance(chart: ChartData): PurusharthaReport {
  const ascSign = chart.ascendant.signIndex;

  const trineDefs: Array<{
    type: 'Dharma' | 'Artha' | 'Kama' | 'Moksha';
    nameEn: string;
    nameHi: string;
    houses: number[];
    orientationEn: string;
    orientationHi: string;
    guidanceEn: string;
    guidanceHi: string;
    classicalSource: string;
  }> = [
    {
      type: 'Dharma',
      nameEn: 'Dharma Trikona (Righteousness, Duty & Soul Evolution)',
      nameHi: 'धर्म त्रिकोण (कर्तव्य, सदाचार, विवेक व आत्मिक उत्थान)',
      houses: [1, 5, 9],
      orientationEn: 'Houses 1, 5, 9 govern physical vitality, creative intellect, purva-punya (past life merits), moral integrity, and divine guidance.',
      orientationHi: 'लग्न (प्रथम), पंचम व नवम भाव आत्म-तेज, प्रज्ञा, पूर्वजन्म के संचित पुण्य, नैतिक मर्यादा व ईश्वरीय कृपा का संचालन करते हैं।',
      guidanceEn: 'Uphold satya (truth) and ethical principles; invest in higher learning, mentoring and philosophical study to unlock your highest potential.',
      guidanceHi: 'सत्य एवं उच्च नैतिक जीवन मूल्यों का पालन करें; स्वाध्याय, गुरु सेवा एवं परोपकार से भाग्योदय के द्वार खुलते हैं।',
      classicalSource: 'Brihat Parashara Hora Shastra (Ch. 11 & 14) · Four Trines in Vedic Astrology',
    },
    {
      type: 'Artha',
      nameEn: 'Artha Trikona (Material Security, Livelihood & Status)',
      nameHi: 'अर्थ त्रिकोण (धन, व्यावसायिक प्रभुत्व, आजीविका व संचित साधन)',
      houses: [2, 6, 10],
      orientationEn: 'Houses 2, 6, 10 govern accumulated wealth, daily disciplined service, professional authority, executive competence, and economic sovereignty.',
      orientationHi: 'द्वितीय, षष्ठ एवं दशम भाव संचित धन, अनुशासित कर्म, कार्यक्षेत्र में नेतृत्व, व्यावसायिक प्रतिष्ठा एवं आर्थिक संप्रभुता का निर्धारण करते हैं।',
      guidanceEn: 'Cultivate meticulous fiscal discipline, build enduring institutional competencies, and channel professional authority toward structured public good.',
      guidanceHi: 'अनुशासित वित्तीय प्रबंधन रखें, कार्यक्षेत्र में तकनीकी व प्रशासनिक दक्षता बढ़ाएं और दीर्घकालिक स्थायी संपत्तियों का निर्माण करें।',
      classicalSource: 'Brihat Parashara Hora Shastra (Ch. 12 & 20) · Bepin Behari Karmic Astrological Systems',
    },
    {
      type: 'Kama',
      nameEn: 'Kama Trikona (Desires, Dynamic Enterprise & Alliances)',
      nameHi: 'काम त्रिकोण (महत्वाकांक्षा, पुरुषार्थ, सामाजिक संबंध व अभीष्ट लाभ)',
      houses: [3, 7, 11],
      orientationEn: 'Houses 3, 7, 11 govern initiative, enterprise courage, marital partnership, social influence, lucrative networks, and realization of aspirations.',
      orientationHi: 'तृतीय, सप्तम एवं एकादश भाव पराक्रम, व्यापारिक साझेदारी, सामाजिक प्रतिष्ठा, दांपत्य सामंजस्य तथा आर्थिक व सामाजिक अभिलाषाओं की पूर्ति करते हैं।',
      guidanceEn: 'Channel personal drive into strategic teamwork and honorable partnerships; maintain clarity in commitments and balance ambition with empathy.',
      guidanceHi: 'अपने पराक्रम को संगठित टीमवर्क एवं पारदर्शी साझेदारियों में लगाएं; संबंधों में परस्पर विश्वास और महत्वाकांक्षा में संतुलन बनाए रखें।',
      classicalSource: 'Brihat Parashara Hora Shastra (Ch. 13 & 21) · Phaladeepika',
    },
    {
      type: 'Moksha',
      nameEn: 'Moksha Trikona (Inner Peace, Detachment & Liberation)',
      nameHi: 'मोक्ष त्रिकोण (आत्म-शांति, वैराग्य, आध्यात्मिक अनुसंधान व मुक्ति)',
      houses: [4, 8, 12],
      orientationEn: 'Houses 4, 8, 12 govern heart happiness, psychological resilience, esoteric exploration, selfless charity, foreign horizons, and spiritual liberation.',
      orientationHi: 'चतुर्थ, अष्टम एवं द्वादश भाव हार्दिक सुख, मानसिक दृढ़ता, गूढ़ आध्यात्मिक शोध, परोपकारी दान, विदेश संपर्क तथा परम आत्म-मुक्ति का नियमन करते हैं।',
      guidanceEn: 'Reserve regular daily time for contemplative silence, meditation, and devotional detachment; align worldly actions with universal selfless service.',
      guidanceHi: 'नियमित ध्यान, प्राणायाम और एकांत आत्म-चिंतन का अभ्यास करें; भौतिक गतिविधियों के बीच अनासक्ति और सात्विक दान से शांति प्राप्त करें।',
      classicalSource: 'Brihat Parashara Hora Shastra (Ch. 14 & 24) · Jaimini Upadesha Sutras',
    },
  ];

  const rawScores: number[] = [];
  const trineDetails = trineDefs.map((def) => {
    let score = 25;
    let savSum = 0;
    const occupants: NineGrahaId[] = [];

    for (const h of def.houses) {
      const sIdx = (ascSign + h - 1) % 12;
      const sav = chart.ashtakavarga?.sarva?.[sIdx] ?? 28;
      savSum += sav;
      score += (sav - 26) * 1.5;

      const planetsInH = chart.planets.filter((p) => p.rasiHouseNumber === h);
      for (const p of planetsInH) {
        occupants.push(p.id as NineGrahaId);
        score += 10;
        if (p.dignity === 'Exalted') score += 8;
        else if (p.dignity === 'Moolatrikona' || p.dignity === 'Own Sign') score += 6;
        else if (p.dignity === 'Friend' || p.dignity === 'Great Friend') score += 3;
        else if (p.dignity === 'Debilitated') score -= 5;
        if (p.isCombust) score -= 3;
      }

      const lordId = SIGNS[sIdx]?.lord;
      const lordPlanet = chart.planets.find((p) => p.id === lordId);
      if (lordPlanet) {
        if (lordPlanet.dignity === 'Exalted') score += 6;
        else if (lordPlanet.dignity === 'Moolatrikona' || lordPlanet.dignity === 'Own Sign') score += 4;
        else if (lordPlanet.dignity === 'Friend' || lordPlanet.dignity === 'Great Friend') score += 2;
        else if (lordPlanet.dignity === 'Debilitated') score -= 4;
        if ([1, 4, 5, 7, 9, 10].includes(lordPlanet.rasiHouseNumber)) score += 3;
      }
    }

    const safeScore = Math.max(10, Math.round(score));
    rawScores.push(safeScore);
    return {
      def,
      score: safeScore,
      savSum,
      occupants,
    };
  });

  const totalRaw = rawScores.reduce((a, b) => a + b, 0);
  const pCentages = trineDetails.map((t) => Math.round((t.score / totalRaw) * 100));
  const diff = 100 - pCentages.reduce((a, b) => a + b, 0);
  pCentages[0] += diff;

  let dominantIdx = 0;
  let maxScore = -1;
  pCentages.forEach((p, idx) => {
    if (p > maxScore) {
      maxScore = p;
      dominantIdx = idx;
    }
  });

  const dominant = trineDefs[dominantIdx].type;
  const domDef = trineDefs[dominantIdx];

  const dominantTitleEn = `${domDef.type}-Dominant Purushartha Life Orientation`;
  const dominantTitleHi = `${domDef.type === 'Dharma' ? 'धर्म' : domDef.type === 'Artha' ? 'अर्थ' : domDef.type === 'Kama' ? 'काम' : 'मोक्ष'} प्रधान पुरुषार्थ जीवन पथ`;

  let soulMissionEn = '';
  let soulMissionHi = '';
  let balanceSynthesisEn = '';
  let balanceSynthesisHi = '';

  if (dominant === 'Dharma') {
    soulMissionEn = 'Moral leadership, ethical teaching, philosophical wisdom and purva-punya fruition';
    soulMissionHi = 'नैतिक नेतृत्व, शास्त्रीय विद्या, लोक-कल्याणकारी मार्ग एवं पूर्व पुण्य का सदुपयोग';
    balanceSynthesisEn = `Dharma Trikona (Houses 1, 5, 9) leads with ${pCentages[0]}% dominance. Cosmic energy is dedicated to establishing righteousness, higher knowledge, and spiritual integrity. Material success is an instrument to support noble dharma.`;
    balanceSynthesisHi = `धर्म त्रिकोण (१, ५, ९ भाव) ${pCentages[0]}% की सर्वोच्च प्रधानता के साथ सक्रिय है। आपकी आत्मा का मूल संकल्प सत्य, नैतिकता, विद्या और आदर्श जीवन मूल्यों की प्रतिष्ठा करना है। भौतिक साधन केवल धर्म-पालन में सहायक होंगे।`;
  } else if (dominant === 'Artha') {
    soulMissionEn = 'Executive stewardship, material wealth accumulation, institutional leadership and structured enterprise';
    soulMissionHi = 'संगठनात्मक नेतृत्व, स्थायी धन सृजन, प्रशासनिक दक्षता एवं सुदृढ़ आजीविका';
    balanceSynthesisEn = `Artha Trikona (Houses 2, 6, 10) leads with ${pCentages[1]}% dominance. Your life path centers on practical executive authority, systematic wealth building, disciplined problem solving, and establishing enduring economic security.`;
    balanceSynthesisHi = `अर्थ त्रिकोण (२, ६, १० भाव) ${pCentages[1]}% की सर्वोच्च प्रधानता के साथ सक्रिय है। आपकी कुंडली की प्रमुख शक्ति व्यावसायिक दक्षता, धन संचय, अनुशासित कर्मठता एवं समाज में स्थायी आर्थिक व प्रशासनिक प्रभाव स्थापित करने में है।`;
  } else if (dominant === 'Kama') {
    soulMissionEn = 'Dynamic enterprise, relationship fulfillment, strategic partnerships and realization of ambitious milestones';
    soulMissionHi = 'सक्रिय पुरुषार्थ, दांपत्य व सामाजिक सामंजस्य, व्यापारिक विस्तार एवं महत्वाकांक्षाओं की सिद्धि';
    balanceSynthesisEn = `Kama Trikona (Houses 3, 7, 11) leads with ${pCentages[2]}% dominance. Initiative, social intelligence, dynamic networking, and cooperative enterprise drive your major life accomplishments and happiness.`;
    balanceSynthesisHi = `काम त्रिकोण (३, ७, ११ भाव) ${pCentages[2]}% की सर्वोच्च प्रधानता के साथ सक्रिय है। आपका पराक्रम, जनसंपर्क, सहयोगियों का साथ और रणनीतिक संबंध आपके भाग्योदय और अभीष्ट लाभ के मुख्य प्रेरक हैं।`;
  } else {
    soulMissionEn = 'Inner serenity, psychological transcendence, esoteric research, charitable service and spiritual liberation';
    soulMissionHi = 'आत्म-शांति, आंतरिक वैराग्य, आध्यात्मिक अनुसंधान, परोपकार एवं मोक्ष मार्ग';
    balanceSynthesisEn = `Moksha Trikona (Houses 4, 8, 12) leads with ${pCentages[3]}% dominance. Your chart channels deepest fulfillment through contemplative peace, psychological resilience, altruistic giving, and transcendental wisdom beyond material attachments.`;
    balanceSynthesisHi = `मोक्ष त्रिकोण (४, ८, १२ भाव) ${pCentages[3]}% की सर्वोच्च प्रधानता के साथ सक्रिय है। सांसारिक उपलब्धियों के परे आत्म-साक्षात्कार, आंतरिक वैराग्य, ध्यान और आध्यात्मिक शांति ही आपके जीवन का सर्वोच्च गंतव्य है।`;
  }

  const trines: PurusharthaTrineScore[] = trineDetails.map((td, idx) => ({
    type: td.def.type,
    nameEn: td.def.nameEn,
    nameHi: td.def.nameHi,
    houses: td.def.houses,
    percentage: pCentages[idx],
    score: td.score,
    occupantPlanets: td.occupants,
    savBindus: td.savSum,
    orientationEn: td.def.orientationEn,
    orientationHi: td.def.orientationHi,
    guidanceEn: td.def.guidanceEn,
    guidanceHi: td.def.guidanceHi,
    classicalSource: td.def.classicalSource,
  }));

  return {
    dominant,
    dominantTitleEn,
    dominantTitleHi,
    soulMissionEn,
    soulMissionHi,
    trines,
    balanceSynthesisEn,
    balanceSynthesisHi,
    classicalReference: 'Brihat Parashara Hora Shastra · Four Trines in Vedic Astrology · Bepin Behari Astrological Systems',
  };
}

export function computeDeepLifePredictions(chart: ChartData): DeepLifePredictionsReport {
  const classicalYogas = detectClassicalYogas(chart);
  const chikitsaReport = computeComprehensiveChikitsaReport(chart);
  const marriageReport = computeComprehensiveMarriageReport(chart);
  const domains = DOMAINS.map((config) => buildDomain(chart, config, classicalYogas));

  const marriageDomain = domains.find((d) => d.id === 'marriage');
  if (marriageDomain) {
    if (!marriageDomain.concreteEventsEn) marriageDomain.concreteEventsEn = [];
    if (!marriageDomain.concreteEventsHi) marriageDomain.concreteEventsHi = [];
    marriageDomain.concreteEventsEn.push(`Marriage Nature: ${marriageReport.marriageNature}. Expected Timing: ${marriageReport.timingAndDoubleTransit.primeMarriageAgeWindowEn}`);
    marriageDomain.concreteEventsHi.push(`विवाह स्वरूप: ${marriageReport.marriageNatureHi}। संभावित विवाह काल: ${marriageReport.timingAndDoubleTransit.primeMarriageAgeWindowHi}`);

    marriageDomain.keyStrengthsEn.push(`Spouse Persona: ${marriageReport.streeJataka.spousePersonaEn} Career: ${marriageReport.streeJataka.spouseProfessionAndStatusEn}`);
    marriageDomain.keyStrengthsHi.push(`जीवनसाथी का स्वरूप: ${marriageReport.streeJataka.spousePersonaHi} आजीविका: ${marriageReport.streeJataka.spouseProfessionAndStatusHi}`);

    if (marriageReport.streeJataka.mangalyaHouse8Status.includes('Auspicious')) {
      marriageDomain.keyStrengthsEn.push(`Saubhagya Sthana: ${marriageReport.streeJataka.mangalyaDetailsEn}`);
      marriageDomain.keyStrengthsHi.push(`सौभाग्य स्थान: ${marriageReport.streeJataka.mangalyaDetailsHi}`);
    }

    if (marriageReport.maritalDiscordRisk !== 'Low') {
      marriageDomain.watchoutsEn.push(`Marital Harmony Vigilance: ${marriageReport.maritalDiscordDetailsEn}`);
      marriageDomain.watchoutsHi.push(`दांपत्य सामंजस्य सतर्कता: ${marriageReport.maritalDiscordDetailsHi}`);
    }

    if (marriageReport.streeJataka.mangalyaHouse8Status === 'Requires Shanti') {
      marriageDomain.watchoutsEn.push(`8th House Mangalya Alert: ${marriageReport.streeJataka.mangalyaDetailsEn}`);
      marriageDomain.watchoutsHi.push(`अष्टम भाव मांगल्य संकेत: ${marriageReport.streeJataka.mangalyaDetailsHi}`);
    }
  }

  const childrenDomain = domains.find((d) => d.id === 'children');
  if (childrenDomain) {
    if (chikitsaReport.progenyDiagnostic.hasNagaSarpaDosha && chikitsaReport.progenyDiagnostic.nagaDoshaDetailsEn) {
      childrenDomain.watchoutsEn.push(chikitsaReport.progenyDiagnostic.nagaDoshaDetailsEn);
      if (chikitsaReport.progenyDiagnostic.nagaDoshaDetailsHi) {
        childrenDomain.watchoutsHi.push(chikitsaReport.progenyDiagnostic.nagaDoshaDetailsHi);
      }
    }
    if (chikitsaReport.progenyDiagnostic.hasPitruDoshaInProgeny && chikitsaReport.progenyDiagnostic.pitruDoshaDetailsEn) {
      childrenDomain.watchoutsEn.push(chikitsaReport.progenyDiagnostic.pitruDoshaDetailsEn);
      if (chikitsaReport.progenyDiagnostic.pitruDoshaDetailsHi) {
        childrenDomain.watchoutsHi.push(chikitsaReport.progenyDiagnostic.pitruDoshaDetailsHi);
      }
    }
    if (chikitsaReport.progenyDiagnostic.timingPredictionEn) {
      if (!childrenDomain.concreteEventsEn) childrenDomain.concreteEventsEn = [];
      childrenDomain.concreteEventsEn.push(chikitsaReport.progenyDiagnostic.timingPredictionEn);
    }
    if (chikitsaReport.progenyDiagnostic.timingPredictionHi) {
      if (!childrenDomain.concreteEventsHi) childrenDomain.concreteEventsHi = [];
      childrenDomain.concreteEventsHi.push(chikitsaReport.progenyDiagnostic.timingPredictionHi);
    }
  }

  const healthDomain = domains.find((d) => d.id === 'health');
  if (healthDomain) {
    healthDomain.keyStrengthsEn.push(`Dominant Dosha: ${chikitsaReport.dominantDosha}. ${chikitsaReport.constitutionalAdviceEn}`);
    healthDomain.keyStrengthsHi.push(`प्रमुख त्रिदोष प्रकृति: ${chikitsaReport.dominantDoshaHi}। ${chikitsaReport.constitutionalAdviceHi}`);

    const vulnerableSystems = chikitsaReport.vulnerableOrganSystems.filter((v) => v.severity !== 'Safe').slice(0, 2);
    for (const vs of vulnerableSystems) {
      healthDomain.watchoutsEn.push(`Kalapurusha Organ Focus: ${vs.organEn} (${vs.severity}) - ${vs.factorsEn}`);
      healthDomain.watchoutsHi.push(`कालपुरुष अंग संवेदनशीलता: ${vs.organHi} (${vs.severity}) - ${vs.factorsHi}`);
    }

    const activeAlerts = chikitsaReport.diseaseAlerts.filter((a) => a.isVulnerable);
    for (const al of activeAlerts) {
      healthDomain.watchoutsEn.push(`Specific Alert: ${al.diseaseNameEn} (${al.severity}) - ${al.planetaryCausesEn.join(', ')}. Remedy: ${al.ayurvedicUpayaEn}`);
      healthDomain.watchoutsHi.push(`विशिष्ट स्वास्थ्य संकेत: ${al.diseaseNameHi} (${al.severity}) - ${al.planetaryCausesHi.join(', ')}। शास्त्रीय उपाय: ${al.ayurvedicUpayaHi}`);
    }
  }

  const birthProfile = buildGeneralBirthProfile(chart);
  const supportive = domains.filter((d) => !d.keyStrengthsEn[0].startsWith('No clearly')).length;
  const challenging = domains.filter((d) => !d.watchoutsEn[0].startsWith('No major')).length;
  const executiveSummaryEn = 'Chart-specific synthesis: ' + birthProfile.summaryEn + ' ' + supportive + ' of ' + domains.length + ' domains contain identifiable supportive factors and ' + challenging + ' contain cautionary factors. Review each domain’s house-lord, planetary and divisional-chart evidence together; Dasha and Transit are interpreted separately.';
  const executiveSummaryHi = 'उपलब्ध कुंडली-प्रमाणों का व्यक्तिगत समन्वित विश्लेषण: ' + birthProfile.summaryHi + ' ' + domains.length + ' में से ' + supportive + ' क्षेत्रों में अनुकूल और ' + challenging + ' क्षेत्रों में सावधानी के संकेत मिले हैं। प्रत्येक क्षेत्र में भावेश, ग्रह और वर्ग-कुंडली के प्रमाण साथ पढ़ें; दशा और गोचर का फल अलग अनुभागों में दिया गया है।';
  const overallLifeScore = Math.round(domains.reduce((sum, d) => sum + d.score, 0) / domains.length);

  // Life Stature & Nobility Classification
  const lagnaLord = chart.planets.find((p) => p.id === SIGNS[chart.ascendant.signIndex]?.lord);
  const tenthLord = chart.planets.find((p) => p.id === SIGNS[(chart.ascendant.signIndex + 9) % 12]?.lord);
  const hasStrongLords =
    (lagnaLord && ['Exalted', 'Own Sign', 'Moolatrikona'].includes(lagnaLord.dignity)) ||
    (tenthLord && ['Exalted', 'Own Sign', 'Moolatrikona'].includes(tenthLord.dignity));

  let lifeStatureClassEn = 'Affluent, Dignified & Elite Class (समृद्ध व कुलीन वर्ग)';
  let lifeStatureClassHi = 'समृद्ध, कुलीन एवं सम्मानित वर्ग';
  let lifeStatureMeaningEn = 'Destined for sustained prosperity, high social esteem, institutional respect and comfortable assets.';
  let lifeStatureMeaningHi = 'समाज में स्थायी मान-सम्मान, सुदृढ़ आर्थिक संपन्नता, श्रेष्ठ पारिवारिक प्रतिष्ठा एवं आरामदायक जीवन।';

  if (hasStrongLords || overallLifeScore >= 68) {
    lifeStatureClassEn = 'Royal & Executive Administrative Class (राजसी व उच्च प्रशासनिक वर्ग)';
    lifeStatureClassHi = 'राजसी व उच्च प्रशासनिक वर्ग';
    lifeStatureMeaningEn = 'Destined for commanding executive authority, governance leadership, massive public respect and legacy building.';
    lifeStatureMeaningHi = 'प्रशासनिक व सामाजिक नेतृत्व, शीर्ष सम्मान, शासन व सत्ता से लाभ एवं ऐतिहासिक कीर्ति का योग।';
  } else if (overallLifeScore <= 45) {
    lifeStatureClassEn = 'Self-Made, Hardworking & Progressive Class (कर्मठ व स्वावलंबी वर्ग)';
    lifeStatureClassHi = 'कर्मठ, स्वावलंबी एवं प्रगतिशील मध्यम वर्ग';
    lifeStatureMeaningEn = 'Progresses through personal diligence, overcoming early hurdles to secure stable comfort past age 32.';
    lifeStatureMeaningHi = 'कठोर पुरुषार्थ से भाग्योदय; प्रारंभिक संघर्षों को पार कर आयु 32 के बाद स्थायी सुख व स्वावलंबन।';
  }

  // Golden Peak Rise Age Window
  const birthYear = Number((chart.input.date || '2000-01-01').split('-')[0]) || 2000;
  const primeAgeStart = 28;
  const primeAgeEnd = 36;
  const peakRiseAgeWindowEn = `Age ${primeAgeStart} to ${primeAgeEnd} Years (A.D. ${birthYear + primeAgeStart}–${birthYear + primeAgeEnd})`;
  const peakRiseAgeWindowHi = `आयु ${primeAgeStart} से ${primeAgeEnd} वर्ष (ई. सन् ${birthYear + primeAgeStart}–${birthYear + primeAgeEnd})`;

  // 3 Critical Life Testing / Crisis Eras
  const crisisErasEn = [
    `Age 22 to 24 (A.D. ${birthYear + 22}–${birthYear + 24}): Early career consolidation, academic testing and directional calibration`,
    `Age 38 to 41 (A.D. ${birthYear + 38}–${birthYear + 41}): Caution in major speculation/partnerships, restructuring investments`,
    `Age 52 to 54 (A.D. ${birthYear + 52}–${birthYear + 54}): Domestic responsibilities peak, joint and bone care, steady patience`,
  ];

  const crisisErasHi = [
    `आयु 22 से 24 वर्ष (ई. सन् ${birthYear + 22}–${birthYear + 24}): आरंभिक करियर का संघर्ष, दिशा भ्रम व शैक्षणिक परीक्षा काल`,
    `आयु 38 से 41 वर्ष (ई. सन् ${birthYear + 38}–${birthYear + 41}): आर्थिक निवेश में सतर्कता, व्यापारिक पुनर्गठन व स्वास्थ्य जांच काल`,
    `आयु 52 से 54 वर्ष (ई. सन् ${birthYear + 52}–${birthYear + 54}): पारिवारिक जिम्मेदारियों का दबाव, वात/जोड़ों की देखभाल व धैर्य काल`,
  ];

  const purusharthas = computePurusharthaBalance(chart);
  const karmicMissionEn = purusharthas.soulMissionEn;
  const karmicMissionHi = purusharthas.soulMissionHi;
  const dinaMrityuRoga = computeDinaMrityuAndRoga(chart);
  const twelveBhavaYogas = computeTwelveBhavaAndParivartanaYogas(chart);
  const badhakaDosha = computeBadhakaAndFunctionalDoshas(chart);

  return {
    overallLifeScore,
    lifeStatureClassEn,
    lifeStatureClassHi,
    lifeStatureMeaningEn,
    lifeStatureMeaningHi,
    peakRiseAgeWindowEn,
    peakRiseAgeWindowHi,
    crisisErasEn,
    crisisErasHi,
    karmicMissionEn,
    karmicMissionHi,
    purusharthas,
    dinaMrityuRoga,
    twelveBhavaYogas,
    badhakaDosha,
    chikitsaReport,
    marriageReport,
    executiveSummaryEn,
    executiveSummaryHi,
    domains,
    birthProfile,
    classicalYogas,
  };
}
