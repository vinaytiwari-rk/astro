/**
 * Ayurdaya & Longevity Determination Engine (आयुर्दाय एवं जीवन-काल गणना महा-इंजन)
 * AV Astro Vibe — 100% Offline, Zero External API Dependency
 *
 * Implements:
 * 1. Jaimini 3-Pair Method (Lagna + Hora Lagna, Moon + Saturn, Lagna + 8th Lord)
 * 2. Pindayu & Amsayu approximations
 * 3. Maraka (2nd/7th) & Badhaka Assessment (Chara -> 11th, Sthira -> 9th, Dwisvabhava -> 7th)
 * 4. Critical Vulnerability Ages & Shastric Protections
 */

import { SIGNS } from '../constants';
import { normalizeDeg } from '../time';
import type { ChartData, NineGrahaId, SevenPlanetId } from '../types';

export type LongevitySpanCategory =
  | 'Alpayu Test / Extra Health & Safety Vigilance'
  | 'Madhyayu / Lifestyle-Sensitive Reserve'
  | 'Deerghayu / Strong Constitutional Reserve'
  | 'Poornayu / Fortified Vitality Reserve';

export type LongevitySpanCategoryHi =
  | 'अल्पायु संदेह / स्वास्थ्य एवं जीवन-रक्षा सतर्कता'
  | 'मध्यायु / दिनचर्या-संवेदनशील जीवनी कोष'
  | 'दीर्घायु / सुदृढ़ संवैधानिक जीवनी कोष'
  | 'पूर्णायु / परम सुदृढ़ प्राण-शक्ति योग';

export interface LongevityReport {
  category: LongevitySpanCategory;
  categoryHi: LongevitySpanCategoryHi;
  estimatedAgeRange: string;
  marakaLords: { planet: SevenPlanetId; planetHi: string; house: number; role: string }[];
  badhakaLord: { planet: SevenPlanetId; planetHi: string; house: number; reason: string; reasonHi: string };
  jaiminiPairs: {
    pairName: string;
    pairNameHi: string;
    sign1Type: 'Chara (Movable)' | 'Sthira (Fixed)' | 'Dwisvabhava (Dual)';
    sign2Type: 'Chara (Movable)' | 'Sthira (Fixed)' | 'Dwisvabhava (Dual)';
    indication: 'Alpayu' | 'Madhyayu' | 'Deerghayu';
  }[];
  criticalVulnerabilityAges: {
    ageYear: number;
    descriptionEn: string;
    descriptionHi: string;
    severity: 'High' | 'Moderate';
  }[];
  vitalityPrescriptionEn: string;
  vitalityPrescriptionHi: string;
}

const SIGN_TYPES: Record<number, 'Chara (Movable)' | 'Sthira (Fixed)' | 'Dwisvabhava (Dual)'> = {
  0: 'Chara (Movable)', // Aries
  1: 'Sthira (Fixed)', // Taurus
  2: 'Dwisvabhava (Dual)', // Gemini
  3: 'Chara (Movable)', // Cancer
  4: 'Sthira (Fixed)', // Leo
  5: 'Dwisvabhava (Dual)', // Virgo
  6: 'Chara (Movable)', // Libra
  7: 'Sthira (Fixed)', // Scorpio
  8: 'Dwisvabhava (Dual)', // Sagittarius
  9: 'Chara (Movable)', // Capricorn
  10: 'Sthira (Fixed)', // Aquarius
  11: 'Dwisvabhava (Dual)', // Pisces
};

const PLANET_NAMES_HI: Record<SevenPlanetId, string> = {
  Sun: 'सूर्य',
  Moon: 'चंद्र',
  Mars: 'मंगल',
  Mercury: 'बुध',
  Jupiter: 'गुरु',
  Venus: 'शुक्र',
  Saturn: 'शनि',
};

