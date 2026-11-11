import * as Astronomy from 'astronomy-engine';
import { calculateChart } from './calculator';
import { SIGNS, VIMSHOTTARI_ORDER, VIMSHOTTARI_YEARS } from './constants';
import { computeAyanamsaDeg } from './ephemeris';
import { MUNTHA_HOUSE_PREDICTIONS } from './predictions/extendedKb';
import { formatDms, formatLocalDateTimeFromUtc, normalizeDeg } from './time';
import type { BirthInput, CalcSettings, ChartData, NineGrahaId, SevenPlanetId } from './types';

export interface MuddaDashaItem {
  lord: NineGrahaId;
  startDate: string;
  endDate: string;
  days: number;
}

export interface TajikaYogaInfo {
  name: string;
  planets: string;
  description: string;
}

export interface TajikaSahamItem {
  nameEn: string;
  nameHi: string;
  longitude: number;
  dms: string;
  signIndex: number;
  house: number;
  lord: SevenPlanetId;
}

export interface PanchadhikariInfo {
  munthaLord: SevenPlanetId;
  birthAscLord: SevenPlanetId;
  varshaAscLord: SevenPlanetId;
  triRashiLord: SevenPlanetId;
  dinRatriLord: SevenPlanetId;
}

export interface VarshaphalaReport {
  year: number;
  completedYears: number;
  varshaPraveshUtcIso: string;
  varshaPraveshLocal: string;
  varshaChart: ChartData;
  munthaSignIndex: number;
  munthaSignName: string;
  munthaHouse: number;
  munthaPrediction: string;
  varshesh: SevenPlanetId;
  varsheshStrengthNote: string;
  panchadhikari: PanchadhikariInfo;
  sahams: TajikaSahamItem[];
  muddaDasha: MuddaDashaItem[];
  tajikaYogas: TajikaYogaInfo[];
  annualSummary: string;
}

function sunSiderealAtMs(ms: number, ayanamsa: CalcSettings['ayanamsa']): number {
  const t = new Astronomy.AstroTime(new Date(ms));
  const trop = Astronomy.SunPosition(t).elon;
  return normalizeDeg(trop - computeAyanamsaDeg(t, ayanamsa));
}

function findSolarReturnMs(
  natalUtcMs: number,
  natalSunSid: number,
  completedYears: number,
  ayanamsa: CalcSettings['ayanamsa']
): number {
  if (completedYears <= 0) return natalUtcMs;
  const tropicalYearMs = 365.24219 * 86_400_000;
  let guess = natalUtcMs + completedYears * tropicalYearMs;

  // Secant/Newton refinement (Sun moves ~0.9856°/day)
  for (let i = 0; i < 12; i++) {
    const cur = sunSiderealAtMs(guess, ayanamsa);
    let diff = natalSunSid - cur;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    if (Math.abs(diff) < 1e-5) break;
    guess += (diff / 0.985647) * 86_400_000;
  }
  return guess;
}

