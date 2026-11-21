/**
 * prasnaMargaAdvancedEngines.ts
 * Classical Prasna Marga (Chapters 10–20), Dr. B.V. Raman & Ashtakavarga Specialized Engines:
 * 1. Prasna Marga Medical Astrology (Roga Prasna, Tridosha & 7 Dhatus)
 * 2. Beeja Sphuta & Kshetra Sphuta (Fertility, Progeny & Adoption)
 * 3. Badhakasthana, Offended Deities & Karmic Remedies (Chapter 15)
 * 4. Vivaha Prasna & Natal Spouse Analysis (Chapter 17 & 20)
 * 5. Ashtakavarga Sodya Pinda Longevity & 337 Life Map
 * 6. Tripataki Chakra & Special Sensitive Chakras
 * 7. B.V. Raman Mundane & Earthquake Risk Index (0–35 Scale)
 */

import { NAKSHATRAS, SIGNS } from '../constants';
import type { BodyPosition, ChartData, PlanetId, SevenPlanetId } from '../types';

// ─── 1. PRASNA MARGA MEDICAL DIAGNOSTICS (CHAPTERS 12 & 13) ───────────────────

export interface DhatuAffliction {
  planetId: PlanetId;
  planetNameEn: string;
  planetNameHi: string;
  dhatuEn: string;
  dhatuHi: string;
  associatedOrgansEn: string;
  associatedOrgansHi: string;
  isAfflicted: boolean;
  severity: 'Healthy' | 'Mild' | 'Moderate' | 'Severe';
  manifestationEn: string;
  manifestationHi: string;
}

export interface PrasnaMedicalReport {
  etiologyType: 'Nija' | 'Agantuka' | 'Mixed';
  etiologyTitleEn: string;
  etiologyTitleHi: string;
  etiologyDescriptionEn: string;
  etiologyDescriptionHi: string;
  vataPercent: number;
  pittaPercent: number;
  kaphaPercent: number;
  dominantDoshaEn: string;
  dominantDoshaHi: string;
  doshaGuidanceEn: string;
  doshaGuidanceHi: string;
  dhatus: DhatuAffliction[];
  soolaChakraOnsetNakshatra: string;
  soolaChakraRecoveryNakshatra: string;
  soolaChakraDurationEstimateEn: string;
  soolaChakraDurationEstimateHi: string;
  unmadaAfflictionPresent: boolean;
  unmadaAnalysisEn: string;
  unmadaAnalysisHi: string;
  apasmaraAfflictionPresent: boolean;
  apasmaraAnalysisEn: string;
  apasmaraAnalysisHi: string;
  madhumehaRiskPresent: boolean;
  madhumehaAnalysisEn: string;
  madhumehaAnalysisHi: string;
  ayurvedicTasteRemediesEn: string[];
  ayurvedicTasteRemediesHi: string[];
  mrityunjayaSadhanaEn: string;
  mrityunjayaSadhanaHi: string;
}

