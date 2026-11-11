import { NAKSHATRAS, NINE_GRAHAS } from '../constants';
import type { BodyPosition, ChartData } from '../types';
import type { PredictionBodyId } from './planetInSign';

export interface PlanetInNakshatraPrediction {
  planet: PredictionBodyId;
  nakshatraIndex: number;
  nakshatraNameEn: string;
  nakshatraNameHi: string;
  pada: number;
  nakshatraLord: string;
  deityEn: string;
  deityHi: string;
  symbolEn: string;
  symbolHi: string;
  gana: string;
  nadi: string;
  yoni: string;
  taraFromMoonEn: string;
  taraFromMoonHi: string;
  taraAuspicious: boolean;
  padaNuanceEn: string;
  padaNuanceHi: string;
  readingEn: string;
  readingHi: string;
  vocationEn: string;
  vocationHi: string;
  source: string;
}

const NAK_HI = [
  'अश्विनी', 'भरणी', 'कृत्तिका', 'रोहिणी', 'मृगशिरा', 'आर्द्रा', 'पुनर्वसु', 'पुष्य', 'अश्लेषा',
  'मघा', 'पूर्वा फाल्गुनी', 'उत्तरा फाल्गुनी', 'हस्त', 'चित्रा', 'स्वाति', 'विशाखा', 'अनुराधा', 'ज्येष्ठा',
  'मूल', 'पूर्वाषाढ़ा', 'उत्तराषाढ़ा', 'श्रवण', 'धनिष्ठा', 'शतभिषा', 'पूर्वा भाद्रपद', 'उत्तरा भाद्रपद', 'रेवती',
];

