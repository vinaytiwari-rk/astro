import * as Astronomy from 'astronomy-engine';
import { SIGNS } from './constants';
import { computeAyanamsaDeg, computeSunriseSunsetForLocalDay } from './ephemeris';
import { formatLocalTimeFromUtc, normalizeDeg } from './time';
import type { AyanamsaId, ChartData } from './types';

export interface ChoghadiyaSlot {
  index: number;
  period: 'day' | 'night';
  nameEn: string;
  nameHi: string;
  rulerEn: string;
  rulerHi: string;
  quality: 'best' | 'good' | 'neutral' | 'avoid';
  qualityLabelEn: string;
  qualityLabelHi: string;
  startTime: string;
  endTime: string;
  purposeEn: string;
  purposeHi: string;
}

export interface GowriSlot {
  index: number;
  period: 'day' | 'night';
  nameEn: string;
  nameHi: string;
  quality: 'good' | 'neutral' | 'avoid';
  startTime: string;
  endTime: string;
}

export interface DailyMuhurtaSuite {
  date: string;
  sunrise: string;
  sunset: string;
  dayChoghadiya: ChoghadiyaSlot[];
  nightChoghadiya: ChoghadiyaSlot[];
  dayGowri: GowriSlot[];
  nightGowri: GowriSlot[];
}

export interface HinduCalendarEvent {
  date: string;
  category: 'festival' | 'ekadashi' | 'purnima_amavasya' | 'sankranti';
  nameEn: string;
  nameHi: string;
  tithiNoteEn: string;
  tithiNoteHi: string;
}

interface ChogDef {
  nameEn: string;
  nameHi: string;
  rulerEn: string;
  rulerHi: string;
  quality: 'best' | 'good' | 'neutral' | 'avoid';
  qualityLabelEn: string;
  qualityLabelHi: string;
  purposeEn: string;
  purposeHi: string;
}

const CHOGHADIYA_DEFS: ChogDef[] = [
  {
    nameEn: 'Udveg',
    nameHi: 'उद्वेग',
    rulerEn: 'Sun',
    rulerHi: 'सूर्य',
    quality: 'avoid',
    qualityLabelEn: 'Inauspicious',
    qualityLabelHi: 'अशुभ (सरकारी कार्य हेतु सामान्य)',
    purposeEn: 'Avoid new starts; suitable only for government tasks.',
    purposeHi: 'नए शुभ कार्य टालें; केवल राजकीय/सरकारी कार्यों में ठीक।',
  },
  {
    nameEn: 'Chal',
    nameHi: 'चर (चंचल)',
    rulerEn: 'Venus',
    rulerHi: 'शुक्र',
    quality: 'neutral',
    qualityLabelEn: 'Good for Travel',
    qualityLabelHi: 'यात्रा एवं गतिशील कार्यों हेतु शुभ',
    purposeEn: 'Ideal for travel, transit, vehicle starts, and movement.',
    purposeHi: 'यात्रा, वाहन संचालन एवं भ्रमण कार्यों हेतु अनुकूल।',
  },
  {
    nameEn: 'Labh',
    nameHi: 'लाभ',
    rulerEn: 'Mercury',
    rulerHi: 'बुध',
    quality: 'good',
    qualityLabelEn: 'Beneficial',
    qualityLabelHi: 'शुभ एवं लाभप्रद',
    purposeEn: 'Great for commerce, learning, accounting, and business.',
    purposeHi: 'व्यापार, लेखा-जोखा, विद्या एवं लाभ-निवेश के लिए उत्तम।',
  },
  {
    nameEn: 'Amrit',
    nameHi: 'अमृत',
    rulerEn: 'Moon',
    rulerHi: 'चंद्र',
    quality: 'best',
    qualityLabelEn: 'Most Auspicious',
    qualityLabelHi: 'सर्वोत्तम शुभ',
    purposeEn: 'Nectar period — ideal for all sacred, marriage, and vital acts.',
    purposeHi: 'अमृततुल्य समय — समस्त मांगलिक व महत्वपूर्ण कार्यों हेतु श्रेष्ठतम।',
  },
  {
    nameEn: 'Kaal',
    nameHi: 'काल',
    rulerEn: 'Saturn',
    rulerHi: 'शनि',
    quality: 'avoid',
    qualityLabelEn: 'Inauspicious',
    qualityLabelHi: 'त्याज्य / अशुभ',
    purposeEn: 'Avoid new ventures; only suitable for discipline/wealth protection.',
    purposeHi: 'शुभ प्रारंभ वर्जित; केवल नियमित श्रम या संरक्षण कार्य करें।',
  },
  {
    nameEn: 'Shubh',
    nameHi: 'शुभ',
    rulerEn: 'Jupiter',
    rulerHi: 'गुरु',
    quality: 'good',
    qualityLabelEn: 'Auspicious',
    qualityLabelHi: 'शुभ एवं धर्मप्रद',
    purposeEn: 'Highly supportive for ceremonies, vows, signing agreements.',
    purposeHi: 'संस्कार, अनुबंध, पूजा-पाठ व शुभ संकल्पों के लिए श्रेष्ठ।',
  },
  {
    nameEn: 'Rog',
    nameHi: 'रोग',
    rulerEn: 'Mars',
    rulerHi: 'मंगल',
    quality: 'avoid',
    qualityLabelEn: 'Inauspicious',
    qualityLabelHi: 'अशुभ',
    purposeEn: 'Avoid auspicious rituals; only for competition/medical war.',
    purposeHi: 'शुभ मांगलिक कार्य टालें; विवाद/प्रतिस्पर्धा शमन हेतु उपयुक्त।',
  },
];

