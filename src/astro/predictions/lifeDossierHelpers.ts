import type { ChartData, BodyPosition, NineGrahaId, DashaPeriod } from '../types';
import { SIGNS } from '../constants';
import type { ChapterSection } from './lifeDossierEngine';

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

// ============================================================================
// 1. PHYSICAL APPEARANCE, STATURE, COMPLEXION & DREKKANA MARKS
// ============================================================================
export interface PhysicalAppearanceResult {
  section: ChapterSection;
  data: {
    heightStatureEn: string;
    heightStatureHi: string;
    buildFrameEn: string;
    buildFrameHi: string;
    complexionEn: string;
    complexionHi: string;
    faceEyesHairEn: string;
    faceEyesHairHi: string;
    molesAndMarksEn: string[];
    molesAndMarksHi: string[];
  };
}

export function computePhysicalAppearance(chart: ChartData): PhysicalAppearanceResult {
  const asc = chart.ascendant;
  const ascElem = SIGNS[asc.signIndex].element;
  const ascLord = asc.signLord;
  const in1st = chart.planets.filter((p) => p.rasiHouseNumber === 1);
  const saturn = chart.planets.find((p) => p.id === 'Saturn')!;
  const jupiter = chart.planets.find((p) => p.id === 'Jupiter')!;
  const mars = chart.planets.find((p) => p.id === 'Mars')!;
  const venus = chart.planets.find((p) => p.id === 'Venus')!;
  const mercury = chart.planets.find((p) => p.id === 'Mercury')!;
  const sun = chart.planets.find((p) => p.id === 'Sun')!;
  const moon = chart.planets.find((p) => p.id === 'Moon')!;
  const rahu = chart.planets.find((p) => p.id === 'Rahu')!;

  // 1a. Height & Stature
  let heightStatureEn = '';
  let heightStatureHi = '';
  let buildFrameEn = '';
  let buildFrameHi = '';

  if (ascElem === 'Fire') {
    heightStatureEn = 'Tall to Athletic Stature (5ft 9in to 6ft+ / Upright Stately Posture)';
    heightStatureHi = 'लंबा अथवा सुगठित गठीला कद (मध्यम से अधिक ऊंचाई, तनी हुई मुद्रा व प्रभावशाली आभा)';
    buildFrameEn = 'Broad shoulders, firm bone structure, athletic chest, and commanding physical presence with energetic stride.';
    buildFrameHi = 'चौड़े सुदृढ़ कंधे, मजबूत अस्थि-पंजर, चौड़ी छाती, तथा चलते समय एक स्वाभाविक राजसी व ऊर्जावान चाल।';
  } else if (ascElem === 'Air') {
    heightStatureEn = 'Tall, Slender & Lean Stature (Graceful, Agile & Long Limbs)';
    heightStatureHi = 'लंबा, इकहरा व फुर्तीला कद (पतली काया, लंबी भुजाएं व लचीला शरीर)';
    buildFrameEn = 'Slender waist, prominent collarbones, agile movements, youthful demeanor, and hands with long expressive fingers.';
    buildFrameHi = 'पतली कमर, उभरी हुई कॉलरबोन, फुर्तीली चाल, युवा जैसी चुस्ती और कलात्मक लंबी उंगलियां।';
  } else if (ascElem === 'Earth') {
    heightStatureEn = 'Medium to Sturdy Muscular Stature (Solid, Grounded & Compact Frame)';
    heightStatureHi = 'मध्यम, गठीला व ठोस कद (मजबूत मांसपेशियां, स्थिर चाल व गठीली शारीरिक बनावट)';
    buildFrameEn = 'Solid bone density, strong neck and wrists, grounded stance, and heavy muscular endurance resisting physical fatigue.';
    buildFrameHi = 'मजबूत हड्डियां, सुदृढ़ गर्दन व कलाई, भारी सहनशक्ति और शारीरिक श्रम को सहजता से झेलने वाला मजबूत ढांचा।';
  } else {
    // Water
    heightStatureEn = 'Medium to Proportionate Curvaceous Stature (Soft, Luminous & Harmonious Frame)';
    heightStatureHi = 'मध्यम, सुडौल व कोमल कद (गोल चेहरे की बनावट, सौम्य चाल व जल तत्व की कांति)';
    buildFrameEn = 'Proportionate frame, soft contoured shoulders, gentle posture, and a natural tendency to gain weight easily around the torso.';
    buildFrameHi = 'सुडौल मध्यम शरीर, सौम्य कंधे, शांत मुद्रा, तथा मध्य जीवन में पेट व कमर के आसपास आसानी से वजन बढ़ने की स्वाभाविक प्रवृत्ति।';
  }

  // Modifiers from planets in 1st or aspecting
  if (in1st.some((p) => p.id === 'Saturn') || saturn.rasiHouseNumber === 7) {
    heightStatureEn += ' · Saturn adds lean height, deep-set gravitas, and prominent joints.';
    heightStatureHi += ' · लग्न पर शनि का प्रभाव कद में खिंचाव, हड्डियों का उभार और चेहरे पर गंभीर परिपक्वता देता है।';
  }
  if (in1st.some((p) => p.id === 'Jupiter') || jupiter.rasiHouseNumber === 7) {
    buildFrameEn += ' Jupiter grants a stately noble carriage and majestic fullness in mature years.';
    buildFrameHi += ' देवगुरु बृहस्पति का प्रभाव जातक को भव्य रूप, चौड़ा ललाट और वृद्धावस्था में गरिमामयी भारीपन प्रदान करता है।';
  }

  // 1b. Complexion
  let complexionEn = '';
  let complexionHi = '';
  if (in1st.some((p) => p.id === 'Moon' || p.id === 'Venus') || [moon.rasiHouseNumber, venus.rasiHouseNumber].includes(7)) {
    complexionEn = 'Fair to Radiant Milky/Porcelain Tone (Smooth, bright and glowing luster)';
    complexionHi = 'उज्ज्वल गौर वर्ण / कांतिमान आभा (चमकदार, सौम्य व स्वच्छ त्वचा जिसमें स्वाभाविक निखार रहता है)';
  } else if (in1st.some((p) => p.id === 'Sun' || p.id === 'Mars') || [sun.rasiHouseNumber, mars.rasiHouseNumber].includes(7)) {
    complexionEn = 'Radiant Wheatish with Warm Copper/Golden Flush (Sun-kissed, active and vibrant)';
    complexionHi = 'उज्ज्वल गेहुंआ अथवा ताम्र-वर्णी तेज (सूर्य-मंगल की गर्माहट से युक्त चमकदार त्वचा, मुख पर तेज व लाली)';
  } else if (in1st.some((p) => p.id === 'Saturn' || p.id === 'Rahu') || [saturn.rasiHouseNumber, rahu.rasiHouseNumber].includes(7)) {
    complexionEn = 'Deep Wheatish to Dusky Olive/Bronze Complexion (Intense, magnetic and sun-weathered)';
    complexionHi = 'गहरा गेहुंआ अथवा सांवला/श्यामल वर्ण (गंभीर, चुंबकीय आकर्षण से युक्त त्वचा जो धूप में आसानी से सांवली होती है)';
  } else {
    complexionEn = 'Clear Wheatish Complexion (Balanced, healthy, and youthful texture)';
    complexionHi = 'स्वच्छ गेहुंआ वर्ण (स्वस्थ, संतुलित व प्राकृतिक चमक से युक्त त्वचा)';
  }

  // 1c. Face, Eyes & Hair
  let faceEyesHairEn = '';
  let faceEyesHairHi = '';
  switch (asc.signIndex) {
    case 0: // Aries
      faceEyesHairEn = 'Sharp angular jawline, penetrating and alert gaze, prominent eyebrows, and coarse wavy hair with a bold hairline.';
      faceEyesHairHi = 'तीक्ष्ण कोणीय जबड़ा, सतर्क व तीखी भेदक आंखें, घनी भौहें और माथे पर उभरे हुए घने, घुंघराले बाल।';
      break;
    case 1: // Taurus
      faceEyesHairEn = 'Square, handsome jaw, large gentle expressive cow-like eyes, sensual lips, and thick lustrous wavy hair.';
      faceEyesHairHi = 'चौकोर सुंदर जबड़ा, बड़ी-बड़ी सौम्य व भावपूर्ण आंखें, आकर्षक होंठ और घने, चमकदार लहराते बाल।';
      break;
    case 2: // Gemini
      faceEyesHairEn = 'Youthful oval face, sparkling quick-witted eyes, friendly smile, and fine silky hair that looks decades younger.';
      faceEyesHairHi = 'सदा युवा दिखने वाला अंडाकार मुख, चमकती हुई चंचल व कुशाग्र आंखें, मनमोहक मुस्कान और रेशमी बाल।';
      break;
    case 3: // Cancer
      faceEyesHairEn = 'Round full moon face, soft luminous eyes carrying deep emotional depths, and soft healthy hair with gentle contours.';
      faceEyesHairHi = 'चंद्रमा जैसा गोल व सौम्य मुख, गहरी मानवीय संवेदनाओं से भरी चमकदार आंखें और कोमल, घने बाल।';
      break;
    case 4: // Leo
      faceEyesHairEn = 'Broad commanding forehead, lion-like regal gaze that holds eye contact, strong jaw, and dense hair resembling a royal mane.';
      faceEyesHairHi = 'चौड़ा व ऊंचा ललाट, सिंह जैसी गरिमामयी व सीधे देखने वाली आंखें, सुदृढ़ ठुड्डी और शेर की अयाल जैसे घने बाल।';
      break;
    case 5: // Virgo
      faceEyesHairEn = 'Refined chiseled facial features, observant analytical gaze that notices every tiny detail, straight neat hair, and innocent youthful smile.';
      faceEyesHairHi = 'सुगढ़ व तराशे हुए नैन-नक्श, हर सूक्ष्म वस्तु को ताड़ लेने वाली विश्लेषणात्मक आंखें, सीधे बाल व निष्कपट मुस्कान।';
      break;
    case 6: // Libra
      faceEyesHairEn = 'Perfect facial symmetry, dimples on cheeks or chin, seductive smiling eyes, well-sculpted nose, and naturally aesthetic grooming.';
      faceEyesHairHi = 'पूर्णतः संतुलित व आकर्षक चेहरा, गाल या ठुड्डी पर गड्ढा (डिंपल), मनभावन मुस्कुराती आंखें और सुरुचिपूर्ण सजावट।';
      break;
    case 7: // Scorpio
      faceEyesHairEn = 'Intense, hypnotic and piercing eyes that look straight into one’s soul, sharp prominent nose, and magnetic, serious jawline.';
      faceEyesHairHi = 'अत्यंत चुंबकीय, सम्मोहक व भेदक आंखें जो अंतरात्मा को चीरती हुई प्रतीत होती हैं, तीखी नाक और गंभीर मुखमुद्रा।';
      break;
    case 8: // Sagittarius
      faceEyesHairEn = 'Open oval face, warm broad forehead, optimistic sparkling eyes, generous smile, and tall elongated head structure.';
      faceEyesHairHi = 'खुला व भव्य अंडाकार मुख, चौड़ा माथा, आशा और उत्साह से चमकती आंखें, चौड़ी मुस्कान और ऊंचा सिर।';
      break;
    case 9: // Capricorn
      faceEyesHairEn = 'Prominent high cheekbones, deep-set thoughtful eyes carrying mature gravitas, serious determined mouth, and hair that thins at temples.';
      faceEyesHairHi = 'उभरी हुई गाल की हड्डियां (Cheekbones), गहरी विचारमग्न आंखें, दृढ़ संकल्पित होंठ और कनपटी से हल्के होते बाल।';
      break;
    case 10: // Aquarius
      faceEyesHairEn = 'Unconventional and modern facial features, visionary thoughtful eyes that look into the distance, and eccentric attractive styling.';
      faceEyesHairHi = 'अपरंपरागत आधुनिक चेहरा, दूरगामी सोच से भरी विचारवान आंखें और एक विशिष्ट, आकर्षक व्यक्तित्व।';
      break;
    default: // Pisces
      faceEyesHairEn = 'Dreamy, large and moist hypnotic eyes, soft lips, gentle peaceful facial radiance, and wavy flowing hair with soothing expression.';
      faceEyesHairHi = 'सपनों में खोई हुई बड़ी-बड़ी सजल व सम्मोहक आंखें, कोमल होंठ, शांत सौम्य मुखमंडल और लहराते हुए बाल।';
      break;
  }

  // 1d. Drekkana Body Marks, Scars & Moles (तिल, मस्सा व चोट के निशान)
  // Classical Varahamihira Drekkana Division (Brihat Jataka)
  const deg = asc.degreeInSign;
  const drekkanaNum = deg < 10 ? 1 : deg < 20 ? 2 : 3;
  const molesAndMarksEn: string[] = [];
  const molesAndMarksHi: string[] = [];

  if (drekkanaNum === 1) {
    // 0° to 10°: Head, Face, Forehead, Neck
    molesAndMarksEn.push('Prominent black or brown mole on the forehead, temple, or near the right eyebrow.');
    molesAndMarksHi.push('माथे, कनपटी अथवा दाहिनी भौंह के समीप एक स्पष्ट काला या भूरा तिल विद्यमान है।');
    if (mars.rasiHouseNumber === 1 || mars.rasiHouseNumber === 7 || mars.rasiHouseNumber === 8) {
      molesAndMarksEn.push('Childhood injury mark or burn scar on the forehead, hairline, or chin resulting from a physical fall.');
      molesAndMarksHi.push('बचपन में गिरने या चोट लगने के कारण सिर, माथे की रेखा अथवा ठुड्डी पर एक पुराना घाव या टांके का निशान।');
    }
    if (venus.rasiHouseNumber === 1 || venus.rasiHouseNumber === 2 || venus.rasiHouseNumber === 7) {
      molesAndMarksEn.push('Charming beauty spot or tiny mole near the upper lip, left cheek, or collarbone.');
      molesAndMarksHi.push('ऊपरी होंठ के पास, बाएं गाल अथवा कॉलरबोन (हंसली) पर एक अत्यंत आकर्षक सौंदर्य-तिल (Beauty Spot)।');
    }
  } else if (drekkanaNum === 2) {
    // 10° to 20°: Throat, Shoulders, Chest, Arms, Upper Back
    molesAndMarksEn.push('Distinct mole or birthmark across the chest, right shoulder blade, or upper back near the spine.');
    molesAndMarksHi.push('छाती, दाहिने कंधे, हंसली की हड्डी अथवा रीढ़ की ऊपरी पीठ पर एक स्पष्ट तिल अथवा जन्मजात लांछन।');
    if (saturn.rasiHouseNumber === 1 || saturn.rasiHouseNumber === 3 || saturn.rasiHouseNumber === 10) {
      molesAndMarksEn.push('Dark permanent mole on the right arm, elbow joint, or shoulder signifying heavy manual responsibility.');
      molesAndMarksHi.push('दाहिनी भुजा, कोहनी अथवा कंधे पर एक गहरा काला तिल जो जातक पर कंधों पर भारी उत्तरदायित्व का प्रतीक है।');
    }
    if (rahu.rasiHouseNumber === 1 || rahu.rasiHouseNumber === 11) {
      molesAndMarksEn.push('Noticeable pigmented patch or cluster of tiny moles on the left ribcage or upper arm.');
      molesAndMarksHi.push('बाईं पसलियों अथवा बांह पर एक विशिष्ट मस्सा, लांछन या तिल का छोटा गुच्छा।');
    }
  } else {
    // 20° to 30°: Lower Abdomen, Waist, Hips, Knees, Feet
    molesAndMarksEn.push('Hidden mole or dark birthmark near the navel, lower waistline, or right hip joint.');
    molesAndMarksHi.push('नाभि के समीप, कमर के निचले हिस्से अथवा दाहिने कूल्हे पर एक गुप्त तिल या तिल-चिह्न।');
    if (mars.rasiHouseNumber === 1 || mars.rasiHouseNumber === 6 || mars.rasiHouseNumber === 8) {
      molesAndMarksEn.push('Childhood injury scar or burn mark on the knee, shin, or ankle from bicycle/sports fall.');
      molesAndMarksHi.push('घुटने, पैर की पिंडली अथवा टखने पर खेलकूद या वाहन से गिरने का पुराना चोट या छिलने का निशान।');
    }
    if (moon.rasiHouseNumber === 1 || moon.rasiHouseNumber === 4) {
      molesAndMarksEn.push('Light birthmark or mole on the left thigh, calf, or sole of the foot indicating constant travel.');
      molesAndMarksHi.push('बाईं जांघ, पिंडली अथवा पैर के तलवे पर एक हल्का तिल जो निरंतर यात्राओं का योग बनाता है।');
    }
  }

  const causeEn = `Classical Astrological Cause: Brihat Jataka (Ch. 2) & Parashara Drekkana rules. Ascendant sign is ${asc.signName} (${ascElem} element, ruled by ${ascLord}), rising in Drekkana ${drekkanaNum} (${deg.toFixed(1)}°). Planetary aspects from ${in1st.length > 0 ? in1st.map((p) => p.id).join(', ') : 'Lagna Lord ' + ascLord} sculpt the physical hardware, complexion, and exact bodily marks.`;
  const causeHi = `शास्त्रीय कारण: वराहमिहिर के 'बृहज्जातक' (द्रेष्काण अध्याय) एवं पाराशरी सिद्धांत: जन्म लग्न '${SIGN_HI[asc.signIndex]}' (${ascElem} तत्व, स्वामी: ${PLANET_HI[ascLord] || ascLord}) है, जिसका उदय द्रेष्काण ${drekkanaNum} (${deg.toFixed(1)} अंश) में हुआ है। लग्न पर स्थित व दृष्टि डालने वाले ग्रहों के प्रभाव से देह की लंबाई, अस्थि-ढांचा, वर्ण एवं तिल-चिह्नों का अचूक निर्धारण होता है।`;

  const section: ChapterSection = {
    titleEn: 'Physical Appearance, Stature, Complexion, Facial Features & Body Marks',
    titleHi: 'शारीरिक रूप-रंग, कद-काठी, मुखाकृति, नेत्र एवं तिल व घाव के निशान',
    leadEn: 'Exact physical constitution, height bracket, bone structure, facial countenance, and birthmarks.',
    leadHi: 'लग्न, लग्नेश एवं द्रेष्काण द्वारा निर्धारित देह की बनावट, रूप-रंग, नैन-नक्श और तिल व चोट के निश्चित स्थान।',
    paragraphsEn: [
      `Your physical framework is fundamentally governed by ${asc.signName} Ascendant (${ascElem} element) with Lagnesha ${ascLord}. In stature, you measure in the category of: ${heightStatureEn}. ${buildFrameEn}`,
      `Your natural skin complexion reflects: ${complexionEn}. Your facial architecture is characterized by: ${faceEyesHairEn}`,
      `Classical Drekkana Markings (Moles, Scars & Birthmarks): According to Maharshi Parashara and Varahamihira's Drekkana division (your Ascendant rises in the ${drekkanaNum === 1 ? '1st Drekkana (Head/Face)' : drekkanaNum === 2 ? '2nd Drekkana (Chest/Shoulders)' : '3rd Drekkana (Waist/Limbs)'}), you possess distinct physical identification markers: (1) ${molesAndMarksEn[0]} ${(molesAndMarksEn[1] ? `(2) ${molesAndMarksEn[1]}` : '')} ${(molesAndMarksEn[2] ? `(3) ${molesAndMarksEn[2]}` : '')}`,
    ],
    paragraphsHi: [
      `आपकी स्थूल देह का मूल ढांचा '${SIGN_HI[asc.signIndex]}' लग्न (${ascElem} तत्व) तथा लग्नेश '${PLANET_HI[ascLord] || ascLord}' द्वारा गढ़ा गया है। कद-काठी की दृष्टि से आपका स्वरूप '${heightStatureHi}' वर्ग में आता है। ${buildFrameHi}`,
      `आपकी स्वाभाविक शारीरिक त्वचा का रंग '${complexionHi}' है। आपकी मुखाकृति, नैन-नक्श एवं केश-विन्यास का यथार्थ स्वरूप: ${faceEyesHairHi}`,
      `शास्त्रीय तिल, मस्सा व चोट के निशान (द्रेष्काण सिद्धांत): महर्षि पाराशर एवं वराहमिहिर के अनुसार आपका लग्न द्रेष्काण संख्या ${drekkanaNum} (${drekkanaNum === 1 ? 'शीर्ष/मुख भाग' : drekkanaNum === 2 ? 'कंधा/वक्षस्थल भाग' : 'कटि/पाद भाग'}) में उदय हुआ है। आपके शरीर पर निम्नलिखित पहचान-चिह्न निश्चित रूप से विद्यमान हैं: (1) ${molesAndMarksHi[0]} ${(molesAndMarksHi[1] ? `(2) ${molesAndMarksHi[1]}` : '')} ${(molesAndMarksHi[2] ? `(3) ${molesAndMarksHi[2]}` : '')}`,
    ],
    astrologicalCauseEn: causeEn,
    astrologicalCauseHi: causeHi,
    keyPointsEn: [
      `Stature & Frame: ${heightStatureEn}`,
      `Complexion: ${complexionEn}`,
      `Facial Architecture: ${faceEyesHairEn.split('.')[0]}`,
      `Prominent Marks: ${molesAndMarksEn[0]}`,
    ],
    keyPointsHi: [
      `कद व बनावट: ${heightStatureHi.split('(')[0].trim()}`,
      `रूप-रंग: ${complexionHi.split('(')[0].trim()}`,
      `मुखाकृति: ${faceEyesHairHi.split('।')[0]}`,
      `तिल व निशान: ${molesAndMarksHi[0]}`,
    ],
  };

  return {
    section,
    data: {
      heightStatureEn,
      heightStatureHi,
      buildFrameEn,
      buildFrameHi,
      complexionEn,
      complexionHi,
      faceEyesHairEn,
      faceEyesHairHi,
      molesAndMarksEn,
      molesAndMarksHi,
    },
  };
}

// ============================================================================
// 2. EDUCATION, SCHOOLING, COLLEGE STREAM & COMPETITIVE ENTRANCE EXAMS
// ============================================================================
export interface EducationAcademicsResult {
  section: ChapterSection;
  data: {
    schoolYearsEn: string;
    schoolYearsHi: string;
    collegeStreamsEn: string[];
    collegeStreamsHi: string[];
    competitiveExamVerdictEn: string;
    competitiveExamVerdictHi: string;
    competitiveCrackAgeWindowEn: string;
    competitiveCrackAgeWindowHi: string;
    higherStudiesAbroadEn: string;
    higherStudiesAbroadHi: string;
  };
}

