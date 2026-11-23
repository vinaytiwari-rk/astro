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

function hasUsableYogaSource(source: string): boolean {
  return !/not verified|unverified|verify the individual|traditional yoga compilation|classical jyotisha references|300 classical yogas/i.test(source);
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
    if (!definition || !hasUsableYogaSource(definition.source)) continue;
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

  const varga = chart.divisionalCharts?.[domain.varga];
  if (varga) {
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

  const supportive = evidence.filter((item) => item.kind === 'supportive').length;
  const caution = evidence.filter((item) => item.kind === 'caution').length;
  const completeness = availableCoreFactors >= expectedCoreFactors ? 'complete'
    : availableCoreFactors > 0 ? 'partial' : 'limited';

  const interpretationBasis = DOMAIN_BASIS[domain.id];
  const synthesisEn = `${interpretationBasis.en} Primary chart anchor: ${primaryAnchorEn} The evidence set contains ${supportive} supportive and ${caution} cautionary observations. These are chart factors to weigh together, not a prediction of a guaranteed event or its timing.`;
  const synthesisHi = `${interpretationBasis.hi} मुख्य कुंडली-आधार: ${primaryAnchorHi} उपलब्ध प्रमाणों में ${supportive} सहायक और ${caution} सावधानी वाले प्रेक्षण हैं। इन्हें एक साथ तौलना चाहिए; ये किसी घटना या उसके समय की गारंटी नहीं हैं।`;

  return {
    ...domain,
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
  const summaryEn = `This natal-only overview evaluates ${domains.length} life domains using house lords, functional lordship, classical yoga rule matches, occupants, natural significators, planetary dignity, available Shadbala, Sarvashtakavarga, graha aspects and the relevant divisional chart. It records ${evidenceCount} chart observations; ${partialDomains} domains have incomplete core data. No Dasha, current transit, fixed age range, event guarantee, medical diagnosis or probability estimate is included.`;
  const summaryHi = `यह केवल जन्मकुंडली पर आधारित सार ${domains.length} जीवन-क्षेत्रों में भावेश, कार्यात्मक स्वामित्व, शास्त्रीय योग-नियम मिलान, भावस्थित ग्रह, नैसर्गिक कारक, ग्रह-गरिमा, उपलब्ध षड्बल, सर्वाष्टकवर्ग, ग्रह-दृष्टि और संबंधित वर्ग-कुंडली का परीक्षण करता है। कुल ${evidenceCount} कुंडली-प्रेक्षण दर्ज हैं; ${partialDomains} क्षेत्रों में मूल डेटा अपूर्ण है। इसमें दशा, वर्तमान गोचर, निश्चित आयु-सीमा, घटना की गारंटी, चिकित्सकीय निदान या संभाव्यता-प्रतिशत शामिल नहीं है।`;

  return {
    titleEn: 'General Prediction — Natal Chart Synthesis',
    titleHi: 'सामान्य फलादेश — जन्मकुंडली समन्वित विश्लेषण',
    methodEn: 'Scope: natal chart only (D1 plus the domain-relevant varga). Dasha and transit are separate modules. Evidence labels describe dignity or engine strength thresholds; they are not probabilities or event forecasts.',
    methodHi: 'विश्लेषण सीमा: केवल जन्मकुंडली (D1 तथा संबंधित वर्ग-कुंडली)। दशा और गोचर अलग अनुभाग हैं। प्रमाण-लेबल ग्रह-गरिमा अथवा गणना-इंजन के बल-मानदंड बताते हैं; ये संभाव्यता या घटना-भविष्यवाणी नहीं हैं।',
    summaryEn,
    summaryHi,
    domains,
  };
}
