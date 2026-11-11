import * as Astronomy from 'astronomy-engine';
import {
  COMBUSTION_ORB,
  OUTER_PLANETS,
  PLANET_SHORT,
  SEVEN_PLANETS,
  SIGNS,
} from './constants';
import { angularDiffDeg, formatDms, normalizeDeg } from './time';
import type {
  AyanamsaId,
  BodyPosition,
  HouseCusp,
  HouseSystem,
  NodeMode,
  PlanetId,
  SevenPlanetId,
  SpecialPoint,
} from './types';
import { buildSignPlacement } from './vargas';

const J2000_AYANAMSA_MEAN: Record<Exclude<AyanamsaId, 'tropical' | 'true_chitra'>, number> = {
  lahiri: 23 + 51 / 60 + 25.5324 / 3600,
  kp: 23 + 45 / 60 + 14.3 / 3600,
  raman: 22 + 26 / 60 + 58.3 / 3600,
  fagan_bradley: 24 + 44 / 60 + 11.6 / 3600,
  yukteswar: 22 + 27 / 60 + 48.0 / 3600,
};

// Spica (Alpha Virginis) J2000 ICRS coordinates & proper motion
const SPICA_RA_J2000_DEG = (13 + 25 / 60 + 11.579 / 3600) * 15;
const SPICA_DEC_J2000_DEG = -(11 + 9 / 60 + 40.75 / 3600);
const SPICA_PM_RA_DEG_PER_YR = -42.35 / 3_600_000;
const SPICA_PM_DEC_DEG_PER_YR = -30.67 / 3_600_000;

function computeTrueChitraAyanamsa(time: Astronomy.AstroTime): number {
  const years = time.tt / 365.25;
  const ra = (SPICA_RA_J2000_DEG + years * SPICA_PM_RA_DEG_PER_YR) * Astronomy.DEG2RAD;
  const dec = (SPICA_DEC_J2000_DEG + years * SPICA_PM_DEC_DEG_PER_YR) * Astronomy.DEG2RAD;
  const eqj = new Astronomy.Vector(
    Math.cos(dec) * Math.cos(ra),
    Math.cos(dec) * Math.sin(ra),
    Math.sin(dec),
    time
  );
  const ect = Astronomy.RotateVector(Astronomy.Rotation_EQJ_ECT(time), eqj);
  const spicaLon = normalizeDeg(Math.atan2(ect.y, ect.x) * Astronomy.RAD2DEG);
  return normalizeDeg(spicaLon - 180);
}

export function computeAyanamsaDeg(time: Astronomy.AstroTime, ayanamsa: AyanamsaId): number {
  if (ayanamsa === 'tropical') return 0;
  if (ayanamsa === 'true_chitra') {
    return computeTrueChitraAyanamsa(time);
  }
  const T = time.tt / 36525.0;
  const precessionDeg = (5029.0966 * T + 1.11113 * T * T - 0.000006 * T * T * T) / 3600.0;
  const tilt = Astronomy.e_tilt(time);
  const dpsiDeg = tilt.dpsi / 3600.0;
  return J2000_AYANAMSA_MEAN[ayanamsa] + precessionDeg + dpsiDeg;
}

function getTrueNodeTropical(time: Astronomy.AstroTime): number {
  const st = Astronomy.GeoMoonState(time);
  const h = new Astronomy.Vector(
    st.y * st.vz - st.z * st.vy,
    st.z * st.vx - st.x * st.vz,
    st.x * st.vy - st.y * st.vx,
    time
  );
  const hect = Astronomy.RotateVector(Astronomy.Rotation_EQJ_ECT(time), h);
  return normalizeDeg(Math.atan2(hect.x, -hect.y) * Astronomy.RAD2DEG);
}

function getMeanNodeTropical(time: Astronomy.AstroTime): number {
  const T = time.tt / 36525.0;
  const node =
    125.0445479 -
    1934.1362891 * T +
    0.0020754 * T * T +
    (T * T * T) / 467441.0 -
    (T * T * T * T) / 60616000.0;
  return normalizeDeg(node);
}