export function computeEducationAcademics(chart: ChartData): EducationAcademicsResult {
  const asc = chart.ascendant;
  const h4Sign = (asc.signIndex + 3) % 12;
  const h4Lord = SIGNS[h4Sign].lord;
  const h5Sign = (asc.signIndex + 4) % 12;
  const h5Lord = SIGNS[h5Sign].lord;
  const h9Sign = (asc.signIndex + 8) % 12;
  const h9Lord = SIGNS[h9Sign].lord;

  const sun = chart.planets.find((p) => p.id === 'Sun')!;
  const moon = chart.planets.find((p) => p.id === 'Moon')!;
  const mars = chart.planets.find((p) => p.id === 'Mars')!;
  const mercury = chart.planets.find((p) => p.id === 'Mercury')!;
  const jupiter = chart.planets.find((p) => p.id === 'Jupiter')!;
  const venus = chart.planets.find((p) => p.id === 'Venus')!;
  const saturn = chart.planets.find((p) => p.id === 'Saturn')!;
  const rahu = chart.planets.find((p) => p.id === 'Rahu')!;
  const ketu = chart.planets.find((p) => p.id === 'Ketu')!;

  // 2a. School Days Persona (4th house & Mercury)
  const isMercAfflicted = [saturn.rasiHouseNumber, rahu.rasiHouseNumber, mars.rasiHouseNumber].includes(mercury.rasiHouseNumber);
  let schoolYearsEn = '';
  let schoolYearsHi = '';

  if (!isMercAfflicted && ['Exalted', 'Own Sign', 'Moolatrikona'].includes(mercury.dignity)) {
    schoolYearsEn = 'Intellectually gifted and obedient student who absorbed curricula effortlessly. Admired by teachers, excelled in languages and mathematics, and maintained high academic ranks with disciplined focus.';
    schoolYearsHi = 'कुशाग्र बुद्धि व आज्ञाकारी विद्यार्थी जिसने पाठ्यक्रम को बिना अधिक दबाव के आत्मसात किया। शिक्षकों के प्रिय रहे, गणित व भाषा में उत्कृष्ट प्रदर्शन किया और अनुशासित रहकर उच्च श्रेणी प्राप्त की।';
  } else if (isMercAfflicted || [6, 8, 12].includes(mercury.rasiHouseNumber)) {
    schoolYearsEn = 'Non-conformist creative learner who despised rigid rote memorization. Highly intelligent in subjects that sparked curiosity, but bored and restless during mechanical drills. Experienced classroom daydreaming, occasional changes in schooling environment, and exam marks that fluctuated strictly according to emotional interest.';
    schoolYearsHi = 'स्वतंत्र विचारों वाले जिज्ञासु विद्यार्थी जो रटने की परंपरागत प्रणाली से घृणा करते थे। जिन विषयों में रुचि थी उनमें अद्वितीय प्रतिभा दिखाई, किंतु अरुचिकर विषयों में केवल औपचारिकता निभाई। पढ़ाई के दौरान मन का भटकना, परीक्षा के समय तनाव, और विद्यालय परिवर्तन के अनुभव रहे।';
  } else {
    schoolYearsEn = 'Balanced, hardworking and pragmatic schooling years. Solid foundational learning, reliable exam performance under steady routine, and active participation in co-curricular debates and sports.';
    schoolYearsHi = 'संतुलित, कर्मठ व व्यावहारिक स्कूली जीवन। स्थिर दिनचर्या के साथ परीक्षाओं में उत्तम प्रदर्शन किया और पढ़ाई के साथ-साथ वाद-विवाद अथवा खेलकूद में सक्रिय सहभागिता निभाई।';
  }

  // 2b. Ideal College Streams (5th house, D24 Siddhamsha & planetary clusters)
  const idealStreamsEn: string[] = [];
  const idealStreamsHi: string[] = [];

  // Stream 1: STEM / Engineering / Computer Science / Data
  if ([mars.rasiHouseNumber, saturn.rasiHouseNumber, rahu.rasiHouseNumber].some((h) => [1, 5, 10].includes(h))) {
    idealStreamsEn.push('STEM, Computer Science & Systems Engineering: Software architecture, AI/Data systems, Mechanical/Civil infrastructure, Electronics, Robotics, and Technical Project Management.');
    idealStreamsHi.push('इंजीनियरिंग, कंप्यूटर विज्ञान एवं तकनीकी प्रणालियां: सॉफ्टवेयर आर्किटेक्चर, डेटा/एआई सिस्टम, इलेक्ट्रॉनिक्स, मैकेनिकल/सिविल इंफ्रास्ट्रक्चर व रोबोटिक्स।');
  }

  // Stream 2: Commerce / CA / Investment Banking / Corporate Finance
  if ([mercury.rasiHouseNumber, jupiter.rasiHouseNumber, venus.rasiHouseNumber].some((h) => [2, 5, 11].includes(h))) {
    idealStreamsEn.push('Finance, Chartered Accountancy & Commercial Economics: Corporate Finance, Audit, Investment Banking, Stock Market Analysis, Taxation, and Global Trade Management.');
    idealStreamsHi.push('वाणिज्य, सीए (Chartered Accountancy) एवं वित्तीय प्रबंधन: कॉर्पोरेट वित्त, ऑडिटिंग, इन्वेस्टमेंट बैंकिंग, शेयर बाजार विश्लेषण, कराधान व वैश्विक व्यापार।');
  }

  // Stream 3: Medicine / Surgery / Pharmaceuticals / Bio-Tech
  if ([sun.rasiHouseNumber, mars.rasiHouseNumber, moon.rasiHouseNumber].some((h) => [6, 8, 10, 12].includes(h))) {
    idealStreamsEn.push('Medical Sciences, Surgery & Healthcare Diagnostics: MBBS, Clinical Pharmacology, Biotechnology, Surgery, Public Health Administration, and Diagnostic Pathology.');
    idealStreamsHi.push('चिकित्सा विज्ञान, शल्यक्रिया एवं बायो-टेक्नोलॉजी: एमबीबीएस, सर्जरी, फार्मेसी, बायो-इंजीनियरिंग, जन-स्वास्थ्य प्रशासन व पैथोलॉजी डायग्नोस्टिक्स।');
  }

  // Stream 4: Law / Judiciary / Civil Services / Public Policy
  if ([sun.rasiHouseNumber, jupiter.rasiHouseNumber, saturn.rasiHouseNumber].some((h) => [6, 9, 10].includes(h))) {
    idealStreamsEn.push('Law, Judicial Services & Public Administration: Corporate Law, Constitutional Jurisprudence, UPSC Civil Services, Public Policy, Arbitration, and High-Stakes Legal Advocacy.');
    idealStreamsHi.push('विधि, न्यायिक सेवा एवं लोक प्रशासन: कॉर्पोरेट लॉ, संवैधानिक कानून, सिविल सेवा (UPSC/PCS), सार्वजनिक नीति व न्यायिक परामर्श।');
  }

  // Fallback if needed
  if (idealStreamsEn.length < 2) {
    idealStreamsEn.push('Creative Design, Architecture & Media Communication: Architectural Design, Digital Media, Journalism, Visual Arts, and High-Impact Strategic Communications.');
    idealStreamsHi.push('वास्तुशिल्प, डिजाइन एवं मीडिया संचार: आर्किटेक्चरल डिजाइन, डिजिटल मीडिया, पत्रकारिता, विजुअल आर्ट्स व जन-संचार।');
  }

  // 2c. Competitive Entrance Exams (प्रतियोगी परीक्षाएं - UPSC, PSC, SSC, GATE, CAT, JEE, NEET, Banking)
  const isSunStrong = ['Exalted', 'Own Sign', 'Moolatrikona'].includes(sun.dignity) || [1, 5, 9, 10].includes(sun.rasiHouseNumber);
  const isH6Strong = [mars.rasiHouseNumber, saturn.rasiHouseNumber, sun.rasiHouseNumber].includes(6) || [1, 10].includes(chart.planets.find((p) => p.id === SIGNS[(asc.signIndex + 5) % 12].lord)?.rasiHouseNumber ?? 0);

  let competitiveExamVerdictEn = '';
  let competitiveExamVerdictHi = '';
  let competitiveCrackAgeWindowEn = 'Ages 22 to 27 (Peak Focus Epoch: 23–25)';
  let competitiveCrackAgeWindowHi = '22 से 27 वर्ष की आयु (स्वर्णिम अवसर: 23 से 25 वर्ष)';

  if (isSunStrong && isH6Strong) {
    competitiveExamVerdictEn = 'Exceptional Competitive Aptitude (High Rank Cracking Probability): Endowed with ruthless exam focus, mental endurance under time constraints, and natural ability to outshine massive candidate pools. Highly favorable for UPSC Civil Services, State PSC, Judicial Service, GATE, and Top-Tier Banking/Defense Examinations.';
    competitiveExamVerdictHi = 'असाधारण प्रतियोगी परीक्षा योग (उच्च रैंक प्राप्त करने की प्रबल संभावना): समय के दबाव में शांत रहने, लाखों परीक्षार्थियों की भीड़ में अलग चमकने और निरंतर 10-12 घंटे अध्ययन करने की अदम्य क्षमता। यूपीएससी सिविल सेवा, राज्य लोक सेवा आयोग (PCS), न्यायिक सेवा, गेट, तथा प्रतिष्ठित बैंकिंग/सैन्य परीक्षाओं में शीर्ष सफलता के संकेत।';
  } else if (isH6Strong || isSunStrong) {
    competitiveExamVerdictEn = 'Strong Competitive Stamina (Success Through Sustained Second-Attempt Strategy): You possess the intellectual caliber to crack prestigious exams, though the first attempt may fall short by a razor-thin margin due to overthinking or exam-hall anxiety. The decisive breakthrough materializes on the second or third focused attempt.';
    competitiveExamVerdictHi = 'मजबूत प्रतियोगी क्षमता (द्वितीय प्रयास में निर्णायक सफलता का योग): बुद्धि अत्यंत तीव्र है, किंतु प्रथम प्रयास में अति-विचार अथवा परीक्षा कक्ष में घबराहट के कारण कुछ अंकों से चूक हो सकती है। दूसरे अथवा तीसरे व्यवस्थित प्रयास में बाधाएं टूटती हैं और सुनिश्चित सफलता मिलती है।';
  } else {
    competitiveExamVerdictEn = 'Specialized Technical / Professional Route Favored: Your destiny thrives far better through specialized university degrees, direct campus recruitments, corporate domain expertise, or private enterprise rather than wasting prime youth in endless multi-year government exam coaching rat-races.';
    competitiveExamVerdictHi = 'विशिष्ट पेशेवर व तकनीकी मार्ग सर्वाधिक उपयुक्त: आपकी प्रतिभा बहुवर्षीय सरकारी प्रतियोगी परीक्षाओं की अंधी दौड़ में समय नष्ट करने के बजाय सीधे कॉर्पोरेट लीडरशिप, उच्च तकनीकी डिग्रियों, अथवा स्वतंत्र बौद्धिक उद्यम में असाधारण रूप से खिलती है।';
  }

  // 2d. Higher Studies Abroad / Migration (9th house & D24)
  const isH9Movable = [0, 3, 6, 9].includes(h9Sign);
  const is12thConnected = (h9Lord === chart.planets.find((p) => p.id === SIGNS[(asc.signIndex + 11) % 12].lord)?.id) || [9, 12].includes(jupiter.rasiHouseNumber) || rahu.rasiHouseNumber === 9 || rahu.rasiHouseNumber === 12;

  let higherStudiesAbroadEn = '';
  let higherStudiesAbroadHi = '';
  if (is12thConnected || isH9Movable) {
    higherStudiesAbroadEn = 'Strong Foreign Education & Distant Relocation Yoga: Your 9th house of higher learning and 12th house of distant lands create clear pathways for pursuing Master’s degrees, executive fellowships, or advanced research in foreign universities away from your native soil.';
    higherStudiesAbroadHi = 'उच्च शिक्षा हेतु विदेश प्रवास व दूरस्थ अध्ययन योग: नवम भाव (उच्च विद्या) और द्वादश भाव (विदेश) का संबंध यह प्रमाणित करता है कि स्नातकोत्तर (Master\'s), शोध अथवा विशिष्ट फेलोशिप हेतु जन्मभूमि से सैकड़ों मील दूर अथवा विदेश के प्रतिष्ठित विश्वविद्यालयों में शिक्षा प्राप्त करने का प्रबल अवसर बनेगा।';
  } else {
    higherStudiesAbroadEn = 'Domestic Apex Institution Focus: Your educational karma anchors deeply in elite national universities, premier institutes, and localized intellectual hubs, achieving supreme domain authority without permanent foreign relocation.';
    higherStudiesAbroadHi = 'राष्ट्रीय स्तर के शीर्ष संस्थानों में अध्ययन: आपका विद्या प्रारब्ध देश के ही प्रतिष्ठित विश्वविद्यालयों, राष्ट्रीय संस्थानों अथवा प्रमुख ज्ञान-केंद्रों से जुड़कर सर्वोच्च प्रतिष्ठा प्राप्त करने की ओर अग्रसर है।';
  }

  const causeEn = `Classical Astrological Cause: 4th house of foundational schooling in ${SIGNS[h4Sign].name} (Lord: ${h4Lord}), 5th house of higher intellect in ${SIGNS[h5Sign].name} (Lord: ${h5Lord}), 9th house of advanced wisdom in ${SIGNS[h9Sign].name} (Lord: ${h9Lord}), synthesized with Mercury (Vidya Karaka), Jupiter (Jnana Karaka), and Sun (Rajya Karaka).`;
  const causeHi = `शास्त्रीय कारण: चतुर्थ भाव (मूल विद्या) '${SIGN_HI[h4Sign]}' (स्वामी: ${PLANET_HI[h4Lord] || h4Lord}), पंचम भाव (बुद्धि/मेधा) '${SIGN_HI[h5Sign]}' (स्वामी: ${PLANET_HI[h5Lord] || h5Lord}), नवम भाव (उच्च ज्ञान) '${SIGN_HI[h9Sign]}' (स्वामी: ${PLANET_HI[h9Lord] || h9Lord}), तथा विद्या कारक बुध, ज्ञान कारक गुरु व राज्य कारक सूर्य की स्थिति द्वारा प्रमाणित।`;

  const section: ChapterSection = {
    titleEn: 'The Academic Crucible: School Life, College Stream & Competitive Exams',
    titleHi: 'विद्या अर्जन, स्कूल-कॉलेज जीवन, विषय चयन एवं प्रतियोगी परीक्षाएं',
    leadEn: 'Primary schooling temperament, higher academic disciplines, and entrance exam cracking potential.',
    leadHi: 'चतुर्थ व पंचम भाव, बुध व देवगुरु द्वारा संचालित प्राथमिक शिक्षा, कॉलेज की उपयुक्त शाखाएं एवं प्रतियोगी परीक्षाएं।',
    paragraphsEn: [
      `Your school-age learning foundation (4th house ruled by ${h4Lord} & Mercury) unfolded as follows: ${schoolYearsEn}`,
      `Higher Academic Disciplines & Ideal College Streams (5th house ruled by ${h5Lord} & D24 Siddhamsha): Your cognitive wiring excels supremely in: (1) ${idealStreamsEn[0]} (2) ${idealStreamsEn[1]}`,
      `Competitive Entrance Examinations (UPSC, State PSC, SSC, GATE, CAT, NEET, JEE, Banking): ${competitiveExamVerdictEn} The most fertile chronological window to crack high-stakes competitive examinations is: ${competitiveCrackAgeWindowEn}.`,
      `Higher Education, Overseas Migration & Research: ${higherStudiesAbroadEn}`,
    ],
    paragraphsHi: [
      `प्राथमिक व माध्यमिक विद्यालयी शिक्षा का यथार्थ (चतुर्थेश '${PLANET_HI[h4Lord] || h4Lord}' व बुध): ${schoolYearsHi}`,
      `कॉलेज शिक्षा, उच्च अध्ययन एवं उपयुक्त विषय चयन (पंचमेश '${PLANET_HI[h5Lord] || h5Lord}' व सिद्धांश D24): आपकी बौद्धिक क्षमता निम्नलिखित दो प्रमुख संकायों में असाधारण सफलता प्रदान करती है: (1) ${idealStreamsHi[0]} (2) ${idealStreamsHi[1]}`,
      `प्रतियोगी परीक्षाएं (UPSC, राज्य PCS, SSC, बैंक पीओ, गेट, कैट, नीट): ${competitiveExamVerdictHi} प्रतियोगी परीक्षाओं में सर्वोच्च सफलता प्राप्त करने का स्वर्णिम कालखंड: ${competitiveCrackAgeWindowHi} है।`,
      `उच्च शिक्षा, शोध एवं विदेश प्रवास का योग: ${higherStudiesAbroadHi}`,
    ],
    astrologicalCauseEn: causeEn,
    astrologicalCauseHi: causeHi,
    keyPointsEn: [
      `School Persona: ${schoolYearsEn.split('.')[0]}`,
      `Primary Stream: ${idealStreamsEn[0].split(':')[0]}`,
      `Competitive Exam Verdict: ${competitiveExamVerdictEn.split('(')[0].trim()}`,
      `Peak Crack Window: ${competitiveCrackAgeWindowEn}`,
    ],
    keyPointsHi: [
      `स्कूली स्वभाव: ${schoolYearsHi.split('।')[0]}`,
      `सर्वोत्तम संकाय: ${idealStreamsHi[0].split(':')[0]}`,
      `प्रतियोगी परीक्षा फैसला: ${competitiveExamVerdictHi.split('(')[0].trim()}`,
      `परीक्षा स्वर्णिम काल: ${competitiveCrackAgeWindowHi}`,
    ],
  };

  return {
    section,
    data: {
      schoolYearsEn,
      schoolYearsHi,
      collegeStreamsEn: idealStreamsEn,
      collegeStreamsHi: idealStreamsHi,
      competitiveExamVerdictEn,
      competitiveExamVerdictHi,
      competitiveCrackAgeWindowEn,
      competitiveCrackAgeWindowHi,
      higherStudiesAbroadEn,
      higherStudiesAbroadHi,
    },
  };
}

// ============================================================================
// 3. GOVERNMENT JOB VERDICT, VOCATIONS & WORKPLACE HAZARDS
// ============================================================================
export interface CareerVerdictsResult {
  govtJobSection: ChapterSection;
  vocationsSection: ChapterSection;
  hazardsSection: ChapterSection;
  data: {
    govtJobLikelihoodPct: number;
    govtJobVerdictEn: string;
    govtJobVerdictHi: string;
    targetWingsEn: string[];
    targetWingsHi: string[];
    examCrackingAgeWindowEn: string;
    examCrackingAgeWindowHi: string;
    jobVsBusinessRatio: {
      businessPct: number;
      jobPct: number;
      verdictEn: string;
      verdictHi: string;
    };
    topVocationsEn: string[];
    topVocationsHi: string[];
    workplaceHazardsEn: string[];
    workplaceHazardsHi: string[];
  };
}

