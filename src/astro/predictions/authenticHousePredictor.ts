import type { NineGrahaId, SevenPlanetId } from '../types';
import { getBhavesha144Entry } from './bhavesha144';

export interface AuthenticHousePredictionInput {
  houseNumber: number; // 1..12
  signIndex: number; // 0..11
  signNameEn: string;
  signNameHi: string;
  lordPlanet: SevenPlanetId;
  lordPlacedHouse: number; // 1..12
  lordDignity: string;
  isCombust: boolean;
  occupants: NineGrahaId[];
  aspectingPlanets: NineGrahaId[];
  beneficAspectsCount: number;
  maleficAspectsCount: number;
  savBindus: number;
  kartariYoga: 'Subhakartari' | 'Papakartari' | 'None';
  finalScore: number;
}

export interface AuthenticHousePredictionOutput {
  headlineEn: string;
  headlineHi: string;
  coreNarrativeEn: string;
  coreNarrativeHi: string;
  keyStrengthsEn: string[];
  keyStrengthsHi: string[];
  watchOutsEn: string[];
  watchOutsHi: string[];
  timingMilestonesEn: string;
  timingMilestonesHi: string;
}

const PLANET_NAME_EN: Record<NineGrahaId, string> = {
  Sun: 'Sun', Moon: 'Moon', Mars: 'Mars', Mercury: 'Mercury',
  Jupiter: 'Jupiter', Venus: 'Venus', Saturn: 'Saturn', Rahu: 'Rahu', Ketu: 'Ketu',
};

const PLANET_NAME_HI: Record<NineGrahaId, string> = {
  Sun: 'सूर्य', Moon: 'चंद्र', Mars: 'मंगल', Mercury: 'बुध',
  Jupiter: 'गुरु', Venus: 'शुक्र', Saturn: 'शनि', Rahu: 'राहु', Ketu: 'केतु',
};