// Weekday starting Choghadiya index (Sun..Sat)
const DAY_START_IDX = [0, 3, 6, 2, 5, 1, 4];

const GOWRI_CYCLE: Array<{ nameEn: string; nameHi: string; quality: 'good' | 'neutral' | 'avoid' }> = [
  { nameEn: 'Uthi (Average)', nameHi: 'उथी (सामान्य)', quality: 'neutral' },
  { nameEn: 'Amirtham (Best)', nameHi: 'अमृतम (श्रेष्ठतम)', quality: 'good' },
  { nameEn: 'Rogam', nameHi: 'रोगम (अशुभ)', quality: 'avoid' },
  { nameEn: 'Laabham (Benefic)', nameHi: 'लाभम (शुभ)', quality: 'good' },
  { nameEn: 'Dhanam (Wealth)', nameHi: 'धनम (शुभ)', quality: 'good' },
  { nameEn: 'Sugam (Happiness)', nameHi: 'सुखम (शुभ)', quality: 'good' },
  { nameEn: 'Soram', nameHi: 'शोरम (अशुभ)', quality: 'avoid' },
  { nameEn: 'Visham', nameHi: 'विषम (अशुभ)', quality: 'avoid' },
];

export function computeDailyChoghadiyaAndGowri(
  dateStr: string,
  latitude: number,
  longitude: number,
  offsetMinutes: number
): DailyMuhurtaSuite {
  const [yr, mo, dy] = dateStr.split('-').map((x) => parseInt(x, 10));
  const noonUtcMs = Date.UTC(yr, mo - 1, dy, 12, 0, 0) - offsetMinutes * 60_000;
  const sunTimes = computeSunriseSunsetForLocalDay(noonUtcMs, offsetMinutes, latitude, longitude);

  const localMidnightMs = Date.UTC(yr, mo - 1, dy, 0, 0, 0) - offsetMinutes * 60_000;
  const srMs = sunTimes.vedicSunriseMs ?? sunTimes.sunriseMs ?? localMidnightMs + 6 * 3600_000;
  const ssMs = sunTimes.vedicSunsetMs ?? sunTimes.sunsetMs ?? srMs + 12 * 3600_000;
  const nSrMs = sunTimes.nextSunriseMs ?? srMs + 24 * 3600_000;

  const weekday = new Date(srMs + offsetMinutes * 60_000).getUTCDay();
  const dayStart = DAY_START_IDX[weekday] ?? 0;
  const nightStart = (dayStart + 5) % 7;

  const daySlotMs = (ssMs - srMs) / 8;
  const nightSlotMs = (nSrMs - ssMs) / 8;

  const dayChoghadiya: ChoghadiyaSlot[] = Array.from({ length: 8 }, (_, i) => {
    const def = CHOGHADIYA_DEFS[(dayStart + i) % 7];
    const t0 = srMs + i * daySlotMs;
    const t1 = t0 + daySlotMs;
    return {
      index: i + 1,
      period: 'day',
      ...def,
      startTime: formatLocalTimeFromUtc(t0, offsetMinutes, false),
      endTime: formatLocalTimeFromUtc(t1, offsetMinutes, false),
    };
  });

  const nightChoghadiya: ChoghadiyaSlot[] = Array.from({ length: 8 }, (_, i) => {
    const def = CHOGHADIYA_DEFS[(nightStart + i * 5) % 7];
    const t0 = ssMs + i * nightSlotMs;
    const t1 = t0 + nightSlotMs;
    return {
      index: i + 1,
      period: 'night',
      ...def,
      startTime: formatLocalTimeFromUtc(t0, offsetMinutes, false),
      endTime: formatLocalTimeFromUtc(t1, offsetMinutes, false),
    };
  });

  const dayGowri: GowriSlot[] = Array.from({ length: 8 }, (_, i) => {
    const g = GOWRI_CYCLE[(weekday + i) % 8];
    const t0 = srMs + i * daySlotMs;
    const t1 = t0 + daySlotMs;
    return {
      index: i + 1,
      period: 'day',
      ...g,
      startTime: formatLocalTimeFromUtc(t0, offsetMinutes, false),
      endTime: formatLocalTimeFromUtc(t1, offsetMinutes, false),
    };
  });

  const nightGowri: GowriSlot[] = Array.from({ length: 8 }, (_, i) => {
    const g = GOWRI_CYCLE[(weekday + 4 + i) % 8];
    const t0 = ssMs + i * nightSlotMs;
    const t1 = t0 + nightSlotMs;
    return {
      index: i + 1,
      period: 'night',
      ...g,
      startTime: formatLocalTimeFromUtc(t0, offsetMinutes, false),
      endTime: formatLocalTimeFromUtc(t1, offsetMinutes, false),
    };
  });

  return {
    date: dateStr,
    sunrise: formatLocalTimeFromUtc(srMs, offsetMinutes, false),
    sunset: formatLocalTimeFromUtc(ssMs, offsetMinutes, false),
    dayChoghadiya,
    nightChoghadiya,
    dayGowri,
    nightGowri,
  };
}