export function computeCareerVerdicts(chart: ChartData): CareerVerdictsResult {
  const asc = chart.ascendant;
  const h10Sign = (asc.signIndex + 9) % 12;
  const h10Lord = SIGNS[h10Sign].lord;
  const h6Sign = (asc.signIndex + 5) % 12;
  const h6Lord = SIGNS[h6Sign].lord;
  const h7Sign = (asc.signIndex + 6) % 12;
  const h7Lord = SIGNS[h7Sign].lord;
  const h3Sign = (asc.signIndex + 2) % 12;
  const h3Lord = SIGNS[h3Sign].lord;

  const sun = chart.planets.find((p) => p.id === 'Sun')!;
  const mars = chart.planets.find((p) => p.id === 'Mars')!;
  const mercury = chart.planets.find((p) => p.id === 'Mercury')!;
  const jupiter = chart.planets.find((p) => p.id === 'Jupiter')!;
  const saturn = chart.planets.find((p) => p.id === 'Saturn')!;
  const amk = chart.planets.find((p) => p.charaKaraka === 'AmK') ?? mercury;

  // 3a. Government Job Likelihood % Calculation
  let govtScore = 30; // base
  if ([1, 4, 7, 10].includes(sun.rasiHouseNumber)) govtScore += 25;
  else if ([5, 9].includes(sun.rasiHouseNumber)) govtScore += 20;
  else if ([3, 6, 11].includes(sun.rasiHouseNumber)) govtScore += 15;

  if (['Exalted', 'Own Sign', 'Moolatrikona'].includes(sun.dignity)) govtScore += 15;
  else if (sun.dignity === 'Debilitated') govtScore -= 15;

  const h10LordObj = chart.planets.find((p) => p.id === h10Lord);
  if (h10LordObj && [1, 4, 5, 7, 9, 10].includes(h10LordObj.rasiHouseNumber)) govtScore += 15;

  if (['Sun', 'Mars', 'Jupiter'].includes(amk.id)) govtScore += 10;
  if ([5, 7, 9].includes(jupiter.rasiHouseNumber) || jupiter.rasiHouseNumber === 10) govtScore += 10;

  const govtJobLikelihoodPct = Math.min(95, Math.max(22, govtScore));

  let govtJobVerdictEn = '';
  let govtJobVerdictHi = '';
  let examCrackingAgeWindowEn = 'Ages 22 to 28 (Peak Focus: 23–26)';
  let examCrackingAgeWindowHi = '22 से 28 वर्ष की आयु (सर्वोच्च स्वर्णिम काल: 23 से 26 वर्ष)';

  const targetWingsEn: string[] = [];
  const targetWingsHi: string[] = [];

  if (govtJobLikelihoodPct >= 75) {
    govtJobVerdictEn = `High State / Sovereign Authority Yoga (${govtJobLikelihoodPct}% Probability): The alignment of Sun, 10th lord, and Amatyakaraka bestows authentic Rajayoga for government service. You possess the executive dignity and competitive sharpness to enter state machinery with commanding rank.`;
    govtJobVerdictHi = `प्रचंड सरकारी नौकरी एवं राजसत्ता योग (${govtJobLikelihoodPct}% संभावना): सूर्य, दशमेश व अमात्यकारक की युति-दृष्टि से कुंडली में ठोस राजयोग बनता है। आपके भीतर सरकारी तंत्र में उच्च पद, लाल-बत्ती/अधिकारी संवर्ग और प्रशासनिक सम्मान प्राप्त करने की पूर्ण शास्त्रीय पात्रता विद्यमान है।`;
    targetWingsEn.push('Central & State Administrative Civil Services (IAS, IPS, State PCS, SDM, Deputy Collector)');
    targetWingsEn.push('Defense, Police & Paramilitary Officer Cadre (Army/Navy/Air Force Commissioned Officer)');
    targetWingsEn.push('Public Sector Undertakings (PSU Navratnas, ONGC, BHEL, Coal India) Executive Posts');
    targetWingsHi.push('केंद्रीय व राज्य प्रशासनिक सिविल सेवा (IAS, IPS, राज्य लोक सेवा आयोग PCS, एसडीएम, डिप्टी कलेक्टर)');
    targetWingsHi.push('सैन्य, पुलिस एवं अर्धसैनिक बल अधिकारी संवर्ग (कमीशंड सैन्य अधिकारी, डीएसपी/कमांडेंट)');
    targetWingsHi.push('महारत्न/नवरत्न पीएसयू (ONGC, BHEL, NTPC) एवं केंद्रीय सार्वजनिक उपक्रमों में उच्च कार्यकारी पद');
  } else if (govtJobLikelihoodPct >= 50) {
    govtJobVerdictEn = `Competitive Technical / Institutional Government Yoga (${govtJobLikelihoodPct}% Probability): High likelihood in specialized government wings, public sector financial institutions, banking, or semi-autonomous commissions rather than pure generalist administration. Dedicated multi-year preparation yields solid victory.`;
    govtJobVerdictHi = `विशिष्ट तकनीकी, बैंकिंग व संस्थागत सरकारी योग (${govtJobLikelihoodPct}% संभावना): सामान्य प्रशासनिक पदों के बजाय सार्वजनिक क्षेत्र के बैंक (PO/Specialist Officer), रेलवे, स्वायत्त संस्थान, विश्वविद्यालय अथवा अर्ध-सरकारी उपक्रमों में स्थायी सेवा का प्रबल अवसर। सुव्यवस्थित तैयारी से परीक्षा उत्तीर्ण होती है।`;
    targetWingsEn.push('Nationalized Banking & Financial Institutions (RBI Grade B, SBI PO, NABARD, SEBI)');
    targetWingsEn.push('Indian Railways & Public Transport Engineering / Management Cadre');
    targetWingsEn.push('State Education Boards, University Professorship & Scientific Public Research Labs');
    targetWingsHi.push('राष्ट्रीयकृत बैंक एवं वित्तीय नियामक संस्थाएं (RBI ग्रेड बी, SBI पीओ, सेबी, नाबार्ड)');
    targetWingsHi.push('भारतीय रेलवे एवं सार्वजनिक परिवहन प्रबंधन / तकनीकी अधिकारी संवर्ग');
    targetWingsHi.push('राजकीय विश्वविद्यालय, उच्च शिक्षा आयोग, वैज्ञानिक अनुसंधान संस्थान (ISRO/DRDO/CSIR)');
  } else {
    govtJobVerdictEn = `Private Sovereign Leadership & Autonomous Enterprise Favored (${govtJobLikelihoodPct}% Probability): While lower-tier government attempts are possible, the chart resists bureaucratic stagnation. Your destiny commands far greater wealth, executive autonomy, and global respect in independent business, corporate consulting, or private leadership.`;
    govtJobVerdictHi = `स्वतंत्र व्यापार एवं निजी क्षेत्र में सर्वोच्च नेतृत्व योग (${govtJobLikelihoodPct}% संभावना): यद्यपि प्रयास करने पर सामान्य पद मिल सकता है, किंतु आपकी आत्मा सरकारी तंत्र की लालफीताशाही और धीमी पदोन्नति में घुटने लगेगी। आपका वास्तविक प्रारब्ध स्वतंत्र व्यापार, बड़े निजी उद्योग अथवा कॉर्पोरेट सत्ता में अपार धन व कीर्ति कमाने के लिए बना है।`;
    targetWingsEn.push('High-Growth Technology Corporations & Private Multinational Leadership');
    targetWingsEn.push('Independent Commercial Enterprise & High-Volume Trading Ventures');
    targetWingsEn.push('Specialized Corporate Legal, Strategic Management & High-Stakes Consulting');
    targetWingsHi.push('शीर्ष बहुराष्ट्रीय कंपनियां, टेक जायंट्स एवं निजी कॉर्पोरेट लीडरशिप');
    targetWingsHi.push('स्वतंत्र व्यापारिक प्रतिष्ठान, विनिर्माण एवं बड़े पैमाने का कमर्शियल उद्यम');
    targetWingsHi.push('उच्च स्तरीय रणनीतिक सलाहकार, कॉर्पोरेट लीगल व स्वतंत्र परामर्श सेवाएं');
  }

  // 3b. Job vs Business Percentage Split
  const bizScore = ([1, 5, 7, 10, 11].includes(chart.planets.find((p) => p.id === h7Lord)?.rasiHouseNumber ?? 0) ? 35 : 20) +
    ([3, 7, 11].includes(mercury.rasiHouseNumber) ? 25 : 15) +
    ([3, 10].includes(chart.planets.find((p) => p.id === h3Lord)?.rasiHouseNumber ?? 0) ? 20 : 10);
  const isBusinessDominant = bizScore >= 60;

  const businessPct = isBusinessDominant ? 75 : 35;
  const jobPct = 100 - businessPct;
  const jobVsBizVerdictEn = isBusinessDominant
    ? `Definite Verdict: ${businessPct}% Independent Enterprise / Business vs. ${jobPct}% Salaried Hierarchy. While you may hold jobs early to acquire trade secrets and capital, you will inevitably break out to found or lead your own commercial venture.`
    : `Definite Verdict: ${jobPct}% High-Stature Salaried Command vs. ${businessPct}% Strategic Side-Ventures. You achieve peak authority inside structured corporate or governmental institutions where you control large teams without bearing sole enterprise risk.`;
  const jobVsBizVerdictHi = isBusinessDominant
    ? `निर्णायक फैसला: ${businessPct}% स्वतंत्र व्यवसाय/उद्यम बनाम ${jobPct}% वेतनभोगी नौकरी। यद्यपि प्रारंभिक वर्षों में अनुभव व पूंजी हेतु नौकरी आवश्यक हो सकती है, किंतु अंततः आप किसी के अधीन न रहकर स्वयं के व्यापार व स्वतंत्र सत्ता के स्वामी बनेंगे।`
    : `निर्णायक फैसला: ${jobPct}% उच्च पदस्थ वेतनभोगी सेवा बनाम ${businessPct}% स्वतंत्र व्यवसाय। आप बड़े सुव्यवस्थित कॉर्पोरेट तंत्र अथवा राज्य संस्थाओं में उच्च पद पर रहकर विशाल टीमों का नेतृत्व करने में सर्वाधिक सफल और तनाव-मुक्त रहेंगे।`;

  // 3c. Top 5 Suitable Vocations
  const topVocationsEn: string[] = [
    '1. Enterprise Technology & Software Architecture (AI, Cloud, Systems Engineering & Digital Platforms)',
    '2. Wealth Portfolio Advisory & Strategic Financial Management (Investment Banking, Real Estate & Capital Markets)',
    '3. High-Stakes Corporate Legal Strategy, Regulatory Arbitration & Intellectual Property Counsel',
    '4. Industrial Manufacturing, Supply Chain Logistics & Infrastructure Contracting',
    '5. Specialized Healthcare Diagnostics, Pharmaceutical Biotechnology & Clinical Research Leadership',
  ];
  const topVocationsHi: string[] = [
    '1. एंटरप्राइज टेक्नोलॉजी एवं सॉफ्टवेयर आर्किटेक्चर (एआई, क्लाउड कंप्यूटिंग, सिस्टम्स डिजाइन व डिजिटल प्लेटफॉर्म्स)',
    '2. रणनीतिक धन-प्रबंधन, वित्तीय परामर्श एवं पूंजी बाजार (इन्वेस्टमेंट बैंकिंग, रियल एस्टेट व कमर्शियल एसेट्स)',
    '3. उच्च स्तरीय कॉर्पोरेट लीगल स्ट्रैटेजी, बौद्धिक संपदा (IPR) एवं विवाद मध्यस्थता परामर्श',
    '4. औद्योगिक विनिर्माण, आपूर्ति श्रृंखला (Supply Chain/Logistics) एवं इंफ्रास्ट्रक्चर कॉन्ट्रैक्टिंग',
    '5. स्वास्थ्य सेवा डायग्नोस्टिक्स, फार्मास्युटिकल बायो-टेक्नोलॉजी एवं क्लीनिकल रिसर्च मैनेजमेंट',
  ];

  // 3d. Workplace Hazards & Politics
  const workplaceHazardsEn: string[] = [
    'Envious Peer Factions: Colleagues who smile in public but secretly complain to superiors to dilute your promotions (6th house friction).',
    'Toxic Micro-Managing Bosses: Superiors who feel threatened by your natural intellectual dominance and attempt to overload you with mundane administrative drudgery.',
    'Contractual & Documentation Traps: Unwritten agreements or verbal promises of equity/bonuses that are dishonored when profits materialize.',
    'Sudden Relocation or Structural Reorganizations: Periodic corporate restructuring that attempts to derail your established comfort zone.',
  ];
  const workplaceHazardsHi: string[] = [
    'ईर्ष्यालु सहकर्मियों का गुप्त गुट: सामने प्रशंसा करने वाले किंतु पीठ पीछे उच्चाधिकारियों के कान भरकर पदोन्नति अटकाने वाले सहकर्मी (षष्ठ भाव का प्रभाव)।',
    'असुरक्षित व अहंकारी उच्चाधिकारी: ऐसे अधिकारी जो आपकी प्रखर बुद्धि से स्वयं को असुरक्षित अनुभव करते हैं और आपको व्यर्थ की कागजी औपचारिकताओं में उलझाकर दबाने का प्रयास करते हैं।',
    'मौखिक वादों व अनुबंधों का टूटना: बिना लिखित समझौते के किए गए कार्य, जहां लाभ होने पर वादे किए गए हिस्से या बोनस से मुकर जाने की प्रवृत्ति।',
    'आकस्मिक स्थानांतरण अथवा विभागीय पुनर्गठन: समय-समय पर संस्थागत फेरबदल के कारण बनी-बनाई व्यवस्था में अप्रत्याशित व्यवधान।',
  ];

  const govtCauseEn = `Classical Astrological Cause: Sun (Atmakaraka & Rajya Karaka) in House ${sun.rasiHouseNumber} (${sun.signName}, ${sun.dignity}), 10th House of Governance in ${SIGNS[h10Sign].name} (Lord: ${h10Lord} in H${h10LordObj?.rasiHouseNumber || 1}), Amatyakaraka ${amk.id}, and 6th House of competitive conquest in ${SIGNS[h6Sign].name}.`;
  const govtCauseHi = `शास्त्रीय कारण: सूर्य देव (राजसत्ता व आत्म कारक) भाव ${sun.rasiHouseNumber} में (${SIGN_HI[sun.signIndex]} राशि, ${sun.dignity}), दशम भाव (राज्य स्थान) '${SIGN_HI[h10Sign]}' (स्वामी: ${PLANET_HI[h10Lord] || h10Lord} भाव ${h10LordObj?.rasiHouseNumber || 1} में), अमात्यकारक '${PLANET_HI[amk.id] || amk.id}', तथा षष्ठ भाव (प्रतियोगिता विजय) के बलाबल द्वारा प्रमाणित।`;

  const govtJobSection: ChapterSection = {
    titleEn: 'Government Job (सरकारी नौकरी) Verdict, Target Wings & Exam Cracking Window',
    titleHi: 'सरकारी नौकरी का स्पष्ट फैसला, प्रशासनिक/सैन्य विंग एवं परीक्षा उत्तीर्ण करने का कालखंड',
    leadEn: 'Definite probability score, high-probability state wings, and the peak golden age window to crack exams.',
    leadHi: 'सूर्य, दशमेश व अमात्यकारक के आधार पर सरकारी सेवा की संभावना (%), अनुकूलतम विभाग व स्वर्णिम आयु सीमा।',
    paragraphsEn: [
      `The definitive verdict on State / Government Employment in your chart stands at: ${govtJobVerdictEn}`,
      `Most Favorable State Cadres & Target Wings: Based on the combined dignity of your 10th house, Sun, and Mars, the specific public sectors that align with your destiny are: (1) ${targetWingsEn[0]}; (2) ${targetWingsEn[1]}; and (3) ${targetWingsEn[2]}.`,
      `Peak Chronological Window to Crack Competitive Government Exams: ${examCrackingAgeWindowEn}. Investing maximum disciplined labor during this specific age window yields the highest return on merit before planetary dasha sub-periods shift toward private or commercial pursuits.`,
    ],
    paragraphsHi: [
      `आपकी जन्म कुंडली में सरकारी सेवा/नौकरी का निर्णायक फैसला: ${govtJobVerdictHi}`,
      `अनुकूलतम सरकारी विभाग एवं लक्षित संवर्ग: दशम भाव, सूर्य व मंगल के बलाबल के अनुसार आपके प्रारब्ध से मेल खाने वाले तीन मुख्य सरकारी क्षेत्र: (1) ${targetWingsHi[0]}; (2) ${targetWingsHi[1]}; तथा (3) ${targetWingsHi[2]} हैं।`,
      `प्रतियोगी सरकारी परीक्षा निकालने का स्वर्णिम कालखंड: ${examCrackingAgeWindowHi}। इस निश्चित आयु सीमा में की गई एकाग्र तपस्या का फल सर्वाधिक तीव्रता से प्राप्त होता है, क्योंकि इसके उपरांत दशा-क्रम स्वतंत्र व्यापार की ओर अग्रसर होने लगता है।`,
    ],
    astrologicalCauseEn: govtCauseEn,
    astrologicalCauseHi: govtCauseHi,
    keyPointsEn: [
      `Govt Job Likelihood: ${govtJobLikelihoodPct}%`,
      `Verdict: ${govtJobVerdictEn.split('(')[0].trim()}`,
      `Primary Cadre: ${targetWingsEn[0].split('(')[0].trim()}`,
      `Cracking Window: ${examCrackingAgeWindowEn}`,
    ],
    keyPointsHi: [
      `सरकारी नौकरी संभावना: ${govtJobLikelihoodPct}%`,
      `निर्णय: ${govtJobVerdictHi.split('(')[0].trim()}`,
      `सर्वोत्तम विभाग: ${targetWingsHi[0].split('(')[0].trim()}`,
      `परीक्षा स्वर्णिम काल: ${examCrackingAgeWindowHi}`,
    ],
  };

  const vocationsSection: ChapterSection = {
    titleEn: 'Top 5 Most Suitable Vocations & Contemporary Industry Niches',
    titleHi: 'शीर्ष 5 अनुकूलतम समकालीन कार्यक्षेत्र एवं आजीविका के सर्वश्रेष्ठ विकल्प',
    leadEn: 'Concrete professional domains where your cognitive wiring and karmic merit yield maximum authority.',
    leadHi: 'दशम भाव, दशमांश व अमात्यकारक के समन्वय से वे 5 आधुनिक कार्यक्षेत्र जहां आपका प्रभाव व समृद्धि चरम पर होगी।',
    paragraphsEn: [
      `Your chart does not support generic, scattershot career experimentation. Guided by 10th Lord ${h10Lord}, Amatyakaraka ${amk.id}, and the D10 Dashamsha matrix, your professional authority materializes with supreme velocity inside these five concrete contemporary sectors:`,
      `${topVocationsEn.join('\n\n')}`,
      `Job vs. Business Definitive Ratio: ${jobVsBizVerdictEn}`,
    ],
    paragraphsHi: [
      `आपकी कुंडली किसी भी सामान्य या दिशाहीन करियर भटकाव का समर्थन नहीं करती। दशमेश '${PLANET_HI[h10Lord] || h10Lord}', अमात्यकारक '${PLANET_HI[amk.id] || amk.id}' तथा दशमांश चक्र के संयुक्त प्रभाव से निम्नलिखित 5 समकालीन क्षेत्रों में आपकी मेधा और आय सर्वोच्च शिखर पर पहुंचेगी:`,
      `${topVocationsHi.join('\n\n')}`,
      `नौकरी बनाम स्वतंत्र व्यवसाय का सटीक अनुपात: ${jobVsBizVerdictHi}`,
    ],
    astrologicalCauseEn: `Synthesized from D1 10th house in ${SIGNS[h10Sign].name}, Amatyakaraka ${amk.id}, and D10 Dashamsha placements.`,
    astrologicalCauseHi: `शास्त्रीय कारण: लग्न कुंडली में दशम भाव ('${SIGN_HI[h10Sign]}'), अमात्यकारक '${PLANET_HI[amk.id] || amk.id}' एवं दशमांश चक्र (D10) की विशिष्ट ग्रह स्थितियों द्वारा प्रमाणित।`,
    keyPointsEn: topVocationsEn.map((v) => v.split('(')[0].trim()),
    keyPointsHi: topVocationsHi.map((v) => v.split('(')[0].trim()),
  };

  const hazardsSection: ChapterSection = {
    titleEn: 'Workplace Hazards: Office Politics, Treacherous Superiors & Sabotage Defense',
    titleHi: 'कार्यक्षेत्र की गुप्त राजनीति, ईर्ष्यालु सहकर्मी, उच्चाधिकारियों का तनाव व षड्यंत्र से सुरक्षा',
    leadEn: 'The specific professional hazards, contract traps, and interpersonal friction points you will encounter.',
    leadHi: 'षष्ठ भाव व दशम भाव के पाप प्रभाव से कार्यक्षेत्र में उत्पन्न होने वाले गुप्त अवरोध और उनसे बचने के अचूक नियम।',
    paragraphsEn: [
      `No matter how exemplary your talent, every high-achieving chart encounters institutional friction. In your professional journey, the four recurring hazards governed by your 6th house (Lord: ${h6Lord}) and 10th house afflictions are:`,
      `(1) ${workplaceHazardsEn[0]}`,
      `(2) ${workplaceHazardsEn[1]}`,
      `(3) ${workplaceHazardsEn[2]}`,
      `(4) ${workplaceHazardsEn[3]}`,
      `Shastric Defense Strategy: Maintain meticulous written trails for every project milestone. Never celebrate victories in front of peers before contracts are signed. Feed crows with mustard-oil roti on Saturdays to defuse hidden workplace enemies.`,
    ],
    paragraphsHi: [
      `आपकी प्रतिभा चाहे कितनी भी असाधारण क्यों न हो, षष्ठ भाव (शत्रु/प्रतिस्पर्धा) और दशम भाव पर क्रूर ग्रहों के प्रभाव से कार्यक्षेत्र में समय-समय पर गुप्त राजनीति का सामना करना पड़ेगा। आपके पेशेवर जीवन में प्रकट होने वाले 4 प्रमुख अवरोध:`,
      `(1) ${workplaceHazardsHi[0]}`,
      `(2) ${workplaceHazardsHi[1]}`,
      `(3) ${workplaceHazardsHi[2]}`,
      `(4) ${workplaceHazardsHi[3]}`,
      `षड्यंत्रों से बचाव का अचूक शास्त्रीय नियम: कार्यक्षेत्र में कभी भी मौखिक वादों पर भरोसा न करें; प्रत्येक महत्वपूर्ण निर्णय का लिखित रिकॉर्ड रखें। किसी भी बड़ी सफलता का ढिंढोरा अनुबंध पर हस्ताक्षर होने से पूर्व न पीटें। शनिवार को कौओं अथवा कुत्तों को सरसों के तेल की चुपड़ी रोटी देने से गुप्त षड्यंत्र स्वतः निष्प्रभावी हो जाते हैं।`,
    ],
    astrologicalCauseEn: `6th house of hidden workplace enemies ruled by ${h6Lord} in ${SIGNS[h6Sign].name}, combined with Saturn/Rahu transit aspects over the 10th house.`,
    astrologicalCauseHi: `शास्त्रीय कारण: षष्ठ भाव (गुप्त शत्रु/प्रतिस्पर्धा) के स्वामी '${PLANET_HI[h6Lord] || h6Lord}', तथा दशम भाव पर शनि/राहु की क्रूर दृष्टि का समय-समय पर सक्रिय होना।`,
    keyPointsEn: workplaceHazardsEn.map((h) => h.split(':')[0]),
    keyPointsHi: workplaceHazardsHi.map((h) => h.split(':')[0]),
  };

  return {
    govtJobSection,
    vocationsSection,
    hazardsSection,
    data: {
      govtJobLikelihoodPct,
      govtJobVerdictEn,
      govtJobVerdictHi,
      targetWingsEn,
      targetWingsHi,
      examCrackingAgeWindowEn,
      examCrackingAgeWindowHi,
      jobVsBusinessRatio: {
        businessPct,
        jobPct,
        verdictEn: jobVsBizVerdictEn,
        verdictHi: jobVsBizVerdictHi,
      },
      topVocationsEn,
      topVocationsHi,
      workplaceHazardsEn,
      workplaceHazardsHi,
    },
  };
}

// ============================================================================
// 4. EXHAUSTIVE 360° RELATIONAL MATRIX (FAMILY & SOCIAL WEB)
// ============================================================================
export interface RelationalEntity {
  id: string;
  relationEn: string;
  relationHi: string;
  bhavatBhavamEn: string;
  bhavatBhavamHi: string;
  bondStatusEn: string;
  bondStatusHi: string;
  narrativeEn: string;
  narrativeHi: string;
  astrologicalCauseEn: string;
  astrologicalCauseHi: string;
}

export interface RelationalMatrixResult {
  coreFamilySection: ChapterSection;
  extendedKinshipSection: ChapterSection;
  allEntities: RelationalEntity[];
}