export function computePrasnaMargaMedical(chart: ChartData): PrasnaMedicalReport {
  const dusthanas = [6, 8, 12];
  const planets = chart.planets;
  const naturalMalefics: PlanetId[] = ['Saturn', 'Mars', 'Rahu', 'Ketu', 'Sun'];

  const dusthanaPlanets = planets.filter((p) => dusthanas.includes(p.rasiHouseNumber));
  const maleficsInDusthana = dusthanaPlanets.filter((p) => naturalMalefics.includes(p.id as PlanetId));

  // Determine Nija vs Agantuka
  const mandiInSensitive = planets.some(
    (p) => (p.id === 'Rahu' || p.id === 'Ketu') && dusthanas.includes(p.rasiHouseNumber)
  );

  let etiologyType: 'Nija' | 'Agantuka' | 'Mixed' = 'Nija';
  let etTitleEn = 'Nija (Constitutional / Bodily Humoral Imbalance)';
  let etTitleHi = 'निज रोग (शारीरिक त्रिदोष व आंतरिक असंतुलन)';
  let etDescEn = 'Afflictions stem primarily from internal bodily humors (Vata, Pitta, Kapha) and seasonal dietary lifestyle imbalances.';
  let etDescHi = 'रोग का मूल कारण शारीरिक वात, पित्त, कफ का असंतुलन एवं दिनचर्या-आहार संबंधी विकार है।';

  if (mandiInSensitive && maleficsInDusthana.length > 1) {
    etiologyType = 'Mixed';
    etTitleEn = 'Mixed Nija-Agantuka (Physical Imbalance with Karmic Overlay)';
    etTitleHi = 'मिश्रित निज-आगंतुक (शारीरिक विकार एवं प्रारब्ध कर्म प्रभाव)';
    etDescEn = 'Physical symptoms are heightened by unseen psychological, karmic, or environmental stress requiring combined medicine and spiritual peace.';
    etDescHi = 'शारीरिक कष्ट के साथ-साथ मानसिक चिंता और पूर्व कर्म जनित बाधा का प्रभाव है; औषधि व मंत्र साधना दोनों श्रेयस्कर हैं।';
  } else if (mandiInSensitive) {
    etiologyType = 'Agantuka';
    etTitleEn = 'Agantuka (External, Environmental & Karmic Factors)';
    etTitleHi = 'आगंतुक रोग (बाह्य परिस्थितियां, चोट एवं मानसिक दबाव)';
    etDescEn = 'Afflictions arise from external environmental impacts, unforeseen accidents, psychological stress, or neglected spiritual practices.';
    etDescHi = 'रोग बाह्य कारणों, आकस्मिक चोट अथवा मानसिक तनाव से उत्पन्न है; आध्यात्मिक शांति व सात्विक जीवनचर्या आवश्यक है।';
  }

  // Tridosha Calculation
  let vataWeight = 25;
  let pittaWeight = 25;
  let kaphaWeight = 25;

  const saturn = planets.find((p) => p.id === 'Saturn');
  const mars = planets.find((p) => p.id === 'Mars');
  const sun = planets.find((p) => p.id === 'Sun');
  const moon = planets.find((p) => p.id === 'Moon');
  const jupiter = planets.find((p) => p.id === 'Jupiter');
  const venus = planets.find((p) => p.id === 'Venus');
  const mercury = planets.find((p) => p.id === 'Mercury');

  if (saturn && dusthanas.includes(saturn.rasiHouseNumber)) vataWeight += 35;
  if (mars && dusthanas.includes(mars.rasiHouseNumber)) pittaWeight += 35;
  if (sun && dusthanas.includes(sun.rasiHouseNumber)) pittaWeight += 25;
  if (moon && dusthanas.includes(moon.rasiHouseNumber)) kaphaWeight += 30;
  if (jupiter && dusthanas.includes(jupiter.rasiHouseNumber)) kaphaWeight += 25;
  if (venus && dusthanas.includes(venus.rasiHouseNumber)) kaphaWeight += 20;
  if (mercury && dusthanas.includes(mercury.rasiHouseNumber)) vataWeight += 20;

  const totalDosha = vataWeight + pittaWeight + kaphaWeight;
  const vataPct = Math.round((vataWeight / totalDosha) * 100);
  const pittaPct = Math.round((pittaWeight / totalDosha) * 100);
  const kaphaPct = 100 - (vataPct + pittaPct);

  let domEn = 'Vata Dominant';
  let domHi = 'वात प्रधान (Vata)';
  let doshaGuidEn = 'Pacify Vata with warm, freshly cooked foods, sesame oil massage (Abhyanga), and restful routine sleep.';
  let doshaGuidHi = 'गर्म, स्निग्ध व ताजा भोजन करें; तिल के तेल से मालिश करें और रात्रि में समय पर शयन करें।';

  if (pittaPct >= vataPct && pittaPct >= kaphaPct) {
    domEn = 'Pitta Dominant';
    domHi = 'पित्त प्रधान (Pitta)';
    doshaGuidEn = 'Cool Pitta with sweet, bitter, and astringent foods, staying well hydrated and avoiding excessive spicy/acidic foods.';
    doshaGuidHi = 'अत्यधिक मिर्च-मसाले, खट्टे व तले खाद्य पदार्थों से बचें; शीतल जल, नारियल पानी व घी का सेवन हितकर है।';
  } else if (kaphaPct >= vataPct && kaphaPct >= pittaPct) {
    domEn = 'Kapha Dominant';
    domHi = 'कफ प्रधान (Kapha)';
    doshaGuidEn = 'Stimulate Kapha with regular cardiovascular exercise, warm spices (ginger, black pepper), and avoiding heavy dairy at night.';
    doshaGuidHi = 'नियमित व्यायाम करें; सोंठ, काली मिर्च व शहद का प्रयोग करें; रात्रि में भारी व ठंडे पदार्थों से बचें।';
  }

  // 7 Dhatus
  const dhatuDefs = [
    {
      id: 'Sun' as PlanetId,
      nameEn: 'Sun',
      nameHi: 'सूर्य',
      dhatuEn: 'Asthi Dhatu (Bones & Structural Skeleton)',
      dhatuHi: 'अस्थि धातु (हड्डियां व कंकाल तंत्र)',
      organsEn: 'Spine, heart rhythm, vital heat, vision vitality',
      organsHi: 'रीढ़ की हड्डी, हृदय गति, शारीरिक तेज, नेत्र ज्योति',
    },
    {
      id: 'Moon' as PlanetId,
      nameEn: 'Moon',
      nameHi: 'चंद्र',
      dhatuEn: 'Rakta Dhatu (Blood & Plasma Circulation)',
      dhatuHi: 'रक्त धातु (रक्त परिसंचरण व शारीरिक तरल पदार्थ)',
      organsEn: 'Blood stream, lymphatic fluid, stomach fluids, mental calmness',
      organsHi: 'रक्त संचार, लसीका, आमाशय रस, मानसिक शांति',
    },
    {
      id: 'Mars' as PlanetId,
      nameEn: 'Mars',
      nameHi: 'मंगल',
      dhatuEn: 'Mamsa / Majja Dhatu (Muscles & Bone Marrow)',
      dhatuHi: 'मांस व मज्जा धातु (मांसपेशियां व बोन मैरो)',
      organsEn: 'Muscular system, red blood cells, bile, surgical areas',
      organsHi: 'मांसपेशियां, लाल रक्त कणिकाएं, पित्त, शल्य चिकित्सा क्षेत्र',
    },
    {
      id: 'Mercury' as PlanetId,
      nameEn: 'Mercury',
      nameHi: 'बुध',
      dhatuEn: 'Twak Dhatu (Skin & Neural Transmission)',
      dhatuHi: 'त्वचा धातु (त्वचा, स्नायु संचार व श्वसन नली)',
      organsEn: 'Epidermis, bronchial tubes, vocal cords, nervous signaling',
      organsHi: 'त्वचा, श्वास नलिका, वाणी तंत्र, तंत्रिका संचार',
    },
    {
      id: 'Jupiter' as PlanetId,
      nameEn: 'Jupiter',
      nameHi: 'गुरु',
      dhatuEn: 'Meda Dhatu (Adipose Tissue, Fat & Liver)',
      dhatuHi: 'मेद धातु (चर्बी, यकृत/लिवर व अग्न्याशय)',
      organsEn: 'Liver, gallbladder, arterial fat balance, auditory system',
      organsHi: 'यकृत (लिवर), पित्ताशय, धमनियां, श्रवण शक्ति',
    },
    {
      id: 'Venus' as PlanetId,
      nameEn: 'Venus',
      nameHi: 'शुक्र',
      dhatuEn: 'Shukra Dhatu (Reproductive Tissue & Vital Essence)',
      dhatuHi: 'शुक्र धातु (प्रजनन तंत्र व ओजस)',
      organsEn: 'Kidneys, reproductive glands, facial radiance, hormonal balance',
      organsHi: 'गुर्दे (किडनी), जननेंद्रियां, चेहरे का तेज, हार्मोन संतुलन',
    },
    {
      id: 'Saturn' as PlanetId,
      nameEn: 'Saturn',
      nameHi: 'शनि',
      dhatuEn: 'Snayu Dhatu (Tendons, Joints & Chronic Nerves)',
      dhatuHi: 'स्नायु धातु (जोड़, नसें, घुटने व वात तंत्र)',
      organsEn: 'Knees, connective tendons, sciatic nerves, dental structure',
      organsHi: 'घुटने, जोड़, नसें, दांत, साइटिका तंत्रिका',
    },
  ];

  const dhatus: DhatuAffliction[] = dhatuDefs.map((def) => {
    const p = planets.find((pl) => pl.id === def.id);
    const inDusthana = p ? dusthanas.includes(p.rasiHouseNumber) : false;
    const isDebilitated = p?.dignity === 'Debilitated';
    const isCombust = p?.isCombust ?? false;

    let sev: 'Healthy' | 'Mild' | 'Moderate' | 'Severe' = 'Healthy';
    if (inDusthana && (isDebilitated || isCombust)) sev = 'Severe';
    else if (inDusthana || isDebilitated) sev = 'Moderate';
    else if (isCombust) sev = 'Mild';

    const isAff = sev !== 'Healthy';
    const manEn = isAff
      ? `Affliction to ${def.dhatuEn} calls for mindful protection of ${def.organsEn}.`
      : `Harmonious strength protects ${def.dhatuEn} and maintains vitality.`;
    const manHi = isAff
      ? `${def.dhatuHi} में संवेदनशीलता; ${def.organsHi} का विशेष ध्यान रखें।`
      : `${def.dhatuHi} सशक्त व संतुलित है।`;

    return {
      planetId: def.id,
      planetNameEn: def.nameEn,
      planetNameHi: def.nameHi,
      dhatuEn: def.dhatuEn,
      dhatuHi: def.dhatuHi,
      associatedOrgansEn: def.organsEn,
      associatedOrgansHi: def.organsHi,
      isAfflicted: isAff,
      severity: sev,
      manifestationEn: manEn,
      manifestationHi: manHi,
    };
  });

  // Soola Chakra Onset and Recovery Nakshatras
  const moonNakIdx = moon ? moon.nakshatraIndex : 0;
  const onsetNakIdx = (moonNakIdx + 5) % 27;
  const recoveryNakIdx = (moonNakIdx + 11) % 27;

  // Specific Medical Yogas
  const unmada = (moon && dusthanas.includes(moon.rasiHouseNumber) && saturn && dusthanas.includes(saturn.rasiHouseNumber)) || false;
  const apasmara = (saturn && saturn.rasiHouseNumber === 8) || (mars && saturn && Math.abs(mars.longitude - saturn.longitude) < 8);
  const madhumeha = (jupiter && [6, 8].includes(jupiter.rasiHouseNumber)) || (venus && venus.rasiHouseNumber === 8);

  return {
    etiologyType,
    etiologyTitleEn: etTitleEn,
    etiologyTitleHi: etTitleHi,
    etiologyDescriptionEn: etDescEn,
    etiologyDescriptionHi: etDescHi,
    vataPercent: vataPct,
    pittaPercent: pittaPct,
    kaphaPercent: kaphaPct,
    dominantDoshaEn: domEn,
    dominantDoshaHi: domHi,
    doshaGuidanceEn: doshaGuidEn,
    doshaGuidanceHi: doshaGuidHi,
    dhatus,
    soolaChakraOnsetNakshatra: NAKSHATRAS[onsetNakIdx]?.name || 'Rohini',
    soolaChakraRecoveryNakshatra: NAKSHATRAS[recoveryNakIdx]?.name || 'Uttara Phalguni',
    soolaChakraDurationEstimateEn: 'Acute symptoms resolve within 7 to 14 days when transit Moon crosses benefic asterisms.',
    soolaChakraDurationEstimateHi: 'गोचर चंद्र के शुभ नक्षत्रों में प्रवेश पर ७ से १४ दिनों में स्वास्थ्य लाभ दृष्टिगोचर होता है।',
    unmadaAfflictionPresent: Boolean(unmada),
    unmadaAnalysisEn: unmada
      ? 'Chitta (mind) is subjected to emotional fatigue; meditation, avoiding isolation, and Shankhpushpi/Brahmi are advised.'
      : 'Mental resilience and emotional nervous system remain sound and balanced.',
    unmadaAnalysisHi: unmada
      ? 'चंद्र व शनि की स्थिति से मानसिक थकान संभव है; ध्यान, प्राणायाम व सकारात्मक वातावरण में रहें।'
      : 'मानसिक दृढ़ता एवं स्नायु तंत्र संतुलित व सुदृढ़ है।',
    apasmaraAfflictionPresent: Boolean(apasmara),
    apasmaraAnalysisEn: apasmara
      ? 'Sensitive neurological axis; avoid irregular sleep, sudden sensory shocks, and excessive electronic screen fatigue.'
      : 'Neurological equilibrium is protected without major classical afflictions.',
    apasmaraAnalysisHi: apasmara
      ? 'तंत्रिका तंत्र में संवेदनशीलता; पर्याप्त नींद लें और रात्रि में स्क्रीन के अत्यधिक उपयोग से बचें।'
      : 'न्यूरोलॉजिकल संतुलन सुरक्षित है।',
    madhumehaRiskPresent: Boolean(madhumeha),
    madhumehaAnalysisEn: madhumeha
      ? 'Venus/Jupiter positioning advises mindful sugar, refined carbohydrates, and pancreatic metabolic monitoring.'
      : 'Metabolic liver and sugar balance operate within healthy equilibrium.',
    madhumehaAnalysisHi: madhumeha
      ? 'शुक्र/गुरु की स्थिति के कारण खानपान में अत्यधिक मीठे व वसायुक्त भोजन से परहेज श्रेयस्कर है।'
      : 'चयापचय (मेटाबॉलिज्म) एवं रक्त शर्करा संतुलन अनुकूल है।',
    ayurvedicTasteRemediesEn: [
      'Sweet (Madhura) & Astringent (Kashaya) tastes pacify inflamed Pitta.',
      'Warm spices and Bitter (Tikta) herbs cleanse accumulated Kapha.',
      'Warm organic milk with turmeric and saffron at night balances Vata and restores Ojas.',
    ],
    ayurvedicTasteRemediesHi: [
      'मधुर व कषाय रस पित्त की शांति करते हैं।',
      'तिक्त व कटु औषधियां कफ का शमन कर पाचन अग्नि को प्रदीप्त करती हैं।',
      'रात्रि में हल्दी युक्त गुनगुना दूध वात को संतुलित कर ओज की वृद्धि करता है।',
    ],
    mrityunjayaSadhanaEn: 'Recitation of Sri Maha Mrityunjaya Mantra 108 times daily acts as a supreme shield against chronic ailments and restores vital prana.',
    mrityunjayaSadhanaHi: 'प्रतिदिन १०८ बार श्री महामृत्युंजय मंत्र का जप शारीरिक व्याधियों से रक्षा कर जीवनी शक्ति (प्राण) का संवर्धन करता है।',
  };
}

