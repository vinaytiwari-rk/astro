import {
  NAKSHATRAS,
  NINE_GRAHAS,
  SEVEN_PLANETS,
  SIGNS,
  VIMSHOTTARI_ORDER,
  VIMSHOTTARI_YEARS,
} from '../constants';
import { computeKpSubLord } from '../vargas';
import { formatLocalDateTimeFromUtc, normalizeDeg } from '../time';
import type { BodyPosition, ChartData, NineGrahaId, SevenPlanetId } from '../types';
import { PLANET_IN_HOUSE_KB } from './bhavaKb';
import { LAGNA_EXTENDED_KB } from './extendedKb';
import { evaluateParamayusStatus } from './paramayus';

export interface DashaPredictionDetail {
  title: string;
  mdLord: string;
  adLord?: string;
  pdLord?: string;
  startDate: string;
  endDate: string;
  favorability: 'Very Favorable' | 'Supportive' | 'Mixed / Transformative' | 'Challenging';
  score: number;
  mdSummary: string;
  adSummary?: string;
  pdSummary?: string;
  activatedHouses: number[];
  d9AndD10Note: string;
  keyEffects: string[];
  guidance: string;
}

export type PrashnaCategory =
  | 'general'
  | 'career'
  | 'marriage'
  | 'wealth'
  | 'education'
  | 'health'
  | 'litigation'
  | 'travel'
  | 'property'
  | 'lost_object';

export interface PrashnaAnalysis {
  question: string;
  category: PrashnaCategory;
  categoryLabel: string;
  queryHouse: number;
  horaryNumber?: number;
  horaryAscSign?: string;
  horaryAscDms?: string;
  lagnaLord: SevenPlanetId;
  karyesha: SevenPlanetId;
  lagnaLordPlacement: string;
  karyeshaPlacement: string;
  tajikaYoga: string;
  tajikaDetail: string;
  moonCondition: string;
  panchangOmen: string;
  outcomeScore: number; // 1..100
  verdict: 'Strong Yes / Favorable' | 'Favorable with Effort' | 'Delayed / Conditional' | 'Unfavorable / Reconsider';
  timingEstimate: string;
  lostObjectDirection: string;
  kpHoraryNote: string;
  keyInsights: string[];
  advice: string;
}

const PLANET_ARCHETYPE: Record<NineGrahaId, string> = {
  Sun: 'authority, leadership, recognition, vitality, government, and paternal lineage',
  Moon: 'emotional peace, home, public connection, mother, travel, and fluid finances',
  Mars: 'courage, property/land, technical execution, siblings, competition, and decisive drive',
  Mercury: 'intellect, writing, business, contracts, learning, analytics, and communication',
  Jupiter: 'wisdom, fortune, children, marriage harmony, mentors, law, and financial expansion',
  Venus: 'relationships, marriage, comforts, vehicles, creative arts, and refined prosperity',
  Saturn: 'career discipline, enduring institutions, responsibility, hard-won gains, and patience',
  Rahu: 'ambitious breakthroughs, foreign links, technology, unconventional paths, and sudden rises',
  Ketu: 'spiritual insight, specialized mastery, detachment, research, and liberation from clutter',
};

const YOGINI_ARCHETYPE: Record<string, string> = {
  Mangala: 'auspicious beginnings, peace of mind, and gentle emotional support (Moon)',
  Pingala: 'active ambition, leadership tests, and visible vitality (Sun)',
  Dhanya: 'prosperity, wisdom, mentorship, and expansion (Jupiter)',
  Bhramari: 'restless travel, energetic shifts, and bold effort (Mars)',
  Bhadrika: 'learning, commercial skill, alliances, and intellectual clarity (Mercury)',
  Ulka: 'heavy duties, structural testing, and slow disciplined endurance (Saturn)',
  Siddha: 'fulfillment of desires, romance, artistic grace, and comforts (Venus)',
  Sankata: 'sudden twists requiring steady ethics, research, and detachment (Rahu)',
};

function digScore(dignity: string): number {
  const m: Record<string, number> = {
    Exalted: 18,
    Moolatrikona: 15,
    'Own Sign': 13,
    'Great Friend': 9,
    Friend: 6,
    Neutral: 0,
    Enemy: -6,
    'Great Enemy': -10,
    Debilitated: -13,
  };
  return m[dignity] ?? 0;
}

