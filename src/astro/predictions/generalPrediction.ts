import type { ChartData, DivisionalChartId, NineGrahaId, SevenPlanetId } from '../types';
import { SIGNS } from '../constants';
import { getFunctionalLordship } from './functionalLordship';
import { CLASSICAL_YOGAS_KB, detectClassicalYogas } from './classicalYogasKb';

export type GeneralEvidenceKind = 'supportive' | 'caution' | 'context';
export interface GeneralPredictionEvidence {
  kind: GeneralEvidenceKind;
  source: string;
  detailEn: string;
  detailHi: string;
}
export interface GeneralPredictionDomain {
  id: string;
  titleEn: string;
  titleHi: string;
  houses: number[];
  karakas: NineGrahaId[];
  varga: DivisionalChartId;
  predictionEn: string;
  predictionHi: string;
  interpretationBasisEn: string;
  interpretationBasisHi: string;
  primaryAnchorEn: string;
  primaryAnchorHi: string;
  synthesisEn: string;
  synthesisHi: string;
  evidence: GeneralPredictionEvidence[];
  dataCompleteness: 'complete' | 'partial' | 'limited';
}
export interface GeneralPredictionReport {
  titleEn: string;
  titleHi: string;
  methodEn: string;
  methodHi: string;
  summaryEn: string;
  summaryHi: string;
  domains: GeneralPredictionDomain[];
}

interface DomainDefinition {
  id: string;
  titleEn: string;
  titleHi: string;
  houses: number[];
  karakas: NineGrahaId[];
  varga: DivisionalChartId;
}

const DOMAINS: DomainDefinition[] = [
  { id: 'personality', titleEn: 'Personality, Vitality & Temperament', titleHi: 'व्यक्तित्व, जीवनशक्ति एवं स्वभाव', houses: [1, 5, 9], karakas: ['Sun', 'Moon'], varga: 'D9' },
  { id: 'education', titleEn: 'Education, Intellect & Learning', titleHi: 'शिक्षा, बुद्धि एवं अध्ययन', houses: [4, 5, 9], karakas: ['Mercury', 'Jupiter'], varga: 'D24' },
  { id: 'career', titleEn: 'Career, Profession & Work', titleHi: 'करियर, आजीविका एवं कार्यक्षेत्र', houses: [10, 6, 2, 11], karakas: ['Sun', 'Saturn', 'Mercury'], varga: 'D10' },
  { id: 'wealth', titleEn: 'Wealth, Savings & Resources', titleHi: 'धन, बचत एवं संसाधन', houses: [2, 11, 5, 9], karakas: ['Jupiter', 'Venus', 'Mercury'], varga: 'D2' },
  { id: 'marriage', titleEn: 'Marriage, Partnership & Harmony', titleHi: 'विवाह, साझेदारी एवं सामंजस्य', houses: [7, 2, 5, 8], karakas: ['Venus', 'Jupiter'], varga: 'D9' },
  { id: 'children', titleEn: 'Children, Progeny & Creativity', titleHi: 'संतान, वंश एवं सृजनात्मकता', houses: [5, 9, 2], karakas: ['Jupiter'], varga: 'D7' },
  { id: 'property', titleEn: 'Property, Home & Conveyances', titleHi: 'संपत्ति, गृह एवं वाहन', houses: [4, 11, 2], karakas: ['Mars', 'Venus', 'Saturn'], varga: 'D4' },
  { id: 'health', titleEn: 'Vitality, Resilience & Daily Regimen', titleHi: 'जीवनशक्ति, सहनशीलता एवं दिनचर्या', houses: [1, 6, 8, 12], karakas: ['Sun', 'Moon', 'Saturn'], varga: 'D30' },
  { id: 'travels', titleEn: 'Travel, Relocation & Distant Connections', titleHi: 'यात्रा, स्थान परिवर्तन एवं दूरस्थ संबंध', houses: [9, 12, 3, 7], karakas: ['Moon', 'Rahu', 'Venus'], varga: 'D9' },
  { id: 'spirituality', titleEn: 'Dharma, Reflection & Spiritual Practice', titleHi: 'धर्म, आत्मचिंतन एवं साधना', houses: [9, 12, 5, 8], karakas: ['Jupiter', 'Ketu'], varga: 'D20' },
  { id: 'milestones', titleEn: 'Life Direction, Recognition & Gains', titleHi: 'जीवन-दिशा, प्रतिष्ठा एवं लाभ', houses: [1, 9, 10, 11], karakas: ['Sun', 'Jupiter'], varga: 'D1' },
  { id: 'remedies', titleEn: 'Values, Conduct & Traditional Practices', titleHi: 'मूल्य, आचरण एवं पारंपरिक साधना', houses: [1, 5, 9], karakas: ['Jupiter', 'Sun'], varga: 'D9' },
  { id: 'family', titleEn: 'Family, Lineage & Domestic Bonds', titleHi: 'परिवार, वंश एवं पारिवारिक संबंध', houses: [2, 4, 9, 11], karakas: ['Moon', 'Jupiter'], varga: 'D12' },
  { id: 'parents', titleEn: 'Parents, Care & Ancestral Influences', titleHi: 'माता-पिता, देखभाल एवं पैतृक प्रभाव', houses: [4, 9, 10], karakas: ['Sun', 'Moon', 'Jupiter'], varga: 'D12' },
  { id: 'siblings', titleEn: 'Siblings, Courage & Close Relations', titleHi: 'भाई-बहन, साहस एवं निकट संबंध', houses: [3, 11], karakas: ['Mars'], varga: 'D3' },
  { id: 'romance', titleEn: 'Romance, Affection & Emotional Bonding', titleHi: 'प्रेम, अनुराग एवं भावनात्मक जुड़ाव', houses: [5, 7, 11], karakas: ['Venus', 'Moon'], varga: 'D9' },
  { id: 'business', titleEn: 'Business, Trade & Independent Work', titleHi: 'व्यवसाय, व्यापार एवं स्वतंत्र कार्य', houses: [7, 10, 3, 11], karakas: ['Mercury', 'Saturn', 'Mars'], varga: 'D10' },
  { id: 'debt_disputes', titleEn: 'Debt, Competition, Disputes & Recovery', titleHi: 'ऋण, प्रतिस्पर्धा, विवाद एवं समाधान', houses: [6, 8, 12], karakas: ['Mars', 'Saturn'], varga: 'D30' },
  { id: 'income_networks', titleEn: 'Income, Gains, Friends & Networks', titleHi: 'आय, लाभ, मित्र एवं संपर्क-वृत्त', houses: [11, 2, 3], karakas: ['Jupiter', 'Mercury'], varga: 'D11' },
  { id: 'foreign_residence', titleEn: 'Foreign Residence, Isolation & Expenditure', titleHi: 'विदेश-निवास, एकांत एवं व्यय', houses: [12, 9, 4, 7], karakas: ['Moon', 'Rahu', 'Venus'], varga: 'D4' },
];


