import type { ChartData, NineGrahaId } from './types';
import { formatLocalDateTimeFromUtc } from './time';

export interface LalKitabDetailedPlanet {
  planet: NineGrahaId;
  natalHouse: number;
  varshaHouse: number;
  pakkaGhar: number;
  exaltedHouses: number[];
  debilitatedHouses: number[];
  statusEn: string;
  statusHi: string;
  isSleeping: boolean;
  remedyEn: string;
  remedyHi: string;
}

export interface LalKitabDashaRow {
  planet: NineGrahaId;
  years: number;
  cycle: number;
  startAge: number;
  endAge: number;
  startDate: string;
  endDate: string;
  effectEn: string;
  effectHi: string;
}

export interface FullLalKitabReport {
  tevaTypeEn: string;
  tevaTypeHi: string;
  tevaReasonEn: string;
  tevaReasonHi: string;
  sleepingPlanets: NineGrahaId[];
  targetAge: number;
  targetYear: number;
  planets: LalKitabDetailedPlanet[];
  dasha35: LalKitabDashaRow[];
}

const LK_PAKKA: Record<NineGrahaId, number> = {
  Sun: 1, Moon: 4, Mars: 3, Mercury: 7, Jupiter: 2, Venus: 7, Saturn: 8, Rahu: 12, Ketu: 6,
};

const LK_EXALTED: Record<NineGrahaId, number[]> = {
  Sun: [1], Moon: [2], Mars: [10], Mercury: [6], Jupiter: [4], Venus: [12], Saturn: [7], Rahu: [3, 6], Ketu: [9, 12],
};

const LK_DEBILITATED: Record<NineGrahaId, number[]> = {
  Sun: [7], Moon: [8], Mars: [4], Mercury: [12], Jupiter: [10], Venus: [6], Saturn: [1], Rahu: [9, 12], Ketu: [3, 6],
};

// Classic Lal Kitab aspect activation: House h aspects (1-based)
const LK_ASPECT_TARGETS: Record<number, number[]> = {
  1: [7], 2: [6], 3: [9, 11], 4: [10], 5: [9], 6: [12], 7: [], 8: [2], 9: [3, 5], 10: [4], 11: [3], 12: [],
};

// Authentic 12-year repeating Lal Kitab Varshaphal permutation table (Age = 1..12 mod 12; each row maps Natal House 1..12 -> Annual House 1..12)
const LK_VARSHA_PERMS: number[][] = [
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],     // Age 1, 13, 25, 37...
  [4, 8, 12, 10, 7, 9, 11, 1, 5, 2, 6, 3],     // Age 2, 14, 26, 38...
  [9, 5, 11, 1, 6, 12, 2, 10, 4, 8, 3, 7],     // Age 3, 15, 27, 39...
  [10, 7, 1, 2, 8, 5, 3, 6, 12, 4, 9, 11],     // Age 4, 16, 28, 40...
  [11, 9, 6, 7, 1, 2, 8, 3, 10, 5, 12, 4],     // Age 5, 17, 29, 41...
  [6, 10, 8, 9, 4, 1, 12, 5, 7, 3, 2, 11],     // Age 6, 18, 30, 42...
  [3, 11, 4, 8, 9, 10, 1, 7, 6, 12, 5, 2],     // Age 7, 19, 31, 43...
  [2, 1, 10, 5, 12, 3, 6, 4, 8, 11, 7, 9],     // Age 8, 20, 32, 44...
  [5, 6, 2, 12, 3, 8, 4, 11, 1, 9, 10, 7],     // Age 9, 21, 33, 45...
  [7, 4, 9, 3, 10, 11, 5, 12, 2, 1, 8, 6],     // Age 10, 22, 34, 46...
  [12, 3, 5, 6, 2, 7, 10, 9, 11, 1, 4, 8],     // Age 11, 23, 35, 47...
  [8, 12, 7, 11, 10, 4, 9, 2, 3, 6, 1, 5],     // Age 12, 24, 36, 48...
];