function ruledHouses(planet: SevenPlanetId, ascSign: number): number[] {
  const out: number[] = [];
  for (let h = 1; h <= 12; h++) {
    if (SIGNS[(ascSign + h - 1) % 12].lord === planet) out.push(h);
  }
  return out;
}

function relationLabel(h1: number, h2: number): { label: string; delta: number } {
  const d = ((h2 - h1 + 12) % 12) + 1;
  if (d === 1) return { label: 'Conjunction (1/1)', delta: 8 };
  if (d === 5 || d === 9) return { label: 'Trinal Harmony (5/9)', delta: 12 };
  if (d === 3 || d === 11) return { label: 'Upachaya Growth (3/11)', delta: 7 };
  if (d === 4 || d === 10) return { label: 'Angular Support (4/10)', delta: 5 };
  if (d === 7) return { label: 'Mutual 7th Aspect (7/7)', delta: 2 };
  if (d === 6 || d === 8) return { label: 'Shadashtaka Friction (6/8)', delta: -11 };
  return { label: 'Dwirdwadasha Adjustment (2/12)', delta: -6 };
}

export function predictDashaDetail(params: {
  chart: ChartData;
  system: 'vimshottari' | 'yogini';
  mdLordRaw: string;
  startMs: number;
  endMs: number;
  adLordRaw?: string;
  pdLordRaw?: string;
}): DashaPredictionDetail {
  const { chart, system, mdLordRaw, startMs, endMs, adLordRaw, pdLordRaw } = params;
  const startDate = formatLocalDateTimeFromUtc(startMs, chart.offsetMinutesUsed).slice(0, 10);
  const endDate = formatLocalDateTimeFromUtc(endMs, chart.offsetMinutesUsed).slice(0, 10);
  const paramayus = evaluateParamayusStatus(chart);
  if (paramayus.exceeded) {
    return {
      title: paramayus.titleEn,
      mdLord: mdLordRaw,
      adLord: adLordRaw,
      pdLord: pdLordRaw,
      startDate,
      endDate,
      favorability: 'Mixed / Transformative',
      score: 0,
      mdSummary: paramayus.messageEn,
      activatedHouses: [],
      d9AndD10Note: paramayus.noteEn,
      keyEffects: [],
      guidance: paramayus.noteEn,
    };
  }

  // Extract Graha id (Yogini passes e.g. "Siddha (Venus)")
  const extractGraha = (raw: string): NineGrahaId => {
    const match = raw.match(/\(([^)]+)\)/);
    const candidate = (match ? match[1] : raw) as NineGrahaId;
    return NINE_GRAHAS.includes(candidate) ? candidate : 'Sun';
  };

  const mdId = extractGraha(mdLordRaw);
  const adId = adLordRaw ? extractGraha(adLordRaw) : undefined;
  const pdId = pdLordRaw ? extractGraha(pdLordRaw) : undefined;

  const ascSign = chart.ascendant.signIndex;
  const lagnaExt = LAGNA_EXTENDED_KB[ascSign];
  const mdBody = chart.planets.find((p) => p.id === mdId)!;
  const adBody = adId ? chart.planets.find((p) => p.id === adId) : undefined;
  const pdBody = pdId ? chart.planets.find((p) => p.id === pdId) : undefined;

  const mdRuled = SEVEN_PLANETS.includes(mdId as SevenPlanetId)
    ? ruledHouses(mdId as SevenPlanetId, ascSign)
    : [];
  const adRuled =
    adId && SEVEN_PLANETS.includes(adId as SevenPlanetId)
      ? ruledHouses(adId as SevenPlanetId, ascSign)
      : [];

  const mdSav = chart.ashtakavarga.sarva[mdBody.signIndex];
  const mdShadbala = chart.shadbala.find((s) => s.planet === mdId)?.ratio ?? 1;

  const isMdBenefic = lagnaExt.beneficList.includes(mdId as SevenPlanetId);
  const isMdMalefic = lagnaExt.maleficList.includes(mdId as SevenPlanetId);

  let score =
    60 +
    digScore(mdBody.dignity) * 0.6 +
    (mdSav - 28) * 0.7 +
    (mdShadbala - 1) * 12 +
    (isMdBenefic ? 8 : isMdMalefic ? -5 : 0);

  let relNote = '';
  if (adBody) {
    const rel = relationLabel(mdBody.rasiHouseNumber, adBody.rasiHouseNumber);
    score += rel.delta + digScore(adBody.dignity) * 0.35;
    relNote = `MD–AD geometry is ${rel.label}.`;
  }

  score = Math.max(25, Math.min(96, Math.round(score)));
  const favorability: DashaPredictionDetail['favorability'] =
    score >= 76
      ? 'Very Favorable'
      : score >= 62
        ? 'Supportive'
        : score >= 48
          ? 'Mixed / Transformative'
          : 'Challenging';

  const yoginiPrefix =
    system === 'yogini'
      ? `Yogini ${mdLordRaw.split(' ')[0]} channels ${YOGINI_ARCHETYPE[mdLordRaw.split(' ')[0]] || 'cyclical karma'}. `
      : '';

  const mdKb = PLANET_IN_HOUSE_KB[mdId][mdBody.rasiHouseNumber - 1];
  const mdRole =
    lagnaExt.beneficList.includes(mdId as SevenPlanetId)
      ? 'functional benefic'
      : lagnaExt.maleficList.includes(mdId as SevenPlanetId)
        ? 'functional challenging lord'
        : 'neutral / nodal catalyst';

  const mdSummary = `${yoginiPrefix}${mdId} acts as a ${mdRole} for ${chart.ascendant.signName} Lagna, sitting in House ${mdBody.rasiHouseNumber} (${mdBody.signName}, ${mdBody.dignity}${mdRuled.length ? `, ruling House${mdRuled.length > 1 ? 's' : ''} ${mdRuled.join(' & ')}` : ''}). Themes center on ${PLANET_ARCHETYPE[mdId]}. Classical Bhava Phala: ${mdKb.headline}.`;

  let adSummary: string | undefined;
  if (adId && adBody) {
    const adKb = PLANET_IN_HOUSE_KB[adId][adBody.rasiHouseNumber - 1];
    adSummary = `${adId} Antardasha activates House ${adBody.rasiHouseNumber} (${adBody.signName}, ${adBody.dignity}${adRuled.length ? `, ruling H${adRuled.join('&')}` : ''}), bringing focus to ${PLANET_ARCHETYPE[adId]}. ${relNote} Key signature: ${adKb.headline}.`;
  }

  let pdSummary: string | undefined;
  if (pdId && pdBody) {
    pdSummary = `Pratyantardasha ruler ${pdId} in House ${pdBody.rasiHouseNumber} (${pdBody.signName}, ${pdBody.dignity}) sets day-to-day trigger timing around ${PLANET_ARCHETYPE[pdId]}.`;
  }

  const d9Md = chart.divisionalCharts.D9.placements.find((p) => p.id === mdId)!;
  const d10Md = chart.divisionalCharts.D10.placements.find((p) => p.id === mdId)!;
  const d9AndD10Note = `In D9 Navamsa, ${mdId} sits in ${d9Md.signName} (H${d9Md.houseFromVargaLagna}, ${d9Md.dignity}); in D10 Dasamsa, ${mdId} occupies ${d10Md.signName} (H${d10Md.houseFromVargaLagna}, ${d10Md.dignity}).`;

  const activatedHouses = Array.from(
    new Set([
      mdBody.rasiHouseNumber,
      ...mdRuled,
      ...(adBody ? [adBody.rasiHouseNumber] : []),
      ...adRuled,
    ])
  ).sort((a, b) => a - b);

  const keyEffects = [
    `Primary houses activated: ${activatedHouses.map((h) => `H${h}`).join(', ')}.`,
    `Natal SAV support in ${mdId}'s sign (${mdBody.signName}): ${mdSav} bindus (${mdSav >= 28 ? 'strong backing' : 'requires steady persistence'}).`,
    ...(mdBody.isRetrograde && mdId !== 'Rahu' && mdId !== 'Ketu'
      ? [`${mdId} is Retrograde — results may manifest via revisiting past plans or unexpected second turns.`]
      : []),
    ...(mdBody.isCombust ? [`${mdId} is Combust — external recognition grows quietly after inner refinement.`] : []),
  ];

  const guidance =
    score >= 65
      ? `Leverage this period proactively in matters of Houses ${activatedHouses.slice(0, 3).join(', ')}; supportive Gochar transits of Jupiter/Saturn will accelerate tangible milestones.`
      : `Pace major risks carefully during this chapter; prioritize steady discipline, verify agreements twice, and lean on Mantra/Upaya for ${adId ?? mdId}.`;

  const title = adLordRaw
    ? pdLordRaw
      ? `${mdLordRaw} / ${adLordRaw} / ${pdLordRaw}`
      : `${mdLordRaw} / ${adLordRaw}`
    : `${mdLordRaw} Mahadasha`;

  return {
    title,
    mdLord: mdLordRaw,
    adLord: adLordRaw,
    pdLord: pdLordRaw,
    startDate,
    endDate,
    favorability,
    score,
    mdSummary,
    adSummary,
    pdSummary,
    activatedHouses,
    d9AndD10Note,
    keyEffects,
    guidance,
  };
}

