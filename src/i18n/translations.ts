export type AppLanguage = 'en' | 'hi';

export const LANGUAGE_LABELS: Record<AppLanguage, string> = {
  en: 'English',
  hi: 'हिन्दी (Hindi)',
};

export const SIGN_NAMES_I18N: Record<AppLanguage, string[]> = {
  en: [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
  ],
  hi: [
    'मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या',
    'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुंभ', 'मीन',
  ],
};

export const SIGN_SHORT_I18N: Record<AppLanguage, string[]> = {
  en: ['Ar', 'Ta', 'Ge', 'Cn', 'Le', 'Vi', 'Li', 'Sc', 'Sg', 'Cp', 'Aq', 'Pi'],
  hi: ['मेष', 'वृष', 'मिथु', 'कर्क', 'सिंह', 'कन्या', 'तुला', 'वृश्चि', 'धनु', 'मकर', 'कुंभ', 'मीन'],
};

export const PLANET_NAMES_I18N: Record<AppLanguage, Record<string, string>> = {
  en: {
    Asc: 'Lagna', Sun: 'Sun', Moon: 'Moon', Mars: 'Mars', Mercury: 'Mercury',
    Jupiter: 'Jupiter', Venus: 'Venus', Saturn: 'Saturn', Rahu: 'Rahu', Ketu: 'Ketu',
    Uranus: 'Uranus', Neptune: 'Neptune', Pluto: 'Pluto',
  },
  hi: {
    Asc: 'लग्न', Sun: 'सूर्य', Moon: 'चंद्र', Mars: 'मंगल', Mercury: 'बुध',
    Jupiter: 'गुरु', Venus: 'शुक्र', Saturn: 'शनि', Rahu: 'राहु', Ketu: 'केतु',
    Uranus: 'अरुण', Neptune: 'वरुण', Pluto: 'यम',
  },
};

export const PLANET_SHORT_I18N: Record<AppLanguage, Record<string, string>> = {
  en: {
    Asc: 'As', Sun: 'Su', Moon: 'Mo', Mars: 'Ma', Mercury: 'Me',
    Jupiter: 'Ju', Venus: 'Ve', Saturn: 'Sa', Rahu: 'Ra', Ketu: 'Ke',
    Uranus: 'Ur', Neptune: 'Ne', Pluto: 'Pl',
    BL: 'BL', HL: 'HL', GL: 'GL', Mandi: 'Md', AL: 'AL', UL: 'UL', Muntha: 'Mu', Ref: 'Ref',
  },
  hi: {
    Asc: 'ल', Sun: 'सू', Moon: 'चं', Mars: 'मं', Mercury: 'बु',
    Jupiter: 'गु', Venus: 'शु', Saturn: 'श', Rahu: 'रा', Ketu: 'के',
    Uranus: 'अ', Neptune: 'व', Pluto: 'य',
    BL: 'भल', HL: 'होल', GL: 'घल', Mandi: 'मं', AL: 'आल', UL: 'उल', Muntha: 'मुं', Ref: 'आ',
  },
};

export const NAKSHATRA_HI: Record<string, string> = {
  Ashwini: 'अश्विनी', Bharani: 'भरणी', Krittika: 'कृत्तिका', Rohini: 'रोहिणी',
  Mrigashira: 'मृगशिरा', Ardra: 'आर्द्रा', Punarvasu: 'पुनर्वसु', Pushya: 'पुष्य',
  Ashlesha: 'अश्लेषा', Magha: 'मघा', 'Purva Phalguni': 'पूर्वा फाल्गुनी',
  'Uttara Phalguni': 'उत्तरा फाल्गुनी', Hasta: 'हस्त', Chitra: 'चित्रा',
  Swati: 'स्वाति', Vishakha: 'विशाखा', Anuradha: 'अनुराधा', Jyeshtha: 'ज्येष्ठा',
  Mula: 'मूल', 'Purva Ashadha': 'पूर्वाषाढ़ा', 'Uttara Ashadha': 'उत्तराषाढ़ा',
  Shravana: 'श्रवण', Dhanishta: 'धनिष्ठा', Shatabhisha: 'शतभिषा',
  'Purva Bhadrapada': 'पूर्वा भाद्रपद', 'Uttara Bhadrapada': 'उत्तरा भाद्रपद', Revati: 'रेवती',
};

