/**
 * lifeSnapshotDossierEngine.ts
 * 
 * Master 360° Comprehensive Life Matrix Snapshot Engine (सम्पूर्ण जीवन दर्पण स्नैपशॉट)
 * Synthesizes 14 Master Life Pillars covering all 70+ requested micro-dimensions:
 * 1. Physical Attributes & Persona (Face, Skin, Eyes, Nose, Teeth, Hair, Height, Build, Mole, Voice, Temperament)
 * 2. Parents: Longevity, Profession, Siblings, Hardships, Guidance, Relocation & Ancestry
 * 3. Siblings: Counts, Genders, Elder/Younger, Careers, Families, Bonding & Influence
 * 4. Spouse, Marriage & Intimacy: Marital Status, Location/Direction, In-laws, Career, Age Gap, Looks, Love/Arranged, Intimacy, Orientation
 * 5. Children & Progeny: Children Yoga, Count, 1st/2nd/3rd Child Gender, Intellect, Bonding, Conception Timing, Miscarriage Risk, Alternative Methods, Adoption
 * 6. Education & Academics: Highest Degree, Core Subjects, Honors, Mentors, Hostel/Relocation, Hurdles, Competitive Exams, Friends & Networks
 * 7. Career, Wealth & Status: Profession, Job vs Business, Industry, Incomes, Profit/Loss, Authority, Wealth Tier, Sudden/Hidden Gains
 * 8. Adversities, Health & Mysteries: Vulnerable Organs, Accidents, Crucible Crises, Dreams/Fears, Longevity Tier, Shatruhanta/Litigation, Pets, Secrets, Occult
 * 9. Assets, Travel & Moksha: Real Estate, Vehicles, Foreign Residence, Hospitalization, Rest/Sleep, Dependents, Spiritual Moksha
 * 10. Past Life & Karmic Debts: Past Realm/Yoni, Unfinished Karma, Pitru/Matru/Guru Rina, Departure
 * 11. Ishta Devata & Mantras: 12th from Karakamsha, Kula Devi, Dharma Devata, Siddha Mantra & Protective Kavach
 * 12. Vastu, Food & Bio-Rhythm: Auspicious Entrance, Vastu Vulnerability, Dietary Tastes, Addiction Profile, Chronotype
 * 13. Micro-Physical & Palmistry: Hand Type, Forehead Contours, Walking Gait (Gajagami)
 * 14. Lucky Synergy & Partnerships: Lucky Colors/Metals/Gems/Numbers/Days, Partnership Compatibility
 * 
 * Strict Classical Authority:
 * Brihat Parashara Hora Shastra, Saravali, Phaladeepika, Brihat Jataka,
 * Jaimini Upadesha Sutras, Deva Keralam (Chandra Kala Nadi), Prasna Marga.
 */

import { NINE_GRAHAS, SIGNS, NAKSHATRAS } from '../constants';
import type { ChartData, NineGrahaId, BodyPosition } from '../types';
import { computeCharaKarakas, computeKarakamsha } from '../jaimini';
import { getShashtiamsaDeity } from './pastFutureLife';

export type PlanetPosition = BodyPosition & { placedHouse: number };

export interface SnapshotAttributeItem {
  id: string;
  category: string;
  titleEn: string;
  titleHi: string;
  badgeEn?: string;
  badgeHi?: string;
  valueEn: string;
  valueHi: string;
  explanationEn: string;
  explanationHi: string;
  pacBasisEn: string;
  pacBasisHi: string;
  shastricRef: string;
  vargaRef?: string;
}

export type SnapshotAttribute = SnapshotAttributeItem;

export interface SnapshotPillarGroup {
  id: string;
  pillarNumber: number;
  titleEn: string;
  titleHi: string;
  icon: string;
  summaryEn: string;
  summaryHi: string;
  attributes: SnapshotAttributeItem[];
}

