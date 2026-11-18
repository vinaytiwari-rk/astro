import {
  EXALTATION_DEG,
  MOOLATRIKONA,
  OWN_SIGNS,
  PLANET_SHORT,
  SEVEN_PLANETS,
  SIGNS,
} from './constants';
import { angularDiffDeg, normalizeDeg } from './time';
import type {
  AspectInfo,
  BodyPosition,
  DivisionalChart,
  DivisionalChartId,
  PlanetId,
  SevenPlanetId,
  ShadbalaRow,
} from './types';

const NAISARGIKA_BALA: Record<SevenPlanetId, number> = {
  Sun: 60.0,
  Moon: 51.43,
  Venus: 42.86,
  Jupiter: 34.29,
  Mercury: 25.71,
  Mars: 17.14,
  Saturn: 8.57,
};

/** Convert ecliptic longitude/latitude to geocentric ecliptic-of-date declination. */
export function computeEclipticDeclinationDeg(longitudeDeg: number, latitudeDeg: number, obliquityDeg: number): number {
  const lambda = (longitudeDeg * Math.PI) / 180;
  const beta = (latitudeDeg * Math.PI) / 180;
  const epsilon = (obliquityDeg * Math.PI) / 180;
  const sinDeclination = Math.sin(beta) * Math.cos(epsilon) + Math.cos(beta) * Math.sin(epsilon) * Math.sin(lambda);
  return (Math.asin(Math.max(-1, Math.min(1, sinDeclination))) * 180) / Math.PI;
}

const REQUIRED_RUPAS: Record<SevenPlanetId, number> = {
  Sun: 6.5,
  Moon: 6.0,
  Mars: 5.0,
  Mercury: 7.0,
  Jupiter: 6.5,
  Venus: 5.5,
  Saturn: 5.0,
};

/**
 * Parashara's piecewise aspect strength (0..60 Virupas) for angular distance d in [0, 360).
 */
export function parasharaAspectVirupas(aspecter: PlanetId, d: number): number {
  const angle = normalizeDeg(d);
  let base = 0;
  if (angle >= 30 && angle < 60) base = (angle - 30) / 2;
  else if (angle >= 60 && angle < 90) base = (angle - 60) + 15;
  else if (angle >= 90 && angle < 120) base = 45 - (angle - 90) / 2;
  else if (angle >= 120 && angle < 150) base = 30 - (angle - 120);
  else if (angle >= 150 && angle < 180) base = (angle - 150) * 2;
  else if (angle >= 180 && angle < 300) base = Math.max(0, 60 - (angle - 180) / 2);

  // Special full aspects (60 Virupas total)
  if (aspecter === 'Mars' && ((angle >= 90 && angle < 120) || (angle >= 210 && angle < 240))) {
    base = Math.min(60, base + 15);
  } else if (aspecter === 'Jupiter' && ((angle >= 120 && angle < 150) || (angle >= 240 && angle < 270))) {
    base = Math.min(60, base + 30);
  } else if (aspecter === 'Saturn' && ((angle >= 60 && angle < 90) || (angle >= 270 && angle < 300))) {
    base = Math.min(60, base + 45);
  }

  return base;
}

/**
 * Computes traditional sign/house aspects (Graha Drishti) & tight degree aspects.
 */