export const TITHI_HI: Record<string, string> = {
  Pratipada: 'प्रतिपदा', Dwitiya: 'द्वितीया', Tritiya: 'तृतीया', Chaturthi: 'चतुर्थी',
  Panchami: 'पंचमी', Shashthi: 'षष्ठी', Saptami: 'सप्तमी', Ashtami: 'अष्टमी',
  Navami: 'नवमी', Dashami: 'दशमी', Ekadashi: 'एकादशी', Dwadashi: 'द्वादशी',
  Trayodashi: 'त्रयोदशी', Chaturdashi: 'चतुर्दशी', Purnima: 'पूर्णिमा', Amavasya: 'अमावस्या',
};

export const VARA_HI: Record<string, string> = {
  Sunday: 'रविवार', Monday: 'सोमवार', Tuesday: 'मंगलवार', Wednesday: 'बुधवार',
  Thursday: 'गुरुवार', Friday: 'शुक्रवार', Saturday: 'शनिवार',
  Ravivara: 'रविवार', Somavara: 'सोमवार', Mangalavara: 'मंगलवार',
  Budhavara: 'बुधवार', Guruvara: 'गुरुवार', Shukravara: 'शुक्रवार', Shanivara: 'शनिवार',
};

export const YOGA_HI: Record<string, string> = {
  Vishkumbha: 'विष्कंभ', Priti: 'प्रीति', Ayushman: 'आयुष्मान', Saubhagya: 'सौभाग्य',
  Shobhana: 'शोभन', Atiganda: 'अतिगंड', Sukarma: 'सुकर्मा', Dhriti: 'धृति',
  Shoola: 'शूल', Ganda: 'गंड', Vriddhi: 'वृद्धि', Dhruva: 'ध्रुव',
  Vyaghata: 'व्याघात', Harshana: 'हर्षण', Vajra: 'वज्र', Siddhi: 'सिद्धि',
  Vyatipata: 'व्यतीपात', Variyan: 'वरीयान', Parigha: 'परिघ', Shiva: 'शिव',
  Siddha: 'सिद्ध', Sadhya: 'साध्य', Shubha: 'शुभ', Shukla: 'शुक्ल',
  Brahma: 'ब्रह्म', Indra: 'इंद्र', Vaidhriti: 'वैधृति',
};

export const KARANA_HI: Record<string, string> = {
  Bava: 'बव', Balava: 'बालव', Kaulava: 'कौलव', Taitila: 'तैतिल',
  Gara: 'गर', Vanija: 'वणिज', 'Vishti (Bhadra)': 'विष्टि (भद्रा)',
  Shakuni: 'शकुनि', Chatushpada: 'चतुष्पद', Naga: 'नाग', Kimstughna: 'किंस्तुघ्न',
};

export const DIGNITY_HI: Record<string, string> = {
  Exalted: 'उच्च',
  Moolatrikona: 'मूलत्रिकोण',
  'Own Sign': 'स्वराशि',
  'Great Friend': 'अति मित्र',
  Friend: 'मित्र',
  Neutral: 'सम',
  Enemy: 'शत्रु',
  'Great Enemy': 'अति शत्रु',
  Debilitated: 'नीच',
  '-': '—',
  Self: 'स्वयं',
};

