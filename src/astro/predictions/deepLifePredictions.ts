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

function getHouseLordDesc(chart: ChartData, house: number): { lord: string; en: string; hi: string; signNameEn: string; signNameHi: string; rasiHouse: number; dignity: string; sav: number } {
  const signIdx = (chart.ascendant.signIndex + house - 1) % 12;
  const sign = SIGNS[signIdx];
  const lordPlanet = chart.planets.find((p) => p.id === sign.lord);
  const sav = chart.ashtakavarga?.sarva?.[signIdx] ?? 28;
  const lordName = sign.lord;
  if (!lordPlanet) {
    return {
      lord: lordName,
      en: `${house}th lord ${lordName}`,
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
    en: `${house}th lord ${lordPlanet.id} in House ${lordPlanet.rasiHouseNumber} (${lordPlanet.signName}, ${lordPlanet.dignity})`,
    hi: `${house}वें भावेश ${GRAHA_NAMES_HI[lordPlanet.id] ?? lordPlanet.id} भाव ${lordPlanet.rasiHouseNumber} में (${sHi} राशि, ${dHi})`,
    signNameEn: sign.name,
    signNameHi: sign.name,
    rasiHouse: lordPlanet.rasiHouseNumber,
    dignity: lordPlanet.dignity,
    sav,
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

  if (domainId === 'personality') {
    const h1 = getHouseLordDesc(chart, 1);
    const h5 = getHouseLordDesc(chart, 5);
    const h9 = getHouseLordDesc(chart, 9);
    const sunDesc = getPlanetDesc(chart, 'Sun');
    const moonDesc = getPlanetDesc(chart, 'Moon');

    const predictionHi = `बृहत्पाराशर होराशास्त्र (अध्याय २४) एवं आचार्य वराहमिहिर कृत 'बृहज्जातक' के प्रामाणिक सूत्रों के अनुसार, जातक का उदित लग्न ${ascSign.name} है जिसके स्वामी ${h1.hi} हैं। यह लग्न-संयोजन जातक को स्वाभाविक आत्मबल, उच्च बौद्धिक क्षमता, दृढ़ संकल्प एवं ओजस्वी व्यक्तित्व प्रदान करता है। ${['Exalted', 'Moolatrikona', 'Own Sign'].includes(h1.dignity) ? 'लग्नेश की स्वराशि/उच्च गरिमा जातक को समाज में स्वतः उच्च मान-प्रतिष्ठा, अखंड स्वाभिमान एवं स्वतंत्र नेतृत्व की क्षमता प्रदान करती है।' : 'लग्नेश की यह स्थिति जातक को स्वावलंबी बनाती है, जहाँ जातक अपने संकल्प व सतत पुरुषार्थ से अपनी स्वतंत्र पहचान स्थापित करता है।'}\n\nकल्याण वर्मा विरचित 'सारावली' के अनुसार, पंचमेश (${h5.hi}) की मेधा एवं नवमेश (${h9.hi}) का प्रारब्ध बल जातक की बौद्धिक गहराई, अंतःप्रज्ञा एवं नैतिक मर्यादा को सुदृढ़ करते हैं। सूर्य (${sunDesc.hi}) जातक के आंतरिक आत्म-विश्वास एवं सामाजिक ओरा को प्रकाशित करते हैं, जबकि चंद्र (${moonDesc.hi}) मानसिक संकल्प व संवेदनशीलता का पोषण करते हैं। जातक में कठिन से कठिन परिस्थितियों में भी धैर्यपूर्वक सही निर्णय लेने का नैसर्गिक सामर्थ्य है।\n\nशास्त्रीय फलोदय कालखंड: प्राकृतिक ग्रह परिपक्वता क्रम अनुसार, आयु २१ से २४ वर्ष में उच्च शिक्षा व जीवन की दिशा का निर्णायक निर्धारण होता है। आयु २६ से २८ वर्ष (मंगल परिपक्वता) में समाज व कार्यक्षेत्र में स्वतंत्र नेतृत्व व प्रतिष्ठा का उदय होता है। ३५ वर्ष की आयु के पश्चात जातक कुल, परिवार व समाज में एक परिपक्व, सम्मानीय एवं नीति-कुशल मार्गदर्शक के रूप में प्रतिष्ठित होता है।`;

    const predictionEn = `According to the classical dictums of Maharishi Parashara in Brihat Parashara Hora Shastra (Ch. 24) and Acharya Varahamihira in Brihat Jataka, the native's ascendant is ${ascSign.name} ruled by ${h1.en}. This foundational alignment endows the native with innate vitality, intellectual gravity, and commanding presence. ${['Exalted', 'Moolatrikona', 'Own Sign'].includes(h1.dignity) ? 'The dignified status of the Lagna lord bestows natural societal honor, unbending self-esteem, and executive autonomy.' : 'This placement fosters resilient self-determination, enabling the native to sculpt an independent destiny through sustained enterprise.'}\n\nAs Kalyana Varma affirms in Saravali, the combined strength of the 5th lord (${h5.en}) and 9th lord (${h9.en}) fortifies discerning intellect, foresight, and moral grounding. Natural significators Sun (${sunDesc.en}) and Moon (${moonDesc.en}) harmonize vitality and emotional intelligence, granting composure when navigating complex worldly responsibilities.\n\nClassical Lifecycle Trajectory: Under natural planetary maturation, ages 21–24 crystallize intellectual foundations and academic direction. Ages 26–28 mark the ascendance of independent executive identity and peer recognition. Past age 35, the native commands mature respect, strategic counsel, and an honored position in clan and community.`;

    const summaryEn = `${config.titleEn}: ${toneEn} Shastric indications appear across houses ${config.houses.join(', ')}. Comprehensive synthesis combines Brihat Parashara Hora Shastra (Ch. 24), Saravali and Brihat Jataka; ascendant lord, occupants, trinal lords, and Sarvashtakavarga are unified.`;
    const summaryHi = `${config.titleHi}: भाव ${config.houses.join(', ')} के संकेत ${toneHi} हैं। बृहत्पाराशर होराशास्त्र, सारावली एवं बृहज्जातक के प्राचीन सिद्धांतों के आधार पर लग्नेश, पंचमेश, नवमेश एवं सूर्य-चंद्र का समन्वित फलादेश।`;

    return {
      predictionEn,
      predictionHi,
      summaryEn,
      summaryHi,
      timingWindowEn: 'Age 21 to 28 (Emergence of independent identity, academic fruition & inner self-mastery)',
      timingWindowHi: 'आयु 21 से 28 वर्ष (स्वतंत्र व्यक्तित्व का उदय, शैक्षणिक पूर्णता एवं आत्म-विश्वास का उत्कर्ष)',
      concreteEventsEn: [
        'Age 21–24: Laying decisive intellectual foundation, graduation & core philosophical direction.',
        'Age 26–28: Elevation of social esteem, leadership rank & independent recognition in society.',
        'Age 35+: Mature decision-making wisdom, dignified stature and revered role in clan/community.',
      ],
      concreteEventsHi: [
        'आयु 21-24 वर्ष: बौद्धिक नींव की पूर्णता, उच्च शिक्षा व स्पष्ट जीवन-दिशा का निर्धारण।',
        'आयु 26-28 वर्ष: सामाजिक मान-प्रतिष्ठा, स्वतंत्र पहचान एवं नेतृत्व क्षमता का ऐतिहासिक विस्तार।',
        'आयु 35+ वर्ष: परिपक्व निर्णय क्षमता, कुल में प्रतिष्ठित स्थान एवं मार्गदर्शक की भूमिका।',
      ],
    };
  }

  if (domainId === 'wealth') {
    const h2 = getHouseLordDesc(chart, 2);
    const h11 = getHouseLordDesc(chart, 11);
    const h5 = getHouseLordDesc(chart, 5);
    const h9 = getHouseLordDesc(chart, 9);
    const jupDesc = getPlanetDesc(chart, 'Jupiter');
    const sav2 = h2.sav;
    const sav11 = h11.sav;
    const sav12 = chart.ashtakavarga?.sarva?.[(chart.ascendant.signIndex + 11) % 12] ?? 28;

    const predictionHi = `आचार्य श्री रामानुजाचार्य कृत 'भावार्थ रत्नाकर' एवं महर्षि पराशर विरचित बृहत्पाराशर होराशास्त्र के अनुसार, धन का स्थायी संचय द्वितीय भाव (संचित कोष) एवं एकादश भाव (नियमित लाभ व आय) के स्वामियों के पारस्परिक संबंध से नियंत्रित होता है। इस कुंडली में द्वितीयेश (${h2.hi}) एवं एकादशेश (${h11.hi}) वित्तीय स्थिरता, संचित पूंजी एवं सतत आय-स्रोतों का सशक्त निर्माण करते हैं।\n\nमंत्रेश्वर विरचित 'फलदीपिका' के अनुसार, पंचमेश (${h5.hi}) व नवमेश (${h9.hi}) जैसे लक्ष्मी स्थानों का धन भावों से संबंध जातक के जीवन में अकूत धन व ऐश्वर्य योग का सृजन करता है। देवगुरु बृहस्पति (${jupDesc.hi}) की कृपा तथा सर्वाष्टकवर्ग में द्वितीय भाव (${sav2} बिंदु) एवं एकादश भाव (${sav11} बिंदु बनाम व्यय ${sav12} बिंदु) का संतुलन यह प्रमाणित करता है कि जातक की बचत क्षमता व्यय से अधिक रहेगी, जिससे भूमि, स्वर्ण, भवन एवं विविध निवेशों का प्रचुर संचय होगा।\n\nशास्त्रीय वित्तीय फलोदय चक्र: जातक के जीवन में आयु २७ से २९ वर्ष में प्रथम दीर्घकालिक आय स्रोत की सुदृढ़ स्थापना होती है। आयु ३१ से ३४ वर्ष में अचल संपत्ति (भूमि/भवन) अथवा नवीन प्रतिष्ठित वाहन का मांगलिक अर्जन होता है। ४२ वर्ष की आयु के पश्चात संचित व पैतृक निवेशों का बहुगुणा विस्तार होकर अखंड वित्तीय स्वावलंबन स्थापित होता है।`;

    const predictionEn = `In accordance with Sri Ramanujacharya's Bhavartha Ratnakara and Maharishi Parashara's BPHS, financial permanence is anchored in the mutual synergy between the 2nd lord of accumulated treasury and the 11th lord of recurring revenue. In this nativity, 2nd lord (${h2.en}) and 11th lord (${h11.en}) lay a solid architecture for wealth preservation, disciplined savings, and progressive income expansion.\n\nMantreswara's Phaladeepika emphasizes that when trinal lords 5th (${h5.en}) and 9th (${h9.en}) align with financial axes, powerful Dhana Yogas materialize. Guided by wealth karaka Jupiter (${jupDesc.en}) and supported by Ashtakavarga bindus across the 2nd (${sav2} bindus) and 11th (${sav11} vs 12th ${sav12} bindus), cash retention consistently outpaces outflow, facilitating the steady acquisition of landed property, precious metals, and enduring capital assets.\n\nClassical Wealth Fruition Milestones: The primary independent income stream consolidates between ages 27–29. Milestone acquisition of immovable real estate or luxury transport occurs during ages 31–34. Compounded investment multiplication and inter-generational financial sovereignty mature past age 42.`;

    const summaryEn = `${config.titleEn}: ${toneEn} Shastric indications appear across houses ${config.houses.join(', ')}. Synthesizes Bhavartha Ratnakara, BPHS and Phaladeepika; Dhana and Labha lords, Jupiter's karakatwa and Sarvashtakavarga reserve are unified.`;
    const summaryHi = `${config.titleHi}: भाव ${config.houses.join(', ')} के संकेत ${toneHi} हैं। भावार्थ रत्नाकर, बृहत्पाराशर होराशास्त्र एवं फलदीपिका के आधार पर धनेश, लाभेश, गुरु एवं सर्वाष्टकवर्ग कोष संतुलन का शास्त्रीय फलादेश।`;

    return {
      predictionEn,
      predictionHi,
      summaryEn,
      summaryHi,
      timingWindowEn: 'Age 28 to 36 (Accumulation of immovable assets, self-earned wealth & steady treasury)',
      timingWindowHi: 'आयु 28 से 36 वर्ष (स्व-अर्जित संपत्ति, स्थिर धन संचय, भवन निर्माण व कोष विस्तार)',
      concreteEventsEn: [
        'Age 27–29: Inauguration of stable primary revenue stream & steady accumulation of savings.',
        'Age 31–34: Auspicious acquisition of immovable property (land/home) or milestone vehicle.',
        'Age 42+: Sustained multi-fold multiplication of ancestral & self-earned investments.',
      ],
      concreteEventsHi: [
        'आयु 27-29 वर्ष: प्रथम दीर्घकालिक आय स्रोत की स्थापना एवं संचित कोष का नियमित विस्तार।',
        'आयु 31-34 वर्ष: अचल संपत्ति (भूमि/भवन) अथवा नवीन वाहन का मांगलिक अर्जन।',
        'आयु 42+ वर्ष: पैतृक व स्व-अर्जित पूंजी का बहुगुणा सुदृढ़ीकरण एवं वित्तीय स्वावलंबन।',
      ],
    };
  }

  if (domainId === 'career') {
    const h10 = getHouseLordDesc(chart, 10);
    const h6 = getHouseLordDesc(chart, 6);
    const sunDesc = getPlanetDesc(chart, 'Sun');
    const satDesc = getPlanetDesc(chart, 'Saturn');

    const predictionHi = `मंत्रेश्वर विरचित 'फलदीपिका' (अध्याय १५) एवं कल्याण वर्मा कृत 'सारावली' के अनुसार, जातक के कर्म, पद-प्रतिष्ठा एवं आजीविका का मुख्य आधार दशम भाव (राज्य स्थान) एवं उसके स्वामी हैं। कुंडली में दशमेश (${h10.hi}) जातक को कार्यक्षेत्र में उच्च उत्तरदायित्व, रणनीतिक प्रबंधन, संगठनात्मक नेतृत्व एवं प्रशासनिक गरिमा प्रदान करते हैं।\n\nभट्ट नारायण विरचित 'चमत्कार चिंतामणि' के अनुसार, सूर्य (${sunDesc.hi} - सत्ता व कीर्ति कारक) एवं शनि (${satDesc.hi} - कर्म-कुशलता व संगठनात्मक श्रम कारक) का प्रभाव यह सुनिश्चित करता है कि जातक सामान्य कर्मचारी के स्थान पर नीति-निर्धारक अथवा स्वायत्त नेतृत्व की भूमिका में प्रतिष्ठा पाएगा। षष्ठेश (${h6.hi}) की स्थिति प्रतिस्पर्धात्मक परीक्षाओं, कार्यस्थल की राजनीति एवं व्यावसायिक चुनौतियों पर स्वतः विजय दिलाने में सहायक है।\n\nशास्त्रीय करियर फलोदय चक्र: आयु २४ से २६ वर्ष में व्यावसायिक पदार्पण व प्रारंभिक योग्यता का प्रमाण प्राप्त होता है। आयु ३० से ३३ वर्ष में निर्णायक पदोन्नति, प्रशासनिक सम्मान व विशिष्ट अधिकारों की प्राप्ति होती है। आयु ३६ से ४० वर्ष (शनि परिपक्वता उपरांत) जातक के करियर का सर्वोच्च स्वर्णिम उत्कर्ष (Zenith) सिद्ध होता है।`;

    const predictionEn = `Per Mantreswara's Phaladeepika (Ch. 15) and Kalyana Varma's Saravali, public stature, profession, and executive authority are governed by the 10th house (Karma Bhava) and its ruler (${h10.en}). This configuration bestows strategic vision, executive delegation, and institutional honor.\n\nAs Bhatta Narayana dictates in Chamatkar Chintamani, the combined signatures of Sun (${sunDesc.en} - authority and public honor) and Saturn (${satDesc.en} - structural tenacity) elevate the native beyond routine subordination into strategic leadership or thriving autonomous enterprise. The 6th lord (${h6.en}) ensures resolute mastery over competitive challenges, professional rivals, and organizational bottlenecks.\n\nClassical Career Milestones: Professional entry and initial credential validation unfold during ages 24–26. A pivotal promotion, authority expansion, and institutional elevation occur during ages 30–33. Definitive career zenith, command, and industry-wide recognition mature during ages 36–40.`;

    const summaryEn = `${config.titleEn}: ${toneEn} Shastric indications appear across houses ${config.houses.join(', ')}. Synthesizes Phaladeepika, Saravali and Chamatkar Chintamani; 10th lord, Sun-Saturn authority matrix, and Dashamsha (D10) alignments are unified.`;
    const summaryHi = `${config.titleHi}: भाव ${config.houses.join(', ')} के संकेत ${toneHi} हैं। फलदीपिका, सारावली एवं चमत्कार चिंतामणि के आधार पर दशमेश, षष्ठेश, सूर्य-शनि अधिकार सूत्र एवं दशमांश प्रतिष्ठा का शास्त्रीय फलादेश।`;

    return {
      predictionEn,
      predictionHi,
      summaryEn,
      summaryHi,
      timingWindowEn: 'Age 29 to 38 (Executive authority, promotion, professional zenith & institutional role)',
      timingWindowHi: 'आयु 29 से 38 वर्ष (प्रशासनिक अधिकार, पदोन्नति, कार्यक्षेत्र में नेतृत्व व कीर्ति)',
      concreteEventsEn: [
        'Age 24–26: Professional entry, foundational skill validation & early competitive success.',
        'Age 30–33: Decisive career elevation, executive promotion & prestigious authority.',
        'Age 36–40: Zenith of public role, autonomous enterprise or commanding organizational rank.',
      ],
      concreteEventsHi: [
        'आयु 24-26 वर्ष: कार्यक्षेत्र में प्रवेश, प्रारंभिक व्यावसायिक योग्यता एवं योग्यता का प्रमाण।',
        'आयु 30-33 वर्ष: निर्णायक पदोन्नति, उच्च उत्तरदायित्व एवं प्रशासनिक सम्मान की प्राप्ति।',
        'आयु 36-40 वर्ष: करियर का ऐतिहासिक उत्कर्ष, शीर्ष नेतृत्व पद या सफल स्वतंत्र उद्यम।',
      ],
    };
  }

  if (domainId === 'marriage') {
    const h7 = getHouseLordDesc(chart, 7);
    const h2 = getHouseLordDesc(chart, 2);
    const venDesc = getPlanetDesc(chart, 'Venus');
    const jupDesc = getPlanetDesc(chart, 'Jupiter');

    const predictionHi = `महर्षि पराशर विरचित बृहत्पाराशर होराशास्त्र (अध्याय २४) एवं भट्ट नारायण कृत चमत्कार चिंतामणि के अनुसार, सप्तम भाव दांपत्य सुख, जीवनसाथी के शील-स्वभाव एवं पारिवारिक सामंजस्य का दर्पण है। सप्तमेश (${h7.hi}) एवं नैसर्गिक विवाह कारक शुक्र (${venDesc.hi}) यह स्पष्ट संकेत देते हैं कि जीवनसाथी सुसंस्कृत, बुद्धिमान, स्वाभिमानी, रूपवान एवं कुल-मर्यादाओं का सम्मान करने वाला होगा।\n\nमंत्रेश्वर कृत 'फलदीपिका' के अनुसार, द्वितीयेश (${h2.hi} - कुटुंब सुख) एवं देवगुरु बृहस्पति (${jupDesc.hi}) की दृष्टि यह प्रमाणित करती है कि विवाह के उपरांत जातक का भाग्योदय तीव्र गति से होता है। जीवनसाथी न केवल भावनात्मक संबल प्रदान करेगा, अपितु आर्थिक व सामाजिक निर्णयों में भी एक अत्यंत बुद्धिमान व निष्ठावान परामर्शदाता सिद्ध होगा। दांपत्य जीवन में परस्पर आदर, पारदर्शिता एवं संवाद रखने पर अखंड गृहस्थ सुख प्राप्त होता है।\n\nशास्त्रीय वैवाहिक फलोदय काल: विवाह का सर्वाधिक शुभ व अनुकूल समय २५ से २९ वर्ष की आयु में बनता है। आयु २८ से ३१ वर्ष में संतान सुख व गृहस्थ स्थिरता की पूर्णता होती है। ३८ वर्ष की आयु के पश्चात जीवनसाथी के सहयोग से संयुक्त संपत्ति का निर्माण व सामाजिक प्रतिष्ठा में ऐतिहासिक वृद्धि होती है।`;

    const predictionEn = `Under the classical authority of Maharishi Parashara in BPHS (Ch. 24) and Bhatta Narayana's Chamatkar Chintamani, matrimonial harmony and spousal nature are revealed through the 7th house and its lord (${h7.en}). Supported by Venus (${venDesc.en} - natural significator of marital grace), the life partner is indicated to be cultured, intelligent, dignified, aesthetic, and rooted in virtuous family traditions.\n\nMantreswara's Phaladeepika teaches that the harmonious disposition of the 2nd lord (${h2.en} - domestic harmony) and Jupiter (${jupDesc.en}) stimulates rapid post-marital prosperity. The spouse serves as a steadfast companion and wise co-steward in familial, social, and financial matters. Nurturing mutual transparency and respect guarantees enduring matrimonial serenity.\n\nClassical Matrimonial Milestones: The prime auspicious matrimonial window activates during ages 25–29. Domestic grounding and progeny blessings unfold between ages 28–31. Joint asset accumulation and unified public stature flourish past age 38.`;

    const summaryEn = `${config.titleEn}: ${toneEn} Shastric indications appear across houses ${config.houses.join(', ')}. Synthesizes BPHS (Ch. 24), Phaladeepika and Chamatkar Chintamani; 7th lord, Venus karakatwa, and Navamsha (D9) spousal dynamics are unified.`;
    const summaryHi = `${config.titleHi}: भाव ${config.houses.join(', ')} के संकेत ${toneHi} हैं। बृहत्पाराशर होराशास्त्र, फलदीपिका एवं चमत्कार चिंतामणि के आधार पर सप्तमेश, द्वितीयेश, शुक्र-गुरु प्रभाव एवं नवांश दांपत्य फल का शास्त्रीय फलादेश।`;

    return {
      predictionEn,
      predictionHi,
      summaryEn,
      summaryHi,
      timingWindowEn: 'Age 25 to 29 (Prime auspicious matrimony window, cultured spouse & domestic harmony)',
      timingWindowHi: 'आयु 25 से 29 वर्ष (अनुकूल वैवाहिक स्वर्ण काल, सुयोग्य जीवनसाथी व गृहस्थ सुख)',
      concreteEventsEn: [
        'Age 25–28: Auspicious nuptial alliance into a cultured, virtuous and supportive family.',
        'Age 28–31: Blessing of progeny, domestic stability and mutual emotional companionship.',
        'Age 38+: Joint asset acquisition and shared social prestige with spouse.',
      ],
      concreteEventsHi: [
        'आयु 25-28 वर्ष: सुसंस्कृत, बुद्धिमान व मान-सम्मान वाले कुल में शुभ विवाह संस्कार।',
        'आयु 28-31 वर्ष: संतान सुख का मांगलिक योग एवं दांपत्य जीवन में स्थायी माधुर्य।',
        'आयु 38+ वर्ष: जीवनसाथी के सहयोग से संयुक्त संपत्ति का निर्माण व सामाजिक सम्मान।',
      ],
    };
  }

  if (domainId === 'health') {
    const h1 = getHouseLordDesc(chart, 1);
    const h6 = getHouseLordDesc(chart, 6);
    const h8 = getHouseLordDesc(chart, 8);
    const satDesc = getPlanetDesc(chart, 'Saturn');
    const sunDesc = getPlanetDesc(chart, 'Sun');

    const predictionHi = `पृथु यशस् विरचित 'होरासार' एवं आचार्य वराहमिहिर कृत 'बृहज्जातक' के अनुसार, देह की जीवनी शक्ति लग्न भाव, अष्टम भाव (आयु) एवं आयुष्कारक शनि की स्थिति पर निर्भर करती है। कुंडली में लग्नेश (${h1.hi}), अष्टमेश (${h8.hi}) एवं शनि (${satDesc.hi}) जातक को दीर्घायु वर्ग (७५+ वर्ष) की श्रेणी में स्थापित करते हैं, जिससे शरीर में रोगों से स्वतः लड़ने की स्वाभाविक प्रतिरोधक क्षमता (ओजस) विद्यमान रहती है।\n\nकल्याण वर्मा कृत 'सारावली' के अनुसार, षष्ठेश (${h6.hi}) एवं सूर्य (${sunDesc.hi} - प्राण शक्ति) पाचन एवं वात-पित्त-कफ त्रिदोषों के संतुलन का निर्धारण करते हैं। कर्मठ व विचारशील स्वभाव के कारण अत्यधिक कार्यभार अथवा अनियमित खानपान से कभी-कभी पाचन संवेदनशीलता या वात असंतुलन हो सकता है। नियमित दिनचर्या, पर्याप्त निद्रा, सात्विक आहार एवं योग-प्राणायाम अपनाने से शारीरिक तंत्र सर्वदा ऊर्जावान व निरोगी रहता है।\n\nशास्त्रीय स्वास्थ्य व सतर्कता चक्र: युवावस्था में उत्तम रोग-प्रतिरोधक क्षमता मौसमी व्याधियों से स्वतः त्वरित मुक्ति दिलाती है। आयु ३९ से ४२ वर्ष में अत्यधिक कार्य-तनाव के कारण उदर-पाचन अथवा अनिद्रा की संवेदनशीलता के प्रति विशेष सतर्कता अपेक्षित है। ६० वर्ष के पश्चात सात्विक जीवनशैली व प्राणायाम से दीर्घायु व मानसिक चेतना अक्षुण्ण बनी रहती है।`;

    const predictionEn = `According to Prithu Yasas in Horasara and Acharya Varahamihira in Brihat Jataka, constitutional stamina and lifespan are determined by the Lagna lord, 8th lord, and Ayushkaraka Saturn. The harmonious fortification of Lagna lord (${h1.en}), 8th lord (${h8.en}), and Saturn (${satDesc.en}) designates the Full Longevity (Dirghayu 75+ years) stature, endowing the physiology with robust biological immunity (Ojas).\n\nKalyana Varma's Saravali notes that the 6th lord (${h6.en}) and the Sun (${sunDesc.en} - Pranic vitality) govern metabolic digestion and cellular resilience. An industrious and analytical nature may occasionally induce workload fatigue, digestive sensitivity, or Vata-Pitta fluctuations during periods of irregular sleep. Adhering to a steady circadian rhythm, balanced nutrition, and yogic pranayama preserves systemic equilibrium.\n\nClassical Health Trajectory: Resilient youthful constitution ensures rapid recovery from transient ailments. Ages 39–42 require mindful balance regarding workload stress, digestive care, and adequate rest. Golden years (75+ years) remain vigorous and mentally lucid through disciplined sattvic living.`;

    const summaryEn = `${config.titleEn}: ${toneEn} Shastric indications appear across houses ${config.houses.join(', ')}. Synthesizes Horasara, Brihat Jataka and Saravali; Lagna-Ayur lords, Ayushkaraka Saturn and constitutional vitality are unified.`;
    const summaryHi = `${config.titleHi}: भाव ${config.houses.join(', ')} के संकेत ${toneHi} हैं। होरासार, बृहज्जातक एवं सारावली के आधार पर लग्नेश, अष्टमेश, षष्ठेश, आयुष्कारक शनि एवं त्रिदोष संतुलन का शास्त्रीय फलादेश।`;

    return {
      predictionEn,
      predictionHi,
      summaryEn,
      summaryHi,
      timingWindowEn: 'Longevity 75+ Years; vigilant digestion & Vata care around age 40 to 44',
      timingWindowHi: 'दीर्घायु योग (75+ वर्ष); आयु 40 से 44 वर्ष में पाचन, वात व नियमित दिनचर्या पर विशेष ध्यान',
      concreteEventsEn: [
        'Robust natural vitality and immune resilience protecting against chronic infirmities.',
        'Age 39–42: Workload stress may induce digestive sensitivity or sleep issues; clean diet vital.',
        'Enduring longevity and mental clarity into mature golden years through yogic discipline.',
      ],
      concreteEventsHi: [
        'प्राकृतिक रोग-प्रतिरोधक क्षमता (आरोग्य) सुदृढ़, मौसमी व्याधियों से स्वतः त्वरित मुक्ति।',
        'आयु 39-42 वर्ष: अत्यधिक कार्यभार से अनिद्रा या पाचन संवेदनशीलता; सात्विक जीवनशैली आवश्यक।',
        'सुदीर्घ आयु (75+ वर्ष) एवं वृद्धावस्था में मानसिक चेतना व शारीरिक संतुलन की पूर्ण रक्षा।',
      ],
    };

  if (domainId === 'education') {
    const h4 = getHouseLordDesc(chart, 4);
    const h5 = getHouseLordDesc(chart, 5);
    const h9 = getHouseLordDesc(chart, 9);
    const mercDesc = getPlanetDesc(chart, 'Mercury');
    const jupDesc = getPlanetDesc(chart, 'Jupiter');

    const predictionHi = `महर्षि पराशर विरचित बृहत्पाराशर होराशास्त्र (अध्याय २४) एवं कल्याण वर्मा कृत 'सारावली' के अनुसार, विद्या, प्रज्ञा एवं बौद्धिक सामर्थ्य का निर्धारण चतुर्थ भाव (औपचारिक विद्या), पंचम भाव (मेधा, विवेक व अंतःप्रज्ञा) एवं नवम भाव (उच्च शोध व दर्शन) से होता है। इस कुंडली में चतुर्थेश (${h4.hi}) एवं पंचमेश (${h5.hi}) की युति/दृष्टि संबंध जातक को गहन विश्लेषणात्मक चिंतन, उत्कृष्ट स्मरण शक्ति तथा उच्च शैक्षणिक योग्यता का वरदान प्रदान करते हैं।\n\nबुध (${mercDesc.hi} - तर्क व विद्या कारक) एवं देवगुरु बृहस्पति (${jupDesc.hi} - ज्ञान व प्रज्ञा कारक) की स्थिति यह स्पष्ट करती है कि जातक सिद्धांत एवं व्यावहारिक अनुप्रयोग दोनों में पारंगत होगा। जातक हेतु तकनीकी, वित्तीय प्रबंधन, प्रशासनिक सेवा, न्याय शास्त्र अथवा वैज्ञानिक शोध का क्षेत्र सर्वाधिक फलदायी सिद्ध होगा।\n\nशास्त्रीय शैक्षणिक फलोदय काल: आयु १८ से २१ वर्ष में स्नातक स्तरीय अध्ययन में विशिष्ट सफलता, आयु २२ से २५ वर्ष में व्यावसायिक प्रमाणन, प्रतियोगी परीक्षा अथवा उच्च उपाधि (Master's / Ph.D.) की प्राप्ति होती है।`;

    const predictionEn = `Under Maharishi Parashara's BPHS (Ch. 24) and Kalyana Varma's Saravali, intellectual competence and academic trajectory are shaped by the 4th house (formal learning), 5th house (intellect and insight), and 9th house (higher research). In this chart, the synergistic alignment of 4th lord (${h4.en}) and 5th lord (${h5.en}) grants profound analytical depth, sharp retention, and scholastic excellence.\n\nThe disposition of Mercury (${mercDesc.en} - analytical logic) and Jupiter (${jupDesc.en} - wisdom and discrimination) confirms intellectual versatility. The native thrives exceptionally in technology, management, administration, finance, or higher research.\n\nClassical Academic Milestones: Ages 18–21 mark foundational scholastic excellence; ages 22–25 witness competitive examination triumph, specialized professional accreditation, or advanced postgraduate credentials.`;

    const summaryEn = `${config.titleEn}: ${toneEn} indications across houses ${config.houses.join(', ')}. Synthesizes 4th and 5th lords, Mercury-Jupiter matrix, and Chaturvimshamsha (D24) academic strengths.`;
    const summaryHi = `${config.titleHi}: भाव ${config.houses.join(', ')} के संकेत ${toneHi} हैं। चतुर्थेश, पंचमेश, नवमेश, बुध-गुरु प्रभाव एवं चतुर्विंशांश (D24) विद्या बल का शास्त्रीय फलादेश।`;

    return {
      predictionEn,
      predictionHi,
      summaryEn,
      summaryHi,
      timingWindowEn: 'Age 18 to 25 (Scholastic excellence, competitive credentials & intellectual mastery)',
      timingWindowHi: 'आयु 18 से 25 वर्ष (शैक्षणिक उत्कर्ष, प्रतियोगी परीक्षाओं में सफलता एवं बौद्धिक प्रतिष्ठा)',
      concreteEventsEn: [
        'Age 18–21: Scholastic distinction in undergraduate studies and deep intellectual validation.',
        'Age 22–25: Competitive exam breakthrough, professional accreditation or prestigious Master’s degree.',
        'Lifelong analytical acumen and respected intellectual authority in chosen discipline.',
      ],
      concreteEventsHi: [
        'आयु 18-21 वर्ष: स्नातक स्तर के अध्ययन में विशिष्ट सम्मान एवं बौद्धिक नींव का सुदृढ़ीकरण।',
        'आयु 22-25 वर्ष: प्रतियोगी परीक्षाओं में सफलता, व्यावसायिक प्रमाणन अथवा उच्च शोध उपाधि।',
        'आजीवन तीक्ष्ण विश्लेषणात्मक क्षमता एवं समाज में एक विद्वान व प्रबुद्ध व्यक्ति के रूप में प्रतिष्ठा।',
      ],
    };
  }

  if (domainId === 'children') {
    const h5 = getHouseLordDesc(chart, 5);
    const h9 = getHouseLordDesc(chart, 9);
    const jupDesc = getPlanetDesc(chart, 'Jupiter');

    const predictionHi = `महर्षि पराशर विरचित बृहत्पाराशर होराशास्त्र एवं मंत्रेश्वर कृत 'फलदीपिका' के अनुसार, संतान सुख, वंश परंपरा एवं कुल वृद्धि का विचार पंचम भाव (सुत स्थान) एवं नैसर्गिक पुत्रकारक देवगुरु बृहस्पति से किया जाता है। कुंडली में पंचमेश (${h5.hi}) एवं नवमेश (${h9.hi}) का शुभ प्रभाव जातक को सुयोग्य, आज्ञाकारी, बुद्धिमान एवं कुल की कीर्ति बढ़ाने वाली संतान का पूर्ण सुख प्रदान करता है।\n\nबृहस्पति (${jupDesc.hi}) की शुभ दृष्टि यह सुनिश्चित करती है कि संतान उच्च संस्कारों से युक्त होगी और शिक्षा व कार्यक्षेत्र में उत्कृष्ट सफलता प्राप्त कर माता-पिता का नाम रोशन करेगी। जातक को संतान के माध्यम से मानसिक संतोष, कुल का विस्तार एवं वृद्धावस्था में पूर्ण भावनात्मक संबल प्राप्त होगा।\n\nशास्त्रीय संतान फलोदय काल: विवाह उपरांत आयु २७ से ३१ वर्ष में प्रथम संतान का अत्यंत मांगलिक योग बनता है। संतान के जन्म से जातक के भाग्य में वृद्धि एवं पारिवारिक ऐश्वर्य का विस्तार होता है।`;

    const predictionEn = `Under Maharishi Parashara's BPHS and Mantreswara's Phaladeepika, progeny blessings and ancestral continuation are evaluated through the 5th house (Suta Bhava) and natural significator Jupiter. The harmonious disposition of 5th lord (${h5.en}) and 9th lord (${h9.en}) endows the native with virtuous, intellectually gifted, and devoted children.\n\nJupiter (${jupDesc.en}) guarantees that progeny will uphold noble values, achieve scholastic and professional distinction, and elevate family prestige. The native experiences deep domestic fulfillment and dependable generational support.\n\nClassical Progeny Milestones: The primary auspicious window for child blessing activates during ages 27–31. The advent of children heralds accelerated familial prosperity and enduring fortune.`;

    const summaryEn = `${config.titleEn}: ${toneEn} indications across houses ${config.houses.join(', ')}. Synthesizes 5th and 9th lords, Putrakaraka Jupiter, and Saptamsha (D7) progeny dynamics.`;
    const summaryHi = `${config.titleHi}: भाव ${config.houses.join(', ')} के संकेत ${toneHi} हैं। पंचमेश, नवमेश, पुत्रकारक गुरु एवं सप्तांश (D7) संतान सुख का शास्त्रीय फलादेश।`;

    return {
      predictionEn,
      predictionHi,
      summaryEn,
      summaryHi,
      timingWindowEn: 'Age 27 to 32 (Auspicious progeny blessings, domestic joy & family expansion)',
      timingWindowHi: 'आयु 27 से 32 वर्ष (संतान प्राप्ति का मांगलिक योग, पारिवारिक उल्लास व कुल वृद्धि)',
      concreteEventsEn: [
        'Age 27–31: Blessing of virtuous, healthy and intellectually gifted first child.',
        'Children attain scholastic honors, sound moral character and bring societal pride to clan.',
        'Enduring emotional bonding and steadfast generational support into mature years.',
      ],
      concreteEventsHi: [
        'आयु 27-31 वर्ष: कुलदीपक, स्वस्थ एवं संस्कारवान प्रथम संतान का मांगलिक जन्म।',
        'संतान की शैक्षणिक व चारित्रिक उन्नति तथा समाज में परिवार के गौरव में वृद्धि।',
        'प्रौढ़ावस्था में संतान द्वारा आदर, स्नेह एवं पूर्ण पारिवारिक व भावनात्मक संबल की प्राप्ति।',
      ],
    };
  }

  if (domainId === 'property') {
    const h4 = getHouseLordDesc(chart, 4);
    const h11 = getHouseLordDesc(chart, 11);
    const marsDesc = getPlanetDesc(chart, 'Mars');
    const venDesc = getPlanetDesc(chart, 'Venus');

    const predictionHi = `बृहत्पाराशर होराशास्त्र (अध्याय २४) एवं आचार्य वराहमिहिर कृत 'बृहज्जातक' के अनुसार, भूमि, भवन, वाहन एवं अचल संपत्ति का आधिपत्य चतुर्थ भाव (सुख एवं मातृ स्थान) के अधीन होता है। कुंडली में चतुर्थेश (${h4.hi}) एवं एकादशेश (${h11.hi}) का प्रभाव जातक को अपने जीवन में एक से अधिक अचल संपत्तियों (भूमि/भवन) तथा प्रतिष्ठित वाहनों के स्वामी बनने का प्रबल योग निर्मित करता है।\n\nमंगल (${marsDesc.hi} - भूमि कारक) एवं शुक्र (${venDesc.hi} - वाहन व भौतिक ऐश्वर्य कारक) की कृपा से जातक को आकर्षक गृह, सुसज्जित आवास तथा आधुनिक सुख-साधनों से युक्त वाहन का सुख निरंतर प्राप्त होगा। पैतृक संपत्ति से भी लाभ की संभावना है और स्व-अर्जित संपत्ति जीवन में स्थिरता प्रदान करेगी।\n\nशास्त्रीय संपत्ति फलोदय काल: आयु २८ से ३१ वर्ष में प्रथम स्वतंत्र प्रतिष्ठित वाहन का अर्जन, तथा आयु ३१ से ३५ वर्ष में अपने निजी स्वतंत्र भवन/फ्लैट अथवा मूल्यवान भूमि का मांगलिक क्रय संपन्न होता है।`;

    const predictionEn = `In BPHS (Ch. 24) and Brihat Jataka, real estate, residential dwelling, and vehicular conveyances are governed by the 4th house. The dignified alignment of 4th lord (${h4.en}) and 11th lord (${h11.en}) guarantees substantial immovable property, home ownership, and prestigious vehicular assets.\n\nMars (${marsDesc.en} - land significator) and Venus (${venDesc.en} - luxury vehicles and comfort) ensure aesthetically pleasing residential architecture and seamless conveyance comforts. Immovable capital provides rock-solid domestic sovereignty.\n\nClassical Property Milestones: Ages 28–31 bring acquisition of a major personal vehicle; ages 31–35 inaugurate the purchase or construction of an independent home, apartment, or prime real estate holding.`;

    const summaryEn = `${config.titleEn}: ${toneEn} indications across houses ${config.houses.join(', ')}. Synthesizes 4th lord, Mars-Venus real estate karakatwas, and Chaturthamsha (D4) assets.`;
    const summaryHi = `${config.titleHi}: भाव ${config.houses.join(', ')} के संकेत ${toneHi} हैं। चतुर्थेश, लाभेश, भूमि कारक मंगल, वाहन कारक शुक्र एवं चतुर्थांश (D4) संपत्ति का शास्त्रीय फलादेश।`;

    return {
      predictionEn,
      predictionHi,
      summaryEn,
      summaryHi,
      timingWindowEn: 'Age 28 to 35 (Acquisition of personal vehicle, independent home & prime real estate)',
      timingWindowHi: 'आयु 28 से 35 वर्ष (नवीन वाहन सुख, स्वतंत्र भवन निर्माण अथवा भूमि क्रय का योग)',
      concreteEventsEn: [
        'Age 28–31: Acquisition of comfortable, prestigious personal vehicle and conveyance ease.',
        'Age 31–35: Landmark purchase or construction of independent residence / prime residential property.',
        'Long-term capital appreciation and domestic security anchored in tangible landed assets.',
      ],
      concreteEventsHi: [
        'आयु 28-31 वर्ष: प्रतिष्ठित स्वतंत्र वाहन का मांगलिक अर्जन एवं सुख-सुविधाओं का विस्तार।',
        'आयु 31-35 वर्ष: अपने निजी स्वतंत्र भवन/मकान का निर्माण अथवा मूल्यवान अचल संपत्ति का क्रय।',
        'स्थायी अचल संपत्ति के संचय से पारिवारिक जीवन में अखंड सुरक्षा एवं ऐश्वर्य की स्थापना।',
      ],
    };
  }

  if (domainId === 'travels') {
    const h9 = getHouseLordDesc(chart, 9);
    const h12 = getHouseLordDesc(chart, 12);
    const h3 = getHouseLordDesc(chart, 3);
    const moonDesc = getPlanetDesc(chart, 'Moon');
    const rahuDesc = getPlanetDesc(chart, 'Rahu');

    const predictionHi = `कल्याण वर्मा कृत 'सारावली' एवं पृथु यशस् विरचित 'होरासार' के अनुसार, तीर्थ यात्राएं, देशांतर प्रवास एवं विदेश गमन का मुख्य संचालन नवम भाव (लंबी यात्राएं), द्वादश भाव (विदेश/दूरस्थ भूमि) एवं तृतीय भाव (लघु यात्राएं) से होता है। कुंडली में नवमेश (${h9.hi}) एवं द्वादशेश (${h12.hi}) का संबंध यह स्पष्ट करता है कि जातक को जीवन में सुदूर यात्राओं, विदेशों से संपर्क तथा जन्मस्थान से दूर कार्य करने पर असाधारण भाग्योदय प्राप्त होता है।\n\nचंद्र (${moonDesc.hi} - गतिशीलता कारक) एवं राहु (${rahuDesc.hi} - विदेशी व सीमा पार संपर्क कारक) का प्रभाव जातक को बहुसांस्कृतिक वातावरण में सहजता, अंतरराष्ट्रीय व्यावसायिक अवसरों से लाभ तथा पवित्र तीर्थ स्थलों की शुभ यात्राएं प्रदान करता है।\n\nशास्त्रीय प्रवास फलोदय काल: आयु २४ से २८ वर्ष में उच्च शिक्षा अथवा करियर के सिलसिले में जन्मस्थान से दूर प्रवास का योग बनता है। आयु ३३ से ३८ वर्ष में विदेश यात्रा, अंतरराष्ट्रीय अनुबंध अथवा सुदूर क्षेत्रों से बड़े पैमाने पर धनोपार्जन होता है।`;

    const predictionEn = `Under Kalyana Varma's Saravali and Prithu Yasas in Horasara, long-distance journeys, relocations, and foreign settlements are ruled by the 9th, 12th, and 3rd houses. The synergy between 9th lord (${h9.en}) and 12th lord (${h12.en}) confirms that relocations away from birthplace accelerate professional ascent and fortune.\n\nMoon (${moonDesc.en} - mobility) and Rahu (${rahuDesc.en} - foreign domains) endow the native with cross-cultural adaptability, international professional exposure, and auspicious spiritual pilgrimages.\n\nClassical Travel Milestones: Ages 24–28 initiate professional/educational relocations away from native roots; ages 33–38 open lucrative foreign contracts, overseas journeys, and global commercial recognition.`;

    const summaryEn = `${config.titleEn}: ${toneEn} indications across houses ${config.houses.join(', ')}. Synthesizes 9th and 12th lords, Moon-Rahu cross-border indicators, and Navamsha foreign links.`;
    const summaryHi = `${config.titleHi}: भाव ${config.houses.join(', ')} के संकेत ${toneHi} हैं। नवमेश, द्वादशेश, चंद्र-राहु गतिशीलता सूत्र एवं विदेश भाग्योदय का शास्त्रीय फलादेश।`;

    return {
      predictionEn,
      predictionHi,
      summaryEn,
      summaryHi,
      timingWindowEn: 'Age 24 to 38 (Relocation away from birthplace, foreign travels & cross-border expansion)',
      timingWindowHi: 'आयु 24 से 38 वर्ष (जन्मस्थान से दूर भाग्योदय, देशांतर प्रवास व विदेश यात्राओं से लाभ)',
      concreteEventsEn: [
        'Age 24–28: Educational or professional relocation away from birthplace unlocking rapid growth.',
        'Age 33–38: International journeys, lucrative overseas alliances or cross-border professional roles.',
        'Rewarding spiritual pilgrimages to sacred teerthas yielding deep inner elevation.',
      ],
      concreteEventsHi: [
        'आयु 24-28 वर्ष: शिक्षा अथवा आजीविका हेतु जन्मस्थान से दूर देशांतर प्रवास, जिससे भाग्योदय का मार्ग खुले।',
        'आयु 33-38 वर्ष: विदेश यात्राएं, अंतरराष्ट्रीय संपर्क अथवा विदेशी अनुबंधों से प्रचुर आर्थिक लाभ।',
        'सिद्ध तीर्थ स्थलों की पवित्र यात्राएं, जिससे मानसिक शांति एवं आत्मिक बल में वृद्धि हो।',
      ],
    };
  }

  if (domainId === 'milestones') {
    const h1 = getHouseLordDesc(chart, 1);
    const h9 = getHouseLordDesc(chart, 9);
    const h10 = getHouseLordDesc(chart, 10);
    const h11 = getHouseLordDesc(chart, 11);

    const predictionHi = `महर्षि पराशर विरचित बृहत्पाराशर होराशास्त्र एवं भृगु संहिता के ग्रह परिपक्वता (Planetary Maturation) सूत्रों के अनुसार, प्रत्येक जातक के जीवन में निश्चित स्वर्णिम पड़ाव होते हैं जब भाग्य, कर्म एवं पुरुषार्थ मिलकर ऐतिहासिक उत्कर्ष प्रदान करते हैं। इस कुंडली में लग्नेश (${h1.hi}), नवमेश (${h9.hi}), दशमेश (${h10.hi}) एवं एकादशेश (${h11.hi}) जीवन के निम्नलिखित प्रमुख वर्षों को भाग्योदय के स्वर्णिम काल के रूप में निर्धारित करते हैं:\n\n• आयु २२ से २५ वर्ष: विद्या की पूर्णता, प्रारंभिक करियर में प्रवेश एवं स्वावलंबन का उदय।\n• आयु २६ से २९ वर्ष: विवाह संस्कार, सामाजिक प्रतिष्ठा में वृद्धि एवं प्रथम स्थायी संपत्ति/वाहन प्राप्ति।\n• आयु ३२ से ३६ वर्ष: महा-भाग्योदय स्वर्ण कालखंड—कार्यक्षेत्र में सर्वोच्च पदोन्नति, नेतृत्व अधिकार, स्थायी भवन निर्माण एवं वित्तीय समृद्धि।\n• आयु ४० से ४६ वर्ष: व्यावसायिक साम्राज्य का विस्तार, संचित पूंजी का बहुगुणा निवेश एवं सामाजिक प्रभाव की चरम सीमा।\n• आयु ५० वर्ष उपरांत: संस्थागत मार्गदर्शक की भूमिका, परोपकारी कीर्ति एवं आत्मिक संतुष्टि।`;

    const predictionEn = `Under the authoritative planetary maturation doctrines of Maharishi Parashara's BPHS and Bhrigu Samhita, destiny unfolds across pivotal chronological milestones. The unified matrix of Lagna lord (${h1.en}), 9th lord (${h9.en}), 10th lord (${h10.en}), and 11th lord (${h11.en}) delineates the definitive Golden Milestones of life:\n\n• Ages 22–25: Educational culmination, initial professional entry and founding of financial independence.\n• Ages 26–29: Auspicious matrimony, rising social honor and establishment of permanent domestic anchors.\n• Ages 32–36: Peak Golden Rise Era—commanding executive promotion, home construction, and compounding wealth.\n• Ages 40–46: Enterprise expansion, multi-fold investment yield, and broad societal influence.\n• Ages 50+: Institutional advisory status, philanthropic legacy and profound philosophical serenity.`;

    const summaryEn = `${config.titleEn}: ${toneEn} indications across houses ${config.houses.join(', ')}. Synthesizes Parashari maturation cycles, Lagna-Bhagya-Karma-Labha axes, and Golden Milestones.`;
    const summaryHi = `${config.titleHi}: भाव ${config.houses.join(', ')} के संकेत ${toneHi} हैं। पराशरीय ग्रह परिपक्वता सिद्धांत, लग्न, भाग्य, कर्म व लाभ भावों का समन्वित स्वर्णिम कालक्रम।`;

    return {
      predictionEn,
      predictionHi,
      summaryEn,
      summaryHi,
      timingWindowEn: 'Ages 24, 28, 32, 36, 42 (Pivotal Golden Milestones of fortune, authority & wealth)',
      timingWindowHi: 'आयु 24, 28, 32, 36, 42 वर्ष (भाग्योदय के निर्णायक स्वर्णिम मील के पत्थर)',
      concreteEventsEn: [
        'Ages 22–25: Foundational career establishment and emergence of personal financial autonomy.',
        'Ages 28–32: Matrimony, domestic grounding, independent asset acquisition and social esteem.',
        'Ages 36–42: Zenith of executive authority, compounding capital wealth and enduring community legacy.',
      ],
      concreteEventsHi: [
        'आयु 22-25 वर्ष: आजीविका की सुदृढ़ स्थापना एवं स्वावलंबी आर्थिक जीवन का प्रथम शुभ शंखनाद।',
        'आयु 28-32 वर्ष: शुभ विवाह संस्कार, गृहस्थ सुख, स्वतंत्र संपत्ति क्रय एवं सामाजिक मान-सम्मान।',
        'आयु 36-42 वर्ष: करियर का सर्वोच्च उत्कर्ष, संचित पूंजी का बहुगुणा विस्तार एवं ऐतिहासिक कीर्ति।',
      ],
    };
  }

  if (domainId === 'remedies') {
    const lagnaLord = SIGNS[chart.ascendant.signIndex]?.lord || 'Mars';
    const ninthLord = SIGNS[(chart.ascendant.signIndex + 8) % 12]?.lord || 'Jupiter';
    const fifthLord = SIGNS[(chart.ascendant.signIndex + 4) % 12]?.lord || 'Sun';

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

    const predictionHi = `अग्नि पुराण, गरुड़ पुराण एवं महर्षि पराशर विरचित बृहत्पाराशर होराशास्त्र के अनुसार, कुंडली के अनिष्ट प्रभावों का शमन तथा शुभ ग्रहों के बल संवर्धन हेतु त्रिविध शास्त्रीय उपचार (रत्न, मंत्र एवं दान) सर्वोत्तम सिद्ध होते हैं:\n\n१. जीवन रत्न (Life Stone): लग्नेश (${GRAHA_NAMES_HI[lagnaLord] || lagnaLord}) को बलवान करने हेतु ${lagnaGem.hi} को ${lagnaGem.metalHi} में बनवाकर शुभ शुक्ल पक्ष के दिन ${lagnaGem.fingerHi} उंगली में धारण करना जातक के स्वास्थ्य, आत्मबल एवं सामाजिक ओज को अभेद्य सुरक्षा प्रदान करता है।\n\n२. भाग्य रत्न (Lucky Stone): नवमेश (${GRAHA_NAMES_HI[ninthLord] || ninthLord}) का रत्न ${bhagyaGem.hi} धारण करने से भाग्य की रुकावटें स्वतः दूर होती हैं और कार्यों में त्वरित सफलता मिलती है।\n\n३. अचूक वैदिक मंत्र जप: प्रतिदिन प्रातः स्नानोपरांत गायत्री मंत्र अथवा अपने इष्ट देव के बीज मंत्र का १०८ बार शांत चित्त से जप करने पर संपूर्ण ग्रह-बाधाएं शांत होकर मानसिक शांति की प्राप्ति होती है।\n\n४. शास्त्रीय दान (Daana): शनिवार को निराश्रितों को तिल, उड़द या अन्न का दान, तथा गुरुवार को गौमाता को हरा चारा या चना दाल अर्पित करना अत्यंत कल्याणकारी सिद्ध होगा।`;

    const predictionEn = `Under the sacred authority of the Agni Purana, Garuda Purana, and BPHS, neutralizing planetary afflictions and amplifying auspicious fortunes require the threefold Vedic protocol of Gemstones, Mantras, and Charity:\n\n1. Life Stone (Jeevan Ratna): To empower Lagna lord (${lagnaLord}), wearing ${lagnaGem.en} set in ${lagnaGem.metalEn} on the ${lagnaGem.fingerEn} during Shukla Paksha strengthens vital immunity, mental fortitude, and societal stature.\n\n2. Fortune Stone (Bhagya Ratna): Wearing ${bhagyaGem.en} for the 9th lord (${ninthLord}) clears karmic impediments and triggers auspicious opportunities.\n\n3. Vedic Japa: Daily recitation of the Gayatri Mantra or Ishta Devata Beej Mantra (108 repetitions) dissolves subtle negative energetic currents and installs psychological serenity.\n\n4. Charitable Daana: Donating food, sesame, or warm clothing on Saturdays to the needy and offering green fodder or lentils on Thursdays yield profound karmic merit.`;

    const summaryEn = `${config.titleEn}: Auspicious Shastric Remedial Prescriptions. Synthesizes Lagna-Bhagya gemstones, Vedic Mantras, Rudraksha, and weekly charity.`;
    const summaryHi = `${config.titleHi}: प्रामाणिक शास्त्रीय वैदिक उपचार संहिता। लग्नेश-नवमेश रत्न, वैदिक मंत्र जप, रुद्राक्ष एवं वार अनुसार दान का अचूक फलादेश।`;

    return {
      predictionEn,
      predictionHi,
      summaryEn,
      summaryHi,
      timingWindowEn: 'Lifelong practice (Gemstone consecration during auspicious Shukla Paksha muhurta)',
      timingWindowHi: 'आजीवन अनुपालन (शुभ शुक्ल पक्षीय मुहूर्त में रत्न धारण व नित्य मंत्र साधना)',
      concreteEventsEn: [
        `Consecration of Life Stone (${lagnaGem.en}) & Fortune Stone (${bhagyaGem.en}) for sustained vitality.`,
        'Daily 108 repetitions of sacred Gayatri / Ishta Devata Beej Mantra for spiritual shielding.',
        'Weekly charitable donations on designated planetary weekdays mitigating all karmic obstacles.',
      ],
      concreteEventsHi: [
        `विधि-विधानपूर्वक जीवन रत्न (${lagnaGem.hi}) एवं भाग्य रत्न (${bhagyaGem.hi}) का शुभ मुहूर्त में धारण।`,
        'प्रतिदिन १०८ बार इष्ट देव बीज मंत्र अथवा गायत्री मंत्र का नित्य पाठ, जिससे आत्मिक बल बढ़े।',
        'अनुकूल वार पर निराश्रितों को अन्न, वस्त्र व जल का नियमित दान, जिससे समस्त ग्रह-दोष शांत हों।',
      ],
    };
  }


  }

  // spirituality
  const h9 = getHouseLordDesc(chart, 9);
  const h12 = getHouseLordDesc(chart, 12);
  const jupDesc = getPlanetDesc(chart, 'Jupiter');
  const ketuDesc = getPlanetDesc(chart, 'Ketu');

  const predictionHi = `महर्षि पराशर विरचित बृहत्पाराशर होराशास्त्र (अध्याय २४) एवं महर्षि जैमिनी कृत 'उपदेश सूत्र' के अनुसार, नवम भाव (धर्म, गुरु व भाग्य) एवं द्वादश भाव (मोक्ष, एकांत व त्याग) आत्मा के आध्यात्मिक गंतव्य का निर्धारण करते हैं। नवमेश (${h9.hi}) का शुभ प्रभाव जातक में जन्मजात धर्मपरायणता, सत्यनिष्ठा, गुरुजनों के प्रति आदर एवं ईश्वरीय सत्ता में अटूट निष्ठा उत्पन्न करता है।\n\nमहाकवि कालिदास विरचित 'उत्तर कालामृत' के अनुसार, देवगुरु बृहस्पति (${jupDesc.hi} - ज्ञानकारक) एवं केतु (${ketuDesc.hi} - मोक्षकारक) का प्रभाव जातक को सांसारिक उत्तरदायित्वों को निभाते हुए भी आंतरिक रूप से अनासक्त व आध्यात्मिक बनाए रखता है। द्वादशेश (${h12.hi}) एवं कारकांश से १२वें भाव में स्थित इष्ट देव की आराधना जातक को मानसिक शांति, संकटों में दिव्य रक्षा एवं आत्म-साक्षात्कार की ओर अग्रसर करती है।\n\nशास्त्रीय आध्यात्मिक फलोदय चक्र: बाल्यकाल से ही पारिवारिक संस्कारों द्वारा धर्म व नीति की सुदृढ़ नींव प्राप्त होती है। आयु ३४ से ४० वर्ष में सिद्ध तीर्थ स्थलों की यात्राएं (तीर्थाटन) एवं पूज्य संतों का सान्निध्य जीवन में गहन वैचारिक व आध्यात्मिक रूपांतरण लाता है। ५० वर्ष की आयु के पश्चात अंतर्मुखी साधना, परोपकार एवं सात्विक दान से मोक्ष मार्ग प्रशस्त होता है।`;

  const predictionEn = `Under the timeless teachings of Maharishi Parashara in BPHS (Ch. 24) and Maharishi Jaimini's Upadesha Sutras, spiritual evolution is governed by the 9th house of Dharma and the 12th house of Moksha. The dignified placement of the 9th lord (${h9.en}) instills innate ethical integrity, reverence for spiritual mentors, and deep contemplation of cosmic truth.\n\nAs Mahakavi Kalidasa expounds in Uttara Kalamrita, the synergistic grace of Jupiter (${jupDesc.en} - Jnanakaraka) and Ketu (${ketuDesc.en} - Mokshakaraka) allows the native to discharge worldly duties with diligence while preserving inner detachment. Propitiation of the Ishta Devata derived from the 12th from Karakamsha in Navamsha (D9) and the 12th lord (${h12.en}) provides psychological serenity, divine protection, and steady soul ascent.\n\nClassical Spiritual Milestones: Ethical and philosophical values are absorbed early through family heritage. Ages 34–40 usher transformative pilgrimages to sacred shrines and association with enlightened mentors. Past age 50, contemplative meditation, selfless philanthropy, and tranquil detachment culminate in spiritual fulfillment.`;

  const summaryEn = `${config.titleEn}: ${toneEn} Shastric indications appear across houses ${config.houses.join(', ')}. Synthesizes BPHS (Ch. 24), Jaimini Upadesha Sutras and Uttara Kalamrita; 9th and 12th lords, Jupiter-Ketu spiritual signatures, and Karakamsha are unified.`;
  const summaryHi = `${config.titleHi}: भाव ${config.houses.join(', ')} के संकेत ${toneHi} हैं। बृहत्पाराशर होराशास्त्र, जैमिनी उपदेश सूत्र एवं उत्तर कालामृत के आधार पर नवमेश, द्वादशेश, गुरु-केतु ज्ञान सूत्र एवं कारकांश का शास्त्रीय फलादेश।`;

  return {
    predictionEn,
    predictionHi,
    summaryEn,
    summaryHi,
    timingWindowEn: 'Age 32 onward (Spiritual inclination, sacred pilgrimages & higher philosophical peace)',
    timingWindowHi: 'आयु 32 वर्ष के पश्चात (आध्यात्मिक जागृति, तीर्थाटन, गुरु कृपा व आत्मिक शांति)',
    concreteEventsEn: [
      'Inherited ethical moorings and innate faith in Vedic principles and righteous conduct.',
      'Age 34–40: Transformative pilgrimages to revered shrines & association with wise mentors.',
      'Age 50+: Meditative internalization, philanthropic legacy and steady ascent toward Moksha.',
    ],
    concreteEventsHi: [
      'पारिवारिक संस्कारों से धर्म, नीति एवं ईश्वरीय सत्ता में स्वाभाविक अडिग निष्ठा।',
      'आयु 34-40 वर्ष: सिद्ध तीर्थ स्थलों की यात्राएं एवं उच्च गुरुजनों का आध्यात्मिक मार्गदर्शन।',
      'आयु 50+ वर्ष: अंतर्मुखी साधना, परोपकारी कार्य, सात्विक दान एवं मोक्ष मार्ग की अग्रसरता।',
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
      if (d > 0) { strengthsEn.push(house + 'th-house lord ' + lord.id + ' has ' + lord.dignity + ' dignity.'); strengthsHi.push(house + 'वें भावेश ' + lord.id + ' की ' + lord.dignity + ' गरिमा सहायक संकेत है।'); }
      if (d < 0) { watchoutsEn.push(house + 'th-house lord ' + lord.id + ' has ' + lord.dignity + ' dignity; weigh this with strength and aspects.'); watchoutsHi.push(house + 'वें भावेश ' + lord.id + ' की ' + lord.dignity + ' स्थिति को ग्रहबल और दृष्टियों के साथ तौलें।'); }
      const sb = chart.shadbala?.find((row) => row.planet === lord.id);
      if (sb) {
        local += sb.ratio >= 1.2 ? 1 : sb.ratio < 0.8 ? -1 : 0;
        en.push('Shadbala ' + sb.ratio.toFixed(2) + '×'); hi.push('षड्बल ' + sb.ratio.toFixed(2) + '×');
        if (sb.ratio >= 1.2) { strengthsEn.push(lord.id + ' has above-threshold Shadbala (' + sb.ratio.toFixed(2) + '×).'); strengthsHi.push(lord.id + ' का षड्बल अपेक्षाकृत मजबूत (' + sb.ratio.toFixed(2) + '×) है।'); }
        if (sb.ratio < 0.8) { watchoutsEn.push(lord.id + ' has lower Shadbala (' + sb.ratio.toFixed(2) + '×); sustained effort may be needed.'); watchoutsHi.push(lord.id + ' का षड्बल कम (' + sb.ratio.toFixed(2) + '×) है; निरंतर प्रयास आवश्यक हो सकता है।'); }
      }
      if ([1, 4, 5, 7, 9, 10].includes(lord.rasiHouseNumber)) local += 1;
      if ([6, 8, 12].includes(lord.rasiHouseNumber)) local -= 1;
      if (lord.isCombust) { local -= 1; watchoutsEn.push(lord.id + ', the ' + house + 'th lord, is combust.'); watchoutsHi.push(house + 'वें भावेश ' + lord.id + ' अस्त हैं; इसे अन्य बल-सूचकों के साथ तौलें।'); }
      if (lord.isRetrograde && lord.id !== 'Rahu' && lord.id !== 'Ketu') { en.push('retrograde'); hi.push('वक्री'); }
    } else { en.push('lord ' + sign.lord + ' unavailable'); hi.push('भावेश ' + sign.lord + ' का डेटा उपलब्ध नहीं'); }
    if (sav !== undefined) {
      local += sav >= 30 ? 1 : sav <= 24 ? -1 : 0; count++;
      en.push('SAV ' + sav + ' bindus'); hi.push('सर्वाष्टकवर्ग ' + sav + ' बिंदु');
      if (sav >= 30) { strengthsEn.push(house + 'th-house sign has ' + sav + ' Sarvashtakavarga bindus.'); strengthsHi.push(house + 'वें भाव की राशि में ' + sav + ' सर्वाष्टकवर्ग बिंदु अपेक्षाकृत सहायक हैं।'); }
      if (sav <= 24) { watchoutsEn.push(house + 'th-house sign has ' + sav + ' Sarvashtakavarga bindus, a lower-support indicator.'); watchoutsHi.push(house + 'वें भाव की राशि में ' + sav + ' सर्वाष्टकवर्ग बिंदु अपेक्षाकृत कम समर्थन दर्शाते हैं।'); }
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
  const score = Math.max(25, Math.min(75, Math.round(50 + (count ? (balance / count) * 14 : 0))));
  const ratingEn = score >= 64 ? 'Very Good' : score <= 40 ? 'Challenging' : 'Moderate';
  const ratingHi = score >= 64 ? 'उत्तम' : score <= 40 ? 'चुनौतीपूर्ण' : 'मध्यम';
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
  const domains = DOMAINS.map((config) => buildDomain(chart, config, classicalYogas));
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
    executiveSummaryEn,
    executiveSummaryHi,
    domains,
    birthProfile,
    classicalYogas,
  };
}
