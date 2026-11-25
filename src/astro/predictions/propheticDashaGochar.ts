/**
 * AV Astro Vibe — Prophetic Dasha & Gochar Event Synthesis Engine
 * 
 * Generates dynamic, chart-specific, second-person ("You / आप") prophecies for:
 * 1. Active Vimshottari Mahadasha-Antardasha-Pratyantardasha (Career, Wealth, Health, Family, Remedies)
 * 2. Real-time Transit (Gochar) Roadmap (Jupiter, Saturn, Rahu-Ketu, Double Transit, Sade Sati, SAV Bindus)
 * 
 * Strictly classical Parashari & Phaladeepika dictums. ZERO emojis.
 */

import type { ChartData, NineGrahaId, SevenPlanetId } from '../types';
import type { DashaPrediction, TransitForecast } from './types';
import type { DeepGocharReport } from './gocharDeep';
import { NINE_GRAHAS, SEVEN_PLANETS, SIGNS } from '../constants';

const GRAHA_HI: Record<string, string> = {
  Sun: 'सूर्य',
  Moon: 'चंद्रमा',
  Mars: 'मंगल',
  Mercury: 'बुध',
  Jupiter: 'बृहस्पति',
  Venus: 'शुक्र',
  Saturn: 'शनि',
  Rahu: 'राहु',
  Ketu: 'केतु',
};

export interface PropheticDashaEvents {
  headlineEn: string;
  headlineHi: string;
  careerEventEn: string;
  careerEventHi: string;
  wealthEventEn: string;
  wealthEventHi: string;
  healthFamilyEventEn: string;
  healthFamilyEventHi: string;
  dashaActionPlanEn: string;
  dashaActionPlanHi: string;
  auspiciousScore: number;
}

export interface PropheticTransitRoadmap {
  headlineEn: string;
  headlineHi: string;
  overallNarrativeEn: string;
  overallNarrativeHi: string;
  jupiterProphecyEn: string;
  jupiterProphecyHi: string;
  saturnProphecyEn: string;
  saturnProphecyHi: string;
  rahuKetuProphecyEn: string;
  rahuKetuProphecyHi: string;
  doubleTransitHighlightEn: string;
  doubleTransitHighlightHi: string;
}

