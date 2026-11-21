import { SEVEN_PLANETS, SIGNS } from './constants';
import { parasharaAspectVirupas } from './strength';
import { formatDms, normalizeDeg } from './time';
import type { ChartData, SevenPlanetId } from './types';

export interface BhavaBalaRow {
  house: number;
  signIndex: number;
  signName: string;
  bhavaMadhyaDeg: number;
  bhavaMadhyaDms: string;
  lord: SevenPlanetId;
  signClassification: 'Human (Nara)' | 'Watery (Jalachara)' | 'Insect (Keeta)' | 'Quadruped (Chatushpada)';
  signClassificationHi: string;

  // 4 Components in Virupas (60 Virupas = 1 Rupa)
  bhavadhipatiBalaVirupas: number; // Lord's Shadbala
  bhavaDigbalaVirupas: number; // Directional strength
  bhavaDrishtiBalaVirupas: number; // Benefic minus malefic aspects on cusp
  bhavaDinaRatriBalaVirupas: number; // Day/night strength

  totalVirupas: number;
  totalRupas: number;
  rank: number; // 1 to 12
  isAdequate: boolean; // Standard benchmark >= 8.0 Rupas (480 Virupas)

  potencyVerdict: 'High Potency (प्रबल सामर्थ्य)' | 'Moderate Harmony (मध्यम प्रभाव)' | 'Conscious Effort Required (पुरुषार्थ साध्य)';
  interpretationEn: string;
  interpretationHi: string;
}

export interface BhavabalaMasterReport {
  birthTypeEn: string;
  birthTypeHi: string;
  strongestHouse: number;
  weakestHouse: number;
  averageRupas: number;
  houses: BhavaBalaRow[];
  highPotencyHouses: number[];
  remedialHouses: number[];
  overallSummaryEn: string;
  overallSummaryHi: string;
}

function getSignCategory(signIdx: number, degInSign: number): {
  cat: BhavaBalaRow['signClassification'];
  hi: string;
  peakHouse: number; // House where Digbala is 60 Virupas
} {
  // Human (Gemini 2, Virgo 5, Libra 6, Aquarius 10, Sagittarius 1st half 8) -> Peak H1
  // Watery (Cancer 3, Pisces 11, Capricorn 2nd half 9) -> Peak H4
  // Keeta (Scorpio 7) -> Peak H7
  // Quadruped (Aries 0, Taurus 1, Leo 4, Sagittarius 2nd half 8, Capricorn 1st half 9) -> Peak H10

  if (signIdx === 2 || signIdx === 5 || signIdx === 6 || signIdx === 10 || (signIdx === 8 && degInSign < 15)) {
    return { cat: 'Human (Nara)', hi: 'नर (द्विपद) राशि', peakHouse: 1 };
  }
  if (signIdx === 3 || signIdx === 11 || (signIdx === 9 && degInSign >= 15)) {
    return { cat: 'Watery (Jalachara)', hi: 'जलचर राशि', peakHouse: 4 };
  }
  if (signIdx === 7) {
    return { cat: 'Insect (Keeta)', hi: 'कीट राशि', peakHouse: 7 };
  }
  return { cat: 'Quadruped (Chatushpada)', hi: 'चतुष्पाद राशि', peakHouse: 10 };
}

