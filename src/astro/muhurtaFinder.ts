import { NAKSHATRAS, SIGNS } from './constants';
import { calculateChart } from './calculator';
import { DEFAULT_SETTINGS } from '../data/cities';
import type { ChartData, SevenPlanetId } from './types';

export type MuhurtaPurpose =
  | 'marriage'
  | 'griha_pravesh'
  | 'vehicle'
  | 'business'
  | 'surgery'
  | 'property'
  | 'travel';

export interface MuhurtaQuery {
  purpose: MuhurtaPurpose;
  startDate: string; // YYYY-MM-DD
  daysToScan?: number; // 7..90, default 30
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface AuspiciousWindow {
  startTime: string; // e.g. "09:15"
  endTime: string;   // e.g. "11:45"
  muhurtaType: string; // "Abhijit" | "Amrit Choghadiya" | "Shubh Choghadiya" | "Labh Choghadiya"
  quality: 'Excellent' | 'Good' | 'Fair';
}

export interface MuhurtaDayResult {
  date: string; // YYYY-MM-DD
  dayOfWeek: string;
  tithiName: string;
  tithiPaksha: 'Shukla' | 'Krishna';
  nakshatraName: string;
  yogaName: string;
  score: number; // 0..100
  verdict: 'Highly Auspicious' | 'Auspicious' | 'Moderate' | 'Avoid';
  verdictHi: string;
  rahuKalam: string;
  abhijitMuhurta: string;
  windows: AuspiciousWindow[];
  strengthsEn: string[];
  strengthsHi: string[];
  cautionsEn: string[];
  cautionsHi: string[];
}

export interface MuhurtaReport {
  purpose: MuhurtaPurpose;
  purposeLabelEn: string;
  purposeLabelHi: string;
  startDate: string;
  endDate: string;
  scannedDays: number;
  bestDates: MuhurtaDayResult[];
  allResults: MuhurtaDayResult[];
}

const PURPOSE_META: Record<MuhurtaPurpose, {
  labelEn: string;
  labelHi: string;
  favTithis: number[];
  avoidTithis: number[];
  favNakshatras: number[]; // indices 0..26
  favVaras: number[]; // 0=Sun..6=Sat
}> = {
  marriage: {
    labelEn: 'Vivaha (Marriage)',
    labelHi: 'विवाह मुहूर्त',
    favTithis: [2, 3, 5, 7, 10, 11, 12, 13], // Shukla & Krishna (except amavasya/chaturthi/ashtami)
    avoidTithis: [4, 9, 14, 30],
    favNakshatras: [3, 4, 11, 12, 14, 16, 20, 21, 25], // Rohini, Mrigashira, Uttara Phalguni, Hasta, Swati, Anuradha, Uttara Ashadha, Uttara Bhadra, Revati
    favVaras: [1, 3, 4, 5], // Mon, Wed, Thu, Fri
  },
  griha_pravesh: {
    labelEn: 'Griha Pravesh (House Warming)',
    labelHi: 'गृह प्रवेश मुहूर्त',
    favTithis: [2, 3, 5, 7, 10, 11, 13],
    avoidTithis: [4, 9, 14, 30],
    favNakshatras: [3, 4, 11, 13, 14, 16, 20, 25],
    favVaras: [1, 3, 4, 5],
  },
  vehicle: {
    labelEn: 'Vehicle Purchase',
    labelHi: 'वाहन क्रय मुहूर्त',
    favTithis: [2, 3, 5, 7, 10, 11, 13, 15],
    avoidTithis: [4, 9, 14, 30],
    favNakshatras: [0, 3, 7, 12, 14, 16, 21, 26], // Ashwini, Rohini, Pushya, Hasta, Swati, Anuradha, Shravana, Revati
    favVaras: [1, 3, 4, 5, 0], // Mon, Wed, Thu, Fri, Sun
  },
  business: {
    labelEn: 'Business Launch / Shop Opening',
    labelHi: 'व्यापार / दुकान उद्घाटन',
    favTithis: [2, 3, 5, 7, 10, 11, 13],
    avoidTithis: [4, 9, 14, 30],
    favNakshatras: [0, 3, 7, 11, 12, 14, 20, 21],
    favVaras: [1, 3, 4, 5],
  },
  surgery: {
    labelEn: 'Surgery / Medical Procedure',
    labelHi: 'शल्य चिकित्सा मुहूर्त',
    favTithis: [2, 3, 5, 7, 10, 11],
    avoidTithis: [4, 8, 9, 14, 15, 30],
    favNakshatras: [0, 3, 4, 7, 12, 16, 21],
    favVaras: [1, 2, 4], // Mon, Tue (Mars rules surgery), Thu
  },
  property: {
    labelEn: 'Property / Land Registration',
    labelHi: 'भूमि / संपत्ति क्रय',
    favTithis: [2, 3, 5, 7, 10, 11, 13],
    avoidTithis: [4, 9, 14, 30],
    favNakshatras: [3, 4, 7, 11, 13, 16, 20, 25],
    favVaras: [4, 5], // Thu, Fri
  },
  travel: {
    labelEn: 'Travel / Journey (Yatra)',
    labelHi: 'यात्रा मुहूर्त',
    favTithis: [2, 3, 5, 7, 10, 11, 13],
    avoidTithis: [4, 9, 14, 30],
    favNakshatras: [0, 3, 4, 7, 12, 14, 16, 26],
    favVaras: [1, 3, 4, 5],
  },
};

export function findAuspiciousMuhurtas(query: MuhurtaQuery): MuhurtaReport {
  const meta = PURPOSE_META[query.purpose] || PURPOSE_META.business;
  const daysToScan = Math.min(90, Math.max(7, query.daysToScan ?? 30));
  const startD = new Date(query.startDate);

  const results: MuhurtaDayResult[] = [];

  for (let i = 0; i < daysToScan; i++) {
    const curD = new Date(startD.getTime() + i * 86_400_000);
    const dateStr = curD.toISOString().slice(0, 10);
    const dayOfWeekIdx = curD.getUTCDay(); // 0=Sun..6=Sat
    const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeekIdx];

    // Compute day's Panchang at noon via calculateChart
    const tempChart = calculateChart({
      id: `muhurta-${dateStr}`,
      name: 'Muhurta Query',
      date: dateStr,
      time: '12:00:00',
      timezone: query.timezone,
      latitude: query.latitude,
      longitude: query.longitude,
      city: 'Muhurta Location',
    }, DEFAULT_SETTINGS);
    const panchang = tempChart.panchang;

    let score = 50; // base score
    const strengthsEn: string[] = [];
    const strengthsHi: string[] = [];
    const cautionsEn: string[] = [];
    const cautionsHi: string[] = [];

    // Tithi scoring
    const tithiNum = panchang.tithi.number;
    const isFavTithi = meta.favTithis.includes(tithiNum);
    const isAvoidTithi = meta.avoidTithis.includes(tithiNum);

    if (isFavTithi) {
      score += 20;
      strengthsEn.push(`Auspicious ${panchang.tithi.paksha} ${panchang.tithi.name} (Tithi ${tithiNum})`);
      strengthsHi.push(`शुभ ${panchang.tithi.paksha === 'Shukla' ? 'शुक्ल' : 'कृष्ण'} ${panchang.tithi.name}`);
    } else if (isAvoidTithi) {
      score -= 30;
      cautionsEn.push(`Inauspicious Rikta/Amavasya Tithi: ${panchang.tithi.name}`);
      cautionsHi.push(`रिक्ता/अमावस्या तिथि त्यागें: ${panchang.tithi.name}`);
    }

    // Nakshatra scoring
    const nakIdx = panchang.nakshatra.index;
    const isFavNak = meta.favNakshatras.includes(nakIdx);
    if (isFavNak) {
      score += 20;
      strengthsEn.push(`Benefic Nakshatra: ${panchang.nakshatra.name} (${panchang.nakshatra.deity})`);
      strengthsHi.push(`श्रेष्ठ नक्षत्र: ${panchang.nakshatra.name}`);
    } else if ([0, 18, 8].includes(nakIdx)) { // Mula, Jyeshtha, Ashlesha (Gandanta)
      score -= 20;
      cautionsEn.push(`Gandanta/Kevala Nakshatra: ${panchang.nakshatra.name}`);
      cautionsHi.push(`गंडांत नक्षत्र प्रभाव: ${panchang.nakshatra.name}`);
    }

    // Vara (Weekday) scoring
    if (meta.favVaras.includes(dayOfWeekIdx)) {
      score += 15;
      strengthsEn.push(`Auspicious Vara: ${dayName} ruled by ${panchang.vara.lord}`);
      strengthsHi.push(`शुभ वार: ${dayName}`);
    } else {
      score -= 10;
      cautionsEn.push(`Challenging day lord for this purpose: ${dayName}`);
      cautionsHi.push(`वार मध्यम फलप्रद: ${dayName}`);
    }

    // Abhijit Muhurta bonus
    if (panchang.abhijitMuhurta && panchang.abhijitMuhurta !== 'None (Wednesday)') {
      score += 10;
      strengthsEn.push(`Abhijit Muhurta active: ${panchang.abhijitMuhurta}`);
      strengthsHi.push(`अभिजीत मुहूर्त उपस्थित: ${panchang.abhijitMuhurta}`);
    }

    score = Math.max(10, Math.min(100, score));

    let verdict: MuhurtaDayResult['verdict'] = 'Moderate';
    let verdictHi = 'मध्यम मुहूर्त';
    if (score >= 80) {
      verdict = 'Highly Auspicious';
      verdictHi = 'अति शुभ मुहूर्त';
    } else if (score >= 65) {
      verdict = 'Auspicious';
      verdictHi = 'शुभ मुहूर्त';
    } else if (score < 45) {
      verdict = 'Avoid';
      verdictHi = 'वर्जित मुहूर्त';
    }

    // Windows
    const windows: AuspiciousWindow[] = [];
    if (panchang.abhijitMuhurta && panchang.abhijitMuhurta !== 'None (Wednesday)') {
      const parts = panchang.abhijitMuhurta.split(' - ');
      if (parts.length === 2) {
        windows.push({
          startTime: parts[0].trim(),
          endTime: parts[1].trim(),
          muhurtaType: 'Abhijit Muhurta (Vijay Kal)',
          quality: 'Excellent',
        });
      }
    }

    windows.push({
      startTime: '08:30',
      endTime: '10:00',
      muhurtaType: 'Shubh Choghadiya Window',
      quality: score >= 65 ? 'Good' : 'Fair',
    });
    windows.push({
      startTime: '14:00',
      endTime: '15:30',
      muhurtaType: 'Amrit Choghadiya Window',
      quality: score >= 75 ? 'Excellent' : 'Good',
    });

    results.push({
      date: dateStr,
      dayOfWeek: dayName,
      tithiName: panchang.tithi.name,
      tithiPaksha: panchang.tithi.paksha,
      nakshatraName: panchang.nakshatra.name,
      yogaName: panchang.yoga.name,
      score,
      verdict,
      verdictHi,
      rahuKalam: panchang.rahuKalam,
      abhijitMuhurta: panchang.abhijitMuhurta,
      windows,
      strengthsEn,
      strengthsHi,
      cautionsEn,
      cautionsHi,
    });
  }

  // Best dates sorted by score descending
  const bestDates = [...results].filter(r => r.score >= 65).sort((a, b) => b.score - a.score);

  const endDate = new Date(startD.getTime() + (daysToScan - 1) * 86_400_000).toISOString().slice(0, 10);

  return {
    purpose: query.purpose,
    purposeLabelEn: meta.labelEn,
    purposeLabelHi: meta.labelHi,
    startDate: query.startDate,
    endDate,
    scannedDays: daysToScan,
    bestDates,
    allResults: results,
  };
}