const HOUSE_THEMES: Record<number, {
  domainEn: string;
  domainHi: string;
  headlineHighEn: string;
  headlineHighHi: string;
  headlineMidEn: string;
  headlineMidHi: string;
  headlineLowEn: string;
  headlineLowHi: string;
  defaultStrengthsEn: string[];
  defaultStrengthsHi: string[];
  defaultWatchoutsEn: string[];
  defaultWatchoutsHi: string[];
  timingEn: string;
  timingHi: string;
}> = {
  1: {
    domainEn: 'Self, Physical Constitution, Aura & Life Trajectory',
    domainHi: 'व्यक्तित्व, शारीरिक आरोग्यता, आत्मबल व जीवन दिशा',
    headlineHighEn: 'Commanding Self-Presence, Robust Vitality & Independent Destiny',
    headlineHighHi: 'तेजस्वी व्यक्तित्व, उत्कृष्ट शारीरिक रोग-प्रतिरोधक क्षमता व स्वतंत्र भाग्योदय',
    headlineMidEn: 'Resilient Self-Determination, Steady Energy & Developing Authority',
    headlineMidHi: 'कर्मठ व्यक्तित्व, संतुलित ऊर्जा व निरंतर प्रयास से बढ़ता प्रभाव',
    headlineLowEn: 'Testing Physical Demands, Introspective Growth & Need for Conscious Discipline',
    headlineLowHi: 'आरंभिक स्वास्थ्य सतर्कता, अंतर्मुखी विकास व नियमित अनुशासन की आवश्यकता',
    defaultStrengthsEn: [
      'Innate ability to take independent initiative and lead in challenging situations',
      'Strong recuperative stamina and resolute mental focus under pressure',
      'Commanding, trustworthy presence that naturally earns respect from peers',
    ],
    defaultStrengthsHi: [
      'स्वतंत्र निर्णय लेने और विषम परिस्थितियों में आगे बढ़कर नेतृत्व करने की स्वाभाविक क्षमता',
      'उत्कृष्ट शारीरिक रोग-प्रतिरोधक क्षमता तथा दबाव में भी शांत व एकाग्र रहने का स्वभाव',
      'सम्मानजनक व्यक्तित्व जिससे समाज व कार्यक्षेत्र में स्वाभाविक आदर प्राप्त होता है',
    ],
    defaultWatchoutsEn: [
      'Occasional impatience with slower progress or differing temperaments of others',
      'Tendency to overexert physical reserves and ignore proper restorative rest',
    ],
    defaultWatchoutsHi: [
      'दूसरों के धीमे कार्य या असहमति पर क्षणिक अधीरता या कठोर प्रतिक्रिया से बचाव रखें',
      'काम की धुन में शारीरिक विश्राम और नियमित आहार की उपेक्षा करने से बचें',
    ],
    timingEn: 'Ages 21–24 solidify core intellectual direction; Ages 26–28 mark major elevation in public stature.',
    timingHi: 'आयु 21 से 24 वर्ष में बौद्धिक व शैक्षणिक आधार दृढ़ होता है; 26 से 28 वर्ष में स्वतंत्र पहचान व मान-सम्मान का उत्कर्ष होता है।',
  },
  2: {
    domainEn: 'Accumulated Wealth, Speech, Lineage & Financial Permanence',
    domainHi: 'संचित धन, कुल-संपत्ति, वाणी माधुर्य व पारिवारिक सुख',
    headlineHighEn: 'Steadfast Financial Architecture, Enduring Assets & Persuasive Voice',
    headlineHighHi: 'स्थिर धन संचय, प्रचुर कुल-संपत्ति व प्रभावशाली सम्मोहक वाणी',
    headlineMidEn: 'Progressive Savings Growth, Practical Financial Sense & Family Ties',
    headlineMidHi: 'संतुलित बचत, व्यावहारिक वित्तीय दृष्टिकोण व पारिवारिक सहयोग',
    headlineLowEn: 'Fluctuating Liquidity, Need for Budgetary Discipline & Speech Caution',
    headlineLowHi: 'धन के उतार-चढ़ाव, अनुशासित बचत व वाणी में संयम की आवश्यकता',
    defaultStrengthsEn: [
      'Disciplined wealth retention habits and strategic foresight in resource allocation',
      'Persuasive, weight-carrying communication style in business and family negotiations',
      'Steadfast dedication to preserving ancestral assets and honoring family traditions',
    ],
    defaultStrengthsHi: [
      'धन संचय में गहरी सूझबूझ तथा बचत को उत्पादक संपत्तियों में बदलने की क्षमता',
      'गंभीर, तर्कसंगत और प्रभावशाली वाणी जो वार्ताओं में स्वाभाविक विश्वास जगाती है',
      'पारिवारिक कुल-परंपराओं का आदर तथा पैतृक संपत्ति की रक्षा का संकल्प',
    ],
    defaultWatchoutsEn: [
      'Vulnerability to sudden impulsive family expenditures or speculative investments',
      'Uncompromising bluntness in speech when emotionally stirred or defensive',
    ],
    defaultWatchoutsHi: [
      'असुरक्षित सट्टेबाजी या जोखिम भरे निवेश में संचित पूंजी फंसाने से बचें',
      'आवेश में आकर कटु या स्पष्टवादी शब्दों के प्रयोग से परिजनों में मतभेद न होने दें',
    ],
    timingEn: 'Primary independent revenue consolidates at Ages 27–29; Milestone capital assets expand at Ages 31–34.',
    timingHi: 'आयु 27 से 29 वर्ष में प्रथम स्थायी आय स्रोत स्थापित होता है; 31 से 34 वर्ष में भवन व स्थिर संपत्ति का विस्तार होता है।',
  },
  3: {
    domainEn: 'Courage, Self-Made Enterprise, Sibling Ties & Technical Skills',
    domainHi: 'पराक्रम, उद्यमशीलता, बंधु सहयोग, संचार व स्व-प्रयास',
    headlineHighEn: 'Unyielding Valour, High Entrepreneurial Dynamism & Sharp Initiative',
    headlineHighHi: 'अदम्य पराक्रम, उत्कृष्ट उद्यमशीलता, तीक्ष्ण बुद्धि व सफल स्व-प्रयास',
    headlineMidEn: 'Steady Practical Enterprise, Reliable Communication & Sibling Support',
    headlineMidHi: 'व्यावहारिक पुरुषार्थ, सक्षम संचार कौशल व बंधुजनों का संतुलित सहयोग',
    headlineLowEn: 'Testing Communication Friction, Restless Energy & Need for Focused Persistence',
    headlineLowHi: 'व्यर्थ की दौड़-धूप, बंधुओं से मतभेद व प्रयासों में निरंतरता की आवश्यकता',
    defaultStrengthsEn: [
      'Courage to initiate novel projects from scratch without waiting for external backing',
      'Versatile communicative, literary, or hands-on technological acumen',
      'Resilient problem-solving capacity when handling unexpected logistical hurdles',
    ],
    defaultStrengthsHi: [
      'बिना किसी सहारे के शून्य से नया उद्यम या प्रोजेक्ट शुरू करने का अदम्य साहस',
      'सटीक संचार, लेखन, मीडिया अथवा तकनीकी व हस्तकौशल में स्वाभाविक दक्षता',
      'विपरीत परिस्थितियों में तत्काल व्यावहारिक समाधान खोजने की तत्परता',
    ],
    defaultWatchoutsEn: [
      'Dispersing energy across too many simultaneous pursuits, diluting end-results',
      'Ego-based misunderstandings with younger siblings or immediate collaborators',
    ],
    defaultWatchoutsHi: [
      'एक साथ कई कार्यों में हाथ डालने से ऊर्जा का बिखराव न होने दें',
      'छोटे भाई-बहनों या सहकर्मियों के साथ अहंकार के कारण संवादहीनता से बचें',
    ],
    timingEn: 'Decisive independent breakthroughs activate at Ages 22–25; Enterprise maturity unfolds at Ages 28–32.',
    timingHi: 'आयु 22 से 25 वर्ष में स्व-प्रयास से महत्वपूर्ण सफलता; 28 से 32 वर्ष में उद्यम का परिपक्व विस्तार होता है।',
  },
  4: {
    domainEn: 'Domestic Serenity, Mother, Landed Real Estate & Vehicles',
    domainHi: 'गृहस्थ सुख, मातृ स्नेह, भूमि-भवन, वाहन व मनःशांति',
    headlineHighEn: 'Deep Domestic Sanctuary, Immovable Property Blessings & Mother’s Grace',
    headlineHighHi: 'सुखद गृहस्थ जीवन, प्रचुर भूमि-भवन व वाहन सुख तथा मातृ-आशीर्वाद',
    headlineMidEn: 'Grounded Emotional Stability, Progressive Home Building & Comforts',
    headlineMidHi: 'संतुलित मानसिक शांति, क्रमशः गृह-निर्माण व स्थिर घरेलू सुख',
    headlineLowEn: 'Domestic Relocations, Emotional Vulnerability & Property Scrutiny Required',
    headlineLowHi: 'मानसिक अशांति, निवास परिवर्तन व संपत्ति दस्तावेजों में अत्यधिक सावधानी की आवश्यकता',
    defaultStrengthsEn: [
      'Profound emotional grounding and capacity to create a protective, hospitable home',
      'Favorable disposition toward acquiring residential real estate and dependable vehicles',
      'Nurturing maternal bond that serves as an enduring anchor during turbulent times',
    ],
    defaultStrengthsHi: [
      'परिवार को एक सूत्र में बांधने तथा घर में सुखद व शांतिपूर्ण वातावरण बनाए रखने की कला',
      'अचल संपत्ति, आवासीय भूमि व आरामदायक वाहनों के स्वामित्व का मजबूत योग',
      'माता का स्नेह व आशीर्वाद जो जीवन की कठिन घड़ियों में संबल प्रदान करता है',
    ],
    defaultWatchoutsEn: [
      'Internalizing family stress, leading to digestive sensitivity or emotional brooding',
      'Overlooking legal documentation details during property or vehicle acquisitions',
    ],
    defaultWatchoutsHi: [
      'घरेलू चिंताओं को मन में दबाकर रखने से मानसिक तनाव व पाचन संबंधी संवेदनशीलता से बचें',
      'भूमि, भवन या वाहन क्रय करते समय वैधानिक कागजातों की पूर्ण जांच अवश्य करें',
    ],
    timingEn: 'Early domestic grounding activates at Ages 26–28; Milestone home or real estate ownership at Ages 30–35.',
    timingHi: 'आयु 26 से 28 वर्ष में पारिवारिक स्थायित्व; 30 से 35 वर्ष के मध्य स्थायी गृह-निर्माण या भूमि क्रय का योग।',
  },
  5: {
    domainEn: 'Intellect, Creative Genius, Progeny, Purva Punya & Investments',
    domainHi: 'प्रखर बुद्धि, मेधा, संतान सुख, रचनात्मकता, मंत्र सिद्धि व पूर्व पुण्य',
    headlineHighEn: 'Brilliant Creative Vision, Virtuous Lineage & Sharp Strategic Insight',
    headlineHighHi: 'असाधारण मेधा, सुयोग्य संतान सुख, मंत्र कृपा व दूरदर्शी रणनीतिक बुद्धि',
    headlineMidEn: 'Solid Analytical Acumen, Supportive Children & Constructive Foresight',
    headlineMidHi: 'व्यावहारिक बौद्धिक क्षमता, संतान से सहयोग व रचनात्मक चिंतन',
    headlineLowEn: 'Restless Mental Dispersion, Progeny Concerns & High Caution in Speculation',
    headlineLowHi: 'मानसिक भटकाव, संतान के प्रति चिंताएं व सट्टेबाजी/शेयर में संयम की आवश्यकता',
    defaultStrengthsEn: [
      'High intuitive and analytical intelligence capable of penetrating complex problems',
      'Natural mentorship qualities and creative self-expression in intellectual domains',
      'Endowment of past-life merits (Purva Punya) providing timely inspiration during crises',
    ],
    defaultStrengthsHi: [
      'गहन बौद्धिक चिंतन तथा जटिल विषयों को सहजता से समझकर मार्गदर्शन करने की क्षमता',
      'रचनात्मक कार्यों, योजना निर्माण तथा मंत्र/विद्या के क्षेत्र में स्वाभाविक अभिरुचि',
      'पूर्व जन्म के शुभ संस्कारों का प्रभाव जिससे संकट काल में सही निर्णय की प्रेरणा मिलती है',
    ],
    defaultWatchoutsEn: [
      'Impulsive speculative investments or gambling with calculated financial reserves',
      'Overthinking academic or romantic trajectories, leading to mental exhaustion',
    ],
    defaultWatchoutsHi: [
      'शेयर बाजार, लॉटरी या जल्दबाजी वाले सट्टे में संचित धन जोखिम में न डालें',
      'अत्यधिक मानसिक विश्लेषण या प्रेम संबंधों में अत्यधिक अपेक्षाओं से निराशा से बचें',
    ],
    timingEn: 'Intellectual validation and academic triumphs at Ages 20–24; Progeny and creative zeniths at Ages 28–33.',
    timingHi: 'आयु 20 से 24 वर्ष में बौद्धिक व शैक्षणिक सफलता; 28 से 33 वर्ष में संतान सुख व बौद्धिक प्रतिष्ठा का उत्कर्ष।',
  },
  6: {
    domainEn: 'Competitive Mastery, Health Resilience, Daily Service & Overcoming Obstacles',
    domainHi: 'शत्रु-शमन, रोग-प्रतिरोध, सेवा, ऋण-मुक्ति व प्रतिस्पर्धा विजय',
    headlineHighEn: 'Indomitable Competitive Edge, Ironclad Immunity & Mastery Over Adversaries',
    headlineHighHi: 'अजेय प्रतिस्पर्धा शक्ति, सुदृढ़ रोग-प्रतिरोधक क्षमता व शत्रुओं पर पूर्ण विजय',
    headlineMidEn: 'Disciplined Problem Solving, Steady Work Ethic & Manageable Liabilities',
    headlineMidHi: 'कड़ा परिश्रम, सेवा-भाव, ऋण प्रबंधन व व्यावहारिक संघर्ष क्षमता',
    headlineLowEn: 'Chronic Health Vulnerabilities, Debt Cautions & Legal Friction Points',
    headlineLowHi: 'स्वास्थ्य के प्रति निरंतर सतर्कता, ऋण के बोझ से बचाव व कानूनी विवादों से दूरी',
    defaultStrengthsEn: [
      'Unyielding resolve to face legal, competitive, or corporate challenges and emerge victorious',
      'Meticulous diagnostic focus in service, organizational workflows, and conflict resolution',
      'Tenacious capacity to outwork rivals through patient, methodical daily routine',
    ],
    defaultStrengthsHi: [
      'विपरीत परिस्थितियों व विरोधियों के षड्यंत्रों को अपनी सूझबूझ से परास्त करने का सामर्थ्य',
      'कार्यक्षेत्र में बारीकियों पर ध्यान देना तथा सेवा या नौकरी में निष्ठावान बने रहना',
      'कठिन श्रम व अनुशासित दिनचर्या से जटिल समस्याओं का स्थायी समाधान निकालना',
    ],
    defaultWatchoutsEn: [
      'Neglecting early dietary and lifestyle warning signs, inviting digestive or inflammatory strain',
      'Unnecessary involvement in prolonged litigation or adversarial grudges',
    ],
    defaultWatchoutsHi: [
      'शारीरिक संकेतों की उपेक्षा से बचें; अनियमित खानपान से पाचन या उदर विकार संभव हैं',
      'अनावश्यक कानूनी मुकदमों या दूसरों के विवादों में मध्यस्थता कर शत्रुता न मोल लें',
    ],
    timingEn: 'Major competitive or exam triumphs at Ages 23–27; Total debt clearance and authority at Ages 32–36.',
    timingHi: 'आयु 23 से 27 वर्ष में प्रतियोगी परीक्षाओं व विरोधियों पर विजय; 32 से 36 वर्ष में ऋण मुक्ति व सुदृढ़ नियंत्रण।',
  },
  7: {
    domainEn: 'Marriage, Spouse Nature, Bilateral Alliances & Public Image',
    domainHi: 'दांपत्य सुख, जीवनसाथी का स्वभाव, व्यापारिक साझेदारी व लोक-छवि',
    headlineHighEn: 'Cultured Matrimonial Bliss, High Spousal Harmony & Enduring Alliances',
    headlineHighHi: 'सुयोग्य जीवनसाथी, उत्तम दांपत्य सुख, समृद्ध परिवार व फलदायी साझेदारी',
    headlineMidEn: 'Supportive Domestic Partnership, Collaborative Growth & Mutual Respect',
    headlineMidHi: 'सहयोगात्मक वैवाहिक संबंध, परस्पर आदर व सम्मिलित प्रयासों से उन्नति',
    headlineLowEn: 'Marital Communication Friction, Spousal Temperament Differences & Delay Caution',
    headlineLowHi: 'दांपत्य जीवन में वैचारिक मतभेद, जीवनसाथी के स्वास्थ्य की चिंता व विवाह में विलंब',
    defaultStrengthsEn: [
      'Partner brings dignified family lineage, refined aesthetic sense, and mature counsel',
      'Marriage acts as a major catalyst for social elevation and public trustworthiness',
      'Fair, transparent approach in commercial agreements and collaborative ventures',
    ],
    defaultStrengthsHi: [
      'जीवनसाथी सुसंस्कृत, बुद्धिमान, स्वाभिमानी तथा पारिवारिक प्रतिष्ठा बढ़ाने वाला होता है',
      'विवाह के पश्चात सामाजिक मान-सम्मान व भाग्य में उल्लेखनीय वृद्धि का स्पष्ट योग',
      'साझेदारी व व्यापारिक समझौतों में ईमानदारी व निष्पक्षता से विश्वास अर्जित करना',
    ],
    defaultWatchoutsEn: [
      'Allowing career-related exhaustion or ego assertions to spill into domestic tranquility',
      'Entering business partnerships without ironclad written covenants and clear boundaries',
    ],
    defaultWatchoutsHi: [
      'कार्यक्षेत्र के तनाव या अहंकार को दांपत्य जीवन के प्रेम और शांति पर हावी न होने दें',
      'व्यापारिक साझेदारी करते समय मौखिक बातों पर न रहें; स्पष्ट लिखित अनुबंध अवश्य करें',
    ],
    timingEn: 'Prime auspicious matrimony window at Ages 25–29; Post-marital joint asset fruition at Ages 31–36.',
    timingHi: 'अनुकूल वैवाहिक स्वर्ण काल आयु 25 से 29 वर्ष; विवाह उपरांत संयुक्त संपत्ति व प्रतिष्ठा का उत्कर्ष 31 से 36 वर्ष।',
  },
  8: {
    domainEn: 'Longevity, Occult Depth, Sudden Transformations, Inheritance & Renewal',
    domainHi: 'आयु बल, गूढ़ अनुसंधान, पैतृक संपत्ति, आकस्मिक परिवर्तन व आत्म-रूपांतरण',
    headlineHighEn: 'Profound Inner Resilience, Occult Penetration & Unearned Wealth Blessings',
    headlineHighHi: 'दीर्घायु, गूढ़ विद्याओं की सिद्धि, पैतृक संपत्ति प्राप्ति व संकटों से पुनरुत्थान',
    headlineMidEn: 'Transformative Tenacity, Secret Research Aptitude & Steady Crisis Management',
    headlineMidHi: 'गंभीर चिंतन, गोपनीय मामलों में सफलता व संकटों से सीखकर आगे बढ़ने की शक्ति',
    headlineLowEn: 'Sudden Life Disruptions, Fluctuating Stamina & Vigilance with In-Laws/Inheritance',
    headlineLowHi: 'आकस्मिक उतार-चढ़ाव, गुप्त चिंताएं, ससुराल पक्ष से सतर्कता व वाहन संचालन में सावधानी',
    defaultStrengthsEn: [
      'Exceptional psychological resilience and capacity to reinvent life after severe crises',
      'Innate depth for occult sciences, psychological research, audits, and hidden data',
      'Potential for unexpected windfall gains through inheritances, insurance, or spousal assets',
    ],
    defaultStrengthsHi: [
      'गंभीर संकटों व परिवर्तनों के बाद भी पुनः उठ खड़े होने का असाधारण आत्मबल',
      'गूढ़ ज्ञान, ज्योतिष, शोध, मनोविज्ञान या गुप्त वित्तीय अन्वेषण में गहरी अंतर्दृष्टि',
      'पैतृक संपत्ति, बीमा, ससुराल पक्ष अथवा अप्रत्याशित स्रोतों से आकस्मिक धन लाभ का योग',
    ],
    defaultWatchoutsEn: [
      'Tendency toward secretiveness or brooding over past betrayals and emotional wounds',
      'Recklessness when handling hazardous machinery or driving in low visibility',
    ],
    defaultWatchoutsHi: [
      'मन में अनावश्यक शंकाएं या पुरानी कड़वी यादें पालकर मानसिक शांति भंग न करें',
      'तीव्र गति से वाहन चलाने या जोखिम भरे कार्यों में लापरवाही से पूर्ण बचाव रखें',
    ],
    timingEn: 'Deep psychological awakening at Ages 28–30; Materialized transformative assets at Ages 35–42.',
    timingHi: 'आयु 28 से 30 वर्ष में आत्मिक व मानसिक रूपांतरण; 35 से 42 वर्ष में पैतृक संपत्ति व गूढ़ ज्ञान की प्राप्ति।',
  },
  9: {
    domainEn: 'Fortune (Bhagya), Higher Ethics, Spiritual Mentors, Father & Long Travels',
    domainHi: 'भाग्योदय, धर्म निष्ठा, गुरु कृपा, पिता का आशीष व उच्च ज्ञान',
    headlineHighEn: 'Radiant Bhagya Blessings, Paternal Protection & Expansive Global Wisdom',
    headlineHighHi: 'प्रबल भाग्योदय, पिता व गुरु का पूर्ण संरक्षण, उच्च धर्म निष्ठा व वैश्विक ख्याति',
    headlineMidEn: 'Principled Ethical Living, Fortunate Pilgrimages & Sound Philosophical Base',
    headlineMidHi: 'सदाचारी जीवन, तीर्थ यात्राओं का पुण्य व निरंतर बढ़ता आत्मिक ज्ञान',
    headlineLowEn: 'Testing Paternal Relationships, Delayed Fortune Rising & Philosophical Friction',
    headlineLowHi: 'भाग्योदय में विलंब, पिता से वैचारिक मतभेद व धार्मिक संशयों से गुजरने का काल',
    defaultStrengthsEn: [
      'Divine protection that turns unexpected crises into golden learning opportunities',
      'Steadfast ethical moral compass, earning the trust of elder statesmen and scholars',
      'Beneficial long-distance travels, cross-cultural exposure, and philosophical publications',
    ],
    defaultStrengthsHi: [
      'ईश्वरीय कृपा का कवच जो कठिन मोड़ों पर भी सही राह दिखाकर भाग्योदय कराता है',
      'उच्च नैतिक आचरण व सत्यनिष्ठा, जिससे विद्वानों व वरिष्ठ जनों का विश्वास प्राप्त होता है',
      'दूरस्थ देशों की यात्राएं, तीर्थाटन तथा उच्च ज्ञान व दर्शन के प्रचार-प्रसार का अवसर',
    ],
    defaultWatchoutsEn: [
      'Dogmatic self-righteousness or judging others who do not share your philosophical views',
      'Straining relationships with father or mentors over ideological differences',
    ],
    defaultWatchoutsHi: [
      'अपने विचारों को दूसरों पर थोपने या धार्मिक कट्टरता से पूर्ण बचाव रखें',
      'पिता या गुरुजनों के साथ वैचारिक असहमति होने पर भी मर्यादा व आदर भंग न होने दें',
    ],
    timingEn: 'Decisive fortune awakening at Ages 24–28; Paternal honors and global horizons at Ages 32–38.',
    timingHi: 'आयु 24 से 28 वर्ष में भाग्योदय का प्रथम सशक्त चरण; 32 से 38 वर्ष में तीर्थ यात्रा, गुरु कृपा व अंतरराष्ट्रीय ख्याति।',
  },
  10: {
    domainEn: 'Career Authority, Professional Zenith, Executive Status & Life Accomplishment',
    domainHi: 'आजीविका, प्रशासनिक अधिकार, पद-प्रतिष्ठा, सामाजिक कीर्ति व कर्म सिद्धि',
    headlineHighEn: 'Commanding Executive Zenith, Institutional Authority & Enduring Legacy',
    headlineHighHi: 'शीर्ष प्रशासनिक अधिकार, कार्यक्षेत्र में सर्वोच्च पद-प्रतिष्ठा व चिरस्थायी कीर्ति',
    headlineMidEn: 'Steadfast Professional Stature, Reliable Leadership & Respected Industry Rank',
    headlineMidHi: 'विश्वसनीय कार्य-कुशलता, निरंतर पदोन्नति व उद्योग क्षेत्र में सम्मानित स्थान',
    headlineLowEn: 'Restless Vocational Transitions, Superiors Friction & High Demands on Patience',
    headlineLowHi: 'कार्यक्षेत्र में अस्थिरता, वरिष्ठ अधिकारियों से टकराव व धैर्यपूर्वक अनुभव निर्माण की आवश्यकता',
    defaultStrengthsEn: [
      'Natural executive leadership instinct suited for commanding large organizations or projects',
      'High professional resilience capable of weathering corporate restructuring and political tides',
      'Ability to build a tangible, respected public reputation through unbending professional ethics',
    ],
    defaultStrengthsHi: [
      'उच्च प्रशासनिक पद, प्रबंधकीय दायित्व और बड़े प्रोजेक्ट्स को सफलतापूर्वक चलाने की क्षमता',
      'कार्यक्षेत्र की उथल-पुथल में भी अपनी कार्यकुशलता और साख को बनाए रखने का सामर्थ्य',
      'अपने श्रम व निष्ठा से समाज और संस्थान में एक स्थायी, आदरणीय नाम स्थापित करना',
    ],
    defaultWatchoutsEn: [
      'Ego-based clashes with bureaucratic authorities or senior board executives',
      'Sacrificing personal relationships and health on the altar of relentless ambition',
    ],
    defaultWatchoutsHi: [
      'वरिष्ठ अधिकारियों या सत्तापक्ष के साथ अनावश्यक अहं के टकराव से पूर्ण बचाव रखें',
      'अत्यधिक कार्य-व्यस्तता के कारण परिवार और स्वयं के स्वास्थ्य की बलि न चढ़ाएं',
    ],
    timingEn: 'Credentials validation and entry at Ages 24–26; Executive promotion at Ages 29–33; Zenith at Ages 36–42.',
    timingHi: 'आयु 24 से 26 वर्ष में कार्यक्षेत्र में प्रवेश; 29 से 33 वर्ष में निर्णायक पदोन्नति व अधिकार विस्तार; 36 से 42 वर्ष में करियर का सर्वोच्च शिखर।',
  },
  11: {
    domainEn: 'Financial Gains, Influential Networks, Elder Siblings & Desire Fulfillment',
    domainHi: 'प्रचुर धन लाभ, नियमित आय, प्रतिष्ठित मित्र-वर्ग व अभीष्ट मनोकामना पूर्ति',
    headlineHighEn: 'Compounding Revenue Inflows, Elite High-Stature Networks & Dream Fulfillment',
    headlineHighHi: 'प्रचुर नियमित आय, प्रतिष्ठित प्रभावशाली मित्र-वर्ग व समस्त अभीष्ट इच्छाओं की पूर्ति',
    headlineMidEn: 'Reliable Multiple Income Streams, Loyal Peer Alliances & Steady Prosperity',
    headlineMidHi: 'आय के एकाधिक स्थिर स्रोत, निष्ठावान मित्र-मंडली व निरंतर आर्थिक प्रगति',
    headlineLowEn: 'Erratic Inflow Channels, Exploitative Acquaintances & High Caution in Speculation',
    headlineLowHi: 'आय में अनियमितता, मित्रों से विश्वासघात से बचाव व व्यर्थ की महत्वाकांक्षाओं पर नियंत्रण',
    defaultStrengthsEn: [
      'Innate ability to monetize skills and create compounding, diversified revenue channels',
      'Magnetic networking skill that draws influential patrons and collaborative champions',
      'Fulfillment of major lifelong aspirations through strategic collective efforts',
    ],
    defaultStrengthsHi: [
      'अपनी क्षमताओं को आर्थिक लाभ में बदलने तथा आय के नए साधन निर्मित करने की चतुरता',
      'उच्च पदस्थ और प्रभावशाली व्यक्तियों से संबंध स्थापित कर पारस्परिक लाभ अर्जित करना',
      'योजनाबद्ध सामूहिक प्रयासों से जीवन की बड़ी से बड़ी महत्वाकांक्षाओं को साकार करना',
    ],
    defaultWatchoutsEn: [
      'Lending large capital sums to friends or informal syndicates without collateral',
      'Allowing materialistic greed to overshadow ethical principles in commercial deals',
    ],
    defaultWatchoutsHi: [
      'मित्रों या परिचितों को बिना ठोस गारंटी के बड़ा कर्ज देने से बचें, धन फंस सकता है',
      'जल्द धनवान बनने के लालच में अनैतिक या गैर-कानूनी रास्तों से पूर्ण दूरी बनाए रखें',
    ],
    timingEn: 'Major financial network breakthroughs at Ages 27–31; Expansive wealth multiplication at Ages 36–45.',
    timingHi: 'आयु 27 से 31 वर्ष में प्रभावशाली संपर्कों से बड़ा आर्थिक लाभ; 36 से 45 वर्ष में धन और संपत्तियों का बहुगुणा विस्तार।',
  },
  12: {
    domainEn: 'Foreign Horizons, Philanthropy, Subconscious Peace & Spiritual Liberation',
    domainHi: 'विदेश गमन/वास, दान-पुण्य, शयन सुख, अंतर्मुखी साधना व मोक्ष',
    headlineHighEn: 'Flourishing Foreign Settlement, Boundless Philanthropy & Soul Liberation',
    headlineHighHi: 'सफल विदेश वास/यात्राएं, परोपकार, उत्तम शयन सुख व आत्मिक मोक्ष साधना',
    headlineMidEn: 'Constructive Global Links, Mindful Expenditures & Inner Contemplation',
    headlineMidHi: 'विदेशी संपर्कों से लाभ, संतुलित व्यय व ध्यान-साधना में अभिरुचि',
    headlineLowEn: 'Draining Unplanned Outflows, Sleep Restlessness & Solitude Testing',
    headlineLowHi: 'अनियंत्रित व्यय, अनिद्रा/तनाव, एकाकीपन व विदेशी संपर्कों में सतर्कता की आवश्यकता',
    defaultStrengthsEn: [
      'Favorable planetary winds for foreign travel, multinational commerce, or overseas residence',
      'Profound philanthropic urge; donations and selfless service yield immense peace and karmic protection',
      'Natural meditative ability to detach from worldly noise and recharge subconscious vitality',
    ],
    defaultStrengthsHi: [
      'विदेश यात्रा, बहुराष्ट्रीय कंपनियों में कार्य अथवा सुदूर स्थानों से धन अर्जन का मजबूत योग',
      'परोपकार और दान-पुण्य की स्वाभाविक भावना, जिससे मानसिक शांति और पुण्य फल प्राप्त होते हैं',
      'एकांत में ध्यान, योग और आत्म-मंथन द्वारा अपनी मानसिक ऊर्जा को पुनः जागृत करने की क्षमता',
    ],
    defaultWatchoutsEn: [
      'Chronic leakage of funds into unvetted philanthropic schemes or overseas intermediaries',
      'Subconscious anxiety, irregular sleep patterns, or escape into excessive isolation',
    ],
    defaultWatchoutsHi: [
      'अनियोजित और व्यर्थ के दिखावटी खर्चों पर नियंत्रण रखें; बजट बनाकर चलना आवश्यक है',
      'अनिद्रा या अवसाद से बचने के लिए रात्रि में डिजिटल स्क्रीन से दूरी व योगनिद्रा अपनाएं',
    ],
    timingEn: 'First significant foreign or retreat voyage at Ages 25–29; Transcendent spiritual awakening past Age 45.',
    timingHi: 'आयु 25 से 29 वर्ष में प्रथम महत्वपूर्ण विदेश यात्रा या तीर्थ गमन; 45 वर्ष के उपरांत गहन आध्यात्मिक जागरण।',
  },
};