const NAK_EXT: Array<{
  deityHi: string;
  symEn: string;
  symHi: string;
  natureEn: string;
  natureHi: string;
  vocEn: string;
  vocHi: string;
}> = [
  { deityHi: 'अश्विनी कुमार (देव वैद्य)', symEn: 'Horse Head', symHi: 'अश्व मुख', natureEn: 'swift healing, pioneering vitality, spontaneous breakthroughs', natureHi: 'तीव्र गति, चिकित्सा प्रतिभा, नव-आरंभ व चमत्कारी उपचार', vocEn: 'medicine, emergency care, athletics, transport, tech launches', vocHi: 'चिकित्सा, आयुर्वेद, परिवहन, खेल एवं नवाचार' },
  { deityHi: 'यम देव (धर्मराज)', symEn: 'Yoni (Womb)', symHi: 'योनि / सृजन द्वार', natureEn: 'intense creative gestation, endurance, transformative restraint', natureHi: 'सृजन क्षमता, गहन सहनशक्ति, न्यायप्रियता व रूपांतरण', vocEn: 'obstetrics, finance/custody, entertainment, law, crisis work', vocHi: 'वित्त प्रबंधन, कला-सिनेमा, न्याय एवं संरक्षण कार्य' },
  { deityHi: 'अग्नि देव', symEn: 'Razor / Flame', symHi: 'अग्नि शिखा / छुरा', natureEn: 'purifying precision, sharp candor, protective nourishment', natureHi: 'तेजस्विता, स्पष्टवादिता, शुद्धिकरण व तीक्ष्ण मेधा', vocEn: 'culinary arts, defense, surgery, auditing, leadership', vocHi: 'प्रशासन, रक्षा, पाक कला, शल्य-चिकित्सा व लेखा परीक्षण' },
  { deityHi: 'प्रजापति ब्रह्मा', symEn: 'Ox Cart / Chariot', symHi: 'रथ / शकट', natureEn: 'fertile creativity, magnetic beauty, bountiful cultivation', natureHi: 'समृद्धि, सौंदर्य, कलात्मक आकर्षण व उर्वर कल्पना', vocEn: 'design, luxury goods, agriculture, media, hospitality', vocHi: 'डिजाइन, कृषि, मीडिया, आतिथ्य व कला-व्यवसाय' },
  { deityHi: 'सोम (चंद्र देव)', symEn: 'Deer Head', symHi: 'मृग शिर', natureEn: 'curious seeking, gentle intelligence, sensory artistry', natureHi: 'खोजी प्रवृत्ति, कोमल बुद्धि, यात्रा व संगीत-सौंदर्य', vocEn: 'research, travel, journalism, textiles, counseling', vocHi: 'शोध, पत्रकारिता, यात्रा, वस्त्र एवं परामर्श' },
  { deityHi: 'रुद्र (शिव)', symEn: 'Teardrop / Diamond', symHi: 'अश्रु बिंदु / हीरा', natureEn: 'storm-like clarity after emotional depth, razor intellect', natureHi: 'प्रचंड बुद्धि, भावनात्मक मंथन के बाद सत्य-दर्शन व तकनीकी कुशलता', vocEn: 'data science, neurology, electrical/software systems, psychology', vocHi: 'सॉफ्टवेयर, डेटा विज्ञान, मनोविज्ञान व शोध कार्य' },
  { deityHi: 'अदिति (देवमाता)', symEn: 'Bow & Quiver', symHi: 'धनुष एवं तरकश', natureEn: 'resilient renewal, welcoming wisdom, safe return & abundance', natureHi: 'पुनर्निर्माण, उदारता, आध्यात्मिक सुरक्षा व सौभाग्य वापसी', vocEn: 'teaching, publishing, architecture, mentoring, exports', vocHi: 'शिक्षण, लेखन, वास्तुकला, निर्यात व मार्गदर्शन' },
  { deityHi: 'बृहस्पति (देवगुरु)', symEn: 'Lotus / Udder', symHi: 'कमल / अमृत कलश', natureEn: 'supreme nourishment, selfless dharma, calm patient prosperity', natureHi: 'परम पोषण, धार्मिकता, धैर्य व स्थायी लोककल्याणकारी समृद्धि', vocEn: 'advisory, education, dairy/nutrition, governance, priesthood', vocHi: 'शिक्षा, राजनीति, सलाहकार, धर्म व जनसेवा' },
  { deityHi: 'सर्प देवता', symEn: 'Coiled Serpent', symHi: 'कुंडलित सर्प', natureEn: 'hypnotic insight, strategic intuition, protective cunning', natureHi: 'कूटनीतिक सूझबूझ, तीक्ष्ण अंतर्ज्ञान व गोपनीय रणनीति', vocEn: 'pharmacology, occult research, corporate strategy, auditing', vocHi: 'रसायन-चिकित्सा, कॉर्पोरेट रणनीति व गूढ़ शोध' },
  { deityHi: 'पितृगण (पूर्वज)', symEn: 'Royal Throne', symHi: 'राजसिंहासन', natureEn: 'ancestral dignity, regal authority, tradition preservation', natureHi: 'पैतृक गौरव, राजसी अधिकार, परंपरा-निष्ठा व उच्च पद', vocEn: 'executive leadership, heritage management, history, government', vocHi: 'प्रशासन, राजकार्य, प्रबंधन व पारंपरिक व्यवसाय' },
  { deityHi: 'भग (ऐश्वर्य देव)', symEn: 'Swinging Hammock', symHi: 'शय्या / झूला', natureEn: 'creative romance, relaxation charm, charismatic generosity', natureHi: 'सृजन, आनंद, मधुर आकर्षण व कलात्मक ऐश्वर्य', vocEn: 'performing arts, wedding/luxury curation, PR, design', vocHi: 'मनोरंजन, विवाह-इवेंट, पीआर एवं रचनात्मक कला' },
  { deityHi: 'अर्यमन (मैत्री देव)', symEn: 'Four Poster Bed / Contract', symHi: 'मैत्री एवं अनुबंध', natureEn: 'honorable patronage, reliable friendships, constructive philanthropy', natureHi: 'मित्रता निभाना, संगठन निर्माण, विश्वसनीयता व परोपकार', vocEn: 'HR/unions, corporate law, philanthropy, partnerships', vocHi: 'साझेदारी व्यवसाय, मानव संसाधन, कानून व समाजसेवा' },
  { deityHi: 'सवितृ (सूर्य देव)', symEn: 'Open Hand', symHi: 'हथेली / पांच अंगुलियाँ', natureEn: 'dexterous handcraft, sparkling humor, resourceful skill', natureHi: 'हस्तकौशल, हास्य-व्यंग्य, व्यावसायिक निपुणता व त्वरित समाधान', vocEn: 'crafts, surgery, coding, accountancy, media arts', vocHi: 'शिल्प, शल्य चिकित्सा, कोडिंग, लेखा व मीडिया' },
  { deityHi: 'त्वष्टा (विश्वकर्मा)', symEn: 'Shining Jewel', symHi: 'चमकती मणि', natureEn: 'architectural beauty, luminous craftsmanship, bold individuality', natureHi: 'वास्तु एवं सृजन सौंदर्य, आकर्षक व्यक्तित्व व स्वतंत्र प्रतिभा', vocEn: 'architecture, fashion, jewelcraft, UI design, cinematography', vocHi: 'आर्किटेक्चर, फैशन, आभूषण, यूआई डिज़ाइन व कला' },
  { deityHi: 'वायु देव', symEn: 'Coral Shoot in Wind', symHi: 'हवा में लहराता अंकुर', natureEn: 'flexible diplomacy, independent commerce, graceful adaptability', natureHi: 'स्वतंत्र व्यापार कौशल, लचीलापन, मधुर कूटनीति व संतुलन', vocEn: 'diplomacy, commerce, aviation, marketing, software', vocHi: 'व्यापार, कूटनीति, विमानन, मार्केटिंग व तकनीक' },
  { deityHi: 'इंद्राग्नि', symEn: 'Triumphal Arch', symHi: 'विजय तोरण', natureEn: 'single-pointed ambition, goal conquest, persuasive speech', natureHi: 'एकाग्र महत्वाकांक्षा, लक्ष्य-सिद्धि व प्रभावशाली वाक्शक्ति', vocEn: 'law, politics, entrepreneurship, motivational leadership', vocHi: 'वकालत, राजनीति, उद्यमिता व नेतृत्व' },
  { deityHi: 'मित्र देव', symEn: 'Lotus in Mud', symHi: 'पुष्प एवं विजय माल', natureEn: 'devoted friendship, quiet persistence, organizational unity', natureHi: 'निष्ठावान मित्रता, धैर्यशील संगठन व भक्ति-भावना', vocEn: 'music, analytics, international alliances, teamwork', vocHi: 'संगीत, डेटा विश्लेषण, अंतर्राष्ट्रीय समन्वय व संगठन' },
  { deityHi: 'देवराज इंद्र', symEn: 'Protective Amulet', symHi: 'कुंडल / रक्षा कवच', natureEn: 'senior authority, protective responsibility, strategic depth', natureHi: 'वरिष्ठ अधिकार, परिवार/संस्थान संरक्षण व तीक्ष्ण रक्षा-बुद्धि', vocEn: 'executive defense, investigative policy, telecom, surgery', vocHi: 'प्रबंधन, रक्षा, नीति-निर्माण एवं अन्वेषण' },
  { deityHi: 'निरृति', symEn: 'Tied Roots', symHi: 'जड़ों का गुच्छा', natureEn: 'root-level investigation, fearless truth-seeking, transformation', natureHi: 'मूल से सत्य की खोज, निर्भीक अनुसंधान व रूपांतरण', vocEn: 'botany/medicine, root-cause engineering, philosophy, law', vocHi: 'चिकित्सा, शोध, दर्शन, न्याय एवं गहन विज्ञान' },
  { deityHi: 'आपः (जल देव)', symEn: 'Elephant Tusk / Winnowing Fan', symHi: 'हाथी दांत / सूप', natureEn: 'invincible optimism, persuasive articulation, purifying flow', natureHi: 'अजेय आशावाद, प्रवाहपूर्ण वाणी व लोकप्रिय प्रभाव', vocEn: 'public speaking, shipping/water, debate, media', vocHi: 'वक्तृत्व, जनसंपर्क, मीडिया एवं जल/नौवहन उद्योग' },
  { deityHi: 'विश्वेदेवाः', symEn: 'Elephant Tusk / Planks', symHi: 'विजय आसन', natureEn: 'unstoppable enduring victory through ethics and steady duty', natureHi: 'धर्मयुक्त स्थायी विजय, कर्तव्यनिष्ठा व उच्च आदर्श', vocEn: 'civil service, military/justice ethics, pioneer leadership', vocHi: 'प्रशासन, न्याय, सिविल सेवा एवं नेतृत्व' },
  { deityHi: 'भगवान विष्णु', symEn: 'Ear / Three Footprints', symHi: 'कान / तीन पग', natureEn: 'attentive listening, scholarly absorption, quiet wisdom & travel', natureHi: 'गहन श्रवण शक्ति, विद्या-प्रेम, विनम्र ज्ञान व यात्रा', vocEn: 'teaching, audio/music, counseling, languages, travel', vocHi: 'शिक्षण, संगीत, परामर्श, भाषाएँ एवं जन-संपर्क' },
  { deityHi: 'अष्ट वसु', symEn: 'Musical Drum (Damru)', symHi: 'मृदंग / डमरू', natureEn: 'rhythmic harmony, wealth stewardship, timing & charitable stature', natureHi: 'संगीत-लय, धन-संपत्ति प्रबंधन, समयबद्ध कार्य व यश', vocEn: 'finance, music/dance, real estate, rhythmic sports', vocHi: 'वित्त, संगीत, भूमि-भवन व प्रशासनिक समन्वय' },
  { deityHi: 'वरुण देव', symEn: 'Empty Circle (100 Stars)', symHi: 'सौ तारे / वृत्त', natureEn: 'secretive healing, cosmic systems thinking, solitary mastery', natureHi: 'गूढ़ चिकित्सा, ब्रह्मांडीय/तकनीकी दृष्टि व स्वतंत्र शोध', vocEn: 'biotech, astronomy, coding, pharmaceuticals, healing', vocHi: 'जैव-प्रौद्योगिकी, खगोल, औषधि, कोडिंग व चिकित्सा' },
  { deityHi: 'अज एकपाद', symEn: 'Front Legs of Cot / Sword', symHi: 'खटिया के अगले दो पाए', natureEn: 'fiery idealism, prophetic intensity, transformative vision', natureHi: 'उच्च आदर्श, तीव्र आध्यात्मिक अंतर्दृष्टि व परिवर्तन-संकल्प', vocEn: 'philosophy, psychiatry, activism, spiritual research', vocHi: 'दर्शन, मनोविज्ञान, लेखन व आध्यात्मिक शोध' },
  { deityHi: 'अहिर्बुध्न्य', symEn: 'Back Legs / Deep Serpent', symHi: 'गहरे जल में सर्प', natureEn: 'serene cosmic wisdom, charitable grace, enduring mental depth', natureHi: 'गंभीर प्रज्ञा, परोपकार, धैर्यशील भक्ति व मानसिक गहराई', vocEn: 'charitable foundations, architecture, academia, therapy', vocHi: 'परोपकार, उच्च शिक्षा, परामर्श व वास्तुकला' },
  { deityHi: 'पूषा देव (सूर्य)', symEn: 'Pair of Fish / Drum', symHi: 'मछली जोड़ा / मृदंग', natureEn: 'gentle nourishment, creative empathy, safe journeys & completion', natureHi: 'कोमल पोषण, कलात्मक करुणा, सुरक्षित यात्रा व पूर्णता', vocEn: 'mentorship, arts, hospitality, foster/care, digital creation', vocHi: 'शिक्षण-पालन, कला, आतिथ्य व सृजनात्मक कार्य' },
];

