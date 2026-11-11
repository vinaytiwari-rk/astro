import * as Astronomy from 'astronomy-engine';
import { NAKSHATRAS, NINE_GRAHAS, SIGNS, VARA_INFO, VIMSHOTTARI_ORDER, VIMSHOTTARI_YEARS } from './constants';
import { computeAscendantAndMcTropical, computeAyanamsaDeg } from './ephemeris';
import { formatDms, formatLocalDateTimeFromUtc, normalizeDeg } from './time';
import type { ChartData, NineGrahaId, SevenPlanetId } from './types';
import { computeKpSubLord } from './vargas';

export interface KpCuspInfo {
  house: number;
  longitude: number;
  signName: string;
  dms: string;
  signLord: SevenPlanetId;
  starLord: NineGrahaId;
  subLord: NineGrahaId;
  subSubLord: NineGrahaId;
}

export interface KpPlanetRow {
  planet: NineGrahaId;
  longitude: number;
  signName: string;
  dms: string;
  kpHouse: number;
  signLord: SevenPlanetId;
  starLord: NineGrahaId;
  subLord: NineGrahaId;
  subSubLord: NineGrahaId;
  signifiesHouses: number[];
}

export interface KpHouseSignificators {
  house: number;
  levelA: NineGrahaId[]; // Planets in star of occupants
  levelB: NineGrahaId[]; // Occupants
  levelC: NineGrahaId[]; // Planets in star of house lord
  levelD: NineGrahaId[]; // House lord
  allSignificators: NineGrahaId[];
}

export interface KpEventAnalysis {
  topic: string;
  cusp: number;
  cuspalSubLord: NineGrahaId;
  targetHouses: number[];
  subLordSignifies: number[];
  matchedHouses: number[];
  verdict: 'Strong Promise' | 'Moderate Promise' | 'Delayed / Effort Needed';
  reading: string;
}

export interface KpNadiRow {
  planet: NineGrahaId;
  planetHouses: number[];
  starLord: NineGrahaId;
  starLordHouses: number[];
  subLord: NineGrahaId;
  subLordHouses: number[];
}

export interface KpRulingPlanets {
  timestampLocal: string;
  dayLord: SevenPlanetId;
  lagnaSignLord: SevenPlanetId;
  lagnaStarLord: NineGrahaId;
  lagnaSubLord: NineGrahaId;
  moonSignLord: SevenPlanetId;
  moonStarLord: NineGrahaId;
  moonSubLord: NineGrahaId;
  rulingPlanets: NineGrahaId[];
}

export interface KpReport {
  kpAyanamsaDms: string;
  cusps: KpCuspInfo[];
  planets: KpPlanetRow[];
  houseSignificators: KpHouseSignificators[];
  events: KpEventAnalysis[];
  nakshatraNadi: KpNadiRow[];
  chartRulingPlanets: KpRulingPlanets;
}

export function computeSubSubLord(siderealLon: number): NineGrahaId {
  const lon = normalizeDeg(siderealLon);
  const nakSpan = 360 / 27;
  const nakIdx = Math.floor(lon / nakSpan) % 27;
  const nakOffset = lon - nakIdx * nakSpan;
  const nakLord = NAKSHATRAS[nakIdx].lord;
  const startIdx = VIMSHOTTARI_ORDER.indexOf(nakLord);

  let acc = 0;
  for (let i = 0; i < 9; i++) {
    const subLord = VIMSHOTTARI_ORDER[(startIdx + i) % 9];
    const subSpan = (VIMSHOTTARI_YEARS[subLord] / 120) * nakSpan;
    if (nakOffset < acc + subSpan + 1e-10) {
      const subOffset = Math.max(0, nakOffset - acc);
      const sslStartIdx = VIMSHOTTARI_ORDER.indexOf(subLord);
      let sAcc = 0;
      for (let j = 0; j < 9; j++) {
        const ssl = VIMSHOTTARI_ORDER[(sslStartIdx + j) % 9];
        const sslSpan = (VIMSHOTTARI_YEARS[ssl] / 120) * subSpan;
        sAcc += sslSpan;
        if (subOffset < sAcc + 1e-10) return ssl;
      }
      return subLord;
    }
    acc += subSpan;
  }
  return nakLord;
}

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
    c1,
    c2,
    c3,
    normalizeDeg(c10 + 180),
    normalizeDeg(c11 + 180),
    normalizeDeg(c12 + 180),
    normalizeDeg(c1 + 180),
    normalizeDeg(c2 + 180),
    normalizeDeg(c3 + 180),
    c10,
    c11,
    c12,
  ];
}