const BODY_MAP: Partial<Record<PlanetId, Astronomy.Body>> = {
  Sun: Astronomy.Body.Sun,
  Moon: Astronomy.Body.Moon,
  Mercury: Astronomy.Body.Mercury,
  Venus: Astronomy.Body.Venus,
  Mars: Astronomy.Body.Mars,
  Jupiter: Astronomy.Body.Jupiter,
  Saturn: Astronomy.Body.Saturn,
  Uranus: Astronomy.Body.Uranus,
  Neptune: Astronomy.Body.Neptune,
  Pluto: Astronomy.Body.Pluto,
};

export function getTropicalPosition(
  id: PlanetId,
  time: Astronomy.AstroTime,
  nodeMode: NodeMode
): { lon: number; lat: number } {
  if (id === 'Sun') {
    const sun = Astronomy.SunPosition(time);
    return { lon: normalizeDeg(sun.elon), lat: sun.elat };
  }
  if (id === 'Moon') {
    const moon = Astronomy.EclipticGeoMoon(time);
    return { lon: normalizeDeg(moon.lon), lat: moon.lat };
  }
  if (id === 'Rahu') {
    const lon = nodeMode === 'true' ? getTrueNodeTropical(time) : getMeanNodeTropical(time);
    return { lon, lat: 0 };
  }
  if (id === 'Ketu') {
    const rahu = nodeMode === 'true' ? getTrueNodeTropical(time) : getMeanNodeTropical(time);
    return { lon: normalizeDeg(rahu + 180), lat: 0 };
  }

  const body = BODY_MAP[id]!;
  const vec = Astronomy.GeoVector(body, time, true);
  const ecl = Astronomy.Ecliptic(vec);
  return { lon: normalizeDeg(ecl.elon), lat: ecl.elat };
}

export function getTropicalSpeedDegPerDay(
  id: PlanetId,
  time: Astronomy.AstroTime,
  nodeMode: NodeMode
): number {
  const dt = id === 'Moon' ? 0.02 : 0.05;
  const p1 = getTropicalPosition(id, time.AddDays(-dt), nodeMode).lon;
  const p2 = getTropicalPosition(id, time.AddDays(dt), nodeMode).lon;
  let diff = p2 - p1;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return diff / (2 * dt);
}

export function computeAscendantAndMcTropical(
  time: Astronomy.AstroTime,
  latitude: number,
  longitude: number
): { asc: number; mc: number; gmstHours: number; lmstHours: number; obliquityDeg: number } {
  const gmstHours = Astronomy.SiderealTime(time);
  const lmstHours = ((gmstHours + longitude / 15) % 24 + 24) % 24;
  const ramcDeg = lmstHours * 15;
  const obliquityDeg = Astronomy.e_tilt(time).tobl;

  const th = ramcDeg * Astronomy.DEG2RAD;
  const eps = obliquityDeg * Astronomy.DEG2RAD;
  const safeLat = Math.max(-89.9, Math.min(89.9, latitude));
  const phi = safeLat * Astronomy.DEG2RAD;

  const ascY = Math.cos(th);
  const ascX = -(Math.sin(th) * Math.cos(eps) + Math.tan(phi) * Math.sin(eps));
  const asc = normalizeDeg(Math.atan2(ascY, ascX) * Astronomy.RAD2DEG);

  const mc = normalizeDeg(Math.atan2(Math.sin(th), Math.cos(th) * Math.cos(eps)) * Astronomy.RAD2DEG);

  return { asc, mc, gmstHours, lmstHours, obliquityDeg };
}

function circularMidpoint(a: number, b: number): number {
  let diff = normalizeDeg(b - a);
  if (diff > 180) diff -= 360;
  return normalizeDeg(a + diff / 2);
}

