import { NINE_GRAHAS, SEVEN_PLANETS, SIGNS } from '../constants';
import type { BodyPosition, ChartData, NineGrahaId, SevenPlanetId } from '../types';
import { getFunctionalLordship } from './functionalLordship';

export type PredictionBodyId = NineGrahaId | 'Asc';

export interface PlanetInSignPrediction {
  planet: PredictionBodyId;
  signIndex: number;
  signNameEn: string;
  signNameHi: string;
  signLord: string;
  elementEn: string;
  elementHi: string;
  houseNumber: number;
  dignity: string;
  degreeDms: string;
  isRetrograde: boolean;
  isCombust: boolean;
  headlineEn: string;
  headlineHi: string;
  readingEn: string;
  readingHi: string;
  positiveEn: string;
  positiveHi: string;
  cautionEn: string;
  cautionHi: string;
  peakDecade: string;
  fruitionAge: number;
  saravaliPhalaEn: string;
  saravaliPhalaHi: string;
  remedyDirectiveEn: string;
  remedyDirectiveHi: string;
  source: string;
  d9SignNameEn?: string;
  d9SignNameHi?: string;
  isVargottama?: boolean;
  hasDigbala?: boolean;
  isPushkaraNavamsha?: boolean;
  functionalRoleEn?: string;
  functionalRoleHi?: string;
  dispositorNoteEn?: string;
  dispositorNoteHi?: string;
}

const SIGN_HI = [
  'मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या',
  'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुंभ', 'मीन',
];

const ELEMENT_HI: Record<string, string> = {
  Fire: 'अग्नि तत्व',
  Earth: 'पृथ्वी तत्व',
  Air: 'वायु तत्व',
  Water: 'जल तत्व',
};

const PLANET_ARCHETYPE: Record<
  PredictionBodyId,
  { en: string; hi: string; domainEn: string; domainHi: string }
> = {
  Asc: {
    en: 'Physical vitality, temperament, life direction & instinctive mask',
    hi: 'व्यक्तित्व, शारीरिक संरचना, जीवन की दिशा एवं मूल स्वभाव',
    domainEn: 'self-identity',
    domainHi: 'व्यक्तित्व व देह',
  },
  Sun: {
    en: 'Soul purpose, authority, vitality, ego & paternal heritage',
    hi: 'आत्मबल, नेतृत्व, पिता पक्ष, राजकीय सम्मान व जीवन-तेज',
    domainEn: 'leadership and confidence',
    domainHi: 'आत्मविश्वास व नेतृत्व',
  },
  Moon: {
    en: 'Emotional rhythm, subconscious instincts, mother & mental peace',
    hi: 'मन, भावनाएँ, माता का सुख, अंतर्ज्ञान एवं मानसिक शांति',
    domainEn: 'emotional fulfillment',
    domainHi: 'मन व भावनात्मक सुख',
  },
  Mars: {
    en: 'Drive, courage, physical stamina, initiative & property defense',
    hi: 'पराक्रम, ऊर्जा, साहस, भूमि-संपत्ति एवं निर्णय क्षमता',
    domainEn: 'action and courage',
    domainHi: 'पराक्रम व कार्यशक्ति',
  },
  Mercury: {
    en: 'Intellect, analytical logic, speech, commerce & adaptability',
    hi: 'बुद्धि, वाणी, तर्क, लेखन, व्यापार व संवाद कौशल',
    domainEn: 'communication and intellect',
    domainHi: 'बुद्धि व व्यापार',
  },
  Jupiter: {
    en: 'Wisdom, dharma, wealth expansion, mentorship & progeny grace',
    hi: 'ज्ञान, धर्म, भाग्य, धन-विस्तार, गुरु कृपा व संतान सुख',
    domainEn: 'wisdom and expansion',
    domainHi: 'ज्ञान व समृद्धि',
  },
  Venus: {
    en: 'Love, harmony, artistic taste, comforts, luxuries & relationships',
    hi: 'प्रेम, दांपत्य, कला, सौंदर्य, वाहन एवं भौतिक वैभव',
    domainEn: 'love and refinement',
    domainHi: 'प्रेम व सुख-वैभव',
  },
  Saturn: {
    en: 'Discipline, karma, endurance, structural mastery & humility',
    hi: 'कर्म, अनुशासन, धैर्य, दीर्घायु, न्याय व स्थायी निर्माण',
    domainEn: 'persistence and structure',
    domainHi: 'कर्म व अनुशासन',
  },
  Rahu: {
    en: 'Unconventional ambition, amplification, innovation & worldly hunger',
    hi: 'अपरंपरागत महत्वाकांक्षा, शोध, तकनीक, विदेश व तीव्र आकर्षण',
    domainEn: 'ambition and breakthroughs',
    domainHi: 'नवाचार व तीव्र उन्नति',
  },
  Ketu: {
    en: 'Intuitive mastery, past-life skill, detachment & spiritual insight',
    hi: 'आध्यात्मिक गहराई, पूर्वजन्म संस्कार, शोध, वैराग्य व मोक्ष दृष्टि',
    domainEn: 'intuition and mastery',
    domainHi: 'अंतर्ज्ञान व अध्यात्म',
  },
};