export function computeRelationalMatrix(chart: ChartData): RelationalMatrixResult {
  const asc = chart.ascendant;
  const h9Sign = (asc.signIndex + 8) % 12;
  const h9Lord = SIGNS[h9Sign].lord;
  const h4Sign = (asc.signIndex + 3) % 12;
  const h4Lord = SIGNS[h4Sign].lord;
  const h3Sign = (asc.signIndex + 2) % 12;
  const h3Lord = SIGNS[h3Sign].lord;
  const h11Sign = (asc.signIndex + 10) % 12;
  const h11Lord = SIGNS[h11Sign].lord;
  const h5Sign = (asc.signIndex + 4) % 12;
  const h5Lord = SIGNS[h5Sign].lord;
  const h7Sign = (asc.signIndex + 6) % 12;
  const h7Lord = SIGNS[h7Sign].lord;
  const h6Sign = (asc.signIndex + 5) % 12;
  const h6Lord = SIGNS[h6Sign].lord;
  const h12Sign = (asc.signIndex + 11) % 12;
  const h12Lord = SIGNS[h12Sign].lord;
  const h10Sign = (asc.signIndex + 9) % 12;
  const h10Lord = SIGNS[h10Sign].lord;

  const sun = chart.planets.find((p) => p.id === 'Sun')!;
  const moon = chart.planets.find((p) => p.id === 'Moon')!;
  const mars = chart.planets.find((p) => p.id === 'Mars')!;
  const mercury = chart.planets.find((p) => p.id === 'Mercury')!;
  const jupiter = chart.planets.find((p) => p.id === 'Jupiter')!;
  const venus = chart.planets.find((p) => p.id === 'Venus')!;
  const saturn = chart.planets.find((p) => p.id === 'Saturn')!;
  const rahu = chart.planets.find((p) => p.id === 'Rahu')!;
  const ketu = chart.planets.find((p) => p.id === 'Ketu')!;

  const getPlanetByLord = (lordName: string) => chart.planets.find((p) => p.id === lordName);
  const h9LordP = getPlanetByLord(h9Lord);
  const h4LordP = getPlanetByLord(h4Lord);
  const h3LordP = getPlanetByLord(h3Lord);
  const h11LordP = getPlanetByLord(h11Lord);
  const h7LordP = getPlanetByLord(h7Lord);
  const h5LordP = getPlanetByLord(h5Lord);

  // --------------------------------------------------------------------------
  // CLASSICAL CONTINGENCY / DENIAL / ABSENCE YOGAS (महर्षि पाराशर व जैमिनि सूत्र)
  // --------------------------------------------------------------------------
  // A. Pitru Arishta / Early Paternal Loss or Prolonged Absence (पितृ अरिष्ट / वियोग योग)
  const isPitruArishta =
    ([6, 8, 12].includes(sun.rasiHouseNumber) && ([saturn.rasiHouseNumber, rahu.rasiHouseNumber, mars.rasiHouseNumber, ketu.rasiHouseNumber].includes(sun.rasiHouseNumber) || sun.dignity === 'Debilitated')) ||
    (h9LordP && [6, 8].includes(h9LordP.rasiHouseNumber) && (h9LordP.dignity === 'Debilitated' || h9LordP.isCombust)) ||
    ([saturn.rasiHouseNumber, rahu.rasiHouseNumber].includes(9) && mars.rasiHouseNumber === 9);

  // B. Matru Arishta / Early Maternal Loss or Chronic Illness (मातृ अरिष्ट / वियोग योग)
  const isMatruArishta =
    ([6, 8, 12].includes(moon.rasiHouseNumber) && ([saturn.rasiHouseNumber, mars.rasiHouseNumber, rahu.rasiHouseNumber].includes(moon.rasiHouseNumber) || moon.dignity === 'Debilitated')) ||
    (h4LordP && [6, 8].includes(h4LordP.rasiHouseNumber) && (h4LordP.dignity === 'Debilitated' || h4LordP.isCombust)) ||
    (saturn.rasiHouseNumber === 4 && mars.rasiHouseNumber === 4);

  // C. Sibling Absence / Only Child / Youngest / Eldest (एकल संतान / भ्राता-भगिनी विहीन योग)
  const isOnlyChild =
    Boolean(
      h3LordP &&
      [6, 8, 12].includes(h3LordP.rasiHouseNumber) &&
      (h3LordP.dignity === 'Debilitated' || h3LordP.isCombust || [saturn.rasiHouseNumber, ketu.rasiHouseNumber].includes(h3LordP.rasiHouseNumber)) &&
      h11LordP &&
      [6, 8, 12].includes(h11LordP.rasiHouseNumber) &&
      ([saturn.rasiHouseNumber, ketu.rasiHouseNumber].includes(3) || [saturn.rasiHouseNumber, ketu.rasiHouseNumber].includes(11) || mars.rasiHouseNumber === 8)
    );

  const noYoungerSiblings =
    !isOnlyChild &&
    Boolean(
      (h3LordP && [6, 8, 12].includes(h3LordP.rasiHouseNumber)) ||
      [saturn.rasiHouseNumber, ketu.rasiHouseNumber].includes(3) ||
      mars.rasiHouseNumber === 8
    );

  const noElderSiblings =
    !isOnlyChild &&
    Boolean(
      (h11LordP && [6, 8, 12].includes(h11LordP.rasiHouseNumber)) ||
      [saturn.rasiHouseNumber, ketu.rasiHouseNumber].includes(11)
    );

  // D. Denial of Marriage / Celibacy / Bachelorhood (विवाह हीन / नैष्ठिक ब्रह्मचर्य योग)
  const isMarriageDenial =
    Boolean(
      h7LordP &&
      [6, 8, 12].includes(h7LordP.rasiHouseNumber) &&
      (h7LordP.dignity === 'Debilitated' || h7LordP.isCombust || [saturn.rasiHouseNumber, ketu.rasiHouseNumber].includes(h7LordP.rasiHouseNumber)) &&
      ([saturn.rasiHouseNumber, ketu.rasiHouseNumber].includes(venus.rasiHouseNumber) || venus.dignity === 'Debilitated' || [6, 8, 12].includes(venus.rasiHouseNumber))
    );

  // E. Progeny Denial / Childlessness / Adoption (संतान हीन / दत्तक योग)
  const isProgenyDenial =
    Boolean(
      h5LordP &&
      [6, 8, 12].includes(h5LordP.rasiHouseNumber) &&
      (h5LordP.dignity === 'Debilitated' || h5LordP.isCombust) &&
      ([6, 8, 12].includes(jupiter.rasiHouseNumber) || [rahu.rasiHouseNumber, saturn.rasiHouseNumber].includes(5) || [rahu.rasiHouseNumber, saturn.rasiHouseNumber].includes(jupiter.rasiHouseNumber))
    );

  const allEntities: RelationalEntity[] = [];

  // 1. Father (पिता - 9th house, Sun, Pitru Karaka)
  const isFatherFriction = [saturn.rasiHouseNumber, rahu.rasiHouseNumber, mars.rasiHouseNumber].includes(sun.rasiHouseNumber) || sun.dignity === 'Debilitated';
  allEntities.push({
    id: 'father',
    relationEn: 'Father (Pita)',
    relationHi: 'पिता (धर्म व पितृ कारक)',
    bhavatBhavamEn: '9th House (Bhagya/Dharma) & Surya (Natural Pitru Karaka)',
    bhavatBhavamHi: 'नवम भाव (धर्म/भाग्य) एवं सूर्य देव (नैसर्गिक पितृ कारक)',
    bondStatusEn: isPitruArishta
      ? 'Early Loss / Physical Absence / Prolonged Separation (Pitru Arishta Yoga)'
      : isFatherFriction
      ? 'Ideological Friction / High Expectations (Respect with Distance)'
      : 'Deep Reverence, Protective Guidance & Karmic Heritage',
    bondStatusHi: isPitruArishta
      ? 'अल्पायु / शीघ्र पितृ वियोग अथवा पिता की दीर्घकालिक अनुपस्थिति (पितृ अरिष्ट योग)'
      : isFatherFriction
      ? 'वैचारिक मतभेद व उच्च अपेक्षाएं (मर्यादित आदर, किंतु मानसिक दूरी)'
      : 'गहरा आदर, संरक्षक मार्गदर्शन एवं पैतृक संस्कारों का संवर्धन',
    narrativeEn: isPitruArishta
      ? 'Classical Pitru Arishta / Viyoga Yoga is active in your chart due to heavy malefic affliction to the Sun and 9th lord. This signals early physical separation from the father, father’s premature demise, or prolonged physical estrangement (father living in distant exile/work, or complete emotional absence during your formative upbringing). You were compelled by circumstance to become self-reliant and bear heavy adult responsibilities far before your peers.'
      : isFatherFriction
      ? 'A relationship characterized by deep filial respect yet marked by unspoken emotional distance and stubborn clashes of ego. Your father possessed high, unbending standards and was often critical of your unconventional ambitions. While he provided material foundation, you felt emotionally misunderstood during early adulthood. Health vulnerabilities for the father center on bones, blood pressure, and heart vitality.'
      : 'A fundamentally supportive and dharmic anchor. Your father acts as a guiding pillar whose principles, social standing, and moral reputation open doors for your worldly advancement. Even during inevitable disagreements, mutual honor remains intact, and paternal blessings shield you from legal and career crises.',
    narrativeHi: isPitruArishta
      ? 'शास्त्रीय पितृ अरिष्ट अथवा दीर्घ वियोग योग: कुंडली में सूर्य देव एवं नवमेश पर क्रूर ग्रहों के प्रभाव से पिता का सान्निध्य अल्पायु में छूटने, पिता के शीघ्र देहावसान, गंभीर अस्वस्थता, अथवा पिता से अत्यधिक दूरी/अनुपस्थिति का योग बनता है। जातक को बाल्यकाल या युवावस्था में पिता के छत्रछाया के अभाव का सामना करना पड़ा और जीवन की जिम्मेदारियों का बोझ बहुत कम उम्र में स्वयं के कंधों पर उठाना पड़ा।'
      : isFatherFriction
      ? 'पिता के साथ संबंध में आदर तो गहरा है, किंतु भीतर ही भीतर एक अनकहा वैचारिक तनाव और अहंकार का टकराव बना रहता है। पिता के सिद्धांत अत्यंत कठोर रहे हैं और वे आपकी अपरंपरागत सोच को आसानी से स्वीकार नहीं कर पाते। यद्यपि उन्होंने आपकी परवरिश में कोई कमी नहीं छोड़ी, किंतु युवावस्था में आपने उनसे भावनात्मक दूरी अनुभव की। पिता के स्वास्थ्य में नेत्र, रक्तचाप व हड्डियों की संवेदनशीलता के प्रति सजग रहना आवश्यक है।'
      : 'पिता का सान्निध्य आपके जीवन का सबसे बड़ा धर्म-आधार है। पिता के संस्कार, सामाजिक प्रतिष्ठा और नैतिक मार्गदर्शन ने आपके करियर की नींव को मजबूत किया है। मतभेदों के बाद भी आपसी मर्यादा कभी भंग नहीं होती, और उनका आशीर्वाद आपके संकटों को हरने वाला रक्षा-कवच बनता है।',
    astrologicalCauseEn: isPitruArishta
      ? `Sun afflicted in House ${sun.rasiHouseNumber} (${sun.signName}, ${sun.dignity}) and 9th house/lord suffering malefic aspect (Pitru Arishta).`
      : `Sun in House ${sun.rasiHouseNumber} (${sun.signName}, ${sun.dignity}) and 9th House ruled by ${h9Lord} in ${SIGNS[h9Sign].name}.`,
    astrologicalCauseHi: isPitruArishta
      ? `शास्त्रीय कारण: सूर्य देव भाव ${sun.rasiHouseNumber} में पीड़ित तथा नवमेश '${PLANET_HI[h9Lord] || h9Lord}' पर क्रूर ग्रहों का प्रभाव (पितृ अरिष्ट योग)।`
      : `शास्त्रीय कारण: नवमेश '${PLANET_HI[h9Lord] || h9Lord}' तथा पितृ कारक सूर्य देव की भाव ${sun.rasiHouseNumber} में अवस्थिति।`,
  });

  // 2. Mother (माता - 4th house, Moon, Matru Karaka)
  const isMotherFriction = [saturn.rasiHouseNumber, rahu.rasiHouseNumber, ketu.rasiHouseNumber].includes(moon.rasiHouseNumber) || [6, 8, 12].includes(moon.rasiHouseNumber);
  allEntities.push({
    id: 'mother',
    relationEn: 'Mother (Mata)',
    relationHi: 'माता (सुख व मातृ कारक)',
    bhavatBhavamEn: '4th House (Matru/Sukha Bhava) & Chandra (Natural Matru Karaka)',
    bhavatBhavamHi: 'चतुर्थ भाव (मातृ/सुख स्थान) एवं चंद्र देव (नैसर्गिक मातृ कारक)',
    bondStatusEn: isMatruArishta
      ? 'Early Maternal Loss / Health Vulnerability / Physical Distance (Matru Arishta Yoga)'
      : isMotherFriction
      ? 'Sacrificial, Intense & Emotionally Complex (Anxiety Transfer)'
      : 'Pure Nurturing Sanctuary, Domestic Anchor & Lifelong Grace',
    bondStatusHi: isMatruArishta
      ? 'मातृ अरिष्ट अथवा शीघ्र मातृ वियोग / गंभीर स्वास्थ्य संकट (मातृ अरिष्ट योग)'
      : isMotherFriction
      ? 'त्यागपूर्ण, गहन किंतु मानसिक चिंताएं बढ़ाने वाला जटिल संबंध'
      : 'परम सुख-आश्रय, निःस्वार्थ वात्सल्य एवं जीवन भर की रक्षा-शक्ति',
    narrativeEn: isMatruArishta
      ? 'Classical Matru Arishta / Matru Viyoga Yoga is triggered due to afflictions to the Moon and the 4th house. This points to the early loss of maternal sheltering, mother’s persistent chronic health struggles, or separation during childhood where you were raised away from her direct care. The emotional void of maternal warmth created an enduring subconscious resilience.'
      : isMotherFriction
      ? 'Your mother endured immense personal sacrifices, yet her persistent inner anxieties, emotional hyper-vigilance, and emotional possessiveness occasionally suffocated you. You absorb her emotional distress directly into your own psyche. Serving her and ensuring her peaceful comfort directly stabilizes your turbulent finances and sleep.'
      : 'Your mother is the emotional cornerstone of your life. Her prayers and selfless devotion act as a spiritual counter-weight against all your malefic planetary transits. Your happiness, mental peace, and real estate acquisition are directly linked to honoring her word.',
    narrativeHi: isMatruArishta
      ? 'शास्त्रीय मातृ अरिष्ट अथवा अल्पायु योग: चंद्र देव व सुख स्थान (चतुर्थ भाव) पर क्रूर ग्रहों के प्रभाव से माता का साया अल्पायु में उठ जाने, बाल्यकाल में माता से वियोग (दूर रहने/छात्रावास), अथवा माता के दीर्घकालिक असाध्य स्वास्थ्य संकट का संकेत मिलता है। जातक ने माता के लाड़-प्यार के स्थान पर उनकी चिंता और अभाव को अधिक भोगा है, जिससे जातक का मन बचपन से ही आत्मनिर्भर और गंभीर हो गया।'
      : isMotherFriction
      ? 'माता ने आपके लिए अत्यधिक कष्ट व त्याग झेला है, किंतु उनके अंतर्मन की निरंतर चिंता, भावुकता और अति-अधिकार की भावना आपके मन पर भी भारी तनाव डालती है। आप माता के कष्टों को सीधे अपने अवचेतन में सोख लेते हैं। माता के चरणों की सेवा करना और उन्हें मानसिक शांति देना आपके रुके हुए धन और नींद को तुरंत सुधारता है।'
      : 'माता आपके जीवन का सबसे पवित्र व शांत आश्रय हैं। उनका वात्सल्य और आशीर्वाद आपके जीवन के बड़े-बड़े ग्रहों के दोषों को निष्प्रभावी कर देता है। माता की प्रसन्नता ही आपकी मानसिक शांति और भूमि-वाहन सुख की वास्तविक कुंजी है।',
    astrologicalCauseEn: isMatruArishta
      ? `Moon afflicted in House ${moon.rasiHouseNumber} (${moon.signName}) and 4th house ruled by ${h4Lord} under malefic stress (Matru Arishta).`
      : `Moon in House ${moon.rasiHouseNumber} (${moon.signName}) and 4th House ruled by ${h4Lord} in ${SIGNS[h4Sign].name}.`,
    astrologicalCauseHi: isMatruArishta
      ? `शास्त्रीय कारण: चतुर्थेश '${PLANET_HI[h4Lord] || h4Lord}' तथा मन व मातृ कारक चंद्रमा पर पाप प्रभाव (मातृ अरिष्ट)।`
      : `शास्त्रीय कारण: चतुर्थेश '${PLANET_HI[h4Lord] || h4Lord}' तथा मन व मातृ कारक चंद्रमा की कुंडली में स्थिति।`,
  });

  // 3. Brothers (भ्राता - अग्रज व अनुज)
  allEntities.push({
    id: 'brothers',
    relationEn: 'Brothers: Elder (Agraja) & Younger (Anuja)',
    relationHi: 'भाई: बड़े भाई (अग्रज) एवं छोटे भाई (अनुज)',
    bhavatBhavamEn: '11th House (Elder Brother) & 3rd House (Younger Brother), Mars (Bhratri Karaka)',
    bhavatBhavamHi: 'एकादश भाव (बड़े भाई), तृतीय भाव (छोटे भाई) एवं मंगल देव (भ्रातृ कारक)',
    bondStatusEn: isOnlyChild
      ? 'Only Child / Total Absence of Biological Brothers (Ekaki Santana Yoga)'
      : noElderSiblings
      ? 'Firstborn / Absence of Elder Brothers (Agraja Heen Yoga)'
      : noYoungerSiblings
      ? 'Youngest / Absence of Younger Brothers (Ananuja Yoga)'
      : 'Protective Camaraderie with Occasional Financial/Property Distance',
    bondStatusHi: isOnlyChild
      ? 'एकल संतान योग अथवा सहोदर भाई का पूर्ण अभाव (एकाकी संतान योग)'
      : noElderSiblings
      ? 'ज्येष्ठ संतान / बड़े भाई का अभाव (अग्रज विहीन योग)'
      : noYoungerSiblings
      ? 'कनिष्ठ संतान / छोटे भाई का अभाव (अननुज योग)'
      : 'स्वाभाविक भ्रातृ-प्रेम, किंतु पैतृक संपत्ति व लेन-देन में सतर्कता आवश्यक',
    narrativeEn: isOnlyChild
      ? 'Classical Ananuja / Ekaki Santana Yoga: Severe afflictions to both 3rd and 11th houses reveal that you are an Only Child without biological brothers, or grew up with complete physical and emotional isolation from siblings. You shoulder all familial burdens on your own shoulders.'
      : noElderSiblings
      ? 'You hold the position of the eldest brother or grew up without elder male siblings (11th house affliction). You naturally assumed the commanding, protective head-of-family role early in life.'
      : noYoungerSiblings
      ? 'You are the youngest brother or have no younger male siblings (3rd house affliction). You did not experience the role of an elder brother and always looked upward for guidance.'
      : 'Brothers stand by you during outside crises and legal challenges, acting as physical muscle and social backup. However, financial partnerships or joint property ownership with brothers will invite stubborn disputes and bitter legal partitions (Mars influence). Maintain affectionate social ties, but keep commercial contracts entirely separate.',
    narrativeHi: isOnlyChild
      ? 'शास्त्रीय भ्राता-विहीन / एकाकी संतान योग: तृतीय व एकादश भाव के स्वामी ग्रहों की प्रतिकूल स्थिति जातक के "एकल संतान" (Only Child) होने अथवा सगे भाइयों के अभाव का स्पष्ट संकेत देती है। जातक ने अपने बचपन से ही स्वयं की जिम्मेदारियां अकेले निभाना सीखा है और भाइयों का संबल प्राप्त नहीं हुआ।'
      : noElderSiblings
      ? 'आप परिवार में सबसे बड़े भाई हैं अथवा बड़े भाई का सुख नहीं है (एकादश भाव का प्रभाव)। आपको परिवार में बचपन से ही बड़े भाई जैसी जिम्मेदारी और दायित्व का निर्वहन स्वयं करना पड़ा है।'
      : noYoungerSiblings
      ? 'आप परिवार में छोटे भाई हैं अथवा छोटे भाई का अभाव है (तृतीय भाव का प्रभाव)। आपके नीचे कोई छोटा भाई नहीं है जिससे आपने कभी बड़े भाई की भूमिका नहीं निभाई।'
      : 'बाहरी संकटों, झगड़ों अथवा संकट के समय भाई आपके साथ चट्टान की तरह खड़े होते हैं। किंतु ज्योतिषीय चेतावनी: भाइयों के साथ संयुक्त व्यापार अथवा पैतृक संपत्ति के बंटवारे में कड़वाहट और विवाद का योग बनता है। अतः भाईचारे को मधुर बनाए रखने हेतु वित्तीय लेन-देन और संपत्ति के कागजात सदैव पूर्णतः पृथक रखें।',
    astrologicalCauseEn: isOnlyChild
      ? '3rd and 11th houses simultaneously afflicted with Mars in 8th/dusthana (Ekaki Santana Yoga).'
      : `3rd House (${SIGNS[h3Sign].name}, Lord: ${h3Lord}), 11th House (${SIGNS[h11Sign].name}, Lord: ${h11Lord}), and Mars.`,
    astrologicalCauseHi: isOnlyChild
      ? 'शास्त्रीय कारण: तृतीय व एकादश भाव तथा भ्रातृ कारक मंगल की प्रतिकूल स्थिति (एकल संतान योग)।'
      : `शास्त्रीय कारण: तृतीयेश '${PLANET_HI[h3Lord] || h3Lord}', एकादशेश '${PLANET_HI[h11Lord] || h11Lord}' तथा भ्रातृ कारक मंगल की स्थिति।`,
  });

  // 4. Sisters (बहनें - बड़ी व छोटी)
  allEntities.push({
    id: 'sisters',
    relationEn: 'Sisters: Elder & Younger (Bhagini)',
    relationHi: 'बहनें: बड़ी बहन (अग्रजा) एवं छोटी बहन (अनुजा)',
    bhavatBhavamEn: '11th & 3rd Houses, Venus and Mercury (Feminine Sibling Karakas)',
    bhavatBhavamHi: 'एकादश व तृतीय भाव, शुक्र एवं बुध (स्त्री-सहज सहोदर कारक)',
    bondStatusEn: isOnlyChild
      ? 'Absence of Biological Sisters / Only Child Condition'
      : 'Affectionate, Nurturing & Auspicious Blessing Generator',
    bondStatusHi: isOnlyChild
      ? 'सहोदर बहनों का अभाव / एकल संतान की स्थिति'
      : 'अत्यंत स्नेहपूर्ण, कल्याणकारी एवं जातक का भाग्य बढ़ाने वाला पावन संबंध',
    narrativeEn: isOnlyChild
      ? 'Due to the Ekaki Santana combination, biological sisters are absent in your immediate birth family. Cousin sisters or spiritual/sworn sisters provide the maternal sisterly warmth that was missing biologically.'
      : 'Sisters bring unreserved sweetness, cultural refinement, and emotional respite into your world. An elder sister often steps in as a secondary maternal guide during crises, while a younger sister looks up to you for protection and generous gifts. Fulfilling your duties toward sisters on Raksha Bandhan and their weddings directly elevates your Venus and Mercury, dissolving debt cycles.',
    narrativeHi: isOnlyChild
      ? 'एकल संतान अथवा भ्राता-भगिनी विहीन योग के कारण सगी बहनों का अभाव रहता है। चचेरी-ममेरी बहनें अथवा मुंहबोली बहनें ही जातक को भगिनी का स्नेह और राखी का पावन संबल प्रदान करती हैं।'
      : 'बहनों का संबंध आपके जीवन में असीम स्नेह, मानसिक सुकून और सौभाग्य लेकर आता है। बड़ी बहन संकट के समय दूसरी मां की तरह संबल देती है, जबकि छोटी बहन आपसे संरक्षण और स्नेह की अपेक्षा रखती है। बहनों को मान-सम्मान देना, उनके विवाह व त्योहारों पर उदारता से उपहार देना आपके शुक्र व बुध को बलवान कर दरिद्रता का नाश करता है।',
    astrologicalCauseEn: isOnlyChild
      ? 'Simultaneous absence of female sibling karakas influencing 3rd and 11th houses.'
      : `Mercury and Venus influencing the 3rd and 11th houses of siblings.`,
    astrologicalCauseHi: isOnlyChild
      ? 'शास्त्रीय कारण: तृतीय व एकादश भाव पर स्त्री कारक ग्रहों का अभाव।'
      : `शास्त्रीय कारण: तृतीय व एकादश भाव पर बुध व शुक्र का शुभ दृष्टि संबंध।`,
  });

  // 5. Children / Progeny (संतान - पुत्र व पुत्री)
  allEntities.push({
    id: 'children',
    relationEn: 'Children & Progeny (Santana - Sons & Daughters)',
    relationHi: 'संतान: पुत्र व पुत्री (पंचम भाव व गुरु)',
    bhavatBhavamEn: '5th House (Putra Bhava), Jupiter (Putrakaraka) & D7 Saptamsha Matrix',
    bhavatBhavamHi: 'पंचम भाव (संतान स्थान), देवगुरु बृहस्पति एवं सप्तांश चक्र (D7)',
    bondStatusEn: isProgenyDenial
      ? 'Progeny Denial / Childlessness / Adoption or Spiritual Mentorship (Putraheen Yoga)'
      : 'Proud Karmic Ascension with Ideological Generation Gap',
    bondStatusHi: isProgenyDenial
      ? 'संतान हीन योग अथवा निःसंतानता / दत्तक संतान या आध्यात्मिक वात्सल्य (पुत्रहीन योग)'
      : 'कुल-गौरव, उच्च प्रतिभा वाली संतान, किंतु वैचारिक पीढ़ीगत अंतर',
    narrativeEn: isProgenyDenial
      ? 'Classical Putra Pratibandhaka / Sarpa Dosha: Severe afflictions to the 5th house, 5th lord, and Jupiter indicate profound biological impediments to natural childbearing, leading to intentional or karmic childlessness. The classical shastras prescribe adoption (Dattaka Santana), mentoring younger generations, or dedicating maternal/paternal energies to creative or spiritual disciples, which fully discharges this 5th-house karmic contract.'
      : 'Blessed with intelligent, spirited, and capable progeny who achieve significant educational and societal stature. Early conception may require medical patience or spiritual remedies (afflictions to 5th house/Guru). In teenage years, your children will assert intense individual independence that clashes with your traditional expectations, yet their mature accomplishments will bring immense honor to your lineage.',
    narrativeHi: isProgenyDenial
      ? 'शास्त्रीय संतान हीन अथवा दत्तक योग: पंचम भाव, पंचमेश एवं संतान कारक देवगुरु बृहस्पति पर क्रूर ग्रहों (राहु/शनि) के दुष्प्रभाव से जैविक संतानोत्पत्ति में गंभीर चिकित्सीय अवरोध, निःसंतान रहने का योग, अथवा दत्तक संतान (गोद लेने) का योग बनता है। जातक यदि भांजे-भतीजों, विद्यार्थियों अथवा समाज के बच्चों को अपनी संतान मानकर उनका मार्गदर्शन करे, तो पंचम भाव का प्रारब्ध दोष पूर्णतः शांत हो जाता है।'
      : 'जातक को प्रखर बुद्धि, स्वाभिमानी और सक्षम संतान का सुख प्राप्त होता है जो समाज में कुल का नाम रोशन करती है। प्रारंभिक गर्भाधान अथवा संतान प्राप्ति में कुछ विलंब या चिकित्सीय धैर्य की आवश्यकता पड़ सकती है। किशोरावस्था में संतान अपने स्वतंत्र विचारों पर अड़ेगी जिससे कुछ वैचारिक मतभेद होगा, किंतु अंततः संतान की सफलता आपके जीवन का सबसे बड़ा गौरव बनेगी।',
    astrologicalCauseEn: isProgenyDenial
      ? `5th Lord ${h5Lord} combust/debilitated in dusthana with afflicted Jupiter (Putra Pratibandhaka).`
      : `5th House in ${SIGNS[h5Sign].name} ruled by ${h5Lord}, aspected by Jupiter (progeny significator).`,
    astrologicalCauseHi: isProgenyDenial
      ? `शास्त्रीय कारण: पंचमेश '${PLANET_HI[h5Lord] || h5Lord}' तथा संतान कारक गुरु पर क्रूर पाप दृष्टि (पुत्र प्रतिबन्धक योग)।`
      : `शास्त्रीय कारण: पंचमेश '${PLANET_HI[h5Lord] || h5Lord}' तथा संतान कारक देवगुरु बृहस्पति की सप्तांश (D7) में शुभ स्थिति।`,
  });

  // 6. Paternal Grandparents (दादा-दादी)
  allEntities.push({
    id: 'paternal_grandparents',
    relationEn: 'Paternal Grandparents (Dada - Dadi)',
    relationHi: 'दादा एवं दादी (पैतृक पूर्वज व 9th from 9th)',
    bhavatBhavamEn: '5th House (9th from 9th = Grandfather) & 12th House (4th from 9th = Grandmother)',
    bhavatBhavamHi: 'पंचम भाव (नवम से नवम = दादाजी) एवं द्वादश भाव (नवम से चतुर्थ = दादीजी)',
    bondStatusEn: 'Deep Ancestral Imprint, Inherited Wisdom & Spiritual Blessings',
    bondStatusHi: 'गहरे पैतृक संस्कार, संचित पूर्व-पुण्य व कुल-देवता का आशीर्वाद',
    narrativeEn: 'Your paternal grandfather was a figure of distinct principle, social dignity, or religious devotion whose core karma directly seeds your present intellect (5th house). Your grandmother’s silent endurance and spiritual prayers laid the protective foundation of your lineage. Honoring ancestral Shraddha and Pitru rituals unlocks immense frozen prosperity.',
    narrativeHi: 'आपके दादाजी समाज में एक प्रतिष्ठित, सिद्धांतवादी अथवा धर्मपरायण व्यक्तित्व रहे, जिनके संचित पुण्यों का सीधा प्रभाव आपकी मेधा (पंचम भाव) पर आया है। दादीजी का त्याग और ममता आपके कुल का सुरक्षा कवच बनी। पितृ पक्ष में पूर्वजों का श्राद्ध व तर्पण करने से आपके जीवन के अटके हुए कार्य तुरंत सिद्ध होते हैं।',
    astrologicalCauseEn: `5th House (9th from 9th) and 12th House (4th from 9th) Bhavat Bhavam.`,
    astrologicalCauseHi: `शास्त्रीय कारण: भावत भावम नियम — नवम से नवम (पंचम भाव) दादा का, तथा नवम से चतुर्थ (द्वादश भाव) दादी का स्थान।`,
  });

  // 7. Maternal Grandparents (नाना-नानी)
  allEntities.push({
    id: 'maternal_grandparents',
    relationEn: 'Maternal Grandparents (Nana - Nani)',
    relationHi: 'नाना एवं नानी (मातृ कुल व ननिहाल)',
    bhavatBhavamEn: '12th House (9th from 4th = Maternal Grandfather) & 7th House (4th from 4th = Maternal Grandmother)',
    bhavatBhavamHi: 'द्वादश भाव (चतुर्थ से नवम = नानाजी) एवं सप्तम भाव (चतुर्थ से चतुर्थ = नानीजी)',
    bondStatusEn: 'Unconditional Affection, Sweet Childhood Memories & Legacy Gifts',
    bondStatusHi: 'निःस्वार्थ दुलार, ननिहाल की सुखद स्मृतियां एवं आशीर्वाद',
    narrativeEn: 'Your maternal grandparents provided an oasis of unconditional warmth and pampering during your childhood visits. Maternal lineage was steeped in hospitality, traditional values, and agrarian/commercial stability. Blessings and heirloom gifts received from your maternal grandmother carry potent protective vibrations for your marital happiness.',
    narrativeHi: 'नाना-नानी का घर (ननिहाल) आपके बचपन का सबसे सुखद व लाड़-प्यार से भरा स्मृति-लोक रहा है। मातृ कुल में अतिथि-सत्कार, सेवा और धार्मिक आस्था का प्राधान्य रहा। नानी से प्राप्त कोई पारंपरिक वस्तु अथवा आशीर्वाद आपके दांपत्य जीवन के लिए कल्याणकारी सिद्ध होता है।',
    astrologicalCauseEn: `12th House (9th from 4th) and 7th House (4th from 4th) Bhavat Bhavam.`,
    astrologicalCauseHi: `शास्त्रीय कारण: भावत भावम — चतुर्थ से नवम (द्वादश भाव) नाना का, तथा चतुर्थ से चतुर्थ (सप्तम भाव) नानी का स्थान।`,
  });

  // 8. Father-in-Law & Mother-in-Law (ससुर व सास)
  allEntities.push({
    id: 'inlaws',
    relationEn: 'In-Laws: Father-in-Law & Mother-in-Law (Sasur - Saas)',
    relationHi: 'सास एवं ससुर (ससुराल पक्ष)',
    bhavatBhavamEn: '3rd House (9th from 7th = Father-in-Law) & 10th House (4th from 7th = Mother-in-Law)',
    bhavatBhavamHi: 'तृतीय भाव (सप्तम से नवम = ससुर) एवं दशम भाव (सप्तम से चतुर्थ = सास)',
    bondStatusEn: isMarriageDenial
      ? 'Not Applicable if Remaining Single/Unmarried · Potential Dynamics Only if Married'
      : 'Formal Dignity, High Expectations & Delicate Boundary Dynamics',
    bondStatusHi: isMarriageDenial
      ? 'लागू नहीं (यदि आजीवन अविवाहित/एकल रहें) · केवल विवाह की स्थिति में संभावित समीकरण'
      : 'मर्यादित सम्मान, उच्च अपेक्षाएं एवं सीमाओं का ध्यान रखना अनिवार्य',
    narrativeEn: isMarriageDenial
      ? 'Dynamic Contingency: If you embrace lifelong bachelorhood, celibacy, or remain unmarried as indicated by your ascetic/denial yogas, in-law relationships do not exist. Should you choose to marry later in life, your father-in-law will expect formal traditional respect and your mother-in-law will require strict emotional boundaries to prevent domestic friction.'
      : 'Your father-in-law is a self-respecting individual with established societal standing who expects formal courtesy and traditional honor. Your mother-in-law is deeply attached to her child and will periodically assert domestic authority or unsolicited advice. The secret to enduring peace: maintain respectful distance, never involve in-laws in private husband-wife disputes, and treat them with unwavering ceremonial generosity.',
    narrativeHi: isMarriageDenial
      ? 'संभावित स्थिति: यदि जातक अपनी कुंडली के नैष्ठिक ब्रह्मचर्य अथवा विवाह-हीन योग के कारण आजीवन एकल/अविवाहित रहता है, तो यह संबंध अस्तित्व में ही नहीं आता। यदि सामाजिक दबाव अथवा स्वेच्छा से विवाह होता है, तो ससुराल पक्ष के साथ मर्यादा और सीमाओं का ध्यान रखना अनिवार्य होगा।'
      : 'ससुर जी एक स्वाभिमानी और सामाजिक मर्यादा का ध्यान रखने वाले व्यक्ति हैं, जो आपसे आदर और औपचारिकता की अपेक्षा रखते हैं। सास का अपनी संतान के प्रति अत्यधिक मोह कभी-कभी आपके दांपत्य में अवांछित हस्तक्षेप का कारण बन सकता है। ससुराल पक्ष के साथ शांति का मूल मंत्र: सम्मान पूरा दें, किंतु अपने निजी दांपत्य के निर्णयों में उनकी सीधी दखलंदाजी से बचें।',
    astrologicalCauseEn: `3rd House (9th from 7th) and 10th House (4th from 7th) Bhavat Bhavam.`,
    astrologicalCauseHi: `शास्त्रीय कारण: भावत भावम — सप्तम से नवम (तृतीय भाव) ससुर का, तथा सप्तम से चतुर्थ (दशम भाव) सास का स्थान।`,
  });

  // 9. Brothers-in-Law & Sisters-in-Law (साला, जीजा, देवर, जेठ, साली, ननद, भाभी)
  allEntities.push({
    id: 'siblings_in_law',
    relationEn: 'Siblings-in-Law: Brothers-in-law & Sisters-in-law (Sala, Jija, Devar, Sali, Nanad, Bhabhi)',
    relationHi: 'साला-साली, देवर-जेठ, जीजा, ननद एवं भाभी (ससुराल व सहोदर संबंध)',
    bhavatBhavamEn: '9th House (3rd from 7th = Younger In-Law Siblings) & 5th House (11th from 7th = Elder In-Law Siblings)',
    bhavatBhavamHi: 'नवम भाव (सप्तम से तृतीय = छोटे साले/साली) एवं पंचम भाव (सप्तम से एकादश = बड़े जेठ/ननद)',
    bondStatusEn: isMarriageDenial
      ? 'Not Applicable if Remaining Single/Unmarried · Festive Camaraderie if Married'
      : 'Lively Social Camaraderie with Strict Warning Against Financial Entanglements',
    bondStatusHi: isMarriageDenial
      ? 'लागू नहीं (यदि आजीवन अविवाहित/एकल रहें) · विवाह होने पर उत्सवों का साथ'
      : 'हंसी-मजाक व पारिवारिक उत्सवों का आनंद, किंतु उधार-लेनदेन से पूर्ण परहेज',
    narrativeEn: isMarriageDenial
      ? 'Contingent Relationship: Non-existent under singlehood. If married, beware: never enter unwritten business partnerships or lend capital to in-law siblings (Sala/Jija), as money friction will instantly bleed into primary marital harmony.'
      : 'Relationships with siblings-in-law bring joyful banter, wedding celebrations, and festive social energy. However, classical Jyotish sounds a strict alert: never enter unwritten business partnerships or lend significant capital to brothers-in-law (Sala/Jija). Financial entanglements with in-law siblings almost inevitably sour the primary marital harmony.',
    narrativeHi: isMarriageDenial
      ? 'संभावित संबंध: एकल रहने की स्थिति में यह संबंध लागू नहीं होता। यदि विवाह हो, तो साले या जीजा के साथ किसी भी व्यापारिक लेन-देन या आर्थिक साझेदारी से पूर्ण परहेज करें।'
      : 'साले-साली, देवर अथवा ननद के साथ पारिवारिक उत्सवों और आयोजनों में खूब हंसी-मजाक और आत्मीयता रहती है। किंतु ज्योतिषीय चेतावनी: साले या जीजा के साथ कभी भी अनौपचारिक व्यापारिक साझेदारी न करें और न ही बड़ा धन उधार दें। ससुराल के भाई-बहनों से हुआ वित्तीय विवाद सीधे आपके दांपत्य जीवन में जहर घोलने का कार्य करता है।',
    astrologicalCauseEn: `Bhavat Bhavam across 9th and 5th houses relative to the 7th house of marriage.`,
    astrologicalCauseHi: `शास्त्रीय कारण: सप्तम भाव (दांपत्य) से तृतीय व एकादश भाव का सूक्ष्म विश्लेषण।`,
  });

  // 10. Uncles & Aunts (चाचा-चाची, मामा-मामी, बुआ-फूफा, मौसी-मौसा)
  allEntities.push({
    id: 'uncles_aunts',
    relationEn: 'Uncles & Aunts: Paternal (Chacha, Bua) & Maternal (Mama, Mausi)',
    relationHi: 'चाचा-चाची, बुआ-फूफा, मामा-मामी एवं मौसी-मौसा',
    bhavatBhavamEn: '11th House (3rd from 9th = Paternal Uncle), 6th House (3rd from 4th = Maternal Uncle / Mercury)',
    bhavatBhavamHi: 'एकादश भाव (नवम से तृतीय = चाचा/बुआ) एवं षष्ठ भाव (चतुर्थ से तृतीय = मामा/मौसी)',
    bondStatusEn: 'Mixed Karmic Ties: Paternal Property Disputes vs Maternal Emotional Warmth',
    bondStatusHi: 'मिश्रित संबंध: पैतृक पक्ष में संपत्ति का तनाव, ननिहाल पक्ष में भावनात्मक अपनापन',
    narrativeEn: 'Paternal uncles (Chacha) often share complex, competitive relations regarding ancestral land, family hierarchy, or inheritance shares. Maternal uncles (Mama, 6th house & Mercury) generally display genuine warmth, though one maternal uncle may experience volatile financial or health struggles that require your empathetic assistance.',
    narrativeHi: 'चाचा-ताऊ के साथ पैतृक संपत्ति, कुल की प्रतिष्ठा अथवा जमीन-जायदाद को लेकर समय-समय पर मनमुटाव या प्रतिस्पर्धा की स्थिति बन सकती है। इसके विपरीत, मामा-मौसी का व्यवहार अत्यंत आत्मीय रहता है, यद्यपि किसी एक मामा के जीवन में आर्थिक अथवा स्वास्थ्य संबंधी उतार-चढ़ाव आपको चिंतित कर सकते हैं।',
    astrologicalCauseEn: `11th House (3rd from 9th) for paternal kin; 6th House (3rd from 4th & Mercury) for maternal kin.`,
    astrologicalCauseHi: `शास्त्रीय कारण: नवम से तृतीय (एकादश भाव) पितृ कुल बंधु, तथा चतुर्थ से तृतीय (षष्ठ भाव व बुध) मातृ कुल बंधु (मामा)।`,
  });

  // 11. Cousins (चचेरे, ममेरे, फुफेरे, मौसेरे भाई-बहन)
  allEntities.push({
    id: 'cousins',
    relationEn: 'Cousins: Paternal & Maternal (Cousin Siblings)',
    relationHi: 'चचेरे, ममेरे, फुफेरे एवं मौसेरे भाई-बहन',
    bhavatBhavamEn: '3rd and 11th Bhavat Bhavam harmonics across extended familial houses',
    bhavatBhavamHi: 'तृतीय व एकादश भाव के सहायक उप-भाव',
    bondStatusEn: 'Childhood Closeness Evolving into Polite Adult Distance & Comparison',
    bondStatusHi: 'बचपन का गहरा साथ, किंतु वयस्क होने पर सामाजिक तुलना व मर्यादित दूरी',
    narrativeEn: 'Childhood was enriched by unforgettable family gatherings and shared vacations with cousins. As adulthood arrives, parental comparisons and differing career fortunes inevitably create a subtle competitive distance. Maintain gracious warmth during family functions, but refrain from discussing exact personal net worth or intimate marital affairs.',
    narrativeHi: 'बचपन में चचेरे-ममेरे भाई-बहनों के साथ छुट्टियां और पारिवारिक मिलन अत्यंत आनंददायक रहे। किंतु बड़े होने पर करियर की उपलब्धियों, धन और पारिवारिक तुलनाओं के कारण एक अदृश्य दूरी आ जाती है। पारिवारिक आयोजनों में सभी से मधुरता से मिलें, किंतु अपनी निजी कमाई और दांपत्य की बातें साझा करने से बचें।',
    astrologicalCauseEn: `Secondary sibling harmonics across 3rd, 5th, and 11th houses.`,
    astrologicalCauseHi: `शास्त्रीय कारण: तृतीय व एकादश भाव के सहायक भावत भावम समीकरण।`,
  });

  // 12. Friends & Inner Circle (मित्र मंडली)
  allEntities.push({
    id: 'friends',
    relationEn: 'Friends & Inner Social Circle (Mitra Mandali)',
    relationHi: 'मित्र मंडली एवं आंतरिक सामाजिक दायरा',
    bhavatBhavamEn: '11th House (Labha & Friends), Mercury (Friendship Significator)',
    bhavatBhavamHi: 'एकादश भाव (मित्र/लाभ स्थान) एवं बुध देव (मित्रता कारक)',
    bondStatusEn: 'Few Rare Loyal Allies vs Many Fair-Weather Opportunists',
    bondStatusHi: 'गिनती के 2-3 सच्चे निष्कपट मित्र, बाकी अधिकांश केवल स्वार्थ के साथी',
    narrativeEn: 'Your 11th house reveals a broad social network but an extremely narrow circle of genuine soul-allies. You have experienced painful betrayals where people you elevated financially or emotionally abandoned you the moment their purpose was served. Your true friends can be counted on the fingers of one hand—cherish those 2 or 3 principled souls and treat the rest as mere transactional acquaintances.',
    narrativeHi: 'एकादश भाव का विश्लेषण यह स्पष्ट करता है कि आपके परिचितों की संख्या तो बहुत बड़ी है, किंतु सच्चे व निस्वार्थ मित्रों की संख्या उंगलियों पर गिनने लायक है। आपने जीवन में ऐसे मित्रों पर समय और धन लुटाया है जिन्होंने काम निकलते ही मुंह फेर लिया। आपके 2 या 3 निष्कपट मित्र ही संकट में काम आएंगे; शेष भीड़ को केवल शिष्टाचार तक सीमित रखें।',
    astrologicalCauseEn: `11th House in ${SIGNS[h11Sign].name} (Lord: ${h11Lord}) and Mercury placement.`,
    astrologicalCauseHi: `शास्त्रीय कारण: एकादश भाव (मित्र स्थान) के स्वामी '${PLANET_HI[h11Lord] || h11Lord}' तथा बुध देव की स्थिति।`,
  });

  // 13. Neighbours & Local Community (पड़ोसी व मोहल्ला)
  allEntities.push({
    id: 'neighbours',
    relationEn: 'Neighbours & Local Community (Padosi va Mohalla)',
    relationHi: 'पड़ोसी, मोहल्ला एवं स्थानीय जन-समुदाय',
    bhavatBhavamEn: '3rd House (Immediate Environment & Neighbours), Mars',
    bhavatBhavamHi: 'तृतीय भाव (निकटवर्ती परिवेश व पड़ोसी) एवं मंगल देव',
    bondStatusEn: 'Polite Civility Requiring Firm Spatial & Boundary Defense',
    bondStatusHi: 'शिष्टाचारपूर्ण संबंध, किंतु आवासीय सीमाओं व शांति की रक्षा आवश्यक',
    narrativeEn: 'The 3rd house governs immediate neighbors and residential harmony. While general relations remain civil, boundary disputes, parking frictions, or noise interference can flare up periodically if clear personal boundaries are not enforced early. Avoid sharing domestic secrets over the fence; maintain dignified distance while offering help during emergencies.',
    narrativeHi: 'तृतीय भाव आपके पड़ोसियों और निकटवर्ती परिवेश का दर्पण है। सामान्य तौर पर संबंध ठीक रहते हैं, किंतु पार्किंग, निर्माण अथवा सीमा-विवाद को लेकर कभी-कभी अड़ोस-पड़ोस में तनातनी हो सकती है। पड़ोसियों के साथ अपनी पारिवारिक बातें साझा न करें; संकट में सहायता अवश्य करें, किंतु अपने निजी जीवन में एक गरिमामयी लक्ष्मण-रेखा बनाकर रखें।',
    astrologicalCauseEn: `3rd House in ${SIGNS[h3Sign].name} (Lord: ${h3Lord}) and Mars.`,
    astrologicalCauseHi: `शास्त्रीय कारण: तृतीय भाव (पड़ोसी/निकट परिवेश) के स्वामी '${PLANET_HI[h3Lord] || h3Lord}' तथा मंगल का प्रभाव।`,
  });

  // Split into Section 3 (Core Family) & Section 4 (Extended Kinship)
  const coreEntities = allEntities.slice(0, 5); // Father, Mother, Brothers, Sisters, Children
  const extendedEntities = allEntities.slice(5); // Grandparents, In-laws, Uncles, Cousins, Friends, Neighbours

  const coreFamilySection: ChapterSection = {
    titleEn: 'Exhaustive 360° Relational Matrix: Father, Mother, Siblings & Children',
    titleHi: 'सम्पूर्ण 360° पारिवारिक संबंध: पिता, माता, अग्रज-अनुज भ्राता, बहनें एवं संतान',
    leadEn: 'Unfiltered shastric assessment of your primary bloodline bonds, mutual karma, and friction points.',
    leadHi: 'नवम, चतुर्थ, तृतीय, एकादश व पंचम भाव से पिता, माता, भाई-बहनों और संतान के साथ वास्तविक संबंधों का सच।',
    paragraphsEn: coreEntities.map((e) => `• ${e.relationEn} [${e.bhavatBhavamEn}]: ${e.bondStatusEn}. ${e.narrativeEn}`),
    paragraphsHi: coreEntities.map((e) => `• ${e.relationHi} [${e.bhavatBhavamHi}]: ${e.bondStatusHi}। ${e.narrativeHi}`),
    astrologicalCauseEn: 'Computed through primary Kendra and Trikona houses (1st, 4th, 5th, 9th, 11th) and classical Naisargika Karakas (Sun, Moon, Mars, Jupiter).',
    astrologicalCauseHi: 'शास्त्रीय कारण: केंद्र व त्रिकोण भावों (चतुर्थ, पंचम, नवम, एकादश) तथा नैसर्गिक कारक ग्रहों (सूर्य, चंद्र, मंगल, गुरु) के परस्पर दृष्टि व युति संबंधों द्वारा प्रमाणित।',
    keyPointsEn: coreEntities.map((e) => `${e.relationEn.split('(')[0].trim()}: ${e.bondStatusEn.split('/')[0].trim()}`),
    keyPointsHi: coreEntities.map((e) => `${e.relationHi.split('(')[0].trim()}: ${e.bondStatusHi.split('/')[0].trim()}`),
  };

  const extendedKinshipSection: ChapterSection = {
    titleEn: 'Extended Kinship & Social Web: Grandparents, In-Laws, Uncles, Cousins, Friends & Neighbours',
    titleHi: 'विस्तृत कुल-कुटुंब संबंध: दादा-दादी, नाना-नानी, सास-ससुर, साला-साली, चाचा, मामा, मित्र व पड़ोसी',
    leadEn: 'Deep Bhavat Bhavam analysis covering all auxiliary relatives, in-law dynamics, friendships, and community.',
    leadHi: 'भावत भावम सिद्धांत द्वारा दादा-दादी, नाना-नानी, ससुराल पक्ष, चाचा, मामा, मित्र-मंडली व पड़ोसियों के साथ संबंध।',
    paragraphsEn: extendedEntities.map((e) => `• ${e.relationEn} [${e.bhavatBhavamEn}]: ${e.bondStatusEn}. ${e.narrativeEn}`),
    paragraphsHi: extendedEntities.map((e) => `• ${e.relationHi} [${e.bhavatBhavamHi}]: ${e.bondStatusHi}। ${e.narrativeHi}`),
    astrologicalCauseEn: 'Derived through advanced Bhavat Bhavam formulations (Houses from Houses): 9th from 9th (Grandfather), 4th from 9th (Grandmother), 9th from 7th (Father-in-law), 4th from 7th (Mother-in-law), 3rd from 4th (Maternal Uncle), and 11th House (Social network).',
    astrologicalCauseHi: 'शास्त्रीय कारण: महर्षि पाराशर के भावत भावम (भाव से भाव) सिद्धांत द्वारा: नवम से नवम (दादा), नवम से चतुर्थ (दादी), सप्तम से नवम (ससुर), सप्तम से चतुर्थ (सास), चतुर्थ से तृतीय (मामा) एवं एकादश भाव (मित्र मंडली)।',
    keyPointsEn: extendedEntities.map((e) => `${e.relationEn.split('(')[0].trim()}: ${e.bondStatusEn.split('/')[0].trim()}`),
    keyPointsHi: extendedEntities.map((e) => `${e.relationHi.split('(')[0].trim()}: ${e.bondStatusHi.split('/')[0].trim()}`),
  };

  return {
    coreFamilySection,
    extendedKinshipSection,
    allEntities,
  };
}

