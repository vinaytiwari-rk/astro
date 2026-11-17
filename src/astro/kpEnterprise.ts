/**
 * KP Enterprise Depth Engine
 * Extends the base KP engine with:
 *  - 4-Fold Significators Table (all 12 houses, with cusp-corrected levels)
 *  - Cuspal Sub-Lord Signification Grid with classical KP prediction rules
 *  - Live Ruling Planets computed at current time (Date.now())
 */

import * as Astronomy from 'astronomy-engine';
import { NAKSHATRAS, NINE_GRAHAS, SIGNS, VARA_INFO, VIMSHOTTARI_ORDER, VIMSHOTTARI_YEARS } from './constants';
import { computeAyanamsaDeg } from './ephemeris';
import { computeAscendantAndMcTropical } from './ephemeris';
import { normalizeDeg, formatDms, formatLocalDateTimeFromUtc } from './time';
import type { ChartData, NineGrahaId, SevenPlanetId } from './types';
import { computeKpSubLord } from './vargas';

// ─────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────

export interface KpFourFoldHouse {
  house: number;
  /** Level A: Planets whose Nakshatra lord OCCUPIES this house */
  lordA: NineGrahaId[];
  /** Level B: Planets ACTUALLY placed in this house */
  lordB: NineGrahaId[];
  /** Level C: Planets whose Nakshatra lord RULES (owns) this house */
  lordC: NineGrahaId[];
  /** Level D: The house lord itself */
  lordD: NineGrahaId[];
  /** De-duped union of A..D in priority order */
  allSignificators: NineGrahaId[];
}

export interface KpCuspalSubLordSignification {
  house: number;
  /** The Cuspal Sub-Lord of this house cusp */
  csl: NineGrahaId;
  /** All houses signified by the CSL via 4-fold method */
  cslSignificates: number[];
  /** Classical KP prediction verdicts for this cusp */
  predictions: string[];
}

export interface KpLiveRulingPlanets {
  timestampUtc: string;
  timestampLocal: string;
  dayLord: SevenPlanetId;
  horaLord: SevenPlanetId;
  lagnaLord: SevenPlanetId;
  lagnaStarLord: NineGrahaId;
  moonSignLord: SevenPlanetId;
  moonStarLord: NineGrahaId;
  /** Planets common to multiple RP categories (strongest significators) */
  commonPlanets: NineGrahaId[];
}

export interface KPEnterpriseReport {
  /** 4-Fold table for all 12 houses */
  fourFoldSignificators: KpFourFoldHouse[];
  /** Cuspal Sub-Lord grid with classical predictions */
  cuspalSubLordGrid: KpCuspalSubLordSignification[];
  /** Live Ruling Planets at current moment (Date.now()) */
  liveRulingPlanets: KpLiveRulingPlanets;
}

// ─────────────────────────────────────────────────────────────────
// Internal helpers
// ─────────────────────────────────────────────────────────────────

function computePlacidusCuspsTropical(
  time: Astronomy.AstroTime,
  latitude: number,
  longitude: number
): number[] {
  const eps = Astronomy.e_tilt(time).tobl * Astronomy.DEG2RAD;
  const gmst = Astronomy.SiderealTime(time);
  const ramc = normalizeDeg(gmst * 15 + longitude);
  const safeLat = Math.max(-65, Math.min(65, latitude));
  const phi = safeLat * Astronomy.DEG2RAD;

  const raToLon = (raDeg: number) => {
    const r = raDeg * Astronomy.DEG2RAD;
    return normalizeDeg(Math.atan2(Math.sin(r), Math.cos(r) * Math.cos(eps)) * Astronomy.RAD2DEG);
  };

  const placidus = (offset: number, factor: number) => {
    let x = ramc + offset;
    for (let i = 0; i < 20; i++) {
      const lam = raToLon(x) * Astronomy.DEG2RAD;
      const dec = Math.asin(Math.sin(eps) * Math.sin(lam));
      const sinAd = Math.max(-0.999, Math.min(0.999, Math.tan(phi) * Math.tan(dec)));
      const ad = Math.asin(sinAd) * Astronomy.RAD2DEG;
      x = ramc + offset + factor * ad;
    }
    return raToLon(x);
  };

  const c10 = raToLon(ramc);
  const c11 = placidus(30, 1 / 3);
  const c12 = placidus(60, 2 / 3);
  const c1 = placidus(90, 1);
  const c2 = placidus(120, 2 / 3);
  const c3 = placidus(150, 1 / 3);

  return [
    c1, c2, c3,
    normalizeDeg(c10 + 180), normalizeDeg(c11 + 180), normalizeDeg(c12 + 180),
    normalizeDeg(c1 + 180), normalizeDeg(c2 + 180), normalizeDeg(c3 + 180),
    c10, c11, c12,
  ];
}