const SIGN_FLAVOR: Array<{
  qualityEn: string;
  qualityHi: string;
  toneEn: string;
  toneHi: string;
  watchEn: string;
  watchHi: string;
}> = [
  { qualityEn: 'pioneering, bold, impulsive & competitive', qualityHi: 'साहसी, अग्रणी, ऊर्जावान एवं प्रतिस्पर्धी', toneEn: 'fast initiative and independent execution', toneHi: 'त्वरित पहल और स्वतंत्र नेतृत्व', watchEn: 'impatience or heat under provocation', watchHi: 'जल्दबाज़ी व क्रोध पर नियंत्रण रखें' },
  { qualityEn: 'grounded, sensual, artistic & resource-preserving', qualityHi: 'स्थिर, सौंदर्यप्रिय, धैर्यशील एवं धन-संरक्षक', toneEn: 'patient accumulation and steady comfort', toneHi: 'स्थायी धन संचय और कलात्मक स्थिरता', watchEn: 'stubbornness or over-attachment to routine', watchHi: 'हठ और परिवर्तन के प्रति जड़ता से बचें' },
  { qualityEn: 'curious, versatile, witty & communicative', qualityHi: 'जिज्ञासु, बहुमुखी, वाक्पटु एवं तार्किक', toneEn: 'multi-tasking, trade, writing and sharp analysis', toneHi: 'संवाद, लेखन, व्यापार और त्वरित बुद्धि', watchEn: 'scattered focus or nervous overthinking', watchHi: 'मन के भटकाव और अति-चिंतन से बचें' },
  { qualityEn: 'nurturing, intuitive, protective & deeply feeling', qualityHi: 'संवेदनशील, पोषक, भावुक एवं अंतर्ज्ञानी', toneEn: 'emotional depth, hospitality and protective bonds', toneHi: 'गहरी करुणा, गृह-सुख व सहज अंतर्ज्ञान', watchEn: 'mood swings or taking setbacks personally', watchHi: 'भावुकता में निर्णय लेने से बचें' },
  { qualityEn: 'regal, expressive, generous & prideful', qualityHi: 'तेजस्वी, उदार, स्वाभिमानी एवं नेतृत्वकारी', toneEn: 'charismatic authority, creative radiance and loyalty', toneHi: 'राजकीय प्रभाव, रचनात्मक गौरव व विशाल हृदय', watchEn: 'ego rigidity or expecting constant applause', watchHi: 'अहंकार और हठी गौरव से बचें' },
  { qualityEn: 'analytical, service-minded, meticulous & practical', qualityHi: 'विश्लेषक, सूक्ष्मदर्शी, सेवा-भावी एवं व्यवस्थित', toneEn: 'precision craft, healing, auditing and problem-solving', toneHi: 'सूक्ष्म कौशल, चिकित्सा, लेखा व समस्या समाधान', watchEn: 'perfectionist worry or self-criticism', watchHi: 'अति-आलोचना व अनावश्यक चिंता से बचें' },
  { qualityEn: 'diplomatic, aesthetic, partnership-oriented & fair', qualityHi: 'संतुलित, न्यायप्रिय, सौंदर्यप्रेमी एवं कूटनीतिक', toneEn: 'social grace, negotiation, justice and design sense', toneHi: 'मधुर व्यवहार, साझेदारी, न्याय व कलात्मक संतुलन', watchEn: 'indecisiveness from over-pleasing others', watchHi: 'निर्णय लेने में अत्यधिक दुविधा से बचें' },
  { qualityEn: 'intense, transformative, secretive & investigative', qualityHi: 'गूढ़, शोधकर्ता, तीव्र एवं परिवर्तनकारी', toneEn: 'research power, psychological depth and crisis resilience', toneHi: 'गुप्त विद्या, गहन शोध और संकट से उबरने की शक्ति', watchEn: 'secret resentment, jealousy or extremes', watchHi: 'संदेह, गोपनीय आक्रोश व अतिवाद से बचें' },
  { qualityEn: 'philosophical, optimistic, righteous & far-seeing', qualityHi: 'दार्शनिक, आशावादी, धर्मनिष्ठ एवं दूरदर्शी', toneEn: 'higher wisdom, teaching, travel and ethical leadership', toneHi: 'उच्च शिक्षा, धर्म, मार्गदर्शन एवं दीर्घकालीन दृष्टि', watchEn: 'preachy overconfidence or overlooking small details', watchHi: 'अति-आत्मविश्वास व सूक्ष्म विवरण की अनदेखी से बचें' },
  { qualityEn: 'ambitious, structured, pragmatic & enduring', qualityHi: 'कर्मठ, महत्वाकांक्षी, व्यावहारिक एवं अनुशासित', toneEn: 'long-horizon career climb and institutional reliability', toneHi: 'दीर्घकालीन करियर उन्नति, प्रशासन व ठोस परिश्रम', watchEn: 'workaholism, pessimism or emotional austerity', watchHi: 'अति-कार्यभार व रूखेपन से बचें' },
  { qualityEn: 'humanitarian, inventive, reformist & collective', qualityHi: 'मानवतावादी, नवाचारी, बौद्धिक एवं समाजोन्मुखी', toneEn: 'scientific systems, networks, altruism and originality', toneHi: 'तकनीकी नवाचार, जन-संपर्क व स्वतंत्र विचार', watchEn: 'emotional detachment or rebellious eccentricity', watchHi: 'अकेलेपन या अनावश्यक विद्रोह से बचें' },
  { qualityEn: 'compassionate, mystical, imaginative & transcendent', qualityHi: 'दयालु, कल्पनाशील, आध्यात्मिक एवं उदार', toneEn: 'spiritual empathy, music/poetry, intuition and healing', toneHi: 'गहरी भक्ति, कला, करुणा एवं आध्यात्मिक अंतर्दृष्टि', watchEn: 'escapism, vague boundaries or excessive trust', watchHi: 'भ्रम, पलायनवाद व अति-विश्वास से बचें' },
];

