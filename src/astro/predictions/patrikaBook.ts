import { computeAvakahadaChakra, computeBhavaChalitPlacements, computeGhatakChakra } from '../avakahadaChalit';
import { computeAvasthasAndUpagrahas } from '../avasthasUpagrahas';
import { SIGNS, YOGINI_LIST } from '../constants';
import { computeHigherDivisionalCharts, computeBasicDetailsSheet } from '../higherVargas';
import { computeJaiminiReport } from '../jaiminiLalKitab';
import { computeMultiYearCalendar } from '../muhurtaCalendar';
import { computeDeepPanchangMuhurta } from '../panchangMuhurtaDeep';
import { computeGemstoneAndRudraksha } from '../rashifalBabyRudraksha';
import { angularDiffDeg, formatDateDmy, formatDms, formatLocalDateTimeFromUtc, normalizeDeg } from '../time';
import type { BodyPosition, ChartData, DivisionalChartId, NineGrahaId, SevenPlanetId } from '../types';
import { buildSignPlacement } from '../vargas';
import { evaluateParamayusStatus } from './paramayus';
import type { PredictionReport } from './types';

const SIGN_HI = [
  'मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या',
  'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुंभ', 'मीन',
];

const PLANET_HI: Record<string, string> = {
  Asc: 'लग्न',
  Sun: 'सूर्य',
  Moon: 'चंद्र',
  Mars: 'मंगल',
  Mercury: 'बुध',
  Jupiter: 'गुरु',
  Venus: 'शुक्र',
  Saturn: 'शनि',
  Rahu: 'राहु',
  Ketu: 'केतु',
};

const SEVEN_LIST: SevenPlanetId[] = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
const NINE_LIST: NineGrahaId[] = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

const BENEFIC_SET = new Set<NineGrahaId>(['Jupiter', 'Venus', 'Mercury', 'Moon']);

// Classical BPHS 16 Vargas ordered
export const SHODASHA_VARGAS_LIST: Array<{
  id: DivisionalChartId;
  nameEn: string;
  nameHi: string;
  domainEn: string;
  domainHi: string;
  deityBaseEn: string;
  deityBaseHi: string;
}> = [
  { id: 'D1', nameEn: 'Rasi', nameHi: 'राशि (D1)', domainEn: 'Body & Root Destiny', domainHi: 'शरीर व मूल प्रारब्ध', deityBaseEn: 'Zodiac Rasi', deityBaseHi: 'द्वादश राशि चक्र' },
  { id: 'D2', nameEn: 'Hora', nameHi: 'होरा (D2)', domainEn: 'Wealth & Sustenance', domainHi: 'धन व आजीविका', deityBaseEn: 'Deva / Pitri (Surya–Chandra)', deityBaseHi: 'सूर्य-चंद्र होरा' },
  { id: 'D3', nameEn: 'Drekkana', nameHi: 'द्रेष्काण (D3)', domainEn: 'Siblings & Enterprise', domainHi: 'पराक्रम व सहोदर', deityBaseEn: 'Narada / Agastya / Durvasa', deityBaseHi: 'नारद / अगस्त्य / दुर्वासा' },
  { id: 'D4', nameEn: 'Chaturthamsa', nameHi: 'चतुर्थांश (D4)', domainEn: 'Property & Fixed Assets', domainHi: 'संपत्ति व भाग्य', deityBaseEn: 'Sanaka / Sanandana / Kumara / Sanatana', deityBaseHi: 'सनक / सनन्दन / सनातन / सनत्कुमार' },
  { id: 'D5', nameEn: 'Panchamsa', nameHi: 'पंचमांश (D5)', domainEn: 'Fame & Merit', domainHi: 'यश व पुण्य', deityBaseEn: 'Pancha Mahabhoota', deityBaseHi: 'पंच महाभूत' },
  { id: 'D6', nameEn: 'Shashthamsa', nameHi: 'षष्ठांश (D6)', domainEn: 'Health & Litigation', domainHi: 'रोग व शत्रु विजय', deityBaseEn: 'Shada Ripu / Skanda', deityBaseHi: 'स्कंद / षड्-अंश' },
  { id: 'D7', nameEn: 'Saptamsa', nameHi: 'सप्तांश (D7)', domainEn: 'Progeny & Creative Legacy', domainHi: 'संतान व वंश', deityBaseEn: 'Kshara..Suddha Jala', deityBaseHi: 'सप्त सागर देव' },
  { id: 'D8', nameEn: 'Ashtamsa', nameHi: 'अष्टमांश (D8)', domainEn: 'Longevity & Obstacles', domainHi: 'आयु व अकस्मात', deityBaseEn: 'Ashta Vasus', deityBaseHi: 'अष्ट वसु' },
  { id: 'D9', nameEn: 'Navamsa', nameHi: 'नवांश (D9)', domainEn: 'Dharma, Marriage & Inner Strength', domainHi: 'धर्म, विवाह व ग्रह बल', deityBaseEn: 'Deva / Manushya / Rakshasa', deityBaseHi: 'देव / मनुष्य / राक्षस' },
  { id: 'D10', nameEn: 'Dasamsa', nameHi: 'दशमांश (D10)', domainEn: 'Career, Rank & Public Achievement', domainHi: 'करियर, राज्य व प्रतिष्ठा', deityBaseEn: 'Ashta Dikpala + Brahma + Ananta', deityBaseHi: 'दस दिक्पाल देव' },
  { id: 'D11', nameEn: 'Rudramsa', nameHi: 'रुद्रांश (D11)', domainEn: 'Gains & Fulfillment', domainHi: 'लाभ व मनोकामना', deityBaseEn: 'Ekadasha Rudras', deityBaseHi: 'एकादश रुद्र' },
  { id: 'D12', nameEn: 'Dwadasamsa', nameHi: 'द्वादशांश (D12)', domainEn: 'Parents & Heritage', domainHi: 'माता-पिता व पितृ वंश', deityBaseEn: 'Ganesha / Ashwini / Yama / Sarpa', deityBaseHi: 'गणेश / अश्विनी / यम / सर्प' },
  { id: 'D16', nameEn: 'Shodasamsa', nameHi: 'षोडशांश (D16)', domainEn: 'Vehicles & Conveniences', domainHi: 'वाहन व विलासिता', deityBaseEn: 'Brahma / Vishnu / Shiva / Surya', deityBaseHi: 'ब्रह्मा / विष्णु / शिव / सूर्य' },
  { id: 'D20', nameEn: 'Vimsamsa', nameHi: 'विंशांश (D20)', domainEn: 'Devotion & Mantra Sadhana', domainHi: 'उपासना व आध्यात्मिक साधना', deityBaseEn: 'Vimsati Shakti Devis', deityBaseHi: 'विंशति शक्ति / देव' },
  { id: 'D24', nameEn: 'Chaturvimsamsa', nameHi: 'चतुर्विंशांश (D24)', domainEn: 'Education & Scholarship', domainHi: 'उच्च विद्या व विद्वत्ता', deityBaseEn: 'Skanda..Vishwakarma (24 Deities)', deityBaseHi: 'स्कंद आदि 24 विद्या देवता' },
  { id: 'D27', nameEn: 'Saptavimsamsa', nameHi: 'भाम्श (D27)', domainEn: 'Physical & Vital Endurance', domainHi: 'देह-बल व सहनशक्ति', deityBaseEn: '27 Nakshatra Adhidevatas', deityBaseHi: '27 नक्षत्र अधिदेवता' },
  { id: 'D30', nameEn: 'Trimsamsa', nameHi: 'त्रिशांश (D30)', domainEn: 'Mishaps & Karmic Shield', domainHi: 'अरिष्ट निवारण व चरित्र', deityBaseEn: 'Agni / Vayu / Indra / Kubera / Varuna', deityBaseHi: 'अग्नि / वायु / इंद्र / कुबेर / वरुण' },
  { id: 'D40', nameEn: 'Khavedamsa', nameHi: 'खवेदांश (D40)', domainEn: 'Maternal Karmas & Grace', domainHi: 'मातृ-कुल शुभत्व', deityBaseEn: 'Dwadasa Adityas / Shanti', deityBaseHi: 'द्वादश आदित्य / शांति' },
  { id: 'D45', nameEn: 'Akshavedamsa', nameHi: 'अक्षवेदांश (D45)', domainEn: 'Paternal Legacy & Character', domainHi: 'पितृ-कुल व नैतिक बल', deityBaseEn: 'Brahma / Shiva / Vishnu', deityBaseHi: 'ब्रह्मा / शिव / विष्णु' },
  { id: 'D60', nameEn: 'Shashtiamsa', nameHi: 'षष्ट्यंश (D60)', domainEn: 'Root Past-Life Prarabdha', domainHi: 'पूर्व जन्म कर्म व मूल फल', deityBaseEn: '60 Parashari Amsa Deities', deityBaseHi: '60 पाराशरी षष्ट्यंश देवता' },
];

const SHODASH_CLASSICAL_16: DivisionalChartId[] = [
  'D1', 'D2', 'D3', 'D4', 'D7', 'D9', 'D10', 'D12',
  'D16', 'D20', 'D24', 'D27', 'D30', 'D40', 'D45', 'D60',
];

const PARASHARI_AMSAS_16: Record<DivisionalChartId, string[]> = {
  D1: ['Mesha', 'Vrisha', 'Mithuna', 'Karka', 'Simha', 'Kanya', 'Tula', 'Vrishchika', 'Dhanu', 'Makara', 'Kumbha', 'Meena'],
  D2: ['Deva (Surya)', 'Pitri (Chandra)'],
  D3: ['Narada', 'Agastya', 'Durvasa'],
  D4: ['Sanaka', 'Sanandana', 'Sanatkumara', 'Sanatana'],
  D5: ['Prithvi', 'Jala', 'Tejas', 'Vayu', 'Akasha'],
  D6: ['Skanda', 'Kubera', 'Brihaspati', 'Yama', 'Agni', 'Varuna'],
  D7: ['Kshara', 'Kshira', 'Dadhi', 'Ghrita', 'Ikshurasa', 'Madya', 'Suddha Jala'],
  D8: ['Dhara', 'Anala', 'Anila', 'Apa', 'Pratyusha', 'Prabhasa', 'Soma', 'Dhruva'],
  D9: ['Deva (auspicious)', 'Manushya (effort)', 'Rakshasa (fierce)'],
  D10: ['Indra', 'Agni', 'Yama', 'Rakshasa', 'Varuna', 'Vayu', 'Kubera', 'Ishana', 'Brahma', 'Ananta'],
  D11: ['Kapali', 'Pingala', 'Bhima', 'Virupaksha', 'Vilohita', 'Shasta', 'Ajapada', 'Ahirbudhnya', 'Shambhu', 'Chanda', 'Bhava'],
  D12: ['Ganesha', 'Ashwini Kumar', 'Yama', 'Sarpa'],
  D16: ['Brahma', 'Vishnu', 'Shiva', 'Surya'],
  D20: ['Kali', 'Gauri', 'Jaya', 'Lakshmi', 'Vijaya', 'Vimala', 'Sati', 'Tara', 'Jwalamukhi', 'Shweta', 'Lalita', 'Bagalamukhi', 'Pratyangira', 'Shachi', 'Raudri', 'Bhavani', 'Varada', 'Jaya', 'Tripura', 'Sumukhi'],
  D24: ['Skanda', 'Parashudhara', 'Anala', 'Vishwakarma', 'Bhaga', 'Mitra', 'Maya', 'Antaka', 'Vrishadhvaja', 'Govinda', 'Madana', 'Bhima'],
  D27: ['Ashwini', 'Yama', 'Agni', 'Brahma', 'Chandra', 'Rudra', 'Aditi', 'Brihaspati', 'Sarpa', 'Pitri', 'Bhaga', 'Aryama', 'Surya', 'Twashta', 'Vayu', 'Indragni', 'Mitra', 'Indra', 'Nirrti', 'Apah', 'Vishwadeva', 'Vishnu', 'Vasu', 'Varuna', 'Aja Ekapada', 'Ahirbudhnya', 'Pushan'],
  D30: ['Agni', 'Vayu', 'Indra', 'Kubera', 'Varuna'],
  D40: ['Vishnu', 'Chandra', 'Marichi', 'Twashta', 'Dhata', 'Shiva', 'Ravi', 'Yama', 'Yaksha', 'Gandharva', 'Kala', 'Varuna'],
  D45: ['Brahma', 'Shiva', 'Vishnu'],
  D60: [
    'Ghora', 'Rakshasa', 'Deva', 'Kubera', 'Yaksha', 'Kinnara', 'Bhrashta', 'Kulaghna', 'Garala', 'Vahni',
    'Maya', 'Purishaka', 'Apampati', 'Marutwan', 'Kala', 'Sarpa', 'Amrita', 'Indu', 'Mridu', 'Komala',
    'Heramba', 'Brahma', 'Vishnu', 'Maheshwara', 'Deva', 'Ardra', 'Kalinasa', 'Kshitishwara', 'Kamalakara', 'Gulika',
    'Mrityu', 'Kala', 'Davagni', 'Ghora', 'Yama', 'Kantaka', 'Suddha', 'Amrita', 'Purnachandra', 'Vishadagdha',
    'Kulanasa', 'Vamsakshaya', 'Utpata', 'Kala', 'Saumya', 'Komala', 'Sheetala', 'Karaladamshtra', 'Chandramukhi', 'Praveena',
    'Kalapavaka', 'Dandayudha', 'Nirmala', 'Saumya', 'Krura', 'Atisheetala', 'Amrita', 'Payodhi', 'Bhramana', 'Chandrarekha',
  ],
};

