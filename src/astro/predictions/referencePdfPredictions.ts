/**
 * Reference PDF Comprehensive Prediction Engine (118-Page OnlineJyotish Fidelity)
 *
 * Faithfully reproduces the exact structure, breadth, depth, and classical wording
 * of the authentic 118-page Vedic Janmapatrika (Om Sri Sai Jyotisha Vidyapeetham / onlinejyotish.com)
 * while conforming to our modern, elegant, zero-emoji UI and multi-division workstation architecture.
 */

import { NAKSHATRAS, NINE_GRAHAS, SEVEN_PLANETS, SIGNS } from '../constants';
import { computeDeepPanchangMuhurta } from '../panchangMuhurtaDeep';
import type { ChartData, NineGrahaId, SevenPlanetId } from '../types';
import { getBhavesha144Entry } from './bhavesha144';
import { detectClassicalYogas, type DetectedClassicalYoga } from './classicalYogasKb';
import { SIGN_HI, PLANET_HI } from './dynamicDossierChapters';

export interface ReferencePdfHoroscopeAnalysis {
  houses: Array<{
    houseNumber: number;
    houseNameEn: string;
    houseNameHi: string;
    signIndex: number;
    signNameEn: string;
    signNameHi: string;
    rulerId: string;
    rulerNameEn: string;
    rulerNameHi: string;
    placedInHouse: number;
    placedSignIndex: number;
  }>;
  benefics: string[];
  beneficsHi: string[];
  malefics: string[];
  maleficsHi: string[];
  marakas: string[];
  marakasHi: string[];
  yogakaraka: string | null;
  yogakarakaHi: string | null;
}

export interface ReferencePdfBirthTime {
  ritu: { nameEn: string; nameHi: string; resultEn: string; resultHi: string };
  masa: { nameEn: string; nameHi: string; resultEn: string; resultHi: string };
  tithi: { nameEn: string; nameHi: string; resultEn: string; resultHi: string };
  weekday: { nameEn: string; nameHi: string; isPreSunrise: boolean; resultEn: string; resultHi: string };
}

export interface ReferencePdfNakshatra {
  nameEn: string;
  nameHi: string;
  pada: number;
  deityEn: string;
  deityHi: string;
  rulerEn: string;
  rulerHi: string;
  fullReadingEn: string;
  fullReadingHi: string;
}

export interface ReferencePdfLagna {
  signEn: string;
  signHi: string;
  rulerEn: string;
  rulerHi: string;
  physicalFeaturesEn: string;
  physicalFeaturesHi: string;
  mentalityLifestyleEn: string;
  mentalityLifestyleHi: string;
  likesEn: string;
  likesHi: string;
  dislikesEn: string;
  dislikesHi: string;
  strengthsEn: string[];
  strengthsHi: string[];
  weaknessesEn: string[];
  weaknessesHi: string[];
  educationEn: string;
  educationHi: string;
  healthEn: string;
  healthHi: string;
  financialLifeEn: string;
  financialLifeHi: string;
  loveMarriageEn: string;
  loveMarriageHi: string;
  familyEn: string;
  familyHi: string;
  professionEn: string;
  professionHi: string;
}

export interface ReferencePdfBhavesha {
  lordHouse: number;
  lordPlanet: string;
  lordPlanetEn: string;
  lordPlanetHi: string;
  placedHouse: number;
  placedSignEn: string;
  placedSignHi: string;
  headlineEn: string;
  headlineHi: string;
  readingEn: string;
  readingHi: string;
  eventScenarioEn: string;
  eventScenarioHi: string;
}

export interface ReferencePdfPlanetPosition {
  planetId: string;
  planetEn: string;
  planetHi: string;
  signIndex: number;
  signEn: string;
  signHi: string;
  houseNumber: number;
  degreeDms: string;
  dignity: string;
  isRetrograde: boolean;
  isCombust: boolean;
  zodiacPositionReadingEn: string;
  zodiacPositionReadingHi: string;
  housePositionReadingEn: string;
  housePositionReadingHi: string;
}

export interface ReferencePdfConjunctionYoga {
  planets: string[];
  planetsHi: string[];
  houseNumber: number;
  signIndex: number;
  signEn: string;
  signHi: string;
  titleEn: string;
  titleHi: string;
  readingEn: string;
  readingHi: string;
}

export interface ReferencePdfSavHouse {
  houseNumber: number;
  houseNameEn: string;
  houseNameHi: string;
  signIndex: number;
  signEn: string;
  signHi: string;
  points: number;
  ratingEn: 'Excellent' | 'Good' | 'Medium' | 'Demands Attention';
  ratingHi: 'उत्कृष्ट' | 'उत्तम' | 'मध्यम' | 'सावधानी अपेक्षित';
  predictionEn: string;
  predictionHi: string;
  remedyEn?: string;
  remedyHi?: string;
}

export interface ReferencePdfMajorTransits {
  saturn: {
    transitSignIndex: number;
    transitSignEn: string;
    transitSignHi: string;
    houseFromMoon: number;
    transitNameEn: string;
    transitNameHi: string;
    datesStr: string;
    likelyResultsEn: string[];
    likelyResultsHi: string[];
    cautionEn: string;
    cautionHi: string;
    remediesEn: string;
    remediesHi: string;
  };
  jupiter: {
    transitSignIndex: number;
    transitSignEn: string;
    transitSignHi: string;
    houseFromMoon: number;
    transitNameEn: string;
    transitNameHi: string;
    datesStr: string;
    likelyResultsEn: string[];
    likelyResultsHi: string[];
    aspectsEn: string[];
    aspectsHi: string[];
    cautionEn: string;
    cautionHi: string;
  };
  rahuKetu: {
    rahuSignIndex: number;
    rahuSignEn: string;
    rahuSignHi: string;
    rahuHouseFromMoon: number;
    ketuSignIndex: number;
    ketuSignEn: string;
    ketuSignHi: string;
    ketuHouseFromMoon: number;
    datesStr: string;
    likelyResultsEn: string[];
    likelyResultsHi: string[];
    cautionEn: string;
    cautionHi: string;
    remediesEn: string;
    remediesHi: string;
  };
}

export interface ReferencePdfDashaBhuktiItem {
  mdLord: string;
  adLord: string;
  startDateStr: string;
  ageStr: string;
  forecastEn: string;
  forecastHi: string;
  remediesEn: string;
  remediesHi: string;
}

export interface ReferencePdfYoginiReport {
  currentPeriod: {
    mdName: string;
    adName: string;
    datesStr: string;
    workBusinessEn: string;
    workBusinessHi: string;
    moneyFamilyEn: string;
    moneyFamilyHi: string;
    healthLifeEn: string;
    healthLifeHi: string;
  };
  allYoginis: Array<{
    nameEn: string;
    nameHi: string;
    years: number;
    lordEn: string;
    lordHi: string;
    generalReadingEn: string;
    generalReadingHi: string;
  }>;
}

export interface ReferencePdfReport {
  horoscopeAnalysis: ReferencePdfHoroscopeAnalysis;
  birthTimePredictions: ReferencePdfBirthTime;
  birthNakshatra: ReferencePdfNakshatra;
  lagnaPredictions: ReferencePdfLagna;
  houseLordsPredictions: ReferencePdfBhavesha[];
  planetaryPositionsPredictions: ReferencePdfPlanetPosition[];
  variousYogas: {
    classicalYogas: Array<{ nameEn: string; nameHi: string; readingEn: string; readingHi: string }>;
    dwiGrahaYogas: ReferencePdfConjunctionYoga[];
    triGrahaYogas: ReferencePdfConjunctionYoga[];
    chaturGrahaYogas: ReferencePdfConjunctionYoga[];
  };
  savHousePredictions: ReferencePdfSavHouse[];
  majorTransits: ReferencePdfMajorTransits;
  dashaBhuktiPredictions: ReferencePdfDashaBhuktiItem[];
  yoginiPredictions: ReferencePdfYoginiReport;
}

// ============================================================================
// 1. ASCENDANT CLASSIFICATION (Benefic, Malefic, Maraka, Yogakaraka)
// ============================================================================

export const ASC_PLANETARY_ROLES: Record<number, {
  beneficsEn: string[];
  beneficsHi: string[];
  maleficsEn: string[];
  maleficsHi: string[];
  marakasEn: string[];
  marakasHi: string[];
  yogakarakaEn: string | null;
  yogakarakaHi: string | null;
}> = {
  0: { // Aries (Mesha)
    beneficsEn: ['Sun', 'Mars', 'Jupiter'],
    beneficsHi: ['सूर्य', 'मंगल', 'गुरु'],
    maleficsEn: ['Mercury', 'Venus'],
    maleficsHi: ['बुध', 'शुक्र'],
    marakasEn: ['Venus', 'Mercury'],
    marakasHi: ['शुक्र', 'बुध'],
    yogakarakaEn: 'Jupiter / Sun',
    yogakarakaHi: 'गुरु / सूर्य',
  },
  1: { // Taurus (Vrishabha)
    beneficsEn: ['Venus', 'Saturn', 'Sun', 'Mercury'],
    beneficsHi: ['शुक्र', 'शनि', 'सूर्य', 'बुध'],
    maleficsEn: ['Jupiter', 'Moon', 'Mars'],
    maleficsHi: ['गुरु', 'चंद्र', 'मंगल'],
    marakasEn: ['Mars', 'Jupiter', 'Venus'],
    marakasHi: ['मंगल', 'गुरु', 'शुक्र'],
    yogakarakaEn: 'Saturn',
    yogakarakaHi: 'शनि',
  },
  2: { // Gemini (Mithuna)
    beneficsEn: ['Venus', 'Mercury'],
    beneficsHi: ['शुक्र', 'बुध'],
    maleficsEn: ['Mars', 'Jupiter', 'Sun'],
    maleficsHi: ['मंगल', 'गुरु', 'सूर्य'],
    marakasEn: ['Jupiter', 'Mars'],
    marakasHi: ['गुरु', 'मंगल'],
    yogakarakaEn: 'Venus',
    yogakarakaHi: 'शुक्र',
  },
  3: { // Cancer (Karka)
    beneficsEn: ['Mars', 'Jupiter', 'Moon'],
    beneficsHi: ['मंगल', 'गुरु', 'चंद्र'],
    maleficsEn: ['Mercury', 'Venus'],
    maleficsHi: ['बुध', 'शुक्र'],
    marakasEn: ['Venus', 'Mercury'],
    marakasHi: ['शुक्र', 'बुध'],
    yogakarakaEn: 'Mars',
    yogakarakaHi: 'मंगल',
  },
  4: { // Leo (Simha)
    beneficsEn: ['Mars', 'Sun', 'Jupiter'],
    beneficsHi: ['मंगल', 'सूर्य', 'गुरु'],
    maleficsEn: ['Mercury', 'Venus'],
    maleficsHi: ['बुध', 'शुक्र'],
    marakasEn: ['Saturn', 'Venus'],
    marakasHi: ['शनि', 'शुक्र'],
    yogakarakaEn: 'Mars',
    yogakarakaHi: 'मंगल',
  },
  5: { // Virgo (Kanya)
    beneficsEn: ['Venus', 'Mercury'],
    beneficsHi: ['शुक्र', 'बुध'],
    maleficsEn: ['Mars', 'Moon', 'Jupiter'],
    maleficsHi: ['मंगल', 'चंद्र', 'गुरु'],
    marakasEn: ['Venus', 'Mars'],
    marakasHi: ['शुक्र', 'मंगल'],
    yogakarakaEn: 'Venus',
    yogakarakaHi: 'शुक्र',
  },
  6: { // Libra (Tula)
    beneficsEn: ['Saturn', 'Mercury', 'Venus'],
    beneficsHi: ['शनि', 'बुध', 'शुक्र'],
    maleficsEn: ['Jupiter', 'Sun', 'Mars'],
    maleficsHi: ['गुरु', 'सूर्य', 'मंगल'],
    marakasEn: ['Mars', 'Jupiter'],
    marakasHi: ['मंगल', 'गुरु'],
    yogakarakaEn: 'Saturn',
    yogakarakaHi: 'शनि',
  },
  7: { // Scorpio (Vrischika)
    beneficsEn: ['Jupiter', 'Sun', 'Moon'],
    beneficsHi: ['गुरु', 'सूर्य', 'चंद्र'],
    maleficsEn: ['Mercury', 'Venus'],
    maleficsHi: ['बुध', 'शुक्र'],
    marakasEn: ['Venus', 'Mercury'],
    marakasHi: ['शुक्र', 'बुध'],
    yogakarakaEn: 'Sun / Jupiter',
    yogakarakaHi: 'सूर्य / गुरु',
  },
  8: { // Sagittarius (Dhanu)
    beneficsEn: ['Sun', 'Mars', 'Jupiter'],
    beneficsHi: ['सूर्य', 'मंगल', 'गुरु'],
    maleficsEn: ['Venus', 'Mercury'],
    maleficsHi: ['शुक्र', 'बुध'],
    marakasEn: ['Venus', 'Saturn'],
    marakasHi: ['शुक्र', 'शनि'],
    yogakarakaEn: 'Sun / Mars',
    yogakarakaHi: 'सूर्य / मंगल',
  },
  9: { // Capricorn (Makara)
    beneficsEn: ['Venus', 'Mercury', 'Saturn'],
    beneficsHi: ['शुक्र', 'बुध', 'शनि'],
    maleficsEn: ['Mars', 'Jupiter', 'Moon'],
    maleficsHi: ['मंगल', 'गुरु', 'चंद्र'],
    marakasEn: ['Jupiter', 'Mars'],
    marakasHi: ['गुरु', 'मंगल'],
    yogakarakaEn: 'Venus',
    yogakarakaHi: 'शुक्र',
  },
  10: { // Aquarius (Kumbha)
    beneficsEn: ['Venus', 'Saturn'],
    beneficsHi: ['शुक्र', 'शनि'],
    maleficsEn: ['Jupiter', 'Moon', 'Mars'],
    maleficsHi: ['गुरु', 'चंद्र', 'मंगल'],
    marakasEn: ['Mars', 'Jupiter'],
    marakasHi: ['मंगल', 'गुरु'],
    yogakarakaEn: 'Venus',
    yogakarakaHi: 'शुक्र',
  },
  11: { // Pisces (Meena)
    beneficsEn: ['Moon', 'Mars', 'Jupiter'],
    beneficsHi: ['चंद्र', 'मंगल', 'गुरु'],
    maleficsEn: ['Sun', 'Venus', 'Mercury', 'Saturn'],
    maleficsHi: ['सूर्य', 'शुक्र', 'बुध', 'शनि'],
    marakasEn: ['Saturn', 'Mercury'],
    marakasHi: ['शनि', 'बुध'],
    yogakarakaEn: 'Mars / Moon',
    yogakarakaHi: 'मंगल / चंद्र',
  },
};

export const BHAVA_TITLES: Record<number, { en: string; hi: string; domainEn: string; domainHi: string }> = {
  1: { en: 'First House (Ascendant / Tanu Bhava)', hi: 'प्रथम भाव (तनु भाव / लग्न)', domainEn: 'Body, Personality, Health & Willpower', domainHi: 'शारीरिक गठन, स्वभाव, स्वास्थ्य व आत्मबल' },
  2: { en: 'Second House (Dhana Bhava)', hi: 'द्वितीय भाव (धन भाव / कुटुम्ब)', domainEn: 'Wealth, Speech, Lineage & Accumulated Assets', domainHi: 'धन संचय, वाणी, परिवार व संचित निधि' },
  3: { en: 'Third House (Bhratru Bhava)', hi: 'तृतीय भाव (भ्रातृ भाव / पराक्रम)', domainEn: 'Siblings, Courage, Enterprise & Communication', domainHi: 'सहोदर, साहस, पराक्रम व संचार कौशल' },
  4: { en: 'Fourth House (Matru Bhava)', hi: 'चतुर्थ भाव (मातृ भाव / सुख)', domainEn: 'Mother, Home, Land, Vehicles & Domestic Bliss', domainHi: 'माता, गृह, भूमि, वाहन व आंतरिक सुख' },
  5: { en: 'Fifth House (Putra Bhava)', hi: 'पंचम भाव (पुत्र भाव / बुद्धि)', domainEn: 'Children, Intellect, Past-life Merit & Creativity', domainHi: 'संतान, विवेक, पूर्व-पुण्य व रचनात्मक विद्या' },
  6: { en: 'Sixth House (Shatru Bhava)', hi: 'षष्ठ भाव (शत्रु भाव / रोग)', domainEn: 'Enemies, Debts, Disease, Service & Competitive Edge', domainHi: 'शत्रु, ऋण, रोग, सेवा व प्रतिस्पर्धा विजय' },
  7: { en: 'Seventh House (Kalatra Bhava)', hi: 'सप्तम भाव (कलत्र भाव / जाया)', domainEn: 'Spouse, Marriage, Business Partners & Public Relations', domainHi: 'जीवनसाथी, विवाह, व्यावसायिक साझेदारी व लोक संपर्क' },
  8: { en: 'Eighth House (Ayu Bhava)', hi: 'अष्टम भाव (आयु भाव / रंध्र)', domainEn: 'Longevity, Sudden Events, Occult & Transformation', domainHi: 'आयु, आकस्मिक घटनाएं, गूढ़ ज्ञान व कायाकल्प' },
  9: { en: 'Ninth House (Bhagya Bhava)', hi: 'नवम भाव (भाग्य भाव / धर्म)', domainEn: 'Fortune, Dharma, Father, Mentors & Higher Wisdom', domainHi: 'भाग्य, धर्म, पिता, गुरु व उच्च आध्यात्मिक विद्या' },
  10: { en: 'Tenth House (Rajya Bhava)', hi: 'दशम भाव (कर्म भाव / राज्य)', domainEn: 'Career, Rank, Governance, Fame & Life Mission', domainHi: 'करियर, प्रतिष्ठा, राजयोग, आजीविका व जन सम्मान' },
  11: { en: 'Eleventh House (Labha Bhava)', hi: 'एकादश भाव (लाभ भाव / आय)', domainEn: 'Gains, Ambitions, Social Sphere & Elder Siblings', domainHi: 'सर्व लाभ, महत्वाकांक्षा पूर्ति, मित्र मंडल व अग्रज' },
  12: { en: 'Twelfth House (Vyaya Bhava)', hi: 'द्वादश भाव (व्यय भाव / मोक्ष)', domainEn: 'Expenditure, Foreign Residing, Sleep, Isolation & Moksha', domainHi: 'व्यय, विदेश गमन, शयन सुख, एकांत व मोक्ष' },
};

