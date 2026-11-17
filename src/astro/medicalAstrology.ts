import type { ChartData, NineGrahaId, SevenPlanetId } from './types';
import { SIGNS, NAKSHATRAS } from './constants';

// ─────────────────────────── Types ───────────────────────────

export interface BodySystemInfo {
  houseNumber: number;    // 1..12
  signIndex: number;      // 0..11
  signName: string;
  bodyParts: string[];
  bodyPartsHindi: string[];
  planetsInHouse: NineGrahaId[];
  afflictionScore: number;    // 0..100 (100 = healthiest)
  afflictionLevel: 'Severe' | 'Moderate' | 'Mild' | 'Healthy';
  afflictionNotes: string[];
}

export interface TridoshaResult {
  vataPercent: number;
  pittaPercent: number;
  kaphaPercent: number;
  dominantDosha: 'Vata' | 'Pitta' | 'Kapha' | 'Vata-Pitta' | 'Pitta-Kapha' | 'Vata-Kapha' | 'Tridoshic';
  constitution: string;
  constitutionHindi: string;
  recommendations: string[];
  recommendationsHindi: string[];
}

export interface KriticalPoints {
  drekkana22SignIndex: number;
  drekkana22SignName: string;
  drekkana22Lord: SevenPlanetId;
  navamsha64SignIndex: number;
  navamsha64SignName: string;
  navamsha64Lord: SevenPlanetId;
  khareshPeriods: string[];
  warningEn: string;
  warningHi: string;
}

export interface HealthVulnerability {
  houseNumber: number;
  signName: string;
  bodyParts: string[];
  bodyPartsHindi: string[];
  score: number;        // 0..100
  severity: 'Critical' | 'High' | 'Moderate' | 'Low' | 'Healthy';
  factors: string[];
}

export interface MedicalAstrologyReport {
  bodySystems: BodySystemInfo[];
  tridosha: TridoshaResult;
  criticalPoints: KriticalPoints;
  vulnerabilities: HealthVulnerability[];
  overallHealthScore: number;
  overallSummaryEn: string;
  overallSummaryHi: string;
}

// ─────────────────────────── Constants ───────────────────────────

