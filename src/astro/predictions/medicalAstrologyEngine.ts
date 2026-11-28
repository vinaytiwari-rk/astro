import { NAKSHATRAS, SEVEN_PLANETS, SIGNS } from '../constants';
import type { ChartData, NineGrahaId, SevenPlanetId } from '../types';
import {
  buildClassicalSynthesisContext,
  evaluateWeightedAyusVitality,
  evaluateWeightedProgenyAxis,
} from './classicalSynthesisEngine';
import {
  evaluateExtendedMedicalConditions,
  type ExtendedMedicalConditionMatch,
} from './extendedMedicalDatabase';

export interface SpecificDiseaseAlert {
  category: 'Heart' | 'Diabetes' | 'Liver' | 'Eyes' | 'Mental' | 'JointsVata';
  diseaseNameEn: string;
  diseaseNameHi: string;
  isVulnerable: boolean;
  severity: 'None' | 'Mild' | 'Moderate' | 'Alert';
  planetaryCausesEn: string[];
  planetaryCausesHi: string[];
  preventiveGuidelinesEn: string;
  preventiveGuidelinesHi: string;
  ayurvedicUpayaEn: string;
  ayurvedicUpayaHi: string;
  classicalSource: string;
}

export interface ProgenyDiagnosticReport {
  overallPromise: 'Highly Auspicious' | 'Auspicious' | 'Delayed / Obstacles' | 'Challenging (Requires Upaya)';
  overallPromiseHi: string;
  fifthHouseLord: SevenPlanetId;
  fifthHousePlaced: number;
  fifthLordDignity: string;
  putrakarakaJupiterDignity: string;
  hasNagaSarpaDosha: boolean;
  nagaDoshaDetailsEn?: string;
  nagaDoshaDetailsHi?: string;
  hasPitruDoshaInProgeny: boolean;
  pitruDoshaDetailsEn?: string;
  pitruDoshaDetailsHi?: string;
  timingPredictionEn: string;
  timingPredictionHi: string;
  vedicRemediesEn: string[];
  vedicRemediesHi: string[];
  classicalSource: string;
}

export interface VulnerableOrganSystem {
  house: number;
  organEn: string;
  organHi: string;
  afflictionScore: number;
  severity: 'Safe' | 'Mild Sensitivity' | 'Moderate Vigilance' | 'High Care';
  factorsEn: string;
  factorsHi: string;
}

export interface ComprehensiveChikitsaReport {
  dominantDosha: 'Vata' | 'Pitta' | 'Kapha' | 'Vata-Pitta' | 'Pitta-Kapha' | 'Vata-Kapha' | 'Tridosha';
  dominantDoshaHi: string;
  doshaBreakdown: {
    vata: number;
    pitta: number;
    kapha: number;
  };
  constitutionalAdviceEn: string;
  constitutionalAdviceHi: string;
  vulnerableOrganSystems: VulnerableOrganSystem[];
  diseaseAlerts: SpecificDiseaseAlert[];
  extendedConditions?: ExtendedMedicalConditionMatch[];
  progenyDiagnostic: ProgenyDiagnosticReport;
  criticalHealthPhasesEn: string[];
  criticalHealthPhasesHi: string[];
  holisticChikitsaUpayaEn: string[];
  holisticChikitsaUpayaHi: string[];
  classicalSources: string[];
}

const KALAPURUSHA_ORGANS: Array<{ house: number; organEn: string; organHi: string }> = [
  { house: 1, organEn: 'Head, Brain, Cranium & Vital Energy (Lagna)', organHi: 'सिर, मस्तिष्क, कपाल एवं शारीरिक ओज (लग्न)' },
  { house: 2, organEn: 'Face, Teeth, Throat, Right Eye & Speech (H2)', organHi: 'मुख, दांत, कंठ, दायां नेत्र एवं वाणी (द्वितीय भाव)' },
  { house: 3, organEn: 'Neck, Collarbones, Arms, Right Ear & Bronchi (H3)', organHi: 'ग्रीवा, कंधे, भुजाएं, दायां कान एवं श्वासनली (तृतीय भाव)' },
  { house: 4, organEn: 'Heart, Lungs, Chest & Thorax (H4)', organHi: 'हृदय, फेफड़े, वक्षस्थल एवं पसलियां (चतुर्थ भाव)' },
  { house: 5, organEn: 'Stomach, Pancreas, Upper Abdomen & Intellect (H5)', organHi: 'आमाशय, अग्न्याशय, यकृत, ऊपरी उदर एवं बुद्धि (पंचम भाव)' },
  { house: 6, organEn: 'Kidneys, Intestines, Appendix & Acute Ailments (H6)', organHi: 'वृक्क (किडनी), छोटी आंत, अपेंडिक्स एवं तीव्र व्याधियां (षष्ठ भाव)' },
  { house: 7, organEn: 'Internal Generative Organs & Pelvic Cavity (H7)', organHi: 'गर्भाशय, मूत्र-मार्ग, श्रोणि गुहा एवं जनन तंत्र (सप्तम भाव)' },
  { house: 8, organEn: 'Excretory Organs, External Genitalia & Chronic Diseases (H8)', organHi: 'उत्सर्जन अंग, बाह्य जननांग, गुदा एवं दीर्घकालिक रोग (अष्टम भाव)' },
  { house: 9, organEn: 'Thighs, Hips, Arterial System & Marrow (H9)', organHi: 'जांघें, कूल्हे, धमनियां एवं मज्जा धातु (नवम भाव)' },
  { house: 10, organEn: 'Knees, Skeletal Joints & Structural Framework (H10)', organHi: 'घुटने, कंकाल संधि एवं अस्थि संरचना (दशम भाव)' },
  { house: 11, organEn: 'Calves, Ankles, Left Ear & Healing/Recovery (H11)', organHi: 'पिंडलियां, टखने, बायां कान एवं रोग-मुक्ति/स्वास्थ्य लाभ (एकादश भाव)' },
  { house: 12, organEn: 'Feet, Toes, Left Eye & Sleep/Restoration (H12)', organHi: 'पैर, तलवे, बायां नेत्र एवं निद्रा/अस्पताल भर्ती (द्वादश भाव)' },
];