// KP 249 Horary Mapping: divides 360° into 249 sub-divisions (splitting subs across sign boundaries)
export function getKpHoraryLongitude(horaryNum: number): number {
  const num = Math.max(1, Math.min(249, Math.round(horaryNum)));
  const nakSpan = 360 / 27;
  const slots: number[] = [];

  for (let n = 0; n < 27; n++) {
    const nakStart = n * nakSpan;
    const nakLord = NAKSHATRAS[n].lord;
    const startIdx = VIMSHOTTARI_ORDER.indexOf(nakLord);
    let cursor = nakStart;
    for (let s = 0; s < 9; s++) {
      const subLord = VIMSHOTTARI_ORDER[(startIdx + s) % 9];
      const subSpan = (VIMSHOTTARI_YEARS[subLord] / 120) * nakSpan;
      const subEnd = cursor + subSpan;
      const startSign = Math.floor(cursor / 30);
      const endSign = Math.floor((subEnd - 1e-9) / 30);
      slots.push(cursor);
      if (endSign > startSign) {
        slots.push(endSign * 30);
      }
      cursor = subEnd;
    }
  }
  return slots[num - 1] ?? 0;
}

const PRASHNA_CATEGORY_META: Record<PrashnaCategory, { label: string; house: number }> = {
  general: { label: 'General / Yes-No Outcome', house: 1 },
  career: { label: 'Career, Job & Promotion', house: 10 },
  marriage: { label: 'Marriage, Love & Partnership', house: 7 },
  wealth: { label: 'Wealth, Business & Debt Recovery', house: 11 },
  education: { label: 'Education, Exams & Admission', house: 5 },
  health: { label: 'Health & Recovery from Illness', house: 6 },
  litigation: { label: 'Litigation, Rivals & Competition', house: 6 },
  travel: { label: 'Travel, Relocation & Foreign Visa', house: 9 },
  property: { label: 'Property, Home & Vehicle', house: 4 },
  lost_object: { label: 'Lost Item / Missing Recovery', house: 2 },
};

