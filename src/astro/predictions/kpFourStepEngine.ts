import { NAKSHATRAS, NINE_GRAHAS, SEVEN_PLANETS, SIGNS } from '../constants';
import type { BodyPosition, ChartData, NineGrahaId, PlanetId, SevenPlanetId } from '../types';

export interface KpFourStepPlanetRow {
  planet: NineGrahaId;
  residingHouse: number;
  ownedHouses: number[];
  isStrongSignificator: boolean;
  step1Planet: {
    planet: NineGrahaId;
    residingHouse: number;
    ownedHouses: number[];
    significations: number[];
  };
  step2StarLord: {
    starLord: NineGrahaId;
    residingHouse: number;
    ownedHouses: number[];
    significations: number[];
  };
  step3SubLord: {
    subLord: NineGrahaId;
    residingHouse: number;
    ownedHouses: number[];
    significations: number[];
  };
  step4SubStarLord: {
    subStarLord: NineGrahaId;
    residingHouse: number;
    ownedHouses: number[];
    significations: number[];
  };
  compositeSignifications: number[];
}

export interface KpEventPromiseResult {
  eventNameEn: string;
  eventNameHi: string;
  primaryHouses: number[];
  supportingHouses: number[];
  negatingHouses: number[];
  relevantCusp: number;
  cuspSubLord: NineGrahaId;
  fructificationPromise: 'Highly Favorable' | 'Favorable / Supported' | 'Moderate / Conditional' | 'Delayed / Challenging' | 'Denied / Negated';
  fructificationPromiseHi: string;
  analysisEn: string;
  analysisHi: string;
}

export interface KpFourStepReport {
  planetSignifications: KpFourStepPlanetRow[];
  eventPromises: KpEventPromiseResult[];
  activeDashaEvaluation: {
    dashaLord: string;
    dashaSignifications: number[];
    verdictEn: string;
    verdictHi: string;
  };
}

function houseBetween(fromSign: number, toSign: number): number {
  return ((toSign - fromSign + 12) % 12) + 1;
}

// 27 Nakshatras Vimshottari Lords
const NAKSHATRA_LORDS: NineGrahaId[] = [
  'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury', // 0-8
  'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury', // 9-17
  'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury', // 18-26
];

// KP Sub Lord calculation table
const VIMSHOTTARI_YEARS: Record<NineGrahaId, number> = {
  Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7, Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17,
};
const VIMSHOTTARI_ORDER: NineGrahaId[] = [
  'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury',
];

export function getStarLord(longitudeDeg: number): NineGrahaId {
  const nakIndex = Math.floor(((longitudeDeg % 360) + 360) % 360 / (360 / 27));
  return NAKSHATRA_LORDS[nakIndex % 27];
}

export function getSubLord(longitudeDeg: number): NineGrahaId {
  const norm = ((longitudeDeg % 360) + 360) % 360;
  const nakArc = 360 / 27; // 13° 20' = 13.333333°
  const nakIndex = Math.floor(norm / nakArc);
  const degInNak = norm - (nakIndex * nakArc);
  
  // Starting sublord is the star lord itself
  const starLord = NAKSHATRA_LORDS[nakIndex % 27];
  const startIdx = VIMSHOTTARI_ORDER.indexOf(starLord);

  let accumulated = 0;
  for (let i = 0; i < 9; i++) {
    const currLord = VIMSHOTTARI_ORDER[(startIdx + i) % 9];
    const span = (VIMSHOTTARI_YEARS[currLord] / 120) * nakArc;
    accumulated += span;
    if (degInNak <= accumulated + 1e-6) {
      return currLord;
    }
  }
  return starLord;
}

