/* =========================================================================
   VEDIC ASTROLOGY: AN INTEGRATED CLASSICAL APPROACH
   CLASSICAL SHASTRA KNOWLEDGE BASE & COMPUTATIONAL DOCTRINES
   
   Source:
   "Vedic Astrology: An Integrated Approach" (2nd Edition, 442 Pages)
   Classical Vedic Tradition · Sagar Publications, New Delhi
   URL: https://lakshminarayanlenasia.com/articles/vedic-astrology-an-integrated-approach2.pdf
   
   AV Astro Vibe — Strictly Zero Emojis, 100% Mathematical Precision
   ========================================================================= */

import { SIGNS } from '../constants';
import type { ChartData, PlanetId, SevenPlanetId } from '../types';

export interface PvrTreatiseMetadata {
  title: string;
  edition: string;
  author: string;
  affiliation: string;
  forewordBy: string;
  url: string;
  totalPages: number;
  partsAndChapters: string;
  scope: string;
  fundamentalAxiomEn: string;
  fundamentalAxiomHi: string;
}

export const PVR_NARASIMHA_RAO_BOOK_METADATA: PvrTreatiseMetadata = {
  title: 'Vedic Astrology: An Integrated Classical Treatise',
  edition: '2nd Revised & Expanded Edition (442 Pages)',
  author: 'Classical Vedic Tradition',
  affiliation: 'Sagar Publications Classical Edition · Comprehensive Vedic Shastra',
  forewordBy: 'Classical Parashari Authority',
  url: '',
  totalPages: 442,
  partsAndChapters: '6 Major Parts, 37 Comprehensive Chapters, Real-life Illustrative Examples',
  scope: 'The definitive classical manual integrating Parashara, Jaimini, Tajaka, and Shodashavarga (16 divisional charts). Covers Arudha Padas (AL, UL, A1-A12), Special Lagnas (HL, GL, SL), Yogada & Maha Yogada doctrine, Argala & Virodhargala mechanics, Ashtakavarga, Rasi Dashas (Narayana, Shoola, Drig, Sudasa), Gochara Murthi Nirnaya, Birth Time Error Sensitivity, and Classical Remedial Upayas.',
  fundamentalAxiomEn: 'A birth chart is an interplay of the gross body and the subtle environments. The Rasi chart (D1) represents physical manifestation. Divisional charts (Vargas) act as independent charts with their own ascendants reflecting specialized spheres of human experience. Arudha padas signify the maya or worldly perception, and Dashas and Transits govern the precise timing of karmic unfoldment.',
  fundamentalAxiomHi: 'लग्न कुंडली (D1) स्थूल भौतिक संरचना को दर्शाती है। वर्ग कुंडलियां (D2 से D60) जातक के सूक्ष्म जीवन क्षेत्रों का उनके अपने स्वतंत्र लग्नों के आधार पर उद्घाटन करती हैं। आरूढ़ पद भौतिक जगत में माया और प्रत्यक्ष अनुभूतियों को प्रकट करते हैं, तथा दशाएं व गोचर कर्मफल के समयबद्ध प्रकटीकरण का निर्धारण करते हैं।',
};

// ============================================================================
// 1. THE 16 DIVISIONAL CHARTS (SHODASHAVARGA MATRIX — PVR CHAPTER 6 & 13)
// ============================================================================

export interface PvrVargaProfile {
  code: string;
  harmonicDivision: number;
  sanskritName: string;
  englishName: string;
  domainEn: string;
  domainHi: string;
  significationsEn: string[];
  significationsHi: string[];
  independentLagnaRuleEn: string;
  independentLagnaRuleHi: string;
  keyHousesToAnalyze: number[];
  timeWindowMinutes: number;
}