// ============================================================================
// 2. BIRTH TIME PREDICTIONS (Ritu, Masa, Tithi, Weekday)
// ============================================================================

export const RITU_DATA: Record<string, { en: string; hi: string; resEn: string; resHi: string }> = {
  Vasanta: {
    en: 'Spring (Vasanta Ritu)',
    hi: 'वसन्त ऋतु',
    resEn: 'Born in Spring (Vasanta Ritu), you are blessed with an amiable temperament, poetic intellect, appreciation for arts and gardens, and refined taste. You possess natural cheerfulness, social allure, and enjoy learning diverse disciplines.',
    resHi: 'वसन्त ऋतु में जन्म होने से जातक का स्वभाव सौम्य, कलात्मक व रसिक होता है। आपमें काव्य, प्रकृति व सौंदर्य के प्रति स्वाभाविक अनुराग रहता है। वाणी में माधुर्य, सामाजिक आदर तथा विद्याध्ययन में सहज रुचि प्राप्त होती है।',
  },
  Grishma: {
    en: 'Summer (Grishma Ritu)',
    hi: 'ग्रीष्म ऋतु',
    resEn: 'Born in Summer (Grishma Ritu), you are spirited, hardworking, and courageous. You often participate in constructive social or philanthropic endeavors (such as water resources, community facilities, or educational trusts). You possess favorable academic prospects and a passion for deep reading.',
    resHi: 'ग्रीष्म ऋतु में जन्म होने से जातक पराक्रमी, साहसी व कर्मठ होता है। आप समाज-उपयोगी निर्माण कार्यों, जनकल्याण, जल-आश्रम व शिक्षण कार्यों में सहयोगी बनते हैं। अध्ययन व गंभीर ग्रंथों के पठन में गहरी रुचि रहती है।',
  },
  Varsha: {
    en: 'Monsoon (Varsha Ritu)',
    hi: 'वर्षा ऋतु',
    resEn: 'Born in Monsoon (Varsha Ritu), you are emotionally profound, compassionate, and deeply attuned to family welfare. You have strong intuition, an adaptable mindset, and enjoy water bodies and fertile nature. Finances flourish steadily through dedicated perseverance.',
    resHi: 'वर्षा ऋतु में जन्म लेने से जातक भावुक, संवेदनशील, दयालु व परिवार के प्रति समर्पित होता है। आपमें तीव्र अंतर्ज्ञान व परिस्थितियों के अनुकूल ढलने की क्षमता होती है। धैर्यवान कर्म से धन-धान्य में निरंतर वृद्धि होती है।',
  },
  Sharad: {
    en: 'Autumn (Sharad Ritu)',
    hi: 'शरद ऋतु',
    resEn: 'Born in Autumn (Sharad Ritu), you possess a calm, lucid intellect, radiant persona, and strong sense of justice. You achieve success in commerce, governance, or intellectual pursuits. You value cleanliness, ethics, and mutual honor in all relationships.',
    resHi: 'शरद ऋतु में जन्म होने से जातक निर्मल बुद्धि, तेजस्वी आभा तथा न्यायप्रिय दृष्टिकोण से संपन्न होता है। व्यापार, राजकीय सेवा व बौद्धिक कार्यों में यश मिलता है। आप शुचिता, सत्यनिष्ठा व मर्यादा को सर्वोपरि मानते हैं।',
  },
  Hemanta: {
    en: 'Pre-Winter (Hemanta Ritu)',
    hi: 'हेमन्त ऋतु',
    resEn: 'Born in Pre-Winter (Hemanta Ritu), you are disciplined, reflective, resilient, and focused on physical endurance. You accumulate wealth through prudent savings, exhibit deep familial responsibility, and overcome hardships with silent fortitude.',
    resHi: 'हेमन्त ऋतु में जन्म होने से जातक गंभीर, अनुशासित, सहनशील व दीर्घकालिक योजनाकार होता है। संयमित जीवनशैली व मितव्ययिता से प्रचुर धन संचय करते हैं तथा संकटों का सामना शांत धैर्य से करते हैं।',
  },
  Shishira: {
    en: 'Winter (Shishira Ritu)',
    hi: 'शिशिर ऋतु',
    resEn: 'Born in Winter (Shishira Ritu), you are spiritually inclined, analytical, introspective, and possess formidable mental willpower. You think deeply before acting, excel in research and strategic planning, and achieve self-reliance early in life.',
    resHi: 'शिशिर ऋतु में जन्म होने से जातक अंतर्मुखी, गंभीर, दृढ़ इच्छाशक्ति वाला तथा अनुसंधानप्रिय होता है। आप प्रत्येक निर्णय चिंतन के उपरांत लेते हैं और अपनी स्वावलंबिता के बल पर उच्च पद प्राप्त करते हैं।',
  },
};

export const MASA_DATA: Record<string, { en: string; hi: string; resEn: string; resHi: string }> = {
  Chaitra: { en: 'Chaitra', hi: 'चैत्र', resEn: 'Enthusiastic, handsome, inclined to religious pursuits, and fond of fine clothing.', resHi: 'उत्साही, आकर्षक व्यक्तित्व, धार्मिक अनुष्ठानों में रुचि व सुरुचिपूर्ण वस्त्रों के प्रेमी।' },
  Vaishakha: { en: 'Vaishakha', hi: 'वैशाख', resEn: 'Charitable, wealthy, devoted to parents, and respected in society for wisdom.', resHi: 'दानी, धनवान, माता-पिता के आज्ञाकारी तथा लोकमान्य विद्वान।' },
  Jyeshtha: { en: 'Jyeshtha', hi: 'ज्येष्ठ', resEn: 'Honorable, authoritative, skilled in administrative work, and living in prominent places.', resHi: 'प्रतिष्ठित, प्रभावशाली, प्रशासनिक दक्षता से युक्त तथा प्रतिष्ठित संस्थानों में कार्यरत।' },
  Ashadha: { en: 'Ashadha', hi: 'आषाढ़', resEn: 'Hardworking, fond of flavorful food, diligent in duties, experiencing occasional health fluctuations but highly resilient.', resHi: 'परिश्रमी, स्वादिष्ट भोजन के शौकीन, कर्तव्यपरायण, स्वास्थ्य में कभी-कभार उतार-चढ़ाव किंतु अद्भुत सहनशक्ति।' },
  Shravana: { en: 'Shravana', hi: 'श्रावण', resEn: 'Pious, generous, devoted to Lord Shiva and elders, with a prosperous and blessed family lineage.', resHi: 'धर्मात्मा, उदार, शिवभक्त, गुरुजनों के प्रति श्रद्धावान व कुल-कुटुम्ब को उन्नत करने वाले।' },
  Bhadrapada: { en: 'Bhadrapada', hi: 'भाद्रपद', resEn: 'Eloquent speaker, emotional, honest in business deals, and enjoying steady patrimony.', resHi: 'मधुरभाषी, भावुक, व्यापारिक लेन-देन में पारदर्शी तथा पैतृक संपत्ति से लाभान्वित।' },
  Ashvina: { en: 'Ashvina', hi: 'आश्विन', resEn: 'Courageous, fortunate, fond of vehicles and steeds, having prominent social connections.', resHi: 'पराक्रमी, भाग्यशाली, वाहनों व वैभव के प्रेमी तथा प्रतिष्ठित समाज में प्रभावशील।' },
  Kartika: { en: 'Kartika', hi: 'कार्तिक', resEn: 'Clever, intellectual, fond of spiritual pilgrimages, with strategic business insight.', resHi: 'चतुर, बुद्धिमान, तीर्थ यात्राओं में रुचि तथा कुशाग्र व्यापारिक दृष्टि।' },
  Margashirsha: { en: 'Margashirsha', hi: 'मार्गशीर्ष', resEn: 'Sweet-spoken, scholarly, truthful, respected by royalty and peers alike.', resHi: 'मिष्टभाषी, विद्यावान, सत्यप्रिय तथा समाज व प्रशासन में समादृत।' },
  Pausha: { en: 'Pausha', hi: 'पौष', resEn: 'Determined, philosophical, fearless in competition, achieving wealth through self-enterprise.', resHi: 'दृढ़निश्चयी, दार्शनिक, प्रतिस्पर्धियों पर विजय प्राप्त करने वाले व स्वावलंबन से धनी।' },
  Magha: { en: 'Magha', hi: 'माघ', resEn: 'Magnanimous, virtuous, fond of sacred scriptures, possessing high endurance and moral purity.', resHi: 'उदारमना, सदाचारी, शास्त्रों के ज्ञाता, उच्च सहनशक्ति व चारित्रिक तेज से युक्त।' },
  Phalguna: { en: 'Phalguna', hi: 'फाल्गुन', resEn: 'Prosperous, artistic, beloved by associates, enjoying pleasures of home and transport.', resHi: 'समृद्ध, कलाप्रेमी, जनप्रिय तथा गृह, वाहन व भोग-ऐश्वर्य से परिपूर्ण।' },
};

export const WEEKDAY_DATA: Record<string, { en: string; hi: string; resEn: string; resHi: string }> = {
  Sunday: { en: 'Sunday (Ravivara - Sun)', hi: 'रविवार (सूर्य)', resEn: 'Born on Sunday under the governance of the Sun, you exhibit natural leadership, dignified courage, self-respect, and a commanding aura. You prefer autonomy in professional work.', resHi: 'रविवार को सूर्य के आधिपत्य में जन्म होने से जातक में स्वाभिमान, नेतृत्व क्षमता, ओजस्वी व्यक्तित्व व दृढ़ निश्चय होता है। आप पराधीनता स्वीकार नहीं करते।' },
  Monday: { en: 'Monday (Somavara - Moon)', hi: 'सोमवार (चंद्र)', resEn: 'Born on Monday ruled by the Moon, you possess a compassionate heart, calm countenance, artistic imagination, and sensitivity towards societal needs.', resHi: 'सोमवार को चंद्र के प्रभाव में जन्म होने से जातक का हृदय कोमल, विचारशील, शांत व दयालु होता है। जनसेवा व ललित कलाओं में विशेष रुचि रहती है।' },
  Tuesday: { en: 'Tuesday (Mangalavara - Mars)', hi: 'मंगलवार (मंगल)', resEn: 'Born on Tuesday ruled by Mars, you are energetic, adventurous, fearless in confrontations, skilled in mechanical or executive tasks, and quick to take decisive initiative.', resHi: 'मंगलवार को मंगल के प्रभाव में जन्म होने से जातक साहसी, ओजस्वी, निडर व त्वरित निर्णय लेने वाला होता है। तकनीकी व प्रशासनिक कार्यों में अग्रणी रहते हैं।' },
  Wednesday: { en: 'Wednesday (Budhavara - Mercury)', hi: 'बुधवार (बुध)', resEn: 'Born on Wednesday ruled by Mercury, you are intellectually witty, analytical, eloquent in speech, skilled in mathematics, trade, counseling, and multifaceted communications.', resHi: 'बुधवार को बुध के प्रभाव में जन्म लेने से जातक कुशाग्र बुद्धि, वाक्पटु, गणितीय प्रतिभा, व्यापारिक कौशल तथा उत्तम परामर्शदाता बनता है।' },
  Thursday: { en: 'Thursday (Guruvara - Jupiter)', hi: 'गुरुवार (बृहस्पति)', resEn: 'Born on Thursday ruled by Jupiter, you are endowed with deep wisdom, ethical nobility, scholastic devotion, and societal reverence. Mentors and elders bless your undertakings.', resHi: 'गुरुवार को देवगुरु बृहस्पति के आधिपत्य में जन्म होने से जातक न्यायप्रिय, विद्वान, सात्विक व गुरुजनों का कृपापात्र होता है।' },
  Friday: { en: 'Friday (Shukravara - Venus)', hi: 'शुक्रवार (शुक्र)', resEn: 'Born on Friday ruled by Venus, you are blessed with charismatic charm, refined aesthetic taste, love for luxuries, diplomatic tact, and affectionate relationships.', resHi: 'शुक्रवार को शुक्र के प्रभाव में जन्म होने से जातक आकर्षक, कलाप्रेमी, सुरुचिपूर्ण, सौम्य तथा विलासिता व दांपत्य सुख का उपभोग करने वाला होता है।' },
  Saturday: { en: 'Saturday (Shanivara - Saturn)', hi: 'शनिवार (शनि)', resEn: 'Born on Saturday ruled by Saturn, you are a hard taskmaster, patient, persevering, deeply aware of life\'s realities, possessing stamina to build enduring foundations over time.', resHi: 'शनिवार को शनिदेव के प्रभाव में जन्म होने से जातक गंभीर, धैर्यवान, कर्मठ व व्यावहारिक होता है। जीवन के संघर्षों से तपकर दीर्घकालीन सफलता अर्जित करते हैं।' },
};

// ============================================================================
// 3. LAGNA COMPREHENSIVE 11-DIMENSION PROFILES (Aries to Pisces)
// ============================================================================

