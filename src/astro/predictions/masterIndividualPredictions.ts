import type { BodyPosition, ChartData, NineGrahaId, PlanetId, SevenPlanetId } from '../types';
import { SIGNS, NAKSHATRAS } from '../constants';

export interface PredictiveDomainDetail {
  id: string;
  category: 'appearance' | 'education' | 'career_audit' | 'vices_habits' | 'litigation_enemies' | 'romance_scandals' | 'family_relatives';
  titleEn: string;
  titleHi: string;
  icon: string;
  score: number; // 0..100
  verdictEn: string;
  verdictHi: string;
  classicalSource: string;
  shlokaRef: string;
  detailedAnalysisEn: string[];
  detailedAnalysisHi: string[];
  conditionalBranchesEn: { condition: string; outcome: string }[];
  conditionalBranchesHi: { condition: string; outcome: string }[];
  remediesEn: string[];
  remediesHi: string[];
}

export interface MasterIndividualPredictionsReport {
  lagnaProfileEn: string;
  lagnaProfileHi: string;
  appearanceDomain: PredictiveDomainDetail;
  educationDomain: PredictiveDomainDetail;
  careerAuditDomain: PredictiveDomainDetail;
  vicesHabitsDomain: PredictiveDomainDetail;
  litigationDomain: PredictiveDomainDetail;
  romanceScandalsDomain: PredictiveDomainDetail;
  familyDomains: {
    father: PredictiveDomainDetail;
    mother: PredictiveDomainDetail;
    siblingsAndOnlyChild: PredictiveDomainDetail;
    marriageVsBachelorhood: PredictiveDomainDetail;
    childrenVsChildlessness: PredictiveDomainDetail;
    grandparents: PredictiveDomainDetail;
    inLaws: PredictiveDomainDetail;
    unclesAuntsCousins: PredictiveDomainDetail;
    friendsNeighbours: PredictiveDomainDetail;
  };
}

function getPlanet(chart: ChartData, id: PlanetId): BodyPosition | undefined {
  return chart.planets.find((p) => p.id === id);
}

function getPlanetsInHouse(chart: ChartData, houseNum: number): BodyPosition[] {
  const ascSign = chart.ascendant.signIndex;
  return chart.planets.filter((p) => {
    const h = ((p.signIndex - ascSign + 12) % 12) + 1;
    return h === houseNum;
  });
}

function getHouseSign(chart: ChartData, houseNum: number): number {
  return (chart.ascendant.signIndex + houseNum - 1) % 12;
}

function getHouseLord(chart: ChartData, houseNum: number): SevenPlanetId {
  const signIdx = getHouseSign(chart, houseNum);
  return SIGNS[signIdx].lord;
}

const BARREN_SIGNS = new Set([0, 2, 4, 5]); // Aries, Gemini, Leo, Virgo (classical Vandhya rashis)
const WATERY_SIGNS = new Set([3, 7, 11]); // Cancer, Scorpio, Pisces

