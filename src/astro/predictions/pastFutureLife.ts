import { NINE_GRAHAS, SEVEN_PLANETS, SIGNS } from '../constants';
import type { BodyPosition, ChartData, NineGrahaId, SevenPlanetId } from '../types';
import { evaluateParamayusStatus } from './paramayus';

export interface ShashtiamsaDeityInfo {
  index: number; // 1..60
  nameEn: string;
  nameHi: string;
  nature: 'Benefic' | 'Karmic';
  meaningEn: string;
  meaningHi: string;
}

export interface PastFutureChartFactor {
  chartCode: string;
  factorEn: string;
  factorHi: string;
  placementEn: string;
  placementHi: string;
  insightEn: string;
  insightHi: string;
}

export interface PastLifeReading {
  headlineEn: string;
  headlineHi: string;
  shashtiamsaDeityEn: string;
  shashtiamsaDeityHi: string;
  shashtiamsaNature: 'Benefic' | 'Karmic';
  previousRoleAndStationEn: string;
  previousRoleAndStationHi: string;
  purvaPunyaCarriedEn: string;
  purvaPunyaCarriedHi: string;
  unfinishedKarmaAndDebtsEn: string;
  unfinishedKarmaAndDebtsHi: string;
  ancestralD12ConnectionEn: string;
  ancestralD12ConnectionHi: string;
  pastLifeExitAndMemoryEn: string;
  pastLifeExitAndMemoryHi: string;
  chartFactors: PastFutureChartFactor[];
}

export interface FutureBecomingReading {
  headlineEn: string;
  headlineHi: string;
  archetypeEn: string;
  archetypeHi: string;
  thisLifeMaturityEn: string;
  thisLifeMaturityHi: string;
  careerAndLegacyApexEn: string;
  careerAndLegacyApexHi: string;
  nextBirthGatiTier: 'High Spiritual / Liberation Focus' | 'Noble & Scholarly Progression' | 'Dharmic Leadership / Builder Return' | 'Active Karmic Mastery';
  nextBirthLokaEn: string;
  nextBirthLokaHi: string;
  futureIncarnationProfileEn: string;
  futureIncarnationProfileHi: string;
  sadhanaToElevateEn: string;
  sadhanaToElevateHi: string;
  chartFactors: PastFutureChartFactor[];
}

export interface PastFutureLifeReport {
  pastLife: PastLifeReading;
  futureBecoming: FutureBecomingReading;
}

const SIGN_HI = [
  'मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या',
  'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुंभ', 'मीन',
];

