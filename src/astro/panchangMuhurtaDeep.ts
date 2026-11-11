import * as Astronomy from 'astronomy-engine';
import { calculateChart } from './calculator';
import { NAKSHATRAS, SIGNS } from './constants';
import { computeAyanamsaDeg } from './ephemeris';
import { normalizeDeg } from './time';
import type { BirthInput, CalcSettings, ChartData } from './types';

const BENEFIC_PLANETS = new Set(['Jupiter', 'Venus', 'Mercury', 'Moon']);

export type LunarMonthSystem = 'purnimanta' | 'amanta';

export interface SamvatsaraEntry {
  index: number; // 0..59
  en: string;
  hi: string;
}

export const SAMVATSARA_60: SamvatsaraEntry[] = [
  { index: 0, en: 'Prabhava', hi: 'प्रभव' },
  { index: 1, en: 'Vibhava', hi: 'विभव' },
  { index: 2, en: 'Shukla', hi: 'शुक्ल' },
  { index: 3, en: 'Pramoda', hi: 'प्रमोद' },
  { index: 4, en: 'Prajapati', hi: 'प्रजापति' },
  { index: 5, en: 'Angirasa', hi: 'अंगिरा' },
  { index: 6, en: 'Srimukha', hi: 'श्रीमुख' },
  { index: 7, en: 'Bhava', hi: 'भाव' },
  { index: 8, en: 'Yuva', hi: 'युवा' },
  { index: 9, en: 'Dhata', hi: 'धाता' },
  { index: 10, en: 'Ishvara', hi: 'ईश्वर' },
  { index: 11, en: 'Bahudhanya', hi: 'बहुधान्य' },
  { index: 12, en: 'Pramathi', hi: 'प्रमाथी' },
  { index: 13, en: 'Vikrama', hi: 'विक्रम' },
  { index: 14, en: 'Vrisha', hi: 'वृष' },
  { index: 15, en: 'Chitrabhanu', hi: 'चित्रभानु' },
  { index: 16, en: 'Svabhanu', hi: 'स्वभानु' },
  { index: 17, en: 'Tarana', hi: 'तारण' },
  { index: 18, en: 'Parthiva', hi: 'पार्थिव' },
  { index: 19, en: 'Vyaya', hi: 'व्यय' },
  { index: 20, en: 'Sarvajit', hi: 'सर्वजीत' },
  { index: 21, en: 'Sarvadhari', hi: 'सर्वधारी' },
  { index: 22, en: 'Virodhi', hi: 'विरोधी' },
  { index: 23, en: 'Vikriti', hi: 'विकृति' },
  { index: 24, en: 'Khara', hi: 'खर' },
  { index: 25, en: 'Nandana', hi: 'नंदन' },
  { index: 26, en: 'Vijaya', hi: 'विजय' },
  { index: 27, en: 'Jaya', hi: 'जय' },
  { index: 28, en: 'Manmatha', hi: 'मन्मथ' },
  { index: 29, en: 'Durmukhi', hi: 'दुर्मुखी' },
  { index: 30, en: 'Hevilambi', hi: 'हेविलंबी' },
  { index: 31, en: 'Vilambi', hi: 'विलंबी' },
  { index: 32, en: 'Vikari', hi: 'विकारी' },
  { index: 33, en: 'Sharvari', hi: 'शार्वरी' },
  { index: 34, en: 'Plava', hi: 'प्लव' },
  { index: 35, en: 'Shubhakritu', hi: 'शुभकृत' },
  { index: 36, en: 'Shobhakritu', hi: 'शोभकृत' },
  { index: 37, en: 'Krodhi', hi: 'क्रोधी' },
  { index: 38, en: 'Vishvavasu', hi: 'विश्वावसु' },
  { index: 39, en: 'Parabhava', hi: 'पराभव' },
  { index: 40, en: 'Plavanga', hi: 'प्लवंग' },
  { index: 41, en: 'Kilaka', hi: 'कीलक' },
  { index: 42, en: 'Saumya', hi: 'सौम्य' },
  { index: 43, en: 'Sadharana', hi: 'साधारण' },
  { index: 44, en: 'Virodhikritu', hi: 'विरोधकृत' },
  { index: 45, en: 'Paritapi', hi: 'परिधावी' },
  { index: 46, en: 'Pramadi', hi: 'प्रमादी' },
  { index: 47, en: 'Ananda', hi: 'आनंद' },
  { index: 48, en: 'Rakshasa', hi: 'राक्षस' },
  { index: 49, en: 'Nala', hi: 'नल' },
  { index: 50, en: 'Pingala', hi: 'पिंगल' },
  { index: 51, en: 'Kalayukti', hi: 'कालयुक्त' },
  { index: 52, en: 'Siddharthi', hi: 'सिद्धार्थ' },
  { index: 53, en: 'Raudri', hi: 'रौद्र' },
  { index: 54, en: 'Durmati', hi: 'दुर्मति' },
  { index: 55, en: 'Dundubhi', hi: 'दुन्दुभी' },
  { index: 56, en: 'Rudhirodgari', hi: 'रुधिरोद्गारी' },
  { index: 57, en: 'Raktakshi', hi: 'रक्ताक्षी' },
  { index: 58, en: 'Krodhana', hi: 'क्रोधन' },
  { index: 59, en: 'Akshaya', hi: 'अक्षय' },
];

