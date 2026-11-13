import { SIGNS } from '../constants';
import type { BodyPosition, ChartData, NineGrahaId, PlanetId, SevenPlanetId } from '../types';

export interface BhavarthaRuleEvaluation {
  ruleCode: string;
  lagnaNameEn: string;
  lagnaNameHi: string;
  targetPlanets: SevenPlanetId[];
  isTriggered: boolean;
  classicalSutraEn: string;
  classicalSutraHi: string;
  predictiveApplicationEn: string;
  predictiveApplicationHi: string;
}

export interface BhavarthaRatnakaraReport {
  lagnaSignIndex: number;
  lagnaNameEn: string;
  lagnaNameHi: string;
  primaryYogakaraka: SevenPlanetId | 'None';
  primaryDhanaKaraka: SevenPlanetId;
  functionalMalefics: SevenPlanetId[];
  rulesEvaluated: BhavarthaRuleEvaluation[];
  triggeredCount: number;
}

function houseBetween(fromSign: number, toSign: number): number {
  return ((toSign - fromSign + 12) % 12) + 1;
}

export function computeBhavarthaRatnakaraReport(chart: ChartData): BhavarthaRatnakaraReport {
  const ascSign = chart.ascendant.signIndex;
  const pMap = new Map<SevenPlanetId, BodyPosition>();
  for (const p of chart.planets) {
    if (['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'].includes(p.id)) {
      pMap.set(p.id as SevenPlanetId, p);
    }
  }

  const getH = (p: SevenPlanetId) => {
    const bp = pMap.get(p);
    return bp ? houseBetween(ascSign, bp.signIndex) : 1;
  };

  const getTogether = (p1: SevenPlanetId, p2: SevenPlanetId) => {
    const b1 = pMap.get(p1);
    const b2 = pMap.get(p2);
    return b1 && b2 ? b1.signIndex === b2.signIndex : false;
  };

  const sunH = getH('Sun');
  const moonH = getH('Moon');
  const marsH = getH('Mars');
  const mercH = getH('Mercury');
  const jupH = getH('Jupiter');
  const venH = getH('Venus');
  const satH = getH('Saturn');

  const rules: BhavarthaRuleEvaluation[] = [];

  const addRule = (
    code: string,
    lagnaEn: string,
    lagnaHi: string,
    planets: SevenPlanetId[],
    condition: boolean,
    sutraEn: string,
    sutraHi: string,
    appEn: string,
    appHi: string
  ) => {
    rules.push({
      ruleCode: code,
      lagnaNameEn: lagnaEn,
      lagnaNameHi: lagnaHi,
      targetPlanets: planets,
      isTriggered: condition,
      classicalSutraEn: sutraEn,
      classicalSutraHi: sutraHi,
      predictiveApplicationEn: appEn,
      predictiveApplicationHi: appHi,
    });
  };

  let primaryYogakaraka: SevenPlanetId | 'None' = 'None';
  let primaryDhanaKaraka: SevenPlanetId = 'Jupiter';
  let functionalMalefics: SevenPlanetId[] = [];

  switch (ascSign) {
    case 0: // Aries / Mesha
      primaryYogakaraka = 'Jupiter';
      primaryDhanaKaraka = 'Sun';
      functionalMalefics = ['Mercury', 'Saturn', 'Venus'];
      addRule('BR-AR-1', 'Aries', 'मेष', ['Sun', 'Moon'], getTogether('Sun', 'Moon'),
        'Sun and Moon conjunction produces abundant wealth, state recognition and lasting fame for Aries native.',
        'मेष लग्न में सूर्य और चंद्र की युति जातक को प्रचुर धन, राजकीय सम्मान और अक्षय कीर्ति दिलाती है।',
        'Sun as 5th lord joining Moon as 4th lord unites Kendra and Trikona in high Raja Yoga.',
        'पंचमेश सूर्य और चतुर्थेश चंद्र का योग केंद्र-त्रिकोण राजयोग का सृजन करता है।'
      );
      addRule('BR-AR-2', 'Aries', 'मेष', ['Saturn'], satH === 12,
        'Saturn in 12th house (Pisces) gives auspicious wealth and foreign gains despite being in dusthana.',
        'मेष लग्न में शनि द्वादश भाव (मीन राशि) में स्थित होकर भी जातक को शुभ फल, धन व विदेश से लाभ प्रदान करता है।',
        'Saturn ruling 10th and 11th in 12th Pisces acts as a neutral ascetic giving steady material foundation.',
        'दशम व एकादश के स्वामी शनि का व्यय भाव में होना व्यावहारिक व विदेश संवर्धन हेतु फलदायी सिद्ध होता है।'
      );
      addRule('BR-AR-3', 'Aries', 'मेष', ['Mars', 'Jupiter'], getTogether('Mars', 'Jupiter') || [1, 5, 9].includes(jupH),
        'Mars and Jupiter association activates Dharma-Karmadhipati Raja Yoga and ancestral blessings.',
        'मंगल व गुरु का संबंध अथवा गुरु का त्रिकोण में होना धर्म-कर्माधिपति राजयोग व पूर्वपुण्य को जाग्रत करता है।',
        'Lagna lord Mars aligning with 9th lord Jupiter gives noble purpose, leadership and high moral standing.',
        'लग्नेश मंगल का भाग्येश गुरु से योग जातक को उच्च पद, सत्यनिष्ठा और दीर्घकालीन सफलता देता है।'
      );
      break;

    case 1: // Taurus / Vrishabha
      primaryYogakaraka = 'Saturn';
      primaryDhanaKaraka = 'Mercury';
      functionalMalefics = ['Jupiter', 'Moon'];
      addRule('BR-TA-1', 'Taurus', 'वृषभ', ['Saturn'], [1, 4, 5, 7, 9, 10, 11].includes(satH),
        'Saturn is the solitary supreme Yogakaraka ruling both 9th (Bhagya) and 10th (Karma).',
        'वृषभ लग्न हेतु शनिदेव नवम (भाग्य) व दशम (कर्म) दोनों के स्वामी होने से परम योगकारक हैं।',
        'Saturn well-placed in Kendra or Trikona guarantees unshakeable career elevation and worldly authority.',
        'शनि की केंद्र अथवा त्रिकोण में स्थिति अटूट पदोन्नति, सामाजिक प्रतिष्ठा व ऐश्वर्य सुनिश्चित करती है।'
      );
      addRule('BR-TA-2', 'Taurus', 'वृषभ', ['Mercury', 'Venus'], getTogether('Mercury', 'Venus'),
        'Mercury (2nd & 5th lord) conjoining Venus (Lagna & 6th lord) yields phenomenal wealth (Maha Dhana Yoga).',
        'द्वितीयेश व पंचमेश बुध का लग्नेश शुक्र के साथ योग महा-धनयोग की सृष्टि करता है।',
        'Sharp commerce, aesthetic charm and sustained prosperity accompany this combination.',
        'यह योग जातक को तीव्र व्यावसायिक सूझबूझ, कलात्मक दृष्टिकोण और अपार वित्तीय संपन्नता देता है।'
      );
      break;

    case 2: // Gemini / Mithuna
      primaryYogakaraka = 'Venus';
      primaryDhanaKaraka = 'Moon';
      functionalMalefics = ['Mars', 'Jupiter', 'Sun'];
      addRule('BR-GE-1', 'Gemini', 'मिथुन', ['Venus'], [1, 5, 9].includes(venH),
        'Venus as 5th lord (Purva Punya) in Kendra or Trikona acts as supreme benefactor.',
        'मिथुन लग्न में पंचमेश शुक्र केंद्र या त्रिकोण में बैठकर सर्वोच्च शुभ फल प्रदान करता है।',
        'Blesses native with creative brilliance, elite education, refined progeny and gracious speech.',
        'जातक को कुशाग्र बुद्धि, उत्तम शिक्षा, सुसंस्कृत संतान और सौंदर्य-प्रियता का वरदान मिलता है।'
      );
      addRule('BR-GE-2', 'Gemini', 'मिथुन', ['Mercury', 'Venus'], getTogether('Mercury', 'Venus'),
        'Mercury and Venus conjunction unites 1st and 5th lords in vibrant Raja Yoga.',
        'लग्नेश बुध और पंचमेश शुक्र की युति तेजस्वी राजयोग बनाती है।',
        'Conveys exceptional intellect, diplomacy, software/analytical acumen and artistic honors.',
        'यह योग असाधारण बौद्धिक क्षमता, कूटनीति, संचार कौशल व सामाजिक प्रतिष्ठा प्रदान करता है।'
      );
      break;

    case 3: // Cancer / Karka
      primaryYogakaraka = 'Mars';
      primaryDhanaKaraka = 'Sun';
      functionalMalefics = ['Venus', 'Mercury', 'Saturn'];
      addRule('BR-CA-1', 'Cancer', 'कर्क', ['Mars'], [1, 4, 5, 7, 9, 10].includes(marsH),
        'Mars as 5th and 10th lord is the supreme Yogakaraka for Cancer native.',
        'कर्क लग्न हेतु पंचमेश व दशमेश मंगलदेव परम योगकारक हैं।',
        'Mars placement in Kendra/Trikona drives executive prowess, land ownership and administrative courage.',
        'मंगल की शुभ स्थिति जातक को प्रशासनिक साहस, भूमि-वाहन सुख और नेतृत्व की क्षमता देती है।'
      );
      addRule('BR-CA-2', 'Cancer', 'कर्क', ['Jupiter', 'Moon'], getTogether('Jupiter', 'Moon') || jupH === 1,
        'Jupiter in Cancer Lagna (exalted) with Moon creates Hamsa-Gajakesari divine protection.',
        'कर्क लग्न में उच्च का गुरु चंद्र के साथ मिलकर हंस-गजकेसरी दैवीय सुरक्षा कवच बनाता है।',
        'Bestows noble reputation, philanthropic inclinations, high wisdom and divine assistance.',
        'जातक को निर्मल यश, परोपकारी स्वभाव, गंभीर ज्ञान और निरंतर ईश्वरीय कृपा प्राप्त होती है।'
      );
      break;

    case 4: // Leo / Simha
      primaryYogakaraka = 'Mars';
      primaryDhanaKaraka = 'Mercury';
      functionalMalefics = ['Saturn', 'Venus'];
      addRule('BR-LE-1', 'Leo', 'सिंह', ['Mars'], [1, 4, 9, 10].includes(marsH),
        'Mars as 4th and 9th lord acts as royal Yogakaraka conferring land, status and father\'s favor.',
        'सिंह लग्न में चतुर्थेश व नवमेश मंगल राजयोगकारक बनकर भूमि, प्रतिष्ठा व पितृ सुख प्रदान करता है।',
        'Brings unyielding executive determination, property expansion and courageous triumphs.',
        'यह स्थिति जातक को दृढ़ संकल्प, अचल संपत्ति और विरोधियों पर निर्विवाद विजय दिलाती है।'
      );
      addRule('BR-LE-2', 'Leo', 'सिंह', ['Sun', 'Mercury'], getTogether('Sun', 'Mercury'),
        'Sun (Lagna lord) conjoining Mercury (2nd & 11th wealth lord) creates supreme Dhana Yoga.',
        'लग्नेश सूर्य और धनेश-लाभेश बुध की युति परम धनयोग का सृजन करती है।',
        'Native achieves immense prosperity through administrative and intellectual pursuits.',
        'जातक प्रशासनिक, परामर्श अथवा बौद्धिक कार्यों से विपुल धन और सम्मान अर्जित करता है।'
      );
      break;

    case 5: // Virgo / Kanya
      primaryYogakaraka = 'Venus';
      primaryDhanaKaraka = 'Venus';
      functionalMalefics = ['Mars', 'Jupiter', 'Moon'];
      addRule('BR-VI-1', 'Virgo', 'कन्या', ['Venus'], [2, 9, 10, 11].includes(venH),
        'Venus ruling 2nd (Dhana) and 9th (Bhagya) is the primary wealth architect for Virgo.',
        'कन्या लग्न में द्वितीयेश व नवमेश होने से शुक्रदेव धन व भाग्य के मुख्य संचालक हैं।',
        'Guarantees steady influx of riches, refined living and foreign trade blessings.',
        'जातक को निरंतर धन प्रवाह, सुरुचिपूर्ण जीवनशैली और भाग्य का पूर्ण सहयोग मिलता है।'
      );
      addRule('BR-VI-2', 'Virgo', 'कन्या', ['Mercury'], mercH === 1,
        'Mercury exalted in Lagna creates Bhadra Mahapurusha Yoga of the highest caliber.',
        'कन्या लग्न में उच्च का बुध सर्वोच्च कोटि का भद्र महापुरुष योग निर्मित करता है।',
        'Endows native with mathematical genius, analytical supremacy and long respected life.',
        'यह योग जातक को गणितीय प्रतिभा, विश्लेषणात्मक दक्षता और दीर्घायु प्रदान करता है।'
      );
      break;

    case 6: // Libra / Tula
      primaryYogakaraka = 'Saturn';
      primaryDhanaKaraka = 'Mars';
      functionalMalefics = ['Jupiter', 'Sun'];
      addRule('BR-LI-1', 'Libra', 'तुला', ['Saturn'], [1, 4, 5, 9, 10, 11].includes(satH),
        'Saturn ruling 4th and 5th is the supreme Yogakaraka for Libra native.',
        'तुला लग्न में चतुर्थेश व पंचमेश होने से शनिदेव परम योगकारक हैं।',
        'Yields massive fixed assets, political influence, emotional balance and scholarly brilliance.',
        'जातक को विशाल अचल संपत्ति, राजनीतिक व प्रशासनिक प्रभाव और शांत बौद्धिक दृष्टि मिलती है।'
      );
      addRule('BR-LI-2', 'Libra', 'तुला', ['Mercury', 'Saturn'], getTogether('Mercury', 'Saturn') || [9, 10].includes(satH),
        'Mercury (9th lord) aligned with Saturn (Yogakaraka) creates extraordinary Lakshmi-Narayana Yoga.',
        'नवमेश बुध और योगकारक शनि की युति विलक्षण लक्ष्मी-नारायण योग की रचना करती है।',
        'Promotes monumental career leaps, ethical governance and international prestige.',
        'यह योग जीवन में विशाल व्यावसायिक छलांग, नीतिपूर्ण शासन और अंतरराष्ट्रीय ख्याति दिलाता है।'
      );
      break;

    case 7: // Scorpio / Vrishchika
      primaryYogakaraka = 'Jupiter';
      primaryDhanaKaraka = 'Jupiter';
      functionalMalefics = ['Mercury', 'Venus'];
      addRule('BR-SC-1', 'Scorpio', 'वृश्चिक', ['Jupiter'], [1, 2, 5, 9, 11].includes(jupH),
        'Jupiter ruling 2nd (Dhana) and 5th (Purva Punya) is the chief custodian of fortune.',
        'वृश्चिक लग्न में द्वितीयेश व पंचमेश होने से देवगुरु बृहस्पति धन और भाग्य के मुख्य रक्षक हैं।',
        'Assures expansive financial wisdom, progeny blessings and authoritative counseling skills.',
        'जातक को वित्तीय दूरदर्शिता, योग्य संतान और सम्मानित सलाहकार की प्रतिष्ठा मिलती है।'
      );
      addRule('BR-SC-2', 'Scorpio', 'वृश्चिक', ['Sun', 'Moon'], getTogether('Sun', 'Moon') || (sunH === 10 && moonH === 9),
        'Sun (10th lord) and Moon (9th lord) association forms supreme Dharma-Karmadhipati Yoga.',
        'दशमेश सूर्य और नवमेश चंद्र का योग परम धर्म-कर्माधिपति राजयोग बनाता है।',
        'Grants illustrious societal prestige, high governmental honor and ethical leadership.',
        'जातक को उच्च शासकीय सम्मान, नैतिक नेतृत्व और सर्वत्र आदरणीय पद की प्राप्ति होती है।'
      );
      break;

    case 8: // Sagittarius / Dhanu
      primaryYogakaraka = 'Sun';
      primaryDhanaKaraka = 'Saturn';
      functionalMalefics = ['Venus', 'Mercury'];
      addRule('BR-SG-1', 'Sagittarius', 'धनु', ['Sun', 'Mars'], getTogether('Sun', 'Mars') || (sunH === 9 && marsH === 5),
        'Sun (9th lord) and Mars (5th lord) combination unites Trikona lords in supreme Raja Yoga.',
        'नवमेश सूर्य और पंचमेश मंगल की युति सर्वोच्च त्रिकोण राजयोग बनाती है।',
        'Blesses native with unshakeable righteous authority, divine protection and executive mastery.',
        'जातक को ईश्वरीय सुरक्षा कवच, अकाट्य सत्यनिष्ठा और उच्च प्रशासनिक अधिकार प्राप्त होते हैं।'
      );
      addRule('BR-SG-2', 'Sagittarius', 'धनु', ['Jupiter'], [1, 4, 9, 10].includes(jupH),
        'Jupiter in own sign creates Hamsa Mahapurusha Yoga safeguarding ancestral values.',
        'गुरु की स्वराशि में स्थिति हंस महापुरुष योग बनाकर कुल-मर्यादा की रक्षा करती है।',
        'Conveys deep philosophical scholarship, professorial acclaim and universal goodwill.',
        'जातक को गंभीर दार्शनिक ज्ञान, प्राध्यापकीय सम्मान और समाज में निष्कलंक प्रतिष्ठा मिलती है।'
      );
      break;

    case 9: // Capricorn / Makara
      primaryYogakaraka = 'Venus';
      primaryDhanaKaraka = 'Saturn';
      functionalMalefics = ['Mars', 'Jupiter', 'Moon'];
      addRule('BR-CP-1', 'Capricorn', 'मकर', ['Venus'], [1, 5, 9, 10].includes(venH),
        'Venus ruling 5th and 10th is the solitary supreme Yogakaraka for Capricorn.',
        'मकर लग्न में पंचमेश व दशमेश होने से शुक्रदेव एकाकी परम योगकारक हैं।',
        'Endows native with artistic sophistication, luxury conveyances and corporate supremacy.',
        'जातक को सुरुचिपूर्ण कलात्मक दृष्टि, वाहन सुख और कॉर्पोरेट जगत में शीर्ष पद मिलता है।'
      );
      addRule('BR-CP-2', 'Capricorn', 'मकर', ['Mars'], marsH === 1,
        'Mars exalted in Capricorn Lagna creates Ruchaka Mahapurusha Yoga of immense vigor.',
        'मकर लग्न में उच्च का मंगल प्रचंड रुचक महापुरुष योग का निर्माण करता है।',
        'Imparts invincible physical stamina, engineering command and decisive military/executive power.',
        'जातक को अदम्य शारीरिक ऊर्जा, तकनीकी नेतृत्व और त्वरित निर्णय लेने की शक्ति मिलती है।'
      );
      break;

    case 10: // Aquarius / Kumbha
      primaryYogakaraka = 'Venus';
      primaryDhanaKaraka = 'Jupiter';
      functionalMalefics = ['Jupiter', 'Moon', 'Mars'];
      addRule('BR-AQ-1', 'Aquarius', 'कुंभ', ['Venus'], [1, 4, 9].includes(venH),
        'Venus ruling 4th and 9th acts as prime Yogakaraka establishing lifelong stability and grace.',
        'कुंभ लग्न में चतुर्थेश व नवमेश होने से शुक्रदेव आजीवन स्थायित्व व सौहार्द्र के मुख्य प्रदाता हैं।',
        'Blesses native with magnificent domestic peace, maternal fortune and divine protection.',
        'जातक को उत्तम गृह सुख, माता का आशीर्वाद और भाग्य की निरंतर अनुकूलता प्राप्त होती है।'
      );
      addRule('BR-AQ-2', 'Aquarius', 'कुंभ', ['Saturn'], [1, 10].includes(satH),
        'Saturn in Lagna or 10th creates Sasa Mahapurusha Yoga commanding grassroots loyalty.',
        'शनिदेव का लग्न या दशम में होना शश महापुरुष योग बनाता है जो जन-समर्थन दिलाता है।',
        'Bestows extraordinary stamina, mass leadership, endurance through crises and lasting influence.',
        'जातक को संकटों में अटूट धैर्य, जन-नेतृत्व की क्षमता और दीर्घकालिक प्रभावशीलता मिलती है।'
      );
      break;

    case 11: // Pisces / Meena
      primaryYogakaraka = 'Mars';
      primaryDhanaKaraka = 'Mars';
      functionalMalefics = ['Saturn', 'Venus', 'Mercury'];
      addRule('BR-PI-1', 'Pisces', 'मीन', ['Mars', 'Moon'], getTogether('Mars', 'Moon') || (marsH === 9 && moonH === 5),
        'Mars (9th lord) and Moon (5th lord) union creates pure Trikona Lakshmi-Narayana Yoga.',
        'नवमेश मंगल और पंचमेश चंद्र का योग शुद्ध त्रिकोण लक्ष्मी-नारायण योग की रचना करता है।',
        'Endows native with profound intuitive foresight, spiritual wealth and unhindered success.',
        'जातक को गहन अंतर्ज्ञान, आध्यात्मिक ऐश्वर्य और बिना विघ्न के उत्थान का आशीर्वाद मिलता है।'
      );
      addRule('BR-PI-2', 'Pisces', 'मीन', ['Jupiter'], [1, 4, 10].includes(jupH),
        'Jupiter in Pisces Lagna creates Hamsa Yoga elevating the native to institutional preceptor.',
        'मीन लग्न में गुरु का होना हंस योग बनाता है जो जातक को संस्थान प्रमुख या गुरु का दर्जा देता है।',
        'Imparts sacred wisdom, philanthropic vision, noble disciples and peaceful longevity.',
        'जातक को आध्यात्मिक ज्ञान, परोपकारी दृष्टि, योग्य शिष्य और शांतिपूर्ण दीर्घायु प्राप्त होती है।'
      );
      break;
  }

  const triggeredCount = rules.filter(r => r.isTriggered).length;
  const SIGN_NAMES_HI = ['मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या', 'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुंभ', 'मीन'];
  const sMeta = SIGNS[ascSign];

  return {
    lagnaSignIndex: ascSign,
    lagnaNameEn: sMeta.name,
    lagnaNameHi: SIGN_NAMES_HI[ascSign] || sMeta.name,
    primaryYogakaraka,
    primaryDhanaKaraka,
    functionalMalefics,
    rulesEvaluated: rules,
    triggeredCount,
  };
}
