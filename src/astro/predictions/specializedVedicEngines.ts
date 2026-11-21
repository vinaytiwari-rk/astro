/**
 * specializedVedicEngines.ts
 * Advanced Classical Predictive Synthesis:
 * 1. Ishta Devata & Kula Devata Upasana Engine (Jaimini Karakamsha / 12th House)
 * 2. Planetary Retrograde (Vakri Grah) Cheshta Bala & Karmic Unfoldment
 * 3. Daily Tarabalam & Chandrabalam Energy Calculator
 * 4. Pancha Pakshi Shastra (5 Sacred Birds Bio-Rhythm Timing)
 * 5. 20 Classical Kuja Dosha (Manglik) Exceptions & Cancellation Rules
 */

import { NAKSHATRAS, SIGNS } from '../constants';
import type { BodyPosition, ChartData, PlanetId, SevenPlanetId } from '../types';

// ─── 1. ISHTA DEVATA & KULA DEVATA ENGINE ─────────────────────────────────────

export interface IshtaDevataReport {
  atmakarakaId: PlanetId;
  atmakarakaNameEn: string;
  atmakarakaNameHi: string;
  karakamshaSignIndex: number;
  karakamshaSignEn: string;
  karakamshaSignHi: string;
  twelfthHouseSignIndex: number;
  twelfthHouseSignEn: string;
  twelfthHouseSignHi: string;
  rulingPlanetId: PlanetId;
  rulingPlanetEn: string;
  rulingPlanetHi: string;
  ishtaDevataNameEn: string;
  ishtaDevataNameHi: string;
  sacredMantra: string;
  upasanaMethodEn: string;
  upasanaMethodHi: string;
  kulaDevataEn: string;
  kulaDevataHi: string;
  spiritualSignificanceEn: string;
  spiritualSignificanceHi: string;
}

const SIGN_NAMES_HI = [
  'मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या',
  'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुम्भ', 'मीन'
];

