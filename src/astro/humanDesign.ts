/**
 * Human Design & 9-Chakra BodyGraph Engine
 * AV Astro Vibe — 100% Offline, Zero External API Dependency
 *
 * Computes 64 I-Ching Gates from natal planetary degrees,
 * 9 Energy Centers (Defined vs Undefined), 5 Energy Types,
 * Inner Authority, Profile, and Incarnation Cross.
 */

import type { ChartData, NineGrahaId } from './types';
import { normalizeDeg } from './time';

export type HumanDesignEnergyType =
  | 'Generator'
  | 'Manifesting Generator'
  | 'Projector'
  | 'Manifestor'
  | 'Reflector';

export type InnerAuthority =
  | 'Emotional (Solar Plexus)'
  | 'Sacral'
  | 'Splenic'
  | 'Ego / Heart'
  | 'Self-Projected (G-Center)'
  | 'Environmental / Mental'
  | 'Lunar (Reflector)';

export interface EnergyCenter {
  id: string;
  nameEn: string;
  nameHi: string;
  defined: boolean;
  themeEn: string;
  themeHi: string;
  activeGates: number[];
}

export interface ActivatedGate {
  gateNumber: number;
  planetId: NineGrahaId;
  planetNameHi: string;
  centerId: string;
  centerNameHi: string;
  gateNameEn: string;
  gateNameHi: string;
  line: number; // 1..6
}

export interface HumanDesignReport {
  energyType: HumanDesignEnergyType;
  energyTypeHi: string;
  strategyEn: string;
  strategyHi: string;
  signatureEn: string;
  signatureHi: string;
  notSelfThemeEn: string;
  notSelfThemeHi: string;
  authority: InnerAuthority;
  authorityHi: string;
  profileEn: string;
  profileHi: string;
  definitionTypeEn: string;
  definitionTypeHi: string;
  centers: EnergyCenter[];
  activeGates: ActivatedGate[];
  incarnationCrossEn: string;
  incarnationCrossHi: string;
}

// 64 I-Ching Gates mapped around 360° (each gate = 5.625°)
// Starting from 0° Aries
const GATE_WHEEL_ORDER = [
  25, 17, 21, 51, 42, 3, 27, 24, 2, 23, 8, 20, 16, 35, 45, 12,
  15, 52, 39, 53, 62, 56, 31, 33, 7, 4, 29, 59, 40, 64, 47, 6,
  46, 18, 48, 57, 32, 50, 28, 44, 1, 43, 14, 34, 9, 5, 26, 11,
  10, 58, 38, 54, 61, 60, 41, 19, 13, 49, 30, 55, 37, 63, 22, 36,
];