const DOMAIN_BASIS: Record<string, { en: string; hi: string }> = {
  personality: { en: 'Personality is read primarily from the ascendant and its lord, then checked against the 5th and 9th houses, the Sun and Moon, and Navamsha context.', hi: 'व्यक्तित्व का मुख्य आधार लग्न और लग्नेश हैं; इसके साथ पंचम एवं नवम भाव, सूर्य-चंद्र तथा नवांश के संकेत देखे जाते हैं।' },
  education: { en: 'Education is assessed through the 4th, 5th and 9th houses, Mercury and Jupiter, with the Chaturvimshamsha (D24) as supplementary context.', hi: 'शिक्षा का आकलन चतुर्थ, पंचम एवं नवम भाव, बुध-बृहस्पति तथा सहायक रूप से चतुर्विंशांश (D24) से किया जाता है।' },
  career: { en: 'Career is assessed through the 10th house and its lord, supported by the 6th (service), 2nd (livelihood) and 11th (gains) houses, with Dashamsha (D10) as a key cross-check.', hi: 'करियर का मुख्य आधार दशम भाव और दशमेश हैं; षष्ठ (सेवा), द्वितीय (आजीविका) और एकादश (लाभ) भाव तथा दशमांश (D10) से पुष्टिकरण देखा जाता है।' },
  wealth: { en: 'Wealth is assessed through the 2nd house (accumulation) and 11th (income/gains), with the 5th and 9th as supporting houses and Hora (D2) as supplementary context.', hi: 'धन का आकलन द्वितीय भाव (संचय) और एकादश भाव (आय/लाभ) से होता है; पंचम-नवम सहायक भाव तथा होरा (D2) पूरक संदर्भ देते हैं।' },
  marriage: { en: 'Partnership is assessed through the 7th house and its lord, with the 2nd, 5th and 8th houses, Venus/Jupiter and Navamsha (D9) considered together.', hi: 'विवाह एवं साझेदारी का मुख्य आधार सप्तम भाव और सप्तमेश हैं; द्वितीय, पंचम, अष्टम भाव, शुक्र-बृहस्पति तथा नवांश (D9) साथ देखे जाते हैं।' },
  children: { en: 'Children and creative continuity are traditionally assessed through the 5th house and its lord, the 9th house and Jupiter, with Saptamsha (D7) as supplementary context.', hi: 'संतान एवं सृजनात्मक निरंतरता का पारंपरिक आकलन पंचम भाव-पंचमेश, नवम भाव और बृहस्पति से होता है; सप्तमांश (D7) पूरक संदर्भ है।' },
  property: { en: 'Home and property are assessed through the 4th house and its lord, supported by the 2nd and 11th houses, Mars/Venus and Chaturthamsha (D4).', hi: 'गृह एवं संपत्ति का आकलन चतुर्थ भाव और चतुर्थेश से होता है; द्वितीय-एकादश भाव, मंगल-शुक्र और चतुर्थांश (D4) सहायक संदर्भ हैं।' },
  health: { en: 'This section is limited to traditional symbolism around vitality and resilience using the 1st, 6th, 8th and 12th houses. It does not identify diseases or estimate medical risk.', hi: 'यह अनुभाग केवल जीवनशक्ति एवं सहनशीलता से जुड़े पारंपरिक ज्योतिषीय संकेतों तक सीमित है। इससे रोग की पहचान या चिकित्सकीय जोखिम का अनुमान नहीं लगाया जाता।' },
  travels: { en: 'Travel and relocation are considered through the 3rd, 7th, 9th and 12th houses, their lords and relevant planetary significators; this is not a dated travel forecast.', hi: 'यात्रा एवं स्थान परिवर्तन के संकेत तृतीय, सप्तम, नवम और द्वादश भाव, उनके स्वामियों तथा संबंधित कारक ग्रहों से देखे जाते हैं; यह तिथि-विशिष्ट यात्रा-भविष्यवाणी नहीं है।' },
  spirituality: { en: 'Dharma and spiritual practice are considered through the 5th, 8th, 9th and 12th houses, Jupiter/Ketu and Vimshamsha (D20) context.', hi: 'धर्म एवं साधना के संकेत पंचम, अष्टम, नवम और द्वादश भाव, गुरु-केतु तथा विंशांश (D20) से देखे जाते हैं।' },
  milestones: { en: 'Life direction and recognition are considered through the 1st, 9th, 10th and 11th houses. No fixed milestone ages are inferred in this natal-only section.', hi: 'जीवन-दिशा एवं प्रतिष्ठा के संकेत प्रथम, नवम, दशम और एकादश भाव से देखे जाते हैं। इस जन्मकुंडली-आधारित अनुभाग में निश्चित भाग्योदय आयु निर्धारित नहीं की जाती।' },
  remedies: { en: 'This domain describes the traditional ethical and spiritual context of the 1st, 5th and 9th houses. It does not prescribe gemstones or claim that a remedy guarantees an outcome.', hi: 'यह क्षेत्र प्रथम, पंचम और नवम भाव से जुड़े पारंपरिक नैतिक एवं आध्यात्मिक संदर्भ बताता है। इसमें रत्न-निर्देश या उपाय से निश्चित फल की गारंटी नहीं दी जाती।' },
  family: { en: 'Family and lineage are examined through the 2nd house, supported by the 4th, 9th and 11th, the Moon/Jupiter and D12 context. Family harmony and material resources are considered separately.', hi: 'परिवार एवं वंश का आकलन द्वितीय भाव से, चतुर्थ, नवम और एकादश भाव, चंद्र-गुरु तथा D12 के सहायक संदर्भ से किया जाता है। पारिवारिक सामंजस्य और आर्थिक संसाधनों को अलग-अलग देखा जाता है।' },
  parents: { en: 'Parental themes are examined through the 4th and 9th houses, Sun and Moon, the relevant house lords and D12. Mother- and father-related indications must be read separately rather than collapsed into one verdict.', hi: 'माता-पिता के विषय में चतुर्थ और नवम भाव, सूर्य-चंद्र, संबंधित भावेश तथा D12 देखे जाते हैं। माता और पिता से जुड़े संकेतों का अलग-अलग विश्लेषण आवश्यक है।' },
  siblings: { en: 'Sibling relationships are examined through the 3rd and 11th houses, their lords, Mars and D3. These are symbolic relationship indicators, not a reliable count of siblings or a prediction of harm.', hi: 'भाई-बहनों के संबंध तृतीय और एकादश भाव, उनके स्वामी, मंगल तथा D3 से देखे जाते हैं। ये संबंधों के पारंपरिक संकेत हैं, भाई-बहनों की निश्चित संख्या या हानि की भविष्यवाणी नहीं।' },
  romance: { en: 'Romance and affection are examined through the 5th and 7th houses, Venus/Moon and Navamsha context. Dating, emotional expression and marriage are related but distinct topics.', hi: 'प्रेम और अनुराग का आकलन पंचम-सप्तम भाव, शुक्र-चंद्र तथा नवांश से होता है। प्रेम-संबंध, भावनात्मक अभिव्यक्ति और विवाह आपस में जुड़े, पर अलग विषय हैं।' },
  business: { en: 'Business is assessed through the 7th house (trade and agreements), 10th (work), 3rd (initiative) and 11th (gains), with Mercury, Saturn, Mars and D10. It is kept distinct from salaried employment.', hi: 'व्यवसाय का आकलन सप्तम (व्यापार/समझौते), दशम (कार्य), तृतीय (पहल), एकादश (लाभ), बुध-शनि-मंगल तथा D10 से होता है। इसे नौकरी से अलग रखा जाता है।' },
  debt_disputes: { en: 'Debt, competition and disputes are considered through the 6th, 8th and 12th houses, their lords, Mars/Saturn and D30 context. No legal outcome, debt amount or inevitable defeat is inferred.', hi: 'ऋण, प्रतिस्पर्धा और विवाद षष्ठ, अष्टम, द्वादश भाव, उनके स्वामी, मंगल-शनि तथा D30 से देखे जाते हैं। इससे मुकदमे का परिणाम, ऋण की राशि या निश्चित हार घोषित नहीं की जाती।' },
  income_networks: { en: 'Income and gains are examined through the 11th house and its lord, supported by the 2nd and 3rd, Jupiter/Mercury and D11. Friends, professional networks and financial gains are not treated as identical outcomes.', hi: 'आय और लाभ का मुख्य आधार एकादश भाव और उसका स्वामी है; द्वितीय-तृतीय भाव, गुरु-बुध और D11 सहायक हैं। मित्र, पेशेवर संपर्क और आर्थिक लाभ को एक ही परिणाम नहीं माना जाता।' },
  foreign_residence: { en: 'Foreign residence and distance are examined through the 12th, 9th, 4th and 7th houses, their lords, Moon/Rahu and D4 context. Travel, temporary stay and permanent relocation must be distinguished.', hi: 'विदेश और दूरस्थ निवास के संकेत द्वादश, नवम, चतुर्थ, सप्तम भाव, उनके स्वामी, चंद्र-राहु और D4 से देखे जाते हैं। यात्रा, अस्थायी प्रवास और स्थायी स्थानांतरण अलग-अलग हैं।' },
};


