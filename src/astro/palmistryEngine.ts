/**
 * Interactive Samudrika Shastra Palmistry Engine
 * AV Astro Vibe — 100% Offline, Zero External API Dependency
 *
 * Implements interactive Q&A-driven palmistry ("puchh puchh kar falkathan"):
 * Evaluates hand shape, life line, heart line, head line, fate line, sun line,
 * mounts of Venus/Jupiter, and marriage lines into comprehensive, unvarnished life predictions.
 */

export interface PalmistryAnswers {
  activeHand: 'right' | 'left';
  handType: 'earth' | 'air' | 'fire' | 'water';
  lifeLine: 'deep_long' | 'short_faint' | 'forked_moon' | 'chained_islands';
  heartLine: 'under_jupiter' | 'under_saturn' | 'between_jupiter_saturn' | 'trident' | 'drooping_head';
  headLine: 'straight_mars' | 'sloping_moon' | 'writers_fork' | 'short';
  fateLine: 'from_wrist_to_saturn' | 'from_moon' | 'from_lifeline' | 'starts_after_35' | 'broken_faint';
  sunLine: 'prominent_deep' | 'upper_palm_only' | 'subtle_absent';
  mountVenusJupiter: 'both_prominent' | 'venus_dominant' | 'jupiter_dominant' | 'flat_moderate';
  marriageLine: 'single_deep' | 'multiple_lines' | 'forked_end' | 'curved_down';
}

export interface PalmistryReport {
  handClassificationEn: string;
  handClassificationHi: string;
  temperamentAndPersonalityEn: string;
  temperamentAndPersonalityHi: string;
  careerAndDestinyEn: string;
  careerAndDestinyHi: string;
  primeDestinyRiseAge: number;
  loveAndMaritalDestinyEn: string;
  loveAndMaritalDestinyHi: string;
  healthAndVitalityIndexEn: string;
  healthAndVitalityIndexHi: string;
  majorTurningPoints: Array<{ age: number; predictionHi: string; predictionEn: string }>;
  classicalRemediesEn: string;
  classicalRemediesHi: string;
  samudrikaYogasIdentifiedHi: string[];
  samudrikaYogasIdentifiedEn: string[];
}

export const DEFAULT_PALMISTRY_ANSWERS: PalmistryAnswers = {
  activeHand: 'right',
  handType: 'earth',
  lifeLine: 'deep_long',
  heartLine: 'between_jupiter_saturn',
  headLine: 'sloping_moon',
  fateLine: 'from_wrist_to_saturn',
  sunLine: 'prominent_deep',
  mountVenusJupiter: 'both_prominent',
  marriageLine: 'single_deep',
};

