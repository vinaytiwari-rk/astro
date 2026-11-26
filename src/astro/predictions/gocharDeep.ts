import { hasAshtakavargaBindu } from '../ashtakavarga';
import { calculateChart } from '../calculator';
import { NAKSHATRAS, NINE_GRAHAS, SEVEN_PLANETS, SIGNS } from '../constants';
import { GOCHAR_GOOD_HOUSES, GOCHAR_VEDHA_MAP, isVedhaExemptPair } from './bhavaKb';
import { evaluateParamayusStatus } from './paramayus';
import type { ChartData, NineGrahaId, SevenPlanetId } from '../types';

export interface DeepTransitItem {
  planet: NineGrahaId;
  transitSign: string;
  transitSignHi: string;
  degreeInSign: number;
  speedDegPerDay: number;
  isRetrograde: boolean;
  motionLabel: 'Direct' | 'Retrograde' | 'Stationary';
  nakshatraName: string;
  houseFromMoon: number;
  houseFromLagna: number;
  d9TransitSign: string;
  d9HouseFromNatalD9Lagna: number;
  d10TransitSign: string;
  savBindus: number;
  bavBindus: number;
  kakshyaLord: SevenPlanetId | 'Asc';
  kakshyaHasBindu: boolean;
  taraName: string;
  taraNameHi: string;
  taraGood: boolean;
  hasVedha: boolean;
  vipareetaVedha: boolean;
  vedhaPlanet?: string;
  murti: 'Gold' | 'Silver' | 'Copper' | 'Iron';
  murtiHi: string;
  natalContactEn?: string;
  natalContactHi?: string;
  verdict: 'Strong & Auspicious' | 'Auspicious' | 'Obstructed (Vedha)' | 'Mixed / Kakshya Supported' | 'Testing';
  reading: string;
  readingHi: string;
}

export interface DoubleTransitActivation {
  house: number;
  signName: string;
  jupiterLink: string;
  saturnLink: string;
  savBindus: number;
  meaning: string;
  meaningHi: string;
}

export interface DeepGocharReport {
  targetDate: string;
  transitChart: ChartData;
  doubleTransitHouses: DoubleTransitActivation[];
  items: DeepTransitItem[];
  overallSummary: string;
  overallSummaryHi: string;
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

const HOUSE_TOPICS_HI = [
  'स्वयं, स्वास्थ्य और नई शुरुआत',
  'धन, परिवार और वाणी',
  'साहस, कौशल, भाई-बहन और छोटी यात्रा',
  'घर, संपत्ति, माता और मानसिक शांति',
  'सृजन, बुद्धि, प्रेम और संतान',
  'कार्य-दिनचर्या, सेवा, रोग-मुक्ति और शत्रु-विजय',
  'विवाह, साझेदारी और व्यावसायिक अनुबंध',
  'परिवर्तन, शोध, संयुक्त वित्त और दीर्घायु',
  'भाग्य, धर्म, गुरु, उच्च शिक्षा और लंबी यात्रा',
  'करियर उन्नति, प्रतिष्ठा और अधिकार',
  'आय वृद्धि, पदोन्नति, नेटवर्क और इच्छा-पूर्ति',
  'विदेश निवास, आध्यात्मिक एकांत और बड़े व्यय',
];

const SIGN_HI = ['मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या', 'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुंभ', 'मीन'];
const PLANET_HI: Record<NineGrahaId, string> = {
  Sun: 'सूर्य', Moon: 'चंद्र', Mars: 'मंगल', Mercury: 'बुध', Jupiter: 'गुरु',
  Venus: 'शुक्र', Saturn: 'शनि', Rahu: 'राहु', Ketu: 'केतु',
};

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

const TARA_LABELS_HI = [
  'जन्म',
  'संपत',
  'विपत',
  'क्षेम',
  'प्रत्यक',
  'साधन',
  'नैधन',
  'मित्र',
  'परम मित्र',
];

function computeMurti(houseFromMoon: number): { murti: DeepTransitItem['murti']; murtiHi: string } {
  if ([1, 6, 11].includes(houseFromMoon)) return { murti: 'Gold', murtiHi: 'स्वर्ण मूर्ति (श्रेष्ठ)' };
  if ([2, 5, 9].includes(houseFromMoon)) return { murti: 'Silver', murtiHi: 'रजत मूर्ति (शुभ)' };
  if ([3, 7, 10].includes(houseFromMoon)) return { murti: 'Copper', murtiHi: 'ताम्र मूर्ति (मध्यम)' };
  return { murti: 'Iron', murtiHi: 'लौह मूर्ति (परिश्रम)' };
}

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
      overallSummaryHi: paramayus.messageHi,
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
        meaningHi: HOUSE_TOPICS_HI[h - 1],
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
    const taraNameHi = TARA_LABELS_HI[taraIdx];
    const taraGood = [1, 3, 5, 7, 8].includes(taraIdx);

