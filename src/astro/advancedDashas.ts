import { SIGNS } from './constants';
import { getDaysPerYear } from './dasha';
import { formatLocalDateTimeFromUtc, normalizeDeg } from './time';
import type { ChartData, NineGrahaId, SevenPlanetId } from './types';

export interface AshtottariPeriod {
  lord: NineGrahaId;
  years: number;
  startDate: string;
  endDate: string;
  startMs: number;
  endMs: number;
  note: string;
}

export interface NarayanaDashaPeriod {
  signIndex: number;
  signName: string;
  years: number;
  startDate: string;
  endDate: string;
  startMs: number;
  endMs: number;
  houseFromLagna: number;
  pakaSign: string;
  bhogaSign: string;
  note: string;
}

export interface SudarshanaWheelResult {
  age: number;
  year: number;
  lagnaHouse: number;
  lagnaSign: string;
  moonHouse: number;
  moonSign: string;
  sunHouse: number;
  sunSign: string;
  lagnaOccupants: string[];
  moonOccupants: string[];
  sunOccupants: string[];
  synthesis: string;
}

export interface AdvancedDashaBundle {
  ashtottariEligible: boolean;
  ashtottariReason: string;
  ashtottari: AshtottariPeriod[];
  narayanaStartSign: string;
  narayana: NarayanaDashaPeriod[];
}

// Ashtottari 8-planet order & years (total 108 years)
const ASHTOTTARI_ORDER: Array<{ lord: NineGrahaId; years: number; naksCount: number }> = [
  { lord: 'Sun', years: 6, naksCount: 4 },      // Krittika..Ardra (actually Ardra..Ashlesha = 4)
  { lord: 'Moon', years: 15, naksCount: 3 },    // Magha..Uttara Phalguni
  { lord: 'Mars', years: 8, naksCount: 4 },     // Hasta..Vishakha
  { lord: 'Mercury', years: 17, naksCount: 3 }, // Anuradha..Mula
  { lord: 'Saturn', years: 10, naksCount: 4 },  // Purva Ashadha..Abhijit..Shravana (28-nak scheme)
  { lord: 'Jupiter', years: 19, naksCount: 3 }, // Dhanishta..Purva Bhadrapada
  { lord: 'Rahu', years: 12, naksCount: 4 },    // Uttara Bhadrapada..Bharani
  { lord: 'Venus', years: 21, naksCount: 3 },   // Krittika..Mrigashira
];

// Map 27 standard Nakshatras (0=Ashwini..26=Revati) into Ashtottari lord index (0..7)
// Classical Ardra-start grouping: Ardra(5)->Sun, Pushya/Ashlesha...
const ASHTOTTARI_27_LORD_IDX: number[] = [
  6, 6, 7, 7, 7, // Ashwini(0), Bharani(1)=Rahu; Krittika(2), Rohini(3), Mrigashira(4)=Venus
  0, 0, 0, 0,    // Ardra(5)..Ashlesha(8)=Sun
  1, 1, 1,       // Magha(9)..U.Phalguni(11)=Moon
  2, 2, 2, 2,    // Hasta(12)..Vishakha(15)=Mars
  3, 3, 3,       // Anuradha(16)..Mula(18)=Mercury
  4, 4, 4,       // P.Ashadha(19)..Shravana(21)=Saturn (Abhijit spans end of U.Ashadha/Shravana)
  5, 5, 5,       // Dhanishta(22)..P.Bhadra(24)=Jupiter
  6, 6,          // U.Bhadra(25), Revati(26)=Rahu
];

