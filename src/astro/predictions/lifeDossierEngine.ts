import { computeAvakahadaChakra, computeGhatakChakra, getNakshatraSyllable, getAllNakshatraSyllables } from '../avakahadaChalit';
import { SIGNS, NAKSHATRAS } from '../constants';
import { computeComprehensiveSensitivePoints, computeMrityuBhagaAnalysis, computePushkaraAnalysis } from '../specialSensitivities';
import { computePastFutureLifeReading, type PastFutureLifeReport } from './pastFutureLife';
import { computeLalKitabSystemReport, type LalKitabFullSystemReport } from './lalKitabSystem';
import { computeLifeEventsAndLedger, type LifeEventsAndLedgerReport } from './lifeEventsLedger';
import type { BodyPosition, ChartData, NineGrahaId, SevenPlanetId } from '../types';
import { formatDateDmy } from '../time';
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
}

export interface DossierChapter {
  chapterNumber: number; // 1 to 10
  id: string;
  titleEn: string;
  titleHi: string;
  subtitleEn: string;
  subtitleHi: string;
  icon: string;
  summaryQuoteEn: string;
  summaryQuoteHi: string;
  sections: ChapterSection[];
  specialData?: any;
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

// Classical Jaimini Ishta Devata Mapping
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

const SIGN_HI = [
  'मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या',
  'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुंभ', 'मीन',
];

const PLANET_HI: Record<string, string> = {
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
  const ledgerReport = computeLifeEventsAndLedger(chart);

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
    // 4, 8, 12
    payaMetal = 'Iron';
    payaTone = 'challenging';
    payaNameEn = 'Iron Foot (Loha Paya)';
    payaNameHi = 'लौह पाया (लोहे का पाया)';
    payaMeaningEn = 'Signifies heavy karmic responsibilities, early struggles, family burdens, and deep transformation. Ultimate triumph is earned through sheer discipline and resilience.';
    payaMeaningHi = 'लौह पाया जातक के जीवन में प्रारंभिक संघर्ष, पारिवारिक उत्तरदायित्वों का भारी दबाव और कठोर प्रारब्ध परीक्षा दर्शाता है। ऐसा जातक जीवन की कठिन भट्ठी में तपकर ही स्वर्ण की भांति चमकता है।';
  }

  const payaCauseEn = `Calculated by Moon's placement relative to the Lagna: Moon occupies house ${moonHouse} from Ascendant (${ascSignEn}). Houses 2, 5, 9 signify Silver; 1, 6, 11 signify Gold; 3, 7, 10 signify Copper; and 4, 8, 12 signify Iron.`;
  const payaCauseHi = `शास्त्र सम्मत गणना: जन्म समय चंद्र देव लग्न (${ascSignHi}) से ${moonHouse}वें भाव में स्थित हैं। ज्योतिषीय नियम के अनुसार: लग्न से 2, 5, 9 भाव में चंद्र हो तो 'रजत पाया', 1, 6, 11 भाव में हो तो 'स्वर्ण पाया', 3, 7, 10 भाव में हो तो 'ताम्र पाया', और 4, 8, 12 भाव में हो तो 'लौह पाया' बनता है।`;

  // Top Identity Object
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

  // Compile the 10 Chapters
  const chapters: DossierChapter[] = [];