const SIGN_DESCRIPTIONS_EN: Record<number, string> = {
  0: 'a fiery, dynamic, and pioneering sign that demands direct initiative, bold action, and quick results',
  1: 'a grounded, practical, and enduring earth sign that values stability, material comfort, and patient accumulation',
  2: 'a versatile, communicative, and intellectually agile air sign that thrives on multi-tasking and ideas',
  3: 'a deeply intuitive, empathetic, and protective water sign that seeks emotional security and domestic belonging',
  4: 'a regal, charismatic, and dignified fire sign that commands respect, creative authority, and public honor',
  5: 'an analytical, methodical, and perfectionist earth sign that excels in systematic problem-solving and service',
  6: 'a diplomatic, aesthetic, and balanced air sign that prioritizes fairness, partnerships, and refined harmony',
  7: 'an intense, transformative, and deeply perceptive water sign with unwavering focus and investigative depth',
  8: 'a philosophical, expansive, and idealistic fire sign driven by ethical wisdom, adventure, and truth-seeking',
  9: 'a disciplined, ambitious, and pragmatic earth sign that builds long-term success through structured endurance',
  10: 'an unconventional, visionary, and humanitarian air sign that thinks ahead of its time and values freedom',
  11: 'a compassionate, imaginative, and spiritual water sign that dissolves boundaries and seeks transcendent meaning',
};