const SPECIAL_PAIR_NOTES: Record<string, { headlineEn: string; headlineHi: string; noteEn: string; noteHi: string }> = {
  'Sun-0': {
    headlineEn: 'Exalted Radiance & Sovereign Drive',
    headlineHi: 'उच्च राशि का तेजस्वी व नेतृत्वकारी सूर्य',
    noteEn: 'Exalted in Aries (peak at 10°), bestowing extraordinary willpower, executive stature, pioneering courage and clear moral vigor.',
    noteHi: 'मेष में उच्च का सूर्य (10° पर परमोच्च) अद्भुत आत्मबल, राजकीय प्रतिष्ठा, निर्भीकता व नेतृत्व प्रदान करता है।',
  },
  'Sun-4': {
    headlineEn: 'Royal Moolatrikona Dignity at Home',
    headlineHi: 'स्वराशि व मूलत्रिकोण में प्रबल सूर्य',
    noteEn: 'Own sign Leo endows magnetic dignity, organizational command, generous patronage, and natural pride.',
    noteHi: 'स्वराशि सिंह में सूर्य जातक को स्वाभाविक आकर्षण, प्रशासनिक दक्षता, उदारता व आत्म-गौरव देता है।',
  },
  'Sun-6': {
    headlineEn: 'Diplomatic Grace Testing Solo Ego',
    headlineHi: 'तुला राशि में नीच सूर्य — सहयोग से उत्थान',
    noteEn: 'Debilitated in Libra; teaches humility through partnerships, artistic diplomacy and fair negotiation rather than solo command.',
    noteHi: 'तुला में सूर्य आत्म-अभिमान की परीक्षा लेता है, पर साझेदारी, न्याय व कलात्मक कूटनीति से श्रेष्ठ उन्नति कराता है।',
  },
  'Moon-1': {
    headlineEn: 'Exalted Emotional Poise & Luxury Affinity',
    headlineHi: 'वृषभ में उच्च का स्थिर व समृद्ध चंद्र',
    noteEn: 'Exalted in Taurus (peak 3°), yielding serene judgment, melodic voice, lasting wealth accumulation and aesthetic refinement.',
    noteHi: 'वृषभ में उच्च का चंद्र मधुर वाणी, मानसिक स्थिरता, कला-सौंदर्य व स्थायी धन-सुख प्रदान करता है।',
  },
  'Moon-3': {
    headlineEn: 'Swakshetra Moon — Nurturing Intuition',
    headlineHi: 'स्वराशि कर्क में संवेदनशील व करुणामय चंद्र',
    noteEn: 'In its own sign Cancer, Moon deepens empathy, devotion to home and mother, vivid memory and healing intuition.',
    noteHi: 'स्वराशि कर्क का चंद्र प्रबल स्मरण शक्ति, मातृ-भक्ति, सहज अंतर्ज्ञान और जन-लोकप्रियता देता है।',
  },
  'Mars-9': {
    headlineEn: 'Exalted Mars — Strategist & Commander',
    headlineHi: 'मकर में उच्च का अजेय व अनुशासित मंगल',
    noteEn: 'Exalted in Capricorn (peak 28°), producing tireless stamina, executive discipline, engineering genius and strategic victory.',
    noteHi: 'मकर में उच्च का मंगल जातक को अजेय पराक्रम, प्रशासनिक नियंत्रण, अचल संपत्ति और सटीक रणनीति प्रदान करता है।',
  },
  'Jupiter-3': {
    headlineEn: 'Exalted Guru — Supreme Benevolence',
    headlineHi: 'कर्क में उच्च का परम कल्याणकारी गुरु',
    noteEn: 'Exalted in Cancer (peak 5°), blessing with pure spiritual wisdom, wealth stewardship, sweet progeny and divine rescue.',
    noteHi: 'कर्क में उच्च का गुरु उत्तम धर्म, सद्बुद्धि, श्रेष्ठ संतान, अखंड समृद्धि और संकट में ईश्वरीय कृपा देता है।',
  },
  'Venus-11': {
    headlineEn: 'Exalted Shukra — Oceanic Artistry & Grace',
    headlineHi: 'मीन में उच्च का परम ऐश्वर्यशाली शुक्र',
    noteEn: 'Exalted in Pisces (peak 27°), creating poetic brilliance, boundless empathy, luxury vehicles, and unconditional affection.',
    noteHi: 'मीन में उच्च का शुक्र जातक को कलात्मक सृजन, मधुर प्रेम, वाहन-वैभव और आध्यात्मिक सौंदर्य प्रदान करता है।',
  },
  'Saturn-6': {
    headlineEn: 'Exalted Shani — Champion of the People',
    headlineHi: 'तुला में उच्च का न्यायप्रिय व दीर्घजीवी शनि',
    noteEn: 'Exalted in Libra (peak 20°), yielding judicial wisdom, mass leadership, commercial balance, and lasting structural wealth.',
    noteHi: 'तुला में उच्च का शनि निष्पक्ष न्याय, जन-समर्थन, व्यापारिक सफलता और जीवन के उत्तरार्ध में विशाल संपत्ति देता है।',
  },
};