export const HINDU_MASAS: Array<{ index: number; en: string; hi: string; solarSignEn: string }> = [
  { index: 0, en: 'Chaitra', hi: 'चैत्र', solarSignEn: 'Pisces' },
  { index: 1, en: 'Vaishakha', hi: 'वैशाख', solarSignEn: 'Aries' },
  { index: 2, en: 'Jyeshtha', hi: 'ज्येष्ठ', solarSignEn: 'Taurus' },
  { index: 3, en: 'Ashadha', hi: 'आषाढ़', solarSignEn: 'Gemini' },
  { index: 4, en: 'Shravana', hi: 'श्रावण', solarSignEn: 'Cancer' },
  { index: 5, en: 'Bhadrapada', hi: 'भाद्रपद', solarSignEn: 'Leo' },
  { index: 6, en: 'Ashwin', hi: 'आश्विन', solarSignEn: 'Virgo' },
  { index: 7, en: 'Kartika', hi: 'कार्तिक', solarSignEn: 'Libra' },
  { index: 8, en: 'Margashirsha', hi: 'मार्गशीर्ष', solarSignEn: 'Scorpio' },
  { index: 9, en: 'Pausha', hi: 'पौष', solarSignEn: 'Sagittarius' },
  { index: 10, en: 'Magha', hi: 'माघ', solarSignEn: 'Capricorn' },
  { index: 11, en: 'Phalguna', hi: 'फाल्गुन', solarSignEn: 'Aquarius' },
];

export interface MuhurtaRuleResult {
  id: string;
  nameEn: string;
  nameHi: string;
  status: 'Good' | 'Caution' | 'Avoid';
  detailEn: string;
  detailHi: string;
}

export interface DeepPanchangMuhurtaReport {
  date: string;
  time: string;
  lunarSystem: LunarMonthSystem;
  amantaMasaEn: string;
  amantaMasaHi: string;
  purnimantaMasaEn: string;
  purnimantaMasaHi: string;
  activeMasaEn: string;
  activeMasaHi: string;
  isAdhikaMasa: boolean;
  vikramSamvat: number;
  shakaSamvat: number;
  samvatsaraNumber: number; // 1..60
  samvatsaraEn: string;
  samvatsaraHi: string;
  rituEn: string;
  rituHi: string;
  ayanaEn: string;
  ayanaHi: string;
  specialTithiEn: string | null;
  specialTithiHi: string | null;
  dishaShool: {
    directionEn: string;
    directionHi: string;
    exemptionEn: string;
    exemptionHi: string;
    remedyEn: string;
    remedyHi: string;
  };
  nakshatraShool: {
    directionEn: string | null;
    directionHi: string | null;
  };
  vaasa: {
    shivaStateEn: string;
    shivaStateHi: string;
    shivaEffectEn: string;
    shivaEffectHi: string;
    agniStateEn: string;
    agniStateHi: string;
    agniEffectEn: string;
    agniEffectHi: string;
    chandraDirEn: string;
    chandraDirHi: string;
    chandraAbodeEn: string;
    chandraAbodeHi: string;
    rahuDirEn: string;
    rahuDirHi: string;
    yoginiDirEn: string;
    yoginiDirHi: string;
  };
  panchaka: {
    remainder: number;
    nameEn: string;
    nameHi: string;
    isAuspicious: boolean;
  };
  muhurtaRules: MuhurtaRuleResult[];
  sankramanaAlert: {
    nearIngress: boolean;
    hoursFromIngress: number;
    noteEn: string;
    noteHi: string;
  };
}

const DIR_HI: Record<string, string> = {
  East: 'पूर्व (East)',
  South: 'दक्षिण (South)',
  West: 'पश्चिम (West)',
  North: 'उत्तर (North)',
  'South-East': 'आग्नेय / दक्षिण-पूर्व',
  'South-West': 'नैऋत्य / दक्षिण-पश्चिम',
  'North-West': 'वायव्य / उत्तर-पश्चिम',
  'North-East': 'ईशान / उत्तर-पूर्व',
};

const DISHA_SHOOL_BY_WEEKDAY: Record<
  number,
  { dir: string; exEn: string; exHi: string; remEn: string; remHi: string }