export function computeHouses(
  ascSidereal: number,
  mcSidereal: number,
  system: HouseSystem
): HouseCusp[] {
  const ascSign = Math.floor(normalizeDeg(ascSidereal) / 30) % 12;

  if (system === 'whole_sign') {
    return Array.from({ length: 12 }, (_, i) => {
      const signIndex = (ascSign + i) % 12;
      const start = signIndex * 30;
      const midpoint = normalizeDeg(start + 15);
      return {
        house: i + 1,
        midpoint,
        start,
        signIndex,
        signName: SIGNS[signIndex].name,
        dms: formatDms(midpoint % 30),
      };
    });
  }

  if (system === 'equal') {
    return Array.from({ length: 12 }, (_, i) => {
      const midpoint = normalizeDeg(ascSidereal + i * 30);
      const start = normalizeDeg(midpoint - 15);
      const signIndex = Math.floor(midpoint / 30) % 12;
      return {
        house: i + 1,
        midpoint,
        start,
        signIndex,
        signName: SIGNS[signIndex].name,
        dms: formatDms(midpoint % 30),
      };
    });
  }

  // Sripati (Porphyry) Bhava Madhya & Sandhi
  const m = new Array<number>(12).fill(0);
  const icSid = normalizeDeg(mcSidereal + 180);
  const dscSid = normalizeDeg(ascSidereal + 180);

  m[0] = ascSidereal;
  m[3] = icSid;
  m[6] = dscSid;
  m[9] = mcSidereal;

  const q1 = normalizeDeg(icSid - ascSidereal);
  m[1] = normalizeDeg(ascSidereal + q1 / 3);
  m[2] = normalizeDeg(ascSidereal + (2 * q1) / 3);

  const q2 = normalizeDeg(dscSid - icSid);
  m[4] = normalizeDeg(icSid + q2 / 3);
  m[5] = normalizeDeg(icSid + (2 * q2) / 3);

  m[7] = normalizeDeg(m[1] + 180);
  m[8] = normalizeDeg(m[2] + 180);
  m[10] = normalizeDeg(m[4] + 180);
  m[11] = normalizeDeg(m[5] + 180);

  return m.map((midpoint, i) => {
    const prevMid = m[(i + 11) % 12];
    const start = circularMidpoint(prevMid, midpoint);
    const signIndex = Math.floor(midpoint / 30) % 12;
    return {
      house: i + 1,
      midpoint,
      start,
      signIndex,
      signName: SIGNS[signIndex].name,
      dms: formatDms(midpoint % 30),
    };
  });
}

export function findHouseForLongitude(lonSidereal: number, houses: HouseCusp[], system: HouseSystem): number {
  const lon = normalizeDeg(lonSidereal);
  if (system === 'whole_sign') {
    const sign = Math.floor(lon / 30) % 12;
    const h1Sign = houses[0].signIndex;
    return ((sign - h1Sign + 12) % 12) + 1;
  }

  for (let i = 0; i < 12; i++) {
    const start = houses[i].start;
    const end = houses[(i + 1) % 12].start;
    const span = normalizeDeg(end - start);
    const offset = normalizeDeg(lon - start);
    if (offset < span) {
      return i + 1;
    }
  }
  return 1;
}

export function isBodyCombust(
  id: PlanetId,
  lonSid: number,
  sunLonSid: number,
  isRetrograde: boolean
): boolean {
  if (id === 'Sun' || id === 'Rahu' || id === 'Ketu' || id === 'Uranus' || id === 'Neptune' || id === 'Pluto') {
    return false;
  }
  const orbCfg = COMBUSTION_ORB[id as SevenPlanetId];
  if (!orbCfg) return false;
  const orb = isRetrograde && orbCfg.retro ? orbCfg.retro : orbCfg.direct;
  return angularDiffDeg(lonSid, sunLonSid) <= orb;
}

export function getPlanetIds(includeOuter: boolean): PlanetId[] {
  const base: PlanetId[] = [...SEVEN_PLANETS, 'Rahu', 'Ketu'];
  return includeOuter ? [...base, ...OUTER_PLANETS] : base;
}

