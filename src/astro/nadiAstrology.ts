import { NINE_GRAHAS, SIGNS, NAKSHATRAS } from './constants';
import type { ChartData, NineGrahaId } from './types';
import { normalizeDeg } from './time';

export interface AgastyaKandamResult {
  kandamNumber: number; // 1..14
  nameEn: string;
  nameHi: string;
  themeEn: string;
  themeHi: string;
  verdictEn: string;
  verdictHi: string;
  rulingPlanets: NineGrahaId[];
  isFortunate: boolean;
}

export interface KaushikTapasReading {
  trialThemeEn: string;
  trialThemeHi: string;
  breakthroughAge: number;
  elevationEn: string;
  elevationHi: string;
}

export interface ShivaNadiDialogue {
  divineDecreeEn: string;
  divineDecreeHi: string;
  karmaClassification: 'Sanchita' | 'Prarabdha' | 'Kriyamana' | 'Agami';
  karmaClassificationHi: string;
  recommendedJyotirlingaEn: string;
  recommendedJyotirlingaHi: string;
  shivaPariharaEn: string;
  shivaPariharaHi: string;
}

export interface NandiTrineLink {
  direction: 'East (Dharma 1-5-9)' | 'South (Artha 2-6-10)' | 'West (Kama 3-7-11)' | 'North (Moksha 4-8-12)';
  directionHi: string;
  element: string;
  planets: NineGrahaId[];
  dynamicInteractionEn: string;
  dynamicInteractionHi: string;
}

export interface JeevaNadiSynthesis {
  jeevaPlanet: NineGrahaId; // Jupiter
  jeevaPlacementEn: string;
  jeevaPlacementHi: string;
  karmaPlanet: NineGrahaId; // Saturn
  karmaPlacementEn: string;
  karmaPlacementHi: string;
  jeevaKarmaLinkEn: string;
  jeevaKarmaLinkHi: string;
  currentAgeActivationEn: string;
  currentAgeActivationHi: string;
}

export interface FullNadiReport {
  agastyaKandams: AgastyaKandamResult[];
  kaushikTapas: KaushikTapasReading;
  shivaNadi: ShivaNadiDialogue;
  nandiTrines: NandiTrineLink[];
  jeevaSynthesis: JeevaNadiSynthesis;
  bhriguBinduDegree: number;
  bhriguBinduSignEn: string;
  bhriguBinduSignHi: string;
  bcpActiveHouse: number;
}