function getDivisionalAmsaInfo(vargaId: DivisionalChartId, signIndex: number, degreeInSign: number) {
  const divMap: Record<DivisionalChartId, number> = {
    D1: 1, D2: 2, D3: 3, D4: 4, D5: 5, D6: 6, D7: 7, D8: 8, D9: 9, D10: 10,
    D11: 11, D12: 12, D16: 16, D20: 20, D24: 24, D27: 27, D30: 30, D40: 40, D45: 45, D60: 60,
  };
  const parts = divMap[vargaId] ?? 1;
  const partIdx = Math.min(parts - 1, Math.max(0, Math.floor((degreeInSign / 30) * parts)));
  const amsaList = PARASHARI_AMSAS_16[vargaId] ?? ['Varga'];
  const isOdd = signIndex % 2 === 0;
  const effIdx = isOdd ? partIdx : parts - 1 - partIdx;
  const deity = amsaList[effIdx % amsaList.length];
  return { amsaNumber: partIdx + 1, deity };
}

function getVaiseshikamshaName(count: number): { en: string; hi: string } {
  if (count >= 12) return { en: 'Suryakanta / Kalpavriksha', hi: 'सूर्यकांत / कल्पवृक्षांशा' };
  if (count === 11) return { en: 'Kanduka / Airavata', hi: 'कंदुक / ऐरावतांश' };
  if (count === 10) return { en: 'Sridhama', hi: 'श्रीधामांश' };
  if (count === 9) return { en: 'Sakravahana', hi: 'शक्रवाहनांश' };
  if (count === 8) return { en: 'Brahmaloka', hi: 'ब्रह्मलोकांश' };
  if (count === 7) return { en: 'Devaloka', hi: 'देवलोकांश' };
  if (count === 6) return { en: 'Paravata', hi: 'पारावतांश' };
  if (count === 5) return { en: 'Simhasana', hi: 'सिंहासनांश' };
  if (count === 4) return { en: 'Gopura', hi: 'गोपुरांश' };
  if (count === 3) return { en: 'Uttama', hi: 'उत्तमांश' };
  if (count === 2) return { en: 'Parijata', hi: 'पारिजातांश' };
  return { en: 'Samanya (Standard)', hi: 'सामान्य (प्रयास-साध्य)' };
}

export interface PatrikaShodashaRow {
  vargaId: DivisionalChartId;
  nameEn: string;
  nameHi: string;
  domainEn: string;
  domainHi: string;
  lagnaSignIndex: number;
  planets: Record<SevenPlanetId, { signIndex: number; dignity: string; amsaDeity: string }>;
}

export interface PatrikaVaiseshikamshaRow {
  planet: SevenPlanetId;
  strongCount: number;
  vargaIdsStrong: string[];
  titleEn: string;
  titleHi: string;
  vimshopakaScore: number;
}

export interface PatrikaSavHouseRow {
  house: number;
  signIndex: number;
  bindus: number;
  rank: number;
  tierEn: string;
  tierHi: string;
  predictionEn: string;
  predictionHi: string;
}

export interface PatrikaShodhanaRow {
  planet: SevenPlanetId;
  rawTotal: number;
  afterTrikona: number;
  shodhitaTotal: number;
  retentionPct: number;
  rasiPinda: number;
  grahaPinda: number;
  sodhyaPinda: number;
}

export interface PatrikaAvasthaNarrative {
  planet: NineGrahaId;
  baladiEn: string;
  baladiHi: string;
  lajjitadiEn: string;
  lajjitadiHi: string;
  sayanadiEn: string;
  sayanadiHi: string;
  subStateEn: string;
  subStateHi: string;
  interpretationEn: string;
  interpretationHi: string;
}

export interface PatrikaSpecialPointReading {
  id: string;
  nameEn: string;
  nameHi: string;
  signIndex: number;
  dms: string;
  house: number;
  extraEn: string;
  extraHi: string;
  readingEn: string;
  readingHi: string;
}

export interface PatrikaDashaSupportRow {
  planet: NineGrahaId;
  intelligence: number;
  efficiency: number;
  loveFamily: number;
  health: number;
  social: number;
  career: number;
  finance: number;
  average: number;
  verdictEn: string;
  verdictHi: string;
}

export interface PatrikaAntardashaComp {
  lord: string;
  startDmy: string;
  endDmy: string;
  isCurrent: boolean;
  focusScore: number;
  verdictEn: string;
  verdictHi: string;
  summaryEn: string;
  summaryHi: string;
}

export interface PatrikaHouseBookChapter {
  houseNumber: number;
  signIndex: number;
  titleEn: string;
  titleHi: string;
  lordPlanet: SevenPlanetId;
  lordPlacedHouse: number;
  savBindus: number;
  score: number;
  signResultEn: string;
  signResultHi: string;
  aspectsResultEn: string;
  aspectsResultHi: string;
  lordResultEn: string;
  lordResultHi: string;
  topicHeadingEn: string;
  topicHeadingHi: string;
  topicReadingEn: string;
  topicReadingHi: string;
  occupantsAdviceEn: string;
  occupantsAdviceHi: string;
  remediesEn: string;
  remediesHi: string;
}

export interface PatrikaGemTierItem {
  planet: SevenPlanetId;
  gemEn: string;
  gemHi: string;
  tier: 'Recommended' | 'Worth Considering' | 'Use With Caution' | 'Best Avoided';
  tierHi: string;
  lordHouses: number[];
  reasonEn: string;
  reasonHi: string;
}

export interface PatrikaBookData {
  paramayusLocked: boolean;
  panchangaMeta: {
    kaliyugaYear: number;
    shakaSamvat: number;
    vikramSamvat: number;
    samvatsaraEn: string;
    samvatsaraHi: string;
    ayanaEn: string;
    ayanaHi: string;
    rituEn: string;
    rituHi: string;
    masaEn: string;
    masaHi: string;
    dayDuration: string;
    yoginiBirthBalanceEn: string;
    yoginiBirthBalanceHi: string;
    avakahada: ReturnType<typeof computeAvakahadaChakra>;
    ghatak: ReturnType<typeof computeGhatakChakra>;
    chalit: ReturnType<typeof computeBhavaChalitPlacements>;
    basicSheet: ReturnType<typeof computeBasicDetailsSheet>;
    higherVargas: ReturnType<typeof computeHigherDivisionalCharts>;
  };
  shodashaDeities: PatrikaShodashaRow[];
  vaiseshikamsha: PatrikaVaiseshikamshaRow[];
  specialPoints: PatrikaSpecialPointReading[];
  savAnalysis: {
    houses: PatrikaSavHouseRow[];
    shodhana: PatrikaShodhanaRow[];
    lifeAreas: Array<{ nameEn: string; nameHi: string; houses: string; score: number; statusEn: string; statusHi: string }>;
    oppositeBalance: Array<{ pair: string; leftHouse: number; leftPts: number; rightHouse: number; rightPts: number; diff: number; noteEn: string; noteHi: string }>;
  };
  avasthaNarratives: PatrikaAvasthaNarrative[];
  jaiminiExtended: ReturnType<typeof computeJaiminiReport> & {
    ishtaDevataPlanet: string;
    ishtaDevataFormEn: string;
    ishtaDevataFormHi: string;
    mokshaIndexPct: number;
    purushartha: { dharma: number; artha: number; kama: number; moksha: number };
  };
  dashaSupportIndex: {
    rows: PatrikaDashaSupportRow[];
    activeAntardashas: PatrikaAntardashaComp[];
    yoginiPeriods: Array<{ yogini: string; lord: string; startDmy: string; endDmy: string; years: number; isCurrent: boolean; noteEn: string; noteHi: string }>;
  };
  doshasAndGems: {
    manglikLagna: boolean;
    manglikMoon: boolean;
    manglikVenus: boolean;
    manglikMitigationsEn: string[];
    manglikMitigationsHi: string[];
    putraShaapa: {
      statusEn: string;
      statusHi: string;
      typeEn: string;
      typeHi: string;
      detailEn: string;
      detailHi: string;
      remedyEn: string;
      remedyHi: string;
    };
    parivartana: Array<{ typeEn: string; typeHi: string; p1: SevenPlanetId; p2: SevenPlanetId; houses: string; noteEn: string; noteHi: string }>;
    gemTiers: PatrikaGemTierItem[];
    gemReport: ReturnType<typeof computeGemstoneAndRudraksha>;
  };
  horoscopeChapters: {
    panchangaPhalEn: string;
    panchangaPhalHi: string;
    lagnaSections: Array<{ titleEn: string; titleHi: string; bodyEn: string; bodyHi: string }>;
    ascDivisionalReadings: Array<{ vargaId: string; titleEn: string; titleHi: string; signIdx: number; textEn: string; textHi: string }>;
    houseChapters: PatrikaHouseBookChapter[];
    rahuKetuNakshatra: {
      rahuSign: number;
      rahuHouse: number;
      rahuNakshatra: string;
      rahuReadingEn: string;
      rahuReadingHi: string;
      ketuSign: number;
      ketuHouse: number;
      ketuNakshatra: string;
      ketuReadingEn: string;
      ketuReadingHi: string;
    };
    gochar10Years: Array<{
      planet: string;
      dateRange: string;
      signName: string;
      houseFromMoon: number;
      phaseTag: string;
      readingEn: string;
      readingHi: string;
    }>;
  };
}

const HOUSE_TOPIC_LABELS: Array<{ en: string; hi: string }> = [
  { en: 'Identity, Vitality & Early Impressions', hi: 'व्यक्तित्व, स्वास्थ्य एवं जीवन-दिशा' },
  { en: 'Family Wealth, Values & Early Voice', hi: 'संचित धन, वाणी व कुटुंब संस्कार' },
  { en: 'Initiative, Courage, Skills & Siblings', hi: 'साहस, स्व-प्रयास, लेखन व भाई-बहन' },
  { en: 'Education Foundation, Mother & Domestic Peace', hi: 'प्रारंभिक शिक्षा, माता, भूमि-भवन व सुख' },
  { en: 'Higher Learning, Creativity, Romance & Children', hi: 'बुद्धि, प्रेम, उच्च रचनात्मकता व संतान सुख' },
  { en: 'Health Recovery, Daily Routine & Competitive Victory', hi: 'स्वास्थ्य प्रबंधन, सेवा व शत्रु-ऋण विजय' },
  { en: 'Marriage, Life Partner & Strategic Partnerships', hi: 'विवाह, जीवनसाथी व व्यापारिक साझेदारी' },
  { en: 'Transformation, Shared Finance, Research & Longevity', hi: 'दीर्घायु, गहन शोध व आकस्मिक बदलाव' },
  { en: 'Fortune, Father, Mentorship & Spiritual Dharma', hi: 'भाग्योदय, पिता, गुरु कृपा व उच्च यात्रा' },
  { en: 'Career Peak, Authority, Reputation & Karma', hi: 'करियर शिखर, प्रशासन व सामाजिक सम्मान' },
  { en: 'Income Streams, Promotions & Fulfillment of Desires', hi: 'नियमित आय, लाभ व मनोकामना सिद्धि' },
  { en: 'Foreign Connections, Rest, Expenditure & Liberation', hi: 'विदेश गमन, खर्च संतुलन व मोक्ष-आध्यात्म' },
];