const SANKRANTI_NAMES: Array<{ signIdx: number; en: string; hi: string }> = [
  { signIdx: 9, en: 'Makar Sankranti (Pongal / Uttarayana)', hi: 'मकर संक्रांति (पोंगल / उत्तरायण)' },
  { signIdx: 10, en: 'Kumbha Sankranti', hi: 'कुंभ संक्रांति' },
  { signIdx: 11, en: 'Meena Sankranti', hi: 'मीन संक्रांति' },
  { signIdx: 0, en: 'Mesha Sankranti (Baisakhi / Vishu)', hi: 'मेष संक्रांति (बैसाखी / हिंदू सौर नववर्ष)' },
  { signIdx: 1, en: 'Vrishabha Sankranti', hi: 'वृषभ संक्रांति' },
  { signIdx: 2, en: 'Mithuna Sankranti (Raja Parba)', hi: 'मिथुन संक्रांति' },
  { signIdx: 3, en: 'Karka Sankranti (Dakshinayana)', hi: 'कर्क संक्रांति (दक्षिणायन आरंभ)' },
  { signIdx: 4, en: 'Simha Sankranti', hi: 'सिंह संक्रांति' },
  { signIdx: 5, en: 'Kanya Sankranti (Vishwakarma Puja)', hi: 'कन्या संक्रांति (विश्वकर्मा पूजा)' },
  { signIdx: 6, en: 'Tula Sankranti', hi: 'तुला संक्रांति' },
  { signIdx: 7, en: 'Vrishchika Sankranti', hi: 'वृश्चिक संक्रांति' },
  { signIdx: 8, en: 'Dhanu Sankranti (Dhanurmas)', hi: 'धनु संक्रांति' },
];

const SIGN_NAMES_HI = [
  'मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या',
  'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुंभ', 'मीन',
];

const AMANTA_MONTH_NAMES = [
  { en: 'Chaitra', hi: 'चैत्र' },
  { en: 'Vaishakha', hi: 'वैशाख' },
  { en: 'Jyeshtha', hi: 'ज्येष्ठ' },
  { en: 'Ashadha', hi: 'आषाढ़' },
  { en: 'Shravana', hi: 'श्रावण' },
  { en: 'Bhadrapada', hi: 'भाद्रपद' },
  { en: 'Ashwin', hi: 'आश्विन' },
  { en: 'Kartika', hi: 'कार्तिक' },
  { en: 'Margashirsha', hi: 'मार्गशीर्ष' },
  { en: 'Pausha', hi: 'पौष' },
  { en: 'Magha', hi: 'माघ' },
  { en: 'Phalguna', hi: 'फाल्गुन' },
];

const EKADASHI_NAMES: Record<number, { shuklaEn: string; shuklaHi: string; krishnaEn: string; krishnaHi: string }> = {
  0: { shuklaEn: 'Kamada Ekadashi', shuklaHi: 'कामदा एकादशी', krishnaEn: 'Varuthini / Papmochani Ekadashi', krishnaHi: 'वरूथिनी एकादशी' },
  1: { shuklaEn: 'Mohini Ekadashi', shuklaHi: 'मोहिनी एकादशी', krishnaEn: 'Apara Ekadashi', krishnaHi: 'अपरा एकादशी' },
  2: { shuklaEn: 'Nirjala Ekadashi', shuklaHi: 'निर्जला एकादशी', krishnaEn: 'Yogini Ekadashi', krishnaHi: 'योगिनी एकादशी' },
  3: { shuklaEn: 'Devshayani Ekadashi', shuklaHi: 'देवशयनी एकादशी', krishnaEn: 'Kamika Ekadashi', krishnaHi: 'कामिका एकादशी' },
  4: { shuklaEn: 'Shravana Putrada Ekadashi', shuklaHi: 'श्रावण पुत्रदा एकादशी', krishnaEn: 'Aja Ekadashi', krishnaHi: 'अजा एकादशी' },
  5: { shuklaEn: 'Parsva / Parivartini Ekadashi', shuklaHi: 'परिवर्तिनी एकादशी', krishnaEn: 'Indira Ekadashi', krishnaHi: 'इंदिरा एकादशी' },
  6: { shuklaEn: 'Papankusha Ekadashi', shuklaHi: 'पापांकुशा एकादशी', krishnaEn: 'Rama Ekadashi', krishnaHi: 'रमा एकादशी' },
  7: { shuklaEn: 'Devutthana Ekadashi (Prabodhini)', shuklaHi: 'देवउठनी / प्रबोधिनी एकादशी', krishnaEn: 'Utpanna Ekadashi', krishnaHi: 'उत्पन्ना एकादशी' },
  8: { shuklaEn: 'Mokshada Ekadashi (Gita Jayanti)', shuklaHi: 'मोक्षदा एकादशी (गीता जयंती)', krishnaEn: 'Saphala Ekadashi', krishnaHi: 'सफला एकादशी' },
  9: { shuklaEn: 'Pausha Putrada Ekadashi', shuklaHi: 'पौष पुत्रदा एकादशी', krishnaEn: 'Shattila Ekadashi', krishnaHi: 'षटतिला एकादशी' },
  10: { shuklaEn: 'Jaya Ekadashi', shuklaHi: 'जया एकादशी', krishnaEn: 'Vijaya Ekadashi', krishnaHi: 'विजया एकादशी' },
  11: { shuklaEn: 'Amalaki Ekadashi', shuklaHi: 'आमलकी एकादशी', krishnaEn: 'Papmochani Ekadashi', krishnaHi: 'पापमोचनी एकादशी' },
};

