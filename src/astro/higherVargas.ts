import * as Astronomy from 'astronomy-engine';
import { computeAvakahadaChakra, computeGhatakChakra } from './avakahadaChalit';
import { AYANAMSA_META, PLANET_SHORT, SIGNS } from './constants';
import {
  computeAscendantAndMcTropical,
  computeAyanamsaDeg,
  computeSunriseSunsetForLocalDay,
  getTropicalPosition,
} from './ephemeris';
import { computeNumerologyReport } from './numerology';
import { LAGNA_EXTENDED_KB } from './predictions/extendedKb';
import { evaluateParamayusStatus } from './predictions/paramayus';
import {
  formatDateDmy,
  formatDms,
  formatLocalTimeFromUtc,
  formatOffsetString,
  getIanaOffsetMinutes,
  normalizeDeg,
} from './time';
import type {
  ChartData,
  DignityLevel,
  PlanetId,
} from './types';
import { evaluateDignity, getDivisionalLongitude, getDivisionalSignIndex } from './vargas';

export type HigherVargaId =
  | 'D64'
  | 'D72'
  | 'D81'
  | 'D108'
  | 'D144'
  | 'D150'
  | 'D300'
  | 'D360';

export interface HigherVargaMeta {
  id: HigherVargaId;
  division: number;
  nameEn: string;
  nameHi: string;
  sanskrit: string;
  spanDms: string;
  methodEn: string;
  methodHi: string;
  significationEn: string;
  significationHi: string;
}

export interface HigherVargaPlacement {
  id: PlanetId | 'Asc';
  shortLabel: string;
  rasiSignIndex: number;
  rasiDegInSign: number;
  amsaNumber: number; // 1..division
  amsaName?: string; // Traditional Chandra-Kala Nadiamsa name (for D150)
  vargaSignIndex: number;
  vargaDegInSign: number;
  vargaDms: string;
  signLord: PlanetId;
  houseFromVargaLagna: number; // 1..12
  dignity: DignityLevel;
  isRetrograde: boolean;
  isCombust: boolean;
  isMicroVargottama: boolean; // same sign as D1
  d9Match: boolean; // same sign as D9 Navamsa
}

export interface HigherVargaChart {
  meta: HigherVargaMeta;
  lagnaSignIndex: number;
  lagnaAmsaNumber: number;
  khara64thNavamsaLagnaSignIndex: number;
  khara64thNavamsaMoonSignIndex: number;
  placements: HigherVargaPlacement[];
}

export interface MicroSensitivityRow {
  deltaSeconds: number;
  label: string;
  localTime: string;
  d1LagnaSignIndex: number;
  vargaLagnaSignIndex: number;
  vargaLagnaAmsa: number;
  vargaMoonSignIndex: number;
  vargaMoonAmsa: number;
  lagnaShiftedFromZero: boolean;
  moonShiftedFromZero: boolean;
}

