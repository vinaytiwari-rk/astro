import {
  CHARA_KARAKA_NAMES_7,
  CHARA_KARAKA_NAMES_8,
  DEBILITATION_SIGN,
  DIVISIONAL_META,
  EXALTATION_SIGN,
  MOOLATRIKONA,
  NAKSHATRAS,
  NATURAL_FRIENDSHIP,
  OWN_SIGNS,
  PLANET_SHORT,
  SEVEN_PLANETS,
  SIGNS,
  VIMSHOTTARI_ORDER,
  VIMSHOTTARI_YEARS,
} from './constants';
import { formatDms, normalizeDeg } from './time';
import type {
  BodyPosition,
  DignityLevel,
  DivisionalChart,
  DivisionalChartId,
  DivisionalPlacement,
  NineGrahaId,
  PlanetId,
  SevenPlanetId,
  SignPlacement,
} from './types';

export function computeKpSubLord(siderealLon: number): NineGrahaId {
  const lon = normalizeDeg(siderealLon);
  const nakSpan = 360 / 27; // 13.333333...°
  const nakIndex = Math.floor(lon / nakSpan) % 27;
  const nakOffset = lon - nakIndex * nakSpan;
  const nakLord = NAKSHATRAS[nakIndex].lord;
  const startIdx = VIMSHOTTARI_ORDER.indexOf(nakLord);

  let acc = 0;
  for (let i = 0; i < 9; i++) {
    const lord = VIMSHOTTARI_ORDER[(startIdx + i) % 9];
    const span = (VIMSHOTTARI_YEARS[lord] / 120) * nakSpan;
    acc += span;
    if (nakOffset < acc + 1e-10) {
      return lord;
    }
  }
  return nakLord;
}

export function buildSignPlacement(siderealLon: number): SignPlacement {
  const longitude = normalizeDeg(siderealLon);
  const signIndex = Math.floor(longitude / 30) % 12;
  const degreeInSign = longitude - signIndex * 30;
  const signInfo = SIGNS[signIndex];
  const nakSpan = 360 / 27;
  const nakshatraIndex = Math.floor(longitude / nakSpan) % 27;
  const padaSpan = nakSpan / 4;
  const pada = (Math.floor((longitude - nakshatraIndex * nakSpan) / padaSpan) % 4) + 1;
  const nakInfo = NAKSHATRAS[nakshatraIndex];

  return {
    longitude,
    signIndex,
    signName: signInfo.name,
    sanskritName: signInfo.sanskrit,
    degreeInSign,
    dms: formatDms(degreeInSign, true),
    shortDms: formatDms(degreeInSign, false),
    nakshatraIndex,
    nakshatraName: nakInfo.name,
    pada,
    nakshatraLord: nakInfo.lord,
    signLord: signInfo.lord,
    subLord: computeKpSubLord(longitude),
  };
}

/**
 * Computes the sign index (0..11) for a given sidereal longitude in a Divisional Chart (D1..D60).
 * Implements classical BPHS / Jagannatha Hora rules.
 */