const COMPASS_BY_SIGN: string[] = [
  'East (Mesha)',
  'South (Vrishabha)',
  'West (Mithuna)',
  'North (Karka)',
  'East (Simha)',
  'South (Kanya)',
  'West (Tula)',
  'North (Vrishchika)',
  'East (Dhanu)',
  'South (Makara)',
  'West (Kumbha)',
  'North (Meena)',
];

function checkTajikaAspect(a: BodyPosition, b: BodyPosition): { yoga: string; detail: string; bonus: number } {
  const houseDist = ((b.signIndex - a.signIndex + 12) % 12) + 1;
  if (a.id === b.id) {
    return {
      yoga: 'Raja-Prashna Self-Rulership',
      detail: `${a.id} rules both Lagna and the query house (${a.signName}, H${a.rasiHouseNumber}), uniting intention directly with outcome.`,
      bonus: 16,
    };
  }
  if (houseDist === 1) {
    const faster = a.speedDegPerDay >= b.speedDegPerDay ? a : b;
    const slower = faster === a ? b : a;
    const applying = faster.degreeInSign <= slower.degreeInSign;
    return {
      yoga: applying ? 'Conjunction Ithasala (Strong Yes)' : 'Separating Conjunction (Easarpha)',
      detail: applying
        ? `Faster ${faster.id} (${faster.shortDms}) applies toward slower ${slower.id} (${slower.shortDms}) in the same sign — strong classical Prashna fulfillment.`
        : `Faster ${faster.id} has already passed ${slower.id} — matter may have peaked or requires renewed initiative.`,
      bonus: applying ? 20 : 4,
    };
  }
  if ([3, 5, 7, 9, 11].includes(houseDist)) {
    const faster = a.speedDegPerDay >= b.speedDegPerDay ? a : b;
    const slower = faster === a ? b : a;
    const applying = faster.degreeInSign <= slower.degreeInSign;
    return {
      yoga: applying ? `Ithasala Yoga (${houseDist}th Aspect)` : `Easarpha Yoga (${houseDist}th Separating)`,
      detail: applying
        ? `Lagna Lord ${a.id} and Karyesha ${b.id} form an applying ${houseDist}th Tajika Ithasala — clear positive momentum toward completion.`
        : `Lagna Lord ${a.id} and Karyesha ${b.id} are separating in ${houseDist}th relation — outcome needs fresh effort or third-party mediation.`,
      bonus: applying ? 15 : -2,
    };
  }
  return {
    yoga: `No Direct Tajika Yoga (${houseDist}/${14 - houseDist})`,
    detail: `Lagna Lord ${a.id} and Karyesha ${b.id} sit ${houseDist} signs apart without direct Ithasala — check Moon's link and 11th house strength.`,
    bonus: -6,
  };
}

