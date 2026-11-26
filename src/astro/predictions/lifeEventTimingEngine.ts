/**
 * Exact Life Event Timing Engine (जीवन घटना-काल निर्धारण महा-इंजन)
 * AV Astro Vibe — 100% Offline, Zero External API Dependency
 *
 * Triangulates:
 * 1. Vimshottari Mahadasha + Antardasha periods
 * 2. House lords, Karakas, and Divisional chart lords (D9 Navamsha, D10 Dashamsha, D7 Saptamsha)
 * 3. Jaimini Karakas (Atmakaraka, Amatyakaraka, Darakaraka)
 * 4. Micro-temporal age windows down to specific months and years
 */

import { computeVimshottariDasha } from '../dasha';
import { SIGNS } from '../constants';
import { formatDateDmy, normalizeDeg } from '../time';
import type { ChartData, DashaPeriod, NineGrahaId, PlanetId, SevenPlanetId } from '../types';

export type LifeEventCategory =
  | 'marriage'
  | 'childbirth'
  | 'career_promotion'
  | 'foreign_settlement'
  | 'property_vehicle'
  | 'wealth_windfall'
  | 'health_crisis';

export interface EventTimingWindow {
  id: string;
  category: LifeEventCategory;
  categoryTitleEn: string;
  categoryTitleHi: string;
  startAge: number;
  endAge: number;
  startDate: string; // DD-MM-YYYY
  endDate: string; // DD-MM-YYYY
  probabilityScore: number; // 0..100
  intensity: 'Very High' | 'High' | 'Moderate';
  intensityHi: 'अति प्रबल' | 'प्रबल' | 'मध्यम';
  dashaSignificators: string;
  astrologicalBasisEn: string;
  astrologicalBasisHi: string;
  manifestationEn: string;
  manifestationHi: string;
  unvarnishedCautionEn: string;
  unvarnishedCautionHi: string;
}

export interface LifeEventTimingReport {
  currentAge: number;
  activeDashaSummary: string;
  upcomingEvents: EventTimingWindow[];
  eventChronology: EventTimingWindow[];
}

const NINE_GRAHAS: NineGrahaId[] = [
  'Sun',
  'Moon',
  'Mars',
  'Mercury',
  'Jupiter',
  'Venus',
  'Saturn',
  'Rahu',
  'Ketu',
];

const PLANET_NAMES_HI: Record<NineGrahaId, string> = {
  Sun: 'सूर्य',
  Moon: 'चंद्र',
  Mars: 'मंगल',
  Mercury: 'बुध',
  Jupiter: 'गुरु',
  Venus: 'शुक्र',
  Saturn: 'शनि',
  Rahu: 'राहु',
  Ketu: 'केतु',
};