export const PVR_SHODASHAVARGA_CORPUS: Record<string, PvrVargaProfile> = {
  D1: {
    code: 'D1',
    harmonicDivision: 1,
    sanskritName: 'राशि (Rasi / Kshetra Chakra)',
    englishName: 'Rasi Chart',
    domainEn: 'Physical existence, overall vitality, general constitution and visible stature.',
    domainHi: 'स्थूल शरीर, जीवन-शक्ति, शारीरिक गठन, और भौतिक संसार में सामान्य स्थिति।',
    significationsEn: ['Physical body and appearance', 'Overall constitution and health', 'General worldly fortune', 'Foundation of all karmas'],
    significationsHi: ['शारीरिक गठन व स्वरूप', 'समग्र स्वास्थ्य व जीवन-शक्ति', 'भौतिक जगत का सामान्य भाग्य', 'सभी कर्मों का मूल आधार'],
    independentLagnaRuleEn: 'The root ascendant representing the native as a complete being in the material universe.',
    independentLagnaRuleHi: 'मूल लग्न जो भौतिक जगत में जातक के समग्र अस्तित्व का प्रतिनिधित्व करता है।',
    keyHousesToAnalyze: [1, 5, 9, 10],
    timeWindowMinutes: 120,
  },
  D2: {
    code: 'D2',
    harmonicDivision: 2,
    sanskritName: 'होरा (Hora)',
    englishName: 'Hora Chart',
    domainEn: 'Wealth, financial accumulation, resources, speech, and sustained prosperity.',
    domainHi: 'धन, आर्थिक संचय, संसाधन, वाणी और स्थायी समृद्धि।',
    significationsEn: ['Accumulated capital and liquid assets', 'Financial sustenance', 'Manner of speech and family values', 'Sun/Moon polar energies'],
    significationsHi: ['संचित पूंजी व नकदी संपत्ति', 'आर्थिक भरण-पोषण', 'वाणी व पारिवारिक संस्कार', 'सूर्य-चंद्र की ध्रुवीय ऊर्जा'],
    independentLagnaRuleEn: 'Planets in Sun\'s Hora represent self-earned aggressive wealth; planets in Moon\'s Hora represent inherited, gentle, or sustained resources.',
    independentLagnaRuleHi: 'सूर्य की होरा में स्थित ग्रह स्व-अर्जित पुरुषार्थ से प्राप्त धन दर्शाते हैं; चंद्र की होरा में स्थित ग्रह पैतृक, सहज या संचित धन दर्शाते हैं।',
    keyHousesToAnalyze: [2, 11, 1],
    timeWindowMinutes: 60,
  },
  D3: {
    code: 'D3',
    harmonicDivision: 3,
    sanskritName: 'द्रेष्काण (Drekkana)',
    englishName: 'Drekkana Chart',
    domainEn: 'Siblings, courage, motivation, initiative, physical prowess, and 22nd Drekkana karma.',
    domainHi: 'भाई-बहन, साहस, प्रेरणा, पराक्रम, और २२वां द्रेष्काण (ख्रेश)।',
    significationsEn: ['Younger and elder siblings', 'Internal drive, courage, and valor', 'Vital energy and sports prowess', '22nd Drekkana vulnerability points'],
    significationsHi: ['अनुज एवं अग्रज भाई-बहन', 'आंतरिक पराक्रम व साहस', 'शारीरिक ऊर्जा व खेलकूद', '२२वां द्रेष्काण (संवेदनशील स्वास्थ्य बिंदु)'],
    independentLagnaRuleEn: 'The 3rd house in D3 shows younger siblings; the 11th house shows elder siblings. Inspect 3rd and 11th lords as independent sibling lagnas.',
    independentLagnaRuleHi: 'D3 में तृतीय भाव छोटे भाई-बहनों और एकादश भाव बड़े भाई-बहनों को दर्शाता है। इनके स्वामियों को भाई-बहनों के स्वतंत्र लग्न मानकर फल देखें।',
    keyHousesToAnalyze: [3, 11, 8],
    timeWindowMinutes: 40,
  },
  D4: {
    code: 'D4',
    harmonicDivision: 4,
    sanskritName: 'चतुर्थांश / तुर्यांश (Chaturthamsa / Turyamsa)',
    englishName: 'Chaturthamsa Chart',
    domainEn: 'Fixed assets, residence, landed property, real estate, and general destiny/bhagya.',
    domainHi: 'स्थायी संपत्ति, गृह-निवास, भूमि, भवन, वाहन और सामान्य भाग्य।',
    significationsEn: ['Landed properties and homes', 'Domestic environment and shelter', 'Permanent real-estate holdings', 'Inherent fortune and contentment'],
    significationsHi: ['भूमि, भवन और अचल संपत्ति', 'घरेलू वातावरण व आवास', 'स्थायी रियल एस्टेट निवेश', 'जन्मजात भाग्य व संतुष्टि'],
    independentLagnaRuleEn: 'The 4th house and 4th lord in D4 define residential stability and ownership of multiple properties.',
    independentLagnaRuleHi: 'D4 का चतुर्थ भाव व चतुर्थेश निवास की स्थिरता एवं एकाधिक भवनों के स्वामित्व का निर्धारण करते हैं।',
    keyHousesToAnalyze: [4, 9, 1],
    timeWindowMinutes: 30,
  },
  D7: {
    code: 'D7',
    harmonicDivision: 7,
    sanskritName: 'सप्तांश (Saptamsa)',
    englishName: 'Saptamsa Chart',
    domainEn: 'Children, progeny lineage, grandchildren, creative fertility, and continuation of dynasty.',
    domainHi: 'संतान, कुल परंपरा, पोते-पोतियां, रचनात्मक उर्वरता और वंश वृद्धि।',
    significationsEn: ['First, second, and successive children', 'Health, character, and achievements of progeny', 'Physical fertility and reproductive vitality', 'Generational blessings'],
    significationsHi: ['प्रथम, द्वितीय व आगामी संतान', 'संतान का स्वास्थ्य, चरित्र व उपलब्धियां', 'शारीरिक उर्वरता व प्रजनन क्षमता', 'पीढ़ियों का आशीर्वाद'],
    independentLagnaRuleEn: 'Count from 5th house forward for odd signs and 9th house backward for even signs in D7 to analyze individual children.',
    independentLagnaRuleHi: 'D7 में विषम लग्न होने पर पंचम से आगे और सम लग्न होने पर नवम से पीछे क्रम में प्रत्येक संतान का विचार करें।',
    keyHousesToAnalyze: [5, 7, 9],
    timeWindowMinutes: 17,
  },
  D9: {
    code: 'D9',
    harmonicDivision: 9,
    sanskritName: 'नवांश / धर्मांश (Navamsa / Dharmamsa)',
    englishName: 'Navamsa Chart',
    domainEn: 'Dharma, marriage partner, inner potential, soul evolution, and post-marriage destiny.',
    domainHi: 'धर्म, जीवनसाथी, आंतरिक क्षमता, आत्मिक विकास और विवाह उपरांत भाग्योदय।',
    significationsEn: ['Dharmic purpose and spiritual nature', 'Spousal persona, temperament, and mutual harmony', 'Strength and confirmation of all D1 planetary yogas', 'Karakamsa Lagna analysis'],
    significationsHi: ['धार्मिक जीवन-उद्देश्य व आत्मिक स्वभाव', 'जीवनसाथी का व्यक्तित्व व वैवाहिक सामंजस्य', 'D1 के सभी योगों की वास्तविक पुष्टि', 'कारकांश लग्न का विचार'],
    independentLagnaRuleEn: 'Navamsa Lagna represents the true inner self and nature of spouse (7th). Planets in D9 Kendra/Trikona reveal realized talents in adult life.',
    independentLagnaRuleHi: 'नवांश लग्न वास्तविक आंतरिक स्वभाव और सप्तम भाव जीवनसाथी को दर्शाता है। D9 के केंद्र/त्रिकोण में स्थित ग्रह प्रौढ़ जीवन में साकार होने वाली प्रतिभाएं दर्शाते हैं।',
    keyHousesToAnalyze: [1, 7, 9, 12],
    timeWindowMinutes: 13.3,
  },
  D10: {
    code: 'D10',
    harmonicDivision: 10,
    sanskritName: 'दशांश / स्वर्गांश (Dasamsa / Swargamsa)',
    englishName: 'Dasamsa Chart',
    domainEn: 'Career, profession, executive achievements, public status, authority, and karma.',
    domainHi: 'करियर, आजीविका, प्रशासनिक उपलब्धियां, सामाजिक प्रतिष्ठा, अधिकार और कर्म क्षेत्र।',
    significationsEn: ['Professional path and career zenith', 'Executive rank and government recognition', 'Leadership ability and public standing', 'Colleagues and boss relationships'],
    significationsHi: ['आजीविका का मार्ग व सर्वोच्च पद', 'प्रशासनिक अधिकार व राजकीय सम्मान', 'नेतृत्व क्षमता व सार्वजनिक प्रतिष्ठा', 'सहकर्मियों व अधिकारियों से संबंध'],
    independentLagnaRuleEn: 'Treat D10 Lagna as the professional persona, 10th house as career execution, and Arudha of 10th (A10) as public career reputation.',
    independentLagnaRuleHi: 'D10 लग्न को व्यावसायिक व्यक्तित्व, दशम भाव को कर्म-निष्पादन और A10 को कार्यस्थल पर सार्वजनिक ख्याति मानकर विश्लेषण करें।',
    keyHousesToAnalyze: [10, 6, 2, 1],
    timeWindowMinutes: 12,
  },
  D12: {
    code: 'D12',
    harmonicDivision: 12,
    sanskritName: 'द्वादशांश / सूर्यांश (Dwadasamsa / Suryamsa)',
    englishName: 'Dwadasamsa Chart',
    domainEn: 'Parents, lineage, ancestry, paternal and maternal heritage, and inherited past-life karma.',
    domainHi: 'माता-पिता, कुल वंश, पूर्वज, पैतृक व मातृक विरासत तथा संचित प्रारब्ध।',
    significationsEn: ['Father (9th house / Sun) and Mother (4th house / Moon)', 'Paternal and maternal grandparents', 'Hereditary traits and family legacy', 'Ancestral karmic debts (Pitru Rin)'],
    significationsHi: ['पिता (नवम भाव / सूर्य) और माता (चतुर्थ भाव / चंद्र)', 'दादा-दादी व नाना-नानी', 'आनुवंशिक गुण व कुल परंपरा', 'पैतृक ऋण व पितृ आशीर्वाद'],
    independentLagnaRuleEn: 'Inspect 9th lord in D12 as father\'s lagna, and 4th lord in D12 as mother\'s lagna.',
    independentLagnaRuleHi: 'D12 में नवमेश को पिता का लग्न और चतुर्थेश को माता का लग्न मानकर माता-पिता के जीवन का विश्लेषण करें।',
    keyHousesToAnalyze: [9, 4, 1],
    timeWindowMinutes: 10,
  },
  D16: {
    code: 'D16',
    harmonicDivision: 16,
    sanskritName: 'षोडशांश / कालांश (Shodasamsa / Kalamsa)',
    englishName: 'Shodasamsa Chart',
    domainEn: 'Vehicles, conveyances, material luxuries, comforts, and inner happiness (sukha).',
    domainHi: 'वाहन, सुख-साधन, भौतिक ऐश्वर्य, विलासिता और आंतरिक सुख (सुख-शांति)।',
    significationsEn: ['Vehicles and automobile accidents or safety', 'Pleasure, comfort, and luxury living', 'Inner sense of contentment and joy', 'Fourth house micro-matters'],
    significationsHi: ['वाहन सुख व दुर्घटना से सुरक्षा', 'विलासिता, ऐश्वर्य व सुखद जीवन', 'आंतरिक संतोष व मानसिक शांति', 'चतुर्थ भाव का सूक्ष्म विचार'],
    independentLagnaRuleEn: 'Venus and the 4th house in D16 determine safety while traveling and joy derived from material possessions.',
    independentLagnaRuleHi: 'D16 में शुक्र और चतुर्थ भाव यात्रा में सुरक्षा और भौतिक सुख-साधनों से प्राप्त वास्तविक आनंद का निर्धारण करते हैं।',
    keyHousesToAnalyze: [4, 1, 9],
    timeWindowMinutes: 7.5,
  },
  D20: {
    code: 'D20',
    harmonicDivision: 20,
    sanskritName: 'विंशांश (Vimsamsa)',
    englishName: 'Vimsamsa Chart',
    domainEn: 'Spiritual evolution, religious upasana, meditation, devotion (bhakti), and divine grace.',
    domainHi: 'आध्यात्मिक साधना, उपासना, ध्यान, भक्ति, ईश्वरीय कृपा और मंत्र सिद्धि।',
    significationsEn: ['Ishta Devata and chosen path of worship', 'Spiritual experiences and deep meditation', 'Mantra siddhi and scriptural study', 'Purity of faith and detachment'],
    significationsHi: ['इष्टदेव एवं पूजा-आराधना का मार्ग', 'आध्यात्मिक अनुभव व गहन ध्यान', 'मंत्र सिद्धि व शास्त्र अध्ययन', 'श्रद्धा की पवित्रता व वैराग्य भावना'],
    independentLagnaRuleEn: 'The 9th house in D20 indicates the Guru, 5th house shows mantra devotion, and 12th house indicates moksha meditation.',
    independentLagnaRuleHi: 'D20 में नवम भाव सद्गुरु, पंचम भाव मंत्र साधना, और द्वादश भाव मोक्ष ध्यान का संकेतक है।',
    keyHousesToAnalyze: [9, 5, 12, 1],
    timeWindowMinutes: 6,
  },
  D24: {
    code: 'D24',
    harmonicDivision: 24,
    sanskritName: 'चतुर्विंशांश / सिद्धांश (Chaturvimsamsa / Siddhamsa)',
    englishName: 'Siddhamsa Chart',
    domainEn: 'Higher learning, academic distinction, intellectual mastery, memory, and specialized skills.',
    domainHi: 'उच्च विद्या, शैक्षणिक विशिष्टता, बौद्धिक निपुणता, स्मृति और विशिष्ट ज्ञान।',
    significationsEn: ['University education and scholarly success', 'Competitive examinations and academic ranks', 'Acquisition of intellectual disciplines', 'Creative genius and retention power'],
    significationsHi: ['विश्वविद्यालयीय शिक्षा व विद्वत्ता', 'प्रतियोगी परीक्षाएं व शैक्षणिक रैंक', 'विशिष्ट कला व विज्ञान में निपुणता', 'रचनात्मक मेधा व स्मरण शक्ति'],
    independentLagnaRuleEn: 'Mercury, Jupiter, and 4th/5th houses in D24 indicate the nature of scholarship and degrees attained.',
    independentLagnaRuleHi: 'D24 में बुध, गुरु तथा चतुर्थ व पंचम भाव जातक की उच्च डिग्रियों और बौद्धिक विषयों का निर्धारण करते हैं।',
    keyHousesToAnalyze: [4, 5, 9, 1],
    timeWindowMinutes: 5,
  },
  D27: {
    code: 'D27',
    harmonicDivision: 27,
    sanskritName: 'सप्तविंशांश / भांश (Saptavimsamsa / Bhamsa)',
    englishName: 'Nakshatramsa Chart',
    domainEn: 'Subconscious mind, mental stamina, physical endurance, innate strengths, and vulnerabilities.',
    domainHi: 'अवचेतन मन, मानसिक सहनशीलता, शारीरिक सहनशक्ति, सहज बल और कमजोरियां।',
    significationsEn: ['Psychological endurance under extreme stress', 'Hidden physical resilience', 'Immunity against prolonged crises', 'Innate subconscious tendencies'],
    significationsHi: ['संकट काल में मानसिक दृढ़ता', 'शारीरिक सहनशक्ति व ऊर्जा', 'दीर्घकालिक चुनौतियों में प्रतिरोधक क्षमता', 'अवचेतन प्रवृत्तियां'],
    independentLagnaRuleEn: 'Strength of Lagna and Moon in D27 determines psychological fortitude under life pressures.',
    independentLagnaRuleHi: 'D27 में लग्न व चंद्र का बल जीवन के कठिन तनावों में मानसिक दृढ़ता का प्रमाण है।',
    keyHousesToAnalyze: [1, 3, 6, 8],
    timeWindowMinutes: 4.4,
  },
  D30: {
    code: 'D30',
    harmonicDivision: 30,
    sanskritName: 'त्रिंशांश (Trimsamsa)',
    englishName: 'Trimsamsa Chart',
    domainEn: 'Evils, misfortunes, subconscious flaws, grave illness, ethical pitfalls, and arishta.',
    domainHi: 'अरिष्ट, विपत्तियां, अवचेतन दोष, असाध्य रोग, नैतिक चुनौतियां और संकट काल।',
    significationsEn: ['Misfortunes, accidents, and sudden setbacks', 'Severe chronic diseases and surgery', 'Ethical vulnerabilities and internal vices (Arishadvargas)', 'Karmic debts demanding atonement'],
    significationsHi: ['दुर्घटनाएं, संकट व अचानक रुकावटें', 'गंभीर रोग व शल्यक्रिया की आशंका', 'आंतरिक दुर्बलताएं (काम, क्रोध, लोभ आदि)', 'प्रायश्चित्त योग्य कर्म फल'],
    independentLagnaRuleEn: 'Natural malefics in D30 dusthanas cause less harm than when placed in kendras, which directly afflict character and health.',
    independentLagnaRuleHi: 'D30 में क्रूर ग्रह जब केंद्र में हों तो चरित्र व स्वास्थ्य को अधिक पीड़ित करते हैं, जबकि दुष्टानों में उनका प्रभाव न्यून रहता है।',
    keyHousesToAnalyze: [6, 8, 12, 1],
    timeWindowMinutes: 4,
  },
  D40: {
    code: 'D40',
    harmonicDivision: 40,
    sanskritName: 'खवेदांश / स्ववेदांश (Khavedamsa / Swavedamsa)',
    englishName: 'Khavedamsa Chart',
    domainEn: 'Maternal heritage, sub-conscious auspicious and inauspicious karmas, and maternal lineage blessings.',
    domainHi: 'मातृक कुल परंपरा, अवचेतन शुभ-अशुभ कर्म, और ननिहाल पक्ष के संस्कार।',
    significationsEn: ['Maternal ancestors\' spiritual influence', 'Subconscious karma from mother\'s lineage', 'Auspicious/inauspicious micro-events', 'Deep-seated emotional inclinations'],
    significationsHi: ['मातृक पूर्वजों का आत्मिक प्रभाव', 'ननिहाल पक्ष से प्राप्त सूक्ष्म संस्कार', 'जीवन के अप्रत्याशित शुभ-अशुभ मोड़', 'गहन भावनात्मक प्रवृत्तियां'],
    independentLagnaRuleEn: 'Benefics in quadrants and trines in D40 confer protective maternal ancestral shields.',
    independentLagnaRuleHi: 'D40 के केंद्र व त्रिकोण में शुभ ग्रह मातृक कुल से प्राप्त सुरक्षा कवच प्रदान करते हैं।',
    keyHousesToAnalyze: [4, 9, 1],
    timeWindowMinutes: 3,
  },
  D45: {
    code: 'D45',
    harmonicDivision: 45,
    sanskritName: 'अक्षवेदांश (Akshavedamsa)',
    englishName: 'Akshavedamsa Chart',
    domainEn: 'Paternal heritage, general auspiciousness, ethical purity, and foundational family character.',
    domainHi: 'पैतृक कुल परंपरा, समग्र शुभाशुभ फल, नैतिक शुद्धि और खानदानी प्रतिष्ठा।',
    significationsEn: ['Paternal ancestral karma and blessings', 'Innate integrity, moral purity, and truthfulness', 'Micro-level general auspiciousness', 'Ancestral spiritual legacy'],
    significationsHi: ['पैतृक कुल के संचित संस्कार व आशीर्वाद', 'जन्मजात सत्यनिष्ठा व नैतिक शुद्धि', 'सूक्ष्म स्तर पर भाग्य की अनुकूलता', 'पूर्वजों की आध्यात्मिक धरोहर'],
    independentLagnaRuleEn: 'A strong Sun and 9th house in D45 ensure spotless paternal reputation and moral rectitude.',
    independentLagnaRuleHi: 'D45 में सूर्य और नवम भाव का बल बेदाग पैतृक प्रतिष्ठा और धर्मपरायणता सुनिश्चित करता है।',
    keyHousesToAnalyze: [9, 1, 5],
    timeWindowMinutes: 2.6,
  },
  D60: {
    code: 'D60',
    harmonicDivision: 60,
    sanskritName: 'षष्ट्यंश (Shashtiamsa)',
    englishName: 'Shashtiamsa Chart',
    domainEn: 'Past-life karma, root blueprint of prarabdha, all matters, and ultimate arbiter of destiny.',
    domainHi: 'पूर्व जन्म के संचित कर्म, प्रारब्ध का मूल बीज, सभी जीवन क्षेत्र और भाग्य का अंतिम निर्णायक।',
    significationsEn: ['Exact root cause of all present-life joys and sorrows', 'Ultimate arbiter when D1/D9 indications conflict', 'Supreme precision chart for identical twin differentiation', 'Exacting diagnostic of past deeds'],
    significationsHi: ['वर्तमान जीवन के सभी सुख-दुःखों का मूल कारण', 'D1/D9 में विरोधाभास होने पर अंतिम निर्णायक', 'जुड़वां बच्चों (Twins) में अंतर करने वाला सर्वोच्च सूक्ष्म चक्र', 'पूर्व जन्म के कर्मों का साक्षात लेखा-जोखा'],
    independentLagnaRuleEn: 'Parasara states that D60 is superior to all other vargas. Benefic Shashtiamsa deities confer divine protection; malefic deities demand deep atonement.',
    independentLagnaRuleHi: 'महर्षि पराशर अनुसार D60 सभी वर्गों में शिरोमणि है। इसके शुभ देवता दैवीय रक्षा और क्रूर देवता प्रायश्चित्त व शांति की अपेक्षा रखते हैं।',
    keyHousesToAnalyze: [1, 5, 9, 10, 8, 12],
    timeWindowMinutes: 2,
  },
};

