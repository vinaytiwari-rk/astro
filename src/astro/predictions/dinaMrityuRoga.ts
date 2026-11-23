import { NAKSHATRAS, SIGNS } from '../constants';
import type { ChartData, NineGrahaId } from '../types';

export interface DinaMrityuRogaResult {
  hasDosha: boolean;
  isDayBirth: boolean;
  birthTimeContextEn: string;
  birthTimeContextHi: string;
  moonNakshatraName: string;
  moonPada: number;
  doshaType?: 'Dina Mrityu' | 'Dina Roga';
  doshaNameEn?: string;
  doshaNameHi?: string;
  severity: 'None' | 'Mild' | 'Moderate' | 'Acute';
  isCancelled: boolean;
  bhangaReasonEn?: string;
  bhangaReasonHi?: string;
  verdictEn: string;
  verdictHi: string;
  classicalRemedyEn: string;
  classicalRemedyHi: string;
  classicalSource: string;
}

/**
 * Classical Dina Mrityu and Dina Roga Table (For Day Birth Only)
 * References:
 * - Predictive Astrology (M.N. Kedar, Annexure I, para 11.5)
 * - Jataka Parijata & Brihat Parashara Hora Shastra (Arishta Adhyaya)
 *
 * Rule: Only day births (Sun in Houses 7 to 12) trigger these doshas.
 * For night births, this dosha does not apply.
 */
const DINA_DOSHA_TABLE: Record<string, { mrityuPada?: number; rogaPada?: number }> = {
  Bharani: { mrityuPada: 4, rogaPada: 2 },
  Mrigashira: { mrityuPada: 4 },
  Ardra: { mrityuPada: 2 },
  Ashlesha: { mrityuPada: 3, rogaPada: 1 },
  'Uttara Phalguni': { mrityuPada: 3 },
  Uttaraphalguni: { mrityuPada: 3 },
  'U. Phalguni': { mrityuPada: 3 },
  Hasta: { mrityuPada: 1 },
  Swati: { mrityuPada: 4 },
  Vishakha: { mrityuPada: 2 },
  Visakha: { mrityuPada: 2 },
  Moola: { mrityuPada: 4, rogaPada: 2 },
  Mula: { mrityuPada: 4, rogaPada: 2 },
  Shravana: { mrityuPada: 3 },
  Sravana: { mrityuPada: 3 },
  Dhanishta: { mrityuPada: 1 },
  Dhanishtha: { mrityuPada: 1 },
  'Uttara Bhadrapada': { mrityuPada: 3, rogaPada: 1 },
  Uttarabhadrapada: { mrityuPada: 3, rogaPada: 1 },
  'U. Bhadra': { mrityuPada: 3, rogaPada: 1 },
};

