import { NAKSHATRAS, SIGNS, VIMSHOTTARI_YEARS } from './constants';
import { normalizeDeg } from './time';
import type { ChartData, NineGrahaId } from './types';

// ─────────────────── Types ───────────────────

export type RelationshipType = 'marriage' | 'business' | 'parent_child' | 'friendship';

export interface CrossAspect {
  planet1: string;
  planet2: string;
  aspectType: string;
  orbDeg: number;
  nature: 'harmonious' | 'challenging' | 'neutral';
  interpretation: string;
}

export interface HouseOverlay {
  chart1Point: string;
  chart2House: number;
  significance: string;
}

export interface NadiPair {
  pair: [string, string];
  chart1Planet: string;
  chart2Planet: string;
  pairing: string;
  interpretation: string;
}

export interface SynastryReport {
  overallScore: number;
  strengthLabel: string;
  crossAspects: CrossAspect[];
  houseOverlays: HouseOverlay[];
  nadiPairs: NadiPair[];
  compositeInterpretation: { en: string; hi: string };
}

// ─────────────────── Helpers ───────────────────

/** Angular distance in degrees (0..180). */
function angDist(lon1: number, lon2: number): number {
  const d = Math.abs(normalizeDeg(lon1) - normalizeDeg(lon2)) % 360;
  return d > 180 ? 360 - d : d;
}

/** Signed angular distance in terms of houses (1..12) from lon1 to lon2 going forward. */
function forwardHouses(lon1: number, lon2: number): number {
  const diff = normalizeDeg(lon2 - lon1 + 360);
  return Math.floor(diff / 30) + 1; // 1..12
}

// Vedic aspect definitions
// Each planet casts certain aspects in addition to the universal 7th
// Returns list of aspect types that apply given the angular diff
interface AspectRule {
  planetId: string;
  extraHouses: number[]; // in addition to 7th (which all planets cast)
}

const SPECIAL_ASPECTS: AspectRule[] = [
  { planetId: 'Mars', extraHouses: [4, 8] },
  { planetId: 'Jupiter', extraHouses: [5, 9] },
  { planetId: 'Saturn', extraHouses: [3, 10] },
  { planetId: 'Rahu', extraHouses: [7] },
  { planetId: 'Ketu', extraHouses: [7] },
];

function getVedicAspects(
  planet1Id: string,
  lon1: number,
  planet2Id: string,
  lon2: number
): Array<{ aspectType: string; orbDeg: number }> {
  const results: Array<{ aspectType: string; orbDeg: number }> = [];

  // House number from planet1 to planet2
  const fwdHouse = forwardHouses(lon1, lon2);
  const dist = angDist(lon1, lon2);

  // All planets cast 7th aspect (opposition)
  const orbFor7th = Math.abs(dist - 180);
  if (orbFor7th <= 12) {
    results.push({ aspectType: '7th (Full)', orbDeg: orbFor7th });
  }

  // Check special aspects for planet1
  const rule = SPECIAL_ASPECTS.find((r) => r.planetId === planet1Id);
  if (rule) {
    for (const h of rule.extraHouses) {
      const targetDeg = (h - 1) * 30; // 0°, 90°, 120°, 180°, 240°, 270°
      const fwdDeg = normalizeDeg(lon2 - lon1 + 360);
      const orbForH = Math.min(
        Math.abs(fwdDeg - targetDeg),
        360 - Math.abs(fwdDeg - targetDeg)
      );
      if (orbForH <= 12) {
        results.push({ aspectType: `${h}th (${planet1Id})`, orbDeg: orbForH });
      }
    }
  }

  return results;
}

function aspectNature(
  planet1Id: string,
  planet2Id: string,
  aspectType: string
): 'harmonious' | 'challenging' | 'neutral' {
  const harmoniousPairs = [
    ['Jupiter', 'Moon'],
    ['Jupiter', 'Venus'],
    ['Jupiter', 'Sun'],
    ['Venus', 'Moon'],
    ['Sun', 'Moon'],
    ['Mercury', 'Jupiter'],
  ];
  const challengingPairs = [
    ['Sun', 'Saturn'],
    ['Moon', 'Saturn'],
    ['Mars', 'Saturn'],
    ['Mars', 'Moon'],
    ['Sun', 'Mars'],
    ['Rahu', 'Sun'],
    ['Rahu', 'Moon'],
    ['Ketu', 'Mars'],
  ];

  const pair = [planet1Id, planet2Id].sort().join('|');
  for (const h of harmoniousPairs) {
    if (h.sort().join('|') === pair) return 'harmonious';
  }
  for (const c of challengingPairs) {
    if (c.sort().join('|') === pair) return 'challenging';
  }
  return 'neutral';
}