const PLANET_HI: Record<NineGrahaId, string> = {
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

const SIGN_HI = [
  'मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या',
  'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुंभ', 'मीन',
];

export function computeComprehensiveNadiReport(chart: ChartData): FullNadiReport {
  const sun = chart.planets.find((p) => p.id === 'Sun') || chart.planets[0];
  const moon = chart.planets.find((p) => p.id === 'Moon') || chart.planets[1];
  const mars = chart.planets.find((p) => p.id === 'Mars') || chart.planets[2];
  const mercury = chart.planets.find((p) => p.id === 'Mercury') || chart.planets[3];
  const jupiter = chart.planets.find((p) => p.id === 'Jupiter') || chart.planets[4];
  const venus = chart.planets.find((p) => p.id === 'Venus') || chart.planets[5];
  const saturn = chart.planets.find((p) => p.id === 'Saturn') || chart.planets[6];
  const rahu = chart.planets.find((p) => p.id === 'Rahu') || chart.planets[7];
  const ketu = chart.planets.find((p) => p.id === 'Ketu') || chart.planets[8];

  const ascSign = chart.ascendant.signIndex;

  // 1. AGASTYA NADI 14 KANDAMS
  const KANDAM_TEMPLATES: Array<{
    num: number;
    nameEn: string;
    nameHi: string;
    house: number;
    primaryLord: NineGrahaId;
  }> = [
    { num: 1, nameEn: 'Podhu Kandam (General Life & Soul Identity)', nameHi: 'पोदु काण्डम् (सामान्य जीवन व मूल स्वभाव)', house: 1, primaryLord: 'Sun' },
    { num: 2, nameEn: 'Kudumba / Dhana Kandam (Family, Wealth & Speech)', nameHi: 'कुडुम्ब / धन काण्डम् (कुटुंब, धन व वाणी)', house: 2, primaryLord: 'Jupiter' },
    { num: 3, nameEn: 'Sagodhira Kandam (Siblings, Courage & Initiative)', nameHi: 'सगोदिर काण्डम् (भाई-बहन, पराक्रम व उद्यम)', house: 3, primaryLord: 'Mars' },
    { num: 4, nameEn: 'Mathur Kandam (Mother, Real Estate, Vehicles & Peace)', nameHi: 'माथुर काण्डम् (माता, भूमि-भवन, वाहन व सुख)', house: 4, primaryLord: 'Moon' },
    { num: 5, nameEn: 'Puthra Kandam (Progeny, Wisdom & Purva Punya)', nameHi: 'पुत्र काण्डम् (संतान, पूर्व पुण्य व मेधा)', house: 5, primaryLord: 'Jupiter' },
    { num: 6, nameEn: 'Sathru / Roga Kandam (Litigation, Health & Debts)', nameHi: 'शत्रु / रोग काण्डम् (शत्रु, रोग व ऋण निवारण)', house: 6, primaryLord: 'Mars' },
    { num: 7, nameEn: 'Kalathra Kandam (Spouse, Marriage Timing & Sanctity)', nameHi: 'कलत्र काण्डम् (जीवनसाथी, विवाह काल व दांपत्य)', house: 7, primaryLord: 'Venus' },
    { num: 8, nameEn: 'Ayur Kandam (Longevity & Critical Danger Averted)', nameHi: 'आयुर् काण्डम् (दीर्घायु व संकट रक्षा)', house: 8, primaryLord: 'Saturn' },
    { num: 9, nameEn: 'Thanthai / Bhagya Kandam (Father, Fortune & Divine Grace)', nameHi: 'थांथाई / भाग्य काण्डम् (पिता, भाग्य व ईश्वरीय कृपा)', house: 9, primaryLord: 'Jupiter' },
    { num: 10, nameEn: 'Thozhil Kandam (Profession, Career Zenith & Stature)', nameHi: 'तोलिल काण्डम् (कर्म, व्यवसाय व पद-प्रतिष्ठा)', house: 10, primaryLord: 'Saturn' },
    { num: 11, nameEn: 'Labha Kandam (Gains, Fulfillment of Wishes & Networks)', nameHi: 'लाभ काण्डम् (आय, मनोकामना पूर्ति व मित्र सहयोग)', house: 11, primaryLord: 'Mercury' },
    { num: 12, nameEn: 'Vraya Kandam (Expenditure, Foreign Realms & Release)', nameHi: 'व्यय काण्डम् (व्यय, विदेश यात्रा व मोक्ष)', house: 12, primaryLord: 'Ketu' },
    { num: 13, nameEn: 'Shanti / Parihara Kandam (Karmic Neutralization & Seva)', nameHi: 'शांति / परिहार काण्डम् (पूर्व ऋण शांति व देव आराधना)', house: 1, primaryLord: 'Jupiter' },
    { num: 14, nameEn: 'Deeksha Kandam (Spiritual Initiation & Mantra Siddhi)', nameHi: 'दीक्षा काण्डम् (मंत्र दीक्षा व आत्म-ज्ञान)', house: 9, primaryLord: 'Sun' },
  ];

  const agastyaKandams: AgastyaKandamResult[] = KANDAM_TEMPLATES.map((tmpl) => {
    const hSign = (ascSign + tmpl.house - 1) % 12;
    const hLord = SIGNS[hSign].lord;
    const occ = chart.planets.filter((p) => p.rasiHouseNumber === tmpl.house);
    const hasBenefic = occ.some((p) => ['Jupiter', 'Venus', 'Mercury', 'Moon'].includes(p.id));
    const isGood = hasBenefic || ['Own Sign', 'Exalted', 'Moolatrikona'].includes(chart.planets.find((p) => p.id === hLord)?.dignity || 'Neutral');

    let verdictEn = `House ${tmpl.house} (${SIGNS[hSign].name}) ruled by ${hLord}. ${occ.length ? `Planets seated: ${occ.map((p) => p.id).join(', ')}. ` : ''}Agastya leaves record: `;
    let verdictHi = `भाव ${tmpl.house} (${SIGN_HI[hSign]}) स्वामी ${PLANET_HI[hLord]}। ${occ.length ? `स्थित ग्रह: ${occ.map((p) => PLANET_HI[p.id as NineGrahaId]).join(', ')}। ` : ''}अगस्त्य नाड़ी सूत्र: `;

    if (isGood) {
      verdictEn += `Karmic merits yield flourishing growth, steady protection and high dignity in ${tmpl.nameEn.split('(')[1]?.replace(')', '') || 'this domain'}.`;
      verdictHi += `पूर्व जन्म के संचित शुभ संस्कारों से इस क्षेत्र में निरंतर वृद्धि, यश, सहयोग व सुरक्षा की प्राप्ति होती है।`;
    } else {
      verdictEn += `Requires patience and dedicated charity during middle years to dissolve hereditary constraints.`;
      verdictHi += `मध्यम आयु में विशेष धैर्य, नियम व निष्काम सेवा द्वारा प्रारब्ध के अवरोधों का शमन करना श्रेयस्कर है।`;
    }

    return {
      kandamNumber: tmpl.num,
      nameEn: tmpl.nameEn,
      nameHi: tmpl.nameHi,
      themeEn: tmpl.nameEn.split('(')[1]?.replace(')', '') || tmpl.nameEn,
      themeHi: tmpl.nameHi.split('(')[1]?.replace(')', '') || tmpl.nameHi,
      verdictEn,
      verdictHi,
      rulingPlanets: [hLord, tmpl.primaryLord],
      isFortunate: isGood,
    };
  });

  // 2. KAUSHIK NADI (Vishwamitra) - High Tapas & Breakthrough
  const marsKetuDist = Math.abs(mars.signIndex - ketu.signIndex);
  const isTapas = marsKetuDist === 0 || marsKetuDist === 4 || marsKetuDist === 8;
  const kaushikBreakthroughAge = 28 + (saturn.signIndex % 7);
  const kaushikTapas: KaushikTapasReading = {
    trialThemeEn: isTapas
      ? 'Intense Tapas & Willpower Crucible: Early challenges refine raw ambition into extraordinary discernment and unyielding determination.'
      : 'Harmonious Sadhana Growth: Gradual intellectual expansion leading to steady mastery and high social leadership.',
    trialThemeHi: isTapas
      ? 'तीव्र तपोबल व संघर्ष से सिद्धि: प्रारंभिक जीवन की कठिन परिस्थितियां जातक के आत्मबल को तराशकर उसे अप्रतिम नेतृत्व व विवेक प्रदान करती हैं।'
      : 'सतत साधना व बौद्धिक विकास: क्रमिक अनुभव से समाज में सम्मानजनक स्थान व मार्गदर्शन की क्षमता प्राप्त होती है।',
    breakthroughAge: kaushikBreakthroughAge,
    elevationEn: `Major destiny shift crystallizes around age ${kaushikBreakthroughAge}, unlocking prestigious milestones and institutional recognition.`,
    elevationHi: `आयु के ${kaushikBreakthroughAge}वें वर्ष के समीप युगांतरकारी भाग्योदय होता है, जिससे प्रतिष्ठा व स्थायित्व प्राप्त होता है।`,
  };

  // 3. SHIVA NADI (Shiva-Parvati Samvada)
  const jyotirlingaList: Array<{ nameEn: string; nameHi: string }> = [
    { nameEn: 'Somnath (Gujarat) — Lunar Purification & Peace', nameHi: 'सोमनाथ ज्योतिर्लिंग — मानसिक शांति व चंद्र शुद्धि' },
    { nameEn: 'Mallikarjuna (Andhra Pradesh) — Wealth & Progeny', nameHi: 'मल्लिकार्जुन — श्री व संतान समृद्धि' },
    { nameEn: 'Mahakaleshwar (Ujjain) — Longevity & Courage', nameHi: 'महाकालेश्वर — अकाल मृत्यु निवारण व शौर्य' },
    { nameEn: 'Omkareshwar (Madhya Pradesh) — Spiritual Awakening', nameHi: 'ओंकारेश्वर — आत्म-बोध व ज्ञान' },
    { nameEn: 'Kedarnath (Himalayas) — Moksha & Inner Liberation', nameHi: 'केदारनाथ — मोक्ष व वैराग्य शुद्धि' },
    { nameEn: 'Bhimashankar (Maharashtra) — Removal of Adversaries', nameHi: 'भीमाशंकर — शत्रु बाधा निवारण' },
    { nameEn: 'Kashi Vishwanath (Varanasi) — Supreme Wisdom & Grace', nameHi: 'काशी विश्वनाथ — ज्ञान, धर्म व मुक्ति' },
    { nameEn: 'Trimbakeshwar (Nashik) — Ancestral / Kaal Sarp Shanti', nameHi: 'त्र्यंबकेश्वर — पितृ दोष व कालसर्प शांति' },
    { nameEn: 'Vaidyanath (Deoghar) — Total Health & Healing', nameHi: 'बैद्यनाथ — आरोग्य व रोग मुक्ति' },
    { nameEn: 'Nageshwar (Dwarka) — Protection against Poisons', nameHi: 'नागेश्वर — विष व आकस्मिक संकट निवारण' },
    { nameEn: 'Rameshwaram (Tamil Nadu) — Lineage & Sins Absolution', nameHi: 'रामेश्वरम — कुल उद्धार व पाप क्षय' },
    { nameEn: 'Grishneshwar (Maharashtra) — Universal Prosperity', nameHi: 'घृष्णेश्वर — सर्वांगीण सुख-संपत्ति' },
  ];
  const chosenJyotirlinga = jyotirlingaList[moon.signIndex];

  const shivaNadi: ShivaNadiDialogue = {
    divineDecreeEn: `Lord Shiva speaks to Goddess Parvati: "This jiva has taken birth to balance the forces of Jupiter in ${SIGNS[jupiter.signIndex].name} with the dutiful labor of Saturn in ${SIGNS[saturn.signIndex].name}."`,
    divineDecreeHi: `भगवान शिव देवी पार्वती से कहते हैं: "यह जीव अपने संचित प्रारब्ध की पूर्ति हेतु ${SIGN_HI[jupiter.signIndex]} में गुरु व ${SIGN_HI[saturn.signIndex]} में शनि के कर्म-संतुलन को साधने के लिए अवतरित हुआ है।"`,
    karmaClassification: 'Prarabdha',
    karmaClassificationHi: 'प्रारब्ध कर्म (वर्तमान जीवन में अनिवार्य भोग व परिमार्जन)',
    recommendedJyotirlingaEn: chosenJyotirlinga.nameEn,
    recommendedJyotirlingaHi: chosenJyotirlinga.nameHi,
    shivaPariharaEn: 'Perform Bilva Patra offering on Pradosham days, chant Shiva Panchakshara Stotram, and provide clean drinking water to pilgrims.',
    shivaPariharaHi: 'प्रदोष व्रत में बिल्वपत्र अर्पण करें, शिव पंचाक्षर स्तोत्र का पाठ करें तथा तीर्थयात्रियों अथवा प्यासों को शीतल जल का दान दें।',
  };

  // 4. NANDI TRINES (Directional Lines)
  // East: 1, 5, 9 (Dharma)
  // South: 2, 6, 10 (Artha)
  // West: 3, 7, 11 (Kama)
  // North: 4, 8, 12 (Moksha)
  const getPlanetsInTrine = (signs: number[]): NineGrahaId[] => {
    return chart.planets
      .filter((p) => signs.includes(p.signIndex))
      .map((p) => p.id as NineGrahaId);
  };

  const nandiTrines: NandiTrineLink[] = [
    {
      direction: 'East (Dharma 1-5-9)',
      directionHi: 'पूर्व दिशा (धर्म त्रिकोण — 1, 5, 9)',
      element: 'Fire / Dharma',
      planets: getPlanetsInTrine([0, 4, 8]),
      dynamicInteractionEn: 'Shapes core personality, soul mission, intelligence and higher philosophical convictions.',
      dynamicInteractionHi: 'व्यक्तित्व, आत्मिक लक्ष्य, बुद्धि तथा उच्च नैतिक व आध्यात्मिक मूल्यों को दिशा देता है।',
    },
    {
      direction: 'South (Artha 2-6-10)',
      directionHi: 'दक्षिण दिशा (अर्थ त्रिकोण — 2, 6, 10)',
      element: 'Earth / Artha',
      planets: getPlanetsInTrine([1, 5, 9]),
      dynamicInteractionEn: 'Governs financial accumulation, professional duties, commercial execution and physical sustenance.',
      dynamicInteractionHi: 'धन संग्रह, आजीविका, व्यवसाय संचालन व भौतिक सुख-संसाधनों का निर्धारण करता है।',
    },
    {
      direction: 'West (Kama 3-7-11)',
      directionHi: 'पश्चिम दिशा (काम त्रिकोण — 3, 7, 11)',
      element: 'Air / Kama',
      planets: getPlanetsInTrine([2, 6, 10]),
      dynamicInteractionEn: 'Dictates alliances, business partnerships, social networking, contracts and desire fulfillment.',
      dynamicInteractionHi: 'सामाजिक संबंध, साझेदारी, व्यापारिक अनुबंध, मित्र मंडली व अभिलाषाओं की पूर्ति।',
    },
    {
      direction: 'North (Moksha 4-8-12)',
      directionHi: 'उत्तर दिशा (मोक्ष त्रिकोण — 4, 8, 12)',
      element: 'Water / Moksha',
      planets: getPlanetsInTrine([3, 7, 11]),
      dynamicInteractionEn: 'Governs emotional peace, ancestral bonds, hidden discoveries, meditation and spiritual transcendence.',
      dynamicInteractionHi: 'मानसिक शांति, गुप्त अनुसंधान, साधना, अंतर्ज्ञान व मोक्ष मार्ग की अनुभूतियां।',
    },
  ];

  // 5. JEEVA NADI SYNTHESIS
  // Jupiter = Jeeva (Native)
  // Saturn = Karma (Work/Duty)
  const jupDistSat = (saturn.signIndex - jupiter.signIndex + 12) % 12;
  let jeevaKarmaLinkEn = '';
  let jeevaKarmaLinkHi = '';

  if (jupDistSat === 0) {
    jeevaKarmaLinkEn = 'Jeeva & Karma Conjoined (Guru-Shani Yoga): Native works with immense self-discipline, high ethical standards, and becomes a natural mentor in their profession.';
    jeevaKarmaLinkHi = 'गुरु-शनि युति (जीव-कर्म योग): जातक अत्यंत अनुशासित, नैतिक व कार्यक्षेत्र में स्वाभाविक मार्गदर्शक व प्रमुख बनता है।';
  } else if (jupDistSat === 1 || jupDistSat === 11) {
    jeevaKarmaLinkEn = 'Jeeva & Karma in 2-12 Relationship: Life responsibilities demand continuous adaptation; wealth crystallizes firmly after age 32.';
    jeevaKarmaLinkHi = 'जीव व कर्म 2-12 संबंध: जिम्मेदारियों के साथ निरंतर सामंजस्य; 32 वर्ष की आयु के उपरांत सुदृढ़ आर्थिक स्थिरता।';
  } else if (jupDistSat === 4 || jupDistSat === 8) {
    jeevaKarmaLinkEn = 'Jeeva & Karma in Trinal Harmony (1-5-9): Natural effortless convergence between personal philosophy and career rewards.';
    jeevaKarmaLinkHi = 'जीव व कर्म नवम-पंचम संबंध: व्यक्तिगत विचारों और कार्यक्षेत्रीय उपलब्धियों के मध्य अत्यंत सुंदर व सहज तालमेल।';
  } else {
    jeevaKarmaLinkEn = `Jeeva (Jupiter in ${SIGNS[jupiter.signIndex].name}) and Karma (Saturn in ${SIGNS[saturn.signIndex].name}) create a structured path of steady career ascension through diligence.`;
    jeevaKarmaLinkHi = `जीव (गुरु ${SIGN_HI[jupiter.signIndex]} में) और कर्म (शनि ${SIGN_HI[saturn.signIndex]} में) परिश्रम व निष्ठा से निरंतर प्रगति का मार्ग प्रशस्त करते हैं।`;
  }

  // Bhrigu Bindu
  const distMoonRahu = (rahu.longitude - moon.longitude + 360) % 360;
  const bbDeg = normalizeDeg(moon.longitude + distMoonRahu / 2);
  const bbSignIdx = Math.floor(bbDeg / 30) % 12;

  // BCP 12-Year progression active house for current year
  const currentYear = new Date().getFullYear();
  const birthYear = parseInt(chart.input.date.split('-')[0], 10) || currentYear;
  const age = Math.max(0, currentYear - birthYear);
  const bcpActiveHouse = (age % 12) + 1;

  return {
    agastyaKandams,
    kaushikTapas,
    shivaNadi,
    nandiTrines,
    jeevaSynthesis: {
      jeevaPlanet: 'Jupiter',
      jeevaPlacementEn: `Jupiter in ${SIGNS[jupiter.signIndex].name} (${jupiter.dms}) — House ${jupiter.rasiHouseNumber}`,
      jeevaPlacementHi: `गुरु ${SIGN_HI[jupiter.signIndex]} में (${jupiter.dms}) — भाव ${jupiter.rasiHouseNumber}`,
      karmaPlanet: 'Saturn',
      karmaPlacementEn: `Saturn in ${SIGNS[saturn.signIndex].name} (${saturn.dms}) — House ${saturn.rasiHouseNumber}`,
      karmaPlacementHi: `शनि ${SIGN_HI[saturn.signIndex]} में (${saturn.dms}) — भाव ${saturn.rasiHouseNumber}`,
      jeevaKarmaLinkEn,
      jeevaKarmaLinkHi,
      currentAgeActivationEn: `Current Age ${age} activates House ${bcpActiveHouse} (${SIGNS[(ascSign + bcpActiveHouse - 1) % 12].name}) via Bhrigu Chakra Paddhati.`,
      currentAgeActivationHi: `वर्तमान आयु ${age} वर्ष पर भृगु चक्र पद्धति के अनुसार भाव ${bcpActiveHouse} (${SIGN_HI[(ascSign + bcpActiveHouse - 1) % 12]}) सक्रिय है।`,
    },
    bhriguBinduDegree: Math.round(bbDeg * 100) / 100,
    bhriguBinduSignEn: SIGNS[bbSignIdx].name,
    bhriguBinduSignHi: SIGN_HI[bbSignIdx],
    bcpActiveHouse,
  };
}