export function computeComprehensiveChikitsaReport(chart: ChartData): ComprehensiveChikitsaReport {
  const ascSign = chart.ascendant.signIndex;

  // 1. Tridosha Computation (Vata, Pitta, Kapha) based on Charaka Samhita & Phaladeepika
  // Signs: Fire (0, 4, 8) -> Pitta; Earth (1, 5, 9) -> Vata/Kapha; Air (2, 6, 10) -> Vata; Water (3, 7, 11) -> Kapha
  // Planets: Sun/Mars/Ketu -> Pitta; Saturn/Rahu -> Vata; Jupiter/Venus/Moon -> Kapha; Mercury -> Tridosha / Vata
  let vataPoints = 15;
  let pittaPoints = 15;
  let kaphaPoints = 15;

  for (const p of chart.planets) {
    if (['Sun', 'Mars', 'Ketu'].includes(p.id)) pittaPoints += 12;
    else if (['Saturn', 'Rahu'].includes(p.id)) vataPoints += 12;
    else if (['Moon', 'Venus'].includes(p.id)) kaphaPoints += 12;
    else if (p.id === 'Jupiter') {
      kaphaPoints += 8;
      pittaPoints += 4;
    } else if (p.id === 'Mercury') {
      vataPoints += 7;
      pittaPoints += 4;
    }

    const sIdx = p.signIndex % 4;
    if (sIdx === 0) pittaPoints += 6; // Fire
    else if (sIdx === 1) { vataPoints += 3; kaphaPoints += 3; } // Earth
    else if (sIdx === 2) vataPoints += 6; // Air
    else if (sIdx === 3) kaphaPoints += 6; // Water
  }

  const totalDosha = vataPoints + pittaPoints + kaphaPoints;
  const vataPct = Math.round((vataPoints / totalDosha) * 100);
  const pittaPct = Math.round((pittaPoints / totalDosha) * 100);
  const kaphaPct = 100 - (vataPct + pittaPct);

  let dominantDosha: ComprehensiveChikitsaReport['dominantDosha'] = 'Pitta';
  let dominantDoshaHi = 'पित्त प्रकृति (Pitta Dominant)';
  let constitutionalAdviceEn = '';
  let constitutionalAdviceHi = '';

  const maxVal = Math.max(vataPct, pittaPct, kaphaPct);
  if (maxVal === vataPct) {
    dominantDosha = 'Vata';
    dominantDoshaHi = 'वात प्रधान प्रकृति (Vata Dominant)';
    constitutionalAdviceEn = 'Governed by Air and Ether elements. Vulnerable to nervous exhaustion, dry skin, insomnia, and joint stiffness. Fosters stability through warm, nourishing meals, consistent sleep routines, and daily sesame oil abhyanga massage.';
    constitutionalAdviceHi = 'वायु एवं आकाश तत्व प्रधान। तंत्रिका संवेदनशीलता, त्वचा की शुष्कता, अनिद्रा व जोड़ों के दर्द की संभावना। गर्म व स्निग्ध आहार, नियमित शयन समय तथा तिल तेल से मालिश से संतुलन प्राप्त होता है।';
  } else if (maxVal === pittaPct) {
    dominantDosha = 'Pitta';
    dominantDoshaHi = 'पित्त प्रधान प्रकृति (Pitta Dominant)';
    constitutionalAdviceEn = 'Governed by Fire and Water elements. Endows razor-sharp digestion and executive drive, but vulnerable to hyperacidity, hypertension, inflammation, and liver heat. Balanced by cooling herbs, hydration, sweet/bitter tastes, and avoiding peak afternoon sun.';
    constitutionalAdviceHi = 'अग्नि एवं जल तत्व प्रधान। तीव्र पाचन व सक्रियता, किंतु अम्ल-पित्त, उच्च रक्तचाप, यकृत गर्मी व त्वचा शोथ की संवेदनशीलता। शीतल पेय, पर्याप्त जल, मधुर-तिक्त रस तथा दोपहर की धूप से बचाव से स्वास्थ्य स्थिर रहता है।';
  } else {
    dominantDosha = 'Kapha';
    dominantDoshaHi = 'कफ प्रधान प्रकृति (Kapha Dominant)';
    constitutionalAdviceEn = 'Governed by Water and Earth elements. Provides deep endurance, calm temperament, and robust tissues, but prone to lethargy, fluid retention, respiratory congestion, and metabolic sluggishness. Balanced through invigorating exercise, light warm foods, and pungent spices like ginger/black pepper.';
    constitutionalAdviceHi = 'जल एवं पृथ्वी तत्व प्रधान। धैर्यवान स्वभाव व सुदृढ़ शारीरिक ढांचा, किंतु आलस्य, कफ संचय, मोटापा व मंदाग्नि की संवेदनशीलता। नियमित व्यायाम, हल्का गर्म भोजन तथा सोंठ-काली मिर्च जैसे उष्ण दीपनीय मसालों से संतुलन रखें।';
  }

  // 2. 12 Kalapurusha Organ Systems & Affliction Analysis
  const vulnerableOrganSystems: VulnerableOrganSystem[] = KALAPURUSHA_ORGANS.map((organ) => {
    const h = organ.house;
    const sIdx = (ascSign + h - 1) % 12;
    const lId = SIGNS[sIdx].lord;
    const lord = chart.planets.find((p) => p.id === lId);
    const occupants = chart.planets.filter((p) => p.rasiHouseNumber === h);

    let score = 100;
    const factorsEnArr: string[] = [];
    const factorsHiArr: string[] = [];

    // Occupants evaluation
    for (const p of occupants) {
      if (['Saturn', 'Rahu', 'Ketu'].includes(p.id)) {
        score -= 22;
        factorsEnArr.push(`${p.id} placed in House ${h}`);
        factorsHiArr.push(`${p.id} भाव ${h} में स्थित`);
      } else if (p.id === 'Mars') {
        score -= 16;
        factorsEnArr.push(`Mars placed in House ${h}`);
        factorsHiArr.push(`मंगल भाव ${h} में स्थित`);
      } else if (['Jupiter', 'Venus'].includes(p.id)) {
        score += 12;
      }
    }

    // Lord dignity
    if (lord) {
      if (lord.dignity === 'Debilitated') {
        score -= 25;
        factorsEnArr.push(`Lord ${lord.id} is Debilitated`);
        factorsHiArr.push(`भावेश ${lord.id} नीच राशि में`);
      } else if (lord.isCombust) {
        score -= 15;
        factorsEnArr.push(`Lord ${lord.id} is Combust`);
        factorsHiArr.push(`भावेश ${lord.id} अस्त`);
      } else if (['Exalted', 'Own Sign', 'Moolatrikona'].includes(lord.dignity)) {
        score += 15;
      }
      if ([6, 8, 12].includes(lord.rasiHouseNumber) && h !== 6 && h !== 8 && h !== 12) {
        score -= 14;
        factorsEnArr.push(`Lord ${lord.id} situated in Dusthana (H${lord.rasiHouseNumber})`);
        factorsHiArr.push(`भावेश ${lord.id} त्रिक भाव ${lord.rasiHouseNumber} में`);
      }
    }

    const safeScore = Math.max(25, Math.min(98, score));
    let severity: VulnerableOrganSystem['severity'] = 'Safe';
    if (safeScore < 45) severity = 'High Care';
    else if (safeScore < 60) severity = 'Moderate Vigilance';
    else if (safeScore < 75) severity = 'Mild Sensitivity';

    return {
      house: h,
      organEn: organ.organEn,
      organHi: organ.organHi,
      afflictionScore: safeScore,
      severity,
      factorsEn: factorsEnArr.length ? factorsEnArr.join('; ') : 'Fortified by natural dispositions',
      factorsHi: factorsHiArr.length ? factorsHiArr.join('; ') : 'शुभ व संतुलित स्थिति',
    };
  });

  // Sort organ vulnerabilities so most delicate is first
  vulnerableOrganSystems.sort((a, b) => a.afflictionScore - b.afflictionScore);

  // 3. Specific Disease Alerts (हृदय, मधुमेह, यकृत, नेत्र, मानसिक, संधिवात)
  const diseaseAlerts: SpecificDiseaseAlert[] = [];

  const sun = chart.planets.find((p) => p.id === 'Sun');
  const moon = chart.planets.find((p) => p.id === 'Moon');
  const mars = chart.planets.find((p) => p.id === 'Mars');
  const mercury = chart.planets.find((p) => p.id === 'Mercury');
  const jupiter = chart.planets.find((p) => p.id === 'Jupiter');
  const venus = chart.planets.find((p) => p.id === 'Venus');
  const saturn = chart.planets.find((p) => p.id === 'Saturn');
  const rahu = chart.planets.find((p) => p.id === 'Rahu');

  // Disease 1: Heart & Cardiac (H4, Sun, Leo)
  const h4Occupants = chart.planets.filter((p) => p.rasiHouseNumber === 4);
  const h4Malefics = h4Occupants.filter((p) => ['Saturn', 'Rahu', 'Mars'].includes(p.id));
  const sunAfflicted = sun && ([6, 8, 12].includes(sun.rasiHouseNumber) || sun.dignity === 'Debilitated');
  const isHeartVulnerable = h4Malefics.length > 0 || Boolean(sunAfflicted);

  diseaseAlerts.push({
    category: 'Heart',
    diseaseNameEn: 'Cardiovascular & Thoracic Circulation (हृदय व रक्त संचार)',
    diseaseNameHi: 'हृदय एवं रक्त संचार संवेदनशीलता',
    isVulnerable: isHeartVulnerable,
    severity: h4Malefics.length >= 2 || (h4Malefics.length > 0 && sunAfflicted) ? 'Alert' : isHeartVulnerable ? 'Moderate' : 'None',
    planetaryCausesEn: isHeartVulnerable
      ? [
          ...(h4Malefics.length ? [`Malefics in 4th House: ${h4Malefics.map((p) => p.id).join(', ')}`] : []),
          ...(sunAfflicted ? [`Sun (Atmakaraka for heart) placed in House ${sun?.rasiHouseNumber} (${sun?.dignity})`] : []),
        ]
      : ['4th house and Sun are well supported in classical dignity.'],
    planetaryCausesHi: isHeartVulnerable
      ? [
          ...(h4Malefics.length ? [`चतुर्थ भाव में क्रूर ग्रह: ${h4Malefics.map((p) => p.id).join(', ')}`] : []),
          ...(sunAfflicted ? [`सूर्य (हृदय कारक) भाव ${sun?.rasiHouseNumber} में स्थित`] : []),
        ]
      : ['चतुर्थ भाव व सूर्य देव शुभ स्थिति में हैं।'],
    preventiveGuidelinesEn:
      'Maintain cardiovascular conditioning, moderate sodium and saturated fats, practice daily deep breathing (Anulom-Vilom), and undergo routine lipid and ECG screenings past age 35.',
    preventiveGuidelinesHi:
      'हृदय व रक्तचाप के संतुलन हेतु सात्विक आहार लें, नमक पर नियंत्रण रखें, नित्य अनुलोम-विलोम प्राणायाम करें तथा ३५ वर्ष की आयु के बाद नियमित स्वास्थ्य परीक्षण कराएं।',
    ayurvedicUpayaEn:
      'Recite the Aditya Hridaya Stotram on Sundays, drink water stored in copper vessels, and take Arjuna bark decoction under vaidyic consultation.',
    ayurvedicUpayaHi:
      'रविवार को आदित्य हृदय स्तोत्र का पाठ करें, ताम्र पात्र में जल का सेवन करें तथा आयुर्वेदाचार्य के परामर्श से अर्जुन की छाल का काढ़ा लें।',
    classicalSource: 'Brihat Parashara Hora Shastra Ch. 13 · Phaladeepika Ch. 13',
  });

  // Disease 2: Diabetes & Pancreatic / Water Metabolism (H5, H6, Jupiter, Venus in water signs)
  const jupInWater = jupiter && [3, 7, 11].includes(jupiter.signIndex); // Cancer, Scorpio, Pisces
  const venInWater = venus && [3, 7, 11].includes(venus.signIndex);
  const jupOrVenDusthana = (jupiter && [6, 8, 12].includes(jupiter.rasiHouseNumber)) || (venus && [6, 8, 12].includes(venus.rasiHouseNumber));
  const isDiabetesVulnerable = Boolean(jupInWater && (venInWater || jupOrVenDusthana));

  diseaseAlerts.push({
    category: 'Diabetes',
    diseaseNameEn: 'Pancreatic Balance & Blood Sugar Dynamics (मधुमेह - प्रमेह)',
    diseaseNameHi: 'अग्न्याशय एवं शर्करा चयापचय (प्रमेह)',
    isVulnerable: isDiabetesVulnerable,
    severity: isDiabetesVulnerable ? 'Moderate' : 'None',
    planetaryCausesEn: isDiabetesVulnerable
      ? ['Jupiter (Meda Dhatu) / Venus in watery signs or Dusthanas, indicating potential metabolic sluggishness.']
      : ['Jupiter and Venus maintain balanced dignity without water sign affliction.'],
    planetaryCausesHi: isDiabetesVulnerable
      ? ['बृहस्पति (मेद धातु) अथवा शुक्र का जल राशि या त्रिक भाव में स्थित होना, जो चयापचय मंदता का सूचक है।']
      : ['गुरु व शुक्र शुभ व संतुलित स्थिति में हैं।'],
    preventiveGuidelinesEn:
      'Regulate refined sugars and processed carbohydrates, engage in daily brisk walking, and monitor fasting blood glucose and HbA1c annually.',
    preventiveGuidelinesHi:
      'मीठे व परिष्कृत भोजन से परहेज करें, प्रतिदिन तेज कदमों से टहलें तथा वर्ष में एक बार उपवास ग्लूकोज व एचबीए1सी की जांच अवश्य कराएं।',
    ayurvedicUpayaEn:
      'Consume Jamun seed powder or methi (fenugreek) soaked water at dawn, and offer yellow gram and bananas to cows or needy persons on Thursdays.',
    ayurvedicUpayaHi:
      'प्रातःकाल जामुन गुठली चूर्ण अथवा मेथी जल का सेवन करें तथा गुरुवार को गाय को चने की दाल व गुड़ अर्पित करें।',
    classicalSource: 'Charaka Samhita (Prameha Nidana) · Sushruta Samhita',
  });

  // Disease 3: Liver & Digestive Fire (H5, Mars, Rahu, Jupiter)
  const h5Occupants = chart.planets.filter((p) => p.rasiHouseNumber === 5);
  const h5HasMarsOrRahu = h5Occupants.some((p) => ['Mars', 'Rahu'].includes(p.id));
  const jupAfflicted = jupiter && (jupiter.dignity === 'Debilitated' || [6, 8].includes(jupiter.rasiHouseNumber));
  const isLiverVulnerable = h5HasMarsOrRahu || Boolean(jupAfflicted);

  diseaseAlerts.push({
    category: 'Liver',
    diseaseNameEn: 'Hepatic & Digestive Fire Regulation (यकृत व पाचक पित्त)',
    diseaseNameHi: 'यकृत, पित्ताशय एवं पाचक अग्नि (जठराग्नि)',
    isVulnerable: isLiverVulnerable,
    severity: isLiverVulnerable ? 'Moderate' : 'None',
    planetaryCausesEn: isLiverVulnerable
      ? ['Mars/Rahu influence on 5th house or Jupiter under stress affects bile synthesis and digestive rhythm.']
      : ['5th house and Jupiter are free from harsh malefic pressure.'],
    planetaryCausesHi: isLiverVulnerable
      ? ['पंचम भाव पर मंगल/राहु का प्रभाव अथवा गुरु का संघर्ष यकृत व पाचक पित्त को प्रभावित कर सकता है।']
      : ['पंचम भाव व गुरु देव पाप प्रभाव से मुक्त हैं।'],
    preventiveGuidelinesEn:
      'Avoid unhygienic street food, minimize excessive chili and deep-fried dishes, hydrate adequately, and abstain from irregular midnight snacking.',
    preventiveGuidelinesHi:
      'अत्यधिक तेल-मसालेदार व बासी भोजन से परहेज करें, पर्याप्त जल पिएं तथा रात्रि में देर से भारी भोजन करने से बचें।',
    ayurvedicUpayaEn:
      'Drink fresh amla juice or triphala infusion, and donate green mung dal to birds on Wednesdays.',
    ayurvedicUpayaHi:
      'आंवला रस अथवा त्रिफला का सेवन करें तथा बुधवार को पक्षियों को हरा मूंग अर्पित करें।',
    classicalSource: 'Sushruta Samhita · Brihat Parashara Hora Shastra',
  });

  // Disease 4: Ophthalmic & Vision Health (H2, H12, Sun, Moon)
  const h2Occupants = chart.planets.filter((p) => p.rasiHouseNumber === 2);
  const h12Occupants = chart.planets.filter((p) => p.rasiHouseNumber === 12);
  const h2HasMalefic = h2Occupants.some((p) => ['Saturn', 'Rahu', 'Mars'].includes(p.id));
  const h12HasMalefic = h12Occupants.some((p) => ['Saturn', 'Rahu', 'Mars'].includes(p.id));
  const isEyesVulnerable = h2HasMalefic || h12HasMalefic;

  diseaseAlerts.push({
    category: 'Eyes',
    diseaseNameEn: 'Ophthalmic & Vision Health (नेत्र ज्योति व दृष्टि)',
    diseaseNameHi: 'नेत्र ज्योति एवं दृष्टि संवेदनशीलता',
    isVulnerable: isEyesVulnerable,
    severity: isEyesVulnerable ? 'Mild' : 'None',
    planetaryCausesEn: isEyesVulnerable
      ? [`Malefics in 2nd House (Right Eye) or 12th House (Left Eye) indicate vision strain.`]
      : ['2nd and 12th houses are peaceful, supporting natural ocular clarity.'],
    planetaryCausesHi: isEyesVulnerable
      ? [`द्वितीय भाव (दायां नेत्र) या द्वादश भाव (बायां नेत्र) में क्रूर ग्रहों की स्थिति दृष्टि संवेदनशीलता दर्शाती है।`]
      : ['द्वितीय व द्वादश भाव शुभ स्थिति में हैं।'],
    preventiveGuidelinesEn:
      'Take regular digital screen pauses, ensure ample Vitamin A and leafy greens in diet, and wear anti-glare protection during screen exposure.',
    preventiveGuidelinesHi:
      'स्क्रीन के निरंतर उपयोग से बचें, हरी पत्तेदार सब्जियों का सेवन करें तथा समय पर नेत्र परीक्षण कराएं।',
    ayurvedicUpayaEn:
      'Wash eyes with filtered Triphala water at sunrise, offer Arghya to the rising Sun daily, and chant the Chakshushopanishad mantra.',
    ayurvedicUpayaHi:
      'प्रातःकाल ताजे त्रिफला जल से नेत्र धोएं, सूर्य देव को अर्घ्य दें तथा चाक्षुषोपनिषद का पाठ करें।',
    classicalSource: 'Sphujidhvaja Yavanajataka Ch. 3 · Phaladeepika Ch. 13',
  });

  // Disease 5: Mental Serenity & Nervous Vitality (Moon, Mercury, Lagna)
  const moonAfflicted = moon && (moon.isCombust || ['Saturn', 'Rahu', 'Ketu'].includes(chart.planets.find((p) => p.rasiHouseNumber === moon.rasiHouseNumber && p.id !== 'Moon')?.id || ''));
  const isMentalVulnerable = Boolean(moonAfflicted);

  diseaseAlerts.push({
    category: 'Mental',
    diseaseNameEn: 'Neurological Caliber & Emotional Equanimity (मानसिक शांति व निद्रा)',
    diseaseNameHi: 'मानसिक शांति, निद्रा एवं वात-नाड़ी संस्थान',
    isVulnerable: isMentalVulnerable,
    severity: isMentalVulnerable ? 'Moderate' : 'None',
    planetaryCausesEn: isMentalVulnerable
      ? ['Moon (significator of Manas) influenced by nodal or Saturnian axis, causing intermittent anxiety or racing thoughts.']
      : ['Moon and Mercury occupy peaceful coordinates, conferring serene emotional composure.'],
    planetaryCausesHi: isMentalVulnerable
      ? ['चंद्रमा पर राहु/केतु या शनि का प्रभाव, जिससे समय-समय पर अत्यधिक चिंता अथवा अनिद्रा हो सकती है।']
      : ['चंद्रमा व बुध शुभ स्थिति में हैं, जो स्थिर मनःस्थिति प्रदान करते हैं।'],
    preventiveGuidelinesEn:
      'Establish a calming wind-down ritual 1 hour before bedtime, disconnect from electronic devices, and practice 15 minutes of Pranayama (Bhramari).',
    preventiveGuidelinesHi:
      'सोने से पूर्व मोबाइल-स्क्रीन से दूरी बनाएं, नियमित शयन समय का पालन करें तथा नित्य भ्रामरी प्राणायाम व ध्यान करें।',
    ayurvedicUpayaEn:
      'Massage soles of feet with warm cow ghee before sleeping, drink warm milk with a pinch of nutmeg, and chant Om Namah Shivaya daily.',
    ayurvedicUpayaHi:
      'रात्रि में पैर के तलवों पर देशी गाय के घी की मालिश करें, गुनगुना जायफल युक्त दूध पिएं तथा प्रतिदिन ॐ नमः शिवाय का शांत जप करें।',
    classicalSource: 'Charaka Samhita (Unmada Chikitsa) · Prashna Marga Ch. 14',
  });

  // Disease 6: Musculoskeletal & Arthritic Vata Sensitivity (H10, Saturn, Air signs)
  const satInDusthana = saturn && [6, 8, 12].includes(saturn.rasiHouseNumber);
  const isJointsVulnerable = Boolean(satInDusthana || (saturn && [2, 6, 10].includes(saturn.signIndex)));

  diseaseAlerts.push({
    category: 'JointsVata',
    diseaseNameEn: 'Musculoskeletal & Arthritic Vata Balance (अस्थि व संधिवात)',
    diseaseNameHi: 'अस्थि, संधिवात एवं वात विकार',
    isVulnerable: isJointsVulnerable,
    severity: isJointsVulnerable ? 'Mild' : 'None',
    planetaryCausesEn: isJointsVulnerable
      ? ['Saturnian placement in Dusthana or windy sign highlights need for joint and bone lubrication past mid-life.']
      : ['Saturn is dignified, bestowing strong bone density and sturdy posture.'],
    planetaryCausesHi: isJointsVulnerable
      ? ['शनि का त्रिक भाव अथवा वायु राशि में होना जोड़ों व हड्डियों में वात वृद्धि की संवेदनशीलता दर्शाता है।']
      : ['शनि देव बली हैं, जो हड्डियों को सुदृढ़ता प्रदान करते हैं।'],
    preventiveGuidelinesEn:
      'Engage in daily low-impact joint mobility, avoid cold and stale food, stay warm during seasonal transitions, and monitor Vitamin D3 levels.',
    preventiveGuidelinesHi:
      'हल्का नियमित व्यायाम करें, ठंडे व बासी भोजन से बचें, सर्दियों में गर्म वस्त्र पहनें तथा विटामिन डी3 की जांच कराएं।',
    ayurvedicUpayaEn:
      'Perform warm sesame oil abhyanga on joints, consume turmeric-ginger golden milk, and recite Hanuman Chalisa on Saturdays.',
    ayurvedicUpayaHi:
      'तिल के तेल से जोड़ों की मालिश करें, हल्दी-सोंठ युक्त दूध का सेवन करें तथा शनिवार को हनुमान चालीसा का पाठ करें।',
    classicalSource: 'Sphujidhvaja Yavanajataka Ch. 4 · Charaka Samhita (Vatavyadhi)',
  });

  // 4. Progeny Diagnostic (संतान सुख, गर्भाधान व बाधा निवारण)
  const l5Sign = (ascSign + 4) % 12;
  const l5Id = SIGNS[l5Sign].lord as SevenPlanetId;
  const l5Body = chart.planets.find((p) => p.id === l5Id);
  const l5Placed = l5Body?.rasiHouseNumber ?? 5;
  const l5Dignity = l5Body?.dignity ?? 'Neutral';

  const jupDignity = jupiter?.dignity ?? 'Neutral';

  // Naga / Sarpa Dosha check (Rahu in 5th house or conjoined with 5th lord + Mars aspect)
  const rahuIn5th = rahu && rahu.rasiHouseNumber === 5;
  const rahuWith5thLord = rahu && l5Body && rahu.rasiHouseNumber === l5Body.rasiHouseNumber;
  const hasNagaSarpaDosha = Boolean(rahuIn5th || (rahuWith5thLord && mars && mars.rasiHouseNumber === 5));

  // Pitru Dosha in Progeny (Sun in 5th/9th with Saturn or Rahu)
  const sunIn5thOr9th = sun && [5, 9].includes(sun.rasiHouseNumber);
  const satWithSun = saturn && sun && saturn.rasiHouseNumber === sun.rasiHouseNumber;
  const rahuWithSun = rahu && sun && rahu.rasiHouseNumber === sun.rasiHouseNumber;
  const hasPitruDoshaInProgeny = Boolean(sunIn5thOr9th && (satWithSun || rahuWithSun));

  const synthCtx = buildClassicalSynthesisContext(chart);
  const progenyWeighted = evaluateWeightedProgenyAxis(synthCtx, ascSign);
  const ayusWeighted = evaluateWeightedAyusVitality(synthCtx, ascSign, chart);

  let overallPromise: ProgenyDiagnosticReport['overallPromise'] = 'Auspicious';
  let overallPromiseHi = 'संतान सुख अनुकूल व श्रेष्ठ';

  if (progenyWeighted.obstructionScore >= 5 || (hasNagaSarpaDosha && hasPitruDoshaInProgeny)) {
    overallPromise = 'Challenging (Requires Upaya)';
    overallPromiseHi = 'विशेष शांति उपाय अपेक्षित';
  } else if (progenyWeighted.obstructionScore >= 2.5 || hasNagaSarpaDosha || hasPitruDoshaInProgeny || (l5Body && [6, 8, 12].includes(l5Body.rasiHouseNumber))) {
    overallPromise = 'Delayed / Obstacles';
    overallPromiseHi = 'विलंब उपरांत संतान सुख';
  } else if (['Exalted', 'Own Sign', 'Moolatrikona'].includes(l5Dignity) && ['Exalted', 'Own Sign', 'Moolatrikona'].includes(jupDignity)) {
    overallPromise = 'Highly Auspicious';
    overallPromiseHi = 'अत्यंत शुभ, सुयोग्य व संस्कारी संतान योग';
  }

  const timingPredictionEn = `${progenyWeighted.conceiveTiming.valEn} | ${progenyWeighted.childrenYoga.valEn}`;
  const timingPredictionHi = `${progenyWeighted.conceiveTiming.valHi} | ${progenyWeighted.childrenYoga.valHi}`;

  const vedicRemediesEn: string[] = [
    'Chant the sacred Santana Gopala Mantra (108 times daily): "Om Shreem Hreem Kleem Glaum Devakisuta Govinda Vasudeva Jagatpate Dehi Me Tanayam Krishna Tvamaham Sharanam Gatah".',
    'Listen to or sponsor recitation of Harivamsa Purana.',
    ...(hasNagaSarpaDosha ? ['Perform Naga Pratishtha or Rahu shanti puja at a sacred Shiva/Subrahmanya shrine.'] : []),
    ...(hasPitruDoshaInProgeny ? ['Perform Pitru Tarpan on Amavasya, offer water to Peepal tree, and donate cooked meals to the elderly.'] : []),
    'Offer yellow bananas, chana dal, or turmeric to cow and elders on Thursdays.',
  ];

  const vedicRemediesHi: string[] = [
    'प्रतिदिन १०८ बार संतान गोपाल मंत्र का जप करें: "ॐ श्रीं ह्रीं क्लीं ग्लौं देवकीसुत गोविन्द वासुदेव जगत्पते देहि मे तनयं कृष्ण त्वामहं शरणं गतः॥"',
    'हरिवंश पुराण का श्रवण अथवा पाठ करें।',
    ...(hasNagaSarpaDosha ? ['नाग प्रतिष्ठा अथवा राहु शांति हेतु शिव/कार्तिकेय मंदिर में पूजन व अभिषेक कराएं।'] : []),
    ...(hasPitruDoshaInProgeny ? ['अमावस्या को पितरों के निमित्त तर्पण करें, पीपल वृक्ष पर जल दें तथा वृद्धजनों को भोजन कराएं।'] : []),
    'गुरुवार को गाय को चने की दाल, गुड़ व केले खिलाएं तथा बड़े-बुजुर्गों का आशीर्वाद लें।',
  ];

  const progenyDiagnostic: ProgenyDiagnosticReport = {
    overallPromise,
    overallPromiseHi,
    fifthHouseLord: l5Id,
    fifthHousePlaced: l5Placed,
    fifthLordDignity: l5Dignity,
    putrakarakaJupiterDignity: jupDignity,
    hasNagaSarpaDosha,
    nagaDoshaDetailsEn: hasNagaSarpaDosha
      ? 'Nodal axis (Rahu/Ketu) influences 5th house of lineage, advising Naga shanti for harmonious conception.'
      : undefined,
    nagaDoshaDetailsHi: hasNagaSarpaDosha
      ? 'पंचम भाव पर राहु का प्रभाव सर्प/नाग दोष निर्मित करता है, जिसके निवारण हेतु शास्त्रीय शांति श्रेयस्कर है।'
      : undefined,
    hasPitruDoshaInProgeny,
    pitruDoshaDetailsEn: hasPitruDoshaInProgeny
      ? 'Sun afflicted in dharmic houses indicates ancestral debt (Pitru Rin), resolved through Shraddha charity.'
      : undefined,
    pitruDoshaDetailsHi: hasPitruDoshaInProgeny
      ? 'सूर्य देव पर पाप प्रभाव पितृ ऋण का सूचक है, जिसके निवारण हेतु तर्पण व सात्विक दान आवश्यक है।'
      : undefined,
    timingPredictionEn,
    timingPredictionHi,
    vedicRemediesEn,
    vedicRemediesHi,
    classicalSource: 'Brihat Parashara Hora Shastra (Santan Adhyaya) · Phaladeepika Ch. 12',
  };

  const criticalHealthPhasesEn = [
    ayusWeighted.valEn,
    'Sub-periods of 6th Lord, 8th Lord, or Badhakadhipati require heightened lifestyle and dietary vigilance.',
    'Major transits of Saturn or Rahu over natal Sun or natal Moon indicate periods for preventive clinical checkups.',
    'Transits of Jupiter over Lagna or 11th House bring accelerated convalescence, cellular rejuvenation, and healing.',
  ];

  const criticalHealthPhasesHi = [
    ayusWeighted.valHi,
    'षष्ठेश, अष्टमेश अथवा बाधकेश की अंतर्दशा में आहार-विहार व दिनचर्या में विशेष सतर्कता बरतें।',
    'गोचर में शनि या राहु का जन्म सूर्य अथवा जन्म चंद्र पर से भ्रमण स्वास्थ्य परीक्षण कराने का उपयुक्त संकेत है।',
    'लग्न अथवा एकादश भाव पर गुरु का शुभ गोचर शीघ्र स्वास्थ्य लाभ, रोग-मुक्ति व जीवनी शक्ति की पुनर्स्थापना करता है।',
  ];

  const holisticChikitsaUpayaEn = [
    'Maha Mrityunjaya Mantra (108 times daily) for cellular longevity and safeguarding ojas.',
    'Align circadian nutrition with dominant dosha (warm/nourishing for Vata, cooling/pure for Pitta, light/spicy for Kapha).',
    'Daily morning Surya Arghya (water offering to Sun) for strengthening bone density, eye health, and cardiac vitality.',
    'Monday Shiva Abhisheka with pure milk or bilva leaves to pacify mental restlessness and soothe Moon.',
  ];

  const holisticChikitsaUpayaHi = [
    'प्रतिदिन १०८ बार महामृत्युंजय मंत्र का जप शारीरिक ओज व दीर्घायु की रक्षा करता है।',
    'अपनी प्रकृति (वात, पित्त, कफ) के अनुसार सात्विक आहार लें और मौसमी बदलावों के प्रति सजग रहें।',
    'प्रातःकाल सूर्योदय के समय सूर्य देव को तांबे के लोटे से जल अर्पित करें (अस्थि, नेत्र व हृदय स्वास्थ्य हेतु)।',
    'सोमवार को शिवलिंग पर कच्चा दूध या जल अर्पित करें (मानसिक शांति व चंद्र शांति हेतु)।',
  ];

  const extendedConditions = evaluateExtendedMedicalConditions(
    chart.planets.map((p) => ({
      ...p,
      placedHouse: ((p.signIndex - chart.ascendant.signIndex + 12) % 12) + 1,
    }))
  );

  return {
    dominantDosha,
    dominantDoshaHi,
    doshaBreakdown: {
      vata: vataPct,
      pitta: pittaPct,
      kapha: kaphaPct,
    },
    constitutionalAdviceEn,
    constitutionalAdviceHi,
    vulnerableOrganSystems,
    diseaseAlerts,
    extendedConditions,
    progenyDiagnostic,
    criticalHealthPhasesEn,
    criticalHealthPhasesHi,
    holisticChikitsaUpayaEn,
    holisticChikitsaUpayaHi,
    classicalSources: [
      'Charaka Samhita',
      'Sushruta Samhita',
      'Sphujidhvaja Yavanajataka',
      'Brihat Parashara Hora Shastra',
      'Phaladeepika Ch. 13',
      'Prashna Marga Ch. 14',
    ],
  };
}
