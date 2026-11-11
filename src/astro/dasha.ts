import {
  NAKSHATRAS,
  VIMSHOTTARI_ORDER,
  VIMSHOTTARI_YEARS,
  YOGINI_LIST,
} from './constants';
import { normalizeDeg } from './time';
import type { DashaPeriod, DashaYearType } from './types';

const MS_PER_DAY = 86_400_000;

export function getDaysPerYear(yearType: DashaYearType): number {
  switch (yearType) {
    case 'tropical':
      return 365.2425;
    case 'sidereal':
      return 365.256363;
    case 'savana':
      return 360.0;
  }
}

function buildVimshottariChildren(
  parentLordIdx: number,
  parentStartMs: number,
  parentDurationMs: number,
  level: 2 | 3 | 4,
  maxDepth: 2 | 3 | 4
): DashaPeriod[] {
  const children: DashaPeriod[] = [];
  let cursor = parentStartMs;
  for (let i = 0; i < 9; i++) {
    const idx = (parentLordIdx + i) % 9;
    const lord = VIMSHOTTARI_ORDER[idx];
    const spanMs = parentDurationMs * (VIMSHOTTARI_YEARS[lord] / 120);
    const endMs = cursor + spanMs;
    const node: DashaPeriod = {
      lord,
      level,
      startMs: cursor,
      endMs,
      durationDays: spanMs / MS_PER_DAY,
    };
    if (level < maxDepth) {
      node.children = buildVimshottariChildren(
        idx,
        cursor,
        spanMs,
        (level + 1) as 3 | 4,
        maxDepth
      );
    }
    children.push(node);
    cursor = endMs;
  }
  return children;
}

/**
 * Computes full 120-year Vimshottari Mahadasha cycle starting from the Moon's birth Nakshatra,
 * including Antardasha & Pratyantardasha levels (with lazy/on-demand Sookshma expansion helper).
 */
export function computeVimshottariDasha(
  moonSiderealLon: number,
  birthUtcMs: number,
  yearType: DashaYearType
): DashaPeriod[] {
  const daysPerYear = getDaysPerYear(yearType);
  const nakSpan = 360 / 27;
  const lon = normalizeDeg(moonSiderealLon);
  const nakIdx = Math.floor(lon / nakSpan) % 27;
  const elapsedFrac = (lon - nakIdx * nakSpan) / nakSpan;

  const birthLord = NAKSHATRAS[nakIdx].lord;
  const startIdx = VIMSHOTTARI_ORDER.indexOf(birthLord);
  const firstFullMs = VIMSHOTTARI_YEARS[birthLord] * daysPerYear * MS_PER_DAY;
  const theoreticalStartMs = birthUtcMs - elapsedFrac * firstFullMs;

  const mahadashas: DashaPeriod[] = [];
  let cursor = theoreticalStartMs;

  // Generate full 9 Mahadashas (120 years) + extra wrap if needed past 100 yrs from birth
  for (let i = 0; i < 10; i++) {
    const idx = (startIdx + i) % 9;
    const lord = VIMSHOTTARI_ORDER[idx];
    const fullMs = VIMSHOTTARI_YEARS[lord] * daysPerYear * MS_PER_DAY;
    const endMs = cursor + fullMs;

    const md: DashaPeriod = {
      lord,
      level: 1,
      startMs: cursor,
      endMs,
      durationDays: fullMs / MS_PER_DAY,
      children: buildVimshottariChildren(idx, cursor, fullMs, 2, 3),
    };
    mahadashas.push(md);
    cursor = endMs;
  }
  return mahadashas;
}

export function expandSookshmaDasha(pratyantardasha: DashaPeriod): DashaPeriod[] {
  const idx = VIMSHOTTARI_ORDER.indexOf(pratyantardasha.lord as typeof VIMSHOTTARI_ORDER[number]);
  if (idx === -1) return [];
  return buildVimshottariChildren(
    idx,
    pratyantardasha.startMs,
    pratyantardasha.endMs - pratyantardasha.startMs,
    4,
    4
  );
}

/**
 * Computes 36-year Yogini Dasha cycles from Moon's birth Nakshatra.
 * Classical formula: (Nakshatra_number_1_based + 3) % 8 -> 1=Mangala .. 0/8=Sankata.
 */
export function computeYoginiDasha(
  moonSiderealLon: number,
  birthUtcMs: number,
  yearType: DashaYearType
): DashaPeriod[] {
  const daysPerYear = getDaysPerYear(yearType);
  const nakSpan = 360 / 27;
  const lon = normalizeDeg(moonSiderealLon);
  const nakIdx = Math.floor(lon / nakSpan) % 27;
  const elapsedFrac = (lon - nakIdx * nakSpan) / nakSpan;

  const yoginiIdx = (nakIdx + 1 + 3 - 1) % 8; // (nak1 + 3) mod 8 mapped to 0..7
  const firstItem = YOGINI_LIST[yoginiIdx];
  const firstFullMs = firstItem.years * daysPerYear * MS_PER_DAY;
  let cursor = birthUtcMs - elapsedFrac * firstFullMs;

  const periods: DashaPeriod[] = [];
  // 3 full 36-year cycles = 108 years
  for (let i = 0; i < 24; i++) {
    const idx = (yoginiIdx + i) % 8;
    const item = YOGINI_LIST[idx];
    const spanMs = item.years * daysPerYear * MS_PER_DAY;
    const endMs = cursor + spanMs;

    const children: DashaPeriod[] = [];
    let cCursor = cursor;
    for (let j = 0; j < 8; j++) {
      const subIdx = (idx + j) % 8;
      const sub = YOGINI_LIST[subIdx];
      const subSpan = spanMs * (sub.years / 36);
      children.push({
        lord: `${sub.name} (${sub.lord})`,
        level: 2,
        startMs: cCursor,
        endMs: cCursor + subSpan,
        durationDays: subSpan / MS_PER_DAY,
      });
      cCursor += subSpan;
    }

    periods.push({
      lord: `${item.name} (${item.lord})`,
      level: 1,
      startMs: cursor,
      endMs,
      durationDays: spanMs / MS_PER_DAY,
      children,
    });
    cursor = endMs;
  }

  return periods;
}

export function findActiveDashaPath(periods: DashaPeriod[], targetMs: number): DashaPeriod[] {
  const path: DashaPeriod[] = [];
  let list: DashaPeriod[] | undefined = periods;
  while (list && list.length > 0) {
    const match: DashaPeriod | undefined = list.find(
      (p) => targetMs >= p.startMs && targetMs < p.endMs
    );
    if (!match) break;
    path.push(match);
    list = match.children;
  }
  return path;
}