const ISHTA_FORMS: Record<string, { en: string; hi: string }> = {
  Sun: { en: 'Lord Rama / Surya Narayana', hi: 'भगवान श्री राम / सूर्य नारायण' },
  Moon: { en: 'Lord Krishna / Maa Gauri', hi: 'भगवान श्री कृष्ण / माता गौरी' },
  Mars: { en: 'Lord Hanuman / Kartikeya', hi: 'श्री हनुमान जी / कार्तिकेय जी' },
  Mercury: { en: 'Lord Vishnu / Narayana', hi: 'भगवान श्री विष्णु / नारायण' },
  Jupiter: { en: 'Lord Dakshinamurthy / Vamana', hi: 'श्री दक्षिणामूर्ति / वामन भगवान' },
  Venus: { en: 'Maa Mahalakshmi / Parashurama', hi: 'माँ महालक्ष्मी / परशुराम जी' },
  Saturn: { en: 'Lord Shiva / Narasimha / Bhairava', hi: 'भगवान शिव / नृसिंह / काल भैरव' },
  Rahu: { en: 'Maa Durga / Varaha', hi: 'माँ दुर्गा / वराह भगवान' },
  Ketu: { en: 'Lord Ganesha / Matsya', hi: 'श्री गणेश जी / मत्स्य भगवान' },
};

function getHousesRuledBy(planet: SevenPlanetId, ascSignIndex: number): number[] {
  const houses: number[] = [];
  for (let h = 1; h <= 12; h++) {
    const s = (ascSignIndex + h - 1) % 12;
    if (SIGNS[s].lord === planet) houses.push(h);
  }
  return houses;
}

function getAspectingGrahasOnHouse(chart: ChartData, houseNum: number): NineGrahaId[] {
  const res: NineGrahaId[] = [];
  for (const p of chart.planets) {
    if (!NINE_LIST.includes(p.id as NineGrahaId)) continue;
    const dist = ((houseNum - p.rasiHouseNumber + 12) % 12) + 1;
    if (dist === 7) res.push(p.id as NineGrahaId);
    else if (p.id === 'Mars' && (dist === 4 || dist === 8)) res.push(p.id);
    else if ((p.id === 'Jupiter' || p.id === 'Rahu' || p.id === 'Ketu') && (dist === 5 || dist === 9)) {
      res.push(p.id as NineGrahaId);
    } else if (p.id === 'Saturn' && (dist === 3 || dist === 10)) res.push(p.id);
  }
  return res;
}

function computeInduLagna(chart: ChartData): { signIndex: number; house: number } {
  const kalas: Record<SevenPlanetId, number> = {
    Sun: 30, Moon: 16, Mars: 6, Mercury: 8, Jupiter: 10, Venus: 12, Saturn: 1,
  };
  const asc9Lord = SIGNS[(chart.ascendant.signIndex + 8) % 12].lord;
  const moon = chart.planets.find((p) => p.id === 'Moon')!;
  const moon9Lord = SIGNS[(moon.signIndex + 8) % 12].lord;
  const sum = kalas[asc9Lord] + kalas[moon9Lord];
  let rem = sum % 12;
  if (rem === 0) rem = 12;
  const induSign = (moon.signIndex + rem - 1) % 12;
  const house = ((induSign - chart.ascendant.signIndex + 12) % 12) + 1;
  return { signIndex: induSign, house };
}

