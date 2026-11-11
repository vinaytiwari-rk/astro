import {
  CHALDEAN_ORDER,
  FIXED_KARANAS,
  MOVABLE_KARANAS,
  NAKSHATRAS,
  NITYA_YOGAS,
  TITHI_LORDS,
  TITHI_NAMES,
  VARA_INFO,
} from './constants';
import { formatDurationMs, formatLocalTimeFromUtc, normalizeDeg } from './time';
import type { PanchangInfo, SevenPlanetId } from './types';

function formatInterval(startMs: number, endMs: number, offsetMinutes: number): string {
  return `${formatLocalTimeFromUtc(startMs, offsetMinutes, false)} – ${formatLocalTimeFromUtc(endMs, offsetMinutes, false)}`;
}

export function computePanchang(params: {
  utcMs: number;
  offsetMinutes: number;
  sunSid: number;
  moonSid: number;
  sunriseMs: number | null;
  sunsetMs: number | null;
  vedicSunriseMs: number | null;
  vedicSunsetMs: number | null;
  nextSunriseMs: number | null;
  moonriseMs: number | null;
  moonsetMs: number | null;
}): { panchang: PanchangInfo; vedicDayIndex: number } {
  const {
    utcMs,
    offsetMinutes,
    sunSid,
    moonSid,
    sunriseMs,
    sunsetMs,
    vedicSunriseMs,
    vedicSunsetMs,
    nextSunriseMs,
    moonriseMs,
    moonsetMs,
  } = params;

  // Vara (Vedic weekday starting at sunrise)
  const refMs = vedicSunriseMs ?? utcMs;
  const localRef = new Date(refMs + offsetMinutes * 60_000);
  const vedicDayIndex = localRef.getUTCDay();
  const varaDef = VARA_INFO[vedicDayIndex];

  // Tithi
  const moonMinusSun = normalizeDeg(moonSid - sunSid);
  const tithiIdx = Math.floor(moonMinusSun / 12) % 30;
  const tithiElapsed = ((moonMinusSun % 12) / 12) * 100;

  // Nakshatra
  const nakSpan = 360 / 27;
  const nakIdx = Math.floor(normalizeDeg(moonSid) / nakSpan) % 27;
  const nakOffset = normalizeDeg(moonSid) - nakIdx * nakSpan;
  const pada = (Math.floor(nakOffset / (nakSpan / 4)) % 4) + 1;
  const nakElapsed = (nakOffset / nakSpan) * 100;
  const nakDef = NAKSHATRAS[nakIdx];

  // Yoga
  const sunPlusMoon = normalizeDeg(sunSid + moonSid);
  const yogaIdx = Math.floor(sunPlusMoon / nakSpan) % 27;
  const yogaElapsed = ((sunPlusMoon - yogaIdx * nakSpan) / nakSpan) * 100;
  const yogaDef = NITYA_YOGAS[yogaIdx];

  // Karana
  const karanaIdx = Math.floor(moonMinusSun / 6) % 60;
  let karanaName: string;
  let karanaType: 'Movable' | 'Fixed';
  if (karanaIdx === 0) {
    karanaName = FIXED_KARANAS[3]; // Kimstughna
    karanaType = 'Fixed';
  } else if (karanaIdx >= 57) {
    karanaName = FIXED_KARANAS[karanaIdx - 57];
    karanaType = 'Fixed';
  } else {
    karanaName = MOVABLE_KARANAS[(karanaIdx - 1) % 7];
    karanaType = 'Movable';
  }
  const karanaElapsed = ((moonMinusSun % 6) / 6) * 100;

  // Planetary Hora (12 daytime horas + 12 nighttime horas)
  let horaIndex = 0;
  if (vedicSunriseMs !== null && vedicSunsetMs !== null && nextSunriseMs !== null) {
    if (utcMs >= vedicSunriseMs && utcMs < vedicSunsetMs) {
      const hDur = (vedicSunsetMs - vedicSunriseMs) / 12;
      horaIndex = Math.min(11, Math.max(0, Math.floor((utcMs - vedicSunriseMs) / hDur)));
    } else if (utcMs >= vedicSunsetMs) {
      const hDur = (nextSunriseMs - vedicSunsetMs) / 12;
      horaIndex = 12 + Math.min(11, Math.max(0, Math.floor((utcMs - vedicSunsetMs) / hDur)));
    }
  }
  const startChaldean = CHALDEAN_ORDER.indexOf(varaDef.lord);
  const horaLord: SevenPlanetId = CHALDEAN_ORDER[(startChaldean + horaIndex) % 7];

  // Daytime Muhurtas for civil date
  const civilWeekday = new Date(utcMs + offsetMinutes * 60_000).getUTCDay();
  let dayDurationStr = '--';
  let rahuKalam = '--';
  let yamaganda = '--';
  let gulikaKalam = '--';
  let abhijitMuhurta = '--';

  if (sunriseMs !== null && sunsetMs !== null && sunsetMs > sunriseMs) {
    const dayMs = sunsetMs - sunriseMs;
    const part = dayMs / 8;
    dayDurationStr = formatDurationMs(dayMs);

    const rahuIdx = [7, 1, 6, 4, 5, 3, 2][civilWeekday];
    const yamaIdx = [4, 3, 2, 1, 0, 6, 5][civilWeekday];
    const gulikaIdx = [6, 5, 4, 3, 2, 1, 0][civilWeekday];

    rahuKalam = formatInterval(sunriseMs + rahuIdx * part, sunriseMs + (rahuIdx + 1) * part, offsetMinutes);
    yamaganda = formatInterval(sunriseMs + yamaIdx * part, sunriseMs + (yamaIdx + 1) * part, offsetMinutes);
    gulikaKalam = formatInterval(sunriseMs + gulikaIdx * part, sunriseMs + (gulikaIdx + 1) * part, offsetMinutes);

    const solarNoon = (sunriseMs + sunsetMs) / 2;
    const halfAbhijit = dayMs / 30;
    abhijitMuhurta = formatInterval(solarNoon - halfAbhijit, solarNoon + halfAbhijit, offsetMinutes);
  }

  return {
    vedicDayIndex,
    panchang: {
      vara: {
        name: varaDef.name,
        sanskrit: varaDef.sanskrit,
        lord: varaDef.lord,
        sunriseBased: vedicSunriseMs !== null,
      },
      tithi: {
        number: tithiIdx + 1,
        name: TITHI_NAMES[tithiIdx],
        paksha: tithiIdx < 15 ? 'Shukla' : 'Krishna',
        lord: TITHI_LORDS[tithiIdx],
        percentElapsed: Math.round(tithiElapsed * 10) / 10,
        percentRemaining: Math.round((100 - tithiElapsed) * 10) / 10,
      },
      nakshatra: {
        index: nakIdx,
        name: nakDef.name,
        pada,
        lord: nakDef.lord,
        deity: nakDef.deity,
        gana: nakDef.gana,
        yoni: nakDef.yoni,
        nadi: nakDef.nadi,
        varna: `${nakDef.yoni} (${nakDef.yoniGender})`,
        percentElapsed: Math.round(nakElapsed * 10) / 10,
        percentRemaining: Math.round((100 - nakElapsed) * 10) / 10,
      },
      yoga: {
        number: yogaIdx + 1,
        name: yogaDef.name,
        meaning: yogaDef.meaning,
        percentElapsed: Math.round(yogaElapsed * 10) / 10,
      },
      karana: {
        number: karanaIdx + 1,
        name: karanaName,
        type: karanaType,
        percentElapsed: Math.round(karanaElapsed * 10) / 10,
      },
      horaLord,
      sunriseUtc: sunriseMs !== null ? new Date(sunriseMs).toISOString() : null,
      sunsetUtc: sunsetMs !== null ? new Date(sunsetMs).toISOString() : null,
      sunriseLocal: formatLocalTimeFromUtc(sunriseMs, offsetMinutes),
      sunsetLocal: formatLocalTimeFromUtc(sunsetMs, offsetMinutes),
      moonriseLocal: formatLocalTimeFromUtc(moonriseMs, offsetMinutes),
      moonsetLocal: formatLocalTimeFromUtc(moonsetMs, offsetMinutes),
      dayDurationStr,
      rahuKalam,
      yamaganda,
      gulikaKalam,
      abhijitMuhurta,
    },
  };
}
