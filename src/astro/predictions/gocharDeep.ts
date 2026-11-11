import { hasAshtakavargaBindu } from '../ashtakavarga';
import { calculateChart } from '../calculator';
import { NAKSHATRAS, NINE_GRAHAS, SEVEN_PLANETS, SIGNS } from '../constants';
import { GOCHAR_GOOD_HOUSES, GOCHAR_VEDHA_MAP, isVedhaExemptPair } from './bhavaKb';
import { evaluateParamayusStatus } from './paramayus';
import type { ChartData, NineGrahaId, SevenPlanetId } from '../types';

export interface DeepTransitItem {
  planet: NineGrahaId;
  transitSign: string;
  degreeInSign: number;
  nakshatraName: string;
  houseFromMoon: number;
  houseFromLagna: number;
  d9TransitSign: string;
  d9HouseFromNatalD9Lagna: number;
  d10TransitSign: string;
  savBindus: number;
  kakshyaLord: SevenPlanetId | 'Asc';
  kakshyaHasBindu: boolean;
  taraName: string;
  taraGood: boolean;
  hasVedha: boolean;
  vedhaPlanet?: string;
  verdict: 'Strong & Auspicious' | 'Auspicious' | 'Obstructed (Vedha)' | 'Mixed / Kakshya Supported' | 'Testing';
  reading: string;
}

export interface DoubleTransitActivation {
  house: number;
  signName: string;
  jupiterLink: string;
  saturnLink: string;
  savBindus: number;
  meaning: string;
}

export interface DeepGocharReport {
  targetDate: string;
  transitChart: ChartData;
  doubleTransitHouses: DoubleTransitActivation[];
  items: DeepTransitItem[];
  overallSummary: string;
}

// Classical 8 Kakshya rulers per 30° sign (3°45' each): Saturn, Jupiter, Mars, Sun, Venus, Mercury, Moon, Lagna
const KAKSHYA_LORDS: Array<SevenPlanetId | 'Asc'> = [
  'Saturn',
  'Jupiter',
  'Mars',
  'Sun',
  'Venus',
  'Mercury',
  'Moon',
  'Asc',
];

const HOUSE_TOPICS = [
  'Self, health & new beginnings',
  'Wealth, family & speech',
  'Courage, skills, siblings & short travel',
  'Home, property, mother & peace of mind',
  'Creativity, intellect, romance & children',
  'Work routine, service, health recovery & victory over rivals',
  'Marriage, partnerships & business contracts',
  'Transformation, research, joint finance & longevity',
  'Fortune, dharma, mentors, higher learning & long travel',
  'Career advancement, reputation & authority',
  'Income gains, promotions, social networks & fulfilled ambitions',
  'Foreign residence, spiritual retreat & major expenses',
];

const TARA_LABELS = [
  'Janma',
  'Sampat',
  'Vipat',
  'Kshema',
  'Pratyak',
  'Sadhana',
  'Naidhana',
  'Mitra',
  'Parama Mitra',
];

function getTransitAspectLink(planet: 'Jupiter' | 'Saturn', transitSign: number, targetSign: number): string | null {
  const diff = ((targetSign - transitSign + 12) % 12) + 1;
  if (diff === 1) return 'Transit over house';
  if (diff === 7) return '7th aspect';
  if (planet === 'Jupiter' && (diff === 5 || diff === 9)) return `${diff}th trinal aspect`;
  if (planet === 'Saturn' && (diff === 3 || diff === 10)) return `${diff}th special aspect`;
  return null;
}

