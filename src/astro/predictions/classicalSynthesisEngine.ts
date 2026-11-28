/**
 * classicalSynthesisEngine.ts
 *
 * Weighted Classical Jyotish Synthesis Engine combining:
 * 1. Shadbala Rank (1..7), Ratio, Ishta/Kashta Phala & Uchcha/Digbala
 * 2. Bhava Bala (1..12 houses: Bhavadhipati + Digbala + Drishti + Dina-Ratri + Special house pressure)
 * 3. Planetary Avasthas (Baladi, Jagratadi, Deeptadi & effective potency weights)
 * 4. Sarvashtakavarga (SAV) & Bhinnashtakavarga (BAV) by House (1..12)
 * 5. Exact Conjunction Orbs (Grahan/Combustion/Yuddha) & Parashari Aspect Virupas
 * 6. Divisional Chart Cross-Checks (D3, D4, D7, D9, D10, D12, D24, D30, D60)
 * 7. Active Vimshottari Mahadasha-Antardasha Window Scoring (Marriage, Paternal/Maternal transitions, Progeny, Career)
 * 8. Classical Special Points: 22nd Drekkana, 64th Navamsha, Yogi/Avayogi & Beeja/Kshetra Sphuta
 */

import { computeAvasthasAndUpagrahas, type AvasthaUpagrahaReport, type PlanetaryAvasthaRow } from '../avasthasUpagrahas';
import { computeBhavabalaReport, type BhavaBalaRow } from '../bhavabalaEngine';
import { NAKSHATRAS, SEVEN_PLANETS, SIGNS } from '../constants';
import { parasharaAspectVirupas } from '../strength';
import { angularDiffDeg, normalizeDeg } from '../time';
import type {
  AspectInfo,
  BodyPosition,
  ChartData,
  DashaPeriod,
  DivisionalChart,
  DivisionalChartId,
  DivisionalPlacement,
  PlanetId,
  SevenPlanetId,
  ShadbalaRow,
} from '../types';

export interface ShadbalaRankedRow extends ShadbalaRow {
  rank: number; // 1 = strongest by totalVirupas
  ishtaNet: number; // ishtaPhala - kashtaPhala
}

export interface HouseClassicalStrength {
  house: number;
  signIndex: number;
  signName: string;
  lordId: SevenPlanetId;
  bhavaRow?: BhavaBalaRow;
  savBindus: number;
  savTier: 'abundant' | 'balanced' | 'constrained' | 'severe_squeeze';
  beneficAspectVirupas: number;
  maleficAspectVirupas: number;
  netDrishtiVirupas: number;
  specialHousePenalty: number; // e.g., Dusthana lord in Kendra/Trikona or Malefic cusp affliction
  compositeScore: number; // -10 to +10 classical synthesis index
}

export interface SpecialPointsDigest {
  kharaDrekkanaSignIdx: number;
  kharaDrekkanaLord: SevenPlanetId;
  chaturshashtaNavSignIdx: number;
  chaturshashtaNavLord: SevenPlanetId;
  yogiLord: string;
  avayogiLord: string;
}

export interface DashaWindowMatch {
  mdLord: string;
  adLord: string;
  startYear: number;
  endYear: number;
  ageStart: number;
  ageEnd: number;
  score: number;
  reasonEn: string;
  reasonHi: string;
}

export interface ClassicalSynthesisContext {
  shadbalaByPlanet: Map<SevenPlanetId, ShadbalaRankedRow>;
  avasthaByPlanet: Map<SevenPlanetId, PlanetaryAvasthaRow>;
  potencyByPlanet: Map<PlanetId, number>; // 0.15 .. 1.35 classical delivery multiplier
  avasthaReport: AvasthaUpagrahaReport | null;
  bhavaByHouse: Map<number, HouseClassicalStrength>;
  specialPointsDigest: SpecialPointsDigest;
  planetsById: Map<string, BodyPosition>;
  aspects: AspectInfo[];
  msPerYear: number;
  birthYear: number;
  getBavBindus: (planet: SevenPlanetId, house: number) => number;
  getVargaPlacement: (varga: DivisionalChartId, id: PlanetId | 'Asc') => DivisionalPlacement | undefined;
  getVargaOccupants: (varga: DivisionalChartId, vargaHouse: number) => DivisionalPlacement[];
  findBestDashaWindows: (
    minAge: number,
    maxAge: number,
    scorer: (mdLord: string, adLord: string) => { score: number; reasonEn: string; reasonHi: string }
  ) => DashaWindowMatch[];
}

const MS_PER_DAY = 86_400_000;
const GRAHA_HI: Record<string, string> = {
  Sun: 'सूर्य',
  Moon: 'चंद्र',
  Mars: 'मंगल',
  Mercury: 'बुध',
  Jupiter: 'गुरु',
  Venus: 'शुक्र',
  Saturn: 'शनि',
  Rahu: 'राहु',
  Ketu: 'केतु',
};

const SIGN_HI = [
  'मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या',
  'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुंभ', 'मीन',
];

export function grahaHi(id?: string): string {
  return (id && GRAHA_HI[id]) || id || '';
}

function getEffectiveAvasthaPotency(p: BodyPosition, av?: PlanetaryAvasthaRow): number {
  let factor = 0.85;
  if (av) {
    if (av.baladi.startsWith('Yuva')) factor = 1.05;
    else if (av.baladi.startsWith('Kumara')) factor = 0.72;
    else if (av.baladi.startsWith('Bala')) factor = 0.45;
    else if (av.baladi.startsWith('Vriddha')) factor = 0.50;
    else if (av.baladi.startsWith('Mrita')) factor = 0.25;

    if (av.jagratadi.startsWith('Jagrat')) factor *= 1.15;
    else if (av.jagratadi.startsWith('Sushupti')) factor *= 0.65;

    if (av.deeptadi.startsWith('Deepta') || av.deeptadi.startsWith('Swastha')) factor *= 1.12;
    else if (av.deeptadi.startsWith('Deena') || av.deeptadi.startsWith('Khala') || av.deeptadi.startsWith('Vikala')) {
      factor *= 0.70;
    }
  }
  if (p.dignity === 'Exalted') factor *= 1.18;
  else if (p.dignity === 'Own Sign' || p.dignity === 'Moolatrikona') factor *= 1.10;
  else if (p.dignity === 'Debilitated') factor *= 0.60;
  if (p.isCombust) factor *= 0.65;
  if (p.isVargottama) factor *= 1.15;
  return Math.max(0.15, Math.min(1.4, Math.round(factor * 100) / 100));
}

export function buildClassicalSynthesisContext(chart: ChartData): ClassicalSynthesisContext {
  const planetsById = new Map<string, BodyPosition>();
  for (const p of chart.planets || []) {
    planetsById.set(p.id, p);
  }

  // 1. Shadbala Ranking (1..7 by Relative Strength Ratio = totalRupas / requiredRupas, matching Parashara's Light)
  const shadbalaByPlanet = new Map<SevenPlanetId, ShadbalaRankedRow>();
  const rawShadbala = [...(chart.shadbala || [])];
  const sortedShad = [...rawShadbala].sort((a, b) => b.ratio - a.ratio || b.totalVirupas - a.totalVirupas);
  sortedShad.forEach((row, idx) => {
    shadbalaByPlanet.set(row.planet, {
      ...row,
      rank: idx + 1,
      ishtaNet: Math.round((row.ishtaPhala - row.kashtaPhala) * 10) / 10,
    });
  });

  // 2. Avasthas & Upagrahas
  let avasthaReport: AvasthaUpagrahaReport | null = null;
  try {
    avasthaReport = computeAvasthasAndUpagrahas(chart);
  } catch {
    avasthaReport = null;
  }
  const avasthaByPlanet = new Map<SevenPlanetId, PlanetaryAvasthaRow>();
  for (const row of avasthaReport?.avasthas || []) {
    avasthaByPlanet.set(row.planet, row);
  }

  const potencyByPlanet = new Map<PlanetId, number>();
  for (const p of chart.planets || []) {
    if (p.id === 'Asc') continue;
    const av = SEVEN_PLANETS.includes(p.id as SevenPlanetId)
      ? avasthaByPlanet.get(p.id as SevenPlanetId)
      : undefined;
    potencyByPlanet.set(p.id, getEffectiveAvasthaPotency(p, av));
  }

  // 3. Bhavabala (1..12)
  let bhavaRows: BhavaBalaRow[] = [];
  try {
    bhavaRows = computeBhavabalaReport(chart).houses;
  } catch {
    bhavaRows = [];
  }
  const bhavaRowMap = new Map<number, BhavaBalaRow>();
  for (const r of bhavaRows) bhavaRowMap.set(r.house, r);

  // 4. Waxing Moon check for natural benefic/malefic drishti
  const sun = planetsById.get('Sun');
  const moon = planetsById.get('Moon');
  const isWaxingMoon =
    sun && moon ? normalizeDeg(moon.longitude - sun.longitude) < 180 : true;

  const isNaturalBenefic = (id: string): boolean => {
    if (id === 'Jupiter' || id === 'Venus') return true;
    if (id === 'Mercury') return true;
    if (id === 'Moon') return isWaxingMoon;
    return false;
  };

  // 5. House Classical Strength Map (1..12)
  const ascSignIdx = chart.ascendant?.signIndex ?? 0;
  const ascLon = chart.ascendant?.longitude ?? 0;
  const sarva = chart.ashtakavarga?.sarva || [];
  const houseSignMap = new Map<number, SevenPlanetId>();
  for (let h = 1; h <= 12; h++) {
    houseSignMap.set(h, SIGNS[(ascSignIdx + h - 1) % 12].lord);
  }
  const dusthanaLords = new Set<string>([
    houseSignMap.get(6)!,
    houseSignMap.get(8)!,
    houseSignMap.get(12)!,
  ]);

  const bhavaByHouse = new Map<number, HouseClassicalStrength>();
  for (let h = 1; h <= 12; h++) {
    const signIndex = (ascSignIdx + h - 1) % 12;
    const sign = SIGNS[signIndex];
    const savBindus = sarva[signIndex] ?? 28;
    const savTier: HouseClassicalStrength['savTier'] =
      savBindus >= 30
        ? 'abundant'
        : savBindus >= 25
          ? 'balanced'
          : savBindus >= 22
            ? 'constrained'
            : 'severe_squeeze';

    const cuspLon = chart.houses?.[h - 1]?.midpoint ?? normalizeDeg(ascLon + (h - 1) * 30);
    let beneficAspectVirupas = 0;
    let maleficAspectVirupas = 0;

    for (const pl of chart.planets || []) {
      if (pl.id === 'Asc') continue;
      const angle = normalizeDeg(cuspLon - pl.longitude);
      let virupas = 0;
      if (pl.id === 'Rahu' || pl.id === 'Ketu') {
        const houseDist = ((h - (pl.rasiHouseNumber ?? pl.houseNumber ?? 1) + 12) % 12) + 1;
        if ([5, 7, 9].includes(houseDist)) virupas = 45;
      } else if (SEVEN_PLANETS.includes(pl.id as SevenPlanetId)) {
        virupas = parasharaAspectVirupas(pl.id as PlanetId, angle);
      }
      if (isNaturalBenefic(pl.id)) beneficAspectVirupas += virupas;
      else maleficAspectVirupas += virupas;
    }

    const netDrishtiVirupas = Math.round((beneficAspectVirupas - maleficAspectVirupas) * 10) / 10;

    // Special House Pressure (Parashara's Light Special Bhava Bala penalty reflection)
    let specialHousePenalty = 0;
    const occs = (chart.planets || []).filter((p) => (p.rasiHouseNumber ?? p.houseNumber) === h);
    for (const occ of occs) {
      if (dusthanaLords.has(occ.id) && ![6, 8, 12].includes(h) && occ.id !== sign.lord) {
        specialHousePenalty -= 1.5;
      }
      if (['Saturn', 'Rahu', 'Ketu', 'Mars'].includes(occ.id) && [1, 4, 5, 7, 9].includes(h) && occ.id !== sign.lord) {
        specialHousePenalty -= 1.25;
      }
      if (occ.dignity === 'Debilitated') specialHousePenalty -= 1.0;
    }

    const lordShad = shadbalaByPlanet.get(sign.lord);
    const bhavaRow = bhavaRowMap.get(h);
    let compositeScore = 0;
    if (savBindus >= 30) compositeScore += 2.0;
    else if (savBindus <= 21) compositeScore -= 2.5;
    else if (savBindus <= 24) compositeScore -= 1.5;

    if (lordShad) {
      if (lordShad.rank <= 2) compositeScore += 1.8;
      else if (lordShad.rank >= 6) compositeScore -= 1.5;
      if (lordShad.isStrong) compositeScore += 0.8;
      else compositeScore -= 1.0;
      if (lordShad.ishtaNet < -20) compositeScore -= 0.8;
      else if (lordShad.ishtaNet > 20) compositeScore += 0.8;
    }

    if (bhavaRow) {
      if (bhavaRow.rank <= 3) compositeScore += 1.5;
      else if (bhavaRow.rank >= 10) compositeScore -= 1.5;
      if (bhavaRow.bhavaDrishtiBalaVirupas < -10) compositeScore -= 1.0;
      else if (bhavaRow.bhavaDrishtiBalaVirupas > 10) compositeScore += 1.0;
    }

    compositeScore += specialHousePenalty;

    bhavaByHouse.set(h, {
      house: h,
      signIndex,
      signName: sign.name,
      lordId: sign.lord,
      bhavaRow,
      savBindus,
      savTier,
      beneficAspectVirupas: Math.round(beneficAspectVirupas * 10) / 10,
      maleficAspectVirupas: Math.round(maleficAspectVirupas * 10) / 10,
      netDrishtiVirupas,
      specialHousePenalty,
      compositeScore: Math.round(compositeScore * 10) / 10,
    });
  }

  // 6. Special Classical Points (22nd Drekkana, 64th Navamsha, Yogi/Avayogi)
  const ascDeg = chart.ascendant?.degreeInSign ?? 0;
  const ascDrekPart = Math.min(2, Math.floor(ascDeg / 10)); // 0, 1, 2
  const kharaDrekkanaSignIdx = (ascSignIdx + 7 + ascDrekPart * 4) % 12;
  const kharaDrekkanaLord = SIGNS[kharaDrekkanaSignIdx].lord;

  const d9MoonSign =
    chart.divisionalCharts?.D9?.placements.find((pl) => pl.id === 'Moon')?.signIndex ??
    (moon?.signIndex ?? ascSignIdx);
  const chaturshashtaNavSignIdx = (d9MoonSign + 3) % 12;
  const chaturshashtaNavLord = SIGNS[chaturshashtaNavSignIdx].lord;

  const yogiLon = normalizeDeg((sun?.longitude ?? 0) + (moon?.longitude ?? 0) + 93 + 20 / 60);
  const yogiNakIdx = Math.floor(yogiLon / (360 / 27)) % 27;
  const yogiLord = NAKSHATRAS[yogiNakIdx]?.lord ?? 'Jupiter';
  const avayogiNakIdx = (yogiNakIdx + 5) % 27; // classical 6th star (Pushkara/Avayogi offset)
  const avayogiLord = NAKSHATRAS[avayogiNakIdx]?.lord ?? 'Saturn';

  const daysPerYear = chart.settings?.dashaYearType === 'savana' ? 360 : 365.2425;
  const msPerYear = daysPerYear * MS_PER_DAY;
  const birthYear = new Date(chart.utcMs).getUTCFullYear();

  const getBavBindus = (planet: SevenPlanetId, house: number): number => {
    const signIdx = (ascSignIdx + house - 1) % 12;
    return chart.ashtakavarga?.bhinna?.[planet]?.[signIdx] ?? 4;
  };

  const getVargaPlacement = (varga: DivisionalChartId, id: PlanetId | 'Asc'): DivisionalPlacement | undefined =>
    chart.divisionalCharts?.[varga]?.placements.find((pl) => pl.id === id);

  const getVargaOccupants = (varga: DivisionalChartId, vargaHouse: number): DivisionalPlacement[] =>
    (chart.divisionalCharts?.[varga]?.placements || []).filter(
      (pl) => pl.id !== 'Asc' && pl.houseFromVargaLagna === vargaHouse
    );

  const findBestDashaWindows = (
    minAge: number,
    maxAge: number,
    scorer: (mdLord: string, adLord: string) => { score: number; reasonEn: string; reasonHi: string }
  ): DashaWindowMatch[] => {
    const matches: DashaWindowMatch[] = [];
    const minMs = chart.utcMs + minAge * msPerYear;
    const maxMs = chart.utcMs + maxAge * msPerYear;

    for (const md of chart.vimshottari || []) {
      if (md.endMs < minMs || md.startMs > maxMs) continue;
      const ads: DashaPeriod[] = md.children && md.children.length > 0 ? md.children : [md];
      for (const ad of ads) {
        if (ad.endMs < minMs || ad.startMs > maxMs) continue;
        const { score, reasonEn, reasonHi } = scorer(md.lord, ad.lord);
        if (score > 0) {
          const clampedStart = Math.max(ad.startMs, minMs);
          const clampedEnd = Math.min(ad.endMs, maxMs);
          if (clampedEnd <= clampedStart) continue;
          const ageStart = Math.round(((clampedStart - chart.utcMs) / msPerYear) * 10) / 10;
          const ageEnd = Math.round(((clampedEnd - chart.utcMs) / msPerYear) * 10) / 10;
          matches.push({
            mdLord: md.lord,
            adLord: ad.lord,
            startYear: new Date(clampedStart).getUTCFullYear(),
            endYear: new Date(clampedEnd).getUTCFullYear(),
            ageStart,
            ageEnd,
            score,
            reasonEn,
            reasonHi,
          });
        }
      }
    }
    return matches.sort((a, b) => b.score - a.score || a.ageStart - b.ageStart);
  };

  return {
    shadbalaByPlanet,
    avasthaByPlanet,
    potencyByPlanet,
    avasthaReport,
    bhavaByHouse,
    specialPointsDigest: {
      kharaDrekkanaSignIdx,
      kharaDrekkanaLord,
      chaturshashtaNavSignIdx,
      chaturshashtaNavLord,
      yogiLord,
      avayogiLord,
    },
    planetsById,
    aspects: chart.aspects || [],
    msPerYear,
    birthYear,
    getBavBindus,
    getVargaPlacement,
    getVargaOccupants,
    findBestDashaWindows,
  };
}

// =============================================================================
// SYNTHESIS EVALUATOR 1: PATERNAL & ANCESTRAL AXIS (H9 + H10 + Sun + D12 + Dasha)
// =============================================================================
export interface WeightedFatherVerdict {
  riskLevel: 'strong' | 'moderate_strain' | 'severe_paternal_vulnerability';
  valEn: string;
  valHi: string;
  explEn: string;
  explHi: string;
  pacEn: string;
  pacHi: string;
  transitionWindow?: DashaWindowMatch;
}