// ============================================================================
// 2. SPECIAL LAGNAS & YOGADA / MAHA YOGADA DOCTRINE (PVR CHAPTER 5, 11 & 13)
// ============================================================================

export interface PvrYogadaReport {
  hasYogada: boolean;
  hasMahaYogada: boolean;
  hasKevalaMahaYogada: boolean;
  dhanaYogadas: string[];
  rajaYogadas: string[];
  mahaYogadas: string[];
  kevalaMahaYogadas: string[];
  summaryHi: string;
  summaryEn: string;
}

export function evaluatePvrYogadaSystem(chart: ChartData): PvrYogadaReport {
  // Extract Lagna, HL (Hora Lagna), GL (Ghati Lagna), AL (Arudha Lagna)
  const lagnaSign = chart.ascendant.signIndex;
  const hlPoint = chart.specialPoints?.find((p) => p.id === 'HL');
  const glPoint = chart.specialPoints?.find((p) => p.id === 'GL');
  const alPoint = chart.specialPoints?.find((p) => p.id === 'AL');

  const hlSign = hlPoint ? hlPoint.signIndex : lagnaSign;
  const glSign = glPoint ? glPoint.signIndex : lagnaSign;
  const alSign = alPoint ? alPoint.signIndex : lagnaSign;

  // Jaimini / Parashari Rasi Aspect Rule:
  // Movable signs aspect all Fixed signs except the adjacent one.
  // Fixed signs aspect all Movable signs except the adjacent one.
  // Dual signs aspect all other Dual signs.
  const doesRasiAspect = (sign1: number, sign2: number): boolean => {
    if (sign1 === sign2) return true; // Conjunction / same sign
    const m1 = sign1 % 3; // 0: Movable, 1: Fixed, 2: Dual
    const m2 = sign2 % 3;
    if (m1 === 2 && m2 === 2) return true; // Dual aspects all dual
    if (m1 === 0 && m2 === 1) {
      // Movable aspects fixed except adjacent
      return (sign2 - sign1 + 12) % 12 !== 1;
    }
    if (m1 === 1 && m2 === 0) {
      // Fixed aspects movable except adjacent
      return (sign1 - sign2 + 12) % 12 !== 1;
    }
    return false;
  };

  const planetAspectsSign = (planetSign: number, targetSign: number): boolean => {
    return doesRasiAspect(planetSign, targetSign);
  };

  const dhanaYogadas: string[] = [];
  const rajaYogadas: string[] = [];
  const mahaYogadas: string[] = [];
  const kevalaMahaYogadas: string[] = [];

  for (const planet of chart.planets) {
    const pSign = planet.signIndex;
    const pId = planet.id;
    const ownsLagna = SIGNS[lagnaSign].lord === pId;
    const ownsHL = SIGNS[hlSign].lord === pId;
    const ownsGL = SIGNS[glSign].lord === pId;
    const ownsAL = SIGNS[alSign].lord === pId;

    const connectsLagna = ownsLagna || planetAspectsSign(pSign, lagnaSign);
    const connectsHL = ownsHL || planetAspectsSign(pSign, hlSign);
    const connectsGL = ownsGL || planetAspectsSign(pSign, glSign);
    const connectsAL = ownsAL || planetAspectsSign(pSign, alSign);

    const isDhanaYogada = connectsLagna && connectsHL;
    const isRajaYogada = connectsLagna && connectsGL;
    const isMaha = connectsLagna && connectsHL && connectsGL;
    const isKevala = isMaha && connectsAL;

    if (isDhanaYogada) dhanaYogadas.push(pId);
    if (isRajaYogada) rajaYogadas.push(pId);
    if (isMaha) mahaYogadas.push(pId);
    if (isKevala) kevalaMahaYogadas.push(pId);
  }

  const hasYogada = dhanaYogadas.length > 0 || rajaYogadas.length > 0;
  const hasMahaYogada = mahaYogadas.length > 0;
  const hasKevalaMahaYogada = kevalaMahaYogadas.length > 0;

  const summaryHi = hasKevalaMahaYogada
    ? `असाधारण केवल महा योगदा सक्रिय: ग्रह (${kevalaMahaYogadas.join(', ')}) लग्न, होरा लग्न (HL), घटि लग्न (GL) एवं आरूढ़ लग्न (AL) से एक साथ संबद्ध होकर जीवन में अपार धन, सर्वोच्च सत्ता और विश्वव्यापी ख्याति प्रदान करते हैं।`
    : hasMahaYogada
    ? `महा योगदा (Maha Yogada) सक्रिय: ग्रह (${mahaYogadas.join(', ')}) लग्न, होरा लग्न (धन) एवं घटि लग्न (सत्ता) को एक साथ जोड़ते हैं, जिससे जातक को नेतृत्व पद, उच्च अधिकार और आर्थिक संपन्नता का वरदान मिलता है।`
    : hasYogada
    ? `योगदा ग्रह सक्रिय: धन योगदा (${dhanaYogadas.join(', ') || 'कोई नहीं'}), राज योगदा (${rajaYogadas.join(', ') || 'कोई नहीं'})। इन ग्रहों की दशा में विशिष्ट आर्थिक व सामाजिक उत्कर्ष होगा।`
    : `सामान्य स्थिति: कोई ग्रह लग्न व विशेष लग्नों को सीधे नहीं जोड़ रहा है; फल सामान्य भावेश व योगों द्वारा संचालित होंगे।`;

  const summaryEn = hasKevalaMahaYogada
    ? `Extraordinary Kevala Maha Yogada active: Planet(s) (${kevalaMahaYogadas.join(', ')}) simultaneously associate with Lagna, Hora Lagna (HL), Ghati Lagna (GL), and Arudha Lagna (AL), conferring immense wealth, supreme authority, and enduring global fame.`
    : hasMahaYogada
    ? `Maha Yogada active: Planet(s) (${mahaYogadas.join(', ')}) link Lagna, Hora Lagna (wealth), and Ghati Lagna (power), conferring high administrative authority, executive command, and prosperity.`
    : hasYogada
    ? `Yogada planets active: Wealth Yogada (${dhanaYogadas.join(', ') || 'None'}), Power Yogada (${rajaYogadas.join(', ') || 'None'}). Major elevation occurs during their operational dashas.`
    : `Standard baseline: No single planet directly links Lagna with HL/GL. Results unfold through conventional house lordship and planetary yogas.`;

  return {
    hasYogada,
    hasMahaYogada,
    hasKevalaMahaYogada,
    dhanaYogadas,
    rajaYogadas,
    mahaYogadas,
    kevalaMahaYogadas,
    summaryHi,
    summaryEn,
  };
}