const KALAPURUSHA_BODY: Array<{ bodyParts: string[]; bodyPartsHindi: string[] }> = [
  { // H1 Aries
    bodyParts: ['Head', 'Brain', 'Skull', 'Pituitary Gland'],
    bodyPartsHindi: ['सिर', 'मस्तिष्क', 'खोपड़ी', 'पीयूष ग्रंथि'],
  },
  { // H2 Taurus
    bodyParts: ['Face', 'Neck', 'Throat', 'Thyroid', 'Right Eye'],
    bodyPartsHindi: ['चेहरा', 'गर्दन', 'गला', 'थायराइड', 'दाहिनी आँख'],
  },
  { // H3 Gemini
    bodyParts: ['Shoulders', 'Arms', 'Hands', 'Lungs', 'Bronchi', 'Nervous System'],
    bodyPartsHindi: ['कंधे', 'भुजाएँ', 'हाथ', 'फेफड़े', 'श्वासनली', 'तंत्रिका तंत्र'],
  },
  { // H4 Cancer
    bodyParts: ['Chest', 'Heart', 'Lower Lungs', 'Stomach', 'Breasts'],
    bodyPartsHindi: ['छाती', 'हृदय', 'निचले फेफड़े', 'पेट', 'स्तन'],
  },
  { // H5 Leo
    bodyParts: ['Heart', 'Upper Back', 'Spine', 'Stomach', 'Liver', 'Gallbladder'],
    bodyPartsHindi: ['हृदय', 'ऊपरी पीठ', 'रीढ़', 'पेट', 'यकृत', 'पित्ताशय'],
  },
  { // H6 Virgo
    bodyParts: ['Intestines', 'Colon', 'Spleen', 'Pancreas', 'Left Eye'],
    bodyPartsHindi: ['आंतें', 'बृहदान्त्र', 'तिल्ली', 'अग्न्याशय', 'बायीं आँख'],
  },
  { // H7 Libra
    bodyParts: ['Kidneys', 'Lower Back', 'Lumbar', 'Ovaries'],
    bodyPartsHindi: ['गुर्दे', 'निचली पीठ', 'कटि', 'अंडाशय'],
  },
  { // H8 Scorpio
    bodyParts: ['Genitals', 'Reproductive System', 'Anus', 'Lower Colon', 'Excretory System'],
    bodyPartsHindi: ['जननांग', 'प्रजनन तंत्र', 'गुदा', 'निचली आंत', 'उत्सर्जन तंत्र'],
  },
  { // H9 Sagittarius
    bodyParts: ['Hips', 'Thighs', 'Liver', 'Arteries', 'Sciatic Nerve'],
    bodyPartsHindi: ['कूल्हे', 'जाँघें', 'यकृत', 'धमनियाँ', 'कटिस्नायु'],
  },
  { // H10 Capricorn
    bodyParts: ['Knees', 'Joints', 'Skin', 'Bones'],
    bodyPartsHindi: ['घुटने', 'जोड़', 'त्वचा', 'हड्डियाँ'],
  },
  { // H11 Aquarius
    bodyParts: ['Ankles', 'Calves', 'Circulatory System', 'Left Ear'],
    bodyPartsHindi: ['टखने', 'पिंडलियाँ', 'परिसंचरण तंत्र', 'बायाँ कान'],
  },
  { // H12 Pisces
    bodyParts: ['Feet', 'Lymphatic System', 'Immune System', 'Sleep Disorders'],
    bodyPartsHindi: ['पैर', 'लसीका तंत्र', 'प्रतिरक्षा तंत्र', 'नींद विकार'],
  },
];

// Classic malefics and benefics
const MALEFICS: NineGrahaId[] = ['Sun', 'Mars', 'Saturn', 'Rahu', 'Ketu'];
const BENEFICS: NineGrahaId[] = ['Moon', 'Mercury', 'Jupiter', 'Venus'];

// Dosha mapping by element
const ELEMENT_DOSHA: Record<string, { vata: number; pitta: number; kapha: number }> = {
  Fire: { vata: 0, pitta: 100, kapha: 0 },
  Earth: { vata: 50, pitta: 0, kapha: 50 },
  Air: { vata: 100, pitta: 0, kapha: 0 },
  Water: { vata: 0, pitta: 0, kapha: 100 },
};

// Dosha mapping by planet
const PLANET_DOSHA: Record<NineGrahaId, { vata: number; pitta: number; kapha: number }> = {
  Sun: { vata: 0, pitta: 100, kapha: 0 },
  Mars: { vata: 0, pitta: 100, kapha: 0 },
  Saturn: { vata: 100, pitta: 0, kapha: 0 },
  Rahu: { vata: 100, pitta: 0, kapha: 0 },
  Moon: { vata: 0, pitta: 0, kapha: 100 },
  Venus: { vata: 0, pitta: 0, kapha: 100 },
  Jupiter: { vata: 0, pitta: 0, kapha: 100 },
  Mercury: { vata: 33, pitta: 34, kapha: 33 },
  Ketu: { vata: 50, pitta: 50, kapha: 0 },
};

// ─────────────────────────── Helper Functions ───────────────────────────

function getSignLord(signIndex: number): SevenPlanetId {
  return SIGNS[signIndex % 12].lord;
}

function isMalefic(planet: NineGrahaId): boolean {
  return MALEFICS.includes(planet);
}

function isBenefic(planet: NineGrahaId): boolean {
  return BENEFICS.includes(planet);
}

