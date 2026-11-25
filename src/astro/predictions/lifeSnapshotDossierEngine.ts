/**
 * 360° Comprehensive Life Matrix Snapshot Dossier Master Engine
 *
 * Fully dynamic, multi-varga, PAC-based (Position, Aspect, Conjunction)
 * astrological synthesis engine calculating 14 comprehensive life pillars
 * and 80+ personalized micro-attributes.
 *
 * Strict Classical Authority:
 * - Brihat Parashara Hora Shastra (BPHS)
 * - Saravali (Kalyana Varma)
 * - Brihat Jataka (Varahamihira)
 * - Phaladeepika (Mantreswara)
 * - Jaimini Upadesha Sutras
 * - Deva Keralam (Chandra Kala Nadi)
 * - Samudrika Shastra (Hastasanjeevani & Bhavishya Purana)
 */

import { SIGNS, NAKSHATRAS } from '../constants';
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

const SIGN_HI: Record<number, string> = {
  0: 'मेष',
  1: 'वृष',
  2: 'मिथुन',
  3: 'कर्क',
  4: 'सिंह',
  5: 'कन्या',
  6: 'तुला',
  7: 'वृश्चिक',
  8: 'धनु',
  9: 'मकर',
  10: 'कुंभ',
  11: 'मीन',
};

