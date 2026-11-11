import { SEVEN_PLANETS, SIGNS } from './constants';
import { computeAscendantAndMcTropical, computeSunriseSunsetForLocalDay } from './ephemeris';
import { angularDiffDeg, formatDms, normalizeDeg } from './time';
import type { BodyPosition, ChartData, SevenPlanetId } from './types';
import { buildSignPlacement } from './vargas';
import * as Astronomy from 'astronomy-engine';

export interface PlanetaryAvasthaRow {
  planet: SevenPlanetId;
  baladi: string;
  jagratadi: 'Jagrat (Awake)' | 'Swapna (Dreaming)' | 'Sushupti (Asleep)';
  deeptadi: string;
  resultCapacity: string;
}

export interface GrahaYuddhaInfo {
  winner: SevenPlanetId;
  loser: SevenPlanetId;
  separationDeg: number;
  signName: string;
  note: string;
}

export interface UpagrahaPoint {
  name: string;
  shortLabel: string;
  longitude: number;
  signName: string;
  dms: string;
  house: number;
  nature: string;
}

export interface AvasthaUpagrahaReport {
  avasthas: PlanetaryAvasthaRow[];
  grahaYuddha: GrahaYuddhaInfo[];
  upagrahas: UpagrahaPoint[];
  bhriguBindu: {
    longitude: number;
    signName: string;
    dms: string;
    house: number;
    note: string;
  };
  beejaSphuta: {
    longitude: number;
    signName: string;
    dms: string;
    strengthNote: string;
  };
  kshetraSphuta: {
    longitude: number;
    signName: string;
    dms: string;
    strengthNote: string;
  };
}

const BALADI_ODD = ['Bala (Infant · 25%)', 'Kumara (Adolescent · 50%)', 'Yuva (Youth · 100%)', 'Vriddha (Aged · 12%)', 'Mrita (Dormant · 0%)'];
const BALADI_EVEN = [...BALADI_ODD].reverse();