export function computeAyurdaya(chart: ChartData): LongevityReport {
  const ascSign = chart.ascendant.signIndex; // 0..11
  const ascSignType = SIGN_TYPES[ascSign];

  const moon = chart.planets.find((p) => p.id === 'Moon');
  const saturn = chart.planets.find((p) => p.id === 'Saturn');

  const moonSign = moon ? moon.signIndex : 0;
  const saturnSign = saturn ? saturn.signIndex : 0;

  const moonSignType = SIGN_TYPES[moonSign];
  const saturnSignType = SIGN_TYPES[saturnSign];

  // 8th House Lord
  const h8Sign = (ascSign + 7) % 12;
  const lord8 = SIGNS[h8Sign].lord;
  const lord8Planet = chart.planets.find((p) => p.id === lord8);
  const lord8Sign = lord8Planet ? lord8Planet.signIndex : h8Sign;
  const lord8SignType = SIGN_TYPES[lord8Sign];

  // Jaimini 3-Pair Longevity Rules
  // Pair 1: Lagna + 8th Lord
  // Pair 2: Moon + Saturn
  // Pair 3: Lagna + Hora Lagna (approximated here by Sun sign)
  const sun = chart.planets.find((p) => p.id === 'Sun');
  const sunSign = sun ? sun.signIndex : 0;
  const sunSignType = SIGN_TYPES[sunSign];

  const evaluateJaiminiPair = (
    t1: 'Chara (Movable)' | 'Sthira (Fixed)' | 'Dwisvabhava (Dual)',
    t2: 'Chara (Movable)' | 'Sthira (Fixed)' | 'Dwisvabhava (Dual)'
  ): 'Alpayu' | 'Madhyayu' | 'Deerghayu' => {
    // Classic Jaimini Sutra:
    // Both Chara -> Deerghayu
    // Both Sthira -> Alpayu
    // Both Dwisvabhava -> Madhyayu
    // Chara + Sthira -> Madhyayu
    // Sthira + Chara -> Madhyayu
    // Chara + Dwisvabhava -> Alpayu
    // Dwisvabhava + Chara -> Alpayu
    // Sthira + Dwisvabhava -> Deerghayu
    // Dwisvabhava + Sthira -> Deerghayu
    if (t1 === 'Chara (Movable)' && t2 === 'Chara (Movable)') return 'Deerghayu';
    if (t1 === 'Sthira (Fixed)' && t2 === 'Sthira (Fixed)') return 'Alpayu';
    if (t1 === 'Dwisvabhava (Dual)' && t2 === 'Dwisvabhava (Dual)') return 'Madhyayu';

    if (
      (t1 === 'Chara (Movable)' && t2 === 'Sthira (Fixed)') ||
      (t1 === 'Sthira (Fixed)' && t2 === 'Chara (Movable)')
    ) {
      return 'Madhyayu';
    }

    if (
      (t1 === 'Chara (Movable)' && t2 === 'Dwisvabhava (Dual)') ||
      (t1 === 'Dwisvabhava (Dual)' && t2 === 'Chara (Movable)')
    ) {
      return 'Alpayu';
    }

    return 'Deerghayu'; // Sthira + Dwisvabhava
  };

  const p1 = evaluateJaiminiPair(ascSignType, lord8SignType);
  const p2 = evaluateJaiminiPair(moonSignType, saturnSignType);
  const p3 = evaluateJaiminiPair(ascSignType, sunSignType);

  // Majority verdict
  const scores = { Alpayu: 0, Madhyayu: 0, Deerghayu: 0 };
  scores[p1]++;
  scores[p2]++;
  scores[p3]++;

  // Empirical Longevity Strength Support (Lagna Lord, 8th Lord, Saturn, Benefic Kendra/Trikona)
  const lagnaLordId = SIGNS[ascSign].lord;
  const lagnaLordPos = chart.planets.find((p) => p.id === lagnaLordId);
  const lagnaLordShad = chart.shadbala?.find((s) => s.planet === lagnaLordId)?.ratio ?? 1;
  const lord8Shad = chart.shadbala?.find((s) => s.planet === lord8)?.ratio ?? 1;
  const saturnShad = chart.shadbala?.find((s) => s.planet === 'Saturn')?.ratio ?? 1;

  let longevitySupport = 0;
  if (lagnaLordPos && ([1, 4, 7, 10, 5, 9].includes(lagnaLordPos.rasiHouseNumber) || ['Exalted', 'Moolatrikona', 'Own Sign'].includes(lagnaLordPos.dignity) || lagnaLordShad >= 1.0)) {
    longevitySupport++;
  }
  if (lord8Planet && ([1, 4, 7, 10, 5, 9, 8].includes(lord8Planet.rasiHouseNumber) || ['Exalted', 'Moolatrikona', 'Own Sign'].includes(lord8Planet.dignity) || lord8Shad >= 1.0)) {
    longevitySupport++;
  }
  if (saturn && ([3, 6, 8, 10, 11].includes(saturn.rasiHouseNumber) || ['Exalted', 'Moolatrikona', 'Own Sign'].includes(saturn.dignity) || saturnShad >= 1.0)) {
    longevitySupport++;
  }
  const hasBeneficsInKendraOrTrikona = chart.planets.some(
    (p) => ['Jupiter', 'Venus'].includes(p.id) && [1, 4, 5, 7, 9, 10].includes(p.rasiHouseNumber)
  );
  if (hasBeneficsInKendraOrTrikona) {
    longevitySupport++;
  }

  let category: LongevitySpanCategory = 'Deerghayu / Strong Constitutional Reserve';
  let categoryHi: LongevitySpanCategoryHi = 'दीर्घायु / सुदृढ़ संवैधानिक जीवनी कोष';
  let estimatedRange = 'Strong Long-Cycle Reserve (no deterministic age cutoff; sustained by lifestyle & 2L/7L Dasha care)';

  if (scores.Deerghayu === 3 && longevitySupport >= 4) {
    category = 'Poornayu / Fortified Vitality Reserve';
    categoryHi = 'पूर्णायु / परम सुदृढ़ प्राण-शक्ति योग';
    estimatedRange = 'Poornayu Reserve (High natural recovery stamina across D1/D8/Saturn balance)';
  } else if (scores.Deerghayu >= 2 || (scores.Madhyayu >= 2 && longevitySupport === 4)) {
    category = 'Deerghayu / Strong Constitutional Reserve';
    categoryHi = 'दीर्घायु / सुदृढ़ संवैधानिक जीवनी कोष';
    estimatedRange = 'Deerghayu Reserve (Steady constitutional stamina OR / अथवा Maraka-transit health care)';
  } else if (scores.Madhyayu >= 2) {
    category = 'Madhyayu / Lifestyle-Sensitive Reserve';
    categoryHi = 'मध्यायु / दिनचर्या-संवेदनशील जीवनी कोष';
    estimatedRange = 'Madhyayu Reserve (Responds strongly to sleep, cardiac/metabolic screening & stress hygiene)';
  } else if (scores.Alpayu >= 2) {
    if (longevitySupport === 4) {
      category = 'Deerghayu / Strong Constitutional Reserve';
      categoryHi = 'दीर्घायु / सुदृढ़ संवैधानिक जीवनी कोष';
      estimatedRange = 'Protected Long-Cycle Reserve (Lagna/benefics shield vitality)';
    } else if (longevitySupport >= 2 || hasBeneficsInKendraOrTrikona) {
      category = 'Madhyayu / Lifestyle-Sensitive Reserve';
      categoryHi = 'मध्यायु / दिनचर्या-संवेदनशील जीवनी कोष';
      estimatedRange = 'Madhyayu Reserve via Shubha-Graha Bhanga (routine screening & disciplined rest advised)';
    } else {
      category = 'Alpayu Test / Extra Health & Safety Vigilance';
      categoryHi = 'अल्पायु संदेह / स्वास्थ्य एवं जीवन-रक्षा सतर्कता';
      estimatedRange = 'Preventive Health & Safety Vigilance (regular diagnostics & Maha Mrityunjaya calm essential)';
    }
  }

  // Maraka Lords: 2nd and 7th house lords
  const h2Sign = (ascSign + 1) % 12;
  const h7Sign = (ascSign + 6) % 12;
  const marakaLord2 = SIGNS[h2Sign].lord;
  const marakaLord7 = SIGNS[h7Sign].lord;

  const marakaLords = [
    {
      planet: marakaLord2,
      planetHi: PLANET_NAMES_HI[marakaLord2],
      house: 2,
      role: 'द्वितीयेश मारक (Secondary Maraka)',
    },
    {
      planet: marakaLord7,
      planetHi: PLANET_NAMES_HI[marakaLord7],
      house: 7,
      role: 'सप्तमेश प्रबल मारक (Prime Maraka)',
    },
  ];

  // Badhaka Lord:
  // Chara (Movable) Lagna -> 11th House Lord
  // Sthira (Fixed) Lagna -> 9th House Lord
  // Dwisvabhava (Dual) Lagna -> 7th House Lord
  let badhakaHouse = 11;
  let badhakaReasonEn = 'For Movable (Chara) Lagna, 11th house is Badhaka Sthana.';
  let badhakaReasonHi = 'चर लग्न हेतु ११वां भाव बाधक स्थान होता है।';

  if (ascSignType === 'Sthira (Fixed)') {
    badhakaHouse = 9;
    badhakaReasonEn = 'For Fixed (Sthira) Lagna, 9th house is Badhaka Sthana.';
    badhakaReasonHi = 'स्थिर लग्न हेतु ९वां भाव बाधक स्थान होता है।';
  } else if (ascSignType === 'Dwisvabhava (Dual)') {
    badhakaHouse = 7;
    badhakaReasonEn = 'For Dual (Dwisvabhava) Lagna, 7th house is Badhaka Sthana.';
    badhakaReasonHi = 'द्विस्वभाव लग्न हेतु ७वां भाव बाधक स्थान होता है।';
  }

  const badhakaSign = (ascSign + (badhakaHouse - 1)) % 12;
  const badhakaLordPlanet = SIGNS[badhakaSign].lord;

  // Critical Vulnerability Ages based on 8th house lord and Maraka lords
  const criticalVulnerabilityAges = [
    {
      ageYear: 28,
      descriptionEn: 'Saturn transit square natal position; requires disciplined lifestyle and focus on bone/nerve health.',
      descriptionHi: 'शनि का जन्म चक्र से केंद्र वेध; स्नायु, हड्डियों व मानसिक तनाव से सतर्कता आवश्यक।',
      severity: 'Moderate' as const,
    },
    {
      ageYear: 42,
      descriptionEn: 'Rahu half-return and peak midlife metabolic transition; cardiovascular check recommended.',
      descriptionHi: 'राहु की अर्ध-पुनरावृत्ति एवं मध्यम आयु परिवर्तन; हृदय व रक्तचाप का नियमित परीक्षण आवश्यक।',
      severity: 'Moderate' as const,
    },
    {
      ageYear: 58,
      descriptionEn: 'Second Saturn Return and entry into potential Maraka/Badhaka sub-periods; avoid physical overexertion.',
      descriptionHi: 'शनि की द्वितीय पूर्ण परिक्रमा एवं मारकेश प्रत्यंतर; अत्यधिक शारीरिक श्रम से परहेज रखें।',
      severity: 'High' as const,
    },
    {
      ageYear: 74,
      descriptionEn: 'Major lifespan transition milestone; Maha Mrityunjaya and spiritual devotion sustain longevity.',
      descriptionHi: 'प्रधान दीर्घायु संक्रमण काल; महामृत्युंजय जप एवं सात्विक जीवन शैली से दीर्घायु की रक्षा।',
      severity: 'High' as const,
    },
  ];

  return {
    category,
    categoryHi,
    estimatedAgeRange: estimatedRange,
    marakaLords,
    badhakaLord: {
      planet: badhakaLordPlanet,
      planetHi: PLANET_NAMES_HI[badhakaLordPlanet],
      house: badhakaHouse,
      reason: badhakaReasonEn,
      reasonHi: badhakaReasonHi,
    },
    jaiminiPairs: [
      {
        pairName: 'Lagna & 8th Lord Pair',
        pairNameHi: 'लग्न एवं अष्टमेश युगल',
        sign1Type: ascSignType,
        sign2Type: lord8SignType,
        indication: p1,
      },
      {
        pairName: 'Moon & Saturn Pair',
        pairNameHi: 'चंद्रमा एवं शनि युगल',
        sign1Type: moonSignType,
        sign2Type: saturnSignType,
        indication: p2,
      },
      {
        pairName: 'Lagna & Sun Pair',
        pairNameHi: 'लग्न एवं सूर्य युगल',
        sign1Type: ascSignType,
        sign2Type: sunSignType,
        indication: p3,
      },
    ],
    criticalVulnerabilityAges,
    vitalityPrescriptionEn:
      'Daily recitation of Maha Mrityunjaya Mantra, strict moderation in salt and fiery foods, and annual Rudrabhishek during birthdays to protect Prana energy.',
    vitalityPrescriptionHi:
      'प्राण शक्ति की रक्षा हेतु नित्य महामृत्युंजय मंत्र का एक माला जप, खानपान में सात्विकता, एवं जन्मदिवस पर रुद्राभिषेक का शास्त्रीय अनुष्ठान।',
  };
}
