/* =========================================================================
   VEDIC ASTROLOGY & HIGHER EDUCATION PREDICTION ENGINE
   (Saraswati, Sarvabhouma, 10 Break Rules, Research Ph.D. & Academic Streams)

   Synthesized from Classical Vedic Treatises:
   Brihat Parashara Hora Shastra, Saravali, Jatak Parijata,
   Sarvaarth Chintamani, Horasara, and Jyotish Ratnakar.

   Strictly Zero Modern Personal Author Names (Author Attribution Purged).
   Strictly Zero Emojis. Dates DD-MM-YYYY.
   AV Astro Vibe High-Precision Astronomical & Vedic Engine
   ========================================================================= */

import { NINE_GRAHAS, SEVEN_PLANETS, SIGNS } from '../constants';
import type { ChartData, NineGrahaId, SevenPlanetId } from '../types';
import { getFunctionalLordship } from './functionalLordship';

export interface EducationHouseInsight {
  houseNumber: number; // 1, 2, 4, 5, 8, 9, 10, 11
  houseTitleEn: string;
  houseTitleHi: string;
  sanskritRoleEn: string;
  sanskritRoleHi: string;
  signIndex: number;
  signNameEn: string;
  signNameHi: string;
  lord: SevenPlanetId;
  lordHouse: number;
  lordDignity: string;
  occupants: NineGrahaId[];
  aspects: NineGrahaId[];
  savBindus: number;
  statusRating: 'Exalted & Fortified' | 'Strong & Auspicious' | 'Mixed & Demands Effort' | 'Afflicted / Testing';
  statusRatingHi: string;
  educationalManifestationEn: string;
  educationalManifestationHi: string;
}

export interface EducationBreakFactor {
  ruleNumber: number; // 1..10
  ruleNameEn: string;
  ruleNameHi: string;
  classicalDictaEn: string;
  classicalDictaHi: string;
  isTriggered: boolean;
  severity: 'None' | 'Mild' | 'Moderate' | 'Severe';
  observedPlanets: string[];
  manifestationEn: string;
  manifestationHi: string;
  remedyEn: string;
  remedyHi: string;
}

export interface EducationYogaItem {
  id: string;
  nameEn: string;
  nameHi: string;
  classicalSource: string;
  isPresent: boolean;
  strengthPercent: number;
  planetsInvolved: string[];
  conditionMetEn: string;
  conditionMetHi: string;
  resultEn: string;
  resultHi: string;
}

export interface AcademicTalentProfile {
  domainId: 'intelligence' | 'memory' | 'mathematics' | 'grammar' | 'occult_astrology' | 'eloquence';
  domainNameEn: string;
  domainNameHi: string;
  score: number; // 0..100
  levelEn: 'Supreme Mastery' | 'High Aptitude' | 'Moderate / Steady' | 'Developing';
  levelHi: string;
  classicalSutraEn: string;
  classicalSutraHi: string;
  detailedInsightEn: string;
  detailedInsightHi: string;
}

export interface PlanetaryStreamFit {
  planetId: NineGrahaId;
  karakatwaNameEn: string;
  karakatwaNameHi: string;
  facultyEn: string;
  facultyHi: string;
  recommendedDegreesEn: string[];
  recommendedDegreesHi: string[];
  affinityScore: number; // 0..100
  isRecommended: boolean;
  explanationEn: string;
  explanationHi: string;
}

export interface MoonEducationPsychology {
  moonSignEn: string;
  moonSignHi: string;
  moonHouse: number;
  isWaxing: boolean;
  pakshaBalaEn: string;
  pakshaBalaHi: string;
  mentalFocusScore: number;
  cognitiveProfileEn: string;
  cognitiveProfileHi: string;
  learningDispositionEn: string;
  learningDispositionHi: string;
  visualAndSensoryFocusEn: string;
  visualAndSensoryFocusHi: string;
}

export interface EducationTimelineWindow {
  stage:
    | 'Primary Schooling'
    | 'Secondary & Matriculation'
    | 'College / Higher Secondary'
    | 'Graduation & Bachelor'
    | 'Post-Graduation / Master'
    | 'Research & Ph.D.'
    | 'Foreign University Studies';
  stageHi: string;
  ageRange: string;
  governingHouses: number[];
  governingPlanets: NineGrahaId[];
  timingDashaEn: string;
  timingDashaHi: string;
  scholasticOutcomeEn: string;
  scholasticOutcomeHi: string;
  advisoryPrecautionEn: string;
  advisoryPrecautionHi: string;
}

export interface EducationAstrologyEngineReport {
  overallEducationScore: number; // 0..100
  overallVerdictEn: string;
  overallVerdictHi: string;
  coreHouses: EducationHouseInsight[];
  breakFactors: EducationBreakFactor[];
  triggeredBreakCount: number;
  breakRiskLevel: 'Low' | 'Moderate' | 'Elevated' | 'Severe';
  breakRiskLevelHi: string;
  breakRiskSummaryEn: string;
  breakRiskSummaryHi: string;
  activeYogas: EducationYogaItem[];
  allYogas: EducationYogaItem[];
  talents: AcademicTalentProfile[];
  planetaryStreams: PlanetaryStreamFit[];
  moonPsychology: MoonEducationPsychology;
  timelineWindows: EducationTimelineWindow[];
  classicalUpayas: {
    titleEn: string;
    titleHi: string;
    detailsEn: string[];
    detailsHi: string[];
  };
}

const SIGN_HI = [
  'मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या',
  'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुंभ', 'मीन',
];

const PLANET_HI: Record<string, string> = {
  Sun: 'सूर्य', Moon: 'चंद्र', Mars: 'मंगल', Mercury: 'बुध',
  Jupiter: 'गुरु', Venus: 'शुक्र', Saturn: 'शनि', Rahu: 'राहु', Ketu: 'केतु',
};

const NATURAL_BENEFICS = new Set<NineGrahaId>(['Jupiter', 'Venus', 'Mercury', 'Moon']);
const NATURAL_MALEFICS = new Set<NineGrahaId>(['Saturn', 'Mars', 'Rahu', 'Ketu', 'Sun']);

function getLordOfHouse(ascSign: number, hNum: number): SevenPlanetId {
  const signIdx = (ascSign + hNum - 1) % 12;
  return SIGNS[signIdx].lord;
}

function getGrahaAspectsOnHouse(chart: ChartData, targetHouse: number): NineGrahaId[] {
  const aspecting: NineGrahaId[] = [];
  for (const g of NINE_GRAHAS) {
    const p = chart.planets.find((item) => item.id === g);
    if (!p) continue;
    const fromH = p.rasiHouseNumber;
    if (fromH === targetHouse) continue;

    // All planets aspect 7th
    const diff7 = ((targetHouse - fromH + 12) % 12) + 1;
    if (diff7 === 7) {
      aspecting.push(g);
      continue;
    }
    // Mars 4, 8
    if (g === 'Mars' && (diff7 === 4 || diff7 === 8)) {
      aspecting.push(g);
      continue;
    }
    // Jupiter 5, 9
    if (g === 'Jupiter' && (diff7 === 5 || diff7 === 9)) {
      aspecting.push(g);
      continue;
    }
    // Saturn 3, 10
    if (g === 'Saturn' && (diff7 === 3 || diff7 === 10)) {
      aspecting.push(g);
      continue;
    }
  }
  return aspecting;
}

function getGrahaAspectsOnPlanet(chart: ChartData, targetPlanetId: NineGrahaId): NineGrahaId[] {
  const target = chart.planets.find((p) => p.id === targetPlanetId);
  if (!target) return [];
  return getGrahaAspectsOnHouse(chart, target.rasiHouseNumber).filter((g) => g !== targetPlanetId);
}

function isPapakartariOnHouse(chart: ChartData, hNum: number): { isKartari: boolean; malefics: string[] } {
  const prevH = hNum === 1 ? 12 : hNum - 1;
  const nextH = hNum === 12 ? 1 : hNum + 1;

  const prevPlanets = chart.planets.filter((p) => p.rasiHouseNumber === prevH).map((p) => p.id as NineGrahaId);
  const nextPlanets = chart.planets.filter((p) => p.rasiHouseNumber === nextH).map((p) => p.id as NineGrahaId);

  const prevHasMalefic = prevPlanets.some((p) => NATURAL_MALEFICS.has(p));
  const nextHasMalefic = nextPlanets.some((p) => NATURAL_MALEFICS.has(p));
  const prevHasBenefic = prevPlanets.some((p) => NATURAL_BENEFICS.has(p));
  const nextHasBenefic = nextPlanets.some((p) => NATURAL_BENEFICS.has(p));

  if (prevHasMalefic && nextHasMalefic && !prevHasBenefic && !nextHasBenefic) {
    const list = [...prevPlanets.filter((p) => NATURAL_MALEFICS.has(p)), ...nextPlanets.filter((p) => NATURAL_MALEFICS.has(p))];
    return { isKartari: true, malefics: list };
  }
  return { isKartari: false, malefics: [] };
}

