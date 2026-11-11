import { SEVEN_PLANETS } from './constants';
import type { AshtakavargaData, SevenPlanetId } from './types';

type Contributor = SevenPlanetId | 'Asc';

// Classical BPHS Benefic Bindu positions (1-based houses from each contributor)
const BAV_RULES: Record<SevenPlanetId | 'Asc', Record<Contributor, number[]>> = {
  Sun: {
    Sun: [1, 2, 4, 7, 8, 9, 10, 11],
    Moon: [3, 6, 10, 11],
    Mars: [1, 2, 4, 7, 8, 9, 10, 11],
    Mercury: [3, 5, 6, 9, 10, 11, 12],
    Jupiter: [5, 6, 9, 11],
    Venus: [6, 7, 12],
    Saturn: [1, 2, 4, 7, 8, 9, 10, 11],
    Asc: [3, 4, 6, 10, 11, 12],
  },
  Moon: {
    Sun: [3, 6, 7, 8, 10, 11],
    Moon: [1, 3, 6, 7, 10, 11],
    Mars: [2, 3, 5, 6, 9, 10, 11],
    Mercury: [1, 3, 4, 5, 7, 8, 10, 11],
    Jupiter: [1, 4, 7, 8, 10, 11, 12],
    Venus: [3, 4, 5, 7, 9, 10, 11],
    Saturn: [3, 5, 6, 11],
    Asc: [3, 6, 10, 11],
  },
  Mars: {
    Sun: [3, 5, 6, 10, 11],
    Moon: [3, 6, 11],
    Mars: [1, 2, 4, 7, 8, 10, 11],
    Mercury: [3, 5, 6, 11],
    Jupiter: [6, 10, 11, 12],
    Venus: [6, 8, 11, 12],
    Saturn: [1, 4, 7, 8, 9, 10, 11],
    Asc: [1, 3, 6, 10, 11],
  },
  Mercury: {
    Sun: [5, 6, 9, 11, 12],
    Moon: [2, 4, 6, 8, 10, 11],
    Mars: [1, 2, 4, 7, 8, 9, 10, 11],
    Mercury: [1, 3, 5, 6, 9, 10, 11, 12],
    Jupiter: [6, 8, 11, 12],
    Venus: [1, 2, 3, 4, 5, 8, 9, 11],
    Saturn: [1, 2, 4, 7, 8, 9, 10, 11],
    Asc: [1, 2, 4, 6, 8, 10, 11],
  },
  Jupiter: {
    Sun: [1, 2, 3, 4, 7, 8, 9, 10, 11],
    Moon: [2, 5, 7, 9, 11],
    Mars: [1, 2, 4, 7, 8, 10, 11],
    Mercury: [1, 2, 4, 5, 6, 9, 10, 11],
    Jupiter: [1, 2, 3, 4, 7, 8, 10, 11],
    Venus: [2, 5, 6, 9, 10, 11],
    Saturn: [3, 5, 6, 12],
    Asc: [1, 2, 4, 5, 6, 7, 9, 10, 11],
  },
  Venus: {
    Sun: [8, 11, 12],
    Moon: [1, 2, 3, 4, 5, 8, 9, 11, 12],
    Mars: [3, 5, 6, 9, 11, 12],
    Mercury: [3, 5, 6, 9, 11],
    Jupiter: [5, 8, 9, 10, 11],
    Venus: [1, 2, 3, 4, 5, 8, 9, 10, 11],
    Saturn: [3, 4, 5, 8, 9, 10, 11],
    Asc: [1, 2, 3, 4, 5, 8, 9, 11],
  },
  Saturn: {
    Sun: [1, 2, 4, 7, 8, 10, 11],
    Moon: [3, 6, 11],
    Mars: [3, 5, 6, 10, 11, 12],
    Mercury: [6, 8, 9, 10, 11, 12],
    Jupiter: [5, 6, 11, 12],
    Venus: [6, 11, 12],
    Saturn: [3, 5, 6, 11],
    Asc: [1, 3, 4, 6, 10, 11],
  },
  Asc: {
    Sun: [3, 4, 6, 10, 11, 12],
    Moon: [3, 6, 10, 11, 12],
    Mars: [1, 3, 6, 10, 11],
    Mercury: [1, 2, 4, 6, 8, 10, 11],
    Jupiter: [1, 2, 4, 5, 6, 7, 9, 10, 11],
    Venus: [1, 2, 3, 4, 5, 8, 9],
    Saturn: [1, 3, 4, 6, 10, 11],
    Asc: [3, 6, 10, 11],
  },
};