export function getDivisionalSignIndex(
  siderealLon: number,
  varga: DivisionalChartId,
  horaMode: 'parashara' | 'samasaptama' = 'parashara'
): number {
  const lon = normalizeDeg(siderealLon);
  const sign = Math.floor(lon / 30) % 12;
  const deg = lon - sign * 30;
  const isOdd = sign % 2 === 0; // Aries (0) is 1st (odd)
  const mod = sign % 3; // 0=Movable, 1=Fixed, 2=Dual
  const elem = sign % 4; // 0=Fire, 1=Earth, 2=Air, 3=Water

  switch (varga) {
    case 'D1':
      return sign;

    case 'D2': {
      const part = deg < 15 ? 0 : 1;
      if (horaMode === 'samasaptama') {
        return part === 0 ? sign : (sign + 6) % 12;
      }
      // Parashari Hora: Sun = Leo (4), Moon = Cancer (3)
      if (isOdd) return part === 0 ? 4 : 3;
      return part === 0 ? 3 : 4;
    }

    case 'D3': {
      const part = Math.min(2, Math.floor(deg / 10));
      return (sign + part * 4) % 12;
    }

    case 'D4': {
      const part = Math.min(3, Math.floor(deg / 7.5));
      return (sign + part * 3) % 12;
    }

    case 'D5': {
      const part = Math.min(4, Math.floor(deg / 6));
      const oddSeq = [0, 10, 8, 2, 6];
      const evenSeq = [1, 5, 11, 9, 7];
      return isOdd ? oddSeq[part] : evenSeq[part];
    }

    case 'D6': {
      const part = Math.min(5, Math.floor(deg / 5));
      return ((isOdd ? 0 : 6) + part) % 12;
    }

    case 'D7': {
      const part = Math.min(6, Math.floor((deg * 7) / 30));
      const start = isOdd ? sign : (sign + 6) % 12;
      return (start + part) % 12;
    }

    case 'D8': {
      const part = Math.min(7, Math.floor((deg * 8) / 30));
      const start = mod === 0 ? 0 : mod === 1 ? 8 : 4;
      return (start + part) % 12;
    }

    case 'D9': {
      const part = Math.min(8, Math.floor((deg * 9) / 30));
      const startMap = [0, 9, 6, 3]; // Fire->Ari, Earth->Cap, Air->Lib, Water->Can
      return (startMap[elem] + part) % 12;
    }

    case 'D10': {
      const part = Math.min(9, Math.floor(deg / 3));
      const start = isOdd ? sign : (sign + 8) % 12;
      return (start + part) % 12;
    }

    case 'D11': {
      const part = Math.min(10, Math.floor((deg * 11) / 30));
      const start = (12 - sign) % 12;
      return (start + part) % 12;
    }

    case 'D12': {
      const part = Math.min(11, Math.floor(deg / 2.5));
      return (sign + part) % 12;
    }

    case 'D16': {
      const part = Math.min(15, Math.floor((deg * 16) / 30));
      const start = mod * 4; // Movable->Ari(0), Fixed->Leo(4), Dual->Sag(8)
      return (start + part) % 12;
    }

    case 'D20': {
      const part = Math.min(19, Math.floor(deg / 1.5));
      const start = mod === 0 ? 0 : mod === 1 ? 8 : 4;
      return (start + part) % 12;
    }

    case 'D24': {
      const part = Math.min(23, Math.floor((deg * 24) / 30));
      const start = isOdd ? 4 : 3;
      return (start + part) % 12;
    }

    case 'D27': {
      const part = Math.min(26, Math.floor((deg * 27) / 30));
      const start = elem * 3; // Fire->0, Earth->3, Air->6, Water->9
      return (start + part) % 12;
    }

    case 'D30': {
      if (isOdd) {
        if (deg < 5) return 0;   // Aries (Mars)
        if (deg < 10) return 10; // Aquarius (Saturn)
        if (deg < 18) return 8;  // Sagittarius (Jupiter)
        if (deg < 25) return 2;  // Gemini (Mercury)
        return 6;                // Libra (Venus)
      }
      if (deg < 5) return 1;     // Taurus (Venus)
      if (deg < 12) return 5;    // Virgo (Mercury)
      if (deg < 20) return 11;   // Pisces (Jupiter)
      if (deg < 25) return 9;    // Capricorn (Saturn)
      return 7;                  // Scorpio (Mars)
    }

    case 'D40': {
      const part = Math.min(39, Math.floor((deg * 40) / 30));
      const start = isOdd ? 0 : 6;
      return (start + part) % 12;
    }

    case 'D45': {
      const part = Math.min(44, Math.floor((deg * 45) / 30));
      const start = mod * 4;
      return (start + part) % 12;
    }

    case 'D60': {
      const part = Math.min(59, Math.floor(deg * 2));
      return (sign + part) % 12;
    }
  }
}

/**
 * Computes the effective longitude inside a divisional chart (preserving sub-degree progression within 30°)
 * so Nakshatra/Pada or chart sorting can optionally inspect it.
 */
