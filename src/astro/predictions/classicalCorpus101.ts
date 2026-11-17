/**
 * Classical Corpus 101 Life Dimensions Engine (वैदिक जीवन-विषयक 101 महा-आयाम)
 *
 * Exhaustive synthesis covering all 12 Bhavas and 101 granular life areas across:
 * - Brihat Parashara Hora Shastra (महर्षि पराशर)
 * - Jaimini Upadesha Sutras (महर्षि जैमिनी)
 * - Brihat Jataka & Brihat Samhita (आचार्य वराहमिहिर)
 * - Saravali (कल्याण वर्मा)
 * - Phaladeepika (मंत्रेश्वर)
 * - Jataka Parijata (वैद्यनाथ दीक्षित)
 * - Sarvartha Chintamani (वेंकटेश शर्मा)
 * - Jatakabharana (ढूँढिराज)
 * - Bhavartha Ratnakara (रामानुजाचार्य)
 * - Lal Kitab 1952 (पं. रूपचंद जोशी)
 * - B.V. Raman (How to Judge a Horoscope & 300 Combinations)
 * - K.N. Rao (Timing of Events & Double Transit PAC-DARES)
 * - K.S. Krishnamurti (KP Readers 1 to 6 - Cuspal Sub-Lords)
 *
 * Full integration of Retrograde (Vakri) Chesta Bala, Neecha-Vakri Ucchavat fruit,
 * Bhava Chalit displacement, and D1+D9+Moon three-tier synthesis.
 */

import type { ChartData, NineGrahaId, SevenPlanetId } from '../types';
import { COMBUSTION_ORB, NAKSHATRAS, NINE_GRAHAS, SIGNS } from '../constants';
import { angularDiffDeg } from '../time';
import type { AuspiciousnessLevel, LifeDimensionReading } from './sambhavitFalkathan';

const HINDI_SIGNS = [
  'मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या',
  'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुंभ', 'मीन'
];

const HINDI_PLANETS: Record<string, string> = {
  Sun: 'सूर्य', Moon: 'चंद्रमा', Mars: 'मंगल', Mercury: 'बुध',
  Jupiter: 'बृहस्पति (गुरु)', Venus: 'शुक्र', Saturn: 'शनि',
  Rahu: 'राहु', Ketu: 'केतु', Asc: 'लग्न'
};

const DIGNITY_HI_MAP: Record<string, string> = {
  Exalted: 'उच्च',
  Moolatrikona: 'मूलत्रिकोण',
  'Own Sign': 'स्वराशि',
  'Great Friend': 'अति मित्र',
  Friendly: 'मित्र',
  Neutral: 'सम',
  Enemy: 'शत्रु',
  'Great Enemy': 'अति शत्रु',
  Debilitated: 'नीच'
};

export interface Classical101Context {
  chart: ChartData;
  ascSign: number;
  ascSignName: string;
  ascSignHi: string;
  ascLord: SevenPlanetId;
  ascLordHi: string;
  planets: ChartData['planets'];
  sav: number[]; // 1 to 12
  currentAge: number;
  mdLord: string;
  adLord: string;
  mdLordHi: string;
  adLordHi: string;
  getHLord: (h: number) => any;
  getAspectsOnHouse: (targetHouse: number) => any[];
  getKartariOnHouse: (targetHouse: number) => string;
}

