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

const DOMAIN_STORY: Record<string, { en: string; hi: string }> = {
  personality: { en: 'Your personality is not meant to be read as a single label. The chart points to the life experiences that shape your confidence, temperament and way of taking initiative.', hi: 'आपके व्यक्तित्व को किसी एक विशेषण में बाँधना उचित नहीं होगा। कुंडली उन अनुभवों की दिशा दिखाती है जो आत्मविश्वास, स्वभाव और पहल करने के तरीके को आकार देते हैं।' },
  education: { en: 'Your learning story is about the way curiosity, discipline and practical experience combine. It can describe not only formal education, but also the subjects and skills you keep returning to.', hi: 'आपकी शिक्षा का संकेत केवल डिग्री तक सीमित नहीं है। यह बताता है कि जिज्ञासा, अनुशासन और व्यावहारिक अनुभव किस तरह मिलकर सीखने की आपकी शैली बनाते हैं।' },
  career: { en: 'Your professional story is best understood through the kind of responsibility you are drawn towards, the people or systems you work with, and the way your efforts become visible.', hi: 'आपके करियर की कहानी केवल नौकरी के पद से तय नहीं होती। यह जिम्मेदारियों के प्रकार, जिन लोगों या व्यवस्थाओं के साथ आप काम करते हैं, और आपके प्रयासों को मिलने वाली पहचान से बनती है।' },
  wealth: { en: 'Your financial pattern concerns both earning and retaining. The chart should be read for the channels through which resources build, as well as the habits and obligations that can redirect them.', hi: 'धन का विषय केवल कमाई नहीं, उसे सँभालकर रखने का भी है। कुंडली यह समझने में मदद करती है कि संसाधन किन रास्तों से बनते हैं और कौन-सी आदतें या जिम्मेदारियाँ उन्हें दूसरी दिशा दे सकती हैं।' },
  marriage: { en: 'Your relationship story is about the balance between personal expectations and the realities of sharing life with another person. The chart can describe the style of partnership you seek and the adjustments that matter.', hi: 'विवाह और संबंधों की कहानी अपनी अपेक्षाओं तथा दूसरे व्यक्ति के साथ जीवन बाँटने की वास्तविकता के बीच संतुलन की है। कुंडली साझेदारी की आपकी शैली और आवश्यक समझौतों के संकेत देती है।' },
  children: { en: 'This area speaks not only about children, but also about what you create, nurture and pass forward. Its promise must be judged carefully from the complete chart, never from one placement alone.', hi: 'यह क्षेत्र केवल संतान नहीं, बल्कि आपकी सृजनशीलता, पालन-पोषण और आगे आने वाली पीढ़ी को दिए जाने वाले संस्कारों से भी जुड़ा है। इसका निष्कर्ष पूरी कुंडली से ही निकालना चाहिए, किसी एक स्थिति से नहीं।' },
  property: { en: 'Your home and property story is linked with security, roots and the practical foundations you build. The chart may show whether these matters connect more strongly with family, work, effort or changing circumstances.', hi: 'घर और संपत्ति का विषय सुरक्षा, जड़ों और जीवन की व्यावहारिक नींव से जुड़ा है। कुंडली संकेत दे सकती है कि ये विषय परिवार, काम, स्वयं के प्रयास या बदलती परिस्थितियों से अधिक जुड़े हैं।' },
  health: { en: 'This reading is limited to traditional themes of vitality, stamina and daily rhythm. It is not a diagnosis, a prediction of illness or a substitute for medical advice.', hi: 'यह व्याख्या केवल पारंपरिक ज्योतिष में जीवनशक्ति, सहनशीलता और दिनचर्या से जुड़े संकेतों तक सीमित है। यह रोग का निदान या चिकित्सकीय सलाह का विकल्प नहीं है।' },
  travels: { en: 'Your movement and distance story can involve learning, work, relationships or the need for a different environment. A natal chart alone cannot promise a specific journey or date.', hi: 'यात्रा और स्थान परिवर्तन के पीछे शिक्षा, काम, संबंध या नए वातावरण की आवश्यकता जैसे कारण हो सकते हैं। केवल जन्मकुंडली किसी निश्चित यात्रा या तारीख की गारंटी नहीं देती।' },
  spirituality: { en: 'Your inner life is shaped by the questions you keep asking, the principles you trust and the experiences that make you look beyond immediate results.', hi: 'आपका आंतरिक जीवन उन प्रश्नों, जीवन-मूल्यों और अनुभवों से आकार लेता है जो आपको तात्कालिक लाभ से आगे देखने की प्रेरणा देते हैं।' },
  milestones: { en: 'Recognition and major progress are not always sudden. The chart is read for the environments in which your effort can become visible and the kind of contribution that may earn lasting respect.', hi: 'पहचान और बड़ी प्रगति हमेशा अचानक नहीं आती। कुंडली उन परिस्थितियों के संकेत देती है जहाँ आपका प्रयास सामने आ सकता है और किस प्रकार का योगदान स्थायी सम्मान दिला सकता है।' },
  remedies: { en: 'The most useful traditional remedy begins with conduct: clarity, restraint, generosity and a steady practice aligned with one’s values. No ritual or object can guarantee an outcome.', hi: 'सबसे उपयोगी पारंपरिक उपाय आचरण से शुरू होता है—स्पष्टता, संयम, उदारता और अपने मूल्यों के अनुरूप नियमित साधना। कोई अनुष्ठान या वस्तु निश्चित फल की गारंटी नहीं देती।' },
  family: { en: 'Your family story includes belonging, shared values, family responsibilities and the resources passed between generations. Emotional harmony and financial support are assessed separately.', hi: 'परिवार से जुड़ी कहानी अपनापन, साझा मूल्य, पारिवारिक जिम्मेदारियों और पीढ़ियों के बीच आने-जाने वाले संसाधनों से बनती है। भावनात्मक सामंजस्य और आर्थिक सहयोग का अलग-अलग आकलन होगा।' },
  parents: { en: 'The chart considers the distinct bonds with mother and father, care received or given, guidance and ancestral influence. It does not determine a parent’s lifespan or replace lived family history.', hi: 'कुंडली माता और पिता से अलग-अलग संबंध, देखभाल, मार्गदर्शन और पैतृक प्रभाव के संकेत देती है। इससे माता-पिता की आयु निर्धारित नहीं की जाती और वास्तविक पारिवारिक इतिहास का स्थान नहीं लिया जा सकता।' },
  siblings: { en: 'Sibling themes include cooperation, communication, shared responsibilities and differences in approach. The chart is not used to declare that a sibling does not exist or will be harmed.', hi: 'भाई-बहनों से जुड़े विषयों में सहयोग, संवाद, साझा जिम्मेदारियाँ और विचारों का अंतर शामिल है। कुंडली से किसी भाई-बहन के न होने या हानि की घोषणा नहीं की जाएगी।' },
  romance: { en: 'Romantic life is read through affection, emotional expression, expectations and the ability to build mutual trust. It is not automatically equated with marriage or a fixed relationship event.', hi: 'प्रेम-जीवन में अनुराग, भावनात्मक अभिव्यक्ति, अपेक्षाएँ और पारस्परिक विश्वास बनाने की क्षमता देखी जाती है। इसे अपने-आप विवाह या किसी निश्चित संबंध-घटना के समान नहीं माना जाता।' },
  business: { en: 'Independent work is considered through initiative, commercial judgement, agreements, operational responsibility and the ability to build networks. The reading distinguishes entrepreneurial themes from employment.', hi: 'स्वतंत्र कार्य में पहल, व्यावसायिक निर्णय, समझौते, संचालन की जिम्मेदारी और संपर्क-वृत्त बनाने की क्षमता देखी जाती है। इसे नौकरी के संकेतों से अलग रखा जाता है।' },
  debt_disputes: { en: 'This area considers how you approach obligations, competition, conflict resolution and recovery after setbacks. It does not predict court verdicts, guaranteed victory or inevitable debt.', hi: 'इस क्षेत्र में दायित्वों, प्रतिस्पर्धा, विवाद सुलझाने और कठिनाई के बाद उबरने की प्रवृत्ति देखी जाती है। इससे अदालत का फैसला, निश्चित जीत या अनिवार्य कर्ज नहीं बताया जाता।' },
  income_networks: { en: 'This reading separates recurring income, one-time gains, friendships and professional networks. It looks at the channels through which goals may be supported, without promising a specific amount.', hi: 'यह विश्लेषण नियमित आय, एकमुश्त लाभ, मित्रता और पेशेवर संपर्कों को अलग-अलग देखता है। यह लक्ष्य-सहयोग के संभावित माध्यम बताता है, किसी निश्चित राशि का वादा नहीं करता।' },
  foreign_residence: { en: 'Distance may enter life through travel, study, work, relationships or the search for a different home environment. Temporary travel and permanent relocation require different evidence.', hi: 'दूरस्थ स्थानों से संबंध यात्रा, शिक्षा, काम, संबंध या नए निवास की खोज से बन सकते हैं। अस्थायी यात्रा और स्थायी स्थानांतरण के लिए अलग प्रमाण आवश्यक हैं।' },
};

