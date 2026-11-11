import * as Astronomy from 'astronomy-engine';
import { calculateChart } from './calculator';
import { SIGNS } from './constants';
import { computeAyanamsaDeg } from './ephemeris';
import { evaluateParamayusStatus } from './predictions/paramayus';
import { angularDiffDeg, formatLocalDateTimeFromUtc, normalizeDeg } from './time';
import type { BirthInput, ChartData } from './types';

export type MuhurtaPurpose =
  | 'marriage'
  | 'griha_pravesh'
  | 'business'
  | 'travel'
  | 'medical'
  | 'education';

export interface MuhurtaCandidate {
  date: string;
  weekday: string;
  tithi: string;
  nakshatra: string;
  yoga: string;
  karana: string;
  taraStatus: string;
  chandraBala: string;
  abhijitWindow: string;
  rahuKalam: string;
  score: number; // 0..100
  verdict: 'Shubha (Highly Auspicious)' | 'Good' | 'Average';
  notes: string[];
}

export interface TransitIngressEvent {
  planet: 'Jupiter' | 'Saturn';
  date: string;
  fromSign: string;
  toSign: string;
  houseFromMoon: number;
  houseFromLagna: number;
  note: string;
}

export interface SadeSatiWindow {
  phase: string;
  startDate: string;
  endDate: string;
  note: string;
}

export interface EclipseAlert {
  type: 'Solar Eclipse' | 'Lunar Eclipse';
  kind: string;
  dateLocal: string;
  signName: string;
  dms: string;
  houseFromLagna: number;
  houseFromMoon: number;
  impactedNatalBodies: string[];
}

export interface MultiYearCalendarReport {
  ingresses: TransitIngressEvent[];
  sadeSatiWindows: SadeSatiWindow[];
  eclipses: EclipseAlert[];
}

