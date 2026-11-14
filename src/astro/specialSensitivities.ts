import { NINE_GRAHAS, SEVEN_PLANETS, SIGNS, NAKSHATRAS } from './constants';
import { angularDiffDeg, formatDms, normalizeDeg } from './time';
import type { BodyPosition, ChartData, HouseCusp, NineGrahaId, SevenPlanetId } from './types';
import { buildSignPlacement } from './vargas';

// ==========================================
// 1. MRITYU BHAGA (Fatal Degrees)
// ==========================================

export interface MrityuBhagaStatus {
  planet: string;
  signNameEn: string;
  signNameHi: string;
  actualDeg: number;
  actualDms: string;
  mrityuDeg: number;
  mrityuDms: string;
  diffDeg: number;
  isFatalOrb: boolean; // within 1.0 deg
  isCriticalOrb: boolean; // within 2.5 deg
  severity: 'Severe (Within 1°)' | 'Moderate (Within 2.5°)' | 'Safe';
  severityHi: 'अत्यंत संवेदनशील (१° के भीतर)' | 'मध्यम संवेदनशील (२.५° के भीतर)' | 'सुरक्षित';
  dangerYears: number[];
  recommendationEn: string;
  recommendationHi: string;
}

// Classical Mrityu Bhaga degrees per sign (Aries..Pisces)
// Based on Jataka Parijata / Saravali / Phaladeepika
export const MRITYU_BHAGA_TABLE: Record<string, number[]> = {
  Sun: [20, 9, 12, 6, 8, 24, 16, 17, 22, 2, 3, 23],
  Moon: [26, 12, 13, 25, 24, 11, 26, 14, 13, 25, 5, 12],
  Mars: [19, 28, 25, 23, 29, 28, 14, 21, 2, 15, 11, 6],
  Mercury: [15, 14, 13, 12, 8, 18, 20, 10, 21, 22, 7, 5],
  Jupiter: [19, 29, 12, 27, 13, 4, 13, 10, 17, 11, 15, 28],
  Venus: [28, 15, 11, 17, 10, 13, 4, 6, 27, 12, 29, 19],
  Saturn: [10, 4, 7, 9, 12, 16, 3, 18, 28, 14, 13, 15],
  Rahu: [14, 13, 12, 11, 24, 23, 24, 11, 12, 13, 14, 13],
  Ketu: [13, 14, 13, 12, 11, 24, 23, 24, 11, 12, 13, 14],
  Asc: [1, 9, 22, 22, 25, 2, 4, 23, 18, 20, 24, 10],
};

export function computeMrityuBhagaAnalysis(chart: ChartData): MrityuBhagaStatus[] {
  const list: MrityuBhagaStatus[] = [];
  const allBodies = [chart.ascendant, ...chart.planets];

  for (const b of allBodies) {
    const table = MRITYU_BHAGA_TABLE[b.id];
    if (!table) continue;
    const signIdx = b.signIndex;
    const mbDeg = table[signIdx];
    const diff = Math.abs(b.degreeInSign - mbDeg);
    const isFatal = diff <= 1.0;
    const isCritical = diff <= 2.5;

    let severity: MrityuBhagaStatus['severity'] = 'Safe';
    let severityHi: MrityuBhagaStatus['severityHi'] = 'सुरक्षित';

    if (isFatal) {
      severity = 'Severe (Within 1°)';
      severityHi = 'अत्यंत संवेदनशील (१° के भीतर)';
    } else if (isCritical) {
      severity = 'Moderate (Within 2.5°)';
      severityHi = 'मध्यम संवेदनशील (२.५° के भीतर)';
    }

    // Classical danger age triggers
    const dangerYears = isCritical
      ? [signIdx + 1, (signIdx + 1) * 7, Math.min(84, (signIdx + 1) * 12)]
      : [];

    let recEn = 'Planet operates outside fatal Mrityu Bhaga orb; vitality is well preserved.';
    let recHi = 'ग्रह मृत्यु भाग के घातक प्रभाव से मुक्त है; जीवन शक्ति सुरक्षित है।';

    if (isFatal) {
      recEn = `Critical caution: Within 1° of exact Mrityu Bhaga (${mbDeg}°). Perform Maha Mrityunjaya Japa and avoid initiating high-risk adventures during this planet's sub-periods.`;
      recHi = `अत्यंत सावधानी: मृत्यु भाग (${mbDeg}°) के १° के भीतर स्थित है। महामृत्युंजय जप करें तथा इस ग्रह की अंतर्दशा में जोखिमपूर्ण कार्यों से बचें।`;
    } else if (isCritical) {
      recEn = `Moderate sensitivity: Within 2.5° of Mrityu Bhaga (${mbDeg}°). Guard health and monitor transits across this degree.`;
      recHi = `मध्यम संवेदनशीलता: मृत्यु भाग (${mbDeg}°) के २.५° के समीप स्थित। स्वास्थ्य का ध्यान रखें तथा गोचर पर दृष्टि बनाए रखें।`;
    }

    list.push({
      planet: b.id,
      signNameEn: SIGNS[signIdx].name,
      signNameHi: SIGNS[signIdx].sanskrit,
      actualDeg: Math.round(b.degreeInSign * 100) / 100,
      actualDms: b.dms,
      mrityuDeg: mbDeg,
      mrityuDms: `${mbDeg}°00'00"`,
      diffDeg: Math.round(diff * 100) / 100,
      isFatalOrb: isFatal,
      isCriticalOrb: isCritical,
      severity,
      severityHi,
      dangerYears,
      recommendationEn: recEn,
      recommendationHi: recHi,
    });
  }

  return list;
}