export const VARGA_NAME_HI: Record<string, { name: string; sig: string }> = {
  D1: { name: 'राशि कुंडली', sig: 'शरीर, सामान्य जीवन एवं भाग्य' },
  D2: { name: 'होरा कुंडली', sig: 'धन, संपत्ति एवं आजीविका' },
  D3: { name: 'द्रेष्काण', sig: 'भाई-बहन, पराक्रम एवं पहल' },
  D4: { name: 'चतुर्थांश', sig: 'घर, अचल संपत्ति एवं सुख' },
  D5: { name: 'पंचमांश', sig: 'यश, अधिकार एवं आध्यात्मिक पुण्य' },
  D6: { name: 'षष्ठांश', sig: 'स्वास्थ्य, रोग एवं शत्रु विजय' },
  D7: { name: 'सप्तांश', sig: 'संतान, रचनात्मकता एवं वंश' },
  D8: { name: 'अष्टमांश', sig: 'आयु एवं आकस्मिक परिवर्तन' },
  D9: { name: 'नवांश', sig: 'विवाह, धर्म, आंतरिक बल एवं फल' },
  D10: { name: 'दशमांश', sig: 'करियर, पद, व्यवसाय एवं प्रतिष्ठा' },
  D11: { name: 'रुद्रांश', sig: 'लाभ, सम्मान एवं प्रतिस्पर्धा' },
  D12: { name: 'द्वादशांश', sig: 'माता-पिता, कुल एवं पूर्वज' },
  D16: { name: 'षोडशांश', sig: 'वाहन, सुख-सुविधाएँ एवं आनंद' },
  D20: { name: 'विंशांश', sig: 'उपासना, भक्ति एवं आध्यात्म' },
  D24: { name: 'चतुर्विंशांश (सिद्धांश)', sig: 'उच्च शिक्षा, ज्ञान एवं विद्या' },
  D27: { name: 'सप्तविंशांश (भांश)', sig: 'शारीरिक बल एवं सहनशक्ति' },
  D30: { name: 'त्रिंशांश', sig: 'कष्ट, चरित्र एवं सूक्ष्म प्रवृत्तियाँ' },
  D40: { name: 'खवेदांश', sig: 'मातृ पक्ष एवं शुभत्व' },
  D45: { name: 'अक्षवेदांश', sig: 'पितृ पक्ष, नैतिकता एवं आचरण' },
  D60: { name: 'षष्ट्यंश', sig: 'पूर्व जन्म कर्म एवं सूक्ष्म फल' },
};

export const MISC_TERMS_HI: Record<string, string> = {
  Shukla: 'शुक्ल पक्ष',
  Krishna: 'कृष्ण पक्ष',
  Movable: 'चर',
  Fixed: 'स्थिर',
  Dual: 'द्विस्वभाव',
  Deva: 'देव गण',
  Manushya: 'मनुष्य गण',
  Rakshasa: 'राक्षस गण',
  Adi: 'आदि नाड़ी',
  Madhya: 'मध्य नाड़ी',
  Antya: 'अंत्य नाड़ी',
  Brahmin: 'ब्राह्मण',
  Kshatriya: 'क्षत्रिय',
  Vaishya: 'वैश्य',
  Shudra: 'शूद्र',
  Quadruped: 'चतुष्पद',
  Human: 'मानव',
  Aquatic: 'जलचर',
  Wild: 'वनचर',
  Insect: 'कीट',
  Good: 'शुभ / उत्तम',
  Average: 'मध्यम',
  Caution: 'सावधानी',
  Present: 'उपस्थित',
  'Mitigated (Cancelled)': 'भंग / निरस्त',
  Clear: 'दोष मुक्त',
  Strong: 'सबल',
  Balanced: 'संतुलित',
  'Needs Care': 'ध्यान अपेक्षित',
  'Attention Needed': 'ध्यान अपेक्षित',
  Running: 'वर्तमान',
  'Very Favorable': 'अत्यंत शुभ',
  Supportive: 'सहयोगी',
  'Mixed / Transformative': 'मिश्रित / परिवर्तनकारी',
  Challenging: 'चुनौतीपूर्ण',
  'Highly Auspicious': 'अत्यंत शुभ',
  Favorable: 'अनुकूल',
  'Balanced / Mixed': 'संतुलित / मिश्रित',
  'Requires Effort': 'परिश्रम अपेक्षित',
  'Strong Promise': 'प्रबल योग',
  'Moderate Promise': 'मध्यम योग',
  'Delayed / Effort Needed': 'विलंब / प्रयास अपेक्षित',
  'Strong Yes / Favorable': 'प्रबल हाँ / अत्यंत शुभ',
  'Favorable with Effort': 'प्रयास से सफलता',
  'Delayed / Conditional': 'विलंब / शर्तों सहित',
  'Unfavorable / Reconsider': 'प्रतिकूल / पुनर्विचार करें',
  'Strong & Auspicious': 'अत्यंत शुभ व बलवान',
  Auspicious: 'शुभ',
  'Obstructed (Vedha)': 'वेध युक्त (बाधित)',
  'Mixed / Kakshya Supported': 'मिश्रित / कक्ष्या समर्थित',
  Testing: 'परीक्षात्मक',
};