export function computeAspects(
  planets: BodyPosition[],
  ascendant: BodyPosition
): AspectInfo[] {
  const targets: BodyPosition[] = [ascendant, ...planets];
  const results: AspectInfo[] = [];

  for (const from of planets) {
    for (const to of targets) {
      if (from.id === to.id) continue;
      const houseDiff = ((to.signIndex - from.signIndex + 12) % 12) + 1;
      let type = '';
      if (houseDiff === 7) type = '7th Full';
      else if (from.id === 'Mars' && (houseDiff === 4 || houseDiff === 8)) {
        type = `${houseDiff}th Mars Special`;
      } else if (from.id === 'Jupiter' && (houseDiff === 5 || houseDiff === 9)) {
        type = `${houseDiff}th Jupiter Special`;
      } else if (from.id === 'Saturn' && (houseDiff === 3 || houseDiff === 10)) {
        type = `${houseDiff}th Saturn Special`;
      } else if ((from.id === 'Rahu' || from.id === 'Ketu') && (houseDiff === 5 || houseDiff === 9)) {
        type = `${houseDiff}th Nodal`;
      }

      if (type) {
        const expectedAngle = (houseDiff - 1) * 30;
        const actualAngle = normalizeDeg(to.longitude - from.longitude);
        const orbDeg = Math.round(angularDiffDeg(actualAngle, expectedAngle) * 100) / 100;
        const strengthPercent = Math.max(25, Math.round(100 - (orbDeg / 15) * 50));
        results.push({
          from: from.id as PlanetId,
          to: to.id,
          type,
          orbDeg,
          strengthPercent,
        });
      }
    }
  }
  return results;
}

/**
 * BPHS 27.15–17 / Santhanam's declination form of Ayana Bala.
 * The traditional maximum declination is 23°27′ (23.45°).
 * Sun, Mars, Jupiter and Venus favour north declination; Moon and Saturn
 * favour south declination; Mercury favours either direction.
 */
export function computeAyanaBalaVirupas(
  planet: SevenPlanetId,
  declinationDeg: number
): number {
  const maximumDeclination = 23 + 27 / 60;
  const favoredDeclination =
    planet === 'Mercury'
      ? Math.abs(declinationDeg)
      : planet === 'Moon' || planet === 'Saturn'
        ? -declinationDeg
        : declinationDeg;
  const virupas =
    (60 * (maximumDeclination + favoredDeclination)) /
    (2 * maximumDeclination);
  return Math.max(0, Math.min(60, virupas));
}

/**
 * BPHS 27.10–11 Paksha Bala in virupas. The Moon, Mercury, Venus and
 * Jupiter receive the phase strength; the other grahas receive its complement.
 */
export function computePakshaBalaVirupas(
  planet: SevenPlanetId,
  pakshaAngleDeg: number,
  isMoonWaxing: boolean
): number {
  const phaseStrength = Math.max(0, Math.min(60, pakshaAngleDeg / 3));
  const benefic = planet === 'Jupiter' ||
    planet === 'Venus' ||
    planet === 'Mercury' ||
    (planet === 'Moon' && isMoonWaxing);
  return benefic ? phaseStrength : 60 - phaseStrength;
}

/**
 * BPHS Saptavargaja points for one of the seven dignity divisions.
 * The classical ladder is 45/30/20/15/10/4/2. Moolatrikona is
 * degree-specific in D1; in the other six vargas, dignity is based on
 * own-sign status or the D1 Panchadha Maitri relationship to the varga lord.
 * Exaltation/debilitation are not separate Saptavargaja categories.
 */
export function computeSaptavargajaPoints(
  planet: SevenPlanetId,
  signIndex: number,
  degreeInSign: number,
  isRasi: boolean,
  maitriMatrix: Record<SevenPlanetId, Record<SevenPlanetId, string>>
): number {
  const mt = MOOLATRIKONA[planet];
  if (
    isRasi &&
    mt &&
    mt.sign === signIndex &&
    degreeInSign >= mt.start &&
    degreeInSign < mt.end
  ) {
    return 45;
  }

  if (OWN_SIGNS[planet].includes(signIndex)) return 30;

  const relation = maitriMatrix[planet][SIGNS[signIndex].lord];
  switch (relation) {
    case 'Great Friend': return 20;
    case 'Friend': return 15;
    case 'Neutral': return 10;
    case 'Enemy': return 4;
    case 'Great Enemy': return 2;
    default: return 10;
  }
}

