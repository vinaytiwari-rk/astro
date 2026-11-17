import { HINDI_NAKSHATRAS, HINDI_PLANETS, HINDI_SIGNS, NAKSHATRAS, SIGNS } from './constants';
import type { ChartData, NineGrahaId } from './types';

export interface DailyTransitScore {
  dateStr: string; // YYYY-MM-DD
  dayOfWeek: string;
  dayOfWeekHi: string;
  dayNum: number;
  monthNum: number;
  transitMoonSignIdx: number;
  transitMoonSignName: string;
  transitMoonSignHi: string;
  transitMoonHouseFromNatalMoon: number; // 1 to 12
  isChandrashtama: boolean;
  taraBalaCategory: 'Sampat' | 'Kshema' | 'Sadhana' | 'Mitra' | 'Paramamitra' | 'Janma' | 'Vipat' | 'Pratyak' | 'Vadha';
  taraBalaCategoryHi: string;
  isTaraAuspicious: boolean;
  savPointsInMoonSign: number;
  dailyScore: number; // 0 to 100
  tier: 'Top Auspicious' | 'Favorable' | 'Moderate / Mixed' | 'Caution Needed';
  tierHi: string;
  summaryNoteHi: string;
  summaryNoteEn: string;
}

export interface MonthlyHeatmap {
  monthName: string;
  monthNameHi: string;
  year: number;
  averageScore: number;
  auspiciousDaysCount: number;
  cautionDaysCount: number;
  days: DailyTransitScore[];
}

export interface TransitCalendar365Report {
  year: number;
  nativeName: string;
  natalMoonSign: string;
  natalMoonSignHi: string;
  natalNakshatra: string;
  months: MonthlyHeatmap[];
  top10AuspiciousDays: DailyTransitScore[];
  cautionDays: DailyTransitScore[];
  annualAverageScore: number;
}

const TARA_NAMES_HI: Record<string, string> = {
  Janma: 'जन्म (सामान्य)',
  Sampat: 'सम्पत् (धन व लाभ)',
  Vipat: 'विपत् (सावधानी)',
  Kshema: 'क्षेम (कल्याणकारी)',
  Pratyak: 'प्रत्यक् (बाधा)',
  Sadhana: 'साधक (सिद्धि)',
  Vadha: 'वध / नैधन (त्याज्य)',
  Mitra: 'मित्र (सुखद)',
  Paramamitra: 'परम मित्र (अति शुभ)',
};

