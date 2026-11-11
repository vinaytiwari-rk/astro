import { SEVEN_PLANETS, SIGNS } from './constants';
import { computeSunriseSunsetForLocalDay } from './ephemeris';
import { evaluateParamayusStatus } from './predictions/paramayus';
import { formatDms, formatLocalTimeFromUtc } from './time';
import type { ChartData, SevenPlanetId } from './types';

export type BirdName = 'Vulture' | 'Owl' | 'Crow' | 'Cock' | 'Peacock';
export type BirdActivity = 'Ruling' | 'Eating' | 'Walking' | 'Sleeping' | 'Dying';
export type KakshaLord = SevenPlanetId | 'Asc';

export interface YamaSlot {
  yamaNumber: number; // 1..5
  period: 'day' | 'night';
  startTime: string;
  endTime: string;
  startMs: number;
  endMs: number;
  birthBirdActivity: BirdActivity;
  strengthScore: number; // 0.005 .. 1.00 from Pulippani table
  allBirds: Record<BirdName, BirdActivity>;
  summaryEn: string;
  summaryHi: string;
}

export interface PanchaPakshiReport {
  date: string;
  birthBird: BirdName;
  birthBirdHi: string;
  elementEn: string;
  elementHi: string;
  birthPaksha: 'Shukla' | 'Krishna';
  transitPaksha: 'Shukla' | 'Krishna';
  sunrise: string;
  sunset: string;
  currentPeriod: 'day' | 'night';
  currentYama: YamaSlot;
  dayYamas: YamaSlot[];
  nightYamas: YamaSlot[];
  guidanceEn: string;
  guidanceHi: string;
}

export interface GocharaKakshaEntry {
  planet: SevenPlanetId;
  signIndex: number;
  signName: string;
  signDeg: number;
  dms: string;
  kakshaNumber: number; // 1..8
  kakshaRange: string;
  kakshaLord: KakshaLord;
  kakshaBindu: 0 | 1;
  bhinnaBindus: number;
  sarvaBindus: number;
  verdictEn: string;
  verdictHi: string;
}

export interface AshtakavargaYogaItem {
  nameEn: string;
  nameHi: string;
  planetOrHouse: string;
  nature: 'Benefic' | 'Caution' | 'Mixed';
  basis: string;
  effectEn: string;
  effectHi: string;
}

export const BIRD_META: Record<
  BirdName,
  { hi: string; elementEn: string; elementHi: string }
> = {
  Vulture: { hi: 'गृध्र (गिद्ध / श्येन)', elementEn: 'Fire (Agni)', elementHi: 'अग्नि तत्व' },
  Owl: { hi: 'उलूक (उल्लू)', elementEn: 'Water (Jala)', elementHi: 'जल तत्व' },
  Crow: { hi: 'काक (कौआ)', elementEn: 'Earth (Prithvi)', elementHi: 'पृथ्वी तत्व' },
  Cock: { hi: 'कुक्कुट (मुर्गा)', elementEn: 'Air (Vayu)', elementHi: 'वायु तत्व' },
  Peacock: { hi: 'मयूर (मोर)', elementEn: 'Ether (Akasha)', elementHi: 'आकाश तत्व' },
};

export const ACTIVITY_META: Record<
  BirdActivity,
  { hi: string; quality: 'best' | 'good' | 'neutral' | 'weak' | 'avoid'; descEn: string; descHi: string }
> = {
  Ruling: {
    hi: 'शासन (राज्यावस्था)',
    quality: 'best',
    descEn: 'Peak authority & success — ideal for launches, meetings, decisions.',
    descHi: 'सर्वोत्तम बल — नए कार्य, निर्णय व राजकीय कार्यों हेतु अत्यंत शुभ।',
  },
  Eating: {
    hi: 'भोजन अवस्था',
    quality: 'good',
    descEn: 'Nourishing gain — strong for trade, finance & relationship talks.',
    descHi: 'धन व पोषण हेतु शुभ — व्यापार, निवेश व मधुर वार्ता के लिए उत्तम।',
  },
  Walking: {
    hi: 'गमन अवस्था',
    quality: 'neutral',
    descEn: 'Dynamic/neutral — suitable for travel and routine errands.',
    descHi: 'मध्यम / गतिशील — यात्रा व सामान्य दैनिक कार्यों के लिए ठीक।',
  },
  Sleeping: {
    hi: 'निद्रा अवस्था',
    quality: 'weak',
    descEn: 'Low vitality — avoid major commitments or risky negotiations.',
    descHi: 'क्षीण बल — बड़े समझौते या महत्वपूर्ण शुरुआत अभी टालें।',
  },
  Dying: {
    hi: 'मरण अवस्था',
    quality: 'avoid',
    descEn: 'Weakest window — defer critical launches, travel or confrontation.',
    descHi: 'अत्यंत कमजोर समय — नए शुभ कार्य व जोखिम भरे निर्णय न लें।',
  },
};

