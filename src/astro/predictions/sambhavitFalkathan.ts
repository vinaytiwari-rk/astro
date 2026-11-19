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

import type { ChartData, DivisionalChartId, NineGrahaId, SevenPlanetId } from '../types';
import { COMBUSTION_ORB, NAKSHATRAS, NINE_GRAHAS, SIGNS } from '../constants';
import { angularDiffDeg } from '../time';
import { getNakshatraSyllable, getAllNakshatraSyllables } from '../avakahadaChalit';
import { computeLifeEventsAndLedger } from './lifeEventsLedger';
import { build51LifeDimensions, type Classical51Context } from './classicalCorpus51';
import { computePredictionFramework, type PredictionDomainEvidence } from './predictionFramework';

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
  strengthScore: number; // Legacy heuristic only; not a probability
  auspiciousness: AuspiciousnessLevel;
  timingHi?: string;
  timingEn?: string;
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
  domainEvidence: PredictionDomainEvidence[];
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
  const domainEvidence = computePredictionFramework(chart, now);
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
      const fromH = p.rasiHouseNumber ?? p.houseNumber;
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
    const prevMal = planets.some((p) => (p.rasiHouseNumber ?? p.houseNumber) === prevH && ['Saturn', 'Mars', 'Rahu', 'Ketu', 'Sun'].includes(p.id));
    const nextMal = planets.some((p) => (p.rasiHouseNumber ?? p.houseNumber) === nextH && ['Saturn', 'Mars', 'Rahu', 'Ketu', 'Sun'].includes(p.id));
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
    const occupants = planets.filter((p) => (p.rasiHouseNumber ?? p.houseNumber) === h);
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
      placedHouse: planet.rasiHouseNumber ?? planet.houseNumber,
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

  // Build the complete 51 Master Life Dimensions
  const corpusContext: Classical51Context = {
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

  const rawDims = build51LifeDimensions(corpusContext);

  // 21 selected dimensions are re-interpreted from the actual house-lord,
  // occupant, Ashtakavarga and Vimshottari data. The legacy corpus score is
  // retained for compatibility only; it is not a probability or evidence.
  const KARAKA_BY_DIMENSION: Record<number, string[]> = {
    1: ['Sun'], 5: ['Jupiter'], 9: ['Mars'], 10: ['Mars'], 12: ['Moon'],
    13: ['Moon'], 14: ['Moon'], 17: ['Mercury', 'Jupiter'], 19: ['Jupiter'],
    20: ['Jupiter'], 22: ['Saturn'], 24: ['Mars', 'Saturn'], 26: ['Venus'],
    27: ['Venus'], 31: ['Saturn'], 34: ['Ketu', 'Jupiter'], 37: ['Jupiter'],
    39: ['Sun', 'Saturn', 'Mercury'], 44: ['Jupiter'], 48: ['Rahu', 'Moon'],
    51: ['Ketu', 'Jupiter'],
  };
  const formatPeriodDate = (ms: number) => new Intl.DateTimeFormat('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  }).format(new Date(ms));
  const allDashaPeriods = (chart.vimshottari ?? []).flatMap((period) => [
    period,
    ...(period.children ?? []),
  ]);
  const VARGA_BY_DIMENSION: Record<number, DivisionalChartId> = {
    1: 'D1', 5: 'D2', 9: 'D3', 10: 'D3', 12: 'D3',
    13: 'D12', 14: 'D12', 17: 'D24', 19: 'D7', 20: 'D7',
    22: 'D6', 24: 'D1', 26: 'D9', 27: 'D9', 31: 'D8',
    34: 'D20', 37: 'D9', 39: 'D10', 44: 'D2', 48: 'D1', 51: 'D20',
  };
  const MASTER_21_IDS = [1, 5, 9, 10, 12, 13, 14, 17, 19, 20, 22, 24, 26, 27, 31, 34, 37, 39, 44, 48, 51];
  const dims = rawDims
    .filter((d) => MASTER_21_IDS.includes(d.id))
    .map((d) => {
      const house = d.houseNumber;
      if (!house || house < 1 || house > 12) {
        const unavailableHi = 'इस फलादेश के लिए मूल भाव-संबंध उपलब्ध डेटा में स्पष्ट नहीं है। इसलिए व्यक्तिगत निष्कर्ष या समय-सीमा देना उचित नहीं होगा।';
        const unavailableEn = 'The source-house mapping is unavailable in the supplied chart data. No personalized conclusion or timing window is stated.';
        return {
          ...d,
          verdictHi: unavailableHi,
          verdictEn: unavailableEn,
          detailedAnalysisHi: unavailableHi,
          detailedAnalysisEn: unavailableEn,
          astroBasisHi: unavailableHi,
          astroBasisEn: unavailableEn,
          timingHi: unavailableHi,
          timingEn: unavailableEn,
        };
      }
      const lord = getHLord(house);
      const occupants = planets.filter((planet) => (planet.rasiHouseNumber ?? planet.houseNumber) === house && planet.id !== 'Asc');
      const aspects = lord.aspects as Array<{ planet: string; planetHi: string; isBenefic: boolean }>;
      const dignityWeight: Record<string, number> = {
        Exalted: 2, Moolatrikona: 2, 'Own Sign': 2, 'Great Friend': 1,
        Friendly: 1, Neutral: 0, Enemy: -1, 'Great Enemy': -2, Debilitated: -2,
      };
      const bindus = sav[house - 1] ?? 28;
      const evidenceBalance =
        (dignityWeight[lord.dignity] ?? 0) +
        (bindus >= 30 ? 1 : bindus <= 24 ? -1 : 0) +
        Math.max(-2, Math.min(2, aspects.reduce((sum, aspect) => sum + (aspect.isBenefic ? 1 : -1), 0))) +
        (lord.kartari === 'Subhakartari' ? 1 : lord.kartari === 'Papakartari' ? -1 : 0);
      const auspiciousness: AuspiciousnessLevel = evidenceBalance >= 3
        ? 'highly_favorable'
        : evidenceBalance >= 1
          ? 'favorable'
          : evidenceBalance <= -2
            ? 'challenging_caution'
            : 'mixed_moderate';
      const toneHi = auspiciousness === 'highly_favorable' || auspiciousness === 'favorable'
        ? 'सहयोगी संकेत अपेक्षाकृत अधिक हैं'
        : auspiciousness === 'challenging_caution'
          ? 'इस विषय में अतिरिक्त सावधानी और प्रयास की जरूरत हो सकती है'
          : 'इस विषय में मिले-जुले संकेत हैं';
      const toneEn = auspiciousness === 'highly_favorable' || auspiciousness === 'favorable'
        ? 'the chart has relatively more supportive indications'
        : auspiciousness === 'challenging_caution'
          ? 'this area may need extra care and effort'
          : 'the chart shows mixed indications';
      const occupantTextHi = occupants.length
        ? occupants.map((planet) => HINDI_PLANETS[planet.id] || planet.id).join(', ')
        : 'इस भाव में कोई ग्रह स्थित नहीं है';
      const occupantTextEn = occupants.length
        ? occupants.map((planet) => planet.id).join(', ')
        : 'no planet occupies this house';
      const aspectTextHi = aspects.length
        ? aspects.map((aspect) => `${aspect.planetHi} की ${aspect.isBenefic ? 'शुभ' : 'कठोर'} दृष्टि`).join(', ')
        : 'विशेष ग्रह-दृष्टि दर्ज नहीं है';
      const aspectTextEn = aspects.length
        ? aspects.map((aspect) => `${aspect.planet} (${aspect.isBenefic ? 'supportive' : 'challenging'} aspect)`).join(', ')
        : 'no special planetary aspect is recorded';
      const karakas = KARAKA_BY_DIMENSION[d.id] ?? [];
      const karakaPlanets = karakas
        .map((id) => planets.find((planet) => planet.id === id))
        .filter((planet): planet is (typeof planets)[number] => Boolean(planet));
      const karakaTextHi = karakaPlanets.length
        ? karakaPlanets.map((planet) => `${HINDI_PLANETS[planet.id] || planet.id} भाव ${planet.rasiHouseNumber ?? planet.houseNumber} में (${DIGNITY_HI_MAP[planet.dignity || 'Neutral'] || planet.dignity || 'अज्ञात बल'} स्थिति)`).join('; ')
        : 'इस विषय के कारक ग्रहों की स्थिति उपलब्ध डेटा में दर्ज नहीं है';
      const karakaTextEn = karakaPlanets.length
        ? karakaPlanets.map((planet) => `${planet.id} in House ${planet.rasiHouseNumber ?? planet.houseNumber} (${planet.dignity || 'unknown'} dignity)`).join('; ')
        : 'the relevant natural significator placements are unavailable';
      const relevantPlanets = new Set<string>([
        lord.lord,
        ...occupants.map((planet) => planet.id),
        ...karakas,
      ]);
      const vargaId = VARGA_BY_DIMENSION[d.id] ?? 'D1';
      const varga = chart.divisionalCharts?.[vargaId];
      const vargaPlacements = varga?.placements.filter(
        (placement) => placement.id === 'Asc' || relevantPlanets.has(placement.id),
      ) ?? [];
      const vargaTextHi = varga && vargaPlacements.length
        ? `${vargaId} ${varga.sanskritName}: ${vargaPlacements.map((placement) => `${placement.id === 'Asc' ? 'वर्ग लग्न' : HINDI_PLANETS[placement.id] || placement.id} ${placement.signName}, वर्ग लग्न से भाव ${placement.houseFromVargaLagna}, ${DIGNITY_HI_MAP[placement.dignity] || placement.dignity}`).join('; ')}`
        : `${vargaId} वर्ग-कुंडली का संबंधित ग्रह-डेटा उपलब्ध नहीं है`;
      const vargaTextEn = varga && vargaPlacements.length
        ? `${vargaId} ${varga.name}: ${vargaPlacements.map((placement) => `${placement.id} in ${placement.signName}, House ${placement.houseFromVargaLagna} from varga ascendant, ${placement.dignity}`).join('; ')}`
        : `the relevant ${vargaId} divisional placements are unavailable`;
      const matchingPeriods = allDashaPeriods
        .filter((period) => relevantPlanets.has(period.lord) && period.endMs > now)
        .sort((a, b) => a.startMs - b.startMs);
      const activeRelevant = matchingPeriods
        .filter((period) => period.startMs <= now && now < period.endMs)
        .sort((a, b) => b.level - a.level)[0];
      const nextRelevant = matchingPeriods
        .filter((period) => period.startMs > now)
        .sort((a, b) => a.startMs - b.startMs || b.level - a.level)
        .slice(0, 2);
      let timingHi = 'उपलब्ध विंशोत्तरी दशा डेटा में इस विषय से जुड़ी निकट अवधि स्पष्ट नहीं है; इसलिए समय-सीमा बताना उचित नहीं होगा।';
      let timingEn = 'The available Vimshottari data does not identify a clear near-term period for this topic, so no timing window is stated.';
      if (activeRelevant) {
        timingHi = `इस विषय से जुड़े ग्रह ${HINDI_PLANETS[activeRelevant.lord] || activeRelevant.lord} की ${activeRelevant.level === 1 ? 'महादशा' : activeRelevant.level === 2 ? 'अंतर्दशा' : 'सूक्ष्म दशा'} अभी सक्रिय है; उपलब्ध गणना के अनुसार यह ${formatPeriodDate(activeRelevant.endMs)} तक चलेगी। यह विषय के सक्रिय होने का पारंपरिक संकेत है, घटना की गारंटी नहीं।`;
        timingEn = `${activeRelevant.lord}'s ${activeRelevant.level === 1 ? 'Mahadasha' : activeRelevant.level === 2 ? 'Antardasha' : 'sub-period'} linked to this topic is active until ${formatPeriodDate(activeRelevant.endMs)}. This is a traditional activation indicator, not a guaranteed event.`;
      } else if (nextRelevant.length) {
        timingHi = `अगली संबंधित दशा ${HINDI_PLANETS[nextRelevant[0].lord] || nextRelevant[0].lord} की ${formatPeriodDate(nextRelevant[0].startMs)} से ${formatPeriodDate(nextRelevant[0].endMs)} तक है। इसे संभावित सक्रियता-अवधि समझें, निश्चित घटना का समय नहीं।`;
        timingEn = `The next related period is ${nextRelevant[0].lord}, from ${formatPeriodDate(nextRelevant[0].startMs)} to ${formatPeriodDate(nextRelevant[0].endMs)}. Treat this as a possible activation window, not a promised event date.`;
      }
      const verdictHi = `इस विषय का मुख्य आधार ${lord.lordHi} हैं। वे ${lord.placedHouse}वें भाव में ${lord.dignityHi} स्थिति में हैं। ${occupantTextHi}। भाव के ${bindus} सर्वाष्टकवर्ग बिंदु और ${aspectTextHi} को साथ पढ़ने पर ${toneHi}। इसे निश्चित घटना या प्रतिशत संभावना न समझें।`;
      const verdictEn = `The main house-lord indicator is ${lord.lord} in House ${lord.placedHouse} with ${lord.dignity} dignity. The house has ${occupantTextEn}; its Sarvashtakavarga score is ${bindus}, with ${aspectTextEn}. Overall, ${toneEn}. This is not a probability or a guaranteed event.`;
      const chartBasisHi = `कुंडली में दर्ज आधार: D1 लग्न ${chart.ascendant.signName} ${chart.ascendant.dms}; ${lord.lordHi} भाव ${lord.placedHouse} में (${lord.dignityHi}); भाव में स्थित ग्रह: ${occupantTextHi}; सर्वाष्टकवर्ग: ${bindus} बिंदु; दृष्टि: ${aspectTextHi}; प्राकृतिक कारक ग्रह: ${karakaTextHi}; वर्ग-कुंडली प्रमाण: ${vargaTextHi}।`;
      const chartBasisEn = `Recorded chart evidence: D1 ascendant ${chart.ascendant.signName} ${chart.ascendant.dms}; ${lord.lord} in House ${lord.placedHouse} (${lord.dignity}); occupants: ${occupantTextEn}; Sarvashtakavarga: ${bindus} bindus; aspects: ${aspectTextEn}; natural significators: ${karakaTextEn}; divisional evidence: ${vargaTextEn}.`;
      const safetyOverrides: Record<number, { titleHi?: string; titleEn?: string; verdictHi: string; verdictEn: string; analysisHi: string; analysisEn: string }> = {
        14: {
          titleHi: 'मातृ-संबंध, पारिवारिक वातावरण और देखभाल',
          titleEn: 'Maternal Relationship, Family Environment & Caregiving',
          verdictHi: 'चतुर्थ भाव, चंद्र और मातृ-संबंधित पारंपरिक संकेत परिवार, घरेलू वातावरण और देखभाल की थीम पर विचार करने में सहायक हो सकते हैं। इनसे माता की आयु, स्वास्थ्य या जीवनकाल का अनुमान नहीं लगाया जा सकता।',
          verdictEn: 'The fourth house, Moon and traditional maternal indicators may be discussed in relation to family, home and caregiving themes. They cannot establish a mother’s health, lifespan or longevity.',
          analysisHi: 'यह ज्योतिषीय विवेचन माता की आयु या स्वास्थ्य का आकलन नहीं है। वास्तविक स्वास्थ्य-संबंधी प्रश्नों के लिए चिकित्सकीय जानकारी और योग्य चिकित्सक की सलाह ही उपयुक्त आधार हैं।',
          analysisEn: 'This is not an assessment of a mother’s health or lifespan. Real health questions should be addressed using medical information and qualified clinical advice.',
        },
        22: {
          titleHi: 'दिनचर्या, कार्यभार और व्यावहारिक स्वास्थ्य-जिम्मेदारी',
          titleEn: 'Daily Routines, Workload & Practical Wellbeing',
          verdictHi: 'षष्ठ भाव के पारंपरिक संकेत दिनचर्या, सेवा, काम के दबाव और कठिनाइयों से निपटने की शैली पर विचार दे सकते हैं। इनसे रोग, अंग-विशेष की कमजोरी, प्रतिरोधक क्षमता या उपचार-परिणाम का निदान नहीं किया जा सकता।',
          verdictEn: 'Traditional sixth-house symbolism may prompt reflection on routines, service, workload and ways of handling difficulties. It cannot diagnose disease, organ weakness, immunity or treatment outcomes.',
          analysisHi: 'ग्रह-स्थिति किसी बीमारी या शारीरिक दुर्बलता का प्रमाण नहीं है। लक्षणों, जांच और उपचार के लिए योग्य चिकित्सक से संपर्क करें; ज्योतिष को चिकित्सा का विकल्प न मानें।',
          analysisEn: 'Planetary placements are not evidence of disease or physical weakness. Consult a qualified clinician for symptoms, tests and treatment; astrology is not a substitute for medical care.',
        },
        24: {
          titleHi: 'प्रतिस्पर्धा, विवाद और कानूनी प्रक्रिया में सावधानी',
          titleEn: 'Competition, Disputes & Legal Process Awareness',
          verdictHi: 'षष्ठ भाव प्रतिस्पर्धा, विवाद और प्रक्रिया-संबंधी चुनौतियों का पारंपरिक संकेतक है। इससे किसी विरोधी की पहचान, षड्यंत्र, मुकदमे का परिणाम या निश्चित विजय घोषित नहीं की जा सकती।',
          verdictEn: 'The sixth house is traditionally associated with competition, disputes and procedural challenges. It cannot identify an enemy, establish a conspiracy, or guarantee a legal outcome or victory.',
          analysisHi: 'कानूनी विवाद में दस्तावेज, समय-सीमा, साक्ष्य और योग्य अधिवक्ता की सलाह निर्णायक व्यावहारिक आधार हैं। ज्योतिषीय संकेतों को कानूनी रणनीति या परिणाम का विकल्प न बनाएं।',
          analysisEn: 'In legal matters, documents, deadlines, evidence and advice from a qualified lawyer are the practical basis for decisions. Astrological symbolism cannot replace legal strategy or predict a court outcome.',
        },
        26: {
          titleHi: 'विवाह-विषयक संकेत और संभावित दशा-अवधियां',
          titleEn: 'Marriage Themes & Possible Dasha Activation Periods',
          verdictHi: 'सप्तम भाव, सप्तमेश और शुक्र विवाह-विषयक पारंपरिक अध्ययन के संकेतक हैं। उपलब्ध गणना में संबंधित दशा-अवधि को केवल संभावित सक्रियता के रूप में पढ़ें; इससे विवाह की निश्चित तारीख या आयु तय नहीं होती।',
          verdictEn: 'The seventh house, its ruler and Venus are traditional marriage indicators. The related dasha period is only a possible activation window in this calculation; it does not determine a certain marriage date or age.',
          analysisHi: 'विवाह का निर्णय व्यक्तिगत इच्छा, सहमति, संबंध की वास्तविक स्थिति और जीवन-परिस्थितियों पर निर्भर करता है। ज्योतिषीय समय-संकेत को निश्चित घटना न समझें।',
          analysisEn: 'Marriage decisions depend on personal choice, consent, the actual relationship and life circumstances. Do not treat an astrological timing indicator as a certain event.',
        },
        31: {
          titleHi: 'परिवर्तन, धैर्य और दीर्घकालीन जिम्मेदारियां',
          titleEn: 'Change, Resilience & Long-Term Responsibilities',
          verdictHi: 'अष्टम भाव, लग्नेश और शनि को परंपरागत रूप से परिवर्तन, धैर्य और दीर्घकालीन जिम्मेदारियों के संदर्भ में देखा जाता है। इनसे आयु-खंड, मृत्यु-समय, मृत्यु-कारण या जीवनकाल का विश्वसनीय अनुमान नहीं लगाया जा सकता।',
          verdictEn: 'The eighth house, ascendant ruler and Saturn are traditionally discussed in relation to change, resilience and long-term responsibilities. They cannot reliably estimate lifespan, age at death, timing or cause of death.',
          analysisHi: 'इस फलादेश में कोई आयु-सीमा या मृत्यु-संबंधी निष्कर्ष नहीं दिया जाता। स्वास्थ्य और जीवन-योजना के निर्णय वास्तविक परिस्थितियों, प्रमाण और योग्य विशेषज्ञों की सलाह पर आधारित होने चाहिए।',
          analysisEn: 'This reading makes no lifespan or death-related estimate. Health and life-planning decisions should be based on real circumstances, evidence and qualified professional advice.',
        },
        39: {
          titleHi: 'पेशेवर दिशा, कार्य-भूमिका और आजीविका विकल्प',
          titleEn: 'Professional Direction, Work Roles & Livelihood Options',
          verdictHi: 'दशम भाव और दशमेश कार्य, जिम्मेदारी, पेशेवर भूमिका और सार्वजनिक योगदान के पारंपरिक संकेतक हैं। उपलब्ध D1 आधार अकेले यह तय नहीं करता कि नौकरी या व्यवसाय में से कौन-सा मार्ग निश्चित रूप से सफल होगा।',
          verdictEn: 'The tenth house and its ruler are traditional indicators of work, responsibility, professional role and public contribution. The available D1 evidence alone cannot determine whether employment or business will certainly succeed.',
          analysisHi: 'करियर के निर्णय कौशल, अनुभव, अवसर, आर्थिक स्थिति, रुचि और वास्तविक कार्य-बाजार को देखकर लें। इस रिपोर्ट में नौकरी बनाम व्यवसाय का कोई निश्चित अनुपात या सांख्यिकीय संभावना नहीं दी जाती।',
          analysisEn: 'Career decisions should consider skills, experience, opportunities, finances, preferences and the actual labor market. This report does not assign a fixed employment-versus-business split or statistical probability.',
        },
        48: {
          titleHi: 'दूरस्थ स्थान, विदेश-संबंधी विषय और व्यय',
          titleEn: 'Distant Places, Foreign-Related Themes & Expenditure',
          verdictHi: 'द्वादश भाव दूरस्थ स्थान, खर्च, विश्राम और विदेश-संबंधी विषयों का पारंपरिक संकेतक है। यह अकेले विदेश यात्रा, स्थायी प्रवास, वीजा या विदेशी आय की गारंटी नहीं देता।',
          verdictEn: 'The twelfth house is traditionally associated with distant places, expenditure, retreat and foreign-related themes. By itself it does not guarantee travel, permanent relocation, a visa or overseas income.',
          analysisHi: 'विदेश जाने या बसने की वास्तविक संभावना योग्यता, वीजा नियम, रोजगार, वित्त और व्यक्तिगत विकल्पों पर निर्भर करती है। ज्योतिषीय संकेत को निश्चित प्रवास न समझें।',
          analysisEn: 'Actual prospects for travel or relocation depend on eligibility, visa rules, employment, finances and personal choices. Do not interpret astrological symbolism as a guaranteed move.',
        },
        51: {
          titleHi: 'आध्यात्मिक अभ्यास, एकांत और आत्मचिंतन',
          titleEn: 'Spiritual Practice, Solitude & Reflection',
          verdictHi: 'द्वादश भाव और केतु को पारंपरिक रूप से एकांत, ध्यान, त्याग और आध्यात्मिक अभ्यास से जोड़ा जाता है। मोक्ष या समाधि जैसी आध्यात्मिक उपलब्धि की गारंटी कुंडली से नहीं दी जा सकती।',
          verdictEn: 'The twelfth house and Ketu are traditionally associated with solitude, meditation, renunciation and spiritual practice. A chart cannot guarantee moksha or samadhi.',
          analysisHi: 'आध्यात्मिक प्रगति व्यक्तिगत साधना, नैतिक आचरण, अनुभव और परंपरा से जुड़ी है। इस फलादेश को प्रतीकात्मक चिंतन समझें, किसी आध्यात्मिक उपलब्धि का निश्चित दावा नहीं।',
          analysisEn: 'Spiritual development involves personal practice, ethical conduct, experience and tradition. Treat this reading as symbolic reflection, not a guaranteed spiritual attainment.',
        },
      };
      const safety = safetyOverrides[d.id];
      const analysisHi = (safety?.analysisHi ?? `${d.detailedAnalysisHi}\n\nव्यक्तिगत कुंडली-पठन: ${chartBasisHi} यह विवेचन पारंपरिक ज्योतिषीय संकेत है, निश्चित घटना या वैज्ञानिक निदान नहीं।`) + `\n\n${chartBasisHi}`;
      const analysisEn = (safety?.analysisEn ?? `${d.detailedAnalysisEn}\n\nChart-specific synthesis: ${chartBasisEn} This is a traditional astrological interpretation, not a guaranteed event or scientific diagnosis.`) + `\n\n${chartBasisEn}`;
      const suppressSensitiveTiming = [14, 22, 31].includes(d.id);
      return {
        ...d,
        id: d.id,
        titleHi: safety?.titleHi ?? d.titleHi,
        titleEn: safety?.titleEn ?? d.titleEn,
        astroBasisHi: chartBasisHi,
        astroBasisEn: chartBasisEn,
        verdictHi: `${safety?.verdictHi ?? verdictHi} ${chartBasisHi}`,
        verdictEn: `${safety?.verdictEn ?? verdictEn} ${chartBasisEn}`,
        detailedAnalysisHi: analysisHi,
        detailedAnalysisEn: analysisEn,
        auspiciousness,
        timingHi: suppressSensitiveTiming ? 'इस विषय में स्वास्थ्य या आयु से संबंधित समय-सीमा बताना उचित नहीं है।' : timingHi,
        timingEn: suppressSensitiveTiming ? 'No health- or lifespan-related timing window is stated for this topic.' : timingEn,
      };
    });

  // Summary counts across all 21 dimensions
  let hf = 0, f = 0, m = 0, c = 0;
  for (const d of dims) {
    if (d.auspiciousness === 'highly_favorable') hf++;
    else if (d.auspiciousness === 'favorable') f++;
    else if (d.auspiciousness === 'mixed_moderate') m++;
    else c++;
  }

  const summary: SambhavitSummary = {
    totalDimensions: dims.length, // 21
    highlyFavorableCount: hf,
    favorableCount: f,
    mixedCount: m,
    cautionCount: c,
    primaryLifeController: ledger.deityAndMainPlanet.mainPlanetEn,
    ishtaDevata: ledger.deityAndMainPlanet.ishtaDevataEn,
    dominantLifeFocusEn: `Anchored in ${ascSignName} Ascendant with ${h10.lord} controlling career, ${sav[9]} SAV in 10th and ${sav[10]} SAV in 11th.`,
    dominantLifeFocusHi: `${ascSignHi} लग्न, दशमेश ${h10.lordHi} के प्रभाव, दशम में ${sav[9]} एवं एकादश में ${sav[10]} अष्टकवर्ग बिंदुओं द्वारा संचालित।`,
  };

  // Safe accessor helper (queries rawDims for complete corpus data)
  const getDim = (id: number) => rawDims.find((d) => d.id === id) || rawDims[0];

  const d1 = getDim(1);
  const d2 = getDim(2);
  const d3 = getDim(3);
  const d4 = getDim(4);
  const d5 = getDim(5);
  const d9 = getDim(9);
  const d10 = getDim(10);
  const d13 = getDim(13);
  const d14 = getDim(14);
  const d17 = getDim(17);
  const d18 = getDim(18);
  const d19 = getDim(19);
  const d20 = getDim(20);
  const d21 = getDim(21);
  const d22 = getDim(22);
  const d26 = getDim(26);
  const d27 = getDim(27);
  const d28 = getDim(28);
  const d31 = getDim(31);
  const d33 = getDim(33);
  const d35 = getDim(35);
  const d36 = getDim(36);
  const d38 = getDim(38);
  const d39 = getDim(39);
  const d40 = getDim(40);
  const d41 = getDim(41);
  const d43 = getDim(43);
  const d44 = getDim(44);
  const d45 = getDim(45);
  const d48 = getDim(48);
  const d50 = getDim(50);

  // Construct backward-compatible report structure
  const report: SambhavitFalkathanReport = {
    dimensions: dims,
    domainEvidence,
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
      basisEn: d18.astroBasisEn,
      basisHi: d18.astroBasisHi,
      mantra: ledger.deityAndMainPlanet.ishtaMantra,
    },
    mukhyaGraha: {
      planetEn: ledger.deityAndMainPlanet.mainPlanetEn,
      planetHi: ledger.deityAndMainPlanet.mainPlanetHi,
      roleEn: ledger.deityAndMainPlanet.supportingKingsEn,
      roleHi: ledger.deityAndMainPlanet.supportingKingsHi,
      rationaleEn: d3.detailedAnalysisEn,
      rationaleHi: d3.detailedAnalysisHi,
    },
    father: {
      temperamentEn: d35.verdictEn,
      temperamentHi: d35.verdictHi,
      professionEn: d35.detailedAnalysisEn,
      professionHi: d35.detailedAnalysisHi,
      lifespanEn: 'Astrology cannot assess a father’s health or lifespan.',
      lifespanHi: 'ज्योतिष से पिता के स्वास्थ्य या जीवनकाल का आकलन नहीं किया जा सकता।'
      relationshipEn: d35.verdictEn,
      relationshipHi: d35.verdictHi,
    },
    mother: {
      temperamentEn: d13.verdictEn,
      temperamentHi: d13.verdictHi,
      professionEn: d13.detailedAnalysisEn,
      professionHi: d13.detailedAnalysisHi,
      lifespanEn: 'Astrology cannot assess a mother’s health or lifespan.',
      lifespanHi: 'ज्योतिष से माता के स्वास्थ्य या जीवनकाल का आकलन नहीं किया जा सकता।'
      relationshipEn: d13.verdictEn,
      relationshipHi: d13.verdictHi,
    },
    siblings: {
      countProjectionEn: d9.verdictEn,
      countProjectionHi: d9.verdictHi,
      birthOrderEn: 'Determined by Lagna and 3rd house dispositor',
      birthOrderHi: 'लग्न व तृतीय भाव अनुसार जन्म क्रम',
      harmonyEn: d9.detailedAnalysisEn,
      harmonyHi: d9.detailedAnalysisHi,
    },
    marriage: {
      timingAgeWindowEn: d26.verdictEn,
      timingAgeWindowHi: d26.verdictHi,
      marriageYogasEn: d28.verdictEn,
      marriageYogasHi: d28.verdictHi,
      spouseNatureEn: d27.verdictEn,
      spouseNatureHi: d27.verdictHi,
      spouseAgeGapEn: 'A chart cannot reliably determine a spouse’s age or age gap.',
      spouseAgeGapHi: 'कुंडली से जीवनसाथी की आयु या आयु-अंतर विश्वसनीय रूप से निर्धारित नहीं किया जा सकता।'
      relationshipEn: d28.detailedAnalysisEn,
      relationshipHi: d28.detailedAnalysisHi,
    },
    children: {
      conceptionModeEn: d19.verdictEn,
      conceptionModeHi: d19.verdictHi,
      progenyCountEn: 'No prediction of number or sex of children is made.',
      progenyCountHi: 'संतानों की संख्या या लिंग का कोई अनुमान नहीं दिया जाता।'
      miscarriageRiskEn: 'Astrology cannot assess miscarriage risk, fertility or pregnancy outcomes. Consult a qualified clinician for medical questions.',
      miscarriageRiskHi: 'ज्योतिष से गर्भपात का जोखिम, प्रजनन क्षमता या गर्भावस्था का परिणाम निर्धारित नहीं किया जा सकता। चिकित्सकीय प्रश्नों के लिए योग्य चिकित्सक से सलाह लें।'
      filialHappinessEn: d19.detailedAnalysisEn,
      filialHappinessHi: d19.detailedAnalysisHi,
      countAndGenderEn: 'No prediction of children’s number or gender is made.',
      countAndGenderHi: 'संतानों की संख्या या लिंग का कोई अनुमान नहीं दिया जाता।'
      filialJoyEn: d19.detailedAnalysisEn,
      filialJoyHi: d19.detailedAnalysisHi,
    },
    education: {
      attainmentLevelEn: d17.verdictEn,
      attainmentLevelHi: d17.verdictHi,
      suitableStreamsEn: [d17.verdictEn],
      suitableStreamsHi: [d17.verdictHi],
      academicSuccessEn: d17.detailedAnalysisEn,
      academicSuccessHi: d17.detailedAnalysisHi,
      highestAttainmentEn: d38.verdictEn,
      highestAttainmentHi: d38.verdictHi,
      suitableFieldsEn: [d17.verdictEn],
      suitableFieldsHi: [d17.verdictHi],
    },
    career: {
      jobVsBusinessEn: d39.verdictEn,
      jobVsBusinessHi: d39.verdictHi,
      govtVsPrivateEn: d40.verdictEn,
      govtVsPrivateHi: d40.verdictHi,
      suitableProfessionsEn: [d41.verdictEn],
      suitableProfessionsHi: [d41.verdictHi],
      foreignTravelEn: d48.verdictEn,
      foreignTravelHi: d48.verdictHi,
      foreignSettlementEn: d48.detailedAnalysisEn,
      foreignSettlementHi: d48.detailedAnalysisHi,
    },
    longevity: {
      categoryEn: d31.verdictEn,
      categoryHi: d31.verdictHi,
      rangeEn: 'No lifespan range or age-at-death estimate is provided.',
      rangeHi: 'जीवनकाल की सीमा या मृत्यु-आयु का कोई अनुमान नहीं दिया जाता।'
      keyFactorsEn: 'Traditional eighth-house symbolism may be used for reflection on change and long-term responsibilities, not for lifespan assessment.',
      keyFactorsHi: 'अष्टम भाव के पारंपरिक संकेतों को परिवर्तन और दीर्घकालीन जिम्मेदारियों पर चिंतन के लिए पढ़ें, जीवनकाल के आकलन के लिए नहीं।'
    },
    bandhanaYoga: {
      hasRisk: false,
      verdictEn: d50.verdictEn,
      verdictHi: d50.verdictHi,
      mitigationEn: d50.remedyEn,
      mitigationHi: d50.remedyHi,
    },
    surgeryYoga: {
      hasRisk: false,
      riskLevelEn: 'No surgery or medical-risk prediction is made from astrology.',
      riskLevelHi: 'ज्योतिष के आधार पर शल्यक्रिया या चिकित्सकीय जोखिम का अनुमान नहीं दिया जाता।',
      vulnerableAreasEn: 'Astrology cannot identify vulnerable organs or body parts.',
      vulnerableAreasHi: 'ज्योतिष से कमजोर अंगों या शरीर के हिस्सों की पहचान नहीं की जा सकती।',
      timingEn: 'No medical or surgery timing is provided. Use clinical assessment and medical advice.',
      timingHi: 'चिकित्सा या शल्यक्रिया का समय नहीं बताया जाता। चिकित्सकीय जांच और डॉक्टर की सलाह लें।'
    },
    physicalMarks: {
      identificationEn: d1.verdictEn,
      identificationHi: d1.verdictHi,
      locationsEn: [d1.verdictEn],
      locationsHi: [d1.verdictHi],
    },
    addictions: {
      vulnerabilitiesEn: ['Sensory overindulgence during high stress'],
      vulnerabilitiesHi: ['अत्यधिक तनाव में खानपान या दिनचर्या में असंतुलन'],
      adviceEn: 'Practice regular meditation and avoid late night stimulants.',
      adviceHi: 'नियमित ध्यान करें और देर रात उत्तेजक पदार्थों से बचें।',
    },
    bedPleasure: {
      shayanaSukhaEn: d50.verdictEn,
      shayanaSukhaHi: d50.verdictHi,
      sexualityEn: d28.verdictEn,
      sexualityHi: d28.verdictHi,
    },
    friends: {
      natureEn: d45.verdictEn,
      natureHi: d45.verdictHi,
      loyaltyVerdictEn: d45.detailedAnalysisEn,
      loyaltyVerdictHi: d45.detailedAnalysisHi,
    },
    cautions: {
      hazardsEn: [d43.verdictEn, d22.verdictEn, 'Overconfidence in financial schemes', 'Neglecting routine health examinations'],
      hazardsHi: [d43.verdictHi, d22.verdictHi, 'वित्तीय योजनाओं में अति-विश्वास', 'स्वास्थ्य की नियमित जांच में लापरवाही'],
      warningNoteEn: d43.detailedAnalysisEn || 'Maintain ethical transparency and health awareness.',
      warningNoteHi: d43.detailedAnalysisHi || 'कार्यक्षेत्र में पारदर्शिता और स्वास्थ्य के प्रति सजगता बनाए रखें।',
    },
    crisisStrategy: {
      primaryDeityEn: ledger.deityAndMainPlanet.ishtaDevataEn,
      primaryDeityHi: ledger.deityAndMainPlanet.ishtaDevataHi,
      rescueMantra: ledger.deityAndMainPlanet.ishtaMantra,
      actionProtocolEn: d4.remedyEn,
      actionProtocolHi: d4.remedyHi,
    },
    sports: {
      preferencesEn: d10.verdictEn.split(/[,;]/).map((s) => s.trim()).filter(Boolean),
      preferencesHi: d10.verdictHi.split(/[,;।]/).map((s) => s.trim()).filter(Boolean),
      fitnessStyleEn: d10.detailedAnalysisEn,
      fitnessStyleHi: d10.detailedAnalysisHi,
    },
    temperament: {
      traitSummaryEn: d3.verdictEn,
      traitSummaryHi: d3.verdictHi,
      gunaEn: d3.astroBasisEn,
      gunaHi: d3.astroBasisHi,
    },
    loveLife: {
      romanceEn: d21.verdictEn,
      romanceHi: d21.verdictHi,
      marriageTypeEn: d21.detailedAnalysisEn,
      marriageTypeHi: d21.detailedAnalysisHi,
    },
    mentalHealth: {
      conditionEn: d2.verdictEn,
      conditionHi: d2.verdictHi,
      vulnerabilitiesEn: 'Astrology cannot diagnose mental-health conditions or psychological vulnerabilities.',
      vulnerabilitiesHi: 'ज्योतिष से मानसिक स्वास्थ्य की स्थिति या मनोवैज्ञानिक कमजोरियों का निदान नहीं किया जा सकता।'
      remedyEn: d2.remedyEn,
      remedyHi: d2.remedyHi,
    },
    health: {
      constitutionEn: d1.verdictEn,
      constitutionHi: d1.verdictHi,
      vulnerableOrgansEn: 'Astrology cannot identify vulnerable organs or predict disease.',
      vulnerableOrgansHi: 'ज्योतिष से कमजोर अंगों की पहचान या रोग की भविष्यवाणी नहीं की जा सकती।'
    },
    wealth: {
      statusEn: d5.verdictEn,
      statusHi: d5.verdictHi,
      activeYogasEn: [d5.verdictEn, d44.verdictEn],
      activeYogasHi: [d5.verdictHi, d44.verdictHi],
      peakAgeWindowEn: 'No fixed age window or guaranteed period of prosperity is assigned.',
      peakAgeWindowHi: 'समृद्धि के लिए कोई निश्चित आयु-सीमा या गारंटीकृत अवधि निर्धारित नहीं की जाती।'
    },
  };

  return report;
}