type FestivalKaal = 'udaya' | 'madhyahna' | 'aparahna' | 'rakhi' | 'pradosh' | 'nishita' | 'moonrise';

function formatLocalYmd(ms: number, offsetMinutes: number): string {
  const d = new Date(ms + offsetMinutes * 60_000);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
}

function addDaysYmd(ymd: string, delta: number): string {
  const ms = Date.parse(`${ymd}T12:00:00Z`) + delta * 86_400_000;
  return new Date(ms).toISOString().slice(0, 10);
}

function siderealSunDeg(ms: number, ayanamsa: AyanamsaId): number {
  const t = new Astronomy.AstroTime(new Date(ms));
  return normalizeDeg(Astronomy.SunPosition(t).elon - computeAyanamsaDeg(t, ayanamsa));
}

function elongDegAt(ms: number, ayanamsa: AyanamsaId): number {
  const t = new Astronomy.AstroTime(new Date(ms));
  const ay = computeAyanamsaDeg(t, ayanamsa);
  return normalizeDeg(
    normalizeDeg(Astronomy.EclipticGeoMoon(t).lon - ay) - normalizeDeg(Astronomy.SunPosition(t).elon - ay)
  );
}

function overlapMs(a0: number, a1: number, b0: number, b1: number): number {
  return Math.max(0, Math.min(a1, b1) - Math.max(a0, b0));
}

function bisectCrossing(
  lo: number,
  hi: number,
  fn: (ms: number) => number,
  targetFn: (ms: number) => boolean
): number {
  let a = lo;
  let b = hi;
  for (let i = 0; i < 18; i++) {
    const mid = (a + b) / 2;
    void fn(mid);
    if (targetFn(mid)) b = mid;
    else a = mid;
  }
  return b;
}

/**
 * Astronomically computes all 12 Sankrantis (Sunset-aware Drik rule),
 * Ekadashis, Purnimas, Amavasyas, and 30+ major Hindu Festivals (with Adhika Masa detection
 * and exact Dharma-Shastra Kaal resolution: Udaya, Madhyahna, Aparahna, Pradosh, Nishita, Moonrise).
 */