const YOGA_DOMAIN_TARGETS: Record<string, string[]> = {
  Mahapurusha: ['personality', 'career', 'milestones'],
  Chandra: ['personality', 'wealth', 'milestones'],
  Surya: ['personality', 'career'],
  Raja: ['career', 'milestones'],
  Dhana: ['wealth'],
  Viparita: ['career', 'wealth'],
  Nabhasa: ['personality', 'career', 'spirituality'],
};

export function isClassicalYogaSourceUsable(source: string): boolean {
  return !/not verified|unverified|verify the individual|traditional yoga compilation|classical jyotisha references|classical vedic shastra|300 classical yogas/i.test(source);
}

function yogaAppliesToDomain(category: string, domain: DomainDefinition): boolean {
  return YOGA_DOMAIN_TARGETS[category]?.includes(domain.id) ?? false;
}

const SEVEN_PLANETS = new Set<SevenPlanetId>(['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn']);
const CLASSICAL_GRAHAS = new Set<string>(['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu']);
const SUPPORTIVE_DIGNITIES = new Set(['Exalted', 'Moolatrikona', 'Own Sign', 'Great Friend', 'Friend']);
const CAUTION_DIGNITIES = new Set(['Debilitated', 'Great Enemy', 'Enemy']);
const HI_NAMES: Record<string, string> = {
  Sun: 'सूर्य', Moon: 'चंद्र', Mars: 'मंगल', Mercury: 'बुध',
  Jupiter: 'बृहस्पति', Venus: 'शुक्र', Saturn: 'शनि', Rahu: 'राहु', Ketu: 'केतु',
};

function signForHouse(chart: ChartData, house: number): number {
  return (chart.ascendant.signIndex + house - 1) % 12;
}

function aspectsHouse(chart: ChartData, targetHouse: number): string[] {
  const result: string[] = [];
  for (const planet of chart.planets) {
    if (!CLASSICAL_GRAHAS.has(planet.id)) continue;
    const from = planet.rasiHouseNumber;
    const offsets = planet.id === 'Mars' ? [3, 6, 7]
      : planet.id === 'Jupiter' ? [4, 6, 8]
      : planet.id === 'Saturn' ? [2, 6, 9]
      : [6];
    if (offsets.some((offset) => ((from - 1 + offset) % 12) + 1 === targetHouse) && from !== targetHouse) {
      result.push(planet.id);
    }
  }
  return [...new Set(result)];
}

function dignityKind(dignity: string): GeneralEvidenceKind {
  if (SUPPORTIVE_DIGNITIES.has(dignity)) return 'supportive';
  if (CAUTION_DIGNITIES.has(dignity)) return 'caution';
  return 'context';
}


const HOUSE_THEMES: Record<number, { en: string; hi: string }> = {
  1: { en: 'self-direction, confidence and personal initiative', hi: 'स्व-निर्णय, आत्मविश्वास और अपनी पहल' },
  2: { en: 'family resources, savings, speech and accumulated wealth', hi: 'परिवार, बचत, वाणी और संचित धन' },
  3: { en: 'effort, communication, skills and independent enterprise', hi: 'प्रयास, संवाद, कौशल और स्व-प्रेरित कार्य' },
  4: { en: 'home, education, emotional foundations and property', hi: 'घर, शिक्षा, भावनात्मक आधार और संपत्ति' },
  5: { en: 'learning, creativity, judgement and the next generation', hi: 'अध्ययन, सृजन, निर्णय-क्षमता और अगली पीढ़ी' },
  6: { en: 'service, daily responsibilities, competition and problem-solving', hi: 'सेवा, दैनिक जिम्मेदारियाँ, प्रतिस्पर्धा और समस्याओं का समाधान' },
  7: { en: 'partnerships, clients, agreements and public interaction', hi: 'साझेदारी, ग्राहक, समझौते और जन-संपर्क' },
  8: { en: 'research, deep change, shared resources and hidden matters', hi: 'अनुसंधान, गहरे परिवर्तन, साझा संसाधन और गोपनीय विषय' },
  9: { en: 'higher learning, mentors, long journeys and guiding principles', hi: 'उच्च शिक्षा, मार्गदर्शक, लंबी यात्राएँ और जीवन-मूल्य' },
  10: { en: 'career, responsibility, public contribution and recognition', hi: 'करियर, उत्तरदायित्व, सार्वजनिक योगदान और प्रतिष्ठा' },
  11: { en: 'income, networks, ambitions and the fulfilment of goals', hi: 'आय, संपर्क-वृत्त, महत्वाकांक्षाएँ और लक्ष्य-पूर्ति' },
  12: { en: 'distant places, retreat, expenditure and work behind the scenes', hi: 'दूरस्थ स्थान, एकांत, व्यय और पर्दे के पीछे का काम' },
};