// Lal Kitab 35-Year Maha-Dasha Chakra (Saturn 6 -> Rahu 6 -> Ketu 3 -> Jupiter 6 -> Sun 2 -> Moon 1 -> Venus 3 -> Mars 6 -> Mercury 2)
const LK_35_ORDER: Array<{
  planet: NineGrahaId;
  years: number;
  effectEn: string;
  effectHi: string;
}> = [
  { planet: 'Saturn', years: 6, effectEn: 'Work discipline, real estate tests & institutional endurance.', effectHi: 'कर्म अनुशासन, संपत्ति परीक्षा व परिश्रम से स्थायी लाभ।' },
  { planet: 'Rahu', years: 6, effectEn: 'Sudden ambition shifts, mental alertness & foreign links.', effectHi: 'आकस्मिक मोड़, तीक्ष्ण बुद्धि व विदेश/तकनीकी अवसर।' },
  { planet: 'Ketu', years: 3, effectEn: 'Spiritual intuition, travel, progeny focus & inner clarity.', effectHi: 'आध्यात्म, यात्रा, संतान विषय व आंतरिक जागृति।' },
  { planet: 'Jupiter', years: 6, effectEn: 'Fortune expansion, wisdom, family honors & prosperity.', effectHi: 'भाग्य उदय, ज्ञान, पारिवारिक सम्मान व आर्थिक विस्तार।' },
  { planet: 'Sun', years: 2, effectEn: 'Authority visibility, leadership, father & government gains.', effectHi: 'राजकीय सम्मान, नेतृत्व, पिता व प्रतिष्ठा में वृद्धि।' },
  { planet: 'Moon', years: 1, effectEn: 'Mental peace, mother blessings, comfort & emotional renewal.', effectHi: 'मन की शांति, माता का आशीर्वाद व गृह-सुख।' },
  { planet: 'Venus', years: 3, effectEn: 'Marriage harmony, luxuries, vehicle, wealth & artistic charm.', effectHi: 'दांपत्य सुख, वाहन, ऐश्वर्य, धन व कलात्मक उन्नति।' },
  { planet: 'Mars', years: 6, effectEn: 'Courage, property acquisition, siblings & decisive execution.', effectHi: 'पराक्रम, भूमि-मकान लाभ, भाई-बहन व कार्य सिद्धि।' },
  { planet: 'Mercury', years: 2, effectEn: 'Business acumen, education, speech & intellectual gains.', effectHi: 'व्यापारिक सफलता, शिक्षा, वाणी व बौद्धिक लाभ।' },
];

const LK_REMEDIES_BY_PLANET: Record<NineGrahaId, { en: string; hi: string }> = {
  Sun: { en: 'Offer water to morning Sun; keep copper coin or avoid ego conflicts with elders.', hi: 'प्रातः सूर्य को जल अर्पित करें; तांबे का सिक्का रखें व बुजुर्गों से सम्मान रखें।' },
  Moon: { en: 'Touch mother’s feet, drink water in silver vessel, avoid wasting milk.', hi: 'माता का आशीर्वाद लें, चाँदी के गिलास में जल पिएँ व दूध व्यर्थ न बहाएँ।' },
  Mars: { en: 'Donate sweet rotis or red lentils on Tuesdays; avoid quarrels with siblings.', hi: 'मंगलवार को मीठी रोटी या मसूर दान करें व भाई-बहनों से प्रेम रखें।' },
  Mercury: { en: 'Feed green fodder to cows on Wednesdays; keep dental hygiene & honor daughters.', hi: 'बुधवार को गाय को हरी घास दें, दांत स्वच्छ रखें व कन्याओं को उपहार दें।' },
  Jupiter: { en: 'Apply saffron/turmeric tilak, water a peepal tree or serve teachers on Thursdays.', hi: 'माथे पर केसर/हल्दी का तिलक लगाएँ, गुरुवार को पीपल में जल दें व गुरुओं का सम्मान करें।' },
  Venus: { en: 'Respect spouse cleanly, feed white sweets/fodder to cows on Fridays.', hi: 'जीवनसाथी का सम्मान करें, स्वच्छ वस्त्र-सुगंध रखें व शुक्रवार को गौ सेवा करें।' },
  Saturn: { en: 'Serve blind/needy persons on Saturdays; float black sesame or oil charity in moderation.', hi: 'शनिवार को नेत्रहीन/निर्धनों की सहायता करें, छाया दान या काले तिल दान करें।' },
  Rahu: { en: 'Keep electric/attic clutter clean, carry a square silver piece in pocket.', hi: 'घर की छत/बिजली का सामान साफ रखें व जेब में चौकोर चाँदी का टुकड़ा रखें।' },
  Ketu: { en: 'Feed stray dogs bread/milk, honor Ganesha & maintain honest conduct.', hi: 'श्वान (कुत्ते) को रोटी खिलाएँ, भगवान गणेश की पूजा करें व पीठ पीछे निंदा से बचें।' },
};

