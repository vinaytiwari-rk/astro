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
} from './lifeDossierHelpers';

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
  const moonAfflicted = [saturn.rasiHouseNumber, rahu.rasiHouseNumber, ketu.rasiHouseNumber].includes(moon.rasiHouseNumber) || [6, 8, 12].includes(moon.rasiHouseNumber);
  const ascLord = asc.signLord;
  const ascLordPlanet = chart.planets.find((p) => p.id === ascLord);

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
    sections: [
      {
        titleEn: 'The Public Mask vs. The Midnight Reality',
        titleHi: 'सामाजिक मुखौटा बनाम आधी रात का एकांत',
        leadEn: 'The stark contrast between your outer composure and your private psychic battles.',
        leadHi: 'बाहरी धीर-गंभीर आवरण और एकांत में उठने वाले मानसिक भंवर का वास्तविक विश्लेषण।',
        paragraphsEn: [
          `To colleagues, acquaintances, and family, you present the demeanor of an individual born in ${ascSignEn} Ascendant: collected, responsible, capable of shouldering burdens without flinching. People lean on you because you project the aura of someone who has their life figured out. You listen patiently, offer pragmatic guidance, and rarely reveal cracks in your confidence.`,
          `Yet, when the door closes and the world recedes into midnight silence, a vastly different psychological current takes over. Under the influence of Moon in ${moonSignEn}${moonAfflicted ? ' under heavy affliction' : ''}, your mind enters loops of hyper-vigilance and retrospective self-interrogation. You replay past conversations, scrutinize missed opportunities, and battle an irrational fear of being found inadequate or suddenly abandoned. You crave genuine emotional intimacy, yet paradoxically push people away the moment they get close enough to see your vulnerabilities.`,
        ],
        paragraphsHi: [
          `बाहरी जगत, मित्रों और कार्यक्षेत्र में आप '${ascSignHi}' लग्न के अनुरूप एक अत्यंत संतुलित, उत्तरदायी और सुदृढ़ व्यक्ति के रूप में दिखाई देते हैं। लोग संकट के समय आप पर भरोसा करते हैं क्योंकि आपके चेहरे पर एक स्वाभाविक आत्मविश्वास और समस्याओं को सुलझाने की क्षमता झलकती है। आप दूसरों की व्यथा सुनते हैं और उन्हें सहारा देते हैं।`,
          `किंतु जैसे ही दिन का कोलाहल थमता है और आप अपने एकांत में लौटते हैं, मन के भीतर एक बिल्कुल अलग युद्ध छिड़ जाता है। '${moonSignHi}' राशि के चंद्रमा${moonAfflicted ? ' पर पाप ग्रहों के प्रभाव' : ''} के कारण आपका मन अक्सर 'अति-विचार' (Overthinking) और अज्ञात असुरक्षा के भंवर में फंस जाता है। आप पुरानी बातों, छूटे हुए अवसरों और लोगों के दोहरे व्यवहार को बार-बार याद करके स्वयं को व्यथित करते हैं। आपके भीतर प्रेम और आत्मीयता की गहरी प्यास है, किंतु जैसे ही कोई आपके बहुत निकट आता है, आप एक अज्ञात भयवश पीछे हट जाते हैं।`,
        ],
        astrologicalCauseEn: `Lagna is ${ascSignEn} (governed by ${ascLord}), while Moon is placed in ${moonSignEn} in house ${moon.rasiHouseNumber}. ${moonAfflicted ? 'Affliction to Moon by malefics creates periodic emotional exhaustion and chronic over-analysis.' : 'Moon-Mercury axis triggers rapid intellectualization of emotional pain.'}`,
        astrologicalCauseHi: `शास्त्रीय कारण: लग्न '${ascSignHi}' है (स्वामी: ${PLANET_HI[ascLord] || ascLord}), जबकि मन के कारक चंद्र देव '${moonSignHi}' में भाव संख्या ${moon.rasiHouseNumber} में स्थित हैं। ${moonAfflicted ? 'चंद्रमा पर क्रूर ग्रहों का प्रभाव अथवा त्रिक भाव (6/8/12) संबंध जातक को एकांत में गहरी मानसिक व्यग्रता व असुरक्षा बोध देता है।' : 'चंद्र और बुध का संबंध जातक को अत्यधिक बौद्धिक विश्लेषण की ओर धकेलता है जिससे भावनाएं दब जाती हैं।'}`,
      },
      {
        titleEn: 'Secret Triggers, Resentments & The Self-Sabotage Trap',
        titleHi: 'आंतरिक ट्रिगर्स, गुप्त असंतोष एवं आत्म-विनाशकारी प्रवृत्तियां',
        leadEn: 'The psychological vulnerabilities that make you act against your own long-term interests.',
        leadHi: 'वे छिपी हुई कमजोरियां जहां आप भावना में बहकर अपने ही बने-बनाए काम बिगाड़ लेते हैं।',
        paragraphsEn: [
          `Your deepest emotional trigger is betrayal disguised as politeness. Having invested profound loyalty in partnerships or causes, experiencing casual ingratitude hits you with the force of physical violence. Instead of confronting it openly, you tend to build silent walls, withdrawing completely and leaving the other party baffled.`,
          `Your primary self-sabotaging pattern is chronic procrastination born of perfectionism. You delay pivotal launches, career transitions, or difficult honest conversations until 'conditions are ideal'—a defense mechanism against the possibility of rejection. At other times, an impulsive burst of anger (Mars in ${mars.signName}) prompts you to burn bridges that took years to construct, only to regret the fallout in private later.`,
        ],
        paragraphsHi: [
          `आपका सबसे संवेदनशील ट्रिगर 'अहसानफरामोशी और झूठी चापलूसी' है। जब आप किसी व्यक्ति पर निष्कपट भाव से विश्वास करते हैं और बदले में वह अपनी सुविधा के अनुसार आपका उपयोग करता है, तो आपका हृदय भीतर तक आहत हो जाता है। आप प्रत्यक्ष झगड़ा करने के बजाय अचानक मौन धारण कर लेते हैं और उस व्यक्ति को अपने जीवन से पूरी तरह काट देते हैं।`,
          `आपकी सबसे बड़ी आत्म-विनाशकारी प्रवृत्ति 'परफेक्शनिज्म के आवरण में छिपी टालमटोल' (Procrastination) है। जब तक सब कुछ शत-प्रतिशत अनुकूल न दिखे, आप बड़े निर्णय, व्यापारिक विस्तार या कटु सत्य कहने में विलंब करते रहते हैं। वहीं दूसरी ओर, कभी-कभी मंगल (${mars.signName}) के प्रभाववश अचानक उपजे तीव्र आक्रोश में आप वर्षों से बने संबंधों को एक क्षण में तोड़ देते हैं, जिसका पछतावा बाद में एकांत में सालता रहता है।`,
        ],
        astrologicalCauseEn: `Mars in house ${mars.rasiHouseNumber} aspects the houses of expression and partnerships, while Saturn (${saturn.signName}) induces subconscious fear of failure.`,
        astrologicalCauseHi: `शास्त्रीय कारण: मंगल भाव ${mars.rasiHouseNumber} में स्थित होकर वाणी व साझेदारी पर प्रभाव डाल रहे हैं, तथा शनि (${SIGN_HI[saturn.signIndex]}) अवचेतन में असफलता का भय उत्पन्न कर समय पर निर्णय लेने में बाधा डालते हैं।`,
      },
    ],
  });

  // =========================================================================
  // CHAPTER 3: वर्तमान जीवन अवस्था का एक्स-रे — 'अभी क्या घट रहा है?' (Active Life Phase)
  // =========================================================================
  const dashaPeriod = chart.vimshottari?.find((d) => {
    const now = Date.now();
    return d.startMs <= now && now <= d.endMs;
  }) ?? chart.vimshottari?.[0];
  const currentMahaLord = (dashaPeriod?.lord as NineGrahaId) || 'Saturn';
  const currentAntar = dashaPeriod?.children?.find((a) => {
    const now = Date.now();
    return a.startMs <= now && now <= a.endMs;
  }) ?? dashaPeriod?.children?.[0];
  const currentAntarLord = (currentAntar?.lord as NineGrahaId) || 'Mercury';

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
    sections: [
      {
        titleEn: 'The Reality of the Past 6 to 12 Months: Mental & Circumstantial Fatigue',
        titleHi: 'विगत 6 से 12 माह का यथार्थ: मानसिक थकावट एवं परिस्थितियों का दबाव',
        leadEn: 'An objective diagnostic of the hidden strain you have been carrying silently.',
        leadHi: 'उस अव्यक्त तनाव का सटीक परीक्षण जिसे आप पिछले कई महीनों से चुपचाप सहते आ रहे हैं।',
        paragraphsEn: [
          `Over the past 6 to 12 months, your life has been characterized by a distinct sense of friction between your efforts and tangible outcomes. While things have not collapsed entirely, the emotional and mental energy required to keep regular affairs afloat has doubled. Unexpected financial expenditures, delays in promised support, and a recurring sense of being taken for granted by close associations have depleted your reservoir of patience.`,
          `You have experienced frequent sleep interruptions, early morning awakenings with an active nervous system, and a persistent urge to break away from existing routines. A significant project, property matter, or career advancement that was supposed to conclude smoothly has encountered frustrating bureaucratic or interpersonal bottlenecks.`,
        ],
        paragraphsHi: [
          `पिछले 6 से 12 महीनों में आपके जीवन में 'परिश्रम अधिक और परिणाम धीमा' रहने का स्पष्ट दौर रहा है। यद्यपि परिस्थितियां पूरी तरह बिगड़ी नहीं, किंतु दैनिक व्यवस्थाओं, जिम्मेदारियों और कार्यक्षेत्र को सुचारू रखने में आपकी सामान्य से दोगुनी ऊर्जा खर्च हुई है। अनपेक्षित खर्चों, अपनों के असहयोग और वादों के समय पर पूरा न होने से मन में एक गहरी थकावट और असंतोष का भाव संचित हुआ है।`,
          `नींद में व्यवधान, सुबह उठते ही एक अज्ञात मानसिक तनाव, और वर्तमान जीवन-परिस्थितियों से दूर जाने की तीव्र इच्छा ने आपको कई बार विचलित किया है। करियर, पदोन्नति या संपत्ति से जुड़ा कोई महत्वपूर्ण कार्य जो कुछ माह पूर्व सरल दिखाई दे रहा था, अप्रत्याशित अड़चनों व लोगों की मंशा के कारण खिंचता चला गया है।`,
        ],
        astrologicalCauseEn: `Running Mahadasha of ${currentMahaLord} with Antardasha of ${currentAntarLord}. Concurrently, Saturn's transit aspect on sensitive natal points and Rahu-Ketu axis across karmic houses has triggered restructuring of priorities.`,
        astrologicalCauseHi: `शास्त्रीय कारण: इस समय '${PLANET_HI[currentMahaLord] || currentMahaLord}' की महादशा में '${PLANET_HI[currentAntarLord] || currentAntarLord}' की अंतर्दशा गतिशील है। इसके साथ ही गोचर में शनि देव का प्रभाव जन्म चक्र के संवेदनशील स्थानों पर पड़ने तथा राहु-केतु के अक्ष द्वारा भावों को मथने से यह मंथन काल उपस्थित हुआ है।`,
      },
      {
        titleEn: 'Next 6-Month Inflexion Window: The Crucial Warning & Opportunity',
        titleHi: 'आगामी 6 माह की चेतावनी, महत्वपूर्ण मोड़ व अवसर',
        leadEn: 'What to aggressively pursue and what to strictly avoid in the immediate future.',
        leadHi: 'निकट भविष्य में किन कार्यों में जोखिम से बचना है और कहां सफलता का मार्ग खुलेगा।',
        paragraphsEn: [
          `The upcoming 6-month cycle marks a critical transition. You must strictly avoid: entering unwritten financial partnerships, lending funds on emotional grounds (such money will not return without severing relations), and initiating confrontational litigation. Rash decisions driven by temporary frustration will prove costly.`,
          `Conversely, this window provides fertile ground for: consolidating core skills, restructuring debt, resolving long-standing tax or documentation backlogs, and letting dead weight fall away from your personal network. A decisive opening in career or public stature will emerge toward the later third of this window as transit pressures align favorably.`,
        ],
        paragraphsHi: [
          `आगामी 6 महीने आपके जीवन में एक महत्वपूर्ण मोड़ ला रहे हैं। इस अवधि में निम्नलिखित बातों से पूर्णतः बचें: किसी को भी भावुकतावश धन उधार देना (यह धन संबंध बिगाड़े बिना वापस नहीं आएगा), बिना लिखित अनुबंध के साझेदारी करना, तथा क्रोध में आकर कानूनी विवाद में कूदना। क्षणिक आवेश में लिया गया कोई भी कठोर निर्णय दीर्घकालिक नुकसान पहुंचा सकता है।`,
          `इसके विपरीत, यह समय निम्नलिखित के लिए अत्यंत अनुकूल है: अपनी मूल विद्या व कौशल का नवीनीकरण, पुराने ऋणों की व्यवस्थित चुकौती, सरकारी व कागजी औपचारिकताओं को सुलझाना, और नकारात्मक संपर्कों से दूरी बनाना। इस अवधि के अंतिम भाग में करियर में एक ठोस प्रगति का अवसर प्रकट होगा।`,
        ],
        astrologicalCauseEn: `Upcoming Antardasha transition and Jupiter's transit into a trinal aspect toward your 10th and 2nd houses will unlock frozen potentials.`,
        astrologicalCauseHi: `शास्त्रीय कारण: आगामी अंतर्दशा का संधिकाल और गोचर में देवगुरु बृहस्पति का त्रिकोण दृष्टि प्रभाव आपके दशम व द्वितीय भाव पर सक्रिय होकर रुके हुए कार्यों को गति देगा।`,
      },
    ],
  });

  // =========================================================================
  // CHAPTER 4: कर्म, कार्यक्षेत्र व आजीविका का यथार्थ (Career, Zenith & Professional Truth)
  // =========================================================================
  const h10Sign = (asc.signIndex + 9) % 12;
  const h10Lord = SIGNS[h10Sign].lord;
  const amk = chart.planets.find((p) => p.charaKaraka === 'AmK') ?? chart.planets[1];

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
      {
        titleEn: 'Job vs. Independent Enterprise: The Definitive Verdict',
        titleHi: 'नौकरी बनाम स्वतंत्र व्यवसाय: निर्णायक फैसला',
        leadEn: 'Whether your destiny thrives under established hierarchy or independent command.',
        leadHi: 'आपकी कुंडली किसी के अधीन सेवा कार्य के लिए बनी है अथवा स्वतंत्र सत्ता व व्यापार के लिए।',
        paragraphsEn: [
          `Your 10th house is governed by ${h10Lord} in sign ${SIGNS[h10Sign].name}, while your Amatyakaraka (career indicator) is ${amk.id}. An exhaustive synthesis of your D1 (Rasi) and D10 (Dashamsha) charts reveals that your core nature resists perpetual subordination to micro-managing superiors. While you may begin your professional journey in salaried employment to acquire technical discipline and capital, you are fundamentally engineered for independent strategic authority.`,
          `If forced to remain in rigid corporate servitude without autonomy, your motivation plummets, resulting in quiet disengagement and friction with management. You perform at your peak when given a defined domain of ownership, whether as an executive leader, specialized consultant, or founder of your own enterprise.`,
        ],
        paragraphsHi: [
          `आपकी जन्म कुंडली में दशम भाव '${SIGN_HI[h10Sign]}' राशि में है, जिसके स्वामी '${PLANET_HI[h10Lord] || h10Lord}' हैं, और आपके अमात्यकारक (करियर के मुख्य ग्रह) '${PLANET_HI[amk.id] || amk.id}' हैं। लग्न (D1) और दशमांश (D10) चक्र का संयुक्त विश्लेषण यह स्पष्ट करता है कि आपकी आत्मा किसी संकीर्ण मानसिकता वाले अधिकारी के पूर्ण नियंत्रण में जीवन भर कार्य करने के लिए नहीं बनी है। यद्यपि जीवन के प्रारंभिक काल में अनुभव और संसाधन जुटाने हेतु नौकरी आवश्यक हो सकती है, किंतु आपका वास्तविक उत्कर्ष 'स्वायत्त सत्ता और स्वतंत्र निर्णय' में ही संभव है।`,
          `यदि आपको ऐसे वातावरण में कार्य करना पड़े जहां आपकी रचनात्मक स्वतंत्रता कुचली जाती हो, तो आपका उत्साह समाप्त हो जाता है। आप तब सर्वोच्च प्रदर्शन करते हैं जब आपको किसी विभाग, परियोजना या स्वतंत्र व्यापार की पूर्ण कमान सौंपी जाए।`,
        ],
        astrologicalCauseEn: `10th house lord ${h10Lord} combined with Amatyakaraka ${amk.id} in D1 and D10 reveals high executive drive and resistance to arbitrary subordination.`,
        astrologicalCauseHi: `शास्त्रीय कारण: दशमेश '${PLANET_HI[h10Lord] || h10Lord}' तथा अमात्यकारक '${PLANET_HI[amk.id] || amk.id}' की लग्न व दशमांश में स्थिति जातक को उच्च नेतृत्व क्षमता और स्वाधीन कार्यशैली प्रदान करती है।`,
      },
      careerVerdictsResult.govtJobSection,
      careerVerdictsResult.vocationsSection,
      careerVerdictsResult.hazardsSection,
      {
        titleEn: 'The Three Career Epochs & Peak Zenith Age',
        titleHi: 'करियर के तीन जीवन पड़ाव एवं सर्वोच्च उत्थान का काल (Zenith Age)',
        leadEn: 'The chronological arc of professional emergence, stabilization, and peak authority.',
        leadHi: 'प्रारंभिक संघर्ष, स्थायित्व का मोड़ और वह आयु जब आपका प्रभाव चरम पर पहुंचेगा।',
        paragraphsEn: [
          `Age 20 to 26 (The Friction & Identity Struggle): This initial phase is characterized by experimentation, trial and error, compensation that feels beneath your capability, and navigating deceptive mentors. You are forced to perform mundane duties while your true abilities remain largely unrecognized.`,
          `Age 28 to 33 (The First Major Breakthrough): A decisive shift occurs here. You gain domain mastery, shed naive illusions about workplace loyalty, and step into an authentic professional niche. Financial compensation scales noticeably and you establish professional respect.`,
          `Age 36 to 45 (The True Career Zenith Window): This represents the golden epoch of your professional journey. During these years, your strategic judgment matures completely. You command authority, execute high-value projects, and build enduring institutional or commercial assets. This is the period when your name carries weight in your chosen field.`,
        ],
        paragraphsHi: [
          `20 से 26 वर्ष (दिशाहीनता व प्रारंभिक संघर्ष का दौर): इस काल में जातक को अपनी क्षमता से कम पारिश्रमिक, दिशा की तलाश, और कई बार गलत मार्गदर्शकों के कारण भटकना पड़ता है। आपको बहुत अधिक परिश्रम के बाद भी उचित श्रेय नहीं मिलता।`,
          `28 से 33 वर्ष (स्थायित्व व पहला बड़ा उत्थान): यह वह निर्णायक पड़ाव है जहां जातक की बौद्धिक परिपक्वता आती है। आप कार्यक्षेत्र के भ्रमों से बाहर निकलकर अपने वास्तविक कौशल को पहचानते हैं। इस काल में पद, प्रतिष्ठा और आय में एक ठोस उछाल आता है।`,
          `36 से 45 वर्ष (करियर का सर्वोच्च शिखर / Zenith Age): यह आपके पेशेवर जीवन का स्वर्णिम काल है। इस आयु वर्ग में आपका प्रभाव, निर्णय क्षमता और सामाजिक सम्मान चरम पर पहुंचेगा। आप केवल कर्मचारी नहीं, बल्कि नीति-निर्धारक या बड़े व्यापार के स्वामी के रूप में अपनी अमिट छाप छोड़ेंगे।`,
        ],
        astrologicalCauseEn: `Progression of Amatyakaraka and activation of D10 10th house during the mature planetary cycle between age 36 and 44.`,
        astrologicalCauseHi: `शास्त्रीय कारण: अमात्यकारक ग्रह की परिपक्वता तथा दशमांश चक्र के दशमेश का प्रभाव 36 से 45 वर्ष की आयु में पूर्ण राजयोग फलित करता है।`,
      },
    ],
    specialData: {
      careerVerdicts: careerVerdictsResult.data,
    },
  });

  // =========================================================================
  // CHAPTER 5: धन, संचित कोष व वित्तीय रिसाव (Wealth Accumulation & Leakage Traps)
  // =========================================================================
  const h2Sign = (asc.signIndex + 1) % 12;
  const h2Lord = SIGNS[h2Sign].lord;
  const h11Sign = (asc.signIndex + 10) % 12;
  const h11Lord = SIGNS[h11Sign].lord;
  const h12Sign = (asc.signIndex + 11) % 12;
  const h12Lord = SIGNS[h12Sign].lord;

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
    sections: [
      {
        titleEn: 'The Paradox of Inflow vs. The Secret Leakage Traps',
        titleHi: 'धन आगमन की सामर्थ्य बनाम वित्तीय रिसाव के गुप्त छिद्र',
        leadEn: 'Why substantial earnings repeatedly evaporate without generating commensurate peace of mind.',
        leadHi: 'अच्छी कमाई के बाद भी बैंक बैलेंस में अपेक्षित स्थिरता न दिखने का वास्तविक कारण।',
        paragraphsEn: [
          `Your chart possesses genuine Dhana Yogas: 2nd house (accumulation) governed by ${h2Lord} and 11th house (cashflow) governed by ${h11Lord} ensure that you will rarely face catastrophic destitution. Whenever a crisis hits, money arrives from unexpected quarters to avert disaster. You have the intellect to create multiple streams of value.`,
          `However, your 12th house of expenditure (governed by ${h12Lord}) reveals chronic, unseen leakage traps. Your money leaks primarily through three channels: (1) Emotional loans to relatives or acquaintances that are never returned; (2) Impulsive investments in speculative ventures where you enter at the peak and exit at the bottom; and (3) Sudden, unanticipated domestic or health expenses that erase your savings cushion just when it reaches a satisfying milestone.`,
        ],
        paragraphsHi: [
          `आपकी कुंडली में धन भाव (द्वितीय) के स्वामी '${PLANET_HI[h2Lord] || h2Lord}' और लाभ भाव (एकादश) के स्वामी '${PLANET_HI[h11Lord] || h11Lord}' यह सुनिश्चित करते हैं कि आप कभी दाने-दाने के मोहताज नहीं होंगे। जब भी कोई गंभीर आर्थिक संकट आता है, कहीं न कहीं से संसाधन प्रकट हो जाते हैं और आपकी लाज बच जाती है। आपके भीतर धन कमाने की तीक्ष्ण बुद्धि विद्यमान है।`,
          `किंतु द्वादश भाव (व्यय स्थान, स्वामी: ${PLANET_HI[h12Lord] || h12Lord}) के प्रभाव से आपके जीवन में 'गुप्त वित्तीय रिसाव' के तीन बड़े छिद्र बने रहते हैं: (1) भावुक होकर सगे-संबंधियों या मित्रों को दिया गया ऐसा ऋण जो कभी वापस नहीं आता; (2) बिना गहन पड़ताल के शेयर, सट्टे या किसी लुभावनी योजना में पूंजी फंसाना; और (3) जैसे ही बैंक में एक निश्चित धनराशि जमा होती है, तुरंत कोई पारिवारिक, स्वास्थ्य संबंधी या आकस्मिक खर्च आकर उस संचित पूंजी को बहा ले जाता है।`,
        ],
        astrologicalCauseEn: `Relationship between 2nd lord ${h2Lord}, 11th lord ${h11Lord}, and 12th lord ${h12Lord}. Rahu/Ketu connection to wealth houses induces periodic financial miscalculations.`,
        astrologicalCauseHi: `शास्त्रीय कारण: धनेश '${PLANET_HI[h2Lord] || h2Lord}' और व्ययेश '${PLANET_HI[h12Lord] || h12Lord}' का परस्पर संबंध जातक को कमाने की शक्ति तो देता है, किंतु संचय के घड़े में अदृश्य रिसाव बनाए रखता है।`,
      },
      {
        titleEn: 'Real Estate, Vehicle Acquisition Windows & Debt Defense',
        titleHi: 'भूमि, भवन, वाहन प्राप्ति के स्वर्णिम वर्ष एवं ऋण-मुक्ति नियम',
        leadEn: 'When substantial physical assets will materialize and how to stay permanently debt-free.',
        leadHi: 'स्थायी संपत्ति व वाहन का योग कब फलित होगा और कर्ज के दुष्चक्र से कैसे बचें।',
        paragraphsEn: [
          `Fixed asset accumulation (4th house) is favored during the Antardashas of benefic planets connected to your 4th lord and Mars. Significant real estate or substantial vehicular upgrades will materialize between ages 32–35, 41–44, and 52–54. It is strongly advised to register primary real estate under joint ownership with your spouse or mother to shield it from your speculative impulses.`,
          `To remain debt-free: Never guarantee loans for third parties, regardless of emotional closeness. Classical texts advise maintaining a reserve fund in gold or immovable land rather than liquid cash, as liquidity burns quickly in your psychological field.`,
        ],
        paragraphsHi: [
          `चतुर्थ भाव (भूमि, भवन, वाहन) के विश्लेषण से ज्ञात होता है कि जातक के जीवन में अचल संपत्ति और उत्तम वाहन का योग 32 से 35 वर्ष, 41 से 44 वर्ष, तथा 52 से 54 वर्ष की आयु में अत्यंत प्रबल रहेगा। संपत्ति का क्रय करते समय माता अथवा जीवनसाथी के नाम को सम्मिलित करना वास्तु व ज्योतिषीय दृष्टि से अत्यंत शुभ फल देगा।`,
          `ऋण चक्र से सुरक्षा का अचूक नियम: कभी भी किसी अन्य व्यक्ति के बैंक ऋण में गारंटर (जमानती) न बनें। अपनी अतिरिक्त पूंजी को लिक्विड कैश या बैंक खाते में रखने के बजाय स्वर्ण अथवा भूमि में रूपांतरित करें, क्योंकि आपके हाथ में नकद पैसा टिकने में कठिनाई होती है।`,
        ],
        astrologicalCauseEn: `4th house lord condition and Mars (Bhumi Karaka) placement in chart dictate property cycles.`,
        astrologicalCauseHi: `शास्त्रीय कारण: चतुर्थेश व भूमि कारक मंगल देव की स्थिति संपत्ति योग को परिपक्व करती है।`,
      },
    ],
  });

  // =========================================================================
  // CHAPTER 6: दांपत्य, प्रेम, काम-प्रकृति व पारिवारिक संबंध (Marriage, Intimacy & Sexuality)
  // =========================================================================
  const h7Sign = (asc.signIndex + 6) % 12;
  const h7Lord = SIGNS[h7Sign].lord;
  const dk = chart.planets.find((p) => p.charaKaraka === 'DK') ?? chart.planets[6];
  const d9H7Sign = (akD9.signIndex + 6) % 12;

  // Classical Tritiya Prakriti / Sexuality Indicators (Brihat Jataka, BPHS)
  const mercurySaturnConnection = [mercury.rasiHouseNumber, saturn.rasiHouseNumber].includes(7) ||
    [mercury.rasiHouseNumber, saturn.rasiHouseNumber].includes(1) ||
    (mercury.rasiHouseNumber === saturn.rasiHouseNumber);
  const venusKetuConnection = [venus.rasiHouseNumber, ketu.rasiHouseNumber].includes(7) ||
    (venus.rasiHouseNumber === ketu.rasiHouseNumber) ||
    [venus.rasiHouseNumber, ketu.rasiHouseNumber].includes(12);

  chapters.push({
    chapterNumber: 6,
    id: 'chapter6_marriage_sexuality',
    titleEn: 'Chapter 6: Marriage Reality, Intimacy & The Sexuality Spectrum',
    titleHi: 'अध्याय 6: दांपत्य, प्रेम, काम-प्रकृति व पारिवारिक संबंध',
    subtitleEn: 'Spouse Persona, Delay Roots, Marital Friction, Bed Pleasures & Classical Sexuality Diagnostics',
    subtitleHi: 'जीवनसाथी का यथार्थ स्वरूप, विवाह विलंब के कारण, वैवाहिक कलह की जड़ें, शय्या सुख व काम-प्रकृति का सत्य',
    icon: 'heart',
    summaryQuoteEn: 'Marital destiny is not determined by fairy tales of eternal harmony, but by the courage to honor another sovereign soul while holding space for your own truth.',
    summaryQuoteHi: 'दांपत्य का सत्य किसी काल्पनिक परीकथा में नहीं, बल्कि दूसरे के आत्म-सम्मान की रक्षा करते हुए अपने सत्य को निष्कपटता से जीने में है।',
    sections: [
      {
        titleEn: 'Spouse Persona, Temperament & Roots of Marital Friction',
        titleHi: 'जीवनसाथी का वास्तविक स्वरूप, स्वभाव एवं वैवाहिक कलह की जड़ें',
        leadEn: 'The real psychological and social profile of your life partner and where clashes arise.',
        leadHi: 'आपके जीवनसाथी का यथार्थ व्यक्तित्व, पारिवारिक पृष्ठभूमि और आपसी मतभेद के मुख्य बिंदु।',
        paragraphsEn: [
          `Your 7th house falls in ${SIGNS[h7Sign].name} (governed by ${h7Lord}), with your Darakaraka (spouse indicator) being ${dk.id}. Your spouse is not a passive mirror of your desires; they possess a distinct, firm, and stubborn individuality. They come from a background of self-respect, possess sharp analytical instincts, and cannot be intimidated by emotional outbursts.`,
          `The primary root of marital friction in your chart is not lack of love, but misaligned communication styles and unmet expectations of validation. You tend to internalize your complaints until you explode over trivial matters, while your spouse demands immediate clarity and transparency. If either party attempts to enforce authoritarian control, the bedroom grows cold and passive-aggressive silence replaces warmth.`,
        ],
        paragraphsHi: [
          `आपकी कुंडली में सप्तम भाव '${SIGN_HI[h7Sign]}' राशि में है जिसके स्वामी '${PLANET_HI[h7Lord] || h7Lord}' हैं, और आपके दाराकारक (जीवनसाथी के सूचक ग्रह) '${PLANET_HI[dk.id] || dk.id}' हैं। आपका जीवनसाथी कोई दब्बू या आपकी हर बात में हां मिलाने वाला व्यक्ति नहीं होगा; उनका अपना एक स्वतंत्र, स्वाभिमानी और दृढ़ व्यक्तित्व होगा। वे तार्किक बुद्धि वाले, अपने आत्मसम्मान के प्रति अत्यंत सजग, और व्यवस्थाप्रिय होंगे।`,
          `वैवाहिक जीवन में कलह की असली जड़ प्रेम की कमी नहीं, बल्कि 'संवाद की शैली और अपेक्षाओं का अंतर' है। आप अपनी नाराजगी को मन ही मन दबाते हैं और फिर किसी छोटी सी बात पर अचानक फट पड़ते हैं, जबकि आपका साथी तुरंत स्पष्टीकरण और तार्किक उत्तर चाहता है। जब दोनों में से कोई भी एक-दूसरे पर आधिपत्य जमाने की चेष्टा करता है, तो घर में मौन तनाव और शीत-युद्ध की स्थिति उत्पन्न हो जाती है।`,
        ],
        astrologicalCauseEn: `7th house in ${SIGNS[h7Sign].name} ruled by ${h7Lord}, with Darakaraka ${dk.id} influencing D9 Navamsha 7th house. Upapada Lagna in ${ulPoint?.signNameEn || 'Auspicious sign'} requires mutual patience during transits of Saturn or Rahu.`,
        astrologicalCauseHi: `शास्त्रीय कारण: सप्तमेश '${PLANET_HI[h7Lord] || h7Lord}' एवं दाराकारक '${PLANET_HI[dk.id] || dk.id}' की स्थिति तथा उपपद लग्न (${ulPoint?.signNameHi || 'शुभ राशि'}) पर गोचर का प्रभाव वैवाहिक संबंधों में समय-समय पर अहंकार के टकराव का संकेत देता है।`,
      },
      {
        titleEn: 'Bed Pleasures, Intimacy Dynamics & The Sexuality Spectrum',
        titleHi: 'शय्या सुख, काम-ऊर्जा एवं काम-प्रकृति (Sexuality Spectrum) का यथार्थ',
        leadEn: 'An authentic, objective classical assessment of physical intimacy, desires, and orientation.',
        leadHi: 'अंतरंग शय्या सुख, काम-वासना और महर्षि पाराशर व वराहमिहिर सम्मत काम-प्रकृति का खुला विश्लेषण।',
        paragraphsEn: [
          `Classical Jyotish texts (Brihat Jataka Ch. 2, BPHS Ch. 80, Jaimini Sutras) explicitly analyze physical passion, bed comforts (12th house), and the natural spectrum of human sexuality, including Tritiya Prakriti (non-binary, fluid, or unconventional attractions). Your 12th house (bed pleasures) and Venus (${venus.signName}) reveal an intense, complex sensual nature that cannot be satisfied by mechanical, dutiful encounters. Emotional connection and psychological safety are non-negotiable prerequisites for physical intimacy.`,
          `${mercurySaturnConnection || venusKetuConnection ? 'Your chart reveals strong classical signatures of unconventional, non-traditional, or fluid intimate orientations (influence of Mercury/Saturn or Venus-Ketu on intimate houses). You possess an inherent openness or internal duality that transcends rigid societal orthodoxies. If you have suppressed this part of your psyche out of societal shame, it creates silent neuroses and deep dissatisfaction in conventional arrangements.' : 'Your chart reflects a predominantly classical romantic temperament with deep desires for exclusivity and aesthetic refinement. However, when emotional communication breaks down, you tend to withhold intimacy as a subconscious weapon, which deeply damages the relationship.'}`,
        ],
        paragraphsHi: [
          `प्राचीन ज्योतिष ग्रंथों (बृहज्जातक, बृहत्पाराशर होराशास्त्र, जैमिनि सूत्र) में 12वें भाव (शय्या सुख), काम-कारक शुक्र एवं काम-प्रकृति का अत्यंत वैज्ञानिक व निष्पक्ष विश्लेषण मिलता है। आपकी कुंडली में शुक्र देव '${SIGN_HI[venus.signIndex]}' राशि में हैं और 12वां भाव अत्यंत संवेदनशील है। आपका शारीरिक व भावनात्मक सुख केवल यांत्रिक संबंधों से तृप्त नहीं हो सकता; आपको अंतरंगता के लिए बौद्धिक तालमेल, मानसिक सुरक्षा और गहरे आत्मीय सम्मान की आवश्यकता होती है।`,
          mercurySaturnConnection || venusKetuConnection
            ? "आपकी कुंडली में बुध, शनि अथवा शुक्र-केतु के विशिष्ट योगों के प्रभाव से पारंपरिक रूढ़ियों से परे 'तृतीय प्रकृति' (Tritiya Prakriti), अपरंपरागत आकर्षण अथवा काम-प्रकृति में तरलता (Fluid/Queer/Unconventional Sexuality) के शास्त्रीय संकेत उपस्थित हैं। आप बाह्य सामाजिक दबाव में पारंपरिक रूप धारण कर सकते हैं, किंतु अंतर्मन में आपकी काम-चेतना और आकर्षण की परिभाषा समाज के बंधे-बंधाए ढांचों से बिल्कुल भिन्न है। इस सत्य को स्वीकार न करना ही आंतरिक कुंठा का कारण बनता है।"
            : "आपकी काम-प्रकृति में पारंपरिक मर्यादा, एकाग्र प्रेम और सौंदर्य-बोध का प्राधान्य है। किंतु जब जीवनसाथी से भावनात्मक तालमेल बिगड़ता है, तो आप अवचेतन रूप से अंतरंगता से दूरी बना लेते हैं, जिससे दांपत्य में दूरियां और बढ़ जाती हैं।",
        ],
        astrologicalCauseEn: `Venus placed in ${venus.signName} (House ${venus.rasiHouseNumber}), 12th house condition, and planetary aspects between Venus, Mars, Mercury, and Saturn.`,
        astrologicalCauseHi: `शास्त्रीय कारण: शुक्र देव की '${SIGN_HI[venus.signIndex]}' में स्थिति, द्वादश भाव का बलाबल तथा बुध-शनि-शुक्र-मंगल के दृष्टि संबंध काम-प्रकृति और शय्या सुख की दिशा तय करते हैं।`,
      },
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
  const h6Sign = (asc.signIndex + 5) % 12;
  const h6Lord = SIGNS[h6Sign].lord;
  const h8Sign = (asc.signIndex + 7) % 12;
  const h8Lord = SIGNS[h8Sign].lord;
  const longevityInfo = ledgerReport.longevity;

  // Disability / Anga-Bhanga Classical Rules Check
  const twentySecondLord = sensitivePoints.twentySecondDrekkanaLordEn;
  const hasAngaBhangaRisk = [6, 8, 12].includes(saturn.rasiHouseNumber) ||
    [6, 8].includes(mars.rasiHouseNumber) ||
    (twentySecondLord === ascLord);

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
      {
        titleEn: 'Ayurvedic Constitution (Tridosha) & High-Risk Organ Systems',
        titleHi: 'आयुर्वेदिक त्रिदोष संतुलन एवं संवेदनशील अंग प्रणालियां',
        leadEn: 'The elemental weaknesses inherent in your biological hardware.',
        leadHi: 'वात, पित्त, कफ का संतुलन और वे अंग जो तनाव या गलत दिनचर्या में सबसे पहले प्रभावित होते हैं।',
        paragraphsEn: [
          `Your constitutional makeup reveals a primary vulnerability to ${ascSignEn === 'Aries' || ascSignEn === 'Leo' || ascSignEn === 'Sagittarius' ? 'Pitta (Metabolic heat, inflammation, acidity, hypertension)' : ascSignEn === 'Taurus' || ascSignEn === 'Virgo' || ascSignEn === 'Capricorn' ? 'Vata-Kapha (Digestive sluggishness, joint stiffness, dry skin, metabolic slowing)' : ascSignEn === 'Gemini' || ascSignEn === 'Libra' || ascSignEn === 'Aquarius' ? 'Vata (Nervous exhaustion, irregular sleep, dry cough, anxiety neurosis)' : 'Kapha-Pitta (Fluid retention, respiratory allergies, liver sensitivity)'}.`,
          `Your 6th house falls in ${SIGNS[h6Sign].name} (governed by ${h6Lord}). The most vulnerable organ systems in your body are: (1) Digestion, gut microbiome, and liver efficiency; (2) The nervous system, lower back/spine, and cervical vertebrae; and (3) Eye strain and sleep cycles. Under sustained stress, your body converts psychological anxiety directly into gastrointestinal distress or chronic muscular tension.`,
        ],
        paragraphsHi: [
          `आपकी शारीरिक प्रकृति में त्रिदोष का मुख्य असंतुलन ${ascSignEn === 'Aries' || ascSignEn === 'Leo' || ascSignEn === 'Sagittarius' ? 'पित्त दोष (अम्लता/एसिडिटी, रक्तचाप, यकृत में गर्मी, त्वचा पर जलन)' : ascSignEn === 'Taurus' || ascSignEn === 'Virgo' || ascSignEn === 'Capricorn' ? 'वात-कफ दोष (जोड़ों में दर्द, पाचन का धीमा होना, कब्जियत, आलस्य)' : ascSignEn === 'Gemini' || ascSignEn === 'Libra' || ascSignEn === 'Aquarius' ? 'प्रचंड वात दोष (स्नायु दुर्बलता, अनिद्रा, अत्यधिक चिंता, गैस व मांसपेशियों में खिंचाव)' : 'कफ-पित्त दोष (जल संतुलन, कफ-एलर्जी, लिवर की संवेदनशीलता)'} के रूप में प्रकट होता है।`,
          `षष्ठ भाव (रोग स्थान) '${SIGN_HI[h6Sign]}' में है जिसके स्वामी '${PLANET_HI[h6Lord] || h6Lord}' हैं। आपके शरीर के सर्वाधिक संवेदनशील अंग: (1) पेट, पाचन तंत्र व यकृत; (2) रीढ़ की हड्डी, कमर व गर्दन की नसें; तथा (3) आंखें व मस्तिष्क की स्नायु प्रणाली हैं। जब भी आप अत्यधिक मानसिक तनाव में होते हैं, तो यह तनाव तुरंत पेट की खराबी या मांसपेशियों के अकड़न के रूप में देह पर आक्रमण करता है।`,
        ],
        astrologicalCauseEn: `6th house in ${SIGNS[h6Sign].name} ruled by ${h6Lord}, combined with the placement of Sun (vitality) and Saturn (chronic ailments).`,
        astrologicalCauseHi: `शास्त्रीय कारण: षष्ठेश '${PLANET_HI[h6Lord] || h6Lord}', सूर्य (प्राण शक्ति) एवं शनि (जीर्ण रोग प्रदाता) की स्थिति से शारीरिक दुर्बलताओं का निर्धारण होता है।`,
      },
      {
        titleEn: 'Physical Disability, Limb Impairment (Anga-Bhanga) & Surgery Milestones',
        titleHi: 'अंग-दोष, शारीरिक अक्षमता (विकलांगता) परीक्षण एवं शल्यक्रिया वर्ष',
        leadEn: 'Classical diagnostic of vulnerability to permanent physical impairment, accidents, or acute surgeries.',
        leadHi: '22वें द्रेष्काण व मारक ग्रहों के आधार पर दुर्घटना, शल्यक्रिया व शारीरिक संवेदनशीलता का विश्लेषण।',
        paragraphsEn: [
          `Classical texts (BPHS, Saravali) outline specific Anga-Bhanga Yogas where affliction to the 22nd Drekkana Lord (${twentySecondLord}), 8th lord (${h8Lord}), and Saturn/Mars can induce permanent limb stiffness, surgical intervention, or sensory vulnerability. ${hasAngaBhangaRisk ? 'Your chart indicates moderate vulnerability to physical injuries, particularly to the lower limbs, spine, or head during high-velocity activities or falls. You must exercise strict caution while driving and avoid extreme, uncalculated physical risks.' : 'Your chart is largely protected from congenital physical disability, though accidental trauma to the knees, eyes, or joints requires preventative care.'}`,
          `Critical vulnerability milestones: Ages 19, 28, 37, 46, 55, and 64 represent sensitive astrological junctions when the 8th lord, 22nd Drekkana, or Rahu cycles trigger physical hazard windows. During these specific age milestones, prioritize preventative medical checkups and avoid negligent driving or unnecessary surgical risks.`,
        ],
        paragraphsHi: [
          `महर्षि पाराशर के अनुसार जब 22वें द्रेष्काण के स्वामी (${PLANET_HI[twentySecondLord] || twentySecondLord}), अष्टमेश (${PLANET_HI[h8Lord] || h8Lord}) और शनि/मंगल का संबंध लग्न अथवा त्रिक भावों से बनता है, तो जातक के जीवन में 'अंग-दोष' (Limb Impairment), शल्यक्रिया अथवा दुर्घटना का योग उपस्थित होता है। ${hasAngaBhangaRisk ? 'आपकी कुंडली में कमर से नीचे के अंगों, पैरों, अथवा रीढ़ की हड्डी के प्रति संवेदनशीलता और आकस्मिक चोट/सर्जरी का मध्यम जोखिम दिखाई देता है। वाहन चलाते समय, ऊंचाई पर कार्य करते समय अथवा खेलकूद में अतिरिक्त सावधानी बरतनी अनिवार्य है।' : 'आपकी कुंडली किसी जन्मजात शारीरिक अक्षमता से सुरक्षित है, किंतु आकस्मिक चोट, घुटनों के दर्द या नेत्र-विकार से बचाव हेतु नियमित व्यायाम आवश्यक है।'}`,
          `संकट व शल्यक्रिया के संवेदनशील वर्ष: 19वां, 28वां, 37वां, 46वां, 55वां, और 64वां वर्ष जीवन में स्वास्थ्य व दुर्घटना की दृष्टि से संवेदनशील कालखंड हैं। इन वर्षों में अपने स्वास्थ्य के प्रति रत्ती भर भी लापरवाही न बरतें और नियमित रूप से महामृत्युंजय मंत्र का स्मरण करें।`,
        ],
        astrologicalCauseEn: `22nd Drekkana lord ${twentySecondLord} and 8th lord ${h8Lord} aspecting critical vulnerable zones.`,
        astrologicalCauseHi: `शास्त्रीय कारण: 22वें द्रेष्काण के अधिपति '${PLANET_HI[twentySecondLord] || twentySecondLord}' एवं अष्टमेश '${PLANET_HI[h8Lord] || h8Lord}' का प्रभाव दुर्घटना व शल्यक्रिया के कालखंडों को रेखांकित करता है।`,
      },
      addictionsResult.section,
      litigationResult.section,
      {
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
      },
    ],
    specialData: {
      addictionsAndVices: addictionsResult.data,
      litigationAndAffairs: litigationResult.data,
    },
  });

  // =========================================================================
  // CHAPTER 8: 15 से 75 वर्ष का कालक्रम घटना चक्र (Milestones Timeline)
  // =========================================================================
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
    sections: [
      {
        titleEn: 'Epoch 1 (Ages 15–20): Adolescence, Academic Crossroads & Emotional Confusion',
        titleHi: 'प्रथम पड़ाव (15 से 20 वर्ष): किशोरावस्था, विद्या का द्वंद्व एवं भावुकता का भंवर',
        leadEn: 'The formative years of identity search, parental friction, and academic foundation.',
        leadHi: 'स्वयं की पहचान की खोज, पारिवारिक अपेक्षाओं का दबाव और विद्या-क्षेत्र में भटकाव व संभलना।',
        paragraphsEn: [
          `During this five-year bracket, your intellectual faculties were awakening rapidly, yet your emotional compass felt disoriented. Under the nascent influence of your planetary dasha cycles, you experienced a silent rebellion against rigid authoritarian instruction. Schooling felt constraining, and while you possessed exceptional natural intelligence, your test scores fluctuated depending on your mood and emotional interest.`,
          `You grappled with early romantic daydreams, peer comparisons, and a deep-seated fear of disappointing your parents. A major academic or location choice around age 17–18 laid the initial brick of your career, even though you felt uncertain about whether you had chosen the right path at the time.`,
        ],
        paragraphsHi: [
          `15 से 20 वर्ष की आयु में आपकी बौद्धिक क्षमता का तीव्र विकास हुआ, किंतु मन के भीतर एक गहरा भटकाव और असंतोष बना रहा। इस कालखंड में आपने परिवार और समाज के रूढ़िवादी नियमों के प्रति एक मौन विद्रोह का अनुभव किया। आपकी स्वाभाविक बुद्धि अत्यंत प्रखर थी, किंतु आपकी पढ़ाई मनोदशा (Mood) पर अधिक निर्भर रही—जिस विषय में रुचि थी उसमें अव्वल, और जिसमें अरुचि थी उसमें केवल औपचारिकता निभाई।`,
          `इस अवस्था में पहली बार आकर्षण, मित्रों से तुलना और भविष्य को लेकर अज्ञात भय ने मन को मथा। 17 से 18 वर्ष की आयु के आसपास विद्या अथवा स्थान से जुड़ा एक बड़ा निर्णय हुआ, जिसने आपके भविष्य की नींव रखी, भले ही उस समय आप स्वयं अपने निर्णय के प्रति पूरी तरह आश्वस्त नहीं थे।`,
        ],
        astrologicalCauseEn: `5th house of intellect and 4th house of foundational education influenced by adolescent planetary sub-cycles.`,
        astrologicalCauseHi: `शास्त्रीय कारण: चतुर्थ भाव (मूल विद्या), पंचम भाव (बुद्धि) तथा किशोरावस्था में सक्रिय अंतर्दशाओं का मानसिक स्थिति पर प्रभाव।`,
      },
      {
        titleEn: 'Epoch 2 (Ages 21–25): Independence Search, Career Foundation & Financial Realities',
        titleHi: 'द्वितीय पड़ाव (21 से 25 वर्ष): स्वावलंबन की तलाश, करियर की नींव एवं यथार्थ का आघात',
        leadEn: 'Entering the competitive world, earning your first income, and shedding youthful naivety.',
        leadHi: 'संसार की कठोर प्रतिस्पर्धा में पहला कदम, पहली कमाई और युवावस्था के भ्रमों का टूटना।',
        paragraphsEn: [
          `Entering the workforce between ages 21 and 25 forced an immediate confrontation with practical realities. The idealized visions of success nurtured in college dissolved as you realized that merit alone does not guarantee immediate recognition. You encountered workplace politics, unequal compensation, and the emotional sting of seeing less capable individuals advance through sycophancy.`,
          `Yet, this crucible was essential. You developed grit, learned the value of unyielding punctuality, and earned your first independent livelihood. A serious romantic relationship during this phase either demanded immense emotional sacrifice or ended in painful disillusionment, teaching you lasting lessons about human nature.`,
        ],
        paragraphsHi: [
          `21 से 25 वर्ष का यह कालखंड जातक को संसार के नग्न यथार्थ से परिचित कराता है। कॉलेज के आदर्शवादी स्वप्न टूटते हैं और यह समझ में आता है कि केवल योग्यता ही पर्याप्त नहीं है, बल्कि दुनिया में टिकने के लिए चातुर्य और धैर्य भी आवश्यक है। कार्यक्षेत्र में कम योग्य लोगों को चापलूसी से आगे बढ़ते देखना और स्वयं के परिश्रम का उचित श्रेय न मिलना मन को कचोटता है।`,
          `किंतु इसी भट्ठी में तपकर आपका चरित्र गढ़ा गया। आपने अपने पैरों पर खड़े होकर पहली स्वतंत्र आय अर्जित की। इस कालखंड में प्रेम या भावनात्मक संबंध में या तो भारी त्याग करना पड़ा अथवा गहरा विश्वासघात सहना पड़ा, जिसने आपको इंसान को पहचानने की अचूक दृष्टि दी।`,
        ],
        astrologicalCauseEn: `Activation of 10th house of career and 6th house of competitive service during young adult planetary transitions.`,
        astrologicalCauseHi: `शास्त्रीय कारण: दशम भाव (कर्म) व षष्ठ भाव (प्रतियोगिता/सेवा) की सक्रियता जातक को स्वावलंबन हेतु कठोर संघर्ष में उतारती है।`,
      },
      {
        titleEn: 'Epoch 3 (Ages 26–30): The Crucible Milestone, Marital Foundations & First Major Elevation',
        titleHi: 'तृतीय पड़ाव (26 से 30 वर्ष): जीवन का निर्णायक मोड़, विवाह संस्कार व पहला बड़ा उत्थान',
        leadEn: 'A pivotal chapter marked by domestic consolidation, role transition, and professional breakthrough.',
        leadHi: 'गृहस्थ जीवन में प्रवेश, सामाजिक दायित्वों की वृद्धि और कार्यक्षेत्र में पहला ठोस अधिकार।',
        paragraphsEn: [
          `The 26 to 30 cycle constitutes a master turning point in your life trajectory. During this phase, societal and familial pressure converged on two fronts: marriage and long-term career stabilization. For most natives of this configuration, marriage, serious long-term cohabitation, or a definitive personal partnership materialized during this window, radically altering your daily priorities.`,
          `Professionally, you broke out of the entry-level struggle. Between ages 28 and 30, a decisive project, relocation, or job transition elevated your stature significantly. You began managing responsibility rather than simply executing tasks, cementing your identity as a capable, dependable pillar in both family and profession.`,
        ],
        paragraphsHi: [
          `26 से 30 वर्ष का कालखंड आपके पूरे जीवन का 'केंद्रीय मोड़' साबित होता है। इस पड़ाव पर विवाह, दांपत्य जीवन की शुरुआत अथवा किसी गंभीर दीर्घकालिक साझेदारी का योग फलित होता है। विवाह के साथ ही आपके जीवन की प्राथमिकताएं एकदम बदल जाती हैं और आप पर पारिवारिक उत्तरदायित्वों का भारी बोझ आता है।`,
          `करियर में 28 से 30 वर्ष के मध्य एक बड़ा उछाल आता है। आप सामान्य कर्मचारी के स्तर से ऊपर उठकर निर्णय लेने वाले अथवा महत्वपूर्ण भूमिका में आते हैं। इस काल में आपकी आय में उल्लेखनीय वृद्धि होती है और समाज में आपका एक स्वतंत्र कद स्थापित होना प्रारंभ हो जाता है।`,
        ],
        astrologicalCauseEn: `7th house (partnerships) and 10th house (status) mutual activation in D1 and D9 Navamsha charts.`,
        astrologicalCauseHi: `शास्त्रीय कारण: सप्तम भाव (दांपत्य) तथा दशम भाव (राज्य/प्रतिष्ठा) का नवांश चक्र में एक साथ सक्रिय होना।`,
      },
      {
        titleEn: 'Epoch 4 (Ages 31–35): Family Expansion, Heavy Financial Responsibilities & Relentless Grind',
        titleHi: 'चतुर्थ पड़ाव (31 से 35 वर्ष): संतान सुख, भारी आर्थिक दायित्व एवं निरंतर भागदौड़',
        leadEn: 'Balancing the demands of parenting, home acquisition, and relentless professional maintenance.',
        leadHi: 'संतान के जन्म से जीवन में नया रंग, घर-मकान के लिए भागदौड़ और आर्थिक संतुलन की अग्निपरीक्षा।',
        paragraphsEn: [
          `Ages 31 to 35 represent the most demanding operational phase of your adult life. Progeny milestones, the desire to own or upgrade real estate, and accumulating domestic expenses test your financial resilience daily. Every rupee earned seems pre-allocated to loans, children's schooling, or family obligations.`,
          `At work, you find yourself squeezed between upper management expectations and subordinates' friction. You battle chronic physical fatigue, yet your determination never falters. It is precisely through this sustained grind that your inner authority is forged into solid steel.`,
        ],
        paragraphsHi: [
          `31 से 35 वर्ष का कालखंड जीवन का सबसे व्यस्त और जिम्मेदारियों से लदा हुआ दौर होता है। इस काल में संतान का प्राकट्य, उसके पालन-पोषण का दायित्व, और अपनी निजी छत (घर/फ्लैट) बनाने की तीव्र इच्छा मन पर छाई रहती है। कमाया हुआ अधिकांश धन ईएमआई, बच्चों के खर्चों और पारिवारिक जिम्मेदारियों में निकल जाता है।`,
          `कार्यक्षेत्र में आप पर काम का भारी दबाव रहता है। शारीरिक थकावट के बाद भी आप विश्राम नहीं कर पाते। किंतु यही वह कालखंड है जब आपका संकल्प चट्टान की भांति मजबूत होता है और आप अपने परिवार के लिए एक अटूट ढाल बनकर खड़े रहते हैं।`,
        ],
        astrologicalCauseEn: `5th house of progeny and 4th house of domestic assets under active dasha transit scrutiny.`,
        astrologicalCauseHi: `शास्त्रीय कारण: पंचम भाव (संतान) तथा चतुर्थ भाव (अचल संपत्ति) पर सक्रिय दशाओं का प्रभाव।`,
      },
      {
        titleEn: 'Epoch 5 (Ages 36–40): The Zenith Acceleration — Authority, Leadership & Crucial Realignment',
        titleHi: 'पंचम पड़ाव (36 से 40 वर्ष): उत्कर्ष का शिखर काल, नेतृत्व एवं जीवन का पुनर्गठन',
        leadEn: 'Stepping into peak career authority, navigating mid-life crossroads, and cutting away dead weight.',
        leadHi: 'करियर में सर्वोच्च अधिकार, मध्य-आयु का आत्म-परीक्षण और अनुपयोगी संबंधों की छंटनी।',
        paragraphsEn: [
          `Entering your late thirties unlocks the full mature strength of your birth chart. Between ages 36 and 40, you achieve the professional zenith previewed in Chapter 4. You are no longer asking for permission; you are directing strategy, mentoring others, and commanding respect across your industry or business ecosystem.`,
          `Simultaneously, a profound psychological mid-life course correction takes place. You look around and realize that many people you called friends were merely transactional acquaintances. You ruthlessly cut away shallow social circles, focus on health preservation, and demand uncompromised peace of mind in your domestic space.`,
        ],
        paragraphsHi: [
          `36 से 40 वर्ष की आयु आपके जीवन का वह स्वर्णिम काल है जहां आपके भीतर का नेतृत्व पूर्ण रूप से खिलता है। अब आप किसी के आदेश के मोहताज नहीं रहते; आप स्वयं नीतियां बनाते हैं, दूसरों को दिशा देते हैं और अपने कार्यक्षेत्र में एक स्थापित नाम बन जाते हैं। इस काल में आर्थिक स्थिति अत्यंत सुदृढ़ होती है।`,
          `साथ ही, मन के भीतर एक गहरा 'मध्य-आयु मंथन' (Mid-life introspection) प्रारंभ होता है। आप समझ जाते हैं कि कौन अपना है और कौन केवल स्वार्थ का साथी। आप व्यर्थ की सामाजिकता को त्यागकर अपने चुनिंदा आत्मीय लोगों, स्वास्थ्य और मानसिक शांति को सर्वोच्च प्राथमिकता देने लगते हैं।`,
        ],
        astrologicalCauseEn: `Maturity of Amatyakaraka and peak activation of the 10th and 11th houses in D10 Dashamsha.`,
        astrologicalCauseHi: `शास्त्रीय कारण: अमात्यकारक ग्रह की पूर्ण परिपक्वता तथा दशमांश चक्र के दशम व एकादश भाव का पूर्ण फलीभूत होना।`,
      },
      {
        titleEn: 'Epoch 6 (Ages 41–45): Material Consolidation, Societal Stature & Generational Legacy',
        titleHi: 'छठा पड़ाव (41 से 45 वर्ष): भौतिक संपदा का स्थायित्व, सामाजिक प्रतिष्ठा व कुल-गौरव',
        leadEn: 'Stabilizing wealth, investing in legacy projects, and earning widespread public regard.',
        leadHi: 'संचित धन का सुरक्षित निवेश, कुल की प्रतिष्ठा में वृद्धि और भावी पीढ़ी के लिए मार्ग प्रशस्त करना।',
        paragraphsEn: [
          `Between 41 and 45, the frantic urgency of youth gives way to the dignified assurance of accumulated mastery. You consolidate your material gains, retire legacy debts, and invest in enduring assets. Your advice is sought by extended family and younger peers.`,
          `You also begin thinking deeply about generational legacy: what will you leave behind beyond bank balances? A charitable instinct awakens, prompting you to support educational, religious, or community causes that align with your core values.`,
        ],
        paragraphsHi: [
          `41 से 45 वर्ष की आयु में युवावस्था की अधीरता शांत हो जाती है और उसकी जगह एक गरिमामयी गंभीरता ले लेती है। आप अपने संचित धन को सुरक्षित संपत्तियों में बदलते हैं, पुराने कर्जों से पूरी तरह मुक्त होते हैं, और समाज में एक सम्मानित स्तंभ के रूप में देखे जाते हैं। कुटुंब के लोग आपसे सलाह लेने आते हैं।`,
          `इस अवस्था में आपके भीतर 'विरासत' (Legacy) का विचार गहराता है। आप केवल धन बटोरने के बजाय यह सोचने लगते हैं कि भावी पीढ़ी को क्या संस्कार और मार्गदर्शन देकर जाना है। आपके भीतर दान, समाज-सेवा और धर्म-कर्म की ओर स्वाभाविक रुझान बढ़ता है।`,
        ],
        astrologicalCauseEn: `9th house of Dharma and 2nd house of accumulated legacy activated under benefic dasha support.`,
        astrologicalCauseHi: `शास्त्रीय कारण: नवम भाव (धर्म/भाग्य) तथा द्वितीय भाव (कुल/संचित कोष) का शुभदशा द्वारा पोषण।`,
      },
      {
        titleEn: 'Epoch 7 (Ages 46–50): Physical Vulnerability, Introspection & Health Recalibration',
        titleHi: 'सातवां पड़ाव (46 से 50 वर्ष): शारीरिक संवेदनशीलता, अंतरावलोकन व स्वास्थ्य का घंटा',
        leadEn: 'The body demands maintenance; a critical pause to realign diet, stress, and spiritual priorities.',
        leadHi: 'देह अपने अधिकारों की मांग करती है; खान-पान में संयम, तनाव से मुक्ति और आध्यात्मिक शरण का काल।',
        paragraphsEn: [
          `The 46 to 50 cycle sounds an unambiguous warning regarding physical hardware. The metabolic invincibility of your thirties has passed. Blood pressure, blood sugar, joint mobility, or digestive fatigue demand immediate, non-negotiable lifestyle recalibration. If you ignore these signals, acute medical interventions will enforce rest upon you.`,
          `Spiritually, this is a cleansing fire. You realize the ultimate vanity of worldly rat-races. You begin prioritizing morning walks, quiet contemplation, sacred texts, and deep meditation over late-night networking or stressful business expansions.`,
        ],
        paragraphsHi: [
          `46 से 50 वर्ष का कालखंड स्वास्थ्य की दृष्टि से शरीर का अलार्म बजाता है। जो अनियमित खान-पान और अत्यधिक तनाव आप 30 की उम्र में झेल जाते थे, अब शरीर उसका तुरंत हिसाब मांगने लगता है। रक्तचाप, मधुमेह, पाचन तंत्र अथवा कमर-जोड़ों का दर्द यह चेतावनी देता है कि अब दिनचर्या को अनुशासित करना ही होगा।`,
          `आध्यात्मिक दृष्टि से यह कालखंड मन को निर्मल करता है। संसार की अंधी दौड़ की निरर्थकता समझ में आने लगती है। आप दिखावे और पार्टियों से दूर होकर प्रातःकालीन भ्रमण, ध्यान, धर्मग्रंथों के अध्ययन और एकांत साधना में सच्चा आनंद पाने लगते हैं।`,
        ],
        astrologicalCauseEn: `Transit of Saturn across sensitive natal points and activation of 6th/8th house health indicators.`,
        astrologicalCauseHi: `शास्त्रीय कारण: गोचर में शनि का संवेदनशील बिंदुओं पर भ्रमण तथा षष्ठ/अष्टम भाव के स्वास्थ्य सूचकों की सक्रियता।`,
      },
      {
        titleEn: 'Epoch 8 (Ages 51–55): Children’s Ascension, Matrimonial Milestones & Spiritual Maturation',
        titleHi: 'आठवां पड़ाव (51 से 55 वर्ष): संतान का भाग्योदय, उनके विवाह के दायित्व व आध्यात्मिक परिपक्वता',
        leadEn: 'Witnessing the next generation take flight; fulfilling sacred parental duties with grace.',
        leadHi: 'संतान के करियर व विवाह का सुख, माता-पिता के रूप में कर्तव्यों की पूर्णता और मन का हल्कापन।',
        paragraphsEn: [
          `Between 51 and 55, your focus shifts predominantly toward your progeny. You witness their entry into higher education, career launches, and marital alliances. Fulfilling these heavy parental duties brings immense emotional satisfaction and relief, even though it demands significant capital outflow.`,
          `Your spiritual sadhana matures deeply. The mantra of your Ishta Devata (${ishtaDeityInfo.hi}) becomes a constant inner hum rather than an occasional ritual. You navigate worldly storms with philosophical detachment, knowing that all things arise and pass away according to cosmic law.`,
        ],
        paragraphsHi: [
          `51 से 55 वर्ष की अवस्था में जीवन का केंद्र आपकी संतान बन जाती है। आप अपनी संतानों को अपने पैरों पर खड़े होते, उनकी उच्च शिक्षा, करियर और विवाह के पवित्र बंधनों में बंधते देखते हैं। इन महा-दायित्वों को सफलतापूर्वक पूरा करने से मन पर से एक बहुत बड़ा भार उतर जाता है और अपार आत्म-संतोष मिलता है।`,
          `इस काल में आपकी आध्यात्मिक चेतना अत्यंत परिपक्व हो जाती है। अपने इष्ट देव (${ishtaDeityInfo.hi}) का नाम-जप केवल पूजा कक्ष तक सीमित नहीं रहता, बल्कि श्वास-श्वास में समा जाता है। संसार के उतार-चढ़ावों को आप एक साक्षी भाव से देखने लगते हैं।`,
        ],
        astrologicalCauseEn: `5th house from Lagna and Jupiter (progeny significator) blessings in D7 Saptamsha and D1 charts.`,
        astrologicalCauseHi: `शास्त्रीय कारण: सप्तांश चक्र (D7) तथा लग्न में गुरु देव की कृपा से संतान सुख व कुल-वृद्धि का पूर्ण फल।`,
      },
      {
        titleEn: 'Epoch 9 (Ages 56–60): The Transition from Labor to Elder Statesmanship',
        titleHi: 'नौवां पड़ाव (56 से 60 वर्ष): सक्रिय श्रम से निवृत्ति, मार्गदर्शक की भूमिका व सम्मान',
        leadEn: 'Handing over the operational reins to younger hands; stepping into the revered role of advisor.',
        leadHi: 'दैनिक आपाधापी से धीरे-धीरे पीछे हटना, युवा पीढ़ी को बागडोर सौंपना और कुल के वरिष्ठ मार्गदर्शक बनना।',
        paragraphsEn: [
          `Ages 56 to 60 mark the formal winding down of exhausting daily labor. Whether through corporate retirement or transitioning your business to trusted partners/successors, you step back from operational trenches into the revered role of elder statesman and strategic advisor.`,
          `Your authority does not diminish; it elevates from raw executive power into moral and intellectual reverence. You enjoy the fruits of your lifelong labor, spend quality time with your spouse, and cultivate an atmosphere of harmony in the wider family.`,
        ],
        paragraphsHi: [
          `56 से 60 वर्ष की आयु दैनिक कठोर परिश्रम से विश्राम की ओर बढ़ने का समय है। नौकरी से सम्मानजनक सेवानिवृत्ति अथवा अपने व्यापार का संचालन अगली पीढ़ी या विश्वस्त सहयोगियों को सौंपकर आप एक मार्गदर्शक (Advisor) की भूमिका में आ जाते हैं।`,
          `आपका प्रभाव कम नहीं होता, बल्कि वह पद के प्रभाव से बदलकर 'आदर और सम्मान' में रूपांतरित हो जाता है। आप जीवन भर के संचित अनुभवों का लाभ दूसरों को देते हैं, जीवनसाथी के साथ शांति से समय व्यतीत करते हैं, और परिवार में संतुलन बनाए रखते हैं।`,
        ],
        astrologicalCauseEn: `12th house of disengagement and 9th house of wisdom harmonizing the final career cycle.`,
        astrologicalCauseHi: `शास्त्रीय कारण: द्वादश भाव (निवृत्ति) तथा नवम भाव (ज्ञान व धर्म) का संयुक्त प्रभाव सक्रिय श्रम से मुक्ति देता है।`,
      },
      {
        titleEn: 'Epoch 10 (Ages 61–65): Pilgrimages, Grandparental Bliss & Peaceful Contemplation',
        titleHi: 'दसवां पड़ाव (61 से 65 वर्ष): तीर्थाटन, पौत्र-पौत्री का आनंद एवं शांत चित्त',
        leadEn: 'Travelling to sacred shrines, delighting in young grandchildren, and living with unburdened ease.',
        leadHi: 'पवित्र तीर्थों की यात्रा, नाती-पोतों की किलकारियों से भरा घर और ऋण-मुक्त, शांत जीवन।',
        paragraphsEn: [
          `The 61 to 65 bracket brings deep domestic warmth and spiritual wanderlust. You undertake extended pilgrimages to sacred rivers, mountain temples, and spiritual communities, washing away remnants of accumulated worldly grime. The laughter of grandchildren brings unconditional joy, softening past regrets.`,
          `Financial security is well-established through your past prudence. You live simply, eat clean satvik meals, and guard your mental serenity fiercely against domestic gossip or unnecessary squabbles.`,
        ],
        paragraphsHi: [
          `61 से 65 वर्ष का यह पड़ाव जातक के जीवन में असीम शांति और तीर्थाटन का आनंद लेकर आता है। आप गंगा, नर्मदा, काशी अथवा चार धाम जैसे पवित्र तीर्थों की यात्राएं करते हैं, जिससे मन निर्मल और कृतार्थ होता है। घर में पौत्र-पौत्रियों (नाती-पोतों) का सुख जीवन में नए प्राण फूंक देता है।`,
          `आपकी आर्थिक स्थिति पूरी तरह आत्मनिर्भर और सुरक्षित रहती है। आप सात्विक, संयमित दिनचर्या अपनाते हैं और व्यर्थ के सांसारिक विवादों से अपने चित्त को सर्वथा दूर रखते हैं।`,
        ],
        astrologicalCauseEn: `Jupiter transiting auspicious natal coordinates, blessing the 9th and 5th houses of merit and lineage.`,
        astrologicalCauseHi: `शास्त्रीय कारण: गुरु देव का शुभ गोचर प्रभाव नवम (तीर्थ) व पंचम (वंश/पौत्र) को पूर्ण आनंद से सिंचित करता है।`,
      },
      {
        titleEn: 'Epoch 11 (Ages 66–70): Detachment, Spiritual Sadhana & The Transmission of Wisdom',
        titleHi: 'ग्यारहवां पड़ाव (66 से 70 वर्ष): वैराग्य, गहन साधना एवं ज्ञान का संप्रेषण',
        leadEn: 'Deep inner meditation, shedding material attachments, and blessing the younger generation.',
        leadHi: 'संसार के प्रति अनासक्ति, ध्यान की गहराई और अपनी संचित विद्या व ज्ञान को योग्य पात्रों को सौंपना।',
        paragraphsEn: [
          `Between 66 and 70, the veil between the material world and the subtle realm thins noticeably. Material desires dissolve into natural Vairagya (healthy detachment). You are no longer attached to wealth or social applause; your true wealth is the purity of your consciousness.`,
          `Younger family members look upon you as a living patriarch/matriarch whose blessings possess protective power. Your daily hours are spent in silent meditation, sacred chants, and radiating benevolent goodwill toward all beings.`,
        ],
        paragraphsHi: [
          `66 से 70 वर्ष की आयु में जातक के भीतर एक स्वाभाविक 'वैराग्य' का उदय होता है। संसार की धन-दौलत, मान-प्रतिष्ठा की लालसा पूरी तरह समाप्त हो जाती है। आप किसी से कोई अपेक्षा नहीं रखते; आपका वास्तविक धन आपकी अंतरात्मा की शांति होती है।`,
          `परिवार और समाज में आपको एक ऋषि-तुल्य वंदनीय स्थान प्राप्त होता है। आपका अधिकांश समय ध्यान, जप, और स्वाध्याय में बीतता है। आपके मुख से निकले आशीर्वाद दूसरों के लिए रक्षा-कवच का कार्य करते हैं।`,
        ],
        astrologicalCauseEn: `12th house Moksha karaka Ketu and Jupiter aligning the consciousness toward transcendental realms.`,
        astrologicalCauseHi: `शास्त्रीय कारण: मोक्ष कारक केतु व देवगुरु बृहस्पति की दृष्टि जीवात्मा को परा-चेतना से जोड़ती है।`,
      },
      {
        titleEn: 'Epoch 12 (Ages 71–75): Closure of Earthly Accounts, Serene Surrender & Moksha Readiness',
        titleHi: 'बारहवां पड़ाव (71 से 75 वर्ष): सांसारिक लेखा-जोखा पूर्ण, शांत समर्पण व मोक्ष की तैयारी',
        leadEn: 'Complete fulfillment of earthly obligations; resting in sublime peace with a clean karmic ledger.',
        leadHi: 'प्रारब्ध के सभी ऋणों की सम्यक चुकौती, जीवन के प्रति कृतज्ञता और परमात्मा में लीन होने की परम शांति।',
        paragraphsEn: [
          `The 71 to 75 epoch represents the sublime culmination of this earthly incarnation. You look back upon your 70+ years with deep contentment, recognizing that every trial was a masterclass in soul evolution and every triumph was divine grace. All significant karmic debts have been reconciled.`,
          `You hold no grudges, carry no unresolved enmities, and fear neither sickness nor death. Resting in surrender at the feet of your Ishta Devata (${ishtaDeityInfo.hi}), your soul is fully prepared for a luminous transition when the final call arrives, ready for higher celestial realms or ultimate liberation.`,
        ],
        paragraphsHi: [
          `71 से 75 वर्ष का कालखंड इस जन्म के महा-अध्याय की गौरवमयी पूर्णता है। आप अपने बीते हुए जीवन पर जब दृष्टि डालते हैं, तो मन में कोई पछतावा या怨 (शिकायत) शेष नहीं रहती। आप अनुभव करते हैं कि प्रत्येक कष्ट ने आपकी चेतना को मांजा था और प्रत्येक सुख ईश्वर की अहैतुकी कृपा थी।`,
          `आपके चित्त में किसी के प्रति कोई द्वेष नहीं रहता। अपने इष्ट देव (${ishtaDeityInfo.hi}) के चरणों में पूर्ण समर्पण के साथ, आपकी आत्मा एक पवित्र, निर्भय और शांत अवस्था में स्थित रहती है—भवबंधन से मुक्त होकर आगामी दिव्य लोकों की ओर प्रयाण हेतु पूर्णतः तत्पर।`,
        ],
        astrologicalCauseEn: `Final harmonic integration of 1st, 5th, 9th (Dharma Trikona) and 4th, 8th, 12th (Moksha Trikona) houses.`,
        astrologicalCauseHi: `शास्त्रीय कारण: धर्म त्रिकोण (1, 5, 9) तथा मोक्ष त्रिकोण (4, 8, 12) का पूर्ण सामंजस्य जीवात्मा को मुक्ति मार्ग पर अग्रसर करता है।`,
      },
    ],
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
  // CHAPTER 10: लाल किताब टेवा, प्रारब्ध ऋण व अचूक आचरण-सुधार उपाय
  // =========================================================================
  const sleepingHouses = lalKitab?.sleepingHouses.filter((h) => h.isSleeping) ?? [];
  const activeDebts = lalKitab?.karmicDebts.filter((d) => d.isTriggered) ?? [];

  chapters.push({
    chapterNumber: 10,
    id: 'chapter10_lalkitab_remedies',
    titleEn: 'Chapter 10: Lal Kitab Tewa, Ancestral Debts & Actionable Conduct Remedies',
    titleHi: 'अध्याय 10: लाल किताब टेवा, प्रारब्ध ऋण व अचूक आचरण-सुधार उपाय',
    subtitleEn: 'Aries-Fixed Kundali Placements, Sleeping Houses & Awakening Rituals, Ancestral Debts (Rin) & Ethical Daily Remedies',
    subtitleHi: 'मेष लग्न के स्थायी भावों में ग्रहों का फल, सोए हुए घर व उन्हें जगाने की विधि, पैतृक ऋण निदान व आचरण सुधार उपाय',
    icon: 'book-open',
    summaryQuoteEn: 'True remedy is never a gemstone purchased with coins; it is the radical correction of one’s daily conduct toward the living creation.',
    summaryQuoteHi: 'सच्चा उपाय कभी धन से खरीदा गया रत्न नहीं होता; सच्चा उपाय तो ईश्वर की सजीव सृष्टि और अपनों के प्रति अपने आचरण का निर्मल सुधार है।',
    sections: [
      {
        titleEn: 'Lal Kitab Tewa: Sleeping Houses & Awakening Protocols',
        titleHi: 'लाल किताब टेवा: सोए हुए घर एवं उन्हें जगाने की अचूक विधि',
        leadEn: 'Understanding dormant houses in the fixed Aries matrix and how to activate their dormant luck.',
        leadHi: 'लाल किताब के अनुसार कौन से भाव निष्क्रिय (सोए हुए) हैं और उन्हें सक्रिय करने का शास्त्रीय नियम क्या है।',
        paragraphsEn: [
          `In the Lal Kitab tradition, the zodiac is mapped permanently with Aries in House 1, Taurus in House 2, continuing to Pisces in House 12. A house containing no planet and receiving no direct planetary gaze is classified as a 'Soya Ghar' (Dormant/Sleeping House). Its blessings remain frozen until awakened through specific ethical conduct.`,
          `In your Lal Kitab Tewa, the primary sleeping houses are: ${sleepingHouses.map((h) => `House ${h.houseNumber} (Ruler: ${h.pakkaGharRuler})`).join(', ') || 'House 2 and House 9'}. To awaken a sleeping house, classical Lal Kitab mandates introducing the element of the ruling lord through lifestyle habits. For instance, sleeping House 2 is awakened by respecting elders and eating with family; sleeping House 9 is awakened by visiting ancestral shrines and honoring traditional preceptors; sleeping House 10 is awakened by fair dealings with daily-wage laborers.`,
        ],
        paragraphsHi: [
          `लाल किताब की विद्या में संपूर्ण जन्म चक्र को मेष लग्न (प्रथम भाव = मेष, द्वितीय = वृषभ... द्वादश = मीन) के अनुसार स्थायी भाव मानकर देखा जाता है। जिस भाव में कोई ग्रह न बैठा हो और न ही उस पर किसी ग्रह की दृष्टि हो, उसे 'सोया हुआ घर' (Dormant House) कहा जाता है। ऐसे भाव का शुभ फल तब तक रुका रहता है जब तक कि उसे शास्त्रीय विधि से जगाया न जाए।`,
          `आपके लाल किताब टेवे में मुख्य सोए हुए घर: ${sleepingHouses.map((h) => `भाव संख्या ${h.houseNumber} (पक्का स्वामी: ${h.pakkaGharRulerHi})`).join(', ') || 'भाव 2 (धन) व भाव 9 (भाग्य)'} हैं। सोए हुए घर को जगाने का नियम यह है कि उस भाव के स्वामी ग्रह के कारक तत्वों को आचरण में लाया जाए। उदाहरणार्थ: भाव 2 को जगाने हेतु परिवार के साथ प्रेमपूर्वक भोजन करना व कुल बड़ों का सम्मान करना; भाव 9 को जगाने हेतु कुल-देवता के स्थान पर शीश झुकाना व ब्राह्मणों/गुरुओं का आदर करना; भाव 10 को जगाने हेतु श्रमिकों व सहायकों को उनका पारिश्रमिक समय पर बिना विवाद देना।`,
        ],
        astrologicalCauseEn: `Computed via Lal Kitab fixed-house rules (Aries Ascendant base) and vacant house inspection.`,
        astrologicalCauseHi: `शास्त्रीय कारण: लाल किताब के स्थायी मेष चक्र में रिक्त व दृष्टिहीन भावों की अवस्थिति द्वारा प्रमाणित।`,
      },
      {
        titleEn: 'Ancestral Karmic Debts (Lal Kitab Rin Diagnostics) & Symptoms',
        titleHi: 'पैतृक ऋण निदान (Pitru, Matru, Stri, Swa Rin) एवं जीवन में उनके लक्षण',
        leadEn: 'Diagnosing hereditary karmic encumbrances carried across paternal and maternal lineages.',
        leadHi: 'पूर्वजों द्वारा अनजाने में किए गए अपराधों का ऋण जो वर्तमान जीवन में अकारण बाधाएं उत्पन्न करता है।',
        paragraphsEn: [
          `Lal Kitab identifies deep ancestral debts (Rin) that afflict individuals without their direct fault. Based on planetary afflictions in your chart: ${activeDebts.length > 0 ? activeDebts.map((d) => `${d.debtType} (${d.classicalCauseEn})`).join('; ') : 'No heavy ancestral debt is active; your chart enjoys clean ancestral blessings with minor Swa-Rin (Self-Debt) requiring spiritual discipline'}.`,
          `Symptoms of these subtle debts in daily life include: unexplained delays at the final stage of negotiations, sudden mechanical or electrical failures in the home right before celebrations, recurring disputes with maternal uncles or elder brothers, and feelings of exhaustion inside certain rooms of your dwelling.`,
        ],
        paragraphsHi: [
          `लाल किताब में पैतृक ऋणों का अत्यंत सूक्ष्म विवेचन है। यह वे ऋण हैं जो पूर्वजों द्वारा किसी के साथ किए गए अन्याय, वादे के उल्लंघन अथवा अनादर के कारण वंशजों के जीवन में अप्रत्याशित अवरोध लाते हैं। आपकी कुंडली के अनुसार: ${activeDebts.length > 0 ? activeDebts.map((d) => `'${d.debtTypeHi}' (${d.classicalCauseHi}) सक्रिय दिखाई देता है`).join('; ') : 'कुंडली में कोई भारी पितृ या मातृ ऋण नहीं है; आपके कुल का आशीर्वाद आपके साथ है, केवल स्व-ऋण (आलस्य व वचन टालना) के निवारण हेतु संकल्पबद्धता आवश्यक है'}।`,
          `इन ऋणों के जीवन में प्रकट लक्षण: शुभ कार्यों के ठीक पहले घर में अचानक तनाव या क्लेश उत्पन्न होना, बनते हुए काम का अंतिम क्षण में अटक जाना, घर के किसी कोने में सीलन या अंधकार का अनुभव होना, और बिना कारण मन पर एक अज्ञात उदासी का छा जाना।`,
        ],
        astrologicalCauseEn: `Afflictions between Jupiter/Sun (Pitru Rin), Moon/4th house (Matru Rin), Venus (Stri Rin), and Mars/Saturn (Bhai/Zalim Rin).`,
        astrologicalCauseHi: `शास्त्रीय कारण: सूर्य-गुरु (पितृ ऋण), चंद्र-चतुर्थ भाव (मातृ ऋण), शुक्र (स्त्री ऋण) तथा शनि-मंगल (निर्दयी/बंधु ऋण) के शास्त्रीय योग।`,
      },
      {
        titleEn: 'Actionable Lifestyle & Conduct Remedies (No Costly Gemstones)',
        titleHi: 'अचूक आचरण-सुधार एवं व्यावहारिक उपाय (किसी महंगे रत्न या आडंबर के बिना)',
        leadEn: 'Profound, ethical, and behavior-based corrections that directly dissolve karmic blockages.',
        leadHi: 'दैनिक जीवन में छोटे-छोटे आचरण परिवर्तन जो बिना एक रुपया खर्च किए ग्रहों के विष को अमृत में बदल देते हैं।',
        paragraphsEn: [
          `1. Water Sanctity (Purifying Moon): Never waste drinking water. Always finish the water poured in your glass, offer fresh water to guests immediately upon arrival, and ensure no taps leak in your home. This directly stabilizes your emotional core and finances.`,
          `2. Elder Respect (Activating Sun & Jupiter): Touch the feet of your parents or elder family members before setting out for critical endeavors. Speak to them with reverence; their genuine blessing acts as an impenetrable shield against career setbacks.`,
          `3. Speech & Truth (Soothing Mercury & Rahu): Strictly abstain from false promises, exaggerated boasts, or sarcastic mockery of the vulnerable. Feed green grass or soaked whole moong dal to cows or street cattle on Wednesdays.`,
          `4. Compassion to Laborers & Animals (Pleasing Saturn & Ketu): Treat domestic helpers, security guards, and daily-wage workers with dignity; pay them fairly and offer tea/sweets on Saturdays. Feed street dogs with fresh roti or milk; dogs are the living vehicle of Lord Bhairava and absorb severe malefic currents.`,
          `5. Sanctity of Character (Elevating Venus): Respect all women in thought, word, and deed. Maintain impeccable personal hygiene, wear clean and lightly fragranced attire, and avoid clutter or broken glass inside your living space.`,
        ],
        paragraphsHi: [
          `1. जल की पवित्रता (चंद्र देव की शुद्धि): घर में पीने के पानी का कभी अपव्यय न करें। गिलास में जितना जल लें उतना पूरा पिएं, घर आए अतिथि को सर्वप्रथम शीतल जल दें, और घर का कोई भी नल टपकता न रहे। इससे मन की शांति और संचित धन का रिसाव तुरंत थमता है।`,
          `2. बड़ों का चरण स्पर्श (सूर्य व गुरु का जागरण): घर से किसी भी महत्वपूर्ण कार्य के लिए निकलते समय माता-पिता अथवा घर के वरिष्ठजनों के चरण स्पर्श कर आशीर्वाद लें। उनकी प्रसन्नता से करियर के बड़े-बड़े अवरोध स्वतः समाप्त हो जाते हैं।`,
          `3. वाणी का संयम व सत्य (बुध व राहु का संतुलन): किसी से झूठा वादा न करें, पीठ पीछे किसी की निंदा न करें, और असहाय व्यक्ति का उपहास न उड़ाएं। बुधवार के दिन गाय को हरा चारा अथवा भीगी हुई मूंग की दाल खिलाएं।`,
          `4. श्रमिकों व जीवों पर दया (शनि व केतु की शांति): घर के सफाईकर्मियों, चौकीदारों और मजदूरों को कभी दुत्कारें नहीं; उन्हें समय पर उनका हक दें और शनिवार को कुछ मीठा या चाय पिलाएं। गली के काले अथवा भूरे कुत्तों को नित्य मीठी रोटी या दूध दें; कुत्ते काल भैरव के वाहन हैं जो आपके संकटों को स्वयं पर ले लेते हैं।`,
          `5. चरित्र की शुद्धि (शुक्र देव का आशीर्वाद): पराई स्त्री/पुरुष के प्रति मन में पूर्ण पवित्रता रखें। घर को सुगंधित रखें, फटे-पुराने या गंदे वस्त्र न पहनें, और घर में कभी कबाड़ या टूटे हुए कांच-बर्तन एकत्र न होने दें।`,
        ],
        astrologicalCauseEn: `Lal Kitab ethical conduct protocols designed to pacify the 9 planetary vibrations through natural service to nature and humanity.`,
        astrologicalCauseHi: `शास्त्रीय कारण: लाल किताब के मौलिक सिद्धांत जो प्रकृति, जीव-जंतुओं और मानवीय संबंधों के सुधार द्वारा नवग्रहों की क्रूर रश्मियों को शांत करते हैं।`,
      },
    ],
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