// ============================================================================
// 3. ARGALA & VIRODHARGALA INTERVENTION MECHANICS (PVR CHAPTER 10)
// ============================================================================

export interface PvrArgalaItem {
  houseNumber: number;
  argalaType: 'Primary 2nd' | 'Primary 4th' | 'Primary 11th' | 'Secondary 5th';
  argalaPlanets: string[];
  obstructingHouse: number;
  obstructingPlanets: string[];
  isObstructed: boolean;
  nature: 'Subha Argala (Benefic)' | 'Paapa Argala (Malefic)' | 'Mixed';
  manifestationEn: string;
  manifestationHi: string;
}

export function evaluatePvrArgalaOnHouse(chart: ChartData, targetHouse: number): PvrArgalaItem[] {
  const getPlanetsInHouse = (hNum: number): string[] => {
    return chart.planets.filter((p) => p.rasiHouseNumber === hNum).map((p) => p.id);
  };

  const isBenefic = (pId: string): boolean => {
    return ['Jupiter', 'Venus', 'Mercury', 'Moon'].includes(pId);
  };

  const getArgalaNature = (planets: string[]): PvrArgalaItem['nature'] => {
    if (planets.length === 0) return 'Subha Argala (Benefic)';
    const bCount = planets.filter(isBenefic).length;
    const mCount = planets.length - bCount;
    if (bCount > 0 && mCount === 0) return 'Subha Argala (Benefic)';
    if (mCount > 0 && bCount === 0) return 'Paapa Argala (Malefic)';
    return 'Mixed';
  };

  const calculatePair = (
    argalaRelHouse: number,
    obstructRelHouse: number,
    type: PvrArgalaItem['argalaType'],
    descEn: string,
    descHi: string
  ): PvrArgalaItem | null => {
    const aHouse = ((targetHouse - 1 + argalaRelHouse - 1) % 12) + 1;
    const oHouse = ((targetHouse - 1 + obstructRelHouse - 1) % 12) + 1;
    const aPlanets = getPlanetsInHouse(aHouse);
    const oPlanets = getPlanetsInHouse(oHouse);

    if (aPlanets.length === 0) return null; // No active argala if unoccupied

    // Obstruction rule: if obstructing house has equal or more planets, argala is obstructed
    const isObstructed = oPlanets.length >= aPlanets.length;
    const nature = getArgalaNature(aPlanets);

    return {
      houseNumber: aHouse,
      argalaType: type,
      argalaPlanets: aPlanets,
      obstructingHouse: oHouse,
      obstructingPlanets: oPlanets,
      isObstructed,
      nature,
      manifestationEn: isObstructed
        ? `${type} by ${aPlanets.join(', ')} is obstructed (Virodhargala) by ${oPlanets.join(', ')} in House ${oHouse}. Delayed or contested manifestation.`
        : `${nature} operating through House ${aHouse} (${aPlanets.join(', ')}): ${descEn}`,
      manifestationHi: isObstructed
        ? `भाव ${aHouse} (${aPlanets.join(', ')}) का अर्गला भाव ${oHouse} में स्थित ${oPlanets.join(', ')} द्वारा अवरुद्ध (विरोधाग्रला) है। फल में विलंब अथवा संघर्ष होगा।`
        : `भाव ${aHouse} (${aPlanets.join(', ')}) से सक्रिय ${nature}: ${descHi}`,
    };
  };

  const items: PvrArgalaItem[] = [];

  // Primary 2nd (obstructed by 12th)
  const a2 = calculatePair(2, 12, 'Primary 2nd', 'Immediate resources, family support, and grooming intervene positively.', 'संसाधन, कुटुंब का सहयोग और संस्कार अनुकूल परिणाम दिलाते हैं।');
  if (a2) items.push(a2);

  // Primary 4th (obstructed by 10th)
  const a4 = calculatePair(4, 10, 'Primary 4th', 'Domestic happiness, property foundation, and schooling sustain the house matter.', 'घरेलू सुख, अचल संपत्ति और बुनियादी शिक्षा इस भाव को पोषण प्रदान करते हैं।');
  if (a4) items.push(a4);

  // Primary 11th (obstructed by 3rd)
  const a11 = calculatePair(11, 3, 'Primary 11th', 'Financial gains, elder networking, and aspirations serve as strong catalysts.', 'आर्थिक लाभ, वरिष्ठ मित्रों का सहयोग और महत्वाकांक्षाएं उत्प्रेरक का कार्य करती हैं।');
  if (a11) items.push(a11);

  // Secondary 5th (obstructed by 9th)
  const a5 = calculatePair(5, 9, 'Secondary 5th', 'Intelligence, past karma, and emotional situation contribute as secondary factors.', 'बुद्धि, पूर्व-पुण्य और भावनात्मक स्थिति सहायक कारक के रूप में कार्य करते हैं।');
  if (a5) items.push(a5);

  return items;
}

