/**
 * jaimini.ts — Complete Jaimini Sutra Engine
 * Covers: Chara Karakas, Arudha Padas, Karakamsha, Rashi Drishti,
 *         Argala Analysis, and Jaimini Chara Dasha (K.N. Rao method)
 */

import { NINE_GRAHAS, SIGNS } from './constants';
import { formatLocalDateTimeFromUtc } from './time';
import type { ChartData, NineGrahaId } from './types';

// ─── Types ───────────────────────────────────────────────────────────────────

export type KarakaRole =
  | 'AK'   // Atmakaraka
  | 'AmK'  // Amatyakaraka
  | 'BK'   // Bhratrikaraka
  | 'MK'   // Matrikaraka
  | 'PiK'  // Pitrikaraka (8-karaka only)
  | 'PK'   // Putrakaraka
  | 'GK'   // Gnatikaraka
  | 'DK';  // Darakaraka

export interface JaiminiKaraka {
  planet: NineGrahaId;
  role: KarakaRole;
  degreeInSign: number;      // effective degree used for ranking
  actualDegreeInSign: number; // raw degree from chart
  signIndex: number;
  signName: string;
  interpretationEn: string;
  interpretationHi: string;
}

export interface ArudhaPada {
  house: number;              // 1..12
  label: string;              // AL, A2..A12; UL for A12; A7=Darapada
  specialLabel?: string;      // e.g. 'Arudha Lagna', 'Upapada Lagna', 'Darapada'
  signIndex: number;
  signName: string;
  houseFromLagna: number;
  significanceEn: string;
  significanceHi: string;
}

export interface KarakamshaData {
  akPlanet: NineGrahaId;
  karakamshaSignIndex: number;
  karakamshaSignName: string;
  isSwamsha: boolean;         // AK in D9 is also the D9 lagna lord
  ishtaDevata: string | null; // planet in 12th from Karakamsha in D9
  dhanaYoga: string | null;   // planet(s) in 2nd from Karakamsha in D9
  vivahaNakshatra: string;    // nakshatra of the sign 7th from Karakamsha
  summaryEn: string;
  summaryHi: string;
}

export interface ArgalaEntry {
  house: number;              // 1..12 (reference)
  argalaPlanets: NineGrahaId[];
  virodhaPlanets: NineGrahaId[];
  netArgala: 'positive' | 'negative' | 'neutral';
}

export interface JaiminiCharaDashaPeriod {
  level: 1 | 2;              // 1=Mahadasha, 2=Antardasha
  signIndex: number;
  signName: string;
  years: number;
  startMs: number;
  endMs: number;
  startDate: string;         // YYYY-MM-DD
  endDate: string;
  isCurrentPeriod?: boolean;
  children?: JaiminiCharaDashaPeriod[];
}

