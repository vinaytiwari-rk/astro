import { NAKSHATRAS, SEVEN_PLANETS, SIGNS } from '../constants';
import { formatLocalDateTimeFromUtc } from '../time';
import type { BodyPosition, ChartData, SevenPlanetId } from '../types';
import { buildIntimacyProfile, type IntimacyProfileReport } from './intimacy';

export interface DashaWindow {
  lord: string;
  startDate: string;
  endDate: string;
  reason: string;
}

export interface FinancialAstrologyReport {
  score: number;
  induLagnaSign: string;
  induLagnaHouse: number;
  induLagnaNote: string;
  d2WealthChannel: string;
  fixedAssetsNote: string;
  speculationRiskNote: string;
  wealthStyle: string;
  favorableDashas: DashaWindow[];
  insights: string[];
}

export interface EducationAstrologyReport {
  score: number;
  recommendedStreams: string[];
  d24Note: string;
  analyticalStrength: string;
  higherStudyNote: string;
  favorableDashas: DashaWindow[];
  insights: string[];
}

export interface CareerAstrologyReport {
  score: number;
  workStyle: 'Leadership / Independent Enterprise' | 'Structured Service / Institutional' | 'Balanced Hybrid (Advisory & Enterprise)';
  serviceScore: number;
  businessScore: number;
  topSectors: string[];
  d10Summary: string;
  amatyakarakaNote: string;
  favorableDashas: DashaWindow[];
  insights: string[];
}

export interface MarriageAstrologyReport {
  score: number;
  spouseProfile: string;
  d9Summary: string;
  upapadaNote: string;
  manglikAssessment: string;
  favorableDashas: DashaWindow[];
  insights: string[];
}

export interface ChildAstrologyReport {
  score: number;
  d7Summary: string;
  putrakarakaNote: string;
  jupiterProgenyNote: string;
  favorableDashas: DashaWindow[];
  insights: string[];
}

export interface LifeChapter {
  phase: string;
  ageRange: string;
  dashas: string;
  focus: string;
}

export interface LifePathAstrologyReport {
  elements: Record<'Fire' | 'Earth' | 'Air' | 'Water', number>;
  gunas: Record<'Sattva' | 'Rajas' | 'Tamas', number>;
  longevityResilience: string;
  spiritualPathNote: string;
  chapters: LifeChapter[];
  insights: string[];
}

export interface VulnerableZone {
  house: number;
  signName: string;
  anatomicalRegion: string;
  trigger: string;
  preventiveCare: string;
}

export interface MedicalAstrologyReport {
  disclaimer: string;
  doshaBalance: { vata: number; pitta: number; kapha: number };
  dominantPrakriti: string;
  d6ShashthamsaNote: string;
  vulnerableZones: VulnerableZone[];
  wellnessGuidance: string[];
}

export interface AstroVastuZone {
  direction: string;
  planet: string;
  house: number;
  signName: string;
  status: 'Strong' | 'Balanced' | 'Needs Care';
  tip: string;
}

export interface TaraBalaItem {
  nakshatra: string;
  taraName: string;
  isAuspicious: boolean;
}

export interface OtherBranchesReport {
  astroVastu: AstroVastuZone[];
  taraBalaSummary: TaraBalaItem[];
  westernVedicBridge: {
    siderealSun: string;
    tropicalSun: string;
    siderealMoon: string;
    tropicalMoon: string;
    siderealAsc: string;
    tropicalAsc: string;
    note: string;
  };
}

export interface SpecializedAstrologySuite {
  financial: FinancialAstrologyReport;
  education: EducationAstrologyReport;
  career: CareerAstrologyReport;
  marriage: MarriageAstrologyReport;
  intimacy: IntimacyProfileReport;
  child: ChildAstrologyReport;
  lifePath: LifePathAstrologyReport;
  medical: MedicalAstrologyReport;
  other: OtherBranchesReport;
}

const INDU_KALA: Record<SevenPlanetId, number> = {
  Sun: 30,
  Moon: 16,
  Mars: 6,
  Mercury: 8,
  Jupiter: 10,
  Venus: 12,
  Saturn: 1,
};