const SHUKLA_BIRDS_BY_NAK: BirdName[] = [
  ...Array<BirdName>(5).fill('Vulture'),
  ...Array<BirdName>(6).fill('Owl'),
  ...Array<BirdName>(5).fill('Crow'),
  ...Array<BirdName>(5).fill('Cock'),
  ...Array<BirdName>(6).fill('Peacock'),
];

const KRISHNA_BIRDS_BY_NAK: BirdName[] = [
  ...Array<BirdName>(5).fill('Peacock'),
  ...Array<BirdName>(6).fill('Cock'),
  ...Array<BirdName>(5).fill('Crow'),
  ...Array<BirdName>(5).fill('Owl'),
  ...Array<BirdName>(6).fill('Vulture'),
];

export function getBirthBird(nakshatraIndex: number, paksha: 'Shukla' | 'Krishna'): BirdName {
  const idx = ((nakshatraIndex % 27) + 27) % 27;
  return paksha === 'Shukla' ? SHUKLA_BIRDS_BY_NAK[idx] : KRISHNA_BIRDS_BY_NAK[idx];
}

// Pulippani Table (VedAstro MIT PanchaPakshi.cs): Day activity progression Eating -> Walking -> Ruling -> Sleeping -> Dying
const BIRD_DAY_CYCLE: BirdName[] = ['Vulture', 'Owl', 'Crow', 'Cock', 'Peacock'];
const ACTIVITIES_SHUKLA_DAY: BirdActivity[] = ['Eating', 'Walking', 'Ruling', 'Sleeping', 'Dying'];
const ACTIVITIES_SHUKLA_NIGHT: BirdActivity[] = ['Eating', 'Ruling', 'Dying', 'Walking', 'Sleeping'];

// Day Yama-1 Eating bird index in BIRD_DAY_CYCLE: Sun/Tue=0 (Vulture), Mon/Wed=1 (Owl), Thu=2 (Crow), Fri=3 (Cock), Sat=4 (Peacock)
const DAY_YAMA1_START_IDX: Record<number, number> = {
  0: 0, // Sun
  1: 1, // Mon
  2: 0, // Tue
  3: 1, // Wed
  4: 2, // Thu
  5: 3, // Fri
  6: 4, // Sat
};

// Night Yama-1 Eating bird index in BIRD_DAY_CYCLE: Sun/Tue=2 (Crow), Mon/Wed=3 (Cock), Thu=4 (Peacock), Fri=0 (Vulture), Sat=1 (Owl)
const NIGHT_YAMA1_START_IDX: Record<number, number> = {
  0: 2,
  1: 3,
  2: 2,
  3: 3,
  4: 4,
  5: 0,
  6: 1,
};

// Krishna Paksha Yama-1 Ruling/Eating shifts opposite fortnight energy
const KRISHNA_DAY_YAMA1_START_IDX: Record<number, number> = {
  0: 3, // Cock
  1: 4, // Peacock
  2: 0, // Vulture
  3: 2, // Crow
  4: 4, // Peacock
  5: 1, // Owl
  6: 3, // Cock
};

const KRISHNA_NIGHT_YAMA1_START_IDX: Record<number, number> = {
  0: 1, // Owl
  1: 2, // Crow
  2: 3, // Cock
  3: 4, // Peacock
  4: 0, // Vulture
  5: 2, // Crow
  6: 0, // Vulture
};

const BIRD_BASE_POWER: Record<BirdName, number> = {
  Crow: 1.0,
  Vulture: 0.75,
  Owl: 0.5,
  Cock: 0.25,
  Peacock: 0.125,
};

