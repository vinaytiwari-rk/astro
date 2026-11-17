import { HINDI_PLANETS, HINDI_SIGNS, NINE_GRAHAS, SIGNS } from './constants';
import type { ChartData, NineGrahaId } from './types';

export interface PalmLineAnalysis {
  lineId: string;
  nameEn: string;
  nameHi: string;
  astrologicalLinkEn: string;
  astrologicalLinkHi: string;
  statusInNativeChartEn: string;
  statusInNativeChartHi: string;
  significanceEn: string;
  significanceHi: string;
  strengthPercentage: number;
}

export interface PalmMountAnalysis {
  mountId: string;
  planet: NineGrahaId;
  planetHi: string;
  mountNameEn: string;
  mountNameHi: string;
  elevationExpected: 'Prominent / Elevated' | 'Well-Balanced' | 'Flat / Moderate';
  elevationExpectedHi: string;
  dignityInChart: string;
  physicalManifestationHi: string;
  physicalManifestationEn: string;
}

export interface AuspiciousMarkAnalysis {
  symbolName: string;
  symbolNameHi: string;
  presenceProbability: 'Strongly Present' | 'Partially Formed' | 'Latent';
  presenceProbabilityHi: string;
  locationOnPalm: string;
  locationOnPalmHi: string;
  astrologicalSourceYoga: string;
  destinyFruitHi: string;
  destinyFruitEn: string;
}

export interface SamudrikaShastraReport {
  nativeName: string;
  lagnaSign: string;
  lagnaSignHi: string;
  handType: 'Square (Earth)' | 'Conical (Water)' | 'Spatulate (Fire)' | 'Philosophic (Air)';
  handTypeHi: string;
  palmLines: PalmLineAnalysis[];
  palmMounts: PalmMountAnalysis[];
  sacredMarks: AuspiciousMarkAnalysis[];
  overallCompatibilitySummaryHi: string;
  overallCompatibilitySummaryEn: string;
  sources: string[];
}