export function hasAshtakavargaBindu(
  target: SevenPlanetId,
  contributor: Contributor,
  houseFromContributor: number
): boolean {
  return BAV_RULES[target][contributor].includes(houseFromContributor);
}

function applyTrikonaShodhana(bav: number[]): number[] {
  const out = [...bav];
  // Four elemental trines: [0,4,8], [1,5,9], [2,6,10], [3,7,11]
  for (let t = 0; t < 4; t++) {
    const idxs = [t, t + 4, t + 8];
    const vals = idxs.map((i) => out[i]);
    const nonZero = vals.filter((v) => v > 0);
    if (nonZero.length === 0 || nonZero.length === 1) continue;
    if (vals[0] === vals[1] && vals[1] === vals[2]) {
      for (const i of idxs) out[i] = 0;
      continue;
    }
    const minVal = Math.min(...vals);
    if (minVal > 0) {
      for (const i of idxs) out[i] -= minVal;
    }
  }
  return out;
}

function applyEkadhipatyaShodhana(
  trikona: number[],
  occupiedSigns: Set<number>
): number[] {
  const out = [...trikona];
  // Dual-sign pairs ruled by same planet: Mars(0,7), Venus(1,6), Mercury(2,5), Jupiter(8,11), Saturn(9,10)
  const pairs: Array<[number, number]> = [
    [0, 7],
    [1, 6],
    [2, 5],
    [8, 11],
    [9, 10],
  ];
  for (const [a, b] of pairs) {
    const va = out[a];
    const vb = out[b];
    if (va === 0 || vb === 0) continue;
    const occA = occupiedSigns.has(a);
    const occB = occupiedSigns.has(b);
    if (occA && occB) continue; // Both occupied -> no reduction
    if (!occA && !occB) {
      if (va === vb) {
        out[a] = 0;
        out[b] = 0;
      } else {
        const minV = Math.min(va, vb);
        out[a] = minV;
        out[b] = minV;
      }
    } else if (occA && !occB) {
      if (vb < va) out[b] = 0;
      else if (vb >= va) out[b] = va;
    } else if (!occA && occB) {
      if (va < vb) out[a] = 0;
      else if (va >= vb) out[a] = vb;
    }
  }
  return out;
}

export function computeAshtakavarga(
  signByContributor: Record<Contributor, number>
): AshtakavargaData {
  const bhinna = {} as Record<SevenPlanetId | 'Asc', number[]>;
  const prastara = {} as Record<Contributor, Record<Contributor, number[]>>;
  const contributors: Contributor[] = [...SEVEN_PLANETS, 'Asc'];
  const occupiedBySeven = new Set<number>(SEVEN_PLANETS.map((p) => signByContributor[p]));

  for (const target of contributors) {
    const counts = new Array<number>(12).fill(0);
    const prastaraTarget = {} as Record<Contributor, number[]>;
    const rules = BAV_RULES[target];
    for (const ref of contributors) {
      const row = new Array<number>(12).fill(0);
      const refSign = signByContributor[ref];
      for (const h of rules[ref]) {
        const signIdx = (refSign + h - 1) % 12;
        counts[signIdx] += 1;
        row[signIdx] = 1;
      }
      prastaraTarget[ref] = row;
    }
    bhinna[target] = counts;
    prastara[target] = prastaraTarget;
  }

  const sarva = new Array<number>(12).fill(0);
  for (let s = 0; s < 12; s++) {
    let sum = 0;
    for (const p of SEVEN_PLANETS) {
      sum += bhinna[p][s];
    }
    sarva[s] = sum;
  }

  const trikonaShodhana = {} as Record<SevenPlanetId, number[]>;
  const ekadhipatyaShodhana = {} as Record<SevenPlanetId, number[]>;

  for (const p of SEVEN_PLANETS) {
    trikonaShodhana[p] = applyTrikonaShodhana(bhinna[p]);
    ekadhipatyaShodhana[p] = applyEkadhipatyaShodhana(trikonaShodhana[p], occupiedBySeven);
  }

  return {
    bhinna,
    prastara,
    sarva,
    totalBindus: sarva.reduce((a, b) => a + b, 0),
    trikonaShodhana,
    ekadhipatyaShodhana,
  };
}