function findKpHouseFromCusps(lonSid: number, cuspsSid: number[]): number {
  const lon = normalizeDeg(lonSid);
  for (let i = 0; i < 12; i++) {
    const start = cuspsSid[i];
    const end = cuspsSid[(i + 1) % 12];
    const span = normalizeDeg(end - start);
    const offset = normalizeDeg(lon - start);
    if (offset < span) return i + 1;
  }
  return 1;
}

/** Hora lord: 7-planet sequence, hour 0 = day lord */
const HORA_ORDER: SevenPlanetId[] = ['Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars'];

function computeHoraLord(utcMs: number, offsetMinutes: number, dayLord: SevenPlanetId): SevenPlanetId {
  const localMs = utcMs + offsetMinutes * 60_000;
  const localDate = new Date(localMs);
  // Hora changes every 60 minutes; hour 0 starts at midnight.
  const hourOfDay = localDate.getUTCHours();
  const dayLordIdx = HORA_ORDER.indexOf(dayLord);
  if (dayLordIdx === -1) return dayLord;
  const horaIdx = (dayLordIdx + hourOfDay) % 7;
  return HORA_ORDER[horaIdx];
}

// ─────────────────────────────────────────────────────────────────
// 4-Fold Significators helper using pre-built maps
// ─────────────────────────────────────────────────────────────────

function buildFourFoldSignificators(
  cuspsSid: number[],
  planetLons: Map<NineGrahaId, number>,
  kpAyan: number,
  chart: ChartData
): KpFourFoldHouse[] {
  // Determine KP house for each planet
  const planetHouseKP = new Map<NineGrahaId, number>();
  const planetStarLord = new Map<NineGrahaId, NineGrahaId>();
  for (const g of NINE_GRAHAS) {
    const lon = planetLons.get(g)!;
    planetHouseKP.set(g, findKpHouseFromCusps(lon, cuspsSid));
    const nakIdx = Math.floor(normalizeDeg(lon) / (360 / 27)) % 27;
    planetStarLord.set(g, NAKSHATRAS[nakIdx].lord);
  }

  // Houses ruled (owned) by each planet via cusp sign lords
  const housesOwned = new Map<NineGrahaId, number[]>();
  for (const g of NINE_GRAHAS) housesOwned.set(g, []);
  for (let i = 0; i < 12; i++) {
    const lon = cuspsSid[i];
    const signIdx = Math.floor(normalizeDeg(lon) / 30) % 12;
    const owner: NineGrahaId = SIGNS[signIdx].lord;
    housesOwned.get(owner)!.push(i + 1);
  }

  // Build 4-fold for each house
  return Array.from({ length: 12 }, (_, i) => {
    const house = i + 1;
    const cuspLon = cuspsSid[i];
    const cuspSignIdx = Math.floor(normalizeDeg(cuspLon) / 30) % 12;
    const owner: NineGrahaId = SIGNS[cuspSignIdx].lord;

    // Level B: Occupants (planets in this house by KP Placidus house)
    const levelB = NINE_GRAHAS.filter((g) => planetHouseKP.get(g) === house);

    // Level A: Planets whose Nakshatra lord occupies this house (is in levelB)
    const levelA = NINE_GRAHAS.filter((g) => levelB.includes(planetStarLord.get(g)!));

    // Level C: Planets whose Nakshatra lord rules (owns) this house
    const levelC = NINE_GRAHAS.filter((g) => housesOwned.get(planetStarLord.get(g)!)!.includes(house));

    // Level D: The house lord itself
    const levelD: NineGrahaId[] = [owner];

    const allSignificators = Array.from(new Set([...levelA, ...levelB, ...levelC, ...levelD]));

    return { house, lordA: levelA, lordB: levelB, lordC: levelC, lordD: levelD, allSignificators };
  });
}