function getPlanetsInHouse(chart: ChartData, houseNumber: number): NineGrahaId[] {
  const result: NineGrahaId[] = [];
  for (const planet of chart.planets) {
    const pid = planet.id as NineGrahaId;
    if (!['Uranus', 'Neptune', 'Pluto'].includes(pid) && planet.rasiHouseNumber === houseNumber) {
      result.push(pid);
    }
  }
  return result;
}

function getPlanetsAspectingHouse(chart: ChartData, houseNumber: number): NineGrahaId[] {
  // Use aspects data: check which planets aspect the sign that the house corresponds to
  const houseSignIndex = (chart.ascendant.signIndex + houseNumber - 1) % 12;
  const houseSignName = SIGNS[houseSignIndex].name;
  const result: NineGrahaId[] = [];
  for (const aspect of chart.aspects) {
    // Check if aspect target is a planet in this house or the house sign itself
    const targetPlanet = chart.planets.find(p => p.id === aspect.to);
    if (targetPlanet && targetPlanet.rasiHouseNumber === houseNumber) {
      const fromPlanet = aspect.from as NineGrahaId;
      if (!result.includes(fromPlanet)) result.push(fromPlanet);
    }
  }
  // Also add standard 7th aspect: planets in opposite house aspect this house
  const oppositeHouse = ((houseNumber - 1 + 6) % 12) + 1;
  const planetsOpposite = getPlanetsInHouse(chart, oppositeHouse);
  for (const p of planetsOpposite) {
    if (!result.includes(p)) result.push(p);
  }
  void houseSignName;
  return result;
}

function computeAfflictionScore(
  planetsInHouse: NineGrahaId[],
  planetsAspecting: NineGrahaId[],
  chart: ChartData,
  houseNumber: number,
): { score: number; notes: string[] } {
  let score = 70; // baseline
  const notes: string[] = [];
  const houseSignIndex = (chart.ascendant.signIndex + houseNumber - 1) % 12;

  for (const p of planetsInHouse) {
    const planetData = chart.planets.find(pd => pd.id === p);
    if (!planetData) continue;
    if (isMalefic(p)) {
      score -= 15;
      notes.push(`${p} (malefic) in house ${houseNumber}`);
    }
    if (isBenefic(p)) {
      score += 12;
      notes.push(`${p} (benefic) in house ${houseNumber}`);
    }
    if (planetData.dignity === 'Exalted') {
      score += 10;
      notes.push(`${p} exalted`);
    }
    if (planetData.dignity === 'Debilitated') {
      score -= 15;
      notes.push(`${p} debilitated`);
    }
  }

  for (const p of planetsAspecting) {
    if (planetsInHouse.includes(p)) continue; // already counted
    if (isMalefic(p)) {
      score -= 8;
      notes.push(`${p} (malefic) aspects house ${houseNumber}`);
    }
    if (isBenefic(p)) {
      score += 8;
      notes.push(`${p} (benefic) aspects house ${houseNumber}`);
    }
  }

  // Check sign lord dignity
  const lord = getSignLord(houseSignIndex);
  const lordData = chart.planets.find(p => p.id === lord);
  if (lordData) {
    if (lordData.dignity === 'Exalted') { score += 8; notes.push(`House lord ${lord} exalted`); }
    if (lordData.dignity === 'Debilitated') { score -= 10; notes.push(`House lord ${lord} debilitated`); }
  }

  score = Math.max(0, Math.min(100, score));
  return { score, notes };
}

function getAfflictionLevel(score: number): 'Severe' | 'Moderate' | 'Mild' | 'Healthy' {
  if (score < 30) return 'Severe';
  if (score < 50) return 'Moderate';
  if (score < 65) return 'Mild';
  return 'Healthy';
}

function getSeverityLabel(score: number): 'Critical' | 'High' | 'Moderate' | 'Low' | 'Healthy' {
  if (score < 25) return 'Critical';
  if (score < 40) return 'High';
  if (score < 55) return 'Moderate';
  if (score < 70) return 'Low';
  return 'Healthy';
}

