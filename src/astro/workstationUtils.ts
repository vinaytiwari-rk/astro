import * as Astronomy from 'astronomy-engine';
import { calculateChart } from './calculator';
import { CELEBRITY_DATABASE } from './celebrityTwins';
import { NAKSHATRAS, SIGNS, TITHI_NAMES, VARA_INFO } from './constants';
import { computeAyanamsaDeg, getTropicalPosition, getTropicalSpeedDegPerDay } from './ephemeris';
import { angularDiffDeg, formatDateDmy, formatLocalTimeFromUtc, normalizeDeg, resolveUtcFromBirth } from './time';
import type { BirthInput, CalcSettings, ChartData, NineGrahaId } from './types';
import { RESEARCH_BENCHMARK_CHARTS } from '../data/researchCharts';

export interface EphemerisPlanetCell {
  id: NineGrahaId;
  signIndex: number;
  signShort: string;
  degInSign: number;
  dmsShort: string;
  isRetrograde: boolean;
}

export interface MonthlyEphemerisRow {
  dateIso: string; // YYYY-MM-DD
  dateDmy: string; // DD-MM-YYYY
  varaShort: string;
  tithiName: string;
  paksha: 'Shukla' | 'Krishna';
  nakshatraName: string;
  planets: Record<NineGrahaId, EphemerisPlanetCell>;
}

const SHORT_SIGN_EN = ['Ari', 'Tau', 'Gem', 'Can', 'Leo', 'Vir', 'Lib', 'Sco', 'Sag', 'Cap', 'Aqu', 'Pis'];
const NINE_LIST: NineGrahaId[] = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

/**
 * Shifts a BirthInput forward or backward by `deltaSeconds`, handling midnight,
 * month, and year rollovers accurately via UTC resolution.
 */
