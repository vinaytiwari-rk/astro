/**
 * Sambhavit Falkathan (Probable Life Predictions) Engine
 * Division 12: Holistic Synthesis across All Divisional Charts (D1, D9, D3, D7, D10, D12, D24, D30, D60)
 *
 * Provides point-wise, concrete predictions:
 * 1. Naam Akshar (Birth name syllables)
 * 2. Ishta Devata (Karakamsa & Atmakaraka)
 * 3. Mukhya Graha (Main Life Controller Planet)
 * 4. Father: Temperament, Profession, Lifespan, Relationship
 * 5. Mother: Temperament, Profession, Lifespan, Relationship
 * 6. Siblings: Count of brothers & sisters, Birth order (Eldest / Youngest / Middle / Only Child)
 * 7. Marriage & Spouse: Timing window, 1 or 2 marriages / Delayed / Denial, Spouse nature, Age difference, Relationship
 * 8. Children / Progeny: Natural vs Scientific/IVF, Boys vs Girls count, Miscarriage risk, Filial joy
 * 9. Education: Highest attainment (High School, 12th, Graduate, Master's, Doctorate), Suitable academic subjects
 * 10. Profession & Career: Business vs Job, Govt vs Private, Suitable professions, Foreign travel & Foreign settlement
 * 11. Longevity: Alpayu / Madhyayu / Deerghayu
 * 12. Bandhana Yoga (Incarceration / Imprisonment risk)
 * 13. Surgery Yoga (Shastraghata / Operation risks & vulnerable organs)
 * 14. Physical Marks: Distinctive moles, scars, birthmarks on face, neck, chest, limbs
 * 15. Addictions & Vices: Alcohol, smoking, gambling, screen/digital addiction
 * 16. Bed Pleasure & Sexuality: 12th house & Venus intimate harmony and drive
 * 17. Friends & Social Circle: Loyal vs deceitful friends
 * 18. Cautions & Hazards: Specific elements, situations or traps to avoid
 * 19. Crisis Strategy: Emergency Vedic anchor mantra, deity and remedy
 * 20. Sports & Fitness: Favorite athletic, martial, outdoor or indoor sports
 * 21. Core Temperament: Innate nature, anger, wisdom, patience
 * 22. Love Life & Romance: Feasibility, love marriage vs arranged, heartbreak risks
 * 23. Psychological Health: Depression, anxiety, insomnia risks vs mental poise
 * 24. General Health: Tridosha balance (Vata, Pitta, Kapha), chronic tendencies
 * 25. Wealth vs Daridrya: Dhana Yogas vs Debt/Poverty Yogas and financial peak timeline
 */

import type { ChartData, NineGrahaId } from '../types';
import { SIGNS, SEVEN_PLANETS } from '../constants';
import { getNakshatraSyllable, getAllNakshatraSyllables } from '../avakahadaChalit';
import { computeLifeEventsAndLedger } from './lifeEventsLedger';
import {
  computePhysicalAppearance,
  computeEducationAcademics,
  computeCareerVerdicts,
  computeRelationalMatrix,
  computeAddictionsAndShadow,
  computeLitigationAndAffairs,
} from './lifeDossierHelpers';

export interface SambhavitFalkathanReport {
  // 1. Naam Akshar
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

  // 2. Ishta Devata
  ishtaDevata: {
    nameEn: string;
    nameHi: string;
    basisEn: string;
    basisHi: string;
    mantra: string;
  };

  // 3. Mukhya Graha
  mukhyaGraha: {
    planetEn: string;
    planetHi: string;
    roleEn: string;
    roleHi: string;
    rationaleEn: string;
    rationaleHi: string;
  };

  // 4. Father
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

  // 5. Mother
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

  // 6. Siblings
  siblings: {
    countProjectionEn: string;
    countProjectionHi: string;
    birthOrderEn: string;
    birthOrderHi: string;
    harmonyEn: string;
    harmonyHi: string;
  };

  // 7. Marriage & Spouse
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

  // 8. Children
  children: {
    conceptionModeEn: string;
    conceptionModeHi: string;
    progenyCountEn: string;
    progenyCountHi: string;
    miscarriageRiskEn: string;
    miscarriageRiskHi: string;
    filialHappinessEn: string;
    filialHappinessHi: string;
  };

  // 9. Education
  education: {
    attainmentLevelEn: string;
    attainmentLevelHi: string;
    suitableStreamsEn: string[];
    suitableStreamsHi: string[];
    academicSuccessEn: string;
    academicSuccessHi: string;
  };

  // 10. Career & Profession
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

  // 11. Longevity
  longevity: {
    categoryEn: string;
    categoryHi: string;
    rangeEn: string;
    rangeHi: string;
    keyFactorsEn: string;
    keyFactorsHi: string;
  };

  // 12. Bandhana Yoga
  bandhanaYoga: {
    hasRisk: boolean;
    verdictEn: string;
    verdictHi: string;
    mitigationEn: string;
    mitigationHi: string;
  };

  // 13. Surgery Yoga
  surgeryYoga: {
    hasRisk: boolean;
    riskLevelEn: string;
    riskLevelHi: string;
    vulnerableAreasEn: string;
    vulnerableAreasHi: string;
    timingEn: string;
    timingHi: string;
  };

  // 14. Physical Marks
  physicalMarks: {
    identificationEn: string;
    identificationHi: string;
    locationsEn: string[];
    locationsHi: string[];
  };

  // 15. Addictions & Vices
  addictions: {
    vulnerabilitiesEn: string[];
    vulnerabilitiesHi: string[];
    adviceEn: string;
    adviceHi: string;
  };

  // 16. Bed Pleasure & Sexuality
  bedPleasure: {
    shayanaSukhaEn: string;
    shayanaSukhaHi: string;
    sexualityEn: string;
    sexualityHi: string;
  };

  // 17. Friends
  friends: {
    natureEn: string;
    natureHi: string;
    loyaltyVerdictEn: string;
    loyaltyVerdictHi: string;
  };

  // 18. Cautions & Hazards
  cautions: {
    hazardsEn: string[];
    hazardsHi: string[];
    warningNoteEn: string;
    warningNoteHi: string;
  };

  // 19. Crisis Strategy
  crisisStrategy: {
    primaryDeityEn: string;
    primaryDeityHi: string;
    rescueMantra: string;
    actionProtocolEn: string;
    actionProtocolHi: string;
  };

  // 20. Sports & Fitness
  sports: {
    preferencesEn: string[];
    preferencesHi: string[];
    fitnessStyleEn: string;
    fitnessStyleHi: string;
  };

  // 21. Core Temperament
  temperament: {
    traitSummaryEn: string;
    traitSummaryHi: string;
    gunaEn: string;
    gunaHi: string;
  };