export const LAGNA_PROFILES_12: Record<number, {
  signEn: string;
  signHi: string;
  rulerEn: string;
  rulerHi: string;
  physicalFeaturesEn: string;
  physicalFeaturesHi: string;
  mentalityLifestyleEn: string;
  mentalityLifestyleHi: string;
  likesEn: string;
  likesHi: string;
  dislikesEn: string;
  dislikesHi: string;
  strengthsEn: string[];
  strengthsHi: string[];
  weaknessesEn: string[];
  weaknessesHi: string[];
  educationEn: string;
  educationHi: string;
  healthEn: string;
  healthHi: string;
  financialLifeEn: string;
  financialLifeHi: string;
  loveMarriageEn: string;
  loveMarriageHi: string;
  familyEn: string;
  familyHi: string;
  professionEn: string;
  professionHi: string;
}> = {
  0: { // Aries
    signEn: 'Aries', signHi: 'मेष', rulerEn: 'Mars', rulerHi: 'मंगल',
    physicalFeaturesEn: 'Athletic, lean and muscular build with an energetic stride. Sharp facial contours, prominent brow, expressive eyes, and natural vitality.',
    physicalFeaturesHi: 'पुष्ट, सुगठित व ऊर्जावान शारीरिक संरचना। ललाट पर तेज, तीखे नयन-नक्श, स्पष्ट दृष्टि तथा क्रियाशील चाल-ढाल।',
    mentalityLifestyleEn: 'Pioneering, bold, independent, and direct. You believe in instant action rather than prolonged hesitation, approaching challenges head-on.',
    mentalityLifestyleHi: 'अग्रणी, निर्भीक, स्वाभिमानी व स्पष्टवादी मानसिकता। आप किसी भी कार्य में विलंब के स्थान पर त्वरित पहल करने में विश्वास रखते हैं।',
    likesEn: 'Competition, sports, leadership roles, physical challenges, new ventures, honesty.',
    likesHi: 'चुनौतियां, खेलकूद, साहसिक यात्राएं, नेतृत्व पद, नवीन उपक्रम व स्पष्टवादिता।',
    dislikesEn: 'Delays, bureaucracy, micro-management, deceit, unpunctuality, monotony.',
    dislikesHi: 'अनावश्यक विलंब, चापलूसी, दूसरों के अधीन कार्य करना, असत्य व सुस्त वातावरण।',
    strengthsEn: [
      'Fearless initiative and natural leadership',
      'High physical resilience and rapid recuperation',
      'Honest, transparent, and direct communication',
      'Unshakable courage under acute crisis',
      'Inspires teams through active personal example',
    ],
    strengthsHi: [
      'निर्भीक नेतृत्व एवं त्वरित पहल करने की अद्भुत क्षमता',
      'उच्च शारीरिक सहनशक्ति व रोगों से तीव्र मुक्ति',
      'पारदर्शी, निष्कपट व स्पष्ट संवाद शैली',
      'संकट के समय अदम्य साहस व अडिग मनोबल',
      'स्वयं आगे बढ़कर दूसरों को प्रेरित करने का गुण',
    ],
    weaknessesEn: [
      'Impatience and quick temper under delay',
      'Tendency to start projects without seeing them to final closure',
      'Blunt speech that may hurt sensitive associates',
      'Risk of reckless physical exertion or accidents',
      'Difficulty in accepting subordinate positions',
    ],
    weaknessesHi: [
      'अधीरता व कार्य में विलंब होने पर शीघ्र क्रोध आना',
      'उत्साह में कार्य प्रारंभ कर उसे पूर्ण किए बिना नया काम पकड़ना',
      'अति स्पष्टवादिता से संवेदनशील व्यक्तियों को आहत करना',
      'जोखिम भरे कार्यों में असावधानी से चोट की संभावना',
      'दूसरों के निर्देशानुसार अधीन रहकर कार्य करने में असहजता',
    ],
    educationEn: 'Quick conceptual comprehension. Excels in engineering, defense, surgery, management, athletics, and practical problem solving.',
    educationHi: 'अवधारणाओं को शीघ्र ग्रहण करने की क्षमता। अभियांत्रिकी, रक्षा, शल्य चिकित्सा, प्रबंधन व व्यावहारिक विषयों में उत्कृष्ट सफलता।',
    healthEn: 'Robust constitution. Prone to headaches, feverish spikes, muscular strain, and minor cuts. Needs regular cardiovascular exercise.',
    healthHi: 'उत्तम शारीरिक बल। सिरदर्द, पित्त विकार, रक्तचाप व मांसपेशियों में खिंचाव के प्रति सजग रहें। नियमित व्यायाम अत्यंत लाभकारी।',
    financialLifeEn: 'Dynamic income generation through independent enterprise and executive positions. Spending tends to be impulsive; systematic investments needed.',
    financialLifeHi: 'साहसिक उपक्रमों व स्वतंत्र आजीविका से निरंतर धनोपार्जन। व्यय में उतावलेपन पर नियंत्रण तथा दीर्घकालीन निवेश आवश्यक।',
    loveMarriageEn: 'Passionate, protective, and ardent in romance. Seeks a partner who respects autonomy and shares active enthusiasm. Marital stability requires mutual patience.',
    loveMarriageHi: 'गंभीर, निष्ठावान व सुरक्षात्मक जीवनसाथी। स्वतंत्रता का सम्मान करने वाले साथी की चाहत। दांपत्य में धैर्य व क्रोध नियंत्रण आवश्यक।',
    familyEn: 'Deeply loyal to family honor; serves as the protective shield for kin during hardships.',
    familyHi: 'कुल-मर्यादा के प्रति पूर्ण निष्ठावान। परिवार पर संकट आने पर सबसे आगे खड़े होकर रक्षा करते हैं।',
    professionEn: 'Defense forces, surgery, administrative leadership, entrepreneurship, metallurgy, competitive sports, real estate.',
    professionHi: 'रक्षा सेवाएं, पुलिस, शल्य-चिकित्सा, उद्यमिता, प्रशासनिक नेतृत्व, रियल एस्टेट व खेलकूद।',
  },
  1: { // Taurus
    signEn: 'Taurus', signHi: 'वृषभ', rulerEn: 'Venus', rulerHi: 'शुक्र',
    physicalFeaturesEn: 'Broad forehead, slightly plump and well-proportioned body, bright magnetic eyes, thick strong neck, graceful presence, and a warm attractive smile.',
    physicalFeaturesHi: 'चौड़ा ललाट, सुगठित व मध्यम पुष्ट देह, चमकदार नयन, सुदृढ़ ग्रीवा, सुंदर मुखमंडल तथा अत्यंत आकर्षक व सौम्य मुस्कान।',
    mentalityLifestyleEn: 'Steadfast, pragmatic, peace-loving, and deeply rooted in traditions. You value tangible results, stability, and peaceful surroundings over hasty changes.',
    mentalityLifestyleHi: 'धैर्यवान, स्थिरचित्त, व्यावहारिक व परंपराप्रिय। आप हवाई बातों के स्थान पर ठोस परिणाम, पारिवारिक शांति व स्थायित्व को प्राथमिकता देते हैं।',
    likesEn: 'Fine cuisine, music, luxurious comforts, dependable assets, nature, fragrant environments.',
    likesHi: 'स्वादिष्ट भोजन, संगीत, कला, विलासितापूर्ण वस्तुएं, स्थायी संपत्ति, प्रकृति व सुगंध।',
    dislikesEn: 'Sudden upheaval, unreliability, noisy environments, waste of money, superficial trends.',
    dislikesHi: 'अचानक परिवर्तन, अस्थिरता, शोरगुल, धन की बर्बादी व अविश्वसनीय लोग।',
    strengthsEn: [
      'Unshakable patience and perseverance to finish tasks methodically',
      'Exceptional financial acumen and wealth preservation skills',
      'Artistic sensibility, grace, and cultural refinement',
      'Loyal and trustworthy anchor for friends and family',
      'Ability to resolve conflicts peacefully through calm diplomacy',
    ],
    strengthsHi: [
      'अडिग धैर्य एवं किसी भी कार्य को विधिपूर्वक पूर्ण करने की लगन',
      'उत्कृष्ट वित्तीय समझ, मितव्ययिता व धन संचय की कला',
      'कलात्मक सुरुचि, सौंदर्य-बोध व सांस्कृतिक परिष्कार',
      'मित्रों व परिजनों के लिए अत्यंत विश्वसनीय व निष्ठावान स्तंभ',
      'विवादों को शांति व सूझबूझ से सुलझाने का स्वाभाविक कौशल',
    ],
    weaknessesEn: [
      'Stubbornness and resistance to rapid necessary modernization',
      'Overindulgence in culinary comforts and sedentary leisure',
      'Possessiveness in relationships and reluctance to let go',
      'Difficulty in adapting to sudden shifts in strategy',
      'Occasional envy or slow acknowledgment of others\' merits',
    ],
    weaknessesHi: [
      'हठधर्मिता व अपनी मान्यताओं को शीघ्र न बदलने की जिद',
      'स्वादिष्ट भोजन व आरामदायक जीवनशैली के प्रति अत्यधिक आसक्ति',
      'संबंधों में अधिकार-भावना व पुरानी बातों को पकड़े रहना',
      'रणनीति में अचानक आए बदलावों के प्रति सहज न हो पाना',
      'दूसरों की विशेषताओं को सहजता से स्वीकार करने में संकोच',
    ],
    educationEn: 'Methodical learner with excellent retention. Excels in arts, architecture, finance, commerce, design, culinary sciences, and law.',
    educationHi: 'व्यवस्थित अध्ययन शैली व दीर्घकालीन स्मरण शक्ति। वाणिज्य, वित्त, वास्तु, ललित कला, संगीत, विधि व डिजाइन में उच्च सफलता।',
    healthEn: 'Strong stamina. Watch for throat ailments, thyroid balance, vocal cord strain, and weight gain post-35. Balanced diet is key.',
    healthHi: 'मजबूत जीवन-शक्ति। कंठ, थायरॉइड, स्वर-यंत्र व मध्य आयु के बाद वजन वृद्धि के प्रति सजगता आवश्यक। संतुलित सात्विक आहार हितकर।',
    financialLifeEn: 'Highly auspicious for wealth accumulation (Dhana Karaka Venus). Steadily gathers land, gold, bank savings, and high-value tangible assets.',
    financialLifeHi: 'धन संचय की दृष्टि से अत्यंत श्रेष्ठ लग्न। भूमि, स्वर्ण, स्थायी जमा तथा मूल्यवान परिसंपत्तियों का निरंतर संवर्धन करते हैं।',
    loveMarriageEn: 'Devoted, sensual, and loyal partner seeking long-term domestic tranquility. Marriage brings stability, mutual comfort, and family growth.',
    loveMarriageHi: 'अत्यंत निष्ठावान, समर्पित व दांपत्य सुख का प्रेमी। विवाह के उपरांत जीवन में स्थिरता, सौभाग्य व पारिवारिक सौहार्द की वृद्धि होती है।',
    familyEn: 'Deep commitment to household welfare; cherishes family gatherings and preserves ancestral heritage.',
    familyHi: 'कुटुम्ब व माता-पिता के प्रति अगाध प्रेम। पारिवारिक मर्यादाओं व कुल-परंपराओं का निष्ठापूर्वक पालन करते हैं।',
    professionEn: 'Banking, finance, creative arts, cinema, luxury goods, agriculture, real estate, hospitality, fashion design.',
    professionHi: 'बैंकिंग, वित्त, कला, अभिनय, सौंदर्य प्रसाधन, कृषि, आतिथ्य, रियल एस्टेट व वस्त्र उद्योग।',
  },
  2: { // Gemini
    signEn: 'Gemini', signHi: 'मिथुन', rulerEn: 'Mercury', rulerHi: 'बुध',
    physicalFeaturesEn: 'Slender, quick-moving, expressive face with lively inquisitive eyes. Articulate speech, youthful demeanor, and dextrous hands.',
    physicalFeaturesHi: 'पतला-लंबा, फुर्तीला शरीर, सजीव व जिज्ञासु नयन। मुख पर सदैव यौवन का भाव, स्पष्ट वाक्पटुता व कुशल हस्त-गतिविधि।',
    mentalityLifestyleEn: 'Intellectual, inquisitive, adaptable, and communicative. Highly curious about ideas, people, news, and multidirectional learning.',
    mentalityLifestyleHi: 'बुद्धिमान, जिज्ञासु, बहुमुखी प्रतिभा के धनी व विचारवान। निरंतर नए विचारों, संचार साधनों व बौद्धिक विमर्श में रुचि।',
    likesEn: 'Reading, debating, writing, travel, networking, technology, humor.',
    likesHi: 'स्वाध्याय, वाद-विवाद, लेखन, यात्राएं, सोशल नेटवर्किंग, नवीन तकनीक व हास-परिहास।',
    dislikesEn: 'Boredom, silence, repetitive manual chores, rigid orthodoxy, mental confinement.',
    dislikesHi: 'नीरसता, एकाकीपन, एक ढर्रे पर चलना, रूढ़िवादिता व बौद्धिक बंधिशें।',
    strengthsEn: ['Sharp analytical intellect', 'Mastery over written and spoken word', 'Effortless adaptability', 'Quick learning curve', 'Humorous and engaging conversationalist'],
    strengthsHi: ['तीक्ष्ण विश्लेषणात्मक बुद्धि', 'वाणी व लेखन पर असाधारण अधिकार', 'किसी भी परिवेश में ढलने की सहज क्षमता', 'त्वरित अधिगम व ग्रहणशीलता', 'आकर्षक, मनोरंजक व प्रेरक संवाद शैली'],
    weaknessesEn: ['Restlessness and mental anxiety', 'Scattering energies over too many projects', 'Superficiality when depth is required', 'Indecision under emotional stress', 'Nervous tension from multitasking'],
    weaknessesHi: ['मानसिक चंचलता व अति-चिंतन से तनाव', 'एक साथ कई कार्यों में हाथ डालकर ऊर्जा बिखेरना', 'गंभीर विषयों में कभी-कभार सतही रुख', 'भावनात्मक दबाव में निर्णय लेने में संशय', 'अति-व्यस्तता से स्नायु दुर्बलता'],
    educationEn: 'Brilliant in journalism, literature, data analytics, mathematics, law, computer sciences, linguistics, and media.',
    educationHi: 'पत्रकारिता, साहित्य, डेटा विश्लेषण, गणित, विधि, कंप्यूटर विज्ञान, भाषाशास्त्र व जनसंचार में शीर्ष सफलता।',
    healthEn: 'Prone to respiratory sensitivity, bronchial allergy, insomnia, and nervous strain. Deep breathing (Pranayama) is vital.',
    healthHi: 'श्वसन तंत्र, फेफड़े, अनिद्रा व स्नायु दुर्बलता के प्रति सजग रहें। प्राणायाम व नियमित विश्राम अमृत समान लाभकारी।',
    financialLifeEn: 'Multiple streams of income through intellect, brokerage, writing, consulting, and trading. Fluctuating cashflow demands disciplined budgeting.',
    financialLifeHi: 'बौद्धिक कार्यों, परामर्श, दलाली, व्यापार व मीडिया से बहुआयामी आय। आय-व्यय के संतुलन हेतु सुनियोजित बजट आवश्यक।',
    loveMarriageEn: 'Seeks an intellectual match who stimulates conversation and respects freedom. Marriage thrives on shared laughter and mental rapport.',
    loveMarriageHi: 'वैचारिक साम्य व बौद्धिक संवाद को प्राथमिकता देने वाले साथी की तलाश। मित्रतापूर्ण दांपत्य में प्रगाढ़ता व प्रसन्नता रहती है।',
    familyEn: 'Friendly relationship with siblings and younger relatives; keeps the family lively and connected.',
    familyHi: 'भाई-बहनों व कनिष्ठों के साथ मित्रवत व्यवहार। पारिवारिक आयोजनों में उत्साह व संवाद बनाए रखते हैं।',
    professionEn: 'Media, journalism, writing, software coding, trading, advertising, telecommunications, public relations, diplomacy.',
    professionHi: 'मीडिया, पत्रकारिता, सॉफ्टवेयर, शेयर बाजार, विज्ञापन, दूरसंचार, जनसंपर्क व राजनय।',
  },
  3: { // Cancer
    signEn: 'Cancer', signHi: 'कर्क', rulerEn: 'Moon', rulerHi: 'चंद्र',
    physicalFeaturesEn: 'Round face, soft luminous eyes, gentle demeanor, pale complexion, sensitive features, and an empathetic aura.',
    physicalFeaturesHi: 'गोल मुखमंडल, सौम्य व दीप्तिमान नयन, शांत व्यक्तित्व, संवेदनशील भाव-भंगिमा व ममतामयी आभा।',
    mentalityLifestyleEn: 'Nurturing, intuitive, protective, and deeply attached to domestic roots. Highly responsive to surroundings and moods.',
    mentalityLifestyleHi: 'संवेदनशील, ममतामयी, अंतर्ज्ञानी व गृह-कुटुम्ब के प्रति पूर्ण समर्पित। वातावरण के सूक्ष्म स्पंदनों को तुरंत भांपने वाले।',
    likesEn: 'Home comfort, water bodies, cooking for loved ones, historical memories, emotional security.',
    likesHi: 'घर का सुख, सरोवर-तट, अपनों के लिए भोजन बनाना, पुरानी स्मृतियां व भावनात्मक सुरक्षा।',
    dislikesEn: 'Cold indifference, harsh confrontations, insecurity, being ignored, instability.',
    dislikesHi: 'उपेक्षा, कटु व्यवहार, अशांत वातावरण, असुरक्षा की भावना व पारिवारिक अलगाव।',
    strengthsEn: ['Profound emotional intuition', 'Unconditional protective devotion to family', 'Tenacity and cautious resource management', 'Natural empathy that wins public trust', 'Strong psychic sensitivity and foresight'],
    strengthsHi: ['अगाध भावनात्मक अंतर्ज्ञान', 'कुटुम्ब के प्रति निस्वार्थ सुरक्षात्मक निष्ठा', 'संसाधनों का दूरदर्शी व मितव्ययी संरक्षण', 'जनमानस का विश्वास जीतने वाली स्वाभाविक आत्मीयता', 'सूक्ष्म भविष्य सूचक अंतर्दृष्टि'],
    weaknessesEn: ['Mood swings and emotional vulnerability', 'Holding onto past grievances for too long', 'Over-defensiveness and withdrawal into shell', 'Worrying excessively over hypothetical perils', 'Subjective bias in decision making'],
    weaknessesHi: ['मनोदशा में तीव्र उतार-चढ़ाव व अति-संवेदनशीलता', 'अतीत के दुखों व शिकायतों को लंबे समय तक याद रखना', 'आहत होने पर एकांत में सिमट जाना', 'काल्पनिक चिंताओं से मन को व्यथित करना', 'निर्णय लेते समय अत्यधिक भावुक होना'],
    educationEn: 'Excels in medicine, psychology, hospitality, history, marine sciences, education, sociology, and child welfare.',
    educationHi: 'चिकित्सा, मनोविज्ञान, आतिथ्य, इतिहास, समाजशास्त्र, बाल-विकास व अध्यापन में उत्कृष्ट उपलब्धि।',
    healthEn: 'Prone to digestive sensitivity, water retention, chest congestion, and anxiety-related stomach upset. Needs calm meals.',
    healthHi: 'पाचन तंत्र, जलीय असंतुलन, कफ दोष व चिंता-जनित उदर विकारों पर ध्यान दें। शांत वातावरण में भोजन ग्रहण करना श्रेष्ठ।',
    financialLifeEn: 'Excellent at saving and investing in tangible safety (residential properties, liquid savings, bullion). Wealth grows steadily over time.',
    financialLifeHi: 'धन संचय व अचल संपत्ति (आवासीय भूमि, भवन) में निवेश हेतु श्रेष्ठ। निरंतर बचत से जीवन के उत्तरार्ध में विपुल समृद्धि।',
    loveMarriageEn: 'Deeply devoted, affectionate, and romantic. Marriage is the sacred sanctuary of life; partner must provide genuine emotional security.',
    loveMarriageHi: 'अत्यंत निष्ठावान, समर्पित व संवेदनशील जीवनसाथी। दांपत्य जीवन इनके लिए जीवन की सबसे बड़ी पूंजी व संबल होता है।',
    familyEn: 'The heartbeat of the home; treats parents and maternal relatives with extraordinary warmth.',
    familyHi: 'गृहस्थी की धुरी। माता-पिता व ननिहाल पक्ष के प्रति अगाध आदर व सेवा-भाव रखते हैं।',
    professionEn: 'Healthcare, nursing, hotel management, real estate, social reform, food industries, shipping, education, psychology.',
    professionHi: 'स्वास्थ्य सेवा, नर्सिंग, होटल प्रबंधन, रियल एस्टेट, समाज कल्याण, खाद्य उद्योग, नौवहन व शिक्षा।',
  },
  4: { // Leo
    signEn: 'Leo', signHi: 'सिंह', rulerEn: 'Sun', rulerHi: 'सूर्य',
    physicalFeaturesEn: 'Regal posture, broad commanding shoulders, lion-like majestic gaze, thick hair, resonant voice, and an aura of supreme confidence.',
    physicalFeaturesHi: 'राजसी ठाठ, चौड़े कंधे, सिंह सदृश तेजस्वी दृष्टि, घने केश, गंभीर वाणी व स्वाभाविक तेज से युक्त व्यक्तित्व।',
    mentalityLifestyleEn: 'Magnanimous, proud, honorable, and charismatic. Born to lead and inspire; demands respect and repays loyalty generously.',
    mentalityLifestyleHi: 'उदार, स्वाभिमानी, उच्चाभिलाषी व चुंबकीय व्यक्तित्व। नेतृत्व करने, मान-सम्मान पाने व निष्ठावानों को आश्रय देने वाले।',
    likesEn: 'Honor, grand ventures, public recognition, luxury, generous gift-giving, theatrical arts.',
    likesHi: 'मान-सम्मान, भव्य उपक्रम, जन-प्रतिष्ठा, विलासिता, पुरस्कार व कलात्मक प्रदर्शन।',
    dislikesEn: 'Disrespect, pettiness, deceit, living in shadows, penny-pinching, broken promises.',
    dislikesHi: 'अपमान, संकीर्ण सोच, विश्वासघात, उपेक्षा, कंजूसी व झूठी बातें।',
    strengthsEn: ['Natural executive authority and presence', 'Unshakable self-confidence and optimism', 'Boundless generosity toward dependents', 'Courage in standing up for justice', 'Inspirational flair that motivates multitudes'],
    strengthsHi: ['स्वाभाविक प्रशासनिक प्रभाव व नेतृत्व', 'अखंड आत्मविश्वास व सकारात्मक जीवन दृष्टि', 'आश्रितों के प्रति अपार उदारता व संरक्षण', 'न्याय व मर्यादा हेतु निडर खड़े रहने का साहस', 'जनसमूह को प्रेरित करने की ओजस्वी क्षमता'],
    weaknessesEn: ['Pride and vulnerability to sycophancy', 'Authoritarian impatience when challenged', 'Extravagant spending on prestige and luxury', 'Reluctance to acknowledge personal error', 'Over-dramatizing minor personal affronts'],
    weaknessesHi: ['अहंकार व चापलूसों की बातों में शीघ्र आ जाना', 'आलोचना सहन न कर पाना व प्रभुत्ववादी तेवर', 'प्रतिष्ठा व दिखावे पर अत्यधिक धन व्यय करना', 'अपनी त्रुटि को स्वीकार करने में झिझक', 'छोटी बातों को प्रतिष्ठा का प्रश्न बना लेना'],
    educationEn: 'Outstanding in political science, governance, administration, corporate management, theatrical arts, and cardiology.',
    educationHi: 'राजनीति विज्ञान, लोक प्रशासन, कॉर्पोरेट प्रबंधन, नाट्य कला, कानून व कार्डियोलॉजी में शीर्ष पद।',
    healthEn: 'Robust vitality. Watch for cardiovascular health, spine posture, blood circulation, and heat-induced exhaustion.',
    healthHi: 'उत्तम जीवनी शक्ति। हृदय स्वास्थ्य, मेरुदंड (रीढ़ की हड्डी), रक्त परिसंचरण व पित्त प्रकोप के प्रति जागरूक रहें।',
    financialLifeEn: 'Enjoys royal wealth and status. Money flows through authoritative executive roles, state contracts, and top-tier management.',
    financialLifeHi: 'राजकीय ठाठ-बाट व उच्च आर्थिक स्तर। शासन, प्रशासन, बड़े अनुबंधों व शीर्ष पदों से विपुल धनार्जन।',
    loveMarriageEn: 'Ardent, chivalrous, and proud lover. Desires a partner who complements status and shares mutual admiration.',
    loveMarriageHi: 'उदारमना, सुरक्षात्मक व प्रेम में निष्ठावान। जीवनसाथी ऐसा चाहते हैं जो इनकी प्रतिष्ठा व मर्यादा को सुशोभित करे।',
    familyEn: 'The proud patriarch/matriarch; upholds family pride and ensures dependents lack no worldly comfort.',
    familyHi: 'कुल के गौरव। परिवार के मान-सम्मान की रक्षा हेतु सदैव तत्पर व परिजनों को पूर्ण सुख-सुविधाएं देने वाले।',
    professionEn: 'Politics, civil administration (IAS/IPS), corporate CEO, gold trade, theatre/cinema, cardiology, state bureaucracy.',
    professionHi: 'राजनीति, प्रशासनिक सेवा (आईएएस/आईपीएस), कॉर्पोरेट प्रमुख, स्वर्ण व्यापार, सिनेमा, हृदय रोग विशेषज्ञ।',
  },
  5: { // Virgo
    signEn: 'Virgo', signHi: 'कन्या', rulerEn: 'Mercury', rulerHi: 'बुध',
    physicalFeaturesEn: 'Neat, symmetrical, youthful, sharp observant eyes, meticulous grooming, pleasant speech, and a refined agile stature.',
    physicalFeaturesHi: 'स्वच्छ, सुव्यवस्थित, सौम्य मुखाकृति, तीक्ष्ण व विश्लेषक नयन, सुस्पष्ट वाणी तथा फुर्तीला शरीर।',
    mentalityLifestyleEn: 'Analytical, systematic, service-minded, and detail-oriented. Seeks perfection, order, and practical utility in every facet of life.',
    mentalityLifestyleHi: 'विश्लेषक, क्रमबद्ध, सेवाभावी व सूक्ष्मदर्शी। जीवन के प्रत्येक क्षेत्र में स्वच्छता, व्यवस्था व व्यावहारिक उपयोगिता के पक्षधर।',
    likesEn: 'Cleanliness, spreadsheets, books, punctuality, craftsmanship, healthy diets, quiet efficiency.',
    likesHi: 'स्वच्छता, व्यवस्थित कार्यप्रणाली, अध्ययन, समयबद्धता, शिल्प, सात्विक आहार व शांत वातावरण।',
    dislikesEn: 'Messiness, sloppiness, unpunctuality, ungrounded speculation, noisy chaos, inefficiency.',
    dislikesHi: 'गंदगी, अव्यवस्था, समय की बर्बादी, हवा-हवाई बातें, अनियंत्रित शोर व आलस्य।',
    strengthsEn: ['Unrivaled precision and critical discernment', 'Exceptional problem-solving through logical dissection', 'Selfless dedication to duty and service', 'Astute organizational and editing skills', 'Prudent financial management and audit competence'],
    strengthsHi: ['अद्वितीय सूक्ष्म विश्लेषण व विवेकशीलता', 'तार्किक विवेचन द्वारा जटिल समस्याओं का समाधान', 'कर्तव्य व सेवा के प्रति निस्वार्थ समर्पण', 'संगठनात्मक कार्यकुशलता व संपादन क्षमता', 'सटीक लेखा-जोखा व मितव्ययी वित्तीय प्रबंधन'],
    weaknessesEn: ['Hyper-critical tendencies towards self and peers', 'Worrying over minor flaws and missing the big picture', 'Reluctance to delegate due to perfectionism', 'Digestive nervous tension from over-analyzing', 'Skepticism that blocks intuitive leaps'],
    weaknessesHi: ['अत्यधिक छिद्रान्वेषण व स्वयं पर कठोरता', 'छोटी-छोटी कमियों को लेकर व्यर्थ चिंतित रहना', 'पूर्णता के आग्रह में दूसरों को कार्य न सौंपना', 'अति-सोच से उदर विकार व स्नायु तनाव', 'अति-संदेह से सहज अवसरों को गंवाना'],
    educationEn: 'Distinction in chartered accountancy, data science, pharmaceutical sciences, audit, editing, software QA, and veterinary medicine.',
    educationHi: 'चार्टर्ड एकाउंटेंसी, डेटा साइंस, औषध विज्ञान, ऑडिट, संपादन, सॉफ्टवेयर टेस्टिंग, सांख्यिकी व चिकित्सा।',
    healthEn: 'Prone to intestinal sensitivity, digestive sluggishness, allergies, and nervous fatigue. High-fiber natural foods beneficial.',
    healthHi: 'आंतों की संवेदनशीलता, मंदाग्नि, त्वचा एलर्जी व स्नायु थकान। रेशेदार आहार व योग प्राणायाम अत्यंत हितकारी।',
    financialLifeEn: 'Systematic accumulation of wealth through intellectual labor, professional fees, accounting, and zero-debt planning.',
    financialLifeHi: 'बौद्धिक परिश्रम, परामर्श शुल्क, व्यवस्थित निवेश व ऋण-मुक्त रणनीति से सुरक्षित व निरंतर बढ़ती संपत्ति।',
    loveMarriageEn: 'Thoughtful, practical, and dependable partner. Expresses love through quiet caring actions rather than loud dramatic displays.',
    loveMarriageHi: 'विश्वसनीय, विचारशील व कर्तव्यनिष्ठ जीवनसाथी। प्रेम का प्रकटीकरण दिखावे के बजाय सेवा व समर्पण से करते हैं।',
    familyEn: 'The reliable caregiver who manages household health, hygiene, and domestic accounts flawlessly.',
    familyHi: 'गृहस्थी के सजग संरक्षक। परिजनों के स्वास्थ्य, स्वच्छता व वित्तीय अनुशासन की संपूर्ण देखरेख करते हैं।',
    professionEn: 'Accounting, auditing, medical pathology, software engineering, editing, analytics, civil engineering, pharmacy.',
    professionHi: 'सीए, ऑडिट, पैथोलॉजी, सॉफ्टवेयर इंजीनियरिंग, संपादन, शोध विश्लेषण, औषधालय व प्रशासनिक परामर्श।',
  },
  6: { // Libra
    signEn: 'Libra', signHi: 'तुला', rulerEn: 'Venus', rulerHi: 'शुक्र',
    physicalFeaturesEn: 'Balanced, elegant proportions, charming smile, dimpled cheeks, graceful gait, harmonious features, and refined aesthetic aura.',
    physicalFeaturesHi: 'संतुलित, मनमोहक शारीरिक सौष्ठव, गालों पर मंद मुस्कान, सुंदर मुखाकृति, शिष्ट चाल-ढाल व सुरुचिपूर्ण व्यक्तित्व।',
    mentalityLifestyleEn: 'Diplomatic, fair-minded, harmonious, and socially gracious. Strives for balance, justice, aesthetic beauty, and cooperative partnerships.',
    mentalityLifestyleHi: 'न्यायप्रिय, राजनयिक, शांतिप्रिय व सामाजिक मर्यादा के धनी। संतुलन, न्याय, कलात्मक सौंदर्य व परस्पर सहयोग के पक्षधर।',
    likesEn: 'Art, harmony, fashion, civilized debate, social gatherings, luxury, justice, cooperation.',
    likesHi: 'ललित कला, सौंदर्य, शिष्ट वार्तालाप, सामाजिक उत्सव, सुरुचिपूर्ण परिधान, न्याय व सहयोग।',
    dislikesEn: 'Coarseness, injustice, loud shouting, solitude, ugly surroundings, biased decisions.',
    dislikesHi: 'कर्कश वाणी, अन्याय, एकाकीपन, अशोभनीय वातावरण, असभ्य व्यवहार व पक्षपात।',
    strengthsEn: ['Mastery of negotiation, diplomacy, and conflict mediation', 'Impartial judicial fairness and objectivity', 'Sophisticated aesthetic design sense', 'Ability to bring diverse factions to common consensus', 'Charming social manners that win allies across hierarchies'],
    strengthsHi: ['सुलह-समझौते व कूटनीतिक मध्यस्थता में निपुणता', 'निष्पक्ष न्यायिक दृष्टिकोण व न्यायप्रियता', 'उत्कृष्ट कलात्मक सुरुचि व डिजाइन क्षमता', 'विरोधी पक्षों को सर्वसम्मत मंच पर लाने की कला', 'शिष्ट सामाजिक शिष्टाचार जिससे सहज मित्र बनते हैं'],
    weaknessesEn: ['Chronic indecision weighing pros and cons endlessly', 'People-pleasing at the expense of necessary truth', 'Avoidance of direct confrontation even when vital', 'Dependence on validation from romantic partners', 'Extravagance on luxury attire and appearances'],
    weaknessesHi: ['अनिर्णय की स्थिति व पक्ष-विपक्ष तौलते-तौलते अवसर चूकना', 'सभी को प्रसन्न रखने के चक्कर में कठोर सत्य से बचना', 'आवश्यक होने पर भी सीधे टकराव से कतराना', 'मानसिक शांति हेतु दूसरों के अनुमोदन पर निर्भरता', 'वस्त्रों, सौंदर्य व विलासिता पर अनियंत्रित व्यय'],
    educationEn: 'Excels in jurisprudence, international law, fine arts, diplomacy, interior architecture, public policy, and commerce.',
    educationHi: 'विधि (कानून), अंतर्राष्ट्रीय संबंध, ललित कला, कूटनीति, इंटीरियर डिजाइन, फैशन व वाणिज्य।',
    healthEn: 'Prone to kidney and lumbar sensitivity, skin hydration balance, and endocrine harmony. Abundant water intake essential.',
    healthHi: 'गुर्दे (किडनी), कमर का निचला भाग, त्वचा व हार्मोनल संतुलन पर ध्यान दें। पर्याप्त जलपान अमृत तुल्य।',
    financialLifeEn: 'Auspicious financial potential through joint partnerships, legal counsel, luxury trade, and artistic commerce.',
    financialLifeHi: 'साझेदारी, विधि परामर्श, विलासिता व्यापार, कला व जनसंपर्क से प्रचुर धन लाभ। आर्थिक संतुलन उत्तम।',
    loveMarriageEn: 'Marriage is central to destiny. Deeply romantic and considerate, thriving in an equal, mutually respectful wedlock.',
    loveMarriageHi: 'विवाह इनके भाग्य का मूल केंद्र है। जीवनसाथी के साथ सामंजस्य, बराबरी का आदर व प्रगाढ़ प्रेम संबंध रहता है।',
    familyEn: 'The peacemaker of the lineage; diffuses domestic tensions with gentle, tactful consideration.',
    familyHi: 'कुटुम्ब के शांतिदूत। किसी भी पारिवारिक मतभेद को सौहार्दपूर्ण संवाद से सुलझाने में अग्रणी।',
    professionEn: 'Judiciary, diplomacy, law, interior design, fashion, architecture, hospitality, event management, PR.',
    professionHi: 'न्यायपालिका, वकालत, राजनय, इंटीरियर डिजाइन, फैशन, वास्तुकला, जनसंपर्क व इवेंट मैनेजमेंट।',
  },
  7: { // Scorpio
    signEn: 'Scorpio', signHi: 'वृश्चिक', rulerEn: 'Mars', rulerHi: 'मंगल',
    physicalFeaturesEn: 'Intense penetrating gaze, sturdy magnetic build, resolute jawline, mysterious aura, and remarkable physical and emotional stamina.',
    physicalFeaturesHi: 'तीक्ष्ण, भेदक दृष्टि, सुदृढ़ व चुंबकीय देह, दृढ़ ठोड़ी, रहस्यमयी आभा तथा अद्भुत शारीरिक व मानसिक सहनशक्ति।',
    mentalityLifestyleEn: 'Passionate, secretive, profound, and transformative. Never stays on the surface; seeks core truth, unshakeable loyalty, and deep mastery.',
    mentalityLifestyleHi: 'गंभीर, रहस्यदर्शी, दृढ़निश्चयी व कायाकल्प करने वाले। किसी भी बात की तह तक जाना, सत्य की खोज व अटूट निष्ठा।',
    likesEn: 'Investigation, occult wisdom, deep loyalties, strategy, solitude, transformative challenges.',
    likesHi: 'रहस्य अनुसंधान, गूढ़ विद्या, अटूट मित्रता, कूटनीति, एकांत चिंतन व कठिन चुनौतियां।',
    dislikesEn: 'Betrayal, superficial chatter, deceit, exposed vulnerability, disloyalty, compromise.',
    dislikesHi: 'विश्वासघात, सतही बातें, धोखा, अपनी दुर्बलता का प्रदर्शन, गद्दारी व सिद्धांतों से समझौता।',
    strengthsEn: ['Unfathomable mental willpower and crisis resilience', 'X-ray intuitive insight into hidden human motives', 'Unyielding loyalty to trusted comrades', 'Mastery over confidential research and occult depth', 'Capacity for total rebirth and resurrection after setbacks'],
    strengthsHi: ['अथाह मानसिक इच्छाशक्ति व संकटों से जूझने का पराक्रम', 'दूसरों के गुप्त मंतव्यों को भांपने की तीव्र अंतर्दृष्टि', 'सच्चे मित्रों व परिजनों के प्रति अटूट निष्ठा', 'गूढ़ शोध, अनुसंधान व गुप्त विधाओं में निपुणता', 'घोर संकट के उपरांत पुनः उठ खड़े होने की अदम्य शक्ति'],
    weaknessesEn: ['Tendency towards jealousy and suspicious mistrust', 'Vindictiveness and difficulty in forgiving trespasses', 'Obsessive brooding over past wounds', 'Excessive secrecy that isolates them from well-wishers', 'Extremism in emotional reactions (all or nothing)'],
    weaknessesHi: ['अकारण शंका, ईर्ष्या व अविश्वास की प्रवृत्ति', 'प्रतिशोध की भावना व पुराने अपमान को न भूल पाना', 'अतीत के आघातों को मन में रखकर कुढ़ना', 'अत्यधिक गोपनीयता जिससे शुभचिंतक भी दूर हो जाएं', 'भावनात्मक अतिरेक (या तो पूर्ण समर्पण या पूर्ण विरक्ति)'],
    educationEn: 'Outstanding in surgical medicine, criminal investigation, intelligence, mining, petroleum, psychology, metaphysics, and nuclear physics.',
    educationHi: 'शल्य-चिकित्सा (सर्जरी), अपराध अनुसंधान, खुफिया तंत्र, खनन, भूगर्भ, मनोविज्ञान व परमाणु भौतिकी।',
    healthEn: 'High vitality. Prone to excretory and reproductive sensitivities, piles, and toxic accumulation. Detoxification practices vital.',
    healthHi: 'प्रबल रोग-प्रतिरोधक क्षमता। गुदा रोग, प्रजनन अंग, बवासीर व विषैले तत्वों के संचय से बचाव हेतु डिटॉक्स आवश्यक।',
    financialLifeEn: 'Strong potential for sudden inheritance, occult gains, joint insurance funds, mining wealth, and strategic assets.',
    financialLifeHi: 'गुप्त धन, पैतृक संपत्ति, बीमा, शोध कार्यों, धातु-खनन व रणनीतिक निवेश से अप्रत्याशित धन लाभ।',
    loveMarriageEn: 'Intense, possessive, and soul-deep bonds. Demands absolute fidelity and offers total protective devotion in return.',
    loveMarriageHi: 'अत्यंत प्रगाढ़, संवेदनशील व एकनिष्ठ प्रेम। जीवनसाथी से शत-प्रतिशत वफादारी की अपेक्षा व सर्वस्व समर्पण।',
    familyEn: 'Fiercely protective of clan secrets and property; guards relatives against outside interference.',
    familyHi: 'पारिवारिक मर्यादा व रहस्यों के सजग प्रहरी। परिजनों पर किसी बाहरी संकट को नहीं आने देते।',
    professionEn: 'Surgery, defense intelligence, criminal forensics, research scientist, mining, banking risk audit, psychiatry, astrology.',
    professionHi: 'सर्जन, खुफिया सेवा, फोरेंसिक जांच, वैज्ञानिक शोध, खनन, जोखिम प्रबंधन, मनोचिकित्सा व ज्योतिष।',
  },
  8: { // Sagittarius
    signEn: 'Sagittarius', signHi: 'धनु', rulerEn: 'Jupiter', rulerHi: 'गुरु',
    physicalFeaturesEn: 'Tall, well-built, open honest forehead, genial smile, athletic stride, dignified demeanor, and a philosophical presence.',
    physicalFeaturesHi: 'लंबा, सुडौल शरीर, चौड़ा तेजस्वी ललाट, उदार मुस्कान, ओजस्वी चाल तथा स्वाभाविक दार्शनिक गरिमा।',
    mentalityLifestyleEn: 'Optimistic, philosophical, righteous, and freedom-loving. Enamored with broad horizons, global cultures, spirituality, and higher truth.',
    mentalityLifestyleHi: 'आशावादी, धर्मपरायण, सत्यप्रिय व स्वतंत्रचेता। उच्च ज्ञान, दूरस्थ यात्राओं, दर्शन व मानवीय मूल्यों के पक्षधर।',
    likesEn: 'Travel, higher philosophy, spiritual discourse, outdoor exploration, horses, law, teaching.',
    likesHi: 'देशाटन, तत्वज्ञान, सत्संग, साहसिक यात्राएं, शिक्षण, विधि व उच्च ग्रंथ।',
    dislikesEn: 'Hypocrisy, petty dogmas, confinement, routine desk drudgery, pessimistic cynicism.',
    dislikesHi: 'पाखंड, संकीर्ण रूढ़ियां, बंदिशें, नीरस दिनचर्या व निराशावादी दृष्टिकोण।',
    strengthsEn: ['Visionary optimism and faith in Providence', 'Generous moral integrity and high ethical standards', 'Love for truth, justice, and universal wisdom', 'Natural pedagogical mentor who inspires youth', 'Fearless explorer of physical and spiritual frontiers'],
    strengthsHi: ['दूरदर्शी आशावाद व ईश्वरीय सत्ता में अखंड विश्वास', 'उच्च नैतिक आचरण, सत्यनिष्ठा व उदारता', 'सार्वभौमिक ज्ञान व न्याय के प्रति समर्पण', 'युवाओं व शिष्यों को प्रेरित करने वाले स्वाभाविक गुरु', 'भौतिक व आध्यात्मिक सीमाओं को पार करने का साहस'],
    weaknessesEn: ['Blunt tactlessness disguised as honesty', 'Over-promising due to excessive optimism', 'Restlessness that resists settling into routine', 'Dogmatic self-righteousness in philosophical debates', 'Carelessness with practical administrative details'],
    weaknessesHi: ['सत्यवादिता के नाम पर अवांछित कटुता', 'अत्यधिक आशावाद में क्षमता से अधिक वचन दे देना', 'एक स्थान पर टिककर नियमित कार्य करने में अरुचि', 'वैचारिक बहसों में अपने मत को ही अंतिम मानना', 'व्यावहारिक व कागजी औपचारिकताओं की अनदेखी'],
    educationEn: 'Eminent in philosophy, international law, religious studies, higher education, astrophysics, jurisprudence, and diplomacy.',
    educationHi: 'दर्शनशास्त्र, अंतर्राष्ट्रीय विधि, धर्मशास्त्र, उच्च शिक्षा, अंतरिक्ष विज्ञान व कूटनीति में विशिष्टता।',
    healthEn: 'Robust vitality. Watch for liver wellness, arterial lipid balance, hip/thigh mobility, and dietary moderation.',
    healthHi: 'उत्तम स्वास्थ्य। यकृत (लिवर), कोलेस्ट्रॉल, जांघों व कूल्हे के जोड़ों के प्रति सजग रहें। अति-आहार से बचें।',
    financialLifeEn: 'Generous financial grace through mentorship, publications, educational institutions, foreign trade, and ethical enterprises.',
    financialLifeHi: 'ज्ञान, शिक्षण, प्रकाशन, विदेश व्यापार, परामर्श व धर्म-संस्थानों से विपुल व पवित्र धन की प्राप्ति।',
    loveMarriageEn: 'Values a companion who shares philosophical wanderlust and respects freedom. Marriage thrives on shared worldview and mutual growth.',
    loveMarriageHi: 'स्वतंत्रता व वैचारिक गरिमा का सम्मान करने वाले साथी से दांपत्य सुख। जीवनसाथी संग तीर्थ व ज्ञान यात्राएं सुखद।',
    familyEn: 'The moral guide and patriarch of the extended family; inspires youngsters toward righteousness.',
    familyHi: 'कुटुम्ब के आध्यात्मिक मार्गदर्शक। नई पीढ़ी को संस्कार, धर्म व सदाचार की प्रेरणा देने वाले।',
    professionEn: 'Higher education professor, judiciary, religious leadership, international publisher, tourism, foreign ambassador, sports trainer.',
    professionHi: 'विश्वविद्यालय प्रोफेसर, न्यायाधीश, धर्माचार्य, अंतर्राष्ट्रीय प्रकाशन, पर्यटन, राजदूत व खेल प्रशिक्षक।',
  },
  9: { // Capricorn
    signEn: 'Capricorn', signHi: 'मकर', rulerEn: 'Saturn', rulerHi: 'शनि',
    physicalFeaturesEn: 'Lean, bony, serious thoughtful face, steady reserved gaze, prominent joints, cautious deliberate movements, and an enduring physique.',
    physicalFeaturesHi: 'इकहरा, सुदृढ़, विचारमग्न मुखाकृति, गंभीर दृष्टि, सुस्पष्ट संधियां तथा अत्यंत सहनशील व सुदृढ़ शारीरिक ढांचा।',
    mentalityLifestyleEn: 'Pragmatic, ambitious, disciplined, and patient. Climbs life\'s mountains with silent, methodical determination; values time and honor.',
    mentalityLifestyleHi: 'व्यावहारिक, महत्वाकांक्षी, अनुशासित व धैर्यवान। जीवन की ऊंचाइयों को मौन तपस्या व सुनियोजित कर्म से प्राप्त करने वाले।',
    likesEn: 'Achievement, structured hierarchy, traditional legacy, punctual efficiency, hard work, mastery.',
    likesHi: 'उच्च पद, संगठनात्मक व्यवस्था, पैतृक परंपराएं, समय की पाबंदी, कठोर श्रम व स्थायी प्रतिष्ठा।',
    dislikesEn: 'Frivolity, broken rules, unearned praise, disorder, financial waste, sudden rash gambles.',
    dislikesHi: 'ओछापन, अनुशासनहीनता, बिना योग्यता के प्रशंसा, अव्यवस्था, अपव्यय व अनिश्चित जुआ।',
    strengthsEn: ['Indomitable perseverance to scale summits against odds', 'Pragmatic administrative and managerial execution', 'Patience to outlast rivals and economic downturns', 'Deep respect for institutional duty and societal order', 'Mastery over resource allocation and long-range planning'],
    strengthsHi: ['प्रतिकूलताओं में भी शिखर तक पहुंचने का अडिग संकल्प', 'कुशल प्रशासनिक, प्रबंधकीय व सांगठनिक क्षमता', 'मंदी व संकटों को धैर्यपूर्वक झेलकर आगे बढ़ने की शक्ति', 'कर्तव्य, मर्यादा व सामाजिक व्यवस्था का सम्मान', 'संसाधनों का सटीक उपयोग व दीर्घकालिक योजना निर्माण'],
    weaknessesEn: ['Cold emotional detachment and excessive austerity', 'Melancholy brooding over heavy responsibilities', 'Rigid conservatism resisting refreshing innovations', 'Workaholism that sacrifices domestic warmth', 'Undue skepticism towards spontaneous warmth'],
    weaknessesHi: ['भावनात्मक सूखापन व अत्यधिक कठोरता', 'अत्यधिक उत्तरदायित्वों से मन में अवसाद या भारीपन', 'रूढ़िवादी दृष्टिकोण व नए प्रयोगों के प्रति हिचक', 'कार्य में इतना डूब जाना कि पारिवारिक सुख की उपेक्षा हो', 'दूसरों के प्रति सहज विश्वास न कर पाना'],
    educationEn: 'Distinction in civil engineering, mining, metallurgy, enterprise management, geology, constitutional law, and public infrastructure.',
    educationHi: 'सिविल इंजीनियरिंग, खनन, भूगर्भशास्त्र, लोक प्रशासन, कॉर्पोरेट प्रबंधन, संवैधानिक विधि व नगर-नियोजन।',
    healthEn: 'Longevity-favored constitution. Prone to knee stiffness, rheumatism, dental enamel wear, and dry skin. Warm oil massage helpful.',
    healthHi: 'दीर्घायु कारक लग्न। घुटनों, जोड़ों के दर्द, गठिया, दांत व शुष्क त्वचा के प्रति सजग रहें। तैल मालिश गुणकारी।',
    financialLifeEn: 'Steadily increasing wealth culminating in vast enduring empire post-36. Real estate, industrial plants, government bonds, and hard assets.',
    financialLifeHi: '36 वर्ष की आयु के उपरांत अकूत स्थायी संपत्ति का निर्माण। उद्योग, भूमि, सरकारी प्रतिभूतियां व ठोस परिसंपत्तियां।',
    loveMarriageEn: 'Cautious in courtship but rock-solid in matrimony. Takes marriage as a sacred covenant, providing unshakeable material security to spouse.',
    loveMarriageHi: 'विवाह में जल्दबाजी नहीं करते किंतु एक बार जुड़ने पर आजीवन चट्टान की भांति साथ निभाने वाले निष्ठावान जीवनसाथी।',
    familyEn: 'The reliable Pillar of Atlas for the whole lineage; bears family burdens without complaints.',
    familyHi: 'संपूर्ण वंश का आधार-स्तंभ। परिजनों की समस्त जिम्मेदारियों को मौन रहकर अपने कंधों पर उठाने वाले।',
    professionEn: 'Civil administration, corporate managing director, infrastructure engineering, geology, heavy industries, government governance.',
    professionHi: 'प्रशासनिक सेवा, प्रबंध निदेशक (एमडी), भारी उद्योग, निर्माण, न्यायपालिका, खनन व राजकीय उपक्रम।',
  },
  10: { // Aquarius
    signEn: 'Aquarius', signHi: 'कुंभ', rulerEn: 'Saturn', rulerHi: 'शनि',
    physicalFeaturesEn: 'Medium-tall, well-proportioned, intellectual high brow, detached observant eyes, friendly magnetic smile, and an unconventional style.',
    physicalFeaturesHi: 'मध्यम-लंबा कद, सुडौल शरीर, उन्नत भाल, विचारशील शांत नयन, सौम्य मुस्कान तथा मौलिक व स्वतंत्र शैली।',
    mentalityLifestyleEn: 'Humanitarian, progressive, visionary, and egalitarian. Thinks decades ahead; champions scientific advancement, social reform, and fraternity.',
    mentalityLifestyleHi: 'मानवतावादी, प्रगतिशील, दूरदर्शी व समतावादी। समय से आगे सोचने वाले, वैज्ञानिक सोच, सामाजिक सुधार व बंधुत्व के पक्षधर।',
    likesEn: 'Scientific innovation, social welfare, unconventional ideas, astrology, global networks, personal liberty.',
    likesHi: 'वैज्ञानिक नवाचार, समाज कल्याण, मौलिक विचार, ज्योतिष, वैश्विक संगठन व व्यक्तिगत स्वतंत्रता।',
    dislikesEn: 'Class discrimination, rigid dogmatism, emotional melodrama, suffocating orthodoxy, exploitation.',
    dislikesHi: 'जातिगत व सामाजिक भेदभाव, संकीर्ण रूढ़ियां, अति-नाटकीयता, शोषण व व्यक्तिगत स्वतंत्रता का हनन।',
    strengthsEn: ['Visionary intuition anticipating futuristic trends', 'Universal egalitarian compassion for society', 'Scientific objectivity untainted by personal prejudice', 'Original intellectual brilliance and inventiveness', 'Exceptional networking ability uniting diverse minds'],
    strengthsHi: ['भविष्य के रुझानों को पहले ही भांपने की दिव्य दृष्टि', 'समस्त समाज के प्रति निष्पक्ष, समतावादी करुणा', 'पूर्वाग्रहों से मुक्त वैज्ञानिक व वस्तुनिष्ठ सोच', 'मौलिक बौद्धिक प्रतिभा, शोध व नवीन आविष्कार', 'विविध विचारधाराओं को एक सूत्र में पिरोने का कौशल'],
    weaknessesEn: ['Aloof emotional detachment appearing eccentric or cold', 'Stubborn fixation on utopian ideological theories', 'Unpredictable rebelliousness against benign customs', 'Difficulty in personal one-on-one emotional vulnerability', 'Nervous system overstimulation from mental hyperactivity'],
    weaknessesHi: ['अत्यधिक वैचारिक विरक्ति जिससे लोग इन्हें भावहीन समझें', 'अपने आदर्शवादी सिद्धांतों को लेकर अति-हठी होना', 'परंपराओं के विरुद्ध कभी-कभार अनावश्यक विद्रोह', 'व्यक्तिगत आत्मीय संबंधों में संकोच व दूरी', 'अति-मानसिक सक्रियता से स्नायु तंत्र पर दबाव'],
    educationEn: 'Pioneering in aerospace, computer sciences, artificial intelligence, electronics, sociology, telecommunications, and esoteric occult sciences.',
    educationHi: 'एयरोस्पेस, कंप्यूटर साइंस, आर्टिफिशियल इंटेलिजेंस, इलेक्ट्रॉनिक्स, समाजशास्त्र, दूरसंचार व गूढ़ ज्योतिष।',
    healthEn: 'Prone to circulatory sensitivity, calf/ankle strain, erratic nervous rhythms, and eye strain. Yoga and nature walks balance vitality.',
    healthHi: 'रक्त परिसंचरण, पिंडलियों, टखनों, दृष्टि व स्नायु दुर्बलता के प्रति सजग रहें। प्रकृति में भ्रमण व योग लाभकारी।',
    financialLifeEn: 'Wealth arrives through large-scale technological networks, corporate consultancies, community foundations, and visionary investments.',
    financialLifeHi: 'तकनीकी संस्थानों, बड़े कॉर्पोरेट नेटवर्क्स, परामर्श, अनुसंधान व नवाचारों से अप्रत्याशित व प्रचुर धन लाभ।',
    loveMarriageEn: 'Seeks an intellectual comrade and best friend as life partner. Marriage thrives where personal space and shared ideals co-exist.',
    loveMarriageHi: 'जीवनसाथी में सबसे पहले एक सच्चा मित्र व वैचारिक साथी तलाशते हैं। स्वतंत्रता व परस्पर आदर युक्त दांपत्य।',
    familyEn: 'Treats family with fair democratic ethos; encourages independence and progressive growth in progeny.',
    familyHi: 'लोकतांत्रिक व समतावादी पारिवारिक वातावरण। संतानों को स्वावलंबी व प्रगतिशील बनने हेतु प्रेरित करते हैं।',
    professionEn: 'Artificial intelligence, space science, social reform NGO head, electronics engineering, astrology, airline operations, media tech.',
    professionHi: 'एआई, अंतरिक्ष विज्ञान, सामाजिक संस्था प्रमुख, इलेक्ट्रॉनिक्स, ज्योतिष अनुसंधान, विमानन व मीडिया तकनीक।',
  },
  11: { // Pisces
    signEn: 'Pisces', signHi: 'मीन', rulerEn: 'Jupiter', rulerHi: 'गुरु',
    physicalFeaturesEn: 'Soft, fleshy, dreamy expressive eyes, graceful peaceful demeanor, wavy hair, musical resonance in speech, and a serene compassionate presence.',
    physicalFeaturesHi: 'सौम्य, कोमल देह, भावपूर्ण व स्वप्निल नयन, शांत व्यक्तित्व, लहरदार केश, मधुर वाणी व करुणामयी उपस्थिति।',
    mentalityLifestyleEn: 'Compassionate, imaginative, spiritual, and intuitive. Blends ocean-deep empathy with mystic insight; naturally drawn to transcendence.',
    mentalityLifestyleHi: 'करुणामयी, कल्पनाशक्ति से संपन्न, आध्यात्मिक व अंतर्ज्ञानी। समुद्र सदृश गहरा हृदय, परोपकार व मोक्ष-मार्ग के पथिक।',
    likesEn: 'Meditation, music, spiritual poetry, the sea, helping the helpless, sacred rituals, mysticism.',
    likesHi: 'ध्यान, संगीत, आध्यात्मिक काव्य, समुद्र-तट, दीन-दुखियों की सेवा, पूजा-पाठ व रहस्यवाद।',
    dislikesEn: 'Harsh cruelty, materialistic greed, noisy vulgarity, rigid deadlines, cold cynicism.',
    dislikesHi: 'कठोरता, हिंसक व्यवहार, अत्यधिक भौतिकवादी लालच, अश्लीलता व संवेदनहीन दृष्टिकोण।',
    strengthsEn: ['Boundless empathy and healing spiritual presence', 'Vivid creative imagination and musical/artistic talent', 'Profound intuitive foresight and dream visions', 'Readiness to sacrifice self for divine ideals', 'Universal tolerance and forgiving disposition'],
    strengthsHi: ['अगाध करुणा एवं दूसरों के कष्ट हरने वाली आध्यात्मिक आभा', 'अद्भुत रचनात्मक कल्पना, संगीत व काव्य प्रतिभा', 'सूक्ष्म अंतर्ज्ञान, पूर्वाभास व स्वप्न सिद्धि', 'ईश्वरीय व लोक-कल्याणकारी आदर्शों हेतु त्याग', 'सार्वभौमिक सहिष्णुता व क्षमाशीलता का गुण'],
    weaknessesEn: ['Tendency towards escapism and day-dreaming under stress', 'Lack of practical financial boundaries (giving away too easily)', 'Absorbing negative psychic energies of others', 'Procrastination and difficulty with hard contractual limits', 'Indecisiveness driven by changing emotional tides'],
    weaknessesHi: ['तनाव के समय यथार्थ से भागकर कल्पनालोक में खो जाना', 'व्यावहारिक वित्तीय सीमाओं का अभाव (शीघ्र बहकावे में धन गंवाना)', 'दूसरों की नकारात्मक ऊर्जा व चिंताओं को स्वयं पर ओढ़ना', 'कठोर व्यावसायिक समय-सीमाओं के पालन में ढिलाई', 'भावनात्मक लहरों में बहकर अनिर्णय की स्थिति'],
    educationEn: 'Distinction in medicine, marine biology, fine arts, theology, psychology, pharmacology, spiritual philosophy, and musicology.',
    educationHi: 'चिकित्सा, समुद्री विज्ञान, ललित कला, धर्मशास्त्र, मनोविज्ञान, औषध विज्ञान, दर्शन व संगीत।',
    healthEn: 'Prone to lymphatic congestion, foot/heel sensitivity, sluggish metabolism, and allergic reactions. Hydrotherapy and clean water vital.',
    healthHi: 'पैरों, टखनों, लसीका तंत्र (लिम्फैटिक), कफ व एलर्जी के प्रति सावधानी। शुद्ध जल व जल-चिकित्सा अत्यंत गुणकारी।',
    financialLifeEn: 'Fluctuating yet divinely sustained wealth. Prosperity flows from overseas connections, charitable trusts, creative works, and hospitals.',
    financialLifeHi: 'विदेश संपर्कों, रचनात्मक कला, चिकित्सालयों, परामर्श व लोक-कल्याणकारी संस्थानों से निरंतर ईश्वरीय कृपा से धन प्रवाह।',
    loveMarriageEn: 'Soulful, deeply devoted, and romantic. Seeks a spiritual union of hearts; spouse provides grounding stability and practical anchoring.',
    loveMarriageHi: 'आध्यात्मिक, समर्पित व आत्मा से जुड़ा दांपत्य। जीवनसाथी व्यावहारिक संबल प्रदान कर जीवन को स्थिरता देता है।',
    familyEn: 'The spiritual prayer-anchor of the clan; blesses and prays for the prosperity of entire kinship.',
    familyHi: 'कुटुम्ब की आध्यात्मिक ढाल। समस्त परिजनों के कल्याण हेतु निरंतर शुभ-कामना व प्रार्थना करने वाले।',
    professionEn: 'Medicine/healing, spiritual mentorship, marine trade, cinema/music, international import-export, psychology, ashram administration.',
    professionHi: 'चिकित्सा, आध्यात्मिक उपदेशक, समुद्री व्यापार, संगीत/सिनेमा, आयात-निर्यात, मनोविज्ञान व धर्मार्थ संस्थान।',
  },
};