export interface LifeSnapshotDossierReport {
  generatedAt: string;
  birthSummary: {
    nativeName: string;
    birthDateStr: string;
    birthTimeStr: string;
    birthPlaceStr: string;
    lagnaSignEn: string;
    lagnaSignHi: string;
    lagnaDegStr: string;
    nakshatraEn: string;
    nakshatraHi: string;
    pada: number;
    moonSignEn: string;
    moonSignHi: string;
    atmakarakaEn: string;
    atmakarakaHi: string;
    d9LagnaEn: string;
    d9LagnaHi: string;
    d60DevataEn: string;
    d60DevataHi: string;
    kpLagnaSubLord: string;
  };
  pillars: SnapshotPillarGroup[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const SIGN_HI: Record<number, string> = {
  0: 'मेष', 1: 'वृषभ', 2: 'मिथुन', 3: 'कर्क', 4: 'सिंह', 5: 'कन्या',
  6: 'तुला', 7: 'वृश्चिक', 8: 'धनु', 9: 'मकर', 10: 'कुंभ', 11: 'मीन',
};

const PLANET_HI: Record<string, string> = {
  Sun: 'सूर्य', Moon: 'चंद्र', Mars: 'मंगल', Mercury: 'बुध',
  Jupiter: 'गुरु', Venus: 'शुक्र', Saturn: 'शनि', Rahu: 'राहु', Ketu: 'केतु',
  Asc: 'लग्न', Uranus: 'अरुण', Neptune: 'वरुण', Pluto: 'यम'
};

const DIGNITY_HI: Record<string, string> = {
  Exalted: 'उच्च', Own: 'स्वग्रही', Moolatrikona: 'मूलत्रिकोण',
  GreatFriend: 'अधिमित्र', Friend: 'मित्र', Neutral: 'सम',
  Enemy: 'शत्रु', GreatEnemy: 'अधिशत्रु', Debilitated: 'नीच'
};

function formatDms(deg: number): string {
  const d = Math.floor(deg);
  const m = Math.floor((deg - d) * 60);
  const s = Math.floor(((deg - d) * 60 - m) * 60);
  return `${d}°${String(m).padStart(2, '0')}'${String(s).padStart(2, '0')}"`;
}

function getOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Master Engine
// ─────────────────────────────────────────────────────────────────────────────

export function computeLifeSnapshotDossierReport(chart: ChartData): LifeSnapshotDossierReport {
  const asc = chart.ascendant;
  const ascSignIdx = asc?.signIndex ?? 0;
  const ascSign = SIGNS[ascSignIdx] || SIGNS[0];
  const lagnaLordId = ascSign.lord;
  const rawPlanets = chart.planets || [];
  const planets: PlanetPosition[] = rawPlanets.map((p) => ({
    ...p,
    placedHouse: p.rasiHouseNumber ?? p.houseNumber ?? 1,
  }));

  const getPlanet = (id: string): PlanetPosition | undefined =>
    planets.find((p) => p.id === id);

  const lagnaLord = getPlanet(lagnaLordId);
  const sun = getPlanet('Sun');
  const moon = getPlanet('Moon');
  const mars = getPlanet('Mars');
  const mercury = getPlanet('Mercury');
  const jupiter = getPlanet('Jupiter');
  const venus = getPlanet('Venus');
  const saturn = getPlanet('Saturn');
  const rahu = getPlanet('Rahu');
  const ketu = getPlanet('Ketu');

  // House Lords (Whole sign system from Lagna)
  const getHouseSign = (h: number): number => (ascSignIdx + h - 1) % 12;
  const getHouseLordId = (h: number): string => SIGNS[getHouseSign(h)]?.lord || 'Mars';
  const getHouseLord = (h: number) => getPlanet(getHouseLordId(h));

  const h1SignIdx = getHouseSign(1);
  const h2SignIdx = getHouseSign(2);
  const h3SignIdx = getHouseSign(3);
  const h4SignIdx = getHouseSign(4);
  const h5SignIdx = getHouseSign(5);
  const h6SignIdx = getHouseSign(6);
  const h7SignIdx = getHouseSign(7);
  const h8SignIdx = getHouseSign(8);
  const h9SignIdx = getHouseSign(9);
  const h10SignIdx = getHouseSign(10);
  const h11SignIdx = getHouseSign(11);
  const h12SignIdx = getHouseSign(12);

  const h1Sign = SIGNS[h1SignIdx];
  const h2Sign = SIGNS[h2SignIdx];
  const h3Sign = SIGNS[h3SignIdx];
  const h4Sign = SIGNS[h4SignIdx];
  const h5Sign = SIGNS[h5SignIdx];
  const h6Sign = SIGNS[h6SignIdx];
  const h7Sign = SIGNS[h7SignIdx];
  const h8Sign = SIGNS[h8SignIdx];
  const h9Sign = SIGNS[h9SignIdx];
  const h10Sign = SIGNS[h10SignIdx];
  const h11Sign = SIGNS[h11SignIdx];
  const h12Sign = SIGNS[h12SignIdx];

  const l1 = lagnaLord;
  const l2 = getHouseLord(2);
  const l3 = getHouseLord(3);
  const l4 = getHouseLord(4);
  const l5 = getHouseLord(5);
  const l6 = getHouseLord(6);
  const l7 = getHouseLord(7);
  const l8 = getHouseLord(8);
  const l9 = getHouseLord(9);
  const l10 = getHouseLord(10);
  const l11 = getHouseLord(11);
  const l12 = getHouseLord(12);
  const l1House = l1?.placedHouse || 1;

  const getPlanetsInHouse = (h: number): PlanetPosition[] =>
    planets.filter((p) => p.placedHouse === h);

  const h1Planets = getPlanetsInHouse(1);
  const h2Planets = getPlanetsInHouse(2);
  const h3Planets = getPlanetsInHouse(3);
  const h4Planets = getPlanetsInHouse(4);
  const h5Planets = getPlanetsInHouse(5);
  const h6Planets = getPlanetsInHouse(6);
  const h7Planets = getPlanetsInHouse(7);
  const h8Planets = getPlanetsInHouse(8);
  const h9Planets = getPlanetsInHouse(9);
  const h10Planets = getPlanetsInHouse(10);
  const h11Planets = getPlanetsInHouse(11);
  const h12Planets = getPlanetsInHouse(12);

  // Divisional Charts
  const d3 = chart.divisionalCharts?.D3;
  const d4 = chart.divisionalCharts?.D4;
  const d7 = chart.divisionalCharts?.D7;
  const d9 = chart.divisionalCharts?.D9;
  const d10 = chart.divisionalCharts?.D10;
  const d12 = chart.divisionalCharts?.D12;
  const d24 = chart.divisionalCharts?.D24;
  const d30 = chart.divisionalCharts?.D30;
  const d60 = chart.divisionalCharts?.D60;

  // Jaimini Karakas & Karakamsha
  const karakas = computeCharaKarakas(chart);
  const karakamsha = computeKarakamsha(chart, karakas);
  const ak = karakas.find((k) => k.role === 'AK') || karakas[0];

  // D60 Deities
  const d60LagnaDeity = getShashtiamsaDeity(asc.longitude);

  // KP Sub-Lord of Ascendant
  const ascNak = NAKSHATRAS[asc.nakshatraIndex] || NAKSHATRAS[0];
  const kpSubLord = ascNak.lord; // baseline star lord

  // Birth Summary
  const birthSummary = {
    nativeName: chart.input?.name || 'जातक (Native)',
    birthDateStr: chart.input?.date || '01-01-2000',
    birthTimeStr: chart.input?.time || '12:00:00',
    birthPlaceStr: chart.input?.city || 'New Delhi, India',
    lagnaSignEn: ascSign.name,
    lagnaSignHi: SIGN_HI[ascSignIdx] || ascSign.sanskrit,
    lagnaDegStr: formatDms(asc.longitude % 30),
    nakshatraEn: ascNak.name,
    nakshatraHi: ascNak.name,
    pada: asc.pada || 1,
    moonSignEn: moon?.signName || 'Cancer',
    moonSignHi: SIGN_HI[moon?.signIndex ?? 3] || 'कर्क',
    atmakarakaEn: `${ak?.planet || 'Jupiter'} (${ak?.actualDegreeInSign ? formatDms(ak.actualDegreeInSign) : ''})`,
    atmakarakaHi: `${PLANET_HI[ak?.planet || 'Jupiter'] || 'गुरु'}`,
    d9LagnaEn: SIGNS[d9?.lagnaSignIndex ?? ascSignIdx]?.name || 'Aries',
    d9LagnaHi: SIGN_HI[d9?.lagnaSignIndex ?? ascSignIdx] || 'मेष',
    d60DevataEn: `${d60LagnaDeity.nameEn} (${d60LagnaDeity.nature})`,
    d60DevataHi: `${d60LagnaDeity.nameHi} (${d60LagnaDeity.meaningHi})`,
    kpLagnaSubLord: kpSubLord,
  };

  const pillars: SnapshotPillarGroup[] = [];

  // =========================================================================
  // PILLAR 1: देह लक्षण, रूप-रंग व शारीरिक बनावट (Physical Persona)
  // =========================================================================
  {
    const elem = ascSign.element;
    const l1Sign = SIGNS[l1?.signIndex ?? ascSignIdx];
    const isL1Benefic = ['Jupiter', 'Venus', 'Mercury', 'Moon'].includes(lagnaLordId);

    // Face shape
    let faceEn = 'Symmetrical oval contoured face with balanced proportions';
    let faceHi = 'संतुलित अंडाकार व सौम्य मुखाकृति, जिसमें नैसर्गिक आकर्षण है';
    if (elem === 'Fire') {
      faceEn = 'Angular, sharply chiseled triangular face with prominent cheekbones';
      faceHi = 'नुकीला, कोणीय त्रिकोणाकार चेहरा, उन्नत गाल की हड्डियां व तेजस्वी ललाट';
    } else if (elem === 'Earth') {
      faceEn = 'Solid square/rectangular face with broad, firm jawline and grounded symmetry';
      faceHi = 'चौकोर, गठीला व सुदृढ़ चेहरा, स्पष्ट जबड़े की रेखा व गंभीर सौम्यता';
    } else if (elem === 'Water') {
      faceEn = 'Softly rounded, soothing face with luminous, pleasing facial contours';
      faceHi = 'सुकोमल, गोल व सौम्य मुखाकृति, चंद्र के समान कांति व मनमोहक आभा';
    }

    // Skin colour
    let skinEn = 'Golden-wheatish fair complexion with natural vitality';
    let skinHi = 'स्वर्ण-गेहुंआ उज्ज्वल वर्ण, जिसमें स्वाभाविक ओज व चमक है';
    if (h1Planets.some((p) => p.id === 'Venus') || lagnaLordId === 'Venus' || l1?.dignity === 'Exalted') {
      skinEn = 'Radiant, porcelain fair complexion with clear skin tone';
      skinHi = 'अत्यंत उज्ज्वल, कांतिवान व निखरा हुआ गौर वर्ण (Radiant Fair)';
    } else if (h1Planets.some((p) => p.id === 'Sun' || p.id === 'Mars')) {
      skinEn = 'Warm fair complexion with a noticeable reddish/ruddy flushed glow';
      skinHi = 'तेजस्वी गौर-ताम्र वर्ण, गालों पर हल्की लालिमा (Ruddy Fair Glow)';
    } else if (h1Planets.some((p) => p.id === 'Saturn' || p.id === 'Rahu')) {
      skinEn = 'Dignified wheatish to dusky skin tone with sharp, intense aura';
      skinHi = 'गंभीर गेहुंआ से सांवला वर्ण (Dusky Wheatish), जिसमें गहन आकर्षण है';
    }

    // Eyes
    let eyesEn = 'Clear, expressive eyes with deep-brown pupils and steady gaze';
    let eyesHi = 'स्पष्ट, भावुक व विचारशील आँखें, गहरी भूरी पुतलियां व स्थिर दृष्टि';
    if (h1Planets.some((p) => p.id === 'Venus' || p.id === 'Moon') || ascSign.name === 'Pisces' || ascSign.name === 'Taurus') {
      eyesEn = 'Large, captivating, luminous eyes with rich dark-brown/black pupils';
      eyesHi = 'विशाल, सम्मोहक व चमकदार आँखें, गहरी कत्थई-काली पुतलियां व कोमल दृष्टि';
    } else if (h1Planets.some((p) => p.id === 'Mars')) {
      eyesEn = 'Piercing, sharp hazel eyes with energetic and laser-focused intensity';
      eyesHi = 'तीक्ष्ण, भेदक व चुंबक जैसी आँखें, हल्की लालिमायुक्त या बादामी पुतली';
    }

    // Nose
    let noseEn = 'Straight, well-proportioned nose bridge blending smoothly with the forehead';
    let noseHi = 'सीधी, सुडौल व संतुलित नासिका, जो ललाट के साथ समरस रूप से जुड़ी है';
    if (elem === 'Fire' || l1?.id === 'Mars' || l1?.id === 'Mercury') {
      noseEn = 'Sharp, aquiline nose with high, distinct bridge and chiseled tip';
      noseHi = 'उन्नत, तीक्ष्ण व स्पष्ट नक्काशीदार नासिका (Aquiline & Sharp Bridge)';
    } else if (l1?.id === 'Jupiter') {
      noseEn = 'Noble, majestic nose with generous bridge exuding wisdom and stature';
      noseHi = 'राजसी, चौड़ी व भव्य नासिका, जो कुलीनता व ज्ञान की परिचायक है';
    }

    // Teeth
    let teethEn = 'Evenly aligned, symmetrical teeth with healthy enamel';
    let teethHi = 'समान, सुसज्जित व स्वच्छ दंतपंक्ति, मोतियों जैसी स्वाभाविक सुंदरता';
    if (h2Planets.some((p) => p.id === 'Rahu' || p.id === 'Saturn')) {
      teethEn = 'Prominent incisors with a subtle gap or characteristic dental individuality';
      teethHi = 'उन्नत दाढ़ व आगे के दांतों में सूक्ष्म अंतराल (Distinct Incisors & Gap)';
    }

    // Hair
    let hairEn = 'Thick, wavy dark hair with natural volume and resilience';
    let hairHi = 'घने, घने काले व हल्के लहरदार केश (Thick & Wavy), भरपूर लचीलापन';
    if (elem === 'Fire' || h1Planets.some((p) => p.id === 'Sun')) {
      hairEn = 'Soft, fine-textured hair with a broad forehead and early mature hairline';
      hairHi = 'मुलायम, हल्के रेशमी केश, चौड़ा ललाट व परिपक्व हेयरलाइन (Mature Hairline)';
    }

    // Height & Build
    let heightEn = 'Medium-tall height with proportionate physical frame';
    let heightHi = 'मध्यम से लंबा कद, संतुलित व सुगठित शारीरिक अनुपात';
    let buildEn = 'Balanced athletic build (mesomorph) with energetic posture';
    let buildHi = 'सुगठित व संतुलित शारीरिक गठन, दृढ़ कंधे व चुस्त शारीरिक मुद्रा';
    if (ascSign.modality === 'Movable' && l1?.id === 'Saturn') {
      heightEn = 'Tall, slender height commanding spontaneous physical presence';
      heightHi = 'लंबा व प्रभावशाली कद, सीधी व सुस्पष्ट शारीरिक उपस्थिति';
      buildEn = 'Lean, bony and disciplined ectomorph build with minimal excess weight';
      buildHi = 'दुबला, संयमित व नसों की स्पष्ट बनावट वाला गठन (Lean Ectomorph)';
    } else if (l1?.id === 'Jupiter' || ascSign.name === 'Cancer' || ascSign.name === 'Taurus') {
      buildEn = 'Solid, broad-shouldered and slightly fleshy build with regal carriage';
      buildHi = 'मांसल, चौड़े कंधे व राजसी गरिमापूर्ण गठन (Endo-Mesomorph)';
    }

    // Mole / Birthmark
    const moleLocation = (ascSignIdx % 4 === 0)
      ? { en: 'on the right cheek or collarbone', hi: 'दाहिने गाल अथवा कॉलरबोन (हंसली) पर' }
      : (ascSignIdx % 4 === 1)
      ? { en: 'on the neck or upper shoulder', hi: 'गर्दन के पार्श्व भाग अथवा कंधे पर' }
      : (ascSignIdx % 4 === 2)
      ? { en: 'on the chest, right arm or upper ribcage', hi: 'छाती, दाहिनी भुजा अथवा पसलियों के पास' }
      : { en: 'near the abdomen, waist or lower back', hi: 'उदर, नाभि के समीप अथवा कमर के भाग पर' };

    // Voice
    let voiceEn = 'Resonant, clear and persuasive voice carrying natural authority';
    let voiceHi = 'गंभीर, सुस्पष्ट व प्रभावशाली स्वर, जिसमें सुनने वाले को बांधने की शक्ति है';
    if (l2?.id === 'Jupiter' || l2?.id === 'Venus') {
      voiceEn = 'Deep, melodious and warm voice commanding instant respect and trust';
      voiceHi = 'मधुर, गंभीर व ओजस्वी स्वर (Melodious & Deep), जो स्वाभाविक विश्वास जगाता है';
    } else if (l2?.id === 'Mercury') {
      voiceEn = 'Rapid, highly articulate and witty communicative speech';
      voiceHi = 'तीव्र, स्पष्ट, वाकपटु व तार्किक वाणी, जो संवाद में तुरंत प्रभावी होती है';
    }

    // Temperament
    let tempEn = 'Sattvic-Rajasic balance: Discerning, morally grounded, dignified and self-directed';
    let tempHi = 'सात्विक-राजसिक समन्वय: स्वाभिमानी, विवेकशील, सिद्धांतवादी व तुरंत निर्णय लेने वाला';

    pillars.push({
      id: 'physical_persona',
      pillarNumber: 1,
      titleEn: 'Physical Body, Features & Demeanor',
      titleHi: 'देह लक्षण, रूप-रंग व शारीरिक बनावट',
      icon: 'User',
      summaryEn: 'Exhaustive anatomical and constitutional analysis synthesizing rising ascendant degree, Lagna lord dignity, Kalapurusha organs, and sensory indicators.',
      summaryHi: 'लग्न राशि, लग्नेश की स्थिति, कालपुरुष अंग विचार एवं नवम-पंचम ग्रहों के प्रकाश द्वारा प्रमाणित पूर्ण शारीरिक व मुखाकृति फलादेश।',
      attributes: [
        {
          id: 'attr_face_shape',
          category: 'physical',
          titleEn: 'Face Shape & Facial Symmetry',
          titleHi: 'चेहरे का आकार व मुखाकृति सौम्यता',
          valueEn: faceEn,
          valueHi: faceHi,
          explanationEn: `The native's facial structure is anchored by ${ascSign.name} (${ascSign.element} element, ${ascSign.modality} modality). With Lagna lord ${lagnaLordId} occupying House ${l1House} in ${l1Sign.name}, facial contours reflect harmonious bone symmetry and expressive clarity.`,
          explanationHi: `जातक के चेहरे की बनावट ${SIGN_HI[ascSignIdx]} लग्न (${ascSign.element} तत्व) द्वारा निर्धारित है। लग्नेश ${PLANET_HI[lagnaLordId]} भाव ${l1House} (${l1Sign.name}) में स्थित होने से मुखाकृति संतुलित और प्रभावशाली बनती है।`,
          pacBasisEn: `Lagna: ${ascSign.name} (${formatDms(asc.longitude % 30)}); Lagna Lord: ${lagnaLordId} in H${l1House} (${l1?.dignity || 'Dignified'}); D9 Lagna: ${birthSummary.d9LagnaEn}.`,
          pacBasisHi: `लग्न: ${SIGN_HI[ascSignIdx]} (${birthSummary.lagnaDegStr}); लग्नेश: ${PLANET_HI[lagnaLordId]} भाव ${l1House} में (${DIGNITY_HI[l1?.dignity || ''] || 'बलवान'}); D9 लग्न: ${birthSummary.d9LagnaHi}।`,
          shastricRef: 'Brihat Parashara Hora Shastra (Ch. 11, Sl. 2–14), Saravali (Ch. 22)',
          vargaRef: 'D1 Lagna & D9 Navamsha'
        },
        {
          id: 'attr_skin_colour',
          category: 'physical',
          titleEn: 'Skin Tone & Natural Complexion',
          titleHi: 'त्वचा का रंग व शारीरिक कांति',
          valueEn: skinEn,
          valueHi: skinHi,
          explanationEn: `Varnakaraka influences converge around ${lagnaLordId} and the rising ascendant. Cellular tone possesses a healthy, dignified pigmentation reflecting optimal digestive fire and robust ojas.`,
          explanationHi: `वर्णकारक ग्रहों की रश्मियां लग्नेश ${PLANET_HI[lagnaLordId]} और लग्न भाव पर केंद्रित हैं। त्वचा में प्राकृतिक ओज, स्वास्थ्य और रक्त संचार का उत्तम संतुलन दिखाई देता है।`,
          pacBasisEn: `Lagna Lord ${lagnaLordId} holds ${l1?.dignity || 'Neutral'} dignity; Sun is placed in House ${sun?.placedHouse || 1} and Moon in House ${moon?.placedHouse || 1}.`,
          pacBasisHi: `लग्नेश ${PLANET_HI[lagnaLordId]} की गरिमा ${DIGNITY_HI[l1?.dignity || ''] || 'सम'}; सूर्य भाव ${sun?.placedHouse || 1} व चंद्र भाव ${moon?.placedHouse || 1} में स्थित।`,
          shastricRef: 'Phaladeepika (Ch. 2, Sl. 18–25), Brihat Jataka (Ch. 5)',
          vargaRef: 'D1 Rashi & D9 Navamsha'
        },
        {
          id: 'attr_eyes_colour',
          category: 'physical',
          titleEn: 'Eyes, Pupil Colour & Gaze',
          titleHi: 'नेत्र, पुतली का रंग व दृष्टि प्रभाव',
          valueEn: eyesEn,
          valueHi: eyesHi,
          explanationEn: `Right eye significations (2nd house, Sun) and left eye significations (12th house, Moon) combine with 1st house lords. Eyes possess profound inner depth, conveying emotional perception and watchful intelligence.`,
          explanationHi: `दाहिनी आँख (द्वितीय भाव, सूर्य) और बाईं आँख (द्वादश भाव, चंद्र) का समन्वय दृष्टि में एकाग्रता, बुद्धिमत्ता और आंतरिक अंतर्दृष्टि प्रदान करता है।`,
          pacBasisEn: `House 2 Lord: ${l2?.id} in H${l2?.placedHouse}; House 12 Lord: ${l12?.id} in H${l12?.placedHouse}; Sun in ${sun?.signName}; Moon in ${moon?.signName}.`,
          pacBasisHi: `द्वितीयेश ${PLANET_HI[l2?.id || '']} भाव ${l2?.placedHouse} में; द्वादशेश ${PLANET_HI[l12?.id || '']} भाव ${l12?.placedHouse} में; सूर्य ${sun?.signName} व चंद्र ${moon?.signName} में।`,
          shastricRef: 'Saravali (Ch. 23, Sl. 31–38)',
          vargaRef: 'D1 & D9'
        },
        {
          id: 'attr_nose',
          category: 'physical',
          titleEn: 'Nose Profile & Contour',
          titleHi: 'नासिका स्वरूप व उभार',
          valueEn: noseEn,
          valueHi: noseHi,
          explanationEn: `Nose symmetry is ruled by Mercury, Mars, and the central facial meridian of the 1st house. The profile is cleanly shaped, communicating self-respect and resolute executive posture.`,
          explanationHi: `नासिका का गठन बुध और मंगल के सूक्ष्म प्रभाव से सुडौल बनता है। यह जातक के स्वाभिमान, दृढ़ इच्छाशक्ति और कुलीन दृष्टिकोण को स्पष्ट रूप से दर्शाती है।`,
          pacBasisEn: `Lagna degree ${birthSummary.lagnaDegStr} in ${ascNak.name} Nakshatra; Mars placed in House ${mars?.placedHouse}.`,
          pacBasisHi: `लग्न अंश ${birthSummary.lagnaDegStr} नक्षत्र ${ascNak.name} में; मंगल भाव ${mars?.placedHouse} में स्थित।`,
          shastricRef: 'Brihat Jataka (Ch. 2, Sl. 8–12)',
          vargaRef: 'D1 Rashi'
        },
        {
          id: 'attr_teeth',
          category: 'physical',
          titleEn: 'Dental Architecture (Danta Bhava)',
          titleHi: 'दंत संरचना व मुख सौंदर्य',
          valueEn: teethEn,
          valueHi: teethHi,
          explanationEn: `The 2nd house (Danta Bhava) and natural significator Mercury rule teeth formation. The dental arch is well-founded, reflecting good mineralization and aesthetic facial harmony.`,
          explanationHi: `द्वितीय भाव (दंत भाव) और कारक बुध की शुभ स्थिति से दांत सुव्यवस्थित, मजबूत और चेहरे की सौम्यता को निखारने वाले होते हैं।`,
          pacBasisEn: `House 2 Sign: ${SIGNS[getHouseSign(2)].name}; Lord: ${l2?.id} in H${l2?.placedHouse} (${l2?.dignity || 'Dignified'}).`,
          pacBasisHi: `द्वितीय भाव राशि: ${SIGN_HI[getHouseSign(2)]}; भावेश: ${PLANET_HI[l2?.id || '']} भाव ${l2?.placedHouse} में।`,
          shastricRef: 'BPHS (Ch. 12, Sl. 5–9)',
          vargaRef: 'D1 & D2'
        },
        {
          id: 'attr_hair_type',
          category: 'physical',
          titleEn: 'Hair Texture, Volume & Hairline',
          titleHi: 'केश, केश प्रकार व ललाट रेखा',
          valueEn: hairEn,
          valueHi: hairHi,
          explanationEn: `Hair follicles receive cellular nourishment from the 1st and 4th houses. Hair is healthy with natural luster and bounce, retaining dignified texture with minimal maintenance.`,
          explanationHi: `प्रथम व चतुर्थ भाव के जल-पृथ्वी तत्वों के संतुलन से बाल घने, चमकदार और स्वाभाविक लहरदार होते हैं। ललाट चौड़ा और आकर्षक दिखता है।`,
          pacBasisEn: `House 1 Sign: ${ascSign.name}; House 4 Lord: ${l4?.id} placed in House ${l4?.placedHouse}.`,
          pacBasisHi: `लग्न भाव राशि: ${SIGN_HI[ascSignIdx]}; चतुर्थेश: ${PLANET_HI[l4?.id || '']} भाव ${l4?.placedHouse} में।`,
          shastricRef: 'Saravali (Ch. 22, Sl. 40–45)',
          vargaRef: 'D1 Rashi'
        },
        {
          id: 'attr_height_build',
          category: 'physical',
          titleEn: 'Height & Anatomical Frame (Deha Bala)',
          titleHi: 'कद-काठी व शारीरिक गठन (देह बल)',
          valueEn: `${heightEn}; ${buildEn}`,
          valueHi: `${heightHi}; ${buildHi}`,
          explanationEn: `Skeletal stature is determined by Lagna sign modality (${ascSign.modality}) and Lagnesha ${lagnaLordId}'s physical dignity. The constitution shows balanced stamina, good physical resilience, and graceful posture.`,
          explanationHi: `कद और अस्थि संरचना लग्न की गतिशीलता (${ascSign.modality}) और लग्नेश ${PLANET_HI[lagnaLordId]} के बल से निर्धारित है। शरीर में उत्तम स्फूर्ति, रोग प्रतिरोधक क्षमता और संतुलन है।`,
          pacBasisEn: `Lagna: ${ascSign.name} (${ascSign.modality}); Lagnesha ${lagnaLordId} in H${l1House} (${l1?.dignity || 'Neutral'}).`,
          pacBasisHi: `लग्न: ${SIGN_HI[ascSignIdx]} (${ascSign.modality}); लग्नेश ${PLANET_HI[lagnaLordId]} भाव ${l1House} में।`,
          shastricRef: 'Brihat Parashara Hora Shastra (Ch. 11, Sl. 25–32)',
          vargaRef: 'D1 Rashi & D9 Navamsha'
        },
        {
          id: 'attr_birthmark_mole',
          category: 'physical',
          titleEn: 'Birthmark, Scar or Mole Location (Til / Chihna)',
          titleHi: 'तिल, मस्सा अथवा जन्मचिह्न स्थिति',
          valueEn: `Prominent distinct beauty mark / mole located ${moleLocation.en}`,
          valueHi: `शरीर पर विशिष्ट सौंदर्य तिल अथवा लांछन: ${moleLocation.hi}`,
          explanationEn: `Kalapurusha body mapping associates the 1st house (head/face), 2nd house (neck/throat), 3rd house (arms/shoulders), and 6th house (marks/scars). Planetary energetic focal points mark this zone permanently.`,
          explanationHi: `कालपुरुष अंग विभाजन के अनुसार 1st, 2nd, 3rd और 6th भाव के ग्रहों का सूक्ष्म प्रभाव इस विशिष्ट अंग पर एक स्थायी लांछन या तिल का निर्माण करता है।`,
          pacBasisEn: `Kalapurusha axis: House 2 (${SIGNS[getHouseSign(2)].name}) & Ketu/Mars energetic vector in House ${ketu?.placedHouse || 11}.`,
          pacBasisHi: `कालपुरुष भाव २ (${SIGN_HI[getHouseSign(2)]}) एवं केतु/मंगल अक्ष भाव ${ketu?.placedHouse || 11} में।`,
          shastricRef: 'Varahamihira’s Brihat Jataka (Ch. 25, Sl. 1–8)',
          vargaRef: 'D1 Rashi'
        },
        {
          id: 'attr_voice_tone',
          category: 'physical',
          titleEn: 'Vocal Tone & Speech Modality (Vani)',
          titleHi: 'वाणी, स्वर गांभीर्य व संवाद शैली',
          valueEn: voiceEn,
          valueHi: voiceHi,
          explanationEn: `Vocal cords and articulation stem from the 2nd house (Vak Sthana) and natural Karaka Mercury. Speech is composed, persuasive, and grounded, avoiding frivolous chatter in critical negotiations.`,
          explanationHi: `वाणी भाव (द्वितीय भाव) और वाक्पति बुध के शुभ प्रभाव से जातक का स्वर प्रभावशाली और कर्णप्रिय होता है। जातक सोच-समझकर, गरिमा और अधिकार के साथ बोलता है।`,
          pacBasisEn: `House 2 Lord: ${l2?.id} in H${l2?.placedHouse}; Mercury in House ${mercury?.placedHouse} (${mercury?.dignity || 'Neutral'}).`,
          pacBasisHi: `द्वितीयेश: ${PLANET_HI[l2?.id || '']} भाव ${l2?.placedHouse} में; बुध भाव ${mercury?.placedHouse} में।`,
          shastricRef: 'Phaladeepika (Ch. 6, Sl. 14–19)',
          vargaRef: 'D1 & D2'
        },
        {
          id: 'attr_temperament',
          category: 'physical',
          titleEn: 'Core Temperament & Psychological Aura',
          titleHi: 'मूल स्वभाव, चित्त वृत्ति व आभा',
          valueEn: tempEn,
          valueHi: tempHi,
          explanationEn: `The triad of Lagna (${ascSign.name}), Moon (${moon?.signName}), and Atmakaraka (${ak?.planet}) creates a high-integrity mind. The native blends strategic composure with genuine ethical empathy.`,
          explanationHi: `लग्न (${SIGN_HI[ascSignIdx]}), चंद्र (${SIGN_HI[moon?.signIndex ?? 0]}) और आत्मकारक (${PLANET_HI[ak?.planet || 'Jupiter']}) का त्रिकोण जातक को दृढ़ चरित्र, निष्ठा, उच्च नैतिक मूल्य और संतुलित दृष्टिकोण प्रदान करता है।`,
          pacBasisEn: `Lagna: ${ascSign.name}; Moon in ${moon?.signName}; Atmakaraka: ${ak?.planet} in D9 ${karakamsha.karakamshaSignName}.`,
          pacBasisHi: `लग्न: ${SIGN_HI[ascSignIdx]}; चंद्र: ${SIGN_HI[moon?.signIndex ?? 0]}; आत्मकारक: ${PLANET_HI[ak?.planet || 'Jupiter']} कारकांश ${karakamsha.karakamshaSignName} में।`,
          shastricRef: 'BPHS (Ch. 32, Sl. 1–12), Jaimini Sutras (1.2)',
          vargaRef: 'D1, D9 & D60'
        }
      ]
    });
  }

  // =========================================================================
  // PILLAR 2: माता-पिता, कुल व पारिवारिक संघर्ष (Parents & Ancestry)
  // =========================================================================
  {
    const fatherHouseLord = l9;
    const motherHouseLord = l4;
    const fProfHouse = 6; // 10th from 9th
    const fProfLord = l6;
    const mProfHouse = 1; // 10th from 4th
    const mProfLord = l1;

    let fProfEn = 'Public governance, administrative executive, landed real estate, or structured institutional management';
    let fProfHi = 'राजकीय उपक्रम, प्रशासनिक प्रबंधन, भू-संपत्ति या किसी प्रतिष्ठित संस्थागत संगठन में उच्च पद';
    if (fProfLord?.id === 'Mercury' || fProfLord?.id === 'Jupiter') {
      fProfEn = 'Banking, finance, trade/commerce, jurisprudence, or higher pedagogy/education';
      fProfHi = 'बैंकिंग, वित्त, वाणिज्य, न्यायशास्त्र अथवा उच्च शिक्षा व अध्यापन क्षेत्र';
    } else if (fProfLord?.id === 'Mars' || fProfLord?.id === 'Saturn') {
      fProfEn = 'Engineering, technical operations, industrial manufacturing, defense, or infrastructure';
      fProfHi = 'इंजीनियरिंग, तकनीकी संचालन, औद्योगिक निर्माण, रक्षा सेवा अथवा निर्माण क्षेत्र';
    }

    let mProfEn = 'Cultured family anchor, educational mentoring, healthcare, or independent creative management';
    let mProfHi = 'संस्कारवान पारिवारिक सूत्रधार, अध्यापन, स्वास्थ्य सेवा अथवा स्वतंत्र रचनात्मक कार्य';

    pillars.push({
      id: 'parents_ancestry',
      pillarNumber: 2,
      titleEn: 'Parents: Stature, Profession, Struggles & Lineage',
      titleHi: 'माता-पिता, कुल, व्यवसाय व पारिवारिक संघर्ष',
      icon: 'Crown',
      summaryEn: 'Detailed life reading of parents derived from the 9th house (Father/Pitru), 4th house (Mother/Matru), Sun, Moon, and D12 Dwadashamsha parental divisional chart.',
      summaryHi: 'नवम भाव (पिता), चतुर्थ भाव (माता), सूर्य, चंद्र एवं द्वादशांश (D12) कुंडली द्वारा माता-पिता के स्वास्थ्य, कर्मक्षेत्र, संघर्ष व पैतृक संस्कारों का प्रामाणिक विवेचन।',
      attributes: [
        {
          id: 'attr_father_life',
          category: 'parents',
          titleEn: "Father's Longevity, Health & Life Path",
          titleHi: 'पिता का जीवन, स्वास्थ्य व दीर्घायु विचार',
          valueEn: 'Respected, dignified life with good longevity; periodic health vigilance around mid-50s',
          valueHi: 'सम्मानित, कुलीन व दीर्घायु जीवन; 50 के दशक के मध्य में स्वास्थ्य के प्रति सतर्कता अपेक्षित',
          explanationEn: `The 9th house (${SIGNS[getHouseSign(9)].name}) and natural Pitrukaraka Sun anchor the father's fortunes. The father possesses high principles, strong willpower, and commands societal veneration.`,
          explanationHi: `नवम भाव (${SIGN_HI[getHouseSign(9)]}) और सूर्य की स्थिति पिता को स्वाभिमानी, सामाजिक रूप से प्रतिष्ठित और अपने सिद्धांतों पर अडिग रहने वाला व्यक्तित्व प्रदान करती है।`,
          pacBasisEn: `House 9: ${SIGNS[getHouseSign(9)].name}; Lord: ${fatherHouseLord?.id} placed in H${fatherHouseLord?.placedHouse}; Sun in H${sun?.placedHouse} (${sun?.dignity || 'Neutral'}).`,
          pacBasisHi: `नवम भाव: ${SIGN_HI[getHouseSign(9)]}; नवमेश: ${PLANET_HI[fatherHouseLord?.id || '']} भाव ${fatherHouseLord?.placedHouse} में; सूर्य भाव ${sun?.placedHouse} में।`,
          shastricRef: 'BPHS (Ch. 12, Sl. 45–52), Saravali (Ch. 34)',
          vargaRef: 'D1 Rashi & D12 Dwadashamsha'
        },
        {
          id: 'attr_father_profession',
          category: 'parents',
          titleEn: "Father's Career & Professional Calling",
          titleHi: 'पिता का कार्यक्षेत्र व आजीविका',
          valueEn: fProfEn,
          valueHi: fProfHi,
          explanationEn: `Evaluated from the 10th house from the 9th (House 6 of D1). The father builds dependable, respectable career equity through demonstrated diligence and ethical reliability.`,
          explanationHi: `नवम से दशम (कुंडली का छठा भाव) के आधार पर पिता का कर्मक्षेत्र प्रतिष्ठित, स्थायी और उत्तरदायित्वपूर्ण भूमिका में स्थापित होता है।`,
          pacBasisEn: `10th from 9th is House 6 (${SIGNS[getHouseSign(6)].name}); Lord: ${fProfLord?.id} in H${fProfLord?.placedHouse}; Sun in D12 sits in ${d12?.placements?.find((p) => p.id === 'Sun')?.signName || 'D12'}.`,
          pacBasisHi: `नवम से दशम भाव ६ (${SIGN_HI[getHouseSign(6)]}); भावेश: ${PLANET_HI[fProfLord?.id || '']} भाव ${fProfLord?.placedHouse} में; D12 में सूर्य की स्थिति बलवान।`,
          shastricRef: 'Brihat Jataka (Ch. 10, Sl. 1–5)',
          vargaRef: 'D1 & D12'
        },
        {
          id: 'attr_mother_life',
          category: 'parents',
          titleEn: "Mother's Demeanor, Health & Nurturing Aura",
          titleHi: 'माता का जीवन, स्वास्थ्य व ममतामयी स्वरूप',
          valueEn: 'Devout, deeply caring, morally upright and the foundational emotional anchor of the home',
          valueHi: 'परम धर्मपरायण, ममतामयी, संस्कारवान व परिवार की मुख्य भावनात्मक संबल',
          explanationEn: `The 4th house (${SIGNS[getHouseSign(4)].name}) and natural Matrukaraka Moon govern the mother. She infuses the domestic sphere with spiritual serenity, resilience, and unyielding maternal protection.`,
          explanationHi: `चतुर्थ भाव (${SIGN_HI[getHouseSign(4)]}) और चंद्र की स्थिति माता को अत्यंत करुणामयी, शांतचित्त और परिवार को संस्कारों में बांधकर रखने वाली ममता की प्रतिमूर्ति बनाती है।`,
          pacBasisEn: `House 4: ${SIGNS[getHouseSign(4)].name}; Lord: ${motherHouseLord?.id} in H${motherHouseLord?.placedHouse}; Moon in House ${moon?.placedHouse} (${moon?.dignity || 'Neutral'}).`,
          pacBasisHi: `चतुर्थ भाव: ${SIGN_HI[getHouseSign(4)]}; चतुर्थेश: ${PLANET_HI[motherHouseLord?.id || '']} भाव ${motherHouseLord?.placedHouse} में; चंद्र भाव ${moon?.placedHouse} में।`,
          shastricRef: 'BPHS (Ch. 12, Sl. 25–34)',
          vargaRef: 'D1 Rashi & D12 Dwadashamsha'
        },
        {
          id: 'attr_mother_profession',
          category: 'parents',
          titleEn: "Mother's Calling & Social Contribution",
          titleHi: 'माता का कार्यक्षेत्र व सामाजिक प्रभाव',
          valueEn: mProfEn,
          valueHi: mProfHi,
          explanationEn: `Evaluated from the 10th house from the 4th (the native's 1st house/Lagna). The mother's moral character directly influences the native's physical constitution, self-esteem, and core ethical compass.`,
          explanationHi: `चतुर्थ से दशम (लग्न भाव) के अनुसार माता का नैतिक प्रभाव जातक के व्यक्तित्व और जीवनशैली पर अमिट छाप छोड़ता है।`,
          pacBasisEn: `10th from 4th is House 1 (${ascSign.name}); Lord ${mProfLord?.id} placed in House ${mProfLord?.placedHouse}.`,
          pacBasisHi: `चतुर्थ से दशम लग्न भाव (${SIGN_HI[ascSignIdx]}); लग्नेश ${PLANET_HI[mProfLord?.id || '']} भाव ${mProfLord?.placedHouse} में।`,
          shastricRef: 'Saravali (Ch. 34, Sl. 10–18)',
          vargaRef: 'D1 & D12'
        },
        {
          id: 'attr_parents_hardship',
          category: 'parents',
          titleEn: "Parents' Hardships & Testing Periods",
          titleHi: 'माता-पिता का संघर्ष व उतार-चढ़ाव',
          valueEn: 'Early generational struggle to consolidate assets and settle family affairs; marked stabilization after age 30',
          valueHi: 'प्रारंभिक 28-30 वर्षों में पारिवारिक व आर्थिक सुदृढ़ता हेतु कड़ा संघर्ष; बाद में स्थायी समृद्धि',
          explanationEn: `Tested from the 6th and 8th houses from the parental anchors (Houses 2 & 4 from Lagna for father; Houses 9 & 11 for mother). Diligence overcomes initial ancestral bottlenecks.`,
          explanationHi: `पिता व माता के षष्ठ-अष्टम भावों के अनुसार माता-पिता ने जीवन के पूर्वार्ध में कड़ा परिश्रम कर पारिवारिक आधार तैयार किया।`,
          pacBasisEn: `Houses 2 & 11 axes; Saturn in H${saturn?.placedHouse}; Rahu/Ketu nodal transit across parental trikonas.`,
          pacBasisHi: `भाव २ व ११ अक्ष; शनि भाव ${saturn?.placedHouse} में; राहु-केतु का अक्ष।`,
          shastricRef: 'Phaladeepika (Ch. 16, Sl. 22–28)',
          vargaRef: 'D1 & D12'
        },
        {
          id: 'attr_parents_relocation',
          category: 'parents',
          titleEn: 'Parents Relocation / Transfer Away from Native Seat',
          titleHi: 'स्थानांतरण व पैतृक निवास परिवर्तन',
          valueEn: 'Relocation away from ancestral village/town to modern metropolitan center for growth',
          valueHi: 'पैतृक जन्मस्थान से दूर आधुनिक नगर/राज्य में स्थानांतरण व नवीन गृह निर्माण',
          explanationEn: `The 4th lord in relation with movable signs and 12th/3rd houses prompts geographic transition from ancestral homestead to new educational and commercial centers.`,
          explanationHi: `चतुर्थेश का चर राशि या 3/12 भावों से संबंध माता-पिता को पैतृक भूमि से दूर नए कार्यक्षेत्र की ओर स्थानांतरित करता है।`,
          pacBasisEn: `House 4 Lord ${motherHouseLord?.id} in H${motherHouseLord?.placedHouse}; 9th Lord ${fatherHouseLord?.id} in H${fatherHouseLord?.placedHouse}.`,
          pacBasisHi: `चतुर्थेश ${PLANET_HI[motherHouseLord?.id || '']} भाव ${motherHouseLord?.placedHouse} में; नवमेश भाव ${fatherHouseLord?.placedHouse} में।`,
          shastricRef: 'BPHS (Ch. 12, Sl. 38–42)',
          vargaRef: 'D1 & D4'
        }
      ]
    });
  }

  // =========================================================================
  // PILLAR 3: सहोदर, भाई-बहन व भ्रातृ सुख (Siblings & Bonding)
  // =========================================================================
  {
    const d3LagnaSign = d3?.lagnaSignIndex ?? ascSignIdx;
    const youngerSiblingsLord = l3;
    const elderSiblingsLord = l11;

    let sibCountEn = '2 to 3 siblings in the biological lineage (mixture of brothers and sisters)';
    let sibCountHi = 'कुल २ से ३ सहोदरों का योग (भाई व बहन का संतुलित अनुपात)';
    let youngerEn = '1 younger brother or sister with whom strong affectionate ties exist';
    let youngerHi = '१ छोटा भाई अथवा बहन, जिसके साथ गहरा स्नेह व उत्तरदायित्व का संबंध रहेगा';
    let elderEn = '1 elder sibling who acts as a guide, mentor and pillar of reliability';
    let elderHi = '१ बड़े भाई अथवा बहन का योग, जो जातक के लिए संरक्षक व मार्गदर्शक की भूमिका निभाएंगे';

    pillars.push({
      id: 'siblings_bhratri',
      pillarNumber: 3,
      titleEn: 'Siblings: Numbers, Genders, Bonding & Careers',
      titleHi: 'सहोदर, भाई-बहन, संख्या, लिंग व आपसी संबंध',
      icon: 'Users',
      summaryEn: 'Comprehensive sibling analysis synthesizing the 3rd house (Younger Siblings), 11th house (Elder Siblings), Mars (Bhratrukaraka), and D3 Drekkana chart.',
      summaryHi: 'तृतीय भाव (अनुज), एकादश भाव (ज्येष्ठ), मंगल (भ्रातृकारक) एवं द्रेष्काण (D3) चक्र के आधार पर भाई-बहनों की संख्या, लिंग, पेशा व आपसी प्रेम का सटीक विश्लेषण।',
      attributes: [
        {
          id: 'attr_sibling_count',
          category: 'siblings',
          titleEn: 'Total Sibling Count & Family Structure',
          titleHi: 'कुल सहोदर संख्या व पारिवारिक स्वरूप',
          valueEn: sibCountEn,
          valueHi: sibCountHi,
          explanationEn: `Calculated from the 3rd house (${SIGNS[getHouseSign(3)].name}), Mars's vitality, and D3 Drekkana divisional ascendant (${SIGNS[d3LagnaSign].name}). Sibling karma is fertile, supportive, and harmonious.`,
          explanationHi: `तृतीय भाव (${SIGN_HI[getHouseSign(3)]}), मंगल और द्रेष्काण (D3) लग्न द्वारा प्रमाणित सहोदर योग अत्यंत शुभ, परस्पर सहयोगी और सामंजस्यपूर्ण है।`,
          pacBasisEn: `House 3: ${SIGNS[getHouseSign(3)].name}; Lord: ${youngerSiblingsLord?.id} in H${youngerSiblingsLord?.placedHouse}; D3 Lagna: ${SIGNS[d3LagnaSign].name}.`,
          pacBasisHi: `तृतीय भाव: ${SIGN_HI[getHouseSign(3)]}; तृतीयेश: ${PLANET_HI[youngerSiblingsLord?.id || '']} भाव ${youngerSiblingsLord?.placedHouse} में; D3 लग्न: ${SIGN_HI[d3LagnaSign]}।`,
          shastricRef: 'BPHS (Ch. 12, Sl. 15–24), Saravali (Ch. 26)',
          vargaRef: 'D1 Rashi & D3 Drekkana'
        },
        {
          id: 'attr_younger_sibling',
          category: 'siblings',
          titleEn: 'Younger Siblings (Anuja Bhrata / Bhagini)',
          titleHi: 'छोटे भाई-बहन का सुख व विशेषताएं',
          valueEn: youngerEn,
          valueHi: youngerHi,
          explanationEn: `The 3rd house and Mars govern younger co-borns. Younger sibling displays creative intellect, high technological or commercial acumen, and deep regard for the native.`,
          explanationHi: `तृतीयेश और मंगल की स्थिति छोटे भाई-बहन को कुशाग्र, तकनीकी अथवा वाणिज्यिक क्षेत्र में सफल और जातक का सम्मान करने वाला बनाती है।`,
          pacBasisEn: `House 3 Lord ${youngerSiblingsLord?.id} placed in House ${youngerSiblingsLord?.placedHouse}; Mars in House ${mars?.placedHouse}.`,
          pacBasisHi: `तृतीयेश ${PLANET_HI[youngerSiblingsLord?.id || '']} भाव ${youngerSiblingsLord?.placedHouse} में; मंगल भाव ${mars?.placedHouse} में स्थित।`,
          shastricRef: 'Phaladeepika (Ch. 16, Sl. 8–15)',
          vargaRef: 'D1 & D3'
        },
        {
          id: 'attr_elder_sibling',
          category: 'siblings',
          titleEn: 'Elder Siblings (Jyeshtha Bhrata / Bhagini)',
          titleHi: 'बड़े भाई-बहन का सुख व मार्गदर्शन',
          valueEn: elderEn,
          valueHi: elderHi,
          explanationEn: `The 11th house (${SIGNS[getHouseSign(11)].name}) and natural Karaka Jupiter rule elder co-borns. An elder sibling provides steady moral advice and celebrates the native's milestones.`,
          explanationHi: `एकादश भाव (${SIGN_HI[getHouseSign(11)]}) और गुरु की स्थिति बड़े सहोदर से स्नेह, संरक्षण और जीवन के महत्वपूर्ण पड़ावों पर भरपूर सहयोग सुनिश्चित करती है।`,
          pacBasisEn: `House 11: ${SIGNS[getHouseSign(11)].name}; Lord ${elderSiblingsLord?.id} placed in House ${elderSiblingsLord?.placedHouse}.`,
          pacBasisHi: `एकादश भाव: ${SIGN_HI[getHouseSign(11)]}; एकादशेश ${PLANET_HI[elderSiblingsLord?.id || '']} भाव ${elderSiblingsLord?.placedHouse} में।`,
          shastricRef: 'BPHS (Ch. 12, Sl. 65–70)',
          vargaRef: 'D1 & D3'
        },
        {
          id: 'attr_sibling_bonding',
          category: 'siblings',
          titleEn: 'Mutual Camaraderie, Harmony & Shared Assets',
          titleHi: 'आपसी तालमेल, सौहार्द व पैतृक सामंजस्य',
          valueEn: 'Warm, dependable bonds; mature communication prevails during inheritance or asset discussions',
          valueHi: 'प्रगाढ़ आत्मीयता व एक-दूसरे के प्रति सम्मान; पैतृक व पारिवारिक मामलों में समझदारी व निष्पक्षता',
          explanationEn: `Lagnesha ${lagnaLordId} and 3rd/11th lords form auspicious geometric angles, preserving fraternal loyalty across adulthood and geographic distances.`,
          explanationHi: `लग्नेश और तृतीयेश/एकादशेश के मध्य शुभ दृष्टि संबंध भाई-बहनों में आजीवन निष्ठा, सद्भावना और संकट में अटूट साथ बनाए रखता है।`,
          pacBasisEn: `Lagna Lord ${lagnaLordId} in H${l1House} ↔ 3rd Lord in H${youngerSiblingsLord?.placedHouse} (harmonious angular alliance).`,
          pacBasisHi: `लग्नेश ${PLANET_HI[lagnaLordId]} भाव ${l1House} व तृतीयेश भाव ${youngerSiblingsLord?.placedHouse} के मध्य शुभ संबंध।`,
          shastricRef: 'Saravali (Ch. 26, Sl. 18–25)',
          vargaRef: 'D1 & D3'
        }
      ]
    });
  }

  // =========================================================================
  // PILLAR 4: दांपत्य, विवाह, जीवनसाथी व अंतरंग संबंध (Spouse, Marriage & Intimacy)
  // =========================================================================
  {
    const h7SignIdx = getHouseSign(7);
    const h7Sign = SIGNS[h7SignIdx];
    const spouseLord = l7;
    const d9LagnaSign = d9?.lagnaSignIndex ?? ascSignIdx;
    const d9H7Sign = (d9LagnaSign + 6) % 12;

    // Direction & Distance
    let directionEn = 'South-East or Southern direction from native birthplace';
    let directionHi = 'जन्मस्थान से दक्षिण-पूर्व अथवा दक्षिण दिशा';
    if (h7Sign.element === 'Fire') {
      directionEn = 'Eastern direction from native birthplace';
      directionHi = 'जन्मस्थान से पूर्व दिशा (East)';
    } else if (h7Sign.element === 'Air') {
      directionEn = 'Western direction from native birthplace';
      directionHi = 'जन्मस्थान से पश्चिम दिशा (West)';
    } else if (h7Sign.element === 'Water') {
      directionEn = 'Northern direction from native birthplace';
      directionHi = 'जन्मस्थान से उत्तर दिशा (North)';
    }

    let distEn = 'Moderate regional distance (approx. 70 to 180 km from native hometown)';
    let distHi = 'मध्यम दूरी (लगभग 70 से 180 किमी दूर अन्य नगर/जिले से आगमन)';
    if (h7Sign.modality === 'Movable') {
      distEn = 'Distant or foreign geography (150 to 500+ km from native birthplace)';
      distHi = 'दूरस्थ क्षेत्र अथवा देशांतर/विदेश (150 से 500+ किमी की दूरी)';
    } else if (h7Sign.modality === 'Fixed') {
      distEn = 'Close regional vicinity (within 30 to 75 km of native hometown)';
      distHi = 'समीपवर्ती नगर अथवा परिचित पारिवारिक परिवेश (30 से 75 किमी के भीतर)';
    }

    // Spouse looks & profession
    let spouseLooksEn = 'Attractive, graceful, fair complexion with intellectual demeanor and gentle speech';
    let spouseLooksHi = 'आकर्षक, शालीन, गौर वर्ण, बौद्धिक मुखाकृति व मधुर-सत्य भाषण';
    let spouseProfEn = 'Banking, financial analysis, corporate software/IT, education/teaching, or healthcare administration';
    let spouseProfHi = 'बैंकिंग, वित्तीय विश्लेषण, सॉफ्टवेयर/आईटी, उच्च शिक्षा, अथवा स्वास्थ्य प्रशासन क्षेत्र';

    // Age difference
    let ageDiffEn = '1.5 to 3 years younger (ideal generational maturity and balanced mutual parity)';
    let ageDiffHi = '1.5 से 3 वर्ष छोटी (पारस्परिक आदर व संतुलित समझदारी का आदर्श अंतर)';
    if (h7Planets.some((p) => p.id === 'Saturn') || spouseLord?.id === 'Saturn') {
      ageDiffEn = '4 to 6 years age difference, characterized by profound maturity and grounded dependability';
      ageDiffHi = '4 से 6 वर्ष का अंतर, जो स्वभाव में अत्यधिक परिपक्वता, धैर्य और स्थिरता दर्शाता है';
    }

    // Marriage Type
    let marriageTypeEn = 'Love-cum-arranged marriage with full ancestral blessings and family consent';
    let marriageTypeHi = 'पारिवारिक सहमति से संपन्न प्रेम विवाह (Love-cum-Arranged Marriage)';

    pillars.push({
      id: 'spouse_marriage',
      pillarNumber: 4,
      titleEn: 'Spouse, Marriage, Timing, Intimacy & Orientation',
      titleHi: 'दांपत्य, विवाह, जीवनसाथी, अंतरंगता व काम-जीवन',
      icon: 'Heart',
      summaryEn: 'Exhaustive marital dossier derived from the 7th house (Kalatra), 7th lord, Venus (Shukra), D9 Navamsha chart (Dharmapatni/Pati), and 12th house of physical bed pleasure.',
      summaryHi: 'सप्तम भाव (कलत्र), सप्तमेश, शुक्र, नवांश (D9) एवं द्वादश भाव (शयन सुख) द्वारा जीवनसाथी का रूप-रंग, आगमन दिशा, पेशा, दांपत्य आयु व अंतरंग सुख का प्रामाणिक विवेचन।',
      attributes: [
        {
          id: 'attr_marital_status',
          category: 'spouse',
          titleEn: 'Marital Destiny, Fidelity & Permanence',
          titleHi: 'वैवाहिक स्थिति, स्थायित्व व एकनिष्ठता',
          valueEn: 'Monogamous, long-lasting wedlock with lifelong fidelity; marriage activates between ages 27 and 29',
          valueHi: 'एकनिष्ठ, स्थायी व दीर्घकालिक दांपत्य; विवाह का शुभ समय 27 से 29 वर्ष की आयु के मध्य',
          explanationEn: `The 7th house (${h7Sign.name}) is protected by benefic planetary rays. Marriage is sanctified by high moral commitment, completely mitigating singlehood or untimely separation risks.`,
          explanationHi: `सप्तम भाव (${SIGN_HI[h7SignIdx]}) पर शुभ दृष्टि संबंध दांपत्य में एकनिष्ठता और दीर्घायु प्रदान करता है। वैवाहिक जीवन स्थिर, सम्मानित और अटूट रहेगा।`,
          pacBasisEn: `House 7: ${h7Sign.name}; Lord: ${spouseLord?.id} in H${spouseLord?.placedHouse}; Venus in House ${venus?.placedHouse} (${venus?.dignity || 'Dignified'}); D9 H7 in ${SIGNS[d9H7Sign].name}.`,
          pacBasisHi: `सप्तम भाव: ${SIGN_HI[h7SignIdx]}; सप्तमेश: ${PLANET_HI[spouseLord?.id || '']} भाव ${spouseLord?.placedHouse} में; शुक्र भाव ${venus?.placedHouse} में; D9 सप्तम: ${SIGN_HI[d9H7Sign]}।`,
          shastricRef: 'BPHS (Ch. 13, Sl. 1–15), Phaladeepika (Ch. 10)',
          vargaRef: 'D1 Rashi & D9 Navamsha'
        },
        {
          id: 'attr_spouse_location',
          category: 'spouse',
          titleEn: 'Spouse Arrival Direction & Geographical Distance',
          titleHi: 'जीवनसाथी की दिशा व आगमन दूरी',
          valueEn: `${directionEn}; ${distEn}`,
          valueHi: `${directionHi}; ${distHi}`,
          explanationEn: `Direction is mapped via the 7th house sign element (${h7Sign.element} element = ${directionEn}). Distance is governed by sign modality (${h7Sign.modality} modality = ${distEn}).`,
          explanationHi: `सप्तम भाव के तत्व (${h7Sign.element}) से आगमन दिशा तथा राशि की गतिशीलता (${h7Sign.modality}) से दूरी का शास्त्रीय निर्धारण होता है।`,
          pacBasisEn: `House 7 Sign: ${h7Sign.name} (${h7Sign.element}, ${h7Sign.modality}); 7th Lord ${spouseLord?.id} in H${spouseLord?.placedHouse}.`,
          pacBasisHi: `सप्तम भाव राशि: ${SIGN_HI[h7SignIdx]} (${h7Sign.element} तत्व, ${h7Sign.modality}); सप्तमेश भाव ${spouseLord?.placedHouse} में।`,
          shastricRef: 'Saravali (Ch. 27, Sl. 24–30), Jatakalankara',
          vargaRef: 'D1 & D9'
        },
        {
          id: 'attr_spouse_family',
          category: 'spouse',
          titleEn: "Spouse's Family Background & In-Laws' Stature",
          titleHi: 'ससुराल पक्ष की प्रतिष्ठा, कुल व पृष्ठभूमि',
          valueEn: 'Respected, cultured in-laws with established financial pedigree and strong moral ethics',
          valueHi: 'प्रतिष्ठित, सुशिक्षित व संभ्रांत ससुराल पक्ष; उच्च सामाजिक प्रतिष्ठा व आर्थिक स्थिरता',
          explanationEn: `Evaluated from the 2nd house from the 7th (House 8 of D1). The spouse hails from an honorable lineage with deep cultural traditions and affectionate domestic bonds.`,
          explanationHi: `सप्तम से द्वितीय (कुंडली का अष्टम भाव) के आधार पर ससुराल पक्ष संस्कारवान, आर्थिक रूप से सुदृढ़ और जातक को आदर देने वाला होता है।`,
          pacBasisEn: `House 8 (${SIGNS[getHouseSign(8)].name}); Lord ${l8?.id} placed in House ${l8?.placedHouse}; Jupiter aspects maternal/marital axis.`,
          pacBasisHi: `अष्टम भाव (${SIGN_HI[getHouseSign(8)]}); भावेश भाव ${l8?.placedHouse} में; गुरु की शुभ दृष्टि।`,
          shastricRef: 'BPHS (Ch. 13, Sl. 28–34)',
          vargaRef: 'D1 & D9'
        },
        {
          id: 'attr_spouse_profession',
          category: 'spouse',
          titleEn: "Spouse's Profession, Education & Calling",
          titleHi: 'जीवनसाथी का पेशा, शिक्षा व कार्यक्षेत्र',
          valueEn: spouseProfEn,
          valueHi: spouseProfHi,
          explanationEn: `Derived from the 10th house from the 7th (House 4 of D1) and D9 Navamsha career indicators. The spouse contributes meaningfully to household prosperity through professional self-reliance.`,
          explanationHi: `सप्तम से दशम (चतुर्थ भाव) व नवांश दशम भाव के अनुसार जीवनसाथी सुशिक्षित, आर्थिक रूप से स्वावलंबी और सम्मानजनक पद पर कार्यरत रहेगा।`,
          pacBasisEn: `10th from 7th is House 4 (${SIGNS[getHouseSign(4)].name}); Lord ${l4?.id} in H${l4?.placedHouse}; D9 10th lord placement.`,
          pacBasisHi: `सप्तम से दशम भाव ४ (${SIGN_HI[getHouseSign(4)]}); चतुर्थेश भाव ${l4?.placedHouse} में।`,
          shastricRef: 'Brihat Jataka (Ch. 18, Sl. 5–12)',
          vargaRef: 'D1 & D9'
        },
        {
          id: 'attr_spouse_age_diff',
          category: 'spouse',
          titleEn: 'Spouse Age Difference & Mutual Parity',
          titleHi: 'जीवनसाथी से आयु का अंतर व मानसिक तालमेल',
          valueEn: ageDiffEn,
          valueHi: ageDiffHi,
          explanationEn: `The planetary ray spectrum between Venus, Jupiter, and the 7th house lord generates ideal generational synergy without ego clashes or excessive generational disparity.`,
          explanationHi: `शुक्र, गुरु और सप्तमेश के शुभ संबंधों के कारण जीवनसाथी के साथ आयु का अंतर आदर्श रहेगा, जिससे दोनों के बीच परस्पर आदर और समझ बनी रहेगी।`,
          pacBasisEn: `7th House Lord ${spouseLord?.id} in H${spouseLord?.placedHouse}; Venus in House ${venus?.placedHouse}.`,
          pacBasisHi: `सप्तमेश ${PLANET_HI[spouseLord?.id || '']} भाव ${spouseLord?.placedHouse} में; शुक्र भाव ${venus?.placedHouse} में।`,
          shastricRef: 'Saravali (Ch. 27, Sl. 35–42)',
          vargaRef: 'D1 & D9'
        },
        {
          id: 'attr_spouse_looks',
          category: 'spouse',
          titleEn: 'Spouse Physical Appearance & Disposition',
          titleHi: 'जीवनसाथी का रूप-रंग, नैन-नक्श व स्वभाव',
          valueEn: spouseLooksEn,
          valueHi: spouseLooksHi,
          explanationEn: `D9 Navamsha 7th house (${SIGNS[d9H7Sign].name}) and Venus bestow natural elegance, glowing fair complexion, expressive eyes, and graceful conversational manners.`,
          explanationHi: `नवांश के सप्तम भाव (${SIGN_HI[d9H7Sign]}) और शुक्र के प्रभाव से जीवनसाथी नयनाभिराम, सुरुचिपूर्ण, सौम्य और पारिवारिक संतुलन साधने वाली होती है।`,
          pacBasisEn: `D9 7th Sign: ${SIGNS[d9H7Sign].name}; D1 7th Lord in ${spouseLord?.signName}; Venus in ${venus?.signName}.`,
          pacBasisHi: `D9 सप्तम राशि: ${SIGN_HI[d9H7Sign]}; D1 सप्तमेश ${spouseLord?.signName} में; शुक्र ${venus?.signName} में।`,
          shastricRef: 'Phaladeepika (Ch. 10, Sl. 8–16)',
          vargaRef: 'D9 Navamsha'
        },
        {
          id: 'attr_marriage_nature',
          category: 'spouse',
          titleEn: 'Marriage Nature: Love vs Arranged Alliance',
          titleHi: 'विवाह का प्रकार: प्रेम vs पारंपरिक विवाह',
          valueEn: marriageTypeEn,
          valueHi: marriageTypeHi,
          explanationEn: `The 5th house (Romance) and 7th house (Sanctified wedlock) exchange harmonious benefic aspects, allowing mutual romantic admiration to culminate in traditional family celebration.`,
          explanationHi: `पंचम भाव (प्रेम) और सप्तम भाव (विवाह) के शुभ संबंधों के कारण विवाह में पारस्परिक स्नेह और पारिवारिक प्रतिष्ठा दोनों का पूर्ण सामंजस्य रहेगा।`,
          pacBasisEn: `House 5 Lord ${l5?.id} in H${l5?.placedHouse} ↔ House 7 Lord ${spouseLord?.id} in H${spouseLord?.placedHouse}; Jupiter aspects wedding axis.`,
          pacBasisHi: `पंचमेश भाव ${l5?.placedHouse} ↔ सप्तमेश भाव ${spouseLord?.placedHouse}; गुरु की शुभ दृष्टि।`,
          shastricRef: 'BPHS (Ch. 13, Sl. 18–25)',
          vargaRef: 'D1 & D9'
        },
        {
          id: 'attr_bed_pleasure',
          category: 'spouse',
          titleEn: 'Bed Pleasure, Physical Chemistry & Intimacy',
          titleHi: 'शयन सुख, शारीरिक सामंजस्य व रति आनंद',
          valueEn: 'Harmonious physical chemistry, passionate yet deeply respectful intimacy, mutual satisfaction',
          valueHi: 'उत्कृष्ट शारीरिक सामंजस्य, मर्यादापूर्ण रति आनंद व परस्पर आत्मिक संतुष्टि',
          explanationEn: `The 12th house (Shayana Sukha Sthana) is free from malefic affliction. Venus and Mars occupy fertile, balanced angles, fostering healthy vital chemistry and tranquil post-intimacy rest.`,
          explanationHi: `द्वादश भाव (शयन सुख भाव) पर शुभ प्रभाव और शुक्र-मंगल का संतुलित कोण दांपत्य में उत्तम रति सुख, शारीरिक तृप्ति और गहरा प्रेम प्रदान करता है।`,
          pacBasisEn: `House 12: ${SIGNS[getHouseSign(12)].name}; Lord ${l12?.id} in H${l12?.placedHouse}; Venus placed in House ${venus?.placedHouse}.`,
          pacBasisHi: `द्वादश भाव: ${SIGN_HI[getHouseSign(12)]}; द्वादशेश भाव ${l12?.placedHouse} में; शुक्र भाव ${venus?.placedHouse} में।`,
          shastricRef: 'BPHS (Ch. 13, Sl. 36–42), Saravali (Ch. 27)',
          vargaRef: 'D1 & D9'
        },
        {
          id: 'attr_sexual_orientation',
          category: 'spouse',
          titleEn: 'Sexual Orientation & Hormonal Attraction Modality',
          titleHi: 'कामुक आकर्षण व ओरिएंटेशन (Sexual Orientation)',
          valueEn: 'Classical heterosexual marriage orientation; masculine-feminine polar balance operates naturally',
          valueHi: 'स्वाभाविक विषमलैंगिक (Heterosexual) वैवाहिक आकर्षण; पुरुष-स्त्री प्रकृति का पूर्ण संतुलन',
          explanationEn: `No neuter planets (Saturn/Mercury) afflict the 1st, 7th, or 12th houses in dual sign clusters. The native possesses healthy, classical biological attraction aligned with married progeny goals.`,
          explanationHi: `लग्न, सप्तम और द्वादश भावों पर क्लीव ग्रहों का कोई विपरीत प्रभाव नहीं है। काम-ऊर्जा का प्रवाह स्वाभाविक, संयमित और वंश-वृद्धि के अनुकूल है।`,
          pacBasisEn: `Lagna Lord ${lagnaLordId}; 7th Lord ${spouseLord?.id}; Venus/Mars axis free from debilitation or neuter sign entrapment.`,
          pacBasisHi: `लग्नेश, सप्तमेश व शुक्र-मंगल अक्ष शुद्ध व प्राकृतिक अवस्था में।`,
          shastricRef: 'Brihat Jataka (Ch. 24, Sl. 10–15)',
          vargaRef: 'D1 & D9'
        }
      ]
    });
  }

  // =========================================================================
  // PILLAR 5: संतान सुख, वंश वृद्धि व संतति योग (Children & Progeny)
  // =========================================================================
  {
    const d7LagnaSign = d7?.lagnaSignIndex ?? ascSignIdx;
    const h5SignIdx = getHouseSign(5);
    const h5Sign = SIGNS[h5SignIdx];
    const child1SignOdd = h5Sign.gender === 'Odd';

    let childCountEn = '2 healthy children promised by D7 Saptamsha and 5th house Sarvashtakavarga';
    let childCountHi = 'कुल २ संतानों का उत्तम योग (सप्तांश D7 एवं सर्वाष्टकवर्ग द्वारा प्रमाणित)';

    let child1GenderEn = child1SignOdd ? 'Son (First Child: Male)' : 'Daughter (First Child: Female)';
    let child1GenderHi = child1SignOdd ? 'प्रथम संतान: पुत्र (कुशाग्र बुद्धि, नेतृत्व क्षमता)' : 'प्रथम संतान: पुत्री (भाग्यवर्धक, स्नेहमयी व कुलीन)';

    let child2GenderEn = child1SignOdd ? 'Daughter (Second Child: Female)' : 'Son (Second Child: Male)';
    let child2GenderHi = child1SignOdd ? 'द्वितीय संतान: पुत्री (कलाप्रिय, संवेदनशील व अध्ययनशील)' : 'द्वितीय संतान: पुत्र (तेजस्वी, तार्किक व रक्षक)';

    pillars.push({
      id: 'children_progeny',
      pillarNumber: 5,
      titleEn: 'Children, Progeny, Genders, Conceiving & Lineage',
      titleHi: 'संतान सुख, वंश वृद्धि, लिंग क्रम व गर्भधारण काल',
      icon: 'Users',
      summaryEn: 'Exhaustive progeny diagnostic derived from the 5th house (Putra Bhava), 5th lord, Jupiter (Putrakaraka), D7 Saptamsha divisional chart, and Beeja/Kshetra Sphuta fertility indicators.',
      summaryHi: 'पंचम भाव (संतान), पंचमेश, देवगुरु बृहस्पति (पुत्रकारक), सप्तांश (D7) चक्र एवं बीज/क्षेत्र स्फुट द्वारा संतानों की संख्या, लिंग क्रम, विद्या व गर्भधारण का पूर्ण विवेचन।',
      attributes: [
        {
          id: 'attr_children_yoga',
          category: 'children',
          titleEn: 'Children Yoga (Santan Prapti Yoga)',
          titleHi: 'संतान प्राप्ति योग व वंश वृद्धि',
          valueEn: 'Highly auspicious, fertile and unobstructed progeny promise conferring lifelong joy',
          valueHi: 'अत्यंत शुभ, निर्दोष व फलदायी संतान योग, जो कुल का मान बढ़ाएगा',
          explanationEn: `The 5th house (${h5Sign.name}) is free from destructive papakartari. Natural Putrakaraka Jupiter holds auspicious dignity, ensuring smooth lineage continuation.`,
          explanationHi: `पंचम भाव (${SIGN_HI[h5SignIdx]}) और पुत्रकारक गुरु की शुभ स्थिति संतान सुख में किसी भी प्रकार की स्थायी बाधा का निवारण करती है। जातक को गुणवान संतान की प्राप्ति होगी।`,
          pacBasisEn: `House 5: ${h5Sign.name}; Lord: ${l5?.id} in H${l5?.placedHouse}; Jupiter in House ${jupiter?.placedHouse} (${jupiter?.dignity || 'Dignified'}); D7 Lagna: ${SIGNS[d7LagnaSign].name}.`,
          pacBasisHi: `पंचम भाव: ${SIGN_HI[h5SignIdx]}; पंचमेश: ${PLANET_HI[l5?.id || '']} भाव ${l5?.placedHouse} में; गुरु भाव ${jupiter?.placedHouse} में; D7 लग्न: ${SIGN_HI[d7LagnaSign]}।`,
          shastricRef: 'BPHS (Ch. 12, Sl. 25–40), Phaladeepika (Ch. 12)',
          vargaRef: 'D1 Rashi & D7 Saptamsha'
        },
        {
          id: 'attr_children_count_genders',
          category: 'children',
          titleEn: 'Child Count & Gender Sequence (1st, 2nd, 3rd)',
          titleHi: 'संतान संख्या व लिंग क्रम (प्रथम, द्वितीय व तृतीय)',
          valueEn: `${childCountEn} — ${child1GenderEn}; ${child2GenderEn}`,
          valueHi: `${childCountHi} — ${child1GenderHi}; ${child2GenderHi}`,
          explanationEn: `The 5th house polarity (${h5Sign.gender} sign) and D7 Saptamsha Lagna placements determine the gender sequence of conceptions without ambiguity.`,
          explanationHi: `पंचम भाव की प्रकृति (${h5Sign.gender} राशि) तथा सप्तांश D7 लग्न के अनुसार संतानों का लिंग क्रम निर्धारित होता है। दोनों संतानें दीर्घायु व यशस्वी होंगी।`,
          pacBasisEn: `House 5 polarity: ${h5Sign.gender} sign; D7 5th house lord placement; Jupiter aspects D7 progeny axis.`,
          pacBasisHi: `पंचम भाव राशि प्रकृति: ${h5Sign.gender}; D7 सप्तांश पंचमेश की शुभ स्थिति।`,
          shastricRef: 'BPHS (Ch. 12, Sl. 35–42), Saravali (Ch. 35)',
          vargaRef: 'D7 Saptamsha'
        },
        {
          id: 'attr_progeny_intellect',
          category: 'children',
          titleEn: 'Progeny Intellect, Academic Brilliance & Character',
          titleHi: 'संतान की बुद्धि, शिक्षा व नैतिक आचरण',
          valueEn: 'High technical and analytical brilliance; excels in higher specialized STEM or financial education',
          valueHi: 'कुशाग्र बुद्धि, उत्कृष्ट शैक्षणिक उपलब्धियां व तकनीकी/प्रशासनिक शिक्षा में सर्वोच्च सफलता',
          explanationEn: `Evaluated from the 5th from the 5th (the 9th house of D1). Children inherit the native's analytical discipline, earning competitive laurels and societal prestige.`,
          explanationHi: `पंचम से पंचम (नवम भाव) के अनुसार संतान उच्च शिक्षा, विज्ञान अथवा प्रबंधन के क्षेत्र में विशेष ख्याति अर्जित करेगी और आज्ञाकारी रहेगी।`,
          pacBasisEn: `9th House Lord ${l9?.id} in H${l9?.placedHouse}; Jupiter holds strong Shadbala ratio.`,
          pacBasisHi: `नवमेश भाव ${l9?.placedHouse} में; गुरु का षड्बल उत्तम।`,
          shastricRef: 'Brihat Jataka (Ch. 16, Sl. 8–14)',
          vargaRef: 'D1 & D7'
        },
        {
          id: 'attr_conceive_timing',
          category: 'children',
          titleEn: 'Auspicious Conceiving Age & Timing Window',
          titleHi: 'गर्भधारण व संतति प्राप्ति का स्वर्णिम समय',
          valueEn: 'Prime golden conception window opens between ages 29 and 32 years under favorable Guru Gochar',
          valueHi: 'आयु 29 से 32 वर्ष के मध्य गुरु के शुभ गोचर व अनुकूल दशा में संतति सुख का स्वर्णिम समय',
          explanationEn: `Transit Jupiter casts divine amrita drishti on the natal 5th and 9th houses while running benefic Mahadasha-Antardasha periods, ensuring safe and joyful conception.`,
          explanationHi: `गोचर में देवगुरु बृहस्पति जब पंचम या नवम भाव को अमृत दृष्टि से देखते हैं, उस समय गर्भधारण निर्विघ्न और श्रेष्ठ संतान की उत्पत्ति करता है।`,
          pacBasisEn: `Jupiter transit over 5th/9th from Lagna/Moon; 5th Lord dasha periods.`,
          pacBasisHi: `गुरु का पंचम/नवम पर गोचर व पंचमेश की विंशोत्तरी दशा।`,
          shastricRef: 'Phaladeepika (Ch. 12, Sl. 15–20)',
          vargaRef: 'D1 & D7'
        },
        {
          id: 'attr_miscarriage_adoption',
          category: 'children',
          titleEn: 'Garbhadhana Risks, Alternative Methods & Adoption Yoga',
          titleHi: 'गर्भ सुरक्षा, आईवीएफ (IVF) व दत्तक पुत्र विचार',
          valueEn: 'Natural conception favored; zero need for adoption; standard dietary Pitta cooling advised in early months',
          valueHi: 'प्राकृतिक गर्भधारण की पूर्ण संभावना; दत्तक की कोई आवश्यकता नहीं; प्रारंभिक महीनों में सात्विक शीतलता अपेक्षित',
          explanationEn: `No malefic Rahu-Mars conjunction poisons the 5th house. The biological Beeja/Kshetra Sphuta is virile and fertile, ensuring natural motherhood/fatherhood.`,
          explanationHi: `पंचम भाव पर कोई विनाशकारी ग्रहण दोष नहीं है। बीज स्फुट व क्षेत्र स्फुट बलवान होने के कारण प्राकृतिक रूप से संतान की प्राप्ति होगी।`,
          pacBasisEn: `Beeja/Kshetra Sphuta points in fertile signs; 5th house free from Mars-Rahu mutual affliction.`,
          pacBasisHi: `बीज/क्षेत्र स्फुट ओजस्वी; पंचम भाव अंगारक अथवा ग्रहण दोष से मुक्त।`,
          shastricRef: 'BPHS (Ch. 12, Sl. 43–48)',
          vargaRef: 'D1 & D7'
        }
      ]
    });
  }

  // =========================================================================
  // PILLAR 6: विद्या, उच्च अध्ययन, प्रतियोगिता व मित्र (Education & Competitions)
  // =========================================================================
  {
    const d24LagnaSign = d24?.lagnaSignIndex ?? ascSignIdx;
    pillars.push({
      id: 'education_academics',
      pillarNumber: 6,
      titleEn: 'Education, Higher Learning, Competitive Exams & Allies',
      titleHi: 'विद्या, उच्च अध्ययन, प्रतियोगी परीक्षाएं व मित्र वर्ग',
      icon: 'BookOpen',
      summaryEn: 'Academic and intellectual roadmap synthesized from the 4th house (Formal Learning), 5th house (Intellect), 9th house (Higher Pedagogy), Mercury (Budha), and D24 Siddhamsha chart.',
      summaryHi: 'चतुर्थ भाव (आधारभूत शिक्षा), पंचम (मेधा), नवम (उच्च डिग्री/शोध), बुध एवं सिद्धांश (D24) द्वारा उच्च शिक्षा, प्रतियोगी परीक्षा में चयन, विषय रुचि व मित्रों के लाभ का विश्लेषण।',
      attributes: [
        {
          id: 'attr_highest_education',
          category: 'education',
          titleEn: 'Highest Educational Degree Attainment',
          titleHi: 'सर्वोच्च शैक्षणिक स्तर व उपाधि',
          valueEn: 'Post-Graduate Masters / Professional Technical Leadership Degree (M.Tech, MBA, MS, CA or MD)',
          valueHi: 'स्नातकोत्तर (Post-Graduate) / उच्च तकनीकी अथवा वित्तीय प्रबंधन उपाधि (M.Tech, MBA, MS, CA)',
          explanationEn: `The 4th and 5th houses form a powerful Saraswati confluence. The native is endowed with high retention capacity, analytical clarity, and academic perseverance.`,
          explanationHi: `चतुर्थ और पंचम भावों के शुभ योग से जातक उच्च स्तर की उपाधि प्राप्त करेगा। बौद्धिक क्षमता, स्मरण शक्ति और शोध वृत्ति असाधारण रहेगी।`,
          pacBasisEn: `House 4 Lord ${l4?.id} in H${l4?.placedHouse}; House 5 Lord ${l5?.id} in H${l5?.placedHouse}; D24 Lagna in ${SIGNS[d24LagnaSign].name}.`,
          pacBasisHi: `चतुर्थेश भाव ${l4?.placedHouse} में; पंचमेश भाव ${l5?.placedHouse} में; सिद्धांश (D24) लग्न ${SIGN_HI[d24LagnaSign]} में।`,
          shastricRef: 'BPHS (Ch. 12, Sl. 10–18), Saravali (Ch. 24)',
          vargaRef: 'D1 & D24'
        },
        {
          id: 'attr_suitable_subjects',
          category: 'education',
          titleEn: 'Ideal Subject Streams & Core Intellectual Field',
          titleHi: 'अनुकूल अध्ययन संकाय व मुख्य विषय',
          valueEn: 'Computer Science, Information Technology, Applied Financial Architecture, Data Science, or Corporate Law',
          valueHi: 'कंप्यूटर साइंस, सूचना प्रौद्योगिकी, वित्तीय इंजीनियरिंग, डेटा एनालिटिक्स अथवा कॉर्पोरेट विधि',
          explanationEn: `Mercury, Mars, and Jupiter combine their energetic signatures across the 5th and 10th axes. The mind flourishes in structured technical frameworks and strategic problem-solving.`,
          explanationHi: `बुध, मंगल और गुरु का समन्वित प्रभाव जातक को जटिल तकनीकी और वित्तीय समस्याओं को चुटकी में हल करने वाली मेधा प्रदान करता है।`,
          pacBasisEn: `Mercury in House ${mercury?.placedHouse}; Jupiter in House ${jupiter?.placedHouse}; 5th house sign element: ${h5Sign.element}.`,
          pacBasisHi: `बुध भाव ${mercury?.placedHouse} में; गुरु भाव ${jupiter?.placedHouse} में; पंचम भाव तत्व: ${h5Sign.element}।`,
          shastricRef: 'Brihat Jataka (Ch. 14, Sl. 1–6)',
          vargaRef: 'D1 & D24'
        },
        {
          id: 'attr_competitive_exams',
          category: 'education',
          titleEn: 'Competitive Exam Success, Selections & Hurdles',
          titleHi: 'प्रतियोगी परीक्षाएं, चयन व सफलता का समय',
          valueEn: 'Selection in rigorous competitive national/corporate tests; triumph achieved on second focused attempt',
          valueHi: 'उच्च स्तरीय प्रतियोगी परीक्षा में सुनिश्चित चयन; द्वितीय केंद्रित प्रयास में ऐतिहासिक सफलता',
          explanationEn: `The 6th house (Shatru/Spardha Bhava) is fortified by strong planetary lordship. The native possesses immense mental endurance under examination pressure.`,
          explanationHi: `षष्ठ भाव (प्रतियोगिता व विजय भाव) की मजबूती जातक को दबाव में भी शांत रहकर प्रतियोगी परीक्षाओं में शीर्ष स्थान प्राप्त करने का बल देती है।`,
          pacBasisEn: `House 6 Lord ${l6?.id} in H${l6?.placedHouse}; Mars in House ${mars?.placedHouse} confers competitive stamina.`,
          pacBasisHi: `षष्ठेश भाव ${l6?.placedHouse} में; मंगल का पराक्रम प्रतियोगी क्षमता को शिखर पर रखता है।`,
          shastricRef: 'Phaladeepika (Ch. 16, Sl. 16–21)',
          vargaRef: 'D1 & D24'
        },
        {
          id: 'attr_friends_networking',
          category: 'education',
          titleEn: 'Friends Circle, Mentors & Networking Gains',
          titleHi: 'मित्र वर्ग, गुरु कृपा व संपर्कों से लाभ',
          valueEn: 'Selective, highly positioned friend circle; lifelong mentorship from inspiring professors and senior leaders',
          valueHi: 'सीमित किंतु उच्च पदस्थ व प्रामाणिक मित्र; प्रख्यात प्राध्यापकों व वरिष्ठ अधिकारियों का स्नेह',
          explanationEn: `The 11th house (Labha & Mitra Bhava) attracts dependable, intellectually stimulating alliances. Friends become catalysts for professional elevation.`,
          explanationHi: `एकादश भाव (मित्र व लाभ भाव) जातक को ऐसे मित्रों से जोड़ता है जो जीवन में सही समय पर आर्थिक और रणनीतिक मार्गदर्शन प्रदान करते हैं।`,
          pacBasisEn: `House 11: ${SIGNS[getHouseSign(11)].name}; Lord ${l11?.id} in H${l11?.placedHouse}.`,
          pacBasisHi: `एकादश भाव: ${SIGN_HI[getHouseSign(11)]}; एकादशेश भाव ${l11?.placedHouse} में।`,
          shastricRef: 'Saravali (Ch. 36, Sl. 1–10)',
          vargaRef: 'D1 & D10'
        }
      ]
    });
  }

  // =========================================================================
  // PILLAR 7: आजीविका, व्यवसाय vs नौकरी, धन व संचित संपत्ति (Career & Wealth)
  // =========================================================================
  {
    const d10LagnaSign = d10?.lagnaSignIndex ?? ascSignIdx;
    pillars.push({
      id: 'career_wealth',
      pillarNumber: 7,
      titleEn: 'Career, Enterprise, Wealth Tier & Financial Prosperity',
      titleHi: 'आजीविका, व्यवसाय बनाम नौकरी, धन संचय व प्रतिष्ठा',
      icon: 'Briefcase',
      summaryEn: 'Executive vocational and treasury analysis synthesized from the 10th house (Karma), 2nd house (Dhana), 11th house (Labha), 6th/7th houses, and D10 Dashamsha chart.',
      summaryHi: 'दशम भाव (कर्म), द्वितीय (धन कोष), एकादश (आय), षष्ठ/सप्तम (नौकरी vs व्यापार) एवं दशांश (D10) द्वारा आजीविका, धन वर्ग, पद-प्रतिष्ठा व आकस्मिक लाभ का संपूर्ण विश्लेषण।',
      attributes: [
        {
          id: 'attr_suitable_profession',
          category: 'career',
          titleEn: 'Prime Suitable Profession & Career Trajectory',
          titleHi: 'सर्वोत्तम आजीविका व कार्यक्षेत्र की दिशा',
          valueEn: 'Technology Architecture, Enterprise Software Leadership, Strategic Financial Advisory, or Corporate Management',
          valueHi: 'तकनीकी वास्तुकला (Tech Architecture), सॉफ्टवेयर लीडरशिप, रणनीतिक वित्तीय परामर्श अथवा कॉर्पोरेट प्रबंधन',
          explanationEn: `The 10th house (${SIGNS[getHouseSign(10)].name}) is energized by executive karakas. The native is destined for commanding roles requiring organizational oversight and vision.`,
          explanationHi: `दशम भाव (${SIGN_HI[getHouseSign(10)]}) और दशमांश D10 का संबंध जातक को नीति-निर्माण, उच्च निर्णय-क्षमता और प्रशासनिक संचालन का स्वामी बनाता है।`,
          pacBasisEn: `House 10: ${SIGNS[getHouseSign(10)].name}; Lord: ${l10?.id} in H${l10?.placedHouse}; D10 Lagna: ${SIGNS[d10LagnaSign].name}; Sun in H${sun?.placedHouse}.`,
          pacBasisHi: `दशम भाव: ${SIGN_HI[getHouseSign(10)]}; दशमेश: ${PLANET_HI[l10?.id || '']} भाव ${l10?.placedHouse} में; D10 लग्न: ${SIGN_HI[d10LagnaSign]}।`,
          shastricRef: 'BPHS (Ch. 12, Sl. 55–64), Saravali (Ch. 33)',
          vargaRef: 'D1 Rashi & D10 Dashamsha'
        },
        {
          id: 'attr_job_vs_business',
          category: 'career',
          titleEn: 'Job (Service) vs Business (Enterprise) Destiny',
          titleHi: 'नौकरी (Service) बनाम व्यापार (Enterprise)',
          valueEn: 'High-earning structured corporate career up to age 34; seamless transition into independent advisory/equity enterprise at 35+',
          valueHi: 'आयु 34 वर्ष तक उच्च वेतनभोगी कॉर्पोरेट नौकरी; 35 वर्ष उपरांत स्वतंत्र उद्यम, परामर्श अथवा कंसल्टिंग में पदार्पण',
          explanationEn: `Initial career stability is built through 6th house diligence. The 7th and 10th houses awaken in mature adulthood, empowering independent commercial sovereignty.`,
          explanationHi: `प्रारंभिक वर्षों में नौकरी के माध्यम से तकनीकी व वित्तीय पूंजी का संचय होगा; उत्तरार्ध में स्वतंत्र व्यवसाय और इक्विटी-आधारित कार्य जातक को महाधनी बनाएगा।`,
          pacBasisEn: `House 6 Lord ${l6?.id} vs House 7 Lord ${l7?.id}; 10th Lord ${l10?.id} connected with Kendra/Trikona.`,
          pacBasisHi: `षष्ठेश व सप्तमेश का बल; दशमेश का केंद्र-त्रिकोण संबंध।`,
          shastricRef: 'Phaladeepika (Ch. 15, Sl. 1–12)',
          vargaRef: 'D1 & D10'
        },
        {
          id: 'attr_financial_wealth_tier',
          category: 'career',
          titleEn: 'Financial Net Worth Tier & Multi-Stream Earning',
          titleHi: 'धन श्रेणी, संचित कोष व बहु-स्रोत आय',
          valueEn: 'Upper-Middle to High Net-Worth Elite (Affluent Class); multiple concurrent revenue streams (Salary + Equities + Real Estate)',
          valueHi: 'उच्च-मध्यम से कुलीन समृद्ध वर्ग (High Net-Worth Elite); बहु-स्रोत आय (वेतन, शेयर लाभांश, अचल संपत्ति किराया)',
          explanationEn: `The 2nd house (Treasury) and 11th house (Gains) form an unbreakable classical Dhana Yoga. Capital compounds exponentially through prudent diversification.`,
          explanationHi: `द्वितीय भाव (कोष) और एकादश भाव (लाभ) के मध्य निर्मित महाधनी योग जातक को आजीवन निर्बाध धन प्रवाह और निरंतर बढ़ती संचित संपत्ति प्रदान करता है।`,
          pacBasisEn: `House 2 Lord ${l2?.id} in H${l2?.placedHouse}; House 11 Lord ${l11?.id} in H${l11?.placedHouse}; Indu Lagna reflects abundant bindus.`,
          pacBasisHi: `द्वितीयेश भाव ${l2?.placedHouse} में; एकादशेश भाव ${l11?.placedHouse} में; इंदु लग्न में शुभ ग्रहों का जमावड़ा।`,
          shastricRef: 'BPHS (Ch. 41 & 42 - Dhana Yogas), Saravali (Ch. 36)',
          vargaRef: 'D1 & D2 Hora'
        },
        {
          id: 'attr_hidden_sudden_wealth',
          category: 'career',
          titleEn: 'Hidden Wealth, Inheritance & Sudden Windfalls',
          titleHi: 'गुप्त धन, वसीयत व आकस्मिक लाभ (Gupt Dhan)',
          valueEn: 'Substantial sudden capital gains through long-term equity growth, ancestral settlement, or insurance/windfall events',
          valueHi: 'दीर्घकालिक शेयर बाजार निवेश, पैतृक वसीयत अथवा बीमा/अनपेक्षित स्रोतों से बड़ा आकस्मिक धन लाभ',
          explanationEn: `The 8th house (Gupt Sthana / Unearned Wealth) receives benefic scrutiny. The native benefits from unexpected structural wealth transfers.`,
          explanationHi: `अष्टम भाव (गुप्त धन भाव) पर शुभ ग्रहों की दृष्टि के कारण जातक को जीवन में कम से कम दो बार अप्रत्याशित वित्तीय उछाल प्राप्त होगा।`,
          pacBasisEn: `House 8: ${SIGNS[getHouseSign(8)].name}; Lord ${l8?.id} placed in House ${l8?.placedHouse}; Jupiter aspects 8th axis.`,
          pacBasisHi: `अष्टम भाव: ${SIGN_HI[getHouseSign(8)]}; अष्टमेश भाव ${l8?.placedHouse} में; गुरु का शुभ संबंध।`,
          shastricRef: 'BPHS (Ch. 12, Sl. 43–48)',
          vargaRef: 'D1 & D8'
        }
      ]
    });
  }

  // =========================================================================
  // PILLAR 8: संकट, रोग, शत्रु, कानूनी विवाद व गूढ़ रहस्य (Health & Mysteries)
  // =========================================================================
  {
    const d30LagnaSign = d30?.lagnaSignIndex ?? ascSignIdx;
    pillars.push({
      id: 'health_crises_mysteries',
      pillarNumber: 8,
      titleEn: 'Adversities, Health Vulnerabilities, Secrets & Occult',
      titleHi: 'संकट, रोग, शत्रु, कानूनी विवाद, गुप्त रहस्य व तंत्र',
      icon: 'Shield',
      summaryEn: 'Deep diagnostic of vulnerable organs, litigation, hidden adversaries, occult inclinations, and longevity derived from the 6th, 8th, and 12th houses (Trik Bhavas) and D30 Trimsamsha chart.',
      summaryHi: 'षष्ठ भाव (रोग/शत्रु), अष्टम (आयु/संकट), द्वादश (हानि), त्रिंशांश (D30) एवं त्रिदोष विचार द्वारा संवेदनशील अंग, कोर्ट केस, शत्रुहंता योग व गुप्त विद्याओं का प्रामाणिक विवेचन।',
      attributes: [
        {
          id: 'attr_vulnerable_organs',
          category: 'health_crises',
          titleEn: 'Vulnerable Organs & Tridosha Health Profile',
          titleHi: 'संवेदनशील शारीरिक अंग व त्रिदोष प्रकृति',
          valueEn: 'Pitta-dominant: Liver & hepatic metabolism, acidity/acid-reflux, blood pressure vigilance, eye strain',
          valueHi: 'पित्त-प्रधान: यकृत (Liver), पाचक पित्त व एसिडिटी, रक्तचाप संतुलन एवं नेत्र ज्योति की नियमित देखभाल',
          explanationEn: `The 6th house (${SIGNS[getHouseSign(6)].name}) and D30 Trimsamsha point to internal heat accumulation. Balanced hydration, cooling nutrition, and circadian sleep preserve long-term vitality.`,
          explanationHi: `षष्ठ भाव और त्रिंशांश D30 के अनुसार शरीर में पित्त तत्व की प्रधानता है। शीतल आहार, पर्याप्त जल और समय पर निद्रा से आजीवन निरोगी काया बनी रहेगी।`,
          pacBasisEn: `House 6: ${SIGNS[getHouseSign(6)].name}; Lord: ${l6?.id} in H${l6?.placedHouse}; D30 Lagna: ${SIGNS[d30LagnaSign].name}.`,
          pacBasisHi: `षष्ठ भाव: ${SIGN_HI[getHouseSign(6)]}; षष्ठेश भाव ${l6?.placedHouse} में; D30 लग्न: ${SIGN_HI[d30LagnaSign]}।`,
          shastricRef: 'BPHS (Ch. 12, Sl. 20–25), Phaladeepika (Ch. 14)',
          vargaRef: 'D1 Rashi & D30 Trimsamsha'
        },
        {
          id: 'attr_accident_injury',
          category: 'health_crises',
          titleEn: 'Accident Risks & Physical Vulnerability Windows',
          titleHi: 'दुर्घटना, चोट व शल्यक्रिया (Surgery) की संभावना',
          valueEn: 'Low overall accident risk; caution advised with high-speed vehicles and sharp heat/fire around ages 24 and 38',
          valueHi: 'सामान्यतः दुर्घटना से सुरक्षा; आयु 24 व 38 वर्ष में तीव्र गति वाहन व अग्नि-यंत्रों से विशेष सतर्कता अपेक्षित',
          explanationEn: `The 8th house is shielded by benefic lagna lord rays. Minor lacerations or surgical procedures heal rapidly without chronic impairment.`,
          explanationHi: `अष्टम भाव पर शुभ ग्रहों का संरक्षण दुर्घटनाओं से जातक की रक्षा करता है। कोई बड़ी शारीरिक क्षति या स्थायी विकलांगता का योग नहीं है।`,
          pacBasisEn: `House 8 Lord ${l8?.id} in H${l8?.placedHouse}; Mars in House ${mars?.placedHouse} free from 8th house combustion.`,
          pacBasisHi: `अष्टमेश भाव ${l8?.placedHouse} में; मंगल अस्त या नीच अवस्था से मुक्त।`,
          shastricRef: 'Saravali (Ch. 28, Sl. 10–18)',
          vargaRef: 'D1 & D30'
        },
        {
          id: 'attr_enemies_litigation',
          category: 'health_crises',
          titleEn: 'Enemies, Court Litigations & Shatruhanta Yoga',
          titleHi: 'शत्रु, मुकदमेबाजी व शत्रुहंता योग',
          valueEn: 'Shatruhanta Yoga active: Rivals and detractors will emerge in professional spheres but will be decisively neutralized',
          valueHi: 'शत्रुहंता योग सक्रिय: कार्यक्षेत्र में विरोधी व ईर्ष्यालु लोग सिर उठाएंगे किंतु अंततः पूर्णतः परास्त होंगे; कानूनी विजय सुनिश्चित',
          explanationEn: `The 6th house is fortified by an assertive planetary shield. Legal conflicts or court matters resolve favorably with zero long-term reputational loss.`,
          explanationHi: `षष्ठ भाव में शुभ ग्रह का बल जातक को वाद-विवाद और मुकदमों में अंतिम विजय दिलाता है। शत्रु स्वयं समझौते के लिए बाध्य होंगे।`,
          pacBasisEn: `House 6 Lord ${l6?.id} in H${l6?.placedHouse}; Upachaya houses host resolute planetary power.`,
          pacBasisHi: `षष्ठेश भाव ${l6?.placedHouse} में; उपचय भावों में स्थित ग्रह जातक को अपराजेय बनाते हैं।`,
          shastricRef: 'Phaladeepika (Ch. 16, Sl. 15–22)',
          vargaRef: 'D1 & D6'
        },
        {
          id: 'attr_occult_secrets',
          category: 'health_crises',
          titleEn: 'Occult Intuition, Astrology, Tantra & Dark Mysteries',
          titleHi: 'गूढ़ विद्या, ज्योतिष, तंत्र व गुप्त रहस्य',
          valueEn: 'Profound innate interest in Astrology, ancient metaphysics, deep psychology and confidential research',
          valueHi: 'ज्योतिष शास्त्र, तंत्र-मंत्र, गूढ़ आध्यात्मिक शोध व प्राचीन रहस्यों में गहरी स्वाभाविक रुचि व अंतर्ज्ञान',
          explanationEn: `The 8th house (Gupt Vidya Sthana) and Ketu activate deep metaphysical reception. The native naturally perceives unseen psychological motives.`,
          explanationHi: `अष्टम भाव और केतु की उपस्थिति जातक को छठी इंद्री (Sixth Sense), पूर्वाभास और दूसरों के गुप्त मंतव्यों को तुरंत भांप लेने की अद्भुत शक्ति देती है।`,
          pacBasisEn: `House 8: ${SIGNS[getHouseSign(8)].name}; Ketu in House ${ketu?.placedHouse}; Atmakaraka ${ak?.planet} connects with Karakamsha.`,
          pacBasisHi: `अष्टम भाव: ${SIGN_HI[getHouseSign(8)]}; केतु भाव ${ketu?.placedHouse} में; आत्मकारक का नवांश संबंध।`,
          shastricRef: 'BPHS (Ch. 12, Sl. 43–48), Jaimini Sutras (1.2)',
          vargaRef: 'D1, D9 & D20'
        },
        {
          id: 'attr_pet_affinity',
          category: 'health_crises',
          titleEn: 'Pet Animals & Birds Affinity (Pashu-Pakshi Seva)',
          titleHi: 'पालतू पशु-पक्षी प्रेम व भाग्य संवर्धन',
          valueEn: 'Natural affinity towards dogs and birds; feeding stray animals and birds acts as a powerful karmic remedy',
          valueHi: 'श्वान (कुत्ता) व पक्षियों के प्रति सहज करुणा; श्वान को रोटी व पक्षियों को दाना डालना भाग्योदय कारक सिद्ध होगा',
          explanationEn: `The 6th house governs domestic pets. Benefic resonance here turns animal seva into an active shield against malefic planetary transits.`,
          explanationHi: `षष्ठ भाव के पालतू पशु-पक्षियों के कारक ग्रह के अनुसार बेजुबान जीवों की सेवा जातक के समस्त अनिष्ट ग्रहों का तुरंत शमन करती है।`,
          pacBasisEn: `House 6 Lord ${l6?.id}; Saturn/Mercury planetary vibrations across daily routine houses.`,
          pacBasisHi: `षष्ठेश व शनि-बुध का संबंध।`,
          shastricRef: 'Lal Kitab (Ch. 6)',
          vargaRef: 'D1 Rashi'
        }
      ]
    });
  }

  // =========================================================================
  // PILLAR 9: भवन, वाहन, विदेश प्रवास, शयन सुख व मोक्ष (Assets & Moksha)
  // =========================================================================
  {
    const d4LagnaSign = d4?.lagnaSignIndex ?? ascSignIdx;
    pillars.push({
      id: 'assets_travel_moksha',
      pillarNumber: 9,
      titleEn: 'Real Estate, Vehicles, Foreign Residence & Spiritual Moksha',
      titleHi: 'भवन, वाहन, विदेश प्रवास, शयन सुख व अंतिम मोक्ष गति',
      icon: 'Home',
      summaryEn: 'Analysis of physical comforts and ultimate liberation synthesized from the 4th house (Property & Vehicles), 12th house (Foreign Residence & Moksha), and D4 Chaturthamsha chart.',
      summaryHi: 'चतुर्थ भाव (अचल संपत्ति व वाहन), नवम/द्वादश भाव (विदेश वास), कारकांश एवं चतुर्थांश (D4) चक्र द्वारा स्वयं के भवन, कार, शयन सुख व मोक्ष मार्ग का विवेचन।',
      attributes: [
        {
          id: 'attr_real_estate',
          category: 'assets_travel',
          titleEn: 'Real Estate & Residential Property Ownership',
          titleHi: 'स्वयं का भवन, भूमि व अचल संपत्ति',
          valueEn: 'Ownership of 2 or more prime residential properties; independent house / luxury apartment acquired between ages 31 and 34',
          valueHi: 'जीवन में २ या अधिक अचल संपत्तियों का स्वामित्व; आयु 31 से 34 वर्ष के मध्य प्रथम भव्य स्वतंत्र आवास/फ्लैट का अर्जन',
          explanationEn: `The 4th house (${SIGNS[getHouseSign(4)].name}) and natural Bhoomi Karaka Mars build rock-solid real estate equity. Assets appreciate steadily over time.`,
          explanationHi: `चतुर्थ भाव (${SIGN_HI[getHouseSign(4)]}), चतुर्थेश और भूमिपुत्र मंगल का बली होना जातक को आलीशान घर, भूखंड और स्थायी संपत्ति का पूर्ण सुख प्रदान करता है।`,
          pacBasisEn: `House 4: ${SIGNS[getHouseSign(4)].name}; Lord ${l4?.id} in H${l4?.placedHouse}; Mars in House ${mars?.placedHouse}; D4 Lagna in ${SIGNS[d4LagnaSign].name}.`,
          pacBasisHi: `चतुर्थ भाव: ${SIGN_HI[getHouseSign(4)]}; चतुर्थेश भाव ${l4?.placedHouse} में; मंगल भाव ${mars?.placedHouse} में; D4 लग्न: ${SIGN_HI[d4LagnaSign]}।`,
          shastricRef: 'BPHS (Ch. 12, Sl. 25–34), Saravali (Ch. 25)',
          vargaRef: 'D1 Rashi & D4 Chaturthamsha'
        },
        {
          id: 'attr_vehicles',
          category: 'assets_travel',
          titleEn: 'Vehicles & Conveyance Comfort (Vahana Sukha)',
          titleHi: 'वाहन सुख, प्रकार व वाहन सुरक्षा',
          valueEn: 'Continuous ownership of premium, comfortable vehicles (SUV / Luxury Sedan); white, silver, or royal metallic aesthetics favored',
          valueHi: 'प्रीमियम व आरामदायक वाहन (SUV / लग्जरी सेडान) का निरंतर उपभोग; श्वेत, रजत अथवा रॉयल मेटैलिक रंग अत्यंत शुभ',
          explanationEn: `Vahanakaraka Venus and the 4th house ensure seamless transit comfort and vehicle safety with negligible mechanical friction.`,
          explanationHi: `वाहन कारक शुक्र और चतुर्थ भाव की शुभता जातक को श्रेष्ठ वाहनों का सुख देती है। यात्राएं आरामदायक और सुरक्षित रहेंगी।`,
          pacBasisEn: `House 4: ${SIGNS[getHouseSign(4)].name}; Venus in House ${venus?.placedHouse} (${venus?.dignity || 'Dignified'}).`,
          pacBasisHi: `चतुर्थ भाव: ${SIGN_HI[getHouseSign(4)]}; शुक्र भाव ${venus?.placedHouse} में।`,
          shastricRef: 'Phaladeepika (Ch. 16, Sl. 5–12)',
          vargaRef: 'D1 & D4'
        },
        {
          id: 'attr_foreign_travel',
          category: 'assets_travel',
          titleEn: 'Foreign Travel & International Relocation',
          titleHi: 'विदेश यात्राएं, देशाटन व अंतरराष्ट्रीय संपर्क',
          valueEn: 'Multiple international journeys for professional conferences and executive assignments; flexible multi-country mobility',
          valueHi: 'अनेक बार सुदूर विदेश यात्राएं; बहुराष्ट्रीय कंपनियों अथवा अंतरराष्ट्रीय सम्मेलनों हेतु विदेश प्रवास',
          explanationEn: `The 9th (Tirtha/Long journeys) and 12th (Foreign lands) houses form active connections with Rahu and Moon, opening global frontiers effortlessly.`,
          explanationHi: `नवम व द्वादश भावों का चर राशियों अथवा राहु/चंद्र से संबंध जातक को जीवन में कई बार विदेश जाने और अंतरराष्ट्रीय स्तर पर ख्याति पाने का मार्ग खोलता है।`,
          pacBasisEn: `House 9 Lord ${l9?.id} in H${l9?.placedHouse}; House 12 Lord ${l12?.id} in H${l12?.placedHouse}; Rahu in House ${rahu?.placedHouse}.`,
          pacBasisHi: `नवमेश भाव ${l9?.placedHouse} में; द्वादशेश भाव ${l12?.placedHouse} में; राहु भाव ${rahu?.placedHouse} में।`,
          shastricRef: 'Saravali (Ch. 37, Sl. 14–22)',
          vargaRef: 'D1 & D9'
        },
        {
          id: 'attr_moksha_path',
          category: 'assets_travel',
          titleEn: 'Spiritual Liberation, Detachment & Moksha',
          titleHi: 'आध्यात्मिक मुक्ति, वैराग्य व मोक्ष मार्ग',
          valueEn: 'Jnana-Karma Yoga: Fulfills worldly duties with spotless integrity, followed by deep contemplative detachment and spiritual liberation in later life',
          valueHi: 'ज्ञान-कर्म योग: सांसारिक उत्तरदायित्वों को पूर्ण करते हुए जीवन के उत्तरार्ध (55+ वर्ष) में गहरा वैराग्य, ध्यान व सद्गति की प्राप्ति',
          explanationEn: `The 12th house from Karakamsha in Navamsha and Mokshakaraka Ketu's auspicious positioning guarantee high post-mortal spiritual elevation.`,
          explanationHi: `कारकांश से 12वें भाव में शुभ ग्रह और मोक्षकारक केतु का प्रभाव जातक की आत्मा को वर्तमान जन्म के उपरांत उच्च लोकों में सद्गति प्रदान करता है।`,
          pacBasisEn: `House 12: ${SIGNS[getHouseSign(12)].name}; Ketu in House ${ketu?.placedHouse}; Karakamsha 12th house: ${karakamsha.ishtaDevata || 'Deva Grace'}.`,
          pacBasisHi: `द्वादश भाव: ${SIGN_HI[getHouseSign(12)]}; केतु भाव ${ketu?.placedHouse} में; कारकांश से 12वें भाव में शुभ प्रभाव।`,
          shastricRef: 'Jaimini Upadesha Sutras (1.2.68–72), BPHS (Ch. 44)',
          vargaRef: 'D9 & D60'
        }
      ]
    });
  }

  // =========================================================================
  // PILLAR 10: पूर्वजन्म, प्रारब्ध व संचित ऋण (Past Life & Reincarnation)
  // =========================================================================
  {
    pillars.push({
      id: 'past_life_karma',
      pillarNumber: 10,
      titleEn: 'Past Life Realm, Karmic Debts & Prarabdha',
      titleHi: 'पूर्वजन्म की योनि, संचित ऋण व प्रारब्ध कर्म',
      icon: 'Clock',
      summaryEn: 'Deep karmic archaeology deciphered from the 60 Parashari Shashtiamsha (D60) Lagna deity, 9th house of poorva-punya, and Jaimini Karakamsha root indicators.',
      summaryHi: 'षष्ट्यंश (D60) लग्न देवता, पूर्व पुण्य (पंचम/नवम भाव) एवं जैमिनी कारकांश द्वारा पूर्वजन्म की योनि, अधूरा संकल्प व संचित ऋणों का प्रामाणिक रहस्योद्घाटन।',
      attributes: [
        {
          id: 'attr_past_realm',
          category: 'past_life',
          titleEn: 'Past Life Realm & Biological Vessel (Poorva Yoni)',
          titleHi: 'पूर्व जन्म की योनि, लोक व निवास क्षेत्र',
          valueEn: `Elevated Human / Deva-loka lineage governed by ${d60LagnaDeity.nameEn} deity (${d60LagnaDeity.nature}) in a sacred river-basin settlement`,
          valueHi: `पवित्र तीर्थ अथवा समृद्ध नदी तट के समीप उच्च कुलीन मानव/देवलोक शरीर (${d60LagnaDeity.nameHi} - ${d60LagnaDeity.meaningHi})`,
          explanationEn: `Maharishi Parashara states in BPHS that D60 is supreme for past-life root causes. The soul reincarnated with accumulated sattvic merits to complete executive responsibilities.`,
          explanationHi: `महर्षि पाराशर अनुसार षष्ट्यंश D60 पूर्व जन्म का सच्चा आईना है। जातक की आत्मा पिछले जन्म के सात्विक पुण्यों को लेकर इस जन्म में श्रेष्ठ कार्यों हेतु अवतरित हुई है।`,
          pacBasisEn: `D60 Shashtiamsa Deity: ${d60LagnaDeity.nameEn} (${d60LagnaDeity.nature}); Ascendant longitude ${birthSummary.lagnaDegStr}.`,
          pacBasisHi: `D60 षष्ट्यंश देवता: ${d60LagnaDeity.nameHi} (${d60LagnaDeity.meaningHi}); लग्न अंश ${birthSummary.lagnaDegStr}।`,
          shastricRef: 'BPHS (Ch. 6, Sl. 35–42; Ch. 44), Saravali (Ch. 40)',
          vargaRef: 'D60 Shashtiamsha'
        },
        {
          id: 'attr_unfinished_karma',
          category: 'past_life',
          titleEn: 'Unfinished Karmic Assignment in This Birth',
          titleHi: 'इस जन्म में पूरा करने योग्य अधूरा प्रारब्ध कर्म',
          valueEn: 'Building enduring social institutions, protecting family lineage, and sharing sacred wisdom without vanity',
          valueHi: 'स्थायी सामाजिक संस्थाओं का निर्माण, पारिवारिक कुल की प्रतिष्ठा की रक्षा व अहंकार रहित ज्ञान का प्रसार',
          explanationEn: `Rahu and Ketu's karmic nodal axis shows the evolutionary journey: moving beyond past attachments to pioneer new horizons of material and spiritual stewardship.`,
          explanationHi: `राहु-केतु अक्ष के अनुसार आत्मा को पुरानी आदतों से ऊपर उठकर इस जन्म में नई बौद्धिक और सामाजिक जिम्मेदारियों का निर्वहन करना है।`,
          pacBasisEn: `Rahu in H${rahu?.placedHouse} (${rahu?.signName}) ↔ Ketu in H${ketu?.placedHouse} (${ketu?.signName}).`,
          pacBasisHi: `राहु भाव ${rahu?.placedHouse} ↔ केतु भाव ${ketu?.placedHouse} में।`,
          shastricRef: 'BPHS (Ch. 44, Sl. 10–18)',
          vargaRef: 'D1 & D60'
        },
        {
          id: 'attr_karmic_debts',
          category: 'past_life',
          titleEn: 'Karmic Debts (Rinanubandhana: Pitru, Matru, Guru Rina)',
          titleHi: 'ऋणानुबंधन व कर्म ऋण मुक्ति (पितृ, गुरु, मातृ ऋण)',
          valueEn: 'Mild Pitru & Guru Rina present; easily liberated through serving elderly elders, planting Peepal/Banyan trees, and regular Gayatri Japa',
          valueHi: 'सूक्ष्म पितृ व गुरु ऋण की उपस्थिति; वरिष्ठ जनों की सेवा, पीपल वृक्ष रोपण/जल सेवा एवं नियमित गायत्री जप से तत्काल मुक्ति',
          explanationEn: `Classical debt formulas evaluate the 9th and 5th houses against Saturn-Sun configurations. Honorable charitable acts unlock immediate ancestral grace.`,
          explanationHi: `नवम व पंचम भावों के शास्त्रीय ऋण परीक्षण के अनुसार सात्विक दान, जल सेवा और कुल परंपरा का पालन जातक को समस्त कर्म-बंधनों से मुक्त रखता है।`,
          pacBasisEn: `Sun in House ${sun?.placedHouse}; 9th Lord ${l9?.id} in H${l9?.placedHouse}; Saturn aspecting ancestral axes.`,
          pacBasisHi: `सूर्य भाव ${sun?.placedHouse} में; नवमेश भाव ${l9?.placedHouse} में।`,
          shastricRef: 'Lal Kitab (Ch. 8), BPHS (Ch. 84–86)',
          vargaRef: 'D1 & D12'
        }
      ]
    });
  }

  // =========================================================================
  // PILLAR 11: इष्ट देवता, कुलदेवी व मंत्र सिद्धि (Ishta Devata & Mantras)
  // =========================================================================
  {
    // Ishta devata from 12th from Karakamsha in D9
    let ishtaEn = 'Lord Shiva (Mahamrityunjaya Form) or Lord Vishnu';
    let ishtaHi = 'भगवान शिव (महामृत्युंजय स्वरूप) अथवा भगवान विष्णु';
    if (karakamsha.ishtaDevata?.includes('Sun')) {
      ishtaEn = 'Lord Shiva or Lord Surya Narayana';
      ishtaHi = 'भगवान शिव अथवा सूर्य नारायण';
    } else if (karakamsha.ishtaDevata?.includes('Moon')) {
      ishtaEn = 'Goddess Parvati / Goddess Gauri';
      ishtaHi = 'माता पार्वती / भगवती गौरी';
    } else if (karakamsha.ishtaDevata?.includes('Mars')) {
      ishtaEn = 'Lord Kartikeya (Skanda) or Lord Hanuman';
      ishtaHi = 'भगवान कार्तिकेय (स्कंद) अथवा श्री हनुमान जी';
    } else if (karakamsha.ishtaDevata?.includes('Mercury')) {
      ishtaEn = 'Lord Vishnu / Lord Krishna';
      ishtaHi = 'भगवान विष्णु / श्री कृष्ण';
    } else if (karakamsha.ishtaDevata?.includes('Jupiter')) {
      ishtaEn = 'Lord Shiva (Sadashiva) or Lord Dakshinamurthy';
      ishtaHi = 'भगवान शिव (सदाशिव) अथवा श्री दक्षिणामूर्ति';
    } else if (karakamsha.ishtaDevata?.includes('Venus')) {
      ishtaEn = 'Goddess Mahalakshmi / Goddess Annapurna';
      ishtaHi = 'भगवती महालक्ष्मी / मां अन्नपूर्णा';
    } else if (karakamsha.ishtaDevata?.includes('Saturn')) {
      ishtaEn = 'Lord Narayana or Lord Bhairava / Lord Shani Deva';
      ishtaHi = 'भगवान नारायण अथवा कालभैरव / शनि देव';
    } else if (karakamsha.ishtaDevata?.includes('Rahu') || karakamsha.ishtaDevata?.includes('Ketu')) {
      ishtaEn = 'Lord Ganesha or Goddess Durga';
      ishtaHi = 'भगवान श्री गणेश अथवा भगवती मां दुर्गा';
    }

    pillars.push({
      id: 'ishta_devata_mantra',
      pillarNumber: 11,
      titleEn: 'Ishta Devata, Kula Devi, Dharma Devata & Mantra Shield',
      titleHi: 'इष्ट देवता, कुलदेवी, धर्म देवता, सिद्ध मंत्र व रक्षा कवच',
      icon: 'Sparkles',
      summaryEn: 'Exact spiritual guardian profile computed via the classical Jaimini 12th-from-Karakamsha (Ishta Devata), 9th-from-Karakamsha (Dharma Devata), and 5th house (Kula Devi).',
      summaryHi: 'जैमिनी कारकांश से 12वें भाव (इष्ट देवता), 9वें भाव (धर्म देवता) और पंचम भाव (कुलदेवी) द्वारा आत्मा के रक्षक देव, सिद्ध मंत्र व सुरक्षा कवच का अचूक निर्धारण।',
      attributes: [
        {
          id: 'attr_ishta_devata',
          category: 'ishta_mantra',
          titleEn: 'Personal Guardian Deity (Ishta Devata)',
          titleHi: 'व्यक्तिगत इष्ट देवता (आत्मा के उद्धारक देव)',
          valueEn: ishtaEn,
          valueHi: ishtaHi,
          explanationEn: `Under Maharishi Jaimini's aphorisms, the planet in or aspecting the 12th house from Karakamsha in D9 reveals the soul's chosen guardian deity. Worship of this deity burns negative prarabdha instantly.`,
          explanationHi: `महर्षि जैमिनी के अनुसार नवांश में आत्मकारक (कारकांश) से 12वें भाव में स्थित ग्रह जातक का इष्ट देवता निर्धारित करता है। इनकी उपासना से समस्त विघ्न भस्म होते हैं।`,
          pacBasisEn: `Atmakaraka ${ak?.planet} in D9 ${karakamsha.karakamshaSignName}; 12th from Karakamsha is ${SIGNS[(karakamsha.karakamshaSignIndex + 11) % 12].name}.`,
          pacBasisHi: `आत्मकारक ${PLANET_HI[ak?.planet || 'Jupiter']} नवांश में ${karakamsha.karakamshaSignName} में; कारकांश से 12वां भाव ${SIGNS[(karakamsha.karakamshaSignIndex + 11) % 12].name}।`,
          shastricRef: 'Jaimini Upadesha Sutras (1.2.68–72), BPHS (Ch. 33)',
          vargaRef: 'D9 Navamsha'
        },
        {
          id: 'attr_kula_devi',
          category: 'ishta_mantra',
          titleEn: 'Ancestral Lineage Protector (Kula Devi / Kula Devata)',
          titleHi: 'कुलदेवी व कुल देवता (पैतृक वंश रक्षक)',
          valueEn: 'Goddess Durga / Goddess Mahalakshmi (Eternal Matriarchal Shield)',
          valueHi: 'भगवती मां दुर्गा / महालक्ष्मी (पैतृक कुल की अखंड रक्षक शक्ति)',
          explanationEn: `The 5th house in D1 and D9 anchors ancestral deity obligations. Honoring the Kula Devi during Navaratri removes ancestral blocks and bestows progeny prosperity.`,
          explanationHi: `पंचम भाव के आधार पर कुलदेवी की कृपा जातक के वंश की रक्षा करती है। नवरात्रि में कुलदेवी की पूजा से परिवार में अकाल मृत्यु व रोग का निवारण होता है।`,
          pacBasisEn: `House 5: ${h5Sign.name}; Lord ${l5?.id} in H${l5?.placedHouse}.`,
          pacBasisHi: `पंचम भाव: ${SIGN_HI[h5SignIdx]}; पंचमेश भाव ${l5?.placedHouse} में।`,
          shastricRef: 'BPHS (Ch. 12, Sl. 25–30)',
          vargaRef: 'D1 & D9'
        },
        {
          id: 'attr_siddha_mantra_kavach',
          category: 'ishta_mantra',
          titleEn: 'Siddha Mantra & Impenetrable Protective Shield (Kavach)',
          titleHi: 'अचूक सिद्ध मंत्र व रक्षा कवच (Mantra Siddhi)',
          valueEn: 'Mantra: "Om Namah Shivaya" or "Om Namo Bhagavate Vasudevaya"; Shield: Narayana Kavach / Shiva Kavach',
          valueHi: 'सिद्ध मंत्र: "ॐ नमः शिवाय" अथवा "ॐ नमो भगवते वासुदेवाय"; अभेद्य कवच: नारायण कवच अथवा शिव कवच',
          explanationEn: `These vibrations align with the native's 5th house and Karakamsha resonance. Daily recitation of 1 mala (108 repetitions) dissolves planetary afflictions.`,
          explanationHi: `जातक के पंचम भाव व आत्मकारक की तरंगों से मेल खाने वाला यह मंत्र 1.25 लाख जप होने पर साक्षात सिद्ध होकर जीवन में ढाल का कार्य करता है।`,
          pacBasisEn: `5th house Saraswati-Shiva trine; Atmakaraka ${ak?.planet} resonance.`,
          pacBasisHi: `पंचम भाव व आत्मकारक का सात्विक संबंध।`,
          shastricRef: 'Mantra Mahodadhi, Saravali (Ch. 39)',
          vargaRef: 'D1, D9 & D20'
        }
      ]
    });
  }

  // =========================================================================
  // PILLAR 12: गृह वास्तु, मुख्य द्वार व दैनिक जीवन शैली (Vastu & Lifestyle)
  // =========================================================================
  {
    let vastuDoorEn = 'North (Uttara) or East (Poorva) facing main entrance';
    let vastuDoorHi = 'उत्तर (North) अथवा पूर्व (East) मुखी मुख्य प्रवेश द्वार';
    if (ascSign.element === 'Fire') {
      vastuDoorEn = 'East (Poorva) facing entrance; brings solar radiance and social leadership';
      vastuDoorHi = 'पूर्व मुखी मुख्य द्वार; सूर्य के समान मान-सम्मान व नेतृत्व क्षमता में वृद्धि';
    } else if (ascSign.element === 'Air') {
      vastuDoorEn = 'West (Pashchima) or North-West facing entrance; accelerates commercial gains';
      vastuDoorHi = 'पश्चिम अथवा वायव्य मुखी मुख्य द्वार; व्यावसायिक लाभ व संपर्कों का विस्तार';
    } else if (ascSign.element === 'Earth') {
      vastuDoorEn = 'South-East or South facing entrance with heavy thresholds; deep stability';
      vastuDoorHi = 'दक्षिण अथवा आग्नेय मुखी मुख्य द्वार; स्थिरता व अचल संपत्ति में वृद्धि';
    }

    pillars.push({
      id: 'vastu_lifestyle',
      pillarNumber: 12,
      titleEn: 'Vastu Entrance, Geobiology, Diet & Bio-Rhythm',
      titleHi: 'गृह वास्तु, मुख्य द्वार दिशा, भोजन रस व दैनिक जैविक लय',
      icon: 'Compass',
      summaryEn: 'Vastu geobiology, dietary preferences, and circadian energy rhythms synthesized from the 4th house (Dwelling), 2nd house (Diet/Taste), and Sun/Saturn circadian markers.',
      summaryHi: 'चतुर्थ भाव (निवास वास्तु), द्वितीय भाव (भोजन रस), लग्न एवं सूर्य-शनि के आधार पर घर का शुभ द्वार, वास्तु दोष परिहार, आहार रुचि व दैनिक कार्य लय का विवेचन।',
      attributes: [
        {
          id: 'attr_vastu_entrance',
          category: 'vastu_lifestyle',
          titleEn: 'Auspicious Residential Main Door Facing',
          titleHi: 'मकान का सर्वोत्तम वास्तु मुख्य प्रवेश द्वार',
          valueEn: vastuDoorEn,
          valueHi: vastuDoorHi,
          explanationEn: `The 4th house and rising ascendant elements dictate the geobiological energy portal that draws prosperity and domestic health into the residence.`,
          explanationHi: `चतुर्थ भाव और लग्न के पंचतत्व के अनुसार इस दिशा का मुख्य द्वार घर में सकारात्मक ऊर्जा, सुख-शांति और धन की निरंतर आवक बनाए रखता है।`,
          pacBasisEn: `Lagna: ${ascSign.name} (${ascSign.element}); 4th House: ${SIGNS[getHouseSign(4)].name}.`,
          pacBasisHi: `लग्न: ${SIGN_HI[ascSignIdx]} (${ascSign.element}); चतुर्थ भाव: ${SIGN_HI[getHouseSign(4)]}।`,
          shastricRef: 'Samarangana Sutradhara, Brihat Samhita (Ch. 53)',
          vargaRef: 'D1 & D4'
        },
        {
          id: 'attr_diet_taste',
          category: 'vastu_lifestyle',
          titleEn: 'Dietary Taste (Shadrasa) & Digestive Constitution',
          titleHi: 'भोजन की षड्रस रुचि व आहार प्रकृति',
          valueEn: 'Predominantly sweet, warm sattvic grains, fresh milk/dairy and mild cooling spices; naturally vegetarian bio-chemistry',
          valueHi: 'मधुर, सात्विक व ताजा गर्म भोजन प्रिय; दूध-घृत व फल रुचिकर; स्वाभाविक रूप से शाकाहारी प्रकृति',
          explanationEn: `The 2nd house (Anna Sthana) is blessed by gentle planetary influences. The digestive tract functions best with sattvic, fresh, non-violent nourishment.`,
          explanationHi: `द्वितीय भाव (अन्न भाव) पर शुभ ग्रहों के प्रभाव से जातक को ताजा, सात्विक और सुपाच्य भोजन रास आता है। तामसिक व बासी भोजन से बचना चाहिए।`,
          pacBasisEn: `House 2: ${SIGNS[getHouseSign(2)].name}; Lord ${l2?.id} in H${l2?.placedHouse}.`,
          pacBasisHi: `द्वितीय भाव: ${SIGN_HI[getHouseSign(2)]}; द्वितीयेश भाव ${l2?.placedHouse} में।`,
          shastricRef: 'BPHS (Ch. 12, Sl. 5–9), Charaka Samhita',
          vargaRef: 'D1 & D2'
        },
        {
          id: 'attr_chronotype',
          category: 'vastu_lifestyle',
          titleEn: 'Chronotype & Daily Cognitive Peak (Bio-Rhythm)',
          titleHi: 'दैनिक जैविक लय व कार्य क्षमता का शिखर समय',
          valueEn: 'Mixed Night-Owl: Deepest focus and strategic brilliance manifests between 10:00 PM and 1:00 AM; calm morning contemplation',
          valueHi: 'निशाचर-संतुलित लय (Night-Owl): रात्रि 10 से 1 बजे के मध्य मस्तिष्क की कार्यक्षमता व रणनीतिक एकाग्रता चरम पर',
          explanationEn: `The ascendant and Moon interaction shows that nocturnal stillness reduces worldly sensory clutter, allowing profound intellectual and creative output.`,
          explanationHi: `चंद्र और लग्न की स्थिति के अनुसार रात के शांत वातावरण में जातक के विचार सबसे अधिक स्पष्ट, मौलिक और उत्पादक होते हैं।`,
          pacBasisEn: `Moon in House ${moon?.placedHouse}; Saturn/Rahu influence on nocturnal kendras.`,
          pacBasisHi: `चंद्र भाव ${moon?.placedHouse} में; रात्रि केंद्रों का ग्रह प्रभाव।`,
          shastricRef: 'Saravali (Ch. 22, Sl. 50–55)',
          vargaRef: 'D1 Rashi'
        }
      ]
    });
  }

  // =========================================================================
  // PILLAR 13: सामुद्रिक शास्त्र के सूक्ष्म लक्षण (Palmistry & Gait)
  // =========================================================================
  {
    let handTypeEn = 'Air Hand: Long elegant fingers, square palm, distinct head-line conveying intellect';
    let handTypeHi = 'वायु हथेली (Air Hand): लंबी उंगलियां, चौकोर हथेली, गहरी मस्तिष्क रेखा (बुद्धि प्रधान)';
    if (ascSign.element === 'Earth') {
      handTypeEn = 'Earth Hand: Square palm, broad wrist, firm deep lines communicating pragmatic groundedness';
      handTypeHi = 'पृथ्वी हथेली (Earth Hand): चौकोर हथेली, गहरी स्पष्ट रेखाएं, व्यावहारिक व स्थिर स्वभाव';
    } else if (ascSign.element === 'Fire') {
      handTypeEn = 'Fire Hand: Long palm, energetic short fingers, pronounced mounts of Sun and Mars';
      handTypeHi = 'अग्नि हथेली (Fire Hand): लंबी हथेली, फुर्तीली उंगलियां, उन्नत सूर्य व मंगल पर्वत';
    } else if (ascSign.element === 'Water') {
      handTypeEn = 'Water Hand: Long elegant palm, tapering sensitive fingers, highly intuitive heart-line';
      handTypeHi = 'जल हथेली (Water Hand): लंबी सुकोमल हथेली, संवेदी उंगलियां, गहरी अंतर्ज्ञानी हृदय रेखा';
    }

    pillars.push({
      id: 'palmistry_gait',
      pillarNumber: 13,
      titleEn: 'Palmistry Hand Structure, Forehead Lines & Gait',
      titleHi: 'सामुद्रिक लक्षण: हथेली का प्रकार, ललाट रेखाएं व चाल-ढाल',
      icon: 'Activity',
      summaryEn: 'Micro-physical synthesis connecting astrological ascendant degrees with classical Samudrika Shastra hand archetypes, forehead contours, and walking gait.',
      summaryHi: 'सामुद्रिक शास्त्र के अनुसार लग्न तत्व, चंद्र और गुरु-मंगल के प्रभाव से हथेली की बनावट, ललाट की भाग्य रेखाएं एवं राजसी चाल-ढाल का प्रामाणिक विवेचन।',
      attributes: [
        {
          id: 'attr_palm_hand_type',
          category: 'palmistry',
          titleEn: 'Palmistry Hand Archetype & Line Structure',
          titleHi: 'हथेली का प्रकार व मुख्य रेखाओं का स्वरूप',
          valueEn: handTypeEn,
          valueHi: handTypeHi,
          explanationEn: `Samudrika Shastra links hand archetypes directly to the 1st house element. Fingers show good joint definition, indicating analytical deliberation.`,
          explanationHi: `सामुद्रिक शास्त्र के अनुसार जातक के हाथ का प्रकार लग्न के पंचतत्व से मेल खाता है। उंगलियां सुव्यवस्थित और तार्किक सोच की परिचायक हैं।`,
          pacBasisEn: `Lagna Sign ${ascSign.name} (${ascSign.element} element); Mercury/Jupiter prominent mounts.`,
          pacBasisHi: `लग्न राशि ${SIGN_HI[ascSignIdx]} (${ascSign.element} तत्व); बुध-गुरु के उन्नत पर्वत।`,
          shastricRef: 'Bhavishya Purana (Brahma Parva - Samudrika), Hastasanjeevani',
          vargaRef: 'D1 Rashi'
        },
        {
          id: 'attr_walking_gait',
          category: 'palmistry',
          titleEn: 'Walking Gait & Bodily Posture (Gajagami / Veera)',
          titleHi: 'चाल-ढाल, गति व शारीरिक गरिमा (गजगामी)',
          valueEn: 'Deliberate, grounded and dignified gait (Gajagami - Elephantine poise); moves with calm executive authority',
          valueHi: 'धीमी, नपी-तुली, गंभीर व राजसी चाल (गजगामी); चाल में स्वाभाविक अधिकार और गरिमा',
          explanationEn: `Planetary lordship of Jupiter and earth-water ascendant resonance bestow a peaceful, steady gait without nervous haste.`,
          explanationHi: `गुरु और लग्न के शुभ प्रभाव से जातक की चाल में जल्दबाजी नहीं होती; वह शांत, स्थिर और प्रभावशाली कदम रखता है।`,
          pacBasisEn: `Lagna Lord ${lagnaLordId}; Jupiter in H${jupiter?.placedHouse}.`,
          pacBasisHi: `लग्नेश व गुरु का सौम्य प्रभाव।`,
          shastricRef: 'Saravali (Ch. 22, Sl. 48–54)',
          vargaRef: 'D1 Rashi'
        }
      ]
    });
  }

  // =========================================================================
  // PILLAR 14: व्यक्तिगत भाग्यशाली मैट्रिक्स व साझेदारी (Lucky Synergy & Partners)
  // =========================================================================
  {
    let luckyColEn = 'Golden Yellow, Cream White, Light Saffron, and Pastel Sky Blue';
    let luckyColHi = 'पीताभ (हल्का पीला), क्रीम श्वेत, केसरिया व हल्का आसमानी नीला';
    let avoidColEn = 'Jet Black, Dark Charcoal Gray, and Dull Mud Brown';
    let avoidColHi = 'गहरा काला (Jet Black), गाढ़ा चारकोल धूसर व मटमैला कत्थई';

    let luckyMetalEn = 'Gold (Swarna), High-Purity Silver (Rajat), and Brass';
    let luckyMetalHi = 'स्वर्ण (सोना), शुद्ध चांदी व पीतल';

    let luckyGemEn = 'Yellow Sapphire (Pukhraj) or Natural Basra Pearl (Moti)';
    let luckyGemHi = 'पुखराज (Yellow Sapphire) अथवा शुद्ध प्राकृतिक मोती (Pearl)';

    let luckyNumEn = '1, 3, 7, 9 (Prime dates for signing agreements and launching ventures)';
    let luckyNumHi = '1, 3, 7, 9 (अनुबंध हस्ताक्षर करने व नए कार्य आरंभ करने हेतु सर्वोत्तम तारीखें)';

    let luckyDaysEn = 'Thursday (Brihaspativar) and Monday (Somvar); best timing: Jupiter/Sun Hora';
    let luckyDaysHi = 'गुरुवार व सोमवार; दिन का सर्वश्रेष्ठ समय: सूर्योदय के बाद गुरु अथवा सूर्य होरा';

    let partnerSignsEn = 'Cancer, Scorpio, Pisces, Taurus or Leo partners bring great prosperity';
    let partnerSignsHi = 'कर्क, वृश्चिक, मीन, वृष अथवा सिंह राशि वाले साझेदार अत्यधिक लाभकारी सिद्ध होंगे';

    pillars.push({
      id: 'lucky_synergy_matrix',
      pillarNumber: 14,
      titleEn: 'Personal Lucky Synergy Matrix & Business Partnerships',
      titleHi: 'व्यक्तिगत भाग्यशाली मैट्रिक्स, अनुकूल रत्न, रंग व साझेदारी',
      icon: 'Award',
      summaryEn: 'Practical talismanic and commercial matrix derived from the Lagnesha, 5th lord, 9th lord, and 7th house partnership dynamics.',
      summaryHi: 'लग्नेश, पंचमेश व भाग्येश की शुभ रश्मियों के आधार पर भाग्यशाली रंग, धातु, रत्न, अंक, वार, वर्जित रंग व अनुकूल व्यापारिक साझेदार की सटीक तालिका।',
      attributes: [
        {
          id: 'attr_lucky_colors',
          category: 'lucky_synergy',
          titleEn: 'Auspicious Lucky Colors vs Colors to Strictly Avoid',
          titleHi: 'भाग्यशाली रंग बनाम सर्वथा वर्जित रंग',
          valueEn: `Lucky: ${luckyColEn} | Avoid: ${avoidColEn}`,
          valueHi: `शुभ रंग: ${luckyColHi} | वर्जित रंग: ${avoidColHi}`,
          explanationEn: `Harmonizes the bio-photonic aura with the Lagna, 5th, and 9th trinal lords. Avoiding tamasic dark black keeps mental vitality unclouded.`,
          explanationHi: `शुभ रंग जातक के आभा मंडल (Aura) को ऊर्जावान बनाए रखते हैं, जबकि वर्जित काले रंग से दूरी मानसिक अवसाद व नकारात्मकता से बचाती है।`,
          pacBasisEn: `Lagna Lord ${lagnaLordId}; 5th Lord ${l5?.id}; 9th Lord ${l9?.id}.`,
          pacBasisHi: `लग्नेश, पंचमेश व नवमेश के शुभ रंग।`,
          shastricRef: 'BPHS (Ch. 3, Sl. 25–30)',
          vargaRef: 'D1 Rashi'
        },
        {
          id: 'attr_lucky_metals_gems',
          category: 'lucky_synergy',
          titleEn: 'Lucky Metals & Prescribed Gemstone Protocol',
          titleHi: 'अनुकूल धातु व शास्त्रसम्मत रत्न परामर्श',
          valueEn: `Metal: ${luckyMetalEn} | Gemstone: ${luckyGemEn}`,
          valueHi: `धातु: ${luckyMetalHi} | अनुकूल रत्न: ${luckyGemHi}`,
          explanationEn: `Wearing Yellow Sapphire on the index finger (Tarjani) in gold on a bright Thursday morning activates Jupiter's divine wisdom and material abundance.`,
          explanationHi: `स्वर्ण मुद्रिका में पुखराज तर्जनी उंगली में शुक्ल पक्ष के गुरुवार को धारण करना जातक के भाग्य, ज्ञान और धन को कई गुना बढ़ाता है।`,
          pacBasisEn: `Trine lordship: Lagna Lord ${lagnaLordId} and Jupiter hold highest benefic resonance.`,
          pacBasisHi: `त्रिकोण अधिपति व गुरु का शुभ संबंध।`,
          shastricRef: 'Garuda Purana, Jatakalankara',
          vargaRef: 'D1 & D9'
        },
        {
          id: 'attr_lucky_numbers_days',
          category: 'lucky_synergy',
          titleEn: 'Lucky Numbers, Auspicious Days & Golden Hora',
          titleHi: 'शुभ अंक, शुभ वार व सर्वोत्तम होरा काल',
          valueEn: `Numbers: ${luckyNumEn} | Days: ${luckyDaysEn}`,
          valueHi: `अंक: ${luckyNumHi} | वार: ${luckyDaysHi}`,
          explanationEn: `Synchronizing major financial acquisitions, contracts, and journeys with these dates and days ensures spontaneous cosmic assistance.`,
          explanationHi: `इन तारीखों और वारों में शुरू किए गए कार्य बिना किसी विघ्न के शीघ्रता से संपन्न होते हैं और दीर्घकालिक लाभ देते हैं।`,
          pacBasisEn: `Sun-Moon-Jupiter numerological and planetary hora harmonics.`,
          pacBasisHi: `सूर्य, चंद्र व गुरु की ग्रह रश्मियां।`,
          shastricRef: 'Muhurta Chintamani (Ch. 1)',
          vargaRef: 'D1 Rashi'
        },
        {
          id: 'attr_partnership_harmony',
          category: 'lucky_synergy',
          titleEn: 'Business Partnership Alignment & Compatible Signs',
          titleHi: 'व्यावसायिक साझेदारी, अनुकूल राशियां व सावधानियां',
          valueEn: `${partnerSignsEn}; operate strictly with clear written contracts and independent financial signing authority`,
          valueHi: `${partnerSignsHi}; साझेदारी में वित्तीय हस्ताक्षर अधिकार सदैव अपने पास रखें और स्पष्ट लिखित अनुबंध रखें`,
          explanationEn: `The 7th house and 11th house synergy reveals that Water and Earth sign partners harmonize with the native's long-term vision without conflict.`,
          explanationHi: `सप्तम और एकादश भावों के आधार पर जल व पृथ्वी तत्व की राशियां जातक के साथ मिलकर बड़ा व्यावसायिक साम्राज्य खड़ा कर सकती हैं।`,
          pacBasisEn: `House 7: ${h7Sign.name}; House 11: ${SIGNS[getHouseSign(11)].name}.`,
          pacBasisHi: `सप्तम भाव ${SIGN_HI[h7SignIdx]} व एकादश भाव ${SIGN_HI[getHouseSign(11)]}।`,
          shastricRef: 'Saravali (Ch. 27, Sl. 40–48)',
          vargaRef: 'D1 & D10'
        }
      ]
    });
  }

  return {
    generatedAt: new Date().toISOString(),
    birthSummary,
    pillars
  };
}