// ─── 2. BEEJA SPHUTA & KSHETRA SPHUTA (FERTILITY & PROGENY) ───────────────────

export interface FertilitySphutaResult {
  sphutaLongitude: number;
  signIndex: number;
  signNameEn: string;
  signNameHi: string;
  degreeInSign: number;
  navamshaSignIndex: number;
  navamshaSignEn: string;
  navamshaSignHi: string;
  isSignAuspicious: boolean;
  isNavamshaAuspicious: boolean;
  fertilityScorePercent: number;
  classicalVerdictEn: string;
  classicalVerdictHi: string;
  remedyEn: string;
  remedyHi: string;
}

export interface ProgenyReport {
  maleBeejaSphuta: FertilitySphutaResult;
  femaleKshetraSphuta: FertilitySphutaResult;
  santanaSphutaLongitude: number;
  santanaSphutaSignEn: string;
  santanaSphutaSignHi: string;
  dattaSphutaLongitude: number;
  dattaSphutaSignEn: string;
  adoptionIndicator: boolean;
  adoptionSummaryEn: string;
  adoptionSummaryHi: string;
  progenyPromiseScore: number;
  overallProgenySummaryEn: string;
  overallProgenySummaryHi: string;
  classicalUpayasEn: string[];
  classicalUpayasHi: string[];
}

export function computeFertilityAndProgeny(chart: ChartData): ProgenyReport {
  const planets = chart.planets;
  const sun = planets.find((p) => p.id === 'Sun');
  const venus = planets.find((p) => p.id === 'Venus');
  const jupiter = planets.find((p) => p.id === 'Jupiter');
  const moon = planets.find((p) => p.id === 'Moon');
  const mars = planets.find((p) => p.id === 'Mars');
  const mercury = planets.find((p) => p.id === 'Mercury');
  const saturn = planets.find((p) => p.id === 'Saturn');

  const sunLong = sun ? sun.longitude : 0;
  const venusLong = venus ? venus.longitude : 0;
  const jupLong = jupiter ? jupiter.longitude : 0;
  const moonLong = moon ? moon.longitude : 0;
  const marsLong = mars ? mars.longitude : 0;
  const mercLong = mercury ? mercury.longitude : 0;
  const satLong = saturn ? saturn.longitude : 0;

  // 1. Male Beeja Sphuta = (Sun + Venus + Jupiter) mod 360
  const beejaLong = (sunLong + venusLong + jupLong) % 360;
  const beejaSignIdx = Math.floor(beejaLong / 30);
  const beejaDegInSign = beejaLong % 30;
  // Navamsha of Beeja Sphuta: each sign has 9 navamshas of 3°20' (3.3333°)
  const beejaNavIdx = Math.floor((beejaLong % 360) / (30 / 9)) % 12;
  // Odd signs: Aries(0), Gemini(2), Leo(4), Libra(6), Sagittarius(8), Aquarius(10) -> index % 2 === 0
  const beejaSignOdd = beejaSignIdx % 2 === 0;
  const beejaNavOdd = beejaNavIdx % 2 === 0;
  const beejaScore = (beejaSignOdd ? 50 : 20) + (beejaNavOdd ? 50 : 20);

  const maleBeeja: FertilitySphutaResult = {
    sphutaLongitude: beejaLong,
    signIndex: beejaSignIdx,
    signNameEn: SIGNS[beejaSignIdx].name,
    signNameHi: ['मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या', 'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुम्भ', 'मीन'][beejaSignIdx],
    degreeInSign: Math.round(beejaDegInSign * 100) / 100,
    navamshaSignIndex: beejaNavIdx,
    navamshaSignEn: SIGNS[beejaNavIdx].name,
    navamshaSignHi: ['मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या', 'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुम्भ', 'मीन'][beejaNavIdx],
    isSignAuspicious: beejaSignOdd,
    isNavamshaAuspicious: beejaNavOdd,
    fertilityScorePercent: Math.min(100, beejaScore),
    classicalVerdictEn: beejaSignOdd && beejaNavOdd
      ? 'Supreme male potency: Beeja Sphuta falls in masculine odd sign and odd Navamsha, granting healthy lineage.'
      : 'Moderate potency: Beeja Sphuta receives mixed gender polarity; standard Vedic pacification recommended.',
    classicalVerdictHi: beejaSignOdd && beejaNavOdd
      ? 'उत्कृष्ट पुरुष बीज सामर्थ्य: बीज स्फुट विषम राशि व विषम नवांश में स्थित होकर वंश वृद्धि हेतु अत्यंत पुष्ट है।'
      : 'मध्यम बीज सामर्थ्य: बीज स्फुट मिश्रित राशि में है; सात्विक जीवनशैली व गो-सेवा श्रेयस्कर है।',
    remedyEn: 'Recite Sri Harivamsa Purana chapters or worship Lord Krishna as Santana Gopala.',
    remedyHi: 'संतान गोपाल मंत्र का जप करें अथवा हरिवंश पुराण का श्रवण करें।',
  };

  // 2. Female Kshetra Sphuta = (Moon + Mars + Jupiter) mod 360
  const kshetraLong = (moonLong + marsLong + jupLong) % 360;
  const kshetraSignIdx = Math.floor(kshetraLong / 30);
  const kshetraDegInSign = kshetraLong % 30;
  const kshetraNavIdx = Math.floor((kshetraLong % 360) / (30 / 9)) % 12;
  // Even signs: Taurus(1), Cancer(3), Virgo(5), Scorpio(7), Capricorn(9), Pisces(11) -> index % 2 === 1
  const kshetraSignEven = kshetraSignIdx % 2 === 1;
  const kshetraNavEven = kshetraNavIdx % 2 === 1;
  const kshetraScore = (kshetraSignEven ? 50 : 20) + (kshetraNavEven ? 50 : 20);

  const femaleKshetra: FertilitySphutaResult = {
    sphutaLongitude: kshetraLong,
    signIndex: kshetraSignIdx,
    signNameEn: SIGNS[kshetraSignIdx].name,
    signNameHi: ['मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या', 'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुम्भ', 'मीन'][kshetraSignIdx],
    degreeInSign: Math.round(kshetraDegInSign * 100) / 100,
    navamshaSignIndex: kshetraNavIdx,
    navamshaSignEn: SIGNS[kshetraNavIdx].name,
    navamshaSignHi: ['मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या', 'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुम्भ', 'मीन'][kshetraNavIdx],
    isSignAuspicious: kshetraSignEven,
    isNavamshaAuspicious: kshetraNavEven,
    fertilityScorePercent: Math.min(100, kshetraScore),
    classicalVerdictEn: kshetraSignEven && kshetraNavEven
      ? 'Supreme maternal fertility: Kshetra Sphuta occupies fertile feminine even sign and even Navamsha.'
      : 'Moderate maternal fertility: Requires nourishing hormonal balance and spiritual prayers.',
    classicalVerdictHi: kshetraSignEven && kshetraNavEven
      ? 'उत्कृष्ट मातृ क्षेत्र सामर्थ्य: क्षेत्र स्फुट सम राशि व सम नवांश में स्थित होकर सहज मातृत्व सुख का सूचक है।'
      : 'मध्यम क्षेत्र सामर्थ्य: माता की शारीरिक पुष्टि व शांति अनुष्ठान लाभकारी रहेगा।',
    remedyEn: 'Worship Goddess Parvati or perform Skandamata puja during Shukla Paksha.',
    remedyHi: 'मां पार्वती अथवा स्कंदमाता की आराधना करें; पंचामृत अर्पित करें।',
  };

  // 3. Santana Sphuta = (5 * Jupiter) mod 360
  const santanaLong = (5 * jupLong) % 360;
  const santanaSignIdx = Math.floor(santanaLong / 30);

  // 4. Datta Sphuta (Adoption) = 5 * (Mercury + Saturn + 5th Lord) mod 360
  const lagnaSign = chart.ascendant ? chart.ascendant.signIndex : 0;
  const fifthSign = (lagnaSign + 4) % 12;
  const fifthLordId = SIGNS[fifthSign].lord;
  const fifthLord = planets.find((p) => p.id === fifthLordId);
  const fifthLordLong = fifthLord ? fifthLord.longitude : 0;
  const dattaLong = (5 * (mercLong + satLong + fifthLordLong)) % 360;
  const dattaSignIdx = Math.floor(dattaLong / 30);

  const adoptionLikely = saturn ? [5, 9].includes(saturn.rasiHouseNumber) && (maleBeeja.fertilityScorePercent < 60) : false;

  const totalScore = Math.round((maleBeeja.fertilityScorePercent + femaleKshetra.fertilityScorePercent) / 2);

  return {
    maleBeejaSphuta: maleBeeja,
    femaleKshetraSphuta: femaleKshetra,
    santanaSphutaLongitude: santanaLong,
    santanaSphutaSignEn: SIGNS[santanaSignIdx].name,
    santanaSphutaSignHi: ['मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या', 'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुम्भ', 'मीन'][santanaSignIdx],
    dattaSphutaLongitude: dattaLong,
    dattaSphutaSignEn: SIGNS[dattaSignIdx].name,
    adoptionIndicator: adoptionLikely,
    adoptionSummaryEn: adoptionLikely
      ? 'Datta Sphuta highlights high spiritual compassion, foster parenting, or formal adoption blessings in life.'
      : 'Standard direct biological lineage indicators are primary without heavy adoption compulsion.',
    adoptionSummaryHi: adoptionLikely
      ? 'दत्तक स्फुट संकेत देता है कि जातक को पर-संतान पालन अथवा दत्तक ग्रहण से असीम सुख व पुण्य प्राप्त होगा।'
      : 'प्रत्यक्ष जैविक संतान का शास्त्रीय योग प्रबल है।',
    progenyPromiseScore: totalScore,
    overallProgenySummaryEn: totalScore >= 75
      ? 'Exceptional progeny promise: Both Beeja and Kshetra sphutas align with Shastric fecundity rules.'
      : 'Positive progeny indicators with mild testing; observing classical Santana Gopala upayas will expedite auspicious delivery.',
    overallProgenySummaryHi: totalScore >= 75
      ? 'उत्कृष्ट संतान योग: बीज एवं क्षेत्र स्फुट दोनों ही शास्त्रीय फलित के अनुसार संतान सुख हेतु अत्यंत अनुकूल हैं।'
      : 'संतान प्राप्ति के सकारात्मक योग हैं; शास्त्रीय उपायों द्वारा समय पर शुभ समाचार प्राप्त होगा।',
    classicalUpayasEn: [
      'Chant Santana Gopala Mantra: Om Devaki Suta Govinda Vasudeva Jagatpate Dehi Me Tanayam Krishna Tvaamaham Sharanam Gatah.',
      'Serve calves or feed green fodder to cows on Thursdays.',
      'Offer yellow flowers and butter to Lord Bala Krishna.',
    ],
    classicalUpayasHi: [
      'संतान गोपाल मंत्र का नित्य १०८ बार जप करें: "ॐ देवकीसुत गोविंद वासुदेव जगत्पते। देहि मे तनयं कृष्ण त्वामहं शरणं गतः॥"',
      'गुरुवार को गाय को भीगी हुई चने की दाल व गुड़ खिलाएं।',
      'भगवान बालकृष्ण को माखन-मिश्री का भोग अर्पित करें।',
    ],
  };
}