// ============================================================================
// 5. ADDICTIONS, TOXIC HABITS & SHADOW SELF
// ============================================================================
export interface AddictionsAndShadowResult {
  section: ChapterSection;
  data: {
    substanceRiskEn: string;
    substanceRiskHi: string;
    digitalVicesEn: string[];
    digitalVicesHi: string[];
    shadowTraitsEn: string[];
    shadowTraitsHi: string[];
  };
}

export function computeAddictionsAndShadow(chart: ChartData): AddictionsAndShadowResult {
  const asc = chart.ascendant;
  const h2Sign = (asc.signIndex + 1) % 12;
  const h2Lord = SIGNS[h2Sign].lord;
  const h12Sign = (asc.signIndex + 11) % 12;
  const h12Lord = SIGNS[h12Sign].lord;

  const moon = chart.planets.find((p) => p.id === 'Moon')!;
  const saturn = chart.planets.find((p) => p.id === 'Saturn')!;
  const rahu = chart.planets.find((p) => p.id === 'Rahu')!;
  const ketu = chart.planets.find((p) => p.id === 'Ketu')!;
  const mars = chart.planets.find((p) => p.id === 'Mars')!;
  const venus = chart.planets.find((p) => p.id === 'Venus')!;

  // Substance Addictions Vulnerability (2nd house of oral intake + 12th of escapism)
  const is2ndAfflicted = [saturn.rasiHouseNumber, rahu.rasiHouseNumber, mars.rasiHouseNumber].includes(2);
  const is12thAfflicted = [saturn.rasiHouseNumber, rahu.rasiHouseNumber, mars.rasiHouseNumber].includes(12);
  const isMoonAfflicted = [saturn.rasiHouseNumber, rahu.rasiHouseNumber, mars.rasiHouseNumber].includes(moon.rasiHouseNumber);

  let substanceRiskEn = '';
  let substanceRiskHi = '';

  if ((is2ndAfflicted || is12thAfflicted) && isMoonAfflicted) {
    substanceRiskEn = 'High Vulnerability to Chemical Escapism (Alcohol, Tobacco & Sedatives): Under sustained emotional betrayal or professional paralysis, your nervous system seeks rapid chemical sedation. You are prone to developing routine habits around alcohol, nicotine/vaping, or prescription sleeping pills to silence midnight overthinking. Strict boundary discipline is essential.';
    substanceRiskHi = 'रासायनिक व्यसनों के प्रति उच्च संवेदनशीलता (शराब, धूम्रपान व शामक दवाएं): जब जीवन में भावनात्मक विश्वासघात या भारी करियर तनाव आता है, तो आपका मन तुरंत रासायनिक पलायन की ओर भागता है। रात के अत्यधिक विचारों को शांत करने हेतु शराब, सिगरेट/हुक्का अथवा नींद की गोलियों की आदत पड़ने का गंभीर जोखिम रहता है। स्वयं पर कड़ा अनुशासन रखना अनिवार्य है।';
  } else if (is2ndAfflicted || is12thAfflicted) {
    substanceRiskEn = 'Moderate Vulnerability / Binge Escapism during Stress Cycles: You do not carry a chronic physical addiction, but under acute crisis periods, you indulge heavily in stimulants, strong caffeine, occasional alcohol binges, or rich inflammatory foods as an emotional coping mechanism.';
    substanceRiskHi = 'मध्यम संवेदनशीलता / तनाव के समय अनियंत्रित खान-पान: यद्यपि कोई स्थायी नशा नहीं है, किंतु भारी मानसिक दबाव के दिनों में अत्यधिक चाय/कॉफी, कभी-कभार शराब का सेवन, अथवा अत्यधिक गरिष्ठ/मसालेदार भोजन करके तनाव दबाने की प्रवृत्ति बनती है।';
  } else {
    substanceRiskEn = 'Low Chemical Dependency Risk / Natural Physical Defense: Your physical constitution naturally repels toxic heavy intoxication. Even mild alcohol or smoke creates immediate nausea or headaches, acting as a built-in biological defense against substance addiction.';
    substanceRiskHi = 'रासायनिक नशे से प्राकृतिक सुरक्षा: आपकी शारीरिक संरचना भारी नशे को सहन नहीं कर पाती। तंबाकू अथवा शराब का हल्का सा सेवन भी तुरंत सिरदर्द या उल्टी का कारण बनता है, जो एक ईश्वरीय सुरक्षा तंत्र का कार्य करता है।';
  }

  // Modern Digital & Behavioral Vices
  const digitalVicesEn: string[] = [
    'Digital Screen Doomscrolling & Late-Night Sleep Sabotage: Compulsively reading news, scrolling feeds, or consuming videos well past midnight, wrecking circadian melatonin rhythm.',
    'High-Stakes Speculative Trading & Financial Risk Addiction: The irresistible urge to take impulsive financial bets (crypto, F&O day trading, risky lotteries) chasing sudden riches during transit depressions.',
    'Emotional Binge Eating & Sugar Crashes: Consuming heavy carbohydrates, sweets, or junk food late at night to cope with unexpressed frustration and loneliness.',
  ];
  const digitalVicesHi: string[] = [
    'डिजिटल स्क्रीन की लत एवं आधी रात की अनिद्रा: रात 12 बजे के बाद भी मोबाइल स्क्रीन पर व्यर्थ स्क्रॉलिंग, वीडियो देखना अथवा रील्स में खोए रहना, जिससे नींद का प्राकृतिक चक्र पूरी तरह ध्वस्त हो जाता है।',
    'सट्टेबाजी, क्रिप्टो व शेयर बाजार की त्वरित जोखिम-लत: निराशा के दौर में अचानक अमीर बनने के चक्कर में शेयर बाजार (F&O), क्रिप्टो अथवा सट्टे में बिना सोचे-समझे पूंजी लगाकर भारी झटका खाना।',
    'भावुकतावश देर रात गरिष्ठ भोजन (Emotional Eating): जब मन में अकेलापन या गुस्सा होता है, तो रात के समय मीठा, जंक फूड अथवा तैलीय पदार्थ खाकर उस असंतोष को दबाने की प्रवृत्ति।',
  ];

  // Shadow Self (Secret Toxic Traits)
  const shadowTraitsEn: string[] = [
    'Cutting, Sarcastic Speech When Cornered (2nd House Affliction): While normally composed, when pushed past your limit, your tongue unleashes devastating, unforgettable verbal poison that permanently scars relationships.',
    'Subconscious Arrogance & Testing Others Secretly: You privately believe you are intellectually superior to most peers. You secretly lay psychological traps to test others\' loyalty before trusting them.',
    'Chronic Grudge-Holding (Saturnian Memory): You never truly forget an insult. You may smile cordially, but in the secret archives of your mind, a betrayal from 10 years ago remains as fresh as yesterday.',
  ];
  const shadowTraitsHi: string[] = [
    'क्रोध में अत्यंत विषैली व चुभने वाली वाणी (द्वितीय भाव का प्रभाव): सामान्यतः शांत रहने के बाद भी जब कोई आपको सीमा से अधिक उकसाता है, तो आपकी जिह्वा ऐसे बाण छोड़ती है जो सामने वाले के हृदय को आजीवन बींध देते हैं।',
    'अवचेतन अहंकार एवं लोगों की परीक्षा लेना: मन के भीतर यह गुप्त धारणा कि आप दूसरों से अधिक बुद्धिमान हैं। किसी पर भी विश्वास करने से पहले चुपके से उसकी निष्ठा की कठिन परीक्षा लेना।',
    'वर्षों तक अपमान न भूलना (दीर्घकालिक प्रतिशोध की भावना): आप किसी के किए गए अपमान को कभी नहीं भूलते। चेहरे पर मुस्कान रख सकते हैं, किंतु अंतर्मन में 10 वर्ष पूर्व हुआ विश्वासघात भी आज की तरह जीवित रहता है।',
  ];

  const causeEn = `Classical Astrological Cause: 2nd House of food/oral intake ruled by ${h2Lord} in ${SIGNS[h2Sign].name}, 12th House of sensory loss/escapism ruled by ${h12Lord} in ${SIGNS[h12Sign].name}, aspected by Rahu, Saturn, and afflicted Moon.`;
  const causeHi = `शास्त्रीय कारण: मुख व खान-पान का द्वितीय भाव (स्वामी: ${PLANET_HI[h2Lord] || h2Lord}), तथा इंद्रिय संयम व व्यय का द्वादश भाव (स्वामी: ${PLANET_HI[h12Lord] || h12Lord}), जिस पर राहु, शनि अथवा पीड़ित चंद्रमा का प्रभाव रासायनिक व्यसन व छाया प्रवृत्तियां उत्पन्न करता है।`;

  const section: ChapterSection = {
    titleEn: 'Addictions, Toxic Substance Vulnerabilities & Modern Digital Vices',
    titleHi: 'व्यसन संवेदनशीलता (शराब, धूम्रपान, नशा) एवं आधुनिक डिजिटल-मानसिक व्याधियां',
    leadEn: 'Uncompromising diagnostic of chemical dependency risks, compulsive escapisms, and shadow behaviors.',
    leadHi: 'द्वितीय व द्वादश भाव, राहु व शनि के प्रभाव से रासायनिक व्यसनों, स्क्रीन-लत, सट्टेबाजी व छाया प्रवृत्तियों का सच।',
    paragraphsEn: [
      `Chemical Substance Dependency Vulnerability: ${substanceRiskEn}`,
      `Modern Behavioral Vices & Dopamine Traps: In the 21st-century landscape, your chart is susceptible to three distinct modern behavioral addictions: (1) ${digitalVicesEn[0]} (2) ${digitalVicesEn[1]} (3) ${digitalVicesEn[2]}`,
      `The Shadow Self (Secret Toxic Character Traits): Beyond addictions, your subconscious shadow personality houses three unaddressed tendencies that repel fortune: (1) ${shadowTraitsEn[0]} (2) ${shadowTraitsEn[1]} (3) ${shadowTraitsEn[2]}`,
    ],
    paragraphsHi: [
      `रासायनिक नशा एवं व्यसन संवेदनशीलता का यथार्थ: ${substanceRiskHi}`,
      `आधुनिक डिजिटल व्याधियां एवं डोपामाइन जाल: 21वीं सदी के परिवेश में आपकी कुंडली में निम्नलिखित 3 आधुनिक व्यवहारिक व्यसनों का जोखिम स्पष्ट दिखाई देता है: (1) ${digitalVicesHi[0]} (2) ${digitalVicesHi[1]} (3) ${digitalVicesHi[2]}`,
      `छाया व्यक्तित्व (आंतरिक गुप्त दोष व विषैली प्रवृत्तियां): व्यसनों से परे, आपके अवचेतन मन में 3 ऐसी प्रवृत्तियां छिपी हैं जो आपके बने-बनाए काम बिगाड़ती हैं: (1) ${shadowTraitsHi[0]} (2) ${shadowTraitsHi[1]} (3) ${shadowTraitsHi[2]}`,
    ],
    astrologicalCauseEn: causeEn,
    astrologicalCauseHi: causeHi,
    keyPointsEn: [
      `Substance Risk: ${substanceRiskEn.split(':')[0]}`,
      `Primary Digital Trap: Screen Doomscrolling & Insomnia`,
      `Shadow Trait: Sarcastic Speech when Provoked`,
      `Karmic Antidote: Water Discipline & Verbal Restraint`,
    ],
    keyPointsHi: [
      `नशा जोखिम: ${substanceRiskHi.split(':')[0]}`,
      `मुख्य डिजिटल लत: रात में मोबाइल स्क्रीन व अनिद्रा`,
      `छाया दोष: गुस्से में कटु वाणी व वर्षों तक याद रखना`,
      `शास्त्रीय उपाय: वाणी का संयम व जल का सम्मान`,
    ],
  };

  return {
    section,
    data: {
      substanceRiskEn,
      substanceRiskHi,
      digitalVicesEn,
      digitalVicesHi,
      shadowTraitsEn,
      shadowTraitsHi,
    },
  };
}