// ==========================================
// 2. PUSHKARA BHAGA & PUSHKARA NAVAMSHA
// ==========================================

export interface PushkaraStatus {
  planet: string;
  signIndex: number;
  signNameEn: string;
  signNameHi: string;
  degreeInSign: number;
  dms: string;
  isPushkaraBhaga: boolean;
  pushkaraBhagaDeg: number;
  isPushkaraNavamsha: boolean;
  pushkaraNavamshaSign: string;
  rejuvenationPowerEn: string;
  rejuvenationPowerHi: string;
}

// Pushkara Bhaga exact degrees per sign (Aries..Pisces)
export const PUSHKARA_BHAGA_DEGREES = [21, 14, 24, 7, 21, 14, 24, 7, 21, 14, 24, 7];

// Pushkara Navamshas per sign (0-based navamsha indices 0..8)
// Fire signs (Aries, Leo, Sag): 7th (Gemini) & 9th (Leo) navamshas -> indices 6, 8
// Earth signs (Taurus, Virgo, Cap): 3rd (Pisces), 5th (Taurus) -> indices 2, 4
// Air signs (Gemini, Libra, Aqua): 6th (Pisces), 8th (Taurus) -> indices 5, 7
// Water signs (Cancer, Scorpio, Pisces): 1st (Cancer), 3rd (Virgo) -> indices 0, 2
export const PUSHKARA_NAVAMSHA_INDICES: Record<number, number[]> = {
  0: [6, 8], 4: [6, 8], 8: [6, 8],
  1: [2, 4], 5: [2, 4], 9: [2, 4],
  2: [5, 7], 6: [5, 7], 10: [5, 7],
  3: [0, 2], 7: [0, 2], 11: [0, 2],
};

export function computePushkaraAnalysis(chart: ChartData): PushkaraStatus[] {
  const allBodies = [chart.ascendant, ...chart.planets];
  const results: PushkaraStatus[] = [];

  for (const b of allBodies) {
    const sIdx = b.signIndex;
    const deg = b.degreeInSign;
    const pbDeg = PUSHKARA_BHAGA_DEGREES[sIdx];
    const isPB = Math.abs(deg - pbDeg) <= 1.0;

    const navIdx = Math.floor((deg / 30) * 9);
    const validNavs = PUSHKARA_NAVAMSHA_INDICES[sIdx] || [];
    const isPN = validNavs.includes(navIdx);

    // Calculate Navamsha sign
    const d9SignIdx = (sIdx * 9 + navIdx) % 12;

    let rejEn = 'Normal planetary functioning.';
    let rejHi = 'सामान्य ग्रहीय प्रभाव।';

    if (isPB && isPN) {
      rejEn = 'Supreme Rejuvenation: Both Pushkara Bhaga & Pushkara Navamsha attained. Overcomes dusthana weaknesses, granting lasting spiritual wisdom, wealth, and resilience.';
      rejHi = 'सर्वोच्च अमृत योग: पुष्कर भाग एवं पुष्कर नवांश दोनों प्राप्त। यह योग ग्रह के समस्त दोषों का हरण कर अक्षय धन, विवेक व आरोग्य प्रदान करता है।';
    } else if (isPB) {
      rejEn = `Pushkara Bhaga attained at ${pbDeg}°: Injects profound nourishing energy and recovery power during difficult transits.`;
      rejHi = `पुष्कर भाग (${pbDeg}°) प्राप्त: कठिन परिस्थितियों व गोचर में भी जीवन-रक्षक अमृत शक्ति प्रदान करता है।`;
    } else if (isPN) {
      rejEn = `Pushkara Navamsha in ${SIGNS[d9SignIdx].name}: Fortifies the inner soul-strength (D9) and ensures auspicious long-term fruits.`;
      rejHi = `${SIGNS[d9SignIdx].sanskrit} में पुष्कर नवांश: सूक्ष्म आत्म-बल (D9) को पुष्ट करता है और दीर्घकालिक शुभ फल सुनिश्चित करता है।`;
    }

    results.push({
      planet: b.id,
      signIndex: sIdx,
      signNameEn: SIGNS[sIdx].name,
      signNameHi: SIGNS[sIdx].sanskrit,
      degreeInSign: Math.round(deg * 100) / 100,
      dms: b.dms,
      isPushkaraBhaga: isPB,
      pushkaraBhagaDeg: pbDeg,
      isPushkaraNavamsha: isPN,
      pushkaraNavamshaSign: SIGNS[d9SignIdx].name,
      rejuvenationPowerEn: rejEn,
      rejuvenationPowerHi: rejHi,
    });
  }

  return results;
}