function computeHouseStrengthScore(chart: ChartData, signIdx: number): number {
  const occ = chart.planets.filter((p) => p.signIndex === signIdx);
  let score = occ.length * 10;
  for (const p of occ) {
    if (['Jupiter', 'Mercury', 'Venus'].includes(p.id)) score += 6;
    if (['Exalted', 'Moolatrikona', 'Own Sign'].includes(p.dignity)) score += 8;
  }
  const lord = SIGNS[signIdx].lord;
  const lordBody = chart.planets.find((p) => p.id === lord)!;
  if (lordBody.signIndex === signIdx) score += 12;
  if (['Exalted', 'Moolatrikona', 'Own Sign'].includes(lordBody.dignity)) score += 6;
  return score;
}

export function computeAdvancedDashas(chart: ChartData): AdvancedDashaBundle {
  const daysPerYear = getDaysPerYear(chart.settings.dashaYearType);
  const msPerYear = daysPerYear * 86_400_000;
  const ascSign = chart.ascendant.signIndex;
  const moon = chart.planets.find((p) => p.id === 'Moon')!;
  const rahu = chart.planets.find((p) => p.id === 'Rahu')!;
  const lagnaLord = chart.planets.find((p) => p.id === SIGNS[ascSign].lord)!;

  // 1. Ashtottari Dasha
  const rahuFromLagnaLord = ((rahu.signIndex - lagnaLord.signIndex + 12) % 12) + 1;
  const ashtottariEligible =
    [1, 4, 5, 7, 9, 10].includes(rahuFromLagnaLord) && rahu.signIndex !== ascSign;
  const ashtottariReason = ashtottariEligible
    ? `Applicable: Rahu sits in House ${rahuFromLagnaLord} (Kendra/Trikona) from Lagna Lord ${lagnaLord.id} and not in Lagna.`
    : `Traditional primary condition (Rahu in Kendra/Trikona from Lagna Lord and outside Lagna) is not strictly met; shown for comparative research.`;

  const nakSpan = 360 / 27;
  const moonLon = normalizeDeg(moon.longitude);
  const nakIdx = Math.floor(moonLon / nakSpan) % 27;
  const startGroupIdx = ASHTOTTARI_27_LORD_IDX[nakIdx];

  // Calculate fraction elapsed within that Ashtottari nakshatra group
  let groupStartNak = nakIdx;
  while (ASHTOTTARI_27_LORD_IDX[(groupStartNak + 26) % 27] === startGroupIdx && groupStartNak !== nakIdx + 1) {
    groupStartNak = (groupStartNak + 26) % 27;
    if (groupStartNak === 0 && ASHTOTTARI_27_LORD_IDX[26] !== startGroupIdx) break;
  }
  const naksInGroup = ASHTOTTARI_27_LORD_IDX.filter((x) => x === startGroupIdx).length;
  const posInGroup =
    ((nakIdx - groupStartNak + 27) % 27) + (moonLon - nakIdx * nakSpan) / nakSpan;
  const fracElapsed = Math.min(0.999, Math.max(0, posInGroup / naksInGroup));

  const firstItem = ASHTOTTARI_ORDER[startGroupIdx];
  let cursor = chart.utcMs - fracElapsed * firstItem.years * msPerYear;
  const ashtottari: AshtottariPeriod[] = [];

  for (let i = 0; i < 8; i++) {
    const item = ASHTOTTARI_ORDER[(startGroupIdx + i) % 8];
    const endMs = cursor + item.years * msPerYear;
    ashtottari.push({
      lord: item.lord,
      years: item.years,
      startDate: formatLocalDateTimeFromUtc(cursor, chart.offsetMinutesUsed).slice(0, 10),
      endDate: formatLocalDateTimeFromUtc(endMs, chart.offsetMinutesUsed).slice(0, 10),
      startMs: cursor,
      endMs,
      note: `${item.lord} Ashtottari (${item.years}y) activates ${item.lord}'s natal House ${chart.planets.find((p) => p.id === item.lord)!.rasiHouseNumber}.`,
    });
    cursor = endMs;
  }

  // 2. Narayana Dasha (Stronger of 1st vs 7th sign seeds the sequence)
  const h7Sign = (ascSign + 6) % 12;
  const s1 = computeHouseStrengthScore(chart, ascSign);
  const s7 = computeHouseStrengthScore(chart, h7Sign);
  const seedSign = s1 >= s7 ? ascSign : h7Sign;

  const oddFooted = [0, 1, 2, 6, 7, 8]; // Direct count signs
  const stepDir = oddFooted.includes(seedSign) ? 1 : -1;
  const mod = seedSign % 3; // 0=Movable (+1), 1=Fixed (+5), 2=Dual (+3)
  const jump = mod === 0 ? 1 : mod === 1 ? 5 : 3;

  const seqSigns: number[] = [];
  for (let i = 0; i < 12; i++) {
    const s = ((seedSign + stepDir * i * jump) % 12 + 12) % 12;
    if (!seqSigns.includes(s)) seqSigns.push(s);
  }
  for (let i = 0; i < 12; i++) {
    if (!seqSigns.includes(i)) seqSigns.push(i);
  }

  const pickLord = (sIdx: number): SevenPlanetId => SIGNS[sIdx].lord;
  const narayana: NarayanaDashaPeriod[] = [];
  let nCursor = chart.utcMs;

  for (const sIdx of seqSigns) {
    const lordId = pickLord(sIdx);
    const lordBody = chart.planets.find((p) => p.id === lordId)!;
    const isDirect = oddFooted.includes(sIdx);
    let yrs = isDirect
      ? (lordBody.signIndex - sIdx + 12) % 12
      : (sIdx - lordBody.signIndex + 12) % 12;
    if (yrs === 0) yrs = 12;
    if (lordBody.dignity === 'Exalted') yrs = Math.min(12, yrs + 1);
    else if (lordBody.dignity === 'Debilitated') yrs = Math.max(1, yrs - 1);

    const endMs = nCursor + yrs * msPerYear;
    const hFromLagna = ((sIdx - ascSign + 12) % 12) + 1;

    // Paka Rasi = sign occupied by Dasha sign's lord; Bhoga Rasi = Arudha of Dasha sign
    const dist = (lordBody.signIndex - sIdx + 12) % 12;
    let bhogaIdx = (lordBody.signIndex + dist) % 12;
    if (bhogaIdx === sIdx || bhogaIdx === (sIdx + 6) % 12) {
      bhogaIdx = (bhogaIdx + 9) % 12;
    }

    narayana.push({
      signIndex: sIdx,
      signName: SIGNS[sIdx].name,
      years: yrs,
      startDate: formatLocalDateTimeFromUtc(nCursor, chart.offsetMinutesUsed).slice(0, 10),
      endDate: formatLocalDateTimeFromUtc(endMs, chart.offsetMinutesUsed).slice(0, 10),
      startMs: nCursor,
      endMs,
      houseFromLagna: hFromLagna,
      pakaSign: lordBody.signName,
      bhogaSign: SIGNS[bhogaIdx].name,
      note: `Focus on H${hFromLagna} (${SIGNS[sIdx].name}); Paka in ${lordBody.signName}, Bhoga in ${SIGNS[bhogaIdx].name}.`,
    });
    nCursor = endMs;
  }

  return {
    ashtottariEligible,
    ashtottariReason,
    ashtottari,
    narayanaStartSign: SIGNS[seedSign].name,
    narayana,
  };
}