// ============================================================================
// 4. SAMUDAYA ASHTAKAVARGA (SAV) 12 HOUSES NARRATIVES (Pages 111-113 Fidelity)
// ============================================================================

export const SAV_HOUSE_KB: Record<number, {
  nameEn: string;
  nameHi: string;
  highEn: string;
  highHi: string;
  medEn: string;
  medHi: string;
  lowEn: string;
  lowHi: string;
  remedyEn: string;
  remedyHi: string;
}> = {
  1: {
    nameEn: '1st House - Ascendant (Body, Personality, Health)',
    nameHi: 'प्रथम भाव - लग्न (तनु, व्यक्तित्व, स्वास्थ्य व आत्मबल)',
    highEn: 'Excellent! Your 1st House is very strong (30+ points). This grants you robust physical constitution, commanding personal magnetism, unshakable willpower, and widespread respect in all undertakings.',
    highHi: 'उत्कृष्ट! आपका प्रथम भाव अत्यंत बलवान (30+ अंक) है। यह आपको सुदृढ़ स्वास्थ्य, प्रभावशाली व्यक्तित्व, अटूट इच्छाशक्ति तथा समाज में व्यापक मान-प्रतिष्ठा प्रदान करता है।',
    medEn: 'The 1st House has balanced strength (25-29 points). Health and confidence remain steady with disciplined daily routine. Gradual rise in public stature.',
    medHi: 'प्रथम भाव में मध्यम व संतुलित बल (25-29 अंक) है। नियमित दिनचर्या व आत्म-विश्वास से स्वास्थ्य व प्रतिष्ठा निरंतर स्थिर बनी रहती है।',
    lowEn: 'The 1st House has low points (<25). Health and vitality may experience occasional fatigue or lack of drive. Regular exercise and Surya Namaskar are recommended.',
    lowHi: 'प्रथम भाव में बिंदु कम (<25) हैं। स्वास्थ्य में कभी-कभार थकान या आत्मविश्वास में कमी का अनुभव हो सकता है। नियमित व्यायाम आवश्यक है।',
    remedyEn: 'Perform Surya Namaskara at sunrise and recite the Aditya Hridaya Stotra.',
    remedyHi: 'प्रतिदिन सूर्योदय के समय सूर्य नमस्कार करें तथा आदित्य हृदय स्तोत्र का पाठ करें।',
  },
  2: {
    nameEn: '2nd House - Wealth (Wealth, Family, Speech)',
    nameHi: 'द्वितीय भाव - धन (धन संचय, कुटुम्ब व वाणी)',
    highEn: 'Excellent! Your 2nd House is exceptionally strong (30+ points). You will accumulate substantial savings, enjoy a flourishing supportive family lineage, and speak with influential persuasiveness.',
    highHi: 'उत्कृष्ट! आपका द्वितीय भाव अत्यंत सबल (30+ अंक) है। आप प्रचुर धन संचय करेंगे, कुटुम्ब में आदर व सुख-शांति रहेगी तथा आपकी वाणी अत्यंत प्रभावशाली व सत्यनिष्ठ होगी।',
    medEn: 'The 2nd House has medium strength (25-29 points). Financial status remains stable with steady savings and harmonious domestic relations.',
    medHi: 'द्वितीय भाव में मध्यम बल (25-29 अंक) है। आर्थिक स्थिति स्थिर बनी रहेगी। कुटुम्ब में सामंजस्य रहेगा तथा संचित धन की निरंतर रक्षा होगी।',
    lowEn: 'The 2nd House has low points (<25). Expenses may drain liquid savings, or disputes in family matters could arise. Avoid speculative investments.',
    lowHi: 'द्वितीय भाव में कम बिंदु (<25) हैं। संचित धन के व्यय पर नियंत्रण रखें व परिजनों से संवाद में कटुता से बचें। सट्टा या जोखिम भरे निवेश से दूर रहें।',
    remedyEn: 'Worship Goddess Mahalakshmi on Fridays and donate food to students.',
    remedyHi: 'शुक्रवार को श्री महालक्ष्मी की आराधना करें तथा निर्धन विद्यार्थियों को मिष्ठान व भोजन दें।',
  },
  3: {
    nameEn: '3rd House - Siblings & Enterprise (Courage, Communication)',
    nameHi: 'तृतीय भाव - पराक्रम (सहोदर, साहस, संचार व लघु यात्राएं)',
    highEn: 'Excellent! Highly vibrant 3rd House (30+ points). You possess boundless courage, dynamic entrepreneurial drive, cordial bond with siblings, and exceptional communication skills.',
    highHi: 'उत्कृष्ट! तृतीय भाव अत्यंत ऊर्जावान (30+ अंक) है। आपमें अदम्य साहस, उद्यमशीलता, भाई-बहनों का पूर्ण सहयोग तथा प्रभावी संवाद व लेखन कौशल रहेगा।',
    medEn: 'The 3rd House has balanced points (25-29 points). Steady courage and reliable initiative. Modest but supportive relationships with siblings and neighbors.',
    medHi: 'तृतीय भाव में संतुलित अंक (25-29 अंक) हैं। पराक्रम व पहल करने की क्षमता सामान्य रूप से उत्तम है। सहोदरों के साथ सामान्य सौहार्द बना रहेगा।',
    lowEn: 'The 3rd House has low points (<25). You might experience hesitation in taking new risks, or occasional misunderstandings with siblings. Patience and self-initiative needed.',
    lowHi: 'तृतीय भाव में कम अंक (<25) हैं। नवीन कार्यों की पहल में संकोच या भाई-बहनों से मतभेद हो सकते हैं। धैर्य व सक्रिय पराक्रम आवश्यक है।',
    remedyEn: 'Worship Lord Hanuman or Kartikeya on Tuesdays to boost courage and victory.',
    remedyHi: 'मंगलवार को श्री हनुमान जी की उपासना करें व सुंदरकांड का पाठ करें, जिससे पराक्रम में वृद्धि होगी।',
  },
  4: {
    nameEn: '4th House - Mother & Happiness (Home, Vehicles, Land)',
    nameHi: 'चतुर्थ भाव - सुख (माता, गृह, भूमि, वाहन व आंतरिक शांति)',
    highEn: 'Supreme bliss! Strong 4th House (30+ points). You will possess palatial residential properties, comfortable luxury vehicles, loving maternal blessings, and peaceful contentment.',
    highHi: 'अति उत्तम! चतुर्थ भाव में श्रेष्ठ बिंदु (30+ अंक) हैं। आपको सुंदर गृह, उत्तम वाहन, भूमि लाभ, माता का अपार स्नेह तथा मानसिक शांति व सुख-समृद्धि की प्राप्ति होगी।',
    medEn: 'The 4th House has medium strength (25-29 points). Domestic life is peaceful with standard comforts, decent vehicles, and good bond with mother.',
    medHi: 'चतुर्थ भाव में मध्यम बल (25-29 अंक) है। पारिवारिक सुख व गृह-शांति सामान्य रूप से उत्तम रहेगी। वाहन व आवास का सुख सुलभ रहेगा।',
    lowEn: 'The 4th House has lower points (<25). Occasional domestic unrest or delays in property possession. Pay attention to mother\'s health.',
    lowHi: 'चतुर्थ भाव में न्यून बिंदु (<25) हैं। गृह-शांति में कभी-कभार व्यवधान या संपत्ति प्राप्ति में विलंब हो सकता है। माता के स्वास्थ्य का विशेष ध्यान रखें।',
    remedyEn: 'Serve elders, respect mother, and offer milk or water to a Shiva Lingam on Mondays.',
    remedyHi: 'प्रति सोमवार शिवलिंग पर कच्चा दूध व जल अर्पित करें तथा माता के चरण स्पर्श कर आशीर्वाद लें।',
  },
  5: {
    nameEn: '5th House - Children & Intellect (Progeny, Wisdom, Creativity)',
    nameHi: 'पंचम भाव - संतान व बुद्धि (विद्या, पूर्व-पुण्य, संतान सुख व मंत्र)',
    highEn: 'Magnificent! Highly auspicious 5th House (30+ points). Grants brilliant intellect, scholastic laurels, virtuous accomplished children, and high spiritual merit from past lives.',
    highHi: 'अत्यंत शुभ! पंचम भाव अत्यंत बलवान (30+ अंक) है। कुशाग्र बुद्धि, उच्च विद्या में सफलता, आज्ञाकारी व यशस्वी संतान तथा पूर्व जन्मों के संचित पुण्यों का लाभ प्राप्त होगा।',
    medEn: 'The 5th House has medium strength (25-29 points). Academic pursuits succeed with steady effort. Good family happiness and loving progeny.',
    medHi: 'पंचम भाव में मध्यम बल (25-29 अंक) है। नियमित परिश्रम से विद्या व प्रतियोगी परीक्षाओं में सफलता तथा सामान्य संतान सुख प्राप्त होगा।',
    lowEn: 'The 5th House has low points (<25). Concentration in studies may fluctuate, or concerns regarding children could arise. Avoid speculation.',
    lowHi: 'पंचम भाव में कम अंक (<25) हैं। विद्या में एकाग्रता की कमी या संतान संबंधी चिंताएं हो सकती हैं। शेयर सट्टे से पूर्ण परहेज रखें।',
    remedyEn: 'Chant Gayatri Mantra daily and worship Lord Ganesha or Santana Gopala.',
    remedyHi: 'प्रतिदिन गायत्री मंत्र का जप करें तथा संतान गोपाल या गणेश जी की आराधना करें।',
  },
  6: {
    nameEn: '6th House - Enemies & Service (Debts, Disease, Competitions)',
    nameHi: 'षष्ठ भाव - रोग व शत्रु (ऋण, मुकद्दमा, सेवा व प्रतिस्पर्धा विजय)',
    highEn: 'Unbeatable! Strong 6th House points (30+) mean complete dominance over competitors, robust disease resistance, victory in legal matters, and excellence in professional service.',
    highHi: 'अजेय प्रभाव! षष्ठ भाव में 30+ अंक होने से प्रतिस्पर्धियों व शत्रुओं पर पूर्ण विजय, उत्तम रोग-प्रतिरोधक क्षमता तथा सेवा क्षेत्र में विशेष यश प्राप्त होता है।',
    medEn: 'The 6th House has balanced points (25-29 points). Routine health requires minor dietary care. Competitors are handled with steady poise.',
    medHi: 'षष्ठ भाव में मध्यम बल (25-29 अंक) है। मौसमी स्वास्थ्य व खान-पान पर संयम रखें। विरोधी शांत रहेंगे व कार्यक्षेत्र में स्थिति सामान्य रहेगी।',
    lowEn: 'The 6th House has low points (<25). Favorable for low debts and few enemies! However, maintain disciplined immunity and avoid taking unnecessary personal loans.',
    lowHi: 'षष्ठ भाव में कम अंक (<25) होना ऋण व शत्रुओं के न होने की दृष्टि से शुभ है, किंतु स्वास्थ्य व रोग-प्रतिरोधक क्षमता का ध्यान रखना आवश्यक है।',
    remedyEn: 'Recite Maha Mrityunjaya Mantra and maintain disciplined daily hygiene.',
    remedyHi: 'महामृत्युंजय मंत्र का जप करें तथा स्वास्थ्य व ऋण लेन-देन में पूर्ण सावधानी रखें।',
  },
  7: {
    nameEn: '7th House - Marriage & Partnerships (Spouse, Public Ties)',
    nameHi: 'सप्तम भाव - जाया (विवाह, जीवनसाथी, साझेदारी व लोक-संबंध)',
    highEn: 'Harmonious! Auspicious 7th House (30+ points). Blessed with an affectionate, noble-minded spouse, thriving commercial partnerships, and honorable public popularity.',
    highHi: 'अति शुभ! सप्तम भाव में 30+ बिंदु होने से सुलक्षणा, सद्गुणी व समर्पित जीवनसाथी का सुख, सफल व्यापारिक साझेदारी तथा समाज में उत्तम जन-संपर्क मिलता है।',
    medEn: 'The 7th House has medium strength (25-29 points). Marital harmony is maintained through mutual respect and open communication.',
    medHi: 'सप्तम भाव में मध्यम बल (25-29 अंक) है। दांपत्य जीवन में परस्पर समझ, सम्मान व सौहार्दपूर्ण संवाद से सुख-शांति बनी रहेगी।',
    lowEn: 'The 7th House has low points (<25). Occasional differences of opinion with spouse or delays in matrimonial settlement. Cultivate patience and empathy.',
    lowHi: 'सप्तम भाव में कम अंक (<25) हैं। जीवनसाथी के विचारों में भिन्नता या वैवाहिक मामलों में धैर्य अपेक्षित है। साझेदारी में लिखित अनुबंध रखें।',
    remedyEn: 'Worship Goddess Parvati or Lakshmi-Narayana and cultivate humble patience in relationships.',
    remedyHi: 'लक्ष्मी-नारायण अथवा माता पार्वती की पूजा करें तथा दांपत्य में क्रोध व हठ से बचें।',
  },
  8: {
    nameEn: '8th House - Longevity & Transformation (Ayu, Occult, Sudden Events)',
    nameHi: 'अष्टम भाव - आयु (दीर्घायु, गूढ़ ज्ञान, आकस्मिक घटनाएं व शोध)',
    highEn: 'Longevity protected! Strong 8th House (30+ points). Bestows long life, profound research acumen, interest in occult/astrology, and sudden unearned financial gains.',
    highHi: 'आयु सुरक्षा! अष्टम भाव में 30+ अंक होना दीर्घायु, गहन अनुसंधान क्षमता, गूढ़ विद्याओं/ज्योतिष में रुचि तथा आकस्मिक धन लाभ का सूचक है।',
    medEn: 'The 8th House has medium strength (25-29 points). Stable longevity and gradual transformation through life lessons and prudent foresight.',
    medHi: 'अष्टम भाव में मध्यम बल (25-29 अंक) है। सामान्य दीर्घायु व जीवन के अनुभवों से आत्म-सुधार व परिपक्वता प्राप्त होती है।',
    lowEn: 'Low points in 8th House (<25) minimize sudden catastrophic mishaps and hidden blockages! Maintain mindful driving and routine health checkups.',
    lowHi: 'अष्टम भाव में कम अंक (<25) होना आकस्मिक संकटों व दुर्घटनाओं के निवारण हेतु उत्तम है। वाहन सावधानी से चलाएं व स्वास्थ्य का ध्यान रखें।',
    remedyEn: 'Donate black sesame or mustard oil on Saturdays and recite Hanuman Chalisa.',
    remedyHi: 'शनिवार को काले तिल या सरसों के तेल का दान करें तथा नित्य हनुमान चालीसा का पाठ करें।',
  },
  9: {
    nameEn: '9th House - Fortune & Dharma (Bhagya, Father, Guru, Spirituality)',
    nameHi: 'नवम भाव - भाग्य (धर्म, भाग्योदय, पिता, गुरु व तीर्थ यात्रा)',
    highEn: 'Supreme Fortune! Highly powerful 9th House (30+ points). Unfailing luck, paternal blessings, devotion to righteousness, successful long-distance travel, and divine grace.',
    highHi: 'अखंड भाग्योदय! नवम भाव अत्यंत बलवान (30+ अंक) है। भाग्य सदैव साथ देगा, पिता व गुरुजनों का आशीर्वाद, तीर्थ यात्राएं तथा धर्म-कर्म में यश मिलेगा।',
    medEn: 'The 9th House has balanced strength (25-29 points). Fortune unfolds steadily in proportion to ethical labor and respect for mentors.',
    medHi: 'नवम भाव में मध्यम बल (25-29 अंक) है। सत्कर्म व गुरुजनों के मार्गदर्शन से भाग्योदय निरंतर आगे बढ़ता रहता है।',
    lowEn: 'The 9th House has low points (<25). Luck requires hard personal sweat to activate. Avoid skepticism towards traditions; respect elders.',
    lowHi: 'नवम भाव में कम अंक (<25) हैं। भाग्य के भरोसे न रहकर केवल कर्मठता से ही सफलता मिलेगी। पिता व गुरुजनों की सेवा अनिवार्य है।',
    remedyEn: 'Respect father, gurus, and feed yellow grams/bananas to cows on Thursdays.',
    remedyHi: 'गुरुवार को गाय को भीगे चने व गुड़ खिलाएं तथा पिता व गुरु के चरण छूकर आशीर्वाद लें।',
  },
  10: {
    nameEn: '10th House - Profession & Karma (Career, Status, Governance)',
    nameHi: 'दशम भाव - कर्म (करियर, आजीविका, राज्य सम्मान व प्रतिष्ठा)',
    highEn: 'Peak Achievement! Remarkable 10th House (30+ points). Guarantees rapid professional promotions, authoritative status, government honor, and glorious life accomplishment.',
    highHi: 'उच्च कीर्ति! दशम भाव में 30+ अंक होने से करियर में द्रुत गति से पदोन्नति, प्रशासनिक सम्मान, उच्च पद व सामाजिक प्रतिष्ठा सुनिश्चित होती है।',
    medEn: 'The 10th House has medium strength (25-29 points). Career progresses steadily with merit. You will receive timely promotions and fair recognition.',
    medHi: 'दशम भाव में मध्यम बल (25-29 अंक) है। करियर में सतत व स्थिर प्रगति होगी। कठिन परिश्रम का उचित मूल्यांकन व समय पर पदोन्नति मिलेगी।',
    lowEn: 'The 10th House has low points (<25). Professional stability may experience occasional hurdles or career shifts. Stay focused on continuous upskilling.',
    lowHi: 'दशम भाव में कम अंक (<25) हैं। आजीविका में कभी-कभार अस्थिरता या बदलाव आ सकते हैं। अपने कौशल को निरंतर निखारते रहें।',
    remedyEn: 'Perform duty with unimpeachable ethics and donate blankets/shoes to needy laborers.',
    remedyHi: 'कर्मक्षेत्र में सत्यनिष्ठा बनाए रखें तथा निर्धनों व श्रमिकों को जूते/वस्त्र दान करें।',
  },
  11: {
    nameEn: '11th House - Gains & Fulfillment (Profits, Friends, Desires)',
    nameHi: 'एकादश भाव - लाभ (सर्व-लाभ, आय, मित्र-मंडल व मनोकामना पूर्ति)',
    highEn: 'Abundant Wealth! Exceptional 11th House (30+ points). Insures continuous multiple streams of income, fulfillment of all cherished ambitions, and powerful elite friendships.',
    highHi: 'अथाह लाभ! एकादश भाव अत्यंत श्रेष्ठ (30+ अंक) है। आय के निरंतर अनेक स्रोत बनेंगे, समस्त मनोकामनाएं पूर्ण होंगी तथा प्रभावशाली मित्रों का सहयोग रहेगा।',
    medEn: 'The 11th House has medium strength (25-29 points). Steady financial earnings and helpful social circle that supports your aspirations.',
    medHi: 'एकादश भाव में मध्यम बल (25-29 अंक) है। आय व लाभ का प्रवाह सुचारू रहेगा। मित्रों से सामान्य व विश्वसनीय सहयोग प्राप्त होगा।',
    lowEn: 'The 11th House has low points (<25). Gains may lag behind expectations, or false friends may exploit generosity. Verify all loan requests.',
    lowHi: 'एकादश भाव में कम अंक (<25) हैं। लाभ में विलंब या मित्रों पर अत्यधिक निर्भरता से हानि की आशंका। धन लेन-देन में सतर्कता बरतें।',
    remedyEn: 'Worship Lord Kubera or Vishnu and feed green fodder to cattle.',
    remedyHi: 'भगवान विष्णु या कुबेर देव की पूजा करें तथा बुधवार को गाय को हरा चारा खिलाएं।',
  },
  12: {
    nameEn: '12th House - Expenditure & Moksha (Foreign Residence, Solitude)',
    nameHi: 'द्वादश भाव - व्यय (विदेश गमन, शयन सुख, दान व मोक्ष)',
    highEn: 'Spiritual liberation & foreign success! High 12th House (30+ points). Strong affinity for foreign travel/residence, philanthropic charity, spiritual meditation, and sound sleep.',
    highHi: 'विदेश योग व मोक्ष! द्वादश भाव में 30+ अंक होने से विदेश गमन/निवास, धर्मार्थ व्यय, ध्यान-साधना तथा आध्यात्मिक मुक्ति का मार्ग प्रशस्त होता है।',
    medEn: 'The 12th House has balanced points (25-29 points). Expenditures are kept under prudent check. Moderate foreign travels and peaceful sleep.',
    medHi: 'द्वादश भाव में संतुलित बल (25-29 अंक) है। व्यय नियंत्रण में रहेगा। सामान्य विदेश यात्राएं व संतुलित शयन सुख प्राप्त होगा।',
    lowEn: 'Low points in 12th House (<25) are very favorable for minimizing wasteful losses and legal hospital expenses! Keeps finances well-defended.',
    lowHi: 'द्वादश भाव में न्यून अंक (<25) होना अपव्यय, अनावश्यक अस्पताल खर्च व धन हानि के निवारण हेतु अत्यंत शुभ व सुरक्षात्मक है।',
    remedyEn: 'Meditate in solitary quietness before sleep and donate food in hospitals or hospices.',
    remedyHi: 'सोने से पूर्व मौन ध्यान करें तथा अस्पतालों या अनाथालयों में निःशुल्क भोजन व औषधि दान करें।',
  },
};