export function getDivisionalLongitude(
  siderealLon: number,
  varga: DivisionalChartId,
  horaMode: 'parashara' | 'samasaptama' = 'parashara'
): number {
  const meta = DIVISIONAL_META.find((m) => m.id === varga)!;
  const vargaSign = getDivisionalSignIndex(siderealLon, varga, horaMode);
  const degInSign = normalizeDeg(siderealLon) % 30;
  const subFrac = ((degInSign * meta.division) / 30) % 1;
  return vargaSign * 30 + subFrac * 30;
}

/**
 * Computes Panchadha Maitri (5-fold friendship) between planets in Rasi (D1).
 */
export function computeMaitriMatrix(
  rasiSignByPlanet: Record<SevenPlanetId, number>
): Record<SevenPlanetId, Record<SevenPlanetId, string>> {
  const result = {} as Record<SevenPlanetId, Record<SevenPlanetId, string>>;
  for (const p1 of SEVEN_PLANETS) {
    result[p1] = {} as Record<SevenPlanetId, string>;
    const s1 = rasiSignByPlanet[p1];
    for (const p2 of SEVEN_PLANETS) {
      if (p1 === p2) {
        result[p1][p2] = 'Self';
        continue;
      }
      const s2 = rasiSignByPlanet[p2];
      const diff = ((s2 - s1 + 12) % 12) + 1; // 1..12
      const tempFriend = [2, 3, 4, 10, 11, 12].includes(diff) ? 1 : -1;
      const nat = NATURAL_FRIENDSHIP[p1][p2];
      const total = nat + tempFriend;
      if (total === 2) result[p1][p2] = 'Great Friend';
      else if (total === 1) result[p1][p2] = 'Friend';
      else if (total === 0) result[p1][p2] = 'Neutral';
      else if (total === -1) result[p1][p2] = 'Enemy';
      else result[p1][p2] = 'Great Enemy';
    }
  }
  return result;
}

export function evaluateDignity(
  id: PlanetId | 'Asc',
  signIndex: number,
  degreeInSign: number,
  maitriMatrix?: Record<SevenPlanetId, Record<SevenPlanetId, string>>
): DignityLevel {
  if (id === 'Asc' || id === 'Uranus' || id === 'Neptune' || id === 'Pluto') {
    return '-';
  }

  const graha = id as NineGrahaId;
  if (EXALTATION_SIGN[graha] === signIndex) return 'Exalted';
  if (DEBILITATION_SIGN[graha] === signIndex) return 'Debilitated';

  if (graha === 'Rahu' || graha === 'Ketu') {
    return OWN_SIGNS[graha].includes(signIndex) ? 'Own Sign' : '-';
  }

  const planet = graha as SevenPlanetId;
  const mt = MOOLATRIKONA[planet];
  if (mt && mt.sign === signIndex && degreeInSign >= mt.start && degreeInSign < mt.end) {
    return 'Moolatrikona';
  }
  if (OWN_SIGNS[planet].includes(signIndex)) {
    return 'Own Sign';
  }

  const lord = SIGNS[signIndex].lord;
  if (maitriMatrix) {
    return (maitriMatrix[planet][lord] as DignityLevel) || 'Neutral';
  }
  const nat = NATURAL_FRIENDSHIP[planet][lord];
  if (nat === 1) return 'Friend';
  if (nat === -1) return 'Enemy';
  return 'Neutral';
}

export function assignCharaKarakas(
  planets: BodyPosition[],
  karakaCount: 7 | 8
): Map<PlanetId, string> {
  const candidates = planets.filter((p) =>
    karakaCount === 8
      ? [...SEVEN_PLANETS, 'Rahu'].includes(p.id)
      : SEVEN_PLANETS.includes(p.id as SevenPlanetId)
  );

  // For Rahu (which moves retrograde), Jaimini uses (30 - degreeInSign)
  const sorted = [...candidates].sort((a, b) => {
    const degA = a.id === 'Rahu' ? 30 - a.degreeInSign : a.degreeInSign;
    const degB = b.id === 'Rahu' ? 30 - b.degreeInSign : b.degreeInSign;
    return degB - degA;
  });

  const labels = karakaCount === 8 ? CHARA_KARAKA_NAMES_8 : CHARA_KARAKA_NAMES_7;
  const map = new Map<PlanetId, string>();
  sorted.forEach((p, idx) => {
    if (idx < labels.length) {
      map.set(p.id as PlanetId, labels[idx]);
    }
  });
  return map;
}