export function computeDinaMrityuAndRoga(chart: ChartData): DinaMrityuRogaResult {
  const sun = chart.planets.find((p) => p.id === 'Sun');
  const moon = chart.planets.find((p) => p.id === 'Moon');
  const jupiter = chart.planets.find((p) => p.id === 'Jupiter');

  // Sun in houses 7 to 12 is daytime (above horizon)
  const isDayBirth = sun ? sun.rasiHouseNumber >= 7 && sun.rasiHouseNumber <= 12 : true;

  const rawNakName = moon?.nakshatraName || NAKSHATRAS[moon?.nakshatraIndex ?? 0]?.name || 'Ashwini';
  const moonPada = moon?.pada ?? 1;

  // Night birth check (Classical rule: "For night birth no such doshas")
  if (!isDayBirth) {
    return {
      hasDosha: false,
      isDayBirth: false,
      birthTimeContextEn: 'Night Birth (Nocturnal) — Sun is situated in Houses 1 to 6 (below horizon).',
      birthTimeContextHi: 'रात्रि का जन्म — सूर्य देव प्रथम से छठे भाव में (क्षितिज के नीचे) स्थित हैं।',
      moonNakshatraName: rawNakName,
      moonPada,
      severity: 'None',
      isCancelled: true,
      verdictEn: `Born at night under ${rawNakName} Nakshatra (Pada ${moonPada}). Classical Shastras state that Dina Mrityu and Dina Roga doshas are strictly diurnal phenomena (applicable only to daytime births). Therefore, this dosha is completely inapplicable.`,
      verdictHi: `जातक का जन्म रात्रि काल में '${rawNakName}' नक्षत्र के चरण ${moonPada} में हुआ है। शास्त्रीय मतानुसार दिन-मृत्यु एवं दिन-रोग दोष केवल दिन के जन्म पर ही प्रभावी होते हैं; अतः रात्रि जन्म होने से यह दोष पूर्णतः निष्प्रभावी है।`,
      classicalRemedyEn: 'No remedial pacification required for diurnal constellations.',
      classicalRemedyHi: 'दिवा-दोष निवारण की आवश्यकता नहीं है; सामान्य दैनिक शिव आराधना पर्याप्त है।',
      classicalSource: 'Brihat Parashara Hora Shastra (Arishta Adhyaya) · Jataka Parijata',
    };
  }

  // Lookup day birth constellation
  const doshaEntry = DINA_DOSHA_TABLE[rawNakName];
  let doshaType: 'Dina Mrityu' | 'Dina Roga' | undefined;

  if (doshaEntry) {
    if (doshaEntry.mrityuPada === moonPada) {
      doshaType = 'Dina Mrityu';
    } else if (doshaEntry.rogaPada === moonPada) {
      doshaType = 'Dina Roga';
    }
  }

  if (!doshaType) {
    return {
      hasDosha: false,
      isDayBirth: true,
      birthTimeContextEn: 'Daytime Birth (Diurnal) — Sun in Houses 7 to 12.',
      birthTimeContextHi: 'दिन का जन्म — सूर्य देव सप्तम से द्वादश भाव में (क्षितिज के ऊपर) स्थित हैं।',
      moonNakshatraName: rawNakName,
      moonPada,
      severity: 'None',
      isCancelled: true,
      verdictEn: `Daytime birth under ${rawNakName} (Pada ${moonPada}) does not fall within the specific Dina Mrityu or Dina Roga vulnerability degrees. The lunar constellation is clean and supportive.`,
      verdictHi: `दिन के जन्म में '${rawNakName}' नक्षत्र का चरण ${moonPada} किसी भी दिन-मृत्यु अथवा दिन-रोग दोष परिधि में नहीं आता है। जातक का जन्म नक्षत्र स्वास्थ्य की दृष्टि से अनुकूल है।`,
      classicalRemedyEn: 'Maintain regular sattvic hygiene and standard planetary mantras.',
      classicalRemedyHi: 'नियमित सात्विक दिनचर्या व दैनिक गायत्री जप से स्वास्थ्य संवर्धन बनाए रखें।',
      classicalSource: 'Brihat Parashara Hora Shastra · Phaladeepika',
    };
  }

  // Balarishta Bhanga (दोष शमन / भंग योग) Analysis
  let isCancelled = false;
  let bhangaReasonEn = '';
  let bhangaReasonHi = '';

  // 1. Jupiter in Kendra with strong dignity
  if (
    jupiter &&
    [1, 4, 7, 10].includes(jupiter.rasiHouseNumber) &&
    ['Exalted', 'Own Sign', 'Moolatrikona', 'Friend', 'Great Friend'].includes(jupiter.dignity)
  ) {
    isCancelled = true;
    bhangaReasonEn = `Powerful Jupiter situated in Kendra (House ${jupiter.rasiHouseNumber}, ${jupiter.dignity}) destroys thousands of infant afflictions like Lord Shiva vanquishing Tripurasura.`;
    bhangaReasonHi = `केंद्र (भाव ${jupiter.rasiHouseNumber}) में स्थित बली बृहस्पति (${jupiter.dignity}) समस्त बालारिष्ट व दिवा-दोषों का पूर्ण शमन करता है।`;
  }

  // 2. Lagna lord in Kendra or Exalted
  if (!isCancelled) {
    const lagnaLordId = SIGNS[chart.ascendant.signIndex]?.lord;
    const lagnaLord = chart.planets.find((p) => p.id === lagnaLordId);
    if (lagnaLord) {
      if ([1, 4, 7, 10].includes(lagnaLord.rasiHouseNumber) || lagnaLord.dignity === 'Exalted') {
        isCancelled = true;
        bhangaReasonEn = `Lagna Lord ${lagnaLord.id} is strongly fortified in Kendra (House ${lagnaLord.rasiHouseNumber}, ${lagnaLord.dignity}), safeguarding natural physical longevity and neutralizing birth constellation vulnerability.`;
        bhangaReasonHi = `लग्नेश ${lagnaLord.id} केंद्र (भाव ${lagnaLord.rasiHouseNumber}, ${lagnaLord.dignity}) में अत्यंत बली होकर जातक की स्वाभाविक प्राण-शक्ति को सुदृढ़ करता है।`;
      }
    }
  }

  // 3. Moon aspected by natural benefics (Venus or Jupiter)
  if (!isCancelled && moon) {
    const venus = chart.planets.find((p) => p.id === 'Venus');
    const jupAspectsMoon =
      jupiter && [5, 7, 9].includes(((moon.rasiHouseNumber - jupiter.rasiHouseNumber + 12) % 12) + 1);
    const venAspectsMoon =
      venus && ((moon.rasiHouseNumber - venus.rasiHouseNumber + 12) % 12) + 1 === 7;

    if (jupAspectsMoon || venAspectsMoon) {
      isCancelled = true;
      bhangaReasonEn = `Direct auspicious drishti of natural benefic (${jupAspectsMoon ? 'Jupiter' : 'Venus'}) on the natal Moon dissolves the constellation affliction.`;
      bhangaReasonHi = `जन्म चंद्रमा पर शुभ ग्रह (${jupAspectsMoon ? 'बृहस्पति' : 'शुक्र'}) की अमृतमयी दृष्टि पड़ने से नक्षत्र दोष का शमन हो जाता है।`;
    }
  }

  const doshaNameEn = doshaType === 'Dina Mrityu' ? 'Dina Mrityu Dosha (दिन-मृत्यु दोष)' : 'Dina Roga Dosha (दिन-रोग दोष)';
  const doshaNameHi = doshaType === 'Dina Mrityu' ? 'दिन-मृत्यु दोष' : 'दिन-रोग दोष';

  let verdictEn = '';
  let verdictHi = '';
  let severity: DinaMrityuRogaResult['severity'] = 'Moderate';

  if (isCancelled) {
    severity = 'Mild';
    verdictEn = `The birth falls in daytime under ${rawNakName} (Pada ${moonPada}), which classically forms ${doshaNameEn}. However, this affliction is fully cancelled (Balarishta Bhanga) because: ${bhangaReasonEn} Longevity and physical vitality remain protected.`;
    verdictHi = `दिन के जन्म में '${rawNakName}' नक्षत्र के चरण ${moonPada} में जन्म होने से शास्त्रीय '${doshaNameHi}' बनता है। किंतु कुंडली में उपस्थित शुभ योग के कारण यह दोष पूर्णतः भंग हो चुका है: ${bhangaReasonHi} जातक की आयु व स्वास्थ्य सुरक्षित है।`;
  } else {
    severity = doshaType === 'Dina Mrityu' ? 'Acute' : 'Moderate';
    verdictEn = `The birth falls in daytime under ${rawNakName} (Pada ${moonPada}), forming classical ${doshaNameEn}. This configuration warrants mindful preventive health care, avoiding sudden dietary shocks, and reciting restorative Vedic mantras during dasha transitions.`;
    verdictHi = `दिन के जन्म में '${rawNakName}' नक्षत्र के चरण ${moonPada} में जन्म होने से शास्त्रीय '${doshaNameHi}' निर्मित होता है। शास्त्रों का निर्देश है कि जातक के स्वास्थ्य की बाल्यकाल व दशा-संधिकाल में विशेष देखरेख की जाए तथा वैदिक शांति उपाय किए जाएं।`;
  }

  const classicalRemedyEn =
    'Chant the Maha Mrityunjaya Mantra (108 times daily), perform Shiva Abhisheka with milk and bilva leaves on Mondays, and donate white food items to the needy.';
  const classicalRemedyHi =
    'प्रतिदिन १०८ बार महामृत्युंजय मंत्र का जप करें, सोमवार को शिवलिंग पर कच्चा दूध व बेलपत्र अर्पित करें तथा असहायों को दूध, चावल या सफेद वस्त्र का सात्विक दान करें।';

  return {
    hasDosha: true,
    isDayBirth: true,
    birthTimeContextEn: 'Daytime Birth (Diurnal) — Sun in Houses 7 to 12.',
    birthTimeContextHi: 'दिन का जन्म — सूर्य देव सप्तम से द्वादश भाव में (क्षितिज के ऊपर) स्थित हैं।',
    moonNakshatraName: rawNakName,
    moonPada,
    doshaType,
    doshaNameEn,
    doshaNameHi,
    severity,
    isCancelled,
    bhangaReasonEn,
    bhangaReasonHi,
    verdictEn,
    verdictHi,
    classicalRemedyEn,
    classicalRemedyHi,
    classicalSource: 'Brihat Parashara Hora Shastra (Arishta Adhyaya) · Jataka Parijata · Phaladeepika Ch. 13',
  };
}