export function build101LifeDimensions(ctx: Classical101Context): LifeDimensionReading[] {
  const {
    chart, ascSign, ascSignName, ascSignHi, ascLord, ascLordHi,
    planets, sav, currentAge, mdLord, adLord, mdLordHi, adLordHi,
    getHLord, getAspectsOnHouse, getKartariOnHouse
  } = ctx;

  const dims: LifeDimensionReading[] = [];

  const getP = (id: NineGrahaId) => planets.find((p) => p.id === id) || planets[0];
  const sun = getP('Sun');
  const moon = getP('Moon');
  const mars = getP('Mars');
  const mercury = getP('Mercury');
  const jupiter = getP('Jupiter');
  const venus = getP('Venus');
  const saturn = getP('Saturn');
  const rahu = planets.find((p) => p.id === 'Rahu');
  const ketu = planets.find((p) => p.id === 'Ketu');

  const getAuspiciousness = (score: number): AuspiciousnessLevel => {
    if (score >= 76) return 'highly_favorable';
    if (score >= 58) return 'favorable';
    if (score >= 42) return 'mixed_moderate';
    return 'challenging_caution';
  };

  const getDignityBonus = (dignity?: string) => {
    switch (dignity) {
      case 'Exalted': return 22;
      case 'Moolatrikona': return 18;
      case 'Own Sign': return 15;
      case 'Great Friend':
      case 'Friendly': return 8;
      case 'Neutral': return 0;
      case 'Enemy': return -8;
      case 'Great Enemy': return -14;
      case 'Debilitated': return -20;
      default: return 0;
    }
  };

  const getVakriExplanation = (p: any) => {
    if (!p?.isRetrograde) return '';
    if (p.dignity === 'Debilitated') {
      return ` [वक्री चेष्टा बल: मंत्रेश्वर (फलदीपिका अ. 4) के नियमानुसार नीच राशि में वक्री होने से ग्रह को 100% चेष्टा बल प्राप्त है, जिससे यह उच्च के समान असाधारण फल देने में समर्थ है]`;
    }
    if (p.dignity === 'Exalted') {
      return ` [वक्री चेष्टा बल: उच्च राशि में वक्री होने से चेष्टा बल के कारण फल प्राप्ति में बार-बार विलंब अथवा पुनरावृत्ति संभव है]`;
    }
    return ` [वक्री चेष्टा बल: सारावली मतानुसार ग्रह वक्री होकर अत्यधिक बली है एवं निरंतर प्रयास कराकर अप्रत्याशित सफलता दिलाएगा]`;
  };

  const getVakriExplanationEn = (p: any) => {
    if (!p?.isRetrograde) return '';
    if (p.dignity === 'Debilitated') {
      return ` [Retrograde Chesta Bala: Per Phaladeepika Ch. 4, a debilitated planet in retrograde motion acts like an exalted planet, conferring extraordinary turnaround success].`;
    }
    if (p.dignity === 'Exalted') {
      return ` [Retrograde Chesta Bala: An exalted planet in retrograde motion undergoes delayed manifestations requiring patience].`;
    }
    return ` [Retrograde Chesta Bala: Per Saravali, retrograde motion confers 100% kinetic strength, ensuring ultimate victory after perseverance].`;
  };

  // Pre-resolve all 12 House Lords
  const h1 = getHLord(1);
  const h2 = getHLord(2);
  const h3 = getHLord(3);
  const h4 = getHLord(4);
  const h5 = getHLord(5);
  const h6 = getHLord(6);
  const h7 = getHLord(7);
  const h8 = getHLord(8);
  const h9 = getHLord(9);
  const h10 = getHLord(10);
  const h11 = getHLord(11);
  const h12 = getHLord(12);

  // Helper to push dimension with standard fields, targeted remedies & anti-sugarcoating
  const addDim = (d: LifeDimensionReading) => {
    // Anti-Sugarcoating & Targeted Remedy Overhaul:
    // 1. If score >= 50 and not challenging_caution: Safe dimension! No remedy needed.
    if (d.strengthScore >= 50 && d.auspiciousness !== 'challenging_caution') {
      d.remedyHi = 'इस क्षेत्र में कोई अनिष्टकारी ग्रह प्रभाव नहीं है; किसी उपाय, रत्न अथवा अनुष्ठान की आवश्यकता नहीं है। केवल सात्विक आचरण बनाए रखें।';
      d.remedyEn = 'No malefic affliction in this domain; no gemstone, ritual, or remedy is required. Maintain ethical and balanced conduct.';
    } else {
      // 2. Afflicted dimension: Keep targeted remedy, and ensure unvarnished adverse consequences are explicit
      if (d.strengthScore < 45 || d.auspiciousness === 'challenging_caution') {
        if (!d.verdictHi.includes('प्रतिकूल') && !d.verdictHi.includes('सावधानी') && !d.verdictHi.includes('अवरोध')) {
          d.verdictHi = `[प्रतिकूल प्रभाव व अवरोध योग]: ${d.verdictHi} इस क्षेत्र में अप्रत्याशित विलंब, नुकसान अथवा हानि की वास्तविक संभावना है; बिना पूर्व तैयारी के बड़ा जोखिम न लें।`;
          d.verdictEn = `[Adverse Influence & Caution]: ${d.verdictEn} Tangible vulnerability to setbacks, friction, or capital/health losses in this sector; avoid uncalculated exposure.`;
        }
      }
    }
    dims.push(d);
  };

  // =========================================================================
  // KHন্ড 1: प्रथम भाव (TANU BHAVA) — देह, रूप, आयु, स्वभाव व आत्मा (1 से 10)
  // =========================================================================

  // 1. शारीरिक संरचना, वर्ण व देहयष्टि
  {
    const score = Math.max(35, Math.min(95, 52 + getDignityBonus(h1.dignity) + (h1.placedHouse === 1 || h1.placedHouse === 5 || h1.placedHouse === 9 ? 12 : 0)));
    addDim({
      id: 1,
      houseNumber: 1,
      houseTitleHi: 'प्रथम भाव (तनु भाव)',
      houseTitleEn: '1st House (Tanu Bhava)',
      category: 'identity',
      categoryTitleHi: 'पहचान व आत्म',
      categoryTitleEn: 'Identity & Core Self',
      titleHi: 'शारीरिक संरचना, वर्ण, आभा व देहयष्टि',
      titleEn: 'Physical Constitution, Complexion & Bodily Build',
      classicalRef: 'बृहज्जातक (वराहमिहिर) अ. 1 व सारावली अ. 4',
      divisionalRef: 'D1 लग्न व D9 नवांश',
      vakriNote: getVakriExplanation(planets.find((p) => p.id === h1.lord)),
      astroBasisHi: `लग्न ${ascSignHi} (${ascSignName}); लग्नेश ${h1.lordHi} भाव ${h1.placedHouse} में (${h1.dignityHi}, नक्षत्र: ${h1.nakshatraName}); [सर्वाष्टकवर्ग (सहायक): ${sav[0]} बिंदु]।`,
      astroBasisEn: `Ascendant in ${ascSignName}; Lagna Lord ${h1.lord} placed in House ${h1.placedHouse} (${h1.dignity}, Star: ${h1.nakshatraName}); [SAV (Auxiliary): ${sav[0]} bindus].`,
      verdictHi: `${ascSignHi} लग्न के प्रभाव से मध्यम से सुदृढ़ शारीरिक गठन, ओजस्वी मुखाकृति तथा प्राकृतिक जीवन ऊर्जा का उत्तम संतुलन।`,
      verdictEn: `Balanced physical constitution, commanding facial presence, and robust regenerative vitality governed by ${ascSignName} Ascendant.`,
      detailedAnalysisHi: `आचार्य वराहमिहिर के बृहज्जातक अनुसार लग्न भाव जातक के स्थूल शरीर का दर्पण है। लग्नेश ${h1.lordHi} का भाव ${h1.placedHouse} में स्थित होना एवं ${h1.nakshatraName} नक्षत्र का प्रभाव आपके व्यक्तित्व में स्वाभाविक तेज व आकर्षण प्रदान करता है।${getVakriExplanation(planets.find((p) => p.id === h1.lord))}`,
      detailedAnalysisEn: `Per Varahamihira's Brihat Jataka, the physical vessel is shaped by the Ascendant and its dispositor. With ${h1.lord} in House ${h1.placedHouse}, your constitution exhibits natural resilience and imposing dignity.`,
      remedyHi: `नित्य प्रातः सूर्य को तांबे के पात्र से कुंकुम मिश्रित जल अर्पित करें एवं गायत्री मंत्र का जप करें।`,
      remedyEn: `Offer Arghya to the rising Sun daily from a copper vessel and recite the Gayatri Mantra.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 2. मानसिक प्रवृत्ति, स्वभाव व स्वभावगत तेज
  {
    const score = Math.max(35, Math.min(95, 50 + getDignityBonus(moon.dignity) + (moon.houseNumber === 1 || moon.houseNumber === 4 || moon.houseNumber === 9 ? 12 : 0)));
    addDim({
      id: 2,
      houseNumber: 1,
      houseTitleHi: 'प्रथम भाव (तनु भाव)',
      houseTitleEn: '1st House (Tanu Bhava)',
      category: 'identity',
      categoryTitleHi: 'पहचान व आत्म',
      categoryTitleEn: 'Identity & Core Self',
      titleHi: 'मानसिक प्रवृत्ति, स्वभाव, चिंतन व आंतरिक तेज',
      titleEn: 'Temperament, Mental Dispositions & Core Persona',
      classicalRef: 'सारावली (कल्याण वर्मा) अ. 23',
      divisionalRef: 'D1 व D9 नवांश',
      vakriNote: getVakriExplanation(moon),
      astroBasisHi: `चंद्रमा ${HINDI_SIGNS[moon.signIndex]} राशि में (भाव ${moon.houseNumber}, ${DIGNITY_HI_MAP[moon.dignity] || moon.dignity}); लग्न पर दृष्टियां: ${h1.aspects.map((a: any) => a.planetHi).join(', ') || 'कोई नहीं'}।`,
      astroBasisEn: `Moon in ${moon.signName} (House ${moon.houseNumber}, ${moon.dignity}); Aspects on Lagna: ${h1.aspects.map((a: any) => a.planet).join(', ') || 'None'}.`,
      verdictHi: `गंभीर, आत्म-मंथनकारी, सिद्धांतों के प्रति अडिग तथा परिस्थितियों को गहराई से समझने वाला दार्शनिक स्वभाव।`,
      verdictEn: `Reflective, principled, emotionally perceptive, and endowed with philosophical depth.`,
      detailedAnalysisHi: `कल्याण वर्मा की सारावली के अनुसार चंद्रमा मन का अधिष्ठाता है। चंद्रमा का ${HINDI_SIGNS[moon.signIndex]} में होना जातक को विषम परिस्थितियों में भी शांत चित्त रहकर सही निर्णय लेने की सामर्थ्य प्रदान करता है।`,
      detailedAnalysisEn: `Per Saravali, the Moon governs Manas (emotional intelligence). In ${moon.signName}, it blesses you with steady contemplation and instinctive wisdom under crisis.`,
      remedyHi: `पूर्णिमा के दिन चंद्र दर्शन करें और शिव पंचाक्षर मंत्र "ॐ नमः शिवाय" का नियमित जप करें।`,
      remedyEn: `Meditate upon Chandra on Full Moon evenings and chant "Om Namah Shivaya" regularly.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 3. जीवन शक्ति, रोग प्रतिरोधक क्षमता व प्राण ऊर्जा
  {
    const score = Math.max(35, Math.min(95, 54 + getDignityBonus(sun.dignity) + (sun.houseNumber === 1 || sun.houseNumber === 10 ? 15 : 0)));
    addDim({
      id: 3,
      houseNumber: 1,
      houseTitleHi: 'प्रथम भाव (तनु भाव)',
      houseTitleEn: '1st House (Tanu Bhava)',
      category: 'longevity_health',
      categoryTitleHi: 'स्वास्थ्य व आयु',
      categoryTitleEn: 'Health & Longevity',
      titleHi: 'जीवन शक्ति, रोग प्रतिरोधक क्षमता व प्राण ऊर्जा',
      titleEn: 'Vitality, Immune Strength & Pranic Energy',
      classicalRef: 'फलदीपिका (मंत्रेश्वर) अ. 14',
      divisionalRef: 'D1 व D28 (त्रिंशांश)',
      vakriNote: getVakriExplanation(sun),
      astroBasisHi: `सूर्य (नैसर्गिक आत्मकारक/आरोग्य) भाव ${sun.houseNumber} में (${sun.dignity}); लग्नेश भाव ${h1.placedHouse} में; [SAV (सहायक): ${sav[0]} बिंदु]।`,
      astroBasisEn: `Sun (Natural Karaka of Vitality) in H${sun.houseNumber} (${sun.dignity}); Lagna Lord in H${h1.placedHouse}; [SAV: ${sav[0]} bindus].`,
      verdictHi: `उत्कृष्ट रोग प्रतिरोधक क्षमता; अल्पकालिक मौसमी उतार-चढ़ावों से शरीर स्वतः तीव्र गति से उबरने में सक्षम।`,
      verdictEn: `Strong innate immune resilience with fast recuperative recovery from seasonal debilities.`,
      detailedAnalysisHi: `मंत्रेश्वर कृत फलदीपिका के अनुसार सूर्य आरोग्य का साक्षात स्वामी है। भाव ${sun.houseNumber} में सूर्य का स्थान आपकी प्राण शक्ति को अटूट बनाए रखता है। दैनिक प्राणायाम से यह ऊर्जा जीवन पर्यंत अक्षुण्ण रहेगी।`,
      detailedAnalysisEn: `Phaladeepika establishes the Sun as the giver of Arogya (disease-free vitality). Its placement fuels high metabolic vigor.`,
      remedyHi: `नित्य आदित्य हृदय स्तोत्र का पाठ करें तथा प्रातःकाल ताजी धूप में 15 मिनट प्राणायाम करें।`,
      remedyEn: `Recite Aditya Hridaya Stotram and practice 15 minutes of Pranayama in early morning sunlight.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 4. दीर्घायु / अल्पायु खंड निर्धारण
  {
    const score = Math.max(40, Math.min(95, 55 + getDignityBonus(saturn.dignity) + (h8.placedHouse !== 6 && h8.placedHouse !== 12 ? 10 : -8)));
    addDim({
      id: 4,
      houseNumber: 1,
      houseTitleHi: 'प्रथम भाव (तनु भाव)',
      houseTitleEn: '1st House (Tanu Bhava)',
      category: 'longevity_health',
      categoryTitleHi: 'स्वास्थ्य व आयु',
      categoryTitleEn: 'Health & Longevity',
      titleHi: 'दीर्घायु / मध्यायु खंड व जीवन सीमा निर्धारण',
      titleEn: 'Longevity Potential & Lifespan Bracket Determination',
      classicalRef: 'जातक पारिजात (वैद्यनाथ) अ. 5',
      divisionalRef: 'D1, D8 व D60 (षष्ठ्यांश)',
      vakriNote: getVakriExplanation(saturn),
      astroBasisHi: `शनि (आयुष्कारक) भाव ${saturn.houseNumber} में (${saturn.dignity}); अष्टमेश भाव ${h8.placedHouse} में; लग्नेश भाव ${h1.placedHouse} में।`,
      astroBasisEn: `Saturn (Ayushkaraka) in H${saturn.houseNumber} (${saturn.dignity}); 8th Lord in H${h8.placedHouse}; Lagnesha in H${h1.placedHouse}.`,
      verdictHi: `दीर्घायु खंड (75 से 90+ वर्ष); शनिदेव की कृपा व लग्न की सुदृढ़ स्थिति से जीवन में संकटों से अचूक सुरक्षा।`,
      verdictEn: `Purna Ayu / Longevity Bracket (75 to 90+ years); Saturn protects the Prana against life-threatening hazards.`,
      detailedAnalysisHi: `जातक पारिजात के आयुर्दाय अध्याय अनुसार लग्नेश, अष्टमेश और मंद (शनि) तीनों की परस्पर अनुकूलता दीर्घायु योग का निर्माण करती है। महामृत्युंजय मंत्र की साधना से अकाल मृत्यु का भय सर्वथा नष्ट होता है।`,
      detailedAnalysisEn: `According to Jataka Parijata, synchronization between Lagna lord, 8th lord and Saturn secures long lifespan.`,
      remedyHi: `प्रति सोमवार महामृत्युंजय मंत्र का 11 बार जप करें तथा पीपल वृक्ष की शनिवार को प्रदक्षिणा करें।`,
      remedyEn: `Chant Maha Mrityunjaya Mantra 11 times every Monday and offer water to Peepal tree on Saturdays.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 5. व्यक्तित्व की सामाजिक छवि व आभामंडल
  {
    const score = Math.max(35, Math.min(95, 52 + getDignityBonus(sun.dignity) + (h10.placedHouse === 1 || h10.placedHouse === 10 ? 14 : 0)));
    addDim({
      id: 5,
      houseNumber: 1,
      houseTitleHi: 'प्रथम भाव (तनु भाव)',
      houseTitleEn: '1st House (Tanu Bhava)',
      category: 'identity',
      categoryTitleHi: 'पहचान व आत्म',
      categoryTitleEn: 'Identity & Core Self',
      titleHi: 'व्यक्तित्व की सामाजिक छवि, प्रतिष्ठा व आभामंडल',
      titleEn: 'Public Aura, Social Magnetism & Charismatic Presence',
      classicalRef: 'सर्वार्थ चिंतामणि (वेंकटेश शर्मा) अ. 1',
      divisionalRef: 'D1 व D10 (दशमांश)',
      vakriNote: getVakriExplanation(planets.find((p) => p.id === h1.lord)),
      astroBasisHi: `लग्नेश ${h1.lordHi} भाव ${h1.placedHouse} में; दशमेश ${h10.lordHi} भाव ${h10.placedHouse} में; सूर्य भाव ${sun.houseNumber} में।`,
      astroBasisEn: `Lagna Lord in H${h1.placedHouse}; 10th Lord in H${h10.placedHouse}; Sun in H${sun.houseNumber}.`,
      verdictHi: `प्रभावशाली व गरिमामय आभामंडल; समाज में आपकी बातों को स्वाभाविक वजन और आदर प्राप्त होता है।`,
      verdictEn: `Commanding public aura and natural dignity that inspires instinctive reverence in collective gatherings.`,
      detailedAnalysisHi: `सर्वार्थ चिंतामणि के अनुसार जब लग्न और दशम भाव का संबंध शुभ ग्रहों से पुष्ट हो, तो जातक जहाँ भी जाता है, अपना अमिट प्रभाव छोड़ता है।`,
      detailedAnalysisEn: `Per Sarvartha Chintamani, correlation between 1st and 10th houses creates an indelible public footprint.`,
      remedyHi: `माथे पर नित्य केसर या चंदन का तिलक धारण करें और सत्य वचन का संकल्प लें।`,
      remedyEn: `Apply a pure saffron or sandalwood tilak on the forehead daily to stimulate Ajna chakra.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 6. आत्मविश्वास, आत्मसम्मान व इच्छाशक्ति
  {
    const score = Math.max(35, Math.min(95, 50 + getDignityBonus(mars.dignity) + (mars.houseNumber === 1 || mars.houseNumber === 3 || mars.houseNumber === 10 ? 12 : 0)));
    addDim({
      id: 6,
      houseNumber: 1,
      houseTitleHi: 'प्रथम भाव (तनु भाव)',
      houseTitleEn: '1st House (Tanu Bhava)',
      category: 'identity',
      categoryTitleHi: 'पहचान व आत्म',
      categoryTitleEn: 'Identity & Core Self',
      titleHi: 'आत्मविश्वास, आत्मसम्मान, दृढ़ता व इच्छाशक्ति',
      titleEn: 'Self-Confidence, Self-Respect & Indomitable Willpower',
      classicalRef: 'बृहत्पाराशर होराशास्त्र (पराशर) अ. 12',
      divisionalRef: 'D1 व D3 (द्रेष्काण)',
      vakriNote: getVakriExplanation(mars),
      astroBasisHi: `मंगल (साहस कारक) भाव ${mars.houseNumber} में (${mars.dignity}); तृतीयेश ${h3.lordHi} भाव ${h3.placedHouse} में।`,
      astroBasisEn: `Mars (Significator of Courage) in H${mars.houseNumber} (${mars.dignity}); 3rd Lord in H${h3.placedHouse}.`,
      verdictHi: `अदम्य इच्छाशक्ति व उच्च आत्मसम्मान; कठिन से कठिन चुनौतियों में भी बिना झुके आगे बढ़ने का संकल्प।`,
      verdictEn: `Indomitable willpower and towering self-respect; refusal to compromise on core ethical grounds.`,
      detailedAnalysisHi: `महर्षि पराशर के अनुसार मंगल और सूर्य की संयुक्त शक्ति जातक को कभी पराजय स्वीकार न करने वाला योद्धा बनाती है।`,
      detailedAnalysisEn: `BPHS confirms that Mars and Sun together infuse the native with indefatigable courage during adversity.`,
      remedyHi: `नित्य हनुमान चालीसा का पाठ करें और मंगलवार को गुड़ व चने का वितरण करें।`,
      remedyEn: `Recite Hanuman Chalisa daily and donate roasted chickpeas and jaggery on Tuesdays.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 7. आत्मकारक ग्रह एवं आत्मा की मूल अभिलाषा
  {
    const akPlanet = planets.reduce((max, p) => (p.degreeInSign > max.degreeInSign ? p : max), planets[0]);
    const score = Math.max(45, Math.min(95, 55 + getDignityBonus(akPlanet.dignity)));
    addDim({
      id: 7,
      houseNumber: 1,
      houseTitleHi: 'प्रथम भाव (तनु भाव)',
      houseTitleEn: '1st House (Tanu Bhava)',
      category: 'spirituality',
      categoryTitleHi: 'आध्यात्म व मोक्ष',
      categoryTitleEn: 'Spirituality & Grace',
      titleHi: 'आत्मकारक ग्रह एवं आत्मा की मूल अभिलाषा',
      titleEn: 'Atmakaraka Planet & Core Soul Mission',
      classicalRef: 'जैमिनी उपदेश सूत्र (महर्षि जैमिनी) अ. 1',
      divisionalRef: 'D9 नवांश (कारकांश लग्न)',
      vakriNote: getVakriExplanation(akPlanet),
      astroBasisHi: `आत्मकारक (सर्वाधिक अंश): ${HINDI_PLANETS[akPlanet.id] || akPlanet.id} (${akPlanet.degreeInSign.toFixed(2)}° में स्थित, गरिमा: ${akPlanet.dignity})।`,
      astroBasisEn: `Atmakaraka (Highest Longitude): ${akPlanet.id} at ${akPlanet.degreeInSign.toFixed(2)}° in ${akPlanet.signName} (${akPlanet.dignity}).`,
      verdictHi: `आत्मा की मूल अभिलाषा: आत्म-साक्षात्कार, सत्य की खोज तथा अपने कर्मों से जन-कल्याण का मार्ग प्रशस्त करना।`,
      verdictEn: `Soul's core trajectory: inner self-realization, mastery over lower tendencies, and uplifting others.`,
      detailedAnalysisHi: `महर्षि जैमिनी के अनुसार आत्मकारक ग्रह आत्मा का राजा है। यह ग्रह इंगित करता है कि आपके इस जन्म का मुख्य कर्म ऋण क्या है और मोक्ष का द्वार कहाँ से खुलेगा।`,
      detailedAnalysisEn: `Jaimini Sutras identify Atmakaraka as the king of the chart, mapping the ultimate purpose behind this incarnation.`,
      remedyHi: `अपने आत्मकारक ग्रह ${HINDI_PLANETS[akPlanet.id] || akPlanet.id} के बीज मंत्र का नित्य 108 बार जप करें।`,
      remedyEn: `Chant the Beeja Mantra of your Atmakaraka planet ${akPlanet.id} 108 times daily.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 8. जन्मजात गुण, जन्म-चिह्न व शारीरिक लक्षण
  {
    const score = Math.max(35, Math.min(90, 50 + (sav[0] >= 28 ? 10 : 0)));
    addDim({
      id: 8,
      houseNumber: 1,
      houseTitleHi: 'प्रथम भाव (तनु भाव)',
      houseTitleEn: '1st House (Tanu Bhava)',
      category: 'identity',
      categoryTitleHi: 'पहचान व आत्म',
      categoryTitleEn: 'Identity & Core Self',
      titleHi: 'जन्मजात गुण, जन्म-चिह्न, तिल व शारीरिक लक्षण',
      titleEn: 'Inborn Traits, Identification Marks & Bodily Signs',
      classicalRef: 'जातकाभरण (ढूँढिराज) अ. 2',
      divisionalRef: 'D1 व D60 (षष्ठ्यांश)',
      vakriNote: '',
      astroBasisHi: `लग्न राशि: ${ascSignHi}; लग्न में स्थित ग्रह: ${h1.occupants.map((o: any) => HINDI_PLANETS[o.id] || o.id).join(', ') || 'कोई नहीं'}; राहु/केतु का प्रभाव।`,
      astroBasisEn: `Ascendant: ${ascSignName}; Occupants in Lagna: ${h1.occupants.map((o: any) => o.id).join(', ') || 'None'}; Nodal axes.`,
      verdictHi: `मस्तक, कंधे अथवा ऊपरी देह पर विशिष्ट तिल, मस्सा अथवा स्वाभाविक प्राकृतिक चिह्न की उपस्थिति।`,
      verdictEn: `Distinctive birthmark, mole, or scar upon the upper torso, forehead, or shoulder line.`,
      detailedAnalysisHi: `ढूँढिराज के जातकाभरण अनुसार लग्न राशि और लग्नस्थ ग्रहों के स्वभाव से शरीर के अंगों पर स्थायी चिह्नों का निर्माण होता है जो जातक की शास्त्रीय पहचान बनते हैं।`,
      detailedAnalysisEn: `Jatakabharana details how planetary rays impinging upon the rising degree stamp physical identification marks.`,
      remedyHi: `प्रतिदिन स्नान के उपरांत मस्तक पर शुद्ध गंगाजल अथवा गुलाब जल का स्पर्श करें।`,
      remedyEn: `Touch holy water to forehead after daily bath to honor the physical temple of consciousness.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 9. बालारिष्ट एवं आरंभिक शैशव काल
  {
    const score = Math.max(40, Math.min(95, 55 + (moon.dignity === 'Exalted' || moon.dignity === 'Own Sign' ? 15 : 0) + (jupiter.houseNumber === 1 || jupiter.houseNumber === 5 || jupiter.houseNumber === 9 ? 15 : 0)));
    addDim({
      id: 9,
      houseNumber: 1,
      houseTitleHi: 'प्रथम भाव (तनु भाव)',
      houseTitleEn: '1st House (Tanu Bhava)',
      category: 'longevity_health',
      categoryTitleHi: 'स्वास्थ्य व आयु',
      categoryTitleEn: 'Health & Longevity',
      titleHi: 'बालारिष्ट दोष मुक्ति एवं आरंभिक शैशव काल सुरक्षा',
      titleEn: 'Balarishta Immunity & Infancy Survival Strengths',
      classicalRef: 'बृहत्पाराशर होराशास्त्र (पराशर) अ. 11 (बालारिष्टाध्याय)',
      divisionalRef: 'D1 व D30 (त्रिंशांश)',
      vakriNote: getVakriExplanation(moon),
      astroBasisHi: `चंद्रमा भाव ${moon.houseNumber} में (${moon.dignity}); गुरु की दृष्टि अथवा स्थिति; लग्न पर शुभ प्रभाव।`,
      astroBasisEn: `Moon in H${moon.houseNumber} (${moon.dignity}); Jupiterian grace shielding the formative infant years.`,
      verdictHi: `बालारिष्ट दोष से पूर्ण सुरक्षा; शैशवावस्था में स्वास्थ्य संकटों से ईश्वरीय कृपा व मातृ-आशीर्वाद द्वारा रक्षा।`,
      verdictEn: `Immunity against severe childhood arishta; childhood guarded by benefic planetary alignments.`,
      detailedAnalysisHi: `महर्षि पराशर ने बालारिष्ट अध्याय में स्पष्ट किया है कि यदि केंद्र में बलवान गुरु हों या चंद्रमा बली हो, तो बाल्यकाल के समस्त अरिष्ट स्वतः शांत हो जाते हैं।`,
      detailedAnalysisEn: `BPHS confirms that a well-placed Jupiter or Moon neutralizes thousands of infant vulnerabilities.`,
      remedyHi: `शैशव व बालकों के स्वास्थ्य हेतु भगवान कार्तिकेय अथवा भगवान शिव के शरण में प्रार्थना करें।`,
      remedyEn: `Offer prayers to Lord Kartikeya or Lord Shiva for perpetual child protection.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 10. जीवन का समग्र उद्देश्य व आध्यात्मिक लग्न
  {
    const score = Math.max(45, Math.min(98, 55 + getDignityBonus(jupiter.dignity) + (h9.placedHouse === 1 || h9.placedHouse === 9 ? 15 : 0)));
    addDim({
      id: 10,
      houseNumber: 1,
      houseTitleHi: 'प्रथम भाव (तनु भाव)',
      houseTitleEn: '1st House (Tanu Bhava)',
      category: 'spirituality',
      categoryTitleHi: 'आध्यात्म व मोक्ष',
      categoryTitleEn: 'Spirituality & Grace',
      titleHi: 'जीवन का समग्र उद्देश्य, आध्यात्मिक लग्न व प्रारब्ध',
      titleEn: 'Ultimate Life Mission, Spiritual Awakening & Prarabdha',
      classicalRef: 'भृगु नंदी नाड़ी (आर.जी. राव) व उपनिषद सार',
      divisionalRef: 'D1, D9 व D20 (विंशांश)',
      vakriNote: getVakriExplanation(jupiter),
      astroBasisHi: `गुरु (धर्म कारक) भाव ${jupiter.houseNumber} में; नवमेश ${h9.lordHi} भाव ${h9.placedHouse} में; लग्नेश भाव ${h1.placedHouse} में।`,
      astroBasisEn: `Jupiter (Dharmakaraka) in H${jupiter.houseNumber}; 9th Lord in H${h9.placedHouse}; Lagna Lord in H${h1.placedHouse}.`,
      verdictHi: `उच्चतर चेतना का विकास, धर्म की रक्षा तथा समाज को सही दिशा दिखाने वाला जीवन उद्देश्य।`,
      verdictEn: `High spiritual purpose anchored in dharmic service, intellectual illumination, and moral leadership.`,
      detailedAnalysisHi: `भृगु नंदी नाड़ी के अनुसार गुरु, शनि और केतु का त्रिकोण संबंध जातक को भौतिक संसार में रहते हुए भी संतों जैसी विरक्ति और विवेक प्रदान करता है।`,
      detailedAnalysisEn: `Bhrigu Nandi Nadi demonstrates how Jupiter's trine links elevate everyday duties into sacred sadhana.`,
      remedyHi: `प्रति गुरुवार श्रीमद्भगवद्गीता के किसी एक अध्याय का अर्थ सहित पाठ करें।`,
      remedyEn: `Read one chapter of Srimad Bhagavad Gita with meaning every Thursday.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // =========================================================================
  // KHOND 2: द्वितीय भाव (DHANA BHAVA) — धन, कुटुंब, वाणी व संचित संपदा (11 से 18)
  // =========================================================================

  // 11. पैतृक कुल एवं परिवार का सुख
  {
    const score = Math.max(35, Math.min(95, 50 + getDignityBonus(h2.dignity) + (h2.placedHouse === 2 || h2.placedHouse === 4 || h2.placedHouse === 9 ? 12 : 0)));
    addDim({
      id: 11,
      houseNumber: 2,
      houseTitleHi: 'द्वितीय भाव (धन व कुटुंब)',
      houseTitleEn: '2nd House (Dhana & Kutumba)',
      category: 'family',
      categoryTitleHi: 'माता-पिता व कुल',
      categoryTitleEn: 'Family & Lineage',
      titleHi: 'पैतृक कुल, पारिवारिक प्रतिष्ठा व कुटुंब सुख',
      titleEn: 'Family Lineage, Clan Bonding & Ancestral Culture',
      classicalRef: 'फलदीपिका (मंत्रेश्वर) अ. 7',
      divisionalRef: 'D1 व D12 (द्वादशांश)',
      vakriNote: getVakriExplanation(planets.find((p) => p.id === h2.lord)),
      astroBasisHi: `द्वितीयेश ${h2.lordHi} भाव ${h2.placedHouse} में (${h2.dignityHi}); गुरु भाव ${jupiter.houseNumber} में; [SAV (सहायक): ${sav[1]} बिंदु]।`,
      astroBasisEn: `2nd Lord in H${h2.placedHouse} (${h2.dignity}); Jupiter in H${jupiter.houseNumber}; [SAV: ${sav[1]} bindus].`,
      verdictHi: `संस्कारवान, प्रतिष्ठित व आदरणीय पारिवारिक पृष्ठभूमि; कुटुंब का पूर्ण सहयोग व आत्मीयता।`,
      verdictEn: `Cultured family pedigree, deep clan cohesion, and enduring mutual respect across generations.`,
      detailedAnalysisHi: `मंत्रेश्वर के अनुसार द्वितीय भाव परिवार की जड़ों को सींचता है। द्वितीयेश का शुभ प्रभाव कुल की परंपराओं को गौरवशाली बनाए रखता है।`,
      detailedAnalysisEn: `Phaladeepika establishes the 2nd house as the bastion of generational heritage and ancestral respect.`,
      remedyHi: `परिवार के वरिष्ठ सदस्यों के चरण स्पर्श कर आशीर्वाद लें तथा कुलदेवी/कुलदेवता का नियमित पूजन करें।`,
      remedyEn: `Honor elders daily and perform regular rituals for the family Kuladevata.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 12. तरल धन, बैंक बैलेंस व संचित पूंजी
  {
    const score = Math.max(40, Math.min(96, 52 + (sav[1] >= 28 ? 12 : -8) + (sav[10] >= 28 ? 12 : -8) + getDignityBonus(h2.dignity)));
    addDim({
      id: 12,
      houseNumber: 2,
      houseTitleHi: 'द्वितीय भाव (धन व कुटुंब)',
      houseTitleEn: '2nd House (Dhana & Kutumba)',
      category: 'wealth_fortune',
      categoryTitleHi: 'धन व समृद्धि',
      categoryTitleEn: 'Wealth & Prosperity',
      titleHi: 'तरल धन, बैंक बैलेंस, बचत व संचित संपदा',
      titleEn: 'Liquid Wealth, Bank Balance & Capital Accumulation',
      classicalRef: 'बृहत्पाराशर होराशास्त्र (पराशर) अ. 13',
      divisionalRef: 'D1 व D2 (होरा चक्र)',
      vakriNote: getVakriExplanation(planets.find((p) => p.id === h2.lord)),
      astroBasisHi: `द्वितीयेश भाव ${h2.placedHouse} में (${h2.dignityHi}); एकादशेश भाव ${h11.placedHouse} में; [SAV (सहायक): द्वितीय भाव ${sav[1]} बिंदु, एकादश ${sav[10]} बिंदु]।`,
      astroBasisEn: `2nd Lord in H${h2.placedHouse} (${h2.dignity}); 11th Lord in H${h11.placedHouse}; [SAV: H2 ${sav[1]}, H11 ${sav[10]}].`,
      verdictHi: `सुदृढ़ धन संचय योग; आयु के साथ बैंक बैलेंस और संचित कोष में निरंतर वृद्धि।`,
      verdictEn: `Steady capital accumulation with growing liquid reserves advancing across maturity years.`,
      detailedAnalysisHi: `महर्षि पराशर के धन योग अध्याय अनुसार द्वितीय और एकादश भाव की परस्पर दृष्टि या स्थिति जातक को कभी दरिद्र नहीं होने देती।`,
      detailedAnalysisEn: `BPHS confirms that strong links between houses 2 and 11 establish perennial financial reserves.`,
      remedyHi: `शुक्रवार को श्रीसूक्त का पाठ करें एवं अपनी आय का एक छोटा अंश धर्मार्थ निकालें।`,
      remedyEn: `Recite Sri Suktam on Fridays and tithe a small portion of savings to ethical charity.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 13. वाणी का प्रभाव, वाकपटुता व सम्मोहन
  {
    const score = Math.max(35, Math.min(95, 50 + getDignityBonus(mercury.dignity) + (mercury.houseNumber === 2 || mercury.houseNumber === 1 ? 12 : 0)));
    addDim({
      id: 13,
      houseNumber: 2,
      houseTitleHi: 'द्वितीय भाव (धन व कुटुंब)',
      houseTitleEn: '2nd House (Dhana & Kutumba)',
      category: 'identity',
      categoryTitleHi: 'पहचान व आत्म',
      categoryTitleEn: 'Identity & Core Self',
      titleHi: 'वाणी का प्रभाव, वाकपटुता, सम्मोहन व संभाषण कला',
      titleEn: 'Speech Impact, Oratorical Eloquence & Vocal Magnetism',
      classicalRef: 'सारावली (कल्याण वर्मा) अ. 24',
      divisionalRef: 'D1 व D9 नवांश',
      vakriNote: getVakriExplanation(mercury),
      astroBasisHi: `बुध (वाणी कारक) भाव ${mercury.houseNumber} में (${mercury.dignity}); द्वितीय भाव में स्थित ग्रह: ${h2.occupants.map((o: any) => HINDI_PLANETS[o.id] || o.id).join(', ') || 'कोई नहीं'}।`,
      astroBasisEn: `Mercury (Vak-karaka) in H${mercury.houseNumber} (${mercury.dignity}); Occupants in H2: ${h2.occupants.map((o: any) => o.id).join(', ') || 'None'}.`,
      verdictHi: `तर्कपूर्ण, संतुलित, मधुर एवं श्रोताओं को प्रभावित करने वाली प्रभावशाली संभाषण शैली।`,
      verdictEn: `Persuasive, articulate speech infused with rational poise and oratorical resonance.`,
      detailedAnalysisHi: `सारावली के अनुसार जब बुध और द्वितीयेश का संबंध शुभ हो, तो जातक की वाणी में सरस्वती का वास होता है और वह अपनी बातों से सभी को मना लेता है।`,
      detailedAnalysisEn: `Saravali demonstrates that benefic aspects on the 2nd house endow the tongue with Saraswati's grace.`,
      remedyHi: `नित्य प्रातः ॐ ऐं सरस्वत्यै नमः मंत्र का 21 बार जप करें।`,
      remedyEn: `Chant "Om Aim Saraswatyai Namah" 21 times each morning before initiating dialogue.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 14. खान-पान, भोजन रुचि व आहार शुद्धि
  {
    const score = Math.max(35, Math.min(90, 50 + getDignityBonus(venus.dignity)));
    addDim({
      id: 14,
      houseNumber: 2,
      houseTitleHi: 'द्वितीय भाव (धन व कुटुंब)',
      houseTitleEn: '2nd House (Dhana & Kutumba)',
      category: 'identity',
      categoryTitleHi: 'पहचान व आत्म',
      categoryTitleEn: 'Identity & Core Self',
      titleHi: 'खान-पान, भोजन रुचि, रस स्वाद व आहार शुद्धि',
      titleEn: 'Dietary Taste, Epicurean Preferences & Satvik Balance',
      classicalRef: 'भावार्थ रत्नाकर (रामानुजाचार्य)',
      divisionalRef: 'D1 लग्न चक्र',
      vakriNote: '',
      astroBasisHi: `द्वितीय भाव में ग्रह प्रभाव; शुक्र व चंद्रमा की स्थिति; सात्विक व पोषक आहार की प्रवृत्ति।`,
      astroBasisEn: `2nd House food indicators; Venus and Moon dispositions shaping epicurean tastes.`,
      verdictHi: `स्वादिष्ट, स्वच्छ व सुसंस्कृत भोजन का शौक; सात्विक व ताजा आहार शरीर को सर्वाधिक अनुकूल।`,
      verdictEn: `Appreciation for pure, refined, freshly prepared wholesome foods with epicurean discernment.`,
      detailedAnalysisHi: `भावार्थ रत्नाकर के अनुसार द्वितीय भाव मुख और रस का प्रतिनिधित्व करता है। शुद्ध आहार जातक की मेधा और ओज को बढ़ाता है।`,
      detailedAnalysisEn: `Bhavartha Ratnakara links the 2nd house with taste sensibilities and digestive prana.`,
      remedyHi: `भोजन करने से पूर्व अन्नदेवता का स्मरण करें तथा बासी या अति-तीखे भोजन से परहेज रखें।`,
      remedyEn: `Offer thanks to Annapurna before meals and avoid stale or excessively pungent food.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 15. नेत्र दृष्टि एवं मुख मंडल का स्वास्थ्य
  {
    const score = Math.max(35, Math.min(92, 50 + getDignityBonus(sun.dignity) + getDignityBonus(moon.dignity)));
    addDim({
      id: 15,
      houseNumber: 2,
      houseTitleHi: 'द्वितीय भाव (धन व कुटुंब)',
      houseTitleEn: '2nd House (Dhana & Kutumba)',
      category: 'longevity_health',
      categoryTitleHi: 'स्वास्थ्य व आयु',
      categoryTitleEn: 'Health & Longevity',
      titleHi: 'नेत्र ज्योति, मुख मंडल स्वास्थ्य व दंत सुरक्षा',
      titleEn: 'Visual Acuity, Ocular Health & Facial Well-being',
      classicalRef: 'जातकाभरण (ढूँढिराज) अ. 14',
      divisionalRef: 'D1 व D30 (त्रिंशांश)',
      vakriNote: '',
      astroBasisHi: `द्वितीय भाव (दायां नेत्र) व द्वादश भाव (बायां नेत्र); सूर्य व चंद्रमा की अंशात्मक स्थिति।`,
      astroBasisEn: `2nd house (right eye) & 12th house (left eye); Sun & Moon ocular coordinates.`,
      verdictHi: (sun.dignity === 'Debilitated' || moon.dignity === 'Debilitated' || h2.placedHouse === 6 || h2.placedHouse === 8 || h2.placedHouse === 12)
        ? `नेत्रों व मुखमंडल के प्रति विशेष सावधानी अपेक्षित; प्रकाश व स्क्रीन समय संतुलित रखें।`
        : (score >= 60 ? `दीर्घायु तक उत्तम नेत्र ज्योति एवं मुख का तेज स्वाभाविक रूप से सुदृढ़।` : `सामान्यतः उत्तम नेत्र ज्योति; डिजिटल स्क्रीन के अत्यधिक उपयोग पर समय-समय पर दृष्टि जांच की सलाह।`),
      verdictEn: (sun.dignity === 'Debilitated' || moon.dignity === 'Debilitated' || h2.placedHouse === 6 || h2.placedHouse === 8 || h2.placedHouse === 12)
        ? `Vigilance advised for ocular vitality; manage blue-light exposure and maintain regular ophthalmological checkups.`
        : (score >= 60 ? `Strong ocular vitality and sharp visual focus sustained throughout lifetime.` : `Sound ocular vitality; standard corrective lenses recommended during heavy digital screen exposure.`),
      detailedAnalysisHi: `जातकाभरण अनुसार सूर्य दाहिने नेत्र का और चंद्रमा बाएं नेत्र का कारक है। दोनों की संतुलित स्थिति दृष्टि को दीर्घायु तक बनाए रखती है।`,
      detailedAnalysisEn: `Jatakabharana confirms that harmonious luminaries guard against premature vision debility.`,
      remedyHi: `प्रातः काल मुंह में शीतल जल भरकर आंखों पर शीतल जल के छींटे मारें (नेत्र प्रक्षालन)।`,
      remedyEn: `Splash clean cool water upon eyes during morning ablutions to cool the ocular nerves.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 16. बहुमूल्य रत्न, आभूषण व स्वर्ण संचय
  {
    const score = Math.max(35, Math.min(95, 50 + getDignityBonus(venus.dignity) + getDignityBonus(jupiter.dignity)));
    addDim({
      id: 16,
      houseNumber: 2,
      houseTitleHi: 'द्वितीय भाव (धन व कुटुंब)',
      houseTitleEn: '2nd House (Dhana & Kutumba)',
      category: 'wealth_fortune',
      categoryTitleHi: 'धन व समृद्धि',
      categoryTitleEn: 'Wealth & Prosperity',
      titleHi: 'स्वर्ण, आभूषण, बहुमूल्य रत्न व ठोस परिसंपत्ति संचय',
      titleEn: 'Gold, Jewelry, Precious Stones & Solid Assets',
      classicalRef: 'जातक पारिजात (वैद्यनाथ) अ. 8',
      divisionalRef: 'D1 व D2 (होरा चक्र)',
      vakriNote: getVakriExplanation(venus),
      astroBasisHi: `गुरु व शुक्र की स्थिति; द्वितीयेश ${h2.lordHi} का बल; स्वर्ण व रत्न संचय योग।`,
      astroBasisEn: `Jupiter & Venus dispositions; 2nd lord strength fueling tangible gold and gemstone accumulation.`,
      verdictHi: `स्वर्ण, रजत व आभूषणों के संचय का अनुकूल योग; पारिवारिक विरासत के रूप में बहुमूल्य वस्तुएं प्राप्त होने के संकेत।`,
      verdictEn: `Favorable propensity to amass solid gold, precious stones, and ancestral heirloom jewelry.`,
      detailedAnalysisHi: `जातक पारिजात के अनुसार शुक्र और गुरु की द्वितीय भाव पर कृपा जातक के घर में स्वर्ण और रत्नों की प्रचुरता लाती है।`,
      detailedAnalysisEn: `Jataka Parijata links Venusian beneficence with the physical acquisition of precious metals.`,
      remedyHi: `घर की तिजोरी या धन स्थान पर कुबेर यंत्र अथवा श्वेतार्क गणपति स्थापित करें।`,
      remedyEn: `Keep a consecrated Kuber Yantra or silver coin wrapped in red cloth in the home treasury.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 17. प्राथमिक शिक्षा एवं पारिवारिक संस्कार
  {
    const score = Math.max(40, Math.min(95, 52 + getDignityBonus(mercury.dignity) + getDignityBonus(jupiter.dignity)));
    addDim({
      id: 17,
      houseNumber: 2,
      houseTitleHi: 'द्वितीय भाव (धन व कुटुंब)',
      houseTitleEn: '2nd House (Dhana & Kutumba)',
      category: 'education',
      categoryTitleHi: 'शिक्षा व विद्या',
      categoryTitleEn: 'Education & Intellect',
      titleHi: 'प्राथमिक शिक्षा, बाल्यकालीन संस्कार व नैतिक नींव',
      titleEn: 'Primary Education, Childhood Values & Moral Foundation',
      classicalRef: 'सर्वार्थ चिंतामणि (वेंकटेश शर्मा) अ. 3',
      divisionalRef: 'D1 व D24 (सिद्धांश)',
      vakriNote: '',
      astroBasisHi: `द्वितीयेश ${h2.lordHi} व चतुर्थेश ${h4.lordHi} का संबंध; बुध की स्थिति; संस्कारवान बाल्यकाल।`,
      astroBasisEn: `2nd and 4th house synergy; Mercury's intellect; high ethical grounding during early schooling.`,
      verdictHi: `उत्कृष्ट प्राथमिक शिक्षा व नैतिक संस्कारों से युक्त बाल्यकाल; आदर व अनुशासन की मजबूत नींव।`,
      verdictEn: `Strong early schooling characterized by disciplined study habits and upright moral character.`,
      detailedAnalysisHi: `सर्वार्थ चिंतामणि के अनुसार द्वितीय भाव की शुद्धता बालक को बचपन से ही सुसंस्कृत और गुणी बनाती है।`,
      detailedAnalysisEn: `Sarvartha Chintamani affirms that a fortified 2nd house secures early academic excellence.`,
      remedyHi: `बुधवार को हरी मूंग की दाल पक्षियों को डालें अथवा किसी निर्धन विद्यार्थी को पुस्तकें दान करें।`,
      remedyEn: `Feed green gram to birds on Wednesdays or donate notebook sets to needy school children.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 18. पैतृक धन प्राप्ति एवं पारिवारिक वित्तीय विवाद
  {
    const score = Math.max(35, Math.min(92, 50 + (h8.placedHouse !== 6 && h8.placedHouse !== 12 ? 10 : -8) + getDignityBonus(saturn.dignity)));
    addDim({
      id: 18,
      houseNumber: 2,
      houseTitleHi: 'द्वितीय भाव (धन व कुटुंब)',
      houseTitleEn: '2nd House (Dhana & Kutumba)',
      category: 'wealth_fortune',
      categoryTitleHi: 'धन व समृद्धि',
      categoryTitleEn: 'Wealth & Prosperity',
      titleHi: 'पैतृक धन प्राप्ति, वसीयती अधिकार व वित्तीय सुरक्षा',
      titleEn: 'Inherited Ancestral Property, Wills & Clan Solvency',
      classicalRef: 'फलदीपिका (मंत्रेश्वर) अ. 15',
      divisionalRef: 'D1 व D12 (द्वादशांश)',
      vakriNote: getVakriExplanation(saturn),
      astroBasisHi: `द्वितीयेश भाव ${h2.placedHouse} में; अष्टमेश भाव ${h8.placedHouse} में; शनि (विरासत कारक) का प्रभाव।`,
      astroBasisEn: `2nd Lord in H${h2.placedHouse}; 8th Lord in H${h8.placedHouse}; Saturn's karmic probate links.`,
      verdictHi: `पैतृक संपत्ति व वसीयती अधिकारों की वैधानिक प्राप्ति; दस्तावेजी कार्यों में सावधानी से पूर्ण सफलता।`,
      verdictEn: `Substantial inheritance of ancestral estates with eventual legal resolution in native's favor.`,
      detailedAnalysisHi: `मंत्रेश्वर अनुसार अष्टम भाव द्वितीय से सप्तम होने के कारण वसीयत और पैतृक हक का स्रोत बनता है। धैर्यपूर्वक कार्य करने से पैतृक अधिकार सुरक्षित रहते हैं।`,
      detailedAnalysisEn: `Phaladeepika demonstrates how 8th house aspects onto 2nd house release ancestral wealth.`,
      remedyHi: `अमावस्या के दिन पितरों के निमित्त कच्चा दूध व काले तिल मिश्रित जल पीपल में अर्पित करें।`,
      remedyEn: `Offer water mixed with black sesame seeds to Peepal tree on Amavasya days for Pitru Shanti.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // =========================================================================
  // KHOND 3: तृतीय भाव (SAHAJA BHAVA) — पराक्रम, भाई-बहन, साहस व संचार (19 से 26)
  // =========================================================================

  // 19. बाहुबल, पराक्रम व निर्भीकता
  {
    const score = Math.max(35, Math.min(95, 52 + getDignityBonus(mars.dignity) + (h3.placedHouse === 3 || h3.placedHouse === 10 || h3.placedHouse === 11 ? 12 : 0)));
    addDim({
      id: 19,
      houseNumber: 3,
      houseTitleHi: 'तृतीय भाव (सहज व पराक्रम)',
      houseTitleEn: '3rd House (Sahaja & Valour)',
      category: 'identity',
      categoryTitleHi: 'पहचान व आत्म',
      categoryTitleEn: 'Identity & Core Self',
      titleHi: 'बाहुबल, पराक्रम, निर्भीकता व संकटमोचन क्षमता',
      titleEn: 'Physical Valour, Audacity & Crisis Overcoming Strength',
      classicalRef: 'बृहत्पाराशर होराशास्त्र (पराशर) अ. 14',
      divisionalRef: 'D1 व D3 (द्रेष्काण)',
      vakriNote: getVakriExplanation(mars),
      astroBasisHi: `तृतीयेश ${h3.lordHi} भाव ${h3.placedHouse} में (${h3.dignityHi}); मंगल भाव ${mars.houseNumber} में (${mars.dignity}); [SAV: ${sav[2]} बिंदु]।`,
      astroBasisEn: `3rd Lord in H${h3.placedHouse} (${h3.dignity}); Mars in H${mars.houseNumber} (${mars.dignity}); [SAV: ${sav[2]} bindus].`,
      verdictHi: `असाधारण पराक्रम, निर्भीक निर्णय लेने का सामर्थ्य तथा विषम परिस्थितियों में स्वयं मार्ग बनाने की शक्ति।`,
      verdictEn: `Formidable audacity, decisive action under pressure, and self-made initiative.`,
      detailedAnalysisHi: `महर्षि पराशर अनुसार तृतीय भाव उपचय भाव है। यहाँ बैठे या इसको देखने वाले ग्रह आयु के साथ जातक के साहस और पुरुषार्थ को कई गुना बढ़ाते हैं।`,
      detailedAnalysisEn: `BPHS confirms that the 3rd house as an Upachaya matures courage and industriousness over time.`,
      remedyHi: `मंगलवार के दिन हनुमान जी को लाल सिंदूर और चमेली का तेल अर्पित करें।`,
      remedyEn: `Apply red vermilion and jasmine oil to Lord Hanuman on Tuesdays for unconquerable vigor.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 20. छोटे भाई-बहनों का सुख व संबंध
  {
    const score = Math.max(35, Math.min(92, 50 + getDignityBonus(mars.dignity) + (h3.placedHouse !== 6 && h3.placedHouse !== 8 ? 10 : -8)));
    addDim({
      id: 20,
      houseNumber: 3,
      houseTitleHi: 'तृतीय भाव (सहज व पराक्रम)',
      houseTitleEn: '3rd House (Sahaja & Valour)',
      category: 'family',
      categoryTitleHi: 'माता-पिता व कुल',
      categoryTitleEn: 'Family & Lineage',
      titleHi: 'छोटे भाई-बहनों का सुख, भ्रातृ प्रेम व संबंध',
      titleEn: 'Younger Siblings, Fraternal Bonding & Kinship Joy',
      classicalRef: 'फलदीपिका (मंत्रेश्वर) अ. 8',
      divisionalRef: 'D1 व D3 (द्रेष्काण चक्र)',
      vakriNote: getVakriExplanation(mars),
      astroBasisHi: `तृतीयेश भाव ${h3.placedHouse} में; मंगल (भ्रातृकारक) भाव ${mars.houseNumber} में; तृतीय भाव में ग्रह।`,
      astroBasisEn: `3rd Lord in H${h3.placedHouse}; Mars (Bhratrikaraka) in H${mars.houseNumber}; 3rd house occupants.`,
      verdictHi: `भाई-बहनों से स्नेहपूर्ण संबंध; पारिवारिक दायित्वों में परस्पर संबल व आत्मीय सहयोग।`,
      verdictEn: `Warm fraternal bonds with mutual support and protective regard for younger siblings.`,
      detailedAnalysisHi: `मंत्रेश्वर अनुसार तृतीयेश की शुभ स्थिति छोटे भाई-बहनों के साथ सुखद और सहयोगपूर्ण वातावरण का निर्माण करती है।`,
      detailedAnalysisEn: `Phaladeepika establishes the 3rd lord as the bedrock of sibling affection and reciprocal loyalty.`,
      remedyHi: `भाई-बहनों को उपहार दें और उनके साथ किसी भी कटुता को संवाद से तुरंत सुलझाएं।`,
      remedyEn: `Gift sweets or books to siblings on festive occasions to nurture harmony.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 21. लेखन कला, पत्रकारिता व प्रकाशन
  {
    const score = Math.max(35, Math.min(95, 50 + getDignityBonus(mercury.dignity) + (h3.placedHouse === 3 || h3.placedHouse === 5 ? 12 : 0)));
    addDim({
      id: 21,
      houseNumber: 3,
      houseTitleHi: 'तृतीय भाव (सहज व पराक्रम)',
      houseTitleEn: '3rd House (Sahaja & Valour)',
      category: 'education',
      categoryTitleHi: 'शिक्षा व विद्या',
      categoryTitleEn: 'Education & Intellect',
      titleHi: 'लेखन कला, साहित्य सृजन, पत्रकारिता व प्रकाशन',
      titleEn: 'Authorship, Literary Talents, Journalism & Publishing',
      classicalRef: 'सारावली (कल्याण वर्मा) अ. 25',
      divisionalRef: 'D1 व D9 नवांश',
      vakriNote: getVakriExplanation(mercury),
      astroBasisHi: `बुध भाव ${mercury.houseNumber} में; तृतीयेश ${h3.lordHi} व पंचमेश ${h5.lordHi} का संबंध; लेखन प्रतिभा।`,
      astroBasisEn: `Mercury in H${mercury.houseNumber}; 3rd and 5th house confluence; literary creativity.`,
      verdictHi: `प्रभावशाली लेखन व विचार अभिव्यक्ति की स्वाभाविक क्षमता; पुस्तकों, शोधपत्रों अथवा डिजिटल लेखन में सफलता।`,
      verdictEn: `Compelling literary expression with high aptitude for book publishing, essays, and editorial journalism.`,
      detailedAnalysisHi: `कल्याण वर्मा के अनुसार जब बुध का तृतीय भाव से संबंध हो, तो जातक की लेखनी में अद्भुत आकर्षण और प्रभाव होता है।`,
      detailedAnalysisEn: `Saravali highlights that Mercury's alliance with the 3rd house turns ideas into published works of enduring value.`,
      remedyHi: `भगवान गणेश को नित्य दुर्वा अर्पित करें और लेखन आरंभ करने से पहले "ॐ गं गणपतये नमः" का स्मरण करें।`,
      remedyEn: `Offer fresh Durva grass to Lord Ganesha and chant his mantra before starting creative writings.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 22. संचार, डिजिटल मीडिया व आईटी कौशल
  {
    const score = Math.max(35, Math.min(95, 52 + getDignityBonus(mercury.dignity) + (rahu ? 10 : 0)));
    addDim({
      id: 22,
      houseNumber: 3,
      houseTitleHi: 'तृतीय भाव (सहज व पराक्रम)',
      houseTitleEn: '3rd House (Sahaja & Valour)',
      category: 'career',
      categoryTitleHi: 'करियर व पद',
      categoryTitleEn: 'Career & Authority',
      titleHi: 'डिजिटल मीडिया, इंटरनेट, सॉफ्टवेयर व आधुनिक संचार कौशल',
      titleEn: 'Digital Media, IT Acumen & Modern Communications',
      classicalRef: 'केपी रीडर्स (के.एस. कृष्णमूर्ति) रीडर 3',
      divisionalRef: 'D1 व D10 (दशमांश)',
      vakriNote: '',
      astroBasisHi: `तृतीय भाव (संचार) + बुध (सॉफ्टवेयर) + राहु (इंटरनेट/डिजिटल नेटवर्क) का प्रभाव।`,
      astroBasisEn: `3rd house (communication) + Mercury (logic) + Rahu (virtual networks) interaction.`,
      verdictHi: `आधुनिक डिजिटल टूल्स, इंटरनेट व संचार माध्यमों में तीव्र गति से दक्षता प्राप्त करने का योग।`,
      verdictEn: `Rapid mastery over digital tools, software architectures, internet workflows, and modern media.`,
      detailedAnalysisHi: `प्रो. के.एस. कृष्णमूर्ति अनुसार तृतीय भाव आधुनिक युग के टेलीकॉम, सॉफ्टवेयर और इंटरनेट संचार का प्रमुख केंद्र है।`,
      detailedAnalysisEn: `KP System identifies the 3rd house as the core nexus of digital transmissions, code, and virtual reach.`,
      remedyHi: `इलेक्ट्रॉनिक उपकरणों को व्यवस्थित रखें और बुधवार को पक्षियों को दाना डालें।`,
      remedyEn: `Keep technical workspace organized and donate to technical education programs.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 23. छोटी यात्राएं, दैनिक भ्रमण व टूरिंग
  {
    const score = Math.max(35, Math.min(90, 50 + (sav[2] >= 28 ? 10 : 0)));
    addDim({
      id: 23,
      houseNumber: 3,
      houseTitleHi: 'तृतीय भाव (सहज व पराक्रम)',
      houseTitleEn: '3rd House (Sahaja & Valour)',
      category: 'identity',
      categoryTitleHi: 'पहचान व आत्म',
      categoryTitleEn: 'Identity & Core Self',
      titleHi: 'छोटी यात्राएं, दैनिक भ्रमण, टूरिंग व आवागमन',
      titleEn: 'Short Distance Travels, Daily Commuting & Field Touring',
      classicalRef: 'जातकाभरण (ढूँढिराज) अ. 3',
      divisionalRef: 'D1 लग्न चक्र',
      vakriNote: '',
      astroBasisHi: `तृतीय भाव; चंद्रमा (गति कारक) व तृतीयेश की स्थिति; [SAV: ${sav[2]} बिंदु]।`,
      astroBasisEn: `3rd house; Moon (speed) & 3rd lord coordinates; [SAV: ${sav[2]} bindus].`,
      verdictHi: `दैनिक जीवन में निरंतर भ्रमण व छोटी यात्राएं; यात्राओं के माध्यम से नए अवसरों व संपर्कों का निर्माण।`,
      verdictEn: `Frequent short journeys and mobility opening productive professional networking horizons.`,
      detailedAnalysisHi: `जातकाभरण के अनुसार तृतीय भाव की शुभता जातक की यात्राओं को कष्टप्रद न बनाकर लाभदायी और सुखद बनाती है।`,
      detailedAnalysisEn: `Jatakabharana confirms that auspicious 3rd house rays make regular travels safe and fruitful.`,
      remedyHi: `यात्रा आरंभ करने से पहले थोड़ा गुड़ खाकर व जल पीकर प्रस्थान करें।`,
      remedyEn: `Consume a pinch of jaggery and sip pure water before embarking upon any journey.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 24. खेलकूद, एथलेटिक्स व शारीरिक फुर्ती
  {
    const score = Math.max(35, Math.min(95, 50 + getDignityBonus(mars.dignity) + (mars.houseNumber === 3 || mars.houseNumber === 6 ? 12 : 0)));
    addDim({
      id: 24,
      houseNumber: 3,
      houseTitleHi: 'तृतीय भाव (सहज व पराक्रम)',
      houseTitleEn: '3rd House (Sahaja & Valour)',
      category: 'identity',
      categoryTitleHi: 'पहचान व आत्म',
      categoryTitleEn: 'Identity & Core Self',
      titleHi: 'खेलकूद, एथलेटिक्स, मार्शल आर्ट व शारीरिक फुर्ती',
      titleEn: 'Athletics, Competitive Sports & Physical Agility',
      classicalRef: 'हाउ टू जज अ होरोस्कोप (डॉ. बी.वी. रमन) भाग 1',
      divisionalRef: 'D1 व D3 (द्रेष्काण)',
      vakriNote: getVakriExplanation(mars),
      astroBasisHi: `मंगल (मांसपेशी व फुर्ती कारक); तृतीय भाव (हाथ व कंधे) व षष्ठ भाव (प्रतियोगिता)।`,
      astroBasisEn: `Mars (muscles & reflexes); 3rd house (arms/shoulders) and 6th house (athletic competition).`,
      verdictHi: `तीव्र शारीरिक प्रतिक्रियाएं व खेलकूद में स्वाभाविक रुचि; नियमित व्यायाम से देह में उत्कृष्ट स्फूर्ति।`,
      verdictEn: `High motor agility, kinetic stamina, and natural flair for competitive outdoor sports or fitness.`,
      detailedAnalysisHi: `डॉ. बी.वी. रमन अनुसार तृतीय भाव हाथों और कंधों की शक्ति है। मंगल का बल जातक को शारीरिक खेलों में विजय दिलाता है।`,
      detailedAnalysisEn: `Dr. B.V. Raman notes that 3rd house governs athletic physical prowess and bodily reflexes.`,
      remedyHi: `दैनिक व्यायाम या योग का नियम बनाएं तथा सूर्य नमस्कार का नियमित अभ्यास करें।`,
      remedyEn: `Practice Surya Namaskar daily to tone physical musculature and invigorate the nervous system.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 25. कला, अभिनय, गायन व हस्तशिल्प
  {
    const score = Math.max(35, Math.min(95, 50 + getDignityBonus(venus.dignity) + (venus.houseNumber === 3 || venus.houseNumber === 5 ? 12 : 0)));
    addDim({
      id: 25,
      houseNumber: 3,
      houseTitleHi: 'तृतीय भाव (सहज व पराक्रम)',
      houseTitleEn: '3rd House (Sahaja & Valour)',
      category: 'identity',
      categoryTitleHi: 'पहचान व आत्म',
      categoryTitleEn: 'Identity & Core Self',
      titleHi: 'कला, संगीत, गायन, अभिनय व हस्तशिल्प कौशल',
      titleEn: 'Performing Arts, Music, Acting & Manual Craftsmanship',
      classicalRef: 'सर्वार्थ चिंतामणि (वेंकटेश शर्मा) अ. 3',
      divisionalRef: 'D1 व D9 नवांश',
      vakriNote: getVakriExplanation(venus),
      astroBasisHi: `शुक्र (कला व सौंदर्य कारक) भाव ${venus.houseNumber} में; तृतीय भाव व पंचम भाव का संबंध।`,
      astroBasisEn: `Venus (fine arts) in H${venus.houseNumber}; artistic dexterity through 3rd and 5th house resonance.`,
      verdictHi: `कलात्मक सौंदर्यबोध, संगीत अथवा हस्तशिल्प में उत्कृष्ट रचनात्मक रुचि व कला-पारखी दृष्टि।`,
      verdictEn: `Refined aesthetic sensibility with natural aptitude for vocal arts, music, or delicate craftsmanship.`,
      detailedAnalysisHi: `सर्वार्थ चिंतामणि के अनुसार तृतीय भाव हाथों के हुनर का है और शुक्र कला का। दोनों का मिलन जातक को कला के क्षेत्र में प्रतिष्ठा देता है।`,
      detailedAnalysisEn: `Sarvartha Chintamani establishes the 3rd house as the source of manual artistry and musical mastery.`,
      remedyHi: `घर में सुगंधित धूप या इत्र का प्रयोग करें और देवी सरस्वती की आराधना करें।`,
      remedyEn: `Offer white flowers and fragrant incense to Goddess Saraswati on Fridays.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 26. पड़ोसी, सहकर्मी व निकट सहयोगी
  {
    const score = Math.max(35, Math.min(90, 50 + (h3.placedHouse !== 6 && h3.placedHouse !== 8 ? 8 : -8)));
    addDim({
      id: 26,
      houseNumber: 3,
      houseTitleHi: 'तृतीय भाव (सहज व पराक्रम)',
      houseTitleEn: '3rd House (Sahaja & Valour)',
      category: 'family',
      categoryTitleHi: 'माता-पिता व कुल',
      categoryTitleEn: 'Family & Lineage',
      titleHi: 'पड़ोसी, सहकर्मी, निकट सहयोगी व सामाजिक सौहार्द',
      titleEn: 'Neighbors, Workplace Peers & Immediate Social Harmony',
      classicalRef: 'भावार्थ रत्नाकर (रामानुजाचार्य)',
      divisionalRef: 'D1 लग्न चक्र',
      vakriNote: '',
      astroBasisHi: `तृतीय भाव पर दृष्टियां: ${h3.aspects.map((a: any) => a.planetHi).join(', ') || 'कोई नहीं'}; पड़ोसियों से संबंध।`,
      astroBasisEn: `Aspects on 3rd house: ${h3.aspects.map((a: any) => a.planet).join(', ') || 'None'}; neighborhood rapport.`,
      verdictHi: `पड़ोसियों व कार्यक्षेत्र के सहकर्मियों के साथ सौहार्दपूर्ण व सहयोगात्मक संबंध; आकस्मिक अवसरों पर सहयोग।`,
      verdictEn: `Amiable neighborly relations and dependable teamwork with immediate colleagues.`,
      detailedAnalysisHi: `भावार्थ रत्नाकर अनुसार तृतीय भाव दैनिक परिवेश का सूचक है। इसकी शुभता आसपास के लोगों से शांति और सहयोग सुनिश्चित करती है।`,
      detailedAnalysisEn: `Bhavartha Ratnakara confirms that a benign 3rd house insulates against neighborhood squabbles.`,
      remedyHi: `पड़ोसियों व सहकर्मियों से व्यवहार में सदैव मधुरता रखें और पर्वों पर मिष्ठान्न बांटें।`,
      remedyEn: `Share festive sweets with neighbors to reinforce positive collective prana.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // =========================================================================
  // KHOND 4: चतुर्थ भाव (SUKHA BHAVA) — माता, गृह, भूमि, वाहन व शांति (27 से 35)
  // =========================================================================

  // 27. माता का सुख, स्वास्थ्य व संबंध
  {
    const score = Math.max(35, Math.min(95, 52 + getDignityBonus(moon.dignity) + (h4.placedHouse === 4 || h4.placedHouse === 1 || h4.placedHouse === 9 ? 12 : 0)));
    addDim({
      id: 27,
      houseNumber: 4,
      houseTitleHi: 'चतुर्थ भाव (सुख व मातृ भाव)',
      houseTitleEn: '4th House (Sukha & Matri)',
      category: 'family',
      categoryTitleHi: 'माता-पिता व कुल',
      categoryTitleEn: 'Family & Lineage',
      titleHi: 'माता का सुख, मातृ स्वास्थ्य, दीर्घायु व वात्सल्य',
      titleEn: 'Mother\'s Longevity, Maternal Health & Deep Bonding',
      classicalRef: 'बृहत्पाराशर होराशास्त्र (पराशर) अ. 15',
      divisionalRef: 'D1 व D12 (द्वादशांश)',
      vakriNote: getVakriExplanation(moon),
      astroBasisHi: `चतुर्थेश ${h4.lordHi} भाव ${h4.placedHouse} में (${h4.dignityHi}); चंद्रमा (मातृकारक) भाव ${moon.houseNumber} में; [SAV: ${sav[3]} बिंदु]।`,
      astroBasisEn: `4th Lord in H${h4.placedHouse} (${h4.dignity}); Moon (Matrikaraka) in H${moon.houseNumber}; [SAV: ${sav[3]} bindus].`,
      verdictHi: (h4.placedHouse === 4 || h4.placedHouse === 1 || h4.placedHouse === 9 || h4.dignity === 'Exalted' || h4.dignity === 'Own Sign')
        ? `अत्यंत प्रगाढ़ मातृ सुख व वात्सल्य; माता से उत्तम संस्कार व पैतृक संपत्ति का संरक्षण।`
        : `गहरा मातृ स्नेह व वात्सल्य; माता का आशीर्वाद जीवन के प्रत्येक मोड़ पर रक्षा कवच का कार्य करता है।`,
      verdictEn: (h4.placedHouse === 4 || h4.placedHouse === 1 || h4.placedHouse === 9 || h4.dignity === 'Exalted' || h4.dignity === 'Own Sign')
        ? `Profound maternal warmth and enduring joy through mother's upright guidance and cultural heritage.`
        : `Deep maternal affection, long-lived maternal influence, and protective maternal blessings.`,
      detailedAnalysisHi: `महर्षि पराशर के अनुसार चतुर्थ भाव माता का साक्षात स्वरूप है। चंद्रमा और चतुर्थेश का बली होना जातक के जीवन को असीम शांति प्रदान करता है।`,
      detailedAnalysisEn: `BPHS establishes the 4th house and Moon as the foundational pillar of unconditional maternal love.`,
      remedyHi: `नित्य प्रातः माता के चरण स्पर्श करें और सोमवार को शिवलिंग पर कच्चा दूध अर्पित करें।`,
      remedyEn: `Touch your mother's feet for blessings daily and offer raw milk on Shiva Lingam on Mondays.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 28. स्वयं का मकान, भवन निर्माण व फ्लैट
  {
    const score = Math.max(35, Math.min(96, 52 + (sav[3] >= 28 ? 12 : -8) + getDignityBonus(mars.dignity)));
    addDim({
      id: 28,
      houseNumber: 4,
      houseTitleHi: 'चतुर्थ भाव (सुख व मातृ भाव)',
      houseTitleEn: '4th House (Sukha & Matri)',
      category: 'wealth_fortune',
      categoryTitleHi: 'धन व समृद्धि',
      categoryTitleEn: 'Wealth & Prosperity',
      titleHi: 'स्वयं का मकान, स्वतंत्र भवन निर्माण व आवासीय सुख',
      titleEn: 'Own Residential Property, Home Construction & Apartments',
      classicalRef: 'फलदीपिका (मंत्रेश्वर) अ. 9',
      divisionalRef: 'D1 व D4 (चतुर्थांश)',
      vakriNote: getVakriExplanation(planets.find((p) => p.id === h4.lord)),
      astroBasisHi: `चतुर्थेश भाव ${h4.placedHouse} में (${h4.dignityHi}); मंगल (भूमि कारक) भाव ${mars.houseNumber} में; [SAV (सहायक): ${sav[3]} बिंदु]।`,
      astroBasisEn: `4th Lord in H${h4.placedHouse} (${h4.dignity}); Mars (Bhumikaraka) in H${mars.houseNumber}; [SAV: ${sav[3]} bindus].`,
      verdictHi: `स्व-अर्जित भव्य आवासीय भवन अथवा फ्लैट का प्रबल योग; गृह प्रवेश शुभ दशा में संपन्न।`,
      verdictEn: `High certainty of acquiring prime residential property or constructing self-owned residence.`,
      detailedAnalysisHi: `मंत्रेश्वर कृत फलदीपिका के अनुसार चतुर्थ भाव और मंगल का बली होना जातक को अपने नाम पर अचल संपत्ति और सुंदर मकान दिलाता है।`,
      detailedAnalysisEn: `Phaladeepika confirms that Mars and the 4th house together bestow self-owned real estate assets.`,
      remedyHi: `घर के ईशान कोण (उत्तर-पूर्व) को सदैव स्वच्छ व खुला रखें और वहां जल का कलश स्थापित करें।`,
      remedyEn: `Keep the North-East zone of your home immaculate and install a silver water vessel there.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 29. कृषि भूमि, भूखंड व अचल संपत्ति
  {
    const score = Math.max(35, Math.min(92, 50 + getDignityBonus(mars.dignity) + getDignityBonus(saturn.dignity)));
    addDim({
      id: 29,
      houseNumber: 4,
      houseTitleHi: 'चतुर्थ भाव (सुख व मातृ भाव)',
      houseTitleEn: '4th House (Sukha & Matri)',
      category: 'wealth_fortune',
      categoryTitleHi: 'धन व समृद्धि',
      categoryTitleEn: 'Wealth & Prosperity',
      titleHi: 'कृषि भूमि, व्यावसायिक भूखंड व दीर्घकालिक अचल संपत्ति',
      titleEn: 'Agricultural Land, Commercial Plots & Real Estate Assets',
      classicalRef: 'जातक पारिजात (वैद्यनाथ) अ. 11',
      divisionalRef: 'D1 व D4 (चतुर्थांश)',
      vakriNote: getVakriExplanation(saturn),
      astroBasisHi: `मंगल व शनि का संबंध; चतुर्थ भाव व दशम भाव की धुरी; भूमि क्रय-विक्रय लाभ।`,
      astroBasisEn: `Mars and Saturn interaction; 4th and 10th axis governing land holdings and property deals.`,
      verdictHi: `दीर्घकालिक भूमि निवेश व अचल संपत्तियों से प्रचुर वित्तीय लाभ; भूमि से जुड़े सौदे फलदायी।`,
      verdictEn: `Highly lucrative prospects in agricultural acreage, commercial plots, and real estate appreciation.`,
      detailedAnalysisHi: `जातक पारिजात के अनुसार शनि और मंगल का चतुर्थ भाव पर शुभ प्रभाव जातक को विस्तृत भूमि का स्वामी बनाता है।`,
      detailedAnalysisEn: `Jataka Parijata links Saturn's grounding and Mars's earth lordship to significant real estate holdings.`,
      remedyHi: `मंगलवार को भूमि पुत्र मंगल के निमित्त किसी वृक्ष के नीचे जल अर्पित करें।`,
      remedyEn: `Offer water to the earth at sunrise on Tuesdays to honor Bhumi Devi.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 30. वाहन सुख, लक्जरी गाड़ियां व सवारी
  {
    const score = Math.max(40, Math.min(96, 52 + getDignityBonus(venus.dignity) + (h4.placedHouse === 4 || h4.placedHouse === 9 ? 12 : 0)));
    addDim({
      id: 30,
      houseNumber: 4,
      houseTitleHi: 'चतुर्थ भाव (सुख व मातृ भाव)',
      houseTitleEn: '4th House (Sukha & Matri)',
      category: 'wealth_fortune',
      categoryTitleHi: 'धन व समृद्धि',
      categoryTitleEn: 'Wealth & Prosperity',
      titleHi: 'वाहन सुख, गाड़ियां, लक्जरी वाहन व आरामदायक यात्रा',
      titleEn: 'Conveyance, Vehicles, Luxury Automobiles & Travel Comfort',
      classicalRef: 'सर्वार्थ चिंतामणि (वेंकटेश शर्मा) अ. 4',
      divisionalRef: 'D1 व D16 (षोडशांश चक्र)',
      vakriNote: getVakriExplanation(venus),
      astroBasisHi: `शुक्र (वाहन कारक) भाव ${venus.houseNumber} में (${venus.dignity}); चतुर्थेश ${h4.lordHi} का बल; [SAV: ${sav[3]} बिंदु]।`,
      astroBasisEn: `Venus (Vahanakaraka) in H${venus.houseNumber} (${venus.dignity}); 4th lord strength; [SAV: ${sav[3]} bindus].`,
      verdictHi: `उत्कृष्ट वाहन सुख; जीवन में एक से अधिक उत्तम श्रेणी की गाड़ियों व आरामदायक वाहनों का स्वामित्व।`,
      verdictEn: `Plentiful conveyance bliss with ownership of reliable, premium-grade automobiles throughout life.`,
      detailedAnalysisHi: `सर्वार्थ चिंतामणि के अनुसार जब चतुर्थ भाव और शुक्र बली हों, तो जातक के द्वार पर सदा सुंदर वाहन सुशोभित रहते हैं।`,
      detailedAnalysisEn: `Sarvartha Chintamani establishes Venus and the 4th house as the sole architects of vehicular luxury.`,
      remedyHi: `वाहन में सदैव श्रीयंत्र अथवा हनुमान जी की छोटी प्रतिमा स्थापित रखें और वाहन को स्वच्छ रखें।`,
      remedyEn: `Keep a consecrated miniature protective deity in the vehicle and keep it well-maintained.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 31. गृहस्थ सुख, घरेलू सुख-शांति व पारिवारिक वातावरण
  {
    const score = Math.max(35, Math.min(92, 50 + getDignityBonus(jupiter.dignity) + (sav[3] >= 28 ? 10 : -8)));
    addDim({
      id: 31,
      houseNumber: 4,
      houseTitleHi: 'चतुर्थ भाव (सुख व मातृ भाव)',
      houseTitleEn: '4th House (Sukha & Matri)',
      category: 'family',
      categoryTitleHi: 'माता-पिता व कुल',
      categoryTitleEn: 'Family & Lineage',
      titleHi: 'गृहस्थ सुख, पारिवारिक सुख-शांति व घरेलू वातावरण',
      titleEn: 'Domestic Bliss, Home Tranquility & Harmonious Living',
      classicalRef: 'सारावली (कल्याण वर्मा) अ. 26',
      divisionalRef: 'D1 लग्न चक्र',
      vakriNote: '',
      astroBasisHi: `चतुर्थ भाव में शुभ ग्रह दृष्टि; गुरु व चंद्रमा का प्रभाव; घर में सकारात्मक ऊर्जा।`,
      astroBasisEn: `Benefic aspects on 4th house; Jupiter and Moon fostering tranquil domestic vibes.`,
      verdictHi: `सुखद व शांतिपूर्ण घरेलू वातावरण; घर में प्रवेश करते ही मानसिक तनाव से मुक्ति व विश्राम।`,
      verdictEn: `Serene domestic sanctuary offering deep psychological restoration and family harmony.`,
      detailedAnalysisHi: `सारावली के अनुसार चतुर्थ भाव की पवित्रता घर को मंदिर बनाती है जहाँ सभी सदस्य एक-दूसरे के प्रति समर्पित रहते हैं।`,
      detailedAnalysisEn: `Saravali confirms that a peaceful 4th house acts as a sanctuary from worldly tensions.`,
      remedyHi: `घर में सायंकाल गाय के घी का दीपक प्रज्वलित करें और कपूर की सुगंध से नकारात्मकता दूर करें।`,
      remedyEn: `Light a cow-ghee lamp at twilight in the home and burn pure camphor to purify psychic atmosphere.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 32. औपचारिक स्कूली व कॉलेज शिक्षा
  {
    const score = Math.max(35, Math.min(95, 52 + getDignityBonus(mercury.dignity) + getDignityBonus(jupiter.dignity)));
    addDim({
      id: 32,
      houseNumber: 4,
      houseTitleHi: 'चतुर्थ भाव (सुख व मातृ भाव)',
      houseTitleEn: '4th House (Sukha & Matri)',
      category: 'education',
      categoryTitleHi: 'शिक्षा व विद्या',
      categoryTitleEn: 'Education & Intellect',
      titleHi: 'औपचारिक स्कूली शिक्षा, स्नातक डिग्री व विद्या प्राप्ति',
      titleEn: 'Formal Schooling, Undergraduate College Degree & Academic Foundation',
      classicalRef: 'बृहत्पाराशर होराशास्त्र (पराशर) अ. 15',
      divisionalRef: 'D1 व D24 (सिद्धांश चक्र)',
      vakriNote: getVakriExplanation(mercury),
      astroBasisHi: `चतुर्थेश भाव ${h4.placedHouse} में; बुध (विद्या कारक) भाव ${mercury.houseNumber} में; गुरु की दृष्टि।`,
      astroBasisEn: `4th Lord in H${h4.placedHouse}; Mercury in H${mercury.houseNumber}; Jupiterian educational aspect.`,
      verdictHi: `उच्च कोटि की औपचारिक शिक्षा; स्नातक स्तर की डिग्री में उत्कृष्ट शैक्षणिक प्रदर्शन व सम्मान।`,
      verdictEn: `Distinguished foundational schooling and smooth graduation degree attainment with honors.`,
      detailedAnalysisHi: `महर्षि पराशर के अनुसार चतुर्थ भाव विद्या का मूल द्वार है। यहाँ बुध और गुरु का प्रभाव जातक को मेधावी छात्र बनाता है।`,
      detailedAnalysisEn: `BPHS confirms that the 4th house governs foundational degrees and structured learning disciplines.`,
      remedyHi: `विद्यार्थियों को शिक्षण सामग्री अथवा पुस्तकें दान करें और सरस्वती स्तोत्र का पाठ करें।`,
      remedyEn: `Donate notebooks or pens to deserving students and recite Saraswati Stotram.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 33. हृदय स्वास्थ्य, छाती व फेफड़े
  {
    const score = Math.max(35, Math.min(92, 50 + getDignityBonus(sun.dignity) + (h4.kartari === 'Subhakartari' ? 10 : h4.kartari === 'Papakartari' ? -12 : 0)));
    addDim({
      id: 33,
      houseNumber: 4,
      houseTitleHi: 'चतुर्थ भाव (सुख व मातृ भाव)',
      houseTitleEn: '4th House (Sukha & Matri)',
      category: 'longevity_health',
      categoryTitleHi: 'स्वास्थ्य व आयु',
      categoryTitleEn: 'Health & Longevity',
      titleHi: 'हृदय स्वास्थ्य, छाती, फेफड़े व श्वसन तंत्र',
      titleEn: 'Cardiovascular Health, Heart Resilience & Respiratory Organs',
      classicalRef: 'जातकाभरण (ढूँढिराज) अ. 15',
      divisionalRef: 'D1 व D30 (त्रिंशांश)',
      vakriNote: '',
      astroBasisHi: `सूर्य (हृदय कारक) भाव ${sun.houseNumber} में; चतुर्थ भाव पर पाप प्रभाव: ${h4.kartari}; चंद्रमा की स्थिति।`,
      astroBasisEn: `Sun (heart center) in H${sun.houseNumber}; 4th house kartari: ${h4.kartari}; Moon's chest indicators.`,
      verdictHi: `मजबूत हृदय स्वास्थ्य; नियमित प्राणायाम व तनाव-मुक्त दिनचर्या से हृदय चक्र पूर्णतः सुरक्षित।`,
      verdictEn: `Sound cardiovascular vitality; breathing exercises safeguard respiratory functions against fatigue.`,
      detailedAnalysisHi: `जातकाभरण के अनुसार सूर्य आत्मा और हृदय का कारक है। सूर्य की अनुकूलता हृदय को शक्ति और उत्साह प्रदान करती है।`,
      detailedAnalysisEn: `Jatakabharana identifies the Sun and 4th house as the dual guardians of cardiac equilibrium.`,
      remedyHi: `नित्य अनुलोम-विलोम प्राणायाम का 10 मिनट अभ्यास करें और हृदय में ईष्ट का ध्यान करें।`,
      remedyEn: `Practice 10 minutes of Anulom-Vilom pranayama daily to oxygenate cardiac tissues.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 34. जन्मभूमि से लगाव बनाम स्थानांतरण
  {
    const score = Math.max(35, Math.min(92, 50 + (h4.placedHouse === 12 || h4.placedHouse === 9 ? 15 : -5)));
    addDim({
      id: 34,
      houseNumber: 4,
      houseTitleHi: 'चतुर्थ भाव (सुख व मातृ भाव)',
      houseTitleEn: '4th House (Sukha & Matri)',
      category: 'career',
      categoryTitleHi: 'करियर व पद',
      categoryTitleEn: 'Career & Authority',
      titleHi: 'जन्मभूमि से लगाव बनाम दूर देश में स्थानांतरण व निवास',
      titleEn: 'Attachment to Motherland vs Relocation to Distant Lands',
      classicalRef: 'टाइमिंग ऑफ इवेंट्स (के.एन. राव)',
      divisionalRef: 'D1 व D4 (चतुर्थांश)',
      vakriNote: '',
      astroBasisHi: `चतुर्थ भाव (जन्मभूमि) व द्वादश भाव (दूर देश); राहु व चंद्रमा का प्रभाव; स्थान परिवर्तन योग।`,
      astroBasisEn: `4th house (native land) vs 12th house (distant lands); nodal wanderlust indicators.`,
      verdictHi: `जन्म स्थान से दूर अथवा अन्य नगर/देश में जाकर भाग्योदय व स्थायी समृद्धि का प्रबल योग।`,
      verdictEn: `Strong predisposition to relocate away from birthplace to tap lucrative foreign or distant fortunes.`,
      detailedAnalysisHi: `के.एन. राव के अनुसार जब चतुर्थेश द्वादश भाव से जुड़े या चर राशि में हो, तो जातक जन्मभूमि से दूर जाकर ही कीर्ति अर्जित करता है।`,
      detailedAnalysisEn: `K.N. Rao proves that displacement from birthplace triggers accelerated career ascent.`,
      remedyHi: `जन्मभूमि से दूर रहते हुए भी अपने मूल संस्कारों और पैतृक देवस्थान का नमन करते रहें।`,
      remedyEn: `Maintain reverence for ancestral origins and support cultural foundations of motherland.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 35. मानसिक स्थिरता, अवसाद मुक्ति व सुख अनुभूति
  {
    const score = Math.max(35, Math.min(95, 52 + getDignityBonus(moon.dignity) + (sav[3] >= 28 ? 10 : -8)));
    addDim({
      id: 35,
      houseNumber: 4,
      houseTitleHi: 'चतुर्थ भाव (सुख व मातृ भाव)',
      houseTitleEn: '4th House (Sukha & Matri)',
      category: 'longevity_health',
      categoryTitleHi: 'स्वास्थ्य व आयु',
      categoryTitleEn: 'Health & Longevity',
      titleHi: 'मानसिक स्थिरता, अवसाद मुक्ति, आंतरिक शांति व सुख',
      titleEn: 'Mental Stability, Freedom from Depression & Inner Contentment',
      classicalRef: 'फलदीपिका (मंत्रेश्वर) अ. 14',
      divisionalRef: 'D1 व D9 नवांश',
      vakriNote: getVakriExplanation(moon),
      astroBasisHi: `चंद्रमा (मन) भाव ${moon.houseNumber} में; चतुर्थ भाव में ${sav[3]} SAV बिंदु; शुभ दृष्टियां।`,
      astroBasisEn: `Moon in H${moon.houseNumber}; 4th house fortified with ${sav[3]} SAV points; psychological resilience.`,
      verdictHi: `सुदृढ़ मानसिक संतुलन; जीवन के बड़े उतार-चढ़ावों में भी आंतरिक शांति व संयम बनाए रखने की क्षमता।`,
      verdictEn: `Superb psychological equilibrium; immunity against debilitating depression and mood volatility.`,
      detailedAnalysisHi: `मंत्रेश्वर के अनुसार मन का सुख चतुर्थ भाव से देखा जाता है। शुभ ग्रहों के प्रभाव से जातक भीतर से सदा संतुष्ट और शांत रहता है।`,
      detailedAnalysisEn: `Phaladeepika confirms that a well-aspected 4th house grants enduring inner happiness.`,
      remedyHi: `पूर्णिमा को खीर बनाकर चंद्रदेव को अर्पित करें और उसका सेवन करें।`,
      remedyEn: `Offer sweet milk rice porridge under the Full Moon and consume it for serene mental aura.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // =========================================================================
  // KHOND 5: पंचम भाव (PUTRA BHAVA) — बुद्धि, संतान, पूर्वपुण्य, मंत्र व सट्टा (36 से 45)
  // =========================================================================

  // 36. तीव्र स्मरण शक्ति, कुशाग्र मेधा व IQ
  {
    const score = Math.max(40, Math.min(96, 54 + getDignityBonus(mercury.dignity) + getDignityBonus(jupiter.dignity)));
    addDim({
      id: 36,
      houseNumber: 5,
      houseTitleHi: 'पंचम भाव (पुत्र व बुद्धि भाव)',
      houseTitleEn: '5th House (Putra & Buddhi)',
      category: 'education',
      categoryTitleHi: 'शिक्षा व विद्या',
      categoryTitleEn: 'Education & Intellect',
      titleHi: 'तीव्र स्मरण शक्ति, कुशाग्र मेधा, विश्लेषणात्मक बुद्धि व IQ',
      titleEn: 'Analytical Intellect, Photographic Memory & High IQ',
      classicalRef: 'बृहत्पाराशर होराशास्त्र (पराशर) अ. 16',
      divisionalRef: 'D1 व D24 (सिद्धांश)',
      vakriNote: getVakriExplanation(mercury),
      astroBasisHi: `पंचमेश ${h5.lordHi} भाव ${h5.placedHouse} में (${h5.dignityHi}); बुध भाव ${mercury.houseNumber} में; गुरु की शुभ दृष्टि।`,
      astroBasisEn: `5th Lord in H${h5.placedHouse} (${h5.dignity}); Mercury in H${mercury.houseNumber}; Jupiterian wisdom aspect.`,
      verdictHi: `कुशाग्र मेधा, तीव्र ग्राह्य शक्ति व जटिल से जटिल विषयों को सरलता से आत्मसात करने की क्षमता।`,
      verdictEn: `Sharp analytical intellect, penetrating conceptual retention, and stellar problem-solving IQ.`,
      detailedAnalysisHi: `महर्षि पराशर के अनुसार पंचम भाव पूर्व जन्म के ज्ञान का भंडार है। बुध और पंचमेश का बल जातक को विलक्षण प्रतिभा का धनी बनाता है।`,
      detailedAnalysisEn: `BPHS confirms that the 5th house unlocks past-life intellectual aptitudes and rapid cognitive learning.`,
      remedyHi: `नित्य ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः अथवा गायत्री मंत्र का एकाग्रता से जप करें।`,
      remedyEn: `Chant Budha Beeja Mantra or Medha Suktam to amplify cognitive synapses.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 37. संतानोत्पत्ति, संतान संख्या व वंश परंपरा
  {
    const score = Math.max(35, Math.min(95, 52 + getDignityBonus(jupiter.dignity) + (sav[4] >= 28 ? 10 : -8)));
    addDim({
      id: 37,
      houseNumber: 5,
      houseTitleHi: 'पंचम भाव (पुत्र व बुद्धि भाव)',
      houseTitleEn: '5th House (Putra & Buddhi)',
      category: 'progeny',
      categoryTitleHi: 'संतान व वंश',
      categoryTitleEn: 'Progeny & Lineage',
      titleHi: 'संतानोत्पत्ति, संतान संख्या, कुल वृद्धि व वंश परंपरा',
      titleEn: 'Progeny Conception, Family Lineage & Childbirth Mode',
      classicalRef: 'फलदीपिका (मंत्रेश्वर) अ. 10',
      divisionalRef: 'D1 व D7 (सप्तांश चक्र)',
      vakriNote: getVakriExplanation(jupiter),
      astroBasisHi: `पंचमेश भाव ${h5.placedHouse} में; गुरु (संतान कारक) भाव ${jupiter.houseNumber} में (${jupiter.dignity}); [SAV: ${sav[4]} बिंदु]।`,
      astroBasisEn: `5th Lord in H${h5.placedHouse}; Jupiter (Putrakaraka) in H${jupiter.houseNumber} (${jupiter.dignity}); [SAV: ${sav[4]}].`,
      verdictHi: `शुभ व सुसंस्कृत संतान का योग; वंश परंपरा को आगे बढ़ाने वाले योग्य पुत्र/पुत्री की प्राप्ति।`,
      verdictEn: `Blessed progeny lineage with cultured, dutiful children who bring pride to ancestral lineage.`,
      detailedAnalysisHi: `मंत्रेश्वर अनुसार गुरु और पंचमेश की अनुकूलता जातक को योग्य संतान का सुख देती है जो कुल का मान बढ़ाती है।`,
      detailedAnalysisEn: `Phaladeepika establishes Jupiter and 5th house as the supreme arbiters of progeny fulfillment.`,
      remedyHi: `संतान सुख व रक्षा हेतु नित्य संतान गोपाल मंत्र का जप करें।`,
      remedyEn: `Chant Santan Gopal Mantra daily for joyful progeny conception and child wellness.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 38. संतान का स्वास्थ्य, चरित्र व उसकी उन्नति
  {
    const score = Math.max(35, Math.min(92, 50 + getDignityBonus(h5.dignity) + (h5.placedHouse === 1 || h5.placedHouse === 5 || h5.placedHouse === 9 ? 12 : 0)));
    addDim({
      id: 38,
      houseNumber: 5,
      houseTitleHi: 'पंचम भाव (पुत्र व बुद्धि भाव)',
      houseTitleEn: '5th House (Putra & Buddhi)',
      category: 'progeny',
      categoryTitleHi: 'संतान व वंश',
      categoryTitleEn: 'Progeny & Lineage',
      titleHi: 'संतान का स्वास्थ्य, चरित्र, उन्नति व वृद्धावस्था में सेवा',
      titleEn: 'Children\'s Health, Moral Stature & Filial Devotion in Old Age',
      classicalRef: 'जातक पारिजात (वैद्यनाथ) अ. 13',
      divisionalRef: 'D1 व D7 (सप्तांश)',
      vakriNote: '',
      astroBasisHi: `पंचमेश भाव ${h5.placedHouse} में; नवमेश ${h9.lordHi} का संबंध; संतान के उच्च संस्कार।`,
      astroBasisEn: `5th Lord in H${h5.placedHouse}; 9th Lord affinity; noble filial character.`,
      verdictHi: `संतान संस्कारी, स्वावलंबी व आज्ञाकारी सिद्ध होगी; परिपक्व आयु में माता-पिता की सच्ची सेवा।`,
      verdictEn: `Noble filial devotion; children achieve distinguished status and provide heartfelt solace in mature years.`,
      detailedAnalysisHi: `जातक पारिजात अनुसार जब पंचमेश नवम भाव से जुड़े तो संतान कुलदीपक बनकर परिवार का नाम रोशन करती है।`,
      detailedAnalysisEn: `Jataka Parijata confirms that 5th-9th house resonance yields exemplary filial character.`,
      remedyHi: `संतान के नाम से किसी गौशाला में हरी घास अथवा गुड़ दान करें।`,
      remedyEn: `Feed green grass to cows in your child's name for their long life and auspicious fortune.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 39. उच्च शिक्षा, शोध व विशेषज्ञता
  {
    const score = Math.max(40, Math.min(96, 52 + getDignityBonus(jupiter.dignity) + (h5.placedHouse === 5 || h5.placedHouse === 9 ? 14 : 0)));
    addDim({
      id: 39,
      houseNumber: 5,
      houseTitleHi: 'पंचम भाव (पुत्र व बुद्धि भाव)',
      houseTitleEn: '5th House (Putra & Buddhi)',
      category: 'education',
      categoryTitleHi: 'शिक्षा व विद्या',
      categoryTitleEn: 'Education & Intellect',
      titleHi: 'उच्च स्नातकोत्तर शिक्षा, शोध, डॉक्टरेट व विषय विशेषज्ञता',
      titleEn: 'Higher Postgraduate Education, Research & Academic Specialization',
      classicalRef: 'सर्वार्थ चिंतामणि (वेंकटेश शर्मा) अ. 5',
      divisionalRef: 'D1 व D24 (सिद्धांश)',
      vakriNote: getVakriExplanation(jupiter),
      astroBasisHi: `पंचमेश भाव ${h5.placedHouse} में; गुरु भाव ${jupiter.houseNumber} में; उच्च शिक्षा व शोध योग।`,
      astroBasisEn: `5th Lord in H${h5.placedHouse}; Jupiter in H${jupiter.houseNumber}; doctoral research indicators.`,
      verdictHi: `मास्टर्स डिग्री, शोध उपाधि (Ph.D.) अथवा किसी विशिष्ट क्षेत्र में सर्वोच्च तकनीकी/व्यावसायिक विशेषज्ञता।`,
      verdictEn: `Master's degree, doctorate, or premier professional specialization with high intellectual authority.`,
      detailedAnalysisHi: `सर्वार्थ चिंतामणि के अनुसार पंचम और नवम भाव का सुदृढ़ होना जातक को सामान्य विद्यार्थी से उठाकर उच्च कोटि का शोधार्थी बनाता है।`,
      detailedAnalysisEn: `Sarvartha Chintamani links 5th-9th trine perfection to groundbreaking academic research and patents.`,
      remedyHi: `गुरुवार को पीले वस्त्र धारण करें और गुरुजनों का आदरपूर्वक नमन करें।`,
      remedyEn: `Honor academic preceptors on Thursdays and wear yellow or saffron colors during study sessions.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 40. पूर्व जन्म के संचित पुण्य व ईश्वरीय कृपा
  {
    const score = Math.max(45, Math.min(98, 55 + getDignityBonus(jupiter.dignity) + (sav[4] >= 28 ? 12 : 0)));
    addDim({
      id: 40,
      houseNumber: 5,
      houseTitleHi: 'पंचम भाव (पुत्र व बुद्धि भाव)',
      houseTitleEn: '5th House (Putra & Buddhi)',
      category: 'spirituality',
      categoryTitleHi: 'आध्यात्म व मोक्ष',
      categoryTitleEn: 'Spirituality & Grace',
      titleHi: 'पूर्व जन्म के संचित पुण्य, प्रारब्ध कवच व ईश्वरीय अनुकंपा',
      titleEn: 'Purva Punya, Accumulated Merit & Divine Karmic Armor',
      classicalRef: 'सारावली (कल्याण वर्मा) अ. 27',
      divisionalRef: 'D1, D9 व D60 (षष्ठ्यांश)',
      vakriNote: '',
      astroBasisHi: `पंचम भाव (पूर्वपुण्य स्थान); गुरु की शुभ दृष्टि; संकट के समय स्वतः उभरती दैवीय सहायता।`,
      astroBasisEn: `5th house (past karmic reservoir); Jupiter's grace providing spontaneous rescue in crises.`,
      verdictHi: `अति-प्रबल पूर्व पुण्य कोष; जीवन के सबसे जटिल संकटों में भी कोई न कोई अदृश्य दैवीय शक्ति रक्षा करती है।`,
      verdictEn: `Profound reservoir of past-life merit shielding against catastrophic hazards at the final moment.`,
      detailedAnalysisHi: `कल्याण वर्मा की सारावली अनुसार पंचम भाव पूर्व जन्म के सत्कर्मों की तिजोरी है। यहाँ शुभ ग्रहों का वास जातक को ईश्वरीय सुरक्षा देता है।`,
      detailedAnalysisEn: `Saravali demonstrates that 5th house beneficence manifests as instantaneous miraculous deliverance.`,
      remedyHi: `दीन-दुखियों व असहायों की गुप्त रूप से सहायता करें तथा निस्वार्थ सेवा को जीवन का अंग बनाएं।`,
      remedyEn: `Perform unadvertised acts of charity to replenish the generational reservoir of Purva Punya.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 41. शेयर बाजार, क्रिप्टो, लॉटरी व सट्टा लाभ
  {
    const score = Math.max(35, Math.min(92, 50 + (sav[4] >= 28 ? 10 : -10) + (rahu?.houseNumber === 5 || rahu?.houseNumber === 11 ? 12 : 0)));
    addDim({
      id: 41,
      houseNumber: 5,
      houseTitleHi: 'पंचम भाव (पुत्र व बुद्धि भाव)',
      houseTitleEn: '5th House (Putra & Buddhi)',
      category: 'wealth_fortune',
      categoryTitleHi: 'धन व समृद्धि',
      categoryTitleEn: 'Wealth & Prosperity',
      titleHi: 'शेयर बाजार, क्रिप्टो, सट्टा, लॉटरी व आकस्मिक लाभ',
      titleEn: 'Stock Market, Speculation, Crypto Trading & Windfall Gains',
      classicalRef: 'केपी रीडर्स (के.एस. कृष्णमूर्ति) रीडर 4',
      divisionalRef: 'D1 व D2 (होरा चक्र)',
      vakriNote: '',
      astroBasisHi: `पंचम भाव (सट्टा) व एकादश भाव (लाभ); राहु व बुध का प्रभाव; [SAV: पंचम ${sav[4]} बिंदु]।`,
      astroBasisEn: `5th house (speculation) & 11th house (windfall); Rahu & Mercury speculative axis.`,
      verdictHi: `दीर्घकालिक इक्विटी व सुनियोजित निवेश में उत्तम लाभ; अंधाधुंध सट्टेबाजी से बचना आवश्यक।`,
      verdictEn: `Disciplined wealth creation through systematic equities; reckless intraday speculation cautioned.`,
      detailedAnalysisHi: `केपी सिस्टम अनुसार 5वें और 11वें कस्पल सब-लॉर्ड का संबंध जब 2 और 11 भावों से हो, तभी शेयर बाजार में अकूत धन लाभ होता है।`,
      detailedAnalysisEn: `KP System confirms that 5th and 11th cuspal links to 2nd house govern windfall trading wealth.`,
      remedyHi: `बुधवार को गणेश जी को 21 मोदक या लड्डू का भोग लगाएं और पक्षियों को बाजरा खिलाएं।`,
      remedyEn: `Offer modakas to Lord Ganesha on Wednesdays and practice disciplined stop-loss risk management.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 42. मंत्र सिद्धि, ईष्ट देव साधना व तंत्र ज्ञान
  {
    const score = Math.max(40, Math.min(96, 52 + getDignityBonus(jupiter.dignity) + (ketu?.houseNumber === 5 || ketu?.houseNumber === 9 ? 15 : 0)));
    addDim({
      id: 42,
      houseNumber: 5,
      houseTitleHi: 'पंचम भाव (पुत्र व बुद्धि भाव)',
      houseTitleEn: '5th House (Putra & Buddhi)',
      category: 'spirituality',
      categoryTitleHi: 'आध्यात्म व मोक्ष',
      categoryTitleEn: 'Spirituality & Grace',
      titleHi: 'मंत्र सिद्धि, ईष्ट देव साधना, गुप्त विद्या व तंत्र ज्ञान',
      titleEn: 'Mantra Siddhi, Ishta Devata Realization & Esoteric Wisdom',
      classicalRef: 'बृहत्पाराशर होराशास्त्र (पराशर) अ. 34',
      divisionalRef: 'D1 व D20 (विंशांश चक्र)',
      vakriNote: getVakriExplanation(jupiter),
      astroBasisHi: `पंचमेश भाव ${h5.placedHouse} में; गुरु व केतु का संबंध; मंत्र जप से शीघ्र फल प्राप्ति योग।`,
      astroBasisEn: `5th Lord in H${h5.placedHouse}; Jupiter & Ketu spiritual alliance; rapid mantra siddhi potential.`,
      verdictHi: `मंत्र साधना में त्वरित सिद्धि व ईष्ट देव की साक्षात कृपा; आध्यात्मिक अंतःप्रेरणा अत्यंत जागृत।`,
      verdictEn: `High receptivity to sacred mantra vibrations and swift awakening of intuitive spiritual perception.`,
      detailedAnalysisHi: `महर्षि पराशर अनुसार पंचम भाव मंत्र का घर है। यहाँ गुरु अथवा केतु का प्रभाव जातक के मंत्रों को संजीवनी शक्ति प्रदान करता है।`,
      detailedAnalysisEn: `BPHS confirms that Jupiter's or Ketu's touch on the 5th house empowers sacred recitations with Siddhi.`,
      remedyHi: `अपने ईष्ट देव के मूल मंत्र का रुद्राक्ष अथवा तुलसी की माला पर नित्य 108 बार एकांत में जप करें।`,
      remedyEn: `Chant your Ishta Devata mantra 108 times daily on Tulsi or Rudraksha beads in silent solitude.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 43. प्रेम संबंध, रोमांस व आकर्षण
  {
    const score = Math.max(35, Math.min(92, 50 + getDignityBonus(venus.dignity) + (h5.placedHouse === 7 || h7.placedHouse === 5 ? 14 : 0)));
    addDim({
      id: 43,
      houseNumber: 5,
      houseTitleHi: 'पंचम भाव (पुत्र व बुद्धि भाव)',
      houseTitleEn: '5th House (Putra & Buddhi)',
      category: 'marriage',
      categoryTitleHi: 'विवाह व दांपत्य',
      categoryTitleEn: 'Marriage & Conjugal Life',
      titleHi: 'प्रेम संबंध, रोमांस, हार्दिक आकर्षण व परिणय योग',
      titleEn: 'Romantic Courtship, Heartfelt Attraction & Love Marriage',
      classicalRef: 'भावार्थ रत्नाकर (रामानुजाचार्य)',
      divisionalRef: 'D1 व D9 नवांश',
      vakriNote: getVakriExplanation(venus),
      astroBasisHi: `पंचमेश व सप्तमेश का संबंध; शुक्र भाव ${venus.houseNumber} में; प्रेम संबंधों का विवाह में रूपांतरण।`,
      astroBasisEn: `5th and 7th house connection; Venus in H${venus.houseNumber}; love courtship culminating in marriage.`,
      verdictHi: `सच्चे व निष्ठावान प्रेम संबंध; पंचम-सप्तम संबंध के प्रभाव से प्रेम विवाह अथवा सुदृढ़ हार्दिक बंधन।`,
      verdictEn: `Deep emotional fidelity; favorable astrological indicators for romantic alliance maturing into sacred wedlock.`,
      detailedAnalysisHi: `भावार्थ रत्नाकर के अनुसार जब पंचमेश और सप्तमेश में दृष्टि या युति संबंध हो, तो प्रेम संबंध विवाह का रूप लेता है।`,
      detailedAnalysisEn: `Bhavartha Ratnakara verifies that 5th-7th lord mutual reception converts courtship into lifelong wedlock.`,
      remedyHi: `शुक्रवार को मां लक्ष्मी व भगवान विष्णु का संयुक्त पूजन करें और सुगंधित श्वेत पुष्प अर्पित करें।`,
      remedyEn: `Worship Lakshmi-Narayana on Fridays with fragrant white blossoms for pure romantic longevity.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 44. रचनात्मकता, मौलिक आविष्कार व रचनाधर्मिता
  {
    const score = Math.max(35, Math.min(95, 50 + getDignityBonus(sun.dignity) + getDignityBonus(mercury.dignity)));
    addDim({
      id: 44,
      houseNumber: 5,
      houseTitleHi: 'पंचम भाव (पुत्र व बुद्धि भाव)',
      houseTitleEn: '5th House (Putra & Buddhi)',
      category: 'education',
      categoryTitleHi: 'शिक्षा व विद्या',
      categoryTitleEn: 'Education & Intellect',
      titleHi: 'रचनात्मकता, मौलिक आविष्कार, पेटेंट व रचनाधर्मिता',
      titleEn: 'Original Creativity, Patents & Inventive Genius',
      classicalRef: 'फलदीपिका (मंत्रेश्वर) अ. 10',
      divisionalRef: 'D1 व D9 नवांश',
      vakriNote: '',
      astroBasisHi: `सूर्य, बुध व पंचमेश की त्रिकोणीय स्थिति; मौलिक चिंतन व नवोन्मेषी मस्तिष्क।`,
      astroBasisEn: `Sun, Mercury & 5th house trines; high capacity for pioneering creative and patentable inventions.`,
      verdictHi: `विशिष्ट मौलिक सोच; पुरानी लीक से हटकर नए सिद्धांतों, डिज़ाइनों अथवा उत्पादों की रचना का सामर्थ्य।`,
      verdictEn: `Trailblazing originality; capability to author groundbreaking designs, patents, or artistic frameworks.`,
      detailedAnalysisHi: `मंत्रेश्वर के अनुसार पंचम भाव जब सूर्य और बुध के प्रभाव में हो, तो जातक समाज को नई दिशा देने वाले आविष्कारों का जनक बनता है।`,
      detailedAnalysisEn: `Phaladeepika demonstrates that solar and mercurial rays upon the 5th house spawn visionary innovators.`,
      remedyHi: `प्रातः ध्यान के समय उगते हुए सूर्य के सामने 5 मिनट मौन रहकर रचनात्मक ऊर्जा का आह्वान करें।`,
      remedyEn: `Meditate silently for 5 minutes facing the rising Sun to awaken inventive solar genius.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 45. पद-प्रतिष्ठा, नीति-कौशल व परामर्श क्षमता
  {
    const score = Math.max(40, Math.min(96, 52 + getDignityBonus(jupiter.dignity) + (h5.placedHouse === 10 || h10.placedHouse === 5 ? 14 : 0)));
    addDim({
      id: 45,
      houseNumber: 5,
      houseTitleHi: 'पंचम भाव (पुत्र व बुद्धि भाव)',
      houseTitleEn: '5th House (Putra & Buddhi)',
      category: 'career',
      categoryTitleHi: 'करियर व पद',
      categoryTitleEn: 'Career & Authority',
      titleHi: 'नीति-कौशल, रणनीतिक परामर्श, मंत्री पद व प्रतिष्ठा',
      titleEn: 'Strategic Advisory Acumen, Statesmanship & High Office',
      classicalRef: 'जातक पारिजात (वैद्यनाथ) अ. 13',
      divisionalRef: 'D1 व D10 (दशमांश)',
      vakriNote: getVakriExplanation(jupiter),
      astroBasisHi: `पंचमेश भाव ${h5.placedHouse} में; दशमेश भाव ${h10.placedHouse} में; गुरु की नीति-निपुण दृष्टि।`,
      astroBasisEn: `5th Lord in H${h5.placedHouse}; 10th Lord in H${h10.placedHouse}; Jupiterian strategic intellect.`,
      verdictHi: `उच्च रणनीतिक परामर्शदाता; शासन, कॉर्पोरेट अथवा समाज में महत्वपूर्ण नीति-निर्धारक पद का योग।`,
      verdictEn: `High statesman acumen; natural destiny as an indispensable strategic advisor and policy architect.`,
      detailedAnalysisHi: `जातक पारिजात के अनुसार पंचम भाव राजा के मंत्री का होता है। यहाँ शुभ ग्रह होने से बड़े-बड़े अधिकारी जातक से परामर्श लेते हैं।`,
      detailedAnalysisEn: `Jataka Parijata identifies the 5th house as the counselor's throne behind monarchs and heads of state.`,
      remedyHi: `गुरुवार को पीले चने की दाल और केले का दान करें और निष्पक्ष न्याय का पालन करें।`,
      remedyEn: `Donate yellow split chickpeas and bananas on Thursdays to sustain righteous counseling authority.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // The remaining houses (Houses 6 to 12 - Dimensions 46 to 101) are generated via companion generator
  appendRemainingDimensions(ctx, dims, getAuspiciousness, getDignityBonus, getVakriExplanation, getVakriExplanationEn);

  return dims;
}

// Function to append Dimensions 46 to 101 seamlessly
function appendRemainingDimensions(
  ctx: Classical101Context,
  dims: LifeDimensionReading[],
  getAuspiciousness: (score: number) => AuspiciousnessLevel,
  getDignityBonus: (dignity?: string) => number,
  getVakriExplanation: (p: any) => string,
  getVakriExplanationEn: (p: any) => string
) {
  const {
    chart, ascSign, ascSignName, ascSignHi, planets, sav, currentAge,
    mdLord, adLord, mdLordHi, adLordHi, getHLord, getAspectsOnHouse, getKartariOnHouse
  } = ctx;

  const getP = (id: NineGrahaId) => planets.find((p) => p.id === id) || planets[0];
  const sun = getP('Sun');
  const moon = getP('Moon');
  const mars = getP('Mars');
  const mercury = getP('Mercury');
  const jupiter = getP('Jupiter');
  const venus = getP('Venus');
  const saturn = getP('Saturn');
  const rahu = planets.find((p) => p.id === 'Rahu');
  const ketu = planets.find((p) => p.id === 'Ketu');

  const h1 = getHLord(1);
  const h2 = getHLord(2);
  const h3 = getHLord(3);
  const h4 = getHLord(4);
  const h5 = getHLord(5);
  const h6 = getHLord(6);
  const h7 = getHLord(7);
  const h8 = getHLord(8);
  const h9 = getHLord(9);
  const h10 = getHLord(10);
  const h11 = getHLord(11);
  const h12 = getHLord(12);

  const addDim = (d: LifeDimensionReading) => {
    dims.push(d);
  };

  // =========================================================================
  // KHOND 6: षष्ठ भाव (ROGA/SHATRU BHAVA) — रोग, ऋण, शत्रु, कोर्ट व सेवा (46 से 54)
  // =========================================================================

  // 46. शारीरिक व्याधियां, दीर्घकालिक रोग व अरिष्ट
  {
    const score = Math.max(35, Math.min(92, 55 + (sav[5] <= 28 ? 10 : -8) + (h6.placedHouse === 6 ? 10 : 0)));
    addDim({
      id: 46,
      houseNumber: 6,
      houseTitleHi: 'षष्ठ भाव (रोग, ऋण व शत्रु)',
      houseTitleEn: '6th House (Roga & Shatru)',
      category: 'longevity_health',
      categoryTitleHi: 'स्वास्थ्य व आयु',
      categoryTitleEn: 'Health & Longevity',
      titleHi: 'शारीरिक व्याधियां, दीर्घकालिक रोग निवारण व अरिष्ट शांति',
      titleEn: 'Chronic Illness Resistance, Pathology Vulnerability & Healing',
      classicalRef: 'फलदीपिका (मंत्रेश्वर) अ. 14',
      divisionalRef: 'D1 व D28 (त्रिंशांश चक्र)',
      vakriNote: '',
      astroBasisHi: `षष्ठ भाव में ग्रह: ${h6.occupants.map((o: any) => HINDI_PLANETS[o.id] || o.id).join(', ') || 'कोई नहीं'}; षष्ठेश भाव ${h6.placedHouse} में; [SAV: ${sav[5]} बिंदु]।`,
      astroBasisEn: `Occupants in H6: ${h6.occupants.map((o: any) => o.id).join(', ') || 'None'}; 6th lord in H${h6.placedHouse}; [SAV: ${sav[5]}].`,
      verdictHi: `रोगों पर त्वरित विजय; प्राकृतिक जीवन शैली व नियमित खान-पान से दीर्घकालिक रोगों से अचूक बचाव।`,
      verdictEn: `Strong disease recuperation; disciplined lifestyle keeps latent inflammatory pathologies suppressed.`,
      detailedAnalysisHi: `मंत्रेश्वर के अनुसार षष्ठ भाव उपचय भाव है। जब यहाँ शुभ ग्रहों की दृष्टि हो या षष्ठेश बली हो, तो शरीर रोगों को तुरंत परास्त कर देता है।`,
      detailedAnalysisEn: `Phaladeepika confirms that a well-regulated 6th house overcomes disease through metabolic vigor.`,
      remedyHi: `नित्य धन्वंतरि स्तोत्र का पाठ करें और तांबे के पात्र में रखा जल पिएं।`,
      remedyEn: `Recite Dhanvantari Stotram and drink water stored overnight in a pure copper vessel.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 47. ऋण, कर्ज, बैंक लोन व ईएमआई दायित्व
  {
    const score = Math.max(35, Math.min(95, 52 + (sav[5] <= 28 ? 12 : -8) + (sav[10] >= 28 ? 10 : -5)));
    addDim({
      id: 47,
      houseNumber: 6,
      houseTitleHi: 'षष्ठ भाव (रोग, ऋण व शत्रु)',
      houseTitleEn: '6th House (Roga & Shatru)',
      category: 'wealth_fortune',
      categoryTitleHi: 'धन व समृद्धि',
      categoryTitleEn: 'Wealth & Prosperity',
      titleHi: 'ऋण मुक्ति, बैंक लोन प्रबंधन व वित्तीय देनदारियों से मुक्ति',
      titleEn: 'Debt Clearance, Bank Loan Management & Solvency Defense',
      classicalRef: 'लाल किताब (पं. रूपचंद जोशी 1952)',
      divisionalRef: 'D1 लग्न चक्र',
      vakriNote: '',
      astroBasisHi: `षष्ठ भाव (ऋण स्थान); मंगल व शनि का प्रभाव; एकादश भाव के लाभ द्वारा ऋणों का समय पर भुगतान।`,
      astroBasisEn: `6th house (debts); Mars and Saturn influence; 11th house surplus securing timely repayments.`,
      verdictHi: `ऋण लेने पर भी समय पर पूर्ण चुकता करने का सामर्थ्य; संपत्तियों के निर्माण हेतु लिए गए लोन लाभदायी।`,
      verdictEn: `High capacity to extinguish mortgages smoothly; loans utilized for productive assets yield high ROI.`,
      detailedAnalysisHi: `लाल किताब के फरमान अनुसार ऋण का समय पर भुगतान करने से मंगल नेक फल देता है और जातक कभी कर्ज के दलदल में नहीं फंसता।`,
      detailedAnalysisEn: `Lal Kitab verifies that disciplined debt service honors Mars, turning commercial leverage into assets.`,
      remedyHi: `मंगलवार के दिन ऋण मोचक मंगल स्तोत्र का पाठ करें और मंगलवार को कभी नया कर्ज न लें।`,
      remedyEn: `Recite Rina Mochaka Mangala Stotram on Tuesdays and never initiate fresh debts on Tuesdays.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 48. गुप्त व प्रत्यक्ष शत्रु तथा षड्यंत्र
  {
    const score = Math.max(40, Math.min(96, 55 + (mars.dignity === 'Exalted' || mars.dignity === 'Own Sign' ? 15 : 0) + (h6.placedHouse === 6 ? 12 : 0)));
    addDim({
      id: 48,
      houseNumber: 6,
      houseTitleHi: 'षष्ठ भाव (रोग, ऋण व शत्रु)',
      houseTitleEn: '6th House (Roga & Shatru)',
      category: 'shadow_challenges',
      categoryTitleHi: 'चुनौतियां व सतर्कता',
      categoryTitleEn: 'Shadow Challenges',
      titleHi: 'शत्रुहंता योग, प्रतिद्वंद्वियों पर विजय व षड्यंत्र मुक्ति',
      titleEn: 'Shatruhanta Yoga, Triumph Over Foes & Sabotage Protection',
      classicalRef: 'बृहत्पाराशर होराशास्त्र (पराशर) अ. 17',
      divisionalRef: 'D1 व D9 नवांश',
      vakriNote: getVakriExplanation(mars),
      astroBasisHi: `षष्ठेश भाव ${h6.placedHouse} में; मंगल का प्रभाव; शत्रुहंता योग का शास्त्रीय निर्माण।`,
      astroBasisEn: `6th Lord in H${h6.placedHouse}; martial ascendancy creating formidable Shatruhanta Yoga.`,
      verdictHi: `शत्रुहंता योग; विरोधी और गुप्त प्रतिद्वंद्वी जातक के सामने स्वतः प्रभावहीन होकर परास्त हो जाते हैं।`,
      verdictEn: `Shatruhanta Yoga: adversaries, detractors, and jealous rivals collapse before your resolute presence.`,
      detailedAnalysisHi: `महर्षि पराशर अनुसार षष्ठ भाव में क्रूर ग्रह या षष्ठेश का बलवान होना शत्रुओं का समूल नाश करता है और जातक को अजेय बनाता है।`,
      detailedAnalysisEn: `BPHS confirms that a potent 6th lord or martial occupant annihilates conspiracies and legal adversaries.`,
      remedyHi: `नित्य कालभैरवाष्टकम् अथवा श्री हनुमान वडवानल स्तोत्र का पाठ करें।`,
      remedyEn: `Recite Kaal Bhairav Ashtakam or Sri Hanuman Vadavanala Stotram for impregnable psychic protection.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 49. कोर्ट-कचहरी, मुकदमेबाजी व कानूनी विवाद
  {
    const score = Math.max(35, Math.min(92, 50 + getDignityBonus(jupiter.dignity) + (h6.placedHouse !== 12 ? 10 : -10)));
    addDim({
      id: 49,
      houseNumber: 6,
      houseTitleHi: 'षष्ठ भाव (रोग, ऋण व शत्रु)',
      houseTitleEn: '6th House (Roga & Shatru)',
      category: 'shadow_challenges',
      categoryTitleHi: 'चुनौतियां व सतर्कता',
      categoryTitleEn: 'Shadow Challenges',
      titleHi: 'कोर्ट-कचहरी, कानूनी विवाद, मुकदमों में विजय व न्याय',
      titleEn: 'Litigation, Legal Controversies & Courtroom Vindication',
      classicalRef: 'जातक पारिजात (वैद्यनाथ) अ. 14',
      divisionalRef: 'D1 व D10 (दशमांश)',
      vakriNote: '',
      astroBasisHi: `षष्ठ भाव (विवाद) व नवम भाव (न्याय); गुरु व शनि की दृष्टियां; कानूनी विजय के संकेत।`,
      astroBasisEn: `6th house (disputes) & 9th house (justice); Jupiterian law indicators securing vindication.`,
      verdictHi: `कानूनी विवादों में अंततः सत्य और न्याय की विजय; मध्यस्थता व समझौतों से जटिल मामलों का समाधान।`,
      verdictEn: `Eventual vindication in contentious court cases; strategic settlements favor your long-term honor.`,
      detailedAnalysisHi: `जातक पारिजात के अनुसार षष्ठ और नवम भाव का समन्वय जातक को न्यायालय में न्याय दिलाता है और विरोधी परास्त होते हैं।`,
      detailedAnalysisEn: `Jataka Parijata indicates that alignment between houses 6 and 9 ensures ethical justice prevails.`,
      remedyHi: `पक्षियों को शनिवार को सात प्रकार का अनाज (सप्तधान्य) डालें और सत्य का साथ कभी न छोड़ें।`,
      remedyEn: `Feed mixed grains (Sapta Dhanya) to birds on Saturdays to dissolve litigation entanglements.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 50. प्रतियोगी परीक्षाएं, सिविल सेवा व चयन
  {
    const score = Math.max(40, Math.min(96, 52 + getDignityBonus(sun.dignity) + (h6.placedHouse === 6 || h6.placedHouse === 10 ? 14 : 0)));
    addDim({
      id: 50,
      houseNumber: 6,
      houseTitleHi: 'षष्ठ भाव (रोग, ऋण व शत्रु)',
      houseTitleEn: '6th House (Roga & Shatru)',
      category: 'career',
      categoryTitleHi: 'करियर व पद',
      categoryTitleEn: 'Career & Authority',
      titleHi: 'प्रतियोगी परीक्षाएं, सिविल सेवा (UPSC/PSC) व चयन सफलता',
      titleEn: 'Competitive Examinations, Civil Service Selection & Merit Ranks',
      classicalRef: 'टाइमिंग ऑफ इवेंट्स (के.एन. राव)',
      divisionalRef: 'D1 व D10 (दशमांश चक्र)',
      vakriNote: '',
      astroBasisHi: `षष्ठ भाव (प्रतियोगिता) + दशम भाव (राज्य सत्ता) + सूर्य (शासन कारक) का त्रिकोणीय बल।`,
      astroBasisEn: `6th house (competition) + 10th house (statecraft) + Sun (authority) synergistic focus.`,
      verdictHi: `प्रतियोगी परीक्षाओं में शीर्ष मेरिट व चयन का प्रबल योग; एकाग्र परिश्रम से कठिन परीक्षाओं में सफलता।`,
      verdictEn: `Stellar competitive examination stamina; high propensity to crack elite state selections or merit ranks.`,
      detailedAnalysisHi: `के.एन. राव की शोध पद्धति अनुसार षष्ठ भाव और सूर्य का बलवान संबंध जातक को लाखों अभ्यर्थियों के बीच मेरिट सूची में शीर्ष पर लाता है।`,
      detailedAnalysisEn: `K.N. Rao's proven research shows that a fortified 6th house guarantees triumph in hyper-competitive exams.`,
      remedyHi: `रविवार को सूर्योदय के समय तांबे के पात्र से सूर्य को जल दें और गायत्री मंत्र का 108 बार जप करें।`,
      remedyEn: `Chant Gayatri Mantra 108 times at Sunday sunrise and maintain uninterrupted study discipline.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 51. नौकरी, मातहत कर्मचारी व दैनिक कार्य-सेवा
  {
    const score = Math.max(35, Math.min(92, 50 + getDignityBonus(saturn.dignity) + (h6.placedHouse !== 8 ? 8 : -8)));
    addDim({
      id: 51,
      houseNumber: 6,
      houseTitleHi: 'षष्ठ भाव (रोग, ऋण व शत्रु)',
      houseTitleEn: '6th House (Roga & Shatru)',
      category: 'career',
      categoryTitleHi: 'करियर व पद',
      categoryTitleEn: 'Career & Authority',
      titleHi: 'दैनिक नौकरी, सेवा भाव, कार्यस्थल वातावरण व अधीनस्थ कर्मचारी',
      titleEn: 'Employment Routine, Workplace Environment & Subordinate Loyalty',
      classicalRef: 'सर्वार्थ चिंतामणि (वेंकटेश शर्मा) अ. 6',
      divisionalRef: 'D1 व D10 (दशमांश)',
      vakriNote: getVakriExplanation(saturn),
      astroBasisHi: `षष्ठेश भाव ${h6.placedHouse} में; शनि (सेवा व श्रम कारक) भाव ${saturn.houseNumber} में; कार्यस्थल संबंध।`,
      astroBasisEn: `6th Lord in H${h6.placedHouse}; Saturn (Karaka of labor) in H${saturn.houseNumber}; subordinate dynamics.`,
      verdictHi: `कार्यस्थल पर मातहत कर्मचारियों का सम्मान व वफादारी; दैनिक नौकरी में कर्तव्यनिष्ठा से पदोन्नति के मार्ग।`,
      verdictEn: `Loyalty from subordinates and staff; dependable daily work ethic rewarded by hierarchical advancement.`,
      detailedAnalysisHi: `सर्वार्थ चिंतामणि के अनुसार जब शनि षष्ठ भाव पर कृपा करे, तो अधीनस्थ कर्मचारी जातक के प्रति निष्ठावान रहते हैं।`,
      detailedAnalysisEn: `Sarvartha Chintamani links a disciplined 6th house to harmonious teamwork and loyal workforce support.`,
      remedyHi: `शनिवार को श्रमिकों अथवा सफाई कर्मियों को चाय, नाश्ता या जूते-चप्पल भेंट करें।`,
      remedyEn: `Support working-class laborers or sanitation workers with warm beverages or footwear on Saturdays.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 52. पाचन तंत्र, आंतें, उदर व खानपान विकार
  {
    const score = Math.max(35, Math.min(90, 50 + getDignityBonus(sun.dignity) + (mars.houseNumber === 6 ? -8 : 8)));
    addDim({
      id: 52,
      houseNumber: 6,
      houseTitleHi: 'षष्ठ भाव (रोग, ऋण व शत्रु)',
      houseTitleEn: '6th House (Roga & Shatru)',
      category: 'longevity_health',
      categoryTitleHi: 'स्वास्थ्य व आयु',
      categoryTitleEn: 'Health & Longevity',
      titleHi: 'पाचन तंत्र, जठराग्नि, आंतें व उदर स्वास्थ्य',
      titleEn: 'Digestive Fire, Gut Health, Intestines & Metabolic Balance',
      classicalRef: 'जातकाभरण (ढूँढिराज) अ. 16',
      divisionalRef: 'D1 व D30 (त्रिंशांश)',
      vakriNote: '',
      astroBasisHi: `षष्ठ भाव (पेट व आंतें); सूर्य (जठराग्नि); मंगल व बुध का प्रभाव।`,
      astroBasisEn: `6th house (intestines); Sun (digestive fire); digestive harmony indicators.`,
      verdictHi: `संतुलित जठराग्नि; खानपान में समय की पाबंदी व रेशेदार भोजन से पाचन तंत्र पूर्णतः स्वस्थ।`,
      verdictEn: `Sound metabolic fire; fiber-rich diet and disciplined eating times protect gut microflora.`,
      detailedAnalysisHi: `जातकाभरण अनुसार षष्ठ भाव उदर और आंतों का सूचक है। सूर्य की आराधना से जठराग्नि प्रदीप्त रहती है और अपच के दोष शांत होते हैं।`,
      detailedAnalysisEn: `Jatakabharana confirms that solar alignment keeps the digestive enzymes balanced and robust.`,
      remedyHi: `भोजन के उपरांत सौंफ व मिश्री का सेवन करें और वज्रासन में 5 मिनट बैठें।`,
      remedyEn: `Sit in Vajrasana for 5 minutes after meals and chew fennel seeds for optimal digestion.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 53. मामा, मौसी व ननिहाल पक्ष से संबंध
  {
    const score = Math.max(35, Math.min(90, 50 + getDignityBonus(mercury.dignity)));
    addDim({
      id: 53,
      houseNumber: 6,
      houseTitleHi: 'षष्ठ भाव (रोग, ऋण व शत्रु)',
      houseTitleEn: '6th House (Roga & Shatru)',
      category: 'family',
      categoryTitleHi: 'माता-पिता व कुल',
      categoryTitleEn: 'Family & Lineage',
      titleHi: 'मामा, मौसी, ननिहाल पक्ष से सुख व संबंध',
      titleEn: 'Maternal Uncles, Aunts & Mother\'s Clan Rapport',
      classicalRef: 'सारावली (कल्याण वर्मा) अ. 28',
      divisionalRef: 'D1 व D12 (द्वादशांश)',
      vakriNote: getVakriExplanation(mercury),
      astroBasisHi: `बुध (मातुल कारक) भाव ${mercury.houseNumber} में; षष्ठ भाव (ननिहाल) की स्थिति।`,
      astroBasisEn: `Mercury (Matulakaraka) in H${mercury.houseNumber}; 6th house maternal relatives axis.`,
      verdictHi: `ननिहाल पक्ष से स्नेहपूर्ण संबंध; बाल्यकाल में ननिहाल से विशेष लाड़-प्यार व सहयोग के योग।`,
      verdictEn: `Warm affectionate bonds with maternal uncles and aunts with mutual goodwill across family ties.`,
      detailedAnalysisHi: `सारावली के अनुसार जब बुध षष्ठ भाव से शुभ संबंध बनाए, तो ननिहाल पक्ष से सुख और आत्मीयता बनी रहती है।`,
      detailedAnalysisEn: `Saravali demonstrates that Mercurial harmony with the 6th house enriches ties with maternal kin.`,
      remedyHi: `मामा अथवा मौसी को समय-समय पर सम्मानपूर्वक उपहार दें और उनका आशीर्वाद लें।`,
      remedyEn: `Gift green attire or sweets to maternal relatives on auspicious family occasions.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 54. पालतू पशु, मवेशी व घरेलू सेवादार
  {
    const score = Math.max(35, Math.min(90, 50 + getDignityBonus(saturn.dignity)));
    addDim({
      id: 54,
      houseNumber: 6,
      houseTitleHi: 'षष्ठ भाव (रोग, ऋण व शत्रु)',
      houseTitleEn: '6th House (Roga & Shatru)',
      category: 'family',
      categoryTitleHi: 'माता-पिता व कुल',
      categoryTitleEn: 'Family & Lineage',
      titleHi: 'पालतू पशु, श्वान, मवेशी सेवा व घरेलू सेवक सुख',
      titleEn: 'Pets, Canines, Animal Welfare & Domestic Helper Harmony',
      classicalRef: 'फलदीपिका (मंत्रेश्वर) अ. 14',
      divisionalRef: 'D1 लग्न चक्र',
      vakriNote: '',
      astroBasisHi: `षष्ठ भाव (चौपाया व पशु स्थान); केतु (श्वान/कुत्ता) व शनि (सेवक कारक) का प्रभाव।`,
      astroBasisEn: `6th house (domestic pets); Ketu (canines) & Saturn (service providers) resonance.`,
      verdictHi: `जीव-जंतुओं के प्रति स्वाभाविक दया व प्रेम; पालतू श्वान अथवा पशुओं की सेवा से ग्रह दोषों का शमन।`,
      verdictEn: `Deep affinity for domestic pets; feeding street animals dissolves negative karmic debris.`,
      detailedAnalysisHi: `मंत्रेश्वर के अनुसार षष्ठ भाव मवेशियों और पालतू जीवों का घर है। इनकी सेवा से शनि और केतु की पीड़ा शांत होती है।`,
      detailedAnalysisEn: `Phaladeepika establishes that nurturing animals activates divine planetary protection.`,
      remedyHi: `काले कुत्ते को सरसों के तेल से चुपड़ी रोटी खिलाएं और पक्षियों के लिए जल की व्यवस्था करें।`,
      remedyEn: `Feed rotis smeared with mustard oil to street dogs to pacify Saturn and Ketu.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // =========================================================================
  // KHOND 7: सप्तम भाव (KALATRA BHAVA) — विवाह, दांपत्य, व्यापार व पार्टनरशिप (55 से 64)
  // =========================================================================

  // 55. विवाह का समय: शीघ्र, सामान्य अथवा विलंब
  {
    const isSaturnOn7 = saturn.houseNumber === 7 || planets.some((p) => p.houseNumber === 7 && p.id === 'Saturn');
    const score = Math.max(35, Math.min(95, 52 + (isSaturnOn7 ? -10 : 10) + getDignityBonus(venus.dignity)));
    addDim({
      id: 55,
      houseNumber: 7,
      houseTitleHi: 'सप्तम भाव (विवाह व दांपत्य)',
      houseTitleEn: '7th House (Kalatra & Marriage)',
      category: 'marriage',
      categoryTitleHi: 'विवाह व दांपत्य',
      categoryTitleEn: 'Marriage & Conjugal Life',
      titleHi: 'विवाह का समय निर्धारण: शीघ्र, सामान्य अथवा परिपक्व आयु',
      titleEn: 'Timing of Marriage: Early, Timely or Mature Age Window',
      classicalRef: 'फलदीपिका (मंत्रेश्वर) अ. 10',
      divisionalRef: 'D1 व D9 नवांश',
      vakriNote: getVakriExplanation(venus),
      astroBasisHi: `सप्तमेश ${h7.lordHi} भाव ${h7.placedHouse} में (${h7.dignityHi}); शुक्र भाव ${venus.houseNumber} में; सक्रिय विंशोत्तरी दशा: ${mdLordHi}-${adLordHi}।`,
      astroBasisEn: `7th Lord in H${h7.placedHouse} (${h7.dignity}); Venus in H${venus.houseNumber}; Running Dasha: ${mdLord}-${adLord}.`,
      verdictHi: `${isSaturnOn7 ? '27 से 31 वर्ष की परिपक्व आयु में विवाह का शास्त्रोक्त योग' : '24 से 28 वर्ष की अनुकूल आयु में सुखद विवाह का योग'}।`,
      verdictEn: `${isSaturnOn7 ? 'Marriage favored in mature 27 to 31 age bracket' : 'Auspicious marriage favored in timely 24 to 28 age window'}.`,
      detailedAnalysisHi: `मंत्रेश्वर कृत फलदीपिका के अनुसार सप्तमेश की दशा या गुरु के शुभ गोचर में विवाह संपन्न होता है। परिपक्व आयु में विवाह दांपत्य को अटूट स्थायित्व प्रदान करता है।`,
      detailedAnalysisEn: `Phaladeepika identifies the confluence of 7th lord dasha and Jupiterian double transit as the golden hour of wedlock.`,
      remedyHi: `विवाह में अनुकूलता हेतु गुरुवार को भगवान लक्ष्मीनारायण के मंदिर में पीला मिष्ठान्न अर्पित करें।`,
      remedyEn: `Offer yellow sweets at Lakshmi-Narayana temple on Thursdays for timely marital fruition.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 56. जीवनसाथी का रूप-रंग, स्वभाव व कुल
  {
    const score = Math.max(35, Math.min(95, 52 + getDignityBonus(h7.dignity) + getDignityBonus(venus.dignity)));
    addDim({
      id: 56,
      houseNumber: 7,
      houseTitleHi: 'सप्तम भाव (विवाह व दांपत्य)',
      houseTitleEn: '7th House (Kalatra & Marriage)',
      category: 'marriage',
      categoryTitleHi: 'विवाह व दांपत्य',
      categoryTitleEn: 'Marriage & Conjugal Life',
      titleHi: 'जीवनसाथी का रूप-रंग, स्वभाव, बौद्धिक स्तर व कुल',
      titleEn: 'Spouse\'s Appearance, Temperament, Intellect & Family Pedigree',
      classicalRef: 'सारावली (कल्याण वर्मा) अ. 29',
      divisionalRef: 'D1 व D9 नवांश (दाराकारक व नवांश लग्न)',
      vakriNote: getVakriExplanation(planets.find((p) => p.id === h7.lord)),
      astroBasisHi: `सप्तम भाव राशि: ${h7.signHi}; सप्तमेश भाव ${h7.placedHouse} में; शुक्र (दाराकारक) का प्रभाव।`,
      astroBasisEn: `7th House sign: ${h7.signName}; 7th Lord in H${h7.placedHouse}; Venusian graceful traits.`,
      verdictHi: `सुसंस्कृत, रूपवान, बुद्धिमान, व्यावहारिक एवं परिवार के प्रति अत्यंत समर्पित जीवनसाथी।`,
      verdictEn: `Cultured, graceful, intellectually discerning, and deeply dedicated life partner.`,
      detailedAnalysisHi: `कल्याण वर्मा की सारावली अनुसार सप्तम भाव की राशि और नवांशपति जीवनसाथी के रूप और स्वभाव का दर्पण हैं। शुभ ग्रहों का प्रभाव दांपत्य को सौंदर्य व समझदारी से भरता है।`,
      detailedAnalysisEn: `Saravali establishes that the 7th house and its Navamsha dispositor mirror the spouse's core nature.`,
      remedyHi: `दांपत्य जीवन में माधुर्य हेतु माता पार्वती व भगवान शिव की संयुक्त आराधना करें।`,
      remedyEn: `Worship Lord Shiva and Goddess Parvati together for blissful spousal compatibility.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 57. दांपत्य सामंजस्य, प्रेम व वैवाहिक सुख
  {
    const score = Math.max(35, Math.min(95, 52 + (sav[6] >= 28 ? 12 : -8) + getDignityBonus(jupiter.dignity)));
    addDim({
      id: 57,
      houseNumber: 7,
      houseTitleHi: 'सप्तम भाव (विवाह व दांपत्य)',
      houseTitleEn: '7th House (Kalatra & Marriage)',
      category: 'marriage',
      categoryTitleHi: 'विवाह व दांपत्य',
      categoryTitleEn: 'Marriage & Conjugal Life',
      titleHi: 'दांपत्य सामंजस्य, पारस्परिक प्रेम, निष्ठा व वैवाहिक सुख',
      titleEn: 'Marital Harmony, Mutual Devotion, Intimacy & Spousal Loyalty',
      classicalRef: 'बृहत्पाराशर होराशास्त्र (पराशर) अ. 18',
      divisionalRef: 'D1 व D9 नवांश',
      vakriNote: '',
      astroBasisHi: `सप्तमेश व द्वितीयेश का सामंजस्य; गुरु की अमृत दृष्टि; [SAV (सहायक): सप्तम भाव ${sav[6]} बिंदु]।`,
      astroBasisEn: `Synergy between 2nd and 7th houses; Jupiterian protective aspect; [SAV: ${sav[6]} bindus].`,
      verdictHi: `सुदृढ़ दांपत्य सामंजस्य; वैचारिक मतभेदों के उपरांत भी अटूट पारस्परिक विश्वास व प्रेम।`,
      verdictEn: `Enduring marital harmony with resilient spousal loyalty overriding transient disagreements.`,
      detailedAnalysisHi: `महर्षि पराशर अनुसार द्वितीय (कुटुंब) और सप्तम (पति/पत्नी) भाव जब शुभ ग्रहों से सुरक्षित हों, तो दांपत्य जीवन स्वर्ग समान सुखद होता है।`,
      detailedAnalysisEn: `BPHS confirms that when houses 2 and 7 are harmonized, marriage matures into profound companionship.`,
      remedyHi: `शयनकक्ष में सुगंधित फूलों अथवा गुलाब जल का प्रयोग करें और पति-पत्नी साथ में श्रीसूक्त का पाठ करें।`,
      remedyEn: `Use natural floral fragrances in bedroom and recite Sri Suktam together on Fridays.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 58. वैवाहिक तनाव, अलगाव या तलाक योग
  {
    const score = Math.max(35, Math.min(90, 55 + (h7.kartari === 'Subhakartari' ? 12 : h7.kartari === 'Papakartari' ? -15 : 0)));
    addDim({
      id: 58,
      houseNumber: 7,
      houseTitleHi: 'सप्तम भाव (विवाह व दांपत्य)',
      houseTitleEn: '7th House (Kalatra & Marriage)',
      category: 'marriage',
      categoryTitleHi: 'विवाह व दांपत्य',
      categoryTitleEn: 'Marriage & Conjugal Life',
      titleHi: 'वैवाहिक कलह निवारण, अलगाव/तलाक से सुरक्षा कवच',
      titleEn: 'Marital Discord Mitigation & Shield Against Separation',
      classicalRef: 'हाउ टू जज अ होरोस्कोप (डॉ. बी.वी. रमन) भाग 2',
      divisionalRef: 'D1 व D9 नवांश',
      vakriNote: '',
      astroBasisHi: `सप्तम भाव पर कर्तरी प्रभाव: ${h7.kartari}; राहु/केतु धुरी का प्रभाव; गुरु का रक्षा कवच।`,
      astroBasisEn: `Kartari on 7th: ${h7.kartari}; Nodal axis impact; Jupiter's stabilizing protective shield.`,
      verdictHi: `अलगाव अथवा तलाक का कोई शास्त्रीय योग नहीं; संवाद और धैर्य से दांपत्य संबंध पूर्णतः सुरक्षित।`,
      verdictEn: `Solid immunity against formal divorce or irrevocable rupture; open communication secures peace.`,
      detailedAnalysisHi: `डॉ. बी.वी. रमन के अनुसार यदि लग्न या सप्तम पर देवगुरु बृहस्पति की दृष्टि हो, तो वह कुंडली के बड़े से बड़े वैवाहिक दोषों का शमन कर देती है।`,
      detailedAnalysisEn: `Dr. B.V. Raman proves that Jupiter's benefic gaze upon the 7th house averts separation crises.`,
      remedyHi: `वैवाहिक शांति हेतु बुधवार को गाय को हरा पालक खिलाएं और क्रोध पर संयम रखें।`,
      remedyEn: `Feed green spinach to cows on Wednesdays and practice reflective patience during disputes.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 59. व्यापारिक साझेदारी, पार्टनरशिप व अनुबंध
  {
    const score = Math.max(35, Math.min(92, 50 + getDignityBonus(mercury.dignity) + (h7.placedHouse === 10 || h7.placedHouse === 11 ? 12 : 0)));
    addDim({
      id: 59,
      houseNumber: 7,
      houseTitleHi: 'सप्तम भाव (विवाह व दांपत्य)',
      houseTitleEn: '7th House (Kalatra & Marriage)',
      category: 'career',
      categoryTitleHi: 'करियर व पद',
      categoryTitleEn: 'Career & Authority',
      titleHi: 'व्यापारिक साझेदारी, पार्टनरशिप, अनुबंध व संयुक्त उद्यम',
      titleEn: 'Business Partnerships, Joint Ventures & Commercial Contracts',
      classicalRef: 'जातक पारिजात (वैद्यनाथ) अ. 14',
      divisionalRef: 'D1 व D10 (दशमांश चक्र)',
      vakriNote: getVakriExplanation(mercury),
      astroBasisHi: `सप्तमेश भाव ${h7.placedHouse} में; बुध (वाणिज्य कारक) भाव ${mercury.houseNumber} में; अनुबंध सुरक्षा।`,
      astroBasisEn: `7th Lord in H${h7.placedHouse}; Mercury in H${mercury.houseNumber}; contractual fidelity.`,
      verdictHi: `साझेदारी में व्यापार अनुकूल; सभी समझौतों को लिखित व विधिक रूप से स्पष्ट रखने पर दीर्घकालिक लाभ।`,
      verdictEn: `Favorable business partnerships provided all operational charters are formally documented in writing.`,
      detailedAnalysisHi: `जातक पारिजात के अनुसार सप्तम भाव जनसंपर्क और साझेदारी का है। बुध की शुभ स्थिति साझेदारों से विश्वासघात से बचाती है।`,
      detailedAnalysisEn: `Jataka Parijata links a fortified 7th house to profitable joint ventures and mutual commercial integrity.`,
      remedyHi: `व्यापारिक अनुबंधों पर हस्ताक्षर करते समय उत्तर अथवा पूर्व दिशा की ओर मुख करें।`,
      remedyEn: `Face North or East while formalizing commercial contracts for Lakshmi's perennial grace.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 60. विदेश में व्यापार व विदेशी ग्राहक
  {
    const score = Math.max(35, Math.min(95, 52 + (h7.placedHouse === 12 || h12.placedHouse === 7 ? 15 : 0) + (rahu ? 10 : 0)));
    addDim({
      id: 60,
      houseNumber: 7,
      houseTitleHi: 'सप्तम भाव (विवाह व दांपत्य)',
      houseTitleEn: '7th House (Kalatra & Marriage)',
      category: 'career',
      categoryTitleHi: 'करियर व पद',
      categoryTitleEn: 'Career & Authority',
      titleHi: 'विदेश में व्यापार, अंतरराष्ट्रीय ग्राहक व निर्यात-आयात',
      titleEn: 'Foreign Trade, Cross-Border Clients & Global Commerce',
      classicalRef: 'सर्वार्थ चिंतामणि (वेंकटेश शर्मा) अ. 7',
      divisionalRef: 'D1 व D9 नवांश',
      vakriNote: '',
      astroBasisHi: `सप्तम भाव (व्यापार) व द्वादश भाव (विदेश); राहु का प्रभाव; विदेशी मुद्रा अर्जन योग।`,
      astroBasisEn: `7th house (commerce) & 12th house (foreign lands); Rahu's cross-border trading rays.`,
      verdictHi: `विदेशी ग्राहकों, एमएनसी कंपनियों अथवा अंतरराष्ट्रीय व्यापार से उत्कृष्ट धन लाभ का योग।`,
      verdictEn: `High profitability through overseas clients, global export-import services, or MNC affiliations.`,
      detailedAnalysisHi: `सर्वार्थ चिंतामणि के अनुसार जब सप्तमेश का संबंध द्वादश भाव से हो, तो जातक की ख्याति और व्यापार विदेशों में फैलता है।`,
      detailedAnalysisEn: `Sarvartha Chintamani confirms that 7th-12th house interaction channels global commercial revenues.`,
      remedyHi: `घर अथवा कार्यालय में उत्तर-पश्चिम कोण (वायव्य कोण) में बहते जल का चित्र अथवा फव्वारा लगाएं।`,
      remedyEn: `Install a crystal globe or water cascade in the North-West zone of the office to stimulate foreign deals.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 61. सार्वजनिक जीवन, जनसंपर्क व सामाजिक प्रभाव
  {
    const score = Math.max(35, Math.min(95, 52 + getDignityBonus(sun.dignity) + getDignityBonus(venus.dignity)));
    addDim({
      id: 61,
      houseNumber: 7,
      houseTitleHi: 'सप्तम भाव (विवाह व दांपत्य)',
      houseTitleEn: '7th House (Kalatra & Marriage)',
      category: 'identity',
      categoryTitleHi: 'पहचान व आत्म',
      categoryTitleEn: 'Identity & Core Self',
      titleHi: 'सार्वजनिक जीवन, जनसंपर्क, कूटनीति व सामाजिक प्रभाव',
      titleEn: 'Public Diplomacy, Mass Appeal & Interpersonal Influence',
      classicalRef: 'केपी रीडर्स (के.एस. कृष्णमूर्ति) रीडर 5',
      divisionalRef: 'D1 लग्न चक्र',
      vakriNote: '',
      astroBasisHi: `सप्तम भाव (जनता व जनसंपर्क); शुक्र व बुध की स्थिति; सामाजिक प्रतिष्ठा।`,
      astroBasisEn: `7th house (public relations); Venusian and Mercurial diplomacy securing mass goodwill.`,
      verdictHi: `उत्कृष्ट जनसंपर्क क्षमता; सामाजिक बैठकों व सार्वजनिक मंचों पर सहजता से लोगों का विश्वास जीतने का गुण।`,
      verdictEn: `Stellar diplomatic interpersonal prowess with natural flair for winning trust across public forums.`,
      detailedAnalysisHi: `केपी सिस्टम अनुसार सप्तम भाव बाह्य जगत से संवाद का द्वार है। इसकी शुभता जातक को लोकप्रिय और प्रभावशाली बनाती है।`,
      detailedAnalysisEn: `KP System verifies that 7th house cuspal strength governs mass reception and diplomatic finesse.`,
      remedyHi: `सामाजिक कार्यों में सक्रिय रहें और जन-कल्याण हेतु समय-समय पर निःशुल्क परामर्श दें।`,
      remedyEn: `Volunteer professional advice to non-profits to build enduring community goodwill.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 62. कामुकता, रति सुख व प्रजनन क्षमता
  {
    const score = Math.max(35, Math.min(92, 50 + getDignityBonus(venus.dignity) + getDignityBonus(mars.dignity)));
    addDim({
      id: 62,
      houseNumber: 7,
      houseTitleHi: 'सप्तम भाव (विवाह व दांपत्य)',
      houseTitleEn: '7th House (Kalatra & Marriage)',
      category: 'marriage',
      categoryTitleHi: 'विवाह व दांपत्य',
      categoryTitleEn: 'Marriage & Conjugal Life',
      titleHi: 'कामुकता, रति सुख, शारीरिक आकर्षण व प्रजनन ऊर्जा',
      titleEn: 'Conjugal Vitality, Intimate Harmony & Sexual Stamina',
      classicalRef: 'जातकाभरण (ढूँढिराज) अ. 17',
      divisionalRef: 'D1 व D9 नवांश',
      vakriNote: getVakriExplanation(venus),
      astroBasisHi: `शुक्र (काम व रति सुख कारक); मंगल (उत्तेजना व रक्त कारक); सप्तम व अष्टम भाव की स्थिति।`,
      astroBasisEn: `Venus (intimacy) & Mars (passion); balanced harmonic alignment across houses 7 and 8.`,
      verdictHi: `संतुलित, स्वस्थ व आनंदमय दांपत्य रति सुख; शारीरिक व भावनात्मक आकर्षण का उत्तम समन्वय।`,
      verdictEn: `Wholesome, passionate conjugal intimacy governed by mutual physical and emotional balance.`,
      detailedAnalysisHi: `जातकाभरण के अनुसार शुक्र और मंगल का संतुलित प्रभाव वैवाहिक जीवन में रति सुख और संतान उत्पत्ति की ऊर्जा को पुष्ट करता है।`,
      detailedAnalysisEn: `Jatakabharana confirms that harmonized Venus and Mars nurture intimate physical satisfaction.`,
      remedyHi: `शुक्रवार को इत्र या सुगंधित द्रव्यों का उपयोग करें और शिव-शक्ति का नमन करें।`,
      remedyEn: `Use natural sandalwood and jasmine essential oils for tranquil nervous rejuvenation.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 63. दूसरा जीवनसाथी अथवा पुनर्विवाह योग
  {
    const score = Math.max(35, Math.min(88, 50 + (h7.placedHouse === 2 || h7.placedHouse === 8 ? 10 : -10)));
    addDim({
      id: 63,
      houseNumber: 7,
      houseTitleHi: 'सप्तम भाव (विवाह व दांपत्य)',
      houseTitleEn: '7th House (Kalatra & Marriage)',
      category: 'marriage',
      categoryTitleHi: 'विवाह व दांपत्य',
      categoryTitleEn: 'Marriage & Conjugal Life',
      titleHi: 'पुनर्विवाह योग परीक्षण व एकनिष्ठ वैवाहिक जीवन',
      titleEn: 'Remarriage Tendency Analysis & Monogamous Devotion',
      classicalRef: 'भावार्थ रत्नाकर (रामानुजाचार्य)',
      divisionalRef: 'D1 व D9 नवांश',
      vakriNote: '',
      astroBasisHi: `द्वितीय भाव (सप्तम से अष्टम/पुनर्विवाह) व सप्तम भाव; गुरु का एकात्म दृष्टि प्रभाव।`,
      astroBasisEn: `2nd and 8th from 7th indicators; Jupiterian single-minded marital sanctification.`,
      verdictHi: `एकनिष्ठ वैवाहिक जीवन; जीवन पर्यंत एक ही जीवनसाथी के साथ निष्ठापूर्वक जीवन बिताने का शास्त्रोक्त योग।`,
      verdictEn: `Steadfast monogamous devotion; astrological indicators favor enduring lifelong fidelity to one partner.`,
      detailedAnalysisHi: `भावार्थ रत्नाकर के अनुसार जब सप्तम और द्वितीय भाव में गुरु का प्रभाव हो, तो जातक का वैवाहिक बंधन जन्म-जन्मांतर का अटूट रहता है।`,
      detailedAnalysisEn: `Bhavartha Ratnakara proves that Jupiter's blessing preserves singular marital sanctity.`,
      remedyHi: `पति-पत्नी साथ मिलकर किसी धार्मिक स्थल पर छायादार वृक्ष का रोपण करें।`,
      remedyEn: `Plant a sacred banyan or peepal sapling together for perpetual marital grounding.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 64. दैनिक व्यापार, स्वतंत्र दुकान व रिटेल आजीविका
  {
    const score = Math.max(35, Math.min(94, 50 + getDignityBonus(mercury.dignity) + (h7.placedHouse === 7 || h7.placedHouse === 10 ? 12 : 0)));
    addDim({
      id: 64,
      houseNumber: 7,
      houseTitleHi: 'सप्तम भाव (विवाह व दांपत्य)',
      houseTitleEn: '7th House (Kalatra & Marriage)',
      category: 'career',
      categoryTitleHi: 'करियर व पद',
      categoryTitleEn: 'Career & Authority',
      titleHi: 'दैनिक व्यापार, रिटेल दुकान, स्वतंत्र वाणिज्य व वाणिज्यिक सफलता',
      titleEn: 'Retail Enterprise, Commercial Store Ownership & Mercantile Success',
      classicalRef: 'फलदीपिका (मंत्रेश्वर) अ. 10',
      divisionalRef: 'D1 व D10 (दशमांश)',
      vakriNote: getVakriExplanation(mercury),
      astroBasisHi: `सप्तमेश भाव ${h7.placedHouse} में; बुध भाव ${mercury.houseNumber} में; दैनिक ग्राहक आवक योग।`,
      astroBasisEn: `7th Lord in H${h7.placedHouse}; Mercury in H${mercury.houseNumber}; commercial footfall stamina.`,
      verdictHi: `स्वतंत्र वाणिज्य अथवा खुदरा दुकान में निरंतर ग्राहक आवक व दैनिक नकदी प्रवाह का उत्तम योग।`,
      verdictEn: `Strong commercial footfall and consistent daily cash flow in independent retail trade.`,
      detailedAnalysisHi: `मंत्रेश्वर के अनुसार सप्तम भाव दैनिक व्यापार का मुख्य केंद्र है। बुध की कृपा से दुकान या व्यापारिक प्रतिष्ठान में सदा रौनक रहती है।`,
      detailedAnalysisEn: `Phaladeepika establishes the 7th house as the lifeblood of retail transactions and direct customer commerce.`,
      remedyHi: `प्रतिदिन अपनी दुकान अथवा गल्ले में कर्पूर की धूप दें और ॐ श्रीं महालक्ष्म्यै नमः का स्मरण करें।`,
      remedyEn: `Burn pure camphor at commercial checkout counter daily while invoking Goddess Mahalakshmi.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // Next: KHOND 8, 9, 10, 11, 12 (Dimensions 65 to 101)
  appendFinalHouses(ctx, dims, getAuspiciousness, getDignityBonus, getVakriExplanation, getVakriExplanationEn);
}

// Function to append Dimensions 65 to 101
function appendFinalHouses(
  ctx: Classical101Context,
  dims: LifeDimensionReading[],
  getAuspiciousness: (score: number) => AuspiciousnessLevel,
  getDignityBonus: (dignity?: string) => number,
  getVakriExplanation: (p: any) => string,
  getVakriExplanationEn: (p: any) => string
) {
  const {
    chart, ascSign, ascSignName, ascSignHi, planets, sav, currentAge,
    mdLord, adLord, mdLordHi, adLordHi, getHLord
  } = ctx;

  const getP = (id: NineGrahaId) => planets.find((p) => p.id === id) || planets[0];
  const sun = getP('Sun');
  const moon = getP('Moon');
  const mars = getP('Mars');
  const mercury = getP('Mercury');
  const jupiter = getP('Jupiter');
  const venus = getP('Venus');
  const saturn = getP('Saturn');
  const rahu = planets.find((p) => p.id === 'Rahu');
  const ketu = planets.find((p) => p.id === 'Ketu');

  const h1 = getHLord(1);
  const h2 = getHLord(2);
  const h3 = getHLord(3);
  const h4 = getHLord(4);
  const h5 = getHLord(5);
  const h6 = getHLord(6);
  const h7 = getHLord(7);
  const h8 = getHLord(8);
  const h9 = getHLord(9);
  const h10 = getHLord(10);
  const h11 = getHLord(11);
  const h12 = getHLord(12);

  const addDim = (d: LifeDimensionReading) => {
    dims.push(d);
  };

  // =========================================================================
  // KHOND 8: अष्टम भाव (RANDHRA BHAVA) — आयु, गूढ़ रहस्य, वसीयत व संकट (65 से 73)
  // =========================================================================

  // 65. जीवन प्रत्याशा, मृत्यु का स्वरूप व काल
  {
    const score = Math.max(40, Math.min(95, 54 + getDignityBonus(saturn.dignity)));
    addDim({
      id: 65,
      houseNumber: 8,
      houseTitleHi: 'अष्टम भाव (आयु व रंध्र भाव)',
      houseTitleEn: '8th House (Ayu & Randhra)',
      category: 'longevity_health',
      categoryTitleHi: 'स्वास्थ्य व आयु',
      categoryTitleEn: 'Health & Longevity',
      titleHi: 'दीर्घायु प्रमाण, शांतिपूर्ण निर्वाण व जीवन प्रत्याशा',
      titleEn: 'Longevity Horizon, Peaceful Demise & Life Span Span',
      classicalRef: 'बृहत्पाराशर होराशास्त्र (पराशर) अ. 19',
      divisionalRef: 'D1 व D8 (अष्टमांश)',
      vakriNote: getVakriExplanation(saturn),
      astroBasisHi: `अष्टमेश भाव ${h8.placedHouse} में (${h8.dignityHi}); शनि (आयुष्मान कारक) भाव ${saturn.houseNumber} में; दीर्घायु योग।`,
      astroBasisEn: `8th Lord in H${h8.placedHouse} (${h8.dignity}); Saturn in H${saturn.houseNumber}; sustained lifespan indicators.`,
      verdictHi: `पूर्णायु (75 से 90+ वर्ष); जीवन के अंतिम काल में शांतिपूर्ण, सचेत व आध्यात्मिक निर्वाण का योग।`,
      verdictEn: `Purna Ayu (75 to 90+ years); peaceful, conscious, and spiritually elevated end-of-life departure.`,
      detailedAnalysisHi: `महर्षि पराशर अनुसार अष्टम भाव और शनि का शुभ बल जातक को कष्टकारी असाध्य रोगों से बचाकर स्वाभाविक वृद्धावस्था तक ले जाता है।`,
      detailedAnalysisEn: `BPHS confirms that Saturn's benefic fortitude on the 8th house shields against sudden tragic demises.`,
      remedyHi: `प्रति सोमवार महामृत्युंजय मंत्र का जप करें और अन्न-जल का कभी अपव्यय न करें।`,
      remedyEn: `Chant Maha Mrityunjaya Mantra on Mondays and honor the sanctity of food and water.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 66. आकस्मिक धन लाभ, वसीयत व बीमा क्लेम
  {
    const score = Math.max(35, Math.min(95, 52 + (sav[7] >= 28 ? 10 : 0) + getDignityBonus(jupiter.dignity)));
    addDim({
      id: 66,
      houseNumber: 8,
      houseTitleHi: 'अष्टम भाव (आयु व रंध्र भाव)',
      houseTitleEn: '8th House (Ayu & Randhra)',
      category: 'wealth_fortune',
      categoryTitleHi: 'धन व समृद्धि',
      categoryTitleEn: 'Wealth & Prosperity',
      titleHi: 'आकस्मिक धन लाभ, वसीयत, बीमा क्लेम व गुप्त संपत्ति',
      titleEn: 'Windfalls, Wills, Insurance settlements & Hidden Riches',
      classicalRef: 'सर्वार्थ चिंतामणि (वेंकटेश शर्मा) अ. 8',
      divisionalRef: 'D1 व D2 (होरा चक्र)',
      vakriNote: '',
      astroBasisHi: `अष्टमेश भाव ${h8.placedHouse} में; द्वितीयेश व अष्टमेश का संबंध; आकस्मिक लाभ योग।`,
      astroBasisEn: `8th Lord in H${h8.placedHouse}; 2nd and 8th financial nexus; unearned wealth indicators.`,
      verdictHi: `जीवन में कम से कम एक बार बड़ा आकस्मिक धन लाभ, वसीयती संपत्ति अथवा बीमा क्लेम का योग।`,
      verdictEn: `Strong potential to receive sudden unearned windfalls, testamentary bequests, or insurance claims.`,
      detailedAnalysisHi: `सर्वार्थ चिंतामणि के अनुसार अष्टम भाव गुप्त खजाने और अप्रत्याशित संपत्तियों का स्वामी है। शुभ दशा में यह जातक को मालामाल कर देता है।`,
      detailedAnalysisEn: `Sarvartha Chintamani links the 8th house to subterranean resources, inheritances, and unexpected wealth.`,
      remedyHi: `शनिवार को उड़द की दाल के पकोड़े बनाकर निर्धनों को खिलाएं।`,
      remedyEn: `Feed black gram fritters to destitute persons on Saturdays to appease 8th house karmic tides.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 67. ससुराल पक्ष की आर्थिक स्थिति व संबंध
  {
    const score = Math.max(35, Math.min(92, 50 + getDignityBonus(h8.dignity)));
    addDim({
      id: 67,
      houseNumber: 8,
      houseTitleHi: 'अष्टम भाव (आयु व रंध्र भाव)',
      houseTitleEn: '8th House (Ayu & Randhra)',
      category: 'family',
      categoryTitleHi: 'माता-पिता व कुल',
      categoryTitleEn: 'Family & Lineage',
      titleHi: 'ससुराल पक्ष की आर्थिक स्थिति, मान-सम्मान व संबंध',
      titleEn: 'In-Laws\' Financial Solvency, Social Standing & Rapport',
      classicalRef: 'जातक पारिजात (वैद्यनाथ) अ. 15',
      divisionalRef: 'D1 व D9 नवांश',
      vakriNote: '',
      astroBasisHi: `अष्टम भाव (सप्तम से द्वितीय यानी जीवनसाथी का कुटुंब); गुरु व शुक्र का प्रभाव।`,
      astroBasisEn: `8th house (2nd from 7th = spouse's family wealth); Jupiter & Venus indications.`,
      verdictHi: `ससुराल पक्ष साधन-संपन्न, प्रतिष्ठित व प्रभावशाली; विवाह उपरांत ससुराल से मान-सम्मान व आर्थिक सहयोग।`,
      verdictEn: `Affluent, well-respected in-laws who provide solid moral and financial support after marriage.`,
      detailedAnalysisHi: `जातक पारिजात के अनुसार अष्टम भाव जीवनसाथी के परिवार का आईना है। यहाँ शुभ ग्रह ससुराल को समृद्ध और स्नेही बनाते हैं।`,
      detailedAnalysisEn: `Jataka Parijata demonstrates that benefic rays upon the 8th house guarantee respectable in-laws.`,
      remedyHi: `ससुराल पक्ष के वरिष्ठ जनों का सदैव आदर करें और पर्वों पर उपहार भेजें।`,
      remedyEn: `Maintain respectful communication with in-laws to fortify mutual goodwill.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 68. गुप्त तंत्र, ज्योतिष, पराविद्या व रहस्य विज्ञान
  {
    const score = Math.max(40, Math.min(96, 52 + getDignityBonus(jupiter.dignity) + (ketu?.houseNumber === 8 || ketu?.houseNumber === 12 ? 15 : 0)));
    addDim({
      id: 68,
      houseNumber: 8,
      houseTitleHi: 'अष्टम भाव (आयु व रंध्र भाव)',
      houseTitleEn: '8th House (Ayu & Randhra)',
      category: 'spirituality',
      categoryTitleHi: 'आध्यात्म व मोक्ष',
      categoryTitleEn: 'Spirituality & Grace',
      titleHi: 'गूढ़ पराविद्या, ज्योतिष, तंत्र, तंत्रागम व रहस्य विज्ञान',
      titleEn: 'Occult Sciences, Astrology, Mysticism & Esoteric Wisdom',
      classicalRef: 'फलदीपिका (मंत्रेश्वर) अ. 15',
      divisionalRef: 'D1 व D20 (विंशांश चक्र)',
      vakriNote: getVakriExplanation(ketu),
      astroBasisHi: `अष्टम भाव (गूढ़ विद्या); केतु व गुरु का संबंध; अंतर्ज्ञान (Intuition) की जागृति।`,
      astroBasisEn: `8th house (esoteric depths); Ketu and Jupiterian alliance; awakened intuitive perception.`,
      verdictHi: `ज्योतिष, गूढ़ दर्शन व रहस्यवादी विद्याओं में असाधारण रुचि व सूक्ष्म अंतर्ज्ञान शक्ति।`,
      verdictEn: `Profound aptitude for astrology, esoteric research, and hidden metaphysical revelations.`,
      detailedAnalysisHi: `मंत्रेश्वर के अनुसार अष्टम भाव में जब केतु या गुरु की दृष्टि हो, तो जातक अदृश्य जगत के सत्यों को अपनी अंतर्दृष्टि से जान लेता है।`,
      detailedAnalysisEn: `Phaladeepika confirms that 8th house spiritual alignments unlock clairvoyant intuitive faculties.`,
      remedyHi: `प्रतिदिन 15 मिनट मौन रहकर आज्ञा चक्र (भ्रूमध्य) पर ध्यान केंद्रित करें।`,
      remedyEn: `Meditate silently for 15 minutes at Third Eye (Ajna chakra) to awaken latent inner sight.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 69. दुर्घटना, शल्य चिकित्सा (सर्जरी) व घाव
  {
    const score = Math.max(35, Math.min(90, 52 + (mars.houseNumber === 8 ? -10 : 10) + getDignityBonus(saturn.dignity)));
    addDim({
      id: 69,
      houseNumber: 8,
      houseTitleHi: 'अष्टम भाव (आयु व रंध्र भाव)',
      houseTitleEn: '8th House (Ayu & Randhra)',
      category: 'longevity_health',
      categoryTitleHi: 'स्वास्थ्य व आयु',
      categoryTitleEn: 'Health & Longevity',
      titleHi: 'दुर्घटना, शल्य चिकित्सा (सर्जरी), रक्त विकार व घाव सुरक्षा',
      titleEn: 'Accident Immunity, Surgical Interventions & Trauma Defense',
      classicalRef: 'जातकाभरण (ढूँढिराज) अ. 18',
      divisionalRef: 'D1 व D30 (त्रिंशांश)',
      vakriNote: '',
      astroBasisHi: `मंगल (शल्य/रक्त) व राहु (आकस्मिकता); अष्टम भाव पर क्रूर ग्रहों का प्रभाव; सतर्कता सूत्र।`,
      astroBasisEn: `Mars (surgery/blood) and Rahu (sudden shocks); 8th house vulnerability parameters.`,
      verdictHi: `गंभीर दुर्घटनाओं से ईश्वरीय सुरक्षा; छोटी-मोटी सर्जरी के उपरांत शरीर में त्वरित स्वास्थ्य लाभ।`,
      verdictEn: `Shielded against catastrophic trauma; swift postoperative recuperation from minor surgical procedures.`,
      detailedAnalysisHi: `जातकाभरण के अनुसार मंगल का अष्टम से संबंध शल्य चिकित्सा कराता है, किंतु गुरु की दृष्टि उस कष्ट को तुरंत आरोग्य में बदल देती है।`,
      detailedAnalysisEn: `Jatakabharana notes that benefic aspects on Mars mitigate accident severity into swift recovery.`,
      remedyHi: `वाहन चलाते समय गति पर नियंत्रण रखें और मंगलवार को हनुमान बाहुक का पाठ करें।`,
      remedyEn: `Recite Hanuman Bahuk and drive with disciplined focus during Mars-Rahu sub-periods.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 70. मानहानि, सामाजिक लांछन व स्कैंडल
  {
    const score = Math.max(35, Math.min(92, 52 + (h8.placedHouse !== 10 ? 10 : -8) + getDignityBonus(sun.dignity)));
    addDim({
      id: 70,
      houseNumber: 8,
      houseTitleHi: 'अष्टम भाव (आयु व रंध्र भाव)',
      houseTitleEn: '8th House (Ayu & Randhra)',
      category: 'shadow_challenges',
      categoryTitleHi: 'चुनौतियां व सतर्कता',
      categoryTitleEn: 'Shadow Challenges',
      titleHi: 'अपयश, मानहानि, सामाजिक लांछन व स्कैंडल से सुरक्षा',
      titleEn: 'Defamation Defense, Scandal Immunity & Honor Protection',
      classicalRef: 'सारावली (कल्याण वर्मा) अ. 30',
      divisionalRef: 'D1 व D10 (दशमांश)',
      vakriNote: '',
      astroBasisHi: `सूर्य (प्रतिष्ठा कारक) की स्थिति; अष्टम व दशम भाव का संबंध; प्रतिष्ठा की रक्षा।`,
      astroBasisEn: `Sun (reputation) fortitude; 8th-10th axis preserving pristine honor against intrigues.`,
      verdictHi: `सामाजिक प्रतिष्ठा अक्षुण्ण; मिथ्या आरोपों अथवा लांछनों से सत्य की जीत के साथ पूर्ण मुक्ति।`,
      verdictEn: `Spotless personal reputation; eventual total vindication against jealous detractors or smears.`,
      detailedAnalysisHi: `सारावली के अनुसार यदि सूर्य और दशमेश बली हों, तो अष्टम भाव के विरोधी कभी जातक के मान-सम्मान को धूमिल नहीं कर पाते।`,
      detailedAnalysisEn: `Saravali confirms that a powerful Sun and 10th lord dismantle false allegations cleanly.`,
      remedyHi: `प्रतिदिन सूर्य गायत्री मंत्र का जप करें और कार्यक्षेत्र में पारदर्शिता बनाए रखें।`,
      remedyEn: `Chant Surya Gayatri Mantra and uphold uncompromising ethical transparency in all actions.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 71. गुप्त रोग, जननांग स्वास्थ्य व संक्रमण
  {
    const score = Math.max(35, Math.min(90, 50 + getDignityBonus(venus.dignity) + (saturn.houseNumber === 8 ? -8 : 8)));
    addDim({
      id: 71,
      houseNumber: 8,
      houseTitleHi: 'अष्टम भाव (आयु व रंध्र भाव)',
      houseTitleEn: '8th House (Ayu & Randhra)',
      category: 'longevity_health',
      categoryTitleHi: 'स्वास्थ्य व आयु',
      categoryTitleEn: 'Health & Longevity',
      titleHi: 'गुप्त अंग स्वास्थ्य, जननांग प्रणाली, मूत्राशय व संक्रमण मुक्ति',
      titleEn: 'Genital Health, Excretory System & Infection Immunity',
      classicalRef: 'बृहज्जातक (वराहमिहिर) अ. 23',
      divisionalRef: 'D1 व D30 (त्रिंशांश)',
      vakriNote: '',
      astroBasisHi: `अष्टम भाव (गुप्तांग); शुक्र (प्रजनन) व मंगल (रक्त) का प्रभाव; स्वच्छता व संतुलन।`,
      astroBasisEn: `8th house (excretory organs); Venus and Mars health indicators.`,
      verdictHi: `स्वस्थ जननांग व उत्सर्जन तंत्र; व्यक्तिगत स्वच्छता व पर्याप्त जल सेवन से संक्रमणों से बचाव।`,
      verdictEn: `Sound reproductive and excretory well-being; high hydration keeps latent urological issues dormant.`,
      detailedAnalysisHi: `बृहज्जातक के अनुसार अष्टम भाव शरीर के गुप्त अंगों का प्रतीक है। शुक्र की शुभता यहाँ शारीरिक धातु संतुलन बनाए रखती है।`,
      detailedAnalysisEn: `Brihat Jataka identifies the 8th house with the deep pelvic organs and tissue vitality.`,
      remedyHi: `पर्याप्त मात्रा में शुद्ध जल पिएं और एकादशी का उपवास रखें।`,
      remedyEn: `Stay well-hydrated throughout the day and observe occasional fasting to detoxify tissues.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 72. शोध, अन्वेषण, डेटा माइनिंग व पुरातत्व
  {
    const score = Math.max(40, Math.min(96, 52 + getDignityBonus(mercury.dignity) + getDignityBonus(saturn.dignity)));
    addDim({
      id: 72,
      houseNumber: 8,
      houseTitleHi: 'अष्टम भाव (आयु व रंध्र भाव)',
      houseTitleEn: '8th House (Ayu & Randhra)',
      category: 'education',
      categoryTitleHi: 'शिक्षा व विद्या',
      categoryTitleEn: 'Education & Intellect',
      titleHi: 'गहन शोध, अन्वेषण, डेटा माइनिंग, पुरातत्व व विश्लेषिकी',
      titleEn: 'Deep Research, Data Mining, Forensics & Archaeological Investigation',
      classicalRef: 'हाउ टू जज अ होरोस्कोप (डॉ. बी.वी. रमन) भाग 2',
      divisionalRef: 'D1 व D10 (दशमांश चक्र)',
      vakriNote: getVakriExplanation(saturn),
      astroBasisHi: `अष्टम भाव (गहराई) + बुध (विश्लेषण) + शनि (खोज/पुरातत्व); डेटा अन्वेषण योग।`,
      astroBasisEn: `8th house (depth) + Mercury (logic) + Saturn (excavation/forensics) synergy.`,
      verdictHi: `गहन शोध, साइबर सुरक्षा, डेटा एनालिटिक्स अथवा ऐतिहासिक अन्वेषण में विशिष्ट उपलब्धि का योग।`,
      verdictEn: `High intellectual mastery in deep research, cyber analytics, forensic auditing, or historical data.`,
      detailedAnalysisHi: `डॉ. बी.वी. रमन के अनुसार अष्टम भाव गहराई में छुपे सत्यों को खोजने का घर है। बुध और शनि यहाँ अद्भुत अन्वेषक बनाते हैं।`,
      detailedAnalysisEn: `Dr. B.V. Raman proves that 8th house Saturn-Mercury aspects produce brilliant investigative researchers.`,
      remedyHi: `शनिवार को तेल का दान करें और अध्ययन में निरंतरता बनाए रखें।`,
      remedyEn: `Donate mustard oil on Saturdays to honor Saturn's depth of analytical inquiry.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 73. पुनर्जन्म, मनोवैज्ञानिक रूपांतरण व मोक्ष संस्कार
  {
    const score = Math.max(45, Math.min(98, 55 + (ketu ? 15 : 10)));
    addDim({
      id: 73,
      houseNumber: 8,
      houseTitleHi: 'अष्टम भाव (आयु व रंध्र भाव)',
      houseTitleEn: '8th House (Ayu & Randhra)',
      category: 'spirituality',
      categoryTitleHi: 'आध्यात्म व मोक्ष',
      categoryTitleEn: 'Spirituality & Grace',
      titleHi: 'पुनर्जन्म संस्कार, मनोवैज्ञानिक कायाकल्प व आंतरिक रूपांतरण',
      titleEn: 'Psychic Rebirth, Deep Psychological Transformation & Spiritual Catharsis',
      classicalRef: 'भृगु नंदी नाड़ी (आर.जी. राव) व शिव पुराण',
      divisionalRef: 'D1 व D60 (षष्ठ्यांश चक्र)',
      vakriNote: '',
      astroBasisHi: `अष्टम भाव (कायाकल्प); केतु व चंद्रमा का संबंध; संकटों से तपकर कुंदन बनने का योग।`,
      astroBasisEn: `8th house (death of ego & rebirth); Ketu's transcendental alchemy of consciousness.`,
      verdictHi: `जीवन में संकटों के पश्चात अद्भुत मनोवैज्ञानिक कायाकल्प; हर आघात के बाद और अधिक शक्तिशाली होकर उभरना।`,
      verdictEn: `Phenomenal capacity for psychological rebirth; emerging stronger and enlightened from every life crisis.`,
      detailedAnalysisHi: `भृगु नंदी नाड़ी के अनुसार अष्टम भाव पुरानी चेतना की मृत्यु और नई आध्यात्मिक चेतना का जन्म है। यह जातक को महामानव बनाता है।`,
      detailedAnalysisEn: `Bhrigu Nandi Nadi establishes that 8th house crises dissolve ignorance, birthing profound spiritual selfhood.`,
      remedyHi: `प्रतिदिन ॐ नमः शिवाय का शांत भाव से जप करें और श्मशान काली अथवा भगवान शिव का ध्यान करें।`,
      remedyEn: `Chant "Om Namah Shivaya" with deep detachment to invite transformative spiritual awakening.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // =========================================================================
  // KHOND 9: नवम भाव (BHAGYA/DHARMA BHAVA) — धर्म, भाग्य, पिता, तीर्थ व गुरु (74 से 82)
  // =========================================================================

  // 74. भाग्योदय का वर्ष, आयु व दिशा
  {
    const score = Math.max(40, Math.min(98, 55 + getDignityBonus(h9.dignity) + (sav[8] >= 28 ? 12 : -8)));
    addDim({
      id: 74,
      houseNumber: 9,
      houseTitleHi: 'नवम भाव (भाग्य व धर्म भाव)',
      houseTitleEn: '9th House (Bhagya & Dharma)',
      category: 'wealth_fortune',
      categoryTitleHi: 'धन व समृद्धि',
      categoryTitleEn: 'Wealth & Prosperity',
      titleHi: 'भाग्योदय का वर्ष, स्वर्ण काल, आयु खंड व शुभ दिशा',
      titleEn: 'Timing of Fortune Awakening, Golden Era & Lucky Directions',
      classicalRef: 'फलदीपिका (मंत्रेश्वर) अ. 11',
      divisionalRef: 'D1 व D9 नवांश',
      vakriNote: getVakriExplanation(planets.find((p) => p.id === h9.lord)),
      astroBasisHi: `नवमेश ${h9.lordHi} भाव ${h9.placedHouse} में (${h9.dignityHi}); गुरु का प्रभाव; [SAV: नवम भाव ${sav[8]} बिंदु]।`,
      astroBasisEn: `9th Lord in H${h9.placedHouse} (${h9.dignity}); Jupiterian trine rays; [SAV: ${sav[8]} bindus].`,
      verdictHi: `28 से 36 वर्ष की आयु के मध्य प्रबल भाग्योदय; पूर्व अथवा ईशान दिशा में यात्रा व आजीविका से अपार उत्थान।`,
      verdictEn: `Golden fortune activation maturing between ages 28 to 36; East or North-East directions prove highly auspicious.`,
      detailedAnalysisHi: `मंत्रेश्वर के अनुसार नवमेश की स्थिति से भाग्योदय का वर्ष निश्चित होता है। गुरु और नवमेश का बल जातक को निरंतर प्रगति के सोपान चढ़ाता है।`,
      detailedAnalysisEn: `Phaladeepika confirms that 9th lord strength and Jupiterian transit triggers explosive life-altering luck.`,
      remedyHi: `गुरुवार को किसी मंदिर में पीले पुष्प और चने की दाल अर्पित करें।`,
      remedyEn: `Offer yellow blossoms and split chickpeas at a temple on Thursdays to accelerate fortune.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 75. पिता का सुख, समृद्धि, स्वास्थ्य व संबंध
  {
    const score = Math.max(35, Math.min(95, 52 + getDignityBonus(sun.dignity) + (h9.placedHouse !== 6 && h9.placedHouse !== 8 ? 10 : -8)));
    addDim({
      id: 75,
      houseNumber: 9,
      houseTitleHi: 'नवम भाव (भाग्य व धर्म भाव)',
      houseTitleEn: '9th House (Bhagya & Dharma)',
      category: 'family',
      categoryTitleHi: 'माता-पिता व कुल',
      categoryTitleEn: 'Family & Lineage',
      titleHi: 'पिता की समृद्धि, दीर्घायु, पिता का सुख व पितृ संबंध',
      titleEn: 'Father\'s Prosperity, Paternal Health, Lifespan & Affection',
      classicalRef: 'बृहत्पाराशर होराशास्त्र (पराशर) अ. 20',
      divisionalRef: 'D1 व D12 (द्वादशांश)',
      vakriNote: getVakriExplanation(sun),
      astroBasisHi: `नवमेश भाव ${h9.placedHouse} में; सूर्य (पितृकारक) भाव ${sun.houseNumber} में (${sun.dignity}); पितृ सुख।`,
      astroBasisEn: `9th Lord in H${h9.placedHouse}; Sun (Pitrukaraka) in H${sun.houseNumber} (${sun.dignity}); paternal bonds.`,
      verdictHi: `पिता का आशीर्वाद व नैतिक संबल; पिता समाज में सम्मानित व सिद्धांतों के प्रति अडिग व्यक्तित्व।`,
      verdictEn: `Solid paternal support and inherited integrity; father commands deep societal respect.`,
      detailedAnalysisHi: `महर्षि पराशर के अनुसार नवम भाव पिता का साक्षात घर है। सूर्य और नवमेश की शुभ स्थिति जातक को पिता का स्नेह और कुल की प्रतिष्ठा दिलाती है।`,
      detailedAnalysisEn: `BPHS confirms that harmonious Sun and 9th lord alignments confer paternal honor and lineage pride.`,
      remedyHi: `नित्य प्रातः पिता के चरण स्पर्श करें और उगते सूर्य को तांबे के पात्र से जल अर्पित करें।`,
      remedyEn: `Touch your father's feet for blessings daily and revere the paternal lineage.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 76. धर्म, ईश्वर निष्ठा, आस्तिकता व परोपकार
  {
    const score = Math.max(45, Math.min(98, 55 + getDignityBonus(jupiter.dignity) + getDignityBonus(sun.dignity)));
    addDim({
      id: 76,
      houseNumber: 9,
      houseTitleHi: 'नवम भाव (भाग्य व धर्म भाव)',
      houseTitleEn: '9th House (Bhagya & Dharma)',
      category: 'spirituality',
      categoryTitleHi: 'आध्यात्म व मोक्ष',
      categoryTitleEn: 'Spirituality & Grace',
      titleHi: 'धर्म निष्ठा, आस्तिकता, ईश्वर विश्वास व परोपकार भावना',
      titleEn: 'Religious Faith, Moral Piety, Dharma & Philanthropic Spirit',
      classicalRef: 'जातक पारिजात (वैद्यनाथ) अ. 16',
      divisionalRef: 'D1 व D20 (विंशांश चक्र)',
      vakriNote: getVakriExplanation(jupiter),
      astroBasisHi: `गुरु (धर्म कारक) भाव ${jupiter.houseNumber} में; नवम भाव पर शुभ दृष्टि; धार्मिक संस्कारों की सुदृढ़ता।`,
      astroBasisEn: `Jupiter (Dharmakaraka) in H${jupiter.houseNumber}; 9th house fortified with pious virtues.`,
      verdictHi: `अगाध ईश्वर निष्ठा, धार्मिक आस्तिकता तथा निःस्वार्थ भाव से समाज व असहायों की सेवा का संकल्प।`,
      verdictEn: `Steadfast moral piety, abiding faith in divine order, and deep philanthropic generosity.`,
      detailedAnalysisHi: `जातक पारिजात के अनुसार नवम भाव की पवित्रता जातक को अधर्म के मार्ग पर कभी नहीं जाने देती और जीवन भर धर्म उसकी रक्षा करता है।`,
      detailedAnalysisEn: `Jataka Parijata establishes that a fortified 9th house keeps the native anchored in virtue (Dharmo Rakshati Rakshitah).`,
      remedyHi: `नियमित रूप से किसी धार्मिक स्थल अथवा गौशाला में श्रम अथवा धन का दान करें।`,
      remedyEn: `Support ethical sanctuaries or orphanages with selfless financial and physical seva.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 77. गुरु कृपा, आध्यात्मिक दीक्षा व मेंटरशिप
  {
    const score = Math.max(40, Math.min(96, 54 + getDignityBonus(jupiter.dignity)));
    addDim({
      id: 77,
      houseNumber: 9,
      houseTitleHi: 'नवम भाव (भाग्य व धर्म भाव)',
      houseTitleEn: '9th House (Bhagya & Dharma)',
      category: 'spirituality',
      categoryTitleHi: 'आध्यात्म व मोक्ष',
      categoryTitleEn: 'Spirituality & Grace',
      titleHi: 'सद्गुरु कृपा, आध्यात्मिक दीक्षा, गुरु-आशीर्वाद व मेंटरशिप',
      titleEn: 'Spiritual Guru, Divine Initiation & Wise Mentorship',
      classicalRef: 'सारावली (कल्याण वर्मा) अ. 31',
      divisionalRef: 'D1 व D9 नवांश',
      vakriNote: getVakriExplanation(jupiter),
      astroBasisHi: `नवमेश भाव ${h9.placedHouse} में; गुरु भाव ${jupiter.houseNumber} में; सद्गुरु कृपा योग।`,
      astroBasisEn: `9th Lord in H${h9.placedHouse}; Jupiter in H${jupiter.houseNumber}; spiritual preceptor alignment.`,
      verdictHi: `योग्य व सिद्ध सद्गुरु की प्राप्ति; जीवन के महत्वपूर्ण मोड़ों पर सही मार्गदर्शन व आशीर्वाद।`,
      verdictEn: `Encounter with enlightened mentors and genuine spiritual gurus guiding the life course.`,
      detailedAnalysisHi: `सारावली के अनुसार नवम भाव गुरु का है। यहाँ शुभ ग्रह होने पर जातक को सच्चे पथप्रदर्शक मिलते हैं जो भटकाव से बचाते हैं।`,
      detailedAnalysisEn: `Saravali establishes the 9th house as the portal to transformative spiritual preceptors and mentors.`,
      remedyHi: `गुरु पूर्णिमा अथवा गुरुवार को अपने गुरु का नमन करें और ॐ गुं गुरुवे नमः का जप करें।`,
      remedyEn: `Honor your teachers and preceptors on Thursdays; chant "Om Gum Gurave Namah".`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 78. तीर्थयात्राएं, धार्मिक प्रवास व मंदिर निर्माण
  {
    const score = Math.max(40, Math.min(95, 52 + getDignityBonus(jupiter.dignity) + (h9.placedHouse === 9 || h9.placedHouse === 12 ? 12 : 0)));
    addDim({
      id: 78,
      houseNumber: 9,
      houseTitleHi: 'नवम भाव (भाग्य व धर्म भाव)',
      houseTitleEn: '9th House (Bhagya & Dharma)',
      category: 'spirituality',
      categoryTitleHi: 'आध्यात्म व मोक्ष',
      categoryTitleEn: 'Spirituality & Grace',
      titleHi: 'तीर्थाटन, चार धाम यात्रा, पवित्र नदी स्नान व धर्मस्थल निर्माण',
      titleEn: 'Sacred Pilgrimages, Holy River Ablutions & Temple Building',
      classicalRef: 'सर्वार्थ चिंतामणि (वेंकटेश शर्मा) अ. 9',
      divisionalRef: 'D1 व D20 (विंशांश)',
      vakriNote: '',
      astroBasisHi: `नवम भाव (तीर्थ यात्रा) व द्वादश भाव (मोक्ष स्थल); गुरु व चंद्रमा का प्रभाव।`,
      astroBasisEn: `9th house (pilgrimage) & 12th house (sanctuary); Jupiter and Moon travel synergy.`,
      verdictHi: `चार धाम, प्रमुख ज्योतिर्लिंग व पावन तीर्थ स्थलों की सफल यात्राओं का उत्कृष्ट योग।`,
      verdictEn: `Fulfilling sacred pilgrimages to historic Jyotirlingas, holy shrines, and sanctified rivers.`,
      detailedAnalysisHi: `सर्वार्थ चिंतामणि के अनुसार नवमेश की शुभ स्थिति जातक को जीवन भर पुण्य तीर्थों के दर्शन का अवसर प्रदान करती है।`,
      detailedAnalysisEn: `Sarvartha Chintamani links 9th house strength with frequent sacred journeys that dissolve negative karma.`,
      remedyHi: `किसी तीर्थ स्थल पर जाकर छायादार वृक्ष लगाएं अथवा वहां आने वाले तीर्थयात्रियों को शीतल जल पिलाएं।`,
      remedyEn: `Serve cool drinking water or plant shade trees at pilgrimage shrines.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 79. उच्च दर्शन, कानून, विधि व न्यायशास्त्र
  {
    const score = Math.max(40, Math.min(96, 52 + getDignityBonus(jupiter.dignity) + getDignityBonus(saturn.dignity)));
    addDim({
      id: 79,
      houseNumber: 9,
      houseTitleHi: 'नवम भाव (भाग्य व धर्म भाव)',
      houseTitleEn: '9th House (Bhagya & Dharma)',
      category: 'education',
      categoryTitleHi: 'शिक्षा व विद्या',
      categoryTitleEn: 'Education & Intellect',
      titleHi: 'उच्च दर्शन, विधि, कानून, न्यायशास्त्र व सैद्धांतिक शोध',
      titleEn: 'Higher Jurisprudence, Constitutional Law & Philosophical Mastery',
      classicalRef: 'भावार्थ रत्नाकर (रामानुजाचार्य)',
      divisionalRef: 'D1 व D10 (दशमांश)',
      vakriNote: getVakriExplanation(jupiter),
      astroBasisHi: `नवमेश भाव ${h9.placedHouse} में; गुरु (विधि) व शनि (न्याय) की युति या दृष्टि।`,
      astroBasisEn: `9th Lord in H${h9.placedHouse}; Jupiter (law) & Saturn (justice) jurisprudence resonance.`,
      verdictHi: `कानून, संविधान, दर्शन अथवा उच्च न्यायशास्त्र के सिद्धांतों को गहराई से समझने की उत्कृष्ट क्षमता।`,
      verdictEn: `Exceptional mastery over constitutional jurisprudence, legal frameworks, and deep philosophy.`,
      detailedAnalysisHi: `भावार्थ रत्नाकर अनुसार नवम भाव न्याय और दर्शन का सर्वोच्च शिखर है। गुरु का प्रभाव जातक को निष्पक्ष न्यायप्रिय बनाता है।`,
      detailedAnalysisEn: `Bhavartha Ratnakara confirms that Jupiter upon the 9th house fashions righteous legal intellects.`,
      remedyHi: `सत्य और न्याय के मार्ग पर अडिग रहें और किसी निर्धन को विधिक सहायता प्रदान करें।`,
      remedyEn: `Provide free legal or ethical assistance to those wrongfully oppressed.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 80. लंबी दूरी की विदेश यात्राएं व उच्च अध्ययन प्रवास
  {
    const score = Math.max(40, Math.min(95, 52 + (h9.placedHouse === 12 || h12.placedHouse === 9 ? 15 : 0) + (rahu ? 10 : 0)));
    addDim({
      id: 80,
      houseNumber: 9,
      houseTitleHi: 'नवम भाव (भाग्य व धर्म भाव)',
      houseTitleEn: '9th House (Bhagya & Dharma)',
      category: 'career',
      categoryTitleHi: 'करियर व पद',
      categoryTitleEn: 'Career & Authority',
      titleHi: 'लंबी दूरी की विदेश यात्राएं, उच्च अध्ययन प्रवास व वैश्विक ख्याति',
      titleEn: 'Intercontinental Travels, Overseas Higher Studies & Global Renown',
      classicalRef: 'टाइमिंग ऑफ इवेंट्स थ्रू विंशोत्तरी (के.एन. राव)',
      divisionalRef: 'D1 व D9 नवांश',
      vakriNote: '',
      astroBasisHi: `नवम भाव (दूर देश) व द्वादश भाव (समुद्र पार); राहु व गुरु का संबंध; विदेश यात्रा योग।`,
      astroBasisEn: `9th house (long travel) & 12th house (across seas); Rahu-Jupiter global travel nexus.`,
      verdictHi: `समुद्र पार विदेश यात्राओं व अंतरराष्ट्रीय विश्वविद्यालयों/संस्थानों में अध्ययन का प्रबल योग।`,
      verdictEn: `Intercontinental voyages with stellar outcomes in overseas universities and international forums.`,
      detailedAnalysisHi: `के.एन. राव की पद्धति अनुसार नवम और द्वादश भाव की दशा में जातक सुदूर देशों की यात्रा करता है और उसका भाग्य चमकता है।`,
      detailedAnalysisEn: `K.N. Rao's Dasha timings confirm that 9th-12th interactions activate fruitful intercontinental travel.`,
      remedyHi: `यात्रा पर जाने से पहले गुरुजनों का आशीर्वाद लें और भगवान विष्णु के सहस्त्रनाम का पाठ करें।`,
      remedyEn: `Recite Vishnu Sahasranama before undertaking long international transits.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 81. पौत्र-पौत्री सुख एवं भावी कुल परंपरा
  {
    const score = Math.max(35, Math.min(92, 50 + getDignityBonus(jupiter.dignity)));
    addDim({
      id: 81,
      houseNumber: 9,
      houseTitleHi: 'नवम भाव (भाग्य व धर्म भाव)',
      houseTitleEn: '9th House (Bhagya & Dharma)',
      category: 'progeny',
      categoryTitleHi: 'संतान व वंश',
      categoryTitleEn: 'Progeny & Lineage',
      titleHi: 'पौत्र-पौत्री सुख, भावी कुल परंपरा व वृद्धावस्था में वंश दर्शन',
      titleEn: 'Grandchildren, Extended Progeny & Ancestral Lineage Continuity',
      classicalRef: 'बृहत्पाराशर होराशास्त्र (पराशर) अ. 20',
      divisionalRef: 'D1 व D7 (सप्तांश)',
      vakriNote: '',
      astroBasisHi: `नवम भाव (पंचम से पंचम यानी संतान की संतान); गुरु (संतान कारक) की शुभ स्थिति।`,
      astroBasisEn: `9th house (5th from 5th = grandchildren); Jupiter's benevolent generational gaze.`,
      verdictHi: `पौत्र-पौत्रियों के खिलखिलाते सुख से परिपूर्ण वृद्धावस्था; कुल की परंपराएं आगे बढ़ने का संतोष।`,
      verdictEn: `Delightful bonding with grandchildren and deep generational contentment in elder years.`,
      detailedAnalysisHi: `महर्षि पराशर के भावत भावम सिद्धांत अनुसार पंचम से पंचम यानी नवम भाव पौत्र सुख का निर्धारण करता है।`,
      detailedAnalysisEn: `BPHS confirms that the 9th house as the 5th from 5th ensures joy through grandchildren.`,
      remedyHi: `छोटे बच्चों को फल व मिष्ठान्न बांटें और परिवार में मधुरता बनाए रखें।`,
      remedyEn: `Distribute sweet fruits to young children during festive gatherings.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 82. पूर्वजों का आशीर्वाद बनाम पितृ दोष निवारण
  {
    const score = Math.max(35, Math.min(90, 52 + (sun.dignity === 'Debilitated' || (rahu && rahu.houseNumber === 9) ? -15 : 10)));
    addDim({
      id: 82,
      houseNumber: 9,
      houseTitleHi: 'नवम भाव (भाग्य व धर्म भाव)',
      houseTitleEn: '9th House (Bhagya & Dharma)',
      category: 'shadow_challenges',
      categoryTitleHi: 'चुनौतियां व सतर्कता',
      categoryTitleEn: 'Shadow Challenges',
      titleHi: 'पूर्वजों का आशीर्वाद, पितृ तृप्ति व पितृ ऋण निवारण',
      titleEn: 'Ancestral Blessings, Pitru Debt Clearance & Lineage Pacification',
      classicalRef: 'लाल किताब (पं. रूपचंद जोशी 1952) पितृ ऋण अध्याय',
      divisionalRef: 'D1 व D12 (द्वादशांश)',
      vakriNote: '',
      astroBasisHi: `सूर्य व राहु का संबंध; नवम भाव पर प्रभाव; पितृ तर्पण व शांति की स्थिति।`,
      astroBasisEn: `Sun and Rahu dynamics; 9th house ancestral debt calculations.`,
      verdictHi: `पितरों के तर्पण व दान से पूर्वजों का पूर्ण आशीर्वाद; पितृ दोष का शमन कर कुल की उन्नति।`,
      verdictEn: `Generational ancestral debts pacified through shraddha rites, releasing powerful ancestral blessings.`,
      detailedAnalysisHi: `लाल किताब के अनुसार नवम भाव में पितृ ऋण का शमन करने से जातक के बंद भाग्य के ताले स्वतः खुल जाते हैं।`,
      detailedAnalysisEn: `Lal Kitab shows that fulfilling ancestral obligations dissolves unseen obstacles in professional life.`,
      remedyHi: `पितृपक्ष में पितरों का विधिवत श्राद्ध करें और प्रतिदिन कौवों व कुत्तों को भोजन दें।`,
      remedyEn: `Perform Shraddha rites in Pitru Paksha and feed crows and stray animals daily.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // =========================================================================
  // KHOND 10: दशम भाव (KARMA BHAVA) — कर्म, आजीविका, पद, प्रतिष्ठा व सत्ता (83 से 91)
  // =========================================================================

  // 83. आजीविका मार्ग: नौकरी बनाम स्वतंत्र उद्यम
  {
    const isBusiness = (h10.placedHouse === 7 || h7.placedHouse === 10 || h10.placedHouse === 11 || mercury.houseNumber === 10);
    const score = Math.max(40, Math.min(96, 54 + getDignityBonus(h10.dignity)));
    addDim({
      id: 83,
      houseNumber: 10,
      houseTitleHi: 'दशम भाव (कर्म व आजीविका भाव)',
      houseTitleEn: '10th House (Karma & Vocation)',
      category: 'career',
      categoryTitleHi: 'करियर व पद',
      categoryTitleEn: 'Career & Authority',
      titleHi: 'आजीविका की दिशा: स्वतंत्र व्यवसाय/उद्यमिता बनाम उच्च पदस्थ नौकरी',
      titleEn: 'Career Path: Independent Entrepreneurship vs Executive Employment',
      classicalRef: 'फलदीपिका (मंत्रेश्वर) अ. 11',
      divisionalRef: 'D1 व D10 (दशमांश चक्र)',
      vakriNote: getVakriExplanation(planets.find((p) => p.id === h10.lord)),
      astroBasisHi: `दशमेश ${h10.lordHi} भाव ${h10.placedHouse} में (${h10.dignityHi}); षष्ठ भाव (नौकरी) व सप्तम भाव (व्यवसाय) का तुलनात्मक बल।`,
      astroBasisEn: `10th Lord in H${h10.placedHouse} (${h10.dignity}); comparative strengths of 6th (service) vs 7th/10th (enterprise).`,
      verdictHi: `${isBusiness ? 'स्वतंत्र व्यवसाय, उद्यमिता अथवा कंसल्टेंसी में अपार सफलता का योग' : 'प्रतिष्ठित संस्थान अथवा शासन में उच्च पदस्थ कार्यकारी नौकरी में सफलता'}।`,
      verdictEn: `${isBusiness ? 'High aptitude for independent business enterprise, entrepreneurship or consulting' : 'Distinguished career in high-ranking institutional employment or corporate leadership'}.`,
      detailedAnalysisHi: `मंत्रेश्वर के अनुसार दशमेश जिस भाव और राशि में बैठता है, जातक का कर्म उसी दिशा में अग्रसर होता है। स्वतंत्र निर्णय लेने की क्षमता आजीविका को नई ऊंचाइयों पर ले जाती है।`,
      detailedAnalysisEn: `Phaladeepika confirms that 10th lord disposition determines whether native flourishes as captain of enterprise or executive leader.`,
      remedyHi: `कार्यक्षेत्र में सूर्य यंत्र स्थापित करें और प्रातः कार्य आरंभ करने से पहले ईश्वर का नमन करें।`,
      remedyEn: `Install a Surya Yantra in office and initiate major commercial ventures during Shukla Paksha.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 84. सरकारी नौकरी, प्रशासनिक सेवा (IAS/IPS/UPSC)
  {
    const score = Math.max(35, Math.min(96, 50 + getDignityBonus(sun.dignity) + (h10.placedHouse === 1 || h10.placedHouse === 10 ? 14 : 0)));
    addDim({
      id: 84,
      houseNumber: 10,
      houseTitleHi: 'दशम भाव (कर्म व आजीविका भाव)',
      houseTitleEn: '10th House (Karma & Vocation)',
      category: 'career',
      categoryTitleHi: 'करियर व पद',
      categoryTitleEn: 'Career & Authority',
      titleHi: 'सरकारी नौकरी, प्रशासनिक सेवा (IAS/IPS/PSC), राजसत्ता व पीएसयू',
      titleEn: 'Government Service, Bureaucracy (IAS/IPS), Public Sector & State Authority',
      classicalRef: 'कर्म एंड रीबर्थ (के.एन. राव)',
      divisionalRef: 'D1 व D10 (दशमांश)',
      vakriNote: getVakriExplanation(sun),
      astroBasisHi: `सूर्य (राजसत्ता कारक) भाव ${sun.houseNumber} में; दशमेश भाव ${h10.placedHouse} में; मंगल का प्रशासनिक बल।`,
      astroBasisEn: `Sun (King/State) in H${sun.houseNumber}; 10th Lord in H${h10.placedHouse}; Mars bureaucratic vigor.`,
      verdictHi: `शासन, अर्ध-सरकारी उपक्रमों अथवा उच्च प्रशासनिक पदों से जुड़कर कार्य करने का अत्यंत अनुकूल योग।`,
      verdictEn: `High astrological favorability for government administration, civil service, or state regulatory bodies.`,
      detailedAnalysisHi: `के.एन. राव के अनुसार जब सूर्य, मंगल और दशम भाव का संबंध शुभ हो, तो जातक शासन की रीढ़ बनकर कार्य करता है।`,
      detailedAnalysisEn: `K.N. Rao proves that Sun-Mars-10th house convergence elevates native into government power corridors.`,
      remedyHi: `नित्य प्रातः सूर्य को तांबे के लोटे से जल दें और रविवार को नमक का त्याग करें।`,
      remedyEn: `Offer Arghya to Sun from copper vessel daily and abstain from added salt on Sundays.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 85. कॉर्पोरेट नेतृत्व, प्रबंधन व बहुराष्ट्रीय कंपनियां
  {
    const score = Math.max(40, Math.min(96, 52 + getDignityBonus(mercury.dignity) + getDignityBonus(jupiter.dignity)));
    addDim({
      id: 85,
      houseNumber: 10,
      houseTitleHi: 'दशम भाव (कर्म व आजीविका भाव)',
      houseTitleEn: '10th House (Karma & Vocation)',
      category: 'career',
      categoryTitleHi: 'करियर व पद',
      categoryTitleEn: 'Career & Authority',
      titleHi: 'कॉर्पोरेट नेतृत्व, बहुराष्ट्रीय कंपनियां (MNCs), प्रबंधन व सीईओ पद',
      titleEn: 'Corporate Leadership, MNC Executive Track & Senior Management',
      classicalRef: 'हाउ टू जज अ होरोस्कोप (डॉ. बी.वी. रमन) भाग 2',
      divisionalRef: 'D1 व D10 (दशमांश चक्र)',
      vakriNote: getVakriExplanation(mercury),
      astroBasisHi: `बुध (प्रबंधन) + गुरु (दूरदर्शिता) + दशम भाव; बहुराष्ट्रीय कॉर्पोरेट योग।`,
      astroBasisEn: `Mercury (management) + Jupiter (strategic vision) + 10th house corporate resonance.`,
      verdictHi: `कॉर्पोरेट क्षेत्र में तीव्र पदोन्नति; वरिष्ठ प्रबंधन, निदेशक अथवा सीईओ पद तक पहुंचने का सामर्थ्य।`,
      verdictEn: `Rapid corporate ascension with caliber to reach C-suite executive or Director-level authority.`,
      detailedAnalysisHi: `डॉ. बी.वी. रमन के अनुसार बुध और गुरु का संयुक्त प्रभाव जातक को जटिल वैश्विक संगठनों का कुशल रणनीतिकार बनाता है।`,
      detailedAnalysisEn: `Dr. B.V. Raman highlights that Mercury-Jupiter alliance in 10th house produces top-tier corporate titans.`,
      remedyHi: `बुधवार को गणेश जी को लड्डू का भोग लगाएं और कार्यक्षेत्र में सभी का सम्मान करें।`,
      remedyEn: `Offer sweets to Lord Ganesha on Wednesdays and maintain exemplary executive diplomacy.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 86. राजनीति, सत्ता, चुनाव व जन-प्रतिनिधित्व
  {
    const score = Math.max(35, Math.min(92, 50 + getDignityBonus(sun.dignity) + (rahu?.houseNumber === 10 ? 12 : 0)));
    addDim({
      id: 86,
      houseNumber: 10,
      houseTitleHi: 'दशम भाव (कर्म व आजीविका भाव)',
      houseTitleEn: '10th House (Karma & Vocation)',
      category: 'career',
      categoryTitleHi: 'करियर व पद',
      categoryTitleEn: 'Career & Authority',
      titleHi: 'राजनीति, चुनाव, जन-प्रतिनिधित्व, सत्ता व जन-समर्थन',
      titleEn: 'Politics, Electoral Governance, Public Office & Mass Mandate',
      classicalRef: 'जातक पारिजात (वैद्यनाथ) अ. 15',
      divisionalRef: 'D1 व D10 (दशमांश)',
      vakriNote: '',
      astroBasisHi: `सूर्य (सत्ता) + राहु (जन समर्थन/राजनीति) + दशम भाव; राजनीतिक कद का निर्धारण।`,
      astroBasisEn: `Sun (power) + Rahu (masses/political cunning) + 10th house governance dynamics.`,
      verdictHi: `राजनीतिक कूटनीति व जन-समर्थन प्राप्त करने की क्षमता; नीतिगत समितियों में प्रभाव।`,
      verdictEn: `High capacity for political diplomacy, public policy steering, and influential community leadership.`,
      detailedAnalysisHi: `जातक पारिजात के अनुसार जब सूर्य और राहु का दशम भाव से संबंध हो, तो जातक जन-आंदोलनों और सत्ता की धुरी में सक्रिय रहता है।`,
      detailedAnalysisEn: `Jataka Parijata links Sun and Rahu on the 10th house with kingmaker abilities and electoral influence.`,
      remedyHi: `गरीबों को कंबल अथवा भोजन दान करें और शनिवार को शनि मंदिर में सरसों का तेल अर्पित करें।`,
      remedyEn: `Distribute warm blankets and food to the homeless on Saturdays to fortify mass loyalty.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 87. समाज में मान-सम्मान, पद-प्रतिष्ठा व राष्ट्रीय ख्याति
  {
    const score = Math.max(40, Math.min(98, 54 + getDignityBonus(sun.dignity) + getDignityBonus(jupiter.dignity)));
    addDim({
      id: 87,
      houseNumber: 10,
      houseTitleHi: 'दशम भाव (कर्म व आजीविका भाव)',
      houseTitleEn: '10th House (Karma & Vocation)',
      category: 'identity',
      categoryTitleHi: 'पहचान व आत्म',
      categoryTitleEn: 'Identity & Core Self',
      titleHi: 'सामाजिक मान-सम्मान, उच्च पद-प्रतिष्ठा व राष्ट्रीय ख्याति',
      titleEn: 'Societal Honors, Public Acclaim, National Awards & High Standing',
      classicalRef: 'सर्वार्थ चिंतामणि (वेंकटेश शर्मा) अ. 10',
      divisionalRef: 'D1 व D10 (दशमांश चक्र)',
      vakriNote: '',
      astroBasisHi: `दशमेश भाव ${h10.placedHouse} में; सूर्य व गुरु का शुभ संबंध; यश व कीर्ति योग।`,
      astroBasisEn: `10th Lord in H${h10.placedHouse}; Sun-Jupiter prestigious alliance; fame indicators.`,
      verdictHi: `समाज में आदरणीय स्थान; अपने क्षेत्र में विशिष्ट योगदान हेतु सम्मान, पुरस्कार व राष्ट्रीय ख्याति।`,
      verdictEn: `Towering societal standing; recipient of awards, institutional honors, and wide public acclaim.`,
      detailedAnalysisHi: `सर्वार्थ चिंतामणि के अनुसार दशम भाव जब शुभ ग्रहों से संयुक्त हो, तो जातक की कीर्ति चारों दिशाओं में फैलती है।`,
      detailedAnalysisEn: `Sarvartha Chintamani confirms that an exalted 10th house spreads the native's fame across distant shores.`,
      remedyHi: `माथे पर चंदन का तिलक लगाएं और समाज के हित में किए गए कार्यों का कभी अहंकार न करें।`,
      remedyEn: `Apply sandalwood paste upon Ajna chakra daily and remain humble amidst accolades.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 88. कार्यक्षेत्र में पदोन्नति, स्थानांतरण व स्थायित्व
  {
    const score = Math.max(35, Math.min(95, 52 + (sav[9] >= 28 ? 12 : -8) + getDignityBonus(saturn.dignity)));
    addDim({
      id: 88,
      houseNumber: 10,
      houseTitleHi: 'दशम भाव (कर्म व आजीविका भाव)',
      houseTitleEn: '10th House (Karma & Vocation)',
      category: 'career',
      categoryTitleHi: 'करियर व पद',
      categoryTitleEn: 'Career & Authority',
      titleHi: 'कार्यक्षेत्र में पदोन्नति, अनुकूल स्थानांतरण व पद-स्थायित्व',
      titleEn: 'Promotions, Favorable Job Transfers & Institutional Tenacity',
      classicalRef: 'केपी रीडर्स (के.एस. कृष्णमूर्ति) रीडर 6',
      divisionalRef: 'D1 व D10 (दशमांश)',
      vakriNote: getVakriExplanation(saturn),
      astroBasisHi: `दशम भाव (कर्म) व एकादश भाव (लाभ); शनि का स्थायित्व; [SAV: दशम भाव ${sav[9]} बिंदु]।`,
      astroBasisEn: `10th house (status) & 11th house (promotion/raise); [SAV: 10th house ${sav[9]} bindus].`,
      verdictHi: `कार्यक्षेत्र में नियमित पदोन्नति व पद-वृद्धि; अनुकूल स्थानांतरण से करियर को नई गति।`,
      verdictEn: `Systematic merit-based promotions; career transfers unlock accelerated professional advancement.`,
      detailedAnalysisHi: `केपी सिस्टम के अनुसार जब दशमेश का संबंध एकादश भाव से जुड़ता है, तो पदोन्नति और वेतन वृद्धि निश्चित होती है।`,
      detailedAnalysisEn: `KP System confirms that 10th-11th cuspal sub-lord synergy triggers promotions and organizational recognition.`,
      remedyHi: `शनिवार को पीपल के वृक्ष की जड़ में जल अर्पित करें और कार्यस्थल पर सहयोगियों की मदद करें।`,
      remedyEn: `Water Peepal tree roots on Saturdays to stabilize career tenure and unlock promotions.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 89. पिता का व्यवसाय व पैतृक कर्म विरासत
  {
    const score = Math.max(35, Math.min(92, 50 + getDignityBonus(sun.dignity) + (h10.placedHouse === 9 || h9.placedHouse === 10 ? 15 : 0)));
    addDim({
      id: 89,
      houseNumber: 10,
      houseTitleHi: 'दशम भाव (कर्म व आजीविका भाव)',
      houseTitleEn: '10th House (Karma & Vocation)',
      category: 'career',
      categoryTitleHi: 'करियर व पद',
      categoryTitleEn: 'Career & Authority',
      titleHi: 'पिता का व्यवसाय, पारिवारिक कारोबार व पैतृक कर्म विरासत',
      titleEn: 'Father\'s Enterprise, Family Business & Ancestral Vocation',
      classicalRef: 'बृहत्पाराशर होराशास्त्र (पराशर) अ. 20',
      divisionalRef: 'D1 व D10 (दशमांश चक्र)',
      vakriNote: '',
      astroBasisHi: `दशम भाव (कर्म) व नवम भाव (पिता); सूर्य की स्थिति; पैतृक व्यापार विस्तार योग।`,
      astroBasisEn: `10th house (vocation) & 9th house (father); Sun's ancestral enterprise indicators.`,
      verdictHi: `पैतृक व्यवसाय अथवा पारिवारिक कार्य को आगे बढ़ाने से प्रचुर सफलता व प्रतिष्ठा का योग।`,
      verdictEn: `Highly auspicious prospects in taking over, modernizing, and expanding the family business empire.`,
      detailedAnalysisHi: `महर्षि पराशर अनुसार नवमेश और दशमेश का योग (धर्म-कर्माधिपति योग) जातक को पिता की कर्म विरासत को स्वर्णिम बनाने की शक्ति देता है।`,
      detailedAnalysisEn: `BPHS confirms that Dharma-Karmadhipati yoga ensures generational commercial legacy triumphs.`,
      remedyHi: `पिता के साथ मिलकर किसी नए कार्य की नींव रखें और उनके अनुभवों का आदर करें।`,
      remedyEn: `Inaugurate major commercial milestones in paternal presence to honor ancestral grace.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 90. उद्योग, फैक्ट्रियां, विनिर्माण व इंफ्रास्ट्रक्चर
  {
    const score = Math.max(35, Math.min(95, 52 + getDignityBonus(saturn.dignity) + getDignityBonus(mars.dignity)));
    addDim({
      id: 90,
      houseNumber: 10,
      houseTitleHi: 'दशम भाव (कर्म व आजीविका भाव)',
      houseTitleEn: '10th House (Karma & Vocation)',
      category: 'career',
      categoryTitleHi: 'करियर व पद',
      categoryTitleEn: 'Career & Authority',
      titleHi: 'उद्योग, फैक्ट्रियां, विनिर्माण, मशीनरी, रियल एस्टेट व इंफ्रास्ट्रक्चर',
      titleEn: 'Manufacturing, Heavy Industry, Infrastructure & Machinery',
      classicalRef: 'सारावली (कल्याण वर्मा) अ. 32',
      divisionalRef: 'D1 व D10 (दशमांश)',
      vakriNote: getVakriExplanation(saturn),
      astroBasisHi: `शनि (मशीनरी/श्रम) + मंगल (इंजीनियरिंग/भूमि) + दशम भाव; औद्योगिक साम्राज्य योग।`,
      astroBasisEn: `Saturn (heavy machinery) + Mars (industrial forge) + 10th house manufacturing axis.`,
      verdictHi: `उद्योग, विनिर्माण, फैक्ट्रियों, निर्माण कार्य अथवा तकनीकी मशीनरी के व्यवसाय में अपार सफलता।`,
      verdictEn: `Grand success in manufacturing plants, heavy infrastructure, machinery distribution, or industrial setups.`,
      detailedAnalysisHi: `सारावली के अनुसार जब शनि और मंगल दशम भाव से संबंध बनाते हैं, तो जातक सैकड़ों श्रमिकों का संरक्षक और विशाल उद्योगों का स्वामी बनता है।`,
      detailedAnalysisEn: `Saravali demonstrates that Saturn-Mars in 10th house constructs industrial and infrastructural powerhouses.`,
      remedyHi: `शनिवार को कारखाने या कार्यस्थल के मुख्य द्वार पर लोहे का स्वास्तिक अथवा सुरक्षा यंत्र स्थापित करें।`,
      remedyEn: `Consecrate an iron horseshoe or protective yantra at the factory entrance on Saturday.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 91. विशेषज्ञ प्रोफेशन: चिकित्सा, तकनीक, फाइनेंस व सीए
  {
    const score = Math.max(40, Math.min(96, 52 + getDignityBonus(mercury.dignity) + getDignityBonus(mars.dignity)));
    addDim({
      id: 91,
      houseNumber: 10,
      houseTitleHi: 'दशम भाव (कर्म व आजीविका भाव)',
      houseTitleEn: '10th House (Karma & Vocation)',
      category: 'career',
      categoryTitleHi: 'करियर व पद',
      categoryTitleEn: 'Career & Authority',
      titleHi: 'विशेषज्ञ पेशा: चिकित्सा (डॉक्टर), आईटी, चार्टर्ड अकाउंटेंट (CA) व विधि',
      titleEn: 'Specialized Professions: Medicine, Technology, Finance, CA & Legal Practice',
      classicalRef: 'फलदीपिका (मंत्रेश्वर) अ. 11',
      divisionalRef: 'D1 व D10 (दशमांश चक्र)',
      vakriNote: getVakriExplanation(mercury),
      astroBasisHi: `दशम भाव में ग्रह; बुध (अकाउंट/आईटी), मंगल (सर्जन/इंजीनियर), गुरु (फाइनेंस/विधि)।`,
      astroBasisEn: `10th house planetary profile; technical, financial or medical specialized mastery.`,
      verdictHi: `तकनीकी, वित्तीय अथवा चिकित्सा के क्षेत्र में सर्वोच्च विशेषज्ञता प्राप्त कर ख्याति अर्जित करने का योग।`,
      verdictEn: `Distinguished career in high-precision professions: technology architect, physician, or financial controller.`,
      detailedAnalysisHi: `मंत्रेश्वर के अनुसार दशम भाव पर प्रभाव डालने वाले विशिष्ट ग्रहों के अनुसार जातक अपने युग के सबसे कुशल प्रोफेशनल्स में गिना जाता है।`,
      detailedAnalysisEn: `Phaladeepika confirms that 10th house planetary combinations bestow specialized professional mastery.`,
      remedyHi: `अपने कार्य के औजारों, लैपटॉप अथवा पुस्तकों को सदैव आदरपूर्वक व व्यवस्थित रखें।`,
      remedyEn: `Treat instruments of vocation with reverence to sustain professional clarity.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // =========================================================================
  // KHOND 11: एकादश भाव (LABHA BHAVA) — लाभ, आय, मित्र, बड़े भाई व इच्छापूर्ति (92 से 96)
  // =========================================================================

  // 92. आय के नियमित स्रोत एवं बहु-आय के मार्ग
  {
    const score = Math.max(45, Math.min(98, 55 + (sav[10] >= 28 ? 14 : -8) + getDignityBonus(h11.dignity)));
    addDim({
      id: 92,
      houseNumber: 11,
      houseTitleHi: 'एकादश भाव (लाभ व आय भाव)',
      houseTitleEn: '11th House (Labha & Gains)',
      category: 'wealth_fortune',
      categoryTitleHi: 'धन व समृद्धि',
      categoryTitleEn: 'Wealth & Prosperity',
      titleHi: 'आय के नियमित स्रोत, बहु-आयामी आवक व प्रचुर आर्थिक लाभ',
      titleEn: 'Regular Income Streams, Multiple Cash Inflow Channels & Wealth',
      classicalRef: 'बृहत्पाराशर होराशास्त्र (पराशर) अ. 21',
      divisionalRef: 'D1 व D2 (होरा चक्र)',
      vakriNote: getVakriExplanation(planets.find((p) => p.id === h11.lord)),
      astroBasisHi: `एकादशेश ${h11.lordHi} भाव ${h11.placedHouse} में (${h11.dignityHi}); [सर्वाष्टकवर्ग (सहायक): एकादश भाव ${sav[10]} बिंदु]।`,
      astroBasisEn: `11th Lord in H${h11.placedHouse} (${h11.dignity}); [SAV (Auxiliary): 11th house ${sav[10]} bindus].`,
      verdictHi: `अखंड लक्ष्मी योग; एक से अधिक स्रोतों से निरंतर धन आवक व जीवन में कभी भी धन का अभाव न होना।`,
      verdictEn: `Akhanda Lakshmi Yoga: perpetual inflow through diversified streams ensuring financial abundance.`,
      detailedAnalysisHi: `महर्षि पराशर अनुसार एकादश भाव में सर्वाधिक बिंदु और बली एकादशेश जातक को धनवानों की अग्रिम पंक्ति में खड़ा करते हैं।`,
      detailedAnalysisEn: `BPHS confirms that when the 11th house is fortified, revenue channels multiply effortlessly.`,
      remedyHi: `शुक्रवार को कनकधारा स्तोत्र का पाठ करें और तिजोरी में कुबेर का वास मानें।`,
      remedyEn: `Recite Kanakadhara Stotram on Fridays to amplify multi-channel revenue inflows.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 93. बड़े भाई-बहन का सुख व सहयोग
  {
    const score = Math.max(35, Math.min(92, 50 + getDignityBonus(h11.dignity) + getDignityBonus(jupiter.dignity)));
    addDim({
      id: 93,
      houseNumber: 11,
      houseTitleHi: 'एकादश भाव (लाभ व आय भाव)',
      houseTitleEn: '11th House (Labha & Gains)',
      category: 'family',
      categoryTitleHi: 'माता-पिता व कुल',
      categoryTitleEn: 'Family & Lineage',
      titleHi: 'बड़े भाई-बहनों का सुख, आत्मीय सहयोग व संबंध',
      titleEn: 'Elder Siblings\' Bonding, Mutual Support & Prosperity',
      classicalRef: 'फलदीपिका (मंत्रेश्वर) अ. 12',
      divisionalRef: 'D1 व D3 (द्रेष्काण चक्र)',
      vakriNote: '',
      astroBasisHi: `एकादशेश भाव ${h11.placedHouse} में; गुरु (ज्येष्ठ भ्रातृकारक) का प्रभाव; भाई-बहनों का सहयोग।`,
      astroBasisEn: `11th Lord in H${h11.placedHouse}; Jupiter (Elder sibling karaka) grace.`,
      verdictHi: `बड़े भाई-बहनों से पिता समान स्नेह व सहयोग; जीवन के कठिन समय में उनका संबल अत्यंत सहायक।`,
      verdictEn: `Protective affection from elder siblings; dependable fraternal counsel during critical life phases.`,
      detailedAnalysisHi: `मंत्रेश्वर के अनुसार एकादश भाव ज्येष्ठ भ्राता का है। यहाँ शुभ ग्रह होने से बड़े भाई-बहन जातक की प्रगति में ढाल बनकर खड़े रहते हैं।`,
      detailedAnalysisEn: `Phaladeepika demonstrates that a benign 11th house fosters protective loyalty from elder siblings.`,
      remedyHi: `बड़े भाई-बहनों के चरण छूकर आशीर्वाद लें और उनका सदैव आदर करें।`,
      remedyEn: `Seek blessings from elder siblings on personal birthdays and milestones.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 94. विशिष्ट सामाजिक नेटवर्क, वीआईपी मित्र व क्लब
  {
    const score = Math.max(40, Math.min(96, 52 + getDignityBonus(jupiter.dignity) + getDignityBonus(venus.dignity)));
    addDim({
      id: 94,
      houseNumber: 11,
      houseTitleHi: 'एकादश भाव (लाभ व आय भाव)',
      houseTitleEn: '11th House (Labha & Gains)',
      category: 'family',
      categoryTitleHi: 'माता-पिता व कुल',
      categoryTitleEn: 'Family & Lineage',
      titleHi: 'विशिष्ट सामाजिक नेटवर्क, उच्च पदस्थ वीआईपी मित्र व क्लब संबंध',
      titleEn: 'Elite Social Network, High-Net-Worth Influential Friends & Clubs',
      classicalRef: 'सारावली (कल्याण वर्मा) अ. 33',
      divisionalRef: 'D1 लग्न चक्र',
      vakriNote: '',
      astroBasisHi: `एकादश भाव (मित्र व नेटवर्क); गुरु व शुक्र की युति या दृष्टि; प्रभावशाली मित्र मंडली।`,
      astroBasisEn: `11th house (social circles); Jupiter and Venus network indicators.`,
      verdictHi: `उच्च अधिकारियों, उद्योगपतियों व समाज के प्रतिष्ठित व्यक्तियों के साथ प्रगाढ़ मैत्री व संपर्क।`,
      verdictEn: `Prestigious social network spanning high-net-worth executives, dignitaries, and influential leaders.`,
      detailedAnalysisHi: `सारावली के अनुसार जब एकादश भाव शुभ ग्रहों से युक्त हो, तो जातक के मित्र उच्च कुलीन और संकट में काम आने वाले होते हैं।`,
      detailedAnalysisEn: `Saravali confirms that benefic 11th house configurations surround the native with powerful, faithful friends.`,
      remedyHi: `मित्रों के साथ निष्कपट संबंध रखें और बुधवार को गायों को हरा चारा खिलाएं।`,
      remedyEn: `Maintain honest loyalty in all friendships to attract high-integrity allies.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 95. महत्वाकांक्षाएं, जीवन लक्ष्यों की पूर्ति व सफलता
  {
    const score = Math.max(45, Math.min(98, 55 + (sav[10] >= 28 ? 14 : -8) + getDignityBonus(h11.dignity)));
    addDim({
      id: 95,
      houseNumber: 11,
      houseTitleHi: 'एकादश भाव (लाभ व आय भाव)',
      houseTitleEn: '11th House (Labha & Gains)',
      category: 'wealth_fortune',
      categoryTitleHi: 'धन व समृद्धि',
      categoryTitleEn: 'Wealth & Prosperity',
      titleHi: 'महत्वाकांक्षाओं की पूर्ति, संकल्प सिद्धि व मनोकामना सिद्धि योग',
      titleEn: 'Fulfillment of Ambitions, Dream Realization & Triumph of Goals',
      classicalRef: 'सर्वार्थ चिंतामणि (वेंकटेश शर्मा) अ. 11',
      divisionalRef: 'D1 व D9 नवांश',
      vakriNote: '',
      astroBasisHi: `एकादश भाव (इच्छा पूर्ति); गुरु की दृष्टि; [सर्वाष्टकवर्ग (सहायक): एकादश भाव ${sav[10]} बिंदु]।`,
      astroBasisEn: `11th house (wishes); Jupiterian fulfillment aspect; [SAV: ${sav[10]} bindus].`,
      verdictHi: `मनोकामना सिद्धि योग; जीवन में जो भी बड़ा संकल्प लिया जाएगा, वह ईश्वरीय कृपा से पूर्ण होगा।`,
      verdictEn: `Kamana Siddhi Yoga: deep life aspirations and major visionary goals manifest successfully.`,
      detailedAnalysisHi: `सर्वार्थ चिंतामणि के अनुसार एकादश भाव समस्त इच्छाओं की पूर्ति का केंद्र है। यहाँ उच्च बिंदु संकल्पों को साकार करते हैं।`,
      detailedAnalysisEn: `Sarvartha Chintamani identifies the 11th house as the ultimate granter of cherished life ambitions.`,
      remedyHi: `प्रतिदिन अपने संकल्प को एक कागज पर लिखकर ईष्ट देव के चरणों में समर्पित करें।`,
      remedyEn: `Surrender cherished goals to your Ishta Devata in prayer and execute with focused clarity.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 96. व्यापारिक लाभांश, रॉयल्टी व पैसिव इनकम
  {
    const score = Math.max(40, Math.min(95, 52 + getDignityBonus(mercury.dignity) + getDignityBonus(venus.dignity)));
    addDim({
      id: 96,
      houseNumber: 11,
      houseTitleHi: 'एकादश भाव (लाभ व आय भाव)',
      houseTitleEn: '11th House (Labha & Gains)',
      category: 'wealth_fortune',
      categoryTitleHi: 'धन व समृद्धि',
      categoryTitleEn: 'Wealth & Prosperity',
      titleHi: 'व्यापारिक लाभांश, रॉयल्टी, किराया, डिविडेंड व पैसिव इनकम',
      titleEn: 'Dividends, Intellectual Property Royalties & Passive Wealth Inflows',
      classicalRef: 'जातक पारिजात (वैद्यनाथ) अ. 17',
      divisionalRef: 'D1 व D2 (होरा चक्र)',
      vakriNote: '',
      astroBasisHi: `एकादशेश भाव ${h11.placedHouse} में; बुध व शुक्र का योग; परिसंपत्तियों से सतत पैसिव इनकम।`,
      astroBasisEn: `11th Lord in H${h11.placedHouse}; Mercury-Venus asset monetization and royalty streams.`,
      verdictHi: `किराए, लाभांश (Dividends), रॉयल्टी अथवा निवेश से प्रचुर पैसिव इनकम का निरंतर प्रवाह।`,
      verdictEn: `Substantial passive returns through commercial real estate rentals, equity dividends, and IP royalties.`,
      detailedAnalysisHi: `जातक पारिजात के अनुसार एकादश भाव का बली होना जातक के सोए रहने पर भी धन की वर्षा कराता है।`,
      detailedAnalysisEn: `Jataka Parijata demonstrates that 11th house wealth compounds passively through structured assets.`,
      remedyHi: `महालक्ष्मी मंदिर में कमल गट्टे की माला से ॐ महालक्ष्म्यै नमः का जप करें।`,
      remedyEn: `Chant Mahalakshmi mantra upon a lotus-seed rosary (Kamal Gatta) on Fridays.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // =========================================================================
  // KHOND 12: द्वादश भाव (VYAYA/MOKSHA BHAVA) — व्यय, मोक्ष, विदेश वास व दान (97 से 101)
  // =========================================================================

  // 97. स्थायी विदेश निवास, पीआर व विदेशी नागरिकता
  {
    const score = Math.max(35, Math.min(95, 50 + (h12.placedHouse === 12 || h12.placedHouse === 9 || h12.placedHouse === 4 ? 14 : 0) + (rahu ? 10 : 0)));
    addDim({
      id: 97,
      houseNumber: 12,
      houseTitleHi: 'द्वादश भाव (व्यय व मोक्ष भाव)',
      houseTitleEn: '12th House (Vyaya & Moksha)',
      category: 'career',
      categoryTitleHi: 'करियर व पद',
      categoryTitleEn: 'Career & Authority',
      titleHi: 'स्थायी विदेश निवास, पीआर (PR), ग्रीन कार्ड व विदेशी नागरिकता',
      titleEn: 'Permanent Foreign Settlement, PR, Green Card & Overseas Citizenship',
      classicalRef: 'टाइमिंग ऑफ इवेंट्स थ्रू विंशोत्तरी (के.एन. राव)',
      divisionalRef: 'D1, D4 व D9 नवांश',
      vakriNote: '',
      astroBasisHi: `द्वादश भाव (विदेश वास); राहु (विदेशी भूमि) व चंद्रमा का प्रभाव; स्थायी पीआर योग।`,
      astroBasisEn: `12th house (overseas settlement); Rahu and Moon foreign residency signatures.`,
      verdictHi: `विदेश में स्थायी निवास (PR) अथवा विदेशी नागरिकता प्राप्त करने का अत्यंत प्रबल शास्त्रोक्त योग।`,
      verdictEn: `High astrological probability of acquiring permanent residency (PR) or foreign citizenship.`,
      detailedAnalysisHi: `के.एन. राव के शोध अनुसार जब चतुर्थ भाव का संबंध द्वादश भाव या राहु से हो, तो जातक की स्थायी कर्मभूमि समुद्र पार ही होती है।`,
      detailedAnalysisEn: `K.N. Rao's global research proves that 4th-12th interactions trigger permanent overseas citizenship.`,
      remedyHi: `विदेशी कार्यों में सफलता हेतु घर के वायव्य कोण (उत्तर-पश्चिम) को स्वच्छ व हल्का रखें।`,
      remedyEn: `Keep the North-West sector of living quarters luminous and uncluttered for smooth immigration.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 98. धन का व्यय: शुभ कार्यों पर व्यय बनाम अपव्यय
  {
    const score = Math.max(35, Math.min(92, 50 + (sav[11] <= 28 ? 10 : -8) + getDignityBonus(jupiter.dignity)));
    addDim({
      id: 98,
      houseNumber: 12,
      houseTitleHi: 'द्वादश भाव (व्यय व मोक्ष भाव)',
      houseTitleEn: '12th House (Vyaya & Moksha)',
      category: 'wealth_fortune',
      categoryTitleHi: 'धन व समृद्धि',
      categoryTitleEn: 'Wealth & Prosperity',
      titleHi: 'धन व्यय की दिशा: शुभ धर्मार्थ व्यय बनाम अपव्यय व हानि से सुरक्षा',
      titleEn: 'Expenditure Patterns: Virtuous Spending vs Financial Waste Mitigation',
      classicalRef: 'फलदीपिका (मंत्रेश्वर) अ. 13',
      divisionalRef: 'D1 लग्न चक्र',
      vakriNote: '',
      astroBasisHi: `द्वादशेश भाव ${h12.placedHouse} में; गुरु की दृष्टि; शुभ कार्यों पर धन व्यय योग।`,
      astroBasisEn: `12th Lord in H${h12.placedHouse}; Jupiter's noble expenditure gating; [SAV: ${sav[11]}].`,
      verdictHi: `शुभ व सत्कार्यों पर धन व्यय; अपव्यय, चोरी अथवा आकस्मिक नुकसान से पूर्ण शास्त्रीय सुरक्षा।`,
      verdictEn: `Virtuous expenditure directed toward noble causes, asset investments, and family welfare.`,
      detailedAnalysisHi: `मंत्रेश्वर के अनुसार जब द्वादश भाव पर गुरु का प्रभाव हो, तो जातक का धन कभी व्यर्थ नहीं जाता, बल्कि यश बढ़ाने वाले कार्यों में खर्च होता है।`,
      detailedAnalysisEn: `Phaladeepika confirms that Jupiterian influence over the 12th house transmutes expenditures into meritorious dharma.`,
      remedyHi: `अपनी आय का एक निश्चित हिस्सा (जैसे 2-5%) नित्य अनाथालयों अथवा चिकित्सा शिविरों में दान करें।`,
      remedyEn: `Tithe a small regular percentage of income to hospitals or orphan relief to neutralize malefic losses.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 99. निद्रा सुख, शैया सुख, स्वप्न व अनिद्रा
  {
    const score = Math.max(35, Math.min(92, 50 + getDignityBonus(venus.dignity) + getDignityBonus(moon.dignity)));
    addDim({
      id: 99,
      houseNumber: 12,
      houseTitleHi: 'द्वादश भाव (व्यय व मोक्ष भाव)',
      houseTitleEn: '12th House (Vyaya & Moksha)',
      category: 'longevity_health',
      categoryTitleHi: 'स्वास्थ्य व आयु',
      categoryTitleEn: 'Health & Longevity',
      titleHi: 'निद्रा सुख, शैया सुख, शांत स्वप्न व अनिद्रा से मुक्ति',
      titleEn: 'Quality of Sleep, Bed Comforts, Lucid Dreams & Insomnia Freedom',
      classicalRef: 'बृहत्पाराशर होराशास्त्र (पराशर) अ. 22',
      divisionalRef: 'D1 लग्न चक्र',
      vakriNote: '',
      astroBasisHi: `द्वादश भाव (शैया सुख); शुक्र व चंद्रमा की स्थिति; मानसिक शांति से गहरी निद्रा।`,
      astroBasisEn: `12th house (bed pleasures & sleep cycles); Venusian restorative comfort.`,
      verdictHi: `गहरी, सुखद व ताजगी देने वाली निद्रा; शयनकक्ष में सकारात्मक ऊर्जा से मानसिक तनाव से मुक्ति।`,
      verdictEn: `Deep restorative sleep cycles and tranquil dreams granting complete morning rejuvenation.`,
      detailedAnalysisHi: `महर्षि पराशर के अनुसार द्वादश भाव शैया सुख का है। शुक्र का शुभ प्रभाव जातक को अनिद्रा से मुक्त रखकर गहरी शांति देता है।`,
      detailedAnalysisEn: `BPHS confirms that Venusian beneficence on the 12th house insulates against night terrors and insomnia.`,
      remedyHi: `सोते समय सिरहाने दक्षिण अथवा पूर्व दिशा में रखें और शयनकक्ष में इलेक्ट्रॉनिक गैजेट्स दूर रखें।`,
      remedyEn: `Sleep with head facing South or East; avoid screens 30 minutes prior to retiring.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 100. अस्पताल वास, कारागार (जेल), एकांतवास व बंधन
  {
    const score = Math.max(40, Math.min(96, 55 + (saturn.houseNumber !== 12 && rahu?.houseNumber !== 12 ? 14 : -10) + getDignityBonus(jupiter.dignity)));
    addDim({
      id: 100,
      houseNumber: 12,
      houseTitleHi: 'द्वादश भाव (व्यय व मोक्ष भाव)',
      houseTitleEn: '12th House (Vyaya & Moksha)',
      category: 'shadow_challenges',
      categoryTitleHi: 'चुनौतियां व सतर्कता',
      categoryTitleEn: 'Shadow Challenges',
      titleHi: 'बंधन योग मुक्ति, अस्पताल वास व कारावास (जेल) से सुरक्षा कवच',
      titleEn: 'Immunity from Incarceration, Hospitalization & Confinement',
      classicalRef: 'जातक पारिजात (वैद्यनाथ) अ. 18 (बंधन योगाध्याय)',
      divisionalRef: 'D1 व D30 (त्रिंशांश)',
      vakriNote: '',
      astroBasisHi: `द्वादश भाव पर शुभ दृष्टि; शनि-राहु का बंधन योग निष्प्रभावी; कानूनी व शारीरिक स्वतंत्रता।`,
      astroBasisEn: `12th house protected from severe malefic containment; absolute physical liberty.`,
      verdictHi: `बंधन योग अथवा कारावास का सर्वथा अभाव; लंबे अस्पताल वास से ईश्वरीय कृपा द्वारा पूर्ण सुरक्षा।`,
      verdictEn: `Total immunity against punitive imprisonment, prolonged quarantine, or solitary confinement.`,
      detailedAnalysisHi: `जातक पारिजात के बंधन योगाध्याय अनुसार जब लग्नेश और नवमेश बली हों, तो जातक की स्वतंत्रता पर कभी कोई आंच नहीं आती।`,
      detailedAnalysisEn: `Jataka Parijata proves that fortified 1st and 9th lords dissolve all forms of punitive confinement.`,
      remedyHi: `पिंजरे में बंद किसी पक्षी को मुक्त कराएं अथवा किसी अस्पताल में जाकर फल वितरण करें।`,
      remedyEn: `Release caged birds into open sky or distribute fruits to convalescing patients in hospitals.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 101. अंतिम गति, मोक्ष मार्ग व आध्यात्मिक कैवल्य
  {
    const score = Math.max(45, Math.min(98, 55 + (ketu?.houseNumber === 12 ? 18 : 10) + getDignityBonus(jupiter.dignity)));
    addDim({
      id: 101,
      houseNumber: 12,
      houseTitleHi: 'द्वादश भाव (व्यय व मोक्ष भाव)',
      houseTitleEn: '12th House (Vyaya & Moksha)',
      category: 'spirituality',
      categoryTitleHi: 'आध्यात्म व मोक्ष',
      categoryTitleEn: 'Spirituality & Grace',
      titleHi: 'अंतिम गति, मोक्ष मार्ग, आध्यात्मिक कैवल्य व जन्म-मरण मुक्ति',
      titleEn: 'Moksha, Ultimate Spiritual Liberation & Soul Transcendence',
      classicalRef: 'बृहत्पाराशर होराशास्त्र (पराशर) अ. 22 व कठोपनिषद',
      divisionalRef: 'D1, D9 व D60 (षष्ठ्यांश चक्र)',
      vakriNote: getVakriExplanation(ketu),
      astroBasisHi: `द्वादश भाव (मोक्ष स्थान); केतु (मोक्ष कारक) व गुरु का प्रभाव; जीवन के उत्तरार्ध में परम शांति।`,
      astroBasisEn: `12th house (Moksha Sthana); Ketu (Mokshakaraka) & Jupiterian transcendence indicators.`,
      verdictHi: `सद्गति व मोक्ष का मार्ग प्रशस्त; जीवन के उत्तरार्ध में सांसारिक मोह से विरक्ति व आत्म-साक्षात्कार।`,
      verdictEn: `High potential for ultimate spiritual liberation (Moksha); detachment crowning maturity with sublime peace.`,
      detailedAnalysisHi: `महर्षि पराशर अनुसार द्वादश भाव मोक्ष का अंतिम द्वार है। यहाँ केतु या गुरु की उपस्थिति आत्मा को जन्म-मरण के चक्र से मुक्त कर परमात्मा में विलीन करती है।`,
      detailedAnalysisEn: `BPHS and the Upanishads declare that Ketu's touch on the 12th house dissolves worldly bondages into divine absorption.`,
      remedyHi: `एकांत में ॐ का दीर्घ उच्चारण (प्रणव नाद) करें और जीवन के अंतिम काल तक निष्काम कर्म का अभ्यास करें।`,
      remedyEn: `Practice deep pranava chanting ("AUM") daily to attune the soul to timeless cosmic silence.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }
}