export function computeAvasthasAndUpagrahas(chart: ChartData): AvasthaUpagrahaReport {
  const byId = new Map<SevenPlanetId, BodyPosition>();
  for (const p of chart.planets) {
    if (SEVEN_PLANETS.includes(p.id as SevenPlanetId)) {
      byId.set(p.id as SevenPlanetId, p);
    }
  }

  const sun = byId.get('Sun')!;
  const moon = byId.get('Moon')!;
  const mars = byId.get('Mars')!;
  const jupiter = byId.get('Jupiter')!;
  const venus = byId.get('Venus')!;
  const rahu = chart.planets.find((p) => p.id === 'Rahu')!;
  const ascSign = chart.ascendant.signIndex;

  // 1. Planetary Avasthas (Baladi, Jagratadi, Deeptadi)
  const avasthas: PlanetaryAvasthaRow[] = SEVEN_PLANETS.map((pId) => {
    const p = byId.get(pId)!;
    const isOdd = p.signIndex % 2 === 0;
    const band = Math.min(4, Math.floor(p.degreeInSign / 6));
    const baladi = isOdd ? BALADI_ODD[band] : BALADI_EVEN[band];

    let jagratadi: PlanetaryAvasthaRow['jagratadi'] = 'Swapna (Dreaming)';
    if (['Exalted', 'Moolatrikona', 'Own Sign'].includes(p.dignity)) {
      jagratadi = 'Jagrat (Awake)';
    } else if (['Enemy', 'Great Enemy', 'Debilitated'].includes(p.dignity)) {
      jagratadi = 'Sushupti (Asleep)';
    }

    let deeptadi = 'Shanta (Peaceful)';
    if (p.dignity === 'Exalted' || p.dignity === 'Moolatrikona') deeptadi = 'Deepta (Radiant)';
    else if (p.dignity === 'Own Sign') deeptadi = 'Swastha (Self-Content)';
    else if (['Great Friend', 'Friend'].includes(p.dignity)) deeptadi = 'Mudita (Delighted)';
    else if (p.isCombust) deeptadi = 'Vikala (Combust / Subdued)';
    else if (p.dignity === 'Debilitated') deeptadi = 'Deena (Depressed)';
    else if (['Enemy', 'Great Enemy'].includes(p.dignity)) deeptadi = 'Khala (Troubled)';
    else if (p.isRetrograde) deeptadi = 'Shakta (Potent Retro)';

    const resultCapacity =
      band === 2 && jagratadi === 'Jagrat (Awake)'
        ? 'Peak Full-Power Delivery'
        : band === 4 || jagratadi === 'Sushupti (Asleep)'
          ? 'Subtle / Delayed Delivery'
          : 'Moderate Delivery';

    return { planet: pId, baladi, jagratadi, deeptadi, resultCapacity };
  });

  // 2. Graha Yuddha (Planetary War among Mars, Mercury, Jupiter, Venus, Saturn within 1°)
  const warCandidates: SevenPlanetId[] = ['Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
  const grahaYuddha: GrahaYuddhaInfo[] = [];
  for (let i = 0; i < warCandidates.length; i++) {
    for (let j = i + 1; j < warCandidates.length; j++) {
      const p1 = byId.get(warCandidates[i])!;
      const p2 = byId.get(warCandidates[j])!;
      const sep = angularDiffDeg(p1.longitude, p2.longitude);
      if (sep <= 1.0) {
        // Venus wins per classical brightness rule; otherwise higher ecliptic latitude / lower longitude
        const winner =
          p1.id === 'Venus' || p2.id === 'Venus'
            ? (p1.id === 'Venus' ? p1 : p2)
            : p1.latitude >= p2.latitude
              ? p1
              : p2;
        const loser = winner.id === p1.id ? p2 : p1;
        grahaYuddha.push({
          winner: winner.id as SevenPlanetId,
          loser: loser.id as SevenPlanetId,
          separationDeg: Math.round(sep * 1000) / 1000,
          signName: p1.signName,
          note: `${winner.id} and ${loser.id} are within ${sep.toFixed(2)}° in ${p1.signName} — ${winner.id} prevails in Graha Yuddha while ${loser.id} experiences competitive strain.`,
        });
      }
    }
  }

  // 3. Solar Upagrahas (Dhuma, Vyatipata, Parivesha, Indrachapa, Upaketu)
  const makeUpagraha = (name: string, shortLabel: string, lonRaw: number, nature: string): UpagrahaPoint => {
    const lon = normalizeDeg(lonRaw);
    const pl = buildSignPlacement(lon);
    return {
      name,
      shortLabel,
      longitude: lon,
      signName: pl.signName,
      dms: pl.shortDms,
      house: ((pl.signIndex - ascSign + 12) % 12) + 1,
      nature,
    };
  };

  const dhuma = normalizeDeg(sun.longitude + 133 + 20 / 60);
  const vyatipata = normalizeDeg(360 - dhuma);
  const parivesha = normalizeDeg(vyatipata + 180);
  const indrachapa = normalizeDeg(360 - parivesha);
  const upaketu = normalizeDeg(indrachapa + 16 + 40 / 60);

  const upagrahas: UpagrahaPoint[] = [
    makeUpagraha('Dhuma', 'Dh', dhuma, 'Smoky intensity / inner restlessness (Sun + 133°20\')'),
    makeUpagraha('Vyatipata', 'Vy', vyatipata, 'Sudden reversal / alertness trigger (360° - Dhuma)'),
    makeUpagraha('Parivesha', 'Pv', parivesha, 'Halo / protective boundary (Vyatipata + 180°)'),
    makeUpagraha('Indrachapa', 'Ic', indrachapa, 'Rainbow arc / creative hope (360° - Parivesha)'),
    makeUpagraha('Upaketu', 'Uk', upaketu, 'Sub-comet / sharp mental spark (Indrachapa + 16°40\')'),
  ];

  // Daytime / Nighttime Upagrahas (Kala, Mrityu, Artha Prahara, Yamaghantaka) using true Vedic day/night span
  const riseSet = computeSunriseSunsetForLocalDay(
    chart.utcMs,
    chart.offsetMinutesUsed,
    chart.input.latitude,
    chart.input.longitude
  );
  if (riseSet.vedicSunriseMs !== null && riseSet.vedicSunsetMs !== null && riseSet.nextSunriseMs !== null) {
    const srMs = riseSet.vedicSunriseMs;
    const ssMs = riseSet.vedicSunsetMs;
    const isDay = chart.utcMs >= srMs && chart.utcMs < ssMs;
    const segStart = isDay ? srMs : ssMs;
    const segLen = isDay ? ssMs - srMs : riseSet.nextSunriseMs - ssMs;
    const weekday = new Date(srMs + chart.offsetMinutesUsed * 60_000).getUTCDay(); // 0=Sun..6=Sat

    const calcSlotAsc = (partIdx: number) => {
      const tMs = segStart + ((partIdx % 8) * segLen) / 8;
      const trop = computeAscendantAndMcTropical(
        new Astronomy.AstroTime(new Date(tMs)),
        chart.input.latitude,
        chart.input.longitude
      ).asc;
      return normalizeDeg(trop - chart.ayanamsaDeg);
    };

    const kalaSlot = (0 - weekday + 8) % 8; // Sun's slot
    const mrityuSlot = (2 - weekday + 8) % 8; // Mars's slot
    const arthaSlot = (3 - weekday + 8) % 8; // Mercury's slot
    const yamaSlot = (4 - weekday + 8) % 8; // Jupiter's slot

    upagrahas.push(
      makeUpagraha('Kala', 'Kl', calcSlotAsc(kalaSlot), 'Sun Upagraha — time pressure & discipline'),
      makeUpagraha('Mrityu', 'Mr', calcSlotAsc(mrityuSlot), 'Mars Upagraha — crisis caution & vigilance'),
      makeUpagraha('Artha Prahara', 'Ap', calcSlotAsc(arthaSlot), 'Mercury Upagraha — commercial & analytical focus'),
      makeUpagraha('Yamaghantaka', 'Yg', calcSlotAsc(yamaSlot), 'Jupiter Upagraha — auspicious & ethical shield')
    );
  }

  // 4. Bhrigu Bindu (Midpoint from Rahu to Moon)
  const bbOffset = normalizeDeg(moon.longitude - rahu.longitude) / 2;
  const bbLon = normalizeDeg(rahu.longitude + bbOffset);
  const bbPl = buildSignPlacement(bbLon);
  const bbHouse = ((bbPl.signIndex - ascSign + 12) % 12) + 1;

  // 5. Beeja Sphuta (Male Fertility: Sun + Venus + Jupiter) & Kshetra Sphuta (Female Fertility: Moon + Mars + Jupiter)
  const beejaLon = normalizeDeg(sun.longitude + venus.longitude + jupiter.longitude);
  const beejaPl = buildSignPlacement(beejaLon);
  const beejaOdd = beejaPl.signIndex % 2 === 0;

  const kshetraLon = normalizeDeg(moon.longitude + mars.longitude + jupiter.longitude);
  const kshetraPl = buildSignPlacement(kshetraLon);
  const kshetraEven = kshetraPl.signIndex % 2 === 1;

  return {
    avasthas,
    grahaYuddha,
    upagrahas,
    bhriguBindu: {
      longitude: bbLon,
      signName: bbPl.signName,
      dms: formatDms(bbPl.degreeInSign, false),
      house: bbHouse,
      note: `Bhrigu Bindu falls in ${bbPl.signName} ${formatDms(bbPl.degreeInSign, false)} (House ${bbHouse}, ${bbPl.nakshatraName}). Major Jupiter/Saturn/Rahu transits over this point classically trigger pivotal life events.`,
    },
    beejaSphuta: {
      longitude: beejaLon,
      signName: beejaPl.signName,
      dms: formatDms(beejaPl.degreeInSign, false),
      strengthNote: `Falls in ${beejaPl.signName} (${beejaOdd ? 'Odd sign — classically strong for Beeja Sphuta' : 'Even sign — benefits from Jupiter/progeny support'}).`,
    },
    kshetraSphuta: {
      longitude: kshetraLon,
      signName: kshetraPl.signName,
      dms: formatDms(kshetraPl.degreeInSign, false),
      strengthNote: `Falls in ${kshetraPl.signName} (${kshetraEven ? 'Even sign — classically strong for Kshetra Sphuta' : 'Odd sign — supported by 5th house & D7'}).`,
    },
  };
}