function buildReaderPrediction(domain: DomainDefinition, lord: ChartData['planets'][number] | undefined): { en: string; hi: string } {
  const opening = DOMAIN_STORY[domain.id];
  if (!lord) return { en: opening.en + ' The chart data needed for a more specific conclusion is incomplete, so this section deliberately avoids a stronger claim.', hi: opening.hi + ' अधिक विशिष्ट निष्कर्ष के लिए आवश्यक कुंडली-डेटा अधूरा है, इसलिए यहाँ बढ़ा-चढ़ाकर दावा नहीं किया गया है।' };
  const destination = HOUSE_THEMES[lord.rasiHouseNumber];
  const strong = SUPPORTIVE_DIGNITIES.has(lord.dignity);
  const strained = CAUTION_DIGNITIES.has(lord.dignity);
  const qualityEn = strong
    ? 'This placement has a comparatively supportive foundation, so the constructive side of this connection deserves attention.'
    : strained
      ? 'This connection may require patience and conscious effort; the subject can develop through delays, course-corrections or learning from difficult experiences.'
      : 'The placement is mixed by itself. Its outcome depends on the planet’s relationships, strength and the other chart factors shown below.';
  const qualityHi = strong
    ? 'इस स्थिति में अपेक्षाकृत सहायक आधार दिखाई देता है; इसलिए इस संबंध का रचनात्मक पक्ष विशेष ध्यान देने योग्य है।'
    : strained
      ? 'इस संबंध में धैर्य और सजग प्रयास की आवश्यकता हो सकती है। यह विषय देरी, दिशा-सुधार या कठिन अनुभवों से सीखते हुए विकसित हो सकता है।'
      : 'यह स्थिति अकेले में मिश्रित संकेत देती है। इसका वास्तविक फल ग्रह-संबंध, बल और नीचे दिए गए अन्य कुंडली-संकेतों पर निर्भर करेगा।';
  const retroEn = lord.isRetrograde ? ' The matter may also unfold in a reflective or non-linear way, with revisions before clarity.' : '';
  const retroHi = lord.isRetrograde ? ' इस विषय में स्पष्टता आने से पहले पुनर्विचार या कुछ उतार-चढ़ाव भी हो सकते हैं।' : '';
  const combustEn = lord.isCombust ? ' Because the planet is close to the Sun, its themes may need more deliberate handling rather than being assumed to operate effortlessly.' : '';
  const combustHi = lord.isCombust ? ' सूर्य के निकट होने के कारण इस ग्रह से जुड़े विषयों में सहजता मान लेने के बजाय अधिक सजगता आवश्यक हो सकती है।' : '';
  return {
    en: opening.en + ' The central connection is with ' + destination.en + '. ' + qualityEn + retroEn + combustEn + ' Treat this as a life-pattern interpretation, not a promise that a particular event must occur.',
    hi: opening.hi + ' इसका मुख्य संबंध ' + destination.hi + ' से बनता है। ' + qualityHi + retroHi + combustHi + ' इसे जीवन-प्रवृत्ति का संकेत समझें, किसी निश्चित घटना का वादा नहीं।',
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
  const primaryAnchorEn = primaryLord
    ? `House ${primaryHouse} lord ${primaryLord.id} is placed in house ${primaryLord.rasiHouseNumber} (${primaryLord.signName}) with ${primaryLord.dignity} dignity.`
    : `The calculated position of the lord of house ${primaryHouse} is unavailable.`;
  const primaryAnchorHi = primaryLord
    ? `भाव ${primaryHouse} के स्वामी ${HI_NAMES[primaryLord.id] ?? primaryLord.id} भाव ${primaryLord.rasiHouseNumber} में ${primaryLord.signName} राशि में ${primaryLord.dignity} गरिमा के साथ स्थित हैं।`
    : `भाव ${primaryHouse} के स्वामी की गणित स्थिति उपलब्ध नहीं है।`;

  const prediction = buildReaderPrediction(domain, primaryLord);
  const supportive = evidence.filter((item) => item.kind === 'supportive').length;
  const caution = evidence.filter((item) => item.kind === 'caution').length;
  const integratedHi = supportive > caution
    ? 'समग्र संकेतों में सहायक पक्ष अपेक्षाकृत अधिक दिखाई देता है; फिर भी संबंधित भावेश, कारक ग्रह, दृष्टि-युति और वर्ग-कुंडली की पुष्टि के बिना इसे निश्चित सफलता नहीं माना जाना चाहिए।'
    : caution > supportive
      ? 'समग्र संकेतों में कुछ चुनौतीपूर्ण पक्ष भी उभरते हैं; इन्हें बाधा की निश्चित घोषणा न मानें। ग्रहबल, शुभ प्रभाव, अन्य भावों के सहयोग और दशा-गोचर से इनका वास्तविक परिणाम बदल सकता है।'
      : 'समग्र संकेत मिश्रित हैं या किसी एक दिशा में स्पष्ट नहीं हैं; इसलिए इस विषय पर एकतरफा शुभ या अशुभ निष्कर्ष उचित नहीं होगा।';
  const integratedEn = supportive > caution
    ? 'The combined evidence leans relatively supportive, but this is not a guarantee of success; the relevant lords, significators, aspects, conjunctions and divisional confirmation must be weighed together.'
    : caution > supportive
      ? 'The combined evidence also contains challenging indications; these are not a certainty of failure. Planetary strength, supportive influences, other houses and later dasha/transit context can materially modify the outcome.'
      : 'The combined evidence is mixed or not clearly directional, so a one-sided favourable or unfavourable verdict would not be justified.';
  const predictionHi = prediction.hi + ' ' + integratedHi;
  const predictionEn = prediction.en + ' ' + integratedEn;
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
  const summaryEn = `A natal-chart-based personal reading across ${domains.length} areas of life. Each section begins with the interpretation; the chart calculations and classical reasoning are available separately below it. ${partialDomains} sections have incomplete supporting data, which is disclosed rather than filled with assumptions.`;
  const summaryHi = `जन्मकुंडली के आधार पर जीवन के ${domains.length} क्षेत्रों का व्यक्तिगत फलादेश। प्रत्येक अनुभाग में पहले सरल भाषा में व्याख्या दी गई है; उसके बाद अलग से कुंडली-गणना और शास्त्रीय आधार देखे जा सकते हैं। ${partialDomains} क्षेत्रों में सहायक डेटा अधूरा है, जिसे अनुमान से भरने के बजाय स्पष्ट बताया गया है।`;

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
