import { NAKSHATRAS, SIGNS } from './constants';
import type { ChartData, NineGrahaId, PlanetId, SevenPlanetId } from './types';

export type ChakraBodyId = PlanetId | 'Asc' | NineGrahaId | SevenPlanetId;

// ==========================================
// 1. SUDARSHAN CHAKRA
// ==========================================
export interface SudarshanWheelHouse {
  houseNumber: number;
  lagnaSign: number;
  moonSign: number;
  sunSign: number;
  lagnaOccupants: ChakraBodyId[];
  moonOccupants: ChakraBodyId[];
  sunOccupants: ChakraBodyId[];
}

export interface SudarshanChakraData {
  ageYears: number;
  activeHouse: number;
  lagnaSign: number;
  moonSign: number;
  sunSign: number;
  houses: SudarshanWheelHouse[];
  annualSynthesisEn: string;
  annualSynthesisHi: string;
}

// ==========================================
// 2. SARVATOBHADRA CHAKRA (28 Nakshatras)
// ==========================================
export const NAKSHATRAS_28 = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashirsha', 'Ardra', 'Punarvasu',
  'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra',
  'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha', 'Uttara Ashadha',
  'Abhijit', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
] as const;

export interface SpecialNakshatraPoint {
  key: string;
  titleEn: string;
  titleHi: string;
  offsetFromJanma: number; // 1-based (Janma=1, Karma=10, Sanghatika=16, etc.)
  nakshatraIndex27: number;
  nakshatraName: string;
  occupants: ChakraBodyId[];
  vedhaBy: {
    planet: ChakraBodyId;
    type: 'direct' | 'left' | 'right';
    isMalefic: boolean;
  }[];
  verdictEn: string;
  verdictHi: string;
}

export interface SarvatobhadraData {
  janmaNakshatra: string;
  specialPoints: SpecialNakshatraPoint[];
  maleficVedhaCount: number;
  beneficVedhaCount: number;
  summaryEn: string;
  summaryHi: string;
}

// ==========================================
// 3. KOTA CHAKRA (Fortress Analysis)
// ==========================================
export type KotaZone = 'stambha' | 'madhya' | 'kantaka' | 'bahya';

export interface KotaPlanetPlacement {
  planet: ChakraBodyId;
  zone: KotaZone;
  nakshatra: string;
  isMalefic: boolean;
  direction: 'inward' | 'outward'; // Arohi vs Avarohi
}

export interface KotaChakraData {
  kotaSwami: ChakraBodyId; // Lord of the Moon sign
  kotaPala: ChakraBodyId;  // Lord of the 8th rasi or Nakshatra lord
  stambhaNakshatras: string[];
  madhyaNakshatras: string[];
  kantakaNakshatras: string[];
  bahyaNakshatras: string[];
  placements: KotaPlanetPlacement[];
  defenseStrengthEn: string;
  defenseStrengthHi: string;
  siegeRiskScore: number; // 0 to 100
  analysisEn: string;
  analysisHi: string;
}

// ==========================================
// 4. KURMA CHAKRA (Cosmic Earth Tortoise)
// ==========================================
export type KurmaDirection =
  | 'center'
  | 'east'
  | 'south_east'
  | 'south'
  | 'south_west'
  | 'west'
  | 'north_west'
  | 'north'
  | 'north_east';

export interface KurmaDirectionZone {
  direction: KurmaDirection;
  titleEn: string;
  titleHi: string;
  nakshatras: string[];
  occupants: ChakraBodyId[];
  maleficScore: number;
  beneficScore: number;
  statusEn: string;
  statusHi: string;
}

export interface KurmaChakraData {
  zones: KurmaDirectionZone[];
  afflictedDirectionsEn: string[];
  afflictedDirectionsHi: string[];
  safeDirectionsEn: string[];
  safeDirectionsHi: string[];
  guidanceEn: string;
  guidanceHi: string;
}

// ==========================================
// COMPUTATION IMPLEMENTATIONS
// ==========================================

const NATURAL_MALEFICS = new Set<string>(['Sun', 'Mars', 'Saturn', 'Rahu', 'Ketu']);