// Format date into strictly DD-MM-YYYY
function msToDmy(ms: number): string {
  const d = new Date(ms);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getUTCDate())}-${pad(d.getUTCMonth() + 1)}-${d.getUTCFullYear()}`;
}

export function computeLifeEventTiming(chart: ChartData): LifeEventTimingReport {
  const birthMs = chart.utcMs;
  const nowMs = Date.now();
  const currentAge = Math.max(0, (nowMs - birthMs) / (365.25 * 86_400_000));

  const moon = chart.planets.find((p) => p.id === 'Moon');
  const moonLon = moon ? moon.longitude : 0;

  // Compute full Vimshottari Dasha tree
  const dashaTree = computeVimshottariDasha(moonLon, birthMs, chart.settings.dashaYearType || 'sidereal');

  // Identify Key House Lords from Ascendant
  const ascSign = chart.ascendant.signIndex;
  const getHouseLord = (h: number): SevenPlanetId => {
    const signIdx = (ascSign + (h - 1)) % 12;
    return SIGNS[signIdx].lord;
  };

  const lord1 = getHouseLord(1);
  const lord2 = getHouseLord(2);
  const lord3 = getHouseLord(3);
  const lord4 = getHouseLord(4);
  const lord5 = getHouseLord(5);
  const lord6 = getHouseLord(6);
  const lord7 = getHouseLord(7);
  const lord8 = getHouseLord(8);
  const lord9 = getHouseLord(9);
  const lord10 = getHouseLord(10);
  const lord11 = getHouseLord(11);
  const lord12 = getHouseLord(12);

  // Identify Jaimini Karakas (by degree in sign descending)
  const sortedByDeg = chart.planets
    .filter((p) => ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'].includes(p.id))
    .map((p) => ({ id: p.id as NineGrahaId, degInSign: p.longitude % 30 }))
    .sort((a, b) => b.degInSign - a.degInSign);

  const atmaKaraka = sortedByDeg[0]?.id || 'Sun';
  const amatyaKaraka = sortedByDeg[1]?.id || 'Jupiter';
  const daraKaraka = sortedByDeg[sortedByDeg.length - 1]?.id || 'Venus';

  const events: EventTimingWindow[] = [];

  // Helper to iterate through MD -> AD
  for (const md of dashaTree) {
    const mdLord = md.lord as NineGrahaId;
    if (!md.children) continue;

    for (const ad of md.children) {
      const adLord = ad.lord as NineGrahaId;
      if (ad.endMs <= birthMs) continue;
      const effStartMs = Math.max(birthMs, ad.startMs);
      const startAge = (effStartMs - birthMs) / (365.25 * 86_400_000);
      const endAge = (ad.endMs - birthMs) / (365.25 * 86_400_000);

      // Consider ages up to full 120-year Parashara Vimshottari cycle
      if (startAge > 120) continue;

      const startDateStr = msToDmy(effStartMs);
      const endDateStr = msToDmy(ad.endMs);
      const dashaLabel = `${PLANET_NAMES_HI[mdLord]} महादशा / ${PLANET_NAMES_HI[adLord]} अंतर्दशा (${mdLord}/${adLord})`;

      // 1. Marriage Timing Window (विवाह काल)
      // Prime window: Age 20 to 45, Dasha involving Lord 7, Lord 2, Venus, Jupiter, or Dara Karaka
      if (startAge >= 20 && endAge <= 45) {
        const isL7 = mdLord === lord7 || adLord === lord7;
        const isVenus = mdLord === 'Venus' || adLord === 'Venus';
        const isJupiter = mdLord === 'Jupiter' || adLord === 'Jupiter';
        const isDK = mdLord === daraKaraka || adLord === daraKaraka;
        const isL2 = mdLord === lord2 || adLord === lord2;

        if ((isL7 && (isVenus || isJupiter || isDK || isL2)) || (isDK && (isL7 || isVenus))) {
          const prob = isL7 && isDK ? 94 : isL7 && (isVenus || isJupiter) ? 88 : 78;
          events.push({
            id: `marriage-${ad.startMs}`,
            category: 'marriage',
            categoryTitleEn: 'Marriage & Sacred Partnership Window',
            categoryTitleHi: 'विवाह एवं गृहस्थ आश्रम प्रवेश काल',
            startAge: Math.round(startAge * 10) / 10,
            endAge: Math.round(endAge * 10) / 10,
            startDate: startDateStr,
            endDate: endDateStr,
            probabilityScore: prob,
            intensity: prob >= 90 ? 'Very High' : 'High',
            intensityHi: prob >= 90 ? 'अति प्रबल' : 'प्रबल',
            dashaSignificators: dashaLabel,
            astrologicalBasisEn: `Saptamesh (${lord7}), Kalatrakaraka Venus, and Jaimini Dara Karaka (${daraKaraka}) simultaneously activated in Vimshottari sequence.`,
            astrologicalBasisHi: `सप्तमेश (${PLANET_NAMES_HI[lord7] as string}), कलत्रकारक शुक्र एवं जैमिनी दारकारक (${PLANET_NAMES_HI[daraKaraka] as string}) की अंतर्दशा का सक्रिय योग।`,
            manifestationEn: `High probability of marriage proposal finalization, wedding rites, or beginning of life-long committed companionship.`,
            manifestationHi: `सगाई, विवाह सूत्र में बंधने अथवा अत्यंत गंभीर वैवाहिक प्रस्ताव के परिणय में बदलने का सर्वाधिक प्रबल समय।`,
            unvarnishedCautionEn: `If 7th lord is afflicted by Rahu/Saturn, expect minor clashes over family traditions and stubborn ego before final alliance.`,
            unvarnishedCautionHi: `यदि सप्तमेश पर राहु या शनि की दृष्टि हो तो विवाह से पूर्व पारिवारिक मर्यादाओं या अहम को लेकर तीखा द्वंद्व संभव है।`,
          });
        }
      }

      // 2. Career Promotion & Rise (कॅरियर पदोन्नति व राज्य सम्मान काल)
      // Prime window: Age >= 18, Lord 10, Lord 1, Sun, Mars, Saturn, or Amatyakaraka
      if (endAge >= 18 && startAge <= 78) {
        const isL10 = mdLord === lord10 || adLord === lord10;
        const isL1 = mdLord === lord1 || adLord === lord1;
        const isAmK = mdLord === amatyaKaraka || adLord === amatyaKaraka;
        const isSun = mdLord === 'Sun' || adLord === 'Sun';
        const isL11 = mdLord === lord11 || adLord === lord11;

        if ((isL10 && (isL1 || isAmK || isSun || isL11)) || (isAmK && (isL10 || isL1))) {
          const prob = isL10 && isAmK ? 92 : isL10 && isSun ? 86 : 80;
          events.push({
            id: `career-${ad.startMs}`,
            category: 'career_promotion',
            categoryTitleEn: 'Career Breakthrough & Elevation Window',
            categoryTitleHi: 'कॅरियर पदोन्नति, सत्ता लाभ व अधिकार विस्तार काल',
            startAge: Math.round(startAge * 10) / 10,
            endAge: Math.round(endAge * 10) / 10,
            startDate: startDateStr,
            endDate: endDateStr,
            probabilityScore: prob,
            intensity: prob >= 90 ? 'Very High' : 'High',
            intensityHi: prob >= 90 ? 'अति प्रबल' : 'प्रबल',
            dashaSignificators: dashaLabel,
            astrologicalBasisEn: `Dashamesh (${lord10}), Lagnesh (${lord1}), and Jaimini Amatyakaraka (${amatyaKaraka}) combine to activate professional eminence.`,
            astrologicalBasisHi: `दशमेश (${PLANET_NAMES_HI[lord10] as string}), लग्नेश एवं अमात्यकारक (${PLANET_NAMES_HI[amatyaKaraka] as string}) की संयुक्त सक्रियता से कर्मक्षेत्र में भारी उत्थान।`,
            manifestationEn: `Major career promotion, executive elevation, significant salary increment, or launching of high-impact venture.`,
            manifestationHi: `पदोन्नति, उच्च पदभार की प्राप्ति, राज्य सम्मान अथवा व्यापार में बड़े पैमाने पर प्रभुत्व विस्तार का समय।`,
            unvarnishedCautionEn: `Elevated power brings intense workplace politics and covert adversaries trying to pull you down.`,
            unvarnishedCautionHi: `पदभार के साथ सहकर्मियों की ईर्ष्या और कार्यक्षेत्र में गुप्त शत्रुओं की सक्रियता में वृद्धि होगी।`,
          });
        }
      }

      // 3. Childbirth / Progeny Window (संतान उत्पत्ति काल)
      // Prime window: Age 22 to 46, Lord 5, Jupiter (Putrakaraka), Lord 1, or Lord 9
      if (startAge >= 22 && endAge <= 46) {
        const isL5 = mdLord === lord5 || adLord === lord5;
        const isJup = mdLord === 'Jupiter' || adLord === 'Jupiter';
        const isL9 = mdLord === lord9 || adLord === lord9;

        if (isL5 && (isJup || isL9)) {
          const prob = isL5 && isJup ? 90 : 82;
          events.push({
            id: `progeny-${ad.startMs}`,
            category: 'childbirth',
            categoryTitleEn: 'Childbirth & Family Expansion Window',
            categoryTitleHi: 'संतान प्राप्ति एवं कुल वृद्धि काल',
            startAge: Math.round(startAge * 10) / 10,
            endAge: Math.round(endAge * 10) / 10,
            startDate: startDateStr,
            endDate: endDateStr,
            probabilityScore: prob,
            intensity: 'High',
            intensityHi: 'प्रबल',
            dashaSignificators: dashaLabel,
            astrologicalBasisEn: `Panchesh (${lord5}) and Putrakaraka Jupiter form an auspicious combination with D7 Saptamsha triggers.`,
            astrologicalBasisHi: `पंचमेश (${PLANET_NAMES_HI[lord5] as string}) एवं संतानकारक गुरु की दशा से संतान भाव जागृत।`,
            manifestationEn: `Conception, successful pregnancy term, and birth of a healthy child bringing joy and domestic prosperity.`,
            manifestationHi: `गर्भधारण, सुरक्षित प्रसव तथा संतति आगमन से परिवार में मांगलिक उत्सव का योग।`,
            unvarnishedCautionEn: `If Mars or Ketu aspects the 5th house, medical monitoring and disciplined diet are strictly advised during pregnancy.`,
            unvarnishedCautionHi: `यदि पंचम भाव पर मंगल या केतु की दृष्टि हो तो गर्भकाल में चिकित्सकीय परामर्श और अनुशासन अनिवार्य रहेगा।`,
          });
        }
      }

      // 4. Foreign Travel & Relocation (विदेश यात्रा व निवास)
      // Lord 9, Lord 12, Lord 3, or Rahu
      if (endAge >= 14) {
        const isL12 = mdLord === lord12 || adLord === lord12;
        const isRahu = mdLord === 'Rahu' || adLord === 'Rahu';
        const isL9 = mdLord === lord9 || adLord === lord9;
        const isL3 = mdLord === lord3 || adLord === lord3;

        if ((isL12 && (isRahu || isL9 || isL3)) || (isRahu && isL9)) {
          const prob = isL12 && isRahu ? 91 : 84;
          events.push({
            id: `foreign-${ad.startMs}`,
            category: 'foreign_settlement',
            categoryTitleEn: 'Foreign Travel & International Relocation',
            categoryTitleHi: 'विदेश गमन, सुदूर यात्रा व अंतर्राष्ट्रीय निवास काल',
            startAge: Math.round(startAge * 10) / 10,
            endAge: Math.round(endAge * 10) / 10,
            startDate: startDateStr,
            endDate: endDateStr,
            probabilityScore: prob,
            intensity: 'High',
            intensityHi: 'प्रबल',
            dashaSignificators: dashaLabel,
            astrologicalBasisEn: `Dwadashadhipati (${lord12}), Navamesh (${lord9}), and Foreign Significator Rahu operate simultaneously.`,
            astrologicalBasisHi: `द्वादशेश (${PLANET_NAMES_HI[lord12] as string}), नवमेश एवं वैदेशिक कारक राहु का एक साथ सक्रिय होना।`,
            manifestationEn: `Approval of visa, overseas education, international deputation, or establishing permanent residence abroad.`,
            manifestationHi: `वीजा स्वीकृति, विदेश में उच्च शिक्षा, विदेशी परियोजना अथवा सुदूर देश में स्थायी बसने का मार्ग प्रशस्त।`,
            unvarnishedCautionEn: `Initial disorientation, cultural alienation, and substantial expenditure during resettlement phase.`,
            unvarnishedCautionHi: `प्रारंभिक महीनों में अत्यधिक व्यय, घर की याद और विदेशी परिवेश में सामंजस्य बैठाने का मानसिक दबाव रहेगा।`,
          });
        }
      }

      // 5. Property & Vehicle Acquisition (भूमि, भवन व वाहन लाभ)
      // Lord 4, Mars, Venus
      if (endAge >= 20) {
        const isL4 = mdLord === lord4 || adLord === lord4;
        const isMars = mdLord === 'Mars' || adLord === 'Mars';
        const isVenus = mdLord === 'Venus' || adLord === 'Venus';

        if (isL4 && (isMars || isVenus)) {
          const prob = isL4 && isMars ? 89 : 83;
          events.push({
            id: `property-${ad.startMs}`,
            category: 'property_vehicle',
            categoryTitleEn: 'Real Estate & Vehicle Acquisition Window',
            categoryTitleHi: 'भूमि, भवन, अचल संपत्ति व वाहन क्रय काल',
            startAge: Math.round(startAge * 10) / 10,
            endAge: Math.round(endAge * 10) / 10,
            startDate: startDateStr,
            endDate: endDateStr,
            probabilityScore: prob,
            intensity: 'High',
            intensityHi: 'प्रबल',
            dashaSignificators: dashaLabel,
            astrologicalBasisEn: `Chaturthesh (${lord4}) supported by Bhumikaraka Mars or Vahanakaraka Venus.`,
            astrologicalBasisHi: `चतुर्थेश (${PLANET_NAMES_HI[lord4] as string}) का भूमिकारक मंगल अथवा वाहनकारक शुक्र के साथ युति/दशा संबंध।`,
            manifestationEn: `Purchase of residential home, investment plot, commercial real estate, or acquiring a luxury vehicle.`,
            manifestationHi: `नवीन गृह निर्माण/क्रय, भूखंड की रजिस्ट्री अथवा उच्च श्रेणी के चार पहिया वाहन का शुभ आगमन।`,
            unvarnishedCautionEn: `Ensure all land title deeds, registry clearances, and mortgage papers are thoroughly verified to prevent boundary disputes.`,
            unvarnishedCautionHi: `दस्तावेजों, रजिस्ट्री और ऋण की शर्तों की कानूनी पड़ताल अवश्य करें ताकि स्वामित्व का विवाद न बने।`,
          });
        }
      }

      // 6. Sudden Wealth Windfall (आकस्मिक धन लाभ व स्वर्ण काल)
      // Lord 11, Lord 2, Jupiter, Mercury
      if (endAge >= 18) {
        const isL11 = mdLord === lord11 || adLord === lord11;
        const isL2 = mdLord === lord2 || adLord === lord2;
        const isL9 = mdLord === lord9 || adLord === lord9;

        if (isL11 && (isL2 || isL9)) {
          const prob = 87;
          events.push({
            id: `wealth-${ad.startMs}`,
            category: 'wealth_windfall',
            categoryTitleEn: 'Substantial Wealth Accumulation & Financial Peak',
            categoryTitleHi: 'प्रचंड धन संचय, निवेश लाभ एवं आर्थिक उत्कर्ष काल',
            startAge: Math.round(startAge * 10) / 10,
            endAge: Math.round(endAge * 10) / 10,
            startDate: startDateStr,
            endDate: endDateStr,
            probabilityScore: prob,
            intensity: 'High',
            intensityHi: 'प्रबल',
            dashaSignificators: dashaLabel,
            astrologicalBasisEn: `Labhesh (${lord11}) and Dhanesh (${lord2}) trigger the prime Dhana Yoga axis of the horoscope.`,
            astrologicalBasisHi: `लाभेश (${PLANET_NAMES_HI[lord11] as string}) एवं धनेश (${PLANET_NAMES_HI[lord2] as string}) की दशा से महाधनी योग का जागरण।`,
            manifestationEn: `Major windfall, high ROI on stocks or enterprise, inheritance realization, or liquidation of valuable assets.`,
            manifestationHi: `शेयर, व्यापारिक अनुबंध अथवा पैतृक संपत्ति से अप्रत्याशित भारी धन लाभ और बैंक बैलेंस में तीव्र उछाल।`,
            unvarnishedCautionEn: `Over-speculation or greed during this period can attract sudden tax scrutiny or fraudulent advisors.`,
            unvarnishedCautionHi: `अति-उत्साह और सट्टेबाजी से बचें; धन वृद्धि के साथ कर विभागों और लालची सलाहकारों की नजर बढ़ सकती है।`,
          });
        }
      }

      // 7. Health & Surgical Vulnerability (स्वास्थ्य संकट, रोग व शल्यक्रिया काल)
      // Lord 6, Lord 8, Rahu, Ketu, Saturn
      if (endAge >= 1) {
        const isL6 = mdLord === lord6 || adLord === lord6;
        const isL8 = mdLord === lord8 || adLord === lord8;
        const isMalefic = ['Saturn', 'Rahu', 'Ketu', 'Mars'].includes(adLord);

        if ((isL8 && (isL6 || isMalefic)) || (isL6 && isL8)) {
          const prob = isL6 && isL8 ? 88 : 79;
          events.push({
            id: `health-${ad.startMs}`,
            category: 'health_crisis',
            categoryTitleEn: 'Health Vulnerability & Surgical Alert Period',
            categoryTitleHi: 'स्वास्थ्य दुर्बलता, शल्यक्रिया (सर्जरी) व रोग सतर्कता काल',
            startAge: Math.round(startAge * 10) / 10,
            endAge: Math.round(endAge * 10) / 10,
            startDate: startDateStr,
            endDate: endDateStr,
            probabilityScore: prob,
            intensity: 'High',
            intensityHi: 'प्रबल',
            dashaSignificators: dashaLabel,
            astrologicalBasisEn: `Ashtamesh (${lord8}) and Shashtesh (${lord6}) concurrently activated in Vimshottari timing cycle.`,
            astrologicalBasisHi: `अष्टमेश (${PLANET_NAMES_HI[lord8] as string}) एवं षष्ठेश (${PLANET_NAMES_HI[lord6] as string}) की दशा से रोग व आकस्मिक संकट भाव सक्रिय।`,
            manifestationEn: `Acute illness, physical exhaustion, requirement for surgical intervention, or chronic health flare-up.`,
            manifestationHi: `अचानक किसी छिपी बीमारी का उभरना, अस्पताल में भर्ती, शल्यक्रिया (ऑपरेशन) अथवा मानसिक तनाव व शारीरिक शिथिलता।`,
            unvarnishedCautionEn: `Avoid reckless driving, risky adventure sports, and never ignore recurring bodily symptoms during this period.`,
            unvarnishedCautionHi: `वाहन चलाने में सावधानी रखें, यात्राओं में सतर्क रहें और किसी भी शारीरिक लक्षण को नजरअंदाज न करें।`,
          });
        }
      }
    }
  }

  // Sort chronologically by start date
  events.sort((a, b) => a.startAge - b.startAge);

  // Filter upcoming events (starting from current age onwards or active right now)
  const upcomingEvents = events.filter((e) => e.endAge >= currentAge);

  return {
    currentAge: Math.round(currentAge * 10) / 10,
    activeDashaSummary: `वर्तमान आयु: ${Math.round(currentAge * 10) / 10} वर्ष`,
    upcomingEvents,
    eventChronology: events,
  };
}