const SIGN_DESCRIPTIONS_HI: Record<number, string> = {
  0: 'अग्नि तत्व प्रधान मेष राशि, जो अदम्य साहस, त्वरित निर्णय और नेतृत्व करने की तीव्र प्रेरणा देती है',
  1: 'पृथ्वी तत्व प्रधान वृषभ राशि, जो जीवन में स्थिरता, व्यावहारिक धैर्य और संपत्ति संचय को प्राथमिकता देती है',
  2: 'वायु तत्व प्रधान मिथुन राशि, जो तीक्ष्ण बुद्धि, वाकपटुता और बहुमुखी प्रतिभा का संचार करती है',
  3: 'जल तत्व प्रधान कर्क राशि, जो गहरी संवेदनशीलता, अंतर्ज्ञान और परिवार के प्रति अगाध समर्पण देती है',
  4: 'अग्नि तत्व प्रधान सिंह राशि, जो स्वाभाविक गरिमा, नेतृत्व, मान-सम्मान और प्रभुत्व की प्रेरणा देती है',
  5: 'पृथ्वी तत्व प्रधान कन्या राशि, जो सूक्ष्म विश्लेषण, कार्यकुशलता और अनुशासित सेवा-भाव का संचार करती है',
  6: 'वायु तत्व प्रधान तुला राशि, जो न्यायप्रियता, संतुलन, सौंदर्य बोध और सफल साझेदारी को सुगम बनाती है',
  7: 'जल तत्व प्रधान वृश्चिक राशि, जो अगाध इच्छाशक्ति, गूढ़ अन्वेषण और संकटों से पार पाने की शक्ति देती है',
  8: 'अग्नि तत्व प्रधान धनु राशि, जो उच्च आदर्श, धर्म-निष्ठा, आशावाद और सत्य की खोज को प्रेरित करती है',
  9: 'पृथ्वी तत्व प्रधान मकर राशि, जो कठोर अनुशासन, व्यावहारिक धैर्य और दीर्घकालिक महत्वाकांक्षा का निर्माण करती है',
  10: 'वायु तत्व प्रधान कुंभ राशि, जो प्रगतिशील दृष्टिकोण, मानवीय संवेदना और स्वतंत्र चिंतन का विकास करती है',
  11: 'जल तत्व प्रधान मीन राशि, जो असीम करुणा, कल्पनाशीलता और आध्यात्मिक चेतना का उन्मेष करती है',
};