// ─────────────────────────── Tridosha Computation ───────────────────────────

function computeTridosha(chart: ChartData): TridoshaResult {
  let vataTotal = 0, pittaTotal = 0, kaphaTotal = 0;
  let weightTotal = 0;

  // Lagna sign (3x weight)
  const lagnaElement = SIGNS[chart.ascendant.signIndex].element;
  const lagnaDosha = ELEMENT_DOSHA[lagnaElement];
  vataTotal += lagnaDosha.vata * 3;
  pittaTotal += lagnaDosha.pitta * 3;
  kaphaTotal += lagnaDosha.kapha * 3;
  weightTotal += 300;

  // Lagna lord sign (2x weight)
  const lagnaLord = SIGNS[chart.ascendant.signIndex].lord;
  const lagnaLordPlanet = chart.planets.find(p => p.id === lagnaLord);
  if (lagnaLordPlanet) {
    const lldElement = SIGNS[lagnaLordPlanet.signIndex].element;
    const lldDosha = ELEMENT_DOSHA[lldElement];
    vataTotal += lldDosha.vata * 2;
    pittaTotal += lldDosha.pitta * 2;
    kaphaTotal += lldDosha.kapha * 2;
    weightTotal += 200;
  }

  // Moon sign (3x weight)
  const moon = chart.planets.find(p => p.id === 'Moon');
  if (moon) {
    const moonElement = SIGNS[moon.signIndex].element;
    const moonDosha = ELEMENT_DOSHA[moonElement];
    vataTotal += moonDosha.vata * 3;
    pittaTotal += moonDosha.pitta * 3;
    kaphaTotal += moonDosha.kapha * 3;
    weightTotal += 300;
  }

  // Sun sign (1x weight)
  const sun = chart.planets.find(p => p.id === 'Sun');
  if (sun) {
    const sunElement = SIGNS[sun.signIndex].element;
    const sunDosha = ELEMENT_DOSHA[sunElement];
    vataTotal += sunDosha.vata;
    pittaTotal += sunDosha.pitta;
    kaphaTotal += sunDosha.kapha;
    weightTotal += 100;
  }

  // Top 3 planets by dignity score
  const dignityScores: Record<string, number> = {
    Exalted: 5, Moolatrikona: 4, 'Own Sign': 3, 'Great Friend': 2, Friend: 1,
    Neutral: 0, Enemy: -1, 'Great Enemy': -2, Debilitated: -3, '-': 0,
  };
  const sortedPlanets = [...chart.planets]
    .filter(p => !['Uranus', 'Neptune', 'Pluto'].includes(p.id))
    .sort((a, b) => (dignityScores[b.dignity] ?? 0) - (dignityScores[a.dignity] ?? 0))
    .slice(0, 3);

  for (const planet of sortedPlanets) {
    const pid = planet.id as NineGrahaId;
    if (PLANET_DOSHA[pid]) {
      vataTotal += PLANET_DOSHA[pid].vata;
      pittaTotal += PLANET_DOSHA[pid].pitta;
      kaphaTotal += PLANET_DOSHA[pid].kapha;
      weightTotal += 100;
    }
  }

  const total = (vataTotal + pittaTotal + kaphaTotal) || 1;
  const vataPercent = Math.round((vataTotal / total) * 100);
  const pittaPercent = Math.round((pittaTotal / total) * 100);
  const kaphaPercent = 100 - vataPercent - pittaPercent;

  void weightTotal;

  // Determine dominant dosha
  const threshold = 15;
  let dominantDosha: TridoshaResult['dominantDosha'];
  const maxDosha = Math.max(vataPercent, pittaPercent, kaphaPercent);
  if (maxDosha - Math.min(vataPercent, pittaPercent, kaphaPercent) < threshold) {
    dominantDosha = 'Tridoshic';
  } else if (vataPercent === maxDosha && pittaPercent === maxDosha) {
    dominantDosha = 'Vata-Pitta';
  } else if (pittaPercent === maxDosha && kaphaPercent === maxDosha) {
    dominantDosha = 'Pitta-Kapha';
  } else if (vataPercent === maxDosha && kaphaPercent === maxDosha) {
    dominantDosha = 'Vata-Kapha';
  } else if (vataPercent === maxDosha) {
    dominantDosha = 'Vata';
  } else if (pittaPercent === maxDosha) {
    dominantDosha = 'Pitta';
  } else {
    dominantDosha = 'Kapha';
  }

  const constitutionMap: Record<string, { en: string; hi: string }> = {
    Vata: { en: 'Vata Prakriti — Light, quick, creative; prone to anxiety, dryness, irregular digestion.', hi: 'वात प्रकृति — हल्का, तीव्र, सृजनशील; चिंता, शुष्कता, अनियमित पाचन की संभावना।' },
    Pitta: { en: 'Pitta Prakriti — Sharp, intense, driven; prone to inflammation, acidity, perfectionism.', hi: 'पित्त प्रकृति — तीक्ष्ण, तीव्र, महत्वाकांक्षी; सूजन, अम्लता, पूर्णतावाद की संभावना।' },
    Kapha: { en: 'Kapha Prakriti — Stable, calm, nurturing; prone to weight gain, lethargy, congestion.', hi: 'कफ प्रकृति — स्थिर, शांत, पोषणकारी; वजन बढ़ना, सुस्ती, कफ जमाव की संभावना।' },
    'Vata-Pitta': { en: 'Vata-Pitta Dual Constitution — Active, analytical; balance rest with productivity.', hi: 'वात-पित्त द्वि-प्रकृति — सक्रिय, विश्लेषणात्मक; आराम और उत्पादकता का संतुलन आवश्यक।' },
    'Pitta-Kapha': { en: 'Pitta-Kapha Dual Constitution — Determined and steady; manage heat and heaviness.', hi: 'पित्त-कफ द्वि-प्रकृति — दृढ़ और स्थिर; ताप और भारीपन का प्रबंधन आवश्यक।' },
    'Vata-Kapha': { en: 'Vata-Kapha Dual Constitution — Adaptable yet grounded; balance movement with rest.', hi: 'वात-कफ द्वि-प्रकृति — अनुकूलनीय पर जमीन से जुड़ा; गतिशीलता और विश्राम का संतुलन।' },
    Tridoshic: { en: 'Tridoshic Constitution — Balanced all three doshas; rare and naturally resilient.', hi: 'त्रिदोषिक प्रकृति — तीनों दोष संतुलित; दुर्लभ और स्वाभाविक रूप से लचीली।' },
  };

  const recommendationsMap: Record<string, { en: string[]; hi: string[] }> = {
    Vata: {
      en: ['Favor warm, moist, oily foods', 'Maintain regular daily routine', 'Practice grounding yoga: Hatha, Yin', 'Avoid raw, cold, dry foods', 'Sesame oil massage (Abhyanga) weekly'],
      hi: ['गर्म, नम, तैलीय भोजन लें', 'नियमित दिनचर्या बनाएं', 'ग्राउंडिंग योग: हठ, यिन', 'कच्चे, ठंडे, सूखे खाद्य से बचें', 'सप्ताह में एक बार तिल तेल मालिश (अभ्यंग)'],
    },
    Pitta: {
      en: ['Favor cooling, sweet, bitter foods', 'Avoid spicy, sour, salty excess', 'Practice cooling yoga: Moon Salutation, restorative', 'Coconut oil massage', 'Meditate to manage intensity'],
      hi: ['शीतल, मीठे, कड़वे खाद्य लें', 'तीखे, खट्टे, नमकीन से परहेज', 'शीतल योग: चंद्र नमस्कार, पुनर्स्थापना', 'नारियल तेल मालिश', 'तीव्रता नियंत्रण के लिए ध्यान'],
    },
    Kapha: {
      en: ['Favor light, dry, spicy foods', 'Exercise vigorously daily', 'Practice energizing yoga: Sun Salutation, Vinyasa', 'Dry brushing before bath', 'Avoid heavy, oily, sweet excess'],
      hi: ['हल्का, सूखा, मसालेदार भोजन लें', 'प्रतिदिन जोरदार व्यायाम', 'ऊर्जावान योग: सूर्य नमस्कार, विन्यास', 'स्नान से पहले ड्राई ब्रशिंग', 'भारी, चिकने, मीठे से परहेज'],
    },
  };

  const recs = recommendationsMap[dominantDosha.split('-')[0]] || recommendationsMap.Vata;
  const constitution = constitutionMap[dominantDosha] || constitutionMap.Tridoshic;

  return {
    vataPercent,
    pittaPercent,
    kaphaPercent,
    dominantDosha,
    constitution: constitution.en,
    constitutionHindi: constitution.hi,
    recommendations: recs.en,
    recommendationsHindi: recs.hi,
  };
}

