import { NINE_GRAHAS, SIGNS } from './constants';
import { LAL_KITAB_PAKKA_GHAR, LAL_KITAB_RINS } from './predictions/extendedKb';
import { formatLocalDateTimeFromUtc } from './time';
import type { ChartData, NineGrahaId } from './types';

export interface JaiminiArudhaPada {
  house: number;
  label: string;
  signIndex: number;
  signName: string;
  houseFromLagna: number;
}

export interface CharaDashaItem {
  signIndex: number;
  signName: string;
  years: number;
  startDate: string;
  endDate: string;
  houseFromLagna: number;
  reading: string;
}

export interface JaiminiReport {
  karakamshaSign: string;
  swamsaSign: string;
  karakamshaReading: string;
  arudhaPadas: JaiminiArudhaPada[];
  charaDasha: CharaDashaItem[];
}

export interface LalKitabPlanetRow {
  planet: NineGrahaId;
  house: number;
  pakkaGhar: number;
  isPakka: boolean;
  note: string;
}

export interface LalKitabRinFound {
  name: string;
  meaning: string;
  remedy: string;
}

export interface LalKitabReport {
  planets: LalKitabPlanetRow[];
  rins: LalKitabRinFound[];
  generalUpay: string[];
}

export function computeJaiminiReport(chart: ChartData): JaiminiReport {
  const ascSign = chart.ascendant.signIndex;
  const ak = chart.planets.find((p) => p.charaKaraka === 'AK') ?? chart.planets[0];
  const akD9 = chart.divisionalCharts.D9.placements.find((p) => p.id === ak.id)!;
  const swamsaSign = SIGNS[akD9.signIndex].name;
  const karakamshaHouse = ((akD9.signIndex - ascSign + 12) % 12) + 1;

  const karakamshaReading = `Atmakaraka ${ak.id} occupies ${akD9.signName} in Navamsa (Karakamsha), activating House ${karakamshaHouse} from your Lagna. In *Jaimini Sutras*, this links spiritual growth and enduring vocation with ${ak.id} qualities expressed through ${akD9.signName}.`;

  // 12 Arudha Padas (A1..A12)
  const arudhaPadas: JaiminiArudhaPada[] = Array.from({ length: 12 }, (_, idx) => {
    const baseSign = (ascSign + idx) % 12;
    const lord = SIGNS[baseSign].lord;
    const lordSign = chart.planets.find((p) => p.id === lord)!.signIndex;
    const dist = (lordSign - baseSign + 12) % 12;
    let padaSign = (lordSign + dist) % 12;
    if (padaSign === baseSign || padaSign === (baseSign + 6) % 12) {
      padaSign = (padaSign + 9) % 12;
    }
    return {
      house: idx + 1,
      label: idx === 0 ? 'AL (A1)' : idx === 11 ? 'UL (A12)' : `A${idx + 1}`,
      signIndex: padaSign,
      signName: SIGNS[padaSign].name,
      houseFromLagna: ((padaSign - ascSign + 12) % 12) + 1,
    };
  });

  // K.N. Rao Chara Dasha: direction based on 9th sign from Lagna
  const ninthSign = (ascSign + 8) % 12;
  const directSigns = [0, 1, 2, 6, 7, 8]; // Aries, Taurus, Gemini, Libra, Scorpio, Sagittarius
  const isDirect = directSigns.includes(ninthSign);

  const pickLordSign = (signIdx: number): { lordSign: number; dignity: string } => {
    if (signIdx === 7) {
      // Scorpio: Mars vs Ketu
      const mars = chart.planets.find((p) => p.id === 'Mars')!;
      const ketu = chart.planets.find((p) => p.id === 'Ketu')!;
      return mars.signIndex === 7
        ? { lordSign: ketu.signIndex, dignity: ketu.dignity }
        : { lordSign: mars.signIndex, dignity: mars.dignity };
    }
    if (signIdx === 10) {
      // Aquarius: Saturn vs Rahu
      const sat = chart.planets.find((p) => p.id === 'Saturn')!;
      const rahu = chart.planets.find((p) => p.id === 'Rahu')!;
      return sat.signIndex === 10
        ? { lordSign: rahu.signIndex, dignity: rahu.dignity }
        : { lordSign: sat.signIndex, dignity: sat.dignity };
    }
    const lord = SIGNS[signIdx].lord;
    const p = chart.planets.find((x) => x.id === lord)!;
    return { lordSign: p.signIndex, dignity: p.dignity };
  };

  const charaDasha: CharaDashaItem[] = [];
  let cursor = chart.utcMs;
  const yearMs = 365.2425 * 86_400_000;

  for (let i = 0; i < 12; i++) {
    const signIdx = isDirect ? (ascSign + i) % 12 : (ascSign - i + 12) % 12;
    const { lordSign, dignity } = pickLordSign(signIdx);
    const countDirDirect = directSigns.includes(signIdx);
    let years = countDirDirect
      ? (lordSign - signIdx + 12) % 12
      : (signIdx - lordSign + 12) % 12;
    if (years === 0) years = 12;
    if (dignity === 'Exalted') years = Math.min(12, years + 1);
    else if (dignity === 'Debilitated') years = Math.max(1, years - 1);

    const endMs = cursor + years * yearMs;
    const hFromLagna = ((signIdx - ascSign + 12) % 12) + 1;
    const occ = chart.planets.filter((p) => p.signIndex === signIdx).map((p) => p.id);

    charaDasha.push({
      signIndex: signIdx,
      signName: SIGNS[signIdx].name,
      years,
      startDate: formatLocalDateTimeFromUtc(cursor, chart.offsetMinutesUsed).slice(0, 10),
      endDate: formatLocalDateTimeFromUtc(endMs, chart.offsetMinutesUsed).slice(0, 10),
      houseFromLagna: hFromLagna,
      reading: `Activates House ${hFromLagna} (${SIGNS[signIdx].name})${occ.length ? ` with ${occ.join(', ')} inside` : ''}.`,
    });
    cursor = endMs;
  }

  return {
    karakamshaSign: akD9.signName,
    swamsaSign,
    karakamshaReading,
    arudhaPadas,
    charaDasha,
  };
}