> = {
  0: {
    dir: 'West',
    exEn: 'Exception after 15 ghatis (~6 hrs) past sunrise.',
    exHi: 'सूर्योदय के 15 घटी (~6 घंटे) बाद परिहार मान्य।',
    remEn: 'Eat clarified butter (ghee) or porridge before departing West.',
    remHi: 'पश्चिम यात्रा से पहले घी या दलिया ग्रहण कर प्रस्थान करें।',
  },
  1: {
    dir: 'East',
    exEn: 'Avoid non-urgent Eastward travel; check mirror/milk before leaving.',
    exHi: 'आवश्यक पूर्व यात्रा पर दर्पण देखकर या दूध पीकर निकलें।',
    remEn: 'Drink milk or look in a mirror before departing East.',
    remHi: 'दर्पण देखकर अथवा दूध सेवन कर पूर्व दिशा में निकलें।',
  },
  2: {
    dir: 'North',
    exEn: 'Exception after 12 ghatis (~4.8 hrs) past sunrise.',
    exHi: 'सूर्योदय के 12 घटी (~4.8 घंटे) बाद दोष शांत।',
    remEn: 'Take jaggery (gud) or coriander seeds before departing North.',
    remHi: 'गुड़ या धनिया चबाकर उत्तर दिशा में प्रस्थान करें।',
  },
  3: {
    dir: 'North',
    exEn: 'Exception after 12 ghatis (~4.8 hrs) past sunrise.',
    exHi: 'सूर्योदय के 12 घटी (~4.8 घंटे) बाद दोष शांत।',
    remEn: 'Consume black sesame or coriander seeds before departing North.',
    remHi: 'तिल या धनिया ग्रहण कर उत्तर यात्रा करें।',
  },
  4: {
    dir: 'South',
    exEn: 'Exception after 22 ghatis (~8.8 hrs) past sunrise.',
    exHi: 'सूर्योदय के 22 घटी (~8.8 घंटे) बाद परिहार संभव।',
    remEn: 'Take curd/yogurt before departing South on Thursday.',
    remHi: 'गुरुवार दक्षिण यात्रा से पूर्व दही खाकर निकलें।',
  },
  5: {
    dir: 'West',
    exEn: 'Exception after 15 ghatis (~6 hrs) past sunrise.',
    exHi: 'सूर्योदय के 15 घटी (~6 घंटे) बाद परिहार संभव।',
    remEn: 'Consume barley or curd before departing West on Friday.',
    remHi: 'शुक्रवार पश्चिम यात्रा से पहले जौ या दही ग्रहण करें।',
  },
  6: {
    dir: 'East',
    exEn: 'Short daily commute exempted.',
    exHi: 'नित्य कार्य व उसी दिन वापसी हेतु मान्य।',
    remEn: 'Take ginger or urad before departing East on Saturday.',
    remHi: 'शनिवार पूर्व दिशा यात्रा से पहले अदरक या उड़द ग्रहण करें।',
  },
};

const NAKSHATRA_SHOOL_BY_INDEX: Record<number, string> = {
  18: 'East', 21: 'East', 17: 'East', // Jyeshtha/Mula/Shravana
  3: 'West', 7: 'West', // Rohini/Pushya
  12: 'North', 11: 'North', // Uttara Phalguni/Hasta
  24: 'South', 0: 'South', 5: 'South', 22: 'South', // Ashwini, Ardra, Dhanishtha, P.Bhadra
};

// VaasaCalculator.php (JayeshMepani MIT) exact tables
const SHIVA_VAASA_MAP: Record<
  number,
  { en: string; hi: string; effEn: string; effHi: string }
> = {
  1: { en: 'In Cemetery', hi: 'श्मशान वास', effEn: 'Severe inauspiciousness for Rudrabhishek', effHi: 'रुद्राभिषेक/शुभ पूजा के लिए अशुभ' },
  2: { en: 'With Gowri (Parvati)', hi: 'गौरी सन्निधि में', effEn: 'Auspicious — bestows happiness & prosperity', effHi: 'अत्यंत शुभ — सुख एवं समृद्धिदायक' },
  3: { en: 'In Assembly (Sabha)', hi: 'सभा में वास', effEn: 'Mixed/sorrowful for selfish rites', effHi: 'सामान्य सकाम पूजा हेतु प्रतिकूल' },
  4: { en: 'At Play / Sports', hi: 'क्रीड़ा अवस्था', effEn: 'Difficult/obstacle-prone', effHi: 'कष्टप्रद एवं बाधायुक्त' },
  5: { en: 'At Mount Kailash', hi: 'कैलाश पर्वत पर', effEn: 'Highly auspicious — grants harmony & bliss', effHi: 'परम शुभ — सुख, शांति एवं कल्याणकारी' },
  6: { en: 'Mounted on Vrishabha (Nandi)', hi: 'वृषभ (नंदी) आरूढ़', effEn: 'Success & accomplishment of desires', effHi: 'कार्य सिद्धि एवं अभीष्ट फलदायक' },
  7: { en: 'At Bhojana / Meditation', hi: 'भोजन/ध्यान में', effEn: 'Disturbed / unsuitable for rituals', effHi: 'पीड़ादायक — अनुष्ठान टालें' },
};

const SHIVA_METHOD1_SEQ = [1, 2, 3, 4, 5, 6, 7];

const AGNI_VAASA_META: Record<
  number,
  { en: string; hi: string; effEn: string; effHi: string }