const TARA_NAMES = [
  { en: 'Janma Tara (Birth — Sensitive/Active)', hi: 'जन्म तारा (स्वभाव-प्रधान)', ok: true },
  { en: 'Sampat Tara (Wealth & Prosperity)', hi: 'संपत तारा (धन व समृद्धि)', ok: true },
  { en: 'Vipat Tara (Cautious / Tests)', hi: 'विपत तारा (सतर्कता आवश्यक)', ok: false },
  { en: 'Kshema Tara (Safety & Wellbeing)', hi: 'क्षेम तारा (कल्याण व सुरक्षा)', ok: true },
  { en: 'Pratyari Tara (Friction / Adaptation)', hi: 'प्रत्यरि तारा (धैर्य अपेक्षित)', ok: false },
  { en: 'Sadhaka Tara (Accomplishment)', hi: 'साधक तारा (कार्य सिद्धि)', ok: true },
  { en: 'Naidhana Tara (Transformative Caution)', hi: 'नैधन तारा (सावधानी व परिवर्तन)', ok: false },
  { en: 'Mitra Tara (Friendly Grace)', hi: 'मित्र तारा (सहायक व शुभ)', ok: true },
  { en: 'Parama Mitra Tara (Supreme Blessing)', hi: 'परम मित्र तारा (अत्यंत शुभ)', ok: true },
];