export const HIGHER_VARGA_META: HigherVargaMeta[] = [
  {
    id: 'D64',
    division: 64,
    nameEn: 'Chatushshashtiamsa (D-64)',
    nameHi: 'चतुःषष्ट्यंश (D-64)',
    sanskrit: 'Chatushshashtiamsa',
    spanDms: `0°28'07.5"`,
    methodEn: '64 parts per sign + 64th Navamsa (Khara) from D1/D9',
    methodHi: 'प्रत्येक राशि के 64 अंश + D1/D9 से 64वां खर नवांश',
    significationEn: 'Longevity crises, 64th Navamsa vulnerabilities & deep karmic testing',
    significationHi: 'आयुष्य संकट, 64वां खर नवांश प्रभाव व गहन कर्मिक परीक्षण',
  },
  {
    id: 'D72',
    division: 72,
    nameEn: 'Ashta-Navamsa (D-72)',
    nameHi: 'अष्ट-नवांश (D-72)',
    sanskrit: 'Ashtanavamsa (D8 × D9)',
    spanDms: `0°25'00"`,
    methodEn: 'Ashtamsa (D-8) calculated within Navamsa (D-9)',
    methodHi: 'नवांश (D-9) के भीतर अष्टमांश (D-8) गणना',
    significationEn: 'Sudden transformations, hidden karma & longevity endurance (D8 × D9)',
    significationHi: 'आकस्मिक परिवर्तन, गुप्त कर्म व संकट सहनशक्ति (D8 × D9)',
  },
  {
    id: 'D81',
    division: 81,
    nameEn: 'Nava-Navamsa (D-81)',
    nameHi: 'नव-नवांश (D-81)',
    sanskrit: 'Nava-Navamsa (D9 × D9)',
    spanDms: `0°22'13.3"`,
    methodEn: 'Navamsa (D-9) calculated within Navamsa (D-9)',
    methodHi: 'नवांश (D-9) के भीतर पुनः नवांश (D-9) गणना',
    significationEn: 'Subtlest Dharma, deepest marital soul-bond & divine grace',
    significationHi: 'सूक्ष्म धर्म, विवाह का गहन आत्मा-संबंध व दैवीय कृपा',
  },
  {
    id: 'D108',
    division: 108,
    nameEn: 'Ashtottaramsa (D-108)',
    nameHi: 'अष्टोत्तरांश (D-108)',
    sanskrit: 'Ashtottaramsa (D12 × D9)',
    spanDms: `0°16'40"`,
    methodEn: 'Jaimini Dwadasamsa (D-12) within Navamsa (D-9) — 108 padas/sign',
    methodHi: 'नवांश (D-9) के भीतर द्वादशांश (D-12) — प्रति राशि 108 भाग',
    significationEn: 'Total soul karma blueprint, past-life debt & spiritual culmination',
    significationHi: 'संपूर्ण आत्मिक प्रारब्ध, पूर्व-जन्म संस्कार व आध्यात्मिक परिणति',
  },
  {
    id: 'D144',
    division: 144,
    nameEn: 'Dwadasa-Dwadasamsa (D-144)',
    nameHi: 'द्वादश-द्वादशांश (D-144)',
    sanskrit: 'Dwadasa-Dwadasamsa (D12 × D12)',
    spanDms: `0°12'30"`,
    methodEn: 'Dwadasamsa (D-12) calculated within Dwadasamsa (D-12)',
    methodHi: 'द्वादशांश (D-12) के भीतर पुनः द्वादशांश (D-12) गणना',
    significationEn: 'Deepest ancestral lineage, Pitra karma & hereditary tendencies',
    significationHi: 'गहन पितृ-वंश परंपरा, कुल कर्म व आनुवंशिक प्रवृत्तियाँ',
  },
  {
    id: 'D150',
    division: 150,
    nameEn: 'Nadiamsa (D-150)',
    nameHi: 'नाड़ीअंश (D-150)',
    sanskrit: 'Chandra-Kala Nadiamsa',
    spanDms: `0°12'00"`,
    methodEn: '150 unequal/equal Nadi parts per sign (Chandra Kala / Deva Keralam)',
    methodHi: 'चंद्रकला नाड़ी (देवकेरलम्) — प्रति राशि 150 नाड़ीअंश (0°12′)',
    significationEn: 'Master Nadi destiny division, twin-birth separator & minute life-timing',
    significationHi: 'देवकेरलम् नाड़ीअंश: सूक्ष्मतम जीवन-लेख एवं जुड़वाँ कुंडली भेदक',
  },
  {
    id: 'D300',
    division: 300,
    nameEn: 'Ardha-Nadiamsa (D-300)',
    nameHi: 'अर्ध-नाड़ीअंश (D-300)',
    sanskrit: 'Ardha-Nadiamsa',
    spanDms: `0°06'00"`,
    methodEn: '300 micro-divisions per sign (half-Nadiamsa = 6 arcminutes each)',
    methodHi: 'अर्ध-नाड़ीअंश — प्रति राशि 300 सूक्ष्म भाग (0°06′ प्रति अंश)',
    significationEn: 'Hyper-fine Birth Time Rectification (~24 sec Lagna shifts)',
    significationHi: 'अति-सूक्ष्म जन्म समय संशोधन (लगभग 24 सेकंड में लग्न परिवर्तन)',
  },
  {
    id: 'D360',
    division: 360,
    nameEn: 'Bhagamsha-Kala (D-360)',
    nameHi: 'भागांश-कला (D-360)',
    sanskrit: 'Bhagamsha-Kala',
    spanDms: `0°05'00"`,
    methodEn: '360 divisions per sign (5 arcminutes each = 4,320 zodiacal segments)',
    methodHi: 'प्रति राशि 360 भाग (0°05′ प्रति कला = 4,320 सूक्ष्म चक्र भाग)',
    significationEn: 'Ultimate micro-harmonic & twin differentiation (~20 sec Lagna sensitivity)',
    significationHi: 'परम-सूक्ष्म भागांश: लगभग 20 सेकंड जन्म समय संवेदनशीलता परीक्षण',
  },
];

// Classical Deva Keralam / Chandra Kala Nadiamsa 15-name repeating harmonic core cycle
// (used across 1..150 to surface traditional Sanskrit Nadiamsa nomenclature cleanly)
const NADIAMSA_CYCLE_15: Array<{ en: string; hi: string }> = [
  { en: 'Vasudha', hi: 'वसुधा' },
  { en: 'Vaishnavi', hi: 'वैष्णवी' },
  { en: 'Brahmi', hi: 'ब्राह्मी' },
  { en: 'Kalakuta', hi: 'कालकूटा' },
  { en: 'Sankari', hi: 'शंकरी' },
  { en: 'Sudhakari', hi: 'सुधाकरी' },
  { en: 'Sama', hi: 'समा' },
  { en: 'Pramada', hi: 'प्रमदा' },
  { en: 'Vikasini', hi: 'विकासिनी' },
  { en: 'Asvini', hi: 'अश्विनी' },
  { en: 'Bhargavi', hi: 'भार्गवी' },
  { en: 'Indira', hi: 'इंदिरा' },
  { en: 'Ambika', hi: 'अंबिका' },
  { en: 'Kalyani', hi: 'कल्याणी' },
  { en: 'Nandini', hi: 'नंदिनी' },
];

export function getNadiamsaTitle(amsaNumber: number): { en: string; hi: string } {
  const idx = ((Math.max(1, amsaNumber) - 1) % 15);
  const core = NADIAMSA_CYCLE_15[idx];
  const halfEn = amsaNumber <= 75 ? 'Purva (1st Half)' : 'Uttara (2nd Half)';
  const halfHi = amsaNumber <= 75 ? 'पूर्वार्ध' : 'उत्तरार्ध';
  return {
    en: `#${amsaNumber} ${core.en} · ${halfEn}`,
    hi: `#${amsaNumber} ${core.hi} · ${halfHi}`,
  };
}

/**
 * Computes exact sign index, in-sign longitude (0..30), and 1-based amsa number
 * for higher micro-harmonic charts D64, D72, D81, D108, D144, D150, D300, D360.
 */
