import { NINE_GRAHAS, SIGNS } from '../constants';
import type { BodyPosition, ChartData, NineGrahaId } from '../types';

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
  source: string;
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

// Specific classical sign overrides for rich astrological flavor
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
  'Moon-7': {
    headlineEn: 'Intense Emotional Depth & Hidden Resilience',
    headlineHi: 'वृश्चिक में नीच चंद्र — गहन भावनात्मक शोध',
    noteEn: 'Debilitated in Scorpio; feelings run extraordinarily deep and watchful — meditation and creative transformation unlock tremendous insight.',
    noteHi: 'वृश्चिक का चंद्र भावनाओं में अत्यधिक गहराई व संवेदनशीलता देता है — ध्यान व शोध से अद्भुत अंतर्दृष्टि जागती है।',
  },
  'Mars-9': {
    headlineEn: 'Exalted Strategic General & Builder',
    headlineHi: 'मकर में उच्च का रणनीतिक व कर्मठ मंगल',
    noteEn: 'Exalted in Capricorn (28°); channels raw fiery courage into disciplined engineering, executive execution and enduring authority.',
    noteHi: 'मकर में उच्च का मंगल अपार ऊर्जा को अनुशासित कर्म, तकनीकी कौशल, भूमि लाभ व उच्च प्रशासनिक पद में बदलता है।',
  },
  'Mars-3': {
    headlineEn: 'Guarded Action Fuelled by Heart',
    headlineHi: 'कर्क में नीच मंगल — भावना व ऊर्जा का संतुलन',
    noteEn: 'Debilitated in Cancer; reactive emotions can cloud drive unless directed toward protective service, family welfare or technical craft.',
    noteHi: 'कर्क का मंगल क्रोध या भावनात्मक आवेश बढ़ा सकता है — इसे सेवा, रक्षा, रियल एस्टेट या योग से संतुलित करें।',
  },
  'Mercury-5': {
    headlineEn: 'Exalted Razor-Sharp Analytical Mastery',
    headlineHi: 'कन्या में उच्च व स्वराशि का तीव्र बुध',
    noteEn: 'Both exalted and own-sign in Virgo (15° peak); creates brilliant diagnostic intellect, mathematics, writing, coding and commercial skill.',
    noteHi: 'कन्या में उच्च व स्वराशि का बुध अद्वितीय विश्लेषण क्षमता, गणित, लेखन, कोडिंग व व्यापारिक चातुर्य देता है।',
  },
  'Jupiter-3': {
    headlineEn: 'Exalted Hamsa Wisdom & Graceful Abundance',
    headlineHi: 'कर्क में परमोच्च हंस-तुल्य बृहस्पति',
    noteEn: 'Exalted in Cancer (5°); overflows with compassionate wisdom, revered advisory status, prosperity and virtuous protection.',
    noteHi: 'कर्क में उच्च का गुरु परम ज्ञान, करुणा, शिक्षा-सलाहकार प्रतिष्ठा, पारिवारिक सुख व शुभ समृद्धि प्रदान करता है।',
  },
  'Jupiter-9': {
    headlineEn: 'Pragmatic, Hard-Won Philosophical Mastery',
    headlineHi: 'मकर में नीच गुरु — व्यावहारिक कर्म से ज्ञान',
    noteEn: 'Debilitated in Capricorn; demands testing beliefs against real-world structures — steady duty builds respected practical authority.',
    noteHi: 'मकर में गुरु आदर्शवाद से अधिक ठोस व्यावहारिक परिश्रम की मांग करता है — धैर्यपूर्ण कर्म से स्थायी मान मिलता है।',
  },
  'Venus-11': {
    headlineEn: 'Exalted Unconditional Grace & Artistic Bliss',
    headlineHi: 'मीन में उच्च का कलात्मक व उदार शुक्र',
    noteEn: 'Exalted in Pisces (27°); elevates romance, compassion, cinema/music, philanthropy and refined worldly-spiritual harmony.',
    noteHi: 'मीन में उच्च का शुक्र दिव्य प्रेम, कला-संगीत प्रतिभा, संवेदनशील दांपत्य व समृद्ध आकर्षण प्रदान करता है।',
  },
  'Saturn-6': {
    headlineEn: 'Exalted Balance of Law, Karma & Patience',
    headlineHi: 'तुला में परमोच्च न्यायप्रिय शनि',
    noteEn: 'Exalted in Libra (20°); grants objective fairness, long-term public trust, legal/corporate leadership and dignified restraint.',
    noteHi: 'तुला में उच्च का शनि न्यायप्रियता, निष्पक्ष नेतृत्व, कानून-प्रशासन में सफलता व स्थायी जन-सम्मान दिलाता है।',
  },
  'Saturn-0': {
    headlineEn: 'Restless Drive Seeking Patient Mastery',
    headlineHi: 'मेष में नीच शनि — धैर्य से बाधा विजय',
    noteEn: 'Debilitated in Aries; impatience clashes with Saturnian slow timing — structured fitness and persistent grit conquer early friction.',
    noteHi: 'मेष का शनि जल्दबाज़ी व परिश्रम में परीक्षा देता है — निरंतर धैर्य व अनुशासित दिनचर्या से विलंबित पर पक्की जीत मिलती है।',
  },
};

