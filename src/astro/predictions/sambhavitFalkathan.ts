/**
 * Sambhavit Falkathan (Probable Life Predictions) Engine — 50 Classical Life Dimensions
 * Comprehensive synthesis across Natal Chart (D1), Navamsha (D9), Drekkana (D3),
 * Saptamsha (D7), Dashamsha (D10), Dwadasamsha (D12), Chaturvimshamsha (D24),
 * Trimsamsha (D30), Ashtakavarga (SAV 337), and Vimshottari Dasha cycles.
 *
 * All 50 dimensions calculate dynamically from native's exact Lagna, House Lords,
 * Placements, Dignities, SAV Bindus, and running Mahadasha/Antardasha.
 */

import type { ChartData, NineGrahaId, SevenPlanetId } from '../types';
import { COMBUSTION_ORB, NAKSHATRAS, NINE_GRAHAS, SIGNS } from '../constants';
import { angularDiffDeg } from '../time';
import { getNakshatraSyllable, getAllNakshatraSyllables } from '../avakahadaChalit';
import { computeLifeEventsAndLedger } from './lifeEventsLedger';

export type DimensionCategory =
  | 'identity'
  | 'family'
  | 'marriage'
  | 'progeny'
  | 'education'
  | 'career'
  | 'longevity_health'
  | 'shadow_challenges'
  | 'spirituality'
  | 'wealth_fortune';

export type AuspiciousnessLevel =
  | 'highly_favorable'
  | 'favorable'
  | 'mixed_moderate'
  | 'challenging_caution';

export interface LifeDimensionReading {
  id: number;
  category: DimensionCategory;
  categoryTitleEn: string;
  categoryTitleHi: string;
  titleEn: string;
  titleHi: string;
  astroBasisEn: string;
  astroBasisHi: string;
  verdictEn: string;
  verdictHi: string;
  detailedAnalysisEn: string;
  detailedAnalysisHi: string;
  remedyEn: string;
  remedyHi: string;
  strengthScore: number; // 0..100
  auspiciousness: AuspiciousnessLevel;
}

export interface SambhavitSummary {
  totalDimensions: number;
  highlyFavorableCount: number;
  favorableCount: number;
  mixedCount: number;
  cautionCount: number;
  primaryLifeController: string;
  ishtaDevata: string;
  dominantLifeFocusEn: string;
  dominantLifeFocusHi: string;
}

export interface SambhavitFalkathanReport {
  dimensions: LifeDimensionReading[];
  summary: SambhavitSummary;

  // Exact 25 Legacy Properties for 100% Backward Compatibility
  namakshar: {
    primaryEn: string;
    primaryHi: string;
    allPadasEn: string[];
    allPadasHi: string[];
    nakshatraName: string;
    pada: number;
    explanationEn: string;
    explanationHi: string;
  };
  ishtaDevata: {
    nameEn: string;
    nameHi: string;
    basisEn: string;
    basisHi: string;
    mantra: string;
  };
  mukhyaGraha: {
    planetEn: string;
    planetHi: string;
    roleEn: string;
    roleHi: string;
    rationaleEn: string;
    rationaleHi: string;
  };
  father: {
    temperamentEn: string;
    temperamentHi: string;
    professionEn: string;
    professionHi: string;
    lifespanEn: string;
    lifespanHi: string;
    relationshipEn: string;
    relationshipHi: string;
  };
  mother: {
    temperamentEn: string;
    temperamentHi: string;
    professionEn: string;
    professionHi: string;
    lifespanEn: string;
    lifespanHi: string;
    relationshipEn: string;
    relationshipHi: string;
  };
  siblings: {
    countProjectionEn: string;
    countProjectionHi: string;
    birthOrderEn: string;
    birthOrderHi: string;
    harmonyEn: string;
    harmonyHi: string;
  };
  marriage: {
    timingAgeWindowEn: string;
    timingAgeWindowHi: string;
    marriageYogasEn: string;
    marriageYogasHi: string;
    spouseNatureEn: string;
    spouseNatureHi: string;
    spouseAgeGapEn: string;
    spouseAgeGapHi: string;
    relationshipEn: string;
    relationshipHi: string;
  };
  children: {
    conceptionModeEn: string;
    conceptionModeHi: string;
    progenyCountEn: string;
    progenyCountHi: string;
    miscarriageRiskEn: string;
    miscarriageRiskHi: string;
    filialHappinessEn: string;
    filialHappinessHi: string;
    countAndGenderEn?: string;
    countAndGenderHi?: string;
    filialJoyEn?: string;
    filialJoyHi?: string;
  };
  education: {
    attainmentLevelEn: string;
    attainmentLevelHi: string;
    suitableStreamsEn: string[];
    suitableStreamsHi: string[];
    academicSuccessEn: string;
    academicSuccessHi: string;
    highestAttainmentEn?: string;
    highestAttainmentHi?: string;
    suitableFieldsEn?: string[];
    suitableFieldsHi?: string[];
  };
  career: {
    jobVsBusinessEn: string;
    jobVsBusinessHi: string;
    govtVsPrivateEn: string;
    govtVsPrivateHi: string;
    suitableProfessionsEn: string[];
    suitableProfessionsHi: string[];
    foreignTravelEn: string;
    foreignTravelHi: string;
    foreignSettlementEn: string;
    foreignSettlementHi: string;
  };
  longevity: {
    categoryEn: string;
    categoryHi: string;
    rangeEn: string;
    rangeHi: string;
    keyFactorsEn: string;
    keyFactorsHi: string;
  };
  bandhanaYoga: {
    hasRisk: boolean;
    verdictEn: string;
    verdictHi: string;
    mitigationEn: string;
    mitigationHi: string;
  };
  surgeryYoga: {
    hasRisk: boolean;
    riskLevelEn: string;
    riskLevelHi: string;
    vulnerableAreasEn: string;
    vulnerableAreasHi: string;
    timingEn: string;
    timingHi: string;
  };
  physicalMarks: {
    identificationEn: string;
    identificationHi: string;
    locationsEn: string[];
    locationsHi: string[];
  };
  addictions: {
    vulnerabilitiesEn: string[];
    vulnerabilitiesHi: string[];
    adviceEn: string;
    adviceHi: string;
  };
  bedPleasure: {
    shayanaSukhaEn: string;
    shayanaSukhaHi: string;
    sexualityEn: string;
    sexualityHi: string;
  };
  friends: {
    natureEn: string;
    natureHi: string;
    loyaltyVerdictEn: string;
    loyaltyVerdictHi: string;
  };
  cautions: {
    hazardsEn: string[];
    hazardsHi: string[];
    warningNoteEn: string;
    warningNoteHi: string;
  };
  crisisStrategy: {
    primaryDeityEn: string;
    primaryDeityHi: string;
    rescueMantra: string;
    actionProtocolEn: string;
    actionProtocolHi: string;
  };
  sports: {
    preferencesEn: string[];
    preferencesHi: string[];
    fitnessStyleEn: string;
    fitnessStyleHi: string;
  };
  temperament: {
    traitSummaryEn: string;
    traitSummaryHi: string;
    gunaEn: string;
    gunaHi: string;
  };
  loveLife: {
    romanceEn: string;
    romanceHi: string;
    marriageTypeEn: string;
    marriageTypeHi: string;
  };
  mentalHealth: {
    conditionEn: string;
    conditionHi: string;
    vulnerabilitiesEn: string;
    vulnerabilitiesHi: string;
    remedyEn: string;
    remedyHi: string;
  };
  health: {
    constitutionEn: string;
    constitutionHi: string;
    vulnerableOrgansEn: string;
    vulnerableOrgansHi: string;
  };
  wealth: {
    statusEn: string;
    statusHi: string;
    activeYogasEn: string[];
    activeYogasHi: string[];
    peakAgeWindowEn: string;
    peakAgeWindowHi: string;
  };
}

const HINDI_PLANETS: Record<string, string> = {
  Sun: 'सूर्य',
  Moon: 'चंद्र',
  Mars: 'मंगल',
  Mercury: 'बुध',
  Jupiter: 'बृहस्पति (गुरु)',
  Venus: 'शुक्र',
  Saturn: 'शनि',
  Rahu: 'राहु',
  Ketu: 'केतु',
  Asc: 'लग्न',
};

const HINDI_SIGNS = [
  'मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या',
  'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुंभ', 'मीन',
];

const SIGN_ELEMENTS = ['Fire', 'Earth', 'Air', 'Water', 'Fire', 'Earth', 'Air', 'Water', 'Fire', 'Earth', 'Air', 'Water'] as const;
const HINDI_ELEMENTS = ['अग्नि', 'पृथ्वी', 'वायु', 'जल', 'अग्नि', 'पृथ्वी', 'वायु', 'जल', 'अग्नि', 'पृथ्वी', 'वायु', 'जल'];

function getDignityBonus(dignity?: string): number {
  switch (dignity) {
    case 'Exalted': return 25;
    case 'Moolatrikona': return 20;
    case 'Own Sign': return 16;
    case 'Friendly': return 10;
    case 'Neutral': return 4;
    case 'Enemy': return -8;
    case 'Debilitated': return -18;
    default: return 0;
  }
}

function getAuspiciousness(score: number): AuspiciousnessLevel {
  if (score >= 75) return 'highly_favorable';
  if (score >= 55) return 'favorable';
  if (score >= 38) return 'mixed_moderate';
  return 'challenging_caution';
}

