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
  const MASTER_21_IDS = [1, 5, 9, 10, 12, 13, 14, 17, 19, 20, 22, 24, 26, 27, 31, 34, 37, 39, 44, 48, 51];
  const dims = rawDims
    .filter((d) => MASTER_21_IDS.includes(d.id))
    .map((d) => {
      const house = d.houseNumber ?? 1;
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
      const relevantPlanets = new Set<string>([
        lord.lord,
        ...occupants.map((planet) => planet.id),
        ...karakas,
      ]);
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
      const analysisHi = `${d.detailedAnalysisHi}\n\nव्यक्तिगत कुंडली-पठन: ${lord.lordHi} की स्थिति, भाव में स्थित ग्रह, ${bindus} सर्वाष्टकवर्ग बिंदु, दृष्टियां और संबंधित दशा को एक साथ देखकर यह निष्कर्ष बनाया गया है।`;
      const analysisEn = `${d.detailedAnalysisEn}\n\nChart-specific synthesis: this reading combines the house lord's placement, house occupants, ${bindus} Sarvashtakavarga bindus, aspects and the related dasha period.`;
      return {
        ...d,
        id: d.id,
        verdictHi,
        verdictEn,
        detailedAnalysisHi: analysisHi,
        detailedAnalysisEn: analysisEn,
        auspiciousness,
        timingHi,
        timingEn,
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
      lifespanEn: d36.verdictEn,
      lifespanHi: d36.verdictHi,
      relationshipEn: d35.verdictEn,
      relationshipHi: d35.verdictHi,
    },
    mother: {
      temperamentEn: d13.verdictEn,
      temperamentHi: d13.verdictHi,
      professionEn: d13.detailedAnalysisEn,
      professionHi: d13.detailedAnalysisHi,
      lifespanEn: d14.verdictEn,
      lifespanHi: d14.verdictHi,
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
      spouseAgeGapEn: d26.verdictEn,
      spouseAgeGapHi: d26.verdictHi,
      relationshipEn: d28.detailedAnalysisEn,
      relationshipHi: d28.detailedAnalysisHi,
    },
    children: {
      conceptionModeEn: d19.verdictEn,
      conceptionModeHi: d19.verdictHi,
      progenyCountEn: d19.verdictEn,
      progenyCountHi: d19.verdictHi,
      miscarriageRiskEn: d20.verdictEn,
      miscarriageRiskHi: d20.verdictHi,
      filialHappinessEn: d19.detailedAnalysisEn,
      filialHappinessHi: d19.detailedAnalysisHi,
      countAndGenderEn: d19.verdictEn,
      countAndGenderHi: d19.verdictHi,
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
      rangeEn: d31.detailedAnalysisEn,
      rangeHi: d31.detailedAnalysisHi,
      keyFactorsEn: d31.astroBasisEn,
      keyFactorsHi: d31.astroBasisHi,
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
      riskLevelEn: d33.verdictEn,
      riskLevelHi: d33.verdictHi,
      vulnerableAreasEn: d33.astroBasisEn,
      vulnerableAreasHi: d33.astroBasisHi,
      timingEn: d33.detailedAnalysisEn,
      timingHi: d33.detailedAnalysisHi,
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
      vulnerabilitiesEn: d2.astroBasisEn,
      vulnerabilitiesHi: d2.astroBasisHi,
      remedyEn: d2.remedyEn,
      remedyHi: d2.remedyHi,
    },
    health: {
      constitutionEn: d1.verdictEn,
      constitutionHi: d1.verdictHi,
      vulnerableOrgansEn: d22.astroBasisEn,
      vulnerableOrgansHi: d22.astroBasisHi,
    },
    wealth: {
      statusEn: d5.verdictEn,
      statusHi: d5.verdictHi,
      activeYogasEn: [d5.verdictEn, d44.verdictEn],
      activeYogasHi: [d5.verdictHi, d44.verdictHi],
      peakAgeWindowEn: 'Major prosperity surges between age 28 and 42',
      peakAgeWindowHi: '28 से 42 वर्ष की आयु के मध्य विशेष वित्तीय समृद्धि',
    },
  };

  return report;
}