const GATE_NAMES: Record<number, { en: string; hi: string; center: string }> = {
  1: { en: 'Gate of Self-Expression', hi: 'आत्म-अभिव्यक्ति का द्वार', center: 'g_center' },
  2: { en: 'Gate of Higher Direction', hi: 'दिशा व दिव्य पथ का द्वार', center: 'g_center' },
  3: { en: 'Gate of Ordering (Beginnings)', hi: 'नव-आरंभ एवं व्यवस्थापन', center: 'sacral' },
  4: { en: 'Gate of Formulization (Answers)', hi: 'समाधान एवं तार्किक नियम', center: 'ajna' },
  5: { en: 'Gate of Fixed Rhythms', hi: 'प्राकृतिक लय व धैर्य का द्वार', center: 'sacral' },
  6: { en: 'Gate of Friction (Intimacy)', hi: 'संवेदना एवं अंतरंग सामंजस्य', center: 'solar_plexus' },
  7: { en: 'Gate of Role Leadership', hi: 'मार्गदर्शक नेतृत्व का द्वार', center: 'g_center' },
  8: { en: 'Gate of Contribution', hi: 'सार्वजनिक योगदान व विशिष्टता', center: 'throat' },
  9: { en: 'Gate of Focus & Detail', hi: 'गहन एकाग्रता एवं सूक्ष्म दृष्टि', center: 'sacral' },
  10: { en: 'Gate of Behavior & Self-Love', hi: 'आत्म-प्रेम एवं आदर्श आचरण', center: 'g_center' },
  11: { en: 'Gate of Ideas & Concepts', hi: 'उर्वर विचार एवं वैचारिक प्रकाश', center: 'ajna' },
  12: { en: 'Gate of Caution & Articulation', hi: 'संयमित वाणी एवं अभिव्यक्ति', center: 'throat' },
  13: { en: 'Gate of the Listener', hi: 'सहानुभूतिपूर्ण श्रवण एवं रहस्य', center: 'g_center' },
  14: { en: 'Gate of Power Skills & Wealth', hi: 'कर्म कौशल एवं प्रचुर संपन्नता', center: 'sacral' },
  15: { en: 'Gate of Extremes & Humanity', hi: 'समरसता एवं मानवीय विविधता', center: 'g_center' },
  16: { en: 'Gate of Skills & Enthusiasm', hi: 'हस्त-कौशल एवं अदम्य उत्साह', center: 'throat' },
  17: { en: 'Gate of Opinions & Foresight', hi: 'दूरदर्शिता एवं स्पष्ट राय', center: 'ajna' },
  18: { en: 'Gate of Correction & Standards', hi: 'सुधार, समीक्षा एवं उत्कृष्ट मापदंड', center: 'spleen' },
  19: { en: 'Gate of Wanting & Sensitivity', hi: 'परस्पर निर्भरता एवं संवेदनशीलता', center: 'root' },
  20: { en: 'Gate of the Present (Now)', hi: 'वर्तमान में उपस्थिति एवं सजगता', center: 'throat' },
  21: { en: 'Gate of the Hunter (Control)', hi: 'प्रबंधन, नियंत्रण एवं अधिकार', center: 'heart' },
  22: { en: 'Gate of Openness & Grace', hi: 'शालीनता, भावनात्मक आकर्षण व दया', center: 'solar_plexus' },
  23: { en: 'Gate of Assimilation (Insight)', hi: 'सरल व्याख्या एवं गहरी अंतर्दृष्टि', center: 'throat' },
  24: { en: 'Gate of Rationalization', hi: 'पुनरावलोकन एवं चिंतन शक्ति', center: 'ajna' },
  25: { en: 'Gate of the Spirit of Self (Love)', hi: 'सच्चा आत्म-प्रेम एवं निश्छल हृदय', center: 'g_center' },
  26: { en: 'Gate of the Trickster (Sales)', hi: 'विश्वास, वाक्-प्रबंधन व वाणिज्य', center: 'heart' },
  27: { en: 'Gate of Caring & Nourishment', hi: 'मातृवत पोषण एवं संरक्षण', center: 'sacral' },
  28: { en: 'Gate of the Game Player (Purpose)', hi: 'जीवन का अर्थ एवं संघर्ष में सार्थकता', center: 'spleen' },
  29: { en: 'Gate of Saying Yes (Commitment)', hi: 'दृढ़ संकल्प एवं समर्पण शक्ति', center: 'sacral' },
  30: { en: 'Gate of Recognition of Feelings', hi: 'तीव्र इच्छाएं एवं भावनात्मक उत्साह', center: 'solar_plexus' },
  31: { en: 'Gate of Leading (Influence)', hi: 'लोकतांत्रिक प्रभाव व नेतृत्व वाणी', center: 'throat' },
  32: { en: 'Gate of Continuity (Success)', hi: 'दीर्घकालीन सफलता व दूरदृष्टि', center: 'spleen' },
  33: { en: 'Gate of Privacy & Retrospect', hi: 'एकांत, आत्म-समीक्षा व विश्राम', center: 'throat' },
  34: { en: 'Gate of Power & Pure Energy', hi: 'विशाल कर्म शक्ति एवं स्वतंत्र गति', center: 'sacral' },
  35: { en: 'Gate of Change & Progress', hi: 'नवीन अनुभव एवं प्रगति का द्वार', center: 'throat' },
  36: { en: 'Gate of Crisis & Resolution', hi: 'भावनात्मक संकट एवं परिपक्व समाधान', center: 'solar_plexus' },
  37: { en: 'Gate of Friendship (Family)', hi: 'कौटुंबिक शांति, मित्रता एवं विश्वास', center: 'solar_plexus' },
  38: { en: 'Gate of the Fighter (Integrity)', hi: 'सत्य के लिए संघर्ष एवं नैतिक साहस', center: 'root' },
  39: { en: 'Gate of Provocation (Energy)', hi: 'ऊर्जा को जगाना एवं अंतःचेतना', center: 'root' },
  40: { en: 'Gate of Aloneness (Deliverance)', hi: 'कर्तव्य पूर्णता एवं एकांत विश्राम', center: 'heart' },
  41: { en: 'Gate of Contraction (Fantasy)', hi: 'कल्पनाशीलता एवं नई आशा की शुरुआत', center: 'root' },
  42: { en: 'Gate of Growth (Completion)', hi: 'कार्यों की पूर्णता एवं संवृद्धि', center: 'sacral' },
  43: { en: 'Gate of Insight (Breakthrough)', hi: 'अनोखी सोच एवं बौद्धिक छलांग', center: 'ajna' },
  44: { en: 'Gate of Alertness (Instinct)', hi: 'सहज सतर्कता एवं सहकर्मियों का चयन', center: 'spleen' },
  45: { en: 'Gate of the Gatherer (Ruler)', hi: 'संपत्ति संचय, कुल-प्रमुख व अधिकार', center: 'throat' },
  46: { en: 'Gate of Serendipity (Body)', hi: 'दैवीय संयोग एवं शारीरिक आरोग्यता', center: 'g_center' },
  47: { en: 'Gate of Realization (Oppression)', hi: 'अतीत का अर्थ समझना एवं बोध', center: 'ajna' },
  48: { en: 'Gate of Depth (Intuition)', hi: 'गहन ज्ञान, तकनीकी कौशल व समाधान', center: 'spleen' },
  49: { en: 'Gate of Principles (Revolution)', hi: 'नैतिक सिद्धांत, न्याय व सुधार', center: 'solar_plexus' },
  50: { en: 'Gate of Values & Guardian', hi: 'सांस्कृतिक मूल्य, मर्यादा एवं सुरक्षा', center: 'spleen' },
  51: { en: 'Gate of Shock & Initiation', hi: 'आकस्मिक जागृति एवं आध्यात्मिक साहस', center: 'heart' },
  52: { en: 'Gate of Stillness (Mountain)', hi: 'शांत एकाग्रता एवं गंभीर स्थिरता', center: 'root' },
  53: { en: 'Gate of Development (Starting)', hi: 'नवीन चक्र का उदय एवं उद्यम', center: 'root' },
  54: { en: 'Gate of Ambition (Ascent)', hi: 'उच्च महत्वाकांक्षा एवं सामाजिक उत्थान', center: 'root' },
  55: { en: 'Gate of Spirit & Abundance', hi: 'आत्मिक समृद्धि एवं भावनात्मक स्वतंत्रता', center: 'solar_plexus' },
  56: { en: 'Gate of the Storyteller', hi: 'जीवंत गाथाएं, भ्रमण एवं संवाद', center: 'throat' },
  57: { en: 'Gate of Intuitive Clarity', hi: 'सूक्ष्म अंतर्ज्ञान एवं तात्कालिक श्रवण', center: 'spleen' },
  58: { en: 'Gate of the Joy of Vitality', hi: 'जीवन का आनंद एवं सुधार की प्रेरणा', center: 'root' },
  59: { en: 'Gate of Sexuality & Bonding', hi: 'सच्चा समर्पण, संतान एवं अंतरंगता', center: 'sacral' },
  60: { en: 'Gate of Acceptance (Limitation)', hi: 'सीमाओं को स्वीकार कर नवसृजन', center: 'root' },
  61: { en: 'Gate of Mystery (Inner Truth)', hi: 'ब्रह्मांडीय रहस्य एवं आत्मज्ञान', center: 'head' },
  62: { en: 'Gate of Detail & Precision', hi: 'सटीक शब्द, योजना एवं सुस्पष्ट तथ्य', center: 'throat' },
  63: { en: 'Gate of Doubt & Inquiry', hi: 'जिज्ञासा, वैज्ञानिक परीक्षण व सत्य', center: 'head' },
  64: { en: 'Gate of Confusion & Imagery', hi: 'मानसिक चित्र एवं दिव्य प्रेरणा', center: 'head' },
};