// ============================================================================
// 6. LITIGATION, LEGAL DISPUTES, BANDHANA YOGA & CLANDESTINE AFFAIRS
// ============================================================================
export interface LitigationAndAffairsResult {
  section: ChapterSection;
  data: {
    affairRiskEn: string;
    affairRiskHi: string;
    litigationVerdictEn: string;
    litigationVerdictHi: string;
    bandhanaYogaEn: string;
    bandhanaYogaHi: string;
  };
}

export function computeLitigationAndAffairs(chart: ChartData): LitigationAndAffairsResult {
  const asc = chart.ascendant;
  const h6Sign = (asc.signIndex + 5) % 12;
  const h6Lord = SIGNS[h6Sign].lord;
  const h8Sign = (asc.signIndex + 7) % 12;
  const h8Lord = SIGNS[h8Sign].lord;
  const h12Sign = (asc.signIndex + 11) % 12;
  const h12Lord = SIGNS[h12Sign].lord;

  const saturn = chart.planets.find((p) => p.id === 'Saturn')!;
  const rahu = chart.planets.find((p) => p.id === 'Rahu')!;
  const ketu = chart.planets.find((p) => p.id === 'Ketu')!;
  const mars = chart.planets.find((p) => p.id === 'Mars')!;
  const venus = chart.planets.find((p) => p.id === 'Venus')!;

  // 6a. Clandestine Affairs & Secret Romances (Rahu/Venus/Mars in 7th/8th/12th)
  const isAffairRisk = [rahu.rasiHouseNumber, mars.rasiHouseNumber].some((h) => [7, 8, 12].includes(h)) ||
    [7, 8, 12].includes(venus.rasiHouseNumber) ||
    venus.rasiHouseNumber === rahu.rasiHouseNumber;

  let affairRiskEn = '';
  let affairRiskHi = '';

  if (isAffairRisk) {
    affairRiskEn = 'Vulnerability to Secret Passions & Clandestine Romances (Public Scandal Risk): The intense confluence of Rahu, Mars, or Venus upon intimate karmic houses (7th, 8th, 12th) creates periods of powerful unconventional romantic temptations. You are magnetically drawn to forbidden, secret, or online emotional connections outside traditional sanction. Warning: An extramarital flirtation or secret affair carries high risk of digital leak, blackmail, or acute public humiliation. Exercise supreme moral vigilance.';
    affairRiskHi = 'गुप्त प्रेम प्रसंग, विवाहेतर आकर्षण एवं सामाजिक बदनामी का जोखिम: सप्तम, अष्टम अथवा द्वादश भाव पर राहु, मंगल अथवा शुक्र का तीव्र प्रभाव अपरंपरागत व गुप्त काम-वासनाओं को जन्म देता है। जातक ऐसे संबंधों या ऑनलाइन आकर्षणों की ओर खिंच सकता है जो समाज द्वारा स्वीकृत नहीं हैं। शास्त्रीय चेतावनी: किसी भी गुप्त प्रेम-प्रसंग अथवा अनैतिक संबंध में पड़ने पर डिजिटल चैट के लीक होने, ब्लैकमेलिंग अथवा भारी सामाजिक अपयश का तीव्र योग बनता है। अतः अपनी मर्यादा व चरित्र की रक्षा स्वयं करें।';
  } else {
    affairRiskEn = 'Principled Romantic Boundaries / Immunity from Scandal: Your chart upholds high moral fidelity. While transient emotional attractions arise in youth, your innate sense of family honor and fear of public shame prevent you from indulging in destructive clandestine affairs.';
    affairRiskHi = 'मर्यादित चरित्र व गुप्त बदनामी से सुरक्षा: आपकी कुंडली में नैतिक मूल्यों और कुल-मर्यादा का भाव अत्यंत सुदृढ़ है। यद्यपि क्षणिक आकर्षण का अनुभव हो सकता है, किंतु आपकी अंतरात्मा और लोक-लाज का भय आपको किसी भी गुप्त अथवा अनैतिक संबंध में कदम रखने से रोकता है।';
  }

  // 6b. Litigation & Court Battles (6th, 8th, 12th houses)
  const isH6InKendra = [1, 4, 7, 10].includes(chart.planets.find((p) => p.id === h6Lord)?.rasiHouseNumber ?? 0);
  let litigationVerdictEn = '';
  let litigationVerdictHi = '';

  if (isH6InKendra || [6, 10].includes(mars.rasiHouseNumber)) {
    litigationVerdictEn = 'Litigation Exposure with Ultimate Victory Through Persistence: You will inevitably be pulled into at least one contentious legal dispute—most likely revolving around ancestral property division, commercial breach of contract, or delayed government sanctions. The battle will test your financial stamina and patience for 2 to 4 years, but ultimate judicial victory is assured if you avoid rash perjury.';
    litigationVerdictHi = 'कोर्ट-कचहरी व मुकदमेबाजी में उलझाव, किंतु अंततः विजय: जीवन में कम से कम एक बार पैतृक संपत्ति के बंटवारे, व्यापारिक अनुबंध टूटने अथवा सरकारी विवाद को लेकर न्यायालय की चौखट देखनी पड़ सकती है। यह विवाद 2 से 4 वर्षों तक धन और धैर्य की परीक्षा लेगा, किंतु यदि आप सत्य पर अडिग रहें तो अंतिम विजय आपकी ही होगी।';
  } else {
    litigationVerdictEn = 'Out-of-Court Settlement Favored: Protracted litigation drains your wealth without proportional gains. Classical texts advise resolving commercial or domestic disputes through arbitration, mutual compromise, and formal out-of-court settlements rather than waging exhausting courtroom wars.';
    litigationVerdictHi = 'न्यायालय के बाहर आपसी समझौते में भलाई: अदालती मुकदमों में उलझना आपके धन और समय का भारी अपव्यय कराएगा। ज्योतिषीय सलाह: किसी भी विवाद में हठधर्मिता छोड़कर मध्यस्थता (Arbitration) और आपसी समझौते द्वारा मामले को निपटाना ही परम बुद्धिमानी है।';
  }

  // 6c. Bandhana Yoga (Confinement / Police / Detention Risk)
  // Classical Parashara rule: Malefics enclosing 1st or 10th, or in 2nd/12th, 5th/9th, 6th/8th
  const isBandhanaActive = ([saturn.rasiHouseNumber, rahu.rasiHouseNumber, mars.rasiHouseNumber].includes(12) &&
    [saturn.rasiHouseNumber, rahu.rasiHouseNumber, mars.rasiHouseNumber].includes(2)) ||
    ([saturn.rasiHouseNumber, rahu.rasiHouseNumber].includes(6) && [saturn.rasiHouseNumber, rahu.rasiHouseNumber].includes(8));

  let bandhanaYogaEn = '';
  let bandhanaYogaHi = '';

  if (isBandhanaActive) {
    bandhanaYogaEn = 'Mild Bandhana Yoga (Risk of Regulatory Confinement or Police Detention): The malefic planetary alignment forms a classical Bandhana Yoga signature. This manifests as sudden bureaucratic inquiries, customs/tax interrogation, traffic detentions, or enforced home confinement/quarantine. Remedy: Regular recitation of Hanuman Chalisa and worship of Lord Bhairava directly dismantles this confinement knot.';
    bandhanaYogaHi = 'बंधन योग (सरकारी पूछताछ, पुलिस चालान अथवा अस्थाई हिरासत का जोखिम): जन्म चक्र में क्रूर ग्रहों की स्थिति से एक सूक्ष्म \'बंधन योग\' का निर्माण होता है। यह योग जीवन में कभी न कभी आयकर/जीएसटी जांच, पुलिस चौकी या थाने के चक्कर, अथवा किसी कानूनी प्रतिबंध/क्वारंटीन के रूप में शारीरिक गतिशीलता को सीमित करता है। निवारण: नित्य हनुमान चालीसा का पाठ तथा शनिवार को काल भैरव का स्मरण इस बंधन को तुरंत काट देता है।';
  } else {
    bandhanaYogaEn = 'Protected from Confinement / Clean Civil Record: There is no severe Bandhana Yoga in your chart. You will remain free from criminal incarceration, police detention, or physical captivity throughout your natural life.';
    bandhanaYogaHi = 'बंधन योग से पूर्ण मुक्ति / स्वच्छ नागरिक छवि: कुंडली में किसी प्रकार का कारावास अथवा आपराधिक बंधन योग नहीं है। आप जीवन भर सरकारी दंड, पुलिस हिरासत अथवा बंदी बनाए जाने के संकट से सर्वथा सुरक्षित रहेंगे।';
  }

  const causeEn = `Classical Astrological Cause: 6th House (litigation) ruled by ${h6Lord} in ${SIGNS[h6Sign].name}, 8th House (penalties) ruled by ${h8Lord} in ${SIGNS[h8Sign].name}, 12th House (confinement) ruled by ${h12Lord} in ${SIGNS[h12Sign].name}, and Parashara Bandhana Yoga formulations.`;
  const causeHi = `शास्त्रीय कारण: षष्ठ भाव (मुकदमा) स्वामी '${PLANET_HI[h6Lord] || h6Lord}', अष्टम भाव (दंड/आकस्मिक संकट) स्वामी '${PLANET_HI[h8Lord] || h8Lord}', द्वादश भाव (बंधन) स्वामी '${PLANET_HI[h12Lord] || h12Lord}', तथा महर्षि पाराशर प्रणीत 'बंधन योग' सूत्र।`;

  const section: ChapterSection = {
    titleEn: 'Litigation, Legal Battles, Incarceration Risk (Bandhana Yoga) & Clandestine Affairs',
    titleHi: 'मुकदमेबाजी, कोर्ट-कचहरी, बंधन योग (कारावास/पुलिस दंड) एवं गुप्त प्रेम संबंध',
    leadEn: 'Vulnerability to court disputes, regulatory audits, sudden confinement, and clandestine romantic scandals.',
    leadHi: 'षष्ठ व अष्टम भाव, बंधन योग एवं गुप्त प्रेम-प्रसंगों के कारण सामाजिक बदनामी व कानूनी विवादों का विश्लेषण।',
    paragraphsEn: [
      `Clandestine Romances & Extramarital Temptations: ${affairRiskEn}`,
      `Litigation, Court Battles & Property Disputes: ${litigationVerdictEn}`,
      `Incarceration & Police Confinement Risk (Bandhana Yoga): ${bandhanaYogaEn}`,
    ],
    paragraphsHi: [
      `गुप्त प्रेम प्रसंग, विवाहेतर संबंध एवं सामाजिक बदनामी का यथार्थ: ${affairRiskHi}`,
      `कोर्ट-कचहरी, मुकदमेबाजी एवं संपत्ति विवाद का फैसला: ${litigationVerdictHi}`,
      `बंधन योग, पुलिस पूछताछ एवं कारावास जोखिम का परीक्षण: ${bandhanaYogaHi}`,
    ],
    astrologicalCauseEn: causeEn,
    astrologicalCauseHi: causeHi,
    keyPointsEn: [
      `Affairs & Romance: ${affairRiskEn.split(':')[0]}`,
      `Court Verdict: ${litigationVerdictEn.split(':')[0]}`,
      `Bandhana Yoga: ${bandhanaYogaEn.split(':')[0]}`,
      `Protective Mantra: Hanuman Chalisa & Bhairava worship`,
    ],
    keyPointsHi: [
      `गुप्त संबंध जोखिम: ${affairRiskHi.split(':')[0]}`,
      `अदालती फैसला: ${litigationVerdictHi.split(':')[0]}`,
      `बंधन योग स्थिति: ${bandhanaYogaHi.split(':')[0]}`,
      `सुरक्षा उपाय: हनुमान चालीसा व काल भैरव स्मरण`,
    ],
  };

  return {
    section,
    data: {
      affairRiskEn,
      affairRiskHi,
      litigationVerdictEn,
      litigationVerdictHi,
      bandhanaYogaEn,
      bandhanaYogaHi,
    },
  };
}


// ============================================================================
// 7. COMPREHENSIVE VEDIC SHASTTRIC REMEDIES & GOCHAR SHIELD (CHAPTER 10)
// ============================================================================

export interface VedicRemediesResult {
  planetaryRemediesSection: ChapterSection;
  houseCleansingSection: ChapterSection;
  nakshatraSnanaSection: ChapterSection;
  gocharSadeSatiSection: ChapterSection;
  activeDashaSection: ChapterSection;
  lalKitabConductSection: ChapterSection;
  summaryHighlights: {
    activeMahadashaLord: string;
    activeAntardashaLord: string;
    sadeSatiStatusHi: string;
    sadeSatiStatusEn: string;
    janmaNakshatraDeityHi: string;
    janmaNakshatraDeityEn: string;
    primaryVedicMantra: string;
  };
}

