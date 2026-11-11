import { NAKSHATRAS, NATURAL_FRIENDSHIP, SIGNS } from './constants';
import { findActiveDashaPath } from './dasha';
import { buildIntimacyProfile } from './predictions/intimacy';
import { evaluateParamayusStatus } from './predictions/paramayus';
import type {
  ChartData,
  KootaScore,
  KundaliMatchPillar,
  MatchMakingResult,
  PapaSamyamSummary,
  SexualCompatibilityReport,
} from './types';

// Yoni enmity table (0 = hostile, 1 = neutral, 2 = friendly, 3 = very friendly, 4 = same)
const YONI_ENEMIES: Array<[string, string]> = [
  ['Horse', 'Buffalo'],
  ['Elephant', 'Lion'],
  ['Sheep', 'Monkey'],
  ['Serpent', 'Mongoose'],
  ['Dog', 'Deer'],
  ['Cat', 'Rat'],
  ['Cow', 'Tiger'],
];

function scoreYoni(y1: string, g1: 'M' | 'F', y2: string, g2: 'M' | 'F'): number {
  if (y1 === y2) return g1 !== g2 ? 4 : 3;
  const isEnemy = YONI_ENEMIES.some(
    ([a, b]) => (a === y1 && b === y2) || (a === y2 && b === y1)
  );
  if (isEnemy) return 0;
  return 2;
}

const VARNA_RANK: Record<string, number> = {
  Brahmin: 4,
  Kshatriya: 3,
  Vaishya: 2,
  Shudra: 1,
};

function scoreVashya(v1: string, v2: string): number {
  if (v1 === v2) return 2;
  if (
    (v1 === 'Human' && (v2 === 'Quadruped' || v2 === 'Aquatic')) ||
    (v2 === 'Human' && (v1 === 'Quadruped' || v1 === 'Aquatic'))
  ) {
    return 1;
  }
  if (
    (v1 === 'Wild' && (v2 === 'Quadruped' || v2 === 'Human')) ||
    (v2 === 'Wild' && (v1 === 'Quadruped' || v1 === 'Human'))
  ) {
    return 0.5;
  }
  return 1;
}

function getManglikStatus(chart: ChartData): { isManglik: boolean; houses: number[]; note: string } {
  const mars = chart.planets.find((p) => p.id === 'Mars')!;
  const moon = chart.planets.find((p) => p.id === 'Moon')!;
  const venus = chart.planets.find((p) => p.id === 'Venus')!;
  const hLagna = mars.rasiHouseNumber;
  const hMoon = ((mars.signIndex - moon.signIndex + 12) % 12) + 1;
  const hVenus = ((mars.signIndex - venus.signIndex + 12) % 12) + 1;
  const manglikHouses = [1, 2, 4, 7, 8, 12];
  const hitLagna = manglikHouses.includes(hLagna);
  const hitMoon = manglikHouses.includes(hMoon);
  const hitVenus = manglikHouses.includes(hVenus);

  const houses: number[] = [];
  if (hitLagna) houses.push(hLagna);
  if (hitMoon && !houses.includes(hMoon)) houses.push(hMoon);

  const isManglik = hitLagna;
  const note = hitLagna
    ? `Mars in H${hLagna} from Lagna${hitMoon ? `, H${hMoon} from Moon` : ''}${hitVenus ? `, H${hVenus} from Venus` : ''}`
    : hitMoon || hitVenus
      ? `Mild (Mars in H${hitMoon ? hMoon : hVenus} from ${hitMoon ? 'Moon' : 'Venus'} only)`
      : 'Non-Manglik';
  return { isManglik, houses, note };
}

/**
 * Computes traditional Kerala/North-Indian Papa-Samyam points
 * across Lagna, Moon, and Venus for Mars, Saturn, Sun, Rahu, and Ketu in houses 1, 2, 4, 7, 8, 12.
 */
