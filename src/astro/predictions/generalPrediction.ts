import type { ChartData, DivisionalChartId, NineGrahaId, SevenPlanetId } from '../types';
import { SIGNS } from '../constants';
import { getFunctionalLordship } from './functionalLordship';

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

function analyzeDomain(chart: ChartData, domain: DomainDefinition): GeneralPredictionDomain {
  const evidence: GeneralPredictionEvidence[] = [];
  const relatedPlanets = new Set<string>();
  let availableCoreFactors = 0;
  let expectedCoreFactors = domain.houses.length + domain.karakas.length;

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
      availableCoreFactors++;
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

  const supportive = evidence.filter((item) => item.kind === 'supportive').length;
  const caution = evidence.filter((item) => item.kind === 'caution').length;
  const completeness = availableCoreFactors >= expectedCoreFactors ? 'complete'
    : availableCoreFactors > 0 ? 'partial' : 'limited';

  let synthesisEn = 'The available natal indicators are mixed or require contextual interpretation. Read the house lords, occupants, natural significators and divisional placements together; no event or timing conclusion is inferred here.';
  let synthesisHi = 'उपलब्ध जन्मकुंडली संकेत मिश्रित हैं अथवा संदर्भ सहित समझने योग्य हैं। भावेश, भावस्थित ग्रह, नैसर्गिक कारक और वर्ग-कुंडली को साथ पढ़ें; यहाँ किसी घटना या समय का निष्कर्ष नहीं निकाला गया है।';
  if (supportive > 0 && caution === 0) {
    synthesisEn = 'The assessed natal factors contain supportive dignity or strength indications. Their actual results still depend on ownership, relationships, chart context and corroboration; this is not a guarantee of an event.';
    synthesisHi = 'जाँचे गए जन्मकुंडली कारकों में सहायक गरिमा अथवा बल के संकेत हैं। वास्तविक फल स्वामित्व, ग्रह-संबंध, संपूर्ण कुंडली और पुष्टिकरण पर निर्भर करेगा; इसे किसी घटना की गारंटी न समझें।';
  } else if (caution > 0 && supportive === 0) {
    synthesisEn = 'The assessed natal factors include dignity-related cautions. These are interpretive considerations, not a denial of outcomes; weigh them against strength, aspects, ownership and other chart factors.';
    synthesisHi = 'जाँचे गए जन्मकुंडली कारकों में ग्रह-गरिमा से जुड़ी सावधानियाँ हैं। ये विचारणीय संकेत हैं, किसी फल का निषेध नहीं; इन्हें बल, दृष्टि, स्वामित्व और अन्य कुंडली कारकों के साथ तौलें।';
  } else if (supportive > 0 && caution > 0) {
    synthesisEn = 'The natal evidence is mixed: supportive and cautionary factors coexist. Avoid a one-factor verdict; assess the dignity, functional ownership, strength and divisional corroboration of each relevant planet.';
    synthesisHi = 'जन्मकुंडली प्रमाण मिश्रित हैं: सहायक और सावधानी वाले दोनों संकेत साथ हैं। किसी एक कारक से निर्णय न करें; संबंधित ग्रहों की गरिमा, कार्यात्मक स्वामित्व, बल और वर्ग-कुंडली से पुष्टिकरण देखें।';
  }

  return {
    ...domain,
    synthesisEn,
    synthesisHi,
    evidence,
    dataCompleteness: completeness,
  };
}

export function computeGeneralPrediction(chart: ChartData): GeneralPredictionReport {
  const domains = DOMAINS.map((domain) => analyzeDomain(chart, domain));
  const evidenceCount = domains.reduce((sum, domain) => sum + domain.evidence.length, 0);
  const partialDomains = domains.filter((domain) => domain.dataCompleteness !== 'complete').length;
  const summaryEn = `This natal-only overview evaluates ${domains.length} life domains using house lords, occupants, natural significators, planetary dignity, available Shadbala, Sarvashtakavarga, graha aspects and the relevant divisional chart. It records ${evidenceCount} chart observations; ${partialDomains} domains have incomplete core data. No Dasha, current transit, fixed age range, event guarantee, medical diagnosis or probability estimate is included.`;
  const summaryHi = `यह केवल जन्मकुंडली पर आधारित सार ${domains.length} जीवन-क्षेत्रों में भावेश, भावस्थित ग्रह, नैसर्गिक कारक, ग्रह-गरिमा, उपलब्ध षड्बल, सर्वाष्टकवर्ग, ग्रह-दृष्टि और संबंधित वर्ग-कुंडली का परीक्षण करता है। कुल ${evidenceCount} कुंडली-प्रेक्षण दर्ज हैं; ${partialDomains} क्षेत्रों में मूल डेटा अपूर्ण है। इसमें दशा, वर्तमान गोचर, निश्चित आयु-सीमा, घटना की गारंटी, चिकित्सकीय निदान या संभाव्यता-प्रतिशत शामिल नहीं है।`;

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