export function buildAllDivisionalCharts(
  ascendant: BodyPosition,
  planets: BodyPosition[],
  maitriMatrix: Record<SevenPlanetId, Record<SevenPlanetId, string>>,
  horaMode: 'parashara' | 'samasaptama'
): Record<DivisionalChartId, DivisionalChart> {
  const charts = {} as Record<DivisionalChartId, DivisionalChart>;

  for (const meta of DIVISIONAL_META) {
    const lagnaSignIndex = getDivisionalSignIndex(ascendant.longitude, meta.id, horaMode);
    const lagnaLon = getDivisionalLongitude(ascendant.longitude, meta.id, horaMode);
    const lagnaPlacement: DivisionalPlacement = {
      ...buildSignPlacement(lagnaLon),
      signIndex: lagnaSignIndex,
      signName: SIGNS[lagnaSignIndex].name,
      sanskritName: SIGNS[lagnaSignIndex].sanskrit,
      signLord: SIGNS[lagnaSignIndex].lord,
      id: 'Asc',
      shortLabel: PLANET_SHORT.Asc,
      houseFromVargaLagna: 1,
      isRetrograde: false,
      isCombust: false,
      dignity: '-',
    };

    const placements: DivisionalPlacement[] = [lagnaPlacement];
    for (const p of planets) {
      const signIndex = getDivisionalSignIndex(p.longitude, meta.id, horaMode);
      const vLon = getDivisionalLongitude(p.longitude, meta.id, horaMode);
      const base = buildSignPlacement(vLon);
      const houseFromVargaLagna = ((signIndex - lagnaSignIndex + 12) % 12) + 1;
      const dignity = evaluateDignity(p.id, signIndex, base.degreeInSign, maitriMatrix);

      placements.push({
        ...base,
        signIndex,
        signName: SIGNS[signIndex].name,
        sanskritName: SIGNS[signIndex].sanskrit,
        signLord: SIGNS[signIndex].lord,
        id: p.id,
        shortLabel: p.shortLabel,
        houseFromVargaLagna,
        isRetrograde: p.isRetrograde,
        isCombust: p.isCombust,
        dignity,
      });
    }

    charts[meta.id] = {
      id: meta.id,
      name: meta.name,
      sanskritName: meta.sanskritName,
      signification: meta.signification,
      lagnaSignIndex,
      placements,
    };
  }

  return charts;
}

/**
 * Computes Vimshopaka Bala (out of 20) across the Shodasavarga (16 classical divisions).
 */
export function computeVimshopakaShodash(
  charts: Record<DivisionalChartId, DivisionalChart>,
  maitriMatrix: Record<SevenPlanetId, Record<SevenPlanetId, string>>
): Record<NineGrahaId, number> {
  const weights: Array<[DivisionalChartId, number]> = [
    ['D1', 3.5], ['D2', 1], ['D3', 1], ['D4', 0.5],
    ['D7', 0.5], ['D9', 3], ['D10', 0.5], ['D12', 0.5],
    ['D16', 2], ['D20', 0.5], ['D24', 0.5], ['D27', 0.5],
    ['D30', 1], ['D40', 0.5], ['D45', 0.5], ['D60', 4],
  ];
  const scoreMap: Record<DignityLevel, number> = {
    Exalted: 1,
    Moolatrikona: 0.95,
    'Own Sign': 0.9,
    'Great Friend': 0.75,
    Friend: 0.65,
    Neutral: 0.5,
    Enemy: 0.35,
    'Great Enemy': 0.25,
    Debilitated: 0.15,
    '-': 0.5,
  };

  const out = {} as Record<NineGrahaId, number>;
  const nine: NineGrahaId[] = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

  for (const g of nine) {
    let total = 0;
    for (const [vId, w] of weights) {
      const pl = charts[vId].placements.find((x) => x.id === g);
      if (!pl) continue;
      const dig = evaluateDignity(g, pl.signIndex, pl.degreeInSign, maitriMatrix);
      total += w * (scoreMap[dig] ?? 0.5);
    }
    out[g] = Math.round(total * 100) / 100;
  }
  return out;
}
