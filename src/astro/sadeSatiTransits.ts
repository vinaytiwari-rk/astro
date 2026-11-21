/**
 * sadeSatiTransits.ts
 * Sade Sati, Dhaiya (Kantaka / Small Panoti), Kantaka Shani & Ashtama Shani engine.
 *
 * Ephemeris reference:
 *   Saturn was at 0° Capricorn (signIndex 9) on 2020-01-24.
 *   Average speed: 0.03330°/day  →  1 sign (30°) in ~900.9 days ≈ 913 days (spec value used).
 */

import { ChartData, NineGrahaId } from './types';

// ─── Constants ────────────────────────────────────────────────────────────────

const SATURN_REF_MS = Date.UTC(2020, 0, 24);   // 2020-01-24 00:00 UTC
const SATURN_REF_DEG = 270;                     // 0° Capricorn = 270° from Aries
const SATURN_DEG_PER_DAY = 0.03330;            // average daily motion
const MS_PER_DAY = 86_400_000;
const SIGN_DAYS = 913;                          // days Saturn spends per sign (spec)

const SIGN_NAMES = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];
const SIGN_NAMES_HI = [
  'मेष', 'वृष', 'मिथुन', 'कर्क', 'सिंह', 'कन्या',
  'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुम्भ', 'मीन',
];

// Nakshatra lords (0-based, 27 nakshatras cycling: Ke Su Mo Ma Ra Ju Sa Me Ve…)
const NAKSHATRA_LORDS: NineGrahaId[] = [
  'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury',
  'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury',
  'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury',
];

// Sign rulers (0-based Aries..Pisces)
const SIGN_LORDS: NineGrahaId[] = [
  'Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury',
  'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter',
];

// ─── Exported Types ────────────────────────────────────────────────────────────

export type SadeSatiPhaseType = 'rising' | 'peak' | 'setting';
export type DhaiyaPhaseType   = 'ardhaashtama' | 'ashtama';
export type KantakaHouse      = 1 | 4 | 7 | 10;
export type MoortiType        = 'Swarna' | 'Rajat' | 'Tamra' | 'Loha';

export interface SadeSatiPhase {
  phaseType: 'sadeSati';
  charan: 1 | 2 | 3;
  charanLabel: 'Rising (Uday)' | 'Peak (Madhya)' | 'Setting (Asta)';
  charanLabelHi: 'उदय चरण' | 'मध्य चरण' | 'अस्त चरण';
  signIndex: number;
  signName: string;
  signNameHi: string;
  startDate: string;    // ISO date YYYY-MM-DD
  endDate: string;
  durationDays: number;
  intensityLevel: 1 | 2 | 3;
  affectedAreas: string[];
  classicalRemedy: string;
  hindiLabel: string;
}

export interface DhaiyaPhase {
  phaseType: 'dhaiya';
  subType: DhaiyaPhaseType;
  houseFromMoon: 4 | 8;
  signIndex: number;
  signName: string;
  signNameHi: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  intensityLevel: 1 | 2 | 3;
  affectedAreas: string[];
  classicalRemedy: string;
  hindiLabel: string;
}

export interface KantakaShaniPhase {
  phaseType: 'kantaka';
  kantakaHouse: KantakaHouse;         // 1, 4, 7, or 10 from Moon or Lagna
  reference: 'moon' | 'lagna';
  signIndex: number;
  signName: string;
  signNameHi: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  intensityLevel: 1 | 2 | 3;
  affectedAreas: string[];
  classicalRemedy: string;
  hindiLabel: string;
}

export interface MoortiNirnaya {
  moortiType: MoortiType;
  moortiHi: string;
  description: string;
  descriptionHi: string;
  transitSaturnNakshatraIndex: number;
  transitSaturnNakshatraName: string;
  moonNakshatraLordSign: number;
  relativePosition: number;  // 1..12
}

export interface SadeSatiCurrentStatus {
  isInSadeSati: boolean;
  isInDhaiya: boolean;
  isInKantaka: boolean;
  activeSadeSatiCharan?: 1 | 2 | 3;
  activeDhaiyaSubType?: DhaiyaPhaseType;
  activeKantakaHouse?: KantakaHouse;
  activeKantakaReference?: 'moon' | 'lagna';
  currentSaturnSignIndex: number;
  currentSaturnSignName: string;
  moonSignIndex: number;
  moonSignName: string;
  lagnaSignIndex: number;
  lagnaSignName: string;
  moortiNirnaya: MoortiNirnaya;
  statusSummaryEn: string;
  statusSummaryHi: string;
}