// ─── 3. BADHAKASTHANA, OFFENDED DEITIES & KARMIC AFFLICTIONS (CHAPTER 15) ────

export interface BadhakaReport {
  lagnaSignEn: string;
  lagnaSignHi: string;
  lagnaQuality: 'Movable' | 'Fixed' | 'Dual';
  badhakaHouseNumber: number; // 11, 9, or 7
  badhakaSignEn: string;
  badhakaSignHi: string;
  badhakaLordEn: string;
  badhakaLordHi: string;
  badhakaPlacementHouse: number;
  offendedDeityEn: string;
  offendedDeityHi: string;
  karmaNature: 'Dridha (Deliberate)' | 'Adridha (Unintentional)' | 'Dridha-Adridha (Mixed)';
  karmaAnalysisEn: string;
  karmaAnalysisHi: string;
  drishtiBadhaScore: number; // 0..100
  drishtiBadhaSeverity: 'Negligible' | 'Mild' | 'Moderate' | 'Severe';
  drishtiBadhaAnalysisEn: string;
  drishtiBadhaAnalysisHi: string;
  pretaBadhaPresent: boolean;
  pretaBadhaRemedyEn: string;
  pretaBadhaRemedyHi: string;
  pitraCursePresent: boolean;
  pitraCurseAnalysisEn: string;
  pitraCurseAnalysisHi: string;
  prescribedPalliativesEn: string[];
  prescribedPalliativesHi: string[];
}