const OCCUPANT_EFFECTS_EN: Record<NineGrahaId, string> = {
  Sun: 'The Sun sitting in this house radiates authority, natural confidence, and executive visibility, though demanding conscious care to prevent ego from overriding collaboration.',
  Moon: 'The Moon occupying this house infuses intuitive responsiveness, public appeal, and emotional warmth, with periodic cycles of mood or interest.',
  Mars: 'Mars here injects fierce dynamism, technical precision, and fearless ambition, driving you to tackle obstacles with relentless energy.',
  Mercury: 'Mercury in this house activates sharp analytical wits, eloquent expression, and commercial acumen, facilitating profitable negotiations.',
  Jupiter: 'Jupiter bestows divine benevolence, ethical wisdom, and broad expansion, acting as a golden shield of protection during testing hours.',
  Venus: 'Venus graces this house with aesthetic elegance, diplomatic tact, and harmonizing charm, ensuring refined social and domestic pleasure.',
  Saturn: 'Saturn brings disciplined realism, mature endurance, and structured patience, ensuring that while early progress requires hard labor, the final achievements endure permanently.',
  Rahu: 'Rahu introduces unconventional ambition, a desire to shatter traditional limits, and sudden surge opportunities, often linked to modern technologies or foreign avenues.',
  Ketu: 'Ketu grants deep spiritual detachment, sharp investigative perception, and intuitive breakthroughs, urging you to focus on genuine substance rather than outer glamour.',
};