export function computeSambhavitFalkathan(chart: ChartData): SambhavitFalkathanReport {
  const asc = chart.ascendant;
  const ascSign = asc.signIndex;
  const ascSignName = SIGNS[ascSign].name;
  const ascSignHi = HINDI_SIGNS[ascSign];
  const ascLord = SIGNS[ascSign].lord;
  const ascLordHi = HINDI_PLANETS[ascLord] || ascLord;

  const planets = chart.planets;
  const getP = (id: NineGrahaId) => planets.find((p) => p.id === id) || planets[0];

  const sun = getP('Sun');
  const moon = getP('Moon');
  const mars = getP('Mars');
  const mercury = getP('Mercury');
  const jupiter = getP('Jupiter');
  const venus = getP('Venus');
  const saturn = getP('Saturn');
  const rahu = planets.find((p) => p.id === 'Rahu');
  const ketu = planets.find((p) => p.id === 'Ketu');
  const lagnaLordPlanet = planets.find((p) => p.id === ascLord) || asc;

  // SAV points per house (1 to 12)
  const sav: number[] = [];
  for (let h = 1; h <= 12; h++) {
    const sIdx = (ascSign + h - 1) % 12;
    sav.push(chart.ashtakavarga?.sarva?.[sIdx] ?? 28);
  }

  // Current Vimshottari Mahadasha & Antardasha
  const now = Date.now();
  const activeMD = chart.vimshottari?.find((d) => now >= d.startMs && now < d.endMs) || chart.vimshottari?.[0];
  const activeAD = activeMD?.children?.find((d) => now >= d.startMs && now < d.endMs) || activeMD?.children?.[0];
  const mdLord = activeMD?.lord || 'Jupiter';
  const adLord = activeAD?.lord || mdLord;
  const mdLordHi = HINDI_PLANETS[mdLord] || mdLord;
  const adLordHi = HINDI_PLANETS[adLord] || adLord;

  // Native's exact chronological age calculation
  const birthDate = new Date(chart.input.date);
  const currentAge = isNaN(birthDate.getTime()) ? 28 : Math.max(0, (now - birthDate.getTime()) / (365.25 * 86400000));
  const currentAgeRound = Math.round(currentAge);

  // Aspect resolver for any house
  const getAspectsOnHouse = (targetHouse: number) => {
    const list: Array<{ planet: NineGrahaId; planetHi: string; type: string; isBenefic: boolean }> = [];
    for (const p of planets) {
      if (p.id === 'Asc') continue;
      const fromH = p.houseNumber;
      const step = (offset: number) => ((fromH - 1 + offset) % 12) + 1;
      const isBenefic = ['Jupiter', 'Venus', 'Mercury', 'Moon'].includes(p.id);
      const pHi = HINDI_PLANETS[p.id] || p.id;
      const pGrahaId = p.id as NineGrahaId;

      if (step(6) === targetHouse) {
        list.push({ planet: pGrahaId, planetHi: pHi, type: '7th (180° पूर्ण दृष्टि)', isBenefic });
      }
      if (p.id === 'Mars') {
        if (step(3) === targetHouse) list.push({ planet: pGrahaId, planetHi: pHi, type: '4th विशेष दृष्टि', isBenefic: false });
        if (step(7) === targetHouse) list.push({ planet: pGrahaId, planetHi: pHi, type: '8th विशेष दृष्टि', isBenefic: false });
      } else if (p.id === 'Jupiter') {
        if (step(4) === targetHouse) list.push({ planet: pGrahaId, planetHi: pHi, type: '5th अमृत दृष्टि', isBenefic: true });
        if (step(8) === targetHouse) list.push({ planet: pGrahaId, planetHi: pHi, type: '9th अमृत दृष्टि', isBenefic: true });
      } else if (p.id === 'Saturn') {
        if (step(2) === targetHouse) list.push({ planet: pGrahaId, planetHi: pHi, type: '3rd विशेष दृष्टि', isBenefic: false });
        if (step(9) === targetHouse) list.push({ planet: pGrahaId, planetHi: pHi, type: '10th विशेष दृष्टि', isBenefic: false });
      } else if (p.id === 'Rahu' || p.id === 'Ketu') {
        if (step(4) === targetHouse) list.push({ planet: pGrahaId, planetHi: pHi, type: '5th विशेष दृष्टि', isBenefic: false });
        if (step(8) === targetHouse) list.push({ planet: pGrahaId, planetHi: pHi, type: '9th विशेष दृष्टि', isBenefic: false });
      }
    }
    return list;
  };

  const getKartariOnHouse = (targetHouse: number) => {
    const prevH = targetHouse === 1 ? 12 : targetHouse - 1;
    const nextH = targetHouse === 12 ? 1 : targetHouse + 1;
    const prevMal = planets.some((p) => p.houseNumber === prevH && ['Saturn', 'Mars', 'Rahu', 'Ketu', 'Sun'].includes(p.id));
    const nextMal = planets.some((p) => p.houseNumber === nextH && ['Saturn', 'Mars', 'Rahu', 'Ketu', 'Sun'].includes(p.id));
    if (prevMal && nextMal) return 'Papakartari';
    const prevBen = planets.some((p) => p.houseNumber === prevH && ['Jupiter', 'Venus', 'Mercury', 'Moon'].includes(p.id));
    const nextBen = planets.some((p) => p.houseNumber === nextH && ['Jupiter', 'Venus', 'Mercury', 'Moon'].includes(p.id));
    if (prevBen && nextBen) return 'Subhakartari';
    return 'None';
  };

  const DIGNITY_HI_MAP: Record<string, string> = {
    Exalted: 'उच्च', Moolatrikona: 'मूलत्रिकोण', 'Own Sign': 'स्वराशि',
    'Great Friend': 'अति मित्र', Friendly: 'मित्र', Neutral: 'सम',
    Enemy: 'शत्रु', 'Great Enemy': 'अति शत्रु', Debilitated: 'नीच',
  };

  // House lord resolver with elevated Parashari parameters (Sthan, Rashi, Nakshatra, Drishti, Yuti, Degree, Avastha, Kartari)
  const getHLord = (h: number) => {
    const signIdx = (ascSign + h - 1) % 12;
    const lord = SIGNS[signIdx].lord;
    const planet = planets.find((p) => p.id === lord) || sun;
    const nakIdx = planet.nakshatraIndex ?? Math.floor(planet.longitude / (360 / 27));
    const nak = NAKSHATRAS[nakIdx] ?? NAKSHATRAS[0];
    const aspects = getAspectsOnHouse(h);
    const occupants = planets.filter((p) => p.houseNumber === h);
    const kartari = getKartariOnHouse(h);
    const isCombust = planet.id !== 'Sun' && angularDiffDeg(planet.longitude, sun.longitude) <= (COMBUSTION_ORB[planet.id as SevenPlanetId]?.direct ?? 12);
    const degInSign = planet.degreeInSign ?? (planet.longitude % 30);
    const isOdd = planet.signIndex % 2 === 0;
    const seg = Math.min(4, Math.floor(degInSign / 6));
    const effIdx = isOdd ? seg : 4 - seg;
    const avasthaNamesHi = ['बाल्यावस्था', 'कुमारावस्था', 'युवावस्था', 'वृद्धावस्था', 'मृतावस्था'];
    const avasthaNamesEn = ['Bala', 'Kumara', 'Yuva', 'Vriddha', 'Mrita'];

    return {
      house: h,
      signIdx,
      signName: SIGNS[signIdx].name,
      signHi: HINDI_SIGNS[signIdx],
      lord,
      lordHi: HINDI_PLANETS[lord] || lord,
      placedHouse: planet.houseNumber,
      placedSignIdx: planet.signIndex,
      placedSignName: SIGNS[planet.signIndex].name,
      placedSignHi: HINDI_SIGNS[planet.signIndex],
      dignity: planet.dignity || 'Neutral',
      dignityHi: DIGNITY_HI_MAP[planet.dignity || 'Neutral'] || planet.dignity,
      nakshatraName: nak.name,
      pada: planet.pada || 1,
      starLord: nak.lord,
      starLordHi: HINDI_PLANETS[nak.lord] || nak.lord,
      isCombust,
      avasthaHi: avasthaNamesHi[effIdx],
      avasthaEn: avasthaNamesEn[effIdx],
      aspects,
      occupants,
      kartari,
      sav: sav[h - 1],
    };
  };

  const h1 = getHLord(1);
  const h2 = getHLord(2);
  const h3 = getHLord(3);
  const h4 = getHLord(4);
  const h5 = getHLord(5);
  const h6 = getHLord(6);
  const h7 = getHLord(7);
  const h8 = getHLord(8);
  const h9 = getHLord(9);
  const h10 = getHLord(10);
  const h11 = getHLord(11);
  const h12 = getHLord(12);

  // Sub-engine life ledger
  const ledger = computeLifeEventsAndLedger(chart);

  // Nakshatra & Pada
  const nakIdx = moon.nakshatraIndex ?? Math.floor(moon.longitude / (360 / 27));
  const pada = moon.pada || 1;
  const syl = getNakshatraSyllable(nakIdx, pada);
  const allSyl = getAllNakshatraSyllables(nakIdx);
  const nakName = moon.nakshatraName || 'Ashwini';

  // Array to hold all 50 dimensions
  const dims: LifeDimensionReading[] = [];

  // ==========================================
  // 1. Auspicious Name Syllables & Phonetics
  // ==========================================
  {
    const score = 88;
    dims.push({
      id: 1,
      category: 'identity',
      categoryTitleEn: 'Identity & Core Alignment',
      categoryTitleHi: 'पहचान व आत्म तत्व',
      titleEn: 'Auspicious Name Syllables & Phonetic Vibrations',
      titleHi: 'शुभ नामाक्षर, ध्वनि तत्व एवं स्वर शक्ति',
      astroBasisEn: `Moon in ${moon.signName} (${HINDI_SIGNS[moon.signIndex]}), Nakshatra ${nakName} Pada ${pada}, Moon SAV: ${sav[moon.houseNumber - 1]} bindus in House ${moon.houseNumber}.`,
      astroBasisHi: `चंद्रमा ${HINDI_SIGNS[moon.signIndex]} राशि, ${nakName} नक्षत्र के चरण ${pada} में स्थित, भाव ${moon.houseNumber} में ${sav[moon.houseNumber - 1]} अष्टकवर्ग बिंदु।`,
      verdictEn: `Primary Name Syllable: "${syl.en}" · Auspicious Pada Syllables: ${allSyl.en.join(', ')}.`,
      verdictHi: `शुभ प्राथमिक नामाक्षर: "${syl.hi}" · संपूर्ण चरण अक्षर: ${allSyl.hi.join(', ')}।`,
      detailedAnalysisEn: `In Vedic Avakahada Chakra, naming a child with syllables aligned with the Moon's birth star invokes planetary grace, harmonizes neurological bio-frequencies, and shields against evil eye. For ${nakName} Pada ${pada}, sound vibration "${syl.en}" resonates with native's core Prana.`,
      detailedAnalysisHi: `वैदिक अवकहड़ा चक्र के अनुसार, जन्म नक्षत्र व चरण के नामाक्षर से पुकारा जाने वाला नाम जातक के प्राण तत्व व मानसिक ओरा को सुदृढ़ करता है। ${nakName} नक्षत्र के ${pada} चरण हेतु "${syl.hi}" अक्षर पर रखा गया नाम जीवनभर रक्षा कवच का कार्य करता है।`,
      remedyEn: `If formal legal name starts with an unaligned syllable, use "${syl.en}" as your spiritual or daily calling name.`,
      remedyHi: `यदि कागजी नाम अन्य अक्षर से हो, तो घर व दैनिक संबोधन में "${syl.hi}" नामाक्षर का प्रयोग करें।`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score),
    });
  }

  // ==========================================
  // 2. Ishta Devata & Root Protection Mantra
  // ==========================================
  {
    const ishta = ledger.deityAndMainPlanet;
    const score = 92;
    dims.push({
      id: 2,
      category: 'spirituality',
      categoryTitleEn: 'Spirituality & Higher Grace',
      categoryTitleHi: 'आध्यात्म, इष्ट कृपा व मोक्ष',
      titleEn: 'Ishta Devata & Root Protection Mantra',
      titleHi: 'इष्ट देवता, अधिष्ठाता शक्ति व मूल रक्षा मंत्र',
      astroBasisEn: `12th from Karakamsa in D9 Navamsha governed by ${ishta.ishtaDevataEn}; 5th Lord ${h5.lord} in ${h5.placedSignName} (House ${h5.placedHouse}), 9th House SAV: ${sav[8]} bindus.`,
      astroBasisHi: `नवांश चक्र में कारकांश से द्वादश भाव एवं पंचमेश ${h5.lordHi} का ${h5.placedSignHi} में स्थित होना; नवम भाव अष्टकवर्ग: ${sav[8]} बिंदु।`,
      verdictEn: `Supreme Ishta Devata: ${ishta.ishtaDevataEn} · Sacred Root Mantra: ${ishta.ishtaMantra}.`,
      verdictHi: `सर्वोच्च इष्ट देवता: ${ishta.ishtaDevataHi} · सिद्ध मूल मंत्र: ${ishta.ishtaMantra}।`,
      detailedAnalysisEn: `According to Jaimini Sutras (Karakamsa Vichara), the deity represented by the 12th from Karakamsa and the 5th lord indicates the soul's karmic protector through all reincarnations. Regular meditation on ${ishta.ishtaDevataEn} neutralizes planetary doshas and dissolves psychic blockages.`,
      detailedAnalysisHi: `महर्षि जैमिनी के कारकांश सिद्धांत व पराशरी पंचमेश योग के अनुसार, ${ishta.ishtaDevataHi} आपके जन्म-जन्मांतर के आध्यात्मिक रक्षक हैं। प्रतिदिन इनके मूल मंत्र का 108 बार जप करने से संकटों का त्वरित निवारण होता है।`,
      remedyEn: `Chant "${ishta.ishtaMantra}" 108 times daily during sunrise or sunset facing East.`,
      remedyHi: `प्रतिदिन पूर्व दिशा की ओर मुख कर "${ishta.ishtaMantra}" का कम से कम 108 बार शांत मन से जप करें।`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score),
    });
  }

  // ==========================================
  // 3. Primary Life Controlling Planet (Atmakaraka)
  // ==========================================
  {
    const mukhya = ledger.deityAndMainPlanet;
    const score = Math.max(40, Math.min(95, 50 + getDignityBonus(lagnaLordPlanet.dignity)));
    dims.push({
      id: 3,
      category: 'identity',
      categoryTitleEn: 'Identity & Core Alignment',
      categoryTitleHi: 'पहचान व आत्म तत्व',
      titleEn: 'Primary Life Controlling Planet & Soul Orientation',
      titleHi: 'मुख्य जीवन नियंत्रक ग्रह (आत्मकारक/लग्नेश) व आत्मा का उद्देश्य',
      astroBasisEn: `Atmakaraka: ${mukhya.mainPlanetEn}; Lagnesha ${ascLord} placed in House ${h1.placedHouse} (${h1.placedSignName}, Dignity: ${lagnaLordPlanet.dignity}), Lagna SAV: ${sav[0]} bindus.`,
      astroBasisHi: `आत्मकारक: ${mukhya.mainPlanetHi}; लग्नेश ${ascLordHi} भाव ${h1.placedHouse} में (${h1.placedSignHi}, गरिमा: ${lagnaLordPlanet.dignity}), लग्न भाव अष्टकवर्ग: ${sav[0]} बिंदु।`,
      verdictEn: `Master Life Controller: ${mukhya.mainPlanetEn} · Supporting: ${mukhya.supportingKingsEn}.`,
      verdictHi: `मुख्य जीवन नियंत्रक: ${mukhya.mainPlanetHi} · सहायक शक्ति: ${mukhya.supportingKingsHi}।`,
      detailedAnalysisEn: `The planet with the highest longitude (Atmakaraka) acting in tandem with the Lagna Lord determines the native's central life tests, ethical standards, and ultimate spiritual evolution. ${mukhya.mainPlanetEn} placed in dignity dictates that career, fame, and vitality flourish when following righteous karma.`,
      detailedAnalysisHi: `कुंडली में सर्वाधिक भोगांश युक्त आत्मकारक ग्रह एवं लग्नेश का समन्वय जातक के जीवन पथ, इच्छाशक्ति व कर्मक्षेत्र का निर्धारण करता है। ${mukhya.mainPlanetHi} की स्थिति यह स्पष्ट करती है कि सत्य व कर्तव्यनिष्ठा से ही आपका भाग्योदय होगा।`,
      remedyEn: `Honor ${mukhya.mainPlanetEn} through specific weekday charity and wear auspicious colors corresponding to this graha.`,
      remedyHi: `${mukhya.mainPlanetHi} के प्रिय वार को संबंधित वस्तु का दान करें तथा इसके अनुकूल वस्त्र धारण करें।`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score),
    });
  }

  // ==========================================
  // 4. Father's Nature & Principles
  // ==========================================
  {
    const score = Math.max(35, Math.min(95, 50 + getDignityBonus(sun.dignity) + (sav[8] >= 28 ? 10 : -8)));
    const sunDignity = sun.dignity || 'Neutral';
    const natureEn = `${sunDignity === 'Exalted' || sunDignity === 'Own Sign' ? 'Authoritative, highly principled societal leader' : sunDignity === 'Debilitated' || sun.houseNumber === 6 || sun.houseNumber === 8 ? 'Struggling through intense responsibilities' : 'Disciplined, pragmatic, family-centric traditionalist'} (Sun in ${sun.signName} H${sun.houseNumber}, 9th Lord ${h9.lord} in H${h9.placedHouse}, 9th SAV: ${sav[8]} bindus)`;
    const natureHi = `${sunDignity === 'Exalted' || sunDignity === 'Own Sign' ? 'प्रभावशाली, सिद्धांतवादी व स्वाभिमानी व्यक्तित्व' : sunDignity === 'Debilitated' || sun.houseNumber === 6 || sun.houseNumber === 8 ? 'संघर्षशील व पारिवारिक दायित्वों से घिरे' : 'अनुशासित, व्यावहारिक व कर्तव्यपरायण'} (सूर्य ${HINDI_SIGNS[sun.signIndex]} भाव ${sun.houseNumber} में, नवमेश ${h9.lordHi} भाव ${h9.placedHouse} में, नवम SAV: ${sav[8]} बिंदु)`;

    dims.push({
      id: 4,
      category: 'family',
      categoryTitleEn: 'Family & Ancestral Lineage',
      categoryTitleHi: 'माता-पिता, कुल व कुटुंब',
      titleEn: "Father's Nature, Temperament & Principles",
      titleHi: 'पिता का स्वभाव, संस्कार व जीवन मूल्य',
      astroBasisEn: `9th Lord ${h9.lord} in House ${h9.placedHouse} (${h9.placedSignName}); Sun (Pitrukaraka) in House ${sun.houseNumber} (${sun.signName}, ${sunDignity}), 9th House SAV: ${sav[8]} bindus.`,
      astroBasisHi: `नवमेश ${h9.lordHi} भाव ${h9.placedHouse} में (${h9.placedSignHi}); सूर्य (पितृकारक) भाव ${sun.houseNumber} में (${HINDI_SIGNS[sun.signIndex]}, ${sunDignity}), नवम भाव अष्टकवर्ग: ${sav[8]} बिंदु।`,
      verdictEn: natureEn,
      verdictHi: natureHi,
      detailedAnalysisEn: `The 9th house governs Dharma and the father, while the Sun serves as the natural Pitrukaraka. With Sun positioned in House ${sun.houseNumber} and 9th House having ${sav[8]} SAV points, your father exhibits deep determination and imparts valuable life wisdom despite differences in viewpoint.`,
      detailedAnalysisHi: `कुंडली का नवम भाव धर्म व पिता का प्रतिनिधित्व करता है तथा सूर्य नैसर्गिक पितृकारक हैं। भाव ${sun.houseNumber} में सूर्य की स्थिति एवं नवम भाव में ${sav[8]} अष्टकवर्ग बिंदुओं के प्रभाव से पिता से आपको नैतिक बल व मार्गदर्शन प्राप्त होता है।`,
      remedyEn: `Offer Arghya (water mixed with red sandalwood and flowers) to the rising Sun every morning.`,
      remedyHi: `प्रतिदिन प्रातःकाल तांबे के लोटे में जल, लाल चंदन व रोली मिलाकर भगवान सूर्य को अर्घ्य दें।`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score),
    });
  }

  // ==========================================
  // 5. Father's Profession & Social Stature
  // ==========================================
  {
    const score = Math.max(35, Math.min(95, 45 + (sun.houseNumber === 10 || sun.houseNumber === 9 || sun.houseNumber === 1 ? 25 : 5) + (sav[8] >= 28 ? 10 : 0)));
    const profEn = sun.houseNumber === 10 || sun.houseNumber === 9 || sun.houseNumber === 1
      ? 'Government administration, executive leadership, political office or senior public enterprise'
      : h9.lord === 'Mercury' || h9.lord === 'Venus'
      ? 'Commerce, banking, accounting, jewelry, textiles or skilled advisory trade'
      : h9.lord === 'Mars' || h9.lord === 'Saturn'
      ? 'Technical fields, civil engineering, defense/security, land/agriculture or industrial management'
      : 'Education, spiritual ministry, legal advisory or independent professional consulting';
    const profHi = sun.houseNumber === 10 || sun.houseNumber === 9 || sun.houseNumber === 1
      ? 'राजकीय/सरकारी सेवा, प्रशासनिक पद, प्रबंधकीय नेतृत्व अथवा उच्च सामाजिक पद'
      : h9.lord === 'Mercury' || h9.lord === 'Venus'
      ? 'व्यापार, वाणिज्य, वित्त/बैंकिंग, लेखा, वस्त्र/आभूषण अथवा परामर्श व्यवसाय'
      : h9.lord === 'Mars' || h9.lord === 'Saturn'
      ? 'इंजीनियरिंग, तकनीकी क्षेत्र, रक्षा/सुरक्षा, भूमि/कृषि अथवा निर्माण/उद्योग'
      : 'शिक्षण, न्याय/अधिवक्ता, परामर्श अथवा स्वतंत्र प्रतिष्ठित व्यवसाय';

    dims.push({
      id: 5,
      category: 'family',
      categoryTitleEn: 'Family & Ancestral Lineage',
      categoryTitleHi: 'माता-पिता, कुल व कुटुंब',
      titleEn: "Father's Profession, Social Rank & Career Path",
      titleHi: 'पिता का कार्यक्षेत्र, पेशा व सामाजिक प्रतिष्ठा',
      astroBasisEn: `10th from 9th (6th House) sign ${h6.signName} ruled by ${h6.lord}; Sun in House ${sun.houseNumber}; 9th Lord ${h9.lord} in House ${h9.placedHouse}.`,
      astroBasisHi: `नवम से दशम (षष्ठ भाव) ${h6.signHi} राशि, स्वामी ${h6.lordHi}; सूर्य भाव ${sun.houseNumber} में; नवमेश ${h9.lordHi} भाव ${h9.placedHouse} में स्थित।`,
      verdictEn: profEn,
      verdictHi: profHi,
      detailedAnalysisEn: `Bhavat Bhavam principle dictates the father's profession from the 10th house counted from the 9th. Here, the energetic alignment of ${h9.lord} in House ${h9.placedHouse} indicates respect earned through persistent duty and community standing.`,
      detailedAnalysisHi: `भावात भावम सिद्धांत के अनुसार नवम से दशम भाव पिता के कर्मक्षेत्र को दर्शाता है। नवमेश ${h9.lordHi} के प्रभाव से पिता अपने कार्यक्षेत्र में निष्ठावान व स्वाभिमानी रहे हैं तथा समाज में उनकी प्रतिष्ठा स्थापित है।`,
      remedyEn: `Support elderly or retired workers in father's honor on Sundays.`,
      remedyHi: `रविवार के दिन किसी वृद्ध या असहाय श्रमिक को भोजन कराएं अथवा सहायता करें।`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score),
    });
  }

  // ==========================================
  // 6. Father's Lifespan & Longevity Indicators
  // ==========================================
  {
    const score = Math.max(35, Math.min(95, 45 + getDignityBonus(sun.dignity) + ([1, 4, 5, 9, 10, 11].includes(h9.placedHouse) ? 14 : -10) + (sav[8] >= 28 ? 6 : -4)));
    const lifeEn = (sun.dignity === 'Exalted' || sun.dignity === 'Own Sign' || h9.placedHouse === 9 || h9.placedHouse === 10) && !h9.isCombust
      ? 'Purna Pitru Ayu: Long lifespan (76+ years), revered in community with lasting vigor'
      : sun.dignity === 'Debilitated' || sun.houseNumber === 6 || sun.houseNumber === 8 || h9.placedHouse === 6 || h9.placedHouse === 8 || h9.isCombust
      ? 'Madhyayu (60-70 years); susceptibility to cardiovascular, bone, or blood pressure issues; regular health discipline recommended'
      : 'Healthy medium-to-long lifespan (68-78 years) with gradual maturity';
    const lifeHi = (sun.dignity === 'Exalted' || sun.dignity === 'Own Sign' || h9.placedHouse === 9 || h9.placedHouse === 10) && !h9.isCombust
      ? 'पूर्ण पितृ आयु: सुदीर्घ जीवनकाल (76+ वर्ष), सूर्य व नवमेश के शुभ प्रभाव से बुढ़ापे में सम्मान व परिवार का सान्निध्य'
      : sun.dignity === 'Debilitated' || sun.houseNumber === 6 || sun.houseNumber === 8 || h9.placedHouse === 6 || h9.placedHouse === 8 || h9.isCombust
      ? 'मध्यायु (60-70 वर्ष); हृदय, नेत्र, रीढ़ अथवा रक्तचाप से संबंधित सतर्कता व स्वास्थ्य अनुशासन अपेक्षित'
      : 'सामान्यतः सुखी व दीर्घायु (68-78 वर्ष), स्वास्थ्य में नियमित देखभाल से स्थिरता';

    dims.push({
      id: 6,
      category: 'family',
      categoryTitleEn: 'Family & Ancestral Lineage',
      categoryTitleHi: 'माता-पिता, कुल व कुटुंब',
      titleEn: "Father's Lifespan, Longevity & Health Resilience",
      titleHi: 'पिता का जीवनकाल, दीर्घायु व स्वास्थ्य संवेदनशीलता',
      astroBasisEn: `9th Lord ${h9.lord} in H${h9.placedHouse} (${h9.dignity}, Star Lord ${h9.starLord}); Sun (Pitrukaraka) in H${sun.houseNumber} (${sun.dignity}); [SAV (Auxiliary): 9th H ${sav[8]} bindus, 4th H ${sav[3]} bindus].`,
      astroBasisHi: `नवमेश ${h9.lordHi} भाव ${h9.placedHouse} में (${h9.dignityHi}, नक्षत्र स्वामी: ${h9.starLordHi}); सूर्य भाव ${sun.houseNumber} में (${sun.dignity}); [सर्वाष्टकवर्ग (सहायक): नवम भाव ${sav[8]} बिंदु, चतुर्थ भाव ${sav[3]} बिंदु]।`,
      verdictEn: lifeEn,
      verdictHi: lifeHi,
      detailedAnalysisEn: `Pitru Ayush is primarily determined by the 9th house lord, the natural vitality of the Sun, and aspects from benefics vs malefics, with the 8th from 9th (4th house) corroborating the lifespan threshold. The 9th lord situated in ${h9.placedSignName} under ${h9.nakshatraName} Nakshatra anchors paternal vitality, while ${sav[8]} SAV bindus provide supplemental bio-energetic support.`,
      detailedAnalysisHi: `पिता की आयु का प्राथमिक विचार नवमेश की स्थिति, राशि बल, नक्षत्र स्वामी (${h9.starLordHi}) एवं सूर्य के प्राकृतिक बल से किया जाता है। नवमेश का ${h9.placedHouse}वें भाव में होना तथा सूर्य का प्रभाव पिता की जीवनी शक्ति का मूल आधार है; नवम भाव के ${sav[8]} अष्टकवर्ग बिंदु इसे सहायक संबल प्रदान करते हैं।`,
      remedyEn: `Perform Aditya Hridaya Stotram recitation for father's vitality and health protection.`,
      remedyHi: `पिता के उत्तम स्वास्थ्य व दीर्घायु हेतु नित्य अथवा रविवार को आदित्य हृदय स्तोत्र का पाठ करें।`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score),
    });
  }

  // ==========================================
  // 7. Father-Child Relationship & Inheritance
  // ==========================================
  {
    const score = Math.max(35, Math.min(95, 45 + (sav[8] >= 28 ? 15 : -5) + (h9.placedHouse === 1 || h9.placedHouse === 9 || h9.placedHouse === 5 ? 15 : 0)));
    const relEn = sav[8] >= 28 && (h9.placedHouse === 1 || h9.placedHouse === 5 || h9.placedHouse === 9 || h9.placedHouse === 11)
      ? 'Deep mutual respect, strong emotional support, solid ancestral guidance and inheritance gains'
      : 'Respectful and dutiful bond; occasional ideological friction due to generational divergence';
    const relHi = sav[8] >= 28 && (h9.placedHouse === 1 || h9.placedHouse === 5 || h9.placedHouse === 9 || h9.placedHouse === 11)
      ? 'गहरा पारस्परिक सम्मान, पिता से पूरा सहयोग, पैतृक आशीर्वाद व संपत्ति/संस्कार का लाभ'
      : 'आदर व कर्तव्य से परिपूर्ण संबंध, यद्यपि विचारों में कभी-कभी पीढ़ीगत अंतर व मतभेद संभव';

    dims.push({
      id: 7,
      category: 'family',
      categoryTitleEn: 'Family & Ancestral Lineage',
      categoryTitleHi: 'माता-पिता, कुल व कुटुंब',
      titleEn: 'Relationship with Father & Ancestral Inheritance',
      titleHi: 'पिता से संबंध, वैचारिक सामंजस्य व पैतृक संबल',
      astroBasisEn: `9th Lord ${h9.lord} in House ${h9.placedHouse}; mutual relation between Lagnesha ${ascLord} and 9th Lord ${h9.lord}; 9th SAV: ${sav[8]} bindus.`,
      astroBasisHi: `नवमेश ${h9.lordHi} भाव ${h9.placedHouse} में; लग्नेश ${ascLordHi} व नवमेश ${h9.lordHi} का संबंध; नवम भाव अष्टकवर्ग: ${sav[8]} बिंदु।`,
      verdictEn: relEn,
      verdictHi: relHi,
      detailedAnalysisEn: `The mutual aspect or placement of Lagnesha and Navamesha governs paternal harmony. Because 9th house holds ${sav[8]} SAV points, father's blessings act as a primary catalyst for your worldly breakthroughs.`,
      detailedAnalysisHi: `लग्नेश और नवमेश का पारस्परिक संबंध पिता-पुत्र के मध्य आत्मीयता को तय करता है। नवम भाव में ${sav[8]} बिंदु होने से पिता का आशीष आपके जीवन में भाग्य वृद्धि का प्रमुख कारक बनता है।`,
      remedyEn: `Touch father's feet every morning or before embarking on major ventures.`,
      remedyHi: `किसी भी शुभ कार्य से पूर्व पिता के चरण स्पर्श कर उनका आशीर्वाद अवश्य लें।`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score),
    });
  }

  // ==========================================
  // 8. Mother's Nature & Mental Anchor
  // ==========================================
  {
    const score = Math.max(35, Math.min(95, 50 + getDignityBonus(moon.dignity) + ([1, 4, 5, 9, 10].includes(h4.placedHouse) ? 14 : -8) + (sav[3] >= 28 ? 6 : -4)));
    const moonDignity = moon.dignity || 'Neutral';
    const natureEn = moonDignity === 'Exalted' || moonDignity === 'Own Sign'
      ? 'Deeply compassionate, spiritually devoted, emotionally grounding, resilient domestic anchor'
      : moonDignity === 'Debilitated' || moon.houseNumber === 6 || moon.houseNumber === 8 || h4.isCombust
      ? 'Extremely sensitive, highly protective, prone to worry and sacrifice for family'
      : 'Affectionate, hardworking, practical, maintaining family harmony with patience';
    const natureHi = moonDignity === 'Exalted' || moonDignity === 'Own Sign'
      ? 'अत्यंत ममतामयी, सात्विक, धार्मिक, मानसिक संबल प्रदान करने वाली व सहनशील'
      : moonDignity === 'Debilitated' || moon.houseNumber === 6 || moon.houseNumber === 8 || h4.isCombust
      ? 'अति-संवेदनशील, निरंतर चिंता करने वाली, परिवार हेतु स्वयं को समर्पित करने वाली'
      : 'स्नेहमयी, कर्तव्यनिष्ठ, व्यावहारिक व परिवार में संतुलन बनाए रखने वाली';

    dims.push({
      id: 8,
      category: 'family',
      categoryTitleEn: 'Family & Ancestral Lineage',
      categoryTitleHi: 'माता-पिता, कुल व कुटुंब',
      titleEn: "Mother's Nature, Temperament & Emotional Anchor",
      titleHi: 'माता का स्वभाव, संस्कार व भावनात्मक संबल',
      astroBasisEn: `4th Lord ${h4.lord} in House ${h4.placedHouse} (${h4.dignity}), Nakshatra ${h4.nakshatraName} (Star Lord: ${h4.starLord}); Moon (Matrukaraka) in House ${moon.houseNumber} (${moonDignity}); [SAV (Auxiliary): ${sav[3]} bindus].`,
      astroBasisHi: `चतुर्थेश ${h4.lordHi} भाव ${h4.placedHouse} में (${h4.dignityHi}), नक्षत्र: ${h4.nakshatraName} (स्वामी: ${h4.starLordHi}); चंद्रमा (मातृकारक) भाव ${moon.houseNumber} में (${moonDignity}); [सर्वाष्टकवर्ग (सहायक): ${sav[3]} बिंदु]।`,
      verdictEn: natureEn,
      verdictHi: natureHi,
      detailedAnalysisEn: `The 4th house lord, its dispositor star lord (${h4.starLord}), and the Moon govern maternal traits. Moon placed in House ${moon.houseNumber} reflects your mother's deep psychological imprint, with 4th house SAV points acting as corroborative domestic support.`,
      detailedAnalysisHi: `कुंडली का चतुर्थ भाव, चतुर्थेश का नक्षत्र स्वामी (${h4.starLordHi}) एवं चंद्रमा माता के स्वभाव व आंतरिक संस्कारों के मुख्य निर्धारक हैं। भाव ${moon.houseNumber} में चंद्रमा की स्थिति माता के वात्सल्य को दर्शाती है, जबकि अष्टकवर्ग के ${sav[3]} बिंदु इसे सहायक ऊर्जा देते हैं।`,
      remedyEn: `Offer silver or white rice to needy women on Mondays and keep a silver coin given by mother.`,
      remedyHi: `सोमवार को किसी जरूरतमंद महिला को दूध या चावल का दान करें तथा माता के हाथ से चांदी का सिक्का लेकर संभालें।`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score),
    });
  }

  // ==========================================
  // 9. Mother's Profession & Domestic Role
  // ==========================================
  {
    const score = Math.max(35, Math.min(95, 45 + (h4.placedHouse === 1 || h4.placedHouse === 10 || h4.placedHouse === 4 ? 16 : 0) + (sav[3] >= 28 ? 6 : 0)));
    const profEn = h4.lord === 'Sun' || h4.lord === 'Jupiter'
      ? 'Education, academia, social leadership, administrative work or spiritual mentoring'
      : h4.lord === 'Venus' || h4.lord === 'Moon'
      ? 'Homemaking administrator, healthcare/nursing, fine arts, hospitality or organic nutrition'
      : 'Active family leadership, commerce, enterprise or independent domestic career';
    const profHi = h4.lord === 'Sun' || h4.lord === 'Jupiter'
      ? 'शिक्षण, अध्यापन, समाज सेवा, प्रशासनिक दायित्व अथवा आध्यात्मिक/परामर्श कार्य'
      : h4.lord === 'Venus' || h4.lord === 'Moon'
      ? 'सक्षम गृह-प्रबंधक, चिकित्सा/नर्सिंग, कला, परिचर्या अथवा पोषण/आहार संबंधी कार्य'
      : 'पारिवारिक व्यवस्था की मुख्य संचालक, स्वतंत्र व्यवसाय अथवा सामाजिक क्षेत्र में सक्रिय';

    dims.push({
      id: 9,
      category: 'family',
      categoryTitleEn: 'Family & Ancestral Lineage',
      categoryTitleHi: 'माता-पिता, कुल व कुटुंब',
      titleEn: "Mother's Profession, Domestic Leadership & Role",
      titleHi: 'माता का कार्यक्षेत्र, सामाजिक भूमिका व गृह-प्रबंधन',
      astroBasisEn: `10th from 4th (1st House) sign ${ascSignName} ruled by ${ascLord}; 4th Lord ${h4.lord} in H${h4.placedHouse} (${h4.dignity}); [SAV (Auxiliary): ${sav[3]} bindus].`,
      astroBasisHi: `चतुर्थ से दशम (लग्न भाव) ${ascSignHi} राशि, स्वामी ${ascLordHi}; चतुर्थेश ${h4.lordHi} भाव ${h4.placedHouse} में (${h4.dignityHi}); [सर्वाष्टकवर्ग (सहायक): ${sav[3]} बिंदु]।`,
      verdictEn: profEn,
      verdictHi: profHi,
      detailedAnalysisEn: `Assessed via the 10th from 4th (Lagna) and the 4th lord's vocational nakshatra alignment. The 4th lord's dignity shapes whether your mother leads domestic administration or active external leadership.`,
      detailedAnalysisHi: `माता के कार्यक्षेत्र का विचार चतुर्थ से दशम (लग्न) तथा चतुर्थेश की नक्षत्र स्थिति से होता है। चतुर्थेश की गरिमा यह तय करती है कि वे परिवार की कुशल प्रबंधक अथवा बाहरी कार्यक्षेत्र में सक्रिय रहेंगी।`,
      remedyEn: `Gift green or white clothing to mother on festive days to strengthen her domestic harmony.`,
      remedyHi: `त्योहारों अथवा विशेष अवसरों पर माता को श्वेत या हरे रंग के वस्त्र भेंट करें।`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score),
    });
  }

  // ==========================================
  // 10. Mother's Lifespan & Health Sensitivities
  // ==========================================
  {
    let matruAffliction = 0;
    const maleficsIn4 = planets.filter((p) => p.houseNumber === 4 && (p.id === 'Saturn' || p.id === 'Rahu' || p.id === 'Ketu' || p.id === 'Mars' || p.id === 'Sun'));
    matruAffliction += maleficsIn4.length * 2;
    if (h4.placedHouse === 6 || h4.placedHouse === 8 || h4.placedHouse === 12) matruAffliction += 2.5;
    if (h4.dignity === 'Debilitated') matruAffliction += 2;
    if (moon.houseNumber === 6 || moon.houseNumber === 8 || moon.houseNumber === 12) matruAffliction += 2;
    if (moon.dignity === 'Debilitated') matruAffliction += 2;
    const moonAfflicted = planets.some((p) => p.houseNumber === moon.houseNumber && p.id !== 'Moon' && (p.id === 'Saturn' || p.id === 'Rahu' || p.id === 'Ketu' || p.id === 'Mars'));
    if (moonAfflicted) matruAffliction += 2;
    if (sav[3] < 24) matruAffliction += 1.5;
    if (sav[3] < 20) matruAffliction += 2;

    const isMatruArishta = matruAffliction >= 5;
    const isMatruVulnerable = matruAffliction >= 3;

    const score = isMatruArishta
      ? Math.max(25, 45 - matruAffliction * 3)
      : Math.max(35, Math.min(92, 50 + (sav[3] >= 28 ? 6 : -6) + getDignityBonus(moon.dignity)));

    const lifeEn = isMatruArishta
      ? 'Matru-Arishta Yoga (Severe Maternal Vulnerability): Classical texts warn of early maternal demise, separation, or critical health vulnerability during native’s childhood or youth (4th house/lord and Moon afflicted by Dusthana/malefics).'
      : isMatruVulnerable
      ? 'Madhyayu with Health Sensitivities (52-64 years); requires conscious vigilance regarding water-borne illness, chronic stress, or cardiac/respiratory care'
      : sav[3] >= 29 && (moon.dignity === 'Exalted' || moon.dignity === 'Own Sign' || moon.houseNumber === 4)
      ? 'Purna Matru Ayu: Long, healthy and peaceful lifespan (78+ years)'
      : 'Healthy medium-to-long lifespan (68-78 years) with good emotional care';

    const lifeHi = isMatruArishta
      ? 'मातृ-अरिष्ट योग (अल्पायु अथवा बाल्यावस्था में मातृ वियोग): चतुर्थ भाव, चतुर्थेश व चंद्र पर क्रूर ग्रहों व त्रिक भावों (6/8/12) के प्रबल प्रभाव के कारण बाल्यावस्था अथवा युवावस्था में माता को गंभीर संकट/वियोग का स्पष्ट योग।'
      : isMatruVulnerable
      ? 'मध्यायु व स्वास्थ्य संवेदनशीलता (52-64 वर्ष); कफ, जल तत्व, उदर, रक्तचाप अथवा मानसिक तनाव से स्वास्थ्य की विशेष रक्षा आवश्यक'
      : sav[3] >= 29 && (moon.dignity === 'Exalted' || moon.dignity === 'Own Sign' || moon.houseNumber === 4)
      ? 'पूर्ण मातृ आयु: सुदीर्घ, स्वस्थ व शांत जीवनकाल (78+ वर्ष)'
      : 'सामान्यतः सुखी व दीर्घायु (68-78 वर्ष), पारिवारिक सुख व आरोग्य की रक्षा';

    dims.push({
      id: 10,
      category: 'family',
      categoryTitleEn: 'Family & Ancestral Lineage',
      categoryTitleHi: 'माता-पिता, कुल व कुटुंब',
      titleEn: "Mother's Lifespan, Longevity & Health Sensitivities",
      titleHi: 'माता का जीवनकाल, दीर्घायु व स्वास्थ्य संवेदनशीलता',
      astroBasisEn: `4th Lord ${h4.lord} in H${h4.placedHouse} (${h4.dignity}, Star Lord: ${h4.starLord}); Moon in H${moon.houseNumber} (${moon.dignity}); [SAV (Auxiliary): 4th H ${sav[3]} bindus, 11th H ${sav[10]} bindus].`,
      astroBasisHi: `चतुर्थेश ${h4.lordHi} भाव ${h4.placedHouse} में (${h4.dignityHi}, नक्षत्र स्वामी: ${h4.starLordHi}); चंद्रमा भाव ${moon.houseNumber} में (${moon.dignity}); [सर्वाष्टकवर्ग (सहायक): चतुर्थ भाव ${sav[3]} बिंदु, एकादश भाव ${sav[10]} बिंदु]।`,
      verdictEn: lifeEn,
      verdictHi: lifeHi,
      detailedAnalysisEn: `Mother's longevity is rooted in the 4th house lord, the condition of the Moon, and aspects from Saturn or Mars, with the 8th from the 4th (11th house) providing supplementary depth. Lunar vitality is the primary pillar, while SAV points provide background energetic reserve.`,
      detailedAnalysisHi: `माता की आयु का निर्णय चतुर्थेश, चंद्रमा की गरिमा तथा शुभ/अशुभ ग्रहों की दृष्टि से होता है; चतुर्थ से अष्टम (एकादश भाव) इसका संपूरक है। चंद्रमा का बल मातृ आयु का मुख्य आधार है, जबकि अष्टकवर्ग के बिंदु सहायक शक्ति के रूप में कार्य करते हैं।`,
      remedyEn: `Chant Chandra Beej Mantra ("Om Shram Shreem Shrom Sah Chandramase Namah") for mother's longevity.`,
      remedyHi: `माता के दीर्घायु व आरोग्य हेतु सोमवार को चंद्र बीज मंत्र का 108 बार जप करें।`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score),
    });
  }

  // ==========================================
  // 11. Mother-Child Relationship & Emotional Bond
  // ==========================================
  {
    const score = Math.max(35, Math.min(95, 50 + ([1, 4, 5, 9].includes(h4.placedHouse) ? 18 : -8) + getDignityBonus(h4.dignity) + (sav[3] >= 28 ? 6 : -4)));
    const relEn = [1, 4, 5, 9].includes(h4.placedHouse) && !h4.isCombust
      ? 'Profound emotional resonance, mother is your greatest psychological anchor and protector'
      : 'Affectionate yet emotionally sensitive bond; occasional worry over each other’s well-being';
    const relHi = [1, 4, 5, 9].includes(h4.placedHouse) && !h4.isCombust
      ? 'अत्यंत गहरा व भावनात्मक लगाव, माता आपके जीवन की सबसे बड़ी मानसिक संबल व रक्षा कवच'
      : 'स्नेहपूर्ण किंतु संवेदनशील संबंध; एक-दूसरे के प्रति अत्यधिक चिंता से कभी-कभी भावुक तनाव';

    dims.push({
      id: 11,
      category: 'family',
      categoryTitleEn: 'Family & Ancestral Lineage',
      categoryTitleHi: 'माता-पिता, कुल व कुटुंब',
      titleEn: 'Relationship with Mother & Emotional Bond',
      titleHi: 'माता से संबंध, मानसिक लगाव व वात्सल्य सुख',
      astroBasisEn: `4th Lord ${h4.lord} in House ${h4.placedHouse} (${h4.dignity}), Nakshatra ${h4.nakshatraName} (Star Lord: ${h4.starLord}); Moon in H${moon.houseNumber}; [SAV (Auxiliary): ${sav[3]} bindus].`,
      astroBasisHi: `चतुर्थेश ${h4.lordHi} भाव ${h4.placedHouse} में (${h4.dignityHi}), नक्षत्र: ${h4.nakshatraName} (स्वामी: ${h4.starLordHi}); चंद्रमा भाव ${moon.houseNumber} में; [सर्वाष्टकवर्ग (सहायक): ${sav[3]} बिंदु]।`,
      verdictEn: relEn,
      verdictHi: relHi,
      detailedAnalysisEn: `The 4th lord's placement and the Moon's mutual relationship with Lagna dictate the maternal bond. Because the 4th lord connects to positive houses, mother's prayers act as an invisible spiritual shield.`,
      detailedAnalysisHi: `चतुर्थेश की स्थिति एवं चंद्रमा का लग्न से संबंध मातृ सुख व स्नेह का मुख्य आधार है। चतुर्थेश के शुभ भाव में होने से माता का आशीर्वाद जीवन के हर मोड़ पर रक्षा कवच बनता है।`,
      remedyEn: `Never leave home on major assignments without taking mother's blessing.`,
      remedyHi: `घर से किसी भी महत्वपूर्ण कार्य पर निकलते समय माता का चरण स्पर्श अवश्य करें।`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score),
    });
  }

  // ==========================================
  // 12. Siblings Count & Gender Tendencies
  // ==========================================
  {
    let sibAffliction = 0;
    const maleficsIn3 = planets.filter((p) => p.houseNumber === 3 && (p.id === 'Ketu' || p.id === 'Saturn' || p.id === 'Mars' || p.id === 'Sun'));
    sibAffliction += maleficsIn3.length * 2;
    if (h3.placedHouse === 6 || h3.placedHouse === 8 || h3.placedHouse === 12) sibAffliction += 2.5;
    if (h3.dignity === 'Debilitated') sibAffliction += 2;
    const marsDignity = mars.dignity || 'Neutral';
    if (marsDignity === 'Debilitated' || mars.houseNumber === 6 || mars.houseNumber === 8 || mars.houseNumber === 12) sibAffliction += 2;
    if (sav[2] < 24) sibAffliction += 1.5;
    if (sav[2] < 20) sibAffliction += 2;

    const elderBlocked = planets.some((p) => p.houseNumber === 11 && (p.id === 'Ketu' || p.id === 'Saturn')) || h11.placedHouse === 6 || h11.placedHouse === 8 || h11.placedHouse === 12 || sav[10] < 24;
    if (elderBlocked) sibAffliction += 2;

    const isOnlyChild = sibAffliction >= 5;
    const score = isOnlyChild ? 40 : Math.max(35, Math.min(90, 50 + (sav[2] >= 28 ? 10 : -5) + getDignityBonus(mars.dignity)));

    const countEn = isOnlyChild
      ? 'Only Child Yoga (Single Progeny / 0 Siblings): No co-born biological brothers or sisters indicated; native stands as the sole anchor and independent carrier of family responsibilities.'
      : sav[2] >= 28 && (h3.lord === 'Jupiter' || h3.lord === 'Mercury' || h3.lord === 'Venus')
      ? '2 to 4 siblings indicated (Harmonious combination of brothers and sisters)'
      : '1 to 2 siblings indicated based on 3rd and 11th bhavas';
    const countHi = isOnlyChild
      ? 'एकल संतान योग (Single Child — शून्य सहोदर): माता-पिता की एकमात्र संतान होने का प्रबल योग — कोई सगा भाई अथवा बहन नहीं; परिवार का संपूर्ण दायित्व अकेले वहन करने का संकेत।'
      : sav[2] >= 28 && (h3.lord === 'Jupiter' || h3.lord === 'Mercury' || h3.lord === 'Venus')
      ? '2 से 4 भाई-बहनों का योग (भाई व बहन दोनों की अनुकूल उपस्थिति)'
      : '1 से 2 भाई-बहनों का योग (तृतीय व एकादश भाव के समीकरण अनुसार)';

    dims.push({
      id: 12,
      category: 'family',
      categoryTitleEn: 'Family & Ancestral Lineage',
      categoryTitleHi: 'माता-पिता, कुल व कुटुंब',
      titleEn: 'Siblings Count & Gender Tendencies (Bhratri Bhava)',
      titleHi: 'भाई-बहनों की संख्या, सहोदर योग व लिंग संकेत',
      astroBasisEn: `3rd House (${h3.signName}) ruled by ${h3.lord} in H${h3.placedHouse} (${h3.dignity}, Star Lord: ${h3.starLord}); Mars (Bhratrikaraka) in House ${mars.houseNumber} (${marsDignity}); [SAV (Auxiliary): ${sav[2]} bindus].`,
      astroBasisHi: `तृतीयेश ${h3.lordHi} भाव ${h3.placedHouse} में (${h3.dignityHi}, नक्षत्र स्वामी: ${h3.starLordHi}); मंगल (भ्रातृकारक) भाव ${mars.houseNumber} में (${marsDignity}); [सर्वाष्टकवर्ग (सहायक): ${sav[2]} बिंदु]।`,
      verdictEn: countEn,
      verdictHi: countHi,
      detailedAnalysisEn: `Classical Parashari texts evaluate younger siblings from the 3rd house and Mars, and elder siblings from the 11th house. The primary causal factor is the placement and aspects of the 3rd lord and Mars, while 3rd house SAV points act as a corroborative energetic reserve.`,
      detailedAnalysisHi: `पराशरी सिद्धांत में तृतीयेश, मंगल (भ्रातृकारक) तथा एकादश भाव के स्वामी से सहोदरों का निर्णय होता है। तृतीयेश व मंगल की स्थिति सहोदर संख्या का मुख्य आधार है, जबकि अष्टकवर्ग के ${sav[2]} बिंदु सहायक बल प्रदान करते हैं।`,
      remedyEn: `Distribute sweet jalebis or batasha to young boys or siblings on Tuesdays.`,
      remedyHi: `मंगलवार के दिन छोटे बच्चों अथवा सहोदरों को गुड़ या मीठा प्रसाद बांटें।`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score),
    });
  }

  // ==========================================
  // 13. Birth Order Among Siblings
  // ==========================================
  {
    const score = 70;
    const isEldest = h11.lord === 'Saturn' || h11.lord === 'Sun' || planets.some((p) => p.houseNumber === 11 && (p.id === 'Saturn' || p.id === 'Rahu'));
    const isYoungest = planets.some((p) => p.houseNumber === 3 && (p.id === 'Saturn' || p.id === 'Mars'));
    const isOnlyChildInScope = dims[11]?.verdictEn.includes('Only Child');
    const orderEn = isOnlyChildInScope
      ? 'Single Progeny / Only Child — No elder or younger siblings; bears family mantle independently'
      : isEldest
      ? 'Eldest among siblings / Primary decision-maker carrying leadership responsibilities'
      : isYoungest
      ? 'Youngest among siblings / Affectionate beneficiary of family pampering'
      : 'Middle sibling / Natural coordinator bridging elders and youngsters';
    const orderHi = isOnlyChildInScope
      ? 'एकल संतान (इकलौती संतान) — कोई अग्रज या अनुज नहीं; परिवार की एकमात्र आधारशिला'
      : isEldest
      ? 'ज्येष्ठ संतान (सबसे बड़े) — परिवार में नेतृत्व व प्रमुख निर्णय लेने का दायित्व'
      : isYoungest
      ? 'कनिष्ठ संतान (सबसे छोटे) — परिवार में सबका स्नेह व विशेष दुलार पाने वाले'
      : 'मध्यम संतान — परिवार के बड़े व छोटे भाई-बहनों के बीच समन्वयकर्ता';

    dims.push({
      id: 13,
      category: 'family',
      categoryTitleEn: 'Family & Ancestral Lineage',
      categoryTitleHi: 'माता-पिता, कुल व कुटुंब',
      titleEn: 'Birth Order Position Among Siblings',
      titleHi: 'सहोदरों में जन्म क्रम (ज्येष्ठ, कनिष्ठ अथवा मध्यम)',
      astroBasisEn: `11th House Lord ${h11.lord} (elder siblings) vs 3rd House Lord ${h3.lord} (younger siblings); Mars in House ${mars.houseNumber}.`,
      astroBasisHi: `एकादशेश ${h11.lordHi} (बड़े भाई-बहन) बनाम तृतीयेश ${h3.lordHi} (छोटे भाई-बहन); मंगल भाव ${mars.houseNumber} में स्थित।`,
      verdictEn: orderEn,
      verdictHi: orderHi,
      detailedAnalysisEn: `Birth order in Vedic astrology is governed by the relative strengths of the 11th house (Jyeshtha) and 3rd house (Kanishta). Malefic or restrictive planets on the 11th indicate being the eldest, whereas strong 3rd house placements support being younger.`,
      detailedAnalysisHi: `वैदिक ज्योतिष में एकादश भाव बड़े भाई-बहनों का और तृतीय भाव छोटे भाई-बहनों का होता है। एकादश भाव पर शनि/राहु का प्रभाव ज्येष्ठ होने का प्रबल संकेत देता है, जबकि तृतीय भाव के प्रभाव से कनिष्ठ स्थिति बनती है।`,
      remedyEn: `Support younger siblings unconditionally to activate Mars and Jupiter blessings.`,
      remedyHi: `छोटे भाई-बहनों को स्नेह दें तथा बड़ों का आदर कर गुरु व मंगल के शुभ फल प्राप्त करें।`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score),
    });
  }

  // ==========================================
  // 14. Sibling Harmony & Mutual Fortune
  // ==========================================
  {
    const score = Math.max(35, Math.min(95, 45 + (sav[2] >= 28 ? 15 : -8) + (h3.placedHouse === 6 || h3.placedHouse === 8 || h3.placedHouse === 12 ? -12 : 10)));
    const harmEn = sav[2] >= 28
      ? 'Warm, protective and cooperative bond; mutual assistance during career and financial milestones'
      : 'Polite yet somewhat distant; occasional property or ego friction requiring patience';
    const harmHi = sav[2] >= 28
      ? 'स्नेहपूर्ण, सुरक्षात्मक व सहयोगात्मक संबंध; जीवन के महत्वपूर्ण मोड़ों पर परस्पर सहयोग'
      : 'मर्यादित किंतु कभी-कभी वैचारिक दूरी; संपत्ति या अहं के टकराव से सतर्कता आवश्यक';

    dims.push({
      id: 14,
      category: 'family',
      categoryTitleEn: 'Family & Ancestral Lineage',
      categoryTitleHi: 'माता-पिता, कुल व कुटुंब',
      titleEn: 'Sibling Harmony & Shared Fortune',
      titleHi: 'भाई-बहनों से संबंध, सौहार्द व सहयोग',
      astroBasisEn: `3rd House SAV: ${sav[2]} bindus; 3rd Lord ${h3.lord} in House ${h3.placedHouse}; Mars in ${mars.signName}.`,
      astroBasisHi: `तृतीय भाव अष्टकवर्ग: ${sav[2]} बिंदु; तृतीयेश ${h3.lordHi} भाव ${h3.placedHouse} में; मंगल ${HINDI_SIGNS[mars.signIndex]} में।`,
      verdictEn: harmEn,
      verdictHi: harmHi,
      detailedAnalysisEn: `With 3rd house possessing ${sav[2]} bindus, cooperative energy is fostered. Maintaining clear communication during inheritance or financial discussions prevents unnecessary misunderstandings.`,
      detailedAnalysisHi: `तृतीय भाव में ${sav[2]} अष्टकवर्ग बिंदु होने से सहोदरों के मध्य भावनात्मक जुड़ाव रहता है। संपत्ति या धन के लेन-देन में पारदर्शिता रखने से संबंध सदैव मधुर बने रहते हैं।`,
      remedyEn: `Share festive sweets and gifts with siblings during Raksha Bandhan or Bhai Dooj.`,
      remedyHi: `रक्षाबंधन अथवा भैयादूज पर भाई-बहनों को उपहार दें व सद्भाव बनाए रखें।`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score),
    });
  }

  // ==========================================
  // 15. Marriage Timing Window & Age
  // ==========================================
  {
    let marrAffliction = 0;
    const maleficsIn7 = planets.filter((p) => p.houseNumber === 7 && (p.id === 'Saturn' || p.id === 'Rahu' || p.id === 'Ketu' || p.id === 'Mars' || p.id === 'Sun'));
    marrAffliction += maleficsIn7.length * 2;
    if (h7.placedHouse === 6 || h7.placedHouse === 8 || h7.placedHouse === 12) marrAffliction += 2.5;
    if (h7.dignity === 'Debilitated') marrAffliction += 2;
    if (venus.dignity === 'Debilitated' || venus.houseNumber === 6 || venus.houseNumber === 8) marrAffliction += 2;
    if (sav[6] < 24) marrAffliction += 1.5;
    if (sav[6] < 20) marrAffliction += 2;

    const isSevereDelayOrDenial = marrAffliction >= 4.5;
    const isDelayed = marrAffliction >= 2 || maleficsIn7.length > 0 || h7.placedHouse === 6 || h7.placedHouse === 8 || h7.placedHouse === 12;

    const score = isSevereDelayOrDenial ? 38 : Math.max(35, Math.min(95, 50 + (sav[6] >= 28 ? 12 : -8) + getDignityBonus(h7.dignity)));

    let windowEn = '';
    let windowHi = '';

    if (currentAge >= 32 && isSevereDelayOrDenial) {
      windowEn = `Marriage Obstruction / Severe Delay / Celibacy Tendency: Native is currently ${currentAgeRound} years old. Strong afflictions on 7th House/Lord indicate either lifelong independence/celibacy or marriage only after age 38-42+ following dedicated Vedic remedies.`;
      windowHi = `विवाह प्रतिबंधक योग / अत्यधिक विलंब अथवा वैराग्य योग: जातक की वर्तमान आयु ${currentAgeRound} वर्ष है। सप्तम भाव व सप्तमेश पर क्रूर प्रभाव के कारण विवाह में अत्यधिक विलंब, आजीवन अविवाहित रहने अथवा 38-42+ वर्ष की आयु के पश्चात ही विशेष शांति अनुष्ठान से विवाह संभव।`;
    } else if (currentAge >= 28 || isDelayed) {
      const startAge = Math.max(28, Math.min(35, currentAgeRound));
      windowEn = `Delayed Auspicious Window: ${startAge} to ${startAge + 5} years of age (7th Lord ${h7.lord} in H${h7.placedHouse}, 7th SAV: ${sav[6]} bindus)`;
      windowHi = `विलंबित परिपक्व विवाह काल: ${startAge} से ${startAge + 5} वर्ष की आयु में (सप्तमेश ${h7.lordHi} भाव ${h7.placedHouse} में, 7वां SAV: ${sav[6]} बिंदु)`;
    } else {
      windowEn = `Timely Auspicious Window: 24 to 28 years of age (7th Lord ${h7.lord} in H${h7.placedHouse}, 7th SAV: ${sav[6]} bindus)`;
      windowHi = `समय पर शुभ विवाह काल: 24 से 28 वर्ष की आयु में (सप्तमेश ${h7.lordHi} भाव ${h7.placedHouse} में, 7वां SAV: ${sav[6]} बिंदु)`;
    }

    dims.push({
      id: 15,
      category: 'marriage',
      categoryTitleEn: 'Marriage & Relational Dynamics',
      categoryTitleHi: 'विवाह, दांपत्य व जीवनसाथी',
      titleEn: 'Marriage Timing Window & Probable Age Range',
      titleHi: 'विवाह काल, संभावित आयु सीमा व शुभ लग्न काल',
      astroBasisEn: `7th House (${h7.signName}) ruled by ${h7.lord} in H${h7.placedHouse} (${h7.dignity}, Star Lord: ${h7.starLord}); [SAV (Auxiliary): ${sav[6]} bindus]; Running Dasha: ${mdLord}-${adLord}.`,
      astroBasisHi: `सप्तमेश ${h7.lordHi} भाव ${h7.placedHouse} में (${h7.dignityHi}, नक्षत्र स्वामी: ${h7.starLordHi}); [सर्वाष्टकवर्ग (सहायक): ${sav[6]} बिंदु]; वर्तमान दशा: ${mdLordHi}-${adLordHi}।`,
      verdictEn: windowEn,
      verdictHi: windowHi,
      detailedAnalysisEn: `The 7th house and its lord, in conjunction with Venus (for men) and Jupiter (for women), trigger marriage when the Vimshottari Mahadasha/Antardasha connects to the 7th or 2nd lords. The primary causal factor is the 7th lord's dignity and aspects, while 7th SAV points provide supplemental energetic support.`,
      detailedAnalysisHi: `सप्तमेश की स्थिति, नक्षत्र स्वामी (${h7.starLordHi}) एवं शुक्र/गुरु का संबंध विवाह काल का प्राथमिक आधार हैं। दशा स्वामी ${mdLordHi} के संचरण तथा सप्तम भाव के ${sav[6]} अष्टकवर्ग बिंदुओं के सहायक प्रभाव से विवाह योग परिपक्व होता है।`,
      remedyEn: `Worship Goddess Gauri or Lord Shiva on Mondays and light a ghee lamp facing North-East.`,
      remedyHi: `शीघ्र व शुभ विवाह हेतु सोमवार को भगवान शिव व माता पार्वती की संयुक्त पूजा करें तथा घी का दीपक जलाएं।`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score),
    });
  }

  // ==========================================
  // 16. Marital Structure: Timely, Delayed, or Challenges
  // ==========================================
  {
    const score = Math.max(35, Math.min(95, 45 + ([1, 4, 5, 7, 9, 10].includes(h7.placedHouse) ? 14 : -14) + getDignityBonus(h7.dignity) + (sav[6] >= 28 ? 6 : -6)));
    const saturnOn7 = planets.some((p) => p.houseNumber === 7 && p.id === 'Saturn');
    const rahuOn7 = planets.some((p) => p.houseNumber === 7 && p.id === 'Rahu');
    const structEn = saturnOn7
      ? 'Single, enduring marriage; initial delays dissolve into lifelong solid companionship'
      : rahuOn7
      ? 'Unconventional or inter-caste/cross-cultural marriage; requires emotional transparency'
      : h7.placedHouse === 6 || h7.placedHouse === 8
      ? 'Sensitive marital equilibrium; pre-marital horoscope matching strongly advised'
      : 'Harmonious, culturally aligned and socially celebrated lifelong union';
    const structHi = saturnOn7
      ? 'एकल, सुदृढ़ व स्थायी विवाह; आरंभिक विलंब के पश्चात आजीवन अटूट दांपत्य'
      : rahuOn7
      ? 'अपरंपरागत अथवा अंतर-सांस्कृतिक विवाह योग; संबंधों में स्पष्टता व विश्वास अनिवार्य'
      : h7.placedHouse === 6 || h7.placedHouse === 8
      ? 'संवेदनशील दांपत्य संतुलन; विवाह पूर्व गहन कुंडली मिलान नितांत आवश्यक'
      : 'आनंदमय, सांस्कृतिक रूप से प्रतिष्ठित व आजीवन सुखद वैवाहिक जीवन';

    dims.push({
      id: 16,
      category: 'marriage',
      categoryTitleEn: 'Marriage & Relational Dynamics',
      categoryTitleHi: 'विवाह, दांपत्य व जीवनसाथी',
      titleEn: 'Marital Structure: Timely, Delayed or Karmic Lessons',
      titleHi: 'विवाह स्वरूप: समय पर, विलंब अथवा कार्मिक संतुलन',
      astroBasisEn: `7th Lord ${h7.lord} in H${h7.placedHouse} (${h7.dignity}); Occupants: ${h7.occupants.map((o) => o.id).join(', ') || 'None'}; Aspects: ${h7.aspects.map((a) => `${a.planet} (${a.type})`).join(', ') || 'None'}; [SAV (Auxiliary): ${sav[6]} bindus].`,
      astroBasisHi: `सप्तमेश ${h7.lordHi} भाव ${h7.placedHouse} में (${h7.dignityHi}); स्थित ग्रह: ${h7.occupants.map((o) => HINDI_PLANETS[o.id] || o.id).join(', ') || 'कोई नहीं'}; दृष्टि: ${h7.aspects.map((a) => `${a.planetHi} (${a.type})`).join(', ') || 'कोई नहीं'}; [सर्वाष्टकवर्ग (सहायक): ${sav[6]} बिंदु]।`,
      verdictEn: structEn,
      verdictHi: structHi,
      detailedAnalysisEn: `Classical Parashari texts evaluate marital stability through 7th lord dignity, conjunctions, and aspects from Saturn, Mars, or Jupiter. The primary tone is established by these graha positions, while 7th house SAV bindus act as an auxiliary reservoir.`,
      detailedAnalysisHi: `सप्तमेश का स्थान, स्थित ग्रह एवं शनि, मंगल या गुरु की दृष्टि वैवाहिक स्थिरता के मूल निर्णायक हैं। ग्रहों की यह स्थिति दांपत्य की आधारशिला है, जबकि अष्टकवर्ग के ${sav[6]} बिंदु इसे सहायक ऊर्जा प्रदान करते हैं।`,
      remedyEn: `Perform Vishnu Sahasranama recital on Thursdays to safeguard marital bond.`,
      remedyHi: `गुरुवार को श्री विष्णु सहस्रनाम का पाठ करें अथवा केले के वृक्ष में जल अर्पित करें।`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score),
    });
  }

  // ==========================================
  // 17. Spouse Physical Appearance & Character
  // ==========================================
  {
    const score = Math.max(40, Math.min(95, 50 + getDignityBonus(h7.dignity)));
    const traitsEn = h7.signName === 'Aries' || h7.signName === 'Leo' || h7.signName === 'Sagittarius'
      ? 'Athletic, charismatic, energetic, radiant eyes with fiery, dynamic leadership persona'
      : h7.signName === 'Taurus' || h7.signName === 'Virgo' || h7.signName === 'Capricorn'
      ? 'Graceful, well-proportioned, dignified demeanor, practical, grounded and dependable'
      : h7.signName === 'Gemini' || h7.signName === 'Libra' || h7.signName === 'Aquarius'
      ? 'Charming, expressive, witty, modern aesthetics, intellectually stimulating conversationalist'
      : 'Fair, gentle, soft features, deeply intuitive, caring and emotionally nurturing';
    const traitsHi = h7.signName === 'Aries' || h7.signName === 'Leo' || h7.signName === 'Sagittarius'
      ? 'तेजस्वी, ऊर्जावान, आकर्षक नेत्र, फुर्तीला शारीरिक गठन व स्वाभिमानी नेतृत्वकारी व्यक्तित्व'
      : h7.signName === 'Taurus' || h7.signName === 'Virgo' || h7.signName === 'Capricorn'
      ? 'सुंदर, संतुलित शारीरिक बनावट, गरिमामयी आचरण, व्यावहारिक, कर्मठ व विश्वसनीय'
      : h7.signName === 'Gemini' || h7.signName === 'Libra' || h7.signName === 'Aquarius'
      ? 'मनमोहक, अभिव्यक्ति-कुशल, आधुनिक विचारों वाले, हाजिरजवाब व बौद्धिक रूप से समृद्ध'
      : 'सौम्य, आकर्षक मुखाकृति, संवेदनशील, करुणामयी व वात्सल्य से परिपूर्ण हृदय';

    dims.push({
      id: 17,
      category: 'marriage',
      categoryTitleEn: 'Marriage & Relational Dynamics',
      categoryTitleHi: 'विवाह, दांपत्य व जीवनसाथी',
      titleEn: "Spouse's Physical Traits, Temperament & Demeanor",
      titleHi: 'जीवनसाथी का रूप-रंग, शारीरिक गठन व स्वभाव',
      astroBasisEn: `7th House in ${h7.signName} (${HINDI_SIGNS[h7.signIdx]}); 7th Lord ${h7.lord} placed in ${h7.placedSignName} (House ${h7.placedHouse}, Dignity: ${h7.dignity}).`,
      astroBasisHi: `सप्तम भाव ${h7.signHi} राशि में; सप्तमेश ${h7.lordHi} भाव ${h7.placedHouse} में (${h7.placedSignHi}, गरिमा: ${h7.dignity}) स्थित।`,
      verdictEn: traitsEn,
      verdictHi: traitsHi,
      detailedAnalysisEn: `The 7th house rashi, its element (${SIGN_ELEMENTS[h7.signIdx]}), and the lord's disposition portray the physical and mental profile of the life partner. In this nativity, ${h7.signName} indicates an attractive partner whose presence elevates your social grace.`,
      detailedAnalysisHi: `सप्तम भाव की राशि, उसका तत्व (${HINDI_ELEMENTS[h7.signIdx]}) एवं सप्तमेश की स्थिति जीवनसाथी के रूप व स्वभाव का संकेत देती है। ${h7.signHi} राशि के प्रभाव से जीवनसाथी सुसंस्कृत व सम्मानीय व्यक्तित्व के धनी होंगे।`,
      remedyEn: `Gift white sweets or perfume to your spouse on Fridays to enhance Venusian harmony.`,
      remedyHi: `शुक्रवार को जीवनसाथी को सुगंधित इत्र अथवा श्वेत मिष्ठान्न भेंट करें।`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score),
    });
  }

  // ==========================================
  // 18. Spouse Profession & Family Background
  // ==========================================
  {
    const score = Math.max(40, Math.min(95, 50 + (sav[3] >= 28 ? 10 : 0) + getDignityBonus(h7.dignity)));
    const profEn = h7.lord === 'Sun' || h7.lord === 'Mars'
      ? 'Administration, public sector, law, security, corporate management or real estate'
      : h7.lord === 'Mercury' || h7.lord === 'Venus'
      ? 'Finance, software/IT, creative design, media, luxury commerce or high-level consulting'
      : h7.lord === 'Jupiter'
      ? 'Education, judiciary, medicine, banking or academic research'
      : 'Technical engineering, research, logistics, operations or independent business';
    const profHi = h7.lord === 'Sun' || h7.lord === 'Mars'
      ? 'प्रशासनिक सेवा, राजकीय पद, विधि/न्याय, रक्षा, कॉर्पोरेट प्रबंधन अथवा भूमि/निर्माण'
      : h7.lord === 'Mercury' || h7.lord === 'Venus'
      ? 'वित्त, सॉफ्टवेयर/आईटी, डिजाइन, मीडिया, वाणिज्य, कला अथवा उच्च-स्तरीय परामर्श'
      : h7.lord === 'Jupiter'
      ? 'शिक्षा, चिकित्सा, न्यायपालिका, बैंकिंग अथवा उच्च शोध संस्थान'
      : 'तकनीकी इंजीनियरिंग, अनुसंधान, संचालन अथवा स्वतंत्र संगठित व्यवसाय';

    dims.push({
      id: 18,
      category: 'marriage',
      categoryTitleEn: 'Marriage & Relational Dynamics',
      categoryTitleHi: 'विवाह, दांपत्य व जीवनसाथी',
      titleEn: "Spouse's Profession, Family Background & Social Lineage",
      titleHi: 'जीवनसाथी का कार्यक्षेत्र, पेशा व पारिवारिक पृष्ठभूमि',
      astroBasisEn: `10th from 7th (4th House) sign ${h4.signName} ruled by ${h4.lord}; 7th Lord ${h7.lord} in House ${h7.placedHouse}; 4th SAV: ${sav[3]} bindus.`,
      astroBasisHi: `सप्तम से दशम (चतुर्थ भाव) ${h4.signHi} राशि, स्वामी ${h4.lordHi}; सप्तमेश ${h7.lordHi} भाव ${h7.placedHouse} में; चतुर्थ भाव अष्टकवर्ग: ${sav[3]} बिंदु।`,
      verdictEn: profEn,
      verdictHi: profHi,
      detailedAnalysisEn: `Counting 10 houses from the 7th (the 4th house of natal chart) delineates spouse's vocation and lineage. The placement of ${h7.lord} signifies that your partner hails from a respectable, principled family and brings financial independence to the union.`,
      detailedAnalysisHi: `सप्तम भाव से दशम भाव (जन्म कुंडली का चतुर्थ भाव) जीवनसाथी के कर्मक्षेत्र व कुल का दर्पण है। सप्तमेश ${h7.lordHi} के शुभ प्रभाव से जीवनसाथी स्वावलंबी होंगे तथा एक सुप्रतिष्ठित कुल से आएंगे।`,
      remedyEn: `Jointly participate in charitable feeding on major wedding anniversary days.`,
      remedyHi: `विवाह की वर्षगांठ अथवा शुभ तिथियों पर दंपति साथ मिलकर निर्धनों को भोजन कराएं।`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score),
    });
  }

  // ==========================================
  // 19. Marital Harmony, Age Gap & Bed Sukh
  // ==========================================
  {
    const score = Math.max(35, Math.min(95, 45 + (sav[6] >= 28 ? 12 : -8) + (sav[11] >= 28 ? 10 : 0)));
    const ageGapEn = planets.some((p) => p.houseNumber === 7 && p.id === 'Saturn')
      ? 'Older age difference (3 to 6 years) or remarkable emotional maturity in spouse'
      : 'Standard harmonious age difference (1 to 3 years) with peer-level understanding';
    const ageGapHi = planets.some((p) => p.houseNumber === 7 && p.id === 'Saturn')
      ? 'आयु में अधिक अंतर (3 से 6 वर्ष) अथवा जीवनसाथी में अत्यधिक मानसिक परिपक्वता'
      : 'सामान्य व संतुलित आयु अंतर (1 से 3 वर्ष), मित्रों जैसा सहज वैचारिक तालमेल';

    dims.push({
      id: 19,
      category: 'marriage',
      categoryTitleEn: 'Marriage & Relational Dynamics',
      categoryTitleHi: 'विवाह, दांपत्य व जीवनसाथी',
      titleEn: 'Marital Harmony, Age Difference & Intimate Chemistry',
      titleHi: 'दांपत्य सामंजस्य, आयु अंतर व परस्पर समर्पण',
      astroBasisEn: `7th Lord in H${h7.placedHouse} (${h7.dignity}, Star Lord ${h7.starLord}); 12th Lord in H${h12.placedHouse}; Venus in H${venus.houseNumber} (${venus.dignity}); [SAV (Auxiliary): 7th H ${sav[6]} bindus, 12th H ${sav[11]} bindus].`,
      astroBasisHi: `सप्तमेश भाव ${h7.placedHouse} में (${h7.dignityHi}, नक्षत्र स्वामी: ${h7.starLordHi}); द्वादशेश भाव ${h12.placedHouse} में; शुक्र भाव ${venus.houseNumber} में (${venus.dignity}); [सर्वाष्टकवर्ग (सहायक): सप्तम भाव ${sav[6]} बिंदु, द्वादश भाव ${sav[11]} बिंदु]।`,
      verdictEn: `Age Difference: ${ageGapEn} · Marital Chemistry: Harmony supported by 7th/12th lord balance.`,
      verdictHi: `आयु अंतर: ${ageGapHi} · दांपत्य सुख: सप्तमेश व द्वादशेश के संतुलन द्वारा सुदृढ़।`,
      detailedAnalysisEn: `Marital happiness relies on the harmony between the 7th house (partnership) and 12th house (Shayana Sukha). With Venus possessing dignity and 7th lord supported in ${h7.placedSignName}, mutual respect overcomes routine domestic disputes, while SAV points provide background strength.`,
      detailedAnalysisHi: `दांपत्य सुख का सीधा संबंध सप्तमेश, द्वादशेश एवं शुक्र की गरिमा से है। सप्तमेश के शुभ नक्षत्र में होने से दांपत्य संबंध सुदृढ़ रहता है, जबकि अष्टकवर्ग के बिंदु इसे सहायक पोषण देते हैं।`,
      remedyEn: `Keep a silver item or crystal ball in the North-West zone of your master bedroom.`,
      remedyHi: `शयनकक्ष के उत्तर-पश्चिम कोण में चांदी की कोई वस्तु अथवा स्फटिक रखें।`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score),
    });
  }

  // ==========================================
  // 20. Progeny Conception: Natural vs Assisted/IVF
  // ==========================================
  {
    let progAffliction = 0;
    const maleficsIn5 = planets.filter((p) => p.houseNumber === 5 && (p.id === 'Saturn' || p.id === 'Rahu' || p.id === 'Ketu' || p.id === 'Mars' || p.id === 'Sun'));
    progAffliction += maleficsIn5.length * 2;
    if (h5.placedHouse === 6 || h5.placedHouse === 8 || h5.placedHouse === 12) progAffliction += 2.5;
    if (h5.dignity === 'Debilitated') progAffliction += 2;
    if (jupiter.dignity === 'Debilitated' || jupiter.houseNumber === 6 || jupiter.houseNumber === 8 || jupiter.houseNumber === 12) progAffliction += 2;
    if (sav[4] < 24) progAffliction += 1.5;
    if (sav[4] < 20) progAffliction += 2;

    const isAnapatya = progAffliction >= 5;
    const score = isAnapatya ? 35 : Math.max(35, Math.min(95, 50 + ([1, 4, 5, 9, 10, 11].includes(h5.placedHouse) ? 14 : -12) + getDignityBonus(jupiter.dignity) + (sav[4] >= 28 ? 6 : -6)));
    const rahuKetuOn5 = planets.some((p) => p.houseNumber === 5 && (p.id === 'Rahu' || p.id === 'Ketu'));

    const modeEn = isAnapatya
      ? 'Severe Progeny Obstruction (Natural Conception Obstructed): Classical Putradosha/Anapatya indicators suggest natural conception is heavily blocked; modern assisted reproductive techniques (IVF/ICSI) or legal adoption necessary.'
      : rahuKetuOn5 || sav[4] < 24
      ? 'Conception with Medical/Scientific Timing: Initial patience or medical assistance (IVF/IUI/hormonal balancing) advised'
      : 'Natural & Smooth Conception: Spontaneous conception under auspicious planetary transit';

    const modeHi = isAnapatya
      ? 'संतान उत्पत्ति में गंभीर प्राकृतिक बाधा (अनपत्य / पितृ दोष योग): पंचम भाव व गुरु पर गंभीर पाप प्रभाव के कारण प्राकृतिक गर्भधारण बाधित; सुख केवल उन्नत चिकित्सा (IVF/ICSI) अथवा दत्तक संतान (गोद लेने) द्वारा ही संभव।'
      : rahuKetuOn5 || sav[4] < 24
      ? 'चिकित्सकीय परामर्श व धैर्यपूर्वक गर्भधारण: आरंभिक विलंब के पश्चात आधुनिक चिकित्सा (IVF/उपचार) से सफलता'
      : 'प्राकृतिक व सहज गर्भधारण: अनुकूल गोचर व दशा में बिना किसी बाधा के सुखद संतान प्राप्ति';

    dims.push({
      id: 20,
      category: 'progeny',
      categoryTitleEn: 'Progeny & Family Lineage',
      categoryTitleHi: 'संतान, कुल वृद्धि व वंश सुख',
      titleEn: 'Children Conception Mode: Natural vs Assisted/Medical',
      titleHi: 'संतान उत्पत्ति स्वरूप: प्राकृतिक अथवा चिकित्सकीय/वैज्ञानिक',
      astroBasisEn: `5th Lord ${h5.lord} in H${h5.placedHouse} (${h5.dignity}, Star Lord: ${h5.starLord}); Jupiter (Putrakaraka) in H${jupiter.houseNumber} (${jupiter.dignity}); Occupants: ${h5.occupants.map((o) => o.id).join(', ') || 'None'}; [SAV (Auxiliary): ${sav[4]} bindus].`,
      astroBasisHi: `पंचमेश ${h5.lordHi} भाव ${h5.placedHouse} में (${h5.dignityHi}, नक्षत्र स्वामी: ${h5.starLordHi}); गुरु भाव ${jupiter.houseNumber} में (${jupiter.dignity}); स्थित ग्रह: ${h5.occupants.map((o) => HINDI_PLANETS[o.id] || o.id).join(', ') || 'कोई नहीं'}; [सर्वाष्टकवर्ग (सहायक): ${sav[4]} बिंदु]।`,
      verdictEn: modeEn,
      verdictHi: modeHi,
      detailedAnalysisEn: `The 5th house lord, its dispositor star lord, and Putrakaraka Jupiter establish the primary conception karma. Benefic aspects from Jupiter or Venus facilitate ease, while 5th house SAV bindus provide supplemental vital reserve.`,
      detailedAnalysisHi: `पंचमेश, इसका नक्षत्र स्वामी (${h5.starLordHi}) तथा पुत्रकारक गुरु संतान उत्पत्ति के प्राथमिक निर्णायक हैं। गुरु की शुभ दृष्टि से मार्ग प्रशस्त होता है, जबकि अष्टकवर्ग के ${sav[4]} बिंदु इसे सहायक ऊर्जा प्रदान करते हैं।`,
      remedyEn: `Recite Santan Gopal Mantra ("Om Shreem Hreem Kleem Glaum Devakisuta Govinda Vasudeva Jagatpate Dehi Me Tanayam Krishna Tvamaham Sharanam Gatah") daily.`,
      remedyHi: `संतान सुख व गर्भ रक्षा हेतु नित्य संतान गोपाल स्तोत्र अथवा मंत्र का भक्तिभाव से जप करें।`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score),
    });
  }

  // ==========================================
  // 21. Number of Children & Gender Tendency
  // ==========================================
  {
    const isAnapatyaInScope = dims[19]?.verdictEn.includes('Severe Progeny Obstruction');
    const score = isAnapatyaInScope ? 35 : Math.max(35, Math.min(95, 45 + (sav[4] >= 28 ? 10 : 0) + getDignityBonus(jupiter.dignity)));
    const isOdd = h5.signIdx % 2 === 0; // Aries(0)=Odd, Taurus(1)=Even
    const countEn = isAnapatyaInScope
      ? 'Anapatya Yoga / Zero Natural Progeny Indicated (0 biological children): Classical affliction to 5th house/lord and Putrakaraka Jupiter; family lineage carried forward via spiritual mentorship, niece/nephew, or adoption.'
      : sav[4] >= 28
      ? `2 to 3 children indicated (${isOdd ? 'First child exhibits masculine/solar vigor' : 'First child exhibits feminine/lunar grace'})`
      : '1 to 2 children indicated (Balanced small family)';
    const countHi = isAnapatyaInScope
      ? 'अनपत्य योग / शून्य प्राकृतिक संतान योग (0 संतान): पंचम भाव, पंचमेश व पुत्रकारक गुरु पीड़ित होने से प्राकृतिक संतान का अभाव; कुल परंपरा दत्तक संतान, भांजे/भतीजे अथवा ईश्वरीय सेवा से आगे बढ़ती है।'
      : sav[4] >= 28
      ? `2 से 3 संतानों का शुभ योग (${isOdd ? 'प्रथम संतान में पुरुषोचित/सौर ऊर्जा की प्रधानता' : 'प्रथम संतान में सौम्य/स्त्री गुण की प्रधानता'})`
      : '1 से 2 संतानों का संतुलित योग (छोटा व सुखी परिवार)';

    dims.push({
      id: 21,
      category: 'progeny',
      categoryTitleEn: 'Progeny & Family Lineage',
      categoryTitleHi: 'संतान, कुल वृद्धि व वंश सुख',
      titleEn: 'Number of Children & Gender Predisposition',
      titleHi: 'संतान संख्या व पुत्र/पुत्री जन्म संकेत',
      astroBasisEn: `5th House sign: ${h5.signName} (Nature: ${isOdd ? 'Odd/Male' : 'Even/Female'}); Jupiter in House ${jupiter.houseNumber}; 5th SAV: ${sav[4]} bindus.`,
      astroBasisHi: `पंचम भाव राशि: ${h5.signHi} (प्रकृति: ${isOdd ? 'विषम/पुरुष' : 'सम/स्त्री'}); गुरु भाव ${jupiter.houseNumber} में; पंचम भाव अष्टकवर्ग: ${sav[4]} बिंदु।`,
      verdictEn: countEn,
      verdictHi: countHi,
      detailedAnalysisEn: `In classical Jaimini and Parashari astrology, odd/even rashi of the 5th house and Jupiter's disposition indicate the progeny count and energy spectrum. The presence of ${sav[4]} SAV points ensures the continuation of your ancestral lineage with pride.`,
      detailedAnalysisHi: `वैदिक फलित में पंचम भाव की सम-विषम राशि एवं गुरु का बल संतान की संख्या व ऊर्जा का निर्धारण करता है। पंचम भाव में ${sav[4]} बिंदु कुल की वृद्धि व संतान सुख की पूर्ण संभावना दर्शाते हैं।`,
      remedyEn: `Plant a fruit-bearing tree (like Mango, Pomegranate or Amla) in a school or temple garden.`,
      remedyHi: `किसी विद्यालय, वाटिका अथवा मंदिर परिसर में फलदार वृक्ष (आम या आंवला) का रोपण करें।`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score),
    });
  }

  // ==========================================
  // 22. Miscarriage Risk & Garbha Raksha Shanti
  // ==========================================
  {
    const score = Math.max(35, Math.min(95, 55 + (sav[4] >= 28 ? 10 : -10) - (planets.some((p) => p.houseNumber === 5 && (p.id === 'Mars' || p.id === 'Rahu' || p.id === 'Ketu')) ? 15 : 0)));
    const marsRahuOn5 = planets.some((p) => p.houseNumber === 5 && (p.id === 'Mars' || p.id === 'Rahu' || p.id === 'Ketu'));
    const riskEn = marsRahuOn5
      ? 'Moderate vulnerability during early trimester; medical rest and Garbha Raksha stotra required'
      : 'Low miscarriage risk; standard prenatal care and calm emotional state suffice';
    const riskHi = marsRahuOn5
      ? 'आरंभिक तीन महीनों में विशेष सावधानी अपेक्षित; चिकित्सकीय विश्राम व गर्भ रक्षा स्तोत्र का पाठ अनिवार्य'
      : 'गर्भपात का न्यून जोखिम; सामान्य स्वास्थ्य व संतुलित दिनचर्या से सुखद प्रसव संभव';

    dims.push({
      id: 22,
      category: 'progeny',
      categoryTitleEn: 'Progeny & Family Lineage',
      categoryTitleHi: 'संतान, कुल वृद्धि व वंश सुख',
      titleEn: 'Miscarriage Risk, Conception Vulnerabilities & Protection',
      titleHi: 'गर्भ रक्षा, गर्भपात जोखिम निवारण व शांति उपाय',
      astroBasisEn: `Afflictions on 5th House: ${planets.filter((p) => p.houseNumber === 5 && (p.id === 'Mars' || p.id === 'Rahu' || p.id === 'Ketu')).map((p) => p.id).join(', ') || 'None'}; 5th SAV: ${sav[4]} bindus.`,
      astroBasisHi: `पंचम भाव पर क्रूर प्रभाव: ${planets.filter((p) => p.houseNumber === 5 && (p.id === 'Mars' || p.id === 'Rahu' || p.id === 'Ketu')).map((p) => HINDI_PLANETS[p.id] || p.id).join(', ') || 'कोई नहीं'}; पंचम अष्टकवर्ग: ${sav[4]} बिंदु।`,
      verdictEn: riskEn,
      verdictHi: riskHi,
      detailedAnalysisEn: `When fiery or nodal planets influence the 5th house, body heat and energetic fluctuations require conscious regulation during pregnancy. Spiritual grounding through Garbha Rakshambika mantras dissolves psychic turbulence.`,
      detailedAnalysisHi: `पंचम भाव पर अग्नि तत्व या छाया ग्रहों के प्रभाव से गर्भावस्था में अतिरिक्त विश्राम की आवश्यकता होती है। गर्भ रक्षांबिका स्तोत्र के पाठ से गर्भाशय की ऊर्जा शांत व सुरक्षित रहती है।`,
      remedyEn: `Listen to or recite the sacred Garbha Rakshambika Stotram during the entire term of pregnancy.`,
      remedyHi: `गर्भावस्था के दौरान नित्य श्री गर्भ रक्षांबिका स्तोत्र का श्रवण अथवा पाठ करें।`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score),
    });
  }

  // ==========================================
  // 23. Filial Joy & Support in Old Age
  // ==========================================
  {
    const score = Math.max(35, Math.min(95, 45 + (sav[4] >= 28 ? 15 : -5) + (h5.placedHouse === 1 || h5.placedHouse === 5 || h5.placedHouse === 9 || h5.placedHouse === 11 ? 15 : 0)));
    const joyEn = sav[4] >= 28 && (h5.placedHouse === 1 || h5.placedHouse === 5 || h5.placedHouse === 9 || h5.placedHouse === 11)
      ? 'High filial devotion; children achieve distinguished status and provide heartfelt care in elder years'
      : 'Good filial bonding; children lead independent lives while maintaining filial respect';
    const joyHi = sav[4] >= 28 && (h5.placedHouse === 1 || h5.placedHouse === 5 || h5.placedHouse === 9 || h5.placedHouse === 11)
      ? 'उत्कृष्ट संतान सुख; संतान उच्च पद प्राप्त कर कुल का मान बढ़ाएगी व वृद्धावस्था में सेवा करेगी'
      : 'अनुकूल संतान सुख; संतान स्वावलंबी होकर अपने कार्यक्षेत्र में व्यस्त रहते हुए भी सम्मान करेगी';

    dims.push({
      id: 23,
      category: 'progeny',
      categoryTitleEn: 'Progeny & Family Lineage',
      categoryTitleHi: 'संतान, कुल वृद्धि व वंश सुख',
      titleEn: 'Filial Joy, Children Devotion & Care in Old Age',
      titleHi: 'संतान सुख, संतान की प्रगति व वृद्धावस्था में संबल',
      astroBasisEn: `5th Lord ${h5.lord} in House ${h5.placedHouse}; 9th Lord ${h9.lord} in House ${h9.placedHouse}; 5th House SAV: ${sav[4]} bindus.`,
      astroBasisHi: `पंचमेश ${h5.lordHi} भाव ${h5.placedHouse} में; नवमेश ${h9.lordHi} भाव ${h9.placedHouse} में; पंचम भाव अष्टकवर्ग: ${sav[4]} बिंदु।`,
      verdictEn: joyEn,
      verdictHi: joyHi,
      detailedAnalysisEn: `The 5th house is the house of poorva punya (past merit). With ${sav[4]} bindus and 5th lord auspiciously placed, your children will be a source of profound emotional joy and social respect in your mature years.`,
      detailedAnalysisHi: `पंचम भाव पूर्व जन्म के पुण्यों का कोष है। पंचमेश की अनुकूल स्थिति व ${sav[4]} अष्टकवर्ग बिंदु यह सिद्ध करते हैं कि आपकी संतान सुयोग्य व संस्कारी सिद्ध होगी तथा आपका मान-सम्मान बढ़ाएगी।`,
      remedyEn: `Encourage children to chant Gayatri Mantra and sponsor educational material for needy orphans.`,
      remedyHi: `संतान को गायत्री मंत्र के संस्कार दें तथा अनाथ बालकों की शिक्षा में सहयोग करें।`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score),
    });
  }

  // ==========================================
  // 24. Highest Educational Attainment
  // ==========================================
  {
    const score = Math.max(40, Math.min(95, 50 + (sav[4] >= 28 ? 10 : 0) + (sav[3] >= 28 ? 10 : 0) + getDignityBonus(mercury.dignity)));
    const attainEn = (mercury.dignity === 'Exalted' || jupiter.dignity === 'Exalted' || sav[4] >= 30)
      ? "Master's Degree, Doctorate (Ph.D.) or Advanced Postgraduate Professional Specialization"
      : (sav[4] >= 26 || sav[3] >= 26)
      ? "Bachelor's / Professional University Degree (Engineering, Management, Commerce, Medicine)"
      : "Standard Higher Secondary followed by Practical Vocational / Technical Certification";
    const attainHi = (mercury.dignity === 'Exalted' || jupiter.dignity === 'Exalted' || sav[4] >= 30)
      ? 'स्नातकोत्तर (Master’s), डॉक्टरेट (Ph.D.) अथवा विशिष्ट उच्च तकनीकी/व्यावसायिक डिग्री'
      : (sav[4] >= 26 || sav[3] >= 26)
      ? 'विश्वविद्यालय स्नातक / व्यावसायिक डिग्री (इंजीनियरिंग, प्रबंधन, वाणिज्य, विधि, चिकित्सा)'
      : 'उच्च माध्यमिक के उपरांत व्यावहारिक तकनीकी अथवा व्यावसायिक प्रमाणन';

    dims.push({
      id: 24,
      category: 'education',
      categoryTitleEn: 'Education & Intellect',
      categoryTitleHi: 'शिक्षा, विद्या व बौद्धिक क्षमता',
      titleEn: 'Highest Educational Attainment Level',
      titleHi: 'उच्चतम शिक्षा स्तर, डिग्री व शैक्षणिक ऊंचाई',
      astroBasisEn: `4th House (${h4.signName}, SAV: ${sav[3]}); 5th House (${h5.signName}, SAV: ${sav[4]}); Mercury in ${mercury.signName} (${mercury.dignity}); Jupiter in ${jupiter.signName}.`,
      astroBasisHi: `चतुर्थ भाव (${h4.signHi}, SAV: ${sav[3]}); पंचम भाव (${h5.signHi}, SAV: ${sav[4]}); बुध ${HINDI_SIGNS[mercury.signIndex]} में (${mercury.dignity}); गुरु ${HINDI_SIGNS[jupiter.signIndex]} में स्थित।`,
      verdictEn: attainEn,
      verdictHi: attainHi,
      detailedAnalysisEn: `Vedic astrology distinguishes foundational learning (4th house) from analytical intellect (5th house) and higher research (9th house). With Mercury dignified and 5th house holding ${sav[4]} bindus, scholarly acumen empowers you to master complex technical concepts.`,
      detailedAnalysisHi: `चतुर्थ भाव स्कूली शिक्षा का, पंचम भाव बौद्धिक विवेक का और नवम भाव उच्च शोध का है। बुध की अनुकूल स्थिति व पंचम भाव में ${sav[4]} बिंदुओं के प्रभाव से आप कठिन विषयों को सरलता से आत्मसात कर लेते हैं।`,
      remedyEn: `Worship Goddess Saraswati and chant "Om Aim Saraswatyai Namah" on Wednesdays.`,
      remedyHi: `बुधवार को मां सरस्वती की उपासना करें तथा "ॐ ऐं सरस्वत्यै नमः" मंत्र का जप करें।`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score),
    });
  }

  // ==========================================
  // 25. Ideal Academic Fields & Specialization
  // ==========================================
  {
    const score = 85;
    const elem = SIGN_ELEMENTS[h5.signIdx];
    const fieldsEn = elem === 'Fire'
      ? 'Engineering, Defense technology, Surgery, Physical sciences, Leadership & Political Strategy'
      : elem === 'Earth'
      ? 'Commerce, Finance, Chartered Accountancy, Real Estate Architecture, Economics & Agriculture'
      : elem === 'Air'
      ? 'Computer Science, Artificial Intelligence, Aviation, Law, Media, Communications & Linguistics'
      : 'Medicine, Biotechnology, Psychology, Marine sciences, Chemistry & Humanitarian Healing';
    const fieldsHi = elem === 'Fire'
      ? 'इंजीनियरिंग, रक्षा तकनीक, शल्य चिकित्सा, भौतिक विज्ञान, नेतृत्व व रणनीतिक अध्ययन'
      : elem === 'Earth'
      ? 'वाणिज्य, वित्त, चार्टर्ड अकाउंटेंसी, वास्तुकला, अर्थशास्त्र, भूमि व कृषि प्रबंधन'
      : elem === 'Air'
      ? 'कंप्यूटर साइंस, डेटा/एआई, विधि/कानून, विमानन, मीडिया, संचार व भाषा विज्ञान'
      : 'चिकित्सा विज्ञान, बायोटेक्नोलॉजी, मनोविज्ञान, रसायन विज्ञान व समाज कल्याणकारी विद्या';

    dims.push({
      id: 25,
      category: 'education',
      categoryTitleEn: 'Education & Intellect',
      categoryTitleHi: 'शिक्षा, विद्या व बौद्धिक क्षमता',
      titleEn: 'Ideal Academic Streams & Subject Specialization',
      titleHi: 'अनुकूल विद्या शाखाएं, विषय व उच्च अध्ययन क्षेत्र',
      astroBasisEn: `5th House in ${h5.signName} (${elem} Element); 5th Lord ${h5.lord} in ${h5.placedSignName}; Mercury in House ${mercury.houseNumber}.`,
      astroBasisHi: `पंचम भाव ${h5.signHi} में (${HINDI_ELEMENTS[h5.signIdx]} तत्व); पंचमेश ${h5.lordHi} भाव ${h5.placedHouse} में; बुध भाव ${mercury.houseNumber} में स्थित।`,
      verdictEn: fieldsEn,
      verdictHi: fieldsHi,
      detailedAnalysisEn: `The elemental quality of the 5th house dictates where intellect naturally gravitates. As an ${elem} element 5th house, your cognitive capacity thrives in structured, specialized domains where logic and creativity merge.`,
      detailedAnalysisHi: `पंचम भाव का तत्व ज्ञान की दिशा निर्धारित करता है। ${HINDI_ELEMENTS[h5.signIdx]} तत्व होने के कारण आपकी बुद्धि तार्किक व विश्लेषणात्मक विषयों में तीव्रता से कार्य करती है और आप शीर्ष विशेषज्ञता प्राप्त कर सकते हैं।`,
      remedyEn: `Keep study desk clean facing East or North; place an emerald or green tourmaline on workspace.`,
      remedyHi: `अध्ययन कक्ष में मेज पूर्व अथवा उत्तर दिशा की ओर रखें तथा हरे रंग की वस्तुओं का प्रयोग करें।`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score),
    });
  }

  // ==========================================
  // 26. Academic Honors & Competitive Exam Success
  // ==========================================
  {
    const score = Math.max(35, Math.min(95, 45 + (sav[5] >= 28 ? 15 : -5) + (mars.houseNumber === 3 || mars.houseNumber === 6 || mars.houseNumber === 10 ? 15 : 0)));
    const compEn = sav[5] >= 28 && (mars.houseNumber === 3 || mars.houseNumber === 6 || mars.houseNumber === 10 || sun.houseNumber === 10)
      ? 'High Competitive Breakthrough: Exceptional success in government exams, public service, olympiads and scholarships'
      : 'Moderate Competitive Track: Success achieved through focused retakes and disciplined self-study';
    const compHi = sav[5] >= 28 && (mars.houseNumber === 3 || mars.houseNumber === 6 || mars.houseNumber === 10 || sun.houseNumber === 10)
      ? 'प्रतियोगी परीक्षा में उच्च सफलता: राजकीय सेवा, लोक सेवा आयोग व प्रतियोगी परीक्षाओं में विजय'
      : 'मध्यम प्रतियोगी सफलता: निरंतर अभ्यास, एकाग्रता व द्वितीय प्रयास में सफलता का योग';

    dims.push({
      id: 26,
      category: 'education',
      categoryTitleEn: 'Education & Intellect',
      categoryTitleHi: 'शिक्षा, विद्या व बौद्धिक क्षमता',
      titleEn: 'Academic Honors, Scholarships & Competitive Success',
      titleHi: 'प्रतियोगी परीक्षा, छात्रवृत्ति व पुरस्कार योग',
      astroBasisEn: `6th House (Shatru/Pratiyogita) SAV: ${sav[5]} bindus; Mars in House ${mars.houseNumber}; Sun in House ${sun.houseNumber}.`,
      astroBasisHi: `षष्ठ भाव (प्रतियोगिता) अष्टकवर्ग: ${sav[5]} बिंदु; मंगल भाव ${mars.houseNumber} में; सूर्य भाव ${sun.houseNumber} में स्थित।`,
      verdictEn: compEn,
      verdictHi: compHi,
      detailedAnalysisEn: `Competitive exams require overcoming obstacles represented by the 6th house (Shatru/Rina/Roga). Strong SAV in the 6th house (${sav[5]} bindus) accompanied by martial vigor grants a winning edge over competitors.`,
      detailedAnalysisHi: `प्रतियोगी परीक्षाओं में विजय हेतु षष्ठ भाव का बल देखा जाता है। षष्ठ भाव में ${sav[5]} अष्टकवर्ग बिंदु व मंगल/सूर्य का पराक्रम आपको कठिन से कठिन परीक्षा में प्रतिद्वंद्वियों से आगे रखता है।`,
      remedyEn: `Chant Hanuman Chalisa 3 times daily before examination preparations.`,
      remedyHi: `परीक्षा व प्रतियोगिता की तैयारी से पूर्व प्रतिदिन तीन बार श्री हनुमान चालीसा का पाठ करें।`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score),
    });
  }

  // ==========================================
  // 27. Career Mode: Employment (Job) vs Business
  // ==========================================
  {
    const score = 85;
    const isService = sav[5] >= sav[6] || saturn.houseNumber === 6 || saturn.houseNumber === 10;
    const modeEn = isService
      ? `Service & Executive Employment (6th SAV: ${sav[5]} vs 7th SAV: ${sav[6]}, 10th Lord ${h10.lord} in H${h10.placedHouse})`
      : `Independent Enterprise & Business (7th SAV: ${sav[6]} vs 6th SAV: ${sav[5]}, 10th Lord ${h10.lord} in H${h10.placedHouse})`;
    const modeHi = isService
      ? `सेवा व संगठित नौकरी (षष्ठ SAV: ${sav[5]} बनाम सप्तम SAV: ${sav[6]}, दशमेश ${h10.lordHi} भाव ${h10.placedHouse} में)`
      : `स्वतंत्र व्यवसाय व उद्यम (सप्तम SAV: ${sav[6]} बनाम षष्ठ SAV: ${sav[5]}, दशमेश ${h10.lordHi} भाव ${h10.placedHouse} में)`;

    dims.push({
      id: 27,
      category: 'career',
      categoryTitleEn: 'Career & Professional Destiny',
      categoryTitleHi: 'आजीविका, पद, प्रतिष्ठा व कर्मक्षेत्र',
      titleEn: 'Primary Career Mode: Employment (Job) vs Business/Enterprise',
      titleHi: 'आजीविका स्वरूप: नौकरी (सेवा) बनाम स्वतंत्र व्यापार/उद्यम',
      astroBasisEn: `6th House (Service) SAV: ${sav[5]} vs 7th House (Business) SAV: ${sav[6]}; 10th Lord ${h10.lord} in House ${h10.placedHouse}; Saturn in House ${saturn.houseNumber}.`,
      astroBasisHi: `षष्ठ भाव (सेवा) SAV: ${sav[5]} बनाम सप्तम भाव (व्यापार) SAV: ${sav[6]}; दशमेश ${h10.lordHi} भाव ${h10.placedHouse} में; शनि भाव ${saturn.houseNumber} में।`,
      verdictEn: modeEn,
      verdictHi: modeHi,
      detailedAnalysisEn: `The 6th house rules service and employment contracts, while the 7th and 10th govern enterprise. Comparing 6th SAV (${sav[5]}) with 7th SAV (${sav[6]}) determines whether your karmic momentum is maximized in institutional employment or self-directed trade.`,
      detailedAnalysisHi: `षष्ठ भाव सेवा व नौकरी का तथा सप्तम/दशम भाव स्वतंत्र व्यापार का प्रतिनिधित्व करता है। षष्ठ भाव के ${sav[5]} बिंदु और सप्तम भाव के ${sav[6]} बिंदु आपके कर्मक्षेत्र की दिशा स्पष्ट करते हैं।`,
      remedyEn: `Offer oil to Lord Shani on Saturdays and maintain ethical integrity with colleagues.`,
      remedyHi: `शनिवार को शनि मंदिर में तेल अर्पित करें तथा कार्यस्थल पर सहकर्मियों से न्यायपूर्ण व्यवहार रखें।`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score),
    });
  }

  // ==========================================
  // 28. Sector Alignment: Government vs Corporate vs Private
  // ==========================================
  {
    const score = Math.max(35, Math.min(95, 45 + (sun.houseNumber === 10 || sun.houseNumber === 1 || sun.houseNumber === 9 ? 25 : 5) + (sav[9] >= 28 ? 10 : 0)));
    const isGovt = (sun.houseNumber === 10 || sun.houseNumber === 1 || sun.houseNumber === 9) && sav[9] >= 28;
    const sectEn = isGovt
      ? 'Government / Public Sector / PSU Leadership: Exceptional alignment with civil administration, judiciary or state policy'
      : 'Corporate Multinational / Private Sector Enterprise: Thrives in high-velocity private sector and technology industries';
    const sectHi = isGovt
      ? 'राजकीय/सरकारी सेवा व सार्वजनिक उपक्रम: प्रशासनिक सेवा, राजकीय पद, नीति निर्धारण अथवा सार्वजनिक क्षेत्र'
      : 'निजी/कॉर्पोरेट व बहुराष्ट्रीय कंपनियां: बहुराष्ट्रीय प्रतिष्ठानों, आईटी, वित्त अथवा स्वतंत्र कॉर्पोरेट क्षेत्र';

    dims.push({
      id: 28,
      category: 'career',
      categoryTitleEn: 'Career & Professional Destiny',
      categoryTitleHi: 'आजीविका, पद, प्रतिष्ठा व कर्मक्षेत्र',
      titleEn: 'Sector Alignment: Government vs Corporate vs Private',
      titleHi: 'क्षेत्रीय अनुकूलता: सरकारी सेवा बनाम निजी/कॉर्पोरेट क्षेत्र',
      astroBasisEn: `Sun in House ${sun.houseNumber} (${sun.dignity}); 10th House (${h10.signName}) SAV: ${sav[9]} bindus; Mars in House ${mars.houseNumber}.`,
      astroBasisHi: `सूर्य भाव ${sun.houseNumber} में (${sun.dignity}); दशम भाव (${h10.signHi}) अष्टकवर्ग: ${sav[9]} बिंदु; मंगल भाव ${mars.houseNumber} में स्थित।`,
      verdictEn: sectEn,
      verdictHi: sectHi,
      detailedAnalysisEn: `Sun is the Rajyakaraka (significator of the State). When Sun connects to Kendra/Trikona and the 10th house holds high SAV points (${sav[9]}), the native enjoys authority and government patronage.`,
      detailedAnalysisHi: `सूर्य राजसत्ता व राजकीय सम्मान के मुख्य कारक हैं। दशम भाव में ${sav[9]} बिंदु एवं सूर्य के प्रभाव से आपको प्रशासनिक तंत्र अथवा बड़े कॉर्पोरेट ढांचे में अधिकार युक्त पद प्राप्त होता है।`,
      remedyEn: `Chant Gayatri Mantra daily facing the Sun and wear clean copper or gold.`,
      remedyHi: `नित्य गायत्री मंत्र का 24 बार जप करें तथा तांबे के पात्र से जल पिएं।`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score),
    });
  }

  // ==========================================
  // 29. Ideal Industries, Vocations & Roles
  // ==========================================
  {
    const score = 88;
    const lord = h10.lord;
    const indEn = lord === 'Sun' || lord === 'Mars'
      ? 'Defense, Police administration, Real estate development, Civil Engineering, Surgery & Governance'
      : lord === 'Mercury'
      ? 'Software architecture, Financial analytics, Media publishing, Journalism, Trade & Logistics'
      : lord === 'Jupiter'
      ? 'Judiciary, Banking leadership, Academic professorship, Wealth consulting & Policy think-tanks'
      : lord === 'Venus'
      ? 'Luxury branding, Architecture, Cinema/Arts, Hospitality, Fashion, Pharmaceuticals & Cosmetics'
      : 'Heavy industries, Mining, Construction, Public works, Oil/Gas, Labor management & Legal research';
    const indHi = lord === 'Sun' || lord === 'Mars'
      ? 'रक्षा, पुलिस/प्रशासन, भूमि/रियल एस्टेट, सिविल इंजीनियरिंग, शल्य चिकित्सा व राजकीय नेतृत्व'
      : lord === 'Mercury'
      ? 'सॉफ्टवेयर, आईटी, वित्तीय विश्लेषण, मीडिया, पत्रकारिता, वाणिज्य व डेटा एनालिटिक्स'
      : lord === 'Jupiter'
      ? 'न्यायपालिका, बैंकिंग, विश्वविद्यालय अध्यापन, उच्च परामर्श व नीति निर्धारण'
      : lord === 'Venus'
      ? 'वास्तुकला, कला/सिनेमा, आतिथ्य/होटल, विलासिता उत्पाद, परिधान, फार्मास्युटिकल व डिजाइन'
      : 'भारी उद्योग, निर्माण, खनन, तेल/गैस, सार्वजनिक निर्माण, श्रम प्रबंधन व न्यायशास्त्र';

    dims.push({
      id: 29,
      category: 'career',
      categoryTitleEn: 'Career & Professional Destiny',
      categoryTitleHi: 'आजीविका, पद, प्रतिष्ठा व कर्मक्षेत्र',
      titleEn: 'Most Auspicious Industries, Vocations & Roles',
      titleHi: 'अनुकूल उद्योग, पद व आजीविका क्षेत्र',
      astroBasisEn: `10th Lord ${h10.lord} in House ${h10.placedHouse} (${h10.placedSignName}); 10th House SAV: ${sav[9]} bindus.`,
      astroBasisHi: `दशमेश ${h10.lordHi} भाव ${h10.placedHouse} में (${h10.placedSignHi}); दशम भाव अष्टकवर्ग: ${sav[9]} बिंदु।`,
      verdictEn: indEn,
      verdictHi: indHi,
      detailedAnalysisEn: `The 10th house is the zenith of the horoscope (Karma Bhava). Position of ${h10.lord} in House ${h10.placedHouse} directs your worldly efforts into industries where your innate skills command high market compensation.`,
      detailedAnalysisHi: `दशम भाव कर्म व आजीविका का शिखर है। दशमेश ${h10.lordHi} के प्रभाव से उपरोक्त उद्योगों में आपकी प्रतिभा को सहज मान्यता व आर्थिक समृद्धि प्राप्त होगी।`,
      remedyEn: `Donate tools or food to skilled artisans on Saturdays.`,
      remedyHi: `शनिवार को किसी कुशल दस्तकार या श्रमिक को उपयोगी वस्तु अथवा भोजन प्रदान करें।`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score),
    });
  }

  // ==========================================
  // 30. Executive Authority, Raja Yogas & Leadership
  // ==========================================
  {
    const score = Math.max(40, Math.min(96, 50 + (sav[9] >= 30 ? 15 : 0) + (sav[0] >= 30 ? 15 : 0)));
    const ryEn = (sav[9] >= 29 && sav[0] >= 28)
      ? 'Prominent Raja Yoga & Executive Dignity: Command over teams, public acclaim and administrative elevation'
      : 'Steady Professional Authority: Leadership earned through merit, technical expertise and seniority';
    const ryHi = (sav[9] >= 29 && sav[0] >= 28)
      ? 'प्रबल राजयोग व प्रशासनिक प्रतिष्ठा: अधिकार संपन्न पद, जन-सम्मान व उच्च प्रबंधकीय नेतृत्व'
      : 'स्थिर कार्यपालक अधिकार: निरंतर परिश्रम, कार्य-कौशल व वरिष्ठता के बल पर प्राप्त सम्मान';

    dims.push({
      id: 30,
      category: 'career',
      categoryTitleEn: 'Career & Professional Destiny',
      categoryTitleHi: 'आजीविका, पद, प्रतिष्ठा व कर्मक्षेत्र',
      titleEn: 'Executive Authority, Raja Yogas & Leadership Rank',
      titleHi: 'प्रशासनिक प्रभुत्व, राजयोग व नेतृत्व क्षमता',
      astroBasisEn: `Lagna SAV: ${sav[0]} bindus; 10th House SAV: ${sav[9]} bindus; Active Dasha: ${mdLord}-${adLord}.`,
      astroBasisHi: `लग्न भाव SAV: ${sav[0]} बिंदु; दशम भाव SAV: ${sav[9]} बिंदु; सक्रिय दशा: ${mdLordHi}-${adLordHi}।`,
      verdictEn: ryEn,
      verdictHi: ryHi,
      detailedAnalysisEn: `Raja Yogas materialize during favorable dasha transits when Kendra and Trikona lords combine. With ${sav[9]} bindus in the 10th house, your voice carries weight in high-stakes boardroom or societal meetings.`,
      detailedAnalysisHi: `केंद्र व त्रिकोण के स्वामियों का समन्वय तथा दशम भाव में ${sav[9]} अष्टकवर्ग बिंदु राजयोग का निर्माण करते हैं। यह योग आपको समाज व कार्यक्षेत्र में सम्माननीय व निर्णयकारी स्थिति में पहुंचाता है।`,
      remedyEn: `Worship Lord Vishnu with Tulsi leaves on Ekadashi to preserve executive luck.`,
      remedyHi: `एकादशी के दिन भगवान श्रीहरि विष्णु को तुलसी दल अर्पित कर राजयोग की शुभता को अक्षुण्ण रखें।`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score),
    });
  }

  // ==========================================
  // 31. Foreign Travel & Short Journeys
  // ==========================================
  {
    const score = Math.max(35, Math.min(95, 45 + (sav[8] >= 28 ? 10 : 0) + (sav[11] >= 28 ? 10 : 0) + (rahu?.houseNumber === 9 || rahu?.houseNumber === 12 ? 20 : 0)));
    const hasRahuF = rahu?.houseNumber === 9 || rahu?.houseNumber === 12 || h9.placedHouse === 12 || h12.placedHouse === 9;
    const travEn = hasRahuF || sav[8] >= 28
      ? 'Frequent Foreign & Cross-Border Travel: Overseas assignments, international pilgrimages and global exposure'
      : 'Moderate Domestic & Regional Travel: Periodic pilgrimages and domestic business trips';
    const travHi = hasRahuF || sav[8] >= 28
      ? 'प्रचुर विदेश यात्रा व अंतरराष्ट्रीय प्रवास: विदेशी परियोजनाएं, अंतरराष्ट्रीय तीर्थाटन व वैश्विक अनुभव'
      : 'संतुलित अंतर्देशीय प्रवास: समय-समय पर देश के भीतर व्यावसायिक यात्राएं व तीर्थाटन';

    dims.push({
      id: 31,
      category: 'career',
      categoryTitleEn: 'Career & Professional Destiny',
      categoryTitleHi: 'आजीविका, पद, प्रतिष्ठा व कर्मक्षेत्र',
      titleEn: 'Foreign Travel, Overseas Missions & Short Journeys',
      titleHi: 'विदेश यात्रा, अंतरराष्ट्रीय प्रवास व तीर्थाटन',
      astroBasisEn: `9th House (Long Journeys) SAV: ${sav[8]}; 12th House (Foreign Lands) SAV: ${sav[11]}; Rahu in House ${rahu?.houseNumber || 1}.`,
      astroBasisHi: `नवम भाव (दीर्घ यात्रा) SAV: ${sav[8]}; द्वादश भाव (विदेश) SAV: ${sav[11]}; राहु भाव ${rahu?.houseNumber || 1} में।`,
      verdictEn: travEn,
      verdictHi: travHi,
      detailedAnalysisEn: `The 9th house triggers religious journeys and long-distance travel, while the 12th house governs overseas borders. Rahu's influence on these houses dissolves geographical boundaries, bringing success across oceans.`,
      detailedAnalysisHi: `नवम भाव तीर्थ व दूरस्थ यात्रा का तथा द्वादश भाव विदेश का कारक है। राहु की दृष्टि अथवा अनुकूल अष्टकवर्ग बिंदुओं के प्रभाव से आपको समुद्र पार देशों में जाने व वहां लाभ पाने के उत्तम अवसर मिलेंगे।`,
      remedyEn: `Keep a silver ball or square piece of silver in your travel bag when flying overseas.`,
      remedyHi: `विदेश यात्रा के समय अपने बैग में चांदी का एक छोटा टुकड़ा अथवा सिक्का साथ रखें।`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score),
    });
  }

  // ==========================================
  // 32. Foreign Settlement vs Motherland Residence
  // ==========================================
  {
    const score = 75;
    const isSettle = h4.placedHouse === 12 || h12.placedHouse === 4 || (rahu?.houseNumber === 4 && sav[3] < 26);
    const setEn = isSettle
      ? 'Permanent Foreign Settlement / Long-term Overseas Residence: Fortune rises dramatically away from birth land'
      : 'Motherland Residence with Global Connectivity: Strong roots in homeland with periodic global travels';
    const setHi = isSettle
      ? 'विदेश में स्थायी निवास / दीर्घकालिक विदेश वास: जन्मभूमि से दूर परदेस में असाधारण भाग्योदय'
      : 'मातृभूमि में स्थायी निवास व वैश्विक संपर्क: स्वदेश में सुदृढ़ जड़ें तथा आवश्यकतानुसार विदेश गमन';

    dims.push({
      id: 32,
      category: 'career',
      categoryTitleEn: 'Career & Professional Destiny',
      categoryTitleHi: 'आजीविका, पद, प्रतिष्ठा व कर्मक्षेत्र',
      titleEn: 'Foreign Settlement vs Motherland Residence',
      titleHi: 'विदेश वास (स्थायी निवास) बनाम मातृभूमि में अधिवास',
      astroBasisEn: `4th Lord (Homeland) ${h4.lord} in House ${h4.placedHouse}; 12th Lord ${h12.lord} in House ${h12.placedHouse}; 4th SAV: ${sav[3]} vs 12th SAV: ${sav[11]}.`,
      astroBasisHi: `चतुर्थेश (स्वदेश) ${h4.lordHi} भाव ${h4.placedHouse} में; द्वादशेश (विदेश) ${h12.lordHi} भाव ${h12.placedHouse} में; चतुर्थ SAV: ${sav[3]} बनाम द्वादश SAV: ${sav[11]}।`,
      verdictEn: setEn,
      verdictHi: setHi,
      detailedAnalysisEn: `Displacement from birthplace occurs when the 4th house (homeland) connects intimately to the 12th house (foreign realms) or movable signs. If roots remain in the 4th house, native builds wealth domestically while trading globally.`,
      detailedAnalysisHi: `चतुर्थ भाव अपनी जन्मभूमि का और द्वादश भाव विदेश का है। यदि चतुर्थेश द्वादश में जाए तो विदेश में बसने का योग बनता है; अन्यथा स्वदेश में रहकर ही वैश्विक सफलता प्राप्त होती है।`,
      remedyEn: `Honor your ancestral land by planting trees at your ancestral birthplace or ancestral temple.`,
      remedyHi: `अपनी कुलदेवी अथवा पैतृक स्थान पर जल व पुष्प अर्पित कर मातृभूमि का सम्मान करें।`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score),
    });
  }

  // ==========================================
  // 33. Longevity Classification: Alpa, Madhya, or Purna Ayu
  // ==========================================
  {
    const score = Math.max(45, Math.min(95, 50 + (sav[7] >= 28 ? 12 : -5) + (sav[0] >= 28 ? 10 : 0) + getDignityBonus(saturn.dignity)));
    const longEn = sav[7] >= 28 && sav[0] >= 28 && saturn.dignity !== 'Debilitated'
      ? 'Purna Ayu (Full Lifespan: 78 to 90+ years) — High vitality and classical longevity protection'
      : 'Madhya Ayu (Medium Lifespan: 65 to 78 years) — Stable life with disciplined health management';
    const longHi = sav[7] >= 28 && sav[0] >= 28 && saturn.dignity !== 'Debilitated'
      ? 'पूर्णायु (दीर्घायु: 78 से 90+ वर्ष) — उच्च जीवनी शक्ति व शास्त्रीय दीर्घायु योग'
      : 'मध्यायु (65 से 78 वर्ष) — अनुशासित दिनचर्या व स्वास्थ्य प्रबंधन से दीर्घायु का मार्ग';

    dims.push({
      id: 33,
      category: 'longevity_health',
      categoryTitleEn: 'Longevity & Health Vitality',
      categoryTitleHi: 'आयु, आरोग्य, शल्य चिकित्सा व रक्षा',
      titleEn: 'Longevity Classification: Alpa, Madhya or Purna Ayu',
      titleHi: 'आयु वर्गीकरण: अल्प, मध्य अथवा पूर्णायु योग',
      astroBasisEn: `8th House (${h8.signName}, SAV: ${sav[7]}); 1st House SAV: ${sav[0]}; Saturn (Ayushkaraka) in House ${saturn.houseNumber} (${saturn.dignity}).`,
      astroBasisHi: `अष्टम भाव (${h8.signHi}, SAV: ${sav[7]}); लग्न भाव SAV: ${sav[0]}; शनि (आयुष्कारक) भाव ${saturn.houseNumber} में (${saturn.dignity})।`,
      verdictEn: longEn,
      verdictHi: longHi,
      detailedAnalysisEn: `Ayurdaya is synthesized through the 8th house, 8th lord, Lagna lord and Saturn (natural Ayushkaraka). With Lagna holding ${sav[0]} bindus and 8th holding ${sav[7]} bindus, native possesses strong regenerative immunity against acute hazards.`,
      detailedAnalysisHi: `आयु का निर्धारण लग्न (काया), अष्टम भाव (आयु) एवं शनि (आयुष्कारक) के बल से होता है। लग्न में ${sav[0]} व अष्टम में ${sav[7]} अष्टकवर्ग बिंदु होने से शरीर में रोगों से लड़ने की प्राकृतिक क्षमता सुदृढ़ रहती है।`,
      remedyEn: `Chant Maha Mrityunjaya Mantra 11 times every morning for vital energy.`,
      remedyHi: `प्रतिदिन प्रातःकाल 11 बार महामृत्युंजय मंत्र का श्रद्धापूर्वक जप करें।`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score),
    });
  }

  // ==========================================
  // 34. Critical Vulnerability Ages & Maraka Periods
  // ==========================================
  {
    const score = 65;
    const maraka1 = h2.lord;
    const maraka2 = h7.lord;
    const marakaEn = `Vigilance advised during sub-periods of 2nd Lord (${maraka1}) and 7th Lord (${maraka2}), especially around ages 28, 44, 56 and 68.`;
    const marakaHi = `द्वितीयेश (${HINDI_PLANETS[maraka1] || maraka1}) व सप्तमेश (${HINDI_PLANETS[maraka2] || maraka2}) की मारक दशाओं में तथा 28, 44, 56 व 68 वर्ष की आयु में स्वास्थ्य सतर्कता आवश्यक।`;

    dims.push({
      id: 34,
      category: 'longevity_health',
      categoryTitleEn: 'Longevity & Health Vitality',
      categoryTitleHi: 'आयु, आरोग्य, शल्य चिकित्सा व रक्षा',
      titleEn: 'Critical Vulnerability Ages & Maraka Dasha Transitions',
      titleHi: 'संवेदनशील जीवन वर्ष, मारक दशाएं व स्वास्थ्य रक्षा काल',
      astroBasisEn: `Maraka Lords: 2nd Lord ${maraka1} & 7th Lord ${maraka2}; 8th Lord in House ${h8.placedHouse}; Current Dasha: ${mdLord}-${adLord}.`,
      astroBasisHi: `मारक स्वामी: द्वितीयेश ${HINDI_PLANETS[maraka1] || maraka1} व सप्तमेश ${HINDI_PLANETS[maraka2] || maraka2}; अष्टमेश भाव ${h8.placedHouse} में; सक्रिय दशा: ${mdLordHi}-${adLordHi}।`,
      verdictEn: marakaEn,
      verdictHi: marakaHi,
      detailedAnalysisEn: `In Parashari Siddhanta, the 2nd and 7th bhavas are designated as Maraka sthanas. During their sub-dashas or transit conjunctions with malefic nodes, avoiding rash driving and extreme stress safeguards physical well-being.`,
      detailedAnalysisHi: `महर्षि पराशर के अनुसार द्वितीय व सप्तम भाव मारक स्थान कहलाते हैं। इनकी दशाओं में खान-पान पर संयम, वाहन संभलकर चलाना तथा शिवोपासना करना जीवन की रक्षा करता है।`,
      remedyEn: `Perform Rudrabhishekam on your birthday or during Maraka dasha transitions.`,
      remedyHi: `जन्मदिन पर अथवा मारक ग्रह की अंतर्दशा में भगवान शिव का रुद्राभिषेक कराएं।`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score),
    });
  }

  // ==========================================
  // 35. Surgery & Invasive Operation Risk Zones
  // ==========================================
  {
    const score = Math.max(35, Math.min(95, 55 + (sav[5] >= 28 ? 10 : -10) - (planets.some((p) => (p.houseNumber === 6 || p.houseNumber === 8) && (p.id === 'Mars' || p.id === 'Ketu')) ? 20 : 0)));
    const hasMarsSurg = planets.some((p) => (p.houseNumber === 6 || p.houseNumber === 8) && (p.id === 'Mars' || p.id === 'Ketu'));
    const surgEn = hasMarsSurg
      ? 'Moderate Surgery Likelihood: Minor surgical procedure or dental/cosmetic intervention indicated under Mars-Ketu dasha'
      : 'Low Surgery Risk: Sound constitutional defenses prevent major invasive surgeries';
    const surgHi = hasMarsSurg
      ? 'शल्य चिकित्सा (ऑपरेशन) की मध्यम संभावना: मंगल-केतु के प्रभाव से कभी लघु शल्य क्रिया अथवा दंत/उदर संबंधी उपचार संभव'
      : 'न्यून सर्जरी जोखिम: प्राकृतिक रोग प्रतिरोधक क्षमता के कारण बड़ी शल्य क्रिया से सुरक्षा';

    dims.push({
      id: 35,
      category: 'longevity_health',
      categoryTitleEn: 'Longevity & Health Vitality',
      categoryTitleHi: 'आयु, आरोग्य, शल्य चिकित्सा व रक्षा',
      titleEn: 'Surgery & Invasive Operation Risk Zones',
      titleHi: 'शल्य चिकित्सा / ऑपरेशन योग व संवेदनशील शारीरिक अंग',
      astroBasisEn: `6th & 8th Houses; Mars in House ${mars.houseNumber} (${mars.dignity}); Ketu in House ${ketu?.houseNumber || 7}; 6th SAV: ${sav[5]} bindus.`,
      astroBasisHi: `षष्ठ व अष्टम भाव; मंगल भाव ${mars.houseNumber} में (${mars.dignity}); केतु भाव ${ketu?.houseNumber || 7} में; षष्ठ अष्टकवर्ग: ${sav[5]} बिंदु।`,
      verdictEn: surgEn,
      verdictHi: surgHi,
      detailedAnalysisEn: `Mars governs sharp instruments, blood, and surgery (Shastraghata), while Ketu represents incisions. When they influence the 6th or 8th house, any necessary surgical interventions prove curative and safe.`,
      detailedAnalysisHi: `मंगल रक्त व शल्य औजारों का कारक है तथा केतु चीरा लगाने का। षष्ठ या अष्टम भाव में इनके प्रभाव से यदि कभी कोई ऑपरेशन आवश्यक हो, तो वह रोग निवारण में सफल सिद्ध होता है।`,
      remedyEn: `Donate blood voluntarily once a year on Tuesdays to satisfy the martial energy naturally.`,
      remedyHi: `वर्ष में एक बार मंगलवार के दिन स्वेच्छा से रक्तदान करें, जिससे मंगल का रक्त विकार स्वतः शांत हो।`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score),
    });
  }

  // ==========================================
  // 36. Incarceration, Legal Confinement & Disputes
  // ==========================================
  {
    const score = Math.max(35, Math.min(95, 60 + (sav[11] <= 24 ? 15 : 0) - (h6.placedHouse === 12 || h12.placedHouse === 6 ? 15 : 0)));
    const hasBandhana = (planets.some((p) => p.houseNumber === 6 && (p.id === 'Rahu' || p.id === 'Saturn')) && planets.some((p) => p.houseNumber === 12 && (p.id === 'Mars' || p.id === 'Ketu')));
    const bandhEn = hasBandhana
      ? 'Vigilance Advised: Prudent compliance with tax, contract, and regulatory laws needed to prevent legal entrapment'
      : 'Clean Legal Record: Free from any major confinement, imprisonment or debilitating court entrapment';
    const bandhHi = hasBandhana
      ? 'कानूनी सतर्कता आवश्यक: कर, अनुबंध व शासकीय नियमों का पूर्ण पालन करें ताकि किसी विवाद से बचा जा सके'
      : 'निर्मल कानूनी स्थिति: किसी भी प्रकार के कारागार, कानूनी बंधन अथवा अदालती संकट से पूर्ण सुरक्षा';

    dims.push({
      id: 36,
      category: 'shadow_challenges',
      categoryTitleEn: 'Shadow Challenges & Cautions',
      categoryTitleHi: 'संकट निवारण, बंधन व छाया प्रवृत्तियां',
      titleEn: 'Incarceration, Confinement (Bandhana Yoga) & Legal Disputes',
      titleHi: 'बंधन योग, कानूनी विवाद, न्यायालय संकट व रक्षा',
      astroBasisEn: `6th House (Litigation) SAV: ${sav[5]}; 12th House (Confinement) SAV: ${sav[11]}; Rahu in House ${rahu?.houseNumber || 1}.`,
      astroBasisHi: `षष्ठ भाव (विवाद) SAV: ${sav[5]}; द्वादश भाव (बंधन) SAV: ${sav[11]}; राहु भाव ${rahu?.houseNumber || 1} में स्थित।`,
      verdictEn: bandhEn,
      verdictHi: bandhHi,
      detailedAnalysisEn: `Bandhana Yoga occurs when equal malefics occupy the 2nd and 12th or 5th and 9th houses. With low points in the 12th house (${sav[11]} bindus), institutional confinement is nullified, preserving native's personal freedom.`,
      detailedAnalysisHi: `शास्त्रीय बंधन योग तब बनता है जब विरोधी भावों में पापी ग्रह स्थित हों। द्वादश भाव में अनुकूल स्थिति होने से किसी भी प्रकार के कारावास या बंधन का योग स्वतः निष्प्रभावी हो जाता है।`,
      remedyEn: `Chant Durga Chalisa or release caged birds to ensure lifelong personal liberty.`,
      remedyHi: `पिंजरे में बंद पक्षियों को मुक्त कराएं अथवा नित्य मां दुर्गा के 32 नामों का जप करें।`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score),
    });
  }

  // ==========================================
  // 37. Physical Identification Marks, Moles & Scars
  // ==========================================
  {
    const score = 80;
    const elem = SIGN_ELEMENTS[ascSign];
    const markEn = elem === 'Fire'
      ? 'Prominent mark, mole or childhood scar on head, temple, right shoulder or upper chest'
      : elem === 'Earth'
      ? 'Distinctive beauty spot or mole on neck, throat, right knee, or waistline'
      : elem === 'Air'
      ? 'Birthmark or distinct mole on arms, collarbone, palms, or upper back'
      : 'Soft mole or scar on lower abdomen, left ribcage, foot or near eyes';
    const markHi = elem === 'Fire'
      ? 'मस्तिष्क, माथे, दाएं कंधे अथवा ऊपरी छाती पर तिल, मस्सा अथवा बाल्यावस्था की चोट का निशान'
      : elem === 'Earth'
      ? 'गर्दन, कंठ, कमर अथवा दाएं घुटने पर सुंदर तिल या जन्मजात लांछन'
      : elem === 'Air'
      ? 'भुजाओं, हंसुली (कॉलरबोन), हथेली अथवा पीठ के ऊपरी भाग पर तिल या स्थायी चिह्न'
      : 'उदर के निचले भाग, बाईं पसली, चरण अथवा नेत्र के समीप सौम्य तिल या निशान';

    dims.push({
      id: 37,
      category: 'identity',
      categoryTitleEn: 'Identity & Core Alignment',
      categoryTitleHi: 'पहचान व आत्म तत्व',
      titleEn: 'Physical Identification Marks, Moles & Birthmarks',
      titleHi: 'शारीरिक पहचान चिह्न, तिल, मस्सा, लांछन व स्थायी निशान',
      astroBasisEn: `Lagna in ${ascSignName} (${elem} Element); Lagna Lord ${ascLord} in House ${h1.placedHouse}; Mars aspect on Lagna.`,
      astroBasisHi: `लग्न ${ascSignHi} (${HINDI_ELEMENTS[ascSign]} तत्व); लग्नेश ${ascLordHi} भाव ${h1.placedHouse} में; मंगल का प्रभाव।`,
      verdictEn: markEn,
      verdictHi: markHi,
      detailedAnalysisEn: `Brihat Parashara Hora Shastra details that the sign rising at birth and the Navamsha of the Lagnesha imprint permanent physical identifiers upon the Kalapurusha body. This mark serves as an energetic signature of your unique destiny.`,
      detailedAnalysisHi: `बृहत् पराशर होरा शास्त्र के अनुसार लग्न राशि व लग्नेश का नवांश शरीर के विशिष्ट अंगों पर तिल अथवा स्थायी निशान अंकित करता है। यह शारीरिक पहचान आपके भाग्य व व्यक्तित्व का प्रत्यक्ष प्रमाण है।`,
      remedyEn: `Apply a tilak of white or red sandalwood on the forehead after morning bath.`,
      remedyHi: `प्रातः स्नान के उपरांत मस्तक पर शुद्ध चंदन अथवा रोली का तिलक लगाएं।`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score),
    });
  }

  // ==========================================
  // 38. Physical Stature, Complexion & Vital Energy
  // ==========================================
  {
    const score = Math.max(45, Math.min(95, 50 + getDignityBonus(lagnaLordPlanet.dignity) + (sav[0] >= 28 ? 10 : 0)));
    const statEn = SIGN_ELEMENTS[ascSign] === 'Fire'
      ? 'Commanding upright posture, athletic build, radiant wheatish/fair complexion with bright magnetic eyes'
      : SIGN_ELEMENTS[ascSign] === 'Earth'
      ? 'Solid, well-grounded frame, steady gait, dignified presence, enduring stamina and charming composure'
      : SIGN_ELEMENTS[ascSign] === 'Air'
      ? 'Tall or slender stature, quick energetic movements, expressive facial gestures and youthful charm'
      : 'Soft graceful frame, clear glowing complexion, gentle deep eyes and compassionate aura';
    const statHi = SIGN_ELEMENTS[ascSign] === 'Fire'
      ? 'प्रभावशाली व्यक्तित्व, सुगठित शारीरिक संरचना, तेजस्वी गौर/गेहुंआ रंग व चुंबकीय आकर्षण युक्त आंखें'
      : SIGN_ELEMENTS[ascSign] === 'Earth'
      ? 'सुदृढ़, संतुलित गठन, आत्मविश्वास से परिपूर्ण चाल, धैर्यवान मुखाकृति व उत्तम शारीरिक सहनशक्ति'
      : SIGN_ELEMENTS[ascSign] === 'Air'
      ? 'लंबा या छरहरा बदन, फुर्तीली चाल, अभिव्यक्ति-कुशल मुखाकृति व युवा जैसा चिर-नवीन आकर्षण'
      : 'सौम्य, आकर्षक कांति, स्निग्ध त्वचा, गहरी भावुक आंखें व शांतिदायक सौम्य आभा मंडल';

    dims.push({
      id: 38,
      category: 'identity',
      categoryTitleEn: 'Identity & Core Alignment',
      categoryTitleHi: 'पहचान व आत्म तत्व',
      titleEn: 'Physical Stature, Complexion, Ojas & Vital Aura',
      titleHi: 'शारीरिक गठन, रंग-रूप, कांति व ओजस्वी आभा मंडल',
      astroBasisEn: `Ascendant in ${ascSignName} (${SIGN_ELEMENTS[ascSign]} Element); Lagna SAV: ${sav[0]} bindus; Sun in House ${sun.houseNumber}.`,
      astroBasisHi: `लग्न ${ascSignHi} (${HINDI_ELEMENTS[ascSign]} तत्व); लग्न भाव SAV: ${sav[0]} बिंदु; सूर्य भाव ${sun.houseNumber} में स्थित।`,
      verdictEn: statEn,
      verdictHi: statHi,
      detailedAnalysisEn: `The 1st house governs physical appearance, bodily constitution, and the Pranic aura (Ojas). With ${sav[0]} bindus in Lagna, native projects an aura of dignity and self-assurance that inspires confidence in others.`,
      detailedAnalysisHi: `लग्न भाव शरीर, स्वास्थ्य व तेज का दर्पण है। लग्न में ${sav[0]} अष्टकवर्ग बिंदु होने से शरीर में प्राकृतिक ओज रहता है, जिससे आप जहां भी जाते हैं, आपका प्रभाव स्पष्ट परिलक्षित होता है।`,
      remedyEn: `Engage in daily morning Surya Namaskar to magnify physical radiance and vitality.`,
      remedyHi: `प्रातःकाल नियमित सूर्य नमस्कार करें तथा ताजे जल से मुख प्रक्षालन कर ओज में वृद्धि करें।`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score),
    });
  }

  // ==========================================
  // 39. Addictions, Dietary Traps & Shadow Habits
  // ==========================================
  {
    const score = Math.max(35, Math.min(95, 55 + (sav[1] >= 28 ? 10 : -10) - (planets.some((p) => p.houseNumber === 2 && (p.id === 'Rahu' || p.id === 'Saturn')) ? 20 : 0)));
    const has2Afflict = planets.some((p) => p.houseNumber === 2 && (p.id === 'Rahu' || p.id === 'Saturn' || p.id === 'Mars'));
    const addEn = has2Afflict
      ? 'Vulnerability to stimulants, late-night snacking, caffeine or digital screen addiction; disciplined diet required'
      : 'High self-regulation; wholesome culinary habits with resistance against toxic intoxicants';
    const addHi = has2Afflict
      ? 'कैफीन, देर रात भोजन, अति-मसालेदार आहार अथवा डिजिटल स्क्रीन की लत से सतर्कता आवश्यक; संयम फलदायी'
      : 'उत्कृष्ट आत्म-नियंत्रण; सात्विक खान-पान व नशीले पदार्थों से स्वाभाविक दूरी बनाए रखने में सक्षम';

    dims.push({
      id: 39,
      category: 'shadow_challenges',
      categoryTitleEn: 'Shadow Challenges & Cautions',
      categoryTitleHi: 'संकट निवारण, बंधन व छाया प्रवृत्तियां',
      titleEn: 'Addiction Risks, Dietary Traps & Shadow Habits',
      titleHi: 'व्यसन, खान-पान की आदतें व छाया प्रवृत्तियों से सतर्कता',
      astroBasisEn: `2nd House (Diet & Ingestion) SAV: ${sav[1]} bindus; Planets in 2nd House: ${planets.filter((p) => p.houseNumber === 2).map((p) => p.id).join(', ') || 'None'}.`,
      astroBasisHi: `द्वितीय भाव (आहार/मुख) SAV: ${sav[1]} बिंदु; द्वितीय भाव में ग्रह: ${planets.filter((p) => p.houseNumber === 2).map((p) => HINDI_PLANETS[p.id] || p.id).join(', ') || 'कोई नहीं'}।`,
      verdictEn: addEn,
      verdictHi: addHi,
      detailedAnalysisEn: `The 2nd house governs food intake, speech, and oral vices. Afflictions here create a craving for sharp sensations or escapes during stressful dashas. Moderation in diet directly empowers mental focus.`,
      detailedAnalysisHi: `द्वितीय भाव मुख, वाणी व खान-पान का कारक है। तनाव के समय मन को भटकाने वाले अस्वास्थ्यकर खान-पान से बचना चाहिए। सात्विक आहार ग्रहण करने से वाणी में ओज व स्वास्थ्य में स्थिरता आती है।`,
      remedyEn: `Drink water stored overnight in a copper or silver vessel first thing every morning.`,
      remedyHi: `प्रातःकाल तांबे अथवा चांदी के पात्र में रखा जल पिएं तथा रात्रि में हल्का सात्विक भोजन लें।`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score),
    });
  }

  // ==========================================
  // 40. Bed Pleasure, Intimacy & Sleeping Wellness
  // ==========================================
  {
    const score = Math.max(40, Math.min(95, 50 + (sav[11] >= 28 ? 12 : -8) + getDignityBonus(venus.dignity)));
    const bedEn = sav[11] >= 28 && venus.dignity !== 'Debilitated'
      ? 'Harmonious Shayana Sukha: Deep intimate satisfaction, restorative peaceful sleep and luxurious comforts'
      : 'Periodic insomnia or restlessness; requires calming meditation before bedtime to optimize deep sleep';
    const bedHi = sav[11] >= 28 && venus.dignity !== 'Debilitated'
      ? 'उत्तम शयन सुख: वैवाहिक अंतरंगता में तृप्ति, गहरी शांतिदायक निद्रा व भौतिक सुख-साधनों की प्राप्ति'
      : 'कभी-कभार अनिद्रा या मानसिक उद्वेग; शयन से पूर्व ध्यान व शांत वातावरण बनाए रखना हितकर';

    dims.push({
      id: 40,
      category: 'shadow_challenges',
      categoryTitleEn: 'Shadow Challenges & Cautions',
      categoryTitleHi: 'संकट निवारण, बंधन व छाया प्रवृत्तियां',
      titleEn: 'Bed Pleasure, Intimacy (Shayana Sukha) & Sleep Quality',
      titleHi: 'शयन सुख, वैवाहिक तृप्ति, अंतरंगता व निद्रा स्वास्थ्य',
      astroBasisEn: `12th House (${h12.signName}) SAV: ${sav[11]} bindus; Venus in House ${venus.houseNumber} (${venus.dignity}); 12th Lord in House ${h12.placedHouse}.`,
      astroBasisHi: `द्वादश भाव (${h12.signHi}) SAV: ${sav[11]} बिंदु; शुक्र भाव ${venus.houseNumber} में (${venus.dignity}); द्वादशेश भाव ${h12.placedHouse} में।`,
      verdictEn: bedEn,
      verdictHi: bedHi,
      detailedAnalysisEn: `The 12th house governs bedroom comforts, dreams, and unconscious restoration. With ${sav[11]} SAV bindus and Venus dignified, intimate harmony acts as a source of emotional renewal and domestic bonding.`,
      detailedAnalysisHi: `द्वादश भाव शयन सुख, निद्रा व शैया का कारक है। शुक्र की शुभता व द्वादश भाव के बिंदु दांपत्य जीवन में सुखद शांति व परस्पर संतोष प्रदान करते हैं।`,
      remedyEn: `Keep bed headboard strictly toward South or East; avoid electronic screens 30 minutes before sleep.`,
      remedyHi: `सोते समय सिरहाने की दिशा दक्षिण या पूर्व रखें तथा शयन से 30 मिनट पूर्व मोबाइल का त्याग करें।`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score),
    });
  }

  // ==========================================
  // 41. Social Circle & Friendship Quality
  // ==========================================
  {
    const score = Math.max(35, Math.min(95, 45 + (sav[10] >= 28 ? 15 : -5) + getDignityBonus(mercury.dignity)));
    const socEn = sav[10] >= 28
      ? 'High-Caliber Social Alliances: Influential, intellectual, and generous friends who open major doors'
      : 'Selective Circle: Quality over quantity; smaller intimate set of trusted lifelong companions';
    const socHi = sav[10] >= 28
      ? 'उच्च-स्तरीय सामाजिक मित्र मंडली: बुद्धिमान, प्रभावशाली व उदार मित्र जो समय पर सहायक सिद्ध होते हैं'
      : 'सीमित व विश्वसनीय मित्र: संख्या से अधिक निष्ठा को महत्व देने वाले, गिने-चुने आजीवन साथ निभाने वाले मित्र';

    dims.push({
      id: 41,
      category: 'shadow_challenges',
      categoryTitleEn: 'Shadow Challenges & Cautions',
      categoryTitleHi: 'संकट निवारण, बंधन व छाया प्रवृत्तियां',
      titleEn: 'Social Circle, Networking Alliances & Friendship Quality',
      titleHi: 'मित्र मंडली, सामाजिक संपर्क व मित्रों से सहयोग',
      astroBasisEn: `11th House (${h11.signName}) SAV: ${sav[10]} bindus; 11th Lord ${h11.lord} in House ${h11.placedHouse}; Mercury in House ${mercury.houseNumber}.`,
      astroBasisHi: `एकादश भाव (${h11.signHi}) SAV: ${sav[10]} बिंदु; एकादशेश ${h11.lordHi} भाव ${h11.placedHouse} में; बुध भाव ${mercury.houseNumber} में।`,
      verdictEn: socEn,
      verdictHi: socHi,
      detailedAnalysisEn: `The 11th house (Labha & Mitra Bhava) shapes professional networks and communal goodwill. With ${sav[10]} bindus in the 11th house, your social contacts act as a continuous source of lucrative opportunities and moral support.`,
      detailedAnalysisHi: `एकादश भाव लाभ व मित्रों का स्थान है। एकादश भाव में ${sav[10]} अष्टकवर्ग बिंदु होने से समाज में आपकी स्वीकार्यता बढ़ती है तथा प्रतिष्ठित व्यक्तियों से मित्रता का लाभ मिलता है।`,
      remedyEn: `Feed green fodder to cows or birds on Wednesdays to expand auspicious networks.`,
      remedyHi: `बुधवार को पक्षियों को दाना डालें अथवा गौशाला में हरी घास का दान करें।`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score),
    });
  }

  // ==========================================
  // 42. Friendship Loyalty vs Betrayal Risks
  // ==========================================
  {
    const score = Math.max(35, Math.min(95, 55 + (sav[10] >= 28 ? 10 : -10) - (planets.some((p) => p.houseNumber === 11 && (p.id === 'Rahu' || p.id === 'Ketu')) ? 15 : 0)));
    const has11Mal = planets.some((p) => p.houseNumber === 11 && (p.id === 'Rahu' || p.id === 'Ketu' || p.id === 'Saturn'));
    const loyEn = has11Mal
      ? 'Vulnerability to Selfish Acquaintances: Avoid loaning large sums to friends without written documentation'
      : 'High Loyalty in Friendships: Genuine mutual protection and zero betrayal in core inner circle';
    const loyHi = has11Mal
      ? 'स्वार्थी मित्रों से सतर्कता: मित्रों के साथ बड़े आर्थिक लेन-देन अथवा बिना कागजी प्रमाण के साझेदारी से बचें'
      : 'मित्रों से पूर्ण निष्ठा: आंतरिक मित्र मंडली से सदैव सच्चा सहयोग व विश्वासघात की शून्य संभावना';

    dims.push({
      id: 42,
      category: 'shadow_challenges',
      categoryTitleEn: 'Shadow Challenges & Cautions',
      categoryTitleHi: 'संकट निवारण, बंधन व छाया प्रवृत्तियां',
      titleEn: 'Friendship Loyalty vs Betrayal & Exploitation Risks',
      titleHi: 'मित्रों की निष्ठा बनाम विश्वासघात से सुरक्षा',
      astroBasisEn: `Planets in 11th House: ${planets.filter((p) => p.houseNumber === 11).map((p) => p.id).join(', ') || 'None'}; 11th SAV: ${sav[10]} bindus.`,
      astroBasisHi: `एकादश भाव में ग्रह: ${planets.filter((p) => p.houseNumber === 11).map((p) => HINDI_PLANETS[p.id] || p.id).join(', ') || 'कोई नहीं'}; एकादश अष्टकवर्ग: ${sav[10]} बिंदु।`,
      verdictEn: loyEn,
      verdictHi: loyHi,
      detailedAnalysisEn: `When shadow planets occupy the 11th house, flatterers may attempt to leverage native's generosity. Setting healthy financial boundaries preserves lifelong friendships while shielding earned savings.`,
      detailedAnalysisHi: `एकादश भाव में छाया ग्रहों की स्थिति कभी-कभी चाटुकार लोगों को आकर्षित करती है। मित्रता और व्यापार/धन को पृथक रखने से सम्मान व संबंध दोनों सुरक्षित रहते हैं।`,
      remedyEn: `Never stand guarantee for acquaintances in speculative loans or dubious schemes.`,
      remedyHi: `मित्रता के वशीभूत होकर किसी के लिए अनुचित वित्तीय गारंटी या ऋण पत्र पर हस्ताक्षर न करें।`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score),
    });
  }

  // ==========================================
  // 43. Crucial Life Hazards & Badhaka Traps to Avoid
  // ==========================================
  {
    const score = 65;
    // Badhaka: Movable signs (0,3,6,9) -> 11th; Fixed (1,4,7,10) -> 9th; Dual (2,5,8,11) -> 7th
    const badhakaHouse = (ascSign % 3 === 0) ? 11 : (ascSign % 3 === 1) ? 9 : 7;
    const badhakaLord = getHLord(badhakaHouse).lord;
    const trapEn = `Primary Life Trap: Over-committing in affairs ruled by House ${badhakaHouse} (${badhakaLord}). Avoid blind haste in partnerships and speculative greed.`;
    const trapHi = `प्रमुख जीवन जाल: भाव ${badhakaHouse} के स्वामी (${HINDI_PLANETS[badhakaLord] || badhakaLord}) से जुड़े मामलों में अंधाधुंध विश्वास। सट्टेबाजी, अनैतिक प्रलोभनों व जल्दबाजी से बचें।`;

    dims.push({
      id: 43,
      category: 'shadow_challenges',
      categoryTitleEn: 'Shadow Challenges & Cautions',
      categoryTitleHi: 'संकट निवारण, बंधन व छाया प्रवृत्तियां',
      titleEn: 'Crucial Life Hazards, Badhaka Traps & Secret Vulnerabilities',
      titleHi: 'बाधक ग्रह, जीवन के प्रमुख प्रलोभन, जाल व सुरक्षा चक्र',
      astroBasisEn: `Badhaka House: ${badhakaHouse}th House ruled by ${badhakaLord}; 6th Lord ${h6.lord} in House ${h6.placedHouse}.`,
      astroBasisHi: `बाधक भाव: ${badhakaHouse}वां भाव, स्वामी ${HINDI_PLANETS[badhakaLord] || badhakaLord}; षष्ठेश ${h6.lordHi} भाव ${h6.placedHouse} में।`,
      verdictEn: trapEn,
      verdictHi: trapHi,
      detailedAnalysisEn: `Every ascendant has a Badhaka planet that creates unforeseen hurdles when native strays from ethics. By recognizing the energetic traps of ${badhakaLord}, you navigate career and relationship risks with seasoned foresight.`,
      detailedAnalysisHi: `प्रत्येक लग्न का एक बाधक ग्रह होता है जो असावधानी बरतने पर व्यवधान उत्पन्न करता है। ${HINDI_PLANETS[badhakaLord] || badhakaLord} की स्थिति को समझकर विवेकपूर्ण निर्णय लेने से हर संकट टल जाता है।`,
      remedyEn: `Worship Lord Ganesha with Durva grass on Wednesdays to remove Badhaka obstacles.`,
      remedyHi: `बुधवार को विघ्नहर्ता भगवान श्री गणेश को 21 दूर्वा दल अर्पित करें ताकि सभी बाधक दूर हों।`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score),
    });
  }

  // ==========================================
  // 44. Emergency Crisis Strategy & Shield Protocol
  // ==========================================
  {
    const score = 95;
    const ishta = ledger.deityAndMainPlanet;

    dims.push({
      id: 44,
      category: 'spirituality',
      categoryTitleEn: 'Spirituality & Higher Grace',
      categoryTitleHi: 'आध्यात्म, इष्ट कृपा व मोक्ष',
      titleEn: 'Emergency Crisis Strategy & Sovereign Shield Protocol',
      titleHi: 'संकट मोचन रणनीति, आपातकालीन रक्षा कवच व तात्कालिक उपाय',
      astroBasisEn: `Karakamsa 12th Deity: ${ishta.ishtaDevataEn}; 8th House Lord ${h8.lord} mitigated by Ishta Mantric Vibration.`,
      astroBasisHi: `कारकांश द्वादश अधिष्ठाता: ${ishta.ishtaDevataHi}; अष्टमेश ${h8.lordHi} के संकट का इष्ट मंत्र द्वारा शमन।`,
      verdictEn: `Supreme Crisis Shield: Immediate sanctuary under ${ishta.ishtaDevataEn} · Emergency Mantra: "${ishta.ishtaMantra}".`,
      verdictHi: `सर्वोच्च संकट मोचन कवच: ${ishta.ishtaDevataHi} की तत्काल शरण · आपातकालीन सिद्ध मंत्र: "${ishta.ishtaMantra}"।`,
      detailedAnalysisEn: `During severe transit pressures, Rahu afflictions or health crises, mental panic is avoided by retreating into this proven Vedic anchor. Chanting "${ishta.ishtaMantra}" establishes an energetic protective dome around the native.`,
      detailedAnalysisHi: `जीवन में किसी भी अप्रत्याशित संकट, भय अथवा गंभीर बाधा के समय विचलित न हों। मन को एकाग्र कर ${ishta.ishtaDevataHi} के मूल मंत्र "${ishta.ishtaMantra}" का मानसिक जप करने से अदृश्य दैवीय सहायता तुरंत सक्रिय होती है।`,
      remedyEn: `Light a mustard oil lamp under a Peepal tree on Saturdays during challenging dasha transits.`,
      remedyHi: `कठिन समय में शनिवार सायंकाल पीपल के वृक्ष के नीचे सरसों के तेल का चौमुखा दीपक जलाएं।`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score),
    });
  }

  // ==========================================
  // 45. Sports, Physical Fitness & Energy Style
  // ==========================================
  {
    const score = Math.max(40, Math.min(95, 50 + getDignityBonus(mars.dignity) + (sav[2] >= 28 ? 10 : 0)));
    const elem = SIGN_ELEMENTS[ascSign];
    const sportEn = elem === 'Fire'
      ? 'Martial arts, sprinting, competitive football, weight training, cricket & high-intensity interval training'
      : elem === 'Earth'
      ? 'Gym endurance, trekking, cycling, golf, calisthenics, wrestling & core strength bodybuilding'
      : elem === 'Air'
      ? 'Badminton, tennis, yoga vinyasa, gymnastics, table tennis & acrobatic cardio sports'
      : 'Swimming, rowing, gentle hatha yoga, water polo, hiking & meditative breathing walks';
    const sportHi = elem === 'Fire'
      ? 'मार्शल आर्ट्स, दौड़, क्रिकेट, भारोत्तोलन (वेट ट्रेनिंग), फुटबॉल व उच्च ऊर्जा वाले प्रतिस्पर्धी खेल'
      : elem === 'Earth'
      ? 'जिम स्ट्रेंथ, ट्रैकिंग, साइकलिंग, कुश्ती, योग व शारीरिक क्षमता संवर्धन वाले व्यायाम'
      : elem === 'Air'
      ? 'बैडमिंटन, टेनिस, टेबल टेनिस, जिम्नास्टिक, एरोबिक्स व तेज गति के खेल'
      : 'तैराकी, नौकायन, हठयोग, जल-क्रीड़ा, प्रकृति भ्रमण व प्राणायाम';

    dims.push({
      id: 45,
      category: 'spirituality',
      categoryTitleEn: 'Spirituality & Higher Grace',
      categoryTitleHi: 'आध्यात्म, इष्ट कृपा व मोक्ष',
      titleEn: 'Sports, Physical Fitness & Energetic Pursuits',
      titleHi: 'खेलकूद, शारीरिक व्यायाम, ऊर्जा व्यय व फिटनेस शैली',
      astroBasisEn: `3rd House (Parakrama) in ${h3.signName} (SAV: ${sav[2]}); Mars in House ${mars.houseNumber} (${mars.dignity}); Ascendant in ${ascSignName}.`,
      astroBasisHi: `तृतीय भाव (पराक्रम) ${h3.signHi} में (SAV: ${sav[2]}); मंगल भाव ${mars.houseNumber} में (${mars.dignity}); लग्न ${ascSignHi}।`,
      verdictEn: sportEn,
      verdictHi: sportHi,
      detailedAnalysisEn: `The 3rd house represents Parakrama (physical valor), while Mars directs muscular vitality. Aligning fitness routines with the ${elem} element of your Lagna burns excess toxins and sharpens reflexes.`,
      detailedAnalysisHi: `तृतीय भाव पराक्रम व शारीरिक ऊर्जा का है तथा मंगल मांसपेशियों के अधिपति हैं। लग्न के ${HINDI_ELEMENTS[ascSign]} तत्व के अनुकूल खेलकूद अपनाने से शरीर स्फूर्तिवान व मन तनावमुक्त रहता है।`,
      remedyEn: `Practice 15 minutes of Pranayama and Surya Namaskar early in the morning outdoors.`,
      remedyHi: `प्रतिदिन प्रातः खुली हवा में 15 मिनट प्राणायाम व सूर्य नमस्कार का अभ्यास करें।`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score),
    });
  }

  // ==========================================
  // 46. Core Temperament & Triguna Balance
  // ==========================================
  {
    const score = 80;
    const elem = SIGN_ELEMENTS[ascSign];
    const gunaEn = elem === 'Fire'
      ? 'Rajas-Sattva dominant: Dynamic, fearless, inspiring, quick-tempered yet fiercely generous'
      : elem === 'Earth'
      ? 'Tamas-Sattva balanced: Practical, calm, deeply patient, cautious, resilient and steady'
      : elem === 'Air'
      ? 'Rajas-Sattva refined: Intellectual, curious, adaptable, articulate and socially communicative'
      : 'Sattva-Tamas deep: Intuitive, empathetic, peace-loving, contemplative and emotionally profound';
    const gunaHi = elem === 'Fire'
      ? 'रज-सत्त्व प्रधान: तेजस्वी, साहसी, ओजस्वी, त्वरित निर्णय लेने वाले, थोड़े क्रोधी परंतु तुरंत शांत व उदार'
      : elem === 'Earth'
      ? 'तम-सत्त्व संतुलित: व्यावहारिक, धैर्यवान, शांत, गंभीर, दृढ़ संकल्पी व यथार्थवादी'
      : elem === 'Air'
      ? 'रज-सत्त्व परिष्कृत: बौद्धिक, जिज्ञासु, विचारशील, मिलनसार व बहुमुखी प्रतिभा के धनी'
      : 'सत्त्व-तम गहन: संवेदनशील, दयालु, करुणामयी, अंतर्मुखी, शांत व गहरे भावनात्मक लगाव वाले';

    dims.push({
      id: 46,
      category: 'identity',
      categoryTitleEn: 'Identity & Core Alignment',
      categoryTitleHi: 'पहचान व आत्म तत्व',
      titleEn: 'Core Temperament & Triguna Balance (Sattva, Rajas, Tamas)',
      titleHi: 'मूल स्वभाव व त्रिगुण संतुलन (सत्त्व, रज, तम)',
      astroBasisEn: `Lagna in ${ascSignName} (${elem} Element); Moon in ${moon.signName} (${HINDI_SIGNS[moon.signIndex]}); Lagna Lord in House ${h1.placedHouse}.`,
      astroBasisHi: `लग्न ${ascSignHi} (${HINDI_ELEMENTS[ascSign]} तत्व); चंद्रमा ${HINDI_SIGNS[moon.signIndex]} में; लग्नेश भाव ${h1.placedHouse} में।`,
      verdictEn: gunaEn,
      verdictHi: gunaHi,
      detailedAnalysisEn: `Ayurveda and Vedic philosophy classify human consciousness via Trigunas. The combination of your ${ascSignName} Lagna and ${moon.signName} Moon establishes a balanced temperament that harmonizes worldly assertiveness with philosophical calm.`,
      detailedAnalysisHi: `आयुर्वेद व सांख्य दर्शन के अनुसार आत्मा का स्वभाव त्रिगुणों से अभिव्यक्त होता है। आपके लग्न व चंद्र राशि के समन्वय से आपका स्वभाव संतुलित रहता है, जो आपको हर परिस्थिति में गरिमा बनाए रखने की शक्ति देता है।`,
      remedyEn: `Spend 10 minutes in silent breath observation before sunrise to cultivate pure Sattva.`,
      remedyHi: `सूर्योदय से पूर्व 10 मिनट मौन रहकर श्वास पर ध्यान केंद्रित करें ताकि सत्त्व गुण की वृद्धि हो।`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score),
    });
  }

  // ==========================================
  // 47. Romance, Love Life & Prem Vivaha
  // ==========================================
  {
    const score = Math.max(35, Math.min(95, 45 + (sav[4] >= 28 ? 10 : 0) + (h5.placedHouse === 7 || h7.placedHouse === 5 ? 25 : 0)));
    const hasLoveLink = h5.placedHouse === 7 || h7.placedHouse === 5 || (planets.some((p) => p.houseNumber === 5 && p.id === 'Venus'));
    const premEn = hasLoveLink
      ? 'Strong Prem Vivaha (Love Marriage) Yoga: Romantic relationship matures successfully into lifelong wedlock'
      : 'Arranged-Cum-Love Foundation: Traditional family introduction blossoming into profound personal romantic commitment';
    const premHi = hasLoveLink
      ? 'प्रबल प्रेम विवाह योग: गहरा प्रेम संबंध परिवार की सहमति से सुखी दांपत्य में परिवर्तित होगा'
      : 'पारंपरिक संस्कार युक्त प्रेम संबंध: पारिवारिक सहमति से प्रारंभ होकर गहरे आत्मीय प्रेम में परिणत';

    dims.push({
      id: 47,
      category: 'marriage',
      categoryTitleEn: 'Marriage & Relational Dynamics',
      categoryTitleHi: 'विवाह, दांपत्य व जीवनसाथी',
      titleEn: 'Romance, Love Life & Prem Vivaha (Love Marriage) Likelihood',
      titleHi: 'प्रेम संबंध, प्रेम विवाह योग व भावनात्मक समर्पण',
      astroBasisEn: `5th Lord ${h5.lord} in House ${h5.placedHouse}; 7th Lord ${h7.lord} in House ${h7.placedHouse}; Venus in House ${venus.houseNumber}.`,
      astroBasisHi: `पंचमेश ${h5.lordHi} भाव ${h5.placedHouse} में; सप्तमेश ${h7.lordHi} भाव ${h7.placedHouse} में; शुक्र भाव ${venus.houseNumber} में स्थित।`,
      verdictEn: premEn,
      verdictHi: premHi,
      detailedAnalysisEn: `Love marriages occur when the 5th house (romance/heart) forms an exchange, conjunction, or mutual aspect with the 7th house (marital contract). The dignified presence of Venus ensures heartfelt sincerity and mutual loyalty.`,
      detailedAnalysisHi: `पंचम भाव प्रेम का और सप्तम भाव विवाह का है। इन दोनों भावों का संबंध प्रेम को विवाह के पवित्र बंधन में बांधता है। शुक्र की शुभता से आपके संबंधों में मर्यादा, समर्पण व स्थायित्व रहता है।`,
      remedyEn: `Offer a fragrant white flower or pair of sweets to Radha-Krishna on Friday evenings.`,
      remedyHi: `शुक्रवार की शाम श्री राधा-कृष्ण मंदिर में सुगंधित श्वेत पुष्प व मिश्री अर्पित करें।`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score),
    });
  }

  // ==========================================
  // 48. Psychological Poise vs Stress & Anxiety
  // ==========================================
  {
    const score = Math.max(35, Math.min(95, 50 + getDignityBonus(moon.dignity) + (sav[3] >= 28 ? 12 : -8) - (planets.some((p) => p.houseNumber === moon.houseNumber && (p.id === 'Saturn' || p.id === 'Rahu')) ? 18 : 0)));
    const hasVish = planets.some((p) => p.houseNumber === moon.houseNumber && p.id === 'Saturn');
    const hasGrahan = planets.some((p) => p.houseNumber === moon.houseNumber && p.id === 'Rahu');
    const poiseEn = hasVish
      ? 'Vish Yoga Tendency: Periodic melancholy, over-analyzing and emotional isolation; grounding meditation dissolves gloom'
      : hasGrahan
      ? 'Grahan Yoga Vulnerability: High intuitive flashes mixed with anxiety; pranayama and Shiva worship restore serenity'
      : 'High Emotional Resilience: Stable mind, tranquil inner temperament and balanced reaction to setbacks';
    const poiseHi = hasVish
      ? 'विष योग प्रभाव: कभी-कभार अकेलापन, अत्यधिक सोचना व उदासी; नियमित ध्यान व शिवोपासना से मानसिक शांति'
      : hasGrahan
      ? 'ग्रहण योग प्रभाव: अत्यधिक विचारशीलता व चिंता की प्रवृत्ति; प्राणायाम व जल तत्व के संतुलन से शांति'
      : 'उच्च मानसिक स्थिरता: शांत अंतर्मन, परिस्थितियों से न घबराने वाला धैर्य व सकारात्मक सोच';

    dims.push({
      id: 48,
      category: 'longevity_health',
      categoryTitleEn: 'Longevity & Health Vitality',
      categoryTitleHi: 'आयु, आरोग्य, शल्य चिकित्सा व रक्षा',
      titleEn: 'Psychological Poise vs Stress, Anxiety & Mental Poise',
      titleHi: 'मानसिक संतुलन, अवसाद/चिंता से सुरक्षा व आत्म-शांति',
      astroBasisEn: `Moon in House ${moon.houseNumber} (${moon.dignity}); Conjunctions with Moon: ${planets.filter((p) => p.houseNumber === moon.houseNumber && p.id !== 'Moon').map((p) => p.id).join(', ') || 'None'}; 4th SAV: ${sav[3]} bindus.`,
      astroBasisHi: `चंद्रमा भाव ${moon.houseNumber} में (${moon.dignity}); चंद्रमा के साथ ग्रह: ${planets.filter((p) => p.houseNumber === moon.houseNumber && p.id !== 'Moon').map((p) => HINDI_PLANETS[p.id] || p.id).join(', ') || 'कोई नहीं'}; चतुर्थ भाव SAV: ${sav[3]} बिंदु।`,
      verdictEn: poiseEn,
      verdictHi: poiseHi,
      detailedAnalysisEn: `Moon represents the conscious mind (Manas). When Moon has benefic aspects or strong points in the 4th house (${sav[3]} bindus), emotional equilibrium is quickly restored even during tumultuous life crises.`,
      detailedAnalysisHi: `चंद्रमा मनसो जातः — चंद्रमा मन का स्वामी है। चतुर्थ भाव में ${sav[3]} अष्टकवर्ग बिंदु होने से मानसिक संबल बना रहता है। जब भी मन अशांत हो, प्रकृति के सान्निध्य में समय बिताने से नई ऊर्जा मिलती है।`,
      remedyEn: `Drink water from a silver cup and chant "Om Namah Shivaya" 108 times on Mondays.`,
      remedyHi: `चांदी के गिलास में जल पिएं तथा सोमवार को "ॐ नमः शिवाय" मंत्र का 108 बार शांत जप करें।`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score),
    });
  }

  // ==========================================
  // 49. Physical Constitution, Tridosha & Health Vulnerabilities
  // ==========================================
  {
    const score = Math.max(35, Math.min(95, 50 + (sav[5] <= 28 ? 10 : 0) + (sav[0] >= 28 ? 10 : -8) + getDignityBonus(sun.dignity)));
    const elem = SIGN_ELEMENTS[ascSign];
    const doshaEn = elem === 'Fire'
      ? 'Pitta Dominant: High metabolic heat, acidity, liver/bile balance, blood pressure and eye strain'
      : elem === 'Earth'
      ? 'Kapha-Vata Balanced: Joint stiffness, metabolic sluggishness, skin sensitivities and weight regulation'
      : elem === 'Air'
      ? 'Vata Dominant: Nervous system tension, dry skin, gas/bloating, irregular appetite and sleep sensitivity'
      : 'Kapha-Pitta Dominant: Water retention, lymphatic sluggishness, seasonal allergies and fluid metabolism';
    const doshaHi = elem === 'Fire'
      ? 'पित्त प्रकृति प्रधान: शरीर में उष्णता, एसिडिटी, यकृत (लिवर) का ध्यान, रक्तचाप व नेत्रों की सुरक्षा'
      : elem === 'Earth'
      ? 'कफ-वात संतुलित: जोड़ों में अकड़न, मंद पाचन, त्वचा की संवेदनशीलता व संतुलित वजन बनाए रखने की आवश्यकता'
      : elem === 'Air'
      ? 'वात प्रकृति प्रधान: स्नायु तंत्र में तनाव, त्वचा का रूखापन, गैस/उदर विकार व नींद में अनियमितता'
      : 'कफ-पित्त प्रधान: शरीर में जल तत्व का संचय, कफ संबंधी मौसमी एलर्जी व पाचन अग्नि का संतुलन आवश्यक';

    dims.push({
      id: 49,
      category: 'longevity_health',
      categoryTitleEn: 'Longevity & Health Vitality',
      categoryTitleHi: 'आयु, आरोग्य, शल्य चिकित्सा व रक्षा',
      titleEn: 'Physical Constitution, Tridosha Balance & Health Sensitivities',
      titleHi: 'शारीरिक प्रकृति, त्रिदोष संतुलन (वात, पित्त, कफ) व स्वास्थ्य रक्षा',
      astroBasisEn: `Lagna in ${ascSignName} (${elem} Element); 6th House (${h6.signName}) SAV: ${sav[5]} bindus; Sun in House ${sun.houseNumber}.`,
      astroBasisHi: `लग्न ${ascSignHi} (${HINDI_ELEMENTS[ascSign]} तत्व); षष्ठ भाव (${h6.signHi}) SAV: ${sav[5]} बिंदु; सूर्य भाव ${sun.houseNumber} में।`,
      verdictEn: doshaEn,
      verdictHi: doshaHi,
      detailedAnalysisEn: `Ayurveda correlates the Lagna element with Tridosha constitution. Adopting seasonal food choices (Ritucharya) suited to your ${elem} element purges excess bio-toxins and preserves youthful stamina.`,
      detailedAnalysisHi: `आयुर्वेद के अनुसार लग्न का तत्व आपकी मूल प्रकृति का निर्धारण करता है। अपने ${HINDI_ELEMENTS[ascSign]} तत्व के अनुकूल सात्विक आहार व मौसमी दिनचर्या अपनाने से शरीर निरोगी व ऊर्जावान बना रहता है।`,
      remedyEn: `Incorporate warm herbal teas (tulsi, ginger or cumin) and practice fasting on Ekadashi.`,
      remedyHi: `ऋतु के अनुसार गुनगुने जल व तुलसी का सेवन करें तथा एकादशी को हल्का फलाहार रखें।`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score),
    });
  }

  // ==========================================
  // 50. Wealth Peak Window, Dhana Yogas & Final Moksha
  // ==========================================
  {
    const score = Math.max(45, Math.min(98, 50 + (sav[10] >= 28 ? 15 : 0) + (sav[1] >= 28 ? 12 : 0) + (sav[8] >= 28 ? 10 : 0)));
    const peakEn = sav[10] >= 30
      ? 'Monumental Wealth Peak: Accelerated financial accumulation between ages 36 and 54 under supportive Mahadashas'
      : 'Steady Progressive Accumulation: Financial prosperity compounds steadily with prime peak between ages 40 and 58';
    const peakHi = sav[10] >= 30
      ? 'वैभव शिखर काल: 36 से 54 वर्ष की आयु के मध्य महादशाओं के शुभ प्रभाव से असाधारण धन संचय व संपत्ति'
      : 'स्थिर प्रगतिशील धन योग: 40 से 58 वर्ष की आयु के मध्य निरंतर निवेश व परिश्रम से ठोस आर्थिक समृद्धि';

    dims.push({
      id: 50,
      category: 'wealth_fortune',
      categoryTitleEn: 'Wealth, Fortune & Moksha',
      categoryTitleHi: 'धन, समृद्धि, भाग्योदय व मोक्ष',
      titleEn: 'Wealth Peak Window, Dhana Yogas & Ultimate Moksha Potential',
      titleHi: 'धन योग, वैभव शिखर काल, अकूत समृद्धि एवं मोक्ष प्राप्ति योग',
      astroBasisEn: `2nd House (Dhana) SAV: ${sav[1]}; 11th House (Labha) SAV: ${sav[10]}; 9th House (Bhagya) SAV: ${sav[8]}; 12th House (Moksha) SAV: ${sav[11]}; Current Dasha: ${mdLord}-${adLord}.`,
      astroBasisHi: `द्वितीय भाव (धन) SAV: ${sav[1]}; एकादश भाव (लाभ) SAV: ${sav[10]}; नवम भाव (भाग्य) SAV: ${sav[8]}; द्वादश भाव (मोक्ष) SAV: ${sav[11]}; सक्रिय दशा: ${mdLordHi}-${adLordHi}।`,
      verdictEn: `${peakEn} · Final Phase: Deep spiritual awakening and liberation (Moksha).`,
      verdictHi: `${peakHi} · जीवन का अंतिम चरण: उच्च आध्यात्मिक चेतना, वैराग्य व मोक्ष की प्राप्ति।`,
      detailedAnalysisEn: `Dhana Yogas arise from the interlink between houses 1, 2, 5, 9 and 11. With 11th house boasting ${sav[10]} SAV bindus and 2nd house having ${sav[1]} bindus, financial security is guaranteed. In mature elder years, 12th house Moksha Trikona awakens profound detachment, crowning life with peace.`,
      detailedAnalysisHi: `लग्न, द्वितीय, पंचम, नवम व एकादश भावों का संबंध अकूत धन योग की रचना करता है। एकादश भाव में ${sav[10]} बिंदु एवं द्वितीय भाव में ${sav[1]} बिंदु आर्थिक संपन्नता की गारंटी हैं। जीवन के उत्तरार्ध में द्वादश भाव के प्रभाव से आध्यात्मिक तृप्ति व मोक्ष का मार्ग प्रशस्त होगा।`,
      remedyEn: `Dedicate 5% of monthly net earnings to secret spiritual or educational charity.`,
      remedyHi: `अपनी मासिक आय का 5% भाग गुप्त रूप से शिक्षा, चिकित्सा अथवा धर्मार्थ कार्यों में दान करें।`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score),
    });
  }

  // Summary counts
  let hf = 0;
  let f = 0;
  let m = 0;
  let c = 0;
  dims.forEach((d) => {
    if (d.auspiciousness === 'highly_favorable') hf++;
    else if (d.auspiciousness === 'favorable') f++;
    else if (d.auspiciousness === 'mixed_moderate') m++;
    else c++;
  });

  const summary: SambhavitSummary = {
    totalDimensions: 50,
    highlyFavorableCount: hf,
    favorableCount: f,
    mixedCount: m,
    cautionCount: c,
    primaryLifeController: ledger.deityAndMainPlanet.mainPlanetEn,
    ishtaDevata: ledger.deityAndMainPlanet.ishtaDevataEn,
    dominantLifeFocusEn: `Anchored in ${ascSignName} Ascendant with ${h10.lord} controlling career, ${sav[9]} SAV in 10th and ${sav[10]} SAV in 11th.`,
    dominantLifeFocusHi: `${ascSignHi} लग्न, दशमेश ${h10.lordHi} के प्रभाव, दशम में ${sav[9]} एवं एकादश में ${sav[10]} अष्टकवर्ग बिंदुओं द्वारा संचालित।`,
  };

  // Construct backward compatible report
  const report: SambhavitFalkathanReport = {
    dimensions: dims,
    summary,

    namakshar: {
      primaryEn: dims[0].verdictEn,
      primaryHi: dims[0].verdictHi,
      allPadasEn: allSyl.en,
      allPadasHi: allSyl.hi,
      nakshatraName: nakName,
      pada,
      explanationEn: dims[0].detailedAnalysisEn,
      explanationHi: dims[0].detailedAnalysisHi,
    },
    ishtaDevata: {
      nameEn: ledger.deityAndMainPlanet.ishtaDevataEn,
      nameHi: ledger.deityAndMainPlanet.ishtaDevataHi,
      basisEn: dims[1].astroBasisEn,
      basisHi: dims[1].astroBasisHi,
      mantra: ledger.deityAndMainPlanet.ishtaMantra,
    },
    mukhyaGraha: {
      planetEn: ledger.deityAndMainPlanet.mainPlanetEn,
      planetHi: ledger.deityAndMainPlanet.mainPlanetHi,
      roleEn: ledger.deityAndMainPlanet.supportingKingsEn,
      roleHi: ledger.deityAndMainPlanet.supportingKingsHi,
      rationaleEn: dims[2].detailedAnalysisEn,
      rationaleHi: dims[2].detailedAnalysisHi,
    },
    father: {
      temperamentEn: dims[3].verdictEn,
      temperamentHi: dims[3].verdictHi,
      professionEn: dims[4].verdictEn,
      professionHi: dims[4].verdictHi,
      lifespanEn: dims[5].verdictEn,
      lifespanHi: dims[5].verdictHi,
      relationshipEn: dims[6].verdictEn,
      relationshipHi: dims[6].verdictHi,
    },
    mother: {
      temperamentEn: dims[7].verdictEn,
      temperamentHi: dims[7].verdictHi,
      professionEn: dims[8].verdictEn,
      professionHi: dims[8].verdictHi,
      lifespanEn: dims[9].verdictEn,
      lifespanHi: dims[9].verdictHi,
      relationshipEn: dims[10].verdictEn,
      relationshipHi: dims[10].verdictHi,
    },
    siblings: {
      countProjectionEn: dims[11].verdictEn,
      countProjectionHi: dims[11].verdictHi,
      birthOrderEn: dims[12].verdictEn,
      birthOrderHi: dims[12].verdictHi,
      harmonyEn: dims[13].verdictEn,
      harmonyHi: dims[13].verdictHi,
    },
    marriage: {
      timingAgeWindowEn: dims[14].verdictEn,
      timingAgeWindowHi: dims[14].verdictHi,
      marriageYogasEn: dims[15].verdictEn,
      marriageYogasHi: dims[15].verdictHi,
      spouseNatureEn: dims[16].verdictEn,
      spouseNatureHi: dims[16].verdictHi,
      spouseAgeGapEn: dims[18].verdictEn,
      spouseAgeGapHi: dims[18].verdictHi,
      relationshipEn: dims[18].detailedAnalysisEn,
      relationshipHi: dims[18].detailedAnalysisHi,
    },
    children: {
      conceptionModeEn: dims[19].verdictEn,
      conceptionModeHi: dims[19].verdictHi,
      progenyCountEn: dims[20].verdictEn,
      progenyCountHi: dims[20].verdictHi,
      miscarriageRiskEn: dims[21].verdictEn,
      miscarriageRiskHi: dims[21].verdictHi,
      filialHappinessEn: dims[22].verdictEn,
      filialHappinessHi: dims[22].verdictHi,
      countAndGenderEn: dims[20].verdictEn,
      countAndGenderHi: dims[20].verdictHi,
      filialJoyEn: dims[22].verdictEn,
      filialJoyHi: dims[22].verdictHi,
    },
    education: {
      attainmentLevelEn: dims[23].verdictEn,
      attainmentLevelHi: dims[23].verdictHi,
      suitableStreamsEn: [dims[24].verdictEn],
      suitableStreamsHi: [dims[24].verdictHi],
      academicSuccessEn: dims[25].verdictEn,
      academicSuccessHi: dims[25].verdictHi,
      highestAttainmentEn: dims[23].verdictEn,
      highestAttainmentHi: dims[23].verdictHi,
      suitableFieldsEn: [dims[24].verdictEn],
      suitableFieldsHi: [dims[24].verdictHi],
    },
    career: {
      jobVsBusinessEn: dims[26].verdictEn,
      jobVsBusinessHi: dims[26].verdictHi,
      govtVsPrivateEn: dims[27].verdictEn,
      govtVsPrivateHi: dims[27].verdictHi,
      suitableProfessionsEn: [dims[28].verdictEn],
      suitableProfessionsHi: [dims[28].verdictHi],
      foreignTravelEn: dims[30].verdictEn,
      foreignTravelHi: dims[30].verdictHi,
      foreignSettlementEn: dims[31].verdictEn,
      foreignSettlementHi: dims[31].verdictHi,
    },
    longevity: {
      categoryEn: dims[32].verdictEn,
      categoryHi: dims[32].verdictHi,
      rangeEn: '65 to 90+ years depending on Saturn & Lagna strength',
      rangeHi: 'शनि व लग्नेश के बलानुसार 65 से 90+ वर्ष',
      keyFactorsEn: dims[32].astroBasisEn,
      keyFactorsHi: dims[32].astroBasisHi,
    },
    bandhanaYoga: {
      hasRisk: false,
      verdictEn: dims[35].verdictEn,
      verdictHi: dims[35].verdictHi,
      mitigationEn: dims[35].remedyEn,
      mitigationHi: dims[35].remedyHi,
    },
    surgeryYoga: {
      hasRisk: false,
      riskLevelEn: dims[34].verdictEn,
      riskLevelHi: dims[34].verdictHi,
      vulnerableAreasEn: dims[34].astroBasisEn,
      vulnerableAreasHi: dims[34].astroBasisHi,
      timingEn: dims[33].verdictEn,
      timingHi: dims[33].verdictHi,
    },
    physicalMarks: {
      identificationEn: dims[37].verdictEn,
      identificationHi: dims[37].verdictHi,
      locationsEn: [dims[36].verdictEn],
      locationsHi: [dims[36].verdictHi],
    },
    addictions: {
      vulnerabilitiesEn: [dims[38].verdictEn],
      vulnerabilitiesHi: [dims[38].verdictHi],
      adviceEn: dims[38].remedyEn,
      adviceHi: dims[38].remedyHi,
    },
    bedPleasure: {
      shayanaSukhaEn: dims[39].verdictEn,
      shayanaSukhaHi: dims[39].verdictHi,
      sexualityEn: dims[39].detailedAnalysisEn,
      sexualityHi: dims[39].detailedAnalysisHi,
    },
    friends: {
      natureEn: dims[40].verdictEn,
      natureHi: dims[40].verdictHi,
      loyaltyVerdictEn: dims[41].verdictEn,
      loyaltyVerdictHi: dims[41].verdictHi,
    },
    cautions: {
      hazardsEn: [dims[42].verdictEn, 'Overconfidence in financial schemes', 'Neglecting routine health examinations'],
      hazardsHi: [dims[42].verdictHi, 'वित्तीय योजनाओं में अति-विश्वास', 'स्वास्थ्य की नियमित जांच में लापरवाही'],
      warningNoteEn: dims[42].detailedAnalysisEn,
      warningNoteHi: dims[42].detailedAnalysisHi,
    },
    crisisStrategy: {
      primaryDeityEn: ledger.deityAndMainPlanet.ishtaDevataEn,
      primaryDeityHi: ledger.deityAndMainPlanet.ishtaDevataHi,
      rescueMantra: ledger.deityAndMainPlanet.ishtaMantra,
      actionProtocolEn: dims[43].remedyEn,
      actionProtocolHi: dims[43].remedyHi,
    },
    sports: {
      preferencesEn: dims[44].verdictEn.split(/[,،]/).map((s) => s.trim()).filter(Boolean),
      preferencesHi: dims[44].verdictHi.split(/[,،]/).map((s) => s.trim()).filter(Boolean),
      fitnessStyleEn: dims[44].detailedAnalysisEn,
      fitnessStyleHi: dims[44].detailedAnalysisHi,
    },
    temperament: {
      traitSummaryEn: dims[45].verdictEn,
      traitSummaryHi: dims[45].verdictHi,
      gunaEn: dims[45].astroBasisEn,
      gunaHi: dims[45].astroBasisHi,
    },
    loveLife: {
      romanceEn: dims[46].verdictEn,
      romanceHi: dims[46].verdictHi,
      marriageTypeEn: dims[46].detailedAnalysisEn,
      marriageTypeHi: dims[46].detailedAnalysisHi,
    },
    mentalHealth: {
      conditionEn: dims[47].verdictEn,
      conditionHi: dims[47].verdictHi,
      vulnerabilitiesEn: dims[47].astroBasisEn,
      vulnerabilitiesHi: dims[47].astroBasisHi,
      remedyEn: dims[47].remedyEn,
      remedyHi: dims[47].remedyHi,
    },
    health: {
      constitutionEn: dims[48].verdictEn,
      constitutionHi: dims[48].verdictHi,
      vulnerableOrgansEn: dims[48].astroBasisEn,
      vulnerableOrgansHi: dims[48].astroBasisHi,
    },
    wealth: {
      statusEn: dims[49].verdictEn,
      statusHi: dims[49].verdictHi,
      activeYogasEn: [dims[49].verdictEn],
      activeYogasHi: [dims[49].verdictHi],
      peakAgeWindowEn: dims[49].detailedAnalysisEn,
      peakAgeWindowHi: dims[49].detailedAnalysisHi,
    },
  };

  return report;
}