  // 22. Love Life
  loveLife: {
    romanceEn: string;
    romanceHi: string;
    marriageTypeEn: string;
    marriageTypeHi: string;
  };

  // 23. Psychological Health
  mentalHealth: {
    conditionEn: string;
    conditionHi: string;
    vulnerabilitiesEn: string;
    vulnerabilitiesHi: string;
    remedyEn: string;
    remedyHi: string;
  };

  // 24. General Health
  health: {
    constitutionEn: string;
    constitutionHi: string;
    vulnerableOrgansEn: string;
    vulnerableOrgansHi: string;
  };

  // 25. Wealth vs Daridrya
  wealth: {
    statusEn: string;
    statusHi: string;
    activeYogasEn: string[];
    activeYogasHi: string[];
    peakAgeWindowEn: string;
    peakAgeWindowHi: string;
  };
}

export function computeSambhavitFalkathan(chart: ChartData): SambhavitFalkathanReport {
  const asc = chart.ascendant;
  const ascSign = asc.signIndex;
  const ascLord = SIGNS[ascSign].lord;
  const moon = chart.planets.find((p) => p.id === 'Moon') || chart.planets[0];
  const sun = chart.planets.find((p) => p.id === 'Sun') || chart.planets[0];
  const mars = chart.planets.find((p) => p.id === 'Mars') || chart.planets[0];
  const mercury = chart.planets.find((p) => p.id === 'Mercury') || chart.planets[0];
  const jupiter = chart.planets.find((p) => p.id === 'Jupiter') || chart.planets[0];
  const venus = chart.planets.find((p) => p.id === 'Venus') || chart.planets[0];
  const saturn = chart.planets.find((p) => p.id === 'Saturn') || chart.planets[0];
  const rahu = chart.planets.find((p) => p.id === 'Rahu');
  const ketu = chart.planets.find((p) => p.id === 'Ketu');

  // Compute sub-engines
  const ledger = computeLifeEventsAndLedger(chart);
  const physical = computePhysicalAppearance(chart);
  const educationRes = computeEducationAcademics(chart);
  const careerRes = computeCareerVerdicts(chart);
  const relationRes = computeRelationalMatrix(chart);
  const shadowRes = computeAddictionsAndShadow(chart);
  const litigationRes = computeLitigationAndAffairs(chart);

  // 1. Naam Akshar
  const nakIdx = moon.nakshatraIndex ?? Math.floor(moon.longitude / (360 / 27));
  const pada = moon.pada || 1;
  const syl = getNakshatraSyllable(nakIdx, pada);
  const allSyl = getAllNakshatraSyllables(nakIdx);

  // 2. Ishta Devata (from Atmakaraka & 12th from Karakamsa)
  const ishta = ledger.deityAndMainPlanet;

  // 3. Mukhya Graha
  const mukhya = ledger.deityAndMainPlanet;

  // 4. Father & 5. Mother from Relational Entities
  const fatherEnt = relationRes.allEntities.find((e) => e.id === 'father');
  const motherEnt = relationRes.allEntities.find((e) => e.id === 'mother');
  const siblingsEnt = relationRes.allEntities.find((e) => e.id === 'siblings');
  const spouseEnt = relationRes.allEntities.find((e) => e.id === 'spouse');
  const childrenEnt = relationRes.allEntities.find((e) => e.id === 'children');

  // 4. Father synthesis
  const h9Sign = (ascSign + 8) % 12;
  const h9Lord = SIGNS[h9Sign].lord;
  const sunDignity = sun.dignity || 'Neutral';
  const fatherNatureEn = sunDignity === 'Exalted' || sunDignity === 'Own Sign'
    ? 'Principled, respected, authoritative, self-made with strong societal reputation'
    : sunDignity === 'Debilitated'
    ? 'Struggling, burdened with responsibilities, complex temperament, prone to health friction'
    : 'Hardworking, pragmatic, family-oriented, disciplined with traditional moral outlook';
  const fatherNatureHi = sunDignity === 'Exalted' || sunDignity === 'Own Sign'
    ? 'सिद्धांतवादी, समाज में सम्मानित, स्वाभिमानी, आत्मविश्वासी व प्रभावशाली व्यक्तित्व'
    : sunDignity === 'Debilitated'
    ? 'संघर्षशील, जिम्मेदारियों से घिरे, संवेदनशील व स्वास्थ्य की दृष्टि से सतर्क रहने वाले'
    : 'परिश्रमी, व्यावहारिक, परिवार-वत्सल, अनुशासित व पारंपरिक संस्कारों वाले';

  const fatherProfessionEn = sun.houseNumber === 10 || sun.houseNumber === 9 || sun.houseNumber === 1
    ? 'Government service, administration, leadership, political or executive rank'
    : h9Lord === 'Mercury' || h9Lord === 'Venus'
    ? 'Commerce, business, finance, accounting, advisory or skilled trade'
    : h9Lord === 'Mars' || h9Lord === 'Saturn'
    ? 'Technical, engineering, construction, land, agriculture, or defense service'
    : 'Education, consulting, public service or independent enterprise';
  const fatherProfessionHi = sun.houseNumber === 10 || sun.houseNumber === 9 || sun.houseNumber === 1
    ? 'सरकारी सेवा, प्रशासनिक पद, नेतृत्व, प्रबंधकीय या राजकीय सेवा'
    : h9Lord === 'Mercury' || h9Lord === 'Venus'
    ? 'व्यापार, वाणिज्य, वित्त, लेखा, परामर्श अथवा कला-कौशल'
    : h9Lord === 'Mars' || h9Lord === 'Saturn'
    ? 'तकनीकी, इंजीनियरिंग, भूमि, निर्माण, कृषि अथवा रक्षा/सुरक्षा सेवा'
    : 'शिक्षा, परामर्श, सार्वजनिक सेवा अथवा स्वतंत्र उद्यम';

  const fatherLifespanEn = sunDignity === 'Exalted' || sun.houseNumber === 9 || sun.houseNumber === 10
    ? 'Long lifespan (75+ years), respected in elderly years'
    : sunDignity === 'Debilitated' || sun.houseNumber === 6 || sun.houseNumber === 8
    ? 'Medium lifespan (60-72 years) with vulnerability to heart/bones or BP'
    : 'Healthy medium-to-long lifespan (68-78 years)';
  const fatherLifespanHi = sunDignity === 'Exalted' || sun.houseNumber === 9 || sun.houseNumber === 10
    ? 'दीर्घायु (75+ वर्ष), वृद्धावस्था में समाज में पूजनीय व सम्मानित'
    : sunDignity === 'Debilitated' || sun.houseNumber === 6 || sun.houseNumber === 8
    ? 'मध्यायु (60-72 वर्ष), हृदय, नेत्र अथवा अस्थि विकार से सतर्कता आवश्यक'
    : 'समान्यतः उत्तम स्वास्थ्य व दीर्घायु (68-78 वर्ष)';

  const fatherRelEn = fatherEnt?.bondStatusEn || 'Cordial, respectful with generational ideological differences';
  const fatherRelHi = fatherEnt?.bondStatusHi || 'सम्मानजनक, पिता का आदर, यद्यपि विचारों में कभी-कभी भिन्नता';

  // 5. Mother synthesis
  const h4Sign = (ascSign + 3) % 12;
  const h4Lord = SIGNS[h4Sign].lord;
  const moonDignity = moon.dignity || 'Neutral';
  const motherNatureEn = moonDignity === 'Exalted' || moonDignity === 'Own Sign'
    ? 'Deeply compassionate, nurturing, emotionally grounding, religious and patient'
    : moonDignity === 'Debilitated'
    ? 'Highly emotional, prone to worry and mood fluctuations, sacrifices self for household'
    : 'Affectionate, resilient, domestic anchor with strong moral guidance';
  const motherNatureHi = moonDignity === 'Exalted' || moonDignity === 'Own Sign'
    ? 'अत्यंत ममतामयी, धार्मिक, सहनशील, मानसिक संबल देने वाली व सात्विक'
    : moonDignity === 'Debilitated'
    ? 'अत्यधिक भावुक, निरंतर चिंता करने वाली, त्यागशील परंतु मानसिक उतार-चढ़ाव युक्त'
    : 'स्नेहमयी, कर्तव्यनिष्ठ, पारिवारिक संतुलन बनाए रखने वाली व धैर्यवान';

  const motherProfessionEn = h4Lord === 'Sun' || h4Lord === 'Jupiter'
    ? 'Teaching, academic leadership, social work, spiritual guidance or government sector'
    : h4Lord === 'Venus' || h4Lord === 'Moon'
    ? 'Homemaker / domestic administrator, culinary, creative arts, nursing or hospitality'
    : 'Active household leadership, commerce, independent professional or social figure';
  const motherProfessionHi = h4Lord === 'Sun' || h4Lord === 'Jupiter'
    ? 'शिक्षण, अध्यापन, सामाजिक सेवा, आध्यात्मिक कार्य अथवा राजकीय सेवा'
    : h4Lord === 'Venus' || h4Lord === 'Moon'
    ? 'गृहिणी व गृह-प्रशासक, रचनात्मक कला, चिकित्सा/नर्सिंग अथवा परिचर्या'
    : 'पारिवारिक केंद्रबिंदु, स्वतंत्र व्यवसाय अथवा सामाजिक क्षेत्र में सक्रिय';

  const motherLifespanEn = moonDignity === 'Exalted' || moon.houseNumber === 4
    ? 'Long and peaceful lifespan (78+ years)'
    : moonDignity === 'Debilitated' || moon.houseNumber === 6 || moon.houseNumber === 8
    ? 'Medium lifespan (62-72 years) with susceptibility to fluid balance or stress'
    : 'Standard healthy lifespan (70-80 years)';
  const motherLifespanHi = moonDignity === 'Exalted' || moon.houseNumber === 4
    ? 'दीर्घायु (78+ वर्ष) व शांत, सम्मानजनक जीवनकाल'
    : moonDignity === 'Debilitated' || moon.houseNumber === 6 || moon.houseNumber === 8
    ? 'मध्यायु (62-72 वर्ष), कफ, जल तत्व अथवा मानसिक तनाव से सावधानी आवश्यक'
    : 'सामान्य रूप से सुदीर्घ जीवनकाल (70-80 वर्ष)';

  const motherRelEn = motherEnt?.bondStatusEn || 'Deep emotional bond, mother is the psychological anchor of life';
  const motherRelHi = motherEnt?.bondStatusHi || 'अत्यंत गहरा व भावनात्मक संबंध, माता जीवन की सच्ची प्रेरणा व संबल';

  // 6. Siblings & Birth Order
  const h3Sign = (ascSign + 2) % 12;
  const h3Lord = SIGNS[h3Sign].lord;
  const h11Sign = (ascSign + 10) % 12;
  const h11Lord = SIGNS[h11Sign].lord;
  const marsHouse = mars.houseNumber;
  const isOnlyChild = (mars.dignity === 'Debilitated' || marsHouse === 8) && (chart.planets.filter((p) => p.houseNumber === 3).length === 0);
  const birthOrderEn = isOnlyChild
    ? 'Only Child / Singular Responsibility (इकलौती संतान)'
    : h11Lord === 'Saturn' || h11Lord === 'Sun' || chart.planets.some((p) => p.houseNumber === 11 && (p.id === 'Saturn' || p.id === 'Rahu'))
    ? 'Eldest / Primary Decision Maker (ज्येष्ठ - सबसे बड़े)'
    : chart.planets.some((p) => p.houseNumber === 3 && (p.id === 'Saturn' || p.id === 'Mars'))
    ? 'Youngest among siblings (कनिष्ठ - सबसे छोटे)'
    : 'Middle / Balanced birth position (मध्यम)';
  const birthOrderHi = isOnlyChild
    ? 'इकलौती संतान (माता-पिता का पूर्ण उत्तरदायित्व)'
    : birthOrderEn.includes('Eldest')
    ? 'परिवार में बड़े भाई/बहन (ज्येष्ठ - मुख्य उत्तरदायित्व निभाने वाले)'
    : birthOrderEn.includes('Youngest')
    ? 'परिवार में छोटे भाई/बहन (कनिष्ठ - सबका स्नेह पाने वाले)'
    : 'मध्यम संतान (भाई-बहनों के बीच समन्वयकर्ता)';

  const siblingCountEn = isOnlyChild
    ? 'Singular native (0 siblings or raised essentially alone)'
    : '2 to 3 siblings indicated (Mix of brother and sister based on 3rd & 11th bhavas)';
  const siblingCountHi = isOnlyChild
    ? 'कोई अन्य सहोदर नहीं अथवा इकलौता पालन-पोषण'
    : '2 से 3 भाई-बहनों का योग (तृतीय व एकादश भाव के अनुसार भाई व बहन दोनों की संभावना)';

  // 7. Marriage & Spouse
  const h7Sign = (ascSign + 6) % 12;
  const h7Lord = SIGNS[h7Sign].lord;
  const saturnAspects7 = saturn.houseNumber === 1 || saturn.houseNumber === 5 || saturn.houseNumber === 7 || saturn.houseNumber === 10;
  const marsIn7 = mars.houseNumber === 7;
  const timingWindowEn = saturnAspects7
    ? 'Delayed marriage: 28 to 33 years of age (maturity brings marital stability)'
    : venus.houseNumber === 1 || venus.houseNumber === 4 || jupiter.houseNumber === 7
    ? 'Early-to-ideal timing: 23 to 27 years of age'
    : 'Normal auspicious window: 25 to 29 years of age';
  const timingWindowHi = saturnAspects7
    ? 'विलंब से विवाह का योग: 28 से 33 वर्ष की आयु में (परिपक्वता से दांपत्य स्थिरता)'
    : venus.houseNumber === 1 || venus.houseNumber === 4 || jupiter.houseNumber === 7
    ? 'आदर्श व समय पर विवाह: 23 से 27 वर्ष की आयु में'
    : 'सामान्य शुभ विवाह काल: 25 से 29 वर्ष की आयु में';

  const dual7 = h7Sign === 2 || h7Sign === 5 || h7Sign === 8 || h7Sign === 11;
  const marriageCountEn = (dual7 && (rahu?.houseNumber === 7 || marsIn7))
    ? 'Strong yogas for dual relationship phases / deep second attachment; strict match-making required'
    : 'Single stable marriage; committed lifelong companion';
  const marriageCountHi = (dual7 && (rahu?.houseNumber === 7 || marsIn7))
    ? 'द्वि-संबंध अथवा दांपत्य में दो चरणों के योग; कुंडली मिलान अत्यंत अनिवार्य'
    : 'एकल व स्थायी विवाह; जीवनपर्यंत साथ निभाने वाला निष्ठावान साथी';

  const spouseNatureEn = spouseEnt?.narrativeEn || 'Intelligent, cultured, graceful, firm-minded with independent dignity';
  const spouseNatureHi = spouseEnt?.narrativeHi || 'बुद्धिमान, संस्कारी, स्वाभिमानी, सुरुचिपूर्ण एवं स्वतंत्र विचारों वाले';

  const spouseAgeGapEn = saturnAspects7 ? 'Spouse will be of similar age or 3-5 years gap with mature mindset' : 'Spouse age difference: 1 to 3 years; harmonious compatibility';
  const spouseAgeGapHi = saturnAspects7 ? 'जीवनसाथी लगभग समवयस्क अथवा 3 से 5 वर्ष का अंतर; गंभीर व परिपक्व स्वभाव' : 'जीवनसाथी से 1 से 3 वर्ष का अंतर; सुखद सामंजस्य';

  const spouseRelEn = (marsIn7 || rahu?.houseNumber === 7)
    ? 'Passionate but prone to sharp temper and occasional misunderstandings; calm dialogue needed'
    : 'Loving, mutually supportive, cooperative with strong shared values';
  const spouseRelHi = (marsIn7 || rahu?.houseNumber === 7)
    ? 'स्नेहपूर्ण किंतु क्रोध व तात्कालिक मतभेद की संभावना; शांत संवाद से दांपत्य फलेगा'
    : 'प्रेमपूर्ण, परस्पर सहयोगी, एक-दूसरे का सम्मान करने वाले व सुखद गृहस्थी';

  // 8. Children
  const h5Sign = (ascSign + 4) % 12;
  const h5Lord = SIGNS[h5Sign].lord;
  const rahuIn5 = rahu?.houseNumber === 5;
  const ketuIn5 = ketu?.houseNumber === 5;
  const marsIn5 = mars.houseNumber === 5;
  const jupiterIn5 = jupiter.houseNumber === 5;

  const conceptionModeEn = (rahuIn5 || ketuIn5 || (marsIn5 && saturn.houseNumber === 11))
    ? 'Scientific medical intervention / timing assistance (IVF, fertility support or planned clinical care)'
    : 'Smooth natural conception (प्राकृतिक गर्भधारण योग)';
  const conceptionModeHi = (rahuIn5 || ketuIn5 || (marsIn5 && saturn.houseNumber === 11))
    ? 'चिकित्सीय व वैज्ञानिक परामर्श / तकनीक (IVF, औषधीय सहयोग व सुनियोजित गर्भाधान)'
    : 'सहज व प्राकृतिक गर्भाधान (Natural Conception)';

  const progenyCountEn = (jupiterIn5 || h5Lord === 'Jupiter' || h5Lord === 'Moon')
    ? '2 to 3 children: Probability of 1 boy and 1 girl (balanced lineage)'
    : '1 to 2 children: First child brings immense fortune and family progress';
  const progenyCountHi = (jupiterIn5 || h5Lord === 'Jupiter' || h5Lord === 'Moon')
    ? '2 से 3 संतान का योग: पुत्र व पुत्री दोनों का सुखद संतुलन'
    : '1 से 2 संतान का योग: प्रथम संतान के जन्म के पश्चात भाग्योदय';

  const miscarriageRiskEn = (rahuIn5 || marsIn5 || ketuIn5)
    ? 'Moderate risk of early conception hurdle or first pregnancy complication; Santan Gopal stotram advised'
    : 'Low miscarriage risk; safe gestational cycles with standard maternal care';
  const miscarriageRiskHi = (rahuIn5 || marsIn5 || ketuIn5)
    ? 'प्रथम गर्भधारण में रुकावट अथवा मिसकैरेज का मध्यम जोखिम; संतान गोपाल मंत्र व चिकित्सकीय देखरेख आवश्यक'
    : 'न्यूनतम जोखिम; सुरक्षित व सामान्य गर्भावस्था काल';

  const filialJoyEn = childrenEnt?.bondStatusEn || 'Children will achieve high educational/professional success and honor parents';
  const filialJoyHi = childrenEnt?.bondStatusHi || 'संतान आज्ञाकारी, उच्च विद्या प्राप्त करने वाली व माता-पिता का नाम रोशन करने वाली होगी';

  // 9. Education
  const attainmentEn = educationRes.data.schoolYearsEn.includes('Doctorate') || educationRes.data.schoolYearsEn.includes('Master')
    ? 'Master Degree / Higher Specialization / Postgraduate & Research'
    : educationRes.data.schoolYearsEn.includes('Graduation')
    ? 'College Graduate / Professional Degree (B.Tech, B.Com, B.Sc, MBBS, LLB)'
    : 'High School & 12th completed with subsequent vocational expertise';
  const attainmentHi = attainmentEn.includes('Master')
    ? 'स्नातकोत्तर (Master Degree) / उच्च अनुसंधान व विशिष्ट शोध उपाधि'
    : attainmentEn.includes('Graduate')
    ? 'स्नातक (College Graduate) / व्यावसायिक डिग्री (इंजीनियरिंग, वाणिज्य, विधि अथवा चिकित्सा)'
    : 'हायर सेकेंडरी (12वीं) व तत्पश्चात व्यावहारिक/तकनीकी कार्यक्षेत्र में प्रवेश';

  // 10. Career, Job vs Business, Govt vs Private
  const careerData = careerRes.data;
  const foreignTravelEn = (rahu?.houseNumber === 9 || rahu?.houseNumber === 12 || h9Lord === 'Moon' || h9Lord === 'Venus')
    ? 'Strong foreign travel yoga: Frequent air travels, cross-border business or international assignments'
    : 'Moderate regional travels; domestic relocation with select overseas visits';
  const foreignTravelHi = foreignTravelEn.includes('Strong')
    ? 'प्रबल विदेश यात्रा योग: वायु यात्राएं, अंतरराष्ट्रीय संपर्क अथवा बहुराष्ट्रीय कंपनी में अवसर'
    : 'देशाटन व प्रादेशिक भ्रमण; कार्यवश सीमित विदेश यात्रा के योग';

  const foreignSettlementEn = (chart.planets.some((p) => p.houseNumber === 12 && (p.id === 'Rahu' || p.id === 'Saturn')) || (ascSign % 3 === 0))
    ? 'Permanent or long-term overseas settlement yoga (विदेश में स्थायी निवास अथवा ग्रीन कार्ड / पीआर योग)'
    : 'Foreign visits and assignments likely, but roots and properties remain firmly in the homeland';
  const foreignSettlementHi = foreignSettlementEn.includes('Permanent')
    ? 'विदेश में दीर्घकालिक अथवा स्थायी निवास (PR / Green Card) का सुदृढ़ योग'
    : 'कार्यवश विदेश वास संभव, किंतु अंततः स्वदेश व मातृभूमि में ही स्थायी वास व संपत्ति';

  // 11. Longevity
  const longCatEn = ledger.longevity.categoryEn || 'Deerghayu (Long Life: 75–88+ Years)';
  const longCatHi = ledger.longevity.categoryHi || 'दीर्घायु (दीर्घ जीवन: 75 से 88+ वर्ष)';
  const longRangeEn = '72 to 85+ years of active vital lifespan';
  const longRangeHi = '72 से 85+ वर्ष का सक्रिय एवं सुदीर्घ जीवनकाल';

  // 12. Bandhana Yoga (Imprisonment)
  const bandhanaData = litigationRes.data;
  const hasBandhana = bandhanaData.bandhanaYogaEn.includes('Strong') || bandhanaData.bandhanaYogaEn.includes('Present');

  // 13. Surgery Yoga
  const hasSurgery = (mars.houseNumber === 6 || mars.houseNumber === 8 || ketu?.houseNumber === 6 || ketu?.houseNumber === 8);
  const surgeryRiskEn = hasSurgery ? 'Moderate-to-High: Surgical incision or minor operative intervention indicated' : 'Low: Natural bodily healing dominates with minimal surgery risk';
  const surgeryRiskHi = hasSurgery ? 'मध्यम से उच्च: शल्य चिकित्सा (सर्जरी/टांके) अथवा आपरेशन का योग' : 'न्यूनतम: सामान्य औषधीय उपचार से स्वास्थ्य लाभ, गंभीर सर्जरी का योग नहीं';

  const vulnOrgansEn = (mars.houseNumber === 6 || ascSign === 0)
    ? 'Head, teeth, abdominal area or appendix'
    : (mars.houseNumber === 8 || ascSign === 7)
    ? 'Lower back, spine, pelvic area or excretory organs'
    : 'Digestive system, throat or knee joints';
  const vulnOrgansHi = vulnOrgansEn.includes('Head')
    ? 'मस्तक, दांत, उदर अथवा अपेंडिक्स'
    : vulnOrgansEn.includes('Lower')
    ? 'कमर, रीढ़ की हड्डी, गुदा अथवा जननेंद्रिय'
    : 'पाचन तंत्र, गला अथवा घुटने';

  // 14. Physical Marks
  const marksData = physical.data;
  const marksListEn = [
    `Distinctive birthmark or mole on ${marksData.faceEyesHairEn.includes('Eye') ? 'temple or forehead' : 'neck or cheek'}`,
    `Noticeable childhood scar or cut mark on ${marksData.buildFrameEn.includes('Broad') ? 'shoulder or arm' : 'knee or leg'}`,
  ];
  const marksListHi = [
    `चेहरे, ललाट अथवा गले पर विशिष्ट तिल या मस्से का चिन्ह`,
    `बचपन की चोट का कट अथवा निशान हाथ, कंधे अथवा पैर पर`,
  ];

  // 15. Addictions
  const shadowData = shadowRes.data;

  // 16. Bed Pleasure & Sexuality
  const h12Sign = (ascSign + 11) % 12;
  const h12Lord = SIGNS[h12Sign].lord;
  const bedSukhaEn = (venus.houseNumber === 12 || h12Lord === 'Venus' || jupiter.houseNumber === 12)
    ? 'High: Abundant bedroom comforts, luxurious sleeping environment, and satisfying intimate bonding'
    : (saturn.houseNumber === 12 || rahu?.houseNumber === 12)
    ? 'Mixed: Sleep disruptions, overactive thoughts at night, intermittent intimate dissatisfaction'
    : 'Balanced: Moderate and harmonious conjugal intimacy and restful slumber';
  const bedSukhaHi = bedSukhaEn.includes('High')
    ? 'उत्तम: विलासितापूर्ण शयन सुख, सुखद अंतरंगता एवं सुखी दांपत्य शय्या सुख'
    : bedSukhaEn.includes('Mixed')
    ? 'मिश्रित: अनिद्रा, रात्रि में अत्यधिक विचारशीलता एवं अंतरंग जीवन में कभी-कभी असंतोष'
    : 'संतुलित: सामान्य व सुखद दांपत्य सुख एवं शांतिपूर्ण निद्रा';

  const sexualityEn = (mars.houseNumber === 1 || mars.houseNumber === 7 || mars.houseNumber === 12 || venus.houseNumber === 8)
    ? 'High physical drive, intense passion, requires deep emotional reciprocity'
    : 'Refined, aesthetic, emotionally oriented intimacy with gentle temperament';
  const sexualityHi = sexualityEn.includes('High')
    ? 'तीव्र कामुकता, ऊर्जावान प्रवृत्ति, शारीरिक व भावनात्मक समर्पण की अपेक्षा'
    : 'सौम्य, सुरुचिपूर्ण, मर्यादापूर्ण एवं भावनात्मक स्तर पर केंद्रित काम-प्रवृत्ति';

  // 17. Friends
  const h11Planets = chart.planets.filter((p) => p.houseNumber === 11);
  const friendsNatureEn = h11Planets.some((p) => p.id === 'Rahu' || p.id === 'Saturn')
    ? 'Mixed circle: Prone to fair-weather companions, opportunistic acquaintances; few loyal gems emerge only after testing'
    : 'Supportive, intellectually stimulating, trustworthy friends from good social standings';
  const friendsNatureHi = friendsNatureEn.includes('Mixed')
    ? 'मिश्रित मित्र मंडली: स्वार्थी व अवसरवादी मित्रों से सतर्क रहें; सच्चे मित्र कम परंतु कठिन समय में ही पहचान होगी'
    : 'सच्चे, बुद्धिमान व संकट में साथ निभाने वाले श्रेष्ठ मित्रों का सहयोग';

  // 18. Cautions & Hazards
  const hazardsListEn = [
    'Avoid risky partnerships without legally registered written contracts (Rahu/Saturn warning)',
    'Beware of rash driving or high-speed two-wheelers during Mars/Ketu sub-periods',
    'Stay cautious around water bodies, deep swimming pools, and unverified herbal supplements',
    'Do not lend cash on verbal guarantees to acquaintances or relatives',
  ];
  const hazardsListHi = [
    'बिना लिखित कानूनी अनुबंध के किसी के साथ साझेदारी में व्यापार न करें',
    'मंगल-केतु के अंतर में तेज गति से वाहन चलाने व जल्दबाजी से बचें',
    'अज्ञात जल स्रोतों, गहरे पानी व अनजानी दवाओं के अंधाधुंध सेवन से सतर्क रहें',
    'रिश्तेदारों या परिचितों को मौखिक आश्वासन पर बड़ी नकद धनराशि उधार न दें',
  ];

  // 19. Crisis Strategy
  const crisisDeityEn = ishta.ishtaDevataEn || 'Lord Shiva & Hanuman Ji';
  const crisisDeityHi = ishta.ishtaDevataHi || 'भगवान शिव एवं श्री हनुमान जी';
  const rescueMantra = 'ॐ नमः शिवाय (Om Namah Shivaya) & महामृत्युंजय मंत्र';

  // 20. Sports & Fitness
  const sportsListEn = (mars.houseNumber === 1 || mars.houseNumber === 3 || mars.houseNumber === 10)
    ? ['Cricket, Football or Field Athletics', 'Martial Arts, Boxing or Gym / Weight Training', 'Running and Swimming']
    : ['Badminton, Table Tennis or Tennis', 'Chess, Strategic Mind Sports and Esports', 'Yoga, Pranayama and Morning Walking'];
  const sportsListHi = sportsListEn[0].includes('Cricket')
    ? ['क्रिकेट, फुटबॉल अथवा मैदानी खेल', 'जिम, वेट ट्रेनिंग, कुश्ती अथवा मार्शल आर्ट', 'दौड़ व तैराकी']
    : ['बैडमिंटन, टेबल टेनिस अथवा लॉन टेनिस', 'शतरंज, दिमागी खेल व ई-स्पोर्ट्स', 'योग, प्राणायाम व दैनिक प्रातः भ्रमण'];

  // 21. Core Temperament
  const elem = SIGNS[ascSign].element;
  const tempEn = elem === 'Fire'
    ? 'Dynamic, courageous, frank, quick-tempered but quickly forgiving, natural born leader'
    : elem === 'Earth'
    ? 'Practical, patient, dependable, persevering, materially grounded and cautious'
    : elem === 'Air'
    ? 'Intellectual, communicative, curious, adaptable, social and conceptual thinker'
    : 'Empathetic, intuitive, deeply caring, emotionally perceptive and sensitive';
  const tempHi = elem === 'Fire'
    ? 'ऊर्जावान, साहसी, स्पष्टवादी, शीघ्र क्रोधित होने वाले किंतु तुरंत शांत, स्वाभाविक नेतृत्वकर्ता'
    : elem === 'Earth'
    ? 'व्यावहारिक, धैर्यवान, भरोसेमंद, दृढ़निश्चयी, यथार्थवादी व सावधान'
    : elem === 'Air'
    ? 'बुद्धिजीवी, विचारवान, मिलनसार, जिज्ञासु, संवादप्रिय व नई सोच वाले'
    : 'भावुक, संवेदनशील, अंतर्ज्ञानी, दूसरों के प्रति दयालु व पारिवारिक';

  // 22. Love Life
  const loveLifeEn = (venus.houseNumber === 5 || venus.houseNumber === 7 || venus.houseNumber === 11)
    ? 'Vibrant romantic life with deep emotional attachments; high probability of love marriage or self-chosen partner'
    : (saturn.houseNumber === 5 || rahu?.houseNumber === 5)
    ? 'Complex romance: Initial heartbreak or family hesitation leading eventually to a stable mature alliance'
    : 'Traditional, structured romance blossoming primarily after marriage in an arranged alliance';
  const loveLifeHi = loveLifeEn.includes('Vibrant')
    ? 'रोमांचक प्रेम जीवन; प्रेम विवाह अथवा स्वयं की पसंद से विवाह का प्रबल योग'
    : loveLifeEn.includes('Complex')
    ? 'प्रेम में प्रारंभिक उतार-चढ़ाव या विरह; अंततः परिपक्वता से सुखी वैवाहिक बंधन'
    : 'पारंपरिक व मर्यादित प्रेम जो विवाह के उपरांत प्रगाढ़ होता है; अरेंज्ड विवाह की अधिक संभावना';

  // 23. Psychological Health
  const afflictedMoon = (moon.houseNumber === 6 || moon.houseNumber === 8 || moon.houseNumber === 12 || (rahu && Math.abs(moon.longitude - rahu.longitude) < 15));
  const mentalEn = afflictedMoon
    ? 'Prone to overthinking, episodic anxiety, sleeplessness and mood sensitivities; meditation and Moon water remedies essential'
    : 'Emotionally resilient, stable nerves, sound mental clarity and composed decision making';
  const mentalHi = afflictedMoon
    ? 'अत्यधिक चिंतन (Overthinking), चिंता (Anxiety) व अनिद्रा का जोखिम; प्राणायाम व ध्यान अत्यंत आवश्यक'
    : 'मानसिक रूप से सुदृढ़, शांत चित्त, संतुलित निर्णय क्षमता व संवेगात्मक स्थिरता';

  // 24. General Health & Tridosha
  const tridoshaEn = elem === 'Fire' ? 'Pitta dominant (Heat, acidity, skin inflammation)' : elem === 'Earth' ? 'Vata-Kapha mixed (Digestion, joints, metabolism)' : elem === 'Air' ? 'Vata dominant (Nerves, dryness, back tension)' : 'Kapha dominant (Colds, fluid retention, respiratory)';
  const tridoshaHi = elem === 'Fire' ? 'पित्त प्रधान (उष्णता, एसिडिटी, त्वचा व पित्त विकार)' : elem === 'Earth' ? 'वात-कफ मिश्रित (पाचन, जोड़, मेटाबॉलिज्म)' : elem === 'Air' ? 'वात प्रधान (स्नायु, वायु विकार, कमर दर्द)' : 'कफ प्रधान (जुकाम, कफ, श्वसन तंत्र)';

  // 25. Wealth vs Daridrya
  const h2Sign = (ascSign + 1) % 12;
  const h2Lord = SIGNS[h2Sign].lord;
  const dhanaYogas = chart.yogas?.filter((y) => y.category === 'Dhana' || y.name.toLowerCase().includes('dhana') || y.name.toLowerCase().includes('lakshmi')) || [];
  const hasStrongWealth = (dhanaYogas.length > 0 || (jupiter.houseNumber === 2 || jupiter.houseNumber === 11 || venus.houseNumber === 2 || venus.houseNumber === 11));

  const wealthStatusEn = hasStrongWealth
    ? 'Dominant Dhana Yoga: High accumulation of assets, property, vehicles and financial independence'
    : 'Moderate steady prosperity with disciplined saving; expenses must be checked to avoid loans';
  const wealthStatusHi = hasStrongWealth
    ? 'प्रबल धन योग: संपत्ति, भवन, वाहन एवं प्रचुर धन संचय का भाग्यशाली योग'
    : 'मध्यम व सतत धन लाभ; आय अच्छी रहेगी किंतु व्यय पर नियंत्रण रखना अनिवार्य है';

  return {
    namakshar: {
      primaryEn: syl.en,
      primaryHi: syl.hi,
      allPadasEn: allSyl.en,
      allPadasHi: allSyl.hi,
      nakshatraName: chart.panchang.nakshatra.name,
      pada,
      explanationEn: `Calculated from birth Moon in ${chart.panchang.nakshatra.name} Nakshatra, Pada ${pada}. Names beginning with '${syl.en}' or '${allSyl.en.join(', ')}' activate lifelong prosperity.`,
      explanationHi: `जन्म कालीन चंद्रमा ${chart.panchang.nakshatra.name} नक्षत्र के चरण ${pada} में स्थित है। '${syl.hi}' अथवा '${allSyl.hi.join(', ')}' अक्षर से नाम रखने पर भाग्योदय होता है।`,
    },
    ishtaDevata: {
      nameEn: ishta.ishtaDevataEn || 'Lord Vishnu / Shiva',
      nameHi: ishta.ishtaDevataHi || 'भगवान श्री विष्णु / शिव',
      basisEn: ishta.ishtaBasisEn || 'Derived from 12th house from Karakamsa (Atmakaraka) in Navamsha D-9',
      basisHi: ishta.ishtaBasisHi || 'नवांश (D-9) में आत्मकारक ग्रह के काराकांश से 12वें मोक्ष भाव के आधार पर',
      mantra: ishta.ishtaMantra || 'ॐ नमो भगवते वासुदेवाय',
    },
    mukhyaGraha: {
      planetEn: mukhya.mainPlanetEn || ascLord,
      planetHi: mukhya.mainPlanetHi || SIGNS[ascSign].lord,
      roleEn: 'Lagna Lord & Key Destiny Driver (जीवन स्वामी व रक्षा कवच)',
      roleHi: 'लग्नेश व जीवन का प्रधान नियंत्रक ग्रह',
      rationaleEn: `Ruling planetary energy that protects physical longevity, prestige and personal identity throughout life.`,
      rationaleHi: `यह ग्रह जातक के संपूर्ण जीवन का मुख्य आधार, आरोग्य, सम्मान व कीर्ति का संरक्षक है।`,
    },
    father: {
      temperamentEn: fatherNatureEn,
      temperamentHi: fatherNatureHi,
      professionEn: fatherProfessionEn,
      professionHi: fatherProfessionHi,
      lifespanEn: fatherLifespanEn,
      lifespanHi: fatherLifespanHi,
      relationshipEn: fatherRelEn,
      relationshipHi: fatherRelHi,
    },
    mother: {
      temperamentEn: motherNatureEn,
      temperamentHi: motherNatureHi,
      professionEn: motherProfessionEn,
      professionHi: motherProfessionHi,
      lifespanEn: motherLifespanEn,
      lifespanHi: motherLifespanHi,
      relationshipEn: motherRelEn,
      relationshipHi: motherRelHi,
    },
    siblings: {
      countProjectionEn: siblingCountEn,
      countProjectionHi: siblingCountHi,
      birthOrderEn: birthOrderEn,
      birthOrderHi: birthOrderHi,
      harmonyEn: siblingsEnt?.bondStatusEn || 'Generally cooperative with occasional property or ego differences',
      harmonyHi: siblingsEnt?.bondStatusHi || 'सामान्यतः सहयोगी, कभी-कभी वैचारिक अथवा संपत्ति को लेकर मतभेद',
    },
    marriage: {
      timingAgeWindowEn: timingWindowEn,
      timingAgeWindowHi: timingWindowHi,
      marriageYogasEn: marriageCountEn,
      marriageYogasHi: marriageCountHi,
      spouseNatureEn: spouseNatureEn,
      spouseNatureHi: spouseNatureHi,
      spouseAgeGapEn: spouseAgeGapEn,
      spouseAgeGapHi: spouseAgeGapHi,
      relationshipEn: spouseRelEn,
      relationshipHi: spouseRelHi,
    },
    children: {
      conceptionModeEn: conceptionModeEn,
      conceptionModeHi: conceptionModeHi,
      progenyCountEn: progenyCountEn,
      progenyCountHi: progenyCountHi,
      miscarriageRiskEn: miscarriageRiskEn,
      miscarriageRiskHi: miscarriageRiskHi,
      filialHappinessEn: filialJoyEn,
      filialHappinessHi: filialJoyHi,
    },
    education: {
      attainmentLevelEn: attainmentEn,
      attainmentLevelHi: attainmentHi,
      suitableStreamsEn: educationRes.data.collegeStreamsEn,
      suitableStreamsHi: educationRes.data.collegeStreamsHi,
      academicSuccessEn: educationRes.data.competitiveExamVerdictEn,
      academicSuccessHi: educationRes.data.competitiveExamVerdictHi,
    },
    career: {
      jobVsBusinessEn: careerData.govtJobVerdictEn.includes('Strong') ? 'Job / Professional Service Primary (व्यापार सहायक)' : 'Independent Business / Enterprise Primary (नौकरी अल्पकालिक)',
      jobVsBusinessHi: careerData.govtJobVerdictHi.includes('प्रबल') ? 'नौकरी / उच्च प्रशासनिक सेवा प्राथमिक (व्यापार द्वितीयक)' : 'स्वतंत्र व्यवसाय / उद्योग प्राथमिक (नौकरी अस्थायी)',
      govtVsPrivateEn: careerData.govtJobVerdictEn,
      govtVsPrivateHi: careerData.govtJobVerdictHi,
      suitableProfessionsEn: careerData.targetWingsEn,
      suitableProfessionsHi: careerData.targetWingsHi,
      foreignTravelEn,
      foreignTravelHi,
      foreignSettlementEn,
      foreignSettlementHi,
    },
    longevity: {
      categoryEn: longCatEn,
      categoryHi: longCatHi,
      rangeEn: longRangeEn,
      rangeHi: longRangeHi,
      keyFactorsEn: 'Protected by strong 8th house lord, Saturn placement and benefic aspects on Lagna.',
      keyFactorsHi: 'अष्टमेश, शनि की स्थिति तथा लग्न पर शुभ ग्रहों की दृष्टि द्वारा दीर्घायु सुरक्षित।',
    },
    bandhanaYoga: {
      hasRisk: hasBandhana,
      verdictEn: litigationRes.data.bandhanaYogaEn,
      verdictHi: litigationRes.data.bandhanaYogaHi,
      mitigationEn: 'Avoid illegal speculations, unverified guarantorship, and disputes during Rahu/Saturn transits.',
      mitigationHi: 'अवैध लेन-देन, फर्जी हस्ताक्षर व संदिग्ध कागजात से दूर रहें; शनिवार को छायादान करें।',
    },
    surgeryYoga: {
      hasRisk: hasSurgery,
      riskLevelEn: surgeryRiskEn,
      riskLevelHi: surgeryRiskHi,
      vulnerableAreasEn: vulnOrgansEn,
      vulnerableAreasHi: vulnOrgansHi,
      timingEn: 'During Mars Mahadasha / Ketu Antardasha or when transit Saturn squares natal Mars.',
      timingHi: 'मंगल की महादशा, केतु के अंतर अथवा शनि के मंगल पर गोचर के समय शल्य सावधानी अपेक्षित।',
    },
    physicalMarks: {
      identificationEn: marksListEn.join('; '),
      identificationHi: marksListHi.join('; '),
      locationsEn: marksListEn,
      locationsHi: marksListHi,
    },
    addictions: {
      vulnerabilitiesEn: shadowData.digitalVicesEn,
      vulnerabilitiesHi: shadowData.digitalVicesHi,
      adviceEn: shadowData.substanceRiskEn,
      adviceHi: shadowData.substanceRiskHi,
    },
    bedPleasure: {
      shayanaSukhaEn: bedSukhaEn,
      shayanaSukhaHi: bedSukhaHi,
      sexualityEn,
      sexualityHi,
    },
    friends: {
      natureEn: friendsNatureEn,
      natureHi: friendsNatureHi,
      loyaltyVerdictEn: friendsNatureEn.includes('Mixed') ? 'Do not trust blind financial loans to friends' : 'Friends will be pillars of strength in difficult phases',
      loyaltyVerdictHi: friendsNatureEn.includes('Mixed') ? 'मित्रों को अंधाधुंध धन उधार न दें' : 'सच्चे मित्र जीवन की कठिन घड़ी में संबल बनेंगे',
    },
    cautions: {
      hazardsEn: hazardsListEn,
      hazardsHi: hazardsListHi,
      warningNoteEn: 'Strict adherence to ethical principles neutralizes malefic transit energies.',
      warningNoteHi: 'नीति व धर्म का पालन करने पर क्रूर ग्रहों का दुष्प्रभाव निष्फल हो जाता है।',
    },
    crisisStrategy: {
      primaryDeityEn: crisisDeityEn,
      primaryDeityHi: crisisDeityHi,
      rescueMantra,
      actionProtocolEn: 'Chant Mahamrityunjaya Mantra 108 times, light mustard oil lamp under Peepal tree on Saturdays, and offer water to rising Sun.',
      actionProtocolHi: 'कठिन समय में महामृत्युंजय मंत्र का 108 जप, शनिवार को पीपल के नीचे सरसों के तेल का दीपक व सूर्य को तांबे के लोटे से जल अर्पित करें।',
    },
    sports: {
      preferencesEn: sportsListEn,
      preferencesHi: sportsListHi,
      fitnessStyleEn: sportsListEn[0].includes('Cricket') ? 'Vigorous Outdoor & Muscle-Building' : 'Skill-based, Agility & Mind-Body Yoga',
      fitnessStyleHi: sportsListEn[0].includes('Cricket') ? 'सक्रिय मैदानी खेल, जिम व शक्ति संवर्धन' : 'फुर्तीले खेल, दिमागी कौशल व योगाभ्यास',
    },
    temperament: {
      traitSummaryEn: tempEn,
      traitSummaryHi: tempHi,
      gunaEn: elem === 'Fire' ? 'Rajas-Satva' : elem === 'Earth' ? 'Tamas-Satva' : elem === 'Air' ? 'Rajas' : 'Satva',
      gunaHi: elem === 'Fire' ? 'राजस-सात्विक' : elem === 'Earth' ? 'तामस-सात्विक' : elem === 'Air' ? 'राजसिक' : 'सात्विक',
    },
    loveLife: {
      romanceEn: loveLifeEn,
      romanceHi: loveLifeHi,
      marriageTypeEn: loveLifeEn.includes('Vibrant') ? 'Love Marriage / Self-Selected Alliance' : 'Arranged / Family Supported Marriage',
      marriageTypeHi: loveLifeEn.includes('Vibrant') ? 'प्रेम विवाह अथवा मनपसंद विवाह' : 'पारंपरिक / पारिवारिक सहमति से विवाह',
    },
    mentalHealth: {
      conditionEn: mentalEn,
      conditionHi: mentalHi,
      vulnerabilitiesEn: afflictedMoon ? 'Insomnia, emotional vulnerability, psychosomatic digestion distress' : 'Sound mental balance with high resilience',
      vulnerabilitiesHi: afflictedMoon ? 'अनिद्रा, अत्यधिक भावुकता व तनाव से पेट खराब होना' : 'मानसिक शांति व कठिन परिस्थितियों में धैर्य',
      remedyEn: 'Drink water from silver vessel, keep silver coin, chant Chandra Beej Mantra on Mondays.',
      remedyHi: 'चांदी के पात्र से जल पिएं, सोमवार को शिवजी पर कच्चा दूध चढ़ाएं व चंद्र बीज मंत्र का जप करें।',
    },
    health: {
      constitutionEn: tridoshaEn,
      constitutionHi: tridoshaHi,
      vulnerableOrgansEn: vulnOrgansEn,
      vulnerableOrgansHi: vulnOrgansHi,
    },
    wealth: {
      statusEn: wealthStatusEn,
      statusHi: wealthStatusHi,
      activeYogasEn: dhanaYogas.map((y) => y.name),
      activeYogasHi: dhanaYogas.map((y) => y.name),
      peakAgeWindowEn: 'Major wealth accumulation window: 32 to 54 years of age',
      peakAgeWindowHi: 'मुख्य धन संचय व वित्तीय समृद्धि काल: 32 से 54 वर्ष की आयु में',
    },
  };
}