export function computeBhavabalaReport(chart: ChartData): BhavabalaMasterReport {
  const sun = chart.planets.find((p) => p.id === 'Sun');
  const sunHouse = sun ? sun.rasiHouseNumber : 1;
  const isDayBirth = sunHouse >= 7 && sunHouse <= 12;

  // Map each planet to its Shadbala Virupas
  const shadbalaMap = new Map<SevenPlanetId, number>();
  for (const row of chart.shadbala) {
    shadbalaMap.set(row.planet, row.totalVirupas);
  }

  // Benefic vs Malefic for Drishti Bala
  const natalMoon = chart.planets.find((p) => p.id === 'Moon');
  const isMoonWaxing = natalMoon ? ((natalMoon.longitude - (sun?.longitude ?? 0) + 360) % 360) < 180 : true;

  const isBenefic = (pId: SevenPlanetId): boolean => {
    if (pId === 'Jupiter' || pId === 'Venus') return true;
    if (pId === 'Mercury') return true; // Standard natural benefic
    if (pId === 'Moon') return isMoonWaxing;
    return false;
  };

  const rows: Omit<BhavaBalaRow, 'rank'>[] = [];

  for (let h = 1; h <= 12; h++) {
    const cusp = chart.houses && chart.houses[h - 1] ? chart.houses[h - 1].midpoint : normalizeDeg(chart.ascendant.longitude + (h - 1) * 30);
    const signIdx = Math.floor(cusp / 30) % 12;
    const degInSign = cusp - signIdx * 30;
    const signMeta = SIGNS[signIdx];
    const lord = signMeta.lord;

    // 1. Bhavadhipati Bala (Lord's Shadbala in Virupas)
    const bhavadhipatiBala = shadbalaMap.get(lord) ?? 400;

    // 2. Bhava Digbala (0 to 60 Virupas based on sign category and distance from zero point)
    const signCat = getSignCategory(signIdx, degInSign);
    const zeroHouse = ((signCat.peakHouse + 6 - 1) % 12) + 1; // Opposite house where Digbala is 0
    let houseDistFromZero = (h - zeroHouse + 12) % 12;
    if (houseDistFromZero > 6) {
      houseDistFromZero = 12 - houseDistFromZero;
    }
    const bhavaDigbala = Math.round((houseDistFromZero / 6) * 60 * 10) / 10;

    // 3. Bhava Drishti Bala (Aspects on Bhava Madhya)
    let beneficAspectTotal = 0;
    let maleficAspectTotal = 0;

    for (const pl of chart.planets) {
      if (pl.id === 'Asc' || !SEVEN_PLANETS.includes(pl.id as SevenPlanetId)) continue;
      const pId = pl.id as SevenPlanetId;
      const angle = normalizeDeg(cusp - pl.longitude);
      const virupas = parasharaAspectVirupas(pId, angle);

      if (isBenefic(pId)) {
        beneficAspectTotal += virupas;
      } else {
        maleficAspectTotal += virupas;
      }
    }
    // Net drishti = (Benefic - Malefic) / 4 (in classical Virupas, can be positive or negative)
    const rawDrishti = (beneficAspectTotal - maleficAspectTotal) / 4;
    const bhavaDrishtiBala = Math.round(rawDrishti * 10) / 10;

    // 4. Bhava Dina-Ratri Bala
    // Shirshodaya signs (Gemini 2, Leo 4, Virgo 5, Libra 6, Scorpio 7, Aquarius 10) strong by day (15 Virupas).
    // Prishtodaya signs (Aries 0, Taurus 1, Cancer 3, Sagittarius 8, Capricorn 9) strong by night (15 Virupas).
    // Pisces 11 is Ubhayodaya (strong both day and night, 15 Virupas).
    const isShirshodaya = [2, 4, 5, 6, 7, 10].includes(signIdx);
    let dinaRatriBala = 15;
    if (signIdx === 11) {
      dinaRatriBala = 15;
    } else if (isDayBirth && isShirshodaya) {
      dinaRatriBala = 15;
    } else if (!isDayBirth && !isShirshodaya) {
      dinaRatriBala = 15;
    } else {
      dinaRatriBala = 0;
    }

    // Total Bhavabala
    const totalVirupas = Math.round((bhavadhipatiBala + bhavaDigbala + bhavaDrishtiBala + dinaRatriBala) * 10) / 10;
    const totalRupas = Math.round((totalVirupas / 60) * 100) / 100;
    const isAdequate = totalRupas >= 8.0; // 480 Virupas standard threshold

    let potencyVerdict: BhavaBalaRow['potencyVerdict'] = 'Moderate Harmony (मध्यम प्रभाव)';
    if (totalRupas >= 9.0) {
      potencyVerdict = 'High Potency (प्रबल सामर्थ्य)';
    } else if (totalRupas < 7.5) {
      potencyVerdict = 'Conscious Effort Required (पुरुषार्थ साध्य)';
    }

    const houseThemesEn = [
      'Vitality, personality & life path',
      'Wealth, speech & family assets',
      'Courage, enterprise & siblings',
      'Mother, home, happiness & vehicles',
      'Intellect, creativity & children',
      'Service, health & overcoming debts/foes',
      'Marriage, alliances & public contracts',
      'Longevity, research & deep transformation',
      'Dharma, higher wisdom, father & fortune',
      'Profession, social status & authority',
      'Gains, fulfillment of hopes & networks',
      'Spirituality, liberation & foreign realms',
    ][h - 1];

    const houseThemesHi = [
      'व्यक्तित्व, आरोग्यता व जीवन दिशा',
      'धन, वाणी व पारिवारिक संपत्ति',
      'पराक्रम, साहस व सहोदर सुख',
      'माता, गृह, वाहन व आंतरिक सुख',
      'बुद्धि, विद्या, संतान व पूर्वपुण्य',
      'सेवा, रोग-ऋण मुक्ति व शत्रु विजय',
      'विवाह, दांपत्य व सामाजिक साझेदारी',
      'आयु, गूढ़ विद्या व आध्यात्मिक परिवर्तन',
      'धर्म, भाग्य, पिता व उच्च ज्ञान',
      'कर्म, आजीविका, प्रतिष्ठा व शासन प्रभाव',
      'आय, अभीष्ट लाभ व जनसंपर्क',
      'मोक्ष, पारमार्थिक व्यय व विदेश गमन',
    ][h - 1];

    const interpEn = `House ${h} (${signMeta.name}, ruled by ${lord}): Total Bhavabala is ${totalRupas} Rupas (${totalVirupas} Virupas). Governs ${houseThemesEn}. ${
      potencyVerdict === 'High Potency (प्रबल सामर्थ्य)'
        ? 'Possesses abundant classical strength; delivers positive events with natural grace and minimal resistance.'
        : potencyVerdict === 'Moderate Harmony (मध्यम प्रभाव)'
          ? 'Healthy baseline stability; produces steady results through routine dedication.'
          : 'Demands conscious discipline, ethical grounding, and focused remedial focus to unlock its full promise.'
    }`;

    const interpHi = `भाव ${h} (${signMeta.name}, स्वामी: ${lord}): कुल भावबल ${totalRupas} रूप (${totalVirupas} विरूपा) है। यह ${houseThemesHi} का प्रतिनिधित्व करता है। ${
      potencyVerdict === 'High Potency (प्रबल सामर्थ्य)'
        ? 'पूर्ण शास्त्रीय बल से युक्त; बिना बड़े अवरोध के सहज व उत्कृष्ट परिणाम प्रदान करेगा।'
        : potencyVerdict === 'Moderate Harmony (मध्यम प्रभाव)'
          ? 'संतुलित प्रभाव; सामान्य पुरुषार्थ व नियमित प्रयासों से शुभ परिणाम मिलेंगे।'
          : 'सजग पुरुषार्थ, धैर्य व शांति उपायों की आवश्यकता ताकि इसके श्रेष्ठ फल प्राप्त हो सकें।'
    }`;

    rows.push({
      house: h,
      signIndex: signIdx,
      signName: signMeta.name,
      bhavaMadhyaDeg: Math.round(degInSign * 100) / 100,
      bhavaMadhyaDms: formatDms(degInSign),
      lord,
      signClassification: signCat.cat,
      signClassificationHi: signCat.hi,
      bhavadhipatiBalaVirupas: Math.round(bhavadhipatiBala * 10) / 10,
      bhavaDigbalaVirupas: bhavaDigbala,
      bhavaDrishtiBalaVirupas: bhavaDrishtiBala,
      bhavaDinaRatriBalaVirupas: dinaRatriBala,
      totalVirupas,
      totalRupas,
      isAdequate,
      potencyVerdict,
      interpretationEn: interpEn,
      interpretationHi: interpHi,
    });
  }

  // Assign ranks 1 to 12 (1 being highest totalVirupas)
  const sorted = [...rows].sort((a, b) => b.totalVirupas - a.totalVirupas);
  const rankMap = new Map<number, number>();
  sorted.forEach((r, idx) => {
    rankMap.set(r.house, idx + 1);
  });

  const finalRows: BhavaBalaRow[] = rows.map((r) => ({
    ...r,
    rank: rankMap.get(r.house) ?? 12,
  }));

  const strongest = sorted[0].house;
  const weakest = sorted[sorted.length - 1].house;
  const avgRupas = Math.round((finalRows.reduce((acc, r) => acc + r.totalRupas, 0) / 12) * 100) / 100;

  const highPotency = finalRows.filter((r) => r.potencyVerdict.startsWith('High')).map((r) => r.house);
  const remedial = finalRows.filter((r) => r.potencyVerdict.startsWith('Conscious')).map((r) => r.house);

  const summaryEn = `Comprehensive Bhavabala analysis confirms House ${strongest} as the preeminent pillar of strength (${sorted[0].totalRupas} Rupas), while House ${weakest} requires steady mindful nurturing (${sorted[sorted.length - 1].totalRupas} Rupas). The chart holds an average Bhavabala of ${avgRupas} Rupas across all 12 houses.`;
  const summaryHi = `सम्पूर्ण भावबल विश्लेषण के अनुसार भाव ${strongest} सर्वाधिक बली (${sorted[0].totalRupas} रूप) स्तंभ है, जबकि भाव ${weakest} को निरंतर धैर्य व संबल की आवश्यकता है (${sorted[sorted.length - 1].totalRupas} रूप)। जन्मकुंडली का औसत भावबल ${avgRupas} रूप है।`;

  return {
    birthTypeEn: isDayBirth ? 'Diurnal (Day Birth)' : 'Nocturnal (Night Birth)',
    birthTypeHi: isDayBirth ? 'दिन का जन्म' : 'रात्रि का जन्म',
    strongestHouse: strongest,
    weakestHouse: weakest,
    averageRupas: avgRupas,
    houses: finalRows,
    highPotencyHouses: highPotency,
    remedialHouses: remedial,
    overallSummaryEn: summaryEn,
    overallSummaryHi: summaryHi,
  };
}