export function computeSudarshanaChakra(chart: ChartData, targetYear: number): SudarshanaWheelResult {
  const birthYear = parseInt(chart.input.date.slice(0, 4), 10) || 2000;
  const age = Math.max(1, targetYear - birthYear + 1); // Running year (1st year = Age 0..1)
  const houseStep = ((age - 1) % 12) + 1; // 1..12

  const moon = chart.planets.find((p) => p.id === 'Moon')!;
  const sun = chart.planets.find((p) => p.id === 'Sun')!;

  const lagnaSignIdx = (chart.ascendant.signIndex + houseStep - 1) % 12;
  const moonSignIdx = (moon.signIndex + houseStep - 1) % 12;
  const sunSignIdx = (sun.signIndex + houseStep - 1) % 12;

  const occIn = (sIdx: number) =>
    chart.planets.filter((p) => p.signIndex === sIdx).map((p) => p.id);

  const lOcc = occIn(lagnaSignIdx);
  const mOcc = occIn(moonSignIdx);
  const sOcc = occIn(sunSignIdx);

  return {
    age: age - 1,
    year: targetYear,
    lagnaHouse: houseStep,
    lagnaSign: SIGNS[lagnaSignIdx].name,
    moonHouse: houseStep,
    moonSign: SIGNS[moonSignIdx].name,
    sunHouse: houseStep,
    sunSign: SIGNS[sunSignIdx].name,
    lagnaOccupants: lOcc,
    moonOccupants: mOcc,
    sunOccupants: sOcc,
    synthesis: `Running year #${age} (Age ${age - 1}) activates House ${houseStep} across all three Sudarshana wheels: Lagna (${SIGNS[lagnaSignIdx].name}), Moon (${SIGNS[moonSignIdx].name}), and Sun (${SIGNS[sunSignIdx].name}). ${
      lOcc.length + mOcc.length + sOcc.length > 0
        ? `Natal planets triggered across these wheels: ${Array.from(new Set([...lOcc, ...mOcc, ...sOcc])).join(', ')}.`
        : 'Rely on the lords of these three signs to assess annual momentum.'
    }`,
  };
}