// ─────────────────────────────────────────────────────────────────
// Cuspal Sub-Lord Signification Grid
// ─────────────────────────────────────────────────────────────────

function computeCuspalSubLordGrid(
  cuspsSid: number[],
  fourFold: KpFourFoldHouse[]
): KpCuspalSubLordSignification[] {
  // Build a lookup: for each planet, which houses does it signify?
  const planetSignificatesHouses = new Map<NineGrahaId, Set<number>>();
  for (const g of NINE_GRAHAS) planetSignificatesHouses.set(g, new Set());
  for (const hf of fourFold) {
    for (const g of hf.allSignificators) {
      planetSignificatesHouses.get(g)!.add(hf.house);
    }
  }

  return cuspsSid.map((cuspLon, idx) => {
    const house = idx + 1;
    const csl = computeKpSubLord(normalizeDeg(cuspLon));
    const cslSignificates = Array.from(planetSignificatesHouses.get(csl) ?? []).sort((a, b) => a - b);

    const predictions: string[] = [];

    if (house === 7) {
      const hasMarriage = [2, 7, 11].every((h) => cslSignificates.includes(h));
      const hasDenial = [1, 6, 10].some((h) => cslSignificates.includes(h)) &&
        ![2, 7, 11].every((h) => cslSignificates.includes(h));
      if (hasMarriage) predictions.push('Marriage Promised');
      if (hasDenial) predictions.push('Denial of Marriage');
    }

    if (house === 2) {
      const hasFin = [2, 6, 10].filter((h) => cslSignificates.includes(h)).length >= 2;
      if (hasFin) predictions.push('Financial Gain Promised');
    }

    if (house === 11) {
      if (cslSignificates.includes(11)) predictions.push('Fulfillment Promised');
    }

    if (house === 6) {
      const hasDisease = [6, 8, 12].filter((h) => cslSignificates.includes(h)).length >= 2;
      if (hasDisease) predictions.push('Disease/Litigation Active');
    }

    if (house === 1) {
      if (cslSignificates.includes(1) && cslSignificates.includes(10)) {
        predictions.push('Strong Health & Career Period');
      }
    }

    if (house === 5) {
      const hasChild = [2, 5, 11].filter((h) => cslSignificates.includes(h)).length >= 2;
      if (hasChild) predictions.push('Progeny Promised');
    }

    if (house === 9) {
      const hasLuck = [3, 9, 12].filter((h) => cslSignificates.includes(h)).length >= 2;
      if (hasLuck) predictions.push('Foreign Travel / Higher Education');
    }

    if (house === 10) {
      const hasCareer = [2, 6, 10, 11].filter((h) => cslSignificates.includes(h)).length >= 3;
      if (hasCareer) predictions.push('Career Success Promised');
    }

    if (predictions.length === 0) {
      predictions.push(`${csl} signifies houses [${cslSignificates.join(', ')}]`);
    }

    return { house, csl, cslSignificates, predictions };
  });
}

// ─────────────────────────────────────────────────────────────────
// Live Ruling Planets
// ─────────────────────────────────────────────────────────────────