/**
 * BPHS Drik Bala for one target graha. Mercury and Jupiter contribute their
 * full sphuta aspect in addition to the quarter benefic/malefic adjustment.
 * Mercury is treated as malefic when joined in the same rashi with a natural
 * malefic (including a waning Moon or either node).
 */
export function computeDrikBalaForPlanet(
  targetId: SevenPlanetId,
  planets: BodyPosition[],
  isMoonWaxing: boolean
): number {
  const target = planets.find((p) => p.id === targetId);
  if (!target) return 0;

  const mercury = planets.find((p) => p.id === 'Mercury');
  const mercuryJoinedMalefic = Boolean(
    mercury &&
    planets.some((p) =>
      p.id !== 'Mercury' &&
      p.signIndex === mercury.signIndex &&
      (
        p.id === 'Sun' ||
        p.id === 'Mars' ||
        p.id === 'Saturn' ||
        p.id === 'Rahu' ||
        p.id === 'Ketu' ||
        (p.id === 'Moon' && !isMoonWaxing)
      )
    )
  );

  let total = 0;
  for (const otherId of SEVEN_PLANETS) {
    if (otherId === targetId) continue;
    const other = planets.find((p) => p.id === otherId);
    if (!other) continue;

    const otherBenefic =
      otherId === 'Jupiter' ||
      otherId === 'Venus' ||
      (otherId === 'Moon' && isMoonWaxing) ||
      (otherId === 'Mercury' && !mercuryJoinedMalefic);

    const angle = normalizeDeg(target.longitude - other.longitude);
    const aspect = parasharaAspectVirupas(otherId, angle);
    total += (otherBenefic ? 0.25 : -0.25) * aspect;

    if (otherId === 'Mercury' || otherId === 'Jupiter') {
      total += aspect;
    }
  }

  return total;
}

/**
 * Surya Siddhanta I.51–52 time lords, using the traditional Srishtyadi
 * Ahargana and 360-day year / 30-day month. The remainder is counted
 * from Sunday (1=Sun ... 7=Sat).
 */
export function computeSuryasiddhantaTimeLords(ahargana: number): {
  abdaLord: SevenPlanetId;
  masaLord: SevenPlanetId;
} {
  const dayOrder: SevenPlanetId[] = [
    'Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn',
  ];
  const yearRemainder = (((Math.floor(ahargana / 360) * 3 + 1) % 7) + 7) % 7;
  const monthRemainder = (((Math.floor(ahargana / 30) * 2 + 1) % 7) + 7) % 7;
  return {
    abdaLord: dayOrder[(yearRemainder + 6) % 7],
    masaLord: dayOrder[(monthRemainder + 6) % 7],
  };
}

const MEAN_EPOCH_UTC_MS = Date.UTC(1900, 0, 1);
const MEAN_EPOCH_LONGITUDE: Record<SevenPlanetId, number> = {
  Sun: 257.4568, Moon: 0, Mars: 270.22, Mercury: 164,
  Jupiter: 220.04, Venus: 328.51, Saturn: 236.74,
};
const MEAN_DAILY_MOTION: Record<SevenPlanetId, number> = {
  Sun: 0.9856, Moon: 0, Mars: 0.524, Mercury: 4.0923,
  Jupiter: 0.0831, Venus: 1.60215, Saturn: 0.033439,
};
const MEAN_LONGITUDE_CORRECTION: Record<SevenPlanetId, readonly [number, number, number]> = {
  Sun: [1, 0, 0], Moon: [1, 0, 0], Mars: [1, 0, 0],
  Mercury: [1, 6.67, -0.00133], Jupiter: [-1, 3.3, 0.0067],
  Venus: [-1, 5, 0.0001], Saturn: [1, 5, 0.001],
};

/**
 * Approximate sidereal mean longitude from the Ujjain 1900 mean-motion
 * epoch table. This is an explicit historical mean-motion model, not a
 * replacement for a full Surya Siddhanta or JPL mean-element ephemeris.
 */
