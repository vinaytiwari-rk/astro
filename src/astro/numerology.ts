export interface LoShuPlaneResult {
  id: string;
  digits: [number, number, number];
  nameEn: string;
  nameHi: string;
  complete: boolean;
  presentDigits: number[];
  strengthPercent: number;
  meaningEn: string;
  meaningHi: string;
}

export interface NumerologyMissingRemedy {
  digit: number;
  planetEn: string;
  planetHi: string;
  impactEn: string;
  impactHi: string;
  remedyEn: string;
  remedyHi: string;
}

export interface NumerologyReport {
  name: string;
  dob: string;
  mulank: number; // 1..9
  bhagyank: number; // 1..9
  kuaNumber: number; // 1..9
  personalYear: number; // 1..9
  chaldeanTotal: number;
  chaldeanReduced: number;
  pythagoreanReduced: number;
  nameCompatibilityEn: string;
  nameCompatibilityHi: string;
  compatibleNumbers: number[];
  luckyColorsEn: string;
  luckyColorsHi: string;
  luckyDaysEn: string;
  luckyDaysHi: string;
  kuaDirectionsEn: string;
  kuaDirectionsHi: string;
  mulankRulerEn: string;
  mulankRulerHi: string;
  mulankProfileEn: string;
  mulankProfileHi: string;
  bhagyankProfileEn: string;
  bhagyankProfileHi: string;
  // Lo Shu counts for digits 1..9 (index 1..9)
  loShuCounts: Record<number, number>;
  loShuPlanes: LoShuPlaneResult[];
  missingNumbers: NumerologyMissingRemedy[];
}

const CHALDEAN_MAP: Record<string, number> = {
  A: 1, I: 1, J: 1, Q: 1, Y: 1,
  B: 2, K: 2, R: 2,
  C: 3, G: 3, L: 3, S: 3,
  D: 4, M: 4, T: 4,
  E: 5, H: 5, N: 5, X: 5,
  U: 6, V: 6, W: 6,
  O: 7, Z: 7,
  F: 8, P: 8,
};

const PYTHAGOREAN_MAP: Record<string, number> = {
  A: 1, J: 1, S: 1,
  B: 2, K: 2, T: 2,
  C: 3, L: 3, U: 3,
  D: 4, M: 4, V: 4,
  E: 5, N: 5, W: 5,
  F: 6, O: 6, X: 6,
  G: 7, P: 7, Y: 7,
  H: 8, Q: 8, Z: 8,
  I: 9, R: 9,
};

export function reduceToSingleDigit(n: number): number {
  let x = Math.abs(Math.floor(n));
  if (x === 0) return 0;
  while (x > 9) {
    let s = 0;
    while (x > 0) {
      s += x % 10;
      x = Math.floor(x / 10);
    }
    x = s;
  }
  return x;
}

