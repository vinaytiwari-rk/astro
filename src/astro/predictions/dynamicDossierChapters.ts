import type { ChartData, DashaPeriod, NineGrahaId, SevenPlanetId } from '../types';
import { SIGNS, NAKSHATRAS } from '../constants';
import { findActiveDashaPath } from '../dasha';
import { formatDateDmy } from '../time';
import type { ChapterSection } from './lifeDossierEngine';

export const SIGN_HI = [
  'मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या',
  'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुंभ', 'मीन',
];

export const PLANET_HI: Record<string, string> = {
  Asc: 'लग्न',
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

// ============================================================================
export function computeDynamicPsychologySections(chart: ChartData): ChapterSection[] {
  const asc = chart.ascendant;
  const moon = chart.planets.find((p) => p.id === 'Moon');
  const ascSign = SIGNS[asc.signIndex];
  const ascLord = chart.planets.find((p) => p.id === asc.signLord);
  const planetName = (id: string) => PLANET_HI[id] || id;
  const houseOf = (p: (typeof chart.planets)[number] | undefined) => p?.rasiHouseNumber ?? p?.houseNumber ?? 0;
  const dignity = (p: (typeof chart.planets)[number] | undefined) => p?.dignity || 'उपलब्ध नहीं';
  if (!moon) return [{ titleEn: 'Psychological Themes — Insufficient Data', titleHi: 'मनोभाव — कुंडली डेटा अपर्याप्त', paragraphsEn: ['Moon placement is unavailable, so a chart-specific interpretation cannot be generated.'], paragraphsHi: ['चंद्रमा की स्थिति उपलब्ध नहीं है; इसलिए व्यक्तिगत व्याख्या नहीं दी जा सकती।'] }];
  const moonHouse = houseOf(moon);
  const moonSign = SIGNS[moon.signIndex];
  const moonLord = chart.planets.find((p) => p.id === moonSign.lord);
  const others = chart.planets.filter((p) => p.id !== 'Asc' && p.id !== 'Moon');
  const distance = (p: (typeof chart.planets)[number]) => ((moonHouse - houseOf(p) + 12) % 12) + 1;
  const saturn = others.find((p) => p.id === 'Saturn');
  const mars = others.find((p) => p.id === 'Mars');
  const jupiter = others.find((p) => p.id === 'Jupiter');
  const rahu = others.find((p) => p.id === 'Rahu');
  const ketu = others.find((p) => p.id === 'Ketu');
  const saturnContact = Boolean(saturn && [1, 3, 7, 10].includes(distance(saturn)));
  const marsContact = Boolean(mars && [1, 4, 7, 8].includes(distance(mars)));
  const jupiterContact = Boolean(jupiter && [1, 5, 7, 9].includes(distance(jupiter)));
  const nodeContact = Boolean((rahu && rahu.signIndex === moon.signIndex) || (ketu && ketu.signIndex === moon.signIndex));
  const conjunctions = others.filter((p) => p.signIndex === moon.signIndex);
  const supportiveHi = [
    jupiterContact ? 'चंद्रमा से गुरु का पारंपरिक संबंध सीखने, मार्गदर्शन और व्यापक दृष्टि का सहायक संकेत है।' : '',
    moonLord && ['Exalted', 'Moolatrikona', 'Own Sign', 'Great Friend', 'Friendly'].includes(moonLord.dignity) ? `चंद्र राशि स्वामी ${planetName(moonSign.lord)} की ${dignity(moonLord)} स्थिति सहायक मानी जाती है।` : '',
    ascLord && ['Exalted', 'Moolatrikona', 'Own Sign', 'Great Friend', 'Friendly'].includes(ascLord.dignity) ? `लग्नेश ${planetName(asc.signLord)} की ${dignity(ascLord)} स्थिति आत्म-प्रबंधन को समर्थन दे सकती है।` : '',
  ].filter(Boolean);
  const cautionHi = [
    saturnContact ? 'चंद्रमा से शनि का संबंध जिम्मेदारी, देरी या आत्म-आलोचना की पारंपरिक थीम दिखा सकता है; यह मानसिक स्वास्थ्य का निदान नहीं है।' : '',
    marsContact ? 'चंद्रमा से मंगल का संबंध प्रतिक्रिया में तेजी या अधीरता का संकेत हो सकता है; महत्वपूर्ण निर्णय से पहले ठहरना उपयोगी है।' : '',
    nodeContact ? 'चंद्रमा के साथ राहु/केतु की युति विचारों में तीव्रता या बदलते दृष्टिकोण की पारंपरिक थीम है; इससे बीमारी या भय का निष्कर्ष न निकालें।' : '',
    moonLord && ['Enemy', 'Great Enemy', 'Debilitated'].includes(moonLord.dignity) ? `चंद्र राशि स्वामी ${planetName(moonSign.lord)} की ${dignity(moonLord)} स्थिति भावनात्मक संतुलन पर अतिरिक्त ध्यान देने का संकेत देती है।` : '',
  ].filter(Boolean);
  const supportiveEn = [
    jupiterContact ? 'Jupiter has a traditional relationship with the Moon, a supportive indication for learning, guidance and perspective.' : '',
    moonLord && ['Exalted', 'Moolatrikona', 'Own Sign', 'Great Friend', 'Friendly'].includes(moonLord.dignity) ? `${planetName(moonSign.lord)}, ruler of the Moon sign, is ${dignity(moonLord)} and is traditionally considered supportive.` : '',
    ascLord && ['Exalted', 'Moolatrikona', 'Own Sign', 'Great Friend', 'Friendly'].includes(ascLord.dignity) ? `The Ascendant ruler ${planetName(asc.signLord)} is ${dignity(ascLord)}, which may support self-management.` : '',
  ].filter(Boolean);
  const cautionEn = [
    saturnContact ? 'Saturn has a traditional relationship with the Moon and may symbolize responsibility, delay or self-criticism; this is not a mental-health diagnosis.' : '',
    marsContact ? 'Mars has a traditional relationship with the Moon and may symbolize quick reactions or impatience; pausing before important decisions can help.' : '',
    nodeContact ? 'A Rahu/Ketu conjunction with the Moon is traditionally associated with intensity or changing perspectives; it does not establish illness or danger.' : '',
    moonLord && ['Enemy', 'Great Enemy', 'Debilitated'].includes(moonLord.dignity) ? `${planetName(moonSign.lord)}, ruler of the Moon sign, is ${dignity(moonLord)}; emotional steadiness may deserve deliberate attention.` : '',
  ].filter(Boolean);
  const active = findActiveDashaPath(chart.vimshottari ?? [], Date.now());
  const md = active[0];
  const ad = active[1];
  const mdPlanet = md ? chart.planets.find((p) => p.id === md.lord) : undefined;
  const adPlanet = ad ? chart.planets.find((p) => p.id === ad.lord) : undefined;
  const timingHi = md ? `वर्तमान में ${planetName(md.lord)} महादशा${ad ? ` और ${planetName(ad.lord)} अंतर्दशा` : ''} सक्रिय है। इनके स्वामी जन्मकुंडली के भाव ${houseOf(mdPlanet) || 'अज्ञात'}${ad ? ` और ${houseOf(adPlanet) || 'अज्ञात'}` : ''} से जुड़े हैं। यह समय का पारंपरिक विषय-संकेत है, घटना की गारंटी नहीं।` : 'उपलब्ध विंशोत्तरी दशा डेटा से वर्तमान अवधि निर्धारित नहीं हो सकी; समय-आधारित निष्कर्ष नहीं दिया गया।';
  const timingEn = md ? `${planetName(md.lord)} Mahadasha${ad ? ` and ${planetName(ad.lord)} Antardasha` : ''} is active. Their lords occupy natal House ${houseOf(mdPlanet) || 'unknown'}${ad ? ` and House ${houseOf(adPlanet) || 'unknown'}` : ''}. This is a traditional timing theme, not a guaranteed event.` : 'The available Vimshottari data does not identify the current period; no timed conclusion is offered.';
  const nakshatra = moon.nakshatraName || NAKSHATRAS[moon.nakshatraIndex ?? 0]?.name || 'अज्ञात';
  const factsHi = `चंद्रमा ${moonSign.name} राशि, भाव ${moonHouse || 'अज्ञात'} और ${nakshatra} नक्षत्र में है। चंद्र राशि स्वामी ${planetName(moonSign.lord)} भाव ${houseOf(moonLord) || 'अज्ञात'} में तथा ${dignity(moonLord)} गरिमा में है।`;
  const factsEn = `The Moon is in ${moonSign.name}, natal House ${moonHouse || 'unknown'}, Nakshatra ${nakshatra}. Its sign ruler ${planetName(moonSign.lord)} occupies House ${houseOf(moonLord) || 'unknown'} with dignity ${dignity(moonLord)}.`;
  return [
    { titleEn: 'Mind and Temperament — Chart Evidence', titleHi: 'मन और स्वभाव — कुंडली के वास्तविक संकेत', leadEn: 'A restrained interpretation from the Ascendant, Moon and their rulers; these are traditional Jyotish themes, not psychological diagnoses.', leadHi: 'लग्न, चंद्रमा और उनके स्वामियों से निकले सीमित ज्योतिषीय संकेत; इन्हें मनोवैज्ञानिक या चिकित्सकीय निदान न समझें।', paragraphsEn: [`The Ascendant is ${asc.signName} (${ascSign.element}); its traditional elemental style is ${ascSign.element.toLowerCase()}.`, factsEn], paragraphsHi: [`लग्न ${asc.signName} राशि (${ascSign.element} तत्व) है।`, factsHi], astrologicalCauseEn: `Ascendant lord ${planetName(asc.signLord)}: House ${houseOf(ascLord)}, ${dignity(ascLord)}. Moon: ${moonSign.name}, House ${moonHouse}; Moon-sign lord ${planetName(moonSign.lord)}: House ${houseOf(moonLord)}, ${dignity(moonLord)}.`, astrologicalCauseHi: `लग्नेश ${planetName(asc.signLord)} भाव ${houseOf(ascLord) || 'अज्ञात'} में (${dignity(ascLord)})। चंद्रमा ${moonSign.name} राशि के भाव ${moonHouse || 'अज्ञात'} में; राशि स्वामी ${planetName(moonSign.lord)} भाव ${houseOf(moonLord) || 'अज्ञात'} में (${dignity(moonLord)})।` },
    { titleEn: 'Supportive Factors and Cautions', titleHi: 'सहायक संकेत और सावधानी के विषय', leadEn: 'Only contacts found in this chart are listed; absent combinations are not invented.', leadHi: 'केवल इसी कुंडली में मिले संबंध दिए गए हैं; अनुपस्थित योगों की कल्पना नहीं की गई है।', paragraphsEn: [supportiveEn.join(' ') || 'No major supportive Moon contact was identified in this limited rule set.', cautionEn.join(' ') || 'No major challenging Moon contact was identified in this limited rule set; this does not mean challenges are absent.'], paragraphsHi: [supportiveHi.join(' ') || 'इस सीमित नियम-समूह में चंद्रमा पर प्रमुख सहायक संबंध नहीं मिला।', cautionHi.join(' ') || 'इस सीमित नियम-समूह में प्रमुख चुनौतीपूर्ण संबंध नहीं मिला; इसका अर्थ चुनौतियों का पूर्ण अभाव नहीं है।'], astrologicalCauseEn: `Checked natal contacts: Saturn ${saturnContact ? 'present' : 'not identified'}, Mars ${marsContact ? 'present' : 'not identified'}, Jupiter ${jupiterContact ? 'present' : 'not identified'}, Rahu/Ketu conjunction ${nodeContact ? 'present' : 'not identified'}.`, astrologicalCauseHi: `जाँचे गए जन्मगत संबंध: शनि ${saturnContact ? 'संबंधित' : 'नहीं मिला'}, मंगल ${marsContact ? 'संबंधित' : 'नहीं मिला'}, गुरु ${jupiterContact ? 'संबंधित' : 'नहीं मिला'}, राहु/केतु युति ${nodeContact ? 'मिली' : 'नहीं मिली'}।`, keyPointsEn: [`Moon sign/house: ${moonSign.name} / ${moonHouse || 'unknown'}.`, `Moon-sign lord: ${planetName(moonSign.lord)}; House ${houseOf(moonLord)}; ${dignity(moonLord)}.`, `Planets conjunct the Moon by sign: ${conjunctions.length ? conjunctions.map((p) => planetName(p.id)).join(', ') : 'none identified'}.`], keyPointsHi: [`चंद्र राशि/भाव: ${moonSign.name} / ${moonHouse || 'अज्ञात'}।`, `चंद्र राशि स्वामी: ${planetName(moonSign.lord)}; भाव ${houseOf(moonLord) || 'अज्ञात'}; ${dignity(moonLord)}।`, `चंद्र राशि में युति: ${conjunctions.length ? conjunctions.map((p) => planetName(p.id)).join(', ') : 'कोई नहीं मिली'}।`] },
    { titleEn: 'Current Period and Practical Reflection', titleHi: 'वर्तमान दशा और व्यावहारिक दिशा', leadEn: 'Dasha is a broad timing lens, not proof that a specific event will occur.', leadHi: 'दशा व्यापक समय-संकेत है, किसी निश्चित घटना का प्रमाण नहीं।', paragraphsEn: [timingEn, 'Use supportive factors as resources and caution themes as prompts for practical habits and measured decisions. For health concerns, rely on qualified professionals rather than horoscope interpretation.'], paragraphsHi: [timingHi, 'सहायक संकेतों को अपनी क्षमता और सावधानी के विषयों को बेहतर दिनचर्या तथा सोच-समझकर निर्णय लेने की याद दिलाने के रूप में लें। स्वास्थ्य संबंधी समस्या में योग्य विशेषज्ञ की सलाह लें।'], astrologicalCauseEn: `Active Vimshottari path: ${md ? `${md.lord}${ad ? ` / ${ad.lord}` : ''}` : 'not available'}. Natal Moon House ${moonHouse || 'unknown'}.`, astrologicalCauseHi: `सक्रिय विंशोत्तरी क्रम: ${md ? `${planetName(md.lord)}${ad ? ` / ${planetName(ad.lord)}` : ''}` : 'उपलब्ध नहीं'}। चंद्रमा जन्मकुंडली के भाव ${moonHouse || 'अज्ञात'} में है।` },
  ];
}
export function computeDynamicActivePhaseSections(chart: ChartData): ChapterSection[] {
  const asc = chart.ascendant;
  const moon = chart.planets.find((p) => p.id === 'Moon') ?? chart.planets[1];
  const now = Date.now();
  const dashaPath = findActiveDashaPath(chart.vimshottari ?? [], now);

  const mdPeriod = dashaPath[0];
  const adPeriod = dashaPath[1];
  const pdPeriod = dashaPath[2];

  if (!mdPeriod) {
    return [{
      titleEn: 'Current Dasha — Data Unavailable',
      titleHi: 'वर्तमान दशा — डेटा उपलब्ध नहीं',
      paragraphsEn: ['A current Vimshottari Mahadasha could not be resolved from the supplied chart. No fallback planet or timing claim is substituted.'],
      paragraphsHi: ['दी गई कुंडली से वर्तमान विंशोत्तरी महादशा निर्धारित नहीं हो सकी। किसी काल्पनिक ग्रह या समय-सीमा को विकल्प के रूप में नहीं जोड़ा गया है।'],
    }];
  }

  const mdLord = mdPeriod.lord as NineGrahaId;
  const adLord = (adPeriod?.lord || mdPeriod.lord) as NineGrahaId;
  const pdLord = (pdPeriod?.lord || adLord) as NineGrahaId;

  const mdPlanet = chart.planets.find((p) => p.id === mdLord);
  const adPlanet = chart.planets.find((p) => p.id === adLord);

  const mdHouse = mdPlanet?.rasiHouseNumber || 1;
  const adHouse = adPlanet?.rasiHouseNumber || 1;

  // Mutual relationship between MD and AD
  const mutualDistance = ((adHouse - mdHouse + 12) % 12) + 1;
  const isShadashtaka = mutualDistance === 6 || mutualDistance === 8;
  const isDvidwadasa = mutualDistance === 2 || mutualDistance === 12;
  const isKendra = [1, 4, 7, 10].includes(mutualDistance);
  const isTrikona = [5, 9].includes(mutualDistance);

  // Transit positions are not supplied to this natal-chart section. Do not infer Sade Sati or Saturn transit from a fixed sign.

  // Dasha relationships are symbolic themes, not proof of what the native
  // actually experienced. Never narrate unverified past events as facts.
  const houseThemesHi: Record<number, string> = {
    1: 'स्वास्थ्य-जागरूकता, आत्मविश्वास और व्यक्तिगत दिशा',
    2: 'बचत, परिवार, वाणी और वित्तीय निर्णय',
    3: 'कौशल, संचार, छोटे प्रयास और भाई-बहन',
    4: 'घर, माता, संपत्ति और मानसिक सुकून',
    5: 'शिक्षा, रचनात्मकता, संतान और विवेकपूर्ण जोखिम',
    6: 'नौकरी, दिनचर्या, प्रतिस्पर्धा और देनदारियां',
    7: 'साझेदारी, विवाह और सार्वजनिक व्यवहार',
    8: 'बदलाव, साझा संसाधन और अनिश्चितता से निपटना',
    9: 'उच्च शिक्षा, मार्गदर्शन, विश्वास और लंबी यात्राएं',
    10: 'काम, जिम्मेदारी, पद और सार्वजनिक प्रतिष्ठा',
    11: 'आय, लक्ष्य, नेटवर्क और उपलब्धियां',
    12: 'खर्च, विश्राम, विदेश-संपर्क और एकांत',
  };
  const houseThemesEn: Record<number, string> = {
    1: 'wellbeing, confidence and personal direction',
    2: 'savings, family, speech and financial decisions',
    3: 'skills, communication, initiative and siblings',
    4: 'home, mother, property and emotional rest',
    5: 'education, creativity, children and considered risk',
    6: 'employment, routine, competition and liabilities',
    7: 'partnerships, marriage and public dealings',
    8: 'change, shared resources and uncertainty management',
    9: 'higher learning, mentors, beliefs and long journeys',
    10: 'work, responsibility, position and public standing',
    11: 'income, goals, networks and gains',
    12: 'expenses, rest, overseas links and solitude',
  };
  const pastDiagnosticHi = `महादशा स्वामी ${PLANET_HI[mdLord] || mdLord} जन्मकुंडली के भाव ${mdHouse} से और अंतर्दशा स्वामी ${PLANET_HI[adLord] || adLord} भाव ${adHouse} से जुड़े हैं। इन भावों के पारंपरिक विषय क्रमशः ${houseThemesHi[mdHouse] || 'जीवन की प्राथमिकताएं'} और ${houseThemesHi[adHouse] || 'व्यावहारिक परिस्थितियां'} हैं। उनका ${isShadashtaka ? '6/8' : isDvidwadasa ? '2/12' : isKendra ? 'केंद्र' : isTrikona ? 'त्रिकोण' : 'अन्य'} संबंध दबाव, समन्वय या बदलाव की थीम दे सकता है। यह पिछले 6–12 महीनों की घटनाओं का दावा नहीं है; अपने वास्तविक अनुभव से ही इसका मिलान करें।`;
  const pastDiagnosticEn = `The Mahadasha lord ${mdLord} is connected with natal House ${mdHouse}, and the Antardasha lord ${adLord} with House ${adHouse}. Their traditional topics are ${houseThemesEn[mdHouse] || 'personal priorities'} and ${houseThemesEn[adHouse] || 'practical circumstances'}. Their ${isShadashtaka ? '6/8' : isDvidwadasa ? '2/12' : isKendra ? 'Kendra' : isTrikona ? 'Trikona' : 'other'} relationship may describe themes of pressure, coordination or change. This is not a claim about events in the past 6–12 months; compare it with your actual experience.`;

  const pdPlanet = chart.planets.find((p) => p.id === pdLord);
  const pdHouse = pdPlanet?.rasiHouseNumber || pdPlanet?.houseNumber || 1;
  const pdEnd = pdPeriod?.endMs ? formatDateDmy(pdPeriod.endMs) : '';
  const next6MonthsHi = `आगामी अवधि में प्रत्यन्तर्दशा स्वामी ${PLANET_HI[pdLord] || pdLord} जन्मकुंडली के भाव ${pdHouse} से जुड़ा है। इस भाव के पारंपरिक विषय हैं: ${houseThemesHi[pdHouse] || 'व्यक्तिगत प्राथमिकताएं'}। उपलब्ध दशा-गणना के अनुसार यह उप-अवधि ${pdEnd || 'दर्ज समाप्ति तिथि तक'} सक्रिय है। यह व्यापक विषय-संकेत है; इससे नौकरी, विवाह, धन, मुकदमे या स्वास्थ्य की कोई निश्चित घटना/तारीख घोषित नहीं की जा सकती।`;
  const next6MonthsEn = `The current Pratyantardasha lord ${pdLord} is connected with natal House ${pdHouse}, whose traditional topics include ${houseThemesEn[pdHouse] || 'personal priorities'}. The available dasha calculation lists this sub-period through ${pdEnd || 'its recorded end date'}. This is a broad thematic indication, not a definite prediction or date for a job, marriage, money, litigation or health event.`;

  const sec1: ChapterSection = {
    titleEn: 'Current Dasha Themes: Review Against Your Actual Experience',
    titleHi: 'वर्तमान दशा के विषय: अपने वास्तविक अनुभव से मिलान करें',
    leadEn: `A chart-based reading of the running Vimshottari Mahadasha of ${mdLord} and Antardasha of ${adLord}; no unverified past events are assumed.`,
    leadHi: `सक्रिय महादशा '${PLANET_HI[mdLord] || mdLord}' और अंतर्दशा '${PLANET_HI[adLord] || adLord}' के भाव-आधारित विषय; इसमें पिछले अनुभवों को पहले से सच नहीं माना गया है।`,
    paragraphsEn: [
      pastDiagnosticEn,
      `Saturn transit is not included in this particular section; only the birth-chart dasha periods and natal house placements are used.`,
    ],
    paragraphsHi: [
      pastDiagnosticHi,
      `इस अनुभाग में गोचर शनि की गणना शामिल नहीं है; निष्कर्ष केवल जन्मकुंडली की दशा और भाव-स्थितियों पर आधारित है।`,
    ],
    astrologicalCauseEn: `Vimshottari dasha relationship: Mahadasha lord ${mdLord} (natal House ${mdHouse}) and Antardasha lord ${adLord} (natal House ${adHouse}); their relative house distance is ${mutualDistance}. Saturn transit is not assessed in this section.`,
    astrologicalCauseHi: `शास्त्रीय कारण: वर्तमान विंशोत्तरी दशा में महादशा स्वामी ${PLANET_HI[mdLord] || mdLord} जन्मकुंडली के भाव ${mdHouse} से और अंतर्दशा स्वामी ${PLANET_HI[adLord] || adLord} भाव ${adHouse} से जुड़े हैं; दोनों के बीच भाव-दूरी ${mutualDistance} है। इस अनुभाग में गोचर शनि का आकलन शामिल नहीं है।`,
    keyPointsEn: [
      `Running Mahadasha: ${mdLord} (until ${mdPeriod?.endMs ? formatDateDmy(mdPeriod.endMs) : 'Active'})`,
      `Running Antardasha: ${adLord} (until ${adPeriod?.endMs ? formatDateDmy(adPeriod.endMs) : 'Active'})`,
      `MD-AD house relationship: ${mutualDistance}th from the Mahadasha lord; interpret as a traditional theme, not a factual event report.`,
    ],
    keyPointsHi: [
      `सक्रिय महादशा: '${PLANET_HI[mdLord] || mdLord}' (समाप्ति: ${mdPeriod?.endMs ? formatDateDmy(mdPeriod.endMs) : 'सक्रिय'})`,
      `सक्रिय अंतर्दशा: '${PLANET_HI[adLord] || adLord}' (समाप्ति: ${adPeriod?.endMs ? formatDateDmy(adPeriod.endMs) : 'सक्रिय'})`,
      `महादशा-अंतर्दशा भाव-संबंध: महादशा स्वामी से ${mutualDistance}वां भाव; इसे पारंपरिक संकेत मानें, घटना का तथ्यात्मक विवरण नहीं।`,
    ],
  };

  const sec2: ChapterSection = {
    titleEn: 'Next Period: Dasha-Linked Life Themes',
    titleHi: 'आगामी अवधि: दशा से जुड़े जीवन-विषय',
    leadEn: `A limited thematic reading of the active Pratyantardasha of ${pdLord}; this is not a guaranteed event forecast.`,
    leadHi: `प्रत्यन्तर्दशेश '${PLANET_HI[pdLord] || pdLord}' और उसकी जन्मकुंडली में स्थिति पर आधारित सीमित विषय-संकेत; निश्चित घटना का दावा नहीं।`,
    paragraphsEn: [
      next6MonthsEn,
      `The Pratyantardasha lord ${pdLord} is placed in natal House ${pdHouse}, linking this period to ${houseThemesEn[pdHouse] || 'personal priorities'}. Use this as a planning prompt, not as a claim that a particular event will occur.`,
    ],
    paragraphsHi: [
      next6MonthsHi,
      `प्रत्यन्तर्दशा स्वामी '${PLANET_HI[pdLord] || pdLord}' जन्मकुंडली के भाव ${pdHouse} में स्थित हैं। इसलिए इस अवधि का पारंपरिक विषय ${houseThemesHi[pdHouse] || 'व्यक्तिगत प्राथमिकताएं'} है। इसे योजना बनाने का संकेत समझें, किसी निश्चित घटना का दावा नहीं।`,
    ],
    astrologicalCauseEn: `Vimshottari Pratyantardasha lord ${pdLord} is placed in natal House ${pdHouse}. Transit-based claims are not made in this section.`,
    astrologicalCauseHi: `शास्त्रीय आधार: विंशोत्तरी प्रत्यन्तर्दशा स्वामी '${PLANET_HI[pdLord] || pdLord}' जन्मकुंडली के भाव ${pdHouse} में स्थित हैं। इस अनुभाग में गोचर-आधारित दावा नहीं किया गया है।`,
    keyPointsEn: [
      `Pratyantardasha lord: ${pdLord}`,
      `Natal placement: House ${pdHouse}`,
      `Traditional theme: ${houseThemesEn[pdHouse] || 'personal priorities'}`,
      `Recorded sub-period end: ${pdEnd || 'not available'}`,
      'No event date or guaranteed outcome is inferred from this period alone.',
    ],
    keyPointsHi: [
      `प्रत्यन्तर्दशा स्वामी: ${PLANET_HI[pdLord] || pdLord}`,
      `जन्मकुंडली में स्थिति: भाव ${pdHouse}`,
      `पारंपरिक विषय: ${houseThemesHi[pdHouse] || 'व्यक्तिगत प्राथमिकताएं'}`,
      `दर्ज समाप्ति तिथि: ${pdEnd || 'उपलब्ध नहीं'}`,
      'केवल इस दशा से किसी घटना की तारीख या निश्चित परिणाम नहीं निकाला गया है।',
    ],
  };

  return [sec1, sec2];
}

// ============================================================================
// DYNAMIC CHAPTER 4: CAREER, JOB VS BUSINESS & DYNAMIC ZENITH AGE
// ============================================================================
export function computeDynamicCareerZenithSections(chart: ChartData): ChapterSection[] {
  const asc = chart.ascendant;
  const h10Sign = (asc.signIndex + 9) % 12;
  const h10Lord = SIGNS[h10Sign].lord;
  const h10LordPlanet = chart.planets.find((p) => p.id === h10Lord);

  const h6Sign = (asc.signIndex + 5) % 12;
  const h6Lord = SIGNS[h6Sign].lord;
  const h6LordPlanet = chart.planets.find((p) => p.id === h6Lord);

  const h7Sign = (asc.signIndex + 6) % 12;
  const h7Lord = SIGNS[h7Sign].lord;
  const h7LordPlanet = chart.planets.find((p) => p.id === h7Lord);

  const amk = chart.planets.find((p) => p.charaKaraka === 'AmK') ?? chart.planets[1];
  const in10th = chart.planets.filter((p) => p.rasiHouseNumber === 10);
  const in6th = chart.planets.filter((p) => p.rasiHouseNumber === 6);
  const in7th = chart.planets.filter((p) => p.rasiHouseNumber === 7);

  // Job vs Business Scoring
  let jobScore = 50;
  let bizScore = 50;

  if (in6th.length > 0 || ['Saturn', 'Mercury'].includes(h6Lord)) jobScore += 20;
  if (in7th.length > 0 || ['Mars', 'Sun', 'Rahu', 'Venus'].includes(h7Lord)) bizScore += 20;
  if (h10LordPlanet && [1, 10, 11].includes(h10LordPlanet.rasiHouseNumber)) bizScore += 15;
  if (h6LordPlanet && [10, 1].includes(h6LordPlanet.rasiHouseNumber)) jobScore += 15;

  const isIndependentEnterprise = bizScore >= jobScore;

  // Natural Planetary Maturity Ages (Naisargika Ayu - BPHS Ch. 45 & Saravali)
  const maturityAges: Record<string, number> = {
    Jupiter: 16,
    Sun: 22,
    Moon: 24,
    Venus: 25,
    Mars: 28,
    Mercury: 32,
    Saturn: 36,
    Rahu: 42,
    Ketu: 48,
  };

  const primaryCareerPlanet = in10th.length > 0 ? in10th[0].id : h10Lord;
  const primaryMaturityAge = maturityAges[primaryCareerPlanet] ?? 36;
  const amkMaturityAge = maturityAges[amk.id] ?? 32;

  // Derive 3 Individual Career Epochs
  const startEpoch1 = 19;
  const endEpoch1 = Math.min(26, Math.max(23, primaryMaturityAge - 6));
  const startEpoch2 = endEpoch1 + 1;
  const endEpoch2 = Math.min(36, Math.max(30, primaryMaturityAge + 2));
  const startEpoch3 = endEpoch2 + 1;
  const endEpoch3 = Math.min(52, Math.max(44, amkMaturityAge + 12));

  const secVerdict: ChapterSection = {
    titleEn: 'Job vs. Independent Enterprise: The Definitive Shastric Verdict',
    titleHi: 'नौकरी बनाम स्वतंत्र व्यवसाय: प्रामाणिक शास्त्रीय फैसला',
    leadEn: `Comparative evaluation of 6th house (Service/Competition) vs 7th house (Trade/Partnership) vs 10th house (Executive Command).`,
    leadHi: `षष्ठ भाव (नौकरी/सेवा), सप्तम भाव (व्यापार/साझेदारी) तथा दशम भाव (राज्य/अधिकार) का संयुक्त शास्त्रीय निर्णय।`,
    paragraphsEn: [
      `Your 10th house falls in ${SIGNS[h10Sign].name} governed by ${h10Lord}, with Amatyakaraka ${amk.id}. ${isIndependentEnterprise ? 'The celestial geometry decisively favors Independent Enterprise, Sovereign Agency, and Strategic Ownership. While early salaried employment provides technical discipline, remaining perpetually subordinated under rigid micro-management drains your spirit and triggers workplace resentment. You perform at peak potency when you control your calendar, client strategy, and commercial outcomes.' : 'The celestial geometry favors Structured Institutional Leadership, Corporate Hierarchy, and High-Stakes Advisory Roles. You thrive within established frameworks where clear protocols, organizational backing, and specialized merit govern advancement. Unstructured wild-cat entrepreneurship exposes you to unnecessary legal and financial vulnerabilities.'}`,
      `Key operational mode: ${isIndependentEnterprise ? 'Focus on building intellectual property, advisory practices, specialized agencies, or direct commercial ventures where your authority cannot be countermanded.' : 'Seek roles in elite corporations, public sector governance, research institutions, or regulated industries where your strategic discipline commands high institutional authority.'}`,
    ],
    paragraphsHi: [
      `आपकी कुंडली में दशम भाव '${SIGN_HI[h10Sign]}' राशि में है जिसके स्वामी '${PLANET_HI[h10Lord] || h10Lord}' हैं, और आपके अमात्यकारक '${PLANET_HI[amk.id] || amk.id}' हैं। ${isIndependentEnterprise ? 'ग्रहों की स्थिति स्पष्ट रूप से स्वतंत्र व्यवसाय, स्वायत्त सत्ता और व्यापारिक स्वामित्व का समर्थन करती है। यद्यपि जीवन के प्रारंभिक काल में अनुभव प्राप्ति हेतु नौकरी उपयोगी हो सकती है, किंतु जीवन भर किसी संकीर्ण अधिकारी के अधीन काम करना आपके आत्मसम्मान को कचोटता है। आप तब सर्वोच्च फल देते हैं जब कार्य की दिशा और निर्णय आपके अपने हाथ में हों।' : 'ग्रहों की स्थिति संरचित संस्थागत नेतृत्व, प्रतिष्ठित कॉर्पोरेट पदों अथवा सरकारी/नीति-निर्धारक सेवा का प्रबल समर्थन करती है। आप उन सुव्यवस्थित संस्थाओं में सर्वाधिक चमकते हैं जहां योग्यता, नियम और स्पष्ट पदानुक्रम का सम्मान होता है। बिना तैयारी के किया गया अनियोजित व्यापार आपको अनावश्यक जोखिम में डाल सकता है।'}`,
      `कार्यशैली का मूल मंत्र: ${isIndependentEnterprise ? 'ऐसी स्वतंत्र एजेंसी, परामर्श कार्य, अथवा व्यापार का निर्माण करें जहां आपका बौद्धिक अधिकार सर्वोपरि रहे और कोई आपको व्यर्थ बाधित न कर सके।' : 'बड़ी कॉर्पोरेट संस्थाओं, प्रशासनिक पदों, अथवा नीति-निर्धारक विभागों में नेतृत्व संभालें जहां आपका अनुशासन और समर्पण आपको सर्वोच्च पदों तक ले जाए।'}`,
    ],
    astrologicalCauseEn: `Brihat Jataka (Ch. 10 - Karma Jeeva Adhyaya) & Saravali (Ch. 33): 10th lord ${h10Lord} in House ${h10LordPlanet?.rasiHouseNumber || 1}, 6th lord ${h6Lord} (House ${h6LordPlanet?.rasiHouseNumber || 6}), and 7th lord ${h7Lord} (House ${h7LordPlanet?.rasiHouseNumber || 7}) determine the Job (${jobScore}%) vs Business (${bizScore}%) equilibrium.`,
    astrologicalCauseHi: `शास्त्रीय कारण: बृहज्जातक (अध्याय १० - कर्मजीवाध्यायः) एवं सारावली (अध्याय ३३): दशमेश '${PLANET_HI[h10Lord] || h10Lord}' (भाव ${h10LordPlanet?.rasiHouseNumber || 1}), षष्ठेश '${PLANET_HI[h6Lord] || h6Lord}' (भाव ${h6LordPlanet?.rasiHouseNumber || 6}) तथा सप्तमेश '${PLANET_HI[h7Lord] || h7Lord}' (भाव ${h7LordPlanet?.rasiHouseNumber || 7}) के बलाबल से नौकरी (${jobScore}%) बनाम व्यापार (${bizScore}%) का अनुपात तय होता है।`,
    keyPointsEn: [
      `Dominant Vocation: ${isIndependentEnterprise ? 'Independent Enterprise & Free Strategic Agency' : 'Structured Institutional & Corporate Leadership'}`,
      `Job vs Business Score: Job ${jobScore}% · Business ${bizScore}%`,
      `10th House Ruler: ${h10Lord} in House ${h10LordPlanet?.rasiHouseNumber || 1}`,
      `Amatyakaraka: ${amk.id} governing career direction`,
    ],
    keyPointsHi: [
      `प्रमुख आजीविका मार्ग: ${isIndependentEnterprise ? 'स्वतंत्र व्यवसाय, स्वायत्त सत्ता व व्यापारिक स्वामित्व' : 'प्रतिष्ठित संस्थागत सेवा व कॉर्पोरेट नेतृत्व'}`,
      `नौकरी बनाम व्यापार अनुपात: नौकरी ${jobScore}% · व्यापार ${bizScore}%`,
      `दशमेश: '${PLANET_HI[h10Lord] || h10Lord}' (भाव ${h10LordPlanet?.rasiHouseNumber || 1})`,
      `अमात्यकारक: '${PLANET_HI[amk.id] || amk.id}' (करियर के निर्देशक)`,
    ],
  };

  const secEpochs: ChapterSection = {
    titleEn: 'The Three Individual Career Epochs & The True Zenith Age',
    titleHi: 'करियर के तीन विशिष्ट जीवन पड़ाव एवं सर्वोच्च उत्कर्ष वर्ष (Zenith Age)',
    leadEn: `The chronological arc of professional emergence, stabilization, and peak authority derived from planetary maturity ages.`,
    leadHi: `दशमेश व अमात्यकारक के नैसर्गिक परिपक्वता काल पर आधारित करियर के तीन पड़ाव व चरम उत्थान की आयु।`,
    paragraphsEn: [
      `Ages ${startEpoch1} to ${endEpoch1} (The Identity Crucible & Trial Period): Governed by nascent planetary impulses. You experience mismatched compensation, experimentation, navigating petty workplace politics, and learning to assert your worth without apologizing.`,
      `Ages ${startEpoch2} to ${endEpoch2} (The Breakthrough & Stabilization Window): Activated by the planetary maturity of ${primaryCareerPlanet} (Maturity Age ${primaryMaturityAge}). A decisive project, promotion, or shift to independent practice establishes your reputation. Financial compensation scales substantially.`,
      `Ages ${startEpoch3} to ${endEpoch3} (The True Career Zenith Window): Triggered by the mature activation of Amatyakaraka ${amk.id} (Maturity Age ${amkMaturityAge}) and 10th house Raja Yogas. This is the master epoch where you wield uncompromised executive command, direct high-value assets, and build an enduring professional legacy that outlives temporary market fluctuations.`,
    ],
    paragraphsHi: [
      `${startEpoch1} से ${endEpoch1} वर्ष (प्रारंभिक संघर्ष व दिशा की खोज): इस काल में जातक को अपनी क्षमता से कम पारिश्रमिक, दिशाहीनता और कार्यक्षेत्र की राजनीति का सामना करना पड़ता है। आप ठोकरें खाकर अपने वास्तविक हुनर को पहचानते हैं।`,
      `${startEpoch2} से ${endEpoch2} वर्ष (स्थायित्व व पहला बड़ा उत्थान): मुख्य आजीविका ग्रह '${PLANET_HI[primaryCareerPlanet] || primaryCareerPlanet}' के नैसर्गिक परिपक्वता काल (आयु ${primaryMaturityAge} वर्ष) में सक्रिय होने से करियर में ठोस स्थायित्व आता है। पद, आय और सामाजिक सम्मान में उल्लेखनीय वृद्धि होती है।`,
      `${startEpoch3} से ${endEpoch3} वर्ष (सर्वोच्च उत्कर्ष काल / True Zenith Window): अमात्यकारक '${PLANET_HI[amk.id] || amk.id}' तथा दशम भाव के राजयोगों के पूर्ण फलीभूत होने का यह स्वर्णिम काल है। इस आयु वर्ग में आपका प्रभाव, निर्णय क्षमता और सामाजिक ख्याति चरम पर पहुंचेगी। आप नीति-निर्धारक या बड़े व्यापार के स्वामी के रूप में स्थापित होंगे।`,
    ],
    astrologicalCauseEn: `Brihat Parashara Hora Shastra (Ch. 45 - Naisargika Ayu & Maturity of Grahas): Primary career significator ${primaryCareerPlanet} matures at age ${primaryMaturityAge}, while Amatyakaraka ${amk.id} matures at age ${amkMaturityAge}, defining your Zenith between ages ${startEpoch3} and ${endEpoch3}.`,
    astrologicalCauseHi: `शास्त्रीय कारण: बृहत्पाराशर होराशास्त्र (अध्याय ४५ - ग्रहाणां नैसर्गिकावस्था): मुख्य आजीविका ग्रह '${PLANET_HI[primaryCareerPlanet] || primaryCareerPlanet}' का परिपक्वता वर्ष ${primaryMaturityAge} है, तथा अमात्यकारक '${PLANET_HI[amk.id] || amk.id}' का प्रभाव ${amkMaturityAge} वर्ष में जागृत होता है, जिससे आपका वास्तविक उत्कर्ष काल ${startEpoch3} से ${endEpoch3} वर्ष के मध्य फलित होता है।`,
    keyPointsEn: [
      `Crucible Epoch: Ages ${startEpoch1}–${endEpoch1} (Apprenticeship & Foundation)`,
      `Stabilization Epoch: Ages ${startEpoch2}–${endEpoch2} (First Major Breakthrough)`,
      `Supreme Zenith Window: Ages ${startEpoch3}–${endEpoch3} (Peak Executive Stature & Asset Command)`,
    ],
    keyPointsHi: [
      `प्रारंभिक पड़ाव: ${startEpoch1} से ${endEpoch1} वर्ष (परिश्रम व अनुभव संचय)`,
      `स्थायित्व पड़ाव: ${startEpoch2} से ${endEpoch2} वर्ष (पहला बड़ा उत्थान)`,
      `सर्वोच्च उत्कर्ष काल: ${startEpoch3} से ${endEpoch3} वर्ष (चरम अधिकार, ख्याति व संपत्ति योग)`,
    ],
  };

  return [secVerdict, secEpochs];
}

// ============================================================================
// DYNAMIC CHAPTER 5: WEALTH, INDU LAGNA & EXACT 12TH LORD LEAKAGE TRAP
// ============================================================================
export function computeDynamicWealthInduLagnaSections(chart: ChartData): ChapterSection[] {
  const asc = chart.ascendant;
  const moon = chart.planets.find((p) => p.id === 'Moon') ?? chart.planets[1];
  const h2Sign = (asc.signIndex + 1) % 12;
  const h2Lord = SIGNS[h2Sign].lord;
  const h11Sign = (asc.signIndex + 10) % 12;
  const h11Lord = SIGNS[h11Sign].lord;
  const h12Sign = (asc.signIndex + 11) % 12;
  const h12Lord = SIGNS[h12Sign].lord;
  const h12LordPlanet = chart.planets.find((p) => p.id === h12Lord);
  const h12House = h12LordPlanet?.rasiHouseNumber || 12;

  // Indu Lagna Calculation (Parashari Kalas: Sun 30, Moon 16, Mars 6, Mer 8, Jup 10, Ven 12, Sat 1)
  const kalas: Record<string, number> = {
    Sun: 30,
    Moon: 16,
    Mars: 6,
    Mercury: 8,
    Jupiter: 10,
    Venus: 12,
    Saturn: 1,
  };

  const h9FromLagnaSign = (asc.signIndex + 8) % 12;
  const h9LagnaLord = SIGNS[h9FromLagnaSign].lord;
  const h9FromMoonSign = (moon.signIndex + 8) % 12;
  const h9MoonLord = SIGNS[h9FromMoonSign].lord;

  const kala1 = kalas[h9LagnaLord] ?? 10;
  const kala2 = kalas[h9MoonLord] ?? 10;
  const totalKalas = kala1 + kala2;
  const remainder = totalKalas % 12 || 12;
  const induLagnaSignIdx = (moon.signIndex + remainder - 1) % 12;
  const induLagnaSignEn = SIGNS[induLagnaSignIdx].name;
  const induLagnaSignHi = SIGN_HI[induLagnaSignIdx];

  const inIndu = chart.planets.filter((p) => p.signIndex === induLagnaSignIdx && p.id !== 'Asc');
  const hasBeneficInIndu = inIndu.some((p) => ['Jupiter', 'Venus', 'Mercury', 'Moon'].includes(p.id));
  const hasMaleficInIndu = inIndu.some((p) => ['Mars', 'Saturn', 'Sun', 'Rahu'].includes(p.id));

  let induVerdictEn = '';
  let induVerdictHi = '';
  if (hasBeneficInIndu) {
    induVerdictEn = `Supreme Koti-Dhana Yoga! Benefic planets (${inIndu.map((p) => p.id).join(', ')}) occupy your Indu Lagna (${induLagnaSignEn}). Classical Parashari treatises declare that the native will amass vast, sovereign wealth through principled wisdom, commerce, and compounding assets. Destitution is astro-mathematically impossible.`;
    induVerdictHi = `प्रचंड कोटि-धनेश योग! आपके इन्दु लग्न ('${induLagnaSignHi}') में शुभ ग्रह (${inIndu.map((p) => PLANET_HI[p.id] || p.id).join(', ')}) विराजमान हैं। महर्षि पाराशर के अनुसार ऐसा जातक अपनी बुद्धि, व्यापार और नीति के बल पर विपुल धन-संपत्ति अर्जित करता है। जीवन में कभी दरिद्रता नहीं आ सकती।`;
  } else if (hasMaleficInIndu) {
    induVerdictEn = `Courageous Wealth & High-Risk Acquisition Yoga! Malefic planets (${inIndu.map((p) => p.id).join(', ')}) occupy your Indu Lagna (${induLagnaSignEn}). You acquire substantial wealth through bold, disruptive maneuvers, competitive warfare, engineering, or real estate, though wealth arrives through friction and demands strict defense.`;
    induVerdictHi = `साहसिक धन योग! इन्दु लग्न ('${induLagnaSignHi}') में क्रूर ग्रह (${inIndu.map((p) => PLANET_HI[p.id] || p.id).join(', ')}) स्थित हैं। जातक कठिन संघर्ष, तकनीकी कौशल, भूमि अथवा जोखिम भरे व्यापार से प्रचुर धन कमाता है, किंतु धन संचय में समय-समय पर बड़े झटके भी लगते हैं।`;
  } else {
    induVerdictEn = `Steadily Compounding Indu Lagna in ${induLagnaSignEn} (ruled by ${SIGNS[induLagnaSignIdx].lord}). Wealth accumulates through disciplined, unglamorous persistence. Windfalls are rare; your financial fortress is constructed brick by unshakeable brick.`;
    induVerdictHi = `इन्दु लग्न '${induLagnaSignHi}' में स्थित है (स्वामी: ${PLANET_HI[SIGNS[induLagnaSignIdx].lord] || SIGNS[induLagnaSignIdx].lord})। जातक का धन किसी आकस्मिक सट्टे से नहीं, बल्कि निरंतर परिश्रम, बचत और सुरक्षित निवेश से धीरे-धीरे विशाल वटवृक्ष बनता है।`;
  }

  // Exact 12th Lord Placement — The Specific Astrological Leakage Channel
  const LEAK_CHANNELS: Record<number, { en: string; hi: string }> = {
    1: {
      en: 'Self-image, impulsive personal purchases, cosmetic/wardrobe expenses, and physical healthcare experiments.',
      hi: 'स्वयं के शौक, कपड़ों व दिखावे पर अनावश्यक खर्च, तथा स्वास्थ्य संबंधी परीक्षणों में पूंजी का रिसाव।',
    },
    2: {
      en: 'Emotional loans to family members that turn bad, excessive hospitality, and verbal financial commitments.',
      hi: 'कुटुंब के लोगों को भावुक होकर दिया गया ऐसा धन जो कभी वापस नहीं आता, तथा खान-पान व दिखावे में व्यय।',
    },
    3: {
      en: 'Subsidizing siblings/cousins, legal contracts, vehicle travel expenses, and failed marketing/communication ventures.',
      hi: 'छोटे भाई-बहनों या मित्रों की आर्थिक सहायता, व्यर्थ की यात्राएं और कानूनी दस्तावेजों में धन की बर्बादी।',
    },
    4: {
      en: 'Continuous real estate renovations, structural home repairs, automotive breakdowns, and maternal medical bills.',
      hi: 'मकान की निरंतर मरम्मत/सजावट, वाहनों की खराबी, और माता के स्वास्थ्य पर आकस्मिक धन का व्यय।',
    },
    5: {
      en: 'Speculative stock market / crypto gambles entered on FOMO, over-spending on children, and creative misfires.',
      hi: 'शेयर बाजार या सट्टे में लालचवश पूंजी फंसाना, संतान की अनियंत्रित मांगों और जोखिम भरे प्रोजेक्ट्स में रिसाव।',
    },
    6: {
      en: 'Viparita Raja Yoga dynamic: Unplanned legal fees, settling employee/partner disputes, and chronic medical maintenance.',
      hi: 'विपरीत राजयोग प्रभाव: कोर्ट-कचहरी के खर्चे, कर्मचारियों के विवाद निपटाने और जीर्ण रोगों की दवाओं में व्यय।',
    },
    7: {
      en: 'Spouse’s high-maintenance lifestyle demands, failed joint ventures, contract breakages, and litigation with partners.',
      hi: 'जीवनसाथी के महंगे शौक, व्यापारिक साझेदारों द्वारा की गई धोखाधड़ी और अनुबंध टूटने से होने वाली हानि।',
    },
    8: {
      en: 'Sarala Yoga dynamic: Sudden unbudgeted emergencies, tax penalties, unreturned secret cash, and insurance disputes.',
      hi: 'सरल योग प्रभाव: अचानक आए सरकारी दंड/टैक्स, किसी को दिया गया गुप्त नकद जो डूब गया, और आकस्मिक संकट।',
    },
    9: {
      en: 'Expensive religious ceremonies, foreign travel costs, funding spiritual mentors, and father’s legacy liabilities.',
      hi: 'महंगे धार्मिक अनुष्ठान, विदेश यात्राओं का भारी खर्च, गुरुओं पर अंधाधुंध व्यय और पिता के पुराने दायित्व।',
    },
    10: {
      en: 'Maintaining high corporate / social appearances, business overheads that exceed revenues, and political donations.',
      hi: 'कार्यक्षेत्र में बड़ा दिखने का दिखावा, व्यापार के भारी मेंटेनेंस खर्चे और प्रतिष्ठा बचाने के लिए किया गया व्यय।',
    },
    11: {
      en: 'Treacherous social circles, lending to prestigious "friends" who default, and ill-fated club/network investments.',
      hi: 'धूर्त मित्रों द्वारा निवेश के नाम पर ठगी, प्रतिष्ठित संपर्कों को दिया गया पैसा डूबना और सामाजिक दिखावा।',
    },
    12: {
      en: 'Vimala Yoga dynamic: Foreign relocation expenses, hospital stays, and voluntary charitable donations to spiritual ashrams.',
      hi: 'विमल योग प्रभाव: विदेश प्रवास पर खर्च, आश्रमों व धर्मार्थ संस्थाओं में दान, तथा एकांत साधना में धन का सदुपयोग।',
    },
  };

  const leakProfile = LEAK_CHANNELS[h12House] ?? LEAK_CHANNELS[12];

  // Property & Vehicle Timing
  const h4Sign = (asc.signIndex + 3) % 12;
  const h4Lord = SIGNS[h4Sign].lord;
  const mars = chart.planets.find((p) => p.id === 'Mars')!;

  const secWealth: ChapterSection = {
    titleEn: 'The Inflow Potential: Indu Lagna & The Dhana Yoga Architecture',
    titleHi: 'धन आगमन की सामर्थ्य: इन्दु लग्न एवं धन योग की दिव्य संरचना',
    leadEn: `Parashari Kalas assessment for wealth magnitude and financial floor.`,
    leadHi: `महर्षि पाराशर की कला-पद्धति द्वारा इन्दु लग्न एवं स्थायी धन योग का गणितीय परीक्षण।`,
    paragraphsEn: [
      `Your 2nd house of accumulated reserves is ruled by ${h2Lord}, while your 11th house of recurrent income is ruled by ${h11Lord}. This planetary backbone ensures that despite temporary cash crunches, your financial resilience is supreme. Money arrives from unexpected quarters whenever you face existential crises.`,
      `Indu Lagna Revelation: Calculated by summing the 9th lord Kalas from Lagna (${kala1}) and Moon (${kala2}), totalling ${totalKalas} Kalas (Remainder: ${remainder}), your Indu Lagna falls in ${induLagnaSignEn}. ${induVerdictEn}`,
    ],
    paragraphsHi: [
      `आपकी कुंडली में द्वितीय भाव (संचित कोष) के स्वामी '${PLANET_HI[h2Lord] || h2Lord}' और एकादश भाव (नियमित लाभ) के स्वामी '${PLANET_HI[h11Lord] || h11Lord}' हैं। यह योग सुनिश्चित करता है कि संकट के समय भी कहीं न कहीं से संसाधन प्रकट हो जाएंगे और आपकी सामाजिक साख सुरक्षित रहेगी।`,
      `इन्दु लग्न का रहस्य: लग्न से नवमेश की कलाएं (${kala1}) तथा चंद्र से नवमेश की कलाएं (${kala2}) जोड़कर (कुल ${totalKalas} कलाएं, शेष: ${remainder}) आपका इन्दु लग्न '${induLagnaSignHi}' राशि में बनता है। ${induVerdictHi}`,
    ],
    astrologicalCauseEn: `Brihat Parashara Hora Shastra (Ch. 41 - Dhana Yoga & Indu Lagna): Indu Lagna in ${induLagnaSignEn} with planets: ${inIndu.map((p) => p.id).join(', ') || 'None (Ruled by ' + SIGNS[induLagnaSignIdx].lord + ')'}. Dhana lords ${h2Lord} and ${h11Lord} establish financial trajectory.`,
    astrologicalCauseHi: `शास्त्रीय कारण: बृहत्पाराशर होराशास्त्र (अध्याय ४१ - धनयोगाध्यायः): इन्दु लग्न '${induLagnaSignHi}' राशि में स्थित है, जिसमें स्थित ग्रह: ${inIndu.map((p) => PLANET_HI[p.id] || p.id).join(', ') || 'कोई नहीं (स्वामी: ' + (PLANET_HI[SIGNS[induLagnaSignIdx].lord] || SIGNS[induLagnaSignIdx].lord) + ')'}। धनेश '${PLANET_HI[h2Lord] || h2Lord}' व लाभेश '${PLANET_HI[h11Lord] || h11Lord}' धन की सीमा तय करते हैं।`,
    keyPointsEn: [
      `Indu Lagna Sign: ${induLagnaSignEn} (${totalKalas} Kalas)`,
      `Indu Lagna Status: ${hasBeneficInIndu ? 'Supreme Koti-Dhana Yoga (Benefics Present)' : hasMaleficInIndu ? 'High-Risk Bold Wealth (Malefics Present)' : 'Steady Compounding Foundation'}`,
      `Wealth Guardians: 2nd Lord ${h2Lord} · 11th Lord ${h11Lord}`,
    ],
    keyPointsHi: [
      `इन्दु लग्न राशि: '${induLagnaSignHi}' (${totalKalas} कलाएं)`,
      `इन्दु लग्न फल: ${hasBeneficInIndu ? 'कोटि-धनेश योग (शुभ ग्रह स्थित)' : hasMaleficInIndu ? 'साहसिक धन योग (क्रूर ग्रह स्थित)' : 'सुरक्षित व क्रमिक संचय'}`,
      `धन के मुख्य अधिपति: धनेश '${PLANET_HI[h2Lord] || h2Lord}' · लाभेश '${PLANET_HI[h11Lord] || h11Lord}'`,
    ],
  };

  const secLeaks: ChapterSection = {
    titleEn: 'The Exact Financial Leakage Trap: 12th Lord in House ' + h12House,
    titleHi: 'वित्तीय रिसाव का गुप्त छिद्र: द्वादशेश का भाव ' + h12House + ' में फल',
    leadEn: `The exact astrological channel through which your hard-earned wealth drains away unseen.`,
    leadHi: `व्ययेश '${PLANET_HI[h12Lord] || h12Lord}' के भाव ${h12House} में बैठने से धन कहां और कैसे गायब होता है।`,
    paragraphsEn: [
      `Your 12th house of expenditure and loss is governed by ${h12Lord}, placed in House ${h12House}. Classical treatises (Bhavartha Ratnakara & BPHS) reveal your primary financial leakage channel: ${leakProfile.en}`,
      `Whenever a substantial liquidity cushion accumulates in your bank accounts, this 12th-lord trigger fires, generating urgent, inescapable obligations that siphon off your surplus. To plug this leak: Immediately convert liquid cash into illiquid, hard-to-sell assets (real estate or sovereign gold) registered in joint custody. Do not keep excess liquidity in easily spendable accounts.`,
    ],
    paragraphsHi: [
      `आपकी कुंडली में व्यय भाव (द्वादश) के स्वामी '${PLANET_HI[h12Lord] || h12Lord}' भाव संख्या ${h12House} में स्थित हैं। भावार्थ रत्नाकर एवं बृहत्पाराशर होराशास्त्र के अनुसार आपके धन के गुप्त रिसाव का मुख्य मार्ग यह है: ${leakProfile.hi}`,
      `जैसे ही आपके बैंक खाते में एक निश्चित धनराशि जमा होती है, द्वादशेश का प्रभाव सक्रिय हो जाता है और कोई न कोई आकस्मिक खर्च आकर उस पूंजी को बहा ले जाता है। इस रिसाव को रोकने का अचूक उपाय: नकद धन को बैंक में रखने के स्थान पर तुरंत अचल संपत्ति (भूमि/मकान) अथवा स्वर्ण में बदल दें। अतिरिक्त तरलता आपके हाथ में टिकना कठिन है।`,
    ],
    astrologicalCauseEn: `Bhavartha Ratnakara (Dwadasa Bhava Phala) & BPHS (Ch. 24): 12th lord ${h12Lord} in House ${h12House} determines the exact point of wealth dissipation.`,
    astrologicalCauseHi: `शास्त्रीय कारण: भावार्थ रत्नाकर (द्वादश भाव फल) एवं बृहत्पाराशर होराशास्त्र: व्ययेश '${PLANET_HI[h12Lord] || h12Lord}' की भाव ${h12House} में स्थिति जातक के धन व्यय की दिशा सुनिश्चित करती है।`,
    keyPointsEn: [
      `12th House Ruler: ${h12Lord} placed in House ${h12House}`,
      `Primary Leak Channel: ${leakProfile.en}`,
      `Wealth Defense Rule: Convert liquid reserves into physical land or gold. Avoid emotional loans.`,
    ],
    keyPointsHi: [
      `व्ययेश: '${PLANET_HI[h12Lord] || h12Lord}' (भाव संख्या ${h12House} में स्थित)`,
      `मुख्य रिसाव मार्ग: ${leakProfile.hi}`,
      `धन रक्षा नियम: नकद पूंजी को अचल संपत्ति या स्वर्ण में रूपांतरित करें; भावुक होकर कर्ज न दें।`,
    ],
  };

  return [secWealth, secLeaks];
}

// ============================================================================
// DYNAMIC CHAPTER 6: SPOUSE PROFILE, CELIBACY & TRITIYA PRAKRITI (SEXUALITY)
// ============================================================================
export function computeDynamicMarriageAndIntimacySections(chart: ChartData, isMarriageDenial: boolean): ChapterSection[] {
  const asc = chart.ascendant;
  const h7Sign = (asc.signIndex + 6) % 12;
  const h7Lord = SIGNS[h7Sign].lord;
  const h7LordPlanet = chart.planets.find((p) => p.id === h7Lord);
  const dk = chart.planets.find((p) => p.charaKaraka === 'DK') ?? chart.planets[6];
  const in7th = chart.planets.filter((p) => p.rasiHouseNumber === 7);
  const venus = chart.planets.find((p) => p.id === 'Venus')!;
  const saturn = chart.planets.find((p) => p.id === 'Saturn')!;
  const mars = chart.planets.find((p) => p.id === 'Mars')!;
  const mercury = chart.planets.find((p) => p.id === 'Mercury')!;
  const ketu = chart.planets.find((p) => p.id === 'Ketu')!;

  // Classical Tritiya Prakriti / Non-Binary / Fluid Sexuality Indicators
  // Brihat Jataka Ch. 2, Ch. 24 & BPHS Ch. 80
  const mercSatDist = ((saturn.rasiHouseNumber - mercury.rasiHouseNumber + 12) % 12) + 1;
  const mercurySaturnConnection = [mercury.rasiHouseNumber, saturn.rasiHouseNumber].includes(7) ||
    [mercury.rasiHouseNumber, saturn.rasiHouseNumber].includes(1) ||
    (mercury.rasiHouseNumber === saturn.rasiHouseNumber) ||
    mercSatDist === 7 || mercSatDist === 4 || mercSatDist === 11;
  const venusKetuConnection = [venus.rasiHouseNumber, ketu.rasiHouseNumber].includes(7) ||
    (venus.rasiHouseNumber === ketu.rasiHouseNumber) ||
    [venus.rasiHouseNumber, ketu.rasiHouseNumber].includes(12);

  // Dynamic Spouse Description from 7th Sign & Lord
  let spouseNatureEn = '';
  let spouseNatureHi = '';
  let frictionEn = '';
  let frictionHi = '';

  if (['Aries', 'Scorpio'].includes(SIGNS[h7Sign].name) || in7th.some((p) => p.id === 'Mars')) {
    spouseNatureEn = 'Athletic, high-spirited, courageous, and fiercely independent spouse with a fiery temper and deep protective instincts.';
    spouseNatureHi = 'ऊर्जावान, साहसी, स्वाभिमानी और स्वतंत्र विचारों वाला जीवनसाथी; शीघ्र क्रोध में आने वाला किंतु भीतर से अत्यंत सुरक्षात्मक।';
    frictionEn = 'Clashes erupt from battles of dominance and stubborn pride; neither party easily concedes error during arguments.';
    frictionHi = 'अहंकार के टकराव और एक-दूसरे पर आधिपत्य जमाने की होड़ से विवाद भड़कते हैं; दोनों में से कोई भी झुकना पसंद नहीं करता।';
  } else if (['Taurus', 'Libra'].includes(SIGNS[h7Sign].name) || in7th.some((p) => p.id === 'Venus')) {
    spouseNatureEn = 'Cultured, artistically inclined, charming, and fond of luxury, fine living, and aesthetic refinement.';
    spouseNatureHi = 'सौंदर्यप्रिय, कलात्मक रुचि रखने वाला, सुरुचिपूर्ण और भौतिक सुख-सुविधाओं व सुरुचिपूर्ण जीवन का प्रेमी जीवनसाथी।';
    frictionEn = 'Disagreements stem from differing standards of financial expenditure, vanity, and expectations of constant romantic validation.';
    frictionHi = 'खर्चों की प्राथमिकताओं, दिखावे, और एक-दूसरे से निरंतर रोमांटिक ध्यान पाने की अपेक्षाओं से तनाव उत्पन्न होता है।';
  } else if (['Gemini', 'Virgo'].includes(SIGNS[h7Sign].name) || in7th.some((p) => p.id === 'Mercury')) {
    spouseNatureEn = 'Youthful, highly analytical, talkative, commercially savvy, and intellectually demanding life partner.';
    spouseNatureHi = 'तार्किक, वाक्पटु, व्यापारिक बुद्धि वाला, चतुर और बौद्धिक चर्चाओं में निपुण जीवनसाथी।';
    frictionEn = 'Friction arises from hyper-critical remarks, sarcastic wit, and analyzing emotional feelings with cold intellectual logic.';
    frictionHi = 'छोटी-छोटी बातों में मीन-मेख निकालने, व्यंग्यात्मक टिप्पणियों और भावनाओं को केवल तर्क की कसौटी पर तौलने से मनमुटाव होता है।';
  } else if (['Cancer'].includes(SIGNS[h7Sign].name) || in7th.some((p) => p.id === 'Moon')) {
    spouseNatureEn = 'Deeply emotional, nurturing, intuitive, home-centric spouse who absorbs household vibrations intensely.';
    spouseNatureHi = 'अत्यंत भावुक, ममतामयी/पोषणकर्ता, संवेदनशील और पारिवारिक मान-मर्यादा के प्रति समर्पित जीवनसाथी।';
    frictionEn = 'Friction stems from fluctuating emotional moods, taking casual remarks to heart, and silent brooding retreats.';
    frictionHi = 'बार-बार मनोदशा बदलने (Mood Swings), छोटी बात को दिल से लगा लेने और रूठकर मौन साध लेने से दांपत्य में दूरियां आती हैं।';
  } else if (['Leo'].includes(SIGNS[h7Sign].name) || in7th.some((p) => p.id === 'Sun')) {
    spouseNatureEn = 'Stately, proud, commanding, and ethically principled partner who demands unwavering respect and loyalty.';
    spouseNatureHi = 'राजसी ठाठ-बाट, स्वाभिमानी, नेतृत्वप्रिय और समाज में उच्च प्रतिष्ठा चाहने वाला जीवनसाथी।';
    frictionEn = 'Ego clashes are sharp; public contradiction or feeling disrespected in front of others triggers explosive boundaries.';
    frictionHi = 'स्वाभिमान को ठेस लगना और दूसरों के सामने बात काटे जाने पर गंभीर विवाद होना मुख्य समस्या बनती है।';
  } else if (['Sagittarius', 'Pisces'].includes(SIGNS[h7Sign].name) || in7th.some((p) => p.id === 'Jupiter')) {
    spouseNatureEn = 'Wise, philosophical, morally upright, and spiritual partner who acts as an intellectual mentor or moral guide.';
    spouseNatureHi = 'विद्वान, धार्मिक, नैतिक सिद्धांतों पर चलने वाला और एक मार्गदर्शक की भूमिका निभाने वाला जीवनसाथी।';
    frictionEn = 'Friction arises when high moral preachiness or uncompromising righteousness stifles spontaneous playfulness.';
    frictionHi = 'अत्यधिक उपदेशात्मक शैली, धर्म-कर्म की कठोरता और जीवन के सहज आनंद में कमी आने से नीरसता उत्पन्न होती है।';
  } else {
    // Capricorn, Aquarius or Saturn in 7th
    spouseNatureEn = 'Mature, sober, practical, and hardworking partner who carries heavy life experience, often entering life after delay.';
    spouseNatureHi = 'परिपक्व, गंभीर, व्यावहारिक और कर्तव्यनिष्ठ जीवनसाथी; अक्सर जीवन में विलंब या कठिन परिस्थितियों के बाद प्रवेश।';
    frictionEn = 'Friction stems from emotional reservedness, communication delays, and treating the marriage like a business contract.';
    frictionHi = 'भावनात्मक अभिव्यक्ति में संकोच, शीत-युद्ध और दांपत्य को एक नीरस कर्तव्य जैसा समझने से दूरियां बढ़ती हैं।';
  }

  const secSpouse: ChapterSection = {
    titleEn: isMarriageDenial
      ? 'Lifelong Bachelorhood / Celibacy Yogas & Root Causes of Delay'
      : 'Spouse Persona, Temperament & Roots of Marital Friction',
    titleHi: isMarriageDenial
      ? 'विवाह हीनता / नैष्ठिक ब्रह्मचर्य योग एवं विलंब के मूल कारण'
      : 'जीवनसाथी का वास्तविक स्वरूप, स्वभाव एवं वैवाहिक कलह की जड़ें',
    leadEn: isMarriageDenial
      ? 'Authentic classical diagnostic of voluntary singlehood, ascetic autonomy, and late renunciation.'
      : 'The real psychological and social profile of your life partner and where clashes arise.',
    leadHi: isMarriageDenial
      ? 'महर्षि पाराशर व वराहमिहिर सम्मत विवाह-हीनता, नैष्ठिक ब्रह्मचर्य अथवा अत्यधिक विलंब का विश्लेषण।'
      : 'आपके जीवनसाथी का यथार्थ व्यक्तित्व, पारिवारिक पृष्ठभूमि और आपसी मतभेद के मुख्य बिंदु।',
    paragraphsEn: isMarriageDenial
      ? [
          `Classical Jyotish Formulations for Singlehood / Celibacy (नैष्ठिक ब्रह्मचर्य / विवाह हीन योग): Your 7th Lord (${h7Lord}) combined with ascetic influences on Venus and 7th house in D1 and D9 confirms strong signatures of voluntary bachelorhood, lifelong singlehood, or late renunciation of domestic expectations. You are wired for intellectual, creative, or spiritual autonomy rather than submissive domestic compromise.`,
          `If forced into matrimony by societal expectations: Serious marital friction, emotional detachment, or formal dissolution will occur unless your partner completely respects your non-negotiable personal space. If you choose marriage in mature years, expect a partner who is similarly detached, unconventional, and intellectually self-sufficient.`,
        ]
      : [
          `Your 7th house falls in ${SIGNS[h7Sign].name} (governed by ${h7Lord}), with your Darakaraka being ${dk.id}. ${spouseNatureEn}`,
          `Roots of Marital Friction: ${frictionEn} Marital harmony is maintained not by suppressing differences, but by giving each other sovereign intellectual space and avoiding authoritarian ultimatums.`,
        ],
    paragraphsHi: isMarriageDenial
      ? [
          `शास्त्रीय विवाह हीनता एवं नैष्ठिक ब्रह्मचर्य योग: महर्षि पाराशर व जैमिनि के अनुसार सप्तमेश '${PLANET_HI[h7Lord] || h7Lord}' की स्थिति तथा शुक्र व उपपद लग्न पर विरक्ति कारक ग्रहों के प्रभाव से जातक के आजीवन अविवाहित/एकल (Bachelor / Single) रहने, नैष्ठिक ब्रह्मचर्य, अथवा पारंपरिक दांपत्य से पूर्ण विरक्ति का योग बनता है। जातक की आत्मा किसी के अधीन होकर समझौता करने के स्थान पर अपनी बौद्धिक, आध्यात्मिक व स्वतंत्र सत्ता में रमना चाहती है।`,
          `पारिवारिक दबाव में विवाह की स्थिति: यदि सामाजिक दबाव में विवाह कर भी लिया जाए, तो दांपत्य में अत्यधिक शीत-युद्ध, भावनात्मक विच्छेद, अथवा अंततः अलगाव का जोखिम रहता है, जब तक कि जीवनसाथी पूर्णतः परिपक्व और आपकी निजता का सम्मान करने वाला न हो।`,
        ]
      : [
          `आपकी कुंडली में सप्तम भाव '${SIGN_HI[h7Sign]}' राशि में है जिसके स्वामी '${PLANET_HI[h7Lord] || h7Lord}' हैं, और दाराकारक '${PLANET_HI[dk.id] || dk.id}' हैं। ${spouseNatureHi}`,
          `वैवाहिक कलह की जड़ें: ${frictionHi} दांपत्य में सामंजस्य बनाए रखने के लिए एक-दूसरे पर अधिकार जमाने के स्थान पर व्यक्तिगत स्वाधीनता का सम्मान करना अनिवार्य है।`,
        ],
    astrologicalCauseEn: isMarriageDenial
      ? `Brihat Jataka (Ch. 15 - Pravrajya Yoga) & BPHS (Ch. 18): Afflicted 7th lord ${h7Lord} and ascetic Saturn/Ketu influence over Venus and 7th house create detachment from marital bonds.`
      : `Brihat Jataka (Ch. 24 - Stri Jataka) & Phaladeepika (Ch. 10): 7th house in ${SIGNS[h7Sign].name} ruled by ${h7Lord} (House ${h7LordPlanet?.rasiHouseNumber || 1}) and Darakaraka ${dk.id} define spouse nature.`,
    astrologicalCauseHi: isMarriageDenial
      ? `शास्त्रीय कारण: बृहज्जातक (अध्याय १५ - प्रव्रज्यायोगाध्यायः) एवं बृहत्पाराशर होराशास्त्र: सप्तमेश '${PLANET_HI[h7Lord] || h7Lord}' तथा शुक्र पर शनि-केतु का वैराग्यकारी प्रभाव दांपत्य से विरक्ति उत्पन्न करता है।`
      : `शास्त्रीय कारण: बृहज्जातक (अध्याय २४ - स्त्रीजातकाध्यायः) एवं फलदीपिका (अध्याय १०): सप्तम भाव '${SIGN_HI[h7Sign]}' (स्वामी: ${PLANET_HI[h7Lord] || h7Lord}) तथा दाराकारक '${PLANET_HI[dk.id] || dk.id}' जीवनसाथी का स्वरूप निर्धारित करते हैं।`,
    keyPointsEn: [
      isMarriageDenial ? `Marital Status: Lifelong Singlehood / Ascetic Autonomy (Pravrajya Signature)` : `Spouse Sign: ${SIGNS[h7Sign].name} (Lord: ${h7Lord})`,
      `Spouse Archetype: ${spouseNatureEn.slice(0, 80)}...`,
      `Core Friction Trigger: ${frictionEn.slice(0, 80)}...`,
    ],
    keyPointsHi: [
      isMarriageDenial ? `वैवाहिक स्थिति: नैष्ठिक ब्रह्मचर्य / एकल जीवन योग (प्रव्रज्या प्रभाव)` : `सप्तम भाव राशि: '${SIGN_HI[h7Sign]}' (स्वामी: ${PLANET_HI[h7Lord] || h7Lord})`,
      `जीवनसाथी की प्रकृति: ${spouseNatureHi.slice(0, 60)}...`,
      `कलह का मुख्य कारण: ${frictionHi.slice(0, 60)}...`,
    ],
  };

  const secSexuality: ChapterSection = {
    titleEn: 'Bed Pleasures, Intimacy Dynamics & The Sexuality Spectrum',
    titleHi: 'शय्या सुख, काम-ऊर्जा एवं काम-प्रकृति (Sexuality Spectrum) का यथार्थ',
    leadEn: `Classical shastric analysis of 12th house (Bed Pleasures), Venus, and the natural human spectrum (Tritiya Prakriti).`,
    leadHi: `द्वादश भाव (शय्या सुख), काम-कारक शुक्र एवं महर्षि पाराशर व वराहमिहिर सम्मत काम-प्रकृति (तृतीय प्रकृति) का विश्लेषण।`,
    paragraphsEn: [
      `Classical Jyotish texts (Brihat Jataka Ch. 2, BPHS Ch. 80, Jaimini Sutras) explicitly analyze physical passion, bed comforts (12th house), and the natural spectrum of human sexuality, including Tritiya Prakriti (non-binary, fluid, or unconventional attractions). Your 12th house and Venus (${venus.signName} in House ${venus.rasiHouseNumber}) reveal an intense sensual nature that demands emotional resonance and psychological safety. Mechanical, dutiful intimacy leaves you completely detached.`,
      mercurySaturnConnection || venusKetuConnection
        ? `Your chart reveals strong classical signatures of non-traditional, fluid, or unconventional intimate orientations (Tritiya Prakriti influence through Mercury/Saturn or Venus-Ketu alignment). You possess an internal psychological duality that transcends rigid orthodox molds. If you have suppressed this part of your psyche out of societal pressure, it creates silent neuroses and deep dissatisfaction in conventional arrangements.`
        : `Your chart reflects a predominantly classical romantic temperament with deep desires for exclusivity and aesthetic refinement. However, when emotional communication breaks down, you tend to withhold intimacy as a subconscious weapon, which deeply damages the relationship.`,
    ],
    paragraphsHi: [
      `प्राचीन ज्योतिष ग्रंथों (बृहज्जातक, बृहत्पाराशर होराशास्त्र, जैमिनि सूत्र) में 12वें भाव (शय्या सुख), काम-कारक शुक्र एवं काम-प्रकृति का अत्यंत वैज्ञानिक व निष्पक्ष विश्लेषण मिलता है। आपकी कुंडली में शुक्र देव '${SIGN_HI[venus.signIndex]}' राशि में हैं और 12वां भाव अत्यंत संवेदनशील है। आपका शारीरिक व भावनात्मक सुख केवल यांत्रिक संबंधों से तृप्त नहीं हो सकता; आपको अंतरंगता के लिए बौद्धिक तालमेल, मानसिक सुरक्षा और गहरे आत्मीय सम्मान की आवश्यकता होती है।`,
      mercurySaturnConnection || venusKetuConnection
        ? `आपकी कुंडली में बुध, शनि अथवा शुक्र-केतु के विशिष्ट योगों के प्रभाव से पारंपरिक रूढ़ियों से परे 'तृतीय प्रकृति' (Tritiya Prakriti), अपरंपरागत आकर्षण अथवा काम-प्रकृति में तरलता (Fluid/Queer/Unconventional Sexuality) के शास्त्रीय संकेत उपस्थित हैं। आप बाह्य सामाजिक दबाव में पारंपरिक रूप धारण कर सकते हैं, किंतु अंतर्मन में आपकी काम-चेतना और आकर्षण की परिभाषा समाज के बंधे-बंधाए ढांचों से बिल्कुल भिन्न है। इस सत्य को स्वीकार न करना ही आंतरिक कुंठा का कारण बनता है।`
        : `आपकी काम-प्रकृति में पारंपरिक मर्यादा, एकाग्र प्रेम और सौंदर्य-बोध का प्राधान्य है। किंतु जब जीवनसाथी से भावनात्मक तालमेल बिगड़ता है, तो आप अवचेतन रूप से अंतरंगता से दूरी बना लेते हैं, जिससे दांपत्य में दूरियां और बढ़ जाती हैं।`,
    ],
    astrologicalCauseEn: `Brihat Jataka (Ch. 2 - Graha Bheda) & BPHS (Ch. 80): Venus in ${venus.signName} (House ${venus.rasiHouseNumber}), 12th house condition, and ${mercurySaturnConnection || venusKetuConnection ? 'Mercury-Saturn / Venus-Ketu connections indicating Tritiya Prakriti inclinations.' : 'Harmonious Venusian romantic alignment.'}`,
    astrologicalCauseHi: `शास्त्रीय कारण: बृहज्जातक (अध्याय २) एवं बृहत्पाराशर होराशास्त्र (अध्याय ८०): शुक्र देव की '${SIGN_HI[venus.signIndex]}' में स्थिति (भाव ${venus.rasiHouseNumber}) तथा ${mercurySaturnConnection || venusKetuConnection ? 'बुध-शनि अथवा शुक्र-केतु संबंध द्वारा तृतीय प्रकृति के शास्त्रीय संकेत।' : 'शुक्र का पारंपरिक सौंदर्य व मर्यादा पूर्ण प्रभाव।'}`,
    keyPointsEn: [
      `Venus Placement: ${venus.signName} (House ${venus.rasiHouseNumber})`,
      `Intimacy Orientation: ${mercurySaturnConnection || venusKetuConnection ? 'Fluid / Unconventional / Tritiya Prakriti Classical Signatures' : 'Traditional Romantic & Aesthetic Exclusivity'}`,
      `Bed Pleasures Key: Intellectual and emotional safety required before physical surrender.`,
    ],
    keyPointsHi: [
      `शुक्र की स्थिति: '${SIGN_HI[venus.signIndex]}' (भाव संख्या ${venus.rasiHouseNumber})`,
      `काम-प्रकृति का स्वरूप: ${mercurySaturnConnection || venusKetuConnection ? 'तृतीय प्रकृति / अपरंपरागत आकर्षण के शास्त्रीय योग' : 'पारंपरिक मर्यादा व सौंदर्यप्रिय समर्पण'}`,
      `शय्या सुख का नियम: शारीरिक निकटता से पूर्व मानसिक सुरक्षा व संवाद अनिवार्य।`,
    ],
  };

  return [secSpouse, secSexuality];
}

// ============================================================================
// DYNAMIC CHAPTER 7: HEALTH, TRIDOSHA & EXACT HIGH-RISK ORGANS
// ============================================================================
export function computeDynamicHealthSections(chart: ChartData): ChapterSection[] {
  const asc = chart.ascendant;
  const ascElem = SIGNS[asc.signIndex].element;
  const h6Sign = (asc.signIndex + 5) % 12;
  const h6Lord = SIGNS[h6Sign].lord;
  const h6LordPlanet = chart.planets.find((p) => p.id === h6Lord);
  const h8Sign = (asc.signIndex + 7) % 12;
  const h8Lord = SIGNS[h8Sign].lord;
  const h8LordPlanet = chart.planets.find((p) => p.id === h8Lord);
  const saturn = chart.planets.find((p) => p.id === 'Saturn')!;
  const mars = chart.planets.find((p) => p.id === 'Mars')!;

  // Ayurvedic Tridosha by Ascendant Element & Sign
  let tridoshaEn = '';
  let tridoshaHi = '';
  if (ascElem === 'Fire') {
    tridoshaEn = 'Pitta Dominant (High Metabolic Heat, Acidity, Inflammation, Blood Pressure Fluctuations)';
    tridoshaHi = 'पित्त प्रधान प्रकृति (तीव्र जठराग्नि, अम्लता/एसिडिटी, रक्त विकार व दाह की संवेदनशीलता)';
  } else if (ascElem === 'Earth') {
    tridoshaEn = 'Vata-Kapha Dominant (Sluggish Digestion, Joint Stiffness, Dry Skin, Metabolic Inertia)';
    tridoshaHi = 'वात-कफ प्रधान प्रकृति (पाचन का धीमा होना, जोड़ों में जकड़न, त्वचा का सूखापन व आलस्य)';
  } else if (ascElem === 'Air') {
    tridoshaEn = 'Vata Dominant (Nervous Exhaustion, Insomnia, Dry Cough, Anxiety Somatization)';
    tridoshaHi = 'प्रचंड वात प्रधान प्रकृति (स्नायु दुर्बलता, अनिद्रा, अत्यधिक चिंता व मांसपेशियों में खिंचाव)';
  } else {
    tridoshaEn = 'Kapha-Pitta Dominant (Fluid Retention, Respiratory Allergies, Liver Congestion)';
    tridoshaHi = 'कफ-पित्त प्रधान प्रकृति (जल संतुलन, कफ-एलर्जी, लिवर व हार्मोनल संवेदनशीलता)';
  }

  // Exact High-Risk Organs derived from 6th House Sign (Aries to Pisces)
  const ORGAN_SYSTEMS: Record<number, { en: string; hi: string }> = {
    0: { en: 'Cranial circulation, migraines, head injuries, fevers, and blood pressure.', hi: 'सिर, मस्तिष्क की नसें, माइग्रेन, सिर में चोट, बुखार और रक्तचाप।' },
    1: { en: 'Throat, thyroid gland, vocal cords, tonsils, and cervical spine.', hi: 'गला, थायरॉयड ग्रंथि, स्वर तंत्रिकाएं, टॉन्सिल्स और गर्दन की नसें।' },
    2: { en: 'Lungs, respiratory tract, nervous exhaustion, shoulders, and asthma.', hi: 'फेफड़े, श्वसन तंत्र, स्नायु दुर्बलता, कंधे और सांस की एलर्जी।' },
    3: { en: 'Stomach, digestive juices, gastric lining, chest, and psychosomatic ulcers.', hi: 'पेट, पाचन रस, जठराग्नि, छाती और तनाव जनित अल्सर/एसिडिटी।' },
    4: { en: 'Heart, cardiovascular rhythm, spine, eyesight, and metabolic vitality.', hi: 'हृदय, रक्त संचार, रीढ़ की हड्डी, आंखों की रोशनी और जीवन शक्ति।' },
    5: { en: 'Intestines, gut microbiome, IBS, nervous digestion, and food intolerances.', hi: 'आंतें, गट माइक्रोबायोम, कोलाइटिस/IBS, पेट की गैस और भोजन से एलर्जी।' },
    6: { en: 'Kidneys, lumbar vertebrae, urinary tract, and sugar metabolism (diabetes).', hi: 'गुर्दे (किडनी), कमर की रीढ़, मूत्र प्रणाली और शुगर/मधुमेह का संतुलन।' },
    7: { en: 'Excretory organs, colon, pelvic circulation, piles/fistula, and prostate/secret ailments.', hi: 'मलाशय, गुप्त जननांग, बवासीर/फिस्टुला और पेल्विक क्षेत्र की संवेदनशीलता।' },
    8: { en: 'Liver efficiency, arterial circulation, hips, thighs, and high cholesterol.', hi: 'यकृत (लिवर), धमनियों का रक्त प्रवाह, कूल्हे, जांघें और कोलेस्ट्रॉल।' },
    9: { en: 'Knees, bones, joint stiffness, chronic rheumatism, teeth, and skin dryness.', hi: 'घुटने, हड्डियां, जोड़ों में दर्द, गठिया (आर्थराइटिस), दांत और त्वचा का रूखापन।' },
    10: { en: 'Calves, shins, peripheral circulation, varicose veins, and nervous tremors.', hi: 'पिंडलियां, एड़ियां, रक्त वाहिकाएं (वेरिकोज वेन्स) और नसों में कंपन।' },
    11: { en: 'Feet, lymphatic drainage, immune sluggishness, sleep apnea, and psychosomatic fatigue.', hi: 'पैर के पंजे, लसिका तंत्र (लिम्फैटिक), रोग प्रतिरोधक क्षमता और अनिद्रा।' },
  };

  const organProfile = ORGAN_SYSTEMS[h6Sign] ?? ORGAN_SYSTEMS[5];

  // Dynamic Critical Health Years from 6th & 8th Lord Activation Ages
  const lordAges: Record<string, number[]> = {
    Sun: [22, 34, 46, 58],
    Moon: [24, 36, 48, 60],
    Mars: [28, 40, 52, 64],
    Mercury: [17, 32, 45, 57],
    Jupiter: [16, 32, 48, 62],
    Venus: [25, 37, 49, 61],
    Saturn: [19, 36, 54, 72],
    Rahu: [18, 42, 60],
    Ketu: [18, 48, 66],
  };

  const criticalYears = Array.from(
    new Set([...(lordAges[h6Lord] || [28, 46]), ...(lordAges[h8Lord] || [36, 54])])
  ).sort((a, b) => a - b).slice(0, 6);

  // Anga-Bhanga (Physical Disability / Injury Risk) - Saravali Ch. 21
  const hasAngaBhangaRisk = [6, 8, 12].includes(saturn.rasiHouseNumber) ||
    [6, 8].includes(mars.rasiHouseNumber) ||
    h6Lord === asc.signLord;

  const sec1: ChapterSection = {
    titleEn: 'Ayurvedic Constitution (Tridosha) & High-Risk Organ Systems',
    titleHi: 'आयुर्वेदिक त्रिदोष संतुलन एवं संवेदनशील अंग प्रणालियां',
    leadEn: `The elemental biological vulnerabilities of your ${asc.signName} Ascendant and 6th house in ${SIGNS[h6Sign].name}.`,
    leadHi: `आपके '${SIGN_HI[asc.signIndex]}' लग्न के त्रिदोष एवं षष्ठ भाव ('${SIGN_HI[h6Sign]}') के आधार पर शारीरिक संवेदनशीलता।`,
    paragraphsEn: [
      `Your Constitutional Baseline: ${tridoshaEn}. When you undergo sustained emotional stress, your body converts mental anxiety directly into somatic illness.`,
      `Your 6th house of ailments falls in ${SIGNS[h6Sign].name} governed by ${h6Lord}. The most sensitive organ networks in your biology are: ${organProfile.en} Preventative dietary habits and daily yogic alignment of these systems will save you from major medical interventions.`,
    ],
    paragraphsHi: [
      `आपकी मूल त्रिदोष प्रकृति: ${tridoshaHi}। जब भी आप लंबे समय तक मानसिक तनाव में रहते हैं, आपका शरीर उस तनाव को तुरंत शारीरिक व्याधियों में बदल देता है।`,
      `रोग भाव (षष्ठ) '${SIGN_HI[h6Sign]}' राशि में है जिसके स्वामी '${PLANET_HI[h6Lord] || h6Lord}' हैं। आपके शरीर के सर्वाधिक संवेदनशील अंग: ${organProfile.hi} खान-पान में संयम और नियमित योग द्वारा इन अंगों को स्वस्थ रखना दीर्घायु की कुंजी है।`,
    ],
    astrologicalCauseEn: `Saravali (Ch. 21 - Anga Lakshana) & Phaladeepika (Ch. 14 - Roga Nirupanam): 6th house in ${SIGNS[h6Sign].name} ruled by ${h6Lord} (House ${h6LordPlanet?.rasiHouseNumber || 6}) determines bodily vulnerability.`,
    astrologicalCauseHi: `शास्त्रीय कारण: सारावली (अध्याय २१) एवं फलदीपिका (अध्याय १४ - रोगनिर्णयाध्यायः): षष्ठ भाव '${SIGN_HI[h6Sign]}' (स्वामी: ${PLANET_HI[h6Lord] || h6Lord}) शारीरिक व्याधियों के संवेदनशील अंगों का निर्धारण करता है।`,
    keyPointsEn: [
      `Ayurvedic Tridosha: ${tridoshaEn}`,
      `High-Risk Organs: ${organProfile.en}`,
      `6th House Lord: ${h6Lord} in House ${h6LordPlanet?.rasiHouseNumber || 6}`,
    ],
    keyPointsHi: [
      `आयुर्वेदिक त्रिदोष: ${tridoshaHi}`,
      `संवेदनशील अंग: ${organProfile.hi}`,
      `षष्ठेश: '${PLANET_HI[h6Lord] || h6Lord}' (भाव ${h6LordPlanet?.rasiHouseNumber || 6})`,
    ],
  };

  const sec2: ChapterSection = {
    titleEn: 'Physical Impairment (Anga-Bhanga) Diagnostic & Critical Health Years',
    titleHi: 'अंग-दोष, शारीरिक अक्षमता परीक्षण एवं संकट के संवेदनशील वर्ष',
    leadEn: `Classical Saravali assessment of vulnerability to permanent injury, surgeries, and milestone years.`,
    leadHi: `सारावली सम्मत दुर्घटना, शल्यक्रिया व अंग-दोष का परीक्षण तथा जीवन के संवेदनशील स्वास्थ्य वर्ष।`,
    paragraphsEn: [
      `Classical Anga-Bhanga Diagnostic: ${hasAngaBhangaRisk ? 'Your chart indicates moderate vulnerability to physical injuries, particularly to the lower limbs, spine, or head during high-velocity activities, sports, or falls. You must exercise strict caution while driving and avoid extreme, uncalculated physical risks during Mars and Saturn dasha cycles.' : 'Your chart is largely protected from congenital physical disability or permanent limb impairment. Normal health hygiene and active mobility preserve structural integrity.'}`,
      `Critical Astrological Health Milestones: Ages ${criticalYears.join(', ')} represent sensitive planetary junctions when 6th lord (${h6Lord}), 8th lord (${h8Lord}), or nodal cycles activate health tests. During these specific age milestones, prioritize preventative medical checkups, clean satvik diet, and avoid reckless driving.`,
    ],
    paragraphsHi: [
      `अंग-दोष एवं शारीरिक अक्षमता परीक्षण: ${hasAngaBhangaRisk ? 'आपकी कुंडली में कमर से नीचे के अंगों, पैरों, अथवा रीढ़ की हड्डी के प्रति संवेदनशीलता और आकस्मिक चोट/सर्जरी का मध्यम जोखिम दिखाई देता है। वाहन चलाते समय, ऊंचाई पर कार्य करते समय अथवा खेलकूद में अतिरिक्त सावधानी बरतनी अनिवार्य है।' : 'आपकी कुंडली किसी जन्मजात शारीरिक अक्षमता से सुरक्षित है; नियमित व्यायाम और सात्विक दिनचर्या द्वारा आपका शरीर दीर्घकाल तक सुदृढ़ रहेगा।'}`,
      `स्वास्थ्य व संकट के संवेदनशील वर्ष: ${criticalYears.join(', ')}वां वर्ष जीवन में स्वास्थ्य व दुर्घटना की दृष्टि से संवेदनशील कालखंड हैं। इन वर्षों में अपने स्वास्थ्य के प्रति रत्ती भर भी लापरवाही न बरतें और नियमित रूप से महामृत्युंजय मंत्र का स्मरण करें।`,
    ],
    astrologicalCauseEn: `Saravali (Ch. 21 - Anga Bhanga Adhyaya) & BPHS (Ch. 16): 6th lord ${h6Lord} and 8th lord ${h8Lord} define critical age markers: ${criticalYears.join(', ')}.`,
    astrologicalCauseHi: `शास्त्रीय कारण: सारावली (अध्याय २१ - अङ्गभङ्गाध्यायः) एवं बृहत्पाराशर होराशास्त्र: षष्ठेश '${PLANET_HI[h6Lord] || h6Lord}' व अष्टमेश '${PLANET_HI[h8Lord] || h8Lord}' संकट वर्षों (${criticalYears.join(', ')} वर्ष) को चिन्हित करते हैं।`,
    keyPointsEn: [
      `Anga-Bhanga Status: ${hasAngaBhangaRisk ? 'Moderate Vulnerability (Caution in driving & high-velocity activity)' : 'Protected from congenital impairment'}`,
      `Critical Health Years: Ages ${criticalYears.join(', ')}`,
      `Protective Shield: Mahamrityunjaya Japa during active transit crossroads.`,
    ],
    keyPointsHi: [
      `अंग-दोष स्थिति: ${hasAngaBhangaRisk ? 'मध्यम संवेदनशीलता (वाहन व ऊंचाई पर सतर्कता आवश्यक)' : 'जन्मजात दोषों से पूर्णतः सुरक्षित'}`,
      `संवेदनशील स्वास्थ्य वर्ष: ${criticalYears.join(', ')}वां वर्ष`,
      `रक्षा कवच: महामृत्युंजय मंत्र का नित्य स्मरण।`,
    ],
  };

  return [sec1, sec2];
}

// ============================================================================
// DYNAMIC CHAPTER 8: 15 TO 75 YEARS CHRONOLOGY (12 INDIVIDUAL 5-YEAR EPOCHS)
// ============================================================================
export function computeDynamic12Epochs(chart: ChartData): ChapterSection[] {
  const birthDate = new Date(chart.input.date);
  const birthYear = Number.isNaN(birthDate.getTime()) ? null : birthDate.getFullYear();
  const birthMs = birthDate.getTime();
  const periods = chart.vimshottari ?? [];
  const epochs = [
    [15, 20, 'Adolescence and foundations', 'किशोरावस्था और आधार निर्माण'],
    [21, 25, 'Early adulthood and independence', 'प्रारंभिक वयस्कता और स्वावलंबन'],
    [26, 30, 'Personal direction and choices', 'जीवन-दिशा और महत्वपूर्ण चयन'],
    [31, 35, 'Responsibilities and consolidation', 'उत्तरदायित्व और स्थायित्व'],
    [36, 40, 'Midlife review and priorities', 'मध्य आयु में प्राथमिकताओं का पुनर्मूल्यांकन'],
    [41, 45, 'Resources and long-term planning', 'संसाधन और दीर्घकालीन योजना'],
    [46, 50, 'Wellbeing and sustainable routines', 'कल्याण और संतुलित दिनचर्या'],
    [51, 55, 'Mentoring and family responsibilities', 'मार्गदर्शन और पारिवारिक उत्तरदायित्व'],
    [56, 60, 'Experience and changing roles', 'अनुभव और बदलती भूमिकाएँ'],
    [61, 65, 'Reflection and purposeful activity', 'आत्मचिंतन और सार्थक गतिविधियाँ'],
    [66, 70, 'Knowledge-sharing and simplicity', 'ज्ञान-साझाकरण और सरलता'],
    [71, 75, 'Meaning, values and reflection', 'जीवनार्थ, मूल्य और आत्मचिंतन'],
  ] as const;
  const houseThemes: Record<number, { en: string; hi: string }> = {
    1: { en: 'identity, vitality and personal direction', hi: 'व्यक्तित्व, ऊर्जा और व्यक्तिगत दिशा' },
    2: { en: 'family, resources, speech and values', hi: 'परिवार, संसाधन, वाणी और मूल्य' },
    3: { en: 'initiative, skills, communication and effort', hi: 'पहल, कौशल, संवाद और प्रयास' },
    4: { en: 'home, education, emotional security and property', hi: 'घर, शिक्षा, भावनात्मक सुरक्षा और संपत्ति' },
    5: { en: 'learning, creativity, discernment and children', hi: 'अध्ययन, रचनात्मकता, विवेक और संतान' },
    6: { en: 'service, routines, competition and problem-solving', hi: 'सेवा, दिनचर्या, प्रतिस्पर्धा और समस्या-समाधान' },
    7: { en: 'partnerships, agreements and public dealings', hi: 'साझेदारी, समझौते और सार्वजनिक व्यवहार' },
    8: { en: 'change, shared resources, research and uncertainty', hi: 'परिवर्तन, साझा संसाधन, अनुसंधान और अनिश्चितता' },
    9: { en: 'learning, mentors, principles and long journeys', hi: 'अध्ययन, गुरु, सिद्धांत और लंबी यात्राएँ' },
    10: { en: 'career, responsibility, status and contribution', hi: 'करियर, उत्तरदायित्व, पद और योगदान' },
    11: { en: 'networks, aspirations, gains and communities', hi: 'संपर्क, आकांक्षाएँ, लाभ और समुदाय' },
    12: { en: 'expenses, rest, retreat, foreign links and spirituality', hi: 'व्यय, विश्राम, एकांत, विदेश-संबंध और अध्यात्म' },
  };
  const sections: ChapterSection[] = [];

  for (const [index, epoch] of epochs.entries()) {
    const [startAge, endAge, themeEn, themeHi] = epoch;
    const midAge = (startAge + endAge) / 2;
    const midMs = birthMs + midAge * 365.25 * 86400000;
    const path = Number.isNaN(birthMs) ? [] : findActiveDashaPath(periods, midMs);
    const md = path[0]?.lord;
    const ad = path[1]?.lord;
    const mdPlanet = md ? chart.planets.find((p) => p.id === md) : undefined;
    const adPlanet = ad ? chart.planets.find((p) => p.id === ad) : undefined;
    const mdHouse = mdPlanet?.rasiHouseNumber;
    const adHouse = adPlanet?.rasiHouseNumber;
    const yearSpanEn = birthYear === null ? '' : ` · ${birthYear + startAge}–${birthYear + endAge} CE`;
    const yearSpanHi = birthYear === null ? '' : ` · ${birthYear + startAge}–${birthYear + endAge} ईस्वी`;

    const activeTextEn = md && ad
      ? `At the midpoint of this age band, the available Vimshottari sequence shows ${md} Mahadasha and ${ad} Antardasha. Their natal placements connect with ${mdHouse ? `house ${mdHouse} (${houseThemes[mdHouse]?.en ?? 'a chart-specific life area'})` : 'an unavailable natal house'} and ${adHouse ? `house ${adHouse} (${houseThemes[adHouse]?.en ?? 'a chart-specific life area'})` : 'an unavailable natal house'}.`
      : 'The available Vimshottari data does not provide a complete period path for the midpoint of this age band; no timing claim is made.';
    const activeTextHi = md && ad
      ? `इस आयु-खंड के मध्य में उपलब्ध विंशोत्तरी क्रम के अनुसार ${PLANET_HI[md] || md} महादशा और ${PLANET_HI[ad] || ad} अंतर्दशा आती है। इनके जन्मकुंडली-स्थित भाव ${mdHouse ? `भाव ${mdHouse} (${houseThemes[mdHouse]?.hi ?? 'कुंडली का संबंधित जीवन क्षेत्र'})` : 'अज्ञात'} तथा ${adHouse ? `भाव ${adHouse} (${houseThemes[adHouse]?.hi ?? 'कुंडली का संबंधित जीवन क्षेत्र'})` : 'अज्ञात'} हैं।`
      : 'उपलब्ध विंशोत्तरी डेटा में इस आयु-खंड के मध्य की पूरी दशा-श्रृंखला नहीं मिली; इसलिए समय-संबंधी दावा नहीं किया जा रहा है।';

    const section: ChapterSection = {
      titleEn: `Epoch ${index + 1} (Ages ${startAge}–${endAge}${yearSpanEn}): ${themeEn}`,
      titleHi: `पड़ाव ${index + 1} (आयु ${startAge}–${endAge} वर्ष${yearSpanHi}): ${themeHi}`,
      leadEn: 'This is an age-band reflection, not a prediction that a specific event will occur.',
      leadHi: 'यह आयु-खंड आधारित आत्मचिंतन है, किसी निश्चित घटना की भविष्यवाणी नहीं।',
      paragraphsEn: [
        activeTextEn,
        `In traditional Jyotish, these placements can be read as periods when the themes of ${themeEn.toLowerCase()} and the connected house topics may receive attention. This does not establish marriage, promotion, illness, wealth, loss or any other event.`,
      ],
      paragraphsHi: [
        activeTextHi,
        `पारंपरिक ज्योतिष में इन स्थितियों को ऐसे समय के संकेत के रूप में पढ़ा जा सकता है जब “${themeHi}” और संबंधित भावों के विषयों पर ध्यान जा सकता है। इससे विवाह, पदोन्नति, बीमारी, धन, हानि या किसी अन्य घटना का होना सिद्ध नहीं होता।`,
      ],
      astrologicalCauseEn: 'The dasha lords are read through their natal house placements at the midpoint of this age band. This layer does not include transit confirmation or event-specific combinations.',
      astrologicalCauseHi: 'शास्त्रीय कारण (पारंपरिक पद्धति का संदर्भ): इस आयु-खंड के मध्य की दशा के स्वामियों को उनकी जन्मकुंडली में स्थित भावों से पढ़ा गया है। इस स्तर पर गोचर-पुष्टि या घटना-विशिष्ट योग शामिल नहीं हैं।',
      keyPointsEn: [
        `Age band: ${startAge}–${endAge}`,
        md ? `Mahadasha at midpoint: ${md}` : 'Mahadasha: unavailable',
        ad ? `Antardasha at midpoint: ${ad}` : 'Antardasha: unavailable',
        `Themes: ${mdHouse ? houseThemes[mdHouse]?.en ?? 'natal house theme' : 'not available'}; ${adHouse ? houseThemes[adHouse]?.en ?? 'natal house theme' : 'not available'}`,
      ],
      keyPointsHi: [
        `आयु-खंड: ${startAge}–${endAge} वर्ष`,
        md ? `मध्य की महादशा: ${PLANET_HI[md] || md}` : 'महादशा: उपलब्ध नहीं',
        ad ? `मध्य की अंतर्दशा: ${PLANET_HI[ad] || ad}` : 'अंतर्दशा: उपलब्ध नहीं',
        `विषय: ${mdHouse ? houseThemes[mdHouse]?.hi ?? 'भाव विषय' : 'उपलब्ध नहीं'}; ${adHouse ? houseThemes[adHouse]?.hi ?? 'भाव विषय' : 'उपलब्ध नहीं'}`,
      ],
    };
    sections.push(section);
  }

  return sections;
}