function computeFruitionMilestone(planet: PredictionBodyId, signIdx: number): { age: number; decade: string } {
  const baseMaturation: Record<PredictionBodyId, number> = {
    Sun: 22,
    Moon: 24,
    Mars: 28,
    Mercury: 32,
    Jupiter: 16,
    Venus: 25,
    Saturn: 36,
    Rahu: 42,
    Ketu: 48,
    Asc: 25,
  };
  let age = baseMaturation[planet] ?? 28;
  if ([0, 4, 8].includes(signIdx)) {
    // Fire: early ignition
    age = Math.max(18, age - 2);
  } else if ([9, 10].includes(signIdx)) {
    // Saturn signs: mature crystallization
    age = Math.max(30, age + 2);
  }
  const decade = age < 25 ? '20s (आरंभिक दशक)' : age < 35 ? '30s (मध्य दशक)' : age < 45 ? '40s (परिपक्व काल)' : '50s (उत्तरार्ध)';
  return { age, decade };
}

function getSaravaliSutra(planet: PredictionBodyId, signIdx: number): { en: string; hi: string } {
  const sName = SIGNS[signIdx].name;
  const sHi = SIGN_HI[signIdx];
  return {
    en: `Saravali: When ${planet} occupies ${sName}, the native experiences tangible manifestation of its karakatvas through ${SIGN_FLAVOR[signIdx].toneEn}, with notable peaks in status and fortune.`,
    hi: `सारावली (कल्याण वर्मा): ${sHi} राशि में स्थित होने पर यह ग्रह ${SIGN_FLAVOR[signIdx].toneHi} द्वारा अपने कारकतत्वों का स्पष्ट फल देता है, जिससे मान-प्रतिष्ठा व ऐश्वर्य में वृद्धि होती है।`,
  };
}