function computePapaPoints(chart: ChartData): number {
  const malefics = ['Mars', 'Saturn', 'Sun', 'Rahu', 'Ketu'];
  const papaHouses = new Set([1, 2, 4, 7, 8, 12]);
  const moonSign = chart.planets.find((p) => p.id === 'Moon')!.signIndex;
  const venusSign = chart.planets.find((p) => p.id === 'Venus')!.signIndex;
  const refs = [chart.ascendant.signIndex, moonSign, venusSign];
  const weights = [1.0, 0.5, 0.25];

  let total = 0;
  for (let r = 0; r < refs.length; r++) {
    for (const mId of malefics) {
      const m = chart.planets.find((p) => p.id === mId)!;
      const h = ((m.signIndex - refs[r] + 12) % 12) + 1;
      if (papaHouses.has(h)) {
        total += (mId === 'Mars' ? 1.5 : 1.0) * weights[r];
      }
    }
  }
  return Math.round(total * 10) / 10;
}

function axisHarmony(signA: number, signB: number): { dist: number; label: string; score: number } {
  const dist = ((signB - signA + 12) % 12) + 1;
  if (dist === 1 || dist === 7) return { dist, label: `${dist}/${dist === 1 ? 1 : 7} (Same / Opposite)`, score: 85 };
  if (dist === 5 || dist === 9) return { dist, label: '5/9 Trinal Harmony', score: 92 };
  if (dist === 3 || dist === 11) return { dist, label: '3/11 Growth & Friendship', score: 82 };
  if (dist === 4 || dist === 10) return { dist, label: '4/10 Angular Complement', score: 74 };
  if (dist === 6 || dist === 8) return { dist, label: '6/8 Shadashtaka (Requires Patience)', score: 48 };
  return { dist, label: '2/12 Dwirdwadasha (Adjustment)', score: 56 };
}

function planetDigBonus(dig: string): number {
  const m: Record<string, number> = {
    Exalted: 18,
    Moolatrikona: 15,
    'Own Sign': 14,
    'Great Friend': 10,
    Friend: 6,
    Neutral: 2,
    Enemy: -5,
    'Great Enemy': -8,
    Debilitated: -10,
  };
  return m[dig] ?? 0;
}

function clamp100(n: number): number {
  return Math.max(25, Math.min(97, Math.round(n)));
}