const OCCUPANT_EFFECTS_HI: Record<NineGrahaId, string> = {
  Sun: 'सूर्य की यहां उपस्थिति आपको स्वाभाविक तेज, अधिकार और नेतृत्व क्षमता प्रदान करती है, यद्यपि अहंकार से बचकर सहयोग की भावना रखना आवश्यक है।',
  Moon: 'चंद्रमा का यहां बैठना आपके भीतर गहरी संवेदनशीलता, लोकप्रियता और जन-आकर्षण उत्पन्न करता है, यद्यपि मन में कभी-कभी उतार-चढ़ाव संभव है।',
  Mars: 'मंगल का यहां स्थित होना अदम्य साहस, ऊर्जा और तकनीकी या प्रशासनिक दक्षता देता है, जिससे आप बाधाओं से डरे बिना सीधे मुकाबला करते हैं।',
  Mercury: 'बुध का प्रभाव आपकी बुद्धि को प्रखर, वाणी को प्रभावशाली और व्यापारिक समझ को अत्यंत सूक्ष्म बनाता है, जिससे समझौते आपके पक्ष में होते हैं।',
  Jupiter: 'बृहस्पति की कृपा से इस भाव को ईश्वरीय सुरक्षा, उच्च विवेक और नैतिक विस्तार प्राप्त होता है, जो संकट के समय सही दिशा दिखाता है।',
  Venus: 'शुक्र का सौंदर्य और कलात्मक प्रभाव यहां आकर्षण, मधुर संबंध और भौतिक सुख-सुविधाओं का विस्तार करता है।',
  Saturn: 'शनि का अनुशासन यहां धैर्य और कड़े श्रम की मांग करता है; प्रारंभिक विलंब संभव है, किंतु निर्मित होने वाली सफलता जीवन भर स्थायी रहती है।',
  Rahu: 'राहु की स्थिति असीम महत्वाकांक्षा, लीक से हटकर नए रास्ते खोजने की ललक और अप्रत्याशित छलांग का योग बनाती है।',
  Ketu: 'केतु का प्रभाव गहन अंतर्दृष्टि, अनासक्ति और सूक्ष्म अनुसंधान की शक्ति देता है, जिससे आप दिखावे से दूर वास्तविक सत्य को पहचानते हैं।',
};

