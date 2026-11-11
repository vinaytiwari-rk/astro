import { NAKSHATRAS, SIGNS, VIMSHOTTARI_ORDER, VIMSHOTTARI_YEARS } from './constants';
import { computeAscendantAndMcTropical, computeHouses, findHouseForLongitude } from './ephemeris';
import { normalizeDeg } from './time';
import type { BodyPosition, ChartData, NineGrahaId } from './types';
import * as Astronomy from 'astronomy-engine';

export interface AvakahadaChakraData {
  payaEn: string;
  payaHi: string;
  yunjaEn: string;
  yunjaHi: string;
  varna: string;
  vashya: string;
  yoni: string;
  gana: string;
  nadi: string;
  tatvaEn: string;
  tatvaHi: string;
  moonSignIndex: number;
  nakshatraIndex: number;
  pada: number;
  nameSyllableEn: string;
  nameSyllableHi: string;
  allPadaSyllablesEn: string[];
  allPadaSyllablesHi: string[];
  birthDashaLord: NineGrahaId;
  nextDashaLord: NineGrahaId;
  remDashaEn: string;
  remDashaHi: string;
  dashaBalanceEn: string;
  dashaBalanceHi: string;
}

export interface GhatakChakraData {
  moonSignIndex: number;
  rashiIndex: number;
  varaEn: string;
  tithiEn: string;
  nakshatraEn: string;
  yogaEn: string;
  karanaEn: string;
  praharEn: string;
  lagnaIndex: number;
  monthEn: string;
}

export interface BhavaChalitPlacement {
  id: BodyPosition['id'];
  shortLabel: string;
  rasiHouse: number;
  chalitHouse: number;
  rasiSignIndex: number;
  chalitDisplaySignIndex: number;
  shifted: boolean;
  dms: string;
  isRetrograde: boolean;
  isCombust: boolean;
  dignity: string;
}

export interface BhavaChalitResult {
  ascSignIndex: number;
  ascDms: string;
  placements: BhavaChalitPlacement[];
  shiftedBodies: BhavaChalitPlacement[];
}

// Traditional 27 Nakshatras x 4 Padas = 108 Name Syllables (Roman & Devanagari)
const NAKSHATRA_SYLLABLES_EN: Array<[string, string, string, string]> = [
  ['Chu', 'Che', 'Cho', 'La'],         // 0 Ashwini
  ['Li', 'Lu', 'Le', 'Lo'],            // 1 Bharani
  ['A', 'I', 'U', 'E'],                // 2 Krittika
  ['O', 'Va', 'Vi', 'Vu'],             // 3 Rohini
  ['Ve', 'Vo', 'Ka', 'Ki'],            // 4 Mrigashira
  ['Ku', 'Gha', 'Ng', 'Chha'],         // 5 Ardra
  ['Ke', 'Ko', 'Ha', 'Hi'],            // 6 Punarvasu
  ['Hu', 'He', 'Ho', 'Da'],            // 7 Pushya
  ['Di', 'Du', 'De', 'Do'],            // 8 Ashlesha
  ['Ma', 'Mi', 'Mu', 'Me'],            // 9 Magha
  ['Mo', 'Ta', 'Ti', 'Tu'],            // 10 Purva Phalguni
  ['Te', 'To', 'Pa', 'Pi'],            // 11 Uttara Phalguni
  ['Pu', 'Sha', 'Na', 'Tha'],          // 12 Hasta
  ['Pe', 'Po', 'Ra', 'Ri'],            // 13 Chitra
  ['Ru', 'Re', 'Ro', 'Ta'],            // 14 Swati
  ['Ti', 'Tu', 'Te', 'To'],            // 15 Vishakha
  ['Na', 'Ni', 'Nu', 'Ne'],            // 16 Anuradha
  ['No', 'Ya', 'Yi', 'Yu'],            // 17 Jyeshtha
  ['Ye', 'Yo', 'Bha', 'Bhi'],          // 18 Mula
  ['Bhu', 'Dha', 'Pha', 'Dha'],        // 19 Purva Ashadha
  ['Bhe', 'Bho', 'Ja', 'Ji'],          // 20 Uttara Ashadha
  ['Khi', 'Khu', 'Khe', 'Kho'],        // 21 Shravana
  ['Ga', 'Gi', 'Gu', 'Ge'],            // 22 Dhanishta
  ['Go', 'Sa', 'Si', 'Su'],            // 23 Shatabhisha
  ['Se', 'So', 'Da', 'Di'],            // 24 Purva Bhadrapada
  ['Du', 'Tha', 'Jha', 'Nya'],         // 25 Uttara Bhadrapada
  ['De', 'Do', 'Cha', 'Chi'],          // 26 Revati
];