export function computeAnnualHinduCalendar(
  year: number,
  ayanamsa: AyanamsaId,
  offsetMinutes = 330,
  latitude = 28.6139,
  longitude = 77.209
): HinduCalendarEvent[] {
  const events: HinduCalendarEvent[] = [];
  const marginStart = Date.UTC(year - 1, 10, 15, 0, 0, 0);
  const marginEnd = Date.UTC(year + 1, 1, 15, 0, 0, 0);
  const yearStartStr = `${year}-01-01`;
  const yearEndStr = `${year}-12-31`;

  const dayCache = new Map<
    string,
    {
      sr: number;
      ss: number;
      nextSr: number;
      mr: number;
      madhyahnaStart: number;
      madhyahnaEnd: number;
      aparahnaStart: number;
      aparahnaEnd: number;
      pradoshStart: number;
      pradoshEnd: number;
      nishitaStart: number;
      nishitaEnd: number;
    }
  >();

  const getDayWin = (ymd: string) => {
    const cached = dayCache.get(ymd);
    if (cached) return cached;
    const [yr, mo, dy] = ymd.split('-').map((n) => parseInt(n, 10));
    const noonUtc = Date.UTC(yr, mo - 1, dy, 12, 0, 0) - offsetMinutes * 60_000;
    const midUtc = Date.UTC(yr, mo - 1, dy, 0, 0, 0) - offsetMinutes * 60_000;
    const st = computeSunriseSunsetForLocalDay(noonUtc, offsetMinutes, latitude, longitude);
    const sr = st.sunriseMs ?? midUtc + 6 * 3600_000;
    const ss = st.sunsetMs ?? sr + 12 * 3600_000;
    const nextSr = st.nextSunriseMs ?? sr + 24 * 3600_000;
    const daySpan = ss - sr;
    const nightSpan = nextSr - ss;
    const nishitaMid = ss + nightSpan * 0.5;
    const win = {
      sr,
      ss,
      nextSr,
      mr: st.moonriseMs ?? ss + 2.5 * 3600_000,
      madhyahnaStart: sr + daySpan * 0.4,
      madhyahnaEnd: sr + daySpan * 0.6,
      aparahnaStart: sr + daySpan * 0.6,
      aparahnaEnd: ss,
      pradoshStart: ss,
      pradoshEnd: ss + 144 * 60_000,
      nishitaStart: nishitaMid - 28 * 60_000,
      nishitaEnd: nishitaMid + 28 * 60_000,
    };
    dayCache.set(ymd, win);
    return win;
  };

  // 1. Exact Solar Sankrantis (ingress instants bisecting sign transitions)
  const sankrantis: Array<{ ms: number; signIdx: number }> = [];
  let prevSign = Math.floor(siderealSunDeg(marginStart, ayanamsa) / 30) % 12;
  for (let ms = marginStart + 86_400_000; ms <= marginEnd; ms += 86_400_000) {
    const curSign = Math.floor(siderealSunDeg(ms, ayanamsa) / 30) % 12;
    if (curSign !== prevSign) {
      const exactMs = bisectCrossing(
        ms - 86_400_000,
        ms,
        (x) => Math.floor(siderealSunDeg(x, ayanamsa) / 30) % 12,
        (x) => (Math.floor(siderealSunDeg(x, ayanamsa) / 30) % 12) !== prevSign
      );
      sankrantis.push({ ms: exactMs, signIdx: curSign });
    }
    prevSign = curSign;
  }

  for (const sk of sankrantis) {
    const rawYmd = formatLocalYmd(sk.ms, offsetMinutes);
    const w = getDayWin(rawYmd);
    // Drik rule: if Sankranti occurs after local Sunset, Punya Kaal observation moves to next Sunrise day
    const obsYmd = sk.ms <= w.ss ? rawYmd : addDaysYmd(rawYmd, 1);
    if (obsYmd >= yearStartStr && obsYmd <= yearEndStr) {
      const meta = SANKRANTI_NAMES.find((x) => x.signIdx === sk.signIdx);
      const timeStr = formatLocalTimeFromUtc(sk.ms, offsetMinutes, false);
      events.push({
        date: obsYmd,
        category: 'sankranti',
        nameEn: meta ? meta.en : `${SIGNS[sk.signIdx].name} Sankranti`,
        nameHi: meta ? meta.hi : `${SIGN_NAMES_HI[sk.signIdx]} संक्रांति`,
        tithiNoteEn: `Sun enters ${SIGNS[sk.signIdx].name} (${timeStr})`,
        tithiNoteHi: `सूर्य ${SIGN_NAMES_HI[sk.signIdx]} प्रवेश (${timeStr})`,
      });
      if (sk.signIdx === 9) {
        const lohriYmd = `${year}-01-13`;
        events.push({
          date: lohriYmd,
          category: 'festival',
          nameEn: 'Lohri (Winter Harvest Eve)',
          nameHi: 'लोहड़ी पर्व',
          tithiNoteEn: 'Eve before Uttarayana / Makar',
          tithiNoteHi: 'मकर संक्रांति पूर्व संध्या',
        });
      }
    }
  }

  // 2. Exact Synodic Lunar Months via Astronomy.SearchMoonPhase(0)
  const newMoons: number[] = [];
  let cursor = marginStart;
  while (cursor < marginEnd) {
    const nm = Astronomy.SearchMoonPhase(0, new Date(cursor), 35);
    if (!nm) break;
    const ms = nm.date.getTime();
    if (ms > marginEnd) break;
    newMoons.push(ms);
    cursor = ms + 2 * 86_400_000;
  }

  // Resolve Tithi window date according to Dharma-Shastra Kaal
  const pickFestivalDay = (tStart: number, tEnd: number, kaal: FestivalKaal): string => {
    const y0 = formatLocalYmd(tStart, offsetMinutes);
    const y1 = formatLocalYmd(tEnd, offsetMinutes);
    const days: string[] = [];
    let cur = y0;
    for (let i = 0; i < 4; i++) {
      days.push(cur);
      if (cur >= y1) break;
      cur = addDaysYmd(cur, 1);
    }

    if (kaal === 'udaya') {
      for (const d of days) {
        const w = getDayWin(d);
        if (w.sr >= tStart && w.sr < tEnd) return d;
      }
      // Kshaya Tithi (skipped Sunrise — starts after d0 SR and ends before d1 SR): observe on d0
      return days[0];
    }

    if (kaal === 'rakhi') {
      const bhadraEnd = (tStart + tEnd) / 2;
      const w0 = getDayWin(days[0]);
      if ((w0.aparahnaStart + w0.aparahnaEnd) / 2 > bhadraEnd && tEnd >= w0.aparahnaStart) {
        return days[0];
      }
      if (days.length > 1) {
        const w1 = getDayWin(days[1]);
        // Aparahna on day0 had Bhadra -> if Day1 sunrise still has >= 3 Muhurtas (144m) of Purnima, observe on Day1
        if (w1.sr >= tStart && tEnd - w1.sr >= 144 * 60_000) return days[1];
      }
      return days[0];
    }

    let bestDay = days[0];
    let bestScore = -1;
    for (const d of days) {
      const w = getDayWin(d);
      let s = 0;
      if (kaal === 'madhyahna') s = overlapMs(w.madhyahnaStart, w.madhyahnaEnd, tStart, tEnd);
      else if (kaal === 'aparahna') s = overlapMs(w.aparahnaStart, w.aparahnaEnd, tStart, tEnd);
      else if (kaal === 'pradosh') s = overlapMs(w.pradoshStart, w.pradoshEnd, tStart, tEnd);
      else if (kaal === 'nishita') s = overlapMs(w.nishitaStart, w.nishitaEnd, tStart, tEnd);
      else if (kaal === 'moonrise') s = w.mr >= tStart && w.mr < tEnd ? 1 : 0;

      if (s > bestScore) {
        bestScore = s;
        bestDay = d;
      }
    }
    if (bestScore <= 0 && kaal === 'moonrise') {
      for (const d of days) {
        const w = getDayWin(d);
        if (overlapMs(w.ss, w.ss + 5 * 3600_000, tStart, tEnd) > 0) return d;
      }
    }
    return bestDay;
  };

  const pushIfInYear = (ev: HinduCalendarEvent) => {
    if (ev.date >= yearStartStr && ev.date <= yearEndStr) events.push(ev);
  };

  const seenFestKeys = new Set<string>();

  for (let mIdx = 0; mIdx < newMoons.length - 1; mIdx++) {
    const nm0 = newMoons[mIdx];
    const nm1 = newMoons[mIdx + 1];
    // Quick prune months totally outside the target year (+/- 5 days)
    if (nm1 < Date.UTC(year, 0, 1) - 10 * 86_400_000 || nm0 > Date.UTC(year, 11, 31) + 10 * 86_400_000) {
      continue;
    }

    const sankInMonth = sankrantis.filter((s) => s.ms > nm0 && s.ms <= nm1);
    const isAdhika = sankInMonth.length === 0;
    const amantaIdx = isAdhika
      ? (Math.floor(siderealSunDeg(nm0, ayanamsa) / 30) + 1) % 12
      : sankInMonth[0].signIdx;
    const monthMeta = AMANTA_MONTH_NAMES[amantaIdx];

    // Step across [nm0 .. nm1] in 3h steps & bisect exact Tithi 1..30 windows
    const tithiWindows: Array<{ tithi: number; start: number; end: number }> = [];
    const stepMs = 3 * 3600_000;
    let curT = 1;
    let curStart = nm0;
    let scanMs = nm0 + stepMs;

    while (scanMs <= nm1 - 600_000) {
      const el = elongDegAt(scanMs, ayanamsa);
      const tNow = (Math.floor(el / 12) % 30) + 1;
      if (tNow !== curT && !(curT === 30 && tNow === 1)) {
        // Compute exact crossover instant
        const targetEl = curT * 12;
        const endExact = bisectCrossing(
          scanMs - stepMs,
          scanMs,
          (x) => elongDegAt(x, ayanamsa),
          (x) => {
            const e = elongDegAt(x, ayanamsa);
            return e >= targetEl || (curT === 30 && e < 30);
          }
        );
        tithiWindows.push({ tithi: curT, start: curStart, end: endExact });
        curT = tNow;
        curStart = endExact;
      }
      scanMs += stepMs;
    }
    tithiWindows.push({ tithi: curT, start: curStart, end: nm1 });

    // Emit Ekadashi, Purnima, Amavasya, and Major Festivals from exact Tithi windows
    for (const tw of tithiWindows) {
      const t = tw.tithi; // 1..30
      const endTimeNote = `${formatLocalTimeFromUtc(tw.end, offsetMinutes, false)} (${formatLocalYmd(tw.end, offsetMinutes).slice(8, 10)}/${formatLocalYmd(tw.end, offsetMinutes).slice(5, 7)})`;

      if (t === 11 || t === 26) {
        const d = pickFestivalDay(tw.start, tw.end, 'udaya');
        const ekMeta = EKADASHI_NAMES[amantaIdx];
        const prefixEn = isAdhika ? (t === 11 ? 'Padmini Adhika' : 'Parama Adhika') : t === 11 ? ekMeta.shuklaEn : ekMeta.krishnaEn;
        const prefixHi = isAdhika ? (t === 11 ? 'पद्मिनी (अधिक) एकादशी' : 'परमा (अधिक) एकादशी') : t === 11 ? ekMeta.shuklaHi : ekMeta.krishnaHi;
        pushIfInYear({
          date: d,
          category: 'ekadashi',
          nameEn: `${prefixEn} Ekadashi`.replace('Ekadashi Ekadashi', 'Ekadashi'),
          nameHi: prefixHi,
          tithiNoteEn: `${monthMeta.en}${isAdhika ? ' (Adhika)' : ''} ${t === 11 ? 'Shukla' : 'Krishna'} 11 · ends ${endTimeNote}`,
          tithiNoteHi: `${isAdhika ? 'अधिक ' : ''}${monthMeta.hi} ${t === 11 ? 'शुक्ल' : 'कृष्ण'} एकादशी`,
        });
      }

      if (t === 15) {
        const d = pickFestivalDay(tw.start, tw.end, 'pradosh');
        pushIfInYear({
          date: d,
          category: 'purnima_amavasya',
          nameEn: `${isAdhika ? 'Adhika ' : ''}${monthMeta.en} Purnima`,
          nameHi: `${isAdhika ? 'अधिक ' : ''}${monthMeta.hi} पूर्णिमा`,
          tithiNoteEn: `Shukla 15 (Full Moon) · ends ${endTimeNote}`,
          tithiNoteHi: `शुक्ल पक्ष पूर्णिमा · समाप्त ${endTimeNote}`,
        });
      } else if (t === 30) {
        const d = pickFestivalDay(tw.start, tw.end, 'udaya');
        pushIfInYear({
          date: d,
          category: 'purnima_amavasya',
          nameEn: `${isAdhika ? 'Adhika ' : ''}${monthMeta.en} Amavasya`,
          nameHi: `${isAdhika ? 'अधिक ' : ''}${monthMeta.hi} अमावस्या`,
          tithiNoteEn: `Krishna 30 (New Moon) · ends ${endTimeNote}`,
          tithiNoteHi: `कृष्ण पक्ष अमावस्या · समाप्त ${endTimeNote}`,
        });
      }

      if (isAdhika) continue; // Regular annual festivals are observed strictly in Nija Masa

      const emitFest = (key: string, kaal: FestivalKaal, nameEn: string, nameHi: string, tEn: string, tHi: string, dayOffset = 0) => {
        if (seenFestKeys.has(key)) return;
        const baseDate = pickFestivalDay(tw.start, tw.end, kaal);
        const date = dayOffset === 0 ? baseDate : addDaysYmd(baseDate, dayOffset);
        if (date >= yearStartStr && date <= yearEndStr) {
          seenFestKeys.add(key);
          events.push({ date, category: 'festival', nameEn, nameHi, tithiNoteEn: tEn, tithiNoteHi: tHi });
        }
      };

      // Magha (amantaIdx = 10)
      if (amantaIdx === 10 && t === 5) emitFest('vasant', 'udaya', 'Vasant Panchami (Saraswati Puja)', 'वसंत पंचमी (सरस्वती पूजा)', 'Magha Shukla 5', 'माघ शुक्ल पंचमी');
      if (amantaIdx === 10 && t === 29) emitFest('shivratri', 'nishita', 'Maha Shivratri', 'महाशिवरात्रि', 'Magha/Phalguna Krishna 14 (Nishita)', 'फाल्गुन कृष्ण चतुर्दशी (निशीथ काल)');

      // Phalguna (amantaIdx = 11): Holika Dahan on Purnima Pradosh (t=15); Rangwali Holi on Krishna 1 Udaya Sunrise (t=16)
      if (amantaIdx === 11 && t === 15) {
        emitFest('holika', 'pradosh', 'Holika Dahan', 'होलिका दहन (छोटी होली)', 'Phalguna Purnima (Pradosh)', 'फाल्गुन पूर्णिमा (प्रदोष काल)');
      }
      if (amantaIdx === 11 && t === 16) {
        emitFest('holi', 'udaya', 'Holi (Rangwali / Dhulandi)', 'होली / धुलंडी (रंगोत्सव)', 'Chaitra Krishna 1 (Udaya)', 'चैत्र कृष्ण प्रतिपदा (उदया)');
      }

      // Chaitra (amantaIdx = 0)
      if (amantaIdx === 0 && t === 1) emitFest('ugadi', 'udaya', 'Chaitra Navratri / Gudi Padwa / Ugadi', 'चैत्र नवरात्रि प्रारंभ / हिंदू नववर्ष / गुड़ी पड़वा', 'Chaitra Shukla 1', 'चैत्र शुक्ल प्रतिपदा');
      if (amantaIdx === 0 && t === 9) emitFest('ramnavami', 'madhyahna', 'Rama Navami', 'श्री राम नवमी', 'Chaitra Shukla 9 (Madhyahna)', 'चैत्र शुक्ल नवमी (मध्याह्न)');
      if (amantaIdx === 0 && t === 13) emitFest('mahavir', 'udaya', 'Mahavir Jayanti', 'महावीर जयंती', 'Chaitra Shukla 13', 'चैत्र शुक्ल त्रयोदशी');
      if (amantaIdx === 0 && t === 15) emitFest('hanuman', 'udaya', 'Hanuman Jayanti', 'हनुमान जयंती', 'Chaitra Purnima', 'चैत्र पूर्णिमा');

      // Vaishakha (amantaIdx = 1)
      if (amantaIdx === 1 && t === 3) emitFest('akshaya', 'udaya', 'Akshaya Tritiya', 'अक्षय तृतीया', 'Vaishakha Shukla 3', 'वैशाख शुक्ल तृतीया');
      if (amantaIdx === 1 && t === 15) emitFest('buddha', 'udaya', 'Buddha Purnima', 'बुद्ध पूर्णिमा', 'Vaishakha Purnima', 'वैशाख पूर्णिमा');

      // Ashadha (amantaIdx = 3)
      if (amantaIdx === 3 && t === 15) emitFest('gurupurnima', 'udaya', 'Guru Purnima (Vyasa Purnima)', 'गुरु पूर्णिमा (व्यास पूर्णिमा)', 'Ashadha Purnima', 'आषाढ़ पूर्णिमा');

      // Shravana (amantaIdx = 4)
      if (amantaIdx === 4 && t === 5) emitFest('nagpanchami', 'udaya', 'Nag Panchami', 'नाग पंचमी', 'Shravana Shukla 5', 'श्रावण शुक्ल पंचमी');
      if (amantaIdx === 4 && t === 15) emitFest('rakhi', 'rakhi', 'Raksha Bandhan', 'रक्षाबंधन (राखी)', 'Shravana Purnima (Bhadra-Free)', 'श्रावण पूर्णिमा (भद्रा-रहित)');
      if (amantaIdx === 4 && t === 23) emitFest('janmashtami', 'nishita', 'Krishna Janmashtami', 'श्री कृष्ण जन्माष्टमी', 'Bhadrapada/Shravana Krishna 8 (Nishita)', 'भाद्रपद कृष्ण अष्टमी (निशीथ)');

      // Bhadrapada (amantaIdx = 5)
      if (amantaIdx === 5 && t === 3) emitFest('teej', 'pradosh', 'Hartalika Teej', 'हरतालिका तीज', 'Bhadrapada Shukla 3', 'भाद्रपद शुक्ल तृतीया');
      if (amantaIdx === 5 && t === 4) emitFest('ganesh', 'madhyahna', 'Ganesh Chaturthi', 'गणेश चतुर्थी', 'Bhadrapada Shukla 4 (Madhyahna)', 'भाद्रपद शुक्ल चतुर्थी');

      // Ashwin (amantaIdx = 6)
      if (amantaIdx === 6 && t === 1) emitFest('sharadnavratri', 'udaya', 'Sharad Navratri Begins', 'शारदीय नवरात्रि प्रारंभ', 'Ashwin Shukla 1', 'आश्विन शुक्ल प्रतिपदा');
      if (amantaIdx === 6 && t === 8) emitFest('ashtami', 'udaya', 'Durga Ashtami (Maha Ashtami)', 'महा अष्टमी (दुर्गा अष्टमी)', 'Ashwin Shukla 8', 'आश्विन शुक्ल अष्टमी');
      if (amantaIdx === 6 && t === 9) emitFest('mahanavami', 'udaya', 'Maha Navami', 'महा नवमी', 'Ashwin Shukla 9', 'आश्विन शुक्ल नवमी');
      if (amantaIdx === 6 && t === 10) emitFest('dussehra', 'aparahna', 'Dussehra (Vijayadashami)', 'दशहरा (विजयादशमी)', 'Ashwin Shukla 10 (Aparahna)', 'आश्विन शुक्ल दशमी');
      if (amantaIdx === 6 && t === 15) emitFest('sharadpurnima', 'nishita', 'Sharad Purnima (Kojagari)', 'शरद पूर्णिमा (कोजागरी)', 'Ashwin Purnima', 'आश्विन पूर्णिमा');
      // Krishna Paksha of Amanta Ashwin = Purnimanta Kartika Krishna!
      if (amantaIdx === 6 && t === 19) emitFest('karwa', 'moonrise', 'Karwa Chauth', 'करवा चौथ', 'Kartika Krishna 4 (Chandrodaya)', 'कार्तिक कृष्ण चतुर्थी');
      if (amantaIdx === 6 && t === 28) emitFest('dhanteras', 'pradosh', 'Dhanteras (Dhanvantari Trayodashi)', 'धनतेरस (धन्वंतरि त्रयोदशी)', 'Kartika Krishna 13 (Pradosh)', 'कार्तिक कृष्ण त्रयोदशी');
      if (amantaIdx === 6 && t === 29) emitFest('chhotidiwali', 'udaya', 'Naraka Chaturdashi (Chhoti Diwali)', 'नरक चतुर्दशी (छोटी दिवाली)', 'Kartika Krishna 14', 'कार्तिक कृष्ण चतुर्दशी');
      if (amantaIdx === 6 && t === 30) emitFest('diwali', 'pradosh', 'Diwali / Deepavali (Lakshmi Puja)', 'दीपावली (लक्ष्मी पूजन)', 'Kartika Amavasya (Pradosh)', 'कार्तिक अमावस्या (प्रदोष)');

      // Kartika (amantaIdx = 7)
      if (amantaIdx === 7 && t === 1) emitFest('govardhan', 'udaya', 'Govardhan Puja / Annakut', 'गोवर्धन पूजा / अन्नकूट', 'Kartika Shukla 1', 'कार्तिक शुक्ल प्रतिपदा');
      if (amantaIdx === 7 && t === 2) emitFest('bhaidooj', 'udaya', 'Bhai Dooj (Yamadwitiya)', 'भाई दूज (यम द्वितीया)', 'Kartika Shukla 2 (Aparahna/Udaya)', 'कार्तिक शुक्ल द्वितीया');
      if (amantaIdx === 7 && t === 6) emitFest('chhath', 'udaya', 'Chhath Puja (Surya Shashthi)', 'छठ पूजा (सूर्य षष्ठी)', 'Kartika Shukla 6', 'कार्तिक शुक्ल षष्ठी');
      if (amantaIdx === 7 && t === 12) emitFest('tulsivivah', 'pradosh', 'Tulsi Vivah', 'तुलसी विवाह', 'Kartika Shukla 12', 'कार्तिक शुक्ल द्वादशी');
      if (amantaIdx === 7 && t === 15) emitFest('kartikpurnima', 'pradosh', 'Dev Deepawali / Guru Nanak Jayanti', 'देव दीपावली / कार्तिक पूर्णिमा / गुरु नानक जयंती', 'Kartika Purnima', 'कार्तिक पूर्णिमा');
    }
  }

  return events.sort((a, b) => a.date.localeCompare(b.date));
}

export function getChoghadiyaForChart(chart: ChartData): DailyMuhurtaSuite {
  return computeDailyChoghadiyaAndGowri(
    chart.input.date,
    chart.input.latitude,
    chart.input.longitude,
    chart.offsetMinutesUsed
  );
}