export function computeLalKitabReport(chart: ChartData): LalKitabReport {
  const planets: LalKitabPlanetRow[] = NINE_GRAHAS.map((g) => {
    const body = chart.planets.find((p) => p.id === g)!;
    const house = body.rasiHouseNumber;
    const pakka = LAL_KITAB_PAKKA_GHAR[g];
    const isPakka = house === pakka;
    const note = isPakka
      ? `${g} sits in its Lal Kitab Pakka Ghar (House ${pakka}), lending natural stability and strong self-expression.`
      : [1, 2, 4, 5, 9, 10, 11].includes(house)
        ? `${g} in House ${house} acts constructively when aligned with honest speech and steady routine.`
        : `${g} in House ${house} calls for mindful Lal Kitab precautions and patient service.`;

    return { planet: g, house, pakkaGhar: pakka, isPakka, note };
  });

  const rins: LalKitabRinFound[] = [];
  for (const rule of LAL_KITAB_RINS) {
    const p = chart.planets.find((x) => x.id === rule.planet);
    if (p && rule.triggerHouses.includes(p.rasiHouseNumber)) {
      rins.push({
        name: rule.name,
        meaning: `${rule.meaning} (Observed: ${rule.planet} in House ${p.rasiHouseNumber}).`,
        remedy: rule.remedy,
      });
    }
  }

  const generalUpay = [
    'Keep family elders respected and maintain harmonious, uncluttered living corners (especially North-East and center of home).',
    'Practice steady truthfulness in financial commitments before starting risky ventures.',
    'Engage in regular selfless charity (food, water, or educational support) aligned with your weakest planet.',
  ];

  return { planets, rins, generalUpay };
}
