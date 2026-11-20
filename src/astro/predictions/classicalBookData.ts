/**
 * Classical Book Knowledge Base & Exact Classical Predictions Engine
 * Derived rigorously from the 296-Page Standard Classical Textbook (AIFAS / Bharatiya Vidya Bhavan)
 * Covering:
 * - Chapter 3: 12 Signs Auspicious & Inauspicious Milestone Years, Physical traits, Vulnerabilities & Careers
 * - Chapter 7: 36 Drekkanas Iconography, Classifications (Ayudha, Sarpa, Nigada, Pasha etc.), and 22nd Drekkana Karma
 * - Chapter 8: 108 Planetary House Combinations (Sun to Ketu across Houses 1 to 12) with Exact Age Milestones,
 *              Sign Modifiers, Aspect Modifiers, and Dedicated "स्त्री जातक (In Female Horoscope)" Sutras
 * - Chapter 10: Gulika / Mandi in 12 Houses
 * - Chapter 12: Gochara (Transits from Natal Moon) for 9 Grahas across 12 Houses
 *
 * AV Astro Vibe — Strictly No Emojis, 1-Second Math Precision Guarantee
 */

import type { NineGrahaId } from '../types';

export interface SignMilestonesRecord {
  signIndex: number;
  nameEn: string;
  nameHi: string;
  auspiciousYears: number[];
  inauspiciousYears: number[];
  physicalFeaturesEn: string;
  physicalFeaturesHi: string;
  generalTraitsEn: string;
  generalTraitsHi: string;
  vulnerabilitiesEn: string;
  vulnerabilitiesHi: string;
  careerFitEn: string;
  careerFitHi: string;
}

export interface AgeMilestone {
  age: number;
  nature: 'favorable' | 'challenging' | 'career' | 'health';
  eventEn: string;
  eventHi: string;
}

export interface SignModifier {
  en: string;
  hi: string;
}

export interface AspectModifier {
  graha: string;
  conditionEn: string;
  conditionHi: string;
  effectEn: string;
  effectHi: string;
}

export interface PlanetHouseBookRecord {
  planet: NineGrahaId | string;
  planetHi: string;
  house: number;
  titleEn: string;
  titleHi: string;
  baseEn: string;
  baseHi: string;
  ageMilestones: AgeMilestone[];
  signModifiers: Record<string, SignModifier>;
  aspectModifiers: AspectModifier[];
  femaleHoroscope: {
    en: string;
    hi: string;
  };
}

export type DrekkanaClass =
  | 'Ayudha'
  | 'Sarpa'
  | 'Nigada'
  | 'Pakshi'
  | 'Chatuspada'
  | 'Varaha'
  | 'Pasha'
  | 'Saumya';

export interface DrekkanaBookRecord {
  signIndex: number;
  drekkanaNumber: 1 | 2 | 3;
  degRange: string;
  classification: DrekkanaClass;
  classificationHi: string;
  nameEn: string;
  nameHi: string;
  rulingPlanet: string;
  rulingPlanetHi: string;
  symbolEn: string;
  symbolHi: string;
  karmicOutcomeEn: string;
  karmicOutcomeHi: string;
  isMarakaSensitive: boolean;
}

export interface GocharaBookRecord {
  planet: NineGrahaId | string;
  planetHi: string;
  houseFromMoon: number;
  isFavorable: boolean;
  vedhaHouse?: number;
  summaryEn: string;
  summaryHi: string;
  detailedEn: string;
  detailedHi: string;
}

export interface GulikaHouseRecord {
  house: number;
  titleEn: string;
  titleHi: string;
  effectEn: string;
  effectHi: string;
}

export const SIGN_YEARS_MILESTONES: SignMilestonesRecord[] = [
  {
    "signIndex": 0,
    "nameEn": "Aries",
    "nameHi": "मेष",
    "auspiciousYears": [
      16,
      20,
      28,
      34,
      41,
      45,
      53
    ],
    "inauspiciousYears": [
      6,
      8,
      15,
      21,
      36,
      40,
      56,
      63
    ],
    "physicalFeaturesEn": "Middle stature, lean and muscular physique, elongated neck, ruddy or fiery complexion, sharp gaze, prominent eyebrows.",
    "physicalFeaturesHi": "मध्यम कद, गठीला व मांसल शरीर, लम्बी गर्दन, गौर-रक्त वर्ण, तीक्ष्ण दृष्टि, उन्नत भौहें व ललाट पर विशिष्ट चिह्न।",
    "generalTraitsEn": "Pioneering spirit, quick temper, extreme courage, independent initiative, ambition to lead, dislikes subordination.",
    "generalTraitsHi": "अग्रणी स्वभाव, त्वरित क्रोध, अदम्य साहस, स्वतंत्र निर्णय क्षमता, नेतृत्व की प्रबल लालसा, पराधीनता से तीव्र अरुचि।",
    "vulnerabilitiesEn": "Headaches, migraines, brain fevers, eye ailments, burns, sharp weapon injuries, blood pressure fluctuations.",
    "vulnerabilitiesHi": "शिरोवेदना, माइग्रेन, ज्वर, नेत्र विकार, अग्नि व शस्त्र भय, रक्तचाप में तीव्र उतार-चढ़ाव।",
    "careerFitEn": "Defense forces, police, surgery, engineering, metals, leadership, athletics, real estate, entrepreneurship.",
    "careerFitHi": "रक्षा सेवाएं, पुलिस, शल्य चिकित्सा (सर्जरी), इंजीनियरिंग, धातु उद्योग, प्रशासनिक नेतृत्व, खेलकूद, भू-संपत्ति।"
  },
  {
    "signIndex": 1,
    "nameEn": "Taurus",
    "nameHi": "वृषभ",
    "auspiciousYears": [
      17,
      21,
      24,
      33,
      42,
      51
    ],
    "inauspiciousYears": [
      1,
      8,
      16,
      23,
      28,
      36,
      46,
      54
    ],
    "physicalFeaturesEn": "Broad chest, sturdy thick neck, handsome face, dark curly or wavy hair, steady confident gait.",
    "physicalFeaturesHi": "विशाल वक्षस्थल, दृढ़ व पुष्ट ग्रीवा, आकर्षक मुखमंडल, काले घुंघराले बाल, संतुलित व गंभीर चाल।",
    "generalTraitsEn": "Patience, endurance, aesthetic taste, love for luxury and comfort, stubbornness once committed, prudent financier.",
    "generalTraitsHi": "अगाध धैर्य, सहनशीलता, कलात्मक सुरुचि, ऐश्वर्य व सुखप्रियता, दृढ़ हठधर्मिता, कुशल वित्त प्रबंधक।",
    "vulnerabilitiesEn": "Throat infections, tonsillitis, thyroid imbalances, stiff neck, respiratory sensitivity.",
    "vulnerabilitiesHi": "कंठ रोग, टॉन्सिल, थायरॉइड असंतुलन, ग्रीवा स्तंभ, श्वास नलिका में विकार।",
    "careerFitEn": "Banking, finance, fine arts, music, luxury goods, hospitality, cosmetics, agriculture, real estate.",
    "careerFitHi": "बैंकिंग, वित्त प्रबंधन, ललित कला, संगीत, विलासिता वस्तुएं, होटल व आतिथ्य, सौंदर्य प्रसाधन, कृषि।"
  },
  {
    "signIndex": 2,
    "nameEn": "Gemini",
    "nameHi": "मिथुन",
    "auspiciousYears": [
      15,
      22,
      32,
      35,
      42,
      45,
      54
    ],
    "inauspiciousYears": [
      2,
      10,
      16,
      24,
      30,
      33,
      43,
      53
    ],
    "physicalFeaturesEn": "Tall and slender, straight posture, long arms and fingers, expressive eyes, brisk walk.",
    "physicalFeaturesHi": "दीर्घ व छरहरा कद, सीधा शारीरिक ढांचा, लम्बी भुजाएं व अंगुलियां, चंचल व विचारशील आंखें, तीव्र गति।",
    "generalTraitsEn": "Versatile intellect, brilliant communication, wit, humor, dual mindset, literary skill, curious researcher.",
    "generalTraitsHi": "बहुमुखी प्रतिभा, अद्भुत वाकपटुता, हास्य-विनोद, द्वैत मानसिक प्रकृति, उत्कृष्ट लेखन शैली, जिज्ञासु शोधक।",
    "vulnerabilitiesEn": "Lungs, bronchitis, asthma, nervous tension, anxiety, arm/shoulder fractures.",
    "vulnerabilitiesHi": "फेफड़े, ब्रोंकाइटिस, दमा, स्नायु दुर्बलता, मानसिक उद्वेग, कंधे व बाहु में चोट का जोखिम।",
    "careerFitEn": "Media, journalism, writing, IT, communications, trade, mathematics, publishing, translation.",
    "careerFitHi": "मीडिया, पत्रकारिता, लेखन, सूचना प्रौद्योगिकी (IT), जनसंचार, वाणिज्य, गणित, प्रकाशन व अनुवाद।"
  },
  {
    "signIndex": 3,
    "nameEn": "Cancer",
    "nameHi": "कर्क",
    "auspiciousYears": [
      16,
      21,
      29,
      32,
      38,
      43,
      51,
      61
    ],
    "inauspiciousYears": [
      5,
      12,
      19,
      25,
      34,
      44,
      52
    ],
    "physicalFeaturesEn": "Round face, pale or soft complexion, gentle emotive eyes, moderate stature, prominent chest.",
    "physicalFeaturesHi": "गोल मुखाकृति, कोमल व स्निग्ध वर्ण, भावुक सौम्य आंखें, मध्यम कद, उन्नत वक्षस्थल।",
    "generalTraitsEn": "Deep emotional sensitivity, maternal nurturing instincts, attached to roots and home, fertile imagination, retentive memory.",
    "generalTraitsHi": "अत्यंत संवेदनशील हृदय, मातृवत पोषण वृत्ति, गृह व कुल के प्रति अगाध लगाव, उर्वर कल्पनाशीलता, तीव्र स्मरण शक्ति।",
    "vulnerabilitiesEn": "Stomach ailments, weak digestion, water retention, chest congestion, emotional depression.",
    "vulnerabilitiesHi": "आमाशय व जठराग्नि दुर्बलता, जलजनित विकार, कफ व वक्ष में जकड़न, अवसाद व चिंता।",
    "careerFitEn": "Medicine, nursing, psychology, hospitality, dairy, marine trade, real estate, public welfare.",
    "careerFitHi": "चिकित्सा, नर्सिंग, मनोविज्ञान, आतिथ्य, दुग्ध उद्योग, जल व नौवहन व्यापार, भू-संपत्ति, समाज सेवा।"
  },
  {
    "signIndex": 4,
    "nameEn": "Leo",
    "nameHi": "सिंह",
    "auspiciousYears": [
      19,
      21,
      28,
      35,
      42,
      48,
      56
    ],
    "inauspiciousYears": [
      3,
      10,
      13,
      23,
      31,
      41,
      49,
      58
    ],
    "physicalFeaturesEn": "Broad majestic shoulders, large forehead, commanding golden or ruddy complexion, lion-like regal stride.",
    "physicalFeaturesHi": "विशाल सिंहवत कंधे, चौड़ा ललाट, तेजस्वी आभायुक्त मुखमंडल, गरिमामयी राजसी चाल।",
    "generalTraitsEn": "Regal authority, magnanimity, dignified pride, born leader, protective of dependents, intolerance of disrespect.",
    "generalTraitsHi": "राजसी प्रभुत्व, उदार हृदय, स्वाभिमान, जन्मजात नेतृत्व, आश्रितों के प्रति दयालु, अपमान के प्रति शून्य सहनशीलता।",
    "vulnerabilitiesEn": "Cardiovascular heart issues, spine problems, high fever, palpitations, eyesight sensitivity.",
    "vulnerabilitiesHi": "हृदय विकार, रीढ़ की हड्डी में तनाव, तीव्र पित्त ज्वर, धड़कन बढ़ना, दृष्टि संवेदनशीलता।",
    "careerFitEn": "Government administration, politics, corporate executives, gold/jewelry, defense command, cinema, judiciary.",
    "careerFitHi": "प्रशासनिक सेवाएं, राजनीति, उच्च कॉर्पोरेट नेतृत्व, स्वर्ण व आभूषण, रक्षा कमान, सिनेमा, न्यायपालिका।"
  },
  {
    "signIndex": 5,
    "nameEn": "Virgo",
    "nameHi": "कन्या",
    "auspiciousYears": [
      18,
      22,
      25,
      32,
      36,
      42,
      49,
      57
    ],
    "inauspiciousYears": [
      4,
      9,
      17,
      24,
      33,
      44,
      53
    ],
    "physicalFeaturesEn": "Slender graceful build, youthful appearance, sharp analytical eyes, quiet modest gait.",
    "physicalFeaturesHi": "छरहरा व सुरुचिपूर्ण शरीर, चिर-युवा मुखाकृति, तीक्ष्ण विश्लेषणात्मक दृष्टि, शांत व नम्र चाल।",
    "generalTraitsEn": "Perfectionist, meticulous detail orientation, analytical precision, critical reasoning, practical pragmatism.",
    "generalTraitsHi": "पूर्णतावादी (परफेक्शनिस्ट), सूक्ष्म विवेचना में दक्ष, तर्कशील बुद्धि, आलोचनात्मक दृष्टि, व्यावहारिक यथार्थवाद।",
    "vulnerabilitiesEn": "Intestinal digestive issues, bowel irregularity, appendix, nervous exhaustion, skin allergies.",
    "vulnerabilitiesHi": "आंतों के विकार, जठरांत्र दुर्बलता, अपेंडिक्स, स्नायु तनाव, त्वचा में संवेदनशीलता।",
    "careerFitEn": "Auditing, accounting, data science, software development, healthcare, research, editorial, law.",
    "careerFitHi": "ऑडिटिंग, चार्टर्ड अकाउंटेंसी, डेटा साइंस, सॉफ्टवेयर विकास, चिकित्सा शोध, संपादन, विधिक सलाहकार।"
  },
  {
    "signIndex": 6,
    "nameEn": "Libra",
    "nameHi": "तुला",
    "auspiciousYears": [
      15,
      20,
      24,
      31,
      38,
      43,
      52,
      60
    ],
    "inauspiciousYears": [
      6,
      8,
      14,
      23,
      29,
      35,
      42,
      58
    ],
    "physicalFeaturesEn": "Symmetrical pleasing facial features, charming smile, refined body structure, balanced graceful presence.",
    "physicalFeaturesHi": "सममित व मनभावन मुखाकृति, सम्मोहक मुस्कान, परिष्कृत शारीरिक गठन, संतुलित व शालीन उपस्थिति।",
    "generalTraitsEn": "Diplomatic mediator, lover of justice and equilibrium, refined aesthetic sense, courteous, partnership oriented.",
    "generalTraitsHi": "कुशल राजनयिक, न्याय व संतुलन का पक्षधर, उच्च कलात्मक अभिरुचि, शिष्ट व्यवहार, साझेदारी में सफल।",
    "vulnerabilitiesEn": "Kidneys, urinary tract disorders, lower back lumbar pain, hormonal imbalance, skin eczema.",
    "vulnerabilitiesHi": "वृक्क (गुर्दे) विकार, मूत्र संस्थान की समस्याएं, कटि प्रदेश (लोअर बैक) में पीड़ा, हार्मोनल असंतुलन।",
    "careerFitEn": "Judiciary, diplomacy, public relations, fashion design, luxury commerce, interior decor, legal arbitration.",
    "careerFitHi": "न्यायपालिका, कूटनीति, जनसंपर्क, फैशन डिजाइन, विलासिता व्यापार, इंटीरियर डेकोरेशन, मध्यस्थता।"
  },
  {
    "signIndex": 7,
    "nameEn": "Scorpio",
    "nameHi": "वृश्चिक",
    "auspiciousYears": [
      18,
      21,
      28,
      34,
      40,
      47,
      55
    ],
    "inauspiciousYears": [
      1,
      9,
      13,
      22,
      27,
      36,
      45,
      54,
      62
    ],
    "physicalFeaturesEn": "Piercing hypnotic eyes, sturdy muscular frame, broad chest, resolute determined posture.",
    "physicalFeaturesHi": "सम्मोहक व तीक्ष्ण भेदक आंखें, गठीला व सुदृढ़ शरीर, चौड़ा वक्ष, दृढ़ निश्चयी भावभंगिमा।",
    "generalTraitsEn": "Intense willpower, secretive demeanor, deep occult and investigative intuition, unyielding resilience, loyal ally but ruthless foe.",
    "generalTraitsHi": "प्रचंड इच्छाशक्ति, रहस्यमयी प्रकृति, गूढ़ विद्याओं व जांच-पड़ताल में दक्ष, अटूट सहनशीलता, पक्के मित्र किंतु दुर्जेय शत्रु।",
    "vulnerabilitiesEn": "Reproductive organs, piles/fistula, urinary bladder, surgical risks, toxic infections.",
    "vulnerabilitiesHi": "जननेंद्रिय विकार, बवासीर, मूत्राशय रोग, शल्य चिकित्सा (सर्जरी) का जोखिम, रक्त विकार।",
    "careerFitEn": "Scientific research, surgery, intelligence agencies, defense, mining, petroleum, occult, insurance.",
    "careerFitHi": "वैज्ञानिक शोध, शल्य चिकित्सा, गुप्तचर संस्थाएं, रक्षा कमान, खनन व पेट्रोलियम, ज्योतिष/गूढ़ तंत्र, बीमा।"
  },
  {
    "signIndex": 8,
    "nameEn": "Sagittarius",
    "nameHi": "धनु",
    "auspiciousYears": [
      16,
      22,
      27,
      31,
      38,
      45,
      52,
      61
    ],
    "inauspiciousYears": [
      2,
      10,
      18,
      23,
      30,
      37,
      43,
      50,
      59
    ],
    "physicalFeaturesEn": "Tall athletic stature, elongated noble face, high intellectual forehead, bright clear eyes, brisk stride.",
    "physicalFeaturesHi": "दीर्घ व खिलाड़ी जैसा शारीरिक गठन, लम्बा मुखमंडल, विशाल ललाट, ओजस्वी व निर्मल आंखें, द्रुत गति।",
    "generalTraitsEn": "Philosophical optimism, righteousness, love for truth and freedom, lifelong learner, spiritual guide, sports enthusiast.",
    "generalTraitsHi": "दार्शनिक आशावाद, धर्मपरायणता, सत्य व स्वतंत्रता के प्रति निष्ठा, ज्ञान पिपासु, आध्यात्मिक मार्गदर्शक।",
    "vulnerabilitiesEn": "Liver ailments, hips and thighs stiffness, arterial circulation, sports injuries, gout.",
    "vulnerabilitiesHi": "यकृत (लीवर) विकार, नितंब व जंघाओं में पीड़ा, धमनी परिसंचरण, खेलकूद की चोटें, वात रोग।",
    "careerFitEn": "Higher education, jurisprudence, philosophy, publishing, international travel, banking, spiritual teaching.",
    "careerFitHi": "उच्च शिक्षा, न्यायशास्त्र, दर्शन, प्रकाशन, अंतरराष्ट्रीय पर्यटन व संबंध, बैंकिंग, आध्यात्मिक शिक्षण।"
  },
  {
    "signIndex": 9,
    "nameEn": "Capricorn",
    "nameHi": "मकर",
    "auspiciousYears": [
      19,
      21,
      25,
      33,
      41,
      50,
      59
    ],
    "inauspiciousYears": [
      5,
      13,
      17,
      24,
      29,
      37,
      44,
      53,
      60
    ],
    "physicalFeaturesEn": "Lean body frame, prominent bones and joints, serious composed countenance, dark hair, methodical gait.",
    "physicalFeaturesHi": "कृश व सुदृढ़ काया, सुस्पष्ट अस्थि व संधियां (जोड़), गंभीर व संयमित मुखाकृति, सांवले बाल, नपी-तुली चाल।",
    "generalTraitsEn": "Enduring perseverance, ambition, organizational discipline, relentless hard worker, pragmatic realism, slow but steady triumph.",
    "generalTraitsHi": "अथक कर्मठता, महत्वाकांक्षा, अनुशासित संगठन क्षमता, यथार्थवादी दृष्टि, विलंब से किंतु स्थाई व अचल सफलता।",
    "vulnerabilitiesEn": "Bones, knees, joints, arthritis, dry skin eczema, dental problems, hypothermia.",
    "vulnerabilitiesHi": "अस्थि रोग, घुटने व संधिशूल (गठिया), त्वचा का रूखापन, दंत विकार, वात जनित पीड़ा।",
    "careerFitEn": "Civil engineering, heavy industries, mining, state bureaucracy, construction, infrastructure, agriculture.",
    "careerFitHi": "सिविल इंजीनियरिंग, भारी उद्योग, खनन, राजकीय नौकरशाही, निर्माण व इंफ्रास्ट्रक्चर, कृषि प्रशासन।"
  },
  {
    "signIndex": 10,
    "nameEn": "Aquarius",
    "nameHi": "कुंभ",
    "auspiciousYears": [
      20,
      24,
      29,
      34,
      41,
      47,
      56
    ],
    "inauspiciousYears": [
      7,
      14,
      22,
      28,
      32,
      40,
      48,
      55
    ],
    "physicalFeaturesEn": "Middle to tall height, broad intellectual forehead, magnetic eccentric eyes, reflective composed presence.",
    "physicalFeaturesHi": "मध्यम से ऊंचा कद, उन्नत बौद्धिक ललाट, विचारमग्न व सम्मोहक आंखें, शांत व विशिष्ट उपस्थिति।",
    "generalTraitsEn": "Humanitarian visionary, unconventional thinker, scientific acumen, loyal to egalitarian causes, detests dogma.",
    "generalTraitsHi": "मानवतावादी दूरदृष्टा, लीक से हटकर सोचने वाला, वैज्ञानिक दृष्टिकोण, समानता व बंधुत्व का पक्षधर, रूढ़ियों का विरोधी।",
    "vulnerabilitiesEn": "Ankles, calves, blood circulation, varicose veins, nervous tension, heart palpitations.",
    "vulnerabilitiesHi": "टखने व पिंडलियां, रक्त परिसंचरण में अवरोध, वेरिकोज वेंस, स्नायु उद्वेग, हृदय धड़कन असंतुलन।",
    "careerFitEn": "Science, high-tech electronics, aerospace, research, astrology, social reform, sociology, innovation.",
    "careerFitHi": "वैज्ञानिक शोध, उच्च तकनीकी इलेक्ट्रॉनिक्स, अंतरिक्ष विज्ञान, ज्योतिष/खगोल, समाज सुधार, नवाचार।"
  },
  {
    "signIndex": 11,
    "nameEn": "Pisces",
    "nameHi": "मीन",
    "auspiciousYears": [
      16,
      21,
      27,
      33,
      40,
      49,
      58
    ],
    "inauspiciousYears": [
      8,
      12,
      17,
      26,
      31,
      39,
      46,
      52,
      61
    ],
    "physicalFeaturesEn": "Soft fleshed body, large dreamy expressive eyes, pale silky hair, gentle undulating quiet presence.",
    "physicalFeaturesHi": "कोमल व मांसल शरीर, विशाल स्वप्निल व भावपूर्ण आंखें, स्निग्ध बाल, शांत व लहरदार सौम्य चाल।",
    "generalTraitsEn": "Compassionate mystic, fertile spiritual imagination, selfless sacrifice, highly intuitive, artistic sensitivity.",
    "generalTraitsHi": "करुणामयी रहस्यवादी, आध्यात्मिक कल्पनाशीलता, निस्वार्थ त्याग, अद्भुत अंतःप्रेरणा, उच्च कलात्मक संवेदना।",
    "vulnerabilitiesEn": "Feet, lymphatic system, immune deficiencies, addiction tendencies, mucus congestion, allergies.",
    "vulnerabilitiesHi": "पाद (चरण) विकार, लसिका ग्रंथि दोष, रोग प्रतिरोधक क्षमता का ह्रास, कफ विकार, औषधीय संवेदनशीलता।",
    "careerFitEn": "Spirituality, psychology, maritime navigation, charitable institutions, fine arts, cinema, holistic healing.",
    "careerFitHi": "अध्यात्म, मनोविज्ञान, नौवहन व समुद्र व्यापार, धर्मार्थ संस्थान, ललित कला, सिनेमा, प्राकृतिक चिकित्सा।"
  }
];

export const DREKKANA_36_CORPUS: DrekkanaBookRecord[] = [
  {
    "signIndex": 0,
    "drekkanaNumber": 1,
    "degRange": "0° - 10°",
    "classification": "Ayudha",
    "classificationHi": "आयुध",
    "nameEn": "Armed Warrior",
    "nameHi": "शस्त्रधारी योद्धा",
    "rulingPlanet": "Mars",
    "rulingPlanetHi": "मंगल",
    "symbolEn": "Man holding axe and armor",
    "symbolHi": "Man holding axe and armor",
    "karmicOutcomeEn": "Fierce competitive drive, danger of head wounds or weapon cuts.",
    "karmicOutcomeHi": "Fierce competitive drive, danger of head wounds or weapon cuts.",
    "isMarakaSensitive": false
  },
  {
    "signIndex": 0,
    "drekkanaNumber": 2,
    "degRange": "10° - 20°",
    "classification": "Chatuspada",
    "classificationHi": "चतुष्पाद",
    "nameEn": "Quadruped Maiden",
    "nameHi": "चतुष्पाद स्त्री",
    "rulingPlanet": "Sun",
    "rulingPlanetHi": "सूर्य",
    "symbolEn": "Woman in red robes with quadruped traits",
    "symbolHi": "Woman in red robes with quadruped traits",
    "karmicOutcomeEn": "Tenacity through heavy physical labor, gains through agriculture or land.",
    "karmicOutcomeHi": "Tenacity through heavy physical labor, gains through agriculture or land.",
    "isMarakaSensitive": false
  },
  {
    "signIndex": 0,
    "drekkanaNumber": 3,
    "degRange": "20° - 30°",
    "classification": "Ayudha",
    "classificationHi": "आयुध",
    "nameEn": "Armed Guardian",
    "nameHi": "आयुध रक्षक",
    "rulingPlanet": "Jupiter",
    "rulingPlanetHi": "बृहस्पति",
    "symbolEn": "Man with stick and shield guarding threshold",
    "symbolHi": "Man with stick and shield guarding threshold",
    "karmicOutcomeEn": "Protector of righteous causes, involvement in administrative/legal disputes.",
    "karmicOutcomeHi": "Protector of righteous causes, involvement in administrative/legal disputes.",
    "isMarakaSensitive": false
  },
  {
    "signIndex": 1,
    "drekkanaNumber": 1,
    "degRange": "0° - 10°",
    "classification": "Chatuspada",
    "classificationHi": "चतुष्पाद/पाश",
    "nameEn": "Entangling Nymph",
    "nameHi": "पाशधारिणी तरुणी",
    "rulingPlanet": "Venus",
    "rulingPlanetHi": "शुक्र",
    "symbolEn": "Woman with curled hair holding binding rope",
    "symbolHi": "Woman with curled hair holding binding rope",
    "karmicOutcomeEn": "Strong emotional bonds, risk of legal or financial entanglements.",
    "karmicOutcomeHi": "Strong emotional bonds, risk of legal or financial entanglements.",
    "isMarakaSensitive": false
  },
  {
    "signIndex": 1,
    "drekkanaNumber": 2,
    "degRange": "10° - 20°",
    "classification": "Ayudha",
    "classificationHi": "आयुध",
    "nameEn": "Artisan Warrior",
    "nameHi": "शिल्पकार योद्धा",
    "rulingPlanet": "Mercury",
    "rulingPlanetHi": "बुध",
    "symbolEn": "Man holding farming implement and chisel",
    "symbolHi": "Man holding farming implement and chisel",
    "karmicOutcomeEn": "Skill in craftsmanship, agriculture, engineering and precision tools.",
    "karmicOutcomeHi": "Skill in craftsmanship, agriculture, engineering and precision tools.",
    "isMarakaSensitive": false
  },
  {
    "signIndex": 1,
    "drekkanaNumber": 3,
    "degRange": "20° - 30°",
    "classification": "Chatuspada",
    "classificationHi": "चतुष्पाद",
    "nameEn": "Mighty Elephantine",
    "nameHi": "गजकाय चतुष्पाद",
    "rulingPlanet": "Saturn",
    "rulingPlanetHi": "शनि",
    "symbolEn": "Large framed man with steady heavy gait",
    "symbolHi": "Large framed man with steady heavy gait",
    "karmicOutcomeEn": "Unyielding endurance, slow monumental accumulation, joint vulnerabilities.",
    "karmicOutcomeHi": "Unyielding endurance, slow monumental accumulation, joint vulnerabilities.",
    "isMarakaSensitive": false
  },
  {
    "signIndex": 2,
    "drekkanaNumber": 1,
    "degRange": "0° - 10°",
    "classification": "Saumya",
    "classificationHi": "सौम्य/कलात्मक",
    "nameEn": "Graceful Seamstress",
    "nameHi": "कला प्रवीण युवती",
    "rulingPlanet": "Mercury",
    "rulingPlanetHi": "बुध",
    "symbolEn": "Beautiful woman holding needle and decorative cloth",
    "symbolHi": "Beautiful woman holding needle and decorative cloth",
    "karmicOutcomeEn": "Intellectual brilliance, literary and aesthetic acclaim, youthful spirit.",
    "karmicOutcomeHi": "Intellectual brilliance, literary and aesthetic acclaim, youthful spirit.",
    "isMarakaSensitive": false
  },
  {
    "signIndex": 2,
    "drekkanaNumber": 2,
    "degRange": "10° - 20°",
    "classification": "Pakshi",
    "classificationHi": "पक्षी/आकाशचारी",
    "nameEn": "Wandering Archer",
    "nameHi": "विहंग धनुर्धर",
    "rulingPlanet": "Venus",
    "rulingPlanetHi": "शुक्र",
    "symbolEn": "Man holding bow with bird wings",
    "symbolHi": "Man holding bow with bird wings",
    "karmicOutcomeEn": "Restless mind, extensive journeys, sports and aerial pursuits.",
    "karmicOutcomeHi": "Restless mind, extensive journeys, sports and aerial pursuits.",
    "isMarakaSensitive": false
  },
  {
    "signIndex": 2,
    "drekkanaNumber": 3,
    "degRange": "20° - 30°",
    "classification": "Ayudha",
    "classificationHi": "आयुध",
    "nameEn": "Adorned Marksman",
    "nameHi": "सशस्त्र शिल्पी",
    "rulingPlanet": "Saturn",
    "rulingPlanetHi": "शनि",
    "symbolEn": "Man with quiver and mechanical instruments",
    "symbolHi": "Man with quiver and mechanical instruments",
    "karmicOutcomeEn": "Technological inventiveness, research fortitude, precision crafts.",
    "karmicOutcomeHi": "Technological inventiveness, research fortitude, precision crafts.",
    "isMarakaSensitive": false
  },
  {
    "signIndex": 3,
    "drekkanaNumber": 1,
    "degRange": "0° - 10°",
    "classification": "Chatuspada",
    "classificationHi": "चतुष्पाद",
    "nameEn": "Fruit-bearing Quadruped",
    "nameHi": "फल-पुष्प वाहक",
    "rulingPlanet": "Moon",
    "rulingPlanetHi": "चन्द्रमा",
    "symbolEn": "Man holding lotus and fruit with crab posture",
    "symbolHi": "Man holding lotus and fruit with crab posture",
    "karmicOutcomeEn": "Nurturing domestic wealth, dairy and water-based prosperity.",
    "karmicOutcomeHi": "Nurturing domestic wealth, dairy and water-based prosperity.",
    "isMarakaSensitive": false
  },
  {
    "signIndex": 3,
    "drekkanaNumber": 2,
    "degRange": "10° - 20°",
    "classification": "Sarpa",
    "classificationHi": "सर्प (विषैला)",
    "nameEn": "Serpentine Maiden",
    "nameHi": "सर्प वेष्टिता कन्या",
    "rulingPlanet": "Mars",
    "rulingPlanetHi": "मंगल",
    "symbolEn": "Woman holding lotus encircled by deadly snakes",
    "symbolHi": "Woman holding lotus encircled by deadly snakes",
    "karmicOutcomeEn": "Toxic family rivalries, jealousy from peers, venomous speech or poisoning risks.",
    "karmicOutcomeHi": "Toxic family rivalries, jealousy from peers, venomous speech or poisoning risks.",
    "isMarakaSensitive": true
  },
  {
    "signIndex": 3,
    "drekkanaNumber": 3,
    "degRange": "20° - 30°",
    "classification": "Sarpa",
    "classificationHi": "सर्प (जलचर)",
    "nameEn": "Oceanic Serpent Rider",
    "nameHi": "जलीय सर्प नाविक",
    "rulingPlanet": "Jupiter",
    "rulingPlanetHi": "बृहस्पति",
    "symbolEn": "Man surrounded by coiled serpents on a boat",
    "symbolHi": "Man surrounded by coiled serpents on a boat",
    "karmicOutcomeEn": "Water journey hazards, deep esoteric awakenings, legacy through turbulence.",
    "karmicOutcomeHi": "Water journey hazards, deep esoteric awakenings, legacy through turbulence.",
    "isMarakaSensitive": true
  },
  {
    "signIndex": 4,
    "drekkanaNumber": 1,
    "degRange": "0° - 10°",
    "classification": "Ayudha",
    "classificationHi": "आयुध (उग्र)",
    "nameEn": "Vulture-faced Sovereign",
    "nameHi": "गृध्रमुख शस्त्रधारी",
    "rulingPlanet": "Sun",
    "rulingPlanetHi": "सूर्य",
    "symbolEn": "Fierce man holding broadsword and shield",
    "symbolHi": "Fierce man holding broadsword and shield",
    "karmicOutcomeEn": "Commanding regal authority, merciless against rivals, cardiac vigilance.",
    "karmicOutcomeHi": "Commanding regal authority, merciless against rivals, cardiac vigilance.",
    "isMarakaSensitive": false
  },
  {
    "signIndex": 4,
    "drekkanaNumber": 2,
    "degRange": "10° - 20°",
    "classification": "Pakshi",
    "classificationHi": "पक्षी",
    "nameEn": "Swift Falconer",
    "nameHi": "विहंग अश्वारोही",
    "rulingPlanet": "Jupiter",
    "rulingPlanetHi": "बृहस्पति",
    "symbolEn": "Man on horse holding falcon and bow",
    "symbolHi": "Man on horse holding falcon and bow",
    "karmicOutcomeEn": "Philosophical expeditions, daring ventures, expansive vision.",
    "karmicOutcomeHi": "Philosophical expeditions, daring ventures, expansive vision.",
    "isMarakaSensitive": false
  },
  {
    "signIndex": 4,
    "drekkanaNumber": 3,
    "degRange": "20° - 30°",
    "classification": "Chatuspada",
    "classificationHi": "चतुष्पाद/आयुध",
    "nameEn": "Bear-faced Titan",
    "nameHi": "ऋक्षमुख गदाधर",
    "rulingPlanet": "Mars",
    "rulingPlanetHi": "मंगल",
    "symbolEn": "Muscular man holding iron mace",
    "symbolHi": "Muscular man holding iron mace",
    "karmicOutcomeEn": "Physical force, execution of heavy state duties, muscular endurance.",
    "karmicOutcomeHi": "Physical force, execution of heavy state duties, muscular endurance.",
    "isMarakaSensitive": false
  },
  {
    "signIndex": 5,
    "drekkanaNumber": 1,
    "degRange": "0° - 10°",
    "classification": "Saumya",
    "classificationHi": "सौम्य (पवित्र)",
    "nameEn": "Pure Flower Carrier",
    "nameHi": "पुष्पपात्र धारिणी कन्या",
    "rulingPlanet": "Mercury",
    "rulingPlanetHi": "बुध",
    "symbolEn": "Modest maiden carrying vessel of fresh blossoms",
    "symbolHi": "Modest maiden carrying vessel of fresh blossoms",
    "karmicOutcomeEn": "Scholarly distinction, financial auditing, pure moral character.",
    "karmicOutcomeHi": "Scholarly distinction, financial auditing, pure moral character.",
    "isMarakaSensitive": false
  },
  {
    "signIndex": 5,
    "drekkanaNumber": 2,
    "degRange": "10° - 20°",
    "classification": "Ayudha",
    "classificationHi": "आयुध/गणना",
    "nameEn": "Armed Scribe",
    "nameHi": "सशस्त्र गणनाकार",
    "rulingPlanet": "Saturn",
    "rulingPlanetHi": "शनि",
    "symbolEn": "Dark man holding stylus and defensive dagger",
    "symbolHi": "Dark man holding stylus and defensive dagger",
    "karmicOutcomeEn": "Critical analysis, investigative auditing, legal disputes over accounts.",
    "karmicOutcomeHi": "Critical analysis, investigative auditing, legal disputes over accounts.",
    "isMarakaSensitive": false
  },
  {
    "signIndex": 5,
    "drekkanaNumber": 3,
    "degRange": "20° - 30°",
    "classification": "Saumya",
    "classificationHi": "सौम्य",
    "nameEn": "Devout Priestess",
    "nameHi": "श्वेतवस्त्रा तपस्विनी",
    "rulingPlanet": "Venus",
    "rulingPlanetHi": "शुक्र",
    "symbolEn": "Fair woman draped in silk holding scripture",
    "symbolHi": "Fair woman draped in silk holding scripture",
    "karmicOutcomeEn": "Artistic and religious patronage, noble marriages, philanthropic wealth.",
    "karmicOutcomeHi": "Artistic and religious patronage, noble marriages, philanthropic wealth.",
    "isMarakaSensitive": false
  },
  {
    "signIndex": 6,
    "drekkanaNumber": 1,
    "degRange": "0° - 10°",
    "classification": "Ayudha",
    "classificationHi": "आयुध/तराजू",
    "nameEn": "Balanced Arbiter",
    "nameHi": "तुला-खड्ग धर",
    "rulingPlanet": "Venus",
    "rulingPlanetHi": "शुक्र",
    "symbolEn": "Man holding scales in one hand and sword in other",
    "symbolHi": "Man holding scales in one hand and sword in other",
    "karmicOutcomeEn": "Commercial justice, fair trade contracts, legal arbitrations.",
    "karmicOutcomeHi": "Commercial justice, fair trade contracts, legal arbitrations.",
    "isMarakaSensitive": false
  },
  {
    "signIndex": 6,
    "drekkanaNumber": 2,
    "degRange": "10° - 20°",
    "classification": "Pakshi",
    "classificationHi": "पक्षी",
    "nameEn": "Vulture-headed Seeker",
    "nameHi": "गृध्रमुख प्रवासी",
    "rulingPlanet": "Saturn",
    "rulingPlanetHi": "शनि",
    "symbolEn": "Man with avian features holding water urn",
    "symbolHi": "Man with avian features holding water urn",
    "karmicOutcomeEn": "Restless travel, thirst for knowledge, ambitious career shifts.",
    "karmicOutcomeHi": "Restless travel, thirst for knowledge, ambitious career shifts.",
    "isMarakaSensitive": false
  },
  {
    "signIndex": 6,
    "drekkanaNumber": 3,
    "degRange": "20° - 30°",
    "classification": "Saumya",
    "classificationHi": "सौम्य/चतुष्पाद",
    "nameEn": "Bejeweled Herdsman",
    "nameHi": "रत्नमंडित गोपाल",
    "rulingPlanet": "Mercury",
    "rulingPlanetHi": "बुध",
    "symbolEn": "Youth adorned with ornaments tending cattle",
    "symbolHi": "Youth adorned with ornaments tending cattle",
    "karmicOutcomeEn": "Prosperous partnerships, luxury cattle/vehicle trade, diplomatic charm.",
    "karmicOutcomeHi": "Prosperous partnerships, luxury cattle/vehicle trade, diplomatic charm.",
    "isMarakaSensitive": false
  },
  {
    "signIndex": 7,
    "drekkanaNumber": 1,
    "degRange": "0° - 10°",
    "classification": "Sarpa",
    "classificationHi": "सर्प/पाश (अति उग्र)",
    "nameEn": "Envenomed Sorceress",
    "nameHi": "नागपाश धारिणी",
    "rulingPlanet": "Mars",
    "rulingPlanetHi": "मंगल",
    "symbolEn": "Naked woman entangled with deadly vipers",
    "symbolHi": "Naked woman entangled with deadly vipers",
    "karmicOutcomeEn": "Severe karmic trials, risk of criminal/legal penalty (Pasha), surgery or poison.",
    "karmicOutcomeHi": "Severe karmic trials, risk of criminal/legal penalty (Pasha), surgery or poison.",
    "isMarakaSensitive": true
  },
  {
    "signIndex": 7,
    "drekkanaNumber": 2,
    "degRange": "10° - 20°",
    "classification": "Sarpa",
    "classificationHi": "सर्प/कच्छप",
    "nameEn": "Tortoise Mystic",
    "nameHi": "कच्छप सर्प योगी",
    "rulingPlanet": "Jupiter",
    "rulingPlanetHi": "बृहस्पति",
    "symbolEn": "Man with tortoise shield encircled by cobras",
    "symbolHi": "Man with tortoise shield encircled by cobras",
    "karmicOutcomeEn": "Hidden traps, profound occult mastery through prolonged suffering.",
    "karmicOutcomeHi": "Hidden traps, profound occult mastery through prolonged suffering.",
    "isMarakaSensitive": true
  },
  {
    "signIndex": 7,
    "drekkanaNumber": 3,
    "degRange": "20° - 30°",
    "classification": "Ayudha",
    "classificationHi": "आयुध/सिंहमुख",
    "nameEn": "Leonine Punisher",
    "nameHi": "सिंहमुख दंडाधिकारी",
    "rulingPlanet": "Moon",
    "rulingPlanetHi": "चन्द्रमा",
    "symbolEn": "Man with ferocious feline face wielding spiked club",
    "symbolHi": "Man with ferocious feline face wielding spiked club",
    "karmicOutcomeEn": "Secret intelligence, surgery, uncompromising resurgence from defeat.",
    "karmicOutcomeHi": "Secret intelligence, surgery, uncompromising resurgence from defeat.",
    "isMarakaSensitive": true
  },
  {
    "signIndex": 8,
    "drekkanaNumber": 1,
    "degRange": "0° - 10°",
    "classification": "Ayudha",
    "classificationHi": "आयुध/अश्वमुख",
    "nameEn": "Centaur Archer",
    "nameHi": "अश्वमुख धनुर्धर",
    "rulingPlanet": "Jupiter",
    "rulingPlanetHi": "बृहस्पति",
    "symbolEn": "Human torso on noble stallion drawing bow",
    "symbolHi": "Human torso on noble stallion drawing bow",
    "karmicOutcomeEn": "Righteous battle, defense of dharma, intellectual mastery, athletic vigor.",
    "karmicOutcomeHi": "Righteous battle, defense of dharma, intellectual mastery, athletic vigor.",
    "isMarakaSensitive": false
  },
  {
    "signIndex": 8,
    "drekkanaNumber": 2,
    "degRange": "10° - 20°",
    "classification": "Chatuspada",
    "classificationHi": "चतुष्पाद/वराह",
    "nameEn": "Trident Bearer",
    "nameHi": "त्रिशूलधारिणी वीरांगना",
    "rulingPlanet": "Mars",
    "rulingPlanetHi": "मंगल",
    "symbolEn": "Golden-skinned woman holding burning trident",
    "symbolHi": "Golden-skinned woman holding burning trident",
    "karmicOutcomeEn": "Dauntless exploration, pioneering courage, defense leadership.",
    "karmicOutcomeHi": "Dauntless exploration, pioneering courage, defense leadership.",
    "isMarakaSensitive": false
  },
  {
    "signIndex": 8,
    "drekkanaNumber": 3,
    "degRange": "20° - 30°",
    "classification": "Ayudha",
    "classificationHi": "आयुध/संन्यासी",
    "nameEn": "Bearded Sage",
    "nameHi": "दण्डधारी महर्षि",
    "rulingPlanet": "Sun",
    "rulingPlanetHi": "सूर्य",
    "symbolEn": "Tall venerable ascetic holding staff and mace",
    "symbolHi": "Tall venerable ascetic holding staff and mace",
    "karmicOutcomeEn": "Judicial supreme counsel, temple endowment, spiritual sovereignty.",
    "karmicOutcomeHi": "Judicial supreme counsel, temple endowment, spiritual sovereignty.",
    "isMarakaSensitive": false
  },
  {
    "signIndex": 9,
    "drekkanaNumber": 1,
    "degRange": "0° - 10°",
    "classification": "Nigada",
    "classificationHi": "निगड़/पाश (बंधन)",
    "nameEn": "Chained Captive",
    "nameHi": "शृंखला-बद्ध बंदी",
    "rulingPlanet": "Saturn",
    "rulingPlanetHi": "शनि",
    "symbolEn": "Hairy man bound with iron chains and noose",
    "symbolHi": "Hairy man bound with iron chains and noose",
    "karmicOutcomeEn": "Severe karmic imprisonment, legal confinements, heavy trials before liberation.",
    "karmicOutcomeHi": "Severe karmic imprisonment, legal confinements, heavy trials before liberation.",
    "isMarakaSensitive": true
  },
  {
    "signIndex": 9,
    "drekkanaNumber": 2,
    "degRange": "10° - 20°",
    "classification": "Chatuspada",
    "classificationHi": "चतुष्पाद",
    "nameEn": "Master Stonemason",
    "nameHi": "शिल्पकार कुंभकार",
    "rulingPlanet": "Venus",
    "rulingPlanetHi": "शुक्र",
    "symbolEn": "Robust artisan shaping stone and clay vessels",
    "symbolHi": "Robust artisan shaping stone and clay vessels",
    "karmicOutcomeEn": "Monumental architecture, infrastructure wealth, persistent craftsmanship.",
    "karmicOutcomeHi": "Monumental architecture, infrastructure wealth, persistent craftsmanship.",
    "isMarakaSensitive": false
  },
  {
    "signIndex": 9,
    "drekkanaNumber": 3,
    "degRange": "20° - 30°",
    "classification": "Ayudha",
    "classificationHi": "आयुध",
    "nameEn": "Armored Centurion",
    "nameHi": "कवचधारी सेनानी",
    "rulingPlanet": "Mercury",
    "rulingPlanetHi": "बुध",
    "symbolEn": "Man wearing heavy mail armor holding javelin",
    "symbolHi": "Man wearing heavy mail armor holding javelin",
    "karmicOutcomeEn": "Strategic warfare, massive corporate organization, victory through discipline.",
    "karmicOutcomeHi": "Strategic warfare, massive corporate organization, victory through discipline.",
    "isMarakaSensitive": false
  },
  {
    "signIndex": 10,
    "drekkanaNumber": 1,
    "degRange": "0° - 10°",
    "classification": "Pakshi",
    "classificationHi": "पक्षी",
    "nameEn": "Avian Philosopher",
    "nameHi": "विहंग अन्वेषक",
    "rulingPlanet": "Saturn",
    "rulingPlanetHi": "शनि",
    "symbolEn": "Vulture-like scholar carrying urn of nectar",
    "symbolHi": "Vulture-like scholar carrying urn of nectar",
    "karmicOutcomeEn": "Breakthrough inventions, unconventional wisdom, aviation/research gains.",
    "karmicOutcomeHi": "Breakthrough inventions, unconventional wisdom, aviation/research gains.",
    "isMarakaSensitive": false
  },
  {
    "signIndex": 10,
    "drekkanaNumber": 2,
    "degRange": "10° - 20°",
    "classification": "Saumya",
    "classificationHi": "सौम्य/रथ",
    "nameEn": "Chariot Healer",
    "nameHi": "रथारूढ़ उपचारक",
    "rulingPlanet": "Mercury",
    "rulingPlanetHi": "बुध",
    "symbolEn": "Woman in copper chariot holding medicinal containers",
    "symbolHi": "Woman in copper chariot holding medicinal containers",
    "karmicOutcomeEn": "Technological healing, social reform, humanitarian philanthropy.",
    "karmicOutcomeHi": "Technological healing, social reform, humanitarian philanthropy.",
    "isMarakaSensitive": false
  },
  {
    "signIndex": 10,
    "drekkanaNumber": 3,
    "degRange": "20° - 30°",
    "classification": "Saumya",
    "classificationHi": "सौम्य/मणिधारी",
    "nameEn": "Crowned Alchemist",
    "nameHi": "मुकुटधारी रसवैद्य",
    "rulingPlanet": "Venus",
    "rulingPlanetHi": "शुक्र",
    "symbolEn": "Crowned man holding healing herbs and bright gems",
    "symbolHi": "Crowned man holding healing herbs and bright gems",
    "karmicOutcomeEn": "Occult mastery, chemical/pharmaceutical triumphs, spiritual wealth.",
    "karmicOutcomeHi": "Occult mastery, chemical/pharmaceutical triumphs, spiritual wealth.",
    "isMarakaSensitive": false
  },
  {
    "signIndex": 11,
    "drekkanaNumber": 1,
    "degRange": "0° - 10°",
    "classification": "Saumya",
    "classificationHi": "सौम्य/यज्ञ",
    "nameEn": "Pearl Priest",
    "nameHi": "मुक्ता-यज्ञ पुरोहित",
    "rulingPlanet": "Jupiter",
    "rulingPlanetHi": "बृहस्पति",
    "symbolEn": "Venerable sage holding sacrificial ladle and pearls",
    "symbolHi": "Venerable sage holding sacrificial ladle and pearls",
    "karmicOutcomeEn": "Spiritual liberation (Moksha), oceanic wealth, temple consecrations.",
    "karmicOutcomeHi": "Spiritual liberation (Moksha), oceanic wealth, temple consecrations.",
    "isMarakaSensitive": false
  },
  {
    "signIndex": 11,
    "drekkanaNumber": 2,
    "degRange": "10° - 20°",
    "classification": "Saumya",
    "classificationHi": "सौम्य/नौका",
    "nameEn": "Naval Maiden",
    "nameHi": "नौकारूढ़ा सुंदरी",
    "rulingPlanet": "Moon",
    "rulingPlanetHi": "चन्द्रमा",
    "symbolEn": "Serene maiden on ocean galley holding bright flags",
    "symbolHi": "Serene maiden on ocean galley holding bright flags",
    "karmicOutcomeEn": "Foreign settlements, artistic pilgrimages, peaceful prosperous voyage.",
    "karmicOutcomeHi": "Foreign settlements, artistic pilgrimages, peaceful prosperous voyage.",
    "isMarakaSensitive": false
  },
  {
    "signIndex": 11,
    "drekkanaNumber": 3,
    "degRange": "20° - 30°",
    "classification": "Sarpa",
    "classificationHi": "सर्प (मोक्ष)",
    "nameEn": "Coiled Mystic",
    "nameHi": "नाग वेष्टित संन्यासी",
    "rulingPlanet": "Mars",
    "rulingPlanetHi": "मंगल",
    "symbolEn": "Ascetic wrapped in cobras meditating by deep river",
    "symbolHi": "Ascetic wrapped in cobras meditating by deep river",
    "karmicOutcomeEn": "Transcendental meditation, water caution, supreme detachment.",
    "karmicOutcomeHi": "Transcendental meditation, water caution, supreme detachment.",
    "isMarakaSensitive": true
  }
];

export const GULIKA_HOUSES_CORPUS: GulikaHouseRecord[] = [
  {
    "house": 1,
    "titleEn": "Gulika in 1st House (Lagna)",
    "titleHi": "गुलिक/मांदि लग्न में",
    "effectEn": "Native has sharp penetrating eyes, aggressive speech, scarred forehead or body, chronic digestive fire, highly courageous yet suspicious of others.",
    "effectHi": "जातक की दृष्टि तीक्ष्ण, उग्र वाणी, ललाट या शरीर पर कोई विशिष्ट चिह्न, जठराग्नि तीव्र, अत्यंत साहसी किंतु संशयवादी स्वभाव।"
  },
  {
    "house": 2,
    "titleEn": "Gulika in 2nd House (Dhana)",
    "titleHi": "गुलिक/मांदि द्वितीय भाव में",
    "effectEn": "Harsh blunt speech, domestic friction over wealth, dental sensitivity, fluctuations in accumulated savings.",
    "effectHi": "कठोर वाणी, धन को लेकर कुटुंब में मतभेद, दंत पीड़ा, संचित धन में उतार-चढ़ाव व अकस्मात व्यय।"
  },
  {
    "house": 3,
    "titleEn": "Gulika in 3rd House (Sahaja)",
    "titleHi": "गुलिक/मांदि तृतीय भाव में",
    "effectEn": "Fierce valor, undisputed courage, crushes all competitors, friction with younger siblings, military or mechanical acumen.",
    "effectHi": "अद्वितीय पराक्रम, शत्रुओं का दमन, छोटे भाइयों से मनमुटाव, सेना या तकनीकी कार्यों में निपुणता।"
  },
  {
    "house": 4,
    "titleEn": "Gulika in 4th House (Sukha)",
    "titleHi": "गुलिक/मांदि चतुर्थ भाव में",
    "effectEn": "Restlessness at home, distance from maternal happiness, disputes over ancestral landed property, chest vulnerability.",
    "effectHi": "गृह सुख में अशांति, माता के स्वास्थ्य की चिंता, भूमि व पैतृक मकान में विवाद, वक्षस्थल में संवेदनशीलता।"
  },
  {
    "house": 5,
    "titleEn": "Gulika in 5th House (Suta)",
    "titleHi": "गुलिक/मांदि पंचम भाव में",
    "effectEn": "Obstacles or delay in progeny, sharp critical intellect, stomach heat, interest in deep occult and tantric formulas.",
    "effectHi": "संतान प्राप्ति में विलंब या बाधा, आलोचनात्मक बुद्धि, उदर विकार, तंत्र-मंत्र व गूढ़ विद्याओं में रुचि।"
  },
  {
    "house": 6,
    "titleEn": "Gulika in 6th House (Ripu)",
    "titleHi": "गुलिक/मांदि षष्ठ भाव में",
    "effectEn": "Supreme Shatruhanta, completely obliterates all adversaries and litigations, robust immunity against witchcraft or toxins.",
    "effectHi": "परम शत्रुहंता, सभी विरोधियों व मुकदमों पर विजय, विष व तंत्र बाधाओं से पूर्ण सुरक्षा, रोग प्रतिरोधक क्षमता।"
  },
  {
    "house": 7,
    "titleEn": "Gulika in 7th House (Kalatra)",
    "titleHi": "गुलिक/मांदि सप्तम भाव में",
    "effectEn": "Marital friction, spouse has sharp temperament, delays in marriage settlement, caution in commercial partnerships.",
    "effectHi": "दांपत्य में वैचारिक तनाव, जीवनसाथी का तेज स्वभाव, विवाह में विलंब, व्यापारिक साझेदारी में विशेष सावधानी।"
  },
  {
    "house": 8,
    "titleEn": "Gulika in 8th House (Ayu)",
    "titleHi": "गुलिक/मांदि अष्टम भाव में",
    "effectEn": "Facial/ocular vulnerability, sudden accidents from poisons or reptiles, deep interest in necromancy/occult, unexpected longevity trials.",
    "effectHi": "नेत्र या मुख विकार, विष व कीट-दंश से सावधानी, तंत्र व श्मशान विद्याओं में रुचि, आयु संबंधी उतार-चढ़ाव।"
  },
  {
    "house": 9,
    "titleEn": "Gulika in 9th House (Dharma)",
    "titleHi": "गुलिक/मांदि नवम भाव में",
    "effectEn": "Strained relationship with orthodox elders or father, independent spiritual philosophy, frequent travel and foreign wanderings.",
    "effectHi": "पिता या पारंपरिक गुरुओं से मतभेद, स्वतंत्र आध्यात्मिक विचार, धार्मिक रूढ़ियों का विरोध, बहुविध यात्राएं।"
  },
  {
    "house": 10,
    "titleEn": "Gulika in 10th House (Karma)",
    "titleHi": "गुलिक/मांदि दशम भाव में",
    "effectEn": "Unorthodox career, sudden elevations and challenges in authority, daring decision maker, successful in heavy industry or investigation.",
    "effectHi": "विशिष्ट आजीविका, कार्यक्षेत्र में अप्रत्याशित उतार-चढ़ाव, साहसी प्रशासक, भारी उद्योग या गुप्तचर कार्यों में सफलता।"
  },
  {
    "house": 11,
    "titleEn": "Gulika in 11th House (Labha)",
    "titleHi": "गुलिक/मांदि एकादश भाव में",
    "effectEn": "Immense monetary windfalls, prosperity, authoritative friends, fulfillment of ambitious goals through daring enterprise.",
    "effectHi": "अकूत धन लाभ, संपन्नता, उच्च प्रभावशाली मित्रों का सहयोग, साहसिक उपक्रमों द्वारा सभी अभीष्टों की सिद्धि।"
  },
  {
    "house": 12,
    "titleEn": "Gulika in 12th House (Vyaya)",
    "titleHi": "गुलिक/मांदि द्वादश भाव में",
    "effectEn": "Heavy expenditure on occult or medical treatments, left eye weakness, sleep restlessness, foreign settlement.",
    "effectHi": "चिकित्सा या तंत्र साधनाओं पर व्यय, बाएं नेत्र में पीड़ा, अनिद्रा की समस्या, सुदूर विदेश में वास का योग।"
  }
];

export const PLANET_HOUSE_BOOK_CORPUS: PlanetHouseBookRecord[] = [
  {
    "planet": "Sun",
    "planetHi": "सूर्य",
    "house": 1,
    "titleEn": "Sun in 1st House (Lagna)",
    "titleHi": "सूर्य प्रथम भाव (लग्न) में",
    "baseEn": "Native possesses strong vitality, commanding presence, dignified ego, and courageous demeanor. Prone to bilious heat, thinning hair, and sensitivity of the eyes. Dislikes subordination, values honour and self-respect.",
    "baseHi": "जातक तेजस्वी, स्वाभिमानी, साहसी तथा प्रभावशाली व्यक्तित्व का स्वामी होता है। पित्त प्रकृति, ललाट पर तेज, नेत्रों में संवेदनशीलता तथा केश अल्प हो सकते हैं। पराधीनता से घृणा तथा आत्म-सम्मान के प्रति अत्यंत सजग।",
    "ageMilestones": [
      {
        "age": 3,
        "nature": "health",
        "eventEn": "Vulnerability to childhood fevers, heat stroke, or eye irritation.",
        "eventHi": "बाल्यावस्था में पित्त ज्वर, लू अथवा नेत्र विकार की संवेदनशीलता।"
      },
      {
        "age": 16,
        "nature": "career",
        "eventEn": "Dawn of independent intellect, academic distinction, and youth leadership.",
        "eventHi": "स्वतंत्र प्रज्ञा, विद्या में विशिष्ट पहचान व साथियों में नेतृत्व का उदय।"
      },
      {
        "age": 22,
        "nature": "favorable",
        "eventEn": "Major milestone in career initiation, governmental recognition or patron support.",
        "eventHi": "आजीविका में महत्वपूर्ण उन्नति, राजकीय पक्ष या उच्चाधिकारियों से सहयोग।"
      }
    ],
    "signModifiers": {
      "Aries": {
        "en": "Exalted: Supreme administrative success, robust health, commanding status.",
        "hi": "उच्च राशि (मेष): उच्च प्रशासनिक पद, दीर्घायु, अत्यंत तेजस्वी तथा प्रतिष्ठित।"
      },
      "Libra": {
        "en": "Debilitated: Low self-esteem, eye ailments, heart palpitations, friction with authorities.",
        "hi": "नीच राशि (तुला): आत्मबल की कमी, नेत्र दोष, हृदय की धड़कन, उच्चाधिकारियों से कलह।"
      },
      "Leo": {
        "en": "Own Sign: Regal confidence, magnetic leadership, respected by rulers and public.",
        "hi": "स्वराशि (सिंह): राजसी दृढ़ता, चुंबकीय नेतृत्व, शासन व समाज में पूज्य।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Saturn",
        "conditionEn": "Aspected by Saturn",
        "conditionHi": "शनि की दृष्टि",
        "effectEn": "Bodily strain, eye trouble, conflicts with superiors, melancholic temperament.",
        "effectHi": "शारीरिक कष्ट, नेत्र पीड़ा, उच्चाधिकारियों से मतभेद, गंभीर व उदास प्रकृति।"
      },
      {
        "graha": "Jupiter",
        "conditionEn": "Aspected by Jupiter",
        "conditionHi": "गुरु की दृष्टि",
        "effectEn": "High righteousness, divine protection, judicial authority, moral nobility.",
        "effectHi": "परम धार्मिकता, दैवीय रक्षा, न्यायप्रियता तथा समाज में गुरुतुल्य सम्मान।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, native possesses commanding personality, high self-esteem, leadership in domestic and social spheres; requires care regarding bile and digestive warmth.",
      "hi": "स्त्री जातक में अत्यंत स्वाभिमानी, परिवार व समाज में प्रमुखता, दृढ़ संकल्प शक्ति; पित्त तथा पाचन संवेदनशीलता पर ध्यान आवश्यक।"
    }
  },
  {
    "planet": "Sun",
    "planetHi": "सूर्य",
    "house": 2,
    "titleEn": "Sun in 2nd House (Dhana Bhava)",
    "titleHi": "सूर्य द्वितीय भाव (धन भाव) में",
    "baseEn": "Native earns wealth through state, royal favor, or authoritative speech. Speech is frank, forceful, and occasionally harsh. Vulnerability to dental, facial, or right eye ailments. Fluctuations in ancestral assets.",
    "baseHi": "जातक को शासन, प्रशासन या अधिकारपूर्ण वाणी द्वारा धन लाभ होता है। वाणी स्पष्ट, तीव्र तथा कभी-कभी कठोर हो सकती है। मुख, दंत अथवा दाहिने नेत्र में संवेदनशीलता। पैतृक संपत्ति में विवाद या उतार-चढ़ाव।",
    "ageMilestones": [
      {
        "age": 20,
        "nature": "career",
        "eventEn": "Beginning of financial independence and authority.",
        "eventHi": "आर्थिक आत्मनिर्भरता व आजीविका का प्रारंभ।"
      },
      {
        "age": 25,
        "nature": "challenging",
        "eventEn": "Financial dispute or speech-induced domestic friction.",
        "eventHi": "वाणी या धन के लेन-देन को लेकर पारिवारिक विवाद।"
      }
    ],
    "signModifiers": {
      "Aries": {
        "en": "Exalted: Enormous wealth accumulation through administrative and corporate authority.",
        "hi": "उच्च राशि: प्रशासनिक व राजकीय सत्ता से विपुल धनोपार्जन।"
      },
      "Libra": {
        "en": "Debilitated: Losses through penalties, eye defects, harsh words causing separation.",
        "hi": "नीच राशि: दंड अथवा मुकदमों में धनहानि, नेत्र विकार, कटु वाणी से कुटुंब कलह।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Venus",
        "conditionEn": "Aspected by Venus",
        "conditionHi": "शुक्र की दृष्टि",
        "effectEn": "Eloquent and refined speech, wealth through luxury and arts.",
        "effectHi": "वाणी में आकर्षण, कला व आभूषणों से धन संचय।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, straightforward speech, high dignity in speech, guardian of family traditions, pride in ancestral lineage.",
      "hi": "स्त्री जातक में खरी व निर्भीक वाणी, कुल मर्यादा की संरक्षिका, स्वाभिमान से पूर्ण, पारिवारिक वित्त पर नियंत्रण।"
    }
  },
  {
    "planet": "Sun",
    "planetHi": "सूर्य",
    "house": 3,
    "titleEn": "Sun in 3rd House (Sahaja Bhava)",
    "titleHi": "सूर्य तृतीय भाव (पराक्रम भाव) में",
    "baseEn": "Extremely courageous, valorous, heroic initiative, determined willpower. Friction with or fewer younger brothers. High renown in sports, military, engineering, or entrepreneurial drive.",
    "baseHi": "अत्यंत पराक्रमी, साहसी, दृढ़ संकल्पी तथा पुरुषार्थी। छोटे भाइयों से मतभेद अथवा उनकी संख्या अल्प। खेलकूद, सेना, इंजीनियरिंग या स्वतंत्र व्यवसाय में ख्याति।",
    "ageMilestones": [
      {
        "age": 20,
        "nature": "favorable",
        "eventEn": "Tremendous rise in bravery, courage, and successful independent enterprises.",
        "eventHi": "अदम्य पराक्रम, साहस तथा स्वतंत्र उपक्रमों में विजय।"
      },
      {
        "age": 28,
        "nature": "career",
        "eventEn": "Triumph over competition, major expansion of influence.",
        "eventHi": "प्रतिस्पर्धा पर पूर्ण विजय, प्रभाव क्षेत्र का व्यापक विस्तार।"
      }
    ],
    "signModifiers": {
      "Aries": {
        "en": "Exalted: Supreme heroism, military victory, undisputed leadership.",
        "hi": "उच्च राशि: परम पराक्रम, सैन्य/प्रशासनिक विजय, अविवादित नेतृत्व।"
      },
      "Libra": {
        "en": "Debilitated: Strained courage, sibling disputes, respiratory or arm vulnerabilities.",
        "hi": "नीच राशि: असमय आवेश, सहोदरों से तनाव, भुजाओं में संवेदनशीलता।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Mars",
        "conditionEn": "With or aspected by Mars",
        "conditionHi": "मंगल की युति या दृष्टि",
        "effectEn": "Fierce military bravery, high technical skill, unyielding fighter.",
        "effectHi": "अद्वितीय युद्ध कौशल, तकनीकी दक्षता, किसी से न दबने वाला स्वभाव।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, fearless demeanor, protects family like an armor, skilled in manual arts and administrative organizing.",
      "hi": "स्त्री जातक में अत्यंत निर्भीक, परिवार की ढाल बनकर खड़ी रहने वाली, प्रशासनिक व संगठनात्मक कार्यों में निपुण।"
    }
  },
  {
    "planet": "Sun",
    "planetHi": "सूर्य",
    "house": 4,
    "titleEn": "Sun in 4th House (Sukha Bhava)",
    "titleHi": "सूर्य चतुर्थ भाव (सुख भाव) में",
    "baseEn": "Deep concern for paternal property, mental restlessness, distance from birthplace. Mother health requires attention. Paternal heritage may undergo scrutiny. Noble vehicles and dwellings in later life.",
    "baseHi": "पैतृक संपत्ति को लेकर सजगता, मानसिक चंचलता, जन्मभूमि से दूर निवास का योग। माता के स्वास्थ्य के प्रति सतर्कता आवश्यक। उत्तरार्ध में उच्च वाहन व भवन सुख।",
    "ageMilestones": [
      {
        "age": 22,
        "nature": "career",
        "eventEn": "Relocation away from home for education or professional settlement.",
        "eventHi": "शिक्षा या आजीविका हेतु गृहत्याग व नवीन स्थान पर वास।"
      },
      {
        "age": 30,
        "nature": "challenging",
        "eventEn": "Paternal or property transition, emotional turning point.",
        "eventHi": "पैतृक संपत्ति या पिता के जीवन में महत्वपूर्ण मोड़ व भावुकता।"
      }
    ],
    "signModifiers": {
      "Leo": {
        "en": "Own Sign: Grand mansion, royal comforts, dignified mother, peace of mind.",
        "hi": "स्वराशि: विशाल प्रासाद, राजसी सुख, प्रतिष्ठित माता, आत्मिक शांति।"
      },
      "Libra": {
        "en": "Debilitated: Domestic discord, vehicle hazards, heart/chest heaviness.",
        "hi": "नीच राशि: गृह क्लेश, वाहन से कष्ट, वक्षस्थल या हृदय में भारीपन।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Jupiter",
        "conditionEn": "Aspected by Jupiter",
        "conditionHi": "गुरु की दृष्टि",
        "effectEn": "Sanctified residence, maternal longevity, broad philanthropic heart.",
        "effectHi": "पवित्र व समृद्ध गृह, माता की दीर्घायु, उदार व धार्मिक हृदय।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, highly dignified domestic head, strong will in managing property, maternal duties executed with strict discipline.",
      "hi": "स्त्री जातक में घर की मुख्य स्तंभ, संपत्ति प्रबंधन में दक्ष, अनुशासनप्रिय माता, मर्यादाओं का कड़ाई से पालन।"
    }
  },
  {
    "planet": "Sun",
    "planetHi": "सूर्य",
    "house": 5,
    "titleEn": "Sun in 5th House (Suta Bhava)",
    "titleHi": "सूर्य पंचम भाव (संतान व बुद्धि भाव) में",
    "baseEn": "Sharp intellect, interest in political philosophy, mantra shastra, or administration. Delay or fewer male progeny. Prone to digestive heat. Authoritative teacher or counsellor.",
    "baseHi": "तीक्ष्ण प्रज्ञा, राजनीति, मंत्र शास्त्र तथा प्रशासन में गहरी रुचि। संतानोत्पत्ति में विलंब या अल्प संतान योग। जठराग्नि तीव्र, उदर में गर्मी। विद्वान मार्गदर्शक।",
    "ageMilestones": [
      {
        "age": 16,
        "nature": "favorable",
        "eventEn": "Exceptional academic distinction and intellectual brilliance.",
        "eventHi": "विद्या व बौद्धिक प्रतियोगिताओं में असाधारण सफलता।"
      },
      {
        "age": 28,
        "nature": "favorable",
        "eventEn": "Birth of worthy child or major publication/intellectual creation.",
        "eventHi": "सुलक्षण संतान का जन्म अथवा बौद्धिक कृति का प्रकाशन।"
      }
    ],
    "signModifiers": {
      "Aries": {
        "en": "Exalted: Genius intelligence, royal advisor, high merit in competitive examinations.",
        "hi": "उच्च राशि: कुशाग्र बुद्धि, राजकीय सलाहकार, प्रशासनिक परीक्षाओं में सर्वोच्च स्थान।"
      },
      "Libra": {
        "en": "Debilitated: Disturbed studies, abdominal ailments, anxiety regarding children.",
        "hi": "नीच राशि: विद्या में बाधा, उदर विकार, संतान पक्ष से चिंता।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Jupiter",
        "conditionEn": "Aspected by Jupiter",
        "conditionHi": "गुरु की दृष्टि",
        "effectEn": "Supreme wisdom, noble children, mastery of sacred scriptures.",
        "effectHi": "परम मेधा, सदाचारी संतान, शास्त्रों व नीतियों में पारंगत।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, highly intellectual and spiritual, strict yet devoted mother, requires care regarding digestion and pregnancy.",
      "hi": "स्त्री जातक में कुशाग्र मेधा, धार्मिक वृत्ति, संतान के प्रति कर्तव्यनिष्ठ; गर्भावस्था व उदर स्वास्थ्य के प्रति सजगता आवश्यक।"
    }
  },
  {
    "planet": "Sun",
    "planetHi": "सूर्य",
    "house": 6,
    "titleEn": "Sun in 6th House (Ripu Bhava)",
    "titleHi": "सूर्य षष्ठ भाव (शत्रु व रोग भाव) में",
    "baseEn": "Supreme Shatruhanta (crusher of adversaries), unyielding physical resistance, triumphs in litigation, state examinations, and debts. Gains from maternal uncles. Strong digestive fire.",
    "baseHi": "परम शत्रुहंता, रोगों से लड़ने की अद्भुत क्षमता, मुकदमों व प्रतियोगी परीक्षाओं में विजय। ननिहाल पक्ष से लाभ। तीव्र जठराग्नि, विरोधियों पर पूर्ण दबदबा।",
    "ageMilestones": [
      {
        "age": 21,
        "nature": "career",
        "eventEn": "Grand victory in competitive trials or selection for public duty.",
        "eventHi": "प्रतियोगी परीक्षा या चयन में अभूतपूर्व सफलता।"
      },
      {
        "age": 28,
        "nature": "favorable",
        "eventEn": "Complete liquidation of debts and triumph over opponents.",
        "eventHi": "ऋण मुक्ति तथा न्यायालयीन विवादों में निर्णायक विजय।"
      }
    ],
    "signModifiers": {
      "Aries": {
        "en": "Exalted: Complete annihilation of rivals, supreme administrative power in judiciary or defense.",
        "hi": "उच्च राशि: शत्रुओं का समूल नाश, सेना या न्याय प्रशासन में सर्वोच्च धाक।"
      },
      "Libra": {
        "en": "Debilitated: Chronic fever, friction with subordinates, eye or kidney vulnerability.",
        "hi": "नीच राशि: पित्त ज्वर, अधीनस्थों से विवाद, नेत्र या गुर्दे की संवेदनशीलता।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Saturn",
        "conditionEn": "With Saturn",
        "conditionHi": "शनि से युति",
        "effectEn": "Persistent chronic challenges followed by hard-earned ultimate triumph.",
        "effectHi": "दीर्घकालिक संघर्ष के उपरांत कठोर परिश्रम से स्थाई विजय।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, robust resilience, overcomes workplace hurdles easily, dominant over competitors, prone to acidity.",
      "hi": "स्त्री जातक में अपार कार्यक्षमता, कार्यक्षेत्र की बाधाओं को परास्त करने वाली, प्रतिस्पर्धियों पर हावी, पित्त संवेदनशीलता।"
    }
  },
  {
    "planet": "Sun",
    "planetHi": "सूर्य",
    "house": 7,
    "titleEn": "Sun in 7th House (Kalatra Bhava)",
    "titleHi": "सूर्य सप्तम भाव (कलत्र व जाया भाव) में",
    "baseEn": "Spouse is proud, dignified, belongs to a respectable family. High ego in partnerships, frequent travel for spouse. Marital adjustments required due to mutual authoritative temperaments.",
    "baseHi": "जीवनसाथी स्वाभिमानी, तेजस्वी तथा कुलीन परिवार से। साझेदारी में स्वाभिमान का टकराव, जीवनसाथी के निरंतर प्रवास का योग। परस्पर सम्मान से ही दांपत्य सामंजस्य संभव।",
    "ageMilestones": [
      {
        "age": 24,
        "nature": "challenging",
        "eventEn": "Marital negotiations or partnership adjustments requiring tact.",
        "eventHi": "विवाह वार्ता या साझेदारी में अहं का टकराव व समन्वय की परीक्षा।"
      },
      {
        "age": 31,
        "nature": "favorable",
        "eventEn": "Consolidation of public reputation and marital stability.",
        "eventHi": "सामाजिक प्रतिष्ठा में वृद्धि तथा दांपत्य जीवन में स्थिरता।"
      }
    ],
    "signModifiers": {
      "Aries": {
        "en": "Exalted: Spouse from aristocratic or ruling background, high public stature.",
        "hi": "उच्च राशि: जीवनसाथी उच्च पदस्थ या कुलीन, समाज में ऊंचा मान-सम्मान।"
      },
      "Libra": {
        "en": "Debilitated: Marital bitterness, separation risks, spouse fragile health.",
        "hi": "नीच राशि: दांपत्य कलह, अलगाव का भय, जीवनसाथी का दुर्बल स्वास्थ्य।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Jupiter",
        "conditionEn": "Aspected by Jupiter",
        "conditionHi": "गुरु की दृष्टि",
        "effectEn": "Marital longevity secured, noble and devoted spouse, harmonious partnership.",
        "effectHi": "दांपत्य की पूर्ण सुरक्षा, सदाचारी व विद्वान जीवनसाथी, सुखी गृहस्थी।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, husband is authoritative, government employee or businessman; patience needed to avoid domestic ego friction.",
      "hi": "स्त्री जातक में पति तेजस्वी, अधिकार संपन्न या शासनाधीन; गृहस्थी में शांति हेतु परस्पर अहं के त्याग की आवश्यकता।"
    }
  },
  {
    "planet": "Sun",
    "planetHi": "सूर्य",
    "house": 8,
    "titleEn": "Sun in 8th House (Ayu Bhava)",
    "titleHi": "सूर्य अष्टम भाव (आयु व रंध्र भाव) में",
    "baseEn": "Few children, eye weaknesses, sudden hazards from fire, heat, or government scrutiny. Deep occult interests, research orientation, unexpected inheritance or tax litigation.",
    "baseHi": "अल्प संतति, नेत्रों में दुर्बलता, अग्नि, पित्त अथवा राजकीय जांच का आकस्मिक जोखिम। गूढ़ विद्याओं व शोध में रुचि, अचानक पैतृक धन या कर विवाद।",
    "ageMilestones": [
      {
        "age": 22,
        "nature": "health",
        "eventEn": "Vulnerability to high fever, accident, or ocular strain.",
        "eventHi": "तीव्र ज्वर, दुर्घटना अथवा नेत्र कष्ट का सतर्कता वर्ष।"
      },
      {
        "age": 33,
        "nature": "favorable",
        "eventEn": "Sudden financial inheritance, secret research breakthrough.",
        "eventHi": "आकस्मिक वसीयत या गुप्त शोध में बड़ी सफलता।"
      }
    ],
    "signModifiers": {
      "Aries": {
        "en": "Exalted: Strong longevity, sudden legacies through government or royal grants.",
        "hi": "उच्च राशि: दीर्घायु, राजकीय पक्ष से अचानक विपुल संपत्ति प्राप्ति।"
      },
      "Libra": {
        "en": "Debilitated: Weakened longevity, chronic ailments, conflicts with state revenue.",
        "hi": "नीच राशि: स्वास्थ्य के प्रति विशेष सावधानी, दीर्घकालीन रोग, कर संबंधी उलझनें।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Jupiter",
        "conditionEn": "Aspected by Jupiter",
        "conditionHi": "गुरु की दृष्टि",
        "effectEn": "Shields vitality, bestows profound metaphysical wisdom and peaceful longevity.",
        "effectHi": "प्राण रक्षा, अगाध आध्यात्मिक ज्ञान तथा शांत व सुदीर्घ जीवन।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, vulnerability in middle age regarding reproductive or ocular health, spiritual inclinations, in-laws require tact.",
      "hi": "स्त्री जातक में मध्य आयु में स्वास्थ्य सतर्कता, आध्यात्मिक प्रवृत्तियां, ससुराल पक्ष के साथ संयमित व्यवहार आवश्यक।"
    }
  },
  {
    "planet": "Sun",
    "planetHi": "सूर्य",
    "house": 9,
    "titleEn": "Sun in 9th House (Dharma Bhava)",
    "titleHi": "सूर्य नवम भाव (धर्म व भाग्य भाव) में",
    "baseEn": "Righteous, devoted to dharma, respectful towards preceptors and father. High philosophical wisdom, foreign pilgrimages, charitable mindset, state honors.",
    "baseHi": "धर्मात्मा, पिता व गुरुजनों का आज्ञाकारी, उच्च दार्शनिक प्रज्ञा, तीर्थ यात्राएं, दानवीर प्रकृति तथा शासन से सम्मानित।",
    "ageMilestones": [
      {
        "age": 16,
        "nature": "favorable",
        "eventEn": "Spiritual initiation, higher academic excellence, paternal blessings.",
        "eventHi": "धार्मिक संस्कार, उच्च शिक्षा में प्रगति, पिता का विशेष स्नेह।"
      },
      {
        "age": 22,
        "nature": "favorable",
        "eventEn": "Dawn of fortune (Bhagyodaya), pilgrimage, and intellectual recognition.",
        "eventHi": "भाग्योदय का शुभ प्रारंभ, तीर्थाटन तथा विद्वानों में ख्याति।"
      },
      {
        "age": 32,
        "nature": "career",
        "eventEn": "Apex of ethical leadership and societal renown.",
        "eventHi": "धार्मिक व सामाजिक नेतृत्व का चरमोत्कर्ष।"
      }
    ],
    "signModifiers": {
      "Aries": {
        "en": "Exalted: Supreme spiritual ruler, illustrious father, vast temple and public endowments.",
        "hi": "उच्च राशि: धर्म ध्वजवाहक, प्रतापी पिता, धार्मिक व सामाजिक प्रतिष्ठा का शिखर।"
      },
      "Libra": {
        "en": "Debilitated: Clashes with father, skepticism towards traditions, travel obstacles.",
        "hi": "नीच राशि: पिता से वैचारिक मतभेद, परंपराओं के प्रति संदेह, यात्रा में कष्ट।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Jupiter",
        "conditionEn": "With or aspected by Jupiter",
        "conditionHi": "गुरु से युति या दृष्टि",
        "effectEn": "Dharmadhikari yoga, supreme saintly wisdom, universally revered.",
        "effectHi": "धर्माधिकारी योग, सर्वोच्च संत तुल्य सम्मान, सर्वमान्य प्रतिष्ठा।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, exceptionally virtuous, brings good fortune to paternal and matrimonial houses, loves pilgrimages and charitable deeds.",
      "hi": "स्त्री जातक में परम सौभाग्यशालिनी, दोनों कुलों का नाम रोशन करने वाली, तीर्थ व धर्म कार्यों में अग्रणी।"
    }
  },
  {
    "planet": "Sun",
    "planetHi": "सूर्य",
    "house": 10,
    "titleEn": "Sun in 10th House (Karma Bhava)",
    "titleHi": "सूर्य दशम भाव (कर्म व राज्य भाव) में",
    "baseEn": "Supreme Kuladipaka yoga, highest directional strength (Digbala). Dominant administrative post, executive power, public fame, unshakeable work ethic. Dignified relationship with state and society.",
    "baseHi": "सर्वोच्च कुलादीपक योग, दशम भाव में सूर्य को पूर्ण दिग्बल प्राप्त होता है। उच्च प्रशासनिक पद, राजकीय सत्ता, कीर्ति, अटूट कर्मठता तथा समाज में अमिट प्रभाव।",
    "ageMilestones": [
      {
        "age": 18,
        "nature": "favorable",
        "eventEn": "Outstanding academic honors and youth leadership recognition.",
        "eventHi": "अकादमिक प्रतिष्ठा तथा युवावस्था में नेतृत्व की स्वीकृति।"
      },
      {
        "age": 28,
        "nature": "career",
        "eventEn": "Paternal transition or massive elevation in executive authority.",
        "eventHi": "पिता के पद की प्राप्ति अथवा कार्यक्षेत्र में अप्रत्याशित पदोन्नति।"
      },
      {
        "age": 30,
        "nature": "career",
        "eventEn": "Consolidation of supreme status, state recognition, undisputed mastery.",
        "eventHi": "राजकीय सम्मान, उच्चाधिकारों की प्राप्ति तथा प्रतिष्ठा का स्थायित्व।"
      }
    ],
    "signModifiers": {
      "Aries": {
        "en": "Exalted: Royal commander, minister, civil servant of highest tier.",
        "hi": "उच्च राशि: सर्वोच्च प्रशासनिक अधिकारी, मंत्री या शासन का शीर्ष नीति-निर्माता।"
      },
      "Libra": {
        "en": "Debilitated: Professional instability, defamation risk from superiors, ethical trials.",
        "hi": "नीच राशि: आजीविका में अस्थिरता, अधिकारियों से अनबन, प्रतिष्ठा पर आंच।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Mars",
        "conditionEn": "Aspected by Mars",
        "conditionHi": "मंगल की दृष्टि",
        "effectEn": "Kuladipaka yoga in defense, engineering, or police command.",
        "effectHi": "सेना, पुलिस या तकनीकी प्रशासन में सर्वोच्च कमान।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, high-ranking professional career, independent authority, respected executive or civil administrator.",
      "hi": "स्त्री जातक में उच्च प्रशासनिक या व्यावसायिक पद, स्वतंत्र निर्णय क्षमता, समाज व कार्यक्षेत्र में विशिष्ट सम्मान।"
    }
  },
  {
    "planet": "Sun",
    "planetHi": "सूर्य",
    "house": 11,
    "titleEn": "Sun in 11th House (Labha Bhava)",
    "titleHi": "सूर्य एकादश भाव (लाभ व आय भाव) में",
    "baseEn": "Immense wealth accumulation, fulfilment of cherished aspirations, influential network among rulers and aristocrats. Respect from elder siblings. Victorious in speculative investments.",
    "baseHi": "अथाह धन संचय, सभी अभीष्ट कामनाओं की पूर्ति, उच्चाधिकारियों व सत्ताधीशों से घनिष्ठ संबंध। बड़े भाई-बहनों से सहयोग। आर्थिक उपक्रमों में निरंतर विजय।",
    "ageMilestones": [
      {
        "age": 25,
        "nature": "favorable",
        "eventEn": "Grand financial windfall, expansion of powerful business networks.",
        "eventHi": "विपुल धन लाभ, शक्तिशाली मित्रों व व्यावसायिक संपर्कों का विस्तार।"
      },
      {
        "age": 33,
        "nature": "favorable",
        "eventEn": "Acquisition of landed assets, major financial summit.",
        "eventHi": "स्थाई संपत्ति का निर्माण तथा आर्थिक समृद्धि का चरमोत्कर्ष।"
      }
    ],
    "signModifiers": {
      "Aries": {
        "en": "Exalted: Multi-millionaire status, patronage from monarchs or central governments.",
        "hi": "उच्च राशि: अपार संपत्ति, केंद्र सरकार या शीर्ष सत्ता से अकूत लाभ।"
      },
      "Libra": {
        "en": "Debilitated: Strained relations with elder brother, fluctuating profits, tax audits.",
        "hi": "नीच राशि: अग्रज से मतभेद, आय में उतार-चढ़ाव, कर संबंधी विसंगतियां।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Jupiter",
        "conditionEn": "Aspected by Jupiter",
        "conditionHi": "गुरु की दृष्टि",
        "effectEn": "Righteous and eternal wealth, noble philanthropic endowments.",
        "effectHi": "धर्म सम्मत अक्षय धन, विशाल दान-पुण्य व समाज कल्याण।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, wealthy, influential friends circle, fulfills family ambitions, holds personal financial independence.",
      "hi": "स्त्री जातक में अत्यधिक संपन्न, प्रभावशाली सखियों का वृत्त, परिवार की महत्वाकांक्षाओं की पूर्ति, आर्थिक रूप से स्वावलंबी।"
    }
  },
  {
    "planet": "Sun",
    "planetHi": "सूर्य",
    "house": 12,
    "titleEn": "Sun in 12th House (Vyaya Bhava)",
    "titleHi": "सूर्य द्वादश भाव (व्यय व मोक्ष भाव) में",
    "baseEn": "Heavy expenditure on government taxes, medical or charitable causes. Foreign residence, distance from paternal land, left eye vulnerability. Solitary spiritual seeker in mature years.",
    "baseHi": "राजकीय करों, चिकित्सा अथवा धार्मिक कार्यों में भारी व्यय। विदेश वास, जन्मभूमि व पितृगृह से दूरी, बाएं नेत्र में विकार। उत्तरार्ध में एकांतप्रिय व मोक्षकामी।",
    "ageMilestones": [
      {
        "age": 15,
        "nature": "health",
        "eventEn": "Left eye strain or childhood hospitalization.",
        "eventHi": "बाएं नेत्र में पीड़ा अथवा बाल्यावस्था में अस्वस्थता।"
      },
      {
        "age": 30,
        "nature": "career",
        "eventEn": "Foreign relocation, major expenditure on overseas ventures.",
        "eventHi": "विदेश यात्रा, सुदूर स्थानों में आजीविका अथवा भारी व्यय।"
      }
    ],
    "signModifiers": {
      "Aries": {
        "en": "Exalted: High honor in foreign lands, spiritual renunciation of highest order.",
        "hi": "उच्च राशि: विदेश में राजकीय सम्मान, उच्च कोटि का आध्यात्मिक संन्यास।"
      },
      "Libra": {
        "en": "Debilitated: Penalties, eye afflictions, financial losses abroad.",
        "hi": "नीच राशि: दंड, नेत्र कष्ट, परदेस में आर्थिक हानि व अपमान का भय।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Venus",
        "conditionEn": "With Venus",
        "conditionHi": "शुक्र से युति",
        "effectEn": "Expenditure on luxury, foreign arts, sensory comforts.",
        "effectHi": "विलासिता, कला तथा विदेशी सुख-सुविधाओं पर विपुल खर्च।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, spiritual detachment, charitable disposition, foreign travel, requires care regarding sleep and ocular health.",
      "hi": "स्त्री जातक में आध्यात्मिक विरक्ति, दानशीलता, विदेश वास, निद्रा व नेत्र स्वास्थ्य के प्रति सजगता आवश्यक।"
    }
  },
  {
    "planet": "Moon",
    "planetHi": "चन्द्रमा",
    "house": 1,
    "titleEn": "Moon in 1st House (Lagna)",
    "titleHi": "चन्द्रमा प्रथम भाव (लग्न) में",
    "baseEn": "Charming appearance, magnetic eyes, highly emotional and imaginative disposition. If Shukla Paksha (waxing), native enjoys radiant health and popularity. If Krishna Paksha (waning) and afflicted, childhood health fluctuations (Balarishta).",
    "baseHi": "मनोहर मुखाकृति, आकर्षक आंखें, अत्यंत भावुक तथा उर्वर कल्पनाशील स्वभाव। शुक्ल पक्षीय चन्द्रमा होने पर उत्तम आरोग्य, लोकप्रियता तथा कांतिवान देह। कृष्ण पक्ष व पाप प्रभाव में बाल्यावस्था में स्वास्थ्य दुर्बलता (बालारिष्ट योग)।",
    "ageMilestones": [
      {
        "age": 15,
        "nature": "favorable",
        "eventEn": "Dawn of artistic talents and widespread social charm.",
        "eventHi": "कलात्मक प्रतिभा तथा समाज में आकर्षण का प्रस्फुटन।"
      },
      {
        "age": 24,
        "nature": "favorable",
        "eventEn": "Major popularity surge, marital or emotional fulfillment.",
        "eventHi": "लोकप्रियता में अभूतपूर्व वृद्धि, दांपत्य व भावनात्मक सुख।"
      }
    ],
    "signModifiers": {
      "Taurus": {
        "en": "Exalted: Radiant beauty, immense wealth, peaceful mind, longevity.",
        "hi": "उच्च राशि (वृषभ): अनुपम सौंदर्य, विपुल धन, शांत मन, सुदीर्घ जीवन।"
      },
      "Scorpio": {
        "en": "Debilitated: Emotional anxiety, depressive mood swings, respiratory weakness.",
        "hi": "नीच राशि (वृश्चिक): मानसिक उद्वेग, अवसाद, श्वास व कफ विकार।"
      },
      "Cancer": {
        "en": "Own Sign: Nurturing personality, beloved of mother, fertile imagination.",
        "hi": "स्वराशि (कर्क): अत्यंत स्नेही, मातृभक्त, कल्पनाशील तथा समृद्ध।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Jupiter",
        "conditionEn": "With or aspected by Jupiter",
        "conditionHi": "गुरु की युति या दृष्टि",
        "effectEn": "Gajakesari yoga: Undisputed fame, scholarly dignity, royal honors.",
        "effectHi": "गजकेसरी योग: सर्वमान्य कीर्ति, विद्वता, राजसम्मान तथा अखंड ऐश्वर्य।"
      },
      {
        "graha": "Saturn",
        "conditionEn": "With Saturn",
        "conditionHi": "शनि से युति (विष योग)",
        "effectEn": "Visha yoga: Melancholic thoughts, maternal suffering, emotional isolation.",
        "effectHi": "विष योग: मानसिक विषाद, माता को कष्ट, एकाकीपन की भावना।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, extraordinarily graceful, fertile, deeply intuitive, beloved wife and nurturing mother, charming persona.",
      "hi": "स्त्री जातक में अनुपम लावण्य, उर्वरता, गहन अंतर्ज्ञान, आदर्श गृहिणी व ममतामयी माता।"
    }
  },
  {
    "planet": "Moon",
    "planetHi": "चन्द्रमा",
    "house": 2,
    "titleEn": "Moon in 2nd House (Dhana Bhava)",
    "titleHi": "चन्द्रमा द्वितीय भाव (धन भाव) में",
    "baseEn": "Sweet-spoken, melodious voice, fond of fine dining, wealthy, attractive face, close to maternal family. Flourishes in finance, arts, dairy, or food industry.",
    "baseHi": "मधुरभाषी, सुरीला कंठ, मिष्ठान्न व सुरुचिपूर्ण भोजनप्रिय, धनवान, सुंदर मुख, ननिहाल पक्ष से स्नेह। वित्त, ललित कला, दुग्ध व्यवसाय में सफलता।",
    "ageMilestones": [
      {
        "age": 18,
        "nature": "career",
        "eventEn": "Financial emergence through family or commercial speech.",
        "eventHi": "पारिवारिक व्यवसाय या वाणी से धनार्जन का प्रारंभ।"
      },
      {
        "age": 27,
        "nature": "favorable",
        "eventEn": "Substantial wealth accumulation and family prosperity.",
        "eventHi": "विपुल धन संचय तथा कुटुंब में मांगलिक उत्सव।"
      }
    ],
    "signModifiers": {
      "Taurus": {
        "en": "Exalted: Vast treasures of gold, silver, jewels, and liquid assets.",
        "hi": "उच्च राशि: स्वर्ण, रजत, रत्नों तथा विपुल चल संपत्ति का स्वामी।"
      },
      "Scorpio": {
        "en": "Debilitated: Harsh slips of tongue under stress, financial volatility.",
        "hi": "नीच राशि: भावावेश में कटु वाणी, आर्थिक स्थिति में उतार-चढ़ाव।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Mercury",
        "conditionEn": "Aspected by Mercury",
        "conditionHi": "बुध की दृष्टि",
        "effectEn": "Supreme literary oratory, poetic genius, commercial mastery.",
        "effectHi": "अद्भुत वक्तृत्व कला, काव्य प्रतिभा, वाणिज्य में निपुण।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, sweet melodic voice, generous hostess, lover of jewelry, peaceful domestic financial stability.",
      "hi": "स्त्री जातक में मधुर कंठ, कुशल आतिथ्य, आभूषण प्रेमी, कुटुंब में शांति व आर्थिक संपन्नता।"
    }
  },
  {
    "planet": "Moon",
    "planetHi": "चन्द्रमा",
    "house": 3,
    "titleEn": "Moon in 3rd House (Sahaja Bhava)",
    "titleHi": "चन्द्रमा तृतीय भाव (सहज भाव) में",
    "baseEn": "Fond of artistic writing, music, travel, supportive sisters. Gentle valor, excels in communication, journalism, and creative handicrafts.",
    "baseHi": "कलात्मक लेखन, संगीत, यात्राप्रिय, बहनों से विशेष स्नेह। सौम्य पराक्रम, जनसंचार, पत्रकारिता तथा हस्तशिल्प में सिद्धहस्त।",
    "ageMilestones": [
      {
        "age": 20,
        "nature": "career",
        "eventEn": "Literary or artistic breakthrough, successful short journeys.",
        "eventHi": "साहित्यिक या कलात्मक क्षेत्र में पहचान, लाभदायक लघु यात्राएं।"
      },
      {
        "age": 24,
        "nature": "favorable",
        "eventEn": "Rise in fame through media, publishing, or commerce.",
        "eventHi": "मीडिया, प्रकाशन या व्यापार द्वारा प्रतिष्ठा का विस्तार।"
      }
    ],
    "signModifiers": {
      "Taurus": {
        "en": "Exalted: Eminent author, brilliant orator, devoted younger siblings.",
        "hi": "उच्च राशि: ख्यातिलब्ध लेखक, अद्भुत वक्ता, सहोदरों का पूर्ण सुख।"
      },
      "Scorpio": {
        "en": "Debilitated: Sibling friction, anxiety during travels, nervous arms/shoulders.",
        "hi": "नीच राशि: सहोदरों से मनमुटाव, यात्रा में भय, कंधों में दुर्बलता।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Mars",
        "conditionEn": "Aspected by Mars",
        "conditionHi": "मंगल की दृष्टि",
        "effectEn": "Dynamic courage, adventurous ventures, athletic success.",
        "effectHi": "अदम्य साहस, साहसिक यात्राएं, खेलकूद में सफलता।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, talented in fine arts, affectionate towards sisters, graceful communication style.",
      "hi": "स्त्री जातक में ललित कलाओं में दक्ष, बहनों से अगाध स्नेह, मनभावन संवाद शैली।"
    }
  },
  {
    "planet": "Moon",
    "planetHi": "चन्द्रमा",
    "house": 4,
    "titleEn": "Moon in 4th House (Sukha Bhava)",
    "titleHi": "चन्द्रमा चतुर्थ भाव (सुख भाव) में",
    "baseEn": "Exceptional maternal affection, palace-like homes, comfortable vehicles, profound peace of mind. Highly sensitive to domestic atmosphere and water elements.",
    "baseHi": "अगाध मातृसुख, सुंदर व भव्य भवन, उत्तम वाहन, मानसिक शांति। गृह के वातावरण व जलीय तत्वों के प्रति विशेष संवेदनशील।",
    "ageMilestones": [
      {
        "age": 24,
        "nature": "favorable",
        "eventEn": "Acquisition of splendid home or luxury vehicle.",
        "eventHi": "भव्य गृह अथवा नवीन वाहन का सुखद योग।"
      },
      {
        "age": 36,
        "nature": "favorable",
        "eventEn": "Maternal blessings, domestic expansion, emotional contentment.",
        "eventHi": "मातृ कृपा, पारिवारिक समृद्धि तथा मानसिक शांति का चरमोत्कर्ष।"
      }
    ],
    "signModifiers": {
      "Cancer": {
        "en": "Own Sign: Unconditional maternal bliss, waterside home, pristine peace.",
        "hi": "स्वराशि: अनुपम मातृ सुख, जलाशय के निकट सुंदर वास, अगाध मानसिक शांति।"
      },
      "Scorpio": {
        "en": "Debilitated: Disturbed domestic peace, maternal health sorrow, emotional distress.",
        "hi": "नीच राशि: गृह सुख में न्यूनता, माता को कष्ट, मानसिक उद्वेग।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Jupiter",
        "conditionEn": "Aspected by Jupiter",
        "conditionHi": "गुरु की दृष्टि",
        "effectEn": "Blessed with saintly mother, palatial estate, absolute peace.",
        "effectHi": "सदाचारी माता, विशाल प्रासाद तुल्य गृह, परम संतोष।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, quintessential ideal homemaker, revered by family, generous mother, peaceful household atmosphere.",
      "hi": "स्त्री जातक में आदर्श कुलवधू, गृहलक्ष्मी, स्नेहमयी माता, घर में सुख-शांति की संरक्षिका।"
    }
  },
  {
    "planet": "Moon",
    "planetHi": "चन्द्रमा",
    "house": 5,
    "titleEn": "Moon in 5th House (Suta Bhava)",
    "titleHi": "चन्द्रमा पंचम भाव (संतान व बुद्धि भाव) में",
    "baseEn": "Brilliant poetic imagination, tender heart, devotion to divine Mother, more female progeny, intuitive advisor, virtuous children.",
    "baseHi": "उर्वर काव्य प्रतिभा, कोमल हृदय, भगवती की कृपा, कन्या संतति की अधिकता, अंतर्ज्ञानी सलाहकार, सदाचारी संतान।",
    "ageMilestones": [
      {
        "age": 20,
        "nature": "favorable",
        "eventEn": "Scholarly distinction, blossoming of creative talents.",
        "eventHi": "अकादमिक व कलात्मक प्रतिभा का प्रस्फुटन।"
      },
      {
        "age": 28,
        "nature": "favorable",
        "eventEn": "Birth of a fortunate child, speculative or advisory gains.",
        "eventHi": "सुलक्षण संतान का जन्म, परामर्श या बौद्धिक कार्यों से लाभ।"
      }
    ],
    "signModifiers": {
      "Taurus": {
        "en": "Exalted: Supreme creative genius, illustrious children, divine mantra siddhi.",
        "hi": "उच्च राशि: अद्भुत सृजनात्मक प्रतिभा, प्रतापी संतान, मंत्र सिद्धि।"
      },
      "Scorpio": {
        "en": "Debilitated: Emotional anguish regarding children, digestive sensitivity.",
        "hi": "नीच राशि: संतान पक्ष से चिंता, उदर व पाचन दुर्बलता।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Jupiter",
        "conditionEn": "Aspected by Jupiter",
        "conditionHi": "गुरु की दृष्टि",
        "effectEn": "Scholarly children, profound spiritual intuition, minister or advisor.",
        "effectHi": "विद्वान व दीर्घायु संतान, आध्यात्मिक ज्ञान, उच्च सलाहकार।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, blessed with cultured children, deeply intuitive mother, tender-hearted, artistic sensibilities.",
      "hi": "स्त्री जातक में सुसंस्कृत संतान का सुख, संवेदनशील व ममतालु हृदय, कलात्मक अभिरुचि।"
    }
  },
  {
    "planet": "Moon",
    "planetHi": "चन्द्रमा",
    "house": 6,
    "titleEn": "Moon in 6th House (Ripu Bhava)",
    "titleHi": "चन्द्रमा षष्ठ भाव (रोग व शत्रु भाव) में",
    "baseEn": "Fragile digestion, prone to colds, respiratory congestion, and water-borne ailments. Subdued rivals through gentle diplomacy; maternal uncle requires care.",
    "baseHi": "जठराग्नि मंद, कफ, शीत तथा जलजनित रोगों की संवेदनशीलता। सौम्य व्यवहार से विरोधियों का शमन; ननिहाल पक्ष के प्रति सतर्कता।",
    "ageMilestones": [
      {
        "age": 18,
        "nature": "health",
        "eventEn": "Cold, pulmonary sensitivity, or water-related vulnerability.",
        "eventHi": "शीत विकार, कफ या जल जनित रोगों से सतर्कता।"
      },
      {
        "age": 36,
        "nature": "favorable",
        "eventEn": "Triumph over competition through patient perseverance.",
        "eventHi": "धैर्य व विनम्रता से शत्रुओं व बाधाओं पर विजय।"
      }
    ],
    "signModifiers": {
      "Taurus": {
        "en": "Exalted: Robust recovery power, easily overcomes debts and disputes.",
        "hi": "उच्च राशि: शीघ्र रोगमुक्ति, ऋण व विवादों पर सहज नियंत्रण।"
      },
      "Scorpio": {
        "en": "Debilitated: Chronic anxiety, digestive or urinary vulnerability.",
        "hi": "नीच राशि: निरंतर मानसिक चिंता, आंतों या मूत्राशय में शिथिलता।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Saturn",
        "conditionEn": "With Saturn",
        "conditionHi": "शनि से युति",
        "effectEn": "Protracted phlegmatic ailments, workplace friction, melancholia.",
        "effectHi": "दीर्घकालीन कफ विकार, कार्यक्षेत्र में असहयोग, मानसिक अवसाद।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, needs care regarding hormonal and digestive cycles; excels in healthcare, nursing, and empathetic service.",
      "hi": "स्त्री जातक में मासिक व पाचन संतुलन पर ध्यान आवश्यक; चिकित्सा, परिचर्या व सेवा कार्यों में अत्यंत सफल।"
    }
  },
  {
    "planet": "Moon",
    "planetHi": "चन्द्रमा",
    "house": 7,
    "titleEn": "Moon in 7th House (Kalatra Bhava)",
    "titleHi": "चन्द्रमा सप्तम भाव (कलत्र व जाया भाव) में",
    "baseEn": "Charming, romantic, beautiful spouse, passionate love life, early marriage if well-placed. Fluctuations in marital moods; successful in public dealings, trade, and partnerships.",
    "baseHi": "सुंदर, आकर्षक व भावुक जीवनसाथी, सुखी दांपत्य, समय पर विवाह का योग। दांपत्य में कभी-कभी भावुकता की अधिकता; जनसंपर्क, व्यापार व साझेदारी में लाभ।",
    "ageMilestones": [
      {
        "age": 21,
        "nature": "favorable",
        "eventEn": "Romantic engagement or initiation of fortunate business partnership.",
        "eventHi": "प्रेम संबंध, विवाह वार्ता अथवा शुभ व्यापारिक साझेदारी।"
      },
      {
        "age": 25,
        "nature": "favorable",
        "eventEn": "Marital bliss and substantial expansion in public trade.",
        "eventHi": "दांपत्य सुख तथा जनव्यापार में विशेष प्रगति।"
      }
    ],
    "signModifiers": {
      "Taurus": {
        "en": "Exalted: Exceptionally handsome/beautiful and wealthy spouse, lifelong marital joy.",
        "hi": "उच्च राशि: अत्यंत रूपवान व धनी जीवनसाथी, अखंड दांपत्य सुख।"
      },
      "Scorpio": {
        "en": "Debilitated: Marital insecurities, emotional turbulence with spouse.",
        "hi": "नीच राशि: दांपत्य में अविश्वास, जीवनसाथी के स्वास्थ्य की चिंता।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Jupiter",
        "conditionEn": "Aspected by Jupiter",
        "conditionHi": "गुरु की दृष्टि",
        "effectEn": "Highly virtuous, devoted partner, social honor, noble alliance.",
        "effectHi": "सदाचारी व निष्ठावान जीवनसाथी, समाज में उच्च प्रतिष्ठा।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, devoted and handsome husband, emotional bonding, prosperous matrimonial home.",
      "hi": "स्त्री जातक में सुंदर व स्नेही पति, प्रगाढ़ भावनात्मक संबंध, समृद्ध ससुराल।"
    }
  },
  {
    "planet": "Moon",
    "planetHi": "चन्द्रमा",
    "house": 8,
    "titleEn": "Moon in 8th House (Ayu Bhava)",
    "titleHi": "चन्द्रमा अष्टम भाव (आयु व रंध्र भाव) में",
    "baseEn": "Psychic intuition, interest in occult sciences, water hazards, fluctuating vitality in youth (Balarishta if afflicted). Sudden financial windfalls through legacy or spouse.",
    "baseHi": "गहन अंतर्ज्ञान, गुप्त विद्याओं व तंत्र में रुचि, जल से सतर्कता, बाल्यावस्था में स्वास्थ्य दुर्बलता। जीवनसाथी या वसीयत से आकस्मिक धन लाभ।",
    "ageMilestones": [
      {
        "age": 8,
        "nature": "health",
        "eventEn": "Childhood health vulnerability (respiratory or water-related).",
        "eventHi": "बाल्यावस्था में स्वास्थ्य कष्ट (जल या कफ जनित)।"
      },
      {
        "age": 32,
        "nature": "favorable",
        "eventEn": "Inheritance, sudden legacy, or profound occult awakening.",
        "eventHi": "अचानक वसीयत से लाभ अथवा आध्यात्मिक अंतर्दृष्टि का उदय।"
      }
    ],
    "signModifiers": {
      "Taurus": {
        "en": "Exalted: Long life, massive unexpected inheritance, peaceful mind.",
        "hi": "उच्च राशि: दीर्घायु, अप्रत्याशित पैतृक संपत्ति, मानसिक स्थिरता।"
      },
      "Scorpio": {
        "en": "Debilitated: Deep anxiety, hysteria, phobias, digestive-water imbalances.",
        "hi": "नीच राशि: गहन मानसिक भय, फोबिया, जल व कफ असंतुलन।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Jupiter",
        "conditionEn": "Aspected by Jupiter",
        "conditionHi": "गुरु की दृष्टि",
        "effectEn": "Neutralizes Balarishta, bestows longevity and occult wisdom.",
        "effectHi": "बालारिष्ट दोष का शमन, दीर्घायु तथा आध्यात्मिक ज्ञान।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, emotional sensitivity, requires emotional support during hormonal transitions, inheritance from in-laws.",
      "hi": "स्त्री जातक में अत्यधिक भावुकता, ससुराल पक्ष से धन लाभ, मानसिक संबल की आवश्यकता।"
    }
  },
  {
    "planet": "Moon",
    "planetHi": "चन्द्रमा",
    "house": 9,
    "titleEn": "Moon in 9th House (Dharma Bhava)",
    "titleHi": "चन्द्रमा नवम भाव (धर्म व भाग्य भाव) में",
    "baseEn": "Highly fortunate (Bhagyashali), dharmic, charitable, fond of pilgrimages and overseas ocean voyages. Loving relationship with father, devoted to divine Mother.",
    "baseHi": "परम भाग्यशाली, धार्मिक, दानवीर, तीर्थाटन व समुद्री यात्राओं का प्रेमी। पिता से प्रगाढ़ स्नेह, कुलदेवी की विशेष कृपा।",
    "ageMilestones": [
      {
        "age": 16,
        "nature": "favorable",
        "eventEn": "Spiritual initiation and blessings from preceptors.",
        "eventHi": "धार्मिक संस्कार तथा गुरुजनों का वरदान।"
      },
      {
        "age": 24,
        "nature": "favorable",
        "eventEn": "Major fortune breakthrough, foreign pilgrimage or water voyage.",
        "eventHi": "विशाल भाग्योदय, तीर्थ यात्रा अथवा विदेशी जल यात्रा।"
      },
      {
        "age": 32,
        "nature": "career",
        "eventEn": "High public esteem, temple endowments, social leadership.",
        "eventHi": "सामाजिक मान-सम्मान, धार्मिक कार्यों में अग्रणी भूमिका।"
      }
    ],
    "signModifiers": {
      "Taurus": {
        "en": "Exalted: Sovereign fortune, divine grace, illustrious father, vast charitable works.",
        "hi": "उच्च राशि: अखंड सौभाग्य, ईश्वरीय कृपा, प्रतापी पिता, विशाल धर्मार्थ कार्य।"
      },
      "Scorpio": {
        "en": "Debilitated: Strained paternal relationship, doubts in faith, travel hindrances.",
        "hi": "नीच राशि: पिता से वैचारिक मतभेद, आस्था में विचलन, यात्राओं में विघ्न।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Jupiter",
        "conditionEn": "With or aspected by Jupiter",
        "conditionHi": "गुरु से युति या दृष्टि",
        "effectEn": "Supreme Dharmadhikari yoga, philanthropic leader, saintly fame.",
        "effectHi": "परम धर्माधिकारी योग, धर्मपरायण नेतृत्व, संत तुल्य आदर।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, extraordinarily blessed, brings prosperity to husband and children, saintly conduct, loves pilgrimage.",
      "hi": "स्त्री जातक में परम सौभाग्यवती, पति व संतान हेतु कल्याणकारी, सात्विक आचरण, तीर्थ प्रिय।"
    }
  },
  {
    "planet": "Moon",
    "planetHi": "चन्द्रमा",
    "house": 10,
    "titleEn": "Moon in 10th House (Karma Bhava)",
    "titleHi": "चन्द्रमा दशम भाव (कर्म व राज्य भाव) में",
    "baseEn": "Public renown, benevolent administrator, career connected to masses, liquids, trade, healthcare, or hospitality. Emotional dedication to profession, fluctuating yet prestigious status.",
    "baseHi": "लोकप्रियता, जनप्रिय प्रशासक, जनता, जल, व्यापार, चिकित्सा या आतिथ्य से जुड़ी आजीविका। कार्य के प्रति भावनात्मक समर्पण, प्रतिष्ठित पद।",
    "ageMilestones": [
      {
        "age": 24,
        "nature": "career",
        "eventEn": "Public recognition, professional elevation, governmental favor.",
        "eventHi": "कार्यक्षेत्र में सार्वजनिक पहचान, पदोन्नति, शासन से सहयोग।"
      },
      {
        "age": 36,
        "nature": "favorable",
        "eventEn": "Apex of professional acclaim and mass following.",
        "eventHi": "जनप्रियता व सामाजिक प्रतिष्ठा का चरमोत्कर्ष।"
      }
    ],
    "signModifiers": {
      "Taurus": {
        "en": "Exalted: Renowned statesman, beloved corporate leader, vast wealth.",
        "hi": "उच्च राशि: ख्यातिलब्ध राजनेता, लोकप्रिय अधिकारी, अटूट धन-संपदा।"
      },
      "Scorpio": {
        "en": "Debilitated: Professional defamation under scandal, public misunderstandings.",
        "hi": "नीच राशि: कार्यक्षेत्र में अपयश का भय, भावनात्मक अशांति।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Sun",
        "conditionEn": "With Sun",
        "conditionHi": "सूर्य से युति",
        "effectEn": "High state authority, royal favor, charismatic public leader.",
        "effectHi": "राजकीय सत्ता, उच्चाधिकारियों का स्नेह, ओजस्वी व्यक्तित्व।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, distinguished career, respected businesswoman or teacher, brings honor to family.",
      "hi": "स्त्री जातक में कार्यक्षेत्र में विशिष्ट प्रतिष्ठा, सफल अध्यापिका या व्यवसायी, कुल का गौरव।"
    }
  },
  {
    "planet": "Moon",
    "planetHi": "चन्द्रमा",
    "house": 11,
    "titleEn": "Moon in 11th House (Labha Bhava)",
    "titleHi": "चन्द्रमा एकादश भाव (लाभ व आय भाव) में",
    "baseEn": "Multifold gains, vast friendly circle, prosperous daughters and elder sisters, generous patronage, fulfilment of desires through artistic and public endeavors.",
    "baseHi": "बहुमुखी लाभ, विशाल मित्र मंडली, सुखी कन्या संतति व अग्रजा, मनोकामनाओं की पूर्ति, कला व जनसेवा से धनोपार्जन।",
    "ageMilestones": [
      {
        "age": 27,
        "nature": "favorable",
        "eventEn": "Substantial monetary accumulation, expansion of noble friendships.",
        "eventHi": "विपुल धन लाभ, उच्च मित्रों का सहयोग, व्यापार विस्तार।"
      },
      {
        "age": 36,
        "nature": "favorable",
        "eventEn": "Acquisition of assets, financial summit, community honor.",
        "eventHi": "स्थाई संपत्ति का लाभ, आर्थिक शिखर, समाज में प्रतिष्ठा।"
      }
    ],
    "signModifiers": {
      "Taurus": {
        "en": "Exalted: Multi-stream immense wealth, opulent lifestyle, noble friends.",
        "hi": "उच्च राशि: अनेक स्रोतों से विपुल धन, वैभवशाली जीवन, कुलीन मित्र।"
      },
      "Scorpio": {
        "en": "Debilitated: Deceit from false friends, fluctuating profits, anxiety over elder sister.",
        "hi": "नीच राशि: मित्रों से विश्वासघात, आय में अस्थिरता, अग्रजा की चिंता।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Venus",
        "conditionEn": "With Venus",
        "conditionHi": "शुक्र से युति",
        "effectEn": "Artistic wealth, luxury vehicles, high social circles.",
        "effectHi": "कला से धन, विलासिता के साधन, उच्च अभिजात्य वर्ग में उठक-बैठक।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, wealthy, loved by friends, fulfilled life desires, prosperous children.",
      "hi": "स्त्री जातक में अत्यधिक संपन्न, सखियों में प्रिय, मनोवांछित फल की प्राप्ति, सुखी संतान।"
    }
  },
  {
    "planet": "Moon",
    "planetHi": "चन्द्रमा",
    "house": 12,
    "titleEn": "Moon in 12th House (Vyaya Bhava)",
    "titleHi": "चन्द्रमा द्वादश भाव (व्यय व मोक्ष भाव) में",
    "baseEn": "Secluded spiritual seeker, expenditure on philanthropic and pilgrimage causes. Sensitive left eye, vivid dreams, foreign travel and settlement. Peaceful solitude.",
    "baseHi": "एकांतप्रिय आध्यात्मिक साधक, धर्मार्थ व तीर्थ यात्राओं पर व्यय। बाएं नेत्र में संवेदनशीलता, स्वप्नशीलता, विदेश वास का प्रबल योग। एकांत में मानसिक शांति।",
    "ageMilestones": [
      {
        "age": 25,
        "nature": "career",
        "eventEn": "Overseas journey or foreign educational/vocational venture.",
        "eventHi": "विदेश गमन अथवा सुदूर स्थानों में विद्या व आजीविका।"
      },
      {
        "age": 45,
        "nature": "favorable",
        "eventEn": "Spiritual detachment, higher meditation, philanthropic legacy.",
        "eventHi": "आध्यात्मिक विरक्ति, गहन ध्यान, परोपकार में जीवन का समर्पण।"
      }
    ],
    "signModifiers": {
      "Taurus": {
        "en": "Exalted: Foreign prosperity, peaceful meditation, charitable endowments.",
        "hi": "उच्च राशि: विदेश में अपार समृद्धि, शांत ध्यान, विशाल धर्मार्थ कार्य।"
      },
      "Scorpio": {
        "en": "Debilitated: Sleep disorders, emotional isolation, ocular and hospital expenses.",
        "hi": "नीच राशि: अनिद्रा, मानसिक अवसाद, नेत्र पीड़ा व चिकित्सा व्यय।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Jupiter",
        "conditionEn": "Aspected by Jupiter",
        "conditionHi": "गुरु की दृष्टि",
        "effectEn": "Moksha seeker, divine dreams, peaceful foreign abode.",
        "effectHi": "मोक्ष मार्ग की ओर अग्रसर, पवित्र स्वप्न, विदेश में सुखी वास।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, charitable, fond of solitude, sensitive emotions, abroad travel, needs sound sleep hygiene.",
      "hi": "स्त्री जातक में दानशीला, एकांतप्रिय, अत्यधिक भावुक, विदेश यात्रा, निद्रा पर ध्यान आवश्यक।"
    }
  },
  {
    "planet": "Mars",
    "planetHi": "मंगल",
    "house": 1,
    "titleEn": "Mars in 1st House (Lagna)",
    "titleHi": "मंगल प्रथम भाव (लग्न) में",
    "baseEn": "Bold, daring, energetic, impulsive nature, scars on head or face, muscular build, short-tempered. Ruchaka Mahapurusha yoga if in own or exalted sign. Prone to burns, wounds, and blood pressure spikes.",
    "baseHi": "साहसी, निर्भीक, ऊर्जावान, उग्र स्वभाव, मस्तक या मुख पर चोट का चिह्न, मांसल शरीर, क्रोधी। स्वराशि या उच्च राशि में होने पर रुचक महापुरुष योग। अग्नि, शस्त्र, रक्त विकार व रक्तचाप की संवेदनशीलता।",
    "ageMilestones": [
      {
        "age": 9,
        "nature": "health",
        "eventEn": "Vulnerability to head wound, cuts, or burning incident.",
        "eventHi": "शिर में चोट, कटने या अग्नि से आंशिक आघात का सतर्कता वर्ष।"
      },
      {
        "age": 19,
        "nature": "career",
        "eventEn": "Dawn of independent employment, military/police or technical victory.",
        "eventHi": "स्वतंत्र आजीविका का प्रारंभ, तकनीकी या रक्षा क्षेत्र में विजय।"
      },
      {
        "age": 28,
        "nature": "favorable",
        "eventEn": "Peak of courageous ambition and administrative or land acquisition.",
        "eventHi": "पराक्रम का चरमोत्कर्ष, प्रशासनिक पद अथवा भूमि-भवन की प्राप्ति।"
      }
    ],
    "signModifiers": {
      "Capricorn": {
        "en": "Exalted: Ruchaka Mahapurusha yoga: Supreme commander, invincible courage, vast properties.",
        "hi": "उच्च राशि (मकर): रुचक महापुरुष योग: सर्वोच्च सेनानायक, अजेय पराक्रम, विपुल अचल संपत्ति।"
      },
      "Cancer": {
        "en": "Debilitated: Impatience, reckless anger, blood disorders, conflicts with superiors.",
        "hi": "नीच राशि (कर्क): अधीरता, अकारण क्रोध, रक्त दोष, उच्चाधिकारियों से कलह।"
      },
      "Aries": {
        "en": "Own Sign: Dauntless courage, pioneer leadership, sports or defense renown.",
        "hi": "स्वराशि (मेष): अदम्य पराक्रम, अग्रणी नेतृत्व, खेल या रक्षा क्षेत्र में ख्याति।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Jupiter",
        "conditionEn": "Aspected by Jupiter",
        "conditionHi": "गुरु की दृष्टि",
        "effectEn": "Courage guided by righteous wisdom, high military or civil post, protector of the weak.",
        "effectHi": "विवेकपूर्ण पराक्रम, उच्च प्रशासनिक पद, दुर्बलों का रक्षक।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, dynamic personality, fearless, independent spirit, high physical vitality; requires patience in marital adjustments to avoid friction.",
      "hi": "स्त्री जातक में अत्यंत साहसी, निर्भीक, स्वतंत्र विचार, प्रचुर शारीरिक ऊर्जा; दांपत्य में धैर्य व सामंजस्य आवश्यक।"
    }
  },
  {
    "planet": "Mars",
    "planetHi": "मंगल",
    "house": 2,
    "titleEn": "Mars in 2nd House (Dhana Bhava)",
    "titleHi": "मंगल द्वितीय भाव (धन भाव) में",
    "baseEn": "Harsh, aggressive speech, financial fluctuations through impulsive investments, dental or throat ailments. Gains through metals, lands, or engineering; domestic disputes over family heritage.",
    "baseHi": "कटु व तीव्र वाणी, उतावली में धन व्यय, दंत या कंठ रोग की संवेदनशीलता। धातु, भूमि, इंजीनियरिंग से लाभ; पैतृक संपत्ति को लेकर कुटुंब में विवाद।",
    "ageMilestones": [
      {
        "age": 19,
        "nature": "career",
        "eventEn": "First major financial earning through independent technical or field work.",
        "eventHi": "तकनीकी या क्षेत्र कार्य द्वारा प्रथम स्वतंत्र धनार्जन।"
      },
      {
        "age": 28,
        "nature": "challenging",
        "eventEn": "Speech or property-induced conflict in domestic circle.",
        "eventHi": "कटु वाणी या संपत्ति विवाद के कारण कुटुंब में तनाव।"
      }
    ],
    "signModifiers": {
      "Capricorn": {
        "en": "Exalted: Enormous wealth through real estate, metallurgy, and executive authority.",
        "hi": "उच्च राशि: भू-संपत्ति, धातु उद्योग व प्रशासनिक अधिकारों से विपुल धनोपार्जन।"
      },
      "Cancer": {
        "en": "Debilitated: Heavy financial losses through litigation or speculative gambles, harsh speech.",
        "hi": "नीच राशि: मुकदमों या सट्टेबाजी में धनहानि, कटु वाणी से संबंध विच्छेद।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Jupiter",
        "conditionEn": "Aspected by Jupiter",
        "conditionHi": "गुरु की दृष्टि",
        "effectEn": "Controls aggressive speech, bestows lawful financial prosperity.",
        "effectHi": "वाणी में सौम्यता, धर्म सम्मत धन संचय तथा कुटुंब सुख।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, sharp tongue when provoked, strong financial grit, guardian of material assets, tact needed with in-laws.",
      "hi": "स्त्री जातक में स्पष्टवादी, आर्थिक रूप से सुदृढ़, धन संपदा की संरक्षिका, ससुराल पक्ष के साथ संयमित वाणी आवश्यक।"
    }
  },
  {
    "planet": "Mars",
    "planetHi": "मंगल",
    "house": 3,
    "titleEn": "Mars in 3rd House (Sahaja Bhava)",
    "titleHi": "मंगल तृतीय भाव (पराक्रम भाव) में",
    "baseEn": "Supreme valor, unshakeable courage, athletic champion, military or engineering prowess. Strained relations with younger brothers or fewer siblings. Triumphs over all rivals.",
    "baseHi": "अद्वितीय शौर्य, अदम्य साहस, कुशल खिलाड़ी, सेना या तकनीकी विद्या में अग्रणी। छोटे भाइयों से मतभेद अथवा उनकी संख्या अल्प। शत्रुओं का पूर्ण दमन।",
    "ageMilestones": [
      {
        "age": 17,
        "nature": "career",
        "eventEn": "Breakthrough in sports, technical competitions, or defense entrance.",
        "eventHi": "खेलकूद, तकनीकी प्रतियोगिता या रक्षा परीक्षा में सफलता।"
      },
      {
        "age": 28,
        "nature": "favorable",
        "eventEn": "Grand milestone in business, engineering venture, or heroic enterprise.",
        "eventHi": "व्यापार, इंजीनियरिंग उपक्रम या साहसिक कार्य में कीर्ति।"
      }
    ],
    "signModifiers": {
      "Capricorn": {
        "en": "Exalted: Invincible bravery, national sports or defense honors.",
        "hi": "उच्च राशि: अजेय पराक्रम, राष्ट्रीय स्तर पर खेल या सैन्य सम्मान।"
      },
      "Cancer": {
        "en": "Debilitated: Frustrated courage, arm fractures, friction with siblings.",
        "hi": "नीच राशि: सहोदरों से तनाव, भुजाओं में चोट, असमय आवेश।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Sun",
        "conditionEn": "With Sun",
        "conditionHi": "सूर्य से युति",
        "effectEn": "Blazing valor, state defense leadership, formidable hero.",
        "effectHi": "प्रचंड पराक्रम, राजकीय रक्षा कमान, दुर्जेय सेनानी।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, exceptionally courageous, protects siblings and family, skilled in technical arts and sports.",
      "hi": "स्त्री जातक में अत्यंत साहसी, परिवार की संरक्षिका, तकनीकी कलाओं व खेलकूद में कुशल।"
    }
  },
  {
    "planet": "Mars",
    "planetHi": "मंगल",
    "house": 4,
    "titleEn": "Mars in 4th House (Sukha Bhava)",
    "titleHi": "मंगल चतुर्थ भाव (सुख भाव) में (मांगलिक दोष)",
    "baseEn": "Mangalik dosha: Domestic unrest, friction with mother, property litigations, accident prone near home or vehicles. Massive landed assets if well placed in Capricorn or Aries.",
    "baseHi": "मांगलिक दोष: गृह सुख में अशांति, माता के स्वास्थ्य की चिंता, भूमि व वाहन को लेकर विवाद या दुर्घटना का भय। मकर या मेष में होने पर विपुल भू-संपत्ति का स्वामी।",
    "ageMilestones": [
      {
        "age": 8,
        "nature": "health",
        "eventEn": "Domestic disturbance or physical fall/injury near home.",
        "eventHi": "गृह में अशांति अथवा गिरने से शारीरिक चोट का भय।"
      },
      {
        "age": 28,
        "nature": "challenging",
        "eventEn": "Relocation, domestic overhaul, or major property transaction.",
        "eventHi": "गृह परिवर्तन, मकान का निर्माण अथवा भूमि संबंधी बड़ा सौदा।"
      }
    ],
    "signModifiers": {
      "Capricorn": {
        "en": "Exalted: Palatial mansions, expansive agricultural lands, high vehicles.",
        "hi": "उच्च राशि: विशाल प्रासाद, कृषि भूमि का स्वामित्व, उत्तम वाहन।"
      },
      "Cancer": {
        "en": "Debilitated: Maternal suffering, broken home atmosphere, vehicle damage.",
        "hi": "नीच राशि: माता को गंभीर कष्ट, गृह क्लेश, वाहन से दुर्घटना।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Jupiter",
        "conditionEn": "Aspected by Jupiter",
        "conditionHi": "गुरु की दृष्टि",
        "effectEn": "Mitigates Mangalik dosha, protects maternal longevity and peace.",
        "effectHi": "मांगलिक दोष का शमन, माता की दीर्घायु तथा घर में शांति।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, strong-willed domestic management, property rights, requires tact to preserve domestic harmony and peace with partner.",
      "hi": "स्त्री जातक में गृह प्रबंधन में कठोरता, संपत्ति अधिकार, दांपत्य शांति हेतु सामंजस्य आवश्यक।"
    }
  },
  {
    "planet": "Mars",
    "planetHi": "मंगल",
    "house": 5,
    "titleEn": "Mars in 5th House (Suta Bhava)",
    "titleHi": "मंगल पंचम भाव (संतान व बुद्धि भाव) में",
    "baseEn": "Fierce intellect, speculative boldness, short temper, delay or complications in progeny, prone to stomach heat and digestive acidity. Sharp technical student.",
    "baseHi": "उग्र प्रज्ञा, सट्टेबाजी या जोखिम भरे निवेश में साहस, त्वरित क्रोध, संतान प्राप्ति में विलंब या कष्ट, उदर में पित्त व गर्मी। तकनीकी विद्या में मेधावी।",
    "ageMilestones": [
      {
        "age": 21,
        "nature": "career",
        "eventEn": "Intense academic competition, engineering or technical triumph.",
        "eventHi": "तीव्र बौद्धिक प्रतिस्पर्धा, इंजीनियरिंग या तकनीकी परीक्षा में विजय।"
      },
      {
        "age": 28,
        "nature": "favorable",
        "eventEn": "Birth of a bold child, success in calculated speculative venture.",
        "eventHi": "तेजस्वी संतान का जन्म, साहसिक वित्तीय उपक्रम में लाभ।"
      }
    ],
    "signModifiers": {
      "Capricorn": {
        "en": "Exalted: Genius engineering mind, illustrious progeny, high speculative gains.",
        "hi": "उच्च राशि: तकनीकी प्रतिभा, प्रतापी संतान, वित्तीय उपक्रमों में भारी लाभ।"
      },
      "Cancer": {
        "en": "Debilitated: Complications in pregnancy, abdominal surgery, academic setbacks.",
        "hi": "नीच राशि: गर्भस्त्राव का भय, उदर में शल्य चिकित्सा (सर्जरी), विद्या में बाधा।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Jupiter",
        "conditionEn": "Aspected by Jupiter",
        "conditionHi": "गुरु की दृष्टि",
        "effectEn": "Shields progeny, bestows righteous high intellect and speculative wisdom.",
        "effectHi": "संतान की रक्षा, सद्बुद्धि तथा बौद्धिक कार्यों में यश।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, gynecological care required during pregnancy, caesarean section indication, fierce mother, brilliant sharp mind.",
      "hi": "स्त्री जातक में गर्भावस्था में विशेष सावधानी, शल्य प्रसव (सिजेरियन) का योग, साहसी माता, कुशाग्र बुद्धि।"
    }
  },
  {
    "planet": "Mars",
    "planetHi": "मंगल",
    "house": 6,
    "titleEn": "Mars in 6th House (Ripu Bhava)",
    "titleHi": "मंगल षष्ठ भाव (शत्रु व रोग भाव) में",
    "baseEn": "Supreme Shatruhanta, completely crushes enemies and competitors, robust immunity, triumph in litigation, defense, surgery, and sports. Strong digestion.",
    "baseHi": "परम शत्रुहंता, विरोधियों व षड्यंत्रकारियों का समूल नाश, अदम्य रोग प्रतिरोधक क्षमता, मुकदमे, रक्षा, शल्य चिकित्सा व खेल में विजय। तीव्र जठराग्नि।",
    "ageMilestones": [
      {
        "age": 21,
        "nature": "career",
        "eventEn": "Historic victory in competitive examination, sports, or legal fight.",
        "eventHi": "प्रतियोगी परीक्षा, खेल या विधिक संघर्ष में ऐतिहासिक विजय।"
      },
      {
        "age": 27,
        "nature": "favorable",
        "eventEn": "Total annihilation of competitors and clearance of long-standing debts.",
        "eventHi": "शत्रुओं पर पूर्ण विजय तथा पुराने ऋणों से मुक्ति।"
      }
    ],
    "signModifiers": {
      "Capricorn": {
        "en": "Exalted: Unconquerable warrior, top rank in defense or judiciary, fearless.",
        "hi": "उच्च राशि: अजेय योद्धा, रक्षा या न्याय प्रशासन में सर्वोच्च स्थान, निर्भीक।"
      },
      "Cancer": {
        "en": "Debilitated: Blood impurities, surgical operations, troublesome disputes.",
        "hi": "नीच राशि: रक्त विकार, शल्य क्रिया, विवादों में उलझने का भय।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Saturn",
        "conditionEn": "With Saturn",
        "conditionHi": "शनि से युति",
        "effectEn": "Fierce endurance, overcomes monumental conspiracies after hard struggle.",
        "effectHi": "कठोर संघर्ष के उपरांत भारी षड्यंत्रों को परास्त करने वाला।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, iron resilience, overcomes workplace hurdles easily, dominant over competitors, prone to acidity.",
      "hi": "स्त्री जातक में अपार कार्यक्षमता, कार्यक्षेत्र की बाधाओं को परास्त करने वाली, प्रतिस्पर्धियों पर हावी, पित्त संवेदनशीलता।"
    }
  },
  {
    "planet": "Mars",
    "planetHi": "मंगल",
    "house": 7,
    "titleEn": "Mars in 7th House (Kalatra Bhava)",
    "titleHi": "मंगल सप्तम भाव (कलत्र भाव) में (मांगलिक दोष)",
    "baseEn": "Severe Mangalik dosha: Intense marital friction, passionate but short-tempered spouse, early marriage disputes, friction in commercial partnerships.",
    "baseHi": "तीव्र मांगलिक दोष: दांपत्य में मतभेद, जीवनसाथी उग्र व क्रोधी स्वभाव का, विवाह में विलंब या कलह, व्यापारिक साझेदारी में तनाव।",
    "ageMilestones": [
      {
        "age": 27,
        "nature": "challenging",
        "eventEn": "Crucial marital crossroad or partnership trial requiring high patience.",
        "eventHi": "दांपत्य जीवन या व्यापारिक साझेदारी में गंभीर परीक्षा का वर्ष।"
      },
      {
        "age": 32,
        "nature": "favorable",
        "eventEn": "Resolution of marital adjustments or profitable independent trade.",
        "eventHi": "दांपत्य में सामंजस्य तथा स्वतंत्र व्यापार में प्रगति।"
      }
    ],
    "signModifiers": {
      "Capricorn": {
        "en": "Exalted: Highly dynamic, affluent, and high-status spouse; cancels Mangalik severity.",
        "hi": "उच्च राशि: अत्यंत कर्मठ, प्रतिष्ठित व समृद्ध जीवनसाथी; मांगलिक दोष का परिहार।"
      },
      "Cancer": {
        "en": "Debilitated: Severe marital discord, separation risk, spouse fragile health.",
        "hi": "नीच राशि: तीव्र दांपत्य कलह, अलगाव का जोखिम, जीवनसाथी का दुर्बल स्वास्थ्य।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Jupiter",
        "conditionEn": "Aspected by Jupiter",
        "conditionHi": "गुरु की दृष्टि",
        "effectEn": "Cancels malefic Mangalik effects, secures marital longevity and mutual respect.",
        "effectHi": "मांगलिक दोष का पूर्ण परिहार, दांपत्य की रक्षा व सम्मान।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, dominant husband, marital adjustments require high tact, early marriage tensions settled in mature years.",
      "hi": "स्त्री जातक में पति प्रभावशाली व तेज स्वभाव का, दांपत्य में धैर्य आवश्यक, उत्तरार्ध में शांति।"
    }
  },
  {
    "planet": "Mars",
    "planetHi": "मंगल",
    "house": 8,
    "titleEn": "Mars in 8th House (Ayu Bhava)",
    "titleHi": "मंगल अष्टम भाव (आयु व रंध्र भाव) में (मांगलिक दोष)",
    "baseEn": "Intense Mangalik dosha: Surgical interventions, piles/fistula, blood disorders, accident risk from fire, vehicles, or weapons. Sudden financial windfalls or legacy disputes.",
    "baseHi": "तीव्र मांगलिक दोष: शल्य चिकित्सा (ऑपरेशन), बवासीर, रक्त विकार, अग्नि, वाहन या शस्त्र से चोट का भय। आकस्मिक धन लाभ अथवा वसीयत को लेकर विवाद।",
    "ageMilestones": [
      {
        "age": 14,
        "nature": "health",
        "eventEn": "Vulnerability to cuts, burns, or physical injury.",
        "eventHi": "अग्नि, शस्त्र या गिरने से चोट का सतर्कता वर्ष।"
      },
      {
        "age": 28,
        "nature": "health",
        "eventEn": "Surgical operation, blood purification, or transformative crisis.",
        "eventHi": "शल्य क्रिया, रक्त विकार या जीवन में बड़ा रूपांतरण।"
      },
      {
        "age": 35,
        "nature": "favorable",
        "eventEn": "Sudden financial windfall through insurance, legacy, or research.",
        "eventHi": "बीमा, वसीयत या गुप्त शोध से अचानक बड़ा धन लाभ।"
      }
    ],
    "signModifiers": {
      "Capricorn": {
        "en": "Exalted: Robust longevity, massive unexpected inheritance, successful surgery.",
        "hi": "उच्च राशि: दीर्घायु, अप्रत्याशित पैतृक संपत्ति, शल्य क्रिया में पूर्ण सफलता।"
      },
      "Cancer": {
        "en": "Debilitated: Critical health vulnerabilities, chronic blood disorders, accidents.",
        "hi": "नीच राशि: स्वास्थ्य के प्रति अत्यधिक सतर्कता, रक्त विकार, दुर्घटना का भय।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Jupiter",
        "conditionEn": "Aspected by Jupiter",
        "conditionHi": "गुरु की दृष्टि",
        "effectEn": "Shields vitality, saves life during critical hazards, deep metaphysical research.",
        "effectHi": "प्राणों की रक्षा, गंभीर संकटों से बचाव, गूढ़ वैज्ञानिक शोध।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, gynecological health care needed, marital caution regarding spouse health, sudden inheritance.",
      "hi": "स्त्री जातक में जननेंद्रिय व मासिक धर्म का विशेष ध्यान, पति के स्वास्थ्य के प्रति सजगता, आकस्मिक धन लाभ।"
    }
  },
  {
    "planet": "Mars",
    "planetHi": "मंगल",
    "house": 9,
    "titleEn": "Mars in 9th House (Dharma Bhava)",
    "titleHi": "मंगल नवम भाव (धर्म व भाग्य भाव) में",
    "baseEn": "Independent religious beliefs, conflict with orthodox dogmas or father, courageous explorer, fortunes through machinery, real estate, and foreign enterprise.",
    "baseHi": "स्वतंत्र धार्मिक विचार, पिता या पारंपरिक मान्यताओं से वैचारिक मतभेद, साहसी अन्वेषक, तकनीकी मशीनरी, भूमि व विदेश व्यापार से भाग्योदय।",
    "ageMilestones": [
      {
        "age": 28,
        "nature": "career",
        "eventEn": "Major breakthrough in fortunes through independent enterprise or relocation.",
        "eventHi": "स्वतंत्र उपक्रम अथवा स्थान परिवर्तन से महत्वपूर्ण भाग्योदय।"
      },
      {
        "age": 38,
        "nature": "favorable",
        "eventEn": "Establishment of prestigious estate, leadership in legal or industrial field.",
        "eventHi": "प्रतिष्ठित उद्योग या संपत्ति की स्थापना, सामाजिक प्रतिष्ठा।"
      }
    ],
    "signModifiers": {
      "Capricorn": {
        "en": "Exalted: Supreme fortune through land, defense, and high administrative posts.",
        "hi": "उच्च राशि: भू-संपत्ति, रक्षा व उच्च प्रशासनिक पदों से असाधारण भाग्योदय।"
      },
      "Cancer": {
        "en": "Debilitated: Strained paternal relationship, obstacles in higher education, travel hazards.",
        "hi": "नीच राशि: पिता से मतभेद, उच्च शिक्षा में विघ्न, यात्रा में कष्ट।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Jupiter",
        "conditionEn": "Aspected by Jupiter",
        "conditionHi": "गुरु की दृष्टि",
        "effectEn": "Righteous warrior, dharmic leadership, deep spiritual conviction.",
        "effectHi": "धर्म योद्धा, सात्विक नेतृत्व, शास्त्रों के प्रति निष्ठा।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, strong independent convictions, ambitious, travels for work, supports righteous causes.",
      "hi": "स्त्री जातक में स्वतंत्र विचार, उच्च महत्वाकांक्षा, कार्य हेतु यात्राएं, न्याय व धर्म की पक्षधर।"
    }
  },
  {
    "planet": "Mars",
    "planetHi": "मंगल",
    "house": 10,
    "titleEn": "Mars in 10th House (Karma Bhava)",
    "titleHi": "मंगल दशम भाव (कर्म व राज्य भाव) में",
    "baseEn": "Supreme Kuladipaka yoga, highest directional strength (Digbala). Dominant government rank, military commander, top surgeon, engineering tycoon, unstoppable authority.",
    "baseHi": "सर्वोच्च कुलादीपक योग, दशम भाव में मंगल को पूर्ण दिग्बल प्राप्त होता है। सेनानायक, उच्च प्रशासनिक पद, प्रसिद्ध सर्जन, इंजीनियरिंग उद्योगपति, सर्वमान्य प्रतिष्ठा।",
    "ageMilestones": [
      {
        "age": 21,
        "nature": "career",
        "eventEn": "First major breakthrough into professional ranks or prestigious academy.",
        "eventHi": "प्रतिष्ठित संस्थान या राजकीय सेवा में प्रथम प्रवेश।"
      },
      {
        "age": 28,
        "nature": "favorable",
        "eventEn": "Landmark promotion, national honors, supreme executive triumph.",
        "eventHi": "ऐतिहासिक पदोन्नति, राष्ट्रीय सम्मान, सर्वोच्च प्रशासनिक विजय।"
      }
    ],
    "signModifiers": {
      "Capricorn": {
        "en": "Exalted: Ruchaka Mahapurusha yoga: Supreme commander of armed forces, minister.",
        "hi": "उच्च राशि (मकर): रुचक महापुरुष योग: सेना या पुलिस का शीर्ष कमांडर, मंत्री तुल्य अधिकार।"
      },
      "Cancer": {
        "en": "Debilitated: Professional friction, fall from authority under impulse, reckless actions.",
        "hi": "नीच राशि: कार्यक्षेत्र में विवाद, आवेश में पदहानि, अधिकारियों से अनबन।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Sun",
        "conditionEn": "With Sun",
        "conditionHi": "सूर्य से युति",
        "effectEn": "Royal commander, high government authority, fearlessness in public duty.",
        "effectHi": "राजकीय सत्ता, सर्वोच्च प्रशासनिक अधिकार, कर्तव्य में निडर।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, outstanding corporate or civil administrative career, commanding authority, high executive distinction.",
      "hi": "स्त्री जातक में कॉर्पोरेट या सिविल सेवा में सर्वोच्च पद, नेतृत्वकारी व्यक्तित्व, कार्यक्षेत्र में दबदबा।"
    }
  },
  {
    "planet": "Mars",
    "planetHi": "मंगल",
    "house": 11,
    "titleEn": "Mars in 11th House (Labha Bhava)",
    "titleHi": "मंगल एकादश भाव (लाभ भाव) में",
    "baseEn": "Immense accumulation of wealth, multi-stream profits from real estate, metallurgy, defense, and trade. Brave elder siblings, ambitious goals fulfilled.",
    "baseHi": "अपार धन संचय, भू-संपत्ति, धातु उद्योग, ठेकेदारी व व्यापार से बहुमुखी लाभ। साहसी अग्रज, सभी महत्वाकांक्षी योजनाओं की पूर्ण सफलता।",
    "ageMilestones": [
      {
        "age": 28,
        "nature": "favorable",
        "eventEn": "Major financial windfall through real estate, engineering, or contracting.",
        "eventHi": "भूमि, भवन या तकनीकी ठेकेदारी से विपुल धन लाभ।"
      },
      {
        "age": 36,
        "nature": "favorable",
        "eventEn": "Consolidation of vast assets, influential industrial networks.",
        "eventHi": "विशाल संपत्तियों का स्थायित्व, उद्योगपतियों में प्रतिष्ठा।"
      }
    ],
    "signModifiers": {
      "Capricorn": {
        "en": "Exalted: Multi-millionaire status, massive real estate holdings, political clout.",
        "hi": "उच्च राशि: अरबपति योग, विपुल भू-संपत्ति, राजनीतिक व प्रशासनिक प्रभाव।"
      },
      "Cancer": {
        "en": "Debilitated: Strained relations with elder brother, fluctuating profits, debt recovery friction.",
        "hi": "नीच राशि: अग्रज से मतभेद, लाभ में उतार-चढ़ाव, धन वसूली में विवाद।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Jupiter",
        "conditionEn": "Aspected by Jupiter",
        "conditionHi": "गुरु की दृष्टि",
        "effectEn": "Righteous and eternal wealth, high public philanthropy.",
        "effectHi": "धर्म सम्मत अक्षय धन, विशाल लोक कल्याणकारी कार्य।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, highly affluent, fearless decision maker, prosperous investments, commanding social standing.",
      "hi": "स्त्री जातक में अत्यधिक संपन्न, साहसी वित्तीय निर्णय, सफल निवेश, समाज में ऊंचा मान-सम्मान।"
    }
  },
  {
    "planet": "Mars",
    "planetHi": "मंगल",
    "house": 12,
    "titleEn": "Mars in 12th House (Vyaya Bhava)",
    "titleHi": "मंगल द्वादश भाव (व्यय व मोक्ष भाव) में (मांगलिक दोष)",
    "baseEn": "Kuja dosha: Heavy expenditure on litigation, hospitalisation, or property disputes. Left eye sensitivity, insomnia, danger from secret foes, foreign residence.",
    "baseHi": "मांगलिक दोष: मुकदमों, चिकित्सा अथवा भूमि विवादों में भारी व्यय। बाएं नेत्र में विकार, अनिद्रा, गुप्त शत्रुओं का भय, विदेश वास का योग।",
    "ageMilestones": [
      {
        "age": 27,
        "nature": "challenging",
        "eventEn": "Unexpected financial expenditure or overseas travel friction.",
        "eventHi": "अकस्मात भारी व्यय अथवा विदेश प्रवास में कठिनाई।"
      },
      {
        "age": 45,
        "nature": "favorable",
        "eventEn": "Settlement in foreign land, spiritual detachment, victory over hidden obstacles.",
        "eventHi": "विदेश में स्थायित्व, आध्यात्मिक विरक्ति, गुप्त बाधाओं का शमन।"
      }
    ],
    "signModifiers": {
      "Capricorn": {
        "en": "Exalted: High success and prosperity in overseas operations or defense exports.",
        "hi": "उच्च राशि: विदेशी उपक्रमों या तकनीकी निर्यात में भारी सफलता।"
      },
      "Cancer": {
        "en": "Debilitated: Severe hospital bills, legal penalties, sleep disorders.",
        "hi": "नीच राशि: चिकित्सालय का भारी व्यय, विधिक दंड, गंभीर अनिद्रा।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Jupiter",
        "conditionEn": "Aspected by Jupiter",
        "conditionHi": "गुरु की दृष्टि",
        "effectEn": "Controls expenditures, protects from hospitalisation, noble spiritual charities.",
        "effectHi": "अनावश्यक व्यय पर रोक, रोगों से रक्षा, धर्मार्थ कार्यों में दान।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, marital adjustments needed, emotional secrecy, eye strain, requires calm sleep hygiene.",
      "hi": "स्त्री जातक में दांपत्य में संयम आवश्यक, भावुकता, नेत्र पीड़ा, शांतिपूर्ण निद्रा का ध्यान रखें।"
    }
  },
  {
    "planet": "Mercury",
    "planetHi": "बुध",
    "house": 1,
    "titleEn": "Mercury in 1st House (Lagna)",
    "titleHi": "बुध प्रथम भाव (लग्न) में",
    "baseEn": "Youthful appearance, witty, highly intellectual, mathematical acumen, charming communicator, humorous nature, longevity. Bhadra Mahapurusha yoga if in Gemini or Virgo.",
    "baseHi": "सदा युवा दिखने वाला स्वरूप, तीक्ष्ण बुद्धि, गणितीय मेधा, आकर्षक वक्ता, हास्य-विनोद प्रिय, दीर्घायु। मिथुन या कन्या में होने पर भद्र महापुरुष योग।",
    "ageMilestones": [
      {
        "age": 16,
        "nature": "career",
        "eventEn": "Exceptional academic brilliance, competitive distinction.",
        "eventHi": "अकादमिक व बौद्धिक प्रतियोगिताओं में असाधारण सफलता।"
      },
      {
        "age": 20,
        "nature": "career",
        "eventEn": "Dawn of commercial, software, or media career.",
        "eventHi": "वाणिज्य, सॉफ्टवेयर, मीडिया या लेखन में स्वतंत्र आजीविका का प्रारंभ।"
      },
      {
        "age": 32,
        "nature": "favorable",
        "eventEn": "High literary acclaim, commercial success, and wide influence.",
        "eventHi": "साहित्यिक प्रतिष्ठा, व्यापारिक विस्तार तथा विद्वत समाज में सम्मान।"
      }
    ],
    "signModifiers": {
      "Virgo": {
        "en": "Exalted: Bhadra Mahapurusha yoga: Supreme intellectual, master mathematician, diplomat.",
        "hi": "उच्च राशि (कन्या): भद्र महापुरुष योग: अद्वितीय विद्वान, गणितज्ञ, कुशल राजनयिक।"
      },
      "Pisces": {
        "en": "Debilitated: Nervous anxiety, lack of concentration, speech hesitation under stress.",
        "hi": "नीच राशि (मीन): स्नायु दुर्बलता, एकाग्रता की कमी, तनाव में वाणी में संकोच।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Jupiter",
        "conditionEn": "With or aspected by Jupiter",
        "conditionHi": "गुरु से युति या दृष्टि",
        "effectEn": "Saraswati yoga: Master of all shastras, revered teacher, supreme wisdom.",
        "effectHi": "सरस्वती योग: सर्वशास्त्र पारंगत, आदरणीय गुरु, परम प्रज्ञा।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, brilliant intellect, articulate, charming, proficient in arts, accounts, and domestic management.",
      "hi": "स्त्री जातक में कुशाग्र बुद्धि, वाक्पटु, आकर्षक, कला, संगीत व गृह प्रबंधन में सिद्धहस्त।"
    }
  },
  {
    "planet": "Mercury",
    "planetHi": "बुध",
    "house": 2,
    "titleEn": "Mercury in 2nd House (Dhana Bhava)",
    "titleHi": "बुध द्वितीय भाव (धन भाव) में",
    "baseEn": "Eloquent orator, earns wealth through intellect, commerce, accounting, and advisory. Sweet-spoken, fond of learning, family prosperity.",
    "baseHi": "अद्भुत वक्ता, बुद्धि, वाणिज्य, लेखाकर्म तथा परामर्श द्वारा प्रचुर धनोपार्जन। मधुरभाषी, विद्या व्यसनी, कुटुंब में सुख-समृद्धि।",
    "ageMilestones": [
      {
        "age": 15,
        "nature": "favorable",
        "eventEn": "Early literary, speech, or mathematical awards.",
        "eventHi": "साहित्य, भाषण या गणितीय प्रतियोगिताओं में प्रारंभिक पुरस्कार।"
      },
      {
        "age": 25,
        "nature": "favorable",
        "eventEn": "Substantial commercial wealth accumulation through advisory or trading.",
        "eventHi": "परामर्श या व्यापारिक कार्यों से विपुल धन संचय।"
      }
    ],
    "signModifiers": {
      "Virgo": {
        "en": "Exalted: Immense wealth through banking, corporate advisory, and trade.",
        "hi": "उच्च राशि: बैंकिंग, कॉर्पोरेट सलाहकार व व्यापार से विपुल धनोपार्जन।"
      },
      "Pisces": {
        "en": "Debilitated: Financial losses through miscalculations, speech slips.",
        "hi": "नीच राशि: गलत गणना से व्यापार में हानि, वाणी में कटुता।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Venus",
        "conditionEn": "With Venus",
        "conditionHi": "शुक्र से युति",
        "effectEn": "Poetic genius, artistic commerce, charming voice.",
        "effectHi": "काव्य प्रतिभा, कलात्मक व्यापार, मधुर व सम्मोहक वाणी।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, sweet melodious speech, proficient accountant for the home, charming conversation.",
      "hi": "स्त्री जातक में मधुर व मनभावन वाणी, पारिवारिक बजट व वित्त प्रबंधन में कुशल।"
    }
  },
  {
    "planet": "Mercury",
    "planetHi": "बुध",
    "house": 3,
    "titleEn": "Mercury in 3rd House (Sahaja Bhava)",
    "titleHi": "बुध तृतीय भाव (सहज भाव) में",
    "baseEn": "Skilled writer, journalist, fond of siblings, curious, communicative, agile hands, successful in IT, media, and publishing.",
    "baseHi": "कुशल लेखक, पत्रकार, सहोदरों से स्नेह, जिज्ञासु, संवादप्रिय, दक्ष हस्तकला, आईटी, मीडिया व प्रकाशन में विशेष सफल।",
    "ageMilestones": [
      {
        "age": 15,
        "nature": "favorable",
        "eventEn": "Early publication, writing distinction, agile communication.",
        "eventHi": "प्रारंभिक लेखन, प्रकाशन अथवा बौद्धिक प्रतियोगिताओं में ख्याति।"
      },
      {
        "age": 22,
        "nature": "career",
        "eventEn": "Professional breakthrough in media, publishing, software, or marketing.",
        "eventHi": "मीडिया, प्रकाशन, सॉफ्टवेयर या मार्केटिंग में करियर का उदय।"
      }
    ],
    "signModifiers": {
      "Virgo": {
        "en": "Exalted: Celebrated author, brilliant coder, devoted younger siblings.",
        "hi": "उच्च राशि: ख्यातिलब्ध लेखक, अद्वितीय सॉफ्टवेयर प्रोग्रामर, सहोदरों का सुख।"
      },
      "Pisces": {
        "en": "Debilitated: Nervous arm/hand tremors, communication misunderstandings.",
        "hi": "नीच राशि: हाथों में कंपन, संवाद में गलतफहमियां, सहोदरों से मतभेद।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Jupiter",
        "conditionEn": "Aspected by Jupiter",
        "conditionHi": "गुरु की दृष्टि",
        "effectEn": "High philosophical authorship, respected publisher, noble courageous mind.",
        "effectHi": "दार्शनिक लेखन, सम्मानित प्रकाशक, सात्विक पराक्रम।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, literary aptitude, close sisterly ties, creative talents, witty personality.",
      "hi": "स्त्री जातक में साहित्यिक अभिरुचि, बहनों से प्रगाढ़ स्नेह, कलात्मक व विनोदप्रिय स्वभाव।"
    }
  },
  {
    "planet": "Mercury",
    "planetHi": "बुध",
    "house": 4,
    "titleEn": "Mercury in 4th House (Sukha Bhava)",
    "titleHi": "बुध चतुर्थ भाव (सुख भाव) में",
    "baseEn": "High formal education, intellectual mother, fine conveyances, beautiful home library, peace of mind through knowledge.",
    "baseHi": "उच्च औपचारिक शिक्षा, विदुषी माता, सुंदर वाहन, गृह में अध्ययन कक्ष/पुस्तकालय, ज्ञान द्वारा मानसिक शांति।",
    "ageMilestones": [
      {
        "age": 16,
        "nature": "career",
        "eventEn": "Exceptional academic degree progress, scholastic honors.",
        "eventHi": "अकादमिक परीक्षाओं में सर्वोच्च अंक व सम्मान।"
      },
      {
        "age": 32,
        "nature": "favorable",
        "eventEn": "Acquisition of splendid home, vehicle, intellectual haven.",
        "eventHi": "सुंदर मकान, वाहन तथा समृद्ध गृह सुख की प्राप्ति।"
      }
    ],
    "signModifiers": {
      "Virgo": {
        "en": "Exalted: Vast landed estates, scholarly environment, prestigious degrees.",
        "hi": "उच्च राशि: विशाल भवन, विद्वतापूर्ण पारिवारिक वातावरण, उच्च उपाधियां।"
      },
      "Pisces": {
        "en": "Debilitated: Interrupted education, domestic misunderstandings, vehicle breakdowns.",
        "hi": "नीच राशि: शिक्षा में व्यवधान, गृह क्लेश, वाहन में खराबी।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Jupiter",
        "conditionEn": "Aspected by Jupiter",
        "conditionHi": "गुरु की दृष्टि",
        "effectEn": "Supreme educational excellence, saintly mother, serene home.",
        "effectHi": "सर्वोच्च शिक्षा, सुसंस्कृत माता, सुख-शांति से परिपूर्ण गृह।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, highly educated, cultured home environment, respected by relatives, loving mother.",
      "hi": "स्त्री जातक में उच्च शिक्षिता, सुसंस्कृत गृहस्थी, परिजनों में आदरणीय, आदर्श माता।"
    }
  },
  {
    "planet": "Mercury",
    "planetHi": "बुध",
    "house": 5,
    "titleEn": "Mercury in 5th House (Suta Bhava)",
    "titleHi": "बुध पंचम भाव (संतान व बुद्धि भाव) में",
    "baseEn": "Brilliant memory, fertile intellect, mantra siddhi, advisor to rulers, cultured children, excels in mathematics, astrology, and stock analytics.",
    "baseHi": "अद्भुत स्मरण शक्ति, कुशाग्र मेधा, मंत्र सिद्धि, शासन का सलाहकार, सुसंस्कृत संतान, गणित, ज्योतिष व शेयर विश्लेषण में सिद्धहस्त।",
    "ageMilestones": [
      {
        "age": 16,
        "nature": "favorable",
        "eventEn": "Intellectual distinction in competitive mathematics or analytics.",
        "eventHi": "गणित या विश्लेषणात्मक प्रतियोगिताओं में विशिष्ट स्थान।"
      },
      {
        "age": 26,
        "nature": "favorable",
        "eventEn": "Publication of scholarly work, birth of intelligent child.",
        "eventHi": "विद्वत्तापूर्ण ग्रंथ का प्रकाशन, मेधावी संतान का जन्म।"
      }
    ],
    "signModifiers": {
      "Virgo": {
        "en": "Exalted: Genius intellect, national advisory rank, brilliant progeny.",
        "hi": "उच्च राशि: विलक्षण प्रतिभा, राष्ट्रीय स्तर पर सलाहकार, अत्यंत मेधावी संतान।"
      },
      "Pisces": {
        "en": "Debilitated: Mental restlessness, memory lapses under pressure, anxiety over children.",
        "hi": "नीच राशि: मानसिक चंचलता, परीक्षा में घबराहट, संतान की चिंता।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Sun",
        "conditionEn": "With Sun (Budhaditya Yoga)",
        "conditionHi": "सूर्य से युति (बुधादित्य योग)",
        "effectEn": "Budhaditya yoga: Regal intellect, administrative brilliance, societal fame.",
        "effectHi": "बुधादित्य योग: राजसी प्रज्ञा, प्रशासनिक दक्षता, समाज में उच्च ख्याति।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, highly intelligent children, graceful demeanor, wise counsellor in family and community.",
      "hi": "स्त्री जातक में कुशाग्र मेधावी संतान, गरिमामयी व्यक्तित्व, परिवार में सुयोग्य परामर्शदात्री।"
    }
  },
  {
    "planet": "Mercury",
    "planetHi": "बुध",
    "house": 6,
    "titleEn": "Mercury in 6th House (Ripu Bhava)",
    "titleHi": "बुध षष्ठ भाव (रोग व शत्रु भाव) में",
    "baseEn": "Sharp debate skills, analytical problem solver, skin or nervous system sensitivity, overcomes rivals through intellect and legal arbitration.",
    "baseHi": "तर्क-वितर्क में निपुण, विश्लेषणात्मक समाधानकर्ता, त्वचा या स्नायु तंत्र की संवेदनशीलता, प्रज्ञा व विधिक मध्यस्थता से शत्रुओं पर विजय।",
    "ageMilestones": [
      {
        "age": 21,
        "nature": "career",
        "eventEn": "Triumph in competitive interviews, analytical examinations.",
        "eventHi": "प्रतियोगी साक्षात्कार व विश्लेषणात्मक परीक्षाओं में विजय।"
      },
      {
        "age": 35,
        "nature": "favorable",
        "eventEn": "Decisive settlement of legal disputes, workplace promotion.",
        "eventHi": "विधिक विवादों का शांतिपूर्ण समाधान, कार्यक्षेत्र में पदोन्नति।"
      }
    ],
    "signModifiers": {
      "Virgo": {
        "en": "Exalted: Complete triumph over enemies through legal intellect, robust health.",
        "hi": "उच्च राशि: कानूनी प्रज्ञा से शत्रुओं का दमन, उत्तम स्वास्थ्य।"
      },
      "Pisces": {
        "en": "Debilitated: Nervous exhaustion, skin allergies, workplace misunderstandings.",
        "hi": "नीच राशि: स्नायु दुर्बलता, त्वचा रोग, कार्यक्षेत्र में गलतफहमियां।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Saturn",
        "conditionEn": "With Saturn",
        "conditionHi": "शनि से युति",
        "effectEn": "Painstaking analytical labor, overcomes long litigations through documentation.",
        "effectHi": "कठोर दस्तावेजी परिश्रम, मुकदमों में साक्ष्यों द्वारा विजय।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, meticulous detail orientation, overcomes workplace rivals easily, nervous care required.",
      "hi": "स्त्री जातक में सूक्ष्म कार्यों में निपुण, कार्यक्षेत्र की प्रतिद्वंद्विता में सफल, स्नायु स्वास्थ्य पर ध्यान दें।"
    }
  },
  {
    "planet": "Mercury",
    "planetHi": "बुध",
    "house": 7,
    "titleEn": "Mercury in 7th House (Kalatra Bhava)",
    "titleHi": "बुध सप्तम भाव (कलत्र भाव) में",
    "baseEn": "Intelligent, charming, humorous spouse, successful in commerce, trade, and diplomatic contracts. Early fortunate marriage if unafflicted.",
    "baseHi": "विद्वान, सुंदर, विनोदप्रिय जीवनसाथी, व्यापार, वाणिज्य तथा कूटनीतिक समझौतों में भारी सफलता। शुभ प्रभाव में समय पर सुखी विवाह।",
    "ageMilestones": [
      {
        "age": 21,
        "nature": "favorable",
        "eventEn": "Early engagement, marriage, or commercial partnership alliance.",
        "eventHi": "शुभ विवाह वार्ता, दांपत्य अथवा व्यावसायिक साझेदारी का प्रारंभ।"
      },
      {
        "age": 28,
        "nature": "favorable",
        "eventEn": "Expansion of joint business, domestic happiness and mutual growth.",
        "eventHi": "संयुक्त व्यापार में विस्तार, दांपत्य सुख तथा प्रतिष्ठा में वृद्धि।"
      }
    ],
    "signModifiers": {
      "Virgo": {
        "en": "Exalted: Exceptionally wealthy, intellectual spouse; flourishing commercial empire.",
        "hi": "उच्च राशि: अत्यंत संपन्न व विदुषी जीवनसाथी; व्यापारिक साम्राज्य का विस्तार।"
      },
      "Pisces": {
        "en": "Debilitated: Misunderstandings with spouse, deceit in trade partnerships.",
        "hi": "नीच राशि: दांपत्य में संवादहीनता, व्यापारिक साझेदारी में धोखे का भय।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Jupiter",
        "conditionEn": "Aspected by Jupiter",
        "conditionHi": "गुरु की दृष्टि",
        "effectEn": "Highly cultured and righteous spouse, prosperous and peaceful marriage.",
        "effectHi": "अत्यंत संस्कारी व धर्मात्मा जीवनसाथी, सुखी व समृद्ध दांपत्य।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, intelligent handsome husband, harmonious marriage, commercial acumen, shared intellectual interests.",
      "hi": "स्त्री जातक में रूपवान व बुद्धिमान पति, मधुर दांपत्य, व्यापारिक सूझबूझ, परस्पर बौद्धिक सामंजस्य।"
    }
  },
  {
    "planet": "Mercury",
    "planetHi": "बुध",
    "house": 8,
    "titleEn": "Mercury in 8th House (Ayu Bhava)",
    "titleHi": "बुध अष्टम भाव (आयु व रंध्र भाव) में",
    "baseEn": "Long life, famous, inheritance through intellectual works or maternal legacy, nervous sensitivity, profound research capability.",
    "baseHi": "दीर्घायु, प्रसिद्ध, बौद्धिक कार्यों या ननिहाल से संपत्ति, स्नायु संवेदनशीलता, गूढ़ अनुसंधान व शोध में असाधारण दक्षता।",
    "ageMilestones": [
      {
        "age": 17,
        "nature": "health",
        "eventEn": "Nervous tension, speech hesitation, or childhood health check.",
        "eventHi": "स्नायु तनाव या बाल्यावस्था में स्वास्थ्य सतर्कता।"
      },
      {
        "age": 35,
        "nature": "favorable",
        "eventEn": "Sudden financial inheritance, major research breakthrough.",
        "eventHi": "अचानक वसीयत से लाभ अथवा शोध में अंतरराष्ट्रीय ख्याति।"
      }
    ],
    "signModifiers": {
      "Virgo": {
        "en": "Exalted: Very long life, vast legacies, supreme research discoveries.",
        "hi": "उच्च राशि: सुदीर्घ जीवन, विपुल पैतृक लाभ, सर्वोच्च वैज्ञानिक खोजें।"
      },
      "Pisces": {
        "en": "Debilitated: Nervous disorders, legal disputes over inheritance, anxiety.",
        "hi": "नीच राशि: स्नायु विकार, वसीयत को लेकर विवाद, निरंतर चिंता।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Jupiter",
        "conditionEn": "Aspected by Jupiter",
        "conditionHi": "गुरु की दृष्टि",
        "effectEn": "Shields vitality, bestows deep occult wisdom and peaceful longevity.",
        "effectHi": "प्राण रक्षा, गूढ़ आध्यात्मिक ज्ञान तथा शांत व सुदीर्घ जीवन।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, long-lived, scholarly, calm temperament, sudden financial windfalls through in-laws.",
      "hi": "स्त्री जातक में दीर्घायु, विदुषी, शांत स्वभाव, ससुराल पक्ष से धन लाभ।"
    }
  },
  {
    "planet": "Mercury",
    "planetHi": "बुध",
    "house": 9,
    "titleEn": "Mercury in 9th House (Dharma Bhava)",
    "titleHi": "बुध नवम भाव (धर्म व भाग्य भाव) में",
    "baseEn": "Scholarly, religious writer, fortunate father, publisher, philanthropist, pilgrim, higher academic achievements.",
    "baseHi": "विद्वान, धार्मिक लेखक, सुखी पिता, प्रकाशक, दानवीर, तीर्थयात्री, उच्च अकादमिक उपाधियों की प्राप्ति।",
    "ageMilestones": [
      {
        "age": 16,
        "nature": "favorable",
        "eventEn": "Higher educational scholarship, spiritual initiation.",
        "eventHi": "उच्च शिक्षा हेतु छात्रवृत्ति, धार्मिक संस्कार।"
      },
      {
        "age": 24,
        "nature": "favorable",
        "eventEn": "Major fortune breakthrough through publication, trade, or travel.",
        "eventHi": "प्रकाशन, व्यापार या विदेश यात्रा से विशाल भाग्योदय।"
      },
      {
        "age": 32,
        "nature": "career",
        "eventEn": "Prestigious professorship, legal mastery, societal honors.",
        "eventHi": "विश्वविद्यालय में आचार्य पद, विधिक मान्यता, समाज में आदर।"
      }
    ],
    "signModifiers": {
      "Virgo": {
        "en": "Exalted: Supreme philosopher, internationally renowned author, pious father.",
        "hi": "उच्च राशि: परम दार्शनिक, अंतरराष्ट्रीय ख्याति प्राप्त लेखक, धर्मात्मा पिता।"
      },
      "Pisces": {
        "en": "Debilitated: Doubts in faith, interrupted higher studies, travel fatigue.",
        "hi": "नीच राशि: आस्था में संशय, उच्च शिक्षा में बाधा, यात्रा में कष्ट।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Jupiter",
        "conditionEn": "With or aspected by Jupiter",
        "conditionHi": "गुरु से युति या दृष्टि",
        "effectEn": "Supreme scholar, author of religious texts, universally respected.",
        "effectHi": "महापंडित, धर्मग्रंथों के प्रणेता, सर्वमान्य आदरणीय।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, pious, cultured, travels abroad for study or pilgrimage, charitable, brings luck to family.",
      "hi": "स्त्री जातक में धर्मपरायण, सुसंस्कृत, उच्च शिक्षा या तीर्थ हेतु यात्राएं, कुल हेतु सौभाग्यवर्धक।"
    }
  },
  {
    "planet": "Mercury",
    "planetHi": "बुध",
    "house": 10,
    "titleEn": "Mercury in 10th House (Karma Bhava)",
    "titleHi": "बुध दशम भाव (कर्म व राज्य भाव) में",
    "baseEn": "High administrative post, versatile profession, accountant, diplomat, famous author, merchant, state recognition.",
    "baseHi": "उच्च प्रशासनिक पद, बहुमुखी आजीविका, चार्टर्ड अकाउंटेंट, कुशल राजनयिक, ख्यातिलब्ध लेखक, सफल व्यापारी, राजकीय सम्मान।",
    "ageMilestones": [
      {
        "age": 16,
        "nature": "favorable",
        "eventEn": "Academic awards, early career orientation in commerce or IT.",
        "eventHi": "अकादमिक पुरस्कार, वाणिज्य या आईटी में आजीविका की दिशा।"
      },
      {
        "age": 25,
        "nature": "career",
        "eventEn": "High professional appointment, prestigious corporate role.",
        "eventHi": "उच्च पद पर नियुक्ति, प्रतिष्ठित कॉर्पोरेट जिम्मेदारी।"
      },
      {
        "age": 32,
        "nature": "career",
        "eventEn": "Zenith of professional acclaim, state advisory or business summit.",
        "eventHi": "कार्यक्षेत्र में शिखर सम्मान, राजकीय सलाहकार पद।"
      }
    ],
    "signModifiers": {
      "Virgo": {
        "en": "Exalted: Bhadra Mahapurusha yoga: Supreme statesman, corporate tycoon, celebrated diplomat.",
        "hi": "उच्च राशि (कन्या): भद्र महापुरुष योग: शीर्ष प्रशासक, व्यापारिक महाप्रबंधक, प्रसिद्ध राजनयिक।"
      },
      "Pisces": {
        "en": "Debilitated: Instability in profession, miscalculated business decisions.",
        "hi": "नीच राशि: आजीविका में बार-बार परिवर्तन, गलत गणना से व्यापार में हानि।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Jupiter",
        "conditionEn": "Aspected by Jupiter",
        "conditionHi": "गुरु की दृष्टि",
        "effectEn": "Undisputed repute, ethical executive authority, judicial honor.",
        "effectHi": "निष्कलंक प्रतिष्ठा, नैतिक प्रशासनिक शक्ति, न्यायिक सम्मान।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, highly accomplished career, respected writer, financial auditor, self-sufficient professional.",
      "hi": "स्त्री जातक में कार्यक्षेत्र में उच्च पद, प्रतिष्ठित लेखिका, वित्तीय प्रबंधक, आत्मनिर्भर व्यक्तित्व।"
    }
  },
  {
    "planet": "Mercury",
    "planetHi": "बुध",
    "house": 11,
    "titleEn": "Mercury in 11th House (Labha Bhava)",
    "titleHi": "बुध एकादश भाव (लाभ भाव) में",
    "baseEn": "Multi-stream income, intellectual friends, prosperous elder brother, commercial success, fulfilment of cherished aspirations.",
    "baseHi": "अनेक स्रोतों से नियमित आय, विद्वान व प्रभावशाली मित्र, सुखी अग्रज, व्यापार में निरंतर वृद्धि, सभी अभीष्टों की सिद्धि।",
    "ageMilestones": [
      {
        "age": 16,
        "nature": "favorable",
        "eventEn": "Early earnings through intellectual or creative skills.",
        "eventHi": "बौद्धिक या कलात्मक कौशल से प्रारंभिक धन लाभ।"
      },
      {
        "age": 27,
        "nature": "favorable",
        "eventEn": "Major financial milestone, expansion of profitable commercial networks.",
        "eventHi": "बड़ा आर्थिक मील का पत्थर, लाभदायक व्यापारिक नेटवर्क का विस्तार।"
      }
    ],
    "signModifiers": {
      "Virgo": {
        "en": "Exalted: Immense multi-stream wealth, opulent investments, noble friends.",
        "hi": "उच्च राशि: अथाह बहुमुखी संपत्ति, सफल निवेश, कुलीन व विद्वान मित्र।"
      },
      "Pisces": {
        "en": "Debilitated: Fluctuating profits, betrayal from false business associates.",
        "hi": "नीच राशि: आय में अस्थिरता, साझेदारी में सहयोगियों से विश्वासघात।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Venus",
        "conditionEn": "With Venus",
        "conditionHi": "शुक्र से युति",
        "effectEn": "Artistic and luxury business profits, glamorous lifestyle.",
        "effectHi": "कला व विलासिता व्यापार से प्रचुर लाभ, वैभवशाली जीवन।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, wealthy, intelligent friends, social popularity, fulfilled desires, flourishing finances.",
      "hi": "स्त्री जातक में अत्यधिक संपन्न, विदुषी सखियां, समाज में लोकप्रियता, मनोकामनाओं की पूर्ति।"
    }
  },
  {
    "planet": "Mercury",
    "planetHi": "बुध",
    "house": 12,
    "titleEn": "Mercury in 12th House (Vyaya Bhava)",
    "titleHi": "बुध द्वादश भाव (व्यय व मोक्ष भाव) में",
    "baseEn": "Eloquent in foreign lands, expenditure on education and spiritual literature, fond of seclusion, nervous sensitivity.",
    "baseHi": "विदेश में वाक्पटुता, शिक्षा व आध्यात्मिक साहित्य पर व्यय, एकांतप्रियता, स्नायु संवेदनशीलता, शोध हेतु विदेश वास।",
    "ageMilestones": [
      {
        "age": 25,
        "nature": "career",
        "eventEn": "Overseas education, foreign IT or commercial assignment.",
        "eventHi": "विदेश में उच्च शिक्षा, विदेशी आईटी या व्यापारिक कार्य।"
      },
      {
        "age": 36,
        "nature": "favorable",
        "eventEn": "Spiritual writing, philosophical breakthrough in seclusion.",
        "eventHi": "एकांत में आध्यात्मिक लेखन, दार्शनिक अनुसंधान में सफलता।"
      }
    ],
    "signModifiers": {
      "Virgo": {
        "en": "Exalted: Immense wealth earned abroad, philosophical publications, peaceful mind.",
        "hi": "उच्च राशि: विदेश में विपुल धनोपार्जन, आध्यात्मिक प्रकाशन, शांत मन।"
      },
      "Pisces": {
        "en": "Debilitated: Nervous strain, heavy educational expenses, communication errors abroad.",
        "hi": "नीच राशि: स्नायु तनाव, शिक्षा पर भारी व्यय, विदेश में गलतफहमियां।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Jupiter",
        "conditionEn": "Aspected by Jupiter",
        "conditionHi": "गुरु की दृष्टि",
        "effectEn": "High spiritual wisdom, philanthropic expenditures, peaceful foreign abode.",
        "effectHi": "उच्च आध्यात्मिक ज्ञान, धर्मार्थ व्यय, विदेश में सुखी वास।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, charitable, fond of quiet contemplation, sensitive nervous system, travel abroad.",
      "hi": "स्त्री जातक में दानशीला, एकांत में चिंतनप्रिय, संवेदनशील स्नायु तंत्र, विदेश गमन।"
    }
  },
  {
    "planet": "Jupiter",
    "planetHi": "बृहस्पति (गुरु)",
    "house": 1,
    "titleEn": "Jupiter in 1st House (Lagna)",
    "titleHi": "बृहस्पति प्रथम भाव (लग्न) में",
    "baseEn": "Noble character, majestic personality, golden complexion, wise, fortunate, Hamsa Mahapurusha yoga if in own or exalted sign. Divine protection across life, judicial authority.",
    "baseHi": "सदाचारी, तेजस्वी व भव्य व्यक्तित्व, गौर-स्वर्ण वर्ण, परम ज्ञानी, भाग्यवान, स्वराशि या उच्च में होने पर हंस महापुरुष योग। जीवनपर्यंत ईश्वरीय कृपा व रक्षा, न्यायप्रियता।",
    "ageMilestones": [
      {
        "age": 16,
        "nature": "favorable",
        "eventEn": "Early spiritual initiation, scholastic excellence, preceptor blessings.",
        "eventHi": "धार्मिक संस्कार, विद्या में सर्वोच्च स्थान, गुरुजनों का आशीर्वाद।"
      },
      {
        "age": 26,
        "nature": "favorable",
        "eventEn": "Major fortune dawn, prestigious marriage, or executive authority.",
        "eventHi": "विशाल भाग्योदय, कुलीन विवाह अथवा उच्च प्रशासनिक पद की प्राप्ति।"
      },
      {
        "age": 36,
        "nature": "career",
        "eventEn": "Apex of societal wisdom, ministerial rank, spiritual preceptor.",
        "eventHi": "समाज में सर्वोच्च गुरुतुल्य सम्मान, मंत्री पद या धर्मगुरु का स्थान।"
      }
    ],
    "signModifiers": {
      "Cancer": {
        "en": "Exalted: Hamsa Mahapurusha yoga: Supreme divine protection, world teacher, sovereign honor.",
        "hi": "उच्च राशि (कर्क): हंस महापुरुष योग: सर्वोच्च ईश्वरीय रक्षा, जगद्गुरु, राजसम्मान।"
      },
      "Capricorn": {
        "en": "Debilitated: Loss of moral dignity, liver ailments, skepticism, social alienation.",
        "hi": "नीच राशि (मकर): नैतिक संशय, यकृत (लीवर) विकार, परंपराओं से विमुखता।"
      },
      "Sagittarius": {
        "en": "Own Sign: Dharmic sovereign, spotless reputation, profound judicial wisdom.",
        "hi": "स्वराशि (धनु): धर्म ध्वजवाहक, निष्कलंक कीर्ति, अद्वितीय न्याय प्रज्ञा।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Sun",
        "conditionEn": "With or aspected by Sun",
        "conditionHi": "सूर्य से युति या दृष्टि",
        "effectEn": "Royal preceptor, high government advisory rank, noble soul.",
        "effectHi": "राजपुरोहित, शासन में सर्वोच्च सलाहकार, परम सात्विक आत्मा।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, extraordinarily virtuous, devoted wife, noble mother, revered by family and society, brings all-round prosperity.",
      "hi": "स्त्री जातक में परम विदुषी, पतिव्रता, आदर्श माता, परिवार व समाज में पूजनीया, सौभाग्यदायिनी।"
    }
  },
  {
    "planet": "Jupiter",
    "planetHi": "बृहस्पति (गुरु)",
    "house": 2,
    "titleEn": "Jupiter in 2nd House (Dhana Bhava)",
    "titleHi": "बृहस्पति द्वितीय भाव (धन भाव) में",
    "baseEn": "Impeccable speech, immense wealth, truthful, banker, astrologer, family prosperity, rich in gold and lands. Eloquent and scholarly voice.",
    "baseHi": "सत्य व मधुर वाणी, विपुल धन-धान्य, सत्यवादी, बैंकर, ज्योतिषी, कुटुंब में सुख-समृद्धि, स्वर्ण व भूमि का स्वामी। विद्वत्तापूर्ण वाणी।",
    "ageMilestones": [
      {
        "age": 16,
        "nature": "favorable",
        "eventEn": "Dawn of scholarship, family prosperity, academic honors.",
        "eventHi": "विद्या में प्रगति, कुटुंब में समृद्धि, अकादमिक सम्मान।"
      },
      {
        "age": 32,
        "nature": "favorable",
        "eventEn": "Financial summit, massive accumulation of gold and real estate.",
        "eventHi": "आर्थिक समृद्धि का शिखर, स्वर्ण व स्थाई संपत्तियों का विपुल संचय।"
      }
    ],
    "signModifiers": {
      "Cancer": {
        "en": "Exalted: Multi-millionaire, treasurer of immense wealth, saintly family.",
        "hi": "उच्च राशि: कुबेर तुल्य धन, अक्षय खजाने का स्वामी, सात्विक कुटुंब।"
      },
      "Capricorn": {
        "en": "Debilitated: Financial volatility, speech harshness under frustration.",
        "hi": "नीच राशि: धन संचय में बाधा, निराशा में वाणी में कटुता।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Sun",
        "conditionEn": "Aspected by Sun",
        "conditionHi": "सूर्य की दृष्टि",
        "effectEn": "Wealth from government treasuries, royal honors, high financial office.",
        "effectHi": "राजकोष से धन लाभ, राजकीय सम्मान, वित्त मंत्रालय में उच्च पद।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, eloquent, rich in gold and jewels, truthful, peaceful household, gracious hostess.",
      "hi": "स्त्री जातक में मधुर व सत्य वाणी, स्वर्ण व आभूषणों से संपन्न, कुल में शांति व समृद्धि।"
    }
  },
  {
    "planet": "Jupiter",
    "planetHi": "बृहस्पति (गुरु)",
    "house": 3,
    "titleEn": "Jupiter in 3rd House (Sahaja Bhava)",
    "titleHi": "बृहस्पति तृतीय भाव (सहज भाव) में",
    "baseEn": "Philosophical writings, modest siblings, spiritual travels, optimistic courage, excels in publishing, teaching, and spiritual treatises.",
    "baseHi": "दार्शनिक लेखन, सुसंस्कृत सहोदर, तीर्थ व ज्ञान यात्राएं, सात्विक पराक्रम, प्रकाशन, शिक्षण व आध्यात्मिक ग्रंथों में सफलता।",
    "ageMilestones": [
      {
        "age": 22,
        "nature": "career",
        "eventEn": "Publication of scholarly paper or initiation of spiritual teaching.",
        "eventHi": "शोध पत्र का प्रकाशन अथवा आध्यात्मिक शिक्षण का प्रारंभ।"
      },
      {
        "age": 35,
        "nature": "favorable",
        "eventEn": "High renown through literary authorship or successful spiritual travels.",
        "eventHi": "साहित्यिक लेखन या तीर्थ यात्राओं द्वारा प्रतिष्ठा का विस्तार।"
      }
    ],
    "signModifiers": {
      "Cancer": {
        "en": "Exalted: Celebrated spiritual author, devoted siblings, heroic righteous valor.",
        "hi": "उच्च राशि: ख्यातिलब्ध आध्यात्मिक लेखक, सहोदरों का पूर्ण सुख, धर्म पराक्रम।"
      },
      "Capricorn": {
        "en": "Debilitated: Strained relations with siblings, frustrated literary efforts.",
        "hi": "नीच राशि: सहोदरों से मतभेद, लेखन में निराशा, संकोची स्वभाव।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Mars",
        "conditionEn": "With Mars",
        "conditionHi": "मंगल से युति",
        "effectEn": "Righteous warrior, defense leadership, energetic intellectual champion.",
        "effectHi": "धर्म योद्धा, सेनानायक, ऊर्जावान बौद्धिक नेतृत्वकर्ता।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, modest, virtuous sisters, devoted to religious readings, graceful communication.",
      "hi": "स्त्री जातक में विदुषी, सुसंस्कृत बहनें, धार्मिक ग्रंथों के पठन में रुचि, सौम्य व्यवहार।"
    }
  },
  {
    "planet": "Jupiter",
    "planetHi": "बृहस्पति (गुरु)",
    "house": 4,
    "titleEn": "Jupiter in 4th House (Sukha Bhava)",
    "titleHi": "बृहस्पति चतुर्थ भाव (सुख भाव) में",
    "baseEn": "Vast lands, palace-like home, blessed saintly mother, scholarly degrees, divine peace of mind, luxurious conveyances.",
    "baseHi": "विशाल भू-संपत्ति, भव्य प्रासाद तुल्य गृह, परम सात्विक माता, उच्च अकादमिक उपाधियां, अगाध आत्मिक शांति, उत्तम वाहन।",
    "ageMilestones": [
      {
        "age": 16,
        "nature": "favorable",
        "eventEn": "Scholastic distinction, maternal blessings, home harmony.",
        "eventHi": "अकादमिक सर्वोच्चता, माता का अगाध स्नेह, पारिवारिक शांति।"
      },
      {
        "age": 22,
        "nature": "favorable",
        "eventEn": "Acquisition of splendid home or ancestral estate enhancement.",
        "eventHi": "सुंदर मकान, वाहन व पैतृक संपत्ति में सुखद वृद्धि।"
      },
      {
        "age": 38,
        "nature": "favorable",
        "eventEn": "Establishment of philanthropic foundation or spiritual retreat.",
        "eventHi": "धर्मार्थ संस्थान या आध्यात्मिक आश्रम की स्थापना।"
      }
    ],
    "signModifiers": {
      "Cancer": {
        "en": "Exalted: Palatial divine residence, saintly mother, unbroken happiness.",
        "hi": "उच्च राशि: देवतुल्य भव्य भवन, साध्वी माता, अखंड सुख-शांति।"
      },
      "Capricorn": {
        "en": "Debilitated: Discontent in domestic life, maternal liver ailments, property issues.",
        "hi": "नीच राशि: गृह सुख में असंतोष, माता को स्वास्थ्य कष्ट, भूमि विवाद।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Moon",
        "conditionEn": "With Moon (Gajakesari Yoga)",
        "conditionHi": "चन्द्रमा से युति (गजकेसरी योग)",
        "effectEn": "Supreme Gajakesari yoga: Immense comforts, royal status, universal love.",
        "effectHi": "सर्वोच्च गजकेसरी योग: अखंड सुख, राजसी ठाट-बाट, सर्वप्रियता।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, pure heart, prosperous home, blessed maternal happiness, revered family matriarch.",
      "hi": "स्त्री जातक में पवित्र हृदय, समृद्ध गृहस्थी, उत्तम मातृ सुख, कुल की आदरणीय संरक्षिका।"
    }
  },
  {
    "planet": "Jupiter",
    "planetHi": "बृहस्पति (गुरु)",
    "house": 5,
    "titleEn": "Jupiter in 5th House (Suta Bhava)",
    "titleHi": "बृहस्पति पंचम भाव (संतान व बुद्धि भाव) में",
    "baseEn": "Supreme intellect, Mantrajna, highly virtuous progeny, government minister, divine intuition. Karako Bhava Nashaya rule applies if single in 5th without aspects (delay in children).",
    "baseHi": "सर्वोच्च प्रज्ञा, मंत्रज्ञानी, परम सदाचारी संतान, राजकीय मंत्री, अंतर्ज्ञान। अकेले होने पर कारको भाव नाशाय नियम से संतान में विलंब संभव, किंतु संतति अत्यंत भाग्यवान होती है।",
    "ageMilestones": [
      {
        "age": 16,
        "nature": "favorable",
        "eventEn": "Spiritual mantra initiation, academic genius, state scholarship.",
        "eventHi": "मंत्र दीक्षा, अकादमिक मेधा, राजकीय छात्रवृत्ति।"
      },
      {
        "age": 28,
        "nature": "favorable",
        "eventEn": "Birth of illustrious child or major spiritual treatise creation.",
        "eventHi": "प्रतापी संतान का जन्म अथवा महान बौद्धिक ग्रंथ का निर्माण।"
      }
    ],
    "signModifiers": {
      "Cancer": {
        "en": "Exalted: Sovereign advisor, supreme spiritual intellect, noble children.",
        "hi": "उच्च राशि: शासन का शीर्ष नीति सलाहकार, दिव्य बुद्धि, प्रतापी संतान।"
      },
      "Capricorn": {
        "en": "Debilitated: Delay and anxiety regarding children, digestive weakness.",
        "hi": "नीच राशि: संतान प्राप्ति में विलंब व चिंता, पाचन दुर्बलता।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Sun",
        "conditionEn": "With Sun",
        "conditionHi": "सूर्य से युति",
        "effectEn": "Supreme minister, profound knowledge of political shastras.",
        "effectHi": "शीर्ष मंत्री पद, राजनीति व नीतिशास्त्रों का मर्मज्ञ।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, blessed with noble children, deep faith, virtuous intellect, respected counsellor.",
      "hi": "स्त्री जातक में सुलक्षण संतान, गहरी धार्मिक आस्था, प्रबुद्ध बुद्धि, परिवार में आदरणीय।"
    }
  },
  {
    "planet": "Jupiter",
    "planetHi": "बृहस्पति (गुरु)",
    "house": 6,
    "titleEn": "Jupiter in 6th House (Ripu Bhava)",
    "titleHi": "बृहस्पति षष्ठ भाव (रोग व शत्रु भाव) में",
    "baseEn": "Defeats enemies through wisdom, free from major adversaries, service-oriented. Liver, obesity, or diabetes vulnerability if afflicted. Gains through healthcare or judiciary.",
    "baseHi": "विवेक व शांति से शत्रुओं का शमन, विरोधियों से मुक्ति, सेवाभावी। पीड़ित होने पर यकृत (लीवर), मोटापा या मधुमेह की संवेदनशीलता। न्याय या चिकित्सा से लाभ।",
    "ageMilestones": [
      {
        "age": 24,
        "nature": "career",
        "eventEn": "Success in competitive examinations, entry into judicial or public service.",
        "eventHi": "प्रतियोगी परीक्षा में सफलता, न्यायिक या लोक सेवा में चयन।"
      },
      {
        "age": 40,
        "nature": "favorable",
        "eventEn": "Complete triumph over legal obstacles, peace with competitors.",
        "eventHi": "मुकदमों व विधिक विवादों का पूर्ण समाधान, शत्रुओं से शांति।"
      }
    ],
    "signModifiers": {
      "Cancer": {
        "en": "Exalted: Complete conquest of diseases and enemies through righteousness.",
        "hi": "उच्च राशि: धर्म व सत्य से सभी रोगों व शत्रुओं पर विजय।"
      },
      "Capricorn": {
        "en": "Debilitated: Chronic digestive or liver complications, workplace friction.",
        "hi": "नीच राशि: यकृत या पाचन विकार, कार्यक्षेत्र में विरोध।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Saturn",
        "conditionEn": "Aspected by Saturn",
        "conditionHi": "शनि की दृष्टि",
        "effectEn": "Long-standing legal settlement achieved through patience and truth.",
        "effectHi": "धैर्य व सत्य के मार्ग पर चलकर पुराने मुकदमों में विजय।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, health-conscious, dietary vigilance required, respected by coworkers, compassionate nurse/healer.",
      "hi": "स्त्री जातक में आहार व स्वास्थ्य के प्रति सजगता आवश्यक, कार्यक्षेत्र में आदर, सेवाभावी व्यक्तित्व।"
    }
  },
  {
    "planet": "Jupiter",
    "planetHi": "बृहस्पति (गुरु)",
    "house": 7,
    "titleEn": "Jupiter in 7th House (Kalatra Bhava)",
    "titleHi": "बृहस्पति सप्तम भाव (कलत्र भाव) में",
    "baseEn": "Beautiful, wise, virtuous spouse, harmonious marriage, fortunate after wedding, successful diplomacy, prestigious commercial alliances.",
    "baseHi": "विद्वान, सुंदर, सदाचारी जीवनसाथी, अखंड दांपत्य सुख, विवाह के उपरांत तीव्र भाग्योदय, सफल कूटनीति, प्रतिष्ठित व्यापारिक संबंध।",
    "ageMilestones": [
      {
        "age": 21,
        "nature": "favorable",
        "eventEn": "Auspicious marital engagement or fortunate trade partnership.",
        "eventHi": "मांगलिक विवाह वार्ता अथवा शुभ व्यापारिक साझेदारी।"
      },
      {
        "age": 28,
        "nature": "favorable",
        "eventEn": "Consolidation of matrimonial bliss, social prestige, and joint wealth.",
        "eventHi": "दांपत्य सुख, सामाजिक प्रतिष्ठा तथा संयुक्त धन का विस्तार।"
      }
    ],
    "signModifiers": {
      "Cancer": {
        "en": "Exalted: Exceptionally noble, saintly spouse, sovereign matrimonial fortune.",
        "hi": "उच्च राशि: अत्यंत संस्कारी व देवतुल्य जीवनसाथी, अखंड दांपत्य सौभाग्य।"
      },
      "Capricorn": {
        "en": "Debilitated: Differences of philosophy with spouse, delay in wedding.",
        "hi": "नीच राशि: वैचारिक मतभेद, विवाह में विलंब, जीवनसाथी के स्वास्थ्य की चिंता।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Moon",
        "conditionEn": "With Moon",
        "conditionHi": "चन्द्रमा से युति",
        "effectEn": "Gajakesari in 7th: Universal public acclaim, romantic and marital pinnacle.",
        "effectHi": "सप्तम में गजकेसरी: जनप्रियता, आदर्श प्रेम व दांपत्य का शिखर।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, supreme Pativrata yoga, highly fortunate husband, lifelong marital bliss, revered status in in-laws.",
      "hi": "स्त्री जातक में परम सौभाग्यवती, उच्च पदस्थ व धर्मात्मा पति, अखंड सौभाग्य, ससुराल में पूज्य।"
    }
  },
  {
    "planet": "Jupiter",
    "planetHi": "बृहस्पति (गुरु)",
    "house": 8,
    "titleEn": "Jupiter in 8th House (Ayu Bhava)",
    "titleHi": "बृहस्पति अष्टम भाव (आयु व रंध्र भाव) में",
    "baseEn": "Long life, peaceful passing, deep occult wisdom, inheritance through guru or father, spiritual seclusion, mastery of esoteric shastras.",
    "baseHi": "दीर्घायु, शांत व सुदीर्घ जीवन, अगाध गूढ़ ज्ञान, गुरु या पिता से वसीयत, एकांत साधना, तंत्र व उपनिषदों का मर्मज्ञ।",
    "ageMilestones": [
      {
        "age": 16,
        "nature": "favorable",
        "eventEn": "Spiritual initiation, protection from childhood hazards.",
        "eventHi": "आध्यात्मिक दीक्षा, बाल्यावस्था के संकटों से ईश्वरीय रक्षा।"
      },
      {
        "age": 36,
        "nature": "favorable",
        "eventEn": "Sudden financial inheritance, esoteric revelation or authorship.",
        "eventHi": "अचानक वसीयत से लाभ अथवा महान आध्यात्मिक ज्ञान का प्रकटीकरण।"
      }
    ],
    "signModifiers": {
      "Cancer": {
        "en": "Exalted: Exceptionally long life, peaceful passing into higher worlds, vast legacy.",
        "hi": "उच्च राशि: सुदीर्घ जीवन, सद्गति, विपुल पैतृक व आध्यात्मिक विरासत।"
      },
      "Capricorn": {
        "en": "Debilitated: Liver ailments, disputes over inheritance, digestive sluggishness.",
        "hi": "नीच राशि: यकृत रोग, वसीयत को लेकर विवाद, जठराग्नि मंद।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Sun",
        "conditionEn": "Aspected by Sun",
        "conditionHi": "सूर्य की दृष्टि",
        "effectEn": "Divine spiritual grace, longevity confirmed, royal legacy.",
        "effectHi": "ईश्वरीय कृपा, सुदीर्घ जीवन निश्चित, राजकीय सम्मान व पैतृक धन।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, long lived, respected in-laws, deep esoteric inclinations, peaceful temperament.",
      "hi": "स्त्री जातक में दीर्घायु, ससुराल में सम्मानित, आध्यात्मिक व गंभीर स्वभाव, शांत जीवन।"
    }
  },
  {
    "planet": "Jupiter",
    "planetHi": "बृहस्पति (गुरु)",
    "house": 9,
    "titleEn": "Jupiter in 9th House (Dharma Bhava)",
    "titleHi": "बृहस्पति नवम भाव (धर्म व भाग्य भाव) में",
    "baseEn": "Supreme fortune (Bhagyavan), dharmic leader, temple builder, world traveller, righteous father, blessings of preceptors, universal renown.",
    "baseHi": "परम भाग्यवान, धर्म ध्वजवाहक, मंदिर निर्माता, विश्व भ्रमणकारी, सदाचारी पिता, गुरुजनों की विशेष कृपा, सर्वमान्य प्रतिष्ठा।",
    "ageMilestones": [
      {
        "age": 16,
        "nature": "favorable",
        "eventEn": "Sacred thread / spiritual initiation, scholarly excellence.",
        "eventHi": "धार्मिक संस्कार, विद्या में सर्वोच्च सफलता, गुरु कृपा।"
      },
      {
        "age": 24,
        "nature": "favorable",
        "eventEn": "Major fortune breakthrough, foreign pilgrimage, noble honors.",
        "eventHi": "विशाल भाग्योदय, तीर्थ यात्राएं, विद्वानों द्वारा सम्मान।"
      },
      {
        "age": 32,
        "nature": "career",
        "eventEn": "Dharmic institution head, supreme philanthropic authority.",
        "eventHi": "धार्मिक या शैक्षणिक संस्थान का प्रमुख, दानवीर प्रतिष्ठा।"
      }
    ],
    "signModifiers": {
      "Cancer": {
        "en": "Exalted: World teacher (Jagadguru), sovereign spiritual guide, unbroken fortune.",
        "hi": "उच्च राशि: जगद्गुरु, धर्म चक्रवर्ती, अखंड ईश्वरीय कृपा व सौभाग्य।"
      },
      "Capricorn": {
        "en": "Debilitated: Conflict with father, skepticism towards rituals, travel obstacles.",
        "hi": "नीच राशि: पिता से मतभेद, अनुष्ठानों में संशय, तीर्थ में विघ्न।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Sun",
        "conditionEn": "With Sun",
        "conditionHi": "सूर्य से युति",
        "effectEn": "Supreme Dharmadhikari yoga, beloved of monarchs, spotless saintly fame.",
        "effectHi": "सर्वोच्च धर्माधिकारी योग, राजमान्य, निष्कलंक संत तुल्य कीर्ति।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, exceptionally fortunate, saintly conduct, respected by scholars and society, brings auspiciousness to entire clan.",
      "hi": "स्त्री जातक में परम सौभाग्यवती, सात्विक आचरण, विद्वानों में पूज्य, कुल का उद्धार करने वाली।"
    }
  },
  {
    "planet": "Jupiter",
    "planetHi": "बृहस्पति (गुरु)",
    "house": 10,
    "titleEn": "Jupiter in 10th House (Karma Bhava)",
    "titleHi": "बृहस्पति दशम भाव (कर्म व राज्य भाव) में",
    "baseEn": "High judicial or ministerial post, impeccable reputation, religious preceptor, ethical career, state honors, counselor to rulers.",
    "baseHi": "उच्च न्यायिक या मंत्री पद, निष्कलंक प्रतिष्ठा, धर्माचार्य, नीतिपूर्ण आजीविका, राजकीय सम्मान, शासन का मुख्य मार्गदर्शक।",
    "ageMilestones": [
      {
        "age": 16,
        "nature": "favorable",
        "eventEn": "Academic awards, direction towards judiciary, civil service, or teaching.",
        "eventHi": "अकादमिक पुरस्कार, न्यायिक या सिविल सेवा की दिशा में उन्मुख।"
      },
      {
        "age": 26,
        "nature": "career",
        "eventEn": "Prestigious public appointment, entry into high administrative ranks.",
        "eventHi": "उच्च प्रशासनिक पद पर नियुक्ति, शासन में अधिकार।"
      },
      {
        "age": 36,
        "nature": "career",
        "eventEn": "Zenith of judicial or advisory authority, national recognition.",
        "eventHi": "न्यायिक या नीति सलाहकार पद का शिखर, राष्ट्रीय सम्मान।"
      }
    ],
    "signModifiers": {
      "Cancer": {
        "en": "Exalted: Supreme justice, chief justice, cabinet minister, undisputed authority.",
        "hi": "उच्च राशि: मुख्य न्यायाधीश, कैबिनेट मंत्री, अविवादित प्रशासनिक सम्मान।"
      },
      "Capricorn": {
        "en": "Debilitated: Instability in profession, ethical compromises under pressure.",
        "hi": "नीच राशि: आजीविका में बाधा, सिद्धांतों को लेकर संघर्ष।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Sun",
        "conditionEn": "Aspected by Sun",
        "conditionHi": "सूर्य की दृष्टि",
        "effectEn": "Royal ministerial authority, supreme public honor.",
        "effectHi": "राजकीय मंत्री पद, समाज में सर्वोच्च सम्मान।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, distinguished career in law, teaching, or governance, venerated status, moral leadership.",
      "hi": "स्त्री जातक में न्याय, शिक्षा या प्रशासन में विशिष्ट पद, समाज में अत्यंत आदरणीय, नैतिक नेतृत्व।"
    }
  },
  {
    "planet": "Jupiter",
    "planetHi": "बृहस्पति (गुरु)",
    "house": 11,
    "titleEn": "Jupiter in 11th House (Labha Bhava)",
    "titleHi": "बृहस्पति एकादश भाव (लाभ भाव) में",
    "baseEn": "Multifold wealth, virtuous children, elder brother gains, spiritual associations, fulfillment of all cherished life desires.",
    "baseHi": "अथाह धन संपदा, सदाचारी संतान, अग्रज से लाभ, संतों का संग, जीवन की सभी अभिलाषाओं की सहज सिद्धि।",
    "ageMilestones": [
      {
        "age": 16,
        "nature": "favorable",
        "eventEn": "Early financial earnings through knowledge and merit.",
        "eventHi": "ज्ञान व योग्यता द्वारा प्रारंभिक धन लाभ।"
      },
      {
        "age": 32,
        "nature": "favorable",
        "eventEn": "Massive wealth accumulation, noble alliances, asset expansion.",
        "eventHi": "विपुल धन संचय, प्रतिष्ठित सहयोगियों का संग, संपत्तियों का विस्तार।"
      }
    ],
    "signModifiers": {
      "Cancer": {
        "en": "Exalted: Multi-billionaire potential, treasurer of sacred wealth, noble charities.",
        "hi": "उच्च राशि: कुबेर सम धन, धर्मार्थ न्यासों का स्वामी, विशाल परोपकार।"
      },
      "Capricorn": {
        "en": "Debilitated: Strained relations with elder brother, fluctuating profits.",
        "hi": "नीच राशि: अग्रज से मतभेद, लाभ में उतार-चढ़ाव।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Moon",
        "conditionEn": "With Moon",
        "conditionHi": "चन्द्रमा से युति",
        "effectEn": "Multifold prosperity, immense liquid cash, universal friends.",
        "effectHi": "अखंड लक्ष्मी योग, विपुल चल संपत्ति, सर्वप्रियता।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, prosperous, happy family life, abundance of gold and assets, fulfilled desires.",
      "hi": "स्त्री जातक में अत्यंत संपन्न, सुखी गृहस्थी, स्वर्ण व संपत्तियों की प्रचुरता, सभी मनोकामनाओं की पूर्ति।"
    }
  },
  {
    "planet": "Jupiter",
    "planetHi": "बृहस्पति (गुरु)",
    "house": 12,
    "titleEn": "Jupiter in 12th House (Vyaya Bhava)",
    "titleHi": "बृहस्पति द्वादश भाव (व्यय व मोक्ष भाव) में",
    "baseEn": "Charitable expenditures, ashram builder, moksha seeker, quiet seclusion, religious expenses, foreign pilgrimage.",
    "baseHi": "धर्मार्थ कार्यों में विपुल व्यय, आश्रम व मंदिर निर्माण, मोक्षकामी, शांत एकांतप्रियता, तीर्थ यात्राओं पर व्यय, विदेश वास।",
    "ageMilestones": [
      {
        "age": 26,
        "nature": "career",
        "eventEn": "Overseas pilgrimage, foreign educational or spiritual mission.",
        "eventHi": "विदेश में तीर्थ यात्रा, शैक्षणिक या आध्यात्मिक अभियान।"
      },
      {
        "age": 48,
        "nature": "favorable",
        "eventEn": "Supreme spiritual meditation, detachment from worldly illusions, moksha path.",
        "eventHi": "गहन समाधि, सांसारिक मोह से मुक्ति, मोक्ष मार्ग में अग्रसर।"
      }
    ],
    "signModifiers": {
      "Cancer": {
        "en": "Exalted: Supreme spiritual ascension, heaven-bound soul, divine charity.",
        "hi": "उच्च राशि: परम मोक्ष मार्ग, देवलोक की प्राप्ति, विशाल धर्मार्थ कार्य।"
      },
      "Capricorn": {
        "en": "Debilitated: Heavy unwanted expenditures, false spiritual preceptors.",
        "hi": "नीच राशि: अनावश्यक व्यय, पाखंडी व्यक्तियों से धनहानि।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Saturn",
        "conditionEn": "With Saturn",
        "conditionHi": "शनि से युति",
        "effectEn": "Profound ascetic renunciation, hermit life, deep philosophical seclusion.",
        "effectHi": "गहन संन्यास योग, विरक्ति, एकांत में दार्शनिक साधना।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, charitable, ascetic nature, serene spiritual disposition, foreign pilgrimage.",
      "hi": "स्त्री जातक में दानशीला, सात्विक विरक्ति, शांत आध्यात्मिक चित्त, तीर्थ यात्राएं।"
    }
  },
  {
    "planet": "Venus",
    "planetHi": "शुक्र",
    "house": 1,
    "titleEn": "Venus in 1st House (Lagna)",
    "titleHi": "शुक्र प्रथम भाव (लग्न) में",
    "baseEn": "Enchanting beauty, romantic, artistic genius, luxurious life, Malavya Mahapurusha yoga if in Taurus, Libra, or Pisces. Magnetic charisma, youthful vigor.",
    "baseHi": "सम्मोहक लावण्य, रोमांटिक स्वभाव, कलात्मक प्रतिभा, ऐश्वर्यशाली जीवन, वृषभ, तुला या मीन में होने पर मालव्य महापुरुष योग। चुंबकीय आकर्षण, चिर-युवा कांति।",
    "ageMilestones": [
      {
        "age": 15,
        "nature": "favorable",
        "eventEn": "Dawn of artistic renown, music/acting bloom, social charm.",
        "eventHi": "कला, संगीत या अभिनय में ख्याति, समाज में आकर्षण का प्रस्फुटन।"
      },
      {
        "age": 20,
        "nature": "favorable",
        "eventEn": "Romantic engagement, luxury vehicle or ornament acquisition.",
        "eventHi": "प्रेम संबंध, आभूषण व उत्तम वाहन का सुखद योग।"
      },
      {
        "age": 25,
        "nature": "favorable",
        "eventEn": "Prosperous marriage, aesthetic business summit.",
        "eventHi": "सुलक्षण विवाह, कला व विलासिता व्यापार में सफलता।"
      }
    ],
    "signModifiers": {
      "Pisces": {
        "en": "Exalted: Malavya Mahapurusha yoga: Celestial charm, supreme artistic fame, opulent wealth.",
        "hi": "उच्च राशि (मीन): मालव्य महापुरुष योग: अनुपम सौंदर्य, कला शिरोमणि, अपार ऐश्वर्य।"
      },
      "Virgo": {
        "en": "Debilitated: Sensory excess, reproductive or kidney sensitivity, marital disillusionment.",
        "hi": "नीच राशि (कन्या): विलासिता में भटकाव, गुर्दे या प्रजनन संवेदनशीलता, दांपत्य में निराशा।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Jupiter",
        "conditionEn": "Aspected by Jupiter",
        "conditionHi": "गुरु की दृष्टि",
        "effectEn": "Righteous aesthetic genius, noble married life, revered in society.",
        "effectHi": "सात्विक कला प्रतिभा, आदर्श दांपत्य, समाज में उच्च आदर।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, mesmerizing beauty, graceful manners, passionate, jewel lover, adored by husband.",
      "hi": "स्त्री जातक में अप्रतिम सौंदर्य, शालीन शिष्टाचार, आभूषण प्रिय, पति की अत्यंत प्रियतमा।"
    }
  },
  {
    "planet": "Venus",
    "planetHi": "शुक्र",
    "house": 2,
    "titleEn": "Venus in 2nd House (Dhana Bhava)",
    "titleHi": "शुक्र द्वितीय भाव (धन भाव) में",
    "baseEn": "Melodious singer, poet, vast wealth through arts, luxury, perfumes, and jewelry, gourmet food lover, attractive eyes.",
    "baseHi": "मधुर कंठ गायक, कवि, कला, विलासिता, इत्र व आभूषणों से विपुल धन, मिष्ठान्न व स्वादिष्ट भोजनप्रिय, नयनाभिराम आंखें।",
    "ageMilestones": [
      {
        "age": 20,
        "nature": "career",
        "eventEn": "Financial emergence through artistic voice, cosmetics, or luxury commerce.",
        "eventHi": "गायन, कला, सौंदर्य प्रसाधन या विलासिता व्यापार से धनार्जन।"
      },
      {
        "age": 28,
        "nature": "favorable",
        "eventEn": "Massive accumulation of gold, silver, diamonds, and family prosperity.",
        "eventHi": "स्वर्ण, रजत, हीरों का विपुल संचय तथा कुटुंब में वैभव।"
      }
    ],
    "signModifiers": {
      "Pisces": {
        "en": "Exalted: Treasures of gems and gold, poetic renown, melodious speech.",
        "hi": "उच्च राशि: रत्नों व स्वर्ण का अपार भंडार, काव्य ख्याति, अमृतमयी वाणी।"
      },
      "Virgo": {
        "en": "Debilitated: Losses through reckless luxury spending, eye sensitivity.",
        "hi": "नीच राशि: विलासिता में अपव्यय, नेत्र संवेदनशीलता, वाणी दोष।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Mercury",
        "conditionEn": "With Mercury",
        "conditionHi": "बुध से युति",
        "effectEn": "Laxmi-Saraswati yoga: Eloquent poetry, immense commercial fortune.",
        "effectHi": "लक्ष्मी-सरस्वती योग: अद्भुत काव्य प्रतिभा, व्यापार में विपुल धन।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, musical voice, immense jewelry, gracious hostess, rich domestic harmony.",
      "hi": "स्त्री जातक में सुरीला कंठ, विपुल आभूषण, उत्तम आतिथ्य सत्कार, समृद्ध व शांत गृहस्थी।"
    }
  },
  {
    "planet": "Venus",
    "planetHi": "शुक्र",
    "house": 3,
    "titleEn": "Venus in 3rd House (Sahaja Bhava)",
    "titleHi": "शुक्र तृतीय भाव (सहज भाव) में",
    "baseEn": "Passionate artist, love for siblings, creative writer, musical talent, skilled in handicrafts, affectionate courage.",
    "baseHi": "कलाकार, सहोदरों से स्नेह, सृजनात्मक लेखन, संगीत प्रतिभा, हस्तशिल्प में निपुण, सौम्य व स्नेहमयी पराक्रम।",
    "ageMilestones": [
      {
        "age": 20,
        "nature": "favorable",
        "eventEn": "Early artistic exhibitions, musical debut, supportive sisters.",
        "eventHi": "कला प्रदर्शनी, संगीत पदार्पण, बहनों से विशेष सहयोग।"
      },
      {
        "age": 27,
        "nature": "favorable",
        "eventEn": "Literary or design triumph, successful artistic journeys.",
        "eventHi": "डिजाइन या साहित्य में ख्याति, लाभदायक यात्राएं।"
      }
    ],
    "signModifiers": {
      "Pisces": {
        "en": "Exalted: Celebrated musician, painter, designer, affectionate younger sisters.",
        "hi": "उच्च राशि: ख्यातिलब्ध संगीतकार, चित्रकार, डिजाइनर, बहनों का पूर्ण सुख।"
      },
      "Virgo": {
        "en": "Debilitated: Strained relations with sisters, unrewarded artistic efforts.",
        "hi": "नीच राशि: बहनों से अनबन, कलात्मक प्रयासों में यथोचित फल की कमी।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Jupiter",
        "conditionEn": "Aspected by Jupiter",
        "conditionHi": "गुरु की दृष्टि",
        "effectEn": "Noble artistic expressions, cultural leadership.",
        "effectHi": "सात्विक कला साधना, सांस्कृतिक नेतृत्व।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, skilled in embroidery, dancing, music, loving sister, charming conversationalist.",
      "hi": "स्त्री जातक में कसीदाकारी, नृत्य, संगीत में प्रवीण, स्नेहमयी बहन, मनभावन संवाद।"
    }
  },
  {
    "planet": "Venus",
    "planetHi": "शुक्र",
    "house": 4,
    "titleEn": "Venus in 4th House (Sukha Bhava)",
    "titleHi": "शुक्र चतुर्थ भाव (सुख भाव) में",
    "baseEn": "Luxurious mansions, premium vehicles, devoted cultured mother, artistic home interior, peaceful domestic contentment.",
    "baseHi": "वैभवशाली भवन, सर्वोत्तम वाहन, विदुषी व संस्कारी माता, कलात्मक गृह सज्जा, गृहस्थी में सुख-शांति।",
    "ageMilestones": [
      {
        "age": 22,
        "nature": "favorable",
        "eventEn": "Acquisition of luxury car or beautiful home decoration.",
        "eventHi": "उत्तम वाहन का क्रय अथवा गृह का कलात्मक नवीनीकरण।"
      },
      {
        "age": 28,
        "nature": "favorable",
        "eventEn": "Purchase of grand residential property or maternal gifts.",
        "eventHi": "भव्य भवन का क्रय अथवा माता से विपुल आभूषण लाभ।"
      },
      {
        "age": 42,
        "nature": "favorable",
        "eventEn": "Palatial estate consolidation, supreme domestic bliss.",
        "eventHi": "भव्य प्रासाद तुल्य गृह का स्थायित्व, अखंड गृह सुख।"
      }
    ],
    "signModifiers": {
      "Pisces": {
        "en": "Exalted: Palatial mansions, fleet of luxury cars, unconditional maternal bliss.",
        "hi": "उच्च राशि: प्रासाद तुल्य आवास, उत्तम वाहनों की प्रचुरता, अखंड मातृ सुख।"
      },
      "Virgo": {
        "en": "Debilitated: Discontent in home life, vehicle breakdowns, maternal health strain.",
        "hi": "नीच राशि: गृह सुख में असंतोष, वाहन में खराबी, माता के स्वास्थ्य की चिंता।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Moon",
        "conditionEn": "With Moon",
        "conditionHi": "चन्द्रमा से युति",
        "effectEn": "Opulent domestic bliss, artistic home, boundless comforts.",
        "effectHi": "अखंड गृह सुख, कलामय वातावरण, सुख-सुविधाओं की प्रचुरता।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, grand domestic comfort, lavish home, loving mother, aesthetic interior styling.",
      "hi": "स्त्री जातक में भव्य गृह सुख, सुरुचिपूर्ण जीवन, स्नेहमयी माता, उत्तम गृह सज्जा।"
    }
  },
  {
    "planet": "Venus",
    "planetHi": "शुक्र",
    "house": 5,
    "titleEn": "Venus in 5th House (Suta Bhava)",
    "titleHi": "शुक्र पंचम भाव (संतान व बुद्धि भाव) में",
    "baseEn": "Artistic talents, poetic flair, romance, more daughters, virtuous and attractive children, fortunate speculative instincts.",
    "baseHi": "कलात्मक प्रतिभा, काव्य अभिरुचि, प्रेम प्रसंग, कन्या संतति की अधिकता, रूपवान व सुसंस्कृत संतान, सफल रचनात्मक निवेश।",
    "ageMilestones": [
      {
        "age": 20,
        "nature": "favorable",
        "eventEn": "Blossoming of romance, poetic publication, creative acclaim.",
        "eventHi": "प्रेम संबंध का प्रस्फुटन, काव्य रचना, कलात्मक ख्याति।"
      },
      {
        "age": 25,
        "nature": "favorable",
        "eventEn": "Birth of beautiful daughter, speculative or artistic windfall.",
        "eventHi": "सुंदर कन्या का जन्म, कला या निवेश से विशेष धन लाभ।"
      }
    ],
    "signModifiers": {
      "Pisces": {
        "en": "Exalted: Supreme creative genius, illustrious charming children, divine romance.",
        "hi": "उच्च राशि: अद्भुत सृजनात्मक प्रतिभा, प्रतापी व सुंदर संतान, पवित्र प्रेम।"
      },
      "Virgo": {
        "en": "Debilitated: Heartbreak in romance, anxiety over children, reproductive care needed.",
        "hi": "नीच राशि: प्रेम में निराशा, संतान को लेकर चिंता, जननेंद्रिय स्वास्थ्य पर ध्यान दें।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Jupiter",
        "conditionEn": "Aspected by Jupiter",
        "conditionHi": "गुरु की दृष्टि",
        "effectEn": "Highly cultured and noble children, virtuous intellect.",
        "effectHi": "अत्यंत संस्कारी व गुणी संतान, सात्विक प्रज्ञा।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, highly creative, loving mother, graceful temperament, talented in performing arts.",
      "hi": "स्त्री जातक में सृजनात्मक प्रतिभा, ममतामयी माता, शालीन स्वभाव, नृत्य-संगीत में निपुण।"
    }
  },
  {
    "planet": "Venus",
    "planetHi": "शुक्र",
    "house": 6,
    "titleEn": "Venus in 6th House (Ripu Bhava)",
    "titleHi": "शुक्र षष्ठ भाव (रोग व शत्रु भाव) में",
    "baseEn": "Sensory conflicts, female rivalries, kidney or urinary sensitivity, diabetes checks required. Triumphs over rivals through sweet diplomacy.",
    "baseHi": "संबंधों में तनाव, स्त्रियों से विरोध, गुर्दे व मूत्र विकार, शर्करा (डायबिटीज) की संवेदनशीलता। सौम्य कूटनीति से शत्रुओं पर विजय।",
    "ageMilestones": [
      {
        "age": 21,
        "nature": "health",
        "eventEn": "Kidney, urinary, or skin sensitivity check.",
        "eventHi": "गुर्दे, मूत्र संस्थान या त्वचा संबंधी स्वास्थ्य सतर्कता।"
      },
      {
        "age": 36,
        "nature": "favorable",
        "eventEn": "Diplomatic victory over workplace rivals, debt clearance.",
        "eventHi": "कूटनीति से विरोधियों का शमन, ऋणों से मुक्ति।"
      }
    ],
    "signModifiers": {
      "Pisces": {
        "en": "Exalted: Overcomes all rivals with graciousness, quick healing from ailments.",
        "hi": "उच्च राशि: सौम्य व्यवहार से शत्रुओं का हृदय परिवर्तन, शीघ्र रोगमुक्ति।"
      },
      "Virgo": {
        "en": "Debilitated: Chronic urinary complaints, dispute with female associates, debt strain.",
        "hi": "नीच राशि: मूत्र विकार, स्त्री पक्ष से विवाद, कर्ज का तनाव।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Jupiter",
        "conditionEn": "Aspected by Jupiter",
        "conditionHi": "गुरु की दृष्टि",
        "effectEn": "Shields health, protects from scandalous disputes, noble recovery.",
        "effectHi": "स्वास्थ्य की रक्षा, बदनामी से बचाव, सम्मानजनक रोगमुक्ति।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, kidney and urinary tract sensitivity, relationship diplomacy needed, excels in service and hospitality.",
      "hi": "स्त्री जातक में गुर्दे व मूत्राशय का ध्यान रखें, संबंधों में कूटनीति आवश्यक, आतिथ्य सेवा में सफल।"
    }
  },
  {
    "planet": "Venus",
    "planetHi": "शुक्र",
    "house": 7,
    "titleEn": "Venus in 7th House (Kalatra Bhava)",
    "titleHi": "शुक्र सप्तम भाव (कलत्र भाव) में",
    "baseEn": "Extremely charming spouse, passionate love marriage, luxurious partnership, sensual desires fulfilled. Karako Bhava Nashaya caution if afflicted by malefics.",
    "baseHi": "अत्यंत रूपवान व आकर्षक जीवनसाथी, प्रेम विवाह का प्रबल योग, वैभवशाली दांपत्य, कामसुख की पूर्णता। पाप प्रभाव में वासना या दांपत्य में असंतोष की संभावना।",
    "ageMilestones": [
      {
        "age": 21,
        "nature": "favorable",
        "eventEn": "Romantic engagement or early fortunate matrimonial alliance.",
        "eventHi": "प्रेम संबंध, सगाई अथवा मांगलिक विवाह वार्ता।"
      },
      {
        "age": 25,
        "nature": "favorable",
        "eventEn": "Consolidation of marital bliss, opulent lifestyle with spouse.",
        "eventHi": "दांपत्य सुख का स्थायित्व, जीवनसाथी के साथ वैभवशाली जीवन।"
      }
    ],
    "signModifiers": {
      "Pisces": {
        "en": "Exalted: Celestial beauty of spouse, eternal love, immense marital wealth.",
        "hi": "उच्च राशि: अनुपम सुंदरी/सुंदर जीवनसाथी, अमर प्रेम, दांपत्य में विपुल ऐश्वर्य।"
      },
      "Virgo": {
        "en": "Debilitated: Marital friction, mutual dissatisfaction, health fragility of spouse.",
        "hi": "नीच राशि: दांपत्य में असंतोष, कलह, जीवनसाथी का दुर्बल स्वास्थ्य।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Jupiter",
        "conditionEn": "Aspected by Jupiter",
        "conditionHi": "गुरु की दृष्टि",
        "effectEn": "Pure and devoted lifelong love, noble partner, high public esteem.",
        "effectHi": "पवित्र व समर्पित दांपत्य, सदाचारी जीवनसाथी, समाज में प्रतिष्ठा।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, devoted romantic partner, affluent handsome husband, lavish married life.",
      "hi": "स्त्री जातक में रूपवान व समृद्ध पति, प्रगाढ़ प्रेम, विलासितापूर्ण दांपत्य जीवन।"
    }
  },
  {
    "planet": "Venus",
    "planetHi": "शुक्र",
    "house": 8,
    "titleEn": "Venus in 8th House (Ayu Bhava)",
    "titleHi": "शुक्र अष्टम भाव (आयु व रंध्र भाव) में",
    "baseEn": "Long life, peaceful demise, vast inheritance through spouse, luxurious secret pleasures, gains from in-laws, hormonal care.",
    "baseHi": "दीर्घायु, शांत व सुदीर्घ जीवन, जीवनसाथी से विपुल वसीयत, गुप्त सुख-सुविधाएं, ससुराल पक्ष से धन लाभ, हार्मोनल संतुलन आवश्यक।",
    "ageMilestones": [
      {
        "age": 22,
        "nature": "favorable",
        "eventEn": "Unexpected financial gift, legacy, or luxury inheritance.",
        "eventHi": "अचानक उपहार, वसीयत अथवा विलासिता संपत्तियों का लाभ।"
      },
      {
        "age": 36,
        "nature": "favorable",
        "eventEn": "Major wealth windfall through matrimonial estate or occult arts.",
        "eventHi": "ससुराल पक्ष या गुप्त स्रोतों से भारी धन लाभ।"
      }
    ],
    "signModifiers": {
      "Pisces": {
        "en": "Exalted: Very long life, massive unexpected wealth through spouse, peaceful passing.",
        "hi": "उच्च राशि: सुदीर्घ जीवन, ससुराल से विपुल धन, शांत व सुगम जीवन।"
      },
      "Virgo": {
        "en": "Debilitated: Reproductive or urinary complications, inheritance litigation.",
        "hi": "नीच राशि: जननेंद्रिय विकार, वसीयत को लेकर विवाद, व्यर्थ व्यय।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Jupiter",
        "conditionEn": "Aspected by Jupiter",
        "conditionHi": "गुरु की दृष्टि",
        "effectEn": "Shields longevity, peaceful and honorable passing, spiritual legacy.",
        "effectHi": "आयु की रक्षा, सुखद जीवन, आध्यात्मिक व भौतिक विरासत।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, wealthy in-laws, long-lived, legacy gains, hormonal care required in mature years.",
      "hi": "स्त्री जातक में समृद्ध ससुराल, दीर्घायु, वसीयत से लाभ, उत्तरार्ध में स्वास्थ्य का ध्यान रखें।"
    }
  },
  {
    "planet": "Venus",
    "planetHi": "शुक्र",
    "house": 9,
    "titleEn": "Venus in 9th House (Dharma Bhava)",
    "titleHi": "शुक्र नवम भाव (धर्म व भाग्य भाव) में",
    "baseEn": "Fortunate through marriage, artistic pilgrimages, liberal philosophy, blessings of Lakshmi, international tours, generous donor.",
    "baseHi": "विवाह के उपरांत भाग्योदय, कलात्मक व धार्मिक तीर्थ यात्राएं, उदार दर्शन, महालक्ष्मी की असीम कृपा, विदेश भ्रमण, दानवीर।",
    "ageMilestones": [
      {
        "age": 21,
        "nature": "favorable",
        "eventEn": "Dawn of fortune through matrimony, artistic achievements.",
        "eventHi": "विवाह या कला द्वारा भाग्योदय का शुभ प्रारंभ।"
      },
      {
        "age": 28,
        "nature": "favorable",
        "eventEn": "International luxury travel, philanthropic contributions.",
        "eventHi": "विदेश यात्रा, धार्मिक कार्यों में दान, प्रतिष्ठा का विस्तार।"
      }
    ],
    "signModifiers": {
      "Pisces": {
        "en": "Exalted: Supreme Lakshmi yoga, sovereign fortune, temple and cultural patronage.",
        "hi": "उच्च राशि: परम लक्ष्मी योग, अखंड सौभाग्य, मंदिरों व सांस्कृतिक संस्थाओं को दान।"
      },
      "Virgo": {
        "en": "Debilitated: Skepticism in religious matters, obstacles during long journeys.",
        "hi": "नीच राशि: धार्मिक कार्यों में अरुचि, लंबी यात्राओं में विघ्न।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Jupiter",
        "conditionEn": "With or aspected by Jupiter",
        "conditionHi": "गुरु से युति या दृष्टि",
        "effectEn": "Saintly aesthetic wisdom, universal philanthropy, spotless fame.",
        "effectHi": "सात्विक कला साधना, विशाल लोक कल्याण, निष्कलंक कीर्ति।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, highly fortunate, beloved by family, charitable, gracious lifestyle, brings prosperity to home.",
      "hi": "स्त्री जातक में परम सौभाग्यशालिनी, कुल में प्रिय, दानशीला, सुरुचिपूर्ण जीवन, घर में लक्ष्मी का वास।"
    }
  },
  {
    "planet": "Venus",
    "planetHi": "शुक्र",
    "house": 10,
    "titleEn": "Venus in 10th House (Karma Bhava)",
    "titleHi": "शुक्र दशम भाव (कर्म व राज्य भाव) में",
    "baseEn": "Celebrated artist, fashion designer, cinema/hospitality tycoon, diplomatic honors, wealth through entertainment, jewelry, and luxury goods.",
    "baseHi": "प्रसिद्ध कलाकार, फैशन डिजाइनर, सिनेमा या होटल उद्योगपति, कूटनीतिक सम्मान, मनोरंजन, आभूषण व विलासिता व्यापार से अकूत धन।",
    "ageMilestones": [
      {
        "age": 22,
        "nature": "career",
        "eventEn": "First major breakthrough into cinema, arts, fashion, or luxury enterprise.",
        "eventHi": "कला, सिनेमा, फैशन या विलासिता उद्योग में प्रथम बड़ी सफलता।"
      },
      {
        "age": 30,
        "nature": "career",
        "eventEn": "National fame, corporate leadership in aesthetic industries.",
        "eventHi": "राष्ट्रीय स्तर पर ख्याति, कला उद्योग में शीर्ष नेतृत्व।"
      },
      {
        "age": 38,
        "nature": "favorable",
        "eventEn": "Apex of aesthetic fame, state honors, vast wealth accumulation.",
        "eventHi": "कला व आजीविका का शिखर, राजकीय सम्मान, विपुल धन संचय।"
      }
    ],
    "signModifiers": {
      "Pisces": {
        "en": "Exalted: Internationally celebrated artist, billionaire lifestyle, royal patronage.",
        "hi": "उच्च राशि: अंतरराष्ट्रीय ख्याति प्राप्त कलाकार, अपार ऐश्वर्य, राजसम्मान।"
      },
      "Virgo": {
        "en": "Debilitated: Professional defamation under scandal, instability in luxury trade.",
        "hi": "नीच राशि: कार्यक्षेत्र में अपयश का भय, व्यापार में अस्थिरता।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Jupiter",
        "conditionEn": "Aspected by Jupiter",
        "conditionHi": "गुरु की दृष्टि",
        "effectEn": "Spotless prestige, ethical luxury enterprises, universally respected.",
        "effectHi": "निष्कलंक प्रतिष्ठा, नीतिपूर्ण व्यापार, समाज में सर्वमान्य आदर।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, high prestige in creative or corporate spheres, aesthetic elegance, admired leader.",
      "hi": "स्त्री जातक में कलात्मक या कॉर्पोरेट क्षेत्र में उच्च पद, सुरुचिपूर्ण व्यक्तित्व, सम्मानित नेत्री।"
    }
  },
  {
    "planet": "Venus",
    "planetHi": "शुक्र",
    "house": 11,
    "titleEn": "Venus in 11th House (Labha Bhava)",
    "titleHi": "शुक्र एकादश भाव (लाभ भाव) में",
    "baseEn": "Immense cash flow, luxury vehicles, influential female friends, fulfilled romantic dreams, flourishing artistic and financial enterprises.",
    "baseHi": "अखंड धन वर्षा, उत्तम वाहन, प्रभावशाली सखियों का सहयोग, सभी महत्वाकांक्षाओं की पूर्ति, कला व वित्तीय उपक्रमों में भारी लाभ।",
    "ageMilestones": [
      {
        "age": 20,
        "nature": "favorable",
        "eventEn": "Early financial abundance through creative or commercial skills.",
        "eventHi": "रचनात्मक या व्यापारिक कौशल से प्रारंभिक धन लाभ।"
      },
      {
        "age": 25,
        "nature": "favorable",
        "eventEn": "Substantial wealth multiplication, purchase of luxury assets.",
        "eventHi": "धन-संपत्ति में भारी वृद्धि, विलासिता की वस्तुओं का क्रय।"
      },
      {
        "age": 36,
        "nature": "favorable",
        "eventEn": "Summit of financial prosperity, influential social network.",
        "eventHi": "आर्थिक संपन्नता का चरमोत्कर्ष, प्रतिष्ठित समाज में आदर।"
      }
    ],
    "signModifiers": {
      "Pisces": {
        "en": "Exalted: Multi-stream vast treasures, fleet of vehicles, diamonds and jewels.",
        "hi": "उच्च राशि: अनेक स्रोतों से विपुल धन, वाहनों की प्रचुरता, हीरों व रत्नों का संचय।"
      },
      "Virgo": {
        "en": "Debilitated: Losses through deceitful female associates, fluctuating gains.",
        "hi": "नीच राशि: गलत संगति से धनहानि, लाभ में उतार-चढ़ाव।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Mercury",
        "conditionEn": "With Mercury",
        "conditionHi": "बुध से युति",
        "effectEn": "Commercial genius, artistic riches, vast noble networks.",
        "effectHi": "व्यापारिक चातुर्य, कला से धन, प्रतिष्ठित मित्रों का घेरा।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, immensely wealthy, social influencer, surrounded by luxuries, fulfilled wishes.",
      "hi": "स्त्री जातक में अत्यधिक संपन्न, समाज में लोकप्रिय, विलासिता के साधनों से घिरी, सुखी जीवन।"
    }
  },
  {
    "planet": "Venus",
    "planetHi": "शुक्र",
    "house": 12,
    "titleEn": "Venus in 12th House (Vyaya Bhava)",
    "titleHi": "शुक्र द्वादश भाव (व्यय व मोक्ष भाव) में",
    "baseEn": "Highest luxury in sleep and bed comforts (Shayana Sukha), immense wealth spent on sensory pleasures, artistic foreign travel, opulent lifestyle abroad.",
    "baseHi": "शयन सुख का चरमोत्कर्ष, विलासिता व सुख-सुविधाओं पर विपुल व्यय, विदेश में कलात्मक जीवन, परदेस में अपार ऐश्वर्य का उपभोग।",
    "ageMilestones": [
      {
        "age": 25,
        "nature": "career",
        "eventEn": "Overseas relocation, luxury lifestyle, foreign artistic ventures.",
        "eventHi": "विदेश गमन, विलासितापूर्ण जीवन, परदेस में आजीविका।"
      },
      {
        "age": 40,
        "nature": "favorable",
        "eventEn": "Opulent foreign settlement, philanthropic and spiritual charity.",
        "eventHi": "विदेश में स्थाई संपन्नता, कला व धर्मार्थ कार्यों में दान।"
      }
    ],
    "signModifiers": {
      "Pisces": {
        "en": "Exalted: Celestial bed comforts, vast overseas wealth, saintly renunciation in late age.",
        "hi": "उच्च राशि: अद्वितीय शयन सुख, विदेश में अपार संपत्ति, उत्तरार्ध में सात्विक विरक्ति।"
      },
      "Virgo": {
        "en": "Debilitated: Heavy expenditure on sensory indulgences, marital disillusionment.",
        "hi": "नीच राशि: व्यर्थ विलासिता में अपव्यय, दांपत्य में निराशा, नेत्र दुर्बलता।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Jupiter",
        "conditionEn": "Aspected by Jupiter",
        "conditionHi": "गुरु की दृष्टि",
        "effectEn": "Chaste and refined pleasures, spiritual philanthropy, peaceful foreign abode.",
        "effectHi": "सात्विक सुखोपभोग, धार्मिक दान, विदेश में शांत व सुखी वास।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, lavish lifestyle, fond of comforts, generous, sensual fulfillment, overseas travel.",
      "hi": "स्त्री जातक में वैभवशाली जीवन, सुखप्रिय, दानशीला, दांपत्य सुख, विदेश यात्रा।"
    }
  },
  {
    "planet": "Saturn",
    "planetHi": "शनि",
    "house": 1,
    "titleEn": "Saturn in 1st House (Lagna)",
    "titleHi": "शनि प्रथम भाव (लग्न) में",
    "baseEn": "Serious, disciplined, lean frame, melancholic, late bloomer, Shasha Mahapurusha yoga if in own or exalted signs (Libra, Capricorn, Aquarius). Unshakeable perseverance.",
    "baseHi": "गंभीर, अनुशासित, कृश काया, विचारशील, विलंब से भाग्योदय, तुला, मकर या कुंभ में होने पर शश महापुरुष योग। अथक परिश्रम, विपरीत परिस्थितियों में अडिग।",
    "ageMilestones": [
      {
        "age": 12,
        "nature": "health",
        "eventEn": "Childhood dental, bone, or respiratory endurance trial.",
        "eventHi": "बाल्यावस्था में दंत, अस्थि या वात रोग की संवेदनशीलता।"
      },
      {
        "age": 28,
        "nature": "career",
        "eventEn": "Turning point of maturity, heavy responsibilities, beginning of steady rise.",
        "eventHi": "परिपक्वता का मोड़, भारी उत्तरदायित्व, आजीविका में स्थाई प्रगति।"
      },
      {
        "age": 36,
        "nature": "favorable",
        "eventEn": "Apex of monumental career consolidation, mass following, undisputed authority.",
        "eventHi": "आजीविका में महान स्थायित्व, जनसमर्थन तथा सर्वोच्च प्रशासनिक अधिकार।"
      }
    ],
    "signModifiers": {
      "Libra": {
        "en": "Exalted: Shasha Mahapurusha yoga: Supreme mass leader, judge, invincible endurance.",
        "hi": "उच्च राशि (तुला): शश महापुरुष योग: शीर्ष जननेता, न्यायाधीश, अदम्य सहनशक्ति।"
      },
      "Aries": {
        "en": "Debilitated: Melancholia, chronic ailments, arduous labor without due credit.",
        "hi": "नीच राशि (मेष): मानसिक विषाद, दीर्घकालीन वात रोग, कठोर श्रम का अल्प फल।"
      },
      "Capricorn": {
        "en": "Own Sign: Hardworking titan, builder of durable institutions, high administrative rank.",
        "hi": "स्वराशि (मकर): कर्मठ व्यक्तित्व, स्थाई संस्थाओं का निर्माता, उच्च पद।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Jupiter",
        "conditionEn": "Aspected by Jupiter",
        "conditionHi": "गुरु की दृष्टि",
        "effectEn": "Righteous philosopher, judicial greatness, noble patience rewarded.",
        "effectHi": "धर्मात्मा दार्शनिक, महान न्यायाधीश, धैर्य का अमृत फल।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, serious nature, hardworking, early struggles leading to durable stability, duty-bound matriarch.",
      "hi": "स्त्री जातक में गंभीर स्वभाव, कर्मठ, प्रारंभिक संघर्ष के उपरांत अटूट स्थिरता, कर्तव्यनिष्ठ कुलवधू।"
    }
  },
  {
    "planet": "Saturn",
    "planetHi": "शनि",
    "house": 2,
    "titleEn": "Saturn in 2nd House (Dhana Bhava)",
    "titleHi": "शनि द्वितीय भाव (धन भाव) में",
    "baseEn": "Strained family ties in youth, harsh blunt speech, wealth accumulated late through hard labor, dental troubles, disciplined thrift.",
    "baseHi": "युवावस्था में कुटुंब में संघर्ष, खरी व दो-टूक वाणी, कठोर परिश्रम से उत्तरार्ध में भारी धन संचय, दंत विकार, मितव्ययी।",
    "ageMilestones": [
      {
        "age": 28,
        "nature": "career",
        "eventEn": "First solid breakthrough in independent savings and disciplined finance.",
        "eventHi": "स्वतंत्र बचत व अनुशासित वित्त प्रबंधन का प्रारंभ।"
      },
      {
        "age": 36,
        "nature": "favorable",
        "eventEn": "Immense accumulation of immovable property, land, and gold.",
        "eventHi": "अचल संपत्ति, भूमि व स्वर्ण का विपुल स्थाई संचय।"
      }
    ],
    "signModifiers": {
      "Libra": {
        "en": "Exalted: Vast treasures of gold, land, and metals, truthful speech.",
        "hi": "उच्च राशि: स्वर्ण, भूमि व धातुओं का विपुल भंडार, सत्य व गंभीर वाणी।"
      },
      "Aries": {
        "en": "Debilitated: Financial crises, dental losses, family estrangements.",
        "hi": "नीच राशि: आर्थिक तंगी, दंत रोग, कुटुंब से अलगाव।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Jupiter",
        "conditionEn": "Aspected by Jupiter",
        "conditionHi": "गुरु की दृष्टि",
        "effectEn": "Truthful speech, family harmony restored, honest financial rise.",
        "effectHi": "सत्य वाणी, कुटुंब में सामंजस्य, नीतिपूर्ण धन संचय।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, plain spoken, disciplined thrift, early adjustments with in-laws leading to financial authority.",
      "hi": "स्त्री जातक में स्पष्टवादी, मितव्ययी, ससुराल में प्रारंभिक सामंजस्य के बाद वित्तीय अधिकार।"
    }
  },
  {
    "planet": "Saturn",
    "planetHi": "शनि",
    "house": 3,
    "titleEn": "Saturn in 3rd House (Sahaja Bhava)",
    "titleHi": "शनि तृतीय भाव (सहज भाव) में",
    "baseEn": "Exceptional valor, perseverance, strained relations with younger siblings, military or engineering fortitude, crushes adversaries.",
    "baseHi": "अद्भुत पराक्रम, असीम धैर्य, छोटे भाइयों से दूरी या मतभेद, सेना या तकनीकी कार्यों में सफलता, शत्रुओं का दमन।",
    "ageMilestones": [
      {
        "age": 28,
        "nature": "career",
        "eventEn": "Monumental triumph through solo perseverance, defeat of competitors.",
        "eventHi": "अकेले दम पर ऐतिहासिक विजय, विरोधियों का पूर्ण दमन।"
      },
      {
        "age": 36,
        "nature": "favorable",
        "eventEn": "Consolidation of vast personal enterprise, industrial leadership.",
        "eventHi": "व्यक्तिगत उपक्रमों का भारी विस्तार, उद्योग में नेतृत्व।"
      }
    ],
    "signModifiers": {
      "Libra": {
        "en": "Exalted: Unshakeable heroism, supreme industrial achievements, devoted aides.",
        "hi": "उच्च राशि: अजेय पराक्रम, औद्योगिक उपलब्धियां, विश्वस्त सहयोगियों का साथ।"
      },
      "Aries": {
        "en": "Debilitated: Fractures in arms, friction with brothers, frustrated efforts.",
        "hi": "नीच राशि: भुजाओं में चोट, सहोदरों से कटुता, प्रयासों में व्यवधान।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Mars",
        "conditionEn": "With Mars",
        "conditionHi": "मंगल से युति",
        "effectEn": "Fierce engineering, mining, or defense commander, ruthless against foes.",
        "effectHi": "इंजीनियरिंग, खनन या रक्षा क्षेत्र में शीर्ष कमांडर, विरोधियों के प्रति कठोर।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, brave, resolute, overcomes all sibling or family friction, stands like a rock.",
      "hi": "स्त्री जातक में साहसी, दृढ़ निश्चयी, सभी पारिवारिक कठिनाइयों का डटकर मुकाबला करने वाली।"
    }
  },
  {
    "planet": "Saturn",
    "planetHi": "शनि",
    "house": 4,
    "titleEn": "Saturn in 4th House (Sukha Bhava)",
    "titleHi": "शनि चतुर्थ भाव (सुख भाव) में (कंटक शनि)",
    "baseEn": "Kantaka Shani: Distant from mother, rustic home, melancholy, chest stiffness, delay in property. Massive landed estates in mature life if well placed.",
    "baseHi": "कंटक शनि: माता से दूरी या माता को स्वास्थ्य कष्ट, गृह में उदासी, वक्षस्थल में जकड़न, संपत्ति प्राप्ति में विलंब। परिपक्व आयु में विशाल अचल संपत्ति।",
    "ageMilestones": [
      {
        "age": 28,
        "nature": "challenging",
        "eventEn": "Relocation away from home, heavy domestic responsibilities.",
        "eventHi": "गृहत्याग, सुदूर प्रवास, परिवार का भारी उत्तरदायित्व।"
      },
      {
        "age": 36,
        "nature": "favorable",
        "eventEn": "Purchase of solid immovable property, stone/concrete estate.",
        "eventHi": "मजबूत स्थाई मकान, भूमि अथवा भारी संपत्ति का क्रय।"
      },
      {
        "age": 42,
        "nature": "favorable",
        "eventEn": "Consolidation of landed wealth and ancestral restoration.",
        "eventHi": "पैतृक भूमि का जीर्णोद्धार, अचल संपत्ति का स्थायित्व।"
      }
    ],
    "signModifiers": {
      "Libra": {
        "en": "Exalted: Vast ancestral estates, massive stone mansions, high civic rank.",
        "hi": "उच्च राशि: विशाल पैतृक भूमि, मजबूत भव्य भवन, उच्च नागरिक सम्मान।"
      },
      "Aries": {
        "en": "Debilitated: Maternal grief, broken home, vehicle accidents, chest disorders.",
        "hi": "नीच राशि: माता को गंभीर कष्ट, गृह क्लेश, वाहन से चोट, वक्ष विकार।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Jupiter",
        "conditionEn": "Aspected by Jupiter",
        "conditionHi": "गुरु की दृष्टि",
        "effectEn": "Maternal longevity restored, peaceful domestic haven in late age.",
        "effectHi": "माता की दीर्घायु, उत्तरार्ध में शांतिपूर्ण व समृद्ध गृह सुख।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, domestic emotional burdens, stern demeanor, late home comfort, devoted daughter-in-law.",
      "hi": "स्त्री जातक में पारिवारिक जिम्मेदारियों का बोझ, गंभीर स्वभाव, विलंब से गृह सुख, कर्तव्यनिष्ठ।"
    }
  },
  {
    "planet": "Saturn",
    "planetHi": "शनि",
    "house": 5,
    "titleEn": "Saturn in 5th House (Suta Bhava)",
    "titleHi": "शनि पंचम भाव (संतान व बुद्धि भाव) में",
    "baseEn": "Delay in progeny, critical intellect, philosophical study, emotional detachment, stomach sensitivity, deep interest in history and ancient ruins.",
    "baseHi": "संतान प्राप्ति में विलंब, सूक्ष्म आलोचनात्मक बुद्धि, दार्शनिक अध्ययन, विरक्ति, उदर व पाचन दुर्बलता, प्राचीन इतिहास व पुरातत्व में रुचि।",
    "ageMilestones": [
      {
        "age": 28,
        "nature": "career",
        "eventEn": "Deep scholarly specialization in law, history, or engineering.",
        "eventHi": "विधि, इतिहास या तकनीकी अनुसंधान में गहन विशेषज्ञता।"
      },
      {
        "age": 36,
        "nature": "favorable",
        "eventEn": "Birth of serious, mature child, establishment of philosophical school.",
        "eventHi": "गंभीर व सुसंस्कृत संतान का जन्म, बौद्धिक क्षेत्र में प्रतिष्ठा।"
      }
    ],
    "signModifiers": {
      "Libra": {
        "en": "Exalted: Genius intellectual perseverance, illustrious mature children.",
        "hi": "उच्च राशि: विलक्षण बौद्धिक धैर्य, प्रतापी व मेधावी संतान।"
      },
      "Aries": {
        "en": "Debilitated: Severe obstacles in progeny, mental depression, abdominal surgery.",
        "hi": "नीच राशि: संतान उत्पत्ति में भारी बाधा, मानसिक अवसाद, उदर शल्य क्रिया।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Jupiter",
        "conditionEn": "Aspected by Jupiter",
        "conditionHi": "गुरु की दृष्टि",
        "effectEn": "Shields progeny, bestows profound ancient wisdom and scholarly dignity.",
        "effectHi": "संतान की रक्षा, प्राचीन ज्ञान की प्राप्ति, समाज में विद्वत सम्मान।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, delayed conception, serious disciplined children, profound spiritual wisdom, patient mother.",
      "hi": "स्त्री जातक में संतान में विलंब, अनुशासित संतान, गहन आध्यात्मिक बुद्धि, धैर्यमयी माता।"
    }
  },
  {
    "planet": "Saturn",
    "planetHi": "शनि",
    "house": 6,
    "titleEn": "Saturn in 6th House (Ripu Bhava)",
    "titleHi": "शनि षष्ठ भाव (शत्रु व रोग भाव) में",
    "baseEn": "Supreme Shatruhanta, completely crushes rivals, immune to enemies, robust against chronic diseases in later years, legal dominance.",
    "baseHi": "परम शत्रुहंता, विरोधियों को धूल चटाने वाला, षड्यंत्रों से अभेद्य, उत्तरार्ध में रोगों पर पूर्ण विजय, न्यायालयीन मुकदमों में सर्वोपरि।",
    "ageMilestones": [
      {
        "age": 28,
        "nature": "career",
        "eventEn": "Grand victory over workplace conspiracy, promotion under adversity.",
        "eventHi": "कार्यक्षेत्र के षड्यंत्रों पर भारी विजय, संघर्ष के बीच पदोन्नति।"
      },
      {
        "age": 36,
        "nature": "favorable",
        "eventEn": "Complete liquidation of old debts, annihilation of legal disputes.",
        "eventHi": "पुराने ऋणों का समूल नाश, मुकदमों में निर्णायक विजय।"
      }
    ],
    "signModifiers": {
      "Libra": {
        "en": "Exalted: Supreme justice, crushing defeat of adversaries, ironclad immunity.",
        "hi": "उच्च राशि: अद्वितीय न्याय, शत्रुओं का पूर्ण विनाश, अभेद्य रोग प्रतिरोधकता।"
      },
      "Aries": {
        "en": "Debilitated: Chronic rheumatic or bone ailments, subordinate insubordination.",
        "hi": "नीच राशि: दीर्घकालीन वात या संधि रोग, अधीनस्थों से असहयोग।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Mars",
        "conditionEn": "With Mars",
        "conditionHi": "मंगल से युति",
        "effectEn": "Fierce endurance, supreme military victory after prolonged trench warfare.",
        "effectHi": "अदम्य सहनशक्ति, लंबे संघर्ष के उपरांत निर्णायक सैन्य विजय।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, iron resilience, overcomes every adversity, disciplined health, dominant over competitors.",
      "hi": "स्त्री जातक में फौलादी सहनशक्ति, हर बाधा पर विजय, अनुशासित स्वास्थ्य, विरोधियों पर पूर्ण दबदबा।"
    }
  },
  {
    "planet": "Saturn",
    "planetHi": "शनि",
    "house": 7,
    "titleEn": "Saturn in 7th House (Kalatra Bhava)",
    "titleHi": "शनि सप्तम भाव (कलत्र भाव) में",
    "baseEn": "Mature or older spouse, delayed marriage, durable marital bond if unafflicted, business stability through persistence, slow partnerships.",
    "baseHi": "गंभीर या आयु में बड़ा जीवनसाथी, विवाह में विलंब, शुभ प्रभाव में अटूट दांपत्य, अथक परिश्रम से व्यापारिक स्थायित्व, स्थिर साझेदारी।",
    "ageMilestones": [
      {
        "age": 28,
        "nature": "challenging",
        "eventEn": "Delayed wedding settlement or serious marital duty adjustments.",
        "eventHi": "विवाह में विलंब या दांपत्य कर्तव्यों की कठिन परीक्षा।"
      },
      {
        "age": 36,
        "nature": "favorable",
        "eventEn": "Consolidation of permanent trade partnerships, stable married life.",
        "eventHi": "स्थाई व्यापारिक साझेदारी तथा दांपत्य जीवन में पूर्ण स्थिरता।"
      }
    ],
    "signModifiers": {
      "Libra": {
        "en": "Exalted: Highly noble, mature, and influential spouse; prosperous long-term trade.",
        "hi": "उच्च राशि: अत्यंत संस्कारी, गंभीर व प्रतिष्ठित जीवनसाथी; व्यापार में भारी लाभ।"
      },
      "Aries": {
        "en": "Debilitated: Bitter marital separation, chronic illness of spouse, litigation.",
        "hi": "नीच राशि: दांपत्य में कटुता, अलगाव का भय, जीवनसाथी का दीर्घकालीन रोग।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Jupiter",
        "conditionEn": "Aspected by Jupiter",
        "conditionHi": "गुरु की दृष्टि",
        "effectEn": "Removes marital thorns, grants loyal and righteous spouse, peaceful home.",
        "effectHi": "दांपत्य बाधाओं का निवारण, निष्ठावान व धर्मात्मा जीवनसाथी।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, late marriage, serious dedicated husband, durable marital duties, stability after struggle.",
      "hi": "स्त्री जातक में विलंब से विवाह, कर्तव्यनिष्ठ व गंभीर पति, अटूट दांपत्य, संघर्ष के बाद सुख।"
    }
  },
  {
    "planet": "Saturn",
    "planetHi": "शनि",
    "house": 8,
    "titleEn": "Saturn in 8th House (Ayu Bhava)",
    "titleHi": "शनि अष्टम भाव (आयु व रंध्र भाव) में",
    "baseEn": "Very long life (Ayushkaraka in 8th), chronic ailments in old age, interest in occult and geology, delayed inheritance, peaceful endurance.",
    "baseHi": "सुदीर्घ जीवन (अष्टम भाव में शनि आयु कारक), वृद्धावस्था में वात रोग, भूगर्भ व गुप्त विद्याओं में रुचि, विलंब से पैतृक धन, अगाध सहनशीलता।",
    "ageMilestones": [
      {
        "age": 36,
        "nature": "health",
        "eventEn": "Turning point of physical endurance, bone/joint care.",
        "eventHi": "शारीरिक सहनशक्ति का मोड़, संधियों व अस्थियों पर ध्यान।"
      },
      {
        "age": 44,
        "nature": "favorable",
        "eventEn": "Release of delayed legacy, occult awakening, profound longevity.",
        "eventHi": "रुकी हुई वसीयत की प्राप्ति, आध्यात्मिक जागृति, दीर्घायु की पुष्टि।"
      }
    ],
    "signModifiers": {
      "Libra": {
        "en": "Exalted: Centenarian longevity, vast hidden treasures, peaceful longevity.",
        "hi": "उच्च राशि: शतायु योग, गुप्त संपत्तियों की प्राप्ति, शांत व दीर्घ जीवन।"
      },
      "Aries": {
        "en": "Debilitated: Chronic rheumatics, fractures, disputes over inheritance.",
        "hi": "नीच राशि: दीर्घकालीन गठिया रोग, अस्थि भंग, पैतृक संपत्ति में विवाद।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Jupiter",
        "conditionEn": "Aspected by Jupiter",
        "conditionHi": "गुरु की दृष्टि",
        "effectEn": "Protects from painful ailments, guarantees peaceful spiritual demise in old age.",
        "effectHi": "कष्टकारी रोगों से मुक्ति, वृद्धावस्था में शांत व सात्विक सद्गति।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, long lived, chronic rheumatics or joint pains in mature years, serious outlook, deep endurance.",
      "hi": "स्त्री जातक में दीर्घायु, उत्तरार्ध में वात व जोड़ों का ध्यान रखें, गंभीर व सहनशील स्वभाव।"
    }
  },
  {
    "planet": "Saturn",
    "planetHi": "शनि",
    "house": 9,
    "titleEn": "Saturn in 9th House (Dharma Bhava)",
    "titleHi": "शनि नवम भाव (धर्म व भाग्य भाव) में",
    "baseEn": "Detached philosophy, slow fortune rise, conflict with orthodox dogmas, hermit inclinations in old age, justice and social duty.",
    "baseHi": "विरक्त दार्शनिक दृष्टि, विलंब से किंतु स्थाई भाग्योदय, धार्मिक रूढ़ियों का विरोध, उत्तरार्ध में वैराग्य, न्याय व सामाजिक कर्तव्य पर बल।",
    "ageMilestones": [
      {
        "age": 36,
        "nature": "career",
        "eventEn": "Solid fortune consolidation through solo labor, justice, or heavy industry.",
        "eventHi": "कठोर परिश्रम व न्याय के मार्ग से अचल भाग्योदय।"
      },
      {
        "age": 42,
        "nature": "favorable",
        "eventEn": "Spiritual pilgrimage to ancient hermitages, societal respect.",
        "eventHi": "प्राचीन तीर्थों की यात्रा, समाज में ज्ञानी के रूप में प्रतिष्ठा।"
      }
    ],
    "signModifiers": {
      "Libra": {
        "en": "Exalted: Supreme philosopher of the masses, illustrious righteous father, massive fortune.",
        "hi": "उच्च राशि: जनता का महान दार्शनिक, धर्मात्मा पिता, अखंड व स्थाई भाग्य।"
      },
      "Aries": {
        "en": "Debilitated: Strained paternal relations, cynicism towards faith, arduous travels.",
        "hi": "नीच राशि: पिता से वैचारिक मतभेद, आस्था में निराशा, कष्टप्रद यात्राएं।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Jupiter",
        "conditionEn": "With or aspected by Jupiter",
        "conditionHi": "गुरु से युति या दृष्टि",
        "effectEn": "High ascetic wisdom, bridge between tradition and reform, saintly repute.",
        "effectHi": "उच्च संन्यास ज्ञान, परंपरा व सुधार का समन्वय, संत तुल्य आदर।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, austere, duty-bound, patient, unconventional spiritual path, brings stability to family.",
      "hi": "स्त्री जातक में सादगीपसंद, कर्तव्यनिष्ठ, अगाध धैर्य, कुल में मर्यादा व स्थिरता की संरक्षिका।"
    }
  },
  {
    "planet": "Saturn",
    "planetHi": "शनि",
    "house": 10,
    "titleEn": "Saturn in 10th House (Karma Bhava)",
    "titleHi": "शनि दशम भाव (कर्म व राज्य भाव) में",
    "baseEn": "Supreme rise from humble origins to high administrative status, mass leadership, political authority, unyielding endurance. Fall from height if afflicted.",
    "baseHi": "साधारण स्थिति से उठकर सर्वोच्च प्रशासनिक शिखर पर पहुंचना, जनसमर्थन, राजनीतिक सत्ता, अटूट कर्मठता। पाप प्रभाव में पदच्युति का भय।",
    "ageMilestones": [
      {
        "age": 28,
        "nature": "career",
        "eventEn": "Major initiation into public service, trade union, or heavy industrial management.",
        "eventHi": "लोक सेवा, औद्योगिक प्रबंधन या जनसंगठन में महत्वपूर्ण शुरुआत।"
      },
      {
        "age": 36,
        "nature": "favorable",
        "eventEn": "Elevation to supreme executive rank, mass following, governmental honors.",
        "eventHi": "सर्वोच्च प्रशासनिक पद पर पदोन्नति, जनप्रियता, राजकीय सम्मान।"
      },
      {
        "age": 42,
        "nature": "career",
        "eventEn": "Apex of political or corporate sovereignty, indestructible authority.",
        "eventHi": "राजनीतिक या कॉर्पोरेट सत्ता का चरमोत्कर्ष, अविचल प्रभुत्व।"
      }
    ],
    "signModifiers": {
      "Libra": {
        "en": "Exalted: Prime minister, mass sovereign, supreme judge, monumental legacy.",
        "hi": "उच्च राशि: शीर्ष जननेता, प्रधानमंत्री तुल्य प्रभाव, सर्वोच्च न्यायाधीश।"
      },
      "Aries": {
        "en": "Debilitated: Arduous manual labor, professional defamation, sudden fall from post.",
        "hi": "नीच राशि: अत्यधिक कठोर श्रम का अल्प लाभ, पदच्युति का भय।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Sun",
        "conditionEn": "With Sun",
        "conditionHi": "सूर्य से युति",
        "effectEn": "Fierce conflict with superiors followed by eventual independent sovereign rule.",
        "effectHi": "अधिकारियों से तीव्र संघर्ष के बाद स्वतंत्र सत्ता की स्थापना।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, remarkable professional endurance, respected manager, high executive rank, unshakeable work ethic.",
      "hi": "स्त्री जातक में अद्भुत कार्यक्षमता, सम्मानित प्रबंधक, उच्च प्रशासनिक पद, कर्तव्यपरायणता।"
    }
  },
  {
    "planet": "Saturn",
    "planetHi": "शनि",
    "house": 11,
    "titleEn": "Saturn in 11th House (Labha Bhava)",
    "titleHi": "शनि एकादश भाव (लाभ भाव) में",
    "baseEn": "Durable long-term wealth, older influential friends, political networks, long-term aspirations realized through perseverance and industry.",
    "baseHi": "अचल व स्थाई विपुल धन, वयोवृद्ध व प्रभावशाली मित्रों का संग, राजनीतिक नेटवर्क, अथक परिश्रम से सभी दीर्घकालिक लक्ष्यों की प्राप्ति।",
    "ageMilestones": [
      {
        "age": 36,
        "nature": "favorable",
        "eventEn": "Massive wealth consolidation through real estate, metallurgy, or manufacturing.",
        "eventHi": "भूमि, धातु उद्योग या विनिर्माण से भारी स्थाई धन संचय।"
      },
      {
        "age": 44,
        "nature": "favorable",
        "eventEn": "Apex of multi-millionaire status, political victory, elder sibling alliance.",
        "eventHi": "विशाल आर्थिक साम्राज्य का स्थायित्व, राजनीतिक विजय।"
      }
    ],
    "signModifiers": {
      "Libra": {
        "en": "Exalted: Multi-billionaire potential, vast industrial empire, steadfast allies.",
        "hi": "उच्च राशि: उद्योगपति योग, विशाल औद्योगिक साम्राज्य, निष्ठावान मित्र।"
      },
      "Aries": {
        "en": "Debilitated: Strained relations with elder brother, fluctuating profits, debt recovery.",
        "hi": "नीच राशि: अग्रज से मतभेद, लाभ में रुकावटें, ऋण वसूली में तनाव।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Jupiter",
        "conditionEn": "Aspected by Jupiter",
        "conditionHi": "गुरु की दृष्टि",
        "effectEn": "Eternal righteous wealth, noble public infrastructure endowments.",
        "effectHi": "अक्षय धर्म सम्मत धन, सार्वजनिक निर्माण व जन कल्याण में दान।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, wealthy, durable friendships, steady income from industry or land, fulfilled life ambitions.",
      "hi": "स्त्री जातक में विपुल धन, स्थाई मित्रता, उद्योग या भूमि से निरंतर आय, मनोकामनाओं की पूर्ति।"
    }
  },
  {
    "planet": "Saturn",
    "planetHi": "शनि",
    "house": 12,
    "titleEn": "Saturn in 12th House (Vyaya Bhava)",
    "titleHi": "शनि द्वादश भाव (व्यय व मोक्ष भाव) में",
    "baseEn": "Heavy expenses on duty and hospitality, solitude, asceticism, left eye weakness, foreign labor, quiet endurance of hardships.",
    "baseHi": "कर्तव्य व परिजनों पर भारी व्यय, एकांतप्रियता, वैराग्य, बाएं नेत्र में दुर्बलता, विदेश में कठोर परिश्रम, कष्टों को मौन सहन करने की शक्ति।",
    "ageMilestones": [
      {
        "age": 36,
        "nature": "career",
        "eventEn": "Relocation to foreign country or secluded spiritual retreat.",
        "eventHi": "विदेश प्रवास अथवा एकांत आध्यात्मिक साधना केंद्र में वास।"
      },
      {
        "age": 45,
        "nature": "favorable",
        "eventEn": "Spiritual detachment, profound meditation, liberation from worldly entanglements.",
        "eventHi": "आध्यात्मिक विरक्ति, गहन ध्यान, सांसारिक बंधनों से मुक्ति।"
      }
    ],
    "signModifiers": {
      "Libra": {
        "en": "Exalted: Immense overseas wealth, peaceful ascetic meditation, foreign honor.",
        "hi": "उच्च राशि: विदेश में विपुल धनोपार्जन, शांत संन्यास साधना, परदेस में आदर।"
      },
      "Aries": {
        "en": "Debilitated: Heavy hospital bills, confinement risks, eye ailments.",
        "hi": "नीच राशि: चिकित्सालय का भारी व्यय, बंधन भय, नेत्र पीड़ा।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Jupiter",
        "conditionEn": "Aspected by Jupiter",
        "conditionHi": "गुरु की दृष्टि",
        "effectEn": "Moksha seeker, divine protection abroad, charitable expenditures.",
        "effectHi": "मोक्ष मार्ग की ओर अग्रसर, विदेश में ईश्वरीय रक्षा, धर्मार्थ व्यय।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, detached, ascetic leanings, silent suffering without complaint, spiritual retreat.",
      "hi": "स्त्री जातक में विरक्त स्वभाव, कष्टों को मौन सहने वाली, सात्विक साधना, विदेश वास।"
    }
  },
  {
    "planet": "Rahu",
    "planetHi": "राहु",
    "house": 1,
    "titleEn": "Rahu in 1st House (Lagna)",
    "titleHi": "राहु प्रथम भाव (लग्न) में",
    "baseEn": "Magnetic personality, ambitious, unconventional, eccentric, foreign connections, head or nerve sensitivity, desire for public limelight.",
    "baseHi": "सम्मोहक व्यक्तित्व, अत्यंत महत्वाकांक्षी, लीक से हटकर चलने वाला, विदेशी संपर्क, शिर या स्नायु संवेदनशीलता, जनसामान्य में छा जाने की तीव्र लालसा।",
    "ageMilestones": [
      {
        "age": 19,
        "nature": "career",
        "eventEn": "Sudden emergence into public notice, unconventional career start.",
        "eventHi": "सार्वजनिक पटल पर अप्रत्याशित उदय, विशिष्ट आजीविका का प्रारंभ।"
      },
      {
        "age": 28,
        "nature": "favorable",
        "eventEn": "Major foreign travel, international connections, unconventional breakthrough.",
        "eventHi": "विदेश गमन, अंतरराष्ट्रीय संपर्क, अप्रत्याशित बड़ी सफलता।"
      },
      {
        "age": 42,
        "nature": "career",
        "eventEn": "Apex of political influence, media empire, or technological revolution.",
        "eventHi": "राजनीतिक प्रभाव, मीडिया या तकनीकी साम्राज्य का चरमोत्कर्ष।"
      }
    ],
    "signModifiers": {
      "Taurus": {
        "en": "Exalted: Enormous wealth, magnetic charisma, commanding media influence.",
        "hi": "उच्च राशि (वृषभ): अकूत धन संपदा, सम्मोहक व्यक्तित्व, मीडिया में व्यापक प्रभाव।"
      },
      "Scorpio": {
        "en": "Debilitated: Nervous anxiety, eccentric mood swings, mysterious ailments.",
        "hi": "नीच राशि (वृश्चिक): मानसिक उद्वेग, रहस्यमयी विकार, अनिद्रा।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Jupiter",
        "conditionEn": "With or aspected by Jupiter",
        "conditionHi": "गुरु की युति या दृष्टि (गुरु-चांडाल परिहार)",
        "effectEn": "Converts ambition into profound research, technological genius, philosophical reformer.",
        "effectHi": "चांडाल दोष का परिहार, गहन वैज्ञानिक शोध, तकनीकी प्रतिभा, समाज सुधारक।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, bold, modern outlook, unconventional personality, independent decision maker, nervous care needed.",
      "hi": "स्त्री जातक में साहसी, आधुनिक दृष्टिकोण, स्वतंत्र निर्णय क्षमता, स्नायु व मानसिक शांति का ध्यान रखें।"
    }
  },
  {
    "planet": "Rahu",
    "planetHi": "राहु",
    "house": 2,
    "titleEn": "Rahu in 2nd House (Dhana Bhava)",
    "titleHi": "राहु द्वितीय भाव (धन भाव) में",
    "baseEn": "Unorthodox speech, sudden financial windfalls and sudden dips, dental or throat vulnerability, foreign languages, unconventional culinary tastes.",
    "baseHi": "विशिष्ट व कूटनीतिक वाणी, अचानक धन लाभ व अप्रत्याशित व्यय, दंत या कंठ संवेदनशीलता, विदेशी भाषाओं में निपुण, विविध खानपान प्रिय।",
    "ageMilestones": [
      {
        "age": 28,
        "nature": "favorable",
        "eventEn": "Sudden financial windfall through foreign trade, stocks, or media.",
        "eventHi": "विदेशी व्यापार, शेयर बाजार या मीडिया से अचानक भारी धन लाभ।"
      },
      {
        "age": 42,
        "nature": "challenging",
        "eventEn": "Financial restructuring, speech caution required in family disputes.",
        "eventHi": "आर्थिक पुनर्गठन, कुटुंब में वाणी के संयम की आवश्यकता।"
      }
    ],
    "signModifiers": {
      "Taurus": {
        "en": "Exalted: Multifold wealth through currency exchange, international commerce, and tech.",
        "hi": "उच्च राशि: विदेशी मुद्रा, अंतरराष्ट्रीय व्यापार व तकनीक से विपुल धनोपार्जन।"
      },
      "Scorpio": {
        "en": "Debilitated: Losses through fraud, harsh speech causing estrangement.",
        "hi": "नीच राशि: धोखे से धनहानि, कटु वाणी से संबंधों में दरार।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Jupiter",
        "conditionEn": "Aspected by Jupiter",
        "conditionHi": "गुरु की दृष्टि",
        "effectEn": "Controls speech, bestows legitimate international financial prosperity.",
        "effectHi": "वाणी में संतुलन, अंतरराष्ट्रीय स्तर पर न्यायपूर्ण धन संचय।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, bold speech, fond of foreign cuisines and ornaments, sudden monetary shifts, guardian of assets.",
      "hi": "स्त्री जातक में निर्भीक वाणी, नवीन व्यंजनों व आभूषणों की शौकीन, आर्थिक उतार-चढ़ाव में धैर्य आवश्यक।"
    }
  },
  {
    "planet": "Rahu",
    "planetHi": "राहु",
    "house": 3,
    "titleEn": "Rahu in 3rd House (Sahaja Bhava)",
    "titleHi": "राहु तृतीय भाव (पराक्रम भाव) में",
    "baseEn": "Extreme daring, media and IT tech brilliance, friction with younger siblings, international travel, invincible competitive drive.",
    "baseHi": "अद्वितीय दुस्साहस, मीडिया व आईटी तकनीकी प्रतिभा, छोटे भाइयों से मतभेद, अंतरराष्ट्रीय यात्राएं, प्रतिस्पर्धा में अजेय।",
    "ageMilestones": [
      {
        "age": 21,
        "nature": "career",
        "eventEn": "Bold breakthrough into media, software, internet, or communications.",
        "eventHi": "मीडिया, सॉफ्टवेयर, इंटरनेट या संचार क्षेत्र में साहसिक पदार्पण।"
      },
      {
        "age": 28,
        "nature": "favorable",
        "eventEn": "Triumph over competition, major overseas contract or publishing success.",
        "eventHi": "प्रतिस्पर्धा पर पूर्ण विजय, विदेशी अनुबंध अथवा प्रकाशन में ख्याति।"
      }
    ],
    "signModifiers": {
      "Taurus": {
        "en": "Exalted: Supreme media mogul, invincible digital pioneer, vast influence.",
        "hi": "उच्च राशि: डिजिटल मीडिया में सर्वोच्च धाक, अजेय पराक्रम, व्यापक प्रभाव।"
      },
      "Scorpio": {
        "en": "Debilitated: Strained relations with brothers, reckless communication risks.",
        "hi": "नीच राशि: सहोदरों से कटुता, संवाद में जल्दबाजी से विवाद।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Mercury",
        "conditionEn": "With Mercury",
        "conditionHi": "बुध से युति",
        "effectEn": "Digital tech genius, software architect, mass internet influencer.",
        "effectHi": "सॉफ्टवेयर व इंटरनेट में विलक्षण प्रतिभा, जनसंचार में विशिष्ट स्थान।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, courageous, tech-savvy, dynamic, independent, stands firm against social pressures.",
      "hi": "स्त्री जातक में अत्यंत साहसी, तकनीकी कार्यों में दक्ष, स्वतंत्र विचारों वाली, समाज में अलग पहचान।"
    }
  },
  {
    "planet": "Rahu",
    "planetHi": "राहु",
    "house": 4,
    "titleEn": "Rahu in 4th House (Sukha Bhava)",
    "titleHi": "राहु चतुर्थ भाव (सुख भाव) में",
    "baseEn": "Restless home life, foreign residence, distance from maternal roots, modern luxury apartments, automotive passions, heart/chest sensitivity.",
    "baseHi": "गृह में मानसिक अशांति, विदेश वास का प्रबल योग, मातृभूमि से दूरी, आधुनिक सुख-सुविधाओं से युक्त आवास, वाहन प्रेमी, वक्षस्थल संवेदनशीलता।",
    "ageMilestones": [
      {
        "age": 28,
        "nature": "career",
        "eventEn": "Relocation to foreign country or distant metropolis, home purchase.",
        "eventHi": "विदेश या दूरस्थ महानगर में आवास, आधुनिक मकान का क्रय।"
      },
      {
        "age": 42,
        "nature": "favorable",
        "eventEn": "Acquisition of high-tech luxury vehicle or premium real estate.",
        "eventHi": "अत्याधुनिक वाहन अथवा बहुमूल्य अचल संपत्ति की प्राप्ति।"
      }
    ],
    "signModifiers": {
      "Taurus": {
        "en": "Exalted: Modern mansions, fleet of luxury imported vehicles, high comfort abroad.",
        "hi": "उच्च राशि: भव्य आधुनिक प्रासाद, विदेशी उत्तम वाहन, विदेश में सुख-सुविधाएं।"
      },
      "Scorpio": {
        "en": "Debilitated: Maternal health sorrow, domestic estrangement, vehicle breakdowns.",
        "hi": "नीच राशि: माता के स्वास्थ्य की चिंता, गृह क्लेश, वाहन में बाधाएं।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Jupiter",
        "conditionEn": "Aspected by Jupiter",
        "conditionHi": "गुरु की दृष्टि",
        "effectEn": "Restores domestic peace, protects maternal health, noble residence abroad.",
        "effectHi": "गृह शांति की पुनर्स्थापना, माता की रक्षा, विदेश में सुखद वास।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, domestic restlessness, modern lifestyle, lives away from birthplace, stylish home decor.",
      "hi": "स्त्री जातक में जन्मभूमि से दूर वास, आधुनिक जीवनशैली, सुंदर व सुरुचिपूर्ण गृह सज्जा।"
    }
  },
  {
    "planet": "Rahu",
    "planetHi": "राहु",
    "house": 5,
    "titleEn": "Rahu in 5th House (Suta Bhava)",
    "titleHi": "राहु पंचम भाव (संतान व बुद्धि भाव) में",
    "baseEn": "Brilliant speculative intellect, unconventional studies, electronics/AI genius, delay in children, stomach heat, sharp analytical instincts.",
    "baseHi": "जोखिम भरे निवेश में विलक्षण बुद्धि, लीक से हटकर शिक्षा, इलेक्ट्रॉनिक्स व आर्टिफिशियल इंटेलिजेंस में मेधा, संतान में विलंब, उदर में गैस व पित्त।",
    "ageMilestones": [
      {
        "age": 28,
        "nature": "career",
        "eventEn": "Breakthrough in high-tech research, speculative financial windfall.",
        "eventHi": "उच्च तकनीकी शोध में बड़ी सफलता, शेयर बाजार या सट्टे में अप्रत्याशित लाभ।"
      },
      {
        "age": 42,
        "nature": "favorable",
        "eventEn": "Birth of unique, tech-savvy child, creative intellectual summit.",
        "eventHi": "विलक्षण व मेधावी संतान का जन्म, बौद्धिक क्षेत्र में शिखर सम्मान।"
      }
    ],
    "signModifiers": {
      "Taurus": {
        "en": "Exalted: Financial tech genius, multi-millionaire through algorithmic trading.",
        "hi": "उच्च राशि: वित्तीय तकनीकी का महारथी, एल्गोरिद्मिक ट्रेडिंग से विपुल धन।"
      },
      "Scorpio": {
        "en": "Debilitated: Abdominal complaints, speculative losses, pregnancy vigilance needed.",
        "hi": "नीच राशि: उदर विकार, सट्टेबाजी में हानि, गर्भावस्था में विशेष सावधानी।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Jupiter",
        "conditionEn": "Aspected by Jupiter",
        "conditionHi": "गुरु की दृष्टि",
        "effectEn": "Shields progeny, channels intellect into profound scientific discoveries.",
        "effectHi": "संतान की रक्षा, बुद्धि का उच्च वैज्ञानिक व दार्शनिक शोध में उपयोग।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, pregnancy vigilance required, sharp intuitive intellect, modern parenting, innovative learner.",
      "hi": "स्त्री जातक में गर्भावस्था के समय विशेष सतर्कता, कुशाग्र अंतर्ज्ञान, आधुनिक मातृत्व, मेधावी।"
    }
  },
  {
    "planet": "Rahu",
    "planetHi": "राहु",
    "house": 6,
    "titleEn": "Rahu in 6th House (Ripu Bhava)",
    "titleHi": "राहु षष्ठ भाव (शत्रु व रोग भाव) में",
    "baseEn": "Shatruhanta par excellence, completely obliterates all adversaries, succeeds in cut-throat corporate/political competition, foreign medicine, robust vitality.",
    "baseHi": "परम शत्रुहंता, विरोधियों व षड्यंत्रकारियों को नेस्तनाबूद करने वाला, कॉर्पोरेट व राजनीतिक गलाकाट प्रतिस्पर्धा में विजयी, विदेशी चिकित्सा, अद्भुत रोग प्रतिरोधकता।",
    "ageMilestones": [
      {
        "age": 21,
        "nature": "career",
        "eventEn": "Stunning triumph in fierce competitive trial or legal dispute.",
        "eventHi": "कठिन प्रतियोगी परीक्षा या विधिक विवाद में चौंकाने वाली विजय।"
      },
      {
        "age": 28,
        "nature": "favorable",
        "eventEn": "Total destruction of rivals, overseas business dominance.",
        "eventHi": "विरोधियों का समूल नाश, विदेशी व्यापार व कार्यक्षेत्र में धाक।"
      },
      {
        "age": 42,
        "nature": "favorable",
        "eventEn": "Unchallenged supremacy over litigation, debt liquidation.",
        "eventHi": "मुकदमों पर पूर्ण नियंत्रण, पुराने ऋणों की पूर्ण अदायगी।"
      }
    ],
    "signModifiers": {
      "Taurus": {
        "en": "Exalted: Supreme conqueror of all litigation and diseases, international power.",
        "hi": "उच्च राशि: सभी मुकदमों व रोगों पर अजेय विजय, अंतरराष्ट्रीय स्तर पर प्रभाव।"
      },
      "Scorpio": {
        "en": "Debilitated: Undiagnosed ailments, sudden workplace conspiracies.",
        "hi": "नीच राशि: कठिन रोग, कार्यक्षेत्र में गुप्त षड्यंत्रों का सामना।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Jupiter",
        "conditionEn": "Aspected by Jupiter",
        "conditionHi": "गुरु की दृष्टि",
        "effectEn": "Righteous victory, immune to negative energies, respected peacemaker.",
        "effectHi": "धर्म सम्मत विजय, नकारात्मक ऊर्जाओं से पूर्ण सुरक्षा, सम्मानित व्यक्तित्व।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, fearless against rivals, handles workplace pressure brilliantly, robust endurance.",
      "hi": "स्त्री जातक में विरोधियों के सामने निर्भीक, कार्यक्षेत्र के दबाव को कुशलता से संभालने वाली, साहसी।"
    }
  },
  {
    "planet": "Rahu",
    "planetHi": "राहु",
    "house": 7,
    "titleEn": "Rahu in 7th House (Kalatra Bhava)",
    "titleHi": "राहु सप्तम भाव (कलत्र भाव) में",
    "baseEn": "Inter-caste, inter-cultural, or foreign marriage, unconventional spouse, marital friction, complex commercial partnerships, sudden unions.",
    "baseHi": "अंतरजातीय या विदेशी विवाह का प्रबल योग, जीवनसाथी का विशिष्ट व आधुनिक स्वभाव, दांपत्य में उतार-चढ़ाव, व्यापारिक साझेदारी में सावधानी, अचानक विवाह।",
    "ageMilestones": [
      {
        "age": 28,
        "nature": "challenging",
        "eventEn": "Sudden marriage proposal or partnership shift requiring vigilance.",
        "eventHi": "अचानक विवाह प्रस्ताव अथवा व्यापारिक अनुबंध में महत्वपूर्ण मोड़।"
      },
      {
        "age": 36,
        "nature": "favorable",
        "eventEn": "International business partnership success, matrimonial stabilization.",
        "eventHi": "अंतरराष्ट्रीय व्यापार में भारी सफलता, दांपत्य जीवन में स्थिरता।"
      }
    ],
    "signModifiers": {
      "Taurus": {
        "en": "Exalted: Wealthy, unconventional, foreign-connected spouse; flourishing trade.",
        "hi": "उच्च राशि: अत्यंत धनी व विदेशी पृष्ठभूमि का जीवनसाथी; व्यापार में भारी लाभ।"
      },
      "Scorpio": {
        "en": "Debilitated: Marital deceit, sudden separation risk, legal disputes with partner.",
        "hi": "नीच राशि: दांपत्य में अविश्वास, अलगाव का भय, साझेदारी में विधिक विवाद।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Jupiter",
        "conditionEn": "Aspected by Jupiter",
        "conditionHi": "गुरु की दृष्टि",
        "effectEn": "Saves marital bond, converts differences into mutual international expansion.",
        "effectHi": "दांपत्य की रक्षा, वैचारिक भिन्नता को व्यापारिक लाभ में बदलने वाला।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, unconventional husband, independent married life, vigilance in contracts, foreign travel with spouse.",
      "hi": "स्त्री जातक में आधुनिक विचारों वाला पति, स्वतंत्र वैवाहिक जीवन, अनुबंधों में सावधानी, पति के साथ विदेश गमन।"
    }
  },
  {
    "planet": "Rahu",
    "planetHi": "राहु",
    "house": 8,
    "titleEn": "Rahu in 8th House (Ayu Bhava)",
    "titleHi": "राहु अष्टम भाव (आयु व रंध्र भाव) में",
    "baseEn": "Sudden financial windfalls, occult mastery, chronic undiagnosed ailments, accident risks, inheritance through insurance or unearned wealth.",
    "baseHi": "अचानक भारी धन लाभ, गुप्त विद्याओं व तंत्र में सिद्धि, अज्ञात व अनिदान रोग, दुर्घटना से सावधानी, बीमा या वसीयत से अप्रत्याशित संपत्ति।",
    "ageMilestones": [
      {
        "age": 28,
        "nature": "health",
        "eventEn": "Sudden physical or emotional upheaval, health vigilance year.",
        "eventHi": "अचानक शारीरिक या मानसिक संकट का सतर्कता वर्ष।"
      },
      {
        "age": 42,
        "nature": "favorable",
        "eventEn": "Massive unexpected financial legacy, profound occult breakthrough.",
        "eventHi": "अप्रत्याशित विशाल धन लाभ, वसीयत अथवा गुप्त अनुसंधान में सफलता।"
      }
    ],
    "signModifiers": {
      "Taurus": {
        "en": "Exalted: Immense sudden treasures, longevity protected through advanced medicine.",
        "hi": "उच्च राशि: अचानक विपुल धन संपदा, आधुनिक चिकित्सा से आयु रक्षा।"
      },
      "Scorpio": {
        "en": "Debilitated: Risk of toxicity, undiagnosed nervous ailments, sudden legal traps.",
        "hi": "नीच राशि: विष या औषध संवेदनशीलता, स्नायु रोग, विधिक उलझनें।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Jupiter",
        "conditionEn": "Aspected by Jupiter",
        "conditionHi": "गुरु की दृष्टि",
        "effectEn": "Shields vitality, neutralizes accidents, bestows profound metaphysical research.",
        "effectHi": "प्राणों की पूर्ण रक्षा, संकटों से बचाव, उच्च आध्यात्मिक शोध।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, mystical intuition, sudden inheritance from in-laws, reproductive caution, calm mind needed.",
      "hi": "स्त्री जातक में रहस्यमयी अंतर्ज्ञान, ससुराल से आकस्मिक धन, जननेंद्रिय स्वास्थ्य पर ध्यान दें।"
    }
  },
  {
    "planet": "Rahu",
    "planetHi": "राहु",
    "house": 9,
    "titleEn": "Rahu in 9th House (Dharma Bhava)",
    "titleHi": "राहु नवम भाव (धर्म व भाग्य भाव) में",
    "baseEn": "Unorthodox philosophy, foreign travels, clash with traditional orthodoxy, sudden fortune abroad, patron of futuristic causes.",
    "baseHi": "रूढ़िमुक्त दार्शनिक विचार, बहुविध विदेश यात्राएं, परंपराओं से असहमति, विदेश में अप्रत्याशित भाग्योदय, भविष्योन्मुखी योजनाओं का प्रवर्तक।",
    "ageMilestones": [
      {
        "age": 28,
        "nature": "favorable",
        "eventEn": "Foreign pilgrimage, international migration, dramatic fortune shift.",
        "eventHi": "विदेश गमन, सुदूर स्थानों में प्रवास, भाग्य में क्रांतिकारी परिवर्तन।"
      },
      {
        "age": 42,
        "nature": "career",
        "eventEn": "International recognition as unconventional thinker or cross-border leader.",
        "eventHi": "अंतरराष्ट्रीय स्तर पर ख्याति, वैश्विक स्तर पर नेतृत्व।"
      }
    ],
    "signModifiers": {
      "Taurus": {
        "en": "Exalted: Immense fortune abroad, global business empire, high foreign honors.",
        "hi": "उच्च राशि: विदेश में अखंड सौभाग्य, वैश्विक व्यापारिक साम्राज्य, अंतरराष्ट्रीय सम्मान।"
      },
      "Scorpio": {
        "en": "Debilitated: Friction with father, travel hardships, loss of faith under crisis.",
        "hi": "नीच राशि: पिता से मतभेद, यात्रा में कष्ट, संकट के समय आस्था में विचलन।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Jupiter",
        "conditionEn": "Aspected by Jupiter",
        "conditionHi": "गुरु की दृष्टि",
        "effectEn": "Blends ancient wisdom with modern tech, broad-minded spiritual reformer.",
        "effectHi": "प्राचीन ज्ञान व आधुनिक विज्ञान का समन्वय, उदार आध्यात्मिक सुधारक।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, broad worldview, travels extensively, unconventional beliefs, independent fortune builder.",
      "hi": "स्त्री जातक में उदार दृष्टिकोण, व्यापक यात्राएं, स्वतंत्र धार्मिक विचार, स्वप्रयासों से भाग्योदय।"
    }
  },
  {
    "planet": "Rahu",
    "planetHi": "राहु",
    "house": 10,
    "titleEn": "Rahu in 10th House (Karma Bhava)",
    "titleHi": "राहु दशम भाव (कर्म व राज्य भाव) में",
    "baseEn": "Explosive career rise, political power, media and technology mogul, famous through unconventional means, influential masses connection.",
    "baseHi": "कार्यक्षेत्र में उल्कावत तीव्र उत्थान, राजनीतिक सत्ता, मीडिया व उच्च तकनीकी साम्राज्य, विशिष्ट साधनों से ख्याति, जनसामान्य में अभूतपूर्व प्रभाव।",
    "ageMilestones": [
      {
        "age": 28,
        "nature": "career",
        "eventEn": "Daring career leap, unexpected elevation into corporate or political ranks.",
        "eventHi": "आजीविका में साहसिक छलांग, कॉर्पोरेट या राजनीति में अप्रत्याशित पद।"
      },
      {
        "age": 36,
        "nature": "favorable",
        "eventEn": "Massive professional breakthrough, state or international recognition.",
        "eventHi": "ऐतिहासिक व्यावसायिक सफलता, राष्ट्रीय या अंतरराष्ट्रीय पहचान।"
      },
      {
        "age": 42,
        "nature": "career",
        "eventEn": "Apex of sovereign executive or industrial mastery, legendary renown.",
        "eventHi": "सत्ता व आजीविका का सर्वोच्च शिखर, व्यापक ख्याति।"
      }
    ],
    "signModifiers": {
      "Taurus": {
        "en": "Exalted: Multi-billionaire corporate titan, influential statesman, tech pioneer.",
        "hi": "उच्च राशि: शीर्ष उद्योगपति, अत्यंत प्रभावशाली राजनेता, तकनीकी अग्रणी।"
      },
      "Scorpio": {
        "en": "Debilitated: Sudden fall from status through scandal, professional defamation.",
        "hi": "नीच राशि: षड्यंत्र से पदच्युति का भय, कार्यक्षेत्र में बदनामी की आशंका।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Jupiter",
        "conditionEn": "Aspected by Jupiter",
        "conditionHi": "गुरु की दृष्टि",
        "effectEn": "High ethical authority, protects from scandals, durable state power.",
        "effectHi": "उच्च नैतिक प्रतिष्ठा, बदनामी से सुरक्षा, स्थाई राजकीय सत्ता।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, dynamic corporate or public career, charismatic leader, high ambition realized.",
      "hi": "स्त्री जातक में कॉर्पोरेट या जनसेवा में सर्वोच्च पद, सम्मोहक नेत्री, उच्च महत्वाकांक्षाओं की पूर्ति।"
    }
  },
  {
    "planet": "Rahu",
    "planetHi": "राहु",
    "house": 11,
    "titleEn": "Rahu in 11th House (Labha Bhava)",
    "titleHi": "राहु एकादश भाव (लाभ भाव) में",
    "baseEn": "Massive foreign wealth, influential international networks, sudden financial windfalls, ambitious aspirations fulfilled beyond expectation.",
    "baseHi": "विदेशी स्रोतों से अपार धन, अंतरराष्ट्रीय संपर्कों का लाभ, अचानक विपुल धन लाभ, कल्पना से परे सभी महत्वाकांक्षाओं की पूर्ण सिद्धि।",
    "ageMilestones": [
      {
        "age": 28,
        "nature": "favorable",
        "eventEn": "Sudden financial windfall through tech, digital media, or foreign contracts.",
        "eventHi": "तकनीक, डिजिटल मीडिया या विदेशी अनुबंधों से अचानक विपुल धन।"
      },
      {
        "age": 42,
        "nature": "favorable",
        "eventEn": "Apex of multi-millionaire status, vast multinational network.",
        "eventHi": "अथाह आर्थिक समृद्धि, बहुराष्ट्रीय व्यापारिक नेटवर्क का विस्तार।"
      }
    ],
    "signModifiers": {
      "Taurus": {
        "en": "Exalted: Unlimited multi-stream wealth, gold, luxury real estate, global fame.",
        "hi": "उच्च राशि: असीमित बहुमुखी धन, स्वर्ण, विलासिता संपत्तियां, वैश्विक ख्याति।"
      },
      "Scorpio": {
        "en": "Debilitated: Fluctuating profits, legal penalties, deceitful business allies.",
        "hi": "नीच राशि: आय में उतार-चढ़ाव, विधिक दंड, साझेदारों से विश्वासघात।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Jupiter",
        "conditionEn": "Aspected by Jupiter",
        "conditionHi": "गुरु की दृष्टि",
        "effectEn": "Immense legitimate wealth, charitable endowments, honest international influence.",
        "effectHi": "विपुल धर्म सम्मत धन, विशाल दान-पुण्य, अंतरराष्ट्रीय मान-सम्मान।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, highly affluent, vast international network, foreign associations, fulfilled wishes.",
      "hi": "स्त्री जातक में अत्यधिक संपन्न, अंतरराष्ट्रीय मित्र मंडली, विदेशी संबंध, सभी इच्छाओं की पूर्ति।"
    }
  },
  {
    "planet": "Rahu",
    "planetHi": "राहु",
    "house": 12,
    "titleEn": "Rahu in 12th House (Vyaya Bhava)",
    "titleHi": "राहु द्वादश भाव (व्यय व मोक्ष भाव) में",
    "baseEn": "Foreign permanent settlement, heavy expenditure on technology and luxury, sleep disturbances, spiritual wanderer in mature life.",
    "baseHi": "विदेश में स्थाई वास, तकनीकी व विलासिता पर भारी व्यय, अनिद्रा की समस्या, जीवन के उत्तरार्ध में आध्यात्मिक अन्वेषक।",
    "ageMilestones": [
      {
        "age": 28,
        "nature": "career",
        "eventEn": "Permanent foreign emigration, overseas employment initiation.",
        "eventHi": "विदेश में स्थाई प्रवास, सुदूर परदेस में आजीविका का प्रारंभ।"
      },
      {
        "age": 42,
        "nature": "favorable",
        "eventEn": "Foreign property acquisition, metaphysical seclusion, victory over secret foes.",
        "eventHi": "विदेश में अचल संपत्ति, एकांत में आध्यात्मिक साधना, गुप्त शत्रुओं का शमन।"
      }
    ],
    "signModifiers": {
      "Taurus": {
        "en": "Exalted: Immense wealth earned abroad, luxury lifestyle in foreign lands.",
        "hi": "उच्च राशि: विदेश में विपुल धनोपार्जन, परदेस में वैभवशाली जीवन।"
      },
      "Scorpio": {
        "en": "Debilitated: Heavy hospital or legal expenses abroad, severe insomnia.",
        "hi": "नीच राशि: परदेस में चिकित्सालय का भारी व्यय, गंभीर अनिद्रा, कारागार भय।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Jupiter",
        "conditionEn": "Aspected by Jupiter",
        "conditionHi": "गुरु की दृष्टि",
        "effectEn": "Spiritual detachment, divine protection in foreign lands, charitable expenses.",
        "effectHi": "आध्यात्मिक विरक्ति, विदेश में ईश्वरीय रक्षा, परोपकार में व्यय।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, lives away from birthplace, secret philanthropy, spiritual seeker, sleep hygiene required.",
      "hi": "स्त्री जातक में जन्मभूमि से दूर वास, गुप्त दानशीलता, आध्यात्मिक प्रवृत्ति, निद्रा पर ध्यान आवश्यक।"
    }
  },
  {
    "planet": "Ketu",
    "planetHi": "केतु",
    "house": 1,
    "titleEn": "Ketu in 1st House (Lagna)",
    "titleHi": "केतु प्रथम भाव (लग्न) में",
    "baseEn": "Spiritual, introspective, psychic intuition, scar or birthmark on body, detached ego, philosophical, indifferent to material vanity.",
    "baseHi": "आध्यात्मिक, आत्मनिरीक्षक, गहन अंतर्ज्ञान, देह पर कोई विशिष्ट चिह्न या तिल, निरहंकारी, दार्शनिक, भौतिक आडंबरों से विरक्त।",
    "ageMilestones": [
      {
        "age": 24,
        "nature": "career",
        "eventEn": "Spiritual awakening, interest in astrology, coding, or healing.",
        "eventHi": "आध्यात्मिक जागृति, ज्योतिष, कोडिंग अथवा प्राकृतिक चिकित्सा में रुचि।"
      },
      {
        "age": 35,
        "nature": "favorable",
        "eventEn": "Mastery over esoteric shastras, profound research breakthrough.",
        "eventHi": "गूढ़ शास्त्रों में पारंगत, अनुसंधान में असाधारण उपलब्धि।"
      },
      {
        "age": 48,
        "nature": "favorable",
        "eventEn": "Apex of spiritual realization, detachment from worldly illusions.",
        "eventHi": "आध्यात्मिक आत्म-साक्षात्कार का शिखर, सांसारिक मोह से मुक्ति।"
      }
    ],
    "signModifiers": {
      "Scorpio": {
        "en": "Exalted: Supreme psychic seer, master of occult, profound spiritual enlightenment.",
        "hi": "उच्च राशि (वृश्चिक): दिव्य दृष्टा, तंत्र व गुप्त विद्याओं का मर्मज्ञ, परम आत्मज्ञान।"
      },
      "Taurus": {
        "en": "Debilitated: Restlessness of mind, bodily scars, digestive sensitivity.",
        "hi": "नीच राशि (वृषभ): मानसिक चंचलता, शरीर पर चोट का निशान, पाचन दुर्बलता।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Jupiter",
        "conditionEn": "Aspected by Jupiter",
        "conditionHi": "गुरु की दृष्टि",
        "effectEn": "True saintly sage, revered spiritual preceptor, spotless reputation.",
        "effectHi": "सच्चा संन्यासी, आदरणीय आध्यात्मिक गुरु, निष्कलंक प्रतिष्ठा।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, intuitive, detached, spiritual demeanor, sensitive health, indifferent to jewelry.",
      "hi": "स्त्री जातक में अंतर्ज्ञानी, विरक्त स्वभाव, आध्यात्मिक चेतना, आभूषणों के प्रति उदासीन।"
    }
  },
  {
    "planet": "Ketu",
    "planetHi": "केतु",
    "house": 2,
    "titleEn": "Ketu in 2nd House (Dhana Bhava)",
    "titleHi": "केतु द्वितीय भाव (धन भाव) में",
    "baseEn": "Laconic or blunt speech, financial detachment, eye issues, unexpected monetary gains and losses, spiritual family values.",
    "baseHi": "मितभाषी या दो-टूक वाणी, धन के प्रति विरक्ति, नेत्र विकार, आकस्मिक धन लाभ व हानि, सात्विक पारिवारिक संस्कार।",
    "ageMilestones": [
      {
        "age": 24,
        "nature": "career",
        "eventEn": "Financial emergence through research, coding, astrology, or healing.",
        "eventHi": "शोध, सॉफ्टवेयर, ज्योतिष या चिकित्सा द्वारा धनार्जन का प्रारंभ।"
      },
      {
        "age": 48,
        "nature": "favorable",
        "eventEn": "Consolidation of spiritual wealth and debt-free peaceful sustenance.",
        "eventHi": "आध्यात्मिक संपदा की पूर्णता, ऋणमुक्त व शांत जीवन।"
      }
    ],
    "signModifiers": {
      "Scorpio": {
        "en": "Exalted: Treasures from occult sources, unexpected legacies, profound truthful speech.",
        "hi": "उच्च राशि: गुप्त विद्याओं से धन लाभ, अप्रत्याशित वसीयत, सत्य वाणी।"
      },
      "Taurus": {
        "en": "Debilitated: Financial losses through carelessness, harsh speech in family.",
        "hi": "नीच राशि: असावधानी से धनहानि, कुटुंब में कटु वाणी से तनाव।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Jupiter",
        "conditionEn": "Aspected by Jupiter",
        "conditionHi": "गुरु की दृष्टि",
        "effectEn": "Truthful speech, righteous wealth, peaceful domestic life.",
        "effectHi": "सत्य वचन, धर्म सम्मत धन, सुखी व शांत पारिवारिक जीवन।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, blunt words, indifference to vanity, spiritual family values, detached finance.",
      "hi": "स्त्री जातक में स्पष्टवादी, सादगीप्रिय, धार्मिक संस्कार, धन संचय में अनासक्ति।"
    }
  },
  {
    "planet": "Ketu",
    "planetHi": "केतु",
    "house": 3,
    "titleEn": "Ketu in 3rd House (Sahaja Bhava)",
    "titleHi": "केतु तृतीय भाव (सहज भाव) में",
    "baseEn": "Exceptional bravery, spiritual courage, software coding or occult writing, friction with younger siblings, triumphs over adversaries.",
    "baseHi": "अद्वितीय शौर्य, आध्यात्मिक पराक्रम, सॉफ्टवेयर कोडिंग या गूढ़ लेखन, सहोदरों से मतभेद, शत्रुओं पर सहज विजय।",
    "ageMilestones": [
      {
        "age": 24,
        "nature": "career",
        "eventEn": "Daring research initiative, coding or technical publication.",
        "eventHi": "साहसिक शोध कार्य, तकनीकी या आध्यात्मिक लेखन का प्रकाशन।"
      },
      {
        "age": 35,
        "nature": "favorable",
        "eventEn": "Triumph over competitors, spiritual courage recognized by peers.",
        "eventHi": "प्रतिस्पर्धियों पर विजय, आध्यात्मिक पराक्रम की समाज में प्रतिष्ठा।"
      }
    ],
    "signModifiers": {
      "Scorpio": {
        "en": "Exalted: Unshakeable spiritual warrior, invincible occult courage.",
        "hi": "उच्च राशि: अजेय आध्यात्मिक सेनानी, तंत्र व शोध में सर्वोच्च पराक्रम।"
      },
      "Taurus": {
        "en": "Debilitated: Strained relations with brothers, arm injuries, restless travels.",
        "hi": "नीच राशि: सहोदरों से अनबन, भुजाओं में संवेदनशीलता, व्यर्थ यात्राएं।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Mars",
        "conditionEn": "With Mars",
        "conditionHi": "मंगल से युति",
        "effectEn": "Fierce technical mastery, surgery, defense, fearless champion.",
        "effectHi": "तकनीकी दक्षता, शल्य क्रिया (सर्जरी), रक्षा क्षेत्र में निडर।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, daring, spiritual author, solitary pursuits, courageous protector of truth.",
      "hi": "स्त्री जातक में साहसी, आध्यात्मिक लेखिका, एकांत साधना, सत्य की निर्भीक संरक्षिका।"
    }
  },
  {
    "planet": "Ketu",
    "planetHi": "केतु",
    "house": 4,
    "titleEn": "Ketu in 4th House (Sukha Bhava)",
    "titleHi": "केतु चतुर्थ भाव (सुख भाव) में",
    "baseEn": "Spiritual detachment from maternal home, ascetic peace of mind, foreign or spiritual residence, heart/chest sensitivity, quiet dwelling.",
    "baseHi": "मातृगृह से विरक्ति, संन्यासी जैसी आत्मिक शांति, तीर्थ या विदेश में वास, वक्षस्थल संवेदनशीलता, शांत व सात्विक आवास।",
    "ageMilestones": [
      {
        "age": 24,
        "nature": "career",
        "eventEn": "Relocation to quiet spiritual haven, distance from home.",
        "eventHi": "शांत स्थान पर वास, गृहत्याग, एकांत में विद्या अध्ययन।"
      },
      {
        "age": 48,
        "nature": "favorable",
        "eventEn": "Attainment of profound inner tranquility, hermitage establishment.",
        "eventHi": "परम आंतरिक शांति की प्राप्ति, आध्यात्मिक आश्रम या कुटिया का निर्माण।"
      }
    ],
    "signModifiers": {
      "Scorpio": {
        "en": "Exalted: Sanctified peaceful hermitage, saintly maternal blessings, profound peace.",
        "hi": "उच्च राशि: पवित्र आश्रम तुल्य गृह, सात्विक माता का आशीर्वाद, अगाध शांति।"
      },
      "Taurus": {
        "en": "Debilitated: Domestic discontent, maternal suffering, chest/heart heaviness.",
        "hi": "नीच राशि: गृह सुख में अशांति, माता को कष्ट, वक्ष में भारीपन।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Jupiter",
        "conditionEn": "Aspected by Jupiter",
        "conditionHi": "गुरु की दृष्टि",
        "effectEn": "Blessed with saintly residence, maternal longevity, absolute peace.",
        "effectHi": "पवित्र वास, माता की दीर्घायु, अंतःकरण में परम शांति।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, detached domestic life, spiritual seeker, fond of holy places, quiet mother.",
      "hi": "स्त्री जातक में सात्विक गृहस्थी, तीर्थ स्थलों की प्रेमी, आध्यात्मिक माता, शांत स्वभाव।"
    }
  },
  {
    "planet": "Ketu",
    "planetHi": "केतु",
    "house": 5,
    "titleEn": "Ketu in 5th House (Suta Bhava)",
    "titleHi": "केतु पंचम भाव (संतान व बुद्धि भाव) में",
    "baseEn": "Deep intuition, Vedic and astrological wisdom, delay or detachment from children, stomach gas/heat, profound spiritual mantra siddhi.",
    "baseHi": "गहन अंतर्ज्ञान, वैदिक व ज्योतिषीय प्रज्ञा, संतान में विलंब या संतान से अनासक्ति, उदर में वात/पित्त, उच्च कोटि की मंत्र सिद्धि।",
    "ageMilestones": [
      {
        "age": 24,
        "nature": "favorable",
        "eventEn": "Spiritual mantra initiation, mastery of Vedic/astrological principles.",
        "eventHi": "मंत्र दीक्षा, वैदिक व ज्योतिषीय सिद्धांतों में प्रवीणता।"
      },
      {
        "age": 35,
        "nature": "favorable",
        "eventEn": "Birth of spiritual child, publication of esoteric research.",
        "eventHi": "सात्विक संतान का जन्म, गूढ़ शोध ग्रंथ का प्रकाशन।"
      }
    ],
    "signModifiers": {
      "Scorpio": {
        "en": "Exalted: Supreme Mantrajna, profound astrological intuition, saintly progeny.",
        "hi": "उच्च राशि: मंत्र शास्त्र का मर्मज्ञ, दिव्य ज्योतिषीय अंतर्ज्ञान, सात्विक संतान।"
      },
      "Taurus": {
        "en": "Debilitated: Delay in progeny, abdominal pain, loss of concentration.",
        "hi": "नीच राशि: संतान में विलंब, उदर पीड़ा, एकाग्रता में व्यवधान।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Jupiter",
        "conditionEn": "Aspected by Jupiter",
        "conditionHi": "गुरु की दृष्टि",
        "effectEn": "Shields progeny, bestows divine spiritual illumination and ancient wisdom.",
        "effectHi": "संतान की रक्षा, दिव्य आध्यात्मिक प्रकाश तथा प्राचीन ज्ञान की प्राप्ति।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, deep esoteric interest, meditative mindset, progeny care, spiritual teacher.",
      "hi": "स्त्री जातक में गूढ़ विद्याओं में रुचि, ध्यानमयी चित्तवृत्ति, संतान का ध्यान रखें, अध्यापिका।"
    }
  },
  {
    "planet": "Ketu",
    "planetHi": "केतु",
    "house": 6,
    "titleEn": "Ketu in 6th House (Ripu Bhava)",
    "titleHi": "केतु षष्ठ भाव (रोग व शत्रु भाव) में",
    "baseEn": "Crushes rivals, immune to hidden enemies, occult healing ability, animal bites/skin sensitivity, triumphs in litigation through truth.",
    "baseHi": "शत्रुओं का दमन, गुप्त षड्यंत्रों से अप्रभावित, प्राकृतिक व आध्यात्मिक चिकित्सा क्षमता, त्वचा संवेदनशीलता, मुकदमों में सत्य से विजय।",
    "ageMilestones": [
      {
        "age": 24,
        "nature": "career",
        "eventEn": "Triumph over workplace competitors, development of healing powers.",
        "eventHi": "कार्यक्षेत्र के विरोधियों पर विजय, चिकित्सा व उपचार कौशल का विकास।"
      },
      {
        "age": 35,
        "nature": "favorable",
        "eventEn": "Complete clearance of long-standing debts, victory over litigations.",
        "eventHi": "पुराने ऋणों से पूर्ण मुक्ति, विधिक विवादों का समूल शमन।"
      }
    ],
    "signModifiers": {
      "Scorpio": {
        "en": "Exalted: Invincible healer, complete annihilation of adversaries, robust vitality.",
        "hi": "उच्च राशि: महान प्राकृतिक चिकित्सक, विरोधियों का समूल नाश, उत्तम स्वास्थ्य।"
      },
      "Taurus": {
        "en": "Debilitated: Chronic undiagnosed ailments, skin allergies, friction with coworkers.",
        "hi": "नीच राशि: अज्ञात रोग, त्वचा एलर्जी, सहकर्मियों से असहयोग।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Jupiter",
        "conditionEn": "Aspected by Jupiter",
        "conditionHi": "गुरु की दृष्टि",
        "effectEn": "Spiritual healing mastery, universal goodwill, complete immunity.",
        "effectHi": "आध्यात्मिक उपचारक, सर्वहितैषी, पूर्ण रोग प्रतिरोधक क्षमता।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, strong inner resistance, overcomes opposition, spiritual healer, dedicated service.",
      "hi": "स्त्री जातक में अद्भुत आंतरिक शक्ति, विरोध पर विजय, आध्यात्मिक उपचारक, सेवाभावी।"
    }
  },
  {
    "planet": "Ketu",
    "planetHi": "केतु",
    "house": 7,
    "titleEn": "Ketu in 7th House (Kalatra Bhava)",
    "titleHi": "केतु सप्तम भाव (कलत्र भाव) में",
    "baseEn": "Spiritual or detached spouse, marital misunderstandings, ascetic partner, contract disputes, marriage delays, union based on dharma.",
    "baseHi": "सात्विक या विरक्त स्वभाव का जीवनसाथी, दांपत्य में संवादहीनता, वैरागी साथी, व्यापारिक समझौतों में सतर्कता, धर्म आधारित विवाह।",
    "ageMilestones": [
      {
        "age": 28,
        "nature": "challenging",
        "eventEn": "Marital adjustments or matrimonial negotiations requiring patience.",
        "eventHi": "विवाह में विलंब या दांपत्य सामंजस्य की परीक्षा का वर्ष।"
      },
      {
        "age": 35,
        "nature": "favorable",
        "eventEn": "Spiritual harmony with spouse, successful detached trade partnerships.",
        "eventHi": "दांपत्य में आध्यात्मिक एकता, व्यापार में स्थिरता।"
      }
    ],
    "signModifiers": {
      "Scorpio": {
        "en": "Exalted: Highly spiritual, intuitive, and dedicated spouse; harmonious dharmic bond.",
        "hi": "उच्च राशि: अत्यंत आध्यात्मिक, अंतर्ज्ञानी व समर्पित जीवनसाथी; पवित्र दांपत्य।"
      },
      "Taurus": {
        "en": "Debilitated: Marital estrangement, partner health fragility, partnership disputes.",
        "hi": "नीच राशि: दांपत्य में दूरी, जीवनसाथी का दुर्बल स्वास्थ्य, साझेदारी में विवाद।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Jupiter",
        "conditionEn": "Aspected by Jupiter",
        "conditionHi": "गुरु की दृष्टि",
        "effectEn": "Spiritualizes marriage, dissolves discord, grants noble preceptor-like partner.",
        "effectHi": "दांपत्य में आध्यात्मिकता, कलह का शमन, संस्कारी जीवनसाथी।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, spiritual husband, detached conjugal ties, high spiritual yearning, patient home builder.",
      "hi": "स्त्री जातक में आध्यात्मिक पति, दांपत्य में सात्विकता, ईश्वर भक्ति में रुचि, शांत गृहिणी।"
    }
  },
  {
    "planet": "Ketu",
    "planetHi": "केतु",
    "house": 8,
    "titleEn": "Ketu in 8th House (Ayu Bhava)",
    "titleHi": "केतु अष्टम भाव (आयु व रंध्र भाव) में",
    "baseEn": "Moksha seeker, deep psychic ability, sudden longevity shifts, interest in tantra, astrology, and ancient scripts, sudden windfalls.",
    "baseHi": "मोक्षकामी, गहन पराशारीरिक अंतर्ज्ञान, तंत्र, ज्योतिष व प्राचीन लिपियों में प्रवीण, वसीयत या गुप्त स्रोतों से आकस्मिक धन।",
    "ageMilestones": [
      {
        "age": 24,
        "nature": "favorable",
        "eventEn": "Awakening of occult perception, psychic breakthrough.",
        "eventHi": "गुप्त विद्याओं की जागृति, आध्यात्मिक अंतर्दृष्टि का उदय।"
      },
      {
        "age": 36,
        "nature": "favorable",
        "eventEn": "Sudden financial inheritance, esoteric treatise authorship.",
        "eventHi": "अचानक वसीयत से लाभ अथवा गूढ़ शोध ग्रंथ की रचना।"
      }
    ],
    "signModifiers": {
      "Scorpio": {
        "en": "Exalted: Supreme tantric mystic, long life, peaceful transition to higher realms.",
        "hi": "उच्च राशि: तंत्र व अध्यात्म का शिखर, सुदीर्घ जीवन, परम सद्गति।"
      },
      "Taurus": {
        "en": "Debilitated: Sudden ailments, disputes over legacy, insect/reptile bites caution.",
        "hi": "नीच राशि: आकस्मिक रोग, वसीयत में विवाद, कीट-दंश से सावधानी।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Jupiter",
        "conditionEn": "Aspected by Jupiter",
        "conditionHi": "गुरु की दृष्टि",
        "effectEn": "Shields vitality, bestows divine metaphysical illumination and peaceful longevity.",
        "effectHi": "प्राण रक्षा, दिव्य आध्यात्मिक ज्ञान तथा शांत व सुदीर्घ जीवन।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, high psychic intuition, secret research, calm under crises, sudden legacy from in-laws.",
      "hi": "स्त्री जातक में तीव्र अंतर्ज्ञान, गुप्त शोध, संकट में शांत बुद्धि, ससुराल से वसीयत लाभ।"
    }
  },
  {
    "planet": "Ketu",
    "planetHi": "केतु",
    "house": 9,
    "titleEn": "Ketu in 9th House (Dharma Bhava)",
    "titleHi": "केतु नवम भाव (धर्म व भाग्य भाव) में",
    "baseEn": "Spiritual master, pilgrimage to remote shrines, dharmic detachment, guru blessings, higher mystical wisdom, foreign travels.",
    "baseHi": "आध्यात्मिक गुरु, दुर्गम तीर्थों की यात्राएं, धर्म में अनासक्ति, गुरुजनों की विशेष कृपा, उच्च रहस्यवादी ज्ञान, विदेश यात्रा।",
    "ageMilestones": [
      {
        "age": 24,
        "nature": "favorable",
        "eventEn": "Spiritual pilgrimage to remote mountain shrines, initiation by saint.",
        "eventHi": "दुर्गम पर्वतीय तीर्थों की यात्रा, सिद्ध संत से दीक्षा।"
      },
      {
        "age": 32,
        "nature": "favorable",
        "eventEn": "Fortune dawn through spiritual authorship, teaching, or philosophy.",
        "eventHi": "आध्यात्मिक लेखन, शिक्षण या दर्शन द्वारा विशाल भाग्योदय।"
      }
    ],
    "signModifiers": {
      "Scorpio": {
        "en": "Exalted: Saint of highest order, divine revelations, illustrious spiritual lineage.",
        "hi": "उच्च राशि: उच्च कोटि का संत, दिव्य ईश्वरीय अनुभूतियां, आध्यात्मिक प्रतिष्ठा।"
      },
      "Taurus": {
        "en": "Debilitated: Conflict with orthodox father, travel fatigue, skepticism.",
        "hi": "नीच राशि: पिता से मतभेद, यात्रा में अत्यधिक कष्ट, आस्था में संशय।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Jupiter",
        "conditionEn": "With or aspected by Jupiter",
        "conditionHi": "गुरु से युति या दृष्टि",
        "effectEn": "World spiritual teacher, spotless renunciation, universally revered.",
        "effectHi": "विश्व प्रसिद्ध आध्यात्मिक गुरु, निष्कलंक संन्यास, सर्वपूज्य।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, saintly disposition, temple devotee, pure philosophical insight, blessed offspring.",
      "hi": "स्त्री जातक में साध्वी जैसा स्वभाव, मंदिर व तीर्थ प्रिय, सात्विक दार्शनिक प्रज्ञा, उत्तम संतान।"
    }
  },
  {
    "planet": "Ketu",
    "planetHi": "केतु",
    "house": 10,
    "titleEn": "Ketu in 10th House (Karma Bhava)",
    "titleHi": "केतु दशम भाव (कर्म व राज्य भाव) में",
    "baseEn": "Detached from worldly status, famous in spiritual, medical, or astrological fields, flag-bearer of truth, ethical profession, unconventional vocation.",
    "baseHi": "सांसारिक पद-प्रतिष्ठा से अनासक्त, आध्यात्मिक, चिकित्सा या ज्योतिषीय क्षेत्र में प्रसिद्ध, सत्य का ध्वजवाहक, नीतिपूर्ण व विशिष्ट आजीविका।",
    "ageMilestones": [
      {
        "age": 28,
        "nature": "career",
        "eventEn": "Breakthrough in research, software coding, astrology, or healing.",
        "eventHi": "शोध, सॉफ्टवेयर, ज्योतिष या प्राकृतिक चिकित्सा में विशिष्ट पहचान।"
      },
      {
        "age": 36,
        "nature": "favorable",
        "eventEn": "Spiritual professional renown, advisory position in prestigious institution.",
        "eventHi": "आध्यात्मिक व बौद्धिक क्षेत्र में सर्वोच्च ख्याति, संस्थान में मुख्य सलाहकार।"
      }
    ],
    "signModifiers": {
      "Scorpio": {
        "en": "Exalted: Renowned spiritual leader, top surgeon, master software architect.",
        "hi": "उच्च राशि: ख्यातिलब्ध आध्यात्मिक नेता, शीर्ष सर्जन, अद्वितीय सॉफ्टवेयर वास्तुकार।"
      },
      "Taurus": {
        "en": "Debilitated: Instability in career, lack of professional recognition.",
        "hi": "नीच राशि: आजीविका में बार-बार परिवर्तन, परिश्रम का यथोचित फल न मिलना।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Jupiter",
        "conditionEn": "Aspected by Jupiter",
        "conditionHi": "गुरु की दृष्टि",
        "effectEn": "Spotless professional dignity, judicial or religious authority, honored by rulers.",
        "effectHi": "निष्कलंक व्यावसायिक सम्मान, न्यायिक या धार्मिक अधिकार, राजसम्मान।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, ethical career, respected in research or healing, indifferent to vanity, respected leader.",
      "hi": "स्त्री जातक में नीतिपूर्ण आजीविका, शोध या चिकित्सा में सम्मानित, आडंबरों से दूर, आदरणीय।"
    }
  },
  {
    "planet": "Ketu",
    "planetHi": "केतु",
    "house": 11,
    "titleEn": "Ketu in 11th House (Labha Bhava)",
    "titleHi": "केतु एकादश भाव (लाभ भाव) में",
    "baseEn": "Unexpected spiritual and financial windfalls, few friends, philosophical gains, fulfillment of essential desires without greed.",
    "baseHi": "अचानक आध्यात्मिक व भौतिक धन लाभ, गिने-चुने विश्वस्त मित्र, दार्शनिक उपलब्धियां, लोभ रहित होकर भी सभी आवश्यक इच्छाओं की पूर्ति।",
    "ageMilestones": [
      {
        "age": 24,
        "nature": "favorable",
        "eventEn": "Unexpected financial windfall through intellectual or spiritual pursuit.",
        "eventHi": "बौद्धिक या आध्यात्मिक उपक्रम से अचानक धन लाभ।"
      },
      {
        "age": 35,
        "nature": "favorable",
        "eventEn": "Consolidation of quiet wealth, detachment from materialistic peers.",
        "eventHi": "स्थाई शांत धन संचय, भौतिकवादी संगति से मुक्ति।"
      }
    ],
    "signModifiers": {
      "Scorpio": {
        "en": "Exalted: Immense unexpected wealth, saintly allies, fulfilled life mission.",
        "hi": "उच्च राशि: आकस्मिक विपुल धन, संतों की संगति, जीवन के उद्देश्य की पूर्णता।"
      },
      "Taurus": {
        "en": "Debilitated: Fluctuating income, isolation from elder brother, unrewarded efforts.",
        "hi": "नीच राशि: आय में अस्थिरता, अग्रज से दूरी, प्रयासों में विलंब।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Jupiter",
        "conditionEn": "Aspected by Jupiter",
        "conditionHi": "गुरु की दृष्टि",
        "effectEn": "Righteous and eternal wealth, noble philanthropic endowments.",
        "effectHi": "धर्म सम्मत अक्षय धन, विशाल लोक कल्याणकारी कार्य।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, prosperous through unusual channels, solitary satisfaction, fulfilled desires.",
      "hi": "स्त्री जातक में विशिष्ट साधनों से संपन्न, एकांत में संतोष, मनोकामनाओं की सिद्धि।"
    }
  },
  {
    "planet": "Ketu",
    "planetHi": "केतु",
    "house": 12,
    "titleEn": "Ketu in 12th House (Vyaya Bhava)",
    "titleHi": "केतु द्वादश भाव (व्यय व मोक्ष भाव) में",
    "baseEn": "Mokshakaraka in Mokshasthana: Highest spiritual liberation, supreme detachment, peaceful sleep, divine contemplation, foreign seclusion.",
    "baseHi": "मोक्षकारक केतु मोक्ष भाव में: परम मोक्ष प्राप्ति, सांसारिक मोह-माया का समूल नाश, शांत निद्रा, ईश्वर का निरंतर स्मरण, विदेश में एकांत साधना।",
    "ageMilestones": [
      {
        "age": 24,
        "nature": "favorable",
        "eventEn": "Spiritual initiation, beginning of higher metaphysical meditation.",
        "eventHi": "आध्यात्मिक दीक्षा, उच्च समाधि व ध्यान का प्रारंभ।"
      },
      {
        "age": 48,
        "nature": "favorable",
        "eventEn": "Supreme spiritual ascension, liberation from rebirth cycle (Moksha path).",
        "eventHi": "परम आध्यात्मिक उत्थान, जन्म-मरण के चक्र से मुक्ति का मोक्ष मार्ग।"
      }
    ],
    "signModifiers": {
      "Scorpio": {
        "en": "Exalted: Supreme Moksha yoga, merging of individual soul with Divine, supreme peace.",
        "hi": "उच्च राशि: सर्वोच्च मोक्ष योग, जीवात्मा का परमात्मा में विलीन होना, अखंड शांति।"
      },
      "Taurus": {
        "en": "Debilitated: Sleep restlessness, expenditure on health, eye strain.",
        "hi": "नीच राशि: अनिद्रा, चिकित्सा पर व्यय, नेत्र संवेदनशीलता।"
      }
    },
    "aspectModifiers": [
      {
        "graha": "Jupiter",
        "conditionEn": "Aspected by Jupiter",
        "conditionHi": "गुरु की दृष्टि",
        "effectEn": "Guaranteed spiritual liberation, divine light, absolute bliss in seclusion.",
        "effectHi": "निश्चित मोक्ष मार्ग, दिव्य प्रकाश का दर्शन, एकांत में परमानंद।"
      }
    ],
    "femaleHoroscope": {
      "en": "In female horoscope, saintly, detachment from material world, supreme spiritual peace, foreign hermitage.",
      "hi": "स्त्री जातक में साध्वी स्वरूप, सांसारिक प्रपंचों से विरक्ति, परम आध्यात्मिक शांति।"
    }
  }
];

export const GOCHARA_BOOK_CORPUS: GocharaBookRecord[] = [
  {
    "planet": "Sun",
    "planetHi": "सूर्य",
    "houseFromMoon": 1,
    "isFavorable": false,
    "summaryEn": "Bodily fatigue, cardiac or bilious heat, loss of status, misunderstandings with authorities.",
    "summaryHi": "शारीरिक थकान, पित्त व हृदय में उष्णता, पद-प्रतिष्ठा में अस्थिरता, अधिकारियों से अनबन।",
    "detailedEn": "Transit of Sun over natal Moon causes exhaustion, eye strain, digestive heat, headaches, and tension with government or superiors.",
    "detailedHi": "जन्म राशि पर सूर्य का गोचर देह में आलस्य, नेत्र पीड़ा, पित्त प्रकोप, शिरोवेदना तथा राजकीय अधिकारियों से तनाव उत्पन्न करता है।"
  },
  {
    "planet": "Sun",
    "planetHi": "सूर्य",
    "houseFromMoon": 2,
    "isFavorable": false,
    "summaryEn": "Financial strain, disputes over wealth, eye or facial ailments, harsh words in domestic circle.",
    "summaryHi": "आर्थिक तनाव, धन को लेकर विवाद, नेत्र या मुख विकार, कुटुंब में कटु वाणी से मनमुटाव।",
    "detailedEn": "Sun in 2nd causes expenditure, deception by untrustworthy associates, speech harshness, and ocular sensitivity.",
    "detailedHi": "द्वितीय भाव में सूर्य का गोचर अनावश्यक व्यय, विश्वासपात्रों से धोखा, वाणी में कटुता तथा दाहिने नेत्र में संवेदनशीलता देता है।"
  },
  {
    "planet": "Sun",
    "planetHi": "सूर्य",
    "houseFromMoon": 3,
    "isFavorable": true,
    "vedhaHouse": 9,
    "summaryEn": "Grand success, immense courage, defeat of rivals, financial gains, governmental honors.",
    "summaryHi": "महान सफलता, अदम्य पराक्रम, विरोधियों पर विजय, धन लाभ, शासन से सम्मान।",
    "detailedEn": "Sun in 3rd bestows radiant health, victory over adversaries, respect from siblings, elevation in status, and business prosperity.",
    "detailedHi": "तृतीय भाव में सूर्य का गोचर उत्तम आरोग्य, शत्रुओं का पूर्ण दमन, भाइयों से आदर, सामाजिक प्रतिष्ठा तथा व्यापार में विपुल लाभ प्रदान करता है।"
  },
  {
    "planet": "Sun",
    "planetHi": "सूर्य",
    "houseFromMoon": 4,
    "isFavorable": false,
    "summaryEn": "Domestic unrest, distress to mother, property obstacles, chest heaviness, vehicle troubles.",
    "summaryHi": "गृह क्लेश, माता के स्वास्थ्य की चिंता, भूमि-भवन में बाधाएं, वक्षस्थल में भारीपन, वाहन से कष्ट।",
    "detailedEn": "Sun in 4th brings anxiety in domestic life, separation from home, maternal sorrow, disputes over residential estate.",
    "detailedHi": "चतुर्थ भाव में सूर्य का गोचर पारिवारिक अशांति, माता को शारीरिक कष्ट, पैतृक मकान में विवाद तथा मानसिक अशांति उत्पन्न करता है।"
  },
  {
    "planet": "Sun",
    "planetHi": "सूर्य",
    "houseFromMoon": 5,
    "isFavorable": false,
    "summaryEn": "Mental anxiety, digestive burning, troubles or illness to children, loss in speculative bets.",
    "summaryHi": "मानसिक उद्वेग, जठराग्नि विकार, संतान को कष्ट या ज्वर, जोखिम भरे निवेश में हानि।",
    "detailedEn": "Sun in 5th creates confusion in intellect, friction with children, stomach ailments, and loss in speculative activities.",
    "detailedHi": "पंचम भाव में सूर्य का गोचर बुद्धि में भ्रम, संतान पक्ष से चिंता, उदर में पित्त विकार तथा सट्टेबाजी में धनहानि कराता है।"
  },
  {
    "planet": "Sun",
    "planetHi": "सूर्य",
    "houseFromMoon": 6,
    "isFavorable": true,
    "vedhaHouse": 12,
    "summaryEn": "Complete destruction of rivals, robust physical vitality, victory in litigation, debt relief.",
    "summaryHi": "विरोधियों का समूल नाश, अद्भुत शारीरिक आरोग्य, मुकदमों में विजय, पुराने ऋणों से मुक्ति।",
    "detailedEn": "Sun in 6th is supreme benefic transit: Annihilates enemies, cures protracted diseases, promotes government success, and restores vitality.",
    "detailedHi": "षष्ठ भाव में सूर्य का गोचर परम कल्याणकारी है: समस्त शत्रुओं का दमन, पुराने रोगों से मुक्ति, प्रशासनिक कार्यों में सफलता तथा ऊर्जा का संचार।"
  },
  {
    "planet": "Sun",
    "planetHi": "सूर्य",
    "houseFromMoon": 7,
    "isFavorable": false,
    "summaryEn": "Marital friction, wearisome travels, disputes in partnerships, digestive or urinary strain.",
    "summaryHi": "दांपत्य में वैचारिक मतभेद, व्यर्थ व थकाने वाली यात्राएं, व्यापारिक साझेदारी में तनाव, उदर विकार।",
    "detailedEn": "Sun in 7th causes disagreements with spouse, exhaustion from journeys, disputes with public partners, and health fragility of spouse.",
    "detailedHi": "सप्तम भाव में सूर्य का गोचर जीवनसाथी से अनबन, यात्राओं में शारीरिक कष्ट, साझेदारों से मतभेद तथा दांपत्य में अशांति देता है।"
  },
  {
    "planet": "Sun",
    "planetHi": "सूर्य",
    "houseFromMoon": 8,
    "isFavorable": false,
    "summaryEn": "Fear of state penalties, sudden ailments, accidents from heat/fire, disputes over legacies.",
    "summaryHi": "राजकीय दंड या जांच का भय, आकस्मिक रोग, अग्नि या पित्त से कष्ट, वसीयत को लेकर विवाद।",
    "detailedEn": "Sun in 8th brings high fever, piles or blood pressure spikes, conflicts with authorities, litigation, and health vulnerability.",
    "detailedHi": "अष्टम भाव में सूर्य का गोचर तीव्र पित्त ज्वर, रक्तचाप में वृद्धि, उच्चाधिकारियों से मतभेद तथा आकस्मिक संकट का संकेत देता है।"
  },
  {
    "planet": "Sun",
    "planetHi": "सूर्य",
    "houseFromMoon": 9,
    "isFavorable": false,
    "summaryEn": "Distress or sorrow regarding father, obstacles in pilgrimage, loss of faith under stress.",
    "summaryHi": "पिता के स्वास्थ्य की चिंता, तीर्थ यात्राओं में विघ्न, धार्मिक कार्यों में रुकावट, भाग्य में मंदता।",
    "detailedEn": "Sun in 9th causes misunderstandings with preceptors, paternal health strain, hindrances in legal/higher education, and loss of momentum.",
    "detailedHi": "नवम भाव में सूर्य का गोचर पिता या गुरुजनों से वैचारिक मतभेद, उच्च शिक्षा में बाधा तथा भाग्य के सहयोग में कमी लाता है।"
  },
  {
    "planet": "Sun",
    "planetHi": "सूर्य",
    "houseFromMoon": 10,
    "isFavorable": true,
    "vedhaHouse": 4,
    "summaryEn": "Great professional honors, high administrative rise, governmental patronage, triumphant actions.",
    "summaryHi": "कार्यक्षेत्र में उच्च प्रतिष्ठा, प्रशासनिक पदोन्नति, राजकीय सहयोग, सभी कार्यों में निर्बाध सफलता।",
    "detailedEn": "Sun in 10th brings royal favor, promotion, public fame, victory over professional competitors, and lucrative contracts.",
    "detailedHi": "दशम भाव में सूर्य का गोचर शासन से सम्मान, पदोन्नति, सामाजिक ख्याति, विरोधियों पर विजय तथा आजीविका में अभूतपूर्व प्रगति देता है।"
  },
  {
    "planet": "Sun",
    "planetHi": "सूर्य",
    "houseFromMoon": 11,
    "isFavorable": true,
    "vedhaHouse": 5,
    "summaryEn": "Immense financial gains, status elevation, fulfilment of all aspirations, joyous gatherings.",
    "summaryHi": "विपुल धन लाभ, पद-प्रतिष्ठा में वृद्धि, सभी मनोकामनाओं की पूर्ति, कुटुंब में मांगलिक उत्सव।",
    "detailedEn": "Sun in 11th brings multi-stream income, patronage from powerful leaders, support from elder siblings, and glorious victory.",
    "detailedHi": "एकादश भाव में सूर्य का गोचर चौतरफा धन लाभ, उच्च सत्ताधीशों से सहयोग, अग्रज का स्नेह तथा जीवन के सभी अभीष्टों की सिद्धि कराता है।"
  },
  {
    "planet": "Sun",
    "planetHi": "सूर्य",
    "houseFromMoon": 12,
    "isFavorable": false,
    "summaryEn": "Heavy expenditure, overseas hurdles, left eye strain, insomnia, separation from family.",
    "summaryHi": "भारी अनावश्यक व्यय, विदेश प्रवास में रुकावटें, बाएं नेत्र में पीड़ा, अनिद्रा, परिजनों से दूरी।",
    "detailedEn": "Sun in 12th causes financial drain through taxes/penalties, physical exhaustion, disturbed sleep, and distance from homeland.",
    "detailedHi": "द्वादश भाव में सूर्य का गोचर दंड या करों में धनहानि, शारीरिक दुर्बलता, अनिद्रा तथा जन्मभूमि से दूर प्रवास में कष्ट देता है।"
  },
  {
    "planet": "Moon",
    "planetHi": "चन्द्रमा",
    "houseFromMoon": 1,
    "isFavorable": true,
    "vedhaHouse": 5,
    "summaryEn": "Physical vitality, delicious culinary dining, mental peace, new garments, romantic joy.",
    "summaryHi": "शारीरिक स्फूर्ति, उत्तम मिष्ठान्न भोजन, मानसिक शांति, नवीन वस्त्राभूषण, प्रेम व दांपत्य सुख।",
    "detailedEn": "Moon transiting natal Moon brings peace, comfort, popularity, attractive appearance, and happy domestic atmosphere.",
    "detailedHi": "प्रथम भाव में चन्द्रमा का गोचर मन को प्रसन्नता, उत्तम स्वास्थ्य, स्वादिष्ट भोजन, आभूषणों का लाभ तथा सम्मान प्रदान करता है।"
  },
  {
    "planet": "Moon",
    "planetHi": "चन्द्रमा",
    "houseFromMoon": 2,
    "isFavorable": false,
    "summaryEn": "Financial losses, harsh speech slips, emotional insecurity, eye or facial heaviness.",
    "summaryHi": "आर्थिक हानि, भावावेश में कटु वाणी, मानसिक असुरक्षा, मुख या नेत्र में भारीपन।",
    "detailedEn": "Moon in 2nd causes unnecessary expenditures, disputes with relatives over words, and emotional despondency.",
    "detailedHi": "द्वितीय भाव में चन्द्रमा का गोचर अनावश्यक खर्च, कुटुंब में वाणी के कारण मतभेद तथा मन में उदासी उत्पन्न करता है।"
  },
  {
    "planet": "Moon",
    "planetHi": "चन्द्रमा",
    "houseFromMoon": 3,
    "isFavorable": true,
    "vedhaHouse": 9,
    "summaryEn": "Courage, new clothes, fraternal harmony, successful short travels, financial gains.",
    "summaryHi": "साहस में वृद्धि, नवीन वस्त्र, सहोदरों से स्नेह, लाभदायक लघु यात्राएं, धन लाभ।",
    "detailedEn": "Moon in 3rd bestows mental confidence, joy from brothers, artistic creativity, and triumph over petty obstacles.",
    "detailedHi": "तृतीय भाव में चन्द्रमा का गोचर मानसिक उत्साह, भाइयों का सहयोग, कलात्मक कार्यों में सफलता तथा धन लाभ देता है।"
  },
  {
    "planet": "Moon",
    "planetHi": "चन्द्रमा",
    "houseFromMoon": 4,
    "isFavorable": false,
    "summaryEn": "Mental anxiety, domestic friction, maternal health sorrow, chest heaviness, disturbed peace.",
    "summaryHi": "मानसिक अशांति, गृह क्लेश, माता के स्वास्थ्य की चिंता, वक्ष में कफ, अशांत चित्त।",
    "detailedEn": "Moon in 4th brings emotional turmoil, separation from mother or domestic comfort, vehicle hassles, and water-related chills.",
    "detailedHi": "चतुर्थ भाव में चन्द्रमा का गोचर मन में उद्वेग, माता को कष्ट, पारिवारिक अशांति तथा कफ विकार उत्पन्न करता है।"
  },
  {
    "planet": "Moon",
    "planetHi": "चन्द्रमा",
    "houseFromMoon": 5,
    "isFavorable": false,
    "summaryEn": "Anxiety regarding children, mental confusion, digestive sluggishness, speculative loss.",
    "summaryHi": "संतान पक्ष से चिंता, बुद्धि में भ्रम, जठराग्नि मंद, वित्तीय निवेश में सावधानी।",
    "detailedEn": "Moon in 5th creates sadness, hurdles in love or intellectual creative flow, and stomach sensitivity.",
    "detailedHi": "पंचम भाव में चन्द्रमा का गोचर मानसिक चंचलता, संतान के स्वास्थ्य की चिंता तथा रचनात्मक कार्यों में मंदता लाता है।"
  },
  {
    "planet": "Moon",
    "planetHi": "चन्द्रमा",
    "houseFromMoon": 6,
    "isFavorable": true,
    "vedhaHouse": 12,
    "summaryEn": "Subjugation of foes, freedom from ailments, happiness, victory in competition.",
    "summaryHi": "शत्रुओं का दमन, रोगों से मुक्ति, मानसिक प्रसन्नता, प्रतियोगी कार्यों में सफलता।",
    "detailedEn": "Moon in 6th cures diseases, vanquishes rivals through calm presence, brings peace from maternal uncles and financial relief.",
    "detailedHi": "षष्ठ भाव में चन्द्रमा का गोचर उत्तम आरोग्य, विरोधियों पर विजय, ननिहाल से सहयोग तथा मन की शांति देता है।"
  },
  {
    "planet": "Moon",
    "planetHi": "चन्द्रमा",
    "houseFromMoon": 7,
    "isFavorable": true,
    "vedhaHouse": 2,
    "summaryEn": "Conjugal bliss, respect, romance, culinary delight, successful commercial partnerships.",
    "summaryHi": "दांपत्य सुख, आदर-सम्मान, प्रेम संबंध, उत्तम भोजन, व्यापारिक साझेदारी में लाभ।",
    "detailedEn": "Moon in 7th brings affection with spouse, public popularity, profitable trade dealings, and sensual pleasures.",
    "detailedHi": "सप्तम भाव में चन्द्रमा का गोचर जीवनसाथी से प्रगाढ़ प्रेम, जनसंपर्क में सफलता, व्यापार में लाभ तथा मनभावन यात्रा कराता है।"
  },
  {
    "planet": "Moon",
    "planetHi": "चन्द्रमा",
    "houseFromMoon": 8,
    "isFavorable": false,
    "summaryEn": "Emotional afflictions, fear, digestive-water weakness, unexpected obstacles.",
    "summaryHi": "मानसिक संत्रास, अकारण भय, जल व कफ विकार, कार्यों में आकस्मिक अवरोध।",
    "detailedEn": "Chandrashtama (Moon in 8th from Moon) is a classical caution transit: Avoid new initiatives, guard mental calm, prevent water hazards.",
    "detailedHi": "चंद्राष्टम (अष्टम भाव में चन्द्रमा) का गोचर विशेष सतर्कता का समय है: नए कार्यों से बचें, मानसिक शांति रखें तथा जल से सावधान रहें।"
  },
  {
    "planet": "Moon",
    "planetHi": "चन्द्रमा",
    "houseFromMoon": 9,
    "isFavorable": false,
    "summaryEn": "Obstacles in ventures, travel fatigue, mental sadness, friction with father or teachers.",
    "summaryHi": "कार्यों में रुकावटें, यात्रा में थकान, मन में उदासी, पिता या गुरुजनों से वैचारिक मतभेद।",
    "detailedEn": "Moon in 9th causes delay in expected fortunes, weariness from journeys, and temporary emotional disappointment.",
    "detailedHi": "नवम भाव में चन्द्रमा का गोचर भाग्योदय में विलंब, यात्रा में शारीरिक थकान तथा मानसिक रूप से निराशा उत्पन्न करता है।"
  },
  {
    "planet": "Moon",
    "planetHi": "चन्द्रमा",
    "houseFromMoon": 10,
    "isFavorable": true,
    "vedhaHouse": 4,
    "summaryEn": "Success in undertakings, professional acclaim, royal favor, emotional peace at work.",
    "summaryHi": "सभी कार्यों में सिद्धि, कार्यक्षेत्र में प्रशंसा, अधिकारियों का स्नेह, कार्य में मन लगना।",
    "detailedEn": "Moon in 10th brings promotion, fulfillment of duties, public honors, and support from maternal or public leaders.",
    "detailedHi": "दशम भाव में चन्द्रमा का गोचर आजीविका में उन्नति, सामाजिक प्रतिष्ठा, अधिकारियों का सहयोग तथा कार्य में सफलता देता है।"
  },
  {
    "planet": "Moon",
    "planetHi": "चन्द्रमा",
    "houseFromMoon": 11,
    "isFavorable": true,
    "vedhaHouse": 8,
    "summaryEn": "Prosperity, joy, acquisition of wealth, fulfillment of desires, happy reunions.",
    "summaryHi": "अखंड समृद्धि, आनंद, धन लाभ, मनोकामनाओं की पूर्ति, मित्रों व स्वजनों से मिलन।",
    "detailedEn": "Moon in 11th multiplies profits, brings happiness from daughters and elder sisters, and fulfills cherished wishes.",
    "detailedHi": "एकादश भाव में चन्द्रमा का गोचर धन की प्रचुरता, कन्या व अग्रजा से सुख, मित्रों का सहयोग तथा मनोवांछित फल देता है।"
  },
  {
    "planet": "Moon",
    "planetHi": "चन्द्रमा",
    "houseFromMoon": 12,
    "isFavorable": false,
    "summaryEn": "Heavy expenditure, emotional grief, isolation, left eye strain, insomnia.",
    "summaryHi": "अत्यधिक व्यय, मानसिक संताप, एकाकीपन, बाएं नेत्र में संवेदनशीलता, अनिद्रा।",
    "detailedEn": "Moon in 12th causes financial drain, emotional exhaustion, restless dreams, and feeling of isolation.",
    "detailedHi": "द्वादश भाव में चन्द्रमा का गोचर धन का अपव्यय, मानसिक बेचैनी, अनिद्रा तथा प्रियजनों से दूरी का अनुभव कराता है।"
  },
  {
    "planet": "Mars",
    "planetHi": "मंगल",
    "houseFromMoon": 1,
    "isFavorable": false,
    "summaryEn": "Blood disorders, fevers, bodily injuries, impulsive conflicts, headaches.",
    "summaryHi": "रक्त विकार, पित्त ज्वर, चोट का भय, अकारण क्रोध व विवाद, शिरोवेदना।",
    "detailedEn": "Mars over natal Moon causes intense anger, blood pressure spikes, domestic friction, burns, cuts, and rash decisions.",
    "detailedHi": "जन्म राशि पर मंगल का गोचर क्रोधावेश, रक्तचाप, अग्नि व शस्त्र से चोट का जोखिम तथा पारिवारिक तनाव उत्पन्न करता है।"
  },
  {
    "planet": "Mars",
    "planetHi": "मंगल",
    "houseFromMoon": 2,
    "isFavorable": false,
    "summaryEn": "Harsh speech, financial drain, eye or dental pain, disputes over money with kin.",
    "summaryHi": "कटु वाणी, धन का अपव्यय, नेत्र या दंत पीड़ा, परिजनों से संपत्ति विवाद।",
    "detailedEn": "Mars in 2nd brings conflicts over ancestral funds, loss through penalties, and harsh aggressive words causing domestic friction.",
    "detailedHi": "द्वितीय भाव में मंगल का गोचर कटु वचनों से कुटुंब क्लेश, धनहानि तथा मुख या नेत्र में विकार देता है।"
  },
  {
    "planet": "Mars",
    "planetHi": "मंगल",
    "houseFromMoon": 3,
    "isFavorable": true,
    "vedhaHouse": 12,
    "summaryEn": "Immense valor, defeat of rivals, acquisitions, landed gains, athletic victory.",
    "summaryHi": "अद्वितीय पराक्रम, शत्रुओं की पराजय, भूमि व वाहन लाभ, खेलकूद व तकनीकी विजय।",
    "detailedEn": "Mars in 3rd is an exceptionally powerful favorable transit: Crushes all enemies, multiplies energy, yields landed property, and brings military/engineering fame.",
    "detailedHi": "तृतीय भाव में मंगल का गोचर परम शुभ है: विरोधियों का समूल नाश, असीम ऊर्जा, अचल संपत्ति का लाभ तथा पराक्रम में अभूतपूर्व वृद्धि।"
  },
  {
    "planet": "Mars",
    "planetHi": "मंगल",
    "houseFromMoon": 4,
    "isFavorable": false,
    "summaryEn": "Domestic unrest, fever, maternal distress, property litigation, vehicle breakdown.",
    "summaryHi": "गृह क्लेश, पित्त ज्वर, माता को कष्ट, भूमि-मकान में विवाद, वाहन में खराबी।",
    "detailedEn": "Mars in 4th causes property disputes, accidents near home, sorrow regarding mother, and cardiovascular or chest tension.",
    "detailedHi": "चतुर्थ भाव में मंगल का गोचर पारिवारिक अशांति, माता के स्वास्थ्य की चिंता, भूमि विवाद तथा वाहन दुर्घटना का भय कराता है।"
  },
  {
    "planet": "Mars",
    "planetHi": "मंगल",
    "houseFromMoon": 5,
    "isFavorable": false,
    "summaryEn": "Children affliction, anger, emotional agitation, colic, speculative losses.",
    "summaryHi": "संतान को कष्ट, तीव्र क्रोध, मानसिक उद्वेग, उदर शूल (पेट दर्द), सट्टे में हानि।",
    "detailedEn": "Mars in 5th causes sorrow regarding progeny, digestive heat/colic, friction with romantic partner, and impulsive stock losses.",
    "detailedHi": "पंचम भाव में मंगल का गोचर संतान को ज्वर या चोट, पेट में तीव्र जलन, प्रेम संबंधों में तनाव तथा वित्तीय हानि कराता है।"
  },
  {
    "planet": "Mars",
    "planetHi": "मंगल",
    "houseFromMoon": 6,
    "isFavorable": true,
    "vedhaHouse": 9,
    "summaryEn": "Annihilation of adversaries, robust health, debt freedom, triumph in court/competitions.",
    "summaryHi": "शत्रुओं का समूल नाश, उत्तम आरोग्य, ऋण मुक्ति, न्यायालय व प्रतियोगिताओं में विजय।",
    "detailedEn": "Mars in 6th destroys all competitors, cures chronic diseases, brings decisive victory in litigations, and clears old debts.",
    "detailedHi": "षष्ठ भाव में मंगल का गोचर परम कल्याणकारी है: विरोधियों का पूर्ण दमन, असाध्य रोगों से मुक्ति तथा मुकदमों में निर्णायक विजय।"
  },
  {
    "planet": "Mars",
    "planetHi": "मंगल",
    "houseFromMoon": 7,
    "isFavorable": false,
    "summaryEn": "Marital discord, disputes with partners, abdominal pain, wearisome travels.",
    "summaryHi": "दांपत्य में तीव्र कलह, व्यापारिक साझेदारों से विवाद, उदर विकार, कष्टप्रद यात्राएं।",
    "detailedEn": "Mars in 7th brings anger and estrangement with spouse, legal disputes in partnerships, and urinary or colic ailments.",
    "detailedHi": "सप्तम भाव में मंगल का गोचर जीवनसाथी से गंभीर मतभेद, साझेदारी में दरार तथा जननांग या उदर में पीड़ा देता है।"
  },
  {
    "planet": "Mars",
    "planetHi": "मंगल",
    "houseFromMoon": 8,
    "isFavorable": false,
    "summaryEn": "Accidents, surgical risks, blood toxicity, sudden dangers, piles/fistula.",
    "summaryHi": "दुर्घटना का भय, शल्य क्रिया (सर्जरी), रक्त विकार, अचानक संकट, बवासीर।",
    "detailedEn": "Mars in 8th requires extreme vigilance: Guard against fires, weapons, vehicle accidents, blood impurities, and unexpected hostilities.",
    "detailedHi": "अष्टम भाव में मंगल का गोचर अत्यंत सतर्कता का सूचक है: अग्नि, शस्त्र, वाहन से चोट तथा रक्त जनित रोगों से विशेष सावधान रहें।"
  },
  {
    "planet": "Mars",
    "planetHi": "मंगल",
    "houseFromMoon": 9,
    "isFavorable": false,
    "summaryEn": "Paternal sorrow, obstacles in fortune, friction with teachers, travel injuries.",
    "summaryHi": "पिता के स्वास्थ्य की चिंता, भाग्योदय में रुकावटें, गुरुजनों से मतभेद, यात्रा में चोट।",
    "detailedEn": "Mars in 9th causes strained paternal relations, hurdles in higher education, foreign travel friction, and loss of faith under anger.",
    "detailedHi": "नवम भाव में मंगल का गोचर पिता से वैचारिक मतभेद, तीर्थ या उच्च शिक्षा में विघ्न तथा यात्राओं में कष्ट उत्पन्न करता है।"
  },
  {
    "planet": "Mars",
    "planetHi": "मंगल",
    "houseFromMoon": 10,
    "isFavorable": false,
    "summaryEn": "Workplace disputes, professional friction, defamation risk, clashes with superiors.",
    "summaryHi": "कार्यक्षेत्र में विवाद, अधिकारियों से अनबन, प्रतिष्ठा पर आंच, कार्य में व्यवधान।",
    "detailedEn": "Mars in 10th brings impulsiveness in public duty, conflicts with employers or state agencies, and risk of professional defamation.",
    "detailedHi": "दशम भाव में मंगल का गोचर आजीविका में आवेशपूर्ण निर्णय, अधिकारियों से तकरार तथा कार्यक्षेत्र में तनाव उत्पन्न करता है।"
  },
  {
    "planet": "Mars",
    "planetHi": "मंगल",
    "houseFromMoon": 11,
    "isFavorable": true,
    "vedhaHouse": 5,
    "summaryEn": "Wealth multiplication, land purchase, victory over rivals, high vitality, elder brother gains.",
    "summaryHi": "धन की प्रचुरता, भूमि-भवन का क्रय, विरोधियों पर विजय, अदम्य ऊर्जा, अग्रज से लाभ।",
    "detailedEn": "Mars in 11th brings multi-stream wealth through lands, minerals, engineering, defense contracts, and fulfilled desires.",
    "detailedHi": "एकादश भाव में मंगल का गोचर विपुल धनोपार्जन, भू-संपत्ति की प्राप्ति, ऊर्जा का संचार तथा सभी मनोकामनाओं की पूर्ति कराता है।"
  },
  {
    "planet": "Mars",
    "planetHi": "मंगल",
    "houseFromMoon": 12,
    "isFavorable": false,
    "summaryEn": "Heavy expenditures, eye injury, insomnia, hidden foes, overseas losses.",
    "summaryHi": "भारी अनावश्यक खर्च, नेत्र में चोट, अनिद्रा, गुप्त शत्रुओं का भय, विदेश में हानि।",
    "detailedEn": "Mars in 12th causes expenditure on hospital bills or litigations, sleep disturbances, ocular wounds, and disputes abroad.",
    "detailedHi": "द्वादश भाव में मंगल का गोचर चिकित्सालय या मुकदमों में धनहानि, अनिद्रा तथा गुप्त विरोधियों से मानसिक अशांति देता है।"
  },
  {
    "planet": "Saturn",
    "planetHi": "शनि",
    "houseFromMoon": 1,
    "isFavorable": false,
    "summaryEn": "Sade Sati Peak (मध्यम चरण): Mental sorrow, physical fatigue, chronic ailments, arduous labor, heavy delays.",
    "summaryHi": "साढ़ेसाती का मध्य चरण: मानसिक विषाद, शारीरिक शिथिलता, दीर्घकालीन रोग, अत्यधिक कठोर परिश्रम, कार्यों में भारी विलंब।",
    "detailedEn": "Saturn transiting natal Moon is the peak of Sade Sati: Tests endurance, brings feelings of loneliness, physical strain, and deep karmic purification.",
    "detailedHi": "जन्म राशि पर शनि का गोचर साढ़ेसाती का चरम काल है: धैर्य की कठिन परीक्षा, एकाकीपन, स्वास्थ्य शिथिलता तथा कर्म का गहन परिशोधन।"
  },
  {
    "planet": "Saturn",
    "planetHi": "शनि",
    "houseFromMoon": 2,
    "isFavorable": false,
    "summaryEn": "Sade Sati Setting (उतरती साढ़ेसाती): Financial strain, speech discord, family tension, dental troubles.",
    "summaryHi": "साढ़ेसाती का अंतिम चरण: आर्थिक तंगी, वाणी में कटुता, पारिवारिक तनाव, दंत व मुख विकार।",
    "detailedEn": "Saturn in 2nd marks the concluding phase of Sade Sati: Expenditure exceeds income, separation or friction in family, and dental/eye care required.",
    "detailedHi": "द्वितीय भाव में शनि का गोचर साढ़ेसाती का उतरता चरण है: धन संचय में कठिनाई, परिजनों से मतभेद तथा दंत व नेत्र स्वास्थ्य पर ध्यान आवश्यक।"
  },
  {
    "planet": "Saturn",
    "planetHi": "शनि",
    "houseFromMoon": 3,
    "isFavorable": true,
    "vedhaHouse": 12,
    "summaryEn": "Enormous courage, vast wealth, defeat of foes, real estate expansion, unshakeable stability.",
    "summaryHi": "अगाध साहस, विपुल धन लाभ, शत्रुओं का पूर्ण दमन, भूमि-संपत्ति का विस्तार, अखंड स्थिरता।",
    "detailedEn": "Saturn in 3rd is an exceptionally powerful benefic transit: Obliterates adversaries, grants unyielding fortitude, brings vast financial accumulation and royal honors.",
    "detailedHi": "तृतीय भाव में शनि का गोचर परम कल्याणकारी है: विरोधियों का विनाश, अटूट मनोबल, विपुल स्थाई धन संचय तथा समाज में उच्च प्रतिष्ठा।"
  },
  {
    "planet": "Saturn",
    "planetHi": "शनि",
    "houseFromMoon": 4,
    "isFavorable": false,
    "summaryEn": "Dhayya / Kantaka Shani (लघु कल्याणी ढैय्या): Domestic sorrow, mother distress, property issues, mental depression.",
    "summaryHi": "चतुर्थ ढैय्या (कंटक शनि): गृह क्लेश, माता के स्वास्थ्य की चिंता, भूमि विवाद, मानसिक अवसाद।",
    "detailedEn": "Saturn in 4th is the dreaded Kantaka Shani Dhayya: Brings restlessness at home, relocation, maternal distress, vehicle breakdowns, and gloomy thoughts.",
    "detailedHi": "चतुर्थ भाव में शनि का गोचर ढैय्या कहलाता है: गृह में अशांति, स्थान परिवर्तन, माता को कष्ट, वाहन से परेशानी तथा मानसिक उदासी।"
  },
  {
    "planet": "Saturn",
    "planetHi": "शनि",
    "houseFromMoon": 5,
    "isFavorable": false,
    "summaryEn": "Mental depression, progeny anxiety, loss of intellect, heavy speculative losses.",
    "summaryHi": "मानसिक अवसाद, संतान को लेकर चिंता, बुद्धि में विस्मृति, सट्टे या शेयर में भारी हानि।",
    "detailedEn": "Saturn in 5th causes melancholic thoughts, sorrow or delay regarding children, failure in competitive exams, and abdominal sluggishness.",
    "detailedHi": "पंचम भाव में शनि का गोचर मन में नकारात्मक विचार, संतान की समस्या, परीक्षाओं में रुकावट तथा उदर में वात विकार देता है।"
  },
  {
    "planet": "Saturn",
    "planetHi": "शनि",
    "houseFromMoon": 6,
    "isFavorable": true,
    "vedhaHouse": 9,
    "summaryEn": "Complete destruction of rivals, robust resistance, debt relief, total victory in long litigation.",
    "summaryHi": "शत्रुओं का समूल नाश, अदम्य रोग प्रतिरोधक क्षमता, ऋणों से मुक्ति, पुराने मुकदमों में स्थाई विजय।",
    "detailedEn": "Saturn in 6th is a sovereign favorable transit: Crushes all conspiracies, heals chronic ailments, eliminates multi-year debts, and brings authoritative power.",
    "detailedHi": "षष्ठ भाव में शनि का गोचर अत्यंत शुभ है: समस्त षड्यंत्रों का संहार, असाध्य रोगों का शमन, कर्ज से मुक्ति तथा अविवादित विजय।"
  },
  {
    "planet": "Saturn",
    "planetHi": "शनि",
    "houseFromMoon": 7,
    "isFavorable": false,
    "summaryEn": "Marital grief, fatigue in foreign lands, partnership loss, health fragility of spouse.",
    "summaryHi": "दांपत्य में कटुता, परदेस में थकान, व्यापारिक साझेदारी में हानि, जीवनसाथी का अस्वस्थ होना।",
    "detailedEn": "Saturn in 7th causes serious differences with spouse, marital separation risks, fatigue during travels, and commercial disputes.",
    "detailedHi": "सप्तम भाव में शनि का गोचर दांपत्य में दूरियां, जीवनसाथी के स्वास्थ्य की चिंता, साझेदारी में मनमुटाव तथा यात्रा में कष्ट देता है।"
  },
  {
    "planet": "Saturn",
    "planetHi": "शनि",
    "houseFromMoon": 8,
    "isFavorable": false,
    "summaryEn": "Ashtama Shani Dhayya (अष्टम ढैय्या): Severe health crises, accidents, litigation, delays, financial trials.",
    "summaryHi": "अष्टम ढैय्या: स्वास्थ्य में गंभीर उतार-चढ़ाव, दुर्घटना से सतर्कता, मुकदमे, कार्यों में अत्यधिक विलंब, आर्थिक संकट।",
    "detailedEn": "Ashtama Shani is among the most testing classical transits: Guard bone, joint, and blood health, avoid speculation, maintain strict ethical conduct.",
    "detailedHi": "अष्टम शनि का गोचर ढैय्या का कठिन समय है: संधिशूल, अस्थि विकार, मुकदमों से बचें, नए जोखिम न लें तथा नैतिक आचरण रखें।"
  },
  {
    "planet": "Saturn",
    "planetHi": "शनि",
    "houseFromMoon": 9,
    "isFavorable": false,
    "summaryEn": "Loss of faith, paternal sorrow, obstacles in pilgrimage, friction with orthodox preceptors.",
    "summaryHi": "आस्था में संशय, पिता को कष्ट, तीर्थ यात्रा में विघ्न, गुरुजनों से मतभेद, भाग्य में शिथिलता।",
    "detailedEn": "Saturn in 9th causes hurdles in higher learning, paternal health fragility, delays in legal outcomes, and travel fatigue.",
    "detailedHi": "नवम भाव में शनि का गोचर पिता के स्वास्थ्य की चिंता, उच्च शिक्षा में रुकावट तथा धार्मिक अनुष्ठानों में विघ्न लाता है।"
  },
  {
    "planet": "Saturn",
    "planetHi": "शनि",
    "houseFromMoon": 10,
    "isFavorable": false,
    "summaryEn": "Arduous labor, professional hurdles, defamation risk, loss of position if unethical.",
    "summaryHi": "अत्यधिक कठोर श्रम, कार्यक्षेत्र में बाधाएं, बदनामी का भय, अनैतिक कार्यों से पदहानि।",
    "detailedEn": "Saturn in 10th demands rigorous perseverance: High responsibility without immediate appreciation, clashes with superiors, and arduous toil.",
    "detailedHi": "दशम भाव में शनि का गोचर कठोर परिश्रम कराता है: कार्य का तत्काल श्रेय न मिलना, अधिकारियों से तनाव तथा पद में अस्थिरता।"
  },
  {
    "planet": "Saturn",
    "planetHi": "शनि",
    "houseFromMoon": 11,
    "isFavorable": true,
    "vedhaHouse": 5,
    "summaryEn": "Unshakeable long-term prosperity, mass leadership, honors, fulfillment of all cherished goals.",
    "summaryHi": "अचल व स्थाई महालक्ष्मी, जनसमर्थन, राजकीय सम्मान, सभी दीर्घकालिक अभिलाषाओं की पूर्ण सिद्धि।",
    "detailedEn": "Saturn in 11th brings multi-stream wealth through lands, mining, industry, politics, and elder siblings, granting enduring prosperity.",
    "detailedHi": "एकादश भाव में शनि का गोचर अपार धन, अचल संपत्तियों की प्राप्ति, राजनीति में सफलता तथा जीवन के सभी लक्ष्यों की सिद्धि कराता है।"
  },
  {
    "planet": "Saturn",
    "planetHi": "शनि",
    "houseFromMoon": 12,
    "isFavorable": false,
    "summaryEn": "Sade Sati Rising (चढ़ती साढ़ेसाती): Heavy losses, hospital expenses, isolation, left eye strain, overseas hardships.",
    "summaryHi": "साढ़ेसाती का प्रथम चरण: अप्रत्याशित भारी खर्च, चिकित्सा व्यय, एकाकीपन, बाएं नेत्र में पीड़ा, परदेस में कष्ट।",
    "detailedEn": "Saturn in 12th marks the commencement of the 7.5-year Sade Sati cycle: Expenditure mounts, sleep is disrupted, and detachment sets in.",
    "detailedHi": "द्वादश भाव में शनि का गोचर साढ़ेसाती का प्रारंभ है: धन का अपव्यय, अनिद्रा, मानसिक चिंता तथा जन्मभूमि से दूर प्रवास में कष्ट।"
  },
  {
    "planet": "Mercury",
    "planetHi": "बुध",
    "houseFromMoon": 1,
    "isFavorable": false,
    "summaryEn": "Loss through false speech, nervous strain, slander, communication errors.",
    "summaryHi": "वाणी के कारण विवाद, स्नायु तनाव, मिथ्या आरोप, संवाद में गलतफहमियां।",
    "detailedEn": "Mercury transiting natal Moon causes mental restlessness, nervousness, defamation by peers, and verbal disputes.",
    "detailedHi": "प्रथम भाव में बुध का गोचर मानसिक चंचलता, स्नायु उद्वेग, कटु वचनों से बदनामी तथा संवाद में अवरोध लाता है।"
  },
  {
    "planet": "Mercury",
    "planetHi": "बुध",
    "houseFromMoon": 2,
    "isFavorable": true,
    "vedhaHouse": 5,
    "summaryEn": "Wealth accumulation, sweet speech, commercial success, culinary delights.",
    "summaryHi": "विपुल धन संचय, मधुर व सम्मोहक वाणी, व्यापार में भारी लाभ, उत्तम भोजन।",
    "detailedEn": "Mercury in 2nd brings monetary profits from commerce and writing, respect in family, and intellectual oratory.",
    "detailedHi": "द्वितीय भाव में बुध का गोचर व्यापार में भारी मुनाफा, कुटुंब में मान-सम्मान, मधुर वाणी तथा वित्तीय समृद्धि देता है।"
  },
  {
    "planet": "Mercury",
    "planetHi": "बुध",
    "houseFromMoon": 3,
    "isFavorable": false,
    "summaryEn": "Friction with colleagues, brotherly disputes, travel fatigue, communication mishaps.",
    "summaryHi": "सहकर्मियों से मनमुटाव, भाइयों से विवाद, यात्रा में थकान, दस्तावेजी त्रुटियां।",
    "detailedEn": "Mercury in 3rd causes anxiety in contracts, disagreements with younger brothers, and wasted efforts in correspondence.",
    "detailedHi": "तृतीय भाव में बुध का गोचर सहोदरों से मतभेद, अनुबंधों में त्रुटि तथा व्यर्थ की भागदौड़ उत्पन्न करता है।"
  },
  {
    "planet": "Mercury",
    "planetHi": "बुध",
    "houseFromMoon": 4,
    "isFavorable": true,
    "vedhaHouse": 2,
    "summaryEn": "Intellectual gains, maternal happiness, education advancement, home peace.",
    "summaryHi": "बौद्धिक प्रगति, माता का पूर्ण सुख, शिक्षा में सफलता, पारिवारिक शांति।",
    "detailedEn": "Mercury in 4th brings success in academic pursuits, acquisition of vehicles or property, and mental contentment.",
    "detailedHi": "चतुर्थ भाव में बुध का गोचर विद्या में सर्वोच्च अंक, माता का स्नेह, सुंदर वाहन सुख तथा मानसिक शांति देता है।"
  },
  {
    "planet": "Mercury",
    "planetHi": "बुध",
    "houseFromMoon": 5,
    "isFavorable": false,
    "summaryEn": "Mental confusion, educational hurdles, anxiety over children, speculative loss.",
    "summaryHi": "बुद्धि में भ्रम, अध्ययन में व्यवधान, संतान को लेकर चिंता, वित्तीय जोखिम में हानि।",
    "detailedEn": "Mercury in 5th creates memory lapses, misunderstandings with loved ones, and hurdles in creative initiatives.",
    "detailedHi": "पंचम भाव में बुध का गोचर मानसिक एकाग्रता में कमी, संतान की चिंता तथा प्रेम संबंधों में असमंजस लाता है।"
  },
  {
    "planet": "Mercury",
    "planetHi": "बुध",
    "houseFromMoon": 6,
    "isFavorable": true,
    "vedhaHouse": 1,
    "summaryEn": "Triumph in debate, popularity, academic victory, subjugation of competitors.",
    "summaryHi": "वाद-विवाद में विजय, लोकप्रियता, प्रतियोगी परीक्षाओं में सफलता, विरोधियों की पराजय।",
    "detailedEn": "Mercury in 6th is highly favorable: Destroys rivals with sharp intellect, wins legal negotiations, and brings workplace praise.",
    "detailedHi": "षष्ठ भाव में बुध का गोचर परम शुभ है: तीक्ष्ण बुद्धि से विरोधियों की पराजय, मुकदमों में जीत तथा कार्यक्षेत्र में यश।"
  },
  {
    "planet": "Mercury",
    "planetHi": "बुध",
    "houseFromMoon": 7,
    "isFavorable": false,
    "summaryEn": "Marital estrangement, disputes in trade partnerships, travel fatigue, misunderstandings.",
    "summaryHi": "दांपत्य में वैचारिक मतभेद, व्यापारिक साझेदारी में तनाव, यात्रा कष्ट, अविश्वास।",
    "detailedEn": "Mercury in 7th causes disagreements with spouse over small issues, friction with trade associates, and contract delays.",
    "detailedHi": "सप्तम भाव में बुध का गोचर जीवनसाथी से अनबन, व्यापारिक अनुबंधों में रुकावट तथा साझेदारी में मतभेद देता है।"
  },
  {
    "planet": "Mercury",
    "planetHi": "बुध",
    "houseFromMoon": 8,
    "isFavorable": true,
    "vedhaHouse": 4,
    "summaryEn": "Acquisition of wealth, scholarly acclaim, legacy gains, mental joy.",
    "summaryHi": "अकस्मात धन लाभ, विद्वता की प्रशंसा, वसीयत से लाभ, मन में उल्लास।",
    "detailedEn": "Mercury in 8th brings sudden monetary windfalls, success in esoteric or scientific research, and longevity assurance.",
    "detailedHi": "अष्टम भाव में बुध का गोचर अचानक धन प्राप्ति, गूढ़ वैज्ञानिक शोध में ख्याति तथा मानसिक शांति प्रदान करता है।"
  },
  {
    "planet": "Mercury",
    "planetHi": "बुध",
    "houseFromMoon": 9,
    "isFavorable": false,
    "summaryEn": "Obstacles in virtue, travel fatigue, friction with preceptors, delayed fortunes.",
    "summaryHi": "धार्मिक कार्यों में रुकावट, यात्रा में थकान, गुरुजनों से मतभेद, भाग्योदय में विलंब।",
    "detailedEn": "Mercury in 9th causes doubts, interruptions in higher education, and fatigue during long journeys.",
    "detailedHi": "नवम भाव में बुध का गोचर उच्च शिक्षा में विघ्न, यात्रा में व्यर्थ श्रम तथा भाग्य में शिथिलता लाता है।"
  },
  {
    "planet": "Mercury",
    "planetHi": "बुध",
    "houseFromMoon": 10,
    "isFavorable": true,
    "vedhaHouse": 8,
    "summaryEn": "Victory in profession, status elevation, peace of mind, lucrative business contracts.",
    "summaryHi": "कार्यक्षेत्र में ऐतिहासिक विजय, पदोन्नति, मानसिक शांति, लाभदायक व्यापारिक अनुबंध।",
    "detailedEn": "Mercury in 10th brings honors from superiors, successful financial audits, public acclaim, and commercial zenith.",
    "detailedHi": "दशम भाव में बुध का गोचर अधिकारियों से प्रशंसा, पदोन्नति, व्यापारिक शिखर तथा समाज में आदर देता है।"
  },
  {
    "planet": "Mercury",
    "planetHi": "बुध",
    "houseFromMoon": 11,
    "isFavorable": true,
    "vedhaHouse": 9,
    "summaryEn": "Financial profits, cordial friendships, new contracts, joy from children and elder brothers.",
    "summaryHi": "चौतरफा धन लाभ, प्रगाढ़ मित्रता, नवीन अनुबंध, संतान व अग्रज से सुख।",
    "detailedEn": "Mercury in 11th multiplies cash flow, brings intellectual friendships, fulfilling long-awaited commercial dreams.",
    "detailedHi": "एकादश भाव में बुध का गोचर विपुल धनोपार्जन, विद्वान मित्रों का सहयोग तथा सभी व्यापारिक योजनाओं की सिद्धि कराता है।"
  },
  {
    "planet": "Mercury",
    "planetHi": "बुध",
    "houseFromMoon": 12,
    "isFavorable": false,
    "summaryEn": "Loss through deceit, heavy educational expenses, nervous fatigue, sleep disturbances.",
    "summaryHi": "धोखे से धनहानि, शिक्षा पर भारी व्यय, स्नायु दुर्बलता, अनिद्रा की समस्या।",
    "detailedEn": "Mercury in 12th causes expenditure on unexpected travel or legal papers, mental strain, and overseas hassles.",
    "detailedHi": "द्वादश भाव में बुध का गोचर अनावश्यक व्यय, मानसिक तनाव तथा विदेश प्रवास में दस्तावेजी अड़चनें लाता है।"
  },
  {
    "planet": "Jupiter",
    "planetHi": "बृहस्पति (गुरु)",
    "houseFromMoon": 1,
    "isFavorable": false,
    "summaryEn": "Displacement, heavy responsibilities, fatigue, loss of position, health vulnerability.",
    "summaryHi": "स्थान परिवर्तन, अत्यधिक कार्यभार, शारीरिक थकान, पद में अस्थिरता, यकृत संवेदनशीलता।",
    "detailedEn": "Jupiter transiting natal Moon brings sudden relocation, separation from comfort, heavy ethical responsibilities, and digestive sluggishness.",
    "detailedHi": "जन्म राशि पर गुरु का गोचर स्थान परिवर्तन, कार्य का भारी बोझ, मान-सम्मान की परीक्षा तथा स्वास्थ्य में शिथिलता लाता है।"
  },
  {
    "planet": "Jupiter",
    "planetHi": "बृहस्पति (गुरु)",
    "houseFromMoon": 2,
    "isFavorable": true,
    "vedhaHouse": 12,
    "summaryEn": "Financial abundance, birth of child, family joy, accumulation of gold and jewels.",
    "summaryHi": "विपुल धन संपदा, संतान सुख, कुटुंब में उत्सव, स्वर्ण व आभूषणों का भारी संचय।",
    "detailedEn": "Jupiter in 2nd is supreme Dhana yoga transit: Multiplies wealth, bestows sweet speech, family harmony, and celebration.",
    "detailedHi": "द्वितीय भाव में गुरु का गोचर परम धनदायक है: अखंड लक्ष्मी की प्राप्ति, संतान का जन्म, कुटुंब में मांगलिक कार्य तथा सत्य वाणी।"
  },
  {
    "planet": "Jupiter",
    "planetHi": "बृहस्पति (गुरु)",
    "houseFromMoon": 3,
    "isFavorable": false,
    "summaryEn": "Obstacles through relatives, frustration in projects, loss of position, travel fatigue.",
    "summaryHi": "संबंधियों से मतभेद, कार्यों में रुकावट, पद में अस्थिरता, व्यर्थ यात्राओं में थकान।",
    "detailedEn": "Jupiter in 3rd causes friction with siblings, disappointment in plans, loss of money through bad advice, and mental worry.",
    "detailedHi": "तृतीय भाव में गुरु का गोचर सहोदरों से तनाव, योजनाओं में विफलता तथा गलत सलाह से धनहानि कराता है।"
  },
  {
    "planet": "Jupiter",
    "planetHi": "बृहस्पति (गुरु)",
    "houseFromMoon": 4,
    "isFavorable": false,
    "summaryEn": "Property disputes, domestic discord, mother illness, vehicle breakdown, mental restlessness.",
    "summaryHi": "भूमि-भवन में विवाद, गृह क्लेश, माता के स्वास्थ्य की चिंता, वाहन में खराबी, मानसिक अशांति।",
    "detailedEn": "Jupiter in 4th brings sorrow in family matters, disputes over ancestral land, separation from mother, and heart heaviness.",
    "detailedHi": "चतुर्थ भाव में गुरु का गोचर पारिवारिक कलह, पैतृक संपत्ति में विवाद तथा माता को शारीरिक कष्ट उत्पन्न करता है।"
  },
  {
    "planet": "Jupiter",
    "planetHi": "बृहस्पति (गुरु)",
    "houseFromMoon": 5,
    "isFavorable": true,
    "vedhaHouse": 4,
    "summaryEn": "Scholarly honors, progeny bliss, spiritual growth, divine grace, royal patronage.",
    "summaryHi": "विद्वत सम्मान, संतान सुख, आध्यात्मिक उन्नति, ईश्वरीय कृपा, शासन से विशेष सहयोग।",
    "detailedEn": "Jupiter in 5th is one of the grandest classical transits: Bestows illustrious progeny, scholarly triumphs, speculative wealth, and divine mantra siddhi.",
    "detailedHi": "पंचम भाव में गुरु का गोचर अत्यंत मंगलकारी है: सुलक्षण संतान का जन्म, विद्या में सर्वोच्च सम्मान, मंत्र सिद्धि तथा अखंड सौभाग्य।"
  },
  {
    "planet": "Jupiter",
    "planetHi": "बृहस्पति (गुरु)",
    "houseFromMoon": 6,
    "isFavorable": false,
    "summaryEn": "Troubles from enemies, liver ailments, debt anxiety, litigation hurdles.",
    "summaryHi": "विरोधियों से तनाव, यकृत व पाचन विकार, ऋण की चिंता, न्यायालयीन मुकदमों में विलंब।",
    "detailedEn": "Jupiter in 6th brings disputes with subordinates, digestive or metabolic disorders, and expenditure on litigations.",
    "detailedHi": "षष्ठ भाव में गुरु का गोचर विरोधियों की सक्रियता, यकृत रोग, कर्ज की चिंता तथा मुकदमों में धन व्यय कराता है।"
  },
  {
    "planet": "Jupiter",
    "planetHi": "बृहस्पति (गुरु)",
    "houseFromMoon": 7,
    "isFavorable": true,
    "vedhaHouse": 3,
    "summaryEn": "Fortunate marriage, royal honor, partnership gains, conjugal joy, diplomatic triumph.",
    "summaryHi": "शुभ विवाह, राजसम्मान, व्यापारिक साझेदारी में लाभ, अखंड दांपत्य सुख, कूटनीतिक विजय।",
    "detailedEn": "Jupiter in 7th brings matrimonial alliance with noble family, immense partnership profits, foreign diplomatic acclaim, and public love.",
    "detailedHi": "सप्तम भाव में गुरु का गोचर मांगलिक विवाह योग, दांपत्य में अपार सुख, व्यापारिक साझेदारी में भारी मुनाफा तथा लोक सम्मान देता है।"
  },
  {
    "planet": "Jupiter",
    "planetHi": "बृहस्पति (गुरु)",
    "houseFromMoon": 8,
    "isFavorable": false,
    "summaryEn": "Fatigue, loss of position, health vulnerability, delays, travel hardships.",
    "summaryHi": "शारीरिक थकान, पदच्युति का भय, स्वास्थ्य में शिथिलता, कार्यों में विलंब, कष्टप्रद यात्रा।",
    "detailedEn": "Jupiter in 8th requires caution: Fatigue, loss of money through carelessness, legal delays, and digestive vulnerability.",
    "detailedHi": "अष्टम भाव में गुरु का गोचर मानहानि का भय, स्वास्थ्य शिथिलता, मुकदमों में विलंब तथा धनहानि का संकेत देता है।"
  },
  {
    "planet": "Jupiter",
    "planetHi": "बृहस्पति (गुरु)",
    "houseFromMoon": 9,
    "isFavorable": true,
    "vedhaHouse": 10,
    "summaryEn": "All-round prosperity, pilgrimage, paternal bliss, fortune dawn, universal reverence.",
    "summaryHi": "सर्वतोमुखी समृद्धि, तीर्थ यात्रा, पिता का सुख, महान भाग्योदय, समाज में पूज्य सम्मान।",
    "detailedEn": "Jupiter in 9th is the supreme Bhagyodaya transit: Everything turns auspicious, long-cherished dreams materialize, temple visits succeed.",
    "detailedHi": "नवम भाव में गुरु का गोचर अखंड भाग्योदय का समय है: सभी कार्य सिद्ध, तीर्थाटन, पिता व गुरुजनों का आशीर्वाद तथा सर्वत्र विजय।"
  },
  {
    "planet": "Jupiter",
    "planetHi": "बृहस्पति (गुरु)",
    "houseFromMoon": 10,
    "isFavorable": false,
    "summaryEn": "Loss of position, workplace friction, arduous duties, loss of authority.",
    "summaryHi": "पद में अस्थिरता, कार्यक्षेत्र में असहयोग, अत्यधिक श्रम, अधिकारों में कमी।",
    "detailedEn": "Jupiter in 10th brings displacement in job, lack of appreciation from superiors, and ethical dilemmas at work.",
    "detailedHi": "दशम भाव में गुरु का गोचर आजीविका में बाधा, अधिकारियों से अनबन तथा अत्यधिक परिश्रम के बावजूद अल्प सम्मान देता है।"
  },
  {
    "planet": "Jupiter",
    "planetHi": "बृहस्पति (गुरु)",
    "houseFromMoon": 11,
    "isFavorable": true,
    "vedhaHouse": 8,
    "summaryEn": "Fulfilment of all desires, massive gains, high status, honors, prosperous children.",
    "summaryHi": "सभी मनोकामनाओं की पूर्ण सिद्धि, विपुल धन लाभ, उच्च पद, राजकीय सम्मान, संतान की उन्नति।",
    "detailedEn": "Jupiter in 11th showers multi-fold wealth, fulfills every pending ambition, grants noble associations, and brings celebration.",
    "detailedHi": "एकादश भाव में गुरु का गोचर सर्वोत्तम लाभ देता है: अकूत धन संचय, सभी योजनाओं की पूर्णता, अग्रज का सहयोग तथा महालक्ष्मी कृपा।"
  },
  {
    "planet": "Jupiter",
    "planetHi": "बृहस्पति (गुरु)",
    "houseFromMoon": 12,
    "isFavorable": false,
    "summaryEn": "Heavy expenditure on ceremonies, foreign separation, grief over property, spiritual detachment.",
    "summaryHi": "मांगलिक कार्यों या चिकित्सा पर भारी व्यय, विदेश प्रवास, संपत्ति की चिंता, वैराग्य।",
    "detailedEn": "Jupiter in 12th causes expenditure on religious rites, separation from kin, overseas hurdles, and spiritual contemplation.",
    "detailedHi": "द्वादश भाव में गुरु का गोचर धर्मार्थ या चिकित्सा में भारी धन व्यय, स्वजनों से दूरी तथा एकांत में चिंतन कराता है।"
  },
  {
    "planet": "Venus",
    "planetHi": "शुक्र",
    "houseFromMoon": 1,
    "isFavorable": true,
    "vedhaHouse": 8,
    "summaryEn": "Sensory pleasures, fine garments, romance, radiant appearance, delicious food.",
    "summaryHi": "इंद्रिय सुख, सुंदर वस्त्राभूषण, प्रेम प्रसंग, कांतिवान स्वरूप, स्वादिष्ट भोजन।",
    "detailedEn": "Venus over natal Moon brings romantic joys, attractive appearance, luxury acquisitions, and happy domestic moments.",
    "detailedHi": "प्रथम भाव में शुक्र का गोचर उत्तम सौंदर्य, प्रेम संबंधों में प्रगाढ़ता, विलासिता के साधनों की प्राप्ति तथा मानसिक प्रसन्नता देता है।"
  },
  {
    "planet": "Venus",
    "planetHi": "शुक्र",
    "houseFromMoon": 2,
    "isFavorable": true,
    "vedhaHouse": 7,
    "summaryEn": "Monetary accumulation, sweet words, family joy, purchase of jewelry and gold.",
    "summaryHi": "विपुल धन संचय, मधुर वाणी, कुटुंब में सुख-शांति, स्वर्ण व आभूषणों का क्रय।",
    "detailedEn": "Venus in 2nd multiplies wealth through arts and luxury, resolves domestic disputes, and bestows sweet melodious speech.",
    "detailedHi": "द्वितीय भाव में शुक्र का गोचर धन की प्रचुरता, आभूषणों की प्राप्ति, कुटुंब में मांगलिक उत्सव तथा वाणी में माधुर्य देता है।"
  },
  {
    "planet": "Venus",
    "planetHi": "शुक्र",
    "houseFromMoon": 3,
    "isFavorable": true,
    "vedhaHouse": 1,
    "summaryEn": "Wealth, siblings happiness, influence, artistic triumph, joyful short trips.",
    "summaryHi": "धन लाभ, सहोदरों से स्नेह, प्रभाव में वृद्धि, कलात्मक सफलता, सुखद यात्राएं।",
    "detailedEn": "Venus in 3rd brings creative renown, support from sisters, profitable commercial travels, and attractive influence.",
    "detailedHi": "तृतीय भाव में शुक्र का गोचर कला व संगीत में ख्याति, बहनों का सहयोग, व्यापारिक यात्राओं में लाभ तथा समाज में सम्मान देता है।"
  },
  {
    "planet": "Venus",
    "planetHi": "शुक्र",
    "houseFromMoon": 4,
    "isFavorable": true,
    "vedhaHouse": 10,
    "summaryEn": "Luxurious vehicle, home comfort, maternal joy, artistic interior decorations.",
    "summaryHi": "उत्तम वाहन सुख, गृह में सुख-शांति, माता का स्नेह, सुंदर व सुरुचिपूर्ण गृह सज्जा।",
    "detailedEn": "Venus in 4th brings purchase of luxury car, renovation of residence, peaceful domestic life, and affectionate mother.",
    "detailedHi": "चतुर्थ भाव में शुक्र का गोचर नवीन वाहन की प्राप्ति, भव्य गृह सुख, माता का आशीर्वाद तथा पारिवारिक आनंद देता है।"
  },
  {
    "planet": "Venus",
    "planetHi": "शुक्र",
    "houseFromMoon": 5,
    "isFavorable": true,
    "vedhaHouse": 9,
    "summaryEn": "Children joy, romantic bliss, speculative gains, artistic and poetic acclaim.",
    "summaryHi": "संतान सुख, प्रेम में सफलता, वित्तीय निवेश में लाभ, कला व काव्य में प्रशंसा।",
    "detailedEn": "Venus in 5th fulfills romantic desires, brings birth or honors to children, and yields profits through creative ventures.",
    "detailedHi": "पंचम भाव में शुक्र का गोचर प्रेम संबंधों का चरमोत्कर्ष, संतान से सुख, कलात्मक रचनाओं में पुरस्कार तथा धन लाभ कराता है।"
  },
  {
    "planet": "Venus",
    "planetHi": "शुक्र",
    "houseFromMoon": 6,
    "isFavorable": false,
    "summaryEn": "Quarrels with women, urinary troubles, digestive weakness, relationship friction.",
    "summaryHi": "स्त्री वर्ग से विवाद, मूत्र या गुर्दे विकार, पाचन दुर्बलता, संबंधों में खटास।",
    "detailedEn": "Venus in 6th is unfavorable: Causes scandalous disputes with female associates, kidney sensitivity, and debt strain.",
    "detailedHi": "षष्ठ भाव में शुक्र का गोचर स्त्रियों से अनबन, गुर्दे या मूत्राशय में शिथिलता तथा विलासिता के कारण कर्ज का तनाव देता है।"
  },
  {
    "planet": "Venus",
    "planetHi": "शुक्र",
    "houseFromMoon": 7,
    "isFavorable": false,
    "summaryEn": "Disputes with spouse, marital strain, financial loss through luxury or scandals.",
    "summaryHi": "दांपत्य में मतभेद, जीवनसाथी से कलह, विलासिता या बदनामी से धनहानि।",
    "detailedEn": "Venus in 7th causes marital discord, mutual accusations, weariness in travel, and loss in commercial partnerships.",
    "detailedHi": "सप्तम भाव में शुक्र का गोचर दांपत्य में अविश्वास, जीवनसाथी के स्वास्थ्य की चिंता तथा साझेदारी में तनाव लाता है।"
  },
  {
    "planet": "Venus",
    "planetHi": "शुक्र",
    "houseFromMoon": 8,
    "isFavorable": true,
    "vedhaHouse": 5,
    "summaryEn": "Unexpected gains, luxury, sensual satisfaction, gifts from in-laws, longevity.",
    "summaryHi": "आकस्मिक धन लाभ, विलासिता की वस्तुएं, कामसुख, ससुराल से उपहार, उत्तम स्वास्थ्य।",
    "detailedEn": "Venus in 8th brings sudden inheritance, expensive jewelry gifts, peaceful marital harmony, and secret financial profits.",
    "detailedHi": "अष्टम भाव में शुक्र का गोचर अचानक विपुल धन, ससुराल पक्ष से आभूषण लाभ, गुप्त सुख तथा दीर्घायु प्रदान करता है।"
  },
  {
    "planet": "Venus",
    "planetHi": "शुक्र",
    "houseFromMoon": 9,
    "isFavorable": true,
    "vedhaHouse": 11,
    "summaryEn": "Dharma, prosperity, gifts, fortunate travels, blessings of Lakshmi, charity.",
    "summaryHi": "धर्म लाभ, समृद्धि, बहुमूल्य उपहार, सुखद विदेश यात्राएं, महालक्ष्मी कृपा, दान-पुण्य।",
    "detailedEn": "Venus in 9th brings blessings of preceptors, international luxury tours, fortune through spouse, and charitable renown.",
    "detailedHi": "नवम भाव में शुक्र का गोचर अखंड भाग्योदय, तीर्थ यात्राएं, जीवनसाथी द्वारा सौभाग्य तथा धार्मिक उत्सवों में अग्रणी बनाता है।"
  },
  {
    "planet": "Venus",
    "planetHi": "शुक्र",
    "houseFromMoon": 10,
    "isFavorable": false,
    "summaryEn": "Disgrace, professional scandals, humiliation, conflicts in luxury enterprise.",
    "summaryHi": "अपयश का भय, कार्यक्षेत्र में बदनामी, अपमान, विलासिता व्यापार में हानि।",
    "detailedEn": "Venus in 10th causes scandals regarding opposite gender, friction with employers, and defamation in public life.",
    "detailedHi": "दशम भाव में शुक्र का गोचर कार्यक्षेत्र में अपवाद, अधिकारियों से अनबन तथा सामाजिक प्रतिष्ठा पर आंच का भय कराता है।"
  },
  {
    "planet": "Venus",
    "planetHi": "शुक्र",
    "houseFromMoon": 11,
    "isFavorable": true,
    "vedhaHouse": 3,
    "summaryEn": "Immense wealth, social fame, friendship, luxury vehicles, romantic fulfillment.",
    "summaryHi": "अथाह धन संपदा, सामाजिक ख्याति, प्रभावशाली मित्र, उत्तम वाहन, प्रेम की पूर्णता।",
    "detailedEn": "Venus in 11th is supreme Labha transit: Showering multi-stream cash, fulfilled aspirations, and affluent alliances.",
    "detailedHi": "एकादश भाव में शुक्र का गोचर विपुल धनवर्षा, सभी मनोरथों की सिद्धि, उत्तम वाहन तथा समाज में वैभवशाली स्थान देता है।"
  },
  {
    "planet": "Venus",
    "planetHi": "शुक्र",
    "houseFromMoon": 12,
    "isFavorable": true,
    "vedhaHouse": 6,
    "summaryEn": "Sensory enjoyment, bed pleasures, foreign luxury, lavish living, happy expenditures.",
    "summaryHi": "शयन सुख, उत्तम विलासिता, विदेश में ऐश्वर्यशाली वास, मांगलिक कार्यों में व्यय।",
    "detailedEn": "Venus in 12th is classically unique as favorable: Brings peaceful sleep, luxury travels, generous charity, and foreign prosperity.",
    "detailedHi": "द्वादश भाव में शुक्र का गोचर शुभ फलप्रद है: अद्वितीय शयन सुख, विदेश में वैभवशाली जीवन, परोपकार तथा मानसिक शांति।"
  },
  {
    "planet": "Rahu",
    "planetHi": "राहु",
    "houseFromMoon": 3,
    "isFavorable": true,
    "vedhaHouse": 12,
    "summaryEn": "Sudden daring courage, crushing of enemies, high-tech and media gains, financial leaps.",
    "summaryHi": "अचानक अदम्य साहस, शत्रुओं का समूल नाश, उच्च तकनीक व मीडिया से धन लाभ, विजय।",
    "detailedEn": "Rahu in 3rd destroys all adversaries, brings explosive popularity in media/tech, foreign contracts, and fearless enterprise.",
    "detailedHi": "तृतीय भाव में राहु का गोचर अत्यंत शुभ है: विरोधियों का विनाश, डिजिटल मीडिया व तकनीक में ख्याति तथा विपुल धन लाभ।"
  },
  {
    "planet": "Rahu",
    "planetHi": "राहु",
    "houseFromMoon": 6,
    "isFavorable": true,
    "vedhaHouse": 9,
    "summaryEn": "Total destruction of adversaries, legal triumph, robust health, debt liquidation.",
    "summaryHi": "विरोधियों का पूर्ण संहार, मुकदमों में ऐतिहासिक विजय, उत्तम आरोग्य, ऋणों से मुक्ति।",
    "detailedEn": "Rahu in 6th is supreme Shatruhanta: Vanquishes court cases, crushes workplace conspiracies, and cures complex diseases.",
    "detailedHi": "षष्ठ भाव में राहु का गोचर समस्त षड्यंत्रों को नष्ट करता है: असाध्य रोगों से मुक्ति, मुकदमों में जीत तथा निर्बाध प्रगति।"
  },
  {
    "planet": "Rahu",
    "planetHi": "राहु",
    "houseFromMoon": 11,
    "isFavorable": true,
    "vedhaHouse": 5,
    "summaryEn": "Windfall foreign wealth, massive profits, fulfilled ambitions beyond expectation.",
    "summaryHi": "विदेशी स्रोतों से अकूत धन, व्यापार में भारी मुनाफा, सभी महत्वाकांक्षाओं की पूर्ण सिद्धि।",
    "detailedEn": "Rahu in 11th brings multi-millionaire windfalls, international network support, unexpected technological breakthroughs, and fame.",
    "detailedHi": "एकादश भाव में राहु का गोचर अप्रत्याशित भारी धनवर्षा, अंतरराष्ट्रीय संपर्कों से लाभ तथा सभी लक्ष्यों की सिद्धि कराता है।"
  },
  {
    "planet": "Ketu",
    "planetHi": "केतु",
    "houseFromMoon": 3,
    "isFavorable": true,
    "vedhaHouse": 12,
    "summaryEn": "Spiritual valor, occult breakthroughs, defeat of foes, technical coding mastery.",
    "summaryHi": "आध्यात्मिक पराक्रम, गूढ़ विद्याओं में सफलता, शत्रुओं की पराजय, तकनीकी दक्षता।",
    "detailedEn": "Ketu in 3rd bestows quiet determination, courage in difficult trials, research publication, and victory over opposition.",
    "detailedHi": "तृतीय भाव में केतु का गोचर आध्यात्मिक शक्ति, विरोधियों पर विजय, शोध व कोडिंग में सफलता तथा मनोबल देता है।"
  },
  {
    "planet": "Ketu",
    "planetHi": "केतु",
    "houseFromMoon": 6,
    "isFavorable": true,
    "vedhaHouse": 9,
    "summaryEn": "Destruction of rivals, healing power, debt relief, immunity from secret plots.",
    "summaryHi": "शत्रुओं का दमन, प्राकृतिक उपचार शक्ति, ऋणों से मुक्ति, गुप्त षड्यंत्रों से पूर्ण सुरक्षा।",
    "detailedEn": "Ketu in 6th cures diseases, vanquishes hidden foes through spiritual resilience, and clears long-standing liabilities.",
    "detailedHi": "षष्ठ भाव में केतु का गोचर असाध्य रोगों का शमन, गुप्त विरोधियों की पराजय तथा पुराने ऋणों से मुक्ति प्रदान करता है।"
  },
  {
    "planet": "Ketu",
    "planetHi": "केतु",
    "houseFromMoon": 11,
    "isFavorable": true,
    "vedhaHouse": 5,
    "summaryEn": "Unexpected spiritual and financial windfalls, quiet contentment, fulfilled needs.",
    "summaryHi": "आकस्मिक धन लाभ, मानसिक संतोष, आवश्यक इच्छाओं की सहज पूर्ति, सात्विक लाभ।",
    "detailedEn": "Ketu in 11th brings sudden unearned wealth, blessings of holy saints, spiritual associations, and quiet prosperity.",
    "detailedHi": "एकादश भाव में केतु का गोचर गुप्त धन लाभ, संतों का आशीर्वाद, आध्यात्मिक उन्नति तथा शांत व सुखी जीवन देता है।"
  },
  {
    "planet": "Rahu",
    "planetHi": "राहु",
    "houseFromMoon": 1,
    "isFavorable": false,
    "summaryEn": "Headaches, mental anxiety, hallucinations, disputes with superiors.",
    "summaryHi": "शिरोवेदना, मानसिक बेचैनी, अकारण भय, अधिकारियों से विवाद।",
    "detailedEn": "Rahu transiting house 1 from natal Moon creates testing karma requiring ethical vigilance and spiritual equanimity.",
    "detailedHi": "जन्म चन्द्रमा से 1वें भाव में राहु का गोचर मानसिक संयम व आध्यात्मिक साधना की मांग करता है।"
  },
  {
    "planet": "Rahu",
    "planetHi": "राहु",
    "houseFromMoon": 2,
    "isFavorable": false,
    "summaryEn": "Loss of wealth through fraud, dental pain, family speech discord.",
    "summaryHi": "धोखे से धनहानि, दंत विकार, कुटुंब में वाणी से कटुता।",
    "detailedEn": "Rahu transiting house 2 from natal Moon creates testing karma requiring ethical vigilance and spiritual equanimity.",
    "detailedHi": "जन्म चन्द्रमा से 2वें भाव में राहु का गोचर मानसिक संयम व आध्यात्मिक साधना की मांग करता है।"
  },
  {
    "planet": "Rahu",
    "planetHi": "राहु",
    "houseFromMoon": 4,
    "isFavorable": false,
    "summaryEn": "Domestic distress, vehicle breakdowns, maternal health anxiety.",
    "summaryHi": "गृह क्लेश, वाहन में खराबी, माता के स्वास्थ्य की चिंता।",
    "detailedEn": "Rahu transiting house 4 from natal Moon creates testing karma requiring ethical vigilance and spiritual equanimity.",
    "detailedHi": "जन्म चन्द्रमा से 4वें भाव में राहु का गोचर मानसिक संयम व आध्यात्मिक साधना की मांग करता है।"
  },
  {
    "planet": "Rahu",
    "planetHi": "राहु",
    "houseFromMoon": 5,
    "isFavorable": false,
    "summaryEn": "Digestive heat, worry regarding children, loss in speculation.",
    "summaryHi": "उदर में गैस व पित्त, संतान की चिंता, सट्टे में धनहानि।",
    "detailedEn": "Rahu transiting house 5 from natal Moon creates testing karma requiring ethical vigilance and spiritual equanimity.",
    "detailedHi": "जन्म चन्द्रमा से 5वें भाव में राहु का गोचर मानसिक संयम व आध्यात्मिक साधना की मांग करता है।"
  },
  {
    "planet": "Rahu",
    "planetHi": "राहु",
    "houseFromMoon": 7,
    "isFavorable": false,
    "summaryEn": "Marital friction, spouse health strain, disputes in travel.",
    "summaryHi": "दांपत्य में मतभेद, जीवनसाथी का अस्वस्थ होना, यात्रा में कष्ट।",
    "detailedEn": "Rahu transiting house 7 from natal Moon creates testing karma requiring ethical vigilance and spiritual equanimity.",
    "detailedHi": "जन्म चन्द्रमा से 7वें भाव में राहु का गोचर मानसिक संयम व आध्यात्मिक साधना की मांग करता है।"
  },
  {
    "planet": "Rahu",
    "planetHi": "राहु",
    "houseFromMoon": 8,
    "isFavorable": false,
    "summaryEn": "Accident risks, mysterious ailments, sudden financial upheaval.",
    "summaryHi": "दुर्घटना का भय, अज्ञात रोग, आकस्मिक आर्थिक संकट।",
    "detailedEn": "Rahu transiting house 8 from natal Moon creates testing karma requiring ethical vigilance and spiritual equanimity.",
    "detailedHi": "जन्म चन्द्रमा से 8वें भाव में राहु का गोचर मानसिक संयम व आध्यात्मिक साधना की मांग करता है।"
  },
  {
    "planet": "Rahu",
    "planetHi": "राहु",
    "houseFromMoon": 9,
    "isFavorable": false,
    "summaryEn": "Strained paternal relations, obstacles in pilgrimage, loss of momentum.",
    "summaryHi": "पिता से मतभेद, तीर्थ यात्रा में विघ्न, कार्यों में शिथिलता।",
    "detailedEn": "Rahu transiting house 9 from natal Moon creates testing karma requiring ethical vigilance and spiritual equanimity.",
    "detailedHi": "जन्म चन्द्रमा से 9वें भाव में राहु का गोचर मानसिक संयम व आध्यात्मिक साधना की मांग करता है।"
  },
  {
    "planet": "Rahu",
    "planetHi": "राहु",
    "houseFromMoon": 10,
    "isFavorable": false,
    "summaryEn": "Workplace friction, sudden changes in job, scandal or defamation risk.",
    "summaryHi": "कार्यक्षेत्र में तनाव, अचानक नौकरी में बदलाव, बदनामी का भय।",
    "detailedEn": "Rahu transiting house 10 from natal Moon creates testing karma requiring ethical vigilance and spiritual equanimity.",
    "detailedHi": "जन्म चन्द्रमा से 10वें भाव में राहु का गोचर मानसिक संयम व आध्यात्मिक साधना की मांग करता है।"
  },
  {
    "planet": "Rahu",
    "planetHi": "राहु",
    "houseFromMoon": 12,
    "isFavorable": false,
    "summaryEn": "Heavy expenditure, sleep disturbances, foreign complications.",
    "summaryHi": "भारी व्यय, अनिद्रा की समस्या, विदेश में दस्तावेजी अड़चनें।",
    "detailedEn": "Rahu transiting house 12 from natal Moon creates testing karma requiring ethical vigilance and spiritual equanimity.",
    "detailedHi": "जन्म चन्द्रमा से 12वें भाव में राहु का गोचर मानसिक संयम व आध्यात्मिक साधना की मांग करता है।"
  },
  {
    "planet": "Ketu",
    "planetHi": "केतु",
    "houseFromMoon": 1,
    "isFavorable": false,
    "summaryEn": "Physical scars, digestive weakness, spiritual restlessness, fatigue.",
    "summaryHi": "शारीरिक दुर्बलता, पाचन विकार, मानसिक बेचैनी, थकान।",
    "detailedEn": "Ketu transiting house 1 from natal Moon brings detachment and spiritual lessons regarding material affairs.",
    "detailedHi": "जन्म चन्द्रमा से 1वें भाव में केतु का गोचर भौतिक मामलों में विरक्ति व आत्मनिरीक्षण की प्रेरणा देता है।"
  },
  {
    "planet": "Ketu",
    "planetHi": "केतु",
    "houseFromMoon": 2,
    "isFavorable": false,
    "summaryEn": "Financial losses, harsh speech slips, eye strain, dental pain.",
    "summaryHi": "अनावश्यक धनहानि, कटु वाणी, नेत्र विकार, दंत संवेदनशीलता।",
    "detailedEn": "Ketu transiting house 2 from natal Moon brings detachment and spiritual lessons regarding material affairs.",
    "detailedHi": "जन्म चन्द्रमा से 2वें भाव में केतु का गोचर भौतिक मामलों में विरक्ति व आत्मनिरीक्षण की प्रेरणा देता है।"
  },
  {
    "planet": "Ketu",
    "planetHi": "केतु",
    "houseFromMoon": 4,
    "isFavorable": false,
    "summaryEn": "Domestic gloom, mother health afflicted, property dispute, restlessness.",
    "summaryHi": "गृह में उदासी, माता को कष्ट, संपत्ति विवाद, मानसिक अशांति।",
    "detailedEn": "Ketu transiting house 4 from natal Moon brings detachment and spiritual lessons regarding material affairs.",
    "detailedHi": "जन्म चन्द्रमा से 4वें भाव में केतु का गोचर भौतिक मामलों में विरक्ति व आत्मनिरीक्षण की प्रेरणा देता है।"
  },
  {
    "planet": "Ketu",
    "planetHi": "केतु",
    "houseFromMoon": 5,
    "isFavorable": false,
    "summaryEn": "Children health distress, stomach ache, memory lapses under stress.",
    "summaryHi": "संतान को कष्ट, उदर शूल, तनाव में विस्मृति, पढ़ाई में रुकावट।",
    "detailedEn": "Ketu transiting house 5 from natal Moon brings detachment and spiritual lessons regarding material affairs.",
    "detailedHi": "जन्म चन्द्रमा से 5वें भाव में केतु का गोचर भौतिक मामलों में विरक्ति व आत्मनिरीक्षण की प्रेरणा देता है।"
  },
  {
    "planet": "Ketu",
    "planetHi": "केतु",
    "houseFromMoon": 7,
    "isFavorable": false,
    "summaryEn": "Marital coldness, spouse ailments, contract breaches, separation risk.",
    "summaryHi": "दांपत्य में विरक्ति, जीवनसाथी का रोग, व्यापारिक समझौते टूटना।",
    "detailedEn": "Ketu transiting house 7 from natal Moon brings detachment and spiritual lessons regarding material affairs.",
    "detailedHi": "जन्म चन्द्रमा से 7वें भाव में केतु का गोचर भौतिक मामलों में विरक्ति व आत्मनिरीक्षण की प्रेरणा देता है।"
  },
  {
    "planet": "Ketu",
    "planetHi": "केतु",
    "houseFromMoon": 8,
    "isFavorable": false,
    "summaryEn": "Hidden health risks, insect/reptile bites caution, sudden fears.",
    "summaryHi": "अज्ञात शारीरिक कष्ट, कीट-दंश से सावधानी, अकारण भय।",
    "detailedEn": "Ketu transiting house 8 from natal Moon brings detachment and spiritual lessons regarding material affairs.",
    "detailedHi": "जन्म चन्द्रमा से 8वें भाव में केतु का गोचर भौतिक मामलों में विरक्ति व आत्मनिरीक्षण की प्रेरणा देता है।"
  },
  {
    "planet": "Ketu",
    "planetHi": "केतु",
    "houseFromMoon": 9,
    "isFavorable": false,
    "summaryEn": "Travel hurdles, obstacles in pilgrimage, friction with orthodox preceptors.",
    "summaryHi": "यात्रा में विघ्न, तीर्थ में रुकावट, गुरुजनों से मतभेद।",
    "detailedEn": "Ketu transiting house 9 from natal Moon brings detachment and spiritual lessons regarding material affairs.",
    "detailedHi": "जन्म चन्द्रमा से 9वें भाव में केतु का गोचर भौतिक मामलों में विरक्ति व आत्मनिरीक्षण की प्रेरणा देता है।"
  },
  {
    "planet": "Ketu",
    "planetHi": "केतु",
    "houseFromMoon": 10,
    "isFavorable": false,
    "summaryEn": "Instability in vocation, ethical scrutiny, lack of appreciation at work.",
    "summaryHi": "आजीविका में अस्थिरता, परिश्रम का श्रेय न मिलना, कार्य में बाधा।",
    "detailedEn": "Ketu transiting house 10 from natal Moon brings detachment and spiritual lessons regarding material affairs.",
    "detailedHi": "जन्म चन्द्रमा से 10वें भाव में केतु का गोचर भौतिक मामलों में विरक्ति व आत्मनिरीक्षण की प्रेरणा देता है।"
  },
  {
    "planet": "Ketu",
    "planetHi": "केतु",
    "houseFromMoon": 12,
    "isFavorable": false,
    "summaryEn": "Hospital expenses, sleep loss, foreign isolation, eye strain.",
    "summaryHi": "चिकित्सालय पर व्यय, अनिद्रा, विदेश में एकाकीपन, नेत्र पीड़ा।",
    "detailedEn": "Ketu transiting house 12 from natal Moon brings detachment and spiritual lessons regarding material affairs.",
    "detailedHi": "जन्म चन्द्रमा से 12वें भाव में केतु का गोचर भौतिक मामलों में विरक्ति व आत्मनिरीक्षण की प्रेरणा देता है।"
  }
];

export function getSignMilestones(signIndex: number): SignMilestonesRecord {
  const norm = ((signIndex % 12) + 12) % 12;
  return SIGN_YEARS_MILESTONES[norm] || SIGN_YEARS_MILESTONES[0];
}

export function getPlanetHouseBookRecord(planet: string, house: number): PlanetHouseBookRecord | undefined {
  return PLANET_HOUSE_BOOK_CORPUS.find(
    (r) => r.planet.toLowerCase() === planet.toLowerCase() && r.house === house
  );
}

export function getDrekkanaRecord(signIndex: number, degInSign: number): DrekkanaBookRecord {
  const normSign = ((signIndex % 12) + 12) % 12;
  const deg = Math.max(0, Math.min(29.9999, degInSign));
  const drekkanaNum: 1 | 2 | 3 = deg < 10 ? 1 : deg < 20 ? 2 : 3;
  return (
    DREKKANA_36_CORPUS.find((d) => d.signIndex === normSign && d.drekkanaNumber === drekkanaNum) ||
    DREKKANA_36_CORPUS[0]
  );
}

export function getGocharaBookRecord(planet: string, houseFromMoon: number): GocharaBookRecord | undefined {
  const normH = ((houseFromMoon - 1) % 12) + 1;
  return GOCHARA_BOOK_CORPUS.find(
    (g) => g.planet.toLowerCase() === planet.toLowerCase() && g.houseFromMoon === normH
  );
}

export function getGulikaHouseRecord(house: number): GulikaHouseRecord | undefined {
  const normH = ((house - 1) % 12) + 1;
  return GULIKA_HOUSES_CORPUS.find((g) => g.house === normH);
}

// Re-export AIFAS Dasha & Yogini Classical Treatise (Prediction through Dasha: Yogini & Vimshottari)
export * from './aifasYoginiDashaKb';

// Re-export Dr. K.S. Charak & Far Far Away Classical Treatises
export * from './charakElementsKb';
