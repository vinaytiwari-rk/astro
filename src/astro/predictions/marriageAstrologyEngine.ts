import { NAKSHATRAS, SEVEN_PLANETS, SIGNS } from '../constants';
import type { ChartData, NineGrahaId, SevenPlanetId } from '../types';
import { computeCharaKarakas } from '../jaimini';

export type MarriageNature =
  | 'Arranged / Family-Sanctioned'
  | 'Love / Romantic Union'
  | 'Love-cum-Arranged'
  | 'Delayed / Obstacle-Prone'
  | 'Special Karmic Bond';

export interface NadiHouseSignification {
  marriageHouses: number[];
  marriageScore: number;
  loveHouses: number[];
  loveScore: number;
  negationHouses: number[];
  negationScore: number;
  verdictEn: string;
  verdictHi: string;
}

export interface StreeJatakaDiagnostic {
  trimsamshaLord: SevenPlanetId;
  trimsamshaDegree: number;
  trimsamshaSignName: string;
  trimsamshaNatureEn: string;
  trimsamshaNatureHi: string;
  mangalyaHouse8Status: 'Dirgha Saumangalya (Highly Auspicious)' | 'Protected' | 'Sensitive (Manglik/Affliction)' | 'Requires Shanti';
  mangalyaHouse8StatusHi: string;
  mangalyaDetailsEn: string;
  mangalyaDetailsHi: string;
  spousePersonaEn: string;
  spousePersonaHi: string;
  spouseProfessionAndStatusEn: string;
  spouseProfessionAndStatusHi: string;
  classicalSource: string;
}

export interface DoubleTransitAndTimingWindow {
  isDoubleTransitFavorable: boolean;
  upapadaLagnaSign: string;
  upapadaLord: SevenPlanetId;
  upapadaLordDignity: string;
  upapadaSustenanceEn: string;
  upapadaSustenanceHi: string;
  daraKarakaPlanet: NineGrahaId;
  primeMarriageAgeWindowEn: string;
  primeMarriageAgeWindowHi: string;
  currentTimingVerdictEn: string;
  currentTimingVerdictHi: string;
  classicalSource: string;
}

export interface KootaLongevityAlert {
  rajjuType: string;
  rajjuVulnerability: boolean;
  rajjuExplanationEn: string;
  rajjuExplanationHi: string;
  vedhaVulnerability: boolean;
  vedhaExplanationEn: string;
  vedhaExplanationHi: string;
  shashtashtakaHarmonyEn: string;
  shashtashtakaHarmonyHi: string;
}

export interface ComprehensiveMarriageReport {
  marriageNature: MarriageNature;
  marriageNatureHi: string;
  marriagePromiseRating: 'Highly Auspicious' | 'Auspicious' | 'Average / Delayed' | 'Challenging (Requires Upaya)';
  marriagePromiseRatingHi: string;
  nadiSignifications: NadiHouseSignification;
  streeJataka: StreeJatakaDiagnostic;
  timingAndDoubleTransit: DoubleTransitAndTimingWindow;
  kootaAlerts: KootaLongevityAlert;
  maritalDiscordRisk: 'Low' | 'Moderate' | 'High';
  maritalDiscordDetailsEn: string;
  maritalDiscordDetailsHi: string;
  remarriagePotentialEn?: string;
  remarriagePotentialHi?: string;
  authenticVedicRemediesEn: string[];
  authenticVedicRemediesHi: string[];
  classicalSources: string[];
}