const KALAPURUSHA_BODY: Array<{ region: string; care: string }> = [
  { region: 'Head, Cranium & Eyes (Mesha)', care: 'Protect sleep, hydrate well, and avoid chronic heat or rushed tension.' },
  { region: 'Throat, Neck, Thyroid & Jaw (Vrishabha)', care: 'Warm vocal/throat care, balanced thyroid/sugar habits, avoid cold strain.' },
  { region: 'Lungs, Shoulders, Arms & Nervous System (Mithuna)', care: 'Pranayama/breathwork, posture breaks, calm nervous overstimulation.' },
  { region: 'Chest, Heart Space, Lungs & Stomach (Karka)', care: 'Steady meal timing, emotional decompression, avoid heavy late dinners.' },
  { region: 'Heart, Upper Spine & Vitality (Simha)', care: 'Cardiovascular movement, spinal alignment, and moderating stress/ego pressure.' },
  { region: 'Intestines, Digestion & Gut Flora (Kanya)', care: 'Simple whole foods, probiotic balance, avoid worry-driven digestive upset.' },
  { region: 'Kidneys, Lower Back & Endocrine Balance (Tula)', care: 'Consistent hydration, lumbar stretching, balanced rest/activity.' },
  { region: 'Pelvic Area, Reproductive & Excretory System (Vrishchika)', care: 'Clean hydration, stress detox, gentle pelvic/core mobility.' },
  { region: 'Hips, Thighs & Liver Metabolism (Dhanu)', care: 'Moderate rich/fried foods, brisk walking, hip flexibility.' },
  { region: 'Knees, Bones, Joints & Teeth (Makara)', care: 'Vitamin D/mineral sufficiency, warm oil massage, joint-friendly movement.' },
  { region: 'Calves, Ankles & Vascular Circulation (Kumbha)', care: 'Regular leg circulation, avoid prolonged static sitting, stay warm.' },
  { region: 'Feet, Lymphatic Drainage & Sleep Rhythm (Meena)', care: 'Foot care, restful darkness at night, gentle lymphatic movement.' },
];

function clamp(n: number): number {
  return Math.max(30, Math.min(96, Math.round(n)));
}

function housesRuled(planetId: SevenPlanetId, ascSign: number): number[] {
  const out: number[] = [];
  for (let h = 1; h <= 12; h++) {
    if (SIGNS[(ascSign + h - 1) % 12].lord === planetId) out.push(h);
  }
  return out;
}

function findDashasForHouses(
  chart: ChartData,
  targetHouses: number[],
  extraPlanets: string[] = []
): DashaWindow[] {
  const ascSign = chart.ascendant.signIndex;
  const matchingLords = new Set<string>(extraPlanets);

  for (const h of targetHouses) {
    const lord = SIGNS[(ascSign + h - 1) % 12].lord;
    matchingLords.add(lord);
  }
  for (const p of chart.planets) {
    if (targetHouses.includes(p.rasiHouseNumber)) {
      matchingLords.add(p.id);
    }
  }

  return chart.vimshottari
    .filter((md) => matchingLords.has(md.lord))
    .slice(0, 5)
    .map((md) => {
      const pBody = chart.planets.find((p) => p.id === md.lord);
      const ruled = SEVEN_PLANETS.includes(md.lord as SevenPlanetId)
        ? housesRuled(md.lord as SevenPlanetId, ascSign)
        : [];
      const parts: string[] = [];
      if (ruled.length) parts.push(`rules H${ruled.join('&')}`);
      if (pBody) parts.push(`placed in H${pBody.rasiHouseNumber} (${pBody.dignity})`);
      return {
        lord: md.lord,
        startDate: formatLocalDateTimeFromUtc(md.startMs, chart.offsetMinutesUsed).slice(0, 10),
        endDate: formatLocalDateTimeFromUtc(md.endMs, chart.offsetMinutesUsed).slice(0, 10),
        reason: parts.join(', '),
      };
    });
}

function planetDignityScore(p: BodyPosition): number {
  const map: Record<string, number> = {
    Exalted: 16,
    Moolatrikona: 14,
    'Own Sign': 12,
    'Great Friend': 8,
    Friend: 5,
    Neutral: 0,
    Enemy: -6,
    'Great Enemy': -10,
    Debilitated: -12,
  };
  return map[p.dignity] ?? 0;
}

function tropSignLabel(tropLon: number): string {
  const norm = ((tropLon % 360) + 360) % 360;
  const s = Math.floor(norm / 30) % 12;
  const d = (norm % 30).toFixed(1);
  return `${SIGNS[s].name} ${d}°`;
}