function aspectInterpretation(
  p1: string,
  p2: string,
  aspectType: string,
  nature: 'harmonious' | 'challenging' | 'neutral'
): string {
  if (nature === 'harmonious') {
    return `${p1}–${p2} ${aspectType} creates mutual support and growth between the individuals.`;
  }
  if (nature === 'challenging') {
    return `${p1}–${p2} ${aspectType} brings tension and karmic challenges that require conscious work.`;
  }
  return `${p1}–${p2} ${aspectType} is a neutral connection that depends on other chart factors.`;
}

// ─────────────────── House Overlay Logic ───────────────────

function getOverlaySignificance(chart1Point: string, chart2House: number): string {
  const map: Record<string, Record<number, string>> = {
    Asc: {
      1: 'Chart1 Lagna falls in Chart2\'s 1st — strong self-identity resonance.',
      7: 'Chart1 Lagna in Chart2\'s 7th — powerful attraction and partnership potential. ★★★',
      5: 'Chart1 Lagna in Chart2\'s 5th — joy, romance, and creative energy.',
      11: 'Chart1 Lagna in Chart2\'s 11th — friendship and fulfillment of wishes.',
      4: 'Chart1 Lagna in Chart2\'s 4th — emotional security and home-making.',
    },
    Jupiter: {
      2: 'Chart1 Jupiter in Chart2\'s 2nd — financial blessings and family values. ★★',
      5: 'Chart1 Jupiter in Chart2\'s 5th — children, education, and wisdom blessings. ★★',
      9: 'Chart1 Jupiter in Chart2\'s 9th — dharmic alignment and spiritual growth. ★★',
      11: 'Chart1 Jupiter in Chart2\'s 11th — expanding each other\'s prosperity and networks.',
    },
    Venus: {
      1: 'Chart1 Venus in Chart2\'s 1st — beauty, charm, and affectionate energy.',
      7: 'Chart1 Venus in Chart2\'s 7th — strong romantic and marital compatibility. ★★',
      5: 'Chart1 Venus in Chart2\'s 5th — romance, pleasure, and creative harmony.',
      2: 'Chart1 Venus in Chart2\'s 2nd — shared values around beauty and wealth.',
    },
    Moon: {
      4: 'Chart1 Moon in Chart2\'s 4th — deep emotional nurturing and domestic comfort.',
      7: 'Chart1 Moon in Chart2\'s 7th — emotional dependence and deep bonding.',
      1: 'Chart1 Moon in Chart2\'s 1st — intuitive understanding of each other\'s nature.',
    },
    Sun: {
      1: 'Chart1 Sun in Chart2\'s 1st — inspiring the other\'s sense of identity.',
      7: 'Chart1 Sun in Chart2\'s 7th — the partner activates the other\'s purpose.',
      10: 'Chart1 Sun in Chart2\'s 10th — public recognition and career support.',
    },
  };

  const pointMap = map[chart1Point];
  if (pointMap && pointMap[chart2House]) return pointMap[chart2House];
  return `Chart1 ${chart1Point} in Chart2\'s H${chart2House} — general influence and energy exchange.`;
}

// ─────────────────── Nadi Pairs ───────────────────

const NADI_PAIRS: Array<{ pair: [string, string]; pairing: string; note: string }> = [
  { pair: ['Sun', 'Saturn'], pairing: 'Karma/Authority', note: 'karma and authority conflict or resolution' },
  { pair: ['Jupiter', 'Venus'], pairing: 'Teacher/Student', note: 'wisdom and beauty — guru-shishya dynamic' },
  { pair: ['Mars', 'Ketu'], pairing: 'Warrior/Mystic', note: 'action and dissolution — powerful for spiritual pursuits' },
  { pair: ['Moon', 'Saturn'], pairing: 'Emotion/Discipline', note: 'emotional patterns shaped by discipline and responsibility' },
  { pair: ['Mercury', 'Rahu'], pairing: 'Intellect/Ambition', note: 'sharp intelligence amplified by worldly ambition' },
];

// ─────────────────── Composite Score ───────────────────