export function analyzePrashnaChart(
  chart: ChartData,
  question: string,
  category: PrashnaCategory,
  horaryNumber?: number
): PrashnaAnalysis {
  const meta = PRASHNA_CATEGORY_META[category];
  const queryHouse = meta.house;

  let ascSign = chart.ascendant.signIndex;
  let horaryAscSign: string | undefined;
  let horaryAscDms: string | undefined;
  let kpHoraryNote = 'Standard Live Prashna Udaya Lagna used.';

  if (horaryNumber && horaryNumber >= 1 && horaryNumber <= 249) {
    const horLon = getKpHoraryLongitude(horaryNumber);
    ascSign = Math.floor(horLon / 30) % 12;
    horaryAscSign = SIGNS[ascSign].name;
    horaryAscDms = `${(horLon % 30).toFixed(2)}°`;
    const subL = computeKpSubLord(horLon);
    kpHoraryNote = `KP Horary Seed #${horaryNumber} maps Lagna to ${horaryAscSign} ${horaryAscDms} (Sub-Lord: ${subL}).`;
  }

  const byId = new Map(chart.planets.map((p) => [p.id, p]));
  const moon = byId.get('Moon')!;
  const jupiter = byId.get('Jupiter')!;
  const lagnaLordId = SIGNS[ascSign].lord;
  const karyeshaId = SIGNS[(ascSign + queryHouse - 1) % 12].lord;

  const lagnaLord = byId.get(lagnaLordId)!;
  const karyesha = byId.get(karyeshaId)!;

  const hLagnaLord = ((lagnaLord.signIndex - ascSign + 12) % 12) + 1;
  const hKaryesha = ((karyesha.signIndex - ascSign + 12) % 12) + 1;
  const hMoon = ((moon.signIndex - ascSign + 12) % 12) + 1;

  const tajika = checkTajikaAspect(lagnaLord, karyesha);

  // Moon & Kendra Benefics
  const isMoonStrong = [1, 2, 3, 4, 5, 7, 9, 10, 11].includes(hMoon) && moon.dignity !== 'Debilitated';
  const beneficsInKendras = chart.planets.filter(
    (p) =>
      ['Jupiter', 'Venus', 'Mercury'].includes(p.id) &&
      [1, 4, 7, 10].includes(((p.signIndex - ascSign + 12) % 12) + 1)
  );
  const horaGood = ['Jupiter', 'Venus', 'Mercury', 'Moon'].includes(chart.panchang.horaLord);

  let score =
    56 +
    tajika.bonus +
    digScore(lagnaLord.dignity) * 0.45 +
    digScore(karyesha.dignity) * 0.55 +
    ([1, 4, 5, 7, 9, 10, 11].includes(hKaryesha) ? 10 : -9) +
    (isMoonStrong ? 8 : -8) +
    beneficsInKendras.length * 4 +
    (horaGood ? 4 : -2);

  // Special Lost Object / Health overrides per Prashna Marga
  if (category === 'lost_object') {
    if (lagnaLord.isRetrograde || karyesha.isRetrograde || moon.rasiHouseNumber === 1 || hKaryesha === 2 || hKaryesha === 11) {
      score += 10;
    }
  }
  if (category === 'health') {
    // For health Prashna, Lagna lord stronger than 6th/8th lord = faster recovery
    if ([1, 4, 5, 9, 10, 11].includes(hLagnaLord) && !['Debilitated'].includes(lagnaLord.dignity)) {
      score += 8;
    }
  }

  score = Math.max(20, Math.min(96, Math.round(score)));
  const verdict: PrashnaAnalysis['verdict'] =
    score >= 74
      ? 'Strong Yes / Favorable'
      : score >= 58
        ? 'Favorable with Effort'
        : score >= 44
          ? 'Delayed / Conditional'
          : 'Unfavorable / Reconsider';

  // Timing estimation via Modality + Degree gap
  const degGap = Math.max(1, Math.round(Math.abs(karyesha.degreeInSign - lagnaLord.degreeInSign)));
  const mod = SIGNS[ascSign].modality;
  const timingUnit = mod === 'Movable' ? 'days to a few weeks' : mod === 'Dual' ? 'weeks to a few months' : 'months (steady, lasting pace)';
  const timingEstimate = `Prashna Lagna is ${mod} (${SIGNS[ascSign].name}) with ~${degGap}° separation between ${lagnaLordId} and ${karyeshaId} — unfolding over ~${degGap} ${timingUnit}.`;

  const moonCondition = `Prashna Moon sits in ${moon.signName} (House ${hMoon}, ${moon.nakshatraName} P${moon.pada}, ${moon.dignity}). ${
    isMoonStrong
      ? 'Chandra Shuddhi is supportive, giving clarity of intent and steady momentum.'
      : 'Moon in a testing house/state advises waiting for emotional dust to settle before finalizing decisions.'
  }`;

  const panchangOmen = `${chart.panchang.vara.sanskrit} · ${chart.panchang.tithi.paksha} ${chart.panchang.tithi.name} · ${chart.panchang.nakshatra.name} · Hora Lord: ${chart.panchang.horaLord} (${horaGood ? 'Benefic Shubha Hora' : 'Active Effort Hora'}).`;

  const lostObjectDirection = COMPASS_BY_SIGN[karyesha.signIndex];

  const keyInsights = [
    `Lagna Lord ${lagnaLordId} in House ${hLagnaLord} (${lagnaLord.signName}, ${lagnaLord.dignity}) represents the querent.`,
    `Query House H${queryHouse} (${meta.label}) Lord ${karyeshaId} sits in House ${hKaryesha} (${karyesha.signName}, ${karyesha.dignity}).`,
    tajika.detail,
    beneficsInKendras.length > 0
      ? `Natural benefics in Kendras (${beneficsInKendras.map((p) => p.id).join(', ')}) shield the Prashna from sudden setbacks.`
      : `No natural benefics occupy Kendras; Jupiter in House ${((jupiter.signIndex - ascSign + 12) % 12) + 1} provides broader guidance.`,
    ...(karyesha.isRetrograde
      ? [`Karyesha ${karyeshaId} is Retrograde — indicates revisiting, return, delay, or second attempts.`]
      : []),
  ];

  const advice =
    verdict === 'Strong Yes / Favorable'
      ? `Prashna indicators strongly support proceeding while keeping timing aligned with ${karyeshaId} / ${lagnaLordId} Hora.`
      : verdict === 'Favorable with Effort'
        ? `Outcome leans positive, provided practical obstacles of House ${hKaryesha} are handled step-by-step.`
        : `Prashna signals friction or unripe timing right now — refine your strategy, check missing details, or re-evaluate when Moon enters a favorable Tara.`;

  return {
    question: question.trim() || `Query regarding ${meta.label}`,
    category,
    categoryLabel: meta.label,
    queryHouse,
    horaryNumber: horaryNumber && horaryNumber >= 1 && horaryNumber <= 249 ? horaryNumber : undefined,
    horaryAscSign,
    horaryAscDms,
    lagnaLord: lagnaLordId,
    karyesha: karyeshaId,
    lagnaLordPlacement: `H${hLagnaLord} (${lagnaLord.signName}, ${lagnaLord.dignity})`,
    karyeshaPlacement: `H${hKaryesha} (${karyesha.signName}, ${karyesha.dignity})`,
    tajikaYoga: tajika.yoga,
    tajikaDetail: tajika.detail,
    moonCondition,
    panchangOmen,
    outcomeScore: score,
    verdict,
    timingEstimate,
    lostObjectDirection,
    kpHoraryNote,
    keyInsights,
    advice,
  };
}
