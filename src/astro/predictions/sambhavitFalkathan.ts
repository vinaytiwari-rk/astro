/**
 * Sambhavit Falkathan (Probable Life Predictions) Engine — 101 Classical Life Dimensions
 *
 * Exhaustive Vedic synthesis across Natal Chart (D1), Navamsha (D9), Drekkana (D3),
 * Chaturthamsha (D4), Saptamsha (D7), Ashtamsha (D8), Dashamsha (D10),
 * Dwadasamsha (D12), Shodashamsha (D16), Vimsamsha (D20), Chaturvimsamsha (D24),
 * Trimsamsha (D30), Shashtiamsha (D60), Ashtakavarga (SAV 337), and Vimshottari Dasha cycles.
 *
 * Complete integration of 101 Life Dimensions, Multi-Author Classical Attribution
 * (Parashara, Varahamihira, Kalyana Varma, Mantreswara, Jaimini, B.V. Raman, K.N. Rao, KP System),
 * Retrograde (Vakri) Chesta Bala, and Bhava Chalit displacement.
 */

import type { ChartData, NineGrahaId, SevenPlanetId } from '../types';
import { COMBUSTION_ORB, NAKSHATRAS, NINE_GRAHAS, SIGNS } from '../constants';
import { angularDiffDeg } from '../time';
import { getNakshatraSyllable, getAllNakshatraSyllables } from '../avakahadaChalit';
import { computeLifeEventsAndLedger } from './lifeEventsLedger';
import { build101LifeDimensions, type Classical101Context } from './classicalCorpus101';

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
  houseNumber?: number; // 1 to 12
  houseTitleHi?: string;
  houseTitleEn?: string;
  category: DimensionCategory | string;
  categoryTitleEn: string;
  categoryTitleHi: string;
  titleEn: string;
  titleHi: string;
  classicalRef?: string;
  divisionalRef?: string;
  vakriNote?: string;
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

const HINDI_SIGNS = [
  'मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या',
  'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुंभ', 'मीन'
];

const HINDI_PLANETS: Record<string, string> = {
  Sun: 'सूर्य', Moon: 'चंद्रमा', Mars: 'मंगल', Mercury: 'बुध',
  Jupiter: 'बृहस्पति (गुरु)', Venus: 'शुक्र', Saturn: 'शनि',
  Rahu: 'राहु', Ketu: 'केतु', Asc: 'लग्न'
};

const DIGNITY_HI_MAP: Record<string, string> = {
  Exalted: 'उच्च',
  Moolatrikona: 'मूलत्रिकोण',
  'Own Sign': 'स्वराशि',
  'Great Friend': 'अति मित्र',
  Friendly: 'मित्र',
  Neutral: 'सम',
  Enemy: 'शत्रु',
  'Great Enemy': 'अति शत्रु',
  Debilitated: 'नीच'
};