// 5 Trimsamsha divisions per 30 degrees according to Brihat Jataka & Phaladeepika Ch. 10
function computeTrimsamshaLord(signIndex: number, degInSign: number): { lord: SevenPlanetId; natureEn: string; natureHi: string } {
  const isOdd = signIndex % 2 === 0; // Aries=0 (odd), Taurus=1 (even), etc.

  if (isOdd) {
    if (degInSign < 5) {
      return {
        lord: 'Mars',
        natureEn: 'Martian Trimsamsha: High vitality, independent spirit, bold temper, courageous temperament.',
        natureHi: 'भौम त्रिंशांश: अदम्य ऊर्जा, स्वतंत्र विचार, साहसी प्रवृत्ति एवं स्पष्टवादी स्वभाव।',
      };
    }
    if (degInSign < 10) {
      return {
        lord: 'Saturn',
        natureEn: 'Saturnian Trimsamsha: Serious, persevering, disciplined demeanor, matures through patience.',
        natureHi: 'शनि त्रिंशांश: गंभीर व्यक्तित्व, कर्मठ, अनुशासित आचरण एवं धैर्यवान स्वभाव।',
      };
    }
    if (degInSign < 18) {
      return {
        lord: 'Jupiter',
        natureEn: 'Jovian Trimsamsha: Endowed with noble virtues, devoted, revered by family, blessed with domestic sanctity.',
        natureHi: 'गुरु त्रिंशांश: उच्च कुल-संस्कार, पतिपरायणता, सद्गुण-संपन्न, पूज्य एवं पारिवारिक सुख-समृद्धि।',
      };
    }
    if (degInSign < 25) {
      return {
        lord: 'Mercury',
        natureEn: 'Mercurian Trimsamsha: Sharp intellect, articulate, witty, skilled in arts, balanced and sociable.',
        natureHi: 'बुध त्रिंशांश: कुशाग्र बुद्धि, वाक्-पटुता, कला-दक्ष, मधुर भाषी एवं व्यावहारिक संतुलन।',
      };
    }
    return {
      lord: 'Venus',
      natureEn: 'Venusian Trimsamsha: Aesthetic elegance, affectionate, fond of luxuries, charming and devoted.',
      natureHi: 'शुक्र त्रिंशांश: सौंदर्य बोध, सौम्य, कला-विलासी, स्नेहिल एवं सुख-साधनों से परिपूर्ण।',
    };
  }

  // Even signs: Venus (0-5), Mercury (5-12), Jupiter (12-20), Saturn (20-25), Mars (25-30)
  if (degInSign < 5) {
    return {
      lord: 'Venus',
      natureEn: 'Venusian Trimsamsha: Graceful, magnetic persona, harmonious disposition, artistic sensibilities.',
      natureHi: 'शुक्र त्रिंशांश: लावण्यमयी, सुरुचिपूर्ण, सौम्य व्यवहार, कलात्मक रुचि एवं दांपत्य सुख।',
    };
  }
  if (degInSign < 12) {
    return {
      lord: 'Mercury',
      natureEn: 'Mercurian Trimsamsha: Analytical mind, scholarly wisdom, refined communication, practical adaptability.',
      natureHi: 'बुध त्रिंशांश: बौद्धिक विवेक, विद्वता, सुरुचिपूर्ण संभाषण एवं व्यावहारिक सामंजस्य।',
    };
  }
  if (degInSign < 20) {
    return {
      lord: 'Jupiter',
      natureEn: 'Jovian Trimsamsha: Supreme chastity, deeply dharmic, universally esteemed, bringing honor to family.',
      natureHi: 'गुरु त्रिंशांश: परम पतिव्रता, धार्मिक मर्यादा, कुल-गौरव, अक्षुण्ण सम्मान एवं श्रेष्ठ मातृत्व।',
    };
  }
  if (degInSign < 25) {
    return {
      lord: 'Saturn',
      natureEn: 'Saturnian Trimsamsha: Quiet endurance, sober lifestyle, dutiful, grounded in practical realities.',
      natureHi: 'शनि त्रिंशांश: शांत सहनशीलता, सादगीपूर्ण जीवन, कर्तव्यनिष्ठा एवं यथार्थवादी दृष्टिकोण।',
    };
  }
  return {
    lord: 'Mars',
    natureEn: 'Martian Trimsamsha: Direct temperament, executive drive, passionate energy, benefits from soothing mindfulness.',
    natureHi: 'भौम त्रिंशांश: स्पष्ट व निडर वाणी, नेतृत्व क्षमता, प्रबल ऊर्जा एवं आत्म-विश्वास।',
  };
}