const NAKSHATRA_SYLLABLES_HI: Array<[string, string, string, string]> = [
  ['चू', 'चे', 'चो', 'ला'],
  ['ली', 'लू', 'ले', 'लो'],
  ['अ', 'ई', 'उ', 'ए'],
  ['ओ', 'वा', 'वी', 'वू'],
  ['वे', 'वो', 'का', 'की'],
  ['कु', 'घ', 'ङ', 'छ'],
  ['के', 'को', 'हा', 'ही'],
  ['हु', 'हे', 'हो', 'डा'],
  ['डी', 'डू', 'डे', 'डो'],
  ['मा', 'मी', 'मू', 'मे'],
  ['मो', 'टा', 'टी', 'टू'],
  ['टे', 'टो', 'पा', 'पी'],
  ['पू', 'ष', 'ण', 'ठ'],
  ['पे', 'पो', 'रा', 'री'],
  ['रू', 'रे', 'रो', 'ता'],
  ['ती', 'तू', 'ते', 'तो'],
  ['ना', 'नी', 'नू', 'ने'],
  ['नो', 'या', 'यी', 'यू'],
  ['ये', 'यो', 'भा', 'भी'],
  ['भू', 'धा', 'फा', 'ढा'],
  ['भे', 'भो', 'जा', 'जी'],
  ['खी', 'खू', 'खे', 'खो'],
  ['गा', 'गी', 'गू', 'गे'],
  ['गो', 'सा', 'सी', 'सू'],
  ['से', 'सो', 'दा', 'दी'],
  ['दू', 'थ', 'झ', 'ञ'],
  ['दे', 'दो', 'चा', 'ची'],
];

const VASHYA_BY_SIGN = [
  'Quadruped', 'Quadruped', 'Human', 'Aquatic', 'Wild', 'Human',
  'Human', 'Insect', 'Human', 'Aquatic', 'Human', 'Aquatic',
];

const ELEMENT_BY_SIGN = [
  { en: 'Fire (Agni)', hi: 'अग्नि तत्व' },
  { en: 'Earth (Prithvi)', hi: 'पृथ्वी तत्व' },
  { en: 'Air (Vayu)', hi: 'वायु तत्व' },
  { en: 'Water (Jala)', hi: 'जल तत्व' },
];

// Classical Ghatak Chakra Table (indexed by Moon Rashi 0..11)
const GHATAK_TABLE: Array<{
  rashiIndex: number;
  varaEn: string;
  tithiEn: string;
  nakshatraEn: string;
  yogaEn: string;
  karanaEn: string;
  praharEn: string;
  lagnaIndex: number;
  monthEn: string;
}> = [
  { rashiIndex: 0, varaEn: 'Sunday', tithiEn: '1, 6, 11 (Nanda)', nakshatraEn: 'Magha', yogaEn: 'Vishkumbha', karanaEn: 'Bava', praharEn: '1st Prahar', lagnaIndex: 0, monthEn: 'Kartika' },
  { rashiIndex: 4, varaEn: 'Saturday', tithiEn: '5, 10, 15 (Purna)', nakshatraEn: 'Hasta', yogaEn: 'Vyaghata', karanaEn: 'Taitila', praharEn: '4th Prahar', lagnaIndex: 1, monthEn: 'Margashirsha' },
  { rashiIndex: 10, varaEn: 'Monday', tithiEn: '2, 7, 12 (Bhadra)', nakshatraEn: 'Swati', yogaEn: 'Atiganda', karanaEn: 'Gara', praharEn: '3rd Prahar', lagnaIndex: 2, monthEn: 'Ashadha' },
  { rashiIndex: 4, varaEn: 'Wednesday', tithiEn: '2, 7, 12 (Bhadra)', nakshatraEn: 'Anuradha', yogaEn: 'Shoola', karanaEn: 'Vanija', praharEn: '1st Prahar', lagnaIndex: 3, monthEn: 'Pausha' },
  { rashiIndex: 9, varaEn: 'Saturday', tithiEn: '3, 8, 13 (Jaya)', nakshatraEn: 'Mula', yogaEn: 'Ganda', karanaEn: 'Balava', praharEn: '2nd Prahar', lagnaIndex: 4, monthEn: 'Jyeshtha' },
  { rashiIndex: 11, varaEn: 'Saturday', tithiEn: '5, 10, 15 (Purna)', nakshatraEn: 'Shravana', yogaEn: 'Vyatipata', karanaEn: 'Vishti (Bhadra)', praharEn: '1st Prahar', lagnaIndex: 5, monthEn: 'Bhadrapada' },
  { rashiIndex: 9, varaEn: 'Thursday', tithiEn: '4, 9, 14 (Rikta)', nakshatraEn: 'Shatabhisha', yogaEn: 'Parigha', karanaEn: 'Kaulava', praharEn: '4th Prahar', lagnaIndex: 6, monthEn: 'Magha' },
  { rashiIndex: 1, varaEn: 'Friday', tithiEn: '1, 6, 11 (Nanda)', nakshatraEn: 'Revati', yogaEn: 'Vaidhriti', karanaEn: 'Gara', praharEn: '2nd Prahar', lagnaIndex: 7, monthEn: 'Ashwin' },
  { rashiIndex: 3, varaEn: 'Friday', tithiEn: '3, 8, 13 (Jaya)', nakshatraEn: 'Mula', yogaEn: 'Vishkumbha', karanaEn: 'Bava', praharEn: '3rd Prahar', lagnaIndex: 8, monthEn: 'Phalguna' },
  { rashiIndex: 4, varaEn: 'Tuesday', tithiEn: '4, 9, 14 (Rikta)', nakshatraEn: 'Rohini', yogaEn: 'Atiganda', karanaEn: 'Taitila', praharEn: '4th Prahar', lagnaIndex: 9, monthEn: 'Vaishakha' },
  { rashiIndex: 8, varaEn: 'Thursday', tithiEn: '3, 8, 13 (Jaya)', nakshatraEn: 'Ardra', yogaEn: 'Vajra', karanaEn: 'Balava', praharEn: '1st Prahar', lagnaIndex: 10, monthEn: 'Chaitra' },
  { rashiIndex: 8, varaEn: 'Friday', tithiEn: '5, 10, 15 (Purna)', nakshatraEn: 'Ashlesha', yogaEn: 'Shoola', karanaEn: 'Vanija', praharEn: '3rd Prahar', lagnaIndex: 11, monthEn: 'Shravana' },
];