export function computeSambhavitFalkathan(chart: ChartData): SambhavitFalkathanReport {
  const asc = chart.ascendant;
  const planets = chart.planets;
  const ascSign = asc.signIndex;
  const ascSignName = SIGNS[ascSign].name;
  const ascSignHi = HINDI_SIGNS[ascSign];
  const ascLord = SIGNS[ascSign].lord;
  const ascLordHi = HINDI_PLANETS[ascLord] || ascLord;

  const getP = (id: NineGrahaId) => planets.find((p) => p.id === id) || planets[0];
  const sun = getP('Sun');
  const moon = getP('Moon');

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

  // House lord resolver with elevated Parashari parameters
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

  const h10 = getHLord(10);
  const ledger = computeLifeEventsAndLedger(chart);

  // Nakshatra & Pada
  const nakIdx = moon.nakshatraIndex ?? Math.floor(moon.longitude / (360 / 27));
  const pada = moon.pada || 1;
  const syl = getNakshatraSyllable(nakIdx, pada);
  const allSyl = getAllNakshatraSyllables(nakIdx);
  const nakName = moon.nakshatraName || 'Ashwini';

  // Build the complete 101 Life Dimensions
  const corpusContext: Classical101Context = {
    chart,
    ascSign,
    ascSignName,
    ascSignHi,
    ascLord,
    ascLordHi,
    planets,
    sav,
    currentAge,
    mdLord,
    adLord,
    mdLordHi,
    adLordHi,
    getHLord,
    getAspectsOnHouse,
    getKartariOnHouse,
  };

  const dims = build101LifeDimensions(corpusContext);

  // Summary counts across all 101 dimensions
  let hf = 0, f = 0, m = 0, c = 0;
  for (const d of dims) {
    if (d.auspiciousness === 'highly_favorable') hf++;
    else if (d.auspiciousness === 'favorable') f++;
    else if (d.auspiciousness === 'mixed_moderate') m++;
    else c++;
  }

  const summary: SambhavitSummary = {
    totalDimensions: dims.length, // 101
    highlyFavorableCount: hf,
    favorableCount: f,
    mixedCount: m,
    cautionCount: c,
    primaryLifeController: ledger.deityAndMainPlanet.mainPlanetEn,
    ishtaDevata: ledger.deityAndMainPlanet.ishtaDevataEn,
    dominantLifeFocusEn: `Anchored in ${ascSignName} Ascendant with ${h10.lord} controlling career, ${sav[9]} SAV in 10th and ${sav[10]} SAV in 11th.`,
    dominantLifeFocusHi: `${ascSignHi} लग्न, दशमेश ${h10.lordHi} के प्रभाव, दशम में ${sav[9]} एवं एकादश में ${sav[10]} अष्टकवर्ग बिंदुओं द्वारा संचालित।`,
  };

  // Safe accessor helper
  const getDim = (id: number) => dims.find((d) => d.id === id) || dims[0];

  const d1 = getDim(1);
  const d2 = getDim(2);
  const d3 = getDim(3);
  const d4 = getDim(4);
  const d7 = getDim(7);
  const d8 = getDim(8);
  const d10 = getDim(10);
  const d20 = getDim(20);
  const d24 = getDim(24);
  const d27 = getDim(27);
  const d31 = getDim(31);
  const d32 = getDim(32);
  const d35 = getDim(35);
  const d36 = getDim(36);
  const d37 = getDim(37);
  const d38 = getDim(38);
  const d39 = getDim(39);
  const d43 = getDim(43);
  const d46 = getDim(46);
  const d48 = getDim(48);
  const d55 = getDim(55);
  const d56 = getDim(56);
  const d57 = getDim(57);
  const d62 = getDim(62);
  const d65 = getDim(65);
  const d69 = getDim(69);
  const d70 = getDim(70);
  const d74 = getDim(74);
  const d75 = getDim(75);
  const d80 = getDim(80);
  const d83 = getDim(83);
  const d84 = getDim(84);
  const d89 = getDim(89);
  const d91 = getDim(91);
  const d92 = getDim(92);
  const d94 = getDim(94);
  const d97 = getDim(97);
  const d99 = getDim(99);
  const d100 = getDim(100);

  // Construct backward-compatible report structure
  const report: SambhavitFalkathanReport = {
    dimensions: dims,
    summary,

    namakshar: {
      primaryEn: syl.en,
      primaryHi: syl.hi,
      allPadasEn: allSyl.en,
      allPadasHi: allSyl.hi,
      nakshatraName: nakName,
      pada,
      explanationEn: `In Vedic Avakahada Chakra, sound vibration "${syl.en}" resonates with native's core Prana.`,
      explanationHi: `वैदिक अवकहड़ा चक्र अनुसार "${syl.hi}" नामाक्षर प्राण तत्व को सुदृढ़ करता है।`,
    },
    ishtaDevata: {
      nameEn: ledger.deityAndMainPlanet.ishtaDevataEn,
      nameHi: ledger.deityAndMainPlanet.ishtaDevataHi,
      basisEn: d10.astroBasisEn,
      basisHi: d10.astroBasisHi,
      mantra: ledger.deityAndMainPlanet.ishtaMantra,
    },
    mukhyaGraha: {
      planetEn: ledger.deityAndMainPlanet.mainPlanetEn,
      planetHi: ledger.deityAndMainPlanet.mainPlanetHi,
      roleEn: ledger.deityAndMainPlanet.supportingKingsEn,
      roleHi: ledger.deityAndMainPlanet.supportingKingsHi,
      rationaleEn: d7.detailedAnalysisEn,
      rationaleHi: d7.detailedAnalysisHi,
    },
    father: {
      temperamentEn: d75.verdictEn,
      temperamentHi: d75.verdictHi,
      professionEn: d89.verdictEn,
      professionHi: d89.verdictHi,
      lifespanEn: d75.detailedAnalysisEn,
      lifespanHi: d75.detailedAnalysisHi,
      relationshipEn: d75.verdictEn,
      relationshipHi: d75.verdictHi,
    },
    mother: {
      temperamentEn: d27.verdictEn,
      temperamentHi: d27.verdictHi,
      professionEn: d31.verdictEn,
      professionHi: d31.verdictHi,
      lifespanEn: d27.detailedAnalysisEn,
      lifespanHi: d27.detailedAnalysisHi,
      relationshipEn: d27.verdictEn,
      relationshipHi: d27.verdictHi,
    },
    siblings: {
      countProjectionEn: d20.verdictEn,
      countProjectionHi: d20.verdictHi,
      birthOrderEn: 'Determined by Lagna and 3rd house dispositor',
      birthOrderHi: 'लग्न व तृतीय भाव अनुसार जन्म क्रम',
      harmonyEn: d20.detailedAnalysisEn,
      harmonyHi: d20.detailedAnalysisHi,
    },
    marriage: {
      timingAgeWindowEn: d55.verdictEn,
      timingAgeWindowHi: d55.verdictHi,
      marriageYogasEn: d57.verdictEn,
      marriageYogasHi: d57.verdictHi,
      spouseNatureEn: d56.verdictEn,
      spouseNatureHi: d56.verdictHi,
      spouseAgeGapEn: d55.verdictEn,
      spouseAgeGapHi: d55.verdictHi,
      relationshipEn: d57.detailedAnalysisEn,
      relationshipHi: d57.detailedAnalysisHi,
    },
    children: {
      conceptionModeEn: d37.verdictEn,
      conceptionModeHi: d37.verdictHi,
      progenyCountEn: d37.verdictEn,
      progenyCountHi: d37.verdictHi,
      miscarriageRiskEn: d37.detailedAnalysisEn,
      miscarriageRiskHi: d37.detailedAnalysisHi,
      filialHappinessEn: d38.verdictEn,
      filialHappinessHi: d38.verdictHi,
      countAndGenderEn: d37.verdictEn,
      countAndGenderHi: d37.verdictHi,
      filialJoyEn: d38.verdictEn,
      filialJoyHi: d38.verdictHi,
    },
    education: {
      attainmentLevelEn: d39.verdictEn,
      attainmentLevelHi: d39.verdictHi,
      suitableStreamsEn: [d32.verdictEn],
      suitableStreamsHi: [d32.verdictHi],
      academicSuccessEn: d36.verdictEn,
      academicSuccessHi: d36.verdictHi,
      highestAttainmentEn: d39.verdictEn,
      highestAttainmentHi: d39.verdictHi,
      suitableFieldsEn: [d32.verdictEn],
      suitableFieldsHi: [d32.verdictHi],
    },
    career: {
      jobVsBusinessEn: d83.verdictEn,
      jobVsBusinessHi: d83.verdictHi,
      govtVsPrivateEn: d84.verdictEn,
      govtVsPrivateHi: d84.verdictHi,
      suitableProfessionsEn: [d91.verdictEn],
      suitableProfessionsHi: [d91.verdictHi],
      foreignTravelEn: d80.verdictEn,
      foreignTravelHi: d80.verdictHi,
      foreignSettlementEn: d97.verdictEn,
      foreignSettlementHi: d97.verdictHi,
    },
    longevity: {
      categoryEn: d4.verdictEn,
      categoryHi: d4.verdictHi,
      rangeEn: d65.verdictEn,
      rangeHi: d65.verdictHi,
      keyFactorsEn: d4.astroBasisEn,
      keyFactorsHi: d4.astroBasisHi,
    },
    bandhanaYoga: {
      hasRisk: false,
      verdictEn: d100.verdictEn,
      verdictHi: d100.verdictHi,
      mitigationEn: d100.remedyEn,
      mitigationHi: d100.remedyHi,
    },
    surgeryYoga: {
      hasRisk: false,
      riskLevelEn: d69.verdictEn,
      riskLevelHi: d69.verdictHi,
      vulnerableAreasEn: d69.astroBasisEn,
      vulnerableAreasHi: d69.astroBasisHi,
      timingEn: d69.verdictEn,
      timingHi: d69.verdictHi,
    },
    physicalMarks: {
      identificationEn: d8.verdictEn,
      identificationHi: d8.verdictHi,
      locationsEn: [d8.verdictEn],
      locationsHi: [d8.verdictHi],
    },
    addictions: {
      vulnerabilitiesEn: ['Sensory overindulgence during high stress'],
      vulnerabilitiesHi: ['अत्यधिक तनाव में खानपान या दिनचर्या में असंतुलन'],
      adviceEn: 'Practice regular meditation and avoid late night stimulants.',
      adviceHi: 'नियमित ध्यान करें और देर रात उत्तेजक पदार्थों से बचें।',
    },
    bedPleasure: {
      shayanaSukhaEn: d99.verdictEn,
      shayanaSukhaHi: d99.verdictHi,
      sexualityEn: d62.verdictEn,
      sexualityHi: d62.verdictHi,
    },
    friends: {
      natureEn: d94.verdictEn,
      natureHi: d94.verdictHi,
      loyaltyVerdictEn: d94.detailedAnalysisEn,
      loyaltyVerdictHi: d94.detailedAnalysisHi,
    },
    cautions: {
      hazardsEn: [d48.verdictEn, d70.verdictEn, 'Overconfidence in financial schemes', 'Neglecting routine health examinations'],
      hazardsHi: [d48.verdictHi, d70.verdictHi, 'वित्तीय योजनाओं में अति-विश्वास', 'स्वास्थ्य की नियमित जांच में लापरवाही'],
      warningNoteEn: d48.detailedAnalysisEn || 'Maintain ethical transparency and health awareness.',
      warningNoteHi: d48.detailedAnalysisHi || 'कार्यक्षेत्र में पारदर्शिता और स्वास्थ्य के प्रति सजगता बनाए रखें।',
    },
    crisisStrategy: {
      primaryDeityEn: ledger.deityAndMainPlanet.ishtaDevataEn,
      primaryDeityHi: ledger.deityAndMainPlanet.ishtaDevataHi,
      rescueMantra: ledger.deityAndMainPlanet.ishtaMantra,
      actionProtocolEn: d10.remedyEn,
      actionProtocolHi: d10.remedyHi,
    },
    sports: {
      preferencesEn: d24.verdictEn.split(/[,;]/).map((s) => s.trim()).filter(Boolean),
      preferencesHi: d24.verdictHi.split(/[,;।]/).map((s) => s.trim()).filter(Boolean),
      fitnessStyleEn: d24.detailedAnalysisEn,
      fitnessStyleHi: d24.detailedAnalysisHi,
    },
    temperament: {
      traitSummaryEn: d2.verdictEn,
      traitSummaryHi: d2.verdictHi,
      gunaEn: d2.astroBasisEn,
      gunaHi: d2.astroBasisHi,
    },
    loveLife: {
      romanceEn: d43.verdictEn,
      romanceHi: d43.verdictHi,
      marriageTypeEn: d43.detailedAnalysisEn,
      marriageTypeHi: d43.detailedAnalysisHi,
    },
    mentalHealth: {
      conditionEn: d35.verdictEn,
      conditionHi: d35.verdictHi,
      vulnerabilitiesEn: d35.astroBasisEn,
      vulnerabilitiesHi: d35.astroBasisHi,
      remedyEn: d35.remedyEn,
      remedyHi: d35.remedyHi,
    },
    health: {
      constitutionEn: d1.verdictEn,
      constitutionHi: d1.verdictHi,
      vulnerableOrgansEn: d46.astroBasisEn,
      vulnerableOrgansHi: d46.astroBasisHi,
    },
    wealth: {
      statusEn: d92.verdictEn,
      statusHi: d92.verdictHi,
      activeYogasEn: [d92.verdictEn],
      activeYogasHi: [d92.verdictHi],
      peakAgeWindowEn: d74.verdictEn,
      peakAgeWindowHi: d74.verdictHi,
    },
  };

  return report;
}
