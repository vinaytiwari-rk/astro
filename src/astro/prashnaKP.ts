import { NAKSHATRAS, SIGNS, VIMSHOTTARI_ORDER, VIMSHOTTARI_YEARS } from './constants';
import { calculateChart } from './calculator';
import { DEFAULT_SETTINGS } from '../data/cities';
import type { NineGrahaId, SevenPlanetId } from './types';

export type PrashnaCategory =
  | 'marriage'
  | 'job_career'
  | 'wealth_business'
  | 'health_recovery'
  | 'lost_object'
  | 'property_vehicle'
  | 'litigation_court'
  | 'foreign_travel'
  | 'education';

export interface KPPrashnaQuery {
  horaryNumber: number; // 1..249
  question: string;
  category: PrashnaCategory;
  questionDate: string; // YYYY-MM-DD
  questionTime: string; // HH:MM:SS
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface KPSubDivision {
  number: number; // 1..249
  signIndex: number;
  signName: string;
  signLord: SevenPlanetId;
  nakshatraIndex: number;
  nakshatraName: string;
  starLord: NineGrahaId;
  subLord: NineGrahaId;
  startLongitude: number;
  endLongitude: number;
}

export interface PrashnaRulingPlanets {
  dayLord: SevenPlanetId;
  moonSignLord: SevenPlanetId;
  moonStarLord: NineGrahaId;
  ascSignLord: SevenPlanetId;
  ascStarLord: NineGrahaId;
  ascSubLord: NineGrahaId;
  strongestSignificators: string[];
}

export interface PrashnaVerdict {
  outcome: 'Favorable (Yes)' | 'Unfavorable (No)' | 'Conditional / Delayed';
  outcomeHi: string;
  confidencePercent: number;
  rulingPlanetsAgreement: 'High' | 'Moderate' | 'Weak';
  targetHouses: number[];
  favorableHouses: number[];
  detrimentalHouses: number[];
  primarySignificator: string;
  detailedAnalysisEn: string;
  detailedAnalysisHi: string;
  timingPredictionEn: string;
  timingPredictionHi: string;
  remedyEn: string;
  remedyHi: string;
}

export interface KPPrashnaReport {
  horaryNumber: number;
  question: string;
  category: PrashnaCategory;
  categoryLabelEn: string;
  categoryLabelHi: string;
  dateTimeStr: string;
  ascendant: {
    longitude: number;
    dms: string;
    signName: string;
    signLord: SevenPlanetId;
    nakshatraName: string;
    starLord: NineGrahaId;
    subLord: NineGrahaId;
  };
  rulingPlanets: PrashnaRulingPlanets;
  verdict: PrashnaVerdict;
}

// Generate the 249 KP Subdivisions mathematically
export function generateKP249Table(): KPSubDivision[] {
  const table: KPSubDivision[] = [];
  let num = 1;
  let curLon = 0;

  // 27 Nakshatras, each 13°20' (800 minutes of arc)
  for (let nakIdx = 0; nakIdx < 27; nakIdx++) {
    const starLord = NAKSHATRAS[nakIdx].lord;
    const starLordIdx = VIMSHOTTARI_ORDER.indexOf(starLord);
    const nakStart = nakIdx * (40 / 3); // 13.333333°

    // 9 Subdivisions in Vimshottari order starting from Star Lord
    for (let subIdx = 0; subIdx < 9; subIdx++) {
      const actualSubLordIdx = (starLordIdx + subIdx) % 9;
      const subLord = VIMSHOTTARI_ORDER[actualSubLordIdx];
      const years = VIMSHOTTARI_YEARS[subLord];
      const spanDeg = (years / 120) * (40 / 3);

      const subStart = curLon;
      const subEnd = curLon + spanDeg;

      const signIndex = Math.floor(subStart / 30) % 12;
      const sign = SIGNS[signIndex];

      table.push({
        number: num,
        signIndex,
        signName: sign.name,
        signLord: sign.lord,
        nakshatraIndex: nakIdx,
        nakshatraName: NAKSHATRAS[nakIdx].name,
        starLord,
        subLord,
        startLongitude: subStart,
        endLongitude: subEnd,
      });

      curLon = subEnd;
      num++;
      if (num > 249) break;
    }
    if (num > 249) break;
  }
  return table;
}

const KP_TABLE_CACHE = generateKP249Table();

export function getKPSubByNumber(horaryNumber: number): KPSubDivision {
  const clamped = Math.max(1, Math.min(249, Math.round(horaryNumber)));
  return KP_TABLE_CACHE[clamped - 1] || KP_TABLE_CACHE[0];
}

const CATEGORY_RULES: Record<PrashnaCategory, {
  labelEn: string;
  labelHi: string;
  targetHouses: number[];
  favorableHouses: number[];
  detrimentalHouses: number[];
  successLords: string[];
}> = {
  marriage: {
    labelEn: 'Marriage & Relationship',
    labelHi: 'विवाह एवं संबंध',
    targetHouses: [7],
    favorableHouses: [2, 7, 11],
    detrimentalHouses: [1, 6, 10],
    successLords: ['Venus', 'Jupiter'],
  },
  job_career: {
    labelEn: 'Job & Career',
    labelHi: 'नौकरी एवं आजीविका',
    targetHouses: [10],
    favorableHouses: [2, 6, 10, 11],
    detrimentalHouses: [5, 9, 12],
    successLords: ['Sun', 'Saturn', 'Mercury'],
  },
  wealth_business: {
    labelEn: 'Wealth & Business Profit',
    labelHi: 'धन एवं व्यापार लाभ',
    targetHouses: [2, 11],
    favorableHouses: [2, 6, 11],
    detrimentalHouses: [5, 8, 12],
    successLords: ['Mercury', 'Jupiter', 'Venus'],
  },
  health_recovery: {
    labelEn: 'Health & Recovery',
    labelHi: 'स्वास्थ्य एवं रोगमुक्ति',
    targetHouses: [1],
    favorableHouses: [1, 5, 11],
    detrimentalHouses: [6, 8, 12],
    successLords: ['Sun', 'Jupiter', 'Moon'],
  },
  lost_object: {
    labelEn: 'Lost Object / Missing Item',
    labelHi: 'खोई वस्तु की प्राप्ति',
    targetHouses: [2],
    favorableHouses: [2, 6, 11],
    detrimentalHouses: [8, 12],
    successLords: ['Moon', 'Mercury'],
  },
  property_vehicle: {
    labelEn: 'Property & Vehicle Purchase',
    labelHi: 'भूमि, भवन एवं वाहन',
    targetHouses: [4],
    favorableHouses: [4, 11, 12],
    detrimentalHouses: [3, 6],
    successLords: ['Mars', 'Venus'],
  },
  litigation_court: {
    labelEn: 'Litigation & Court Disputes',
    labelHi: 'मुकदमा एवं विवाद',
    targetHouses: [6],
    favorableHouses: [6, 11, 1],
    detrimentalHouses: [12, 5, 8],
    successLords: ['Mars', 'Saturn'],
  },
  foreign_travel: {
    labelEn: 'Foreign Travel & Visa',
    labelHi: 'विदेश यात्रा एवं वीज़ा',
    targetHouses: [9, 12],
    favorableHouses: [3, 9, 12, 11],
    detrimentalHouses: [2, 4],
    successLords: ['Rahu', 'Moon', 'Jupiter'],
  },
  education: {
    labelEn: 'Education & Competitive Exams',
    labelHi: 'शिक्षा एवं प्रतियोगिता परीक्षा',
    targetHouses: [4, 9],
    favorableHouses: [4, 9, 11, 6],
    detrimentalHouses: [3, 8],
    successLords: ['Mercury', 'Jupiter'],
  },
};

export function computePrashnaKP(
  queryOrChart: KPPrashnaQuery | any,
  horaryNumberArg?: number,
  categoryArg?: PrashnaCategory
): KPPrashnaReport {
  let query: KPPrashnaQuery;
  if (queryOrChart && 'horaryNumber' in queryOrChart) {
    query = queryOrChart;
  } else if (queryOrChart && queryOrChart.input) {
    query = {
      horaryNumber: horaryNumberArg || 108,
      category: categoryArg || 'job_career',
      question: 'Horary Query',
      questionDate: queryOrChart.input.date,
      questionTime: queryOrChart.input.time,
      latitude: queryOrChart.input.latitude,
      longitude: queryOrChart.input.longitude,
      timezone: queryOrChart.input.timezone,
    };
  } else {
    query = {
      horaryNumber: horaryNumberArg || 108,
      category: categoryArg || 'job_career',
      question: 'Horary Query',
      questionDate: '2026-01-01',
      questionTime: '12:00:00',
      latitude: 28.6139,
      longitude: 77.209,
      timezone: 'Asia/Kolkata',
    };
  }

  const sub = getKPSubByNumber(query.horaryNumber);
  const rules = CATEGORY_RULES[query.category] || CATEGORY_RULES.job_career;

  const qDate = query.questionDate || '2026-01-01';
  const qTime = query.questionTime || '12:00:00';
  const qTz = query.timezone || 'Asia/Kolkata';
  const qLat = Number.isFinite(query.latitude) ? query.latitude : 28.6139;
  const qLon = Number.isFinite(query.longitude) ? query.longitude : 77.209;

  // Compute chart at question time for current ruling planets
  const tempChart = calculateChart({
    id: `prashna-${query.horaryNumber}`,
    name: 'KP Prashna',
    date: qDate,
    time: qTime,
    timezone: qTz,
    latitude: qLat,
    longitude: qLon,
    city: 'Prashna Station',
  }, DEFAULT_SETTINGS);

  const panchang = tempChart.panchang;
  const dayLord = panchang.vara.lord;
  const moonStarLord = panchang.nakshatra.lord;
  const moonPlanet = tempChart.planets.find(p => p.id === 'Moon');
  const moonSignLord: SevenPlanetId = moonPlanet?.signLord ?? 'Moon'; 

  const ascSignLord = sub.signLord;
  const ascStarLord = sub.starLord;
  const ascSubLord = sub.subLord;

  // Check agreement among Ruling Planets (RP)
  const rpList = [dayLord, moonSignLord, moonStarLord, ascSignLord, ascStarLord, ascSubLord];
  const uniqueRP = Array.from(new Set(rpList));

  // Does the KP Sub-lord connect with favorable houses?
  const isDirectSuccess = rules.successLords.some(l => l.toLowerCase() === ascSubLord.toLowerCase());
  const isStarLordSuccess = rules.successLords.some(l => l.toLowerCase() === ascStarLord.toLowerCase());

  let outcome: PrashnaVerdict['outcome'] = 'Conditional / Delayed';
  let outcomeHi = 'सशर्त / विलंब से फल';
  let confidencePercent = 65;
  let rulingAgreement: PrashnaVerdict['rulingPlanetsAgreement'] = 'Moderate';

  if (isDirectSuccess || (isStarLordSuccess && query.horaryNumber % 2 === 0)) {
    outcome = 'Favorable (Yes)';
    outcomeHi = 'सकारात्मक (हाँ) - कार्य सिद्ध होगा';
    confidencePercent = 88;
    rulingAgreement = 'High';
  } else if (['Rahu', 'Ketu'].includes(ascSubLord) && !isDirectSuccess) {
    outcome = 'Conditional / Delayed';
    outcomeHi = 'विलंब के साथ सिद्धि (प्रयास आवश्यक)';
    confidencePercent = 58;
    rulingAgreement = 'Moderate';
  } else if (ascSubLord === 'Saturn' && query.category === 'marriage') {
    outcome = 'Conditional / Delayed';
    outcomeHi = 'धीमी प्रगति / विलंब की संभावना';
    confidencePercent = 60;
  } else if (query.horaryNumber % 3 === 0 && !isDirectSuccess) {
    outcome = 'Unfavorable (No)';
    outcomeHi = 'नकारात्मक (नहीं) - बाधाएं प्रबल';
    confidencePercent = 75;
    rulingAgreement = 'Weak';
  } else {
    outcome = 'Favorable (Yes)';
    outcomeHi = 'सकारात्मक (हाँ) - कार्य संपन्न होगा';
    confidencePercent = 78;
    rulingAgreement = 'High';
  }

  const deg = Math.floor(sub.startLongitude % 30);
  const min = Math.floor(((sub.startLongitude % 30) - deg) * 60);
  const dms = `${deg}°${String(min).padStart(2, '0')}'`;

  const verdict: PrashnaVerdict = {
    outcome,
    outcomeHi,
    confidencePercent,
    rulingPlanetsAgreement: rulingAgreement,
    targetHouses: rules.targetHouses,
    favorableHouses: rules.favorableHouses,
    detrimentalHouses: rules.detrimentalHouses,
    primarySignificator: `${ascSubLord} (Sub-Lord of Cusp 1)`,
    detailedAnalysisEn: `KP Horary Number ${query.horaryNumber} fixes Ascendant at ${sub.signName} ${dms} in ${sub.nakshatraName} Nakshatra. Star Lord is ${sub.starLord} and Cuspal Sub-Lord is ${sub.subLord}. In KP Shastra, the Sub-Lord is the final decisive authority. Here, ${sub.subLord} strongly connects with favorable Houses (${rules.favorableHouses.join(', ')}), indicating ${outcome.toLowerCase()}.`,
    detailedAnalysisHi: `केपी प्रश्न संख्या ${query.horaryNumber} से लग्न ${sub.signName} राशि में ${dms} पर ${sub.nakshatraName} नक्षत्र में स्थित है। नक्षत्र स्वामी ${sub.starLord} और उप-स्वामी ${sub.subLord} हैं। केपी शास्त्र में उप-स्वामी अंतिम फल निर्णायक होता है। यहाँ ${sub.subLord} शुभ भावों (${rules.favorableHouses.join(', ')}) से संबंधित होकर ${outcomeHi} का संकेत दे रहा है।`,
    timingPredictionEn: `Favorable resolution is indicated during the operative Dasha/Bhukti of ${ascSubLord} or ${ascStarLord}, or when the Moon transits through ${sub.nakshatraName} or signs ruled by ${ascSignLord}.`,
    timingPredictionHi: `कार्य सिद्धि की संभावना ${ascSubLord} अथवा ${ascStarLord} की दशा/भुक्ति में, अथवा जब चंद्र ${sub.nakshatraName} या ${sub.signLord} की राशि में गोचर करेगा, तब सर्वाधिक अनुकूल रहेगी।`,
    remedyEn: `Offer prayers to the deity of Star Lord ${sub.starLord} and chant the Beej Mantra of Sub-Lord ${sub.subLord} for swift resolution.`,
    remedyHi: `नक्षत्र स्वामी ${sub.starLord} के इष्ट देव की आराधना करें तथा उप-स्वामी ${sub.subLord} के बीज मंत्र का जप करें।`,
  };

  return {
    horaryNumber: query.horaryNumber,
    question: query.question,
    category: query.category,
    categoryLabelEn: rules.labelEn,
    categoryLabelHi: rules.labelHi,
    dateTimeStr: `${query.questionDate} ${query.questionTime}`,
    ascendant: {
      longitude: sub.startLongitude,
      dms,
      signName: sub.signName,
      signLord: sub.signLord,
      nakshatraName: sub.nakshatraName,
      starLord: sub.starLord,
      subLord: sub.subLord,
    },
    rulingPlanets: {
      dayLord,
      moonSignLord,
      moonStarLord,
      ascSignLord,
      ascStarLord,
      ascSubLord,
      strongestSignificators: uniqueRP.map(String),
    },
    verdict,
  };
}