// ─────────────────────────── 22nd Drekkana & 64th Navamsha ───────────────────────────

function computeCriticalPoints(chart: ChartData): KriticalPoints {
  // 22nd Drekkana from Lagna
  // Each sign has 3 drekkanas (10° each). 12 signs × 3 = 36 drekkanas total.
  // Lagna drekkana index = signIndex × 3 + floor(degreeInSign / 10)
  const lagnaSignIdx = chart.ascendant.signIndex;
  const lagnaDegreInSign = chart.ascendant.degreeInSign;
  const lagnaDrekkanaIdx = lagnaSignIdx * 3 + Math.floor(lagnaDegreInSign / 10);
  // 22nd drekkana forward (1-indexed, so add 21)
  const dk22Idx = (lagnaDrekkanaIdx + 21) % 36;
  const dk22SignIndex = Math.floor(dk22Idx / 3);
  const dk22SignName = SIGNS[dk22SignIndex].name;
  const dk22Lord = SIGNS[dk22SignIndex].lord;

  // 64th Navamsha from Moon
  // 9 navamshas per sign × 12 signs = 108 total
  const moonPlanet = chart.planets.find(p => p.id === 'Moon');
  let nav64SignIndex = 0;
  let nav64SignName = SIGNS[0].name;
  let nav64Lord: SevenPlanetId = SIGNS[0].lord;

  if (moonPlanet) {
    const moonSignIdx = moonPlanet.signIndex;
    const moonDegInSign = moonPlanet.degreeInSign;
    const moonNavamshaIdx = moonSignIdx * 9 + Math.floor(moonDegInSign / (30 / 9));
    // 64th navamsha = (moonNavamshaIdx + 63) % 108
    const nav64Idx = (moonNavamshaIdx + 63) % 108;
    nav64SignIndex = Math.floor(nav64Idx / 9);
    nav64SignName = SIGNS[nav64SignIndex].name;
    nav64Lord = SIGNS[nav64SignIndex].lord;
  }

  // Identify Kharesh (22nd Drekkana lord) dasha periods
  const khareshPeriods: string[] = [];
  for (const period of chart.vimshottari) {
    if (period.lord === dk22Lord) {
      const start = new Date(period.startMs).toLocaleDateString('en-IN', { year: 'numeric', month: 'short' });
      const end = new Date(period.endMs).toLocaleDateString('en-IN', { year: 'numeric', month: 'short' });
      khareshPeriods.push(`${dk22Lord} Mahadasha: ${start} – ${end}`);
    }
    if (period.children) {
      for (const sub of period.children) {
        if (sub.lord === dk22Lord) {
          const start = new Date(sub.startMs).toLocaleDateString('en-IN', { year: 'numeric', month: 'short' });
          const end = new Date(sub.endMs).toLocaleDateString('en-IN', { year: 'numeric', month: 'short' });
          khareshPeriods.push(`${period.lord}/${dk22Lord} Antardasha: ${start} – ${end}`);
        }
      }
    }
  }

  return {
    drekkana22SignIndex: dk22SignIndex,
    drekkana22SignName: dk22SignName,
    drekkana22Lord: dk22Lord,
    navamsha64SignIndex: nav64SignIndex,
    navamsha64SignName: nav64SignName,
    navamsha64Lord: nav64Lord,
    khareshPeriods: khareshPeriods.slice(0, 6),
    warningEn: `22nd Drekkana lord ${dk22Lord} (${dk22SignName}) and 64th Navamsha lord ${nav64Lord} (${nav64SignName}) periods require extra health vigilance.`,
    warningHi: `22वें द्रेक्काण स्वामी ${dk22Lord} (${dk22SignName}) और 64वें नवांश स्वामी ${nav64Lord} (${nav64SignName}) की दशा अवधि में स्वास्थ्य पर विशेष ध्यान आवश्यक।`,
  };
}