export function computeEducationAstrologyEngine(chart: ChartData): EducationAstrologyEngineReport {
  const byId = new Map(chart.planets.map((p) => [p.id, p]));
  const ascSign = chart.ascendant.signIndex;

  const sun = byId.get('Sun')!;
  const moon = byId.get('Moon')!;
  const mars = byId.get('Mars')!;
  const mercury = byId.get('Mercury')!;
  const jupiter = byId.get('Jupiter')!;
  const venus = byId.get('Venus')!;
  const saturn = byId.get('Saturn')!;
  const rahu = byId.get('Rahu')!;
  const ketu = byId.get('Ketu')!;

  const l1 = getLordOfHouse(ascSign, 1);
  const l2 = getLordOfHouse(ascSign, 2);
  const l4 = getLordOfHouse(ascSign, 4);
  const l5 = getLordOfHouse(ascSign, 5);
  const l6 = getLordOfHouse(ascSign, 6);
  const l8 = getLordOfHouse(ascSign, 8);
  const l9 = getLordOfHouse(ascSign, 9);
  const l10 = getLordOfHouse(ascSign, 10);
  const l11 = getLordOfHouse(ascSign, 11);
  const l12 = getLordOfHouse(ascSign, 12);

  const posL1 = byId.get(l1)!;
  const posL2 = byId.get(l2)!;
  const posL4 = byId.get(l4)!;
  const posL5 = byId.get(l5)!;
  const posL6 = byId.get(l6)!;
  const posL8 = byId.get(l8)!;
  const posL9 = byId.get(l9)!;
  const posL10 = byId.get(l10)!;
  const posL11 = byId.get(l11)!;
  const posL12 = byId.get(l12)!;

  // =========================================================================
  // 1. CORE EDUCATION HOUSES ANALYSIS (H1, H2, H4, H5, H8, H9, H10, H11)
  // =========================================================================
  const trackedHouses = [1, 2, 4, 5, 8, 9, 10, 11];
  const coreHouses: EducationHouseInsight[] = trackedHouses.map((h) => {
    const sIdx = (ascSign + h - 1) % 12;
    const lordId = SIGNS[sIdx].lord;
    const lordPos = byId.get(lordId)!;
    const occs = chart.planets.filter((p) => p.rasiHouseNumber === h).map((p) => p.id as NineGrahaId);
    const asps = getGrahaAspectsOnHouse(chart, h);
    const sav = chart.ashtakavarga.sarva[sIdx];

    let rating: EducationHouseInsight['statusRating'] = 'Mixed & Demands Effort';
    let ratingHi = 'मिश्रित / निरंतर प्रयास अपेक्षित';

    const isExalted = lordPos.dignity === 'Exalted' || lordPos.dignity === 'Own Sign' || lordPos.dignity === 'Moolatrikona';
    const isDebil = lordPos.dignity === 'Debilitated';
    const isLordInKendraTrikona = [1, 4, 5, 7, 9, 10].includes(lordPos.rasiHouseNumber);
    const hasBeneficOcc = occs.some((p) => NATURAL_BENEFICS.has(p));
    const hasMaleficOcc = occs.some((p) => NATURAL_MALEFICS.has(p));

    if (isExalted && isLordInKendraTrikona && sav >= 28) {
      rating = 'Exalted & Fortified';
      ratingHi = 'परम बली व अत्यंत शुभ';
    } else if ((isExalted || isLordInKendraTrikona) && !isDebil && !hasMaleficOcc) {
      rating = 'Strong & Auspicious';
      ratingHi = 'सशक्त व अनुकूल फलदायी';
    } else if (isDebil || (hasMaleficOcc && sav < 24)) {
      rating = 'Afflicted / Testing';
      ratingHi = 'क्लेशकारी / परीक्षा में अवरोधक';
    }

    let sanskritEn = '';
    let sanskritHi = '';
    let manifEn = '';
    let manifHi = '';

    switch (h) {
      case 1:
        sanskritEn = 'Tanu Sthanam (Self, Vitality & Cognitive Foundation)';
        sanskritHi = 'तनु स्थान (आत्मबल, स्वास्थ्य व एकाग्रता का आधार)';
        manifEn = `Lagna lord ${lordId} placed in House ${lordPos.rasiHouseNumber} (${lordPos.dignity}). Vitality and self-disciplined study habit establish the core baseline.`;
        manifHi = `लग्नेश ${PLANET_HI[lordId]} भाव ${lordPos.rasiHouseNumber} में (${lordPos.dignity}) हैं। जातक का आत्मबल, स्वास्थ्य और दैनिक अनुशासन अध्ययन की मजबूत नींव रखता है।`;
        break;
      case 2:
        sanskritEn = 'Dhana Sthanam (Foundational Schooling, Speech & Family Support)';
        sanskritHi = 'धन स्थान (प्रारंभिक शिक्षा, वाणी, दृष्टि व पारिवारिक संसाधन)';
        manifEn = `2nd house governs primary schooling, family resources for tuition, and good eyesight. Ruled by ${lordId} in House ${lordPos.rasiHouseNumber}.`;
        manifHi = `द्वितीय भाव प्राथमिक शिक्षा, परिवार द्वारा अध्ययन पर व्यय और अध्ययन दृष्टि को दर्शाता है। भावेश: ${PLANET_HI[lordId]} भाव ${lordPos.rasiHouseNumber} में।`;
        break;
      case 4:
        sanskritEn = 'Vidya Sthanam (Formal Schooling, Mother’s Care & Academic Degrees)';
        sanskritHi = 'विद्या स्थान (मातृ मार्गदर्शन, औपचारिक 10+2 स्कूली शिक्षा व स्नातक)';
        manifEn = `4th house is prime Vidya Sthanam (Mathaa guidance, schooling up to 10+2, formal degrees). Lord ${lordId} in House ${lordPos.rasiHouseNumber} (${lordPos.dignity}).`;
        manifHi = `चतुर्थ भाव प्रधान विद्या स्थान है (माता का आरंभिक मार्गदर्शन, 10+2 तक की शिक्षा, डिग्री व डिप्लोमा)। भावेश: ${PLANET_HI[lordId]} भाव ${lordPos.rasiHouseNumber} में।`;
        break;
      case 5:
        sanskritEn = 'Buddhi Sthanam (Intellect, Grasping, Memory & Teacher Grace)';
        sanskritHi = 'बुद्धि स्थान (मेधा, स्मरण शक्ति, गुरु कृपा, प्रतियोगी परीक्षा व कॉलेज)';
        manifEn = `5th house is prime Buddhi Sthanam (intellectual grasping, past-life merits, competitive exams). Lord ${lordId} in House ${lordPos.rasiHouseNumber}.`;
        manifHi = `पंचम भाव मेधा, तात्कालिक समझ, स्मरण शक्ति और शिक्षक (गुरु) के मार्गदर्शन का केंद्र है। भावेश: ${PLANET_HI[lordId]} भाव ${lordPos.rasiHouseNumber} में।`;
        break;
      case 8:
        sanskritEn = 'Guhya Sthanam (Deep Research, Hidden Values, Occult & Ph.D. Digging)';
        sanskritHi = 'गूढ़ स्थान (गहन शोध, गूढ़ विद्या, अन्वेषण, डेटा खनन व Ph.D. अनुसंधान)';
        manifEn = `8th house governs deep research investigation, discovery of hidden values, and doctoral dissertations. Lord ${lordId} in House ${lordPos.rasiHouseNumber}.`;
        manifHi = `अष्टम भाव गूढ़ रहस्यों, छिपे हुए सत्यों के अनुसंधान, डेटा माइनिंग और पीएच.डी. शोध का मुख्य भाव है। भावेश: ${PLANET_HI[lordId]} भाव ${lordPos.rasiHouseNumber} में।`;
        break;
      case 9:
        sanskritEn = 'Dharma Sthanam (Higher University Learning, Post-Graduation & Mentors)';
        sanskritHi = 'धर्म स्थान (विश्वविद्यालयी उच्च शिक्षा, स्नातकोत्तर, पिता का सहयोग व विदेश छात्रवृत्ति)';
        manifEn = `9th house represents higher university learning (Pithaa guidance, Master's, Ph.D. defense, foreign scholarships). Lord ${lordId} in House ${lordPos.rasiHouseNumber}.`;
        manifHi = `नवम भाव उच्च विश्वविद्यालयी शिक्षा, स्नातकोत्तर (PG), विदेशी छात्रवृत्ति और पिता के सहयोग का कारक है। भावेश: ${PLANET_HI[lordId]} भाव ${lordPos.rasiHouseNumber} में।`;
        break;
      case 10:
        sanskritEn = 'Karma Sthanam (Academic Honours, Titles & Career Integration)';
        sanskritHi = 'कर्म स्थान (शैक्षणिक ख्याति, पदवी, उपाधियां व विद्या का आजीविका में उपयोग)';
        manifEn = `10th house translates educational excellence into societal titles, executive recognition, and high status. Lord ${lordId} in House ${lordPos.rasiHouseNumber}.`;
        manifHi = `दशम भाव शैक्षणिक सफलता को सामाजिक सम्मान, राजकीय उपाधियों और कार्यक्षेत्र में प्रतिष्ठा में बदलता है। भावेश: ${PLANET_HI[lordId]} भाव ${lordPos.rasiHouseNumber} में।`;
        break;
      case 11:
        sanskritEn = 'Labha Sthanam (Scholastic Medals, Awards & Fulfillment of Ambitions)';
        sanskritHi = 'लाभ स्थान (स्वर्ण पदक, पुरस्कार, राष्ट्रीय सम्मान व अभीष्ट शैक्षणिक सिद्धियां)';
        manifEn = `11th house brings scholastic rewards, research grants, competitive triumphs, and medals. Lord ${lordId} in House ${lordPos.rasiHouseNumber}.`;
        manifHi = `एकादश भाव शैक्षणिक प्रतिस्पर्धाओं में स्वर्ण पदक, शोध अनुदान और उच्चतम आकांक्षाओं की सिद्धि देता है। भावेश: ${PLANET_HI[lordId]} भाव ${lordPos.rasiHouseNumber} में।`;
        break;
    }

    return {
      houseNumber: h,
      houseTitleEn: `${h}th House`,
      houseTitleHi: `${h}वां भाव`,
      sanskritRoleEn: sanskritEn,
      sanskritRoleHi: sanskritHi,
      signIndex: sIdx,
      signNameEn: SIGNS[sIdx].name,
      signNameHi: SIGN_HI[sIdx],
      lord: lordId,
      lordHouse: lordPos.rasiHouseNumber,
      lordDignity: lordPos.dignity,
      occupants: occs,
      aspects: asps,
      savBindus: sav,
      statusRating: rating,
      statusRatingHi: ratingHi,
      educationalManifestationEn: manifEn,
      educationalManifestationHi: manifHi,
    };
  });

  // =========================================================================
  // 2. TEN CLASSICAL BREAK / STRUGGLE EVALUATION FACTORS
  // =========================================================================
  const breakFactors: EducationBreakFactor[] = [];

  // Rule 1: Debility of 2, 4, 5th house lords
  const debilLords: string[] = [];
  if (posL2.dignity === 'Debilitated') debilLords.push(`2nd Lord ${l2}`);
  if (posL4.dignity === 'Debilitated') debilLords.push(`4th Lord ${l4}`);
  if (posL5.dignity === 'Debilitated') debilLords.push(`5th Lord ${l5}`);
  breakFactors.push({
    ruleNumber: 1,
    ruleNameEn: 'Debility of 2nd, 4th, or 5th House Lords',
    ruleNameHi: 'द्वितीय, चतुर्थ अथवा पंचम भावेश का नीच राशि में होना',
    classicalDictaEn: 'Debility of key educational lords denies steady scholastic grounding, leading to academic friction or discontinuity.',
    classicalDictaHi: 'विद्या से संबंधित प्रमुख भावेशों का नीचस्थ होना अध्ययन में एकाग्रता की कमी व बाधा उत्पन्न करता है।',
    isTriggered: debilLords.length > 0,
    severity: debilLords.length >= 2 ? 'Severe' : debilLords.length === 1 ? 'Moderate' : 'None',
    observedPlanets: debilLords,
    manifestationEn: debilLords.length
      ? `Afflicted lord(s): ${debilLords.join(', ')}. Struggle in retaining focus; examinations demand remedial strengthening.`
      : 'No debility observed among 2nd, 4th, or 5th house lords. Foundational support is preserved.',
    manifestationHi: debilLords.length
      ? `पीड़ित भावेश: ${debilLords.join(', ')}। पढ़ाई में मन न लगना या परीक्षा में अपेक्षित परिणाम न मिलना।`
      : 'द्वितीय, चतुर्थ व पंचम में से कोई भी भावेश नीच नहीं है; शैक्षणिक आधार सुरक्षित है।',
    remedyEn: 'Perform prescribed Vedic Stotram japa of the debilitated lord; donate corresponding grains on weekdays.',
    remedyHi: 'संबंधित नीच ग्रह के वैदिक मंत्र का जप करें तथा गुरुवार/बुधवार को विद्या कारक वस्तुओं का दान करें।',
  });

  // Rule 2: Placement of 2, 4, 5th houses in between two malefic planets (Papakartari on houses)
  const kartariHouses: string[] = [];
  const k2 = isPapakartariOnHouse(chart, 2);
  const k4 = isPapakartariOnHouse(chart, 4);
  const k5 = isPapakartariOnHouse(chart, 5);
  if (k2.isKartari) kartariHouses.push(`2nd House (hemmed by ${k2.malefics.join(', ')})`);
  if (k4.isKartari) kartariHouses.push(`4th House (hemmed by ${k4.malefics.join(', ')})`);
  if (k5.isKartari) kartariHouses.push(`5th House (hemmed by ${k5.malefics.join(', ')})`);
  breakFactors.push({
    ruleNumber: 2,
    ruleNameEn: 'Papakartari Yoga on 2nd, 4th, or 5th Houses',
    ruleNameHi: 'द्वितीय, चतुर्थ अथवा पंचम भाव पर पापकर्तरी योग',
    classicalDictaEn: 'When houses of learning are squeezed between malefics in flanking houses, external pressures disrupt peaceful study.',
    classicalDictaHi: 'जब विद्या भाव दोनों ओर क्रूर ग्रहों से घिरे हों तो पारिवारिक या मानसिक अशांति से पढ़ाई बाधित होती है।',
    isTriggered: kartariHouses.length > 0,
    severity: kartariHouses.length >= 2 ? 'Severe' : kartariHouses.length === 1 ? 'Moderate' : 'None',
    observedPlanets: kartariHouses,
    manifestationEn: kartariHouses.length
      ? `Papakartari active on: ${kartariHouses.join('; ')}. External constraints (financial or domestic) compress educational flow.`
      : 'No educational houses are hemmed in Papakartari. Educational environment is unconstricted.',
    manifestationHi: kartariHouses.length
      ? `पापकर्तरी सक्रिय: ${kartariHouses.join('; ')}। घरेलू अशांति या आर्थिक दबाव के कारण पढ़ाई में व्यवधान।`
      : 'किसी भी विद्या भाव पर पापकर्तरी योग नहीं है; अध्ययन का वातावरण अनुकूल है।',
    remedyEn: 'Recite Sri Suktam or Saraswati Kavacham daily to shield the educational axis from ambient stress.',
    remedyHi: 'प्रतिदिन सरस्वती कवच अथवा गायत्री मंत्र का जप कर अध्ययन स्थल को सकारात्मक ऊर्जा से सुरक्षित रखें।',
  });

  // Rule 3: Placement of 2, 4, 5th house lords in between two malefic planets (Papakartari on lords)
  const kartariLords: string[] = [];
  const kl2 = isPapakartariOnHouse(chart, posL2.rasiHouseNumber);
  const kl4 = isPapakartariOnHouse(chart, posL4.rasiHouseNumber);
  const kl5 = isPapakartariOnHouse(chart, posL5.rasiHouseNumber);
  if (kl2.isKartari) kartariLords.push(`2nd Lord ${l2} (in H${posL2.rasiHouseNumber})`);
  if (kl4.isKartari) kartariLords.push(`4th Lord ${l4} (in H${posL4.rasiHouseNumber})`);
  if (kl5.isKartari) kartariLords.push(`5th Lord ${l5} (in H${posL5.rasiHouseNumber})`);
  breakFactors.push({
    ruleNumber: 3,
    ruleNameEn: 'Papakartari Yoga on Lords of 2nd, 4th, or 5th Houses',
    ruleNameHi: 'द्वितीय, चतुर्थ अथवा पंचम भावेश पर पापकर्तरी योग',
    classicalDictaEn: 'When house lords are hemmed between malefics, personal decision-making and retention capacity suffer under duress.',
    classicalDictaHi: 'भावेश के दोनों ओर क्रूर ग्रह होने से जातक का आत्मविश्वास कमजोर पड़ता है और निर्णय लेने में संशय रहता है।',
    isTriggered: kartariLords.length > 0,
    severity: kartariLords.length >= 2 ? 'Severe' : kartariLords.length === 1 ? 'Moderate' : 'None',
    observedPlanets: kartariLords,
    manifestationEn: kartariLords.length
      ? `Lord(s) hemmed: ${kartariLords.join('; ')}. Personal motivation and exam execution face internal bottlenecks.`
      : 'Key education lords are free from planetary hemming. Clarity of purpose is intact.',
    manifestationHi: kartariLords.length
      ? `पीड़ित भावेश: ${kartariLords.join('; ')}। परीक्षा के समय घबराहट या स्मृति भ्रम की आशंका।`
      : 'भावेशों पर कोई पापकर्तरी प्रभाव नहीं है; अध्ययन में मनोबल सुदृढ़ रहेगा।',
    remedyEn: 'Perform Pranayama and meditation before dawn; light a ghee lamp facing East during revision hours.',
    remedyHi: 'प्रातःकाल प्राणायाम करें तथा अध्ययन कक्ष में पूर्व दिशा में घी का दीपक जलाकर अभ्यास करें।',
  });

  // Rule 4: If 2nd house is placed with malefic planets like Saturn, Rahu, or both together
  const h2Malefics = chart.planets.filter((p) => p.rasiHouseNumber === 2 && ['Saturn', 'Rahu', 'Mars', 'Ketu'].includes(p.id)).map((p) => p.id);
  const hasSaturnOrRahuInH2 = h2Malefics.includes('Saturn') || h2Malefics.includes('Rahu');
  breakFactors.push({
    ruleNumber: 4,
    ruleNameEn: 'Malefics Posited in 2nd House (Saturn / Rahu Affliction)',
    ruleNameHi: 'द्वितीय भाव में शनि, राहु अथवा क्रूर ग्रहों की स्थिति',
    classicalDictaEn: 'Placement of Saturn or Rahu in 2nd house threatens early schooling interruptions, speech hesitations, or vision fatigue.',
    classicalDictaHi: 'द्वितीय भाव में शनि या राहु की स्थिति प्रारंभिक शिक्षा में रुकावट, वाणी में संकोच या नेत्र विकार का संकेत देती है।',
    isTriggered: hasSaturnOrRahuInH2,
    severity: h2Malefics.length >= 2 ? 'Severe' : hasSaturnOrRahuInH2 ? 'Moderate' : 'None',
    observedPlanets: h2Malefics,
    manifestationEn: hasSaturnOrRahuInH2
      ? `Malefics in H2: ${h2Malefics.join(', ')}. Sluggish start in basic literacy, needing conscious discipline and optical care.`
      : '2nd house is free from Saturn/Rahu afflictions. Smooth family and foundational speech support.',
    manifestationHi: hasSaturnOrRahuInH2
      ? `द्वितीय भाव में स्थित: ${h2Malefics.map((p) => PLANET_HI[p]).join(', ')}। प्रारंभिक शिक्षा में विलंब व नेत्रों की सुरक्षा आवश्यक।`
      : 'द्वितीय भाव में कोई क्रूर ग्रह स्थित नहीं है; प्राथमिक शिक्षा सुचारू रहेगी।',
    remedyEn: 'Chant Saraswati Beej Mantra (Om Aim Saraswatyai Namah) 108 times daily; maintain good reading posture.',
    remedyHi: 'प्रतिदिन ॐ ऐं सरस्वत्यै नमः मंत्र का १०८ बार जप करें तथा पर्याप्त रोशनी में अध्ययन करें।',
  });

  // Rule 5: If Mercury is placed either in Aries or in Scorpio (Mars signs)
  const isMercuryInMarsSign = mercury.signIndex === 0 || mercury.signIndex === 7;
  breakFactors.push({
    ruleNumber: 5,
    ruleNameEn: 'Mercury Posited in Mars Signs (Aries or Scorpio)',
    ruleNameHi: 'बुध का मंगल की राशियों (मेष अथवा वृश्चिक) में स्थित होना',
    classicalDictaEn: 'Mercury in martial signs creates impatient, combative intellect, leading to impulsive answers and academic disputes.',
    classicalDictaHi: 'मंगल की राशि में बुध होने से बुद्धि में उतावलापन, अधीरता व परीक्षा में जल्दबाजी में भूल करने की प्रवृत्ति होती है।',
    isTriggered: isMercuryInMarsSign,
    severity: isMercuryInMarsSign ? 'Mild' : 'None',
    observedPlanets: isMercuryInMarsSign ? [`Mercury in ${mercury.signName}`] : [],
    manifestationEn: isMercuryInMarsSign
      ? `Mercury is in ${mercury.signName}. Highly energetic but volatile analytical style; needs deliberate re-reading before submission.`
      : 'Mercury is placed in an amicable sign. Measured analytical temperament.',
    manifestationHi: isMercuryInMarsSign
      ? `बुध ${mercury.signName} राशि में है। तीक्ष्ण परंतु अधीर बुद्धि; परीक्षा में उत्तर लिखने के बाद पुनः जांचना आवश्यक है।`
      : 'बुध मंगल की राशि में नहीं है; बौद्धिक चिंतन संतुलित है।',
    remedyEn: 'Drink water from a green or copper vessel; practice calming mental focus exercises before examinations.',
    remedyHi: 'तुलसी पत्र का सेवन करें तथा परीक्षा से पूर्व ३ बार गहरा श्वास लेकर मन को शांत करें।',
  });

  // Rule 6: If Mercury is debilitated (Pisces)
  const isMercuryDebilitated = mercury.signIndex === 11 || mercury.dignity === 'Debilitated';
  breakFactors.push({
    ruleNumber: 6,
    ruleNameEn: 'Mercury Debilitated in Pisces',
    ruleNameHi: 'बुध का मीन राशि में नीचस्थ होना',
    classicalDictaEn: 'Debilitated Mercury creates conceptual diffusion, difficulty in exact mathematical syntax, and exam absent-mindedness.',
    classicalDictaHi: 'नीच का बुध होने से गणितीय सूत्रों व व्यावहारिक तर्कों में भ्रम, विस्मृति तथा परीक्षा में एकाग्रता का अभाव होता है।',
    isTriggered: isMercuryDebilitated,
    severity: isMercuryDebilitated ? 'Severe' : 'None',
    observedPlanets: isMercuryDebilitated ? ['Mercury (Debilitated in Pisces)'] : [],
    manifestationEn: isMercuryDebilitated
      ? 'Mercury is debilitated in Pisces. Intuitive and creative, but demands structured notes and repetitive problem-solving to excel.'
      : 'Mercury is not debilitated. Analytical reasoning and communicative precision are well-supported.',
    manifestationHi: isMercuryDebilitated
      ? 'बुध मीन राशि में नीचस्थ है। जातक की कल्पनाशक्ति प्रबल है, परंतु लिखित परीक्षा व गणित हेतु विशेष अभ्यास अनिवार्य है।'
      : 'बुध नीच का नहीं है; तार्किक व विश्लेषणात्मक क्षमताएं सुदृढ़ हैं।',
    remedyEn: 'Wear a natural Emerald (Panna) after astrological trial or worship Lord Ganesha with Durva grass on Wednesdays.',
    remedyHi: 'प्रत्येक बुधवार भगवान श्रीगणेश को दूर्वा अर्पित करें तथा मोदक या हरे फल का भोग लगाएं।',
  });

  // Rule 7: If Mercury is aspected by Mars
  const marsAspectsMercury = getGrahaAspectsOnPlanet(chart, 'Mercury').includes('Mars');
  breakFactors.push({
    ruleNumber: 7,
    ruleNameEn: 'Mercury Aspected by Mars',
    ruleNameHi: 'बुध पर मंगल की क्रूर दृष्टि',
    classicalDictaEn: 'Martian aspect on Mercury instigates friction with peers, technical disputes, or sudden exam anxiety.',
    classicalDictaHi: 'मंगल की दृष्टि बुध पर होने से सहपाठियों से विवाद, तकनीकी विषयों में उत्तेजना व परीक्षा के समय हड़बड़ाहट होती है।',
    isTriggered: marsAspectsMercury,
    severity: marsAspectsMercury ? 'Moderate' : 'None',
    observedPlanets: marsAspectsMercury ? ['Mars aspecting Mercury'] : [],
    manifestationEn: marsAspectsMercury
      ? 'Mars casts direct Parashari aspect onto Mercury. Dynamic technical aptitude, but prone to hasty errors in timed exams.'
      : 'Mercury is free from Mars aspect. Unruffled intellectual composure.',
    manifestationHi: marsAspectsMercury
      ? 'मंगल की दृष्टि बुध पर है। तकनीकी विषयों में रुचि रहेगी, किंतु समयबद्ध परीक्षा में घबराहट से बचना होगा।'
      : 'बुध पर मंगल की कोई दृष्टि नहीं है; परीक्षा में संयमित दृष्टिकोण रहेगा।',
    remedyEn: 'Recite Hanuman Chalisa on Tuesdays; channel energetic drive into competitive sports alongside studies.',
    remedyHi: 'मंगलवार को हनुमान चालीसा का पाठ करें तथा अतिरिक्त ऊर्जा को खेलकूद या योग में लगाएं।',
  });

  // Rule 8: If Jupiter is debilitated (Capricorn)
  const isJupiterDebilitated = jupiter.signIndex === 9 || jupiter.dignity === 'Debilitated';
  breakFactors.push({
    ruleNumber: 8,
    ruleNameEn: 'Jupiter Debilitated in Capricorn',
    ruleNameHi: 'बृहस्पति (गुरु) का मकर राशि में नीचस्थ होना',
    classicalDictaEn: 'Debility of Jupiter, the supreme Jnana Karaka, challenges higher academic guidance, moral mentorship, and doctoral progress.',
    classicalDictaHi: 'ज्ञान कारक गुरु का नीच होना उच्च अध्ययन, गुरुजनों के मार्गदर्शन तथा शोध कार्यों में विलंब लाता है।',
    isTriggered: isJupiterDebilitated,
    severity: isJupiterDebilitated ? 'Severe' : 'None',
    observedPlanets: isJupiterDebilitated ? ['Jupiter (Debilitated in Capricorn)'] : [],
    manifestationEn: isJupiterDebilitated
      ? 'Jupiter is debilitated in Capricorn. Pragmatic and worldly, but requires humble seeking of academic mentors.'
      : 'Jupiter is in dignified strength. Sound moral guidance, dharmic intellect, and scholarly respect.',
    manifestationHi: isJupiterDebilitated
      ? 'गुरु मकर राशि में नीचस्थ है। उच्च शिक्षा में योग्यता सिद्ध करने हेतु अत्यधिक श्रम व गुरुजनों के आदर की आवश्यकता है।'
      : 'गुरु नीचस्थ नहीं है; उच्च शिक्षा व गुरु कृपा के अनुकूल योग हैं।',
    remedyEn: 'Apply saffron (kesar) tilak on forehead every Thursday; recite Guru Paduka Stotram or Brihaspati Kavacham.',
    remedyHi: 'प्रतिदिन मस्तक पर केसर या हल्दी का तिलक लगाएं तथा गुरुवार को चने की दाल व पीले फल का दान करें।',
  });

  // Rule 9: If Sun is debilitated (Libra)
  const isSunDebilitated = sun.signIndex === 6 || sun.dignity === 'Debilitated';
  breakFactors.push({
    ruleNumber: 9,
    ruleNameEn: 'Sun Debilitated in Libra',
    ruleNameHi: 'सूर्य का तुला राशि में नीचस्थ होना',
    classicalDictaEn: 'Debility of Sun (Atma Karaka) saps institutional confidence, creating hesitation in administrative and civil exams.',
    classicalDictaHi: 'आत्मकारक सूर्य का नीच होना आत्मविश्वास में कमी, प्रशासनिक परीक्षाओं में संकोच व पिता के सहयोग में कमी लाता है।',
    isTriggered: isSunDebilitated,
    severity: isSunDebilitated ? 'Moderate' : 'None',
    observedPlanets: isSunDebilitated ? ['Sun (Debilitated in Libra)'] : [],
    manifestationEn: isSunDebilitated
      ? 'Sun is debilitated in Libra. Self-doubt in public scholarship; strengthens greatly when taking on community leadership.'
      : 'Sun is placed in dignity. Regal self-assurance and executive stamina in academic competitions.',
    manifestationHi: isSunDebilitated
      ? 'सूर्य तुला राशि में नीचस्थ है। सरकारी व प्रतियोगी परीक्षाओं में आत्मविश्वास बनाए रखने हेतु विशेष साधना आवश्यक है।'
      : 'सूर्य नीचस्थ नहीं है; प्रशासनिक व उच्च पदों की परीक्षा में आत्मविश्वास सुदृढ़ रहेगा।',
    remedyEn: 'Offer Arghya to the rising Sun daily with copper vessel and recite Aditya Hridaya Stotram on Sundays.',
    remedyHi: 'तांबे के पात्र से उगते सूर्य को जल (अर्घ्य) दें तथा रविवार को आदित्य हृदय स्तोत्र का पाठ करें।',
  });

  // Rule 10: If first house / Ascendant or Janma Rasi (Moon) is not aspected by any planets
  const lagnaAspects = getGrahaAspectsOnHouse(chart, 1);
  const moonAspects = getGrahaAspectsOnHouse(chart, moon.rasiHouseNumber).filter((g) => g !== 'Moon');
  const isLagnaOrMoonUnaspected = lagnaAspects.length === 0 || moonAspects.length === 0;
  breakFactors.push({
    ruleNumber: 10,
    ruleNameEn: 'Unaspected Ascendant (Lagna) or Janma Rasi (Moon)',
    ruleNameHi: 'लग्न अथवा जन्म राशि (चंद्र) पर किसी भी ग्रह की दृष्टि न होना',
    classicalDictaEn: 'Lack of planetary aspect on Lagna or Moon creates feelings of educational isolation, requiring self-driven motivation.',
    classicalDictaHi: 'लग्न या चंद्र पर किसी ग्रह की दृष्टि न होने से जातक को पढ़ाई में अकेलापन व मार्गदर्शन का अभाव महसूस होता है।',
    isTriggered: isLagnaOrMoonUnaspected,
    severity: lagnaAspects.length === 0 && moonAspects.length === 0 ? 'Moderate' : 'Mild',
    observedPlanets: [
      `Lagna aspects: ${lagnaAspects.length ? lagnaAspects.join(', ') : 'None'}`,
      `Moon aspects: ${moonAspects.length ? moonAspects.join(', ') : 'None'}`,
    ],
    manifestationEn: isLagnaOrMoonUnaspected
      ? 'Lagna or Moon receives no external planetary drishti. The native must be self-directed without relying solely on peer groups.'
      : 'Both Lagna and Moon receive planetary aspects, ensuring dynamic external mentorship and peer support.',
    manifestationHi: isLagnaOrMoonUnaspected
      ? 'लग्न अथवा चंद्र पर किसी ग्रह की दृष्टि नहीं है। जातक को स्वयं प्रेरित होकर स्वाध्याय (Self-study) पर निर्भर रहना होगा।'
      : 'लग्न व चंद्र दोनों को ग्रहों की दृष्टि प्राप्त है; मार्गदर्शन व प्रोत्साहन स्वतः मिलता रहेगा।',
    remedyEn: 'Form dedicated study groups; seek out experienced senior mentors rather than studying entirely in solitude.',
    remedyHi: 'योग्य सहपाठियों के साथ समूह चर्चा करें तथा वरिष्ठ अध्यापकों से निरंतर मार्गदर्शन प्राप्त करते रहें।',
  });

  const triggeredBreaks = breakFactors.filter((b) => b.isTriggered);
  const triggeredBreakCount = triggeredBreaks.length;
  let breakRiskLevel: EducationAstrologyEngineReport['breakRiskLevel'] = 'Low';
  let breakRiskLevelHi = 'न्यूनतम (सुगम शिक्षा योग)';
  let breakRiskSummaryEn = 'Educational journey is largely smooth with high momentum and continuity.';
  let breakRiskSummaryHi = 'शैक्षणिक यात्रा सुगम व निर्बाध रहेगी; अध्ययन में निरंतरता बनी रहेगी।';

  if (triggeredBreakCount >= 5) {
    breakRiskLevel = 'Severe';
    breakRiskLevelHi = 'अति संवेदनशील (कड़े संघर्ष व उपाय अनिवार्य)';
    breakRiskSummaryEn = 'Pronounced vulnerabilities indicate possible academic breaks, subject changes, or examination setbacks during malefic dashas.';
    breakRiskSummaryHi = 'क्रूर दशाओं में पढ़ाई में रुकावट, विषय परिवर्तन या परीक्षा में व्यवधान की आशंका; वैदिक उपायों का पालन अनिवार्य है।';
  } else if (triggeredBreakCount >= 3) {
    breakRiskLevel = 'Elevated';
    breakRiskLevelHi = 'मध्यम से उच्च (सावधानी व दृढ़ संकल्प अपेक्षित)';
    breakRiskSummaryEn = 'Noticeable stress factors can cause temporary drop in grades or exam delays. Steady guidance prevents major disruption.';
    breakRiskSummaryHi = 'कुछ बाधा योग सक्रिय हैं; एकाग्रता में उतार-चढ़ाव आ सकता है, किंतु सतत अभ्यास से बाधाएं दूर होंगी।';
  } else if (triggeredBreakCount >= 1) {
    breakRiskLevel = 'Moderate';
    breakRiskLevelHi = 'सामान्य / नियंत्रित (साधारण प्रयास से निवारण)';
    breakRiskSummaryEn = 'Minor academic hurdles present, easily managed with organized revision schedules and optical care.';
    breakRiskSummaryHi = 'हल्की चुनौतियां हैं जिन्हें समयबद्ध दिनचर्या व नियमित पुनरावृत्ति से आसानी से सुलझाया जा सकता है।';
  }

  // =========================================================================
  // 3. CLASSICAL AUSPICIOUS HIGHER EDUCATION YOGAS
  // =========================================================================
  const allYogas: EducationYogaItem[] = [];

  // Yoga 1: Sarvabhouma Yoga (5th lord + 9th lord conjunction, aspect, or Parivarthana)
  const isSarvabhoumaConj = posL5.rasiHouseNumber === posL9.rasiHouseNumber;
  const isSarvabhoumaParivarthana = posL5.rasiHouseNumber === 9 && posL9.rasiHouseNumber === 5;
  const diff59 = ((posL9.rasiHouseNumber - posL5.rasiHouseNumber + 12) % 12) + 1;
  const isSarvabhoumaAspect = diff59 === 7;
  const hasSarvabhouma = isSarvabhoumaConj || isSarvabhoumaParivarthana || isSarvabhoumaAspect;
  allYogas.push({
    id: 'sarvabhouma',
    nameEn: 'Sarvabhouma Yoga (5th & 9th Lords Sacred Alliance)',
    nameHi: 'सार्वभौम योग (पंचमेश व नवमेश का दिव्य संबंध)',
    classicalSource: 'Brihat Parashara Hora Shastra & Phaladeepika',
    isPresent: hasSarvabhouma,
    strengthPercent: isSarvabhoumaParivarthana ? 100 : isSarvabhoumaConj ? 95 : 85,
    planetsInvolved: [`5th Lord ${l5}`, `9th Lord ${l9}`],
    conditionMetEn: isSarvabhoumaParivarthana
      ? `Mutual Parivarthana: 5th Lord ${l5} in House 9, and 9th Lord ${l9} in House 5.`
      : isSarvabhoumaConj
        ? `Conjunction: 5th Lord ${l5} and 9th Lord ${l9} together in House ${posL5.rasiHouseNumber}.`
        : isSarvabhoumaAspect
          ? `Mutual Aspect: 5th Lord ${l5} and 9th Lord ${l9} directly aspecting each other.`
          : '5th and 9th lords do not form conjunction, aspect, or Parivarthana.',
    conditionMetHi: isSarvabhoumaParivarthana
      ? `परिवर्तन योग: पंचमेश ${PLANET_HI[l5]} नवम भाव में और नवमेश ${PLANET_HI[l9]} पंचम भाव में विराजमान हैं।`
      : isSarvabhoumaConj
        ? `युति संबंध: पंचमेश ${PLANET_HI[l5]} व नवमेश ${PLANET_HI[l9]} भाव ${posL5.rasiHouseNumber} में एक साथ स्थित हैं।`
        : isSarvabhoumaAspect
          ? `दृष्टि संबंध: पंचमेश व नवमेश समसप्तक होकर एक-दूसरे को पूर्ण दृष्टि से देख रहे हैं।`
          : 'पंचमेश व नवमेश के मध्य युति, दृष्टि या परिवर्तन योग नहीं बन रहा है।',
    resultEn: 'Confers sovereign educational distinction, academic honors, medals, and societal renown for deep erudition.',
    resultHi: 'सर्वोच्च शिक्षा, पदक, राष्ट्रीय-अंतरराष्ट्रीय स्तर पर सम्मान और अद्वितीय विद्वता का योग।',
  });

  // Yoga 2: Kalanithi Yoga (Venus own/exalted + Jupiter & Mercury in 2nd or 5th)
  const isVenusOwnOrExalted = ['Exalted', 'Own Sign'].includes(venus.dignity);
  const isJupMerIn2or5 = (jupiter.rasiHouseNumber === 2 && mercury.rasiHouseNumber === 2) || (jupiter.rasiHouseNumber === 5 && mercury.rasiHouseNumber === 5);
  const hasKalanithi = isVenusOwnOrExalted && isJupMerIn2or5;
  allYogas.push({
    id: 'kalanithi',
    nameEn: 'Kalanithi Yoga (Mastery of Arts, Speech & Astrology)',
    nameHi: 'कलानिधि योग (शास्त्र, साहित्य, वाकपटुता व ज्योतिष प्रावीण्य)',
    classicalSource: 'Jatak Parijata & Saravali',
    isPresent: hasKalanithi,
    strengthPercent: hasKalanithi ? 95 : 0,
    planetsInvolved: ['Venus', 'Jupiter', 'Mercury'],
    conditionMetEn: hasKalanithi
      ? `Venus in ${venus.dignity} and Jupiter + Mercury conjoined in House ${jupiter.rasiHouseNumber}.`
      : 'Requires Venus in own/exalted sign and Jupiter + Mercury together in House 2 or 5.',
    conditionMetHi: hasKalanithi
      ? `शुक्र ${venus.dignity} में तथा गुरु व बुध भाव ${jupiter.rasiHouseNumber} में एक साथ स्थित हैं।`
      : 'शुक्र का स्व/उच्च राशि में होना तथा गुरु-बुध की द्वितीय या पंचम में युति आवश्यक है।',
    resultEn: 'Highly disciplined, moral, eloquent speech, brilliant writing, research aptitude, and excellence in astrology.',
    resultHi: 'चरित्रवान, कुशल वक्ता, उत्कृष्ट लेखक, गहन शोधकर्ता और ज्योतिष शास्त्र का प्रकांड ज्ञाता।',
  });

  // Yoga 3: Brahma Yoga (Jupiter & Venus in Kendras to Lagna and to 5th/11th lords)
  const isJupInKendra = [1, 4, 7, 10].includes(jupiter.rasiHouseNumber);
  const isVenInKendra = [1, 4, 7, 10].includes(venus.rasiHouseNumber);
  const jupFromL5 = ((jupiter.rasiHouseNumber - posL5.rasiHouseNumber + 12) % 12) + 1;
  const venFromL5 = ((venus.rasiHouseNumber - posL5.rasiHouseNumber + 12) % 12) + 1;
  const isKendraToL5 = [1, 4, 7, 10].includes(jupFromL5) && [1, 4, 7, 10].includes(venFromL5);
  const hasBrahma = isJupInKendra && isVenInKendra && isKendraToL5;
  allYogas.push({
    id: 'brahma',
    nameEn: 'Brahma Yoga (Supreme Erudition & High Wealth)',
    nameHi: 'ब्रह्म योग (परम विद्वता, अपार संपदा व कीर्ति)',
    classicalSource: 'Brihat Parashara Hora Shastra',
    isPresent: hasBrahma,
    strengthPercent: hasBrahma ? 98 : 0,
    planetsInvolved: ['Jupiter', 'Venus', `5th Lord ${l5}`],
    conditionMetEn: hasBrahma
      ? 'Jupiter and Venus are in Kendras to Lagna and simultaneously in Kendras to 5th lord.'
      : 'Requires Jupiter & Venus in Kendras to Lagna and in Kendras to 5th or 11th lord.',
    conditionMetHi: hasBrahma
      ? 'गुरु व शुक्र दोनों लग्न से केंद्र में हैं तथा पंचमेश से भी केंद्र भाव में स्थित हैं।'
      : 'गुरु और शुक्र का लग्न से तथा पंचमेश/एकादशेश से केंद्र में होना आवश्यक है।',
    resultEn: 'Guaranteed highest education, immense prosperity, and lasting public popularity.',
    resultHi: 'उच्चतम विद्या, प्रचुर धन-संपत्ति और समाज में व्यापक प्रतिष्ठा की गारंटी।',
  });

  // Yoga 4: Saraswati Yoga (Jupiter, Venus, Mercury in Kendras or Trikonas from Lagna)
  const isJupKT = [1, 4, 5, 7, 9, 10].includes(jupiter.rasiHouseNumber);
  const isVenKT = [1, 4, 5, 7, 9, 10].includes(venus.rasiHouseNumber);
  const isMerKT = [1, 4, 5, 7, 9, 10].includes(mercury.rasiHouseNumber);
  const hasSaraswati = isJupKT && isVenKT && isMerKT;
  allYogas.push({
    id: 'saraswati',
    nameEn: 'Saraswati Yoga (Goddess of Learning Divine Blessing)',
    nameHi: 'सरस्वती योग (विद्या व वाणी की अधिष्ठात्री देवी का वरदान)',
    classicalSource: 'Sarvaarth Chintamani & Phaladeepika',
    isPresent: hasSaraswati,
    strengthPercent: hasSaraswati ? 100 : 0,
    planetsInvolved: ['Jupiter', 'Venus', 'Mercury'],
    conditionMetEn: hasSaraswati
      ? `Jupiter (H${jupiter.rasiHouseNumber}), Venus (H${venus.rasiHouseNumber}), and Mercury (H${mercury.rasiHouseNumber}) are all in Kendras/Trikonas.`
      : 'Requires Jupiter, Venus, and Mercury all placed in Kendras or Trikonas from Lagna.',
    conditionMetHi: hasSaraswati
      ? `गुरु (भाव ${jupiter.rasiHouseNumber}), शुक्र (भाव ${venus.rasiHouseNumber}) और बुध (भाव ${mercury.rasiHouseNumber}) तीनों केंद्र/त्रिकोण में स्थित हैं।`
      : 'गुरु, शुक्र व बुध तीनों का लग्न से केंद्र अथवा त्रिकोण में होना अनिवार्य है।',
    resultEn: 'Peerless erudition, poetic mastery, musical and linguistic eloquence, globally celebrated scholar.',
    resultHi: 'अद्वितीय ज्ञान, मधुर वाक्पटुता, साहित्यिक कौशल और विश्व विख्यात विद्वान बनने का योग।',
  });

  // Yoga 5: Balai Yoga (Jupiter & Venus in 12th from Sun)
  const jupFromSun = ((jupiter.rasiHouseNumber - sun.rasiHouseNumber + 12) % 12) + 1;
  const venFromSun = ((venus.rasiHouseNumber - sun.rasiHouseNumber + 12) % 12) + 1;
  const hasBalai = jupFromSun === 12 && venFromSun === 12;
  allYogas.push({
    id: 'balai',
    nameEn: 'Balai Yoga (Polyglot & Multilingual Erudition)',
    nameHi: 'बलाई योग (बहुभाषाविद्, साहित्य व अनुवाद प्रावीण्य)',
    classicalSource: 'Jatak Parijata',
    isPresent: hasBalai,
    strengthPercent: hasBalai ? 90 : 0,
    planetsInvolved: ['Jupiter', 'Venus', 'Sun'],
    conditionMetEn: hasBalai
      ? 'Both Jupiter and Venus are posited in the 12th house from the Sun.'
      : 'Requires Jupiter and Venus situated in the 12th house from the Sun.',
    conditionMetHi: hasBalai
      ? 'सूर्य से १२वें भाव में गुरु एवं शुक्र दोनों एक साथ विराजमान हैं।'
      : 'सूर्य से १२वें भाव में गुरु और शुक्र की स्थिति आवश्यक है।',
    resultEn: 'Fluent in multiple languages, gifted in literature, translation, and international diplomacy.',
    resultHi: 'अनेक भाषाओं का ज्ञाता, उच्च कोटि का अनुवादक, साहित्य प्रेमी व अंतरराष्ट्रीय कूटनीतिज्ञ।',
  });

  // Yoga 6: Shanga Yoga (5th and 6th lord Parivarthana or conjunction)
  const isShangaParivarthana = posL5.rasiHouseNumber === 6 && posL6.rasiHouseNumber === 5;
  const isShangaConj = (posL5.rasiHouseNumber === posL6.rasiHouseNumber) && [5, 6].includes(posL5.rasiHouseNumber);
  const hasShanga = isShangaParivarthana || isShangaConj;
  allYogas.push({
    id: 'shanga',
    nameEn: 'Shanga Yoga (Competitive Mastery & Doctoral Degree)',
    nameHi: 'शंग योग (प्रतियोगी परीक्षाओं में विजय व पी.एचडी. शोध)',
    classicalSource: 'Horasara & Classical Jyotish Sutras',
    isPresent: hasShanga,
    strengthPercent: hasShanga ? 92 : 0,
    planetsInvolved: [`5th Lord ${l5}`, `6th Lord ${l6}`],
    conditionMetEn: hasShanga
      ? '5th and 6th lords form mutual Parivarthana or conjunction in 5th/6th house.'
      : 'Requires mutual connection between 5th and 6th lords.',
    conditionMetHi: hasShanga
      ? 'पंचमेश व षष्ठेश के मध्य राशि परिवर्तन अथवा ५वें/६वें भाव में युति स्थित है।'
      : 'पंचमेश और षष्ठेश का परस्पर संबंध होना आवश्यक है।',
    resultEn: 'Achieves high competitive educational qualifications (Ph.D., ICS/IAS); rivals conquered through supreme acumen.',
    resultHi: 'उच्च प्रतियोगी परीक्षाओं में सफलता, पी.एचडी. उपाधि और ज्ञान के बल पर विरोधियों पर विजय।',
  });

  // Yoga 7: Budhaditya / Nipunatva Yoga (Sun + Mercury conjunction)
  const hasBudhaditya = sun.rasiHouseNumber === mercury.rasiHouseNumber;
  const isBudhadityaSpecial = hasBudhaditya && ([0, 2, 4, 5].includes(sun.signIndex) || [1, 2, 4, 5].includes(sun.rasiHouseNumber));
  allYogas.push({
    id: 'budhaditya',
    nameEn: 'Budhaditya / Nipunatva Yoga (Sharp Intellect & Administrative Genius)',
    nameHi: 'बुधादित्य / निपुणत्व योग (कुशाग्र बुद्धि व प्रशासनिक मेधा)',
    classicalSource: 'Saravali (Kalyana Varma) & Jatak Parijata',
    isPresent: hasBudhaditya,
    strengthPercent: isBudhadityaSpecial ? 95 : 80,
    planetsInvolved: ['Sun', 'Mercury'],
    conditionMetEn: hasBudhaditya
      ? `Sun and Mercury conjoined in House ${sun.rasiHouseNumber} (${sun.signName})${isBudhadityaSpecial ? ' in an auspicious Kendra/Trikona sign.' : '.'}`
      : 'Sun and Mercury are in separate houses.',
    conditionMetHi: hasBudhaditya
      ? `सूर्य और बुध भाव ${sun.rasiHouseNumber} (${SIGN_HI[sun.signIndex]} राशि) में युति कर रहे हैं।`
      : 'सूर्य और बुध अलग-अलग भावों में हैं।',
    resultEn: 'Fast mathematical grasping, sharp memory, eloquent speech, and administrative recognition.',
    resultHi: 'तेज गणितीय समझ, कुशाग्र स्मरण शक्ति, प्रभावशाली भाषण कला व प्रशासनिक सम्मान।',
  });

  // Yoga 8: Bhadra Pancha Mahapurusha Yoga (Mercury in Kendra in Gemini or Virgo)
  const isBhadra = [1, 4, 7, 10].includes(mercury.rasiHouseNumber) && (mercury.signIndex === 2 || mercury.signIndex === 5);
  allYogas.push({
    id: 'bhadra',
    nameEn: 'Bhadra Mahapurusha Yoga (Sovereign Analytical Stature)',
    nameHi: 'भद्र महापुरुष योग (सर्वोच्च बौद्धिक एवं प्रबंधकीय पद)',
    classicalSource: 'Brihat Parashara Hora Shastra',
    isPresent: isBhadra,
    strengthPercent: isBhadra ? 100 : 0,
    planetsInvolved: ['Mercury'],
    conditionMetEn: isBhadra
      ? `Mercury is in Kendra (House ${mercury.rasiHouseNumber}) in its own/exalted sign (${mercury.signName}).`
      : 'Requires Mercury in Kendra in Gemini or Virgo.',
    conditionMetHi: isBhadra
      ? `बुध केंद्र भाव (${mercury.rasiHouseNumber}) में अपनी स्व/उच्च राशि (${SIGN_HI[mercury.signIndex]}) में विराजमान है।`
      : 'बुध का केंद्र में मिथुन या कन्या राशि में होना आवश्यक है।',
    resultEn: 'Endless educational achievements, exceptional oratory, commanding executive authority in later life.',
    resultHi: 'असीमित शैक्षणिक उपलब्धियां, उत्कृष्ट वाकचातुर्य और जीवन में उच्च प्रशासनिक अधिकार।',
  });

  // Yoga 9: Dhenu (Thenu) Yoga (2nd lord with/aspected by benefics in own/exalted sign)
  const is2ndLordStrong = ['Exalted', 'Own Sign', 'Great Friend'].includes(posL2.dignity);
  const h2Occupants = chart.planets.filter((p) => p.rasiHouseNumber === 2).map((p) => p.id as NineGrahaId);
  const hasBeneficInH2 = h2Occupants.some((p) => NATURAL_BENEFICS.has(p));
  const hasMaleficInH2 = h2Occupants.some((p) => NATURAL_MALEFICS.has(p));
  const hasDhenu = is2ndLordStrong && (!hasMaleficInH2 || hasBeneficInH2);
  allYogas.push({
    id: 'dhenu',
    nameEn: 'Dhenu Yoga (Abundant Speech, Learning & Family Prosperity)',
    nameHi: 'धेनु योग (विद्या कोष, वाक् समृद्धि व पारिवारिक संपन्नता)',
    classicalSource: 'Phaladeepika & Classical Jyotish',
    isPresent: hasDhenu,
    strengthPercent: hasDhenu ? 88 : 0,
    planetsInvolved: [`2nd Lord ${l2}`],
    conditionMetEn: hasDhenu
      ? `2nd Lord ${l2} is fortified in ${posL2.dignity} with auspicious second house status.`
      : 'Requires 2nd lord fortified in own/exalted sign free from malefic affliction.',
    conditionMetHi: hasDhenu
      ? `द्वितीयेश ${PLANET_HI[l2]} ${posL2.dignity} में बली होकर शुभ प्रभाव में स्थित है।`
      : 'द्वितीयेश का स्व/उच्च राशि में शुभ ग्रहों के प्रभाव में होना आवश्यक है।',
    resultEn: 'Smooth higher learning, financial independence through erudition, and refined speech.',
    resultHi: 'उच्च विद्या का निर्बाध प्रवाह, ज्ञान द्वारा धनोपार्जन और मधुर पारिवारिक जीवन।',
  });

  // Yoga 10: Guru-Chandra Yoga (Moon & Jupiter in mutual Trikonas or Kendras)
  const diffMoonJup = ((jupiter.rasiHouseNumber - moon.rasiHouseNumber + 12) % 12) + 1;
  const isGuruChandra = [1, 4, 5, 7, 9, 10].includes(diffMoonJup);
  allYogas.push({
    id: 'guru_chandra',
    nameEn: 'Guru-Chandra Yoga (Scholarly Soul & Intuitive Wisdom)',
    nameHi: 'गुरु-चंद्र योग (विद्वता, आत्मिक शांति व उच्च प्रतिभा)',
    classicalSource: 'Saravali & Jatak Parijata',
    isPresent: isGuruChandra,
    strengthPercent: isGuruChandra ? 90 : 0,
    planetsInvolved: ['Moon', 'Jupiter'],
    conditionMetEn: isGuruChandra
      ? `Moon and Jupiter are mutually placed in Kendra/Trikona (${diffMoonJup}th house axis).`
      : 'Moon and Jupiter are in 2/12, 6/8, or 3/11 mutual relationship.',
    conditionMetHi: isGuruChandra
      ? `चंद्र और गुरु परस्पर केंद्र अथवा त्रिकोण (${diffMoonJup}वें भाव अक्ष) पर स्थित हैं।`
      : 'चंद्र व गुरु के मध्य षडाष्टक या द्विर्द्वादश स्थिति है।',
    resultEn: 'Eminent scholar with intuitive grasping; excels in education and thrives in international ventures.',
    resultHi: 'उच्च कोटि के विद्वान, अंतर्दृष्टि से अध्ययन करने वाले तथा अंतरराष्ट्रीय उपक्रमों में सफल।',
  });

  const activeYogas = allYogas.filter((y) => y.isPresent);

  // =========================================================================
  // 4. SPECIALIZED ACADEMIC & INTELLECTUAL TALENTS
  // =========================================================================
  const talents: AcademicTalentProfile[] = [];

  // Talent 1: Kushagra Buddhi (High Intellect & Grasping Power)
  let intScore = 55;
  if (['Exalted', 'Own Sign'].includes(mercury.dignity)) intScore += 18;
  if (mercury.rasiHouseNumber === 5) intScore += 15;
  if (posL5.rasiHouseNumber === 5 || ['Exalted', 'Own Sign'].includes(posL5.dignity)) intScore += 12;
  if (hasBudhaditya) intScore += 10;
  if (isMercuryDebilitated) intScore -= 18;
  intScore = Math.max(25, Math.min(99, intScore));
  talents.push({
    domainId: 'intelligence',
    domainNameEn: 'Kushagra Buddhi (Intellect & Grasping Power)',
    domainNameHi: 'कुशाग्र बुद्धि एवं तीव्र ग्रहण क्षमता',
    score: intScore,
    levelEn: intScore >= 80 ? 'Supreme Mastery' : intScore >= 65 ? 'High Aptitude' : 'Moderate / Steady',
    levelHi: intScore >= 80 ? 'परम मेधावी' : intScore >= 65 ? 'तीव्र बुद्धि' : 'संतुलित बुद्धि',
    classicalSutraEn: '5th house & Mercury fortified in Kendras/Trikonas bestow razor-sharp conceptual comprehension.',
    classicalSutraHi: 'पंचम भाव व बुध की शुभ स्थिति जातक को किसी भी विषय को तुरंत आत्मसात करने की क्षमता देती है।',
    detailedInsightEn: `Mercury in House ${mercury.rasiHouseNumber} (${mercury.dignity}) and 5th Lord ${l5} in House ${posL5.rasiHouseNumber} anchor logical comprehension.`,
    detailedInsightHi: `बुध भाव ${mercury.rasiHouseNumber} (${mercury.dignity}) तथा पंचमेश ${PLANET_HI[l5]} भाव ${posL5.rasiHouseNumber} में स्थित होकर तर्कशक्ति को दिशा देते हैं।`,
  });

  // Talent 2: Smriti Shakti (Exceptional Memory & Retention)
  let memScore = 52;
  if (['Exalted', 'Own Sign'].includes(posL5.dignity)) memScore += 15;
  if (moon.dignity === 'Exalted' || moon.dignity === 'Own Sign') memScore += 14;
  if (jupiter.rasiHouseNumber === 5) memScore += 12;
  const h5Occupants = chart.planets.filter((p) => p.rasiHouseNumber === 5).map((p) => p.id as NineGrahaId);
  if (h5Occupants.some((p) => NATURAL_BENEFICS.has(p))) memScore += 10;
  if (h5Occupants.some((p) => NATURAL_MALEFICS.has(p))) memScore -= 12;
  memScore = Math.max(25, Math.min(98, memScore));
  talents.push({
    domainId: 'memory',
    domainNameEn: 'Smriti Shakti (Memory Retention & Recall)',
    domainNameHi: 'स्मृति शक्ति एवं तीव्र स्मरण क्षमता',
    score: memScore,
    levelEn: memScore >= 80 ? 'Supreme Mastery' : memScore >= 65 ? 'High Aptitude' : 'Moderate / Steady',
    levelHi: memScore >= 80 ? 'विलक्षण स्मरण' : memScore >= 65 ? 'सशक्त स्मृति' : 'सामान्य स्मरण',
    classicalSutraEn: 'Benefics influencing 5th house and Moon bestow long-range photographic memory and calm exam recall.',
    classicalSutraHi: 'पंचम भाव व चंद्र पर शुभ प्रभाव जातक को लंबे समय तक याद रखने व परीक्षा में सटीक स्मरण की शक्ति देते हैं।',
    detailedInsightEn: `Moon in House ${moon.rasiHouseNumber} and 5th house (${SIGNS[(ascSign + 4) % 12].name}) hold ${chart.ashtakavarga.sarva[(ascSign + 4) % 12]} SAV bindus.`,
    detailedInsightHi: `चंद्र भाव ${moon.rasiHouseNumber} में तथा पंचम भाव (${SIGN_HI[(ascSign + 4) % 12]}) में ${chart.ashtakavarga.sarva[(ascSign + 4) % 12]} अष्टकवर्ग बिंदु हैं।`,
  });

  // Talent 3: Ganita Pravinya (Mathematics & Computation)
  let mathScore = 50;
  if (l2 === 'Mercury' || mercury.rasiHouseNumber === 2) mathScore += 16;
  if ([1, 4, 7, 10].includes(jupiter.rasiHouseNumber)) mathScore += 12;
  if (venus.dignity === 'Exalted' || mars.rasiHouseNumber === 2) mathScore += 10;
  if (hasBudhaditya) mathScore += 10;
  if (isMercuryInMarsSign) mathScore += 8; // Mars+Mercury gives technical precision
  mathScore = Math.max(25, Math.min(99, mathScore));
  talents.push({
    domainId: 'mathematics',
    domainNameEn: 'Ganita Pravinya (Mathematics, Logic & Algorithms)',
    domainNameHi: 'गणित प्रावीण्य, तर्कशास्त्र एवं एल्गोरिदम',
    score: mathScore,
    levelEn: mathScore >= 80 ? 'Supreme Mastery' : mathScore >= 65 ? 'High Aptitude' : 'Moderate / Steady',
    levelHi: mathScore >= 80 ? 'गणित मर्मज्ञ' : mathScore >= 65 ? 'उच्च तार्किक क्षमता' : 'संतुलित गणना',
    classicalSutraEn: 'Jupiter in Kendra with Mercury/Mars connected to 2nd house creates mathematical genius and computer logic.',
    classicalSutraHi: 'केंद्र में गुरु तथा बुध/मंगल का द्वितीय भाव से संबंध गणित, सांख्यिकी व कोडिंग में असाधारण प्रतिभा देता है।',
    detailedInsightEn: `Mercury (${mercury.dignity}) and Mars (${mars.dignity}) combine structural mechanics with computational speed.`,
    detailedInsightHi: `बुध (${mercury.dignity}) व मंगल (${mars.dignity}) मिलकर संरचनात्मक तर्क व तीव्र गणना क्षमता का निर्माण करते हैं।`,
  });

  // Talent 4: Vyakaran Pravinya (Grammar & Linguistics)
  let gramScore = 50;
  if (l2 === 'Jupiter' || jupiter.rasiHouseNumber === 2) gramScore += 15;
  if (sun.rasiHouseNumber === 2 || venus.rasiHouseNumber === 2) gramScore += 12;
  if (hasBalai) gramScore += 20;
  if (['Exalted', 'Own Sign'].includes(jupiter.dignity)) gramScore += 10;
  gramScore = Math.max(25, Math.min(98, gramScore));
  talents.push({
    domainId: 'grammar',
    domainNameEn: 'Vyakaran Pravinya (Grammar, Philology & Languages)',
    domainNameHi: 'व्याकरण प्रावीण्य, भाषाविज्ञान व साहित्य',
    score: gramScore,
    levelEn: gramScore >= 80 ? 'Supreme Mastery' : gramScore >= 65 ? 'High Aptitude' : 'Moderate / Steady',
    levelHi: gramScore >= 80 ? 'व्याकरण मर्मज्ञ' : gramScore >= 65 ? 'बहुभाषा प्रवीण' : 'संतुलित भाषा ज्ञान',
    classicalSutraEn: 'Jupiter combined with 2nd lord and aspected by Sun/Venus produces an authoritative grammarian and translator.',
    classicalSutraHi: 'द्वितीयेश व गुरु पर सूर्य/शुक्र का प्रभाव जातक को व्याकरण, भाषाशास्त्र व प्रामाणिक साहित्य का विद्वान बनाता है।',
    detailedInsightEn: `Jupiter (H${jupiter.rasiHouseNumber}) and 2nd Lord ${l2} (H${posL2.rasiHouseNumber}) govern linguistic depth and structural grammar.`,
    detailedInsightHi: `गुरु (भाव ${jupiter.rasiHouseNumber}) व द्वितीयेश ${PLANET_HI[l2]} भाषा की शुद्धता और व्याकरण के नियमों पर अधिकार देते हैं।`,
  });

  // Talent 5: Guhya Vidya & Jyotish (Astrology, Occult & Deep Research)
  let occScore = 48;
  const isMoonMerInKendra = [1, 4, 7, 10].includes(moon.rasiHouseNumber) && [1, 4, 7, 10].includes(mercury.rasiHouseNumber);
  if (isMoonMerInKendra) occScore += 18;
  if (jupiter.rasiHouseNumber === 2 || jupiter.rasiHouseNumber === 8 || jupiter.rasiHouseNumber === 9) occScore += 15;
  if (ketu.rasiHouseNumber === 5 || ketu.rasiHouseNumber === 8 || ketu.rasiHouseNumber === 9) occScore += 14;
  if (hasKalanithi || hasSaraswati) occScore += 12;
  occScore = Math.max(25, Math.min(99, occScore));
  talents.push({
    domainId: 'occult_astrology',
    domainNameEn: 'Guhya Vidya & Jyotish (Astrology, Philosophy & Research)',
    domainNameHi: 'गूढ़ विद्या, ज्योतिष, दर्शन एवं मौलिक अनुसंधान',
    score: occScore,
    levelEn: occScore >= 80 ? 'Supreme Mastery' : occScore >= 65 ? 'High Aptitude' : 'Moderate / Steady',
    levelHi: occScore >= 80 ? 'गूढ़ विद्या मनीषी' : occScore >= 65 ? 'सटीक अंतर्दृष्टि' : 'रुचि व प्राथमिक ज्ञान',
    classicalSutraEn: 'Moon and Mercury in Kendras with Jupiter in 2nd/8th create an expert astrologer and esoteric philosopher.',
    classicalSutraHi: 'केंद्र में चंद्र-बुध तथा द्वितीय/अष्टम में गुरु का प्रभाव जातक को त्रिकालदर्शी ज्योतिषी व दार्शनिक बनाता है।',
    detailedInsightEn: `8th Lord ${l8} in House ${posL8.rasiHouseNumber} and Ketu in House ${ketu.rasiHouseNumber} unlock intuitive metaphysical perception.`,
    detailedInsightHi: `अष्टमेश ${PLANET_HI[l8]} भाव ${posL8.rasiHouseNumber} में तथा केतु भाव ${ketu.rasiHouseNumber} में अवचेतन ज्ञान के द्वार खोलते हैं।`,
  });

  // Talent 6: Vak Siddhi & Bhashan Kala (Eloquence & Public Oratory)
  let vakScore = 52;
  if (posL2.rasiHouseNumber === 2 && !hasMaleficInH2) vakScore += 16;
  if (jupiter.rasiHouseNumber === 2 && mercury.rasiHouseNumber === 2) vakScore += 20;
  const h3Occupants = chart.planets.filter((p) => p.rasiHouseNumber === 3).map((p) => p.id as NineGrahaId);
  if (h3Occupants.includes('Jupiter') || h3Occupants.includes('Mercury')) vakScore += 12;
  if (posL2.dignity === 'Exalted') vakScore += 10;
  vakScore = Math.max(25, Math.min(98, vakScore));
  talents.push({
    domainId: 'eloquence',
    domainNameEn: 'Vak Siddhi & Bhashan (Eloquence & Public Oratory)',
    domainNameHi: 'वाक् सिद्धि, वक्तृत्व कला एवं व्याख्यान प्रावीण्य',
    score: vakScore,
    levelEn: vakScore >= 80 ? 'Supreme Mastery' : vakScore >= 65 ? 'High Aptitude' : 'Moderate / Steady',
    levelHi: vakScore >= 80 ? 'अमोघ वक्ता' : vakScore >= 65 ? 'कुशल वक्ता' : 'स्पष्ट वक्ता',
    classicalSutraEn: 'Unafflicted Jupiter or Mercury in 2nd or 3rd house creates magnetic, articulate, and persuasive public speakers.',
    classicalSutraHi: 'द्वितीय अथवा तृतीय भाव में शुभ गुरु व बुध की स्थिति जातक को सम्मोहक, तार्किक व प्रभावशाली वक्ता बनाती है।',
    detailedInsightEn: `2nd house carries ${chart.ashtakavarga.sarva[(ascSign + 1) % 12]} SAV bindus; speech delivery is clear and persuasive.`,
    detailedInsightHi: `द्वितीय भाव में ${chart.ashtakavarga.sarva[(ascSign + 1) % 12]} अष्टकवर्ग बिंदु हैं; वाणी में वजन और तार्किक स्पष्टता रहेगी।`,
  });

  // =========================================================================
  // 5. NINE PLANETARY EDUCATION STREAMS & COLLEGE DISCIPLINES
  // =========================================================================
  const planetaryStreams: PlanetaryStreamFit[] = [
    {
      planetId: 'Sun',
      karakatwaNameEn: 'Atma Karaka (Governance, Soul & Authority)',
      karakatwaNameHi: 'आत्मकारक (प्रशासन, चिकित्सा व राजकीय अधिकार)',
      facultyEn: 'Public Administration, Civil Services, Healthcare Management & Political Science',
      facultyHi: 'लोक प्रशासन, सिविल सेवा, स्वास्थ्य प्रबंधन, चिकित्सा शास्त्र एवं राजनीति विज्ञान',
      recommendedDegreesEn: ['M.B.B.S. / Medicine', 'Public Administration (MPA)', 'Political Science & Governance', 'Health Sciences'],
      recommendedDegreesHi: ['एम.बी.बी.एस. / चिकित्सा', 'लोक प्रशासन (MPA)', 'राजनीति विज्ञान व शासन', 'स्वास्थ्य विज्ञान'],
      affinityScore: Math.min(98, 55 + (sun.dignity === 'Exalted' ? 25 : sun.dignity === 'Own Sign' ? 20 : 5) + ([1, 5, 9, 10].includes(sun.rasiHouseNumber) ? 15 : 0)),
      isRecommended: [1, 5, 9, 10].includes(sun.rasiHouseNumber) || sun.dignity === 'Exalted',
      explanationEn: `Sun in House ${sun.rasiHouseNumber} (${sun.dignity}) provides executive drive and institutional command.`,
      explanationHi: `सूर्य भाव ${sun.rasiHouseNumber} (${sun.dignity}) में नेतृत्व, प्रशासनिक क्षमता और राजकीय क्षेत्रों में सम्मान दिलाता है।`,
    },
    {
      planetId: 'Moon',
      karakatwaNameEn: 'Manas Karaka (Mind, Psychology & Creative Care)',
      karakatwaNameHi: 'मनःकारक (मनोविज्ञान, ललित कलाएं व जल संपदा)',
      facultyEn: 'Psychology, Psychiatry, Nursing, Human Resources, Fine Arts & Marine Biology',
      facultyHi: 'मनोविज्ञान, मनोचिकित्सा, नर्सिंग, मानव संसाधन, ललित कलाएं एवं समुद्री विज्ञान',
      recommendedDegreesEn: ['Clinical Psychology (M.A./M.Sc.)', 'Nursing & Public Health', 'Fine Arts & Literature', 'Hospitality Management'],
      recommendedDegreesHi: ['नैदानिक मनोविज्ञान (M.A./M.Sc.)', 'नर्सिंग व जनस्वास्थ्य', 'ललित कलाएं व साहित्य', 'आतिथ्य प्रबंधन'],
      affinityScore: Math.min(98, 55 + (moon.dignity === 'Exalted' ? 25 : moon.dignity === 'Own Sign' ? 20 : 5) + ([4, 5, 9, 10].includes(moon.rasiHouseNumber) ? 15 : 0)),
      isRecommended: [4, 5, 9, 10].includes(moon.rasiHouseNumber) || moon.dignity === 'Exalted',
      explanationEn: `Moon in House ${moon.rasiHouseNumber} (${moon.dignity}) governs empathetic observation and sensory intelligence.`,
      explanationHi: `चंद्र भाव ${moon.rasiHouseNumber} (${moon.dignity}) में कल्पनाशीलता, मानवीय संवेदना और रचनात्मक शोध की क्षमता देता है।`,
    },
    {
      planetId: 'Mars',
      karakatwaNameEn: 'Shakti Karaka (Engineering, Defense & Architecture)',
      karakatwaNameHi: 'शक्ति व पराक्रम कारक (इंजीनियरिंग, रक्षा व वास्तुकला)',
      facultyEn: 'Mechanical Engineering, Civil Technology, Military Science, Surgery & Industrial Chemistry',
      facultyHi: 'मैकेनिकल इंजीनियरिंग, सिविल प्रौद्योगिकी, रक्षा विज्ञान, शल्य चिकित्सा एवं औद्योगिक रसायन',
      recommendedDegreesEn: ['B.Tech / M.Tech Engineering', 'Surgery (M.S.)', 'Architecture & Planning', 'Applied Physics / Materials'],
      recommendedDegreesHi: ['बी.टेक / एम.टेक इंजीनियरिंग', 'शल्य चिकित्सा (M.S.)', 'वास्तुकला व नगर नियोजन', 'अनुप्रयुक्त भौतिकी'],
      affinityScore: Math.min(98, 55 + (mars.dignity === 'Exalted' ? 25 : mars.dignity === 'Own Sign' ? 20 : 5) + ([1, 3, 5, 6, 10].includes(mars.rasiHouseNumber) ? 15 : 0)),
      isRecommended: [1, 3, 5, 6, 10].includes(mars.rasiHouseNumber) || mars.dignity === 'Exalted',
      explanationEn: `Mars in House ${mars.rasiHouseNumber} (${mars.dignity}) drives technical precision, physical structures, and operational problem-solving.`,
      explanationHi: `मंगल भाव ${mars.rasiHouseNumber} (${mars.dignity}) में तकनीकी दक्षता, संरचनात्मक निर्माण और मशीनरी में कुशलता देता है।`,
    },
    {
      planetId: 'Mercury',
      karakatwaNameEn: 'Buddhi Karaka (Computation, Data & Analytics)',
      karakatwaNameHi: 'बुद्धिकारक (कंप्यूटर, वाणिज्य, सांख्यिकी व पत्रकारिता)',
      facultyEn: 'Computer Science, Artificial Intelligence, Chartered Accountancy (CA), Economics & Media',
      facultyHi: 'कंप्यूटर साइंस, कृत्रिम बुद्धिमत्ता (AI), चार्टर्ड अकाउंटेंसी (CA), अर्थशास्त्र एवं मीडिया',
      recommendedDegreesEn: ['Computer Science (B.Tech/MCA)', 'Chartered Accountancy (CA/CFA)', 'Data Analytics & Statistics', 'Mass Communication'],
      recommendedDegreesHi: ['कंप्यूटर साइंस (B.Tech/MCA)', 'चार्टर्ड अकाउंटेंसी (CA/CFA)', 'डेटा एनालिटिक्स व सांख्यिकी', 'पत्रकारिता व जनसंचार'],
      affinityScore: Math.min(98, 55 + (mercury.dignity === 'Exalted' ? 25 : mercury.dignity === 'Own Sign' ? 20 : 5) + ([1, 2, 4, 5, 10].includes(mercury.rasiHouseNumber) ? 15 : 0)),
      isRecommended: [1, 2, 4, 5, 10].includes(mercury.rasiHouseNumber) || mercury.dignity === 'Exalted' || hasBudhaditya,
      explanationEn: `Mercury in House ${mercury.rasiHouseNumber} (${mercury.dignity}) empowers fast coding logic, financial calculation, and eloquent presentation.`,
      explanationHi: `बुध भाव ${mercury.rasiHouseNumber} (${mercury.dignity}) में कोडिंग, वित्तीय विश्लेषण और त्वरित गणनाओं में असाधारण निपुणता देता है।`,
    },
    {
      planetId: 'Jupiter',
      karakatwaNameEn: 'Jnana Karaka (Higher Law, Philosophy & Pedagogy)',
      karakatwaNameHi: 'ज्ञानकारक (विधि, दर्शन, अध्यापन व सर्वोच्च शोध)',
      facultyEn: 'Jurisprudence (Law), University Academics, Vedic Studies, Economics & Educational Leadership',
      facultyHi: 'विधि शास्त्र (Law), विश्वविद्यालयी अध्यापन, वैदिक अध्ययन, अर्थशास्त्र एवं शैक्षणिक प्रशासन',
      recommendedDegreesEn: ['Law (LL.B. / LL.M.)', 'Doctor of Philosophy (Ph.D.)', 'Vedic Sciences & Sanskrit', 'Educational Pedagogy (M.Ed.)'],
      recommendedDegreesHi: ['विधि शास्त्र (LL.B. / LL.M.)', 'विद्या वाचस्पति (Ph.D.)', 'वैदिक शास्त्र व दर्शन', 'शिक्षा शास्त्र (M.Ed.)'],
      affinityScore: Math.min(98, 55 + (jupiter.dignity === 'Exalted' ? 25 : jupiter.dignity === 'Own Sign' ? 20 : 5) + ([1, 2, 4, 5, 9, 10].includes(jupiter.rasiHouseNumber) ? 15 : 0)),
      isRecommended: [1, 2, 4, 5, 9, 10].includes(jupiter.rasiHouseNumber) || jupiter.dignity === 'Exalted',
      explanationEn: `Jupiter in House ${jupiter.rasiHouseNumber} (${jupiter.dignity}) confers comprehensive wisdom, legal discernment, and mentorship authority.`,
      explanationHi: `गुरु भाव ${jupiter.rasiHouseNumber} (${jupiter.dignity}) में सर्वोच्च शोध, न्याय शास्त्र और उच्च शैक्षणिक संस्थाओं में प्रतिष्ठा दिलाता है।`,
    },
    {
      planetId: 'Venus',
      karakatwaNameEn: 'Kala Karaka (Aesthetics, Design & Foreign Trade)',
      karakatwaNameHi: 'कलाकारक (डिजाइन, दृश्य कलाएं, वाणिज्य व विदेशी भाषाएं)',
      facultyEn: 'Graphic Design, Architecture, Cinema & Animation, Foreign Trade, Fashion & Luxury Commerce',
      facultyHi: 'ग्राफिक डिजाइन, वास्तुकला, सिनेमा व एनीमेशन, विदेश व्यापार, फैशन एवं सौंदर्य शास्त्र',
      recommendedDegreesEn: ['Bachelor of Design (B.Des)', 'Architecture (B.Arch)', 'Visual Arts & Media', 'International Business (MBA)'],
      recommendedDegreesHi: ['बैचलर ऑफ डिजाइन (B.Des)', 'वास्तुकला (B.Arch)', 'दृश्य कलाएं व मीडिया', 'अंतरराष्ट्रीय व्यापार (MBA)'],
      affinityScore: Math.min(98, 55 + (venus.dignity === 'Exalted' ? 25 : venus.dignity === 'Own Sign' ? 20 : 5) + ([1, 2, 4, 5, 9, 12].includes(venus.rasiHouseNumber) ? 15 : 0)),
      isRecommended: [1, 2, 4, 5, 9, 12].includes(venus.rasiHouseNumber) || venus.dignity === 'Exalted',
      explanationEn: `Venus in House ${venus.rasiHouseNumber} (${venus.dignity}) instills architectural imagination, artistic synthesis, and commercial diplomacy.`,
      explanationHi: `शुक्र भाव ${venus.rasiHouseNumber} (${venus.dignity}) में कलात्मक सौंदर्य, डिजाइनिंग और अंतरराष्ट्रीय व्यापार में सफलता देता है।`,
    },
    {
      planetId: 'Saturn',
      karakatwaNameEn: 'Tapas Karaka (Earth Sciences, History & Labor Law)',
      karakatwaNameHi: 'तप व श्रम कारक (भूगर्भ शास्त्र, इतिहास, पुरातत्व व श्रम कानून)',
      facultyEn: 'Geology, Mining Engineering, Archaeology, Labor Law, Industrial Management & History',
      facultyHi: 'भूगर्भ शास्त्र, खनन इंजीनियरिंग, पुरातत्व, श्रम कानून, औद्योगिक प्रबंधन एवं इतिहास',
      recommendedDegreesEn: ['Geology & Earth Sciences', 'Mining Engineering', 'Archaeology & Heritage Studies', 'Labor Law & Industrial Relations'],
      recommendedDegreesHi: ['भूगर्भ व पृथ्वी विज्ञान', 'खनन इंजीनियरिंग', 'पुरातत्व व ऐतिहासिक शोध', 'श्रम विधि व औद्योगिक संबंध'],
      affinityScore: Math.min(98, 55 + (saturn.dignity === 'Exalted' ? 25 : saturn.dignity === 'Own Sign' ? 20 : 5) + ([3, 6, 8, 10, 11].includes(saturn.rasiHouseNumber) ? 15 : 0)),
      isRecommended: [3, 6, 8, 10, 11].includes(saturn.rasiHouseNumber) || saturn.dignity === 'Exalted',
      explanationEn: `Saturn in House ${saturn.rasiHouseNumber} (${saturn.dignity}) brings perseverance for rigorous archival research and material sciences.`,
      explanationHi: `शनि भाव ${saturn.rasiHouseNumber} (${saturn.dignity}) में निरंतर शोध, पुरातात्विक साक्ष्यों के विश्लेषण और धैर्यपूर्वक अध्ययन की शक्ति देता है।`,
    },
    {
      planetId: 'Rahu',
      karakatwaNameEn: 'Anveshana Karaka (Biotech, AI & Foreign Scholarships)',
      karakatwaNameHi: 'अन्वेषण कारक (बायो-टेक, कृत्रिम बुद्धिमत्ता व विदेशी शिक्षा)',
      facultyEn: 'Artificial Intelligence, Robotics, Biotechnology, Aviation, Aerospace & Advanced Analytics',
      facultyHi: 'कृत्रिम बुद्धिमत्ता (AI), रोबोटिक्स, जैव प्रौद्योगिकी, विमानन, एयरोस्पेस एवं उन्नत विश्लेषण',
      recommendedDegreesEn: ['Artificial Intelligence & Robotics', 'Biotechnology & Genetics', 'Aeronautical Engineering', 'Foreign Degree Programs'],
      recommendedDegreesHi: ['आर्टिफिशियल इंटेलिजेंस व रोबोटिक्स', 'बायोटेक्नोलॉजी व जेनेटिक्स', 'एरोनॉटिकल इंजीनियरिंग', 'विदेशी विश्वविद्यालय उपाधि'],
      affinityScore: Math.min(98, 55 + ([3, 6, 9, 10, 11, 12].includes(rahu.rasiHouseNumber) ? 20 : 5)),
      isRecommended: [3, 6, 9, 10, 11, 12].includes(rahu.rasiHouseNumber),
      explanationEn: `Rahu in House ${rahu.rasiHouseNumber} propels futuristic technology exploration and international university admissions.`,
      explanationHi: `राहु भाव ${rahu.rasiHouseNumber} में अत्याधुनिक तकनीकों, विदेशी छात्रवृत्ति और गैर-पारंपरिक वैज्ञानिक शोध में अवसर खोलता है।`,
    },
    {
      planetId: 'Ketu',
      karakatwaNameEn: 'Moksha Karaka (Cryptography, Metaphysics & Deep Code)',
      karakatwaNameHi: 'मोक्ष कारक (क्रिप्टोग्राफी, सूक्ष्म एल्गोरिदम व आध्यात्मिक तत्वज्ञान)',
      facultyEn: 'Cybersecurity, Cryptography, Quantum Computing, Metaphysics, Micro-biology & Vedic Epistemology',
      facultyHi: 'साइबर सुरक्षा, क्रिप्टोग्राफी, क्वांटम कंप्यूटिंग, तत्वमीमांसा, सूक्ष्म जीवविज्ञान व वैदिक दर्शन',
      recommendedDegreesEn: ['Cybersecurity & Cryptography', 'Quantum Information Systems', 'Microbiology & Biochemistry', 'Spiritual Philosophy'],
      recommendedDegreesHi: ['साइबर सुरक्षा व क्रिप्टोग्राफी', 'क्वांटम सूचना प्रणाली', 'माइक्रोबायोलॉजी व बायोकेमिस्ट्री', 'आध्यात्मिक दर्शन'],
      affinityScore: Math.min(98, 55 + ([5, 8, 9, 12].includes(ketu.rasiHouseNumber) ? 20 : 5)),
      isRecommended: [5, 8, 9, 12].includes(ketu.rasiHouseNumber),
      explanationEn: `Ketu in House ${ketu.rasiHouseNumber} unlocks subtle conceptual penetration into hidden codes and metaphysical abstractions.`,
      explanationHi: `केतु भाव ${ketu.rasiHouseNumber} में सूक्ष्म कोड, जटिल एल्गोरिदम और अमूर्त वैज्ञानिक सिद्धांतों को समझने की अलौकिक दृष्टि देता है।`,
    },
  ];

  // =========================================================================
  // 6. NATAL MOON'S ROLE IN EDUCATION (MANAS, CHITTA & RETENTION)
  // =========================================================================
  const sunMoonDiff = (moon.longitude - sun.longitude + 360) % 360;
  const isWaxing = sunMoonDiff < 180;
  const pakshaBalaEn = isWaxing ? 'Shukla Paksha (Bright Waxing — Strong Mental Retention)' : 'Krishna Paksha (Waning — Introspective Concentration)';
  const pakshaBalaHi = isWaxing ? 'शुक्ल पक्ष (शुभ बलवान चंद्र — तीव्र स्मरण व प्रसन्नता)' : 'कृष्ण पक्ष (अंतर्मुखी एकाग्रता व सूक्ष्म चिंतन)';

  let moonFocusScore = 55;
  if (['Exalted', 'Own Sign'].includes(moon.dignity)) moonFocusScore += 20;
  if (isWaxing) moonFocusScore += 10;
  if ([4, 5, 9, 10].includes(moon.rasiHouseNumber)) moonFocusScore += 12;
  if (moon.dignity === 'Debilitated') moonFocusScore -= 20;
  moonFocusScore = Math.max(25, Math.min(98, moonFocusScore));

  let cogEn = '';
  let cogHi = '';
  switch (moon.signIndex) {
    case 1: // Taurus
      cogEn = 'Moon in Taurus: Highly intelligent, practical, grounded retention with or without formal coaching.';
      cogHi = 'वृषभ का चंद्र: अत्यंत कुशाग्र, व्यावहारिक एवं सुदृढ़ स्मृति; स्वाध्याय से भी उच्चतम ज्ञान अर्जित करने में सक्षम।';
      break;
    case 2: // Gemini
      cogEn = 'Moon in Gemini: Scholarly, versatile, multifaceted learner, quick reader with varied literary interests.';
      cogHi = 'मिथुन का चंद्र: विद्वान, बहुमुखी प्रतिभा का धनी, तीव्र पाठक तथा विविध विषयों में सहज गति।';
      break;
    case 5: // Virgo
      cogEn = 'Moon in Virgo: Methodical, analytical, detail-oriented precision, excels in complex structured notes.';
      cogHi = 'कन्या का चंद्र: क्रमबद्ध, विश्लेषणात्मक व सूक्ष्मग्राही बुद्धि; विस्तृत नोट्स व सांख्यिकी में निपुण।';
      break;
    case 6: // Libra
      cogEn = 'Moon in Libra: Balanced aesthetic intellect, fair evaluator, thrives in cooperative academic discussions.';
      cogHi = 'तुला का चंद्र: संतुलित व न्यायप्रिय बुद्धि; सामूहिक अध्ययन व सौहार्दपूर्ण विमर्श में उत्कृष्ट प्रदर्शन।';
      break;
    case 8: // Sagittarius
      cogEn = 'Moon in Sagittarius: Erudite philosopher, avid researcher, excels in literature and authorship.';
      cogHi = 'धनु का चंद्र: दार्शनिक मेधा, उच्च धर्मग्रंथों का ज्ञाता, श्रेष्ठ लेखक व शोधकर्ता बनने का योग।';
      break;
    case 10: // Aquarius
      cogEn = 'Moon in Aquarius: Visionary intellect with flashes of intuition, original unconventional thesis work.';
      cogHi = 'कुंभ का चंद्र: दूरदर्शी वैज्ञानिक बुद्धि, अंतःप्रेरणा युक्त शोध और मौलिक विचारों का प्रस्फुटन।';
      break;
    default:
      cogEn = `Moon in ${moon.signName}: Emotionally engaged intellect, responsive to mentorship and dedicated revision.`;
      cogHi = `चंद्र ${SIGN_HI[moon.signIndex]} राशि में: संवेदनशील बुद्धि, निरंतर अभ्यास व गुरुजनों के मार्गदर्शन से निरंतर प्रगतिशील।`;
      break;
  }

  const moonPsychology: MoonEducationPsychology = {
    moonSignEn: moon.signName,
    moonSignHi: SIGN_HI[moon.signIndex],
    moonHouse: moon.rasiHouseNumber,
    isWaxing,
    pakshaBalaEn,
    pakshaBalaHi,
    mentalFocusScore: moonFocusScore,
    cognitiveProfileEn: cogEn,
    cognitiveProfileHi: cogHi,
    learningDispositionEn: `Moon in House ${moon.rasiHouseNumber} governs the emotional readiness and sensory stamina to study.`,
    learningDispositionHi: `चंद्र भाव ${moon.rasiHouseNumber} में अध्ययन के प्रति मानसिक तत्परता, एकाग्रता और भावनात्मक संतुलन का निर्धारण करता है।`,
    visualAndSensoryFocusEn: 'In classical Jyotish, Moon represents the sensory perceptual window (Chitta and vision). Sound sleep and balanced hydration preserve long study hours.',
    visualAndSensoryFocusHi: 'शास्त्रीय ज्योतिष अनुसार चंद्र चित्त व दृष्टि का कारक है। पर्याप्त जल सेवन और रात्रि में शांत विश्राम अध्ययन क्षमता को द्विगुणित करता है।',
  };

  // =========================================================================
  // 7. EDUCATION TIMELINE & MILESTONE WINDOWS
  // =========================================================================
  const timelineWindows: EducationTimelineWindow[] = [
    {
      stage: 'Primary Schooling',
      stageHi: 'प्राथमिक एवं बुनियादी शिक्षा (कक्षा 1 से 5)',
      ageRange: 'Age 5–11',
      governingHouses: [2, 4],
      governingPlanets: [l2, l4, 'Mercury'],
      timingDashaEn: `Governed by dasha of 2nd lord ${l2} and 4th lord ${l4}.`,
      timingDashaHi: `द्वितीयेश ${PLANET_HI[l2]} व चतुर्थेश ${PLANET_HI[l4]} की दशा/अंतर्दशा द्वारा संचालित।`,
      scholasticOutcomeEn: 'Establishes basic literacy, oral expression, family funding, and disciplined homework routine.',
      scholasticOutcomeHi: 'बुनियादी साक्षरता, मौखिक अभिव्यक्ति, पारिवारिक सहयोग और नियमित अध्ययन की आदतों का निर्माण।',
      advisoryPrecautionEn: 'Guard against eye strain and speech hesitation if 2nd house has malefic occupants.',
      advisoryPrecautionHi: 'यदि द्वितीय भाव में क्रूर ग्रह हों तो नेत्रों की सुरक्षा व संकोच त्यागने पर ध्यान दें।',
    },
    {
      stage: 'Secondary & Matriculation',
      stageHi: 'माध्यमिक एवं मैट्रिक शिक्षा (कक्षा 6 से 10)',
      ageRange: 'Age 12–16',
      governingHouses: [4, 5],
      governingPlanets: [l4, l5, 'Mercury', 'Moon'],
      timingDashaEn: `Governed by dasha of 4th lord ${l4} and 5th lord ${l5}.`,
      timingDashaHi: `चतुर्थेश ${PLANET_HI[l4]} व पंचमेश ${PLANET_HI[l5]} की दशा द्वारा संचालित।`,
      scholasticOutcomeEn: 'Foundation for board examinations, core curriculum mastery, and stream selection.',
      scholasticOutcomeHi: 'बोर्ड परीक्षाओं की तैयारी, मूल विषयों पर अधिकार और भविष्य की अध्ययन शाखा का चयन।',
      advisoryPrecautionEn: 'Papakartari on 4th or 5th house demands peaceful study space away from screen distractions.',
      advisoryPrecautionHi: 'चतुर्थ या पंचम भाव पर पापकर्तरी होने पर स्क्रीन व ध्यान भटकाने वाली चीजों से दूर शांत वातावरण रखें।',
    },
    {
      stage: 'College / Higher Secondary',
      stageHi: 'उच्चतर माध्यमिक व प्रतियोगी परीक्षा (10+2 / प्रवेश परीक्षा)',
      ageRange: 'Age 17–19',
      governingHouses: [5, 6],
      governingPlanets: [l5, l6, 'Mercury', 'Mars'],
      timingDashaEn: `Governed by dasha of 5th lord ${l5} and 6th lord ${l6} (competitive exams).`,
      timingDashaHi: `पंचमेश ${PLANET_HI[l5]} व षष्ठेश ${PLANET_HI[l6]} (प्रतियोगी परीक्षा विजय) द्वारा संचालित।`,
      scholasticOutcomeEn: 'Competitive entrance examinations, college merit lists, and professional specialization selection.',
      scholasticOutcomeHi: 'प्रवेश परीक्षाओं में सफलता, कॉलेज मेरिट लिस्ट में स्थान और विशिष्ट विषय का चयन।',
      advisoryPrecautionEn: 'Mars aspect on Mercury warns against rushed calculations; revise mock tests methodically.',
      advisoryPrecautionHi: 'बुध पर मंगल की दृष्टि हो तो जल्दबाजी में त्रुटि से बचें; मॉक टेस्ट का व्यवस्थित अभ्यास करें।',
    },
    {
      stage: 'Graduation & Bachelor',
      stageHi: 'स्नातक उपाधि (Bachelor Degree / B.Tech / B.Sc / B.A)',
      ageRange: 'Age 19–23',
      governingHouses: [4, 5, 9],
      governingPlanets: [l4, l5, l9, 'Jupiter'],
      timingDashaEn: `Governed by dasha of 5th lord ${l5} and 9th lord ${l9}.`,
      timingDashaHi: `पंचमेश ${PLANET_HI[l5]} व नवमेश ${PLANET_HI[l9]} की शुभ दशा में डिग्री की निर्विघ्न प्राप्ति।`,
      scholasticOutcomeEn: 'Graduation laurels, leadership roles in campus forums, and vocational certification.',
      scholasticOutcomeHi: 'स्नातक की उपाधि, विश्वविद्यालय परिसर में मान-सम्मान व व्यावसायिक प्रमाणन।',
      advisoryPrecautionEn: 'Fortify 5th lord to ensure outstanding cumulative grade point average (CGPA).',
      advisoryPrecautionHi: 'उत्कृष्ट अंक प्रतिशत (CGPA) सुनिश्चित करने हेतु पंचमेश के वैदिक मंत्रों का संबल लें।',
    },
    {
      stage: 'Post-Graduation / Master',
      stageHi: 'स्नातकोत्तर उपाधि (Master Degree / M.Tech / M.B.B.S / MBA / LL.M)',
      ageRange: 'Age 23–27',
      governingHouses: [9, 10],
      governingPlanets: [l9, l10, 'Jupiter'],
      timingDashaEn: `Governed by dasha of 9th lord ${l9} and 10th lord ${l10}.`,
      timingDashaHi: `नवमेश ${PLANET_HI[l9]} व दशमेश ${PLANET_HI[l10]} की दशा में उच्च विशेषज्ञता का उदय।`,
      scholasticOutcomeEn: 'Advanced domain mastery, specialized thesis submission, and high-tier placement.',
      scholasticOutcomeHi: 'विशिष्ट विषय पर विशेषज्ञता, शोध पत्र प्रकाशन और प्रतिष्ठित संस्थानों में चयन।',
      advisoryPrecautionEn: 'Respect mentors and senior faculty (9th house dharma) to receive crucial thesis endorsements.',
      advisoryPrecautionHi: 'गुरुजनों व शोध निर्देशकों का सम्मान करें (नवम भाव धर्म); इससे शोध को सहज अनुमोदन प्राप्त होगा।',
    },
    {
      stage: 'Research & Ph.D.',
      stageHi: 'गहन शोध एवं विद्या वाचस्पति (Ph.D. / M.Phil / Post-Doc)',
      ageRange: 'Age 25–35+',
      governingHouses: [8, 9, 11],
      governingPlanets: [l8, l9, l11, 'Saturn', 'Ketu', 'Jupiter'],
      timingDashaEn: `Governed by 8th lord ${l8} (hidden discoveries) and 9th lord ${l9} (defense).`,
      timingDashaHi: `अष्टमेश ${PLANET_HI[l8]} (गूढ़ खोज) व नवमेश ${PLANET_HI[l9]} (शोध उपाधि) द्वारा संचालित।`,
      scholasticOutcomeEn: 'Groundbreaking doctoral dissertation, international peer-reviewed citations, and tenure.',
      scholasticOutcomeHi: 'मौलिक शोध प्रबंध की स्वीकृति, अंतरराष्ट्रीय स्तर पर उद्धरण (Citations) और शैक्षणिक पद।',
      advisoryPrecautionEn: 'Patience required; 8th house research takes dedicated solitary digging before major breakthroughs.',
      advisoryPrecautionHi: 'अष्टम भाव शोध में धैर्य की अपेक्षा रखता है; निरंतर लगन से ऐतिहासिक सफलता प्राप्त होगी।',
    },
    {
      stage: 'Foreign University Studies',
      stageHi: 'विदेशी विश्वविद्यालय अध्ययन व अंतरराष्ट्रीय छात्रवृत्ति',
      ageRange: 'Any Higher Stage',
      governingHouses: [9, 12],
      governingPlanets: [l9, l12, 'Rahu', 'Jupiter'],
      timingDashaEn: `Governed by 9th lord ${l9} and 12th lord ${l12} or running Rahu dasha.`,
      timingDashaHi: `नवमेश ${PLANET_HI[l9]} व द्वादशेश ${PLANET_HI[l12]} अथवा राहु की दशा-अंतर्दशा में योग।`,
      scholasticOutcomeEn: 'International admissions, overseas fellowship / stipend, and cross-border university degree.',
      scholasticOutcomeHi: 'विदेश के शीर्ष विश्वविद्यालयों में प्रवेश, अंतरराष्ट्रीय छात्रवृत्ति व वैश्विक पहचान।',
      advisoryPrecautionEn: 'Ensure timely document clearance during supportive transits of Jupiter over 9th/12th axis.',
      advisoryPrecautionHi: 'गुरु के अनुकूल गोचर के समय वीजा व छात्रवृत्ति संबंधी औपचारिकताओं को पूर्ण करें।',
    },
  ];

  // =========================================================================
  // 8. OVERALL COMPOSITE SCORE & VERDICT
  // =========================================================================
  let totalScore = 58;
  // Houses contribution
  totalScore += (coreHouses.find((h) => h.houseNumber === 5)?.savBindus || 28) - 28;
  totalScore += (coreHouses.find((h) => h.houseNumber === 4)?.savBindus || 28) - 28;
  totalScore += (coreHouses.find((h) => h.houseNumber === 9)?.savBindus || 28) - 28;

  // Lords dignity
  const scoreDignity = (dig: string): number => {
    if (dig === 'Exalted') return 12;
    if (dig === 'Own Sign' || dig === 'Moolatrikona') return 8;
    if (dig === 'Great Friend' || dig === 'Friend') return 4;
    if (dig === 'Debilitated') return -12;
    return 0;
  };

  totalScore += scoreDignity(posL5.dignity);
  totalScore += scoreDignity(posL4.dignity);
  totalScore += scoreDignity(posL9.dignity);
  totalScore += scoreDignity(mercury.dignity) * 0.8;
  totalScore += scoreDignity(jupiter.dignity) * 0.8;

  // Yogas bonus
  totalScore += activeYogas.length * 4;

  // Penalties from breaks
  totalScore -= triggeredBreakCount * 3.5;

  const finalScore = Math.max(25, Math.min(98, Math.round(totalScore)));

  let overallVerdictEn = '';
  let overallVerdictHi = '';
  if (finalScore >= 80) {
    overallVerdictEn = 'Extraordinary Scholastic Potential: Destined for exceptional academic milestones, prestigious degrees, and scholarly renown.';
    overallVerdictHi = 'असाधारण शैक्षणिक सामर्थ्य: उच्च उपाधियों, राष्ट्रीय-अंतरराष्ट्रीय सम्मान और समाज में अद्वितीय विद्वता का प्रबल योग।';
  } else if (finalScore >= 65) {
    overallVerdictEn = 'Strong & Auspicious Academic Aptitude: Steady success across graduation and postgraduate disciplines with consistent merit.';
    overallVerdictHi = 'सशक्त व अनुकूल विद्या योग: स्नातक व उच्च शिक्षा में उत्कृष्ट सफलता, सुदृढ़ स्मरण शक्ति व परीक्षाओं में सफलता।';
  } else if (finalScore >= 50) {
    overallVerdictEn = 'Balanced Educational Trajectory: Progressive milestones achieved through dedicated effort, disciplined routine, and structured mentoring.';
    overallVerdictHi = 'संतुलित शैक्षणिक योग: नियमित अभ्यास व सुनियोजित मार्गदर्शन द्वारा क्रमशः प्रगतिशील परिणाम व डिग्री की प्राप्ति।';
  } else {
    overallVerdictEn = 'Demands Remedial Focus: Academic hurdles or delays require conscious discipline, quiet study environment, and Vedic remedial upayas.';
    overallVerdictHi = 'शास्त्रीय उपाय व संयम अपेक्षित: अध्ययन में व्यवधान दूर करने हेतु एकाग्रता, अनुकूल वातावरण व वैदिक उपायों की आवश्यकता।';
  }

  const classicalUpayas = {
    titleEn: 'Classical Vedic Remedial Upayas for Educational Excellence',
    titleHi: 'विद्या एवं उच्च शिक्षा हेतु शास्त्रसम्मत वैदिक उपाय',
    detailsEn: [
      'Chant the Saraswati Gayatri Mantra (Om Saraswatyai Vidmahe Brahmaputryai Dhimahi, Tanno Devi Prachodayat) 108 times at sunrise.',
      'Worship Lord Hayagriva or Goddess Saraswati on Thursdays and Wednesdays with yellow flowers and white sandalwood paste.',
      'Keep study desk facing East or North; maintain clutter-free study materials with proper natural lighting to shield eyesight.',
      'During exam seasons or vulnerable Dasha periods (Sade Sati, Rahu dasha), offer Durva grass to Lord Ganesha on Wednesdays.',
      'Donate educational stationery, notebooks, and pens to deserving underprivileged students on Guru Purnima or Thursdays.',
    ],
    detailsHi: [
      'प्रातःकाल सूर्योदय के समय सरस्वती गायत्री मंत्र (ॐ सरस्वत्यै विद्महे ब्रह्मपुत्र्यै धीमहि, तन्नो देवी प्रचोदयात्) का १०८ बार जप करें।',
      'बुधवार व गुरुवार को माता सरस्वती अथवा भगवान हयग्रीव की पीले पुष्प व श्वेत चंदन से विधिवत अर्चना करें।',
      'अध्ययन की मेज पूर्व अथवा उत्तर दिशा की ओर रखें; अध्ययन कक्ष को स्वच्छ व सुव्यवस्थित रखकर नेत्रों की सुरक्षा करें।',
      'परीक्षा काल अथवा राहु/साढ़ेसाती के समय बुधवार को भगवान श्रीगणेश को २१ दूर्वा दल अर्पित कर मोदक का भोग लगाएं।',
      'गुरु पूर्णिमा अथवा गुरुवार को निर्धन मेधावी विद्यार्थियों को पुस्तकें, कापियां व लेखन सामग्री दान करें।',
    ],
  };

  return {
    overallEducationScore: finalScore,
    overallVerdictEn,
    overallVerdictHi,
    coreHouses,
    breakFactors,
    triggeredBreakCount,
    breakRiskLevel,
    breakRiskLevelHi,
    breakRiskSummaryEn,
    breakRiskSummaryHi,
    activeYogas,
    allYogas,
    talents,
    planetaryStreams,
    moonPsychology,
    timelineWindows,
    classicalUpayas,
  };
}