const PADA_NUANCE = [
  { en: 'Pada 1 (Dharma / Aries-Navamsha impulse): bold initiation & pioneering spark.', hi: 'चरण 1 (धर्म व मेष नवांश): तीव्र पहल, उत्साह व नेतृत्व।' },
  { en: 'Pada 2 (Artha / Taurus-Navamsha impulse): practical grounding, resource & craft.', hi: 'चरण 2 (अर्थ व वृषभ नवांश): व्यावहारिक स्थिरता, धन व सृजन।' },
  { en: 'Pada 3 (Kama / Gemini-Navamsha impulse): intellect, networking, skill & wit.', hi: 'चरण 3 (काम व मिथुन नवांश): संवाद, बहुमुखी बुद्धि व संपर्क।' },
  { en: 'Pada 4 (Moksha / Cancer-Navamsha impulse): empathy, intuition & emotional wisdom.', hi: 'चरण 4 (मोक्ष व कर्क नवांश): संवेदनशीलता, अंतर्ज्ञान व सेवा।' },
];

const BODY_ROLE: Record<PredictionBodyId, { en: string; hi: string }> = {
  Asc: { en: 'Lagna rising behavior & bodily vitality', hi: 'लग्न व्यक्तित्व व जीवन-दिशा' },
  Sun: { en: 'Soul conviction, confidence & career authority', hi: 'आत्मबल, पिता व नेतृत्व' },
  Moon: { en: 'Emotional core, mind, mother & social resonance', hi: 'मन, भावना, माता व जन-संबंध' },
  Mars: { en: 'Courage, ambition, technical action & assertiveness', hi: 'साहस, ऊर्जा, भूमि व निर्णय' },
  Mercury: { en: 'Speech, memory, analytical reasoning & trade', hi: 'बुद्धि, वाणी, लेखन व व्यापार' },
  Jupiter: { en: 'Wisdom, fortune, teachers, dharma & growth', hi: 'ज्ञान, भाग्य, धर्म व समृद्धि' },
  Venus: { en: 'Relationships, beauty, luxury & artistic joy', hi: 'प्रेम, दांपत्य, कला व सुख' },
  Saturn: { en: 'Work ethic, karma, endurance & structural mastery', hi: 'कर्म, अनुशासन, धैर्य व न्याय' },
  Rahu: { en: 'Breakthrough cravings, technology & global reach', hi: 'नवाचार, महत्वाकांक्षा व तकनीक' },
  Ketu: { en: 'Innate past-life expertise, research & detachment', hi: 'पूर्व-संस्कार, शोध व अध्यात्म' },
};