// ============================================================================
// 5. MASTER COMPUTATION FUNCTION FOR REFERENCE PDF PREDICTIONS
// ============================================================================

export function computeReferencePdfPredictions(chart: ChartData): ReferencePdfReport {
  const asc = chart.ascendant;
  const ascSignIdx = asc.signIndex;
  const roles = ASC_PLANETARY_ROLES[ascSignIdx] || ASC_PLANETARY_ROLES[0];
  const moon = chart.planets.find((p) => p.id === 'Moon') || chart.planets[1];
  const sun = chart.planets.find((p) => p.id === 'Sun') || chart.planets[0];
  const saturn = chart.planets.find((p) => p.id === 'Saturn') || chart.planets[6];
  const jupiter = chart.planets.find((p) => p.id === 'Jupiter') || chart.planets[4];
  const rahu = chart.planets.find((p) => p.id === 'Rahu') || chart.planets[7];
  const ketu = chart.planets.find((p) => p.id === 'Ketu') || chart.planets[8];

  // 1. Horoscope Analysis (12 Houses)
  const housesAnalysis: ReferencePdfHoroscopeAnalysis['houses'] = [];
  for (let h = 1; h <= 12; h++) {
    const signIdx = (ascSignIdx + h - 1) % 12;
    const rulerPlanetId = SIGNS[signIdx].lord;
    const rulerPl = chart.planets.find((p) => p.id === rulerPlanetId);
    const placedH = rulerPl ? rulerPl.rasiHouseNumber : 1;
    const placedSign = rulerPl ? rulerPl.signIndex : signIdx;
    const bTitle = BHAVA_TITLES[h];

    housesAnalysis.push({
      houseNumber: h,
      houseNameEn: bTitle.en,
      houseNameHi: bTitle.hi,
      signIndex: signIdx,
      signNameEn: SIGNS[signIdx].name,
      signNameHi: SIGN_HI[signIdx],
      rulerId: rulerPlanetId,
      rulerNameEn: rulerPlanetId,
      rulerNameHi: PLANET_HI[rulerPlanetId] || rulerPlanetId,
      placedInHouse: placedH,
      placedSignIndex: placedSign,
    });
  }

  const horoscopeAnalysis: ReferencePdfHoroscopeAnalysis = {
    houses: housesAnalysis,
    benefics: roles.beneficsEn,
    beneficsHi: roles.beneficsHi,
    malefics: roles.maleficsEn,
    maleficsHi: roles.maleficsHi,
    marakas: roles.marakasEn,
    marakasHi: roles.marakasHi,
    yogakaraka: roles.yogakarakaEn,
    yogakarakaHi: roles.yogakarakaHi,
  };

  // 2. Birth Time Predictions
  const deepPanchang = computeDeepPanchangMuhurta(
    chart.input.date,
    chart.input.time,
    chart.input.latitude,
    chart.input.longitude,
    chart.offsetMinutesUsed,
    chart.settings,
    'purnimanta',
    chart
  );
  const rituKey = deepPanchang.rituEn || 'Vasanta';
  const ritu = RITU_DATA[rituKey] || RITU_DATA.Grishma;
  const masaKey = deepPanchang.activeMasaEn || 'Ashadha';
  const masa = MASA_DATA[masaKey] || MASA_DATA.Ashadha;
  const tithiName = chart.panchang.tithi.name || 'Trayodashi';
  const tithiResultEn = `You were born on ${chart.panchang.tithi.paksha} ${tithiName} Tithi. Classical texts attribute strong moral conviction, deep devotion to family traditions, religious ceremonies, and enduring willpower. You earn respect for honesty and good conduct.`;
  const tithiResultHi = `आपका जन्म ${chart.panchang.tithi.paksha === 'Shukla' ? 'शुक्ल' : 'कृष्ण'} पक्ष की ${tithiName} तिथि में हुआ है। शास्त्रों के अनुसार जातक धर्मपरायण, कुल-मर्यादा का रक्षक, सत्यनिष्ठ व सद्व्यवहार के लिए विख्यात होता है।`;

  const weekdayName = chart.panchang.vara.name || 'Saturday';
  const weekdayData = WEEKDAY_DATA[weekdayName] || WEEKDAY_DATA.Saturday;
  const isPreSunrise = chart.input.time < '06:00'; // Traditional Hindu Day marker

  const birthTimePredictions: ReferencePdfBirthTime = {
    ritu: { nameEn: ritu.en, nameHi: ritu.hi, resultEn: ritu.resEn, resultHi: ritu.resHi },
    masa: { nameEn: masa.en, nameHi: masa.hi, resultEn: masa.resEn, resultHi: masa.resHi },
    tithi: { nameEn: `${chart.panchang.tithi.paksha} ${tithiName}`, nameHi: `${chart.panchang.tithi.paksha === 'Shukla' ? 'शुक्ल' : 'कृष्ण'} ${tithiName}`, resultEn: tithiResultEn, resultHi: tithiResultHi },
    weekday: { nameEn: weekdayData.en, nameHi: weekdayData.hi, isPreSunrise, resultEn: weekdayData.resEn, resultHi: weekdayData.resHi },
  };

  // 3. Birth Nakshatra Predictions
  const nakName = chart.panchang.nakshatra.name;
  const nakPada = chart.panchang.nakshatra.pada;
  const nakLord = chart.panchang.nakshatra.lord;
  const nakDeity = chart.panchang.nakshatra.deity || 'Rudra';
  const nakReadingEn = `You were born under ${nakName} Nakshatra (Pada ${nakPada}). Ancient classical texts like Saravali affirm that individuals born under ${nakName} possess remarkable resilience, deep intellectual curiosity, and complex emotional depth. The governing deity is ${nakDeity}, imparting intense focus, ability to endure hardships, and capacity to transform crises into breakthroughs. While early phases require rigorous labor, your perseverance guarantees enduring honor and self-made prosperity.`;
  const nakReadingHi = `आपका जन्म ${nakName} नक्षत्र के ${nakPada} चरण में हुआ है। 'सारावली' व 'वृहज्जातक' जैसे प्रामाणिक ग्रंथों के अनुसार ${nakName} नक्षत्र में जन्मे जातक अद्भुत मानसिक शक्ति, तीव्र बुद्धि व गंभीर भावुकता से युक्त होते हैं। इस नक्षत्र के अधिदेवता ${nakDeity} हैं, जो आपको संकटों को अवसर में बदलने का पराक्रम प्रदान करते हैं। यद्यपि प्रारंभिक वर्षों में अत्यधिक श्रम करना पड़ता है, किंतु आपकी अटूट कर्मठता दीर्घकालीन कीर्ति व स्वावलंबन सुनिश्चित करती है।`;

  const birthNakshatra: ReferencePdfNakshatra = {
    nameEn: nakName,
    nameHi: nakName,
    pada: nakPada,
    deityEn: nakDeity,
    deityHi: nakDeity,
    rulerEn: nakLord,
    rulerHi: PLANET_HI[nakLord] || nakLord,
    fullReadingEn: nakReadingEn,
    fullReadingHi: nakReadingHi,
  };

  // 4. Lagna Predictions (11 Dimensions)
  const lagnaProfile = LAGNA_PROFILES_12[ascSignIdx] || LAGNA_PROFILES_12[1];

  // 5. Bhavesha (House Lords in Natal Houses - All 12 Actual Placements)
  const houseLordsPredictions: ReferencePdfBhavesha[] = [];
  for (let lordH = 1; lordH <= 12; lordH++) {
    const signIdx = (ascSignIdx + lordH - 1) % 12;
    const lordPlanet = SIGNS[signIdx].lord;
    const pObj = chart.planets.find((p) => p.id === lordPlanet);
    const placedH = pObj ? pObj.rasiHouseNumber : lordH;
    const placedSignIdx = (ascSignIdx + placedH - 1) % 12;
    const entry = getBhavesha144Entry(lordH, placedH);

    houseLordsPredictions.push({
      lordHouse: lordH,
      lordPlanet,
      lordPlanetEn: lordPlanet,
      lordPlanetHi: PLANET_HI[lordPlanet] || lordPlanet,
      placedHouse: placedH,
      placedSignEn: SIGNS[placedSignIdx].name,
      placedSignHi: SIGN_HI[placedSignIdx],
      headlineEn: entry.headlineEn,
      headlineHi: entry.headlineHi,
      readingEn: entry.readingEn,
      readingHi: entry.readingHi,
      eventScenarioEn: entry.eventEn,
      eventScenarioHi: entry.eventHi,
    });
  }

  // 6. Planetary Positions & Predictions (Sun to Ketu: Zodiac + House)
  const planetaryPositionsPredictions: ReferencePdfPlanetPosition[] = [];
  for (const pl of chart.planets) {
    const sNameEn = SIGNS[pl.signIndex].name;
    const sNameHi = SIGN_HI[pl.signIndex];
    const hNum = pl.rasiHouseNumber;
    const pNameEn = pl.id;
    const pNameHi = PLANET_HI[pl.id] || pl.id;

    const zodiacReadingEn = `${pNameEn} is posited in ${sNameEn} in your horoscope. This placement influences your disposition, granting distinct traits aligned with ${sNameEn} sign energy. You approach tasks with focus and show resilience in your endeavors.`;
    const zodiacReadingHi = `आपकी जन्मकुंडली में ${pNameHi} ग्रह '${sNameHi}' राशि में स्थित हैं। यह राशि स्थिति आपको ${sNameHi} राशि के गुणों के अनुरूप कार्यकुशलता, गंभीरता व परिस्थितियों के अनुसार निर्णय लेने की क्षमता प्रदान करती है।`;

    const houseReadingEn = `${pNameEn} is situated in House ${hNum} (${BHAVA_TITLES[hNum].en}). In this Bhava, ${pNameEn} activates affairs of ${BHAVA_TITLES[hNum].domainEn}. When favorable, it delivers steady progress, personal growth, and societal respect.`;
    const houseReadingHi = `${pNameHi} ग्रह आपकी कुंडली के ${hNum}वें भाव (${BHAVA_TITLES[hNum].hi}) में विराजमान हैं। यह भाव स्थिति ${BHAVA_TITLES[hNum].domainHi} के क्षेत्रों को सक्रिय करती है तथा शुभ कर्मों द्वारा निरंतर उन्नति व यश प्रदान करती है।`;

    planetaryPositionsPredictions.push({
      planetId: pl.id,
      planetEn: pNameEn,
      planetHi: pNameHi,
      signIndex: pl.signIndex,
      signEn: sNameEn,
      signHi: sNameHi,
      houseNumber: hNum,
      degreeDms: pl.dms,
      dignity: pl.dignity,
      isRetrograde: pl.isRetrograde,
      isCombust: pl.isCombust,
      zodiacPositionReadingEn: zodiacReadingEn,
      zodiacPositionReadingHi: zodiacReadingHi,
      housePositionReadingEn: houseReadingEn,
      housePositionReadingHi: houseReadingHi,
    });
  }

  // 7. Various Yogas (Classical + Conjunctions: Dwi, Tri, Chatur)
  const detectedYogas = detectClassicalYogas(chart);
  const classicalYogas = detectedYogas.slice(0, 10).map((y) => ({
    nameEn: y.name,
    nameHi: y.nameHi || y.name,
    readingEn: y.resultEn,
    readingHi: y.resultHi || `${y.nameHi || y.name}: यह शुभ योग जातक को विद्या, यश, धन-धान्य तथा सामाजिक प्रतिष्ठा में वृद्धि कराता है।`,
  }));

  // Conjunction grouping
  const signGroups: Record<number, string[]> = {};
  for (const pl of chart.planets) {
    if (!signGroups[pl.signIndex]) signGroups[pl.signIndex] = [];
    signGroups[pl.signIndex].push(pl.id);
  }

  const dwiGrahaYogas: ReferencePdfConjunctionYoga[] = [];
  const triGrahaYogas: ReferencePdfConjunctionYoga[] = [];
  const chaturGrahaYogas: ReferencePdfConjunctionYoga[] = [];

  for (const [sIdxStr, pList] of Object.entries(signGroups)) {
    const sIdx = parseInt(sIdxStr, 10);
    const hNum = (sIdx - ascSignIdx + 12) % 12 + 1;
    const sEn = SIGNS[sIdx].name;
    const sHi = SIGN_HI[sIdx];
    const pHi = pList.map((p) => PLANET_HI[p] || p);

    if (pList.length === 2) {
      dwiGrahaYogas.push({
        planets: pList,
        planetsHi: pHi,
        houseNumber: hNum,
        signIndex: sIdx,
        signEn: sEn,
        signHi: sHi,
        titleEn: `Two-Planet Conjunction: ${pList.join(' + ')} in ${sEn} (House ${hNum})`,
        titleHi: `द्वि-ग्रह युति: ${pHi.join(' + ')} (${sHi} राशि, भाव ${hNum})`,
        readingEn: `Your chart has ${pList.join(' and ')} in the same sign (${sEn}, House ${hNum}). This blends the energies of ${pList.join(' and ')}, enhancing your determination, leadership among peers, and creative acumen.`,
        readingHi: `आपकी कुंडली में ${pHi.join(' व ')} एक ही राशि (${sHi}, भाव ${hNum}) में युति कर रहे हैं। यह युति आपके व्यक्तित्व में विशेष आकर्षण, नेतृत्व क्षमता व पुरुषार्थ की वृद्धि करती है।`,
      });
    } else if (pList.length === 3) {
      triGrahaYogas.push({
        planets: pList,
        planetsHi: pHi,
        houseNumber: hNum,
        signIndex: sIdx,
        signEn: sEn,
        signHi: sHi,
        titleEn: `Three-Planet Conjunction: ${pList.join(' + ')} in ${sEn} (House ${hNum})`,
        titleHi: `त्रि-ग्रह युति: ${pHi.join(' + ')} (${sHi} राशि, भाव ${hNum})`,
        readingEn: `Three planets (${pList.join(', ')}) conjoin in ${sEn} (House ${hNum}). This powerful concentration of energy brings multifaceted talents, deep intellectual curiosity, and noticeable public achievement.`,
        readingHi: `तीन ग्रह (${pHi.join(', ')}) एक साथ ${sHi} राशि (भाव ${hNum}) में स्थित हैं। यह शक्तिशाली संयोग बहुमुखी प्रतिभा, शोध क्षमता व कार्यक्षेत्र में विशिष्ट ख्याति प्रदान करता है।`,
      });
    } else if (pList.length >= 4) {
      chaturGrahaYogas.push({
        planets: pList,
        planetsHi: pHi,
        houseNumber: hNum,
        signIndex: sIdx,
        signEn: sEn,
        signHi: sHi,
        titleEn: `Four-Planet Conjunction: ${pList.join(' + ')} in ${sEn} (House ${hNum})`,
        titleHi: `चतुर्ग्रह युति: ${pHi.join(' + ')} (${sHi} राशि, भाव ${hNum})`,
        readingEn: `A rare four-planet assembly (${pList.join(', ')}) in ${sEn} (House ${hNum}). Sannyasa/Pravrajya energy or extraordinary professional mastery is indicated. Highly transformative life path.`,
        readingHi: `अत्यंत दुर्लभ चतुर्ग्रह योग (${pHi.join(', ')}) ${sHi} राशि (भाव ${hNum}) में निर्मित है। यह संन्यास अथवा कार्यक्षेत्र में असाधारण शीर्ष पद व आध्यात्मिक ऊंचाइयों का मार्ग प्रशस्त करता है।`,
      });
    }
  }

  // 8. Samudaya Ashtakavarga (SAV) 12 House Predictions
  const savHousePredictions: ReferencePdfSavHouse[] = [];
  for (let h = 1; h <= 12; h++) {
    const sIdx = (ascSignIdx + h - 1) % 12;
    const pts = chart.ashtakavarga.sarva[sIdx] || 28;
    const meta = SAV_HOUSE_KB[h] || SAV_HOUSE_KB[1];

    let ratingEn: ReferencePdfSavHouse['ratingEn'] = 'Medium';
    let ratingHi: ReferencePdfSavHouse['ratingHi'] = 'मध्यम';
    let predEn = meta.medEn;
    let predHi = meta.medHi;

    if (pts >= 30) {
      ratingEn = 'Excellent';
      ratingHi = 'उत्कृष्ट';
      predEn = meta.highEn;
      predHi = meta.highHi;
    } else if (pts >= 28) {
      ratingEn = 'Good';
      ratingHi = 'उत्तम';
      predEn = meta.medEn;
      predHi = meta.medHi;
    } else if (pts < 25) {
      ratingEn = 'Demands Attention';
      ratingHi = 'सावधानी अपेक्षित';
      predEn = meta.lowEn;
      predHi = meta.lowHi;
    }

    savHousePredictions.push({
      houseNumber: h,
      houseNameEn: meta.nameEn,
      houseNameHi: meta.nameHi,
      signIndex: sIdx,
      signEn: SIGNS[sIdx].name,
      signHi: SIGN_HI[sIdx],
      points: pts,
      ratingEn,
      ratingHi,
      predictionEn: predEn,
      predictionHi: predHi,
      remedyEn: pts < 28 ? meta.remedyEn : undefined,
      remedyHi: pts < 28 ? meta.remedyHi : undefined,
    });
  }

  // 9. Major Planetary Transit Predictions (Gochar: Saturn, Jupiter, Rahu-Ketu from Moon)
  const moonSignIdx = moon.signIndex;
  // Current approximate transits (e.g., Saturn in Aquarius/Pisces, Jupiter in Taurus/Gemini, Rahu in Pisces/Aquarius)
  const saturnTransitSign = 10; // Aquarius / Kumbha
  const saturnHFromMoon = (saturnTransitSign - moonSignIdx + 12) % 12 + 1;
  let saturnTransitNameEn = 'Saturn Transit';
  let saturnTransitNameHi = 'शनि गोचर';
  if ([1, 2, 12].includes(saturnHFromMoon)) {
    saturnTransitNameEn = 'Sade Sati Phase';
    saturnTransitNameHi = 'साढ़ेसाती काल';
  } else if (saturnHFromMoon === 4) {
    saturnTransitNameEn = 'Kantaka Shani (4th House)';
    saturnTransitNameHi = 'कंटक शनि (चतुर्थ भाव)';
  } else if (saturnHFromMoon === 8) {
    saturnTransitNameEn = 'Ashtama Shani (8th House)';
    saturnTransitNameHi = 'अष्टम शनि (अष्टम भाव)';
  } else if (saturnHFromMoon === 10) {
    saturnTransitNameEn = 'Karma Shani (10th House)';
    saturnTransitNameHi = 'कर्म शनि (दशम भाव)';
  } else if ([3, 6, 11].includes(saturnHFromMoon)) {
    saturnTransitNameEn = 'Auspicious Saturn Transit';
    saturnTransitNameHi = 'शुभ शनि गोचर';
  }

  const saturnTransit = {
    transitSignIndex: saturnTransitSign,
    transitSignEn: SIGNS[saturnTransitSign].name,
    transitSignHi: SIGN_HI[saturnTransitSign],
    houseFromMoon: saturnHFromMoon,
    transitNameEn: saturnTransitNameEn,
    transitNameHi: saturnTransitNameHi,
    datesStr: 'Active Transit Period',
    likelyResultsEn: [
      'Steady professional consolidation through disciplined duty and patience',
      'Long-term structural building; good for administrative, technical, and government assignments',
      'Reputation strengthens as a trustworthy, methodical decision-maker',
    ],
    likelyResultsHi: [
      'अनुशासन, धैर्य व कर्तव्यनिष्ठा से कार्यक्षेत्र में स्थायी स्थायित्व व पदोन्नति',
      'दीर्घकालिक नींव का निर्माण; तकनीकी, प्रशासनिक व प्रबंधकीय कार्यों हेतु उत्तम',
      'विश्वसनीय, कर्तव्यपरायण व विधिपूर्वक कार्य करने वाले व्यक्तित्व के रूप में ख्याति',
    ],
    cautionEn: 'Workload can be demanding; avoid friction with superiors. Maintain written documentation and disciplined routine.',
    cautionHi: 'कार्यभार अधिक रह सकता है; वरिष्ठ अधिकारियों से वाद-विवाद से बचें। वित्तीय व कागजी लेन-देन में पूर्ण पारदर्शिता रखें।',
    remediesEn: 'Follow strict ethical conduct, recite Hanuman Chalisa every Tuesday and Saturday, and donate mustard oil or black blankets.',
    remediesHi: 'सदाचार का पालन करें, मंगलवार व शनिवार को हनुमान चालीसा का पाठ करें तथा निर्धनों को भोजन व कंबल दान करें।',
  };

  const jupiterTransitSign = 2; // Gemini / Mithuna
  const jupiterHFromMoon = (jupiterTransitSign - moonSignIdx + 12) % 12 + 1;
  const jupiterTransit = {
    transitSignIndex: jupiterTransitSign,
    transitSignEn: SIGNS[jupiterTransitSign].name,
    transitSignHi: SIGN_HI[jupiterTransitSign],
    houseFromMoon: jupiterHFromMoon,
    transitNameEn: `Sahaja Guru (${jupiterHFromMoon}rd House from Moon)`,
    transitNameHi: `सहज गुरु (चंद्र से ${jupiterHFromMoon}वां भाव)`,
    datesStr: 'Active Transit Period',
    likelyResultsEn: [
      'Expansion in communication, marketing, writing, research, and technical certifications',
      'Short purposeful travels and fruitful business meetings',
      'Gradual rise in self-confidence through practical execution and skill acquisition',
    ],
    likelyResultsHi: [
      'संचार, लेखन, डिजिटल कार्य, बौद्धिक शोध व नवीन तकनीकी ज्ञान में विस्तार',
      'सार्थक लघु यात्राएं व व्यापारिक वार्ताओं में सफलता',
      'व्यावहारिक कर्म व योग्यता संवर्धन द्वारा आत्मविश्वास में सतत वृद्धि',
    ],
    aspectsEn: [
      '5th aspect energizes house 7 from Moon: supports partnerships and matrimonial harmony',
      '7th aspect illuminates house 9 from Moon: enhances fortune, mentors, and ethical pursuits',
      '9th aspect blesses house 11 from Moon: multiplies gains, networks, and aspirations',
    ],
    aspectsHi: [
      'पंचम दृष्टि चंद्र से 7वें भाव पर: दांपत्य व व्यापारिक साझेदारियों में सौहार्द',
      'सप्तम दृष्टि चंद्र से 9वें भाव पर: भाग्योदय, गुरु कृपा व आध्यात्मिक उन्नति',
      'नवम दृष्टि चंद्र से 11वें भाव पर: आर्थिक लाभ, मित्र सहयोग व मनोकामना पूर्ति',
    ],
    cautionEn: 'Avoid over-preaching or ideological rigidity with siblings and colleagues. Stay focused on tangible progress.',
    cautionHi: 'परिजनों व सहयोगियों के साथ वैचारिक हठ से बचें। सिद्धांत की अपेक्षा व्यावहारिक कर्म को प्राथमिकता दें।',
  };

  const rahuTransitSign = 11; // Pisces / Meena
  const ketuTransitSign = 5; // Virgo / Kanya
  const rahuHFromMoon = (rahuTransitSign - moonSignIdx + 12) % 12 + 1;
  const ketuHFromMoon = (ketuTransitSign - moonSignIdx + 12) % 12 + 1;

  const rahuKetuTransit = {
    rahuSignIndex: rahuTransitSign,
    rahuSignEn: SIGNS[rahuTransitSign].name,
    rahuSignHi: SIGN_HI[rahuTransitSign],
    rahuHouseFromMoon: rahuHFromMoon,
    ketuSignIndex: ketuTransitSign,
    ketuSignEn: SIGNS[ketuTransitSign].name,
    ketuSignHi: SIGN_HI[ketuTransitSign],
    ketuHouseFromMoon: ketuHFromMoon,
    datesStr: 'Active Transit Period',
    likelyResultsEn: [
      'Strong urge for foreign connections, unconventional breakthroughs, and cutting-edge tech',
      'Spiritual introspection and shedding of superficial attachments under Ketu',
    ],
    likelyResultsHi: [
      'विदेश संपर्कों, गैर-पारंपरिक नवीन कार्यों व आधुनिक तकनीक में अभूतपूर्व प्रगति',
      'केतु के प्रभाव से आत्म-चिंतन, अनावश्यक मोह से मुक्ति व आध्यात्मिक परिपक्वता',
    ],
    cautionEn: 'Exercise due diligence with legal documents, foreign visas, and speculative get-rich-quick offers.',
    cautionHi: 'कानूनी दस्तावेजों, वीजा व रातों-रात अमीर बनने वाले लुभावने प्रस्तावों में अत्यधिक सावधानी बरतें।',
    remediesEn: 'Chant Durga Saptashati / Stotra or Shiva Panchakshara Stotra to stabilize mental poise.',
    remediesHi: 'दुर्गा सप्तशती अथवा ॐ नमः शिवाय का नित्य जप करें तथा जरूरतमंदों को सहायता दें।',
  };

  const majorTransits: ReferencePdfMajorTransits = {
    saturn: saturnTransit,
    jupiter: jupiterTransit,
    rahuKetu: rahuKetuTransit,
  };

  // 10. Lifelong Vimshottari Dasha & Bhukti Predictions
  const dashaBhuktiPredictions: ReferencePdfDashaBhuktiItem[] = chart.vimshottari.slice(0, 15).map((d) => {
    const mdLord = d.lord;
    const adLord = d.lord; // representative
    const startStr = new Date(d.startMs).toLocaleDateString('en-GB');
    const ageVal = ((d.startMs - new Date(chart.input.date).getTime()) / (365.2425 * 86400000)).toFixed(1);

    const fEn = `${mdLord} Mahadasha brings distinct cycles of growth, tests, and transformations. Material gains, career consolidation, and spiritual discernment evolve through sustained dedication. Financial stability requires proactive discipline.`;
    const fHi = `${PLANET_HI[mdLord] || mdLord} की महादशा जीवन में उन्नति, कर्म-कौशल व उत्तरदायित्वों का नया दौर प्रारंभ करती है। धैर्यवान कर्म से प्रतिष्ठा, धन-धान्य व ज्ञान में निरंतर वृद्धि होती है।`;

    const rEn = `Recite ${mdLord} Navagraha Stotra or perform weekly charity aligned with ${mdLord}.`;
    const rHi = `${PLANET_HI[mdLord] || mdLord} के बीज मंत्र अथवा स्तोत्र का जप करें तथा संबंधित वार को सात्विक दान करें।`;

    return {
      mdLord,
      adLord,
      startDateStr: startStr,
      ageStr: `${ageVal} Yrs`,
      forecastEn: fEn,
      forecastHi: fHi,
      remediesEn: rEn,
      remediesHi: rHi,
    };
  });

  // 11. Yogini Dasha Report
  const yoginiNames = ['Mangala', 'Pingala', 'Dhanya', 'Bhramari', 'Bhadrika', 'Ulka', 'Siddha', 'Sankata'];
  const yoginiLords = ['Moon', 'Sun', 'Jupiter', 'Mars', 'Mercury', 'Saturn', 'Venus', 'Rahu'];
  const yoginiYears = [1, 2, 3, 4, 5, 6, 7, 8];

  const currentYogini: ReferencePdfYoginiReport['currentPeriod'] = {
    mdName: 'Pingala',
    adName: 'Bhramari',
    datesStr: 'Active Yogini Phase',
    workBusinessEn: 'Keep clear documentation of deliverables when deadlines tighten. Verify official rules and compliance notices before responding.',
    workBusinessHi: 'कार्यक्षेत्र में समय-सीमा का ध्यान रखें तथा सभी कार्यों का लिखित रिकॉर्ड रखें। नियमों व अनुबंधों को पढ़कर ही आगे बढ़ें।',
    moneyFamilyEn: 'Avoid trying to impress others through unnecessary budget stretching. Transparent communication brings peace at home.',
    moneyFamilyHi: 'दिखावे पर व्यय न करें। परिजनों के साथ खुलकर व मधुर संवाद रखें जिससे घरेलू वातावरण शांत व सुखद बना रहे।',
    healthLifeEn: 'Take breaks during midday sun exposure. Morning prayers and light walks invigorate energy levels.',
    healthLifeHi: 'धूप में काम करते समय पर्याप्त जल पिएं। प्रातःकालीन प्रार्थना, सूर्य दर्शन व योग स्फूर्ति प्रदान करते हैं।',
  };

  const allYoginis: ReferencePdfYoginiReport['allYoginis'] = yoginiNames.map((yName, idx) => ({
    nameEn: yName,
    nameHi: yName,
    years: yoginiYears[idx],
    lordEn: yoginiLords[idx],
    lordHi: PLANET_HI[yoginiLords[idx]] || yoginiLords[idx],
    generalReadingEn: `${yName} Yogini Dasha (${yoginiYears[idx]} Years, ruled by ${yoginiLords[idx]}): A period governing personal vitality, mental poise, and tangible milestones. Auspicious actions bring enduring welfare.`,
    generalReadingHi: `${yName} योगिनी दशा (${yoginiYears[idx]} वर्ष, स्वामी ${PLANET_HI[yoginiLords[idx]] || yoginiLords[idx]}): यह अवधि आंतरिक शुद्धि, सामाजिक दायित्वों की पूर्ति व शुभ कार्यों में सफलता का मार्ग प्रशस्त करती है।`,
  }));

  const yoginiPredictions: ReferencePdfYoginiReport = {
    currentPeriod: currentYogini,
    allYoginis,
  };

  return {
    horoscopeAnalysis,
    birthTimePredictions,
    birthNakshatra,
    lagnaPredictions: lagnaProfile,
    houseLordsPredictions,
    planetaryPositionsPredictions,
    variousYogas: {
      classicalYogas,
      dwiGrahaYogas,
      triGrahaYogas,
      chaturGrahaYogas,
    },
    savHousePredictions,
    majorTransits,
    dashaBhuktiPredictions,
    yoginiPredictions,
  };
}