interface ReaderOpening {
  en: string;
  hi: string;
}

const READER_OPENINGS: Record<string, ReaderOpening> = {
  personality: { en: 'Your confidence grows when you trust your judgment while staying connected to what gives you security.', hi: 'अपनी समझ पर भरोसा और जीवन में स्थिर आधार—दोनों आपके आत्मविश्वास को मजबूत करते हैं।' },
  education: { en: 'You learn best when curiosity has structure and ideas are put into practice.', hi: 'जिज्ञासा को नियमित अध्ययन और व्यावहारिक प्रयोग से जोड़ना आपकी सीख को गहरा करता है।' },
  career: { en: 'Your work direction is shaped by responsibility, skill, and the contribution others can see.', hi: 'आपके काम की दिशा जिम्मेदारी, कौशल और आपके योगदान की पहचान से बनती है।' },
  wealth: { en: 'Financial steadiness depends on how you turn earnings into resources you can retain and use wisely.', hi: 'आर्थिक स्थिरता इस बात से बनती है कि आप आय को कितनी समझदारी से सँभालते और उपयोग करते हैं।' },
  marriage: { en: 'A lasting partnership depends on warmth, honest expectations, and dependable agreements.', hi: 'टिकाऊ साझेदारी में अपनापन, स्पष्ट अपेक्षाएँ और भरोसेमंद संवाद साथ चलते हैं।' },
  children: { en: 'Creativity, care, and the next generation are connected themes, but each deserves its own reading.', hi: 'सृजन, देखभाल और अगली पीढ़ी जुड़े हुए विषय हैं, फिर भी हर एक का अलग आकलन जरूरी है।' },
  property: { en: 'A secure home base is more likely to come from patient planning than from a rushed decision.', hi: 'घर और संपत्ति के मामलों में जल्दबाजी से अधिक धैर्यपूर्ण योजना आपके काम आती है।' },
  health: { en: 'This reading concerns traditional vitality and daily routine only; it cannot diagnose illness or estimate medical risk.', hi: 'यह संकेत केवल पारंपरिक जीवनशक्ति और दिनचर्या से जुड़े हैं; इनसे रोग या चिकित्सकीय जोखिम का निदान नहीं होता।' },
  travels: { en: 'Travel or relocation is most meaningful when it serves a clear purpose such as learning, work, or renewal.', hi: 'यात्रा या स्थान-परिवर्तन तब अधिक सार्थक होता है जब उसका उद्देश्य सीखना, काम या नया अनुभव हो।' },
  spirituality: { en: 'Inner growth deepens when belief is balanced with reflection, practice, and lived experience.', hi: 'आंतरिक विकास तब गहराता है जब विश्वास के साथ चिंतन, नियमित साधना और जीवन-अनुभव भी हों।' },
  milestones: { en: 'Recognition is more likely to grow through steady contribution than through one dramatic turning point.', hi: 'पहचान और प्रगति अक्सर किसी एक बड़े मोड़ से नहीं, बल्कि लगातार सार्थक योगदान से बनती है।' },
  remedies: { en: 'The most constructive traditional remedy is consistent conduct and practice; no ritual or object guarantees an outcome.', hi: 'सबसे उपयोगी पारंपरिक उपाय नियमित सदाचार और साधना है; कोई वस्तु या अनुष्ठान निश्चित फल की गारंटी नहीं देता।' },
  family: { en: 'Family life is shaped by care, shared values, responsibilities, and the way resources are handled.', hi: 'पारिवारिक जीवन में अपनापन, साझा मूल्य, जिम्मेदारियाँ और संसाधनों का व्यवहार—सबकी भूमिका रहती है।' },
  parents: { en: 'Parental bonds are best understood through guidance, care, responsibility, and the boundaries you develop.', hi: 'माता-पिता से संबंध में मार्गदर्शन, देखभाल, जिम्मेदारी और स्वस्थ सीमाएँ—सभी महत्वपूर्ण हैं।' },
  siblings: { en: 'Close family bonds grow through communication and shared effort while leaving room for individual differences.', hi: 'निकट संबंध संवाद और साझा प्रयास से मजबूत होते हैं, साथ ही एक-दूसरे के मतभेदों का सम्मान भी जरूरी है।' },
  romance: { en: 'Affection develops through emotional honesty, mutual trust, and expectations that are discussed openly.', hi: 'प्रेम और अनुराग भावनात्मक स्पष्टता, पारस्परिक भरोसे और खुलकर रखी गई अपेक्षाओं से विकसित होते हैं।' },
  business: { en: 'Independent work benefits from initiative paired with reliable agreements and patient follow-through.', hi: 'स्वतंत्र कार्य में पहल के साथ स्पष्ट समझौते और लगातार काम पूरा करना लाभदायक रहता है।' },
  debt_disputes: { en: 'Competition and obligations are easier to handle with preparation, clear boundaries, and measured responses.', hi: 'प्रतिस्पर्धा और दायित्वों को तैयारी, स्पष्ट सीमाओं और संतुलित प्रतिक्रिया से बेहतर सँभाला जा सकता है।' },
  income_networks: { en: 'Useful connections and gains grow when ambition is matched by collaboration and consistent follow-through.', hi: 'लक्ष्य, सहयोग और निरंतर प्रयास साथ हों तो संपर्कों से उपयोगी अवसर और लाभ बनने की संभावना बढ़ती है।' },
  foreign_residence: { en: 'Distant places may matter through work, learning, or retreat; a trip and permanent relocation are different outcomes.', hi: 'दूरस्थ स्थान काम, शिक्षा या एकांत से जुड़ सकते हैं; यात्रा और स्थायी स्थानांतरण अलग बातें हैं।' },
};

const PLANET_THEMES: Record<string, ReaderOpening> = {
  Sun: { en: 'purpose, leadership, and visibility', hi: 'उद्देश्य, नेतृत्व और पहचान' },
  Moon: { en: 'emotional awareness, care, and responsiveness', hi: 'भावनात्मक समझ, देखभाल और संवेदनशीलता' },
  Mars: { en: 'initiative, courage, and decisive effort', hi: 'पहल, साहस और निर्णायक प्रयास' },
  Mercury: { en: 'learning, communication, and flexible thinking', hi: 'सीखने, संवाद और परिस्थिति के अनुसार सोचने की क्षमता' },
  Jupiter: { en: 'judgment, guidance, and gradual growth', hi: 'विवेक, मार्गदर्शन और क्रमिक विकास' },
  Venus: { en: 'harmony, relationships, and shared values', hi: 'सामंजस्य, संबंध और साझा मूल्य' },
  Saturn: { en: 'patience, responsibility, and long-term effort', hi: 'धैर्य, जिम्मेदारी और दीर्घकालीन प्रयास' },
  Rahu: { en: 'ambition, unconventional breakthroughs, and intense focus', hi: 'महत्वाकांक्षा, नवीन प्रयोग और तीव्र एकाग्रता' },
  Ketu: { en: 'detachment, intuitive insight, and spiritual depth', hi: 'वैराग्य, अंतर्ज्ञान और आध्यात्मिक गहराई' },
};