export function computeBadhakaAndDeities(chart: ChartData): BadhakaReport {
  const lagnaIdx = chart.ascendant ? chart.ascendant.signIndex : 0;
  const planets = chart.planets;

  // Movable: 0, 3, 6, 9 -> Badhaka = 11th
  // Fixed: 1, 4, 7, 10 -> Badhaka = 9th
  // Dual: 2, 5, 8, 11 -> Badhaka = 7th
  const isMovable = [0, 3, 6, 9].includes(lagnaIdx);
  const isFixed = [1, 4, 7, 10].includes(lagnaIdx);

  const lagnaQuality: 'Movable' | 'Fixed' | 'Dual' = isMovable ? 'Movable' : isFixed ? 'Fixed' : 'Dual';
  const badhakaHouse = isMovable ? 11 : isFixed ? 9 : 7;
  const badhakaSignIdx = (lagnaIdx + badhakaHouse - 1) % 12;
  const badhakaLordId = SIGNS[badhakaSignIdx].lord;

  const bLordPlanet = planets.find((p) => p.id === badhakaLordId);
  const bLordHouse = bLordPlanet ? bLordPlanet.rasiHouseNumber : badhakaHouse;

  // Offended Deity Map
  const deityMap: Record<string, { en: string; hi: string; remedyEn: string; remedyHi: string }> = {
    Sun: {
      en: 'Lord Shiva / Bhagwan Rama / Surya Narayana',
      hi: 'भगवान शिव / श्रीराम / सूर्य नारायण',
      remedyEn: 'Offer Arghya to rising Sun; perform Rudrabhisheka or chant Shiva Sahasranama.',
      remedyHi: 'प्रातः सूर्य को जल दें; रुद्राभिषेक कराएं अथवा शिव पंचाक्षर का जप करें।',
    },
    Moon: {
      en: 'Goddess Durga / Chamundi / Parvati',
      hi: 'मां दुर्गा / चामुंडा / माता पार्वती',
      remedyEn: 'Recite Durga Saptashati; distribute sweet rice-pudding (kheer) to young girls.',
      remedyHi: 'दुर्गा सप्तशती का पाठ करें; कन्याओं को खीर खिलाएं और उनका आशीर्वाद लें।',
    },
    Mars: {
      en: 'Lord Kartikeya (Murugan) / Sri Hanuman / Bhairava',
      hi: 'भगवान कार्तिकेय (स्कंद) / श्री हनुमान जी / भैरव देव',
      remedyEn: 'Light mustard oil lamp for Lord Bhairava on Tuesdays; chant Hanuman Chalisa.',
      remedyHi: 'मंगलवार को हनुमान जी को सिंदूर अर्पित करें; सुंदरकांड व हनुमान बाहुक का पाठ करें।',
    },
    Mercury: {
      en: 'Lord Maha Vishnu / Sri Krishna',
      hi: 'भगवान महाविष्णु / श्रीकृष्ण',
      remedyEn: 'Chant Vishnu Sahasranama on Wednesdays; offer Tulsi garlands to Lord Krishna.',
      remedyHi: 'विष्णु सहस्रनाम का पाठ करें; तुलसी पत्र अर्पित कर भगवान विष्णु की पूजा करें।',
    },
    Jupiter: {
      en: 'Lord Sadashiva / Guru Dattatreya',
      hi: 'भगवान सदाशिव / गुरु दत्तात्रेय / देवगुरु',
      remedyEn: 'Honor preceptors and teachers; perform Guru Paduka Puja on Thursdays.',
      remedyHi: 'गुरुजनों व संतों का आदर करें; गुरुवार को चने की दाल व पीले फल दान करें।',
    },
    Venus: {
      en: 'Goddess Mahalakshmi / Annapurna / Yakshi',
      hi: 'माता महालक्ष्मी / अन्नपूर्णा / यक्षी देवी',
      remedyEn: 'Recite Sri Suktam or Kanakadhara Stotra on Fridays; feed needy cows.',
      remedyHi: 'श्री सूक्त का पाठ करें; शुक्रवार को मां लक्ष्मी की आराधना कर सफेद मिष्ठान्न का भोग लगाएं।',
    },
    Saturn: {
      en: 'Lord Sastha (Ayyappa) / Mahakala / Shani Dev',
      hi: 'भगवान शास्ता (अय्यप्पा) / महाकाल / शनि देव',
      remedyEn: 'Serve physically challenged and elderly workers; light sesame oil lamp on Saturdays.',
      remedyHi: 'शनिवार को शनि मंदिर में तिल के तेल का दीपक जलाएं; असहायों को अन्न दान दें।',
    },
    Rahu: {
      en: 'Naga Devata / Sarpa Devata / Goddess Chandi',
      hi: 'नाग देवता / सर्प कुल / माता चंडी',
      remedyEn: 'Perform Sarpa Shanti puja or offer raw milk to Shiva lingam on Nag Panchami.',
      remedyHi: 'शिवलिंग पर कच्चा दूध अर्पित करें; नवनाग स्तोत्र का पाठ करें।',
    },
    Ketu: {
      en: 'Lord Ganesha / Chandika',
      hi: 'भगवान श्रीगणेश / चंडी माता',
      remedyEn: 'Offer 21 Durva grass to Lord Ganesha on Wednesdays; feed stray dogs.',
      remedyHi: 'श्रीगणेश जी को दूर्वा व मोदक अर्पित करें; संकटनाशन गणेश स्तोत्र का पाठ करें।',
    },
  };

  const deity = deityMap[badhakaLordId] || deityMap.Jupiter;

  // Dridha vs Adridha Karma
  const sun = planets.find((p) => p.id === 'Sun');
  const moon = planets.find((p) => p.id === 'Moon');
  const moonHouse = moon ? moon.rasiHouseNumber : 1;
  const isDridha = [6, 8, 12].includes(bLordHouse) || [6, 8, 12].includes(moonHouse);

  // Drishti Badha
  const saturn = planets.find((p) => p.id === 'Saturn');
  const mars = planets.find((p) => p.id === 'Mars');
  const rahu = planets.find((p) => p.id === 'Rahu');

  let drishtiScore = 15;
  if (bLordHouse === 1 || bLordHouse === 7) drishtiScore += 35;
  if (saturn && [1, 7, 10].includes(saturn.rasiHouseNumber)) drishtiScore += 20;
  if (mars && [1, 4, 7, 8].includes(mars.rasiHouseNumber)) drishtiScore += 15;
  if (rahu && [1, 7].includes(rahu.rasiHouseNumber)) drishtiScore += 15;

  let drishtiSev: 'Negligible' | 'Mild' | 'Moderate' | 'Severe' = 'Negligible';
  if (drishtiScore >= 70) drishtiSev = 'Severe';
  else if (drishtiScore >= 45) drishtiSev = 'Moderate';
  else if (drishtiScore >= 25) drishtiSev = 'Mild';

  // Preta Badha & Pitra Curse
  const pretaBadha = planets.some((p) => p.id === 'Saturn' && p.rasiHouseNumber === badhakaHouse);
  const pitraCurse = Boolean((bLordHouse === 9) || (sun && [6, 8, 12].includes(sun.rasiHouseNumber) && saturn && saturn.rasiHouseNumber === 9));

  return {
    lagnaSignEn: SIGNS[lagnaIdx].name,
    lagnaSignHi: ['मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या', 'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुम्भ', 'मीन'][lagnaIdx],
    lagnaQuality,
    badhakaHouseNumber: badhakaHouse,
    badhakaSignEn: SIGNS[badhakaSignIdx].name,
    badhakaSignHi: ['मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या', 'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुम्भ', 'मीन'][badhakaSignIdx],
    badhakaLordEn: badhakaLordId,
    badhakaLordHi: badhakaLordId,
    badhakaPlacementHouse: bLordHouse,
    offendedDeityEn: deity.en,
    offendedDeityHi: deity.hi,
    karmaNature: isDridha ? 'Dridha (Deliberate)' : 'Adridha (Unintentional)',
    karmaAnalysisEn: isDridha
      ? 'Dridha Karma indicates past-life obligations requiring steady, devoted spiritual reparation and charitable service.'
      : 'Adridha Karma indicates lighter afflictions that dissolve swiftly through routine prayer and ethical living.',
    karmaAnalysisHi: isDridha
      ? 'दृढ़ कर्म पूर्व जन्म के संचित संकल्प का फल है; नियमित देव आराधना एवं निस्वार्थ सेवा से इसका शमन होता है।'
      : 'अदृढ़ कर्म साधारण है जो नित्य पूजा व सत्कर्मों से शीघ्र शांत हो जाता है।',
    drishtiBadhaScore: Math.min(100, drishtiScore),
    drishtiBadhaSeverity: drishtiSev,
    drishtiBadhaAnalysisEn: drishtiSev === 'Severe'
      ? 'Elevated susceptibility to negative psychic gaze or competitive envy. Protection via Hanuman Kavach is advised.'
      : 'Normal energetic aura shield; no debilitating psychic envy obstructing progress.',
    drishtiBadhaAnalysisHi: drishtiSev === 'Severe'
      ? 'नजर दोष अथवा ईर्ष्या का प्रभाव संभव है; हनुमान कवच का पाठ एवं शुद्ध वातावरण बनाए रखें।'
      : 'ऊर्जा कवच सुरक्षित है; किसी गंभीर नजर दोष का प्रभाव नहीं है।',
    pretaBadhaPresent: pretaBadha,
    pretaBadhaRemedyEn: pretaBadha
      ? 'Perform Tila Homa, Narayana Bali, or offer Pindadaana at a sacred tirtha (Gaya/Haridwar) to liberate restless ancestral spirits.'
      : 'Ancestral blessings flow smoothly without restless spirit disturbance.',
    pretaBadhaRemedyHi: pretaBadha
      ? 'पितरों की शांति हेतु गया अथवा हरिद्वार में पिंडदान व नारायण बलि श्राद्ध अनुष्ठान लाभकारी रहेगा।'
      : 'पितरों का आशीर्वाद प्राप्त है; कोई प्रेत बाधा नहीं है।',
    pitraCursePresent: pitraCurse,
    pitraCurseAnalysisEn: pitraCurse
      ? 'Pitra Rina (ancestral debt) indicated; regular Amavasya tarpan and honoring father/elders clears this hurdle.'
      : 'Paternal lineage karma is tranquil and supportive.',
    pitraCurseAnalysisHi: pitraCurse
      ? 'पितृ ऋण का संकेत है; प्रत्येक अमावस्या को तर्पण करें तथा पिता व वृद्धों का सम्मान करें।'
      : 'पितृ कुल की कृपा अनुकूल बनी हुई है।',
    prescribedPalliativesEn: [
      `Worship ${deity.en}: ${deity.remedyEn}`,
      'Recite Sri Vishnu Sahasranama or Shiva Panchakshara Stotra on sacred lunar tithis.',
      'Feed cows, birds, and underprivileged laborers on Saturdays.',
    ],
    prescribedPalliativesHi: [
      `${deity.hi} की आराधना: ${deity.remedyHi}`,
      'एकादशी अथवा प्रदोष व्रत पर भगवान विष्णु अथवा शिव जी की स्तुति करें।',
      'शनिवार को काले तिल, उड़द और अन्न का दान करें।',
    ],
  };
}

// ─── 4. VIVAHA PRASNA & NATAL SPOUSE ANALYSIS (CHAPTERS 17 & 20) ───────────────

export interface RemarriageYoga {
  titleEn: string;
  titleHi: string;
  isActive: boolean;
  descriptionEn: string;
  descriptionHi: string;
}

export interface VivahaSpouseReport {
  chandrabhilashaSphutaDeg: number;
  chandrabhilashaSignEn: string;
  chandrabhilashaSignHi: string;
  chandrabhilashaTimingWindowEn: string;
  chandrabhilashaTimingWindowHi: string;
  spouseComplexionEn: string;
  spouseComplexionHi: string;
  spouseTemperamentEn: string;
  spouseTemperamentHi: string;
  spouseFamilyStatureEn: string;
  spouseFamilyStatureHi: string;
  remarriageYogas: RemarriageYoga[];
  hasMultipleMarriagesRisk: boolean;
  maritalHarmonyAdviceEn: string;
  maritalHarmonyAdviceHi: string;
}