// ==========================================
// 3. NAVATARA CHAKRA (9 Taras across 27 Nakshatras)
// ==========================================

export interface NavataraItem {
  nakshatraIndex: number;
  nakshatraNameEn: string;
  nakshatraNameHi: string;
  paryaya: 1 | 2 | 3;
  taraNumber: number; // 1..9
  taraNameEn: string;
  taraNameHi: string;
  nature: 'Auspicious' | 'Neutral' | 'Inauspicious';
  natureHi: 'शुभ' | 'सम' | 'अशुभ';
  occupyingPlanets: string[];
  significationEn: string;
  significationHi: string;
}

export const TARA_NAMES: Array<{
  en: string;
  hi: string;
  nature: 'Auspicious' | 'Neutral' | 'Inauspicious';
  natureHi: 'शुभ' | 'सम' | 'अशुभ';
  sigEn: string;
  sigHi: string;
}> = [
  { en: 'Janma (Birth)', hi: 'जन्म', nature: 'Neutral', natureHi: 'सम', sigEn: 'Physical vitality, personality, mind', sigHi: 'शारीरिक स्वास्थ्य, व्यक्तित्व व आत्म-बोध' },
  { en: 'Sampat (Wealth)', hi: 'सम्पत्', nature: 'Auspicious', natureHi: 'शुभ', sigEn: 'Great prosperity, financial surge, luxury', sigHi: 'धन-धान्य, वित्तीय लाभ, समृद्धि व सुख' },
  { en: 'Vipat (Peril/Danger)', hi: 'विपत्', nature: 'Inauspicious', natureHi: 'अशुभ', sigEn: 'Obstacles, accidents, financial friction', sigHi: 'विपत्ति, आकस्मिक बाधाएं व आर्थिक हानि' },
  { en: 'Kshema (Wellbeing)', hi: 'क्षेम', nature: 'Auspicious', natureHi: 'शुभ', sigEn: 'Safety, security, family harmony, peace', sigHi: 'सुरक्षा, पारिवारिक सुख, शांति व आरोग्य' },
  { en: 'Pratyak (Obstacles)', hi: 'प्रत्यक्', nature: 'Inauspicious', natureHi: 'अशुभ', sigEn: 'Adversaries, opposition, legal disputes', sigHi: 'शत्रु बाधा, विरोध, कानूनी अड़चनें' },
  { en: 'Sadhaka (Achievement)', hi: 'साधक', nature: 'Auspicious', natureHi: 'शुभ', sigEn: 'Fulfillment of desires, career triumph', sigHi: 'मनोकामना सिद्धि, लक्ष्य प्राप्ति व विजय' },
  { en: 'Vadha/Naidhana (Peril)', hi: 'वध / नैधन', nature: 'Inauspicious', natureHi: 'अशुभ', sigEn: 'Severe health hazard, termination, loss', sigHi: 'गंभीर रोग संकट, हानि व प्राण भय' },
  { en: 'Mitra (Friend)', hi: 'मित्र', nature: 'Auspicious', natureHi: 'शुभ', sigEn: 'Benefactor support, pleasant travel, gains', sigHi: 'मित्र सुख, सहयोग, आनंददायक यात्राएं' },
  { en: 'Ati-Mitra (Best Friend)', hi: 'अति-मित्र', nature: 'Auspicious', natureHi: 'शुभ', sigEn: 'Highest fortune, miraculous divine aid', sigHi: 'परम भाग्य, ईश्वरीय कृपा व अतीव लाभ' },
];