export function computeSudarshanChakra(chart: ChartData, targetYear?: number): SudarshanChakraData {
  const birthYear = parseInt(chart.input.date.split('-')[0], 10);
  const currentYear = targetYear ?? new Date().getFullYear();
  const ageYears = Math.max(1, currentYear - birthYear + 1);
  const activeHouse = ((ageYears - 1) % 12) + 1;

  const lagnaSign = chart.ascendant.signIndex;
  const moonSign = chart.planets.find((p) => p.id === 'Moon')?.signIndex ?? 0;
  const sunSign = chart.planets.find((p) => p.id === 'Sun')?.signIndex ?? 0;

  const houses: SudarshanWheelHouse[] = [];

  for (let h = 1; h <= 12; h++) {
    const lSign = (lagnaSign + h - 1) % 12;
    const mSign = (moonSign + h - 1) % 12;
    const sSign = (sunSign + h - 1) % 12;

    const lagnaOccupants: ChakraBodyId[] = chart.planets.filter((p) => p.signIndex === lSign).map((p) => p.id);
    const moonOccupants: ChakraBodyId[] = chart.planets.filter((p) => p.signIndex === mSign).map((p) => p.id);
    const sunOccupants: ChakraBodyId[] = chart.planets.filter((p) => p.signIndex === sSign).map((p) => p.id);

    houses.push({
      houseNumber: h,
      lagnaSign: lSign,
      moonSign: mSign,
      sunSign: sSign,
      lagnaOccupants,
      moonOccupants,
      sunOccupants,
    });
  }

  const actH = houses[activeHouse - 1];
  const allActOccupants = [
    ...new Set([...actH.lagnaOccupants, ...actH.moonOccupants, ...actH.sunOccupants]),
  ];

  const synthesisEn = `In year ${currentYear} (running year ${ageYears}), the 3 wheels of Sudarshan align on House ${activeHouse}. Physical realm (Lagna: ${SIGNS[actH.lagnaSign].name}), Emotional realm (Moon: ${SIGNS[actH.moonSign].name}), and Soul purpose (Sun: ${SIGNS[actH.sunSign].name}) are jointly triggered. Key active influencers: ${allActOccupants.length > 0 ? allActOccupants.join(', ') : 'Free of direct planet occupants'}.`;
  const synthesisHi = `वर्ष ${currentYear} (प्रवाह वर्ष ${ageYears}) में सुदर्शन चक्र के तीनों वलय ${activeHouse}वें भाव पर संरेखित होते हैं। भौतिक स्वरूप (लग्न: ${SIGNS[actH.lagnaSign].sanskrit}), मानसिक चेतना (चंद्र: ${SIGNS[actH.moonSign].sanskrit}) और आत्मिक उद्देश्य (सूर्य: ${SIGNS[actH.sunSign].sanskrit}) संयुक्त रूप से सक्रिय हैं। मुख्य सक्रिय ग्रह: ${allActOccupants.length > 0 ? allActOccupants.join(', ') : 'कोई प्रत्यक्ष ग्रह नहीं'}.`;

  return {
    ageYears,
    activeHouse,
    lagnaSign,
    moonSign,
    sunSign,
    houses,
    annualSynthesisEn: synthesisEn,
    annualSynthesisHi: synthesisHi,
  };
}