export function resolveHigherVargaPosition(
  siderealLon: number,
  vargaId: HigherVargaId
): { signIndex: number; degreeInVarga: number; amsaNumber: number } {
  const lon = normalizeDeg(siderealLon);
  const sign = Math.floor(lon / 30) % 12;
  const deg = lon - sign * 30;
  const modality = sign % 3; // 0 = Movable, 1 = Fixed, 2 = Dual

  const meta = HIGHER_VARGA_META.find((m) => m.id === vargaId)!;
  const div = meta.division;
  const partSize = 30 / div;
  const part = Math.min(div - 1, Math.floor(deg / partSize));
  const degreeInVarga = ((deg - part * partSize) / partSize) * 30;

  if (vargaId === 'D64') {
    const signIndex = Math.floor((lon * 64) / 30) % 12;
    return { signIndex, degreeInVarga, amsaNumber: part + 1 };
  }

  if (vargaId === 'D72') {
    const d9Lon = getDivisionalLongitude(lon, 'D9');
    const signIndex = getDivisionalSignIndex(d9Lon, 'D8');
    return { signIndex, degreeInVarga, amsaNumber: part + 1 };
  }

  if (vargaId === 'D81') {
    const d9Lon = getDivisionalLongitude(lon, 'D9');
    const signIndex = getDivisionalSignIndex(d9Lon, 'D9');
    return { signIndex, degreeInVarga, amsaNumber: part + 1 };
  }

  if (vargaId === 'D108') {
    // Jaimini Ashtottaramsa = D12 of D9 (9 × 12 = 108 parts per sign)
    const d9Lon = getDivisionalLongitude(lon, 'D9');
    const signIndex = getDivisionalSignIndex(d9Lon, 'D12');
    return { signIndex, degreeInVarga, amsaNumber: part + 1 };
  }

  if (vargaId === 'D144') {
    // Dwadasa-Dwadasamsa = D12 of D12 (12 × 12 = 144 parts per sign)
    const d12Lon = getDivisionalLongitude(lon, 'D12');
    const signIndex = getDivisionalSignIndex(d12Lon, 'D12');
    return { signIndex, degreeInVarga, amsaNumber: part + 1 };
  }

  if (vargaId === 'D150') {
    // Chandra-Kala / Deva Keralam Nadiamsa ordering: Movable forward, Fixed reverse, Dual cyclic mid-start
    const directedIdx =
      modality === 0 ? part : modality === 1 ? 149 - part : (part + 75) % 150;
    const signIndex = (sign + directedIdx) % 12;
    return {
      signIndex,
      degreeInVarga,
      amsaNumber: directedIdx + 1,
    };
  }

  if (vargaId === 'D300') {
    // Ardha-Nadiamsa: continuous 6' progression across zodiac
    const signIndex = Math.floor(lon * 10) % 12;
    return { signIndex, degreeInVarga, amsaNumber: part + 1 };
  }

  // D360 (Bhagamsha-Kala: 5' continuous harmonic)
  const signIndex = Math.floor(lon * 12) % 12;
  return { signIndex, degreeInVarga, amsaNumber: part + 1 };
}

export function computeHigherDivisionalCharts(
  chart: ChartData
): Record<HigherVargaId, HigherVargaChart> {
  const allBodies = [chart.ascendant, ...chart.planets];
  const d9Chart = chart.divisionalCharts.D9;
  const d9AscSign = d9Chart.lagnaSignIndex;
  const moonBody = chart.planets.find((p) => p.id === 'Moon');
  const d9MoonSign =
    d9Chart.placements.find((p) => p.id === 'Moon')?.signIndex ?? d9AscSign;

  // 64th Navamsa (Khara) from any point in D9 is +63 navamsas = 4th sign in D9 (0-based +3)
  const khara64thNavamsaLagnaSignIndex = (d9AscSign + 3) % 12;
  const khara64thNavamsaMoonSignIndex = (d9MoonSign + 3) % 12;

  const result = {} as Record<HigherVargaId, HigherVargaChart>;

  for (const meta of HIGHER_VARGA_META) {
    const ascRes = resolveHigherVargaPosition(chart.ascendant.longitude, meta.id);
    const placements: HigherVargaPlacement[] = allBodies.map((b) => {
      const res =
        b.id === 'Asc'
          ? ascRes
          : resolveHigherVargaPosition(b.longitude, meta.id);
      const houseFromVargaLagna = ((res.signIndex - ascRes.signIndex + 12) % 12) + 1;
      const d9Sign =
        d9Chart.placements.find((p) => p.id === b.id)?.signIndex ?? -1;

      return {
        id: b.id,
        shortLabel: PLANET_SHORT[b.id] ?? b.shortLabel,
        rasiSignIndex: b.signIndex,
        rasiDegInSign: b.degreeInSign,
        amsaNumber: res.amsaNumber,
        amsaName:
          meta.id === 'D150' ? getNadiamsaTitle(res.amsaNumber).en : undefined,
        vargaSignIndex: res.signIndex,
        vargaDegInSign: res.degreeInVarga,
        vargaDms: formatDms(res.degreeInVarga),
        signLord: SIGNS[res.signIndex].lord,
        houseFromVargaLagna,
        dignity: evaluateDignity(
          b.id,
          res.signIndex,
          res.degreeInVarga,
          chart.maitriMatrix
        ),
        isRetrograde: b.isRetrograde,
        isCombust: b.isCombust,
        isMicroVargottama: res.signIndex === b.signIndex,
        d9Match: moonBody ? res.signIndex === d9Sign : false,
      };
    });

    result[meta.id] = {
      meta,
      lagnaSignIndex: ascRes.signIndex,
      lagnaAmsaNumber: ascRes.amsaNumber,
      khara64thNavamsaLagnaSignIndex,
      khara64thNavamsaMoonSignIndex,
      placements,
    };
  }

  return result;
}

/**
 * Computes fast micro-rectification sensitivity shifts (-60s .. +60s) showing exact
 * second offsets where the selected higher harmonic Lagna or Moon shifts sign or Amsa.
 */