const ACTIVITY_FACTOR: Record<BirdActivity, number> = {
  Ruling: 1.0,
  Eating: 0.8,
  Walking: 0.6,
  Sleeping: 0.4,
  Dying: 0.2,
};

function buildYamaBirdMap(
  weekday: number,
  yamaNumber: number,
  period: 'day' | 'night',
  paksha: 'Shukla' | 'Krishna'
): Record<BirdName, BirdActivity> {
  const yIdx = yamaNumber - 1;
  const startTable =
    paksha === 'Shukla'
      ? period === 'day'
        ? DAY_YAMA1_START_IDX
        : NIGHT_YAMA1_START_IDX
      : period === 'day'
        ? KRISHNA_DAY_YAMA1_START_IDX
        : KRISHNA_NIGHT_YAMA1_START_IDX;

  const baseIdx = startTable[weekday] ?? 0;
  // Each subsequent Yama shifts eating bird backward in BIRD_DAY_CYCLE (exact match to VedAstro TableData)
  const eatingBirdIdx = ((baseIdx - yIdx) % 5 + 5) % 5;
  const actOrder = period === 'day' ? ACTIVITIES_SHUKLA_DAY : ACTIVITIES_SHUKLA_NIGHT;
  const stepDir = paksha === 'Krishna' ? -1 : 1;

  const out = {} as Record<BirdName, BirdActivity>;
  for (let offset = 0; offset < 5; offset++) {
    const bird = BIRD_DAY_CYCLE[((eatingBirdIdx + offset * stepDir) % 5 + 5) % 5];
    out[bird] = actOrder[offset];
  }
  return out;
}

export function computePanchaPakshiDay(
  natalChart: ChartData,
  targetDate: string,
  targetTimeLocal: string,
  latitude: number,
  longitude: number,
  offsetMinutes: number,
  transitPaksha?: 'Shukla' | 'Krishna'
): PanchaPakshiReport {
  const birthBird = getBirthBird(
    natalChart.panchang.nakshatra.index,
    natalChart.panchang.tithi.paksha
  );
  const pakshaUse = transitPaksha ?? natalChart.panchang.tithi.paksha;

  const [yr, mo, dy] = targetDate.split('-').map((n) => parseInt(n, 10));
  const [hh, mm] = targetTimeLocal.split(':').map((n) => parseInt(n, 10) || 0);
  const noonUtcMs = Date.UTC(yr, mo - 1, dy, 12, 0, 0) - offsetMinutes * 60_000;
  const sunTimes = computeSunriseSunsetForLocalDay(noonUtcMs, offsetMinutes, latitude, longitude);

  const localMidnightMs = Date.UTC(yr, mo - 1, dy, 0, 0, 0) - offsetMinutes * 60_000;
  const srMs = sunTimes.vedicSunriseMs ?? sunTimes.sunriseMs ?? localMidnightMs + 6 * 3600_000;
  const ssMs = sunTimes.vedicSunsetMs ?? sunTimes.sunsetMs ?? srMs + 12 * 3600_000;
  const nSrMs = sunTimes.nextSunriseMs ?? srMs + 24 * 3600_000;

  const weekday = new Date(srMs + offsetMinutes * 60_000).getUTCDay();
  const targetMs = Date.UTC(yr, mo - 1, dy, hh, mm, 0) - offsetMinutes * 60_000;

  const buildSlots = (period: 'day' | 'night', start: number, end: number): YamaSlot[] => {
    const step = (end - start) / 5;
    return Array.from({ length: 5 }, (_, idx) => {
      const yamaNumber = idx + 1;
      const t0 = start + idx * step;
      const t1 = t0 + step;
      const allBirds = buildYamaBirdMap(weekday, yamaNumber, period, pakshaUse);
      const act = allBirds[birthBird];
      const strengthScore = Number(
        (BIRD_BASE_POWER[birthBird] * ACTIVITY_FACTOR[act]).toFixed(3)
      );
      const actMeta = ACTIVITY_META[act];
      return {
        yamaNumber,
        period,
        startTime: formatLocalTimeFromUtc(t0, offsetMinutes, false),
        endTime: formatLocalTimeFromUtc(t1, offsetMinutes, false),
        startMs: t0,
        endMs: t1,
        birthBirdActivity: act,
        strengthScore,
        allBirds,
        summaryEn: `${act}: ${actMeta.descEn}`,
        summaryHi: `${actMeta.hi}: ${actMeta.descHi}`,
      };
    });
  };

  const dayYamas = buildSlots('day', srMs, ssMs);
  const nightYamas = buildSlots('night', ssMs, nSrMs);
  const allSlots = [...dayYamas, ...nightYamas];
  const currentYama =
    allSlots.find((s) => targetMs >= s.startMs && targetMs < s.endMs) ?? dayYamas[0];
  const currentPeriod = currentYama.period;

  const bm = BIRD_META[birthBird];
  const activeAct = ACTIVITY_META[currentYama.birthBirdActivity];

  return {
    date: targetDate,
    birthBird,
    birthBirdHi: bm.hi,
    elementEn: bm.elementEn,
    elementHi: bm.elementHi,
    birthPaksha: natalChart.panchang.tithi.paksha,
    transitPaksha: pakshaUse,
    sunrise: formatLocalTimeFromUtc(srMs, offsetMinutes, false),
    sunset: formatLocalTimeFromUtc(ssMs, offsetMinutes, false),
    currentPeriod,
    currentYama,
    dayYamas,
    nightYamas,
    guidanceEn: `Your Natal Bird is ${birthBird} (${bm.elementEn}). During active Yama #${currentYama.yamaNumber} (${currentYama.startTime}–${currentYama.endTime}), it is ${currentYama.birthBirdActivity} (Index ${currentYama.strengthScore}): ${activeAct.descEn}`,
    guidanceHi: `आपका जन्म पक्षी ${bm.hi} (${bm.elementHi}) है। वर्तमान याम #${currentYama.yamaNumber} (${currentYama.startTime}–${currentYama.endTime}) में अवस्था "${activeAct.hi}" (शक्ति ${currentYama.strengthScore}) है — ${activeAct.descHi}`,
  };
}