export function computePalmistryReading(answers: PalmistryAnswers): PalmistryReport {
  // 1. Hand Shape & Temperament
  let handClassificationHi = 'पृथ्वी हस्त (Earth Hand: चौकोर हथेली, छोटी दृढ़ अंगुलियां)';
  let handClassificationEn = 'Earth Hand: Square Palm with Sturdy Practical Fingers';
  let temperamentHi = 'आप अत्यंत व्यावहारिक, जमीन से जुड़े, विश्वसनीय और श्रमसाध्य कार्यों में कुशल व्यक्तित्व के धनी हैं। कोरी कल्पनाओं की अपेक्षा ठोस परिणाम आपको अधिक प्रिय हैं।';
  let temperamentEn = 'Grounded, dependable, realistic, and highly practical. You prefer tangible results over abstract theories and possess natural stamina.';

  if (answers.handType === 'air') {
    handClassificationHi = 'वायु हस्त (Air Hand: चौकोर हथेली, लंबी बौद्धिक अंगुलियां)';
    handClassificationEn = 'Air Hand: Square Palm with Long Intellectual Fingers';
    temperamentHi = 'आप तीव्र तार्किक बुद्धि, उत्कृष्ट संवादी क्षमता, विश्लेषण और निरंतर नए विचारों को जन्म देने वाले प्रखर बुद्धिजीवी हैं।';
    temperamentEn = 'Highly communicative, analytical, curious, and mentally agile. You excel in intellectual pursuits, ideas, and human networks.';
  } else if (answers.handType === 'fire') {
    handClassificationHi = 'अग्नि हस्त (Fire Hand: आयताकार हथेली, छोटी ऊर्जावान अंगुलियां)';
    handClassificationEn = 'Fire Hand: Long Rectangular Palm with Short Dynamic Fingers';
    temperamentHi = 'आप अदम्य ऊर्जा, साहसिक महत्वाकांक्षा, नेतृत्व और त्वरित निर्णय लेने वाले कर्मठ व्यक्ति हैं। एकरसता से ऊबना और निरंतर नए लक्ष्य साधना आपका स्वभाव है।';
    temperamentEn = 'Passionate, energetic, ambitious, and decisive. You thrive on excitement, bold initiatives, and dynamic leadership challenges.';
  } else if (answers.handType === 'water') {
    handClassificationHi = 'जल हस्त (Water Hand: आयताकार हथेली, लंबी सुकोमल अंगुलियां)';
    handClassificationEn = 'Water Hand: Long Palm with Slender Intuitive Fingers';
    temperamentHi = 'आप गहरी अंतर्दृष्टि, असीम संवेदनशीलता, कलात्मक सौंदर्यबोध और दूसरों के मनोभावों को बिना कहे समझ लेने वाले संवेदनशील आत्मा हैं।';
    temperamentEn = 'Deeply empathetic, artistic, imaginative, and psychic. You feel things intensely and perceive subtle psychological currents.';
  }

  // 2. Career & Destiny (Fate Line + Sun Line + Head Line)
  let careerHi = '';
  let careerEn = '';
  let primeAge = 28;
  const yogasHi: string[] = [];
  const yogasEn: string[] = [];

  if (answers.fateLine === 'from_wrist_to_saturn') {
    primeAge = 24;
    careerHi = 'मणिबंध से प्रारंभ होकर शनि पर्वत तक जाने वाली अखंड भाग्य रेखा दर्शाती है कि आपको कम आयु से ही स्पष्ट लक्ष्य और भाग्य का प्रबल संबल प्राप्त है। स्वतंत्र व्यवसाय अथवा उच्च प्रशासनिक पद पर आपका प्रभुत्व रहेगा।';
    careerEn = 'Clear fate line running from wrist directly to Saturn mount indicates an early sense of direction, structural stability, and royal career advancement.';
    yogasHi.push('अखंड लक्ष्मी भाग्य योग (Enduring Wealth Line)');
    yogasEn.push('Unbroken Saturn Line');
  } else if (answers.fateLine === 'from_moon') {
    primeAge = 29;
    careerHi = 'चंद्र पर्वत से उदय होने वाली भाग्य रेखा संकेत देती है कि आपका भाग्योदय जनसामान्य के सहयोग, कला, मीडिया, विदेशी संपर्कों अथवा विवाह के उपरांत तीव्र गति से होगा। जनता का स्वाभाविक स्नेह आपको मिलता है।';
    careerEn = 'Fate line originating from the Mount of Moon indicates that destiny flourishes through public favor, international travel, partnerships, or creative patronage.';
    yogasHi.push('चंद्र-प्रभा जनप्रिय योग (Public Acclaim Line)');
    yogasEn.push('Lunar Destiny Line');
  } else if (answers.fateLine === 'from_lifeline') {
    primeAge = 32;
    careerHi = 'जीवन रेखा से प्रस्फुटित होने वाली भाग्य रेखा बताती है कि आपकी सफलता पैतृक संपत्ति से नहीं, बल्कि आपकी स्वयं की अनथक मेहनत, पसीने और आत्मबल से अर्जित "सेल्फ-मेड" साम्राज्य होगी।';
    careerEn = 'Fate line rising from the Life Line marks a self-made individual who carves out wealth and prestige entirely through personal toil and determination.';
    yogasHi.push('स्वावलंबन कीर्ति योग (Self-Made Wealth Line)');
    yogasEn.push('Self-Created Destiny Line');
  } else if (answers.fateLine === 'starts_after_35') {
    primeAge = 36;
    careerHi = '३५ वर्ष की आयु तक जीवन में कड़ा संघर्ष, अनुभव और परीक्षण रहेगा। ३६वें वर्ष में मस्तिष्क रेखा को पार करते ही भाग्य का स्वर्णिम द्वार खुलेगा और अकूत धन-संपत्ति का संचय होगा।';
    careerEn = 'The golden phase of prosperity unfolds definitively past age 35, converting hard-earned life wisdom into exponential financial abundance.';
    yogasHi.push('उत्तरार्ध कनक योग (Late Flowering Abundance)');
    yogasEn.push('Mature Destiny Surge');
  } else {
    primeAge = 30;
    careerHi = 'भाग्य रेखा में रुकावटें संकेत देती हैं कि आपका कॅरियर एक सीधे ढर्रे पर नहीं चलेगा। आप जीवन में कई बार कार्यक्षेत्र बदलेंगे और एकाधिक स्रोतों से धन अर्जित करेंगे।';
    careerEn = 'A versatile destiny that reinvents itself across distinct phases, prospering through adaptive independent enterprise rather than routine jobs.';
  }

  // Sun Line addition
  if (answers.sunLine === 'prominent_deep') {
    careerHi += ' अनामिका के नीचे गहरी सूर्य रेखा आपको राज्य सम्मान, उच्च सामाजिक प्रतिष्ठा और अपने क्षेत्र में निर्विवाद नाम प्रदान करेगी।';
    careerEn += ' Prominent Sun line confirms royal honors, executive prestige, and enduring public recognition in your profession.';
    yogasHi.push('सूर्य कीर्ति योग (Apollo Fame Mark)');
    yogasEn.push('Prominent Sun Line of Fame');
  }

  // 3. Love & Marital Destiny (Heart Line + Marriage Line)
  let loveHi = '';
  let loveEn = '';

  if (answers.heartLine === 'under_jupiter') {
    loveHi = 'हृदय रेखा का गुरु पर्वत तक पहुंचना दर्शाता है कि आप प्रेम में अत्यंत निष्ठावान, आदर्शवादी और जीवनसाथी को हृदय से पूजने वाले व्यक्ति हैं। आपका दांपत्य पारस्परिक सम्मान पर आधारित होगा।';
    loveEn = 'Heart line terminating under Jupiter mount reflects idealistic fidelity, high romantic nobility, and unwavering loyalty in relationships.';
    yogasHi.push('बृहस्पति पवित्र प्रेम योग (Nobility in Love)');
    yogasEn.push('Jovian Heart Arc');
  } else if (answers.heartLine === 'under_saturn') {
    loveHi = 'शनि पर्वत पर समाप्त होने वाली हृदय रेखा दर्शाती है कि आप प्रेम में अति-भावुकता के स्थान पर व्यावहारिक सुरक्षा, भौतिक सुख और आत्मनिर्भरता को प्राथमिकता देते हैं।';
    loveEn = 'Heart line ending under Saturn denotes a practical, self-contained, and pragmatic approach to romance prioritizing financial stability.';
  } else if (answers.heartLine === 'trident') {
    loveHi = 'हृदय रेखा के अंत में त्रिशूल का शुभ चिन्ह अत्यंत दुर्लभ है! यह भावुकता, ज्ञान और भौतिक समृद्धि का संपूर्ण संतुलन देता है। आपका जीवनसाथी अत्यंत गुणवान, सुसंस्कृत और भाग्यवान होगा।';
    loveEn = 'A trident formation at the terminal of the heart line is exceptionally auspicious, balancing emotion, discernment, and profound domestic prosperity.';
    yogasHi.push('शिव-शक्ति त्रिशूल हृदय योग (Sacred Trident of Harmony)');
    yogasEn.push('Trident Heart Mark');
  } else {
    loveHi = 'हृदय रेखा का गुरु और शनि के मध्य समाप्त होना एक आदर्श संतुलित दांपत्य देता है, जिसमें प्रेम की मिठास और सांसारिक जिम्मेदारी दोनों का सुंदर समन्वय होता है।';
    loveEn = 'Heart line terminating between Jupiter and Saturn creates an ideal equilibrium between deep emotional devotion and mature life realism.';
  }

  if (answers.marriageLine === 'single_deep') {
    loveHi += ' कनिष्ठा के नीचे एक ही स्पष्ट गहरी रेखा आजीवन एकनिष्ठ, स्थायी और सुखद दांपत्य जीवन का स्पष्ट प्रमाण है।';
    loveEn += ' A single, deep marriage line signifies lifelong emotional companionship and steadfast domestic harmony.';
  } else if (answers.marriageLine === 'forked_end') {
    loveHi += ' विवाह रेखा के अंत में द्विशाखा विचारों के मतभेद अथवा व्यावसायिक यात्राओं के कारण समय-समय पर दूरी की ओर संकेत करती है; संवाद बनाए रखना आवश्यक है।';
    loveEn += ' A forked marriage line cautions against petty ego disputes or forced physical separations due to professional travel.';
  }

  // 4. Health & Vitality (Life Line + Mounts)
  let healthHi = '';
  let healthEn = '';

  if (answers.lifeLine === 'deep_long') {
    healthHi = 'शुक्र पर्वत को घेरती हुई स्पष्ट, अटूट और गहरी जीवन रेखा असीम जीवन ऊर्जा, उत्कृष्ट रोग प्रतिरोधक क्षमता और दीर्घायु (८० से ९०+ वर्ष) का वरदान देती है।';
    healthEn = 'A deep, continuous life line curving generously around the Mount of Venus bestows exceptional vitality, robust immunity, and a full long lifespan.';
    yogasHi.push('दीर्घायु अमृत रेखा (Long Life Vitality Mark)');
    yogasEn.push('Unbroken Vitality Arc');
  } else if (answers.lifeLine === 'forked_moon') {
    healthHi = 'जीवन रेखा का अंत में चंद्र पर्वत की ओर मुड़ना सुदूर देशों की यात्रा, विदेश में निवास और जीवन के उत्तरार्ध में स्थान परिवर्तन से उत्तम स्वास्थ्य व संपन्नता का योग बनाता है।';
    healthEn = 'Life line branching towards Mount of Moon indicates extensive foreign travel, overseas resettlement, and rejuvenated health in later decades.';
    yogasHi.push('वैदेशिक भाग्योदय योग (Foreign Settlement Branch)');
    yogasEn.push('Voyager Line of Moon');
  } else {
    healthHi = 'जीवन रेखा में सूक्ष्म रुकावटें संकेत देती हैं कि आपको मानसिक तनाव, अनिद्रा और खान-पान की अनियमितता से बचना होगा। नियमित योग और ध्यान आपके लिए अनिवार्य औषधि हैं।';
    healthEn = 'Sensitive vitality reserves suggest that stress management, disciplined sleep, and wholesome nutrition are vital for maintaining peak stamina.';
  }

  // 5. Major Turning Points
  const majorTurningPoints = [
    {
      age: 21,
      predictionHi: 'शिक्षा पूर्ण होने अथवा प्रथम महत्वपूर्ण व्यक्तिगत व व्यावसायिक दिशा का निर्धारण।',
      predictionEn: 'Completion of foundation education and establishing decisive career direction.',
    },
    {
      age: primeAge,
      predictionHi: `आयु ${primeAge} वर्ष: आपके जीवन का सबसे बड़ा भाग्योदय पड़ाव — पदोन्नति, नया उद्यम अथवा विवाह का शुभ संयोग।`,
      predictionEn: `Age ${primeAge}: Prime career breakthrough, financial leap, or sacred marital milestone.`,
    },
    {
      age: 38,
      predictionHi: 'स्थाई अचल संपत्ति (मकान, भूमि अथवा वाहन) का विशाल लाभ और सामाजिक प्रतिष्ठा में भारी वृद्धि।',
      predictionEn: 'Acquisition of permanent real estate, property expansion, and elevated social eminence.',
    },
    {
      age: 50,
      predictionHi: 'जीवन के उत्तरार्ध का स्वर्णिम काल — आध्यात्मिक गहराई, बच्चों की सफलता और संस्थागत नेतृत्व।',
      predictionEn: 'Golden mature era marked by spiritual depth, progeny success, and institutional leadership.',
    },
  ];

  // 6. Classical Samudrika Remedies
  let remediesHi = 'सामुद्रिक शास्त्र अनुसार: प्रतिदिन प्रातः सूर्योदय के दर्शन करें, कनिष्ठिका में चांदी या तांबे का छल्ला धारण करें, तथा पक्षियों को नियमित जल-अन्न दें।';
  let remediesEn = 'Classical Samudrika prescription: Gaze at the morning dawn for optic vitality, wear a solid silver or copper band, and provide clean water and grain for birds daily.';

  if (answers.mountVenusJupiter === 'venus_dominant') {
    remediesHi += ' शुक्र पर्वत की अनुकूलता हेतु शुक्रवार को सुगंधित इत्र का प्रयोग करें और माता लक्ष्मी का ध्यान करें।';
    remediesEn += ' To harmonize elevated Venus, use natural floral fragrances on Fridays and honor feminine divinity.';
  } else if (answers.mountVenusJupiter === 'jupiter_dominant') {
    remediesHi += ' गुरु पर्वत के बल हेतु माथे पर केसर का तिलक लगाएं और गुरुवार को पीले फल या चने की दाल दान करें।';
    remediesEn += ' To harness dominant Jupiter, apply a saffron tilak and share yellow fruits or lentils on Thursdays.';
  }

  return {
    handClassificationEn,
    handClassificationHi,
    temperamentAndPersonalityEn: temperamentEn,
    temperamentAndPersonalityHi: temperamentHi,
    careerAndDestinyEn: careerEn,
    careerAndDestinyHi: careerHi,
    primeDestinyRiseAge: primeAge,
    loveAndMaritalDestinyEn: loveEn,
    loveAndMaritalDestinyHi: loveHi,
    healthAndVitalityIndexEn: healthEn,
    healthAndVitalityIndexHi: healthHi,
    majorTurningPoints,
    classicalRemediesEn: remediesEn,
    classicalRemediesHi: remediesHi,
    samudrikaYogasIdentifiedHi: yogasHi,
    samudrikaYogasIdentifiedEn: yogasEn,
  };
}