// ============================================================================
// 4. GOCHARA MURTHI NIRNAYA & VEDHA DOCTRINE (PVR CHAPTER 25 & 26)
// ============================================================================

export type PvrMurthiType = 'Swarna (Gold)' | 'Rajata (Silver)' | 'Taamra (Copper)' | 'Loha (Iron)';

export interface PvrMurthiInfo {
  type: PvrMurthiType;
  relativeHouse: number;
  favourabilityPercentage: number;
  meaningEn: string;
  meaningHi: string;
  manifestationNoteEn: string;
  manifestationNoteHi: string;
}

export function computePvrTransitMurthi(
  transitMoonSignAtIngress: number,
  natalMoonSign: number
): PvrMurthiInfo {
  const relHouse = ((transitMoonSignAtIngress - natalMoonSign + 12) % 12) + 1;

  if ([1, 6, 11].includes(relHouse)) {
    return {
      type: 'Swarna (Gold)',
      relativeHouse: relHouse,
      favourabilityPercentage: 100,
      meaningEn: 'Golden Form — Highly Auspicious',
      meaningHi: 'स्वर्ण मूर्ति — सर्वोत्कृष्ट शुभ व पूर्ण फलदायक',
      manifestationNoteEn: 'The transiting planet manifests at 100% optimum beneficence. Even challenging transits produce minimal distress, and favorable transits deliver extraordinary rewards.',
      manifestationNoteHi: 'गोचरस्थ ग्रह १००% पूर्ण शुभता के साथ फल देता है। प्रतिकूल गोचर भी न्यून कष्ट देता है और अनुकूल गोचर में ऐतिहासिक भाग्योदय होता है।',
    };
  }

  if ([2, 5, 9].includes(relHouse)) {
    return {
      type: 'Rajata (Silver)',
      relativeHouse: relHouse,
      favourabilityPercentage: 75,
      meaningEn: 'Silver Form — Auspicious & Progressive',
      meaningHi: 'रजत मूर्ति — शुभ, सुखद व प्रगतिशील',
      manifestationNoteEn: 'The transiting planet operates with 75% favorable strength. Steady growth, domestic peace, and progressive gains unfold during this transit cycle.',
      manifestationNoteHi: 'गोचरस्थ ग्रह ७५% शुभ प्रभाव प्रदान करता है। दांपत्य सुख, आर्थिक स्थिरता और पारिवारिक शांति बनी रहती है।',
    };
  }

  if ([3, 7, 10].includes(relHouse)) {
    return {
      type: 'Taamra (Copper)',
      relativeHouse: relHouse,
      favourabilityPercentage: 50,
      meaningEn: 'Copper Form — Moderate / Testing',
      meaningHi: 'ताम्र मूर्ति — मध्यम, सामान्य व श्रमसाध्य',
      manifestationNoteEn: 'The transiting planet delivers 50% mixed results. Fruits are realized only through persistent labor and proactive problem-solving.',
      manifestationNoteHi: 'गोचरस्थ ग्रह ५०% मिश्रित परिणाम देता है। सफलता केवल निरंतर पुरुषार्थ, सावधानी व योजनाबद्ध कार्यशैली से ही प्राप्त होती है।',
    };
  }

  // Houses 4, 8, 12
  return {
    type: 'Loha (Iron)',
    relativeHouse: relHouse,
    favourabilityPercentage: 25,
    meaningEn: 'Iron Form — Highly Difficult / Severe Testing',
    meaningHi: 'लौह मूर्ति — अत्यंत कष्टकारी, संघर्षपूर्ण व अरिष्टदायक',
    manifestationNoteEn: 'The transiting planet manifests in an iron vessel (25% efficacy). Favorable houses yield only nominal results, while unfavorable houses trigger acute friction, financial drains, or health testing.',
    manifestationNoteHi: 'गोचरस्थ ग्रह लौह पात्र में फल देता है (२५% प्रभाव)। शुभ भाव में भी नाममात्र का लाभ मिलता है और प्रतिकूल भाव में स्वास्थ्य या आर्थिक संकट उत्पन्न हो सकते हैं।',
  };
}

