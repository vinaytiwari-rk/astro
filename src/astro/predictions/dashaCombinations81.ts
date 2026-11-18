/**
 * 81 Mahadasha-Antardasha Deep Combination Engine (81 महादशा-अंतर्दशा विस्तृत संयुक्त फलकथन)
 * AV Astro Vibe — 100% Offline, Zero External API Dependency
 *
 * Evaluates the exact mutual angular relationship (Sambandha) between MD Lord and AD Lord:
 * - 1/7 Axis (Saptama - direct aspect / public partnership)
 * - 5/9 Axis (Trikona - auspicious fortune & spiritual grace)
 * - 3/11 Axis (Upachaya - enterprise, courage & incremental gains)
 * - 4/10 Axis (Kendra - institutional authority & domestic duties)
 * - 6/8 Axis (Shadashtaka - acute dispute, health challenge or sudden reversal)
 * - 2/12 Axis (Dvi-Dwadasha - financial drain, relocation or heavy expenditure)
 * - 1/1 Conjunction (Yuti - intense blending of energies)
 */

import { normalizeDeg } from '../time';
import type { ChartData, NineGrahaId } from '../types';

export interface DashaCombinationPrediction {
  mdLord: NineGrahaId;
  adLord: NineGrahaId;
  mdLordHi: string;
  adLordHi: string;
  mutualAxis: '1/1 (Yuti)' | '1/7 (Samasaptaka)' | '5/9 (Navapanchama)' | '3/11 (Labha)' | '4/10 (Kendra)' | '6/8 (Shadashtaka)' | '2/12 (Dvi-Dwadasha)';
  mutualAxisHi: 'युति (१/१)' | 'समसप्तक (१/७)' | 'नवपंचम (५/९)' | 'उपचय (३/११)' | 'केंद्राधिपत्य (४/१०)' | 'षडाष्टक (६/८)' | 'द्वि-द्वादश (२/१२)';
  generalThemeEn: string;
  generalThemeHi: string;
  careerImpactEn: string;
  careerImpactHi: string;
  wealthImpactEn: string;
  wealthImpactHi: string;
  healthFamilyEn: string;
  healthFamilyHi: string;
  unvarnishedRealityEn: string;
  unvarnishedRealityHi: string;
  classicalRemedyEn: string;
  classicalRemedyHi: string;
}