export function buildSpecializedAstrologySuite(chart: ChartData): SpecializedAstrologySuite {
  const ascSign = chart.ascendant.signIndex;
  const byId = new Map(chart.planets.map((p) => [p.id, p]));
  const sun = byId.get('Sun')!;
  const moon = byId.get('Moon')!;
  const mars = byId.get('Mars')!;
  const mercury = byId.get('Mercury')!;
  const jupiter = byId.get('Jupiter')!;
  const venus = byId.get('Venus')!;
  const saturn = byId.get('Saturn')!;
  const rahu = byId.get('Rahu')!;
  const ketu = byId.get('Ketu')!;

  const getLord = (h: number) => byId.get(SIGNS[(ascSign + h - 1) % 12].lord)!;
  const savAt = (h: number) => chart.ashtakavarga.sarva[(ascSign + h - 1) % 12];
  const vargaDig = (v: keyof ChartData['divisionalCharts'], id: string) =>
    chart.divisionalCharts[v].placements.find((x) => x.id === id)?.dignity ?? '-';

  // 1. FINANCIAL ASTROLOGY
  const ninthFromAscLord = SIGNS[(ascSign + 8) % 12].lord;
  const ninthFromMoonLord = SIGNS[(moon.signIndex + 8) % 12].lord;
  const induRem = (INDU_KALA[ninthFromAscLord] + INDU_KALA[ninthFromMoonLord]) % 12 || 12;
  const induSignIdx = (moon.signIndex + induRem - 1) % 12;
  const induHouse = ((induSignIdx - ascSign + 12) % 12) + 1;
  const induOccupants = chart.planets.filter((p) => p.signIndex === induSignIdx);
  const induLord = byId.get(SIGNS[induSignIdx].lord)!;

  const l2 = getLord(2);
  const l5 = getLord(5);
  const l9 = getLord(9);
  const l11 = getLord(11);
  const l4 = getLord(4);

  const finScore = clamp(
    58 +
      planetDignityScore(l2) * 0.6 +
      planetDignityScore(l11) * 0.6 +
      planetDignityScore(jupiter) * 0.4 +
      (savAt(11) - 28) * 1.1 +
      (savAt(2) - 28) * 0.8 +
      (induOccupants.length > 0 ? 7 : 0)
  );

  const d2Placements = chart.divisionalCharts.D2.placements.filter((p) => p.id !== 'Asc');
  const leoCount = d2Placements.filter((p) => p.signIndex === 4).length;
  const cancerCount = d2Placements.filter((p) => p.signIndex === 3).length;
  const d2WealthChannel =
    leoCount > cancerCount
      ? `D2 Hora leans toward Sun/Leo (${leoCount} vs ${cancerCount} bodies): prosperity grows strongly through personal enterprise, authority, and self-earned skill.`
      : cancerCount > leoCount
        ? `D2 Hora leans toward Moon/Cancer (${cancerCount} vs ${leoCount} bodies): prosperity flows via partnerships, public goodwill, liquid trade, and stewardship.`
        : 'D2 Hora balances Sun and Moon evenly: equal blend of independent income and collaborative wealth channels.';

  const financial: FinancialAstrologyReport = {
    score: finScore,
    induLagnaSign: SIGNS[induSignIdx].name,
    induLagnaHouse: induHouse,
    induLagnaNote:
      induOccupants.length > 0
        ? `Indu Lagna falls in ${SIGNS[induSignIdx].name} (House ${induHouse}) occupied by ${induOccupants.map((p) => p.id).join(', ')} — strong classical wealth catalyst.`
        : `Indu Lagna falls in ${SIGNS[induSignIdx].name} (House ${induHouse}), governed by ${induLord.id} in House ${induLord.rasiHouseNumber} (${induLord.dignity}).`,
    d2WealthChannel,
    fixedAssetsNote: `4th lord ${l4.id} in House ${l4.rasiHouseNumber} (${l4.dignity}) and D4 Chaturthamsa (${vargaDig('D4', l4.id)}) govern land, real estate, and durable holdings.`,
    speculationRiskNote:
      [6, 8, 12].includes(l5.rasiHouseNumber) || rahu.rasiHouseNumber === 5
        ? '5th house / lord carries volatile or Rahu-accented speculation energy — favor diversified long-term allocation over high-leverage bets.'
        : `5th lord ${l5.id} in House ${l5.rasiHouseNumber} supports disciplined equity/skill-based wealth creation.`,
    wealthStyle:
      savAt(11) >= savAt(2)
        ? 'Income- & Network-Driven Accumulation (strong 11th house gains)'
        : 'Treasury- & Reserve-Driven Preservation (strong 2nd house savings)',
    favorableDashas: findDashasForHouses(chart, [2, 5, 9, 11], ['Jupiter']),
    insights: [
      `2nd lord ${l2.id} (savings) in House ${l2.rasiHouseNumber}; 11th lord ${l11.id} (gains) in House ${l11.rasiHouseNumber}.`,
      `SAV Bindus: House 2 = ${savAt(2)}, House 11 = ${savAt(11)}, House 12 (expenses) = ${savAt(12)}.`,
      savAt(11) > savAt(12)
        ? `Gains exceed expenditure (${savAt(11)} vs ${savAt(12)} bindus), supporting net capital retention.`
        : `Expenditure matches/exceeds 11th bindus (${savAt(12)} vs ${savAt(11)}), advising automated savings budgets.`,
    ],
  };

  // 2. EDUCATION ASTROLOGY
  const eduScore = clamp(
    60 +
      planetDignityScore(mercury) * 0.6 +
      planetDignityScore(jupiter) * 0.5 +
      planetDignityScore(l4) * 0.5 +
      planetDignityScore(l5) * 0.5 +
      (savAt(4) + savAt(5) - 56) * 0.8
  );

  const eduStreams: string[] = [];
  const h459Occupants = chart.planets.filter((p) => [4, 5, 9].includes(p.rasiHouseNumber)).map((p) => p.id);
  if (mercury.dignity !== 'Debilitated' || h459Occupants.includes('Mercury')) {
    eduStreams.push('Computer Science, Mathematics, Data Analytics, Commerce & Writing');
  }
  if (jupiter.dignity !== 'Debilitated' || h459Occupants.includes('Jupiter')) {
    eduStreams.push('Law, Philosophy, Academia, Finance & Advisory Sciences');
  }
  if (mars.rasiHouseNumber === 4 || mars.rasiHouseNumber === 5 || sun.rasiHouseNumber === 5) {
    eduStreams.push('Engineering, Medicine/Surgery, Architecture & Applied Technology');
  }
  if (venus.rasiHouseNumber === 4 || venus.rasiHouseNumber === 5 || moon.rasiHouseNumber === 5) {
    eduStreams.push('Design, Literature, Fine Arts, Psychology & Media Studies');
  }
  if (eduStreams.length === 0) {
    eduStreams.push('Applied Management, Technical Trades & Interdisciplinary Study');
  }

  const education: EducationAstrologyReport = {
    score: eduScore,
    recommendedStreams: eduStreams,
    d24Note: `D24 Siddhamsa Lagna is ${SIGNS[chart.divisionalCharts.D24.lagnaSignIndex].name}; Mercury holds ${vargaDig('D24', 'Mercury')} and Jupiter holds ${vargaDig('D24', 'Jupiter')} dignity in D24.`,
    analyticalStrength: `Mercury in ${mercury.signName} (House ${mercury.rasiHouseNumber}, ${mercury.dignity}) governs memory, logic, and exam articulation.`,
    higherStudyNote: `9th lord ${l9.id} in House ${l9.rasiHouseNumber} (${l9.dignity}) supports university research, specialized certifications, and mentors.`,
    favorableDashas: findDashasForHouses(chart, [4, 5, 9], ['Mercury', 'Jupiter']),
    insights: [
      `4th house (foundational schooling) carries ${savAt(4)} SAV bindus; 5th house (intellect & exams) carries ${savAt(5)} bindus.`,
      `Budha-Jupiter balance shapes both fast technical comprehension and long-range conceptual synthesis.`,
    ],
  };

  // 3. CAREER ASTROLOGY
  const l6 = getLord(6);
  const l7 = getLord(7);
  const l10 = getLord(10);
  const amk = chart.planets.find((p) => p.charaKaraka === 'AmK') ?? mercury;
  const serviceScore = clamp(55 + savAt(6) * 0.9 + planetDignityScore(l6) * 0.7 + planetDignityScore(saturn) * 0.5);
  const businessScore = clamp(55 + savAt(7) * 0.9 + planetDignityScore(l7) * 0.7 + planetDignityScore(mercury) * 0.5);

  const workStyle: CareerAstrologyReport['workStyle'] =
    businessScore - serviceScore >= 8
      ? 'Leadership / Independent Enterprise'
      : serviceScore - businessScore >= 8
        ? 'Structured Service / Institutional'
        : 'Balanced Hybrid (Advisory & Enterprise)';

  const strongPlanets = [...chart.shadbala].sort((a, b) => b.ratio - a.ratio).slice(0, 2).map((r) => r.planet);
  const sectorMap: Record<SevenPlanetId, string> = {
    Sun: 'Government, Executive Leadership, Healthcare & Public Institutions',
    Moon: 'Hospitality, Counseling, Public Relations, Maritime & Care Professions',
    Mars: 'Engineering, Manufacturing, Defense, Real Estate, Surgery & Sports',
    Mercury: 'Software/IT, Media, Finance, Writing, Analytics & Commerce',
    Jupiter: 'Education, Law, Banking, Advisory Consulting & Publishing',
    Venus: 'Design, Architecture, Luxury Retail, Arts, Entertainment & Diplomacy',
    Saturn: 'Infrastructure, Operations, Law, Manufacturing, Mining & Administration',
  };

  const topSectors = Array.from(
    new Set([
      sectorMap[l10.id as SevenPlanetId] ?? sectorMap.Mercury,
      ...(SEVEN_PLANETS.includes(amk.id as SevenPlanetId) ? [sectorMap[amk.id as SevenPlanetId]] : []),
      ...strongPlanets.map((p) => sectorMap[p]),
    ])
  ).slice(0, 3);

  const career: CareerAstrologyReport = {
    score: clamp(
      58 +
        planetDignityScore(l10) * 0.7 +
        (savAt(10) - 28) * 1.2 +
        ((chart.shadbala.find((s) => s.planet === l10.id)?.ratio ?? 1) - 1) * 14
    ),
    workStyle,
    serviceScore,
    businessScore,
    topSectors,
    d10Summary: `D10 Dasamsa Lagna is ${SIGNS[chart.divisionalCharts.D10.lagnaSignIndex].name}; 10th lord ${l10.id} holds ${vargaDig('D10', l10.id)} dignity in D10.`,
    amatyakarakaNote: `Jaimini Amatyakaraka (AmK) is ${amk.id} in ${amk.signName} (House ${amk.rasiHouseNumber}), shaping daily career craft.`,
    favorableDashas: findDashasForHouses(chart, [6, 10, 11], [l10.id]),
    insights: [
      `10th house carries ${savAt(10)} SAV bindus; strongest Shadbala planets: ${strongPlanets.join(', ')}.`,
      `Service vs Business index: ${serviceScore} vs ${businessScore}.`,
    ],
  };

  // 4. MARRIAGE ASTROLOGY
  const dk = chart.planets.find((p) => p.charaKaraka === 'DK') ?? venus;
  const upapada = chart.specialPoints.find((s) => s.id === 'UL');
  const manglikYoga = chart.yogas.find((y) => y.name.includes('Kuja'));

  const marriage: MarriageAstrologyReport = {
    score: clamp(58 + planetDignityScore(l7) * 0.7 + planetDignityScore(venus) * 0.5 + (savAt(7) - 28) * 1.1),
    spouseProfile: `7th lord ${l7.id} sits in ${l7.signName} (House ${l7.rasiHouseNumber}); Darakaraka ${dk.id} in ${dk.signName} points to a partner embodying ${dk.id} traits (articulate, devoted, or grounded per sign).`,
    d9Summary: `Navamsa (D9) Lagna is ${SIGNS[chart.divisionalCharts.D9.lagnaSignIndex].name}; 7th lord ${l7.id} has ${vargaDig('D9', l7.id)} dignity and Venus has ${vargaDig('D9', 'Venus')} dignity in D9.`,
    upapadaNote: upapada
      ? `Upapada Lagna (UL) in ${upapada.signName} (House ${upapada.houseNumber}) highlights shared values and family traditions sustaining marriage.`
      : 'Upapada Lagna reinforces 7th-house partner harmony.',
    manglikAssessment: manglikYoga
      ? `${manglikYoga.name}: ${manglikYoga.description}`
      : 'No classical Kuja/Manglik Dosha from Lagna.',
    favorableDashas: findDashasForHouses(chart, [2, 7, 11], ['Venus']),
    insights: [
      `7th house holds ${savAt(7)} SAV bindus; 2nd (family) = ${savAt(2)} bindus.`,
      `Emotional compatibility thrives when Moon & Venus rhythms are honored alongside 7th-lord Dashas.`,
    ],
  };

  // 5. CHILD / PROGENY ASTROLOGY
  const pk = chart.planets.find((p) => p.charaKaraka === 'PK') ?? jupiter;
  const child: ChildAstrologyReport = {
    score: clamp(59 + planetDignityScore(l5) * 0.6 + planetDignityScore(jupiter) * 0.6 + (savAt(5) - 28) * 1.1),
    d7Summary: `D7 Saptamsa Lagna is ${SIGNS[chart.divisionalCharts.D7.lagnaSignIndex].name}; Jupiter holds ${vargaDig('D7', 'Jupiter')} and 5th lord ${l5.id} holds ${vargaDig('D7', l5.id)} dignity in D7.`,
    putrakarakaNote: `Jaimini Putrakaraka (PK) is ${pk.id} in ${pk.signName} (House ${pk.rasiHouseNumber}), characterizing parenting bond and children’s vitality.`,
    jupiterProgenyNote: `Natural Putrakaraka Jupiter sits in House ${jupiter.rasiHouseNumber} (${jupiter.signName}, ${jupiter.dignity}), supporting creative legacy and nurturing mentorship.`,
    favorableDashas: findDashasForHouses(chart, [5, 9, 11], ['Jupiter']),
    insights: [
      `5th house carries ${savAt(5)} SAV bindus; 9th house carries ${savAt(9)} SAV bindus.`,
      `Classical texts look for supportive transit of Jupiter over 5th/9th or Natal Moon during 5th-lord Dashas.`,
    ],
  };

  // 6. LIFE PATH, LONGEVITY & SPIRITUALITY
  const elemCounts = { Fire: 0, Earth: 0, Air: 0, Water: 0 };
  const nineBodies = [sun, moon, mars, mercury, jupiter, venus, saturn, rahu, ketu];
  for (const b of nineBodies) {
    elemCounts[SIGNS[b.signIndex].element] += 1;
  }
  const elements = {
    Fire: Math.round((elemCounts.Fire / 9) * 100),
    Earth: Math.round((elemCounts.Earth / 9) * 100),
    Air: Math.round((elemCounts.Air / 9) * 100),
    Water: Math.round((elemCounts.Water / 9) * 100),
  };

  const sattvaCount = [sun, moon, jupiter].filter((p) => ['Exalted', 'Moolatrikona', 'Own Sign', 'Great Friend', 'Friend'].includes(p.dignity)).length + 1;
  const rajasCount = [mercury, venus].length + (mars.rasiHouseNumber <= 10 ? 1 : 0);
  const tamasCount = [mars, saturn, rahu, ketu].length;
  const gSum = sattvaCount + rajasCount + tamasCount;
  const gunas = {
    Sattva: Math.round((sattvaCount / gSum) * 100),
    Rajas: Math.round((rajasCount / gSum) * 100),
    Tamas: Math.round((tamasCount / gSum) * 100),
  };

  const l8 = getLord(8);
  const l1 = getLord(1);
  const birthMs = chart.utcMs;
  const yrMs = 365.2425 * 86_400_000;
  const getPhaseDashas = (ageStart: number, ageEnd: number) => {
    const tStart = birthMs + ageStart * yrMs;
    const tEnd = birthMs + ageEnd * yrMs;
    return chart.vimshottari
      .filter((m) => m.endMs > tStart && m.startMs < tEnd)
      .map((m) => m.lord)
      .join(' → ');
  };

  const lifePath: LifePathAstrologyReport = {
    elements,
    gunas,
    longevityResilience: `Lagna lord ${l1.id} (Shadbala ${chart.shadbala.find((s) => s.planet === l1.id)?.ratio.toFixed(2)}×), 8th lord ${l8.id} in House ${l8.rasiHouseNumber}, and Saturn in House ${saturn.rasiHouseNumber} indicate ${[1, 4, 5, 7, 8, 9, 10].includes(l8.rasiHouseNumber) ? 'strong constitutional endurance (Purna Ayur pattern)' : 'resilience bolstered by steady daily habits'}.`,
    spiritualPathNote: `D20 Vimsamsa Lagna is ${SIGNS[chart.divisionalCharts.D20.lagnaSignIndex].name}; Ketu in House ${ketu.rasiHouseNumber} (${ketu.signName}) points to natural meditative insight and inner detachment.`,
    chapters: [
      {
        phase: 'Youth & Foundation',
        ageRange: 'Ages 0–24',
        dashas: getPhaseDashas(0, 24),
        focus: 'Foundational conditioning, early schooling, and discovering core temperament.',
      },
      {
        phase: 'Prime Building & Responsibility',
        ageRange: 'Ages 24–48',
        dashas: getPhaseDashas(24, 48),
        focus: 'Career establishment, family commitments, wealth creation, and testing ambitions.',
      },
      {
        phase: 'Maturity, Mentorship & Legacy',
        ageRange: 'Ages 48–75+',
        dashas: getPhaseDashas(48, 75),
        focus: 'Consolidating wisdom, mentoring others, institutional leadership, and spiritual clarity.',
      },
    ],
    insights: [
      `Dominant Element: ${Object.entries(elements).sort((a, b) => b[1] - a[1])[0][0]}; Guna focus: ${Object.entries(gunas).sort((a, b) => b[1] - a[1])[0][0]}.`,
      `Moksha Trikona (Houses 4, 8, 12) hosts ${chart.planets.filter((p) => [4, 8, 12].includes(p.rasiHouseNumber)).map((p) => p.id).join(', ') || 'subtle reflective karma'}.`,
    ],
  };

  // 7. MEDICAL / DISEASE ASTROLOGY
  const vataRaw = elemCounts.Air * 2 + (saturn.rasiHouseNumber === 1 ? 2 : 1) + (mercury.rasiHouseNumber === 1 ? 1 : 0);
  const pittaRaw = elemCounts.Fire * 2 + (sun.rasiHouseNumber === 1 || mars.rasiHouseNumber === 1 ? 2 : 1);
  const kaphaRaw = (elemCounts.Earth + elemCounts.Water) + (moon.rasiHouseNumber === 1 || jupiter.rasiHouseNumber === 1 ? 2 : 1);
  const dTot = vataRaw + pittaRaw + kaphaRaw;
  const doshaBalance = {
    vata: Math.round((vataRaw / dTot) * 100),
    pitta: Math.round((pittaRaw / dTot) * 100),
    kapha: Math.round((kaphaRaw / dTot) * 100),
  };
  const sortedDoshas = [
    ['Vata', doshaBalance.vata],
    ['Pitta', doshaBalance.pitta],
    ['Kapha', doshaBalance.kapha],
  ].sort((a, b) => (b[1] as number) - (a[1] as number));
  const dominantPrakriti = `${sortedDoshas[0][0]}–${sortedDoshas[1][0]} Constitution`;

  const vulnerableZones: VulnerableZone[] = [];
  for (let h = 1; h <= 12; h++) {
    const signIdx = (ascSign + h - 1) % 12;
    const sav = savAt(h);
    const malefics = chart.planets.filter(
      (p) =>
        p.rasiHouseNumber === h &&
        (['Saturn', 'Mars', 'Rahu', 'Ketu'].includes(p.id) || p.dignity === 'Debilitated' || p.isCombust)
    );
    const isDusthana = [6, 8, 12].includes(h);
    if (malefics.length > 0 || sav < 25 || isDusthana) {
      const triggers: string[] = [];
      if (isDusthana) triggers.push(`House ${h} (Roga/Ayur/Vyaya)`);
      if (malefics.length) triggers.push(`occupied by ${malefics.map((m) => `${m.id}${m.dignity === 'Debilitated' ? ' (Deb)' : ''}`).join(', ')}`);
      if (sav < 25) triggers.push(`low SAV (${sav} bindus)`);

      const body = KALAPURUSHA_BODY[signIdx];
      vulnerableZones.push({
        house: h,
        signName: SIGNS[signIdx].name,
        anatomicalRegion: body.region,
        trigger: triggers.join(' · '),
        preventiveCare: body.care,
      });
    }
  }

  const medical: MedicalAstrologyReport = {
    disclaimer:
      'Educational Jyotish & Ayurvedic constitutional insights only — never a substitute for licensed medical diagnosis or clinical treatment.',
    doshaBalance,
    dominantPrakriti,
    d6ShashthamsaNote: `D6 Shashthamsa Lagna is ${SIGNS[chart.divisionalCharts.D6.lagnaSignIndex].name}; 6th lord ${l6.id} sits in House ${l6.rasiHouseNumber} (${l6.dignity}).`,
    vulnerableZones: vulnerableZones.slice(0, 6),
    wellnessGuidance: [
      `Balance ${sortedDoshas[0][0]} tendencies with seasonal routine, consistent sleep, and mindful digestion.`,
      `Give special preventive attention during Dashas of House 6/8/12 lords (${l6.id}, ${l8.id}, ${getLord(12).id}).`,
    ],
  };

  // 8. OTHER BRANCHES: ASTRO-VASTU, TARA BALA, WESTERN-VEDIC BRIDGE
  const vastuDirs: Array<{ dir: string; house: number; planet: string; goodTip: string; careTip: string }> = [
    { dir: 'East', house: 1, planet: 'Sun', goodTip: 'Bright natural morning light supports vitality & confidence.', careTip: 'Keep East windows open and free of heavy dark clutter.' },
    { dir: 'North-East (Ishanya)', house: 9, planet: 'Jupiter', goodTip: 'Clean, quiet North-East zone nurtures clarity, study & fortune.', careTip: 'Keep North-East uncluttered, clean, and light.' },
    { dir: 'North', house: 4, planet: 'Mercury', goodTip: 'Supports study, accounting, and peaceful domestic flow.', careTip: 'Organize desks/books neatly on the North side.' },
    { dir: 'North-West (Vayavya)', house: 11, planet: 'Moon', goodTip: 'Smooth social networking, travel, and liquid cash flow.', careTip: 'Ensure fresh ventilation in the North-West.' },
    { dir: 'South-East (Agneya)', house: 5, planet: 'Venus', goodTip: 'Warm kitchen vitality, creative harmony & digestive warmth.', careTip: 'Keep cooking/electrical areas tidy and dry.' },
    { dir: 'South', house: 10, planet: 'Mars', goodTip: 'Supports career drive, courage & recognition.', careTip: 'Avoid stagnant clutter in the South workspace zone.' },
    { dir: 'South-West (Nairutya)', house: 7, planet: 'Rahu', goodTip: 'Grounds partnerships, stability, and heavy storage.', careTip: 'Place heavier furniture in South-West for stability.' },
    { dir: 'West', house: 7, planet: 'Saturn', goodTip: 'Supports enduring contracts, discipline & steady gains.', careTip: 'Maintain orderly storage in the West.' },
  ];

  const astroVastu: AstroVastuZone[] = vastuDirs.map((v) => {
    const sav = savAt(v.house);
    const signIdx = (ascSign + v.house - 1) % 12;
    const status: AstroVastuZone['status'] = sav >= 30 ? 'Strong' : sav >= 25 ? 'Balanced' : 'Needs Care';
    return {
      direction: v.dir,
      planet: v.planet,
      house: v.house,
      signName: SIGNS[signIdx].name,
      status,
      tip: status === 'Needs Care' ? v.careTip : v.goodTip,
    };
  });

  const taraNames = [
    'Janma (Neutral)',
    'Sampat (Wealth — Auspicious)',
    'Vipat (Obstacle — Caution)',
    'Kshema (Well-being — Auspicious)',
    'Pratyak (Friction — Caution)',
    'Sadhana (Achievement — Auspicious)',
    'Naidhana (Testing — Avoid)',
    'Mitra (Friendly — Auspicious)',
    'Parama Mitra (Very Auspicious)',
  ];
  const goodTaraIdx = new Set([1, 3, 5, 7, 8]);
  const taraBalaSummary: TaraBalaItem[] = NAKSHATRAS.map((nak) => {
    const tIdx = ((nak.index - moon.nakshatraIndex + 27) % 27) % 9;
    return {
      nakshatra: nak.name,
      taraName: taraNames[tIdx],
      isAuspicious: goodTaraIdx.has(tIdx),
    };
  });

  const other: OtherBranchesReport = {
    astroVastu,
    taraBalaSummary,
    westernVedicBridge: {
      siderealSun: `${sun.signName} ${sun.shortDms}`,
      tropicalSun: tropSignLabel(sun.tropicalLongitude),
      siderealMoon: `${moon.signName} ${moon.shortDms}`,
      tropicalMoon: tropSignLabel(moon.tropicalLongitude),
      siderealAsc: `${chart.ascendant.signName} ${chart.ascendant.shortDms}`,
      tropicalAsc: tropSignLabel(chart.ascendant.tropicalLongitude),
      note: `Sidereal (Nirayana) coordinates shift backward by Ayanamsa (${chart.ayanamsaDms}) relative to Western Tropical (Sayana) signs, aligning with the fixed constellations.`,
    },
  };

  return {
    financial,
    education,
    career,
    marriage,
    intimacy: buildIntimacyProfile(chart),
    child,
    lifePath,
    medical,
    other,
  };
}
