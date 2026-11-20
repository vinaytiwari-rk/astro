/**
 * AV Astro Vibe — Classical Ascendant Wise Prediction Engine (लग्नवार विस्तृत फलादेश)
 * 
 * Provides comprehensive classical Parashari predictions for all 12 Ascendants (मेष से मीन):
 * - लग्न स्वरूप, व्यक्तित्व एवं मनोवृत्ति (Temperament, Vitality & Physical Stature)
 * - योगकारक, शुभ, मारक एवं बाधक ग्रह (Functional Lordship, Benefics & Marakas)
 * - धन, कुटुंब एवं आर्थिक उत्कर्ष काल (Wealth Accumulation & Financial Peaks)
 * - दांपत्य जीवन एवं जीवनसाथी का स्वभाव (Marriage, 7th House & Spousal Dynamics)
 * - करियर, आजीविका एवं प्रतिष्ठा के सर्वश्रेष्ठ क्षेत्र (Optimal Professions & Career Rise)
 * - स्वास्थ्य, सावधानियां एवं प्रमुख भाग्योदय वर्ष (Health Nuance & Milestone Breakthrough Ages)
 * - इष्टदेव, रत्न एवं वैदिक लग्न शुद्धि उपाय (Ishta Devata, Gemstones & Remedies)
 * - कुंडली के लग्नेश की तात्कालिक स्थिति अनुसार जातक-विशिष्ट फलादेश
 * 
 * AV Astro Vibe — Strictly Zero Emojis, 100% Classical Vedic Math
 */

import { NAKSHATRAS, SIGNS } from '../constants';
import type { ChartData, PlanetId } from '../types';

export interface AscendantMasterProfile {
  signIndex: number;
  nameHi: string;
  nameEn: string;
  sanskritName: string;
  elementHi: string;
  elementEn: string;
  lord: PlanetId;
  lordHi: string;
  lordEn: string;
  symbolHi: string;
  symbolEn: string;
  personalityHi: string;
  personalityEn: string;
  functionalBeneficsHi: string;
  functionalBeneficsEn: string;
  functionalMaleficsHi: string;
  functionalMaleficsEn: string;
  badhakaInfoHi: string;
  badhakaInfoEn: string;
  dhanaAndProsperityHi: string;
  dhanaAndProsperityEn: string;
  marriageAndSpouseHi: string;
  marriageAndSpouseEn: string;
  careerAndProfessionHi: string;
  careerAndProfessionEn: string;
  healthAndMilestonesHi: string;
  healthAndMilestonesEn: string;
  remediesAndDeityHi: string;
  remediesAndDeityEn: string;
  milestoneAges: number[];
}

