import { CHALDEAN_ORDER, NAKSHATRAS, SIGNS, VARA_INFO } from './constants';
import { calculateChart } from './calculator';
import { computeSunriseSunsetForLocalDay } from './ephemeris';
import { computeAnnualHinduCalendar } from './panchangExtra';
import { formatDateDmy, formatLocalTimeFromUtc, resolveUtcFromBirth } from './time';
import type { BirthInput, CalcSettings, SevenPlanetId } from './types';

export interface DoGhatiSlot {
  index: number; // 1..30
  period: 'day' | 'night';
  nameEn: string;
  nameHi: string;
  quality: 'Auspicious' | 'Neutral' | 'Avoid';
  startTime: string;
  endTime: string;
  isAbhijit: boolean;
  noteEn: string;
  noteHi: string;
}

export interface HoraSlot {
  index: number; // 1..24
  period: 'day' | 'night';
  planet: SevenPlanetId;
  startTime: string;
  endTime: string;
  suitabilityEn: string;
  suitabilityHi: string;
}

export interface MonthlyPanchangDay {
  isoDate: string;
  dmyDate: string;
  weekday: string;
  tithi: string;
  paksha: string;
  nakshatra: string;
  yoga: string;
  sunrise: string;
  sunset: string;
  rahuKalam: string;
  highlightTagEn: string | null;
  highlightTagHi: string | null;
}

export interface SwarodayaReport {
  dateDmy: string;
  localTime: string;
  paksha: 'Shukla' | 'Krishna';
  tithiNum: number;
  activeNostril: 'Ida (Left / Chandra)' | 'Pingala (Right / Surya)';
  activeNostrilHi: 'इड़ा नाड़ी (बायाँ स्वर / चंद्र)' | 'पिंगला नाड़ी (दायाँ स्वर / सूर्य)';
  tattvaEn: string;
  tattvaHi: string;
  minuteInHour: number;
  guidanceEn: string;
  guidanceHi: string;
  bestActivitiesEn: string[];
  bestActivitiesHi: string[];
}

export interface ChineseHoroscopeReport {
  birthYear: number;
  targetYear: number;
  animalEn: string;
  animalHi: string;
  elementEn: string;
  elementHi: string;
  polarity: 'Yang' | 'Yin';
  trineAlliesEn: string;
  trineAlliesHi: string;
  targetYearAnimalEn: string;
  targetYearAffinityEn: string;
  targetYearAffinityHi: string;
  traitsEn: string;
  traitsHi: string;
}

// 15 Daytime & 15 Nighttime Classical Vedic Muhurtas (30 Do-Ghati Muhurtas per Savana Day)
const DAY_MUHURTAS: Array<{ en: string; hi: string; q: DoGhatiSlot['quality'] }> = [
  { en: 'Rudra (Roaring)', hi: 'रुद्र मुहूर्त', q: 'Avoid' },
  { en: 'Ahi (Serpent)', hi: 'आहि मुहूर्त', q: 'Avoid' },
  { en: 'Mitra (Friend)', hi: 'मित्र मुहूर्त', q: 'Auspicious' },
  { en: 'Pitri (Ancestors)', hi: 'पितृ मुहूर्त', q: 'Neutral' },
  { en: 'Vasu (Wealth)', hi: 'वसु मुहूर्त', q: 'Auspicious' },
  { en: 'Vara (Boons)', hi: 'वाराह मुहूर्त', q: 'Auspicious' },
  { en: 'Vishwadeva', hi: 'विश्वदेवा मुहूर्त', q: 'Auspicious' },
  { en: 'Abhijit / Vidhi', hi: 'अभिजित / विधि मुहूर्त', q: 'Auspicious' },
  { en: 'Satamukhi', hi: 'सतामुखी मुहूर्त', q: 'Auspicious' },
  { en: 'Puruhuta', hi: 'पुरुहूत मुहूर्त', q: 'Avoid' },
  { en: 'Vahini (Fire)', hi: 'वाहिनी मुहूर्त', q: 'Avoid' },
  { en: 'Naktankara', hi: 'नक्तनकरा मुहूर्त', q: 'Avoid' },
  { en: 'Varuna', hi: 'वरुण मुहूर्त', q: 'Auspicious' },
  { en: 'Aryama', hi: 'अर्यमा मुहूर्त', q: 'Auspicious' },
  { en: 'Bhaga (Fortune)', hi: 'भग मुहूर्त', q: 'Auspicious' },
];