export function evaluateWeightedFatherAxis(
  ctx: ClassicalSynthesisContext,
  ascSignIdx: number
): WeightedFatherVerdict {
  const sun = ctx.planetsById.get('Sun');
  const moon = ctx.planetsById.get('Moon');
  const rahu = ctx.planetsById.get('Rahu');
  const ketu = ctx.planetsById.get('Ketu');
  const saturn = ctx.planetsById.get('Saturn');
  const jupiter = ctx.planetsById.get('Jupiter');

  const h9 = ctx.bhavaByHouse.get(9)!;
  const h10 = ctx.bhavaByHouse.get(10)!;
  const l9Id = SIGNS[(ascSignIdx + 8) % 12].lord;
  const l9 = ctx.planetsById.get(l9Id);

  const sunShad = ctx.shadbalaByPlanet.get('Sun');
  const sunAv = ctx.avasthaByPlanet.get('Sun');
  const l9Shad = ctx.shadbalaByPlanet.get(l9Id);
  const l9Av = ctx.avasthaByPlanet.get(l9Id);
  const mars = ctx.planetsById.get('Mars');

  const sunD12 = ctx.getVargaPlacement('D12', 'Sun');
  const d12SunHouseOcc = sunD12 ? ctx.getVargaOccupants('D12', sunD12.houseFromVargaLagna) : [];
  const d12H10Occ = ctx.getVargaOccupants('D12', 10);
  const d12H9Occ = ctx.getVargaOccupants('D12', 9);

  // Check exact Grahan / Close Affliction / Combustion on Sun or 9th Lord
  const sunRahuOrb = sun && rahu ? angularDiffDeg(sun.longitude, rahu.longitude) : 180;
  const l9RahuOrb = l9 && rahu ? angularDiffDeg(l9.longitude, rahu.longitude) : 180;
  const l9KetuOrb = l9 && ketu ? angularDiffDeg(l9.longitude, ketu.longitude) : 180;

  const l9House = l9 ? (l9.rasiHouseNumber ?? l9.houseNumber ?? 1) : 1;
  const sunHouse = sun ? (sun.rasiHouseNumber ?? sun.houseNumber ?? 1) : 1;
  const isMoonRahuGrahan9L = l9Id === 'Moon' && l9RahuOrb < 5.0;
  const isSunRahuOrb = sunRahuOrb < 8.0;
  const isSunLowRank = Boolean(sunShad && (sunShad.rank >= 6 || !sunShad.isStrong || sunShad.ishtaNet < -25));
  const isL9CombustOrLowest = Boolean(
    l9 &&
      (l9.isCombust ||
        (l9Shad && l9Shad.rank >= 6) ||
        l9.dignity === 'Debilitated' ||
        (l9Av && (l9Av.baladi.startsWith('Mrita') || avIsWeak(l9Av))))
  );
  const isL9SunMarakaConj = Boolean(
    l9 &&
      sun &&
      l9House === sunHouse &&
      [2, 6, 7, 8, 12].includes(l9House) &&
      (l9.isCombust || (mars && (mars.rasiHouseNumber ?? mars.houseNumber) === l9House && mars.dignity === 'Debilitated'))
  );
  const isSunMritaOrDeena = Boolean(sunAv && (sunAv.baladi.startsWith('Mrita') || avIsWeak(sunAv)));
  const isH10KetuOrNode = Boolean(ketu && (ketu.rasiHouseNumber ?? ketu.houseNumber) === 10);
  const isD12SunMaraka = Boolean(sunD12 && [2, 6, 7, 8, 12].includes(sunD12.houseFromVargaLagna));
  const isD12SunWithNode = d12SunHouseOcc.some((p) => p.id === 'Ketu' || p.id === 'Rahu' || p.id === 'Saturn');
  const isD12MaleficAxis =
    d12H10Occ.some((p) => p.id === 'Saturn' || p.id === 'Ketu') ||
    d12H9Occ.some((p) => p.id === 'Saturn' || p.id === 'Ketu');

  // Check Saturn / Ketu drishti on 9th lord or 4th/9th house
  const satAspectsL9 = Boolean(
    saturn && l9 && [3, 7, 10].includes(((l9.signIndex - saturn.signIndex + 12) % 12) + 1)
  );
  const ketuAspectsL9 = Boolean(
    ketu && l9 && [5, 7, 9].includes(((l9.signIndex - ketu.signIndex + 12) % 12) + 1)
  );

  let strainScore = 0;
  const reasonsEn: string[] = [];
  const reasonsHi: string[] = [];

  if (isSunLowRank && sunShad) {
    strainScore += sunShad.rank === 7 ? 2.5 : 1.5;
    reasonsEn.push(`Sun Shadbala Rank #${sunShad.rank}/7 (${sunShad.totalRupas.toFixed(2)}R, Ishta ${sunShad.ishtaPhala}/Kashta ${sunShad.kashtaPhala})`);
    reasonsHi.push(`सूर्य षड्बल रैंक #${sunShad.rank}/7 (इष्ट ${sunShad.ishtaPhala}/कष्ट ${sunShad.kashtaPhala})`);
  }
  if (isL9CombustOrLowest && l9Shad) {
    strainScore += (l9Shad.rank === 7 && l9?.isCombust) ? 2.5 : 1.5;
    reasonsEn.push(
      `9th Lord ${l9Id} Rank #${l9Shad.rank}/7${l9?.isCombust ? ' & Combust' : ''}${l9Av ? ` (${l9Av.deeptadi.split(' ')[0]})` : ''}`
    );
    reasonsHi.push(`नवमेश ${grahaHi(l9Id)} रैंक #${l9Shad.rank}/7${l9?.isCombust ? ' व अस्त' : ''}`);
  }
  if (isL9SunMarakaConj) {
    strainScore += 1.5;
    reasonsEn.push(`Sun+9th Lord ${l9Id} conjunct in Maraka/Trik H${l9House}`);
    reasonsHi.push(`मारक/त्रिक भाव ${l9House} में सूर्य व नवमेश ${grahaHi(l9Id)} युति`);
  }
  if (isSunMritaOrDeena && sunAv) {
    strainScore += 1.5;
    reasonsEn.push(`Sun in ${sunAv.baladi.split(' ')[0]} / ${sunAv.deeptadi.split(' ')[0]} Avastha`);
    reasonsHi.push(`सूर्य ${sunAv.baladi.split(' ')[0]} अवस्था में`);
  }
  if (isMoonRahuGrahan9L || isSunRahuOrb || l9KetuOrb < 8) {
    strainScore += 2.5;
    reasonsEn.push(
      isMoonRahuGrahan9L
        ? `9th Lord Moon in tight ${l9RahuOrb.toFixed(2)}° Rahu Grahan${satAspectsL9 ? ' + Saturn aspect' : ''}`
        : `Nodal affliction on Pitrukaraka / 9th Lord`
    );
    reasonsHi.push(
      isMoonRahuGrahan9L
        ? `नवमेश चंद्र पर ${l9RahuOrb.toFixed(2)}° राहु ग्रहण${satAspectsL9 ? ' व शनि दृष्टि' : ''}`
        : `पितृकारक/नवमेश पर राहु-केतु दबाव`
    );
  }
  if (satAspectsL9 && ketuAspectsL9) {
    strainScore += 1.5;
    reasonsEn.push(`Dual Saturn+Ketu drishti on 9th lord ${l9Id}`);
    reasonsHi.push(`नवमेश ${grahaHi(l9Id)} पर शनि व केतु की संयुक्त दृष्टि`);
  }
  if (isH10KetuOrNode) {
    strainScore += 1.0;
    reasonsEn.push('Ketu in 10th house (BPHS paternal-detachment axis)');
    reasonsHi.push('दशम भाव में केतु (पितृ-वियोग सूचक)');
  }
  if (isD12SunMaraka || isD12MaleficAxis) {
    strainScore += isD12SunWithNode && isD12SunMaraka ? 2.2 : 1.5;
    reasonsEn.push(
      `D12 Dwadasamsha vulnerability (${isD12SunMaraka ? `Sun${isD12SunWithNode ? '+Ketu/Sat' : ''} in D12 H${sunD12?.houseFromVargaLagna}` : ''}${isD12MaleficAxis ? ' + Saturn/Ketu in D12 H9/H10' : ''})`
    );
    reasonsHi.push(
      `D12 द्वादशांश में पितृ भाव संवेदनशील (सूर्य/शनि-केतु अक्ष)`
    );
  }
  if (h9.savBindus <= 24) {
    strainScore += 1.0;
    reasonsEn.push(`H9 SAV ${h9.savBindus} bindus`);
    reasonsHi.push(`नवम SAV ${h9.savBindus} बिंदु`);
  }
  // Benefic mitigation
  const jupProtectsFather = Boolean(
    jupiter &&
      ((jupiter.rasiHouseNumber ?? jupiter.houseNumber) === 9 ||
        (sun && [1, 5, 7, 9].includes(((sun.signIndex - jupiter.signIndex + 12) % 12) + 1))) &&
      (ctx.shadbalaByPlanet.get('Jupiter')?.ishtaNet ?? 0) > 0
  );
  if (jupProtectsFather) strainScore -= 1.5;

  // Score paternal transition windows across age 18..55 via Vimshottari
  const maraka2L = SIGNS[(ascSignIdx + 1) % 12].lord;
  const maraka7L = SIGNS[(ascSignIdx + 6) % 12].lord;
  const marakaFrom9 = new Set<string>([
    SIGNS[(ascSignIdx + 8 + 1) % 12].lord, // 10th (2nd from 9th)
    SIGNS[(ascSignIdx + 8 + 6) % 12].lord, // 3rd (7th from 9th)
    maraka2L,
    maraka7L,
  ]);
  const windows = ctx.findBestDashaWindows(18, 55, (md, ad) => {
    let sc = 0;
    const targetSet = new Set<string>([l9Id, 'Sun', 'Rahu', 'Ketu', SIGNS[(ascSignIdx + 9) % 12].lord]);
    if (md === l9Id || md === 'Saturn' || md === 'Rahu' || md === 'Sun') sc += 2.5;
    if (ad === 'Sun' || ad === l9Id || ad === 'Rahu' || ad === 'Ketu') sc += 3.0;
    else if (ad === maraka2L || ad === maraka7L) sc += 2.0;
    if (targetSet.has(ad) && marakaFrom9.has(md)) sc += 1.5;
    if (sc >= 4.5) {
      return {
        score: sc,
        reasonEn: `${md}–${ad} activates Sun/9th-lord/Pitru-Maraka axis`,
        reasonHi: `${grahaHi(md)}–${grahaHi(ad)} दशा में पितृ व मारक भाव सक्रिय`,
      };
    }
    return { score: 0, reasonEn: '', reasonHi: '' };
  });
  const topWindow = windows[0];

  if (strainScore >= 5.5) {
    const winEn = topWindow
      ? ` Key paternal health/separation sensitivity window around ages ${Math.round(topWindow.ageStart)}–${Math.round(topWindow.ageEnd)} (${topWindow.startYear}–${topWindow.endYear}, ${topWindow.mdLord}–${topWindow.adLord} Dasha)`
      : '';
    const winHi = topWindow
      ? ` आयु ${Math.round(topWindow.ageStart)}–${Math.round(topWindow.ageEnd)} वर्ष (${topWindow.startYear}–${topWindow.endYear}, ${grahaHi(topWindow.mdLord)}–${grahaHi(topWindow.adLord)} दशा) में पिता के स्वास्थ्य व पितृ-वियोग की गंभीर परीक्षा`
      : '';

    return {
      riskLevel: 'severe_paternal_vulnerability',
      valEn: `Tested Paternal Vitality & Mid-Life Separation Vigilance (${reasonsEn.slice(0, 2).join('; ')})${winEn ? ' — Father faced severe health/longevity tests or early separation' : ''}`,
      valHi: `पितृ स्वास्थ्य व मध्यायु वियोग सतर्कता (${reasonsHi.slice(0, 2).join('; ')}) — पिता के स्वास्थ्य व आयु पक्ष पर विशेष परीक्षण योग`,
      explEn: `Classical Weighted Synthesis overrides surface 9th strength: ${reasonsEn.join('; ')}.${winEn}. Advises proactive Pitru Tarpan, Sunday Surya Arghya, and attentive medical care for father during active nodal/maraka Dashas.`,
      explHi: `सूर्य बल, अवस्था, ग्रहण योग व D12 के संयुक्त विश्लेषण से ${reasonsHi.join('; ')}।${winHi}। पिता के स्वास्थ्य की नियमित देखभाल व पितृ-शांति लाभकारी।`,
      pacEn: `Sun Shadbala Rank #${sunShad?.rank ?? '-'}/7, Ratio ${sunShad?.ratio ?? '-'}, Ishta/Kashta ${sunShad?.ishtaPhala ?? '-'}/${sunShad?.kashtaPhala ?? '-'}; H9 SAV ${h9.savBindus}; L9 ${l9Id} in H${l9?.rasiHouseNumber}; D12 Sun H${sunD12?.houseFromVargaLagna ?? '-'}.`,
      pacHi: `सूर्य रैंक #${sunShad?.rank ?? '-'}/7, इष्ट/कष्ट ${sunShad?.ishtaPhala ?? '-'}/${sunShad?.kashtaPhala ?? '-'}; नवम SAV ${h9.savBindus}; D12 सूर्य भाव ${sunD12?.houseFromVargaLagna ?? '-'}।`,
      transitionWindow: topWindow,
    };
  }

  if (strainScore >= 2.5) {
    return {
      riskLevel: 'moderate_strain',
      valEn: `Self-Made & Duty-Tested Paternal Bond (${reasonsEn[0] || `H9 SAV ${h9.savBindus}`}): Father worked tirelessly amidst pressures; respect bridges distance`,
      valHi: `संघर्षशील व कर्तव्यनिष्ठ पितृ योग (${reasonsHi[0] || `नवम SAV ${h9.savBindus}`}): पिता का जीवन परिश्रमप्रधान रहा; धैर्य व आदर से संवाद मधुर`,
      explEn: `Shadbala & D12 synthesis detects moderate strain (${reasonsEn.join('; ') || 'average solar strength'}).${topWindow ? ` Careful paternal care advised during ${topWindow.mdLord}–${topWindow.adLord} (${topWindow.startYear}–${topWindow.endYear}).` : ''}`,
      explHi: `षड्बल व द्वादशांश विश्लेषण में मध्यम पितृ-दबाव (${reasonsHi.join('; ') || 'सामान्य सूर्य बल'}) दिखता है।`,
      pacEn: `Sun Rank #${sunShad?.rank ?? '-'}/7, Ratio ${sunShad?.ratio ?? '-'}; H9 SAV ${h9.savBindus}; H9 Bhava Rank #${h9.bhavaRow?.rank ?? '-'}.`,
      pacHi: `सूर्य रैंक #${sunShad?.rank ?? '-'}/7; नवम SAV ${h9.savBindus}; नवम भाव बल रैंक #${h9.bhavaRow?.rank ?? '-'}।`,
      transitionWindow: topWindow,
    };
  }

  return {
    riskLevel: 'strong',
    valEn: `Fortified Paternal Lineage (Sun Rank #${sunShad?.rank ?? 1}/7, H9 SAV ${h9.savBindus}): Dignified, principled father providing steady blessings & standing`,
    valHi: `सबल व प्रतिष्ठित पितृ पक्ष (सूर्य रैंक #${sunShad?.rank ?? 1}/7, नवम SAV ${h9.savBindus}): सिद्धांतवादी व सहयोगी पिता से उत्तम मार्गदर्शन`,
    explEn: `D1 Sun (${sunShad?.totalRupas.toFixed(2) ?? '-'}R), H9 (${h9.savBindus} SAV bindus, Bhava Rank #${h9.bhavaRow?.rank ?? '-'}), and D12 Dwadasamsha align harmoniously in support of paternal longevity and dignity.`,
    explHi: `सूर्य षड्बल, नवम भाव अष्टकवर्ग (${h9.savBindus} बिंदु) व D12 द्वादशांश में पिता के दीर्घायु और सम्मान का प्रबल योग है।`,
    pacEn: `Sun Rank #${sunShad?.rank ?? '-'}/7 (${sunShad?.totalRupas.toFixed(2) ?? '-'}R); H9 SAV ${h9.savBindus}; D12 Sun H${sunD12?.houseFromVargaLagna ?? '-'}.`,
    pacHi: `सूर्य रैंक #${sunShad?.rank ?? '-'}/7; नवम SAV ${h9.savBindus}; D12 सूर्य भाव ${sunD12?.houseFromVargaLagna ?? '-'}।`,
    transitionWindow: topWindow,
  };
}

function avIsWeak(av: PlanetaryAvasthaRow): boolean {
  return av.deeptadi.startsWith('Deena') || av.deeptadi.startsWith('Khala') || av.deeptadi.startsWith('Vikala');
}

// =============================================================================
// SYNTHESIS EVALUATOR 2: WEIGHTED MARRIAGE TIMING, SPOUSE AGE & D9 RESILIENCE
// =============================================================================
export interface WeightedMarriageVerdict {
  delayScore: number;
  timingWindowEn: string;
  timingWindowHi: string;
  maritalStatusOverride?: { valEn: string; valHi: string; explEn: string; explHi: string };
  spouseAgeParity: { valEn: string; valHi: string; explEn: string; explHi: string };
  d9Resilience: { valEn: string; valHi: string; explEn: string; explHi: string };
  bedPleasure: { valEn: string; valHi: string; explEn: string; explHi: string };
  multiMarriage: { valEn: string; valHi: string; explEn: string; explHi: string };
  divorceResilience: { valEn: string; valHi: string; explEn: string; explHi: string };
}