export interface SadeSatiReport {
  natalMoonSign: number;
  natalMoonSignName: string;
  natalLagnaSign: number;
  natalLagnaSignName: string;
  sadeSatiPhases: SadeSatiPhase[];
  dhaiyaPhases: DhaiyaPhase[];
  kantakaPhases: KantakaShaniPhase[];
  currentStatus: SadeSatiCurrentStatus;
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

/** Saturn's ecliptic longitude (0–360°) at a given timestamp */
function saturnLongitudeAt(ms: number): number {
  const daysDiff = (ms - SATURN_REF_MS) / MS_PER_DAY;
  const lon = SATURN_REF_DEG + SATURN_DEG_PER_DAY * daysDiff;
  return ((lon % 360) + 360) % 360;
}

/** Which zodiac sign (0-based) Saturn is in at ms */
function saturnSignAt(ms: number): number {
  return Math.floor(saturnLongitudeAt(ms) / 30);
}

/** Timestamp when Saturn enters a given sign index (working backward/forward from reference) */
function saturnEntersSignMs(targetSign: number): number {
  // Saturn enters targetSign when its longitude = targetSign * 30
  const targetLon = targetSign * 30;
  // Days from ref
  const days = (targetLon - SATURN_REF_DEG) / SATURN_DEG_PER_DAY;
  return SATURN_REF_MS + days * MS_PER_DAY;
}

/** Returns the nearest past/future entry date for a sign, within N full Saturn cycles */
function allSaturnEntries(
  targetSign: number,
  fromMs: number,
  toMs: number,
): Array<{ entryMs: number; exitMs: number }> {
  const results: Array<{ entryMs: number; exitMs: number }> = [];
  const CYCLE_MS = 29.5 * 365.25 * MS_PER_DAY; // ~29.5 yr cycle
  const baseEntryMs = saturnEntersSignMs(targetSign);

  // Find the entry within [fromMs - CYCLE_MS, toMs + CYCLE_MS]
  let entry = baseEntryMs;
  // Bring entry into the window
  while (entry > fromMs) entry -= CYCLE_MS;
  while (entry < fromMs - CYCLE_MS) entry += CYCLE_MS;

  // Now iterate forward through cycles
  while (entry < toMs + CYCLE_MS) {
    const exit = entry + SIGN_DAYS * MS_PER_DAY;
    if (exit >= fromMs && entry <= toMs) {
      results.push({ entryMs: entry, exitMs: exit });
    }
    entry += CYCLE_MS;
  }
  return results;
}

function msToIsoDate(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10);
}

function clampMs(ms: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, ms));
}

// ─── Affected areas & remedies by phase ───────────────────────────────────────

function sadeSatiAffectedAreas(charan: 1 | 2 | 3): string[] {
  if (charan === 1) return ['Finances', 'Career transitions', 'Mental restlessness', 'Family stress'];
  if (charan === 2) return ['Health challenges', 'Career setbacks', 'Relationship strain', 'Identity crisis'];
  return ['Gradual relief', 'Endings & new beginnings', 'Wisdom gained', 'Spiritual growth'];
}

function sadeSatiRemedy(charan: 1 | 2 | 3): string {
  if (charan === 1) return 'Recite Shani Stotra daily; donate black sesame on Saturdays; serve elders.';
  if (charan === 2) return 'Worship Lord Hanuman; light sesame oil lamp on Saturdays; Maha Mrityunjaya Japa.';
  return 'Chant Shani Beej Mantra (Om Praam Preem Praum Sah Shanaischaraya Namah); donate iron on Saturdays.';
}

function dhaiyaAffectedAreas(subType: DhaiyaPhaseType): string[] {
  if (subType === 'ardhaashtama') return ['Domestic life', 'Mother\'s health', 'Real estate', 'Comfort disrupted'];
  return ['Longevity challenges', 'Hidden enemies', 'Chronic health issues', 'Obstacles in career'];
}

function dhaiyaRemedy(subType: DhaiyaPhaseType): string {
  if (subType === 'ardhaashtama') return 'Pour water on Peepal tree on Saturdays; donate blue cloth; recite Shani Chalisa.';
  return 'Visit Shani temple every Saturday; donate black urad dal and mustard oil; chant Maha Mrityunjaya Mantra 108×.';
}