export function computeDeepGochar(natalChart: ChartData, targetDate: string): DeepGocharReport {
  const paramayus = evaluateParamayusStatus(natalChart, targetDate);
  if (paramayus.exceeded) {
    return {
      targetDate,
      transitChart: natalChart,
      doubleTransitHouses: [],
      items: [],
      overallSummary: paramayus.messageEn,
    };
  }

  const transitInput = {
    ...natalChart.input,
    id: 'deep-gochar',
    name: 'Gochar',
    date: targetDate,
    time: '12:00:00',
  };
  const transitChart = calculateChart(transitInput, natalChart.settings);
  const natalMoon = natalChart.planets.find((p) => p.id === 'Moon')!;
  const moonSign = natalMoon.signIndex;
  const lagnaSign = natalChart.ascendant.signIndex;
  const natalD9Lagna = natalChart.divisionalCharts.D9.lagnaSignIndex;

  // Occupants by house from Moon for Vedha checks
  const occupantsFromMoon = new Map<number, NineGrahaId[]>();
  for (const g of NINE_GRAHAS) {
    const tp = transitChart.planets.find((p) => p.id === g)!;
    const h = ((tp.signIndex - moonSign + 12) % 12) + 1;
    const list = occupantsFromMoon.get(h) ?? [];
    list.push(g);
    occupantsFromMoon.set(h, list);
  }

  // Double Transit (Jupiter + Saturn simultaneous activation on natal houses)
  const tJup = transitChart.planets.find((p) => p.id === 'Jupiter')!;
  const tSat = transitChart.planets.find((p) => p.id === 'Saturn')!;
  const doubleTransitHouses: DoubleTransitActivation[] = [];
  for (let h = 1; h <= 12; h++) {
    const sIdx = (lagnaSign + h - 1) % 12;
    const jLink = getTransitAspectLink('Jupiter', tJup.signIndex, sIdx);
    const sLink = getTransitAspectLink('Saturn', tSat.signIndex, sIdx);
    if (jLink && sLink) {
      doubleTransitHouses.push({
        house: h,
        signName: SIGNS[sIdx].name,
        jupiterLink: jLink,
        saturnLink: sLink,
        savBindus: natalChart.ashtakavarga.sarva[sIdx],
        meaning: HOUSE_TOPICS[h - 1],
      });
    }
  }

  const items: DeepTransitItem[] = NINE_GRAHAS.map((g) => {
    const tp = transitChart.planets.find((p) => p.id === g)!;
    const houseFromMoon = ((tp.signIndex - moonSign + 12) % 12) + 1;
    const houseFromLagna = ((tp.signIndex - lagnaSign + 12) % 12) + 1;

    const d9Placement = transitChart.divisionalCharts.D9.placements.find((p) => p.id === g)!;
    const d10Placement = transitChart.divisionalCharts.D10.placements.find((p) => p.id === g)!;
    const d9HouseFromNatalD9Lagna = ((d9Placement.signIndex - natalD9Lagna + 12) % 12) + 1;

    // Kakshya evaluation (each 3.75° = 1/8th of a sign)
    const kakshyaIdx = Math.min(7, Math.floor(tp.degreeInSign / 3.75));
    const kakshyaLord = KAKSHYA_LORDS[kakshyaIdx];
    let kakshyaHasBindu = false;
    if (SEVEN_PLANETS.includes(g as SevenPlanetId)) {
      const refBody =
        kakshyaLord === 'Asc'
          ? natalChart.ascendant
          : natalChart.planets.find((p) => p.id === kakshyaLord);
      if (refBody) {
        const hDiff = ((tp.signIndex - refBody.signIndex + 12) % 12) + 1;
        kakshyaHasBindu = hasAshtakavargaBindu(g as SevenPlanetId, kakshyaLord, hDiff);
      }
    } else {
      kakshyaHasBindu = natalChart.ashtakavarga.sarva[tp.signIndex] >= 28;
    }

    // Tara Bala
    const taraIdx = ((tp.nakshatraIndex - natalMoon.nakshatraIndex + 27) % 27) % 9;
    const taraName = TARA_LABELS[taraIdx];
    const taraGood = [1, 3, 5, 7, 8].includes(taraIdx);

    // Gochar & Vedha
    const isGood = GOCHAR_GOOD_HOUSES[g].includes(houseFromMoon);
    const vedhaH = GOCHAR_VEDHA_MAP[g][houseFromMoon];
    let hasVedha = false;
    let vedhaPlanet: string | undefined;
    if (isGood && vedhaH) {
      const blockers = (occupantsFromMoon.get(vedhaH) ?? []).filter(
        (other) => other !== g && !isVedhaExemptPair(g, other)
      );
      if (blockers.length > 0) {
        hasVedha = true;
        vedhaPlanet = blockers.join(', ');
      }
    }

    const savBindus = natalChart.ashtakavarga.sarva[tp.signIndex];

    let verdict: DeepTransitItem['verdict'];
    if (isGood && !hasVedha && (savBindus >= 28 || kakshyaHasBindu)) {
      verdict = 'Strong & Auspicious';
    } else if (isGood && !hasVedha) {
      verdict = 'Auspicious';
    } else if (isGood && hasVedha) {
      verdict = 'Obstructed (Vedha)';
    } else if (savBindus >= 29 || kakshyaHasBindu) {
      verdict = 'Mixed / Kakshya Supported';
    } else {
      verdict = 'Testing';
    }

    const reading = `${g} transits ${tp.signName} (H${houseFromMoon} from Moon, H${houseFromLagna} from Lagna) and activates D9 ${d9Placement.signName} (H${d9HouseFromNatalD9Lagna} from D9 Lagna) & D10 ${d10Placement.signName}. Currently in ${kakshyaLord} Kakshya (${kakshyaHasBindu ? 'bindu-supported' : 'no Kakshya boost'}), ${taraName} Tara, ${savBindus} SAV bindus${hasVedha ? `, Vedha by ${vedhaPlanet}` : ''}.`;

    return {
      planet: g,
      transitSign: tp.signName,
      degreeInSign: tp.degreeInSign,
      nakshatraName: NAKSHATRAS[tp.nakshatraIndex].name,
      houseFromMoon,
      houseFromLagna,
      d9TransitSign: d9Placement.signName,
      d9HouseFromNatalD9Lagna,
      d10TransitSign: d10Placement.signName,
      savBindus,
      kakshyaLord,
      kakshyaHasBindu,
      taraName,
      taraGood,
      hasVedha,
      vedhaPlanet,
      verdict,
      reading,
    };
  });

  const overallSummary =
    doubleTransitHouses.length > 0
      ? `Jupiter (${tJup.signName}) and Saturn (${tSat.signName}) form a classical Double Transit on House${doubleTransitHouses.length > 1 ? 's' : ''} ${doubleTransitHouses.map((d) => `${d.house} (${d.signName})`).join(', ')}, priming these life areas for concrete events when supported by Dashas.`
      : `Jupiter (${tJup.signName}) and Saturn (${tSat.signName}) focus on separate houses right now, encouraging gradual preparation rather than sudden upheaval.`;

  return {
    targetDate,
    transitChart,
    doubleTransitHouses,
    items,
    overallSummary,
  };
}