// ============================================================================
// 5. BIRTHTIME ERROR SENSITIVITY SCALE (PVR CHAPTER 32)
// ============================================================================

export interface PvrVargaSensitivityItem {
  varga: string;
  durationMinutes: number;
  diagnosticFocusEn: string;
  diagnosticFocusHi: string;
}

export const PVR_BIRTHTIME_SENSITIVITY_TABLE: PvrVargaSensitivityItem[] = [
  { varga: 'D1 Rasi', durationMinutes: 120, diagnosticFocusEn: 'Gross body, general life direction, baseline physical constitution.', diagnosticFocusHi: 'स्थूल शरीर, सामान्य जीवन दिशा और भौतिक जीवन का आधार।' },
  { varga: 'D2 Hora', durationMinutes: 60, diagnosticFocusEn: 'Wealth accumulation, liquid resources, and speech temperament.', diagnosticFocusHi: 'धन संचय, नकदी संसाधन और पारिवारिक वाणी संस्कार।' },
  { varga: 'D3 Drekkana', durationMinutes: 40, diagnosticFocusEn: 'Sibling milestones, physical courage, sports prowess, and motivation.', diagnosticFocusHi: 'भाई-बहन का सुख, शारीरिक साहस और २२वां द्रेष्काण।' },
  { varga: 'D4 Chaturthamsa', durationMinutes: 30, diagnosticFocusEn: 'Real estate acquisition, residential moves, and permanent assets.', diagnosticFocusHi: 'गृह-निर्माण, भूमि क्रय और स्थायी अचल संपत्ति।' },
  { varga: 'D7 Saptamsa', durationMinutes: 17, diagnosticFocusEn: 'Child birth timing, gender sequence of children, and progeny health.', diagnosticFocusHi: 'संतान जन्म काल, वंश वृद्धि और संतान का स्वास्थ्य।' },
  { varga: 'D9 Navamsa', durationMinutes: 13.3, diagnosticFocusEn: 'Marriage timing, spouse persona, dharmic path, and inner talents.', diagnosticFocusHi: 'विवाह काल, जीवनसाथी का स्वरूप और धर्म-आध्यात्मिक मार्ग।' },
  { varga: 'D10 Dasamsa', durationMinutes: 12, diagnosticFocusEn: 'Career zenith, job changes, executive authority, and professional promotions.', diagnosticFocusHi: 'करियर में पदोन्नति, कार्यक्षेत्र परिवर्तन और प्रशासनिक अधिकार।' },
  { varga: 'D12 Dwadasamsa', durationMinutes: 10, diagnosticFocusEn: 'Parents\' health, ancestral lineage, and paternal/maternal heritage.', diagnosticFocusHi: 'माता-पिता का स्वास्थ्य, कुल परंपरा और पैतृक विरासत।' },
  { varga: 'D16 Shodasamsa', durationMinutes: 7.5, diagnosticFocusEn: 'Vehicles purchase, accidents, and inner contentment (sukha).', diagnosticFocusHi: 'वाहन क्रय, यात्रा सुरक्षा और आंतरिक सुख-साधन।' },
  { varga: 'D20 Vimsamsa', durationMinutes: 6, diagnosticFocusEn: 'Mantra initiation, spiritual retreats, and devotion to Ishta Devata.', diagnosticFocusHi: 'मंत्र दीक्षा, आध्यात्मिक साधना और इष्टदेव की उपासना।' },
  { varga: 'D24 Chaturvimsamsa', durationMinutes: 5, diagnosticFocusEn: 'University degrees, academic milestones, and competitive success.', diagnosticFocusHi: 'विश्वविद्यालयीय डिग्रियां, उच्च शिक्षा और बौद्धिक निपुणता।' },
  { varga: 'D27 Saptavimsamsa', durationMinutes: 4.4, diagnosticFocusEn: 'Subconscious mental fortitude, chronic resilience, and endurance.', diagnosticFocusHi: 'अवचेतन मानसिक क्षमता, संकट में सहनशक्ति और स्वास्थ्य।' },
  { varga: 'D30 Trimsamsa', durationMinutes: 4, diagnosticFocusEn: 'Misfortunes, surgeries, ethical challenges, and sudden setbacks.', diagnosticFocusHi: 'अरिष्ट, शल्यक्रिया, आकस्मिक बाधाएं और नैतिक चुनौतियां।' },
  { varga: 'D40 Khavedamsa', durationMinutes: 3, diagnosticFocusEn: 'Maternal ancestral karma, sudden auspicious twists in fortune.', diagnosticFocusHi: 'ननिहाल पक्ष के संस्कार और अप्रत्याशित सूक्ष्म घटनाएं।' },
  { varga: 'D45 Akshavedamsa', durationMinutes: 2.6, diagnosticFocusEn: 'Paternal ancestral blessings, ethical purity, and foundational character.', diagnosticFocusHi: 'पैतृक आशीर्वाद, चारित्रिक शुद्धि और नैतिक मूल्य।' },
  { varga: 'D60 Shashtiamsa', durationMinutes: 2, diagnosticFocusEn: 'Supreme twin differentiation, exact prarabdha root karma, past-life causes.', diagnosticFocusHi: 'जुड़वां जातकों में अंतर, पूर्व जन्म के संचित प्रारब्ध का मूल बीज।' },
];