export const KAKSHA_LORDS: KakshaLord[] = [
  'Saturn',
  'Jupiter',
  'Mars',
  'Sun',
  'Venus',
  'Mercury',
  'Moon',
  'Asc',
];

const KAKSHA_SPAN_DEG = 3.75; // 3°45' per Kaksha (30° / 8)

function fmtShortDeg(deg: number): string {
  const d = Math.floor(deg);
  const m = Math.round((deg - d) * 60);
  return `${String(d).padStart(2, '0')}°${String(m).padStart(2, '0')}'`;
}

export function computeGocharaKakshas(
  natalChart: ChartData,
  transitChart: ChartData
): GocharaKakshaEntry[] {
  if (evaluateParamayusStatus(natalChart, transitChart.input.date).exceeded) {
    return [];
  }
  const entries: GocharaKakshaEntry[] = [];

  for (const p of SEVEN_PLANETS) {
    const tr = transitChart.planets.find((x) => x.id === p);
    if (!tr) continue;

    const kIdx = Math.min(7, Math.max(0, Math.floor(tr.degreeInSign / KAKSHA_SPAN_DEG)));
    const lord = KAKSHA_LORDS[kIdx];
    const startDeg = kIdx * KAKSHA_SPAN_DEG;
    const endDeg = startDeg + KAKSHA_SPAN_DEG;

    const rawBindu = natalChart.ashtakavarga.prastara[p]?.[lord]?.[tr.signIndex] ?? 0;
    const kakshaBindu: 0 | 1 = rawBindu > 0 ? 1 : 0;
    const bhinnaBindus = natalChart.ashtakavarga.bhinna[p]?.[tr.signIndex] ?? 0;
    const sarvaBindus = natalChart.ashtakavarga.sarva[tr.signIndex] ?? 0;

    const verdictEn =
      kakshaBindu === 1
        ? `Favorable (${lord} Kaksha has 1 bindu; BAV ${bhinnaBindus}/8, SAV ${sarvaBindus})`
        : `Sluggish (${lord} Kaksha has 0 bindu; await next Kaksha or higher BAV ${bhinnaBindus}/8 support)`;

    const verdictHi =
      kakshaBindu === 1
        ? `शुभ कक्षा (${lord} कक्ष्या में 1 बिंदु प्राप्त; भिन्नाष्टक ${bhinnaBindus}/8, SAV ${sarvaBindus})`
        : `सामान्य/मंद (${lord} कक्ष्या में 0 बिंदु; अगली शुभ कक्ष्या या SAV ${sarvaBindus} का सहयोग देखें)`;

    entries.push({
      planet: p,
      signIndex: tr.signIndex,
      signName: SIGNS[tr.signIndex].name,
      signDeg: tr.degreeInSign,
      dms: formatDms(tr.degreeInSign),
      kakshaNumber: kIdx + 1,
      kakshaRange: `${fmtShortDeg(startDeg)}–${fmtShortDeg(endDeg)}`,
      kakshaLord: lord,
      kakshaBindu,
      bhinnaBindus,
      sarvaBindus,
      verdictEn,
      verdictHi,
    });
  }

  return entries;
}