export function computePropheticDashaEvents(
  chart: ChartData,
  dasha: DashaPrediction
): PropheticDashaEvents {
  const md = dasha.mahadashaLord;
  const ad = dasha.antardashaLord;
  const mdHi = GRAHA_HI[md] || md;
  const adHi = GRAHA_HI[ad] || ad;

  const mdPlaced = dasha.mdPlacedHouse || 1;
  const adPlaced = dasha.adPlacedHouse || 1;
  const mdHouses = dasha.mdHousesRuled || [];
  const adHouses = dasha.adHousesRuled || [];
  const allRuled = [...mdHouses, ...adHouses];

  const isKendraTrikona =
    [1, 4, 7, 10, 5, 9].includes(mdPlaced) && [1, 4, 7, 10, 5, 9].includes(adPlaced);
  const isDusthana = [6, 8, 12].includes(mdPlaced) || [6, 8, 12].includes(adPlaced);
  const isDhanaAxis = allRuled.includes(2) || allRuled.includes(11) || allRuled.includes(9) || allRuled.includes(5);
  const isKarmaAxis = allRuled.includes(10) || allRuled.includes(1) || mdPlaced === 10 || adPlaced === 10;

  const is68or212 =
    dasha.mutualRelation.includes('6-8') ||
    dasha.mutualRelation.includes('2-12') ||
    (dasha.mutualAxis && !dasha.mutualAxis.isAuspicious);

  let score = 65;
  if (isKendraTrikona) score += 15;
  if (isDhanaAxis) score += 10;
  if (isKarmaAxis) score += 10;
  if (isDusthana) score -= 15;
  if (is68or212) score -= 15;
  score = Math.max(25, Math.min(95, score));

  // 1. Headline
  const headlineEn = is68or212
    ? `${md}-${ad} Period: Strategic Restructuring, Endurance Under Scrutiny & Focused Realignment`
    : score >= 75
    ? `${md}-${ad} Period: Breakthrough Momentum, Executive Elevation & Compounding Prosperity`
    : `${md}-${ad} Period: Steady Expansion Through Disciplined Focus & Skill Consolidation`;

  const headlineHi = is68or212
    ? `${mdHi}-${adHi} काल: रणनीतिक पुनर्गठन, धैर्य व सतर्कता द्वारा परिस्थितियों पर विजय`
    : score >= 75
    ? `${mdHi}-${adHi} काल: भाग्य वृद्धि, पद-प्रतिष्ठा में तीव्र उछाल एवं प्रचुर आर्थिक लाभ`
    : `${mdHi}-${adHi} काल: निरंतर परिश्रम, कौशल विकास एवं संतुलित प्रगति का फलित काल`;

  // 2. Career & Authority
  let careerEventEn = '';
  let careerEventHi = '';
  if (isKarmaAxis || isKendraTrikona) {
    careerEventEn = `Your vocational sphere enters an active ascendancy phase under ${md}-${ad}. Placed in Houses ${mdPlaced} and ${adPlaced}, this planetary pairing activates professional authority, elevation in corporate or institutional rank, and the successful negotiation of high-value mandates. Exercise decisive command without second-guessing your competence.`;
    careerEventHi = `${mdHi}-${adHi} के प्रभाव से आपका कार्यक्षेत्र तीव्र उन्नति के दौर में प्रवेश कर रहा है। कुंडली के भाव ${mdPlaced} व ${adPlaced} की सक्रियता से पदोन्नति, प्रशासनिक अधिकार में वृद्धि एवं प्रतिष्ठित अनुबंधों की प्राप्ति के प्रबल योग हैं। अपनी कार्यक्षमता पर पूर्ण विश्वास रखकर नेतृत्व संभालें।`;
  } else if (is68or212) {
    careerEventEn = `In your career, ${md}-${ad} demands tactical diplomacy. Because these lords operate in a ${dasha.mutualRelation} axis, expect sudden shifts in organizational hierarchy or friction with peers. Victory comes through bulletproof documentation, emotional composure under pressure, and refusing to enter avoidable workplace conflicts.`;
    careerEventHi = `कार्यक्षेत्र में ${mdHi}-${adHi} की युति कूटनीतिक संयम की मांग करती है। पारस्परिक ${dasha.mutualRelation} संबंध के कारण कार्यस्थल पर नीतिगत मतभेद अथवा अतिरिक्त दायित्व का दबाव संभव है। विवादों से दूर रहकर अपने कार्य की गुणवत्ता एवं गोपनीयता बनाए रखें; अंततः आपकी निष्ठा की विजय होगी।`;
  } else {
    careerEventEn = `Your professional life proceeds with steady, compounding gains under ${md}-${ad}. Responsibilities expand proportionally with your demonstrated reliability, opening doors for lateral growth, specialized technical training, and expanding your professional network.`;
    careerEventHi = `${mdHi}-${adHi} काल में आपकी आजीविका संतुलित व सुदृढ़ रूप से आगे बढ़ेगी। आपके द्वारा किए गए पूर्व परिश्रम का यथोचित मूल्यांकन होगा और नए संपर्कों व विशेषज्ञ प्रशिक्षण द्वारा भविष्य के लिए मजबूत आधार तैयार होगा।`;
  }

  // 3. Wealth & Assets
  let wealthEventEn = '';
  let wealthEventHi = '';
  if (isDhanaAxis && !is68or212) {
    wealthEventEn = `Capital inflows and treasury expansion are strongly indicated. Connecting Dhana and Labha houses (${allRuled.filter((h) => [2, 5, 9, 11].includes(h)).join(', ') || 'auspicious trines'}), this period favors liquid investment compounding, settlement of lingering receivables, and strategic capital allocation into durable real estate or commercial assets.`;
    wealthEventHi = `आर्थिक दृष्टिकोण से यह कालखंड संचित कोष एवं नियमित आय में उल्लेखनीय वृद्धि का संकेत देता है। धन व लाभ भावों के सक्रिय होने से व्यापारिक मुनाफ़ा, बकाया धन की वसूली एवं स्थायी परिसंपत्तियों में पूंजी निवेश के अत्यंत अनुकूल अवसर प्राप्त होंगे।`;
  } else if (is68or212 || isDusthana) {
    wealthEventEn = `Financial management requires disciplined caution. While inflows remain operational, sudden unplanned domestic or healthcare expenditures may arise. Avoid speculative high-leverage gambles, unverified partnerships, or signing guarantees for third parties during this window.`;
    wealthEventHi = `आर्थिक मामलों में अत्यधिक सतर्कता बरतने की आवश्यकता है। आकस्मिक घरेलू अथवा स्वास्थ्य संबंधी खर्चों के योग बन सकते हैं। इस समय किसी भी प्रकार के सट्टे, अनुचित जोखिम अथवा बिना सोचे-समझे किए गए बड़े ऋण-लेनदेन से पूर्णतः दूर रहें।`;
  } else {
    wealthEventEn = `Financial stability is maintained through steady, predictable cash flows. Budgetary prudence allows you to fortify emergency reserves while methodically eliminating lingering obligations.`;
    wealthEventHi = `नियमित आय के स्रोत सुचारु बने रहेंगे। विवेकपूर्ण वित्तीय प्रबंधन द्वारा आप बचत को संचित करने और पुराने वित्तीय दायित्वों को क्रमबद्ध रूप से पूरा करने में सक्षम होंगे।`;
  }

  // 4. Health & Family Equilibrium
  let healthFamilyEventEn = '';
  let healthFamilyEventHi = '';
  if (isDusthana || is68or212) {
    healthFamilyEventEn = `Protecting your nervous stamina and metabolic equilibrium is essential. The placement of ${md} in House ${mdPlaced} and ${ad} in House ${adPlaced} signals a need to pace workload, prioritize restorative sleep, and avoid digestive inflammation through disciplined nutrition. In family life, patient listening dissolves misunderstandings before they crystallize.`;
    healthFamilyEventHi = `शारीरिक ऊर्जा व मानसिक शांति का विशेष ध्यान रखें। भाव ${mdPlaced} व ${adPlaced} के प्रभाववश कार्यभार की अधिकता से मानसिक तनाव या पाचन/पित्त विकार की संभावना बनती है। खान-पान में सात्विकता और नियमित दिनचर्या अपनाएं। पारिवारिक संवाद में धैर्य रखने से आपसी सौहार्द बना रहेगा।`;
  } else {
    healthFamilyEventEn = `Domestic harmony and personal vitality remain resilient. Celebrations, family gatherings, or the welcoming of auspicious occasions bring emotional satisfaction. Your physical constitution supports energetic pursuits and constructive physical conditioning.`;
    healthFamilyEventHi = `पारिवारिक वातावरण में सुख, शांति एवं मांगलिक उत्सवों का आयोजन संभव होगा। आपका स्वास्थ्य उत्तम रहेगा और सकारात्मक ऊर्जा के संचार से आप जटिल पारिवारिक व सामाजिक दायित्वों को सहजता से पूर्ण कर सकेंगे।`;
  }

  // 5. Action Plan & Shastric Upaya
  const dashaActionPlanEn = is68or212
    ? `Shastric Remedial Directive: Recite the sacred Kavacha or Stotra of ${md} and ${ad}. Engage in silent Saturday/Tuesday charity of black sesame, whole grains, or lighting a sesame-oil lamp at dusk to harmonize axial friction.`
    : `Shastric Harmonization Directive: Offer regular prayers to your Ishta Devata. Chanting the Gayatri Mantra at dawn and honoring elders or teachers during this period magnetically amplifies your auspicious dasha fruition.`;

  const dashaActionPlanHi = is68or212
    ? `शास्त्रीय उपाय निर्देश: ${mdHi} एवं ${adHi} के बीज मंत्र अथवा स्तोत्र का नित्य पाठ करें। शनिवार अथवा मंगलवार को तिल के तेल का दीपक प्रज्वलित करें एवं असहायों को अन्न/वस्त्र का गुप्त दान देकर पारस्परिक अक्षीय दोष का शमन करें।`
    : `शास्त्रीय उपाय निर्देश: अपने इष्टदेव की नियमित आराधना करें। प्रातःकाल सूर्य को अर्घ्य देना एवं गुरुजनों का आशीर्वाद लेना इस शुभ दशा काल के फलोदय को कई गुना बढ़ा देगा।`;

  return {
    headlineEn,
    headlineHi,
    careerEventEn,
    careerEventHi,
    wealthEventEn,
    wealthEventHi,
    healthFamilyEventEn,
    healthFamilyEventHi,
    dashaActionPlanEn,
    dashaActionPlanHi,
    auspiciousScore: score,
  };
}