const NUMBER_RULERS: Record<number, { en: string; hi: string; colorsEn: string; colorsHi: string; daysEn: string; daysHi: string }> = {
  1: { en: 'Sun (Surya)', hi: 'सूर्य', colorsEn: 'Gold, Orange, Yellow', colorsHi: 'सुनहरा, नारंगी, पीला', daysEn: 'Sunday, Monday', daysHi: 'रविवार, सोमवार' },
  2: { en: 'Moon (Chandra)', hi: 'चंद्र', colorsEn: 'White, Cream, Pale Green', colorsHi: 'सफेद, क्रीम, हल्का हरा', daysEn: 'Monday, Friday', daysHi: 'सोमवार, शुक्रवार' },
  3: { en: 'Jupiter (Guru)', hi: 'बृहस्पति (गुरु)', colorsEn: 'Yellow, Saffron, Lavender', colorsHi: 'पीला, केसरिया, हल्का बैंगनी', daysEn: 'Thursday, Tuesday', daysHi: 'गुरुवार, मंगलवार' },
  4: { en: 'Rahu (Uranus)', hi: 'राहु', colorsEn: 'Electric Blue, Khaki, Grey', colorsHi: 'नीला, खाकी, स्लेटी', daysEn: 'Saturday, Wednesday', daysHi: 'शनिवार, बुधवार' },
  5: { en: 'Mercury (Budha)', hi: 'बुध', colorsEn: 'Green, Turquoise, Light White', colorsHi: 'हरा, फिरोज़ी, सफेद', daysEn: 'Wednesday, Friday', daysHi: 'बुधवार, शुक्रवार' },
  6: { en: 'Venus (Shukra)', hi: 'शुक्र', colorsEn: 'White, Pink, Pastel Blue', colorsHi: 'श्वेत, गुलाबी, आसमानी नीला', daysEn: 'Friday, Wednesday', daysHi: 'शुक्रवार, बुधवार' },
  7: { en: 'Ketu (Neptune)', hi: 'केतु', colorsEn: 'Light Yellow, Pastel Green, Off-White', colorsHi: 'हल्का पीला, हल्का हरा, सफेद', daysEn: 'Monday, Thursday', daysHi: 'सोमवार, गुरुवार' },
  8: { en: 'Saturn (Shani)', hi: 'शनि', colorsEn: 'Dark Blue, Navy, Black, Olive', colorsHi: 'गहरा नीला, बैंगनी, काला', daysEn: 'Saturday, Wednesday', daysHi: 'शनिवार, बुधवार' },
  9: { en: 'Mars (Mangal)', hi: 'मंगल', colorsEn: 'Red, Coral, Rust, Crimson', colorsHi: 'लाल, सिंदूरी, केसरिया', daysEn: 'Tuesday, Thursday', daysHi: 'मंगलवार, गुरुवार' },
};

const FRIENDLY_SETS: Record<number, number[]> = {
  1: [1, 2, 3, 5, 9],
  2: [1, 2, 3, 5],
  3: [1, 2, 3, 5, 7, 9],
  4: [1, 5, 6, 7],
  5: [1, 2, 3, 5, 6],
  6: [1, 4, 5, 6, 7],
  7: [1, 3, 4, 5, 6],
  8: [3, 5, 6, 7],
  9: [1, 2, 3, 5, 6, 9],
};

const MULANK_DESC: Record<number, { en: string; hi: string }> = {
  1: { en: 'Independent, ambitious, leadership-oriented, and original in thought and enterprise.', hi: 'स्वतंत्र, महत्वाकांक्षी, नेतृत्वकर्ता एवं मौलिक सोच से सफलता पाने वाले।' },
  2: { en: 'Intuitive, diplomatic, artistic, caring, and collaborative in relationships.', hi: 'संवेदनशील, कूटनीतिक, कला-प्रेमी, सहयोगी एवं मधुर संबंध निभाने वाले।' },
  3: { en: 'Optimistic, expressive, scholarly, creative, and respected advisor or teacher.', hi: 'आशावादी, ज्ञानी, वाक्पटु, रचनात्मक एवं श्रेष्ठ मार्गदर्शक।' },
  4: { en: 'Practical, unconventional, methodical, hardworking, and persistent through challenges.', hi: 'व्यावहारिक, लीक से हटकर सोचने वाले, अनुशासित एवं कठिन कार्यों के निर्माता।' },
  5: { en: 'Quick-witted, adaptable, business-minded, communicative, and youthful in spirit.', hi: 'तीव्र बुद्धि, बहुमुखी, व्यापार-कुशल, संवादी एवं परिवर्तनशील।' },
  6: { en: 'Charming, family-focused, aesthetic, luxury-loving, and harmonious peacemaker.', hi: 'आकर्षक, परिवार-प्रिय, सौंदर्य प्रेमी, वैभवशाली एवं सौहार्दपूर्ण।' },
  7: { en: 'Analytical, spiritual, research-oriented, introspective, and deep thinker.', hi: 'विश्लेषणात्मक, आध्यात्मिक, शोध-प्रवृत्त एवं गहन चिंतक।' },
  8: { en: 'Authoritative, karmic, resilient, strategic, and built for enduring organizational wealth.', hi: 'धैर्यशील, कर्मठ, न्यायप्रिय, रणनीतिक एवं दीर्घकालिक सत्ता व धन के निर्माता।' },
  9: { en: 'Courageous, humanitarian, passionate, energetic, and protective of truth.', hi: 'साहसी, ऊर्जावान, परोपकारी, स्पष्टवादी एवं न्याय हेतु लड़ने वाले।' },
};