export function computeSunriseSunsetForLocalDay(
  utcMs: number,
  offsetMinutes: number,
  latitude: number,
  longitude: number
): {
  sunriseMs: number | null;
  sunsetMs: number | null;
  vedicSunriseMs: number | null;
  vedicSunsetMs: number | null;
  nextSunriseMs: number | null;
  moonriseMs: number | null;
  moonsetMs: number | null;
} {
  const observer = new Astronomy.Observer(latitude, longitude, 0);
  const localMs = utcMs + offsetMinutes * 60_000;
  const localDate = new Date(localMs);
  const localMidnightUtcMs =
    Date.UTC(localDate.getUTCFullYear(), localDate.getUTCMonth(), localDate.getUTCDate()) -
    offsetMinutes * 60_000;

  const sunrise = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, +1, new Date(localMidnightUtcMs), 1.2);
  const sunset = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, -1, new Date(localMidnightUtcMs), 1.2);
  const moonrise = Astronomy.SearchRiseSet(Astronomy.Body.Moon, observer, +1, new Date(localMidnightUtcMs), 1.2);
  const moonset = Astronomy.SearchRiseSet(Astronomy.Body.Moon, observer, -1, new Date(localMidnightUtcMs), 1.2);

  const sunriseMs = sunrise ? sunrise.date.getTime() : null;
  const sunsetMs = sunset ? sunset.date.getTime() : null;

  let vedicSunriseMs = sunriseMs;
  let vedicSunsetMs = sunsetMs;
  let nextSunriseMs: number | null = null;

  if (sunriseMs !== null && utcMs < sunriseMs) {
    // Birth occurred before today's sunrise -> Vedic day starts from yesterday's sunrise
    const prevMidnightMs = localMidnightUtcMs - 86_400_000;
    const prevSr = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, +1, new Date(prevMidnightMs), 1.2);
    const prevSs = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, -1, new Date(prevMidnightMs), 1.2);
    vedicSunriseMs = prevSr ? prevSr.date.getTime() : sunriseMs - 86_400_000;
    vedicSunsetMs = prevSs ? prevSs.date.getTime() : (sunsetMs ? sunsetMs - 86_400_000 : null);
    nextSunriseMs = sunriseMs;
  } else if (sunriseMs !== null) {
    const nextSr = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, +1, new Date(sunriseMs + 3600_000), 1.5);
    nextSunriseMs = nextSr ? nextSr.date.getTime() : sunriseMs + 86_400_000;
  }

  const moonriseMs =
    moonrise && moonrise.date.getTime() < localMidnightUtcMs + 86_400_000
      ? moonrise.date.getTime()
      : null;
  const moonsetMs =
    moonset && moonset.date.getTime() < localMidnightUtcMs + 86_400_000
      ? moonset.date.getTime()
      : null;

  return {
    sunriseMs,
    sunsetMs,
    vedicSunriseMs,
    vedicSunsetMs,
    nextSunriseMs,
    moonriseMs,
    moonsetMs,
  };
}