> = {
  1: { en: 'Prithvi (Earth)', hi: 'पृथ्वी लोक वास', effEn: 'Auspicious for Havan/Homa — bestows fulfillment', effHi: 'हवन/यज्ञ हेतु सर्वोत्तम — सुख एवं सिद्धि प्रदायक' },
  2: { en: 'Akaasha (Space)', hi: 'आकाश लोक वास', effEn: 'Adverse for Havan — avoid fire rituals today', effHi: 'हवन/अग्नि कर्म हेतु अशुभ — हवन वर्जित' },
  3: { en: 'Paathaala (Nadir)', hi: 'पाताल लोक वास', effEn: 'Wealth-draining for Havan — defer fire rituals', effHi: 'हवन हेतु धन क्षयकारक — यज्ञ टालें' },
};

const RAHU_VAASA_BY_WD: Record<number, string> = {
  0: 'South-West',
  1: 'East',
  2: 'North',
  3: 'North-West',
  4: 'South-East',
  5: 'South-East',
  6: 'East',
};

const DIR_LABELS_8 = ['East', 'South', 'West', 'North', 'South-West', 'North-West', 'North-East', 'South-East'];
const YOGINI_VAASA_BY_TITHI = [0, 3, 7, 5, 1, 2, 5, 6, 0, 3, 7, 5, 1, 2, 5, 0, 3, 7, 5, 1, 2, 5, 6, 0, 3, 7, 5, 1, 2, 6];
const CHANDRA_DIR_BY_SIGN = ['East', 'South', 'West', 'North', 'East', 'South', 'West', 'North', 'East', 'South', 'West', 'North'];
const PADA_ABODE_EN = ['Deva (Auspicious)', 'Nara (Neutral)', 'Pashava (Mixed)', 'Rakshasa (Caution)'];
const PADA_ABODE_HI = ['देव वास (शुभ)', 'नर वास (सामान्य)', 'पशु वास (मिश्रित)', 'राक्षस वास (सावधानी)'];

const PANCHAKA_DEFS: Record<number, { en: string; hi: string; ok: boolean }> = {
  0: { en: 'Nish-Panchaka (Flawless Shubha)', hi: 'निःपंचक (निर्दोष शुभ)', ok: true },
  1: { en: 'Mrityu Panchaka (Severe Danger)', hi: 'मृत्यु पंचक (अनिष्ट / भारी सावधानी)', ok: false },
  2: { en: 'Agni Panchaka (Fire / Accident Risk)', hi: 'अग्नि पंचक (अग्नि/चोट भय)', ok: false },
  3: { en: 'Shubha Panchaka (Auspicious)', hi: 'शुभ पंचक (कार्यसिद्धि)', ok: true },
  4: { en: 'Raja Panchaka (Authority Friction)', hi: 'राज पंचक (प्रशासनिक अड़चन)', ok: false },
  5: { en: 'Shubha Panchaka (Auspicious)', hi: 'शुभ पंचक (अति उत्तम)', ok: true },
  6: { en: 'Chora Panchaka (Loss / Theft Risk)', hi: 'चोर पंचक (धन हानि/चोरी भय)', ok: false },
  7: { en: 'Shubha Panchaka (Auspicious)', hi: 'शुभ पंचक (मंगलमय)', ok: true },
  8: { en: 'Roga Panchaka (Health / Stress)', hi: 'रोग पंचक (स्वास्थ्य कष्ट)', ok: false },
};

function siderealSunSign(utcMs: number, ayanamsa: CalcSettings['ayanamsa']): number {
  const t = new Astronomy.AstroTime(new Date(utcMs));
  const tropSun = Astronomy.SunPosition(t).elon;
  const aya = computeAyanamsaDeg(t, ayanamsa);
  return Math.floor(normalizeDeg(tropSun - aya) / 30) % 12;
}