function kantakaAffectedAreas(house: KantakaHouse): string[] {
  const map: Record<KantakaHouse, string[]> = {
    1:  ['Personal health', 'Self-confidence', 'Reputation', 'Physical vitality'],
    4:  ['Home life', 'Mother', 'Vehicles', 'Comforts'],
    7:  ['Partnerships', 'Marriage', 'Business relations', 'Trade'],
    10: ['Career', 'Authority', 'Social standing', 'Profession'],
  };
  return map[house];
}

function kantakaRemedy(house: KantakaHouse): string {
  const map: Record<KantakaHouse, string> = {
    1:  'Wear Neelam (Blue Sapphire) only after proper testing; donate shoes on Saturday; serve Shiva.',
    4:  'Recite Hanuman Chalisa daily; donate land/property to needy; worship Devi Durga.',
    7:  'Chant "Om Sham Shanaischaraya Namah" 108× daily; keep fast on Saturdays; gift iron objects.',
    10: 'Bow to Shani idol; donate black sesame and black cloth; serve crows (feed them).',
  };
  return map[house];
}

// ─── Moorti Nirnaya ───────────────────────────────────────────────────────────

function computeMoortiNirnaya(
  transitSaturnSignIndex: number,
  natalMoonNakshatraIndex: number,
): MoortiNirnaya {
  const moonNakshatraLord = NAKSHATRA_LORDS[natalMoonNakshatraIndex];
  const lordSignIndex = SIGN_LORDS.findIndex(l => l === moonNakshatraLord);
  // find sign owned by that lord (use first occurrence)
  const moonNakshatraLordSign = lordSignIndex >= 0 ? lordSignIndex : 0;

  // Relative position of transit Saturn from Moon Nakshatra Lord's sign (1-based)
  const relPos = ((transitSaturnSignIndex - moonNakshatraLordSign + 12) % 12) + 1;

  let moortiType: MoortiType;
  let moortiHi: string;
  let description: string;
  let descriptionHi: string;

  if (relPos === 1 || relPos === 2 || relPos === 3) {
    moortiType = 'Swarna'; moortiHi = 'स्वर्ण (सोना)';
    description = 'Gold Moorti – Very auspicious Saturn transit. Gains, success, and blessings are indicated.';
    descriptionHi = 'स्वर्ण मूर्ति – अति शुभ शनि गोचर। लाभ, सफलता और आशीर्वाद की संभावना है।';
  } else if (relPos === 4 || relPos === 5 || relPos === 6) {
    moortiType = 'Rajat'; moortiHi = 'रजत (चाँदी)';
    description = 'Silver Moorti – Moderately auspicious. Some benefits and some challenges.';
    descriptionHi = 'रजत मूर्ति – सामान्य शुभ। कुछ लाभ और कुछ चुनौतियाँ।';
  } else if (relPos === 7 || relPos === 8 || relPos === 9) {
    moortiType = 'Tamra'; moortiHi = 'ताम्र (तांबा)';
    description = 'Copper Moorti – Mildly adverse. Health and mental stress likely. Remedies advised.';
    descriptionHi = 'ताम्र मूर्ति – हल्का अशुभ। स्वास्थ्य और मानसिक तनाव संभव। उपाय आवश्यक।';
  } else {
    moortiType = 'Loha'; moortiHi = 'लोह (लोहा)';
    description = 'Iron Moorti – Adverse Saturn period. Significant challenges. Remedies strongly advised.';
    descriptionHi = 'लोह मूर्ति – अशुभ शनि काल। गंभीर चुनौतियाँ। उपाय अत्यंत आवश्यक।';
  }

  // Nakshatra name for transit Saturn
  const transitNakIdx = Math.floor((transitSaturnSignIndex * 30) / (360 / 27));
  const nakshatraNames = [
    'Ashwini','Bharani','Krittika','Rohini','Mrigashirsha','Ardra','Punarvasu','Pushya','Ashlesha',
    'Magha','Purva Phalguni','Uttara Phalguni','Hasta','Chitra','Swati','Vishakha','Anuradha','Jyeshtha',
    'Mula','Purva Ashadha','Uttara Ashadha','Shravana','Dhanishtha','Shatabhisha','Purva Bhadrapada',
    'Uttara Bhadrapada','Revati',
  ];

  return {
    moortiType,
    moortiHi,
    description,
    descriptionHi,
    transitSaturnNakshatraIndex: transitNakIdx,
    transitSaturnNakshatraName: nakshatraNames[transitNakIdx] ?? 'Unknown',
    moonNakshatraLordSign,
    relativePosition: relPos,
  };
}