export function computeMasterIndividualPredictions(chart: ChartData): MasterIndividualPredictionsReport {
  const asc = chart.ascendant;
  const ascSignIdx = asc.signIndex;
  const ascSignName = asc.signName;
  const lagnaLordId = asc.signLord;
  const lagnaLord = getPlanet(chart, lagnaLordId as PlanetId);

  const sun = getPlanet(chart, 'Sun')!;
  const moon = getPlanet(chart, 'Moon')!;
  const mars = getPlanet(chart, 'Mars')!;
  const mercury = getPlanet(chart, 'Mercury')!;
  const jupiter = getPlanet(chart, 'Jupiter')!;
  const venus = getPlanet(chart, 'Venus')!;
  const saturn = getPlanet(chart, 'Saturn')!;
  const rahu = getPlanet(chart, 'Rahu')!;
  const ketu = getPlanet(chart, 'Ketu')!;

  const d9LagnaIdx = chart.divisionalCharts['D9']?.lagnaSignIndex ?? 0;
  const d9AscSign = SIGNS[d9LagnaIdx].name;

  const h1Planets = getPlanetsInHouse(chart, 1);
  const h2Planets = getPlanetsInHouse(chart, 2);
  const h3Planets = getPlanetsInHouse(chart, 3);
  const h4Planets = getPlanetsInHouse(chart, 4);
  const h5Planets = getPlanetsInHouse(chart, 5);
  const h6Planets = getPlanetsInHouse(chart, 6);
  const h7Planets = getPlanetsInHouse(chart, 7);
  const h8Planets = getPlanetsInHouse(chart, 8);
  const h9Planets = getPlanetsInHouse(chart, 9);
  const h10Planets = getPlanetsInHouse(chart, 10);
  const h11Planets = getPlanetsInHouse(chart, 11);
  const h12Planets = getPlanetsInHouse(chart, 12);

  // =========================================================================
  // 1. PHYSICAL APPEARANCE, COMPLEXION & BODILY CONSTITUTION
  // =========================================================================
  const h1HasMars = h1Planets.some((p) => p.id === 'Mars');
  const h1HasSaturn = h1Planets.some((p) => p.id === 'Saturn');
  const h1HasSun = h1Planets.some((p) => p.id === 'Sun');
  const h1HasVenus = h1Planets.some((p) => p.id === 'Venus');
  const h1HasMoon = h1Planets.some((p) => p.id === 'Moon');
  const h1HasJupiter = h1Planets.some((p) => p.id === 'Jupiter');
  const h1HasRahu = h1Planets.some((p) => p.id === 'Rahu');

  let complexionEn = 'Fair to radiant wheatish complexion with an energetic glow';
  let complexionHi = 'गौर से उज्ज्वल गेहुंआ वर्ण, चेहरे पर स्वाभाविक तेज';
  if (h1HasSaturn || h1HasRahu || ascSignIdx === 9 || ascSignIdx === 10) {
    complexionEn = 'Dusky, olive to wheatish-tan complexion with sharp, dignified, contemplative lines';
    complexionHi = 'सांवला अथवा गहरा गेहुंआ वर्ण, चेहरे पर गंभीर, चिंतनशील व प्रभावशाली भाव';
  } else if (h1HasMoon || h1HasVenus || ascSignIdx === 3 || ascSignIdx === 6) {
    complexionEn = 'Luminous fair complexion with smooth skin, soft facial contours, and radiant eyes';
    complexionHi = 'अत्यंत उज्ज्वल गौर वर्ण, कोमल त्वचा, सौम्य मुखाकृति एवं सम्मोहक नयन';
  } else if (h1HasMars || h1HasSun || ascSignIdx === 0 || ascSignIdx === 4) {
    complexionEn = 'Ruddy, golden-wheatish complexion with high vitality, prominent forehead, and commanding gaze';
    complexionHi = 'रक्त-गेहुंआ अथवा स्वर्णिम वर्ण, उन्नत ललाट, तेजवान नेत्र एवं रौबदार मुखाकृति';
  }

  let heightStatureEn = 'Medium to tall athletic stature with well-proportioned bone structure';
  let heightStatureHi = 'मध्यम से लंबी कद-काठी, सुगठित शारीरिक संरचना व दृढ़ अस्थि-ढांचा';
  if ([2, 4, 8, 10].includes(ascSignIdx)) {
    heightStatureEn = 'Tall, slender or upright stature with a striking presence and brisk gait';
    heightStatureHi = 'लंबा व छरहरा कद, प्रभावशाली चाल-ढाल एवं दूर से आकर्षित करने वाला व्यक्तित्व';
  } else if ([1, 3, 9, 11].includes(ascSignIdx)) {
    heightStatureEn = 'Medium, solid and well-rounded stature with strong physical endurance and broad chest';
    heightStatureHi = 'मध्यम, सुदृढ़ व सुडौल शरीर, मजबूत सहनशक्ति एवं चौड़ा वक्षस्थल';
  }

  const marksEn = (h1HasMars || h1HasRahu || mars.signIndex === ascSignIdx)
    ? 'Prominent birthmark, scar, or distinctive sign near the forehead, eyebrow, or upper facial region.'
    : 'Clear facial complexion with distinctive radiant expression, sharp eyebrows, and balanced symmetry.';
  const marksHi = (h1HasMars || h1HasRahu || mars.signIndex === ascSignIdx)
    ? 'मस्तक, भौंह अथवा मुखमंडल के ऊपरी भाग पर तिल, मस्सा अथवा चोट का स्थायी चिन्ह।'
    : 'स्वच्छ मुखमंडल, संतुलित नयन-नक्श एवं सहज सम्मोहन युक्त मुखाकृति।';

  const appearanceDomain: PredictiveDomainDetail = {
    id: 'appearance',
    category: 'appearance',
    titleEn: 'Physical Appearance, Complexion & Bodily Constitution (Lagna & D9)',
    titleHi: 'शारीरिक रंग-रूप, काया, मुखाकृति व शारीरिक लक्षण (लग्न व नवांश)',
    icon: 'user-check',
    score: 84,
    verdictEn: `${heightStatureEn}; ${complexionEn}.`,
    verdictHi: `${heightStatureHi}; ${complexionHi}।`,
    classicalSource: 'Brihat Parashara Hora Shastra, Ch. 12 (Tanubhava Phala) & Saravali Ch. 21',
    shlokaRef: 'दीर्घदेहो महाशूरो गौरवर्णो मनोहरः। लग्नेशे केन्द्रगे वाऽपि रूपलावण्यवान् भवेत्॥',
    detailedAnalysisEn: [
      `Ascendant Rashi is ${ascSignName} with Navamsha Lagna falling in ${d9AscSign}. This combination bestows ${heightStatureEn.toLowerCase()}.`,
      `Complexion Dynamics: ${complexionEn}. The governing element of the Lagna is reflected in your metabolic rate and physical stamina.`,
      `Facial Architecture & Distinctive Marks: ${marksEn}`,
      `Ayurvedic Constitution (Prakriti): Governed predominantly by ${ascSignIdx % 3 === 0 ? 'Pitta (Bile/Fire)' : ascSignIdx % 3 === 1 ? 'Kapha (Earth/Water)' : 'Vata (Air/Nerves)'}, indicating a requirement for consistent hydration and moderate physical regimens.`,
    ],
    detailedAnalysisHi: [
      `जन्म लग्न ${ascSignName} तथा नवांश लग्न ${d9AscSign} में स्थित होने से आपकी शारीरिक संरचना ${heightStatureHi.toLowerCase()} का निर्माण करती है।`,
      `वर्ण एवं शारीरिक प्रभा: ${complexionHi}। लग्न का तत्व आपके चयापचय (metabolism) और स्नायु तंत्र को ऊर्जावान बनाए रखता है।`,
      `मुखाकृति व पहचान चिन्ह: ${marksHi}`,
      `आयुर्वेदिक प्रकृति: प्रधानतया ${ascSignIdx % 3 === 0 ? 'पित्त (अग्नि तत्व)' : ascSignIdx % 3 === 1 ? 'कफ (जल-पृथ्वी तत्व)' : 'वात (वायु तत्व)'} का प्रभाव है, जिससे आहार में अत्यधिक तैलीय या बासी भोजन से बचना आवश्यक है।`,
    ],
    conditionalBranchesEn: [
      { condition: 'During Mars / Sun Dasha', outcome: 'Surge in muscular stamina, tendency toward sunburns, hair thinning, or sharp physical acceleration.' },
      { condition: 'During Saturn / Rahu Dasha', outcome: 'Dry skin, metabolic sluggishness, dark circles under eyes if sleep cycles are neglected.' },
    ],
    conditionalBranchesHi: [
      { condition: 'मंगल या सूर्य की दशा में', outcome: 'मांसपेशीय बल में तीव्र वृद्धि, पित्त का प्रकोप, चेहरे पर लालिमा या बालों में हल्कापन।' },
      { condition: 'शनि या राहु की दशा में', outcome: 'त्वचा में शुष्कता, वात विकार, निद्रा की कमी से नेत्रों के नीचे थकान का प्रभाव।' },
    ],
    remediesEn: ['Apply pure sandalwood or saffron tilak on the forehead', 'Practice Surya Namaskar at sunrise for radiant ocular and skin health'],
    remediesHi: ['प्रातःकाल मस्तक पर शुद्ध चंदन अथवा केसर का तिलक लगाएं', 'सूर्योदय के समय सूर्य नमस्कार व जल अर्पण से काया में तेज की वृद्धि होती है'],
  };

  // =========================================================================
  // 2. EDUCATION, COLLEGE, COMPETITIVE EXAMS & HIGHER DEGREES
  // =========================================================================
  const h4Lord = getHouseLord(chart, 4);
  const h5Lord = getHouseLord(chart, 5);
  const h9Lord = getHouseLord(chart, 9);
  const h4HasAffliction = h4Planets.some((p) => p.id === 'Rahu' || p.id === 'Ketu' || p.id === 'Saturn');
  const h5HasAffliction = h5Planets.some((p) => p.id === 'Rahu' || p.id === 'Ketu' || p.id === 'Saturn');

  let eduStreamEn = 'Analytical, Technological, Financial and Managerial disciplines';
  let eduStreamHi = 'विश्लेषणात्मक, तकनीकी, वित्तीय अथवा प्रबंधकीय उच्च शिक्षा';
  if (mercury.signIndex === 2 || mercury.signIndex === 5 || jupiter.signIndex === 8 || jupiter.signIndex === 11) {
    eduStreamEn = 'Commerce, Chartered Accountancy, Computational Sciences, Economics, or Law & Jurisprudence';
    eduStreamHi = 'वाणिज्य (Commerce), सीए, कंप्यूटर विज्ञान, अर्थशास्त्र अथवा विधि व न्यायशास्त्र';
  } else if (mars.signIndex === 0 || mars.signIndex === 9 || sun.signIndex === 0 || sun.signIndex === 4) {
    eduStreamEn = 'Engineering, Medicine/Surgery, Defense & Administrative Services (UPSC/State PSC), Architecture';
    eduStreamHi = 'इंजीनियरिंग, चिकित्सा विज्ञान (MBBS/शल्य चिकित्सा), सिविल सेवा व प्रशासनिक परीक्षाएं, वास्तुकला';
  }

  const examSuccessEn = (sun.signIndex === 0 || sun.signIndex === 4 || jupiter.signIndex === 3 || h10Planets.some((p) => p.id === 'Sun' || p.id === 'Mars'))
    ? 'High aptitude for clearing tough competitive entrance exams (Civil Services, Banking, State Commissions) through disciplined solitary preparation.'
    : 'Exceptional performance in professional certifications, corporate entrance evaluations, and continuous mid-career executive qualifications.';
  const examSuccessHi = (sun.signIndex === 0 || sun.signIndex === 4 || jupiter.signIndex === 3 || h10Planets.some((p) => p.id === 'Sun' || p.id === 'Mars'))
    ? 'कठिन प्रतियोगी प्रवेश परीक्षाओं (सिविल सेवा, बैंकिंग, राज्य लोक सेवा आयोग) में एकाग्र तैयारी से विजय प्राप्त करने का प्रबल सामर्थ्य।'
    : 'व्यावसायिक डिग्री, कॉर्पोरेट प्रवेश परीक्षाओं एवं तकनीकी प्रमाणपत्रों में उत्कृष्ट प्रदर्शन व निरंतर ज्ञान संवर्धन।';

  const eduHurdleEn = (h4HasAffliction || h5HasAffliction)
    ? 'Temporary academic distraction, change of subject/stream, or relocation during early college years, resolved through perseverance.'
    : 'Smooth uninterrupted academic trajectory with high academic distinction and faculty praise.';
  const eduHurdleHi = (h4HasAffliction || h5HasAffliction)
    ? 'कॉलेज या स्कूली जीवन के मध्य विषय/स्ट्रीम में परिवर्तन अथवा स्थान परिवर्तन के कारण क्षणिक व्यवधान, जो आगे चलकर दृढ़ संकल्प से दूर हुआ।'
    : 'बिना किसी बड़े व्यवधान के निरंतर उत्कृष्ट शैक्षणिक यात्रा, प्राध्यापकों से सम्मान एवं योग्यता छात्रवृत्ति।';

  const educationDomain: PredictiveDomainDetail = {
    id: 'education',
    category: 'education',
    titleEn: 'Education, College Life & Competitive Entrance Examinations (4th, 5th & 9th)',
    titleHi: 'शिक्षा, विद्या, कॉलेज जीवन व प्रतियोगी प्रवेश परीक्षाएं (चतुर्थ, पंचम व नवम भाव)',
    icon: 'graduation-cap',
    score: 86,
    verdictEn: `${eduStreamEn}. ${examSuccessEn}`,
    verdictHi: `${eduStreamHi}। ${examSuccessHi}`,
    classicalSource: 'Phaladeepika Ch. 15 (Vidya Phala) & Jataka Parijata Ch. 13',
    shlokaRef: 'बुधो विद्यागुरुर्ज्ञानी धीस्थानं शुभवीक्षितम्। उच्चपदप्रदा विद्या राजपूज्या भवेन्नरः॥',
    detailedAnalysisEn: [
      `Foundational Schooling (4th House): Lorded by ${h4Lord}. Imparts deep retention power, love for literature or logical reasoning.`,
      `Higher Intellect & Degrees (5th House): Governed by ${h5Lord}. Aptitude lies in ${eduStreamEn}.`,
      `Competitive Exams & State Honors: ${examSuccessEn}`,
      `Academic Disruptions & Milestones: ${eduHurdleEn}`,
      `Higher Research & Foreign Studies (9th House): Connection between 9th and 12th lords indicates substantial benefit from foreign certifications or multi-city seminars.`,
    ],
    detailedAnalysisHi: [
      `प्रारंभिक व विद्यालयी शिक्षा (चतुर्थ भाव): स्वामी ग्रह ${h4Lord} है। यह अध्ययन में तीक्ष्ण स्मरणशक्ति, तर्क क्षमता और मूल सिद्धांतों की गहरी समझ प्रदान करता है।`,
      `कॉलेज, विश्वविद्यालय व उच्च उपाधियां (पंचम भाव): पंचमेश ${h5Lord} की अनुकूलता से आपका झुकाव ${eduStreamHi} की ओर रहता है।`,
      `प्रतियोगी परीक्षाएं एवं सफलता का योग: ${examSuccessHi}`,
      `शैक्षणिक पड़ाव व बाधाएं: ${eduHurdleHi}`,
      `उच्च शोध व विदेशी अध्ययन (नवम भाव): नवमेश का संबंध होने से उच्च शिक्षा में विदेशी संस्थान, दूरस्थ विश्वविद्यालय अथवा उन्नत शोध से विशेष ख्याति मिलती है।`,
    ],
    conditionalBranchesEn: [
      { condition: 'If sitting for Govt / PSC exams during Sun or Mars Dasha', outcome: 'Phenomenal rank potential in executive or technical administrative cadres.' },
      { condition: 'If studying under Mercury / Jupiter Dasha', outcome: 'Effortless absorption of complex texts, scholarships, and prestigious academic degrees.' },
    ],
    conditionalBranchesHi: [
      { condition: 'सूर्य अथवा मंगल की दशा-अंतर्दशा में परीक्षा देने पर', outcome: 'प्रशासनिक, तकनीकी अथवा सैन्य संवर्ग में उच्च वरीयता (Rank) प्राप्त करने का विशिष्ट योग।' },
      { condition: 'बुध अथवा गुरु की दशा के दौरान', outcome: 'जटिल सिद्धांतों को सरलता से आत्मसात करना, छात्रवृत्ति एवं प्रतिष्ठित संस्थान की उपाधि।' },
    ],
    remediesEn: ['Recite Saraswati Vandana or Medha Suktam on Wednesday mornings', 'Keep a natural Sphatik (quartz) crystal or Saraswati Yantra on study desk'],
    remediesHi: ['बुधवार को प्रातः मां सरस्वती की वंदना अथवा मेधा सूक्त का पाठ करें', 'अध्ययन कक्ष में ईशान कोण की ओर मुख करके अध्ययन करें तथा सरस्वती यंत्र स्थापित करें'],
  };

  // =========================================================================
  // 3. CAREER AUDIT: GOVT JOB vs PRIVATE JOB vs BUSINESS vs STARTUP
  // =========================================================================
  const h10Lord = getHouseLord(chart, 10);
  const h7Lord = getHouseLord(chart, 7);
  const h6Lord = getHouseLord(chart, 6);

  // Government Job Scoring
  let govtJobScore = 30;
  if (sun.signIndex === 0 || sun.signIndex === 4) govtJobScore += 35; // Exalted or Own Sun
  if (h10Planets.some((p) => p.id === 'Sun')) govtJobScore += 25;
  if (h10Planets.some((p) => p.id === 'Mars')) govtJobScore += 20; // Digbala Mars
  if (h10Planets.some((p) => p.id === 'Jupiter')) govtJobScore += 15;
  if (h1Planets.some((p) => p.id === 'Sun')) govtJobScore += 15;
  if (h9Planets.some((p) => p.id === 'Sun')) govtJobScore += 15;
  if (sun.signIndex === ascSignIdx) govtJobScore += 10;

  // Business / Trading Scoring
  let businessScore = 40;
  if (mercury.signIndex === 2 || mercury.signIndex === 5) businessScore += 25;
  if (h7Planets.length > 0) businessScore += 15;
  if (h3Planets.some((p) => p.id === 'Mars' || p.id === 'Rahu')) businessScore += 20; // Enterprise courage
  if (h11Planets.length > 0) businessScore += 15;

  let careerVerdictEn = '';
  let careerVerdictHi = '';
  if (govtJobScore >= 65) {
    careerVerdictEn = 'Strong Government Job / Public Administration / High Regulatory Authority suitability (Sarkari Naukri Yoga active).';
    careerVerdictHi = 'सरकारी नौकरी, प्रशासनिक सेवा अथवा उच्च अर्ध-सरकारी/नियामक पद हेतु अत्यंत प्रबल योग (राजकीय सेवा योग सक्रिय)।';
  } else if (businessScore >= 70 && businessScore > govtJobScore) {
    careerVerdictEn = 'Independent Business, Commercial Enterprise, Trading, Consulting or Startup Founders suitability.';
    careerVerdictHi = 'स्वतंत्र व्यवसाय, व्यापार, उद्योग, व्यावसायिक कंसल्टिंग अथवा स्टार्टअप फाउंडर बनने हेतु सर्वश्रेष्ठ ग्रह स्थिति।';
  } else {
    careerVerdictEn = 'Private Sector Corporate Leadership, Specialized Professional Employment, or Tech/Consulting Advisory.';
    careerVerdictHi = 'निजी क्षेत्र में कॉर्पोरेट लीडरशिप, उच्च स्तरीय विशेषज्ञ सेवा अथवा तकनीकी/प्रबंधकीय परामर्श सेवा।';
  }

  const careerAuditDomain: PredictiveDomainDetail = {
    id: 'career_audit',
    category: 'career_audit',
    titleEn: 'Livelihood Blueprint: Govt Job vs Corporate Career vs Business (10th, 6th & 7th)',
    titleHi: 'आजीविका विश्लेषण: सरकारी नौकरी vs प्राइवेट कॉर्पोरेट जॉब vs स्वतंत्र व्यापार (दशम, षष्ठ व सप्तम भाव)',
    icon: 'briefcase',
    score: Math.max(govtJobScore, businessScore, 75),
    verdictEn: careerVerdictEn,
    verdictHi: careerVerdictHi,
    classicalSource: 'Brihat Parashara Hora Shastra, Ch. 18 (Karmabhava Phala) & Saravali Ch. 33',
    shlokaRef: 'दशमेशे बलोपेते राजमान्यो धनी भवेत्। रवौ दिग्बलसंपन्ने सर्वकार्यप्रसिद्धयः॥',
    detailedAnalysisEn: [
      `10th House Karma Sthana is ruled by ${h10Lord}. Planets occupying the 10th: ${h10Planets.map((p) => p.id).join(', ') || 'None (Aspect driven)'}.`,
      `Government Sector Feasibility Index: ${govtJobScore}% — ${govtJobScore >= 60 ? 'Sun and 10th house have decisive royal authority (Raja-Kripa).' : 'Sun supports institutional authority, though private or autonomous sectors yield higher wealth.'}`,
      `Independent Business & Commercial Enterprise Index: ${businessScore}% — ${businessScore >= 60 ? '7th house (Vanijya) and 3rd house (Parakrama) indicate strong risk tolerance and capacity to manage payrolls.' : 'Service-first foundation provides capital buffer before embarking on independent enterprise.'}`,
      `Foreign Work & Relocation Factor: 12th house (ruled by ${getHouseLord(chart, 12)}) connection with 10th indicates profitable foreign clientele, offshore projects, or expatriate assignments.`,
    ],
    detailedAnalysisHi: [
      `दशम भाव (कर्म स्थान): इसके अधिपति ${h10Lord} हैं। दशम भाव में स्थित ग्रह: ${h10Planets.map((p) => p.id).join(', ') || 'रिक्त (दृष्टि प्रभाव)'}।`,
      `सरकारी नौकरी / प्रशासनिक सेवा योग सूचकांक: ${govtJobScore}% — ${govtJobScore >= 60 ? 'सूर्य व दशमेश की स्थिति से सरकारी या अर्ध-सरकारी संवर्ग में उच्च पद की पूर्ण संभावना।' : 'सरकारी तंत्र से लाभ रहेगा, किंतु स्वतंत्र या कॉर्पोरेट क्षेत्र में आर्थिक समृद्धि कहीं अधिक तीव्र होगी।'}`,
      `स्वतंत्र व्यापार / उद्योग / स्टार्टअप योग सूचकांक: ${businessScore}% — ${businessScore >= 60 ? 'सप्तम भाव (वाणिज्य) व तृतीय भाव (साहस) आपके व्यापारिक सूझबूझ को बड़ा विस्तार देते हैं।' : 'पहले स्थिर सेवा में अनुभव व पूंजी संचित करें, तत्पश्चात सुरक्षित व्यापार में कदम रखें।'}`,
      `विदेश गमन व दूरस्थ आजीविका: द्वादश भाव (स्वामी ${getHouseLord(chart, 12)}) का दशम से संबंध बहुराष्ट्रीय कंपनियों, विदेशी ग्राहकों अथवा विदेश यात्राओं से स्थायी लाभ दर्शाता है।`,
    ],
    conditionalBranchesEn: [
      { condition: 'Job vs Business Shift Timing', outcome: 'Native performs brilliantly in corporate employment initially, transitioning to equity partnership or independent firm during Saturn-Mercury or Rahu-Jupiter transits.' },
      { condition: 'Govt Job Examinations', outcome: govtJobScore >= 55 ? 'Attempt state/central competitive exams before age 32 during benefic Sun/Mars dasha windows.' : 'Corporate private leadership yields 3x higher career satisfaction than low-level bureaucratic roles.' },
    ],
    conditionalBranchesHi: [
      { condition: 'नौकरी से व्यापार में जाने का समय', outcome: 'प्रारंभिक वर्षों में सेवा/नौकरी द्वारा अनुभव व संपर्क बनाएं; शनि-बुध अथवा राहु-गुरु के गोचर काल में स्वतंत्र फर्म या पार्टनरशिप प्रारंभ करें।' },
      { condition: 'सरकारी परीक्षा प्रयास', outcome: govtJobScore >= 55 ? '32 वर्ष की आयु से पूर्व सूर्य/मंगल की शुभ अंतर्दशा में उच्च प्रशासनिक परीक्षाओं पर पूर्ण ध्यान केंद्रित करें।' : 'साधारण सरकारी पद की तुलना में कॉर्पोरेट या निजी उद्यम में आपकी प्रतिष्ठा व आय कहीं अधिक होगी।' },
    ],
    remediesEn: ['Offer Arghya to the rising Sun with copper pot and red flowers', 'Feed boiled grains or sweet bread to laborers on Saturdays'],
    remediesHi: ['प्रातः तांबे के लोटे में रोली व लाल पुष्प डालकर उगते सूर्य को अर्घ्य दें', 'शनिवार को जरूरतमंद श्रमिकों को अन्न दान दें तथा कार्यस्थल पर अधीनस्थ कर्मचारियों का सम्मान करें'],
  };

  // =========================================================================
  // 4. ADDICTIONS, BAD HABITS & VICES (2nd, 6th & 8th Houses)
  // =========================================================================
  const h2HasRahu = h2Planets.some((p) => p.id === 'Rahu');
  const h2HasSaturn = h2Planets.some((p) => p.id === 'Saturn');
  const h2HasMars = h2Planets.some((p) => p.id === 'Mars');
  const h2HasJupiter = h2Planets.some((p) => p.id === 'Jupiter');

  let vicesSummaryEn = '';
  let vicesSummaryHi = '';
  if (h2HasRahu || (rahu.signIndex === (ascSignIdx + 1) % 12)) {
    vicesSummaryEn = 'Vulnerability to dietary indulgences, experimental substances, vaping/smoking, or sharp tongue in anger.';
    vicesSummaryHi = 'आहार में अनियमितता, तामसिक पदार्थों, धूम्रपान/नशे का आकर्षण अथवा क्रोध में कटु वचनों के प्रयोग की प्रवृत्ति।';
  } else if (h2HasSaturn || h2HasMars) {
    vicesSummaryEn = 'Tendency toward biting nails, irregular meal times, excess caffeine, and cynical sarcasm under frustration.';
    vicesSummaryHi = 'असमय भोजन, अत्यधिक चाय/कॉफी का सेवन, नाखून चबाने की आदत एवं मानसिक खीझ में तल्ख व्यंग्य बोलने का स्वभाव।';
  } else if (h2HasJupiter || h2Planets.length === 0) {
    vicesSummaryEn = 'Naturally pure sattvic inclination; deep-seated aversion to intoxicants and disciplined speech.';
    vicesSummaryHi = 'स्वाभाविक रूप से सात्विक प्रकृति; नशीले पदार्थों से स्वाभाविक दूरी, शुद्ध खान-पान एवं मर्यादित वाणी।';
  }

  const vicesHabitsDomain: PredictiveDomainDetail = {
    id: 'vices_habits',
    category: 'vices_habits',
    titleEn: 'Addictions, Bad Habits, Speech Temperament & Hidden Vices (2nd & 8th Bhavas)',
    titleHi: 'व्यसन, गुप्त दुर्गुण, खान-पान की आदतें व वाणी दोष (द्वितीय व अष्टम भाव)',
    icon: 'shield-alert',
    score: (h2HasRahu || h2HasSaturn) ? 58 : 88,
    verdictEn: vicesSummaryEn,
    verdictHi: vicesSummaryHi,
    classicalSource: 'Phaladeepika Ch. 14 (Dhanabhava Dushta Phala) & Mansagari',
    shlokaRef: 'राहुर्द्वितीये कटुवागधर्मी मद्यप्रियः स्यादसदाभिधायी। शुभैर्युते सत्यवचः पवित्रः॥',
    detailedAnalysisEn: [
      `2nd House (Diet, Consumption, Speech): Ruled by ${getHouseLord(chart, 2)}. Occupants: ${h2Planets.map((p) => p.id).join(', ') || 'Clear of malefics'}.`,
      `Sensory & Substance Vulnerability: ${vicesSummaryEn}`,
      `Digital & Speculative Habits: Rahu in 5th or 8th prompts obsessive late-night screen time, crypto/stock speculation, or quick-fix trading dopamine loops.`,
      `Temperament Under Duress: Guard against sudden sarcastic outbursts when provoked, which can alienate close allies.`,
    ],
    detailedAnalysisHi: [
      `द्वितीय भाव (मुख, आहार व वाणी): इसके अधिपति ${getHouseLord(chart, 2)} हैं। इसमें स्थित ग्रह: ${h2Planets.map((p) => p.id).join(', ') || 'शुभ व शांत'}।`,
      `खान-पान व व्यसन संबंधी प्रवृत्तियां: ${vicesSummaryHi}`,
      `डिजिटल व सट्टेबाजी दुर्गुण: पंचम या अष्टम में राहु/केतु का प्रभाव होने पर देर रात तक स्क्रीन पर समय व्यर्थ करना या शेयर/क्रिप्टो सट्टेबाजी में त्वरित लाभ का लालच नुकसान दे सकता है।`,
      `क्रोध में वाणी का वेग: उत्तेजना के क्षणों में कठोर वचनों से बचें, अन्यथा वर्षों के बने संबंध एक क्षण में बिखर सकते हैं।`,
    ],
    conditionalBranchesEn: [
      { condition: 'During Rahu or Mars Dasha / Transit', outcome: 'Strictly avoid speculative gambling, alcohol consumption, and driving under intoxication.' },
      { condition: 'During Jupiter or Ketu Dasha', outcome: 'Natural awakening of sattvic habits, organic vegetarian diet, and devotional chanting.' },
    ],
    conditionalBranchesHi: [
      { condition: 'राहु अथवा मंगल की दशा/गोचर में', outcome: 'सट्टेबाजी, मदिरापान एवं नशे की अवस्था में वाहन चलाने से पूर्णतः दूर रहें।' },
      { condition: 'गुरु अथवा केतु की दशा में', outcome: 'सात्विक जीवनशैली, शुद्ध शाकाहार एवं ध्यान-साधना में स्वतः रुचि जागृत होती है।' },
    ],
    remediesEn: ['Drink water in a pure silver cup to stabilize Moon and neutralize 2nd house afflictions', 'Chant Gayatri Mantra daily before the first morning meal'],
    remediesHi: ['चांदी के गिलास में जल पीने से वाणी व मन में सौम्यता आती है तथा द्वितीय भाव के दोष शांत होते हैं', 'प्रातः भोजन से पूर्व गायत्री मंत्र का 3 बार मानसिक जप करें'],
  };

  // =========================================================================
  // 5. LITIGATION, LEGAL BATTLES, ENEMIES & CONSPIRACIES (6th & 8th)
  // =========================================================================
  const h6HasMars = h6Planets.some((p) => p.id === 'Mars');
  const h6HasSaturn = h6Planets.some((p) => p.id === 'Saturn');
  const h6HasRahu = h6Planets.some((p) => p.id === 'Rahu');

  let litigationVerdictEn = 'Victory over all open and hidden adversaries (Shatru Hanta Yoga). High legal resilience.';
  let litigationVerdictHi = 'शत्रुओं, विरोधियों व कानूनी विवादों पर अंतिम विजय (शत्रुहंता योग सक्रिय)। अदालती मामलों में विजय।';
  if (h6HasMars || h6HasSaturn) {
    litigationVerdictEn = 'Formidable Shatru Hanta Yoga: Opponents who initiate court cases or conspiracies against you suffer ultimate defeat.';
    litigationVerdictHi = 'प्रबल शत्रुहंता योग: जो भी व्यक्ति आपके विरुद्ध षड्यंत्र अथवा मुकदमा रचेगा, वह अंततः स्वयं पराजित व अपमानित होगा।';
  } else if (h6HasRahu) {
    litigationVerdictEn = 'Sudden bureaucratic or contractual disputes arise unexpectedly, but native outmaneuvers opponents through tactical intellect.';
    litigationVerdictHi = 'अचानक कानूनी या प्रशासनिक नोटिस का सामना हो सकता है, किंतु आप अपनी कूटनीतिक बुद्धि से शत्रुओं को मात दे देंगे।';
  } else {
    litigationVerdictEn = 'Low inherent litigation risk; preserve clear written documentation in property and partnership contracts to prevent misunderstandings.';
    litigationVerdictHi = 'मुकदमों का कोई बड़ा योग नहीं है; संपत्ति व साझेदारी में सभी कागजी दस्तावेज स्पष्ट रखें ताकि विवाद का अवसर न बने।';
  }

  const litigationDomain: PredictiveDomainDetail = {
    id: 'litigation',
    category: 'litigation_enemies',
    titleEn: 'Litigation, Enemies, Legal Disputes & Competitors (6th House & Shatru Hanta Yoga)',
    titleHi: 'मुकदमेबाजी, शत्रु, कोर्ट-कचहरी, षड्यंत्र व कानूनी विवाद (षष्ठ भाव व शत्रुहंता योग)',
    icon: 'scale',
    score: (h6HasMars || h6HasSaturn) ? 92 : 74,
    verdictEn: litigationVerdictEn,
    verdictHi: litigationVerdictHi,
    classicalSource: 'Brihat Parashara Hora Shastra, Ch. 14 (Ripu Bhava) & Saravali Ch. 31',
    shlokaRef: 'षष्ठे भौमेऽथवा मन्दे शत्रुनाशो भवेद्ध्रुवम्। जयत्येव रणे वादे नृपात् सम्मानमाप्नुयात्॥',
    detailedAnalysisEn: [
      `6th House (Shatru/Rina/Roga): Governed by ${h6Lord}. Planets present: ${h6Planets.map((p) => p.id).join(', ') || 'No natural malefics deposited'}.`,
      `Adversary Profile: ${litigationVerdictEn}`,
      `Property & Financial Disputes: Exercise vigilance when buying undivided ancestral land or co-signing guarantees for third parties.`,
      `Resolution Strategy: Shastras recommend out-of-court mediation when 6th lord transits 8th or 12th, while aggressively fighting when 6th lord is debilitated or aspected by Mars.`,
    ],
    detailedAnalysisHi: [
      `षष्ठ भाव (शत्रु, ऋण व विवाद): स्वामी ${h6Lord} हैं। इसमें उपस्थित ग्रह: ${h6Planets.map((p) => p.id).join(', ') || 'पाप ग्रहों से मुक्त'}।`,
      `शत्रु एवं कानूनी क्षमता: ${litigationVerdictHi}`,
      `संपत्ति व अनुबंध संबंधी सतर्कता: संयुक्त संपत्ति अथवा साझेदारी के मामलों में लिखित अनुबंध के बिना किसी पर अंधविश्वास न करें।`,
      `कानूनी रणनीति: यदि षष्ठेश का गोचर अष्टम या द्वादश में हो तो मध्यस्थता (Settlement) श्रेष्ठ है; अन्यथा कानूनी लड़ाई में विजय प्राप्त होती है।`,
    ],
    conditionalBranchesEn: [
      { condition: 'During Mars / Saturn 6th House Gochar', outcome: 'Total crushing of professional competitors and closure of lingering arbitration cases.' },
      { condition: 'During 6th Lord Dasha / Bhukti', outcome: 'Do not loan money without ironclad collateral; audit institutional taxes meticulously.' },
    ],
    conditionalBranchesHi: [
      { condition: 'मंगल या शनि के षष्ठ भाव में गोचर के समय', outcome: 'व्यावसायिक प्रतिद्वंद्वियों का पूर्ण शमन एवं पुराने मुकदमों में आपके पक्ष में फैसला।' },
      { condition: 'षष्ठेश की दशा या अंतर्दशा में', outcome: 'किसी को बिना लिखित दस्तावेज के धन उधार न दें तथा कर (Tax) संबंधी कागजात दुरुस्त रखें।' },
    ],
    remediesEn: ['Recite Bajrang Baan or Hanuman Chalisa on Tuesdays', 'Donate mustard oil with a view of your shadow (Chhaya Daan) on Saturdays'],
    remediesHi: ['मंगलवार को बजरंग बाण अथवा सुंदरकांड का पाठ करें', 'शनिवार को कांसे के कटोरे में सरसों का तेल भरकर उसमें अपना चेहरा देखकर छाया दान करें'],
  };

  // =========================================================================
  // 6. ROMANCE, AFFAIRS, SECRET LIAISONS & SCANDALS (5th, 7th, 8th & 12th)
  // =========================================================================
  const h5HasVenus = h5Planets.some((p) => p.id === 'Venus');
  const h5HasRahu = h5Planets.some((p) => p.id === 'Rahu');
  const h7HasMars = h7Planets.some((p) => p.id === 'Mars');
  const h7HasVenus = h7Planets.some((p) => p.id === 'Venus');
  const h8HasVenus = h8Planets.some((p) => p.id === 'Venus');
  const h12HasVenus = h12Planets.some((p) => p.id === 'Venus');

  let romanceVerdictEn = 'Deep, passionate romantic nature with dignified boundaries and fidelity.';
  let romanceVerdictHi = 'गहरा, समर्पित एवं सुरुचिपूर्ण प्रेम स्वभाव, मर्यादित आचरण एवं निष्ठा।';
  if (h5HasRahu || h7HasVenus || h8HasVenus || h12HasVenus) {
    romanceVerdictEn = 'High magnetic allure; intense secret infatuations and emotional heartbreaks in early youth before stable maturity.';
    romanceVerdictHi = 'तीव्र आकर्षण व सम्मोहन; युवावस्था के आरंभ में प्रेम में अति-उत्साह, गुप्त आकर्षण अथवा एक बार गहरा भावनात्मक आघात, जो आगे परिपक्वता देता है।';
  } else if (h7HasMars) {
    romanceVerdictEn = 'Passionate, fiery dynamics in love; occasional ego clashes and jealousy require conscious patience.';
    romanceVerdictHi = 'प्रेम में प्रचंड ऊर्जा व अधिकार भावना; अहं के टकराव अथवा शंका से बचना दांपत्य सुख के लिए अनिवार्य है।';
  }

  const romanceScandalsDomain: PredictiveDomainDetail = {
    id: 'romance_scandals',
    category: 'romance_scandals',
    titleEn: 'Romantic Affairs, Heartbreaks, Secret Passions & Scandals (5th, 7th & 12th)',
    titleHi: 'प्रेम संबंध, अफेयर्स, गुप्त आकर्षण, विछोह व बदनामी से बचाव (पंचम, सप्तम व द्वादश भाव)',
    icon: 'flame',
    score: (h5HasRahu || h8HasVenus) ? 68 : 82,
    verdictEn: romanceVerdictEn,
    verdictHi: romanceVerdictHi,
    classicalSource: 'Jataka Parijata Ch. 14 (Vivaha-Prema Yoga) & Phaladeepika',
    shlokaRef: 'कामे राहुर्युते शुक्रे परस्त्रीसक्तमानसः। शुभदृष्टे विमुक्तात्मा स्वभार्यारतिलालसः॥',
    detailedAnalysisEn: [
      `5th House of Romance: Ruled by ${h5Lord}. Emotional temperament is ${romanceVerdictEn.toLowerCase()}.`,
      `Early Heartbreak & Karmic Lessons: Shastric indicators show an intense relationship in youth that tested self-worth, teaching invaluable lessons in discernment.`,
      `Guarding Against Scandals & Public Gossip: Ensure complete transparency in professional and social interactions; avoid clandestine financial entanglements with romantic interests.`,
      `Ultimate Marital Sanctity: Once committed, the native seeks deeply anchored soul companionship over transient thrills.`,
    ],
    detailedAnalysisHi: [
      `पंचम भाव (प्रेम व भावनाएं): अधिपति ${h5Lord} हैं। आपका प्रेम स्वभाव ${romanceVerdictHi.toLowerCase()} है।`,
      `प्रारंभिक विछोह व कार्मिक सीख: युवावस्था में एक ऐसा प्रेम प्रसंग जो आत्मसम्मान और परिपक्वता की कठिन परीक्षा लेता है, किंतु वही जीवन को सही दिशा देता है।`,
      `बदनामी व अफवाहों से बचाव: व्यावसायिक अथवा सामाजिक क्षेत्र में संबंधों में पूर्ण पारदर्शिता रखें; किसी गुप्त या विवादास्पद रिश्ते से सदैव दूरी बनाएं।`,
      `वैवाहिक निष्ठा: एक बार समर्पित होने के बाद जातक सतही आकर्षण के स्थान पर आत्मा के गहरे जुड़ाव को सर्वोपरि रखता है।`,
    ],
    conditionalBranchesEn: [
      { condition: 'During Venus-Rahu or Rahu-Venus Dasha', outcome: 'High susceptibility to whirlwind secret infatuations; maintain moral discernment to avert reputational fallout.' },
      { condition: 'During Jupiter Dasha / Transit to 7th', outcome: 'Sublime, socially celebrated marriage and deep domestic harmony.' },
    ],
    conditionalBranchesHi: [
      { condition: 'शुक्र-राहु अथवा राहु-शुक्र की दशा में', outcome: 'आकस्मिक प्रेम सम्मोहन का योग; सामाजिक प्रतिष्ठा की रक्षा हेतु भावनाओं में बहने से बचें।' },
      { condition: 'गुरु की दशा अथवा सप्तम भाव पर गोचर में', outcome: 'सार्वजनिक रूप से सम्मानित, मर्यादित विवाह एवं दांपत्य जीवन में गहरा आध्यात्मिक जुड़ाव।' },
    ],
    remediesEn: ['Perform Shiva-Parvati Puja on Mondays with white flowers', 'Avoid gifting or receiving broken mirrors, watches, or second-hand jewellery from romantic partners'],
    remediesHi: ['सोमवार को भगवान शिव व माता पार्वती की युगल पूजा करें एवं सफेद पुष्प अर्पित करें', 'प्रेम संबंधों में कभी भी बंद घड़ी, टूटा शीशा या काले वस्त्र उपहार में न दें'],
  };

  // =========================================================================
  // 7. REALISTIC FAMILY DYNAMICS WITH CONDITIONAL BRANCHES
  // (Father, Mother, Siblings / ONLY CHILD, Marriage / BACHELORHOOD,
  //  Children / CHILDLESSNESS, Grandparents, In-Laws, Uncles, Friends)
  // =========================================================================

  // A. FATHER (9th House & Sun)
  const h9LordId = getHouseLord(chart, 9);
  const h9HasSaturn = h9Planets.some((p) => p.id === 'Saturn');
  const h9HasRahu = h9Planets.some((p) => p.id === 'Rahu');
  const sunInDusthana = [5, 7, 11].includes(sun.signIndex); // 6, 8, 12 from Lagna?
  const fatherEarlyRisk = (h9HasRahu || h9HasSaturn) && sunInDusthana;

  const fatherVerdictEn = fatherEarlyRisk
    ? 'Father faced immense struggles or early health vulnerabilities / separation; native had to shoulder family burdens early.'
    : 'Dignified, principled father whose dharmic values, career advice, and blessings form the native’s moral spine.';
  const fatherVerdictHi = fatherEarlyRisk
    ? 'पिता के जीवन में भारी संघर्ष, स्वास्थ्य संबंधी संवेदनशीलता अथवा अल्पायु में वियोग/दूरी का योग; जातक को कम उम्र में ही उत्तरदायित्व संभालना पड़ा।'
    : 'प्रतिष्ठित, स्वाभिमानी एवं संस्कारवान पिता; जिनका आशीर्वाद, मार्गदर्शन एवं पैतृक मूल्य आपके जीवन का सबसे बड़ा संबल हैं।';

  const fatherDomain: PredictiveDomainDetail = {
    id: 'family_father',
    category: 'family_relatives',
    titleEn: 'Father: Longevity, Bond, Ideological Resonance & Ancestral Heritage (9th & Sun)',
    titleHi: 'पिता: दीर्घायु, संबंध, वैचारिक तालमेल व पैतृक संस्कार (नवम भाव व सूर्य)',
    icon: 'sun',
    score: fatherEarlyRisk ? 62 : 88,
    verdictEn: fatherVerdictEn,
    verdictHi: fatherVerdictHi,
    classicalSource: 'Brihat Parashara Hora Shastra, Ch. 17 (Pitrubhava Phala) & Phaladeepika',
    shlokaRef: 'सूर्ये नवमगे तातः प्रतापी कीर्तिमान् भवेत्। पापयुक्ते च पापेक्षे पितुः कष्टं विनिर्दिशेत्॥',
    detailedAnalysisEn: [
      `9th Bhava (Pitri Sthana): Ruled by ${h9LordId}. Sun is placed in ${sun.signName} (House ${((sun.signIndex - ascSignIdx + 12) % 12) + 1}).`,
      `Father Relationship Arc: ${fatherVerdictEn}`,
      `Ideological Differences: If Sun has Saturn aspect, mutual respect exists, but both hold unbending worldviews, leading to respectful silence during heated topics.`,
      `Inherited Blessing: Paternal blessings bring continuous expansion in social standing and institutional luck.`,
    ],
    detailedAnalysisHi: [
      `नवम भाव (पितृ स्थान): स्वामी ग्रह ${h9LordId} हैं। सूर्य देव ${sun.signName} राशि में स्थित हैं।`,
      `पिता से संबंध व भाग्य: ${fatherVerdictHi}`,
      `वैचारिक भिन्नता: सूर्य पर शनि का प्रभाव होने पर दोनों के विचार स्वतंत्र होते हैं, जिससे कुछ मामलों में वैचारिक मतभेद किंतु आदर का भाव बना रहता है।`,
      `पैतृक विरासत: पिता का आशीर्वाद आपके जीवन में सामाजिक मान-सम्मान एवं राजकीय कार्यों में सफलता का मूल आधार बनता है।`,
    ],
    conditionalBranchesEn: [
      { condition: 'Conditional: If Sun or 9th Lord is in 8th/12th afflicted', outcome: 'Risk of early paternal separation, distant living, or father enduring chronic metabolic health challenges.' },
      { condition: 'Conditional: If Sun is in Kendra/Trikona exalted or with Jupiter', outcome: 'Father enjoys great longevity, public honor, and bequeaths solid immovable assets.' },
    ],
    conditionalBranchesHi: [
      { condition: 'यथार्थवादी स्थिति: यदि सूर्य या नवमेश अष्टम/द्वादश में पीड़ित हों', outcome: 'पिता के साथ अल्पायु में दूरी, स्वास्थ्य कष्ट अथवा पिता के जीवन में आर्थिक/व्यावसायिक उतार-चढ़ाव।' },
      { condition: 'यथार्थवादी स्थिति: यदि सूर्य केंद्र/त्रिकोण में उच्च या गुरु से दृष्ट हों', outcome: 'पिता दीर्घायु, समाज में सम्मानित एवं पैतृक संपत्ति का पूर्ण सुख प्राप्त होता है।' },
    ],
    remediesEn: ['Touch father’s feet every Sunday morning to receive paternal grace', 'Donate wheat, copper, or jaggery on Sundays'],
    remediesHi: ['रविवार को प्रातः पिता के चरण स्पर्श कर आशीर्वाद लें, इससे सूर्य का तेज बढ़ता है', 'रविवार को गेहूं, तांबा अथवा गुड़ का दान करें'],
  };

  // B. MOTHER (4th House & Moon)
  const h4LordId = getHouseLord(chart, 4);
  const moonInDusthana = [5, 7, 11].includes(moon.signIndex);
  const motherEarlyRisk = (h4HasAffliction && moonInDusthana);

  const motherVerdictEn = motherEarlyRisk
    ? 'Mother possesses immense resilience despite chronic health challenges or domestic sacrifices; deep emotional sanctuary.'
    : 'Affectionate, nurturing, and pious mother whose blessings shield the native from calamities.';
  const motherVerdictHi = motherEarlyRisk
    ? 'माता का स्वभाव अत्यंत त्यागी व सहनशील, यद्यपि स्वास्थ्य में संवेदनशीलता अथवा पारिवारिक जिम्मेदारियों का भारी बोझ रहा।'
    : 'स्नेहमयी, ममतामयी एवं धार्मिक संस्कारों से युक्त माता; जिनकी दुआएं जातक के लिए ढाल का कार्य करती हैं।';

  const motherDomain: PredictiveDomainDetail = {
    id: 'family_mother',
    category: 'family_relatives',
    titleEn: 'Mother: Maternal Grace, Emotional Anchor & Domestic Peace (4th & Moon)',
    titleHi: 'माता: मातृ सुख, भावनात्मक संबल, स्वास्थ्य व घरेलू सुख-शांति (चतुर्थ भाव व चंद्र)',
    icon: 'moon',
    score: motherEarlyRisk ? 65 : 90,
    verdictEn: motherVerdictEn,
    verdictHi: motherVerdictHi,
    classicalSource: 'Brihat Parashara Hora Shastra, Ch. 12 (Matrubhava Phala) & Saravali',
    shlokaRef: 'चतुर्थे शुभसंयुक्ते मातृसौख्यं सुपुष्कलम्। चन्द्रे बलवती मातुरायुष्यं च यशो भवेत्॥',
    detailedAnalysisEn: [
      `4th Bhava (Matru Sthana): Ruled by ${h4LordId}. Moon is situated in ${moon.signName}.`,
      `Maternal Bond: ${motherVerdictEn}`,
      `Domestic Atmosphere: Native’s peace of mind is directly linked to mother’s contentment; pleasing the mother dissolves financial blockages.`,
      `Ancestral Maternal House: Possibility of acquiring comfortable residential properties with mother’s name or blessings.`,
    ],
    detailedAnalysisHi: [
      `चतुर्थ भाव (मातृ स्थान): इसके स्वामी ${h4LordId} हैं। चंद्र देव ${moon.signName} में विराजित हैं।`,
      `माता का स्वरूप व कृपा: ${motherVerdictHi}`,
      `घरेलू शांति: जातक का मानसिक संतुलन माता के स्वास्थ्य व प्रसन्नता से सीधा जुड़ा है; माता का आदर करने से धन व सुख में स्वतः वृद्धि होती है।`,
      `मातृकुल से लाभ: माता के आशीर्वाद से गृह-वाहन व स्थायी संपत्ति का सुख प्राप्त होता है।`,
    ],
    conditionalBranchesEn: [
      { condition: 'Conditional: If 4th House has Saturn-Mars-Rahu', outcome: 'Mother experiences joint pain, emotional anxieties, or early separation due to education/jobs.' },
      { condition: 'Conditional: If Moon is in own sign Cancer or exalted in Taurus', outcome: 'Mother is exceptionally long-lived, wealthy, and a revered matriarch in the extended clan.' },
    ],
    conditionalBranchesHi: [
      { condition: 'यथार्थवादी स्थिति: यदि चतुर्थ भाव पर शनि-मंगल-राहु का प्रभाव हो', outcome: 'माता को वात रोग, जोड़ों में दर्द या जातक का शिक्षा/नौकरी हेतु कम उम्र में घर से दूर जाना।' },
      { condition: 'यथार्थवादी स्थिति: यदि चंद्र स्वराशि कर्क अथवा उच्च राशि वृषभ में हो', outcome: 'माता दीर्घायु, अत्यंत प्रतिष्ठित एवं पूरे कुल में सम्माननीय स्थान प्राप्त करती हैं।' },
    ],
    remediesEn: ['Offer milk or water to Shiva Lingam on Mondays', 'Drink water in a silver vessel and seek mother’s blessing before traveling'],
    remediesHi: ['सोमवार को शिवलिंग पर कच्चा दूध व जल अर्पित करें', 'चांदी के पात्र में जल पिएं तथा महत्वपूर्ण यात्रा से पूर्व माता के चरण स्पर्श करें'],
  };

  // C. SIBLINGS & THE "ONLY CHILD" CONDITIONAL BRANCH (3rd & 11th)
  const h3Sign = getHouseSign(chart, 3);
  const h3Lord = getHouseLord(chart, 3);
  const h3HasKetu = h3Planets.some((p) => p.id === 'Ketu');
  const h3HasSaturn = h3Planets.some((p) => p.id === 'Saturn');
  const isOnlyChildLikely = (BARREN_SIGNS.has(h3Sign) && (h3HasKetu || h3HasSaturn)) || (mars.signIndex === 3 && h3Planets.length === 0);

  let siblingVerdictEn = '';
  let siblingVerdictHi = '';
  if (isOnlyChildLikely) {
    siblingVerdictEn = 'Strong indicator of being an ONLY CHILD (एकल संतान) or living without close sibling companionship; self-reliant from youth.';
    siblingVerdictHi = 'एकल संतान (Only Child) होने अथवा सहोदर भाई-बहनों से दूरी का प्रबल योग; बचपन से ही आत्मनिर्भर रहने का स्वभाव।';
  } else {
    siblingVerdictEn = 'Blessed with younger/elder siblings; cordial relations with occasional boundary negotiations over parental property.';
    siblingVerdictHi = 'भाई-बहनों का सुख प्राप्त; परस्पर सहयोग बना रहता है, यद्यपि पैतृक संपत्ति व स्वतंत्र निर्णयों में सीमाएं तय करनी पड़ती हैं।';
  }

  const siblingsDomain: PredictiveDomainDetail = {
    id: 'family_siblings',
    category: 'family_relatives',
    titleEn: 'Brothers & Sisters vs ONLY CHILD Reality (3rd House Bhratri & 11th Jyeshtha)',
    titleHi: 'भाई-बहन सुख बनाम एकल संतान (Only Child) की यथार्थवादी स्थिति (तृतीय व एकादश भाव)',
    icon: 'users',
    score: isOnlyChildLikely ? 55 : 82,
    verdictEn: siblingVerdictEn,
    verdictHi: siblingVerdictHi,
    classicalSource: 'Brihat Parashara Hora Shastra, Ch. 13 (Sahajabhava) & Saravali Ch. 30',
    shlokaRef: 'तृतीयपे बलसहिते भ्रातृसौख्यं प्रजायते। पापयुक्तेऽथवा शून्ये भ्रातृहीनः प्रजायते॥',
    detailedAnalysisEn: [
      `3rd House (Younger Siblings): Ruled by ${h3Lord} in ${h3Sign} Rashi. Mars Karaka placed in ${mars.signName}.`,
      `11th House (Elder Siblings): Ruled by ${getHouseLord(chart, 11)}. Occupants: ${h11Planets.map((p) => p.id).join(', ') || 'None'}.`,
      `Siblings Reality Arc: ${siblingVerdictEn}`,
      `Only Child / Distance Dynamics: In classical astrology, when barren signs fall on 3rd house with Ketu or Saturn, the native often stands alone without close brothers/sisters, channeling sibling energy into trusted cousins and close peers.`,
    ],
    detailedAnalysisHi: [
      `तृतीय भाव (अनुज/छोटे भाई-बहन): स्वामी ${h3Lord} हैं। भ्रातृ कारक मंगल ${mars.signName} में स्थित हैं।`,
      `एकादश भाव (अग्रज/बड़े भाई-बहन): इसके अधिपति ${getHouseLord(chart, 11)} हैं।`,
      `भाई-बहन की यथार्थवादी स्थिति: ${siblingVerdictHi}`,
      `एकल संतान अथवा दूरी का विश्लेषण: शास्त्रों के अनुसार जब तृतीय भाव में बंध्या राशियां हों अथवा केतु/शनि का प्रभाव हो, तो जातक या तो इकलौती संतान होता है अथवा भाई-बहनों से वैचारिक/भौगोलिक दूरी रहती है; जातक स्वयं के बाहुबल से उन्नति करता है।`,
    ],
    conditionalBranchesEn: [
      { condition: 'Real Scenario: If Born as an Only Child', outcome: 'The native develops mature adult judgment very early in life, bearing family legacy independently without sharing inheritance.' },
      { condition: 'Real Scenario: If Having Brothers/Sisters', outcome: 'Younger siblings benefit from your patronage; elder siblings provide protective career introductions in crucial turning points.' },
    ],
    conditionalBranchesHi: [
      { condition: 'यथार्थवादी स्थिति: यदि जातक एकल संतान (Only Child) है', outcome: 'जातक कम आयु में ही परिपक्व निर्णय लेने लगता है तथा पैतृक दायित्वों व संपत्तियों का एकल स्वामी बनकर कुल का नाम रोशन करता है।' },
      { condition: 'यथार्थवादी स्थिति: यदि भाई-बहन मौजूद हैं', outcome: 'छोटे भाई-बहन आपके संरक्षण से लाभान्वित होंगे; बड़े भाई-बहन करियर के महत्वपूर्ण मोड़ पर आपकी सहायता करेंगे।' },
    ],
    remediesEn: ['Donate copper vessel or red sweets on Tuesdays to Mars', 'Respect elder brothers/sisters and gift green items to younger sisters on festivals'],
    remediesHi: ['मंगलवार को हनुमान जी को लाल सिंदूर व चमेली का तेल चढ़ाएं', 'भाई-बहनों से मधुर संबंध रखें तथा रक्षाबंधन/त्योहारों पर बहनों को हरे वस्त्र व उपहार दें'],
  };

  // D. MARRIAGE vs BACHELORHOOD / SINGLEHOOD (7th House & Venus)
  const h7LordId = getHouseLord(chart, 7);
  const h7HasKetu = h7Planets.some((p) => p.id === 'Ketu');
  const h7HasSaturn = h7Planets.some((p) => p.id === 'Saturn');
  const h7HasSun = h7Planets.some((p) => p.id === 'Sun');
  const venusDebilitated = venus.signIndex === 5; // Virgo
  const isBachelorLikely = (h7HasKetu && h7HasSaturn) || (venusDebilitated && h7HasSun);
  const isDelayLikely = h7HasSaturn || saturn.signIndex === (ascSignIdx + 6) % 12; // Saturn in 7th or aspecting 7th

  let maritalVerdictEn = 'Blessed marital union with a cultured, supportive spouse.';
  let maritalVerdictHi = 'सुसंस्कृत, बुद्धिमान एवं सहयोगी जीवनसाथी के साथ दांपत्य सुख का योग।';
  if (isBachelorLikely) {
    maritalVerdictEn = 'Strong indications of BACHELORHOOD (अविवाहित / ब्रह्मचर्य योग), late singlehood, or deliberate choice to remain unmarried for personal autonomy and spiritual pursuits.';
    maritalVerdictHi = 'आजीवन अविवाहित (Bachelorhood) रहने, वैवाहिक बंधनों से विरक्ति अथवा व्यक्तिगत स्वतंत्रता व आध्यात्मिक साधना हेतु विवाह न करने का प्रबल योग।';
  } else if (isDelayLikely) {
    maritalVerdictEn = 'Delayed Marriage (विवाह में विलंब): Marriage matures best after age 28–33, protecting against youthful incompatibility.';
    maritalVerdictHi = 'विलंबित विवाह योग: विवाह 28 से 33 वर्ष की आयु के मध्य होना श्रेयस्कर है; इससे दांपत्य में स्थायित्व व परिपक्वता आती है।';
  }

  const marriageDomain: PredictiveDomainDetail = {
    id: 'family_marriage',
    category: 'family_relatives',
    titleEn: 'Marriage vs BACHELORHOOD / Singlehood Reality (7th Bhava, Navamsha & Venus)',
    titleHi: 'विवाह बनाम अविवाहित / ब्रह्मचर्य (Bachelorhood) की यथार्थवादी स्थिति (सप्तम भाव, नवांश व शुक्र)',
    icon: 'heart-handshake',
    score: isBachelorLikely ? 52 : isDelayLikely ? 74 : 88,
    verdictEn: maritalVerdictEn,
    verdictHi: maritalVerdictHi,
    classicalSource: 'Brihat Parashara Hora Shastra, Ch. 15 (Saptamabhava Phala) & Jataka Parijata',
    shlokaRef: 'केतौ मन्दान्विते कामे प्रव्रज्यायोग उच्यते। कलत्रभावहीनो वा विरक्तो जायते नरः॥',
    detailedAnalysisEn: [
      `7th Bhava of Marriage: Ruled by ${h7LordId}. Occupants: ${h7Planets.map((p) => p.id).join(', ') || 'No afflicting malefics'}.`,
      `Venus (Kalatra Karaka): Placed in ${venus.signName} (Dignity: ${venus.dignity}).`,
      `Bachelorhood & Singlehood Analysis: Classical texts state that when Ketu, Saturn, or Sun dominate the 7th without benefic Jupiter intervention, the soul is drawn to autonomous bachelorhood, renouncing domestic entanglements for intellectual or spiritual missions.`,
      `If Married: Spouse is dignified, self-respecting, and brings social elevation.`,
    ],
    detailedAnalysisHi: [
      `सप्तम भाव (विवाह व दांपत्य): स्वामी ${h7LordId} हैं। इसमें उपस्थित ग्रह: ${h7Planets.map((p) => p.id).join(', ') || 'सौम्य स्थिति'}।`,
      `शुक्र देव (दांपत्य कारक): ${venus.signName} राशि में स्थित हैं।`,
      `अविवाहित / ब्रह्मचर्य (Bachelorhood) का विश्लेषण: शास्त्र कहते हैं कि जब सप्तम भाव में केतु, शनि या सूर्य का प्रबल प्रभाव हो और गुरु की दृष्टि न हो, तो जातक विवाह के प्रति उदासीन रहता है अथवा स्वेच्छा से अविवाहित रहकर अपने ध्येय में लीन रहता है।`,
      `यदि विवाह होता है: जीवनसाथी सुरुचिपूर्ण, स्वाभिमानी एवं कुल की मर्यादा का मान रखने वाला होगा।`,
    ],
    conditionalBranchesEn: [
      { condition: 'Real Scenario: If Native Chooses to Remain Single / Bachelor', outcome: 'Complete freedom to build global ventures, pursue deep research, or dedicate life to public service without domestic constraints.' },
      { condition: 'Real Scenario: If Marrying After Age 29', outcome: 'The marriage becomes a lifelong bastion of mutual support, financial growth, and joint spiritual elevation.' },
    ],
    conditionalBranchesHi: [
      { condition: 'यथार्थवादी स्थिति: यदि जातक अविवाहित (Single) रहता है', outcome: 'व्यक्तिगत स्वतंत्रता, उच्च अकादमिक/व्यावसायिक लक्ष्य एवं घरेलू चिंताओं से मुक्त होकर सामाजिक/आध्यात्मिक क्षेत्र में महान उपलब्धि।' },
      { condition: 'यथार्थवादी स्थिति: यदि 29 वर्ष के उपरांत विवाह होता है', outcome: 'दांपत्य जीवन अत्यंत परिपक्व, आर्थिक रूप से समृद्ध एवं परस्पर सम्मान पर आधारित दीर्घकालिक सुख देता है।' },
    ],
    remediesEn: ['Perform Lakshmi Narayan Archana with fragrant flowers on Fridays', 'Chant Shukra Beej Mantra: Om Dram Dreem Droum Sah Shukraya Namah'],
    remediesHi: ['शुक्रवार को मां लक्ष्मी व भगवान नारायण की युगल अर्चना करें', 'शुक्र के बीज मंत्र "ॐ द्रां द्रीं द्रौं सः शुक्राय नमः" का नित्य जप करें'],
  };

  // E. CHILDREN vs CHILDLESSNESS / NO KIDS REALITY (5th House & Jupiter)
  const h5Sign = getHouseSign(chart, 5);
  const h5LordId = getHouseLord(chart, 5);
  const h5ChildHasKetu = h5Planets.some((p) => p.id === 'Ketu');
  const h5ChildHasRahu = h5Planets.some((p) => p.id === 'Rahu');
  const h5ChildHasSaturn = h5Planets.some((p) => p.id === 'Saturn');
  const jupiterDebilitated = jupiter.signIndex === 9; // Capricorn
  const isChildlessLikely = (BARREN_SIGNS.has(h5Sign) && (h5ChildHasRahu || h5ChildHasKetu) && jupiterDebilitated);
  const isProgenyDelay = h5ChildHasSaturn || h5ChildHasRahu;

  let progenyVerdictEn = 'Blessed with intelligent, virtuous children who bring joy and honor.';
  let progenyVerdictHi = 'सदाचारी, मेधावी एवं आज्ञाकारी संतान का सुख; संतान कुल का नाम रोशन करेगी।';
  if (isChildlessLikely) {
    progenyVerdictEn = 'Strong indications of CHILD-FREE LIFE (निःसंतान योग / संतति-मुक्त जीवन) or late adoption; creative energies channel into disciples and intellectual legacy.';
    progenyVerdictHi = 'निःसंतान योग (Childless / Child-free) अथवा स्वैच्छिक संतति-मुक्त जीवन; आपकी रचनात्मक ऊर्जा विद्यार्थियों, शिष्यों अथवा सामाजिक कार्यों में अमर रहेगी।';
  } else if (isProgenyDelay) {
    progenyVerdictEn = 'Progeny after initial delay or medical assistance; Santan Gopal path dissolves obstacles.';
    progenyVerdictHi = 'संतान प्राप्ति में कुछ विलंब अथवा चिकित्सकीय मार्गदर्शन की आवश्यकता; संतान गोपाल अनुष्ठान से बाधाएं दूर होती हैं।';
  }

  const childrenDomain: PredictiveDomainDetail = {
    id: 'family_children',
    category: 'family_relatives',
    titleEn: 'Children vs CHILDLESSNESS / Child-Free Reality (5th Bhava, Saptamsha & Jupiter)',
    titleHi: 'संतान सुख बनाम निःसंतानता (Childless / No Children) की यथार्थवादी स्थिति (पंचम भाव व गुरु)',
    icon: 'baby',
    score: isChildlessLikely ? 48 : isProgenyDelay ? 70 : 88,
    verdictEn: progenyVerdictEn,
    verdictHi: progenyVerdictHi,
    classicalSource: 'Brihat Parashara Hora Shastra, Ch. 13 (Sutabhava Phala) & Phaladeepika Ch. 12',
    shlokaRef: 'सुतपे बलयुते धीमान् पुत्रवान् सुखभाग् भवेत्। वन्ध्याराशौ च पापेढ्ये पुत्रहानिर्विनिर्दिशेत्॥',
    detailedAnalysisEn: [
      `5th Bhava (Suta/Putra Sthana): Ruled by ${h5LordId} in ${h5Sign} Rashi. Jupiter Karaka in ${jupiter.signName}.`,
      `Progeny Reality Arc: ${progenyVerdictEn}`,
      `Childlessness / Child-Free Analysis: Classical Jyotish recognizes that when 5th house falls in a barren rashi with Rahu/Ketu and Jupiter is constrained, the native may have no biological children, experiencing profound fulfillment through mentoring younger generations or creative masterpieces.`,
      `If Blessed with Progeny: Eldest child possesses sharp intellect, leadership flair, and deep philosophical instincts.`,
    ],
    detailedAnalysisHi: [
      `पंचम भाव (संतान व बुद्धि): स्वामी ${h5LordId} हैं। संतान कारक देवगुरु बृहस्पति ${jupiter.signName} में स्थित हैं।`,
      `संतान सुख की यथार्थवादी स्थिति: ${progenyVerdictHi}`,
      `निःसंतानता अथवा संतान-मुक्त जीवन का विश्लेषण: जब पंचम में बंध्या राशियां हों और राहु-केतु का प्रभाव हो, तो कई जातक संतान के सांसारिक दायित्वों से मुक्त रहकर अपनी ऊर्जा शिष्यों, संस्थाओं या कलात्मक कृतियों को समर्पित करते हैं।`,
      `यदि संतान होती है: प्रथम संतान अत्यंत कुशाग्र बुद्धि, नेतृत्व क्षमता एवं उच्च संस्कारों से युक्त होगी।`,
    ],
    conditionalBranchesEn: [
      { condition: 'Real Scenario: If Living Child-Free', outcome: 'The native enjoys immense financial mobility, travel freedom, and channels legacy into public welfare or professional apprentices.' },
      { condition: 'Real Scenario: If Seeking Progeny After Delay', outcome: 'Medical science combined with Santan Gopal Mantra recitation blesses the home with healthy offspring.' },
    ],
    conditionalBranchesHi: [
      { condition: 'यथार्थवादी स्थिति: यदि जातक संतान-मुक्त (Child-free) रहता है', outcome: 'घरेलू दायित्वों से मुक्त होकर वित्तीय स्वतंत्रता, वैश्विक भ्रमण एवं शिष्यों/युवाओं का मार्गदर्शन कर समाज में अमिट छाप छोड़ना।' },
      { condition: 'यथार्थवादी स्थिति: यदि विलंब के पश्चात संतान प्राप्ति का प्रयास हो', outcome: 'चिकित्सीय परामर्श के साथ संतान गोपाल मंत्र का अनुष्ठान करने पर स्वस्थ व सुंदर शिशु का आगमन होता है।' },
    ],
    remediesEn: ['Recite Santan Gopal Mantra: Om Shreem Hreem Kleem Glaum Devakisuta Govinda Vasudeva Jagatpate', 'Feed cows with yellow bananas and jaggery on Thursdays'],
    remediesHi: ['संतान गोपाल मंत्र "ॐ श्रीं ह्रीं क्लीं ग्लौं देवकीसुत गोविन्द वासुदेव जगत्पते" का नियमित जप करें', 'गुरुवार को गाय को केला, भीगी चना दाल व गुड़ खिलाएं'],
  };

  // F. GRANDPARENTS (Maternal & Paternal)
  const grandparentsDomain: PredictiveDomainDetail = {
    id: 'family_grandparents',
    category: 'family_relatives',
    titleEn: 'Grandparents: Paternal & Maternal Ancestors (5th & 12th Bhavas)',
    titleHi: 'नाना-नानी व दादा-दादी: मातृ व पितृ कुल के पूर्वज (पंचम व द्वादश भाव)',
    icon: 'hourglass',
    score: 80,
    verdictEn: 'Strong ancestral roots; paternal grandfather had a reputation for honesty; maternal lineage carries spiritual blessings.',
    verdictHi: 'सुदृढ़ पैतृक एवं मातृक कुल; दादाजी की सत्यवादिता एवं नाना-नानी के धार्मिक संस्कारों का जातक के जीवन पर गहरा प्रभाव।',
    classicalSource: 'Brihat Parashara Hora Shastra, Bhavat Bhavam Principles',
    shlokaRef: 'नवमात् नवमं पित्र्यं चतुर्थाच्च चतुर्थकम्। पूर्वजानां प्रसादेन सर्वकार्यं प्रसिद्ध्यति॥',
    detailedAnalysisEn: [
      'Paternal Grandfather (9th from 9th = 5th House): Shows an honorable, dharmic paternal patriarch whose goodwill protects family reputation.',
      'Paternal Grandmother (4th from 9th = 12th House): Pious, quiet soul with deep spiritual devotion.',
      'Maternal Grandfather (9th from 4th = 12th House): Endured life trials with philosophical serenity.',
      'Maternal Grandmother (4th from 4th = 7th House): Warm, generous hostess who welcomed guests with abundant food.',
    ],
    detailedAnalysisHi: [
      'दादाजी (नवम से नवम = पंचम भाव): स्वाभिमानी, धर्मात्मा एवं समाज में प्रतिष्ठित पुरुष थे, जिनकी साख आज भी परिवार की रक्षा करती है।',
      'दादीजी (नवम से चतुर्थ = द्वादश भाव): शांत, धर्मपरायण एवं ईश्वर में अनन्य आस्था रखने वाली विदुषी महिला।',
      'नानाजी (चतुर्थ से नवम = द्वादश भाव): जीवन में अनेक उतार-चढ़ाव देखकर भी धैर्य और सत्य का मार्ग नहीं छोड़ा।',
      'नानीजी (चतुर्थ से चतुर्थ = सप्तम भाव): अत्यंत ममतामयी, अतिथियों का सत्कार करने वाली एवं कुल को जोड़कर रखने वाली स्त्री।',
    ],
    conditionalBranchesEn: [
      { condition: 'Ancestral Tarpana / Shraddha', outcome: 'Offering yearly Tarpana during Pitri Paksha yields sudden clearance of financial stagnation.' },
    ],
    conditionalBranchesHi: [
      { condition: 'पितृ पक्ष में तर्पण व श्राद्ध', outcome: 'पितरों के निमित्त श्राद्ध व अन्नदान करने से संतान व व्यवसाय में आ रही गुप्त रुकावटें स्वतः समाप्त हो जाती हैं।' },
    ],
    remediesEn: ['Perform Pitri Tarpana with black sesame seeds during Amavasya', 'Feed crows and stray dogs on New Moon days'],
    remediesHi: ['अमावस्या के दिन काले तिल व जल से पितरों का तर्पण करें', 'अमावस्या पर कौओं, श्वानों एवं गाय को भोजन कराएं'],
  };

  // G. IN-LAWS (Father-in-law, Mother-in-law, Brother/Sister-in-law)
  const inLawsDomain: PredictiveDomainDetail = {
    id: 'family_inlaws',
    category: 'family_relatives',
    titleEn: 'In-Laws: Father-in-law, Mother-in-law & Brother/Sister-in-law (3rd, 10th & 9th)',
    titleHi: 'ससुराल पक्ष: सास, ससुर, साला व साली (तृतीय, दशम व नवम भाव)',
    icon: 'home',
    score: 76,
    verdictEn: 'Respectful, balanced relationship with in-laws; maintain courteous boundaries to ensure long-term harmony.',
    verdictHi: 'ससुराल पक्ष से मर्यादित व सम्मानित संबंध; अत्यधिक हस्तक्षेप से बचकर आदरपूर्ण दूरी बनाए रखना श्रेयस्कर है।',
    classicalSource: 'Phaladeepika & Bhavat Bhavam (9th from 7th = 3rd for Father-in-law)',
    shlokaRef: 'सप्तमात् नवमं श्वशुरं दशमं श्वश्रूमेव च। सौम्यग्रहान्विते तुष्टौ विपरीतौ विरोधकौ॥',
    detailedAnalysisEn: [
      'Father-in-law (3rd House = 9th from 7th): Well-settled, hardworking man who respects your independence.',
      'Mother-in-law (10th House = 4th from 7th): Influential domestic matriarch; open communication prevents unnecessary misunderstandings.',
      'Brothers/Sisters-in-law (9th House = 3rd from 7th): Cordial social relations during family festivals.',
    ],
    detailedAnalysisHi: [
      'ससुर जी (सप्तम से नवम = तृतीय भाव): कर्मठ एवं स्वाभिमानी व्यक्तित्व; आपके निर्णयों का सम्मान करेंगे।',
      'सास जी (सप्तम से चतुर्थ = दशम भाव): परिवार की व्यवस्था में प्रभावी भूमिका; उनके प्रति आदर भाव रखने से दांपत्य में सौहार्द बना रहता है।',
      'साला व साली (सप्तम से तृतीय = नवम भाव): पारिवारिक उत्सवों व मांगलिक कार्यों में सौहार्दपूर्ण संबंध।',
    ],
    conditionalBranchesEn: [
      { condition: 'Financial Dealing with In-laws', outcome: 'Avoid taking commercial loans or joint investments with in-laws to preserve pristine dignity.' },
    ],
    conditionalBranchesHi: [
      { condition: 'ससुराल पक्ष से आर्थिक लेनदेन', outcome: 'ससुराल पक्ष के साथ संयुक्त व्यापार या बड़े ऋण के लेनदेन से बचें ताकि संबंधों की गरिमा अक्षुण्ण रहे।' },
    ],
    remediesEn: ['Gift silver or white silk items to mother-in-law on auspicious occasions', 'Maintain respectful communication during family gatherings'],
    remediesHi: ['त्योहारों पर सास जी को चांदी अथवा सफेद रेशमी वस्त्र भेंट करें', 'पारिवारिक आयोजनों में बड़ों का मान रखें'],
  };

  // H. UNCLES, AUNTS & COUSINS (Paternal & Maternal)
  const unclesAuntsDomain: PredictiveDomainDetail = {
    id: 'family_uncles',
    category: 'family_relatives',
    titleEn: 'Uncles, Aunts & Extended Cousins: Paternal & Maternal Lineage (11th & 6th)',
    titleHi: 'चाचा, ताऊ, बुआ, मामा, मौसी व कजिन: पितृक व मातृक रिश्तेदार (एकादश व षष्ठ भाव)',
    icon: 'network',
    score: 75,
    verdictEn: 'Extended kinsmen are socially visible; cordial terms with occasional rivalry or property discussions.',
    verdictHi: 'नाते-रिश्तेदारों का विस्तृत घेरा; सामाजिक स्तर पर मिलना-जुलना बना रहता है, यद्यपि प्रतिस्पर्धात्मक भाव भी संभव है।',
    classicalSource: 'Brihat Parashara Hora Shastra, Kinship Chapters',
    shlokaRef: 'एकादशे तातभ्राता षष्ठे मातुलसंभवः। सौम्यग्रहैर्युते सौख्यं क्रूरैर्विग्रहमादिशेत्॥',
    detailedAnalysisEn: [
      'Paternal Uncles/Aunts (11th House = 3rd from 9th): Enterprising; one uncle attains significant commercial stature.',
      'Maternal Uncles/Aunts / Mama (6th House = 3rd from 4th, Mercury): Maternal uncle brings childhood affection; maintain formal clarity in any commercial help.',
      'Cousins (Brothers/Sisters): Friendly camaraderie during youth, diverging into separate geographic careers in adulthood.',
    ],
    detailedAnalysisHi: [
      'चाचा-ताऊ व बुआ (एकादश भाव = नवम से तृतीय): उद्यमी व व्यावहारिक; किसी एक चाचा/ताऊ का व्यावसायिक प्रभाव उल्लेखनीय रहेगा।',
      'मामा व मौसी (षष्ठ भाव = चतुर्थ से तृतीय, बुध): ननिहाल पक्ष से बचपन में स्नेह मिलता है; वयस्क जीवन में आर्थिक अपेक्षाओं से बचें।',
      'कजिन भाई-बहन: युवावस्था में अच्छा मित्रवत संबंध; आगे चलकर सब अपने-अपने कार्यक्षेत्र व नगरों में व्यस्त हो जाते हैं।',
    ],
    conditionalBranchesEn: [
      { condition: 'Joint Family Assets', outcome: 'Clearly demarcate ancestral property boundaries early to avert dispute with paternal cousins.' },
    ],
    conditionalBranchesHi: [
      { condition: 'पैतृक जमीन-जायदाद का बंटवारा', outcome: 'पैतृक संपत्ति में सभी दस्तावेज समय रहते स्पष्ट कराएं ताकि कजिन भाइयों से मनमुटाव न हो।' },
    ],
    remediesEn: ['Respect maternal uncle (Mama) and gift green fodder to cows on Wednesdays'],
    remediesHi: ['मामा का सम्मान करें तथा बुधवार को गाय को हरा चारा अथवा पालक खिलाएं'],
  };

  // I. FRIENDS & NEIGHBOURS (11th & 3rd)
  const friendsNeighboursDomain: PredictiveDomainDetail = {
    id: 'family_friends',
    category: 'family_relatives',
    titleEn: 'Friends & Neighbours: Social Circle, Loyalty & Immediate Surroundings (11th & 3rd)',
    titleHi: 'मित्र व पड़ोसी: सामाजिक वृत्त, निष्ठा, विश्वासघात से बचाव व पड़ोस (एकादश व तृतीय भाव)',
    icon: 'user-plus',
    score: 84,
    verdictEn: 'Select circle of fiercely loyal friends; broad acquaintance network; peaceful and cooperative neighborhood.',
    verdictHi: 'गिने-चुने निष्ठावान मित्रों का अटूट संबल; व्यापक सामाजिक संपर्क एवं शांत व सहयोगी पड़ोस।',
    classicalSource: 'Phaladeepika Ch. 16 (Labhabhava Mitra Phala)',
    shlokaRef: 'लाभस्थाने शुभे मित्रे बहुमान्यो धनेश्वरः। तृतीये शुभसंयुक्ते प्रतिवेशी सुहृत्तमः॥',
    detailedAnalysisEn: [
      'Friends Circle (11th House): You attract influential, intellectually stimulating friends. A few intimate companions stand with you through thick and thin.',
      'Guarding Against Fair-Weather Friends: Rahu’s presence on 11th warns against opportunists who flatter during financial peaks and vanish during trials.',
      'Neighbours (3rd House): Peaceful residential neighbourhood; amicable neighbors who offer immediate assistance during domestic functions.',
    ],
    detailedAnalysisHi: [
      'मित्र मंडली (एकादश भाव): आपकी संगति में विचारवान, उच्च पदस्थ एवं सच्चे मित्रों का प्रवेश होता है जो कठिन समय में भी साथ निभाते हैं।',
      'मतलबी मित्रों से सतर्कता: जब लाभ भाव में राहु का प्रभाव हो तो चापलूस व स्वार्थी मित्रों से सावधान रहें जो केवल लाभ के लिए जुड़ते हैं।',
      'पड़ोसी (तृतीय भाव): आपका निवास एक शांत व भद्र पड़ोस में होता है जहां आवश्यकता पड़ने पर पड़ोसी तुरंत सहयोग हेतु तत्पर रहते हैं।',
    ],
    conditionalBranchesEn: [
      { condition: 'Lending Money to Friends', outcome: 'Never lend substantial capital to personal friends without documentation; it risks losing both friendship and money.' },
    ],
    conditionalBranchesHi: [
      { condition: 'मित्रों को कर्ज देना', outcome: 'मित्रता में बड़ा धन उधार देने से बचें, अन्यथा धन और मित्रता दोनों के नष्ट होने का अंदेशा रहता है।' },
    ],
    remediesEn: ['Maintain transparent communication and celebrate friends’ victories wholeheartedly'],
    remediesHi: ['सच्चे मित्रों का समय पर साथ दें तथा किसी से ईर्ष्या न रखें'],
  };

  return {
    lagnaProfileEn: `Born in ${ascSignName} Ascendant (${asc.dms}) with Navamsha Lagna in ${d9AscSign}. Lagna Lord is ${lagnaLordId}.`,
    lagnaProfileHi: `आपका जन्म ${ascSignName} लग्न (${asc.dms}) एवं ${d9AscSign} नवांश में हुआ है। लग्नेश ग्रह ${lagnaLordId} हैं।`,
    appearanceDomain,
    educationDomain,
    careerAuditDomain,
    vicesHabitsDomain,
    litigationDomain,
    romanceScandalsDomain,
    familyDomains: {
      father: fatherDomain,
      mother: motherDomain,
      siblingsAndOnlyChild: siblingsDomain,
      marriageVsBachelorhood: marriageDomain,
      childrenVsChildlessness: childrenDomain,
      grandparents: grandparentsDomain,
      inLaws: inLawsDomain,
      unclesAuntsCousins: unclesAuntsDomain,
      friendsNeighbours: friendsNeighboursDomain,
    },
  };
}