function computeCompositeScore(
  chart1: ChartData,
  chart2: ChartData,
  crossAspects: CrossAspect[],
  houseOverlays: HouseOverlay[],
  relType: RelationshipType
): number {
  let score = 50; // base

  const c1Moon = chart1.planets.find((p) => p.id === 'Moon');
  const c2Moon = chart2.planets.find((p) => p.id === 'Moon');
  const c1Venus = chart1.planets.find((p) => p.id === 'Venus');
  const c2Venus = chart2.planets.find((p) => p.id === 'Venus');
  const c1Jupiter = chart1.planets.find((p) => p.id === 'Jupiter');
  const c2Jupiter = chart2.planets.find((p) => p.id === 'Jupiter');
  const c1Mercury = chart1.planets.find((p) => p.id === 'Mercury');
  const c2Mercury = chart2.planets.find((p) => p.id === 'Mercury');
  const c1Saturn = chart1.planets.find((p) => p.id === 'Saturn');
  const c2Saturn = chart2.planets.find((p) => p.id === 'Saturn');
  const c1Sun = chart1.planets.find((p) => p.id === 'Sun');
  const c2Sun = chart2.planets.find((p) => p.id === 'Sun');

  const hasHarmonious = (p1: string, p2: string) =>
    crossAspects.some(
      (a) => a.nature === 'harmonious' && ((a.planet1 === p1 && a.planet2 === p2) || (a.planet1 === p2 && a.planet2 === p1))
    );

  if (relType === 'marriage') {
    // 7th house overlays
    const h7Overlays = houseOverlays.filter((o) => o.chart2House === 7);
    score += h7Overlays.length * 5;
    // Moon-Venus aspects
    if (hasHarmonious('Moon', 'Venus')) score += 8;
    // Sun-Moon cross
    if (c1Sun && c2Moon) {
      const d = angDist(c1Sun.longitude, c2Moon.longitude);
      if (d < 15) score += 10;
    }
    if (c2Sun && c1Moon) {
      const d = angDist(c2Sun.longitude, c1Moon.longitude);
      if (d < 15) score += 10;
    }
    // Nadi Koota: different nadis is good
    if (c1Moon && c2Moon) {
      const n1 = NAKSHATRAS[c1Moon.nakshatraIndex];
      const n2 = NAKSHATRAS[c2Moon.nakshatraIndex];
      if (n1 && n2 && n1.nadi !== n2.nadi) score += 8;
    }
  } else if (relType === 'business') {
    // 10th house overlays
    const h10Overlays = houseOverlays.filter((o) => o.chart2House === 10);
    score += h10Overlays.length * 5;
    // Mercury-Jupiter aspects
    if (hasHarmonious('Mercury', 'Jupiter')) score += 8;
    // Saturn support (Saturn in 10th or 11th from each other)
    if (c1Saturn && c2Saturn) {
      const h = forwardHouses(c1Saturn.longitude, c2Saturn.longitude);
      if ([10, 11, 3].includes(h)) score += 6;
    }
  } else if (relType === 'parent_child') {
    // 4th/5th house overlays
    const h45Overlays = houseOverlays.filter((o) => [4, 5].includes(o.chart2House));
    score += h45Overlays.length * 5;
    // Jupiter-Moon aspects
    if (hasHarmonious('Jupiter', 'Moon')) score += 10;
    if (c1Jupiter && c2Moon) {
      const d = angDist(c1Jupiter.longitude, c2Moon.longitude);
      if (d < 20) score += 6;
    }
  } else {
    // friendship
    const h11Overlays = houseOverlays.filter((o) => o.chart2House === 11);
    score += h11Overlays.length * 5;
    // Venus-Jupiter aspects
    if (hasHarmonious('Venus', 'Jupiter')) score += 10;
    if (c1Venus && c2Jupiter) {
      const d = angDist(c1Venus.longitude, c2Jupiter.longitude);
      if (d < 20) score += 6;
    }
  }

  // Harmonious aspects bonus
  const harmCount = crossAspects.filter((a) => a.nature === 'harmonious').length;
  const challCount = crossAspects.filter((a) => a.nature === 'challenging').length;
  score += harmCount * 2 - challCount * 1.5;

  return Math.max(0, Math.min(100, Math.round(score)));
}

function strengthLabel(score: number): string {
  if (score >= 80) return 'Exceptional';
  if (score >= 65) return 'Strong';
  if (score >= 50) return 'Moderate';
  if (score >= 35) return 'Needs Attention';
  return 'Challenging';
}

// ─────────────────── Main Export ───────────────────