export function getLalKitabVarshaHouse(natalHouse: number, age: number): number {
  const safeAge = Math.max(1, Math.min(120, Math.round(age)));
  const rowIdx = (safeAge - 1) % 12;
  const hIdx = Math.max(0, Math.min(11, natalHouse - 1));
  return LK_VARSHA_PERMS[rowIdx][hIdx];
}

export function computeFullLalKitabReport(
  chart: ChartData,
  targetYear: number = new Date().getFullYear()
): FullLalKitabReport {
  const birthYear = parseInt(chart.input.date.slice(0, 4), 10) || 2000;
  const targetAge = Math.max(1, Math.min(120, targetYear - birthYear + 1));

  // Houses occupied by planets in Natal D1
  const occupiedMap = new Map<number, NineGrahaId[]>();
  for (let h = 1; h <= 12; h++) occupiedMap.set(h, []);
  for (const p of chart.planets) {
    if (p.id !== 'Uranus' && p.id !== 'Neptune' && p.id !== 'Pluto') {
      occupiedMap.get(p.rasiHouseNumber)?.push(p.id as NineGrahaId);
    }
  }

  // Sleeping planets (no planet sits in a house casting LK aspect on p's house)
  const activatedHouses = new Set<number>();
  for (const [srcHouse, occ] of occupiedMap.entries()) {
    if (occ.length === 0) continue;
    // Planet in srcHouse awakens targets
    for (const dst of LK_ASPECT_TARGETS[srcHouse] ?? []) {
      activatedHouses.add(dst);
    }
    if (occ.length >= 2) {
      activatedHouses.add(srcHouse);
    }
  }

  const sleepingPlanets: NineGrahaId[] = [];
  const grahas = chart.planets.filter(
    (p): p is typeof p & { id: NineGrahaId } =>
      !['Uranus', 'Neptune', 'Pluto'].includes(p.id)
  );

  const planets: LalKitabDetailedPlanet[] = grahas.map((p) => {
    const h = p.rasiHouseNumber;
    const vh = getLalKitabVarshaHouse(h, targetAge);
    const pakkaGhar = LK_PAKKA[p.id];
    const exH = LK_EXALTED[p.id];
    const debH = LK_DEBILITATED[p.id];
    const isSleep = !activatedHouses.has(h) && !exH.includes(h) && h !== pakkaGhar;
    if (isSleep) sleepingPlanets.push(p.id);

    let statusEn = 'Neutral Seat';
    let statusHi = 'सामान्य स्थिति';
    if (exH.includes(h) || h === pakkaGhar) {
      statusEn = h === pakkaGhar ? 'Pakka Ghar / Strong' : 'Exalted House (Uch)';
      statusHi = h === pakkaGhar ? 'पक्का घर (अति बली)' : 'उच्च घर (शुभ बली)';
    } else if (debH.includes(h)) {
      statusEn = 'Debilitated House (Neech)';
      statusHi = 'नीच घर (उपाय अपेक्षित)';
    }

    const rem = LK_REMEDIES_BY_PLANET[p.id];
    return {
      planet: p.id,
      natalHouse: h,
      varshaHouse: vh,
      pakkaGhar,
      exaltedHouses: exH,
      debilitatedHouses: debH,
      statusEn,
      statusHi,
      isSleeping: isSleep,
      remedyEn: rem.en,
      remedyHi: rem.hi,
    };
  });

  // Teva Classification (Dharmi / Andha / Kana / Ordinary)
  const saturn = grahas.find((p) => p.id === 'Saturn')!;
  const jupiter = grahas.find((p) => p.id === 'Jupiter')!;
  const venus = grahas.find((p) => p.id === 'Venus')!;
  const moon = grahas.find((p) => p.id === 'Moon')!;
  const saturnBlindsSun =
    saturn.rasiHouseNumber === 10 && [4, 5].includes(grahas.find((p) => p.id === 'Sun')!.rasiHouseNumber);
  const saturnInAndha = [4, 7].includes(saturn.rasiHouseNumber) && [10, 12].includes(moon.rasiHouseNumber);
  const dharmiCond =
    [1, 2, 5, 9, 12].includes(jupiter.rasiHouseNumber) && venus.rasiHouseNumber !== 6;

  let tevaTypeEn = 'Balanced Karmic Teva (Sadharan Teva)';
  let tevaTypeHi = 'संतुलित कर्मिक टेवा (साधारण टेवा)';
  let tevaReasonEn = 'No blind (Andha) affliction triggered; results respond directly to ethics and household remedies.';
  let tevaReasonHi = 'कुंडली अंधा टेवा से मुक्त है; शुभ आचरण व सरल उपायों से ग्रह उत्तम फल देते हैं।';

  if (saturnBlindsSun || saturnInAndha) {
    tevaTypeEn = 'Andha Teva (Blind Chart Check)';
    tevaTypeHi = 'अंधा टेवा (विशेष सावधानी योग)';
    tevaReasonEn = 'Lal Kitab classical planetary aspect creates blind spot on luck/vision unless awakened with light & service remedies.';
    tevaReasonHi = 'शनि व चंद्र/सूर्य के विशिष्ट भाव योग के कारण अंधा टेवा बनता है — नेत्रहीन सेवा व दीप/सूर्य उपाय शीघ्र लाभकारी हैं।';
  } else if (dharmiCond) {
    tevaTypeEn = 'Dharmi Teva (Righteous & Blessed Chart)';
    tevaTypeHi = 'धर्मी टेवा (शुभ एवं धर्मयुक्त कुंडली)';
    tevaReasonEn = 'Benefic Jupiter/religion houses protect the chart — truthfulness, temple/elder respect bring rising prosperity.';
    tevaReasonHi = 'गुरु की शुभ स्थिति से धर्मी टेवा बनता है — सत्य, धर्म और बुजुर्गों के आशीर्वाद से निरंतर भाग्योदय होता है।';
  } else if (sleepingPlanets.length >= 4) {
    tevaTypeEn = 'Kana / Dormant-House Teva';
    tevaTypeHi = 'काना / सुप्त भाव टेवा';
    tevaReasonEn = `${sleepingPlanets.length} planets sit un-aspected; awakening key houses activates stalled gains.`;
    tevaReasonHi = `कुंडली में ${sleepingPlanets.length} ग्रह सुप्त (Soye Hue) हैं — सरल लाल किताब उपायों से उन्हें जागृत करना फलदायी होगा।`;
  }

  // 35-Year Dasha (2 full cycles = 70y + 3rd cycle = 105y)
  const dasha35: LalKitabDashaRow[] = [];
  let cursorAge = 0;
  let cursorMs = chart.utcMs;
  const msPerYear = 365.2425 * 86_400_000;
  for (let cycle = 1; cycle <= 3; cycle++) {
    for (const item of LK_35_ORDER) {
      const endAge = cursorAge + item.years;
      const endMs = cursorMs + item.years * msPerYear;
      dasha35.push({
        planet: item.planet,
        years: item.years,
        cycle,
        startAge: cursorAge,
        endAge,
        startDate: formatLocalDateTimeFromUtc(cursorMs, chart.offsetMinutesUsed).slice(0, 10),
        endDate: formatLocalDateTimeFromUtc(endMs, chart.offsetMinutesUsed).slice(0, 10),
        effectEn: item.effectEn,
        effectHi: item.effectHi,
      });
      cursorAge = endAge;
      cursorMs = endMs;
    }
  }

  return {
    tevaTypeEn,
    tevaTypeHi,
    tevaReasonEn,
    tevaReasonHi,
    sleepingPlanets,
    targetAge,
    targetYear,
    planets,
    dasha35,
  };
}