function getRemedyDirective(planet: PredictionBodyId): { en: string; hi: string } {
  const REMEDIES: Record<PredictionBodyId, { en: string; hi: string }> = {
    Sun: { en: 'Offer Arghya to Surya at sunrise with Gayatri Mantra; honor father and elders.', hi: 'प्रातःकाल सूर्य को तांबे के लोटे से अर्घ्य दें; गायत्री मंत्र का जप व पिता का सम्मान करें।' },
    Moon: { en: 'Chant Om Som Somaya Namah on Mondays; offer milk/water to Shiva; respect mother.', hi: 'सोमवार को भगवान शिव का दुग्धाभिषेक करें; ॐ सों सोमाय नमः का जप व माता के चरण स्पर्श करें।' },
    Mars: { en: 'Recite Hanuman Chalisa or Sundarkand on Tuesdays; avoid harsh temper; donate red lentils.', hi: 'मंगलवार को हनुमान चालीसा या सुंदरकांड का पाठ करें; क्रोध पर नियंत्रण व मसूर दाल का दान करें।' },
    Mercury: { en: 'Feed green fodder/spinach to cows on Wednesdays; chant Vishnu Sahasranama.', hi: 'बुधवार को गाय को हरा चारा खिलाएं; विष्णु सहस्रनाम या ॐ बुं बुधाय नमः का पाठ करें।' },
    Jupiter: { en: 'Apply saffron/turmeric tilak on forehead; respect teachers; chant Guru Gayatri.', hi: 'माथे पर केसर/हल्दी का तिलक लगाएं; गुरु व ब्राह्मणों का आदर करें; ॐ बृं बृहस्पतये नमः का जप करें।' },
    Venus: { en: 'Worship Goddess Lakshmi on Fridays; maintain clean aesthetic surroundings and mutual fidelity.', hi: 'शुक्रवार को श्रीसूक्त या कनकधारा स्तोत्र का पाठ करें; स्वच्छता व दांपत्य निष्ठा बनाए रखें।' },
    Saturn: { en: 'Light a mustard oil lamp under Peepal tree on Saturdays; serve disabled, labor and elderly.', hi: 'शनिवार की शाम पीपल के वृक्ष के नीचे सरसों के तेल का दीपक जलाएं; असहायों व श्रमिकों की सेवा करें।' },
    Rahu: { en: 'Chant Om Raam Rahave Namah or Maha Mrityunjaya; avoid intoxicants and unethical short-cuts.', hi: 'ॐ रां राहवे नमः या महामृत्युंजय मंत्र का पाठ करें; नशा व अनैतिक शॉर्टकट से बचें।' },
    Ketu: { en: 'Feed street dogs; worship Lord Ganesha with Durva grass; engage in selfless meditation.', hi: 'आवारा श्वान को भोजन दें; भगवान गणेश को दूर्वा अर्पित कर संकटनाशन गणेश स्तोत्र पढ़ें।' },
    Asc: { en: 'Align daily routine with biological clock; perform Surya Namaskar and meditation at dawn.', hi: 'दैनिक दिनचर्या को अनुशासित रखें; ब्रह्म मुहूर्त में सूर्य नमस्कार व ध्यान का अभ्यास करें।' },
  };
  return REMEDIES[planet] || REMEDIES.Sun;
}

function getOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function checkDigbala(pId: PredictionBodyId, houseNum: number): boolean {
  if ((pId === 'Jupiter' || pId === 'Mercury') && houseNum === 1) return true;
  if ((pId === 'Sun' || pId === 'Mars') && houseNum === 10) return true;
  if (pId === 'Saturn' && houseNum === 7) return true;
  if ((pId === 'Moon' || pId === 'Venus') && houseNum === 4) return true;
  return false;
}

function checkPushkaraNavamsha(signIndex: number, degreeInSign: number): boolean {
  const elem = signIndex % 4; // 0=Fire, 1=Earth, 2=Air, 3=Water
  const navIdx = Math.min(8, Math.floor(degreeInSign / (30 / 9)));
  if (elem === 0) return navIdx === 6 || navIdx === 8;
  if (elem === 1) return navIdx === 2 || navIdx === 4;
  if (elem === 2) return navIdx === 5 || navIdx === 7;
  return navIdx === 0 || navIdx === 2;
}

function getPlanetInSignEntry(
  body: BodyPosition,
  ascSignIndex: number,
  chart?: ChartData
): PlanetInSignPrediction {
  const pId = body.id as PredictionBodyId;
  const sInfo = SIGNS[body.signIndex];
  const sHi = SIGN_HI[sInfo.index];
  const arch = PLANET_ARCHETYPE[pId] ?? PLANET_ARCHETYPE.Sun;
  const flav = SIGN_FLAVOR[sInfo.index];
  const special = SPECIAL_PAIR_NOTES[`${pId}-${sInfo.index}`];
  const fruition = computeFruitionMilestone(pId, sInfo.index);
  const saravali = getSaravaliSutra(pId, sInfo.index);
  const remedy = getRemedyDirective(pId);
  const ordHouse = getOrdinal(body.rasiHouseNumber);

  const headlineEn = special
    ? special.headlineEn
    : `${pId === 'Asc' ? 'Ascendant' : pId} in ${sInfo.name} (${sInfo.element}) — ${ordHouse} House`;
  const headlineHi = special
    ? special.headlineHi
    : `${sHi} राशि में ${pId === 'Asc' ? 'लग्न' : pId === 'Sun' ? 'सूर्य' : pId === 'Moon' ? 'चंद्र' : pId === 'Mars' ? 'मंगल' : pId === 'Mercury' ? 'बुध' : pId === 'Jupiter' ? 'गुरु' : pId === 'Venus' ? 'शुक्र' : pId === 'Saturn' ? 'शनि' : pId === 'Rahu' ? 'राहु' : 'केतु'} (${body.rasiHouseNumber}वां भाव)`;

  const readingEn = special
    ? `${special.noteEn} Positioned in your ${ordHouse} House, this governs your ${arch.domainEn} through ${flav.qualityEn} agency and ${flav.toneEn}. Prime life fruition milestone activates around age ${fruition.age} years.`
    : `In your chart, ${pId === 'Asc' ? 'Ascendant' : pId} occupies ${sInfo.name} (${sInfo.element} element) in your ${ordHouse} House. Under classical Parashari and Saravali dictums, this shapes your ${arch.domainEn} through ${flav.qualityEn} energy, conferring success through ${flav.toneEn}. Major life fruition peaks around age ${fruition.age} (${fruition.decade}).`;

  const readingHi = special
    ? `${special.noteHi} आपके ${body.rasiHouseNumber}वें भाव में स्थित होकर यह ग्रह आपके ${arch.domainHi} को ${flav.qualityHi} ऊर्जा व ${flav.toneHi} से सुदृढ़ करता है। मुख्य फलोदय आयु: ${fruition.age} वर्ष।`
    : `आपकी कुंडली में ${pId === 'Asc' ? 'लग्न' : pId === 'Sun' ? 'सूर्य' : pId === 'Moon' ? 'चंद्र' : pId === 'Mars' ? 'मंगल' : pId === 'Mercury' ? 'बुध' : pId === 'Jupiter' ? 'गुरु' : pId === 'Venus' ? 'शुक्र' : pId === 'Saturn' ? 'शनि' : pId === 'Rahu' ? 'राहु' : 'केतु'} ${sHi} राशि (${ELEMENT_HI[sInfo.element]}) एवं आपके ${body.rasiHouseNumber}वें भाव में विराजमान हैं। शास्त्रीय परंपरा अनुसार यह स्थिति आपके ${arch.domainHi} को ${flav.qualityHi} प्रभाव देती है और ${flav.toneHi} द्वारा यश दिलाती है। प्रमुख फलोदय आयु: ${fruition.age} वर्ष (${fruition.decade})।`;

  const positiveEn = `${flav.toneEn.charAt(0).toUpperCase() + flav.toneEn.slice(1)}${body.isVargottama ? '; Vargottama alignment multiplies stability' : ''}.`;
  const positiveHi = `${flav.toneHi}${body.isVargottama ? ' (वर्गोत्तम होने से फल अत्यंत सुदृढ़)' : ''}।`;

  const retroWarnEn =
    body.isRetrograde && pId !== 'Rahu' && pId !== 'Ketu' && pId !== 'Asc'
      ? '; Retrograde inward intensity'
      : '';
  const combWarnEn = body.isCombust ? '; Combust near Sun — nurture gently' : '';

  const retroWarnHi =
    body.isRetrograde && pId !== 'Rahu' && pId !== 'Ketu' && pId !== 'Asc'
      ? ' (वक्री — गहन आंतरिक पुनरावलोकन)'
      : '';
  const combWarnHi = body.isCombust ? ' (अस्त — शुभत्व हेतु सावधानी)' : '';

  const hasDigbala = checkDigbala(pId, body.rasiHouseNumber);
  const isPushkaraNavamsha = checkPushkaraNavamsha(body.signIndex, body.degreeInSign);
  const d9Placement = chart?.divisionalCharts?.D9?.placements?.find((p) => p.id === pId);
  const d9SignIdx = d9Placement?.signIndex;
  const d9SignNameEn = d9SignIdx !== undefined ? SIGNS[d9SignIdx]?.name : undefined;
  const d9SignNameHi = d9SignIdx !== undefined ? SIGN_HI[d9SignIdx] : undefined;

  let functionalRoleEn: string | undefined;
  let functionalRoleHi: string | undefined;
  if (SEVEN_PLANETS.includes(pId as SevenPlanetId)) {
    const fl = getFunctionalLordship(pId as SevenPlanetId, ascSignIndex);
    functionalRoleEn = fl.rolesEn.join(' · ');
    functionalRoleHi = fl.rolesHi.join(' · ');
  }

  let dispositorNoteEn: string | undefined;
  let dispositorNoteHi: string | undefined;
  const dispBody = chart?.planets?.find((p) => p.id === sInfo.lord);
  if (dispBody && pId !== 'Asc') {
    dispositorNoteEn = `Dispositor ${sInfo.lord} is in House ${dispBody.rasiHouseNumber} (${dispBody.signName}, ${dispBody.dignity})`;
    dispositorNoteHi = `राशि-स्वामी ${sInfo.lord} भाव ${dispBody.rasiHouseNumber} (${SIGN_HI[dispBody.signIndex]}, ${dispBody.dignity}) में स्थित`;
  }

  return {
    planet: pId,
    signIndex: body.signIndex,
    signNameEn: sInfo.name,
    signNameHi: sHi,
    signLord: sInfo.lord,
    elementEn: sInfo.element,
    elementHi: ELEMENT_HI[sInfo.element] ?? sInfo.element,
    houseNumber: body.rasiHouseNumber,
    dignity: body.dignity,
    degreeDms: body.dms,
    isRetrograde: body.isRetrograde,
    isCombust: body.isCombust,
    headlineEn,
    headlineHi,
    readingEn,
    readingHi,
    positiveEn,
    positiveHi,
    cautionEn: `${flav.watchEn}${retroWarnEn}${combWarnEn}.`,
    cautionHi: `${flav.watchHi}${retroWarnHi}${combWarnHi}`,
    peakDecade: fruition.decade,
    fruitionAge: fruition.age,
    saravaliPhalaEn: saravali.en,
    saravaliPhalaHi: saravali.hi,
    remedyDirectiveEn: remedy.en,
    remedyDirectiveHi: remedy.hi,
    source: 'Saravali (Kalyana Varma) · Brihat Jataka (Varahamihira) · Phaladeepika',
    d9SignNameEn,
    d9SignNameHi,
    isVargottama: body.isVargottama,
    hasDigbala,
    isPushkaraNavamsha,
    functionalRoleEn,
    functionalRoleHi,
    dispositorNoteEn,
    dispositorNoteHi,
  };
}