export function shiftBirthInputTime(input: BirthInput, deltaSeconds: number): BirthInput {
  if (!deltaSeconds) return input;
  const { utcMs, offsetMinutes } = resolveUtcFromBirth(
    input.date,
    input.time,
    input.timezone,
    input.utcOffsetMinutes
  );
  const shiftedUtc = utcMs + deltaSeconds * 1000;
  const local = new Date(shiftedUtc + offsetMinutes * 60_000);
  const yyyy = local.getUTCFullYear();
  const mm = String(local.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(local.getUTCDate()).padStart(2, '0');
  const time = formatLocalTimeFromUtc(shiftedUtc, offsetMinutes, true);
  return {
    ...input,
    date: `${yyyy}-${mm}-${dd}`,
    time,
  };
}

/**
 * Computes a Parashara-style Ephemeris table (sidereal planetary positions + daily
 * Panchanga Tithi/Nakshatra/Vara at the chosen reference clock time, default 05:30).
 */
export function computeMonthlyEphemerisRows(params: {
  startDateIso: string;
  daysCount: number;
  referenceTime?: string;
  timezone: string;
  utcOffsetMinutes?: number;
  settings: CalcSettings;
}): MonthlyEphemerisRow[] {
  const {
    startDateIso,
    daysCount,
    referenceTime = '05:30:00',
    timezone,
    utcOffsetMinutes,
    settings,
  } = params;

  const base = resolveUtcFromBirth(startDateIso, referenceTime, timezone, utcOffsetMinutes);
  const rows: MonthlyEphemerisRow[] = [];
  const safeDays = Math.max(1, Math.min(62, daysCount));

  for (let i = 0; i < safeDays; i++) {
    const dayUtc = base.utcMs + i * 86_400_000;
    const local = new Date(dayUtc + base.offsetMinutes * 60_000);
    const yyyy = local.getUTCFullYear();
    const mm = String(local.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(local.getUTCDate()).padStart(2, '0');
    const dateIso = `${yyyy}-${mm}-${dd}`;
    const dateDmy = `${dd}-${mm}-${yyyy}`;

    const time = new Astronomy.AstroTime(new Date(dayUtc));
    const ayan = computeAyanamsaDeg(time, settings.ayanamsa);

    const planets = {} as Record<NineGrahaId, EphemerisPlanetCell>;
    for (const id of NINE_LIST) {
      const pos = getTropicalPosition(id, time, settings.nodeMode, null);
      const sid = normalizeDeg(pos.lon - ayan);
      const speed = getTropicalSpeedDegPerDay(id, time, settings.nodeMode, null);
      const signIndex = Math.floor(sid / 30) % 12;
      const degInSign = sid - signIndex * 30;
      const deg = Math.floor(degInSign);
      const min = Math.floor((degInSign - deg) * 60);
      planets[id] = {
        id,
        signIndex,
        signShort: SHORT_SIGN_EN[signIndex],
        degInSign,
        dmsShort: `${String(deg).padStart(2, '0')}°${String(min).padStart(2, '0')}'`,
        isRetrograde: id !== 'Sun' && id !== 'Moon' && id !== 'Rahu' && id !== 'Ketu' && speed < 0,
      };
    }

    const sunSid = planets.Sun.signIndex * 30 + planets.Sun.degInSign;
    const moonSid = planets.Moon.signIndex * 30 + planets.Moon.degInSign;
    const diff = normalizeDeg(moonSid - sunSid);
    const tithiNum = (Math.floor(diff / 12) % 30) + 1;
    const paksha: 'Shukla' | 'Krishna' = tithiNum <= 15 ? 'Shukla' : 'Krishna';
    const tithiName = TITHI_NAMES[(tithiNum - 1) % 30] ?? `Tithi ${tithiNum}`;
    const nakIdx = Math.floor(moonSid / (360 / 27)) % 27;
    const varaIdx = local.getUTCDay();
    const varaShort = VARA_INFO[varaIdx]?.name?.slice(0, 3) ?? 'Sun';

    rows.push({
      dateIso,
      dateDmy,
      varaShort,
      tithiName,
      paksha,
      nakshatraName: NAKSHATRAS[nakIdx]?.name ?? '',
      planets,
    });
  }

  return rows;
}

export interface ChartSearchCriteria {
  queryText?: string;
  sourceFilter?: 'all' | 'user' | 'benchmark' | 'celebrity';
  categoryFilter?: string;
  lagnaSignIndex?: number | 'any';
  moonSignIndex?: number | 'any';
  sunSignIndex?: number | 'any';
  exaltedPlanet?: NineGrahaId | 'any';
  debilitatedPlanet?: NineGrahaId | 'any';
  retrogradePlanet?: NineGrahaId | 'any';
  yogaKeyword?: string;
  limit?: number;
}

export interface ChartSearchMatch {
  id: string;
  name: string;
  sourceType: 'user' | 'benchmark' | 'celebrity';
  subtitle: string;
  lagnaSign: string;
  moonSign: string;
  matchedYogas: string[];
  birthInput?: BirthInput;
  chart?: ChartData;
}

const CHART_CACHE = new Map<string, ChartData>();

function getCachedChart(input: BirthInput, settings: CalcSettings): ChartData {
  const key = `${input.id}|${settings.ayanamsa}|${settings.nodeMode}|${settings.houseSystem}`;
  let cached = CHART_CACHE.get(key);
  if (!cached) {
    cached = calculateChart(input, settings);
    if (CHART_CACHE.size > 2000) CHART_CACHE.clear();
    CHART_CACHE.set(key, cached);
  }
  return cached;
}

/**
 * Unified Research & Yoga Finder across User Saved Charts,
 * Research Benchmark Charts, and Celebrity Databank (Twin Match Making).
 */
export function searchWorkstationCharts(
  criteria: ChartSearchCriteria,
  userProfiles: BirthInput[],
  settings: CalcSettings
): ChartSearchMatch[] {
  const results: ChartSearchMatch[] = [];
  const q = (criteria.queryText ?? '').trim().toLowerCase();
  const yq = (criteria.yogaKeyword ?? '').trim().toLowerCase();
  const cat = (criteria.categoryFilter ?? '').trim().toLowerCase();
  const src = criteria.sourceFilter ?? 'all';
  const maxLimit = criteria.limit ?? 80;

  const hasAstroFilter =
    (criteria.lagnaSignIndex !== undefined && criteria.lagnaSignIndex !== 'any') ||
    (criteria.moonSignIndex !== undefined && criteria.moonSignIndex !== 'any') ||
    (criteria.sunSignIndex !== undefined && criteria.sunSignIndex !== 'any') ||
    (criteria.exaltedPlanet && criteria.exaltedPlanet !== 'any') ||
    (criteria.debilitatedPlanet && criteria.debilitatedPlanet !== 'any') ||
    (criteria.retrogradePlanet && criteria.retrogradePlanet !== 'any') ||
    Boolean(yq);

  const candidateInputs: Array<{
    input: BirthInput;
    sourceType: 'user' | 'benchmark';
    subtitle: string;
    category: string;
  }> = [];

  if (src === 'all' || src === 'user') {
    for (const input of userProfiles) {
      candidateInputs.push({
        input,
        sourceType: 'user',
        subtitle: `${input.date} · ${input.city}`,
        category: 'User Charts',
      });
    }
  }
  if (src === 'all' || src === 'benchmark') {
    for (const rc of RESEARCH_BENCHMARK_CHARTS) {
      candidateInputs.push({
        input: rc.birthInput,
        sourceType: 'benchmark',
        subtitle: `${rc.category} · ${rc.birthInput.city}`,
        category: rc.category,
      });
    }
  }

  const seenIds = new Set<string>();
  const maxComputeBudget = hasAstroFilter ? 450 : 120;
  let computedCount = 0;

  for (const item of candidateInputs) {
    if (results.length >= maxLimit || computedCount >= maxComputeBudget) break;
    if (seenIds.has(item.input.id)) continue;
    seenIds.add(item.input.id);

    if (cat && cat !== 'all' && !item.category.toLowerCase().includes(cat)) {
      continue;
    }
    if (q && !`${item.input.name} ${item.input.city} ${item.subtitle}`.toLowerCase().includes(q)) {
      continue;
    }

    computedCount++;
    const ch = getCachedChart(item.input, settings);
    const ascSign = ch.ascendant.signIndex;
    const moon = ch.planets.find((p) => p.id === 'Moon');
    const sun = ch.planets.find((p) => p.id === 'Sun');

    if (criteria.lagnaSignIndex !== undefined && criteria.lagnaSignIndex !== 'any' && ascSign !== criteria.lagnaSignIndex) {
      continue;
    }
    if (criteria.moonSignIndex !== undefined && criteria.moonSignIndex !== 'any' && moon?.signIndex !== criteria.moonSignIndex) {
      continue;
    }
    if (criteria.sunSignIndex !== undefined && criteria.sunSignIndex !== 'any' && sun?.signIndex !== criteria.sunSignIndex) {
      continue;
    }
    if (criteria.exaltedPlanet && criteria.exaltedPlanet !== 'any') {
      const pl = ch.planets.find((p) => p.id === criteria.exaltedPlanet);
      if (!pl || pl.dignity !== 'Exalted') continue;
    }
    if (criteria.debilitatedPlanet && criteria.debilitatedPlanet !== 'any') {
      const pl = ch.planets.find((p) => p.id === criteria.debilitatedPlanet);
      if (!pl || pl.dignity !== 'Debilitated') continue;
    }
    if (criteria.retrogradePlanet && criteria.retrogradePlanet !== 'any') {
      const pl = ch.planets.find((p) => p.id === criteria.retrogradePlanet);
      if (!pl || !pl.isRetrograde) continue;
    }
    if (yq) {
      const hasYoga = ch.yogas.some(
        (y) => y.name.toLowerCase().includes(yq) || y.description.toLowerCase().includes(yq)
      );
      if (!hasYoga) continue;
    }

    results.push({
      id: item.input.id,
      name: item.input.name,
      sourceType: item.sourceType,
      subtitle: item.subtitle,
      lagnaSign: SIGNS[ascSign]?.name ?? '',
      moonSign: moon ? SIGNS[moon.signIndex]?.name ?? '' : '',
      matchedYogas: ch.yogas.slice(0, 6).map((y) => y.name),
      birthInput: item.input,
      chart: ch,
    });
  }

  // Also include Celebrity Astro-Databank metadata matches when astro filters allow
  if (
    (src === 'all' || src === 'celebrity') &&
    (!criteria.exaltedPlanet || criteria.exaltedPlanet === 'any') &&
    (!criteria.debilitatedPlanet || criteria.debilitatedPlanet === 'any') &&
    (!criteria.retrogradePlanet || criteria.retrogradePlanet === 'any')
  ) {
    for (const celeb of CELEBRITY_DATABASE) {
      if (results.length >= maxLimit) break;
      if (q && !`${celeb.nameEn} ${celeb.birthPlace} ${celeb.categoryTitleEn}`.toLowerCase().includes(q)) {
        continue;
      }
      if (criteria.lagnaSignIndex !== undefined && criteria.lagnaSignIndex !== 'any' && celeb.ascSignIndex !== criteria.lagnaSignIndex) {
        continue;
      }
      if (criteria.moonSignIndex !== undefined && criteria.moonSignIndex !== 'any' && celeb.moonSignIndex !== criteria.moonSignIndex) {
        continue;
      }
      if (criteria.sunSignIndex !== undefined && criteria.sunSignIndex !== 'any' && celeb.sunSignIndex !== criteria.sunSignIndex) {
        continue;
      }
      if (yq && !celeb.prominentYogas.some((y) => y.toLowerCase().includes(yq))) {
        continue;
      }
      results.push({
        id: celeb.id,
        name: celeb.nameEn,
        sourceType: 'celebrity',
        subtitle: `Rodden ${celeb.roddenRating} · ${celeb.birthDate} · ${celeb.birthPlace}`,
        lagnaSign: SIGNS[celeb.ascSignIndex]?.name ?? '',
        moonSign: SIGNS[celeb.moonSignIndex]?.name ?? '',
        matchedYogas: celeb.prominentYogas.slice(0, 5),
      });
    }
  }

  return results;
}

export interface TransitSearchEvent {
  dateIso: string;
  dateDmy: string;
  eventType: 'Sign Ingress' | 'Natal Conjunction';
  transitPlanet: NineGrahaId;
  detail: string;
  signName: string;
}

/**
 * Computes upcoming Sign Ingresses & exact Natal-Planet Conjunctions starting from `startDateIso`
 * over `horizonDays` (default 365 days), matching Time-of-Transits lookup.
 */
export function computeTimeOfTransits(params: {
  natalChart: ChartData;
  startDateIso: string;
  horizonDays?: number;
  planetFilter?: NineGrahaId | 'ALL';
}): TransitSearchEvent[] {
  const { natalChart, startDateIso, horizonDays = 365, planetFilter = 'ALL' } = params;
  const { settings } = natalChart;
  const startUtc = resolveUtcFromBirth(startDateIso, '06:00:00', natalChart.input.timezone, natalChart.input.utcOffsetMinutes).utcMs;
  const targetPlanets: NineGrahaId[] =
    planetFilter === 'ALL'
      ? ['Sun', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu']
      : [planetFilter];

  const natalLons = new Map<NineGrahaId, number>();
  for (const np of natalChart.planets) {
    if (NINE_LIST.includes(np.id as NineGrahaId)) {
      natalLons.set(np.id as NineGrahaId, np.longitude);
    }
  }

  const events: TransitSearchEvent[] = [];
  const stepDays = planetFilter === 'Moon' ? 1 : 2;
  const prevSid = new Map<NineGrahaId, number>();

  for (let d = 0; d <= horizonDays; d += stepDays) {
    const tMs = startUtc + d * 86_400_000;
    const astroTime = new Astronomy.AstroTime(new Date(tMs));
    const ayan = computeAyanamsaDeg(astroTime, settings.ayanamsa);
    const localIso = new Date(tMs + natalChart.offsetMinutesUsed * 60_000).toISOString().slice(0, 10);

    for (const p of targetPlanets) {
      const sid = normalizeDeg(getTropicalPosition(p, astroTime, settings.nodeMode, null).lon - ayan);
      const prev = prevSid.get(p);
      if (prev !== undefined) {
        const sPrev = Math.floor(prev / 30) % 12;
        const sCurr = Math.floor(sid / 30) % 12;
        if (sPrev !== sCurr) {
          events.push({
            dateIso: localIso,
            dateDmy: formatDateDmy(localIso),
            eventType: 'Sign Ingress',
            transitPlanet: p,
            detail: `${p} enters ${SIGNS[sCurr].name}`,
            signName: SIGNS[sCurr].name,
          });
        }
        // Check exact natal planet conjunction crossing (within 1.5° step window)
        for (const [nId, nLon] of natalLons.entries()) {
          if (angularDiffDeg(sid, nLon) <= 1.15 && angularDiffDeg(prev, nLon) > 1.15) {
            events.push({
              dateIso: localIso,
              dateDmy: formatDateDmy(localIso),
              eventType: 'Natal Conjunction',
              transitPlanet: p,
              detail: `Transit ${p} conjoins Natal ${nId}`,
              signName: SIGNS[sCurr].name,
            });
          }
        }
      }
      prevSid.set(p, sid);
    }
  }

  return events.slice(0, 90);
}

export interface MonthlyVarshaChartItem {
  monthNumber: number; // 1..12
  dateDmy: string;
  dateTimeLocal: string;
  munthaSignIndex: number;
  munthaSignName: string;
  chart: ChartData;
}

/**
 * Computes all 12 Masa Pravesh (Solar Monthly Return) Tajaka charts for a given Varshaphala year.
 */
export function computeVarshaphala12MonthlyCharts(
  natalChart: ChartData,
  targetYear: number
): MonthlyVarshaChartItem[] {
  const birthYear = parseInt(natalChart.input.date.slice(0, 4), 10) || 2000;
  const completedYears = Math.max(0, targetYear - birthYear);
  const baseSun = natalChart.planets.find((p) => p.id === 'Sun')?.longitude ?? 0;
  const tropicalYearMs = 365.24219 * 86_400_000;
  const annualReturnApprox = natalChart.utcMs + completedYears * tropicalYearMs;

  const yearMunthaBase = (natalChart.ascendant.signIndex + completedYears) % 12;
  const items: MonthlyVarshaChartItem[] = [];

  for (let m = 0; m < 12; m++) {
    const targetSunSid = normalizeDeg(baseSun + m * 30);
    let guess = annualReturnApprox + m * (tropicalYearMs / 12);
    for (let it = 0; it < 10; it++) {
      const t = new Astronomy.AstroTime(new Date(guess));
      const ay = computeAyanamsaDeg(t, natalChart.settings.ayanamsa);
      const cur = normalizeDeg(Astronomy.SunPosition(t).elon - ay);
      let diff = targetSunSid - cur;
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;
      if (Math.abs(diff) < 1e-4) break;
      guess += (diff / 0.985647) * 86_400_000;
    }

    const local = new Date(guess + natalChart.offsetMinutesUsed * 60_000);
    const yyyy = local.getUTCFullYear();
    const mm = String(local.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(local.getUTCDate()).padStart(2, '0');
    const dateIso = `${yyyy}-${mm}-${dd}`;
    const timeStr = formatLocalTimeFromUtc(guess, natalChart.offsetMinutesUsed, true);

    const monthInput: BirthInput = {
      ...natalChart.input,
      id: `${natalChart.input.id}-vm-${targetYear}-${m + 1}`,
      date: dateIso,
      time: timeStr,
      timezone: 'MANUAL',
      utcOffsetMinutes: natalChart.offsetMinutesUsed,
    };
    const chart = calculateChart(monthInput, natalChart.settings);
    const munthaSignIndex = (yearMunthaBase + m) % 12;

    items.push({
      monthNumber: m + 1,
      dateDmy: formatDateDmy(dateIso),
      dateTimeLocal: `${formatDateDmy(dateIso)} ${timeStr.slice(0, 5)}`,
      munthaSignIndex,
      munthaSignName: SIGNS[munthaSignIndex].name,
      chart,
    });
  }

  return items;
}

export interface RashiMutualDistanceRow {
  body: string;
  signA: string;
  signB: string;
  rashiDistance: string; // e.g. 5-9
  nakA: string;
  nakB: string;
  nakDistance: string;
}

/**
 * Computes Planet-to-Planet Rashi and Nakshatra Mutual Distances for Compatibility analysis.
 */
export function computeRashiMutualDistances(
  chartA: ChartData,
  chartB: ChartData
): RashiMutualDistanceRow[] {
  const bodiesA = [chartA.ascendant, ...chartA.planets];
  const bodiesB = [chartB.ascendant, ...chartB.planets];
  const rows: RashiMutualDistanceRow[] = [];

  for (const a of bodiesA) {
    const b = bodiesB.find((x) => x.id === a.id);
    if (!b) continue;
    const d1 = ((b.signIndex - a.signIndex + 12) % 12) + 1;
    const d2 = ((a.signIndex - b.signIndex + 12) % 12) + 1;
    const n1 = ((b.nakshatraIndex - a.nakshatraIndex + 27) % 27) + 1;
    const n2 = ((a.nakshatraIndex - b.nakshatraIndex + 27) % 27) + 1;
    rows.push({
      body: a.id,
      signA: SIGNS[a.signIndex]?.short ?? '',
      signB: SIGNS[b.signIndex]?.short ?? '',
      rashiDistance: `${d1}-${d2}`,
      nakA: `${a.nakshatraName.slice(0, 5)}-${a.pada}`,
      nakB: `${b.nakshatraName.slice(0, 5)}-${b.pada}`,
      nakDistance: `${n1}-${n2}`,
    });
  }

  return rows;
}