const PLANET_HI: Record<string, string> = {
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

// BPHS Ch. 6 Classical 60 Shashtiamsa Deities (Odd signs 0..59; Even signs reversed 59..0)
const SHASHTIAMSA_LIST: Array<{
  en: string;
  hi: string;
  nature: 'Benefic' | 'Karmic';
  mEn: string;
  mHi: string;
}> = [
  { en: 'Ghora', hi: 'घोर', nature: 'Karmic', mEn: 'Fierce warrior/protector karma requiring inner gentleness', mHi: 'तीव्र रक्षक/संघर्ष कर्म — इस जन्म में करुणा व संयम की साधना' },
  { en: 'Rakshasa', hi: 'राक्षस', nature: 'Karmic', mEn: 'Passionate ambition & boundary-breaking past desires', mHi: 'प्रबल महत्वाकांक्षा व सीमाओं से परे जाने के अधूरे संस्कार' },
  { en: 'Deva', hi: 'देव', nature: 'Benefic', mEn: 'Divine worship, dharmic purity & charitable grace', mHi: 'देव-आराधना, सात्विक धर्म व दान-पुण्य का संचित बल' },
  { en: 'Kubera', hi: 'कुबेर', nature: 'Benefic', mEn: 'Steward of wealth, treasures & community prosperity', mHi: 'कोषाध्यक्ष/व्यापारिक समृद्धि व संसाधन प्रबंधन का पूर्व संस्कार' },
  { en: 'Yaksha', hi: 'यक्ष', nature: 'Karmic', mEn: 'Guarding material/occult secrets, longing for recognition', mHi: 'गुप्त विद्या/संपत्ति संरक्षण व यश की प्रबल अभिलाषा' },
  { en: 'Kinnara', hi: 'किन्नर', nature: 'Benefic', mEn: 'Artistic grace, music, poetry & refined aesthetic soul', mHi: 'संगीत, कला, काव्य व सौंदर्य साधना से जुड़ा पूर्व जन्म' },
  { en: 'Bhrashta', hi: 'भ्रष्ट', nature: 'Karmic', mEn: 'Lesson around broken vows—now rebuilding integrity', mHi: 'पूर्व संकल्प या नियम भंग का परिमार्जन — इस जन्म में सत्यनिष्ठा परीक्षा' },
  { en: 'Kulaghna', hi: 'कुलघ्न', nature: 'Karmic', mEn: 'Family friction karma demanding clan healing & seva', mHi: 'कुल/परिवार ऋण — इस जन्म में पारिवारिक संबंध सुधार का दायित्व' },
  { en: 'Garala', hi: 'गरल', nature: 'Karmic', mEn: 'Encountered betrayal/toxins—deep immunity & discernment now', mHi: 'विश्वासघात/तीखे अनुभव से सीखा हुआ गहरा विवेक व औषधि-रुचि' },
  { en: 'Vahni', hi: 'वह्नि', nature: 'Karmic', mEn: 'Agni rituals, metallurgy, or heated past conflicts', mHi: 'अग्नि-कर्म, यज्ञ, शस्त्र या तीव्र क्रोध-परिशोधन का संस्कार' },
  { en: 'Maya', hi: 'माया', nature: 'Karmic', mEn: 'Illusion, diplomacy & statecraft requiring clear truth', mHi: 'कूटनीति, मोह व संसारिक आकर्षण — सत्य-बोध की यात्रा' },
  { en: 'Purishaka', hi: 'पुरीषक', nature: 'Karmic', mEn: 'Harsh survival labor or austerity purifying pride', mHi: 'कठिन श्रम व अभिमान-शुद्धि के पूर्व अनुभव' },
  { en: 'Apampati', hi: 'अपांपति', nature: 'Benefic', mEn: 'Maritime/river culture, emotional depth & adaptability', mHi: 'जलीय प्रदेश, नौवहन या गहन संवेदनशील पूर्व जीवन' },
  { en: 'Marutwan', hi: 'मरुत्वान्', nature: 'Benefic', mEn: 'Prana mastery, swift travel & windswept courage', mHi: 'प्राण-विद्या, यात्रा व तेजस्वी गतिशील पूर्व भूमिका' },
  { en: 'Kala', hi: 'काल', nature: 'Karmic', mEn: 'Time-discipline, austerity & mastery over adversity', mHi: 'समय का कठोर अनुशासन, वैराग्य व संघर्षों से तपस्वी अनुभव' },
  { en: 'Sarpa', hi: 'सर्प', nature: 'Karmic', mEn: 'Kundalini/tantra curiosity & sharp intuitive instincts', mHi: 'गुप्त रहस्य, नाग-वंशीय स्मृति व तीक्ष्ण अंतर्ज्ञान' },
  { en: 'Amrita', hi: 'अमृत', nature: 'Benefic', mEn: 'Healing hands, nectar-like benevolence & divine grace', mHi: 'अमृत-सम औषधि/करुणा भाव व दैवी संरक्षण' },
  { en: 'Indu', hi: 'इंदु', nature: 'Benefic', mEn: 'Lunar devotion, nurturing motherhood/public affection', mHi: 'चंद्र-समान शीतल स्वभाव, पोषण व जन-स्नेह का पुण्य' },
  { en: 'Mridu', hi: 'मृदु', nature: 'Benefic', mEn: 'Gentle scholar, mediator & peacemaker across communities', mHi: 'सौम्य विद्वान, शांतिदूत व मधुर व्यवहार का संस्कार' },
  { en: 'Komala', hi: 'कोमल', nature: 'Benefic', mEn: 'Tender heart, fine arts & gracious noble upbringing', mHi: 'सुकोमल हृदय, कला-संस्कृति व सद्भावपूर्ण पूर्व जीवन' },
  { en: 'Heramba', hi: 'हेरंब', nature: 'Benefic', mEn: 'Ganesha-protected wisdom, hurdle-remover & sacred scribe', mHi: 'गणपति-कृपा, विघ्नहर्ता बुद्धि व लेखन/शास्त्र साधना' },
  { en: 'Brahma', hi: 'ब्रह्मा', nature: 'Benefic', mEn: 'Vedic creator, educator & seeker of cosmic law', mHi: 'सृजनशील गुरु, वेदाध्ययन व ज्ञान-दान का महान पुण्य' },
  { en: 'Vishnu', hi: 'विष्णु', nature: 'Benefic', mEn: 'Righteous sustainer, protector of dharma & charitable leader', mHi: 'धर्म-संरक्षक, पालनहार व न्यायप्रिय नेतृत्व का पूर्व जन्म' },
  { en: 'Maheshwara', hi: 'महेश्वर', nature: 'Benefic', mEn: 'Shiva-yogi spirit, meditation, ascetic insight & detachment', mHi: 'शिव-भक्त, ध्यान-योगी व वैराग्यपूर्ण आध्यात्मिक पृष्ठभूमि' },
  { en: 'Devarshi', hi: 'देवर्षि', nature: 'Benefic', mEn: 'Sacred messenger, astrologer-counselor & travelling sage', mHi: 'ज्योतिष/मंत्र परामर्शदाता, देव-संदेशवाहक व तीर्थ-यात्री संस्कार' },
  { en: 'Ardra', hi: 'आर्द्रा', nature: 'Benefic', mEn: 'Compassion forged through deep emotion & quiet service', mHi: 'भावनात्मक संवेदना व सेवा से अर्जित हृदय-शुद्धि' },
  { en: 'Kalinasha', hi: 'कलिनाश', nature: 'Benefic', mEn: 'Overcomes dark cycles through courage & righteous truth', mHi: 'सत्य व धर्म के बल पर संकटों का नाश करने वाली आत्मा' },
  { en: 'Kshitisha', hi: 'क्षितीश', nature: 'Benefic', mEn: 'Land-lord, civic ruler, or protector of territory', mHi: 'भूमिपति, प्रशासक या क्षेत्र-रक्षक का राजकीय संस्कार' },
  { en: 'Kamalakara', hi: 'कमलाकर', nature: 'Benefic', mEn: 'Lakshmi blessing, temple patronage & lotus-like purity', mHi: 'लक्ष्मी-कृपा, मंदिर सेवा व पवित्र जीवनशैली का पुण्य' },
  { en: 'Gulika', hi: 'गुलिक', nature: 'Karmic', mEn: 'Shadow-burden & unspoken family duty calling for seva', mHi: 'अव्यक्त पारिवारिक दायित्व — सेवा व दान से मुक्ति का मार्ग' },
  { en: 'Mrityu', hi: 'मृत्यु', nature: 'Karmic', mEn: 'Sudden prior-life transition leaving fierce will to live', mHi: 'अचानक हुए पूर्व-जीवन समापन के कारण तीव्र जिजीविषा' },
  { en: 'Kaala', hi: 'काल', nature: 'Karmic', mEn: 'Strict karmic ledger & transformative resilience', mHi: 'कठोर कर्म-हिसाब — अनुशासन व तप से महान रूपांतरण' },
  { en: 'Davagni', hi: 'दावाग्नि', nature: 'Karmic', mEn: 'Wildfire intensity—channeling passion into constructive drive', mHi: 'प्रचंड ऊर्जा — इसे रचनात्मक व आध्यात्मिक कार्य में लगाने का सबक' },
  { en: 'Ghora', hi: 'घोर (द्वितीय)', nature: 'Karmic', mEn: 'Battle-tested courage needing peace in this birth', mHi: 'संघर्ष-परीक्षित साहस जिसे अब शांति में ढालना है' },
  { en: 'Yama', hi: 'यम', nature: 'Karmic', mEn: 'Magistrate/enforcer of strict truth & moral order', mHi: 'न्याय, नियम व धर्म-दंड से जुड़े कठोर पूर्व कर्म' },
  { en: 'Kantaka', hi: 'कंटक', nature: 'Karmic', mEn: 'Overcoming envious rivals through quiet steadiness', mHi: 'प्रतिस्पर्धा व शत्रुओं के बीच धैर्य से विजय पाने का अभ्यास' },
  { en: 'Sudha', hi: 'सुधा', nature: 'Benefic', mEn: 'Nectar of pure speech, hospitality & nourishing wisdom', mHi: 'मृदु वाणी, अतिथि-सत्कार व ज्ञान-अमृत का संचय' },
  { en: 'Amrita', hi: 'अमृत (द्वितीय)', nature: 'Benefic', mEn: 'Reviving grace, longevity merit & saintly goodwill', mHi: 'सत्संग, सेवा व दीर्घायु-पुण्य का उच्च संचय' },
  { en: 'Purnachandra', hi: 'पूर्णचंद्र', nature: 'Benefic', mEn: 'Full-moon charm, generosity & public leadership', mHi: 'पूर्ण चंद्र-सम यश, उदारता व जनप्रिय नेतृत्व' },
  { en: 'Vishadagdha', hi: 'विषदग्ध', nature: 'Karmic', mEn: 'Burned by deceit—now mastering discernment & purity', mHi: 'कपट से कष्ट पाया पूर्व जन्म — अब सजग विवेक विकसित होता है' },
  { en: 'Kulanasha', hi: 'कुलनाश', nature: 'Karmic', mEn: 'Ancestral lineage break requiring Pitru Shraddha/healing', mHi: 'वंश-ऋण निवारण हेतु पितृ-तर्पण व परिवार संरक्षण दायित्व' },
  { en: 'Vamshakshaya', hi: 'वंशक्षय', nature: 'Karmic', mEn: 'Prior family duty neglect—now building lasting legacy', mHi: 'पूर्व वंश कर्तव्य सुधार कर सुदृढ़ संतान/परिवार निर्माण का संकल्प' },
  { en: 'Utpata', hi: 'उत्पात', nature: 'Karmic', mEn: 'Sudden upheavals cultivating unshakeable calmness', mHi: 'आकस्मिक उथल-पुथल के अनुभवों से अर्जित धैर्य' },
  { en: 'Kaala', hi: 'काल (द्वितीय)', nature: 'Karmic', mEn: 'Saturnine endurance & philosophical gravity', mHi: 'शनि-सदृश गंभीरता, वैराग्य व समय की गहरी समझ' },
  { en: 'Saumya', hi: 'सौम्य', nature: 'Benefic', mEn: 'Mercury-like intellect, trade diplomacy & peaceful scholarship', mHi: 'बुध-समान मेधा, वाणिज्य कुशलता व शांत विद्वत्ता' },
  { en: 'Komala', hi: 'कोमल (द्वितीय)', nature: 'Benefic', mEn: 'Refined sensitivity, poetry & devotional tenderness', mHi: 'ललित कला, काव्य व भक्तिपूर्ण कोमल हृदय' },
  { en: 'Shitala', hi: 'शीतल', nature: 'Benefic', mEn: 'Cooling presence soothing others’ anger & grief', mHi: 'दूसरों का कष्ट व क्रोध शांत करने वाली शीतल आत्मा' },
  { en: 'Karaladamshtra', hi: 'करालदंष्ट्र', nature: 'Karmic', mEn: 'Severe vow/renunciation or austere guardian duty', mHi: 'कठोर व्रत, तांत्रिक साधना या उग्र रक्षक की भूमिका' },
  { en: 'Chandramukhi', hi: 'चंद्रमुखी', nature: 'Benefic', mEn: 'Radiant demeanour, refined culture & beloved fellowship', mHi: 'सौंदर्य, शालीन संस्कृति व प्रिय जन-सहयोग का पुण्य' },
  { en: 'Praveena', hi: 'प्रवीण', nature: 'Benefic', mEn: 'Master artisan, strategist & multi-skilled polymath', mHi: 'निपुण शिल्पी, रणनीतिकार व बहु-प्रतिभाशाली पूर्व जीवन' },
  { en: 'Kalapavaka', hi: 'कालपावक', nature: 'Karmic', mEn: 'Purifying fire of penance transforming restless ego', mHi: 'तप की अग्नि से अहंकार शुद्धि व आत्म-रूपांतरण' },
  { en: 'Dandayudha', hi: 'दंडायुध', nature: 'Karmic', mEn: 'Officer of law/justice holding strict discipline', mHi: 'न्याय, पुलिस/सेना या अनुशासन-अधिकारी का पूर्व कर्म' },
  { en: 'Nirmala', hi: 'निर्मल', nature: 'Benefic', mEn: 'Spotless conscience, pilgrimage merit & pure intention', mHi: 'निर्मल अंतःकरण, तीर्थ-सेवा व शुद्ध आचरण का फल' },
  { en: 'Saumya', hi: 'सौम्य (द्वितीय)', nature: 'Benefic', mEn: 'Harmonious sage-merchant balancing dharma & artha', mHi: 'धर्म और अर्थ में संतुलन साधने वाला सौम्य व्यक्तित्व' },
  { en: 'Krura', hi: 'क्रूर', nature: 'Karmic', mEn: 'Harsh survival choices needing mercy & seva now', mHi: 'कठोर निर्णयों का पश्चाताप — अब दया व सेवा से कर्म-शुद्धि' },
  { en: 'Atishitala', hi: 'अतिशीतल', nature: 'Benefic', mEn: 'Deep meditative poise, kindness & serene aura', mHi: 'परम शांति, ध्यान व करुणामय आभा का संचय' },
  { en: 'Amrita', hi: 'अमृत (तृतीय)', nature: 'Benefic', mEn: 'Immortal wisdom merit & protection in crises', mHi: 'कठिन संकटों से दैवी रक्षा व अमर सत्कर्मों का बल' },
  { en: 'Payodhi', hi: 'पयोधि', nature: 'Benefic', mEn: 'Oceanic intellect, sea/overseas karma & deep treasury', mHi: 'समुद्र-पार देश, विपुल ज्ञान व धैर्य का महासागर' },
  { en: 'Bhramana', hi: 'भ्रमण', nature: 'Karmic', mEn: 'Wandering ascetic/nomad soul now seeking inner roots', mHi: 'परिव्राजक/यात्री पूर्व जीवन — अब स्थिर आधार व ध्येय की खोज' },
  { en: 'Chandrarekha', hi: 'चंद्ररेखा', nature: 'Benefic', mEn: 'Crescent Shiva grace, intuitive astrology & subtle fame', mHi: 'शिव-चंद्र-कला का आशीर्वाद, ज्योतिष व सूक्ष्म कीर्ति' },
];

export function getShashtiamsaDeity(longitude: number): ShashtiamsaDeityInfo {
  const lon = ((longitude % 360) + 360) % 360;
  const signIdx = Math.floor(lon / 30);
  const degInSign = lon % 30;
  const rawPart = Math.min(59, Math.floor(degInSign * 2));
  const isOdd = signIdx % 2 === 0;
  const deityIdx = isOdd ? rawPart : 59 - rawPart;
  const entry = SHASHTIAMSA_LIST[deityIdx];
  return {
    index: deityIdx + 1,
    nameEn: entry.en,
    nameHi: entry.hi,
    nature: entry.nature,
    meaningEn: entry.mEn,
    meaningHi: entry.mHi,
  };
}

const KETU_HOUSE_PAST_ROLE: Record<number, { en: string; hi: string }> = {
  1: {
    en: 'Solitary philosopher, mystic, or self-reliant seeker who lived largely on personal conviction and spiritual independence.',
    hi: 'आत्मनिर्भर साधक, एकांतप्रिय चिंतक या स्वतंत्र विचारों पर चलने वाला पूर्व जीवन — इस जन्म में साझेदारी सीखना ध्येय है।',
  },
  2: {
    en: 'Born inside an orthodox family, lineage priest/scholar, or treasury custodian steeped in speech, mantras, and heritage customs.',
    hi: 'पारंपरिक कुल, मंत्र-विद्या, वाणी अथवा पारिवारिक कोष से जुड़ा सुसंस्कृत पूर्व जीवन।',
  },
  3: {
    en: 'Courageous scribe, messenger, soldier, or skilled artisan relying on physical bravery, brothers, and constant movement.',
    hi: 'साहसी योद्धा, लेखक, संदेशवाहक या कुशल हस्तशिल्पी, जिसने बाहुबल व भाइयों के संग पुरुषार्थ किया।',
  },
  4: {
    en: 'Deeply rooted landowner, village elder, mother-figure protector, or custodian of ancestral homes and inner peace.',
    hi: 'भूमि-स्वामी, गृह-रक्षक, कृषि या मातृभूमि से गहरे जुड़े शांतिप्रिय पूर्व जीवन।',
  },
  5: {
    en: 'Scholar of mantras, royal counselor, dramatist, or spiritual mentor carrying immense Purva Punya wisdom and devotion.',
    hi: 'मंत्र-शास्त्री, राजगुरु, सलाहकार अथवा विद्वान आचार्य — संचित पूर्व पुण्य व बुद्धि-कौशल से युक्त जन्म।',
  },
  6: {
    en: 'Healer, vaidya, disciplined servant, military medic, or legal debater who mastered overcoming enemies and illness.',
    hi: 'वैद्य, चिकित्सक, सेवक, सैनिक अथवा न्यायिक विवाद सुलझाने वाला अनुशासित पूर्व जीवन।',
  },
  7: {
    en: 'Merchant diplomat, royal consort, or deep partnership figure completely immersed in public alliances and contracts.',
    hi: 'व्यापारिक साझेदार, कूटनीतिज्ञ या गृहस्थ-समर्पित जीवन — पिछले जन्म में संबंधों की गहन परीक्षा पूर्ण की।',
  },
  8: {
    en: 'Occult initiate, tantric yogi, secret researcher, or treasurer who faced sudden transformations and esoteric mysteries.',
    hi: 'गूढ़ तंत्र/योग साधक, गुप्त शोधकर्ता या आकस्मिक जीवन-परिवर्तनों से गुज़री गहन आत्मा।',
  },
  9: {
    en: 'Temple priest, pilgrim, Vedic preceptor, or father-lineage dharma keeper well versed in scriptures and philosophy.',
    hi: 'तीर्थयात्री, वेद-पाठक, आचार्य या धर्म-प्रचारक — धर्म और शास्त्रों में पारंगत पूर्व जन्म।',
  },
  10: {
    en: 'High-ranking administrator, commander, ruler, or civic builder who already tasted public authority and duty.',
    hi: 'उच्च प्रशासक, सेनानायक, शासक या प्रतिष्ठित कर्मयोगी — पूर्व जन्म में सत्ता व पद का अनुभव पूर्ण किया।',
  },
  11: {
    en: 'Guild leader, influential networker, royal patron, or prosperous trader who fulfilled broad social ambitions.',
    hi: 'व्यापार-संघ प्रमुख, धनाढ्य संरक्षक या प्रभावशाली सामाजिक व्यक्ति — सांसारिक लाभ व मित्रता का अनुभव संचित किया।',
  },
  12: {
    en: 'Monastic contemplative, ashram dweller, foreign exile, or hospital/charity servant close to spiritual surrender (Moksha aura).',
    hi: 'आश्रमवासी तपस्वी, दूर-देश साधक या सेवा-निष्ठ संन्यासी — अंतिम समय में गहरी आध्यात्मिक शांति व त्याग का अनुभव।',
  },
};

const RAHU_HOUSE_BECOMING: Record<number, { titleEn: string; titleHi: string; en: string; hi: string }> = {
  1: {
    titleEn: 'Self-Made Pioneer & Original Identity Leader',
    titleHi: 'स्व-निर्मित नेतृत्वकर्ता एवं विशिष्ट व्यक्तित्व',
    en: 'In this birth you grow from relying on others into an unmistakable, fearless self-directed pioneer with magnetic individuality.',
    hi: 'इस जीवन में आप दूसरों की अपेक्षाओं से निकलकर एक निर्भीक, प्रभावशाली और स्व-निर्मित अग्रदूत (Pioneer) बनते हैं।',
  },
  2: {
    titleEn: 'Wealth Builder, Voice of Authority & Lineage Anchor',
    titleHi: 'धन-संरक्षक, प्रभावशाली वक्ता व परिवार-आधार',
    en: 'Your evolution builds tangible family security, commanding speech, culinary/financial acumen, and a respected modern household.',
    hi: 'आपकी जीवन-यात्रा वाणी के प्रभाव, स्थायी धन-संग्रह और एक सम्मानित पारिवारिक आधार के निर्माण की ओर अग्रसर होती है।',
  },
  3: {
    titleEn: 'Master Communicator, Strategist & Digital/Media Creator',
    titleHi: 'प्रखर संचारक, रणनीतिकार व पराक्रमी उद्यमी',
    en: 'You mature into a bold communicator, writer, marketer, or entrepreneur who converts fearless initiative into wide reach.',
    hi: 'आप साहसिक पहल, लेखन, मीडिया, डिजिटल माध्यम व स्व-पराक्रम के धनी कुशल उद्यमी व संवाद-विशेषज्ञ बनते हैं।',
  },
  4: {
    titleEn: 'Estate Owner, Protector & Sanctuary Creator',
    titleHi: 'भवन-भूमि स्वामी, शांति-आश्रय निर्माता',
    en: 'After early worldly restlessness, life draws you toward real estate, homeland comfort, emotional depth, and anchoring others.',
    hi: 'प्रारंभिक भागदौड़ के बाद आप भूमि, संपत्ति, मातृसुख व लोगों को आश्रय देने वाले शांत गृह-आधार के स्वामी बनते हैं।',
  },
  5: {
    titleEn: 'Visionary Mentor, Creative Strategist & Renowned Advisor',
    titleHi: 'दूरदर्शी मार्गदर्शक, सृजनशील गुरु व प्रख्यात सलाहकार',
    en: 'Your highest growth comes through bold creative intelligence, teaching, speculative wisdom, leadership mentorship, and proud progeny.',
    hi: 'रचनात्मक मेधा, शिक्षा, मंत्रणा, नेतृत्व व संतान-उन्नति के माध्यम से आप एक प्रतिष्ठित विचारक/गुरु रूप में प्रतिष्ठित होते हैं।',
  },
  6: {
    titleEn: 'Problem-Solver, Healer, Legal/Administrative Victor',
    titleHi: 'विजयी चिकित्सक, प्रशासक व संकटमोचक',
    en: 'You become an unstoppable problem-solver—excelling in medicine, litigation, analytics, or disciplined service that defeats obstacles.',
    hi: 'रोग, ऋण व प्रतिस्पर्धा पर विजय पाकर आप चिकित्सा, विधि, प्रशासन या सेवा-क्षेत्र के अपराजेय विशेषज्ञ बनते हैं।',
  },
  7: {
    titleEn: 'Public Bridge-Builder, Global Partner & Negotiator',
    titleHi: 'लोक-संपर्क सेतु, वैश्विक साझेदार व कूटनीतिज्ञ',
    en: 'Moving beyond solitary detachment, you become a sought-after partner, international negotiator, public diplomat, or brand builder.',
    hi: 'एकाकी प्रवृत्ति से बाहर आकर आप अंतर्राष्ट्रीय साझेदारी, व्यापारिक समझौते और जन-संपर्क के प्रमुख केंद्र बनते हैं।',
  },
  8: {
    titleEn: 'Master of Transformation, Research & Hidden Wealth',
    titleHi: 'गहन शोधकर्ता, रूपांतरण-ज्ञाता व गुप्त-विद्या विशेषज्ञ',
    en: 'You evolve into a fearless investigator—unlocking finance, insurance, psychology, Occult/Jyotish, surgery, or deep crisis mastery.',
    hi: 'गूढ़ अनुसंधान, चिकित्सा/शल्य, वित्त-प्रबंधन, मनोविज्ञान या ज्योतिष के क्षेत्र में आप असाधारण गहराई प्राप्त करते हैं।',
  },
  9: {
    titleEn: 'Global Dharmic Teacher, Author & Cross-Cultural Sage',
    titleHi: 'वैश्विक धर्म-चिंतक, लेखक व संस्कृति-संवाहक',
    en: 'Your arc rises toward publishing, higher law, international travel, philosophical synthesis, and guiding broader society beyond dogma.',
    hi: 'उच्च शिक्षा, दूर-देश प्रवास, लेखन व रूढ़ि-मुक्त विश्व-धर्म दर्शन के माध्यम से आप एक सम्मानित मार्गदर्शक बनते हैं।',
  },
  10: {
    titleEn: 'Public Architect, Executive Authority & Legacy Builder',
    titleHi: 'सार्वजनिक शिखर-निर्माता, शीर्ष अधिकारी व कीर्ति-स्तंभ',
    en: 'Rahu in the 10th shapes you into a prominent public figure, industrialist, or institutional chief whose karma leaves historic impact.',
    hi: 'दशमस्थ राहु आपको उच्च प्रशासन, विशाल उद्योग या सामाजिक प्रतिष्ठा के शीर्ष पर ले जाकर ऐतिहासिक कर्म-कीर्ति दिलाता है।',
  },
  11: {
    titleEn: 'Mass Influencer, Wealth Multiplier & Patron of Networks',
    titleHi: 'जन-प्रभावक, आय-विस्तारक व बड़े नेटवर्क के सूत्रधार',
    en: 'You mature into a connector of large organizations, humanitarian movements, and scalable wealth channels bringing enduring gains.',
    hi: 'विशाल संगठनों, लाभदायक नेटवर्क और जन-आंदोलनों के केंद्र बनकर आप विपुल समृद्धि व मित्र-मंडली अर्जित करते हैं।',
  },
  12: {
    titleEn: 'Cosmopolitan Mystic, Humanitarian & Liberated Seeker',
    titleHi: 'विश्व-यात्री साधक, परोपकारी व मोक्ष-उन्मुख मनीषी',
    en: 'Life matures you across foreign lands, sanctuaries, charities, or meditative seclusion into transcendent compassion and inner freedom.',
    hi: 'विदेश संपर्क, परोपकार, अस्पताल/आश्रम सेवा व ध्यान के मार्ग से आप मोह-मुक्त, करुणामय मनीषी बनते हैं।',
  },
};

function getHouseLord(chart: ChartData, house: number): BodyPosition {
  const signIdx = (chart.ascendant.signIndex + house - 1) % 12;
  const lord = SIGNS[signIdx].lord;
  return chart.planets.find((p) => p.id === lord)!;
}

export function computePastFutureLifeReading(chart: ChartData): PastFutureLifeReport | null {
  if (evaluateParamayusStatus(chart).exceeded) {
    return null;
  }
  const ascSign = chart.ascendant.signIndex;
  const ketu = chart.planets.find((p) => p.id === 'Ketu')!;
  const rahu = chart.planets.find((p) => p.id === 'Rahu')!;
  const saturn = chart.planets.find((p) => p.id === 'Saturn')!;
  const jupiter = chart.planets.find((p) => p.id === 'Jupiter')!;
  const moon = chart.planets.find((p) => p.id === 'Moon')!;
  const sun = chart.planets.find((p) => p.id === 'Sun')!;
  const ak =
    chart.planets.find((p) => p.charaKaraka === 'AK') ??
    [...chart.planets]
      .filter((p) => SEVEN_PLANETS.includes(p.id as SevenPlanetId))
      .sort((a, b) => b.degreeInSign - a.degreeInSign)[0];

  const l1 = getHouseLord(chart, 1);
  const l5 = getHouseLord(chart, 5);
  const l9 = getHouseLord(chart, 9);
  const l10 = getHouseLord(chart, 10);
  const l12 = getHouseLord(chart, 12);

  // Varga Placements
  const d60 = chart.divisionalCharts.D60;
  const d12 = chart.divisionalCharts.D12;
  const d20 = chart.divisionalCharts.D20;
  const d10 = chart.divisionalCharts.D10;
  const d9 = chart.divisionalCharts.D9;

  const d60LagnaDeity = getShashtiamsaDeity(chart.ascendant.longitude);
  const d60KetuDeity = getShashtiamsaDeity(ketu.longitude);
  const d60AkDeity = getShashtiamsaDeity(ak.longitude);

  const d60LagnaLordId = SIGNS[d60.lagnaSignIndex].lord;
  const d60LagnaLord = d60.placements.find((p) => p.id === d60LagnaLordId)!;
  const d60Ketu = d60.placements.find((p) => p.id === 'Ketu')!;
  const d60Ak = d60.placements.find((p) => p.id === ak.id)!;

  const d12Moon = d12.placements.find((p) => p.id === 'Moon')!;
  const d12Sun = d12.placements.find((p) => p.id === 'Sun')!;
  const d20Jup = d20.placements.find((p) => p.id === 'Jupiter')!;
  const d10Lord = d10.placements.find((p) => p.id === SIGNS[d10.lagnaSignIndex].lord)!;
  const d60LagnaName = SIGNS[d60.lagnaSignIndex].name;
  const d12LagnaName = SIGNS[d12.lagnaSignIndex].name;
  const d20LagnaName = SIGNS[d20.lagnaSignIndex].name;
  const d10LagnaName = SIGNS[d10.lagnaSignIndex].name;
  const d9LagnaName = SIGNS[d9.lagnaSignIndex].name;

  // Retrograde planets indicate strong unresolved karmic vows from prior incarnation
  const retros = chart.planets.filter(
    (p) => p.isRetrograde && SEVEN_PLANETS.includes(p.id as SevenPlanetId)
  );

  // ===================== 1. PAST LIFE READING =====================
  const ketuH = KETU_HOUSE_PAST_ROLE[ketu.rasiHouseNumber] ?? KETU_HOUSE_PAST_ROLE[1];
  const ketuDispId = SIGNS[ketu.signIndex].lord;
  const ketuDisp = chart.planets.find((p) => p.id === ketuDispId)!;

  const headlineEn = `Purva Janma Root: ${d60LagnaDeity.nameEn} Shashtiamsa · Ketu in ${ketu.signName} (H${ketu.rasiHouseNumber})`;
  const headlineHi = `पूर्व जन्म सूत्र: ${d60LagnaDeity.nameHi} षष्ट्यंश · केतु ${SIGN_HI[ketu.signIndex]} (${ketu.rasiHouseNumber}वें भाव)`;

  const previousRoleAndStationEn = `Primary Indicator — Ketu in House ${ketu.rasiHouseNumber} (${ketu.signName}, ${ketu.nakshatraName}) & D60 Lagna in ${d60LagnaName} (${d60LagnaDeity.nameEn} Shashtiamsa): ${ketuH.en} Ketu's sign lord ${ketuDispId} placed in H${ketuDisp.rasiHouseNumber} (${ketuDisp.dignity}) shaped your past-life craft, while D60 Lagna lord ${d60LagnaLordId} in D60 H${d60LagnaLord.houseFromVargaLagna} reveals a ${SIGNS[ketu.signIndex].element}-element culture (${d60LagnaName} D60 imprint).`;
  const previousRoleAndStationHi = `मुख्य आधार — ${ketu.rasiHouseNumber}वें भाव (${SIGN_HI[ketu.signIndex]} राशि, ${ketu.nakshatraName} नक्षत्र) में केतु तथा D60 लग्न ${SIGN_HI[d60.lagnaSignIndex]} (${d60LagnaDeity.nameHi} षष्ट्यंश): ${ketuH.hi} केतु-स्वामी ${PLANET_HI[ketuDispId]} का ${ketuDisp.rasiHouseNumber}वें भाव में होना पिछले जन्म के कार्य-क्षेत्र और ${SIGN_HI[d60.lagnaSignIndex]} षष्ट्यंश प्रभाव को दर्शाता है।`;

  const purvaPunyaCarriedEn = `5th House (${SIGNS[(ascSign + 4) % 12].name}, Purva Punya Bhava) lord ${l5.id} sits in H${l5.rasiHouseNumber} (${l5.dignity}), and 9th Lord (past dharma) ${l9.id} sits in H${l9.rasiHouseNumber} (${l9.dignity}). In D60, Atmakaraka ${ak.id} occupies ${d60Ak.signName} (${d60AkDeity.nameEn} Deva-portion: ${d60AkDeity.meaningEn}). In D20 Vimsamsa (${d20LagnaName} Lagna, Jupiter in D20 H${d20Jup.houseFromVargaLagna}), your soul retains innate spiritual memory, intuitive mantra affinity, and effortless mastery over ${l5.id}/${ak.id} subjects.`;
  const purvaPunyaCarriedHi = `पूर्व पुण्य भाव (पंचम) के स्वामी ${PLANET_HI[l5.id]} ${l5.rasiHouseNumber}वें भाव में तथा भाग्येश (नवमेश) ${PLANET_HI[l9.id]} ${l9.rasiHouseNumber}वें भाव में हैं। षष्ट्यंश (D60) में आत्मकारक ${PLANET_HI[ak.id]} (${d60AkDeity.nameHi} भाग) एवं विशांश (D20) लग्न ${SIGN_HI[d20.lagnaSignIndex]} आपके संचित मंत्र-पुण्य, दैवी श्रद्धा व स्वाभाविक प्रतिभाओं के प्रमाण हैं (${d60AkDeity.meaningHi})।`;

  const retroTextEn =
    retros.length > 0
      ? `Retrograde Karma Seal: ${retros.map((r) => `${r.id} (H${r.rasiHouseNumber})`).join(', ')} are retrograde, signaling unfinished promises, repeated life tests, or deep perfectionism carried straight from past birth to settle now.`
      : `No inner retrograde backlog among the 7 planets—karmic ledger moves forward cleanly through present initiative and Saturn (H${saturn.rasiHouseNumber}, ${saturn.dignity}).`;
  const retroTextHi =
    retros.length > 0
      ? `वक्री ग्रह (अधूरे पूर्व संकल्प): कुंडली में ${retros.map((r) => `${PLANET_HI[r.id]} (भाव ${r.rasiHouseNumber})`).join(', ')} वक्री हैं — ये पूर्व जन्म के वे अधूरे कर्तव्य व संबंध हैं जिन्हें इस जन्म में धैर्य व निष्ठा से पूरा करना है।`
      : `सप्तग्रहों में वक्री भार न होने से पुराने कर्म-ऋण भारी नहीं हैं; शनि (${saturn.rasiHouseNumber}वें भाव) वर्तमान कर्म-निष्ठा से मार्ग प्रशस्त करते हैं।`;

  const unfinishedKarmaAndDebtsEn = `${retroTextEn} Karmic Shashtiamsa Point: D60 Lagna holds ${d60LagnaDeity.nameEn} (${d60LagnaDeity.meaningEn}); D60 Ketu falls in ${d60KetuDeity.nameEn} (${d60KetuDeity.meaningEn}). Current birth pulls the soul away from over-relying on H${ketu.rasiHouseNumber} (${ketu.signName}) toward mastering H${rahu.rasiHouseNumber} (${rahu.signName}).`;
  const unfinishedKarmaAndDebtsHi = `${retroTextHi} D60 लग्न ${d60LagnaDeity.nameHi} (${d60LagnaDeity.meaningHi}) तथा D60 केतु ${d60KetuDeity.nameHi} (${d60KetuDeity.meaningHi}) के अनुसार, आत्मा को भाव ${ketu.rasiHouseNumber} की पुरानी आदतों से ऊपर उठकर भाव ${rahu.rasiHouseNumber} (${SIGN_HI[rahu.signIndex]}) के नए अनुभव सीखने हैं।`;

  const ancestralD12ConnectionEn = `D12 Dwadasamsa Lagna rises in ${d12LagnaName}, with Moon in D12 H${d12Moon.houseFromVargaLagna} and Sun in D12 H${d12Sun.houseFromVargaLagna}. You incarnated into your present family lineage to resolve mutual Pitru/Matru Rina, elevate family dharma, and continue ancestral blessings begun generations earlier.`;
  const ancestralD12ConnectionHi = `द्वादशांश (D12) लग्न ${SIGN_HI[d12.lagnaSignIndex]} में तथा चंद्र H${d12Moon.houseFromVargaLagna} / सूर्य H${d12Sun.houseFromVargaLagna} में होने से आपका वर्तमान कुल-परिवार पूर्वजन्म के पितृ व पारिवारिक पुण्य-ऋण से जुड़ा है — इसी वंश में जन्म लेकर पूर्व अधूरे पारिवारिक संकल्प पूर्ण करने का योग बना।`;

  const h12Sign = (ascSign + 11) % 12;
  const h12Occ = chart.planets.filter((p) => p.rasiHouseNumber === 12);
  const pastLifeExitAndMemoryEn = `12th House (${SIGNS[h12Sign].name}, Exit of Past Cycle) ruled by ${l12.id} (in H${l12.rasiHouseNumber})${
    h12Occ.length ? ` with ${h12Occ.map((x) => x.id).join(', ')} inside H12` : ''
  } shows the prior birth closed in ${
    [9, 12].includes(l12.rasiHouseNumber) || h12Occ.some((x) => x.id === 'Jupiter' || x.id === 'Ketu')
      ? 'quiet contemplation, prayer, or spiritual detachment'
      : [4, 2].includes(l12.rasiHouseNumber)
        ? 'close family care, homeland loyalty, and lingering affection'
        : 'active worldly transition or distant relocation with unfulfilled ambitions'
  }. Subconscious Moon (${moon.signName}) carries calm intuition alongside instinctive caution around H${ketu.rasiHouseNumber} themes.`;
  const pastLifeExitAndMemoryHi = `द्वादश भाव (${SIGN_HI[h12Sign]} — पूर्व जन्म का अंतिम अध्याय) के स्वामी ${PLANET_HI[l12.id]} (${l12.rasiHouseNumber}वें भाव)${
    h12Occ.length ? ` व स्थित ग्रह ${h12Occ.map((x) => PLANET_HI[x.id]).join(', ')}` : ''
  } दर्शाते हैं कि पिछला जीवन ${
    [9, 12].includes(l12.rasiHouseNumber) || h12Occ.some((x) => x.id === 'Jupiter' || x.id === 'Ketu')
      ? 'धार्मिक चिंतन, तीर्थ/प्रार्थना और शांत वैराग्य भाव में समाप्त हुआ।'
      : [4, 2].includes(l12.rasiHouseNumber)
        ? 'परिवार, जन्मभूमि और अपनों के प्रति गहरे स्नेह-भाव में पूर्ण हुआ।'
        : 'सक्रिय कर्म-संघर्ष, प्रवास या अधूरी महत्वाकांक्षाओं के साथ परिवर्तित हुआ।'
  } जन्म चंद्र (${SIGN_HI[moon.signIndex]}) के कारण अंतर्मन में आज भी वही सूक्ष्म स्मृति व सहज अंतर्ज्ञान विद्यमान है।`;

  const pastFactors: PastFutureChartFactor[] = [
    {
      chartCode: 'D60',
      factorEn: 'Shashtiamsa Lagna & Deity',
      factorHi: 'षष्ट्यंश लग्न व देवता',
      placementEn: `${d60LagnaName} (${d60LagnaDeity.nameEn} #${d60LagnaDeity.index})`,
      placementHi: `${SIGN_HI[d60.lagnaSignIndex]} (${d60LagnaDeity.nameHi} #${d60LagnaDeity.index})`,
      insightEn: d60LagnaDeity.meaningEn,
      insightHi: d60LagnaDeity.meaningHi,
    },
    {
      chartCode: 'D60',
      factorEn: 'Ketu & AK in Shashtiamsa',
      factorHi: 'D60 में केतु व आत्मकारक',
      placementEn: `Ketu: ${d60Ketu.signName} (${d60KetuDeity.nameEn}) · AK ${ak.id}: ${d60Ak.signName}`,
      placementHi: `केतु: ${SIGN_HI[d60Ketu.signIndex]} (${d60KetuDeity.nameHi}) · AK ${PLANET_HI[ak.id]}: ${SIGN_HI[d60Ak.signIndex]}`,
      insightEn: `Past-life skill imprint (${d60KetuDeity.meaningEn}).`,
      insightHi: `पूर्व संचित कौशल (${d60KetuDeity.meaningHi})।`,
    },
    {
      chartCode: 'D1',
      factorEn: 'Ketu (Past Mastery Node)',
      factorHi: 'केतु (पूर्व जन्म संचय)',
      placementEn: `H${ketu.rasiHouseNumber} · ${ketu.signName} (${ketu.nakshatraName})`,
      placementHi: `${ketu.rasiHouseNumber}वां भाव · ${SIGN_HI[ketu.signIndex]} (${ketu.nakshatraName})`,
      insightEn: ketuH.en,
      insightHi: ketuH.hi,
    },
    {
      chartCode: 'D1',
      factorEn: 'H5 (Purva Punya) & H9 Lords',
      factorHi: 'पंचम (पूर्व पुण्य) व नवमेश',
      placementEn: `L5 ${l5.id} in H${l5.rasiHouseNumber} · L9 ${l9.id} in H${l9.rasiHouseNumber}`,
      placementHi: `पंचमेश ${PLANET_HI[l5.id]} (H${l5.rasiHouseNumber}) · नवमेश ${PLANET_HI[l9.id]} (H${l9.rasiHouseNumber})`,
      insightEn: `Dignity ${l5.dignity} / ${l9.dignity} governs effortless grace & lineage luck.`,
      insightHi: `${l5.dignity} / ${l9.dignity} बल से पूर्वजन्म के पुण्य व विद्या सहज मिलते हैं।`,
    },
    {
      chartCode: 'D12',
      factorEn: 'Dwadasamsa (Ancestral Lineage)',
      factorHi: 'द्वादशांश (वंश व पितृ कर्म)',
      placementEn: `D12 Lagna ${d12LagnaName} · Moon H${d12Moon.houseFromVargaLagna}`,
      placementHi: `D12 लग्न ${SIGN_HI[d12.lagnaSignIndex]} · चंद्र H${d12Moon.houseFromVargaLagna}`,
      insightEn: ancestralD12ConnectionEn,
      insightHi: ancestralD12ConnectionHi,
    },
    {
      chartCode: 'D20',
      factorEn: 'Vimsamsa (Previous Sadhana)',
      factorHi: 'विशांश (पूर्व आध्यात्मिक साधना)',
      placementEn: `D20 Lagna ${d20LagnaName} · Jupiter D20 H${d20Jup.houseFromVargaLagna}`,
      placementHi: `D20 लग्न ${SIGN_HI[d20.lagnaSignIndex]} · गुरु D20 H${d20Jup.houseFromVargaLagna}`,
      insightEn: `Prior-life worship temperament & spiritual capacity carried into present devotion.`,
      insightHi: `पिछले जन्म की उपासना, मंत्र-जप और आध्यात्मिक परिपक्वता को दर्शाता है।`,
    },
  ];

  // ===================== 2. FUTURE BECOMING (THIS LIFE APEX + NEXT BIRTH GATI) =====================
  const rahuRole = RAHU_HOUSE_BECOMING[rahu.rasiHouseNumber] ?? RAHU_HOUSE_BECOMING[1];
  const akD9 = d9.placements.find((p) => p.id === ak.id)!;
  const h12FromKaraSign = (akD9.signIndex + 11) % 12;
  const h12FromKaraOcc = d9.placements.filter((p) => p.id !== 'Asc' && p.signIndex === h12FromKaraSign);
  const h12KaraLord = SIGNS[h12FromKaraSign].lord;

  const strongJupiterOrKetuGati =
    h12FromKaraOcc.some((p) => p.id === 'Ketu' || p.id === 'Jupiter') ||
    h12Occ.some((p) => p.id === 'Ketu' || p.id === 'Jupiter') ||
    ['Jupiter', 'Venus', 'Moon'].includes(l12.id) && d60LagnaDeity.nature === 'Benefic';

  const beneficD12th =
    h12Occ.some((p) => ['Jupiter', 'Venus', 'Moon', 'Mercury'].includes(p.id)) ||
    [1, 4, 5, 7, 9, 10, 12].includes(l12.rasiHouseNumber) ||
    h12KaraLord === 'Jupiter' ||
    h12KaraLord === 'Venus';

  let nextTier: FutureBecomingReading['nextBirthGatiTier'] = 'Active Karmic Mastery';
  let nextLokaEn = '';
  let nextLokaHi = '';
  let futureIncEn = '';
  let futureIncHi = '';

  const ketuIn12Kara = h12FromKaraOcc.some((p) => p.id === 'Ketu') || ketu.rasiHouseNumber === 12;
  if (ketuIn12Kara && (jupiter.rasiHouseNumber === 1 || [5, 9, 12].includes(jupiter.rasiHouseNumber) || d60LagnaDeity.nature === 'Benefic')) {
    nextTier = 'High Spiritual / Liberation Focus';
    nextLokaEn = 'Kaivalya / Moksha-Oriented Ascent (Devaloka / Illuminated Sanctuary)';
    nextLokaHi = 'मोक्ष / कैवल्य उन्मुख ऊर्ध्व गति (देवलोक एवं उच्च आध्यात्मिक लोक)';
    futureIncEn = `Jaimini 12th-from-Karakamsa (${SIGNS[h12FromKaraSign].name}) hosts Ketu/spiritual grace alongside D20 ${d20LagnaName} and D60 ${d60LagnaDeity.nameEn}. After completing present karmic duties, the soul gravitates powerfully toward liberation, or—if choosing rebirth out of seva—as a revered guru/saint or contemplative adept.`;
    futureIncHi = `जैमिनी नियम से कारकांश (${SIGN_HI[akD9.signIndex]}) से 12वें भाव (${SIGN_HI[h12FromKaraSign]}) में केतु/शुभ प्रभाव तथा D20/D60 बल के कारण वर्तमान कर्तव्य पूर्ण करने के बाद आत्मा मोक्ष-मार्ग या परम सात्विक देवलोक/सद्गुरु रूप में उच्चतर गति प्राप्त करती है।`;
  } else if (strongJupiterOrKetuGati || beneficD12th) {
    nextTier = 'Noble & Scholarly Progression';
    nextLokaEn = 'Shubha Punya Loka / Noble, Wise & Cultured Rebirth (Higher Manushya-Loka / Pitri-Loka)';
    nextLokaHi = 'शुभ पुण्य लोक / विद्वान, धर्मपरायण एवं सुसंस्कृत भविष्य जन्म';
    futureIncEn = `Benefic support across D1 H12 (Lord ${l12.id} in H${l12.rasiHouseNumber}) and D9 Karakamsa 12th (${SIGNS[h12FromKaraSign].name}, lord ${h12KaraLord}) points toward a pious upward ascent. Unfulfilled H${rahu.rasiHouseNumber} (${rahu.signName}) aspirations evolve into future birth with natural wisdom, ethical authority, and harmonious prosperity.`;
    futureIncHi = `द्वादश भाव (स्वामी ${PLANET_HI[l12.id]}), कारकांश से 12वां स्थान (${SIGN_HI[h12FromKaraSign]}, स्वामी ${PLANET_HI[h12KaraLord]}) व शुभ षष्ट्यंश दर्शाते हैं कि भविष्य यात्रा पुण्यमयी होगी — अगले चरण में उच्च शिक्षा, सम्मान, करुणा और धन-समृद्धि से युक्त जन्म प्राप्त होता है।`;
  } else if (sun.dignity === 'Exalted' || sun.dignity === 'Own Sign' || [1, 4, 7, 10].includes(l10.rasiHouseNumber)) {
    nextTier = 'Dharmic Leadership / Builder Return';
    nextLokaEn = 'Karmayogi Return (Civic Builder, Protector, Strategist)';
    nextLokaHi = 'कर्मयोगी पुनरावर्तन (राष्ट्र-निर्माता, प्रशासक व मार्गदर्शक)';
    futureIncEn = `Strong 10th/Kendra momentum (L10 ${l10.id} in H${l10.rasiHouseNumber}, D10 Lagna ${d10LagnaName}) shows the soul will keep mastering real-world creation, leadership, and institutions—returning or evolving as a capable architect of collective welfare.`;
    futureIncHi = `दशम भाव व दशमांश (D10 लग्न ${SIGN_HI[d10.lagnaSignIndex]}) के प्रबल कर्मयोग से आप भविष्य की यात्रा में भी समाज-निर्माण, नेतृत्व, प्रशासन व बड़े संस्थानों का संचालन करने वाली कर्मठ आत्मा के रूप में आगे बढ़ेंगे।`;
  } else {
    nextTier = 'Active Karmic Mastery';
    nextLokaEn = 'Manushya Loka Evolution — Learning Through Rahu H' + rahu.rasiHouseNumber;
    nextLokaHi = `मनुष्य लोक विकास — भाव ${rahu.rasiHouseNumber} (${SIGN_HI[rahu.signIndex]}) अनुभव पूर्णता`;
    futureIncEn = `Where desires of Rahu in H${rahu.rasiHouseNumber} (${rahu.signName}) remain hungry at life's close, the soul carries those exact ambitions forward into its next educational chapter—moving progressively closer to wisdom (H9/H12 balance).`;
    futureIncHi = `जीवन के अंत में भाव ${rahu.rasiHouseNumber} (${SIGN_HI[rahu.signIndex]}) के राहु से जुड़ी जो अधूरी इच्छाएँ शेष रहती हैं, आत्मा उन्हीं अनुभवों को साधने हेतु अगला जन्म लेकर क्रमशः उच्च ज्ञान व मोक्ष की ओर अग्रसर होती है।`;
  }

  const thisLifeMaturityEn = `This-Life Becoming Trajectory: Driven by Rahu in H${rahu.rasiHouseNumber} (${rahu.signName}, ${rahu.nakshatraName}), D9 Navamsa Lagna ${d9LagnaName}, and Atmakaraka ${ak.id} (Karakamsa ${d9.placements.find((p) => p.id === ak.id)?.signName}). ${rahuRole.en} As you cross ages 36–60, Lagna Lord ${l1.id} and Saturn (H${saturn.rasiHouseNumber}) crystallize your core persona from early experimentation into ${rahuRole.titleEn}.`;
  const thisLifeMaturityHi = `इस जीवन का विकास-पथ: राहु भाव ${rahu.rasiHouseNumber} (${SIGN_HI[rahu.signIndex]}), नवांश लग्न ${SIGN_HI[d9.lagnaSignIndex]} व कारकांश ${SIGN_HI[akD9.signIndex]} के संयोग से — ${rahuRole.hi} आयु के 36 से 60 वर्षों के बीच लग्नेश ${PLANET_HI[l1.id]} व शनि आपको परिपक्व कर '${rahuRole.titleHi}' के रूप में स्थापित करते हैं।`;

  const careerAndLegacyApexEn = `Public Stature & What You Leave Behind (D10 ${d10LagnaName}, D10 Lagna Lord in H${d10Lord.houseFromVargaLagna}): Peak leadership/career stature gathers around your 10th-lord (${l10.id} in H${l10.rasiHouseNumber}) and D9 mature years, evolving from personal achievement toward mentoring others and institutional goodwill.`;
  const careerAndLegacyApexHi = `कर्म शिखर व स्थायी विरासत (D10 लग्न ${SIGN_HI[d10.lagnaSignIndex]}, दशमेश ${PLANET_HI[l10.id]} भाव ${l10.rasiHouseNumber} में): जीवन के उत्तरार्ध में आप व्यक्तिगत सफलता से ऊपर उठकर दूसरों के मार्गदर्शक, संस्था-निर्माता या सम्मानित कुल-प्रमुख बनते हैं।`;

  const sadhanaToElevateEn = `To elevate both late-life fulfillment and next-birth Gati: nurture 12th-house charity (${l12.id} Daan & selfless seva), honor your D9 Karakamsa Ishta-Devata daily, avoid over-attachment to H${rahu.rasiHouseNumber} illusions, and channel ${ak.id} virtues truthfully.`;
  const sadhanaToElevateHi = `वर्तमान जीवन व आगामी गति को सर्वोच्च बनाने हेतु: द्वादशेश ${PLANET_HI[l12.id]} से संबंधित निष्काम दान-सेवा करें, कारकांश इष्टदेव का नियमित ध्यान जप करें तथा आत्मकारक ${PLANET_HI[ak.id]} के सद्गुणों को आचरण में उतारें।`;

  const futureFactors: PastFutureChartFactor[] = [
    {
      chartCode: 'D1',
      factorEn: 'Rahu (Future Becoming Compass)',
      factorHi: 'राहु (भविष्य विकास दिशा)',
      placementEn: `H${rahu.rasiHouseNumber} · ${rahu.signName} (${rahu.nakshatraName})`,
      placementHi: `${rahu.rasiHouseNumber}वां भाव · ${SIGN_HI[rahu.signIndex]} (${rahu.nakshatraName})`,
      insightEn: rahuRole.titleEn,
      insightHi: rahuRole.titleHi,
    },
    {
      chartCode: 'D9',
      factorEn: 'Karakamsa & 12th from AK',
      factorHi: 'कारकांश (D9 AK) व उससे 12वां भाव',
      placementEn: `AK ${ak.id} in ${d9.placements.find((p) => p.id === ak.id)!.signName} → 12th ${SIGNS[h12FromKaraSign].name}`,
      placementHi: `AK ${PLANET_HI[ak.id]} (${SIGN_HI[akD9.signIndex]}) → 12वां ${SIGN_HI[h12FromKaraSign]}`,
      insightEn: `Lord ${h12KaraLord}${h12FromKaraOcc.length ? ` + ${h12FromKaraOcc.map((x) => x.id).join(', ')}` : ''} defines spiritual ascent & Punarjanma direction.`,
      insightHi: `स्वामी ${PLANET_HI[h12KaraLord]}${h12FromKaraOcc.length ? ` व ${h12FromKaraOcc.map((x) => PLANET_HI[x.id]).join(', ')}` : ''} आत्मा की अगली गति निर्धारित करते हैं।`,
    },
    {
      chartCode: 'D10',
      factorEn: 'Dasamsa (Mature Stature Apex)',
      factorHi: 'दशमांश (D10 कर्म-शिखर)',
      placementEn: `D10 Lagna ${d10LagnaName} · D1 L10 ${l10.id} (H${l10.rasiHouseNumber})`,
      placementHi: `D10 लग्न ${SIGN_HI[d10.lagnaSignIndex]} · L10 ${PLANET_HI[l10.id]} (H${l10.rasiHouseNumber})`,
      insightEn: `Defines the lasting public title, mastery & legacy you grow into.`,
      insightHi: `यह दर्शाता है कि कर्मक्षेत्र में आप जीवन के अंततः किस पद और प्रतिष्ठा को प्राप्त करेंगे।`,
    },
    {
      chartCode: 'D1',
      factorEn: '12th House (Exit & Next-Life Door)',
      factorHi: 'द्वादश भाव (प्रस्थान व आगामी जन्म द्वार)',
      placementEn: `${SIGNS[h12Sign].name} (Lord ${l12.id} in H${l12.rasiHouseNumber})`,
      placementHi: `${SIGN_HI[h12Sign]} (स्वामी ${PLANET_HI[l12.id]} H${l12.rasiHouseNumber} में)`,
      insightEn: `Primary classical indicator of future loka & peaceful release.`,
      insightHi: `भविष्य गति, शयन-सुख और अंतिम शांति का प्रमुख पाराशरी संकेतक।`,
    },
  ];

  return {
    pastLife: {
      headlineEn,
      headlineHi,
      shashtiamsaDeityEn: `${d60LagnaDeity.nameEn} Shashtiamsa (#${d60LagnaDeity.index}/60 · ${d60LagnaDeity.nature})`,
      shashtiamsaDeityHi: `${d60LagnaDeity.nameHi} षष्ट्यंश (#${d60LagnaDeity.index}/60 · ${d60LagnaDeity.nature === 'Benefic' ? 'शुभ देव-भाग' : 'कर्म-परीक्षा भाग'})`,
      shashtiamsaNature: d60LagnaDeity.nature,
      previousRoleAndStationEn,
      previousRoleAndStationHi,
      purvaPunyaCarriedEn,
      purvaPunyaCarriedHi,
      unfinishedKarmaAndDebtsEn,
      unfinishedKarmaAndDebtsHi,
      ancestralD12ConnectionEn,
      ancestralD12ConnectionHi,
      pastLifeExitAndMemoryEn,
      pastLifeExitAndMemoryHi,
      chartFactors: pastFactors,
    },
    futureBecoming: {
      headlineEn: `Future Arc: ${rahuRole.titleEn} · ${nextLokaEn.split('(')[0].trim()}`,
      headlineHi: `भविष्य रूपांतरण: ${rahuRole.titleHi} · ${nextLokaHi.split('(')[0].trim()}`,
      archetypeEn: rahuRole.titleEn,
      archetypeHi: rahuRole.titleHi,
      thisLifeMaturityEn,
      thisLifeMaturityHi,
      careerAndLegacyApexEn,
      careerAndLegacyApexHi,
      nextBirthGatiTier: nextTier,
      nextBirthLokaEn: nextLokaEn,
      nextBirthLokaHi: nextLokaHi,
      futureIncarnationProfileEn: futureIncEn,
      futureIncarnationProfileHi: futureIncHi,
      sadhanaToElevateEn,
      sadhanaToElevateHi,
      chartFactors: futureFactors,
    },
  };
}