const NIGHT_MUHURTAS: Array<{ en: string; hi: string; q: DoGhatiSlot['quality'] }> = [
  { en: 'Girisha (Shiva)', hi: 'गिरीश मुहूर्त', q: 'Avoid' },
  { en: 'Ajapada', hi: 'अजपाद मुहूर्त', q: 'Avoid' },
  { en: 'Ahirbudhnya', hi: 'अहिर्बुध्न्य मुहूर्त', q: 'Auspicious' },
  { en: 'Pusha (Nourish)', hi: 'पुषा मुहूर्त', q: 'Auspicious' },
  { en: 'Ashwini (Healing)', hi: 'अश्विनी मुहूर्त', q: 'Auspicious' },
  { en: 'Yama (Restraint)', hi: 'यम मुहूर्त', q: 'Avoid' },
  { en: 'Agni', hi: 'अग्नि मुहूर्त', q: 'Avoid' },
  { en: 'Vidhata (Brahma-Mid)', hi: 'विधाता मुहूर्त', q: 'Auspicious' },
  { en: 'Kanda', hi: 'कंद मुहूर्त', q: 'Auspicious' },
  { en: 'Aditi (Boundless)', hi: 'अदिति मुहूर्त', q: 'Auspicious' },
  { en: 'Jiva (Amrita)', hi: 'जीव / अमृता मुहूर्त', q: 'Auspicious' },
  { en: 'Vishnu (Sustainer)', hi: 'विष्णु मुहूर्त', q: 'Auspicious' },
  { en: 'Dyumadgadyuti', hi: 'द्युमद्गद्युति मुहूर्त', q: 'Auspicious' },
  { en: 'Brahma Muhurta', hi: 'ब्रह्म मुहूर्त (सर्वोत्तम)', q: 'Auspicious' },
  { en: 'Samudra', hi: 'समुद्र मुहूर्त', q: 'Auspicious' },
];

function getSunSpanForDate(
  dateStr: string,
  latitude: number,
  longitude: number,
  offsetMinutes: number
): { srMs: number; ssMs: number; nSrMs: number; weekday: number } {
  const [yr, mo, dy] = dateStr.split('-').map((x) => parseInt(x, 10));
  const noonUtcMs = Date.UTC(yr, mo - 1, dy, 12, 0, 0) - offsetMinutes * 60_000;
  const sunTimes = computeSunriseSunsetForLocalDay(noonUtcMs, offsetMinutes, latitude, longitude);
  const localMidnightMs = Date.UTC(yr, mo - 1, dy, 0, 0, 0) - offsetMinutes * 60_000;
  const srMs = sunTimes.vedicSunriseMs ?? sunTimes.sunriseMs ?? localMidnightMs + 6 * 3600_000;
  const ssMs = sunTimes.vedicSunsetMs ?? sunTimes.sunsetMs ?? srMs + 12 * 3600_000;
  const nSrMs = sunTimes.nextSunriseMs ?? srMs + 24 * 3600_000;
  const weekday = new Date(srMs + offsetMinutes * 60_000).getUTCDay();
  return { srMs, ssMs, nSrMs, weekday };
}