const PLANET_NAMES_HI: Record<string, string> = {
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

export function computeIshtaDevata(chart: ChartData): IshtaDevataReport {
  const sevenPlanets: PlanetId[] = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
  const candidates = chart.planets.filter((p) => sevenPlanets.includes(p.id as PlanetId));

  // Find Atmakaraka (highest degree in sign)
  let ak: BodyPosition = candidates[0];
  for (const p of candidates) {
    if (p.charaKaraka === 'AK') {
      ak = p;
      break;
    }
    if (p.degreeInSign > ak.degreeInSign) {
      ak = p;
    }
  }

  // Karakamsha: sign of AK in D9 Navamsha
  let karakamshaSignIndex = ak.signIndex;
  const d9Placements = chart.divisionalCharts?.D9?.placements;
  if (d9Placements) {
    const d9Ak = d9Placements.find((p) => p.id === ak.id);
    if (d9Ak) {
      karakamshaSignIndex = d9Ak.signIndex;
    }
  }

  // 12th house from Karakamsha
  const twelfthSignIndex = (karakamshaSignIndex + 11) % 12;
  const twelfthLordId = SIGNS[twelfthSignIndex].lord;

  // Check if any planet occupies the 12th from Karakamsha in D9
  let ishtaPlanetId: PlanetId = twelfthLordId;
  if (d9Placements) {
    const occupant = d9Placements.find((p) => p.signIndex === twelfthSignIndex && p.id !== 'Asc');
    if (occupant) {
      ishtaPlanetId = occupant.id as PlanetId;
    }
  }

  const deitiesMap: Record<string, { en: string; hi: string; mantra: string; upasanaEn: string; upasanaHi: string }> = {
    Sun: {
      en: 'Lord Shiva / Bhagwan Rama / Surya Narayana',
      hi: 'भगवान शिव / श्रीराम / सूर्य नारायण',
      mantra: 'ॐ नमः शिवाय || ॐ घृणि सूर्याय नमः',
      upasanaEn: 'Offer water to the rising Sun; recite Aditya Hridaya Stotra on Sundays; practice Shiva meditation.',
      upasanaHi: 'प्रातःकाल उगते सूर्य को अर्घ्य दें; रविवार को आदित्य हृदय स्तोत्र का पाठ करें; शिव पंचाक्षर मंत्र का जप करें।',
    },
    Moon: {
      en: 'Goddess Parvati / Gauri / Bhuvaneshwari',
      hi: 'माता पार्वती / गौरी / भुवनेश्वरी',
      mantra: 'ॐ ह्रीं श्रीं क्लीं भुवनेश्वर्यै नमः || ॐ नमः शिवाय',
      upasanaEn: 'Worship Goddess Gauri with white flowers on Mondays; practice gentle breathwork and compassionate charity.',
      upasanaHi: 'सोमवार को मां गौरी को श्वेत पुष्प अर्पित करें; ललिता सहस्रनाम अथवा दुर्गा चालीसा का पाठ करें।',
    },
    Mars: {
      en: 'Lord Hanuman / Kartikeya (Murugan) / Narasimha',
      hi: 'श्री हनुमान जी / भगवान कार्तिकेय (स्कंद) / नृसिंह भगवान',
      mantra: 'ॐ हं हनुमते रुद्रात्मकाय हुं फट् || ॐ क्रां क्रीं क्रौं सः भौमाय नमः',
      upasanaEn: 'Recite Hanuman Chalisa and Sundarkand on Tuesdays; cultivate moral courage and righteous action.',
      upasanaHi: 'मंगलवार को हनुमान चालीसा एवं सुंदरकांड का पाठ करें; सिंदूर व चमेली का तेल अर्पित करें; निर्बलों की रक्षा करें।',
    },
    Mercury: {
      en: 'Lord Maha Vishnu / Sri Krishna / Narayana',
      hi: 'भगवान महाविष्णु / श्रीकृष्ण / श्रीमन नारायण',
      mantra: 'ॐ नमो भगवते वासुदेवाय || ॐ विष्णवे नमः',
      upasanaEn: 'Chant Vishnu Sahasranama on Wednesdays; read Srimad Bhagavad Gita; offer Tulsi leaves to Lord Krishna.',
      upasanaHi: 'बुधवार को विष्णु सहस्रनाम का पाठ करें; तुलसी दल अर्पित कर भगवान श्रीकृष्ण की आराधना करें; श्रीमद्भगवद्गीता का स्वाध्याय करें।',
    },
    Jupiter: {
      en: 'Lord Sadashiva / Guru Dattatreya / Brihaspati',
      hi: 'भगवान सदाशिव / गुरु दत्तात्रेय / देवगुरु बृहस्पति',
      mantra: 'ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः || ॐ द्रां दत्तात्रेयाय नमः',
      upasanaEn: 'Honor your spiritual teachers and scriptures; meditate on Thursdays with saffron or yellow flowers.',
      upasanaHi: 'गुरुवार को गुरु पादुका पूजन व शिव उपासना करें; सात्विक ज्ञान, सत्य वचन एवं ब्राह्मण/संत सेवा में प्रवृत्त रहें।',
    },
    Venus: {
      en: 'Goddess Mahalakshmi / Sri Radha / Annapurna',
      hi: 'माता महालक्ष्मी / श्रीराधा रानी / अन्नपूर्णा देवी',
      mantra: 'ॐ श्रीं ह्रीं क्लीं महालक्ष्म्यै नमः || ॐ द्रां द्रीं द्रौं सः शुक्राय नमः',
      upasanaEn: 'Recite Sri Suktam or Kanakadhara Stotra on Fridays; honor women, maintain cleanliness, and donate food.',
      upasanaHi: 'शुक्रवार को श्री सूक्त अथवा कनकधारा स्तोत्र का पाठ करें; कन्याओं का आदर करें एवं खीर का भोग अर्पित करें।',
    },
    Saturn: {
      en: 'Lord Mahakala / Bhairava / Shani Dev',
      hi: 'भगवान महाकाल / कालभैरव / शनिदेव',
      mantra: 'ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः || ॐ भैरवाय नमः',
      upasanaEn: 'Recite Dasharatha Shani Stotra on Saturdays; serve elders and laborers; practice detachment and patience.',
      upasanaHi: 'शनिवार को दशरथ कृत शनि स्तोत्र का पाठ करें; कालभैरव अष्टक का जप करें; वृद्धों व असहायों की निस्वार्थ सेवा करें।',
    },
    Rahu: {
      en: 'Goddess Durga / Mahakali / Chandi',
      hi: 'माता दुर्गा / महाकाली / चंडी देवी',
      mantra: 'ॐ दुं दुर्गायै नमः || ॐ ऐं ह्रीं क्लीं चामुण्डायै विच्चे',
      upasanaEn: 'Recite Durga Saptashati or Argala Stotra; observe fasts during Navaratri; maintain ethical speech.',
      upasanaHi: 'नवार्ण मंत्र अथवा दुर्गा चालीसा का जप करें; नवरात्र में व्रत व कन्या पूजन करें; किसी के प्रति द्वेष न रखें।',
    },
    Ketu: {
      en: 'Lord Ganesha / Matsya Avatar / Paramashiva',
      hi: 'भगवान श्रीगणेश / मत्स्य अवतार / परमशिव',
      mantra: 'ॐ गं गणपतये नमः || ॐ कें केतवे नमः',
      upasanaEn: 'Recite Sankata Nashana Ganesha Stotra on Wednesdays; seek spiritual detachment and inner stillness.',
      upasanaHi: 'संकटनाशन गणेश स्तोत्र का पाठ करें; दूर्वा अर्पित करें; एकांत साधना व ध्यान द्वारा मोक्ष मार्ग प्रशस्त करें।',
    },
  };

  const deityInfo = deitiesMap[ishtaPlanetId] || deitiesMap.Jupiter;

  return {
    atmakarakaId: ak.id as PlanetId,
    atmakarakaNameEn: ak.id,
    atmakarakaNameHi: PLANET_NAMES_HI[ak.id] || ak.id,
    karakamshaSignIndex,
    karakamshaSignEn: SIGNS[karakamshaSignIndex].name,
    karakamshaSignHi: SIGN_NAMES_HI[karakamshaSignIndex],
    twelfthHouseSignIndex: twelfthSignIndex,
    twelfthHouseSignEn: SIGNS[twelfthSignIndex].name,
    twelfthHouseSignHi: SIGN_NAMES_HI[twelfthSignIndex],
    rulingPlanetId: ishtaPlanetId,
    rulingPlanetEn: ishtaPlanetId,
    rulingPlanetHi: PLANET_NAMES_HI[ishtaPlanetId] || ishtaPlanetId,
    ishtaDevataNameEn: deityInfo.en,
    ishtaDevataNameHi: deityInfo.hi,
    sacredMantra: deityInfo.mantra,
    upasanaMethodEn: deityInfo.upasanaEn,
    upasanaMethodHi: deityInfo.upasanaHi,
    kulaDevataEn: `Preserving Lineage Deity aligned with ${SIGNS[chart.planets.find((p) => p.id === 'Sun')?.signIndex || 0].name} Solar Arc`,
    kulaDevataHi: `सूर्य राशि (${SIGN_NAMES_HI[chart.planets.find((p) => p.id === 'Sun')?.signIndex || 0]}) एवं नवम भाव से संबद्ध कुल परम्परा पूज्य देव`,
    spiritualSignificanceEn: 'According to Maharishi Jaimini Upadesha Sutras, the 12th house from Karakamsha Lagna reveals Jivanmuktamsa—the divine gateway of supreme liberation and spiritual shield throughout lifetime.',
    spiritualSignificanceHi: 'महर्षि जैमिनी उपदेश सूत्र के अनुसार कारकांश लग्न से १२वां भाव जीवन्मुक्तांश कहलाता है। यह जातक के इस जन्म में ईश्वरीय संरक्षण, साधना सिद्धि और मोक्ष का सर्वोच्च द्वार है।',
  };
}

// ─── 2. PLANETARY RETROGRADE (VAKRI GRAH) ENGINE ─────────────────────────────

export interface VakriPlanetDetail {
  id: PlanetId;
  nameEn: string;
  nameHi: string;
  currentHouse: number;
  priorHouse: number;
  cheshtaBalaLevel: string;
  pastLifeKarmaEn: string;
  pastLifeKarmaHi: string;
  careerImpactEn: string;
  careerImpactHi: string;
  remedyEn: string;
  remedyHi: string;
}

export interface VakriPlanetsReport {
  hasRetrogradePlanets: boolean;
  retrogradeCount: number;
  planets: VakriPlanetDetail[];
  overallSummaryEn: string;
  overallSummaryHi: string;
}

export function computeVakriPlanetsAnalysis(chart: ChartData): VakriPlanetsReport {
  const retroPlanets = chart.planets.filter(
    (p) => p.isRetrograde && p.id !== 'Rahu' && p.id !== 'Ketu' && p.id !== 'Sun' && p.id !== 'Moon'
  );

  const vakriProfiles: Record<string, { pastLifeEn: string; pastLifeHi: string; careerEn: string; careerHi: string; remedyEn: string; remedyHi: string }> = {
    Mars: {
      pastLifeEn: 'Past-life courage left unfinished or misdirected aggression. In this birth, internal drive is intense; energy must be channeled constructively rather than impulsively.',
      pastLifeHi: 'पूर्व जन्म में पराक्रम अथवा भूमि संबंधी कर्तव्य अधूरा रहा। इस जन्म में आंतरिक ऊर्जा अत्यंत तीव्र होती है; क्रोध व जल्दबाजी के स्थान पर धैर्य से कार्य करना चाहिए।',
      careerEn: 'Excels in strategic, technical, surgical, engineering, or executive crises where bold lateral moves yield sudden triumphs.',
      careerHi: 'रणनीतिक, तकनीकी, शल्य चिकित्सा, इंजीनियरिंग या आपातकालीन प्रबंधन में अप्रत्याशित सफलता प्राप्त होती है।',
      remedyEn: 'Recite Hanuman Chalisa daily; practice martial arts or disciplined gym workouts; avoid reckless driving.',
      remedyHi: 'प्रतिदिन हनुमान चालीसा का पाठ करें; शारीरिक व्यायाम व योग करें; मंगलवार को मीठी रोटी का दान करें।',
    },
    Mercury: {
      pastLifeEn: 'Past-life intellectual research, literature, or contracts unresolved. Possesses brilliant non-linear thinking, questioning traditional paradigms with sharp wit.',
      pastLifeHi: 'पूर्व जन्म में विद्या, लेखन, व्यापार अथवा अनुबंध संबंधी अधूरा शोध। जातक में विलक्षण तार्किक बुद्धि, लीक से हटकर सोचने और सूक्ष्म विश्लेषण की क्षमता होती है।',
      careerEn: 'Superb in data architecture, coding, finance auditing, investigative writing, debate, and novel problem solving.',
      careerHi: 'डेटा आर्किटेक्चर, कोडिंग, वित्तीय ऑडिट, खोजी पत्रकारिता, शोध और जटिल समस्याओं के समाधान में अद्वितीय सफलता।',
      remedyEn: 'Feed green grass or soaked moong dal to cows on Wednesdays; meditate upon Lord Vishnu; verify emails before sending.',
      remedyHi: 'बुधवार को गाय को हरा चारा अथवा भीगा हुआ मूंग खिलाएं; भगवान विष्णु की आराधना करें; दस्तावेज़ों की जांच सावधानी से करें।',
    },
    Jupiter: {
      pastLifeEn: 'Past-life spiritual scholar or philosophical rebel who questioned dogmatic traditions. Possesses natural inner wisdom, refusing superficial dogma.',
      pastLifeHi: 'पूर्व जन्म में उच्च दार्शनिक या आध्यात्मिक साधक। जातक बाह्य आडंबरों के स्थान पर सत्य ज्ञान, आत्म-अनुसंधान और स्वतंत्र नैतिक मूल्यों पर विश्वास करता है।',
      careerEn: 'Remarkable in higher advisory, judiciary, academic leadership, financial strategy, and profound counseling.',
      careerHi: 'उच्च परामर्श, न्यायपालिका, शिक्षा नेतृत्व, वित्तीय रणनीति और आध्यात्मिक मार्गदर्शन में सर्वोच्च सम्मान।',
      remedyEn: 'Serve elders and teachers; read sacred philosophical treatises; chant Guru Gayatri on Thursdays.',
      remedyHi: 'गुरुजनों व वृद्धों का सम्मान करें; श्रीमद्भगवद्गीता अथवा उपनिषदों का स्वाध्याय करें; गुरुवार को चने की दाल का दान करें।',
    },
    Venus: {
      pastLifeEn: 'Past-life romantic idealism or intense devotion to beauty/art. Soul searches for profound unconditional love, rarely satisfied with mundane romance.',
      pastLifeHi: 'पूर्व जन्म में प्रेम, सौंदर्य अथवा कला के प्रति गहन समर्पण। जातक सांसारिक आकर्षणों के स्थान पर आत्मिक व निष्कपट प्रेम की खोज में रहता है।',
      careerEn: 'Thrives in premium creative arts, design, luxury branding, diplomatic negotiation, and aesthetic innovation.',
      careerHi: 'कला, डिजाइनिंग, फैशन, कूटनीति, सौंदर्य प्रसाधन और रचनात्मक उद्योगों में अद्भुत प्रतिभा व सफलता।',
      remedyEn: 'Respect women and artistic creations; chant Sri Suktam on Fridays; offer white sweets or curd to needy.',
      remedyHi: 'महिलाओं का सम्मान करें; शुक्रवार को श्री सूक्त का पाठ करें; मां लक्ष्मी को सफेद मिठाई या मिश्री का भोग लगाएं।',
    },
    Saturn: {
      pastLifeEn: 'Past-life heavy societal responsibility or delayed justice. Carries massive karmic endurance; undergoes early testing to build unshakeable character.',
      pastLifeHi: 'पूर्व जन्म में समाज अथवा कर्मक्षेत्र का भारी दायित्व। जातक के प्रारंभिक जीवन में विलंब व संघर्ष होता है जो उसे अत्यंत परिपक्व, अनुशासित और अजेय बनाता है।',
      careerEn: 'Eventual rise to formidable institutional authority, long-term infrastructure, judicial mastery, and governance.',
      careerHi: 'दीर्घकालिक प्रशासनिक पदों, न्यायिक सेवाओं, उद्योग, खनन व शासन व्यवस्था में स्थायी एवं सर्वोच्च अधिकार की प्राप्ति।',
      remedyEn: 'Light mustard oil lamp under Peepal tree on Saturdays; serve physically challenged people; cultivate unwavering perseverance.',
      remedyHi: 'शनिवार को पीपल के वृक्ष के नीचे सरसों के तेल का दीपक जलाएं; असहायों की सेवा करें; धैर्य और अनुशासन बनाए रखें।',
    },
  };

  const details: VakriPlanetDetail[] = retroPlanets.map((p) => {
    const curH = p.rasiHouseNumber;
    const priorH = curH === 1 ? 12 : curH - 1;
    const prof = vakriProfiles[p.id] || {
      pastLifeEn: 'Carries distinct unfinished karma requiring conscious awareness.',
      pastLifeHi: 'पूर्व जन्म का अधूरा कर्म जो इस जन्म में जागृत प्रयास की मांग करता है।',
      careerEn: 'Produces unconventional results through persistent focus.',
      careerHi: 'विशिष्ट कार्यक्षेत्र में स्वतंत्र सोच के माध्यम से सफलता।',
      remedyEn: 'Maintain spiritual discipline and ethical conduct.',
      remedyHi: 'साधना एवं नैतिक आचरण बनाए रखें।',
    };

    return {
      id: p.id as PlanetId,
      nameEn: p.id,
      nameHi: PLANET_NAMES_HI[p.id] || p.id,
      currentHouse: curH,
      priorHouse: priorH,
      cheshtaBalaLevel: 'Supreme Cheshta Bala (60/60 Virupas - Deep Internal Potency)',
      pastLifeKarmaEn: prof.pastLifeEn,
      pastLifeKarmaHi: prof.pastLifeHi,
      careerImpactEn: prof.careerEn,
      careerImpactHi: prof.careerHi,
      remedyEn: prof.remedyEn,
      remedyHi: prof.remedyHi,
    };
  });

  const count = details.length;
  let summaryEn = 'All major planets are in direct motion. Karma in this lifetime unfolds through direct, immediate actions without heavy retrograde backlogs.';
  let summaryHi = 'कुंडली में सभी प्रमुख ग्रह मार्गी गति में हैं। इस जन्म का कर्म प्रत्यक्ष व तीव्र गति से फलित होता है और पूर्व जन्म का भारी संचित बैकलॉग नहीं है।';

  if (count > 0) {
    const names = details.map((d) => d.nameEn).join(', ');
    const namesHi = details.map((d) => d.nameHi).join(', ');
    summaryEn = `${count} planet(s) (${names}) are in Retrograde (Vakri) motion. According to classical treatises (Saravali & Phaladeepika), retrograde planets hold supreme Cheshta Bala and simultaneously activate their prior house, indicating specialized past-life mastery and unconventional brilliance.`;
    summaryHi = `कुंडली में ${count} ग्रह (${namesHi}) वक्री हैं। शास्त्रीय ग्रंथों (सारावली व फलदीपिका) के अनुसार वक्री ग्रह सर्वोच्च चेष्टा बल से युक्त होते हैं और अपने पिछले भाव को भी जाग्रत करते हैं, जो पूर्व जन्म की अधूरी साधना और विलक्षण बौद्धिक क्षमता का प्रमाण है।`;
  }

  return {
    hasRetrogradePlanets: count > 0,
    retrogradeCount: count,
    planets: details,
    overallSummaryEn: summaryEn,
    overallSummaryHi: summaryHi,
  };
}

// ─── 3. DAILY TARABALAM & CHANDRABALAM CALCULATOR ────────────────────────────

export interface TaraItem {
  taraNumber: number;
  nameEn: string;
  nameHi: string;
  status: 'Auspicious' | 'Moderate' | 'Inauspicious';
  favorabilityScore: number;
  meaningEn: string;
  meaningHi: string;
  isActive: boolean;
}

export interface TarabalamReport {
  birthNakshatraIndex: number;
  birthNakshatraNameEn: string;
  birthNakshatraNameHi: string;
  natalNakshatraIndex: number;
  natalNakshatraName: string;
  transitNakshatraIndex: number;
  transitNakshatraName: string;
  taraNumber: number; // 1..9
  currentTaraNumber: number;
  taraNameEn: string;
  taraNameHi: string;
  currentTaraNameEn: string;
  currentTaraNameHi: string;
  taraStatus: 'Auspicious' | 'Moderate' | 'Inauspicious';
  isAuspicious: boolean;
  taraScorePercent: number;
  taraResultEn: string;
  taraResultHi: string;
  taraMeaningEn: string;
  taraMeaningHi: string;
  chandrabalaHouse: number;
  chandrabalaStatus: 'Auspicious' | 'Moderate' | 'Inauspicious';
  chandrabalaResultEn: string;
  chandrabalaResultHi: string;
  dailyEnergyScore: number;
  actionRecommendationEn: string;
  actionRecommendationHi: string;
  recommendedActionEn: string;
  recommendedActionHi: string;
  all9Taras: TaraItem[];
}

export function computeTarabalamChandrabalam(chart: ChartData, targetTransitNakIndex = 25): TarabalamReport {
  // Find Moon's natal nakshatra
  const moon = chart.planets.find((p) => p.id === 'Moon');
  const natalNakIdx = moon ? moon.nakshatraIndex : 0;
  const natalSignIdx = moon ? moon.signIndex : 0;

  // Approximate transit Moon sign from transit Nakshatra (approx 2.25 nakshatras per sign)
  const transitNakIdx = targetTransitNakIndex % 27;
  const transitSignIdx = Math.floor(transitNakIdx / 2.25) % 12;

  // Calculate Tara: distance from natal to transit
  const distance = ((transitNakIdx - natalNakIdx + 27) % 27) + 1;
  const taraNum = ((distance - 1) % 9) + 1;

  const taraDefinitions: Record<number, { en: string; hi: string; status: 'Auspicious' | 'Moderate' | 'Inauspicious'; score: number; resEn: string; resHi: string }> = {
    1: {
      en: 'Janma Tara (Birth / Identity)',
      hi: 'जन्म तारा (शरीर व स्वास्थ्य जागरूकता)',
      status: 'Moderate',
      score: 65,
      resEn: 'Moderate day. Focus on physical wellbeing and internal reflection; avoid strenuous physical over-exertion.',
      resHi: 'मध्यम दिन। स्वास्थ्य का ध्यान रखें और शांति से कार्य करें; अत्यधिक मानसिक या शारीरिक तनाव से बचें।',
    },
    2: {
      en: 'Sampat Tara (Wealth & Fortune)',
      hi: 'संपत तारा (धन लाभ व ऐश्वर्य)',
      status: 'Auspicious',
      score: 95,
      resEn: 'Highly auspicious! Golden day for financial transactions, investments, closing business contracts, and acquiring wealth.',
      resHi: 'परम शुभ दिन! धन लाभ, व्यापारिक अनुबंध, संपत्ति क्रय और नए आर्थिक उपक्रम आरंभ करने हेतु अत्यंत श्रेष्ठ।',
    },
    3: {
      en: 'Vipat Tara (Danger & Obstacles)',
      hi: 'विपत तारा (बाधा व अनावश्यक व्यय)',
      status: 'Inauspicious',
      score: 30,
      resEn: 'Inauspicious. Postpone signing critical agreements, speculative trading, or contentious negotiations.',
      resHi: 'अशुभ तारा। नए अनुबंध, जोखिम भरे निवेश या महत्वपूर्ण यात्राओं को आज टालना ही श्रेयस्कर है।',
    },
    4: {
      en: 'Kshema Tara (Wellbeing & Protection)',
      hi: 'क्षेम तारा (कल्याण, सुरक्षा व सुख)',
      status: 'Auspicious',
      score: 90,
      resEn: 'Very auspicious! Harmonious domestic atmosphere, successful travel, and divine protection in all endeavors.',
      resHi: 'अति शुभ! पारिवारिक सुख, सुरक्षित यात्रा, और समस्त कार्यों में सफलता व सुरक्षा प्राप्त होगी।',
    },
    5: {
      en: 'Pratyari Tara (Opposition & Friction)',
      hi: 'प्रत्यरि तारा (शत्रुता व मतभेद)',
      status: 'Inauspicious',
      score: 35,
      resEn: 'Challenging. Guard against disputes, arguments, and misunderstandings with peers or authorities.',
      resHi: 'कठिन तारा। विवादों व बहस से दूर रहें; विरोधियों से सतर्क रहें और धैर्यपूर्वक कार्य निपटाएं।',
    },
    6: {
      en: 'Sadhaka Tara (Achievement & Realization)',
      hi: 'साधक तारा (कार्यसिद्धि व लक्ष्य प्राप्ति)',
      status: 'Auspicious',
      score: 92,
      resEn: 'Superb fruition! Excellent for academic exams, technical launches, spiritual dhyana, and victory in goals.',
      resHi: 'कार्यसिद्धि कारक! परीक्षा, साक्षात्कार, तकनीकी कार्य, साधना एवं लक्ष्यों को पूरा करने हेतु सर्वश्रेष्ठ।',
    },
    7: {
      en: 'Vadha Tara (Severe Testing & Caution)',
      hi: 'वध / नैधन तारा (गंभीर सावधानी)',
      status: 'Inauspicious',
      score: 15,
      resEn: 'Critical caution required. Strictly avoid medical surgeries, major financial bets, and conflicts.',
      resHi: 'अत्यंत संवेदनशील! शल्य चिकित्सा, बड़े वित्तीय निर्णय या नए कार्य आरंभ करने से पूर्णतः बचें।',
    },
    8: {
      en: 'Mitra Tara (Friendly Alliances & Joy)',
      hi: 'मित्र तारा (मैत्री, सहयोग व प्रसन्नता)',
      status: 'Auspicious',
      score: 85,
      resEn: 'Favorable and pleasant. Ideal for networking, forming partnerships, romantic meetings, and socializing.',
      resHi: 'अनुकूल व सुखद। मित्रों से सहयोग, साझेदारी, मेल-मिलाप और सौहार्दपूर्ण संवाद हेतु उत्तम दिन।',
    },
    9: {
      en: 'Parama Mitra Tara (Supreme Breakthroughs)',
      hi: 'परम मित्र तारा (सर्वोच्च सिद्धि व दैवीय कृपा)',
      status: 'Auspicious',
      score: 98,
      resEn: 'Highest blessing! Breakthrough day for milestone achievements, meeting mentors, and sealing long-term success.',
      resHi: 'सर्वोच्च कल्याणकारी! महत्वपूर्ण कार्य सिद्धि, उच्चाधिकारियों की कृपा एवं दीर्घकालिक सफलता का स्वर्णिम दिन।',
    },
  };

  const taraInfo = taraDefinitions[taraNum] || taraDefinitions[2];

  // Chandrabalam (transit Moon from natal Moon: houses 1, 3, 6, 7, 10, 11 are auspicious)
  const chandraHouse = ((transitSignIdx - natalSignIdx + 12) % 12) + 1;
  let chandraStatus: 'Auspicious' | 'Moderate' | 'Inauspicious' = 'Moderate';
  let chandraResEn = `Transit Moon is in House ${chandraHouse} from natal Moon. Moderate emotional equilibrium.`;
  let chandraResHi = `गोचर चंद्र जन्म चंद्र से भाव ${chandraHouse} में है। सामान्य मानसिक संतुलन रहेगा।`;

  if ([1, 3, 6, 7, 10, 11].includes(chandraHouse)) {
    chandraStatus = 'Auspicious';
    chandraResEn = `Transit Moon in House ${chandraHouse} from natal Moon bestows mental clarity, courage, and popular support.`;
    chandraResHi = `जन्म चंद्र से ${chandraHouse}वें भाव में गोचर चंद्र मानसिक प्रसन्नता, विजय और जनसहयोग प्रदान करता है।`;
  } else if ([4, 8, 12].includes(chandraHouse)) {
    chandraStatus = 'Inauspicious';
    chandraResEn = `Transit Moon in House ${chandraHouse} from natal Moon warns of emotional fatigue and needless expenditures.`;
    chandraResHi = `जन्म चंद्र से ${chandraHouse}वें भाव में गोचर चंद्र मानसिक उद्वेग, अनावश्यक चिंता और व्यय का संकेत देता है।`;
  }

  const dailyScore = Math.round(
    (taraInfo.score * 0.7) + (chandraStatus === 'Auspicious' ? 30 : chandraStatus === 'Moderate' ? 20 : 10)
  );

  let recEn = 'Conduct routine matters; maintain spiritual equanimity.';
  let recHi = 'दैनिक कार्य सामान्य गति से करें; मानसिक शांति बनाए रखें।';
  if (dailyScore >= 80) {
    recEn = 'Highly recommended to execute major deals, launch projects, sign contracts, and pursue vital goals.';
    recHi = 'नए व्यापारिक अनुबंध, साक्षात्कार, बड़े निवेश और महत्वपूर्ण निर्णय लेने हेतु आज का दिन अत्यंत श्रेष्ठ है।';
  } else if (dailyScore <= 45) {
    recEn = 'Postpone critical ventures; chant your Ishta Mantra and focus on internal consolidation.';
    recHi = 'अत्यंत महत्वपूर्ण निर्णय आज टालें; इष्ट मंत्र का जप करें और नियमित कार्यों तक सीमित रहें।';
  }

  const all9Taras: TaraItem[] = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
    const d = taraDefinitions[num];
    return {
      taraNumber: num,
      nameEn: d.en,
      nameHi: d.hi,
      status: d.status,
      favorabilityScore: d.score,
      meaningEn: d.resEn,
      meaningHi: d.resHi,
      isActive: num === taraNum,
    };
  });

  return {
    birthNakshatraIndex: natalNakIdx,
    birthNakshatraNameEn: NAKSHATRAS[natalNakIdx]?.name || 'Ashwini',
    birthNakshatraNameHi: NAKSHATRAS[natalNakIdx]?.name || 'अश्विनी',
    natalNakshatraIndex: natalNakIdx,
    natalNakshatraName: NAKSHATRAS[natalNakIdx]?.name || 'Ashwini',
    transitNakshatraIndex: transitNakIdx,
    transitNakshatraName: NAKSHATRAS[transitNakIdx]?.name || 'Uttara Bhadrapada',
    taraNumber: taraNum,
    currentTaraNumber: taraNum,
    taraNameEn: taraInfo.en,
    taraNameHi: taraInfo.hi,
    currentTaraNameEn: taraInfo.en,
    currentTaraNameHi: taraInfo.hi,
    taraStatus: taraInfo.status,
    isAuspicious: taraInfo.status === 'Auspicious',
    taraScorePercent: taraInfo.score,
    taraResultEn: taraInfo.resEn,
    taraResultHi: taraInfo.resHi,
    taraMeaningEn: taraInfo.resEn,
    taraMeaningHi: taraInfo.resHi,
    chandrabalaHouse: chandraHouse,
    chandrabalaStatus: chandraStatus,
    chandrabalaResultEn: chandraResEn,
    chandrabalaResultHi: chandraResHi,
    dailyEnergyScore: Math.min(100, Math.max(0, dailyScore)),
    actionRecommendationEn: recEn,
    actionRecommendationHi: recHi,
    recommendedActionEn: recEn,
    recommendedActionHi: recHi,
    all9Taras,
  };
}