export function computeMicroSensitivityShift(
  chart: ChartData,
  vargaId: HigherVargaId
): MicroSensitivityRow[] {
  const offsets = [-60, -30, -15, -5, 0, 5, 15, 30, 60];
  const baseAsc = resolveHigherVargaPosition(chart.ascendant.longitude, vargaId);
  const baseMoonLon =
    chart.planets.find((p) => p.id === 'Moon')?.longitude ?? 0;
  const baseMoon = resolveHigherVargaPosition(baseMoonLon, vargaId);

  return offsets.map((deltaSeconds) => {
    const tMs = chart.utcMs + deltaSeconds * 1000;
    const astroTime = new Astronomy.AstroTime(new Date(tMs));
    const ayan = computeAyanamsaDeg(astroTime, chart.settings.ayanamsa);
    const ascTrop = computeAscendantAndMcTropical(
      astroTime,
      chart.input.latitude,
      chart.input.longitude
    ).asc;
    const ascSid = normalizeDeg(ascTrop - ayan);
    const moonTrop = getTropicalPosition(
      'Moon',
      astroTime,
      chart.settings.nodeMode
    ).lon;
    const moonSid = normalizeDeg(moonTrop - ayan);

    const vAsc = resolveHigherVargaPosition(ascSid, vargaId);
    const vMoon = resolveHigherVargaPosition(moonSid, vargaId);
    const signLabel =
      deltaSeconds === 0
        ? '0s (Birth)'
        : `${deltaSeconds > 0 ? '+' : ''}${deltaSeconds}s`;

    return {
      deltaSeconds,
      label: signLabel,
      localTime: formatLocalTimeFromUtc(tMs, chart.offsetMinutesUsed, true),
      d1LagnaSignIndex: Math.floor(ascSid / 30) % 12,
      vargaLagnaSignIndex: vAsc.signIndex,
      vargaLagnaAmsa: vAsc.amsaNumber,
      vargaMoonSignIndex: vMoon.signIndex,
      vargaMoonAmsa: vMoon.amsaNumber,
      lagnaShiftedFromZero:
        vAsc.signIndex !== baseAsc.signIndex ||
        vAsc.amsaNumber !== baseAsc.amsaNumber,
      moonShiftedFromZero:
        vMoon.signIndex !== baseMoon.signIndex ||
        vMoon.amsaNumber !== baseMoon.amsaNumber,
    };
  });
}

// =========================================================================
// Structured 4-Table Basic Details Sheet (Person | Avakhada | Favourable | Ghatak)
// =========================================================================

export interface BasicDetailRow {
  key: string;
  labelEn: string;
  labelHi: string;
  valueEn: string;
  valueHi: string;
  mono?: boolean;
  tone?: 'good' | 'warn' | 'accent';
}

export interface BasicDetailsSheet {
  personDetails: BasicDetailRow[];
  avakhadaDetails: BasicDetailRow[];
  favourablePoints: BasicDetailRow[];
  ghatakMalefics: BasicDetailRow[];
  paramayusLocked: boolean;
}

function pad2(n: number): string {
  return String(Math.floor(Math.abs(n))).padStart(2, '0');
}

function formatHmsFromSeconds(totalSeconds: number, signed = false): string {
  const neg = totalSeconds < 0;
  let abs = Math.round(Math.abs(totalSeconds));
  const h = Math.floor(abs / 3600);
  abs -= h * 3600;
  const m = Math.floor(abs / 60);
  const s = abs - m * 60;
  const core = `${pad2(h)}:${pad2(m)}:${pad2(s)}`;
  if (!signed) return core;
  return `${neg ? '-' : '+'}${core}`;
}

function formatCoordDms(degFloat: number, posHem: string, negHem: string): string {
  const hem = degFloat >= 0 ? posHem : negHem;
  const abs = Math.abs(degFloat);
  let d = Math.floor(abs);
  const remMin = (abs - d) * 60;
  let m = Math.floor(remMin);
  let s = Math.round((remMin - m) * 60);
  if (s >= 60) {
    s -= 60;
    m += 1;
  }
  if (m >= 60) {
    m -= 60;
    d += 1;
  }
  return `${pad2(d)}:${pad2(m)}:${pad2(s)} ${hem}`;
}

function formatAyanamsaDashDms(deg: number): string {
  const abs = Math.abs(deg);
  let d = Math.floor(abs);
  const rem = (abs - d) * 60;
  let m = Math.floor(rem);
  let s = Math.round((rem - m) * 60);
  if (s >= 60) {
    s -= 60;
    m += 1;
  }
  if (m >= 60) {
    m -= 60;
    d += 1;
  }
  return `${String(d).padStart(3, '0')}-${pad2(m)}-${pad2(s)}`;
}

const WEEKDAY_NAMES = [
  { en: 'Sunday', hi: 'रविवार' },
  { en: 'Monday', hi: 'सोमवार' },
  { en: 'Tuesday', hi: 'मंगलवार' },
  { en: 'Wednesday', hi: 'बुधवार' },
  { en: 'Thursday', hi: 'गुरुवार' },
  { en: 'Friday', hi: 'शुक्रवार' },
  { en: 'Saturday', hi: 'शनिवार' },
];

const SIGN_HI = [
  'मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या',
  'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुंभ', 'मीन',
];

const PLANET_HI: Record<string, string> = {
  Sun: 'सूर्य', Moon: 'चंद्र', Mars: 'मंगल', Mercury: 'बुध',
  Jupiter: 'गुरु', Venus: 'शुक्र', Saturn: 'शनि', Rahu: 'राहु', Ketu: 'केतु',
};

const PLANET_MATURITY_AGES: Record<string, number[]> = {
  Sun: [22, 34, 46],
  Moon: [24, 36, 48],
  Mars: [28, 39, 51],
  Mercury: [32, 34, 41],
  Jupiter: [16, 33, 40],
  Venus: [25, 31, 45],
  Saturn: [36, 42, 54],
  Rahu: [42, 48],
  Ketu: [48, 52],
};