export function computeSpouseAndVivahaAnalysis(chart: ChartData): VivahaSpouseReport {
  const moon = chart.planets.find((p) => p.id === 'Moon');
  const venus = chart.planets.find((p) => p.id === 'Venus');
  const mars = chart.planets.find((p) => p.id === 'Mars');
  const saturn = chart.planets.find((p) => p.id === 'Saturn');
  const jupiter = chart.planets.find((p) => p.id === 'Jupiter');

  const lagnaIdx = chart.ascendant ? chart.ascendant.signIndex : 0;
  const seventhSignIdx = (lagnaIdx + 6) % 12;
  const seventhLordId = SIGNS[seventhSignIdx].lord;
  const seventhLord = chart.planets.find((p) => p.id === seventhLordId);

  // Chandrabhilasha Sphuta
  const moonDeg = moon ? moon.degreeInSign : 15;
  const chandraSphutaDeg = ((moonDeg * 60) * 800) % 21600 / 60;
  const chandraSignIdx = Math.floor(chandraSphutaDeg / 30) % 12;

  // Spouse Traits based on 7th House Sign
  const spouseSignTraits: Record<number, { complexionEn: string; complexionHi: string; tempEn: string; tempHi: string; statEn: string; statHi: string }> = {
    0: { complexionEn: 'Fair to reddish glowing skin', complexionHi: 'गौर-रक्त वर्ण, ओजस्वी मुख', tempEn: 'Bold, energetic, independent, direct', tempHi: 'साहसी, ऊर्जावान, स्वतंत्र विचार, स्पष्टवादी', statEn: 'Active, pioneering, self-made family', statHi: 'कर्मठ एवं स्वावलंबी परिवार' },
    1: { complexionEn: 'Fair, radiant and elegant', complexionHi: 'अत्यंत सुंदर, सौम्य व गौर वर्ण', tempEn: 'Patient, artistic, loyal, practical', tempHi: 'धैर्यवान, कलाप्रेमी, निष्ठावान व व्यावहारिक', statEn: 'Wealthy, landed, culturally refined family', statHi: 'समृद्ध, संभ्रांत व प्रतिष्ठित कुल' },
    2: { complexionEn: 'Wheatish, youthful and expressive', complexionHi: 'गेहुंआ, सजीव व युवा स्वरूप', tempEn: 'Witty, communicative, intellectual, adaptable', tempHi: 'बुद्धिमान, वाकपटु, मिलनसार व बहुमुखी', statEn: 'Educated, trading, academic background', statHi: 'शिक्षित, व्यापारिक व सुसंस्कृत परिवार' },
    3: { complexionEn: 'Pale fair with gentle lunar glow', complexionHi: 'श्वेत-गौर, सौम्य चंद्र आभा', tempEn: 'Deeply emotional, nurturing, devoted, intuitive', tempHi: 'भावुक, ममतामयी, समर्पित व संवेदनशील', statEn: 'Traditional, respected, homely lineage', statHi: 'परंपरावादी एवं प्रतिष्ठित परिवार' },
    4: { complexionEn: 'Golden fair with regal aura', complexionHi: 'स्वर्ण-वर्ण, तेजमय राजसी स्वरूप', tempEn: 'Noble, proud, generous, leadership qualities', tempHi: 'कुलीन, स्वाभिमानी, उदार व नेतृत्वशील', statEn: 'Authoritative, administrative, high societal status', statHi: 'उच्च प्रशासनिक व सामाजिक पदवी युक्त कुल' },
    5: { complexionEn: 'Clean fair, refined and petite', complexionHi: 'स्वच्छ गौर, सूक्ष्म व सुरुचिपूर्ण', tempEn: 'Analytical, meticulous, modest, organized', tempHi: 'विश्लेषणात्मक, कर्तव्यनिष्ठ व कार्यकुशल', statEn: 'Service, healthcare, professional family', statHi: 'पेशेवर, सेवाभावी व अनुशासित परिवार' },
    6: { complexionEn: 'Exquisitely fair, graceful and proportionate', complexionHi: 'अति सुंदर, सुडौल व मनमोहक वर्ण', tempEn: 'Diplomatic, charming, peace-loving, romantic', tempHi: 'सौहार्दपूर्ण, कलात्मक, न्यायप्रिय व मधुरभाषी', statEn: 'Affluent, commerce, artistic lineage', statHi: 'व्यापारिक, कलात्मक व संपन्न कुल' },
    7: { complexionEn: 'Intense wheatish to dusky, magnetic eyes', complexionHi: 'आकर्षक, गंभीर व चुंबकीय नेत्र', tempEn: 'Passionate, secretive, deeply loyal, resolute', tempHi: 'गंभीर, स्वाभिमानी, निष्ठावान व दृढ़ निश्चयी', statEn: 'Influential, landowning, intense lineage', statHi: 'प्रभावशाली व स्वावलंबी परिवार' },
    8: { complexionEn: 'Bright fair, tall and athletic', complexionHi: 'तेजस्वी गौर, उन्नत ललाट व सौम्य', tempEn: 'Philosophical, candid, adventurous, righteous', tempHi: 'धार्मिक, स्पष्टवादी, आशावादी व न्यायप्रिय', statEn: 'Scholarly, judicial, dharmic family', statHi: 'धार्मिक, न्यायिक व विद्वत परिवार' },
    9: { complexionEn: 'Dusky to olive, mature and serious', complexionHi: 'श्याम-गेहुंआ, परिपक्व व गंभीर', tempEn: 'Hardworking, disciplined, prudent, persevering', tempHi: 'कर्मठ, अनुशासित, मितव्ययी व कर्तव्यपरायण', statEn: 'Established, industrious, traditional lineage', statHi: 'परिश्रमी व स्थायी प्रतिष्ठा वाला कुल' },
    10: { complexionEn: 'Wheatish fair with unconventional charm', complexionHi: 'आकर्षक, आधुनिक व विशिष्ट रूप', tempEn: 'Humanitarian, progressive, intellectual, independent', tempHi: 'प्रगतिशील, मानवीय, स्वतंत्र व वैज्ञानिक सोच', statEn: 'Intellectual, scientific, liberal family', statHi: 'प्रबुद्ध, आधुनिक व सम्मानित परिवार' },
    11: { complexionEn: 'Soft fair, serene and dreamy eyes', complexionHi: 'सौम्य गौर, शांत व करुणामयी नेत्र', tempEn: 'Compassionate, spiritual, empathetic, creative', tempHi: 'दयालु, आध्यात्मिक, संवेदनशील व रचनात्मक', statEn: 'Spiritual, philanthropic, noble family', statHi: 'धार्मिक, परोपकारी व प्रतिष्ठित कुल' },
  };

  const traits = spouseSignTraits[seventhSignIdx] || spouseSignTraits[0];

  // Remarriage Yogas Evaluation
  const y1 = (seventhLord?.dignity === 'Debilitated' && (mars?.rasiHouseNumber === 7 || saturn?.rasiHouseNumber === 7)) || false;
  const y2 = (venus && [2, 5, 8, 11].includes(venus.signIndex) && (saturn?.rasiHouseNumber === 7 || venus.rasiHouseNumber === 7)) || false;
  const y3 = (mars && venus && Math.abs(mars.longitude - venus.longitude) < 10 && [7, 8].includes(mars.rasiHouseNumber)) || false;

  const remarriageYogas: RemarriageYoga[] = [
    {
      titleEn: 'Debilitated 7th Lord with Malefic Aspect (Stanza 7)',
      titleHi: 'सप्तमेश नीच व क्रूर ग्रह संबंध (श्लोक ७)',
      isActive: y1,
      descriptionEn: 'Indicates turbulence in first marriage requiring astrological maturity and remedial alignment.',
      descriptionHi: 'प्रथम विवाह में मतभेद अथवा विलंब; समझदारी व शास्त्रीय उपाय से दांपत्य सुरक्षित रहता है।',
    },
    {
      titleEn: 'Dual-Sign Venus with Saturn Contact (Stanza 10)',
      titleHi: 'द्विस्वभाव राशि में शुक्र व शनि प्रभाव (श्लोक १०)',
      isActive: y2,
      descriptionEn: 'Dual indications in emotional attachments; requires mutual transparency and dedication.',
      descriptionHi: 'भावनात्मक द्वंद्व संभव; आपसी विश्वास व स्पष्टता बनाए रखना आवश्यक है।',
    },
    {
      titleEn: 'Mars-Venus Conjunction in Sensitive Houses (Stanza 14)',
      titleHi: 'मंगल-शुक्र तीव्र काम योग (श्लोक १४)',
      isActive: y3,
      descriptionEn: 'Intense passion and romantic expectations; must be channelled into mutual respect.',
      descriptionHi: 'अत्यधिक भावनात्मक व दांपत्य अपेक्षाएं; परस्पर सम्मान व धैर्य अनिवार्य है।',
    },
  ];

  const hasMulti = remarriageYogas.some((y) => y.isActive);

  return {
    chandrabhilashaSphutaDeg: Math.round(chandraSphutaDeg * 100) / 100,
    chandrabhilashaSignEn: SIGNS[chandraSignIdx].name,
    chandrabhilashaSignHi: ['मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या', 'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुम्भ', 'मीन'][chandraSignIdx],
    chandrabhilashaTimingWindowEn: `Transit Jupiter or Moon entering ${SIGNS[chandraSignIdx].name} triggers golden marriage fruition milestones.`,
    chandrabhilashaTimingWindowHi: `गोचर गुरु अथवा चंद्र जब ${['मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या', 'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुम्भ', 'मीन'][chandraSignIdx]} राशि में प्रवेश करते हैं, विवाह वार्ता में सफलता प्राप्त होती है।`,
    spouseComplexionEn: traits.complexionEn,
    spouseComplexionHi: traits.complexionHi,
    spouseTemperamentEn: traits.tempEn,
    spouseTemperamentHi: traits.tempHi,
    spouseFamilyStatureEn: traits.statEn,
    spouseFamilyStatureHi: traits.statHi,
    remarriageYogas,
    hasMultipleMarriagesRisk: hasMulti,
    maritalHarmonyAdviceEn: hasMulti
      ? 'Perform Gauri-Shankara puja and ensure careful horoscope matching to preserve lifelong fidelity.'
      : 'Harmonious marital potential; mutual respect, understanding, and shared spiritual values will secure lifelong happiness.',
    maritalHarmonyAdviceHi: hasMulti
      ? 'गौरी-शंकर पूजा करें और पत्रिका मिलान के उपरांत विवाह करें ताकि दांपत्य जीवन अखंड व सुखद रहे।'
      : 'दांपत्य जीवन अत्यंत मधुर व सामंजस्यपूर्ण रहेगा; परस्पर सम्मान व प्रेम बना रहेगा।',
  };
}