export function evaluateWeightedMarriageAxis(
  ctx: ClassicalSynthesisContext,
  ascSignIdx: number
): WeightedMarriageVerdict {
  const h7 = ctx.bhavaByHouse.get(7)!;
  const h12 = ctx.bhavaByHouse.get(12)!;
  const h2 = ctx.bhavaByHouse.get(2)!;
  const l7Id = SIGNS[(ascSignIdx + 6) % 12].lord;
  const l7 = ctx.planetsById.get(l7Id);
  const venus = ctx.planetsById.get('Venus');
  const saturn = ctx.planetsById.get('Saturn');
  const jupiter = ctx.planetsById.get('Jupiter');
  const mars = ctx.planetsById.get('Mars');
  const rahu = ctx.planetsById.get('Rahu');
  const ketu = ctx.planetsById.get('Ketu');
  const mercury = ctx.planetsById.get('Mercury');
  const moon = ctx.planetsById.get('Moon');

  const venShad = ctx.shadbalaByPlanet.get('Venus');
  const venAv = ctx.avasthaByPlanet.get('Venus');
  const satShad = ctx.shadbalaByPlanet.get('Saturn');
  const l7Shad = ctx.shadbalaByPlanet.get(l7Id);
  const jupAv = ctx.avasthaByPlanet.get('Jupiter');

  const d9LagnaIdx = ctx.getVargaPlacement('D9', 'Asc')?.signIndex ?? ascSignIdx;
  const d9Venus = ctx.getVargaPlacement('D9', 'Venus');
  const d9Sat = ctx.getVargaPlacement('D9', 'Saturn');
  const d9L7Id = SIGNS[(d9LagnaIdx + 6) % 12].lord;
  const d9L7Placement = ctx.getVargaPlacement('D9', d9L7Id);
  const d9Moon = ctx.getVargaPlacement('D9', 'Moon');
  const d9H7Occ = ctx.getVargaOccupants('D9', 7);
  const d9VenHouseOcc = d9Venus ? ctx.getVargaOccupants('D9', d9Venus.houseFromVargaLagna) : [];

  const d9VenusDignified = Boolean(d9Venus && ['Exalted', 'Own Sign', 'Moolatrikona'].includes(d9Venus.dignity));
  const d9L7Dignified = Boolean(
    (d9Moon && d9Moon.id === l7Id && ['Exalted', 'Own Sign', 'Moolatrikona'].includes(d9Moon.dignity)) ||
      (d9L7Placement && ['Exalted', 'Own Sign', 'Moolatrikona'].includes(d9L7Placement.dignity))
  );
  const venusClusteredMaleficD9 = d9VenHouseOcc.some((p) => ['Saturn', 'Ketu', 'Mars', 'Rahu'].includes(p.id));
  const isVenDebilOrBalavastha = Boolean(
    venus &&
      (venus.dignity === 'Debilitated' ||
        venus.isCombust ||
        (venAv && (venAv.baladi.startsWith('Bala') || venAv.baladi.startsWith('Mrita') || avIsWeak(venAv)) && !d9VenusDignified) ||
        (venShad && venShad.ishtaNet < -15 && !d9VenusDignified))
  );
  const isH7LowSav = h7.savBindus <= 24;
  // Saturn delays marriage ONLY when it actually touches H7, L7, Venus, or D9 H7 (or sits in H7/aspecting H7), NOT merely for being strong Lagnesh in H12!
  const satAspects7 = Boolean(
    saturn && [3, 7, 10].includes((7 - (saturn.rasiHouseNumber ?? saturn.houseNumber ?? 1) + 12) % 12 === 0 ? 12 : ((7 - (saturn.rasiHouseNumber ?? saturn.houseNumber ?? 1) + 12) % 12) + 1)
  );
  const satAspectsL7 = Boolean(
    saturn && l7 && [3, 7, 10].includes(((l7.signIndex - saturn.signIndex + 12) % 12) + 1)
  );
  const satAspectsVenus = Boolean(
    saturn && venus && [3, 7, 10].includes(((venus.signIndex - saturn.signIndex + 12) % 12) + 1)
  );
  const isSatStrongOrOn7 = Boolean(
    saturn &&
      ((saturn.rasiHouseNumber ?? saturn.houseNumber) === 7 ||
        satAspects7 ||
        satAspectsL7 ||
        satAspectsVenus ||
        (l7 && (saturn.rasiHouseNumber ?? saturn.houseNumber) === (l7.rasiHouseNumber ?? l7.houseNumber)) ||
        (d9Sat && [1, 7, 8].includes(d9Sat.houseFromVargaLagna)))
  );

  const isJup7RetroOrKhala = Boolean(
    jupiter &&
      (jupiter.rasiHouseNumber ?? jupiter.houseNumber) === 7 &&
      (jupiter.isRetrograde || (jupAv && (jupAv.baladi.startsWith('Vriddha') || avIsWeak(jupAv))))
  );

  let delayScore = 0;
  const delayCuesEn: string[] = [];
  const delayCuesHi: string[] = [];

  if (h7.savBindus <= 21) {
    delayScore += 3;
    delayCuesEn.push(`Severe H7 SAV Squeeze (${h7.savBindus} bindus)`);
    delayCuesHi.push(`सप्तम SAV अत्यंत न्यून (${h7.savBindus} बिंदु)`);
  } else if (isH7LowSav) {
    delayScore += 1.5;
    delayCuesEn.push(`Constrained H7 SAV (${h7.savBindus} bindus)`);
    delayCuesHi.push(`सप्तम SAV कमजोर (${h7.savBindus} बिंदु)`);
  }
  if (isVenDebilOrBalavastha) {
    delayScore += 2.5;
    delayCuesEn.push(
      `Venus weakened (${venus?.dignity}${venAv ? `, ${venAv.baladi.split(' ')[0]}` : ''}${venShad ? `, Ishta ${venShad.ishtaPhala}/Kashta ${venShad.kashtaPhala}` : ''})`
    );
    delayCuesHi.push(`शुक्र निर्बल (${venus?.dignity}, ${venAv?.baladi.split(' ')[0] || 'कमजोर अवस्था'})`);
  }
  if (venusClusteredMaleficD9) {
    delayScore += d9VenusDignified ? 0.5 : 1.5;
    delayCuesEn.push(`D9 Venus with ${d9VenHouseOcc.filter((p) => p.id !== 'Venus').map((p) => p.id).join('+')}`);
    delayCuesHi.push(`नवांश में शुक्र क्रूर ग्रहों के साथ`);
  }
  if (d9L7Dignified && d9VenusDignified) {
    delayScore = Math.max(0.5, delayScore - 1.0);
  }
  if (isSatStrongOrOn7) {
    delayScore += 1.5;
    delayCuesEn.push(`Saturn Rank #${satShad?.rank ?? '-'}/7 & D9/7th influence`);
    delayCuesHi.push(`शनि रैंक #${satShad?.rank ?? '-'} व सप्तम/D9 प्रभाव`);
  }
  if (isJup7RetroOrKhala) {
    delayScore += 1.0;
    delayCuesEn.push(`Jupiter (R) in H7 (${jupAv?.deeptadi.split(' ')[0] || 'Khala'}) pauses quick marriage`);
    delayCuesHi.push(`सप्तम वक्री गुरु से परिपक्व आयु में विवाह`);
  }
  if (h7.bhavaRow && h7.bhavaRow.rank >= 9) {
    delayScore += 1.0;
    delayCuesEn.push(`H7 Bhava Rank #${h7.bhavaRow.rank}/12`);
    delayCuesHi.push(`सप्तम भाव बल रैंक #${h7.bhavaRow.rank}/12`);
  }
  if (l7 && [6, 8, 12].includes(l7.rasiHouseNumber ?? l7.houseNumber ?? 1)) {
    delayScore += 1.5;
    delayCuesEn.push(`7th lord ${l7Id} in H${l7.rasiHouseNumber ?? l7.houseNumber}`);
    delayCuesHi.push(`सप्तमेश ${grahaHi(l7Id)} त्रिक भाव में`);
  }

  // Compute exact Vimshottari Marriage Window!
  const minMarAge = delayScore >= 5 ? 28 : delayScore >= 3 ? 25 : 22;
  const maxMarAge = delayScore >= 5 ? 35 : delayScore >= 3 ? 31 : 28;

  const marWindows = ctx.findBestDashaWindows(minMarAge, maxMarAge, (md, ad) => {
    let sc = 0;
    const tags: string[] = [];
    const vivahaSignificators = new Set<string>([l7Id, 'Venus', d9L7Id, SIGNS[(ascSignIdx + 1) % 12].lord, SIGNS[(ascSignIdx + 10) % 12].lord]);
    if (vivahaSignificators.has(ad)) {
      sc += 3;
      tags.push(`${ad} AD triggers 7th/Venus/2nd/11th`);
    }
    if (vivahaSignificators.has(md)) sc += 2;
    if (ad === 'Jupiter' || ad === 'Moon' || ad === 'Rahu') sc += 2;
    if (md === 'Saturn' && delayScore >= 3) {
      sc += 2; // Saturn MD delivers delayed marriage once mature!
      tags.push('Saturn MD matures delayed 7th axis');
    }
    if (ad === 'Venus' && !isVenDebilOrBalavastha) sc += 2;
    return {
      score: sc,
      reasonEn: tags[0] || `${md}–${ad} activates marital houses`,
      reasonHi: `${grahaHi(md)}–${grahaHi(ad)} दशा में विवाह योग सक्रिय`,
    };
  });

  const bestMar = marWindows[0];
  const altMar = marWindows.find((w) => w.mdLord !== bestMar?.mdLord || w.adLord !== bestMar?.adLord);
  const altWinEn = altMar && altMar.score >= 4
    ? ` OR ${Math.floor(altMar.ageStart)}–${Math.ceil(altMar.ageEnd + 1)} (${altMar.mdLord}–${altMar.adLord})`
    : '';
  const altWinHi = altMar && altMar.score >= 4
    ? ` अथवा आयु ${Math.floor(altMar.ageStart)}–${Math.ceil(altMar.ageEnd + 1)} वर्ष (${grahaHi(altMar.mdLord)}–${grahaHi(altMar.adLord)})`
    : '';
  const ageWindowTextEn = bestMar
    ? `Ages ${Math.floor(bestMar.ageStart)}–${Math.ceil(bestMar.ageEnd + 1)} (${bestMar.startYear}–${bestMar.endYear + 1}, ${bestMar.mdLord}–${bestMar.adLord} Dasha)${altWinEn}`
    : delayScore >= 5
      ? 'Ages 29–34 (post-Saturn maturity cycle) OR 34–37 (Jupiter/Venus transit)'
      : delayScore >= 3
        ? 'Ages 26–30 OR 30–32'
        : 'Ages 23–27 OR 27–29';
  const ageWindowTextHi = bestMar
    ? `आयु ${Math.floor(bestMar.ageStart)}–${Math.ceil(bestMar.ageEnd + 1)} वर्ष (${bestMar.startYear}–${bestMar.endYear + 1}, ${grahaHi(bestMar.mdLord)}–${grahaHi(bestMar.adLord)} दशा)${altWinHi}`
    : delayScore >= 5
      ? 'आयु 29–34 वर्ष (शनि परिपक्वता उपरांत) अथवा 34–37 वर्ष'
      : delayScore >= 3
        ? 'आयु 26–30 वर्ष अथवा 30–32 वर्ष'
        : 'आयु 23–27 वर्ष अथवा 27–29 वर्ष';

  let maritalStatusOverride: WeightedMarriageVerdict['maritalStatusOverride'];
  if (delayScore >= 5) {
    const d9Softens = d9VenusDignified || d9L7Dignified;
    maritalStatusOverride = {
      valEn: `Delayed / Late-Mature Marriage (${ageWindowTextEn}): Requires mutual patience & D9 harmony (${delayCuesEn.slice(0, 2).join('; ')})${d9Softens ? ' | OR / अथवा: Dignified D9 protects lasting emotional warmth after mature union' : ''}`,
      valHi: `विलंबित व परिपक्व आयु विवाह (${ageWindowTextHi}): धैर्य व नवांश तालमेल आवश्यक (${delayCuesHi.slice(0, 2).join('; ')})${d9Softens ? ' | अथवा: सबल D9 विवाह के बाद स्थिर स्नेह देता है' : ''}`,
      explEn: `Although 7th house may host benefics on paper, Classical Weighted Synthesis detects strong delay weights: ${delayCuesEn.join('; ')}. Consequently marriage manifests cleanly in mature adulthood around ${ageWindowTextEn} rather than early mid-20s.`,
      explHi: `सतही रूप से सप्तम में शुभ ग्रह होने पर भी ${delayCuesHi.join('; ')} के कारण विवाह में स्वाभाविक विलंब होता है और ${ageWindowTextHi} के आसपास विवाह संपन्न होता है।`,
    };
  } else if (delayScore >= 3) {
    maritalStatusOverride = {
      valEn: `Balanced Mature-Age Wedlock (${ageWindowTextEn}): Steadies with patience after early delays | OR / अथवा: Earlier partnership possible if strong Dasha sub-period triggers`,
      valHi: `संतुलित परिपक्व विवाह योग (${ageWindowTextHi}): प्रारंभिक प्रतीक्षा के बाद स्थिर दांपत्य | अथवा: अनुकूल अंतर्दशा में थोड़ा शीघ्र संयोग संभव`,
      explEn: `Moderate delay indicators (${delayCuesEn.join('; ')}) shift union timing into late twenties / early thirties (${ageWindowTextEn}).`,
      explHi: `मध्यम विलंब कारक (${delayCuesHi.join('; ')}) विवाह समय को ${ageWindowTextHi} की ओर ले जाते हैं।`,
    };
  }

  // Dynamic Spouse Age Parity (7 options instead of 3!)
  const satL7Link = Boolean(
    saturn &&
      (isSatStrongOrOn7 ||
        (venus && ((venus.rasiHouseNumber ?? venus.houseNumber) === (saturn.rasiHouseNumber ?? saturn.houseNumber))) ||
        (venus && [3, 7, 10].includes(((venus.signIndex - saturn.signIndex + 12) % 12) + 1)) ||
        (jupiter && [7, 10].includes(jupiter.rasiHouseNumber ?? jupiter.houseNumber ?? 0) && jupiter.isRetrograde))
  );
  let spouseAgeParity: WeightedMarriageVerdict['spouseAgeParity'];
  if (delayScore >= 4.5 && (isVenDebilOrBalavastha || saturn?.rasiHouseNumber === 2 || isSatStrongOrOn7 || isJup7RetroOrKhala)) {
    spouseAgeParity = {
      valEn: `Mature or Slightly Older Spouse (+1 to +4 yrs) OR Substantial Maturity Gap: Weak/Balavastha Venus + Saturn Rank #${satShad?.rank ?? 1}/7 / D9 Saturn-8th-11th signature`,
      valHi: `परिपक्व अथवा आयु में १ से ४ वर्ष बड़ा जीवनसाथी या गंभीर मानसिक परिपक्वता: कमजोर/बालावस्था शुक्र एवं प्रबल शनि (#${satShad?.rank ?? 1}) प्रभाव`,
      explEn: `Classical Jyotish states that when Venus lacks Shadbala/Baladi strength (or is debilitated/Balavastha) while Saturn holds Rank #1–2 or aspects the 7th/Venus/D9 marriage axis, the partner tends to be older by 1–4 years or markedly mature and self-possessed.`,
      explHi: `शास्त्रीय सिद्धांत के अनुसार जब शुक्र बालावस्था/नीच या कमजोर हो और शनि प्रबल (#${satShad?.rank ?? 1}) होकर सप्तम/शुक्र या D9 विवाह अक्ष को प्रभावित करे, तो जीवनसाथी आयु में बड़ा (1–4 वर्ष) अथवा अत्यंत परिपक्व स्वभाव का होता है।`,
    };
  } else if (satL7Link) {
    spouseAgeParity = {
      valEn: `Notable 3–6 Year Maturity Gap (Older or Senior-Minded Partner): Saturn aspects/governs 7th or Venus axis`,
      valHi: `३ से ६ वर्ष का परिपक्व आयु अंतर (वरिष्ठ या गंभीर जीवनसाथी): शनि का सप्तम/शुक्र प्रभाव`,
      explEn: `Saturnine weight on the marital axis attracts a grounded, pragmatic partner several years older or far beyond their age in wisdom.`,
      explHi: `विवाह भाव पर शनि का प्रभाव गंभीर, जिम्मेदार और अनुभवी जीवनसाथी का संयोग बनाता है।`,
    };
  } else if (mercury && ((mercury.rasiHouseNumber ?? mercury.houseNumber) === 7 || l7Id === 'Mercury')) {
    spouseAgeParity = {
      valEn: `Near-Peer Age Parity (0 to 1.5 yrs): Youthful, witty, intellectually matched companionship (Mercury/7th)`,
      valHi: `लगभग समवयस्क (० से १.५ वर्ष अंतर): युवा, चंचल और मित्रवत बौद्धिक तालमेल`,
      explEn: `Mercurial influence on the 7th house favors equal-age peer friendship and playful dialogue.`,
      explHi: `सप्तम भाव पर बुध के प्रभाव से जीवनसाथी लगभग समान आयु का व मित्रवत् होता है।`,
    };
  } else if (venus && [1, 5, 7, 11].includes(venus.rasiHouseNumber ?? venus.houseNumber ?? 0) && !isVenDebilOrBalavastha) {
    spouseAgeParity = {
      valEn: `Slightly Younger Partner (2 to 4 yrs): Radiant, aesthetic & affectionate companionship (Strong Venus)`,
      valHi: `२ से ४ वर्ष छोटा जीवनसाथी: आकर्षक, स्नेही व सौंदर्यप्रिय स्वभाव (सबल शुक्र)`,
      explEn: `Strong Venusian rays bestow a vibrant, charming partner typically 2–4 years younger.`,
      explHi: `सबल शुक्र के प्रभाव से जीवनसाथी युवा, आकर्षक और सौम्य होता है।`,
    };
  } else if (mars && ((mars.rasiHouseNumber ?? mars.houseNumber) === 7 || l7Id === 'Mars')) {
    spouseAgeParity = {
      valEn: `Close Dynamic Parity (1 to 3 yrs): Active, outspoken partner matching the native's pace`,
      valHi: `१ से ३ वर्ष का ऊर्जावान अंतर: सक्रिय, कर्मठ व स्पष्टवादी जीवनसाथी`,
      explEn: `Martian drive on the 7th favors close age parity with strong mutual independence.`,
      explHi: `सप्तम में मंगल की ऊर्जा समकक्ष व कर्मठ जीवनसाथी देती है।`,
    };
  } else {
    spouseAgeParity = {
      valEn: `Balanced Standard Parity (1.5 to 3.5 yrs): Harmonious generational alignment (H7 SAV ${h7.savBindus})`,
      valHi: `संतुलित सामान्य आयु अंतर (१.५ से ३.५ वर्ष): पारस्परिक आदर व सहज समझदारी`,
      explEn: `7th lord ${l7Id} (Rank #${l7Shad?.rank ?? '-'}) and Venus maintain healthy age balance.`,
      explHi: `सप्तमेश ${grahaHi(l7Id)} और शुक्र की स्थिति जीवनसाथी के साथ आदर्श आयु तालमेल रखती है।`,
    };
  }

  // Dynamic D9 Resilience (6+ unique variations incorporating actual D9 planets + SAV!)
  const d9Resilience = {
    valEn:
      delayScore >= 5
        ? `D1 (H7 SAV ${h7.savBindus}) + D9 (${d9VenHouseOcc.map((p) => p.id).join('+') || 'Afflicted'}): Delayed Union (${ageWindowTextEn}); conscious dialogue & Venus-Jupiter balance protect longevity`
        : delayScore >= 3
          ? `Moderate D1/D9 Calibration (H7 SAV ${h7.savBindus}, L7 Rank #${l7Shad?.rank ?? '-'}): Union stabilizes after age 26–29 with open expectations`
          : d9H7Occ.some((p) => ['Jupiter', 'Venus', 'Mercury'].includes(p.id))
            ? `Strong D9 Benefic Protection (${d9H7Occ.map((p) => p.id).join(', ')} in D9 H7; D1 SAV ${h7.savBindus}): Enduring domestic harmony`
            : `Balanced D1–D9 Resilience (D1 H7 SAV ${h7.savBindus}, D9 Lagna ${SIGN_HI[d9LagnaIdx]}): Routine communication keeps wedlock resilient`,
    valHi:
      delayScore >= 5
        ? `D1 (सप्तम SAV ${h7.savBindus}) + D9 परीक्षा: परिपक्व आयु विवाह (${ageWindowTextHi}); संवाद व शुक्र-गुरु शांति से स्थायित्व`
        : delayScore >= 3
          ? `मध्यम D1/D9 संतुलन (सप्तम SAV ${h7.savBindus}): २६–२९ वर्ष के बाद धैर्यपूर्ण तालमेल से सुखद दांपत्य`
          : d9H7Occ.some((p) => ['Jupiter', 'Venus', 'Mercury'].includes(p.id))
            ? `प्रबल D9 शुभ संरक्षण (नवांश सप्तम में शुभ ग्रह, SAV ${h7.savBindus}): दीर्घकालिक दांपत्य सौहार्द`
            : `संतुलित D1–D9 सुरक्षा (सप्तम SAV ${h7.savBindus}): नियमित आत्मीय संवाद से मजबूत रिश्ता`,
    explEn: `Cross-verifies D1 H7 SAV (${h7.savBindus} bindus), Venus (${venus?.dignity}, Shadbala Rank #${venShad?.rank ?? '-'}/7), and D9 (${d9VenHouseOcc.map((p) => p.id).join('+') || 'Clean'}). ${delayCuesEn.length > 0 ? `Delay weights: ${delayCuesEn.join(', ')}.` : ''}`,
    explHi: `D1 सप्तम SAV (${h7.savBindus}), शुक्र रैंक #${venShad?.rank ?? '-'}/7 और नवांश D9 के समन्वित परीक्षण पर आधारित।`,
  };

  // Dynamic Bed Pleasure (6+ variations instead of 3!)
  const h12OccNames = (ctx.planetsById ? Array.from(ctx.planetsById.values()).filter((p) => (p.rasiHouseNumber ?? p.houseNumber) === 12).map((p) => p.id) : []);
  const h12CombustMerc = h12OccNames.includes('Mercury') && mercury?.isCombust;
  let bedEn = `Balanced Shayana Sukha (H12 SAV ${h12.savBindus}, Venus Rank #${venShad?.rank ?? '-'}/7): Steady affection deepens with emotional safety`;
  let bedHi = `संतुलित शयन सुख (द्वादश SAV ${h12.savBindus}, शुक्र रैंक #${venShad?.rank ?? '-'}): विश्वास व भावनात्मक निकटता से संतोष`;
  if (h12.savBindus >= 30 && !isVenDebilOrBalavastha) {
    bedEn = `Rich Shayana Sukha & Intimate Fulfillment (H12 SAV ${h12.savBindus}, Venus ${venus?.dignity}): Warm romantic chemistry and restful intimacy`;
    bedHi = `प्रबल शयन सुख व आत्मीय आनंद (द्वादश SAV ${h12.savBindus}, शुक्र ${venus?.dignity}): प्रगाढ़ प्रेम व संतुष्टिदायक दांपत्य`;
  } else if (isVenDebilOrBalavastha && (venusClusteredMaleficD9 || h12CombustMerc)) {
    bedEn = `Reserved / Mentally-Mediated Intimacy (Venus ${venus?.dignity} + D12/H12 SAV ${h12.savBindus}): Overthinking or work fatigue cools spontaneity — gentle emotional closeness unlocks passion`;
    bedHi = `संयमित व मानसिक-प्रधान अंतरंगता (शुक्र ${venus?.dignity}, द्वादश SAV ${h12.savBindus}): कार्य-थकान या अति-चिंतन से दूरी — भावनात्मक निकटता से सुख में वृद्धि`;
  } else if (h12OccNames.includes('Mars') || h12OccNames.includes('Rahu') || (mars && [7, 12].includes(mars.rasiHouseNumber ?? 0))) {
    bedEn = `High-Voltage Passionate Drive (${h12OccNames.join('+') || 'Mars'} on Shayana axis, SAV ${h12.savBindus}): Intense desire that flourishes with mindful tenderness`;
    bedHi = `तीव्र कामुक ऊर्जा (${h12OccNames.map(grahaHi).join('+') || 'मंगल'} द्वादश प्रभाव, SAV ${h12.savBindus}): प्रबल आकर्षण जिसे धैर्य व कोमलता संतुलित करती है`;
  } else if (h12OccNames.includes('Saturn') || h12OccNames.includes('Ketu')) {
    bedEn = `Disciplined, Minimalist Intimacy (${h12OccNames.map(grahaHi).join('+')} in H12, SAV ${h12.savBindus}): Prioritizes spiritual loyalty & quiet closeness over frequency`;
    bedHi = `संयमित व मर्यादित शयन सुख (द्वादश में ${h12OccNames.map(grahaHi).join('+')}, SAV ${h12.savBindus}): आध्यात्मिक निष्ठा व शांत साथ को प्राथमिकता`;
  } else if (h12OccNames.includes('Venus') || h12OccNames.includes('Moon') || h12OccNames.includes('Jupiter')) {
    bedEn = `Gentle Aesthetic Intimacy (${h12OccNames.join('+')} in H12, SAV ${h12.savBindus}): Tender romantic expression and emotional warmth`;
    bedHi = `सौम्य कलात्मक शयन सुख (द्वादश में ${h12OccNames.map(grahaHi).join('+')}, SAV ${h12.savBindus}): कोमल स्नेह व भावनात्मक संतुष्टि`;
  }

  // Dynamic Multiple Marriage (6+ unique variations with real D1/D9/SAV score!)
  const multiReasons: string[] = [];
  if (h7.signIndex % 3 === 2) multiReasons.push('Dual 7th Sign');
  if (d9Venus && [2, 5, 8, 11].includes(d9Venus.signIndex)) multiReasons.push('D9 Dual Venus');
  if (venusClusteredMaleficD9) multiReasons.push(`D9 Venus+${d9VenHouseOcc.filter((p) => p.id !== 'Venus').map((p) => p.id).join('+')}`);
  if (isH7LowSav) multiReasons.push(`Low H7 SAV (${h7.savBindus})`);
  if (rahu && (rahu.rasiHouseNumber ?? 0) === 7) multiReasons.push('Rahu H7');
  const multiScore = multiReasons.length;

  const multiMarriage = {
    valEn:
      multiScore >= 4
        ? `Multi-Chapter Relationship Signals (${multiReasons.slice(0, 3).join(', ')}): High discernment & mature D9 compatibility vital`
        : multiScore === 3
          ? `Moderate Relationship-Reset Tendency (${multiReasons.join(', ')}): Conscious commitment anchors single union`
          : multiScore === 2
            ? `Low-Moderate Restlessness (${multiReasons.join(', ')}): Single-marriage stability preserved through honest expectations`
            : h7.savBindus >= 30
              ? `Fortified Ek-Vivaha (Single-Marriage) Yoga (H7 SAV ${h7.savBindus}): Strong lifelong one-partner fidelity`
              : `Steady Ek-Vivaha Stability (H7 SAV ${h7.savBindus}, L7 ${l7Id}): Balanced devotion toward one life partner`,
    valHi:
      multiScore >= 4
        ? `द्वि-विवाह / पुनर्संयोग संकेत (${multiScore} कारक): परिपक्व निर्णय व सूक्ष्म D9 मिलान अनिवार्य`
        : multiScore === 3
          ? `मध्यम संबंध-परीक्षण संकेत (${multiScore} कारक): धैर्य व निष्ठा से एक-विवाह में पूर्ण स्थायित्व`
          : multiScore === 2
            ? `न्यून-मध्यम चंचलता (${multiScore} कारक): स्पष्ट अपेक्षाओं से एक-विवाह सुरक्षित`
            : h7.savBindus >= 30
              ? `प्रबल एक-विवाह योग (सप्तम SAV ${h7.savBindus}): आजीवन एकनिष्ठ दांपत्य सुख`
              : `संतुलित एक-विवाह स्थायित्व (सप्तम SAV ${h7.savBindus}): जीवनसाथी के प्रति निष्ठावान बंधन`,
    explEn: `Synthesizes Dual signs, D1 H7 SAV (${h7.savBindus}), Venus (${venus?.dignity}), and D9 clusters (${multiReasons.join('; ') || 'Clean D1/D9 single-union axis'}).`,
    explHi: `द्विस्वभाव राशियों, D1 सप्तम SAV (${h7.savBindus}), शुक्र व D9 ग्रह-योग का समन्वित परीक्षण।`,
  };

  // Dynamic Divorce / Separation Resilience (6+ unique outputs factoring D9, H7 SAV, Venus/Saturn!)
  const discFlags: string[] = [];
  if (isH7LowSav) discFlags.push(`H7 SAV ${h7.savBindus}`);
  if (isVenDebilOrBalavastha) discFlags.push(`Weak Venus (${venShad?.ishtaNet ?? '-'} IshtaNet)`);
  if (venusClusteredMaleficD9) discFlags.push('D9 Venus-Malefic cluster');
  if (ketu && [7, 12].includes(ketu.rasiHouseNumber ?? 0)) discFlags.push('Ketu detachment');
  if (mars && saturn && (mars.rasiHouseNumber === 7 || saturn.rasiHouseNumber === 7)) discFlags.push('Saturn/Mars on 7th');
  if (h2.savBindus <= 24) discFlags.push(`H2 SAV ${h2.savBindus}`);

  const divorceResilience = {
    valEn:
      discFlags.length >= 4 && !isJup7RetroOrKhala && jupiter?.rasiHouseNumber !== 7
        ? `High Friction / Separation Vigilance (${discFlags.slice(0, 3).join(', ')}): Active counseling & patience vital`
        : discFlags.length >= 3 && (jupiter?.rasiHouseNumber === 7 || ctx.bhavaByHouse.get(9)!.savBindus >= 27)
          ? `Tested Adjustment Shielded by Dharma/Jupiter (${discFlags.slice(0, 2).join(', ')}): Periodic emotional distance resolves via mutual patience`
          : discFlags.length === 2
            ? `Moderate Friction Cushion (${discFlags.join(', ')}): Mature dialogue dissolves ego/expectation gaps`
            : discFlags.length === 1
              ? `High Marital Continuity with Minor Check (${discFlags[0]}): Steady respect protects household peace`
              : `Strong Marital Continuity Shield (H2 SAV ${h2.savBindus}, H7 SAV ${h7.savBindus}): Very low separation risk`,
    valHi:
      discFlags.length >= 4 && jupiter?.rasiHouseNumber !== 7
        ? `उच्च वैचारिक तनाव सतर्कता (${discFlags.length} कारक): परामर्श, धैर्य व मिलान अत्यंत आवश्यक`
        : discFlags.length >= 3
          ? `परीक्षापूर्ण किंतु गुरु/धर्म द्वारा रक्षित दांपत्य (SAV H7 ${h7.savBindus}): परस्पर धैर्य से तनाव शांत`
          : discFlags.length === 2
            ? `मध्यम तालमेल परीक्षण (H7 SAV ${h7.savBindus}): खुले संवाद से सहज समाधान`
            : discFlags.length === 1
              ? `सुदृढ़ दांपत्य सुरक्षा (सामान्य सतर्कता): सम्मान व संवाद से शांति`
              : `अत्यंत सुरक्षित दांपत्य निरंतरता (H2 SAV ${h2.savBindus}, H7 SAV ${h7.savBindus})`,
    explEn: `Evaluates H7 SAV (${h7.savBindus}), H2 Kutumba SAV (${h2.savBindus}), Venus Shadbala/D9 cluster, and protective Jupiter influence.`,
    explHi: `द्वितीय व सप्तम SAV, शुक्र बल, D9 स्थिति व गुरु रक्षण का संयुक्त विश्लेषण।`,
  };

  return {
    delayScore,
    timingWindowEn: ageWindowTextEn,
    timingWindowHi: ageWindowTextHi,
    maritalStatusOverride,
    spouseAgeParity,
    d9Resilience,
    bedPleasure: {
      valEn: bedEn,
      valHi: bedHi,
      explEn: `Derived from H12 SAV (${h12.savBindus} bindus), H12 occupants (${h12OccNames.join(', ') || 'Empty'}), Venus Rank #${venShad?.rank ?? '-'}/7 (${venAv?.baladi.split(' ')[0] ?? 'Balanced'}), and D9.`,
      explHi: `द्वादश SAV (${h12.savBindus} बिंदु), द्वादश स्थित ग्रह व शुक्र की अवस्था/षड्बल पर आधारित।`,
    },
    multiMarriage,
    divorceResilience,
  };
}