export function computeNavataraChakra(chart: ChartData): NavataraItem[] {
  const moon = chart.planets.find((p) => p.id === 'Moon');
  const janmaNakIdx = moon ? NAKSHATRAS.findIndex((n) => n.name === moon.nakshatraName) : 0;
  const safeJanmaIdx = janmaNakIdx >= 0 ? janmaNakIdx : 0;

  // Build planet occupancy map per nakshatra
  const occMap = new Map<number, string[]>();
  for (const b of [chart.ascendant, ...chart.planets]) {
    const nIdx = NAKSHATRAS.findIndex((n) => n.name === b.nakshatraName);
    if (nIdx >= 0) {
      const list = occMap.get(nIdx) || [];
      list.push(b.id);
      occMap.set(nIdx, list);
    }
  }

  const items: NavataraItem[] = [];

  for (let i = 0; i < 27; i++) {
    const dist = (i - safeJanmaIdx + 27) % 27;
    const paryaya = (Math.floor(dist / 9) + 1) as 1 | 2 | 3;
    const taraIdx = dist % 9;
    const tara = TARA_NAMES[taraIdx];

    items.push({
      nakshatraIndex: i,
      nakshatraNameEn: NAKSHATRAS[i].name,
      nakshatraNameHi: NAKSHATRAS[i].name,
      paryaya,
      taraNumber: taraIdx + 1,
      taraNameEn: tara.en,
      taraNameHi: tara.hi,
      nature: tara.nature,
      natureHi: tara.natureHi,
      occupyingPlanets: occMap.get(i) || [],
      significationEn: tara.sigEn,
      significationHi: tara.sigHi,
    });
  }

  return items;
}

// ==========================================
// 4. SPECIAL LAGNAS, ARUDHAS & SENSITIVE POINTS
// ==========================================

export interface SensitivePointItem {
  id: string;
  nameEn: string;
  nameHi: string;
  category: 'Special Lagna' | 'Arudha Pada' | 'Karmic / Sensitive Point' | 'Upagraha';
  categoryHi: 'विशेष लग्न' | 'आरूढ़ पद' | 'संवेदनशील / कर्म बिंदु' | 'उपग्रह';
  longitude: number;
  dms: string;
  signIndex: number;
  signNameEn: string;
  signNameHi: string;
  houseNumber: number;
  significationEn: string;
  significationHi: string;
}

export interface SensitivePointsReport {
  points: SensitivePointItem[];
  yogiPlanetEn: string;
  yogiPlanetHi: string;
  sahaYogiPlanetEn: string;
  sahaYogiPlanetHi: string;
  avaYogiPlanetEn: string;
  avaYogiPlanetHi: string;
  twentySecondDrekkanaLordEn: string;
  twentySecondDrekkanaLordHi: string;
  twentySecondDrekkanaNature: string;
  sixtyFourthNavamshaLordEn: string;
  sixtyFourthNavamshaLordHi: string;
  dagdhaRashisEn: string[];
  dagdhaRashisHi: string[];
}

// Dagdha Rashis (Zero/Burnt signs) mapped by Tithi index (1..15 Shukla, 1..15 Krishna)
const DAGDHA_RASHIS_BY_TITHI: Record<number, number[]> = {
  1: [6, 9],    // Pratipada: Libra, Capricorn
  2: [8, 11],   // Dwitiya: Sagittarius, Pisces
  3: [2, 7],    // Tritiya: Gemini, Scorpio
  4: [1, 9],    // Chaturthi: Taurus, Capricorn
  5: [2, 5],    // Panchami: Gemini, Virgo
  6: [4, 7],    // Shashthi: Leo, Scorpio
  7: [8, 11],   // Saptami: Sagittarius, Pisces
  8: [2, 4],    // Ashtami: Gemini, Leo
  9: [4, 7],    // Navami: Leo, Scorpio
  10: [4, 7],   // Dashami: Leo, Scorpio
  11: [8, 11],  // Ekadashi: Sagittarius, Pisces
  12: [6, 9],   // Dwadashi: Libra, Capricorn
  13: [1, 9],   // Trayodashi: Taurus, Capricorn
  14: [2, 5, 8, 11], // Chaturdashi: Gemini, Virgo, Sag, Pisces
  15: [],       // Purnima/Amavasya: None
};