export function computeSarvatobhadraChakra(chart: ChartData): SarvatobhadraData {
  const moon = chart.planets.find((p) => p.id === 'Moon');
  const janmaNakIdx = moon ? moon.nakshatraIndex : 0;
  const janmaName = NAKSHATRAS[janmaNakIdx].name;

  const SPECIAL_OFFSETS: Array<{
    key: string;
    titleEn: string;
    titleHi: string;
    offset: number;
  }> = [
    { key: 'janma', titleEn: 'Janma Nakshatra (Body/Mind)', titleHi: 'जन्म नक्षत्र (शरीर व मन)', offset: 1 },
    { key: 'karma', titleEn: 'Karma Nakshatra (Career & Status)', titleHi: 'कर्म नक्षत्र (कार्य व प्रतिष्ठा)', offset: 10 },
    { key: 'sanghatika', titleEn: 'Sanghatika Nakshatra (Alliances/Ties)', titleHi: 'सांघातिक नक्षत्र (संबंध व सहयोग)', offset: 16 },
    { key: 'samudayika', titleEn: 'Samudayika Nakshatra (Collective Fortune)', titleHi: 'सामुदायिक नक्षत्र (समग्र भाग्य)', offset: 18 },
    { key: 'adhana', titleEn: 'Adhana / Upachaya (Origins & Sustenance)', titleHi: 'आधान नक्षत्र (उत्पत्ति व संबल)', offset: 19 },
    { key: 'vainashika', titleEn: 'Vainashika (Destruction / Vulnerability)', titleHi: 'वैनाशिक नक्षत्र (हानि व बाधा)', offset: 23 },
    { key: 'jati', titleEn: 'Jati Nakshatra (Lineage & Community)', titleHi: 'जाति नक्षत्र (कुल व समाज)', offset: 26 },
    { key: 'desha', titleEn: 'Desha Nakshatra (Homeland & Settlement)', titleHi: 'देश नक्षत्र (स्थान व निवास)', offset: 27 },
    { key: 'abhisheka', titleEn: 'Abhisheka (Coronation & Peak Honor)', titleHi: 'अभिषेक नक्षत्र (सम्मान व उत्थान)', offset: 28 },
  ];

  let totalMaleficVedha = 0;
  let totalBeneficVedha = 0;

  const specialPoints: SpecialNakshatraPoint[] = SPECIAL_OFFSETS.map((sp) => {
    const targetIdx27 = (janmaNakIdx + sp.offset - 1) % 27;
    const nakName = NAKSHATRAS[targetIdx27].name;

    const occupants: ChakraBodyId[] = chart.planets
      .filter((p) => p.nakshatraIndex === targetIdx27)
      .map((p) => p.id);

    const vedhaBy: SpecialNakshatraPoint['vedhaBy'] = [];
    chart.planets.forEach((p) => {
      const diff = Math.abs(p.nakshatraIndex - targetIdx27);
      const isMalefic = NATURAL_MALEFICS.has(p.id);

      if (diff === 14 || diff === 13) {
        vedhaBy.push({ planet: p.id, type: 'direct', isMalefic });
        if (isMalefic) totalMaleficVedha++;
        else totalBeneficVedha++;
      } else if (diff === 7 || diff === 20) {
        vedhaBy.push({ planet: p.id, type: diff === 7 ? 'right' : 'left', isMalefic });
        if (isMalefic) totalMaleficVedha++;
        else totalBeneficVedha++;
      }
    });

    const malCount = vedhaBy.filter((v) => v.isMalefic).length;
    const benCount = vedhaBy.filter((v) => !v.isMalefic).length;

    let verdictEn = 'Calm & undisturbed';
    let verdictHi = 'शांत व सुगम';
    if (malCount > 0 && benCount > 0) {
      verdictEn = `Mixed influences (${malCount} malefic vedha, ${benCount} benefic)`;
      verdictHi = `मिश्रित प्रभाव (${malCount} पाप वेध, ${benCount} शुभ वेध)`;
    } else if (malCount > 0) {
      verdictEn = `Afflicted by ${malCount} malefic vedha(s)`;
      verdictHi = `${malCount} पाप वेधों द्वारा पीड़ित`;
    } else if (benCount > 0) {
      verdictEn = `Auspiciously energized by ${benCount} benefic vedha(s)`;
      verdictHi = `${benCount} शुभ ग्रहों द्वारा वेधित व रक्षित`;
    }

    return {
      key: sp.key,
      titleEn: sp.titleEn,
      titleHi: sp.titleHi,
      offsetFromJanma: sp.offset,
      nakshatraIndex27: targetIdx27,
      nakshatraName: nakName,
      occupants,
      vedhaBy,
      verdictEn,
      verdictHi,
    };
  });

  const summaryEn =
    totalMaleficVedha === 0
      ? 'Sarvatobhadra Chakra shows complete protection; no sensitive nakshatra points suffer direct malefic cross-vedha.'
      : `Sensitive points experience ${totalMaleficVedha} malefic vedhas counter-balanced by ${totalBeneficVedha} benefic vedhas.`;
  const summaryHi =
    totalMaleficVedha === 0
      ? 'सर्वतोभद्र चक्र में संपूर्ण सुरक्षा परिलक्षित है; किसी भी संवेदनशील बिंदु पर पाप वेध नहीं है।'
      : `संवेदनशील बिंदुओं पर ${totalMaleficVedha} पाप वेध सक्रिय हैं, जिन्हें ${totalBeneficVedha} शुभ वेध संतुलित कर रहे हैं।`;

  return {
    janmaNakshatra: janmaName,
    specialPoints,
    maleficVedhaCount: totalMaleficVedha,
    beneficVedhaCount: totalBeneficVedha,
    summaryEn,
    summaryHi,
  };
}