// ─── 4. PANCHA PAKSHI SHASTRA (5 SACRED BIRDS BIO-RHYTHMS) ───────────────────

export interface PanchaPakshiRhythm {
  stateEn: string;
  stateHi: string;
  tamilName: string;
  activityEn: string;
  activityHi: string;
  powerPercent: number;
  timeWindow: string;
  guidanceEn: string;
  guidanceHi: string;
  successRatePercent: number;
  idealForEn: string;
  idealForHi: string;
}

export interface PanchaPakshiReport {
  birdNameEn: 'Vulture' | 'Owl' | 'Crow' | 'Rooster' | 'Peacock';
  birdNameHi: string;
  pakshaEn: string;
  pakshaHi: string;
  elementEn: string;
  directionEn: string;
  rulingPlanetEn: string;
  currentAvastha: PanchaPakshiRhythm;
  schedule: PanchaPakshiRhythm[];
  dailyRhythms: PanchaPakshiRhythm[];
  bioRhythmOverviewEn: string;
  bioRhythmOverviewHi: string;
  strategicGuidanceEn: string;
  strategicGuidanceHi: string;
}

export function computePanchaPakshi(chart: ChartData): PanchaPakshiReport {
  const moon = chart.planets.find((p) => p.id === 'Moon');
  const nakIdx = moon ? moon.nakshatraIndex : 0;
  const isShukla = chart.panchang?.tithi?.paksha !== 'Krishna';

  type BirdType = 'Vulture' | 'Owl' | 'Crow' | 'Rooster' | 'Peacock';
  let bird: BirdType = 'Vulture';

  if (isShukla) {
    if (nakIdx <= 4) bird = 'Vulture';
    else if (nakIdx <= 10) bird = 'Owl';
    else if (nakIdx <= 15) bird = 'Crow';
    else if (nakIdx <= 20) bird = 'Rooster';
    else bird = 'Peacock';
  } else {
    if (nakIdx <= 4) bird = 'Peacock';
    else if (nakIdx <= 10) bird = 'Rooster';
    else if (nakIdx <= 15) bird = 'Crow';
    else if (nakIdx <= 20) bird = 'Owl';
    else bird = 'Vulture';
  }

  const birdProfiles: Record<BirdType, { hi: string; elem: string; dir: string; ruler: string }> = {
    Vulture: { hi: 'गिद्ध (Vulture)', elem: 'Earth (पृथ्वी)', dir: 'South (दक्षिण)', ruler: 'Jupiter / Sun' },
    Owl: { hi: 'उल्लू (Owl)', elem: 'Water (जल)', dir: 'West (पश्चिम)', ruler: 'Moon / Saturn' },
    Crow: { hi: 'कौआ (Crow)', elem: 'Fire (अग्नि)', dir: 'North-East (ईशान)', ruler: 'Mars / Rahu' },
    Rooster: { hi: 'मुर्गा (Rooster)', elem: 'Air (वायु)', dir: 'North (उत्तर)', ruler: 'Venus / Mercury' },
    Peacock: { hi: 'मोर (Peacock)', elem: 'Ether (आकाश)', dir: 'East (पूर्व)', ruler: 'Sun / Ketu' },
  };

  const cur = birdProfiles[bird];

  const rhythms: PanchaPakshiRhythm[] = [
    {
      stateEn: 'Ruling (Rajya)',
      stateHi: 'राज (शासन)',
      tamilName: 'Arasu',
      activityEn: 'Ruling (Rajya)',
      activityHi: 'राज (सफलता १००%)',
      powerPercent: 100,
      successRatePercent: 100,
      timeWindow: '06:00 AM – 08:24 AM (Pratah)',
      guidanceEn: 'Peak power arc: Ideal for executing contracts, vital decisions, interviews, and enterprise launches.',
      guidanceHi: 'सर्वोच्च समय: व्यापार प्रारंभ, महत्वपूर्ण अनुबंध हस्ताक्षर, साक्षात्कार और नए उपक्रम में विजय।',
      idealForEn: 'Supreme window: Launching businesses, executing crucial agreements, competitive interviews, and medical treatments.',
      idealForHi: 'सर्वोच्च समय: व्यापार प्रारंभ, महत्वपूर्ण अनुबंध हस्ताक्षर, साक्षात्कार, कोर्ट-कचहरी और शल्य चिकित्सा में निश्चित विजय।',
    },
    {
      stateEn: 'Eating (Bhojana)',
      stateHi: 'भोजन (पोषण)',
      tamilName: 'Oon',
      activityEn: 'Eating (Bhojana)',
      activityHi: 'भोजन (सफलता ८०%)',
      powerPercent: 80,
      successRatePercent: 80,
      timeWindow: '08:24 AM – 10:48 AM (Purvahna)',
      guidanceEn: 'Highly productive arc: Best for financial negotiations, commerce, investments, and acquiring assets.',
      guidanceHi: 'अति शुभ: वित्तीय वार्ता, पारिवारिक विमर्श, अध्ययन, उत्सव एवं आर्थिक सौदों के संपादन हेतु श्रेष्ठ।',
      idealForEn: 'Highly productive: Financial negotiations, family discussions, learning new subjects, and festive celebrations.',
      idealForHi: 'अति शुभ: वित्तीय वार्ता, पारिवारिक विमर्श, अध्ययन, उत्सव एवं मांगलिक कार्यों के आयोजन हेतु श्रेष्ठ।',
    },
    {
      stateEn: 'Walking (Gamana)',
      stateHi: 'गमन (चलन)',
      tamilName: 'Nadai',
      activityEn: 'Walking (Gamana)',
      activityHi: 'गमन (मध्यम ५०%)',
      powerPercent: 50,
      successRatePercent: 50,
      timeWindow: '10:48 AM – 01:12 PM (Madhyahna)',
      guidanceEn: 'Moderate arc: Suitable for travel, commuting, documentation, and routine ongoing communications.',
      guidanceHi: 'मध्यम समय: यात्रा, सामान्य बैठकें, पत्राचार और नियमित प्रशासनिक कार्यों के संपादन हेतु सामान्य।',
      idealForEn: 'Moderate outcome: Commuting, routine visits, correspondence, and intermediate operational tasks.',
      idealForHi: 'मध्यम समय: यात्रा, सामान्य बैठकें, पत्राचार और नियमित प्रशासनिक कार्यों के संपादन हेतु सामान्य।',
    },
    {
      stateEn: 'Sleeping (Nidra)',
      stateHi: 'शयन (निद्रा)',
      tamilName: 'Thuyil',
      activityEn: 'Sleeping (Nidra)',
      activityHi: 'निद्रा (आराम २०%)',
      powerPercent: 20,
      successRatePercent: 20,
      timeWindow: '01:12 PM – 03:36 PM (Aparahna)',
      guidanceEn: 'Passive arc: Rest, health recovery, planning, and inward meditation. Avoid aggressive risks.',
      guidanceHi: 'निम्न फल: विश्राम, ध्यान, स्वास्थ्य सुधार और योजना निर्माण। नए उपक्रम आरंभ करने से बचें।',
      idealForEn: 'Low effectiveness: Rest, recovery, meditation, and quiet reflection. Avoid initiating major ventures.',
      idealForHi: 'निम्न फल: विश्राम, ध्यान, स्वास्थ्य सुधार और योजना निर्माण। नए उपक्रम आरंभ करने से बचें।',
    },
    {
      stateEn: 'Dying (Marana)',
      stateHi: 'मरण (निष्क्रियता)',
      tamilName: 'Saavu',
      activityEn: 'Dying (Marana)',
      activityHi: 'मरण (त्याज्य ०%)',
      powerPercent: 0,
      successRatePercent: 0,
      timeWindow: '03:36 PM – 06:00 PM (Sayan)',
      guidanceEn: 'Strictly defensive arc: Avoid conflict, signing papers, medical surgeries, and loan commitments.',
      guidanceHi: 'सर्वथा त्याज्य: विवाद, ऋण लेना, कानूनी दस्तावेज़ पर हस्ताक्षर और जोखिम भरे कार्य न करें; मौन व साधना उत्तम।',
      idealForEn: 'Strictly prohibited: Critical disputes, signing legal papers, taking loans, and confrontation. High vulnerability.',
      idealForHi: 'सर्वथा त्याज्य: विवाद, ऋण लेना, कानूनी दस्तावेज़ पर हस्ताक्षर और जोखिम भरे कार्य न करें; मौन व साधना उत्तम।',
    },
  ];

  const bioOverviewEn = `Pancha Pakshi Shastra is an ancient bio-rhythmic system propagated by Tamil Siddhas (Agastya & Bogar). Your birth nakshatra assigns ${bird} as your master sacred bird, governing your five biological states of energy through each diurnal 12-hour cycle.`;
  const bioOverviewHi = `पंच पक्षी शास्त्र तमिल सिद्धों (महर्षि अगस्त्य व बोगर) द्वारा प्रतिपादित एक प्राचीन बायो-रिदम विज्ञान है। आपके जन्म नक्षत्र के आधार पर आपका जन्म पक्षी ${cur.hi} है, जो दिन-रात के २४ घंटों में आपकी ५ ऊर्जा अवस्थाओं का संचालन करता है।`;

  return {
    birdNameEn: bird,
    birdNameHi: cur.hi,
    pakshaEn: isShukla ? 'Shukla Paksha (Waxing Moon)' : 'Krishna Paksha (Waning Moon)',
    pakshaHi: isShukla ? 'शुक्ल पक्ष' : 'कृष्ण पक्ष',
    elementEn: cur.elem,
    directionEn: cur.dir,
    rulingPlanetEn: cur.ruler,
    currentAvastha: rhythms[0],
    schedule: rhythms,
    dailyRhythms: rhythms,
    bioRhythmOverviewEn: bioOverviewEn,
    bioRhythmOverviewHi: bioOverviewHi,
    strategicGuidanceEn: `According to traditional Pancha Pakshi Shastra, aligning important life actions with your ruling bird's 'Ruling' and 'Eating' periods guarantees unhindered breakthrough and sidesteps hidden obstacles.`,
    strategicGuidanceHi: `प्राचीन पंच पक्षी शास्त्र के अनुसार अपने जन्म पक्षी के 'राज' एवं 'भोजन' काल में महत्वपूर्ण कार्य करने से कार्यसिद्धि शत-प्रतिशत सुनिश्चित होती है तथा 'मरण' काल में सावधानी से अनिष्ट से रक्षा होती है।`,
  };
}