function buildSexualCompatibility(
  bride: ChartData,
  groom: ChartData,
  yoniPts: number
): SexualCompatibilityReport {
  const bInt = buildIntimacyProfile(bride);
  const gInt = buildIntimacyProfile(groom);

  const bVen = bride.planets.find((p) => p.id === 'Venus')!;
  const bMar = bride.planets.find((p) => p.id === 'Mars')!;
  const gVen = groom.planets.find((p) => p.id === 'Venus')!;
  const gMar = groom.planets.find((p) => p.id === 'Mars')!;

  const crossLinks: string[] = [];
  const checkCross = (p1Name: string, s1: number, p2Name: string, s2: number) => {
    const d = ((s2 - s1 + 12) % 12) + 1;
    if ([1, 5, 7, 9].includes(d)) {
      crossLinks.push(`${p1Name} forms a ${d === 1 ? 'conjunction' : `${d}th aspect`} with ${p2Name} (strong magnetic chemistry)`);
    }
  };
  checkCross("Partner A's Venus", bVen.signIndex, "Partner B's Mars", gMar.signIndex);
  checkCross("Partner B's Venus", gVen.signIndex, "Partner A's Mars", bMar.signIndex);
  checkCross("Partner A's Venus", bVen.signIndex, "Partner B's Venus", gVen.signIndex);
  checkCross("Partner A's Mars", bMar.signIndex, "Partner B's Mars", gMar.signIndex);

  // 12th (Shayana Sukha) & 8th (deep intimacy) synastry overlay
  const bVenInG = ((bVen.signIndex - groom.ascendant.signIndex + 12) % 12) + 1;
  const gVenInB = ((gVen.signIndex - bride.ascendant.signIndex + 12) % 12) + 1;
  const bMarInG = ((bMar.signIndex - groom.ascendant.signIndex + 12) % 12) + 1;
  const gMarInB = ((gMar.signIndex - bride.ascendant.signIndex + 12) % 12) + 1;

  const romanticHouseSet = new Set([1, 5, 7, 8, 12]);
  const overlayHits = [bVenInG, gVenInB, bMarInG, gMarInB].filter((h) => romanticHouseSet.has(h)).length;

  const driveDiff = Math.abs(bInt.passionDriveScore - gInt.passionDriveScore);
  const rawScore = clamp100(
    55 +
      yoniPts * 4.5 +
      crossLinks.length * 8 +
      overlayHits * 4 -
      (driveDiff > 22 ? 10 : driveDiff > 12 ? 4 : -4)
  );

  const chemistryLevel: SexualCompatibilityReport['chemistryLevel'] =
    rawScore >= 80
      ? 'Magnetic & Passionate'
      : rawScore >= 65
        ? 'Harmonious & Affectionate'
        : rawScore >= 50
          ? 'Complementary (Needs Communication)'
          : 'Different Rhythms';

  const shayanaAndEighthNote = `Partner A's Venus lands in Partner B's House ${bVenInG} (Mars in H${bMarInG}); Partner B's Venus lands in Partner A's House ${gVenInB} (Mars in H${gMarInB}). Overlays in Houses 1, 5, 7, 8, and 12 (Shayana Sukha) directly spark mutual physical closeness.`;

  const yoniAndLibidoNote = `Yoni Koota = ${yoniPts}/4. Drive comparison: Partner A ${bInt.passionDriveScore}/100 (${bInt.eroticArchetype}) vs Partner B ${gInt.passionDriveScore}/100 (${gInt.eroticArchetype}).`;

  const guidance =
    driveDiff > 18
      ? 'Noticeable difference in assertive drive vs receptive pacing — open dialogue around timing, emotional safety, and shared rest builds deep physical satisfaction.'
      : 'Closely aligned sensual and passionate rhythms support natural chemistry; nurturing emotional closeness keeps bedroom fulfillment vibrant over decades.';

  return {
    score: rawScore,
    chemistryLevel,
    venusMarsCrossLinks:
      crossLinks.length > 0
        ? crossLinks
        : ['Attraction flows primarily through Moon/Lagna emotional warmth and steady companionship rather than fiery Mars–Venus friction.'],
    shayanaAndEighthNote,
    yoniAndLibidoNote,
    brideArchetype: bInt.eroticArchetype,
    groomArchetype: gInt.eroticArchetype,
    brideDrive: bInt.passionDriveScore,
    groomDrive: gInt.passionDriveScore,
    guidance,
  };
}

/**
 * Computes full Kundali Matching:
 * 1) 36-point Ashtakoota Guna Milan
 * 2) Full D1 Lagna/Moon/7th & D9 Navamsa Synastry
 * 3) Papa-Samyam Malefic Balance
 * 4) Sexual, Passion & Shayana Sukha Compatibility
 * 5) Progeny (D7), Finance, Longevity & Dasha Sync
 */