    // Gochar, Vedha & Vipareeta Vedha
    const isGood = GOCHAR_GOOD_HOUSES[g].includes(houseFromMoon);
    const vedhaH = GOCHAR_VEDHA_MAP[g][houseFromMoon];
    let hasVedha = false;
    let vipareetaVedha = false;
    let vedhaPlanet: string | undefined;
    if (isGood && vedhaH) {
      const blockers = (occupantsFromMoon.get(vedhaH) ?? []).filter(
        (other) => other !== g && !isVedhaExemptPair(g, other)
      );
      if (blockers.length > 0) {
        // Check Vipareeta Vedha: if any blocker's own Vedha house is occupied by another planet
        const blockerHasVedha = blockers.some((b) => {
          const bH = ((transitChart.planets.find((p) => p.id === b)!.signIndex - moonSign + 12) % 12) + 1;
          const bVedhaH = GOCHAR_VEDHA_MAP[b]?.[bH];
          if (!bVedhaH) return false;
          const counterBlockers = (occupantsFromMoon.get(bVedhaH) ?? []).filter(
            (cb) => cb !== b && !isVedhaExemptPair(b, cb)
          );
          return counterBlockers.length > 0;
        });
        if (blockerHasVedha) {
          vipareetaVedha = true;
          vedhaPlanet = blockers.join(', ');
        } else {
          hasVedha = true;
          vedhaPlanet = blockers.join(', ');
        }
      }
    }

    const savBindus = natalChart.ashtakavarga.sarva[tp.signIndex];
    const bavBindus = SEVEN_PLANETS.includes(g as SevenPlanetId)
      ? (natalChart.ashtakavarga.bhinna[g as SevenPlanetId]?.[tp.signIndex] ?? 4)
      : Math.round(savBindus / 7);
    const { murti, murtiHi } = computeMurti(houseFromMoon);
    const natalConjunct = natalChart.planets
      .filter((np) => np.signIndex === tp.signIndex)
      .map((np) => np.id);
    const natalContactEn = natalConjunct.length > 0 ? `Over natal ${natalConjunct.join(', ')}` : undefined;
    const natalContactHi = natalConjunct.length > 0
      ? `जन्म के ${natalConjunct.map((id) => PLANET_HI[id as NineGrahaId] || id).join(', ')} पर गोचर`
      : undefined;

    const motionLabel: DeepTransitItem['motionLabel'] = Math.abs(tp.speedDegPerDay) < 0.0001
      ? 'Stationary'
      : tp.isRetrograde ? 'Retrograde' : 'Direct';

    let verdict: DeepTransitItem['verdict'];
    if (isGood && !hasVedha && (savBindus >= 28 || kakshyaHasBindu || bavBindus >= 5)) {
      verdict = 'Strong & Auspicious';
    } else if (isGood && !hasVedha) {
      verdict = 'Auspicious';
    } else if (isGood && hasVedha) {
      verdict = 'Obstructed (Vedha)';
    } else if (savBindus >= 29 || kakshyaHasBindu || bavBindus >= 5) {
      verdict = 'Mixed / Kakshya Supported';
    } else {
      verdict = 'Testing';
    }