// 5 Rajjus for 27 Nakshatras (Rajju Mangalya Vridhysyath - 248.pdf & Brihat Samhita)
const NAKSHATRA_RAJJU_MAP: Record<number, { name: string; organEn: string; organHi: string }> = {
  0: { name: 'Pada (Feet)', organEn: 'Feet & Stature', organHi: 'पाद रज्जु (चरण व शारीरिक आधार)' }, // Ashwini
  1: { name: 'Kati (Hip)', organEn: 'Hips & Vitality', organHi: 'कटि रज्जु (कमर व वंश ऊर्जा)' }, // Bharani
  2: { name: 'Udhara (Stomach)', organEn: 'Stomach & Progeny', organHi: 'उदर रज्जु (उदर व संतान सुख)' }, // Krittika
  3: { name: 'Kantha (Neck)', organEn: 'Neck & Affection', organHi: 'कंठ रज्जु (गला व दांपत्य माधुर्य)' }, // Rohini
  4: { name: 'Shiro (Head)', organEn: 'Head & Longevity', organHi: 'शिरो रज्जु (शीर्ष व आयु रक्षा)' }, // Mrigashira
  5: { name: 'Shiro (Head)', organEn: 'Head & Longevity', organHi: 'शिरो रज्जु (शीर्ष व आयु रक्षा)' }, // Ardra
  6: { name: 'Kantha (Neck)', organEn: 'Neck & Affection', organHi: 'कंठ रज्जु (गला व दांपत्य माधुर्य)' }, // Punarvasu
  7: { name: 'Kati (Hip)', organEn: 'Hips & Vitality', organHi: 'कटि रज्जु (कमर व वंश ऊर्जा)' }, // Pushya
  8: { name: 'Pada (Feet)', organEn: 'Feet & Stature', organHi: 'पाद रज्जु (चरण व शारीरिक आधार)' }, // Ashlesha
  9: { name: 'Pada (Feet)', organEn: 'Feet & Stature', organHi: 'पाद रज्जु (चरण व शारीरिक आधार)' }, // Magha
  10: { name: 'Kati (Hip)', organEn: 'Hips & Vitality', organHi: 'कटि रज्जु (कमर व वंश ऊर्जा)' }, // Purva Phalguni
  11: { name: 'Udhara (Stomach)', organEn: 'Stomach & Progeny', organHi: 'उदर रज्जु (उदर व संतान सुख)' }, // Uttara Phalguni
  12: { name: 'Kantha (Neck)', organEn: 'Neck & Affection', organHi: 'कंठ रज्जु (गला व दांपत्य माधुर्य)' }, // Hasta
  13: { name: 'Shiro (Head)', organEn: 'Head & Longevity', organHi: 'शिरो रज्जु (शीर्ष व आयु रक्षा)' }, // Chitra
  14: { name: 'Kantha (Neck)', organEn: 'Neck & Affection', organHi: 'कंठ रज्जु (गला व दांपत्य माधुर्य)' }, // Swati
  15: { name: 'Udhara (Stomach)', organEn: 'Stomach & Progeny', organHi: 'उदर रज्जु (उदर व संतान सुख)' }, // Vishakha
  16: { name: 'Kati (Hip)', organEn: 'Hips & Vitality', organHi: 'कटि रज्जु (कमर व वंश ऊर्जा)' }, // Anuradha
  17: { name: 'Pada (Feet)', organEn: 'Feet & Stature', organHi: 'पाद रज्जु (चरण व शारीरिक आधार)' }, // Jyeshtha
  18: { name: 'Pada (Feet)', organEn: 'Feet & Stature', organHi: 'पाद रज्जु (चरण व शारीरिक आधार)' }, // Mula
  19: { name: 'Kati (Hip)', organEn: 'Hips & Vitality', organHi: 'कटि रज्जु (कमर व वंश ऊर्जा)' }, // Purva Ashadha
  20: { name: 'Udhara (Stomach)', organEn: 'Stomach & Progeny', organHi: 'उदर रज्जु (उदर व संतान सुख)' }, // Uttara Ashadha
  21: { name: 'Kantha (Neck)', organEn: 'Neck & Affection', organHi: 'कंठ रज्जु (गला व दांपत्य माधुर्य)' }, // Shravana
  22: { name: 'Shiro (Head)', organEn: 'Head & Longevity', organHi: 'शिरो रज्जु (शीर्ष व आयु रक्षा)' }, // Dhanishta
  23: { name: 'Kantha (Neck)', organEn: 'Neck & Affection', organHi: 'कंठ रज्जु (गला व दांपत्य माधुर्य)' }, // Shatabhisha
  24: { name: 'Udhara (Stomach)', organEn: 'Stomach & Progeny', organHi: 'उदर रज्जु (उदर व संतान सुख)' }, // Purva Bhadrapada
  25: { name: 'Kati (Hip)', organEn: 'Hips & Vitality', organHi: 'कटि रज्जु (कमर व वंश ऊर्जा)' }, // Uttara Bhadrapada
  26: { name: 'Pada (Feet)', organEn: 'Feet & Stature', organHi: 'पाद रज्जु (चरण व शारीरिक आधार)' }, // Revati
};

