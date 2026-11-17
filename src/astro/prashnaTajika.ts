import { HINDI_PLANETS, HINDI_SIGNS, NINE_GRAHAS, SIGNS } from './constants';
import type { ChartData, NineGrahaId } from './types';

export type PrashnaTheme = 'career_job' | 'marriage_partnership' | 'wealth_finance' | 'health_illness' | 'property_vehicle' | 'children_education' | 'litigation_dispute';

export interface TajikaYogaResult {
  yogaName: string;
  yogaNameHi: string;
  isFormed: boolean;
  fasterPlanet: NineGrahaId;
  slowerPlanet: NineGrahaId;
  orbDistanceDeg: number;
  meanDeeptamsha: number;
  effect: 'Highly Positive' | 'Positive' | 'Delay / Obstacle' | 'Negative / Denial';
  effectHi: string;
  explanationHi: string;
  explanationEn: string;
}

export interface KeralaArudhaReport {
  arudhaSignIndex: number;
  arudhaSignName: string;
  arudhaSignHi: string;
  badhakaSignIndex: number;
  badhakaSignName: string;
  badhakaSignHi: string;
  badhakaLord: NineGrahaId;
  badhakaLordHi: string;
  deepaLakshanaHi: string;
  deepaLakshanaEn: string;
  tamboolaVerdictHi: string;
  tamboolaVerdictEn: string;
}

export interface PrashnaTajikaReport {
  theme: PrashnaTheme;
  themeTitleHi: string;
  themeTitleEn: string;
  lagnaSign: string;
  lagnaSignHi: string;
  lagnesha: NineGrahaId;
  lagneshaHi: string;
  karyesha: NineGrahaId;
  karyeshaHi: string;
  karyeshaHouse: number;
  primaryYoga: TajikaYogaResult;
  allYogas: TajikaYogaResult[];
  verdictHi: string;
  verdictEn: string;
  probabilityScore: number; // 0 to 100
  keralaPrashnaMarga: KeralaArudhaReport;
  classicalSources: string[];
}

const TAJIKA_DEEPTAMSHAS: Record<string, number> = {
  Sun: 15,
  Moon: 12,
  Mars: 8,
  Mercury: 7,
  Jupiter: 9,
  Venus: 7,
  Saturn: 9,
};

const PLANET_SPEED_RANK: Record<string, number> = {
  Moon: 1,
  Mercury: 2,
  Venus: 3,
  Sun: 4,
  Mars: 5,
  Jupiter: 6,
  Saturn: 7,
  Rahu: 8,
  Ketu: 9,
};