// =============================================================================
// SYNTHESIS EVALUATOR 3: PROGENY / SANTAN AXIS (H5 Bhavabala + 6L-in-5 + D7 + Guru BAV)
// =============================================================================
export interface WeightedProgenyVerdict {
  obstructionScore: number;
  childrenYoga: { valEn: string; valHi: string; explEn: string; explHi: string };
  conceiveTiming: { valEn: string; valHi: string; explEn: string; explHi: string };
  filialBonding: { valEn: string; valHi: string; explEn: string; explHi: string };
}

export function evaluateWeightedProgenyAxis(
  ctx: ClassicalSynthesisContext,
  ascSignIdx: number
): WeightedProgenyVerdict {
  const h5 = ctx.bhavaByHouse.get(5)!;
  const h9 = ctx.bhavaByHouse.get(9)!;
  const l5Id = SIGNS[(ascSignIdx + 4) % 12].lord;
  const l6Id = SIGNS[(ascSignIdx + 5) % 12].lord;
  const l8Id = SIGNS[(ascSignIdx + 7) % 12].lord;
  const l12Id = SIGNS[(ascSignIdx + 11) % 12].lord;

  const l5 = ctx.planetsById.get(l5Id);
  const jupiter = ctx.planetsById.get('Jupiter');
  const saturn = ctx.planetsById.get('Saturn');
  const rahu = ctx.planetsById.get('Rahu');
  const ketu = ctx.planetsById.get('Ketu');
  const mars = ctx.planetsById.get('Mars');

  const jupShad = ctx.shadbalaByPlanet.get('Jupiter');
  const jupAv = ctx.avasthaByPlanet.get('Jupiter');
  const l5Shad = ctx.shadbalaByPlanet.get(l5Id);
  const h5Occ = Array.from(ctx.planetsById.values()).filter((p) => (p.rasiHouseNumber ?? p.houseNumber) === 5);

  const d7LagnaIdx = ctx.getVargaPlacement('D7', 'Asc')?.signIndex ?? ascSignIdx;
  const d7H5Occ = ctx.getVargaOccupants('D7', 5);
  const d7HasKetuSatRahuIn5 = d7H5Occ.some(
    (p) => ['Ketu', 'Saturn', 'Rahu', 'Mars'].includes(p.id) && p.dignity !== 'Exalted'
  );
  const d7HasJupRIn5 = d7H5Occ.some((p) => p.id === 'Jupiter') && Boolean(jupiter?.isRetrograde);

  const l6In5 = h5Occ.some((p) => p.id === l6Id);
  const l8In5 = h5Occ.some((p) => p.id === l8Id);
  const l12In5 = h5Occ.some((p) => p.id === l12Id);
  const satRahuKetuIn5 = h5Occ.some((p) => ['Saturn', 'Rahu', 'Ketu'].includes(p.id));
  const fifthFromJupIdx = jupiter ? (jupiter.signIndex + 4) % 12 : h5.signIndex;
  const jupBav5 = ctx.getBavBindus('Jupiter', ((fifthFromJupIdx - ascSignIdx + 12) % 12) + 1);

  const beejaStr = ctx.avasthaReport?.beejaSphuta?.strengthNote || '';
  const kshetraStr = ctx.avasthaReport?.kshetraSphuta?.strengthNote || '';

  let obstructionScore = 0;
  const obsEn: string[] = [];
  const obsHi: string[] = [];

  if (l6In5 || l8In5 || l12In5) {
    obstructionScore += 2.5;
    const which = l6In5 ? `6th lord ${l6Id}` : l8In5 ? `8th lord ${l8Id}` : `12th lord ${l12Id}`;
    obsEn.push(`${which} placed in H5 (Dusthana obstruction)`);
    obsHi.push(`पंचम भाव में त्रिकेश (${grahaHi(l6In5 ? l6Id : l8In5 ? l8Id : l12Id)}) की स्थिति`);
  }
  if (h5.netDrishtiVirupas < -10 || (h5.bhavaRow && h5.bhavaRow.bhavaDrishtiBalaVirupas < -5)) {
    obstructionScore += 1.5;
    obsEn.push(`Negative H5 Drishti Bala (${h5.bhavaRow?.bhavaDrishtiBalaVirupas ?? h5.netDrishtiVirupas} virupas)`);
    obsHi.push(`पंचम भाव पर ऋणात्मक दृष्टि बल`);
  }
  if (d7HasKetuSatRahuIn5) {
    obstructionScore += 2.0;
    obsEn.push(`D7 Saptamsha H5 holds ${d7H5Occ.map((p) => p.id).join('+')}`);
    obsHi.push(`D7 सप्तांश पंचम में ${d7H5Occ.map((p) => grahaHi(p.id)).join('+')}`);
  }
  if (satRahuKetuIn5) {
    obstructionScore += 2.0;
    obsEn.push(`Saturn/Node in D1 H5`);
    obsHi.push(`जन्म कुंडली पंचम में शनि/राहु-केतु`);
  }
  if (l5 && [6, 8, 12].includes(l5.rasiHouseNumber ?? l5.houseNumber ?? 1)) {
    obstructionScore += 1.5;
    obsEn.push(`5th lord ${l5Id} in H${l5.rasiHouseNumber ?? l5.houseNumber}`);
    obsHi.push(`पंचमेश ${grahaHi(l5Id)} त्रिक भाव में`);
  }
  if (jupAv && (jupAv.baladi.startsWith('Vriddha') || avIsWeak(jupAv) || jupiter?.isRetrograde)) {
    obstructionScore += 1.0;
    obsEn.push(`Putrakaraka Jupiter ${jupiter?.isRetrograde ? 'Retrograde ' : ''}(${jupAv.baladi.split(' ')[0]}/${jupAv.deeptadi.split(' ')[0]})`);
    obsHi.push(`पुत्रकारक गुरु ${jupiter?.isRetrograde ? 'वक्री/' : ''}${jupAv.baladi.split(' ')[0]}`);
  }
  if (h5.savBindus <= 24) {
    obstructionScore += 1.0;
    obsEn.push(`H5 SAV ${h5.savBindus}`);
    obsHi.push(`पंचम SAV ${h5.savBindus}`);
  }
  if (l5Shad && l5Shad.rank >= 6) {
    obstructionScore += 1.0;
    obsEn.push(`5th lord Rank #${l5Shad.rank}/7`);
    obsHi.push(`पंचमेश रैंक #${l5Shad.rank}/7`);
  }
  // High-fertility / D7 Trikona-Exalted 5th lord mitigation (empty D1 H5 + abundant SAV >= 33 + strong D7 5th-lord!)
  const d7L5Id = SIGNS[(d7LagnaIdx + 4) % 12].lord;
  const d7L5Placement = ctx.getVargaPlacement('D7', d7L5Id);
  const d7L5ExaltedInTrikona = Boolean(
    d7L5Placement &&
      ['Exalted', 'Own Sign', 'Moolatrikona'].includes(d7L5Placement.dignity) &&
      [1, 4, 5, 7, 9, 10, 11].includes(d7L5Placement.houseFromVargaLagna)
  );
  const mitEn: string[] = [];
  const mitHi: string[] = [];
  if (h5.savBindus >= 33 && !l6In5 && !l8In5 && !satRahuKetuIn5) {
    obstructionScore -= 1.5;
    mitEn.push(`Strong H5 SAV (${h5.savBindus} bindus)`);
    mitHi.push(`प्रबल पंचम SAV (${h5.savBindus})`);
  }
  if (d7L5ExaltedInTrikona && !l6In5 && !l8In5 && !satRahuKetuIn5) {
    obstructionScore -= 1.8;
    mitEn.push(`D7 5th lord ${d7L5Id} fortified (${d7L5Placement?.dignity})`);
    mitHi.push(`D7 पंचमेश ${grahaHi(d7L5Id)} (${d7L5Placement?.dignity})`);
  }
  if (jupBav5 >= 5 && !l6In5 && !l8In5) {
    obstructionScore -= 0.7;
    mitEn.push(`Guru 5th BAV ${jupBav5}`);
    mitHi.push(`गुरु BAV ${jupBav5}`);
  }
  obstructionScore = Math.max(0, obstructionScore);

  // Jupiter strong 5th/9th drishti on H5 mitigates
  const jupCleanlyAspects5 = Boolean(
    jupiter &&
      !jupiter.isRetrograde &&
      !(jupAv && avIsWeak(jupAv)) &&
      [1, 5, 9, 11].includes(jupiter.rasiHouseNumber ?? 0)
  );
  if (jupCleanlyAspects5 && !l6In5 && !l8In5) {
    obstructionScore = Math.max(0, obstructionScore - 1.5);
    mitEn.push('Jupiter aspects/fortifies 5th axis');
    mitHi.push('गुरु का शुभ पंचम संबंध');
  }

  // Compute Progeny Dasha Windows (after 24 and up to 44)
  const progWindows = ctx.findBestDashaWindows(obstructionScore >= 3.5 ? 30 : 25, 44, (md, ad) => {
    let sc = 0;
    if (ad === l5Id || ad === 'Jupiter' || ad === SIGNS[(ascSignIdx + 8) % 12].lord) sc += 3;
    if (md === l5Id || md === 'Jupiter' || md === SIGNS[(ascSignIdx + 8) % 12].lord) sc += 2;
    if (ad === 'Venus' || ad === 'Mercury') sc += 1;
    return sc > 0
      ? {
          score: sc,
          reasonEn: `${md}–${ad} activates 5th/9th/Jupiter Putra axis`,
          reasonHi: `${grahaHi(md)}–${grahaHi(ad)} दशा में संतान भाव सक्रिय`,
        }
      : { score: 0, reasonEn: '', reasonHi: '' };
  });
  const progWin = progWindows[0];

  // 6+ Children Yoga tiers! (Self-consistent: mitigated obstructions never masquerade as zero-friction!)
  let yogaValEn = '';
  let yogaValHi = '';
  if (obstructionScore >= 5.5) {
    yogaValEn = `Significant Santan-Badha / Obstruction Signature (${obsEn.slice(0, 3).join('; ')}): Late/assisted conception or medical fertility partnership strongly advised`;
    yogaValHi = `प्रबल संतान-बाधा / विलंब योग (${obsHi.slice(0, 3).join('; ')}): विलंबित, चिकित्सकीय सहायता (IVF) अथवा विशेष गुरु-संतान गोपाल उपाय अपेक्षित`;
  } else if (obstructionScore >= 3.5) {
    yogaValEn = `Santan Vilamba (Delayed / Effort-Tested Progeny: ${obsEn.slice(0, 2).join('; ')}): Materializes at mature age with medical & Jupiterian care`;
    yogaValHi = `संतान विलंब व परीक्षा योग (${obsHi.slice(0, 2).join('; ')}): परिपक्व आयु में चिकित्सा व गुरु-उपाय से संतान सुख`;
  } else if (obstructionScore >= 2.0) {
    yogaValEn = `Moderate Effort Putrabhava (H5 SAV ${h5.savBindus}, 5th-from-Guru BAV ${jupBav5}): Minor timing adjustments before smooth conception`;
    yogaValHi = `मध्यम प्रयास संतान योग (पंचम SAV ${h5.savBindus}): सामान्य विलंब उपरांत संतान प्राप्ति`;
  } else if (obsEn.length > 0 && mitEn.length > 0) {
    yogaValEn = `Balanced / Cushion-Mitigated Putrabhava (${mitEn[0]} cushions ${obsEn[0]}): Natural progeny favored with measured timing OR / अथवा medical guidance`;
    yogaValHi = `संतुलित एवं संभलित संतान योग (${mitHi[0]} द्वारा ${obsHi[0]} का शमन): उचित समय पर प्राकृतिक संतति अथवा चिकित्सकीय परामर्श लाभकारी`;
  } else if (h5.savBindus >= 30 && !satRahuKetuIn5) {
    yogaValEn = `Abundant & Blessed Putrabhava Yoga (H5 SAV ${h5.savBindus}, D7 Lagna ${SIGNS[d7LagnaIdx].name}): Smooth natural conception & proud lineage`;
    yogaValHi = `संपन्न व उर्वर संतान योग (पंचम SAV ${h5.savBindus}): सहज गर्भधारण व कुल की समृद्धि`;
  } else {
    yogaValEn = `Favorable Santan Prapti Yoga (5th Lord ${l5Id} in H${l5?.rasiHouseNumber ?? '-'}, Jupiter Rank #${jupShad?.rank ?? '-'}/7): Natural progeny fulfillment`;
    yogaValHi = `शुभ संतान प्राप्ति योग (पंचमेश भाव ${l5?.rasiHouseNumber ?? '-'}, गुरु रैंक #${jupShad?.rank ?? '-'}): समयानुसार संतान सुख`;
  }

  // Dynamic Conceive Timing (6+ tiers driven by real Vimshottari!)
  const winStrEn = progWin
    ? `Ages ${Math.floor(progWin.ageStart)}–${Math.ceil(progWin.ageEnd + 1)} (${progWin.startYear}–${progWin.endYear + 1}, ${progWin.mdLord}–${progWin.adLord} Dasha)`
    : obstructionScore >= 4
      ? 'Ages 34–40+'
      : 'Ages 27–32';
  const winStrHi = progWin
    ? `आयु ${Math.floor(progWin.ageStart)}–${Math.ceil(progWin.ageEnd + 1)} वर्ष (${progWin.startYear}–${progWin.endYear + 1}, ${grahaHi(progWin.mdLord)}–${grahaHi(progWin.adLord)} दशा)`
    : obstructionScore >= 4
      ? 'आयु 34–40+ वर्ष'
      : 'आयु 27–32 वर्ष';

  const conceiveTiming = {
    valEn:
      obstructionScore >= 5.5
        ? `Delayed / Extended Fertility Window: ${winStrEn} alongside medical fertility planning & Santana Gopala Upasana`
        : obstructionScore >= 3.5
          ? `Mature-Age Conception Window: ${winStrEn} during Jupiter / 5th-Lord Antardasha & Guru Gochar`
          : obstructionScore >= 2.0
            ? `Measured Conception Window: ${winStrEn} once minor 5th-axis blocks clear`
            : h5.savBindus >= 30
              ? `Early-to-Timely Auspicious Window: ${winStrEn} under direct Guru Gochar`
              : `Balanced Conception Window: ${winStrEn} aligned with benefic sub-periods`,
    valHi:
      obstructionScore >= 5.5
        ? `विलंबित व संवेदनशील गर्भधारण काल: ${winStrHi} (चिकित्सकीय परामर्श व संतान गोपाल साधना सहित)`
        : obstructionScore >= 3.5
          ? `परिपक्व आयु गर्भधारण समय: ${winStrHi} (गुरु/पंचमेश दशा व गोचर में)`
          : obstructionScore >= 2.0
            ? `संतुलित प्रतीक्षा उपरांत समय: ${winStrHi}`
            : h5.savBindus >= 30
              ? `शीघ्र व शुभ गर्भधारण काल: ${winStrHi}`
              : `समयबद्ध अनुकूल काल: ${winStrHi}`,
    explEn: `Computed dynamically from Vimshottari Dasha, H5 SAV (${h5.savBindus}), 5th-from-Jupiter BAV (${jupBav5}), and D7 H5 (${d7H5Occ.map((p) => p.id).join(', ') || 'Clear'}).`,
    explHi: `विंशोत्तरी दशा, पंचम SAV (${h5.savBindus}), गुरु से पंचम BAV (${jupBav5}) व D7 सप्तांश द्वारा वास्तविक संतान समय की गणना।`,
  };

  // Dynamic Filial Bonding (6+ distinct outputs instead of 2!)
  let bondValEn = '';
  let bondValHi = '';
  if (obstructionScore >= 5) {
    bondValEn = `Deeply Cherished / Hard-Won Bond: Intense longing, protective devotion & patient generational empathy (H5/D7 tested)`;
    bondValHi = `अमूल्य व गहन स्नेहपूर्ण संबंध: दीर्घ प्रतीक्षा के बाद प्राप्त संतान अथवा शिष्य-वत्सलता के प्रति विशेष ममत्व`;
  } else if (h5Occ.some((p) => p.id === 'Mars') && !l6In5) {
    bondValEn = `Spirited, Active & Candid Bond (Mars in H5): High-energy debates paired with fierce loyalty`;
    bondValHi = `ऊर्जावान व स्पष्टवादी संतान संबंध (पंचम मंगल): स्वतंत्र विचार व प्रबल पारिवारिक निष्ठा`;
  } else if (saturn && (saturn.rasiHouseNumber === 5 || h5Occ.some((p) => p.id === 'Ketu' || p.id === 'Rahu'))) {
    bondValEn = `Respectful Yet Independent Generation Gap (Saturn/Node H5): Children pursue autonomous paths with quiet mutual care`;
    bondValHi = `स्वतंत्र व वैचारिक दूरी वाला स्नेह (पंचम शनि/राहु-केतु): संतान अपने स्वतंत्र मार्ग चुनती है, फिर भी आदर बना रहता है`;
  } else if (h5Occ.some((p) => p.id === 'Jupiter' || p.id === 'Venus' || p.id === 'Moon')) {
    bondValEn = `Cultured, Affectionate & Harmonious Devotion (${h5Occ.map((p) => p.id).join('+')} H5): Expressive warmth & shared values`;
    bondValHi = `सुसंस्कृत, मधुर व स्नेहमय भक्ति (पंचम में शुभ ग्रह): परस्पर आदर, कला व साझा जीवन मूल्य`;
  } else if (h9.savBindus >= 29) {
    bondValEn = `Dharmic & Reverent Filial Camaraderie (Strong 9th/5th Axis): Shared family traditions and lifelong mutual respect`;
    bondValHi = `धर्म-प्रधान व आदरयुक्त संतान सानिध्य (सबल नवम-पंचम): कुल-परंपरा का सम्मान व आजीवन सहयोग`;
  } else {
    bondValEn = `Balanced Mentorship-Style Parent-Child Rapport: Practical encouragement balanced with healthy autonomy`;
    bondValHi = `मित्रवत व मार्गदर्शक संबंध: व्यावहारिक सहयोग और संतुलित स्वतंत्रता का सुंदर मेल`;
  }

  return {
    obstructionScore,
    childrenYoga: {
      valEn: yogaValEn,
      valHi: yogaValHi,
      explEn: `Classical Multi-Factor Progeny Audit: ${obsEn.length > 0 ? obsEn.join('; ') + '. ' : ''}H5 Bhava Rank #${h5.bhavaRow?.rank ?? '-'}/12, H5 SAV ${h5.savBindus}, D7 Lagna ${SIGNS[d7LagnaIdx].name} (D7 H5: ${d7H5Occ.map((p) => p.id).join(', ') || 'Clean'}), ${beejaStr ? `Beeja: ${beejaStr}; Kshetra: ${kshetraStr}.` : ''} ${d7HasJupRIn5 ? 'D7 Ketu+Jupiter(R) in 5th indicates spiritual merit/karma around progeny delay.' : ''}`,
      explHi: `शास्त्रीय बहु-स्तरीय संतान परीक्षण: ${obsHi.length > 0 ? obsHi.join('; ') + '। ' : ''}पंचम भाव रैंक #${h5.bhavaRow?.rank ?? '-'}/12, SAV ${h5.savBindus}, D7 पंचम (${d7H5Occ.map((p) => grahaHi(p.id)).join(', ') || 'शुद्ध'})।`,
    },
    conceiveTiming,
    filialBonding: {
      valEn: bondValEn,
      valHi: bondValHi,
      explEn: `Derived from H5 occupants (${h5Occ.map((p) => p.id).join(', ') || 'Empty'}), H5 Bhava Rank #${h5.bhavaRow?.rank ?? '-'}, and D7 Saptamsha (${SIGNS[d7LagnaIdx].name}).`,
      explHi: `पंचम भाव ग्रहों, भाव बल व D7 सप्तांश के समन्वय से माता-पिता व संतान के संबंध की प्रकृति।`,
    },
  };
}



// =============================================================================
// SYNTHESIS EVALUATOR 4: ALL 20 LOW-VARIETY ATTRIBUTES -> MULTI-FACTOR DYNAMIC
// =============================================================================
export interface DynamicAttributeResult {
  valEn: string;
  valHi: string;
  explEn?: string;
  explHi?: string;
}

/**
 * Computes rich multi-factor outputs (6-12+ unique outcomes across charts) for every
 * attribute that previously had <= 3 unique canned strings across 120 charts.
 */