export function computeSynastry(
  chart1: ChartData,
  chart2: ChartData,
  relationshipType: RelationshipType
): SynastryReport {
  const NINE_GRAHA_IDS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

  // Cross-Chart Planetary Aspects
  const crossAspects: CrossAspect[] = [];
  const c1Planets = chart1.planets.filter((p) => NINE_GRAHA_IDS.includes(p.id));
  const c2Planets = chart2.planets.filter((p) => NINE_GRAHA_IDS.includes(p.id));

  for (const p1 of c1Planets) {
    for (const p2 of c2Planets) {
      const aspects = getVedicAspects(p1.id, p1.longitude, p2.id, p2.longitude);
      for (const asp of aspects) {
        const nature = aspectNature(p1.id, p2.id, asp.aspectType);
        crossAspects.push({
          planet1: p1.id,
          planet2: p2.id,
          aspectType: asp.aspectType,
          orbDeg: parseFloat(asp.orbDeg.toFixed(2)),
          nature,
          interpretation: aspectInterpretation(p1.id, p2.id, asp.aspectType, nature),
        });
      }
    }
  }

  // House Overlay Analysis
  const houseOverlays: HouseOverlay[] = [];
  const c1Points: Array<{ id: string; longitude: number }> = [
    { id: 'Asc', longitude: chart1.ascendant.longitude },
    ...c1Planets.map((p) => ({ id: p.id, longitude: p.longitude })),
  ];

  for (const point of c1Points) {
    // Determine which house of chart2 this point falls in
    const c2Lagna = chart2.ascendant.longitude;
    const relDeg = normalizeDeg(point.longitude - c2Lagna + 360);
    const chart2House = Math.floor(relDeg / 30) + 1; // 1..12 (whole-sign overlay)
    houseOverlays.push({
      chart1Point: point.id,
      chart2House,
      significance: getOverlaySignificance(point.id, chart2House),
    });
  }

  // Nadi Pairs
  const nadiPairs: NadiPair[] = [];
  for (const nadiDef of NADI_PAIRS) {
    const [pid1, pid2] = nadiDef.pair;
    // Check both cross-directions
    const c1p1 = chart1.planets.find((p) => p.id === pid1);
    const c2p2 = chart2.planets.find((p) => p.id === pid2);
    if (c1p1 && c2p2) {
      nadiPairs.push({
        pair: nadiDef.pair,
        chart1Planet: `Chart1 ${pid1}`,
        chart2Planet: `Chart2 ${pid2}`,
        pairing: nadiDef.pairing,
        interpretation: `Chart1's ${pid1} pairs with Chart2's ${pid2}: ${nadiDef.note}.`,
      });
    }
    const c1p2 = chart1.planets.find((p) => p.id === pid2);
    const c2p1 = chart2.planets.find((p) => p.id === pid1);
    if (c1p2 && c2p1) {
      nadiPairs.push({
        pair: [pid2, pid1],
        chart1Planet: `Chart1 ${pid2}`,
        chart2Planet: `Chart2 ${pid1}`,
        pairing: nadiDef.pairing,
        interpretation: `Chart1's ${pid2} pairs with Chart2's ${pid1}: ${nadiDef.note}.`,
      });
    }
  }

  // Composite Score
  const overallScore = computeCompositeScore(chart1, chart2, crossAspects, houseOverlays, relationshipType);
  const label = strengthLabel(overallScore);

  const relLabels: Record<RelationshipType, { en: string; hi: string }> = {
    marriage: { en: 'marriage', hi: 'विवाह' },
    business: { en: 'business partnership', hi: 'व्यापारिक साझेदारी' },
    parent_child: { en: 'parent-child bond', hi: 'माता-पिता और बच्चे का बंधन' },
    friendship: { en: 'friendship', hi: 'मित्रता' },
  };

  const compositeInterpretation = {
    en: `The synastry score for ${relLabels[relationshipType].en} is ${overallScore}/100 (${label}). ` +
      `${crossAspects.filter((a) => a.nature === 'harmonious').length} harmonious and ` +
      `${crossAspects.filter((a) => a.nature === 'challenging').length} challenging cross-aspects were found. ` +
      `Key overlays: ${houseOverlays.slice(0, 3).map((o) => `${o.chart1Point}→H${o.chart2House}`).join(', ')}.`,
    hi: `${relLabels[relationshipType].hi} के लिए सिनेस्ट्री स्कोर ${overallScore}/100 (${label}) है। ` +
      `${crossAspects.filter((a) => a.nature === 'harmonious').length} सौहार्दपूर्ण और ` +
      `${crossAspects.filter((a) => a.nature === 'challenging').length} चुनौतीपूर्ण क्रॉस-दृष्टियाँ मिलीं।`,
  };

  return {
    overallScore,
    strengthLabel: label,
    crossAspects,
    houseOverlays,
    nadiPairs,
    compositeInterpretation,
  };
}
