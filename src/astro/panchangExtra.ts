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
    qualityLabelEn: 'Neutral / Dynamic',
    qualityLabelHi: 'सामान्य / यात्रा अनुकूल',
    purposeEn: 'Good for travel, movement, and vehicle errands.',
    purposeHi: 'यात्रा, वाहन चलाने व गतिशील कार्यों के लिए उत्तम।',
  },
  {
    nameEn: 'Labh',
    nameHi: 'लाभ',
    rulerEn: 'Mercury',
    rulerHi: 'बुध',
    quality: 'good',
    qualityLabelEn: 'Gainful / Auspicious',
    qualityLabelHi: 'अत्यंत शुभ (लाभ)',
    purposeEn: 'Excellent for business, education, trade & accounting.',
    purposeHi: 'व्यापार, विद्यारंभ, निवेश व नए लाभकारी कार्यों हेतु श्रेष्ठ।',
  },
  {
    nameEn: 'Amrit',
    nameHi: 'अमृत',
    rulerEn: 'Moon',
    rulerHi: 'चंद्र',
    quality: 'best',
    qualityLabelEn: 'Most Auspicious',
    qualityLabelHi: 'सर्वोत्तम शुभ',
    purposeEn: 'Auspicious for all ceremonies, ventures & important beginnings.',
    purposeHi: 'सभी शुभ संस्कारों, नए कार्यों, विवाह व पूजा के लिए सर्वोत्तम।',
  },
  {
    nameEn: 'Kaal',
    nameHi: 'काल',
    rulerEn: 'Saturn',
    rulerHi: 'शनि',
    quality: 'avoid',
    qualityLabelEn: 'Avoid',
    qualityLabelHi: 'अशुभ (वर्ज्य)',
    purposeEn: 'Inauspicious for new auspicious undertakings.',
    purposeHi: 'नए मांगलिक एवं धन संबंधी कार्य टालें।',
  },
  {
    nameEn: 'Shubh',
    nameHi: 'शुभ',
    rulerEn: 'Jupiter',
    rulerHi: 'गुरु',
    quality: 'good',
    qualityLabelEn: 'Auspicious',
    qualityLabelHi: 'शुभ',
    purposeEn: 'Great for marriage, worship, study & charitable actions.',
    purposeHi: 'धार्मिक अनुष्ठान, विवाह बात, शिक्षा व मंगल कार्यों हेतु शुभ।',
  },
  {
    nameEn: 'Rog',
    nameHi: 'रोग',
    rulerEn: 'Mars',
    rulerHi: 'मंगल',
    quality: 'avoid',
    qualityLabelEn: 'Avoid',
    qualityLabelHi: 'अशुभ (रोग/विवाद)',
    purposeEn: 'Avoid auspicious commitments; suitable only for overcoming rivals.',
    purposeHi: 'शुभ कार्य वर्ज्य; केवल विवाद सुलझाने या चिकित्सा निर्णय में प्रयोग।',
  },
];

// Sunday..Saturday starting Choghadiya index in CHOGHADIYA_DEFS
const DAY_START_IDX = [0, 3, 6, 2, 5, 1, 4];