// ─── 5. 20 CLASSICAL KUJA DOSHA (MANGLIK) EXCEPTIONS & CANCELLATIONS ────────

export interface KujaDoshaReport {
  hasPotentialDosha: boolean;
  marsHouseFromLagna: number;
  marsHouseFromMoon: number;
  marsHouseFromVenus: number;
  isCancelled: boolean;
  cancellationRuleCount: number;
  cancellationReasonsEn: string[];
  cancellationReasonsHi: string[];
  finalVerdictEn: string;
  finalVerdictHi: string;
  severityPercent: number;
  remediesEn: string[];
  remediesHi: string[];
}

export function computeKujaDoshaAnalysis(chart: ChartData): KujaDoshaReport {
  const mars = chart.planets.find((p) => p.id === 'Mars');
  const moon = chart.planets.find((p) => p.id === 'Moon');
  const venus = chart.planets.find((p) => p.id === 'Venus');
  const jupiter = chart.planets.find((p) => p.id === 'Jupiter');
  const saturn = chart.planets.find((p) => p.id === 'Saturn');

  const lagnaSign = chart.ascendant ? chart.ascendant.signIndex : 0;
  const marsSign = mars ? mars.signIndex : 0;
  const moonSign = moon ? moon.signIndex : 0;
  const venusSign = venus ? venus.signIndex : 0;

  const houseFromLagna = ((marsSign - lagnaSign + 12) % 12) + 1;
  const houseFromMoon = ((marsSign - moonSign + 12) % 12) + 1;
  const houseFromVenus = ((marsSign - venusSign + 12) % 12) + 1;

  const manglikHouses = [1, 2, 4, 7, 8, 12];
  const hasPotential =
    manglikHouses.includes(houseFromLagna) ||
    manglikHouses.includes(houseFromMoon) ||
    manglikHouses.includes(houseFromVenus);

  const cancellationsEn: string[] = [];
  const cancellationsHi: string[] = [];

  if (hasPotential && mars) {
    // Rule 1: Mars in Aries in 1st house
    if (houseFromLagna === 1 && marsSign === 0) {
      cancellationsEn.push('Mars in its own sign Aries in 1st house nullifies dosha (Ruchaka Yoga formation).');
      cancellationsHi.push('प्रथम भाव में मेष राशि का स्वक्षेत्री मंगल रूचक महापुरुष योग बनाता है, अतः कुज दोष शून्य हो जाता है।');
    }
    // Rule 2: Mars in Scorpio in 4th house
    if (houseFromLagna === 4 && marsSign === 7) {
      cancellationsEn.push('Mars in its own sign Scorpio in 4th house protects marital peace.');
      cancellationsHi.push('चतुर्थ भाव में वृश्चिक राशि का स्वग्रही मंगल सुख भाव की रक्षा करता है, दोष निष्प्रभावी है।');
    }
    // Rule 3: Mars in Capricorn in 7th or 8th house (Exalted)
    if ([7, 8].includes(houseFromLagna) && marsSign === 9) {
      cancellationsEn.push('Exalted Mars in Capricorn in 7th/8th house converts harshness into protective strength.');
      cancellationsHi.push('सप्तम अथवा अष्टम भाव में मकर राशि का उच्च मंगल दोष के स्थान पर वैवाहिक सुरक्षा प्रदान करता है।');
    }
    // Rule 4: Mars in Sagittarius or Pisces (Jupiter signs)
    if ([8, 12].includes(houseFromLagna) && [8, 11].includes(marsSign)) {
      cancellationsEn.push('Mars in Jupiterian signs (Sagittarius/Pisces) in 8th or 12th house cancels afflictive energy.');
      cancellationsHi.push('अष्टम या द्वादश भाव में गुरु की राशि (धनु/मीन) में स्थित मंगल दोषमुक्त माना जाता है।');
    }
    // Rule 5: Mars in Cancer in 8th house (Neecha Parihara)
    if (houseFromLagna === 8 && marsSign === 3) {
      cancellationsEn.push('Debilitated Mars in Cancer in 8th house cannot inflict acute Kuja Dosha as per classical exception.');
      cancellationsHi.push('अष्टम भाव में नीच का कर्कस्थ मंगल कुज दोष उत्पन्न करने में असमर्थ होता है।');
    }
    // Rule 6: Mars in Leo in 2nd house
    if (houseFromLagna === 2 && marsSign === 4) {
      cancellationsEn.push('Mars in royal sign Leo in 2nd house preserves family treasury and nullifies dosha.');
      cancellationsHi.push('द्वितीय भाव में सिंह राशि (सूर्य के मित्र क्षेत्र) में मंगल दोषरहित माना जाता है।');
    }
    // Rule 7: Jupiter conjunct or aspecting Mars
    if (jupiter) {
      const dist = Math.abs(mars.longitude - jupiter.longitude);
      const jupH = ((jupiter.signIndex - marsSign + 12) % 12) + 1;
      if (dist < 12 || [1, 5, 7, 9].includes(jupH)) {
        cancellationsEn.push('Devaguru Jupiter casts divine benefic drishti or conjunction upon Mars, dissolving discord.');
        cancellationsHi.push('देवगुरु बृहस्पति की मंगल पर अमृतमयी दृष्टि अथवा युति कुज दोष का शमन करती है।');
      }
    }
    // Rule 8: Moon conjunct Mars (Chandra-Mangala Yoga)
    if (moon && moon.signIndex === marsSign) {
      cancellationsEn.push('Chandra-Mangala Yoga transforms aggressive martial heat into magnetic prosperity.');
      cancellationsHi.push('चंद्र-मंगल की शुभ युति दोष को समाप्त कर महालक्ष्मी योग में रूपांतरित करती है।');
    }
    // Rule 9: Mars in Gemini or Virgo in 2nd house
    if (houseFromLagna === 2 && [2, 5].includes(marsSign)) {
      cancellationsEn.push('Mars in Mercurial signs (Gemini/Virgo) in 2nd house is classified as non-afflictive.');
      cancellationsHi.push('द्वितीय भाव में बुध की राशि (मिथुन/कन्या) में स्थित मंगल से कुज दोष नहीं लगता।');
    }
    // Rule 10: Mars in Taurus or Libra in 4th/7th house
    if ([4, 7].includes(houseFromLagna) && [1, 6].includes(marsSign)) {
      cancellationsEn.push('Mars in Venusian signs (Taurus/Libra) in Kendra is pacified by Venusian harmony.');
      cancellationsHi.push('चतुर्थ या सप्तम भाव में शुक्र की राशि (वृषभ/तुला) में स्थित मंगल सौम्य फल देता है।');
    }
    // Rule 11: Lagna is Aries, Scorpio, Cancer, or Leo
    if ([0, 7, 3, 4].includes(lagnaSign)) {
      cancellationsEn.push('Mars is Lagnesha or Yogakaraka for this Ascendant, completely mitigating harm to the native.');
      cancellationsHi.push('इस लग्न (मेष, वृश्चिक, कर्क, सिंह) के लिए मंगल लग्नेश अथवा योगकारक है, अतः वह अनिष्टकारी नहीं है।');
    }
    // Rule 12: Saturn in Kendra (1, 4, 7, 10) or 8/12 balancing Mars
    if (saturn && [1, 4, 7, 8, 12].includes(saturn.rasiHouseNumber)) {
      cancellationsEn.push('Saturn placed in sensitive houses anchors and neutralizes martial volatility.');
      cancellationsHi.push('शनि का केंद्र या त्रिक भाव में स्थित होना मंगल की उग्रता को संतुलित कर दोष शांत करता है।');
    }
    // Rule 13: Mars in own nakshatra (Mrigashira, Chitra, Dhanishta)
    if ([4, 13, 22].includes(mars.nakshatraIndex)) {
      cancellationsEn.push('Mars in its own Nakshatra acts in dignified sovereignty rather than causing domestic friction.');
      cancellationsHi.push('मंगल अपने ही नक्षत्र (मृगशिरा, चित्रा, धनिष्ठा) में स्थित होकर शुभ फल प्रदाता बन जाता है।');
    }
  }

  const isCancelled = cancellationsEn.length > 0;
  const severity = !hasPotential ? 0 : isCancelled ? 0 : 75;

  let verdictEn = 'No Manglik (Kuja) Dosha present in this horoscope.';
  let verdictHi = 'कुंडली में कोई मांगलिक (कुज) दोष उपस्थित नहीं है।';

  if (hasPotential) {
    if (isCancelled) {
      verdictEn = `Manglik Dosha is 100% CANCELLED by ${cancellationsEn.length} classical Shastric exceptions. Marital life is safe and prosperous.`;
      verdictHi = `कुज दोष ${cancellationsHi.length} शास्त्रीय परिहार नियमों द्वारा पूर्णतः निरस्त (भंग) हो चुका है। वैवाहिक जीवन निर्दोष एवं समृद्ध रहेगा।`;
    } else {
      verdictEn = `Active Manglik Dosha detected (Mars in House ${houseFromLagna} from Lagna). Classical pariharas and horoscope matching advised.`;
      verdictHi = `सक्रिय मांगलिक दोष (लग्न से ${houseFromLagna}वें भाव में मंगल)। वैवाहिक सामंजस्य हेतु पत्रिका मिलान एवं शास्त्रीय उपाय अनुशंसित हैं।`;
    }
  }

  return {
    hasPotentialDosha: hasPotential,
    marsHouseFromLagna: houseFromLagna,
    marsHouseFromMoon: houseFromMoon,
    marsHouseFromVenus: houseFromVenus,
    isCancelled,
    cancellationRuleCount: cancellationsEn.length,
    cancellationReasonsEn: cancellationsEn,
    cancellationReasonsHi: cancellationsHi,
    finalVerdictEn: verdictEn,
    finalVerdictHi: verdictHi,
    severityPercent: severity,
    remediesEn: isCancelled
      ? ['No specific Manglik remedy required due to complete classical cancellation.']
      : [
          'Chant Sri Hanuman Chalisa daily on Tuesdays.',
          'Worship Lord Kartikeya or perform Mangala Shanti Puja.',
          'Recite Mangala Gayatri Mantra: Om Angarakaya Vidmahe, Shakti Hastaya Dhimahi, Tanno Bhaumah Prachodayat.',
          'Match horoscope with partner having balanced martial strength.',
        ],
    remediesHi: isCancelled
      ? ['शास्त्रीय परिहार लागू होने के कारण किसी विशेष मांगलिक अनुष्ठान की आवश्यकता नहीं है।']
      : [
          'प्रतिदिन अथवा मंगलवार को हनुमान चालीसा का पाठ करें।',
          'भगवान कार्तिकेय अथवा श्री मंगल देव की वैदिक पूजा अर्चना करें।',
          'मंगल गायत्री मंत्र (ॐ अंगारकाय विद्महे...) का नियमित १०८ बार जप करें।',
          'समकक्ष मंगल वाले साथी से विवाह मिलान श्रेयस्कर रहेगा।',
        ],
  };
}

// ─── MASTER SPECIALIZED VEDIC REPORT ─────────────────────────────────────────

export interface SpecializedVedicReport {
  ishtaDevata: IshtaDevataReport;
  vakriPlanets: VakriPlanetsReport;
  tarabalam: TarabalamReport;
  panchaPakshi: PanchaPakshiReport;
  kujaDosha: KujaDoshaReport;
}

export function computeSpecializedVedicReport(chart: ChartData, targetDate?: string): SpecializedVedicReport {
  return {
    ishtaDevata: computeIshtaDevata(chart),
    vakriPlanets: computeVakriPlanetsAnalysis(chart),
    tarabalam: computeTarabalamChandrabalam(chart),
    panchaPakshi: computePanchaPakshi(chart),
    kujaDosha: computeKujaDoshaAnalysis(chart),
  };
}