const METAL_BY_LORD: Record<string, { en: string; hi: string }> = {
  Sun: { en: 'Gold, Copper', hi: 'सोना, ताँबा' },
  Moon: { en: 'Silver, White Gold', hi: 'चाँदी' },
  Mars: { en: 'Copper, Gold', hi: 'ताँबा, सोना' },
  Mercury: { en: 'Bronze (Kansa), Brass, Gold', hi: 'काँसा, पीतल, सोना' },
  Jupiter: { en: 'Gold, Brass', hi: 'सोना, पीतल' },
  Venus: { en: 'Silver, Platinum, White Alloy', hi: 'चाँदी, प्लैटिनम' },
  Saturn: { en: 'Iron, Panchdhatu, Steel', hi: 'लोहा, पंचधातु' },
};

const GEM_TRANSLATE_HI: Array<[RegExp, string]> = [
  [/Ruby/gi, 'माणिक्य (Ruby)'],
  [/Pearl/gi, 'मोती (Pearl)'],
  [/Red Coral/gi, 'मूंगा (Red Coral)'],
  [/Emerald/gi, 'पन्ना (Emerald)'],
  [/Yellow Sapphire/gi, 'पुखराज (Yellow Sapphire)'],
  [/Diamond/gi, 'हीरा (Diamond)'],
  [/Blue Sapphire/gi, 'नीलम (Blue Sapphire)'],
];

function translateGemsHi(raw: string): string {
  let out = raw;
  for (const [rx, rep] of GEM_TRANSLATE_HI) {
    out = out.replace(rx, rep);
  }
  return out;
}