const DOW_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DOW_HI = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];
const MONTHS_HI = ['जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'];
const MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function computeTransitCalendar365(chart: ChartData, targetYear?: number): TransitCalendar365Report {
  const currentYear = targetYear || new Date().getFullYear();
  const moon = chart.planets.find((p) => p.id === 'Moon') || chart.ascendant;
  const natalMoonSign = moon.signIndex;
  const natalNakIdx = moon.nakshatraIndex ?? Math.floor(moon.longitude / (360 / 27));

  const sav = chart.ashtakavarga?.sarva || new Array(12).fill(28);

  const allDays: DailyTransitScore[] = [];
  const startDate = new Date(currentYear, 0, 1);
  const isLeap = (currentYear % 4 === 0 && currentYear % 100 !== 0) || currentYear % 400 === 0;
  const totalDays = isLeap ? 366 : 365;

  // Approximate Mean Moon Longitude progression for 365 days
  // Moon travels ~13.176° per day (approx 1 zodiac sign every 2.25 days)
  const baseMoonLong = (moon.longitude + ((currentYear - 2026) * 365 + 15) * 13.176) % 360;

  for (let i = 0; i < totalDays; i++) {
    const curDate = new Date(startDate.getTime() + i * 86400000);
    const dateStr = curDate.toISOString().slice(0, 10);
    const dow = curDate.getDay();
    const monthIdx = curDate.getMonth();
    const dayOfMonth = curDate.getDate();

    // Approximate transit Moon position on this day
    const dayMoonLong = (baseMoonLong + i * 13.17635) % 360;
    const transitMoonSign = Math.floor(dayMoonLong / 30);
    const transitNakIdx = Math.floor(dayMoonLong / (360 / 27));

    // House from Natal Moon (1 to 12)
    const houseFromNatalMoon = ((transitMoonSign - natalMoonSign + 12) % 12) + 1;
    const isChandrashtama = houseFromNatalMoon === 8;

    // Tara Bala Calculation (count from natal nakshatra to transit moon nakshatra)
    const nakDist = ((transitNakIdx - natalNakIdx + 27) % 27) + 1;
    const taraRem = nakDist % 9; // 1 to 9 (0 is 9)
    const taraIdx = taraRem === 0 ? 9 : taraRem;

    let taraCategory: DailyTransitScore['taraBalaCategory'] = 'Janma';
    let isTaraAuspicious = true;

    if (taraIdx === 1) {
      taraCategory = 'Janma';
      isTaraAuspicious = false;
    } else if (taraIdx === 2) {
      taraCategory = 'Sampat';
      isTaraAuspicious = true;
    } else if (taraIdx === 3) {
      taraCategory = 'Vipat';
      isTaraAuspicious = false;
    } else if (taraIdx === 4) {
      taraCategory = 'Kshema';
      isTaraAuspicious = true;
    } else if (taraIdx === 5) {
      taraCategory = 'Pratyak';
      isTaraAuspicious = false;
    } else if (taraIdx === 6) {
      taraCategory = 'Sadhana';
      isTaraAuspicious = true;
    } else if (taraIdx === 7) {
      taraCategory = 'Vadha';
      isTaraAuspicious = false;
    } else if (taraIdx === 8) {
      taraCategory = 'Mitra';
      isTaraAuspicious = true;
    } else if (taraIdx === 9) {
      taraCategory = 'Paramamitra';
      isTaraAuspicious = true;
    }

    const savPoints = sav[transitMoonSign] || 28;

    // Daily Score Synthesis (0 to 100)
    let score = 50;

    // 1. House from Moon effect
    if ([1, 3, 6, 10, 11].includes(houseFromNatalMoon)) score += 20;
    else if ([4, 7, 9, 5].includes(houseFromNatalMoon)) score += 8;
    else if (houseFromNatalMoon === 8) score -= 30; // Chandrashtama penalty
    else if ([12, 2].includes(houseFromNatalMoon)) score -= 12;

    // 2. Tara Bala
    if (['Sampat', 'Kshema', 'Sadhana', 'Mitra', 'Paramamitra'].includes(taraCategory)) score += 15;
    else if (['Vipat', 'Pratyak', 'Vadha'].includes(taraCategory)) score -= 18;

    // 3. SAV Bindu Impact
    if (savPoints >= 30) score += 12;
    else if (savPoints < 25) score -= 12;

    score = Math.max(15, Math.min(98, score));

    let tier: DailyTransitScore['tier'] = 'Moderate / Mixed';
    let tierHi = 'मध्यम / सामान्य';
    if (score >= 78) {
      tier = 'Top Auspicious';
      tierHi = 'अति शुभ व फलदायी';
    } else if (score >= 60) {
      tier = 'Favorable';
      tierHi = 'शुभ व अनुकूल';
    } else if (score < 45 || isChandrashtama) {
      tier = 'Caution Needed';
      tierHi = 'सतर्कता अपेक्षित';
    }

    const noteHi = isChandrashtama
      ? 'चंद्राष्टम गोचर: मानसिक तनाव से बचें; नए अनुबंध व यात्रा टालें।'
      : score >= 75
      ? `तारा बल ${TARA_NAMES_HI[taraCategory]} व SAV ${savPoints} बिंदु: महत्त्वपूर्ण कार्यों, व्यापार व निवेश हेतु अत्यंत अनुकूल दिन।`
      : 'सामान्य दैनिक दिनचर्या व नियमित कर्म के लिए संतुलित दिवस।';

    const noteEn = isChandrashtama
      ? 'Chandrashtama transit: Avoid impulsive financial commitments and high-risk journeys.'
      : score >= 75
      ? `Auspicious Tara (${taraCategory}) & SAV ${savPoints} bindus: Highly favorable for signatures and acquisitions.`
      : 'Balanced daily rhythm for standard routine transactions.';

    allDays.push({
      dateStr,
      dayOfWeek: DOW_EN[dow],
      dayOfWeekHi: DOW_HI[dow],
      dayNum: dayOfMonth,
      monthNum: monthIdx + 1,
      transitMoonSignIdx: transitMoonSign,
      transitMoonSignName: SIGNS[transitMoonSign].name,
      transitMoonSignHi: HINDI_SIGNS[transitMoonSign],
      transitMoonHouseFromNatalMoon: houseFromNatalMoon,
      isChandrashtama,
      taraBalaCategory: taraCategory,
      taraBalaCategoryHi: TARA_NAMES_HI[taraCategory],
      isTaraAuspicious,
      savPointsInMoonSign: savPoints,
      dailyScore: score,
      tier,
      tierHi,
      summaryNoteHi: noteHi,
      summaryNoteEn: noteEn,
    });
  }

  // Monthly Grouping
  const months: MonthlyHeatmap[] = [];
  for (let m = 0; m < 12; m++) {
    const mDays = allDays.filter((d) => d.monthNum === m + 1);
    const avg = Math.round(mDays.reduce((acc, d) => acc + d.dailyScore, 0) / (mDays.length || 1));
    const ausCount = mDays.filter((d) => d.tier === 'Top Auspicious' || d.tier === 'Favorable').length;
    const cauCount = mDays.filter((d) => d.tier === 'Caution Needed').length;

    months.push({
      monthName: MONTHS_EN[m],
      monthNameHi: MONTHS_HI[m],
      year: currentYear,
      averageScore: avg,
      auspiciousDaysCount: ausCount,
      cautionDaysCount: cauCount,
      days: mDays,
    });
  }

  // Top 10 Best Days (Sorted by score descending)
  const sortedBest = [...allDays]
    .filter((d) => !d.isChandrashtama && d.isTaraAuspicious)
    .sort((a, b) => b.dailyScore - a.dailyScore)
    .slice(0, 10);

  // Caution Days
  const cautionList = allDays.filter((d) => d.tier === 'Caution Needed').slice(0, 15);

  const annualAvg = Math.round(allDays.reduce((acc, d) => acc + d.dailyScore, 0) / allDays.length);

  return {
    year: currentYear,
    nativeName: chart.input.name,
    natalMoonSign: SIGNS[natalMoonSign].name,
    natalMoonSignHi: HINDI_SIGNS[natalMoonSign],
    natalNakshatra: NAKSHATRAS[natalNakIdx]?.name || 'Ashwini',
    months,
    top10AuspiciousDays: sortedBest,
    cautionDays: cautionList,
    annualAverageScore: annualAvg,
  };
}