export function getNakshatraSyllable(nakshatraIdx: number, pada: number): { en: string; hi: string } {
  const nIdx = ((nakshatraIdx % 27) + 27) % 27;
  const pIdx = Math.max(0, Math.min(3, pada - 1));
  return {
    en: NAKSHATRA_SYLLABLES_EN[nIdx][pIdx],
    hi: NAKSHATRA_SYLLABLES_HI[nIdx][pIdx],
  };
}

export function getAllNakshatraSyllables(nakshatraIdx: number): { en: string[]; hi: string[] } {
  const nIdx = ((nakshatraIdx % 27) + 27) % 27;
  return {
    en: [...NAKSHATRA_SYLLABLES_EN[nIdx]],
    hi: [...NAKSHATRA_SYLLABLES_HI[nIdx]],
  };
}

function formatYmdFromYears(yearsFloat: number, lang: 'en' | 'hi'): string {
  const y = Math.floor(yearsFloat);
  const remMonths = (yearsFloat - y) * 12;
  const m = Math.floor(remMonths);
  const d = Math.round((remMonths - m) * 30);
  return lang === 'hi' ? `${y} वर्ष ${m} माह ${d} दिन` : `${y}Y ${m}M ${d}D`;
}

export function computeAvakahadaChakra(chart: ChartData): AvakahadaChakraData {
  const moon = chart.planets.find((p) => p.id === 'Moon')!;
  const moonHouse = moon.rasiHouseNumber;
  const nak = chart.panchang.nakshatra;

  // Paya by Moon's house from Lagna (standard classical Panchang/AstroSage convention)
  let payaEn = 'Copper (Tamra)';
  let payaHi = 'तांबे का पाया (मध्यम)';
  if ([1, 6, 11].includes(moonHouse)) {
    payaEn = 'Gold (Swarna)';
    payaHi = 'सोने का पाया (परिश्रम से लाभ)';
  } else if ([2, 5, 9].includes(moonHouse)) {
    payaEn = 'Silver (Rajata)';
    payaHi = 'चाँदी का पाया (अत्यंत शुभ)';
  } else if ([4, 8, 12].includes(moonHouse)) {
    payaEn = 'Iron (Loha)';
    payaHi = 'लोहे का पाया (संघर्ष/सतर्कता)';
  }

  // Yunja (Adi / Madhya / Antya based on 3-fold Nakshatra group mod 3)
  const yunjaIdx = nak.index % 3;
  const yunjaEn = yunjaIdx === 0 ? 'Purva / Adi' : yunjaIdx === 1 ? 'Madhya' : 'Antya';
  const yunjaHi = yunjaIdx === 0 ? 'पूर्व / आदि युंजा' : yunjaIdx === 1 ? 'मध्य युंजा' : 'अंत्य युंजा';

  const el = ELEMENT_BY_SIGN[moon.signIndex % 4];
  const syl = getNakshatraSyllable(nak.index, nak.pada);
  const allSyl = getAllNakshatraSyllables(nak.index);

  // Dasha balance at birth
  const birthLord = nak.lord as NineGrahaId;
  const totalYears = VIMSHOTTARI_YEARS[birthLord] ?? 0;
  const remYears = (totalYears * nak.percentRemaining) / 100;
  const nextOrderIdx = (VIMSHOTTARI_ORDER.indexOf(birthLord) + 1) % 9;
  const nextLord = VIMSHOTTARI_ORDER[nextOrderIdx];

  return {
    payaEn,
    payaHi,
    yunjaEn,
    yunjaHi,
    varna: nak.varna,
    vashya: VASHYA_BY_SIGN[moon.signIndex],
    yoni: nak.yoni,
    gana: nak.gana,
    nadi: nak.nadi,
    tatvaEn: el.en,
    tatvaHi: el.hi,
    moonSignIndex: moon.signIndex,
    nakshatraIndex: nak.index,
    pada: nak.pada,
    nameSyllableEn: syl.en,
    nameSyllableHi: syl.hi,
    allPadaSyllablesEn: allSyl.en,
    allPadaSyllablesHi: allSyl.hi,
    birthDashaLord: birthLord,
    nextDashaLord: nextLord,
    remDashaEn: formatYmdFromYears(remYears, 'en'),
    remDashaHi: formatYmdFromYears(remYears, 'hi'),
    dashaBalanceEn: `${birthLord}: ${formatYmdFromYears(remYears, 'en')} remaining (Next: ${nextLord})`,
    dashaBalanceHi: `${birthLord} महादशा शेष: ${formatYmdFromYears(remYears, 'hi')} (अगली: ${nextLord})`,
  };
}