export function computeBasicDetailsSheet(chart: ChartData): BasicDetailsSheet {
  const { input, ascendant, panchang, offsetMinutesUsed, utcMs } = chart;
  const paramayus = evaluateParamayusStatus(chart);
  const avakahada = computeAvakahadaChakra(chart);
  const ghatak = computeGhatakChakra(avakahada.moonSignIndex);
  const kb = LAGNA_EXTENDED_KB[ascendant.signIndex];
  const moon = chart.planets.find((p) => p.id === 'Moon')!;
  const sun = chart.planets.find((p) => p.id === 'Sun')!;
  const numerology = computeNumerologyReport(input.name, input.date, input.gender);

  // Civil weekday from local wall date
  const localWallDate = new Date(utcMs + offsetMinutesUsed * 60_000);
  const civilDay = WEEKDAY_NAMES[localWallDate.getUTCDay()];
  const hinduDayIdx = WEEKDAY_NAMES.findIndex((w) => w.en === panchang.vara.name);
  const hinduDay = hinduDayIdx >= 0 ? WEEKDAY_NAMES[hinduDayIdx] : civilDay;

  // Sunrise, Sunset, Day Duration & Exact Ishtkaal (Ghati:Pal:Vipal after Vedic Sunrise)
  const riseSet = computeSunriseSunsetForLocalDay(
    utcMs,
    offsetMinutesUsed,
    input.latitude,
    input.longitude
  );

  let ishtkaalStr = '00:00:00';
  if (riseSet.vedicSunriseMs !== null) {
    const elapsedMin = Math.max(0, (utcMs - riseSet.vedicSunriseMs) / 60_000);
    const totalGhatis = elapsedMin / 24;
    let g = Math.floor(totalGhatis);
    const remPal = (totalGhatis - g) * 60;
    let p = Math.floor(remPal);
    let v = Math.round((remPal - p) * 60);
    if (v >= 60) {
      v -= 60;
      p += 1;
    }
    if (p >= 60) {
      p -= 60;
      g += 1;
    }
    ishtkaalStr = `${pad2(g)}:${pad2(p)}:${pad2(v)}`;
  }

  const sunriseSecStr = formatLocalTimeFromUtc(riseSet.sunriseMs, offsetMinutesUsed, true);
  const sunsetSecStr = formatLocalTimeFromUtc(riseSet.sunsetMs, offsetMinutesUsed, true);
  const dayDurStr =
    riseSet.sunriseMs !== null && riseSet.sunsetMs !== null
      ? formatHmsFromSeconds((riseSet.sunsetMs - riseSet.sunriseMs) / 1000, false)
      : panchang.dayDurationStr;

  // War Time / DST & LMT Correction
  const birthYear = input.date.slice(0, 4);
  let dstMin = 0;
  if (input.timezone && input.timezone !== 'MANUAL') {
    const janOff = getIanaOffsetMinutes(`${birthYear}-01-15`, '12:00:00', input.timezone);
    const julOff = getIanaOffsetMinutes(`${birthYear}-07-15`, '12:00:00', input.timezone);
    const stdBase = Math.min(janOff, julOff);
    if (offsetMinutesUsed > stdBase) {
      dstMin = offsetMinutesUsed - stdBase;
    }
  }
  const stdOffsetMin = offsetMinutesUsed - dstMin;
  const stdMeridianDeg = (stdOffsetMin / 60) * 15;
  const lmtCorrSec = Math.round((input.longitude - stdMeridianDeg) * 240);
  const warCorrSec = Math.round(dstMin * 60);

  // True LMT at Birth (seconds past UTC midnight + longitude*240)
  const utcDate = new Date(utcMs);
  const utcSecsOfDay =
    utcDate.getUTCHours() * 3600 + utcDate.getUTCMinutes() * 60 + utcDate.getUTCSeconds();
  const lmtSecsOfDay = ((Math.round(utcSecsOfDay + input.longitude * 240) % 86400) + 86400) % 86400;
  const lmtBirthStr = formatHmsFromSeconds(lmtSecsOfDay, false);
  const gmtBirthStr = formatHmsFromSeconds(utcSecsOfDay, false);

  // Normalize Time of Birth to HH:MM:SS
  const timeParts = input.time.split(':');
  const normTimeBirth = `${pad2(parseInt(timeParts[0] || '0', 10))}:${pad2(
    parseInt(timeParts[1] || '0', 10)
  )}:${pad2(parseInt(timeParts[2] || '0', 10))}`;

  const genderMap = {
    male: { en: 'Male', hi: 'पुरुष (Male)' },
    female: { en: 'Female', hi: 'महिला (Female)' },
    other: { en: 'Other', hi: 'अन्य' },
  }[input.gender ?? 'other'];

  const personDetails: BasicDetailRow[] = [
    { key: 'sex', labelEn: 'Sex', labelHi: 'लिंग', valueEn: genderMap.en, valueHi: genderMap.hi },
    { key: 'dob', labelEn: 'Date of Birth', labelHi: 'जन्म तिथि', valueEn: formatDateDmy(input.date), valueHi: formatDateDmy(input.date), mono: true },
    { key: 'tob', labelEn: 'Time of Birth', labelHi: 'जन्म समय', valueEn: normTimeBirth, valueHi: normTimeBirth, mono: true },
    { key: 'day', labelEn: 'Day of Birth', labelHi: 'जन्म वार', valueEn: civilDay.en, valueHi: civilDay.hi },
    { key: 'isht', labelEn: 'Ishtkaal (Ghati-Pal-Vipal)', labelHi: 'इष्टकाल (घटी:पल:विपल)', valueEn: ishtkaalStr, valueHi: ishtkaalStr, mono: true, tone: 'accent' },
    { key: 'pob', labelEn: 'Place of Birth', labelHi: 'जन्म स्थान', valueEn: input.city || '—', valueHi: input.city || '—' },
    { key: 'country', labelEn: 'Country', labelHi: 'देश', valueEn: input.country ?? '—', valueHi: input.country ?? '—' },
    {
      key: 'tz',
      labelEn: 'Time Zone',
      labelHi: 'समय क्षेत्र (TZ)',
      valueEn: `${formatOffsetString(offsetMinutesUsed)} (${input.timezone})`,
      valueHi: `${formatOffsetString(offsetMinutesUsed)} (${input.timezone})`,
      mono: true,
    },
    {
      key: 'lat',
      labelEn: 'Latitude',
      labelHi: 'अक्षांश',
      valueEn: formatCoordDms(input.latitude, 'N', 'S'),
      valueHi: formatCoordDms(input.latitude, 'उत्तर (N)', 'दक्षिण (S)'),
      mono: true,
    },
    {
      key: 'lng',
      labelEn: 'Longitude',
      labelHi: 'देशांतर',
      valueEn: formatCoordDms(input.longitude, 'E', 'W'),
      valueHi: formatCoordDms(input.longitude, 'पूर्व (E)', 'पश्चिम (W)'),
      mono: true,
    },
    {
      key: 'lmt_corr',
      labelEn: 'Local Time Correction',
      labelHi: 'स्थानीय समय अंतर',
      valueEn: formatHmsFromSeconds(lmtCorrSec, true),
      valueHi: formatHmsFromSeconds(lmtCorrSec, true),
      mono: true,
    },
    {
      key: 'war_corr',
      labelEn: 'War Time Correction',
      labelHi: 'वार / DST समय अंतर',
      valueEn: warCorrSec === 0 ? '00:00:00' : formatHmsFromSeconds(warCorrSec, true),
      valueHi: warCorrSec === 0 ? '00:00:00' : formatHmsFromSeconds(warCorrSec, true),
      mono: true,
    },
    { key: 'lmt', labelEn: 'LMT at Birth', labelHi: 'स्थानीय मध्य समय (LMT)', valueEn: lmtBirthStr, valueHi: lmtBirthStr, mono: true },
    { key: 'gmt', labelEn: 'GMT at Birth', labelHi: 'GMT / UTC जन्म समय', valueEn: gmtBirthStr, valueHi: gmtBirthStr, mono: true },
    { key: 'tithi', labelEn: 'Tithi', labelHi: 'तिथि', valueEn: panchang.tithi.name, valueHi: panchang.tithi.name },
    { key: 'hindu_day', labelEn: 'Hindu Week Day', labelHi: 'वैदिक वार (सूर्योदय)', valueEn: hinduDay.en, valueHi: hinduDay.hi },
    {
      key: 'paksha',
      labelEn: 'Paksha',
      labelHi: 'पक्ष',
      valueEn: panchang.tithi.paksha.toUpperCase(),
      valueHi: panchang.tithi.paksha === 'Shukla' ? 'शुक्ल पक्ष' : 'कृष्ण पक्ष',
    },
    { key: 'yoga', labelEn: 'Yoga', labelHi: 'नित्य योग', valueEn: panchang.yoga.name, valueHi: panchang.yoga.name },
    { key: 'karana', labelEn: 'Karan', labelHi: 'करण', valueEn: panchang.karana.name, valueHi: panchang.karana.name },
    { key: 'sunrise', labelEn: 'Sunrise', labelHi: 'सूर्योदय', valueEn: sunriseSecStr, valueHi: sunriseSecStr, mono: true },
    { key: 'sunset', labelEn: 'Sunset', labelHi: 'सूर्यास्त', valueEn: sunsetSecStr, valueHi: sunsetSecStr, mono: true },
    { key: 'day_dur', labelEn: 'Day Duration', labelHi: 'दिनमान', valueEn: dayDurStr, valueHi: dayDurStr, mono: true },
  ];

  // Tropical Sun Sign (Western)
  const westernSunIdx = Math.floor(normalizeDeg(sun.tropicalLongitude) / 30) % 12;
  const lmstSecs = ((Math.round(chart.lmstHours * 3600) % 86400) + 86400) % 86400;

  const avakhadaDetails: BasicDetailRow[] = [
    { key: 'paya', labelEn: 'Paya (Nakshatra Based)', labelHi: 'पाया (नक्षत्र आधारित)', valueEn: avakahada.payaEn, valueHi: avakahada.payaHi, tone: 'accent' },
    { key: 'varna', labelEn: 'Varna', labelHi: 'वर्ण', valueEn: avakahada.varna, valueHi: avakahada.varna },
    { key: 'yoni', labelEn: 'Yoni', labelHi: 'योनि', valueEn: avakahada.yoni, valueHi: avakahada.yoni },
    { key: 'gana', labelEn: 'Gana', labelHi: 'गण', valueEn: avakahada.gana, valueHi: avakahada.gana },
    { key: 'vasya', labelEn: 'Vasya', labelHi: 'वश्य', valueEn: avakahada.vashya, valueHi: avakahada.vashya },
    { key: 'nadi', labelEn: 'Nadi', labelHi: 'नाड़ी', valueEn: avakahada.nadi, valueHi: avakahada.nadi },
    {
      key: 'dasha_bal',
      labelEn: 'Balance Of Dasha',
      labelHi: 'जन्म दशा शेष',
      valueEn: `${avakahada.birthDashaLord.toUpperCase()} ${avakahada.dashaBalanceEn.replace(/^[^0-9]+/, '').trim()}`,
      valueHi: `${PLANET_HI[avakahada.birthDashaLord] ?? avakahada.birthDashaLord} ${avakahada.remDashaHi}`,
      tone: 'accent',
    },
    { key: 'lagna', labelEn: 'Lagna', labelHi: 'लग्न (उदित राशि)', valueEn: SIGNS[ascendant.signIndex].name, valueHi: SIGN_HI[ascendant.signIndex] },
    { key: 'lagna_lord', labelEn: 'Lagna Lord', labelHi: 'लग्नेश (लग्न स्वामी)', valueEn: ascendant.signLord, valueHi: PLANET_HI[ascendant.signLord] ?? ascendant.signLord },
    { key: 'rasi', labelEn: 'Rasi (Moon Sign)', labelHi: 'जन्म राशि (चंद्र)', valueEn: SIGNS[moon.signIndex].name, valueHi: SIGN_HI[moon.signIndex] },
    { key: 'rasi_lord', labelEn: 'Rasi Lord', labelHi: 'राशि स्वामी (राशीश)', valueEn: moon.signLord, valueHi: PLANET_HI[moon.signLord] ?? moon.signLord },
    {
      key: 'nak_pada',
      labelEn: 'Nakshatra-Pada',
      labelHi: 'जन्म नक्षत्र - चरण',
      valueEn: `${moon.nakshatraName}-${moon.pada} (${avakahada.nameSyllableEn})`,
      valueHi: `${moon.nakshatraName} - चरण ${moon.pada} (${avakahada.nameSyllableHi})`,
    },
    { key: 'nak_lord', labelEn: 'Nakshatra Lord', labelHi: 'नक्षत्र स्वामी', valueEn: moon.nakshatraLord, valueHi: PLANET_HI[moon.nakshatraLord] ?? moon.nakshatraLord },
    { key: 'jd', labelEn: 'Julian Day', labelHi: 'जूलियन दिन (JD UT)', valueEn: chart.julianDayUT.toFixed(4), valueHi: chart.julianDayUT.toFixed(4), mono: true },
    { key: 'sun_ind', labelEn: 'SunSign (Indian / Nirayana)', labelHi: 'सूर्य राशि (भारतीय निरयण)', valueEn: SIGNS[sun.signIndex].name, valueHi: SIGN_HI[sun.signIndex] },
    { key: 'sun_west', labelEn: 'SunSign (Western / Sayana)', labelHi: 'सूर्य राशि (पाश्चात्य सायन)', valueEn: SIGNS[westernSunIdx].name, valueHi: SIGN_HI[westernSunIdx] },
    { key: 'ayan_deg', labelEn: 'Ayanamsa', labelHi: 'अयनांश मान', valueEn: formatAyanamsaDashDms(chart.ayanamsaDeg), valueHi: formatAyanamsaDashDms(chart.ayanamsaDeg), mono: true },
    { key: 'ayan_name', labelEn: 'Ayanamsa Name', labelHi: 'अयनांश पद्धति', valueEn: AYANAMSA_META[chart.settings.ayanamsa].label, valueHi: AYANAMSA_META[chart.settings.ayanamsa].label },
    { key: 'obliq', labelEn: 'Obliquity', labelHi: 'क्रांति वृत्त झुकाव', valueEn: formatAyanamsaDashDms(chart.obliquityDeg), valueHi: formatAyanamsaDashDms(chart.obliquityDeg), mono: true },
    { key: 'sid_time', labelEn: 'Sidereal Time (LMST)', labelHi: 'स्थानीय नाक्षत्र समय (LMST)', valueEn: formatHmsFromSeconds(lmstSecs, false), valueHi: formatHmsFromSeconds(lmstSecs, false), mono: true },
  ];

  // Favourable Points
  const allDigits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const goodNumsSet = new Set<number>(numerology.compatibleNumbers);
  const evilNums = allDigits.filter((d) => !goodNumsSet.has(d) && d !== numerology.mulank && d !== numerology.bhagyank);
  const beneficAges = Array.from(
    new Set(
      kb.beneficList.flatMap((pl) => PLANET_MATURITY_AGES[pl] ?? [28, 35])
    )
  ).sort((a, b) => a - b);

  const friendlySignIds = [
    ascendant.signIndex,
    (ascendant.signIndex + 4) % 12,
    (ascendant.signIndex + 8) % 12,
  ];
  const lagnaMetal = METAL_BY_LORD[ascendant.signLord] ?? { en: 'Gold, Panchdhatu', hi: 'सोना, पंचधातु' };

  const favourablePoints: BasicDetailRow[] = [
    {
      key: 'lucky_num',
      labelEn: 'Lucky Numbers',
      labelHi: 'मुख्य भाग्यशाली अंक',
      valueEn: `${numerology.mulank}, ${numerology.bhagyank} (${kb.luckyNumbers.split(',')[0].trim()})`,
      valueHi: `${numerology.mulank}, ${numerology.bhagyank} (${kb.luckyNumbers.split(',')[0].trim()})`,
      tone: 'good',
    },
    {
      key: 'good_num',
      labelEn: 'Good Numbers',
      labelHi: 'शुभ अंक',
      valueEn: kb.luckyNumbers,
      valueHi: kb.luckyNumbers,
    },
    {
      key: 'evil_num',
      labelEn: 'Evil / Avoid Numbers',
      labelHi: 'अशुभ / सावधानी अंक',
      valueEn: evilNums.slice(0, 3).join(', '),
      valueHi: evilNums.slice(0, 3).join(', '),
      tone: 'warn',
    },
    {
      key: 'good_years',
      labelEn: 'Good Years (Age Milestones)',
      labelHi: 'विशेष भाग्योदय वर्ष (आयु)',
      valueEn: paramayus.exceeded ? 'Locked (>120 Yrs Paramayus)' : beneficAges.slice(0, 8).join(', '),
      valueHi: paramayus.exceeded ? 'परमायु सीमा (>120 वर्ष) में लॉक' : beneficAges.slice(0, 8).join(', '),
    },
    {
      key: 'lucky_days',
      labelEn: 'Lucky Days',
      labelHi: 'शुभ वार',
      valueEn: kb.luckyDays,
      valueHi: kb.luckyDays
        .replace(/Sunday/g, 'रविवार')
        .replace(/Monday/g, 'सोमवार')
        .replace(/Tuesday/g, 'मंगलवार')
        .replace(/Wednesday/g, 'बुधवार')
        .replace(/Thursday/g, 'गुरुवार')
        .replace(/Friday/g, 'शुक्रवार')
        .replace(/Saturday/g, 'शनिवार'),
    },
    {
      key: 'good_planets',
      labelEn: 'Good Planets (Yogakarakas)',
      labelHi: 'शुभ एवं योगकारक ग्रह',
      valueEn: kb.beneficList.join(', '),
      valueHi: kb.beneficList.map((p) => PLANET_HI[p] ?? p).join(', '),
      tone: 'good',
    },
    {
      key: 'friendly_signs',
      labelEn: 'Friendly Signs',
      labelHi: 'मित्र राशियाँ',
      valueEn: friendlySignIds.map((idx) => SIGNS[idx].name).join(', '),
      valueHi: friendlySignIds.map((idx) => SIGN_HI[idx]).join(', '),
    },
    {
      key: 'good_lagna',
      labelEn: 'Good Lagna / Ascendants',
      labelHi: 'अनुकूल लग्न',
      valueEn: friendlySignIds.map((idx) => SIGNS[idx].name).join(', '),
      valueHi: friendlySignIds.map((idx) => SIGN_HI[idx]).join(', '),
    },
    {
      key: 'lucky_metal',
      labelEn: 'Lucky Metal',
      labelHi: 'शुभ धातु',
      valueEn: lagnaMetal.en,
      valueHi: lagnaMetal.hi,
    },
    {
      key: 'lucky_stone',
      labelEn: 'Lucky Stone (Gemstone)',
      labelHi: 'शुभ रत्न (जीवन रत्न)',
      valueEn: kb.luckyGem,
      valueHi: translateGemsHi(kb.luckyGem),
      tone: 'good',
    },
  ];

  const ghatakMalefics: BasicDetailRow[] = [
    { key: 'bad_day', labelEn: 'Bad Day (Ghatak Vara)', labelHi: 'घातक वार', valueEn: ghatak.varaEn, valueHi: ghatak.varaEn },
    { key: 'bad_karan', labelEn: 'Bad Karan', labelHi: 'घातक करण', valueEn: ghatak.karanaEn, valueHi: ghatak.karanaEn },
    { key: 'bad_lagna', labelEn: 'Bad Lagna', labelHi: 'घातक लग्न', valueEn: SIGNS[ghatak.lagnaIndex].name, valueHi: SIGN_HI[ghatak.lagnaIndex] },
    { key: 'bad_month', labelEn: 'Bad Month', labelHi: 'घातक मास', valueEn: ghatak.monthEn, valueHi: ghatak.monthEn },
    { key: 'bad_nak', labelEn: 'Bad Nakshatra', labelHi: 'घातक नक्षत्र', valueEn: ghatak.nakshatraEn, valueHi: ghatak.nakshatraEn },
    { key: 'bad_prahar', labelEn: 'Bad Prahar', labelHi: 'घातक प्रहर', valueEn: ghatak.praharEn, valueHi: ghatak.praharEn },
    { key: 'bad_rasi', labelEn: 'Bad Rasi', labelHi: 'घातक राशि', valueEn: SIGNS[ghatak.rashiIndex].name, valueHi: SIGN_HI[ghatak.rashiIndex], tone: 'warn' },
    { key: 'bad_tithi', labelEn: 'Bad Tithi', labelHi: 'घातक तिथि', valueEn: ghatak.tithiEn, valueHi: ghatak.tithiEn },
    { key: 'bad_yoga', labelEn: 'Bad Yoga', labelHi: 'घातक योग', valueEn: ghatak.yogaEn, valueHi: ghatak.yogaEn },
    {
      key: 'bad_planets',
      labelEn: 'Bad Planets (Functional Malefics)',
      labelHi: 'अकारक / मारक ग्रह',
      valueEn: `${kb.maleficList.join(', ')} (Maraka: ${kb.marakaList.join(', ')})`,
      valueHi: `${kb.maleficList.map((p) => PLANET_HI[p] ?? p).join(', ')} (मारक: ${kb.marakaList.map((p) => PLANET_HI[p] ?? p).join(', ')})`,
      tone: 'warn',
    },
  ];

  return {
    personDetails,
    avakhadaDetails,
    favourablePoints,
    ghatakMalefics,
    paramayusLocked: paramayus.exceeded,
  };
}