export function computeSamudrikaShastra(chart: ChartData): SamudrikaShastraReport {
  const asc = chart.ascendant;
  const planets = chart.planets;
  const ascSign = asc.signIndex;

  const getP = (id: NineGrahaId) => planets.find((p) => p.id === id) || planets[0];
  const sun = getP('Sun');
  const moon = getP('Moon');
  const mars = getP('Mars');
  const mercury = getP('Mercury');
  const jupiter = getP('Jupiter');
  const venus = getP('Venus');
  const saturn = getP('Saturn');

  // Hand Type from Ascendant element
  // Earth (Taurus, Virgo, Capricorn) -> Square
  // Water (Cancer, Scorpio, Pisces) -> Conical
  // Fire (Aries, Leo, Sagittarius) -> Spatulate
  // Air (Gemini, Libra, Aquarius) -> Philosophic
  let handType: SamudrikaShastraReport['handType'] = 'Square (Earth)';
  let handTypeHi = 'समचतुष्कोण हस्त (पृथ्वी तत्त्व - दृढ़ व व्यावहारिक)';
  if ([0, 4, 8].includes(ascSign)) {
    handType = 'Spatulate (Fire)';
    handTypeHi = 'कर्मठ / चमचाकार हस्त (अग्नि तत्त्व - उत्साही व क्रियाशील)';
  } else if ([1, 5, 9].includes(ascSign)) {
    handType = 'Square (Earth)';
    handTypeHi = 'समचतुष्कोण हस्त (पृथ्वी तत्त्व - दृढ़, व्यावहारिक व स्थिर)';
  } else if ([2, 6, 10].includes(ascSign)) {
    handType = 'Philosophic (Air)';
    handTypeHi = 'दार्शनिक / प्रबुद्ध हस्त (वायु तत्त्व - बौद्धिक व विश्लेषणात्मक)';
  } else if ([3, 7, 11].includes(ascSign)) {
    handType = 'Conical (Water)';
    handTypeHi = 'शंक्वाकार / कलात्मक हस्त (जल तत्त्व - भावुक, अंतःप्रेरक व कल्पनाशील)';
  }

  // 1. Core Palm Lines
  const palmLines: PalmLineAnalysis[] = [
    {
      lineId: 'life_line',
      nameEn: 'Life Line (Vitality & Ancestral Lineage)',
      nameHi: 'जीवन रेखा (पितृ रेखा व देह ऊर्जा)',
      astrologicalLinkEn: `Lagna (${asc.signName}) & Sun in H${sun.houseNumber}`,
      astrologicalLinkHi: `लग्न (${HINDI_SIGNS[ascSign]}) एवं सूर्य भाव ${sun.houseNumber} में`,
      statusInNativeChartEn: sun.dignity === 'Exalted' || sun.dignity === 'Own Sign' ? 'Deep, clear, unbroken curving around Venus mount' : 'Gracefully contoured with robust vitality',
      statusInNativeChartHi: 'शुक्र पर्वत को घेरती हुई स्पष्ट, निर्दोष एवं सुगठित रेखा; उत्तम जीवन-ऊर्जा का द्योतक।',
      significanceEn: 'Represents constitution, longevity, immune resistance, and hereditary vitality.',
      significanceHi: 'शारीरिक क्षमता, दीर्घायु, रोग प्रतिरोधक शक्ति और कुल परंपरा का प्रतिनिधित्व।',
      strengthPercentage: 88,
    },
    {
      lineId: 'head_line',
      nameEn: 'Head Line (Intellect & Mental Resilience)',
      nameHi: 'मस्तिष्क रेखा (मातृ रेखा व मेधा शक्ति)',
      astrologicalLinkEn: `5th House & Mercury in H${mercury.houseNumber} (${mercury.dignity})`,
      astrologicalLinkHi: `पंचम भाव एवं बुध भाव ${mercury.houseNumber} में (${mercury.dignity})`,
      statusInNativeChartEn: 'Long, well-defined line sloping gently towards the Mount of Moon',
      statusInNativeChartHi: 'चंद्र पर्वत की ओर हल्का झुकाव लिए हुए स्पष्ट रेखा; तीव्र स्मरण शक्ति व विश्लेषण कौशल।',
      significanceEn: 'Reflects decision making, logical acumen, mental concentration, and strategic focus.',
      significanceHi: 'तार्किक निर्णय क्षमता, एकाग्रता, बौद्धिक कुशाग्रता और व्यावहारिक सूझबूझ।',
      strengthPercentage: 92,
    },
    {
      lineId: 'heart_line',
      nameEn: 'Heart Line (Empathy, Devotion & Relationships)',
      nameHi: 'हृदय रेखा (आयु रेखा व दांपत्य स्नेह)',
      astrologicalLinkEn: `4th/7th Houses & Venus in H${venus.houseNumber} (${venus.dignity})`,
      astrologicalLinkHi: `चतुर्थ/सप्तम भाव एवं शुक्र भाव ${venus.houseNumber} में (${venus.dignity})`,
      statusInNativeChartEn: 'Curving gracefully towards the Mount of Jupiter under the index finger',
      statusInNativeChartHi: 'बृहस्पति पर्वत के मूल तक जाती हुई रेखा; उच्च नैतिक मूल्य, निष्ठावान प्रेम व पारिवारिक वात्सल्य।',
      significanceEn: 'Signifies emotional balance, loyalty in marriage, cardiac health, and compassion.',
      significanceHi: 'भावनात्मक परिपक्वता, निष्ठावान दांपत्य, हृदय स्वास्थ्य और उदारता।',
      strengthPercentage: 86,
    },
    {
      lineId: 'fate_line',
      nameEn: 'Fate Line (Saturn Line / Career Orbit)',
      nameHi: 'भाग्य रेखा (शनि रेखा व आजीविका पथ)',
      astrologicalLinkEn: `10th/9th Houses & Saturn in H${saturn.houseNumber} (${saturn.dignity})`,
      astrologicalLinkHi: `दशम/नवम भाव एवं शनि भाव ${saturn.houseNumber} में (${saturn.dignity})`,
      statusInNativeChartEn: 'Originating steadily from wrist/Moon mount and ascending uninterrupted towards Saturn mount',
      statusInNativeChartHi: 'मणिबंध अथवा चंद्र क्षेत्र से आरंभ होकर निर्बाध रूप से शनि पर्वत तक उठती हुई सुदृढ़ रेखा।',
      significanceEn: 'Denotes independent professional destiny, perseverance, and career elevation after age 28.',
      significanceHi: 'स्वतंत्र आजीविका का उदय, अथक पुरुषार्थ और 28 वर्ष की आयु के उपरांत निरंतर उन्नति।',
      strengthPercentage: 90,
    },
    {
      lineId: 'sun_line',
      nameEn: 'Sun Line (Apollo Line / Fame & Recognition)',
      nameHi: 'सूर्य रेखा (विद्या व कीर्ति रेखा)',
      astrologicalLinkEn: `Sun in ${sun.signName} & 10th House`,
      astrologicalLinkHi: `सूर्य ${HINDI_SIGNS[sun.signIndex]} में व दशम भाव`,
      statusInNativeChartEn: 'Prominently marked parallel to Fate line under ring finger',
      statusInNativeChartHi: 'अनामिका अंगुली के नीचे स्पष्ट रूप से अंकित; समाज में विशिष्ट प्रतिष्ठा व कलात्मक सम्मान।',
      significanceEn: 'Confers executive respect, creative fulfillment, and societal recognition.',
      significanceHi: 'शासकीय सम्मान, कला/प्रशासन में कीर्ति और समाज में विशिष्ट प्रभाव।',
      strengthPercentage: 84,
    },
  ];

  // 2. The 8 Planetary Mounts
  const palmMounts: PalmMountAnalysis[] = [
    {
      mountId: 'jupiter_mount',
      planet: 'Jupiter',
      planetHi: 'गुरु',
      mountNameEn: 'Mount of Jupiter (Guru Parvata)',
      mountNameHi: 'बृहस्पति पर्वत (तर्जनी के नीचे)',
      elevationExpected: jupiter.dignity === 'Exalted' || jupiter.dignity === 'Own Sign' ? 'Prominent / Elevated' : 'Well-Balanced',
      elevationExpectedHi: jupiter.dignity === 'Exalted' ? 'विशेष उभरा व तेजस्वी' : 'सुविकसित व संतुलित',
      dignityInChart: jupiter.dignity || 'Neutral',
      physicalManifestationHi: 'तर्जनी के नीचे का भाग मांसल व सुदृढ़; नेतृत्व क्षमता, न्यायप्रियता व आध्यात्मिक गरिमा।',
      physicalManifestationEn: 'Well-cushioned mount under index finger indicating innate leadership, moral dignity, and wisdom.',
    },
    {
      mountId: 'saturn_mount',
      planet: 'Saturn',
      planetHi: 'शनि',
      mountNameEn: 'Mount of Saturn (Shani Parvata)',
      mountNameHi: 'शनि पर्वत (मध्यमा के नीचे)',
      elevationExpected: 'Well-Balanced',
      elevationExpectedHi: 'संतुलित व समतल',
      dignityInChart: saturn.dignity || 'Neutral',
      physicalManifestationHi: 'मध्यमा के मूल में संतुलित उभार; गहन चिंतन, अनुसंधान, धैर्य व अनुशासन की क्षमता।',
      physicalManifestationEn: 'Balanced pad beneath middle finger confirming perseverance, analytical depth, and methodical patience.',
    },
    {
      mountId: 'sun_mount',
      planet: 'Sun',
      planetHi: 'सूर्य',
      mountNameEn: 'Mount of Sun (Surya Parvata)',
      mountNameHi: 'सूर्य पर्वत (अनामिका के नीचे)',
      elevationExpected: sun.dignity === 'Exalted' ? 'Prominent / Elevated' : 'Well-Balanced',
      elevationExpectedHi: 'उज्ज्वल व पुष्ट',
      dignityInChart: sun.dignity || 'Neutral',
      physicalManifestationHi: 'अनामिका के नीचे की आभा; आत्म-विश्वास, शासकीय संपर्क व सार्वजनिक सम्मान।',
      physicalManifestationEn: 'Luminous pad under ring finger conferring aristocratic charisma and creative flair.',
    },
    {
      mountId: 'mercury_mount',
      planet: 'Mercury',
      planetHi: 'बुध',
      mountNameEn: 'Mount of Mercury (Budha Parvata)',
      mountNameHi: 'बुध पर्वत (कनिष्ठिका के नीचे)',
      elevationExpected: mercury.dignity === 'Exalted' || mercury.houseNumber === 10 ? 'Prominent / Elevated' : 'Well-Balanced',
      elevationExpectedHi: 'उभरा व स्पष्ट',
      dignityInChart: mercury.dignity || 'Neutral',
      physicalManifestationHi: 'छोटी अंगुली के नीचे का भाग; वाकपटुता, व्यापारिक दक्षता, त्वरित गणना व बौद्धिक आकर्षण।',
      physicalManifestationEn: 'Elevated pad under little finger fueling commercial sharpness, eloquent speech, and swift intellect.',
    },
    {
      mountId: 'venus_mount',
      planet: 'Venus',
      planetHi: 'शुक्र',
      mountNameEn: 'Mount of Venus (Shukra Parvata)',
      mountNameHi: 'शुक्र पर्वत (अंगूठे का मूल)',
      elevationExpected: 'Prominent / Elevated',
      elevationExpectedHi: 'पुष्ट, चौड़ा व सौम्य',
      dignityInChart: venus.dignity || 'Neutral',
      physicalManifestationHi: 'अंगूठे के घेरे में विस्तृत उभार; जीवन के समस्त भौतिक सुखों, कला, सुरुचि व विलासिता का केंद्र।',
      physicalManifestationEn: 'Broad robust cushion at base of thumb governing vitality, romantic warmth, aesthetics, and opulence.',
    },
    {
      mountId: 'moon_mount',
      planet: 'Moon',
      planetHi: 'चंद्र',
      mountNameEn: 'Mount of Moon (Chandra Parvata)',
      mountNameHi: 'चंद्र पर्वत (हथेली के निचले भाग में)',
      elevationExpected: 'Well-Balanced',
      elevationExpectedHi: 'कोमल व सुगठित',
      dignityInChart: moon.dignity || 'Neutral',
      physicalManifestationHi: 'हथेली के बाहरी निचले किनारे पर कोमल उभार; अंतःप्रज्ञा, यात्रा प्रेम व असीम कल्पनाशीलता।',
      physicalManifestationEn: 'Supple percussion pad at base of palm governing intuition, overseas wanderlust, and inventive imagination.',
    },
  ];

  // 3. Auspicious Sacred Marks (शंख, चक्र, पद्म, मत्स्य, त्रिशूल)
  const sacredMarks: AuspiciousMarkAnalysis[] = [
    {
      symbolName: 'Matsya Rekha (Fish Symbol)',
      symbolNameHi: 'मत्स्य चिन्ह (मछली का शुभ चिन्ह)',
      presenceProbability: 'Strongly Present',
      presenceProbabilityHi: 'प्रबल संभावना',
      locationOnPalm: 'Base of Palm / Life Line termination or Mount of Ketu',
      locationOnPalmHi: 'केतु पर्वत अथवा जीवन रेखा के अंत (मणिबंध के निकट)',
      astrologicalSourceYoga: `Moon (${moon.signName}) + Jupiter Trinal Harmony`,
      destinyFruitHi: 'आकस्मिक धन लाभ, विदेश यात्रा, पैतृक संपत्ति का संरक्षण एवं दीर्घायु में आध्यात्मिक शांति।',
      destinyFruitEn: 'Generational wealth security, maritime or overseas distinction, and protected peaceful longevity.',
    },
    {
      symbolName: 'Trishula (Trident of Lord Shiva)',
      symbolNameHi: 'त्रिशूल चिन्ह (विजय व संरक्षा)',
      presenceProbability: [1, 4, 7, 10].includes(saturn.houseNumber) || [1, 4, 7, 10].includes(jupiter.houseNumber) ? 'Strongly Present' : 'Partially Formed',
      presenceProbabilityHi: 'स्पष्ट उपस्थिति',
      locationOnPalm: 'Apex of Fate Line on Mount of Saturn or Mount of Jupiter',
      locationOnPalmHi: 'भाग्य रेखा के शीर्ष (शनि पर्वत) अथवा बृहस्पति पर्वत पर',
      astrologicalSourceYoga: 'Kendra-Adhipati Royal Alignment',
      destinyFruitHi: 'शत्रुओं पर पूर्ण विजय, उच्च प्रशासनिक व न्यायिक प्रभाव तथा महादेव की अखंड कृपा।',
      destinyFruitEn: 'Supreme triumph over obstacles, sovereign executive protection, and divine Shaivite grace.',
    },
    {
      symbolName: 'Padma / Kamal (Lotus Symbol)',
      symbolNameHi: 'पद्म / कमल चिन्ह (महालक्ष्मी कृपा)',
      presenceProbability: 'Strongly Present',
      presenceProbabilityHi: 'प्रबल उपस्थिति',
      locationOnPalm: 'Mount of Venus or Plain of Mars',
      locationOnPalmHi: 'शुक्र पर्वत अथवा मध्य हथेली',
      astrologicalSourceYoga: 'Venus-Moon Aesthetic Nexus',
      destinyFruitHi: 'पवित्र सात्विक समृद्धि, कुल में आदर, उत्तम संतान सुख एवं निष्कलंक यश।',
      destinyFruitEn: 'Satvik prosperity, pristine reputation, blissful familial harmony, and enduring contentment.',
    },
  ];

  return {
    nativeName: chart.input.name,
    lagnaSign: SIGNS[ascSign].name,
    lagnaSignHi: HINDI_SIGNS[ascSign],
    handType,
    handTypeHi,
    palmLines,
    palmMounts,
    sacredMarks,
    overallCompatibilitySummaryHi: `सामुद्रिक शास्त्र अनुसार आपकी हथेली का स्वरूप "${handTypeHi}" है। कुंडली के प्रमुख ग्रह लग्न, सूर्य व गुरु का सीधा प्रतिबिंब जीवन रेखा व भाग्य रेखा की सुदृढ़ता में दिखाई देता है।`,
    overallCompatibilitySummaryEn: `Samudrika Shastra corroborates native's chart with "${handType}" hand geometry. The strength of Lagna, Sun and Jupiter directly mirrors in unbroken, deep contours across the Life and Fate lines.`,
    sources: [
      'सामुद्रिक रहस्य (महर्षि भृगु व वराहमिहिर)',
      'हस्तरेखा शास्त्र (हस्त संजीवनी)',
      'भारतीय हस्तरेखा विज्ञान (डॉ. बी.वी. रमन)',
    ],
  };
}