export function evaluateAshtakavargaYogas(chart: ChartData): AshtakavargaYogaItem[] {
  if (evaluateParamayusStatus(chart).exceeded) {
    return [];
  }
  const yogas: AshtakavargaYogaItem[] = [];
  const av = chart.ashtakavarga;
  const lagnaSign = chart.ascendant.signIndex;
  const signAtHouse = (h: number) => (lagnaSign + h - 1) % 12;

  const sun = chart.planets.find((p) => p.id === 'Sun')!;
  const moon = chart.planets.find((p) => p.id === 'Moon')!;
  const jup = chart.planets.find((p) => p.id === 'Jupiter')!;
  const sat = chart.planets.find((p) => p.id === 'Saturn')!;

  const sunBavOwn = av.bhinna.Sun[sun.signIndex];
  const sunNinthBindus = av.bhinna.Sun[signAtHouse(9)];
  if (sunBavOwn >= 5) {
    yogas.push({
      nameEn: 'Sun High BAV Empowerment',
      nameHi: 'सूर्य उच्च भिन्नाष्टक योग',
      planetOrHouse: `Sun (${sunBavOwn}/8)`,
      nature: 'Benefic',
      basis: `Sun has ${sunBavOwn} bindus in its occupied sign`,
      effectEn: 'Bestows administrative dignity, clear authority, paternal support and steady vitality.',
      effectHi: 'राजकीय सम्मान, नेतृत्व क्षमता, पिता का सहयोग और उत्तम तेज प्रदान करता है।',
    });
  } else if (sunBavOwn <= 2) {
    yogas.push({
      nameEn: 'Sun Low-Bindu Caution Yoga',
      nameHi: 'सूर्य न्यून-बिंदु सावधानी योग',
      planetOrHouse: `Sun (${sunBavOwn}/8)`,
      nature: 'Caution',
      basis: `Sun holds ${sunBavOwn} bindus in natal sign; 9th bindus=${sunNinthBindus}`,
      effectEn: 'Avoid over-exertion, authority friction or father-health neglect during Sun sub-periods.',
      effectHi: 'सूर्य की दशा में पिता के स्वास्थ्य का ध्यान रखें व उच्चाधिकारियों से अनावश्यक विवाद टालें।',
    });
  }

  const moonBavOwn = av.bhinna.Moon[moon.signIndex];
  const moonTenthBindus = av.bhinna.Moon[signAtHouse(10)];
  if (moonBavOwn >= 5) {
    yogas.push({
      nameEn: 'Chandra Prosperity & Peace Yoga',
      nameHi: 'चंद्र सर्वांगीण समृद्धि योग',
      planetOrHouse: `Moon (${moonBavOwn}/8)`,
      nature: 'Benefic',
      basis: `Moon has ${moonBavOwn} bindus in Janma Rashi`,
      effectEn: 'Grants emotional poise, public goodwill, maternal comfort and steady financial flow.',
      effectHi: 'मानसिक शांति, जन-लोकप्रियता, माता का सुख और निरंतर धन वृद्धि देता है।',
    });
  } else if (moonBavOwn <= 2 || moonTenthBindus <= 2) {
    yogas.push({
      nameEn: 'Chandra Fluctuation Alert',
      nameHi: 'चंद्र अस्थिरता चेतावनी योग',
      planetOrHouse: `Moon (${moonBavOwn}/8)`,
      nature: 'Caution',
      basis: `Moon BAV=${moonBavOwn} in Janma Rashi`,
      effectEn: 'Prone to stress, cold ailments or mood swings; Monday hydration & meditation stabilize mind.',
      effectHi: 'मानसिक तनाव या जलवायु परिवर्तन से कष्ट संभव; सोमवार शिव उपासना व संयम लाभकारी।',
    });
  }

  const h1Sav = av.sarva[signAtHouse(1)];
  const h10Sav = av.sarva[signAtHouse(10)];
  const h11Sav = av.sarva[signAtHouse(11)];
  const h12Sav = av.sarva[signAtHouse(12)];

  if (h11Sav > h10Sav && h11Sav > h12Sav) {
    yogas.push({
      nameEn: 'SAV Gains-Over-Expenditure Yoga (11th > 10th > 12th)',
      nameHi: 'लाभ-अधिक्य धन संचय योग (एकादश > दशम > व्यय)',
      planetOrHouse: `H11:${h11Sav} / H10:${h10Sav} / H12:${h12Sav}`,
      nature: 'Benefic',
      basis: `Sarvashtakavarga bindus H11 (${h11Sav}) > H10 (${h10Sav}) and H12 (${h12Sav})`,
      effectEn: 'Classical Ashtakavarga wealth yoga: income reliably exceeds expenses over long arcs.',
      effectHi: 'शास्त्रीय अष्टकवर्ग धन योग: परिश्रम की तुलना में लाभ व संचय निरंतर बना रहता है।',
    });
  }

  if (h1Sav >= 30 && av.bhinna.Jupiter[jup.signIndex] >= 5) {
    yogas.push({
      nameEn: 'Strong Lagna & Brihaspati SAV Protection',
      nameHi: 'बली लग्न एवं बृहस्पति रक्षा योग',
      planetOrHouse: `H1:${h1Sav} · Jup:${av.bhinna.Jupiter[jup.signIndex]}/8`,
      nature: 'Benefic',
      basis: `Lagna SAV >= 30 (${h1Sav}) & Jupiter BAV >= 5`,
      effectEn: 'Confers resilience against crises, respected counsel, ethical rise and graceful recovery.',
      effectHi: 'संकटों से सुरक्षा, सम्मानजनक सलाहकार भूमिका और शुभ भाग्योदय प्रदान करता है।',
    });
  }

  const h8Sav = av.sarva[signAtHouse(8)];
  if (h8Sav < 24 && av.bhinna.Saturn[sat.signIndex] <= 2) {
    yogas.push({
      nameEn: 'Ashtama-Shani Discipline Check',
      nameHi: 'अष्टम-शनि अनुशासन सावधानी',
      planetOrHouse: `H8:${h8Sav} · Sat:${av.bhinna.Saturn[sat.signIndex]}/8`,
      nature: 'Mixed',
      basis: `H8 SAV=${h8Sav} with Saturn BAV=${av.bhinna.Saturn[sat.signIndex]}`,
      effectEn: 'Demands patient pacing, insurance & routine checkups during Saturn/8th transits.',
      effectHi: 'शनि गोचर में धैर्य, नियमित स्वास्थ्य जाँच व सुरक्षा-बीमा बनाए रखना हितकर है।',
    });
  }

  if (yogas.length === 0) {
    yogas.push({
      nameEn: 'Balanced Sarvashtakavarga Equilibrium',
      nameHi: 'संतुलित सर्वाष्टकवर्ग साम्य योग',
      planetOrHouse: `H1:${h1Sav} · H10:${h10Sav} · H11:${h11Sav}`,
      nature: 'Mixed',
      basis: `Balanced SAV distribution across Lagna (${h1Sav}), Karma (${h10Sav}) and Labha (${h11Sav})`,
      effectEn: 'Even planetary bindu spread delivers steady progress rewarded directly by consistent effort.',
      effectHi: 'लग्न, कर्म और लाभ भावों में संतुलित बिंदु होने से निरंतर परिश्रम द्वारा स्थायी प्रगति होती है।',
    });
  }

  return yogas;
}