const GOWRI_CYCLE: Array<{ nameEn: string; nameHi: string; quality: 'good' | 'neutral' | 'avoid' }> = [
  { nameEn: 'Uthi', nameHi: 'उथि (सामान्य)', quality: 'neutral' },
  { nameEn: 'Amirtham', nameHi: 'अमृतम (अत्यंत शुभ)', quality: 'good' },
  { nameEn: 'Rogam', nameHi: 'रोगम (अशुभ)', quality: 'avoid' },
  { nameEn: 'Laabham', nameHi: 'लाभम (शुभ)', quality: 'good' },
  { nameEn: 'Dhanam', nameHi: 'धनम (शुभ)', quality: 'good' },
  { nameEn: 'Sugam', nameHi: 'सुखम (शुभ)', quality: 'good' },
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
  // Reference local noon UTC ms
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

/**
 * Astronomically computes all 12 Sankrantis, Ekadashis, Purnimas, Amavasyas,
 * and major Lunar Hindu Festivals for any requested Gregorian year.
 */
export function computeAnnualHinduCalendar(
  year: number,
  ayanamsa: AyanamsaId,
  offsetMinutes = 330
): HinduCalendarEvent[] {
  const events: HinduCalendarEvent[] = [];
  const startMs = Date.UTC(year, 0, 1, 6, 0, 0) - offsetMinutes * 60_000;
  const endMs = Date.UTC(year, 11, 31, 18, 0, 0) - offsetMinutes * 60_000;

  let prevSunSign = -1;
  let prevTithiIdx = -1;
  const seenFestKeys = new Set<string>();

  for (let ms = startMs; ms <= endMs; ms += 86_400_000) {
    const t = new Astronomy.AstroTime(new Date(ms));
    const ayan = computeAyanamsaDeg(t, ayanamsa);
    const sunSid = normalizeDeg(Astronomy.SunPosition(t).elon - ayan);
    const moonSid = normalizeDeg(Astronomy.EclipticGeoMoon(t).lon - ayan);
    const sunSign = Math.floor(sunSid / 30) % 12;

    const elong = normalizeDeg(moonSid - sunSid);
    const tithiIdx = Math.floor(elong / 12) % 30; // 0..14 Shukla 1..15, 15..29 Krishna 1..30

    const localD = new Date(ms + offsetMinutes * 60_000);
    const dateStr = `${localD.getUTCFullYear()}-${String(localD.getUTCMonth() + 1).padStart(2, '0')}-${String(localD.getUTCDate()).padStart(2, '0')}`;

    // 1. Sankranti
    if (prevSunSign !== -1 && sunSign !== prevSunSign) {
      const sk = SANKRANTI_NAMES.find((x) => x.signIdx === sunSign);
      events.push({
        date: dateStr,
        category: 'sankranti',
        nameEn: sk ? sk.en : `${SIGNS[sunSign].name} Sankranti`,
        nameHi: sk ? sk.hi : `${SIGNS[sunSign].sanskrit} संक्रांति`,
        tithiNoteEn: `Sun enters ${SIGNS[sunSign].name}`,
        tithiNoteHi: `सूर्य ${SIGNS[sunSign].name} प्रवेश`,
      });
    }

    // Current Amanta lunar month index: New Moon in Pisces(11) -> Chaitra(0), Aries(0) -> Vaishakha(1)...
    // Estimate sign of Sun at the beginning of this lunar month: approx (sunSid - elong / 12.19) sidereal deg
    const approxNewMoonSunSid = normalizeDeg(sunSid - (elong / 360) * 29.53 * 0.9856);
    const newMoonSunSign = Math.floor(approxNewMoonSunSid / 30) % 12;
    const amantaMonthIdx = (newMoonSunSign + 1) % 12; // 0=Chaitra, 1=Vaishakha, 2=Jyeshtha, 3=Ashadha, 4=Shravana, 5=Bhadrapada, 6=Ashwin, 7=Kartika, 8=Margashirsha, 9=Pausha, 10=Magha, 11=Phalguna

    const isDifferentTithi = tithiIdx !== prevTithiIdx;
    if (isDifferentTithi) {
      // 2. Ekadashi (tithiIdx 10 = Shukla 11, tithiIdx 25 = Krishna 11)
      if (tithiIdx === 10 || tithiIdx === 25) {
        const isShukla = tithiIdx === 10;
        events.push({
          date: dateStr,
          category: 'ekadashi',
          nameEn: isShukla ? 'Shukla Paksha Ekadashi' : 'Krishna Paksha Ekadashi',
          nameHi: isShukla ? 'शुक्ल पक्ष एकादशी व्रत' : 'कृष्ण पक्ष एकादशी व्रत',
          tithiNoteEn: `${isShukla ? 'Shukla' : 'Krishna'} 11th Tithi`,
          tithiNoteHi: `${isShukla ? 'शुक्ल' : 'कृष्ण'} एकादशी`,
        });
      }

      // 3. Purnima (14) & Amavasya (29)
      if (tithiIdx === 14) {
        events.push({
          date: dateStr,
          category: 'purnima_amavasya',
          nameEn: 'Purnima (Full Moon)',
          nameHi: 'पूर्णिमा व्रत',
          tithiNoteEn: 'Shukla 15 (Full Moon)',
          tithiNoteHi: 'शुक्ल पक्ष पूर्णिमा',
        });
      } else if (tithiIdx === 29) {
        events.push({
          date: dateStr,
          category: 'purnima_amavasya',
          nameEn: 'Amavasya (New Moon)',
          nameHi: 'अमावस्या',
          tithiNoteEn: 'Krishna 30 (New Moon)',
          tithiNoteHi: 'कृष्ण पक्ष अमावस्या',
        });
      }

      // 4. Major Annual Hindu Festivals by Amanta Month & Tithi
      const addFest = (key: string, nameEn: string, nameHi: string, tEn: string, tHi: string) => {
        if (seenFestKeys.has(key)) return;
        seenFestKeys.add(key);
        events.push({
          date: dateStr,
          category: 'festival',
          nameEn,
          nameHi,
          tithiNoteEn: tEn,
          tithiNoteHi: tHi,
        });
      };

      // Mahashivratri: Magha Amanta Krishna 14 (tithiIdx === 28, amantaMonthIdx === 10)
      if (amantaMonthIdx === 10 && tithiIdx === 28) {
        addFest('shivratri', 'Maha Shivratri', 'महाशिवरात्रि', 'Magha/Phalguna Krishna 14', 'कृष्ण चतुर्दशी');
      }
      // Holi: Phalguna Purnima (amantaMonthIdx === 11, tithiIdx === 14)
      if (amantaMonthIdx === 11 && tithiIdx === 14) {
        addFest('holi', 'Holika Dahan / Holi', 'होलिका दहन / होली', 'Phalguna Purnima', 'फाल्गुन पूर्णिमा');
      }
      // Chaitra Navratri / Hindu New Year: Chaitra Shukla 1 (amantaMonthIdx === 0, tithiIdx === 0)
      if (amantaMonthIdx === 0 && tithiIdx === 0) {
        addFest('ugadi', 'Chaitra Navratri Start / Gudi Padwa', 'चैत्र नवरात्रि प्रारंभ / हिंदू नववर्ष', 'Chaitra Shukla 1', 'चैत्र शुक्ल प्रतिपदा');
      }
      // Ram Navami: Chaitra Shukla 9 (amantaMonthIdx === 0, tithiIdx === 8)
      if (amantaMonthIdx === 0 && tithiIdx === 8) {
        addFest('ramnavami', 'Rama Navami', 'श्री राम नवमी', 'Chaitra Shukla 9', 'चैत्र शुक्ल नवमी');
      }
      // Hanuman Jayanti: Chaitra Purnima (amantaMonthIdx === 0, tithiIdx === 14)
      if (amantaMonthIdx === 0 && tithiIdx === 14) {
        addFest('hanuman', 'Hanuman Jayanti', 'हनुमान जयंती', 'Chaitra Purnima', 'चैत्र पूर्णिमा');
      }
      // Akshaya Tritiya: Vaishakha Shukla 3 (amantaMonthIdx === 1, tithiIdx === 2)
      if (amantaMonthIdx === 1 && tithiIdx === 2) {
        addFest('akshaya', 'Akshaya Tritiya', 'अक्षय तृतीया', 'Vaishakha Shukla 3', 'वैशाख शुक्ल तृतीया');
      }
      // Guru Purnima: Ashadha Purnima (amantaMonthIdx === 3, tithiIdx === 14)
      if (amantaMonthIdx === 3 && tithiIdx === 14) {
        addFest('gurupurnima', 'Guru Purnima (Vyasa Purnima)', 'गुरु पूर्णिमा (व्यास पूर्णिमा)', 'Ashadha Purnima', 'आषाढ़ पूर्णिमा');
      }
      // Nag Panchami: Shravana Shukla 5 (amantaMonthIdx === 4, tithiIdx === 4)
      if (amantaMonthIdx === 4 && tithiIdx === 4) {
        addFest('nagpanchami', 'Nag Panchami', 'नाग पंचमी', 'Shravana Shukla 5', 'श्रावण शुक्ल पंचमी');
      }
      // Raksha Bandhan: Shravana Purnima (amantaMonthIdx === 4, tithiIdx === 14)
      if (amantaMonthIdx === 4 && tithiIdx === 14) {
        addFest('rakhi', 'Raksha Bandhan', 'रक्षाबंधन', 'Shravana Purnima', 'श्रावण पूर्णिमा');
      }
      // Krishna Janmashtami: Bhadrapada/Shravana Krishna 8 (amantaMonthIdx === 4, tithiIdx === 22)
      if (amantaMonthIdx === 4 && tithiIdx === 22) {
        addFest('janmashtami', 'Krishna Janmashtami', 'श्री कृष्ण जन्माष्टमी', 'Krishna Ashtami', 'भाद्रपद/श्रावण कृष्ण अष्टमी');
      }
      // Ganesh Chaturthi: Bhadrapada Shukla 4 (amantaMonthIdx === 5, tithiIdx === 3)
      if (amantaMonthIdx === 5 && tithiIdx === 3) {
        addFest('ganesh', 'Ganesh Chaturthi', 'गणेश चतुर्थी', 'Bhadrapada Shukla 4', 'भाद्रपद शुक्ल चतुर्थी');
      }
      // Sharad Navratri Start: Ashwin Shukla 1 (amantaMonthIdx === 6, tithiIdx === 0)
      if (amantaMonthIdx === 6 && tithiIdx === 0) {
        addFest('sharadnavratri', 'Sharad Navratri Begins', 'शारदीय नवरात्रि प्रारंभ', 'Ashwin Shukla 1', 'आश्विन शुक्ल प्रतिपदा');
      }
      // Dussehra: Ashwin Shukla 10 (amantaMonthIdx === 6, tithiIdx === 9)
      if (amantaMonthIdx === 6 && tithiIdx === 9) {
        addFest('dussehra', 'Dussehra (Vijayadashami)', 'दशहरा (विजयादशमी)', 'Ashwin Shukla 10', 'आश्विन शुक्ल दशमी');
      }
      // Karwa Chauth: Kartika Amanta Krishna 4 (amantaMonthIdx === 6, tithiIdx === 18)
      if (amantaMonthIdx === 6 && tithiIdx === 18) {
        addFest('karwa', 'Karwa Chauth', 'करवा चौथ', 'Kartika Krishna 4', 'कृष्ण चतुर्थी');
      }
      // Dhanteras: Kartika Krishna 13 (amantaMonthIdx === 6, tithiIdx === 27)
      if (amantaMonthIdx === 6 && tithiIdx === 27) {
        addFest('dhanteras', 'Dhanteras (Dhanvantari Trayodashi)', 'धनतेरस', 'Kartika Krishna 13', 'कृष्ण त्रयोदशी');
      }
      // Diwali: Kartika Amavasya (amantaMonthIdx === 6, tithiIdx === 29)
      if (amantaMonthIdx === 6 && tithiIdx === 29) {
        addFest('diwali', 'Diwali / Deepavali (Lakshmi Puja)', 'दीपावली (लक्ष्मी पूजन)', 'Kartika Amavasya', 'कार्तिक अमावस्या');
      }
      // Chhath Puja: Kartika Shukla 6 (amantaMonthIdx === 7, tithiIdx === 5)
      if (amantaMonthIdx === 7 && tithiIdx === 5) {
        addFest('chhath', 'Chhath Puja (Surya Shashthi)', 'छठ पूजा', 'Kartika Shukla 6', 'कार्तिक शुक्ल षष्ठी');
      }
    }

    prevSunSign = sunSign;
    prevTithiIdx = tithiIdx;
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