function findKpHouse(lonSid: number, cuspsSid: number[]): number {
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

export function computeKpReport(chart: ChartData): KpReport {
  const time = new Astronomy.AstroTime(new Date(chart.utcMs));
  const kpAyan = computeAyanamsaDeg(time, 'kp');
  const activeAyan = chart.ayanamsaDeg;

  const cuspsTrop = computePlacidusCuspsTropical(time, chart.input.latitude, chart.input.longitude);
  const cuspsSid = cuspsTrop.map((c) => normalizeDeg(c - kpAyan));

  const cusps: KpCuspInfo[] = cuspsSid.map((lon, idx) => {
    const signIdx = Math.floor(lon / 30) % 12;
    const nakIdx = Math.floor(lon / (360 / 27)) % 27;
    return {
      house: idx + 1,
      longitude: lon,
      signName: SIGNS[signIdx].name,
      dms: formatDms(lon % 30),
      signLord: SIGNS[signIdx].lord,
      starLord: NAKSHATRAS[nakIdx].lord,
      subLord: computeKpSubLord(lon),
      subSubLord: computeSubSubLord(lon),
    };
  });

  // Re-reference planets cleanly to KP ayanamsa
  const planetLons = new Map<NineGrahaId, number>();
  for (const g of NINE_GRAHAS) {
    const body = chart.planets.find((p) => p.id === g)!;
    const kpLon = normalizeDeg(body.longitude + activeAyan - kpAyan);
    planetLons.set(g, kpLon);
  }

  const planetHouse = new Map<NineGrahaId, number>();
  const planetStarLord = new Map<NineGrahaId, NineGrahaId>();
  const planetSubLord = new Map<NineGrahaId, NineGrahaId>();
  const planetSsl = new Map<NineGrahaId, NineGrahaId>();

  for (const g of NINE_GRAHAS) {
    const lon = planetLons.get(g)!;
    planetHouse.set(g, findKpHouse(lon, cuspsSid));
    const nakIdx = Math.floor(lon / (360 / 27)) % 27;
    planetStarLord.set(g, NAKSHATRAS[nakIdx].lord);
    planetSubLord.set(g, computeKpSubLord(lon));
    planetSsl.set(g, computeSubSubLord(lon));
  }

  // Houses owned by each planet (via cusp sign lords)
  const housesOwned = new Map<NineGrahaId, number[]>();
  for (const g of NINE_GRAHAS) housesOwned.set(g, []);
  for (const c of cusps) {
    housesOwned.get(c.signLord)!.push(c.house);
  }

  // 4-Fold Significators for each house
  const houseSignificators: KpHouseSignificators[] = cusps.map((c) => {
    const occupants = NINE_GRAHAS.filter((g) => planetHouse.get(g) === c.house);
    const owner = c.signLord;
    const levelA = NINE_GRAHAS.filter((g) => occupants.includes(planetStarLord.get(g)!));
    const levelB = [...occupants];
    const levelC = NINE_GRAHAS.filter((g) => planetStarLord.get(g) === owner);
    const levelD: NineGrahaId[] = [owner];

    const merged = Array.from(new Set([...levelA, ...levelB, ...levelC, ...levelD]));
    return {
      house: c.house,
      levelA,
      levelB,
      levelC,
      levelD,
      allSignificators: merged,
    };
  });

  // Planet -> Houses signified (via star lord + self occupancy/ownership)
  const planets: KpPlanetRow[] = NINE_GRAHAS.map((g) => {
    const lon = planetLons.get(g)!;
    const signIdx = Math.floor(lon / 30) % 12;
    const sl = planetStarLord.get(g)!;
    const sigSet = new Set<number>([
      planetHouse.get(sl)!,
      ...(housesOwned.get(sl) ?? []),
      planetHouse.get(g)!,
      ...(housesOwned.get(g) ?? []),
    ]);

    return {
      planet: g,
      longitude: lon,
      signName: SIGNS[signIdx].name,
      dms: formatDms(lon % 30),
      kpHouse: planetHouse.get(g)!,
      signLord: SIGNS[signIdx].lord,
      starLord: sl,
      subLord: planetSubLord.get(g)!,
      subSubLord: planetSsl.get(g)!,
      signifiesHouses: Array.from(sigSet).sort((a, b) => a - b),
    };
  });

  // KP Cuspal Sub-Lord Event Promises
  const planetRowMap = new Map(planets.map((r) => [r.planet, r]));
  const eventSpecs: Array<{ topic: string; cusp: number; targets: number[] }> = [
    { topic: 'Wealth & Finance', cusp: 2, targets: [2, 6, 11] },
    { topic: 'Education & Learning', cusp: 4, targets: [4, 9, 11] },
    { topic: 'Property & Vehicle', cusp: 4, targets: [4, 11, 12] },
    { topic: 'Marriage & Partnership', cusp: 7, targets: [2, 7, 11] },
    { topic: 'Career & Profession', cusp: 10, targets: [2, 6, 10, 11] },
    { topic: 'Foreign Travel / Residence', cusp: 9, targets: [3, 9, 12] },
  ];

  const events: KpEventAnalysis[] = eventSpecs.map((spec) => {
    const cuspInfo = cusps[spec.cusp - 1];
    const subLord = cuspInfo.subLord;
    const sigHouses = planetRowMap.get(subLord)?.signifiesHouses ?? [];
    const matched = spec.targets.filter((h) => sigHouses.includes(h));
    const hasNegation =
      spec.cusp === 7 && matched.length < 2 && (sigHouses.includes(6) || sigHouses.includes(10));

    const verdict: KpEventAnalysis['verdict'] =
      matched.length >= 2 && !hasNegation
        ? 'Strong Promise'
        : matched.length >= 1
          ? 'Moderate Promise'
          : 'Delayed / Effort Needed';

    const reading =
      verdict === 'Strong Promise'
        ? `${spec.cusp}th Cuspal Sub-Lord ${subLord} strongly signifies houses ${matched.join(', ')}, promising clear progress during connected Dashas.`
        : verdict === 'Moderate Promise'
          ? `${spec.cusp}th Cuspal Sub-Lord ${subLord} links to house ${matched.join(', ')}; outcomes materialize with persistent timing.`
          : `${spec.cusp}th Cuspal Sub-Lord ${subLord} emphasizes houses ${sigHouses.join(', ')} rather than primary ${spec.targets.join('/')}, favoring patience and indirect routes.`;

    return {
      topic: spec.topic,
      cusp: spec.cusp,
      cuspalSubLord: subLord,
      targetHouses: spec.targets,
      subLordSignifies: sigHouses,
      matchedHouses: matched,
      verdict,
      reading,
    };
  });

  // Nakshatra Nadi (Planet / StarLord / SubLord house links)
  const selfHouseMap = (g: NineGrahaId): number[] =>
    Array.from(new Set([planetHouse.get(g)!, ...(housesOwned.get(g) ?? [])])).sort((a, b) => a - b);

  const nakshatraNadi: KpNadiRow[] = planets.map((p) => ({
    planet: p.planet,
    planetHouses: selfHouseMap(p.planet),
    starLord: p.starLord,
    starLordHouses: selfHouseMap(p.starLord),
    subLord: p.subLord,
    subLordHouses: selfHouseMap(p.subLord),
  }));

  const lagnaCusp = cusps[0];
  const moonKpLon = planetLons.get('Moon')!;
  const moonSignIdx = Math.floor(moonKpLon / 30) % 12;
  const moonNakIdx = Math.floor(moonKpLon / (360 / 27)) % 27;
  const localDay = new Date(chart.utcMs + chart.offsetMinutesUsed * 60_000).getUTCDay();
  const dayLord = VARA_INFO[localDay].lord;
  const moonSignLord = SIGNS[moonSignIdx].lord;
  const moonStarLord = NAKSHATRAS[moonNakIdx].lord;
  const moonSubLord = computeKpSubLord(moonKpLon);
  const rpList = Array.from(
    new Set<NineGrahaId>([
      lagnaCusp.starLord,
      lagnaCusp.signLord,
      lagnaCusp.subLord,
      moonStarLord,
      moonSignLord,
      moonSubLord,
      dayLord,
    ])
  );

  return {
    kpAyanamsaDms: formatDms(kpAyan),
    cusps,
    planets,
    houseSignificators,
    events,
    nakshatraNadi,
    chartRulingPlanets: {
      timestampLocal: formatLocalDateTimeFromUtc(chart.utcMs, chart.offsetMinutesUsed),
      dayLord,
      lagnaSignLord: lagnaCusp.signLord,
      lagnaStarLord: lagnaCusp.starLord,
      lagnaSubLord: lagnaCusp.subLord,
      moonSignLord,
      moonStarLord,
      moonSubLord,
      rulingPlanets: rpList,
    },
  };
}

export function computeLiveKpRulingPlanets(
  utcMs: number,
  offsetMinutes: number,
  latitude: number,
  longitude: number
): KpRulingPlanets {
  const time = new Astronomy.AstroTime(new Date(utcMs));
  const kpAyan = computeAyanamsaDeg(time, 'kp');
  const { asc } = computeAscendantAndMcTropical(time, latitude, longitude);
  const ascKp = normalizeDeg(asc - kpAyan);
  const moonTrop = Astronomy.EclipticGeoMoon(time).lon;
  const moonKp = normalizeDeg(moonTrop - kpAyan);

  const ascSign = Math.floor(ascKp / 30) % 12;
  const ascNak = Math.floor(ascKp / (360 / 27)) % 27;
  const moonSign = Math.floor(moonKp / 30) % 12;
  const moonNak = Math.floor(moonKp / (360 / 27)) % 27;

  const localDay = new Date(utcMs + offsetMinutes * 60_000).getUTCDay();
  const dayLord = VARA_INFO[localDay].lord;
  const lagnaSignLord = SIGNS[ascSign].lord;
  const lagnaStarLord = NAKSHATRAS[ascNak].lord;
  const lagnaSubLord = computeKpSubLord(ascKp);
  const moonSignLord = SIGNS[moonSign].lord;
  const moonStarLord = NAKSHATRAS[moonNak].lord;
  const moonSubLord = computeKpSubLord(moonKp);

  return {
    timestampLocal: formatLocalDateTimeFromUtc(utcMs, offsetMinutes),
    dayLord,
    lagnaSignLord,
    lagnaStarLord,
    lagnaSubLord,
    moonSignLord,
    moonStarLord,
    moonSubLord,
    rulingPlanets: Array.from(
      new Set<NineGrahaId>([
        lagnaStarLord,
        lagnaSignLord,
        lagnaSubLord,
        moonStarLord,
        moonSignLord,
        moonSubLord,
        dayLord,
      ])
    ),
  };
}