export function computeMeanSiderealLongitude(
  planet: SevenPlanetId,
  utcMs: number,
  observerLongitudeDeg: number
): number {
  if (planet === 'Moon') return 0;
  const daysFromEpoch =
    (utcMs - MEAN_EPOCH_UTC_MS) / 86_400_000 +
    (76.0 - observerLongitudeDeg) / 360;
  const year = new Date(utcMs).getUTCFullYear();
  const yearsSinceEpoch = year - 1900;
  const [sign, constant, annual] = MEAN_LONGITUDE_CORRECTION[planet];
  const correction = sign * (constant + annual * yearsSinceEpoch);
  return normalizeDeg(
    MEAN_EPOCH_LONGITUDE[planet] +
    daysFromEpoch * MEAN_DAILY_MOTION[planet] +
    correction
  );
}

/** BPHS 27.24–25: mean/true longitude midpoint measured from the sighrocca. */
export function computeCheshtaBalaFromLongitudes(
  planet: SevenPlanetId,
  trueLongitude: number,
  meanPlanetLongitude: number,
  meanSunLongitude: number
): number {
  if (planet === 'Sun' || planet === 'Moon') return 0;
  const isInnerPlanet = planet === 'Mercury' || planet === 'Venus';
  const meanLongitude = isInnerPlanet ? meanSunLongitude : meanPlanetLongitude;
  const sighrocca = isInnerPlanet ? meanPlanetLongitude : meanSunLongitude;
  const signedDifference = normalizeDeg(trueLongitude - meanLongitude + 180) - 180;
  const midpoint = normalizeDeg(meanLongitude + signedDifference / 2);
  return angularDiffDeg(sighrocca, midpoint) / 3;
}

/**
 * BPHS Ch.28 ray-based Ishta/Kashta convention, normalizing the two
 * virupa inputs to the 0..7 rasmi scale before applying verse 6.
 * The Sun's Ishta input is its undoubled Ayana Bala.
 */
export function computeIshtaKashtaPhala(
  uchchaBala: number,
  cheshtaBala: number
): { ishtaPhala: number; kashtaPhala: number } {
  const uchchaRasmi = Math.max(0, Math.min(60, uchchaBala)) * 7 / 60;
  const cheshtaRasmi = Math.max(0, Math.min(60, cheshtaBala)) * 7 / 60;
  const ishtaPhala = Math.max(0, Math.min(60, 5 * (uchchaRasmi + cheshtaRasmi - 2)));
  return {
    ishtaPhala,
    kashtaPhala: 60 - ishtaPhala,
  };
}

/**
 * BPHS Graha Yuddha adjustment (Ch.27 v.20), using the BPHS winner
 * convention: Venus prevails when involved; otherwise the more northerly
 * graha (greater ecliptic latitude) wins. Only the five tara-grahas fight.
 *
 * Each pair's pre-war Shadbala difference is transferred to the winner
 * and deducted from the loser. Pair differences are calculated from the
 * unadjusted totals so results do not depend on iteration order.
 */