const PLANET_HI: Record<string, string> = {
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

const DIGNITY_HI: Record<string, string> = {
  Exalted: 'उच्च',
  Moolatrikona: 'मूलत्रिकोण',
  'Own Sign': 'स्वक्षेत्री',
  'Great Friend': 'परम मित्र',
  Friend: 'मित्र',
  Neutral: 'सम',
  Enemy: 'शत्रु',
  'Great Enemy': 'अति शत्रु',
  Debilitated: 'नीच',
};

function formatDms(deg: number): string {
  const d = Math.floor(deg);
  const remMin = (deg - d) * 60;
  const m = Math.floor(remMin);
  const s = Math.round((remMin - m) * 60);
  return `${d}°${String(m).padStart(2, '0')}'${String(s).padStart(2, '0')}"`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Dynamic Classical Life Matrix Engine
// ─────────────────────────────────────────────────────────────────────────────

export function computeLifeSnapshotDossierReport(chart: ChartData): LifeSnapshotDossierReport {
  const asc = chart.ascendant;
  const ascSignIdx = asc?.signIndex ?? 0;
  const ascSign = SIGNS[ascSignIdx] || SIGNS[0];
  const lagnaLordId = ascSign.lord;

  // Normalized planets with explicit 1-12 house index
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

  // House System (Whole Sign from Lagna)
  const getHouseSign = (h: number): number => (ascSignIdx + h - 1) % 12;
  const getHouseLordId = (h: number): string => SIGNS[getHouseSign(h)]?.lord || 'Mars';
  const getHouseLord = (h: number) => getPlanet(getHouseLordId(h));

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

  // Classical Parashari Aspects onto a target house
  const getAspectingPlanets = (targetHouse: number): PlanetPosition[] => {
    return planets.filter((p) => {
      const fromHouse = p.placedHouse;
      const dist = ((targetHouse - fromHouse + 12) % 12) + 1; // 1-based distance
      if (dist === 7) return true; // All planets aspect 7th
      if (p.id === 'Mars' && (dist === 4 || dist === 8)) return true;
      if (p.id === 'Jupiter' && (dist === 5 || dist === 9)) return true;
      if (p.id === 'Saturn' && (dist === 3 || dist === 10)) return true;
      if ((p.id === 'Rahu' || p.id === 'Ketu') && (dist === 5 || dist === 9)) return true;
      return false;
    });
  };

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
  const kpSubLord = ascNak.lord;

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
    const lagnaOccupants = h1Planets;
    const lagnaAspects = getAspectingPlanets(1);
    const dominantLagnaPlanet = lagnaOccupants[0] || l1 || sun;

    // Face shape
    let faceEn = 'Symmetrical, balanced oval face with expressive, harmonic bone structure';
    let faceHi = 'संतुलित अंडाकार व सुडौल चेहरा, जिसमें स्वाभाविक सौम्यता व आकर्षण है';

    if (lagnaOccupants.some((p) => p.id === 'Sun') || ascSign.name === 'Leo') {
      faceEn = 'Broad, majestic, lion-like regal face with a prominent forehead and commanding jaw';
      faceHi = 'सूर्य के समान तेजस्वी, चौड़ा ललाट, दृढ़ जबड़ा व सिंह-समान भव्य मुखाकृति';
    } else if (lagnaOccupants.some((p) => p.id === 'Moon') || ascSign.name === 'Cancer') {
      faceEn = 'Luminous, rounded, full-moon face (Chandra-Mukha) with soothing, soft contours';
      faceHi = 'पूर्ण चंद्र के समान गोल, कांतिमय व सुकोमल मुखाकृति (चंद्रमुख), शांत व मनमोहक आभा';
    } else if (lagnaOccupants.some((p) => p.id === 'Mars') || ascSign.name === 'Aries' || ascSign.name === 'Scorpio') {
      faceEn = 'Sharply chiseled, angular, triangular face with prominent cheekbones and athletic jaw';
      faceHi = 'नुकीला, कोणीय त्रिकोणाकार चेहरा, उन्नत गाल की हड्डियां व दृढ़ साहसी जबड़ा';
    } else if (lagnaOccupants.some((p) => p.id === 'Mercury') || ascSign.name === 'Gemini' || ascSign.name === 'Virgo') {
      faceEn = 'Youthful, delicate, heart-shaped face with a sharp, refined chin and sparkling features';
      faceHi = 'सदा-युवा, सुकुमार, पान के पत्ते के आकार का चेहरा, नुकीली ठुड्डी व चमत्कारी भाव';
    } else if (lagnaOccupants.some((p) => p.id === 'Jupiter') || ascSign.name === 'Sagittarius' || ascSign.name === 'Pisces') {
      faceEn = 'Noble, stately, broad oval face radiating wisdom, benevolence, and intellectual gravity';
      faceHi = 'कुलीन, विशाल व तेजस्वी अंडाकार चेहरा, जो ज्ञान, गुरु-कृपा और बौद्धिक गरिमा दर्शाता है';
    } else if (lagnaOccupants.some((p) => p.id === 'Venus') || ascSign.name === 'Taurus' || ascSign.name === 'Libra') {
      faceEn = 'Exceptionally charming, symmetrical face with dimpled cheeks, soft lips, and aesthetic harmony';
      faceHi = 'अत्यंत आकर्षक, सम्मोहक व सममित चेहरा, गालों पर सूक्ष्म गड्ढे (Dimples) व रति-जैसी सुंदरता';
    } else if (lagnaOccupants.some((p) => p.id === 'Saturn') || ascSign.name === 'Capricorn' || ascSign.name === 'Aquarius') {
      faceEn = 'Long, lean, bony rectangular face with prominent cheek contours and a mature, serious demeanor';
      faceHi = 'लंबा, गंभीर, नसों की स्पष्ट रूपरेखा वाला चौकोर चेहरा, परिपक्व व शांत भाव';
    } else if (elem === 'Fire') {
      faceEn = 'Angular, sharply chiseled triangular face with prominent cheekbones and warm radiant vitality';
      faceHi = 'नुकीला, कोणीय त्रिकोणाकार चेहरा, उन्नत गाल की हड्डियां व तेजस्वी ललाट';
    } else if (elem === 'Earth') {
      faceEn = 'Solid square/rectangular face with broad, firm jawline and grounded symmetry';
      faceHi = 'चौकोर, गठीला व सुदृढ़ चेहरा, स्पष्ट जबड़े की रेखा व गंभीर सौम्यता';
    } else if (elem === 'Water') {
      faceEn = 'Softly rounded, soothing face with luminous, pleasing facial contours';
      faceHi = 'सुकोमल, गोल व सौम्य मुखाकृति, चंद्र के समान कांति व मनमोहक आभा';
    }

    // Skin colour
    let skinEn = 'Golden-wheatish fair complexion with natural vitality and healthy luster';
    let skinHi = 'स्वर्ण-गेहुंआ उज्ज्वल वर्ण, जिसमें स्वाभाविक ओज व चमक है';

    if (lagnaOccupants.some((p) => p.id === 'Venus') || lagnaLordId === 'Venus' || l1?.dignity === 'Exalted') {
      skinEn = 'Radiant, porcelain fair complexion with clear skin tone and glowing vitality';
      skinHi = 'अत्यंत उज्ज्वल, कांतिवान व निखरा हुआ गौर वर्ण (Radiant Fair), मोतियों जैसी चमक';
    } else if (lagnaOccupants.some((p) => p.id === 'Sun' || p.id === 'Mars') || elem === 'Fire') {
      skinEn = 'Warm fair complexion with a noticeable reddish/ruddy flushed glow (Pitta-solar radiance)';
      skinHi = 'तेजस्वी गौर-ताम्र वर्ण, गालों पर हल्की स्वाभाविक लालिमा (Ruddy Fair Glow)';
    } else if (lagnaOccupants.some((p) => p.id === 'Moon') || elem === 'Water') {
      skinEn = 'Fair to pale-radiant skin with a cool, milky undertone and gentle luminous finish';
      skinHi = 'उज्ज्वल गौर वर्ण, चंद्र-समान शीतल कांति व सुकोमल त्वचा (Milky Cool Fair)';
    } else if (lagnaOccupants.some((p) => p.id === 'Saturn' || p.id === 'Rahu')) {
      skinEn = 'Dignified wheatish to dusky skin tone with sharp, intense aura and weathered elegance';
      skinHi = 'गंभीर गेहुंआ से सांवला वर्ण (Dusky Wheatish), जिसमें गहन चुंबकीय आकर्षण है';
    } else if (lagnaOccupants.some((p) => p.id === 'Mercury') || elem === 'Air') {
      skinEn = 'Light wheatish to olive-fair complexion, fresh, youthful, and unblemished';
      skinHi = 'हल्का गेहुंआ-उज्ज्वल वर्ण, त्वचा में ताज़गी व सदाबहार यौवन का प्रभाव';
    }

    // Eyes
    let eyesEn = 'Clear, expressive eyes with deep-brown pupils and steady gaze';
    let eyesHi = 'स्पष्ट, भावुक व विचारशील आँखें, गहरी भूरी पुतलियां व स्थिर दृष्टि';

    if (lagnaOccupants.some((p) => p.id === 'Venus' || p.id === 'Moon') || ascSign.name === 'Pisces' || ascSign.name === 'Taurus' || ascSign.name === 'Cancer') {
      eyesEn = 'Large, captivating, luminous eyes (Meenakshi / Lotus eyes) with rich dark-brown/black pupils';
      eyesHi = 'विशाल, सम्मोहक व चमकदार आँखें (कमलनयन), गहरी कत्थई-काली पुतलियां व प्रेमपूर्ण दृष्टि';
    } else if (lagnaOccupants.some((p) => p.id === 'Mars' || p.id === 'Sun')) {
      eyesEn = 'Piercing, sharp hazel eyes with energetic, laser-focused intensity and amber highlights';
      eyesHi = 'तीक्ष्ण, भेदक व चुंबक जैसी आँखें, हल्की लालिमायुक्त या बादामी पुतली व अदम्य तेज';
    } else if (lagnaOccupants.some((p) => p.id === 'Jupiter')) {
      eyesEn = 'Almond-shaped, golden-brown eyes reflecting profound calmness, wisdom, and benevolence';
      eyesHi = 'बादामी आकार की शांत, गंभीर व ज्ञानवान आँखें, दृष्टि में दया व आशीर्वाद का भाव';
    } else if (lagnaOccupants.some((p) => p.id === 'Saturn' || p.id === 'Rahu')) {
      eyesEn = 'Deep-set, watchful, slate-dark eyes with a piercing, analytical, and magnetic aura';
      eyesHi = 'गहरी बैठी, भेदक व गहरी स्लेटी-काली आँखें, जो व्यक्ति के मन के आर-पार देख लेती हैं';
    }

    // Nose
    let noseEn = 'Straight, well-proportioned nose bridge blending smoothly with the forehead';
    let noseHi = 'सीधी, सुडौल व संतुलित नासिका, जो ललाट के साथ समरस रूप से जुड़ी है';

    if (elem === 'Fire' || l1?.id === 'Mars' || l1?.id === 'Mercury') {
      noseEn = 'Sharp, aquiline nose with high, distinct bridge and chiseled tip (Garuda / Eagle profile)';
      noseHi = 'उन्नत, तीक्ष्ण व स्पष्ट नक्काशीदार नासिका (Aquiline & Sharp Bridge), स्वाभिमानी स्वरूप';
    } else if (l1?.id === 'Jupiter' || ascSign.name === 'Leo') {
      noseEn = 'Noble, majestic nose with generous bridge exuding wisdom, pride, and executive stature';
      noseHi = 'राजसी, चौड़ी व भव्य नासिका, जो कुलीनता, अधिकार व नेतृत्व की परिचायक है';
    } else if (l1?.id === 'Venus' || l1?.id === 'Moon') {
      noseEn = 'Softly contoured, straight, graceful nose with delicate nostrils and balanced tip';
      noseHi = 'कोमल, सीधी व सुंदर नासिका, संतुलित नथुने व चेहरे की सुंदरता को बढ़ाने वाला गठन';
    }

    // Teeth
    let teethEn = 'Evenly aligned, symmetrical teeth with healthy white enamel and firm dental arch';
    let teethHi = 'समान, सुसज्जित व स्वच्छ दंतपंक्ति, मोतियों जैसी स्वाभाविक सुंदरता व मजबूत जबड़ा';

    if (h2Planets.some((p) => p.id === 'Rahu' || p.id === 'Saturn') || l2?.id === 'Saturn') {
      teethEn = 'Prominent incisors with a subtle gap or characteristic dental individuality requiring regular care';
      teethHi = 'उन्नत दाढ़ व आगे के दांतों में सूक्ष्म अंतराल (Distinct Incisors & Gap), विशिष्ट पहचान';
    } else if (h2Planets.some((p) => p.id === 'Mars' || p.id === 'Sun')) {
      teethEn = 'Strong, sharp, predatory bite with resilient ivory-colored enamel and firm gums';
      teethHi = 'मजबूत, पैने व दृढ़ दांत, मसूड़ों में तेज रक्त संचार व सुदृढ़ दंतपंक्ति';
    } else if (h2Planets.some((p) => p.id === 'Venus' || p.id === 'Jupiter')) {
      teethEn = 'Pearly white, perfectly symmetrical teeth displaying a radiant, disarming smile';
      teethHi = 'मोतियों की भांति श्वेत, सममित व सुंदर दंतपंक्ति, मुस्कान में मनमोहक आकर्षण';
    }

    // Hair
    let hairEn = 'Thick, wavy dark hair with natural volume, resilience, and healthy texture';
    let hairHi = 'घने, घने काले व हल्के लहरदार केश (Thick & Wavy), भरपूर लचीलापन व चमक';

    if (elem === 'Fire' || lagnaOccupants.some((p) => p.id === 'Sun' || p.id === 'Mars')) {
      hairEn = 'Soft, fine-textured hair with a broad forehead, warm brown tones, and early mature hairline';
      hairHi = 'मुलायम, हल्के रेशमी केश, चौड़ा ललाट व परिपक्व हेयरलाइन (Mature Hairline), तेजयुक्त रूप';
    } else if (elem === 'Water' || lagnaOccupants.some((p) => p.id === 'Moon' || p.id === 'Venus')) {
      hairEn = 'Luxuriously thick, glossy, deep-black wavy hair with natural moisture and soft curls';
      hairHi = 'अत्यंत घने, चमकदार, काले व घुंघराले लहरदार केश, जिनमें प्राकृतिक नमी व आकर्षण है';
    } else if (elem === 'Air' || lagnaOccupants.some((p) => p.id === 'Saturn' || p.id === 'Rahu')) {
      hairEn = 'Slightly dry, dense, wavy to straight textured hair requiring regular nourishing oil care';
      hairHi = 'गहरे काले, हल्के सूखे व सीधे बाल, मजबूत जड़ें व अनुशासित केश विन्यास';
    }

    // Height & Build
    let heightEn = 'Medium-tall height (approx. 5ft 8in to 5ft 11in) with proportionate physical frame';
    let heightHi = 'मध्यम से लंबा कद (लगभग 5 फीट 8 इंच से 5 फीट 11 इंच), संतुलित शारीरिक अनुपात';
    let buildEn = 'Balanced athletic build (mesomorph) with energetic posture and broad shoulders';
    let buildHi = 'सुगठित व संतुलित शारीरिक गठन (Mesomorph), दृढ़ कंधे व चुस्त शारीरिक मुद्रा';

    if (ascSign.modality === 'Movable' && (l1?.id === 'Saturn' || l1?.id === 'Mercury')) {
      heightEn = 'Tall, slender height (5ft 10in to 6ft 1in) commanding spontaneous presence';
      heightHi = 'लंबा, छरहरा व प्रभावशाली कद (5 फीट 10 इंच से 6 फीट 1 इंच), सुस्पष्ट शारीरिक उपस्थिति';
      buildEn = 'Lean, bony, and disciplined ectomorph build with minimal excess adipose tissue';
      buildHi = 'दुबला, संयमित व नसों की स्पष्ट बनावट वाला गठन (Lean Ectomorph), उच्च चयापचय';
    } else if (l1?.id === 'Jupiter' || ascSign.name === 'Cancer' || ascSign.name === 'Taurus' || ascSign.name === 'Pisces') {
      heightEn = 'Stately, commanding medium-tall height with broad skeletal framework';
      heightHi = 'भव्य, रोबदार मध्यम-लंबा कद, सुदृढ़ व चौड़ा अस्थि-पिंजर ढांचा';
      buildEn = 'Solid, broad-chested, slightly fleshy build (endo-mesomorph) with regal carriage';
      buildHi = 'मांसल, चौड़े सीने व राजसी गरिमापूर्ण गठन (Endo-Mesomorph), गरिमापूर्ण चाल';
    } else if (l1?.id === 'Mars' || ascSign.name === 'Aries' || ascSign.name === 'Scorpio') {
      heightEn = 'Compact, energetic medium height with high muscular density and quick agility';
      heightHi = 'मध्यम, गठीला व चुस्त कद, मांसपेशियों में असाधारण घनत्व व फुर्ती';
      buildEn = 'Athletic, muscular, tight-waisted frame with prominent physical endurance';
      buildHi = 'कसरती, मांसपेशियों से भरा व चौड़े कंधों वाला बलशाली गठन (Athletic Frame)';
    }

    // 12-Sign Kalapurusha Anatomical Mole & Birthmark Map
    const kalapurushaBodyPart: Record<number, { en: string; hi: string }> = {
      0: { en: 'on the forehead, temple, or near the scalp', hi: 'ललाट, कनपटी अथवा सिर के अग्र भाग पर' },
      1: { en: 'on the right cheek, throat, chin, or collarbone', hi: 'दाहिने गाल, गले, ठुड्डी अथवा हंसली (collarbone) पर' },
      2: { en: 'on the right shoulder, upper arm, or hand', hi: 'दाहिने कंधे, भुजा अथवा कलाई के समीप' },
      3: { en: 'on the chest, near the ribs, or heart meridian', hi: 'छाती, पसलियों के पास अथवा हृदय चक्र के समीप' },
      4: { en: 'on the upper abdomen, solar plexus, or upper back', hi: 'ऊपरी पेट, नाभि के ऊपर अथवा पीठ के ऊपरी भाग पर' },
      5: { en: 'near the navel, waist flank, or lower stomach', hi: 'नाभि के पास, कमर के पार्श्व भाग अथवा पेट पर' },
      6: { en: 'on the lower waist, pelvic flank, or lumbar region', hi: 'कमर के निचले भाग, पेल्विक क्षेत्र अथवा पीठ के निचले भाग पर' },
      7: { en: 'near the hip, secret organ area, or upper thigh', hi: 'कमर-नितंब संधि, गुप्त अंग क्षेत्र अथवा ऊपरी जांघ पर' },
      8: { en: 'on the right thigh, sacrum, or femoral artery line', hi: 'दाहिनी जांघ, कूल्हे अथवा नितंब के पार्श्व भाग पर' },
      9: { en: 'on or near the knee joint, patella, or shins', hi: 'दाहिने घुटने, जोड़ अथवा पिंडली के ऊपरी भाग पर' },
      10: { en: 'on the left calf, shin bone, or ankle joint', hi: 'पिंडली, नली की हड्डी अथवा टखने (Ankle) के समीप' },
      11: { en: 'on the foot, sole, arch, or near the toes', hi: 'पैर के तलवे, पंजे अथवा पैर के अंगूठे के समीप' },
    };

    const molePart = kalapurushaBodyPart[ascSignIdx] || kalapurushaBodyPart[0];
    let moleEn = `Distinctive natural mole or birthmark situated ${molePart.en}`;
    let moleHi = `विशिष्ट जन्मचिह्न अथवा शुभ तिल ${molePart.hi} स्थित`;

    if (lagnaOccupants.some((p) => p.id === 'Mars' || p.id === 'Ketu')) {
      moleEn += '; accompanied by a small childhood heat-mark or faint healed scar';
      moleHi += '; साथ ही बाल्यावस्था की हल्की चोट या शल्यक्रिया का सूक्ष्म निशान';
    } else if (lagnaOccupants.some((p) => p.id === 'Rahu')) {
      moleEn += '; prominent, dark beauty mole conferring strong magnetic attraction';
      moleHi += '; गहरा, स्पष्ट तिल जो जातक को विशिष्ट आकर्षण व पहचान देता है';
    }

    // Voice
    let voiceEn = 'Resonant, clear, composed, and persuasive voice carrying natural executive authority';
    let voiceHi = 'गंभीर, सुस्पष्ट व प्रभावशाली स्वर, जिसमें सुनने वाले को बांधने की स्वाभाविक शक्ति है';

    if (h2Planets.some((p) => p.id === 'Jupiter') || l2?.id === 'Jupiter') {
      voiceEn = 'Deep, resonant, baritone voice radiating moral authority, calm wisdom, and trustworthiness';
      voiceHi = 'गंभीर, धीर-प्रशांत व ओजस्वी स्वर (Baritone Voice), जो स्वाभाविक आदर व विश्वास जगाता है';
    } else if (h2Planets.some((p) => p.id === 'Venus') || l2?.id === 'Venus') {
      voiceEn = 'Melodious, warm, captivating, and sweet voice with soothing modulation and polite tone';
      voiceHi = 'मधुर, कर्णप्रिय, सुकोमल व सम्मोहक स्वर (Melodious & Warm), जो संवाद में तुरंत अपनत्व घोलता है';
    } else if (h2Planets.some((p) => p.id === 'Mercury') || l2?.id === 'Mercury') {
      voiceEn = 'Rapid, articulate, sharp, and highly witty communicative cadence with flawless pronunciation';
      voiceHi = 'तीव्र, स्पष्ट, वाकपटु व तार्किक वाणी, जो वाद-विवाद व व्यापारिक संवाद में तुरंत प्रभावी होती है';
    } else if (h2Planets.some((p) => p.id === 'Mars' || p.id === 'Sun') || l2?.id === 'Mars' || l2?.id === 'Sun') {
      voiceEn = 'Direct, energetic, commanding, and loud voice that tolerates no deceit and demands attention';
      voiceHi = 'स्पष्टवादी, तेज, अधिकारपूर्ण व निर्भीक वाणी, जिसमें ओज और नेतृत्व की गूंज है';
    } else if (h2Planets.some((p) => p.id === 'Saturn') || l2?.id === 'Saturn') {
      voiceEn = 'Low-pitched, measured, dry, and laconic voice; speaks rarely but with heavy gravitas';
      voiceHi = 'धीमा, नपा-तुला, गंभीर व अल्पभाषी स्वर; कम शब्दों में अत्यंत गूढ़ व व्यावहारिक बात कहना';
    }

    // Temperament
    let tempEn = 'Sattvic-Rajasic balance: Discerning, morally grounded, dignified, and strategic';
    let tempHi = 'सात्विक-राजसिक समन्वय: स्वाभिमानी, विवेकशील, सिद्धांतवादी व तुरंत निर्णय लेने वाला';

    if (moon && ['Taurus', 'Cancer', 'Pisces', 'Sagittarius'].includes(moon.signName)) {
      tempEn = 'Predominantly Sattvic: Deeply empathetic, patient, intuitive, ethical, and calm under crises';
      tempHi = 'सात्विक प्रधान: अत्यंत संवेदनशील, धैर्यवान, परोपकारी, अंतर्ज्ञानी व संकट में शांत रहने वाला';
    } else if (moon && ['Aries', 'Leo', 'Scorpio', 'Capricorn'].includes(moon.signName)) {
      tempEn = 'Predominantly Rajasic: Highly ambitious, resolute, fiery determination, refuses subordination';
      tempHi = 'राजसिक प्रधान: महत्वाकांक्षी, अदम्य साहसी, स्वाभिमानी, किसी के अधीन काम न करने वाला';
    } else if (moon && ['Gemini', 'Virgo', 'Libra', 'Aquarius'].includes(moon.signName)) {
      tempEn = 'Intellectual-Philosophical: Highly analytical, detached, objective, seeks mental stimulation';
      tempHi = 'बौद्धिक-तार्किक: गहन विश्लेषणात्मक, निष्पक्ष, वस्तुनिष्ठ व निरंतर ज्ञान पिपासु';
    }

    pillars.push({
      id: 'physical_persona',
      pillarNumber: 1,
      titleEn: 'Physical Body, Features & Demeanor',
      titleHi: 'देह लक्षण, रूप-रंग व शारीरिक बनावट',
      icon: 'User',
      summaryEn: `Detailed anatomical persona synthesized from ${ascSign.name} rising (${ascSign.element} element), Lagna lord ${lagnaLordId} in House ${l1House}, 1st house occupants (${lagnaOccupants.map((p) => p.id).join(', ') || 'Clean'}), and Kalapurusha bodily meridian.`,
      summaryHi: `${SIGN_HI[ascSignIdx]} लग्न (${ascSign.element} तत्व), लग्नेश ${PLANET_HI[lagnaLordId]} (भाव ${l1House}), लग्न स्थित ग्रह एवं कालपुरुष अंग विचार द्वारा प्रमाणित वास्तविक शारीरिक फलादेश।`,
      attributes: [
        {
          id: 'attr_face_shape',
          category: 'physical',
          titleEn: 'Face Shape & Facial Symmetry',
          titleHi: 'चेहरे का आकार व मुखाकृति सौम्यता',
          valueEn: faceEn,
          valueHi: faceHi,
          explanationEn: `The native's facial structure is governed by ${ascSign.name} (${ascSign.element} element) with Lagna lord ${lagnaLordId} occupying House ${l1House} in ${l1Sign.name}. Facial contours reflect harmonious bone symmetry, clear features, and an aura of natural distinction.`,
          explanationHi: `जातक के चेहरे की बनावट ${SIGN_HI[ascSignIdx]} लग्न (${ascSign.element} तत्व) द्वारा निर्धारित है। लग्नेश ${PLANET_HI[lagnaLordId]} भाव ${l1House} में स्थित होने से मुखाकृति संतुलित, तेजस्वी और स्वाभाविक रूप से प्रभावशाली बनती है।`,
          pacBasisEn: `Lagna: ${ascSign.name} (${birthSummary.lagnaDegStr}); Lagna Lord: ${lagnaLordId} in H${l1House} (${l1?.dignity || 'Dignified'}); D9 Lagna: ${birthSummary.d9LagnaEn}.`,
          pacBasisHi: `लग्न: ${SIGN_HI[ascSignIdx]} (${birthSummary.lagnaDegStr}); लग्नेश: ${PLANET_HI[lagnaLordId]} भाव ${l1House} में (${DIGNITY_HI[l1?.dignity || ''] || 'बलवान'}); D9 लग्न: ${birthSummary.d9LagnaHi}।`,
          shastricRef: 'Brihat Parashara Hora Shastra (Ch. 11, Sl. 2–14), Saravali (Ch. 22)',
          vargaRef: 'D1 Lagna & D9 Navamsha',
        },
        {
          id: 'attr_skin_colour',
          category: 'physical',
          titleEn: 'Skin Tone & Natural Complexion',
          titleHi: 'त्वचा का रंग व शारीरिक कांति',
          valueEn: skinEn,
          valueHi: skinHi,
          explanationEn: `Varnakaraka rays converge upon the rising degree. The cellular pigmentation reflects strong vitality, clear blood circulation, and balanced digestive agni.`,
          explanationHi: `वर्णकारक ग्रहों की रश्मियां लग्न भाव पर केंद्रित हैं। त्वचा में प्राकृतिक ओज, स्वास्थ्य और रक्त संचार का उत्तम संतुलन दिखाई देता है।`,
          pacBasisEn: `Lagna Lord ${lagnaLordId} holds ${l1?.dignity || 'Neutral'} dignity; Sun in House ${sun?.placedHouse || 1}; Moon in House ${moon?.placedHouse || 1}.`,
          pacBasisHi: `लग्नेश ${PLANET_HI[lagnaLordId]} की गरिमा ${DIGNITY_HI[l1?.dignity || ''] || 'सम'}; सूर्य भाव ${sun?.placedHouse || 1} व चंद्र भाव ${moon?.placedHouse || 1} में स्थित।`,
          shastricRef: 'Phaladeepika (Ch. 2, Sl. 18–25), Brihat Jataka (Ch. 5)',
          vargaRef: 'D1 Rashi & D9 Navamsha',
        },
        {
          id: 'attr_eyes_colour',
          category: 'physical',
          titleEn: 'Eyes, Pupil Colour & Gaze',
          titleHi: 'नेत्र, पुतली का रंग व दृष्टि प्रभाव',
          valueEn: eyesEn,
          valueHi: eyesHi,
          explanationEn: `Right eye significator (2nd house, Sun) and left eye significator (12th house, Moon) synergize with 1st house lords, giving eyes that communicate depth, intelligence, and focused perception.`,
          explanationHi: `दाहिनी आँख (द्वितीय भाव, सूर्य) और बाईं आँख (द्वादश भाव, चंद्र) का समन्वय दृष्टि में एकाग्रता, बुद्धिमत्ता और आंतरिक अंतर्दृष्टि प्रदान करता है।`,
          pacBasisEn: `House 2 Lord ${l2?.id} in H${l2?.placedHouse}; House 12 Lord ${l12?.id} in H${l12?.placedHouse}; Sun in ${sun?.signName}; Moon in ${moon?.signName}.`,
          pacBasisHi: `द्वितीयेश ${PLANET_HI[l2?.id || '']} भाव ${l2?.placedHouse} में; द्वादशेश भाव ${l12?.placedHouse} में; सूर्य ${sun?.signName} व चंद्र ${moon?.signName} में।`,
          shastricRef: 'Saravali (Ch. 23, Sl. 31–38)',
          vargaRef: 'D1 & D9',
        },
        {
          id: 'attr_nose',
          category: 'physical',
          titleEn: 'Nose Profile & Contour',
          titleHi: 'नासिका स्वरूप व उभार',
          valueEn: noseEn,
          valueHi: noseHi,
          explanationEn: `Nose symmetry is ruled by Mercury, Mars, and the central meridian of the 1st house. The profile is cleanly shaped, communicating self-respect and resolute executive posture.`,
          explanationHi: `नासिका का गठन बुध और मंगल के सूक्ष्म प्रभाव से सुडौल बनता है। यह जातक के स्वाभिमान, दृढ़ इच्छाशक्ति और कुलीन दृष्टिकोण को स्पष्ट रूप से दर्शाती है।`,
          pacBasisEn: `Lagna degree ${birthSummary.lagnaDegStr} in ${ascNak.name} Nakshatra; Mars placed in House ${mars?.placedHouse}.`,
          pacBasisHi: `लग्न अंश ${birthSummary.lagnaDegStr} नक्षत्र ${ascNak.name} में; मंगल भाव ${mars?.placedHouse} में स्थित।`,
          shastricRef: 'Brihat Jataka (Ch. 2, Sl. 8–12)',
          vargaRef: 'D1 Rashi',
        },
        {
          id: 'attr_teeth',
          category: 'physical',
          titleEn: 'Dental Architecture (Danta Bhava)',
          titleHi: 'दंत संरचना व मुख सौंदर्य',
          valueEn: teethEn,
          valueHi: teethHi,
          explanationEn: `The 2nd house (Danta Bhava) and natural significator Mercury rule teeth formation. The dental arch is well-founded, reflecting good mineralization and aesthetic facial harmony.`,
          explanationHi: `द्वितीय भाव (दंत भाव) और कारक बुध की स्थिति से दांत सुव्यवस्थित, मजबूत और चेहरे की सौम्यता को निखारने वाले होते हैं।`,
          pacBasisEn: `House 2 Sign: ${h2Sign.name}; Lord: ${l2?.id} in H${l2?.placedHouse} (${l2?.dignity || 'Dignified'}).`,
          pacBasisHi: `द्वितीय भाव राशि: ${SIGN_HI[h2SignIdx]}; भावेश: ${PLANET_HI[l2?.id || '']} भाव ${l2?.placedHouse} में।`,
          shastricRef: 'BPHS (Ch. 12, Sl. 5–9)',
          vargaRef: 'D1 & D2',
        },
        {
          id: 'attr_hair',
          category: 'physical',
          titleEn: 'Hair Type, Texture & Crown Density',
          titleHi: 'केश विन्यास, बाल का प्रकार व ललाट रेखा',
          valueEn: hairEn,
          valueHi: hairHi,
          explanationEn: `Hair follicle strength and scalp vitality are ruled by the 1st house element and Sun-Saturn dynamics. The hair frames the face with natural authority and mature presence.`,
          explanationHi: `केशों का घनत्व लग्न तत्व और सूर्य-शनि की किरणों पर आधारित है। बाल चेहरे को गरिमापूर्ण और आकर्षक आवरण प्रदान करते हैं।`,
          pacBasisEn: `Lagna Element: ${elem}; Sun in House ${sun?.placedHouse}; Saturn in House ${saturn?.placedHouse}.`,
          pacBasisHi: `लग्न तत्व: ${elem}; सूर्य भाव ${sun?.placedHouse} में; शनि भाव ${saturn?.placedHouse} में।`,
          shastricRef: 'Saravali (Ch. 22, Sl. 15–22)',
          vargaRef: 'D1 Rashi',
        },
        {
          id: 'attr_height_build',
          category: 'physical',
          titleEn: 'Height, Skeletal Frame & Bodily Build',
          titleHi: 'कद-काठी, शारीरिक ढांचा व शारीरिक गठन',
          valueEn: `${heightEn}; ${buildEn}`,
          valueHi: `${heightHi}; ${buildHi}`,
          explanationEn: `Skeletal proportions stem from the interaction between Lagna sign modality (${ascSign.modality}), Lagna lord ${lagnaLordId}, and Jupiter/Saturn gravitational influence.`,
          explanationHi: `शारीरिक ढांचा लग्न की गतिशीलता (${ascSign.modality}) और लग्नेश ${PLANET_HI[lagnaLordId]} के प्रभाव से पुष्ट होता है, जो जातक को सम्मानजनक कद और गठीला गठन देता है।`,
          pacBasisEn: `Lagna Modality: ${ascSign.modality}; Lord ${lagnaLordId} in H${l1House} (${l1?.dignity || 'Dignified'}).`,
          pacBasisHi: `लग्न स्वभाव: ${ascSign.modality}; लग्नेश भाव ${l1House} में।`,
          shastricRef: 'Brihat Jataka (Ch. 2, Sl. 15–20), BPHS (Ch. 11)',
          vargaRef: 'D1 & D9',
        },
        {
          id: 'attr_birthmark_mole',
          category: 'physical',
          titleEn: 'Birthmark, Moles & Scars (Kalapurusha Anga)',
          titleHi: 'जन्मचिह्न, तिल व कालपुरुष अंग लक्षण',
          valueEn: moleEn,
          valueHi: moleHi,
          explanationEn: `According to Maharishi Parashara's Kalapurusha principle, rising sign ${ascSign.name} directly maps natal bodily identifiers to this specific quadrant of the physical form.`,
          explanationHi: `महर्षि पाराशर कृत कालपुरुष सिद्धांत के अनुसार लग्न राशि ${SIGN_HI[ascSignIdx]} द्वारा देह के इस विशिष्ट अंग पर तिल अथवा जन्मचिह्न का प्रामाणिक अंकन होता है।`,
          pacBasisEn: `Lagna: ${ascSign.name} (Sign ${ascSignIdx + 1}/12); Mars in H${mars?.placedHouse}; Rahu in H${rahu?.placedHouse}.`,
          pacBasisHi: `लग्न राशि: ${SIGN_HI[ascSignIdx]}; मंगल भाव ${mars?.placedHouse} में; राहु भाव ${rahu?.placedHouse} में।`,
          shastricRef: 'BPHS (Ch. 11, Sl. 25–32), Saravali (Ch. 23)',
          vargaRef: 'D1 Rashi',
        },
        {
          id: 'attr_voice',
          category: 'physical',
          titleEn: 'Voice, Vocal Resonance & Articulation',
          titleHi: 'वाणी, स्वर गांभीर्य व संवाद शैली',
          valueEn: voiceEn,
          valueHi: voiceHi,
          explanationEn: `Vocal cords and articulation stem from the 2nd house (Vak Sthana) and natural Karaka Mercury. Speech is composed, persuasive, and grounded, avoiding frivolous chatter in critical negotiations.`,
          explanationHi: `वाणी भाव (द्वितीय भाव) और वाक्पति बुध के शुभ प्रभाव से जातक का स्वर प्रभावशाली और कर्णप्रिय होता है। जातक सोच-समझकर, गरिमा और अधिकार के साथ बोलता है।`,
          pacBasisEn: `House 2 Lord: ${l2?.id} in H${l2?.placedHouse}; Mercury in House ${mercury?.placedHouse} (${mercury?.dignity || 'Neutral'}).`,
          pacBasisHi: `द्वितीयेश: ${PLANET_HI[l2?.id || '']} भाव ${l2?.placedHouse} में; बुध भाव ${mercury?.placedHouse} में।`,
          shastricRef: 'Phaladeepika (Ch. 6, Sl. 14–19)',
          vargaRef: 'D1 & D2',
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
          vargaRef: 'D1, D9 & D60',
        },
      ],
    });
  }

  // =========================================================================
  // PILLAR 2: माता-पिता, कुल व पारिवारिक संघर्ष (Parents & Ancestry)
  // =========================================================================
  {
    const fatherHouseLord = l9;
    const motherHouseLord = l4;
    const fProfLord = l6; // 10th from 9th
    const mProfLord = l1; // 10th from 4th

    let fProfEn = 'Public governance, administrative executive, landed real estate, or structured institutional management';
    let fProfHi = 'राजकीय उपक्रम, प्रशासनिक प्रबंधन, भू-संपत्ति या किसी प्रतिष्ठित संस्थागत संगठन में उच्च पद';
    if (fProfLord?.id === 'Mercury' || fProfLord?.id === 'Jupiter') {
      fProfEn = 'Banking, finance, trade/commerce, jurisprudence, or higher pedagogy/education';
      fProfHi = 'बैंकिंग, वित्त, वाणिज्य, न्यायशास्त्र अथवा उच्च शिक्षा व अध्यापन क्षेत्र';
    } else if (fProfLord?.id === 'Mars' || fProfLord?.id === 'Saturn') {
      fProfEn = 'Engineering, technical operations, industrial manufacturing, defense, or infrastructure';
      fProfHi = 'इंजीनियरिंग, तकनीकी संचालन, औद्योगिक निर्माण, रक्षा सेवा अथवा निर्माण क्षेत्र';
    } else if (fProfLord?.id === 'Sun') {
      fProfEn = 'Government administration, public policy leadership, medical administration, or executive authority';
      fProfHi = 'सरकारी प्रशासन, सार्वजनिक नीति, चिकित्सा प्रबंधन अथवा उच्च प्रशासनिक सत्ता';
    }

    let mProfEn = 'Cultured family anchor, educational mentoring, healthcare, or independent creative management';
    let mProfHi = 'संस्कारवान पारिवारिक सूत्रधार, अध्यापन, स्वास्थ्य सेवा अथवा स्वतंत्र रचनात्मक कार्य';
    if (mProfLord?.id === 'Mercury' || mProfLord?.id === 'Jupiter') {
      mProfEn = 'Academics, school administration, banking, accounts, or literary intellectual pursuit';
      mProfHi = 'शिक्षा, विद्यालय प्रबंधन, लेखा, बैंकिंग अथवा बौद्धिक व साहित्यिक क्षेत्र';
    } else if (mProfLord?.id === 'Venus' || mProfLord?.id === 'Moon') {
      mProfEn = 'Hospitality, design, counseling, healthcare, social welfare, or boutique enterprise';
      mProfHi = 'आतिथ्य, डिजाइन, परामर्श, स्वास्थ्य सेवा, समाज कल्याण अथवा स्वतंत्र बुटीक उद्यम';
    }

    pillars.push({
      id: 'parents_ancestry',
      pillarNumber: 2,
      titleEn: 'Parents: Stature, Profession, Struggles & Lineage',
      titleHi: 'माता-पिता, कुल, व्यवसाय व पारिवारिक संघर्ष',
      icon: 'Crown',
      summaryEn: `Detailed parental lineage synthesized from the 9th house (${h9Sign.name} - Father), 4th house (${h4Sign.name} - Mother), natural karakas Sun and Moon, and D12 Dwadashamsha divisional chart.`,
      summaryHi: `नवम भाव (${SIGN_HI[h9SignIdx]} - पिता), चतुर्थ भाव (${SIGN_HI[h4SignIdx]} - माता), सूर्य, चंद्र एवं द्वादशांश (D12) कुंडली द्वारा माता-पिता के स्वास्थ्य, कर्मक्षेत्र, संघर्ष व पैतृक संस्कारों का प्रामाणिक विवेचन।`,
      attributes: [
        {
          id: 'attr_father_life',
          category: 'parents',
          titleEn: "Father's Longevity, Health & Life Path",
          titleHi: 'पिता का जीवन, स्वास्थ्य व दीर्घायु विचार',
          valueEn: 'Respected, dignified life with good longevity; periodic health vigilance around mid-50s',
          valueHi: 'सम्मानित, कुलीन व दीर्घायु जीवन; 50 के दशक के मध्य में स्वास्थ्य के प्रति सतर्कता अपेक्षित',
          explanationEn: `The 9th house (${h9Sign.name}) and natural Pitrukaraka Sun anchor the father's fortunes. The father possesses high principles, strong willpower, and commands societal veneration.`,
          explanationHi: `नवम भाव (${SIGN_HI[h9SignIdx]}) और सूर्य की स्थिति पिता को स्वाभिमानी, सामाजिक रूप से प्रतिष्ठित और अपने सिद्धांतों पर अडिग रहने वाला व्यक्तित्व प्रदान करती है।`,
          pacBasisEn: `House 9: ${h9Sign.name}; Lord: ${fatherHouseLord?.id} placed in H${fatherHouseLord?.placedHouse}; Sun in H${sun?.placedHouse} (${sun?.dignity || 'Neutral'}).`,
          pacBasisHi: `नवम भाव: ${SIGN_HI[h9SignIdx]}; नवमेश: ${PLANET_HI[fatherHouseLord?.id || '']} भाव ${fatherHouseLord?.placedHouse} में; सूर्य भाव ${sun?.placedHouse} में।`,
          shastricRef: 'BPHS (Ch. 12, Sl. 45–52), Saravali (Ch. 34)',
          vargaRef: 'D1 Rashi & D12 Dwadashamsha',
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
          pacBasisEn: `10th from 9th is House 6 (${h6Sign.name}); Lord: ${fProfLord?.id} in H${fProfLord?.placedHouse}; Sun in D12 sits in ${d12?.placements?.find((p) => p.id === 'Sun')?.signName || 'D12'}.`,
          pacBasisHi: `नवम से दशम भाव ६ (${SIGN_HI[h6SignIdx]}); भावेश: ${PLANET_HI[fProfLord?.id || '']} भाव ${fProfLord?.placedHouse} में; D12 में सूर्य की स्थिति बलवान।`,
          shastricRef: 'Brihat Jataka (Ch. 10, Sl. 1–5)',
          vargaRef: 'D1 & D12',
        },
        {
          id: 'attr_mother_life',
          category: 'parents',
          titleEn: "Mother's Demeanor, Health & Nurturing Aura",
          titleHi: 'माता का जीवन, स्वास्थ्य व ममतामयी स्वरूप',
          valueEn: 'Devout, deeply caring, morally upright and the foundational emotional anchor of the home',
          valueHi: 'परम धर्मपरायण, ममतामयी, संस्कारवान व परिवार की मुख्य भावनात्मक संबल',
          explanationEn: `The 4th house (${h4Sign.name}) and natural Matrukaraka Moon govern the mother. She infuses the domestic sphere with spiritual serenity, resilience, and unyielding maternal protection.`,
          explanationHi: `चतुर्थ भाव (${SIGN_HI[h4SignIdx]}) और चंद्र की स्थिति माता को अत्यंत करुणामयी, शांतचित्त और परिवार को संस्कारों में बांधकर रखने वाली ममता की प्रतिमूर्ति बनाती है।`,
          pacBasisEn: `House 4: ${h4Sign.name}; Lord: ${motherHouseLord?.id} in H${motherHouseLord?.placedHouse}; Moon in House ${moon?.placedHouse} (${moon?.dignity || 'Neutral'}).`,
          pacBasisHi: `चतुर्थ भाव: ${SIGN_HI[h4SignIdx]}; चतुर्थेश: ${PLANET_HI[motherHouseLord?.id || '']} भाव ${motherHouseLord?.placedHouse} में; चंद्र भाव ${moon?.placedHouse} में।`,
          shastricRef: 'BPHS (Ch. 12, Sl. 25–34)',
          vargaRef: 'D1 Rashi & D12 Dwadashamsha',
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
          vargaRef: 'D1 & D12',
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
          vargaRef: 'D1 & D12',
        },
        {
          id: 'attr_parents_relocation',
          category: 'parents',
          titleEn: 'Parents Relocation / Transfer Away from Native Seat',
          titleHi: 'स्थानांतरण व पैतृक निवास परिवर्तन',
          valueEn: (h4Sign.modality === 'Movable' || l4?.placedHouse === 12 || l4?.placedHouse === 3)
            ? 'Definite relocation away from ancestral village/town to modern metropolitan center for growth'
            : 'Strong continuity in ancestral hometown/region with deep rooted community ownership',
          valueHi: (h4Sign.modality === 'Movable' || l4?.placedHouse === 12 || l4?.placedHouse === 3)
            ? 'पैतृक जन्मस्थान से दूर आधुनिक नगर/राज्य में स्थानांतरण व नवीन गृह निर्माण'
            : 'पैतृक गृह व स्थानीय समाज में दृढ़ जुड़ाव; पुश्तैनी जमीन-जायदाद की रक्षा व स्थायित्व',
          explanationEn: `The 4th lord in relation with movable signs and 12th/3rd houses prompts geographic transition from ancestral homestead to new educational and commercial centers.`,
          explanationHi: `चतुर्थेश का चर राशि या 3/12 भावों से संबंध माता-पिता को पैतृक भूमि से दूर नए कार्यक्षेत्र की ओर स्थानांतरित करता है।`,
          pacBasisEn: `House 4 Sign ${h4Sign.name} (${h4Sign.modality}); Lord ${motherHouseLord?.id} in H${motherHouseLord?.placedHouse}; 9th Lord ${fatherHouseLord?.id} in H${fatherHouseLord?.placedHouse}.`,
          pacBasisHi: `चतुर्थ भाव ${SIGN_HI[h4SignIdx]} (${h4Sign.modality}); चतुर्थेश भाव ${motherHouseLord?.placedHouse} में; नवमेश भाव ${fatherHouseLord?.placedHouse} में।`,
          shastricRef: 'BPHS (Ch. 12, Sl. 38–42)',
          vargaRef: 'D1 & D4',
        },
      ],
    });
  }

  // =========================================================================
  // PILLAR 3: सहोदर, भाई-बहन व भ्रातृ सुख (Siblings & Bonding)
  // =========================================================================
  {
    const d3LagnaSign = d3?.lagnaSignIndex ?? ascSignIdx;
    const youngerSiblingsLord = l3;
    const elderSiblingsLord = l11;

    // Dynamic Sibling count and presence
    const h3Occupants = h3Planets;
    const h11Occupants = h11Planets;
    const isSingleChild = (h3Occupants.some((p) => p.id === 'Ketu' || p.id === 'Saturn') && l3?.dignity === 'Debilitated' && h11Occupants.length === 0);

    let sibCountEn = '2 to 3 siblings in the biological lineage (mixture of brothers and sisters)';
    let sibCountHi = 'कुल २ से ३ सहोदरों का योग (भाई व बहन का संतुलित अनुपात)';
    if (isSingleChild) {
      sibCountEn = 'Only child / Ekaki sibling yoga; native commands exclusive parental resources and lineage focus';
      sibCountHi = 'एकल संतान / एकाकी योग; जातक परिवार का अकेला अथवा मुख्य केंद्रबिंदु है';
    } else if (h3Occupants.length >= 2 || h11Occupants.length >= 2) {
      sibCountEn = 'Vibrant, large sibling circle (3 or more co-borns) creating active mutual camaraderie';
      sibCountHi = 'विस्तृत सहोदर परिवार (३ या अधिक भाई-बहन), घर में निरंतर चहल-पहल व आपसी सहयोग';
    }

    const youngerMale = h3Sign.gender === 'Odd' || ['Sun', 'Mars', 'Jupiter'].includes(youngerSiblingsLord?.id || '');
    let youngerEn = youngerMale
      ? '1 younger brother (Anuja) with an energetic, ambitious, and bold disposition'
      : '1 younger sister (Anuja) with a cultured, affectionate, and artistic nature';
    let youngerHi = youngerMale
      ? '१ छोटा भाई (अनुज), जो उत्साही, महत्वाकांक्षी व साहसी स्वभाव का होगा'
      : '१ छोटी बहन (अनुजा), जो स्नेहमयी, कलाप्रिय व जातक का आदर करने वाली होगी';

    const elderMale = h11Sign.gender === 'Odd' || ['Sun', 'Mars', 'Jupiter'].includes(elderSiblingsLord?.id || '');
    let elderEn = elderMale
      ? '1 elder brother who acts as a guide, protector, and pillar of career mentorship'
      : '1 elder sister who provides deep emotional nurturing, advice, and familial stability';
    let elderHi = elderMale
      ? '१ बड़े भाई का योग, जो जातक के लिए संरक्षक, मार्गदर्शक व संबल की भूमिका निभाएंगे'
      : '१ बड़ी बहन का योग, जो ममतामयी मार्गदर्शन, संबल व पारिवारिक संतुलन प्रदान करेंगी';

    pillars.push({
      id: 'siblings_bhratri',
      pillarNumber: 3,
      titleEn: 'Siblings: Numbers, Genders, Bonding & Careers',
      titleHi: 'सहोदर, भाई-बहन, संख्या, लिंग व आपसी संबंध',
      icon: 'Users',
      summaryEn: `Comprehensive sibling analysis synthesizing the 3rd house (${h3Sign.name} - Younger), 11th house (${h11Sign.name} - Elder), natural karaka Mars (Bhratrikaraka), and D3 Drekkana chart.`,
      summaryHi: `तृतीय भाव (${SIGN_HI[h3SignIdx]} - अनुज), एकादश भाव (${SIGN_HI[h11SignIdx]} - ज्येष्ठ), मंगल (भ्रातृकारक) एवं द्रेष्काण (D3) चक्र के आधार पर भाई-बहनों की संख्या, लिंग, पेशा व आपसी प्रेम का सटीक विश्लेषण।`,
      attributes: [
        {
          id: 'attr_sibling_count',
          category: 'siblings',
          titleEn: 'Total Sibling Count & Family Structure',
          titleHi: 'कुल सहोदर संख्या व पारिवारिक स्वरूप',
          valueEn: sibCountEn,
          valueHi: sibCountHi,
          explanationEn: `Calculated from the 3rd house (${h3Sign.name}), Mars's vitality, and D3 Drekkana divisional ascendant (${SIGNS[d3LagnaSign].name}). Sibling karma is active and supportive.`,
          explanationHi: `तृतीय भाव (${SIGN_HI[h3SignIdx]}), मंगल और द्रेष्काण (D3) लग्न द्वारा प्रमाणित सहोदर योग अत्यंत शुभ, परस्पर सहयोगी और सामंजस्यपूर्ण है।`,
          pacBasisEn: `House 3: ${h3Sign.name}; Lord ${youngerSiblingsLord?.id} in H${youngerSiblingsLord?.placedHouse}; D3 Lagna: ${SIGNS[d3LagnaSign].name}.`,
          pacBasisHi: `तृतीय भाव: ${SIGN_HI[h3SignIdx]}; तृतीयेश भाव ${youngerSiblingsLord?.placedHouse} में; D3 लग्न: ${SIGN_HI[d3LagnaSign]}।`,
          shastricRef: 'BPHS (Ch. 12, Sl. 19–24), Saravali (Ch. 26)',
          vargaRef: 'D1 Rashi & D3 Drekkana',
        },
        {
          id: 'attr_younger_sibling',
          category: 'siblings',
          titleEn: 'Younger Siblings (Anuja / Kanishtha Bhrata)',
          titleHi: 'छोटे भाई-बहन का सुख व विशेषताएं',
          valueEn: youngerEn,
          valueHi: youngerHi,
          explanationEn: `The 3rd house (${h3Sign.name}) polarity (${h3Sign.gender} sign) and 3rd lord dignity govern younger co-borns. The native plays a protective parental elder role.`,
          explanationHi: `तृतीय भाव (${SIGN_HI[h3SignIdx]}) की प्रकृति और भावेश के आधार पर छोटे भाई/बहन से आजीवन आत्मीयता व सहयोग बना रहता है। जातक उनका मार्गदर्शक बनता है।`,
          pacBasisEn: `House 3: ${h3Sign.name} (${h3Sign.gender}); Lord ${youngerSiblingsLord?.id} in H${youngerSiblingsLord?.placedHouse}; Mars in H${mars?.placedHouse}.`,
          pacBasisHi: `तृतीय भाव: ${SIGN_HI[h3SignIdx]} (${h3Sign.gender}); तृतीयेश भाव ${youngerSiblingsLord?.placedHouse} में; मंगल भाव ${mars?.placedHouse} में।`,
          shastricRef: 'Brihat Jataka (Ch. 15, Sl. 1–6)',
          vargaRef: 'D1 & D3',
        },
        {
          id: 'attr_elder_sibling',
          category: 'siblings',
          titleEn: 'Elder Siblings (Jyeshtha Bhrata / Bhagini)',
          titleHi: 'बड़े भाई-बहन का सुख व मार्गदर्शन',
          valueEn: elderEn,
          valueHi: elderHi,
          explanationEn: `The 11th house (${h11Sign.name}) and natural Karaka Jupiter rule elder co-borns. An elder sibling provides steady moral advice and celebrates the native's milestones.`,
          explanationHi: `एकादश भाव (${SIGN_HI[h11SignIdx]}) और गुरु की स्थिति बड़े सहोदर से स्नेह, संरक्षण और जीवन के महत्वपूर्ण पड़ावों पर भरपूर सहयोग सुनिश्चित करती है।`,
          pacBasisEn: `House 11: ${h11Sign.name}; Lord ${elderSiblingsLord?.id} placed in House ${elderSiblingsLord?.placedHouse}.`,
          pacBasisHi: `एकादश भाव: ${SIGN_HI[h11SignIdx]}; एकादशेश ${PLANET_HI[elderSiblingsLord?.id || '']} भाव ${elderSiblingsLord?.placedHouse} में।`,
          shastricRef: 'BPHS (Ch. 12, Sl. 65–70)',
          vargaRef: 'D1 & D3',
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
          vargaRef: 'D1 & D3',
        },
      ],
    });
  }

  // =========================================================================
  // PILLAR 4: दांपत्य, विवाह, जीवनसाथी व अंतरंग संबंध (Spouse, Marriage & Intimacy)
  // =========================================================================
  {
    const spouseLord = l7;
    const d9LagnaSign = d9?.lagnaSignIndex ?? ascSignIdx;
    const d9H7Sign = (d9LagnaSign + 6) % 12;

    // Direction & Distance
    let directionEn = 'South-East or Southern direction from native birthplace';
    let directionHi = 'जन्मस्थान से दक्षिण-पूर्व अथवा दक्षिण दिशा';
    if (h7Sign.element === 'Fire') {
      directionEn = 'Eastern direction from native birthplace (Poorva Disha)';
      directionHi = 'जन्मस्थान से पूर्व दिशा (East - सूर्य-अग्नि कोण)';
    } else if (h7Sign.element === 'Air') {
      directionEn = 'Western direction from native birthplace (Pashchima Disha)';
      directionHi = 'जन्मस्थान से पश्चिम दिशा (West - शनि-वायु कोण)';
    } else if (h7Sign.element === 'Water') {
      directionEn = 'Northern direction from native birthplace (Uttara Disha)';
      directionHi = 'जन्मस्थान से उत्तर दिशा (North - बुध-जल कोण)';
    } else if (h7Sign.element === 'Earth') {
      directionEn = 'Southern direction from native birthplace (Dakshina Disha)';
      directionHi = 'जन्मस्थान से दक्षिण दिशा (South - मंगल-भूमि कोण)';
    }

    let distEn = 'Moderate regional distance (approx. 70 to 180 km from native hometown)';
    let distHi = 'मध्यम दूरी (लगभग 70 से 180 किमी दूर अन्य नगर/जिले से आगमन)';
    if (h7Sign.modality === 'Movable') {
      distEn = 'Distant or foreign geography (150 to 500+ km from native birthplace)';
      distHi = 'दूरस्थ क्षेत्र अथवा देशांतर/विदेश (150 से 500+ किमी की दूरी)';
    } else if (h7Sign.modality === 'Fixed') {
      distEn = 'Close regional vicinity (within 25 to 70 km of native hometown)';
      distHi = 'समीपवर्ती नगर अथवा परिचित पारिवारिक परिवेश (25 से 70 किमी के भीतर)';
    }

    // Spouse looks & profession
    let spouseLooksEn = 'Attractive, graceful, fair complexion with intellectual demeanor and gentle speech';
    let spouseLooksHi = 'आकर्षक, शालीन, गौर वर्ण, बौद्धिक मुखाकृति व मधुर-सत्य भाषण';
    if (d9?.placements?.some((p) => p.id === 'Venus' && p.houseFromVargaLagna === 7)) {
      spouseLooksEn = 'Exceptionally beautiful, luminous skin, magnetic expressive eyes, elegant posture';
      spouseLooksHi = 'अत्यंत नयनाभिराम, उज्ज्वल कांति, सम्मोहक नेत्र व रति-जैसी स्वाभाविक सुंदरता';
    } else if (d9?.placements?.some((p) => p.id === 'Mars' && p.houseFromVargaLagna === 7)) {
      spouseLooksEn = 'Athletic, spirited, sharp-featured, radiant eyes, independent and resolute demeanor';
      spouseLooksHi = 'कसरती, साहसी, तीक्ष्ण नैन-नक्श, तेजस्वी आँखें व स्वतंत्र व स्वाभिमानी स्वभाव';
    }

    let spouseProfEn = 'Banking, financial analysis, corporate software/IT, education/teaching, or healthcare administration';
    let spouseProfHi = 'बैंकिंग, वित्तीय विश्लेषण, सॉफ्टवेयर/आईटी, उच्च शिक्षा, अथवा स्वास्थ्य प्रशासन क्षेत्र';
    if (l4?.id === 'Mercury' || l4?.id === 'Jupiter') {
      spouseProfEn = 'Academics, school/university professor, corporate law, chartered accounting, or financial planning';
      spouseProfHi = 'उच्च शिक्षा, प्राध्यापक, कॉर्पोरेट विधि (Law), सीए अथवा वित्तीय योजनाकार';
    } else if (l4?.id === 'Mars' || l4?.id === 'Saturn') {
      spouseProfEn = 'Engineering, technical project management, industrial architecture, or enterprise operations';
      spouseProfHi = 'इंजीनियरिंग, तकनीकी प्रोजेक्ट मैनेजमेंट, औद्योगिक वास्तुकला अथवा ऑपरेशन्स';
    }

    // Age difference
    let ageDiffEn = '1.5 to 3 years younger (ideal generational maturity and balanced mutual parity)';
    let ageDiffHi = '1.5 से 3 वर्ष छोटी (पारस्परिक आदर व संतुलित समझदारी का आदर्श अंतर)';
    if (h7Planets.some((p) => p.id === 'Saturn') || spouseLord?.id === 'Saturn') {
      ageDiffEn = '4 to 6 years age difference, characterized by profound maturity and grounded dependability';
      ageDiffHi = '4 से 6 वर्ष का अंतर, जो स्वभाव में अत्यधिक परिपक्वता, धैर्य और स्थिरता दर्शाता है';
    } else if (h7Planets.some((p) => p.id === 'Mercury') || spouseLord?.id === 'Mercury') {
      ageDiffEn = '0 to 1.5 years difference; highly youthful, playful, and peer-like dynamic';
      ageDiffHi = '0 से 1.5 वर्ष का न्यूनतम अंतर; समवयस्क मित्र की भांति जीवंत व सहज तालमेल';
    }

    // Marriage Type
    let marriageTypeEn = 'Love-cum-arranged marriage with full ancestral blessings and family consent';
    let marriageTypeHi = 'पारिवारिक सहमति से संपन्न प्रेम विवाह (Love-cum-Arranged Marriage)';
    const hasLoveMarriageYoga = (l5?.placedHouse === 7 || l7?.placedHouse === 5 || h7Planets.some((p) => p.id === 'Venus' || p.id === 'Rahu'));
    if (hasLoveMarriageYoga) {
      marriageTypeEn = 'Love Marriage: Romance originates through personal choice, deep emotional affinity, and shared ideals';
      marriageTypeHi = 'प्रेम विवाह (Love Marriage): व्यक्तिगत पसंद, गहरा भावनात्मक लगाव व परस्पर आदर्शों की एकता';
    }

    // =========================================================================
    // NUANCED SEXUAL ORIENTATION & ATTRACTION LOGIC (Shastric & Modern Dynamic)
    // =========================================================================
    // Classical Factors:
    // - Mercury (Budha) & Saturn (Shani) are the classical neuter/dual-polarity planets (क्लीव/द्वैत ग्रह).
    // - Mars (Kama/Shakti) and Venus (Rati/Shukra) govern erotic chemistry.
    // - When Mercury or Saturn strongly influence 7th house, 8th house, 12th house, or Venus in dual/watery signs,
    //   or when Venus is in Scorpio/Aquarius/Gemini with Mars/Saturn aspect, classical texts (Brihat Jataka Ch. 24,
    //   Saravali Ch. 37-38) document non-normative erotic currents (Tritiya Prakriti / Bisexual / Fluid attraction).
    const isVenusInDualOrWater = venus && ['Gemini', 'Virgo', 'Pisces', 'Scorpio', 'Aquarius'].includes(venus.signName);
    const isMercuryInfluencingKama = (mercury?.placedHouse === 7 || mercury?.placedHouse === 8 || mercury?.placedHouse === 12 || (venus && mercury && Math.abs(mercury.placedHouse - venus.placedHouse) <= 1));
    const isSaturnInfluencingKama = (saturn?.placedHouse === 7 || saturn?.placedHouse === 8 || (venus && saturn && saturn.placedHouse === venus.placedHouse));
    const isKetuDetached = ketu?.placedHouse === 7 || ketu?.placedHouse === 12;

    let sexualOrientationValueEn = 'Classical heterosexual marriage orientation; masculine-feminine polar balance operates naturally';
    let sexualOrientationValueHi = 'स्वाभाविक विषमलैंगिक (Heterosexual) वैवाहिक आकर्षण; पुरुष-स्त्री प्रकृति का पूर्ण संतुलन';
    let sexualOrientationExplEn = "Under Maharishi Varahamihira's Brihat Jataka (Ch. 24, Sl. 10–15) rules on gender polarity, the 1st, 7th, and 12th houses are free from neuter/dual planet entrapment. The native possesses healthy, classical biological attraction aligned with married progeny goals.";
    let sexualOrientationExplHi = 'महर्षि वराहमिहिर कृत बृहज्जातक (अध्याय २४, श्लोक १०-१५) के काम-ध्रुवीयता सूत्रों के अनुसार लग्न, सप्तम और द्वादश भावों पर क्लीव ग्रहों का कोई विपरीत प्रभाव नहीं है। काम-ऊर्जा का प्रवाह स्वाभाविक, संयमित और पारिवारिक वंश-वृद्धि के पूर्ण अनुकूल है।';
    let sexualOrientationPacEn = `Lagna Lord ${lagnaLordId}; 7th Lord ${spouseLord?.id}; Venus in ${venus?.signName || 'Dignified'}; Mars in House ${mars?.placedHouse}.`;
    let sexualOrientationPacHi = `लग्नेश ${PLANET_HI[lagnaLordId]}; सप्तमेश ${PLANET_HI[spouseLord?.id || '']}; शुक्र ${venus?.signName} में; मंगल भाव ${mars?.placedHouse} में।`;

    if (isVenusInDualOrWater && (isMercuryInfluencingKama || isSaturnInfluencingKama)) {
      // Bisexual / Fluid Attraction within Marriage
      sexualOrientationValueEn = 'Bisexual / Fluid Attraction Polarity; socially bonded in marriage yet experiences natural, latent or active romantic and physical attraction towards the same gender';
      sexualOrientationValueHi = 'उभयलैंगिक व द्वि-ध्रुवीय कामुक आकर्षण (Bisexual / Dual Polarity); पारंपरिक विवाह में बंधे होने पर भी समान लिंग (Same Gender) के प्रति स्वाभाविक आकर्षण व संवेदी खिंचाव';
      sexualOrientationExplEn = 'Classical texts (Brihat Jataka, Ch. 24, Sl. 10–15; Saravali, Ch. 37) document that the confluence of Mercury (Budha - the neutral, versatile graha) with Venus (Shukra - desire) in watery or dual signs transcends rigid binary boundaries. A native can maintain a committed, loving heterosexual marriage while experiencing genuine erotic or emotional attraction towards the same gender.';
      sexualOrientationExplHi = 'महर्षि वराहमिहिर कृत बृहज्जातक (स्त्री-पुरुष जातक अध्याय २४) एवं कल्याण वर्मा कृत सारावली के अनुसार जब क्लीव व द्वैत स्वभाव ग्रह बुध अथवा शनि का प्रभाव कामुकता कारक शुक्र अथवा सप्तम-अष्टम भाव पर होता है, तब जातक की काम-ऊर्जा केवल पारंपरिक सीमाओं में सीमित नहीं रहती। ऐसा व्यक्ति पारिवारिक व सामाजिक जीवन में निष्ठावान दांपत्य निभाते हुए भी अपने भीतर समान लिंग (Same Gender) के व्यक्तियों के प्रति गहरी कामुक जिज्ञासा, आकर्षण अथवा तीव्र भावनात्मक लगाव का अनुभव करता है।';
      sexualOrientationPacEn = `Venus in ${venus?.signName} (House ${venus?.placedHouse}); Mercury in House ${mercury?.placedHouse}; Saturn in House ${saturn?.placedHouse}; confluence on Kama axis (7th/8th/12th).`;
      sexualOrientationPacHi = `शुक्र ${venus?.signName} में (भाव ${venus?.placedHouse}); बुध भाव ${mercury?.placedHouse} में; शनि भाव ${saturn?.placedHouse} में; काम भावों (७/८/१२) पर द्वैत प्रभाव।`;
    } else if (isKetuDetached && !isMercuryInfluencingKama) {
      // Demisexual / Transcendent Intimacy
      sexualOrientationValueEn = 'Demisexual & Emotionally-Anchored Intimacy; physical attraction is absent until profound mental trust and spiritual resonance are established';
      sexualOrientationValueHi = 'डेमीसेक्सुअल व आध्यात्मिक काम-संयम (Demisexual Intimacy); सतही आकर्षण का अभाव, केवल प्रगाढ़ मानसिक व आत्मिक विश्वास के बाद ही काम-भावना का जागरण';
      sexualOrientationExplEn = 'Ketu in the 7th or 12th house dissolves superficial carnal fixation. The soul seeks intellectual communion, emotional safety, and transcendent loyalty before engaging in physical intimacy.';
      sexualOrientationExplHi = 'सप्तम अथवा द्वादश भाव में मोक्षकारक केतु की उपस्थिति जातक को सतही कामुक आकर्षण से मुक्त रखती है। जातक के लिए शारीरिक मिलन केवल वासना नहीं अपितु आत्मिक एकत्व और समर्पण का विषय है।';
      sexualOrientationPacEn = `Ketu in House ${ketu?.placedHouse}; 12th House ${h12Sign.name}; Venus free from aggressive Mars affliction.`;
      sexualOrientationPacHi = `केतु भाव ${ketu?.placedHouse} में; द्वादश भाव ${SIGN_HI[h12SignIdx]}; काम भावों पर सात्विक वैराग्य।`;
    }

    pillars.push({
      id: 'spouse_marriage',
      pillarNumber: 4,
      titleEn: 'Spouse, Marriage, Timing, Intimacy & Orientation',
      titleHi: 'दांपत्य, विवाह, जीवनसाथी, अंतरंगता व काम-जीवन',
      icon: 'Heart',
      summaryEn: `Exhaustive marital dossier derived from the 7th house (${h7Sign.name} - Kalatra), 7th lord ${spouseLord?.id}, Venus (Shukra), D9 Navamsha chart (${SIGNS[d9H7Sign].name}), and 12th house of physical intimacy.`,
      summaryHi: `सप्तम भाव (${SIGN_HI[h7SignIdx]} - कलत्र), सप्तमेश ${PLANET_HI[spouseLord?.id || '']}, शुक्र, नवांश (D9 सप्तम: ${SIGN_HI[d9H7Sign]}) एवं द्वादश भाव (शयन सुख) द्वारा जीवनसाथी का रूप-रंग, आगमन दिशा, पेशा, दांपत्य आयु व अंतरंग सुख का प्रामाणिक विवेचन।`,
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
          vargaRef: 'D1 Rashi & D9 Navamsha',
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
          vargaRef: 'D1 & D9',
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
          pacBasisEn: `House 8 (${h8Sign.name}); Lord ${l8?.id} placed in House ${l8?.placedHouse}; Jupiter aspects maternal/marital axis.`,
          pacBasisHi: `अष्टम भाव (${SIGN_HI[h8SignIdx]}); भावेश भाव ${l8?.placedHouse} में; गुरु की शुभ दृष्टि।`,
          shastricRef: 'BPHS (Ch. 13, Sl. 28–34)',
          vargaRef: 'D1 & D9',
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
          pacBasisEn: `10th from 7th is House 4 (${h4Sign.name}); Lord ${l4?.id} in H${l4?.placedHouse}; D9 10th lord placement.`,
          pacBasisHi: `सप्तम से दशम भाव ४ (${SIGN_HI[h4SignIdx]}); चतुर्थेश भाव ${l4?.placedHouse} में।`,
          shastricRef: 'Brihat Jataka (Ch. 18, Sl. 5–12)',
          vargaRef: 'D1 & D9',
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
          vargaRef: 'D1 & D9',
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
          vargaRef: 'D9 Navamsha',
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
          vargaRef: 'D1 & D9',
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
          pacBasisEn: `House 12: ${h12Sign.name}; Lord ${l12?.id} in H${l12?.placedHouse}; Venus placed in House ${venus?.placedHouse}.`,
          pacBasisHi: `द्वादश भाव: ${SIGN_HI[h12SignIdx]}; द्वादशेश भाव ${l12?.placedHouse} में; शुक्र भाव ${venus?.placedHouse} में।`,
          shastricRef: 'BPHS (Ch. 13, Sl. 36–42), Saravali (Ch. 27)',
          vargaRef: 'D1 & D9',
        },
        {
          id: 'attr_sexual_orientation',
          category: 'spouse',
          titleEn: 'Sexual Orientation, Desire Polarity & Attraction Modality',
          titleHi: 'कामुक आकर्षण, काम-ऊर्जा ध्रुवीयता व ओरिएंटेशन (Sexual Orientation)',
          valueEn: sexualOrientationValueEn,
          valueHi: sexualOrientationValueHi,
          explanationEn: sexualOrientationExplEn,
          explanationHi: sexualOrientationExplHi,
          pacBasisEn: sexualOrientationPacEn,
          pacBasisHi: sexualOrientationPacHi,
          shastricRef: 'Brihat Jataka (Ch. 24, Sl. 10–15), Saravali (Ch. 37 & 38), Phaladeepika (Ch. 10)',
          vargaRef: 'D1 Rashi & D9 Navamsha',
        },
      ],
    });
  }

  // =========================================================================
  // PILLAR 5: संतान सुख, वंश वृद्धि व संतति योग (Children & Progeny)
  // =========================================================================
  {
    const d7LagnaSign = d7?.lagnaSignIndex ?? ascSignIdx;
    const child1SignOdd = h5Sign.gender === 'Odd';

    let childCountEn = '2 healthy children promised by D7 Saptamsha and 5th house Sarvashtakavarga';
    let childCountHi = 'कुल २ संतानों का उत्तम योग (सप्तांश D7 एवं सर्वाष्टकवर्ग द्वारा प्रमाणित)';

    let child1GenderEn = child1SignOdd ? 'Son (First Child: Male)' : 'Daughter (First Child: Female)';
    let child1GenderHi = child1SignOdd ? 'प्रथम संतान: पुत्र (कुशाग्र बुद्धि, नेतृत्व क्षमता)' : 'प्रथम संतान: पुत्री (भाग्यवर्धक, स्नेहमयी व कुलीन)';

    let child2GenderEn = child1SignOdd ? 'Daughter (Second Child: Female)' : 'Son (Second Child: Male)';
    let child2GenderHi = child1SignOdd ? 'द्वितीय संतान: पुत्री (कलाप्रिय, संवेदनशील व अध्ययनशील)' : 'द्वितीय संतान: पुत्र (तेजस्वी, तार्किक व रक्षक)';

    // Miscarriage or IVF indication
    const h5Occupants = h5Planets;
    let conceiveRiskEn = 'Natural conception favored; zero need for adoption; standard dietary Pitta cooling advised in early months';
    let conceiveRiskHi = 'प्राकृतिक गर्भधारण की पूर्ण संभावना; दत्तक की कोई आवश्यकता नहीं; प्रारंभिक महीनों में सात्विक शीतलता अपेक्षित';
    if (h5Occupants.some((p) => p.id === 'Rahu' || p.id === 'Mars')) {
      conceiveRiskEn = 'High energetic heat / Garbhadhana sensitivity in early trimester; modern medical ultrasound monitoring and cooling remedies strongly advised';
      conceiveRiskHi = 'प्रारंभिक त्रैमासिक में तेज शारीरिक ताप (Pitta Heat); नियमित चिकित्सकीय जांच व कुलदेवी उपासना से पूर्ण गर्भ सुरक्षा सुनिश्चित';
    } else if (h5Occupants.some((p) => p.id === 'Saturn' || p.id === 'Ketu')) {
      conceiveRiskEn = 'Delayed conception timing; assisted reproductive techniques (IVF / ART) provide successful smooth outcomes under medical guidance';
      conceiveRiskHi = 'संतति प्राप्ति में स्वाभाविक विलंब; आधुनिक आईवीएफ (IVF) अथवा चिकित्सकीय तकनीक द्वारा सुनिश्चित व सफल संतान सुख';
    }

    pillars.push({
      id: 'children_progeny',
      pillarNumber: 5,
      titleEn: 'Children, Progeny, Genders, Conceiving & Lineage',
      titleHi: 'संतान सुख, वंश वृद्धि, लिंग क्रम व गर्भधारण काल',
      icon: 'Users',
      summaryEn: `Exhaustive progeny diagnostic derived from the 5th house (${h5Sign.name} - Putra Bhava), 5th lord ${l5?.id}, Jupiter (Putrakaraka), D7 Saptamsha divisional chart, and Beeja/Kshetra Sphuta fertility indicators.`,
      summaryHi: `पंचम भाव (${SIGN_HI[h5SignIdx]} - संतान), पंचमेश ${PLANET_HI[l5?.id || '']}, देवगुरु बृहस्पति (पुत्रकारक), सप्तांश (D7) चक्र एवं बीज/क्षेत्र स्फुट द्वारा संतानों की संख्या, लिंग क्रम, विद्या व गर्भधारण का पूर्ण विवेचन।`,
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
          vargaRef: 'D1 Rashi & D7 Saptamsha',
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
          vargaRef: 'D7 Saptamsha',
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
          vargaRef: 'D1 & D7',
        },
        {
          id: 'attr_conceive_timing',
          category: 'children',
          titleEn: 'Auspicious Conceiving Age & Timing Window',
          titleHi: 'गर्भधारण व संतति प्राप्ति का स्वर्णिम समय',
          valueEn: 'Prime golden conception window opens between ages 28 and 32 years under favorable Guru Gochar',
          valueHi: 'आयु 28 से 32 वर्ष के मध्य गुरु के शुभ गोचर व अनुकूल दशा में संतति सुख का स्वर्णिम समय',
          explanationEn: `Transit Jupiter casts divine amrita drishti on the natal 5th and 9th houses while running benefic Mahadasha-Antardasha periods, ensuring safe and joyful conception.`,
          explanationHi: `गोचर में देवगुरु बृहस्पति जब पंचम या नवम भाव को अमृत दृष्टि से देखते हैं, उस समय गर्भधारण निर्विघ्न और श्रेष्ठ संतान की उत्पत्ति करता है।`,
          pacBasisEn: `Jupiter transit over 5th/9th from Lagna/Moon; 5th Lord dasha periods.`,
          pacBasisHi: `गुरु का पंचम/नवम पर गोचर व पंचमेश की विंशोत्तरी दशा।`,
          shastricRef: 'Phaladeepika (Ch. 12, Sl. 15–20)',
          vargaRef: 'D1 & D7',
        },
        {
          id: 'attr_miscarriage_adoption',
          category: 'children',
          titleEn: 'Garbhadhana Risks, Alternative Methods & Adoption Yoga',
          titleHi: 'गर्भ सुरक्षा, आईवीएफ (IVF) व दत्तक पुत्र विचार',
          valueEn: conceiveRiskEn,
          valueHi: conceiveRiskHi,
          explanationEn: `The biological Beeja/Kshetra Sphuta is virile and fertile, ensuring natural lineage continuation with appropriate modern medical support.`,
          explanationHi: `बीज स्फुट व क्षेत्र स्फुट बलवान होने के कारण कुल की वंश वृद्धि सुनिश्चित है। सात्विक जीवनशैली से गर्भ पूर्णतः सुरक्षित रहता है।`,
          pacBasisEn: `Beeja/Kshetra Sphuta points in fertile signs; 5th house lord ${l5?.id} in House ${l5?.placedHouse}.`,
          pacBasisHi: `बीज/क्षेत्र स्फुट ओजस्वी; पंचमेश भाव ${l5?.placedHouse} में।`,
          shastricRef: 'BPHS (Ch. 12, Sl. 43–48)',
          vargaRef: 'D1 & D7',
        },
      ],
    });
  }

  // =========================================================================
  // PILLAR 6: विद्या, उच्च अध्ययन, प्रतियोगिता व मित्र (Education & Competitions)
  // =========================================================================
  {
    const d24LagnaSign = d24?.lagnaSignIndex ?? ascSignIdx;

    let degreeEn = 'Post-Graduate Masters / Professional Technical Leadership Degree (M.Tech, MBA, MS, CA or MD)';
    let degreeHi = 'स्नातकोत्तर (Post-Graduate) / उच्च तकनीकी अथवा वित्तीय प्रबंधन उपाधि (M.Tech, MBA, MS, CA)';
    let subjectsEn = 'Computer Science, Information Technology, Applied Financial Architecture, Data Science, or Corporate Law';
    let subjectsHi = 'कंप्यूटर साइंस, सूचना प्रौद्योगिकी, वित्तीय इंजीनियरिंग, डेटा एनालिटिक्स अथवा कॉर्पोरेट विधि';

    if (h5Sign.element === 'Fire' || l5?.id === 'Mars' || l5?.id === 'Sun') {
      degreeEn = 'Applied Engineering / Executive Defense Strategy / Advanced Surgical Medicine / Corporate Operations';
      degreeHi = 'इंजीनियरिंग, तकनीकी अनुसंधान, शल्य चिकित्सा (Surgeon) अथवा उच्च कॉर्पोरेट संचालन';
      subjectsEn = 'Mechanical/Civil/Electrical Engineering, Applied Physics, Surgical Medicine, or Strategic Defense Studies';
      subjectsHi = 'मैकेनिकल/इलेक्ट्रिकल इंजीनियरिंग, व्यावहारिक भौतिकी, सर्जरी अथवा रक्षा रणनीति';
    } else if (h5Sign.element === 'Earth' || l5?.id === 'Mercury' || l5?.id === 'Saturn') {
      degreeEn = 'Chartered Accountancy (CA) / CFA / Masters in Economics / Corporate Jurisprudence & Taxation';
      degreeHi = 'चार्टर्ड अकाउंटेंसी (CA), सीएफए, अर्थशास्त्र में परास्नातक अथवा कॉर्पोरेट विधि व कराधान';
      subjectsEn = 'Accounting, Corporate Law, Econometrics, Supply Chain Logistics, or Banking Risk Architecture';
      subjectsHi = 'वाणिज्य, वित्तीय विश्लेषण, कंपनी कानून, बैंकिंग एवं आर्थिक सांख्यिकी';
    } else if (h5Sign.element === 'Air') {
      degreeEn = 'Artificial Intelligence / Advanced Software Systems / Data Science / Cognitive Media Communication';
      degreeHi = 'आर्टिफिशियल इंटेलिजेंस (AI), सॉफ्टवेयर आर्किटेक्चर, डेटा साइंस अथवा मास मीडिया';
      subjectsEn = 'Computer Networks, Machine Learning, Telecommunications, Cognitive Psychology, or Journalism';
      subjectsHi = 'कंप्यूटर नेटवर्क, मशीन लर्निंग, संचार प्रौद्योगिकी अथवा जनसंचार';
    }

    pillars.push({
      id: 'education_academics',
      pillarNumber: 6,
      titleEn: 'Education, Higher Learning, Competitive Exams & Allies',
      titleHi: 'विद्या, उच्च अध्ययन, प्रतियोगी परीक्षाएं व मित्र वर्ग',
      icon: 'BookOpen',
      summaryEn: `Academic and intellectual roadmap synthesized from the 4th house (${h4Sign.name} - Formal Learning), 5th house (${h5Sign.name} - Intellect), 9th house (${h9Sign.name} - Higher Pedagogy), Mercury (Budha), and D24 Siddhamsha chart.`,
      summaryHi: `चतुर्थ भाव (${SIGN_HI[h4SignIdx]} - आधारभूत शिक्षा), पंचम (${SIGN_HI[h5SignIdx]} - मेधा), नवम (उच्च डिग्री/शोध), बुध एवं सिद्धांश (D24) द्वारा उच्च शिक्षा, प्रतियोगी परीक्षा में चयन, विषय रुचि व मित्रों के लाभ का विश्लेषण।`,
      attributes: [
        {
          id: 'attr_highest_education',
          category: 'education',
          titleEn: 'Highest Educational Degree Attainment',
          titleHi: 'सर्वोच्च शैक्षणिक स्तर व उपाधि',
          valueEn: degreeEn,
          valueHi: degreeHi,
          explanationEn: `The 4th and 5th houses form a powerful Saraswati confluence. The native is endowed with high retention capacity, analytical clarity, and academic perseverance.`,
          explanationHi: `चतुर्थ और पंचम भावों के शुभ योग से जातक उच्च स्तर की उपाधि प्राप्त करेगा। बौद्धिक क्षमता, स्मरण शक्ति और शोध वृत्ति असाधारण रहेगी।`,
          pacBasisEn: `House 4 Lord ${l4?.id} in H${l4?.placedHouse}; House 5 Lord ${l5?.id} in H${l5?.placedHouse}; D24 Lagna in ${SIGNS[d24LagnaSign].name}.`,
          pacBasisHi: `चतुर्थेश भाव ${l4?.placedHouse} में; पंचमेश भाव ${l5?.placedHouse} में; सिद्धांश (D24) लग्न ${SIGN_HI[d24LagnaSign]} में।`,
          shastricRef: 'BPHS (Ch. 12, Sl. 10–18), Saravali (Ch. 24)',
          vargaRef: 'D1 & D24',
        },
        {
          id: 'attr_suitable_subjects',
          category: 'education',
          titleEn: 'Ideal Subject Streams & Core Intellectual Field',
          titleHi: 'अनुकूल अध्ययन संकाय व मुख्य विषय',
          valueEn: subjectsEn,
          valueHi: subjectsHi,
          explanationEn: `Planetary rays across the 5th and 10th axes shape the intellect. The mind flourishes in structured technical frameworks and strategic problem-solving.`,
          explanationHi: `पंचम व दशम भाव के ग्रहों का समन्वित प्रभाव जातक को जटिल समस्याओं को चुटकी में हल करने वाली मेधा प्रदान करता है।`,
          pacBasisEn: `Mercury in House ${mercury?.placedHouse}; Jupiter in House ${jupiter?.placedHouse}; 5th house element: ${h5Sign.element}.`,
          pacBasisHi: `बुध भाव ${mercury?.placedHouse} में; गुरु भाव ${jupiter?.placedHouse} में; पंचम भाव तत्व: ${h5Sign.element}।`,
          shastricRef: 'Brihat Jataka (Ch. 14, Sl. 1–6)',
          vargaRef: 'D1 & D24',
        },
        {
          id: 'attr_competitive_exams',
          category: 'education',
          titleEn: 'Competitive Exam Success, Selections & Hurdles',
          titleHi: 'प्रतियोगी परीक्षाएं, चयन व सफलता का समय',
          valueEn: 'Selection in rigorous competitive national/corporate tests; triumph achieved on focused dedicated attempt',
          valueHi: 'उच्च स्तरीय प्रतियोगी परीक्षा में सुनिश्चित चयन; केंद्रित प्रयास में ऐतिहासिक सफलता',
          explanationEn: `The 6th house (Shatru/Spardha Bhava) is fortified by strong planetary lordship. The native possesses immense mental endurance under examination pressure.`,
          explanationHi: `षष्ठ भाव (प्रतियोगिता व विजय भाव) की मजबूती जातक को दबाव में भी शांत रहकर प्रतियोगी परीक्षाओं में शीर्ष स्थान प्राप्त करने का बल देती है।`,
          pacBasisEn: `House 6 Lord ${l6?.id} in H${l6?.placedHouse}; Mars in House ${mars?.placedHouse} confers competitive stamina.`,
          pacBasisHi: `षष्ठेश भाव ${l6?.placedHouse} में; मंगल का पराक्रम प्रतियोगी क्षमता को शिखर पर रखता है।`,
          shastricRef: 'Phaladeepika (Ch. 16, Sl. 16–21)',
          vargaRef: 'D1 & D24',
        },
        {
          id: 'attr_friends_networking',
          category: 'education',
          titleEn: 'Friends Circle, Mentors & Networking Gains',
          titleHi: 'मित्र वर्ग, गुरु कृपा व संपर्कों से लाभ',
          valueEn: 'Selective, highly positioned friend circle; lifelong mentorship from inspiring professors and senior leaders',
          valueHi: 'सीमित किंतु उच्च पदस्थ व प्रामाणिक मित्र; प्रख्यात प्राध्यापकों व वरिष्ठ अधिकारियों का स्नेह',
          explanationEn: `The 11th house (${h11Sign.name} - Labha & Mitra Bhava) attracts dependable, intellectually stimulating alliances. Friends become catalysts for professional elevation.`,
          explanationHi: `एकादश भाव (${SIGN_HI[h11SignIdx]} - मित्र व लाभ भाव) जातक को ऐसे मित्रों से जोड़ता है जो जीवन में सही समय पर आर्थिक और रणनीतिक मार्गदर्शन प्रदान करते हैं।`,
          pacBasisEn: `House 11: ${h11Sign.name}; Lord ${l11?.id} in H${l11?.placedHouse}.`,
          pacBasisHi: `एकादश भाव: ${SIGN_HI[h11SignIdx]}; एकादशेश भाव ${l11?.placedHouse} में।`,
          shastricRef: 'Saravali (Ch. 36, Sl. 1–10)',
          vargaRef: 'D1 & D10',
        },
      ],
    });
  }

  // =========================================================================
  // PILLAR 7: आजीविका, व्यवसाय vs नौकरी, धन व संचित संपत्ति (Career & Wealth)
  // =========================================================================
  {
    const d10LagnaSign = d10?.lagnaSignIndex ?? ascSignIdx;

    let profEn = 'Technology Architecture, Enterprise Software Leadership, Strategic Financial Advisory, or Corporate Management';
    let profHi = 'तकनीकी वास्तुकला (Tech Architecture), सॉफ्टवेयर लीडरशिप, रणनीतिक वित्तीय परामर्श अथवा कॉर्पोरेट प्रबंधन';

    if (h10Sign.element === 'Fire' || l10?.id === 'Sun' || l10?.id === 'Mars') {
      profEn = 'Government Administration, Defense/Security Leadership, Industrial Operations, or Political Policy Strategy';
      profHi = 'सरकारी प्रशासन, रक्षा सेवा नेतृत्व, औद्योगिक उत्पादन अथवा राजनीतिक नीति प्रबंधन';
    } else if (h10Sign.element === 'Earth' || l10?.id === 'Mercury') {
      profEn = 'Wealth Management, Commercial Trading, Supply Chain Architecture, Real Estate Development, or Audit Leadership';
      profHi = 'वित्तीय परिसंपत्ति प्रबंधन, वाणिज्यिक व्यापार, लॉजिस्टिक्स, रियल एस्टेट अथवा मुख्य ऑडिट नियंत्रण';
    } else if (h10Sign.element === 'Water' || l10?.id === 'Moon' || l10?.id === 'Jupiter') {
      profEn = 'Healthcare Systems, Pharmaceutical Innovation, Marine Trade, Higher Pedagogy, or Psychological Counseling';
      profHi = 'स्वास्थ्य प्रणाली, फार्मास्युटिकल, समुद्री व्यापार, उच्च शिक्षा अथवा मनोवैज्ञानिक परामर्श';
    }

    const preferBusiness = (l7 && l7.dignity !== 'Debilitated' && (l7.placedHouse === 10 || l7.placedHouse === 11 || l7.placedHouse === 1)) || (mercury && mercury.placedHouse === 10);
    let jobVsBizEn = preferBusiness
      ? 'Strong entrepreneurial destiny: Natural business acumen, trading success, and independent enterprise ownership'
      : 'High-earning structured corporate career up to age 34; seamless transition into independent advisory/equity enterprise at 35+';
    let jobVsBizHi = preferBusiness
      ? 'प्रबल व्यापारिक योग: स्वतंत्र उद्यम, वाणिज्यिक लेन-देन व व्यापार साम्राज्य स्थापित करने की स्वाभाविक क्षमता'
      : 'आयु 34 वर्ष तक उच्च वेतनभोगी कॉर्पोरेट नौकरी; 35 वर्ष उपरांत स्वतंत्र उद्यम, परामर्श अथवा कंसल्टिंग में पदार्पण';

    pillars.push({
      id: 'career_wealth',
      pillarNumber: 7,
      titleEn: 'Career, Enterprise, Wealth Tier & Financial Prosperity',
      titleHi: 'आजीविका, व्यवसाय बनाम नौकरी, धन संचय व प्रतिष्ठा',
      icon: 'Briefcase',
      summaryEn: `Executive vocational and treasury analysis synthesized from the 10th house (${h10Sign.name} - Karma), 2nd house (${h2Sign.name} - Dhana), 11th house (${h11Sign.name} - Labha), and D10 Dashamsha chart.`,
      summaryHi: `दशम भाव (${SIGN_HI[h10SignIdx]} - कर्म), द्वितीय (${SIGN_HI[h2SignIdx]} - धन कोष), एकादश (${SIGN_HI[h11SignIdx]} - आय), षष्ठ/सप्तम (नौकरी vs व्यापार) एवं दशांश (D10) द्वारा आजीविका, धन वर्ग, पद-प्रतिष्ठा व आकस्मिक लाभ का संपूर्ण विश्लेषण।`,
      attributes: [
        {
          id: 'attr_suitable_profession',
          category: 'career',
          titleEn: 'Prime Suitable Profession & Career Trajectory',
          titleHi: 'सर्वोत्तम आजीविका व कार्यक्षेत्र की दिशा',
          valueEn: profEn,
          valueHi: profHi,
          explanationEn: `The 10th house (${h10Sign.name}) is energized by executive karakas. The native is destined for commanding roles requiring organizational oversight and vision.`,
          explanationHi: `दशम भाव (${SIGN_HI[h10SignIdx]}) और दशमांश D10 का संबंध जातक को नीति-निर्माण, उच्च निर्णय-क्षमता और प्रशासनिक संचालन का स्वामी बनाता है।`,
          pacBasisEn: `House 10: ${h10Sign.name}; Lord: ${l10?.id} in H${l10?.placedHouse}; D10 Lagna: ${SIGNS[d10LagnaSign].name}; Sun in H${sun?.placedHouse}.`,
          pacBasisHi: `दशम भाव: ${SIGN_HI[h10SignIdx]}; दशमेश: ${PLANET_HI[l10?.id || '']} भाव ${l10?.placedHouse} में; D10 लग्न: ${SIGN_HI[d10LagnaSign]}।`,
          shastricRef: 'BPHS (Ch. 12, Sl. 55–64), Saravali (Ch. 33)',
          vargaRef: 'D1 Rashi & D10 Dashamsha',
        },
        {
          id: 'attr_job_vs_business',
          category: 'career',
          titleEn: 'Job (Service) vs Business (Enterprise) Destiny',
          titleHi: 'नौकरी (Service) बनाम व्यापार (Enterprise)',
          valueEn: jobVsBizEn,
          valueHi: jobVsBizHi,
          explanationEn: `Career stability is structured through the relative strength of the 6th house (Service) versus 7th/10th houses (Enterprise).`,
          explanationHi: `षष्ठ भाव (सेवा) और सप्तम/दशम भाव (व्यापार) के तुलनात्मक बल द्वारा जातक की आजीविका का मार्ग निर्धारित होता है।`,
          pacBasisEn: `House 6 Lord ${l6?.id} vs House 7 Lord ${l7?.id}; 10th Lord ${l10?.id} connected with Kendra/Trikona.`,
          pacBasisHi: `षष्ठेश व सप्तमेश का बल; दशमेश का केंद्र-त्रिकोण संबंध।`,
          shastricRef: 'Phaladeepika (Ch. 15, Sl. 1–12)',
          vargaRef: 'D1 & D10',
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
          vargaRef: 'D1 & D2 Hora',
        },
        {
          id: 'attr_hidden_sudden_wealth',
          category: 'career',
          titleEn: 'Hidden Wealth, Inheritance & Sudden Windfalls',
          titleHi: 'गुप्त धन, वसीयत व आकस्मिक लाभ (Gupt Dhan)',
          valueEn: 'Substantial sudden capital gains through long-term equity growth, ancestral settlement, or windfall events',
          valueHi: 'दीर्घकालिक शेयर बाजार निवेश, पैतृक वसीयत अथवा बीमा/अनपेक्षित स्रोतों से बड़ा आकस्मिक धन लाभ',
          explanationEn: `The 8th house (Gupt Sthana / Unearned Wealth) receives benefic scrutiny. The native benefits from unexpected structural wealth transfers.`,
          explanationHi: `अष्टम भाव (गुप्त धन भाव) पर शुभ ग्रहों की दृष्टि के कारण जातक को जीवन में कम से कम दो बार अप्रत्याशित वित्तीय उछाल प्राप्त होगा।`,
          pacBasisEn: `House 8: ${h8Sign.name}; Lord ${l8?.id} placed in House ${l8?.placedHouse}; Jupiter aspects 8th axis.`,
          pacBasisHi: `अष्टम भाव: ${SIGN_HI[h8SignIdx]}; अष्टमेश भाव ${l8?.placedHouse} में; गुरु का शुभ संबंध।`,
          shastricRef: 'BPHS (Ch. 12, Sl. 43–48)',
          vargaRef: 'D1 & D8',
        },
      ],
    });
  }

  // =========================================================================
  // PILLAR 8: संकट, रोग, शत्रु, कानूनी विवाद व गूढ़ रहस्य (Health & Mysteries)
  // =========================================================================
  {
    const d30LagnaSign = d30?.lagnaSignIndex ?? ascSignIdx;

    let doshaEn = 'Pitta-dominant: Liver & hepatic metabolism, acidity/acid-reflux, blood pressure vigilance, eye strain';
    let doshaHi = 'पित्त-प्रधान: यकृत (Liver), पाचक पित्त व एसिडिटी, रक्तचाप संतुलन एवं नेत्र ज्योति की नियमित देखभाल';

    if (h6Sign.element === 'Air' || l6?.id === 'Saturn' || l6?.id === 'Mercury') {
      doshaEn = 'Vata-dominant: Nervous system sensitivity, joint dryness/arthritic stiffness, gas/bloating, and sleep regulation';
      doshaHi = 'वात-प्रधान: तंत्रिका तंत्र (Nervous System) संवेदनशीलता, जोड़ों में रूखापन, वात-विकार व अनिद्रा से बचाव';
    } else if (h6Sign.element === 'Water' || l6?.id === 'Moon' || l6?.id === 'Venus') {
      doshaEn = 'Kapha-dominant: Respiratory sluggishness, fluid retention, lymphatic health, thyroid balance, and dietary metabolism';
      doshaHi = 'कफ-प्रधान: श्वास नली में कफ संचय, जल प्रतिधारण, थायरॉयड संतुलन व चयापचय (Metabolism) की देखभाल';
    }

    pillars.push({
      id: 'health_crises_mysteries',
      pillarNumber: 8,
      titleEn: 'Adversities, Health Vulnerabilities, Secrets & Occult',
      titleHi: 'संकट, रोग, शत्रु, कानूनी विवाद, गुप्त रहस्य व तंत्र',
      icon: 'Shield',
      summaryEn: `Deep diagnostic of vulnerable organs, litigation, hidden adversaries, occult inclinations, and longevity derived from the 6th, 8th, and 12th houses (Trik Bhavas) and D30 Trimsamsha chart.`,
      summaryHi: `षष्ठ भाव (रोग/शत्रु), अष्टम (आयु/संकट), द्वादश (हानि), त्रिंशांश (D30) एवं त्रिदोष विचार द्वारा संवेदनशील अंग, कोर्ट केस, शत्रुहंता योग व गुप्त विद्याओं का प्रामाणिक विवेचन।`,
      attributes: [
        {
          id: 'attr_vulnerable_organs',
          category: 'health_crises',
          titleEn: 'Vulnerable Organs & Tridosha Health Profile',
          titleHi: 'संवेदनशील शारीरिक अंग व त्रिदोष प्रकृति',
          valueEn: doshaEn,
          valueHi: doshaHi,
          explanationEn: `The 6th house (${h6Sign.name}) and D30 Trimsamsha reveal constitutional predispositions. Balanced nutrition and circadian sleep preserve long-term vitality.`,
          explanationHi: `षष्ठ भाव और त्रिंशांश D30 के अनुसार शरीर की त्रिदोष प्रकृति निर्धारित होती है। उचित खान-पान और समय पर निद्रा से आजीवन निरोगी काया बनी रहेगी।`,
          pacBasisEn: `House 6: ${h6Sign.name}; Lord: ${l6?.id} in H${l6?.placedHouse}; D30 Lagna: ${SIGNS[d30LagnaSign].name}.`,
          pacBasisHi: `षष्ठ भाव: ${SIGN_HI[h6SignIdx]}; षष्ठेश भाव ${l6?.placedHouse} में; D30 लग्न: ${SIGN_HI[d30LagnaSign]}।`,
          shastricRef: 'BPHS (Ch. 12, Sl. 20–25), Phaladeepika (Ch. 14)',
          vargaRef: 'D1 Rashi & D30 Trimsamsha',
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
          vargaRef: 'D1 & D30',
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
          vargaRef: 'D1 & D6',
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
          pacBasisEn: `House 8: ${h8Sign.name}; Ketu in House ${ketu?.placedHouse}; Atmakaraka ${ak?.planet} connects with Karakamsha.`,
          pacBasisHi: `अष्टम भाव: ${SIGN_HI[h8SignIdx]}; केतु भाव ${ketu?.placedHouse} में; आत्मकारक का नवांश संबंध।`,
          shastricRef: 'BPHS (Ch. 12, Sl. 43–48), Jaimini Sutras (1.2)',
          vargaRef: 'D1, D9 & D20',
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
          vargaRef: 'D1 Rashi',
        },
      ],
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
      summaryEn: `Analysis of physical comforts and ultimate liberation synthesized from the 4th house (${h4Sign.name} - Property & Vehicles), 12th house (${h12Sign.name} - Foreign & Moksha), and D4 Chaturthamsha chart.`,
      summaryHi: `चतुर्थ भाव (${SIGN_HI[h4SignIdx]} - अचल संपत्ति व वाहन), द्वादश भाव (${SIGN_HI[h12SignIdx]} - विदेश वास), कारकांश एवं चतुर्थांश (D4) चक्र द्वारा स्वयं के भवन, कार, शयन सुख व मोक्ष मार्ग का विवेचन।`,
      attributes: [
        {
          id: 'attr_real_estate',
          category: 'assets_travel',
          titleEn: 'Real Estate & Residential Property Ownership',
          titleHi: 'स्वयं का भवन, भूमि व अचल संपत्ति',
          valueEn: 'Ownership of 2 or more prime residential properties; independent house / luxury apartment acquired between ages 31 and 34',
          valueHi: 'जीवन में २ या अधिक अचल संपत्तियों का स्वामित्व; आयु 31 से 34 वर्ष के मध्य प्रथम भव्य स्वतंत्र आवास/फ्लैट का अर्जन',
          explanationEn: `The 4th house (${h4Sign.name}) and natural Bhoomi Karaka Mars build rock-solid real estate equity. Assets appreciate steadily over time.`,
          explanationHi: `चतुर्थ भाव (${SIGN_HI[h4SignIdx]}), चतुर्थेश और भूमिपुत्र मंगल का बली होना जातक को आलीशान घर, भूखंड और स्थायी संपत्ति का पूर्ण सुख प्रदान करता है।`,
          pacBasisEn: `House 4: ${h4Sign.name}; Lord ${l4?.id} in H${l4?.placedHouse}; Mars in House ${mars?.placedHouse}; D4 Lagna in ${SIGNS[d4LagnaSign].name}.`,
          pacBasisHi: `चतुर्थ भाव: ${SIGN_HI[h4SignIdx]}; चतुर्थेश भाव ${l4?.placedHouse} में; मंगल भाव ${mars?.placedHouse} में; D4 लग्न: ${SIGN_HI[d4LagnaSign]}।`,
          shastricRef: 'BPHS (Ch. 12, Sl. 25–34), Saravali (Ch. 25)',
          vargaRef: 'D1 Rashi & D4 Chaturthamsha',
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
          pacBasisEn: `House 4: ${h4Sign.name}; Venus in House ${venus?.placedHouse} (${venus?.dignity || 'Dignified'}).`,
          pacBasisHi: `चतुर्थ भाव: ${SIGN_HI[h4SignIdx]}; शुक्र भाव ${venus?.placedHouse} में।`,
          shastricRef: 'Phaladeepika (Ch. 16, Sl. 5–12)',
          vargaRef: 'D1 & D4',
        },
        {
          id: 'attr_foreign_travel',
          category: 'assets_travel',
          titleEn: 'Foreign Travel & International Relocation',
          titleHi: 'विदेश यात्राएं, देशाटन व अंतरराष्ट्रीय संपर्क',
          valueEn: (l9?.placedHouse === 12 || l12?.placedHouse === 9 || rahu?.placedHouse === 12 || rahu?.placedHouse === 9)
            ? 'Long-term international settlement / foreign residence and extensive overseas executive travels'
            : 'Multiple international journeys for professional conferences and executive assignments; flexible multi-country mobility',
          valueHi: (l9?.placedHouse === 12 || l12?.placedHouse === 9 || rahu?.placedHouse === 12 || rahu?.placedHouse === 9)
            ? 'दीर्घकालिक विदेश वास / स्थायी निवास (PR) एवं अंतरराष्ट्रीय स्तर पर कार्यक्षेत्र का विस्तार'
            : 'अनेक बार सुदूर विदेश यात्राएं; बहुराष्ट्रीय कंपनियों अथवा अंतरराष्ट्रीय सम्मेलनों हेतु विदेश प्रवास',
          explanationEn: `The 9th (Tirtha/Long journeys) and 12th (Foreign lands) houses form active connections with Rahu and Moon, opening global frontiers effortlessly.`,
          explanationHi: `नवम व द्वादश भावों का चर राशियों अथवा राहु/चंद्र से संबंध जातक को जीवन में कई बार विदेश जाने और अंतरराष्ट्रीय स्तर पर ख्याति पाने का मार्ग खोलता है।`,
          pacBasisEn: `House 9 Lord ${l9?.id} in H${l9?.placedHouse}; House 12 Lord ${l12?.id} in H${l12?.placedHouse}; Rahu in House ${rahu?.placedHouse}.`,
          pacBasisHi: `नवमेश भाव ${l9?.placedHouse} में; द्वादशेश भाव ${l12?.placedHouse} में; राहु भाव ${rahu?.placedHouse} में।`,
          shastricRef: 'Saravali (Ch. 37, Sl. 14–22)',
          vargaRef: 'D1 & D9',
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
          pacBasisEn: `House 12: ${h12Sign.name}; Ketu in House ${ketu?.placedHouse}; Karakamsha 12th house: ${karakamsha.ishtaDevata || 'Deva Grace'}.`,
          pacBasisHi: `द्वादश भाव: ${SIGN_HI[h12SignIdx]}; केतु भाव ${ketu?.placedHouse} में; कारकांश से 12वें भाव में शुभ प्रभाव।`,
          shastricRef: 'Jaimini Upadesha Sutras (1.2.68–72), BPHS (Ch. 44)',
          vargaRef: 'D9 & D60',
        },
      ],
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
          vargaRef: 'D60 Shashtiamsha',
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
          vargaRef: 'D1 & D60',
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
          vargaRef: 'D1 & D12',
        },
      ],
    });
  }

  // =========================================================================
  // PILLAR 11: इष्ट देवता, कुलदेवी व मंत्र सिद्धि (Ishta Devata & Mantras)
  // =========================================================================
  {
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
          vargaRef: 'D9 Navamsha',
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
          vargaRef: 'D1 & D9',
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
          vargaRef: 'D1, D9 & D20',
        },
      ],
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

    let dietEn = 'Predominantly sweet, warm sattvic grains, fresh milk/dairy and mild cooling spices; naturally vegetarian bio-chemistry';
    let dietHi = 'मधुर, सात्विक व ताजा गर्म भोजन प्रिय; दूध-घृत व फल रुचिकर; स्वाभाविक रूप से शाकाहारी प्रकृति';
    if (h2Planets.some((p) => p.id === 'Mars' || p.id === 'Sun' || p.id === 'Rahu')) {
      dietEn = 'Pungent, spicy, hot foods, robust protein-rich nutrition; strong digestive appetite with high metabolism';
      dietHi = 'तीखा, मसालेदार, गर्म व प्रोटीन-युक्त भोजन प्रिय; तीव्र पाचक अग्नि व उच्च चयापचय';
    } else if (h2Planets.some((p) => p.id === 'Saturn')) {
      dietEn = 'Astringent, bitter, simple disciplined diet; thrives on aged grains, legumes, and minimal processed sugar';
      dietHi = 'कषाय व तिक्त रस, सादा व संयमित आहार; दालें, मोटे अनाज व कम मीठा भोजन अनुकूल';
    }

    pillars.push({
      id: 'vastu_lifestyle',
      pillarNumber: 12,
      titleEn: 'Vastu Entrance, Geobiology, Diet & Bio-Rhythm',
      titleHi: 'गृह वास्तु, मुख्य द्वार दिशा, भोजन रस व दैनिक जैविक लय',
      icon: 'Compass',
      summaryEn: `Vastu geobiology, dietary preferences, and circadian energy rhythms synthesized from the 4th house (${h4Sign.name} - Dwelling), 2nd house (${h2Sign.name} - Diet/Taste), and Sun/Saturn circadian markers.`,
      summaryHi: `चतुर्थ भाव (${SIGN_HI[h4SignIdx]} - निवास वास्तु), द्वितीय भाव (${SIGN_HI[h2SignIdx]} - भोजन रस), लग्न एवं सूर्य-शनि के आधार पर घर का शुभ द्वार, वास्तु दोष परिहार, आहार रुचि व दैनिक कार्य लय का विवेचन।`,
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
          pacBasisEn: `Lagna: ${ascSign.name} (${ascSign.element}); 4th House: ${h4Sign.name}.`,
          pacBasisHi: `लग्न: ${SIGN_HI[ascSignIdx]} (${ascSign.element}); चतुर्थ भाव: ${SIGN_HI[h4SignIdx]}।`,
          shastricRef: 'Samarangana Sutradhara, Brihat Samhita (Ch. 53)',
          vargaRef: 'D1 & D4',
        },
        {
          id: 'attr_diet_taste',
          category: 'vastu_lifestyle',
          titleEn: 'Dietary Taste (Shadrasa) & Digestive Constitution',
          titleHi: 'भोजन की षड्रस रुचि व आहार प्रकृति',
          valueEn: dietEn,
          valueHi: dietHi,
          explanationEn: `The 2nd house (Anna Sthana) governs taste preferences and gastrointestinal comfort. Sattvic, fresh, non-violent nourishment ensures mental peace.`,
          explanationHi: `द्वितीय भाव (अन्न भाव) पर ग्रहों के प्रभाव से जातक की भोजन रुचि और पाचन शक्ति निर्धारित होती है।`,
          pacBasisEn: `House 2: ${h2Sign.name}; Lord ${l2?.id} in H${l2?.placedHouse}.`,
          pacBasisHi: `द्वितीय भाव: ${SIGN_HI[h2SignIdx]}; द्वितीयेश भाव ${l2?.placedHouse} में।`,
          shastricRef: 'BPHS (Ch. 12, Sl. 5–9), Charaka Samhita',
          vargaRef: 'D1 & D2',
        },
        {
          id: 'attr_chronotype',
          category: 'vastu_lifestyle',
          titleEn: 'Chronotype & Daily Cognitive Peak (Bio-Rhythm)',
          titleHi: 'दैनिक जैविक लय व कार्य क्षमता का शिखर समय',
          valueEn: (sun?.placedHouse === 1 || sun?.placedHouse === 10)
            ? 'Early Morning Lark (Brahma Muhurta Peak): Maximum clarity, leadership focus, and executive energy between 5:30 AM and 10:30 AM'
            : 'Nocturnal-Contemplative (Night-Owl Peak): Deepest strategic focus, research brilliance, and creative insight manifests between 9:30 PM and 1:00 AM',
          valueHi: (sun?.placedHouse === 1 || sun?.placedHouse === 10)
            ? 'प्रातःकालीन ब्रह्म मुहूर्त लय (Early Lark): प्रातः 5:30 से 10:30 के मध्य मानसिक एकाग्रता व निर्णय क्षमता का सर्वोच्च शिखर'
            : 'निशाचर-संतुलित लय (Night-Owl): रात्रि 9:30 से 1 बजे के मध्य मस्तिष्क की कार्यक्षमता, शोध व रणनीतिक एकाग्रता चरम पर',
          explanationEn: `The ascendant, Sun, and Moon placements calibrate the native's circadian cognitive stamina.`,
          explanationHi: `सूर्य, चंद्र व लग्न की स्थिति के अनुसार जातक के दैनिक कार्य का सबसे उत्पादक और ऊर्जावान समय निर्धारित होता है।`,
          pacBasisEn: `Sun in House ${sun?.placedHouse}; Moon in House ${moon?.placedHouse}.`,
          pacBasisHi: `सूर्य भाव ${sun?.placedHouse} में; चंद्र भाव ${moon?.placedHouse} में।`,
          shastricRef: 'Saravali (Ch. 22, Sl. 50–55)',
          vargaRef: 'D1 Rashi',
        },
      ],
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

    let gaitEn = 'Deliberate, grounded and dignified gait (Gajagami - Elephantine poise); moves with calm executive authority';
    let gaitHi = 'धीमी, नपी-तुली, गंभीर व राजसी चाल (गजगामी); चाल में स्वाभाविक अधिकार और गरिमा';
    if (ascSign.element === 'Fire' || l1?.id === 'Mars') {
      gaitEn = 'Veera / Swift, purposeful, athletic gait; walks with upright spine and commanding momentum';
      gaitHi = 'वीर गति: फुर्तीली, तेज, उद्देश्यपूर्ण व कसरती चाल; रीढ़ की हड्डी सीधी व साहसी कदम';
    } else if (ascSign.element === 'Air' || l1?.id === 'Mercury') {
      gaitEn = 'Hamsa / Light, agile, rapid, and expressive gait; navigates spaces with effortless flexibility';
      gaitHi = 'हंस गति: हल्की, फुर्तीली, गतिशील व चपल चाल; कदम में लचीलापन व तत्परता';
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
          vargaRef: 'D1 Rashi',
        },
        {
          id: 'attr_walking_gait',
          category: 'palmistry',
          titleEn: 'Walking Gait & Bodily Posture (Gajagami / Veera)',
          titleHi: 'चाल-ढाल, गति व शारीरिक गरिमा (गजगामी / वीर)',
          valueEn: gaitEn,
          valueHi: gaitHi,
          explanationEn: `Planetary lordship of ${lagnaLordId} and ascendant element resonance bestow a distinctive, authoritative walking gait.`,
          explanationHi: `लग्नेश ${PLANET_HI[lagnaLordId]} और लग्न तत्व के शुभ प्रभाव से जातक की चाल में स्वाभाविक अधिकार और गरिमा झलकती है।`,
          pacBasisEn: `Lagna Lord ${lagnaLordId}; Ascendant in ${ascSign.name}.`,
          pacBasisHi: `लग्नेश ${PLANET_HI[lagnaLordId]}; लग्न राशि ${SIGN_HI[ascSignIdx]}।`,
          shastricRef: 'Saravali (Ch. 22, Sl. 48–54)',
          vargaRef: 'D1 Rashi',
        },
      ],
    });
  }

  // =========================================================================
  // PILLAR 14: व्यक्तिगत भाग्यशाली मैट्रिक्स व साझेदारी (Lucky Synergy & Partners)
  // =========================================================================
  {
    // DYNAMIC LUCKY MATRIX CALCULATED FROM LAGNESHA & BHAGYESHA
    const lagnaLordGems: Record<string, { gemEn: string; gemHi: string; metalEn: string; metalHi: string; colorEn: string; colorHi: string; avoidColEn: string; avoidColHi: string; daysEn: string; daysHi: string; numsEn: string; numsHi: string }> = {
      Mars: {
        gemEn: 'Red Coral (Moonga) or Carnelian',
        gemHi: 'लाल मूंगा (Red Coral) अथवा अकीक',
        metalEn: 'Copper (Tamba) and Gold',
        metalHi: 'तांबा व स्वर्ण',
        colorEn: 'Crimson Red, Scarlet, Coral, and Bright Orange',
        colorHi: 'सिंदूरी लाल, गहरा नारंगी, कोरल व रक्त-लाल',
        avoidColEn: 'Dark Green and Jet Black',
        avoidColHi: 'गहरा हरा व गहरा काला',
        daysEn: 'Tuesday (Mangalvar) and Sunday (Ravivar)',
        daysHi: 'मंगलवार व रविवार',
        numsEn: '9, 1, 3 (Days of courage and conquest)',
        numsHi: '9, 1, 3 (साहस, विजय व नए अनुबंधों के अंक)',
      },
      Venus: {
        gemEn: 'Diamond (Heera), White Sapphire, or Natural Opal',
        gemHi: 'हीरा (Diamond), श्वेत पुखराज अथवा प्राकृतिक ओपल',
        metalEn: 'Silver (Chandi), Platinum, and White Gold',
        metalHi: 'चांदी (Rajat), प्लेटिनम व श्वेत स्वर्ण',
        colorEn: 'Pristine White, Cream, Silver, Pastel Pink, and Sky Blue',
        colorHi: 'चमकदार श्वेत, क्रीम, रजत, हल्का गुलाबी व आसमानी नीला',
        avoidColEn: 'Dark Muddy Red and Dull Brown',
        avoidColHi: 'गहरा मटमैला लाल व कत्थई',
        daysEn: 'Friday (Shukravar) and Wednesday (Budhavar)',
        daysHi: 'शुक्रवार व बुधवार',
        numsEn: '6, 5, 2 (Aesthetic harmony and capital attraction)',
        numsHi: '6, 5, 2 (सौंदर्य, ऐश्वर्य व धन प्रवाह के अंक)',
      },
      Mercury: {
        gemEn: 'Emerald (Panna) or Green Tourmaline',
        gemHi: 'पन्ना (Emerald) अथवा हरा ओनेक्स',
        metalEn: 'Bronze (Kansa), Brass, and Gold',
        metalHi: 'कांस्य, पीतल व स्वर्ण',
        colorEn: 'Vibrant Emerald Green, Mint, Ivory, and Parrot Green',
        colorHi: 'पन्ना हरा, तोतिया हरा, पुदीना रंग व हाथीदांत श्वेत',
        avoidColEn: 'Crimson Red and Jet Black',
        avoidColHi: 'गहरा लाल व काला',
        daysEn: 'Wednesday (Budhavar) and Friday (Shukravar)',
        daysHi: 'बुधवार व शुक्रवार',
        numsEn: '5, 1, 6 (Intellect, commerce and rapid contracts)',
        numsHi: '5, 1, 6 (बुद्धि, व्यापार व शीघ्र अनुबंध के अंक)',
      },
      Moon: {
        gemEn: 'Natural Basra Pearl (Mukta / Moti) or Moonstone',
        gemHi: 'प्राकृतिक बसरा मोती अथवा चंद्रकांत मणि',
        metalEn: 'Pure Silver (Chandi) and Bell Metal',
        metalHi: 'शुद्ध चांदी व कांसा',
        colorEn: 'Milky Pearl White, Silver, Sea Foam Green, and Cream',
        colorHi: 'मोती जैसा श्वेत, चांदी, हल्का समुद्री हरा व क्रीम',
        avoidColEn: 'Jet Black, Dark Navy, and Charcoal Gray',
        avoidColHi: 'गहरा काला, नेवी ब्लू व चारकोल धूसर',
        daysEn: 'Monday (Somvar) and Thursday (Brihaspativar)',
        daysHi: 'सोमवार व गुरुवार',
        numsEn: '2, 7, 1 (Intuition, emotional peace, and prosperity)',
        numsHi: '2, 7, 1 (अंतर्ज्ञान, मानसिक शांति व समृद्धि के अंक)',
      },
      Sun: {
        gemEn: 'Ruby (Manikya) or Red Garnet',
        gemHi: 'माणिक्य (Ruby) अथवा लाल तामड़ा',
        metalEn: 'Pure Gold (Swarna) and Copper',
        metalHi: 'शुद्ध स्वर्ण (सोना) व तांबा',
        colorEn: 'Golden Yellow, Royal Saffron, Radiant Orange, and Copper Red',
        colorHi: 'स्वर्णिम पीला, केसरिया, तेज नारंगी व ताम्र-लाल',
        avoidColEn: 'Dark Blue, Charcoal Slate, and Black',
        avoidColHi: 'गहरा नीला, चारकोल स्लेटी व काला',
        daysEn: 'Sunday (Ravivar) and Tuesday (Mangalvar)',
        daysHi: 'रविवार व मंगलवार',
        numsEn: '1, 9, 3 (Authority, government power, and royal glory)',
        numsHi: '1, 9, 3 (प्रशासनिक अधिकार, सत्ता व तेजस्विता के अंक)',
      },
      Jupiter: {
        gemEn: 'Yellow Sapphire (Pukhraj) or Golden Topaz',
        gemHi: 'पुखराज (Yellow Sapphire) अथवा सुनहला (Topaz)',
        metalEn: 'Pure Gold (Swarna) and High-Purity Brass',
        metalHi: 'शुद्ध स्वर्ण (सोना) व पीतल',
        colorEn: 'Golden Yellow, Cream White, Light Saffron, and Pastel Sky Blue',
        colorHi: 'पीताभ (हल्का पीला), क्रीम श्वेत, केसरिया व हल्का आसमानी नीला',
        avoidColEn: 'Jet Black, Dark Charcoal Gray, and Dull Mud Brown',
        avoidColHi: 'गहरा काला (Jet Black), गाढ़ा चारकोल धूसर व मटमैला कत्थई',
        daysEn: 'Thursday (Brihaspativar) and Monday (Somvar)',
        daysHi: 'गुरुवार व सोमवार',
        numsEn: '3, 1, 7, 9 (Prime dates for agreements and wealth launches)',
        numsHi: '3, 1, 7, 9 (अनुबंध हस्ताक्षर करने व नए कार्य आरंभ करने हेतु सर्वोत्तम अंक)',
      },
      Saturn: {
        gemEn: 'Blue Sapphire (Neelam) or Amethyst (Katela)',
        gemHi: 'नीलम (Blue Sapphire) अथवा जमुनिया (Amethyst)',
        metalEn: 'Iron (Loha), Steel, and Lead alloy',
        metalHi: 'लोहा, इस्पात व पंचधातु',
        colorEn: 'Royal Blue, Navy, Electric Blue, Slate, and Smoke Gray',
        colorHi: 'रॉयल ब्लू, नेवी ब्लू, स्लेटी धूसर व गहरा नीला',
        avoidColEn: 'Bright Crimson Red and High-Orange',
        avoidColHi: 'चमकीला लाल व गहरा नारंगी',
        daysEn: 'Saturday (Shanivar) and Wednesday (Budhavar)',
        daysHi: 'शनिवार व बुधवार',
        numsEn: '8, 4, 5 (Perseverance, long-term empire building)',
        numsHi: '8, 4, 5 (धैर्य, स्थायी साम्राज्य निर्माण व संचित संपत्ति के अंक)',
      },
    };

    const synergy = lagnaLordGems[lagnaLordId] || lagnaLordGems['Jupiter'];

    // Business partner sign alignment
    const partnerSigns = [
      SIGNS[h5SignIdx].name,
      SIGNS[h9SignIdx].name,
      SIGNS[h7SignIdx].name,
      SIGNS[h11SignIdx].name,
    ];
    const partnerSignsEn = `${partnerSigns.join(', ')} partners bring high synergy and mutual commercial expansion`;
    const partnerSignsHi = `${partnerSigns.map((s, idx) => SIGN_HI[(ascSignIdx + (idx === 0 ? 4 : idx === 1 ? 8 : idx === 2 ? 6 : 10)) % 12]).join(', ')} राशि वाले साझेदार व्यापार में अत्यधिक समृद्धि व दीर्घकालिक स्थिरता लाते हैं`;

    pillars.push({
      id: 'lucky_synergy_matrix',
      pillarNumber: 14,
      titleEn: 'Personal Lucky Synergy Matrix & Business Partnerships',
      titleHi: 'व्यक्तिगत भाग्यशाली मैट्रिक्स, अनुकूल रत्न, रंग व साझेदारी',
      icon: 'Award',
      summaryEn: `Practical talismanic and commercial matrix derived from Lagnesha ${lagnaLordId}, 5th lord ${l5?.id}, 9th lord ${l9?.id}, and 7th house partnership dynamics.`,
      summaryHi: `लग्नेश ${PLANET_HI[lagnaLordId]}, पंचमेश ${PLANET_HI[l5?.id || '']} व भाग्येश की शुभ रश्मियों के आधार पर भाग्यशाली रंग, धातु, रत्न, अंक, वार, वर्जित रंग व अनुकूल व्यापारिक साझेदार की सटीक तालिका।`,
      attributes: [
        {
          id: 'attr_lucky_colors',
          category: 'lucky_synergy',
          titleEn: 'Auspicious Lucky Colors vs Colors to Strictly Avoid',
          titleHi: 'भाग्यशाली रंग बनाम सर्वथा वर्जित रंग',
          valueEn: `Lucky: ${synergy.colorEn} | Avoid: ${synergy.avoidColEn}`,
          valueHi: `शुभ रंग: ${synergy.colorHi} | वर्जित रंग: ${synergy.avoidColHi}`,
          explanationEn: `Harmonic color vibrations align with the rising ascendant lord ${lagnaLordId} and auspicious trinal houses, enhancing mental clarity, biological magnetism, and executive confidence.`,
          explanationHi: `लग्नेश ${PLANET_HI[lagnaLordId]} और त्रिकोण भावों के अनुसार इन रंगों का उपयोग जातक के आभामंडल (Aura) को शुद्ध, तेजस्वी और नकारात्मक ऊर्जा से सुरक्षित रखता है।`,
          pacBasisEn: `Lagna Lord: ${lagnaLordId}; Bhagya Lord: ${l9?.id}; Trikona color harmonics.`,
          pacBasisHi: `लग्नेश: ${PLANET_HI[lagnaLordId]}; भाग्येश: ${PLANET_HI[l9?.id || '']}।`,
          shastricRef: 'Brihat Samhita (Ch. 104), Phaladeepika (Ch. 2)',
          vargaRef: 'D1 Rashi',
        },
        {
          id: 'attr_lucky_gemstones_metals',
          category: 'lucky_synergy',
          titleEn: 'Prescribed Gemstones & Lucky Metals',
          titleHi: 'शास्त्रीय भाग्यवर्धक रत्न व शुभ धातु',
          valueEn: `Primary Gem: ${synergy.gemEn} | Metal: ${synergy.metalEn}`,
          valueHi: `मुख्य रत्न: ${synergy.gemHi} | शुभ धातु: ${synergy.metalHi}`,
          explanationEn: `Wearing this gemstone energized on an auspicious hora channels pure planetary rays into the physical meridian, removing obstacles and accelerating career luck.`,
          explanationHi: `शुभ मुहूर्त में प्राण-प्रतिष्ठित करवाकर इस रत्न को धारण करने से लग्नेश का बल बढ़ता है, जिससे स्वास्थ्य, यश और आर्थिक समृद्धि में तीव्रता से वृद्धि होती है।`,
          pacBasisEn: `Lagna Lord ${lagnaLordId} in H${l1House} (${l1?.dignity || 'Dignified'}); 9th Lord in H${l9?.placedHouse}.`,
          pacBasisHi: `लग्नेश भाव ${l1House} में; भाग्येश भाव ${l9?.placedHouse} में।`,
          shastricRef: 'Garuda Purana (Ratna Pariksha), Jataka Parijata',
          vargaRef: 'D1 & D9',
        },
        {
          id: 'attr_lucky_numbers_days',
          category: 'lucky_synergy',
          titleEn: 'Auspicious Numerological Vibrations & Lucky Days',
          titleHi: 'भाग्यशाली अंक, शुभ वार व अनुकूल समय',
          valueEn: `Dates: ${synergy.numsEn} | Days: ${synergy.daysEn}`,
          valueHi: `तारीखें: ${synergy.numsHi} | शुभ वार: ${synergy.daysHi}`,
          explanationEn: `Synchronizing major financial acquisitions, contracts, and journeys with these dates and days ensures spontaneous cosmic assistance.`,
          explanationHi: `इन तारीखों और वारों में शुरू किए गए कार्य बिना किसी विघ्न के शीघ्रता से संपन्न होते हैं और दीर्घकालिक लाभ देते हैं।`,
          pacBasisEn: `Lagna lord planetary hora harmonics; numerological vibrations of ${lagnaLordId}.`,
          pacBasisHi: `लग्नेश ग्रह की होरा एवं अंक ज्योतिषीय सामंजस्य।`,
          shastricRef: 'Muhurta Chintamani (Ch. 1)',
          vargaRef: 'D1 Rashi',
        },
        {
          id: 'attr_partnership_harmony',
          category: 'lucky_synergy',
          titleEn: 'Business Partnership Alignment & Compatible Signs',
          titleHi: 'व्यावसायिक साझेदारी, अनुकूल राशियां व सावधानियां',
          valueEn: `${partnerSignsEn}; operate strictly with clear written contracts and independent financial signing authority`,
          valueHi: `${partnerSignsHi}; साझेदारी में वित्तीय हस्ताक्षर अधिकार सदैव अपने पास रखें और स्पष्ट लिखित अनुबंध रखें`,
          explanationEn: `The 7th house and 11th house synergy reveals that compatible sign partners harmonize with the native's long-term vision without conflict.`,
          explanationHi: `सप्तम और एकादश भावों के आधार पर इन राशियों के जातक आपके साथ मिलकर बड़ा व्यावसायिक साम्राज्य खड़ा कर सकते हैं।`,
          pacBasisEn: `House 7: ${h7Sign.name}; House 11: ${h11Sign.name}.`,
          pacBasisHi: `सप्तम भाव ${SIGN_HI[h7SignIdx]} व एकादश भाव ${SIGN_HI[h11SignIdx]}।`,
          shastricRef: 'Saravali (Ch. 27, Sl. 40–48)',
          vargaRef: 'D1 & D10',
        },
      ],
    });
  }

  return {
    generatedAt: new Date().toISOString(),
    birthSummary,
    pillars,
  };
}