export function trSign(idx: number, lang: AppLanguage): string {
  return SIGN_NAMES_I18N[lang][((idx % 12) + 12) % 12] ?? SIGN_NAMES_I18N.en[0];
}

export function trSignShort(idx: number, lang: AppLanguage): string {
  return SIGN_SHORT_I18N[lang][((idx % 12) + 12) % 12] ?? SIGN_SHORT_I18N.en[0];
}

export function trPlanet(id: string, lang: AppLanguage): string {
  return PLANET_NAMES_I18N[lang][id] ?? id;
}

export function trPlanetShort(id: string, lang: AppLanguage): string {
  return PLANET_SHORT_I18N[lang][id] ?? id;
}

export function trTerm(val: string, lang: AppLanguage): string {
  if (lang === 'en') return val;
  return (
    NAKSHATRA_HI[val] ??
    TITHI_HI[val] ??
    VARA_HI[val] ??
    YOGA_HI[val] ??
    KARANA_HI[val] ??
    DIGNITY_HI[val] ??
    PLANET_NAMES_I18N.hi[val] ??
    MISC_TERMS_HI[val] ??
    val
  );
}

export function trVarga(id: string, fallbackName: string, fallbackSig: string, lang: AppLanguage) {
  if (lang === 'hi' && VARGA_NAME_HI[id]) {
    return VARGA_NAME_HI[id];
  }
  return { name: fallbackName, sig: fallbackSig };
}

export interface UiTextBundle {
  appSub: string;
  tabs: Record<string, string>;
  editNew: string;
  nowPrashna: string;
  bookletBtn: string;
  chartStyles: Record<'north' | 'south' | 'east', string>;
  ayanamsaLabels: Record<string, string>;
  houseSystems: Record<string, string>;
  common: {
    lagna: string;
    moon: string;
    ayanamsa: string;
    body: string;
    sign: string;
    degree: string;
    nakshatra: string;
    lords: string;
    house: string;
    karaka: string;
    dignity: string;
    planet: string;
    status: string;
    notes: string;
    score: string;
    max: string;
    total: string;
    date: string;
    period: string;
    forecastDate: string;
    exportReport: string;
    printPdf: string;
    close: string;
    cancel: string;
    saveApply: string;
    saveNew: string;
    done: string;
    now: string;
    jumpToDate: string;
  };
  basics: {
    showSpecialLagnas: string;
    overlaySav: string;
    rightChart: string;
    grahaLongitudes: string;
    bhavaCusps: string;
    specialLagnas: string;
    panchangHeading: string;
    vara: string;
    tithi: string;
    yoga: string;
    karana: string;
    horaLord: string;
    sunriseSunset: string;
    moonriseMoonset: string;
    dayDuration: string;
    effectiveTz: string;
    lmst: string;
    julianDay: string;
    ganaYoniNadi: string;
    left: string;
  };
  predictionsTabs: Record<string, string>;
  branchesTabs: Record<string, string>;
  dashaTabs: Record<string, string>;
  toolsTabs: Record<string, string>;
}