// ─── Main computation ─────────────────────────────────────────────────────────

export function computeSadeSatiPhases(chart: ChartData): SadeSatiReport {
  const moonPlanet = chart.planets.find(p => p.id === 'Moon');
  const moonSignIndex = moonPlanet?.signIndex ?? 0;
  const lagnaSignIndex = chart.ascendant.signIndex;

  const nowMs = Date.now();
  const lookBackMs  = nowMs - 10 * 365.25 * MS_PER_DAY;
  const lookAheadMs = nowMs + 20 * 365.25 * MS_PER_DAY;

  // ── Sade Sati Phases ────────────────────────────────────────────────────────
  const sadeSatiSignMap: Array<{ charan: 1 | 2 | 3; signIndex: number }> = [
    { charan: 1, signIndex: (moonSignIndex - 1 + 12) % 12 },
    { charan: 2, signIndex: moonSignIndex },
    { charan: 3, signIndex: (moonSignIndex + 1) % 12 },
  ];

  const charanLabels: Record<1|2|3, 'Rising (Uday)' | 'Peak (Madhya)' | 'Setting (Asta)'> = {
    1: 'Rising (Uday)', 2: 'Peak (Madhya)', 3: 'Setting (Asta)',
  };
  const charanLabelsHi: Record<1|2|3, 'उदय चरण' | 'मध्य चरण' | 'अस्त चरण'> = {
    1: 'उदय चरण', 2: 'मध्य चरण', 3: 'अस्त चरण',
  };
  const charanIntensity: Record<1|2|3, 1|2|3> = { 1: 2, 2: 3, 3: 1 };

  const sadeSatiPhases: SadeSatiPhase[] = [];
  for (const { charan, signIndex } of sadeSatiSignMap) {
    const occurrences = allSaturnEntries(signIndex, lookBackMs, lookAheadMs);
    for (const { entryMs, exitMs } of occurrences) {
      const clampedEntry = clampMs(entryMs, lookBackMs, lookAheadMs);
      const clampedExit  = clampMs(exitMs,  lookBackMs, lookAheadMs);
      sadeSatiPhases.push({
        phaseType: 'sadeSati',
        charan,
        charanLabel: charanLabels[charan],
        charanLabelHi: charanLabelsHi[charan],
        signIndex,
        signName: SIGN_NAMES[signIndex],
        signNameHi: SIGN_NAMES_HI[signIndex],
        startDate: msToIsoDate(clampedEntry),
        endDate:   msToIsoDate(clampedExit),
        durationDays: Math.round((clampedExit - clampedEntry) / MS_PER_DAY),
        intensityLevel: charanIntensity[charan],
        affectedAreas: sadeSatiAffectedAreas(charan),
        classicalRemedy: sadeSatiRemedy(charan),
        hindiLabel: `साढ़ेसाती – ${charanLabelsHi[charan]} (${SIGN_NAMES_HI[signIndex]})`,
      });
    }
  }
  sadeSatiPhases.sort((a, b) => a.startDate.localeCompare(b.startDate));

  // ── Dhaiya Phases ───────────────────────────────────────────────────────────
  const dhaiyaMap: Array<{ subType: DhaiyaPhaseType; houseFromMoon: 4 | 8; signIndex: number }> = [
    { subType: 'ardhaashtama', houseFromMoon: 4, signIndex: (moonSignIndex + 3) % 12 },
    { subType: 'ashtama',      houseFromMoon: 8, signIndex: (moonSignIndex + 7) % 12 },
  ];

  const dhaiyaPhases: DhaiyaPhase[] = [];
  for (const { subType, houseFromMoon, signIndex } of dhaiyaMap) {
    const occurrences = allSaturnEntries(signIndex, lookBackMs, lookAheadMs);
    for (const { entryMs, exitMs } of occurrences) {
      const clampedEntry = clampMs(entryMs, lookBackMs, lookAheadMs);
      const clampedExit  = clampMs(exitMs,  lookBackMs, lookAheadMs);
      dhaiyaPhases.push({
        phaseType: 'dhaiya',
        subType,
        houseFromMoon,
        signIndex,
        signName: SIGN_NAMES[signIndex],
        signNameHi: SIGN_NAMES_HI[signIndex],
        startDate: msToIsoDate(clampedEntry),
        endDate:   msToIsoDate(clampedExit),
        durationDays: Math.round((clampedExit - clampedEntry) / MS_PER_DAY),
        intensityLevel: subType === 'ashtama' ? 3 : 2,
        affectedAreas: dhaiyaAffectedAreas(subType),
        classicalRemedy: dhaiyaRemedy(subType),
        hindiLabel: subType === 'ardhaashtama'
          ? `ढय्या – अर्धाष्टम (${SIGN_NAMES_HI[signIndex]})`
          : `ढय्या – अष्टम (${SIGN_NAMES_HI[signIndex]})`,
      });
    }
  }
  dhaiyaPhases.sort((a, b) => a.startDate.localeCompare(b.startDate));

  // ── Kantaka Shani Phases ────────────────────────────────────────────────────
  // Kantaka positions from Moon (1,4,7,10) and from Lagna (1,4,7,10)
  const kantakaHouses: KantakaHouse[] = [1, 4, 7, 10];
  const kantakaPhases: KantakaShaniPhase[] = [];

  const kantakaIntensity: Record<KantakaHouse, 1|2|3> = { 1: 3, 4: 2, 7: 2, 10: 3 };

  for (const ref of ['moon', 'lagna'] as const) {
    const baseSign = ref === 'moon' ? moonSignIndex : lagnaSignIndex;
    for (const house of kantakaHouses) {
      const targetSign = (baseSign + house - 1) % 12;
      // Skip if this sign is already covered in sadeSati (avoid double listing for house 1 from moon)
      const occurrences = allSaturnEntries(targetSign, lookBackMs, lookAheadMs);
      for (const { entryMs, exitMs } of occurrences) {
        const clampedEntry = clampMs(entryMs, lookBackMs, lookAheadMs);
        const clampedExit  = clampMs(exitMs,  lookBackMs, lookAheadMs);
        kantakaPhases.push({
          phaseType: 'kantaka',
          kantakaHouse: house,
          reference: ref,
          signIndex: targetSign,
          signName: SIGN_NAMES[targetSign],
          signNameHi: SIGN_NAMES_HI[targetSign],
          startDate: msToIsoDate(clampedEntry),
          endDate:   msToIsoDate(clampedExit),
          durationDays: Math.round((clampedExit - clampedEntry) / MS_PER_DAY),
          intensityLevel: kantakaIntensity[house],
          affectedAreas: kantakaAffectedAreas(house),
          classicalRemedy: kantakaRemedy(house),
          hindiLabel: `कंटक शनि – ${ref === 'moon' ? 'चंद्र' : 'लग्न'} से ${house}वाँ (${SIGN_NAMES_HI[targetSign]})`,
        });
      }
    }
  }
  kantakaPhases.sort((a, b) => a.startDate.localeCompare(b.startDate));

  // ── Current status ──────────────────────────────────────────────────────────
  const currentStatus = getSadeSatiCurrentStatus(chart, nowMs);

  return {
    natalMoonSign: moonSignIndex,
    natalMoonSignName: SIGN_NAMES[moonSignIndex],
    natalLagnaSign: lagnaSignIndex,
    natalLagnaSignName: SIGN_NAMES[lagnaSignIndex],
    sadeSatiPhases,
    dhaiyaPhases,
    kantakaPhases,
    currentStatus,
  };
}