export function computeGrahaYuddhaAdjustments(
  planets: BodyPosition[],
  baseRows: ReadonlyArray<Pick<ShadbalaRow, 'planet' | 'totalVirupas'>>
): Record<SevenPlanetId, number> {
  const adjustments = Object.fromEntries(
    SEVEN_PLANETS.map((id) => [id, 0])
  ) as Record<SevenPlanetId, number>;
  const candidates: SevenPlanetId[] = ['Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
  const positions = new Map(
    planets.filter((p) => candidates.includes(p.id as SevenPlanetId))
      .map((p) => [p.id as SevenPlanetId, p])
  );
  const totals = new Map(baseRows.map((r) => [r.planet, r.totalVirupas]));

  for (let i = 0; i < candidates.length; i++) {
    for (let j = i + 1; j < candidates.length; j++) {
      const aId = candidates[i];
      const bId = candidates[j];
      const a = positions.get(aId);
      const b = positions.get(bId);
      if (!a || !b) continue;
      if (angularDiffDeg(a.longitude, b.longitude) > 1) continue;

      const winnerId: SevenPlanetId =
        aId === 'Venus' || bId === 'Venus'
          ? 'Venus'
          : a.latitude >= b.latitude ? aId : bId;
      const loserId = winnerId === aId ? bId : aId;
      const aTotal = totals.get(aId);
      const bTotal = totals.get(bId);
      if (aTotal === undefined || bTotal === undefined) continue;
      const transfer = Math.abs(aTotal - bTotal);
      adjustments[winnerId] += transfer;
      adjustments[loserId] -= transfer;
    }
  }

  return adjustments;
}

export function computeShadbala(params: {
  planets: BodyPosition[];
  ascendant: BodyPosition;
  mcLongitude: number;
  divisionalCharts: Record<DivisionalChartId, DivisionalChart>;
  maitriMatrix: Record<SevenPlanetId, Record<SevenPlanetId, string>>;
  utcMs: number;
  sunriseMs: number | null;
  sunsetMs: number | null;
  nextSunriseMs?: number | null;
  abdaLord: SevenPlanetId;
  masaLord: SevenPlanetId;
  varaLord: SevenPlanetId;
  horaLord: SevenPlanetId;
  obliquityDeg: number;
  observerLongitudeDeg: number;
}): ShadbalaRow[] {
  const {
    planets,
    ascendant,
    mcLongitude,
    divisionalCharts,
    maitriMatrix,
    utcMs,
    sunriseMs,
    sunsetMs,
    nextSunriseMs,
    abdaLord,
    masaLord,
    varaLord,
    horaLord,
    obliquityDeg,
    observerLongitudeDeg,
  } = params;

  const byId = new Map<SevenPlanetId, BodyPosition>();
  for (const p of planets) {
    if (SEVEN_PLANETS.includes(p.id as SevenPlanetId)) {
      byId.set(p.id as SevenPlanetId, p);
    }
  }

  const sun = byId.get('Sun')!;
  const moon = byId.get('Moon')!;
  const moonSunDiff = normalizeDeg(moon.longitude - sun.longitude);
  const pakshaAngle = moonSunDiff <= 180 ? moonSunDiff : 360 - moonSunDiff;
  const isMoonWaxing = moonSunDiff <= 180;

  const icLon = normalizeDeg(mcLongitude + 180);
  const dscLon = normalizeDeg(ascendant.longitude + 180);

  // Day/Night fraction for BPHS Natonnata (linear Nata/Unnata) & exact 1/3rd Tribhaga Bala
  const solarNoon = sunriseMs && sunsetMs ? (sunriseMs + sunsetMs) / 2 : utcMs;
  let dtNoon = (((utcMs - solarNoon) % 86_400_000) + 86_400_000) % 86_400_000;
  if (dtNoon > 43_200_000) dtNoon = 86_400_000 - dtNoon;
  const distFromMidnightNorm = 1 - dtNoon / 43_200_000;
  const isDayBirth = sunriseMs && sunsetMs ? utcMs >= sunriseMs && utcMs < sunsetMs : true;

  let activeTribhagaLord: SevenPlanetId = isDayBirth ? 'Sun' : 'Venus';
  if (sunriseMs !== null && sunsetMs !== null) {
    if (isDayBirth && sunsetMs > sunriseMs) {
      const partIdx = Math.min(2, Math.max(0, Math.floor(((utcMs - sunriseMs) / (sunsetMs - sunriseMs)) * 3)));
      activeTribhagaLord = (['Mercury', 'Sun', 'Saturn'] as SevenPlanetId[])[partIdx];
    } else if (!isDayBirth) {
      const nightEnd = nextSunriseMs && nextSunriseMs > sunsetMs ? nextSunriseMs : sunriseMs + 86_400_000;
      const nightLen = Math.max(1, nightEnd - sunsetMs);
      const partIdx = Math.min(2, Math.max(0, Math.floor(((utcMs - sunsetMs) / nightLen) * 3)));
      activeTribhagaLord = (['Moon', 'Venus', 'Mars'] as SevenPlanetId[])[partIdx];
    }
  }

  const saptaVargas: DivisionalChartId[] = ['D1', 'D2', 'D3', 'D7', 'D9', 'D12', 'D30'];
  const rows: ShadbalaRow[] = [];

  for (const pId of SEVEN_PLANETS) {
    const p = byId.get(pId)!;

    // 1. Sthana Bala
    const exPeak = EXALTATION_DEG[pId] ?? 0;
    const debPeak = normalizeDeg(exPeak + 180);
    const uchchaBala = angularDiffDeg(p.longitude, debPeak) / 3;

    let saptavargajaBala = 0;
    for (const vId of saptaVargas) {
      const pl = divisionalCharts[vId].placements.find((x) => x.id === pId);
      if (pl) {
        saptavargajaBala += computeSaptavargajaPoints(
          pId,
          pl.signIndex,
          pl.degreeInSign,
          vId === 'D1',
          maitriMatrix
        );
      }
    }

    const d9Sign = divisionalCharts.D9.placements.find((x) => x.id === pId)?.signIndex ?? p.signIndex;
    const isFemalePlanet = pId === 'Moon' || pId === 'Venus';
    const oddEvenCheck = (s: number) => (isFemalePlanet ? s % 2 === 1 : s % 2 === 0);
    const ojayugmaBala = (oddEvenCheck(p.signIndex) ? 15 : 0) + (oddEvenCheck(d9Sign) ? 15 : 0);

    const h = p.rasiHouseNumber;
    const kendradiBala = [1, 4, 7, 10].includes(h) ? 60 : [2, 5, 8, 11].includes(h) ? 30 : 15;

    const decanate = Math.floor(p.degreeInSign / 10); // 0, 1, 2
    let drekkanaBala = 0;
    if ((pId === 'Sun' || pId === 'Mars' || pId === 'Jupiter') && decanate === 0) drekkanaBala = 15;
    else if ((pId === 'Mercury' || pId === 'Saturn') && decanate === 1) drekkanaBala = 15;
    else if ((pId === 'Moon' || pId === 'Venus') && decanate === 2) drekkanaBala = 15;

    const sthanaBala = uchchaBala + saptavargajaBala + ojayugmaBala + kendradiBala + drekkanaBala;

    // 2. Dig Bala
    let zeroPoint = dscLon;
    if (pId === 'Sun' || pId === 'Mars') zeroPoint = icLon;
    else if (pId === 'Moon' || pId === 'Venus') zeroPoint = mcLongitude;
    else if (pId === 'Mercury' || pId === 'Jupiter') zeroPoint = dscLon;
    else if (pId === 'Saturn') zeroPoint = ascendant.longitude;
    const digBala = angularDiffDeg(p.longitude, zeroPoint) / 3;

    // 3. Kala Bala
    const natonnata =
      pId === 'Mercury'
        ? 60
        : pId === 'Sun' || pId === 'Jupiter' || pId === 'Venus'
          ? 60 * distFromMidnightNorm
          : 60 * (1 - distFromMidnightNorm);

    const pakshaBala = computePakshaBalaVirupas(pId, pakshaAngle, isMoonWaxing);

    const tribhagaBala = pId === 'Jupiter' || pId === activeTribhagaLord ? 60 : 0;

    const abdaMasaVaraHoraBala =
      (abdaLord === pId ? 15 : 0) +
      (masaLord === pId ? 30 : 0) +
      (varaLord === pId ? 45 : 0) +
      (horaLord === pId ? 60 : 0);

    // Ayana Bala uses the full ecliptic-to-equatorial declination transform,
    // including the planet's ecliptic latitude (not just longitude).
    const declDeg = computeEclipticDeclinationDeg(p.tropicalLongitude, p.latitude, obliquityDeg);
    const ayanaBalaRaw = computeAyanaBalaVirupas(pId, declDeg);
    // BPHS/Santhanam note: Sun's Ayana Bala is doubled; other planets are not.
    const ayanaBala = pId === 'Sun' ? ayanaBalaRaw * 2 : ayanaBalaRaw;

    // BPHS 27.24–25: derive Cheshta Kendra from mean/true longitude midpoint.
    const meanSunLongitude = computeMeanSiderealLongitude('Sun', utcMs, observerLongitudeDeg);
    const meanPlanetLongitude = computeMeanSiderealLongitude(pId, utcMs, observerLongitudeDeg);
    let cheshtaBala = pId === 'Sun'
      ? ayanaBala
      : pId === 'Moon'
        ? pakshaBala
        : computeCheshtaBalaFromLongitudes(
            pId,
            p.longitude,
            meanPlanetLongitude,
            meanSunLongitude
          );

    const kalaBala = natonnata + pakshaBala + tribhagaBala + abdaMasaVaraHoraBala + ayanaBala;

    // 5. Naisargika Bala
    const naisargikaBala = NAISARGIKA_BALA[pId];

    // 6. Drik Bala: full Mercury/Jupiter aspects plus quarter benefic/malefic drishti.
    const drikBala = computeDrikBalaForPlanet(pId, planets, isMoonWaxing);

    const totalVirupas = sthanaBala + digBala + kalaBala + cheshtaBala + naisargikaBala + drikBala;
    const totalRupas = totalVirupas / 60;
    const req = REQUIRED_RUPAS[pId];

    const { ishtaPhala, kashtaPhala } = computeIshtaKashtaPhala(
      uchchaBala,
      pId === 'Sun' ? ayanaBalaRaw : cheshtaBala
    );

    rows.push({
      planet: pId,
      sthanaBala: Math.round(sthanaBala * 10) / 10,
      digBala: Math.round(digBala * 10) / 10,
      kalaBala: Math.round(kalaBala * 10) / 10,
      cheshtaBala: Math.round(cheshtaBala * 10) / 10,
      naisargikaBala: Math.round(naisargikaBala * 10) / 10,
      drikBala: Math.round(drikBala * 10) / 10,
      yuddhaBala: 0,
      totalVirupas: Math.round(totalVirupas * 10) / 10,
      totalRupas: Math.round(totalRupas * 100) / 100,
      requiredRupas: req,
      ratio: Math.round((totalRupas / req) * 100) / 100,
      isStrong: totalRupas >= req,
      ishtaPhala: Math.round(ishtaPhala * 10) / 10,
      kashtaPhala: Math.round(kashtaPhala * 10) / 10,
    });
  }

  const yuddhaAdjustments = computeGrahaYuddhaAdjustments(planets, rows);
  return rows.map((row) => {
    const yuddhaBala = yuddhaAdjustments[row.planet];
    const totalVirupas = row.totalVirupas + yuddhaBala;
    const totalRupas = totalVirupas / 60;
    return {
      ...row,
      kalaBala: Math.round((row.kalaBala + yuddhaBala) * 10) / 10,
      yuddhaBala: Math.round(yuddhaBala * 10) / 10,
      totalVirupas: Math.round(totalVirupas * 10) / 10,
      totalRupas: Math.round(totalRupas * 100) / 100,
      ratio: Math.round((totalRupas / row.requiredRupas) * 100) / 100,
      isStrong: totalRupas >= row.requiredRupas,
    };
  });
}

export function getPlanetSignLabel(p: BodyPosition): string {
  return `${PLANET_SHORT[p.id]} (${SIGNS[p.signIndex].short})`;
}
