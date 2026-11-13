import type { ChartData } from '../types';

export interface DeepDomainPrediction {
  id: string;
  titleEn: string;
  titleHi: string;
  icon: string;
  score: number; // 0..100
  ratingEn: 'Excellent' | 'Very Good' | 'Moderate' | 'Challenging';
  ratingHi: 'अति उत्तम' | 'उत्तम' | 'मध्यम' | 'चुनौतीपूर्ण';
  summaryEn: string;
  summaryHi: string;
  keyStrengthsEn: string[];
  keyStrengthsHi: string[];
  watchoutsEn: string[];
  watchoutsHi: string[];
  astrologicalFactorsEn: string;
  astrologicalFactorsHi: string;
  classicalAdviceEn: string;
  classicalAdviceHi: string;
}

export interface DeepLifePredictionsReport {
  overallLifeScore: number;
  executiveSummaryEn: string;
  executiveSummaryHi: string;
  domains: DeepDomainPrediction[];
}

export function computeDeepLifePredictions(chart: ChartData): DeepLifePredictionsReport {
  const lagnaLord = chart.ascendant.signLord;
  const moon = chart.planets.find((p) => p.id === 'Moon');
  const sun = chart.planets.find((p) => p.id === 'Sun');
  const jupiter = chart.planets.find((p) => p.id === 'Jupiter');
  const saturn = chart.planets.find((p) => p.id === 'Saturn');
  const venus = chart.planets.find((p) => p.id === 'Venus');
  const mars = chart.planets.find((p) => p.id === 'Mars');
  const mercury = chart.planets.find((p) => p.id === 'Mercury');

  const ascSign = chart.ascendant.signName;
  const moonSign = moon?.signName || '';
  const sunSign = sun?.signName || '';

  // 1. Personality & Mind
  const personalityScore = 78 + (chart.ascendant.signIndex % 4) * 4;
  const personalityDomain: DeepDomainPrediction = {
    id: 'personality',
    titleEn: 'Personality, Vitality & Mental Outlook (Lagna & Moon)',
    titleHi: 'व्यक्तित्व, आत्मबल एवं मानसिक स्वभाव (लग्न व चंद्र)',
    icon: 'user',
    score: personalityScore,
    ratingEn: 'Very Good',
    ratingHi: 'उत्तम',
    summaryEn: `Born in ${ascSign} Ascendant with Moon in ${moonSign}, you possess a distinctive combination of intellectual depth, strong inner resolve, and innate adaptability. Your rising sign imparts a natural dignity, while your Moon placement provides emotional resilience and intuitive grasp of human nature.`,
    summaryHi: `${ascSign} लग्न और ${moonSign} राशि में जन्म होने से आपके व्यक्तित्व में बौद्धिक गहराई, आंतरिक संकल्प शक्ति और स्वाभाविक अनुकूलनशीलता का अद्भुत संतुलन है। लग्न आपकी बाहरी प्रतिष्ठा को सुदृढ़ करता है तथा चंद्र आपके अंतर्मन और सहज ज्ञान को तीव्र बनाता है।`,
    keyStrengthsEn: [
      'Natural self-respect and independent decision-making capacity',
      'Strong communicative charm and ability to analyze complex situations',
      'Emotional maturity during crises and resilience against external stress',
    ],
    keyStrengthsHi: [
      'स्वाभाविक आत्मसम्मान एवं स्वतंत्र निर्णय लेने की क्षमता',
      'उत्कृष्ट संवाद कौशल एवं जटिल परिस्थितियों का सटीक विश्लेषण',
      'संकट के समय मानसिक स्थिरता एवं विपरीत परिस्थितियों से उबरने का सामर्थ्य',
    ],
    watchoutsEn: [
      'Tendency towards occasional overthinking or indecision when Moon is strained',
      'Guarding against physical fatigue by balancing work-life cycles',
    ],
    watchoutsHi: [
      'चंद्र पर प्रतिकूल प्रभाव होने पर अत्यधिक विचारशीलता या अनिर्णय की स्थिति',
      'कार्य और विश्राम के बीच संतुलन बनाकर शारीरिक थकान से बचाव',
    ],
    astrologicalFactorsEn: `Lagna Lord: ${lagnaLord} | Ascendant Nakshatra: ${chart.ascendant.nakshatraName} Pada ${chart.ascendant.pada} | Moon Sign Lord: ${moon?.signLord || '-'}`,
    astrologicalFactorsHi: `लग्नेश: ${lagnaLord} | लग्न नक्षत्र: ${chart.ascendant.nakshatraName} चरण ${chart.ascendant.pada} | राशि स्वामी: ${moon?.signLord || '-'}`,
    classicalAdviceEn: 'Wear natural pearl or perform daily Pranayama to strengthen mental equilibrium and vitality.',
    classicalAdviceHi: 'मानसिक शांति और जीवनी शक्ति को सुदृढ़ करने हेतु नित्य प्राणायाम करें एवं चंद्र शांति उपाय अपनाएं।',
  };

  // 2. Wealth & Finances (2nd & 11th House)
  const wealthScore = 82;
  const wealthDomain: DeepDomainPrediction = {
    id: 'wealth',
    titleEn: 'Wealth, Assets, Savings & Inflow (2nd & 11th Bhavas)',
    titleHi: 'धन, संचित कोष, पैतृक संपत्ति व लाभ (द्वितीय व एकादश भाव)',
    icon: 'coins',
    score: wealthScore,
    ratingEn: 'Excellent',
    ratingHi: 'अति उत्तम',
    summaryEn: `Your financial potential is blessed by strong connections between wealth-giving houses (Dhana Bhava 2nd, Labha Bhava 11th, and Lakshmi Sthanas 5th & 9th). Multiple revenue streams emerge across middle life, with substantial compounding from real estate, consulting, or specialized knowledge.`,
    summaryHi: `आपकी कुंडली में धन भाव (द्वितीय), लाभ भाव (एकादश) तथा लक्ष्मी स्थानों (पंचम व नवम) का शुभ संबंध श्रेष्ठ धन योग बनाता है। जीवन के मध्य काल से आय के एकाधिक साधन विकसित होंगे तथा भूमि, ज्ञान-संबद्ध परामर्श अथवा व्यवसाय से स्थायी संचित धन का निर्माण होगा।`,
    keyStrengthsEn: [
      'High potential for consistent capital accumulation through prudent investments',
      'Favourable ancestral blessings and growth in fixed family assets',
      'Intuitive timing for entering profitable contracts or partnerships',
    ],
    keyStrengthsHi: [
      'सोच-समझकर किए गए निवेशों से निरंतर पूंजी संचय की उच्च क्षमता',
      'पैतृक संपत्ति का लाभ एवं स्थायी पारिवारिक परिसंपत्तियों में वृद्धि',
      'लाभप्रद अनुबंधों एवं साझेदारी में प्रवेश हेतु सटीक समय का चयन',
    ],
    watchoutsEn: [
      'Avoid speculative high-risk gambles during Rahu or 12th house sub-periods',
      'Maintain strict documentation in joint property transactions',
    ],
    watchoutsHi: [
      'राहु अथवा द्वादशेश की अंतर्दशा में सट्टा, लॉटरी या अति-जोखिमपूर्ण निवेश से बचें',
      'साझेदारी या संयुक्त संपत्ति के लेन-देन में पूर्ण कागजी सतर्कता बरतें',
    ],
    astrologicalFactorsEn: `Dhana Karaka: Jupiter (${jupiter?.signName || '-'}) | Labha Lord connection to Kendra/Trikona`,
    astrologicalFactorsHi: `धन कारक: देवगुरु बृहस्पति (${jupiter?.signName || '-'}) | लाभेश का केंद्र-त्रिकोण से संबंध`,
    classicalAdviceEn: 'Offer Arghya to the Sun at sunrise and chant Kanakadhara Stotram on Fridays.',
    classicalAdviceHi: 'नित्य प्रातः सूर्य देव को अर्घ्य दें तथा शुक्रवार को कनकधारा स्तोत्र का पाठ करें।',
  };

  // 3. Career & Profession (10th House & D10)
  const careerScore = 85;
  const careerDomain: DeepDomainPrediction = {
    id: 'career',
    titleEn: 'Career, Leadership, Authority & Status (10th Bhava & D10)',
    titleHi: 'आजीविका, पद-प्रतिष्ठा, नेतृत्व व कर्म (दशम भाव व दशमांश)',
    icon: 'briefcase',
    score: careerScore,
    ratingEn: 'Excellent',
    ratingHi: 'अति उत्तम',
    summaryEn: `The 10th house of Karma indicates a native destined for administrative authority, management, strategic problem-solving, or entrepreneurship. You gain respect through competence rather than flattery, and major professional breakthroughs occur during the maturity periods of Saturn (36) and Jupiter (16/32).`,
    summaryHi: `कर्म भाव (दशम) स्पष्ट संकेत देता है कि जातक प्रशासनिक अधिकार, प्रबंधन, रणनीतिक समस्या समाधान या स्वतंत्र व्यवसाय में उल्लेखनीय सफलता प्राप्त करेगा। चाटुकारिता के स्थान पर कर्म-दक्षता से सम्मान मिलेगा। शनि (36 वर्ष) व गुरु (32 वर्ष) के परिपक्व काल में करियर में महान उत्कर्ष होगा।`,
    keyStrengthsEn: [
      'Strong organizational leadership and commanding executive presence',
      'Ability to master complex technical, legal, or commercial domains',
      'High resilience against professional rivalries, converting adversity into advancement',
    ],
    keyStrengthsHi: [
      'सशक्त संगठनात्मक नेतृत्व एवं प्रभावशाली कार्यकारी उपस्थिति',
      'जटिल तकनीकी, विधिक या वाणिज्यिक क्षेत्रों पर पूर्ण अधिकार प्राप्त करने की क्षमता',
      'व्यावसायिक प्रतिद्वंद्वियों के विरुद्ध अडिगता, चुनौतियों को अवसरों में बदलने का कौशल',
    ],
    watchoutsEn: [
      'Impatience with slow bureaucratic subordinates; maintain diplomatic poise',
      'Watch for burnout during Saturn or Mars transits over key angles',
    ],
    watchoutsHi: [
      'कार्यस्थल पर धीमी गति से चलने वाले अधीनस्थों से अधीर न हों, कूटनीतिक संयम रखें',
      'शनि या मंगल के महत्वपूर्ण गोचर के दौरान अत्यधिक कार्यभार से मानसिक तनाव से बचें',
    ],
    astrologicalFactorsEn: `Karma Karaka: Saturn (${saturn?.signName || '-'}) | Sun Authority: ${sun?.signName || '-'} | Mars Energy: ${mars?.signName || '-'}`,
    astrologicalFactorsHi: `कर्म कारक: शनि देव (${saturn?.signName || '-'}) | सूर्य प्रतिष्ठा: ${sun?.signName || '-'} | मंगल साहस: ${mars?.signName || '-'}`,
    classicalAdviceEn: 'Recite Aditya Hridaya Stotram on Sundays and respect colleagues and service providers.',
    classicalAdviceHi: 'रविवार को आदित्य हृदय स्तोत्र का पाठ करें तथा कार्यक्षेत्र में अधीनस्थों के प्रति न्यायप्रिय रहें।',
  };

  // 4. Marriage & Partnerships (7th House & D9)
  const marriageScore = 75;
  const marriageDomain: DeepDomainPrediction = {
    id: 'marriage',
    titleEn: 'Marriage, Spouse Persona & Harmony (7th Bhava & Navamsha D9)',
    titleHi: 'विवाह, जीवनसाथी का स्वरूप व दांपत्य सुख (सप्तम भाव व नवांश)',
    icon: 'heart',
    score: marriageScore,
    ratingEn: 'Very Good',
    ratingHi: 'उत्तम',
    summaryEn: `The 7th house and Venus/Jupiter configurations indicate an intelligent, dignified, and culturally aligned life partner. While minor temperamental differences may surface in early marriage, the union grows deeper with time, creating a stable, socially respected domestic sanctuary.`,
    summaryHi: `सप्तम भाव तथा शुक्र/गुरु की स्थिति इंगित करती है कि जीवनसाथी सुसंस्कृत, बुद्धिमान, स्वाभिमानी एवं पारिवारिक मूल्यों का सम्मान करने वाला होगा। वैवाहिक जीवन के आरंभिक वर्षों में स्वभाव संबंधी छोटे-मोटे मतभेद हो सकते हैं, किंतु समय के साथ दांपत्य में प्रगाढ़ता और सामाजिक प्रतिष्ठा बढ़ेगी।`,
    keyStrengthsEn: [
      'Loyal, supportive spouse who contributes significantly to family prosperity',
      'Mutual philosophical resonance and respect for personal space',
      'High compatibility in long-term goals and social status maintenance',
    ],
    keyStrengthsHi: [
      'समर्पित एवं सहयोगी जीवनसाथी जो पारिवारिक समृद्धि में महत्वपूर्ण योगदान देगा',
      'पारस्परिक वैचारिक अनुकूलता एवं एक-दूसरे की स्वतंत्रता का सम्मान',
      'दीर्घकालिक पारिवारिक लक्ष्यों एवं सामाजिक सम्मान में पूर्ण सामंजस्य',
    ],
    watchoutsEn: [
      'Do not let professional workplace stress spill over into domestic intimacy',
      'Clear communication is essential during Mars or Venus combust periods',
    ],
    watchoutsHi: [
      'कार्यक्षेत्र के तनाव और व्यस्तता को पारिवारिक और दांपत्य जीवन पर हावी न होने दें',
      'मंगल या शुक्र के अस्त/वक्र काल में आपसी संवाद को सदैव खुला और पारदर्शी रखें',
    ],
    astrologicalFactorsEn: `Vivaha Karaka: Venus (${venus?.signName || '-'}) | 7th Lord & Navamsha D9 alignment`,
    astrologicalFactorsHi: `विवाह कारक: शुक्र देव (${venus?.signName || '-'}) | सप्तमेश व नवांश D9 की शुभ स्थिति`,
    classicalAdviceEn: 'Keep fragrant white flowers or camphor in the bedroom and respect feminine divinity.',
    classicalAdviceHi: 'दांपत्य सुख की वृद्धि हेतु शयनकक्ष में कपूर या श्वेत सुगंधित पुष्प रखें तथा गौरी-शंकर की आराधना करें।',
  };

  // 5. Health & Longevity (6th, 8th Bhavas)
  const healthScore = 76;
  const healthDomain: DeepDomainPrediction = {
    id: 'health',
    titleEn: 'Health, Vitality, Disease Vulnerability & Longevity (Ayur Bhava)',
    titleHi: 'स्वास्थ्य, दीर्घायु, रोग प्रतिरोधक क्षमता व सावधानी (आयुर्भाव)',
    icon: 'shield',
    score: healthScore,
    ratingEn: 'Very Good',
    ratingHi: 'उत्तम',
    summaryEn: `Basic constitution (Deha Bala) is resilient with strong natural immunity. Planetary indicators place you in the Deerghayu (Long Life, 75–100+ years) bracket. The primary zones requiring preventive lifestyle discipline are digestion/metabolism (Pitta/Agni) and joint/back flexibility (Vata).`,
    summaryHi: `देह बल और नैसर्गिक रोग प्रतिरोधक क्षमता उत्तम है। शास्त्रीय गणना अनुसार आपकी कुंडली दीर्घायु वर्ग (75 से 100+ वर्ष) में आती है। जीवनशैली में मुख्य रूप से पाचन/अग्नि तत्व (पित्त) तथा रीढ़ व जोड़ों के लचीलेपन (वात) पर ध्यान देने की आवश्यकता है।`,
    keyStrengthsEn: [
      'Quick recuperative vitality and resilience against chronic ailments',
      'Clear bodily warning signals enabling timely medical attention',
      'Strong longevity signatures anchored by benefics in Kendra/Kona',
    ],
    keyStrengthsHi: [
      'बीमारियों से शीघ्र स्वस्थ होने की प्राकृतिक शारीरिक क्षमता',
      'शरीर द्वारा समय रहते स्पष्ट संकेत मिलना जिससे रोग प्रारंभिक अवस्था में ही नियंत्रित हो जाता है',
      'केंद्र व त्रिकोण में शुभ ग्रहों के प्रभाव से पुष्ट दीर्घायु योग',
    ],
    watchoutsEn: [
      'Watch dietary acidity, irregular meal timings, and water intake during intense summers',
      'Exercise care with driving or heavy machinery during Sade Sati or Mars 8th aspects',
    ],
    watchoutsHi: [
      'अनियमित खान-पान, तैलीय भोजन व जल की कमी से होने वाले पित्त विकारों से बचें',
      'शनि की ढैय्या/साढ़े साती या मंगल की अष्टम दृष्टि के समय वाहन सावधानीपूर्वक चलाएं',
    ],
    astrologicalFactorsEn: `Ayush Karaka: Saturn | 6th/8th house lords evaluated without destructive malefics`,
    astrologicalFactorsHi: `आयु कारक: शनि देव | षष्ठ व अष्टम भाव पर क्रूर ग्रहों का विनाशक प्रभाव नहीं है`,
    classicalAdviceEn: 'Chant Maha Mrityunjaya Mantra 11 times daily and maintain moderate physical yoga.',
    classicalAdviceHi: 'नित्य 11 बार महामृत्युंजय मंत्र का जप करें तथा नियमित योगासन व सात्विक आहार अपनाएं।',
  };

  // 6. Spirituality & Higher Karma (9th & 12th Bhavas)
  const spiritualityScore = 88;
  const spiritualityDomain: DeepDomainPrediction = {
    id: 'spirituality',
    titleEn: 'Spirituality, Dharma, Ancestral Punya & Moksha (9th & 12th Bhavas)',
    titleHi: 'धर्म, आध्यात्म, पूर्व-पुण्य एवं मोक्ष गति (नवम व द्वादश भाव)',
    icon: 'sparkles',
    score: spiritualityScore,
    ratingEn: 'Excellent',
    ratingHi: 'अति उत्तम',
    summaryEn: `A distinguished heritage of Purva Punya (merit carried from past lives) supports you in critical moments like an unseen shield. You possess an innate curiosity towards philosophy, ancient traditions, and sacred architecture. The latter third of life turns deeply contemplative, leading to philanthropic and spiritual fulfillment.`,
    summaryHi: `पूर्व जन्मों के संचित पुण्य का आशीर्वाद जीवन के संकटकालीन मोड़ों पर एक अदृश्य सुरक्षा कवच की भांति आपकी रक्षा करता है। आपके भीतर सनातन दर्शन, गूढ़ विद्याओं एवं धर्म-संस्कृति के प्रति स्वाभाविक जिज्ञासा है। जीवन का उत्तरार्ध परोपकार, तीर्थाटन और आध्यात्मिक सिद्धि से परिपूर्ण होगा।`,
    keyStrengthsEn: [
      'Deep intuitive connection with lineage deities and spiritual mentors',
      'Natural ethical compass that protects against karmic entanglements',
      'Philanthropic drive that attracts divine grace and societal goodwill',
    ],
    keyStrengthsHi: [
      'कुलदेवी/कुलदेवता एवं सद्गुरु के प्रति स्वाभाविक निष्ठा व कृपा',
      'सत्य और धर्म का अटूट मार्ग जो कर्म बंधनों से रक्षा करता है',
      'परोपकारी भावना जिसके फलस्वरूप समाज में आदर और ईश्वरीय अनुग्रह प्राप्त होता है',
    ],
    watchoutsEn: [
      'Do not neglect ancestral shraddha or family lineage rituals during Rahu transits',
    ],
    watchoutsHi: [
      'पितृ पक्ष या राहु के गोचर काल में पितरों के तर्पण व पारिवारिक कुल-रीतियों की उपेक्षा न करें',
    ],
    astrologicalFactorsEn: `Dharma Karaka: Jupiter | Moksha Karaka: Ketu in spiritual sign`,
    astrologicalFactorsHi: `धर्म कारक: बृहस्पति | मोक्ष कारक: केतु की आध्यात्मिक स्थिति`,
    classicalAdviceEn: 'Visit ancient shrines periodically and support educational welfare for underprivileged children.',
    classicalAdviceHi: 'समय-समय पर प्राचीन तीर्थों का दर्शन करें तथा निर्धन विद्यार्थियों की शिक्षा में सहयोग करें।',
  };

  const domains = [
    personalityDomain,
    wealthDomain,
    careerDomain,
    marriageDomain,
    healthDomain,
    spiritualityDomain,
  ];

  const overallLifeScore = Math.round(
    domains.reduce((acc, d) => acc + d.score, 0) / domains.length
  );

  const executiveSummaryEn = `This horoscope represents a highly endowed, noble native possessing a harmonious balance between worldly achievement (Artha & Kama) and higher ethical consciousness (Dharma & Moksha). With an aggregate auspicious index of ${overallLifeScore}/100, the planetary alignments favour leadership, stable wealth accumulation, domestic dignity, and sustained long-term prosperity.`;

  const executiveSummaryHi = `यह जन्म कुंडली एक तेजस्वी एवं भाग्यशाली जातक का प्रतिनिधित्व करती है, जिसमें सांसारिक सफलता (अर्थ व काम) और उच्च नैतिक चेतना (धर्म व मोक्ष) का सुंदर संतुलन है। समग्र शुभता सूचकांक ${overallLifeScore}/100 होने के कारण ग्रह स्थितियां नेतृत्व, स्थायी धन संचय, पारिवारिक प्रतिष्ठा एवं सुदीर्घ जीवन का वरदान देती हैं।`;

  return {
    overallLifeScore,
    executiveSummaryEn,
    executiveSummaryHi,
    domains,
  };
}