// ─── Current Status ───────────────────────────────────────────────────────────

export function getSadeSatiCurrentStatus(
  chart: ChartData,
  nowMs: number,
): SadeSatiCurrentStatus {
  const moonPlanet = chart.planets.find(p => p.id === 'Moon');
  const moonSignIndex  = moonPlanet?.signIndex ?? 0;
  const moonNakIdx     = moonPlanet?.nakshatraIndex ?? 0;
  const lagnaSignIndex = chart.ascendant.signIndex;

  const saturnSign = saturnSignAt(nowMs);

  // Sade Sati check
  let isInSadeSati = false;
  let activeSadeSatiCharan: 1 | 2 | 3 | undefined;
  const ssMap: Array<{ charan: 1|2|3; sign: number }> = [
    { charan: 1, sign: (moonSignIndex - 1 + 12) % 12 },
    { charan: 2, sign: moonSignIndex },
    { charan: 3, sign: (moonSignIndex + 1) % 12 },
  ];
  for (const { charan, sign } of ssMap) {
    if (saturnSign === sign) { isInSadeSati = true; activeSadeSatiCharan = charan; break; }
  }

  // Dhaiya check
  let isInDhaiya = false;
  let activeDhaiyaSubType: DhaiyaPhaseType | undefined;
  if (saturnSign === (moonSignIndex + 3) % 12) { isInDhaiya = true; activeDhaiyaSubType = 'ardhaashtama'; }
  if (saturnSign === (moonSignIndex + 7) % 12) { isInDhaiya = true; activeDhaiyaSubType = 'ashtama'; }

  // Kantaka check
  let isInKantaka = false;
  let activeKantakaHouse: KantakaHouse | undefined;
  let activeKantakaReference: 'moon' | 'lagna' | undefined;
  for (const ref of ['moon', 'lagna'] as const) {
    const base = ref === 'moon' ? moonSignIndex : lagnaSignIndex;
    for (const h of [1, 4, 7, 10] as KantakaHouse[]) {
      if (saturnSign === (base + h - 1) % 12) {
        isInKantaka = true;
        activeKantakaHouse = h;
        activeKantakaReference = ref;
        break;
      }
    }
    if (isInKantaka) break;
  }

  const moortiNirnaya = computeMoortiNirnaya(saturnSign, moonNakIdx);

  // Build summary
  let statusSummaryEn: string;
  let statusSummaryHi: string;
  if (isInSadeSati) {
    const labels = { 1: 'Rising (Uday)', 2: 'Peak (Madhya)', 3: 'Setting (Asta)' };
    const labelsHi = { 1: 'उदय चरण', 2: 'मध्य चरण', 3: 'अस्त चरण' };
    statusSummaryEn = `Currently in Sade Sati — ${labels[activeSadeSatiCharan!]} phase. Saturn in ${SIGN_NAMES[saturnSign]}.`;
    statusSummaryHi = `वर्तमान में साढ़ेसाती में हैं — ${labelsHi[activeSadeSatiCharan!]}। शनि ${SIGN_NAMES_HI[saturnSign]} में है।`;
  } else if (isInDhaiya) {
    const label = activeDhaiyaSubType === 'ardhaashtama' ? 'Ardhaashtama Dhaiya (4th)' : 'Ashtama Dhaiya (8th)';
    const labelHi = activeDhaiyaSubType === 'ardhaashtama' ? 'अर्धाष्टम ढय्या (4था)' : 'अष्टम ढय्या (8वाँ)';
    statusSummaryEn = `Currently in Dhaiya — ${label}. Saturn in ${SIGN_NAMES[saturnSign]}.`;
    statusSummaryHi = `वर्तमान में ढय्या में हैं — ${labelHi}। शनि ${SIGN_NAMES_HI[saturnSign]} में है।`;
  } else if (isInKantaka) {
    const ordEn = activeKantakaHouse === 1 ? '1st' : activeKantakaHouse === 4 ? '4th' : activeKantakaHouse === 7 ? '7th' : '10th';
    const ordHi = activeKantakaHouse === 1 ? 'प्रथम (1st)' : activeKantakaHouse === 4 ? 'चतुर्थ (4th)' : activeKantakaHouse === 7 ? 'सप्तम (7th)' : 'दशम (10th)';
    const refEn = activeKantakaReference === 'moon' ? 'Moon' : 'Lagna';
    const refHi = activeKantakaReference === 'moon' ? 'जन्म चंद्र' : 'जन्म लग्न';
    statusSummaryEn = `Currently in Kantaka Shani — ${ordEn} house from ${refEn}. Saturn in ${SIGN_NAMES[saturnSign]}.`;
    statusSummaryHi = `वर्तमान में कंटक शनि में हैं — ${refHi} से ${ordHi} भाव। शनि ${SIGN_NAMES_HI[saturnSign]} में है।`;
  } else {
    statusSummaryEn = `No major Shani transit affliction currently. Saturn in ${SIGN_NAMES[saturnSign]} — transiting ${12 - ((saturnSign - moonSignIndex + 12) % 12)}th from natal Moon.`;
    statusSummaryHi = `अभी कोई प्रमुख शनि गोचर दोष नहीं है। शनि ${SIGN_NAMES_HI[saturnSign]} में है।`;
  }

  return {
    isInSadeSati,
    isInDhaiya,
    isInKantaka,
    activeSadeSatiCharan,
    activeDhaiyaSubType,
    activeKantakaHouse,
    activeKantakaReference,
    currentSaturnSignIndex: saturnSign,
    currentSaturnSignName: SIGN_NAMES[saturnSign],
    moonSignIndex,
    moonSignName: SIGN_NAMES[moonSignIndex],
    lagnaSignIndex,
    lagnaSignName: SIGN_NAMES[lagnaSignIndex],
    moortiNirnaya,
    statusSummaryEn,
    statusSummaryHi,
  };
}