function buildReaderPrediction(
  chart: ChartData,
  domain: DomainDefinition,
  occupantIds: string[],
  savBindus: number | undefined,
  yogaNames: string[],
): { en: string; hi: string } {
  const opening = READER_OPENINGS[domain.id];
  const primaryHouse = domain.houses[0];
  const primarySign = SIGNS[signForHouse(chart, primaryHouse)];
  const primaryLord = chart.planets.find((planet) => planet.id === primarySign.lord);
  if (!primaryLord) {
    return {
      en: `${opening.en} The chart data needed to personalize this area is incomplete, so no stronger conclusion is offered.`,
      hi: `${opening.hi} इस क्षेत्र को व्यक्तिगत रूप से समझने के लिए आवश्यक कुंडली-डेटा अधूरा है, इसलिए इससे आगे निष्कर्ष नहीं दिया जा रहा है।`,
    };
  }

  const destination = HOUSE_THEMES[primaryLord.rasiHouseNumber];
  const kind = dignityKind(primaryLord.dignity);
  const planetEn = primaryLord.id;
  const planetHi = HI_NAMES[primaryLord.id] ?? primaryLord.id;

  // Check Gandanta / Debilitated AK / Rashi Sandhi override for honest natal readings
  const isGandantaLon = (signIdx: number, deg: number) =>
    ([3, 7, 11].includes(signIdx) && deg >= 26.6667) || ([0, 4, 8].includes(signIdx) && deg <= 3.3333);
  const akBody = chart.planets.find((p) => p.charaKaraka === 'AK');
  const isAkCompromised = Boolean(akBody && akBody.dignity === 'Debilitated' && isGandantaLon(akBody.signIndex, akBody.degreeInSign));
  const isLagnaSandhi = chart.ascendant.degreeInSign < 1.0 || chart.ascendant.degreeInSign > 29.0;

  let conditionEn: string;
  let conditionHi: string;
  if (isAkCompromised || (akBody?.dignity === 'Debilitated' && isLagnaSandhi)) {
    conditionEn = `Although surface combinations appear around ${destination.en}, a debilitated Atmakaraka (${akBody?.id}) in Gandanta/Sandhi tempers effortless results—sustained discipline matters most.`;
    conditionHi = `यद्यपि ${destination.hi} के आसपास सतही योग दिखते हैं, परंतु नीचस्थ/गंडांत आत्मकारक (${HI_NAMES[akBody?.id ?? ''] ?? akBody?.id}) के कारण सहज फल सीमित रहते हैं और निरंतर परिश्रम आवश्यक होता है।`;
  } else if (kind === 'supportive') {
    conditionEn = `This gives the theme a supportive starting point; steady effort around ${destination.en} can help it develop constructively.`;
    conditionHi = `यह इस विषय को सहायक आधार देता है; ${destination.hi} से जुड़े निरंतर प्रयास इसे बेहतर दिशा दे सकते हैं।`;
  } else if (kind === 'caution') {
    conditionEn = `This makes the path more demanding, so patience and deliberate choices around ${destination.en} matter more than quick results.`;
    conditionHi = `यह रास्ता कुछ चुनौतीपूर्ण बनाता है; इसलिए ${destination.hi} से जुड़े मामलों में धैर्य और सोच-समझकर लिए गए निर्णय अधिक उपयोगी रहेंगे।`;
  } else {
    conditionEn = `The signal is mixed rather than one-sided; choices around ${destination.en} are likely to shape how this area develops.`;
    conditionHi = `संकेत एकतरफा नहीं हैं; ${destination.hi} से जुड़े निर्णय इस क्षेत्र की दिशा तय करने में अहम रहेंगे।`;
  }

  const extraEn: string[] = [];
  const extraHi: string[] = [];
  if (occupantIds.length > 0) {
    const occEn = occupantIds.join(', ');
    const occHi = occupantIds.map((id) => HI_NAMES[id] ?? id).join(', ');
    extraEn.push(`The direct presence of ${occEn} actively shapes this area of life.`);
    extraHi.push(`इस क्षेत्र में ${occHi} की प्रत्यक्ष उपस्थिति इसे सक्रिय बनाती है।`);
  }
  if (savBindus !== undefined) {
    if (savBindus >= 30) {
      extraEn.push(`Underlying chart support is strong (${savBindus} points), reinforcing resilience.`);
      extraHi.push(`कुंडली का समग्र बल उच्च (${savBindus} बिंदु) है, जो स्थिरता प्रदान करता है।`);
    } else if (savBindus <= 24) {
      extraEn.push(`Underlying chart support is modest (${savBindus} points), favoring measured pacing.`);
      extraHi.push(`कुंडली का समग्र बल मध्यम-न्यून (${savBindus} बिंदु) है, अतः संतुलित गति लाभकारी रहेगी।`);
    }
  }
  if (yogaNames.length > 0) {
    extraEn.push(`Key classical combination: ${yogaNames.slice(0, 2).join(', ')}.`);
    extraHi.push(`प्रमुख शास्त्रीय योग: ${yogaNames.slice(0, 2).join(', ')}।`);
  }

  const themeEn = PLANET_THEMES[primaryLord.id]?.en ?? 'focused planetary karma';
  const themeHi = PLANET_THEMES[primaryLord.id]?.hi ?? 'विशेष ग्रह-कर्म';

  return {
    en: `House ${primaryHouse} lord ${planetEn} (${primaryLord.dignity} in House ${primaryLord.rasiHouseNumber}) brings ${themeEn} into ${destination.en}. ${conditionEn}${extraEn.length ? ' ' + extraEn.join(' ') : ''}`,
    hi: `भाव ${primaryHouse} के स्वामी ${planetHi} (${primaryLord.dignity}, भाव ${primaryLord.rasiHouseNumber}) इस क्षेत्र में ${themeHi} को प्रमुख बनाकर इसे ${destination.hi} से जोड़ते हैं। ${conditionHi}${extraHi.length ? ' ' + extraHi.join(' ') : ''}`,
  };
}

