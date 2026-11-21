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

export interface DeepLifePredictionsReport {
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
  { id: 'personality', titleEn: 'Personality, Vitality & Mind', titleHi: 'व्यक्तित्व, आत्मबल एवं मन', icon: 'user', houses: [1, 5, 9], karakas: ['Sun', 'Moon'], varga: 'D9', adviceEn: 'Use initiative, self-awareness and consistent routines to develop the strengths shown by the chart.', adviceHi: 'कुंडली में दिखने वाली क्षमताओं को आत्मविश्वास, आत्मजागरूकता और नियमित दिनचर्या से विकसित करें।' },
  { id: 'wealth', titleEn: 'Wealth, Savings & Resources', titleHi: 'धन, बचत एवं संसाधन', icon: 'coins', houses: [2, 11, 5, 9], karakas: ['Jupiter', 'Venus', 'Mercury'], varga: 'D2', adviceEn: 'Build financial stability through disciplined saving, careful budgeting and informed decisions.', adviceHi: 'अनुशासित बचत, सुविचारित बजट और जानकारीपूर्ण निर्णयों से आर्थिक स्थिरता विकसित करें।' },
  { id: 'career', titleEn: 'Career, Work & Public Role', titleHi: 'करियर, कार्य एवं सामाजिक भूमिका', icon: 'briefcase', houses: [10, 6, 2, 11], karakas: ['Sun', 'Saturn', 'Mercury', 'Jupiter'], varga: 'D10', adviceEn: 'Strengthen professional skills, document achievements and build dependable working relationships.', adviceHi: 'पेशेवर कौशल बढ़ाएं, उपलब्धियों का अभिलेख रखें और भरोसेमंद कार्य-संबंध विकसित करें।' },
  { id: 'marriage', titleEn: 'Marriage & Relationships', titleHi: 'विवाह एवं संबंध', icon: 'heart', houses: [7, 2, 5, 8], karakas: ['Venus', 'Jupiter'], varga: 'D9', adviceEn: 'Nurture relationships through mutual respect, honest communication and thoughtful compatibility.', adviceHi: 'आपसी सम्मान, स्पष्ट संवाद और समझदारीपूर्ण अनुकूलता से संबंधों को मजबूत बनाएं।' },
  { id: 'health', titleEn: 'Health, Habits & Resilience', titleHi: 'स्वास्थ्य, आदतें एवं सहनशक्ति', icon: 'shield', houses: [1, 6, 8, 12], karakas: ['Sun', 'Moon', 'Saturn'], varga: 'D30', adviceEn: 'Support vitality with regular sleep, balanced activity, nutritious food and consistent preventive care.', adviceHi: 'नियमित नींद, संतुलित गतिविधि, पौष्टिक भोजन और समयानुसार स्वास्थ्य-जांच से जीवनशक्ति बनाए रखें।' },
  { id: 'spirituality', titleEn: 'Dharma, Learning & Spirituality', titleHi: 'धर्म, अध्ययन एवं आध्यात्म', icon: 'sparkles', houses: [9, 12, 5, 8], karakas: ['Jupiter', 'Ketu'], varga: 'D20', adviceEn: 'Deepen learning and inner growth through regular study, reflection, service and a steady spiritual practice.', adviceHi: 'नियमित अध्ययन, आत्मचिंतन, सेवा और साधना से ज्ञान तथा आंतरिक विकास को गहराई दें।' },
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

  const karmicMissionEn = 'Executive Leadership, Wealth Stewardship & Higher Institutional Dharma';
  const karmicMissionHi = 'संगठनात्मक नेतृत्व, स्थायी धन सृजन एवं उच्च संस्थागत धर्म का निर्वाह';

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
    executiveSummaryEn,
    executiveSummaryHi,
    domains,
    birthProfile,
    classicalYogas,
  };
}