// ─── 5. ASHTAKAVARGA SODYA PINDA LONGEVITY & 337 LIFE MAP ─────────────────────

export interface AshtakavargaLongevityReport {
  totalSodyaPinda: number;
  grossLongevityYears: number;
  netLongevityCategory: 'Alpayu (Under 32)' | 'Madhyayu (33–66)' | 'Purnayu (67–100+)';
  netLongevityCategoryHi: string;
  dharmaBindus: number; // H1, 5, 9
  arthaBindus: number;  // H2, 6, 10
  kamaBindus: number;   // H3, 7, 11
  mokshaBindus: number; // H4, 8, 12
  dominantPurusharthaEn: string;
  dominantPurusharthaHi: string;
  lifeMapSummaryEn: string;
  lifeMapSummaryHi: string;
  saturnAfflictionHouse: number;
  jupiterProsperityHouse: number;
}

export function computeAshtakavargaLongevityAndLifeMap(chart: ChartData): AshtakavargaLongevityReport {
  const sav = chart.ashtakavarga?.sarva || [];
  const safeSav = sav.length === 12 ? sav : [28, 30, 27, 32, 29, 28, 31, 26, 33, 27, 34, 25];

  const dharma = (safeSav[0] || 28) + (safeSav[4] || 29) + (safeSav[8] || 33);
  const artha = (safeSav[1] || 30) + (safeSav[5] || 28) + (safeSav[9] || 27);
  const kama = (safeSav[2] || 27) + (safeSav[6] || 31) + (safeSav[10] || 34);
  const moksha = (safeSav[3] || 32) + (safeSav[7] || 26) + (safeSav[11] || 25);

  let domEn = 'Artha Dominant (Material Prosperity & Wealth Creation)';
  let domHi = 'अर्थ प्रधान (धन, व्यापार व भौतिक समृद्धि)';
  let maxP = artha;

  if (dharma > maxP) {
    domEn = 'Dharma Dominant (Virtue, Moral Stature & Teaching)';
    domHi = 'धर्म प्रधान (सदाचार, विद्या व सामाजिक प्रतिष्ठा)';
    maxP = dharma;
  }
  if (kama > maxP) {
    domEn = 'Kama Dominant (Ambition, Relationships & Networking)';
    domHi = 'काम प्रधान (इच्छा पूर्ति, सामाजिक संबंध व महत्वाकांक्षा)';
    maxP = kama;
  }
  if (moksha > maxP) {
    domEn = 'Moksha Dominant (Inner Liberation, Tranquility & Wisdom)';
    domHi = 'मोक्ष प्रधान (आत्म-शांति, वैराग्य व आध्यात्मिक सिद्धि)';
  }

  // Sodya Pinda Estimate
  const totalSP = Math.round(safeSav.reduce((a: number, b: number) => a + b, 0) * 2.85); // approx 960 total Sodya Pinda points
  const rawYears = Math.min(95, Math.max(55, Math.round((totalSP * 7) / 85)));

  let lonCat: 'Alpayu (Under 32)' | 'Madhyayu (33–66)' | 'Purnayu (67–100+)' = 'Purnayu (67–100+)';
  let lonCatHi = 'पूर्णायु (६७ से १००+ वर्ष)';
  if (rawYears < 33) {
    lonCat = 'Alpayu (Under 32)';
    lonCatHi = 'अल्पायु (३२ वर्ष तक)';
  } else if (rawYears < 67) {
    lonCat = 'Madhyayu (33–66)';
    lonCatHi = 'मध्यायु (३३ से ६६ वर्ष)';
  }

  const sat = chart.planets.find((p) => p.id === 'Saturn');
  const jup = chart.planets.find((p) => p.id === 'Jupiter');

  return {
    totalSodyaPinda: totalSP,
    grossLongevityYears: rawYears,
    netLongevityCategory: lonCat,
    netLongevityCategoryHi: lonCatHi,
    dharmaBindus: dharma,
    arthaBindus: artha,
    kamaBindus: kama,
    mokshaBindus: moksha,
    dominantPurusharthaEn: domEn,
    dominantPurusharthaHi: domHi,
    lifeMapSummaryEn: `Out of 337 Sarvashtakavarga bindus, your chart channels energy predominantly into ${domEn}.`,
    lifeMapSummaryHi: `३३७ सर्व अष्टकवर्ग बिंदुओं में से आपकी कुंडली की प्राण ऊर्जा मुख्य रूप से ${domHi} में केंद्रित है।`,
    saturnAfflictionHouse: sat ? sat.rasiHouseNumber : 8,
    jupiterProsperityHouse: jup ? jup.rasiHouseNumber : 9,
  };
}

// ─── 6. TRIPATAKI CHAKRA & SPECIAL VEDHA CHAKRAS ──────────────────────────────

export interface TripatakiVedhaPoint {
  focusKey: 'Lagna' | 'Moon' | 'Sun';
  focusNameEn: string;
  focusNameHi: string;
  nakshatraName: string;
  isAfflicted: boolean;
  vedhaByPlanetEn: string;
  vedhaByPlanetHi: string;
  impactEn: string;
  impactHi: string;
}

export interface TripatakiChakraReport {
  lagnaFlag: TripatakiVedhaPoint;
  moonFlag: TripatakiVedhaPoint;
  sunFlag: TripatakiVedhaPoint;
  overallFlagSafetyScore: number; // 0..100
  annualForecastEn: string;
  annualForecastHi: string;
  protectiveRemedyEn: string;
  protectiveRemedyHi: string;
}

export function computeTripatakiChakra(chart: ChartData): TripatakiChakraReport {
  const moon = chart.planets.find((p) => p.id === 'Moon');
  const sun = chart.planets.find((p) => p.id === 'Sun');
  const saturn = chart.planets.find((p) => p.id === 'Saturn');
  const mars = chart.planets.find((p) => p.id === 'Mars');
  const rahu = chart.planets.find((p) => p.id === 'Rahu');

  const lNak = NAKSHATRAS[chart.ascendant ? chart.ascendant.nakshatraIndex : 0]?.name || 'Ashwini';
  const mNak = NAKSHATRAS[moon ? moon.nakshatraIndex : 3]?.name || 'Rohini';
  const sNak = NAKSHATRAS[sun ? sun.nakshatraIndex : 6]?.name || 'Punarvasu';

  // Check malefic aspects / vedhas
  const moonAfflicted = Boolean(saturn && Math.abs(saturn.signIndex - (moon?.signIndex || 0)) === 6) || Boolean(rahu && rahu.signIndex === (moon?.signIndex || 0));
  const sunAfflicted = Boolean(saturn && saturn.signIndex === (sun?.signIndex || 0)) || Boolean(mars && mars.signIndex === (sun?.signIndex || 0));
  const lagnaAfflicted = Boolean(mars && chart.ascendant && mars.signIndex === chart.ascendant.signIndex);

  let safety = 90;
  if (moonAfflicted) safety -= 25;
  if (sunAfflicted) safety -= 25;
  if (lagnaAfflicted) safety -= 25;

  return {
    lagnaFlag: {
      focusKey: 'Lagna',
      focusNameEn: 'Lagna Flag (Physical Constitution & Public Persona)',
      focusNameHi: 'लग्न ध्वजा (शारीरिक बल व व्यक्तित्व)',
      nakshatraName: lNak,
      isAfflicted: lagnaAfflicted,
      vedhaByPlanetEn: lagnaAfflicted ? 'Mars Vedha' : 'Free from malefic vedha',
      vedhaByPlanetHi: lagnaAfflicted ? 'मंगल का वेध प्रभाव' : 'वेध मुक्त व सुरक्षित',
      impactEn: lagnaAfflicted ? 'Caution against rash decisions or physical fatigue.' : 'Robust physical immunity and mental clarity.',
      impactHi: lagnaAfflicted ? 'अनावश्यक जल्दबाजी व शारीरिक थकान से बचें।' : 'उत्तम शारीरिक प्रतिरोधक क्षमता व स्पष्ट निर्णय शक्ति।',
    },
    moonFlag: {
      focusKey: 'Moon',
      focusNameEn: 'Chandra Flag (Emotional Equilibrium & Prosperity)',
      focusNameHi: 'चंद्र ध्वजा (मानसिक संतुलन व समृद्धि)',
      nakshatraName: mNak,
      isAfflicted: moonAfflicted,
      vedhaByPlanetEn: moonAfflicted ? 'Saturn/Rahu Vedha' : 'Auspicious benefic shield',
      vedhaByPlanetHi: moonAfflicted ? 'शनि/राहु का वेध प्रभाव' : 'शुभ ग्रहों का संरक्षण',
      impactEn: moonAfflicted ? 'Fluctuating moods or sudden anxieties; practice breathwork.' : 'Tranquil domestic atmosphere and emotional contentment.',
      impactHi: moonAfflicted ? 'मानसिक उद्वेग या अनिद्रा संभव; ध्यान व ॐ नमः शिवाय का जप करें।' : 'पारिवारिक सुख, शांति व मानसिक संतोष।',
    },
    sunFlag: {
      focusKey: 'Sun',
      focusNameEn: 'Surya Flag (Authority, Career & Soul Force)',
      focusNameHi: 'सूर्य ध्वजा (प्रतिष्ठा, करियर व आत्मबल)',
      nakshatraName: sNak,
      isAfflicted: sunAfflicted,
      vedhaByPlanetEn: sunAfflicted ? 'Martial/Saturnine Vedha' : 'Unobstructed royal brilliance',
      vedhaByPlanetHi: sunAfflicted ? 'शनि/मंगल का वेध प्रभाव' : 'सूर्य नारायण की निर्दोष कृपा',
      impactEn: sunAfflicted ? 'Patience required with superiors and administrative tasks.' : 'Steadfast career rise, public recognition, and leadership triumph.',
      impactHi: sunAfflicted ? 'अधिकारियों से संवाद में धैर्य रखें।' : 'करियर में पदोन्नति, सम्मान व सरकारी कार्यों में सफलता।',
    },
    overallFlagSafetyScore: Math.max(20, safety),
    annualForecastEn: safety >= 70
      ? 'The Tripataki Chakra reveals unhindered protective flags across all three focal points, guaranteeing progressive smooth sailing.'
      : 'Tripataki flags indicate occasional friction requiring disciplined routine and regular spiritual remedies.',
    annualForecastHi: safety >= 70
      ? 'त्रिपताकी चक्र के तीनों प्रमुख ध्वज सुरक्षित हैं, जो पूरे वर्ष निर्बाध प्रगति व सफलता का संकेत देते हैं।'
      : 'त्रिपताकी चक्र में आंशिक वेध प्रभाव है; नियमित साधना व धैर्य से कार्य सिद्ध होंगे।',
    protectiveRemedyEn: 'Chant Aditya Hridaya Stotra and Mahamrityunjaya Mantra on Sundays and Mondays.',
    protectiveRemedyHi: 'रविवार को आदित्य हृदय स्तोत्र तथा सोमवार को महामृत्युंजय मंत्र का पाठ करें।',
  };
}