function analyzeDomain(chart: ChartData, domain: DomainDefinition, detectedYogas: ReturnType<typeof detectClassicalYogas>): GeneralPredictionDomain {
  const evidence: GeneralPredictionEvidence[] = [];
  const relatedPlanets = new Set<string>();
  let availableCoreFactors = 0;
  const expectedCoreFactors = domain.houses.length + domain.karakas.length;

  for (const house of domain.houses) {
    const signIndex = signForHouse(chart, house);
    const sign = SIGNS[signIndex];
    const lord = chart.planets.find((planet) => planet.id === sign.lord);
    if (lord) {
      availableCoreFactors++;
      relatedPlanets.add(lord.id);
      evidence.push({
        kind: dignityKind(lord.dignity),
        source: `House ${house} lord: ${lord.id}`,
        detailEn: `House ${house} is in ${sign.name}; its lord ${lord.id} is in house ${lord.rasiHouseNumber} (${lord.signName}) with ${lord.dignity} dignity.`,
        detailHi: `भाव ${house} की राशि ${sign.name} है। इसके स्वामी ${HI_NAMES[lord.id] ?? lord.id} भाव ${lord.rasiHouseNumber} में ${lord.signName} राशि में ${lord.dignity} गरिमा के साथ स्थित हैं।`,
      });
      if (SEVEN_PLANETS.has(lord.id as SevenPlanetId)) {
        const roles = getFunctionalLordship(lord.id as SevenPlanetId, chart.ascendant.signIndex);
        evidence.push({
          kind: 'context',
          source: `Functional lordship: ${lord.id}`,
          detailEn: `${lord.id} owns houses ${roles.ownedHouses.join(', ') || 'not available'}; roles: ${roles.rolesEn.join('; ') || 'not assigned'}.`,
          detailHi: `${HI_NAMES[lord.id] ?? lord.id} भाव ${roles.ownedHouses.join(', ') || 'उपलब्ध नहीं'} के स्वामी हैं; कार्यात्मक भूमिका: ${roles.rolesHi.join('؛ ') || 'निर्धारित नहीं'}।`,
        });
        const ownershipFlags = [
          roles.yogakarakaProfile ? 'Kendra + trikona ownership (traditional yogakaraka profile)' : '',
          roles.kendradhipatiCaution ? 'Kendradhipati caution' : '',
          roles.ownsDusthana ? 'Dusthana ownership' : '',
          roles.ownsMarakaHouse ? 'Maraka-house ownership (2nd/7th)' : '',
        ].filter(Boolean);
        if (ownershipFlags.length) {
          evidence.push({
            kind: 'context',
            source: `Classical functional-lordship flags: ${lord.id}`,
            detailEn: `${lord.id}: ${ownershipFlags.join('; ')}. These are traditional ownership classifications only; weigh them with placement, dignity, aspects, strength and the complete chart.`,
            detailHi: `${HI_NAMES[lord.id] ?? lord.id}: ${ownershipFlags.join('؛ ')}। ये केवल पारंपरिक भाव-स्वामित्व वर्गीकरण हैं; इन्हें स्थिति, गरिमा, दृष्टि, बल और पूरी कुंडली के साथ समझें।`,
          });
        }
      }
      const strength = chart.shadbala.find((row) => row.planet === lord.id);
      if (strength) {
        evidence.push({
          kind: strength.isStrong ? 'supportive' : 'context',
          source: `Shadbala: ${lord.id}`,
          detailEn: `Shadbala is ${strength.totalRupas.toFixed(2)} rupas against ${strength.requiredRupas.toFixed(2)} required (${strength.ratio.toFixed(2)}×); ${strength.isStrong ? 'meets the engine threshold' : 'does not meet the engine threshold'}.`,
          detailHi: `${HI_NAMES[lord.id] ?? lord.id} का षड्बल ${strength.totalRupas.toFixed(2)} रूप है; निर्धारित आवश्यकता ${strength.requiredRupas.toFixed(2)} रूप है (अनुपात ${strength.ratio.toFixed(2)}×)। ${strength.isStrong ? 'गणना-इंजन के बल-मानदंड को पूरा करता है' : 'गणना-इंजन के बल-मानदंड को पूरा नहीं करता'}।`,
        });
      }
    } else {
      evidence.push({
        kind: 'context',
        source: `House ${house} lord unavailable`,
        detailEn: `The chart does not contain the calculated position of the lord of house ${house}.`,
        detailHi: `कुंडली में भाव ${house} के स्वामी की गणित स्थिति उपलब्ध नहीं है।`,
      });
    }

    const occupants = chart.planets.filter((planet) => planet.rasiHouseNumber === house && CLASSICAL_GRAHAS.has(planet.id));
    for (const planet of occupants) {
      relatedPlanets.add(planet.id);
      evidence.push({
        kind: dignityKind(planet.dignity),
        source: `House ${house} occupant: ${planet.id}`,
        detailEn: `${planet.id} occupies house ${house} in ${planet.signName} with ${planet.dignity} dignity${planet.isRetrograde ? ' and is retrograde' : ''}${planet.isCombust ? ' and is combust' : ''}.`,
        detailHi: `${HI_NAMES[planet.id] ?? planet.id} भाव ${house} में ${planet.signName} राशि में ${planet.dignity} गरिमा के साथ स्थित हैं${planet.isRetrograde ? ' तथा वक्री हैं' : ''}${planet.isCombust ? ' तथा अस्त हैं' : ''}।`,
      });
    }

    const aspects = aspectsHouse(chart, house);
    if (aspects.length) {
      for (const id of aspects) relatedPlanets.add(id);
      evidence.push({
        kind: 'context',
        source: `Graha drishti on house ${house}`,
        detailEn: `The house receives the implemented classical graha aspects of: ${aspects.join(', ')}. Interpret these with each planet's ownership, dignity and strength; this engine does not label an aspect independently auspicious or inauspicious.`,
        detailHi: `इस भाव पर ${aspects.map((id) => HI_NAMES[id] ?? id).join(', ')} की गणना-आधारित ग्रह-दृष्टि है। इसका फल ग्रहों के स्वामित्व, गरिमा और बल के साथ समझें; केवल दृष्टि के आधार पर शुभ-अशुभ निर्णय नहीं दिया गया है।`,
      });
    }

    const sav = chart.ashtakavarga?.sarva?.[signIndex];
    if (typeof sav === 'number') {
      evidence.push({
        kind: 'context',
        source: `Sarvashtakavarga: house ${house}`,
        detailEn: `The sign occupying house ${house} has ${sav} Sarvashtakavarga bindus. This is reported as a value, not converted into a stand-alone event prediction.`,
        detailHi: `भाव ${house} की राशि में सर्वाष्टकवर्ग के ${sav} बिंदु हैं। इसे गणितीय मान के रूप में दिखाया गया है, स्वतंत्र घटना-भविष्यवाणी के रूप में नहीं।`,
      });
    }
  }


  for (const yoga of detectedYogas) {
    if (!yogaAppliesToDomain(yoga.category, domain)) continue;
    const definition = CLASSICAL_YOGAS_KB.find((item) => item.id === yoga.id);
    if (!definition || !isClassicalYogaSourceUsable(definition.source)) continue;
    evidence.push({
      kind: 'context',
      source: `Classical yoga rule: ${yoga.name} — ${definition.source}`,
      detailEn: `The implemented rule detector identifies ${yoga.name} (${yoga.strength}) involving ${yoga.planets.join(', ') || 'unspecified planets'} in houses ${yoga.houses.join(', ') || 'not specified'}. Rule condition: ${definition.conditionEn}. This is a rule-match record only. Yoga-bhanga and full strength validation are not established by this match alone, and no guaranteed result is inferred.`,
      detailHi: `गणना-इंजन के नियम-परीक्षक ने ${yoga.nameHi} (${yoga.strength}) का संकेत पाया है। संबंधित ग्रह: ${yoga.planets.join(', ') || 'निर्दिष्ट नहीं'}; भाव: ${yoga.houses.join(', ') || 'निर्दिष्ट नहीं'}। शास्त्रीय शर्त: ${definition.conditionHi}। यह केवल नियम-मिलान का अभिलेख है, निश्चित फल नहीं। केवल इस मिलान से योगभंग अथवा पूर्ण फल-बल की पुष्टि नहीं होती और किसी निश्चित परिणाम का निष्कर्ष नहीं निकाला जाता।`,
    });
  }

  for (const id of domain.karakas) {
    const planet = chart.planets.find((candidate) => candidate.id === id);
    if (!planet) continue;
    availableCoreFactors++;
    relatedPlanets.add(id);
    evidence.push({
      kind: dignityKind(planet.dignity),
      source: `Natural karaka: ${id}`,
      detailEn: `${id}, considered here as a natural significator, is in house ${planet.rasiHouseNumber} (${planet.signName}) with ${planet.dignity} dignity.`,
      detailHi: `नैसर्गिक कारक ${HI_NAMES[id] ?? id} भाव ${planet.rasiHouseNumber} में ${planet.signName} राशि में ${planet.dignity} गरिमा के साथ स्थित हैं।`,
    });
  }

  // Planet condition layer: degrees, chosen bhava vs whole-sign rasi, yuti and
  // calculated graha-to-graha drishti are recorded before any domain synthesis.
  // Same-sign association is reported with its actual angular separation; no
  // universal conjunction orb is silently imposed.
  const relevantPlanets = chart.planets.filter((planet) => relatedPlanets.has(planet.id));
  for (const planet of relevantPlanets) {
    const strength = chart.shadbala?.find((row) => row.planet === planet.id);
    evidence.push({
      kind: 'context',
      source: `Graha degree and placement: ${planet.id}`,
      detailEn: `${planet.id} is at ${planet.dms} in ${planet.signName}; degree in sign ${planet.degreeInSign.toFixed(4)}°. Whole-sign rasi house: ${planet.rasiHouseNumber}; selected bhava house: ${planet.houseNumber}. Dignity: ${planet.dignity}; retrograde: ${planet.isRetrograde ? 'yes' : 'no'}; combust: ${planet.isCombust ? 'yes' : 'no'}.`,
      detailHi: `${HI_NAMES[planet.id] ?? planet.id} ${planet.signName} राशि में ${planet.dms} पर हैं; राशि में अंश ${planet.degreeInSign.toFixed(4)}°। पूर्ण राशि पद्धति से भाव: ${planet.rasiHouseNumber}; चुनी हुई भाव-चालित पद्धति से भाव: ${planet.houseNumber}। गरिमा: ${planet.dignity}; वक्री: ${planet.isRetrograde ? 'हाँ' : 'नहीं'}; अस्त: ${planet.isCombust ? 'हाँ' : 'नहीं'}।`,
    });
    if (strength) {
      evidence.push({
        kind: strength.isStrong ? 'supportive' : 'context',
        source: `Shadbala detail: ${planet.id}`,
        detailEn: `Total ${strength.totalRupas.toFixed(2)} rupas (required ${strength.requiredRupas.toFixed(2)}); ratio ${strength.ratio.toFixed(2)}×; Ishta phala ${strength.ishtaPhala.toFixed(2)}, Kashta phala ${strength.kashtaPhala.toFixed(2)}. Strength is one factor, not a stand-alone verdict.`,
        detailHi: `कुल षड्बल ${strength.totalRupas.toFixed(2)} रूप (आवश्यक ${strength.requiredRupas.toFixed(2)}); अनुपात ${strength.ratio.toFixed(2)}×; इष्टफल ${strength.ishtaPhala.toFixed(2)}, कष्टफल ${strength.kashtaPhala.toFixed(2)}। ग्रहबल एक कारक है, अपने-आप में अंतिम निर्णय नहीं।`,
      });
    }
  }

  for (let i = 0; i < relevantPlanets.length; i++) {
    for (let j = i + 1; j < relevantPlanets.length; j++) {
      const a = relevantPlanets[i];
      const b = relevantPlanets[j];
      if (a.signIndex !== b.signIndex) continue;
      const rawSeparation = Math.abs(a.longitude - b.longitude);
      const separation = Math.min(rawSeparation, 360 - rawSeparation);
      evidence.push({
        kind: 'context',
        source: `Same-sign yuti review: ${a.id} + ${b.id}`,
        detailEn: `${a.id} and ${b.id} occupy ${a.signName} in the same sign, separated by ${separation.toFixed(3)}°. This is shown for conjunction assessment; interpretation must consider the actual degrees, graha nature, dignity and domain. No fixed orb threshold is assumed here.`,
        detailHi: `${HI_NAMES[a.id] ?? a.id} और ${HI_NAMES[b.id] ?? b.id} दोनों ${a.signName} राशि में हैं; इनके बीच कोणीय अंतर ${separation.toFixed(3)}° है। इसे युति के परीक्षण हेतु दिखाया गया है; फलादेश में वास्तविक अंश, ग्रह-स्वभाव, गरिमा और संबंधित जीवन-विषय साथ देखे जाएँगे। यहाँ कोई मनमाना सार्वभौमिक ऑर्ब नहीं माना गया है।`,
      });
    }
  }

  const relevantIds = new Set(relevantPlanets.map((planet) => planet.id));
  const aspectRecords = (chart.aspects ?? []).filter((aspect) =>
    relevantIds.has(aspect.from) || (aspect.to !== 'Asc' && relevantIds.has(aspect.to)),
  );
  for (const aspect of aspectRecords) {
    evidence.push({
      kind: 'context',
      source: `Calculated graha drishti: ${aspect.from} → ${aspect.to}`,
      detailEn: `${aspect.type}; orb ${aspect.orbDeg.toFixed(3)}°; calculated aspect strength ${aspect.strengthPercent.toFixed(1)}%. The aspect is interpreted through both planets' domain relevance, ownership, dignity and strength, not by aspect label alone.`,
      detailHi: `${aspect.from} से ${aspect.to} पर ${aspect.type}; ऑर्ब ${aspect.orbDeg.toFixed(3)}°; गणितीय दृष्टि-बल ${aspect.strengthPercent.toFixed(1)}%। इसका फल केवल दृष्टि के नाम से नहीं, दोनों ग्रहों की विषयगत भूमिका, भाव-स्वामित्व, गरिमा और बल से समझा जाएगा।`,
    });
  }

  const varga = chart.divisionalCharts?.[domain.varga];
  if (varga) {
    const vargaAscSign = SIGNS[varga.lagnaSignIndex];
    const vargaAscLord = vargaAscSign
      ? varga.placements.find((item) => item.id === vargaAscSign.lord)
      : undefined;
    evidence.push({
      kind: 'context',
      source: `${domain.varga} ascendant cross-check`,
      detailEn: `${domain.varga} ascendant falls in ${vargaAscSign?.name ?? 'an unavailable sign'}; its lord is ${vargaAscSign?.lord ?? 'unavailable'}${vargaAscLord ? `, placed in Varga house ${vargaAscLord.houseFromVargaLagna} with ${vargaAscLord.dignity} dignity` : ', whose divisional placement is unavailable'}. This is a divisional-chart cross-check, not a replacement for the natal chart.`,
      detailHi: `${domain.varga} का वर्ग लग्न ${vargaAscSign?.name ?? 'अज्ञात राशि'} में है; इसका स्वामी ${vargaAscSign?.lord ?? 'उपलब्ध नहीं'} ${vargaAscLord ? `वर्ग में भाव ${vargaAscLord.houseFromVargaLagna} में ${vargaAscLord.dignity} गरिमा के साथ स्थित है` : 'की वर्ग-स्थिति उपलब्ध नहीं है'}। यह वर्ग-कुंडली से पुष्टिकरण है, जन्मकुंडली का विकल्प नहीं।`,
    });
    for (const id of relatedPlanets) {
      const placement = varga.placements.find((item) => item.id === id);
      if (!placement) continue;
      evidence.push({
        kind: dignityKind(placement.dignity),
        source: `${domain.varga} placement: ${id}`,
        detailEn: `${id} is in Varga house ${placement.houseFromVargaLagna} with ${placement.dignity} dignity in ${domain.varga}.`,
        detailHi: `${domain.varga} में ${HI_NAMES[id] ?? id} वर्ग लग्न से भाव ${placement.houseFromVargaLagna} में ${placement.dignity} गरिमा के साथ स्थित हैं।`,
      });
    }
  } else {
    evidence.push({
      kind: 'context',
      source: `${domain.varga} unavailable`,
      detailEn: `The relevant divisional chart ${domain.varga} is unavailable; this part of the synthesis is incomplete.`,
      detailHi: `संबंधित वर्ग-कुंडली ${domain.varga} उपलब्ध नहीं है; इसलिए इस भाग का विश्लेषण अपूर्ण है।`,
    });
  }

  const primaryHouse = domain.houses[0];
  const primarySign = SIGNS[signForHouse(chart, primaryHouse)];
  const primaryLord = chart.planets.find((planet) => planet.id === primarySign.lord);
  const primaryOccupants = chart.planets
    .filter((planet) => planet.rasiHouseNumber === primaryHouse)
    .map((planet) => planet.id);
  const primarySavBindus = chart.ashtakavarga?.sarva[signForHouse(chart, primaryHouse)];
  const matchingYogaNames = detectedYogas
    .filter((y) => isClassicalYogaSourceUsable(y.source) && y.planets.some((p) => relatedPlanets.has(p)))
    .map((y) => y.name);
  const primaryAnchorEn = primaryLord
    ? `House ${primaryHouse} lord ${primaryLord.id} is placed in house ${primaryLord.rasiHouseNumber} (${primaryLord.signName}) with ${primaryLord.dignity} dignity.`
    : `The calculated position of the lord of house ${primaryHouse} is unavailable.`;
  const primaryAnchorHi = primaryLord
    ? `भाव ${primaryHouse} के स्वामी ${HI_NAMES[primaryLord.id] ?? primaryLord.id} भाव ${primaryLord.rasiHouseNumber} में ${primaryLord.signName} राशि में ${primaryLord.dignity} गरिमा के साथ स्थित हैं।`
    : `भाव ${primaryHouse} के स्वामी की गणित स्थिति उपलब्ध नहीं है।`;

  const prediction = buildReaderPrediction(chart, domain, primaryOccupants, primarySavBindus, matchingYogaNames);
  const supportive = evidence.filter((item) => item.kind === 'supportive').length;
  const caution = evidence.filter((item) => item.kind === 'caution').length;
  const predictionHi = prediction.hi;
  const predictionEn = prediction.en;
  const completeness = availableCoreFactors >= expectedCoreFactors ? 'complete'
    : availableCoreFactors > 0 ? 'partial' : 'limited';

  const interpretationBasis = DOMAIN_BASIS[domain.id];
  const synthesisEn = `${interpretationBasis.en} Primary chart anchor: ${primaryAnchorEn} The evidence set contains ${supportive} supportive and ${caution} cautionary observations. These are chart factors to weigh together, not a prediction of a guaranteed event or its timing.`;
  const synthesisHi = `${interpretationBasis.hi} मुख्य कुंडली-आधार: ${primaryAnchorHi} उपलब्ध प्रमाणों में ${supportive} सहायक और ${caution} सावधानी वाले प्रेक्षण हैं। इन्हें एक साथ तौलना चाहिए; ये किसी घटना या उसके समय की गारंटी नहीं हैं।`;

  return {
    ...domain,
    predictionEn,
    predictionHi,
    interpretationBasisEn: interpretationBasis.en,
    interpretationBasisHi: interpretationBasis.hi,
    primaryAnchorEn,
    primaryAnchorHi,
    synthesisEn,
    synthesisHi,
    evidence,
    dataCompleteness: completeness,
  };
}

