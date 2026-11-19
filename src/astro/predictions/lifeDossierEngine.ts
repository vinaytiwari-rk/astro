import { computeAvakahadaChakra, computeGhatakChakra, getNakshatraSyllable, getAllNakshatraSyllables } from '../avakahadaChalit';
import { SIGNS, NAKSHATRAS } from '../constants';
import { computeComprehensiveSensitivePoints, computeMrityuBhagaAnalysis, computePushkaraAnalysis } from '../specialSensitivities';
import { computePastFutureLifeReading, type PastFutureLifeReport } from './pastFutureLife';
import { computeLalKitabSystemReport, type LalKitabFullSystemReport } from './lalKitabSystem';
import type { BodyPosition, ChartData, NineGrahaId, SevenPlanetId } from '../types';
import { formatDateDmy } from '../time';
import { computePredictionFramework, type PredictionDomainEvidence, type PredictionDomainId } from './predictionFramework';
import { computeSambhavitFalkathan } from './sambhavitFalkathan';
import {
  computePhysicalAppearance,
  computeEducationAcademics,
  computeCareerVerdicts,
  computeRelationalMatrix,
  computeAddictionsAndShadow,
  computeLitigationAndAffairs,
  computeComprehensiveVedicRemedies,
} from './lifeDossierHelpers';
import {
  computeDynamicPsychologySections,
  computeDynamicActivePhaseSections,
  computeDynamicCareerZenithSections,
  computeDynamicWealthInduLagnaSections,
  computeDynamicMarriageAndIntimacySections,
  computeDynamicHealthSections,
  computeDynamic12Epochs,
} from './dynamicDossierChapters';

export interface ChapterSection {
  titleEn: string;
  titleHi: string;
  leadEn?: string;
  leadHi?: string;
  paragraphsEn: string[];
  paragraphsHi: string[];
  astrologicalCauseEn?: string;
  astrologicalCauseHi?: string;
  keyPointsEn?: string[];
  keyPointsHi?: string[];
  alertBadge?: {
    textEn: string;
    textHi: string;
    tone: 'positive' | 'warning' | 'critical' | 'neutral' | 'spiritual';
  };
  /** Original selected 21-life-prediction identifier, when this is an embedded prediction. */
  lifeDimensionId?: number;
  lifeDimensionHouse?: number;
}

export interface BhavaProfile {
  houseNumber: number; // 1 to 12
  bhavaNameHi: string;
  bhavaNameEn: string;
  signIndex: number;
  signNameHi: string;
  signNameEn: string;
  lordId: string;
  lordNameHi: string;
  lordNameEn: string;
  lordPlacedHouse: number;
  lordDignity: string;
  isLordRetrograde: boolean;
  isLordCombust: boolean;
  savBindus: number;
  occupantsHi: string[];
  occupantsEn: string[];
  afflictionScore: number; // 0 to 100
  verdictTone: 'favorable' | 'mixed' | 'challenging' | 'critical';
  verdictSummaryHi: string;
  verdictSummaryEn: string;
}

export interface TargetedRemedyBox {
  isNeeded: boolean;
  reasonHi: string;
  reasonEn: string;
  stotraOrMantraHi?: string;
  stotraOrMantraEn?: string;
  charityItemHi?: string;
  charityItemEn?: string;
  charityDayHi?: string;
  charityDayEn?: string;
  practicalPrecautionHi: string;
  practicalPrecautionEn: string;
}

export interface DossierChapter {
  chapterNumber: number; // 1 to 12
  id: string;
  houseNumber: number; // 1 to 12
  titleEn: string;
  titleHi: string;
  subtitleEn: string;
  subtitleHi: string;
  icon: string;
  summaryQuoteEn: string;
  summaryQuoteHi: string;
  bhavaProfile: BhavaProfile;
  targetedRemedy: TargetedRemedyBox;
  sections: ChapterSection[];
  specialData?: any;
  predictionEvidence?: PredictionDomainEvidence[];
}

export interface LifeDossierReport {
  generatedAt: string;
  nativeName: string;
  birthDateFormatted: string;
  birthTimeFormatted: string;
  birthCity: string;
  ascendantSignEn: string;
  ascendantSignHi: string;
  moonSignEn: string;
  moonSignHi: string;
  sunSignEn: string;
  sunSignHi: string;
  chapters: DossierChapter[];
  topIdentity: {
    ishtaDevata: {
      deityEn: string;
      deityHi: string;
      planetId: string;
      mantra: string;
      worshipDayEn: string;
      worshipDayHi: string;
      classicalCauseEn: string;
      classicalCauseHi: string;
    };
    naamakshar: {
      syllableEn: string;
      syllableHi: string;
      allPadasEn: string[];
      allPadasHi: string[];
      nakshatraName: string;
      pada: number;
      pronunciationGuideEn: string;
      pronunciationGuideHi: string;
    };
    paya: {
      nameEn: string;
      nameHi: string;
      metal: 'Gold' | 'Silver' | 'Copper' | 'Iron';
      tone: 'auspicious' | 'mixed' | 'challenging';
      meaningEn: string;
      meaningHi: string;
      moonHouseFromLagna: number;
      classicalCauseEn: string;
      classicalCauseHi: string;
    };
  };
}

export const SIGN_HI = [
  'मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या',
  'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुंभ', 'मीन',
];