export function computeKotaChakra(chart: ChartData): KotaChakraData {
  const moon = chart.planets.find((p) => p.id === 'Moon');
  const moonSignIdx = moon ? moon.signIndex : 0;
  const janmaNakIdx = moon ? moon.nakshatraIndex : 0;

  // Kota Swami: Lord of Janma Rasi
  const kotaSwami: ChakraBodyId = SIGNS[moonSignIdx].lord;

  // Kota Pala: Lord of the Nakshatra
  const kotaPala: ChakraBodyId = NAKSHATRAS[janmaNakIdx].lord;

  const stambhaIndices = [0, 7, 14, 21].map((o) => (janmaNakIdx + o) % 27);
  const madhyaIndices = [1, 8, 15, 22].map((o) => (janmaNakIdx + o) % 27);
  const kantakaIndices = [2, 6, 9, 13, 16, 20, 23, 26].map((o) => (janmaNakIdx + o) % 27);
  const allUsed = new Set([...stambhaIndices, ...madhyaIndices, ...kantakaIndices]);
  const bahyaIndices: number[] = [];
  for (let i = 0; i < 27; i++) {
    if (!allUsed.has(i)) bahyaIndices.push(i);
  }

  const stambhaNakshatras = stambhaIndices.map((i) => NAKSHATRAS[i].name);
  const madhyaNakshatras = madhyaIndices.map((i) => NAKSHATRAS[i].name);
  const kantakaNakshatras = kantakaIndices.map((i) => NAKSHATRAS[i].name);
  const bahyaNakshatras = bahyaIndices.map((i) => NAKSHATRAS[i].name);

  let siegeRisk = 15;

  const placements: KotaPlanetPlacement[] = chart.planets.map((p) => {
    const isMal = NATURAL_MALEFICS.has(p.id);
    let zone: KotaZone = 'bahya';
    if (stambhaIndices.includes(p.nakshatraIndex)) zone = 'stambha';
    else if (madhyaIndices.includes(p.nakshatraIndex)) zone = 'madhya';
    else if (kantakaIndices.includes(p.nakshatraIndex)) zone = 'kantaka';

    const direction: 'inward' | 'outward' = p.isRetrograde ? 'outward' : 'inward';

    if (zone === 'stambha' && isMal) siegeRisk += 25;
    else if (zone === 'madhya' && isMal) siegeRisk += 15;
    else if (zone === 'stambha' && !isMal) siegeRisk -= 10;
    else if (zone === 'bahya' && isMal) siegeRisk -= 5;

    return {
      planet: p.id,
      zone,
      nakshatra: NAKSHATRAS[p.nakshatraIndex].name,
      isMalefic: isMal,
      direction,
    };
  });

  siegeRisk = Math.max(5, Math.min(95, siegeRisk));

  const defenseStrengthEn =
    siegeRisk < 35
      ? 'Impregnable (Kota Swami & Palas secure the core pillar)'
      : siegeRisk < 65
      ? 'Guarded with dynamic challenges (Outer ramparts breached, core safe)'
      : 'Vulnerable Fortress (Malefics breach inner Stambha/Madhya walls)';
  const defenseStrengthHi =
    siegeRisk < 35
      ? 'अभेद्य दुर्ग (कोट स्वामी व पाल द्वारा स्तंभ पूर्ण सुरक्षित)'
      : siegeRisk < 65
      ? 'मध्यम सुरक्षित (बाह्य परकोटे पर दबाव, केंद्रीय स्तंभ स्थिर)'
      : 'अति-संवेदनशील दुर्ग (पाप ग्रहों द्वारा भीतरी प्राचीर व स्तंभ वेध)';

  const analysisEn = `Kota Swami (${kotaSwami}) holds fundamental territorial sovereignty. Kota Pala (${kotaPala}) patrols defenses. With siege risk index at ${siegeRisk}%, the native experiences ${defenseStrengthEn}.`;
  const analysisHi = `कोट स्वामी (${kotaSwami}) दुर्ग के मुख्य अधिपति हैं तथा कोट पाल (${kotaPala}) रक्षक हैं। दुर्ग संवेदनशीलता सूचकांक ${siegeRisk}% है — ${defenseStrengthHi}।`;

  return {
    kotaSwami,
    kotaPala,
    stambhaNakshatras,
    madhyaNakshatras,
    kantakaNakshatras,
    bahyaNakshatras,
    placements,
    defenseStrengthEn,
    defenseStrengthHi,
    siegeRiskScore: siegeRisk,
    analysisEn,
    analysisHi,
  };
}