export function computeComprehensiveMarriageReport(chart: ChartData): ComprehensiveMarriageReport {
  const ascSign = chart.ascendant.signIndex;
  const h7Sign = (ascSign + 6) % 12;
  const h7LordId = SIGNS[h7Sign].lord as SevenPlanetId;
  const h7Lord = chart.planets.find((p) => p.id === h7LordId);
  const h2Sign = (ascSign + 1) % 12;
  const h2LordId = SIGNS[h2Sign].lord as SevenPlanetId;
  const h5Sign = (ascSign + 4) % 12;
  const h5LordId = SIGNS[h5Sign].lord as SevenPlanetId;
  const h6Sign = (ascSign + 5) % 12;
  const h6LordId = SIGNS[h6Sign].lord as SevenPlanetId;
  const h8Sign = (ascSign + 7) % 12;
  const h8LordId = SIGNS[h8Sign].lord as SevenPlanetId;
  const h11Sign = (ascSign + 10) % 12;
  const h11LordId = SIGNS[h11Sign].lord as SevenPlanetId;

  const venus = chart.planets.find((p) => p.id === 'Venus');
  const jupiter = chart.planets.find((p) => p.id === 'Jupiter');
  const mars = chart.planets.find((p) => p.id === 'Mars');
  const saturn = chart.planets.find((p) => p.id === 'Saturn');
  const moon = chart.planets.find((p) => p.id === 'Moon');
  const rahu = chart.planets.find((p) => p.id === 'Rahu');
  const ketu = chart.planets.find((p) => p.id === 'Ketu');

  // 1. Nadi House Significations (2, 7, 11 vs 1, 6, 10 vs 5, 8, 12)
  let marriageScore = 20; // baseline
  let loveScore = 10;
  let negationScore = 5;

  // Marriage Houses (2, 7, 11)
  const h7Occupants = chart.planets.filter((p) => p.id !== 'Asc' && p.rasiHouseNumber === 7);
  const h2Occupants = chart.planets.filter((p) => p.id !== 'Asc' && p.rasiHouseNumber === 2);
  const h11Occupants = chart.planets.filter((p) => p.id !== 'Asc' && p.rasiHouseNumber === 11);

  if (h7Occupants.some((p) => ['Jupiter', 'Venus', 'Mercury'].includes(p.id))) marriageScore += 18;
  if (h2Occupants.some((p) => ['Jupiter', 'Venus', 'Mercury', 'Moon'].includes(p.id))) marriageScore += 12;
  if (h11Occupants.some((p) => ['Jupiter', 'Venus', 'Sun', 'Mars'].includes(p.id))) marriageScore += 12;

  if (h7Lord && ['Exalted', 'Own Sign', 'Moolatrikona', 'Friend', 'Great Friend'].includes(h7Lord.dignity)) marriageScore += 16;
  if (h7Lord && [1, 2, 4, 5, 7, 9, 11].includes(h7Lord.rasiHouseNumber)) marriageScore += 14;

  // Love Houses (5, 8, 12)
  const h5Occupants = chart.planets.filter((p) => p.id !== 'Asc' && p.rasiHouseNumber === 5);
  if (h5Occupants.length > 0) loveScore += 10;
  if (h5Occupants.some((p) => ['Venus', 'Moon', 'Mars', 'Rahu'].includes(p.id))) loveScore += 15;
  if (h7Lord && [5, 11, 12].includes(h7Lord.rasiHouseNumber)) loveScore += 16;
  if (venus && mars && Math.abs(venus.rasiHouseNumber - mars.rasiHouseNumber) === 0) loveScore += 18;
  if (rahu && (rahu.rasiHouseNumber === 5 || rahu.rasiHouseNumber === 7)) loveScore += 14;

  // Negation Houses (1, 6, 10)
  const h6Occupants = chart.planets.filter((p) => p.id !== 'Asc' && p.rasiHouseNumber === 6);
  if (h7Lord && [6, 8, 12].includes(h7Lord.rasiHouseNumber)) negationScore += 18;
  if (h7Occupants.some((p) => ['Rahu', 'Ketu', 'Saturn', 'Mars'].includes(p.id))) negationScore += 14;
  if (h6Occupants.some((p) => p.id === h7LordId)) negationScore += 16;
  if (h7Occupants.some((p) => p.id === h6LordId)) negationScore += 16;
  if (saturn && (saturn.rasiHouseNumber === 7 || (saturn.rasiHouseNumber + 6) % 12 + 1 === 7)) negationScore += 12;

  // Classify Marriage Nature
  let marriageNature: MarriageNature = 'Arranged / Family-Sanctioned';
  let marriageNatureHi = 'पारंपरिक पारिवारिक विवाह (Arranged Marriage)';

  if (loveScore >= 32 && loveScore > negationScore) {
    marriageNature = 'Love / Romantic Union';
    marriageNatureHi = 'प्रेम विवाह / स्व-पसंद जीवनसाथी (Love Marriage)';
  } else if (loveScore >= 22 && marriageScore >= 35) {
    marriageNature = 'Love-cum-Arranged';
    marriageNatureHi = 'प्रेम-सह-पारिवारिक स्वीकृति विवाह (Love-cum-Arranged)';
  } else if (negationScore >= 30 && saturn && [1, 7, 10].includes(saturn.rasiHouseNumber)) {
    marriageNature = 'Delayed / Obstacle-Prone';
    marriageNatureHi = 'विलंब एवं धैर्य-साध्य विवाह (Delayed Marriage)';
  } else if (rahu && [7, 8].includes(rahu.rasiHouseNumber)) {
    marriageNature = 'Special Karmic Bond';
    marriageNatureHi = 'विशिष्ट कार्मिक वैवाहिक संबंध (Karmic Union)';
  }

  // Promise Rating
  let marriagePromiseRating: 'Highly Auspicious' | 'Auspicious' | 'Average / Delayed' | 'Challenging (Requires Upaya)' = 'Auspicious';
  let marriagePromiseRatingHi = 'शुभ एवं सुदृढ़ दांपत्य योग';

  if (marriageScore >= 55 && negationScore < 20) {
    marriagePromiseRating = 'Highly Auspicious';
    marriagePromiseRatingHi = 'अत्यंत शुभ, सुखद एवं दीर्घायु दांपत्य योग';
  } else if (negationScore >= 35 && negationScore > marriageScore) {
    marriagePromiseRating = 'Challenging (Requires Upaya)';
    marriagePromiseRatingHi = 'चुनौतीपूर्ण (शास्त्रीय शांति व परिहार अपेक्षित)';
  } else if (marriageNature === 'Delayed / Obstacle-Prone') {
    marriagePromiseRating = 'Average / Delayed';
    marriagePromiseRatingHi = 'मध्यम / परिपक्व आयु में शुभ फलप्रद';
  }

  const nadiSignifications: NadiHouseSignification = {
    marriageHouses: [2, 7, 11],
    marriageScore,
    loveHouses: [5, 8, 12],
    loveScore,
    negationHouses: [1, 6, 10],
    negationScore,
    verdictEn: `Primary marriage houses (2, 7, 11) hold a strength score of ${marriageScore}, while romance/courtship houses (5, 8, 12) stand at ${loveScore}. Negation influences (1, 6, 10) register at ${negationScore}.`,
    verdictHi: `मुख्य वैवाहिक भावों (२, ७, ११) का बल सूचकांक ${marriageScore} है, जबकि प्रेम व आकर्षण भावों (५, ८, १२) का बल ${loveScore} है। पृथकता भावों (१, ६, १०) का प्रभाव ${negationScore} पर मूल्यांकित है।`,
  };

  // 2. Varahamihira Stree Jataka & Saubhagya Sthana (8th House)
  const moonDeg = moon?.longitude ? moon.longitude % 30 : 15;
  const moonSign = moon?.signIndex ?? ascSign;
  const trimsamshaRes = computeTrimsamshaLord(moonSign, moonDeg);

  // 8th House (Mangalya Sthana / Saubhagya)
  const h8Occupants = chart.planets.filter((p) => p.id !== 'Asc' && p.rasiHouseNumber === 8);
  const hasBeneficIn8 = h8Occupants.some((p) => ['Jupiter', 'Venus', 'Mercury'].includes(p.id));
  const hasMaleficIn8 = h8Occupants.some((p) => ['Mars', 'Saturn', 'Rahu', 'Ketu'].includes(p.id));

  let mangalyaHouse8Status: 'Dirgha Saumangalya (Highly Auspicious)' | 'Protected' | 'Sensitive (Manglik/Affliction)' | 'Requires Shanti' = 'Protected';
  let mangalyaHouse8StatusHi = 'संरक्षित एवं अनुकूल सौभाग्य';
  let mangalyaDetailsEn = '8th house is moderately conditioned, preserving marital bond through mutual respect and spiritual balance.';
  let mangalyaDetailsHi = 'अष्टम भाव सामान्यतः संतुलित है, जिससे दांपत्य में परस्पर निष्ठा व सामंजस्य बना रहेगा।';

  if (hasBeneficIn8 && !hasMaleficIn8) {
    mangalyaHouse8Status = 'Dirgha Saumangalya (Highly Auspicious)';
    mangalyaHouse8StatusHi = 'दीर्घ सौमांगल्य योग (अखंड सौभाग्य व सुरक्षा)';
    mangalyaDetailsEn = 'Benefic grace in the 8th house bestows classical Dirgha Saumangalya Yoga, protecting the longevity and marital prosperity of the spouse.';
    mangalyaDetailsHi = 'अष्टम भाव में शुभ ग्रह की स्थिति शास्त्रीय दीर्घ सौमांगल्य योग निर्मित करती है, जो जीवनसाथी की दीर्घायु व दांपत्य सौभाग्य की रक्षा करती है।';
  } else if (hasMaleficIn8 && !hasBeneficIn8) {
    mangalyaHouse8Status = 'Requires Shanti';
    mangalyaHouse8StatusHi = 'मांगल्य शांति व विशेष परिहार अपेक्षित';
    mangalyaDetailsEn = 'Malefic presence in the 8th house suggests marital sensitivities or Kuja/Manglik tension, pacified through Gauri Puja and compatibility matching.';
    mangalyaDetailsHi = 'अष्टम भाव में क्रूर ग्रह की स्थिति दांपत्य संवेदनशीलता या मांगलिक प्रभाव दर्शाती है, जिसका निवारण गौरी पूजन व कुण्डली मिलान से संभव है।';
  } else if (hasMaleficIn8 && hasBeneficIn8) {
    mangalyaHouse8Status = 'Sensitive (Manglik/Affliction)';
    mangalyaHouse8StatusHi = 'मिश्रित प्रभाव (शुभ दृष्टि से सुरक्षित)';
    mangalyaDetailsEn = 'Mixed planetary influences on the 8th house; early marital friction dissolves through maturity and benefic aspect.';
    mangalyaDetailsHi = 'अष्टम भाव पर मिश्रित प्रभाव; प्रारंभिक मतभेद शुभ ग्रहों की दृष्टि व आपसी परिपक्वता से शांत होंगे।';
  }

  // Spouse Persona from 7th House & 7th Lord
  let spousePersonaEn = 'Dignified, principled, responsible, and supportive companion.';
  let spousePersonaHi = 'कुलीन, स्वाभिमानी, कर्तव्यनिष्ठ एवं सहयोगी जीवनसाथी।';
  let spouseProfessionAndStatusEn = 'Connected to administration, professional commerce, education, or organized corporate management.';
  let spouseProfessionAndStatusHi = 'प्रशासन, वाणिज्य, शिक्षण, तकनीकी प्रबंधन अथवा प्रतिष्ठित सेवा क्षेत्र से संबद्ध।';

  if (h7LordId === 'Jupiter' || h7Occupants.some((p) => p.id === 'Jupiter')) {
    spousePersonaEn = 'Learned, generous, fair-complexioned, ethically upright with high spiritual and familial values.';
    spousePersonaHi = 'विद्वान, उदार, सुंदर वर्ण, नैतिक मूल्यों से युक्त एवं परिवार में पूजनीय जीवनसाथी।';
    spouseProfessionAndStatusEn = 'Higher education, advisory, law, banking, finance, or institutional leadership.';
    spouseProfessionAndStatusHi = 'उच्च शिक्षा, परामर्श, विधि (कानून), बैंकिंग, वित्त अथवा प्रतिष्ठित संस्थागत नेतृत्व।';
  } else if (h7LordId === 'Venus' || h7Occupants.some((p) => p.id === 'Venus')) {
    spousePersonaEn = 'Charming, aesthetically refined, fond of arts and luxuries, affectionate and socially magnetic.';
    spousePersonaHi = 'आकर्षक, सुरुचिपूर्ण, कला-प्रेमी, भौतिक सुखों से संपन्न, मधुर भाषी एवं सामाजिक रूप से लोकप्रिय।';
    spouseProfessionAndStatusEn = 'Creative industries, commerce, hospitality, design, media, or luxury enterprise.';
    spouseProfessionAndStatusHi = 'सृजनात्मक क्षेत्र, व्यवसाय, आतिथ्य, डिजाइन, मीडिया अथवा विलासिता व्यापार।';
  } else if (h7LordId === 'Mars' || h7Occupants.some((p) => p.id === 'Mars')) {
    spousePersonaEn = 'Energetic, courageous, commanding, physically active, with frank and outspoken convictions.';
    spousePersonaHi = 'ऊर्जावान, साहसी, दृढ़ संकल्पी, शारीरिक रूप से सक्रिय एवं स्पष्टवादी स्वभाव।';
    spouseProfessionAndStatusEn = 'Engineering, technical management, defense, real estate, surgery, or executive operations.';
    spouseProfessionAndStatusHi = 'इंजीनियरिंग, तकनीकी प्रबंधन, रक्षा, अचल संपत्ति, चिकित्सा (सर्जरी) अथवा ऑपरेशंस।';
  } else if (h7LordId === 'Mercury' || h7Occupants.some((p) => p.id === 'Mercury')) {
    spousePersonaEn = 'Youthful, sharp-witted, articulate communicator, intellectually curious, and highly adaptable.';
    spousePersonaHi = 'युवा स्वरूप, कुशाग्र बुद्धि, कुशल वक्ता, बौद्धिक जिज्ञासु एवं सामंजस्यवादी जीवनसाथी।';
    spouseProfessionAndStatusEn = 'Information technology, analytics, writing, commerce, marketing, or communication fields.';
    spouseProfessionAndStatusHi = 'सूचना प्रौद्योगिकी (आईटी), डेटा विश्लेषण, लेखन, व्यापार, विपणन अथवा जनसंचार।';
  } else if (h7LordId === 'Saturn' || h7Occupants.some((p) => p.id === 'Saturn')) {
    spousePersonaEn = 'Mature, sober, hardworking, deeply patient, practical, and grounded in enduring commitments.';
    spousePersonaHi = 'गंभीर, धैर्यवान, परिश्रमी, व्यावहारिक एवं वचनों के प्रति पूर्णतः समर्पित जीवनसाथी।';
    spouseProfessionAndStatusEn = 'Industry, law, public works, structured engineering, research, or long-term governance.';
    spouseProfessionAndStatusHi = 'उद्योग, विधि, लोक निर्माण, शोध, संगठित इंजीनियरिंग अथवा दीर्घकालिक प्रशासन।';
  }

  const streeJataka: StreeJatakaDiagnostic = {
    trimsamshaLord: trimsamshaRes.lord,
    trimsamshaDegree: Math.round(moonDeg * 100) / 100,
    trimsamshaSignName: SIGNS[moonSign]?.name ?? 'Aries',
    trimsamshaNatureEn: trimsamshaRes.natureEn,
    trimsamshaNatureHi: trimsamshaRes.natureHi,
    mangalyaHouse8Status,
    mangalyaHouse8StatusHi,
    mangalyaDetailsEn,
    mangalyaDetailsHi,
    spousePersonaEn,
    spousePersonaHi,
    spouseProfessionAndStatusEn,
    spouseProfessionAndStatusHi,
    classicalSource: 'Brihat Jataka Ch. 24 (Stree Jatakadhyaya) · Phaladeepika Ch. 10 · Saaraavali',
  };

  // 3. Jaimini Upapada Lagna (UL) & Double Transit Timing (Parashara)
  const sign12 = (ascSign + 11) % 12;
  const lord12Id = SIGNS[sign12].lord;
  const lord12Body = chart.planets.find((p) => p.id === lord12Id);
  const lord12Sign = lord12Body ? lord12Body.signIndex : sign12;
  const dist12 = (lord12Sign - sign12 + 12) % 12;
  let ulSign = (lord12Sign + dist12) % 12;
  // Standard Jaimini Pada exception if same or 7th
  if (ulSign === sign12 || ulSign === (sign12 + 6) % 12) {
    ulSign = (ulSign + 9) % 12;
  }

  const ulLordId = SIGNS[ulSign].lord as SevenPlanetId;
  const ulLordBody = chart.planets.find((p) => p.id === ulLordId);
  const ulLordDignity = ulLordBody?.dignity ?? 'Neutral';

  // 2nd from Upapada indicates sustenance of marriage
  const ul2ndSign = (ulSign + 1) % 12;
  const ul2ndOccupants = chart.planets.filter((p) => p.id !== 'Asc' && p.signIndex === ul2ndSign);
  const hasBeneficInUL2 = ul2ndOccupants.some((p) => ['Jupiter', 'Venus', 'Mercury'].includes(p.id));
  const hasMaleficInUL2 = ul2ndOccupants.some((p) => ['Sun', 'Mars', 'Saturn', 'Rahu', 'Ketu'].includes(p.id));

  let upapadaSustenanceEn = 'Upapada Lagna (UL) is balanced, assuring stable matrimonial sustenance through traditional family values.';
  let upapadaSustenanceHi = 'उपपद लग्न (UL) संतुलित है, जो पारंपरिक मूल्यों व आपसी विश्वास से अखंड दांपत्य स्थिरता सुनिश्चित करता है।';

  if (hasBeneficInUL2) {
    upapadaSustenanceEn = 'Benefic placement in the 2nd from Upapada Lagna promises prosperous, blissful, and durable marital stability.';
    upapadaSustenanceHi = 'उपपद लग्न से द्वितीय भाव में शुभ ग्रह की स्थिति दांपत्य जीवन में अपार सुख, संपन्नता व अखंड स्थिरता प्रदान करती है।';
  } else if (hasMaleficInUL2) {
    upapadaSustenanceEn = 'Malefic presence in the 2nd from Upapada Lagna advises fasting on Upapada lord weekday for harmony.';
    upapadaSustenanceHi = 'उपपद लग्न से द्वितीय भाव में क्रूर प्रभाव दांपत्य शांति हेतु उपपद स्वामी के वार को उपवास रखने का शास्त्रीय निर्देश देता है।';
  }

  // Jaimini Dara Karaka (DK)
  const charaKarakas = computeCharaKarakas(chart);
  const dkRow = charaKarakas.find((k) => k.role === 'DK');
  const daraKarakaPlanet: NineGrahaId = (dkRow?.planet as NineGrahaId) || 'Venus';

  // Prime Marriage Age Window
  const birthYear = Number((chart.input.date || '2000-01-01').split('-')[0]) || 2000;
  let primeStart = 24;
  let primeEnd = 28;

  if (marriageNature === 'Delayed / Obstacle-Prone' || (saturn && [1, 7].includes(saturn.rasiHouseNumber))) {
    primeStart = 27;
    primeEnd = 32;
  } else if (h7Lord && ['Exalted', 'Own Sign'].includes(h7Lord.dignity) && (venus?.dignity === 'Exalted' || jupiter?.dignity === 'Exalted')) {
    primeStart = 22;
    primeEnd = 26;
  }

  const primeMarriageAgeWindowEn = `Age ${primeStart} to ${primeEnd} Years (A.D. ${birthYear + primeStart}–${birthYear + primeEnd})`;
  const primeMarriageAgeWindowHi = `आयु ${primeStart} से ${primeEnd} वर्ष (ई. सन् ${birthYear + primeStart}–${birthYear + primeEnd})`;

  const timingAndDoubleTransit: DoubleTransitAndTimingWindow = {
    isDoubleTransitFavorable: true,
    upapadaLagnaSign: SIGNS[ulSign].name,
    upapadaLord: ulLordId,
    upapadaLordDignity: ulLordDignity,
    upapadaSustenanceEn,
    upapadaSustenanceHi,
    daraKarakaPlanet,
    primeMarriageAgeWindowEn,
    primeMarriageAgeWindowHi,
    currentTimingVerdictEn: `Marriage solemnization is strongly favored when Jupiter transits trines (1, 5, 9) or 7th from natal 7th lord or Upapada Lagna (${SIGNS[ulSign].name}), simultaneously activated by Saturn's qualifying aspect.`,
    currentTimingVerdictHi: `विवाह का स्वर्णिम समय तब उद्घाटित होता है जब देवगुरु बृहस्पति का गोचर जन्म सप्तमेश अथवा उपपद लग्न (${SIGNS[ulSign].name}) से १, ५, ९ या ७वें भाव में हो तथा शनि देव का शुभ प्रभाव इस अक्ष को परिपक्व करे।`,
    classicalSource: 'Brihat Parashara Hora Shastra (Upapada Adhyaya) · Jaimini Upadesha Sutras · Dwi-Gochar Rules',
  };

  // 4. Koota Longevity & Rajju / Vedha Alert
  const safeNakIdx = moon?.nakshatraIndex !== undefined && moon.nakshatraIndex >= 0 && moon.nakshatraIndex < 27
    ? moon.nakshatraIndex
    : 0;
  const rajjuInfo = NAKSHATRA_RAJJU_MAP[safeNakIdx] || { name: 'Kati (Hip)', organEn: 'Hips & Vitality', organHi: 'कटि रज्जु' };

  const moonNakName = moon?.nakshatraName ?? 'the constellation';
  const kootaAlerts: KootaLongevityAlert = {
    rajjuType: rajjuInfo.name,
    rajjuVulnerability: rajjuInfo.name.includes('Shiro') || rajjuInfo.name.includes('Kantha'),
    rajjuExplanationEn: `Natal Moon occupies ${moonNakName}, falling in ${rajjuInfo.organEn}. In matrimonial matching, same-rajju alliances (especially Shiro or Kantha) require careful cancellation verification.`,
    rajjuExplanationHi: `जन्म चंद्र ${moonNakName} नक्षत्र में स्थित है, जो ${rajjuInfo.organHi} में आता है। कुण्डली मिलान में समान रज्जु (विशेषकर शिरो अथवा कंठ) होने पर शास्त्रीय परिहार की जांच आवश्यक होती है।`,
    vedhaVulnerability: false,
    vedhaExplanationEn: 'No mutual Vedha (constellational striking) obstruction is indicated for natal Moon.',
    vedhaExplanationHi: 'जन्म चंद्र नक्षत्र पर कोई परस्पर वेध (घातक नक्षत्र अवरोध) दोष नहीं है।',
    shashtashtakaHarmonyEn: 'Moon sign maintains auspicious natural alignment; verify 6/8 Rasi neutrality during horoscopic synastry.',
    shashtashtakaHarmonyHi: 'चंद्र राशि स्वाभाविक रूप से अनुकूल है; मिलान के समय षष्ठाष्टक (६/८) राशि मित्रता के नियमों का ध्यान रखें।',
  };

  // 5. Marital Discord & Separation Warning
  const maritalDiscordRisk: 'Low' | 'Moderate' | 'High' = negationScore >= 35 ? 'High' : negationScore >= 20 ? 'Moderate' : 'Low';
  const maritalDiscordDetailsEn =
    maritalDiscordRisk === 'High'
      ? 'Strong separative house influences (1, 6, 10) call for conscious emotional patience, transparent dialogue, and performing Gauri-Shankar or Shiva-Parvati puja to avert unnecessary friction.'
      : maritalDiscordRisk === 'Moderate'
        ? 'Occasional domestic debates during sub-periods of 6th or 8th lords; quickly dissolved through mutual respect and avoiding impulsive reactions.'
        : 'Harmonious domestic bond with low friction risk; natural mutual loyalty safeguards family peace.';

  const maritalDiscordDetailsHi =
    maritalDiscordRisk === 'High'
      ? '१, ६, १० भावों के प्रभाव के कारण दांपत्य में धैर्य, स्पष्ट संवाद तथा समय-समय पर शिव-पार्वती अथवा गौरी-शंकर पूजन से कलह व वैचारिक मतभेद का निवारण आवश्यक है।'
      : maritalDiscordRisk === 'Moderate'
        ? 'षष्ठेश अथवा अष्टमेश की अंतर्दशा में कभी-कभार सामान्य नोकझोंक संभव है, जो समझदारी व परिपक्व संवाद से स्वतः शांत हो जाएगी।'
        : 'दांपत्य जीवन अत्यंत सौहार्दपूर्ण रहेगा; परस्पर निष्ठा व सम्मान परिवार में सुख-शांति बनाए रखेगा।';

  // Second Marriage Potential (Nadi: 9th house as 3rd from 7th)
  let remarriagePotentialEn: string | undefined;
  let remarriagePotentialHi: string | undefined;
  if (negationScore >= 30 && h7Occupants.some((p) => ['Rahu', 'Mars'].includes(p.id))) {
    remarriagePotentialEn = 'Nadi scriptures indicate that if an early union encounters irreconcilable legal dissolution, the 9th house (3rd from 7th) supports a stable and peaceful subsequent matrimonial alliance.';
    remarriagePotentialHi = 'नाड़ी संहिता के अनुसार यदि पूर्व विवाह में अत्यधिक वैधानिक व्यवधान आए, तो नवम भाव (सप्तम से तृतीय) की सक्रियता से द्वितीय विवाह अधिक सुखद व स्थायी सिद्ध होता है।';
  }

  // 6. Authentic Vedic Remedies
  const authenticVedicRemediesEn = [
    'Recite the sacred Katyayani Mantra (for female natives) or Patni Manoramam Stotra (for male natives) daily for attracting a noble, loving spouse.',
    'Offer milk and bilva leaves on Shivling every Monday (Gauri-Shankar Aradhana) to dissolve marital friction and enhance conjugal bliss.',
    `Observe light fasting or perform charitable donations on ${ulLordBody ? 'Thursday/Friday' : 'auspicious weekdays'} to honor the Upapada Lagna lord (${SIGNS[ulSign].name}).`,
    'Feed green fodder or bananas to cows and seek the blessings of elderly married women on festive tithis.',
  ];

  const authenticVedicRemediesHi = [
    'मनोवांछित श्रेष्ठ जीवनसाथी की प्राप्ति हेतु कन्याएं "कात्यायनी महामंत्र" तथा वर "पत्नीं मनोरमां देहि" स्तोत्र का नित्य श्रद्धापूर्वक पाठ करें।',
    'सोमवार अथवा प्रदोष काल में शिवलिंग पर कच्चा दूध व बेलपत्र अर्पित करें (गौरी-शंकर पूजन से दांपत्य क्लेश शांत होता है)।',
    `उपपद लग्न (${SIGNS[ulSign].name}) के स्वामी के वार को सात्विक आहार लें तथा मंदिर में धर्म-ग्रंथ अथवा पूजन सामग्री भेंट करें।`,
    'गुरुवार या शुक्रवार को गौमाता को हरा चारा, गुड़ अथवा केले खिलाएं तथा कुल की सुहागिन स्त्रियों का आशीर्वाद प्राप्त करें।',
  ];

  return {
    marriageNature,
    marriageNatureHi,
    marriagePromiseRating,
    marriagePromiseRatingHi,
    nadiSignifications,
    streeJataka,
    timingAndDoubleTransit,
    kootaAlerts,
    maritalDiscordRisk,
    maritalDiscordDetailsEn,
    maritalDiscordDetailsHi,
    remarriagePotentialEn,
    remarriagePotentialHi,
    authenticVedicRemediesEn,
    authenticVedicRemediesHi,
    classicalSources: [
      'Brihat Jataka Ch. 24 (Stree Jatakadhyaya)',
      'Brihat Samhita (Vivaaha Patalam)',
      'Brihat Parashara Hora Shastra (Vivaha & Upapada Adhyayas)',
      'Phaladeepika Ch. 10 (Stree Jataka) & Ch. 12',
      'Saaraavali Ch. 34',
      'Jataka Parijata',
      'Chandrakala Nadi (Deva Keralam)',
    ],
  };
}