export function computeKpFourStepReport(chart: ChartData): KpFourStepReport {
  const ascSign = chart.ascendant.signIndex;
  const pMap = new Map<NineGrahaId, BodyPosition>();
  for (const p of chart.planets) {
    pMap.set(p.id as NineGrahaId, p);
  }

  // Calculate owned houses for each planet
  const ownedHousesMap = new Map<NineGrahaId, number[]>();
  for (const id of NINE_GRAHAS) {
    ownedHousesMap.set(id, []);
  }
  for (let h = 1; h <= 12; h++) {
    const sIdx = (ascSign + h - 1) % 12;
    const lord = SIGNS[sIdx].lord;
    ownedHousesMap.get(lord as NineGrahaId)?.push(h);
  }

  // Tenant check: count how many planets occupy the star of planet X
  const starTenantCount = new Map<NineGrahaId, number>();
  for (const id of NINE_GRAHAS) starTenantCount.set(id, 0);

  for (const p of chart.planets) {
    const sl = getStarLord(p.longitude);
    starTenantCount.set(sl, (starTenantCount.get(sl) || 0) + 1);
  }

  // Occupants in houses
  const houseOccupants = new Map<number, NineGrahaId[]>();
  for (let h = 1; h <= 12; h++) houseOccupants.set(h, []);
  for (const p of chart.planets) {
    const h = houseBetween(ascSign, p.signIndex);
    houseOccupants.get(h)?.push(p.id as NineGrahaId);
  }

  const getPlanetSignifications = (pId: NineGrahaId) => {
    const p = pMap.get(pId);
    if (!p) return { residing: 1, owned: [], all: [1] };
    const residing = houseBetween(ascSign, p.signIndex);
    const owned = ownedHousesMap.get(pId) || [];
    const all = Array.from(new Set([residing, ...owned]));
    return { residing, owned, all };
  };

  // Build the 4 steps for each of the 9 Grahas
  const planetSignifications: KpFourStepPlanetRow[] = [];

  for (const p of chart.planets) {
    const pId = p.id as NineGrahaId;
    const residingH = houseBetween(ascSign, p.signIndex);
    const ownedH = ownedHousesMap.get(pId) || [];

    const starLord = getStarLord(p.longitude);
    const subLord = getSubLord(p.longitude);
    const subBody = pMap.get(subLord);
    const subStarLord = subBody ? getStarLord(subBody.longitude) : starLord;

    const tenantsInMyStar = starTenantCount.get(pId) || 0;
    const isOwnStar = starLord === pId;
    const isStrong = tenantsInMyStar === 0 || isOwnStar;

    const s1 = getPlanetSignifications(pId);
    const s2 = getPlanetSignifications(starLord);
    const s3 = getPlanetSignifications(subLord);
    const s4 = getPlanetSignifications(subStarLord);

    const composite = Array.from(new Set([...s1.all, ...s2.all, ...s3.all, ...s4.all])).sort((a, b) => a - b);

    planetSignifications.push({
      planet: pId,
      residingHouse: residingH,
      ownedHouses: ownedH,
      isStrongSignificator: isStrong,
      step1Planet: { planet: pId, residingHouse: s1.residing, ownedHouses: s1.owned, significations: s1.all },
      step2StarLord: { starLord, residingHouse: s2.residing, ownedHouses: s2.owned, significations: s2.all },
      step3SubLord: { subLord, residingHouse: s3.residing, ownedHouses: s3.owned, significations: s3.all },
      step4SubStarLord: { subStarLord, residingHouse: s4.residing, ownedHouses: s4.owned, significations: s4.all },
      compositeSignifications: composite,
    });
  }

  // 12 House Cusp Sub Lords (approximated from equal house or ascendant offset)
  const cuspSubLords = new Map<number, NineGrahaId>();
  for (let h = 1; h <= 12; h++) {
    const cuspDeg = (chart.ascendant.longitude + (h - 1) * 30) % 360;
    cuspSubLords.set(h, getSubLord(cuspDeg));
  }

  // Life Event Rules
  const EVENT_RULES: Array<{
    nameEn: string;
    nameHi: string;
    cusp: number;
    primary: number[];
    supporting: number[];
    negating: number[];
  }> = [
    { nameEn: 'Vitality & Long Life', nameHi: 'आरोग्य, जीवन शक्ति व दीर्घायु', cusp: 1, primary: [1, 3], supporting: [8, 11], negating: [6, 12] },
    { nameEn: 'Wealth & Financial Growth', nameHi: 'धन संचय, वित्त व तरल संपत्ति', cusp: 2, primary: [2], supporting: [6, 11], negating: [5, 8, 12] },
    { nameEn: 'Higher Education & Research', nameHi: 'उच्च विद्या, शोध व ज्ञानोपलब्धि', cusp: 4, primary: [4], supporting: [9, 11], negating: [3, 8] },
    { nameEn: 'Children & Progeny Blessings', nameHi: 'संतान प्राप्ति व वंश वृद्धि', cusp: 5, primary: [5], supporting: [2, 11], negating: [1, 4, 10] },
    { nameEn: 'Job, Service & Career Growth', nameHi: 'नौकरी, प्रशासनिक पद व पदोन्नति', cusp: 10, primary: [10], supporting: [2, 6, 11], negating: [5, 9] },
    { nameEn: 'Marriage & Lasting Partnership', nameHi: 'विवाह, दांपत्य सुख व व्यापारिक संबंध', cusp: 7, primary: [7], supporting: [2, 11], negating: [1, 6, 10] },
    { nameEn: 'Foreign Travel & Resettlement', nameHi: 'विदेश यात्रा, प्रवास व सुदूर लाभ', cusp: 12, primary: [12], supporting: [3, 9], negating: [4] },
    { nameEn: 'Fulfillment of Ambitions & Gains', nameHi: 'मनोकामना सिद्धि व प्रचुर लाभ', cusp: 11, primary: [11], supporting: [2, 6, 10], negating: [12] },
  ];

  const eventPromises: KpEventPromiseResult[] = [];

  for (const ev of EVENT_RULES) {
    const cSub = cuspSubLords.get(ev.cusp) || 'Jupiter';
    const subRow = planetSignifications.find(r => r.planet === cSub);
    const subSig = subRow ? subRow.compositeSignifications : [];

    const hasPrimary = ev.primary.some(h => subSig.includes(h));
    const hasSupporting = ev.supporting.some(h => subSig.includes(h));
    const hasNegating = ev.negating.some(h => subSig.includes(h));

    let promise: KpEventPromiseResult['fructificationPromise'] = 'Moderate / Conditional';
    let promiseHi = 'मध्यम / सशर्त फल';
    if (hasPrimary && hasSupporting && !hasNegating) {
      promise = 'Highly Favorable';
      promiseHi = 'अत्यंत शुभ व सुनिश्चित';
    } else if (hasPrimary && !hasNegating) {
      promise = 'Favorable / Supported';
      promiseHi = 'शुभ व अनुकूल';
    } else if (hasNegating && !hasPrimary) {
      promise = 'Denied / Negated';
      promiseHi = 'बाधित / प्रतिकूल संकेत';
    } else if (hasNegating && hasPrimary) {
      promise = 'Delayed / Challenging';
      promiseHi = 'विलंबित / संघर्षोपरांत फल';
    }

    const analysisEn = `Cusp ${ev.cusp} Sub Lord is ${cSub}. Its 4-step significations are [${subSig.join(', ')}]. Primary houses [${ev.primary.join(', ')}], supporting [${ev.supporting.join(', ')}], negating [${ev.negating.join(', ')}]. Result: ${promise}.`;
    const analysisHi = `${ev.cusp}वें भाव के उप-स्वामी (Sub Lord) ${cSub} हैं। इनकी 4-चरणीय संयुक्त कारकता [${subSig.join(', ')}] है। मुख्य भाव [${ev.primary.join(', ')}], सहयोगी भाव [${ev.supporting.join(', ')}], बाधक भाव [${ev.negating.join(', ')}] हैं। फलादेश: ${promiseHi}।`;

    eventPromises.push({
      eventNameEn: ev.nameEn,
      eventNameHi: ev.nameHi,
      primaryHouses: ev.primary,
      supportingHouses: ev.supporting,
      negatingHouses: ev.negating,
      relevantCusp: ev.cusp,
      cuspSubLord: cSub,
      fructificationPromise: promise,
      fructificationPromiseHi: promiseHi,
      analysisEn,
      analysisHi,
    });
  }

  // Active birth dasha evaluation from Moon's star lord
  const moon = pMap.get('Moon');
  const activeDashaLord = moon ? getStarLord(moon.longitude) : 'Saturn';
  const dRow = planetSignifications.find(r => r.planet === activeDashaLord);
  const dSig = dRow ? dRow.compositeSignifications : [];

  return {
    planetSignifications,
    eventPromises,
    activeDashaEvaluation: {
      dashaLord: activeDashaLord,
      dashaSignifications: dSig,
      verdictEn: `Dasha Lord ${activeDashaLord} actively activates Houses ${dSig.join(', ')} in the native's chart under KP 4-Step Rules. Matters relating to these houses are primary drivers of current life events.`,
      verdictHi: `वर्तमान दशा स्वामी ${activeDashaLord} केपी 4-चरणीय सिद्धांत के अंतर्गत भाव [${dSig.join(', ')}] को सक्रिय कर रहे हैं। इस अवधि में इन्हीं भावों से जुड़े फल जातक के जीवन को मुख्य रूप से प्रभावित करेंगे।`,
    },
  };
}