export function computePlanetInSignPredictions(chart: ChartData): PlanetInSignPrediction[] {
  const ascItem = getPlanetInSignEntry(chart.ascendant, chart.ascendant.signIndex, chart);
  const planetMap = new Map(chart.planets.map((p) => [p.id, p]));
  const rest = NINE_GRAHAS.map((g) => getPlanetInSignEntry(planetMap.get(g)!, chart.ascendant.signIndex, chart));
  return [ascItem, ...rest];
}

export function inspectHypotheticalPlanetInSign(
  planet: PredictionBodyId,
  signIndex: number
): {
  headlineEn: string;
  headlineHi: string;
  readingEn: string;
  readingHi: string;
  cautionEn: string;
  cautionHi: string;
  fruitionAge: number;
  peakDecade: string;
  remedyEn: string;
  remedyHi: string;
} {
  const sInfo = SIGNS[((signIndex % 12) + 12) % 12];
  const sHi = SIGN_HI[sInfo.index];
  const arch = PLANET_ARCHETYPE[planet] ?? PLANET_ARCHETYPE.Sun;
  const flav = SIGN_FLAVOR[sInfo.index];
  const special = SPECIAL_PAIR_NOTES[`${planet}-${sInfo.index}`];
  const fruition = computeFruitionMilestone(planet, sInfo.index);
  const remedy = getRemedyDirective(planet);

  return {
    headlineEn: special ? special.headlineEn : `${planet === 'Asc' ? 'Ascendant' : planet} in ${sInfo.name} (${sInfo.element})`,
    headlineHi: special ? special.headlineHi : `${sHi} राशि में ${planet === 'Asc' ? 'लग्न' : planet === 'Sun' ? 'सूर्य' : planet === 'Moon' ? 'चंद्र' : planet === 'Mars' ? 'मंगल' : planet === 'Mercury' ? 'बुध' : planet === 'Jupiter' ? 'गुरु' : planet === 'Venus' ? 'शुक्र' : planet === 'Saturn' ? 'शनि' : planet === 'Rahu' ? 'राहु' : 'केतु'}`,
    readingEn: special
      ? `${special.noteEn} Shapes ${arch.domainEn} through ${flav.qualityEn} expression and ${flav.toneEn}. Prime fruition around age ${fruition.age}.`
      : `${arch.en} expresses through ${sInfo.name}'s ${flav.qualityEn} lens, favoring ${flav.toneEn}. Prime fruition around age ${fruition.age} (${fruition.decade}).`,
    readingHi: special
      ? `${special.noteHi} ${arch.domainHi} को ${flav.qualityHi} शैली में निखारता है। फलोदय आयु: ${fruition.age} वर्ष।`
      : `${arch.hi} — ${sHi} राशि में यह ग्रह ${flav.qualityHi} स्वभाव अपनाकर ${flav.toneHi} से सफलता देता है। फलोदय आयु: ${fruition.age} वर्ष (${fruition.decade})।`,
    cautionEn: flav.watchEn,
    cautionHi: flav.watchHi,
    fruitionAge: fruition.age,
    peakDecade: fruition.decade,
    remedyEn: remedy.en,
    remedyHi: remedy.hi,
  };
}