export function computeGeneralPrediction(chart: ChartData): GeneralPredictionReport {
  const detectedYogas = detectClassicalYogas(chart);
  const domains = DOMAINS.map((domain) => analyzeDomain(chart, domain, detectedYogas));
  const evidenceCount = domains.reduce((sum, domain) => sum + domain.evidence.length, 0);
  const partialDomains = domains.filter((domain) => domain.dataCompleteness !== 'complete').length;
  const summaryEn = `A natal-chart-based personal reading across ${domains.length} areas of life (${evidenceCount} classical observations evaluated). Each section begins with the interpretation; the chart calculations and classical reasoning are available separately below it. ${partialDomains} sections have incomplete supporting data, which is disclosed rather than filled with assumptions.`;
  const summaryHi = `जन्मकुंडली के आधार पर जीवन के ${domains.length} क्षेत्रों का व्यक्तिगत फलादेश (${evidenceCount} शास्त्रीय संकेतों का मूल्यांकन)। प्रत्येक अनुभाग में पहले सरल भाषा में व्याख्या दी गई है; उसके बाद अलग से कुंडली-गणना और शास्त्रीय आधार देखे जा सकते हैं। ${partialDomains} क्षेत्रों में सहायक डेटा अधूरा है, जिसे अनुमान से भरने के बजाय स्पष्ट बताया गया है।`;

  return {
    titleEn: 'General Prediction — Natal Chart Synthesis',
    titleHi: 'सामान्य फलादेश — जन्मकुंडली समन्वित विश्लेषण',
    methodEn: 'Read the prediction first. Open the technical notes only if you want to inspect the chart factors and classical rules behind it. Dasha and transit timing remain separate modules.',
    methodHi: 'पहले फलादेश पढ़ें। उसके पीछे के कुंडली-संकेत और शास्त्रीय नियम जानने के लिए तकनीकी विवरण खोलें।',
    summaryEn,
    summaryHi,
    domains,
  };
}