export function computeGhatakChakra(moonSignIndex: number): GhatakChakraData {
  const idx = ((moonSignIndex % 12) + 12) % 12;
  return {
    moonSignIndex: idx,
    ...GHATAK_TABLE[idx],
  };
}

/**
 * Always computes authentic Sripati (Porphyry) Bhava Chalit placements
 * from ChartData timestamps & coordinates so users can compare Rasi (D1) vs Bhava Chalit side-by-side.
 */
export function computeBhavaChalitPlacements(chart: ChartData): BhavaChalitResult {
  const time = new Astronomy.AstroTime(new Date(chart.utcMs));
  const { asc, mc } = computeAscendantAndMcTropical(
    time,
    chart.input.latitude,
    chart.input.longitude
  );
  const ascSid = normalizeDeg(asc - chart.ayanamsaDeg);
  const mcSid = normalizeDeg(mc - chart.ayanamsaDeg);
  const sripatiCusps = computeHouses(ascSid, mcSid, 'sripati');
  const ascSignIndex = Math.floor(ascSid / 30) % 12;

  const placements: BhavaChalitPlacement[] = [chart.ascendant, ...chart.planets].map((b) => {
    const chalitHouse =
      b.id === 'Asc' ? 1 : findHouseForLongitude(b.longitude, sripatiCusps, 'sripati');
    const rasiHouse = b.rasiHouseNumber;
    const chalitDisplaySignIndex = (ascSignIndex + chalitHouse - 1) % 12;
    return {
      id: b.id,
      shortLabel: b.shortLabel,
      rasiHouse,
      chalitHouse,
      rasiSignIndex: b.signIndex,
      chalitDisplaySignIndex,
      shifted: b.id !== 'Asc' && chalitHouse !== rasiHouse,
      dms: b.dms,
      isRetrograde: b.isRetrograde,
      isCombust: b.isCombust,
      dignity: b.dignity,
    };
  });

  const shiftedBodies = placements.filter((p) => p.shifted);
  return {
    ascSignIndex,
    ascDms: chart.ascendant.shortDms,
    placements,
    shiftedBodies,
  };
}

export function formatNakshatraTitle(nakIdx: number): string {
  return NAKSHATRAS[((nakIdx % 27) + 27) % 27]?.name ?? '';
}

export function formatSignTitle(signIdx: number): string {
  return SIGNS[((signIdx % 12) + 12) % 12]?.name ?? '';
}