export function computeDoGhatiMuhurta(
  dateStr: string,
  latitude: number,
  longitude: number,
  offsetMinutes: number
): DoGhatiSlot[] {
  const { srMs, ssMs, nSrMs } = getSunSpanForDate(dateStr, latitude, longitude, offsetMinutes);
  const dayLen = (ssMs - srMs) / 15;
  const nightLen = (nSrMs - ssMs) / 15;
  const slots: DoGhatiSlot[] = [];

  for (let i = 0; i < 15; i++) {
    const m = DAY_MUHURTAS[i];
    const t0 = srMs + i * dayLen;
    const t1 = t0 + dayLen;
    slots.push({
      index: i + 1,
      period: 'day',
      nameEn: m.en,
      nameHi: m.hi,
      quality: m.q,
      startTime: formatLocalTimeFromUtc(t0, offsetMinutes, false),
      endTime: formatLocalTimeFromUtc(t1, offsetMinutes, false),
      isAbhijit: i === 7,
      noteEn: i === 7 ? 'Midday Abhijit Muhurta (universal auspicious window).' : m.q === 'Auspicious' ? 'Favorable 2-Ghati slot for constructive beginnings.' : m.q === 'Neutral' ? 'Balanced routine slot.' : 'Reserve for urgent/routine tasks only.',
      noteHi: i === 7 ? 'मध्याह्न अभिजित मुहूर्त (सर्वकार्य सिद्धिदायक)।' : m.q === 'Auspicious' ? 'शुभ कार्यों के आरंभ हेतु उत्तम दो-घटी समय।' : m.q === 'Neutral' ? 'सामान्य कार्यों हेतु।' : 'नए शुभ आरंभ से बचें।',
    });
  }

  for (let i = 0; i < 15; i++) {
    const m = NIGHT_MUHURTAS[i];
    const t0 = ssMs + i * nightLen;
    const t1 = t0 + nightLen;
    slots.push({
      index: 16 + i,
      period: 'night',
      nameEn: m.en,
      nameHi: m.hi,
      quality: m.q,
      startTime: formatLocalTimeFromUtc(t0, offsetMinutes, false),
      endTime: formatLocalTimeFromUtc(t1, offsetMinutes, false),
      isAbhijit: false,
      noteEn: i === 13 ? 'Sacred pre-dawn Brahma Muhurta — peak for mantra, study & healing.' : m.q === 'Auspicious' ? 'Peaceful/supportive nocturnal window.' : 'Rest or quiet meditation recommended.',
      noteHi: i === 13 ? 'प्रातः ब्रह्म मुहूर्त — ध्यान, साधना व विद्याध्ययन हेतु सर्वश्रेष्ठ।' : m.q === 'Auspicious' ? 'अनुकूल रात्रि मुहूर्त।' : 'विश्राम व शांत स्मरण उपयुक्त।',
    });
  }

  return slots;
}

const HORA_PURPOSE: Record<SevenPlanetId, { en: string; hi: string }> = {
  Sun: { en: 'Govt meetings, leadership, vitality & bold applications', hi: 'राजकीय कार्य, अधिकारी भेंट व नेतृत्व' },
  Moon: { en: 'Travel, domestic care, gardening, silver/liquids & peace', hi: 'यात्रा, गृह कार्य, तरल पदार्थ व मन शांति' },
  Mars: { en: 'Sports, property, legal assertiveness, land & surgery prep', hi: 'भूमि-भवन, साहसिक कार्य व विवाद निवारण' },
  Mercury: { en: 'Accounting, study, agreements, coding, writing & trade', hi: 'व्यापार, लेखा, अध्ययन, अनुबंध व लेखन' },
  Jupiter: { en: 'Education, finance, temples, initiation, marriage talks', hi: 'शिक्षा, वित्त, धर्म कार्य व शुभ संस्कार' },
  Venus: { en: 'Arts, jewelry, apparel, courtship, hospitality & design', hi: 'कला, वस्त्र-आभूषण, विवाह वार्ता व उत्सव' },
  Saturn: { en: 'Construction, mining, long-term vows & heavy discipline', hi: 'निर्माण, मशीनरी व दीर्घकालीन श्रम कार्य' },
};