// --------------------------------------------------------------------------
// 3. Kalachakra Dasha (कालचक्र दशा - Maharishi Parashara BPHS)
// --------------------------------------------------------------------------

export interface KalachakraPeriod {
  signIndex: number;
  signName: string;
  signNameHi: string;
  years: number;
  startDate: string;
  endDate: string;
  startMs: number;
  endMs: number;
  gati: 'Normal' | 'Mandooki' | 'Markati' | 'Simhavalokana';
  gatiHi: string;
  isDehaRasi: boolean;
  isJeevaRasi: boolean;
  note: string;
}

export interface KalachakraDashaReport {
  isSavya: boolean;
  movementType: 'Savya (Direct Clockwise)' | 'Apasavya (Indirect Counter-Clockwise)';
  movementTypeHi: string;
  nakshatraName: string;
  pada: number;
  dehaRasiIndex: number;
  dehaRasiName: string;
  dehaRasiNameHi: string;
  jeevaRasiIndex: number;
  jeevaRasiName: string;
  jeevaRasiNameHi: string;
  periods: KalachakraPeriod[];
}

const KALACHAKRA_SIGN_YEARS = [7, 16, 9, 21, 5, 9, 16, 7, 10, 4, 4, 10]; // Aries(0)..Pisces(11)
const SIGN_NAMES_HI = ['मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या', 'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुंभ', 'मीन'];

// Savya Nakshatras: 0, 2, 6, 8, 9, 11, 15, 17, 18, 20, 24, 26
const SAVYA_NAKSHATRAS = new Set([0, 2, 6, 8, 9, 11, 15, 17, 18, 20, 24, 26]);