export function computeAshtakoota(bride: ChartData, groom: ChartData): MatchMakingResult {
  const pA = evaluateParamayusStatus(bride);
  const pB = evaluateParamayusStatus(groom);
  if (pA.exceeded || pB.exceeded) {
    const lock = pA.exceeded ? pA : pB;
    return {
      totalObtained: 0,
      totalMax: 36,
      verdict: lock.titleEn,
      kootas: [],
      brideManglik: { isManglik: false, houses: [], note: lock.titleEn },
      groomManglik: { isManglik: false, houses: [], note: lock.titleEn },
      manglikCompatible: false,
      kundaliScore: 0,
      combinedVerdict: lock.messageEn,
      papaSamyam: {
        bridePapaPoints: 0,
        groomPapaPoints: 0,
        status: 'Balanced',
        note: lock.noteEn,
      },
      sexualCompatibility: {
        score: 0,
        chemistryLevel: 'Different Rhythms',
        venusMarsCrossLinks: [],
        shayanaAndEighthNote: lock.messageEn,
        yoniAndLibidoNote: '',
        brideArchetype: '-',
        groomArchetype: '-',
        brideDrive: 0,
        groomDrive: 0,
        guidance: lock.noteEn,
      },
      kundaliPillars: [],
      paramayusLocked: {
        exceeded: true,
        titleEn: lock.titleEn,
        titleHi: lock.titleHi,
        messageEn: lock.messageEn,
        messageHi: lock.messageHi,
      },
    };
  }

  const bMoon = bride.planets.find((p) => p.id === 'Moon')!;
  const gMoon = groom.planets.find((p) => p.id === 'Moon')!;

  const bSign = SIGNS[bMoon.signIndex];
  const gSign = SIGNS[gMoon.signIndex];
  const bNak = NAKSHATRAS[bMoon.nakshatraIndex];
  const gNak = NAKSHATRAS[gMoon.nakshatraIndex];

  // 1. Varna (1 pt)
  const varnaPts = VARNA_RANK[gSign.varna] >= VARNA_RANK[bSign.varna] ? 1 : 0;
  // 2. Vashya (2 pts)
  const vashyaPts = scoreVashya(bSign.vashya, gSign.vashya);
  // 3. Tara (3 pts)
  const tara1 = ((gMoon.nakshatraIndex - bMoon.nakshatraIndex + 27) % 27) % 9;
  const tara2 = ((bMoon.nakshatraIndex - gMoon.nakshatraIndex + 27) % 27) % 9;
  const badTaras = new Set([2, 4, 6]);
  const taraPts =
    !badTaras.has(tara1) && !badTaras.has(tara2)
      ? 3
      : !badTaras.has(tara1) || !badTaras.has(tara2)
        ? 1.5
        : 0;
  // 4. Yoni (4 pts)
  const yoniPts = scoreYoni(bNak.yoni, bNak.yoniGender, gNak.yoni, gNak.yoniGender);
  // 5. Graha Maitri (5 pts)
  const bLord = bSign.lord;
  const gLord = gSign.lord;
  let maitriPts = 0;
  if (bLord === gLord) {
    maitriPts = 5;
  } else {
    const r1 = NATURAL_FRIENDSHIP[bLord][gLord];
    const r2 = NATURAL_FRIENDSHIP[gLord][bLord];
    if (r1 === 1 && r2 === 1) maitriPts = 5;
    else if ((r1 === 1 && r2 === 0) || (r1 === 0 && r2 === 1)) maitriPts = 4;
    else if (r1 === 0 && r2 === 0) maitriPts = 3;
    else if ((r1 === 1 && r2 === -1) || (r1 === -1 && r2 === 1)) maitriPts = 1;
    else if ((r1 === 0 && r2 === -1) || (r1 === -1 && r2 === 0)) maitriPts = 0.5;
  }
  // 6. Gana (6 pts)
  let ganaPts = 0;
  if (bNak.gana === gNak.gana) ganaPts = 6;
  else if (
    (bNak.gana === 'Deva' && gNak.gana === 'Manushya') ||
    (bNak.gana === 'Manushya' && gNak.gana === 'Deva')
  ) {
    ganaPts = 5;
  } else if (gNak.gana === 'Deva' && bNak.gana === 'Rakshasa') {
    ganaPts = 1;
  }
  // 7. Bhakoot (7 pts)
  const bDist = ((gMoon.signIndex - bMoon.signIndex + 12) % 12) + 1;
  const badBhakoot = [2, 5, 6, 8, 9, 12].includes(bDist);
  const bhakootCancelled = bLord === gLord || maitriPts >= 4;
  const bhakootPts = !badBhakoot ? 7 : bhakootCancelled ? 7 : 0;
  // 8. Nadi (8 pts)
  const nadiCancelled =
    bNak.nadi === gNak.nadi &&
    ((bMoon.signIndex === gMoon.signIndex && bMoon.nakshatraIndex !== gMoon.nakshatraIndex) ||
      (bMoon.nakshatraIndex === gMoon.nakshatraIndex && bMoon.pada !== gMoon.pada));
  const nadiPts = bNak.nadi !== gNak.nadi ? 8 : nadiCancelled ? 4 : 0;

  const kootas: KootaScore[] = [
    { name: 'Varna', sanskrit: 'Temperament', maxPoints: 1, obtainedPoints: varnaPts, brideValue: bSign.varna, groomValue: gSign.varna, status: varnaPts === 1 ? 'Good' : 'Average', note: varnaPts === 1 ? 'Compatible work & spiritual outlook.' : 'Differing social temperament.' },
    { name: 'Vashya', sanskrit: 'Magnetism', maxPoints: 2, obtainedPoints: vashyaPts, brideValue: bSign.vashya, groomValue: gSign.vashya, status: vashyaPts >= 1.5 ? 'Good' : vashyaPts >= 1 ? 'Average' : 'Caution', note: 'Mutual attraction and psychological pull.' },
    { name: 'Tara', sanskrit: 'Destiny Sync', maxPoints: 3, obtainedPoints: taraPts, brideValue: bNak.name, groomValue: gNak.name, status: taraPts >= 2.5 ? 'Good' : taraPts >= 1.5 ? 'Average' : 'Caution', note: 'Birth star synchronization.' },
    { name: 'Yoni', sanskrit: 'Physical & Intimacy', maxPoints: 4, obtainedPoints: yoniPts, brideValue: `${bNak.yoni} (${bNak.yoniGender})`, groomValue: `${gNak.yoni} (${gNak.yoniGender})`, status: yoniPts >= 3 ? 'Good' : yoniPts >= 2 ? 'Average' : 'Caution', note: 'Instinctive sensual compatibility.' },
    { name: 'Graha Maitri', sanskrit: 'Mental Friendship', maxPoints: 5, obtainedPoints: maitriPts, brideValue: `${bSign.name} (${bLord})`, groomValue: `${gSign.name} (${gLord})`, status: maitriPts >= 4 ? 'Good' : maitriPts >= 2.5 ? 'Average' : 'Caution', note: 'Planetary friendship of Moon lords.' },
    { name: 'Gana', sanskrit: 'Nature & Conduct', maxPoints: 6, obtainedPoints: ganaPts, brideValue: bNak.gana, groomValue: gNak.gana, status: ganaPts >= 5 ? 'Good' : ganaPts >= 1 ? 'Average' : 'Caution', note: 'Everyday reaction harmony.' },
    { name: 'Bhakoot', sanskrit: 'Family & Flow', maxPoints: 7, obtainedPoints: bhakootPts, brideValue: bSign.name, groomValue: gSign.name, status: bhakootPts === 7 ? 'Good' : 'Caution', note: badBhakoot && bhakootCancelled ? `Rasi distance ${bDist} mitigated by Moon-lord friendship.` : badBhakoot ? `Challenging Rasi relation (${bDist}/${14 - bDist} axis).` : 'Supportive relative Rasi placement.' },
    { name: 'Nadi', sanskrit: 'Vitality & Lineage', maxPoints: 8, obtainedPoints: nadiPts, brideValue: bNak.nadi, groomValue: gNak.nadi, status: nadiPts === 8 ? 'Good' : nadiPts > 0 ? 'Average' : 'Caution', note: nadiCancelled ? 'Same Nadi partially mitigated by distinct Nakshatra/Pada.' : bNak.nadi === gNak.nadi ? 'Nadi Dosha present (same Nadi).' : 'Distinct Nadis — strong physiological harmony.' },
  ];

  const totalObtained = Math.round(kootas.reduce((acc, k) => acc + k.obtainedPoints, 0) * 10) / 10;
  let verdict = 'Challenging Gun Milan (< 18)';
  if (totalObtained >= 28) verdict = 'Excellent Gun Milan (28–36)';
  else if (totalObtained >= 21) verdict = 'Very Good Gun Milan (21–27.5)';
  else if (totalObtained >= 18) verdict = 'Acceptable Gun Milan (18–20.5)';

  // Full Kundali Structural Matching beyond Gun Milan
  const brideManglik = getManglikStatus(bride);
  const groomManglik = getManglikStatus(groom);
  const manglikCompatible = brideManglik.isManglik === groomManglik.isManglik;

  const bridePapa = computePapaPoints(bride);
  const groomPapa = computePapaPoints(groom);
  const papaDiff = Math.abs(bridePapa - groomPapa);
  const papaStatus: PapaSamyamSummary['status'] =
    papaDiff <= 1.25 ? 'Balanced' : papaDiff <= 2.5 ? 'Moderate Difference' : 'Asymmetric';
  const papaSamyam: PapaSamyamSummary = {
    bridePapaPoints: bridePapa,
    groomPapaPoints: groomPapa,
    status: papaStatus,
    note:
      papaStatus === 'Balanced'
        ? `Well-balanced malefic weight across Lagna/Moon/Venus (${bridePapa} vs ${groomPapa} points).`
        : `Malefic weight difference (${bridePapa} vs ${groomPapa}) calls for conscious patience and Kuja/Saturn harmony.`,
  };

  // Pillar 1: D1 Lagna & Moon Axis
  const lagnaAx = axisHarmony(bride.ascendant.signIndex, groom.ascendant.signIndex);
  const moonAx = axisHarmony(bMoon.signIndex, gMoon.signIndex);
  const d1AxisScore = clamp100((lagnaAx.score + moonAx.score) / 2);

  // Pillar 2: Navamsa (D9) & 7th House Strength
  const bD9Lagna = bride.divisionalCharts.D9.lagnaSignIndex;
  const gD9Lagna = groom.divisionalCharts.D9.lagnaSignIndex;
  const d9Ax = axisHarmony(bD9Lagna, gD9Lagna);
  const b7Lord = bride.planets.find((p) => p.id === SIGNS[(bride.ascendant.signIndex + 6) % 12].lord)!;
  const g7Lord = groom.planets.find((p) => p.id === SIGNS[(groom.ascendant.signIndex + 6) % 12].lord)!;
  const bD9Ven = bride.divisionalCharts.D9.placements.find((p) => p.id === 'Venus')!;
  const gD9Ven = groom.divisionalCharts.D9.placements.find((p) => p.id === 'Venus')!;
  const d9Score = clamp100(
    d9Ax.score * 0.55 +
      30 +
      (planetDigBonus(b7Lord.dignity) + planetDigBonus(g7Lord.dignity) + planetDigBonus(bD9Ven.dignity) + planetDigBonus(gD9Ven.dignity)) * 0.45
  );

  // Pillar 3: Progeny (D7), Finance & Longevity (H8)
  const bJupD7 = bride.divisionalCharts.D7.placements.find((p) => p.id === 'Jupiter')!;
  const gJupD7 = groom.divisionalCharts.D7.placements.find((p) => p.id === 'Jupiter')!;
  const bSav7 = bride.ashtakavarga.sarva[(bride.ascendant.signIndex + 6) % 12];
  const gSav7 = groom.ashtakavarga.sarva[(groom.ascendant.signIndex + 6) % 12];
  const stabilityScore = clamp100(
    62 +
      (planetDigBonus(bJupD7.dignity) + planetDigBonus(gJupD7.dignity)) * 0.4 +
      ((bSav7 + gSav7) / 2 - 28) * 1.2 +
      (papaStatus === 'Balanced' ? 8 : -6)
  );

  // Pillar 4: Dasha Synchronization (Current & Next 10 Years)
  const nowMs = Date.now();
  const bNow = findActiveDashaPath(bride.vimshottari, nowMs)[0]?.lord ?? 'Sun';
  const gNow = findActiveDashaPath(groom.vimshottari, nowMs)[0]?.lord ?? 'Sun';
  const bFuture = findActiveDashaPath(bride.vimshottari, nowMs + 5 * 365.2425 * 86_400_000)[0]?.lord ?? bNow;
  const gFuture = findActiveDashaPath(groom.vimshottari, nowMs + 5 * 365.2425 * 86_400_000)[0]?.lord ?? gNow;
  const dashaSyncScore = clamp100(
    68 + (bNow === gNow ? 6 : 4) + (manglikCompatible ? 6 : -5)
  );

  const sexualCompatibility = buildSexualCompatibility(bride, groom, yoniPts);

  const kundaliPillars: KundaliMatchPillar[] = [
    {
      title: 'D1 Lagna & Moon Axis Synastry',
      score: d1AxisScore,
      status: d1AxisScore >= 75 ? 'Strong' : d1AxisScore >= 58 ? 'Balanced' : 'Attention Needed',
      summary: `Lagna Axis: ${lagnaAx.label} · Moon Axis: ${moonAx.label}.`,
      details: [
        `Partner A Lagna: ${bride.ascendant.signName} | Partner B Lagna: ${groom.ascendant.signName}`,
        `Partner A Moon: ${bSign.name} | Partner B Moon: ${gSign.name}`,
      ],
    },
    {
      title: 'D9 Navamsa & 7th-House Marital Foundation',
      score: d9Score,
      status: d9Score >= 75 ? 'Strong' : d9Score >= 58 ? 'Balanced' : 'Attention Needed',
      summary: `D9 Lagnas (${SIGNS[bD9Lagna].name} & ${SIGNS[gD9Lagna].name}) form a ${d9Ax.label}.`,
      details: [
        `7th Lords: A = ${b7Lord.id} (${b7Lord.dignity}), B = ${g7Lord.id} (${g7Lord.dignity})`,
        `D9 Venus: A = ${bD9Ven.signName} (${bD9Ven.dignity}), B = ${gD9Ven.signName} (${gD9Ven.dignity})`,
      ],
    },
    {
      title: 'Sexual, Passion & Shayana Sukha Chemistry',
      score: sexualCompatibility.score,
      status: sexualCompatibility.score >= 72 ? 'Strong' : sexualCompatibility.score >= 55 ? 'Balanced' : 'Attention Needed',
      summary: `${sexualCompatibility.chemistryLevel} (${sexualCompatibility.score}/100).`,
      details: [
        ...sexualCompatibility.venusMarsCrossLinks,
        sexualCompatibility.shayanaAndEighthNote,
      ],
    },
    {
      title: 'Progeny (D7), Longevity (H8) & Financial Stability',
      score: stabilityScore,
      status: stabilityScore >= 72 ? 'Strong' : stabilityScore >= 55 ? 'Balanced' : 'Attention Needed',
      summary: `7th-house SAV support (${bSav7} & ${gSav7} bindus) paired with D7 Jupiter (${bJupD7.dignity} / ${gJupD7.dignity}).`,
      details: [
        papaSamyam.note,
        `Dasha Timeline Sync: Currently ${bNow} (A) & ${gNow} (B); in +5 yrs ${bFuture} (A) & ${gFuture} (B).`,
      ],
    },
  ];

  const gunaNormalized = (totalObtained / 36) * 100;
  const kundaliScore = clamp100(
    gunaNormalized * 0.25 +
      d1AxisScore * 0.2 +
      d9Score * 0.2 +
      sexualCompatibility.score * 0.15 +
      stabilityScore * 0.12 +
      dashaSyncScore * 0.08
  );

  const combinedVerdict =
    kundaliScore >= 78
      ? 'Highly Harmonious Kundali & Gun Match'
      : kundaliScore >= 64
        ? 'Favorable Match (Strong Chart Support)'
        : kundaliScore >= 50
          ? 'Balanced Match (Needs Mutual Awareness)'
          : 'Challenging Kundali Match (Review Carefully)';

  return {
    totalObtained,
    totalMax: 36,
    verdict,
    kootas,
    brideManglik,
    groomManglik,
    manglikCompatible,
    kundaliScore,
    combinedVerdict,
    papaSamyam,
    sexualCompatibility,
    kundaliPillars,
  };
}