function buildOne(
  body: BodyPosition,
  moonNakIdx: number
): PlanetInNakshatraPrediction {
  const nIdx = ((body.nakshatraIndex % 27) + 27) % 27;
  const pada = Math.max(1, Math.min(4, body.pada));
  const nakInfo = NAKSHATRAS[nIdx];
  const ext = NAK_EXT[nIdx];
  const taraIdx = ((nIdx - moonNakIdx + 27) % 9);
  const tara = TARA_NAMES[taraIdx];
  const pNu = PADA_NUANCE[pada - 1];
  const role = BODY_ROLE[body.id as PredictionBodyId] ?? BODY_ROLE.Sun;

  return {
    planet: body.id as PredictionBodyId,
    nakshatraIndex: nIdx,
    nakshatraNameEn: nakInfo.name,
    nakshatraNameHi: NAK_HI[nIdx],
    pada,
    nakshatraLord: nakInfo.lord,
    deityEn: nakInfo.deity,
    deityHi: ext.deityHi,
    symbolEn: ext.symEn,
    symbolHi: ext.symHi,
    gana: nakInfo.gana,
    nadi: nakInfo.nadi,
    yoni: nakInfo.yoni,
    taraFromMoonEn: tara.en,
    taraFromMoonHi: tara.hi,
    taraAuspicious: tara.ok,
    padaNuanceEn: pNu.en,
    padaNuanceHi: pNu.hi,
    readingEn: `${body.id === 'Asc' ? 'Ascendant' : body.id} in ${nakInfo.name} Pada ${pada} (ruled by ${nakInfo.lord}, Deity: ${nakInfo.deity}) infuses your ${role.en.toLowerCase()} with ${ext.natureEn}. Relation to Moon Nakshatra: ${tara.en}.`,
    readingHi: `${NAK_HI[nIdx]} नक्षत्र के ${pada} चरण (स्वामी: ${nakInfo.lord === 'Sun' ? 'सूर्य' : nakInfo.lord === 'Moon' ? 'चंद्र' : nakInfo.lord === 'Mars' ? 'मंगल' : nakInfo.lord === 'Mercury' ? 'बुध' : nakInfo.lord === 'Jupiter' ? 'गुरु' : nakInfo.lord === 'Venus' ? 'शुक्र' : nakInfo.lord === 'Saturn' ? 'शनि' : nakInfo.lord === 'Rahu' ? 'राहु' : 'केतु'}, देवता: ${ext.deityHi}) में स्थित होकर यह ग्रह ${role.hi} को ${ext.natureHi} से जोड़ता है। जन्म चंद्र से तारा: ${tara.hi}।`,
    vocationEn: ext.vocEn,
    vocationHi: ext.vocHi,
    source: 'Brihat Samhita · Taittiriya Brahmana · KP Nakshatra Nadi',
  };
}