export function computeSpecialPoints(params: {
  utcMs: number;
  vedicSunriseMs: number | null;
  vedicSunsetMs: number | null;
  nextSunriseMs: number | null;
  ayanamsa: AyanamsaId;
  ayanamsaDeg: number;
  latitude: number;
  longitude: number;
  ascendant: BodyPosition;
  planets: BodyPosition[];
  houses: HouseCusp[];
  houseSystem: HouseSystem;
  vedicDayIndex: number;
}): SpecialPoint[] {
  const {
    utcMs,
    vedicSunriseMs,
    vedicSunsetMs,
    nextSunriseMs,
    ayanamsa,
    ayanamsaDeg,
    latitude,
    longitude,
    ascendant,
    planets,
    houses,
    houseSystem,
    vedicDayIndex,
  } = params;

  const points: SpecialPoint[] = [];

  if (vedicSunriseMs !== null) {
    const srTime = new Astronomy.AstroTime(new Date(vedicSunriseMs));
    const srAyan = computeAyanamsaDeg(srTime, ayanamsa);
    const sunAtSr = normalizeDeg(Astronomy.SunPosition(srTime).elon - srAyan);
    const elapsedMin = Math.max(0, (utcMs - vedicSunriseMs) / 60_000);

    const addLagnaPoint = (id: SpecialPoint['id'], label: string, shortLabel: string, lon: number) => {
      const placement = buildSignPlacement(lon);
      points.push({
        ...placement,
        id,
        label,
        shortLabel,
        houseNumber: findHouseForLongitude(placement.longitude, houses, houseSystem),
      });
    };

    addLagnaPoint('BL', 'Bhava Lagna', 'BL', normalizeDeg(sunAtSr + elapsedMin / 4));
    addLagnaPoint('HL', 'Hora Lagna', 'HL', normalizeDeg(sunAtSr + elapsedMin / 2));
    addLagnaPoint('GL', 'Ghati Lagna', 'GL', normalizeDeg(sunAtSr + (elapsedMin * 5) / 4));

    // Mandi / Gulika (Saturn's 1/8th part of day or night)
    if (vedicSunsetMs !== null && nextSunriseMs !== null) {
      const isDay = utcMs >= vedicSunriseMs && utcMs < vedicSunsetMs;
      const daySatIdx = [6, 5, 4, 3, 2, 1, 0]; // Sun..Sat
      const nightSatIdx = [2, 1, 0, 6, 5, 4, 3];
      const partIdx = isDay ? daySatIdx[vedicDayIndex] : nightSatIdx[vedicDayIndex];
      const segStart = isDay ? vedicSunriseMs : vedicSunsetMs;
      const segEnd = isDay ? vedicSunsetMs : nextSunriseMs;
      const partDur = (segEnd - segStart) / 8;
      const mandiMs = segStart + partIdx * partDur;
      const mTime = new Astronomy.AstroTime(new Date(mandiMs));
      const mandiTrop = computeAscendantAndMcTropical(mTime, latitude, longitude).asc;
      const mandiSid = normalizeDeg(mandiTrop - ayanamsaDeg);
      addLagnaPoint('Mandi', 'Mandi (Gulika)', 'Md', mandiSid);
    }
  }

  // Arudha Lagna (AL) and Upapada Lagna (UL = A12)
  const computeArudha = (baseSign: number): number => {
    const lord = SIGNS[baseSign].lord;
    const lordPlanet = planets.find((p) => p.id === lord);
    const lordSign = lordPlanet ? lordPlanet.signIndex : baseSign;
    const dist = (lordSign - baseSign + 12) % 12;
    let arudhaSign = (lordSign + dist) % 12;
    if (arudhaSign === baseSign || arudhaSign === (baseSign + 6) % 12) {
      arudhaSign = (arudhaSign + 9) % 12; // 10th from raw arudha
    }
    return arudhaSign * 30 + 15;
  };

  const alLon = computeArudha(ascendant.signIndex);
  const alPlacement = buildSignPlacement(alLon);
  points.push({
    ...alPlacement,
    id: 'AL',
    label: 'Arudha Lagna',
    shortLabel: 'AL',
    houseNumber: findHouseForLongitude(alPlacement.longitude, houses, houseSystem),
  });

  const ulLon = computeArudha((ascendant.signIndex + 11) % 12);
  const ulPlacement = buildSignPlacement(ulLon);
  points.push({
    ...ulPlacement,
    id: 'UL',
    label: 'Upapada Lagna',
    shortLabel: 'UL',
    houseNumber: findHouseForLongitude(ulPlacement.longitude, houses, houseSystem),
  });

  return points;
}

export function buildBaseBodyPosition(params: {
  id: PlanetId | 'Asc';
  siderealLon: number;
  tropicalLon: number;
  latitude: number;
  speedDegPerDay: number;
  isCombust: boolean;
  isVargottama: boolean;
  houses: HouseCusp[];
  houseSystem: HouseSystem;
  ascSignIndex: number;
}): BodyPosition {
  const placement = buildSignPlacement(params.siderealLon);
  const houseNumber = findHouseForLongitude(placement.longitude, params.houses, params.houseSystem);
  const rasiHouseNumber = ((placement.signIndex - params.ascSignIndex + 12) % 12) + 1;

  return {
    ...placement,
    id: params.id,
    shortLabel: PLANET_SHORT[params.id],
    tropicalLongitude: normalizeDeg(params.tropicalLon),
    latitude: params.latitude,
    speedDegPerDay: params.speedDegPerDay,
    isRetrograde: params.id !== 'Asc' && params.id !== 'Sun' && params.id !== 'Moon' && params.speedDegPerDay < 0,
    isCombust: params.isCombust,
    isVargottama: params.isVargottama,
    houseNumber,
    rasiHouseNumber,
    dignity: '-',
  };
}