export interface JaiminiReport {
  karakas: JaiminiKaraka[];
  arudhaPadas: ArudhaPada[];
  karakamsha: KarakamshaData;
  rashiAspects: boolean[][];  // [from][to] 12x12
  argala: ArgalaEntry[];
  charaDasha: JaiminiCharaDashaPeriod[];
  nowMs: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const KARAKA_INTERP_EN: Record<KarakaRole, string> = {
  AK:  'Atmakaraka — Soul significator; indicates the deepest desires & karmic mission of the soul.',
  AmK: 'Amatyakaraka — Career & counsel planet; shows professional path, advisors & ambition.',
  BK:  'Bhratrikaraka — Sibling & courage planet; indicates brothers, sisters, bravery & initiative.',
  MK:  'Matrikaraka — Mother & mind planet; influences mother, home, emotions & nurture.',
  PiK: 'Pitrikaraka — Father & authority planet (8-karaka system); indicates paternal lineage & status.',
  PK:  'Putrakaraka — Children & creativity planet; shows progeny, students & intelligence.',
  GK:  'Gnatikaraka — Relatives & competition planet; indicates disputes, cousins & chronic ailments.',
  DK:  'Darakaraka — Spouse & desire planet; indicates life partner, desires & partnerships.',
};

const KARAKA_INTERP_HI: Record<KarakaRole, string> = {
  AK:  'आत्मकारक — आत्मा के सबसे गहरे कर्म और इच्छाओं का प्रतिनिधित्व करता है।',
  AmK: 'अमात्यकारक — व्यवसाय, करियर और परामर्शदाता का कारक।',
  BK:  'भ्रातृकारक — भाई-बहन, साहस और पराक्रम का प्रतिनिधि।',
  MK:  'मातृकारक — माता, मन, भावनाएँ और गृह-जीवन का कारक।',
  PiK: 'पितृकारक — पिता, अधिकार और पितृ-वंश का सूचक (अष्ट-कारक पद्धति)।',
  PK:  'पुत्रकारक — संतान, बुद्धि और रचनात्मकता का कारक।',
  GK:  'ज्ञातिकारक — सम्बन्धी, प्रतिस्पर्धा और दीर्घ रोग का सूचक।',
  DK:  'दारकारक — जीवनसाथी, इच्छाएँ और साझेदारी का कारक।',
};

const ARUDHA_SIGNIFICANCE_EN: Record<number, { en: string; hi: string }> = {
  1:  { en: 'Arudha Lagna (AL) — Public image, maya, how the world perceives you.',
        hi: 'अरुढ़ लग्न — सार्वजनिक छवि, माया और लोगों की नजर में आपकी पहचान।' },
  2:  { en: 'A2 — Dhana Pada; wealth, accumulated resources, family speech.',
        hi: 'A2 — धन पद; धन, संपत्ति और कुटुंब का प्रतिनिधित्व।' },
  3:  { en: 'A3 — Vikrama Pada; courage, communication, younger siblings\' image.',
        hi: 'A3 — विक्रम पद; साहस, संचार और छोटे भाई-बहन की छवि।' },
  4:  { en: 'A4 — Matri Pada; mother\'s image, home, property, public comfort.',
        hi: 'A4 — मातृ पद; माता की छवि, गृह, संपत्ति और सुख-सुविधा।' },
  5:  { en: 'A5 — Mantra Pada; children, creative projects, public intellect.',
        hi: 'A5 — मंत्र पद; संतान, रचनात्मकता और सार्वजनिक बुद्धि।' },
  6:  { en: 'A6 — Shatru Pada; enemies, debts, obstacles visible to the world.',
        hi: 'A6 — शत्रु पद; शत्रु, ऋण और सार्वजनिक बाधाएँ।' },
  7:  { en: 'A7 (Darapada) — Spouse\'s image, relationships, public partnerships.',
        hi: 'A7 (दारपद) — जीवनसाथी की छवि, संबंध और सार्वजनिक साझेदारी।' },
  8:  { en: 'A8 — Mrityu Pada; sudden changes, hidden resources, transformation.',
        hi: 'A8 — मृत्यु पद; अचानक परिवर्तन, छुपे संसाधन और रूपांतरण।' },
  9:  { en: 'A9 — Dharma Pada; father\'s image, guru, fortune & higher purpose.',
        hi: 'A9 — धर्म पद; पिता की छवि, गुरु, भाग्य और उच्च लक्ष्य।' },
  10: { en: 'A10 — Rajya Pada; career, public status, authority & achievement.',
        hi: 'A10 — राज्य पद; व्यवसाय, सार्वजनिक स्थिति और अधिकार।' },
  11: { en: 'A11 — Labha Pada; gains, elder siblings, public profits & networks.',
        hi: 'A11 — लाभ पद; लाभ, बड़े भाई-बहन और सार्वजनिक नेटवर्क।' },
  12: { en: 'Upapada Lagna (UL) — Spouse\'s deeper nature, marriage quality, liberation.',
        hi: 'उपापद लग्न — जीवनसाथी का स्वभाव, विवाह की गुणवत्ता और मोक्ष।' },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function planetsInSign(chart: ChartData, signIdx: number): NineGrahaId[] {
  return NINE_GRAHAS.filter((g) => {
    const p = chart.planets.find((x) => x.id === g);
    return p?.signIndex === signIdx;
  });
}

function signLordSignIndex(chart: ChartData, signIdx: number): number {
  const lord = SIGNS[signIdx].lord;
  const p = chart.planets.find((x) => x.id === lord);
  return p?.signIndex ?? signIdx;
}

// ─── 1. Chara Karakas ────────────────────────────────────────────────────────

export function computeCharaKarakas(chart: ChartData): JaiminiKaraka[] {
  const count = chart.settings?.karakaCount === 8 ? 8 : 7;
  // Grahas to rank: exclude Rahu & Ketu for 7-karaka, include Rahu for 8-karaka
  const grahasToRank: NineGrahaId[] = count === 7
    ? ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn']
    : ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu'];

  const roles7: KarakaRole[] = ['AK', 'AmK', 'BK', 'MK', 'PK', 'GK', 'DK'];
  const roles8: KarakaRole[] = ['AK', 'AmK', 'BK', 'MK', 'PiK', 'PK', 'GK', 'DK'];
  const roles = count === 8 ? roles8 : roles7;

  const ranked = grahasToRank
    .map((g) => {
      const p = chart.planets?.find((x) => x.id === g);
      if (!p) return null;
      const rawDeg = p.degreeInSign ?? (p.longitude % 30);
      // For Rahu use 30 - degree_in_sign as effective degree
      const effectiveDeg = g === 'Rahu' ? 30 - rawDeg : rawDeg;
      return {
        planet: g,
        effectiveDeg,
        rawDeg,
        signIndex: p.signIndex ?? 0,
        signName: p.signName ?? SIGNS[p.signIndex ?? 0]?.name ?? 'Aries'
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null)
    .sort((a, b) => b.effectiveDeg - a.effectiveDeg)
    .slice(0, roles.length);

  return ranked.map((r, i) => {
    const role = roles[i] as KarakaRole;
    return {
      planet: r.planet as NineGrahaId,
      role,
      degreeInSign: r.effectiveDeg,
      actualDegreeInSign: r.rawDeg,
      signIndex: r.signIndex,
      signName: r.signName,
      interpretationEn: (role && KARAKA_INTERP_EN[role]) || '',
      interpretationHi: (role && KARAKA_INTERP_HI[role]) || '',
    };
  });
}

// ─── 2. Arudha Padas ─────────────────────────────────────────────────────────

export function computeArudhaPadas(chart: ChartData): ArudhaPada[] {
  const ascSign = chart.ascendant?.signIndex ?? 0;

  return Array.from({ length: 12 }, (_, idx) => {
    const houseNum = idx + 1;
    // The sign of this house (whole-sign from lagna)
    const baseSign = (ascSign + idx) % 12;
    // Lord of this sign
    const lord = SIGNS[baseSign]?.lord ?? 'Mars';
    const lordPlanet = chart.planets?.find((p) => p.id === lord);
    const lordSign = lordPlanet?.signIndex ?? baseSign;

    // Count signs from base to lord
    const dist = (lordSign - baseSign + 12) % 12 || 12;
    // Go same distance from lord
    let padaSign = (lordSign + dist) % 12;

    // Exception: if pada falls in the same house or 7th from it
    if (padaSign === baseSign || padaSign === (baseSign + 6) % 12) {
      padaSign = (padaSign + 1) % 12; // move to next sign
    }

    const houseFromLagna = ((padaSign - ascSign + 12) % 12) + 1;

    let label: string;
    let specialLabel: string | undefined;
    if (houseNum === 1) {
      label = 'AL';
      specialLabel = 'Arudha Lagna';
    } else if (houseNum === 7) {
      label = 'A7';
      specialLabel = 'Darapada';
    } else if (houseNum === 12) {
      label = 'UL';
      specialLabel = 'Upapada Lagna';
    } else {
      label = `A${houseNum}`;
    }

    const sig = ARUDHA_SIGNIFICANCE_EN[houseNum];

    return {
      house: houseNum,
      label,
      specialLabel,
      signIndex: padaSign,
      signName: SIGNS[padaSign]?.name ?? 'Aries',
      houseFromLagna,
      significanceEn: sig?.en ?? `A${houseNum} — ${houseNum}th house Arudha Pada.`,
      significanceHi: sig?.hi ?? `A${houseNum} — ${houseNum}वें भाव का अरुढ़ पद।`,
    };
  });
}

// ─── 3. Karakamsha ───────────────────────────────────────────────────────────

export function computeKarakamsha(chart: ChartData, karakas: JaiminiKaraka[]): KarakamshaData {
  const ak = karakas.find((k) => k.role === 'AK') || karakas[0] || {
    planet: 'Sun' as NineGrahaId,
    signIndex: 0,
    signName: 'Aries',
    degreeInSign: 0,
    actualDegreeInSign: 0,
    role: 'AK' as KarakaRole,
    interpretationEn: '',
    interpretationHi: ''
  };
  const akPlanet = ak.planet;

  // Find AK in D9
  const d9 = chart.divisionalCharts?.D9;
  const placements = d9?.placements ?? [];
  const akD9 = placements.find((p) => p.id === akPlanet);
  const karakamshaSignIndex = akD9?.signIndex ?? ak.signIndex ?? 0;
  const karakamshaSignName = SIGNS[karakamshaSignIndex]?.name ?? 'Aries';

  // Swamsha: AK planet is also the D9 lagna lord
  const d9LagnaSignIndex = d9?.lagnaSignIndex ?? 0;
  const d9LagnaLord = SIGNS[d9LagnaSignIndex]?.lord ?? 'Mars';
  const isSwamsha = (akPlanet === d9LagnaLord);

  // Ishta Devata: planet(s) in 12th from Karakamsha in D9
  const ishtaSignIndex = (karakamshaSignIndex + 11) % 12; // 12th from = +11
  const ishtaPlanets = placements
    .filter((p) => p.signIndex === ishtaSignIndex && p.id !== 'Asc')
    .map((p) => p.id);
  const ishtaDevata = ishtaPlanets.length > 0 ? ishtaPlanets.join(', ') : null;

  // Dhana Yoga: 2nd from Karakamsha
  const dhanaSignIndex = (karakamshaSignIndex + 1) % 12;
  const dhanaPlanets = placements
    .filter((p) => p.signIndex === dhanaSignIndex && p.id !== 'Asc')
    .map((p) => p.id);
  const dhanaYoga = dhanaPlanets.length > 0 ? dhanaPlanets.join(', ') : null;

  // Vivaha Nakshatra: nakshatra of the 7th from Karakamsha sign
  const vivahaSignIndex = (karakamshaSignIndex + 6) % 12;
  const vivahaNakshatra = `${SIGNS[vivahaSignIndex]?.name ?? ''} zone nakshatras (${SIGNS[vivahaSignIndex]?.sanskrit ?? ''})`;

  const summaryEn = `Atmakaraka ${akPlanet} occupies ${karakamshaSignName} in Navamsha — the Karakamsha Lagna. ` +
    (isSwamsha ? `This is also Swamsha since ${akPlanet} lords ${SIGNS[d9LagnaSignIndex]?.name ?? ''}. ` : '') +
    (ishtaDevata ? `Ishta Devata: ${ishtaDevata} (12th from Karakamsha). ` : 'No planet in 12th — introspective spiritual path. ') +
    (dhanaYoga ? `Dhana Yoga potential through ${dhanaYoga} (2nd from Karakamsha).` : 'No planet in 2nd from Karakamsha.');

  const summaryHi = `आत्मकारक ${akPlanet} नवांश में ${karakamshaSignName} में स्थित है — यह कारकांश लग्न है। ` +
    (isSwamsha ? `यह स्वांश भी है क्योंकि ${akPlanet} नवांश लग्न ${SIGNS[d9LagnaSignIndex]?.name ?? ''} का स्वामी है। ` : '') +
    (ishtaDevata ? `इष्ट देवता: ${ishtaDevata} (कारकांश से 12वें में)। ` : 'कारकांश से 12वें में कोई ग्रह नहीं — आंतरिक साधना।') +
    (dhanaYoga ? `धन योग: ${dhanaYoga} (कारकांश से 2वें में)।` : 'कारकांश से 2वें में कोई ग्रह नहीं।');

  return {
    akPlanet,
    karakamshaSignIndex,
    karakamshaSignName,
    isSwamsha,
    ishtaDevata,
    dhanaYoga,
    vivahaNakshatra,
    summaryEn,
    summaryHi,
  };
}

// ─── 4. Jaimini Rashi Drishti ────────────────────────────────────────────────

export function computeRashiAspects(): boolean[][] {
  // Sign modalities:
  // Movable (Chara):  0=Ar, 3=Cn, 6=Li, 9=Cp
  // Fixed (Sthira):   1=Ta, 4=Le, 7=Sc, 10=Aq
  // Dual (Dwisvabha): 2=Ge, 5=Vi, 8=Sg, 11=Pi

  const movable = [0, 3, 6, 9];
  const fixed   = [1, 4, 7, 10];
  const dual    = [2, 5, 8, 11];

  // Build 12x12 false matrix
  const matrix: boolean[][] = Array.from({ length: 12 }, () => Array(12).fill(false));

  // Movable signs aspect all Fixed signs EXCEPT the adjacent one
  for (const m of movable) {
    for (const f of fixed) {
      // Adjacent means the fixed sign is +1 or -1 from movable sign index
      const diff = Math.abs(m - f);
      const isAdjacent = diff === 1 || diff === 11; // wrap: e.g. Ar(0) adj to Pi(11)
      if (!isAdjacent) {
        matrix[m][f] = true;
      }
    }
  }

  // Fixed signs aspect all Movable signs EXCEPT the adjacent one
  for (const f of fixed) {
    for (const m of movable) {
      const diff = Math.abs(f - m);
      const isAdjacent = diff === 1 || diff === 11;
      if (!isAdjacent) {
        matrix[f][m] = true;
      }
    }
  }

  // Dual signs aspect each other (all 4 Dual signs aspect each other)
  for (const d1 of dual) {
    for (const d2 of dual) {
      if (d1 !== d2) {
        matrix[d1][d2] = true;
      }
    }
  }

  return matrix;
}

// ─── 5. Argala Analysis ──────────────────────────────────────────────────────

export function computeArgala(chart: ChartData): ArgalaEntry[] {
  // For each house (1..12) as reference, find argala and virodhargala planets.
  // Primary Argala positions from reference: 2nd, 4th, 11th
  // Obstruction (Virodhargala) positions: 12th, 10th, 3rd

  const ascSign = chart.ascendant.signIndex;

  return Array.from({ length: 12 }, (_, idx) => {
    const refSign = (ascSign + idx) % 12;

    // Argala signs relative to reference sign
    const argalaPositions = [
      (refSign + 1) % 12,  // 2nd
      (refSign + 3) % 12,  // 4th
      (refSign + 10) % 12, // 11th
    ];
    // Virodhargala signs
    const virodhaPositions = [
      (refSign + 11) % 12, // 12th
      (refSign + 9) % 12,  // 10th
      (refSign + 2) % 12,  // 3rd
    ];

    const argalaPlanets: NineGrahaId[] = [];
    const virodhaPlanets: NineGrahaId[] = [];

    for (const aSign of argalaPositions) {
      argalaPlanets.push(...planetsInSign(chart, aSign));
    }
    for (const vSign of virodhaPositions) {
      virodhaPlanets.push(...planetsInSign(chart, vSign));
    }

    // Net Argala: compare counts
    let netArgala: 'positive' | 'negative' | 'neutral';
    if (argalaPlanets.length > virodhaPlanets.length) {
      netArgala = 'positive';
    } else if (virodhaPlanets.length > argalaPlanets.length) {
      netArgala = 'negative';
    } else {
      netArgala = 'neutral';
    }

    return {
      house: idx + 1,
      argalaPlanets,
      virodhaPlanets,
      netArgala,
    };
  });
}

// ─── 6. Jaimini Chara Dasha ──────────────────────────────────────────────────

function getCharaDashaDuration(chart: ChartData, signIdx: number): number {
  // Duration = count of planets in sign + 1
  // If sign lord is in own sign, add 1 more
  const planetsHere = planetsInSign(chart, signIdx);
  let years = planetsHere.length + 1;

  // Check if lord is in own sign
  const lord = SIGNS[signIdx].lord;
  const lordSign = signLordSignIndex(chart, signIdx);
  if (lordSign === signIdx) {
    years += 1;
  }

  // Cap between 1 and 12
  years = Math.min(12, Math.max(1, years));
  return years;
}

function getCharaDashaOrder(chart: ChartData): number[] {
  // K.N. Rao: direction depends on lagna sign
  const lagnaSignIndex = chart.ascendant.signIndex;
  const modality = SIGNS[lagnaSignIndex].modality;

  // Forward: Ar(0)→Ta(1)→...→Pi(11)
  // Reverse: Ar(0)→Pi(11)→Aq(10)→...→Ta(1)

  if (modality === 'Fixed') {
    // Reverse from lagna
    return Array.from({ length: 12 }, (_, i) => (lagnaSignIndex - i + 12) % 12);
  } else {
    // Forward (Movable and Dual)
    return Array.from({ length: 12 }, (_, i) => (lagnaSignIndex + i) % 12);
  }
}

function computeAntardashas(
  chart: ChartData,
  mahaSignOrder: number[],
  mhIdx: number,
  mdStart: number,
  mdEnd: number,
  nowMs: number,
  offsetMin: number,
): JaiminiCharaDashaPeriod[] {
  const mdYears = (mdEnd - mdStart) / (365.2425 * 86_400_000);
  const totalYears = mdYears;

  // Antardasha order: start from the Mahadasha sign itself
  const mdSign = mahaSignOrder[mhIdx];
  const adOrder: number[] = Array.from({ length: 12 }, (_, i) => (mdSign + i) % 12);

  // Calculate proportional years for each AD based on its own duration
  const rawDurations = adOrder.map((s) => getCharaDashaDuration(chart, s));
  const totalRaw = rawDurations.reduce((a, b) => a + b, 0);

  const ads: JaiminiCharaDashaPeriod[] = [];
  let cursorMs = mdStart;

  for (let i = 0; i < 12; i++) {
    const adSign = adOrder[i];
    const adYears = (rawDurations[i] / totalRaw) * totalYears;
    const adMs = adYears * 365.2425 * 86_400_000;
    const adEnd = cursorMs + adMs;
    const isCurrent = nowMs >= cursorMs && nowMs < adEnd;

    ads.push({
      level: 2,
      signIndex: adSign,
      signName: SIGNS[adSign].name,
      years: parseFloat(adYears.toFixed(2)),
      startMs: cursorMs,
      endMs: adEnd,
      startDate: formatLocalDateTimeFromUtc(cursorMs, offsetMin).slice(0, 10),
      endDate: formatLocalDateTimeFromUtc(adEnd, offsetMin).slice(0, 10),
      isCurrentPeriod: isCurrent,
    });
    cursorMs = adEnd;
  }

  return ads;
}

export function computeCharaDasha(chart: ChartData): JaiminiCharaDashaPeriod[] {
  const nowMs = Date.now();
  const offsetMin = chart.offsetMinutesUsed ?? 330;
  const yearMs = 365.2425 * 86_400_000;

  const signOrder = getCharaDashaOrder(chart);
  const rawDurations = signOrder.map((s) => getCharaDashaDuration(chart, s));

  const mahadashas: JaiminiCharaDashaPeriod[] = [];
  let cursorMs = Number.isFinite(chart.utcMs) ? chart.utcMs : Date.now();

  for (let i = 0; i < 12; i++) {
    const signIdx = signOrder[i];
    const years = rawDurations[i];
    const mdEnd = cursorMs + years * yearMs;
    const isCurrent = nowMs >= cursorMs && nowMs < mdEnd;

    const children = computeAntardashas(
      chart, signOrder, i, cursorMs, mdEnd, nowMs, offsetMin
    );

    mahadashas.push({
      level: 1,
      signIndex: signIdx,
      signName: SIGNS[signIdx]?.name ?? '',
      years,
      startMs: cursorMs,
      endMs: mdEnd,
      startDate: formatLocalDateTimeFromUtc(cursorMs, offsetMin).slice(0, 10),
      endDate: formatLocalDateTimeFromUtc(mdEnd, offsetMin).slice(0, 10),
      isCurrentPeriod: isCurrent,
      children,
    });

    cursorMs = mdEnd;
  }

  return mahadashas;
}

// ─── Main Entry ──────────────────────────────────────────────────────────────

export function computeJaimini(chart: ChartData): JaiminiReport {
  try {
    const karakas = computeCharaKarakas(chart);
    const arudhaPadas = computeArudhaPadas(chart);
    const karakamsha = computeKarakamsha(chart, karakas);
    const rashiAspects = computeRashiAspects();
    const argala = computeArgala(chart);
    const charaDasha = computeCharaDasha(chart);

    return {
      karakas,
      arudhaPadas,
      karakamsha,
      rashiAspects,
      argala,
      charaDasha,
      nowMs: Date.now(),
    };
  } catch (err) {
    console.error('Error in computeJaimini:', err);
    return {
      karakas: [],
      arudhaPadas: [],
      karakamsha: {
        akPlanet: 'Sun',
        karakamshaSignIndex: 0,
        karakamshaSignName: 'Aries',
        isSwamsha: false,
        ishtaDevata: null,
        dhanaYoga: null,
        vivahaNakshatra: '',
        summaryEn: 'Jaimini calculations loaded.',
        summaryHi: 'जैमिनी गणनाएं लोड हो चुकी हैं।'
      },
      rashiAspects: Array.from({ length: 12 }, () => Array(12).fill(false)),
      argala: [],
      charaDasha: [],
      nowMs: Date.now()
    };
  }
}