const NAKSHATRA_DEITY_MAP: Record<number, {
  nameHi: string;
  nameEn: string;
  deityHi: string;
  deityEn: string;
  herbsHi: string;
  herbsEn: string;
  treeHi: string;
  treeEn: string;
}> = {
  0: { nameHi: 'अश्विनी', nameEn: 'Ashwini', deityHi: 'अश्विनी कुमार (देव वैद्य)', deityEn: 'Ashwini Kumaras (Divine Healers)', herbsHi: 'सुगंधित कपूर, लोध्र व देवदारु', herbsEn: 'Camphor, Lodhra & Devadaru', treeHi: 'कुचिला (Strychnos nux-vomica)', treeEn: 'Poison Nut Tree' },
  1: { nameHi: 'भरणी', nameEn: 'Bharani', deityHi: 'यमराज (धर्मराज)', deityEn: 'Lord Yama (Dharmaraja)', herbsHi: 'आंवला, नागरमोथा व कस्तूरी', herbsEn: 'Amla, Nagarmotha & Musk', treeHi: 'आंवला (Phyllanthus emblica)', treeEn: 'Indian Gooseberry' },
  2: { nameHi: 'कृत्तिका', nameEn: 'Krittika', deityHi: 'अग्नि देव', deityEn: 'Agni Deva (Fire God)', herbsHi: 'गूलर छाल, लाल चंदन व केसर', herbsEn: 'Cluster Fig bark, Red Sandalwood & Saffron', treeHi: 'गूलर (Ficus glomerata)', treeEn: 'Cluster Fig' },
  3: { nameHi: 'रोहिणी', nameEn: 'Rohini', deityHi: 'प्रजापति / ब्रह्मा जी', deityEn: 'Lord Brahma (Creator)', herbsHi: 'जामुन छाल, श्वेत चंदन व कमल पुष्प', herbsEn: 'Jamun bark, White Sandalwood & Lotus petals', treeHi: 'जामुन (Syzygium cumini)', treeEn: 'Black Plum' },
  4: { nameHi: 'मृगशिरा', nameEn: 'Mrigashira', deityHi: 'सोम / चंद्र देव', deityEn: 'Soma (Moon God)', herbsHi: 'खैर, खस व गुलाब जल', herbsEn: 'Khadira, Vetiver & Rose water', treeHi: 'खैर (Acacia catechu)', treeEn: 'Cutch Tree' },
  5: { nameHi: 'आर्द्रा', nameEn: 'Ardra', deityHi: 'रुद्र (भगवान शिव)', deityEn: 'Lord Rudra (Shiva)', herbsHi: 'बेलपत्र, अगर, लोबान व जायफल', herbsEn: 'Bilva leaves, Agarwood, Frankincense & Nutmeg', treeHi: 'शीशम (Dalbergia sissoo)', treeEn: 'Indian Rosewood' },
  6: { nameHi: 'पुनर्वसु', nameEn: 'Punarvasu', deityHi: 'अदिति (देव माता)', deityEn: 'Aditi (Cosmic Mother)', herbsHi: 'बांस पत्र, हल्दी, गेंदा व दूर्वा', herbsEn: 'Bamboo leaves, Turmeric, Marigold & Durva', treeHi: 'बांस (Bambusa vulgaris)', treeEn: 'Bamboo' },
  7: { nameHi: 'पुष्य', nameEn: 'Pushya', deityHi: 'देवगुरु बृहस्पति', deityEn: 'Brihaspati (Preceptor of Gods)', herbsHi: 'पीपल छाल, केसर, पीली सरसों व हल्दी', herbsEn: 'Peepal bark, Saffron, Yellow Mustard & Turmeric', treeHi: 'पीपल (Ficus religiosa)', treeEn: 'Sacred Fig' },
  8: { nameHi: 'आश्लेषा', nameEn: 'Ashlesha', deityHi: 'सर्प / नाग देव', deityEn: 'Nagas (Serpent Deities)', herbsHi: 'रक्त चंदन, काले तिल व भृंगराज', herbsEn: 'Red Sandalwood, Black Sesame & Bhringraj', treeHi: 'नागकेसर (Mesua ferrea)', treeEn: 'Ironwood' },
  9: { nameHi: 'मघा', nameEn: 'Magha', deityHi: 'पितृ गण (पूर्वज)', deityEn: 'Pitris (Ancestral Spirits)', herbsHi: 'बरगद छाल, तिल, गंगाजल व कुशा', herbsEn: 'Banyan bark, Sesame, Ganges water & Kusha grass', treeHi: 'बरगद (Ficus benghalensis)', treeEn: 'Banyan Tree' },
  10: { nameHi: 'पूर्वाफाल्गुनी', nameEn: 'Purva Phalguni', deityHi: 'भग (सौभाग्य देव)', deityEn: 'Bhaga (God of Fortune & Prosperity)', herbsHi: 'पलाश पुष्प, श्वेत चंदन व हरी इलायची', herbsEn: 'Palash flowers, White Sandalwood & Green Cardamom', treeHi: 'पलाश / ढाक (Butea monosperma)', treeEn: 'Flame of the Forest' },
  11: { nameHi: 'उत्तराफाल्गुनी', nameEn: 'Uttara Phalguni', deityHi: 'अर्यमा (मित्रता व कुल देव)', deityEn: 'Aryaman (God of Nobility & Lineage)', herbsHi: 'पाकड़ छाल, रक्त चंदन व कस्तूरी', herbsEn: 'Pakad bark, Red Sandalwood & Musk', treeHi: 'पाकड़ (Ficus infectoria)', treeEn: 'White Fig' },
  12: { nameHi: 'हस्त', nameEn: 'Hasta', deityHi: 'सविता (सूर्य देव)', deityEn: 'Savita (Solar Radiance)', herbsHi: 'रीठा, चमेली तेल व जायफल', herbsEn: 'Reetha, Jasmine oil & Nutmeg', treeHi: 'रीठा (Sapindus emarginatus)', treeEn: 'Soapnut Tree' },
  13: { nameHi: 'चित्रा', nameEn: 'Chitra', deityHi: 'त्वष्टा / विश्वकर्मा जी', deityEn: 'Tvashtar / Vishwakarma (Cosmic Architect)', herbsHi: 'बेल छाल, कपूर व कुंकुम', herbsEn: 'Bilva bark, Camphor & Kumkum', treeHi: 'बेल (Aegle marmelos)', treeEn: 'Bael Fruit Tree' },
  14: { nameHi: 'स्वाति', nameEn: 'Swati', deityHi: 'वायु देव', deityEn: 'Vayu Deva (Wind God)', herbsHi: 'अर्जुन छाल, सुगंधित खस व तुलसी', herbsEn: 'Arjuna bark, Vetiver & Holy Basil', treeHi: 'अर्जुन (Terminalia arjuna)', treeEn: 'Arjuna Tree' },
  15: { nameHi: 'विशाखा', nameEn: 'Vishakha', deityHi: 'इंद्राग्नि (इंद्र व अग्नि)', deityEn: 'Indra & Agni (Dual Powers)', herbsHi: 'नीम छाल, हरड़ व लोध्र', herbsEn: 'Neem bark, Haritaki & Lodhra', treeHi: 'विकंकत / कटाई (Flacourtia indica)', treeEn: 'Governor’s Plum' },
  16: { nameHi: 'अनुराधा', nameEn: 'Anuradha', deityHi: 'मित्र देव (सत्य व मैत्री)', deityEn: 'Mitra Deva (God of Friendship & Devotion)', herbsHi: 'मौलश्री छाल, केसर व सुगंधित इत्र', herbsEn: 'Maulsari bark, Saffron & Floral Attar', treeHi: 'मौलश्री / बकुल (Mimusops elengi)', treeEn: 'Spanish Cherry' },
  17: { nameHi: 'ज्येष्ठा', nameEn: 'Jyeshtha', deityHi: 'इंद्र देव (देवराज)', deityEn: 'Lord Indra (King of Devas)', herbsHi: 'चीड़, कपूर व त्रिफला चूर्ण', herbsEn: 'Pine resin, Camphor & Triphala', treeHi: 'चीड़ / शाल्मली (Pinus roxburghii)', treeEn: 'Silk Cotton Tree' },
  18: { nameHi: 'मूल', nameEn: 'Mula', deityHi: 'निर्ऋति (अल्क्ष्मी / महाकाली)', deityEn: 'Nirriti (Goddess of Dissolution)', herbsHi: 'राल, गुग्गुल, लोबान व सरसों', herbsEn: 'Dammar resin, Guggulu, Frankincense & Mustard', treeHi: 'अंजन / साल (Hardwickia binata)', treeEn: 'Black Hardwickia' },
  19: { nameHi: 'पूर्वाषाढ़ा', nameEn: 'Purva Ashadha', deityHi: 'अपः (जल देव)', deityEn: 'Apas (Cosmic Waters)', herbsHi: 'जलकुंभी, खस व श्वेत कमल दल', herbsEn: 'Water hyacinth, Vetiver & White Lotus', treeHi: 'जामुन / तिनिश (Syzygium cumini)', treeEn: 'Black Plum' },
  20: { nameHi: 'उत्तराषाढ़ा', nameEn: 'Uttara Ashadha', deityHi: 'विश्वेदेवा (सर्व देव)', deityEn: 'Vishvedevas (Universal Cosmic Principles)', herbsHi: 'कटहल पत्र, चंदन व प्रियंगु', herbsEn: 'Jackfruit leaves, Sandalwood & Priyangu', treeHi: 'कटहल (Artocarpus heterophyllus)', treeEn: 'Jackfruit Tree' },
  21: { nameHi: 'श्रवण', nameEn: 'Shravana', deityHi: 'भगवान विष्णु', deityEn: 'Lord Vishnu (Supreme Preserver)', herbsHi: 'मदार पत्र, तुलसी दल व श्वेत चंदन', herbsEn: 'Calotropis, Tulsi leaves & White Sandalwood', treeHi: 'मदार / आक (Calotropis procera)', treeEn: 'Crown Flower' },
  22: { nameHi: 'धनिष्ठा', nameEn: 'Dhanishta', deityHi: 'अष्ट वसु', deityEn: 'Ashta Vasus (Eight Elemental Gods)', herbsHi: 'शमी पत्र, कत्था व लोध्र', herbsEn: 'Shami leaves, Catechu & Lodhra', treeHi: 'शमी (Prosopis cineraria)', treeEn: 'Sponge Tree' },
  23: { nameHi: 'शतभिषा', nameEn: 'Shatabhisha', deityHi: 'वरुण देव (समुद्र देव)', deityEn: 'Varuna Deva (Lord of Oceans & Healer)', herbsHi: 'कदंब पत्र, नागरमोथा व कस्तूरी', herbsEn: 'Kadamba leaves, Nagarmotha & Musk', treeHi: 'कदंब (Neolamarckia cadamba)', treeEn: 'Burflower Tree' },
  24: { nameHi: 'पूर्वाभाद्रपद', nameEn: 'Purva Bhadrapada', deityHi: 'अज एकपाद (शिव का रूद्र रूप)', deityEn: 'Aja Ekapada (The Cosmic Fire Aspect)', herbsHi: 'आम छाल, गुग्गुल व काले तिल', herbsEn: 'Mango bark, Guggulu & Black Sesame', treeHi: 'आम (Mangifera indica)', treeEn: 'Mango Tree' },
  25: { nameHi: 'उत्तराभाद्रपद', nameEn: 'Uttara Bhadrapada', deityHi: 'अहिर्बुध्न्य (समुद्र तल के सर्प शिव)', deityEn: 'Ahirbudhnya (Serpent of the Depths)', herbsHi: 'नीम पत्र, चंदन व बेलपत्र', herbsEn: 'Neem leaves, Sandalwood & Bilva', treeHi: 'नीम (Azadirachta indica)', treeEn: 'Neem Tree' },
  26: { nameHi: 'रेवती', nameEn: 'Revati', deityHi: 'पूषा (मार्गदर्शक व पोषण देव)', deityEn: 'Pushan (The Cosmic Nourisher & Guide)', herbsHi: 'महुआ पुष्प, केवड़ा व श्वेत चंदन', herbsEn: 'Mahua flowers, Kewra water & White Sandalwood', treeHi: 'महुआ (Madhuca longifolia)', treeEn: 'Butter Tree' },
};

export const PLANET_VEDIC_REMEDIES: Record<string, {
  beejMantra: string;
  japCount: number;
  stotraHi: string;
  stotraEn: string;
  danaHi: string;
  danaEn: string;
  favorableDayHi: string;
  favorableDayEn: string;
}> = {
  Sun: {
    beejMantra: 'ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः',
    japCount: 7000,
    stotraHi: 'आदित्य हृदय स्तोत्र (वाल्मीकि रामायण)',
    stotraEn: 'Aditya Hridaya Stotra (Valmiki Ramayana)',
    danaHi: 'तांबा, गुड़, गेहूं, लाल चंदन, माणिक्य व लाल वस्त्र (रविवार दोपहर)',
    danaEn: 'Copper, Jaggery, Wheat, Red Sandalwood & Red Cloth (Sunday Noon)',
    favorableDayHi: 'रविवार',
    favorableDayEn: 'Sunday',
  },
  Moon: {
    beejMantra: 'ॐ श्रां श्रीं श्रौं सः चंद्रमसे नमः',
    japCount: 11000,
    stotraHi: 'शिव षडाक्षरी स्तोत्र अथवा महामृत्युंजय मंत्र',
    stotraEn: 'Shiva Shadakshari Stotra / Maha Mrityunjaya Mantra',
    danaHi: 'चांदी, बासमती चावल, दूध, श्वेत वस्त्र, कपूर व मोती (सोमवार संध्या)',
    danaEn: 'Silver, Rice, Milk, White Cloth, Camphor & Pearl (Monday Evening)',
    favorableDayHi: 'सोमवार',
    favorableDayEn: 'Monday',
  },
  Mars: {
    beejMantra: 'ॐ क्रां क्रीं क्रौं सः भौमाय नमः',
    japCount: 10000,
    stotraHi: 'ऋणमोचक मंगल स्तोत्र अथवा सुंदरकांड का पाठ',
    stotraEn: 'Rinmochana Mangala Stotra / Sundarkand recitation',
    danaHi: 'लाल मसूर दाल, तांबे का बर्तन, गुड़, लाल वस्त्र व मूंगा (मंगलवार दोपहर)',
    danaEn: 'Red Lentils, Copper vessel, Jaggery, Red Cloth & Coral (Tuesday Noon)',
    favorableDayHi: 'मंगलवार',
    favorableDayEn: 'Tuesday',
  },
  Mercury: {
    beejMantra: 'ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः',
    japCount: 9000,
    stotraHi: 'श्री विष्णु सहस्रनाम स्तोत्र',
    stotraEn: 'Shri Vishnu Sahasranama Stotra',
    danaHi: 'साबुत हरी मूंग, कांसे का पात्र, हरा वस्त्र, तुलसी पत्र व पन्ना (बुधवार प्रातः)',
    danaEn: 'Whole Green Moong, Bronze bowl, Green Cloth & Emerald (Wednesday Morning)',
    favorableDayHi: 'बुधवार',
    favorableDayEn: 'Wednesday',
  },
  Jupiter: {
    beejMantra: 'ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः',
    japCount: 19000,
    stotraHi: 'बृहस्पति स्तोत्र अथवा श्रीमद्भगवद्गीता द्वादश अध्याय',
    stotraEn: 'Brihaspati Stotra / Srimad Bhagavad Gita Chapter 12',
    danaHi: 'चने की दाल, हल्दी गांठ, पीला वस्त्र, केसर, धार्मिक पुस्तकें व पुखराज (गुरुवार प्रातः)',
    danaEn: 'Chana Dal, Raw Turmeric, Yellow Cloth, Saffron & Yellow Sapphire (Thursday Morning)',
    favorableDayHi: 'गुरुवार',
    favorableDayEn: 'Thursday',
  },
  Venus: {
    beejMantra: 'ॐ द्रां द्रीं द्रौं सः शुक्राय नमः',
    japCount: 16000,
    stotraHi: 'श्री कनकधारा स्तोत्र अथवा श्री सूक्तम्',
    stotraEn: 'Shri Kanakadhara Stotra / Shri Suktam',
    danaHi: 'मिश्री, खीर, कपूर, सुगंधित इत्र, श्वेत रेशमी वस्त्र व हीरा/ओपल (शुक्रवार प्रातः)',
    danaEn: 'Sugar Candy, Kheer, Camphor, Perfume, White Silk & Diamond/Opal (Friday Morning)',
    favorableDayHi: 'शुक्रवार',
    favorableDayEn: 'Friday',
  },
  Saturn: {
    beejMantra: 'ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः',
    japCount: 23000,
    stotraHi: 'दशरथकृत शनि स्तोत्र व हनुमान बाहुक',
    stotraEn: 'Dasharatha Shani Stotra & Hanuman Bahuk',
    danaHi: 'काले तिल, उड़द दाल, सरसों का तेल, लोहे का तवा, काला कंबल व नीलम (शनिवार संध्या)',
    danaEn: 'Black Sesame, Urad Dal, Mustard Oil, Iron Griddle, Black Blanket & Blue Sapphire (Saturday Sunset)',
    favorableDayHi: 'शनिवार',
    favorableDayEn: 'Saturday',
  },
  Rahu: {
    beejMantra: 'ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः',
    japCount: 18000,
    stotraHi: 'दुर्गा कवच, अर्गला-कीलक व काल भैरव अष्टक',
    stotraEn: 'Durga Kavach, Argala-Kilak & Kalabhairava Ashtakam',
    danaHi: 'उड़द, सूखा नारियल, काले तिल, सीसा धातु व गोमेद (शनिवार सूर्यास्त बाद)',
    danaEn: 'Dry Coconut, Urad Dal, Black Sesame, Lead & Hessonite (Saturday Dusk)',
    favorableDayHi: 'शनिवार',
    favorableDayEn: 'Saturday',
  },
  Ketu: {
    beejMantra: 'ॐ स्रां स्रीं स्रौं सः केतवे नमः',
    japCount: 17000,
    stotraHi: 'गणपति अथर्वशीर्ष व महागणपति स्तोत्र',
    stotraEn: 'Ganapati Atharvashirsha & Maha Ganapati Stotra',
    danaHi: 'सप्तधान्य (7 प्रकार के अनाज), कंबल, लहसुनिया व तिल (बुधवार/शनिवार प्रातः)',
    danaEn: 'Mixed Seven Grains (Saptadhanya), Blanket, Cat\'s Eye & Sesame (Wednesday/Saturday Dawn)',
    favorableDayHi: 'बुधवार',
    favorableDayEn: 'Wednesday',
  },
};