export function computePatrikaBookData(
  chart: ChartData,
  forecastDate: string,
  report: PredictionReport
): PatrikaBookData {
  const paramayus = evaluateParamayusStatus(chart, forecastDate);
  const byId = new Map<string, BodyPosition>(chart.planets.map((p) => [p.id, p]));
  const ascSign = chart.ascendant.signIndex;
  const sun = byId.get('Sun')!;
  const moon = byId.get('Moon')!;
  const rahu = byId.get('Rahu')!;
  const ketu = byId.get('Ketu')!;

  const avakahada = computeAvakahadaChakra(chart);
  const ghatak = computeGhatakChakra(moon.signIndex);
  const chalit = computeBhavaChalitPlacements(chart);
  const basicSheet = computeBasicDetailsSheet(chart);
  const higherVargas = computeHigherDivisionalCharts(chart);
  const deepPanchang = computeDeepPanchangMuhurta(
    chart.input.date,
    chart.input.time,
    chart.input.latitude,
    chart.input.longitude,
    chart.offsetMinutesUsed,
    chart.settings,
    'purnimanta',
    chart
  );
  const birthYear = parseInt(chart.input.date.slice(0, 4), 10) || 2000;
  const kaliyugaYear = birthYear + 3101;

  // Yogini birth balance from nakshatra elapsed %
  const yogIdx = (chart.panchang.nakshatra.index + 3) % 8;
  const activeYog = YOGINI_LIST[yogIdx];
  const yogRemYrs = activeYog.years * (chart.panchang.nakshatra.percentRemaining / 100);
  const yy = Math.floor(yogRemYrs);
  const mm = Math.floor((yogRemYrs - yy) * 12);
  const dd = Math.round(((yogRemYrs - yy) * 12 - mm) * 30);

  // 1. Shodasha Varga Deities & Vaiseshikamsha
  const shodashaDeities: PatrikaShodashaRow[] = SHODASHA_VARGAS_LIST.map((v) => {
    const vChart = chart.divisionalCharts[v.id];
    const planets = {} as PatrikaShodashaRow['planets'];
    for (const pId of SEVEN_LIST) {
      const pl = vChart.placements.find((x) => x.id === pId)!;
      const amsa = getDivisionalAmsaInfo(v.id, pl.signIndex, pl.degreeInSign);
      planets[pId] = {
        signIndex: pl.signIndex,
        dignity: pl.dignity,
        amsaDeity: `${amsa.deity} (#${amsa.amsaNumber})`,
      };
    }
    return {
      vargaId: v.id,
      nameEn: v.nameEn,
      nameHi: v.nameHi,
      domainEn: v.domainEn,
      domainHi: v.domainHi,
      lagnaSignIndex: vChart.lagnaSignIndex,
      planets,
    };
  });

  const vaiseshikamsha: PatrikaVaiseshikamshaRow[] = SEVEN_LIST.map((pId) => {
    const strongIds: string[] = [];
    for (const vId of SHODASH_CLASSICAL_16) {
      const pl = chart.divisionalCharts[vId].placements.find((x) => x.id === pId);
      if (pl && ['Exalted', 'Moolatrikona', 'Own Sign'].includes(pl.dignity)) {
        strongIds.push(vId);
      }
    }
    const title = getVaiseshikamshaName(strongIds.length);
    return {
      planet: pId,
      strongCount: strongIds.length,
      vargaIdsStrong: strongIds,
      titleEn: title.en,
      titleHi: title.hi,
      vimshopakaScore: chart.vimshopakaShodash[pId] ?? 10,
    };
  });

  // 2. Special Points Extended
  const avUp = computeAvasthasAndUpagrahas(chart);
  const indu = computeInduLagna(chart);
  const mandiPt = chart.specialPoints.find((sp) => sp.id === 'Mandi');
  const gulikaLon = mandiPt ? mandiPt.longitude : normalizeDeg(ascSign * 30 + 180);

  const yogiLon = normalizeDeg(sun.longitude + moon.longitude + 93 + 20 / 60);
  const yogiPl = buildSignPlacement(yogiLon);
  const avayogiLon = normalizeDeg(yogiLon + 186 + 40 / 60);
  const avayogiPl = buildSignPlacement(avayogiLon);
  const sreeLon = normalizeDeg(chart.ascendant.longitude + (chart.panchang.nakshatra.percentElapsed / 100) * 360);
  const sreePl = buildSignPlacement(sreeLon);
  const trisphutaLon = normalizeDeg(chart.ascendant.longitude + moon.longitude + gulikaLon);
  const trisphutaPl = buildSignPlacement(trisphutaLon);
  const pranaLon = normalizeDeg(5 * chart.ascendant.longitude + gulikaLon);
  const pranaPl = buildSignPlacement(pranaLon);
  const dehaLon = normalizeDeg(8 * moon.longitude + gulikaLon);
  const dehaPl = buildSignPlacement(dehaLon);
  const mrityuLon = normalizeDeg(8 * gulikaLon + sun.longitude);
  const mrityuPl = buildSignPlacement(mrityuLon);
  const nav64Sign = (chart.divisionalCharts.D9.placements.find((x) => x.id === 'Moon')!.signIndex + 3) % 12;

  const findSp = (id: 'BL' | 'HL' | 'GL') => chart.specialPoints.find((s) => s.id === id);
  const spList: Array<{
    id: string; nameEn: string; nameHi: string; signIndex: number; dms: string; house: number;
    extraEn: string; extraHi: string; readingEn: string; readingHi: string;
  }> = [
    ...(findSp('BL')
      ? [{
          id: 'BL', nameEn: 'Bhava Lagna', nameHi: 'भाव लग्न',
          signIndex: findSp('BL')!.signIndex, dms: findSp('BL')!.shortDms, house: findSp('BL')!.houseNumber,
          extraEn: `Lord: ${findSp('BL')!.signLord}`, extraHi: `स्वामी: ${PLANET_HI[findSp('BL')!.signLord]}`,
          readingEn: `Bhava Lagna in ${SIGNS[findSp('BL')!.signIndex].name} (H${findSp('BL')!.houseNumber}) highlights where your instinctual reputation and core willpower radiate naturally.`,
          readingHi: `${SIGNS[findSp('BL')!.signIndex].name} में भाव लग्न (भाव ${findSp('BL')!.houseNumber}) दर्शाता है कि आपका सहज प्रभाव और आत्मबल किस क्षेत्र में स्वाभाविक रूप से चमकता है।`,
        }]
      : []),
    ...(findSp('HL')
      ? [{
          id: 'HL', nameEn: 'Hora Lagna', nameHi: 'होरा लग्न',
          signIndex: findSp('HL')!.signIndex, dms: findSp('HL')!.shortDms, house: findSp('HL')!.houseNumber,
          extraEn: `Lord: ${findSp('HL')!.signLord}`, extraHi: `स्वामी: ${PLANET_HI[findSp('HL')!.signLord]}`,
          readingEn: `Hora Lagna in ${SIGNS[findSp('HL')!.signIndex].name} (H${findSp('HL')!.houseNumber}) governs financial accumulation channels; periods of its lord/aspects unlock monetary flow.`,
          readingHi: `${SIGNS[findSp('HL')!.signIndex].name} में होरा लग्न (भाव ${findSp('HL')!.houseNumber}) आपके धन संचय और आर्थिक समृद्धि का प्रमुख केंद्र है; इसके स्वामी की दशा में विशेष लाभ होता है।`,
        }]
      : []),
    ...(findSp('GL')
      ? [{
          id: 'GL', nameEn: 'Ghatika Lagna', nameHi: 'घटिका लग्न',
          signIndex: findSp('GL')!.signIndex, dms: findSp('GL')!.shortDms, house: findSp('GL')!.houseNumber,
          extraEn: `Lord: ${findSp('GL')!.signLord}`, extraHi: `स्वामी: ${PLANET_HI[findSp('GL')!.signLord]}`,
          readingEn: `Ghatika Lagna in ${SIGNS[findSp('GL')!.signIndex].name} (H${findSp('GL')!.houseNumber}) reveals seats of authority, administrative clout, and public leadership.`,
          readingHi: `${SIGNS[findSp('GL')!.signIndex].name} में घटिका लग्न (भाव ${findSp('GL')!.houseNumber}) सत्ता, प्रशासनिक अधिकार व समाज में नेतृत्व-क्षमता को दर्शाता है।`,
        }]
      : []),
    {
      id: 'Indu', nameEn: 'Indu Lagna (Wealth Point)', nameHi: 'इंदु लग्न (धन बिंदु)',
      signIndex: indu.signIndex, dms: '0°00\' (Sign)', house: indu.house,
      extraEn: `Lord: ${SIGNS[indu.signIndex].lord}`, extraHi: `स्वामी: ${PLANET_HI[SIGNS[indu.signIndex].lord]}`,
      readingEn: `Indu Lagna sits in H${indu.house} (${SIGNS[indu.signIndex].name}). Benefics occupying or aspecting Indu Lagna bring sustained prosperity during their Dashas.`,
      readingHi: `इंदु लग्न कुंडली के ${indu.house}वें भाव (${SIGN_HI[indu.signIndex]}) में है। इस स्थान पर स्थित या दृष्ट शुभ ग्रहों की दशा में स्थायी समृद्धि प्राप्त होती है।`,
    },
    {
      id: 'Yogi', nameEn: 'Yogi & Sahayogi', nameHi: 'योगी एवं सह-योगी',
      signIndex: yogiPl.signIndex, dms: yogiPl.shortDms, house: ((yogiPl.signIndex - ascSign + 12) % 12) + 1,
      extraEn: `Yogi: ${yogiPl.nakshatraLord} · Sahayogi: ${yogiPl.signLord}`,
      extraHi: `योगी: ${PLANET_HI[yogiPl.nakshatraLord]} · सह-योगी: ${PLANET_HI[yogiPl.signLord]}`,
      readingEn: `${yogiPl.nakshatraLord} (Yogi) and ${yogiPl.signLord} (Sahayogi) act as hidden fortune accelerators — their Dashas and gemstones amplify luck markedly.`,
      readingHi: `योगी ग्रह ${PLANET_HI[yogiPl.nakshatraLord]} तथा सह-योगी ${PLANET_HI[yogiPl.signLord]} आपके भाग्योदय के गुप्त सहायक हैं; इनकी दशाएँ शुभ फल देती हैं।`,
    },
    {
      id: 'Avayogi', nameEn: 'Avayogi Point', nameHi: 'अवयोगी बिंदु',
      signIndex: avayogiPl.signIndex, dms: avayogiPl.shortDms, house: ((avayogiPl.signIndex - ascSign + 12) % 12) + 1,
      extraEn: `Avayogi: ${avayogiPl.nakshatraLord}`, extraHi: `अवयोगी: ${PLANET_HI[avayogiPl.nakshatraLord]}`,
      readingEn: `${avayogiPl.nakshatraLord} rules the Avayogi arc — periods of ${avayogiPl.nakshatraLord} demand patience, measured speculation, and humility before rapid expansion.`,
      readingHi: `अवयोगी स्वामी ${PLANET_HI[avayogiPl.nakshatraLord]} की दशा-अंतरदशा में जोखिम भरे निर्णयों में सावधानी, धैर्य और सतर्कता रखना हितकर रहता है।`,
    },
    {
      id: 'BB', nameEn: 'Bhrigu Bindu', nameHi: 'भृगु बिंदु',
      signIndex: buildSignPlacement(avUp.bhriguBindu.longitude).signIndex, dms: avUp.bhriguBindu.dms, house: avUp.bhriguBindu.house,
      extraEn: `Nakshatra: ${buildSignPlacement(avUp.bhriguBindu.longitude).nakshatraName}`,
      extraHi: `नक्षत्र: ${buildSignPlacement(avUp.bhriguBindu.longitude).nakshatraName}`,
      readingEn: avUp.bhriguBindu.note,
      readingHi: `भृगु बिंदु ${SIGN_HI[buildSignPlacement(avUp.bhriguBindu.longitude).signIndex]} (भाव ${avUp.bhriguBindu.house}) में है। जब भी गुरु, शनि या राहु-केतु इस अंश से गोचर करते हैं, जीवन में निर्णायक मोड़ आता है।`,
    },
    {
      id: 'Sree', nameEn: 'Sree Lagna', nameHi: 'श्री लग्न',
      signIndex: sreePl.signIndex, dms: sreePl.shortDms, house: ((sreePl.signIndex - ascSign + 12) % 12) + 1,
      extraEn: `Lord: ${sreePl.signLord}`, extraHi: `स्वामी: ${PLANET_HI[sreePl.signLord]}`,
      readingEn: `Sree Lagna in H${((sreePl.signIndex - ascSign + 12) % 12) + 1} measures Goddess Lakshmi's grace via Sudasa and prosperity cycles.`,
      readingHi: `${SIGN_HI[sreePl.signIndex]} (भाव ${((sreePl.signIndex - ascSign + 12) % 12) + 1}) में श्री लग्न लक्ष्मी कृपा, मान-सम्मान व आर्थिक स्थिरता का संकेतक है।`,
    },
    {
      id: 'Gulika', nameEn: 'Gulika / Maandi (Karmic Knot)', nameHi: 'गुलिक / मांदी (कर्म गांठ)',
      signIndex: buildSignPlacement(gulikaLon).signIndex, dms: formatDms(buildSignPlacement(gulikaLon).degreeInSign, false),
      house: ((buildSignPlacement(gulikaLon).signIndex - ascSign + 12) % 12) + 1,
      extraEn: `Sign Lord: ${buildSignPlacement(gulikaLon).signLord}`, extraHi: `राशीश: ${PLANET_HI[buildSignPlacement(gulikaLon).signLord]}`,
      readingEn: `Maandi/Gulika in H${((buildSignPlacement(gulikaLon).signIndex - ascSign + 12) % 12) + 1} acts like subtle Saturnian karma — discipline in health, diet, and boundaries removes chronic friction.`,
      readingHi: `${((buildSignPlacement(gulikaLon).signIndex - ascSign + 12) % 12) + 1}वें भाव में मांदी/गुलिक अनुशासन व सेवा द्वारा पूर्व-कर्मों की शुद्धि एवं आरोग्य संरक्षण का संदेश देता है।`,
    },
    {
      id: 'Trisphuta', nameEn: 'Trisphuta (Prana/Deha Composite)', nameHi: 'त्रिस्फुट (लग्न + चंद्र + गुलिक)',
      signIndex: trisphutaPl.signIndex, dms: trisphutaPl.shortDms, house: ((trisphutaPl.signIndex - ascSign + 12) % 12) + 1,
      extraEn: `Prana: ${SIGN_HI[pranaPl.signIndex]} · Deha: ${SIGN_HI[dehaPl.signIndex]}`,
      extraHi: `प्राण: ${SIGN_HI[pranaPl.signIndex]} · देह: ${SIGN_HI[dehaPl.signIndex]}`,
      readingEn: `Trisphuta (${trisphutaPl.signName} ${trisphutaPl.shortDms}), Prana Sphuta (${pranaPl.signName}), Deha Sphuta (${dehaPl.signName}), and Mrityu Sphuta (${mrityuPl.signName}) synthesize body-mind vitality and crisis alerts during malefic transits.`,
      readingHi: `त्रिस्फुट (${SIGN_HI[trisphutaPl.signIndex]}), प्राण स्फुट (${SIGN_HI[pranaPl.signIndex]}), देह स्फुट (${SIGN_HI[dehaPl.signIndex]}) एवं मृत्यु स्फुट (${SIGN_HI[mrityuPl.signIndex]}) शारीरिक ऊर्जा और स्वास्थ्य संवेदनशीलता के सूक्ष्म बिंदु हैं।`,
    },
    {
      id: '64D9', nameEn: '64th Navamsa (Khara D9)', nameHi: '64वां नवांश (खर नवांश)',
      signIndex: nav64Sign, dms: 'D9 Trigger', house: ((nav64Sign - ascSign + 12) % 12) + 1,
      extraEn: `Khara Lord: ${SIGNS[nav64Sign].lord}`, extraHi: `स्वामी: ${PLANET_HI[SIGNS[nav64Sign].lord]}`,
      readingEn: `64th Navamsa falls in ${SIGNS[nav64Sign].name} (lord ${SIGNS[nav64Sign].lord}). Whenever heavy planets or Rahu/Ketu occupy or transit this sign, major health/life resets ask for preventive care.`,
      readingHi: `64वां नवांश ${SIGN_HI[nav64Sign]} (स्वामी ${PLANET_HI[SIGNS[nav64Sign].lord]}) में है; इसके स्वामी की दशा या इस राशि में शनि-राहु गोचर में स्वास्थ्य एवं सतर्कता लाभकारी रहती है।`,
    },
  ];

  // 3. SAV 12 Houses + Shodhana Retention + Sodhya Pinda
  const sarvaByHouse = Array.from({ length: 12 }, (_, idx) => ({
    house: idx + 1,
    signIndex: (ascSign + idx) % 12,
    bindus: chart.ashtakavarga.sarva[(ascSign + idx) % 12],
  }));
  const sortedRanks = [...sarvaByHouse].sort((a, b) => b.bindus - a.bindus);
  const savHouses: PatrikaSavHouseRow[] = sarvaByHouse.map((row) => {
    const rank = sortedRanks.findIndex((x) => x.house === row.house) + 1;
    const isStrong = row.bindus >= 30;
    const isLow = row.bindus <= 24;
    const topic = HOUSE_TOPIC_LABELS[row.house - 1];
    return {
      house: row.house,
      signIndex: row.signIndex,
      bindus: row.bindus,
      rank,
      tierEn: isStrong ? 'Strong (≥30)' : isLow ? 'Effort Needed (≤24)' : 'Balanced (25–29)',
      tierHi: isStrong ? 'प्रबल (≥30)' : isLow ? 'परिश्रम साध्य (≤24)' : 'संतुलित (25–29)',
      predictionEn: isStrong
        ? `High SAV (${row.bindus} bindus, Rank #${rank}) strongly blesses ${topic.en.toLowerCase()}, buffering challenging transits.`
        : isLow
          ? `Moderate-low SAV (${row.bindus} bindus, Rank #${rank}) advises deliberate strategy and consistency in ${topic.en.toLowerCase()}.`
          : `Healthy SAV (${row.bindus} bindus, Rank #${rank}) delivers steady progress in ${topic.en.toLowerCase()} proportional to effort.`,
      predictionHi: isStrong
        ? `उच्च सर्वाष्टकवर्ग (${row.bindus} बिंदु, क्रम #${rank}) से "${topic.hi}" में सहज सफलता और प्रतिकूल गोचर से सुरक्षा मिलती है।`
        : isLow
          ? `कम सर्वाष्टकवर्ग (${row.bindus} बिंदु, क्रम #${rank}) दर्शाता है कि "${topic.hi}" में अनुशासन, योजना और धैर्य से ही स्थायी लाभ होगा।`
          : `संतुलित सर्वाष्टकवर्ग (${row.bindus} बिंदु, क्रम #${rank}) "${topic.hi}" में परिश्रम के अनुरूप उत्तम परिणाम देता है।`,
    };
  });

  const RASI_MULTIPLIERS = [7, 10, 8, 4, 10, 5, 7, 8, 9, 5, 11, 12];
  const GRAHA_MULTIPLIERS: Record<SevenPlanetId, number> = {
    Sun: 5, Moon: 5, Mars: 8, Mercury: 5, Jupiter: 10, Venus: 7, Saturn: 5,
  };
  const shodhana: PatrikaShodhanaRow[] = SEVEN_LIST.map((pId) => {
    const rawArr = chart.ashtakavarga.bhinna[pId];
    const triArr = chart.ashtakavarga.trikonaShodhana[pId];
    const ekaArr = chart.ashtakavarga.ekadhipatyaShodhana[pId];
    const rawTotal = rawArr.reduce((a, b) => a + b, 0);
    const afterTrikona = triArr.reduce((a, b) => a + b, 0);
    const shodhitaTotal = ekaArr.reduce((a, b) => a + b, 0);
    const retentionPct = rawTotal > 0 ? Math.round((shodhitaTotal / rawTotal) * 100) : 0;

    let rasiPinda = 0;
    for (let s = 0; s < 12; s++) rasiPinda += ekaArr[s] * RASI_MULTIPLIERS[s];
    let grahaPinda = 0;
    for (const g of SEVEN_LIST) {
      const gPos = byId.get(g)!;
      grahaPinda += ekaArr[gPos.signIndex] * GRAHA_MULTIPLIERS[g];
    }
    return {
      planet: pId,
      rawTotal,
      afterTrikona,
      shodhitaTotal,
      retentionPct,
      rasiPinda,
      grahaPinda,
      sodhyaPinda: rasiPinda + grahaPinda,
    };
  });

  const savAt = (h: number) => savHouses[h - 1].bindus;
  const areaScore = (arr: number[]) => Math.min(100, Math.round((arr.reduce((a, h) => a + savAt(h), 0) / (arr.length * 33)) * 100));
  const savLifeAreas = [
    { nameEn: 'Self & Longevity', nameHi: 'स्वास्थ्य व दीर्घायु', houses: 'H1 + H8', arr: [1, 8] },
    { nameEn: 'Wealth & Accumulated Assets', nameHi: 'धन, आय व संपत्ति', houses: 'H2 + H11', arr: [2, 11] },
    { nameEn: 'Initiative & Competition', nameHi: 'साहस व प्रतिस्पर्धा', houses: 'H3 + H6', arr: [3, 6] },
    { nameEn: 'Home, Mother & Dharma', nameHi: 'गृह, सुख व भाग्य', houses: 'H4 + H9', arr: [4, 9] },
    { nameEn: 'Intelligence & Career', nameHi: 'बुद्धि, संतान व कर्म', houses: 'H5 + H10', arr: [5, 10] },
    { nameEn: 'Marriage & Social Network', nameHi: 'विवाह व सामाजिक लाभ', houses: 'H7 + H11', arr: [7, 11] },
    { nameEn: 'Peak Rise & Fortune', nameHi: 'उच्च सफलता व भाग्योदय', houses: 'H9 + H10 + H11', arr: [9, 10, 11] },
  ].map((x) => {
    const score = areaScore(x.arr);
    return {
      nameEn: x.nameEn,
      nameHi: x.nameHi,
      houses: x.houses,
      score,
      statusEn: score >= 82 ? 'Excellent' : score >= 70 ? 'Supportive' : 'Develops with Effort',
      statusHi: score >= 82 ? 'अत्युत्तम' : score >= 70 ? 'अनुकूल' : 'परिश्रम से श्रेष्ठ',
    };
  });

  const oppositeBalance = Array.from({ length: 6 }, (_, i) => {
    const lh = i + 1;
    const rh = i + 7;
    const lp = savAt(lh);
    const rp = savAt(rh);
    const diff = lp - rp;
    return {
      pair: `H${lh} vs H${rh}`,
      leftHouse: lh,
      leftPts: lp,
      rightHouse: rh,
      rightPts: rp,
      diff,
      noteEn: Math.abs(diff) <= 3
        ? `Harmonious equilibrium between House ${lh} and House ${rh}.`
        : diff > 0
          ? `House ${lh} (${lp}) leads House ${rh} (${rp}) — self/internal side drives partnerships.`
          : `House ${rh} (${rp}) exceeds House ${lh} (${lp}) — external/partner flow sustains this axis.`,
      noteHi: Math.abs(diff) <= 3
        ? `${lh}वें और ${rh}वें भाव में उत्कृष्ट संतुलन है।`
        : diff > 0
          ? `${lh}वां भाव (${lp}) ${rh}वें भाव (${rp}) से प्रबल — स्व-पहल प्रमुख रहेगी।`
          : `${rh}वां भाव (${rp}) ${lh}वें भाव (${lp}) से प्रबल — बाहरी सहयोग/साझेदारी प्रभावी रहेगी।`,
    };
  });

  // 4. Planetary Avasthas Narrative (all 9 Grahas: Baladi, Lajjitadi, Sayanadi + Astrologer Interpretation)
  const SAYANADI_STATES = [
    { en: 'Sayana (Resting)', hi: 'शयन अवस्था (विश्राम)' },
    { en: 'Upavesana (Seated)', hi: 'उपवेशन अवस्था (स्थिर)' },
    { en: 'Netrapani (Watchful)', hi: 'नेत्रपाणि अवस्था (सजग)' },
    { en: 'Prakasana (Shining / Public)', hi: 'प्रकाशन अवस्था (प्रकाशमान)' },
    { en: 'Gamana (Moving)', hi: 'गमन अवस्था (प्रगतिशील)' },
    { en: 'Aagamana (Returning / Arriving)', hi: 'आगमन अवस्था (प्राप्ति)' },
    { en: 'Sabha (Assembly / Courtly)', hi: 'सभा अवस्था (सम्मान)' },
    { en: 'Aagama (Receiving / Knowledge)', hi: 'आगम अवस्था (ज्ञान व लाभ)' },
    { en: 'Bhojana (Consuming / Enjoying)', hi: 'भोजन अवस्था (भोग)' },
    { en: 'Nrityalipsa (Expressive / Creative)', hi: 'नृत्यलिप्सा अवस्था (कलात्मक)' },
    { en: 'Kautuka (Inquisitive / Eager)', hi: 'कौतुक अवस्था (उत्सुक)' },
    { en: 'Nidra (Dormant / Internalized)', hi: 'निद्रा अवस्था (अंतर्मुखी)' },
  ];

  const avasthaNarratives: PatrikaAvasthaNarrative[] = NINE_LIST.map((pId, pIdx) => {
    const p = byId.get(pId)!;
    const sevMatch = avUp.avasthas.find((a) => a.planet === pId);
    const baladi = sevMatch
      ? sevMatch.baladi
      : (() => {
          const isOdd = p.signIndex % 2 === 0;
          const bIdx = Math.min(4, Math.floor(p.degreeInSign / 6));
          const names = ['Bala (Infant · 25%)', 'Kumara (Adolescent · 50%)', 'Yuva (Youth · 100%)', 'Vriddha (Aged · 12%)', 'Mrita (Dormant · 0%)'];
          return isOdd ? names[bIdx] : [...names].reverse()[bIdx];
        })();

    const lajjitadi =
      p.dignity === 'Exalted' || p.dignity === 'Moolatrikona'
        ? { en: 'Garvita (Proud / Accomplished)', hi: 'गर्विता (गौरवशाली व समर्थ)' }
        : ['Great Friend', 'Friend', 'Own Sign'].includes(p.dignity)
          ? { en: 'Mudita (Delighted)', hi: 'मुदिता (प्रसन्न व शुभफलदायी)' }
          : p.rasiHouseNumber === 5 && !BENEFIC_SET.has(pId)
            ? { en: 'Lajjita (Cautious)', hi: 'लज्जिता (संयमित व सावधान)' }
            : p.isCombust || ['Enemy', 'Great Enemy'].includes(p.dignity)
              ? { en: 'Kshudhita / Kshobhita (Strained)', hi: 'क्षुधिता / क्षोभिता (परिश्रम से फल)' }
              : { en: 'Swastha / Trishita (Seekful)', hi: 'स्वस्था / तृषिता (प्रयासशील)' };

    const sayIdx = (p.nakshatraIndex + pIdx + p.pada + p.rasiHouseNumber) % 12;
    const sayanadi = SAYANADI_STATES[sayIdx];
    const subCode = (p.nakshatraIndex + p.rasiHouseNumber + Math.floor(p.degreeInSign)) % 3;
    const subState =
      ['Exalted', 'Moolatrikona', 'Own Sign', 'Great Friend'].includes(p.dignity) || subCode === 0
        ? { en: 'Cheshta (Full Expression)', hi: 'चेष्टा (पूर्ण फलप्रद)' }
        : subCode === 1
          ? { en: 'Drishti (Moderate / Situational)', hi: 'दृष्टि (मध्यम व अवसरानुसार)' }
          : { en: 'Vicheshta (Subtle / Delayed)', hi: 'विचेष्टा (विलंबित या गूढ़)' };

    const housesStr = SEVEN_LIST.includes(pId as SevenPlanetId)
      ? getHousesRuledBy(pId as SevenPlanetId, ascSign).map((h) => `H${h}`).join(', ')
      : 'Nodal Shadow Axis';
    const interpretationEn = `${pId} occupies House ${p.rasiHouseNumber} (${p.signName}, ${p.dignity}) and ${SEVEN_LIST.includes(pId as SevenPlanetId) ? `rules ${housesStr}` : 'channels Rahu-Ketu karmic urgency'}. Combining ${baladi.split(' (')[0]} maturity with ${lajjitadi.en.split(' (')[0]} and ${sayanadi.en.split(' (')[0]} sub-state ${subState.en.split(' (')[0]} indicates results manifest via ${subState.en.startsWith('Cheshta') ? 'visible authority and proactive initiative' : 'measured consistency and maturing experience'}.`;
    const interpretationHi = `${PLANET_HI[pId]} कुंडली के ${p.rasiHouseNumber}वें भाव (${SIGN_HI[p.signIndex]}) में स्थित हैं${SEVEN_LIST.includes(pId as SevenPlanetId) ? ` तथा ${housesStr} के स्वामी हैं` : ''}। ${baladi.split(' (')[0]} बलादि, ${lajjitadi.hi.split(' (')[0]} व ${sayanadi.hi.split(' (')[0]} (${subState.hi}) के संयोग से इस ग्रह के फल जीवन के मध्य भाग में स्पष्ट व स्थायी रूप से फलित होते हैं।`;

    return {
      planet: pId,
      baladiEn: baladi,
      baladiHi: baladi
        .replace('Bala (Infant', 'बाल (25% क्षमता')
        .replace('Kumara (Adolescent', 'कुमार (50% क्षमता')
        .replace('Yuva (Youth', 'युवा (100% पूर्ण')
        .replace('Vriddha (Aged', 'वृद्ध (12% मंद')
        .replace('Mrita (Dormant', 'मृत (सुप्त')
        .replace(' · 25%)', ')')
        .replace(' · 50%)', ')')
        .replace(' · 100%)', ')')
        .replace(' · 12%)', ')')
        .replace(' · 0%)', ')'),
      lajjitadiEn: lajjitadi.en,
      lajjitadiHi: lajjitadi.hi,
      sayanadiEn: sayanadi.en,
      sayanadiHi: sayanadi.hi,
      subStateEn: subState.en,
      subStateHi: subState.hi,
      interpretationEn,
      interpretationHi,
    };
  });

  // 5. Jaimini Life Purpose & Purushartha
  const jaimini = computeJaiminiReport(chart);
  const ak = chart.planets.find((p) => p.charaKaraka === 'AK') ?? chart.planets[0];
  const akD9 = chart.divisionalCharts.D9.placements.find((p) => p.id === ak.id)!;
  const twelfthFromAkSign = (akD9.signIndex + 11) % 12;
  const in12th = chart.divisionalCharts.D9.placements.filter((x) => x.id !== 'Asc' && x.signIndex === twelfthFromAkSign);
  const ishtaPlanet = in12th.length > 0 ? in12th[0].id : SIGNS[twelfthFromAkSign].lord;
  const ishtaForm = ISHTA_FORMS[ishtaPlanet] ?? ISHTA_FORMS.Jupiter;

  const countIn = (hs: number[]) => chart.planets.filter((p) => NINE_LIST.includes(p.id as NineGrahaId) && hs.includes(p.rasiHouseNumber)).length;
  const purusharthaRaw = {
    dharma: Math.max(12, countIn([1, 5, 9]) * 22 + 12),
    artha: Math.max(12, countIn([2, 6, 10]) * 22 + 12),
    kama: Math.max(12, countIn([3, 7, 11]) * 22 + 12),
    moksha: Math.max(12, countIn([4, 8, 12]) * 22 + 12),
  };
  const pTotal = purusharthaRaw.dharma + purusharthaRaw.artha + purusharthaRaw.kama + purusharthaRaw.moksha;
  const purushartha = {
    dharma: Math.round((purusharthaRaw.dharma / pTotal) * 100),
    artha: Math.round((purusharthaRaw.artha / pTotal) * 100),
    kama: Math.round((purusharthaRaw.kama / pTotal) * 100),
    moksha: Math.round((purusharthaRaw.moksha / pTotal) * 100),
  };
  const ketuH12OrKendra = ketu.rasiHouseNumber === 12 || ketu.rasiHouseNumber === 9 || ketu.rasiHouseNumber === 5 ? 16 : 6;
  const mokshaIndexPct = Math.min(96, purushartha.moksha + ketuH12OrKendra + 28);

  // 6. Dasha Support Index (-100..+100) + Active Antardashas + Yogini
  const targetMs = Date.parse(`${forecastDate}T12:00:00Z`) || Date.now();
  const dashaSupportRows: PatrikaDashaSupportRow[] = NINE_LIST.map((pId) => {
    const p = byId.get(pId)!;
    const isBen = (report.lagnaProfile.beneficList as string[]).includes(pId);
    const isMaraka = (report.lagnaProfile.marakaList as string[]).includes(pId);
    const baseDig: Record<string, number> = {
      Exalted: 42, Moolatrikona: 36, 'Own Sign': 30, 'Great Friend': 22, Friend: 14,
      Neutral: 4, Enemy: -18, 'Great Enemy': -28, Debilitated: -34,
    };
    const shad = chart.shadbala.find((s) => s.planet === pId);
    const shadBonus = shad ? Math.round((shad.ratio - 1) * 35) : 0;
    const base = (isBen ? 24 : isMaraka ? -16 : 2) + (baseDig[p.dignity] ?? 0) + shadBonus - (p.isCombust ? 18 : 0);
    const clampIdx = (v: number) => Math.max(-100, Math.min(100, Math.round(v)));

    const intelligence = clampIdx(base + (['Mercury', 'Jupiter', 'Ketu'].includes(pId) ? 20 : 0) + ([5, 9, 1].includes(p.rasiHouseNumber) ? 16 : 0));
    const efficiency = clampIdx(base + (['Sun', 'Mars', 'Saturn'].includes(pId) ? 16 : 0) + ([3, 6, 10].includes(p.rasiHouseNumber) ? 18 : 0));
    const loveFamily = clampIdx(base + (['Venus', 'Moon', 'Jupiter'].includes(pId) ? 18 : -6) + ([2, 4, 7].includes(p.rasiHouseNumber) ? 16 : 0));
    const health = clampIdx(base + ([1, 6, 8, 12].includes(p.rasiHouseNumber) ? ([6, 8, 12].includes(p.rasiHouseNumber) ? -14 : 18) : 6));
    const social = clampIdx(base + (['Sun', 'Jupiter', 'Venus'].includes(pId) ? 14 : 0) + ([1, 10, 11].includes(p.rasiHouseNumber) ? 16 : 0));
    const career = clampIdx(base + (['Saturn', 'Sun', 'Mars', 'Mercury'].includes(pId) ? 14 : 4) + ([10, 11, 9].includes(p.rasiHouseNumber) ? 20 : 0));
    const finance = clampIdx(base + (['Jupiter', 'Venus', 'Mercury', 'Rahu'].includes(pId) ? 16 : 0) + ([2, 11, 9, 5].includes(p.rasiHouseNumber) ? 20 : 0));
    const average = Math.round((intelligence + efficiency + loveFamily + health + social + career + finance) / 7);

    return {
      planet: pId,
      intelligence,
      efficiency,
      loveFamily,
      health,
      social,
      career,
      finance,
      average,
      verdictEn: average >= 40 ? 'Highly Supportive' : average >= 10 ? 'Balanced Support' : average >= -15 ? 'Mixed / Requires Strategy' : 'Demanding / Remedial Focus',
      verdictHi: average >= 40 ? 'अत्यंत सहायक' : average >= 10 ? 'संतुलित सहयोग' : average >= -15 ? 'मिश्रित / योजना आवश्यक' : 'संघर्षशील / उपाय अपेक्षित',
    };
  });

  const activeMd = chart.vimshottari.find((d) => targetMs >= d.startMs && targetMs < d.endMs) ?? chart.vimshottari[0];
  const activeAntardashas: PatrikaAntardashaComp[] = (activeMd.children ?? []).map((ad) => {
    const row = dashaSupportRows.find((r) => r.planet === ad.lord) ?? dashaSupportRows[0];
    const isCur = targetMs >= ad.startMs && targetMs < ad.endMs;
    const startDmy = formatDateDmy(formatLocalDateTimeFromUtc(ad.startMs, chart.offsetMinutesUsed).slice(0, 10));
    const endDmy = formatDateDmy(formatLocalDateTimeFromUtc(ad.endMs, chart.offsetMinutesUsed).slice(0, 10));
    return {
      lord: ad.lord,
      startDmy,
      endDmy,
      isCurrent: isCur,
      focusScore: row.average,
      verdictEn: row.verdictEn,
      verdictHi: row.verdictHi,
      summaryEn: `Finance (${row.finance > 0 ? '+' : ''}${row.finance}), Career (${row.career > 0 ? '+' : ''}${row.career}), Relationships (${row.loveFamily > 0 ? '+' : ''}${row.loveFamily}).`,
      summaryHi: `वित्त (${row.finance > 0 ? '+' : ''}${row.finance}), करियर (${row.career > 0 ? '+' : ''}${row.career}), दांपत्य/परिवार (${row.loveFamily > 0 ? '+' : ''}${row.loveFamily})।`,
    };
  });

  const yoginiPeriods = chart.yogini.slice(0, 8).map((y) => ({
    yogini: String(y.lord),
    lord: YOGINI_LIST.find((yo) => y.lord.includes(yo.name))?.lord ?? 'Sun',
    startDmy: formatDateDmy(formatLocalDateTimeFromUtc(y.startMs, chart.offsetMinutesUsed).slice(0, 10)),
    endDmy: formatDateDmy(formatLocalDateTimeFromUtc(y.endMs, chart.offsetMinutesUsed).slice(0, 10)),
    years: Math.round((y.durationDays / 365.2425) * 10) / 10,
    isCurrent: targetMs >= y.startMs && targetMs < y.endMs,
    noteEn: `${y.lord} Yogini phase emphasizes karmic growth under its planetary lord's house themes.`,
    noteHi: `${y.lord} योगिनी दशा अपने अधिपति ग्रह के भावगत विषयों में कर्म-विस्तार व परिवर्तन लाती है।`,
  }));

  // 7. Doshas, Mangal 3-Ref, Putra Shaapa, Parivartana & Ranked Gemstones
  const mars = byId.get('Mars')!;
  const venus = byId.get('Venus')!;
  const manglikHouses = new Set([1, 2, 4, 7, 8, 12]);
  const hMarsLagna = mars.rasiHouseNumber;
  const hMarsMoon = ((mars.signIndex - moon.signIndex + 12) % 12) + 1;
  const hMarsVenus = ((mars.signIndex - venus.signIndex + 12) % 12) + 1;
  const manglikLagna = manglikHouses.has(hMarsLagna);
  const manglikMoon = manglikHouses.has(hMarsMoon);
  const manglikVenus = manglikHouses.has(hMarsVenus);

  const manglikMitigationsEn: string[] = [];
  const manglikMitigationsHi: string[] = [];
  if (['Own Sign', 'Exalted', 'Moolatrikona'].includes(mars.dignity)) {
    manglikMitigationsEn.push(`Mars has strong dignity (${mars.dignity}), softening aggressive expressions.`);
    manglikMitigationsHi.push(`मंगल की स्थिति सुदृढ़ (${mars.dignity}) होने से मांगलिक प्रभाव शांत होता है।`);
  }
  const jupiter = byId.get('Jupiter')!;
  if (jupiter.rasiHouseNumber === mars.rasiHouseNumber || getAspectingGrahasOnHouse(chart, hMarsLagna).includes('Jupiter')) {
    manglikMitigationsEn.push('Jupiter aspects or conjoins Mars, providing auspicious Manglik cancellation (Bhanga).');
    manglikMitigationsHi.push('मंगल पर देवगुरु बृहस्पति की दृष्टि या युति मांगलिक दोष का प्रभावी परिहार करती है।');
  }
  if (!manglikLagna && !manglikMoon && !manglikVenus) {
    manglikMitigationsEn.push('Mars is outside the 1, 2, 4, 7, 8, 12 houses from Lagna, Moon, and Venus — Non-Manglik.');
    manglikMitigationsHi.push('मंगल लग्न, चंद्र और शुक्र तीनों से 1, 2, 4, 7, 8, 12 भावों के बाहर हैं — पूर्णतः मांगलिक-दोष मुक्त।');
  }

  // Putra Shaapa check (BPHS Ch 87 classic checks)
  const h5Lord = SIGNS[(ascSign + 4) % 12].lord;
  const h5LordPos = byId.get(h5Lord)!;
  const saturn = byId.get('Saturn')!;
  const hasSarpaShaapa = (rahu.rasiHouseNumber === 5 || getAspectingGrahasOnHouse(chart, 5).includes('Rahu')) && (h5LordPos.rasiHouseNumber === 6 || h5LordPos.rasiHouseNumber === 8 || h5LordPos.rasiHouseNumber === 12);
  const hasPitruShaapa = sun.rasiHouseNumber === 5 && (saturn.rasiHouseNumber === 5 || getAspectingGrahasOnHouse(chart, 5).includes('Saturn'));
  const putraShaapa = hasSarpaShaapa
    ? {
        statusEn: 'Detected (Mild–Moderate)',
        statusHi: 'लक्षण उपस्थित (मध्यम)',
        typeEn: 'Sarpa Shaapa Indicator',
        typeHi: 'सर्प शाप संकेत (राहु + पंचमेश स्थिति)',
        detailEn: `Rahu influences House 5 while 5th lord ${h5Lord} occupies H${h5LordPos.rasiHouseNumber}. Progeny blessings stabilize via devotional Naga/Subrahmanya remedies and Santana Gopala mantra.`,
        detailHi: `पंचम भाव पर राहु प्रभाव व पंचमेश ${PLANET_HI[h5Lord]} का ${h5LordPos.rasiHouseNumber}वें भाव में होना संतान संबंधी विलंब के बाद शुभ फल का संकेत है।`,
        remedyEn: 'Recite Santana Gopala Stotra on Thursdays and offer Nagarpuja / silver serpent charity on Nag Panchami.',
        remedyHi: 'गुरुवार को संतान गोपाल स्तोत्र का पाठ एवं नाग पंचमी पर विधि-विधान से पूजन अत्यंत फलदायी रहता है।',
      }
    : hasPitruShaapa
      ? {
          statusEn: 'Detected (Karmic Review)',
          statusHi: 'पितृ ऋण संकेत (सावधानी)',
          typeEn: 'Pitru Shaapa Indicator',
          typeHi: 'पितृ शाप संकेत (सूर्य-शनि व पंचम भाव)',
          detailEn: `Sun–Saturn contact on House 5 points to ancestral karma affecting progeny timing or peace of mind; ancestral tarpan and Gayatri sadhana clear this gracefully.`,
          detailHi: `पंचम भाव में सूर्य-शनि का प्रभाव पितृ-कर्म की ओर संकेत करता है; तर्पण व गायत्री मंत्र से बाधा शांत होती है।`,
          remedyEn: 'Perform Pitru Tarpan on Amavasya, feed cows/Brahmins, and chant Surya Gayatri.',
          remedyHi: 'अमावस्या को पितृ तर्पण व नित्य सूर्य अर्घ्य–गायत्री जप करें।',
        }
      : {
          statusEn: 'Clear / No Classical Curse',
          statusHi: 'दोष मुक्त (शुभ)',
          typeEn: 'No Classical Putra Shaapa',
          typeHi: 'कोई शास्त्रीय संतान-शाप नहीं',
          detailEn: `5th house and 5th lord ${h5Lord} (in H${h5LordPos.rasiHouseNumber}) do not trigger classical Sarpa, Pitru, or Brahma Shaapa combinations.`,
          detailHi: `पंचम भाव व पंचमेश ${PLANET_HI[h5Lord]} (भाव ${h5LordPos.rasiHouseNumber}) शास्त्रीय सर्प/पितृ/ब्रह्म शाप से पूर्णतः मुक्त हैं।`,
          remedyEn: 'No special Putra Shaapa pacification required; strengthen Jupiter with gratitude and mentorship.',
          remedyHi: 'किसी विशेष शाप-निवारण की आवश्यकता नहीं; गुरु और बड़ों का सम्मान संतान सुख को बढ़ाता है।',
        };

  // Parivartana (Mutual Sign Exchange among 7 planets)
  const parivartana: PatrikaBookData['doshasAndGems']['parivartana'] = [];
  for (let i = 0; i < SEVEN_LIST.length; i++) {
    for (let j = i + 1; j < SEVEN_LIST.length; j++) {
      const p1 = SEVEN_LIST[i];
      const p2 = SEVEN_LIST[j];
      const pos1 = byId.get(p1)!;
      const pos2 = byId.get(p2)!;
      const p1RulesP2 = SIGNS[pos2.signIndex].lord === p1;
      const p2RulesP1 = SIGNS[pos1.signIndex].lord === p2;
      if (p1RulesP2 && p2RulesP1) {
        const dusthana = [6, 8, 12];
        const isDainya = dusthana.includes(pos1.rasiHouseNumber) || dusthana.includes(pos2.rasiHouseNumber);
        const isKhala = pos1.rasiHouseNumber === 3 || pos2.rasiHouseNumber === 3;
        const typeEn = isDainya ? 'Dainya Parivartana' : isKhala ? 'Khala Parivartana' : 'Maha Parivartana Raja Yoga';
        const typeHi = isDainya ? 'दैन्य परिवर्तन' : isKhala ? 'खल परिवर्तन' : 'महा परिवर्तन राजयोग';
        parivartana.push({
          typeEn,
          typeHi,
          p1,
          p2,
          houses: `H${pos1.rasiHouseNumber} ↔ H${pos2.rasiHouseNumber}`,
          noteEn: `${p1} and ${p2} exchange houses (${pos1.signName} ↔ ${pos2.signName}), linking H${pos1.rasiHouseNumber} & H${pos2.rasiHouseNumber} themes permanently.`,
          noteHi: `${PLANET_HI[p1]} और ${PLANET_HI[p2]} परस्पर राशि परिवर्तन (${SIGN_HI[pos1.signIndex]} ↔ ${SIGN_HI[pos2.signIndex]}) कर रहे हैं, जिससे ${pos1.rasiHouseNumber}वां व ${pos2.rasiHouseNumber}वां भाव गहन रूप से जुड़ते हैं।`,
        });
      }
    }
  }

  // Gemstone 4-tier ranking across all 7 planets
  const gemMeta: Record<SevenPlanetId, { en: string; hi: string }> = {
    Sun: { en: 'Ruby (Manikya)', hi: 'माणिक्य (Ruby)' },
    Moon: { en: 'Natural Pearl (Moti)', hi: 'मोती (Pearl)' },
    Mars: { en: 'Red Coral (Moonga)', hi: 'मूंगा (Red Coral)' },
    Mercury: { en: 'Emerald (Panna)', hi: 'पन्ना (Emerald)' },
    Jupiter: { en: 'Yellow Sapphire (Pukhraj)', hi: 'पुखराज (Yellow Sapphire)' },
    Venus: { en: 'Diamond / White Sapphire (Heera)', hi: 'हीरा / ओपल (Diamond)' },
    Saturn: { en: 'Blue Sapphire (Neelam)', hi: 'नीलम (Blue Sapphire)' },
  };
  const gemReport = computeGemstoneAndRudraksha(chart);
  const lagnaLord = SIGNS[ascSign].lord;
  const h5L = SIGNS[(ascSign + 4) % 12].lord;
  const h9L = SIGNS[(ascSign + 8) % 12].lord;
  const dusthLords = new Set([
    SIGNS[(ascSign + 5) % 12].lord,
    SIGNS[(ascSign + 7) % 12].lord,
    SIGNS[(ascSign + 11) % 12].lord,
  ]);
  const gemTiers: PatrikaGemTierItem[] = SEVEN_LIST.map((pId) => {
    const ruled = getHousesRuledBy(pId, ascSign);
    const isTrikona = pId === lagnaLord || pId === h5L || pId === h9L;
    const isBen = report.lagnaProfile.beneficList.includes(pId);
    const tier: PatrikaGemTierItem['tier'] = isTrikona
      ? 'Recommended'
      : isBen && !dusthLords.has(pId)
        ? 'Worth Considering'
        : dusthLords.has(pId) && !isTrikona
          ? 'Best Avoided'
          : 'Use With Caution';
    const tierHiMap: Record<PatrikaGemTierItem['tier'], string> = {
      Recommended: 'सर्वश्रेष्ठ अनुशंसित (Life/Lucky Stone)',
      'Worth Considering': 'सहयोगी / विचारणीय',
      'Use With Caution': 'सावधानीपूर्वक / परीक्षण के बाद',
      'Best Avoided': 'त्याज्य / निषिद्ध (दुस्थान स्वामी)',
    };
    return {
      planet: pId,
      gemEn: gemMeta[pId].en,
      gemHi: gemMeta[pId].hi,
      tier,
      tierHi: tierHiMap[tier],
      lordHouses: ruled,
      reasonEn:
        tier === 'Recommended'
          ? `Rules auspicious Trikona/Lagna house(s) (${ruled.map((h) => `H${h}`).join(', ')}). Supports vitality, luck, and protection.`
          : tier === 'Best Avoided'
            ? `Governs Dusthana/functional hurdle houses (${ruled.map((h) => `H${h}`).join(', ')}); charity & mantra are better than wearing the stone.`
            : `Governs mixed houses (${ruled.map((h) => `H${h}`).join(', ')}); use primarily during its auspicious Dasha under expert trial.`,
      reasonHi:
        tier === 'Recommended'
          ? `शुभ लग्न/त्रिकोण भावों (${ruled.map((h) => `भाव ${h}`).join(', ')}) के स्वामी होने से यह रत्न जीवन-शक्ति व भाग्योदय बढ़ाता है।`
          : tier === 'Best Avoided'
            ? `दुस्थान/बाधक भाव (${ruled.map((h) => `भाव ${h}`).join(', ')}) के स्वामित्व के कारण इसका रत्न न पहनकर दान व मंत्र जप करें।`
            : `मिश्रित भावेश (${ruled.map((h) => `भाव ${h}`).join(', ')}) होने से केवल अनुकूल दशा में छोटे परीक्षण के उपरांत ही धारण करें।`,
    };
  });

  // 8. Horoscope Chapters (Part II, Ch 28..34)
  const panchangaPhalEn = `Born during ${deepPanchang.rituEn} Ritu and ${deepPanchang.activeMasaEn} Masa on ${chart.panchang.vara.name} (${chart.panchang.tithi.paksha} ${chart.panchang.tithi.name}), under ${chart.panchang.nakshatra.name} Nakshatra (Pada ${chart.panchang.nakshatra.pada}). Birth on ${chart.panchang.vara.name} imparts qualities of ${chart.panchang.vara.lord}, while ${chart.panchang.nakshatra.name} (deity ${chart.panchang.nakshatra.deity}) infuses deep intuition, cultural dignity, and steady perseverance.`;
  const panchangaPhalHi = `${deepPanchang.rituHi} ऋतु व ${deepPanchang.activeMasaHi} मास के ${chart.panchang.vara.name} (${chart.panchang.tithi.paksha} ${chart.panchang.tithi.name}) एवं ${chart.panchang.nakshatra.name} नक्षत्र (चरण ${chart.panchang.nakshatra.pada}) में जन्म होने से जातक में सहज विवेक, मर्यादा व सतत कर्मशीलता के गुण स्वाभाविक रूप से विकसित होते हैं।`;

  const ascDignities = report.lagnaProfile;
  const lagnaSections = [
    {
      titleEn: '1. Physical Appearance & Constitutional Frame',
      titleHi: '1. शारीरिक गठन व व्यक्तित्व का प्रभाव',
      bodyEn: `${ascDignities.signName} Ascendant bestows a distinct stature shaped by Lagna lord ${ascDignities.ruler} (in House ${byId.get(ascDignities.ruler)!.rasiHouseNumber}). ${ascDignities.temperament}`,
      bodyHi: `${SIGN_HI[ascSign]} लग्न व लग्नेश ${PLANET_HI[ascDignities.ruler]} (भाव ${byId.get(ascDignities.ruler)!.rasiHouseNumber}) जातक को प्रभावशाली मुखमंडल, स्पष्ट दृष्टि तथा संतुलित शारीरिक गठन प्रदान करते हैं।`,
    },
    {
      titleEn: '2. Mental Disposition & Decision Style',
      titleHi: '2. मानसिक प्रवृत्ति व निर्णय शैली',
      bodyEn: `Moon in ${moon.signName} (H${moon.rasiHouseNumber}) blends emotional sensitivity with ${ascDignities.signName} Ascendant's pragmatic outlook. Mercury's condition (${byId.get('Mercury')!.dignity}) governs speech and analytical poise.`,
      bodyHi: `${SIGN_HI[moon.signIndex]} राशिस्थ चंद्र (भाव ${moon.rasiHouseNumber}) एवं ${SIGN_HI[ascSign]} लग्न के संयोग से विचारशील, दूरदर्शी व परिस्थितियों के अनुरूप ढलने वाली मानसिकता बनती है।`,
    },
    {
      titleEn: '3. Core Strengths & Inherent Assets',
      titleHi: '3. प्रमुख सामर्थ्य व प्राकृतिक शक्तियाँ',
      bodyEn: `Functional benefics (${ascDignities.beneficList.join(', ')}) provide reliable pillars of support. Strongest Shadbala planet (${[...chart.shadbala].sort((a, b) => b.ratio - a.ratio)[0]?.planet}) anchors your competitive advantage.`,
      bodyHi: `लग्न के योगकारक/शुभ ग्रह (${ascDignities.beneficList.map((p) => PLANET_HI[p]).join(', ')}) जीवन के कठिन मोड़ों पर संबल और सफलता दिलाते हैं।`,
    },
    {
      titleEn: '4. Growth Areas & Caution Zones',
      titleHi: '4. सुधार क्षेत्र व सावधानी बिंदु',
      bodyEn: `Functional challenges/Marakas (${ascDignities.maleficList.join(', ')}; ${ascDignities.marakaList.join(', ')}) teach patience against impulsive commitments and stress overwork.`,
      bodyHi: `अकारक व मारक ग्रहों (${ascDignities.maleficList.map((p) => PLANET_HI[p]).join(', ')}) की दशा में जल्दबाजी, क्रोध व अधिक कार्यभार से संतुलित दूरी रखना श्रेष्ठ रहता है।`,
    },
    {
      titleEn: '5. Career Path & Societal Vocation',
      titleHi: '5. करियर दिशा एवं आजीविका मार्ग',
      bodyEn: `With 10th house in ${SIGNS[(ascSign + 9) % 12].name} ruled by ${SIGNS[(ascSign + 9) % 12].lord}, lasting professional stature comes through structured expertise, advisory or leadership roles.`,
      bodyHi: `दशम भाव में ${SIGN_HI[(ascSign + 9) % 12]} राशि व दशमेश ${PLANET_HI[SIGNS[(ascSign + 9) % 12].lord]} प्रशासन, सलाहकार, तकनीकी या स्वतंत्र नेतृत्व में दीर्घकालीन प्रतिष्ठा दिलाते हैं।`,
    },
    {
      titleEn: '6. Relationships & Domestic Equilibrium',
      titleHi: '6. दांपत्य, परिवार एवं भावनात्मक संतुलन',
      bodyEn: `7th house in ${SIGNS[(ascSign + 6) % 12].name} highlights partnership chemistry balanced by mutual respect, shared values, and calm household communication.`,
      bodyHi: `सप्तम भाव की ${SIGN_HI[(ascSign + 6) % 12]} राशि जीवनसाथी व परिवार के साथ पारस्परिक सम्मान, धैर्य और स्पष्ट संवाद से मधुर संबंधों की नींव रखती है।`,
    },
  ];

  const ascDivisionalReadings = (['D2', 'D3', 'D12', 'D30'] as DivisionalChartId[]).map((vid) => {
    const vc = chart.divisionalCharts[vid];
    const meta = SHODASHA_VARGAS_LIST.find((m) => m.id === vid)!;
    return {
      vargaId: vid,
      titleEn: `${vid} ${meta.nameEn} Ascendant (${SIGNS[vc.lagnaSignIndex].name})`,
      titleHi: `${vid} ${meta.nameHi} लग्न (${SIGN_HI[vc.lagnaSignIndex]})`,
      signIdx: vc.lagnaSignIndex,
      textEn: `${meta.nameEn} Lagna falls in ${SIGNS[vc.lagnaSignIndex].name} ruled by ${SIGNS[vc.lagnaSignIndex].lord}, coloring ${meta.domainEn.toLowerCase()} with ${vc.lagnaSignIndex % 2 === 0 ? 'dynamic initiative' : 'sustained preservation and grace'}.`,
      textHi: `${meta.nameHi} लग्न ${SIGN_HI[vc.lagnaSignIndex]} (स्वामी ${PLANET_HI[SIGNS[vc.lagnaSignIndex].lord]}) में होने से "${meta.domainHi}" से जुड़े विषय योजनाबद्ध परिश्रम से उन्नति करते हैं।`,
    };
  });

  const houseChapters: PatrikaHouseBookChapter[] = report.houseWisePredictions.map((hw) => {
    const topic = HOUSE_TOPIC_LABELS[hw.houseNumber - 1];
    const occNamesEn = hw.occupants.length ? hw.occupants.join(', ') : 'No natal planet occupies this house directly';
    const occNamesHi = hw.occupants.length ? hw.occupants.map((o) => PLANET_HI[o]).join(', ') : 'इस भाव में कोई ग्रह प्रत्यक्ष रूप से स्थित नहीं है';
    const aspEn = hw.aspectingPlanets.length
      ? `Aspected by ${hw.aspectingPlanets.join(', ')} — ${hw.aspectingPlanets.some((a) => BENEFIC_SET.has(a)) ? 'benefic aspects nurture growth' : 'natural malefic gaze adds discipline and focus'}.`
      : 'Unaspected by external planets; outcomes depend primarily on the house lord and SAV strength.';
    const aspHi = hw.aspectingPlanets.length
      ? `${hw.aspectingPlanets.map((a) => PLANET_HI[a]).join(', ')} की दृष्टि इस भाव को सक्रिय करती है — ${hw.aspectingPlanets.some((a) => BENEFIC_SET.has(a)) ? 'शुभ दृष्टि उन्नति व संरक्षण देती है' : 'शनि/मंगल/राहु की दृष्टि कठोर अनुशासन द्वारा सफलता दिलाती है'}।`
      : 'इस भाव पर किसी बाहरी ग्रह की सीधी दृष्टि नहीं है; भावेश की स्थिति ही प्रमुख निर्णायक है।';

    return {
      houseNumber: hw.houseNumber,
      signIndex: hw.signIndex,
      titleEn: hw.titleEn,
      titleHi: hw.titleHi,
      lordPlanet: hw.lordPlanet,
      lordPlacedHouse: hw.lordPlacedHouse,
      savBindus: hw.savBindus,
      score: hw.score,
      signResultEn: `${SIGNS[hw.signIndex].name} occupies House ${hw.houseNumber} (ruled by ${hw.lordPlanet}), earning ${hw.savBindus} SAV bindus (${hw.verdictEn}).`,
      signResultHi: `${hw.houseNumber}वें भाव में ${SIGN_HI[hw.signIndex]} राशि (स्वामी ${PLANET_HI[hw.lordPlanet]}) तथा ${hw.savBindus} सर्वाष्टकवर्ग बिंदु हैं — स्थिति: ${hw.verdictHi}।`,
      aspectsResultEn: aspEn,
      aspectsResultHi: aspHi,
      lordResultEn: hw.lordReadingEn,
      lordResultHi: hw.lordReadingHi,
      topicHeadingEn: topic.en,
      topicHeadingHi: topic.hi,
      topicReadingEn: hw.synthesisEn,
      topicReadingHi: hw.synthesisHi,
      occupantsAdviceEn: `${occNamesEn}. Practice consistency in ${topic.en.toLowerCase()} and honor House ${hw.houseNumber}'s natural karaka ${hw.naturalKaraka} (${hw.karakaDignity}).`,
      occupantsAdviceHi: `${occNamesHi}। "${topic.hi}" में धैर्यपूर्ण नियमितता रखें और भाव के कारक ${PLANET_HI[hw.naturalKaraka]} के सद्गुणों का पालन करें।`,
      remediesEn: `Chant ${hw.lordPlanet}'s Vedic mantra or offer charitable service connected to ${hw.lordPlanet}'s significations on its weekday.`,
      remediesHi: `${PLANET_HI[hw.lordPlanet]} के वार को मंत्र-जप व सात्विक दान से ${hw.houseNumber}वें भाव के शुभ फलों में वृद्धि होती है।`,
    };
  });

  const rahuKetuNakshatra = {
    rahuSign: rahu.signIndex,
    rahuHouse: rahu.rasiHouseNumber,
    rahuNakshatra: `${rahu.nakshatraName} Pada ${rahu.pada}`,
    rahuReadingEn: `Rahu in House ${rahu.rasiHouseNumber} (${rahu.signName}) within ${rahu.nakshatraName} Nakshatra amplifies unconventional ambition, technical/modern acumen, and foreign or network reach. Education thrives on research and interdisciplinary novelty; career flourishes where bold problem-solving meets patience; health asks for regular sleep hygiene and avoiding nervous exhaustion.`,
    rahuReadingHi: `${rahu.rasiHouseNumber}वें भाव (${SIGN_HI[rahu.signIndex]}) एवं ${rahu.nakshatraName} नक्षत्र में राहु आधुनिक तकनीक, शोध, विदेश संपर्क व महत्वाकांक्षा को बढ़ाता है। करियर में नवोन्मेष से लाभ मिलता है; स्वास्थ्य में नियमित निद्रा व मानसिक शांति बनाए रखें।`,
    ketuSign: ketu.signIndex,
    ketuHouse: ketu.rasiHouseNumber,
    ketuNakshatra: `${ketu.nakshatraName} Pada ${ketu.pada}`,
    ketuReadingEn: `Ketu in House ${ketu.rasiHouseNumber} (${ketu.signName}) within ${ketu.nakshatraName} Nakshatra grants natural mastery, spiritual discernment, and intuitive precision. Avoid over-detachment or sudden abruptions in close agreements; meditation, mantra clarity, and mentoring others channel Ketu's highest wisdom.`,
    ketuReadingHi: `${ketu.rasiHouseNumber}वें भाव (${SIGN_HI[ketu.signIndex]}) एवं ${ketu.nakshatraName} नक्षत्र में केतु अंतर्ज्ञान, आध्यात्मिक परिपक्वता व सूक्ष्म विश्लेषण शक्ति देता है। संबंधों व निर्णयों में अनावश्यक विरक्ति से बचें और ध्यान-साधना अपनाएँ।`,
  };

  let gochar10Years: PatrikaBookData['horoscopeChapters']['gochar10Years'] = [];
  if (!paramayus.exceeded) {
    const cal = computeMultiYearCalendar(chart, forecastDate, 10);
    gochar10Years = [
      ...cal.sadeSatiWindows.slice(0, 6).map((s) => ({
        planet: 'Saturn Sade Sati',
        dateRange: `${formatDateDmy(s.startDate)} → ${formatDateDmy(s.endDate)}`,
        signName: '12th / 1st / 2nd from Moon',
        houseFromMoon: 1,
        phaseTag: s.phase,
        readingEn: s.note,
        readingHi: `${s.phase}: चंद्र से शनि का यह गोचर जीवन में परिपक्वता, कार्य-अनुशासन और दीर्घकालीन नींव मजबूत करता है।`,
      })),
      ...cal.ingresses.slice(0, 12).map((ing) => ({
        planet: ing.planet,
        dateRange: formatDateDmy(ing.date),
        signName: `${ing.fromSign} → ${ing.toSign}`,
        houseFromMoon: ing.houseFromMoon,
        phaseTag: `H${ing.houseFromMoon} from Moon · H${ing.houseFromLagna} Lagna`,
        readingEn: ing.note,
        readingHi: `${PLANET_HI[ing.planet]} का ${ing.toSign} में गोचर (चंद्र से ${ing.houseFromMoon}वां भाव) संबंधित जीवन क्षेत्र में नया अध्याय प्रारंभ करता है।`,
      })),
    ];
  }

  return {
    paramayusLocked: paramayus.exceeded,
    panchangaMeta: {
      kaliyugaYear,
      shakaSamvat: deepPanchang.shakaSamvat,
      vikramSamvat: deepPanchang.vikramSamvat,
      samvatsaraEn: deepPanchang.samvatsaraEn,
      samvatsaraHi: deepPanchang.samvatsaraHi,
      ayanaEn: deepPanchang.ayanaEn,
      ayanaHi: deepPanchang.ayanaHi,
      rituEn: deepPanchang.rituEn,
      rituHi: deepPanchang.rituHi,
      masaEn: deepPanchang.activeMasaEn,
      masaHi: deepPanchang.activeMasaHi,
      dayDuration: chart.panchang.dayDurationStr,
      yoginiBirthBalanceEn: `${activeYog.name} (${activeYog.lord}) · ${yy}Y ${mm}M ${dd}D left`,
      yoginiBirthBalanceHi: `${activeYog.name} (${PLANET_HI[activeYog.lord]}) · ${yy} वर्ष ${mm} माह ${dd} दिन शेष`,
      avakahada,
      ghatak,
      chalit,
      basicSheet,
      higherVargas,
    },
    shodashaDeities,
    vaiseshikamsha,
    specialPoints: spList,
    savAnalysis: {
      houses: savHouses,
      shodhana,
      lifeAreas: savLifeAreas,
      oppositeBalance,
    },
    avasthaNarratives,
    jaiminiExtended: {
      ...jaimini,
      ishtaDevataPlanet: ishtaPlanet,
      ishtaDevataFormEn: ishtaForm.en,
      ishtaDevataFormHi: ishtaForm.hi,
      mokshaIndexPct,
      purushartha,
    },
    dashaSupportIndex: {
      rows: dashaSupportRows,
      activeAntardashas,
      yoginiPeriods,
    },
    doshasAndGems: {
      manglikLagna,
      manglikMoon,
      manglikVenus,
      manglikMitigationsEn,
      manglikMitigationsHi,
      putraShaapa,
      parivartana,
      gemTiers,
      gemReport,
    },
    horoscopeChapters: {
      panchangaPhalEn,
      panchangaPhalHi,
      lagnaSections,
      ascDivisionalReadings,
      houseChapters,
      rahuKetuNakshatra,
      gochar10Years,
    },
  };
}
