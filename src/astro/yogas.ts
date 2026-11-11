import { SIGNS } from './constants';
import type { BodyPosition, PlanetId, SevenPlanetId, YogaResult } from './types';

function houseBetween(fromSign: number, toSign: number): number {
  return ((toSign - fromSign + 12) % 12) + 1;
}

function isKendra(h: number): boolean {
  return h === 1 || h === 4 || h === 7 || h === 10;
}

function isTrikona(h: number): boolean {
  return h === 1 || h === 5 || h === 9;
}

function isDusthana(h: number): boolean {
  return h === 6 || h === 8 || h === 12;
}

function signLord(signIndex: number): SevenPlanetId {
  return SIGNS[(signIndex + 12) % 12].lord;
}

export function detectYogas(
  ascendant: BodyPosition,
  planets: BodyPosition[]
): YogaResult[] {
  const yogas: YogaResult[] = [];
  const byId = new Map<PlanetId, BodyPosition>();
  for (const p of planets) byId.set(p.id as PlanetId, p);

  const ascSign = ascendant.signIndex;
  const sun = byId.get('Sun')!;
  const moon = byId.get('Moon')!;
  const mars = byId.get('Mars')!;
  const mercury = byId.get('Mercury')!;
  const jupiter = byId.get('Jupiter')!;
  const venus = byId.get('Venus')!;
  const saturn = byId.get('Saturn')!;
  const rahu = byId.get('Rahu')!;
  const ketu = byId.get('Ketu')!;

  // 1. Pancha Mahapurusha Yogas
  const mahapurusha: Array<{ p: BodyPosition; name: string; desc: string }> = [
    { p: mars, name: 'Ruchaka Yoga', desc: 'Mars in own/exalted sign in a Kendra from Lagna: courage, command, vitality.' },
    { p: mercury, name: 'Bhadra Yoga', desc: 'Mercury in own/exalted sign in a Kendra from Lagna: intellect, eloquence, commerce.' },
    { p: jupiter, name: 'Hamsa Yoga', desc: 'Jupiter in own/exalted sign in a Kendra from Lagna: wisdom, dharma, benevolence.' },
    { p: venus, name: 'Malavya Yoga', desc: 'Venus in own/exalted sign in a Kendra from Lagna: refinement, arts, prosperity.' },
    { p: saturn, name: 'Sasa Yoga', desc: 'Saturn in own/exalted sign in a Kendra from Lagna: discipline, endurance, authority.' },
  ];

  for (const item of mahapurusha) {
    const h = houseBetween(ascSign, item.p.signIndex);
    if (isKendra(h) && ['Exalted', 'Moolatrikona', 'Own Sign'].includes(item.p.dignity)) {
      yogas.push({
        name: item.name,
        category: 'Mahapurusha',
        strength: item.p.dignity === 'Exalted' ? 'Strong' : 'Moderate',
        planets: [item.p.id],
        description: `${item.desc} (${item.p.id} in ${item.p.signName}, House ${h})`,
      });
    }
  }

  // 2. Gaja Kesari Yoga (Jupiter in Kendra from Moon)
  const jupFromMoon = houseBetween(moon.signIndex, jupiter.signIndex);
  if (isKendra(jupFromMoon)) {
    yogas.push({
      name: 'Gaja Kesari Yoga',
      category: 'Raja',
      strength: jupiter.dignity === 'Debilitated' ? 'Present' : 'Strong',
      planets: ['Jupiter', 'Moon'],
      description: `Jupiter is in the ${jupFromMoon}th house (Kendra) from Moon — brings reputation, wisdom, and resilience.`,
    });
  }

  // 3. Budhaditya Yoga (Sun + Mercury in same sign)
  if (sun.signIndex === mercury.signIndex) {
    yogas.push({
      name: 'Budhaditya Yoga',
      category: 'Solar',
      strength: mercury.isCombust ? 'Present' : 'Strong',
      planets: ['Sun', 'Mercury'],
      description: `Sun and Mercury conjoin in ${sun.signName} — sharp intellect, analytical skill, and communication.${mercury.isCombust ? ' (Note: Mercury is combust, reducing outward expression.)' : ''}`,
    });
  }

  // 4. Chandra-Mangala Yoga (Moon + Mars conjunction or mutual 7th)
  const marsFromMoon = houseBetween(moon.signIndex, mars.signIndex);
  if (marsFromMoon === 1 || marsFromMoon === 7) {
    yogas.push({
      name: 'Chandra-Mangala Yoga',
      category: 'Dhana',
      strength: 'Moderate',
      planets: ['Moon', 'Mars'],
      description: `Moon and Mars in ${marsFromMoon === 1 ? 'conjunction' : 'mutual aspect'} — drive, entrepreneurial energy, and material resourcefulness.`,
    });
  }

  // 5. Lunar Yogas (Sunapha, Anapha, Durudhura, Kemadruma)
  const planetsExclSunNodes = [mars, mercury, jupiter, venus, saturn];
  const in2ndFromMoon = planetsExclSunNodes.filter((p) => houseBetween(moon.signIndex, p.signIndex) === 2);
  const in12thFromMoon = planetsExclSunNodes.filter((p) => houseBetween(moon.signIndex, p.signIndex) === 12);
  const in1stFromMoon = planetsExclSunNodes.filter((p) => p.signIndex === moon.signIndex);

  if (in2ndFromMoon.length > 0 && in12thFromMoon.length > 0) {
    yogas.push({
      name: 'Durudhura Yoga',
      category: 'Lunar',
      strength: 'Strong',
      planets: ['Moon', ...in2ndFromMoon.map((p) => p.id), ...in12thFromMoon.map((p) => p.id)],
      description: 'Planets occupy both the 2nd and 12th signs from Moon — stable support, wealth, and balanced temperament.',
    });
  } else if (in2ndFromMoon.length > 0) {
    yogas.push({
      name: 'Sunapha Yoga',
      category: 'Lunar',
      strength: 'Moderate',
      planets: ['Moon', ...in2ndFromMoon.map((p) => p.id)],
      description: `Planet(s) in 2nd from Moon (${in2ndFromMoon.map((p) => p.id).join(', ')}) — self-earned prosperity and clarity.`,
    });
  } else if (in12thFromMoon.length > 0) {
    yogas.push({
      name: 'Anapha Yoga',
      category: 'Lunar',
      strength: 'Moderate',
      planets: ['Moon', ...in12thFromMoon.map((p) => p.id)],
      description: `Planet(s) in 12th from Moon (${in12thFromMoon.map((p) => p.id).join(', ')}) — poise, character, and spiritual composure.`,
    });
  } else if (in1stFromMoon.length === 0) {
    // Check cancellation (planets in Kendra from Lagna or Jupiter aspecting Moon)
    const kendraFromLagna = planetsExclSunNodes.some((p) => isKendra(houseBetween(ascSign, p.signIndex)));
    yogas.push({
      name: kendraFromLagna ? 'Kemadruma Yoga (Cancelled)' : 'Kemadruma Yoga',
      category: 'Lunar',
      strength: 'Present',
      planets: ['Moon'],
      description: kendraFromLagna
        ? 'No planets in 2nd/12th from Moon, but cancelled by planetary occupancy in a Kendra from Lagna.'
        : 'Moon has no non-nodal planets in 1st, 2nd, or 12th from it — independence and need for self-reliance.',
    });
  }

  // 6. Vesi / Vosi / Ubhayachari (2nd/12th from Sun excluding Moon/Nodes)
  const planetsExclMoonNodes = [mars, mercury, jupiter, venus, saturn];
  const in2FromSun = planetsExclMoonNodes.filter((p) => houseBetween(sun.signIndex, p.signIndex) === 2);
  const in12FromSun = planetsExclMoonNodes.filter((p) => houseBetween(sun.signIndex, p.signIndex) === 12);
  if (in2FromSun.length > 0 && in12FromSun.length > 0) {
    yogas.push({
      name: 'Ubhayachari Yoga',
      category: 'Solar',
      strength: 'Strong',
      planets: ['Sun', ...in2FromSun.map((p) => p.id), ...in12FromSun.map((p) => p.id)],
      description: 'Planets flank the Sun on both sides (2nd and 12th) — eloquent, resourceful, and respected.',
    });
  } else if (in2FromSun.length > 0) {
    yogas.push({
      name: 'Vesi Yoga',
      category: 'Solar',
      strength: 'Moderate',
      planets: ['Sun', ...in2FromSun.map((p) => p.id)],
      description: `Planet(s) in 2nd from Sun (${in2FromSun.map((p) => p.id).join(', ')}) — steady speech and truthful conduct.`,
    });
  } else if (in12FromSun.length > 0) {
    yogas.push({
      name: 'Vosi Yoga',
      category: 'Solar',
      strength: 'Moderate',
      planets: ['Sun', ...in12FromSun.map((p) => p.id)],
      description: `Planet(s) in 12th from Sun (${in12FromSun.map((p) => p.id).join(', ')}) — charitable, skillful, and learned.`,
    });
  }

  // 7. Dharma-Karmadhipati Raja Yoga (9th & 10th lords conjunct or mutual aspect or exchange)
  const l9 = signLord((ascSign + 8) % 12);
  const l10 = signLord((ascSign + 9) % 12);
  if (l9 !== l10) {
    const p9 = byId.get(l9)!;
    const p10 = byId.get(l10)!;
    const mutual7 = houseBetween(p9.signIndex, p10.signIndex) === 7;
    const conj = p9.signIndex === p10.signIndex;
    const parivartana =
      p9.signIndex === (ascSign + 9) % 12 && p10.signIndex === (ascSign + 8) % 12;
    if (conj || mutual7 || parivartana) {
      yogas.push({
        name: 'Dharma-Karmadhipati Yoga',
        category: 'Raja',
        strength: 'Strong',
        planets: [l9, l10],
        description: `9th lord (${l9}) and 10th lord (${l10}) form a ${parivartana ? 'Parivartana' : conj ? 'conjunction' : 'mutual 7th'} link — high career achievement and righteous fortune.`,
      });
    }
  }

  // 8. General Kendra-Trikona Raja Yoga (conjunction of any distinct Kendra lord and Trikona lord)
  const kendraLords = [1, 4, 7, 10].map((h) => signLord((ascSign + h - 1) % 12));
  const trikonaLords = [1, 5, 9].map((h) => signLord((ascSign + h - 1) % 12));
  const seenPairs = new Set<string>();
  for (const kl of kendraLords) {
    for (const tl of trikonaLords) {
      if (kl === tl) continue;
      const key = [kl, tl].sort().join('-');
      if (seenPairs.has(key)) continue;
      seenPairs.add(key);
      const pk = byId.get(kl)!;
      const pt = byId.get(tl)!;
      if (pk.signIndex === pt.signIndex) {
        yogas.push({
          name: `Raja Yoga (${kl} + ${tl})`,
          category: 'Raja',
          strength: 'Moderate',
          planets: [kl, tl],
          description: `Kendra lord ${kl} and Trikona lord ${tl} conjoin in ${pk.signName} (House ${houseBetween(ascSign, pk.signIndex)}).`,
        });
      }
    }
  }

  // 9. Viparita Raja Yoga (6th, 8th, 12th lords placed in 6th, 8th, or 12th)
  for (const hNum of [6, 8, 12]) {
    const lord = signLord((ascSign + hNum - 1) % 12);
    const p = byId.get(lord)!;
    const placedH = houseBetween(ascSign, p.signIndex);
    if (isDusthana(placedH) && placedH !== hNum) {
      const name = hNum === 6 ? 'Harsha Yoga' : hNum === 8 ? 'Sarala Yoga' : 'Vimala Yoga';
      yogas.push({
        name: `${name} (Viparita Raja)`,
        category: 'Raja',
        strength: 'Moderate',
        planets: [lord],
        description: `${hNum}th lord ${lord} occupies the ${placedH}th house — turning adversity into resilience and unexpected gain.`,
      });
    }
  }

  // 10. Neecha Bhanga Raja Yoga (debilitated planet whose dispositor or exaltation lord is in Kendra from Lagna/Moon)
  for (const p of planetsExclMoonNodes.concat([sun, moon])) {
    if (p.dignity !== 'Debilitated') continue;
    const disp = byId.get(SIGNS[p.signIndex].lord)!;
    const hFromLagna = houseBetween(ascSign, disp.signIndex);
    const hFromMoon = houseBetween(moon.signIndex, disp.signIndex);
    if (isKendra(hFromLagna) || isKendra(hFromMoon) || disp.signIndex === p.signIndex) {
      yogas.push({
        name: `Neecha Bhanga Raja Yoga (${p.id})`,
        category: 'Raja',
        strength: 'Strong',
        planets: [p.id, disp.id],
        description: `Debilitated ${p.id} in ${p.signName} receives cancellation because its dispositor ${disp.id} is in a Kendra from Lagna/Moon.`,
      });
    }
  }

  // 11. Manglik (Kuja Dosha) check: Mars in 1, 2, 4, 7, 8, or 12 from Lagna
  const marsHouse = houseBetween(ascSign, mars.signIndex);
  if ([1, 2, 4, 7, 8, 12].includes(marsHouse)) {
    const cancelled =
      ['Exalted', 'Moolatrikona', 'Own Sign'].includes(mars.dignity) ||
      jupiter.signIndex === mars.signIndex ||
      [5, 7, 9].includes(houseBetween(jupiter.signIndex, mars.signIndex));
    yogas.push({
      name: cancelled ? 'Kuja Dosha (Mitigated)' : 'Kuja / Manglik Dosha',
      category: 'Dosha',
      strength: cancelled ? 'Present' : 'Moderate',
      planets: ['Mars'],
      description: `Mars occupies house ${marsHouse} from Lagna.${cancelled ? ' Mitigated by strong Mars dignity or Jupiterian influence.' : ' Considered in synastry / marriage compatibility.'}`,
    });
  }

  // 12. Kala Sarpa check (all 7 planets on one side of Rahu-Ketu axis)
  const rLon = rahu.longitude;
  const kLon = ketu.longitude;
  const arcSpan = ((kLon - rLon + 360) % 360); // ~180
  const seven = [sun, moon, mars, mercury, jupiter, venus, saturn];
  const allForward = seven.every((p) => ((p.longitude - rLon + 360) % 360) < arcSpan);
  const allBackward = seven.every((p) => ((p.longitude - kLon + 360) % 360) < (360 - arcSpan));
  if (allForward || allBackward) {
    yogas.push({
      name: 'Kala Sarpa Yoga',
      category: 'Special',
      strength: 'Strong',
      planets: ['Rahu', 'Ketu'],
      description: 'All seven planets lie strictly within one hemisphere of the Rahu–Ketu nodal axis — intense focus and karmic drive.',
    });
  }

  return yogas;
}