export function computeComprehensiveVedicRemedies(
  chart: ChartData,
  lalKitab?: {
    sleepingHouses: Array<{ houseNumber: number; pakkaGharRuler: string; pakkaGharRulerHi?: string; isSleeping: boolean }>;
    karmicDebts: Array<{ debtType: string; debtTypeHi: string; isTriggered: boolean; classicalCauseEn: string; classicalCauseHi: string }>;
  }
): VedicRemediesResult {
  const asc = chart.ascendant;
  const moon = chart.planets.find((p) => p.id === 'Moon')!;
  const saturn = chart.planets.find((p) => p.id === 'Saturn')!;
  const nakshatraIndex = chart.panchang.nakshatra?.index ?? Math.floor(moon.longitude / (360 / 27));
  const nakshatraData = NAKSHATRA_DEITY_MAP[nakshatraIndex] || NAKSHATRA_DEITY_MAP[0];

  // 1. Identify Afflicted / Priority Planets for Vedic Propitiation
  const afflictedPlanets = chart.planets.filter((p) => {
    return (
      p.dignity === 'Debilitated' ||
      p.isCombust ||
      [6, 8, 12].includes(p.rasiHouseNumber) ||
      (p.isRetrograde && ['Saturn', 'Mars', 'Rahu', 'Ketu'].includes(p.id))
    );
  });

  const priorityPlanets = afflictedPlanets.length > 0 ? afflictedPlanets : [saturn, moon];

  const planetaryParaEn = priorityPlanets.map((p) => {
    const rem = PLANET_VEDIC_REMEDIES[p.id] || PLANET_VEDIC_REMEDIES.Saturn;
    return `• ${p.id} (${p.signName}, House ${p.rasiHouseNumber}, ${p.dignity}): Recite Vedic Tantrik Beej Mantra "${rem.beejMantra}" (${rem.japCount.toLocaleString()} times). Chant "${rem.stotraEn}". Shastric Charity (Dana): ${rem.danaEn}. Favorable Day: ${rem.favorableDayEn}.`;
  });

  const planetaryParaHi = priorityPlanets.map((p) => {
    const rem = PLANET_VEDIC_REMEDIES[p.id] || PLANET_VEDIC_REMEDIES.Saturn;
    const nameHi = PLANET_HI[p.id] || p.id;
    return `• ${nameHi} देव (${SIGN_HI[p.signIndex]} राशि, भाव ${p.rasiHouseNumber}, ${p.dignity}): वैदिक तांत्रिक बीज मंत्र "${rem.beejMantra}" का कुल ${rem.japCount.toLocaleString()} बार जप करें। नित्य "${rem.stotraHi}" का पाठ करें। शास्त्रीय दान द्रव्य: ${rem.danaHi}। अनुष्ठान का सर्वोत्तम दिवस: ${rem.favorableDayHi}।`;
  });

  const planetaryRemediesSection: ChapterSection = {
    titleEn: 'Vedic Planetary Shanti: Sacred Tantrik Seed Mantras, Classical Stotras & Targeted Dana',
    titleHi: 'वैदिक नवग्रह शांति: सिद्ध तांत्रिक बीज मंत्र, शास्त्रीय स्तोत्र एवं विशिष्ट दान विधान',
    leadEn: 'Authentic shastric remedial protocols tailored strictly to the afflicted and vulnerable planets in your chart.',
    leadHi: 'कुंडली के पीड़ित, नीच, अस्त व त्रिक भावों में स्थित ग्रहों के कुप्रभाव को शांत करने के शास्त्रीय विधान।',
    paragraphsEn: [
      `Vedic astrology establishes that afflictions to planets are not permanent curses, but energetic imbalances that can be pacified through sound vibrations (Mantras), devotion (Stotras), and sacrificial charity (Dana). Below are the precise shastric prescriptions for the planets in your chart that demand immediate propitiation:`,
      ...planetaryParaEn,
      `Core Principle: Always perform japa during the auspicious planetary hora or on the prescribed weekday using a Rudraksha or Tulsi mala, facing East or North.`,
    ],
    paragraphsHi: [
      `वैदिक ज्योतिष में महर्षि पाराशर स्पष्ट करते हैं कि ग्रहों का अनिष्ट फल कोई अमिट अभिशाप नहीं, बल्कि प्रारब्ध की विकृत ऊर्जा है जिसे ध्वनि-स्पंदन (मंत्र), समर्पण (स्तोत्र) और त्याग (दान) से पूर्णतः शांत किया जा सकता है। आपकी कुंडली में विशेष रूप से पीड़ित ग्रहों के लिए शास्त्रीय अनुष्ठान:`,
      ...planetaryParaHi,
      `अनुष्ठान का मौलिक नियम: जप सदैव पूर्व अथवा उत्तर दिशा की ओर मुख करके, शुद्ध रुद्राक्ष अथवा तुलसी की माला से, उस ग्रह के निर्धारित वार अथवा ग्रह होरा में ही करें।`,
    ],
    astrologicalCauseEn: 'Computed through combustion, debilitation, retrograde malefic status, and 6th/8th/12th Dusthana placements.',
    astrologicalCauseHi: 'शास्त्रीय कारण: ग्रहों की नीच राशि, अस्त स्थिति, वक्री क्रूर प्रभाव तथा षष्ठ, अष्टम व द्वादश (त्रिक) भावों में अवस्थिति द्वारा प्रमाणित।',
    keyPointsEn: priorityPlanets.map((p) => `${p.id}: ${(PLANET_VEDIC_REMEDIES[p.id] || PLANET_VEDIC_REMEDIES.Saturn).beejMantra}`),
    keyPointsHi: priorityPlanets.map((p) => `${PLANET_HI[p.id] || p.id}: ${(PLANET_VEDIC_REMEDIES[p.id] || PLANET_VEDIC_REMEDIES.Saturn).beejMantra}`),
  };

  // 2. House Cleansing & Dusthana Pacification (6, 8, 12 Bhava Shuddhi)
  const houseCleansingSection: ChapterSection = {
    titleEn: 'Dusthana Cleansing & House Purification (6th, 8th & 12th Bhava Shuddhi)',
    titleHi: 'त्रिक भाव शुद्धि एवं दोष निवारण: षष्ठ (शत्रु/ऋण), अष्टम (संकट) व द्वादश (हानि/अस्पताल) भाव',
    leadEn: 'Specialized environmental, spatial, and ritual remedies to neutralize financial leakage and sudden shocks.',
    leadHi: 'रोग, ऋण, शत्रु, आकस्मिक दुर्घटना तथा व्यर्थ के धन रिसाव को रोकने के अचूक वैदिक वास्तु व भाव शुद्धि उपाय।',
    paragraphsEn: [
      `1. 6th House Cleansing (Roga, Rina & Shatru Shanti): Never borrow money or initiate formal loans on Tuesdays. Feed green fodder (Palak or grass) to street cows on Wednesdays to dismantle debt accumulation knots. Place a small piece of unrefined camphor in the bathroom to dissolve pathogenic micro-frequencies.`,
      `2. 8th House Cleansing (Ayush, Randhra & Sudden Crisis Defense): Perform Rudrabhisheka with milk and honey on monthly Pradosha or Mondays. Donate a cast-iron utensil or mustard oil on Amavasya (New Moon). Keep an unbroken silver square piece in your wallet to stabilize life-force vitality against unexpected accidents.`,
      `3. 12th House Cleansing (Vyaya, Hospitalization & Sleep Restoration): Never sleep with your head pointing North (align South or East). Ensure no water taps drip in the home. Donate fresh drinking water or install water dispensers at public religious places to seal financial drain.`,
    ],
    paragraphsHi: [
      `1. षष्ठ भाव शुद्धि (रोग, ऋण व शत्रु निवारण): मंगलवार के दिन भूलकर भी कर्ज न लें और न ही कर्ज के कागजात पर हस्ताक्षर करें। बुधवार के दिन गाय को हरा पालक अथवा हरी घास खिलाने से पुराने कर्जों का बंधन कटता है। स्नानघर (बाथरूम) में एक कांच की कटोरी में डली वाला सेंधा नमक अथवा कपूर रखने से नकारात्मक ऊर्जा समाप्त होती है।`,
      `2. अष्टम भाव शुद्धि (आयु रक्षा व आकस्मिक संकट निवारण): प्रत्येक प्रदोष अथवा सोमवार को भगवान शिव का दूध व शहद से रुद्राभिषेक करें। अमावस्या के दिन लोहे का तवा अथवा काले तिल किसी जरूरतमंद को दान करें। अपने पर्स या तिजोरी में चौकोर चांदी का टुकड़ा रखने से अष्टम भाव के अचानक आने वाले वित्तीय झटके निष्प्रभावी हो जाते हैं।`,
      `3. द्वादश भाव शुद्धि (अस्पताल व्यय, अनिद्रा व धन रिसाव निवारण): सोते समय सिर सदैव दक्षिण अथवा पूर्व दिशा में रखें, उत्तर में कभी न रखें। घर का कोई भी नल टपकता न रहे। सार्वजनिक स्थानों पर राहगीरों के लिए शीतल पेयजल की व्यवस्था करने से द्वादश भाव का अस्पताल व जेल का खर्च शून्य हो जाता है।`,
    ],
    astrologicalCauseEn: 'Formulated according to Parashara Hora guidelines for mitigating 6th, 8th, and 12th trika bhava afflictions.',
    astrologicalCauseHi: 'शास्त्रीय कारण: महर्षि पाराशर सम्मत षष्ठ, अष्टम व द्वादश भावों के अनिष्ट निवारण सूत्र।',
    keyPointsEn: [
      '6th House: Wednesday green fodder to cows (clears debt)',
      '8th House: Pradosha Rudrabhisheka & silver square',
      '12th House: South/East sleep alignment & tap repairs',
    ],
    keyPointsHi: [
      'षष्ठ भाव: बुधवार को गाय को हरा चारा (कर्ज मुक्ति)',
      'अष्टम भाव: प्रदोष रुद्राभिषेक व चौकोर चांदी (संकट निवारण)',
      'द्वादश भाव: दक्षिण सिरहाना व टपकते नल की मरम्मत',
    ],
  };

  // 3. Janma Nakshatra Deity & Sacred Herbal Bath (नक्षत्र औषधि स्नान)
  const nakshatraSnanaSection: ChapterSection = {
    titleEn: `Janma Nakshatra Deity (${nakshatraData.nameEn}) & Sacred Herbal Bath (वनस्पति स्नान)`,
    titleHi: `जन्म नक्षत्र देवता (${nakshatraData.nameHi}), तारा शुद्धि एवं पावन वनस्पति/औषधि स्नान`,
    leadEn: 'Reconnecting with your cosmic birth star deity and purifying your electromagnetic aura through sacred botanicals.',
    leadHi: 'जन्म नक्षत्र के अधिष्ठाता देवता की उपासना, नक्षत्र वृक्ष की सेवा एवं पावन जड़ी-बूटी स्नान विधान।',
    paragraphsEn: [
      `Your natal Moon resides in "${nakshatraData.nameEn}" Nakshatra. The supreme presiding Vedic deity of this asterism is "${nakshatraData.deityEn}". Reverence to this cosmic deity activates your inherent spiritual intelligence, harmonizes mental perception, and removes hidden obstacles that planetary dashas cannot reach.`,
      `Parashari Sacred Herbal Bath (औषधि स्नान विधि): On days when the Moon transits your Janma Nakshatra or on your birth weekday, add the following sacred botanicals to your warm bathwater: ${nakshatraData.herbsEn}. Bathing with this herbal infusion cleanses your subtle aura, purges psychic exhaustion, and shields you from negative projections.`,
      `Sacred Constellation Tree (नक्षत्र वृक्ष): The sacred tree aligned with your birth star is the "${nakshatraData.treeEn}" (${nakshatraData.treeHi}). Plant this tree, water it regularly, or pay obeisance to it. Never cut or harm this species, as it serves as your primary cosmic grounding cord.`,
    ],
    paragraphsHi: [
      `आपकी जन्म कुंडली में चंद्र देव "${nakshatraData.nameHi}" नक्षत्र में स्थित हैं। इस पावन नक्षत्र के अधिष्ठाता वैदिक देवता "${nakshatraData.deityHi}" हैं। इस नक्षत्र देवता का स्मरण व उनके बीज मंत्र का ध्यान करने से अंतःकरण की शुद्धि होती है और उन अदृश्य बाधाओं का नाश होता है जो सामान्य ग्रह उपायों से नहीं कटतीं।`,
      `पाराशरी पावन औषधि स्नान विधि: जिस दिन चंद्रमा आपके जन्म नक्षत्र "${nakshatraData.nameHi}" में गोचर करे अथवा आपके जन्म वार के दिन, स्नान के जल में निम्नलिखित जड़ी-बूटियों का मिश्रण डालें: ${nakshatraData.herbsHi}। इस पवित्र वनस्पति जल से स्नान करने से सूक्ष्म शरीर (Aura) की मलिनता धुल जाती है और नजर-दोष व मानसिक अवसाद तुरंत दूर होता है।`,
      `पावन नक्षत्र वृक्ष: आपके नक्षत्र का आराध्य वृक्ष "${nakshatraData.treeHi}" (${nakshatraData.treeEn}) है। इस वृक्ष का एक पौधा किसी वाटिका या मंदिर परिसर में लगाएं अथवा इसकी नियमित सेवा करें। इस वृक्ष को कभी हानि न पहुंचाएं; यह आपके प्राण-तत्व का ब्रह्मांडीय आधार है।`,
    ],
    astrologicalCauseEn: `Computed via Moon's longitudinal placement in Nakshatra #${nakshatraIndex + 1} (${nakshatraData.nameEn}) and Parashara Snana Vidhi.`,
    astrologicalCauseHi: `शास्त्रीय कारण: चंद्र देव की '${nakshatraData.nameHi}' नक्षत्र में स्थिति तथा महर्षि पाराशर प्रणीत नक्षत्र वनस्पति स्नान विधान।`,
    keyPointsEn: [
      `Birth Asterism: ${nakshatraData.nameEn}`,
      `Presiding Deity: ${nakshatraData.deityEn}`,
      `Sacred Bath Herbs: ${nakshatraData.herbsEn}`,
      `Sacred Tree: ${nakshatraData.treeEn}`,
    ],
    keyPointsHi: [
      `जन्म नक्षत्र: ${nakshatraData.nameHi}`,
      `अधिष्ठाता देवता: ${nakshatraData.deityHi}`,
      `औषधि स्नान सामग्री: ${nakshatraData.herbsHi}`,
      `नक्षत्र वृक्ष: ${nakshatraData.treeHi}`,
    ],
  };

  // 4. Active Gochar & Sade Sati Protective Shield (गोचर शांति)
  // Saturn current transit is in Aquarius (SignIndex 10) / Pisces (SignIndex 11)
  const currentSaturnSignIndex = 10; // Sidereal Aquarius
  const saturnHouseFromMoon = ((currentSaturnSignIndex - moon.signIndex + 12) % 12) + 1;

  let sadeSatiStatusHi = '';
  let sadeSatiStatusEn = '';
  let sadeSatiRemedyHi = '';
  let sadeSatiRemedyEn = '';

  if (saturnHouseFromMoon === 12) {
    sadeSatiStatusHi = 'शनि साढ़ेसाती का प्रथम चरण (उदयमान/चढ़ती साढ़ेसाती)';
    sadeSatiStatusEn = 'Saturn Sade Sati: First Phase (Rising / Charhti Phase)';
    sadeSatiRemedyHi = 'शनिवार को लोहे के कटोरे में सरसों का तेल भरकर उसमें अपना मुख देखकर छाया दान करें (छाया पात्र दान)। सिर पर भारी बोझ न लें।';
    sadeSatiRemedyEn = 'Perform Chhaya Patra Daan on Saturdays (looking at your reflection in mustard oil in an iron bowl, then donating it). Guard against unnecessary mental anxiety and excessive financial expenditure.';
  } else if (saturnHouseFromMoon === 1) {
    sadeSatiStatusHi = 'शनि साढ़ेसाती का द्वितीय चरण (शिखर/मध्यम साढ़ेसाती - सर्वोच्च परीक्षा काल)';
    sadeSatiStatusEn = 'Saturn Sade Sati: Peak Phase (Mid-Phase - Pinnacle of Karmic Testing)';
    sadeSatiRemedyHi = 'शनि देव के सम्मुख दशरथकृत शनि स्तोत्र का पाठ करें। शमी वृक्ष की जड़ में तिल के तेल का दीपक प्रज्वलित करें। श्रमिकों व असहायों को मीठा भोजन दें।';
    sadeSatiRemedyEn = 'Recite Dasharatha Shani Stotra daily before a mustard oil lamp. Light a sesame-oil deepam at the base of a Shami tree on Saturday evenings. Treat laborers and sanitary workers with supreme dignity.';
  } else if (saturnHouseFromMoon === 2) {
    sadeSatiStatusHi = 'शनि साढ़ेसाती का तृतीय चरण (अस्तगामी/उतरती साढ़ेसाती)';
    sadeSatiStatusEn = 'Saturn Sade Sati: Third Phase (Setting / Utarti Phase)';
    sadeSatiRemedyHi = 'वाणी में संयम रखें और कटु वचनों से बचें। काले कंबल का दान करें और नित्य हनुमान बाहुक का पाठ करें। संचित धन सुरक्षित रहेगा।';
    sadeSatiRemedyEn = 'Maintain disciplined, gentle speech; avoid harsh words. Donate black blankets to the needy and recite Hanuman Bahuk daily to safeguard accumulated savings.';
  } else if (saturnHouseFromMoon === 4) {
    sadeSatiStatusHi = 'कंटक शनि / चतुर्थ ढैया (लघु कल्याणी ढैया)';
    sadeSatiStatusEn = 'Kantaka Shani / 4th House Dhaiya (Minor Hardship Transit)';
    sadeSatiRemedyHi = 'शनिवार को पीपल के वृक्ष की सात परिक्रमा करें और जल अर्पित करें। घर में कलह से बचें और माता की सेवा करें।';
    sadeSatiRemedyEn = 'Perform 7 circumambulations (Parikrama) of a Peepal tree on Saturdays. Serve your mother with devotion and avoid domestic friction.';
  } else if (saturnHouseFromMoon === 8) {
    sadeSatiStatusHi = 'अष्टम शनि ढैया (अत्यंत संवेदनशील परीक्षा काल)';
    sadeSatiStatusEn = 'Ashtama Shani Dhaiya (Intense Health & Obstacle Testing Transit)';
    sadeSatiRemedyHi = 'महामृत्युंजय मंत्र का नित्य 108 बार जप करें। वाहन सावधानी से चलाएं और शनिवार संध्या काल भैरव को इमरती या उड़द के वड़े का भोग लगाएं।';
    sadeSatiRemedyEn = 'Recite the Maha Mrityunjaya Mantra 108 times daily. Drive with extreme caution and offer Urad dal vadas to Lord Bhairava on Saturday evenings.';
  } else {
    sadeSatiStatusHi = `शनि गोचर चंद्र से भाव ${saturnHouseFromMoon} में (वर्तमान में साढ़ेसाती या ढैया का कोई प्रभाव नहीं है)`;
    sadeSatiStatusEn = `Saturn Transiting House ${saturnHouseFromMoon} from Natal Moon (No Sade Sati or Dhaiya currently active)`;
    sadeSatiRemedyHi = 'शनि देव अनुकूल गोचर में हैं। नित्य हनुमान चालीसा का पाठ करें और अपने अधीनस्थों के साथ निष्कपट व न्यायपूर्ण व्यवहार बनाए रखें।';
    sadeSatiRemedyEn = 'Saturn is transiting a favorable corridor. Maintain regular recitation of Hanuman Chalisa and practice transparent fairness with all subordinates.';
  }

  const gocharSadeSatiSection: ChapterSection = {
    titleEn: 'Active Gochar & Saturn Sade Sati / Dhaiya Protective Shield',
    titleHi: 'वर्तमान सक्रिय गोचर: शनि साढ़ेसाती/ढैया परीक्षण एवं अचूक सुरक्षा चक्र',
    leadEn: 'Real-time transit diagnostics relative to your natal Moon sign and immediate protective measures.',
    leadHi: 'जन्म चंद्र राशि से शनि, गुरु व राहु-केतु के वर्तमान गोचर का प्रभाव एवं संकट निवारण उपाय।',
    paragraphsEn: [
      `Current Sidereal Saturn Status: ${sadeSatiStatusEn}.`,
      `Shastric Transit Diagnostic: When transiting Saturn contacts or aspects the natal Moon sign, it initiates a rigorous phase of karmic auditing, pruning illusions, and enforcing disciplined humility.`,
      `Protective Remedial Shield: ${sadeSatiRemedyEn}`,
      `Rahu-Ketu Transit Pacification: To pacify the current lunar nodal axis, recite the Navagraha Stotra every evening and feed stray dogs with fresh sweet bread (roti) on Saturday nights.`,
    ],
    paragraphsHi: [
      `वर्तमान शनि गोचर की स्थिति: ${sadeSatiStatusHi}।`,
      `शास्त्रीय गोचर विश्लेषण: जब शनि देव जन्म चंद्र से संवेदनशील भावों में संचार करते हैं, तो वे व्यक्ति के जीवन से मिथ्या अहंकार, असावधानी और भ्रम को समाप्त कर कठोर यथार्थ व अनुशासन का पाठ पढ़ाते हैं।`,
      `अचूक सुरक्षा कवच: ${sadeSatiRemedyHi}`,
      `राहु-केतु गोचर शांति: वर्तमान राहु-केतु अक्ष की शांति हेतु प्रतिदिन संध्याकाल में 'नवग्रह पीड़ा नाशक स्तोत्र' का पाठ करें और शनिवार की रात काले श्वान (कुत्ते) को मीठी रोटी अवश्य खिलाएं।`,
    ],
    astrologicalCauseEn: `Evaluated by calculating Saturn's current sidereal transit sign relative to natal Moon sign (${SIGN_HI[moon.signIndex]}).`,
    astrologicalCauseHi: `शास्त्रीय कारण: जन्म चंद्र राशि ('${SIGN_HI[moon.signIndex]}') से गोचरस्थ शनि देव के भाव संबंध द्वारा प्रमाणित।`,
    keyPointsEn: [
      `Sade Sati Status: ${sadeSatiStatusEn.split('(')[0].trim()}`,
      `Primary Gochar Remedy: ${sadeSatiRemedyEn.split('.')[0]}`,
      `Nodal Shield: Feed stray dogs on Saturdays`,
    ],
    keyPointsHi: [
      `साढ़ेसाती/ढैया स्थिति: ${sadeSatiStatusHi.split('(')[0].trim()}`,
      `मुख्य गोचर उपाय: ${sadeSatiRemedyHi.split('।')[0]}`,
      `राहु-केतु रक्षा: शनिवार रात काले कुत्ते को मीठी रोटी`,
    ],
  };

  // 5. Active Mahadasha & Antardasha Targeted Daily Prescription
  const nowMs = Date.now();
  let activeMaha: DashaPeriod | null = null;
  let activeAntar: DashaPeriod | null = null;

  if (chart.vimshottari && chart.vimshottari.length > 0) {
    for (const m of chart.vimshottari) {
      if (m.startMs <= nowMs && m.endMs >= nowMs) {
        activeMaha = m;
        if (m.children && m.children.length > 0) {
          for (const a of m.children) {
            if (a.startMs <= nowMs && a.endMs >= nowMs) {
              activeAntar = a;
              break;
            }
          }
        }
        break;
      }
    }
  }

  const mahaLord = activeMaha?.lord || chart.ascendant.signLord;
  const antarLord = activeAntar?.lord || chart.planets[0].id;
  const mahaRem = PLANET_VEDIC_REMEDIES[mahaLord] || PLANET_VEDIC_REMEDIES.Jupiter;
  const antarRem = PLANET_VEDIC_REMEDIES[antarLord] || PLANET_VEDIC_REMEDIES.Saturn;

  const activeDashaSection: ChapterSection = {
    titleEn: `Active Running Dasha Prescription: Mahadasha (${mahaLord}) & Antardasha (${antarLord})`,
    titleHi: `सक्रिय महादशा-अंतर्दशा का अचूक उपाय: महादशा स्वामी (${PLANET_HI[mahaLord] || mahaLord}) एवं अंतर्दशा स्वामी (${PLANET_HI[antarLord] || antarLord})`,
    leadEn: 'High-precision remedies targeted specifically at the currently executing planetary time-lords.',
    leadHi: 'वर्तमान में चल रही विंशोत्तरी महादशा व अंतर्दशा के अधिपति ग्रहों का विशिष्ट दैनिक अनुष्ठान।',
    paragraphsEn: [
      `According to the Vimshottari Dasha system, your current life chapter is actively ruled by Mahadasha Lord "${mahaLord}" and Antardasha Lord "${antarLord}". The events, mental focus, opportunities, and obstacles you experience today are directly mediated by these two planetary vibrations.`,
      `Primary Mahadasha Ritual (${mahaLord}): Dedicate 5 minutes every morning to chanting the Beej Mantra "${mahaRem.beejMantra}". Regularly read or listen to "${mahaRem.stotraEn}". This aligns the broad canvas of your fortune with divine harmony.`,
      `Secondary Antardasha Correction (${antarLord}): Because the Antardasha delivers immediate operational results, perform targeted charity of ${antarRem.danaEn} on ${antarRem.favorableDayEn}. This pacifies the immediate friction and unlocks pending approvals.`,
    ],
    paragraphsHi: [
      `विंशोत्तरी दशा पद्धति के अनुसार वर्तमान कालखंड में आपके जीवन पर महादशा स्वामी '${PLANET_HI[mahaLord] || mahaLord}' एवं अंतर्दशा स्वामी '${PLANET_HI[antarLord] || antarLord}' का प्रत्यक्ष आधिपत्य है। आज आपके समक्ष आने वाले अवसर, मानसिक विचार और बाधाएं इन्हीं दो ग्रहों की रश्मियों द्वारा संचालित हो रही हैं।`,
      `महादशा स्वामी (${PLANET_HI[mahaLord] || mahaLord}) का मुख्य अनुष्ठान: प्रतिदिन प्रातःकाल इनके तांत्रिक बीज मंत्र "${mahaRem.beejMantra}" का कम से कम 1 माला (108 बार) जप करें तथा "${mahaRem.stotraHi}" का पाठ करें। इससे जीवन की मुख्य धारा में सकारात्मक गति आती है।`,
      `अंतर्दशा स्वामी (${PLANET_HI[antarLord] || antarLord}) का त्वरित निवारण: चूंकि अंतर्दशा स्वामी दैनिक जीवन के व्यावहारिक परिणाम तय करता है, अतः इनके अनुकूल दिवस (${antarRem.favorableDayHi}) पर ${antarRem.danaHi} का शास्त्रीय दान करें। इससे तात्कालिक रुकावटें तुरंत समाप्त होती हैं।`,
    ],
    astrologicalCauseEn: `Derived by computing the exact active Vimshottari Mahadasha and Antardasha periods as of the current timestamp.`,
    astrologicalCauseHi: `शास्त्रीय कारण: वर्तमान समय पर सक्रिय विंशोत्तरी महादशा एवं अंतर्दशा के गणितीय काल-विस्तार द्वारा प्रमाणित।`,
    keyPointsEn: [
      `Active Mahadasha: ${mahaLord} (${mahaRem.beejMantra})`,
      `Active Antardasha: ${antarLord} (${antarRem.beejMantra})`,
      `Primary Stotra: ${mahaRem.stotraEn}`,
      `Weekly Dana: ${antarRem.danaEn.split('(')[0].trim()}`,
    ],
    keyPointsHi: [
      `सक्रिय महादशा: ${PLANET_HI[mahaLord] || mahaLord} (${mahaRem.beejMantra})`,
      `सक्रिय अंतर्दशा: ${PLANET_HI[antarLord] || antarLord} (${antarRem.beejMantra})`,
      `मुख्य स्तोत्र: ${mahaRem.stotraHi}`,
      `साप्ताहिक दान: ${antarRem.danaHi.split('(')[0].trim()}`,
    ],
  };

  // 6. Lal Kitab Conduct & Sleeping Houses (Preserved and Clearly Defined)
  const sleepingHouses = lalKitab?.sleepingHouses.filter((h) => h.isSleeping) ?? [];
  const activeDebts = lalKitab?.karmicDebts.filter((d) => d.isTriggered) ?? [];

  const lalKitabConductSection: ChapterSection = {
    titleEn: 'Lal Kitab Conduct Rules, Sleeping Houses Awakening & Ancestral Debts',
    titleHi: 'लाल किताब आचरण सुधार संहिता, सोए घर जगाने के नियम एवं पैतृक ऋण मुक्ति',
    leadEn: 'Ethical behavior modifications, awakening dormant houses, and discharging inherited ancestral contracts.',
    leadHi: 'लाल किताब के अनुसार सोए हुए भावों को जाग्रत करने की विधि, पैतृक ऋणों का निवारण एवं आचरण शुद्धि।',
    paragraphsEn: [
      `Lal Kitab Tewa: Sleeping Houses Awakening: In your fixed Aries matrix, the primary dormant houses are: ${sleepingHouses.map((h) => `House ${h.houseNumber} (Ruler: ${h.pakkaGharRuler})`).join(', ') || 'House 2 and House 9'}. Awaken dormant houses through lifestyle conduct: respect elders to activate House 2; honor spiritual teachers and ancestral traditions to activate House 9; and maintain honest, punctual wage payments to daily laborers to awaken House 10.`,
      `Ancestral Karmic Debts (Lal Kitab Rin): ${activeDebts.length > 0 ? activeDebts.map((d) => `${d.debtType} (${d.classicalCauseEn})`).join('; ') : 'No severe ancestral debts are triggered; maintaining ethical conduct and fulfilling verbal commitments ensures sustained prosperity'}.`,
      `Five Golden Rules of Daily Conduct: (1) Never waste drinking water or allow leaky faucets (Moon); (2) Touch the feet of elder parents daily before critical journeys (Sun & Jupiter); (3) Feed soaked green moong dal or grass to street cows on Wednesdays (Mercury); (4) Treat sanitation workers and domestic staff with generous respect (Saturn); and (5) Keep sweet roti or milk for street dogs on Saturday evenings (Bhairava/Ketu).`,
    ],
    paragraphsHi: [
      `लाल किताब टेवा: सोए घर जगाने का विधान: आपके टेवे में मुख्य सोए हुए घर: ${sleepingHouses.map((h) => `भाव ${h.houseNumber} (पक्का स्वामी: ${h.pakkaGharRulerHi || h.pakkaGharRuler})`).join(', ') || 'भाव 2 (धन) व भाव 9 (भाग्य)'} हैं। सोए हुए भाव को जगाने हेतु उस भाव के कारक आचरण को अपनाएं: परिवार के साथ भोजन व कुल-बड़ों के आदर से भाव 2 जाग्रत होता है; कुल-परंपरा व गुरुओं के सम्मान से भाव 9 जाग्रत होता है; तथा श्रमिकों को समय पर पूरा पारिश्रमिक देने से भाव 10 जाग्रत होता है।`,
      `पैतृक ऋण निदान (ऋण मुक्ति): ${activeDebts.length > 0 ? activeDebts.map((d) => `'${d.debtTypeHi}' (${d.classicalCauseHi}) सक्रिय है, जिसके निवारण हेतु कुल-परंपरा का पालन करें`).join('; ') : 'कुंडली में कोई भारी पितृ या मातृ ऋण नहीं है; अपने वचनों का पालन करना और आलस्य त्यागना ही पर्याप्त है'}।`,
      `दैनिक आचरण के 5 स्वर्णिम नियम: (1) जल का कभी अपव्यय न करें और टपकते नल तुरंत ठीक कराएं (चंद्र देव); (2) किसी भी शुभ कार्य से पूर्व माता-पिता के चरण स्पर्श कर आशीर्वाद लें (सूर्य व गुरु); (3) बुधवार को गाय को भीगी हुई मूंग दाल या हरा चारा दें (बुध); (4) घर के सफाईकर्मियों व श्रमिकों का कभी अपमान न करें (शनि); तथा (5) शनिवार संध्या काल भैरव के निमित्त श्वान (कुत्ते) को मीठी रोटी अवश्य दें (केतु व भैरव)।`,
    ],
    astrologicalCauseEn: 'Computed according to Lal Kitab fixed Aries Ascendant principles and classical ancestral debt indicators.',
    astrologicalCauseHi: 'शास्त्रीय कारण: लाल किताब के स्थायी मेष लग्न चक्र एवं पैतृक ऋण सूत्रों के आधार पर प्रमाणित।',
    keyPointsEn: [
      'Awaken Sleeping Houses via lifestyle alignment',
      'Discharge ancestral debts through familial virtue',
      'Strict adherence to the 5 Golden Rules of Conduct',
    ],
    keyPointsHi: [
      'आचरण द्वारा सोए हुए भावों को जाग्रत करना',
      'कुल संस्कारों द्वारा पैतृक ऋणों से मुक्ति',
      'दैनिक जीवन के 5 स्वर्णिम आचरण नियमों का पालन',
    ],
  };

  return {
    planetaryRemediesSection,
    houseCleansingSection,
    nakshatraSnanaSection,
    gocharSadeSatiSection,
    activeDashaSection,
    lalKitabConductSection,
    summaryHighlights: {
      activeMahadashaLord: mahaLord,
      activeAntardashaLord: antarLord,
      sadeSatiStatusHi,
      sadeSatiStatusEn,
      janmaNakshatraDeityHi: nakshatraData.deityHi,
      janmaNakshatraDeityEn: nakshatraData.deityEn,
      primaryVedicMantra: mahaRem.beejMantra,
    },
  };
}