export const ASCENDANT_MASTER_DATA: Record<number, AscendantMasterProfile> = {
  0: {
    signIndex: 0,
    nameHi: 'मेष लग्न (Aries Ascendant)',
    nameEn: 'Aries Ascendant (Mesha Lagna)',
    sanskritName: 'मेष',
    elementHi: 'अग्नि तत्व (चर राशि)',
    elementEn: 'Fire Element (Cardinal Sign)',
    lord: 'Mars',
    lordHi: 'मंगल (Mars)',
    lordEn: 'Mars',
    symbolHi: 'मेढ़ा (Ram)',
    symbolEn: 'Ram',
    personalityHi: 'मेष लग्न के जातक अदम्य साहसी, ऊर्जावान, स्वतंत्र चेता और स्वभाव से निर्भीक होते हैं। मंगल के प्रभाव से इनमें निर्णय लेने की तीव्र क्षमता और नेतृत्व का स्वाभाविक गुण होता है। ये किसी के अधीन कार्य करने की अपेक्षा स्वयं का मार्ग बनाना पसंद करते हैं। चेहरे पर तेज अथवा कोई विशिष्ट चिन्ह होता है।',
    personalityEn: 'Aries ascendant natives are intrepid, energetic, pioneering, and fiercely independent. Ruled by Mars, they possess swift decision-making, natural executive leadership, and high vitality. They prefer initiating ventures over subordination.',
    functionalBeneficsHi: 'सूर्य (पंचमेश - परम मित्र), गुरु (नवमेश - परम भाग्य विधाता) एवं मंगल (लग्नेश)। गुरु और सूर्य मेष लग्न के लिए सर्वोच्च योगकारक सिद्ध होते हैं।',
    functionalBeneficsEn: 'Sun (5th lord of intelligence & purva punya), Jupiter (9th lord of highest fortune & dharma), and Mars (Lagna lord). Sun and Jupiter are prime benefics.',
    functionalMaleficsHi: 'शुक्र (द्वितीय व सप्तमेश होने से प्रबल मारक), बुध (तृतीय व षष्ठेश होने से परम शत्रु/रोगेश) एवं शनि (दशम व एकादशेश होने से बाधक व सम-अशुभ)।',
    functionalMaleficsEn: 'Venus (2nd and 7th lord — strong Maraka), Mercury (3rd and 6th lord — functional adversary of disease/debt), and Saturn (11th lord — Badhaka).',
    badhakaInfoHi: 'मेष चर राशि है, अतः एकादश भाव (कुंभ राशि - शनि) बाधक स्थान है। शनि की अंतर्दशा में लाभ में विघ्न अथवा बड़े भाइयों से मतभेद संभव।',
    badhakaInfoEn: 'As a cardinal sign, the 11th house (Aquarius ruled by Saturn) acts as Badhaka sthana.',
    dhanaAndProsperityHi: 'द्वितीय भाव में वृषभ (शुक्र) तथा एकादश में कुंभ (शनि) होने से जातक अपनी बाहुबल व साहस से धन अर्जित करता है। पंचमेश सूर्य व नवमेश गुरु की दशा में जातक असाधारण आर्थिक समृद्धि व पैतृक संपत्ति प्राप्त करता है।',
    dhanaAndProsperityEn: 'Financial wealth accumulates steadily through personal enterprise and courageous pursuits. Major wealth yogas activate during Sun and Jupiter dasha periods.',
    marriageAndSpouseHi: 'सप्तम भाव में तुला राशि होने से जीवनसाथी सौम्य, सुंदर, कलाप्रिय, संतुलित व सुरुचिपूर्ण होता है। वैवाहिक जीवन में संतुलन बनाए रखने हेतु जातक को अपने उग्र स्वभाव व क्रोध पर संयम रखना चाहिए।',
    marriageAndSpouseEn: 'With Libra on the 7th house, the spouse is diplomatic, cultured, aesthetically inclined, and peace-loving. Marital harmony requires the native to moderate impetuousness.',
    careerAndProfessionHi: 'सेना, पुलिस, प्रशासनिक सेवाएं (IAS/IPS), रक्षा, शल्य चिकित्सा (Surgeon), अभियांत्रिकी, खेलकूद, भूमि-भवन निर्माण, धातु उद्योग एवं स्वतंत्र उद्यमिता।',
    careerAndProfessionEn: 'Defense, police, civil administration, surgery, engineering, athletics, real estate development, metallurgy, and executive entrepreneurship.',
    healthAndMilestonesHi: 'सिरदर्द, रक्तचाप, नेत्र विकार, पित्त प्रकोप एवं ज्वर के प्रति सतर्क रहें। जीवन के महत्वपूर्ण भाग्योदय वर्ष: 16, 21, 28, 32, 36 एवं 42 वर्ष।',
    healthAndMilestonesEn: 'Prone to headaches, blood pressure fluctuations, high pitta (heat), and fevers. Crucial breakthrough milestone ages: 16, 21, 28, 32, 36, and 42.',
    remediesAndDeityHi: 'इष्टदेव: भगवान कार्तिकेय अथवा श्री हनुमान जी। शुभ रत्न: लाल मूंगा (त्रिकोणीय) एवं माणिक्य। नित्य हनुमान चालीसा का पाठ व गायत्री मंत्र जप अत्यंत लाभकारी है।',
    remediesAndDeityEn: 'Ishta Devata: Lord Kartikeya or Hanuman. Favorable gemstones: Red Coral and Ruby. Daily recitation of Hanuman Chalisa strengthens vitality.',
    milestoneAges: [16, 21, 28, 32, 36, 42],
  },

  1: {
    signIndex: 1,
    nameHi: 'वृषभ लग्न (Taurus Ascendant)',
    nameEn: 'Taurus Ascendant (Vrishabha Lagna)',
    sanskritName: 'वृषभ',
    elementHi: 'पृथ्वी तत्व (स्थिर राशि)',
    elementEn: 'Earth Element (Fixed Sign)',
    lord: 'Venus',
    lordHi: 'शुक्र (Venus)',
    lordEn: 'Venus',
    symbolHi: 'बैल (Bull)',
    symbolEn: 'Bull',
    personalityHi: 'वृषभ लग्न के जातक स्थिर, धैर्यवान, व्यावहारिक, कलाप्रेमी एवं अत्यंत परिश्रमी होते हैं। शुक्र के प्रभाव से इनमें सुरुचि, सौंदर्यबोध एवं भौतिक सुखों के प्रति स्वाभाविक आकर्षण होता है। ये किसी भी निर्णय पर दृढ़ रहते हैं और विश्वसनीयता इनके व्यक्तित्व की प्रमुख पहचान है।',
    personalityEn: 'Taurus ascendant natives are dependable, patient, pragmatic, cultured, and determined. Governed by Venus, they appreciate fine arts, stability, financial security, and aesthetic elegance.',
    functionalBeneficsHi: 'शनि (नवमेश व दशमेश होने से वृषभ लग्न का परम योगकारक राजयोग प्रदाता), बुध (द्वितीय व पंचमेश - धनेश) एवं शुक्र (लग्नेश)।',
    functionalBeneficsEn: 'Saturn (9th lord of fortune and 10th lord of profession — supreme Yogakaraka), Mercury (2nd and 5th lord of wealth), and Venus (Lagna lord).',
    functionalMaleficsHi: 'गुरु (अष्टम व एकादशेश होने से अत्यंत पापी/मारक), मंगल (सप्तमेश व द्वादशेश होने से मारक) एवं चंद्र (तृतीयेश)।',
    functionalMaleficsEn: 'Jupiter (lord of 8th and 11th — functional malefic), Mars (7th and 12th lord — Maraka), and Moon (3rd lord).',
    badhakaInfoHi: 'वृषभ स्थिर राशि है, अतः नवम भाव (मकर - शनि) बाधक स्थान बनता है, यद्यपि शनि योगकारक होने से बाधक दोष बहुत न्यून हो जाता है।',
    badhakaInfoEn: 'As a fixed sign, the 9th house acts as Badhaka, though Saturn’s Yogakaraka status substantially softens negative impacts.',
    dhanaAndProsperityHi: 'बुध (धनेश) और शनि (भाग्येश) की कृपा से वृषभ लग्न के जातक वित्तीय प्रबंधन, संचित पूंजी, भूमि, आभूषण व स्थायी संपत्ति निर्माण में निपुण होते हैं। शनि-बुध दशा में अपार लक्ष्मी योग बनता है।',
    dhanaAndProsperityEn: 'Governed by Mercury (2nd) and Saturn (9th), natives excel in wealth accumulation, fixed assets, jewelry, banking, and real estate.',
    marriageAndSpouseHi: 'सप्तम भाव में वृश्चिक राशि (मंगल) होने से जीवनसाथी गहन, भावुक, आत्मविश्वासी, निष्ठावान किंतु कभी-कभी हठी अथवा अधिकार जताने वाला हो सकता है।',
    marriageAndSpouseEn: 'With Scorpio on the 7th house, the spouse is intense, loyal, intuitive, passionate, and deeply committed.',
    careerAndProfessionHi: 'बैंकिंग, वित्त, सौंदर्य प्रसाधन, आभूषण, इंटीरियर डिजाइनिंग, कला, संगीत, होटल, कृषि, वस्त्र उद्योग, एवं विलासिता उत्पाद व्यापार।',
    careerAndProfessionEn: 'Banking, investment finance, luxury goods, jewelry, interior design, culinary arts, real estate, hospitality, fashion, and agro-industries.',
    healthAndMilestonesHi: 'गला, स्वरयंत्र (Throat), थायरॉइड, कफ विकार एवं मधुमेह के प्रति सावधानी रखें। महत्वपूर्ण भाग्योदय वर्ष: 25, 28, 36, 42 एवं 48 वर्ष।',
    healthAndMilestonesEn: 'Prone to throat ailments, thyroid imbalance, and metabolic concerns. Milestone awakening ages: 25, 28, 36, 42, and 48.',
    remediesAndDeityHi: 'इष्टदेव: मां महालक्ष्मी अथवा मां दुर्गा। शुभ रत्न: श्वेत पुखराज अथवा हीरा/ओपल एवं पन्ना। श्री सूक्त का पाठ एवं शुक्रवार को श्वेत वस्तुओं का दान कल्याणकारी है।',
    remediesAndDeityEn: 'Ishta Devata: Goddess Lakshmi. Gemstones: Diamond/White Sapphire and Emerald. Regular chanting of Sri Sukta ensures material and spiritual ease.',
    milestoneAges: [25, 28, 36, 42, 48],
  },

  2: {
    signIndex: 2,
    nameHi: 'मिथुन लग्न (Gemini Ascendant)',
    nameEn: 'Gemini Ascendant (Mithuna Lagna)',
    sanskritName: 'मिथुन',
    elementHi: 'वायु तत्व (द्विस्वभाव राशि)',
    elementEn: 'Air Element (Dual Sign)',
    lord: 'Mercury',
    lordHi: 'बुध (Mercury)',
    lordEn: 'Mercury',
    symbolHi: 'स्त्री-पुरुष युगल (Twins)',
    symbolEn: 'Twins',
    personalityHi: 'मिथुन लग्न के जातक कुशाग्र बुद्धि, बहुमुखी प्रतिभा (Multi-talented), तीव्र संप्रेषण कला और हास्य-विनोद से युक्त होते हैं। बुध के प्रभाव से ये सीखने में अत्यंत उत्सुक, जिज्ञासु और सामाजिक होते हैं। एक साथ कई कार्यों को संभालने में इन्हें विशेष महारत हासिल होती है।',
    personalityEn: 'Gemini ascendant individuals are quick-witted, versatile, communicative, intellectually agile, and socially engaging. Governed by Mercury, they excel in articulate discourse and multitasking.',
    functionalBeneficsHi: 'शुक्र (पंचमेश व द्वादशेश - सर्वोत्तम शुभ व राजयोग कारक), बुध (लग्नेश व चतुर्थेश) एवं शनि (नवमेश भाग्य विधाता)।',
    functionalBeneficsEn: 'Venus (5th lord of higher intellect & romance — supreme benefic), Mercury (Lagna & 4th lord), and Saturn (9th lord of fortune).',
    functionalMaleficsHi: 'मंगल (षष्ठेश व एकादशेश होने से अत्यंत पापी/रोगेश), गुरु (सप्तमेश व दशमेश होने से केंद्राधिपति व बाधक दोष युक्त) एवं सूर्य (तृतीयेश)।',
    functionalMaleficsEn: 'Mars (6th and 11th lord — prime functional malefic), Jupiter (7th and 10th lord — Kendradhipati and Badhaka), and Sun (3rd lord).',
    badhakaInfoHi: 'मिथुन द्विस्वभाव राशि है, अतः सप्तम भाव (धनु राशि - गुरु) बाधक स्थान बनता है। गुरु दशा में व्यापारिक साझेदारी व दांपत्य में विशेष सजगता आवश्यक है।',
    badhakaInfoEn: 'As a dual sign, the 7th house (Sagittarius ruled by Jupiter) acts as Badhaka sthana.',
    dhanaAndProsperityHi: 'चंद्र (द्वितीयेश) और शुक्र (पंचमेश) की कृपा से जातक बौद्धिक संपदा, लेखन, व्यापार, शेयर बाजार, सलाहकारिता एवं सूचना तंत्र से प्रचुर धन अर्जित करता है।',
    dhanaAndProsperityEn: 'Wealth flows primarily through intellectual capital, advisory roles, communication, trading, technology, and commercial ventures.',
    marriageAndSpouseHi: 'सप्तम भाव में धनु राशि (गुरु) होने से जीवनसाथी ज्ञानी, धार्मिक, संस्कारी, मार्गदर्शक एवं उच्च नैतिक मूल्यों वाला होता है। वैवाहिक जीवन सामान्यतः सम्मानजनक व सुखद रहता है।',
    marriageAndSpouseEn: 'With Sagittarius on the 7th house, the spouse is righteous, educated, philosophically grounded, and a wise advisor.',
    careerAndProfessionHi: 'पत्रकारिता, मीडिया, लेखन, आईटी, सॉफ्टवेयर, शिक्षण, वकालत, वाणिज्य, व्यापार, संपादन, जनसंपर्क (PR), एवं बैंकिंग सलाहकारिता।',
    careerAndProfessionEn: 'Journalism, digital media, software engineering, pedagogy, legal counsel, commercial trading, publishing, public relations, and financial analytics.',
    healthAndMilestonesHi: 'श्वसन तंत्र (Lungs), कंधे, नसों की दुर्बलता (Nervous system) एवं तनाव के प्रति सजग रहें। महत्वपूर्ण भाग्योदय वर्ष: 22, 32, 35, 40 एवं 46 वर्ष।',
    healthAndMilestonesEn: 'Vulnerabilities: respiratory health, nervous system strain, and shoulder stiffness. Milestone breakthrough ages: 22, 32, 35, 40, and 46.',
    remediesAndDeityHi: 'इष्टदेव: भगवान श्री गणेश अथवा भगवान विष्णु। शुभ रत्न: पन्ना (कांस्य/स्वर्ण में) एवं ओपल। बुधवार को हरी मूंग अथवा गाय को हरा चारा खिलाना अत्यंत शुभ है।',
    remediesAndDeityEn: 'Ishta Devata: Lord Ganesha or Lord Vishnu. Gemstones: Emerald and Opal. Feeding green grass to cows on Wednesdays strengthens mental clarity.',
    milestoneAges: [22, 32, 35, 40, 46],
  },

  3: {
    signIndex: 3,
    nameHi: 'कर्क लग्न (Cancer Ascendant)',
    nameEn: 'Cancer Ascendant (Karka Lagna)',
    sanskritName: 'कर्क',
    elementHi: 'जल तत्व (चर राशि)',
    elementEn: 'Water Element (Cardinal Sign)',
    lord: 'Moon',
    lordHi: 'चंद्रमा (Moon)',
    lordEn: 'Moon',
    symbolHi: 'केंकड़ा (Crab)',
    symbolEn: 'Crab',
    personalityHi: 'कर्क लग्न के जातक अत्यंत संवेदनशील, करुणामयी, कल्पनाशील और पारिवारिक मूल्यों से ओतप्रोत होते हैं। चंद्रमा के प्रभाव से इनका मन दयालु, दूसरों की देखभाल करने वाला और अंतर्ज्ञान (Intuition) से संपन्न होता है। परिस्थितियों के प्रति इनकी ग्रहणशीलता तीव्र होती है।',
    personalityEn: 'Cancer ascendant natives are empathetic, imaginative, nurturing, family-oriented, and profoundly intuitive. Governed by the Moon, they possess deep emotional depth and protective instincts.',
    functionalBeneficsHi: 'मंगल (पंचमेश व दशमेश होने से कर्क लग्न का सर्वोच्च योगकारक राजयोग प्रदाता), गुरु (नवमेश व षष्ठेश - भाग्य विधाता) एवं चंद्रमा (लग्नेश)।',
    functionalBeneficsEn: 'Mars (5th and 10th lord — supreme Yogakaraka combining trine and quadrant), Jupiter (9th lord of fortune), and Moon (Lagna lord).',
    functionalMaleficsHi: 'शुक्र (चतुर्थ व एकादशेश होने से पापी व बाधक), बुध (तृतीय व द्वादशेश होने से व्ययेश/शत्रु) एवं शनि (सप्तम व अष्टमेश होने से प्रबल मारक)।',
    functionalMaleficsEn: 'Venus (4th and 11th lord — functional malefic & Badhaka), Mercury (3rd and 12th lord), and Saturn (7th and 8th lord — intense Maraka).',
    badhakaInfoHi: 'कर्क चर राशि है, अतः एकादश भाव (वृषभ - शुक्र) बाधक स्थान है। शुक्र की अंतर्दशा में बड़े मित्रों अथवा धन निवेश में सतर्कता आवश्यक है।',
    badhakaInfoEn: 'As a cardinal sign, the 11th house (Taurus ruled by Venus) functions as Badhaka sthana.',
    dhanaAndProsperityHi: 'सूर्य (द्वितीयेश) और मंगल (पंचम व दशमेश) की कृपा से जातक प्रशासनिक, अचल संपत्ति, जल उत्पाद एवं सरकारी सम्मान से प्रचुर धन उपार्जित करता है।',
    dhanaAndProsperityEn: 'Sun (2nd) and Mars (Yogakaraka) grant immense wealth through public administration, landed properties, and executive accomplishments.',
    marriageAndSpouseHi: 'सप्तम भाव में मकर राशि (शनि) होने से जीवनसाथी गंभीर, व्यावहारिक, अनुशासित, कर्तव्यनिष्ठ व थोड़ा अंतर्मुखी हो सकता है। विवाह में कुछ परिपक्वता के बाद गहरा स्थायित्व आता है।',
    marriageAndSpouseEn: 'With Capricorn on the 7th house, the spouse is mature, pragmatic, hard-working, disciplined, and stabilizing.',
    careerAndProfessionHi: 'प्रशासनिक सेवाएं, जल संसाधन, नौसेना, चिकित्सा, नर्सिंग, होटल प्रबंधन, डेयरी, रियल एस्टेट, मनोविज्ञान, एवं समाज कल्याण।',
    careerAndProfessionEn: 'Civil services, marine industries, healthcare, hospitality, dairy enterprise, psychology, public relations, and property management.',
    healthAndMilestonesHi: 'छाती, फेफड़े, पाचन तंत्र, कफ एवं मनोदशा (Mood swings) के प्रति सतर्क रहें। महत्वपूर्ण भाग्योदय वर्ष: 16, 22, 28, 32 एवं 36 वर्ष।',
    healthAndMilestonesEn: 'Vulnerabilities: digestive sensitivity, chest/respiratory congestion, and emotional stress. Milestone breakthrough ages: 16, 22, 28, 32, and 36.',
    remediesAndDeityHi: 'इष्टदेव: भगवान शिव एवं मां पार्वती। शुभ रत्न: मोती (चांदी में) एवं लाल मूंगा। सोमवार को शिवलिंग पर कच्चा दूध व जल अर्पित करना जीवन में स्थिरता लाता है।',
    remediesAndDeityEn: 'Ishta Devata: Lord Shiva and Mother Parvati. Gemstones: Natural Pearl and Red Coral. Regular Jalabhisheka on Shiva Lingam restores emotional equilibrium.',
    milestoneAges: [16, 22, 28, 32, 36],
  },

  4: {
    signIndex: 4,
    nameHi: 'सिंह लग्न (Leo Ascendant)',
    nameEn: 'Leo Ascendant (Simha Lagna)',
    sanskritName: 'सिंह',
    elementHi: 'अग्नि तत्व (स्थिर राशि)',
    elementEn: 'Fire Element (Fixed Sign)',
    lord: 'Sun',
    lordHi: 'सूर्य (Sun)',
    lordEn: 'Sun',
    symbolHi: 'सिंह (Lion)',
    symbolEn: 'Lion',
    personalityHi: 'सिंह लग्न के जातक स्वभाव से राजसी, आत्मविश्वासी, उदार, दृढ़ संकल्पी और प्रभावशाली व्यक्तित्व वाले होते हैं। सूर्य के आधिपत्य से इनमें स्वाभाविक तेज, स्वाभिमान, नेतृत्व क्षमता और सत्यप्रियता होती है। ये समाज में मान-सम्मान और उच्च प्रतिष्ठा के प्रति सदैव सजग रहते हैं।',
    personalityEn: 'Leo ascendant individuals are regal, magnanimous, authoritative, confident, and honorable. Ruled by the Sun, they emanate vitality, dignity, and natural command.',
    functionalBeneficsHi: 'मंगल (चतुर्थ व नवमेश होने से सर्वोच्च योगकारक राजयोग प्रदाता), गुरु (पंचमेश विद्या व बुद्धि) एवं सूर्य (लग्नेश)।',
    functionalBeneficsEn: 'Mars (4th and 9th lord — supreme Yogakaraka), Jupiter (5th lord of intellect and auspicious merit), and Sun (Lagna lord).',
    functionalMaleficsHi: 'शुक्र (तृतीय व दशमेश होने से अत्यंत प्रतिकूल), शनि (षष्ठ व सप्तमेश होने से प्रबल मारक व रोगेश) एवं बुध (द्वितीय व एकादशेश - सम/मारक)।',
    functionalMaleficsEn: 'Venus (3rd and 10th lord — functional enemy), Saturn (6th and 7th lord — strong Maraka), and Mercury (2nd and 11th lord).',
    badhakaInfoHi: 'सिंह स्थिर राशि है, अतः नवम भाव (मेष - मंगल) बाधक स्थान बनता है, यद्यपि मंगल योगकारक होने से यह दोष न्यूनतम प्रभाव डालता है।',
    badhakaInfoEn: 'As a fixed sign, the 9th house acts as Badhaka, though Mars being prime Yogakaraka neutralizes most impediments.',
    dhanaAndProsperityHi: 'बुध (धनेश व लाभेश) तथा गुरु (पंचमेश) के योग से जातक उच्च स्तरीय व्यापार, सरकारी अनुबंध, पैतृक वैभव एवं बौद्धिक उद्यमों से विपुल धन संपदा अर्जित करता है।',
    dhanaAndProsperityEn: 'Mercury (2nd & 11th) and Jupiter (5th) bestow formidable wealth through governance, enterprise, leadership mandates, and ancestral legacy.',
    marriageAndSpouseHi: 'सप्तम भाव में कुंभ राशि (शनि) होने से जीवनसाथी स्वतंत्र विचारों वाला, मानवतावादी, बौद्धिक, गंभीर एवं कभी-कभी वैचारिक दूरी रखने वाला हो सकता है। समझदारी से दांपत्य सुदृढ़ रहता है।',
    marriageAndSpouseEn: 'With Aquarius on the 7th house, the spouse is independent, intellectual, principled, community-minded, and objective.',
    careerAndProfessionHi: 'राजनीति, उच्च प्रशासनिक पद (IAS), सरकारी सेवा, प्रबंध निदेशक (MD/CEO), न्यायपालिका, रक्षा, स्वर्ण-आभूषण उद्योग एवं नेतृत्वकारी व्यवसाय।',
    careerAndProfessionEn: 'Governance, civil administration, corporate leadership, judiciary, defense, luxury mining, and political leadership.',
    healthAndMilestonesHi: 'हृदय, रीढ़ की हड्डी, रक्तचाप, नेत्र ज्योति एवं पित्त विकार के प्रति सचेत रहें। महत्वपूर्ण भाग्योदय वर्ष: 22, 28, 35, 42 एवं 50 वर्ष।',
    healthAndMilestonesEn: 'Vulnerabilities: cardiovascular vitality, spinal column, eye health, and bile balance. Milestone breakthrough ages: 22, 28, 35, 42, and 50.',
    remediesAndDeityHi: 'इष्टदेव: भगवान सूर्य नारायण अथवा भगवान श्री राम। शुभ रत्न: माणिक्य (स्वर्ण में) एवं पुखराज। नित्य प्रातः सूर्य को तांबे के पात्र से अर्घ्य देना और आदित्य हृदय स्तोत्र पढ़ना अचूक फल देता है।',
    remediesAndDeityEn: 'Ishta Devata: Lord Surya Narayana or Lord Rama. Gemstones: Ruby in gold and Yellow Sapphire. Daily Surya Arghya and Aditya Hridaya Stotra bring immense glory.',
    milestoneAges: [22, 28, 35, 42, 50],
  },

  5: {
    signIndex: 5,
    nameHi: 'कन्या लग्न (Virgo Ascendant)',
    nameEn: 'Virgo Ascendant (Kanya Lagna)',
    sanskritName: 'कन्या',
    elementHi: 'पृथ्वी तत्व (द्विस्वभाव राशि)',
    elementEn: 'Earth Element (Dual Sign)',
    lord: 'Mercury',
    lordHi: 'बुध (Mercury)',
    lordEn: 'Mercury',
    symbolHi: 'हाथ में धान्य लिए कन्या (Virgin)',
    symbolEn: 'Maiden',
    personalityHi: 'कन्या लग्न के जातक सूक्ष्म विश्लेषक, व्यावहारिक, कर्तव्यनिष्ठ, व्यवस्थित एवं अत्यधिक बुद्धिमत्तापूर्ण कार्य करने वाले होते हैं। बुध के प्रभाव से ये किसी भी कार्य की बारीकियों (Detailing) को तुरंत भांप लेते हैं। स्वच्छता, अनुशासन और सत्यनिष्ठा इनके स्वभाव का अभिन्न अंग है।',
    personalityEn: 'Virgo ascendant natives are analytical, pragmatic, meticulous, observant, and service-oriented. Governed by Mercury, they excel in systematic organization, critical reasoning, and discernment.',
    functionalBeneficsHi: 'शुक्र (द्वितीयेश व नवमेश होने से कन्या लग्न का सर्वोच्च भाग्य प्रदाता व योगकारक), बुध (लग्नेश व दशमेश) एवं शनि (पंचमेश व षष्ठेश)।',
    functionalBeneficsEn: 'Venus (2nd and 9th lord — supreme benefic of wealth and fortune), Mercury (Lagna and 10th lord), and Saturn (5th lord).',
    functionalMaleficsHi: 'मंगल (तृतीय व अष्टमेश होने से कन्या लग्न का सर्वाधिक पापी ग्रह), गुरु (चतुर्थ व सप्तमेश होने से केंद्राधिपति व बाधक दोष युक्त) एवं चंद्र (एकादशेश)।',
    functionalMaleficsEn: 'Mars (3rd and 8th lord — intense functional adversary), Jupiter (4th and 7th lord — Kendradhipati and Badhaka), and Moon (11th lord).',
    badhakaInfoHi: 'कन्या द्विस्वभाव राशि है, अतः सप्तम भाव (मीन - गुरु) बाधक स्थान बनता है। गुरु दशा में साझेदारी व वैवाहिक सामंजस्य पर विशेष ध्यान दें।',
    badhakaInfoEn: 'As a dual sign, the 7th house (Pisces ruled by Jupiter) acts as Badhaka sthana.',
    dhanaAndProsperityHi: 'शुक्र (धनेश व भाग्येश) की कृपा से जातक व्यापार, लेखा-जोखा (Accounting), निवेश, कानून, औषधि एवं तकनीकी सेवाओं से अखंड धन व प्रतिष्ठा अर्जित करता है।',
    dhanaAndProsperityEn: 'Venus (2nd & 9th) bestows substantial enduring wealth through commercial commerce, auditing, healthcare, analytics, and institutional investments.',
    marriageAndSpouseHi: 'सप्तम भाव में मीन राशि (गुरु) होने से जीवनसाथी आध्यात्मिक, दयालु, त्यागशील, भावुक एवं क्षमाशील होता है। कभी-कभी विचारों में मतभेद हो सकता है, किंतु दांपत्य सुखमय रहता है।',
    marriageAndSpouseEn: 'With Pisces on the 7th house, the spouse is compassionate, spiritually attuned, empathetic, and forgiving.',
    careerAndProfessionHi: 'चार्टर्ड अकाउंटेंसी (CA), बैंकिंग, डेटा विश्लेषण, चिकित्सा व फार्मास्यूटिकल्स, कानून, शिक्षण, सॉफ्टवेयर, सांख्यिकी एवं प्रशासनिक प्रबंधन।',
    careerAndProfessionEn: 'Auditing, chartered accountancy, data science, pharmaceuticals, medicine, jurisprudence, technical coding, and systemic administration.',
    healthAndMilestonesHi: 'पाचन तंत्र (Stomach), आंतें, अनिद्रा, नसों का तनाव एवं एलर्जी के प्रति सतर्क रहें। महत्वपूर्ण भाग्योदय वर्ष: 25, 32, 35, 42 एवं 48 वर्ष।',
    healthAndMilestonesEn: 'Vulnerabilities: gastrointestinal tract, nervous tension, and allergies. Milestone breakthrough ages: 25, 32, 35, 42, and 48.',
    remediesAndDeityHi: 'इष्टदेव: भगवान श्री गणेश अथवा भगवान विष्णु। शुभ रत्न: पन्ना (स्वर्ण/कांस्य में) एवं हीरा/ओपल। बुधवार को विष्णु सहस्रनाम का पाठ सर्व कार्य सिद्धिदायक है।',
    remediesAndDeityEn: 'Ishta Devata: Lord Ganesha or Lord Vishnu. Gemstones: Emerald and Diamond/Opal. Recitation of Vishnu Sahasranama brings exceptional clarity and prosperity.',
    milestoneAges: [25, 32, 35, 42, 48],
  },

  6: {
    signIndex: 6,
    nameHi: 'तुला लग्न (Libra Ascendant)',
    nameEn: 'Libra Ascendant (Tula Lagna)',
    sanskritName: 'तुला',
    elementHi: 'वायु तत्व (चर राशि)',
    elementEn: 'Air Element (Cardinal Sign)',
    lord: 'Venus',
    lordHi: 'शुक्र (Venus)',
    lordEn: 'Venus',
    symbolHi: 'तराजू (Balance/Scales)',
    symbolEn: 'Scales',
    personalityHi: 'तुला लग्न के जातक न्यायप्रिय, कूटनीतिक, सुरुचिपूर्ण, सौम्य और सामंजस्य स्थापित करने में निपुण होते हैं। शुक्र के प्रभाव से इनमें सामाजिक आकर्षण, सौम्य व्यवहार, कलात्मक दृष्टि और संतुलन बनाए रखने की अद्भुत कला होती है। ये विवादों से दूर रहकर शांतिपूर्ण समाधान को प्राथमिकता देते हैं।',
    personalityEn: 'Libra ascendant natives are diplomatic, egalitarian, aesthetic, urbane, and harmony-seeking. Ruled by Venus, they possess charismatic social grace, balanced judgment, and artistic flair.',
    functionalBeneficsHi: 'शनि (चतुर्थ व पंचमेश होने से तुला लग्न का सर्वोच्च योगकारक राजयोग प्रदाता), बुध (नवमेश भाग्य विधाता व द्वादशेश) एवं शुक्र (लग्नेश)।',
    functionalBeneficsEn: 'Saturn (4th and 5th lord — supreme Yogakaraka), Mercury (9th lord of fortune), and Venus (Lagna lord).',
    functionalMaleficsHi: 'गुरु (तृतीय व षष्ठेश होने से अत्यंत पापी/शत्रु कारक), मंगल (द्वितीय व सप्तमेश होने से प्रबल मारक) एवं सूर्य (एकादशेश होने से बाधक)।',
    functionalMaleficsEn: 'Jupiter (3rd and 6th lord — functional adversary of disputes), Mars (2nd and 7th lord — strong Maraka), and Sun (11th lord — Badhaka).',
    badhakaInfoHi: 'तुला चर राशि है, अतः एकादश भाव (सिंह - सूर्य) बाधक स्थान है। सूर्य की दशा में वरिष्ठ अधिकारियों से तालमेल बनाए रखें।',
    badhakaInfoEn: 'As a cardinal sign, the 11th house (Leo ruled by Sun) acts as Badhaka sthana.',
    dhanaAndProsperityHi: 'शनि (योगकारक) और बुध (भाग्येश) की संयुक्त कृपा से जातक व्यापार, भागीदारी, कला, आयात-निर्यात एवं उच्च पद से भारी धन और वैभव अर्जित करता है।',
    dhanaAndProsperityEn: 'Saturn (Yogakaraka) and Mercury (9th) manifest remarkable prosperity via commercial partnerships, legal/judiciary success, arts, and trade.',
    marriageAndSpouseHi: 'सप्तम भाव में मेष राशि (मंगल) होने से जीवनसाथी ऊर्जावान, साहसी, स्वाभिमानी, महत्वाकांक्षी व थोड़ा दबंग हो सकता है। जातक का सौम्य स्वभाव दांपत्य में मधुर संतुलन बनाए रखता है।',
    marriageAndSpouseEn: 'With Aries on the 7th house, the spouse is energetic, decisive, courageous, enterprising, and spirited.',
    careerAndProfessionHi: 'न्यायपालिका (वकालत/जज), कूटनीति, विदेश व्यापार, फिल्म, फैशन, इंटीरियर डिजाइन, सौंदर्य उत्पाद, परामर्श (Consulting), एवं कॉर्पोरेट मध्यस्थता।',
    careerAndProfessionEn: 'Judiciary, diplomacy, corporate consulting, fashion/apparel, foreign trade, entertainment, mediation, and architecture.',
    healthAndMilestonesHi: 'गुर्दे (Kidneys), मूत्र मार्ग, त्वचा विकार, कमर दर्द एवं मधुमेह के प्रति सचेत रहें। महत्वपूर्ण भाग्योदय वर्ष: 24, 28, 32, 36 एवं 42 वर्ष।',
    healthAndMilestonesEn: 'Vulnerabilities: renal system (kidneys), lower back, skin, and metabolic balance. Milestone breakthrough ages: 24, 28, 32, 36, and 42.',
    remediesAndDeityHi: 'इष्टदेव: मां महालक्ष्मी अथवा श्री कृष्ण। शुभ रत्न: हीरा/ओपल, नीलम एवं पन्ना। श्री कनकधारा स्तोत्र का पाठ और शुक्रवार को कन्याओं को खीर खिलाना परम शुभ है।',
    remediesAndDeityEn: 'Ishta Devata: Goddess Lakshmi or Lord Krishna. Gemstones: Diamond/Opal, Blue Sapphire, and Emerald. Recitation of Kanakadhara Stotra unlocks prosperity.',
    milestoneAges: [24, 28, 32, 36, 42],
  },

  7: {
    signIndex: 7,
    nameHi: 'वृश्चिक लग्न (Scorpio Ascendant)',
    nameEn: 'Scorpio Ascendant (Vrischika Lagna)',
    sanskritName: 'वृश्चिक',
    elementHi: 'जल तत्व (स्थिर राशि)',
    elementEn: 'Water Element (Fixed Sign)',
    lord: 'Mars',
    lordHi: 'मंगल (Mars)',
    lordEn: 'Mars',
    symbolHi: 'बिच्छू (Scorpion)',
    symbolEn: 'Scorpion',
    personalityHi: 'वृश्चिक लग्न के जातक गहन, रहस्यमयी, दृढ़ संकल्पी, अंतर्दृष्टि युक्त एवं अत्यंत साहसी होते हैं। मंगल के प्रभाव से इनमें अदम्य मानसिक शक्ति, शोध प्रवृत्ति और किसी भी रहस्य की तह तक जाने की क्षमता होती है। ये अपने मित्रों के प्रति परम निष्ठावान और शत्रुओं के प्रति सतर्क रहते हैं।',
    personalityEn: 'Scorpio ascendant natives are intense, intuitive, secretive, determined, investigative, and emotionally resilient. Governed by Mars, they possess profound psychic stamina and transformational strength.',
    functionalBeneficsHi: 'गुरु (द्वितीयेश व पंचमेश - धन व विद्या कारक), चंद्र (नवमेश परम भाग्य विधाता) एवं मंगल (लग्नेश व षष्ठेश)।',
    functionalBeneficsEn: 'Jupiter (2nd and 5th lord — wealth and intellect), Moon (9th lord of high fortune), and Mars (Lagna lord).',
    functionalMaleficsHi: 'बुध (अष्टम व एकादशेश होने से परम पापी), शुक्र (सप्तमेश व द्वादशेश होने से प्रबल मारक) एवं शनि (तृतीय व चतुर्थेश)।',
    functionalMaleficsEn: 'Mercury (8th and 11th lord — prime functional malefic), Venus (7th and 12th lord — strong Maraka), and Saturn (3rd and 4th lord).',
    badhakaInfoHi: 'वृश्चिक स्थिर राशि है, अतः नवम भाव (कर्क - चंद्रमा) बाधक स्थान है, यद्यपि चंद्रमा भाग्येश होने से बाधक प्रभाव न्यूनतम रहता है।',
    badhakaInfoEn: 'As a fixed sign, the 9th house acts as Badhaka, though the Moon being 9th lord significantly tempers negative outcomes.',
    dhanaAndProsperityHi: 'गुरु (द्वितीय व पंचमेश) तथा चंद्र (भाग्येश) की कृपा से वृश्चिक लग्न के जातक भूमि, गुप्त धन, अनुसंधान, वसीयत, खनिज संपदा व सरकारी सम्मान से विपुल धन प्राप्त करते हैं।',
    dhanaAndProsperityEn: 'Jupiter (2nd & 5th) and Moon (9th) yield extraordinary wealth through research, inheritances, mineral wealth, pharmaceuticals, and strategic investments.',
    marriageAndSpouseHi: 'सप्तम भाव में वृषभ राशि (शुक्र) होने से जीवनसाथी शांत, रूपवान, स्थिर, निष्ठावान, सुरुचिपूर्ण एवं व्यावहारिक होता है जो जातक के उग्र स्वभाव को संतुलित करता है।',
    marriageAndSpouseEn: 'With Taurus on the 7th house, the spouse is charming, steadfast, aesthetically cultured, dependable, and stabilizing.',
    careerAndProfessionHi: 'अनुसंधान (Research/R&D), गुप्तचर, रक्षा, शल्य चिकित्सा, खनिज, पेट्रोलियम, खनन, फोरेंसिक साइंस, ज्योतिष, तंत्र एवं उच्च प्रशासनिक तंत्र।',
    careerAndProfessionEn: 'Scientific research, investigative intelligence, surgery, defense, mining, petrochemicals, cyber forensics, occult sciences, and senior bureaucracy.',
    healthAndMilestonesHi: 'प्रजनन तंत्र, मूत्राशय, बवासीर, रक्त विकार एवं विषजन्य रोगों से सावधान रहें। महत्वपूर्ण भाग्योदय वर्ष: 21, 28, 32, 36 एवं 44 वर्ष।',
    healthAndMilestonesEn: 'Vulnerabilities: excretory/reproductive organs, blood impurities, and high pitta. Milestone breakthrough ages: 21, 28, 32, 36, and 44.',
    remediesAndDeityHi: 'इष्टदेव: भगवान हनुमान जी अथवा भगवान शिव। शुभ रत्न: लाल मूंगा, पीला पुखराज एवं मोती। मंगलवार को सुंदरकांड का पाठ और हनुमान बाहुक का जप सर्व संकट हारी है।',
    remediesAndDeityEn: 'Ishta Devata: Lord Hanuman or Lord Shiva. Gemstones: Red Coral, Yellow Sapphire, and Pearl. Regular recitation of Sundarkand brings fearless victory.',
    milestoneAges: [21, 28, 32, 36, 44],
  },

  8: {
    signIndex: 8,
    nameHi: 'धनु लग्न (Sagittarius Ascendant)',
    nameEn: 'Sagittarius Ascendant (Dhanu Lagna)',
    sanskritName: 'धनु',
    elementHi: 'अग्नि तत्व (द्विस्वभाव राशि)',
    elementEn: 'Fire Element (Dual Sign)',
    lord: 'Jupiter',
    lordHi: 'बृहस्पति (Jupiter)',
    lordEn: 'Jupiter',
    symbolHi: 'धनुर्धर (Archer/Centaur)',
    symbolEn: 'Archer',
    personalityHi: 'धनु लग्न के जातक उदार, आशावादी, धर्मपरायण, सत्यवादी एवं उच्च दार्शनिक दृष्टिकोण वाले होते हैं। देवगुरु बृहस्पति के आधिपत्य से इनमें प्राकृतिक ज्ञान, न्यायप्रियता, मार्गदर्शन क्षमता और विशाल हृदय होता है। ये सदैव प्रगतिशील विचारों और उच्च ज्ञान के अन्वेषण में रत रहते हैं।',
    personalityEn: 'Sagittarius ascendant natives are optimistic, visionary, principled, philosophical, candid, and expansive. Governed by Jupiter, they embody moral fortitude, righteous judgment, and quest for truth.',
    functionalBeneficsHi: 'सूर्य (नवमेश परम भाग्य विधाता), मंगल (पंचमेश व द्वादशेश - विद्या व पराक्रम कारक) एवं गुरु (लग्नेश व चतुर्थेश)। सूर्य-गुरु-मंगल की युति इस लग्न में सर्वोच्च राजयोग बनाती है।',
    functionalBeneficsEn: 'Sun (9th lord of highest fortune), Mars (5th lord of intellect and auspicious action), and Jupiter (Lagna and 4th lord).',
    functionalMaleficsHi: 'शुक्र (षष्ठ व एकादशेश होने से धनु लग्न का सर्वाधिक पापी ग्रह), बुध (सप्तमेश व दशमेश होने से केंद्राधिपति व बाधक) एवं शनि (द्वितीय व तृतीयेश - मारक)।',
    functionalMaleficsEn: 'Venus (6th and 11th lord — prime functional adversary), Mercury (7th and 10th lord — Kendradhipati and Badhaka), and Saturn (2nd and 3rd lord — Maraka).',
    badhakaInfoHi: 'धनु द्विस्वभाव राशि है, अतः सप्तम भाव (मिथुन - बुध) बाधक स्थान है। बुध दशा में व्यापारिक अनुबंधों व दांपत्य में स्पष्टता रखें।',
    badhakaInfoEn: 'As a dual sign, the 7th house (Gemini ruled by Mercury) serves as Badhaka sthana.',
    dhanaAndProsperityHi: 'सूर्य (भाग्येश) और मंगल (पंचमेश) के योग से जातक परामर्श, उच्च पद, शिक्षा, कानून, राजकीय सम्मान एवं पैतृक संपत्ति से स्थायी समृद्धि प्राप्त करता है।',
    dhanaAndProsperityEn: 'Sun (9th) and Mars (5th) combine with Jupiter to confer vast wealth through higher education, judiciary, institutional leadership, and dharmic assets.',
    marriageAndSpouseHi: 'सप्तम भाव में मिथुन राशि (बुध) होने से जीवनसाथी कुशाग्र, संवाद कुशल, हंसमुख, व्यावहारिक एवं बौद्धिक होता है। दोनों के मध्य बौद्धिक चर्चाएं दांपत्य को प्रगाढ़ बनाती हैं।',
    marriageAndSpouseEn: 'With Gemini on the 7th house, the spouse is intelligent, communicative, witty, versatile, and companionable.',
    careerAndProfessionHi: 'न्यायपालिका (जज/वकील), उच्च शिक्षा, प्रोफ़ेसर, धर्मोपदेशक, बैंकिंग, सिविल सेवा (IAS), विदेश नीति, सलाहकारिता एवं वित्त प्रबंधन।',
    careerAndProfessionEn: 'Judiciary, jurisprudence, higher academia, philosophical/religious pedagogy, international diplomacy, civil administration, and investment funds.',
    healthAndMilestonesHi: 'यकृत (Liver), जांघें, कूल्हे (Hips), मोटापा, कोलेस्ट्रॉल एवं धमनी विकार के प्रति सतर्क रहें। महत्वपूर्ण भाग्योदय वर्ष: 16, 22, 28, 32 एवं 40 वर्ष।',
    healthAndMilestonesEn: 'Vulnerabilities: liver, arterial circulation, hip/thigh joints, and lipid metabolism. Milestone breakthrough ages: 16, 22, 28, 32, and 40.',
    remediesAndDeityHi: 'इष्टदेव: भगवान श्री हरि विष्णु अथवा दक्षिणामूर्ति। शुभ रत्न: पीला पुखराज (स्वर्ण में), माणिक्य एवं लाल मूंगा। गुरु चालीसा का पाठ व बृहस्पतिवार को चने की दाल-केले का पूजन अत्यंत लाभकारी है।',
    remediesAndDeityEn: 'Ishta Devata: Lord Vishnu. Gemstones: Yellow Sapphire, Ruby, and Red Coral. Chanting Guru Mantra and honoring teachers brings lasting prosperity.',
    milestoneAges: [16, 22, 28, 32, 40],
  },

  9: {
    signIndex: 9,
    nameHi: 'मकर लग्न (Capricorn Ascendant)',
    nameEn: 'Capricorn Ascendant (Makara Lagna)',
    sanskritName: 'मकर',
    elementHi: 'पृथ्वी तत्व (चर राशि)',
    elementEn: 'Earth Element (Cardinal Sign)',
    lord: 'Saturn',
    lordHi: 'शनि (Saturn)',
    lordEn: 'Saturn',
    symbolHi: 'मगरमच्छ/मृग (Sea-Goat)',
    symbolEn: 'Sea-Goat',
    personalityHi: 'मकर लग्न के जातक अत्यंत अनुशासित, धैर्यवान, महत्वाकांक्षी, दूरदर्शी एवं कर्मठ होते हैं। शनि के प्रभाव से ये जीवन में धीरे-धीरे किंतु अत्यंत सुदृढ़ गति से शीर्ष स्थान प्राप्त करते हैं। ये दिखावे से दूर रहकर ठोस परिणामों और कर्तव्यनिष्ठा पर विश्वास करते हैं।',
    personalityEn: 'Capricorn ascendant individuals are disciplined, structured, ambitious, persevering, pragmatic, and patient. Governed by Saturn, they build lasting achievements through sustained tenacity.',
    functionalBeneficsHi: 'शुक्र (पंचमेश व दशमेश होने से मकर लग्न का सर्वोच्च योगकारक राजयोग प्रदाता), बुध (भाग्येश व षष्ठेश) एवं शनि (लग्नेश व द्वितीयेश)।',
    functionalBeneficsEn: 'Venus (5th and 10th lord — supreme Yogakaraka), Mercury (9th lord of fortune), and Saturn (Lagna and 2nd lord).',
    functionalMaleficsHi: 'मंगल (चतुर्थ व एकादशेश होने से पापी व बाधक), गुरु (तृतीय व द्वादशेश होने से व्ययेश/अशुभ) एवं सूर्य (अष्टमेश - रंधेश दोष)।',
    functionalMaleficsEn: 'Mars (4th and 11th lord — functional adversary & Badhaka), Jupiter (3rd and 12th lord), and Sun (8th lord).',
    badhakaInfoHi: 'मकर चर राशि है, अतः एकादश भाव (वृश्चिक - मंगल) बाधक स्थान है। मंगल की अंतर्दशा में बड़े भाइयों अथवा चोट-चपेट से सतर्क रहें।',
    badhakaInfoEn: 'As a cardinal sign, the 11th house (Scorpio ruled by Mars) acts as Badhaka sthana.',
    dhanaAndProsperityHi: 'शुक्र (योगकारक) और बुध (भाग्येश) की कृपा से मकर लग्न के जातक उद्योग, निर्माण, खनिज, इस्पात, कॉर्पोरेट प्रबंधन एवं रियल एस्टेट से विशाल स्थायी संपत्ति अर्जित करते हैं।',
    dhanaAndProsperityEn: 'Venus (Yogakaraka) and Mercury (9th) manifest substantial material wealth through industrial enterprise, infrastructure, governance, and asset appreciation.',
    marriageAndSpouseHi: 'सप्तम भाव में कर्क राशि (चंद्रमा) होने से जीवनसाथी भावुक, संवेदनशील, परिवार-प्रिय, करुणामयी एवं पोषण करने वाला होता है। जातक का व्यावहारिक दृष्टिकोण दांपत्य को सुरक्षा प्रदान करता है।',
    marriageAndSpouseEn: 'With Cancer on the 7th house, the spouse is emotionally sensitive, nurturing, family-oriented, and devoted.',
    careerAndProfessionHi: 'उद्योगपति, कॉर्पोरेट प्रबंधन, निर्माण (Infrastructure/Real Estate), खनन, इस्पात, लोक सेवा, न्यायपालिका, राजनीति एवं तकनीकी संगठन।',
    careerAndProfessionEn: 'Heavy industry, civil engineering, corporate management, mining, metallurgy, public administration, legal affairs, and architecture.',
    healthAndMilestonesHi: 'घुटने (Knees), जोड़ (Joints), वात रोग, त्वचा विकार एवं दांतों के प्रति सजग रहें। महत्वपूर्ण भाग्योदय वर्ष: 25, 33, 36, 42 एवं 48 वर्ष।',
    healthAndMilestonesEn: 'Vulnerabilities: knees, skeletal joints, vata (rheumatic/gout) conditions, and skin. Milestone breakthrough ages: 25, 33, 36, 42, and 48.',
    remediesAndDeityHi: 'इष्टदेव: भगवान शिव एवं शनि देव। शुभ रत्न: नीलम (अथवा नीली), पन्ना एवं हीरा/ओपल। शनिवार को पीपल के नीचे सरसों के तेल का दीपक प्रज्वलित करना और हनुमान चालीसा पढ़ना श्रेष्ठ है।',
    remediesAndDeityEn: 'Ishta Devata: Lord Shiva and Lord Shani. Gemstones: Blue Sapphire, Emerald, and Diamond. Lighting a mustard oil lamp under a Peepal tree on Saturdays brings immense stability.',
    milestoneAges: [25, 33, 36, 42, 48],
  },

  10: {
    signIndex: 10,
    nameHi: 'कुंभ लग्न (Aquarius Ascendant)',
    nameEn: 'Aquarius Ascendant (Kumbha Lagna)',
    sanskritName: 'कुंभ',
    elementHi: 'वायु तत्व (स्थिर राशि)',
    elementEn: 'Air Element (Fixed Sign)',
    lord: 'Saturn',
    lordHi: 'शनि (Saturn)',
    lordEn: 'Saturn',
    symbolHi: 'घड़ा लिए पुरुष (Water-Bearer)',
    symbolEn: 'Water-Bearer',
    personalityHi: 'कुंभ लग्न के जातक दूरदर्शी, मानवतावादी, मौलिक विचारक (Original Thinker), दार्शनिक एवं स्वतंत्र चेता होते हैं। शनि के प्रभाव से इनमें गहन चिंतन, समाज कल्याण की भावना, निष्पक्षता और वैज्ञानिक दृष्टिकोण होता है। ये रूढ़िवादिता से परे हटकर नए युग के निर्माण में विश्वास रखते हैं।',
    personalityEn: 'Aquarius ascendant natives are visionary, humanitarian, egalitarian, intellectually progressive, independent, and reformative. Governed by Saturn, they pioneer future-oriented innovations.',
    functionalBeneficsHi: 'शुक्र (चतुर्थ व नवमेश होने से कुंभ लग्न का सर्वोच्च योगकारक राजयोग प्रदाता), बुध (पंचमेश व अष्टमेश - बुद्धि व शोध कारक) एवं शनि (लग्नेश व द्वादशेश)।',
    functionalBeneficsEn: 'Venus (4th and 9th lord — supreme Yogakaraka), Mercury (5th lord of intellect and 8th of research), and Saturn (Lagna lord).',
    functionalMaleficsHi: 'गुरु (द्वितीय व एकादशेश होने से प्रबल मारक), मंगल (तृतीय व दशमेश होने से पापी) एवं सूर्य (सप्तमेश - मारक)।',
    functionalMaleficsEn: 'Jupiter (2nd and 11th lord — strong Maraka), Mars (3rd and 10th lord), and Sun (7th lord — Maraka).',
    badhakaInfoHi: 'कुंभ स्थिर राशि है, अतः नवम भाव (तुला - शुक्र) बाधक स्थान बनता है, यद्यपि शुक्र योगकारक होने से बाधक बाधाएं बहुत अल्प होती हैं।',
    badhakaInfoEn: 'As a fixed sign, the 9th house acts as Badhaka, though Venus being supreme Yogakaraka neutralizes negative impact.',
    dhanaAndProsperityHi: 'शुक्र (योगकारक) और बुध (पंचमेश) की कृपा से जातक तकनीकी आविष्कारों, बड़े संगठनों, वैज्ञानिक अनुसंधान, आयात-निर्यात एवं सार्वजनिक उपक्रमों से विपुल धन प्राप्त करता है।',
    dhanaAndProsperityEn: 'Venus and Mercury bestow remarkable wealth through technological innovation, institutional management, intellectual breakthroughs, and global enterprises.',
    marriageAndSpouseHi: 'सप्तम भाव में सिंह राशि (सूर्य) होने से जीवनसाथी तेजस्वी, स्वाभिमानी, प्रभावशाली व्यक्तित्व वाला, उदार एवं कभी-कभी सत्ताप्रिय हो सकता है। परस्पर सम्मान से दांपत्य आदर्श बनता है।',
    marriageAndSpouseEn: 'With Leo on the 7th house, the spouse is regal, dignified, spirited, expressive, and proud.',
    careerAndProfessionHi: 'विज्ञान एवं अनुसंधान, सूचना प्रौद्योगिकी (IT), विमानन (Aviation), अंतरिक्ष विज्ञान, इलेक्ट्रॉनिक्स, समाजशास्त्र, एनजीओ, बड़े निगम एवं शोध संस्थान।',
    careerAndProfessionEn: 'Advanced science, aerospace, software architecture, telecommunications, social reform organizations, corporate conglomerates, and think-tanks.',
    healthAndMilestonesHi: 'पिंडलियां (Calves), टखने (Ankles), रक्त संचार, हृदय एवं नसों की कमजोरी से सावधान रहें। महत्वपूर्ण भाग्योदय वर्ष: 25, 28, 36, 42 एवं 49 वर्ष।',
    healthAndMilestonesEn: 'Vulnerabilities: ankles, shins, blood circulation, and nervous exhaustion. Milestone breakthrough ages: 25, 28, 36, 42, and 49.',
    remediesAndDeityHi: 'इष्टदेव: भगवान शिव अथवा भगवान भैरव। शुभ रत्न: नीलम (अथवा नीली), हीरा/ओपल एवं पन्ना। शनिवार को छाया दान करना और महामृत्युंजय मंत्र का जप अमोघ फलदायी है।',
    remediesAndDeityEn: 'Ishta Devata: Lord Shiva. Gemstones: Blue Sapphire and Diamond/Opal. Chanting Maha Mrityunjaya Mantra brings profound resilience and spiritual elevation.',
    milestoneAges: [25, 28, 36, 42, 49],
  },

  11: {
    signIndex: 11,
    nameHi: 'मीन लग्न (Pisces Ascendant)',
    nameEn: 'Pisces Ascendant (Meena Lagna)',
    sanskritName: 'मीन',
    elementHi: 'जल तत्व (द्विस्वभाव राशि)',
    elementEn: 'Water Element (Dual Sign)',
    lord: 'Jupiter',
    lordHi: 'बृहस्पति (Jupiter)',
    lordEn: 'Jupiter',
    symbolHi: 'दो मछलियां (Two Fishes)',
    symbolEn: 'Fishes',
    personalityHi: 'मीन लग्न के जातक अत्यंत दयालु, परोपकारी, कल्पनाशील, संवेदनशील और आध्यात्मिक चेतना से युक्त होते हैं। देवगुरु बृहस्पति के प्रभाव से इनमें ईश्वरीय निष्ठा, क्षमाशीलता, त्याग की भावना और आंतरिक शांति होती है। ये भौतिकता से परे जाकर मानवीय संवेदनाओं और मोक्ष मार्ग को अधिक महत्व देते हैं।',
    personalityEn: 'Pisces ascendant individuals are empathetic, spiritually attuned, imaginative, compassionate, philosophical, and intuitive. Governed by Jupiter, they possess profound psychic depth and devotion.',
    functionalBeneficsHi: 'मंगल (द्वितीयेश व नवमेश होने से मीन लग्न का परम भाग्य विधाता व योगकारक), चंद्र (पंचमेश विद्या व संतति कारक) एवं गुरु (लग्नेश व दशमेश)।',
    functionalBeneficsEn: 'Mars (2nd of wealth and 9th of fortune — prime Yogakaraka), Moon (5th lord of intellect & progeny), and Jupiter (Lagna and 10th lord).',
    functionalMaleficsHi: 'शुक्र (तृतीय व अष्टमेश होने से मीन लग्न का सर्वाधिक पापी ग्रह), बुध (चतुर्थ व सप्तमेश होने से केंद्राधिपति व बाधक) एवं सूर्य (षष्ठेश)।',
    functionalMaleficsEn: 'Venus (3rd and 8th lord — intense functional adversary), Mercury (4th and 7th lord — Kendradhipati and Badhaka), and Sun (6th lord).',
    badhakaInfoHi: 'मीन द्विस्वभाव राशि है, अतः सप्तम भाव (कन्या - बुध) बाधक स्थान बनता है। बुध की दशा में दांपत्य व साझेदारी में सतर्कता अपेक्षित है।',
    badhakaInfoEn: 'As a dual sign, the 7th house (Virgo ruled by Mercury) serves as Badhaka sthana.',
    dhanaAndProsperityHi: 'मंगल (धनेश व भाग्येश) तथा चंद्र (पंचमेश) की कृपा से जातक शिक्षा, धर्म, जल संसाधन, विदेशी व्यापार, चिकित्सा एवं परोपकारी संस्थानों से विपुल धन प्राप्त करता है।',
    dhanaAndProsperityEn: 'Mars (2nd & 9th) and Moon (5th) bestow immense wealth through spiritual pursuits, pharmaceuticals, overseas commerce, counseling, and maritime ventures.',
    marriageAndSpouseHi: 'सप्तम भाव में कन्या राशि (बुध) होने से जीवनसाथी विश्लेषक, व्यावहारिक, बुद्धिमान, मितव्ययी एवं व्यवस्थाप्रिय होता है जो जातक के भावुक स्वभाव को व्यावहारिक संतुलन प्रदान करता है।',
    marriageAndSpouseEn: 'With Virgo on the 7th house, the spouse is analytical, intelligent, organized, detail-oriented, and grounding.',
    careerAndProfessionHi: 'अध्यापन, दर्शनशास्त्र, चिकित्सा, औषधि, नौसेना, योग, आध्यात्मिक संस्थाएं, समाज सेवा, परामर्श, लेखन, एवं होटल/जल उद्योग।',
    careerAndProfessionEn: 'Higher pedagogy, pharmaceuticals, healthcare, psychology, naval trade, spiritual counseling, jurisprudence, and humanitarian philanthropy.',
    healthAndMilestonesHi: 'पैर (Feet), तलवे, लसीका तंत्र (Lymphatics), कफ विकार, यकृत एवं अनिद्रा के प्रति सावधान रहें। महत्वपूर्ण भाग्योदय वर्ष: 16, 21, 28, 34 एवं 42 वर्ष।',
    healthAndMilestonesEn: 'Vulnerabilities: feet, toes, lymphatic circulation, and metabolic sleep cycles. Milestone breakthrough ages: 16, 21, 28, 34, and 42.',
    remediesAndDeityHi: 'इष्टदेव: भगवान श्री हरि विष्णु एवं मां सरस्वती। शुभ रत्न: पीला पुखराज (स्वर्ण में), लाल मूंगा एवं मोती। नित्य ॐ नमो भगवते वासुदेवाय मंत्र का जप व गुरुवार को गाय को गुड़-चना खिलाना परम कल्याणकारी है।',
    remediesAndDeityEn: 'Ishta Devata: Lord Vishnu and Goddess Saraswati. Gemstones: Yellow Sapphire, Red Coral, and Natural Pearl. Chanting Om Namo Bhagavate Vasudevaya brings transcendent grace.',
    milestoneAges: [16, 21, 28, 34, 42],
  },
};