function computeLiveRulingPlanets(
  chart: ChartData,
  nowMs: number
): KpLiveRulingPlanets {
  const time = new Astronomy.AstroTime(new Date(nowMs));
  const kpAyan = computeAyanamsaDeg(time, 'kp');

  // Lagna (ascendant) at current moment
  const { asc } = computeAscendantAndMcTropical(time, chart.input.latitude, chart.input.longitude);
  const ascKp = normalizeDeg(asc - kpAyan);
  const ascSignIdx = Math.floor(ascKp / 30) % 12;
  const ascNakIdx = Math.floor(ascKp / (360 / 27)) % 27;
  const lagnaLord: SevenPlanetId = SIGNS[ascSignIdx].lord;
  const lagnaStarLord: NineGrahaId = NAKSHATRAS[ascNakIdx].lord;

  // Moon at current moment
  const moonTrop = Astronomy.EclipticGeoMoon(time).lon;
  const moonKp = normalizeDeg(moonTrop - kpAyan);
  const moonSignIdx = Math.floor(moonKp / 30) % 12;
  const moonNakIdx = Math.floor(moonKp / (360 / 27)) % 27;
  const moonSignLord: SevenPlanetId = SIGNS[moonSignIdx].lord;
  const moonStarLord: NineGrahaId = NAKSHATRAS[moonNakIdx].lord;

  // Day lord
  const localDay = new Date(nowMs + chart.offsetMinutesUsed * 60_000).getUTCDay();
  const dayLord: SevenPlanetId = VARA_INFO[localDay].lord;

  // Hora lord
  const horaLord: SevenPlanetId = computeHoraLord(nowMs, chart.offsetMinutesUsed, dayLord);

  // Common planets: appear in multiple RP roles
  const allRPs: NineGrahaId[] = [dayLord, horaLord, lagnaLord, lagnaStarLord, moonSignLord, moonStarLord];
  const freq = new Map<NineGrahaId, number>();
  for (const p of allRPs) freq.set(p, (freq.get(p) ?? 0) + 1);
  const commonPlanets = Array.from(freq.entries())
    .filter(([, c]) => c >= 2)
    .map(([p]) => p);

  const timestampUtc = new Date(nowMs).toISOString();
  const timestampLocal = formatLocalDateTimeFromUtc(nowMs, chart.offsetMinutesUsed);

  return {
    timestampUtc,
    timestampLocal,
    dayLord,
    horaLord,
    lagnaLord,
    lagnaStarLord,
    moonSignLord,
    moonStarLord,
    commonPlanets,
  };
}

// ─────────────────────────────────────────────────────────────────
// Main exported function
// ─────────────────────────────────────────────────────────────────

export function computeKPEnterprise(chart: ChartData): KPEnterpriseReport {
  const time = new Astronomy.AstroTime(new Date(chart.utcMs));
  const kpAyan = computeAyanamsaDeg(time, 'kp');
  const activeAyan = chart.ayanamsaDeg;

  // Build KP Placidus cusps
  const cuspsTrop = computePlacidusCuspsTropical(time, chart.input.latitude, chart.input.longitude);
  const cuspsSid = cuspsTrop.map((c) => normalizeDeg(c - kpAyan));

  // Convert planet longitudes to KP ayanamsa
  const planetLons = new Map<NineGrahaId, number>();
  for (const g of NINE_GRAHAS) {
    const body = chart.planets.find((p) => p.id === g);
    if (!body) continue;
    const kpLon = normalizeDeg(body.longitude + activeAyan - kpAyan);
    planetLons.set(g, kpLon);
  }

  const fourFoldSignificators = buildFourFoldSignificators(cuspsSid, planetLons, kpAyan, chart);
  const cuspalSubLordGrid = computeCuspalSubLordGrid(cuspsSid, fourFoldSignificators);
  const liveRulingPlanets = computeLiveRulingPlanets(chart, Date.now());

  return {
    fourFoldSignificators,
    cuspalSubLordGrid,
    liveRulingPlanets,
  };
}