const PLANET_NAMES_HI: Record<NineGrahaId, string> = {
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

// Classical MD-AD Matrix Templates
export function getDashaCombinationInsight(
  chart: ChartData,
  mdLord: NineGrahaId,
  adLord: NineGrahaId
): DashaCombinationPrediction {
  const p1 = chart.planets.find((p) => p.id === mdLord);
  const p2 = chart.planets.find((p) => p.id === adLord);

  const ascSign = chart.ascendant.signIndex;

  const s1 = p1 ? Math.floor(normalizeDeg(p1.longitude) / 30) : 0;
  const s2 = p2 ? Math.floor(normalizeDeg(p2.longitude) / 30) : 0;

  // Mutual house difference from p1 to p2 (1..12)
  const diffFromP1 = ((s2 - s1 + 12) % 12) + 1;

  let axis: DashaCombinationPrediction['mutualAxis'] = '1/1 (Yuti)';
  let axisHi: DashaCombinationPrediction['mutualAxisHi'] = 'युति (१/१)';

  if (diffFromP1 === 1) {
    axis = '1/1 (Yuti)';
    axisHi = 'युति (१/१)';
  } else if (diffFromP1 === 7) {
    axis = '1/7 (Samasaptaka)';
    axisHi = 'समसप्तक (१/७)';
  } else if (diffFromP1 === 5 || diffFromP1 === 9) {
    axis = '5/9 (Navapanchama)';
    axisHi = 'नवपंचम (५/९)';
  } else if (diffFromP1 === 3 || diffFromP1 === 11) {
    axis = '3/11 (Labha)';
    axisHi = 'उपचय (३/११)';
  } else if (diffFromP1 === 4 || diffFromP1 === 10) {
    axis = '4/10 (Kendra)';
    axisHi = 'केंद्राधिपत्य (४/१०)';
  } else if (diffFromP1 === 6 || diffFromP1 === 8) {
    axis = '6/8 (Shadashtaka)';
    axisHi = 'षडाष्टक (६/८)';
  } else if (diffFromP1 === 2 || diffFromP1 === 12) {
    axis = '2/12 (Dvi-Dwadasha)';
    axisHi = 'द्वि-द्वादश (२/१२)';
  }

  const mdHi = PLANET_NAMES_HI[mdLord];
  const adHi = PLANET_NAMES_HI[adLord];

  // Specific Shastric Synthesis
  let generalEn = '';
  let generalHi = '';
  let careerEn = '';
  let careerHi = '';
  let wealthEn = '';
  let wealthHi = '';
  let healthEn = '';
  let healthHi = '';
  let realityEn = '';
  let realityHi = '';
  let remedyEn = '';
  let remedyHi = '';

  if (axis === '6/8 (Shadashtaka)') {
    generalEn = `${mdLord} Mahadasha and ${adLord} Antardasha occupy a mutually antagonistic 6/8 (Shadashtaka) axis, producing friction, unforeseen disputes, and testing of endurance.`;
    generalHi = `${mdHi} महादशा एवं ${adHi} अंतर्दशा का परस्पर षडाष्टक (६/८) संबंध होने से यह कालखंड अप्रत्याशित संघर्ष, विरोधियों के षड्यंत्र और धैर्य की परीक्षा का समय रहेगा।`;
    careerEn = 'Workplace disagreements, unexpected transfers, delays in expected promotions, or friction with superiors.';
    careerHi = 'कार्यक्षेत्र में उच्चाधिकारियों से मतभेद, स्थान परिवर्तन, तथा मेहनत के अनुरूप पदोन्नति में विलंब का सामना करना पड़ सकता है।';
    wealthEn = 'Sudden financial leakages, litigation expenses, or delayed repayments from debtors.';
    wealthHi = 'अचानक अनियोजित खर्च, कर्ज की अदायगी में दबाव, अथवा किसी पुराने विवाद पर व्यय का योग।';
    healthEn = 'Vulnerability to inflammatory ailments, indigestion, stress headaches, and disturbed sleep patterns.';
    healthHi = 'पित्त प्रकोप, उदर विकार, सिरदर्द एवं मानसिक व्यग्रता के कारण अनिद्रा की संभावना।';
    realityEn = 'Unvarnished Truth: Compromise and patience are your only shields; aggressive confrontation during this phase will only lead to legal or financial injury.';
    realityHi = 'कड़वी सच्चाई: इस अवधि में उग्र प्रतिक्रिया या अहंकार विनाशकारी सिद्ध होगा; मौन, कूटनीति और कानूनी सावधानी ही रक्षा करेगी।';
    remedyEn = 'Recite Maha Mrityunjaya Mantra 108 times daily and donate black sesame or mustard oil on Saturdays.',
    remedyHi = 'प्रतिदिन 108 बार महामृत्युंजय मंत्र का जप करें तथा शनिवार को काले तिल व सरसों के तेल का दान करें।';
  } else if (axis === '2/12 (Dvi-Dwadasha)') {
    generalEn = `${mdLord} and ${adLord} stand in a 2/12 Dvi-Dwadasha relationship, driving substantial expenses, distant relocation, or severance of outdated commitments.`;
    generalHi = `${mdHi} और ${adHi} का परस्पर द्वि-द्वादश (२/१२) संबंध भारी व्यय, सुदूर यात्रा अथवा पुराने बंधनों से मुक्ति का संकेत देता है।`;
    careerEn = 'Foreign assignments, distant travels, or heavy initial expenditure in starting new initiatives.';
    careerHi = 'सुदूर स्थानों की यात्राएं, विदेशी परियोजनाओं में संलग्नता, अथवा नए उपक्रमों में भारी प्रारंभिक पूंजी निवेश।';
    wealthEn = 'Money flows in but flows out equally fast into real estate, healthcare, or family obligations.';
    wealthHi = 'धन का आवागमन तो रहेगा किंतु बचत न के बराबर होगी; आय से अधिक व्यय का संतुलन बनाए रखना कठिन होगा।';
    healthEn = 'Eye strain, physical fatigue, and susceptibility to foot or ankle discomfort.';
    healthHi = 'नेत्र विकार, अनिद्रा, तथा पैरों व जोड़ों में थकान या दर्द का अनुभव।';
    realityEn = 'Unvarnished Truth: Do not lend money to relatives or acquaintances during this phase, as recovery is virtually impossible.';
    realityHi = 'कड़वी सच्चाई: इस अवधि में किसी भी निकट संबंधी या मित्र को कर्ज न दें, अन्यथा धन की वापसी असंभव हो जाएगी।';
    remedyEn = 'Donate food grains to the underprivileged and chant Gayatri Mantra at dawn.',
    remedyHi = 'जरूरतमंदों को अन्न का दान करें तथा प्रातः काल गायत्री मंत्र का एक माला जप करें।';
  } else if (axis === '5/9 (Navapanchama)') {
    generalEn = `${mdLord} and ${adLord} form the supreme Navapanchama (5/9) fortune trine, unlocking divine protection, auspicious ceremonies, and creative breakthroughs.`;
    generalHi = `${mdHi} और ${adHi} का परस्पर नवपंचम (५/९) त्रिकोण संबंध भाग्योदय, धार्मिक अनुष्ठान, एवं आत्मिक शांति का स्वर्ण काल निर्मित करता है।`;
    careerEn = 'Recognition of long-standing merit, academic honours, mentors offering vital patronage, and high professional prestige.';
    careerHi = 'प्रतिभा का सार्वजनिक सम्मान, उच्च पद पर आसीन मार्गदर्शकों का वरदहस्त, तथा बौद्धिक कार्यों में भारी ख्याति।';
    wealthEn = 'Prosperous financial expansion through ethical enterprises, wise investments, and ancestral gifts.';
    wealthHi = 'सात्विक व्यापार, सुविचारित निवेश तथा पैतृक संपत्ति से स्थायी धन लाभ और समृद्धि।';
    healthEn = 'Robust vitality, emotional composure, and successful recovery from any past chronic weakness.';
    healthHi = 'उत्कृष्ट शारीरिक ऊर्जा, मानसिक प्रसन्नता तथा पुराने रोगों से मुक्ति का शुभ काल।';
    realityEn = 'Unvarnished Truth: Complacency is the only danger; do not let good fortune make you arrogant or lazy.';
    realityHi = 'कड़वी सच्चाई: इस शुभ काल में आलस्य या अहंकार से बचें; भाग्य का लाभ उठाकर भविष्य की नींव मजबूत करें।';
    remedyEn = 'Offer yellow flowers to Lord Vishnu or perform Rudrabhishek with sugarcane juice.',
    remedyHi = 'भगवान विष्णु को पीले पुष्प अर्पित करें अथवा गन्ने के रस से शिवलिंग का अभिषेक करें।';
  } else if (axis === '3/11 (Labha)') {
    generalEn = `${mdLord} and ${adLord} form the dynamic 3/11 Upachaya axis, where relentless personal courage directly translates into substantial material rewards.`;
    generalHi = `${mdHi} और ${adHi} का ३/११ उपचय संबंध जातक के व्यक्तिगत पराक्रम, बाहुबल और संपर्कों से प्रचुर लाभ का योग बनाता है।`;
    careerEn = 'Successful independent ventures, flourishing digital or networking contacts, and competitive triumph over rivals.';
    careerHi = 'स्वतंत्र उद्यम में सफलता, जनसंपर्क से नए अवसर, तथा प्रतियोगिताओं में प्रतिद्वंद्वियों पर निर्णायक विजय।';
    wealthEn = 'Steady increment in liquid assets, realization of long-awaited bonuses, and lucrative short-distance business deals.';
    wealthHi = 'तरल संपत्ति में निरंतर वृद्धि, लंबे समय से रुके हुए धन की प्राप्ति, तथा व्यावसायिक अनुबंधों से लाभ।';
    healthEn = 'High stamina and vigor; minor susceptibility to shoulder, arm, or throat fatigue.';
    healthHi = 'उच्च शारीरिक स्फूर्ति एवं पराक्रम; कंधे या कंठ में हल्की थकावट संभव।';
    realityEn = 'Unvarnished Truth: Nothing comes on a silver platter here; every rupee earned will demand sweat and strategic planning.';
    realityHi = 'कड़वी सच्चाई: यहां बिना कर्म के कुछ नहीं मिलेगा; हर सफलता आपके कठोर परिश्रम और रणनीति पर निर्भर करेगी।';
    remedyEn = 'Recite Hanuman Chalisa or Aditya Hridaya Stotra to preserve unbroken stamina.',
    remedyHi = 'नित्य हनुमान चालीसा अथवा आदित्य हृदय स्तोत्र का पाठ कर अपने पराक्रम को बनाए रखें।';
  } else if (axis === '4/10 (Kendra)') {
    generalEn = `${mdLord} and ${adLord} hold an authoritative 4/10 Kendra axis, balancing domestic duties with extensive professional status and public responsibility.`;
    generalHi = `${mdHi} और ${adHi} का ४/१० केंद्राधिपत्य संबंध घरेलू दायित्वों और सामाजिक-प्रशासनिक सत्ता के बीच संतुलन की मांग करता है।`;
    careerEn = 'Appointment to leadership boards, acquisition of government contracts, or spearheading institutional initiatives.';
    careerHi = 'प्रशासनिक अधिकार की प्राप्ति, उच्च पदों पर नियुक्ति, तथा कार्यक्षेत्र में प्रमुख नीतिगत निर्णय लेने का अवसर।';
    wealthEn = 'Substantial investment in real estate, building renovation, or acquiring modern vehicles and machinery.';
    wealthHi = 'भूमि, मकान के निर्माण या नवीनीकरण में बड़ा निवेश तथा आधुनिक सुख-सुविधाओं का संचय।';
    healthEn = 'Cardiovascular strain and blood pressure fluctuations caused by relentless workload.';
    healthHi = 'कार्य के अत्यधिक दबाव के कारण रक्तचाप में उतार-चढ़ाव एवं मानसिक थकान से बचाव रखें।';
    realityEn = 'Unvarnished Truth: Work-life balance will severely tilt toward public obligations; home members may complain of emotional neglect.';
    realityHi = 'कड़वी सच्चाई: पारिवारिक जीवन की उपेक्षा हो सकती है; परिजनों की शिकायतों को धैर्य से सुलझाना होगा।';
    remedyEn = 'Feed cows with green fodder on Wednesdays and respect maternal elders.',
    remedyHi = 'गौमाता को हरा चारा खिलाएं तथा माता व बुजुर्गों का नित्य चरण स्पर्श कर आशीर्वाद लें।';
  } else if (axis === '1/7 (Samasaptaka)') {
    generalEn = `${mdLord} and ${adLord} gaze at each other in a direct 1/7 Samasaptaka polarity, thrusting partnerships, marriage, and public visibility into sharp focus.`;
    generalHi = `${mdHi} और ${adHi} का आमने-सामने समसप्तक (१/७) संबंध दांपत्य, व्यापारिक साझेदारी एवं जनसंपर्क को केंद्र में ला देता है।`;
    careerEn = 'Dynamic collaborative contracts, client-facing success, and expansion through joint ventures.';
    careerHi = 'साझेदारी में व्यापारिक विस्तार, ग्राहकों के साथ मजबूत संबंध, तथा जन-समूह के बीच प्रतिष्ठा।';
    wealthEn = 'Financial gains shared with spouse or business partner; legal agreements must be rigorously drafted.';
    wealthHi = 'साझेदारों या जीवनसाथी के सहयोग से धनोपार्जन; अनुबंधों में पारदर्शिता बनाए रखना अनिवार्य है।';
    healthEn = 'Vulnerabilities in reproductive or urinary systems; drink ample pure water.',
    healthHi = 'मूत्र या जननांग संबंधी संवेदनशीलता; जल का पर्याप्त सेवन करें और स्वच्छता का ध्यान रखें।';
    realityEn = 'Unvarnished Truth: You cannot run this show solo; either learn to share the spotlight or prepare for bitter friction with partners.',
    realityHi = 'कड़वी सच्चाई: आप अकेले सब कुछ नहीं चला सकते; सहयोगियों को सम्मान दें अन्यथा साझेदारी में दरार आ जाएगी।';
    remedyEn = 'Light a pure ghee lamp before Goddess Lakshmi and chant Sri Suktam on Fridays.',
    remedyHi = 'शुक्रवार को संध्या काल में मां लक्ष्मी के समक्ष गाय के घी का दीपक प्रज्वलित कर श्रीसूक्त का पाठ करें।';
  } else {
    // 1/1 Yuti
    generalEn = `${mdLord} and ${adLord} merge their energies in direct conjunction (1/1), producing an intense focal point that governs your entire consciousness.`;
    generalHi = `${mdHi} और ${adHi} की एक ही भाव में युति (१/१) ऊर्जा का ऐसा तीव्र संगम बनाती है जो आपके पूरे जीवन दृष्टिकोण को रूपांतरित कर देती है।`;
    careerEn = 'Concentrated effort in a single domain, rapid mastery of complex skills, and clear personal branding.';
    careerHi = 'एक ही लक्ष्य पर एकाग्र प्रयास, तकनीकी या बौद्धिक दक्षता, तथा स्वयं के नाम से पहचान।';
    wealthEn = 'Money tied directly to individual enterprise and specialized skill sets.';
    wealthHi = 'व्यक्तिगत प्रतिभा और कौशल से सीधा धनोपार्जन; दूसरों पर निर्भरता समाप्त होगी।';
    healthEn = 'Headaches, high energy surges, and periodic physical burnout if rest is neglected.';
    healthHi = 'अत्यधिक मानसिक सक्रियता के कारण सिर में भारीपन; पर्याप्त विश्राम लेना अनिवार्य है।';
    realityEn = 'Unvarnished Truth: Tunnel vision can blind you to peripheral opportunities; step back periodically to see the wider horizon.',
    realityHi = 'कड़वी सच्चाई: अत्यधिक एकाग्रता से अन्य महत्वपूर्ण अवसर छूट सकते हैं; समय-समय पर समग्र स्थिति का पुनरावलोकन करें।';
    remedyEn = 'Meditate for 15 minutes at dawn and practice Pranayama to balance the vital currents.',
    remedyHi = 'नित्य प्रातःकाल 15 मिनट ध्यान और प्राणायाम करें जिससे ग्रहीय ऊर्जा संतुलित रहे।';
  }

  return {
    mdLord,
    adLord,
    mdLordHi: mdHi,
    adLordHi: adHi,
    mutualAxis: axis,
    mutualAxisHi: axisHi,
    generalThemeEn: generalEn,
    generalThemeHi: generalHi,
    careerImpactEn: careerEn,
    careerImpactHi: careerHi,
    wealthImpactEn: wealthEn,
    wealthImpactHi: wealthHi,
    healthFamilyEn: healthEn,
    healthFamilyHi: healthHi,
    unvarnishedRealityEn: realityEn,
    unvarnishedRealityHi: realityHi,
    classicalRemedyEn: remedyEn,
    classicalRemedyHi: remedyHi,
  };
}