const PLANET_NAMES_HI: Record<string, string> = {
  Sun: 'सूर्य',
  Moon: 'चंद्रमा',
  Mars: 'मंगल',
  Mercury: 'बुध',
  Jupiter: 'बृहस्पति (गुरु)',
  Venus: 'शुक्र',
  Saturn: 'शनि',
  Rahu: 'राहु',
  Ketu: 'केतु',
};

export function computeHumanDesign(chart: ChartData): HumanDesignReport {
  // Map all planets to their Human Design Gate (360° / 64 = 5.625° per gate)
  const activeGates: ActivatedGate[] = [];
  const definedCentersSet = new Set<string>();

  const NINE_GRAHAS: NineGrahaId[] = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

  for (const p of chart.planets) {
    if (!NINE_GRAHAS.includes(p.id as NineGrahaId)) continue;
    const gid = p.id as NineGrahaId;
    const lon = normalizeDeg(p.longitude);
    const gateSlot = Math.floor(lon / 5.625);
    const gateNum = GATE_WHEEL_ORDER[gateSlot % 64];
    const gateMeta = GATE_NAMES[gateNum] || { en: `Gate ${gateNum}`, hi: `द्वार ${gateNum}`, center: 'sacral' };

    const degInGate = lon % 5.625;
    const lineNum = Math.floor(degInGate / (5.625 / 6)) + 1;

    definedCentersSet.add(gateMeta.center);

    activeGates.push({
      gateNumber: gateNum,
      planetId: gid,
      planetNameHi: PLANET_NAMES_HI[gid] || gid,
      centerId: gateMeta.center,
      centerNameHi:
        gateMeta.center === 'head' ? 'मस्तिष्क केंद्र (Head)' :
        gateMeta.center === 'ajna' ? 'आज्ञा चक्र (Ajna)' :
        gateMeta.center === 'throat' ? 'कंठ केंद्र (Throat)' :
        gateMeta.center === 'g_center' ? 'जी-केंद्र (Identity/G)' :
        gateMeta.center === 'heart' ? 'हृदय/अहं केंद्र (Heart/Ego)' :
        gateMeta.center === 'sacral' ? 'स्वाधिष्ठान (Sacral)' :
        gateMeta.center === 'spleen' ? 'प्लीहा केंद्र (Spleen/Immunity)' :
        gateMeta.center === 'solar_plexus' ? 'मणिपुर/भाव केंद्र (Solar Plexus)' : 'मूलाधार केंद्र (Root)',
      gateNameEn: gateMeta.en,
      gateNameHi: gateMeta.hi,
      line: Math.max(1, Math.min(6, lineNum)),
    });
  }

  // Determine Defined Centers
  const centers: EnergyCenter[] = [
    {
      id: 'head',
      nameEn: 'Head Center (Inspiration)',
      nameHi: 'शिरो केंद्र (प्रेरणा व विचार)',
      defined: definedCentersSet.has('head'),
      themeEn: 'Inspiration, mental pressure, questioning existence.',
      themeHi: 'ब्रह्मांडीय प्रेरणा, दार्शनिक प्रश्न व वैचारिक दबाव।',
      activeGates: activeGates.filter((g) => g.centerId === 'head').map((g) => g.gateNumber),
    },
    {
      id: 'ajna',
      nameEn: 'Ajna Center (Awareness & Logic)',
      nameHi: 'आज्ञा चक्र (तर्क, चिंतन व समझ)',
      defined: definedCentersSet.has('ajna'),
      themeEn: 'Processing mental constructs, logic, concepts and memory.',
      themeHi: 'तार्किक विश्लेषण, विचारों को व्यवस्थित करना व मानसिक स्पष्टता।',
      activeGates: activeGates.filter((g) => g.centerId === 'ajna').map((g) => g.gateNumber),
    },
    {
      id: 'throat',
      nameEn: 'Throat Center (Manifestation & Voice)',
      nameHi: 'कंठ केंद्र (अभिव्यक्ति व कार्य सिद्धि)',
      defined: definedCentersSet.has('throat'),
      themeEn: 'Communication, metamorphosis, speaking truth into material reality.',
      themeHi: 'वाणी, संवाद, विचारों को भौतिक रूप में प्रकट करना।',
      activeGates: activeGates.filter((g) => g.centerId === 'throat').map((g) => g.gateNumber),
    },
    {
      id: 'g_center',
      nameEn: 'G-Center (Identity, Love & Direction)',
      nameHi: 'जी-केंद्र (आत्म-पहचान, प्रेम व जीवन दिशा)',
      defined: definedCentersSet.has('g_center'),
      themeEn: 'Core magnetic monopoles, purpose, unconditional love and direction.',
      themeHi: 'सच्चा आत्म-स्वरूप, जीवन का उद्देश्य व दिशा निर्धारण।',
      activeGates: activeGates.filter((g) => g.centerId === 'g_center').map((g) => g.gateNumber),
    },
    {
      id: 'heart',
      nameEn: 'Heart / Ego Center (Willpower & Drive)',
      nameHi: 'हृदय व अहं केंद्र (इच्छाशक्ति व संकल्प)',
      defined: definedCentersSet.has('heart'),
      themeEn: 'Willpower, commitments, material agreements and self-worth.',
      themeHi: 'संकल्प शक्ति, वित्तीय स्वायत्तता व आत्म-सम्मान।',
      activeGates: activeGates.filter((g) => g.centerId === 'heart').map((g) => g.gateNumber),
    },
    {
      id: 'sacral',
      nameEn: 'Sacral Center (Life Force & Vitality)',
      nameHi: 'स्वाधिष्ठान केंद्र (प्राण ऊर्जा व जनन शक्ति)',
      defined: definedCentersSet.has('sacral'),
      themeEn: 'Primal reproductive life force, stamina, responsive work.',
      themeHi: 'अथक कार्य ऊर्जा, जीवन शक्ति व प्राकृतिक सृजन।',
      activeGates: activeGates.filter((g) => g.centerId === 'sacral').map((g) => g.gateNumber),
    },
    {
      id: 'spleen',
      nameEn: 'Spleen Center (Intuition & Immunity)',
      nameHi: 'प्लीहा केंद्र (सहज अंतर्ज्ञान व आरोग्य)',
      defined: definedCentersSet.has('spleen'),
      themeEn: 'Body consciousness, instinctual survival, timing and immune health.',
      themeHi: 'सहज अंतर्ज्ञान, रोग प्रतिरोधक क्षमता व तात्कालिक सजगता।',
      activeGates: activeGates.filter((g) => g.centerId === 'spleen').map((g) => g.gateNumber),
    },
    {
      id: 'solar_plexus',
      nameEn: 'Solar Plexus Center (Emotions & Wave)',
      nameHi: 'भाव केंद्र (भावनात्मक लहर व संवेदनशीलता)',
      defined: definedCentersSet.has('solar_plexus'),
      themeEn: 'Emotional wave, sensitivity, relational passion and moods.',
      themeHi: 'भावनात्मक तरंगे, सहानुभूति व अंतरंग संबंध।',
      activeGates: activeGates.filter((g) => g.centerId === 'solar_plexus').map((g) => g.gateNumber),
    },
    {
      id: 'root',
      nameEn: 'Root Center (Stress, Adrenaline & Fuel)',
      nameHi: 'मूलाधार केंद्र (तनाव प्रबंधन व कार्य प्रेरणा)',
      defined: definedCentersSet.has('root'),
      themeEn: 'Pressure to evolve, physical stamina, adrenaline momentum.',
      themeHi: 'दबाव को शक्ति में बदलना, जमीनी यथार्थ व निरंतर गति।',
      activeGates: activeGates.filter((g) => g.centerId === 'root').map((g) => g.gateNumber),
    },
  ];

  // Energy Type Determination
  const isSacralDefined = definedCentersSet.has('sacral');
  const isThroatDefined = definedCentersSet.has('throat');
  const isSolarDefined = definedCentersSet.has('solar_plexus');
  const isSpleenDefined = definedCentersSet.has('spleen');
  const isHeartDefined = definedCentersSet.has('heart');

  let energyType: HumanDesignEnergyType = 'Projector';
  let energyTypeHi = 'प्रोजेक्टर (मार्गदर्शक)';
  let strategyEn = 'Wait for the Invitation and Recognition';
  let strategyHi = 'सम्मानजनक निमंत्रण व पहचान की प्रतीक्षा करें';
  let signatureEn = 'Success';
  let signatureHi = 'सफलता व संतोष';
  let notSelfThemeEn = 'Bitterness';
  let notSelfThemeHi = 'कड़वाहट व उपेक्षा';

  if (definedCentersSet.size === 0) {
    energyType = 'Reflector';
    energyTypeHi = 'रिफ्लेक्टर (दर्पण / दुर्लभ चैतन्य)';
    strategyEn = 'Wait a Lunar Cycle (28.5 Days) for Clarity';
    strategyHi = 'महत्वपूर्ण निर्णयों हेतु एक चंद्र चक्र (28 दिन) का धैर्य रखें';
    signatureEn = 'Surprise & Awe';
    signatureHi = 'आश्चर्य व आनंद';
    notSelfThemeEn = 'Disappointment';
    notSelfThemeHi = 'निराशा व थकान';
  } else if (isSacralDefined) {
    if (isThroatDefined) {
      energyType = 'Manifesting Generator';
      energyTypeHi = 'मैनिफेस्टिंग जनरेटर (गतिशील निर्माता)';
      strategyEn = 'Respond to Life, then Inform before Action';
      strategyHi = 'भीतरी प्रेरणा से प्रतिक्रिया दें और कार्य से पूर्व सूचित करें';
      signatureEn = 'Satisfaction & Speed';
      signatureHi = 'संतुष्टि व तीव्र कार्य सिद्धि';
      notSelfThemeEn = 'Frustration & Anger';
      notSelfThemeHi = 'हताशा व अधीरता';
    } else {
      energyType = 'Generator';
      energyTypeHi = 'जनरेटर (सृजनशील निर्माता)';
      strategyEn = 'Wait to Respond with Gut Resonance';
      strategyHi = 'भीतरी स्वाधिष्ठान स्पंदन (Gut Feeling) से प्रतिक्रिया दें';
      signatureEn = 'Satisfaction';
      signatureHi = 'गहरी आत्म-संतुष्टि';
      notSelfThemeEn = 'Frustration';
      notSelfThemeHi = 'हताशा व ऊर्जा ह्रास';
    }
  } else if (isThroatDefined && (isSolarDefined || isHeartDefined || definedCentersSet.has('root'))) {
    energyType = 'Manifestor';
    energyTypeHi = 'मैनिफेस्टर (पहलकर्ता व सूत्रधार)';
    strategyEn = 'Inform Others Before Initiating Action';
    strategyHi = 'कदम उठाने से पहले सहयोगियों को पूर्व-सूचित करें';
    signatureEn = 'Peace';
    signatureHi = 'शांति व स्वायत्तता';
    notSelfThemeEn = 'Anger';
    notSelfThemeHi = 'क्रोध व प्रतिरोध';
  }

  // Inner Authority
  let authority: InnerAuthority = 'Emotional (Solar Plexus)';
  let authorityHi = 'भावनात्मक स्पष्टता (Solar Plexus — कभी तात्कालिक निर्णय न लें)';

  if (isSolarDefined) {
    authority = 'Emotional (Solar Plexus)';
    authorityHi = 'भावनात्मक प्रामाणिकता (लहर शांत होने पर निर्णय लें)';
  } else if (isSacralDefined) {
    authority = 'Sacral';
    authorityHi = 'स्वाधिष्ठान ध्वनि (Sacral Response — ' + (energyType === 'Generator' ? 'हूँ/ना की तात्कालिक अंतर्ध्वनि' : 'गुट स्पंदन') + ')';
  } else if (isSpleenDefined) {
    authority = 'Splenic';
    authorityHi = 'सहज अंतर्ज्ञान (Splenic — पल भर की सहज आवाज)';
  } else if (isHeartDefined) {
    authority = 'Ego / Heart';
    authorityHi = 'हृदय व संकल्प शक्ति (Ego — क्या यह मेरे सम्मान के अनुकूल है)';
  } else if (definedCentersSet.has('g_center')) {
    authority = 'Self-Projected (G-Center)';
    authorityHi = 'आत्म-प्रक्षेपित (G-Center — खुलकर बात करने से स्वतः स्पष्टता)';
  } else if (energyType === 'Reflector') {
    authority = 'Lunar (Reflector)';
    authorityHi = 'चंद्र चक्र (Lunar Cycle — 28 दिन का समय)';
  } else {
    authority = 'Environmental / Mental';
    authorityHi = 'पर्यावरणीय व मानसिक (विश्वासपात्रों के समक्ष विचार विमर्श)';
  }

  // Profile from Sun and Earth lines
  const sunGate = activeGates.find((g) => g.planetId === 'Sun') || activeGates[0];
  const earthGate = activeGates.find((g) => g.planetId === 'Earth' as any) || activeGates[1] || activeGates[0];
  const profileEn = `${sunGate.line} / ${earthGate.line}`;
  const profileNamesHi: Record<string, string> = {
    '1/3': '1/3 खोजी एवं प्रयोक्ता (Investigator / Experimenter)',
    '1/4': '1/4 खोजी एवं अवसरवादी (Investigator / Opportunist)',
    '2/4': '2/4 एकांतप्रिय एवं जन-मित्र (Hermit / Opportunist)',
    '2/5': '2/5 एकांतप्रिय एवं सार्वभौमिक मार्गदर्शक (Hermit / Heretic)',
    '3/5': '3/5 प्रयोक्ता एवं व्यावहारिक संकटमोचक (Martyr / Heretic)',
    '3/6': '3/6 प्रयोक्ता एवं आदर्श पथप्रदर्शक (Martyr / Role Model)',
    '4/6': '4/6 जन-मित्र एवं सम्मानित आदर्श (Opportunist / Role Model)',
    '5/1': '5/1 मार्गदर्शक एवं गहन शोधकर्ता (Heretic / Investigator)',
    '5/2': '5/2 मार्गदर्शक एवं स्वाभाविक प्रतिभा (Heretic / Hermit)',
    '6/2': '6/2 आदर्श मार्गदर्शक एवं एकांत प्रतिभा (Role Model / Hermit)',
    '6/3': '6/3 आदर्श व्यक्तित्व एवं कर्मठ खोजी (Role Model / Experimenter)',
  };
  const profileHi = profileNamesHi[profileEn] || `${profileEn} व्यक्तिगत जीवन प्रोफाइल`;

  const sunGateMeta = GATE_NAMES[sunGate.gateNumber] || { en: 'Light', hi: 'प्रकाश' };
  const incarnationCrossEn = `Right Angle Cross of ${sunGateMeta.en} (Gate ${sunGate.gateNumber})`;
  const incarnationCrossHi = `${sunGateMeta.hi} का चक्र (द्वार ${sunGate.gateNumber} प्रधान)`;

  return {
    energyType,
    energyTypeHi,
    strategyEn,
    strategyHi,
    signatureEn,
    signatureHi,
    notSelfThemeEn,
    notSelfThemeHi,
    authority,
    authorityHi,
    profileEn,
    profileHi,
    definitionTypeEn: definedCentersSet.size >= 5 ? 'Split Definition' : 'Single Definition',
    definitionTypeHi: definedCentersSet.size >= 5 ? 'विभाजित ऊर्जा प्रवाह (Split Definition)' : 'एकीकृत ऊर्जा प्रवाह (Single Definition)',
    centers,
    activeGates,
    incarnationCrossEn,
    incarnationCrossHi,
  };
}