export function computeComprehensiveSensitivePoints(chart: ChartData): SensitivePointsReport {
  const points: SensitivePointItem[] = [];

  const sun = chart.planets.find((p) => p.id === 'Sun') || chart.planets[0];
  const moon = chart.planets.find((p) => p.id === 'Moon') || chart.planets[1];
  const mars = chart.planets.find((p) => p.id === 'Mars') || chart.planets[2];
  const jupiter = chart.planets.find((p) => p.id === 'Jupiter') || chart.planets[4];
  const venus = chart.planets.find((p) => p.id === 'Venus') || chart.planets[5];
  const saturn = chart.planets.find((p) => p.id === 'Saturn') || chart.planets[6];
  const rahu = chart.planets.find((p) => p.id === 'Rahu') || chart.planets[7];

  const ascLon = chart.ascendant.longitude;
  const sunLon = sun.longitude;
  const moonLon = moon.longitude;

  // Function to register a point
  const registerPoint = (
    id: string,
    nameEn: string,
    nameHi: string,
    category: SensitivePointItem['category'],
    categoryHi: SensitivePointItem['categoryHi'],
    lon: number,
    sigEn: string,
    sigHi: string
  ) => {
    const norm = normalizeDeg(lon);
    const signIdx = Math.floor(norm / 30) % 12;
    const degInSign = norm % 30;
    const hNum = ((signIdx - chart.ascendant.signIndex + 12) % 12) + 1;

    points.push({
      id,
      nameEn,
      nameHi,
      category,
      categoryHi,
      longitude: norm,
      dms: formatDms(degInSign),
      signIndex: signIdx,
      signNameEn: SIGNS[signIdx].name,
      signNameHi: SIGNS[signIdx].sanskrit,
      houseNumber: hNum,
      significationEn: sigEn,
      significationHi: sigHi,
    });
  };

  // 1. SPECIAL LAGNAS
  // Bhava Lagna (BL): Sun at sunrise + elapsed time / 4 min
  // Hora Lagna (HL): Sun at sunrise + elapsed time / 2 min
  // Ghati Lagna (GL): Sun at sunrise + elapsed time * 5/4
  // Vighati Lagna (VGL): Sun at sunrise + elapsed time * 15
  // Sree Lagna (SL): Moon's nakshatra fractional traversal projected from Lagna
  // Indu Lagna (IL): 9th lords from Lagna and Moon with planetary ray contribution
  const existingSpecial = chart.specialPoints || [];

  const bl = existingSpecial.find((s) => s.id === 'BL');
  if (bl) registerPoint('BL', 'Bhava Lagna (BL)', 'भाव लग्न (BL)', 'Special Lagna', 'विशेष लग्न', bl.longitude, 'Signifies physical vitality, health and personal status.', 'शारीरिक बल, स्वास्थ्य व व्यक्तिगत प्रभाव।');

  const hl = existingSpecial.find((s) => s.id === 'HL');
  if (hl) registerPoint('HL', 'Hora Lagna (HL)', 'होरा लग्न (HL)', 'Special Lagna', 'विशेष लग्न', hl.longitude, 'Prime indicator of financial assets, liquid wealth, and capital accumulation.', 'स्थिर व तरल धन-संपत्ति, संचित कोष व समृद्धि का मुख्य सूचक।');

  const gl = existingSpecial.find((s) => s.id === 'GL');
  if (gl) registerPoint('GL', 'Ghati Lagna (GL)', 'घटी लग्न (GL)', 'Special Lagna', 'विशेष लग्न', gl.longitude, 'Indicator of high authority, power, administrative rank, and fame.', 'प्रशासनिक पद, सत्ता, अधिकार व सामाजिक ख्याति।');

  // Vighati Lagna (1 Vighati = 24 seconds = 6 degrees movement)
  const vglLon = normalizeDeg(ascLon * 6);
  registerPoint('VGL', 'Vighati Lagna (VGL)', 'विघटी लग्न (VGL)', 'Special Lagna', 'विशेष लग्न', vglLon, 'Super-sensitive micro-timing point for breath (Prana) and decisive events.', 'प्राण-शक्ति, सूक्ष्म समय गणना व त्वरित घटना का सूक्ष्म बिंदु।');

  // Varnada Lagna (Parashari Varnada)
  const isAscOdd = chart.ascendant.signIndex % 2 === 0;
  const isHlOdd = (hl?.signIndex ?? 0) % 2 === 0;
  let vlSign = 0;
  if (isAscOdd && isHlOdd) {
    vlSign = (chart.ascendant.signIndex + (hl?.signIndex ?? 0)) % 12;
  } else if (!isAscOdd && !isHlOdd) {
    vlSign = ((12 - chart.ascendant.signIndex) + (12 - (hl?.signIndex ?? 0))) % 12;
  } else {
    vlSign = Math.abs(chart.ascendant.signIndex - (hl?.signIndex ?? 0)) % 12;
  }
  registerPoint('VL', 'Varnada Lagna (VL)', 'वर्णद लग्न (VL)', 'Special Lagna', 'विशेष लग्न', vlSign * 30 + 15, 'Crucial for social standing, relationships, and professional interactions.', 'सामाजिक प्रतिष्ठा, कार्यक्षेत्रीय संबंध व सहयोग।');

  // Sree Lagna (SL): Lagna + (Moon distance in Nakshatra / 13°20') * 360°
  const moonNakDist = (moonLon % (360 / 27));
  const moonNakFraction = moonNakDist / (360 / 27);
  const slLon = normalizeDeg(ascLon + moonNakFraction * 360);
  registerPoint('SL', 'Sree Lagna (SL)', 'श्री लग्न (SL)', 'Special Lagna', 'विशेष लग्न', slLon, 'The seat of Goddess Lakshmi; bestows prosperity, good fortune, and marital grace.', 'महालक्ष्मी कृपा, ऐश्वर्य, दांपत्य सुख व सौभाग्य।');

  // Indu Lagna (IL): Wealth Lagna from 9th lords rays
  // Planetary rays: Sun=30, Moon=16, Mars=6, Mercury=8, Jupiter=10, Venus=12, Saturn=1
  const KALA_RAYS: Record<string, number> = {
    Sun: 30, Moon: 16, Mars: 6, Mercury: 8, Jupiter: 10, Venus: 12, Saturn: 1,
  };
  const l9Lord = SIGNS[(chart.ascendant.signIndex + 8) % 12].lord;
  const m9Lord = SIGNS[(moon.signIndex + 8) % 12].lord;
  const totalRays = (KALA_RAYS[l9Lord] || 8) + (KALA_RAYS[m9Lord] || 8);
  const induRem = totalRays % 12 || 12;
  const induSignIdx = (moon.signIndex + induRem - 1) % 12;
  registerPoint('IL', 'Indu Lagna (IL)', 'इन्दु लग्न (IL)', 'Special Lagna', 'विशेष लग्न', induSignIdx * 30 + 15, 'Classical wealth catalyst; benefics here grant multi-millionaire status.', 'धन का महा-उत्प्रेरक; इसमें शुभ ग्रह होने पर व्यक्ति विपुल धन का स्वामी होता है।');

  // 2. ARUDHA PADAS (AL = A1 through A12 / UL)
  const computeArudhaSign = (baseSign: number): number => {
    const lord = SIGNS[baseSign].lord;
    const lordPlanet = chart.planets.find((p) => p.id === lord);
    const lordSign = lordPlanet ? lordPlanet.signIndex : baseSign;
    const dist = (lordSign - baseSign + 12) % 12;
    let arudhaSign = (lordSign + dist) % 12;
    if (arudhaSign === baseSign || arudhaSign === (baseSign + 6) % 12) {
      arudhaSign = (arudhaSign + 9) % 12; // 10th from raw
    }
    return arudhaSign;
  };

  const ARUDHA_NAMES = [
    { id: 'AL', en: 'Arudha Lagna (AL / A1)', hi: 'आरूढ़ लग्न (AL / A1)', sigEn: 'External image, public persona, perceived status', sigHi: 'सार्वजनिक छवि, समाज में प्रतिष्ठा व प्रत्यक्ष पहचान' },
    { id: 'A2', en: 'Dhana Pada (A2)', hi: 'धन पद (A2)', sigEn: 'Tangible accumulated wealth and family status', sigHi: 'संचित धन, कुटुंब सम्मान व वित्तीय साख' },
    { id: 'A3', en: 'Bhratri Pada (A3)', hi: 'भ्रातृ पद (A3)', sigEn: 'Siblings, initiatives, courage, communication', sigHi: 'भाई-बहन, साहस, उद्यम व संवाद क्षमता' },
    { id: 'A4', en: 'Matri / Sukha Pada (A4)', hi: 'मातृ / सुख पद (A4)', sigEn: 'Real estate, vehicles, mother, inner peace', sigHi: 'भूमि-भवन, वाहन सुख, माता व मानसिक शांति' },
    { id: 'A5', en: 'Mantra / Putra Pada (A5)', hi: 'मंत्र / पुत्र पद (A5)', sigEn: 'Children, intellect, investments, creativity', sigHi: 'संतान, बौद्धिक क्षमता, निवेश व सृजनात्मकता' },
    { id: 'A6', en: 'Roga / Shatru Pada (A6)', hi: 'रोग / शत्रु पद (A6)', sigEn: 'Litigation, debts, physical illness, hurdles', sigHi: 'ऋण, रोग, शत्रु बाधा व कानूनी विवाद' },
    { id: 'A7', en: 'Dara Pada (A7)', hi: 'दार पद (A7)', sigEn: 'Spouse, business partnerships, trade alliances', sigHi: 'जीवनसाथी, व्यापारिक साझेदार व वैवाहिक सुख' },
    { id: 'A8', en: 'Mrityu / Randhra Pada (A8)', hi: 'मृत्यु / रन्ध्र पद (A8)', sigEn: 'Vulnerabilities, hidden transformations, longevity', sigHi: 'आकस्मिक परिवर्तन, गुप्त संकट व आयु विचार' },
    { id: 'A9', en: 'Bhagya Pada (A9)', hi: 'भाग्य पद (A9)', sigEn: 'Higher wisdom, divine grace, mentor, pilgrimages', sigHi: 'भाग्य, गुरु कृपा, धर्म व तीर्थ यात्रा' },
    { id: 'A10', en: 'Rajya Pada (A10)', hi: 'राज्य पद (A10)', sigEn: 'Career zenith, professional leadership, promotions', sigHi: 'करियर, राज-सम्मान, पदोन्नति व कार्य नेतृत्व' },
    { id: 'A11', en: 'Labha Pada (A11)', hi: 'लाभ पद (A11)', sigEn: 'Profits, elder siblings, network realization', sigHi: 'आय, लाभ, बड़े भाई-बहन व मित्रों का सहयोग' },
    { id: 'UL', en: 'Upapada Lagna (UL / A12)', hi: 'उपपद लग्न (UL / A12)', sigEn: 'Marriage sanctity, partner background, family legacy', sigHi: 'विवाह की स्थिरता, ससुराल पक्ष व दांपत्य संबंध' },
  ];

  for (let h = 0; h < 12; h++) {
    const bSign = (chart.ascendant.signIndex + h) % 12;
    const aSign = computeArudhaSign(bSign);
    const meta = ARUDHA_NAMES[h];
    registerPoint(meta.id, meta.en, meta.hi, 'Arudha Pada', 'आरूढ़ पद', aSign * 30 + 15, meta.sigEn, meta.sigHi);
  }

  // 3. KARMIC & SENSITIVE POINTS
  // Bhrigu Bindu (BB): Midpoint of Moon and Rahu (direct path)
  const distMoonRahu = (rahu.longitude - moonLon + 360) % 360;
  const bbLon = normalizeDeg(moonLon + distMoonRahu / 2);
  registerPoint('BB', 'Bhrigu Bindu (BB)', 'भृगु बिंदु (BB)', 'Karmic / Sensitive Point', 'संवेदनशील / कर्म बिंदु', bbLon, 'Fateful destiny point; major life milestones trigger when slow planets transit here.', 'प्रारब्ध व भाग्य का केंद्र बिंदु; इस पर गोचर आने पर जीवन में युगांतरकारी घटनाएं होती हैं।');

  // Beeja Sphuta (BS): Sun + Venus + Jupiter (for male fertility)
  const bsLon = normalizeDeg(sunLon + venus.longitude + jupiter.longitude);
  registerPoint('BS', 'Beeja Sphuta (BS)', 'बीज स्फुट (BS)', 'Karmic / Sensitive Point', 'संवेदनशील / कर्म बिंदु', bsLon, 'Male progeny vitality and generative reproductive strength.', 'पुरुष संतान शक्ति व उत्पादक क्षमता का परिचायक।');

  // Kshetra Sphuta (KS): Moon + Mars + Jupiter (for female fertility)
  const ksLon = normalizeDeg(moonLon + mars.longitude + jupiter.longitude);
  registerPoint('KS', 'Kshetra Sphuta (KS)', 'क्षेत्र स्फुट (KS)', 'Karmic / Sensitive Point', 'संवेदनशील / कर्म बिंदु', ksLon, 'Female reproductive nourishment and childbearing capacity.', 'स्त्री गर्भधारण क्षमता व संतान सुख का निर्णायक बिंदु।');

  // Yogi, Saha Yogi & Ava Yogi
  // Yogi Point = Sun + Moon + 93°20' (Pushya nakshatra start offset)
  const yogiPointLon = normalizeDeg(sunLon + moonLon + 93 + 20 / 60);
  const yogiNakIdx = Math.floor((yogiPointLon / 360) * 27);
  const yogiPlanetId = NAKSHATRAS[yogiNakIdx].lord;
  registerPoint('YOGI', `Yogi Point (${yogiPlanetId})`, `योगी बिंदु (${yogiPlanetId})`, 'Karmic / Sensitive Point', 'संवेदनशील / कर्म बिंदु', yogiPointLon, 'Brings effortless windfalls, luck, and prosperous blessings.', 'अनायास धन लाभ, सौभाग्य व सुखद अवसर प्रदान करने वाला बिंदु।');

  // Saha Yogi is the sign lord of Yogi Point
  const yogiSignIdx = Math.floor(yogiPointLon / 30) % 12;
  const sahaYogiPlanetId = SIGNS[yogiSignIdx].lord;

  // Ava Yogi is 6th Nakshatra from Yogi Nakshatra
  const avaYogiNakIdx = (yogiNakIdx + 6) % 27;
  const avaYogiPlanetId = NAKSHATRAS[avaYogiNakIdx].lord;

  // 22nd Drekkana (Kharesh): 8th house Drekkana lord
  const d3LagnaSign = (chart.ascendant.signIndex + Math.floor((chart.ascendant.degreeInSign / 10)) * 4) % 12;
  const d3EighthSign = (d3LagnaSign + 7) % 12;
  const twentySecondDrekkanaLord = SIGNS[d3EighthSign].lord;
  const isSarpa = d3EighthSign === 3 || d3EighthSign === 7 || d3EighthSign === 11;
  const drekkanaNature = isSarpa ? 'Sarpa Drekkana (Toxic / Serpent Hazard)' : 'Ordinary Drekkana';

  // 64th Navamsha (Kharesh): 4th from Moon in D9 or 8th from Lagna in D9
  const moonD9Sign = (moon.signIndex * 9 + Math.floor((moon.degreeInSign / 30) * 9)) % 12;
  const sixtyFourthSign = (moonD9Sign + 3) % 12;
  const sixtyFourthNavamshaLord = SIGNS[sixtyFourthSign].lord;

  // Dagdha Rashis (Zero/Burnt signs)
  const tithiNum = ((chart.panchang.tithi.number - 1) % 15) + 1;
  const dagdhaIndices = DAGDHA_RASHIS_BY_TITHI[tithiNum] || [];
  const dagdhaEn = dagdhaIndices.map((i) => SIGNS[i].name);
  const dagdhaHi = dagdhaIndices.map((i) => SIGNS[i].sanskrit);

  // 4. UPAGRAHAS (Gulika, Mandi, Yamaghantaka, Kala, Mrityu, Ardhaprahara, Dhooma, Vyatipata, Parivesha, Indrachapa, Upaketu)
  // Non-luminous mathematical shadow planets
  // Dhooma = Sun + 133°20'
  const dhoomaLon = normalizeDeg(sunLon + 133 + 20 / 60);
  registerPoint('Dhooma', 'Dhooma (धूम)', 'धूम', 'Upagraha', 'उपग्रह', dhoomaLon, 'Shadow planet of heat, acute stress, and feverish outbursts.', 'ताप, तीव्र मानसिक तनाव व आक्रामकता का उपग्रह।');

  // Vyatipata = 360° - Dhooma
  const vyatipataLon = normalizeDeg(360 - dhoomaLon);
  registerPoint('Vyatipata', 'Vyatipata (व्यतिपात)', 'व्यतिपात', 'Upagraha', 'उपग्रह', vyatipataLon, 'Severe obstacle catalyst and turbulent karmic corrections.', 'आकस्मिक बाधाएं व कर्म सुधार का उपग्रह।');

  // Parivesha = Vyatipata + 180°
  const pariveshaLon = normalizeDeg(vyatipataLon + 180);
  registerPoint('Parivesha', 'Parivesha (परिवेष)', 'परिवेष', 'Upagraha', 'उपग्रह', pariveshaLon, 'Solar halo shadow; mental confinement and secret worries.', 'मानसिक भय, चिंता व अवरोध का उपग्रह।');

  // Indrachapa = 360° - Parivesha
  const indrachapaLon = normalizeDeg(360 - pariveshaLon);
  registerPoint('Indrachapa', 'Indrachapa / Kodanda (इंद्रचाप)', 'इंद्रचाप', 'Upagraha', 'उपग्रह', indrachapaLon, 'Rainbow shadow; deceptive allures and sudden reverses.', 'भ्रामक आकर्षण व अचानक हानि का उपग्रह।');

  // Upaketu = Indrachapa + 16°40'
  const upaketuLon = normalizeDeg(indrachapaLon + 16 + 40 / 60);
  registerPoint('Upaketu', 'Upaketu (उपकेतु)', 'उपकेतु', 'Upagraha', 'उपग्रह', upaketuLon, 'Comet tail; catalytic breaks and unconventional insight.', 'आकस्मिक विच्छेदन व वैराग्य का उपग्रह।');

  return {
    points,
    yogiPlanetEn: yogiPlanetId,
    yogiPlanetHi: yogiPlanetId,
    sahaYogiPlanetEn: sahaYogiPlanetId,
    sahaYogiPlanetHi: sahaYogiPlanetId,
    avaYogiPlanetEn: avaYogiPlanetId,
    avaYogiPlanetHi: avaYogiPlanetId,
    twentySecondDrekkanaLordEn: twentySecondDrekkanaLord,
    twentySecondDrekkanaLordHi: twentySecondDrekkanaLord,
    twentySecondDrekkanaNature: drekkanaNature,
    sixtyFourthNavamshaLordEn: sixtyFourthNavamshaLord,
    sixtyFourthNavamshaLordHi: sixtyFourthNavamshaLord,
    dagdhaRashisEn: dagdhaEn,
    dagdhaRashisHi: dagdhaHi,
  };
}