export interface AscendantPredictionResult {
  nativeLagnaIndex: number;
  nativeLagnaNameHi: string;
  nativeLagnaNameEn: string;
  selectedLagnaIndex: number;
  profile: AscendantMasterProfile;
  natalSynthesisHi: string;
  natalSynthesisEn: string;
  lagnaLordPlacementSummaryHi: string;
  lagnaLordPlacementSummaryEn: string;
  occupantsSummaryHi: string;
  occupantsSummaryEn: string;
}

export function generateAscendantPrediction(
  chart: ChartData,
  selectedSignIndex?: number
): AscendantPredictionResult {
  const nativeLagnaIndex = chart.ascendant.signIndex;
  const targetSignIndex = selectedSignIndex !== undefined ? selectedSignIndex : nativeLagnaIndex;
  const profile = ASCENDANT_MASTER_DATA[targetSignIndex] || ASCENDANT_MASTER_DATA[0];

  // Natal synthesis for native's chart
  const ascPos = chart.ascendant;
  const ascNak = NAKSHATRAS[ascPos.nakshatraIndex];
  const lordId = SIGNS[nativeLagnaIndex].lord;
  const lordPos = chart.planets.find((p) => p.id === lordId);
  const lordHouse = lordPos ? lordPos.rasiHouseNumber : 1;
  const lordDignity = lordPos ? lordPos.dignity : 'Neutral';

  const lagnaOccupants = chart.planets.filter((p) => p.rasiHouseNumber === 1);
  const occNamesHi = lagnaOccupants.length
    ? lagnaOccupants.map((p) => p.id).join(', ')
    : 'कोई ग्रह स्थित नहीं है (निर्दोष)';
  const occNamesEn = lagnaOccupants.length
    ? lagnaOccupants.map((p) => p.id).join(', ')
    : 'None (Lagna is unoccupied)';

  const lagnaLordPlacementSummaryHi = lordPos
    ? `लग्नेश ${lordId} कुंडली के भाव ${lordHouse} में ${lordDignity} स्थिति में विराजमान हैं। यह स्थिति जातक के आत्मबल, जीवन ऊर्जा एवं समग्र भाग्योदय की मुख्य आधारशिला है।`
    : `लग्नेश ${lordId} की स्थिति अनुकूल है।`;

  const lagnaLordPlacementSummaryEn = lordPos
    ? `Lagna lord ${lordId} is positioned in House ${lordHouse} with ${lordDignity} dignity, forming the vital pillar of personal agency, vitality, and lifelong stature.`
    : `Lagna lord ${lordId} is harmoniously placed.`;

  const occupantsSummaryHi = `लग्न भाव में स्थित ग्रह: ${occNamesHi}।`;
  const occupantsSummaryEn = `Lagna occupants: ${occNamesEn}.`;

  const natalSynthesisHi = `जातक का जन्म ${profile.nameHi} में हुआ है। लग्न अंश ${ascPos.dms} पर ${ascNak.name} नक्षत्र (पाद ${ascPos.pada}) के अंतर्गत उदित है। ${lagnaLordPlacementSummaryHi} ${occupantsSummaryHi}`;
  const natalSynthesisEn = `The native was born with ${profile.nameEn}. The Ascendant is rising at ${ascPos.dms} in ${ascNak.name} Nakshatra (Pada ${ascPos.pada}). ${lagnaLordPlacementSummaryEn} ${occupantsSummaryEn}`;

  return {
    nativeLagnaIndex,
    nativeLagnaNameHi: SIGNS[nativeLagnaIndex].name,
    nativeLagnaNameEn: SIGNS[nativeLagnaIndex].name,
    selectedLagnaIndex: targetSignIndex,
    profile,
    natalSynthesisHi,
    natalSynthesisEn,
    lagnaLordPlacementSummaryHi,
    lagnaLordPlacementSummaryEn,
    occupantsSummaryHi,
    occupantsSummaryEn,
  };
}