// ─── 7. B.V. RAMAN MUNDANE & EARTHQUAKE RISK INDEX (0–35 SCALE) ───────────────

export interface EarthquakeRiskReport {
  score: number; // 0..35
  riskLevel: 'Low Risk' | 'Moderate Risk' | 'Elevated Risk' | 'High Risk';
  riskLevelHi: string;
  activeIndicatorsEn: string[];
  activeIndicatorsHi: string[];
  geophysicalSummaryEn: string;
  geophysicalSummaryHi: string;
}

export function computeMundaneEarthquakeRisk(chart: ChartData): EarthquakeRiskReport {
  const planets = chart.planets;
  let score = 0;
  const indEn: string[] = [];
  const indHi: string[] = [];

  const sun = planets.find((p) => p.id === 'Sun');
  const moon = planets.find((p) => p.id === 'Moon');
  const mercury = planets.find((p) => p.id === 'Mercury');
  const jupiter = planets.find((p) => p.id === 'Jupiter');
  const saturn = planets.find((p) => p.id === 'Saturn');
  const mars = planets.find((p) => p.id === 'Mars');

  // 1. Critical Indicators (Weight 3)
  if (moon && mercury && Math.abs(moon.longitude - mercury.longitude) < 6) {
    score += 3;
    indEn.push('Critical: Moon-Mercury exact conjunction / aspect (< 6° arc).');
    indHi.push('अति संवेदनशील: चंद्र-बुध की सूक्ष्म युति अथवा दृष्टि संबंध।');
  }

  if (jupiter && saturn) {
    const diff = Math.abs(jupiter.longitude - saturn.longitude);
    if (diff < 10 || Math.abs(diff - 180) < 10 || Math.abs(diff - 90) < 10) {
      score += 3;
      indEn.push('Critical: Jupiter-Saturn mutual Kendra or major aspect.');
      indHi.push('अति संवेदनशील: गुरु-शनि का परस्पर केंद्र अथवा मुख्य दृष्टि योग।');
    }
  }

  // 2. Strong Indicators (Weight 2)
  if (sun && moon) {
    const sunMoonDiff = Math.abs(sun.longitude - moon.longitude);
    if (sunMoonDiff < 12 || Math.abs(sunMoonDiff - 180) < 12) {
      score += 2;
      indEn.push('Strong: New Moon / Full Moon (Syzygy axis alignment).');
      indHi.push('प्रबल प्रभाव: अमावस्या अथवा पूर्णिमा की अक्षीय स्थिति।');
    }
  }

  const kendraCount = planets.filter((p) => [1, 4, 7, 10].includes(p.rasiHouseNumber)).length;
  if (kendraCount >= 4) {
    score += 2;
    indEn.push(`Strong: Massive planetary clustering in Kendra houses (${kendraCount} planets).`);
    indHi.push(`प्रबल प्रभाव: केंद्र भावों में भारी ग्रह जमावड़ा (${kendraCount} ग्रह)।`);
  }

  if (mars && saturn) {
    const msDiff = Math.abs(mars.longitude - saturn.longitude);
    if (msDiff < 10 || Math.abs(msDiff - 90) < 10 || Math.abs(msDiff - 180) < 10) {
      score += 2;
      indEn.push('Strong: Mars-Saturn harsh angular alignment.');
      indHi.push('प्रबल प्रभाव: मंगल-शनि का कठोर कोणीय संबंध।');
    }
  }

  // 3. Supporting Indicators (Weight 1)
  const retroCount = planets.filter((p) => p.isRetrograde && p.id !== 'Rahu' && p.id !== 'Ketu').length;
  if (retroCount >= 2) {
    score += 1;
    indEn.push(`Supporting: Multiple major planets retrograde (${retroCount} planets).`);
    indHi.push(`सहायक प्रभाव: एकाधिक प्रमुख ग्रहों की वक्री चाल (${retroCount} ग्रह)।`);
  }

  let rLevel: 'Low Risk' | 'Moderate Risk' | 'Elevated Risk' | 'High Risk' = 'Low Risk';
  let rLevelHi = 'अल्प तनाव (Low Risk 0–3)';
  if (score >= 8) {
    rLevel = 'High Risk';
    rLevelHi = 'उच्च भू-गर्भीय तनाव (High Risk 8+)';
  } else if (score >= 4) {
    rLevel = 'Moderate Risk';
    rLevelHi = 'मध्यम भू-गर्भीय तनाव (Moderate Risk 4–7)';
  }

  return {
    score: Math.min(35, score),
    riskLevel: rLevel,
    riskLevelHi: rLevelHi,
    activeIndicatorsEn: indEn.length > 0 ? indEn : ['No critical tectonic alignment triggers detected.'],
    activeIndicatorsHi: indHi.length > 0 ? indHi : ['कोई गंभीर भू-गर्भीय तनाव संरेखण उपस्थित नहीं है।'],
    geophysicalSummaryEn: `Dr. B.V. Raman's empirical mundane model indicates a score of ${score}/35 (${rLevel}). Planetary energies remain in safe balance.`,
    geophysicalSummaryHi: `डॉ. बी. वी. रमन के मेदिनी शोध मॉडल के अनुसार भू-गर्भीय तनाव सूचकांक ${score}/३५ (${rLevelHi}) है।`,
  };
}

// ─── MASTER PRASNA MARGA SUITE SYNTHESIS ──────────────────────────────────────

export interface MasterPrasnaMargaReport {
  medical: PrasnaMedicalReport;
  progeny: ProgenyReport;
  badhaka: BadhakaReport;
  spouse: VivahaSpouseReport;
  ashtakavarga: AshtakavargaLongevityReport;
  tripataki: TripatakiChakraReport;
  mundane: EarthquakeRiskReport;
}

export function computeMasterPrasnaMargaReport(chart: ChartData): MasterPrasnaMargaReport {
  return {
    medical: computePrasnaMargaMedical(chart),
    progeny: computeFertilityAndProgeny(chart),
    badhaka: computeBadhakaAndDeities(chart),
    spouse: computeSpouseAndVivahaAnalysis(chart),
    ashtakavarga: computeAshtakavargaLongevityAndLifeMap(chart),
    tripataki: computeTripatakiChakra(chart),
    mundane: computeMundaneEarthquakeRisk(chart),
  };
}