export function evaluateEnrichedAttribute(
  attrId: string,
  ctx: ClassicalSynthesisContext,
  ascSignIdx: number,
  fallbackEn: string,
  fallbackHi: string
): DynamicAttributeResult {
  const getP = (id: PlanetId) => ctx.planetsById.get(id);
  const sun = getP('Sun');
  const moon = getP('Moon');
  const mars = getP('Mars');
  const mercury = getP('Mercury');
  const jupiter = getP('Jupiter');
  const venus = getP('Venus');
  const saturn = getP('Saturn');
  const rahu = getP('Rahu');
  const ketu = getP('Ketu');

  const h = (n: number) => ctx.bhavaByHouse.get(n)!;
  const hNum = (p?: BodyPosition) => (p ? (p.rasiHouseNumber ?? p.houseNumber ?? 1) : 1);
  const ascElem = SIGNS[ascSignIdx].element;
  const ascMod = SIGNS[ascSignIdx].modality;
  const l1Id = SIGNS[ascSignIdx].lord;
  const l1Shad = ctx.shadbalaByPlanet.get(l1Id);
  const moonSign = moon ? SIGNS[moon.signIndex] : SIGNS[0];

  switch (attrId) {
    case 'attr_temperament': {
      const sunIsStrong = (ctx.shadbalaByPlanet.get('Sun')?.rank ?? 7) <= 3;
      const satIsStrong = (ctx.shadbalaByPlanet.get('Saturn')?.rank ?? 7) <= 3;
      const moonRahuClose = moon && rahu && angularDiffDeg(moon.longitude, rahu.longitude) < 8;
      const ak = (Array.from(ctx.planetsById.values()).find((p) => p.charaKaraka === 'AK')?.id) || 'Jupiter';
      if (moonRahuClose && satIsStrong) {
        return {
          valEn: `Introspective Depth & Intense Analytical Mind (${moonSign.name} Moon–Rahu + Dominant Saturn): Private resilience concealing sharp strategic drive`,
          valHi: `गहन चिंतनशील व रणनीतिक मानस (${SIGN_HI[moon?.signIndex ?? 0]} चंद्र-राहु + प्रबल शनि): शांत बाहरी व्यक्तित्व के भीतर तीव्र विश्लेषण शक्ति`,
        };
      }
      if (moon && ['Cancer', 'Pisces', 'Taurus'].includes(moon.signName) && (ctx.shadbalaByPlanet.get('Jupiter')?.isStrong ?? false)) {
        return {
          valEn: `Sattvic–Empathetic Poise (${moonSign.name} Moon + Strong Jupiter, AK ${ak}): Compassionate, intuitive, and ethical under pressure`,
          valHi: `सात्विक-संवेदनशील चित्त (${SIGN_HI[moon.signIndex]} चंद्र + सबल गुरु): करुणा, धैर्य, अंतर्ज्ञान व नैतिक दृढ़ता`,
        };
      }
      if (ascElem === 'Fire' && sunIsStrong) {
        return {
          valEn: `Tejasvi Rajasic Initiative (${SIGNS[ascSignIdx].name} Lagna + Solar Rank #${ctx.shadbalaByPlanet.get('Sun')?.rank}): Bold, principled & self-directed`,
          valHi: `तेजस्वी राजसिक नेतृत्व (${SIGN_HI[ascSignIdx]} लग्न + सबल सूर्य): निर्भीक, स्वाभिमानी व स्व-प्रेरित कार्यशैली`,
        };
      }
      if (ascElem === 'Air' || (mercury && [1, 4, 5, 10].includes(hNum(mercury)))) {
        return {
          valEn: `Mercurial–Intellectual Equilibrium (${moonSign.name} Moon, AK ${ak}): Curious, problem-solving mindset valuing logic & clarity`,
          valHi: `बौद्धिक-तार्किक संतुलन (${SIGN_HI[moon?.signIndex ?? 0]} चंद्र, आत्मकारक ${grahaHi(ak)}): तर्क, विश्लेषण व स्पष्ट संवाद प्रिय`,
        };
      }
      if (ascElem === 'Earth' || satIsStrong) {
        return {
          valEn: `Pragmatic–Determined Endurance (${SIGNS[ascSignIdx].name}, Rank #${l1Shad?.rank ?? 4} Lagnesh): Methodical, self-contained & dependable`,
          valHi: `व्यावहारिक व अडिग धैर्य (${SIGN_HI[ascSignIdx]} लग्न): अनुशासित, विश्वसनीय व दीर्घकालिक लक्ष्य-निष्ठ`,
        };
      }
      return {
        valEn: `Balanced Water-Tamas/Sattva Blend (${moonSign.name} Moon, AK ${ak}): Perceptive emotional intelligence paired with quiet resolve`,
        valHi: `संतुलित भावनात्मक प्रज्ञा (${SIGN_HI[moon?.signIndex ?? 0]} चंद्र, आत्मकारक ${grahaHi(ak)}): गहरी संवेदनशीलता व शांत दृढ़ संकल्प`,
      };
    }

    case 'attr_parents_relocation': {
      const h4 = h(4);
      const l4 = getP(h4.lordId);
      const l4H = hNum(l4);
      const rahuIn4 = hNum(rahu) === 4;
      const ketuIn4 = hNum(ketu) === 4;
      const d4Lagna = ctx.getVargaPlacement('D4', 'Asc')?.signIndex ?? ascSignIdx;
      const h4Mod = SIGNS[h4.signIndex].modality;
      const h4Sav = h4.savBindus;
      if (rahuIn4 && (h4Mod === 'Fixed' || h4Mod === 'Dual')) {
        return {
          valEn: `Clear Migration Away from Birthplace (Rahu in H4 ${h4.signName}, SAV ${h4Sav}): Settled in distant metro/urban hub for career advancement`,
          valHi: `जन्मस्थान से दूर महानगर/अन्य नगर में स्थायी प्रवास (चतुर्थ राहु, SAV ${h4Sav}): आजीविका व उन्नति हेतु स्थान परिवर्तन`,
        };
      }
      if ([9, 12].includes(l4H)) {
        return {
          valEn: `Inter-State or Overseas Settlement (4th Lord ${h4.lordId} in H${l4H}, D4 ${SIGNS[d4Lagna].name}): Life trajectory spans distant cities or foreign lands`,
          valHi: `अन्य राज्य अथवा विदेश में निवास योग (चतुर्थेश ${grahaHi(h4.lordId)} भाव ${l4H} में): दूरस्थ नगरों या विदेश में स्थायी आधार`,
        };
      }
      if (h4Mod === 'Movable' || l4H === 3 || l4H === 10 || l4H === 11) {
        return {
          valEn: `Periodic Career-Driven Mobility (H4 ${h4.signName}, L4 in H${l4H}): Relocates from small hometown to commercial centers while keeping family links`,
          valHi: `करियर-प्रेरित स्थानांतरण (चतुर्थ ${SIGN_HI[h4.signIndex]}, चतुर्थेश भाव ${l4H}): रोजगार हेतु मुख्य शहरों की ओर गमन`,
        };
      }
      if (ketuIn4) {
        return {
          valEn: `Detached Roots / Independent Residence (Ketu in H4): Native establishes private self-built home away from ancestral crowding`,
          valHi: `पैतृक स्थान से स्वतंत्र निजी आवास (चतुर्थ केतु): परिवार से अलग शांत व स्वतंत्र घर का निर्माण`,
        };
      }
      if (h4Sav >= 30 && h4Mod === 'Fixed') {
        return {
          valEn: `Deep Ancestral Anchoring (Fixed H4 ${h4.signName}, SAV ${h4Sav}): Strong continuity with hometown property and regional community`,
          valHi: `पुश्तैनी भूमि व गृह में सुदृढ़ स्थायित्व (स्थिर चतुर्थ, SAV ${h4Sav}): पैतृक संपत्ति व स्थानीय समाज से गहरा जुड़ाव`,
        };
      }
      return {
        valEn: `Dual-Base Residence (D1 H4 ${h4.signName}, D4 ${SIGNS[d4Lagna].name}): Maintains ancestral ties alongside a self-earned modern residence`,
        valHi: `द्वि-आवासीय संतुलन (D1 ${SIGN_HI[h4.signIndex]}, D4 ${SIGN_HI[d4Lagna]}): पैतृक जुड़ाव के साथ आधुनिक नगर में अपना आवास`,
      };
    }

    case 'attr_younger_sibling': {
      const h3 = h(3);
      const l3 = getP(h3.lordId);
      const d3Sign = ctx.getVargaPlacement('D3', h3.lordId)?.signIndex ?? h3.signIndex;
      const h3Occ = Array.from(ctx.planetsById.values()).filter((p) => hNum(p) === 3);
      const bavMars3 = ctx.getBavBindus('Mars', 3);
      const isOnlyOrYoungest = fallbackEn.toLowerCase().includes('no younger');
      if (isOnlyOrYoungest) {
        return {
          valEn: `Youngest / No Younger Co-Born (H3 SAV ${h3.savBindus}, Mars BAV ${bavMars3}): Native carries independent/youngest sibling role; cousins or juniors look up as mentor`,
          valHi: `कनिष्ठ संतान / अनुज रहित (तृतीय SAV ${h3.savBindus}): जातक स्वयं छोटा या स्वतंत्र स्थान पर; चचेरे/कनिष्ठ सहकर्मियों का मार्गदर्शक`,
        };
      }
      if (h3Occ.some((p) => p.id === 'Mars' || p.id === 'Sun')) {
        return {
          valEn: `1–2 Spirited Younger Siblings (Brother-Dominant, H3 ${h3Occ.map((p) => p.id).join('+')}, SAV ${h3.savBindus}): Active, ambitious younger co-borns`,
          valHi: `१–२ ऊर्जावान छोटे भाई-बहन (भाई प्रमुख, SAV ${h3.savBindus}): साहसी व महत्वाकांक्षी अनुज`,
        };
      }
      if (h3Occ.some((p) => p.id === 'Venus' || p.id === 'Moon')) {
        return {
          valEn: `1–2 Cultured Younger Siblings (Sister-Dominant, D3 ${SIGNS[d3Sign].name}, SAV ${h3.savBindus}): Warm, artistic younger co-borns`,
          valHi: `१–२ सुसंस्कृत छोटे भाई-बहन (बहन प्रमुख, SAV ${h3.savBindus}): स्नेही व कलाप्रिय अनुज`,
        };
      }
      return {
        valEn: `${l3 && [2, 5, 8, 11].includes(l3.signIndex) ? '2–3' : '1–2'} Younger Siblings (L3 ${h3.lordId} in H${hNum(l3)}, H3 SAV ${h3.savBindus}): Balanced ${SIGNS[h3.signIndex].gender} sign polarity`,
        valHi: `${l3 && [2, 5, 8, 11].includes(l3.signIndex) ? '२–३' : '१–२'} छोटे भाई-बहन (तृतीयेश ${grahaHi(h3.lordId)} भाव ${hNum(l3)}, SAV ${h3.savBindus})`,
      };
    }

    case 'attr_elder_sibling': {
      const h11 = h(11);
      const l11 = getP(h11.lordId);
      const h11Occ = Array.from(ctx.planetsById.values()).filter((p) => hNum(p) === 11);
      const jupShad = ctx.shadbalaByPlanet.get('Jupiter');
      if (fallbackEn.toLowerCase().includes('no elder')) {
        return {
          valEn: `Eldest / Pioneer Position (H11 SAV ${h11.savBindus}, L11 ${h11.lordId} in H${hNum(l11)}): Shoulders early independence without elder sibling cushion`,
          valHi: `ज्येष्ठ / प्रथम स्थान (एकादश SAV ${h11.savBindus}): प्रारंभिक जिम्मेदारियों का स्वयं वहन`,
        };
      }
      if (h11Occ.some((p) => p.id === 'Venus') && venus?.dignity === 'Debilitated') {
        return {
          valEn: `1–2 Elder Siblings with Mixed / Independent Path (Debilitated Venus in H11, H11 SAV ${h11.savBindus}): Caring yet preoccupied with own responsibilities`,
          valHi: `१–२ बड़े भाई-बहन (एकादश में नीच शुक्र, SAV ${h11.savBindus}): स्नेहपूर्ण किंतु अपने कार्यक्षेत्र में व्यस्त`,
        };
      }
      if (h11Occ.some((p) => p.id === 'Jupiter' || p.id === 'Sun')) {
        return {
          valEn: `Protective, Dignified Elder Sibling Anchor (SAV ${h11.savBindus}, Guru Rank #${jupShad?.rank ?? '-'}/7): Acts as a steady family pillar`,
          valHi: `प्रतिष्ठित व संरक्षक बड़े भाई-बहन (SAV ${h11.savBindus}): परिवार में मार्गदर्शक व संबल स्तंभ`,
        };
      }
      return {
        valEn: `${h11Occ.length >= 2 || [2, 5, 8, 11].includes(h11.signIndex) ? '2+' : '1–2'} Elder Siblings (H11 ${h11.signName}, SAV ${h11.savBindus}, L11 in H${hNum(l11)}): Cordial adult camaraderie`,
        valHi: `${h11Occ.length >= 2 || [2, 5, 8, 11].includes(h11.signIndex) ? '२+' : '१–२'} बड़े भाई-बहन (एकादश ${SIGN_HI[h11.signIndex]}, SAV ${h11.savBindus}): सौहार्दपूर्ण सहयोग`,
      };
    }

    case 'attr_sibling_family_influence': {
      const h3 = h(3);
      const h11 = h(11);
      const satAfflicts3or11 = saturn && ([3, 11].includes(hNum(saturn)) || h3.netDrishtiVirupas < -15 || h11.netDrishtiVirupas < -15);
      if (h3.savBindus >= 30 && h11.savBindus >= 30) {
        return {
          valEn: `Highly Supportive Sibling Households (H3 SAV ${h3.savBindus} & H11 SAV ${h11.savBindus}): Prosperous co-borns provide active backing`,
          valHi: `अत्यंत सहयोगी व समृद्ध सहोदर परिवार (SAV ${h3.savBindus}/${h11.savBindus}): भाई-बहनों से सक्रिय संबल`,
        };
      }
      if (satAfflicts3or11 || h3.savBindus <= 23) {
        return {
          valEn: `Busy, Distant or Tested Sibling Circumstances (H3 SAV ${h3.savBindus}, H11 SAV ${h11.savBindus}): Co-borns focus heavily on their own struggles; tact keeps harmony`,
          valHi: `व्यस्त अथवा दूरस्थ सहोदर जीवन (SAV ${h3.savBindus}/${h11.savBindus}): प्रत्येक अपने संघर्षों में व्यस्त; स्पष्ट संवाद से सौहार्द`,
        };
      }
      return {
        valEn: `Self-Reliant Sibling Households (H3 SAV ${h3.savBindus}, H11 SAV ${h11.savBindus}): Independent lives with respectful festival & milestone gatherings`,
        valHi: `स्वावलंबी सहोदर परिवार (SAV ${h3.savBindus}/${h11.savBindus}): स्वतंत्र गृहस्थ व अवसरों पर स्नेहपूर्ण मिलन`,
      };
    }

    case 'attr_highest_education': {
      const h4 = h(4);
      const h5 = h(5);
      const h6 = h(6);
      const h9 = h(9);
      const d24Merc = ctx.getVargaPlacement('D24', 'Mercury');
      const d24Jup = ctx.getVargaPlacement('D24', 'Jupiter');
      const mercRank = ctx.shadbalaByPlanet.get('Mercury')?.rank ?? 4;
      const jupRank = ctx.shadbalaByPlanet.get('Jupiter')?.rank ?? 4;
      if ((d24Jup && ['Exalted', 'Own Sign', 'Moolatrikona'].includes(d24Jup.dignity)) || (h5.savBindus >= 30 && h9.savBindus >= 29 && jupRank <= 4)) {
        return {
          valEn: `Postgraduate / Research Mastery (H5 SAV ${h5.savBindus}, D24 Guru Rank #${jupRank}/7): Strong aptitude for higher specialization & scholarly credentials`,
          valHi: `उच्च स्नातकोत्तर / शोध योग्यता (पंचम SAV ${h5.savBindus}, गुरु रैंक #${jupRank}/7): गहन विशेषज्ञता व उच्च उपाधि का योग`,
        };
      }
      if (mercRank <= 4 && d24Merc && ['Exalted', 'Own Sign', 'Moolatrikona', 'Great Friend', 'Friend'].includes(d24Merc.dignity)) {
        return {
          valEn: `Analytical, Commerce or Technical Degree (Mercury Rank #${mercRank}/7, D24 Mercury ${d24Merc.dignity}): Quantitative, computing or commercial proficiency`,
          valHi: `विश्लेषणात्मक, वाणिज्य अथवा तकनीकी स्नातक (बुध रैंक #${mercRank}/7, D24 ${d24Merc.dignity}): गणना, प्रबंधन व तर्क-दक्षता`,
        };
      }
      if ((h6.bhavaRow?.rank ?? 12) <= 3 && (jupiter && [1, 4, 5, 9, 10].includes(hNum(jupiter)))) {
        return {
          valEn: `Applied Healthcare, Governance or Service Qualification (H6 Bhava Rank #${h6.bhavaRow?.rank}/12, Guru Kendra/Trikona): Practical clinical, administrative or advisory training`,
          valHi: `चिकित्सा, प्रशासन अथवा सेवा-क्षेत्र की व्यावसायिक शिक्षा (षष्ठ भाव रैंक #${h6.bhavaRow?.rank}/12): व्यावहारिक व जनसेवी योग्यता`,
        };
      }
      if (h4.savBindus <= 24 || (h5.bhavaRow && h5.bhavaRow.rank >= 10)) {
        return {
          valEn: `Applied Graduation / Hands-On Professional Qualification (H4 SAV ${h4.savBindus}): Practical mastery outweighs rote academics`,
          valHi: `व्यावहारिक स्नातक व कौशल-आधारित योग्यता (चतुर्थ SAV ${h4.savBindus}): कार्य-अनुभव से विशेष दक्षता`,
        };
      }
      return {
        valEn: `Solid Professional Bachelor's / Master's Degree (H4 SAV ${h4.savBindus}, H9 SAV ${h9.savBindus}): Reliable career-launching education`,
        valHi: `सुदृढ़ व्यावसायिक स्नातक/स्नातकोत्तर उपाधि (SAV ${h4.savBindus}/${h9.savBindus}): करियर के लिए सुयोग्य आधार`,
      };
    }

    case 'attr_scholarships_honors': {
      const h5 = h(5);
      const h9 = h(9);
      const mercShad = ctx.shadbalaByPlanet.get('Mercury');
      const jupShad = ctx.shadbalaByPlanet.get('Jupiter');
      if ((jupShad?.rank ?? 7) <= 2 && h9.savBindus >= 28) {
        return {
          valEn: `Merit Fellowships & Distinction Honors (Guru Rank #${jupShad?.rank}/7, H9 SAV ${h9.savBindus}): Strong academic recognition`,
          valHi: `योग्यता छात्रवृत्ति व विशेष सम्मान (गुरु रैंक #${jupShad?.rank}/7, नवम SAV ${h9.savBindus})`,
        };
      }
      if ((mercShad?.rank ?? 7) <= 3 && h5.savBindus <= 26) {
        return {
          valEn: `Self-Earned Technical / Competitive Admission Merit (Mercury Rank #${mercShad?.rank}/7): Earns credentials through analytical problem-solving rather than patronage`,
          valHi: `स्व-अर्जित तकनीकी व प्रतियोगी प्रवेश योग्यता (बुध रैंक #${mercShad?.rank}/7): अपनी मेधा व परिश्रम से प्रतिष्ठित संस्थान में चयन`,
        };
      }
      if (h9.savBindus <= 24 || (l1Shad && l1Shad.rank >= 6)) {
        return {
          valEn: `Self-Reliant Striving Over Institutional Grants (H9 SAV ${h9.savBindus}): Overcomes competitive bottlenecks via persistent grit`,
          valHi: `स्व-परिश्रम से अर्जित सफलता (नवम SAV ${h9.savBindus}): कठिन प्रतिस्पर्धा पार कर योग्यता सिद्ध करना`,
        };
      }
      return {
        valEn: `Steady Institutional Recognition & Family-Supported Study (H5 SAV ${h5.savBindus}, H9 SAV ${h9.savBindus})`,
        valHi: `नियमित शैक्षणिक प्रगति व पारिवारिक संबल से सुचारू अध्ययन (SAV ${h5.savBindus}/${h9.savBindus})`,
      };
    }

    case 'attr_job_vs_business': {
      const h6 = h(6);
      const h7 = h(7);
      const h10 = h(10);
      const h11 = h(11);
      const d10Merc = ctx.getVargaPlacement('D10', 'Mercury');
      const d10Jup = ctx.getVargaPlacement('D10', 'Jupiter');
      const satRank = ctx.shadbalaByPlanet.get('Saturn')?.rank ?? 4;
      const jobPts =
        (h6.savBindus >= 28 ? 2 : 0) +
        (satRank <= 2 ? 2 : 0) +
        (hNum(saturn) === 2 || hNum(saturn) === 6 || hNum(saturn) === 10 ? 1.5 : 0) +
        (d10Merc?.dignity === 'Own Sign' || d10Jup?.dignity === 'Own Sign' ? 1.5 : 0);
      const bizPts =
        (h7.savBindus >= 28 ? 2 : 0) +
        (h11.savBindus >= 30 ? 2 : 0) +
        (ctx.shadbalaByPlanet.get('Mercury')?.isStrong ? 1 : 0) +
        ([1, 7, 10, 11].includes(hNum(getP(h10.lordId))) ? 1.5 : 0);

      if (jobPts >= bizPts + 2) {
        return {
          valEn: `Structured Senior Technical / Corporate Service Career (Saturn Rank #${satRank}/7, H6 SAV ${h6.savBindus}, H7 SAV ${h7.savBindus}): High salaried stability & specialist mastery${d10Merc?.dignity === 'Own Sign' ? ' (D10 Mercury Own Sign)' : ''}`,
          valHi: `संगठित कॉर्पोरेट / तकनीकी सेवा करियर (शनि रैंक #${satRank}/7, षष्ठ SAV ${h6.savBindus}): उच्च वेतन, विशेषज्ञ पद व स्थायी प्रगति`,
        };
      }
      if (bizPts >= jobPts + 2) {
        return {
          valEn: `Independent Enterprise & Commercial Scaling (H7 SAV ${h7.savBindus}, H11 SAV ${h11.savBindus}): Strong aptitude for business ownership or agency scaling`,
          valHi: `स्वतंत्र व्यापार व उद्यमिता प्रबल (सप्तम SAV ${h7.savBindus}, एकादश SAV ${h11.savBindus}): स्वयं के व्यवसाय से बड़ा विस्तार`,
        };
      }
      if (h7.savBindus <= 23 && h10.savBindus >= 27) {
        return {
          valEn: `High-Skill Employment First, Independent Advisory Later (H7 SAV ${h7.savBindus} vs H10 SAV ${h10.savBindus}): Avoid risky 50-50 partnerships; salaried leadership thrives`,
          valHi: `विशेषज्ञ नौकरी से उत्कर्ष (सप्तम SAV ${h7.savBindus} बनाम दशम ${h10.savBindus}): साझेदारी व्यापार से बचकर संगठित करियर में शीर्ष पद`,
        };
      }
      return {
        valEn: `Strategic Hybrid (Senior Specialist Role + Consulting/Equity Upside, Job ${jobPts.toFixed(1)} vs Biz ${bizPts.toFixed(1)}): Thrives in autonomous technical or advisory tracks`,
        valHi: `रणनीतिक मिश्रित मार्ग (वरिष्ठ विशेषज्ञ पद + स्वतंत्र परामर्श, सेवा ${jobPts.toFixed(1)} बनाम व्यापार ${bizPts.toFixed(1)})`,
      };
    }

    case 'attr_real_estate': {
      const h4 = h(4);
      const marsShad = ctx.shadbalaByPlanet.get('Mars');
      const d4Mars = ctx.getVargaPlacement('D4', 'Mars');
      const d4Lagnesh = ctx.getVargaPlacement('D4', SIGNS[ctx.getVargaPlacement('D4', 'Asc')?.signIndex ?? ascSignIdx].lord);
      if (h4.savBindus >= 30 && (marsShad?.isStrong ?? false)) {
        return {
          valEn: `Multi-Property / Prime Land & Residence Yoga (H4 SAV ${h4.savBindus}, Mars ${mars?.dignity}): Strong early-to-mid 30s immovable asset build-up`,
          valHi: `बहु-संपत्ति व भूमि-भवन सुख (चतुर्थ SAV ${h4.savBindus}): ३०–३५ वर्ष के आसपास उत्तम अचल संपत्ति निर्माण`,
        };
      }
      if (hNum(rahu) === 4 && h4.savBindus <= 26) {
        return {
          valEn: `Urban Flat / Modern Metro Apartment via Structured Loan (Rahu in H4, H4 SAV ${h4.savBindus}): Acquired away from hometown; verify all property titles thoroughly`,
          valHi: `आधुनिक नगर में फ्लैट/अपार्टमेंट सुख (चतुर्थ राहु, SAV ${h4.savBindus}): पैतृक स्थान से दूर ऋण (EMI) द्वारा गृह प्राप्ति; कागजात जांच अनिवार्य`,
        };
      }
      if (d4Mars && [1, 4, 5, 9, 10, 11].includes(d4Mars.houseFromVargaLagna)) {
        return {
          valEn: `Self-Built / Appreciating Urban Property (D4 Mars H${d4Mars.houseFromVargaLagna}, H4 SAV ${h4.savBindus}): Steady asset creation in mid-career`,
          valHi: `स्व-अर्जित बढ़ती मूल्य वाली संपत्ति (D4 मंगल भाव ${d4Mars.houseFromVargaLagna}, SAV ${h4.savBindus}): करियर के मध्य चरण में मजबूत अचल संपत्ति`,
        };
      }
      return {
        valEn: `Steady Residential Ownership in Mid-Career (H4 SAV ${h4.savBindus}, D4 L-in-H${d4Lagnesh?.houseFromVargaLagna ?? '-'}): Practical home comfort via disciplined savings`,
        valHi: `मध्य आयु तक सुव्यवस्थित निजी आवास (चतुर्थ SAV ${h4.savBindus}): अनुशासित बचत से स्थायी गृह सुख`,
      };
    }

    case 'attr_vehicles': {
      const h4 = h(4);
      const venRank = ctx.shadbalaByPlanet.get('Venus')?.rank ?? 4;
      const d16Ven = ctx.getVargaPlacement('D16', 'Venus');
      if (venRank <= 3 && h4.savBindus >= 29) {
        return {
          valEn: `Premium / Luxury Four-Wheeler Comfort (Venus Rank #${venRank}/7, H4 SAV ${h4.savBindus}): Smooth upgrades and joyful travel comfort`,
          valHi: `उत्तम व विलासितापूर्ण चारपहिया वाहन सुख (शुक्र रैंक #${venRank}/7, SAV ${h4.savBindus}): आरामदायक व शुभ वाहन प्राप्ति`,
        };
      }
      if (venus?.dignity === 'Debilitated' || hNum(rahu) === 4) {
        return {
          valEn: `Practical, Tech-Forward Reliable Vehicle Over Showmanship (Venus ${venus?.dignity}, H4 SAV ${h4.savBindus}): Regular servicing & calm driving preserve safety`,
          valHi: `व्यावहारिक, तकनीक-युक्त व सुरक्षित वाहन सुख (शुक्र ${venus?.dignity}, SAV ${h4.savBindus}): दिखावे के बजाय टिकाऊ वाहन व सुरक्षित चालन श्रेष्ठ`,
        };
      }
      return {
        valEn: `Steady Personal Vehicle Progression (H4 SAV ${h4.savBindus}, D16 Venus H${d16Ven?.houseFromVargaLagna ?? '-'}): Upgrades cleanly with career milestones`,
        valHi: `क्रमिक वाहन सुख (चतुर्थ SAV ${h4.savBindus}): करियर की प्रगति के साथ बेहतर वाहन प्राप्ति`,
      };
    }

    case 'attr_karmic_debts': {
      const sunShad = ctx.shadbalaByPlanet.get('Sun');
      const rahuH = hNum(rahu);
      const ketuH = hNum(ketu);
      const moonRahuOrb = moon && rahu ? angularDiffDeg(moon.longitude, rahu.longitude) : 180;
      if ((sunShad && sunShad.rank >= 6) || moonRahuOrb < 6 || hNum(ketu) === 10) {
        return {
          valEn: `Prominent Pitru & Matru-Manas Rina (Sun Rank #${sunShad?.rank ?? '-'}/7, Nodes H${rahuH}–H${ketuH}): Harmonized through Amavasya Pitru Tarpan, Sunday Surya Arghya & caring for mother`,
          valHi: `प्रमुख पितृ व मातृ-मन ऋण (सूर्य रैंक #${sunShad?.rank ?? '-'}/7, राहु-केतु ${rahuH}-${ketuH}): अमावस्या तर्पण, सूर्य अर्घ्य व मातृ सेवा से शीघ्र ऋण मुक्ति`,
        };
      }
      if (jupiter?.isRetrograde || (ctx.shadbalaByPlanet.get('Jupiter')?.ishtaNet ?? 0) < -15) {
        return {
          valEn: `Guru & Vidya Rina (Jupiter ${jupiter?.isRetrograde ? 'Retrograde' : 'Tested'}): Cleared through mentoring juniors, Thursday charity & honoring teachers`,
          valHi: `गुरु व विद्या ऋण (${jupiter?.isRetrograde ? 'वक्री गुरु' : 'परीक्षित गुरु'}): विद्यार्थियों का मार्गदर्शन व गुरुवार दान से ऋण-मुक्ति`,
        };
      }
      if (venus?.dignity === 'Debilitated' || venusClustered(ctx)) {
        return {
          valEn: `Stri & Kalatra Rina (Strained Venus, H${hNum(venus)}): Cleared through deep respect for women, Gau-Seva & transparent partnership ethics`,
          valHi: `स्त्री व दांपत्य ऋण (पीड़ित शुक्र): स्त्रियों के सम्मान, गौ-सेवा व पारदर्शी संबंध-निष्ठा से संतुलन`,
        };
      }
      return {
        valEn: `Balanced Daily Seva & Dharma Rina (Nodes H${rahuH}–H${ketuH}): Cleared via honest livelihood, Anna Daan, and stray animal feeding`,
        valHi: `सामान्य सेवा व धर्म ऋण (राहु-केतु ${rahuH}-${ketuH}): ईमानदार कर्म, अन्नदान व जीव-सेवा से सहज शुद्धि`,
      };
    }

    case 'attr_walking_gait': {
      const l1 = getP(l1Id);
      const l1H = hNum(l1);
      if (ascElem === 'Water' && l1Id === 'Mars') {
        return {
          valEn: `Measured, Purposeful & Observant Stride (Scorpio Mars in H${l1H}): Calm, self-contained bearing concealing athletic agility`,
          valHi: `सधी हुई, गंभीर व सतर्क चाल (वृश्चिक मंगल भाव ${l1H}): शांत आवरण के भीतर फुर्तीला व दृढ़ कदम`,
        };
      }
      if (ascElem === 'Fire') {
        return {
          valEn: `Brisk Veera-Gati Stride (${SIGNS[ascSignIdx].name} Lagna, Rank #${l1Shad?.rank ?? '-'}/7): Upright chest, forward momentum & commanding presence`,
          valHi: `तेजस्वी वीर-गति चाल (${SIGN_HI[ascSignIdx]} लग्न): सीधी रीढ़, तेज कदम व प्रभावशाली उपस्थिति`,
        };
      }
      if (ascElem === 'Air') {
        return {
          valEn: `Agile Hamsa-Gati Step (${SIGNS[ascSignIdx].name} Lagna, ${ascMod}): Light, brisk, flexible movement reflecting mental alertness`,
          valHi: `चपल हंस-गति चाल (${SIGN_HI[ascSignIdx]} लग्न): हल्का, त्वरित व लचीला कदम`,
        };
      }
      if (saturn && [1, 10].includes(hNum(saturn))) {
        return {
          valEn: `Deliberate, Measured Gajagami Poise (Saturn H${hNum(saturn)}): Unhurried, grounded stride carrying quiet endurance`,
          valHi: `धीर-गंभीर गजगामी चाल (शनि भाव ${hNum(saturn)}): नपी-तुली, स्थिर व धैर्यपूर्ण गति`,
        };
      }
      return {
        valEn: `Steadfast ${ascMod} Gait (${SIGNS[ascSignIdx].name}, Lagnesh in H${l1H}): Composed posture projecting quiet self-assurance`,
        valHi: `संतुलित ${SIGN_HI[ascSignIdx]} चाल (लग्नेश भाव ${l1H}): आत्मविश्वासपूर्ण व शालीन मुद्रा`,
      };
    }

    case 'attr_nose': {
      const l1 = getP(l1Id);
      const l1H = hNum(l1);
      const h1Occ = Array.from(ctx.planetsById.values()).filter((p) => hNum(p) === 1).map((p) => p.id);
      if (h1Occ.includes('Sun') || h1Occ.includes('Jupiter')) {
        return {
          valEn: `Broad, Elevated & Regal Nasal Bridge (${h1Occ.join('+')} in Lagna ${SIGNS[ascSignIdx].name}): Dignified executive profile`,
          valHi: `उन्नत, भव्य व राजसी नासिका (लग्न में ${h1Occ.map(grahaHi).join('+')}): प्रभावशाली नेतृत्व छवि`,
        };
      }
      if (h1Occ.includes('Mars') || ascElem === 'Fire') {
        return {
          valEn: `Sharp Aquiline / Chiseled Bridge (${SIGNS[ascSignIdx].name} / Mars H${hNum(mars)}): Defined contour radiating resolve`,
          valHi: `तीक्ष्ण व सुस्पष्ट नासिका (${SIGN_HI[ascSignIdx]} / मंगल प्रभाव): दृढ़ इच्छाशक्ति का सूचक`,
        };
      }
      if (h1Occ.includes('Saturn') || h1Occ.includes('Rahu') || ascElem === 'Air') {
        return {
          valEn: `Long, Straight & Slender Nasal Profile (${SIGNS[ascSignIdx].name}, L1 in H${l1H}): Refined analytical features`,
          valHi: `लंबी, सीधी व सधी हुई नासिका (${SIGN_HI[ascSignIdx]}, लग्नेश भाव ${l1H}): सूक्ष्म बौद्धिक आभा`,
        };
      }
      if (h1Occ.includes('Venus') || h1Occ.includes('Moon') || ascElem === 'Water') {
        return {
          valEn: `Smoothly Sculpted Balanced Bridge (${SIGNS[ascSignIdx].name} ${ascMod}, Rank #${l1Shad?.rank ?? '-'}/7): Harmonious facial proportion`,
          valHi: `सुडौल, सौम्य व संतुलित नासिका (${SIGN_HI[ascSignIdx]} ${ascMod}): मुखाकृति में प्राकृतिक सौम्यता`,
        };
      }
      return {
        valEn: `Well-Proportioned Grounded Nasal Contour (${SIGNS[ascSignIdx].name}, Lagnesh ${l1Id} Rank #${l1Shad?.rank ?? '-'}/7)`,
        valHi: `संतुलित व सुगठित नासिका (${SIGN_HI[ascSignIdx]}, लग्नेश ${grahaHi(l1Id)} रैंक #${l1Shad?.rank ?? '-'}/7)`,
      };
    }

    case 'attr_height_build': {
      const l1 = getP(l1Id);
      const l1H = hNum(l1);
      const jupStrong = (ctx.shadbalaByPlanet.get('Jupiter')?.rank ?? 7) <= 3;
      const satStrong = (ctx.shadbalaByPlanet.get('Saturn')?.rank ?? 7) <= 3;
      if (ascElem === 'Water' && l1Id === 'Mars') {
        return {
          valEn: `Medium-Compact Muscular Mesomorph (Scorpio Lagna, Mars H${l1H}): Sturdy bone density & resilient stamina`,
          valHi: `मध्यम, गठीला व ऊर्जावान शरीर (वृश्चिक लग्न, मंगल भाव ${l1H}): सुदृढ़ हड्डियां व सहनशक्ति`,
        };
      }
      if (jupStrong && (ascMod === 'Dual' || ascSignIdx === 3 || ascSignIdx === 1)) {
        return {
          valEn: `Commanding Stately Build (Guru Rank #${ctx.shadbalaByPlanet.get('Jupiter')?.rank}/7, ${SIGNS[ascSignIdx].name}): Broad shoulders & dignified presence`,
          valHi: `भव्य व रोबदार शारीरिक गठन (गुरु रैंक #${ctx.shadbalaByPlanet.get('Jupiter')?.rank}/7): चौड़े कंधे व गरिमापूर्ण कद`,
        };
      }
      if (satStrong && (ascElem === 'Air' || ascMod === 'Movable')) {
        return {
          valEn: `Tall-Lean Structured Frame (Saturn Rank #${ctx.shadbalaByPlanet.get('Saturn')?.rank}/7, ${SIGNS[ascSignIdx].name}): Upright spine & endurance physique`,
          valHi: `लंबा, छरहरा व सुव्यवस्थित कद (शनि रैंक #${ctx.shadbalaByPlanet.get('Saturn')?.rank}/7): सीधी काठी व दीर्घ सहनशक्ति`,
        };
      }
      if (ascElem === 'Fire') {
        return {
          valEn: `Athletic Medium-Tall Frame (${SIGNS[ascSignIdx].name} Fire, L1 Rank #${l1Shad?.rank ?? '-'}/7): Agile build with strong metabolic vitality`,
          valHi: `चुस्त, कसरती व मध्यम-लंबा कद (${SIGN_HI[ascSignIdx]} अग्नि तत्व): तीव्र चयापचय व फुर्ती`,
        };
      }
      return {
        valEn: `Proportionate ${ascMod} Build (${SIGNS[ascSignIdx].name}, Lagnesh ${l1Id} in H${l1H}): Balanced frame adapting cleanly to lifestyle`,
        valHi: `संतुलित शारीरिक अनुपात (${SIGN_HI[ascSignIdx]}, लग्नेश भाव ${l1H}): स्वस्थ व सुडौल ढांचा`,
      };
    }

    case 'attr_mother_profession': {
      const h4 = h(4);
      const l4Shad = ctx.shadbalaByPlanet.get(h4.lordId);
      const l1 = getP(l1Id);
      const l1H = hNum(l1);
      const d12Moon = ctx.getVargaPlacement('D12', 'Moon');
      const moonShad = ctx.shadbalaByPlanet.get('Moon');
      if (hNum(rahu) === 4 || hNum(saturn) === 4) {
        return {
          valEn: `Dedicated Homemaker / Self-Reliant Community Pillar (H4 Rahu/Saturn influence, SAV ${h4.savBindus}): Managed household amidst transitions`,
          valHi: `समर्पित गृह-निर्माता एवं संकट-प्रबंधक माता (चतुर्थ राहु/शनि, SAV ${h4.savBindus}): बदलावों के बीच परिवार को संभाला`,
        };
      }
      if (l1Id === 'Mercury' || l1Id === 'Jupiter' || (d12Moon && [1, 5, 9, 10].includes(d12Moon.houseFromVargaLagna))) {
        return {
          valEn: `Education, Teaching, Finance or Advisory Steward (10th-from-4th ${l1Id} H${l1H}, Moon Rank #${moonShad?.rank ?? '-'}/7)`,
          valHi: `शिक्षा, अध्यापन, वित्त अथवा परामर्शदात्री भूमिका (चतुर्थेश रैंक #${l4Shad?.rank ?? '-'}/7, चंद्र रैंक #${moonShad?.rank ?? '-'}/7)`,
        };
      }
      if (l1Id === 'Sun' || l1Id === 'Mars') {
        return {
          valEn: `Disciplined Household Commander / Public or Technical Service (10th-from-4th ${l1Id} in H${l1H}, H4 SAV ${h4.savBindus})`,
          valHi: `अनुशासित गृह-प्रबंधक / प्रशासनिक या सेवा कार्य (लग्नेश ${grahaHi(l1Id)} भाव ${l1H})`,
        };
      }
      return {
        valEn: `Cultured Domestic Anchor / Healthcare & Craft Stewardship (H4 ${h4.signName}, SAV ${h4.savBindus}, L4 Rank #${l4Shad?.rank ?? '-'}/7)`,
        valHi: `सुसंस्कृत पारिवारिक आधार / स्वास्थ्य व रचनात्मक योगदान (चतुर्थ ${SIGN_HI[h4.signIndex]}, SAV ${h4.savBindus})`,
      };
    }

    default:
      return { valEn: fallbackEn, valHi: fallbackHi };
  }
}