export function computePlanetInNakshatraPredictions(
  chart: ChartData
): PlanetInNakshatraPrediction[] {
  const moonNakIdx = chart.panchang.nakshatra.index;
  const planetMap = new Map(chart.planets.map((p) => [p.id, p]));
  const items = [chart.ascendant, ...NINE_GRAHAS.map((g) => planetMap.get(g)!)];
  return items.map((b) => buildOne(b, moonNakIdx));
}

export function inspectHypotheticalNakshatra(
  planet: PredictionBodyId,
  nakIndex: number,
  pada: number
): {
  nakNameEn: string;
  nakNameHi: string;
  lord: string;
  deityEn: string;
  deityHi: string;
  readingEn: string;
  readingHi: string;
  vocationEn: string;
  vocationHi: string;
  padaEn: string;
  padaHi: string;
} {
  const idx = ((nakIndex % 27) + 27) % 27;
  const p = Math.max(1, Math.min(4, pada));
  const nakInfo = NAKSHATRAS[idx];
  const ext = NAK_EXT[idx];
  const role = BODY_ROLE[planet] ?? BODY_ROLE.Sun;
  const pNu = PADA_NUANCE[p - 1];
  return {
    nakNameEn: nakInfo.name,
    nakNameHi: NAK_HI[idx],
    lord: nakInfo.lord,
    deityEn: nakInfo.deity,
    deityHi: ext.deityHi,
    readingEn: `${planet === 'Asc' ? 'Ascendant' : planet} in ${nakInfo.name} Pada ${p} (${nakInfo.deity}, Lord ${nakInfo.lord}) empowers ${role.en.toLowerCase()} through ${ext.natureEn}.`,
    readingHi: `${NAK_HI[idx]} नक्षत्र के चरण ${p} (${ext.deityHi}) में स्थित होने पर ${role.hi} में ${ext.natureHi} के गुण विकसित होते हैं।`,
    vocationEn: ext.vocEn,
    vocationHi: ext.vocHi,
    padaEn: pNu.en,
    padaHi: pNu.hi,
  };
}