export function computeKalachakraDasha(chart: ChartData): KalachakraDashaReport {
  const daysPerYear = getDaysPerYear(chart.settings.dashaYearType);
  const msPerYear = daysPerYear * 86_400_000;
  const moon = chart.planets.find((p) => p.id === 'Moon')!;
  const moonLon = normalizeDeg(moon.longitude);
  const nakSpan = 360 / 27;
  const nakIdx = Math.floor(moonLon / nakSpan) % 27;
  const padaSpan = nakSpan / 4;
  const padaIdx = Math.floor((moonLon % nakSpan) / padaSpan); // 0..3 (Pada 1..4)
  const isSavya = SAVYA_NAKSHATRAS.has(nakIdx);

  // Sequences based on Pada (0..3)
  let signProgression: number[];
  let dehaIdx: number;
  let jeevaIdx: number;

  if (isSavya) {
    if (padaIdx === 0) {
      // Pada 1: Aries to Sagittarius
      signProgression = [0, 1, 2, 3, 4, 5, 6, 7, 8];
      dehaIdx = 0; // Aries
      jeevaIdx = 8; // Sagittarius
    } else if (padaIdx === 1) {
      // Pada 2: Capricorn to Gemini with leaps
      signProgression = [9, 10, 11, 7, 6, 5, 3, 4, 2];
      dehaIdx = 9; // Capricorn
      jeevaIdx = 2; // Gemini
    } else if (padaIdx === 2) {
      // Pada 3: Taurus to Gemini with leaps
      signProgression = [1, 0, 11, 10, 9, 8, 0, 1, 2];
      dehaIdx = 1; // Taurus
      jeevaIdx = 2; // Gemini
    } else {
      // Pada 4: Cancer to Pisces
      signProgression = [3, 4, 5, 6, 7, 8, 9, 10, 11];
      dehaIdx = 3; // Cancer
      jeevaIdx = 11; // Pisces
    }
  } else {
    // Apasavya
    if (padaIdx === 0) {
      signProgression = [7, 6, 5, 4, 3, 2, 1, 0, 11];
      dehaIdx = 7;
      jeevaIdx = 11;
    } else if (padaIdx === 1) {
      signProgression = [10, 9, 8, 0, 1, 2, 6, 7, 5];
      dehaIdx = 10;
      jeevaIdx = 5;
    } else if (padaIdx === 2) {
      signProgression = [4, 3, 2, 1, 0, 11, 10, 9, 8];
      dehaIdx = 4;
      jeevaIdx = 8;
    } else {
      signProgression = [2, 1, 0, 11, 10, 9, 8, 7, 6];
      dehaIdx = 2;
      jeevaIdx = 6;
    }
  }

  // Fraction elapsed in current pada
  const padaStart = nakIdx * nakSpan + padaIdx * padaSpan;
  const fracElapsed = Math.min(0.999, Math.max(0, (moonLon - padaStart) / padaSpan));

  const firstSign = signProgression[0];
  const firstYears = KALACHAKRA_SIGN_YEARS[firstSign];
  const birthRemYears = firstYears * (1 - fracElapsed);

  const periods: KalachakraPeriod[] = [];
  let cursor = chart.utcMs;

  for (let i = 0; i < signProgression.length; i++) {
    const sIdx = signProgression[i];
    const prevIdx = i > 0 ? signProgression[i - 1] : sIdx;
    const totalYears = KALACHAKRA_SIGN_YEARS[sIdx];
    const activeYears = i === 0 ? birthRemYears : totalYears;
    const endMs = cursor + activeYears * msPerYear;

    // Detect Gati
    let gati: KalachakraPeriod['gati'] = 'Normal';
    let gatiHi = 'सामान्य गति';
    const diff = (sIdx - prevIdx + 12) % 12;
    if (diff === 2 || diff === 10) {
      gati = 'Mandooki';
      gatiHi = 'मंडूक गति (Frog Leap)';
    } else if (diff === 11 || (prevIdx === 4 && sIdx === 3)) {
      gati = 'Markati';
      gatiHi = 'मर्कट गति (Monkey Leap)';
    } else if (diff >= 4 && diff <= 8) {
      gati = 'Simhavalokana';
      gatiHi = 'सिंहावलोकन गति (Lion Glance)';
    }

    const isDeha = sIdx === dehaIdx;
    const isJeeva = sIdx === jeevaIdx;

    periods.push({
      signIndex: sIdx,
      signName: SIGNS[sIdx].name,
      signNameHi: SIGN_NAMES_HI[sIdx],
      years: Math.round(activeYears * 10) / 10,
      startDate: formatLocalDateTimeFromUtc(cursor, chart.offsetMinutesUsed).slice(0, 10),
      endDate: formatLocalDateTimeFromUtc(endMs, chart.offsetMinutesUsed).slice(0, 10),
      startMs: cursor,
      endMs,
      gati,
      gatiHi,
      isDehaRasi: isDeha,
      isJeevaRasi: isJeeva,
      note: isDeha
        ? 'देह राशि (Deha Rasi - Physical body & health anchor)'
        : isJeeva
          ? 'जीव राशि (Jeeva Rasi - Vital soul, longevity & consciousness)'
          : `${gati !== 'Normal' ? gatiHi + ': ' : ''}${SIGNS[sIdx].name} कालचक्र दशा प्रभाव`,
    });

    cursor = endMs;
  }

  return {
    isSavya,
    movementType: isSavya ? 'Savya (Direct Clockwise)' : 'Apasavya (Indirect Counter-Clockwise)',
    movementTypeHi: isSavya ? 'सव्य चक्र (दक्षिणावर्त गति)' : 'अपसव्य चक्र (वामावर्त गति)',
    nakshatraName: moon.nakshatraName || 'Ashwini',
    pada: padaIdx + 1,
    dehaRasiIndex: dehaIdx,
    dehaRasiName: SIGNS[dehaIdx].name,
    dehaRasiNameHi: SIGN_NAMES_HI[dehaIdx],
    jeevaRasiIndex: jeevaIdx,
    jeevaRasiName: SIGNS[jeevaIdx].name,
    jeevaRasiNameHi: SIGN_NAMES_HI[jeevaIdx],
    periods,
  };
}

