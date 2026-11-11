import { formatDateDmy } from '../time';
import type { ChartData } from '../types';

export const PARAMAYUS_LIMIT_YEARS = 120;

const MS_PER_TROPICAL_YEAR = 365.2425 * 86_400_000;

export interface ParamayusStatus {
  exceeded: boolean;
  status: 'ACTIVE' | 'DEAD_OR_AMAR';
  birthDate: string;
  birthYear: number;
  completed120Year: number;
  ageYears: number;
  reason: 'BIRTH_OVER_120' | 'TARGET_OVER_120' | 'WITHIN_LIMIT';
  titleEn: string;
  titleHi: string;
  messageEn: string;
  messageHi: string;
  noteEn: string;
  noteHi: string;
}

function parseDateMiddayMs(dateStr: string): number {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(dateStr.trim());
  if (!m) return Number.NaN;
  const yr = parseInt(m[1], 10);
  const mo = parseInt(m[2], 10) - 1;
  const dy = parseInt(m[3], 10);
  return Date.UTC(yr, mo, dy, 12, 0, 0);
}

/**
 * Enforces the Vedic 120-year Paramayus threshold across all prediction engines and views.
 * Any native whose birth exceeds 120 years from the current date (or requested forecast date)
 * is classified as Departed (Dead / Divangat) or Immortal (Amar / Chiranjeevi), halting predictions.
 */
export function evaluateParamayusStatus(
  chart: ChartData,
  targetDate?: string,
  nowDate: Date = new Date()
): ParamayusStatus {
  const fallbackBirthMs = parseDateMiddayMs(chart.input.date);
  const birthMs = Number.isFinite(chart.utcMs)
    ? chart.utcMs
    : Number.isFinite(fallbackBirthMs)
      ? fallbackBirthMs
      : nowDate.getTime();

  const birthYear = parseInt(chart.input.date.slice(0, 4), 10) || new Date(birthMs).getUTCFullYear();
  const completed120Year = birthYear + PARAMAYUS_LIMIT_YEARS;

  const nowMs = nowDate.getTime();
  const ageAtNow = (nowMs - birthMs) / MS_PER_TROPICAL_YEAR;

  const targetMs = targetDate ? parseDateMiddayMs(targetDate) : Number.NaN;
  const ageAtTarget = Number.isFinite(targetMs)
    ? (targetMs - birthMs) / MS_PER_TROPICAL_YEAR
    : ageAtNow;

  const birthExceeded = ageAtNow > PARAMAYUS_LIMIT_YEARS;
  const targetExceeded = !birthExceeded && ageAtTarget > PARAMAYUS_LIMIT_YEARS;
  const exceeded = birthExceeded || targetExceeded;

  const displayAge = Math.max(0, Math.round(Math.max(ageAtNow, ageAtTarget) * 10) / 10);

  if (exceeded) {
    const reason: ParamayusStatus['reason'] = birthExceeded ? 'BIRTH_OVER_120' : 'TARGET_OVER_120';
    const birthDmy = formatDateDmy(chart.input.date);
    const nowDmy = formatDateDmy(nowDate.toISOString().slice(0, 10));
    const targetDmy = targetDate ? formatDateDmy(targetDate) : '';
    return {
      exceeded: true,
      status: 'DEAD_OR_AMAR',
      birthDate: birthDmy,
      birthYear,
      completed120Year,
      ageYears: displayAge,
      reason,
      titleEn: `Paramayus 120-Year Limit Surpassed (${displayAge} Yrs) — Considered Departed (Dead) or Amar`,
      titleHi: `परमायु 120 वर्ष सीमा पूर्ण (${displayAge} वर्ष) — दिवंगत (मृत) अथवा अमर / चिरंजीवी श्रेणी`,
      messageEn: birthExceeded
        ? `${chart.input.name} (born ${birthDmy}) has surpassed 120 years (${displayAge} yrs as of ${nowDmy}; 120-yr cycle ended in ${completed120Year}). Any person past 120 years—historical figure or otherwise—is considered Departed (Dead) or Amar (Immortal), so live, past/future or event predictions are NOT made.`
        : `Selected forecast date (${targetDmy}) falls at age ${displayAge} years, past the 120-year Paramayus limit (${completed120Year}). Predictions stop at 120 years; set Forecast Date within ${birthYear}–${completed120Year}.`,
      messageHi: birthExceeded
        ? `${chart.input.name} (जन्म ${birthDmy}) की आयु वैदिक परमायु सीमा (120 वर्ष) पार कर चुकी है (${displayAge} वर्ष; 120 वर्ष का चक्र ${completed120Year} में पूर्ण हुआ)। 120 वर्ष के बाद किसी भी व्यक्ति—चाहे वे ऐतिहासिक महापुरुष हों या कोई अन्य—को दिवंगत (मृत) अथवा अमर मानकर कोई फलादेश नहीं किया जाता।`
        : `चयनित फलादेश तिथि (${targetDmy}) जन्म से ${displayAge} वर्ष बाद है, जो 120 वर्ष की परमायु सीमा (${completed120Year}) से अधिक है। कृपया ${birthYear}–${completed120Year} के मध्य की तिथि चुनें।`,
      noteEn: 'Astronomical birth positions (Lagna, Planets, D1–D60 Vargas, Ashtakavarga, Shadbala & Panchang) remain viewable; all predictions & forecasts are locked beyond 120 years.',
      noteHi: 'जन्म समय के खगोलीय मान (लग्न, ग्रह अंश, D1–D60 कुंडली, अष्टकवर्ग व पंचांग) देखे जा सकते हैं; 120 वर्ष के बाद सभी फलादेश व भविष्यवाणियाँ बंद हैं।',
    };
  }

  return {
    exceeded: false,
    status: 'ACTIVE',
    birthDate: formatDateDmy(chart.input.date),
    birthYear,
    completed120Year,
    ageYears: Math.round(Math.max(0, ageAtNow) * 10) / 10,
    reason: 'WITHIN_LIMIT',
    titleEn: `Active Paramayus Window (${Math.round(Math.max(0, ageAtNow) * 10) / 10} / 120 Yrs)`,
    titleHi: `सक्रिय परमायु अवधि (${Math.round(Math.max(0, ageAtNow) * 10) / 10} / 120 वर्ष)`,
    messageEn: `Native is within the classical 120-year human Paramayus cycle (${birthYear}–${completed120Year}).`,
    messageHi: `जातक वैदिक परमायु सीमा (120 वर्ष: ${birthYear}–${completed120Year}) के अंतर्गत सक्रिय हैं।`,
    noteEn: 'Full predictions active across 0–120 years.',
    noteHi: '0 से 120 वर्षों तक पूर्ण फलादेश सक्रिय।',
  };
}