export function compute24HourHoraTable(
  dateStr: string,
  latitude: number,
  longitude: number,
  offsetMinutes: number
): HoraSlot[] {
  const { srMs, ssMs, nSrMs, weekday } = getSunSpanForDate(dateStr, latitude, longitude, offsetMinutes);
  const startPlanet = VARA_INFO[weekday].lord;
  const startIdx = CHALDEAN_ORDER.indexOf(startPlanet);
  const dayLen = (ssMs - srMs) / 12;
  const nightLen = (nSrMs - ssMs) / 12;
  const slots: HoraSlot[] = [];

  for (let h = 0; h < 24; h++) {
    const isDay = h < 12;
    const planet = CHALDEAN_ORDER[(startIdx + h) % 7];
    const t0 = isDay ? srMs + h * dayLen : ssMs + (h - 12) * nightLen;
    const t1 = t0 + (isDay ? dayLen : nightLen);
    slots.push({
      index: h + 1,
      period: isDay ? 'day' : 'night',
      planet,
      startTime: formatLocalTimeFromUtc(t0, offsetMinutes, false),
      endTime: formatLocalTimeFromUtc(t1, offsetMinutes, false),
      suitabilityEn: HORA_PURPOSE[planet].en,
      suitabilityHi: HORA_PURPOSE[planet].hi,
    });
  }
  return slots;
}