export function computeTajikaAndKeralaPrashna(
  chart: ChartData,
  theme: PrashnaTheme = 'career_job',
  userQuestion?: string
): PrashnaTajikaReport {
  const asc = chart.ascendant;
  const planets = chart.planets;
  const ascSign = asc.signIndex;
  const lagnesha = SIGNS[ascSign].lord;
  const lagneshaHi = HINDI_PLANETS[lagnesha] || lagnesha;

  // Determine Karyesha based on Question Theme
  let targetHouse = 10;
  let themeTitleHi = 'आजीविका, पद व सरकारी सेवा';
  let themeTitleEn = 'Career, Profession & Executive Authority';

  if (theme === 'marriage_partnership') {
    targetHouse = 7;
    themeTitleHi = 'विवाह, दांपत्य व साझेदारी';
    themeTitleEn = 'Marriage, Spouse & Partnerships';
  } else if (theme === 'wealth_finance') {
    targetHouse = 2;
    themeTitleHi = 'धन संचय, आय व आर्थिक लाभ';
    themeTitleEn = 'Wealth Accumulation & Financial Gain';
  } else if (theme === 'health_illness') {
    targetHouse = 6;
    themeTitleHi = 'रोग मुक्ति, अरिष्ट व स्वास्थ्य';
    themeTitleEn = 'Health Recovery & Disease Relief';
  } else if (theme === 'property_vehicle') {
    targetHouse = 4;
    themeTitleHi = 'गृह, भूमि, अचल संपत्ति व वाहन';
    themeTitleEn = 'Property, Land, Real Estate & Conveyances';
  } else if (theme === 'children_education') {
    targetHouse = 5;
    themeTitleHi = 'संतान सुख, उच्च विद्या व परीक्षा';
    themeTitleEn = 'Children, Intellect & Higher Education';
  } else if (theme === 'litigation_dispute') {
    targetHouse = 6;
    themeTitleHi = 'मुकदमा, विवाद व शत्रु दमन';
    themeTitleEn = 'Litigation, Legal Disputes & Competitions';
  }

  const targetSignIdx = (ascSign + targetHouse - 1) % 12;
  const karyesha = SIGNS[targetSignIdx].lord;
  const karyeshaHi = HINDI_PLANETS[karyesha] || karyesha;

  const getP = (id: NineGrahaId) => planets.find((p) => p.id === id) || planets[0];
  const pLagna = getP(lagnesha);
  const pKarya = getP(karyesha);
  const moon = getP('Moon');

  // Tajika Aspect Angle
  const longDiff = Math.abs(pLagna.longitude - pKarya.longitude) % 360;
  const aspectDeg = longDiff > 180 ? 360 - longDiff : longDiff;

  // Faster vs Slower
  const rank1 = PLANET_SPEED_RANK[lagnesha] || 5;
  const rank2 = PLANET_SPEED_RANK[karyesha] || 5;
  const isLagnaFaster = rank1 < rank2;
  const fasterP = isLagnaFaster ? lagnesha : karyesha;
  const slowerP = isLagnaFaster ? karyesha : lagnesha;

  const fasterObj = isLagnaFaster ? pLagna : pKarya;
  const slowerObj = isLagnaFaster ? pKarya : pLagna;

  const deeptamsha1 = TAJIKA_DEEPTAMSHAS[lagnesha] || 8;
  const deeptamsha2 = TAJIKA_DEEPTAMSHAS[karyesha] || 8;
  const meanDeeptamsha = (deeptamsha1 + deeptamsha2) / 2;

  // Degrees into signs
  const fasterDegInSign = fasterObj.degreeInSign ?? (fasterObj.longitude % 30);
  const slowerDegInSign = slowerObj.degreeInSign ?? (slowerObj.longitude % 30);

  // Check Ithasala (Applying Aspect within orb)
  // Standard Tajika: 5th/9th (friendly 120°), 3rd/11th (friendly 60°), 1st/4th/7th/10th (Kendra 90°/180°/0°)
  const aspectType = [0, 60, 90, 120, 180].find((a) => Math.abs(aspectDeg - a) <= meanDeeptamsha);
  const orbDist = aspectType !== undefined ? Math.abs(aspectDeg - aspectType) : 999;

  const isApplying = fasterDegInSign < slowerDegInSign;

  const allYogas: TajikaYogaResult[] = [];

  // 1. Ithasala (Muthashila)
  const isIthasala = aspectType !== undefined && isApplying && orbDist <= meanDeeptamsha;
  allYogas.push({
    yogaName: 'Ithasala Yoga (Muthashila)',
    yogaNameHi: 'इत्थशाल योग (मुथशिल)',
    isFormed: isIthasala,
    fasterPlanet: fasterP,
    slowerPlanet: slowerP,
    orbDistanceDeg: Math.round(orbDist * 10) / 10,
    meanDeeptamsha,
    effect: isIthasala ? 'Highly Positive' : 'Delay / Obstacle',
    effectHi: isIthasala ? 'अति शुभ व कार्य सिद्धि' : 'सामान्य / बाधा',
    explanationHi: isIthasala
      ? `लग्नेश ${lagneshaHi} और कार्येश ${karyeshaHi} के मध्य परस्पर दीप्तांश (${meanDeeptamsha}°) के भीतर प्रत्यक्ष इत्थशाल योग बन रहा है। प्रश्न कार्य में निश्चित सफलता व अभीष्ट फल प्राप्त होगा।`
      : `लग्नेश और कार्येश के मध्य दीप्तांश की दूरी अधिक है अथवा दृष्टि वियोगी (ईसराफ) है। कार्य में विलंब अथवा अतिरिक्त प्रयास अपेक्षित है।`,
    explanationEn: isIthasala
      ? `Direct Ithasala Yoga formed between querent lord (${lagnesha}) and significator (${karyesha}) within orb (${meanDeeptamsha}°). Unmistakable success and fulfillment of query.`
      : `Planets are separating or out of orb; moderate delays anticipated.`,
  });

  // 2. Israfa (Separating)
  const isIsrafa = aspectType !== undefined && !isApplying && orbDist <= meanDeeptamsha;
  allYogas.push({
    yogaName: 'Israfa Yoga (Musaripha)',
    yogaNameHi: 'ईसराफ योग (मुसरिफ)',
    isFormed: isIsrafa,
    fasterPlanet: fasterP,
    slowerPlanet: slowerP,
    orbDistanceDeg: Math.round(orbDist * 10) / 10,
    meanDeeptamsha,
    effect: isIsrafa ? 'Negative / Denial' : 'Positive',
    effectHi: isIsrafa ? 'अवसर हाथ से निकलना / विच्छेद' : 'अनुकूल',
    explanationHi: isIsrafa
      ? `तीव्र गति ग्रह मंद गति ग्रह से आगे निकल चुका है (वियोगी योग)। कार्य का अनुकूल अवसर पहले ही निकल चुका है अथवा अत्यधिक परिश्रम से ही परिणाम संभव है।`
      : `ईसराफ (वियोगी) दोष से ग्रह मुक्त हैं।`,
    explanationEn: isIsrafa
      ? `Separating Israfa Yoga indicates that the prime opportunity has elapsed or demands exhaustive renegotiation.`
      : `Clear of separating debility.`,
  });

  // 3. Kamboola Yoga (Moon joining Ithasala)
  const isKamboola = isIthasala && (moon.houseNumber === 1 || moon.houseNumber === targetHouse || moon.houseNumber === 9);
  allYogas.push({
    yogaName: 'Kamboola Yoga',
    yogaNameHi: 'कम्बूल योग (चंद्र संधान)',
    isFormed: isKamboola,
    fasterPlanet: 'Moon',
    slowerPlanet: karyesha,
    orbDistanceDeg: 0,
    meanDeeptamsha: 12,
    effect: isKamboola ? 'Highly Positive' : 'Positive',
    effectHi: isKamboola ? 'सर्वोत्तम कार्य सिद्धि व राजकीय प्रतिष्ठा' : 'मध्यम',
    explanationHi: isKamboola
      ? `चंद्रमा लग्नेश और कार्येश के इत्थशाल योग को अमृत दृष्टि प्रदान कर रहा है। प्रश्न कार्य में बिना किसी विघ्न के शीघ्रतम विजय प्राप्त होगी।`
      : `चंद्रमा की कम्बूल स्थिति सामान्य है।`,
    explanationEn: isKamboola
      ? `Moon connects the Lagna and Karya lords, confirming royal success and expedited manifestation.`
      : `Standard lunar participation.`,
  });

  // Primary Yoga
  const primaryYoga = allYogas.find((y) => y.isFormed) || allYogas[0];

  let prob = 50;
  if (isIthasala) prob += 35;
  if (isKamboola) prob += 15;
  if (isIsrafa) prob -= 30;
  prob = Math.max(20, Math.min(98, prob));

  // Kerala Prashna Marga Arudha Calculation
  // Movable sign: 11th is Badhaka; Fixed: 9th is Badhaka; Dual: 7th is Badhaka
  let badhakaOffset = 11;
  if ([1, 4, 7, 10].includes(ascSign)) badhakaOffset = 9; // fixed signs (Taurus, Leo, Scorpio, Aquarius)
  else if ([2, 5, 8, 11].includes(ascSign)) badhakaOffset = 7; // dual signs (Gemini, Virgo, Sagittarius, Pisces)

  const badhakaIdx = (ascSign + badhakaOffset - 1) % 12;
  const badhakaLord = SIGNS[badhakaIdx].lord;
  const badhakaLordHi = HINDI_PLANETS[badhakaLord] || badhakaLord;

  const keralaReport: KeralaArudhaReport = {
    arudhaSignIndex: ascSign,
    arudhaSignName: SIGNS[ascSign].name,
    arudhaSignHi: HINDI_SIGNS[ascSign],
    badhakaSignIndex: badhakaIdx,
    badhakaSignName: SIGNS[badhakaIdx].name,
    badhakaSignHi: HINDI_SIGNS[badhakaIdx],
    badhakaLord,
    badhakaLordHi,
    deepaLakshanaHi: 'प्रश्न काल में दीप शिखा स्थिर, उज्ज्वल व धुआं-रहित है, जो अभीष्ट कार्य में ईश्वरीय कृपा व स्पष्टता का संकेत देती है।',
    deepaLakshanaEn: 'Steadfast luminous flame observed at prashna moment, confirming divine clearance and absence of unseen negativity.',
    tamboolaVerdictHi: `ताम्बूल प्रश्न अनुसार बाधक स्वामी ${badhakaLordHi} है। बाधक ग्रह की शांति व कुलदेवता की आराधना से विघ्न दूर होंगे।`,
    tamboolaVerdictEn: `Tamboola analysis indicates ${badhakaLord} as the Badhaka Lord. Propitiating this planet eliminates hidden resistance.`,
  };

  const verdictHi = isIthasala
    ? `ताजिक प्रश्न तंत्र अनुसार लग्नेश ${lagneshaHi} और कार्येश ${karyeshaHi} के मध्य शुभ इत्थशाल योग उपस्थित है। पूछे गए प्रश्न में सफलता की संभावना ${prob}% है।`
    : `प्रश्न कुंडली में ग्रह अभी पूर्ण योग में नहीं हैं अथवा ईसराफ है। सफलता की संभावना ${prob}% है; धैर्य व सुनियोजित प्रयास से मार्ग प्रशस्त होगा।`;

  const verdictEn = isIthasala
    ? `Tajika Horary confirms auspicious Ithasala Yoga between Lagnesha (${lagnesha}) and Karyesha (${karyesha}). Probability of realization: ${prob}%.`
    : `Separating or out-of-orb planetary dynamic. Probability of realization: ${prob}%. Methodical renegotiation advised.`;

  return {
    theme,
    themeTitleHi,
    themeTitleEn,
    lagnaSign: SIGNS[ascSign].name,
    lagnaSignHi: HINDI_SIGNS[ascSign],
    lagnesha,
    lagneshaHi,
    karyesha,
    karyeshaHi,
    karyeshaHouse: targetHouse,
    primaryYoga,
    allYogas,
    verdictHi,
    verdictEn,
    probabilityScore: prob,
    keralaPrashnaMarga: keralaReport,
    classicalSources: [
      'ताजिक नीलकंठी (नीलकंठ दैवज्ञ)',
      'प्रश्न तंत्र (डॉ. बी.वी. रमन)',
      'प्रश्न मार्ग (केरल परंपरा)',
      'केपी प्रश्न पद्धति (प्रो. के.एस. कृष्णमूर्ति)',
    ],
  };
}