// --------------------------------------------------------------------------
// 4. Mandook Dasha (मंडूक दशा - Jaimini Frog Leap System)
// --------------------------------------------------------------------------

export interface MandookDashaPeriod {
  signIndex: number;
  signName: string;
  signNameHi: string;
  years: number;
  startDate: string;
  endDate: string;
  startMs: number;
  endMs: number;
  houseFromLagna: number;
  note: string;
}

export function computeMandookDasha(chart: ChartData): MandookDashaPeriod[] {
  const daysPerYear = getDaysPerYear(chart.settings.dashaYearType);
  const msPerYear = daysPerYear * 86_400_000;
  const ascSign = chart.ascendant.signIndex;

  // Mandook leap: jumps 3 signs (1st, 4th, 7th, 10th kendras, then panapharas, then apoklimas)
  const sequence: number[] = [];
  for (let round = 0; round < 3; round++) {
    for (let step = 0; step < 4; step++) {
      const s = (ascSign + round + step * 3) % 12;
      if (!sequence.includes(s)) sequence.push(s);
    }
  }

  const periods: MandookDashaPeriod[] = [];
  let cursor = chart.utcMs;

  for (const sIdx of sequence) {
    const isOdd = sIdx % 2 === 0; // Aries(0)=Odd, Taurus(1)=Even
    const years = isOdd ? 7 : 8; // Standard Jaimini Mandook duration
    const endMs = cursor + years * msPerYear;
    const hFromLagna = ((sIdx - ascSign + 12) % 12) + 1;

    periods.push({
      signIndex: sIdx,
      signName: SIGNS[sIdx].name,
      signNameHi: SIGN_NAMES_HI[sIdx],
      years,
      startDate: formatLocalDateTimeFromUtc(cursor, chart.offsetMinutesUsed).slice(0, 10),
      endDate: formatLocalDateTimeFromUtc(endMs, chart.offsetMinutesUsed).slice(0, 10),
      startMs: cursor,
      endMs,
      houseFromLagna: hFromLagna,
      note: `मंडूक छलांग (House ${hFromLagna}): ${SIGNS[sIdx].name} (${years} वर्ष)`,
    });

    cursor = endMs;
  }

  return periods;
}