export function computeVarshaphala(
  natalChart: ChartData,
  targetYear: number
): VarshaphalaReport {
  const birthYear = parseInt(natalChart.input.date.slice(0, 4), 10) || 2000;
  const completedYears = Math.max(0, targetYear - birthYear);
  const natalSun = natalChart.planets.find((p) => p.id === 'Sun')!;
  const returnMs = findSolarReturnMs(
    natalChart.utcMs,
    natalSun.longitude,
    completedYears,
    natalChart.settings.ayanamsa
  );
  const nextReturnMs = findSolarReturnMs(
    natalChart.utcMs,
    natalSun.longitude,
    completedYears + 1,
    natalChart.settings.ayanamsa
  );

  const localRet = new Date(returnMs + natalChart.offsetMinutesUsed * 60_000);
  const pad = (n: number) => String(n).padStart(2, '0');
  const retDate = `${localRet.getUTCFullYear()}-${pad(localRet.getUTCMonth() + 1)}-${pad(localRet.getUTCDate())}`;
  const retTime = `${pad(localRet.getUTCHours())}:${pad(localRet.getUTCMinutes())}:${pad(localRet.getUTCSeconds())}`;

  const varshaInput: BirthInput = {
    ...natalChart.input,
    id: `varsha-${targetYear}`,
    name: `${natalChart.input.name} (Varshaphala ${targetYear})`,
    date: retDate,
    time: retTime,
    timezone: 'MANUAL',
    utcOffsetMinutes: natalChart.offsetMinutesUsed,
  };

  const varshaChart = calculateChart(varshaInput, natalChart.settings);

  // Muntha
  const munthaSignIndex = (natalChart.ascendant.signIndex + completedYears) % 12;
  const munthaHouse = ((munthaSignIndex - varshaChart.ascendant.signIndex + 12) % 12) + 1;
  const munthaPrediction = MUNTHA_HOUSE_PREDICTIONS[munthaHouse - 1];

  // Varshesh (Lord of the Year) candidates: Muntha Lord, Birth Lagna Lord, Varsha Lagna Lord
  const munthaLord = SIGNS[munthaSignIndex].lord;
  const natalLagnaLord = SIGNS[natalChart.ascendant.signIndex].lord;
  const varshaLagnaLord = SIGNS[varshaChart.ascendant.signIndex].lord;
  const candidates = Array.from(new Set([munthaLord, varshaLagnaLord, natalLagnaLord]));

  let bestVarshesh = varshaLagnaLord;
  let bestScore = -1;
  for (const c of candidates) {
    const sh = varshaChart.shadbala.find((s) => s.planet === c);
    const p = varshaChart.planets.find((x) => x.id === c);
    const hasAspectOnVarshaAsc =
      p &&
      (p.rasiHouseNumber === 1 ||
        p.rasiHouseNumber === 7 ||
        (p.id === 'Jupiter' && [5, 9].includes(p.rasiHouseNumber)) ||
        (p.id === 'Mars' && [4, 8].includes(p.rasiHouseNumber)) ||
        (p.id === 'Saturn' && [3, 10].includes(p.rasiHouseNumber)));
    const score = (sh?.ratio ?? 1) * 10 + (hasAspectOnVarshaAsc ? 4 : 0);
    if (score > bestScore) {
      bestScore = score;
      bestVarshesh = c;
    }
  }

  const varsheshBody = varshaChart.planets.find((p) => p.id === bestVarshesh)!;
  const varsheshStrengthNote = `${bestVarshesh} serves as Year Lord (Varshesh), placed in House ${varsheshBody.rasiHouseNumber} (${varsheshBody.signName}, ${varsheshBody.dignity}).`;

  // Mudda Dasha (360-day year cycle)
  const startLord = varshaChart.panchang.nakshatra.lord;
  const startIdx = VIMSHOTTARI_ORDER.indexOf(startLord);
  const yearSpanMs = nextReturnMs - returnMs;
  const muddaDasha: MuddaDashaItem[] = [];
  let cursor = returnMs;
  for (let i = 0; i < 9; i++) {
    const lord = VIMSHOTTARI_ORDER[(startIdx + i) % 9];
    const span = yearSpanMs * (VIMSHOTTARI_YEARS[lord] / 120);
    const end = cursor + span;
    muddaDasha.push({
      lord,
      startDate: formatLocalDateTimeFromUtc(cursor, natalChart.offsetMinutesUsed).slice(0, 10),
      endDate: formatLocalDateTimeFromUtc(end, natalChart.offsetMinutesUsed).slice(0, 10),
      days: Math.round((span / 86_400_000) * 10) / 10,
    });
    cursor = end;
  }

  // Detect key Tajika Ithasala / Easarpha aspects between Varshesh & Lagna Lord / 10th / 7th lords
  const tajikaYogas: TajikaYogaInfo[] = [];
  const varsha10Lord = SIGNS[(varshaChart.ascendant.signIndex + 9) % 12].lord;
  const checkPair = (aId: SevenPlanetId, bId: SevenPlanetId, label: string) => {
    if (aId === bId) return;
    const pA = varshaChart.planets.find((p) => p.id === aId)!;
    const pB = varshaChart.planets.find((p) => p.id === bId)!;
    const hDiff = ((pB.signIndex - pA.signIndex + 12) % 12) + 1;
    if ([1, 3, 5, 7, 9, 11].includes(hDiff)) {
      const faster = pA.speedDegPerDay > pB.speedDegPerDay ? pA : pB;
      const slower = faster === pA ? pB : pA;
      const applying = faster.degreeInSign < slower.degreeInSign;
      tajikaYogas.push({
        name: applying ? `Ithasala Yoga (${label})` : `Easarpha Yoga (${label})`,
        planets: `${aId} & ${bId}`,
        description: applying
          ? `Applying Tajika aspect (${hDiff}th) between faster ${faster.id} and slower ${slower.id} promises emerging results.`
          : `Separating Tajika aspect (${hDiff}th) indicates matters shifting from planning into reflection.`,
      });
    }
  };
  checkPair(varshaLagnaLord, varsha10Lord, 'Career');
  checkPair(varshaLagnaLord, bestVarshesh, 'Year Focus');

  // Panchadhikari (5 Office Bearers of Tajika)
  const vSun = varshaChart.planets.find((p) => p.id === 'Sun')!;
  const vMoon = varshaChart.planets.find((p) => p.id === 'Moon')!;
  const isDayBirth = vSun.rasiHouseNumber >= 7 && vSun.rasiHouseNumber <= 12;
  const triRashiTable: Record<number, SevenPlanetId> = {
    0: isDayBirth ? 'Sun' : 'Jupiter', 4: isDayBirth ? 'Sun' : 'Jupiter', 8: isDayBirth ? 'Sun' : 'Jupiter',
    1: isDayBirth ? 'Venus' : 'Moon', 5: isDayBirth ? 'Venus' : 'Moon', 9: isDayBirth ? 'Venus' : 'Moon',
    2: isDayBirth ? 'Saturn' : 'Mercury', 6: isDayBirth ? 'Saturn' : 'Mercury', 10: isDayBirth ? 'Saturn' : 'Mercury',
    3: isDayBirth ? 'Mars' : 'Venus', 7: isDayBirth ? 'Mars' : 'Venus', 11: isDayBirth ? 'Mars' : 'Venus',
  };
  const panchadhikari: PanchadhikariInfo = {
    munthaLord,
    birthAscLord: natalLagnaLord,
    varshaAscLord: varshaLagnaLord,
    triRashiLord: triRashiTable[varshaChart.ascendant.signIndex] ?? 'Jupiter',
    dinRatriLord: isDayBirth ? vSun.signLord : vMoon.signLord,
  };

  // 16 Classic Tajika Sahams (A - B + C, reversing day/night where classical Neelakanthi applies)
  const pLon = (id: SevenPlanetId) => varshaChart.planets.find((p) => p.id === id)!.longitude;
  const vAsc = varshaChart.ascendant.longitude;
  const vCusps = varshaChart.houses;
  const cLon = (h: number) => vCusps[(h - 1) % 12].midpoint;

  const mkSaham = (
    nameEn: string,
    nameHi: string,
    dayA: number,
    dayB: number,
    addC: number = vAsc,
    reverseAtNight = true
  ): TajikaSahamItem => {
    const a = isDayBirth || !reverseAtNight ? dayA : dayB;
    const b = isDayBirth || !reverseAtNight ? dayB : dayA;
    const lon = normalizeDeg(a - b + addC);
    const sIdx = Math.floor(lon / 30) % 12;
    const h = ((sIdx - varshaChart.ascendant.signIndex + 12) % 12) + 1;
    return {
      nameEn,
      nameHi,
      longitude: lon,
      dms: formatDms(lon % 30),
      signIndex: sIdx,
      house: h,
      lord: SIGNS[sIdx].lord,
    };
  };

  const sahams: TajikaSahamItem[] = [
    mkSaham('Punya Saham (Fortune)', 'पुण्य सहम (सौभाग्य)', pLon('Moon'), pLon('Sun')),
    mkSaham('Vidya Saham (Education)', 'विद्या सहम (शिक्षा)', pLon('Sun'), pLon('Moon')),
    mkSaham('Yashas Saham (Fame)', 'यश सहम (कीर्ति)', pLon('Jupiter'), pLon('Moon')),
    mkSaham('Mitra Saham (Friends)', 'मित्र सहम (सहयोग)', pLon('Jupiter'), pLon('Venus')),
    mkSaham('Mahatmya Saham (Prestige)', 'माहात्म्य सहम (गौरव)', pLon('Moon'), pLon('Mars')),
    mkSaham('Asha Saham (Desires)', 'आशा सहम (मनोकामना)', pLon('Saturn'), pLon('Mars')),
    mkSaham('Samartha Saham (Enterprise)', 'समर्थ सहम (पराक्रम)', pLon('Mars'), varshaChart.planets.find((p) => p.id === 'Mars')!.signLord === 'Mars' ? vAsc : cLon(1)),
    mkSaham('Bhratru Saham (Siblings)', 'भ्रातृ सहम (भाई-बहन)', pLon('Jupiter'), pLon('Saturn'), vAsc, false),
    mkSaham('Gaurava Saham (Honor)', 'गौरव सहम (सम्मान)', pLon('Jupiter'), pLon('Moon')),
    mkSaham('Pitru Saham (Father)', 'पितृ सहम (पिता)', pLon('Saturn'), pLon('Sun')),
    mkSaham('Rajya Saham (Authority/Career)', 'राज्य सहम (पद-अधिकार)', pLon('Saturn'), pLon('Sun')),
    mkSaham('Vivaha Saham (Marriage)', 'विवाह सहम (दांपत्य)', pLon('Venus'), pLon('Saturn'), vAsc, false),
    mkSaham('Santana Saham (Progeny)', 'संतान सहम (पुत्र सुख)', pLon('Jupiter'), pLon('Moon')),
    mkSaham('Artha Saham (Wealth)', 'अर्थ सहम (धन)', cLon(2), vAsc, vAsc, false),
    mkSaham('Karma Saham (Profession)', 'कर्म सहम (व्यवसाय)', pLon('Mars'), pLon('Mercury')),
    mkSaham('Roga Saham (Health Caution)', 'रोग सहम (स्वास्थ्य)', vAsc, pLon('Moon'), vAsc, true),
  ];

  const annualSummary = `Solar Year ${targetYear} (Age ${completedYears}) opens with ${varshaChart.ascendant.signName} Varsha Lagna, Muntha in House ${munthaHouse} (${SIGNS[munthaSignIndex].name}), and ${bestVarshesh} as Year Lord. ${munthaPrediction}`;

  return {
    year: targetYear,
    completedYears,
    varshaPraveshUtcIso: new Date(returnMs).toISOString(),
    varshaPraveshLocal: formatLocalDateTimeFromUtc(returnMs, natalChart.offsetMinutesUsed),
    varshaChart,
    munthaSignIndex,
    munthaSignName: SIGNS[munthaSignIndex].name,
    munthaHouse,
    munthaPrediction,
    varshesh: bestVarshesh,
    varsheshStrengthNote,
    panchadhikari,
    sahams,
    muddaDasha,
    tajikaYogas,
    annualSummary,
  };
}