export const PLANET_HI: Record<string, string> = {
  Asc: 'लग्न',
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

export const BHAVA_NAMES: Record<number, { hi: string; en: string }> = {
  1: { hi: 'प्रथम भाव (तनु भाव)', en: '1st House (Tanu Bhava)' },
  2: { hi: 'द्वितीय भाव (धन भाव)', en: '2nd House (Dhana Bhava)' },
  3: { hi: 'तृतीय भाव (सहज भाव)', en: '3rd House (Sahaja Bhava)' },
  4: { hi: 'चतुर्थ भाव (सुख भाव)', en: '4th House (Sukha Bhava)' },
  5: { hi: 'पंचम भाव (सुत भाव)', en: '5th House (Suta Bhava)' },
  6: { hi: 'षष्ठ भाव (रिपु भाव)', en: '6th House (Ripu Bhava)' },
  7: { hi: 'सप्तम भाव (कलत्र भाव)', en: '7th House (Kalatra Bhava)' },
  8: { hi: 'अष्टम भाव (रंध्र भाव)', en: '8th House (Randhra Bhava)' },
  9: { hi: 'नवम भाव (भाग्य भाव)', en: '9th House (Bhagya Bhava)' },
  10: { hi: 'दशम भाव (कर्म भाव)', en: '10th House (Karma Bhava)' },
  11: { hi: 'एकादश भाव (लाभ भाव)', en: '11th House (Labha Bhava)' },
  12: { hi: 'द्वादश भाव (व्यय भाव)', en: '12th House (Vyaya Bhava)' },
};

const ISHTA_DEITIES: Record<string, { en: string; hi: string; mantra: string; dayEn: string; dayHi: string }> = {
  Sun: {
    en: 'Lord Rama / Surya Narayana',
    hi: 'भगवान श्री राम / सूर्य नारायण',
    mantra: 'ॐ घृणिः सूर्याय नमः / ॐ रां रामाय नमः',
    dayEn: 'Sunday',
    dayHi: 'रविवार',
  },
  Moon: {
    en: 'Lord Krishna / Maa Gauri / Parvati',
    hi: 'भगवान श्री कृष्ण / माता गौरी (पार्वती)',
    mantra: 'ॐ क्लीं कृष्णाय नमः / ॐ सों सोमाय नमः',
    dayEn: 'Monday',
    dayHi: 'सोमवार',
  },
  Mars: {
    en: 'Lord Hanuman / Skanda (Kartikeya)',
    hi: 'श्री हनुमान जी / भगवान कार्तिकेय',
    mantra: 'ॐ हं हनुमते नमः / ॐ क्रां क्रीं क्रौं सः भौमाय नमः',
    dayEn: 'Tuesday',
    dayHi: 'मंगलवार',
  },
  Mercury: {
    en: 'Lord Vishnu / Narayana',
    hi: 'भगवान श्री विष्णु / नारायण',
    mantra: 'ॐ नमो भगवते वासुदेवाय / ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः',
    dayEn: 'Wednesday',
    dayHi: 'बुधवार',
  },
  Jupiter: {
    en: 'Lord Dakshinamurthy / Sadashiva / Vamana',
    hi: 'श्री दक्षिणामूर्ति / सदाशिव / वामन भगवान',
    mantra: 'ॐ नमो नारायणाय / ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः',
    dayEn: 'Thursday',
    dayHi: 'गुरुवार',
  },
  Venus: {
    en: 'Maa Mahalakshmi / Parashurama',
    hi: 'माँ महालक्ष्मी / श्री परशुराम जी',
    mantra: 'ॐ श्रीं ह्रीं क्लीं महालक्ष्म्यै नमः / ॐ शुं शुक्राय नमः',
    dayEn: 'Friday',
    dayHi: 'शुक्रवार',
  },
  Saturn: {
    en: 'Lord Shiva / Kaal Bhairava / Lord Kurma',
    hi: 'भगवान शिव / काल भैरव / कच्छप (कूर्म) अवतार',
    mantra: 'ॐ नमः शिवाय / ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः',
    dayEn: 'Saturday',
    dayHi: 'शनिवार',
  },
  Rahu: {
    en: 'Maa Durga / Varaha / Maa Chhinnamasta',
    hi: 'माँ भगवती दुर्गा / वराह भगवान',
    mantra: 'ॐ दुं दुर्गायै नमः / ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः',
    dayEn: 'Wednesday/Saturday',
    dayHi: 'बुधवार अथवा शनिवार',
  },
  Ketu: {
    en: 'Lord Ganesha / Matsya / Dhumavati',
    hi: 'श्री गणेश जी / मत्स्य अवतार',
    mantra: 'ॐ गं गणपतये नमः / ॐ स्रां स्रीं स्रौं सः केतवे नमः',
    dayEn: 'Tuesday/Thursday',
    dayHi: 'मंगलवार अथवा गुरुवार',
  },
};

const PLANET_REMEDIES: Record<string, {
  stotraHi: string;
  stotraEn: string;
  charityHi: string;
  charityEn: string;
  dayHi: string;
  dayEn: string;
  precautionHi: string;
  precautionEn: string;
}> = {
  Sun: {
    stotraHi: 'आदित्य हृदय स्तोत्र पाठ अथवा ॐ घृणिः सूर्याय नमः',
    stotraEn: 'Aditya Hridaya Stotra or Om Ghrinih Suryaya Namah',
    charityHi: 'गेहूं, तांबा, गुड़ अथवा लाल वस्त्र का दान',
    charityEn: 'Donation of wheat, copper, jaggery or red cloth',
    dayHi: 'रविवार प्रातः',
    dayEn: 'Sunday Morning',
    precautionHi: 'पिता अथवा पिता तुल्य गुरुजनों का अपमान न करें; सूर्योदय से पूर्व उठने का नियम बनाएं।',
    precautionEn: 'Honor fatherly figures and maintain disciplined early rising before sunrise.',
  },
  Moon: {
    stotraHi: 'शिव पंचाक्षर स्तोत्र (ॐ नमः शिवाय) अथवा चंद्र कवच',
    stotraEn: 'Shiva Panchakshara Stotra (Om Namah Shivaya) or Chandra Kavach',
    charityHi: 'चावल, दूध, चांदी, अथवा श्वेत वस्त्र का दान',
    charityEn: 'Donation of raw rice, milk, silver, or white cloth',
    dayHi: 'सोमवार सायं',
    dayEn: 'Monday Evening',
    precautionHi: 'माता का नित्य चरण स्पर्श कर आशीर्वाद लें; रात्रि में दूध के अत्यधिक सेवन व शीतल पेय से बचें।',
    precautionEn: 'Seek maternal blessings daily; avoid excessive cold liquids and emotional ruminations late at night.',
  },
  Mars: {
    stotraHi: 'सुंदरकांड पाठ, ऋणमोचक मंगल स्तोत्र अथवा हनुमान चालीसा',
    stotraEn: 'Sundarkand, Rinamochaka Mangala Stotra or Hanuman Chalisa',
    charityHi: 'लाल मसूर की दाल, गुड़, तांबा अथवा रक्तदान',
    charityEn: 'Donation of red lentils, jaggery, copper or voluntary blood donation',
    dayHi: 'मंगलवार दोपहर',
    dayEn: 'Tuesday Midday',
    precautionHi: 'वाहन चलाते समय गति पर नियंत्रण रखें; अनुज (छोटे भाइयों) से व्यर्थ विवाद व अहंकार त्यागें।',
    precautionEn: 'Exercise measured speed control while driving; avoid abrasive pride with younger siblings.',
  },
  Mercury: {
    stotraHi: 'श्री विष्णु सहस्रनाम स्तोत्र अथवा ॐ नमो भगवते वासुदेवाय',
    stotraEn: 'Vishnu Sahasranama Stotra or Om Namo Bhagavate Vasudevaya',
    charityHi: 'साबुत मूंग, हरी घास (गौ सेवा) अथवा हरी सब्जियां',
    charityEn: 'Donation of whole green moong, feeding green fodder to cows or green apparel',
    dayHi: 'बुधवार प्रातः',
    dayEn: 'Wednesday Morning',
    precautionHi: 'किसी भी महत्वपूर्ण अनुबंध अथवा व्यापारिक समझौते पर बिना पढ़े हस्ताक्षर न करें; बहनों-भुआ का सम्मान करें।',
    precautionEn: 'Never sign commercial agreements without thorough review; respect sisters and aunts.',
  },
  Jupiter: {
    stotraHi: 'गुरु स्तोत्र, श्रीमद्भगवद्गीता का एकादश अध्याय अथवा ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः',
    stotraEn: 'Guru Stotra, Srimad Bhagavad Gita Ch. 11 or Om Gram Greem Graum Sah Gurave Namah',
    charityHi: 'चने की दाल, हल्दी, पीले फल, धार्मिक पुस्तकें अथवा स्वर्ण दान',
    charityEn: 'Donation of chana dal, raw turmeric, yellow fruits or religious scriptures',
    dayHi: 'गुरुवार प्रातः',
    dayEn: 'Thursday Morning',
    precautionHi: 'गुरुजनों, आचार्यों व संतों का उपहास न करें; धार्मिक सिद्धांतों पर अडिग रहें व असत्य ज्ञान के प्रचार से बचें।',
    precautionEn: 'Never deride preceptors or teachers; practice ethical rectitude and avoid false preachings.',
  },
  Venus: {
    stotraHi: 'कनकधारा स्तोत्र, श्री सूक्तम अथवा ॐ शुं शुक्राय नमः',
    stotraEn: 'Kanakadhara Stotra, Sri Suktam or Om Shum Shukraya Namah',
    charityHi: 'सफेद मिठाई, मिश्री, घी, कपूर अथवा सुगंधित द्रव्य',
    charityEn: 'Donation of white sweets, rock sugar (mishri), pure ghee, camphor or perfumes',
    dayHi: 'शुक्रवार सायं',
    dayEn: 'Friday Evening',
    precautionHi: 'चरित्र की शुचिता बनाए रखें; जीवनसाथी अथवा स्त्रियों के प्रति सदैव निष्कपट व आदरपूर्ण व्यवहार रखें।',
    precautionEn: 'Maintain pristine marital loyalty and honor women in family and professional spheres.',
  },
  Saturn: {
    stotraHi: 'राजा दशरथ कृत शनि स्तोत्र अथवा महामृत्युंजय मंत्र',
    stotraEn: 'Raja Dasharatha Shani Stotra or Mahamrityunjaya Mantra',
    charityHi: 'काले तिल, सरसों का तेल (छाया दान), उड़द अथवा लोहे का पात्र',
    charityEn: 'Donation of black sesame, mustard oil shadow donation, black urad or iron vessels',
    dayHi: 'शनिवार सूर्यास्त समय',
    dayEn: 'Saturday Sunset',
    precautionHi: 'घर के सफाईकर्मियों, निर्धन सहायकों व वृद्धजनों को कभी प्रताड़ित न करें; आलस्य का परित्याग करें।',
    precautionEn: 'Never mistreat manual laborers or subordinates; maintain diligent, uncomplaining discipline.',
  },
  Rahu: {
    stotraHi: 'श्री दुर्गा सप्तशती (दुर्गा चालीसा) अथवा ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः',
    stotraEn: 'Sri Durga Saptashati (Durga Chalisa) or Om Bhram Bhreem Bhraum Sah Rahave Namah',
    charityHi: 'जटा वाला नारियल (जल प्रवाह), काला-नीला कंबल अथवा सफाईकर्मियों को मिष्ठान',
    charityEn: 'Immersion of whole coconut in running water, dark blue blanket donation or sweets to street cleaners',
    dayHi: 'शनिवार अथवा बुधवार रात्रि',
    dayEn: 'Saturday/Wednesday Night',
    precautionHi: 'किसी भी प्रकार के रासायनिक नशे, सट्टेबाजी और अचानक अमीर बनने के प्रलोभनों से पूर्णतः दूर रहें।',
    precautionEn: 'Steer clear of intoxicating substances, gambling, and speculative illusions of instant wealth.',
  },
  Ketu: {
    stotraHi: 'श्री गणेश अथर्वशीर्ष पाठ अथवा ॐ गं गणपतये नमः',
    stotraEn: 'Sri Ganesha Atharvashirsha or Om Gam Ganapataye Namah',
    charityHi: 'दो-रंगा (काला-सफेद) कंबल, तिल, अथवा श्वानों (कुत्तों) को तेल लगी रोटी',
    charityEn: 'Donation of dual-color blanket, sesame seeds or feeding stray dogs',
    dayHi: 'मंगलवार प्रातः',
    dayEn: 'Tuesday Morning',
    precautionHi: 'अनावश्यक अलगाव, मानसिक भ्रम और गुप्त आशंकाओं से बचें; नित्य गणेश आराधना द्वारा चित्त को स्थिर रखें।',
    precautionEn: 'Avoid morbid detachment and anxiety; cultivate grounding through daily Ganesha meditation.',
  },
};

export function computeHouseProfile(
  chart: ChartData,
  houseNumber: number
): { profile: BhavaProfile; remedy: TargetedRemedyBox } {
  const asc = chart.ascendant;
  const signIndex = (asc.signIndex + (houseNumber - 1)) % 12;
  const signNameEn = SIGNS[signIndex].name;
  const signNameHi = SIGN_HI[signIndex];
  const lordId = SIGNS[signIndex].lord;
  const lordNameEn = lordId;
  const lordNameHi = PLANET_HI[lordId] || lordId;
  const lordPlanet = chart.planets.find((p) => p.id === lordId);

  const lordPlacedHouse = lordPlanet?.rasiHouseNumber ?? 1;
  const lordDignity = lordPlanet?.dignity ?? 'Neutral';
  const isLordRetrograde = lordPlanet?.isRetrograde ?? false;
  const isLordCombust = lordPlanet?.isCombust ?? false;
  const savBindus = chart.ashtakavarga?.sarva?.[signIndex] ?? 28;

  const occupants = chart.planets.filter((p) => p.rasiHouseNumber === houseNumber);
  const occupantsHi = occupants.map((p) => PLANET_HI[p.id] || p.id);
  const occupantsEn = occupants.map((p) => p.id);

  // Dignity calculation
  let score = 54;
  switch (lordDignity) {
    case 'Exalted': score += 20; break;
    case 'Moolatrikona': score += 16; break;
    case 'Own Sign': score += 12; break;
    case 'Great Friend':
    case 'Friend': score += 6; break;
    case 'Neutral': score += 0; break;
    case 'Enemy': score += -10; break;
    case 'Great Enemy': score += -16; break;
    case 'Debilitated': score += -22; break;
  }

  // Placement calculation
  if ([1, 4, 7, 10, 5, 9].includes(lordPlacedHouse)) {
    score += 12;
  } else if ([3, 11].includes(lordPlacedHouse)) {
    score += 6;
  } else if ([6, 8, 12].includes(lordPlacedHouse)) {
    if (houseNumber === lordPlacedHouse) {
      score += 4; // Swakshetra/Vipareeta protection
    } else {
      score -= 18;
    }
  } else if (lordPlacedHouse === 2) {
    score += 4;
  }

  // Lord state
  if (isLordCombust) score -= 14;
  if (isLordRetrograde) {
    if (lordDignity === 'Debilitated') score += 16; // Neecha-Vakri Chesta Bala per Phaladeepika
    else score += 4;
  }

  // Occupants calculation
  const malefics = ['Saturn', 'Mars', 'Rahu', 'Ketu', 'Sun'];
  const benefics = ['Jupiter', 'Venus', 'Mercury', 'Moon'];

  for (const occ of occupants) {
    if (malefics.includes(occ.id)) {
      if ([3, 6, 11].includes(houseNumber)) score += 3;
      else score -= 10;
    }
    if (benefics.includes(occ.id)) {
      score += 8;
    }
  }

  // SAV bindus
  if (savBindus >= 33) score += 8;
  else if (savBindus >= 28) score += 3;
  else if (savBindus < 25) score -= 9;
  else if (savBindus < 20) score -= 16;

  score = Math.max(16, Math.min(94, Math.round(score)));

  let verdictTone: 'favorable' | 'mixed' | 'challenging' | 'critical' = 'mixed';
  if (score >= 68) verdictTone = 'favorable';
  else if (score >= 50) verdictTone = 'mixed';
  else if (score >= 36) verdictTone = 'challenging';
  else verdictTone = 'critical';

  // Reader-facing house conclusion: describe the actual chart factors without
  // turning a heuristic score into guaranteed events, diagnoses or outcomes.
  const dignityMeaningHi: Record<string, string> = {
    Exalted: 'उच्च राशि में', Moolatrikona: 'मूलत्रिकोण में', 'Own Sign': 'स्वराशि में',
    'Great Friend': 'मित्र राशि में', Friend: 'मित्र राशि में', Friendly: 'मित्र राशि में',
    Neutral: 'सम राशि में', Enemy: 'शत्रु राशि में', 'Great Enemy': 'अति शत्रु राशि में',
    Debilitated: 'नीच राशि में',
  };
  const dignityMeaningEn: Record<string, string> = {
    Exalted: 'exalted', Moolatrikona: 'in its Moolatrikona', 'Own Sign': 'in its own sign',
    'Great Friend': 'in a great-friend sign', Friend: 'in a friendly sign',
    Friendly: 'in a friendly sign', Neutral: 'in a neutral sign',
    Enemy: 'in an enemy sign', 'Great Enemy': 'in a great-enemy sign',
    Debilitated: 'debilitated',
  };
  const placementMeaningHi = lordPlacedHouse === houseNumber
    ? 'भावेश अपने ही भाव में स्थित हैं'
    : `भावेश ${lordPlacedHouse}वें भाव में स्थित हैं`;
  const placementMeaningEn = lordPlacedHouse === houseNumber
    ? 'the house lord occupies its own house'
    : `the house lord is placed in House ${lordPlacedHouse}`;
  const occupantMeaningHi = occupantsHi.length
    ? `इस भाव में ${occupantsHi.join(', ')} स्थित हैं`
    : 'यह भाव ग्रहों से रिक्त है';
  const occupantMeaningEn = occupantsEn.length
    ? `${occupantsEn.join(', ')} occupy this house`
    : 'this house has no planetary occupant';
  const savMeaningHi = savBindus >= 30
    ? 'अष्टकवर्ग के बिंदु अपेक्षाकृत सहयोगी हैं'
    : savBindus <= 24
      ? 'अष्टकवर्ग के बिंदु अपेक्षाकृत कम हैं'
      : 'अष्टकवर्ग के बिंदु मध्यम स्तर पर हैं';
  const savMeaningEn = savBindus >= 30
    ? 'the Ashtakavarga bindus are relatively supportive'
    : savBindus <= 24
      ? 'the Ashtakavarga bindus are relatively low'
      : 'the Ashtakavarga bindus are moderate';
  const stateMeaningHi = isLordCombust
    ? 'भावेश अस्त भी हैं, इसलिए इस कारक को सावधानी से पढ़ना चाहिए'
    : isLordRetrograde
      ? 'भावेश वक्री हैं; पारंपरिक व्याख्या में परिणामों की अभिव्यक्ति में पुनर्विचार या विलंब जोड़ा जाता है'
      : '';
  const stateMeaningEn = isLordCombust
    ? 'the lord is also combust, so this factor should be read cautiously'
    : isLordRetrograde
      ? 'the lord is retrograde, traditionally associated with review or delay in how results unfold'
      : '';
  const combinedMeaningHi = verdictTone === 'favorable'
    ? 'इन कारकों का संयुक्त संकेत इस जीवन-क्षेत्र को अपेक्षाकृत समर्थन देता है; अवसरों का लाभ फिर भी निर्णय और प्रयास पर निर्भर करेगा।'
    : verdictTone === 'mixed'
      ? 'यहां समर्थन और चुनौती दोनों हैं; परिणाम परिस्थिति, समय और आपके निर्णयों के अनुसार बदल सकते हैं।'
      : verdictTone === 'challenging'
        ? 'इस क्षेत्र में अतिरिक्त मेहनत, धैर्य और व्यावहारिक योजना की जरूरत हो सकती है; इसे निश्चित असफलता न मानें।'
        : 'यह क्षेत्र अपेक्षाकृत संवेदनशील दिखता है; जल्दबाजी से बचें और जरूरत पड़ने पर संबंधित विशेषज्ञ की सलाह लें।';
  const combinedMeaningEn = verdictTone === 'favorable'
    ? 'Together, these factors offer relatively more support to this life area; outcomes still depend on choices and effort.'
    : verdictTone === 'mixed'
      ? 'Both supportive and challenging factors appear; outcomes can vary with circumstances, timing and decisions.'
      : verdictTone === 'challenging'
        ? 'This area may need extra effort, patience and practical planning; it does not mean certain failure.'
        : 'This area appears comparatively sensitive; avoid haste and seek qualified advice where relevant.';
  const verdictSummaryHi = `${BHAVA_NAMES[houseNumber].hi} का स्वामी ${lordNameHi} ${dignityMeaningHi[lordDignity] || 'सम स्थिति में'} हैं और ${placementMeaningHi}। ${occupantMeaningHi}। इस भाव के ${savBindus} सर्वाष्टकवर्ग बिंदु हैं; ${savMeaningHi}। ${stateMeaningHi}। निष्कर्ष: ${combinedMeaningHi}`;
  const verdictSummaryEn = `${BHAVA_NAMES[houseNumber].en} is ruled by ${lordNameEn}, ${dignityMeaningEn[lordDignity] || 'in an unclassified dignity'}, and ${placementMeaningEn}. ${occupantMeaningEn}. The house has ${savBindus} Sarvashtakavarga bindus; ${savMeaningEn}. ${stateMeaningEn}. Conclusion: ${combinedMeaningEn}`;

  const profile: BhavaProfile = {
    houseNumber,
    bhavaNameHi: BHAVA_NAMES[houseNumber].hi,
    bhavaNameEn: BHAVA_NAMES[houseNumber].en,
    signIndex,
    signNameHi,
    signNameEn,
    lordId,
    lordNameHi,
    lordNameEn,
    lordPlacedHouse,
    lordDignity,
    isLordRetrograde,
    isLordCombust,
    savBindus,
    occupantsHi,
    occupantsEn,
    afflictionScore: score,
    verdictTone,
    verdictSummaryHi,
    verdictSummaryEn,
  };

  // Targeted Remedy Logic: strictly only for afflicted houses
  const isAfflicted = score < 48 || [6, 8, 12].includes(lordPlacedHouse) || lordDignity === 'Debilitated' || isLordCombust;
  let remedy: TargetedRemedyBox;

  if (isAfflicted) {
    const remInfo = PLANET_REMEDIES[lordId] ?? PLANET_REMEDIES.Saturn;
    remedy = {
      isNeeded: true,
      reasonHi: `भावेश '${lordNameHi}' ${isLordCombust ? 'अस्त हैं' : lordDignity === 'Debilitated' ? 'नीच राशि में हैं' : [6, 8, 12].includes(lordPlacedHouse) ? `त्रिक भाव (${lordPlacedHouse}) में स्थित हैं` : 'प्रतिकूल प्रभाव में हैं'} (स्कोर: ${score}/100)। अनिष्ट शमन हेतु उपाय आवश्यक है।`,
      reasonEn: `House lord ${lordNameEn} is ${isLordCombust ? 'combust' : lordDignity === 'Debilitated' ? 'debilitated' : [6, 8, 12].includes(lordPlacedHouse) ? `placed in dusthana house ${lordPlacedHouse}` : 'under pressure'} (Score: ${score}/100). Remedial intervention is warranted.`,
      stotraOrMantraHi: remInfo.stotraHi,
      stotraOrMantraEn: remInfo.stotraEn,
      charityItemHi: remInfo.charityHi,
      charityItemEn: remInfo.charityEn,
      charityDayHi: remInfo.dayHi,
      charityDayEn: remInfo.dayEn,
      practicalPrecautionHi: remInfo.precautionHi,
      practicalPrecautionEn: remInfo.precautionEn,
    };
  } else {
    remedy = {
      isNeeded: false,
      reasonHi: `इस भाव के स्वामी '${lordNameHi}' एवं कारक ग्रह कुंडली में सुरक्षित व शुभ स्थिति में हैं (स्कोर: ${score}/100)। कोई गंभीर अरिष्ट विद्यमान नहीं है।`,
      reasonEn: `The house lord ${lordNameEn} and Karakas occupy stable, protected dignity (Score: ${score}/100). No severe affliction present.`,
      practicalPrecautionHi: 'इस भाव के संदर्भ में किसी उपाय, रत्न, तांत्रिक अनुष्ठान अथवा विशेष दान की आवश्यकता नहीं है। केवल धर्मानुकूल सात्विक आचरण बनाए रखें।',
      practicalPrecautionEn: 'No gemstone, ritual, or remedy is required for this house. Maintain ethical and balanced conduct.',
    };
  }

  return { profile, remedy };
}

export function computeLifeDossierReport(
  chart: ChartData,
  forecastDateStr?: string
): LifeDossierReport {
  const nativeName = chart.input.name || 'जातक';
  const birthDateFormatted = formatDateDmy(chart.input.date);
  const birthTimeFormatted = chart.input.time;
  const birthCity = chart.input.city || '';

  const asc = chart.ascendant;
  const ascSignEn = asc.signName;
  const ascSignHi = SIGN_HI[asc.signIndex];

  const moon = chart.planets.find((p) => p.id === 'Moon') ?? chart.planets[1];
  const moonSignEn = moon.signName;
  const moonSignHi = SIGN_HI[moon.signIndex];

  const sun = chart.planets.find((p) => p.id === 'Sun') ?? chart.planets[0];
  const sunSignEn = sun.signName;
  const sunSignHi = SIGN_HI[sun.signIndex];

  const mars = chart.planets.find((p) => p.id === 'Mars') ?? chart.planets[2];
  const mercury = chart.planets.find((p) => p.id === 'Mercury') ?? chart.planets[3];
  const jupiter = chart.planets.find((p) => p.id === 'Jupiter') ?? chart.planets[4];
  const venus = chart.planets.find((p) => p.id === 'Venus') ?? chart.planets[5];
  const saturn = chart.planets.find((p) => p.id === 'Saturn') ?? chart.planets[6];
  const rahu = chart.planets.find((p) => p.id === 'Rahu') ?? chart.planets[7];
  const ketu = chart.planets.find((p) => p.id === 'Ketu') ?? chart.planets[8];

  // Foundation Calculations
  const avakahada = computeAvakahadaChakra(chart);
  const ghatak = computeGhatakChakra(moon.signIndex);
  const sensitivePoints = computeComprehensiveSensitivePoints(chart);
  const mrityuBhagas = computeMrityuBhagaAnalysis(chart);
  const pushkaraList = computePushkaraAnalysis(chart);
  const pastFuture = computePastFutureLifeReading(chart);
  const lalKitab = computeLalKitabSystemReport(chart);
  const centralPredictionEvidence = computePredictionFramework(chart);
  const selectedLifePredictions = computeSambhavitFalkathan(chart).dimensions;

  // Modular Deep Predictions & Relational Engines
  const physicalResult = computePhysicalAppearance(chart);
  const educationResult = computeEducationAcademics(chart);
  const careerVerdictsResult = computeCareerVerdicts(chart);
  const relationalResult = computeRelationalMatrix(chart);
  const addictionsResult = computeAddictionsAndShadow(chart);
  const litigationResult = computeLitigationAndAffairs(chart);

  const alPoint = sensitivePoints.points.find((p) => p.id === 'AL');
  const ulPoint = sensitivePoints.points.find((p) => p.id === 'UL' || p.id === 'A12');

  // 1. ISHTA DEVATA (From 12th of Karakamsa in D9)
  const ak = chart.planets.find((p) => p.charaKaraka === 'AK') ?? chart.planets[0];
  const akD9 = chart.divisionalCharts.D9?.placements.find((p) => p.id === ak.id) ?? { signIndex: 0 };
  const twelfthFromAkSign = (akD9.signIndex + 11) % 12;
  const in12thD9 = chart.divisionalCharts.D9?.placements.filter(
    (x) => x.id !== 'Asc' && x.signIndex === twelfthFromAkSign
  ) ?? [];
  const ishtaPlanet = in12thD9.length > 0 ? in12thD9[0].id : SIGNS[twelfthFromAkSign].lord;
  const ishtaDeityInfo = ISHTA_DEITIES[ishtaPlanet] ?? ISHTA_DEITIES.Jupiter;

  const ishtaClassicalCauseEn = `Derived strictly according to Jaimini Sutras: Atmakaraka (AK) is ${ak.id} placed in Navamsha sign ${SIGNS[akD9.signIndex].name} (Karakamsa). The 12th house of liberation (Moksha Bhava) from Karakamsa falls in ${SIGNS[twelfthFromAkSign].name}. ${in12thD9.length > 0 ? `Occupied by ${in12thD9.map((p) => p.id).join(', ')}` : `Ruled by its sign lord ${SIGNS[twelfthFromAkSign].lord}`}. Hence, ${ishtaDeityInfo.en} is the eternal Ishta Devata guiding the soul toward spiritual emancipation.`;
  const ishtaClassicalCauseHi = `महर्षि जैमिनि के उपदेश सूत्रों के अनुसार: जातक के आत्मकारक (AK) ग्रह '${PLANET_HI[ak.id] || ak.id}' नवांश कुंडली (D9) में '${SIGN_HI[akD9.signIndex]}' राशि (कारकांश) में स्थित हैं। कारकांश से 12वां मोक्ष भाव '${SIGN_HI[twelfthFromAkSign]}' राशि में पड़ता है। ${in12thD9.length > 0 ? `जिसमें ${in12thD9.map((p) => PLANET_HI[p.id] || p.id).join(', ')} स्थित हैं` : `जिसके स्वामी ग्रह '${PLANET_HI[SIGNS[twelfthFromAkSign].lord] || SIGNS[twelfthFromAkSign].lord}' हैं`}। अतः जातक के शाश्वत इष्ट देव '${ishtaDeityInfo.hi}' हैं, जिनकी नित्य आराधना से जन्म-जन्मांतर के प्रारब्ध क्लेश शांत होते हैं।`;

  // 2. NAAMAKSHAR (Moon Nakshatra & Pada)
  const moonNakIdx = moon.nakshatraIndex ?? 0;
  const moonPada = moon.pada ?? 1;
  const sylSingle = getNakshatraSyllable(moonNakIdx, moonPada);
  const sylAll = getAllNakshatraSyllables(moonNakIdx);

  // 3. PAYA (Moon House from Lagna)
  const moonHouse = ((moon.signIndex - asc.signIndex + 12) % 12) + 1;
  let payaMetal: 'Gold' | 'Silver' | 'Copper' | 'Iron' = 'Silver';
  let payaTone: 'auspicious' | 'mixed' | 'challenging' = 'auspicious';
  let payaNameEn = 'Silver Foot (Rajat Paya)';
  let payaNameHi = 'रजत पाया (चांदी का पाया)';
  let payaMeaningEn = '';
  let payaMeaningHi = '';

  if ([2, 5, 9].includes(moonHouse)) {
    payaMetal = 'Silver';
    payaTone = 'auspicious';
    payaNameEn = 'Silver Foot (Rajat Paya)';
    payaNameHi = 'रजत पाया (चांदी का पाया)';
    payaMeaningEn = 'Classically the most auspicious birth foot. Bestows domestic peace, financial stability, protective family grace, good reputation, and natural resilience during adversities.';
    payaMeaningHi = 'शास्त्रों में रजत (चांदी) का पाया सर्वाधिक कल्याणकारी व शुभ माना गया है। यह जातक को पारिवारिक सुख, आर्थिक संबल, समाज में प्रतिष्ठा, मानसिक संतुलन और विपत्तियों में सहज दैवीय संरक्षण प्रदान करता है।';
  } else if ([1, 6, 11].includes(moonHouse)) {
    payaMetal = 'Gold';
    payaTone = 'mixed';
    payaNameEn = 'Gold Foot (Swarna Paya)';
    payaNameHi = 'स्वर्ण पाया (सोने का पाया)';
    payaMeaningEn = 'Signifies kingly aspirations, elevated status, and great material wealth, but demands conscious effort to protect physical health and keep nervous restlessness in check.';
    payaMeaningHi = 'स्वर्ण पाया जातक को उच्च महत्वाकांक्षा, ऐश्वर्य, राजसी सुख और तीक्ष्ण बुद्धि देता है; किंतु जातक को अपने स्वास्थ्य, अहंकार एवं मानसिक शांति के प्रति सतत सचेत रहना पड़ता है।';
  } else if ([3, 7, 10].includes(moonHouse)) {
    payaMetal = 'Copper';
    payaTone = 'auspicious';
    payaNameEn = 'Copper Foot (Tamra Paya)';
    payaNameHi = 'ताम्र पाया (तांबे का पाया)';
    payaMeaningEn = 'Symbolizes enterprise, courageous self-made elevation, keen business acumen, and victory through tireless persistence and practical intelligence.';
    payaMeaningHi = 'ताम्र पाया जातक को प्रचंड पराक्रम, स्वावलंबन, व्यावहारिक व्यापारिक सूझबूझ और पुरुषार्थ के बल पर शून्य से शिखर तक पहुंचने की अदम्य शक्ति प्रदान करता है।';
  } else {
    payaMetal = 'Iron';
    payaTone = 'challenging';
    payaNameEn = 'Iron Foot (Loha Paya)';
    payaNameHi = 'लौह पाया (लोहे का पाया)';
    payaMeaningEn = 'Signifies heavy karmic responsibilities, early struggles, family burdens, and deep transformation. Ultimate triumph is earned through sheer discipline and resilience.';
    payaMeaningHi = 'लौह पाया जातक के जीवन में प्रारंभिक संघर्ष, पारिवारिक उत्तरदायित्वों का भारी दबाव और कठोर प्रारब्ध परीक्षा दर्शाता है। ऐसा जातक जीवन की कठिन भट्ठी में तपकर ही स्वर्ण की भांति चमकता है।';
  }

  const payaCauseEn = `Calculated by Moon's placement relative to the Lagna: Moon occupies house ${moonHouse} from Ascendant (${ascSignEn}). Houses 2, 5, 9 signify Silver; 1, 6, 11 signify Gold; 3, 7, 10 signify Copper; and 4, 8, 12 signify Iron.`;
  const payaCauseHi = `शास्त्र सम्मत गणना: जन्म समय चंद्र देव लग्न (${ascSignHi}) से ${moonHouse}वें भाव में स्थित हैं। ज्योतिषीय नियम के अनुसार: लग्न से 2, 5, 9 भाव में चंद्र हो तो 'रजत पाया', 1, 6, 11 भाव में हो तो 'स्वर्ण पाया', 3, 7, 10 भाव में हो तो 'ताम्र पाया', और 4, 8, 12 भाव में हो तो 'लौह पाया' बनता है।`;

  const topIdentity = {
    ishtaDevata: {
      deityEn: ishtaDeityInfo.en,
      deityHi: ishtaDeityInfo.hi,
      planetId: ishtaPlanet,
      mantra: ishtaDeityInfo.mantra,
      worshipDayEn: ishtaDeityInfo.dayEn,
      worshipDayHi: ishtaDeityInfo.dayHi,
      classicalCauseEn: ishtaClassicalCauseEn,
      classicalCauseHi: ishtaClassicalCauseHi,
    },
    naamakshar: {
      syllableEn: sylSingle.en,
      syllableHi: sylSingle.hi,
      allPadasEn: sylAll.en,
      allPadasHi: sylAll.hi,
      nakshatraName: moon.nakshatraName || '',
      pada: moonPada,
      pronunciationGuideEn: `Primary birth syllable is '${sylSingle.en}' (Pada ${moonPada} of ${moon.nakshatraName}). Alternate padas for this constellation: ${sylAll.en.join(', ')}.`,
      pronunciationGuideHi: `जातक का जन्म नक्षत्र '${moon.nakshatraName}' के चरण ${moonPada} में होने से मुख्य नामाक्षर '${sylSingle.hi}' है। इस नक्षत्र के चारों चरणों के अक्षर: ${sylAll.hi.join(', ')} हैं।`,
    },
    paya: {
      nameEn: payaNameEn,
      nameHi: payaNameHi,
      metal: payaMetal,
      tone: payaTone,
      meaningEn: payaMeaningEn,
      meaningHi: payaMeaningHi,
      moonHouseFromLagna: moonHouse,
      classicalCauseEn: payaCauseEn,
      classicalCauseHi: payaCauseHi,
    },
  };

  // Pre-generate dynamic chapters sections
  const psychSections = computeDynamicPsychologySections(chart);
  const activePhaseSections = computeDynamicActivePhaseSections(chart);
  const [careerVerdictSec, careerEpochsSec] = computeDynamicCareerZenithSections(chart);
  const wealthSections = computeDynamicWealthInduLagnaSections(chart);

  // Marriage denial check
  const h7Sign = (asc.signIndex + 6) % 12;
  const h7Lord = SIGNS[h7Sign].lord;
  const h7LordPlanet = chart.planets.find((p) => p.id === h7Lord);

  const isMarriageDenial = Boolean(
    h7LordPlanet &&
    [6, 8, 12].includes(h7LordPlanet.rasiHouseNumber) &&
    (h7LordPlanet.dignity === 'Debilitated' || h7LordPlanet.isCombust || [saturn.rasiHouseNumber, ketu.rasiHouseNumber].includes(h7LordPlanet.rasiHouseNumber)) &&
    ([saturn.rasiHouseNumber, ketu.rasiHouseNumber].includes(venus.rasiHouseNumber) || venus.dignity === 'Debilitated' || [6, 8, 12].includes(venus.rasiHouseNumber))
  );

  const [marriageSpouseSec, marriageSexualitySec] = computeDynamicMarriageAndIntimacySections(chart, isMarriageDenial);
  const [healthTridoshaSec, healthAngaBhangaSec] = computeDynamicHealthSections(chart);
  const epochSections = computeDynamic12Epochs(chart);

  const pastReading = pastFuture?.pastLife;
  const futureReading = pastFuture?.futureBecoming;

  const sleepingHouses = lalKitab?.sleepingHouses.filter((h) => h.isSleeping) ?? [];
  const activeDebts = lalKitab?.karmicDebts.filter((d) => d.isTriggered) ?? [];
  const vedicRemedies = computeComprehensiveVedicRemedies(chart, lalKitab);


  const longevitySection: ChapterSection = {
    titleEn: 'Long-Term Wellbeing & Health Responsibility (Not a Lifespan Estimate)',
    titleHi: 'दीर्घकालीन स्वास्थ्य-जिम्मेदारी (आयु का अनुमान नहीं)',
    leadEn: 'Traditional symbolism for resilience and responsibility; this section does not estimate lifespan or manner of death.',
    leadHi: 'यह भाग केवल पारंपरिक प्रतीकों और स्वास्थ्य-अनुशासन की बात करता है; इससे आयु या मृत्यु का समय नहीं बताया जा सकता।',
    paragraphsEn: [
      `In traditional Jyotish, the Ascendant, 8th house and Saturn are discussed in connection with resilience, change and long-term responsibilities. These factors cannot reliably determine how long a person will live.`,
      `No age range, date, cause or manner of death can be responsibly inferred from this chart. For health concerns, rely on qualified clinicians, preventive screening and evidence-based care.`,
    ],
    paragraphsHi: [
      `परंपरागत ज्योतिष में लग्न, अष्टम भाव और शनि को जीवन की चुनौतियों, बदलाव तथा दीर्घकालीन जिम्मेदारियों के प्रतीक के रूप में देखा जाता है। इनसे किसी व्यक्ति की वास्तविक आयु या जीवनकाल विश्वसनीय रूप से तय नहीं किया जा सकता।`,
      `इस कुंडली से मृत्यु की आयु, तारीख, कारण या परिस्थिति बताना उचित नहीं है। स्वास्थ्य संबंधी प्रश्नों में योग्य चिकित्सक, नियमित जांच और प्रमाण-आधारित उपचार को प्राथमिकता दें।`,
    ],
    astrologicalCauseEn: `Traditional symbolic references: Ascendant, 8th house and Saturn. These are not a validated lifespan prediction method.`,
    astrologicalCauseHi: `शास्त्रीय कारण (पारंपरिक संकेत): लग्न, अष्टम भाव और शनि। यह आयु या मृत्यु की प्रमाणित भविष्यवाणी पद्धति नहीं है।`,
  };

  // Compile All 12 Chapters strictly mapping Bhavas 1 through 12
  const chapters: DossierChapter[] = [];

  // =========================================================================
  // CHAPTER 1: प्रथम भाव (तनु भाव) — देह यष्टि, रूप-रंग, अवकहड़ा व मूल पहचान
  // =========================================================================
  const h1Profile = computeHouseProfile(chart, 1);
  chapters.push({
    chapterNumber: 1,
    houseNumber: 1,
    id: 'chapter1_tanu_identity',
    titleEn: 'Chapter 1: First House (Tanu Bhava) — Identity, Constitution & Spiritual Roots',
    titleHi: 'अध्याय 1: प्रथम भाव (तनु भाव) — देह यष्टि, रूप-रंग, अवकहड़ा व मूल पहचान',
    subtitleEn: 'Sacred Triad (Ishta Devata, Naamakshar, Paya), Sensitive Coordinates, Physical Appearance & Core Temperament',
    subtitleHi: 'त्रिविध मूल पहचान (इष्ट, नामाक्षर, पाया), अवकहड़ा चक्र, संवेदनशील बिंदु, शारीरिक संरचना व स्वभाव',
    icon: 'compass',
    summaryQuoteEn: 'The root coordinates of the soul at the moment of the first breath define its elemental blueprint, primary spiritual protector, and constitutional metal.',
    summaryQuoteHi: 'प्रथम श्वास के क्षण पर कालपुरुष के चक्र में आत्मा की स्थिति ही उसके मूल तत्व, इष्ट देव और जन्म के धातु आधार को निर्धारित करती है।',
    bhavaProfile: h1Profile.profile,
    targetedRemedy: h1Profile.remedy,
    sections: [
      {
        titleEn: 'Sacred Triad of Identity: Ishta Devata, Birth Syllable & Paya',
        titleHi: 'त्रिविध आध्यात्मिक पहचान: इष्ट देवता, जन्म नामाक्षर एवं पाया',
        leadEn: 'The fundamental anchors that align the native with divine grace and name vibration.',
        leadHi: 'जातक के जन्म का मूल आध्यात्मिक आधार जो नाम-संस्कार और नित्य साधना को दिशा देता है।',
        paragraphsEn: [
          `Your sacred Ishta Devata is ${ishtaDeityInfo.en}. Classically revealed through the 12th house from the Karakamsa in your Navamsha chart (D9), this divine energy acts as your soul's primary karmic shield. Whenever you face profound crises, intellectual exhaustion, or spiritual doubts, meditating upon the sacred mantra '${ishtaDeityInfo.mantra}' on ${ishtaDeityInfo.dayEn} will untangle stubborn knots of destiny.`,
          `Your birth name syllable (Naamakshar) is '${sylSingle.en}', arising from the ${moonPada}th Pada of ${moon.nakshatraName} Nakshatra. Selecting a formal or calling name rooted in this vibration tunes your psychological field to the lunar currents of your birth chart, enhancing memory, social resonance, and fortune. The complete set of syllables for your constellation includes ${sylAll.en.join(', ')}.`,
          `Your birth foot (Paya) is ${payaNameEn}, established because the Moon occupies the ${moonHouse}th house from your Ascendant. ${payaMeaningEn}`,
        ],
        paragraphsHi: [
          `आपकी आत्मा के परम रक्षक इष्ट देवता '${ishtaDeityInfo.hi}' हैं। महर्षि जैमिनि के अनुसार नवांश चक्र में आत्मकारक ग्रह से द्वादश भाव (मोक्ष स्थान) के सूक्ष्म विश्लेषण से इस स्वरूप का प्राकट्य होता है। जीवन में जब भी भारी मानसिक द्वंद्व, पारिवारिक संकट या निर्णयहीनता की स्थिति बने, तो '${ishtaDeityInfo.dayHi}' के दिन '${ishtaDeityInfo.mantra}' मंत्र का यथाशक्ति जप करने से प्रारब्ध के कठिन अवरोध स्वतः विगलित होने लगते हैं।`,
          `आपका जन्म नामाक्षर '${sylSingle.hi}' है, जो चंद्रमा के '${moon.nakshatraName}' नक्षत्र के ${moonPada}वें चरण में संचार करने से उद्भूत हुआ है। इस नामाक्षर से प्रारंभ होने वाला नाम जातक के आभा-मंडल और मनःस्थिति को सीधे चंद्र तरंगों से जोड़ता है। इस नक्षत्र के सभी चार चरणों के पवित्र नामाक्षर: ${sylAll.hi.join(', ')} हैं।`,
          `आपका जन्म का पाया '${payaNameHi}' है, क्योंकि जन्म के समय चंद्रमा लग्न से ${moonHouse}वें भाव में स्थित हैं। ${payaMeaningHi}`,
        ],
        astrologicalCauseEn: `Classical Astrological Cause: ${ishtaClassicalCauseEn} | ${payaCauseEn}`,
        astrologicalCauseHi: `शास्त्रीय कारण: ${ishtaClassicalCauseHi} | ${payaCauseHi}`,
        keyPointsEn: [
          `Ishta Devata: ${ishtaDeityInfo.en} (${ishtaDeityInfo.mantra})`,
          `Naamakshar: '${sylSingle.en}' (Nakshatra: ${moon.nakshatraName}, Pada: ${moonPada})`,
          `Paya: ${payaNameEn} (House ${moonHouse} from Lagna)`,
        ],
        keyPointsHi: [
          `इष्ट देवता: ${ishtaDeityInfo.hi} (मूल मंत्र: ${ishtaDeityInfo.mantra})`,
          `जन्म नामाक्षर: '${sylSingle.hi}' (${moon.nakshatraName} नक्षत्र, चरण ${moonPada})`,
          `पाया: ${payaNameHi} (लग्न से भाव संख्या: ${moonHouse})`,
        ],
      },
      {
        titleEn: 'Avakahada & Ghatak Chakra Dynamics',
        titleHi: 'अवकहड़ा चक्र, गण, नाड़ी व घातक तत्व',
        leadEn: 'The biological and temperamental classification of your physical constitution.',
        leadHi: 'शारीरिक संरचना, स्वभाविक प्रकृति और काल के संवेदनशील घातक प्रहर।',
        paragraphsEn: [
          `Your Avakahada matrix places you in Varna: ${avakahada.varna}, Vashya: ${avakahada.vashya}, Yoni: ${avakahada.yoni}, Gana: ${avakahada.gana}, and Nadi: ${avakahada.nadi}. Belongs to the ${avakahada.tatvaEn} element. The ${avakahada.gana} Gana grants a temperamental disposition toward ${avakahada.gana === 'Deva' ? 'benevolence, principled thought, and peace' : avakahada.gana === 'Rakshasa' ? 'sharp sharpness, relentless drive, and acute crisis response' : 'practical worldly balance, human empathy, and hard work'}.`,
          `Your Ghatak Chakra flags specific periods when cosmic forces become friction-prone for your constitution: Ghatak Day: ${ghatak.varaEn}, Ghatak Tithi: ${ghatak.tithiEn}, Ghatak Nakshatra: ${ghatak.nakshatraEn}, and Ghatak Prahar: ${ghatak.praharEn}. Classical texts advise exercising measured caution when initiating high-stakes financial speculations or surgical procedures during these exact alignments.`,
        ],
        paragraphsHi: [
          `अवकहड़ा चक्र के अनुसार आपका वर्ण '${avakahada.varna}', वश्य '${avakahada.vashya}', योनि '${avakahada.yoni}', गण '${avakahada.gana}', और नाड़ी '${avakahada.nadi}' है। आपका तत्व '${avakahada.tatvaHi}' है। '${avakahada.gana}' गण होने के कारण आपका स्वभाव ${avakahada.gana === 'Deva' ? 'न्यायप्रिय, सात्विक, शांत और मर्यादापूर्ण' : avakahada.gana === 'Rakshasa' ? 'तीक्ष्ण, निर्भीक, रणनीतिक और संकट में तुरंत निर्णय लेने वाला' : 'व्यावहारिक, कर्मठ, मानवीय संवेदनाओं से युक्त और परिश्रमी'} रहता है।`,
          `घातक चक्र के अंतर्गत आपके जीवन के संवेदनशील घटक इस प्रकार हैं: घातक वार '${ghatak.varaEn}', घातक तिथि '${ghatak.tithiEn}', घातक नक्षत्र '${ghatak.nakshatraEn}', और घातक प्रहर '${ghatak.praharEn}'। जब गोचर में ये स्थितियां एक साथ सक्रिय हों, तो बड़े वित्तीय जोखिम, कोर्ट-कचहरी के समझौते अथवा शल्य चिकित्सा में विशेष सतर्कता बरतनी चाहिए।`,
        ],
        astrologicalCauseEn: `Classical Cause: Computed from sidereal Moon at ${moon.dms} in ${moonSignEn} (${moon.nakshatraName} Pada ${moonPada}).`,
        astrologicalCauseHi: `शास्त्रीय कारण: जन्म समय चंद्र देव ${moonSignHi} राशि में ${moon.dms} पर '${moon.nakshatraName}' के चरण ${moonPada} में स्थित हैं।`,
      },
      {
        titleEn: 'Sensitive Points, Special Lagnas & Vulnerability Alerts',
        titleHi: 'संवेदनशील बिंदु, विशेष लग्न एवं अरिष्ट सूचक भाग',
        leadEn: 'Crucial mathematical coordinates derived from Maharshi Parashara and Jaimini systems.',
        leadHi: 'महर्षि पाराशर एवं जैमिनि के गूढ़ गणितीय बिंदु जो जीवन की दिशा तय करते हैं।',
        paragraphsEn: [
          `Special Lagnas establish auxiliary reference points: Arudha Lagna (AL) falls in ${alPoint?.signNameEn || 'Auspicious Rasi'}, signifying your public image and social standing; Upapada Lagna (UL) falls in ${ulPoint?.signNameEn || 'Spousal Rasi'}, controlling marital durability and in-law relations; Bhava Lagna indicates inner vitality; and Hora Lagna governs wealth potential.`,
          `Sensitive karmic crosshairs: Your Yogi planet is ${sensitivePoints.yogiPlanetEn}, Saha-Yogi is ${sensitivePoints.sahaYogiPlanetEn}, while your Ava-Yogi (obstacle generator) is ${sensitivePoints.avaYogiPlanetEn}. The 22nd Drekkana Lord is ${sensitivePoints.twentySecondDrekkanaLordEn} and the 64th Navamsha Lord is ${sensitivePoints.sixtyFourthNavamshaLordEn}. Planets placed in Mrityu Bhaga: ${mrityuBhagas.filter((m) => m.severity !== 'Safe').map((m) => m.planet).join(', ') || 'None (All planets safe)'}. Pushkara Navamsha / Bhaga blessings exist for: ${pushkaraList.filter((p) => p.isPushkaraNavamsha).map((p) => p.planet).join(', ') || 'Standard dignities apply'}.`,
        ],
        paragraphsHi: [
          `विशेष लग्न जातक के विभिन्न आयामों को प्रकट करते हैं: आरूढ़ लग्न (AL) '${alPoint?.signNameHi || 'शुभ राशि'}' में है, जो आपकी सामाजिक प्रतिष्ठा और लोक-छवि का सूचक है; उपपद लग्न (UL) '${ulPoint?.signNameHi || 'दांपत्य राशि'}' में है, जो दांपत्य जीवन की स्थिरता का नियामक है।`,
          `कर्म चक्र के संवेदनशील बिंदु: आपके जीवन के 'योगी ग्रह' ${PLANET_HI[sensitivePoints.yogiPlanetEn] || sensitivePoints.yogiPlanetEn} (सौभाग्य प्रदाता) हैं, 'सह-योगी' ${PLANET_HI[sensitivePoints.sahaYogiPlanetEn] || sensitivePoints.sahaYogiPlanetEn} हैं, तथा 'अव-योगी' (बाधा कारक) ${PLANET_HI[sensitivePoints.avaYogiPlanetEn] || sensitivePoints.avaYogiPlanetEn} हैं। 22वें द्रेष्काण के स्वामी '${PLANET_HI[sensitivePoints.twentySecondDrekkanaLordEn] || sensitivePoints.twentySecondDrekkanaLordEn}' और 64वें नवांश के स्वामी '${PLANET_HI[sensitivePoints.sixtyFourthNavamshaLordEn] || sensitivePoints.sixtyFourthNavamshaLordEn}' हैं। मृत्यु भाग में स्थित ग्रह: ${mrityuBhagas.filter((m) => m.severity !== 'Safe').map((m) => PLANET_HI[m.planet] || m.planet).join(', ') || 'कोई ग्रह मृत्यु भाग में नहीं है (शुभ)'}। पुष्कर नवांश का अमृतमय बल प्राप्त ग्रह: ${pushkaraList.filter((p) => p.isPushkaraNavamsha).map((p) => PLANET_HI[p.planet] || p.planet).join(', ') || 'सामान्य स्थिति'}।`,
        ],
        astrologicalCauseEn: `Classical Cause: Calculated from Bhrigu Bindu, Drekkana (D3), Navamsha (D9) and Tithi Dagdha Rasi formulations.`,
        astrologicalCauseHi: `शास्त्रीय कारण: पाराशरी द्रेष्काण (D3), नवांश (D9), भृगु बिंदु और तिथि दग्ध राशि सिद्धांतों द्वारा गणितीय रूप से प्रमाणित।`,
      },
      physicalResult.section,
      psychSections[0],
    ],
    specialData: {
      avakahada,
      ghatak,
      topIdentity,
      sensitivePoints,
      mrityuBhagas,
      pushkaraList,
      physicalAppearance: physicalResult.data,
    },
  });

  // =========================================================================
  // CHAPTER 2: द्वितीय भाव (धन भाव) — संचित धन, पैतृक संपत्ति, वाणी व कुटुम्ब
  // =========================================================================
  const h2Profile = computeHouseProfile(chart, 2);
  chapters.push({
    chapterNumber: 2,
    houseNumber: 2,
    id: 'chapter2_dhana_wealth',
    titleEn: 'Chapter 2: Second House (Dhana Bhava) — Accumulated Wealth & Family Treasury',
    titleHi: 'अध्याय 2: द्वितीय भाव (धन भाव) — संचित धन, पैतृक संपत्ति, वाणी व कुटुम्ब',
    subtitleEn: 'Treasury Inflow Channels, Indu Lagna Wealth Potential, Speech Articulation & Family Lineage',
    subtitleHi: 'धन संचय के स्रोत, इंदु लग्न वैभव, वाणी प्रभाव, पैतृक धरोहर व पारिवारिक सुख',
    icon: 'coins',
    summaryQuoteEn: 'Accumulated wealth is the physical manifestation of preserved energy, sustaining family continuity across generations.',
    summaryQuoteHi: 'संचित धन ऊर्जा के संरक्षण का स्थूल रूप है, जो पीढ़ियों तक कुल और कुटुंब के संबल को बनाए रखता है।',
    bhavaProfile: h2Profile.profile,
    targetedRemedy: h2Profile.remedy,
    sections: [
      wealthSections[0],
      {
        titleEn: 'Family Lineage, Heritage & Speech Articulation',
        titleHi: 'कुल परंपरा, पैतृक संस्कार व वाणी प्रभाव',
        leadEn: 'The cultural roots, oral eloquence, and domestic harmony inherited from the family line.',
        leadHi: 'वंश परंपरा, वक्तृत्व कला, वाणी का प्रभाव एवं कुटुम्ब के साथ भावनात्मक संबंध।',
        paragraphsEn: [
          `Your 2nd house falls in ${h2Profile.profile.signNameEn}, ruled by ${h2Profile.profile.lordNameEn} (placed in House ${h2Profile.profile.lordPlacedHouse}, dignity: ${h2Profile.profile.lordDignity}). This configuration determines the depth of ancestral assets, family traditions, and oral eloquence.`,
          `Occupants in 2nd House: ${h2Profile.profile.occupantsEn.length > 0 ? h2Profile.profile.occupantsEn.join(', ') : 'Unoccupied (ruled directly by its dispositor)'}. When benefics influence this sector, words carry gravitational authority and sweetness; when afflicted by harsh malefics, speech can become abrasive, prompting disputes with relatives.`,
        ],
        paragraphsHi: [
          `आपकी कुंडली का द्वितीय भाव '${h2Profile.profile.signNameHi}' राशि में पड़ता है, जिसके स्वामी ग्रह '${h2Profile.profile.lordNameHi}' हैं (स्थिति: भाव ${h2Profile.profile.lordPlacedHouse}, अवस्था: ${h2Profile.profile.lordDignity})। यह स्थिति पैतृक संपत्ति, कुल संस्कारों तथा आपकी वाणी के प्रभाव को सीधे नियंत्रित करती है।`,
          `द्वितीय भाव में स्थित ग्रह: ${h2Profile.profile.occupantsHi.length > 0 ? h2Profile.profile.occupantsHi.join(', ') : 'कोई ग्रह स्थित नहीं है (पूर्णतः भावेश के अधीन)'}। जब शुभ ग्रह इस भाव पर दृष्टि डालते हैं, तो वाणी में ओज, सौम्यता और आकर्षण रहता है; यदि क्रूर ग्रह का प्रभाव हो, तो कटु वाणी से परिजनों से संबंध बिगड़ सकते हैं।`,
        ],
        astrologicalCauseEn: `Classical Cause: 2nd House dispositor dignity and Ashtakavarga bindu allocation (${h2Profile.profile.savBindus} bindus).`,
        astrologicalCauseHi: `शास्त्रीय कारण: द्वितीय भाव के स्वामी ग्रह का बलाबल तथा अष्टकवर्ग में ${h2Profile.profile.savBindus} बिंदुओं का गणितीय प्रभाव।`,
      },
      {
        titleEn: 'Capital Preservation & Material Security',
        titleHi: 'पूंजी सुरक्षा, बैंक बैलेंस व वित्तीय स्थायित्व',
        leadEn: 'Strategic insights on preventing sudden asset depletion and securing long-term solvency.',
        leadHi: 'अचानक होने वाली धन हानि से बचाव एवं दीर्घकालिक आर्थिक सुरक्षा की रणनीतियां।',
        paragraphsEn: [
          `With ${h2Profile.profile.savBindus} bindus in your 2nd house Sarvashtakavarga, your innate capability to retain hard-earned cash is rated as: ${h2Profile.profile.savBindus >= 28 ? 'Resilient and disciplined' : 'Prone to leakages requiring conscious budgeting'}.`,
          `Avoid pledging family heirlooms or undertaking speculative borrowings on behalf of acquaintances. Solid investments in tangible assets, gold, and fixed reserves yield greatest enduring peace.`,
        ],
        paragraphsHi: [
          `द्वितीय भाव में सर्वाष्टकवर्ग के ${h2Profile.profile.savBindus} बिंदु यह इंगित करते हैं कि आपकी संचित धन बनाए रखने की क्षमता '${h2Profile.profile.savBindus >= 28 ? 'सुदृढ़, अनुशासित और स्थिर' : 'रिसाव-उन्मुख है, जिसमें सुनियोजित बजटिंग आवश्यक है'}' है।`,
          `पैतृक संपत्ति को जोखिम भरे व्यापार में दांव पर न लगाएं और न ही दूसरों के ऋण की जमानत लें। स्वर्ण, सावधि जमा व सुरक्षित संपत्तियों में निवेश ही आपके वित्तीय भविष्य को अभेद्य बनाता है।`,
        ],
        astrologicalCauseEn: `Evaluated via Dhana Bhava Karaka Jupiter and 2nd Lord ${h2Profile.profile.lordNameEn}.`,
        astrologicalCauseHi: `शास्त्रीय कारण: धन कारक बृहस्पति एवं द्वितीयेश '${h2Profile.profile.lordNameHi}' की सम्मिलित स्थिति द्वारा प्रमाणित।`,
      },
    ],
  });

  // =========================================================================
  // CHAPTER 3: तृतीय भाव (सहज भाव) — पराक्रम, भाई-बहन, उद्यम व संवाद
  // =========================================================================
  const h3Profile = computeHouseProfile(chart, 3);
  chapters.push({
    chapterNumber: 3,
    houseNumber: 3,
    id: 'chapter3_sahaja_valour',
    titleEn: 'Chapter 3: Third House (Sahaja Bhava) — Valour, Initiative & Sibling Matrix',
    titleHi: 'अध्याय 3: तृतीय भाव (सहज भाव) — पराक्रम, भाई-बहन, उद्यम व संवाद',
    subtitleEn: 'Courage, Self-Made Enterprise, Sibling Ties, Communication & Artistic Drive',
    subtitleHi: 'बाहुबल, स्वावलंबन, भ्रातृ-भगिनी संबंध, लेखन-संचार कौशल व साहसिक निर्णय',
    icon: 'activity',
    summaryQuoteEn: 'True valour is neither bluster nor recklessness; it is the quiet persistence of the self-made spirit that turns obstacles into stepping stones.',
    summaryQuoteHi: 'सच्चा पराक्रम व्यर्थ का अहंकार नहीं, बल्कि स्वावलंबन की वह शांत शक्ति है जो विपत्तियों को सीढ़ियों में बदल देती है।',
    bhavaProfile: h3Profile.profile,
    targetedRemedy: h3Profile.remedy,
    sections: [
      {
        titleEn: 'Valour, Initiative & The Self-Made Spirit (Bahu Bala)',
        titleHi: 'पराक्रम, बाहुबल व स्वावलंबन की शक्ति',
        leadEn: 'The grit and determination that drive you forward when external support is absent.',
        leadHi: 'जब बाह्य सहयोग न मिले, तब जातक का आंतरिक साहस और पुरुषार्थ किस प्रकार काम करता है।',
        paragraphsEn: [
          `Your 3rd house is governed by ${h3Profile.profile.signNameEn}, ruled by ${h3Profile.profile.lordNameEn} located in House ${h3Profile.profile.lordPlacedHouse} (${h3Profile.profile.lordDignity}). Third house represents Upachaya (growth through effort), signifying that your courage compounds with experience.`,
          `Occupants: ${h3Profile.profile.occupantsEn.length > 0 ? h3Profile.profile.occupantsEn.join(', ') : 'None (open sky, dispositor-driven)'}. Malefics here (Mars, Saturn, Sun, Rahu) act as fierce warriors, conferring fearless risk-taking, whereas benefics cultivate diplomatic charm and literary flair.`,
        ],
        paragraphsHi: [
          `तृतीय भाव '${h3Profile.profile.signNameHi}' राशि में स्थित है, जिसके स्वामी ग्रह '${h3Profile.profile.lordNameHi}' भाव ${h3Profile.profile.lordPlacedHouse} में (${h3Profile.profile.lordDignity}) विराजमान हैं। तृतीय भाव एक उपचय स्थान है, जिसका अर्थ है कि जीवन में संघर्ष और अनुभव के साथ आपका साहस और कार्यक्षमता निरंतर बढ़ती जाएगी।`,
          `तृतीय भाव में ग्रह: ${h3Profile.profile.occupantsHi.length > 0 ? h3Profile.profile.occupantsHi.join(', ') : 'रिक्त (पूर्णतः भावेश के नियंत्रण में)'}। इस भाव में क्रूर ग्रहों की स्थिति जातक को निर्भीक योद्धा बनाती है जो विपरीत परिस्थितियों में कभी हार नहीं मानता; वहीं शुभ ग्रह वाणी, कला, लेखन और कूटनीति में निपुणता देते हैं।`,
        ],
        astrologicalCauseEn: `Classical Cause: BPHS Upachaya Bhava rules: natural malefics produce extraordinary valour in the 3rd house.`,
        astrologicalCauseHi: `शास्त्रीय कारण: बृहत्पाराशर होरा शास्त्र के नियमानुसार तृतीय उपचय भाव में क्रूर ग्रह अदम्य बाहुबल व विजय प्रदान करते हैं।`,
      },
      {
        titleEn: 'Sibling Dynamics & Kinship Support',
        titleHi: 'भाई-बहन (सहज सुख) एवं सगे संबंधियों का यथार्थ',
        leadEn: 'Rapport, mutual affection, and potential frictions with brothers and sisters.',
        leadHi: 'भाई-बहनों के साथ आत्मीयता, सहयोग, संपत्ति के बंटवारे व वैचारिक तालमेल का सत्य।',
        paragraphsEn: [
          `The natural Karaka for siblings is Mars (Bhratrukaraka). With your 3rd lord in ${h3Profile.profile.lordDignity} dignity, relations with co-borns will experience ${h3Profile.profile.afflictionScore >= 50 ? 'solid mutual backing and familial camaraderie' : 'occasional friction or distance due to property and ego priorities'}.`,
          `Ensure transparent communication during inheritance settlements to prevent lifelong estrangements. Avoid lending money to relatives without clear timelines.`,
        ],
        paragraphsHi: [
          `भाई-बहनों के नैसर्गिक कारक मंगल देव हैं। तृतीयेश '${h3Profile.profile.lordNameHi}' की ${h3Profile.profile.lordDignity} स्थिति के आधार पर भाई-बहनों से संबंध '${h3Profile.profile.afflictionScore >= 50 ? 'सहयोगात्मक व स्नेहपूर्ण रहेंगे' : 'पारिवारिक दायित्वों अथवा संपत्ति के मामलों में समय-समय पर मतभेद दर्शाते हैं'}'।`,
          `पैतृक संपत्ति अथवा वित्तीय लेन-देन में पूर्ण पारदर्शिता रखें ताकि आपसी प्रेम में कटुता न आए। निकट संबंधियों को बिना लिखित स्पष्टता के बड़े ऋण देने से बचें।`,
        ],
        astrologicalCauseEn: `Evaluated through 3rd lord ${h3Profile.profile.lordNameEn} and Mars (Bhratru Karaka).`,
        astrologicalCauseHi: `शास्त्रीय कारण: तृतीयेश '${h3Profile.profile.lordNameHi}' तथा भ्रातृ कारक मंगल की सम्मिलित दृष्टि द्वारा परीक्षित।`,
      },
      {
        titleEn: 'Communication, Fine Arts & Hands-On Skills',
        titleHi: 'संचार क्षमता, लेखन, डिजिटल माध्यम व कलात्मक प्रतिभा',
        leadEn: 'Your aptitude for writing, journalism, marketing, negotiations, and manual dexterity.',
        leadHi: 'लेखन, जनसंचार, डिजिटल मीडिया, विपणन एवं शिल्पकला में आपकी स्वाभाविक दक्षता।',
        paragraphsEn: [
          `The 3rd house governs the hands, throat, and intellectual curiosity. It signifies strong potential in modern communications, digital enterprise, creative writing, and persuasive public dialogue.`,
          `Channel your mental restlessness into tangible creative publications, technical craft, or business diplomacy to convert latent kinetic energy into commercial triumph.`,
        ],
        paragraphsHi: [
          `तृतीय भाव हस्त-कौशल, कंठ, गायन, लेखन और तकनीकी उद्यम का प्रतिनिधित्व करता है। यह भाव आधुनिक संचार माध्यमों, डिजिटल मार्केटिंग, लेखन और वार्ता कौशल में आपकी विशेष रुचि को दर्शाता है।`,
          `अपनी मानसिक ऊर्जा को रचनात्मक लेखन, तकनीकी कौशल अथवा व्यापारिक वार्ताओं में नियोजित करने से आपको अप्रत्याशित सफलता और सामाजिक सम्मान प्राप्त होगा।`,
        ],
        astrologicalCauseEn: `Mercury and 3rd house dispositor synergy.`,
        astrologicalCauseHi: `शास्त्रीय कारण: बुध एवं तृतीय भाव के स्वामी ग्रह का संयुक्त प्रभाव।`,
      },
    ],
  });

  // =========================================================================
  // CHAPTER 4: चतुर्थ भाव (सुख भाव) — मातृ सुख, भूमि-भवन, वाहन व आंतरिक शांति
  // =========================================================================
  const h4Profile = computeHouseProfile(chart, 4);
  chapters.push({
    chapterNumber: 4,
    houseNumber: 4,
    id: 'chapter4_sukha_assets',
    titleEn: 'Chapter 4: Fourth House (Sukha Bhava) — Maternal Grace, Land, Assets & Inner Peace',
    titleHi: 'अध्याय 4: चतुर्थ भाव (सुख भाव) — मातृ सुख, भूमि-भवन, वाहन व आंतरिक शांति',
    subtitleEn: 'Mother Bond, Real Estate, Domestic Tranquility, Vehicle Comfort & Emotional Sanctuary',
    subtitleHi: 'मातृ कृपा, अचल संपत्ति (भूमि-भवन), वाहन सुख, गृहस्थ शांति व मानसिक संतुलन',
    icon: 'heart',
    summaryQuoteEn: 'The home is not mere brick and mortar; it is the emotional sanctuary where the restless soul finds restoration.',
    summaryQuoteHi: 'गृह केवल ईंट-पत्थर का ढांचा नहीं; यह वह भावात्मक तीर्थ है जहां थकी हुई आत्मा विश्राम और शांति पाती है।',
    bhavaProfile: h4Profile.profile,
    targetedRemedy: h4Profile.remedy,
    sections: [
      {
        titleEn: 'Maternal Grace & Emotional Foundation',
        titleHi: 'मातृ सुख, माता का स्वास्थ्य व भावात्मक संस्कार',
        leadEn: 'The profound psychological imprints inherited from the mother and domestic environment.',
        leadHi: 'माता से प्राप्त स्नेह, उनकी जीवन यात्रा, स्वास्थ्य तथा आपकी आंतरिक भावनात्मक संरचना।',
        paragraphsEn: [
          `Your 4th house is positioned in ${h4Profile.profile.signNameEn}, ruled by ${h4Profile.profile.lordNameEn} (placed in House ${h4Profile.profile.lordPlacedHouse}, dignity: ${h4Profile.profile.lordDignity}). The Moon acts as the natural Karaka of maternal blessings and emotional peace.`,
          `Maternal Bond: ${h4Profile.profile.afflictionScore >= 50 ? 'Strong maternal support, deep moral upbringing, and family warmth.' : 'Mother may endure health vulnerabilities, or ideological differences may cause inner distress.'} Serving the mother and seeking her daily blessings resolves unseen domestic anxieties.`,
        ],
        paragraphsHi: [
          `आपकी कुंडली में चतुर्थ भाव '${h4Profile.profile.signNameHi}' राशि में है, जिसके स्वामी ग्रह '${h4Profile.profile.lordNameHi}' हैं (भाव ${h4Profile.profile.lordPlacedHouse} में ${h4Profile.profile.lordDignity})। मातृ सुख एवं मन की शांति के नैसर्गिक कारक चंद्रमा हैं।`,
          `मातृ संबंध का यथार्थ: '${h4Profile.profile.afflictionScore >= 50 ? 'माता का वात्सल्य, उत्तम संस्कार और पारिवारिक संरक्षण प्राप्त होगा।' : 'माता के स्वास्थ्य में समय-समय पर कष्ट अथवा विचारों में भिन्नता के कारण मानसिक चिंता हो सकती है।'}' माता की सेवा और उनका आशीर्वाद आपके जीवन के सबसे बड़े सुरक्षा कवच का काम करेगा।`,
        ],
        astrologicalCauseEn: `4th Lord ${h4Profile.profile.lordNameEn} and Moon placement in ${moonSignEn}.`,
        astrologicalCauseHi: `शास्त्रीय कारण: चतुर्थेश '${h4Profile.profile.lordNameHi}' तथा चंद्र देव की ${moonSignHi} राशि में स्थिति।`,
      },
      {
        titleEn: 'Fixed Assets: Land, Real Estate (Bhumi) & Conveyances (Vahana)',
        titleHi: 'अचल संपत्ति: भूमि-भवन, रियल एस्टेट व वाहन सुख',
        leadEn: 'Prospects of constructing your own residence and owning comfortable luxury vehicles.',
        leadHi: 'स्वयं का मकान बनाने के योग, भूखंड क्रय, पैतृक आवास व वाहन प्राप्ति की शास्त्रीय स्थिति।',
        paragraphsEn: [
          `Planetary indicators for fixed property (Bhumi Karaka Mars and 4th house): With ${h4Profile.profile.savBindus} bindus in SAV, property accumulation is ${h4Profile.profile.savBindus >= 28 ? 'highly favorable, promising home ownership and land acquisition' : 'likely to involve legal scrutiny, mortgage delays, or disputed paperwork'}.`,
          `Vehicles (Vahana Sukha): The influence of Venus and the 4th lord ensures ownership of reliable personal conveyances. Guard against rash driving during adverse Mars/Rahu transits.`,
        ],
        paragraphsHi: [
          `भूमि व अचल संपत्ति के नैसर्गिक कारक मंगल देव तथा चतुर्थ भाव का संबंध: चतुर्थ भाव में अष्टकवर्ग के ${h4Profile.profile.savBindus} बिंदु होने से स्वयं का मकान व भूमि अर्जन '${h4Profile.profile.savBindus >= 28 ? 'अत्यंत सुलभ व शुभ रहेगा' : 'कागजी पड़ताल, बैंक ऋण अथवा प्रारंभिक अड़चनों के बाद ही संभव होगा'}'।`,
          `वाहन सुख: शुक्र देव और चतुर्थेश की स्थिति सुखद व्यक्तिगत वाहन का योग बनाती है। राहु या मंगल के प्रतिकूल गोचर के समय वाहन सावधानी से चलाएं।`,
        ],
        astrologicalCauseEn: `Evaluated via Bhumi Karaka Mars, Vahana Karaka Venus, and 4th House SAV bindus (${h4Profile.profile.savBindus}).`,
        astrologicalCauseHi: `शास्त्रीय कारण: भूमि कारक मंगल, वाहन कारक शुक्र तथा चतुर्थ भाव के अष्टकवर्ग (${h4Profile.profile.savBindus} बिंदु)।`,
      },
      {
        titleEn: 'Domestic Sanctuary & Inner Peace',
        titleHi: 'गृहस्थ वातावरण, मन की शांति व हृदय स्वास्थ्य',
        leadEn: 'The sanctuary of your personal residence and emotional resilience against external chaos.',
        leadHi: 'घर की चारदीवारी के भीतर मानसिक शांति, सीने/हृदय का स्वास्थ्य व एकांत विश्राम।',
        paragraphsEn: [
          `The 4th house corresponds to the chest, heart, and the emotional reservoir of the mind. An unblemished 4th house allows deep rejuvenating sleep; when troubled by malefic aspects, it produces restlessness and domestic discord.`,
          `Keep your living quarters uncluttered and ensure the northeast (Ishanya) corner remains clean and luminous to foster domestic tranquility.`,
        ],
        paragraphsHi: [
          `कालपुरुष के अंग विभाग में चतुर्थ भाव छाती, हृदय और मन के आंतरिक आनंद का प्रतिनिधित्व करता है। चतुर्थ भाव पर शुभ प्रभाव होने से जातक घर आते ही दिनभर की थकान भूल जाता है; यदि यह भाव पीड़ित हो तो घर में भी मन उचाट रहता है।`,
          `अपने घर के ईशान कोण (उत्तर-पूर्व) को सदैव स्वच्छ, हल्का और प्रकाशयुक्त रखें, जिससे घर में सकारात्मक ऊर्जा और पारिवारिक शांति बनी रहे।`,
        ],
        astrologicalCauseEn: `Kalapurusha 4th house anatomical correlation with chest and psychic tranquility.`,
        astrologicalCauseHi: `शास्त्रीय कारण: कालपुरुष सिद्धांत अनुसार चतुर्थ भाव का छाती, हृदय और मानसिक शांति से सीधा संबंध।`,
      },
    ],
  });

  // =========================================================================
  // CHAPTER 5: पंचम भाव (सुत व बुद्धि भाव) — मेधा, उच्च शिक्षा, संतान व पूर्व पुण्य
  // =========================================================================
  const h5Profile = computeHouseProfile(chart, 5);
  chapters.push({
    chapterNumber: 5,
    houseNumber: 5,
    id: 'chapter5_suta_intellect',
    titleEn: 'Chapter 5: Fifth House (Suta Bhava) — Intellect, Higher Education & Progeny',
    titleHi: 'अध्याय 5: पंचम भाव (सुत व बुद्धि भाव) — मेधा, उच्च शिक्षा, संतान व पूर्व पुण्य',
    subtitleEn: 'Academic Crucible, Competitive Exam Acumen, Progeny Lineage, Speculation & Past Merit',
    subtitleHi: 'अकादमिक साधना, प्रतियोगी परीक्षा योग्यता, संतान सुख, शेयर/सट्टा विवेक व पूर्व जन्म के संचित पुण्य',
    icon: 'sparkles',
    summaryQuoteEn: 'Intellect illumines the path of action, while past merit quietly tilts the scales of fortune in moments of uncertainty.',
    summaryQuoteHi: 'बुद्धि कर्म के मार्ग को आलोकित करती है, और पूर्व जन्म का संचित पुण्य अनिश्चितता के क्षणों में अदृश्य संबल बनकर खड़ा होता है।',
    bhavaProfile: h5Profile.profile,
    targetedRemedy: h5Profile.remedy,
    sections: [
      educationResult.section,
      {
        titleEn: 'Progeny, Lineage Continuity & Childbirth Dynamics',
        titleHi: 'संतान सुख, कुल वृद्धि व बालकों का भविष्य',
        leadEn: 'Prospects of dutiful progeny, timing of parenthood, and bond with children.',
        leadHi: 'संतान प्राप्ति के योग, पुत्र-पुत्री सुख, संतान का चरित्र एवं उनके साथ भावनात्मक संबंध।',
        paragraphsEn: [
          `The 5th house rules progeny, with Jupiter as the prime Putrakaraka. Your 5th house falls in ${h5Profile.profile.signNameEn}, ruled by ${h5Profile.profile.lordNameEn} (House ${h5Profile.profile.lordPlacedHouse}, dignity: ${h5Profile.profile.lordDignity}).`,
          `Lineage Fortune: ${h5Profile.profile.afflictionScore >= 50 ? 'Blessings of bright, virtuous children who carry forward family honor.' : 'Possible delays or medical interventions required for parenthood; patience and medical care advised.'} When Rahu/Ketu or Saturn influence the 5th, worship of Lord Krishna (Santan Gopal) or Lord Ganesha dissolves subtle progeny obstacles.`,
        ],
        paragraphsHi: [
          `पंचम भाव संतान सुख का मुख्य स्थान है, जिसके नैसर्गिक कारक देवगुरु बृहस्पति हैं। आपकी कुंडली में पंचम भाव '${h5Profile.profile.signNameHi}' राशि में है, जिसके स्वामी ग्रह '${h5Profile.profile.lordNameHi}' हैं (स्थिति: भाव ${h5Profile.profile.lordPlacedHouse}, अवस्था: ${h5Profile.profile.lordDignity})।`,
          `संतान सुख का यथार्थ: '${h5Profile.profile.afflictionScore >= 50 ? 'योग्य, आज्ञाकारी व कुल की प्रतिष्ठा बढ़ाने वाली संतान का सुख प्राप्त होगा।' : 'संतान प्राप्ति में कुछ विलंब अथवा गर्भधारण में चिकित्सीय परामर्श की आवश्यकता हो सकती है; धैर्य रखें।'}' पंचम भाव पर राहु, केतु या शनि के प्रभाव की स्थिति में संतान गोपाल मंत्र अथवा भगवान श्री गणेश की आराधना अत्यंत कल्याणकारी रहती है।`,
        ],
        astrologicalCauseEn: `5th Lord ${h5Profile.profile.lordNameEn} and Putrakaraka Jupiter analysis.`,
        astrologicalCauseHi: `शास्त्रीय कारण: पंचमेश '${h5Profile.profile.lordNameHi}' तथा पुत्र कारक बृहस्पति की स्थिति।`,
      },
      {
        titleEn: 'Speculation, Risk Appetite & Past Life Merits (Purva Punya)',
        titleHi: 'शेयर बाजार, जोखिम क्षमता व पूर्व जन्म का संचित पुण्य',
        leadEn: 'Intuitive forecasting, investment acumen in equities, and sudden luck triggers.',
        leadHi: 'शेयर मार्केट, सट्टेबाजी, वित्तीय जोखिम लेने की प्रवृत्ति व पूर्व जन्म के संचित पुण्यों का उदय।',
        paragraphsEn: [
          `The 5th house governs discretionary intellect, speculative investments, and Purva Punya (fruits of past good deeds). With an affliction score of ${h5Profile.profile.afflictionScore}/100, speculative gambling or intraday trading is: ${h5Profile.profile.afflictionScore >= 65 ? 'Favorable with disciplined research' : 'Extremely risky; capital preservation via long-term compounding is strongly advised'}.`,
          `Mantra Siddhi & Intuition: You possess a sharp innate instinct that warns you before impending pitfalls. Nurture this through regular mantra meditation.`,
        ],
        paragraphsHi: [
          `पंचम भाव जातक के पूर्व जन्म के संचित पुण्य (पूर्व पुण्य), विवेक और सट्टा/शेयर बाजार से अचानक लाभ का नियामक है। पंचम भाव का सामर्थ्य स्कोर ${h5Profile.profile.afflictionScore}/100 होने के कारण इंट्राडे ट्रेडिंग या सट्टेबाजी: '${h5Profile.profile.afflictionScore >= 65 ? 'गहन अध्ययन के साथ अनुकूल परिणाम दे सकती है' : 'अत्यंत जोखिम भरी है; पूंजी डूबने का खतरा है, अतः केवल दीर्घकालिक सुरक्षित निवेश ही करें'}'।`,
          `मंत्र सिद्धि व अंतःप्रेरणा: आपकी अंतरात्मा संकट आने से पूर्व ही चेतावनी देती है। नित्य गायत्री या इष्ट मंत्र के जप से यह आंतरिक दृष्टि और भी तीव्र होती है।`,
        ],
        astrologicalCauseEn: `5th house connection to 9th (Bhagya) as Bhavat Bhavam (9th from 9th).`,
        astrologicalCauseHi: `शास्त्रीय कारण: भावात भावम नियमानुसार पंचम भाव भाग्य भाव (नवम) से नवम होकर पूर्व जन्म का पुण्य कोष है।`,
      },
    ],
    specialData: {
      educationAcademics: educationResult.data,
    },
  });

  // =========================================================================
  // CHAPTER 6: षष्ठ भाव (रिपु व रोग भाव) — रोग (त्रिदोष), ऋण, शत्रु, मुकदमेबाजी व व्यसन
  // =========================================================================
  const h6Profile = computeHouseProfile(chart, 6);
  chapters.push({
    chapterNumber: 6,
    houseNumber: 6,
    id: 'chapter6_ripu_adversaries',
    titleEn: 'Chapter 6: Sixth House (Ripu Bhava) — Diseases, Debts, Enemies & Legal Hazards',
    titleHi: 'अध्याय 6: षष्ठ भाव (रिपु व रोग भाव) — रोग (त्रिदोष), ऋण, शत्रु, मुकदमेबाजी व व्यसन',
    subtitleEn: 'Ayurvedic Tridosha Vulnerabilities, Debt Cycles, Litigation Realities & Addiction Checks',
    subtitleHi: 'आयुर्वेदिक त्रिदोष संवेदनशीलता, ऋण चक्र, कोर्ट-कचहरी की वास्तविकता व व्यसन जांच',
    icon: 'shield-alert',
    summaryQuoteEn: 'Adversaries and afflictions are the relentless whetstones upon which the blade of character is sharpened.',
    summaryQuoteHi: 'शत्रु और व्याधियां वह कठोर सान हैं जिन पर घिसकर ही व्यक्ति के चरित्र और धैर्य की धार तेज होती है।',
    bhavaProfile: h6Profile.profile,
    targetedRemedy: h6Profile.remedy,
    sections: [
      healthTridoshaSec,
      {
        titleEn: 'Debt Dynamics & Financial Borrowing Hazards',
        titleHi: 'ऋण चक्र (कर्ज) एवं वित्तीय उधारी से उत्पन्न संकट',
        leadEn: 'Your relationship with borrowed capital, EMIs, and risks of financial traps.',
        leadHi: 'कर्ज लेने की प्रवृत्ति, ईएमआई का बोझ, अनपेक्षित देनदारियां व बैंक ऋण की स्थिति।',
        paragraphsEn: [
          `The 6th house governs Rina (debts and liabilities). With 6th lord ${h6Profile.profile.lordNameEn} in House ${h6Profile.profile.lordPlacedHouse} (${h6Profile.profile.lordDignity}), debt cycles require conscious supervision.`,
          `${h6Profile.profile.afflictionScore < 48 ? 'Warning: High susceptibility to taking on burdensome personal loans or credit liabilities that can suffocate cash flow. Avoid signing loan guarantees for friends or associates.' : 'Debts, if incurred, will be for constructive asset creation (home/business) and will be repaid systematically through disciplined income.'}`,
        ],
        paragraphsHi: [
          `षष्ठ भाव ऋण (कर्ज एवं देनदारियों) का स्थान है। षष्ठेश '${h6Profile.profile.lordNameHi}' भाव ${h6Profile.profile.lordPlacedHouse} में स्थित होने के कारण कर्ज के मामलों में अत्यधिक सावधानी बरतने की आवश्यकता है।`,
          `${h6Profile.profile.afflictionScore < 48 ? 'चेतावनी: अनावश्यक उपभोग अथवा दूसरों की मदद के लिए बैंक से बड़ा कर्ज लेने की गलती न करें; ईएमआई का भारी दबाव मानसिक तनाव उत्पन्न कर सकता है। किसी अन्य के ऋण के लिए अपनी गारंटी न दें।' : 'यदि कोई ऋण लिया भी जाएगा, तो वह मकान अथवा व्यापारिक संपत्ति निर्माण जैसे उत्पादक कार्यों के लिए होगा और समय पर सुचारू रूप से चुका दिया जाएगा।' }`,
        ],
        astrologicalCauseEn: `6th House dispositor and Mars/Saturn aspect dynamics on Upachaya.`,
        astrologicalCauseHi: `शास्त्रीय कारण: षष्ठेश '${h6Profile.profile.lordNameHi}' तथा ऋण कारक ग्रहों का षष्ठ भाव पर प्रभाव।`,
      },
      litigationResult.section,
      addictionsResult.section,
    ],
    specialData: {
      addictionsAndVices: addictionsResult.data,
      litigationAndAffairs: litigationResult.data,
    },
  });

  // =========================================================================
  // CHAPTER 7: सप्तम भाव (कलत्र भाव) — दांपत्य जीवन, जीवनसाथी का यथार्थ स्वरूप व साझेदारी
  // =========================================================================
  const h7Profile = computeHouseProfile(chart, 7);
  chapters.push({
    chapterNumber: 7,
    houseNumber: 7,
    id: 'chapter7_kalatra_marriage',
    titleEn: 'Chapter 7: Seventh House (Kalatra Bhava) — Marriage Reality, Spouse Persona & Partnerships',
    titleHi: 'अध्याय 7: सप्तम भाव (कलत्र भाव) — दांपत्य जीवन, जीवनसाथी का यथार्थ स्वरूप व साझेदारी',
    subtitleEn: 'Spouse Physical & Behavioral Blueprint, Celibacy/Delay Diagnostics, Bed Pleasures & Commercial Alliances',
    subtitleHi: 'जीवनसाथी का शारीरिक व स्वभाविक स्वरूप, विवाह में विलंब/बाधा जांच, काम-प्रकृति व व्यावसायिक साझेदारी',
    icon: 'users',
    summaryQuoteEn: 'Marital destiny is not a fairy tale of seamless harmony, but the sacred crucible where two distinct karmic streams learn mutual reverence.',
    summaryQuoteHi: 'दांपत्य कोई काल्पनिक परीकथा नहीं, बल्कि वह पावन यज्ञ है जहां दो पृथक प्रारब्ध धाराएं परस्पर सम्मान और त्याग सीखती हैं।',
    bhavaProfile: h7Profile.profile,
    targetedRemedy: h7Profile.remedy,
    sections: [
      marriageSpouseSec,
      {
        titleEn: 'Marital Durability, Delay & Conflict Diagnostics',
        titleHi: 'वैवाहिक स्थायित्व, विवाह में विलंब व कलह की शास्त्रीय जांच',
        leadEn: 'Authentic astrological evaluation of compatibility, Manglik factors, and conflict zones.',
        leadHi: 'मांगलिक दोष, वैवाहिक अवरोध, मतभेद के संवेदनशील बिंदु एवं दांपत्य जीवन की दीर्घकालिक स्थिरता।',
        paragraphsEn: [
          `Seventh House sign: ${h7Profile.profile.signNameEn}, ruled by ${h7Profile.profile.lordNameEn} (placed in House ${h7Profile.profile.lordPlacedHouse}, dignity: ${h7Profile.profile.lordDignity}). Natural Karaka of marriage is Venus (for males) and Jupiter (for females).`,
          `${h7Profile.profile.afflictionScore < 48 ? 'Raw Reality: Marital discord, stubborn ideological friction, or delayed matrimony indicated. The couple must practice mutual forbearance, avoid involving extended in-laws in personal disagreements, and maintain strict loyalty.' : 'Harmonious disposition: Marital union will be an anchor of emotional and material progress, with the spouse contributing significantly to social standing.'}`,
        ],
        paragraphsHi: [
          `सप्तम भाव '${h7Profile.profile.signNameHi}' राशि में है, जिसके स्वामी ग्रह '${h7Profile.profile.lordNameHi}' हैं (भाव ${h7Profile.profile.lordPlacedHouse} में ${h7Profile.profile.lordDignity})। विवाह के नैसर्गिक कारक शुक्र (पुरुषों के लिए) और देवगुरु बृहस्पति (स्त्रियों के लिए) हैं।`,
          `${h7Profile.profile.afflictionScore < 48 ? 'यथार्थ सत्य: वैवाहिक जीवन में विचारों का तीखा टकराव, अहं की लड़ाई अथवा विवाह में अप्रत्याशित विलंब के संकेत हैं। दांपत्य को टूटने से बचाने के लिए दोनों पक्षों को धैर्य, क्षमा और आपसी संवाद बनाए रखना होगा। छोटी बातों को ससुराल पक्ष तक न ले जाएं।' : 'शुभ योग: जीवनसाथी के आगमन के पश्चात आपका भाग्योदय होगा; वे आपके सामाजिक मान-सम्मान और पारिवारिक समृद्धि में महत्वपूर्ण स्तंभ बनेंगे।' }`,
        ],
        astrologicalCauseEn: `7th Lord ${h7Profile.profile.lordNameEn}, Venus dignity, and Upapada Lagna (UL) coordinates.`,
        astrologicalCauseHi: `शास्त्रीय कारण: सप्तमेश '${h7Profile.profile.lordNameHi}', कारक शुक्र/गुरु एवं उपपद लग्न (UL) का सूक्ष्म समीकरण।`,
      },
      marriageSexualitySec,
      {
        titleEn: 'Commercial Partnerships & Public Alliances',
        titleHi: 'व्यावसायिक साझेदारी एवं सार्वजनिक व्यवहार',
        leadEn: 'Prospects of joint business ventures, legal contracts, and public-facing alliances.',
        leadHi: 'साझेदारी में व्यापार के योग, व्यावसायिक अनुबंधों में सावधानी व जनसंपर्क की शक्ति।',
        paragraphsEn: [
          `The 7th house is 10th from the 10th (Bhavat Bhavam for profession), governing external business transactions and joint ventures.`,
          `${h7Profile.profile.afflictionScore >= 50 ? 'Partnerships with trusted, ethical associates will flourish and expand your commercial footprint.' : 'Caution: Partnership ventures carry risk of betrayal, financial opacity, or legal fallout. Prefer sole proprietorship or clearly audited legal contracts.'}`,
        ],
        paragraphsHi: [
          `सप्तम भाव दशम से दशम (कर्म का कर्म) होने के कारण व्यापारिक साझेदारियों, सार्वजनिक लेन-देन और अनुबंधों का स्थान है।`,
          `${h7Profile.profile.afflictionScore >= 50 ? 'सदाचारी व पारदर्शी साझेदारों के साथ किया गया व्यापार निरंतर उन्नति करेगा और नए बाजारों में विस्तार दिलाएगा।' : 'सावधानी: साझेदारी में व्यापार करने पर विश्वासघात, हिसाब-किताब में हेराफेरी अथवा विवाद की आशंका रहती है। यथासंभव स्वतंत्र व्यापार करें अथवा सभी अनुबंध लिखित व कानूनी रूप से स्पष्ट रखें।' }`,
        ],
        astrologicalCauseEn: `7th house as 10th from 10th (Bhavat Bhavam) commercial nexus.`,
        astrologicalCauseHi: `शास्त्रीय कारण: भावात भावम सिद्धांत अनुसार दशम से दशम भाव का व्यापारिक प्रभाव।`,
      },
    ],
  });

  // =========================================================================
  // CHAPTER 8: अष्टम भाव (रंध्र भाव) — परिवर्तन, साझा संसाधन व दीर्घकालीन जिम्मेदारी
  // =========================================================================
  const h8Profile = computeHouseProfile(chart, 8);
  chapters.push({
    chapterNumber: 8,
    houseNumber: 8,
    id: 'chapter8_randhra_longevity',
    titleEn: 'Chapter 8: Eighth House (Randhra Bhava) — Transformation, Shared Resources & Resilience',
    titleHi: 'अध्याय 8: अष्टम भाव (रंध्र भाव) — परिवर्तन, साझा संसाधन और धैर्य',
    subtitleEn: 'Traditional symbolism of change, shared assets, research and personal resilience',
    subtitleHi: 'परिवर्तन, साझा संपत्ति, अनुसंधान और व्यक्तिगत धैर्य का पारंपरिक प्रतीकात्मक अध्ययन',
    icon: 'hourglass',
    summaryQuoteEn: 'The eighth house is traditionally associated with change, shared resources and the need for resilience.',
    summaryQuoteHi: 'अष्टम भाव को परंपरागत रूप से परिवर्तन, साझा संसाधनों और धैर्य की आवश्यकता से जोड़ा जाता है।',
    bhavaProfile: h8Profile.profile,
    targetedRemedy: h8Profile.remedy,
    sections: [
      longevitySection,
      healthAngaBhangaSec,
      {
        titleEn: 'Hidden Wealth, Inheritance & Esoteric Depth',
        titleHi: 'गुप्त धन, वसीयत, पैतृक दायभाग व गूढ़ विद्या',
        leadEn: 'Access to unearned assets, occult sciences, astrology, and deep psychological transformation.',
        leadHi: 'अचानक प्राप्त होने वाला धन, बीमा लाभ, वसीयतनामा, ज्योतिष-तंत्र-मंत्र का ज्ञान व आंतरिक कायाकल्प।',
        paragraphsEn: [
          `The 8th house governs unearned wealth, life insurance settlements, wills, and legacy assets. With 8th lord in House ${h8Profile.profile.lordPlacedHouse}, inheritance matters will be: ${h8Profile.profile.afflictionScore >= 50 ? 'Smoothly transferred with legitimate familial consensus.' : 'Prone to contention or delayed paperwork requiring legal settlements.'}`,
          `Esoteric Inclination: You possess natural aptitude for penetrating hidden mysteries, research anomalies, astrology, and metaphysical truths. Solitude serves as your greatest intellectual laboratory.`,
        ],
        paragraphsHi: [
          `अष्टम भाव गुप्त धन, बीमा क्लेम, वसीयत, तथा अचानक मिलने वाले धन का घर है। अष्टमेश की स्थिति के अनुसार पैतृक दायभाग या विरासत: '${h8Profile.profile.afflictionScore >= 50 ? 'परिवार की आपसी सहमति से सुगमतापूर्वक प्राप्त होगी।' : 'विवाद, अदालती प्रक्रिया अथवा कागजी अड़चनों के कारण विलंब से प्राप्त होगी।'}'`,
          `गूढ़ विद्याओं में रुचि: जातक के भीतर रहस्यों को जानने, अनुसंधान करने, ज्योतिष, अध्यात्म व मनोविज्ञान की गूढ़ गहराइयों को समझने की स्वाभाविक प्रतिभा है। एकांत आपका सबसे बड़ा शिक्षक है।`,
        ],
        astrologicalCauseEn: `8th House dispositor synergy with 2nd (wealth) and 11th (gains) axes.`,
        astrologicalCauseHi: `शास्त्रीय कारण: अष्टम भाव का द्वितीय (धन) एवं एकादश (लाभ) भाव से समसप्तक व षडाष्टक संबंध।`,
      },
      ...epochSections,
    ],
  });

  // =========================================================================
  // CHAPTER 9: नवम भाव (भाग्य व धर्म भाव) — भाग्य, पिता, गुरु व आध्यात्मिक चिंतन
  // =========================================================================
  const h9Profile = computeHouseProfile(chart, 9);
  chapters.push({
    chapterNumber: 9,
    houseNumber: 9,
    id: 'chapter9_bhagya_past_life',
    titleEn: 'Chapter 9: Ninth House (Bhagya Bhava) — Fortune, Mentors & Spiritual Reflection',
    titleHi: 'अध्याय 9: नवम भाव (भाग्य व धर्म भाव) — भाग्य, पिता, गुरु एवं आध्यात्मिक चिंतन',
    subtitleEn: 'Dharma, mentors, pilgrimage, traditional karmic symbolism and spiritual reflection',
    subtitleHi: 'धर्म, पितृ पक्ष, गुरु सानिध्य, तीर्थ, पारंपरिक कर्म-प्रतीक और आध्यात्मिक आत्मचिंतन',
    icon: 'globe',
    summaryQuoteEn: 'Fortune is the harvest of righteous actions sown in forgotten seasons, ripening when the soul is ready to receive.',
    summaryQuoteHi: 'भाग्य पूर्व जन्मों में बोए गए धर्म-कर्म की वह फसल है जो पकने पर अनायास ही कृपा बनकर बरसती है।',
    bhavaProfile: h9Profile.profile,
    targetedRemedy: h9Profile.remedy,
    sections: [
      {
        titleEn: 'Fortune, Divine Grace & Father Lineage',
        titleHi: 'भाग्य का संबल, पिता का सुख व धर्म निष्ठा',
        leadEn: 'How cosmic serendipity manifests in your life and the karmic bond with the paternal lineage.',
        leadHi: 'प्रारब्ध का सहयोग, पिता के साथ संबंध, धार्मिक आचरण एवं तीर्थ यात्राओं का फल।',
        paragraphsEn: [
          `Ninth house is situated in ${h9Profile.profile.signNameEn}, ruled by ${h9Profile.profile.lordNameEn} (placed in House ${h9Profile.profile.lordPlacedHouse}, dignity: ${h9Profile.profile.lordDignity}). The Sun and Jupiter serve as primary significators of Dharma and paternal grace.`,
          `Father & Guidance: ${h9Profile.profile.afflictionScore >= 50 ? 'Strong moral guidance from father or righteous mentors, conferring elevated reputation and ancestral blessings.' : 'Ideological friction with father or early separation/responsibilities; fortune is self-built through rigorous adherence to ethical truth.'}`,
        ],
        paragraphsHi: [
          `नवम भाव '${h9Profile.profile.signNameHi}' राशि में है, जिसके स्वामी ग्रह '${h9Profile.profile.lordNameHi}' हैं (भाव ${h9Profile.profile.lordPlacedHouse} में ${h9Profile.profile.lordDignity})। सूर्य देव पिता के और देवगुरु बृहस्पति धर्म व गुरु कृपा के नैसर्गिक कारक हैं।`,
          `पितृ सुख व भाग्य: '${h9Profile.profile.afflictionScore >= 50 ? 'पिता अथवा गुरुजनों से उच्च नैतिक मार्गदर्शन प्राप्त होगा, जिससे समाज में प्रतिष्ठा और भाग्य का निरंतर सहयोग मिलेगा।' : 'पिता के साथ वैचारिक मतभेद अथवा प्रारंभिक जीवन में ही उत्तरदायित्वों का बोझ; भाग्य किसी के सहारे नहीं बल्कि आपके अपने पुरुषार्थ व धर्मनिष्ठा से चमकेगा।' }'`,
        ],
        astrologicalCauseEn: `9th Lord ${h9Profile.profile.lordNameEn} and Pitrukaraka Sun placement.`,
        astrologicalCauseHi: `शास्त्रीय कारण: नवमेश '${h9Profile.profile.lordNameHi}' तथा पितृ कारक सूर्य देव की स्थिति।`,
      },
      {
        titleEn: 'Spiritual Preceptors, Guru Kripa & Pilgrimages',
        titleHi: 'गुरु कृपा, दीक्षा, तीर्थाटन व दार्शनिक चेतना',
        leadEn: 'Attunement to sacred sanctuaries, authentic spiritual gurus, and higher philosophical wisdom.',
        leadHi: 'पावन तीर्थों की यात्रा, सद्गुरु का सानिध्य, वैदिक ग्रंथों का अध्ययन व उच्च दार्शनिक दृष्टिकोण।',
        paragraphsEn: [
          `The 9th house controls higher philosophical learning, pilgrimages, and spiritual initiation (Diksha). Visiting ancient hill shrines, sacred rivers, and honoring enlightened preceptors cleanses stubborn karmic blockages.`,
          `Cultivate an open yet discerning spiritual mind; steer clear of commercialized godmen and ground your spiritual practice in authentic classical texts.`,
        ],
        paragraphsHi: [
          `नवम भाव उच्च ज्ञान, तीर्थ यात्राओं और आध्यात्मिक दीक्षा का केंद्र है। पावन तीर्थों का भ्रमण, पवित्र नदियों में स्नान और सच्चे ज्ञानी संतों का सत्कार आपके जीवन के अनेक अवरोधों को स्वतः दूर कर देता है।`,
          `आडंबरपूर्ण गुरुओं व अंधविश्वासों से दूर रहें; शास्त्रीय ग्रंथों, गीता व उपनिषदों के अध्ययन से अपनी चेतना को समृद्ध बनाएं।`,
        ],
        astrologicalCauseEn: `Jupiter as Dharma Karaka and 9th house Ashtakavarga bindu tally (${h9Profile.profile.savBindus}).`,
        astrologicalCauseHi: `शास्त्रीय कारण: धर्म कारक गुरु तथा नवम भाव के सर्वाष्टकवर्ग बिंदु (${h9Profile.profile.savBindus})।`,
      },
      {
        titleEn: 'The 8 Classical Past-Life Identity Markers Across World Civilizations',
        titleHi: 'विश्व की प्राचीन सभ्यताओं में पूर्व जन्म (ग्रीक-रोमन, मिस्र, चीन, जापान, फारस, यूरोप, इंका व वैदिक भारत)',
        leadEn: 'Unveiling the exact global civilization, country, craft, and biographical coordinates of your prior incarnation.',
        leadHi: 'आपके पिछले जन्म की विश्व सभ्यता, देश-भूगोल, कर्म, सामाजिक प्रतिष्ठा और देहावसान का प्रामाणिक वृत्तांत।',
        paragraphsEn: [
          `1. Past-Life World Civilization & Country: ${pastReading?.civilizationEn || 'Classical Antiquity'} — ${pastReading?.birthPlaceOrCountryEn || 'Mediterranean Citadel or Sacred Center'}. Your soul's preceding embodiment was situated within a major historic world civilization endowed with rich architecture and cultural memory.`,
          `2. Historical Era & Geographical Setting: ${pastReading?.historicalEraEn || 'Classical Epoch'} amidst ${pastReading?.landscapeEn || 'coastal hills, stone citadels and river waterways'}.`,
          `3. Gender & Biological Vessel: ${pastReading?.genderHi || 'पुरुष (Male)'}. Derived from D60 Shashtiamsha Lagna deity (${pastReading?.shashtiamsaDeityEn || 'Deva'}) and Drekkana elemental polarity.`,
          `4. Yoni / Realm Form: ${pastReading?.lifeTypeHi || 'मानव योनि (Human Realm)'}. Endowed with upright moral discrimination, high culture, and philosophical intelligence.`,
          `5. Profession & Worldly Craft: ${pastReading?.professionHi || 'शास्त्रज्ञ, वैद्यकीय सेवा, अथवा धर्माधिकारी/व्यापारी'}. You wielded intellect, craft mastery, healing, or civic stewardship to maintain collective order.`,
          `6. Character & Moral Standing: ${pastReading?.characterHi || 'धर्मात्मा, सत्यनिष्ठ, किंतु समय पर कठोर नियमवादी'}. Deeply respected for integrity, though prone to unyielding perfectionism and strict rules.`,
          `7. Marital & Family Lineage: ${pastReading?.maritalStatusHi || 'विवाहित, भरा-पूरा कुटुंब'}. ${pastReading?.childrenHi || 'Blessed with dutiful progeny who carried forward family traditions'}.`,
          `8. Manner of Death & Transition: ${pastReading?.howDiedHi || 'वृद्धावस्था में शांतिपूर्ण देहावसान'}. A dignified natural passing in advanced age, settling worldly accounts in calm contemplation.`,
        ],
        paragraphsHi: [
          `1. पूर्व जन्म की विश्व सभ्यता एवं देश: ${pastReading?.civilizationHi || 'शास्त्रीय सभ्यता'} — ${pastReading?.birthPlaceOrCountryHi || 'ऐतिहासिक नगर अथवा पावन ज्ञान केंद्र'}। आत्मा की पूर्व यात्रा किसी एक संकीर्ण भूखंड तक सीमित नहीं थी; आपने विश्व की महान ऐतिहासिक सभ्यता में जन्म लेकर कर्म संचित किए थे।`,
          `2. ऐतिहासिक कालखंड एवं भौगोलिक परिवेश: ${pastReading?.historicalEraHi || 'शास्त्रीय स्वर्णिम युग'} — ${pastReading?.landscapeHi || 'पर्वतीय दुर्ग, जलमार्ग एवं समृद्ध नगर परिवेश'}।`,
          `3. पूर्व जन्म का लिंग: ${pastReading?.genderHi || 'पुरुष शरीर'}। षष्ट्यंश (D60) लग्न देवता (${pastReading?.shashtiamsaDeityHi || 'शुभ देव-भाग'}) एवं द्रेष्काण द्वारा प्रमाणित।`,
          `4. जीवन प्रकार (योनि): ${pastReading?.lifeTypeHi || 'सद्गुणी मानव योनि'}। पूर्व पुण्यों के कारण विवेकशील व सुसंस्कृत मानव शरीर प्राप्त हुआ था।`,
          `5. कर्म व आजीविका: ${pastReading?.professionHi || 'अध्यापन, वैद्यकीय सेवा, अथवा धर्माधिकारी/व्यापारी'}। समाज में ज्ञान, सेवा अथवा व्यापारिक व्यवस्था का कुशल संचालन किया।`,
          `6. चरित्र व सामाजिक प्रतिष्ठा: ${pastReading?.characterHi || 'अत्यंत सत्यनिष्ठ, परोपकारी, किंतु सिद्धांतों पर अडिग रहने वाले'}। समाज में आदरणीय स्थान था, यद्यपि आपकी कठोर अनुशासनप्रियता से कुछ लोग भयभीत भी रहते थे।`,
          `7. दांपत्य व संतान सुख: ${pastReading?.maritalStatusHi || 'सदाचारी गृहस्थ जीवन'}। ${pastReading?.childrenHi || 'योग्य संतान का सुख प्राप्त हुआ जिसने कुल की कीर्ति बढ़ाई'}।`,
          `8. मृत्यु की परिस्थिति व अंतिम क्षण: ${pastReading?.howDiedHi || 'वृद्धावस्था में शांत व स्वाभाविक देहावसान'}। किसी हिंसक दुर्घटना या अकाल मृत्यु के बिना शांत मन से देह का त्याग किया।`,
        ],
        astrologicalCauseEn: `Derived strictly from D60 Shashtiamsha Lagna deity (${pastReading?.shashtiamsaDeityEn || 'Kinnara'}), 9th house of past merit, and 12th house of dissolution.`,
        astrologicalCauseHi: `शास्त्रीय कारण: षष्ट्यंश चक्र (D60) के लग्न देवता '${pastReading?.shashtiamsaDeityHi || 'किन्नर'}', पूर्व पुण्य भाव (पंचम व नवम), तथा द्वादश भाव के सूक्ष्म अंशों द्वारा प्रमाणित।`,
      },
      {
        titleEn: 'The Unfinished Karmic Vow & Future Incarnation Becoming Across the Globe',
        titleHi: 'अधूरा पूर्व जन्म संकल्प, भावी पुनर्जन्म का महाद्वीप-देश, भावी योनि एवं मोक्ष संभावना',
        leadEn: 'The core soul lesson you came to resolve and the trajectory of your next incarnation.',
        leadHi: 'वह अधूरा संकल्प जिसे पूरा करने यह जन्म हुआ है, और मृत्यु के उपरांत आत्मा का अगला पड़ाव।',
        paragraphsEn: [
          `The Unfinished Karmic Vow (Prarabdha Rin): ${pastReading?.unfinishedKarmaAndDebtsEn || 'In your previous incarnation, a crucial vow or duty toward family remained incomplete due to an unexpected attachment. You took this birth to master detachment while fulfilling duties.'}`,
          `Future Incarnation Global Continent & Realm: Projected toward ${futureReading?.futureContinentEn || 'Northern Europe / Scandinavia'} (${futureReading?.futureCountryEn || 'Switzerland/Sweden'}). In this future earthly or subtle realm, the soul will not struggle with raw survival; instead, it will be born into a peaceful, highly intellectual, and nature-harmonious environment.`,
          `Future Yoni & Life Form: ${futureReading?.futureYoniEn || 'Higher Human Intellectual & Spiritual Mentor'}. Endowed with advanced intuitive faculties, ethical authority, and clarity of consciousness.`,
          `Soul's Evolutionary Mission in Next Birth: ${futureReading?.futureMissionEn || 'Advancing human welfare, ecological harmony and spiritual wisdom.'}`,
          `Spiritual Evolution Index & Moksha Pathway: Your chart registers a Spiritual Evolution Index of ${futureReading?.spiritualEvolutionIndex || 84}% and a Moksha Likelihood Index of: ${futureReading?.mokshaLikelihoodEn || 'Moderate'}. Projected Next Loka: ${futureReading?.nextBirthLokaEn || 'Higher Celestial Subtle Realm'}.`,
        ],
        paragraphsHi: [
          `अधूरा पूर्व जन्म संकल्प एवं प्रारब्ध ऋण: ${pastReading?.unfinishedKarmaAndDebtsHi || 'पारिवारिक दायित्वों को पूरा करते हुए सांसारिक मोह से अनासक्त रहने का संकल्प।'}`,
          `भावी पुनर्जन्म का महाद्वीप एवं देश: आत्मा की भावी गति '${futureReading?.futureContinentHi || 'उत्तरी यूरोप / सुसंस्कृत परिवेश'}' (${futureReading?.futureCountryHi || 'स्कैंडिनेविया / स्विट्जरलैंड'}) की ओर इंगित होती है। इस भावी जन्म में आत्मा को रोटी-कपड़े के संघर्ष में नहीं उलझना पड़ेगा; बल्कि एक शांत, प्रबुद्ध, नैतिक और प्रकृति-सम्मत परिवेश प्राप्त होगा।`,
          `भावी जन्म की योनि एवं स्वरूप: ${futureReading?.futureYoniHi || 'उच्च कुलीन विद्वान, दार्शनिक अथवा आध्यात्मिक मार्गदर्शक मानव योनि'}। असाधारण अंतःप्रेरणा और आध्यात्मिक चेतना से संपन्न जन्म।`,
          `आगामी जीवन का मुख्य ध्येय (Soul Mission): ${futureReading?.futureMissionHi || 'मानव कल्याण, वैज्ञानिक दर्शन, पर्यावरण संरक्षण व ज्ञान का विस्तार।' }`,
          `आध्यात्मिक चेतना सूचकांक एवं मोक्ष संभावना: आपकी कुंडली में आत्मिक विकास सूचकांक ${futureReading?.spiritualEvolutionIndex || 84}% तथा मोक्ष संभावना श्रेणी '${futureReading?.mokshaLikelihoodHi || 'मध्यम (उच्च कुलीन धार्मिक जन्म)'}' है। आगामी भावी लोक: '${futureReading?.nextBirthLokaHi || 'शुभ पुण्य लोक / उच्च देवलोक'}'।`,
        ],
        astrologicalCauseEn: `12th house Ketu / Jupiter disposition and Purushartha balance across Dharma (1-5-9) and Moksha (4-8-12) houses.`,
        astrologicalCauseHi: `शास्त्रीय कारण: 12वें भाव में केतु/गुरु का शुभ प्रभाव तथा धर्म त्रिकोण (1, 5, 9) व मोक्ष त्रिकोण (4, 8, 12) के ग्रह बलों का सम्यक संतुलन।`,
      },
    ],
    specialData: {
      pastLife: pastReading,
      futureBecoming: futureReading,
    },
  });

  // =========================================================================
  // CHAPTER 10: दशम भाव (कर्म व राज्य भाव) — आजीविका, पद-प्रतिष्ठा, सत्ता व राजयोग
  // =========================================================================
  const h10Profile = computeHouseProfile(chart, 10);
  chapters.push({
    chapterNumber: 10,
    houseNumber: 10,
    id: 'chapter10_karma_career',
    titleEn: 'Chapter 10: Tenth House (Karma Bhava) — Career Zenith, Governance & Professional Truth',
    titleHi: 'अध्याय 10: दशम भाव (कर्म व राज्य भाव) — आजीविका, पद-प्रतिष्ठा, सत्ता, सरकारी नौकरी व उत्कर्ष',
    subtitleEn: 'Govt Job Meter, Job vs. Business Ratio, Suitable Vocations, Workplace Hazards & Peak Zenith Age',
    subtitleHi: 'सरकारी नौकरी संभावना, नौकरी बनाम व्यापार अनुपात, 5 अनुकूलतम क्षेत्र, कार्यक्षेत्र के संकट व करियर उत्कर्ष पड़ाव',
    icon: 'briefcase',
    summaryQuoteEn: 'Career is not merely a means of earning bread; it is the battlefield where your soul works out its karmic obligations through daily labor.',
    summaryQuoteHi: 'आजीविका केवल रोटी कमाने का साधन नहीं है; यह वह कर्म-क्षेत्र है जहां जीवात्मा अपने संचित प्रारब्ध को नित्य कर्म द्वारा चुकाती है।',
    bhavaProfile: h10Profile.profile,
    targetedRemedy: h10Profile.remedy,
    sections: [
      careerVerdictSec,
      careerVerdictsResult.govtJobSection,
      {
        titleEn: 'Job vs. Independent Business Ratio & Exam Crack Window',
        titleHi: 'नौकरी बनाम स्वतंत्र व्यवसाय अनुपात एवं परीक्षा स्वर्णिम काल',
        leadEn: 'Comparative assessment of corporate employment vs. entrepreneurial autonomy.',
        leadHi: 'नौकरी की अनुकूलता बनाम स्वतंत्र व्यवसाय की संभावना तथा प्रतियोगी परीक्षा का स्वर्णिम समय।',
        paragraphsEn: [
          `Job vs. business: the chart offers qualitative comparative indicators only; no real-world probability or fixed percentage is inferred.`,
          `Verdict: ${careerVerdictsResult.data.jobVsBusinessRatio.verdictEn}`,
          `Timing limitation: ${careerVerdictsResult.data.examCrackingAgeWindowEn}`,
        ],
        paragraphsHi: [
          `नौकरी बनाम व्यापार: कुंडली से केवल गुणात्मक तुलनात्मक संकेत पढ़े जा रहे हैं; वास्तविक प्रतिशत संभावना निर्धारित नहीं की जा रही है।`,
          `शास्त्रीय निर्णय: ${careerVerdictsResult.data.jobVsBusinessRatio.verdictHi}`,
          `समय संबंधी सीमा: ${careerVerdictsResult.data.examCrackingAgeWindowHi}`,
        ],
        astrologicalCauseEn: `10th Lord ${h10Profile.profile.lordNameEn} dignity, 6th house (service) vs 7th house (trade) strength.`,
        astrologicalCauseHi: `शास्त्रीय कारण: दशमेश '${h10Profile.profile.lordNameHi}', षष्ठ भाव (नौकरी) एवं सप्तम भाव (व्यापार) का पारस्परिक बलाबल।`,
      },
      careerVerdictsResult.vocationsSection,
      careerVerdictsResult.hazardsSection,
      careerEpochsSec,
    ],
    specialData: {
      careerVerdicts: careerVerdictsResult.data,
    },
  });

  // =========================================================================
  // CHAPTER 11: एकादश भाव (लाभ भाव) — नियमित आय के स्रोत, बड़े भाई-बहन व लाभ
  // =========================================================================
  const h11Profile = computeHouseProfile(chart, 11);
  chapters.push({
    chapterNumber: 11,
    houseNumber: 11,
    id: 'chapter11_labha_gains',
    titleEn: 'Chapter 11: Eleventh House (Labha Bhava) — Inflow Channels, Elder Siblings & Aspirations',
    titleHi: 'अध्याय 11: एकादश भाव (लाभ भाव) — नियमित आय के स्रोत, बड़े भाई-बहन, महत्वाकांक्षाएं व मित्र मंडली',
    subtitleEn: 'Recurring Gains, High Profit Margins, Elder Siblings, Extended Network & Ambition Fulfillment',
    subtitleHi: 'नियमित धन लाभ, लाभ मार्जिन, बड़े भाई-बहनों से सहयोग, मित्र मंडली व जीवन की बड़ी आकांक्षाओं की सिद्धि',
    icon: 'layers',
    summaryQuoteEn: 'Gains are the fruits of persistent labor; when aligned with dharmic purpose, they enrich both the individual and community.',
    summaryQuoteHi: 'लाभ निरंतर पुरुषार्थ का फल है; जब यह धर्म से जुड़ता है तो केवल व्यक्ति को ही नहीं, पूरे समाज को समृद्ध करता है।',
    bhavaProfile: h11Profile.profile,
    targetedRemedy: h11Profile.remedy,
    sections: [
      {
        titleEn: 'Recurring Inflow Streams & Profit Margins',
        titleHi: 'नियमित आय के स्रोत, लाभ मार्जिन व धन प्रवाह',
        leadEn: 'How regular income flows into your life and the consistency of financial returns.',
        leadHi: 'नियमित आमदनी के साधन, व्यापार अथवा नौकरी में मिलने वाला मुनाफा व आर्थिक आवक।',
        paragraphsEn: [
          `Eleventh house falls in ${h11Profile.profile.signNameEn}, ruled by ${h11Profile.profile.lordNameEn} (placed in House ${h11Profile.profile.lordPlacedHouse}, dignity: ${h11Profile.profile.lordDignity}). As the premier Upachaya house of material gains, any planet placed here contributes positively to revenue.`,
          `Income Potential: ${h11Profile.profile.afflictionScore >= 50 ? 'Consistent, multi-source income streams with expanding commercial margins over time.' : 'Income may encounter seasonal stalls or delayed receivables; requires multiple independent revenue channels.'} SAV bindus in 11th (${h11Profile.profile.savBindus}) exceed 12th house bindus, ensuring that lifetime income outpaces lifetime expenditure.`,
        ],
        paragraphsHi: [
          `एकादश भाव '${h11Profile.profile.signNameHi}' राशि में है, जिसके स्वामी ग्रह '${h11Profile.profile.lordNameHi}' हैं (भाव ${h11Profile.profile.lordPlacedHouse} में ${h11Profile.profile.lordDignity})। यह सर्वाधिक शक्तिशाली उपचय भाव है, जहां स्थित ग्रह निरंतर धन लाभ में वृद्धि करते हैं।`,
          `आमदनी की स्थिति: '${h11Profile.profile.afflictionScore >= 50 ? 'एक से अधिक स्रोतों से नियमित आय तथा समय के साथ निरंतर बढ़ता हुआ लाभ मार्जिन।' : 'आय में कभी-कभी अनपेक्षित रुकावट अथवा भुगतानों में विलंब; अतः आय के केवल एक साधन पर निर्भर न रहें।'}' एकादश भाव के अष्टकवर्ग बिंदु (${h11Profile.profile.savBindus}) द्वादश भाव से अधिक होने के कारण जीवनभर आपकी आय व्यय से अधिक बनी रहेगी।`,
        ],
        astrologicalCauseEn: `11th Lord ${h11Profile.profile.lordNameEn} and 11th House SAV (${h11Profile.profile.savBindus} bindus).`,
        astrologicalCauseHi: `शास्त्रीय कारण: एकादशेश '${h11Profile.profile.lordNameHi}' तथा एकादश भाव के सर्वाष्टकवर्ग बिंदु (${h11Profile.profile.savBindus})।`,
      },
      {
        titleEn: 'Elder Siblings & Extended Social Network',
        titleHi: 'बड़े भाई-बहन, प्रभावशाली मित्र व सामाजिक संबंध',
        leadEn: 'Support from senior mentors, high-society alliances, and fraternal harmony.',
        leadHi: 'बड़े भाई-बहनों से मिलने वाला सहयोग, समाज के प्रतिष्ठित लोगों से संपर्क व मित्र मंडली।',
        paragraphsEn: [
          `The 11th house signifies elder brothers, sisters, and high-network allies who open doors of opportunity.`,
          `${h11Profile.profile.afflictionScore >= 50 ? 'Elder siblings and loyal friends will stand by you during major financial expansions.' : 'Frictions or jealousy may surface among peer groups; maintain healthy boundaries and avoid lending money to casual acquaintances.'}`,
        ],
        paragraphsHi: [
          `एकादश भाव बड़े भाई-बहनों, उच्च पदस्थ मित्रों और समाज के प्रभावशाली व्यक्तियों से संबंधों का दर्पण है।`,
          `${h11Profile.profile.afflictionScore >= 50 ? 'बड़े भाई-बहनों तथा विश्वस्त मित्रों का पूर्ण सहयोग मिलेगा जो आपके करियर में नए द्वार खोलेंगे।' : 'मित्र मंडली में कुछ लोग आपकी उन्नति से ईर्ष्या रख सकते हैं; अतः अपनी गोपनीय योजनाएं हर किसी से साझा न करें।' }`,
        ],
        astrologicalCauseEn: `Evaluated via 11th lord ${h11Profile.profile.lordNameEn} and Jupiter (Karaka of expansion).`,
        astrologicalCauseHi: `शास्त्रीय कारण: एकादशेश '${h11Profile.profile.lordNameHi}' तथा विस्तार कारक गुरु का प्रभाव।`,
      },
      {
        titleEn: 'Fulfillment of Aspirations & Long-Term Dreams',
        titleHi: 'महत्वाकांक्षाओं की पूर्ति, संकल्प सिद्धि व लोक ख्याति',
        leadEn: 'The ultimate realization of cherished ambitions and worldly desires.',
        leadHi: 'जीवन के बड़े लक्ष्यों की प्राप्ति, मन की इच्छाओं की पूर्ति व समाज में पहचान।',
        paragraphsEn: [
          `Known classically as the Sarva-Labha Bhava (house of all gains), it determines whether your long-term dreams crystallize into reality.`,
          `Persistent discipline combined with strategic networking will see your primary life goals materialize, particularly in the major dashas of 11th lord or planets placed in this sign.`,
        ],
        paragraphsHi: [
          `शास्त्रों में इसे सर्व-लाभ भाव कहा गया है। यह भाव इस बात की गारंटी देता है कि जीवन में आपके द्वारा देखे गए बड़े स्वप्न कब और कैसे साकार होंगे।`,
          `निरंतर परिश्रम और सही समय पर लिए गए निर्णयों से आपकी प्रमुख महत्वाकांक्षाएं अवश्य फलीभूत होंगी, विशेषकर एकादशेश अथवा इस भाव में स्थित ग्रहों की महादशा-अंतर्दशा में।`,
        ],
        astrologicalCauseEn: `Upachaya growth dynamics in the 11th house.`,
        astrologicalCauseHi: `शास्त्रीय कारण: एकादश उपचय भाव का वृद्धि-कारक सिद्धांत।`,
      },
    ],
  });

  // =========================================================================
  // CHAPTER 12: द्वादश भाव (व्यय व मोक्ष भाव) — वित्तीय रिसाव, विदेश वास, बंधन योग व मोक्ष
  // =========================================================================
  const h12Profile = computeHouseProfile(chart, 12);
  chapters.push({
    chapterNumber: 12,
    houseNumber: 12,
    id: 'chapter12_vyaya_moksha',
    titleEn: 'Chapter 12: Twelfth House (Vyaya Bhava) — Financial Leakage, Foreign Lands, Solitude & Moksha',
    titleHi: 'अध्याय 12: द्वादश भाव (व्यय व मोक्ष भाव) — वित्तीय रिसाव, विदेश वास, बंधन योग व आध्यात्मिक मुक्ति',
    subtitleEn: 'Secret Drains, Foreign Settlement, Solitude/Hospitalization Risk, Bed Pleasures & Comprehensive Vedic Remedial Protocol',
    subtitleHi: 'गुप्त रिसाव (पैसा कहाँ जाता है?), विदेश वास, एकांत/अस्पताल जोखिम, शय्या सुख व 6-स्तरीय वैदिक महा-उपाय',
    icon: 'book-open',
    summaryQuoteEn: 'True liberation begins when one understands that all worldly gains must eventually be surrendered to the infinite.',
    summaryQuoteHi: 'सच्चा मोक्ष तब प्रारंभ होता है जब मनुष्य यह समझ लेता है कि संसार की हर वस्तु अंततः अनंत को ही समर्पित होनी है।',
    bhavaProfile: h12Profile.profile,
    targetedRemedy: h12Profile.remedy,
    sections: [
      wealthSections[1],
      {
        titleEn: 'Foreign Settlement, Overseas Residences & Distant Lands',
        titleHi: 'विदेश वास, सुदूर यात्राएं, विदेशी व्यापार व जन्मस्थान से दूरी',
        leadEn: 'Prospects of living, working, or migrating across international borders.',
        leadHi: 'जन्मभूमि से दूर निवास, विदेश यात्रा के योग, बहुराष्ट्रीय कंपनियों में कार्य व विदेशी आय।',
        paragraphsEn: [
          `Twelfth house rules foreign lands (Videsha Vasa) and separation from the ancestral homeland. With 12th house in ${h12Profile.profile.signNameEn} (ruled by ${h12Profile.profile.lordNameEn}):`,
          `Foreign Prospects: ${[1, 9, 10, 12].includes(h12Profile.profile.lordPlacedHouse) || [rahu.rasiHouseNumber, ketu.rasiHouseNumber].includes(12) ? 'Strong indications of foreign travel, overseas employment, or commercial collaboration with international clients.' : 'Foreign travels will be short-term for leisure or business pilgrimages rather than permanent relocation.'}`,
        ],
        paragraphsHi: [
          `द्वादश भाव विदेश वास, जन्मभूमि से विस्थापन और सुदूर यात्राओं का मुख्य स्थान है। द्वादश भाव '${h12Profile.profile.signNameHi}' राशि में है, जिसके स्वामी '${h12Profile.profile.lordNameHi}' हैं:`,
          `विदेश योग का यथार्थ: ${[1, 9, 10, 12].includes(h12Profile.profile.lordPlacedHouse) || [rahu.rasiHouseNumber, ketu.rasiHouseNumber].includes(12) ? 'विदेश यात्रा, बहुराष्ट्रीय कंपनियों में सेवा अथवा विदेशी ग्राहकों के साथ व्यापार के अत्यंत प्रबल योग हैं। जन्मस्थान से दूर रहने पर अधिक प्रगति होती है।' : 'विदेश यात्राएं मुख्य रूप से अल्पकालिक व्यावसायिक बैठकों, पर्यटन अथवा तीर्थाटन के रूप में घटित होंगी।' }`,
        ],
        astrologicalCauseEn: `12th Lord ${h12Profile.profile.lordNameEn} interaction with movable/watery signs and Rahu placement.`,
        astrologicalCauseHi: `शास्त्रीय कारण: द्वादशेश '${h12Profile.profile.lordNameHi}' का चर/जल राशियों व राहु से संबंध।`,
      },
      {
        titleEn: 'Solitude, Confinement, Sleep Sanctuary & Bed Pleasures',
        titleHi: 'एकांत, अनिद्रा, शय्या सुख व अस्पताल/बंधन योग जांच',
        leadEn: 'Quality of nocturnal rest, inner psychological detachment, and hospital vulnerability.',
        leadHi: 'रात्रि में शय्या सुख, नींद की गुणवत्ता, अस्पताल में भर्ती होने की संभावना व मानसिक एकांत।',
        paragraphsEn: [
          `The 12th house governs Sayana Sukha (bed pleasures and sleep quality) and institutional confinement (Bandhana/hospitalization).`,
          `${h12Profile.profile.afflictionScore < 48 ? 'Warning: Afflicted 12th house triggers restless sleep, nocturnal anxiety, or unplanned medical hospitalization expenses. Avoid late-night screen exposure and practice grounding meditation before sleep.' : 'Sound sleep and comfortable domestic solitude. The native enjoys peaceful rest and detachment from worldly stress.'}`,
        ],
        paragraphsHi: [
          `द्वादश भाव शय्या सुख, निद्रा की गहराई तथा अस्पताल/कारावास (बंधन योग) का प्रतिनिधित्व करता है।`,
          `${h12Profile.profile.afflictionScore < 48 ? 'चेतावनी: द्वादश भाव पर क्रूर प्रभाव होने से अनिद्रा, रात्रि में बेचैनी, अथवा अचानक अस्पताल में भर्ती होने के खर्चे बढ़ सकते हैं। सोने से पूर्व मोबाइल स्क्रीन से दूर रहें और ध्यान का अभ्यास करें।' : 'उत्तम शय्या सुख और गहरी शांतिपूर्ण नींद। जातक संसार की भागदौड़ से अलग होकर एकांत में मानसिक शांति प्राप्त करता है।' }`,
        ],
        astrologicalCauseEn: `12th house Venus and Moon disposition governing sleep hormones.`,
        astrologicalCauseHi: `शास्त्रीय कारण: द्वादश भाव, शुक्र व चंद्रमा की स्थिति द्वारा शय्या सुख का नियमन।`,
      },
      {
        titleEn: 'Spiritual Emancipation, Renunciation & Moksha Pathway',
        titleHi: 'आध्यात्मिक संन्यास, मोक्ष मार्ग व परम शांति',
        leadEn: 'The final destination of the soul and liberation from the cycle of rebirth.',
        leadHi: 'जन्म-मरण के बंधन से मुक्ति, मोक्ष की संभावना, अंतःकरण की शुद्धि व परम पद।',
        paragraphsEn: [
          `As the terminal house of the zodiac, the 12th signifies surrender of the ego and union with the infinite (Moksha). Ketu or Jupiter associated with this house signifies elevated spiritual consciousness and liberation.`,
          `True renunciation does not require fleeing to mountain caves; fulfilling your worldly duties without attachment is your genuine path to spiritual liberation.`,
        ],
        paragraphsHi: [
          `कालपुरुष चक्र का अंतिम भाव होने के कारण द्वादश भाव आत्मा के मोक्ष और अहंकार के विसर्जन का पावन द्वार है। इस भाव पर केतु अथवा बृहस्पति का शुभ प्रभाव उच्च आध्यात्मिक चेतना और मोक्ष का मार्ग प्रशस्त करता है।`,
          `सच्चा वैराग्य संसार को छोड़कर भागना नहीं, बल्कि अपने सभी सांसारिक दायित्वों को निष्काम भाव से निभाते हुए ईश्वर में चित्त लगाना ही आपके मोक्ष का सहज मार्ग है।`,
        ],
        astrologicalCauseEn: `12th House as Moksha Trikona culmination (Houses 4, 8, 12).`,
        astrologicalCauseHi: `शास्त्रीय कारण: मोक्ष त्रिकोण (4, 8, 12) के पूर्ण समापन का आध्यात्मिक सिद्धांत।`,
      },
      vedicRemedies.planetaryRemediesSection,
      vedicRemedies.houseCleansingSection,
      vedicRemedies.nakshatraSnanaSection,
      vedicRemedies.gocharSadeSatiSection,
      vedicRemedies.activeDashaSection,
      vedicRemedies.lalKitabConductSection,
    ],
    specialData: {
      vedicRemediesSummary: vedicRemedies.summaryHighlights,
      sleepingHouses,
      activeDebts,
    },
  });

  const chapterEvidenceMap: Partial<Record<number, PredictionDomainId[]>> = {
    2: ['wealth'],
    4: ['property'],
    5: ['education', 'children'],
    6: ['litigation'],
    7: ['marriage'],
    9: ['foreign'],
    10: ['career'],
    11: ['wealth'],
    12: ['foreign'],
  };
  for (const chapter of chapters) {
    const relevantIds = chapterEvidenceMap[chapter.chapterNumber] ?? [];
    chapter.predictionEvidence = centralPredictionEvidence.filter((item) => relevantIds.includes(item.id));
  }

  // The 21 selected life predictions are part of the 12-house dossier, not a
  // second report or navigation destination. Preserve each original prediction
  // and place it under the chapter matching its source bhava.
  const embeddedPredictionIds = new Set<number>();
  for (const dimension of selectedLifePredictions) {
    const targetHouse = Number.isInteger(dimension.houseNumber)
      && (dimension.houseNumber ?? 0) >= 1
      && (dimension.houseNumber ?? 0) <= 12
      ? dimension.houseNumber as number
      : 1;
    const chapter = chapters.find((item) => item.chapterNumber === targetHouse);
    if (!chapter || embeddedPredictionIds.has(dimension.id)) continue;
    embeddedPredictionIds.add(dimension.id);
    chapter.sections.push({
      lifeDimensionId: dimension.id,
      lifeDimensionHouse: targetHouse,
      titleEn: `Life prediction ${dimension.id}: ${dimension.titleEn}`,
      titleHi: `जीवन फलादेश ${dimension.id}: ${dimension.titleHi}`,
      leadEn: dimension.categoryTitleEn,
      leadHi: dimension.categoryTitleHi,
      paragraphsEn: [
        dimension.verdictEn,
        dimension.detailedAnalysisEn,
        dimension.timingEn ?? 'No reliable timing window is available from the current chart data.',
        dimension.remedyEn,
      ],
      paragraphsHi: [
        dimension.verdictHi,
        dimension.detailedAnalysisHi,
        dimension.timingHi ?? 'उपलब्ध कुंडली डेटा से विश्वसनीय समय-सीमा निर्धारित नहीं है।',
        dimension.remedyHi,
      ],
      astrologicalCauseEn: [
        dimension.astroBasisEn,
        dimension.classicalRef ? `Classical reference: ${dimension.classicalRef}` : '',
        dimension.divisionalRef ? `Divisional reference: ${dimension.divisionalRef}` : '',
      ].filter(Boolean).join(' | '),
      astrologicalCauseHi: [
        dimension.astroBasisHi,
        dimension.classicalRef ? `शास्त्रीय संदर्भ: ${dimension.classicalRef}` : '',
        dimension.divisionalRef ? `वर्ग-कुंडली संदर्भ: ${dimension.divisionalRef}` : '',
      ].filter(Boolean).join(' | '),
    });
  }

  return {
    generatedAt: new Date().toISOString(),
    nativeName,
    birthDateFormatted,
    birthTimeFormatted,
    birthCity,
    ascendantSignEn: ascSignEn,
    ascendantSignHi: ascSignHi,
    moonSignEn,
    moonSignHi,
    sunSignEn,
    sunSignHi,
    chapters,
    topIdentity,
  };
}