// ─────────────────────────── Main Computation ───────────────────────────

export function computeMedicalAstrology(chart: ChartData): MedicalAstrologyReport {
  const bodySystems: BodySystemInfo[] = [];
  const vulnerabilities: HealthVulnerability[] = [];

  for (let h = 1; h <= 12; h++) {
    const houseInfo = KALAPURUSHA_BODY[h - 1];
    const signIndex = (chart.ascendant.signIndex + h - 1) % 12;
    const signName = SIGNS[signIndex].name;
    const planetsInHouse = getPlanetsInHouse(chart, h);
    const planetsAspecting = getPlanetsAspectingHouse(chart, h);
    const { score, notes } = computeAfflictionScore(planetsInHouse, planetsAspecting, chart, h);

    const bodySystem: BodySystemInfo = {
      houseNumber: h,
      signIndex,
      signName,
      bodyParts: houseInfo.bodyParts,
      bodyPartsHindi: houseInfo.bodyPartsHindi,
      planetsInHouse,
      afflictionScore: score,
      afflictionLevel: getAfflictionLevel(score),
      afflictionNotes: notes,
    };
    bodySystems.push(bodySystem);

    vulnerabilities.push({
      houseNumber: h,
      signName,
      bodyParts: houseInfo.bodyParts,
      bodyPartsHindi: houseInfo.bodyPartsHindi,
      score,
      severity: getSeverityLabel(score),
      factors: notes,
    });
  }

  // Sort vulnerabilities by severity (lowest score = most vulnerable first)
  vulnerabilities.sort((a, b) => a.score - b.score);

  const tridosha = computeTridosha(chart);
  const criticalPoints = computeCriticalPoints(chart);

  const overallHealthScore = Math.round(
    bodySystems.reduce((sum, bs) => sum + bs.afflictionScore, 0) / bodySystems.length,
  );

  const overallSummaryEn = `Overall health score: ${overallHealthScore}/100. Constitution: ${tridosha.dominantDosha}. ` +
    `Most vulnerable: ${vulnerabilities[0]?.bodyParts[0] ?? 'None'} (House ${vulnerabilities[0]?.houseNumber ?? '-'}).`;
  const overallSummaryHi = `समग्र स्वास्थ्य स्कोर: ${overallHealthScore}/100। प्रकृति: ${tridosha.dominantDosha}। ` +
    `सर्वाधिक संवेदनशील: ${vulnerabilities[0]?.bodyPartsHindi?.[0] ?? ''} (भाव ${vulnerabilities[0]?.houseNumber ?? '-'})।`;

  return {
    bodySystems,
    tridosha,
    criticalPoints,
    vulnerabilities,
    overallHealthScore,
    overallSummaryEn,
    overallSummaryHi,
  };
}

// Re-export types used by view
export type { NineGrahaId };