export const UI_TEXT: Record<AppLanguage, UiTextBundle> = {
  en: {
    appSub: 'Vedic Ephemeris & Kundali Studio',
    tabs: {
      basics: 'Basics & Charts',
      predictions: 'Predictions & Life Reading',
      branches: 'Astrology Branches',
      prashna: 'Prashna Kundali',
      vargas: 'Divisional (D1–D60)',
      dasha: 'Dashas',
      ashtakavarga: 'Ashtakavarga',
      strength: 'Shadbala & Yogas',
      transits: 'Transits · Choghadiya',
      tools: 'BTR · Avasthas · Calendar',
      astroTools: 'Numerology · Rashifal · Names · Gems',
      match: 'Match Making',
    },
    editNew: 'Edit / New',
    nowPrashna: 'Now Prashna',
    bookletBtn: 'Brihat Kundli PDF',
    chartStyles: { north: 'North Indian', south: 'South Indian', east: 'East Indian' },
    ayanamsaLabels: {
      lahiri: 'Lahiri (Chitra Paksha)',
      true_chitra: 'True Chitra (Spica = 180°)',
      kp: 'Krishnamurti (KP)',
      raman: 'B.V. Raman',
      fagan_bradley: 'Fagan-Bradley',
      yukteswar: 'Sri Yukteswar',
      tropical: 'Sayana (Tropical 0°)',
    },
    houseSystems: {
      whole_sign: 'Whole Sign',
      sripati: 'Sripati Bhava',
      equal: 'Equal House',
    },
    common: {
      lagna: 'Lagna',
      moon: 'Moon',
      ayanamsa: 'Ayanamsa',
      body: 'Body',
      sign: 'Sign',
      degree: 'Degree',
      nakshatra: 'Nakshatra (Pada)',
      lords: 'Sign / Nak / Sub',
      house: 'H',
      karaka: 'Karaka',
      dignity: 'Dignity',
      planet: 'Planet',
      status: 'Status',
      notes: 'Notes',
      score: 'Score',
      max: 'Max',
      total: 'Total',
      date: 'Date',
      period: 'Period',
      forecastDate: 'Forecast Date',
      exportReport: 'Print / PDF Report',
      printPdf: 'Print / Save as PDF',
      close: 'Close',
      cancel: 'Cancel',
      saveApply: 'Apply & Update Chart',
      saveNew: 'Save as New Profile',
      done: 'Done',
      now: 'Now',
      jumpToDate: 'Jump to Date',
    },
    basics: {
      showSpecialLagnas: 'Show Special Lagnas (AL, UL, HL, GL, Md)',
      overlaySav: 'Overlay SAV Bindus',
      rightChart: 'Right Chart:',
      grahaLongitudes: 'Graha Longitudes',
      bhavaCusps: 'Bhava Cusps',
      specialLagnas: 'Special Lagnas',
      panchangHeading: 'Panchang & Astronomical Data',
      vara: 'Vara (Weekday)',
      tithi: 'Tithi',
      yoga: 'Nitya Yoga',
      karana: 'Karana',
      horaLord: 'Planetary Hora Lord',
      sunriseSunset: 'Sunrise / Sunset',
      moonriseMoonset: 'Moonrise / Moonset',
      dayDuration: 'Day Duration (Dinamana)',
      effectiveTz: 'Effective Timezone',
      lmst: 'Sidereal Time (LMST)',
      julianDay: 'Julian Day (UT)',
      ganaYoniNadi: 'Birth Gana / Yoni / Nadi',
      left: 'left',
    },
    predictionsTabs: {
      eventsLedger: '120-Yr Events, Accidents & Life Q&A',
      pastFuture: 'Past Life & Future Becoming',
      advancedTechniques: '1000+ Empirical Rules & Systems Approach',
      bhriguNadi: 'Bhrigu Nandi Nadi (BNN)',
      bhavesha144: 'House Lords (144)',
      yuti: 'Yuti (2–7 Conjunctions)',
      bhavatBhavam: 'Bhavat Bhavam (House→House)',
      drishtiWise: 'Aspects / Drishti',
      planetInSign: 'Planets in Signs',
      planetInNakshatra: 'Planets in Nakshatras',
      planetInHouse: 'Planets in Houses',
      houseWise: 'House-wise (H1–H12)',
      degreeWise: 'Degree-wise (Ansha)',
      dashaWise: 'Dasha-wise',
      gocharWise: 'Gochar-wise (Transits)',
      divisional: 'Divisional Charts (D2–D60)',
      branchesNumerology: 'Branches & Numerology',
    },
    branchesTabs: {
      financial: 'Financial (D2/D4)',
      education: 'Education (D24)',
      career: 'Career (D10)',
      marriage: 'Marriage (D9)',
      intimacy: 'Intimacy & Sexuality',
      child: 'Child / Progeny (D7)',
      family: 'Childhood & Family (D12/D3)',
      life: 'Life & Spirituality (D20)',
      medical: 'Medical / Disease (D6)',
      other: 'Vastu · Muhurta · Western',
    },
    dashaTabs: {
      vimshottari: 'Vimshottari (120 Yr)',
      yogini: 'Yogini (36 Yr)',
      ashtottari: 'Ashtottari (108 Yr)',
      narayana: 'Narayana Dasha (Jaimini)',
      sudarshana: 'Sudarshana Chakra',
    },
    toolsTabs: {
      btr: 'Birth Time Rectification (BTR)',
      avasthas: 'Avasthas · Graha Yuddha · Upagrahas',
      muhurta: 'Muhurta Date Finder',
      calendar: '10-Year Transit & Eclipse Calendar',
    },
  },
  hi: {
    appSub: 'वैदिक पंचांग एवं कुंडली ज्योतिष सॉफ्टवेयर',
    tabs: {
      basics: 'कुंडली एवं ग्रह',
      predictions: 'फलादेश (Predictions)',
      branches: 'ज्योतिष शाखाएँ',
      prashna: 'प्रश्न कुंडली',
      vargas: 'षोडशवर्ग (D1–D60)',
      dasha: 'दशा फल',
      ashtakavarga: 'अष्टकवर्ग',
      strength: 'षड्बल एवं योग',
      transits: 'गोचर व चौघड़िया',
      tools: 'BTR · अवस्था · पंचांग',
      astroTools: 'अंक ज्योतिष · राशिफल · नाम · रत्न',
      match: 'कुंडली मिलान',
    },
    editNew: 'नया / संपादन',
    nowPrashna: 'तत्काल प्रश्न',
    bookletBtn: 'बृहत् कुंडली PDF',
    chartStyles: { north: 'उत्तर भारतीय', south: 'दक्षिण भारतीय', east: 'पूर्व भारतीय' },
    ayanamsaLabels: {
      lahiri: 'लाहिड़ी (चित्रपक्ष)',
      true_chitra: 'सत्य चित्रा (चित्रा = 180°)',
      kp: 'कृष्णमूर्ति (KP)',
      raman: 'बी.वी. रमन',
      fagan_bradley: 'फैगन-ब्रैडली',
      yukteswar: 'श्री युक्तेश्वर',
      tropical: 'सायन (0°)',
    },
    houseSystems: {
      whole_sign: 'संपूर्ण राशि (Whole Sign)',
      sripati: 'श्रीपति भाव चलित',
      equal: 'समान भाव',
    },
    common: {
      lagna: 'लग्न',
      moon: 'चंद्र',
      ayanamsa: 'अयनांश',
      body: 'ग्रह / बिंदु',
      sign: 'राशि',
      degree: 'अंश',
      nakshatra: 'नक्षत्र (चरण)',
      lords: 'राशि / नक्षत्र / उप-स्वामी',
      house: 'भाव',
      karaka: 'कारक',
      dignity: 'अवस्था / बल',
      planet: 'ग्रह',
      status: 'स्थिति',
      notes: 'विवरण',
      score: 'अंक',
      max: 'अधिकतम',
      total: 'योग',
      date: 'तिथि / दिनांक',
      period: 'अवधि',
      forecastDate: 'फलादेश दिनांक',
      exportReport: 'प्रिंट / PDF रिपोर्ट',
      printPdf: 'प्रिंट / PDF सहेजें',
      close: 'बंद करें',
      cancel: 'रद्द करें',
      saveApply: 'लागू करें व कुंडली देखें',
      saveNew: 'नए प्रोफ़ाइल में सहेजें',
      done: 'पूर्ण',
      now: 'अभी',
      jumpToDate: 'दिनांक पर जाएँ',
    },
    basics: {
      showSpecialLagnas: 'विशेष लग्न दिखाएँ (AL, UL, HL, GL, मंदी)',
      overlaySav: 'सर्वाष्टकवर्ग (SAV) बिंदु दिखाएँ',
      rightChart: 'दूसरी कुंडली:',
      grahaLongitudes: 'ग्रह स्पष्ट एवं नक्षत्र',
      bhavaCusps: 'भाव मध्य एवं संधि',
      specialLagnas: 'विशेष लग्न',
      panchangHeading: 'पंचांग एवं खगोलीय विवरण',
      vara: 'वार',
      tithi: 'तिथि',
      yoga: 'नित्य योग',
      karana: 'करण',
      horaLord: 'होरा स्वामी',
      sunriseSunset: 'सूर्योदय / सूर्यास्त',
      moonriseMoonset: 'चंद्रोदय / चंद्रास्त',
      dayDuration: 'दिनमान',
      effectiveTz: 'समय क्षेत्र (UTC)',
      lmst: 'स्थानीय नक्षत्र समय',
      julianDay: 'जूलियन दिवस',
      ganaYoniNadi: 'गण / योनि / नाड़ी',
      left: 'शेष',
    },
    predictionsTabs: {
      eventsLedger: '120 वर्ष घटनाएँ, दुर्घटना व Q&A',
      pastFuture: 'पूर्व जन्म व भविष्य गति',
      advancedTechniques: '1000+ उन्नत सूत्र (सिस्टम व व्यावहारिक फल)',
      bhriguNadi: 'भृगु नंदी नाड़ी (BNN)',
      bhavesha144: 'भावेश फल (144 योग)',
      yuti: 'युति फल (2–7 ग्रह)',
      bhavatBhavam: 'भावात् भावम् फल',
      drishtiWise: 'ग्रह दृष्टि फल (Aspects)',
      planetInSign: 'ग्रह राशि फल',
      planetInNakshatra: 'ग्रह नक्षत्र फल',
      planetInHouse: 'भावों में ग्रह फल',
      houseWise: 'द्वादश भाव फल (H1–H12)',
      degreeWise: 'अंश फल (Degree)',
      dashaWise: 'दशा फल',
      gocharWise: 'गोचर फल',
      divisional: 'वर्ग कुंडली (D2–D60)',
      branchesNumerology: 'ज्योतिष शाखाएँ व अंक ज्योतिष',
    },
    branchesTabs: {
      financial: 'धन व वित्त (D2/D4)',
      education: 'शिक्षा व विद्या (D24)',
      career: 'करियर व व्यवसाय (D10)',
      marriage: 'विवाह व दांपत्य (D9)',
      intimacy: 'काम व शयन सुख (Intimacy)',
      child: 'संतान सुख (D7)',
      family: 'बचपन, माता-पिता व परिवार (D12/D3)',
      life: 'आयु व आध्यात्म (D20)',
      medical: 'रोग व चिकित्सा ज्योतिष (D6)',
      other: 'वास्तु · मुहूर्त · पाश्चात्य तुलना',
    },
    dashaTabs: {
      vimshottari: 'विंशोत्तरी (120 वर्ष)',
      yogini: 'योगिनी (36 वर्ष)',
      ashtottari: 'अष्टोत्तरी (108 वर्ष)',
      narayana: 'नारायण दशा (जैमिनी)',
      sudarshana: 'सुदर्शन चक्र',
    },
    toolsTabs: {
      btr: 'जन्म समय संशोधन (BTR)',
      avasthas: 'ग्रह अवस्था · ग्रह युद्ध · उपग्रह',
      muhurta: 'शुभ मुहूर्त खोजें',
      calendar: '10-वर्षीय गोचर व ग्रहण पंचांग',
    },
  },
};