export function buildAuthenticHousePrediction(input: AuthenticHousePredictionInput): AuthenticHousePredictionOutput {
  const {
    houseNumber: h,
    signIndex,
    signNameEn,
    signNameHi,
    lordPlanet,
    lordPlacedHouse,
    lordDignity,
    isCombust,
    occupants,
    aspectingPlanets,
    beneficAspectsCount,
    maleficAspectsCount,
    savBindus,
    kartariYoga,
    finalScore,
  } = input;

  const theme = HOUSE_THEMES[h] || HOUSE_THEMES[1];
  const b144 = getBhavesha144Entry(h, lordPlacedHouse);

  // 1. Dynamic Headline
  let headlineEn = theme.headlineMidEn;
  let headlineHi = theme.headlineMidHi;
  if (finalScore >= 75) {
    headlineEn = theme.headlineHighEn;
    headlineHi = theme.headlineHighHi;
  } else if (finalScore < 50) {
    headlineEn = theme.headlineLowEn;
    headlineHi = theme.headlineLowHi;
  }

  // 2. Direct, Engaging, Astrological Predictive Narrative
  // Paragraph 1: Core Foundation & Trajectory (Sign + Lord Placement)
  const signTraitEn = SIGN_DESCRIPTIONS_EN[signIndex] || 'a multifaceted zodiacal sign';
  const signTraitHi = SIGN_DESCRIPTIONS_HI[signIndex] || 'एक विशिष्ट राशि प्रभाव';

  const lordDignityNoteEn = ['Exalted', 'Moolatrikona', 'Own Sign'].includes(lordDignity)
    ? `Since your house ruler ${PLANET_NAME_EN[lordPlanet]} is deeply fortified in ${lordDignity}, this area of life functions as a prime cornerstone of power, granting natural mastery and self-assurance.`
    : ['Great Friend', 'Friend'].includes(lordDignity)
      ? `With ${PLANET_NAME_EN[lordPlanet]} well-placed in friendly dignity, steady support and constructive allies consistently ease your progress.`
      : ['Debilitated', 'Great Enemy', 'Enemy'].includes(lordDignity)
        ? `Because ${PLANET_NAME_EN[lordPlanet]} operates under testing dignity, initial progress requires patient refinement, learning to master challenges through deliberate maturity rather than hasty shortcuts.`
        : `Governed steadily by ${PLANET_NAME_EN[lordPlanet]}, your outcomes reflect the quality of sustained dedication you invest.`;

  const lordDignityNoteHi = ['Exalted', 'Moolatrikona', 'Own Sign'].includes(lordDignity)
    ? `चूंकि इस भाव के स्वामी ${PLANET_NAME_HI[lordPlanet]} ${lordDignity === 'Exalted' ? 'उच्च' : 'स्वराशि'} होकर अत्यंत बली हैं, अतः यह क्षेत्र आपके जीवन का प्रमुख शक्ति-स्तंभ बनेगा और आपको स्वाभाविक आत्मविश्वास व अधिकार प्रदान करेगा।`
    : ['Great Friend', 'Friend'].includes(lordDignity)
      ? `${PLANET_NAME_HI[lordPlanet]} के मित्र राशि में होने से आपको शुभ चिंतकों और अनुकूल परिस्थितियों का निरंतर सहयोग प्राप्त होगा।`
      : ['Debilitated', 'Great Enemy', 'Enemy'].includes(lordDignity)
        ? `${PLANET_NAME_HI[lordPlanet]} के संघर्षमय स्थिति में होने से इस क्षेत्र में प्रारंभिक दौर में धैर्य व सूझबूझ से काम लेना होगा; जल्दबाजी से बचें।`
        : `${PLANET_NAME_HI[lordPlanet]} की सम स्थिति के कारण आपके परिश्रम और नियमित प्रयासों के अनुपात में निरंतर प्रगति होगी।`;

  const combustionNoteEn = isCombust
    ? ` Additionally, the house ruler's proximity to the Sun calls for extra diligence, purifying your motives through hard-earned experience before material rewards fully bloom.`
    : '';
  const combustionNoteHi = isCombust
    ? ` साथ ही भावेश के सूर्य के सान्निध्य में होने से इस भाव के परिणामों में प्रारंभिक तपस्या और श्रम के बाद ही पूर्ण फल प्राप्त होगा।`
    : '';

  const para1En = `In your chart, this domain is anchored in ${signNameEn}—${signTraitEn}. Your house ruler ${PLANET_NAME_EN[lordPlanet]} is situated in House ${lordPlacedHouse}. ${b144.readingEn} ${lordDignityNoteEn}${combustionNoteEn}`;
  const para1Hi = `आपकी जन्म कुंडली में यह भाव ${signNameHi} राशि में स्थित है—जो कि ${signTraitHi} है। इस भाव के स्वामी ${PLANET_NAME_HI[lordPlanet]} कुंडली के ${lordPlacedHouse}वें भाव में विराजमान हैं। ${b144.readingHi} ${lordDignityNoteHi}${combustionNoteHi}`;

  // Paragraph 2: Operational Manifestations (Occupants + Aspects + Kartari)
  const occTextsEn = occupants.map((o) => OCCUPANT_EFFECTS_EN[o]).filter(Boolean);
  const occTextsHi = occupants.map((o) => OCCUPANT_EFFECTS_HI[o]).filter(Boolean);

  let occBlockEn = '';
  let occBlockHi = '';
  if (occTextsEn.length > 0) {
    occBlockEn = ` ${occTextsEn.join(' ')}`;
    occBlockHi = ` ${occTextsHi.join(' ')}`;
  } else {
    occBlockEn = ` Having no direct planetary occupants, this house operates with clean focus, expressing its promises purely through its ruler ${PLANET_NAME_EN[lordPlanet]} and the aspects it receives.`;
    occBlockHi = ` इस भाव में कोई प्रत्यक्ष ग्रह स्थित न होने से यह भाव रिक्त है, जिससे इसके परिणाम पूर्णतः भावेश ${PLANET_NAME_HI[lordPlanet]} और इस पर पड़ने वाली दृष्टियों के माध्यम से सुगमता से व्यक्त होते हैं।`;
  }

  let aspectBlockEn = '';
  let aspectBlockHi = '';
  if (beneficAspectsCount > 0 && maleficAspectsCount === 0) {
    aspectBlockEn = ` Benefic rays falling on this sector provide natural protection, ensuring that unexpected obstacles dissolve through timely guidance or fortunate circumstances.`;
    aspectBlockHi = ` इस भाव पर शुभ ग्रहों की अमृतमयी दृष्टि होने से प्राकृतिक सुरक्षा प्राप्त है, जिससे आने वाली अड़चनें समय रहते दूर हो जाती हैं।`;
  } else if (maleficAspectsCount > 0 && beneficAspectsCount === 0) {
    aspectBlockEn = ` Hard aspects cast upon this axis introduce periodic stress tests, compelling you to build disciplined boundaries and rigorous contingency plans.`;
    aspectBlockHi = ` क्रूर ग्रहों की दृष्टि का प्रभाव इस भाव पर चुनौतियां और परीक्षा की घड़ियां लाता है, जिससे आपको अपनी योजनाओं में सतर्कता व अनुशासन रखना होगा।`;
  } else if (beneficAspectsCount > 0 && maleficAspectsCount > 0) {
    aspectBlockEn = ` Receiving a balanced cross-current of benefic and demanding aspects, your experience here will be dynamic—rewarding intelligent discernment while weeding out complacency.`;
    aspectBlockHi = ` शुभ और क्रूर दोनों ग्रहों के संयुक्त दृष्टि प्रभाव से इस क्षेत्र में मिश्रित व गतिशील अनुभव रहेंगे—जहां सूझबूझ से लाभ होगा वहीं असावधानी से नुकसान हो सकता है।`;
  }

  let kartariBlockEn = '';
  let kartariBlockHi = '';
  if (kartariYoga === 'Subhakartari') {
    kartariBlockEn = ` Surrounded by protective benefics on both flanks (Subhakartari Yoga), this house enjoys an invisible armor of grace against sudden calamities.`;
    kartariBlockHi = ` भाव के दोनों ओर शुभ ग्रहों की उपस्थिति (शुभकर्तरी योग) इसे एक नैसर्गिक सुरक्षा कवच प्रदान करती है, जिससे अचानक आने वाले संकट टल जाते हैं।`;
  } else if (kartariYoga === 'Papakartari') {
    kartariBlockEn = ` Hemmed between stern planetary forces (Papakartari Yoga), initial milestones may feel constrained, requiring unbending perseverance to unlock full fruition.`;
    kartariBlockHi = ` भाव के दोनों ओर क्रूर ग्रहों के स्थित होने (पापकर्तरी योग) के कारण आरंभिक प्रयासों में कुछ संकोच या रुकावटें आ सकती हैं, जिनके निवारण हेतु निरंतर पुरुषार्थ अपेक्षित है।`;
  }

  const para2En = `${occBlockEn}${aspectBlockEn}${kartariBlockEn}`;
  const para2Hi = `${occBlockHi}${aspectBlockHi}${kartariBlockHi}`;

  // Paragraph 3: Classical Lifecycle Trajectory & Expected Events
  const savNoteEn = savBindus >= 30
    ? `Supported by a robust Ashtakavarga reservoir of ${savBindus} bindus, you possess abundant stamina and material support to turn opportunities into lasting success.`
    : savBindus <= 24
      ? `With ${savBindus} bindus in this house, conscious resource conservation and disciplined patience are vital to avoid draining energy.`
      : `With a steady ${savBindus} Ashtakavarga bindus, progress remains proportional to your personal initiative.`;

  const savNoteHi = savBindus >= 30
    ? `सर्वाष्टकवर्ग में ${savBindus} बिंदुओं का प्रचुर बल होने से आपके पास इस क्षेत्र में अवसरों को स्थायी सफलता में बदलने हेतु पर्याप्त ऊर्जा व संसाधन उपलब्ध हैं।`
    : savBindus <= 24
      ? `अष्टकवर्ग में ${savBindus} बिंदु होने के कारण संसाधनों का अपव्यय रोकने तथा धैर्यपूर्वक कदम आगे बढ़ाने की आवश्यकता है।`
      : `अष्टकवर्ग में ${savBindus} बिंदुओं के संतुलित प्रभाव से आपकी प्रगति आपके व्यक्तिगत उद्यम और सूझबूझ के सीधे अनुपात में रहेगी।`;

  const para3En = `Real-World Trajectory: ${b144.eventEn} ${savNoteEn} ${theme.timingEn}`;
  const para3Hi = `वास्तविक जीवन फल: ${b144.eventHi} ${savNoteHi} ${theme.timingHi}`;

  const coreNarrativeEn = `${para1En}\n\n${para2En.trim()}\n\n${para3En}`;
  const coreNarrativeHi = `${para1Hi}\n\n${para2Hi.trim()}\n\n${para3Hi}`;

  // 3. Tailored Strengths and Watchouts
  const keyStrengthsEn = [...theme.defaultStrengthsEn];
  const keyStrengthsHi = [...theme.defaultStrengthsHi];
  if (['Exalted', 'Own Sign'].includes(lordDignity)) {
    keyStrengthsEn[0] = `Fortified house ruler confers exceptional stability, prestige, and executive mastery over ${theme.domainEn.toLowerCase()}`;
    keyStrengthsHi[0] = `बली भावेश के प्रभाव से ${theme.domainHi} में असाधारण स्थायित्व, मान-सम्मान और सफलता प्राप्त होती है`;
  }

  const watchOutsEn = [...theme.defaultWatchoutsEn];
  const watchOutsHi = [...theme.defaultWatchoutsHi];
  if (isCombust) {
    watchOutsEn.unshift('Combustion requires avoiding hasty impatience; allow foundational skills to mature before expecting public acclaim');
    watchOutsHi.unshift('भावेश के अस्त होने से जल्दबाजी से बचें; अपनी क्षमताओं को पूर्ण रूप से निखारने के बाद ही बड़े परिणामों की अपेक्षा करें');
  }

  return {
    headlineEn,
    headlineHi,
    coreNarrativeEn,
    coreNarrativeHi,
    keyStrengthsEn,
    keyStrengthsHi,
    watchOutsEn,
    watchOutsHi,
    timingMilestonesEn: theme.timingEn,
    timingMilestonesHi: theme.timingHi,
  };
}