export function computeDeepPanchangMuhurta(
  dateStr: string,
  timeStr: string,
  latitude: number,
  longitude: number,
  offsetMinutes: number,
  settings: CalcSettings,
  lunarSystem: LunarMonthSystem = 'purnimanta',
  existingChart?: ChartData
): DeepPanchangMuhurtaReport {
  const input: BirthInput = {
    id: 'deep-panchang',
    name: 'Moment Panchang',
    date: dateStr,
    time: timeStr.length === 5 ? `${timeStr}:00` : timeStr,
    timezone: 'MANUAL',
    utcOffsetMinutes: offsetMinutes,
    city: '',
    latitude,
    longitude,
  };
  const momentChart = existingChart ?? calculateChart(input, settings);
  const tithiNum = momentChart.panchang.tithi.number; // 1..30
  const paksha = momentChart.panchang.tithi.paksha;
  const nakIdx = momentChart.panchang.nakshatra.index;
  const nakPada = momentChart.panchang.nakshatra.pada;
  const yogaNum = momentChart.panchang.yoga.number;

  const moon = momentChart.planets.find((p) => p.id === 'Moon')!;
  const sun = momentChart.planets.find((p) => p.id === 'Sun')!;
  const utcMs = Date.parse(momentChart.utcIso);

  // Sunrise-based Vedic Weekday (0=Sun..6=Sat)
  const [yr, mo, dy] = dateStr.split('-').map((n) => parseInt(n, 10));
  const varaNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const parsedVara = varaNames.indexOf(momentChart.panchang.vara.name);
  const weekdayIdx = parsedVara >= 0 ? parsedVara : new Date(Date.UTC(yr, mo - 1, dy)).getUTCDay();

  // Amanta vs Purnimanta Lunar Month & Adhika Masa detection via exact New Moon bounds
  let prevNmMs = utcMs - 15 * 86400_000;
  let nextNmMs = utcMs + 15 * 86400_000;
  try {
    const prevSearch = Astronomy.SearchMoonPhase(0, new Date(utcMs + 60_000), -35);
    const nextSearch = Astronomy.SearchMoonPhase(0, new Date(utcMs + 180_000), 35);
    if (prevSearch) prevNmMs = prevSearch.date.getTime();
    if (nextSearch) nextNmMs = nextSearch.date.getTime();
  } catch {
    // retain midpoint fallback
  }

  const sunSignAtPrevNm = siderealSunSign(prevNmMs, settings.ayanamsa);
  const sunSignAtNextNm = siderealSunSign(nextNmMs, settings.ayanamsa);
  const isAdhikaMasa = sunSignAtPrevNm === sunSignAtNextNm;

  // Chaitra = Sun in Pisces (11) at New Moon => +1 mod 12
  const amantaIdx = (sunSignAtPrevNm + 1) % 12;
  // During an Adhika Masa both Shukla & Krishna halves bear that Adhika month name
  const purnimantaIdx = isAdhikaMasa
    ? amantaIdx
    : paksha === 'Krishna'
      ? (amantaIdx + 1) % 12
      : amantaIdx;

  const amantaBase = HINDU_MASAS[amantaIdx];
  const purnimantaBase = HINDU_MASAS[purnimantaIdx];
  const amantaMasa = isAdhikaMasa
    ? { ...amantaBase, en: `Adhika ${amantaBase.en}`, hi: `अधिक ${amantaBase.hi}` }
    : amantaBase;
  const purnimantaMasa = isAdhikaMasa
    ? { ...purnimantaBase, en: `Adhika ${purnimantaBase.en}`, hi: `अधिक ${purnimantaBase.hi}` }
    : purnimantaBase;
  const activeMasa = lunarSystem === 'amanta' ? amantaMasa : purnimantaMasa;

  // Era Years (Vikram Samvat & Shaka Samvat + 60 Samvatsara Cycle)
  const gregYear = yr;
  const isPostChaitra = amantaIdx >= 0 && !(mo <= 3 && amantaIdx >= 9);
  const vikramSamvat = gregYear + (isPostChaitra ? 57 : 56);
  const shakaSamvat = vikramSamvat - 135;
  // Southern Prabhava reference: 1987 CE / Chaitradi Vikram 2044 = Prabhava (0)
  const samIdx = ((vikramSamvat - 2044) % 60 + 60) % 60;
  const sam = SAMVATSARA_60[samIdx];

  // Ritu & Ayana from Sun Sign (0=Aries..11=Pisces)
  // Pisces(11)+Aries(0)=Vasanta, Taurus(1)+Gemini(2)=Grishma, Cancer(3)+Leo(4)=Varsha,
  // Virgo(5)+Libra(6)=Sharad, Scorpio(7)+Sagittarius(8)=Hemanta, Capricorn(9)+Aquarius(10)=Shishira
  const ss = sun.signIndex;
  const rituMap: Array<{ en: string; hi: string }> = [
    { en: 'Vasanta (Spring)', hi: 'वसंत ऋतु' },
    { en: 'Vasanta (Spring)', hi: 'वसंत ऋतु' },
    { en: 'Grishma (Summer)', hi: 'ग्रीष्म ऋतु' },
    { en: 'Grishma (Summer)', hi: 'ग्रीष्म ऋतु' },
    { en: 'Varsha (Monsoon)', hi: 'वर्षा ऋतु' },
    { en: 'Varsha (Monsoon)', hi: 'वर्षा ऋतु' },
    { en: 'Sharad (Autumn)', hi: 'शरद ऋतु' },
    { en: 'Sharad (Autumn)', hi: 'शरद ऋतु' },
    { en: 'Hemanta (Pre-Winter)', hi: 'हेमंत ऋतु' },
    { en: 'Hemanta (Pre-Winter)', hi: 'हेमंत ऋतु' },
    { en: 'Shishira (Winter)', hi: 'शिशिर ऋतु' },
    { en: 'Shishira (Winter)', hi: 'शिशिर ऋतु' },
  ];
  const ritu = rituMap[(ss + 1) % 12];
  const isUttarayana = ss >= 9 || ss <= 2; // Makara..Mithuna

  // Special Tithi Identity (amavasya_purnima_naming_taxonomy.json MIT)
  let specialTithiEn: string | null = null;
  let specialTithiHi: string | null = null;
  const lunarDay15 = ((tithiNum - 1) % 15) + 1;
  if (tithiNum === 30) {
    if (weekdayIdx === 1) {
      specialTithiEn = 'Somavati Amavasya (Sacred Monday New Moon)';
      specialTithiHi = 'सोमवती अमावस्या (परम पुण्यकारी सोमवार दर्श)';
    } else if (weekdayIdx === 2) {
      specialTithiEn = 'Bhaumavati Amavasya (Tuesday — Rina Mukti)';
      specialTithiHi = 'भौमवती अमावस्या (मंगल दोष व ऋण मुक्ति हेतु विशेष)';
    } else if (weekdayIdx === 6) {
      specialTithiEn = 'Shanichari Amavasya (Saturday — Shani Peace)';
      specialTithiHi = 'शनैश्चरी अमावस्या (शनि शांति व पितृ तर्पण हेतु श्रेष्ठ)';
    } else {
      specialTithiEn = `${amantaMasa.en} Amavasya`;
      specialTithiHi = `${amantaMasa.hi} अमावस्या`;
    }
  } else if (tithiNum === 15) {
    specialTithiEn = `${purnimantaMasa.en} Purnima`;
    specialTithiHi = `${purnimantaMasa.hi} पूर्णिमा`;
  } else if (lunarDay15 === 11) {
    specialTithiEn = `${paksha} Ekadashi Vrat Day`;
    specialTithiHi = `${paksha === 'Shukla' ? 'शुक्ल' : 'कृष्ण'} एकादशी व्रत`;
  } else if (lunarDay15 === 13) {
    specialTithiEn =
      weekdayIdx === 1 ? 'Soma Pradosh Vrat' : weekdayIdx === 6 ? 'Shani Pradosh Vrat' : 'Pradosh Vrat';
    specialTithiHi =
      weekdayIdx === 1 ? 'सोम प्रदोष व्रत' : weekdayIdx === 6 ? 'शनि प्रदोष व्रत' : 'प्रदोष व्रत';
  } else if (tithiNum === 19) {
    specialTithiEn = 'Sankashti Chaturthi';
    specialTithiHi = 'संकष्टी चतुर्थी व्रत';
  }

  // Shoola & Vaasa Residence
  const shool = DISHA_SHOOL_BY_WEEKDAY[weekdayIdx];
  const nakShoolDir = NAKSHATRA_SHOOL_BY_INDEX[nakIdx] ?? null;

  const shivaIdx1 = SHIVA_METHOD1_SEQ[(tithiNum === 30 ? 30 : tithiNum - 1) % 7];
  const shivaObj = SHIVA_VAASA_MAP[shivaIdx1];
  const agniIdx = [1, 2, 3, 1][(tithiNum + 1 + (weekdayIdx + 1)) % 4];
  const agniObj = AGNI_VAASA_META[agniIdx];
  const chandraDir = CHANDRA_DIR_BY_SIGN[moon.signIndex];
  const rahuDir = RAHU_VAASA_BY_WD[weekdayIdx];
  const yoginiDir = DIR_LABELS_8[YOGINI_VAASA_BY_TITHI[(tithiNum - 1) % 30] ?? 0];

  // Panchaka Rahita: (Tithi(1..30) + Vara(1..7) + Nakshatra(1..27) + Lagna(1..12)) % 9
  const panRem = (tithiNum + (weekdayIdx + 1) + (nakIdx + 1) + (momentChart.ascendant.signIndex + 1)) % 9;
  const panDef = PANCHAKA_DEFS[panRem];

  // Solar Ingress (Surya Sankramana: 6.4 hours before/after sun deg == 0 or 30)
  const degIntoSign = sun.degreeInSign;
  const hoursFromStart = (degIntoSign / 0.9856) * 24;
  const hoursToEnd = ((30 - degIntoSign) / 0.9856) * 24;
  const nearestIngressHours = Number(Math.min(hoursFromStart, hoursToEnd).toFixed(1));
  const nearIngress = nearestIngressHours <= 6.4;

  // VedAstro Muhurtha Rules (PanchangaSuddhi, KarthariDosha, Moon 6/8/12, SagrahaChandra, Udayastha)
  const muhurtaRules: MuhurtaRuleResult[] = [];

  const badTithis = new Set([1, 4, 6, 8, 12, 14, 15, 30]);
  const badYogas = new Set([6, 9, 10, 17, 27]);
  const panchaOk = !badTithis.has(tithiNum) && !badYogas.has(yogaNum);
  muhurtaRules.push({
    id: 'panchanga_suddhi',
    nameEn: 'Panchanga Suddhi (Classical Core Purity)',
    nameHi: 'पंचांग शुद्धि नियम',
    status: panchaOk ? 'Good' : 'Caution',
    detailEn: panchaOk
      ? `Clean Tithi (#${tithiNum}) and Yoga (${momentChart.panchang.yoga.name}) support auspicious starts.`
      : `Caution: Tithi #${tithiNum} or Yoga ${momentChart.panchang.yoga.name} advises selective ritual filtering.`,
    detailHi: panchaOk
      ? `तिथि (#${tithiNum}) एवं योग (${momentChart.panchang.yoga.name}) नए शुभ कार्य के लिए अनुकूल हैं।`
      : `सावधानी: तिथि (#${tithiNum}) या योग (${momentChart.panchang.yoga.name}) में बड़े शुभ आरंभ हेतु मुहूर्त जाँचें।`,
  });

  // Karthari Dosha: malefics in House 2 & House 12 from Lagna
  const h2Malefic = momentChart.planets.some(
    (p) => p.houseNumber === 2 && !BENEFIC_PLANETS.has(p.id)
  );
  const h12Malefic = momentChart.planets.some(
    (p) => p.houseNumber === 12 && !BENEFIC_PLANETS.has(p.id)
  );
  const hasKarthari = h2Malefic && h12Malefic;
  muhurtaRules.push({
    id: 'karthari_dosha',
    nameEn: 'Papa Karthari Dosha Check (Lagna Flanking)',
    nameHi: 'पाप कर्तरी दोष जाँच (लग्न के 2 व 12वें भाव)',
    status: hasKarthari ? 'Avoid' : 'Good',
    detailEn: hasKarthari
      ? 'Malefics flank the rising Lagna (H2 & H12) — avoid marriage/opening ceremonies in this Lagna.'
      : 'Rising Lagna is free from Papa-Karthari scissor Dosha.',
    detailHi: hasKarthari
      ? 'लग्न दोनों ओर से पाप ग्रहों से घिरा है — इस लग्न में विवाह या प्रमुख उद्घाटन टालें।'
      : 'उदित लग्न पाप-कर्तरी दोष से पूर्णतः मुक्त है।',
  });

  // ShashtashtaRiphagathaChandraDosha (Moon in 6/8/12)
  const moonInDusthana = [6, 8, 12].includes(moon.houseNumber);
  muhurtaRules.push({
    id: 'moon_6_8_12',
    nameEn: 'Chandra Shuddhi (Moon Free from 6/8/12th)',
    nameHi: 'चंद्र शुद्धि (6, 8, 12 भाव से चंद्र रक्षा)',
    status: moonInDusthana ? 'Caution' : 'Good',
    detailEn: moonInDusthana
      ? `Moon occupies House ${moon.houseNumber} from the election Lagna — change time by 1–2 hrs for clearer Moon.`
      : `Moon is well-placed in House ${moon.houseNumber} from election Lagna.`,
    detailHi: moonInDusthana
      ? `गोचर चंद्रमा इस समय लग्न से भाव ${moon.houseNumber} (त्रिक) में है — 1-2 घंटे बाद का लग्न अधिक शुभ रहेगा।`
      : `चंद्रमा इस लग्न से शुभ/संतुलित भाव ${moon.houseNumber} में स्थित है।`,
  });

  // SagrahaChandraDosha (Moon conjoined another planet)
  const moonConjoined = momentChart.planets.some(
    (p) => p.id !== 'Moon' && p.signIndex === moon.signIndex
  );
  muhurtaRules.push({
    id: 'sagraha_chandra',
    nameEn: 'Sagraha Chandra (Moon Unafflicted Check)',
    nameHi: 'सग्रह चंद्र दोष विचार',
    status: moonConjoined ? 'Caution' : 'Good',
    detailEn: moonConjoined
      ? 'Moon shares sign with another graha; fine for routine tasks, prefer solo Moon for marriage Muhurta.'
      : 'Moon occupies its Rashi un-conjoined, strengthening mental clarity in Muhurta.',
    detailHi: moonConjoined
      ? 'चंद्रमा अन्य ग्रह के साथ युत है — सामान्य कार्यों में ठीक, विवाह हेतु अकेला चंद्र श्रेष्ठ।'
      : 'चंद्रमा अकेला व निर्दोष स्थिति में है, जो मन और निर्णय को स्थिर रखता है।',
  });

  // Udayastha Suddhi (H1 and H7 lords dignified)
  const h1 = momentChart.houses[0];
  const h7 = momentChart.houses[6];
  const h1Lord = SIGNS[h1.signIndex].lord;
  const h7Lord = SIGNS[h7.signIndex].lord;
  const l1 = momentChart.planets.find((p) => p.id === h1Lord);
  const l7 = momentChart.planets.find((p) => p.id === h7Lord);
  const udayOk =
    Boolean(l1 && !['Debilitated', 'Enemy'].includes(l1.dignity)) &&
    Boolean(l7 && !['Debilitated', 'Enemy'].includes(l7.dignity));
  muhurtaRules.push({
    id: 'udayastha_suddhi',
    nameEn: 'Udayastha Suddhi (1st & 7th House Purity)',
    nameHi: 'उदयास्त शुद्धि (लग्न व सप्तम भाव बल)',
    status: udayOk ? 'Good' : 'Caution',
    detailEn: udayOk
      ? '1st and 7th lords enjoy balanced dignity — supportive for partnerships & public events.'
      : 'Either Lagnesh or 7th lord is in enemy/debilitated sign — wait for a stronger Muhurta Lagna.',
    detailHi: udayOk
      ? 'लग्नेश एवं सप्तमेश दोनों अच्छी मर्यादा में हैं — साझेदारी और मांगलिक कार्यों के लिए उत्तम।'
      : 'लग्नेश या सप्तमेश नीच/शत्रु राशि में हैं — महत्वपूर्ण साझेदारी हेतु बेहतर लग्न चुनें।',
  });

  // Ugra Yoga check (Siddha / Ugra lunar-nakshatra combinations)
  const ugraPairs: Record<number, string[]> = {
    3: ['Rohini'],
    4: ['Uttara Phalguni', 'Uttara Ashadha', 'Uttara Bhadrapada'],
    5: ['Shravana'],
    6: ['Mrigashira'],
    7: ['Revati'],
    9: ['Krittika', 'Magha'],
    10: ['Pushya'],
    12: ['Anuradha'],
    13: ['Krittika', 'Magha'],
  };
  const currentNakName = NAKSHATRAS[nakIdx].name;
  const isUgra = ugraPairs[lunarDay15]?.includes(currentNakName) ?? false;
  muhurtaRules.push({
    id: 'ugra_yoga',
    nameEn: 'Ugra / Treatment Siddhi Yoga',
    nameHi: 'उग्र / चिकित्सा सिद्धि योग',
    status: isUgra ? 'Good' : 'Good',
    detailEn: isUgra
      ? `Classical Ugra Yoga active (Tithi ${lunarDay15} + ${currentNakName}): auspicious for medical initiation.`
      : 'Standard day flow (No restrictive medical Ugra barrier active).',
    detailHi: isUgra
      ? `शास्त्रीय उग्र योग सक्रिय (तिथि ${lunarDay15} + ${currentNakName}): औषधि/चिकित्सा आरंभ हेतु अत्यंत सफल।`
      : 'सामान्य दिवस प्रवाह (कोई अवरोधक रोग-आरंभ योग नहीं)।',
  });

  return {
    date: dateStr,
    time: timeStr.slice(0, 5),
    lunarSystem,
    amantaMasaEn: `${isAdhikaMasa ? 'Adhika ' : ''}${amantaMasa.en}`,
    amantaMasaHi: `${isAdhikaMasa ? 'अधिक ' : ''}${amantaMasa.hi}`,
    purnimantaMasaEn: `${isAdhikaMasa ? 'Adhika ' : ''}${purnimantaMasa.en}`,
    purnimantaMasaHi: `${isAdhikaMasa ? 'अधिक ' : ''}${purnimantaMasa.hi}`,
    activeMasaEn: `${isAdhikaMasa ? 'Adhika ' : ''}${activeMasa.en}`,
    activeMasaHi: `${isAdhikaMasa ? 'अधिक ' : ''}${activeMasa.hi}`,
    isAdhikaMasa,
    vikramSamvat,
    shakaSamvat,
    samvatsaraNumber: samIdx + 1,
    samvatsaraEn: sam.en,
    samvatsaraHi: sam.hi,
    rituEn: ritu.en,
    rituHi: ritu.hi,
    ayanaEn: isUttarayana ? 'Uttarayana (Northern)' : 'Dakshinayana (Southern)',
    ayanaHi: isUttarayana ? 'उत्तरायण' : 'दक्षिणायण',
    specialTithiEn,
    specialTithiHi,
    dishaShool: {
      directionEn: shool.dir,
      directionHi: DIR_HI[shool.dir] ?? shool.dir,
      exemptionEn: shool.exEn,
      exemptionHi: shool.exHi,
      remedyEn: shool.remEn,
      remedyHi: shool.remHi,
    },
    nakshatraShool: {
      directionEn: nakShoolDir,
      directionHi: nakShoolDir ? DIR_HI[nakShoolDir] ?? nakShoolDir : null,
    },
    vaasa: {
      shivaStateEn: shivaObj.en,
      shivaStateHi: shivaObj.hi,
      shivaEffectEn: shivaObj.effEn,
      shivaEffectHi: shivaObj.effHi,
      agniStateEn: agniObj.en,
      agniStateHi: agniObj.hi,
      agniEffectEn: agniObj.effEn,
      agniEffectHi: agniObj.effHi,
      chandraDirEn: chandraDir,
      chandraDirHi: DIR_HI[chandraDir] ?? chandraDir,
      chandraAbodeEn: PADA_ABODE_EN[(nakPada - 1) % 4],
      chandraAbodeHi: PADA_ABODE_HI[(nakPada - 1) % 4],
      rahuDirEn: rahuDir,
      rahuDirHi: DIR_HI[rahuDir] ?? rahuDir,
      yoginiDirEn: yoginiDir,
      yoginiDirHi: DIR_HI[yoginiDir] ?? yoginiDir,
    },
    panchaka: {
      remainder: panRem,
      nameEn: panDef.en,
      nameHi: panDef.hi,
      isAuspicious: panDef.ok,
    },
    muhurtaRules,
    sankramanaAlert: {
      nearIngress,
      hoursFromIngress: nearestIngressHours,
      noteEn: nearIngress
        ? `Surya Sankramana Active (±${nearestIngressHours}h of Sun sign ingress): avoid secular starts for 16 ghatis; ideal for mantra/meditation.`
        : `Clear of Surya Sankramana window (${nearestIngressHours}h away from nearest solar sign change).`,
      noteHi: nearIngress
        ? `सूर्य संक्रांति दोष क्षेत्र (±${nearestIngressHours} घंटे): 16 घटी तक नए लौकिक कार्य टालें; जप-ध्यान हेतु श्रेष्ठ।`
        : `सूर्य संक्रांति से सुरक्षित (${nearestIngressHours} घंटे दूर)।`,
    },
  };
}