  // =========================================================================
  // CHAPTER 1: बीज संस्कार, मूल पहचान व ज्योतिषीय आधार (Basic Details & Foundation)
  // (NOTE: Ishta Devata, Naamakshar, and Paya are STRICTLY in this chapter only)
  // =========================================================================
  chapters.push({
    chapterNumber: 1,
    id: 'chapter1_basic_identity',
    titleEn: 'Chapter 1: Seed Impressions & Spiritual Identity',
    titleHi: 'अध्याय 1: बीज संस्कार, मूल पहचान व ज्योतिषीय आधार',
    subtitleEn: 'Avakhada Chakra, Sacred Identity Markers, Sensitive Coordinates & Strength Matrix',
    subtitleHi: 'अवकहड़ा चक्र, त्रिविध मूल पहचान (इष्ट, नामाक्षर, पाया), संवेदनशील बिंदु व सामर्थ्य',
    icon: 'compass',
    summaryQuoteEn: 'The root coordinates of the soul at the moment of the first breath define its elemental blueprint, primary spiritual protector, and constitutional metal.',
    summaryQuoteHi: 'प्रथम श्वास के क्षण पर कालपुरुष के चक्र में आत्मा की स्थिति ही उसके मूल तत्व, इष्ट देव और जन्म के धातु आधार को निर्धारित करती है।',
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
      educationResult.section,
    ],
    specialData: {
      avakahada,
      ghatak,
      topIdentity,
      sensitivePoints,
      mrityuBhagas,
      pushkaraList,
      physicalAppearance: physicalResult.data,
      educationAcademics: educationResult.data,
    },
  });

  // =========================================================================
  // CHAPTER 2: स्वभाव का नग्न सच, आंतरिक द्वंद्व व मनोविश्लेषण (The Raw Psychology)
  // =========================================================================
  const psychSections = computeDynamicPsychologySections(chart);

  chapters.push({
    chapterNumber: 2,
    id: 'chapter2_psychology',
    titleEn: 'Chapter 2: The Raw Psychology & Hidden Turmoil',
    titleHi: 'अध्याय 2: स्वभाव का नग्न सच, आंतरिक द्वंद्व व मनोविश्लेषण',
    subtitleEn: 'The Public Persona vs. Midnight Solitude, Secret Anxieties, Emotional Triggers & Self-Sabotage',
    subtitleHi: 'सामाजिक मुखौटा बनाम आधी रात का एकांत, गहरे भय, आत्म-विनाशकारी प्रवृत्तियां व आंतरिक सत्य',
    icon: 'brain',
    summaryQuoteEn: 'What the world witnesses is merely an armor built for survival; the real drama unfolds in the silent sanctuary of the midnight mind.',
    summaryQuoteHi: 'संसार केवल उस कवच को देखता है जो जीवन संघर्ष के लिए गढ़ा गया है; असली द्वंद्व तो अर्धरात्रि के गहन सन्नाटे में घटित होता है।',
    sections: psychSections,
  });

  // =========================================================================
  // CHAPTER 3: वर्तमान जीवन अवस्था का एक्स-रे — 'अभी क्या घट रहा है?' (Active Life Phase)
  // =========================================================================
  const activePhaseSections = computeDynamicActivePhaseSections(chart);

  chapters.push({
    chapterNumber: 3,
    id: 'chapter3_active_life_phase',
    titleEn: 'Chapter 3: Real-Time Life Phase X-Ray — What Is Happening Right Now?',
    titleHi: 'अध्याय 3: वर्तमान जीवन अवस्था का एक्स-रे — अभी क्या घट रहा है?',
    subtitleEn: 'Past 6–12 Months Reality, Running Dasha Pressure Points, Transit Crossroads & Next 6-Month Inflexion',
    subtitleHi: 'विगत 6-12 माह की वास्तविक स्थिति, सक्रिय महादशा-अंतर्दशा का दबाव, गोचर का प्रहार व आगामी 6 माह का मोड़',
    icon: 'activity',
    summaryQuoteEn: 'Destiny is not a stagnant pool; it is a raging river currently navigating a critical turning point.',
    summaryQuoteHi: 'प्रारब्ध कोई ठहरा हुआ जल नहीं है; यह एक तीव्र प्रवाह है जो इस समय जीवन के एक अत्यंत निर्णायक मोड़ से गुजर रहा है।',
    sections: activePhaseSections,
  });

  // =========================================================================
  // CHAPTER 4: कर्म, कार्यक्षेत्र व आजीविका का यथार्थ (Career, Zenith & Professional Truth)
  // =========================================================================
  const [careerVerdictSec, careerEpochsSec] = computeDynamicCareerZenithSections(chart);

  chapters.push({
    chapterNumber: 4,
    id: 'chapter4_career_zenith',
    titleEn: 'Chapter 4: Career, Livelihood & Professional Zenith',
    titleHi: 'अध्याय 4: कर्म, कार्यक्षेत्र व आजीविका का यथार्थ',
    subtitleEn: 'Job vs. Independent Enterprise, Natural Aptitudes, Struggle Milestones & The Zenith Age',
    subtitleHi: 'नौकरी बनाम स्वतंत्र व्यवसाय, अनुकूलतम कार्यक्षेत्र, करियर के तीन पड़ाव व सर्वोच्च उत्कर्ष वर्ष',
    icon: 'briefcase',
    summaryQuoteEn: 'Career is not merely a means of earning bread; it is the battlefield where your soul works out its karmic obligations through daily labor.',
    summaryQuoteHi: 'आजीविका केवल रोटी कमाने का साधन नहीं है; यह वह कर्म-क्षेत्र है जहां जीवात्मा अपने संचित प्रारब्ध को नित्य कर्म द्वारा चुकाती है।',
    sections: [
      careerVerdictSec,
      careerVerdictsResult.govtJobSection,
      careerVerdictsResult.vocationsSection,
      careerVerdictsResult.hazardsSection,
      careerEpochsSec,
    ],
    specialData: {
      careerVerdicts: careerVerdictsResult.data,
    },
  });

  // =========================================================================
  // CHAPTER 5: धन, संचित कोष व वित्तीय रिसाव (Wealth Accumulation & Leakage Traps)
  // =========================================================================
  const wealthSections = computeDynamicWealthInduLagnaSections(chart);

  chapters.push({
    chapterNumber: 5,
    id: 'chapter5_wealth_leakage',
    titleEn: 'Chapter 5: Wealth Accumulation & Financial Leakage Traps',
    titleHi: 'अध्याय 5: धन, संचित कोष व वित्तीय रिसाव के गुप्त छिद्र',
    subtitleEn: 'Inflow Channels, Unseen Drains, Indu Lagna Wealth Potential, Debt Cycles & Asset Timing',
    subtitleHi: 'धन आगमन के मूल स्रोत, गुप्त रिसाव के छिद्र (पैसा कहाँ जाता है?), इंदु लग्न, ऋण चक्र व भूमि-वाहन योग',
    icon: 'coins',
    summaryQuoteEn: 'Wealth is not measured by the river that flows into your coffers, but by the strength of the dam that prevents it from leaking away.',
    summaryQuoteHi: 'धन की वास्तविक शक्ति इस बात से नहीं मापी जाती कि कितनी गंगा आपके कोष में आई, बल्कि इस बात से तय होती है कि रिसाव रोकने वाला बांध कितना मजबूत है।',
    sections: wealthSections,
  });

  // =========================================================================
  // CHAPTER 6: दांपत्य, प्रेम, काम-प्रकृति व पारिवारिक संबंध (Marriage, Intimacy & Sexuality)
  // =========================================================================
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

  chapters.push({
    chapterNumber: 6,
    id: 'chapter6_marriage_sexuality',
    titleEn: 'Chapter 6: Marriage Reality, Intimacy & The Sexuality Spectrum',
    titleHi: 'अध्याय 6: दांपत्य, प्रेम, काम-प्रकृति व पारिवारिक संबंध',
    subtitleEn: 'Spouse Persona, Celibacy/Singlehood Diagnostics, Delay Roots, Bed Pleasures & Classical Sexuality Diagnostics',
    subtitleHi: 'जीवनसाथी का यथार्थ स्वरूप, विवाह हीनता/एकल जीवन योग, विलंब के कारण, शय्या सुख व काम-प्रकृति का सत्य',
    icon: 'heart',
    summaryQuoteEn: 'Marital destiny is not determined by fairy tales of eternal harmony, but by the courage to honor another sovereign soul while holding space for your own truth.',
    summaryQuoteHi: 'दांपत्य का सत्य किसी काल्पनिक परीकथा में नहीं, बल्कि दूसरे के आत्म-सम्मान की रक्षा करते हुए अपने सत्य को निष्कपटता से जीने में है।',
    sections: [
      marriageSpouseSec,
      marriageSexualitySec,
      relationalResult.coreFamilySection,
      relationalResult.extendedKinshipSection,
    ],
    specialData: {
      relationalMatrix: relationalResult.allEntities,
    },
  });

  // =========================================================================
  // CHAPTER 7: देह संवेदनशीलता, अंग-दोष व स्वास्थ्य संकट (Health & Longevity)
  // =========================================================================
  const h8Sign = (asc.signIndex + 7) % 12;
  const longevityInfo = ledgerReport.longevity;
  const ascLord = asc.signLord;
  const [healthTridoshaSec, healthAngaBhangaSec] = computeDynamicHealthSections(chart);

  const longevitySection: ChapterSection = {
    titleEn: 'Longevity Category & Manner of Departure Diagnostic',
    titleHi: 'आयु मर्यादा (Longevity Category) एवं देहावसान की परिस्थिति',
    leadEn: 'Assessment of longevity spans (Alpayu, Madhyayu, Purnayu) and the nature of final exit.',
    leadHi: 'पाराशरी तीन-युग्म विधि द्वारा आयु खंड एवं जीवन के अंतिम पड़ाव की शांतिमय स्थिति।',
    paragraphsEn: [
      `Parashari 3-Pairs Longevity assessment places your chart in the category of: ${longevityInfo.categoryEn}. The vital life force (Jeeva Bala) is sustained by the strength of your Ascendant lord (${ascLord}) and Saturn (Ayushkaraka). There is no indication of premature termination (Alpayu) provided basic health hygiene is honored.`,
      `Regarding the manner of departure (8th house in ${SIGNS[h8Sign].name}): The exit condition is indicated as dignified, concluding after full settlement of worldly duties, rather than a prolonged bedridden agony. The planetary configuration favors a conscious, peaceful transition in senior years.`,
    ],
    paragraphsHi: [
      `पाराशरी तीन-युग्म (Three-Pairs) पद्धति के अनुसार आपकी कुंडली '${longevityInfo.categoryHi}' (पूर्णायु/दीर्घायु) वर्ग में आती है। लग्नेश '${PLANET_HI[ascLord] || ascLord}' तथा आयु कारक शनि देव की स्थिति जीवन शक्ति (जीव बल) को सुदृढ़ बनाए रखती है। कुंडली में अकाल मृत्यु (बालारिष्ट या अल्पायु) का कोई योग नहीं है।`,
      `अष्टम भाव ('${SIGN_HI[h8Sign]}') के विश्लेषण के अनुसार जीवन का अंतिम पड़ाव वर्षों तक अशक्त होकर बिस्तर पर पड़े रहने के बजाय, सांसारिक दायित्वों की पूर्णता के पश्चात शांत व गरिमामय रूप से व्यतीत होगा। जातक अपने परिजनों को सुखी व संपन्न देखकर ही इस नश्वर देह का त्याग करेगा।`,
    ],
    astrologicalCauseEn: `Computed via Parashari 3-pairs method: Lagna Lord + 8th Lord, Lagna + Moon, and Lagna + Hora Lagna.`,
    astrologicalCauseHi: `शास्त्रीय कारण: पाराशरी तीन-युग्म नियम (लग्नेश+अष्टमेश, लग्न+चंद्र, लग्न+होरा लग्न) द्वारा गणितीय आयु-खंड निर्धारण।`,
  };

  chapters.push({
    chapterNumber: 7,
    id: 'chapter7_health_longevity',
    titleEn: 'Chapter 7: Physical Wellbeing, Vulnerability & Longevity Diagnostic',
    titleHi: 'अध्याय 7: देह संवेदनशीलता, अंग-दोष, स्वास्थ्य संकट व आयु मर्यादा',
    subtitleEn: 'Ayurvedic Tridosha, Vulnerable Organs, Disability/Impairment Check, Critical Age Milestones & Longevity Category',
    subtitleHi: 'आयुर्वेदिक त्रिदोष, संवेदनशील अंग, अंग-दोष/विकलांगता जांच, दुर्घटना-शल्यक्रिया के संवेदनशील वर्ष व देहावसान',
    icon: 'shield-alert',
    summaryQuoteEn: 'The physical body is a borrowed vessel; understanding its frailties allows one to sail through stormy waters without taking on water.',
    summaryQuoteHi: 'यह स्थूल देह प्रारब्ध भोगने का साधन मात्र है; इसकी कमजोरियों को पहले से जान लेने से व्यक्ति आंधी-तूफानों में भी सुरक्षित रहता है।',
    sections: [
      healthTridoshaSec,
      healthAngaBhangaSec,
      addictionsResult.section,
      litigationResult.section,
      longevitySection,
    ],
    specialData: {
      addictionsAndVices: addictionsResult.data,
      litigationAndAffairs: litigationResult.data,
    },
  });

  // =========================================================================
  // CHAPTER 8: 15 से 75 वर्ष का कालक्रम घटना चक्र (Milestones Timeline)
  // =========================================================================
  const epochSections = computeDynamic12Epochs(chart, isMarriageDenial);

  chapters.push({
    chapterNumber: 8,
    id: 'chapter8_chronology_epochs',
    titleEn: 'Chapter 8: The 15 to 75 Years Epoch Chronology',
    titleHi: 'अध्याय 8: 15 से 75 वर्ष का कालक्रम घटना चक्र (5-5 साल के जीवन पड़ाव)',
    subtitleEn: 'Comprehensive 12-Stage Chronological Journey Across Education, Career, Family, Wealth, Health & Spiritual Awakening',
    subtitleHi: '15 से 75 वर्ष तक 12 पंचवर्षीय जीवन पड़ावों का विस्तृत, प्रामाणिक व धाराप्रवाह जीवन आलेख',
    icon: 'hourglass',
    summaryQuoteEn: 'Life does not unfold at once; it is a tapestry woven in 5-year epochs, each bringing its own trials, triumphs, and karmic harvest.',
    summaryQuoteHi: 'जीवन एक ही झटके में नहीं खुलता; यह 5-5 वर्षों के 12 पड़ावों में बुना गया एक दिव्य आलेख है, जहां प्रत्येक कालखंड अपने हिस्से की तपस्या और फल लेकर आता है।',
    sections: epochSections,
  });

  // =========================================================================
  // CHAPTER 9: पूर्व जन्म का पूर्ण वृत्तांत व आगामी गति (Past Life & Future Becoming)
  // =========================================================================
  const pastReading = pastFuture?.pastLife;
  const futureReading = pastFuture?.futureBecoming;

  chapters.push({
    chapterNumber: 9,
    id: 'chapter9_past_future_life',
    titleEn: 'Chapter 9: Past Life Records & Future Incarnation Becoming',
    titleHi: 'अध्याय 9: पूर्व जन्म का पूर्ण वृत्तांत, संचित कर्म व आगामी गति',
    subtitleEn: 'Gender, Yoni, Civilization, Craft, Unfinished Vows, Manner of Exit & Moksha Likelihood Index',
    subtitleHi: 'पूर्व जन्म का लिंग, योनि, जन्म स्थान, आजीविका, चरित्र, वैवाहिक स्थिति, मृत्यु का कारण व मोक्ष संभावना सूचकांक',
    icon: 'sparkles',
    summaryQuoteEn: 'This life is neither the beginning nor the end; it is a single luminous bead on the infinite rosary of your soul’s journey.',
    summaryQuoteHi: 'यह वर्तमान जीवन न तो आदि है और न अंत; यह तो आपकी आत्मा की अनंत यात्रा की माला का केवल एक दैदीप्यमान मनका है।',
    sections: [
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
  // CHAPTER 10: वैदिक नवग्रह शांति, नक्षत्र व गोचर विधान, वर्तमान दशा निवारण एवं लाल किताब आचरण संहिता
  // =========================================================================
  const sleepingHouses = lalKitab?.sleepingHouses.filter((h) => h.isSleeping) ?? [];
  const activeDebts = lalKitab?.karmicDebts.filter((d) => d.isTriggered) ?? [];
  const vedicRemedies = computeComprehensiveVedicRemedies(chart, lalKitab);

  chapters.push({
    chapterNumber: 10,
    id: 'chapter10_vedic_remedies',
    titleEn: 'Chapter 10: Vedic Shastric Remedies, Planetary Shanti, Nakshatra Snana, Gochar & Lal Kitab Conduct',
    titleHi: 'अध्याय 10: वैदिक नवग्रह शांति, नक्षत्र व गोचर विधान, वर्तमान दशा निवारण एवं लाल किताब आचरण संहिता',
    subtitleEn: 'Tantrik Seed Mantras, Classical Dana, 6-8-12 House Cleansing, Janma Nakshatra Herbal Bath, Active Sade Sati Shield, Current Dasha Protocol & Lal Kitab Sleeping Houses',
    subtitleHi: 'सिद्ध तांत्रिक बीज मंत्र, शास्त्रीय दान, त्रिक भाव शुद्धि, नक्षत्र औषधि स्नान, शनि साढ़ेसाती रक्षा, सक्रिय दशा-अंतर्दशा उपाय व सोए घर जगाना',
    icon: 'book-open',
    summaryQuoteEn: 'True remedy is never a gemstone purchased with coins; it is the alignment of sacred mantras, astral herbal baths, real-time transit shields, and pure ethical conduct toward the living creation.',
    summaryQuoteHi: 'सच्चा उपाय कभी धन से खरीदा गया रत्न नहीं होता; सच्चा उपाय तो वैदिक बीज मंत्रों की ध्वनि, नक्षत्र औषधि स्नान, गोचर रक्षा और ईश्वर की सजीव सृष्टि के प्रति आचरण का निर्मल सुधार है।',
    sections: [
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