function venusClustered(ctx: ClassicalSynthesisContext): boolean {
  const v = ctx.getVargaPlacement('D9', 'Venus');
  if (!v) return false;
  const occ = ctx.getVargaOccupants('D9', v.houseFromVargaLagna);
  return occ.some((p) => ['Saturn', 'Ketu', 'Mars', 'Rahu'].includes(p.id));
}

// =============================================================================
// CAREER, SOFTWARE/TECH & ABROAD SETTLEMENT ENHANCER (D10 + SAV + Dasha)
// =============================================================================
export interface WeightedCareerAbroadOverlay {
  techCareerSuffixEn: string;
  techCareerSuffixHi: string;
  abroadTravelResult: { valEn: string; valHi: string; explEn: string; explHi: string };
}

export function evaluateCareerAndAbroadOverlay(
  ctx: ClassicalSynthesisContext,
  ascSignIdx: number
): WeightedCareerAbroadOverlay {
  const mercury = ctx.planetsById.get('Mercury');
  const venus = ctx.planetsById.get('Venus');
  const saturn = ctx.planetsById.get('Saturn');
  const jupiter = ctx.planetsById.get('Jupiter');
  const rahu = ctx.planetsById.get('Rahu');
  const ketu = ctx.planetsById.get('Ketu');
  const moon = ctx.planetsById.get('Moon');

  const h9 = ctx.bhavaByHouse.get(9)!;
  const h10 = ctx.bhavaByHouse.get(10)!;
  const h12 = ctx.bhavaByHouse.get(12)!;
  const h4 = ctx.bhavaByHouse.get(4)!;

  const d10Merc = ctx.getVargaPlacement('D10', 'Mercury');
  const d10Jup = ctx.getVargaPlacement('D10', 'Jupiter');
  const d10Mars = ctx.getVargaPlacement('D10', 'Mars');
  const d10Moon = ctx.getVargaPlacement('D10', 'Moon');
  const d10LagnaIdx = ctx.getVargaPlacement('D10', 'Asc')?.signIndex ?? ascSignIdx;

  const mercShad = ctx.shadbalaByPlanet.get('Mercury');
  const satShad = ctx.shadbalaByPlanet.get('Saturn');
  const rahuAspects10 = Boolean(
    rahu && [5, 7, 9].includes(((10 - (rahu.rasiHouseNumber ?? 1) + 12) % 12) + 1)
  );

  // Generalized Classical D10 Dashamsha Signature (without single-chart specialization)
  const d10H10Occ = ctx.getVargaOccupants('D10', 10);
  const isStrongMercD10 = Boolean(
    d10Merc && ['Own Sign', 'Exalted', 'Moolatrikona'].includes(d10Merc.dignity) && (mercShad?.rank ?? 7) <= 5
  );
  const isStrongMarsD10 = Boolean(
    d10Mars && [1, 10, 11].includes(d10Mars.houseFromVargaLagna) && ['Own Sign', 'Exalted', 'Great Friend', 'Friend'].includes(d10Mars.dignity)
  );
  const isStrongMoonOrJupD10 = Boolean(
    (d10Moon && (d10Moon.houseFromVargaLagna === 10 || ['Exalted', 'Own Sign'].includes(d10Moon.dignity))) ||
      (d10Jup && [1, 5, 9, 10].includes(d10Jup.houseFromVargaLagna) && ['Exalted', 'Own Sign', 'Moolatrikona'].includes(d10Jup.dignity))
  );

  const techCareerSuffixEn = isStrongMercD10
    ? ` | D10 Strength: Analytical Computation, Trade, Finance & Communication (${d10Merc?.dignity} Mercury in D10 H${d10Merc?.houseFromVargaLagna}${d10Jup?.dignity === 'Own Sign' ? ` + D10 Jupiter H${d10Jup.houseFromVargaLagna}` : ''})`
    : isStrongMarsD10
      ? ` | D10 Strength: Executive Action, Operations, Engineering or Commercial Leadership (D10 Mars H${d10Mars?.houseFromVargaLagna}${d10H10Occ.length ? `, H10: ${d10H10Occ.map((p) => p.id).join('+')}` : ''})`
      : isStrongMoonOrJupD10
        ? ` | D10 Strength: Public Service, Healthcare, Advisory, Teaching & Consumer Enterprise (D10 Moon/Guru Kendra)`
        : ` | D10 Anchor: ${SIGNS[d10LagnaIdx].name} Dashamsha (H10 SAV ${h10.savBindus}, Saturn Rank #${satShad?.rank ?? '-'}/7)`;
  const techCareerSuffixHi = isStrongMercD10
    ? ` | D10 बल: विश्लेषणात्मक तकनीकी, वाणिज्य, वित्त व संवाद कौशल (D10 बुध ${d10Merc?.dignity})`
    : isStrongMarsD10
      ? ` | D10 बल: प्रशासनिक संचालन, अभियांत्रिकी या सक्रिय व्यावसायिक नेतृत्व (D10 मंगल भाव ${d10Mars?.houseFromVargaLagna})`
      : isStrongMoonOrJupD10
        ? ` | D10 बल: जनसेवा, चिकित्सा, परामर्श, शिक्षा व उपभोक्ता सेवा क्षेत्र`
        : ` | D10 आधार: ${SIGN_HI[d10LagnaIdx]} दशांश (दशम SAV ${h10.savBindus}, शनि रैंक #${satShad?.rank ?? '-'}/7)`;

  // Abroad / Metro Travel Score
  const hNum = (p?: BodyPosition) => (p ? (p.rasiHouseNumber ?? p.houseNumber ?? 1) : 1);
  const l9H = hNum(ctx.planetsById.get(h9.lordId));
  const l12H = hNum(ctx.planetsById.get(h12.lordId));
  const l4H = hNum(ctx.planetsById.get(h4.lordId));

  let abroadPts = 0;
  if ([9, 12].includes(hNum(rahu))) abroadPts += 3;
  if (hNum(rahu) === 4) abroadPts += 2; // Displacement away from birthplace + Shatabhisha foreign Nakshatra
  if (moon && (moon.nakshatraName === 'Shatabhisha' || moon.nakshatraName === 'Ardra' || moon.nakshatraName === 'Swati')) abroadPts += 1.5;
  if (l9H === 12 || l12H === 9 || l12H === 10 || l4H === 12) abroadPts += 2.5;
  if (hNum(mercury) === 12 || hNum(venus) === 12 || hNum(jupiter) === 7) abroadPts += 1.5;
  if (SIGNS[h9.signIndex].modality === 'Movable' || SIGNS[h12.signIndex].modality === 'Movable') abroadPts += 1.5;
  if (h12.savBindus >= 28) abroadPts += 1;

  const abroadWin = ctx.findBestDashaWindows(22, 48, (md, ad) => {
    const fSet = new Set<string>(['Rahu', h12.lordId, h9.lordId, h4.lordId, 'Mercury', 'Moon']);
    const sc = (fSet.has(md) ? 1.5 : 0) + (fSet.has(ad) ? 2.5 : 0);
    return sc >= 3.5
      ? {
          score: sc,
          reasonEn: `${md}–${ad} activates 4th/9th/12th foreign axis`,
          reasonHi: `${grahaHi(md)}–${grahaHi(ad)} दशा में विदेश/दूरस्थ प्रवास`,
        }
      : { score: 0, reasonEn: '', reasonHi: '' };
  })[0];

  const abroadWinStrEn = abroadWin ? ` (Peak Dasha: ${abroadWin.startYear}–${abroadWin.endYear} ${abroadWin.mdLord}–${abroadWin.adLord})` : '';
  const abroadWinStrHi = abroadWin ? ` (प्रमुख दशा: ${abroadWin.startYear}–${abroadWin.endYear} ${grahaHi(abroadWin.mdLord)}–${grahaHi(abroadWin.adLord)})` : '';

  let abEn = '';
  let abHi = '';
  if (abroadPts >= 6) {
    abEn = `High Foreign Settlement / International Work Relocation Yoga (Score ${abroadPts.toFixed(1)}, H12 SAV ${h12.savBindus})${abroadWinStrEn}`;
    abHi = `प्रबल दीर्घकालिक विदेश प्रवास व अंतरराष्ट्रीय करियर योग (द्वादश SAV ${h12.savBindus})${abroadWinStrHi}`;
  } else if (abroadPts >= 4) {
    abEn = `Active Overseas Work Trips & Metro Relocation Away from Birthplace (Rahu/4th/9th/12th synthesis, H12 SAV ${h12.savBindus})${abroadWinStrEn}`;
    abHi = `विदेश कार्य-यात्रा एवं जन्मस्थान से दूर महानगर में स्थायी निवास योग (SAV ${h12.savBindus})${abroadWinStrHi}`;
  } else if (abroadPts >= 2.5) {
    abEn = `Inter-State Career Relocation & Selective International Travel (H9 SAV ${h9.savBindus}, H12 SAV ${h12.savBindus})${abroadWinStrEn}`;
    abHi = `अन्य राज्य में कार्यक्षेत्र व समय-समय पर दूरस्थ/विदेश यात्रा योग${abroadWinStrHi}`;
  } else {
    abEn = `Homeland-Anchored Stability with Pilgrimage / Leisure Travel (H4 SAV ${h4.savBindus}, H12 SAV ${h12.savBindus})`;
    abHi = `मातृभूमि में स्थायी निवास एवं तीर्थ/अवसर-आधारित यात्राएं`;
  }

  return {
    techCareerSuffixEn,
    techCareerSuffixHi,
    abroadTravelResult: {
      valEn: abEn,
      valHi: abHi,
      explEn: `Assessed from 4th/9th/12th SAV (${h4.savBindus}/${h9.savBindus}/${h12.savBindus}), Rahu/Ketu displacement (${hNum(rahu)}/${hNum(ketu)}), Moon Nakshatra (${moon?.nakshatraName ?? '-'}), and Vimshottari travel Dashas.`,
      explHi: `चतुर्थ/नवम/द्वादश SAV (${h4.savBindus}/${h9.savBindus}/${h12.savBindus}), राहु स्थिति (${hNum(rahu)}), चंद्र नक्षत्र व दशा चक्र से विदेश व प्रवास योग।`,
    },
  };
}