const MISSING_REMEDIES: Record<number, Omit<NumerologyMissingRemedy, 'digit'>> = {
  1: {
    planetEn: 'Sun', planetHi: 'सूर्य',
    impactEn: 'May feel hesitation in expressing authority or self-promotion.',
    impactHi: 'अधिकार व आत्म-अभिव्यक्ति में संकोच महसूस हो सकता है।',
    remedyEn: 'Keep a small Sun/copper emblem or write notes in bright spaces; offer water to morning Sun.',
    remedyHi: 'प्रातः सूर्य को अर्घ्य दें एवं तांबे की अंगूठी या पूर्व दिशा को स्वच्छ व प्रकाशमान रखें।',
  },
  2: {
    planetEn: 'Moon', planetHi: 'चंद्र',
    impactEn: 'Sensitivity may be masked behind logic; intuition needs conscious trust.',
    impactHi: 'भावनात्मक अभिव्यक्ति कम हो सकती है; अंतर्ज्ञान पर भरोसा बढ़ाएँ।',
    remedyEn: 'Carry silver or wear white/pearl accents on Mondays; keep a silver glass of water.',
    remedyHi: 'चाँदी का कड़ा या चेन पहनें और सोमवार को चंद्र/शिव ध्यान व जल दान करें।',
  },
  3: {
    planetEn: 'Jupiter', planetHi: 'गुरु',
    impactEn: 'May sometimes doubt creative self-expression until disciplined.',
    impactHi: 'रचनात्मक या शैक्षणिक आत्मविश्वास में अतिरिक्त प्रयास की आवश्यकता हो सकती है।',
    remedyEn: 'Wear yellow/saffron on Thursdays, keep wooden pen or Rudraksha.',
    remedyHi: 'गुरुवार को केसर या हल्दी तिलक लगाएँ एवं पीपल/केले की सेवा व लकड़ी का पेन रखें।',
  },
  4: {
    planetEn: 'Rahu', planetHi: 'राहु',
    impactEn: 'Structured routine and patience with administrative details need cultivation.',
    impactHi: 'दिनचर्या और व्यावहारिक योजना को व्यवस्थित रखने के लिए अतिरिक्त ध्यान आवश्यक है।',
    remedyEn: 'Keep a wooden keychain or tulsi mala; keep Southwest corner orderly.',
    remedyHi: 'तुलसी/चंदन माला धारण करें और घर का नैऋत्य कोण (दक्षिण-पश्चिम) सुव्यवस्थित रखें।',
  },
  5: {
    planetEn: 'Mercury', planetHi: 'बुध',
    impactEn: 'Grounding center number: missing 5 asks for steady focus & balanced communication.',
    impactHi: 'मध्य केंद्र का अंक अनुपस्थित होने से मानसिक स्थिरता व संवाद पर विशेष ध्यान देना चाहिए।',
    remedyEn: 'Wear green on Wednesdays, keep green aventurine or crystal quartz; feed cows green fodder.',
    remedyHi: 'बुधवार को हरा वस्त्र/रूमाल रखें, हरा पन्ना या स्फटिक ब्रेसलेट पहनें व गाय को हरी घास दें।',
  },
  6: {
    planetEn: 'Venus', planetHi: 'शुक्र',
    impactEn: 'May prioritize work duties over comfort, aesthetics, or warm family time.',
    impactHi: 'कर्तव्य के बीच पारिवारिक सुख व स्वयं की सुख-सुविधा की अनदेखी हो सकती है।',
    remedyEn: 'Wear a metallic golden/silver wristwatch; keep home fragrant and harmonious.',
    remedyHi: 'सोने/चाँदी या मेटल की घड़ी पहनें, शुक्रवार को सुगंध (इत्र) व स्वच्छ वस्त्र का प्रयोग करें।',
  },
  7: {
    planetEn: 'Ketu', planetHi: 'केतु',
    impactEn: 'Learns through worldly experience rather than pure skepticism or detachment.',
    impactHi: 'अध्यात्म और अनुसंधान से जुड़ाव सचेत प्रयास व ध्यान द्वारा बढ़ता है।',
    remedyEn: 'Wear silver/metal watch or practice quiet meditation; feed stray dogs.',
    remedyHi: 'चाँदी की चेन पहनें, प्रतिदिन 10 मिनट ध्यान करें व श्वान (कुत्ते) को रोटी खिलाएँ।',
  },
  8: {
    planetEn: 'Saturn', planetHi: 'शनि',
    impactEn: 'Financial caution and finishing long-term administrative duties require steady focus.',
    impactHi: 'वित्तीय प्रबंधन और लंबे समय तक धैर्यपूर्वक कार्य पूर्ण करने पर ध्यान आवश्यक है।',
    remedyEn: 'Keep crystal/quartz or black-white discipline; donate food or mustard oil on Saturdays.',
    remedyHi: 'शनिवार को काले तिल/अन्न दान करें, क्रिस्टल रखें व कार्यों को अंत तक पूरा करने की आदत डालें।',
  },
  9: {
    planetEn: 'Mars', planetHi: 'मंगल',
    impactEn: 'Physical stamina and humanitarian drive benefit from regular exercise.',
    impactHi: 'शारीरिक स्फूर्ति व लक्ष्य के प्रति जोश के लिए नियमित व्यायाम अत्यंत आवश्यक है।',
    remedyEn: 'Keep a red thread (Kalawa) on wrist or red handkerchief; regular physical exercise.',
    remedyHi: 'कलाई पर लाल मौली (कलावा) बाँधें, मंगलवार को हनुमान चालीसा पाठ व नियमित व्यायाम करें।',
  },
};