const GOOD_NAKS_BY_PURPOSE: Record<MuhurtaPurpose, Set<string>> = {
  marriage: new Set(['Rohini', 'Mrigashira', 'Magha', 'Uttara Phalguni', 'Hasta', 'Swati', 'Anuradha', 'Mula', 'Uttara Ashadha', 'Uttara Bhadrapada', 'Revati']),
  griha_pravesh: new Set(['Rohini', 'Mrigashira', 'Uttara Phalguni', 'Chitra', 'Anuradha', 'Uttara Ashadha', 'Dhanishta', 'Uttara Bhadrapada', 'Revati']),
  business: new Set(['Ashwini', 'Rohini', 'Pushya', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Anuradha', 'Shravana', 'Dhanishta', 'Revati']),
  travel: new Set(['Ashwini', 'Mrigashira', 'Punarvasu', 'Pushya', 'Hasta', 'Anuradha', 'Shravana', 'Dhanishta', 'Revati']),
  medical: new Set(['Ashwini', 'Rohini', 'Mrigashira', 'Punarvasu', 'Pushya', 'Hasta', 'Chitra', 'Swati', 'Anuradha', 'Shravana', 'Revati']),
  education: new Set(['Ashwini', 'Punarvasu', 'Pushya', 'Hasta', 'Chitra', 'Swati', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Revati']),
};

const GOOD_VARAS_BY_PURPOSE: Record<MuhurtaPurpose, Set<string>> = {
  marriage: new Set(['Monday', 'Wednesday', 'Thursday', 'Friday']),
  griha_pravesh: new Set(['Monday', 'Wednesday', 'Thursday', 'Friday']),
  business: new Set(['Wednesday', 'Thursday', 'Friday', 'Monday']),
  travel: new Set(['Monday', 'Wednesday', 'Thursday', 'Friday']),
  medical: new Set(['Monday', 'Wednesday', 'Thursday', 'Friday']),
  education: new Set(['Wednesday', 'Thursday', 'Friday', 'Monday']),
};

const GOOD_TARAS = new Set([1, 3, 5, 7, 8]); // Sampat, Kshema, Sadhana, Mitra, Parama Mitra
const BAD_YOGAS = new Set(['Vyatipata', 'Vaidhriti', 'Parigha', 'Atiganda', 'Ganda', 'Shoola', 'Vyaghata']);

export function findAuspiciousMuhurtas(
  natalChart: ChartData,
  purpose: MuhurtaPurpose,
  startDateStr: string,
  daysToScan = 45
): MuhurtaCandidate[] {
  if (evaluateParamayusStatus(natalChart, startDateStr).exceeded) {
    return [];
  }
  const natalMoon = natalChart.planets.find((p) => p.id === 'Moon')!;
  const startMs = Date.parse(`${startDateStr}T10:30:00Z`) || Date.now();
  const safeDays = Math.max(7, Math.min(90, daysToScan));
  const candidates: MuhurtaCandidate[] = [];

  for (let d = 0; d < safeDays; d++) {
    const dt = new Date(startMs + d * 86_400_000);
    const dateStr = dt.toISOString().slice(0, 10);
    const probeInput: BirthInput = {
      ...natalChart.input,
      id: `muhurta-${dateStr}`,
      name: 'Muhurta Probe',
      date: dateStr,
      time: '11:30:00',
    };
    const dayChart = calculateChart(probeInput, natalChart.settings);
    const p = dayChart.panchang;
    const dayMoon = dayChart.planets.find((pl) => pl.id === 'Moon')!;

    let score = 55;
    const notes: string[] = [];

    // 1. Tithi check (avoid Rikta 4,9,14,19,24,29 and Amavasya 30)
    const tNum = p.tithi.number;
    const isRikta = [4, 9, 14, 19, 24, 29, 30].includes(tNum);
    if (isRikta) {
      score -= 18;
      notes.push(`Rikta/Amavasya Tithi (${p.tithi.name})`);
    } else if ([2, 3, 5, 7, 10, 11, 13, 15, 17, 18, 20, 22, 25].includes(tNum)) {
      score += 12;
      notes.push('Auspicious Tithi');
    }

    // 2. Nakshatra suitability
    if (GOOD_NAKS_BY_PURPOSE[purpose].has(p.nakshatra.name)) {
      score += 15;
      notes.push(`Favorable ${p.nakshatra.name} Nakshatra`);
    } else if (['Bharani', 'Krittika', 'Ardra', 'Ashlesha', 'Jyeshtha'].includes(p.nakshatra.name)) {
      score -= 10;
    }

    // 3. Vara
    if (GOOD_VARAS_BY_PURPOSE[purpose].has(p.vara.name)) {
      score += 8;
    }

    // 4. Karana (Avoid Vishti / Bhadra)
    if (p.karana.name.includes('Vishti')) {
      score -= 14;
      notes.push('Bhadra (Vishti) Karana present');
    } else {
      score += 5;
    }

    // 5. Yoga
    if (BAD_YOGAS.has(p.yoga.name)) {
      score -= 10;
      notes.push(`Caution Yoga (${p.yoga.name})`);
    } else {
      score += 5;
    }

    // 6. Personal Tara Bala from Natal Moon
    const taraIdx = ((p.nakshatra.index - natalMoon.nakshatraIndex + 27) % 27) % 9;
    const taraGood = GOOD_TARAS.has(taraIdx);
    const taraNames = ['Janma', 'Sampat', 'Vipat', 'Kshema', 'Pratyak', 'Sadhana', 'Naidhana', 'Mitra', 'Parama Mitra'];
    if (taraGood) {
      score += 10;
    } else {
      score -= 8;
      notes.push(`Caution Tara (${taraNames[taraIdx]})`);
    }

    // 7. Personal Chandra Bala (Moon house from Natal Moon)
    const moonDist = ((dayMoon.signIndex - natalMoon.signIndex + 12) % 12) + 1;
    const chandraGood = ![6, 8, 12].includes(moonDist);
    if (chandraGood) {
      score += 8;
    } else {
      score -= 12;
      notes.push(`Ashtama/Dusthana Chandra (H${moonDist})`);
    }

    score = Math.max(15, Math.min(98, Math.round(score)));
    const verdict: MuhurtaCandidate['verdict'] =
      score >= 76 ? 'Shubha (Highly Auspicious)' : score >= 62 ? 'Good' : 'Average';

    candidates.push({
      date: dateStr,
      weekday: p.vara.name,
      tithi: `${p.tithi.paksha} ${p.tithi.name}`,
      nakshatra: p.nakshatra.name,
      yoga: p.yoga.name,
      karana: p.karana.name,
      taraStatus: `${taraNames[taraIdx]} (${taraGood ? 'Good' : 'Caution'})`,
      chandraBala: `H${moonDist} (${chandraGood ? 'Strong' : 'Weak'})`,
      abhijitWindow: p.abhijitMuhurta,
      rahuKalam: p.rahuKalam,
      score,
      verdict,
      notes,
    });
  }

  return candidates.sort((a, b) => b.score - a.score).slice(0, 12);
}

function getSiderealSign(body: Astronomy.Body, ms: number, ayanMode: ChartData['settings']['ayanamsa']): number {
  const t = new Astronomy.AstroTime(new Date(ms));
  const vec = Astronomy.GeoVector(body, t, true);
  const ecl = Astronomy.Ecliptic(vec);
  const sid = normalizeDeg(ecl.elon - computeAyanamsaDeg(t, ayanMode));
  return Math.floor(sid / 30) % 12;
}

function refineSignChangeMs(
  body: Astronomy.Body,
  t1Ms: number,
  t2Ms: number,
  ayanMode: ChartData['settings']['ayanamsa']
): number {
  const s1 = getSiderealSign(body, t1Ms, ayanMode);
  let lo = t1Ms;
  let hi = t2Ms;
  for (let i = 0; i < 14; i++) {
    const mid = (lo + hi) / 2;
    if (getSiderealSign(body, mid, ayanMode) === s1) lo = mid;
    else hi = mid;
  }
  return hi;
}

export function computeMultiYearCalendar(
  natalChart: ChartData,
  startDateStr: string,
  yearsAhead = 10
): MultiYearCalendarReport {
  if (evaluateParamayusStatus(natalChart, startDateStr).exceeded) {
    return {
      ingresses: [],
      sadeSatiWindows: [],
      eclipses: [],
    };
  }
  const natalMoon = natalChart.planets.find((p) => p.id === 'Moon')!;
  const moonSign = natalMoon.signIndex;
  const lagnaSign = natalChart.ascendant.signIndex;
  const ayanMode = natalChart.settings.ayanamsa;

  const startMs = Date.parse(`${startDateStr}T00:00:00Z`) || Date.now();
  const endMs = startMs + yearsAhead * 365.2425 * 86_400_000;
  const stepMs = 10 * 86_400_000;

  // 1. Scan Jupiter & Saturn sign ingresses
  const ingresses: TransitIngressEvent[] = [];
  for (const [planetName, body] of [
    ['Jupiter', Astronomy.Body.Jupiter],
    ['Saturn', Astronomy.Body.Saturn],
  ] as const) {
    let prevMs = startMs;
    let prevSign = getSiderealSign(body, prevMs, ayanMode);

    for (let cur = startMs + stepMs; cur <= endMs; cur += stepMs) {
      const curSign = getSiderealSign(body, cur, ayanMode);
      if (curSign !== prevSign) {
        const exactMs = refineSignChangeMs(body, prevMs, cur, ayanMode);
        const hMoon = ((curSign - moonSign + 12) % 12) + 1;
        const hLagna = ((curSign - lagnaSign + 12) % 12) + 1;
        ingresses.push({
          planet: planetName,
          date: formatLocalDateTimeFromUtc(exactMs, natalChart.offsetMinutesUsed).slice(0, 10),
          fromSign: SIGNS[prevSign].name,
          toSign: SIGNS[curSign].name,
          houseFromMoon: hMoon,
          houseFromLagna: hLagna,
          note: `${planetName} enters ${SIGNS[curSign].name} (H${hMoon} from Moon, H${hLagna} from Lagna).`,
        });
        prevSign = curSign;
      }
      prevMs = cur;
    }
  }
  ingresses.sort((a, b) => a.date.localeCompare(b.date));

  // 2. Sade Sati & Ashtama Shani Windows over the scanned range
  const sadeSatiWindows: SadeSatiWindow[] = [];
  const saturnPhases: Array<{ h: number; label: string; note: string }> = [
    { h: 12, label: 'Sade Sati Phase 1 (Rising)', note: 'Saturn in 12th from Moon — expenditure discipline & inner renewal.' },
    { h: 1, label: 'Sade Sati Peak (Janma Shani)', note: 'Saturn over Natal Moon — maturity, focus & health stewardship.' },
    { h: 2, label: 'Sade Sati Phase 3 (Setting)', note: 'Saturn in 2nd from Moon — stabilizing finances & family duty.' },
    { h: 8, label: 'Ashtama Shani (8th)', note: 'Saturn in 8th from Moon — steady resilience & patient pacing.' },
  ];

  let activeLabel: string | null = null;
  let activeNote = '';
  let windowStartMs = startMs;
  for (let cur = startMs; cur <= endMs; cur += 15 * 86_400_000) {
    const sSign = getSiderealSign(Astronomy.Body.Saturn, cur, ayanMode);
    const hFromMoon = ((sSign - moonSign + 12) % 12) + 1;
    const match = saturnPhases.find((p) => p.h === hFromMoon);
    const label = match?.label ?? null;

    if (label !== activeLabel) {
      if (activeLabel) {
        sadeSatiWindows.push({
          phase: activeLabel,
          startDate: formatLocalDateTimeFromUtc(windowStartMs, natalChart.offsetMinutesUsed).slice(0, 10),
          endDate: formatLocalDateTimeFromUtc(cur, natalChart.offsetMinutesUsed).slice(0, 10),
          note: activeNote,
        });
      }
      activeLabel = label;
      activeNote = match?.note ?? '';
      windowStartMs = cur;
    }
  }
  if (activeLabel) {
    sadeSatiWindows.push({
      phase: activeLabel,
      startDate: formatLocalDateTimeFromUtc(windowStartMs, natalChart.offsetMinutesUsed).slice(0, 10),
      endDate: formatLocalDateTimeFromUtc(endMs, natalChart.offsetMinutesUsed).slice(0, 10),
      note: activeNote,
    });
  }

  // 3. Upcoming Solar & Lunar Eclipses (next 3 years)
  const eclipses: EclipseAlert[] = [];
  const ecLimitMs = startMs + 3 * 365.2425 * 86_400_000;
  const checkNatalImpacts = (ecLonSid: number) => {
    const hits: string[] = [];
    if (angularDiffDeg(ecLonSid, natalChart.ascendant.longitude) <= 6) hits.push('Lagna');
    for (const p of natalChart.planets) {
      if (angularDiffDeg(ecLonSid, p.longitude) <= 6) hits.push(p.id);
    }
    return hits;
  };

  let sol = Astronomy.SearchGlobalSolarEclipse(new Date(startMs));
  for (let i = 0; i < 8 && sol.peak.date.getTime() <= ecLimitMs; i++) {
    const t = sol.peak;
    const lonSid = normalizeDeg(Astronomy.SunPosition(t).elon - computeAyanamsaDeg(t, ayanMode));
    const sIdx = Math.floor(lonSid / 30) % 12;
    eclipses.push({
      type: 'Solar Eclipse',
      kind: String(sol.kind),
      dateLocal: formatLocalDateTimeFromUtc(t.date.getTime(), natalChart.offsetMinutesUsed),
      signName: SIGNS[sIdx].name,
      dms: `${(lonSid % 30).toFixed(1)}°`,
      houseFromLagna: ((sIdx - lagnaSign + 12) % 12) + 1,
      houseFromMoon: ((sIdx - moonSign + 12) % 12) + 1,
      impactedNatalBodies: checkNatalImpacts(lonSid),
    });
    sol = Astronomy.NextGlobalSolarEclipse(sol.peak);
  }

  let lun = Astronomy.SearchLunarEclipse(new Date(startMs));
  for (let i = 0; i < 8 && lun.peak.date.getTime() <= ecLimitMs; i++) {
    const t = lun.peak;
    const lonSid = normalizeDeg(Astronomy.EclipticGeoMoon(t).lon - computeAyanamsaDeg(t, ayanMode));
    const sIdx = Math.floor(lonSid / 30) % 12;
    eclipses.push({
      type: 'Lunar Eclipse',
      kind: String(lun.kind),
      dateLocal: formatLocalDateTimeFromUtc(t.date.getTime(), natalChart.offsetMinutesUsed),
      signName: SIGNS[sIdx].name,
      dms: `${(lonSid % 30).toFixed(1)}°`,
      houseFromLagna: ((sIdx - lagnaSign + 12) % 12) + 1,
      houseFromMoon: ((sIdx - moonSign + 12) % 12) + 1,
      impactedNatalBodies: checkNatalImpacts(lonSid),
    });
    lun = Astronomy.NextLunarEclipse(lun.peak);
  }

  eclipses.sort((a, b) => a.dateLocal.localeCompare(b.dateLocal));

  return {
    ingresses,
    sadeSatiWindows,
    eclipses,
  };
}