// =============================================================================
// UNIVERSAL FULL-VARGA SYNTHESIS 5: CONSTITUTIONAL AYUS VITALITY (NO FIXED AGE)
// =============================================================================
export interface WeightedAyusVitalityVerdict {
  threePairsVerdict: 'Poornayu' | 'Madhyayu' | 'Alpayu';
  reserveIndex: number;
  valEn: string;
  valHi: string;
  explEn: string;
  explHi: string;
}

export function evaluateWeightedAyusVitality(
  ctx: ClassicalSynthesisContext,
  ascSignIdx: number,
  chart: ChartData
): WeightedAyusVitalityVerdict {
  const l1Id = SIGNS[ascSignIdx].lord;
  const l2Id = SIGNS[(ascSignIdx + 1) % 12].lord;
  const l7Id = SIGNS[(ascSignIdx + 6) % 12].lord;
  const l8Id = SIGNS[(ascSignIdx + 7) % 12].lord;

  const l1 = ctx.planetsById.get(l1Id);
  const l8 = ctx.planetsById.get(l8Id);
  const moon = ctx.planetsById.get('Moon');
  const saturn = ctx.planetsById.get('Saturn');
  const jupiter = ctx.planetsById.get('Jupiter');
  const mars = ctx.planetsById.get('Mars');
  const rahu = ctx.planetsById.get('Rahu');

  const pairAyur = (sA: number, sB: number): 'Poornayu' | 'Madhyayu' | 'Alpayu' => {
    const mA = sA % 3;
    const mB = sB % 3;
    const pair = [mA, mB].sort((x, y) => x - y).join(',');
    if (pair === '0,0' || pair === '1,2') return 'Poornayu';
    if (pair === '2,2' || pair === '0,1') return 'Madhyayu';
    return 'Alpayu';
  };
  const hlPoint = chart.specialPoints?.find((sp) => sp.id === 'HL');
  const g1 = pairAyur(l1?.signIndex ?? ascSignIdx, l8?.signIndex ?? ((ascSignIdx + 7) % 12));
  const g2 = pairAyur(ascSignIdx, moon?.signIndex ?? ascSignIdx);
  const g3 = pairAyur(ascSignIdx, hlPoint?.signIndex ?? ascSignIdx);
  const threePairsVerdict: 'Poornayu' | 'Madhyayu' | 'Alpayu' =
    g1 === g2 ? g1 : g1 === g3 ? g1 : g2 === g3 ? g2 : g3;

  const h1 = ctx.bhavaByHouse.get(1)!;
  const h8 = ctx.bhavaByHouse.get(8)!;
  const h12 = ctx.bhavaByHouse.get(12)!;
  const l1Shad = ctx.shadbalaByPlanet.get(l1Id);
  const satShad = ctx.shadbalaByPlanet.get('Saturn');
  const d8Lagna = ctx.getVargaPlacement('D8', 'Asc');
  const d8L8 = ctx.getVargaPlacement('D8', SIGNS[((d8Lagna?.signIndex ?? ascSignIdx) + 7) % 12].lord);
  const d30Sat = ctx.getVargaPlacement('D30', 'Saturn');
  const d27Moon = ctx.getVargaPlacement('D27', 'Moon');
  const d9Asc = ctx.getVargaPlacement('D9', 'Asc');
  const isAscVargottama = d9Asc?.signIndex === ascSignIdx;

  let reserveScore = threePairsVerdict === 'Poornayu' ? 68 : threePairsVerdict === 'Madhyayu' ? 56 : 44;
  if (l1Shad && l1Shad.rank <= 3) reserveScore += 8;
  else if (l1Shad && l1Shad.rank >= 6) reserveScore -= 7;
  if (satShad && satShad.rank <= 3) reserveScore += 7;
  if (l1 && [1, 4, 5, 7, 9, 10].includes(l1.rasiHouseNumber ?? 0)) reserveScore += 6;
  if (l1 && [6, 8, 12].includes(l1.rasiHouseNumber ?? 0)) reserveScore -= 7;
  if (l8 && [1, 4, 5, 7, 8, 9, 10, 11].includes(l8.rasiHouseNumber ?? 0)) reserveScore += 4;
  if (jupiter && [1, 4, 5, 7, 9, 10].includes(jupiter.rasiHouseNumber ?? 0)) reserveScore += 8;
  if (isAscVargottama) reserveScore += 6;
  if (h1.savBindus >= 30) reserveScore += 4;
  if (h8.savBindus <= 22) reserveScore -= 4;
  if (d8L8 && ['Exalted', 'Own Sign', 'Moolatrikona'].includes(d8L8.dignity)) reserveScore += 4;
  if (d30Sat && [6, 8, 12].includes(d30Sat.houseFromVargaLagna)) reserveScore -= 4;
  if (d27Moon && ['Exalted', 'Own Sign'].includes(d27Moon.dignity)) reserveScore += 4;

  const h8Occ = Array.from(ctx.planetsById.values()).filter((p) => (p.rasiHouseNumber ?? p.houseNumber) === 8);
  const h8Malefics = h8Occ.filter((p) => ['Mars', 'Saturn', 'Rahu', 'Ketu', 'Sun'].includes(p.id)).length;
  const vitalsDualHit = Boolean(
    mars && rahu && mars.rasiHouseNumber === rahu.rasiHouseNumber && [1, 6, 8, 12].includes(mars.rasiHouseNumber ?? 0)
  );
  if (h8Malefics >= 2) reserveScore -= 8;
  if (vitalsDualHit) reserveScore -= 7;

  const reserveIndex = Math.max(25, Math.min(96, Math.round(reserveScore)));

  const vigSet = new Set<string>([
    l2Id,
    l7Id,
    l8Id,
    ctx.specialPointsDigest.kharaDrekkanaLord,
    ctx.specialPointsDigest.chaturshashtaNavLord,
  ]);
  const vigWindows = ctx.findBestDashaWindows(24, 72, (md, ad) => {
    let sc = 0;
    if (vigSet.has(md)) sc += 2;
    if (vigSet.has(ad)) sc += 3;
    if (ad === 'Rahu' || ad === 'Saturn' || ad === 'Ketu') sc += 1;
    return sc >= 4
      ? {
          score: sc,
          reasonEn: `${md}–${ad} activates Maraka/8th/22nd-Drekkana vigilance axis`,
          reasonHi: `${grahaHi(md)}–${grahaHi(ad)} मारक/अष्टम स्वास्थ्य-सतर्कता काल`,
        }
      : { score: 0, reasonEn: '', reasonHi: '' };
  });
  const vigWin = vigWindows[0];
  const vigTextEn = vigWin
    ? `Health-Care Vigilance Cycle: Ages ${Math.floor(vigWin.ageStart)}–${Math.ceil(vigWin.ageEnd + 1)} (${vigWin.mdLord}–${vigWin.adLord})`
    : `Preventive transition vigilance during 2L (${l2Id}) / 7L (${l7Id}) / 8L (${l8Id}) sub-periods`;
  const vigTextHi = vigWin
    ? `प्रमुख स्वास्थ्य-संरक्षण काल: आयु ${Math.floor(vigWin.ageStart)}–${Math.ceil(vigWin.ageEnd + 1)} वर्ष (${grahaHi(vigWin.mdLord)}–${grahaHi(vigWin.adLord)})`
    : `द्वितीयेश (${grahaHi(l2Id)}) / सप्तमेश (${grahaHi(l7Id)}) / अष्टमेश (${grahaHi(l8Id)}) अंतर्दशा में सतर्कता`;

  let tierEn = '';
  let tierHi = '';
  const hasJupShield = Boolean(jupiter && [1, 4, 5, 7, 9, 10].includes(jupiter.rasiHouseNumber ?? 0));

  if (reserveIndex >= 76) {
    tierEn = `Poornayu Constitutional Reserve (Vitality Index ${reserveIndex}/100, D1/D8/D27/D30 Fortified): Strong enduring recovery stamina | ${vigTextEn}`;
    tierHi = `पूर्णायु सुदृढ़ जीवनी-शक्ति (संवैधानिक बल ${reserveIndex}/100, D1/D8/D27/D30 पुष्ट): दीर्घकालिक रोग-प्रतिरोधक क्षमता | ${vigTextHi}`;
  } else if (reserveIndex >= 62) {
    tierEn = `Strong-to-Balanced Reserve (Ayus Index ${reserveIndex}/100, ${threePairsVerdict}): Steady vitality sustained by routine lifestyle balance | ${vigTextEn} | OR / अथवा: Conscious preventive care unlocks resilient longevity`;
    tierHi = `संतुलित-सबल आयु-कोष (जीवनी बल ${reserveIndex}/100, ${threePairsVerdict}): नियमित दिनचर्या से उत्तम दीर्घ-स्थायित्व | ${vigTextHi} | अथवा: समयबद्ध स्वास्थ्य देखभाल से पूर्ण सुरक्षा`;
  } else if (reserveIndex >= 48) {
    tierEn = `Madhyayu / Lifestyle-Sensitive Reserve (Ayus Index ${reserveIndex}/100, ${threePairsVerdict}): Vitality responds strongly to sleep, cardiac/metabolic screening & stress hygiene | ${vigTextEn}${hasJupShield ? ' | OR / अथवा: Jupiter Kendra/Trikona shield steadily buffers physical crises' : ''}`;
    tierHi = `मध्यायु / दिनचर्या-संवेदनशील जीवनी शक्ति (बल ${reserveIndex}/100, ${threePairsVerdict}): पर्याप्त निद्रा, नियमित जांच व तनाव-नियंत्रण आवश्यक | ${vigTextHi}${hasJupShield ? ' | अथवा: केंद्र/त्रिकोणस्थ गुरु संकट से रक्षा करता है' : ''}`;
  } else {
    tierEn = `Preventive Vitality & Akal-Mrityu Vigilance Care (Ayus Index ${reserveIndex}/100, ${threePairsVerdict}): Prioritize safety, early diagnostics & Maha Mrityunjaya calm | ${vigTextEn} | OR / अथवा: Disciplined medical vigilance transforms vulnerable Dashas into healing pivots`;
    tierHi = `सजग स्वास्थ्य एवं आयु-रक्षा सतर्कता (बल ${reserveIndex}/100, ${threePairsVerdict}): सुरक्षा, समय पर जांच व महामृत्युंजय साधना अनिवार्य | ${vigTextHi} | अथवा: अनुशासित उपचार से कठिन दशा का सफल शमन`;
  }

  return {
    threePairsVerdict,
    reserveIndex,
    valEn: tierEn,
    valHi: tierHi,
    explEn: `Three-Pairs BPHS Ayurdaya (L1+L8=${g1}, Lagna+Moon=${g2}, Lagna+HL=${g3} → ${threePairsVerdict}) combined mathematically with L1 Rank #${l1Shad?.rank ?? '-'}/7, Saturn Rank #${satShad?.rank ?? '-'}/7, H1/H8/H12 SAV (${h1.savBindus}/${h8.savBindus}/${h12.savBindus}), D8 Ashtamsha, D27, D30 & 22nd Drekkana (${ctx.specialPointsDigest.kharaDrekkanaLord}). No deterministic death-age cutoff is assumed.`,
    explHi: `त्रि-युग्म आयुर्दाय (${g1}, ${g2}, ${g3} → ${threePairsVerdict}), लग्नेश रैंक #${l1Shad?.rank ?? '-'}/7, शनि रैंक #${satShad?.rank ?? '-'}/7, D8/D27/D30 और २२वें द्रेष्काण (${grahaHi(ctx.specialPointsDigest.kharaDrekkanaLord)}) से संवैधानिक जीवनी-शक्ति की गणना (कोई निश्चित मृत्यु-आयु मानकर नहीं)।`,
  };
}

// =============================================================================
// UNIVERSAL MULTI-HYPOTHESIS CAREER ENGINE (ALL VARGAS + OR/अथवा BRANCHING)
// =============================================================================
export interface MultiHypothesisCareerVerdict {
  primaryEn: string;
  primaryHi: string;
  secondaryAltEn?: string;
  secondaryAltHi?: string;
  combinedEn: string;
  combinedHi: string;
  jobVsBizAltEn: string;
  jobVsBizAltHi: string;
  explEn: string;
  explHi: string;
}