export function getPlanetInSignEntry(
  body: BodyPosition,
  ascSignIndex: number
): PlanetInSignPrediction {
  const sInfo = SIGNS[body.signIndex];
  const sHi = SIGN_HI[body.signIndex];
  const pId = body.id as PredictionBodyId;
  const arch = PLANET_ARCHETYPE[pId] ?? PLANET_ARCHETYPE.Sun;
  const flav = SIGN_FLAVOR[body.signIndex];
  const key = `${pId}-${body.signIndex}`;
  const special = SPECIAL_PAIR_NOTES[key];

  const digSuffixEn =
    pId === 'Asc'
      ? ''
      : body.dignity !== '-'
        ? ` (${body.dignity})`
        : '';

  const headlineEn = special
    ? special.headlineEn
    : `${pId === 'Asc' ? 'Ascendant' : pId} in ${sInfo.name}${digSuffixEn}`;
  const headlineHi = special
    ? special.headlineHi
    : `${sHi} राशि में ${pId === 'Asc' ? 'लग्न' : pId === 'Sun' ? 'सूर्य' : pId === 'Moon' ? 'चंद्र' : pId === 'Mars' ? 'मंगल' : pId === 'Mercury' ? 'बुध' : pId === 'Jupiter' ? 'गुरु' : pId === 'Venus' ? 'शुक्र' : pId === 'Saturn' ? 'शनि' : pId === 'Rahu' ? 'राहु' : 'केतु'}`;

  const readingEn = special
    ? `${special.noteEn} Placed in House ${body.rasiHouseNumber} (${sInfo.element}, ruled by ${sInfo.lord}), it colors ${arch.domainEn} with ${flav.qualityEn} expression.`
    : `${pId === 'Asc' ? 'Lagna' : pId} occupies ${sInfo.name} (${sInfo.element}, ${sInfo.modality}, ruled by ${sInfo.lord}) in House ${body.rasiHouseNumber}. Your ${arch.domainEn} manifests through a ${flav.qualityEn} temperament — thriving via ${flav.toneEn}.`;

  const readingHi = special
    ? `${special.noteHi} कुंडली के ${body.rasiHouseNumber}वें भाव (${ELEMENT_HI[sInfo.element]}, राशि स्वामी ${sInfo.lord === 'Sun' ? 'सूर्य' : sInfo.lord === 'Moon' ? 'चंद्र' : sInfo.lord === 'Mars' ? 'मंगल' : sInfo.lord === 'Mercury' ? 'बुध' : sInfo.lord === 'Jupiter' ? 'गुरु' : sInfo.lord === 'Venus' ? 'शुक्र' : 'शनि'}) में स्थित होकर यह ${arch.domainHi} को ${flav.qualityHi} रूप देता है।`
    : `${sHi} राशि (${ELEMENT_HI[sInfo.element]}) एवं ${body.rasiHouseNumber}वें भाव में स्थिति दर्शाती है कि आपका ${arch.domainHi} ${flav.qualityHi} शैली से कार्य करता है — विशेष लाभ ${flav.toneHi} से मिलता है।`;

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

  void ascSignIndex;

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
    source: 'Brihat Jataka · Saravali · Phaladeepika',
  };
}

export function computePlanetInSignPredictions(chart: ChartData): PlanetInSignPrediction[] {
  const ascItem = getPlanetInSignEntry(chart.ascendant, chart.ascendant.signIndex);
  const planetMap = new Map(chart.planets.map((p) => [p.id, p]));
  const rest = NINE_GRAHAS.map((g) => getPlanetInSignEntry(planetMap.get(g)!, chart.ascendant.signIndex));
  return [ascItem, ...rest];
}

export function inspectHypotheticalPlanetInSign(
  planet: PredictionBodyId,
  signIndex: number
): { headlineEn: string; headlineHi: string; readingEn: string; readingHi: string; cautionEn: string; cautionHi: string } {
  const sInfo = SIGNS[((signIndex % 12) + 12) % 12];
  const sHi = SIGN_HI[sInfo.index];
  const arch = PLANET_ARCHETYPE[planet] ?? PLANET_ARCHETYPE.Sun;
  const flav = SIGN_FLAVOR[sInfo.index];
  const special = SPECIAL_PAIR_NOTES[`${planet}-${sInfo.index}`];
  return {
    headlineEn: special ? special.headlineEn : `${planet === 'Asc' ? 'Ascendant' : planet} in ${sInfo.name} (${sInfo.element})`,
    headlineHi: special ? special.headlineHi : `${sHi} राशि में ${planet === 'Asc' ? 'लग्न' : planet === 'Sun' ? 'सूर्य' : planet === 'Moon' ? 'चंद्र' : planet === 'Mars' ? 'मंगल' : planet === 'Mercury' ? 'बुध' : planet === 'Jupiter' ? 'गुरु' : planet === 'Venus' ? 'शुक्र' : planet === 'Saturn' ? 'शनि' : planet === 'Rahu' ? 'राहु' : 'केतु'}`,
    readingEn: special
      ? `${special.noteEn} Shapes ${arch.domainEn} through ${flav.qualityEn} expression and ${flav.toneEn}.`
      : `${arch.en} expresses through ${sInfo.name}'s ${flav.qualityEn} lens, favoring ${flav.toneEn}.`,
    readingHi: special
      ? `${special.noteHi} ${arch.domainHi} को ${flav.qualityHi} शैली में निखारता है।`
      : `${arch.hi} — ${sHi} राशि में यह ग्रह ${flav.qualityHi} स्वभाव अपनाकर ${flav.toneHi} से सफलता देता है।`,
    cautionEn: flav.watchEn,
    cautionHi: flav.watchHi,
  };
}