export function computeNameNumber(name: string, system: 'chaldean' | 'pythagorean'): { total: number; reduced: number } {
  const clean = name.toUpperCase().replace(/[^A-Z]/g, '');
  const map = system === 'chaldean' ? CHALDEAN_MAP : PYTHAGOREAN_MAP;
  let total = 0;
  for (const ch of clean) {
    total += map[ch] ?? 0;
  }
  return { total, reduced: reduceToSingleDigit(total) };
}

export function computeNumerologyReport(
  name: string,
  dob: string,
  gender: 'male' | 'female' | 'other' = 'other',
  targetYear: number = new Date().getFullYear()
): NumerologyReport {
  const parts = dob.split('-').map((x) => parseInt(x, 10));
  const yr = parts[0] || 2000;
  const mo = parts[1] || 1;
  const dy = parts[2] || 1;

  const mulank = reduceToSingleDigit(dy) || 1;
  const allDigitsSum = dob.replace(/\D/g, '').split('').reduce((acc, ch) => acc + parseInt(ch, 10), 0);
  const bhagyank = reduceToSingleDigit(allDigitsSum) || 1;

  // Kua number formula
  const yrSum = reduceToSingleDigit(yr);
  let kua = 1;
  if (gender === 'female') {
    kua = reduceToSingleDigit((yr >= 2000 ? 4 : 5) + yrSum);
    if (kua === 5) kua = 8;
  } else {
    const base = yr >= 2000 ? 9 : 10;
    kua = reduceToSingleDigit(Math.abs(base - yrSum) || 9);
    if (kua === 5) kua = 2;
  }
  if (kua === 0) kua = 9;

  // Personal Year = reduce(day + month + targetYear)
  const pyDigits = `${dy}${mo}${targetYear}`.split('').reduce((a, b) => a + parseInt(b, 10), 0);
  const personalYear = reduceToSingleDigit(pyDigits) || 1;

  // Chaldean & Pythagorean
  const chal = computeNameNumber(name, 'chaldean');
  const pyth = computeNameNumber(name, 'pythagorean');

  const friendlyList = FRIENDLY_SETS[mulank] ?? [1, 5];
  const bhagyankFriends = FRIENDLY_SETS[bhagyank] ?? [1, 5];
  const compatibleNumbers = friendlyList.filter((n) => bhagyankFriends.includes(n));

  const isChaldeanMatch =
    chal.reduced === 0
      ? false
      : compatibleNumbers.includes(chal.reduced) || friendlyList.includes(chal.reduced);

  const nameCompatibilityEn =
    chal.reduced === 0
      ? 'Enter alphabetic name letters to calculate Chaldean & Pythagorean alignment.'
      : isChaldeanMatch
        ? `Favorable (${chal.total} → ${chal.reduced}): Harmonizes smoothly with Mulank ${mulank} & Bhagyank ${bhagyank}.`
        : `Moderate (${chal.total} → ${chal.reduced}): Neutral/challenging vibration vs Mulank ${mulank}; favorable options: ${(compatibleNumbers.length ? compatibleNumbers : friendlyList).join(', ')}.`;

  const nameCompatibilityHi =
    chal.reduced === 0
      ? 'नाम अंक गणना के लिए अंग्रेजी अक्षरों में नाम लिखें।'
      : isChaldeanMatch
        ? `शुभ व अनुकूल (${chal.total} → ${chal.reduced}): मूलांक ${mulank} व भाग्यांक ${bhagyank} के साथ उत्तम तालमेल।`
        : `मध्यम (${chal.total} → ${chal.reduced}): मूलांक ${mulank} की तुलना में सामान्य — शुभ नामांक विकल्प: ${(compatibleNumbers.length ? compatibleNumbers : friendlyList).join(', ')}।`;

  // Lo Shu Grid counts from DOB digits + Mulank (if dy > 9 and not 10/20/30) + Bhagyank
  const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
  for (const ch of dob.replace(/\D/g, '')) {
    const d = parseInt(ch, 10);
    if (d >= 1 && d <= 9) counts[d] += 1;
  }
  counts[bhagyank] = (counts[bhagyank] || 0) + 1;
  if (dy >= 10 && dy !== 10 && dy !== 20 && dy !== 30) {
    counts[mulank] = (counts[mulank] || 0) + 1;
  }

  const PLANE_DEFS: Array<{
    id: string;
    digits: [number, number, number];
    nameEn: string;
    nameHi: string;
    meaningEn: string;
    meaningHi: string;
  }> = [
    {
      id: 'mental', digits: [4, 9, 2],
      nameEn: 'Mental / Head Plane (4-9-2)', nameHi: 'मानसिक / बौद्धिक रेखा (4-9-2)',
      meaningEn: 'Sharp intellect, strong memory, creative vision, and analytical reasoning.',
      meaningHi: 'तीव्र स्मरण शक्ति, तार्किक बुद्धि व उच्च विचार क्षमता।',
    },
    {
      id: 'emotional', digits: [3, 5, 7],
      nameEn: 'Emotional / Spiritual Plane (3-5-7)', nameHi: 'भावनात्मक / आध्यात्मिक रेखा (3-5-7)',
      meaningEn: 'Compassionate heart, artistic intuition, loyalty, and inner wisdom.',
      meaningHi: 'हृदय की करुणा, आध्यात्मिक अंतर्ज्ञान, भक्ति व मधुर भावनाएँ।',
    },
    {
      id: 'practical', digits: [8, 1, 6],
      nameEn: 'Practical / Earth Plane (8-1-6)', nameHi: 'व्यावहारिक / कर्म रेखा (8-1-6)',
      meaningEn: 'Execution ability, material building, financial grounding, and management.',
      meaningHi: 'ठोस कार्य निष्पादन, प्रबंधन, संपत्ति निर्माण व व्यावहारिक सफलता।',
    },
    {
      id: 'thought', digits: [4, 3, 8],
      nameEn: 'Thought / Planning Arrow (4-3-8)', nameHi: 'विचार एवं योजना रेखा (4-3-8)',
      meaningEn: 'Methodical planning, strategic foresight, and structured logic.',
      meaningHi: 'सुव्यवस्थित योजना, दूरदर्शिता एवं रणनीतिक सोच।',
    },
    {
      id: 'will', digits: [9, 5, 1],
      nameEn: 'Willpower & Determination Arrow (9-5-1)', nameHi: 'इच्छाशक्ति व संकल्प रेखा (9-5-1)',
      meaningEn: 'Unstoppable perseverance, bounce-back resilience, and strong drive to win.',
      meaningHi: 'अदम्य इच्छाशक्ति, संकट से उबरने की ताकत व लक्ष्य प्राप्ति।',
    },
    {
      id: 'action', digits: [2, 7, 6],
      nameEn: 'Action & Expression Arrow (2-7-6)', nameHi: 'कर्म व क्रियान्वयन रेखा (2-7-6)',
      meaningEn: 'Turns ideas swiftly into tangible action with people skills and grace.',
      meaningHi: 'विचारों को शीघ्र कार्य में बदलने की दक्षता व सामाजिक कुशलता।',
    },
    {
      id: 'golden', digits: [4, 5, 6],
      nameEn: 'Golden Rajayoga Diagonal (4-5-6)', nameHi: 'स्वर्ण राजयोग रेखा (4-5-6)',
      meaningEn: 'Classic abundance, fame, authority, and multi-faceted success in life.',
      meaningHi: 'विशिष्ट धन, मान-सम्मान, वैभव व बहुमुखी प्रगति का स्वर्ण राजयोग।',
    },
    {
      id: 'silver', digits: [2, 5, 8],
      nameEn: 'Silver / Property Rajayoga (2-5-8)', nameHi: 'रजत / भूमि-भवन राजयोग (2-5-8)',
      meaningEn: 'Real estate stability, home blessings, patience, and steady assets.',
      meaningHi: 'अचल संपत्ति, भूमि-मकान सुख, स्थिर धन व मानसिक संतुलन का रजत राजयोग।',
    },
  ];

  const loShuPlanes: LoShuPlaneResult[] = PLANE_DEFS.map((p) => {
    const present = p.digits.filter((d) => counts[d] > 0);
    return {
      ...p,
      presentDigits: present,
      complete: present.length === 3,
      strengthPercent: Math.round((present.length / 3) * 100),
    };
  });

  const missingNumbers: NumerologyMissingRemedy[] = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    .filter((d) => counts[d] === 0)
    .map((digit) => ({ digit, ...MISSING_REMEDIES[digit] }));

  const eastGroup = new Set([1, 3, 4, 9]).has(kua);
  const kuaDirectionsEn = eastGroup
    ? 'Favorable: East, South-East, North, South | Avoid: West, NW, SW'
    : 'Favorable: West, North-West, North-East, South-West | Avoid: East, South';
  const kuaDirectionsHi = eastGroup
    ? 'शुभ दिशाएँ: पूर्व, आग्नेय (द.पू.), उत्तर, दक्षिण | वर्ज्य: पश्चिम, वायव्य, नैऋत्य'
    : 'शुभ दिशाएँ: पश्चिम, वायव्य (उ.प.), ईशान (उ.पू.), नैऋत्य (द.प.) | वर्ज्य: पूर्व, दक्षिण';

  const rule = NUMBER_RULERS[mulank];
  const mDesc = MULANK_DESC[mulank];
  const bDesc = MULANK_DESC[bhagyank];

  return {
    name,
    dob,
    mulank,
    bhagyank,
    kuaNumber: kua,
    personalYear,
    chaldeanTotal: chal.total,
    chaldeanReduced: chal.reduced,
    pythagoreanReduced: pyth.reduced,
    nameCompatibilityEn,
    nameCompatibilityHi,
    compatibleNumbers,
    luckyColorsEn: rule.colorsEn,
    luckyColorsHi: rule.colorsHi,
    luckyDaysEn: rule.daysEn,
    luckyDaysHi: rule.daysHi,
    kuaDirectionsEn,
    kuaDirectionsHi,
    mulankRulerEn: rule.en,
    mulankRulerHi: rule.hi,
    mulankProfileEn: mDesc.en,
    mulankProfileHi: mDesc.hi,
    bhagyankProfileEn: bDesc.en,
    bhagyankProfileHi: bDesc.hi,
    loShuCounts: counts,
    loShuPlanes,
    missingNumbers,
  };
}