export function evaluateMultiHypothesisCareer(
  ctx: ClassicalSynthesisContext,
  ascSignIdx: number
): MultiHypothesisCareerVerdict {
  const h6 = ctx.bhavaByHouse.get(6)!;
  const h7 = ctx.bhavaByHouse.get(7)!;
  const h8 = ctx.bhavaByHouse.get(8)!;
  const h10 = ctx.bhavaByHouse.get(10)!;
  const h11 = ctx.bhavaByHouse.get(11)!;

  const sun = ctx.planetsById.get('Sun');
  const moon = ctx.planetsById.get('Moon');
  const mars = ctx.planetsById.get('Mars');
  const mercury = ctx.planetsById.get('Mercury');
  const jupiter = ctx.planetsById.get('Jupiter');
  const venus = ctx.planetsById.get('Venus');
  const saturn = ctx.planetsById.get('Saturn');
  const rahu = ctx.planetsById.get('Rahu');
  const ketu = ctx.planetsById.get('Ketu');

  const pot = (id: PlanetId) => ctx.potencyByPlanet.get(id) ?? 0.8;
  const inH = (p: BodyPosition | undefined, houses: number[]) =>
    Boolean(p && houses.includes(p.rasiHouseNumber ?? p.houseNumber ?? 0));
  const d10Pl = (id: PlanetId) => ctx.getVargaPlacement('D10', id);
  const d10H = (id: PlanetId, houses: number[]) => {
    const p = d10Pl(id);
    return Boolean(p && houses.includes(p.houseFromVargaLagna));
  };
  const d20Pl = (id: PlanetId) => ctx.getVargaPlacement('D20', id);
  const d24Pl = (id: PlanetId) => ctx.getVargaPlacement('D24', id);
  const d6Pl = (id: PlanetId) => ctx.getVargaPlacement('D6', id);
  const d4Pl = (id: PlanetId) => ctx.getVargaPlacement('D4', id);

  const l10Id = h10.lordId;
  const l8Id = h8.lordId;
  const akPlanet = Array.from(ctx.planetsById.values()).find((p) => p.charaKaraka === 'AK')?.id;

  const tracks: Array<{ id: string; score: number; en: string; hi: string }> = [
    {
      id: 'police_admin',
      en: 'Public Governance, Defense / Police Service, Executive Command & Regulatory Authority',
      hi: 'प्रशासनिक सेवा, रक्षा/पुलिस, न्याय-प्रवर्तन एवं उच्च कार्यकारी नेतृत्व',
      score:
        (inH(sun, [1, 6, 9, 10, 11]) ? 2.4 * pot('Sun') : 0) +
        (inH(mars, [1, 3, 6, 10, 11]) ? 2.5 * pot('Mars') : 0) +
        (d10H('Sun', [1, 10, 11]) ? 1.8 : 0) +
        (d10H('Mars', [1, 6, 10, 11]) ? 1.8 : 0) +
        ([1, 6, 10].includes(ctx.planetsById.get(l10Id)?.rasiHouseNumber ?? 0) && ['Sun', 'Mars'].includes(l10Id) ? 2.0 : 0) +
        (h6.savBindus >= 29 && h10.savBindus >= 29 ? 1.0 : 0),
    },
    {
      id: 'astrology_mystic',
      en: 'Jyotish / Astrology, Occult Research, Psychological Counseling & Deep Advisory',
      hi: 'ज्योतिष/अध्यात्म शोध, गूढ़ विश्लेषण, मनोवैज्ञानिक परामर्श एवं मार्गदर्शक सेवा',
      score:
        (inH(ketu, [1, 5, 8, 9, 10, 12]) ? 2.2 : 0) +
        (inH(jupiter, [1, 5, 8, 9, 12]) ? 2.2 * pot('Jupiter') : 0) +
        (inH(mercury, [1, 5, 8, 12]) ? 1.5 * pot('Mercury') : 0) +
        (inH(ctx.planetsById.get(l10Id), [8, 9, 12]) ? 2.0 : 0) +
        (inH(ctx.planetsById.get(l8Id), [1, 5, 10, 11]) ? 2.0 : 0) +
        ([d20Pl('Jupiter')?.houseFromVargaLagna, d20Pl('Ketu')?.houseFromVargaLagna].some((h) => h && [1, 5, 9, 10].includes(h)) ? 1.6 : 0) +
        (d10H('Ketu', [1, 5, 8, 10, 12]) || d10H('Jupiter', [1, 5, 8, 9, 10]) ? 1.6 : 0) +
        (akPlanet && ['Jupiter', 'Ketu', 'Mercury', 'Moon'].includes(akPlanet) ? 0.9 : 0),
    },
    {
      id: 'tech_engineering',
      en: 'Software Engineering, AI / Data Architecture, Systems Design & Applied Technology',
      hi: 'सॉफ्टवेयर इंजीनियरिंग, डेटा/एआई आर्किटेक्चर, आधुनिक तकनीकी एवं सिस्टम डिजाइन',
      score:
        (inH(mercury, [1, 2, 5, 10, 11]) ? 2.2 * pot('Mercury') : 0) +
        (inH(rahu, [1, 3, 6, 10, 11]) ? 2.0 : 0) +
        (inH(saturn, [1, 3, 6, 10, 11]) ? 1.8 * pot('Saturn') : 0) +
        (d10H('Mercury', [1, 5, 10, 11]) ? 1.8 : 0) +
        (d10H('Rahu', [1, 10, 11]) || d24Pl('Mercury')?.houseFromVargaLagna === 5 ? 1.5 : 0) +
        ([2, 5, 6, 10].includes(ctx.planetsById.get(l10Id)?.signIndex ?? -1) ? 0.8 : 0),
    },
    {
      id: 'commerce_finance',
      en: 'Banking, Commerce, FinTech, Trading, FMCG & Supply-Chain Enterprise',
      hi: 'बैंकिंग, वाणिज्य, व्यापार, आपूर्ति-श्रृंखला (FMCG/Retail) एवं वित्तीय प्रबंधन',
      score:
        (inH(mercury, [1, 2, 7, 10, 11]) ? 2.2 * pot('Mercury') : 0) +
        (inH(venus, [1, 2, 4, 7, 10, 11]) ? 1.8 * pot('Venus') : 0) +
        (inH(jupiter, [2, 5, 9, 11]) ? 1.6 * pot('Jupiter') : 0) +
        (h11.savBindus >= 30 ? 1.5 : 0) +
        (ctx.bhavaByHouse.get(2)!.savBindus >= 29 ? 1.2 : 0) +
        (d10H('Venus', [2, 7, 10, 11]) || ctx.getVargaPlacement('D2', 'Jupiter')?.signIndex === 3 ? 1.4 : 0),
    },
    {
      id: 'medical_healing',
      en: 'Medicine, Clinical Healthcare, Surgery, Diagnostics & Ayurveda / Pharmacy',
      hi: 'चिकित्सा, स्वास्थ्य सेवा, शल्य/निदान विज्ञान एवं आयुर्वेद/औषधि क्षेत्र',
      score:
        (inH(sun, [1, 6, 8, 10, 12]) ? 1.7 * pot('Sun') : 0) +
        (inH(mars, [6, 8, 12]) ? 1.9 * pot('Mars') : 0) +
        (inH(moon, [1, 4, 6, 10]) ? 1.6 * pot('Moon') : 0) +
        (inH(jupiter, [1, 6, 8, 12]) ? 1.6 * pot('Jupiter') : 0) +
        ([d6Pl('Sun')?.houseFromVargaLagna, d6Pl('Mars')?.houseFromVargaLagna].some((h) => h && [1, 6, 10].includes(h)) ? 1.8 : 0) +
        (inH(ctx.planetsById.get(l10Id), [6, 8, 12]) ? 1.4 : 0),
    },
    {
      id: 'law_education',
      en: 'Law, Judicial Policy, Higher Education, Research Academia & Institutional Strategy',
      hi: 'विधि (Law), न्यायिक नीति, उच्च शिक्षण, शोध एवं संस्थागत परामर्श',
      score:
        (inH(jupiter, [1, 4, 5, 9, 10]) ? 2.4 * pot('Jupiter') : 0) +
        (inH(saturn, [6, 7, 9, 10]) ? 1.6 * pot('Saturn') : 0) +
        (d24Pl('Jupiter')?.houseFromVargaLagna === 1 || d24Pl('Jupiter')?.houseFromVargaLagna === 5 || d24Pl('Jupiter')?.houseFromVargaLagna === 9 ? 1.9 : 0) +
        (d10H('Jupiter', [1, 5, 9, 10]) ? 1.6 : 0) +
        (ctx.bhavaByHouse.get(9)!.savBindus >= 29 ? 1.1 : 0),
    },
    {
      id: 'arts_media',
      en: 'Media, Cinema, Design, Literature, Public Communication & Creative Brand Studio',
      hi: 'मीडिया, सिनेमा, डिजाइन, साहित्य, जनसंचार एवं रचनात्मक कला क्षेत्र',
      score:
        (inH(venus, [1, 3, 5, 7, 10, 11]) ? 2.4 * pot('Venus') : 0) +
        (inH(moon, [1, 3, 5, 10, 11]) ? 1.7 * pot('Moon') : 0) +
        (d10H('Venus', [1, 3, 5, 7, 10]) ? 1.8 : 0) +
        (inH(ctx.planetsById.get(l10Id), [3, 5]) ? 1.3 : 0),
    },
    {
      id: 'infra_realty',
      en: 'Architecture, Real Estate, Heavy Infrastructure, Manufacturing & Operations',
      hi: 'वास्तुकला, रियल एस्टेट, बुनियादी ढांचा, विनिर्माण एवं औद्योगिक संचालन',
      score:
        (inH(mars, [4, 7, 10, 11]) ? 2.0 * pot('Mars') : 0) +
        (inH(saturn, [4, 7, 10, 11]) ? 2.1 * pot('Saturn') : 0) +
        (d4Pl('Mars')?.houseFromVargaLagna === 4 || d4Pl('Saturn')?.houseFromVargaLagna === 4 ? 1.8 : 0) +
        (inH(ctx.planetsById.get(l10Id), [4]) ? 1.7 : 0),
    },
  ];

  tracks.sort((a, b) => b.score - a.score);
  const top1 = tracks[0];
  const top2 = tracks[1];
  const hasSecondaryAlt = Boolean(top2 && top2.score >= top1.score * 0.62 && top2.score >= 3.2);

  const combinedEn = hasSecondaryAlt
    ? `${top1.en} | OR / अथवा (Micro-Varga Alt): ${top2.en}`
    : `${top1.en}`;
  const combinedHi = hasSecondaryAlt
    ? `${top1.hi} | अथवा (सूक्ष्म वर्ग विश्लेषण): ${top2.hi}`
    : `${top1.hi}`;

  const d10H7 = ctx.getVargaOccupants('D10', 7).length;
  const d10H6 = ctx.getVargaOccupants('D10', 6).length;
  const jobVsBizAltEn =
    Math.abs(h6.savBindus - h7.savBindus) <= 4 || (d10H6 > 0 && d10H7 > 0)
      ? ' | OR / अथवा: Structured specialist career initially, with independent advisory/consulting flexibility in later Dashas'
      : '';
  const jobVsBizAltHi =
    Math.abs(h6.savBindus - h7.savBindus) <= 4 || (d10H6 > 0 && d10H7 > 0)
      ? ' | अथवा: प्रारंभ में संगठित सेवा/नौकरी और बाद की दशाओं में स्वतंत्र परामर्श या उद्यम विकल्प'
      : '';

  return {
    primaryEn: top1.en,
    primaryHi: top1.hi,
    secondaryAltEn: hasSecondaryAlt ? top2.en : undefined,
    secondaryAltHi: hasSecondaryAlt ? top2.hi : undefined,
    combinedEn,
    combinedHi,
    jobVsBizAltEn,
    jobVsBizAltHi,
    explEn: `Multi-Hypothesis Career Scoring across D1 + D2/D4/D6/D10/D20/D24: Primary track (${top1.score.toFixed(1)}) led by ${l10Id} & Shadbala potencies${hasSecondaryAlt ? `; secondary hypothesis (${top2.score.toFixed(1)}) also passes threshold so both classical and modern avenues remain active` : ''}.`,
    explHi: `D1 एवं D2/D4/D6/D10/D20/D24 वर्गों में बहु-प्रायिकता विश्लेषण: मुख्य मार्ग (${top1.score.toFixed(1)})${hasSecondaryAlt ? ` तथा द्वितीय विकल्प (${top2.score.toFixed(1)}) दोनों के सूक्ष्म योग सक्रिय हैं` : ''}।`,
  };
}

// =============================================================================
// UNIVERSAL FULL-VARGA SIBLINGS (D1 + D3 DREKKANA + D11 + MARS BAV + CHAIN)
// =============================================================================
export interface FullVargaSiblingsVerdict {
  valEn: string;
  valHi: string;
  explEn: string;
  explHi: string;
  pacEn: string;
  pacHi: string;
}

export function evaluateFullVargaSiblings(
  ctx: ClassicalSynthesisContext,
  ascSignIdx: number
): FullVargaSiblingsVerdict {
  const h3 = ctx.bhavaByHouse.get(3)!;
  const h11 = ctx.bhavaByHouse.get(11)!;
  const l3Id = h3.lordId;
  const l11Id = h11.lordId;

  const mars = ctx.planetsById.get('Mars');
  const jupiter = ctx.planetsById.get('Jupiter');
  const saturn = ctx.planetsById.get('Saturn');
  const ketu = ctx.planetsById.get('Ketu');
  const rahu = ctx.planetsById.get('Rahu');

  const marsBav3 = ctx.getBavBindus('Mars', 3);
  const marsBav11 = ctx.getBavBindus('Mars', 11);
  const d3Lagna = ctx.getVargaPlacement('D3', 'Asc');
  const d3Mars = ctx.getVargaPlacement('D3', 'Mars');
  const d3H3Occ = ctx.getVargaOccupants('D3', 3);
  const d3H11Occ = ctx.getVargaOccupants('D3', 11);
  const d11Occ = ctx.getVargaOccupants('D11', 3).length + ctx.getVargaOccupants('D11', 11).length;

  const h3Occ = Array.from(ctx.planetsById.values()).filter((p) => (p.rasiHouseNumber ?? p.houseNumber) === 3);
  const h11Occ = Array.from(ctx.planetsById.values()).filter((p) => (p.rasiHouseNumber ?? p.houseNumber) === 11);

  const l3 = ctx.planetsById.get(l3Id);
  const l11 = ctx.planetsById.get(l11Id);
  const youngerScore =
    (h3.savBindus >= 28 ? 1.5 : h3.savBindus >= 24 ? 1.0 : 0.4) +
    h3Occ.filter((p) => p.id !== 'Ketu' && p.id !== 'Saturn').length * 0.8 +
    d3H3Occ.length * 0.5 +
    (marsBav3 >= 4 ? 0.8 : 0.2) -
    (h3Occ.some((p) => p.id === 'Saturn' || p.id === 'Ketu') ? 0.7 : 0) -
    (l3 && [6, 8, 12].includes(l3.rasiHouseNumber ?? 0) ? 0.6 : 0);

  const elderScore =
    (h11.savBindus >= 29 ? 1.5 : h11.savBindus >= 25 ? 1.0 : 0.4) +
    h11Occ.filter((p) => p.id !== 'Ketu' && p.id !== 'Saturn').length * 0.8 +
    d3H11Occ.length * 0.5 +
    (marsBav11 >= 4 ? 0.8 : 0.2) -
    (h11Occ.some((p) => p.id === 'Ketu') ? 0.6 : 0) -
    (l11 && [6, 8, 12].includes(l11.rasiHouseNumber ?? 0) ? 0.6 : 0);

  const totalSignal = Math.max(0, youngerScore + elderScore + (d11Occ > 0 ? 0.4 : 0));
  const decanate = Math.floor((ctx.getVargaPlacement('D1', 'Asc')?.degreeInSign ?? 12) / 10); // 0=1st, 1=2nd, 2=3rd

  let countBandEn = '1–2 siblings';
  let countBandHi = '१ से २ भाई-बहन';
  if (totalSignal < 1.3 && h3.savBindus <= 24 && h11.savBindus <= 25) {
    countBandEn = '0–1 co-born (Only-child or single close sibling)';
    countBandHi = '०–१ सहोदर (इकलौती संतान या १ निकट भाई-बहन)';
  } else if (totalSignal >= 4.4) {
    countBandEn = '2–3+ siblings (modern range 2–3; classical multi-sibling parity)';
    countBandHi = '२ से ३+ सहोदर (आधुनिक संदर्भ में २–३ भाई-बहन)';
  } else if (totalSignal >= 2.8) {
    countBandEn = '2 siblings';
    countBandHi = '२ भाई-बहन';
  }

  let orderEn = '';
  let orderHi = '';
  if (totalSignal < 1.3) {
    orderEn = `${countBandEn} | OR / अथवा: Close cousins / companions act like siblings`;
    orderHi = `${countBandHi} | अथवा: चचेरे भाई-बहन या घनिष्ठ मित्र सहोदर भूमिका निभाते हैं`;
  } else if (elderScore - youngerScore >= 0.7) {
    const chainMale1 = [0, 2, 4, 6, 8, 10].includes(ctx.bhavaByHouse.get(11)!.signIndex) || ['Sun', 'Mars', 'Jupiter'].includes(l11Id);
    orderEn = `Youngest-child signature (${countBandEn}; elder ${chainMale1 ? 'brother' : 'sister'} via 11th→9th→7th) | OR / अथवा: Late-middle birth order if D3 (${SIGNS[d3Lagna?.signIndex ?? ascSignIdx].name}) decanate precedes a younger gap`;
    orderHi = `सबसे छोटे (कनिष्ठ) सहोदर का प्रमुख संकेत (${countBandHi}; बड़े ${chainMale1 ? 'भाई' : 'बहन'} का योग 11→9→7 से) | अथवा: D3 द्रेष्काण के अनुसार मँझले क्रम का संयोग`;
  } else if (youngerScore - elderScore >= 0.7 || (decanate === 0 && youngerScore >= 1.5)) {
    const chainMale1 = [0, 2, 4, 6, 8, 10].includes(ctx.bhavaByHouse.get(3)!.signIndex) || ['Sun', 'Mars', 'Jupiter'].includes(l3Id);
    orderEn = `Eldest-child responsibility (${countBandEn}; younger ${chainMale1 ? 'brother' : 'sister'} via 3rd→5th→7th) | OR / अथवा: Early-middle position if elder sibling distance or early loss applies`;
    orderHi = `सबसे बड़े (ज्येष्ठ) सहोदर का प्रमुख संकेत (${countBandHi}; छोटे ${chainMale1 ? 'भाई' : 'बहन'} का योग 3→5→7 से) | अथवा: बड़े सहोदर से दूरी होने पर मँझला/वरिष्ठ क्रम`;
  } else {
    orderEn = `Middle / Balanced sibling position (${countBandEn}; elder 11th→9th & younger 3rd→5th active) | OR / अथवा: ${decanate === 0 ? 'Eldest' : decanate === 2 ? 'Youngest' : 'Second-in-order'} expression per D3 Decanate #${decanate + 1}`;
    orderHi = `मँझले / संतुलित सहोदर क्रम का योग (${countBandHi}; बड़े व छोटे दोनों भाव सक्रिय) | अथवा: D3 द्रेष्काण #${decanate + 1} अनुसार ${decanate === 0 ? 'ज्येष्ठ' : decanate === 2 ? 'कनिष्ठ' : 'द्वितीय'} स्थान`;
  }

  const jupNote = jupiter && [3, 11].includes(jupiter.rasiHouseNumber ?? 0) ? 'Jupiter supports surviving harmony' : '';
  const lossCaution = Boolean((ketu && [3, 11].includes(ketu.rasiHouseNumber ?? 0)) || (rahu && saturn && [3, 11].includes(saturn.rasiHouseNumber ?? 0) && marsBav3 <= 2));

  return {
    valEn: `${orderEn}${lossCaution ? ' (Note: Nodal/Mars-BAV pressure indicates gap or surviving count variance)' : ''}`,
    valHi: `${orderHi}${lossCaution ? ' (राहु-केतु/मंगल BAV से सहोदर संख्या में अंतराल संभव)' : ''}`,
    explEn: `Synthesizes D1 (H3 SAV ${h3.savBindus}, H11 SAV ${h11.savBindus}), Mars BAV (H3=${marsBav3}, H11=${marsBav11}), D3 Drekkana (${SIGNS[d3Lagna?.signIndex ?? ascSignIdx].name}, D3 Mars H${d3Mars?.houseFromVargaLagna ?? '-'}), D11, and nodal chains. ${jupNote}`,
    explHi: `D1 (तृतीय SAV ${h3.savBindus}, एकादश SAV ${h11.savBindus}), मंगल अष्टकवर्ग (${marsBav3}/${marsBav11}), D3 द्रेष्काण, D11 और भाव-श्रृंखला (11→9→7 व 3→5→7) का समन्वित फलित।`,
    pacEn: `H3 L:${l3Id} (SAV ${h3.savBindus}, Mars BAV ${marsBav3}); H11 L:${l11Id} (SAV ${h11.savBindus}, Mars BAV ${marsBav11}); D3 Lagna ${SIGNS[d3Lagna?.signIndex ?? ascSignIdx].name}; Saturn H${saturn?.rasiHouseNumber ?? '-'}, Mars H${mars?.rasiHouseNumber ?? '-'}.`,
    pacHi: `तृतीयेश ${grahaHi(l3Id)} (SAV ${h3.savBindus}, मंगल BAV ${marsBav3}); एकादशेश ${grahaHi(l11Id)} (SAV ${h11.savBindus}, मंगल BAV ${marsBav11}); D3 लग्न ${SIGN_HI[d3Lagna?.signIndex ?? ascSignIdx]}।`,
  };
}

// =============================================================================
// UNIVERSAL FULL-VARGA PROGENY (D1 + D7 SAVYA/APASAVYA + D5/D9 + GURU BAV)
// =============================================================================
export interface FullVargaProgenyVerdict {
  countAndGenderEn: string;
  countAndGenderHi: string;
}

export function evaluateFullVargaProgeny(
  ctx: ClassicalSynthesisContext,
  ascSignIdx: number,
  obstructionScore: number,
  timingStrEn: string,
  timingStrHi: string
): FullVargaProgenyVerdict {
  const h5 = ctx.bhavaByHouse.get(5)!;
  const h7 = ctx.bhavaByHouse.get(7)!;
  const h9 = ctx.bhavaByHouse.get(9)!;
  const jupiter = ctx.planetsById.get('Jupiter');
  const d7LagnaIdx = ctx.getVargaPlacement('D7', 'Asc')?.signIndex ?? ascSignIdx;

  // BPHS D7 Savya (Odd D1 Lagna = forward) / Apasavya (Even D1 Lagna = backward)
  const isOddD1Lagna = ascSignIdx % 2 === 0; // Aries=0 (odd 1st sign)
  const d7ChildHouse = (slotOffset: number) => {
    const raw = isOddD1Lagna ? (5 + slotOffset) : (9 - slotOffset);
    return ((raw - 1 + 12) % 12) + 1;
  };

  const maleGrahas = new Set(['Sun', 'Mars', 'Jupiter']);
  const femaleGrahas = new Set(['Moon', 'Venus', 'Rahu']);
  const slotPolarity = (d1BhavaIdx: number, d7HouseNum: number): { labelEn: string; labelHi: string } => {
    const d1Sign = ctx.bhavaByHouse.get(d1BhavaIdx)!.signIndex;
    const d7Sign = (d7LagnaIdx + d7HouseNum - 1) % 12;
    const d7LordId = SIGNS[d7Sign].lord;
    const d7Occ = ctx.getVargaOccupants('D7', d7HouseNum);
    const d1Odd = d1Sign % 2 === 0;
    const d7Odd = d7Sign % 2 === 0;

    let maleScore = (d1Odd ? 1.2 : 0) + (d7Odd ? 1.5 : 0);
    let femScore = (!d1Odd ? 1.2 : 0) + (!d7Odd ? 1.5 : 0);

    if (maleGrahas.has(d7LordId)) maleScore += 1.2;
    else if (femaleGrahas.has(d7LordId)) femScore += 1.2;
    for (const p of d7Occ) {
      if (maleGrahas.has(p.id)) maleScore += 1.1;
      else if (femaleGrahas.has(p.id)) femScore += 1.1;
    }

    const total = maleScore + femScore || 1;
    const malePct = Math.round((maleScore / total) * 100);
    const femPct = 100 - malePct;
    if (malePct >= 30 && malePct <= 70) {
      return d1Odd === d7Odd
        ? {
            labelEn: `${maleScore >= femScore ? 'Son' : 'Daughter'} tendency (${Math.max(malePct, femPct)}%) OR / अथवा ${maleScore >= femScore ? 'Daughter' : 'Son'} (${Math.min(malePct, femPct)}%) [D1/D7 mixed]`,
            labelHi: `${maleScore >= femScore ? 'पुत्र' : 'पुत्री'} प्रमुख संभावना (${Math.max(malePct, femPct)}%) अथवा ${maleScore >= femScore ? 'पुत्री' : 'पुत्र'} (${Math.min(malePct, femPct)}%)`,
          }
        : {
            labelEn: `${d7Odd ? 'Son' : 'Daughter'} per D7 Savya/Apasavya (${d7Odd ? malePct : femPct}%) OR / अथवा ${d1Odd ? 'Son' : 'Daughter'} per D1 parity (${d1Odd ? malePct : femPct}%)`,
            labelHi: `D7 सव्य/अपसव्य अनुसार ${d7Odd ? 'पुत्र' : 'पुत्री'} (${d7Odd ? malePct : femPct}%) अथवा D1 अनुसार ${d1Odd ? 'पुत्र' : 'पुत्री'} (${d1Odd ? malePct : femPct}%)`,
          };
    }
    return maleScore > femScore
      ? {
          labelEn: `Son tendency (${malePct}% D1+D7+Lord alignment)`,
          labelHi: `पुत्र संतति प्रमुख संभावना (${malePct}% D1+D7+भावेश समन्वय)`,
        }
      : {
          labelEn: `Daughter tendency (${femPct}% D1+D7+Lord alignment)`,
          labelHi: `पुत्री संतति प्रमुख संभावना (${femPct}% D1+D7+भावेश समन्वय)`,
        };
  };

  const c1 = slotPolarity(5, d7ChildHouse(0));
  const c2 = slotPolarity(7, d7ChildHouse(2));
  const c3 = slotPolarity(9, d7ChildHouse(4));

  const jupBav5 = jupiter
    ? ctx.getBavBindus('Jupiter', ((jupiter.signIndex + 4 - ascSignIdx + 12) % 12) + 1)
    : 4;
  const fertScore =
    (h5.savBindus >= 31 ? 2 : h5.savBindus >= 26 ? 1 : 0) +
    (jupBav5 >= 5 ? 1.5 : jupBav5 >= 4 ? 1 : 0) +
    (h9.savBindus >= 28 ? 0.5 : 0) -
    obstructionScore * 0.65;

  let countEn = '';
  let countHi = '';
  if (obstructionScore >= 5 || fertScore < 0.2) {
    countEn = `Tested / Delayed Progeny — delayed timing (0–1 child naturally OR / अथवा 1–2 children via Medical/ART: ${timingStrEn})`;
    countHi = `परीक्षापूर्ण / संतान विलंब योग (०–१ प्राकृतिक अथवा चिकित्सकीय/उचित समय पर १–२ संतान: ${timingStrHi})`;
  } else if (obstructionScore >= 3 || fertScore < 1.4) {
    countEn = `1 child with delayed timing OR / अथवा 2 children with conscious spacing (${timingStrEn})`;
    countHi = `१ संतान — संतान विलंब योग अथवा उचित अंतराल से २ संतान (${timingStrHi})`;
  } else if (fertScore >= 3.2 && h7.savBindus >= 27) {
    countEn = `2–3 children (Abundant Putra-D7 & Guru-BAV fertility) OR / अथवा 2 well-spaced modern lineage`;
    countHi = `२ से ३ संतानों का उर्वर योग (प्रबल D7 व गुरु BAV) अथवा आधुनिक परिवार रूप में २ संतान`;
  } else {
    countEn = `1–2 children (Healthy natural Putrabhava, H5 SAV ${h5.savBindus}, Guru BAV ${jupBav5})`;
    countHi = `१ से २ संतानों का शुभ योग (पंचम SAV ${h5.savBindus}, गुरु BAV ${jupBav5})`;
  }

  return {
    countAndGenderEn: `${countEn} — 1st: ${c1.labelEn}; 2nd: ${c2.labelEn}; 3rd (if applicable): ${c3.labelEn}`,
    countAndGenderHi: `${countHi} — प्रथम: ${c1.labelHi}; द्वितीय: ${c2.labelHi}; तृतीय (योग होने पर): ${c3.labelHi}`,
  };
}