export function computePropheticTransitRoadmap(
  chart: ChartData,
  deepGochar: DeepGocharReport,
  transitForecast: TransitForecast
): PropheticTransitRoadmap {
  const moon = chart.planets.find((p) => p.id === 'Moon');
  const moonSign = moon ? moon.signIndex : 0;
  const lagnaSign = chart.ascendant.signIndex;

  const jupItem = deepGochar.items.find((x: { planet: string }) => x.planet === 'Jupiter');
  const satItem = deepGochar.items.find((x: { planet: string }) => x.planet === 'Saturn');
  const rahuItem = deepGochar.items.find((x: { planet: string }) => x.planet === 'Rahu');
  const ketuItem = deepGochar.items.find((x: { planet: string }) => x.planet === 'Ketu');

  const jupHouseFromMoon = jupItem?.houseFromMoon ?? 1;
  const satHouseFromMoon = satItem?.houseFromMoon ?? 1;
  const jupHouseFromLagna = jupItem?.houseFromLagna ?? 1;
  const satHouseFromLagna = satItem?.houseFromLagna ?? 1;

  const doubleTransitHouses = deepGochar.doubleTransitHouses || [];
  const sadeSati = transitForecast.sadeSatiStatus;

  // Jupiter transit narrative
  let jupiterProphecyEn = '';
  let jupiterProphecyHi = '';
  const isJupFavorable = [2, 5, 7, 9, 11].includes(jupHouseFromMoon);
  if (isJupFavorable) {
    jupiterProphecyEn = `Devaguru Jupiter transits House ${jupHouseFromMoon} from your Moon sign (${jupHouseFromLagna} from Lagna) in ${jupItem?.transitSign}. This constitutes a classical Shubha Gochar of the highest magnitude, expanding financial treasury, intellectual clarity, marital/progeny blessings, and social reverence.`;
    jupiterProphecyHi = `देवगुरु बृहस्पति आपकी जन्म राशि से भाव ${jupHouseFromMoon} (लग्न से भाव ${jupHouseFromLagna}) में ${jupItem?.transitSign} राशि पर गोचर कर रहे हैं। यह परम शुभ गोचर ज्ञान, संतान सुख, धन लाभ एवं सामाजिक प्रतिष्ठा में विस्तार करेगा।`;
  } else {
    jupiterProphecyEn = `Jupiter transits House ${jupHouseFromMoon} from Moon sign in ${jupItem?.transitSign}. While inner wisdom deepens, expenses on noble causes or pilgrimages rise. Maintain patience regarding career recognition until Jupiter's next ingress.`;
    jupiterProphecyHi = `बृहस्पति का चंद्र राशि से भाव ${jupHouseFromMoon} में गोचर आंतरिक ज्ञान व आध्यात्मिक चिंतन को बढ़ावा देगा, यद्यपि शुभ कार्यों व यात्राओं में धन व्यय बढ़ेगा। व्यावसायिक निर्णयों में धैर्य रखें।`;
  }

  // Saturn transit narrative
  let saturnProphecyEn = '';
  let saturnProphecyHi = '';
  const isSatUpachaya = [3, 6, 11].includes(satHouseFromMoon);
  if (isSatUpachaya) {
    saturnProphecyEn = `Saturn transits an Upachaya House (${satHouseFromMoon} from Moon, ${satHouseFromLagna} from Lagna) in ${satItem?.transitSign}. Under classical Phaladeepika rules, this vanquishes adversaries, solidifies career permanence, and rewards diligent perseverance with durable wealth.`;
    saturnProphecyHi = `कर्मफलदाता शनि आपकी राशि से उपचय भाव (${satHouseFromMoon} भाव, लग्न से ${satHouseFromLagna} भाव) में गोचरस्थ हैं। यह अत्यंत शक्तिशाली फलप्रद गोचर है जो विरोधियों को शांत कर आजीविका में स्थायी पदोन्नति एवं आर्थिक संबल प्रदान करेगा।`;
  } else if (sadeSati.active) {
    saturnProphecyEn = `You are undergoing Saturn's ${sadeSati.phase} (${satItem?.transitSign}). Saturn acts as the master refiner, stripping away superficiality and testing endurance. Dedicated labor, humility, and avoiding hasty commitments turn this trial into your greatest life foundation.`;
    saturnProphecyHi = `आपकी जन्म राशि पर शनि की ${sadeSati.phase} का प्रभाव है। शनिदेव आपके धैर्य, निष्ठा व कर्म-संस्कारों की परीक्षा ले रहे हैं। अहंकार व जल्दबाजी त्यागकर प्रामाणिक परिश्रम करें; यह समय आपके जीवन का स्थायी निर्माण करेगा।`;
  } else {
    saturnProphecyEn = `Saturn occupies House ${satHouseFromMoon} from your Moon sign in ${satItem?.transitSign}. Disciplined pacing, structural organization of finances, and caring for joint/bone health are paramount.`;
    saturnProphecyHi = `शनि का राशि से भाव ${satHouseFromMoon} में गोचर कार्यक्षेत्र में अतिरिक्त अनुशासन और स्वास्थ्य (हड्डी/जोड़ों) के प्रति सतर्कता की मांग करता है। संगठित होकर कार्य करें।`;
  }

  // Rahu-Ketu narrative
  const rahuProphecyEn = `Rahu transits House ${rahuItem?.houseFromMoon ?? 1} and Ketu House ${ketuItem?.houseFromMoon ?? 7} across your Moon axis. This nodal trigger catalyzes sudden shifts in worldview, unconventional professional channels, foreign connections, and intuitive inner revelations.`;
  const rahuProphecyHi = `राहु का चंद्र से भाव ${rahuItem?.houseFromMoon ?? 1} तथा केतु का भाव ${ketuItem?.houseFromMoon ?? 7} में गोचर जीवन में अप्रत्याशित यात्राओं, विदेशी संपर्कों, तकनीकी अनुसंधान एवं आध्यात्मिक वैराग्य के नए द्वार खोलेगा।`;

  // Double Transit
  let doubleTransitEn = '';
  let doubleTransitHi = '';
  if (doubleTransitHouses.length > 0) {
    const dHouses = doubleTransitHouses.map((d: { house: number; signName: string }) => `House ${d.house} (${d.signName})`).join(' and ');
    const dHousesHi = doubleTransitHouses.map((d: { house: number; signName: string }) => `भाव ${d.house} (${d.signName})`).join(' एवं ');
    doubleTransitEn = `CRITICAL CATALYST: Jupiter and Saturn simultaneously cast their combined energetic gaze upon ${dHouses}. Major irrevocable life milestones (promotions, property acquisitions, marriage, or family expansion) materialize in these specific domains.`;
    doubleTransitHi = `विशेष गोचर सिद्धि (दोहरा गोचर): गुरु एवं शनि की संयुक्त दृष्टि ${dHousesHi} को पूर्ण रूप से सक्रिय कर रही है। इन भावों से संबंधित जीवन-क्षेत्रों (पदोन्नति, संपत्ति क्रय, विवाह अथवा संतान) में बड़े व स्थायी घटनाक्रम घटित होंगे।`;
  } else {
    doubleTransitEn = `Jupiter and Saturn transit independent houses, providing balanced individual development in wisdom and discipline without sudden shockwaves.`;
    doubleTransitHi = `गुरु और शनि स्वतंत्र भावों में गोचर कर रहे हैं, जिससे जीवन में बिना किसी उथल-पुथल के क्रमिक ज्ञान व कर्म का संतुलन बना रहेगा।`;
  }

  const headlineEn = isJupFavorable && isSatUpachaya
    ? `Golden Transit Confluence: Auspicious Jupiter & Upachaya Saturn Bestow Career Mastery`
    : sadeSati.active
    ? `Transformational Transit Epoch: Navigating Saturnine Refinement Under Guiding Wisdom`
    : `Balanced Celestial Currents: Strategic Growth, Measured Commitments & Karmic Focus`;

  const headlineHi = isJupFavorable && isSatUpachaya
    ? `स्वर्ण गोचर काल: गुरु की अमृत दृष्टि व उपचय शनि द्वारा विजय एवं अभूतपूर्व समृद्धि`
    : sadeSati.active
    ? `परिवर्तनकारी गोचर चक्र: शनिदेव की कसौटी पर कर्म-सिद्धि एवं आत्म-शोधन का समय`
    : `संतुलित ग्रहीय प्रवाह: रणनीतिक विस्तार, विवेकपूर्ण निर्णय एवं कर्म-साधना का फल`;

  const overallNarrativeEn = `${jupiterProphecyEn} ${saturnProphecyEn} ${doubleTransitEn}`;
  const overallNarrativeHi = `${jupiterProphecyHi} ${saturnProphecyHi} ${doubleTransitHi}`;

  return {
    headlineEn,
    headlineHi,
    overallNarrativeEn,
    overallNarrativeHi,
    jupiterProphecyEn,
    jupiterProphecyHi,
    saturnProphecyEn,
    saturnProphecyHi,
    rahuKetuProphecyEn: rahuProphecyEn,
    rahuKetuProphecyHi: rahuProphecyHi,
    doubleTransitHighlightEn: doubleTransitEn,
    doubleTransitHighlightHi: doubleTransitHi,
  };
}