export function computeKurmaChakra(chart: ChartData): KurmaChakraData {
  const ZONE_DEFS: Array<{
    direction: KurmaDirection;
    titleEn: string;
    titleHi: string;
    indices: number[];
  }> = [
    { direction: 'center', titleEn: 'Center (Nabhi / Heart)', titleHi: 'केंद्र (नाभि / हृदय)', indices: [11, 12, 13] },
    { direction: 'east', titleEn: 'East (Mukha / Face)', titleHi: 'पूर्व (मुख / प्रवेश)', indices: [14, 15, 16] },
    { direction: 'south_east', titleEn: 'South-East (Agneya / Right Front)', titleHi: 'दक्षिण-पूर्व (आग्नेय)', indices: [17, 18, 19] },
    { direction: 'south', titleEn: 'South (Dakshina / Right Flank)', titleHi: 'दक्षिण (दायाँ पार्श्व)', indices: [20, 21, 22] },
    { direction: 'south_west', titleEn: 'South-West (Nairritya / Right Hind)', titleHi: 'दक्षिण-पश्चिम (नैऋत्य)', indices: [23, 24, 25] },
    { direction: 'west', titleEn: 'West (Puchha / Tail)', titleHi: 'पश्चिम (पुच्छ / समाप्ति)', indices: [26, 0, 1] },
    { direction: 'north_west', titleEn: 'North-West (Vayavya / Left Hind)', titleHi: 'उत्तर-पश्चिम (वायव्य)', indices: [2, 3, 4] },
    { direction: 'north', titleEn: 'North (Uttara / Left Flank)', titleHi: 'उत्तर (बायाँ पार्श्व)', indices: [5, 6, 7] },
    { direction: 'north_east', titleEn: 'North-East (Ishanya / Left Front)', titleHi: 'उत्तर-पूर्व (ईशान)', indices: [8, 9, 10] },
  ];

  const afflictedEn: string[] = [];
  const afflictedHi: string[] = [];
  const safeEn: string[] = [];
  const safeHi: string[] = [];

  const zones: KurmaDirectionZone[] = ZONE_DEFS.map((zd) => {
    const nakNames = zd.indices.map((i) => NAKSHATRAS[i].name);
    const occupants: ChakraBodyId[] = chart.planets
      .filter((p) => zd.indices.includes(p.nakshatraIndex))
      .map((p) => p.id);

    const malScore = occupants.filter((p) => NATURAL_MALEFICS.has(p as string)).length;
    const benScore = occupants.filter((p) => !NATURAL_MALEFICS.has(p as string)).length;

    let statusEn = 'Balanced';
    let statusHi = 'संतुलित';
    if (malScore > benScore) {
      statusEn = `Afflicted by ${occupants.filter((p) => NATURAL_MALEFICS.has(p as string)).join(', ')}`;
      statusHi = `पाप प्रभाव: ${occupants.filter((p) => NATURAL_MALEFICS.has(p as string)).join(', ')}`;
      afflictedEn.push(`${zd.titleEn} (${statusEn})`);
      afflictedHi.push(`${zd.titleHi} (${statusHi})`);
    } else if (benScore > 0) {
      statusEn = `Protected by ${occupants.filter((p) => !NATURAL_MALEFICS.has(p as string)).join(', ')}`;
      statusHi = `शुभ रक्षित: ${occupants.filter((p) => !NATURAL_MALEFICS.has(p as string)).join(', ')}`;
      safeEn.push(`${zd.titleEn}`);
      safeHi.push(`${zd.titleHi}`);
    } else {
      safeEn.push(`${zd.titleEn}`);
      safeHi.push(`${zd.titleHi}`);
    }

    return {
      direction: zd.direction,
      titleEn: zd.titleEn,
      titleHi: zd.titleHi,
      nakshatras: nakNames,
      occupants,
      maleficScore: malScore,
      beneficScore: benScore,
      statusEn,
      statusHi,
    };
  });

  const guidanceEn =
    afflictedEn.length === 0
      ? 'All territorial directional vectors in Kurma Chakra enjoy auspicious balance.'
      : `Exercise caution during travel, property acquisition, or investments directed towards: ${afflictedEn.join('; ')}. Auspicious directions: ${safeEn.slice(0, 3).join(', ')}.`;
  const guidanceHi =
    afflictedHi.length === 0
      ? 'कूर्म चक्र के सभी नौ दिशा-क्षेत्र शुभ संतुलन में हैं।'
      : `यात्रा, भूमि क्रय या आवास में इन दिशाओं में विशेष सावधानी रखें: ${afflictedHi.join('; ')}। अत्यधिक शुभ दिशाएं: ${safeHi.slice(0, 3).join(', ')}।`;

  return {
    zones,
    afflictedDirectionsEn: afflictedEn,
    afflictedDirectionsHi: afflictedHi,
    safeDirectionsEn: safeEn,
    safeDirectionsHi: safeHi,
    guidanceEn,
    guidanceHi,
  };
}