    const transitSignHi = SIGN_HI[tp.signIndex] ?? tp.signName;
    const reading = `${g} transits ${tp.signName} (H${houseFromMoon} from Moon, H${houseFromLagna} from Lagna, ${murti} Murti), moving ${motionLabel.toLowerCase()} at ${tp.speedDegPerDay.toFixed(4)}°/day, activating D9 ${d9Placement.signName} & D10 ${d10Placement.signName}. ${kakshyaLord} Kakshya (${kakshyaHasBindu ? 'bindu-supported' : 'no Kakshya boost'}), ${taraName} Tara, BAV ${bavBindus}/8, SAV ${savBindus}${hasVedha ? `, Vedha by ${vedhaPlanet}` : vipareetaVedha ? `, Vipareeta Vedha cancels ${vedhaPlanet}'s obstruction` : ''}${natalContactEn ? `, ${natalContactEn}` : ''}.`;
    const readingHi = `${PLANET_HI[g]} ${transitSignHi} राशि में गोचर कर रहे हैं (चंद्र से ${houseFromMoon}वां, लग्न से ${houseFromLagna}वां भाव, ${murtiHi})। गति: ${motionLabel === 'Retrograde' ? 'वक्री' : motionLabel === 'Stationary' ? 'स्तंभित' : 'मार्गी'}। ${kakshyaLord} कक्ष्या (${kakshyaHasBindu ? 'बिंदु-समर्थित' : 'सामान्य'}), ${taraNameHi} तारा, BAV ${bavBindus}/8, SAV ${savBindus}${hasVedha ? `, ${vedhaPlanet} से वेध` : vipareetaVedha ? `, विपरीत वेध से अवरोध भंग` : ''}${natalContactHi ? `, ${natalContactHi}` : ''}।`;

    return {
      planet: g,
      transitSign: tp.signName,
      transitSignHi,
      degreeInSign: tp.degreeInSign,
      speedDegPerDay: tp.speedDegPerDay,
      isRetrograde: tp.isRetrograde,
      motionLabel,
      nakshatraName: NAKSHATRAS[tp.nakshatraIndex].name,
      houseFromMoon,
      houseFromLagna,
      d9TransitSign: d9Placement.signName,
      d9HouseFromNatalD9Lagna,
      d10TransitSign: d10Placement.signName,
      savBindus,
      bavBindus,
      kakshyaLord,
      kakshyaHasBindu,
      taraName,
      taraNameHi,
      taraGood,
      hasVedha,
      vipareetaVedha,
      vedhaPlanet,
      murti,
      murtiHi,
      natalContactEn,
      natalContactHi,
      verdict,
      reading,
      readingHi,
    };
  });

  const overallSummary =
    doubleTransitHouses.length > 0
      ? `Jupiter (${tJup.signName}) and Saturn (${tSat.signName}) simultaneously aspect or occupy natal House${doubleTransitHouses.length > 1 ? 's' : ''} ${doubleTransitHouses.map((d) => `${d.house} (${d.signName})`).join(', ')} under Parashari aspect rules. Treat this as a shared timing corroborator when natal promise and Dasha also align; it does not guarantee an event.`
      : `Jupiter (${tJup.signName}) and Saturn (${tSat.signName}) do not simultaneously activate a natal house on this date; no Double Transit conclusion is drawn by this method.`;
  const overallSummaryHi =
    doubleTransitHouses.length > 0
      ? `गुरु (${SIGN_HI[tJup.signIndex]}) और शनि (${SIGN_HI[tSat.signIndex]}) एक साथ जन्मकुंडली के भाव ${doubleTransitHouses.map((d) => `${d.house} (${SIGN_HI[SIGNS.findIndex((s) => s.name === d.signName)] ?? d.signName})`).join(', ')} को सक्रिय कर रहे हैं। यह दोहरा गोचर दशा और जन्म-योग के साथ मिलकर परिणाम देता है।`
      : `गुरु (${SIGN_HI[tJup.signIndex]}) और शनि (${SIGN_HI[tSat.signIndex]}) इस तिथि को एक ही भाव पर दोहरा गोचर नहीं बना रहे हैं; फल व्यक्तिगत ग्रह BAV/कक्ष्या और दशा पर आधारित रहेगा।`;

  return {
    targetDate,
    transitChart,
    doubleTransitHouses,
    items,
    overallSummary,
    overallSummaryHi,
  };
}