export function computeMonthlyPanchang(
  year: number,
  month1to12: number,
  baseInput: BirthInput,
  settings: CalcSettings
): MonthlyPanchangDay[] {
  const daysInMonth = new Date(Date.UTC(year, month1to12, 0)).getUTCDate();
  const baseOffset = resolveUtcFromBirth(
    `${year}-${String(month1to12).padStart(2, '0')}-01`,
    '06:00:00',
    baseInput.timezone,
    baseInput.utcOffsetMinutes
  ).offsetMinutes;
  const annualEvents = computeAnnualHinduCalendar(
    year,
    settings.ayanamsa,
    baseOffset,
    baseInput.latitude,
    baseInput.longitude
  );
  const eventsByDate = new Map<string, typeof annualEvents>();
  for (const ev of annualEvents) {
    const arr = eventsByDate.get(ev.date) ?? [];
    arr.push(ev);
    eventsByDate.set(ev.date, arr);
  }

  const list: MonthlyPanchangDay[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const isoDate = `${year}-${String(month1to12).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const tzOff = resolveUtcFromBirth(
      isoDate,
      '06:00:00',
      baseInput.timezone,
      baseInput.utcOffsetMinutes
    ).offsetMinutes;
    const noonUtc = Date.UTC(year, month1to12 - 1, d, 12, 0, 0) - tzOff * 60_000;
    const sunTimes = computeSunriseSunsetForLocalDay(noonUtc, tzOff, baseInput.latitude, baseInput.longitude);
    const srMs = sunTimes.sunriseMs ?? Date.UTC(year, month1to12 - 1, d, 6, 0, 0) - tzOff * 60_000;
    // Evaluate Panchang exactly 1 minute after local Sunrise for true Udaya Tithi & Nakshatra
    const srLocalStr = formatLocalTimeFromUtc(srMs + 60_000, tzOff, true);
    const timeForSunrise = srLocalStr.length === 8 ? srLocalStr : '06:30:00';

    const c = calculateChart(
      { ...baseInput, id: `mp-${isoDate}`, name: 'Monthly Panchang', date: isoDate, time: timeForSunrise },
      settings
    );
    const p = c.panchang;
    const tNum = p.tithi.number;
    const dayEvs = eventsByDate.get(isoDate) ?? [];
    const primaryEv =
      dayEvs.find((e) => e.category === 'festival') ??
      dayEvs.find((e) => e.category === 'ekadashi') ??
      dayEvs.find((e) => e.category === 'sankranti') ??
      dayEvs[0];

    let highlightTagEn: string | null = primaryEv ? primaryEv.nameEn : null;
    let highlightTagHi: string | null = primaryEv ? primaryEv.nameHi : null;
    if (!highlightTagEn) {
      if (tNum === 13 || tNum === 28) {
        highlightTagEn = 'Pradosh';
        highlightTagHi = 'प्रदोष व्रत';
      } else if (tNum === 19 || tNum === 4) {
        highlightTagEn = 'Chaturthi';
        highlightTagHi = 'चतुर्थी';
      }
    }

    list.push({
      isoDate,
      dmyDate: formatDateDmy(isoDate),
      weekday: p.vara.name,
      tithi: `${p.tithi.name} (${p.tithi.paksha})`,
      paksha: p.tithi.paksha,
      nakshatra: NAKSHATRAS[p.nakshatra.index].name,
      yoga: p.yoga.name,
      sunrise: p.sunriseLocal,
      sunset: p.sunsetLocal,
      rahuKalam: p.rahuKalam,
      highlightTagEn,
      highlightTagHi,
    });
  }
  return list;
}

export function computeShivaSwarodaya(
  dateStr: string,
  timeStr: string,
  baseInput: BirthInput,
  settings: CalcSettings
): SwarodayaReport {
  const c = calculateChart(
    { ...baseInput, id: 'swara', name: 'Swarodaya', date: dateStr, time: timeStr },
    settings
  );
  const { srMs } = getSunSpanForDate(
    dateStr,
    baseInput.latitude,
    baseInput.longitude,
    c.offsetMinutesUsed
  );
  const tNum = c.panchang.tithi.number;
  const paksha = c.panchang.tithi.paksha;
  const pakshaDay = ((tNum - 1) % 15) + 1; // 1..15

  // Shiva Swarodaya rule: 3-day alternating blocks starting Chandra (Left) in Shukla, Surya (Right) in Krishna
  const blockIdx = Math.floor((pakshaDay - 1) / 3); // 0..4
  const sunriseIda = paksha === 'Shukla' ? blockIdx % 2 === 0 : blockIdx % 2 === 1;
  const elapsedMin = Math.max(0, (c.utcMs - srMs) / 60_000);
  const hourBlock = Math.floor(elapsedMin / 60);
  const minuteInHour = Math.round(elapsedMin % 60);
  const activeIsIda = hourBlock % 2 === 0 ? sunriseIda : !sunriseIda;

  // Classic 5 Tattvas inside 60-min Swara cycle (Vayu 8m, Agni 12m, Prithvi 20m, Jala 16m, Akasha 4m)
  let tattvaEn = 'Prithvi (Earth — Most Auspicious & Stable)';
  let tattvaHi = 'पृथ्वी तत्व (स्थिर, स्थायी व सर्वकार्य शुभ)';
  if (minuteInHour < 8) {
    tattvaEn = 'Vayu (Air — Movement & Travel)';
    tattvaHi = 'वायु तत्व (यात्रा व गतिशील कार्य)';
  } else if (minuteInHour < 20) {
    tattvaEn = 'Agni (Fire — Bold Action & Digestion)';
    tattvaHi = 'अग्नि तत्व (तीव्र कार्य, ऊर्जा व पाचन)';
  } else if (minuteInHour < 40) {
    tattvaEn = 'Prithvi (Earth — Prosperity & Foundations)';
    tattvaHi = 'पृथ्वी तत्व (स्थायित्व, भूमि व धन सिद्धि)';
  } else if (minuteInHour < 56) {
    tattvaEn = 'Jala (Water — Harmony, Gains & Healing)';
    tattvaHi = 'जल तत्व (मधुरता, लाभ व औषधि सेवा)';
  } else {
    tattvaEn = 'Akasha (Ether — Pure Meditation & Prayer)';
    tattvaHi = 'आकाश तत्व (ध्यान, साधना व मौन)';
  }

  return {
    dateDmy: formatDateDmy(dateStr),
    localTime: timeStr,
    paksha,
    tithiNum: pakshaDay,
    activeNostril: activeIsIda ? 'Ida (Left / Chandra)' : 'Pingala (Right / Surya)',
    activeNostrilHi: activeIsIda
      ? 'इड़ा नाड़ी (बायाँ स्वर / चंद्र)'
      : 'पिंगला नाड़ी (दायाँ स्वर / सूर्य)',
    tattvaEn,
    tattvaHi,
    minuteInHour,
    guidanceEn: activeIsIda
      ? 'Lunar Ida Swara supports calm, long-term foundations, treaties, study, philanthropy, healing, and gentle travel.'
      : 'Solar Pingala Swara powers exertion, commerce, debates, physical courage, meals, and urgent execution.',
    guidanceHi: activeIsIda
      ? 'चंद्र (इड़ा) स्वर में शांत, स्थायी निर्माण, विद्या, विवाह वार्ता, औषधि व शुभ आरंभ उत्तम होते हैं।'
      : 'सूर्य (पिंगला) स्वर में परिश्रम, व्यापार-सौदा, भोजन, व्यायाम व कठिन निर्णय सफल रहते हैं।',
    bestActivitiesEn: activeIsIda
      ? ['Important contracts & auspicious starts', 'Learning, counseling & healing remedies', 'Meditation & financial planning']
      : ['Workouts, digestion & physical work', 'High-energy negotiations & execution', 'Facing tough challenges'],
    bestActivitiesHi: activeIsIda
      ? ['शुभ कार्य आरंभ, अध्ययन व शांति वार्ता', 'दीर्घकालीन निवेश व निर्माण संकल्प', 'ध्यान व मंत्र जप']
      : ['कठोर परिश्रम, भोजन व पाचन', 'साहसिक निर्णय व त्वरित क्रियान्वयन', 'विवाद निवारण'],
  };
}

const CHINESE_ANIMALS: Array<{ en: string; hi: string; trineEn: string; trineHi: string; traitEn: string; traitHi: string }> = [
  { en: 'Rat', hi: 'मूषक (Rat)', trineEn: 'Dragon & Monkey', trineHi: 'ड्रैगन व वानर', traitEn: 'Resourceful, sharp-witted, adaptable & thrifty builder.', traitHi: 'बुद्धिमान, व्यवहारकुशल, दूरदर्शी व संग्रहकर्ता।' },
  { en: 'Ox', hi: 'वृषभ (Ox)', trineEn: 'Snake & Rooster', trineHi: 'सर्प व कुक्कुट', traitEn: 'Steadfast, diligent, patient & deeply dependable.', traitHi: 'परिश्रमी, धैर्यवान, विश्वसनीय व अनुशासित।' },
  { en: 'Tiger', hi: 'व्याघ्र (Tiger)', trineEn: 'Horse & Dog', trineHi: 'अश्व व श्वान', traitEn: 'Courageous, charismatic pioneer driven by ideals.', traitHi: 'साहसी, तेजस्वी, नेतृत्वप्रिय व स्वतंत्र विचारों वाले।' },
  { en: 'Rabbit', hi: 'शशक (Rabbit)', trineEn: 'Goat & Pig', trineHi: 'मेष व वराह', traitEn: 'Gracious, diplomatic, artistic & peaceful.', traitHi: 'सौम्य, कूटनीतिक, कलाप्रिय व शांतिपूर्ण।' },
  { en: 'Dragon', hi: 'नाग / ड्रैगन (Dragon)', trineEn: 'Rat & Monkey', trineHi: 'मूषक व वानर', traitEn: 'Magnetic, ambitious, visionary & energetic leader.', traitHi: 'प्रभावशाली, महत्वाकांक्षी, तेजस्वी व भाग्यशाली।' },
  { en: 'Snake', hi: 'सर्प (Snake)', trineEn: 'Ox & Rooster', trineHi: 'वृषभ व कुक्कुट', traitEn: 'Intuitive, strategic, refined & philosophical.', traitHi: 'गूढ़ चिंतक, रणनीतिकार, संयमी व सूक्ष्मदर्शी।' },
  { en: 'Horse', hi: 'अश्व (Horse)', trineEn: 'Tiger & Dog', trineHi: 'व्याघ्र व श्वान', traitEn: 'Spirited, freedom-loving, swift & energetic.', traitHi: 'ऊर्जावान, स्वतंत्र, तीव्रगामी व उत्साही।' },
  { en: 'Goat', hi: 'मेष / बकरी (Goat)', trineEn: 'Rabbit & Pig', trineHi: 'शशक व वराह', traitEn: 'Gentle, creative, compassionate & harmonious.', traitHi: 'दयालु, रचनात्मक, संवेदनशील व परिवारप्रेमी।' },
  { en: 'Monkey', hi: 'वानर (Monkey)', trineEn: 'Rat & Dragon', trineHi: 'मूषक व ड्रैगन', traitEn: 'Inventive, playful, agile problem-solver.', traitHi: 'चतुर, खोजी प्रवृत्ति, हाजिरजवाब व प्रतिभाशाली।' },
  { en: 'Rooster', hi: 'कुक्कुट (Rooster)', trineEn: 'Ox & Snake', trineHi: 'वृषभ व सर्प', traitEn: 'Observant, precise, candid & organized.', traitHi: 'सटीक, समयनिष्ठ, स्पष्टवादी व व्यवस्थित।' },
  { en: 'Dog', hi: 'श्वान (Dog)', trineEn: 'Tiger & Horse', trineHi: 'व्याघ्र व अश्व', traitEn: 'Loyal, protective, principled & honest.', traitHi: 'निष्ठावान, न्यायप्रिय, रक्षक व ईमानदार।' },
  { en: 'Pig', hi: 'वराह (Pig)', trineEn: 'Rabbit & Goat', trineHi: 'शशक व मेष', traitEn: 'Generous, warm-hearted, patient & sincere.', traitHi: 'उदार, सहृदय, संतोषी व सत्यनिष्ठ।' },
];

export function computeChineseHoroscope(birthYear: number, targetYear = 2027): ChineseHoroscopeReport {
  const animalIdx = ((birthYear - 4) % 12 + 12) % 12;
  const stemIdx = ((birthYear - 4) % 10 + 10) % 10;
  const elemsEn = ['Wood', 'Wood', 'Fire', 'Fire', 'Earth', 'Earth', 'Metal', 'Metal', 'Water', 'Water'];
  const elemsHi = ['काष्ठ (Wood)', 'काष्ठ (Wood)', 'अग्नि (Fire)', 'अग्नि (Fire)', 'पृथ्वी (Earth)', 'पृथ्वी (Earth)', 'धातु (Metal)', 'धातु (Metal)', 'जल (Water)', 'जल (Water)'];

  const tgtAnimalIdx = ((targetYear - 4) % 12 + 12) % 12;
  const animal = CHINESE_ANIMALS[animalIdx];
  const tgtAnimal = CHINESE_ANIMALS[tgtAnimalIdx];

  const diff = (tgtAnimalIdx - animalIdx + 12) % 12;
  let targetYearAffinityEn = `Balanced progression during ${targetYear} Year of the ${tgtAnimal.en}.`;
  let targetYearAffinityHi = `वर्ष ${targetYear} (${tgtAnimal.hi}) में संतुलित और स्थिर प्रगति का योग है।`;

  if (diff === 4 || diff === 8) {
    targetYearAffinityEn = `Trine Harmony in ${targetYear}! ${tgtAnimal.en} strongly uplifts your ${animal.en} ambitions, alliances & luck.`;
    targetYearAffinityHi = `वर्ष ${targetYear} में श्रेष्ठ त्रिकोण सामंजस्य! ${tgtAnimal.hi} आपके पुरुषार्थ व भाग्य को प्रबल सहयोग देगा।`;
  } else if (diff === 6) {
    targetYearAffinityEn = `Direct Clash Transformation (${targetYear}): stay flexible with career moves, travel & contracts for breakthrough rewards.`;
    targetYearAffinityHi = `वर्ष ${targetYear} में परिवर्तनकारी समसप्तक वर्ष — धैर्य व लचीलेपन से बड़े अवसर प्राप्त होंगे।`;
  } else if (diff === 0) {
    targetYearAffinityEn = `Ben Ming Nian (Your Zodiac Return Year ${targetYear}): keep humility, wear red/lucky accents & focus on steady health.`;
    targetYearAffinityHi = `स्व-राशि पुनरावृत्ति वर्ष (${targetYear}) — संयम, स्वास्थ्य ध्यान व शुभ संकल्प से रक्षा व उन्नति।`;
  }

  return {
    birthYear,
    targetYear,
    animalEn: animal.en,
    animalHi: animal.hi,
    elementEn: elemsEn[stemIdx],
    elementHi: elemsHi[stemIdx],
    polarity: stemIdx % 2 === 0 ? 'Yang' : 'Yin',
    trineAlliesEn: animal.trineEn,
    trineAlliesHi: animal.trineHi,
    targetYearAnimalEn: tgtAnimal.en,
    targetYearAffinityEn,
    targetYearAffinityHi,
    traitsEn: animal.traitEn,
    traitsHi: animal.traitHi,
  };
}
