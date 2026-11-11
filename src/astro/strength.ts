import {
  EXALTATION_DEG,
  PLANET_SHORT,
  SEVEN_PLANETS,
  SIGNS,
} from './constants';
import { angularDiffDeg, normalizeDeg } from './time';
import type {
  AspectInfo,
  BodyPosition,
  DignityLevel,
  DivisionalChart,
  DivisionalChartId,
  PlanetId,
  SevenPlanetId,
  ShadbalaRow,
} from './types';
import { evaluateDignity } from './vargas';

const NAISARGIKA_BALA: Record<SevenPlanetId, number> = {
  Sun: 60.0,
  Moon: 51.43,
  Venus: 42.86,
  Jupiter: 34.29,
  Mercury: 25.71,
  Mars: 17.14,
  Saturn: 8.57,
};

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
  varaLord: SevenPlanetId;
  horaLord: SevenPlanetId;
  obliquityDeg: number;
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
    varaLord,
    horaLord,
    obliquityDeg,
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
  const isMoonWaxing = moonSunDiff < 180;

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
  const saptaScore: Record<DignityLevel, number> = {
    Exalted: 30,
    Moolatrikona: 45,
    'Own Sign': 30,
    'Great Friend': 22.5,
    Friend: 15,
    Neutral: 7.5,
    Enemy: 3.75,
    'Great Enemy': 1.875,
    Debilitated: 1.875,
    '-': 7.5,
  };

  const maxSpeedRef: Record<SevenPlanetId, number> = {
    Sun: 1.02,
    Moon: 15.0,
    Mars: 0.78,
    Mercury: 2.15,
    Jupiter: 0.24,
    Venus: 1.26,
    Saturn: 0.13,
  };

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
        const dig = evaluateDignity(pId, pl.signIndex, pl.degreeInSign, maitriMatrix);
        saptavargajaBala += saptaScore[dig] ?? 7.5;
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

    const isNaturalBenefic = pId === 'Jupiter' || pId === 'Venus' || pId === 'Mercury' || (pId === 'Moon' && isMoonWaxing);
    const pakshaBase = isNaturalBenefic ? pakshaAngle / 3 : (180 - pakshaAngle) / 3;
    const pakshaBala = pId === 'Moon' ? pakshaBase * 2 : pakshaBase;

    const tribhagaBala = pId === 'Jupiter' || pId === activeTribhagaLord ? 60 : 0;

    const varaHoraBala = (varaLord === pId ? 45 : 0) + (horaLord === pId ? 60 : 0);

    // Ayana Bala from tropical declination approximation: sin(dec) = sin(obliq)*sin(tropLon)
    const tropRad = (p.tropicalLongitude * Math.PI) / 180;
    const oblRad = (obliquityDeg * Math.PI) / 180;
    const declDeg = (Math.asin(Math.sin(oblRad) * Math.sin(tropRad)) * 180) / Math.PI;
    const northFavored = pId === 'Sun' || pId === 'Mars' || pId === 'Jupiter' || pId === 'Venus';
    const southFavored = pId === 'Moon' || pId === 'Saturn';
    const ayanaBala =
      pId === 'Mercury'
        ? 30 + Math.abs(declDeg) * 1.25
        : northFavored
          ? Math.max(0, Math.min(60, 30 + declDeg * 1.25))
          : southFavored
            ? Math.max(0, Math.min(60, 30 - declDeg * 1.25))
            : 30;

    const kalaBala = natonnata + pakshaBala + tribhagaBala + varaHoraBala + ayanaBala;

    // 4. Cheshta Bala
    let cheshtaBala = 30;
    if (pId === 'Sun') cheshtaBala = ayanaBala;
    else if (pId === 'Moon') cheshtaBala = pakshaAngle / 3;
    else {
      if (p.isRetrograde) {
        cheshtaBala = 50 + Math.min(10, Math.abs(p.speedDegPerDay) * 10);
      } else {
        const ratio = Math.min(1, Math.max(0, p.speedDegPerDay / maxSpeedRef[pId]));
        cheshtaBala = 45 * (1 - ratio) + 10;
      }
    }

    // 5. Naisargika Bala
    const naisargikaBala = NAISARGIKA_BALA[pId];

    // 6. Drik Bala
    let drikSum = 0;
    for (const otherId of SEVEN_PLANETS) {
      if (otherId === pId) continue;
      const other = byId.get(otherId)!;
      const d = normalizeDeg(p.longitude - other.longitude);
      const vir = parasharaAspectVirupas(otherId, d);
      const otherBenefic =
        otherId === 'Jupiter' ||
        otherId === 'Venus' ||
        (otherId === 'Moon' && isMoonWaxing) ||
        otherId === 'Mercury';
      drikSum += (otherBenefic ? 0.25 : -0.25) * vir;
    }
    const drikBala = drikSum;

    const totalVirupas = sthanaBala + digBala + kalaBala + cheshtaBala + naisargikaBala + drikBala;
    const totalRupas = totalVirupas / 60;
    const req = REQUIRED_RUPAS[pId];

    const ishtaPhala = Math.sqrt(Math.max(0, uchchaBala) * Math.max(0, cheshtaBala));
    const kashtaPhala = Math.sqrt(Math.max(0, 60 - uchchaBala) * Math.max(0, 60 - cheshtaBala));

    rows.push({
      planet: pId,
      sthanaBala: Math.round(sthanaBala * 10) / 10,
      digBala: Math.round(digBala * 10) / 10,
      kalaBala: Math.round(kalaBala * 10) / 10,
      cheshtaBala: Math.round(cheshtaBala * 10) / 10,
      naisargikaBala: Math.round(naisargikaBala * 10) / 10,
      drikBala: Math.round(drikBala * 10) / 10,
      totalVirupas: Math.round(totalVirupas * 10) / 10,
      totalRupas: Math.round(totalRupas * 100) / 100,
      requiredRupas: req,
      ratio: Math.round((totalRupas / req) * 100) / 100,
      isStrong: totalRupas >= req,
      ishtaPhala: Math.round(ishtaPhala * 10) / 10,
      kashtaPhala: Math.round(kashtaPhala * 10) / 10,
    });
  }

  return rows;
}

export function getPlanetSignLabel(p: BodyPosition): string {
  return `${PLANET_SHORT[p.id]} (${SIGNS[p.signIndex].short})`;
}
