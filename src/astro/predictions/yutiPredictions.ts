import { NINE_GRAHAS, SIGNS } from '../constants';
import { angularDiffDeg } from '../time';
import type { BodyPosition, ChartData, NineGrahaId } from '../types';

export interface PairYutiInsight {
  pair: [NineGrahaId, NineGrahaId];
  yogaNameEn: string;
  yogaNameHi: string;
  tone: 'auspicious' | 'mixed' | 'challenging';
  positiveEn: string;
  positiveHi: string;
  negativeEn: string;
  negativeHi: string;
  incidentEn: string;
  incidentHi: string;
}

export interface ChartYutiGroup {
  count: number; // 2..7
  labelEn: string;
  labelHi: string;
  signIndex: number;
  signNameEn: string;
  signNameHi: string;
  houseNumber: number;
  planets: NineGrahaId[];
  degreeSpanDeg: number;
  warPairs: string[];
  headlineEn: string;
  headlineHi: string;
  positiveEn: string;
  positiveHi: string;
  negativeEn: string;
  negativeHi: string;
  incidentRiskEn: string;
  incidentRiskHi: string;
  pairInsights: PairYutiInsight[];
  remedyEn: string;
  remedyHi: string;
  source: string;
}

export interface YutiReport {
  groups: ChartYutiGroup[]; // 2+ planet groups in native D1
  maxConjunctionCount: number;
  soloPlanets: NineGrahaId[];
  summaryEn: string;
  summaryHi: string;
}

const SIGN_HI = [
  'मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या',
  'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुंभ', 'मीन',
];

const PLANET_HI: Record<NineGrahaId, string> = {
  Sun: 'सूर्य', Moon: 'चंद्र', Mars: 'मंगल', Mercury: 'बुध',
  Jupiter: 'गुरु', Venus: 'शुक्र', Saturn: 'शनि', Rahu: 'राहु', Ketu: 'केतु',
};

const ORDER_INDEX: Record<NineGrahaId, number> = {
  Sun: 0, Moon: 1, Mars: 2, Mercury: 3, Jupiter: 4, Venus: 5, Saturn: 6, Rahu: 7, Ketu: 8,
};

function pairKey(a: NineGrahaId, b: NineGrahaId): string {
  return ORDER_INDEX[a] <= ORDER_INDEX[b] ? `${a}-${b}` : `${b}-${a}`;
}

interface RawPairKb {
  yogaEn: string;
  yogaHi: string;
  tone: 'auspicious' | 'mixed' | 'challenging';
  posEn: string;
  posHi: string;
  negEn: string;
  negHi: string;
  incEn: string;
  incHi: string;
}

const PAIR_KB: Record<string, RawPairKb> = {
  'Sun-Moon': {
    yogaEn: 'Amavasya / Surya-Chandra Yuti',
    yogaHi: 'अमावस्या / सूर्य-चंद्र युति',
    tone: 'mixed',
    posEn: 'Focused willpower merging mind and soul; strong technical, mechanical or leadership drive.',
    posHi: 'मन और आत्मा का एकीकरण — एकाग्र इच्छाशक्ति, तकनीकी कौशल व दृढ़ निर्णय क्षमता।',
    negEn: 'Emotional sensitivity vs ego conflict; maternal/paternal expectations feel heavy.',
    negHi: 'आंतरिक तनाव, माता-पिता के बीच मतभेद या मन में अस्थिरता।',
    incEn: 'Important family/emotional turning points during New-Moon lunar periods or domestic shifts.',
    incHi: 'अमावस्या-सदृश दशाओं में गृह परिवर्तन, नेत्र/सिर दर्द या पारिवारिक दायित्व में अचानक बदलाव।',
  },
  'Sun-Mars': {
    yogaEn: 'Agni-Teja / Surya-Mangala Yuti',
    yogaHi: 'सूर्य-मंगल (अग्नि-तेज युति)',
    tone: 'mixed',
    posEn: 'Fearless courage, surgery/defense/engineering mastery, executive authority & property conquest.',
    posHi: 'अदम्य साहस, प्रशासन, पुलिस/सेना/इंजीनियरिंग व सर्जरी क्षेत्र में उच्च सफलता।',
    negEn: 'Explosive temper, impatience, authority clashes and high blood pressure heat.',
    negHi: 'अत्यधिक क्रोध, अहंकार, उच्च रक्तचाप व वरिष्ठों से टकराव।',
    incEn: 'Risk of burns, sharp-tool cuts, fever spikes, or heated workplace/vehicle confrontations.',
    incHi: 'अग्नि/तेज धार से चोट, बुखार, वाहन में जल्दबाज़ी या कार्यस्थल विवाद का घटना-योग।',
  },
  'Sun-Mercury': {
    yogaEn: 'Budhaditya Yoga (Intellect & Fame)',
    yogaHi: 'बुधादित्य योग (बुद्धि एवं यश)',
    tone: 'auspicious',
    posEn: 'Razor-sharp intelligence, speech, finance, administrative acumen and scholarly recognition.',
    posHi: 'तीव्र मेधा, गणना, वाक्पटुता, वित्त एवं राजकीय/बौद्धिक प्रतिष्ठा।',
    negEn: 'Mercury combustion (<14°) can cause nervous hurry or stubborn intellectual pride.',
    negHi: 'बुध अस्त होने पर वाणी में उतावलापन, तंत्रिका थकान या अति-तर्कशीलता।',
    incEn: 'Academic awards, public speaking breakthroughs, contracts or tax/audit milestones.',
    incHi: 'परीक्षा सफलता, लेखन/अनुबंध हस्ताक्षर व पदोन्नति के स्पष्ट घटनाक्रम।',
  },
  'Sun-Jupiter': {
    yogaEn: 'Surya-Guru (Dharma-Adhikara Yuti)',
    yogaHi: 'सूर्य-गुरु (धर्म-अधिकार युति)',
    tone: 'auspicious',
    posEn: 'Government favor, advisory prestige, ethical leadership, banking & higher mentorship.',
    posHi: 'सरकारी सम्मान, उच्च सलाहकार पद, धर्मनिष्ठा व गुरु-पिता से सहयोग।',
    negEn: 'Moral pride or overbearing righteousness when weak; minor liver/pitta imbalance.',
    negHi: 'सैद्धांतिक हठ या पित्त/लिवर संवेदनशीलता।',
    incEn: 'Official appointments, state honors, temple/academic leadership or paternal property uplift.',
    incHi: 'राजकीय नियुक्ति, सम्मान समारोह, पैतृक संपत्ति या गुरु कृपा से बड़ा लाभ।',
  },
  'Sun-Venus': {
    yogaEn: 'Surya-Shukra Yuti',
    yogaHi: 'सूर्य-शुक्र युति',
    tone: 'mixed',
    posEn: 'Artistic refinement, luxury vehicles, stage/cinema glamour, social popularity & design taste.',
    posHi: 'कला, अभिनय, सौंदर्य, वाहन सुख व उच्चवर्गीय सामाजिक आकर्षण।',
    negEn: 'Venus combust near Sun creates ego-friction in love/marriage and eye/hormonal strain.',
    negHi: 'शुक्र अस्त होने पर दांपत्य में अहं-टकराव, विलंबित सुख या शयन सुख में कमी।',
    incEn: 'Romantic turning points, wedding expense spikes, or luxury/fashion career openings.',
    incHi: 'प्रेम प्रसंग में नाटकीय मोड़, विवाह संबंधी परीक्षा या कला क्षेत्र में बड़ा अवसर।',
  },
  'Sun-Saturn': {
    yogaEn: 'Surya-Shani (Pitru-Karma Dwandwa)',
    yogaHi: 'सूर्य-शनि (पितृ-कर्म संघर्ष युति)',
    tone: 'challenging',
    posEn: 'Iron-willed organizational persistence, institutional law, public infrastructure & grit.',
    posHi: 'लौह-संकल्प, कानून, श्रम-प्रबंधन व कठोर संघर्ष के बाद स्थायी राजकीय/प्रशासनिक पद।',
    negEn: 'Cold distance or ideological friction with father/bosses; bone/cardiac fatigue from overwork.',
    negHi: 'पिता या बॉस से वैचारिक दूरी, सफलता में विलंब व हड्डी/हृदय थकान।',
    incEn: 'Senior demotion/transfer tests followed by late promotion after endurance; paternal health care.',
    incHi: 'नौकरी में स्थानांतरण/अवरोध के बाद स्थायी उन्नति; पिता के स्वास्थ्य संबंधी घटनाएँ।',
  },
  'Sun-Rahu': {
    yogaEn: 'Surya-Rahu Grahan Yoga',
    yogaHi: 'सूर्य-राहु ग्रहण योग',
    tone: 'challenging',
    posEn: 'Unconventional political ambition, tech/foreign diplomacy, cinema & mass reach.',
    posHi: 'विदेशी कूटनीति, तकनीक, मीडिया व जन-प्रभाव में असाधारण महत्वाकांक्षा।',
    negEn: 'Authority scandals, self-doubt, sudden reputation swings or father health strain.',
    negHi: 'सरकारी/ऑफिस विवाद, अपयश का भय, आत्म-संदेह व पिता को कष्ट।',
    incEn: 'Sudden political/career upheaval, tax scrutiny, or foreign relocation breaks.',
    incHi: 'अचानक पद परिवर्तन, सरकारी नोटिस/जांच, या विदेश गमन जैसी आकस्मिक घटनाएँ।',
  },
  'Sun-Ketu': {
    yogaEn: 'Surya-Ketu (Karmic Detachment)',
    yogaHi: 'सूर्य-केतु युति',
    tone: 'challenging',
    posEn: 'Deep spiritual insight, intuitive diagnosis, occult/Ayurveda mastery & selfless integrity.',
    posHi: 'आध्यात्मिक तेज, आयुर्वेद/चिकित्सा, शोध व गूढ़ सत्य की सहज पकड़।',
    negEn: 'Missed worldly credit despite hard work; bone/spine fever or paternal detachment.',
    negHi: 'कठोर परिश्रम का श्रेय न मिलना, पिता से दूरी या रीढ़/बुखार संबंधी कष्ट।',
    incEn: 'Job resignations for inner peace, pilgrimage journeys, or sudden spiritual awakenings.',
    incHi: 'अचानक पद त्याग, तीर्थ यात्रा, या शल्य-चिकित्सा/स्वास्थ्य परीक्षा के योग।',
  },
  'Moon-Mars': {
    yogaEn: 'Chandra-Mangala Yoga',
    yogaHi: 'चंद्र-मंगल (महालक्ष्मी योग)',
    tone: 'mixed',
    posEn: 'Self-made financial drive, real estate wealth, bold emotional courage & medical skill.',
    posHi: 'स्व-अर्जित धन, भूमि-भवन निर्माण, व्यापारिक साहस व चिकित्सा कौशल।',
    negEn: 'Impulsive mood swings, mother-child arguments, blood/menstrual heat.',
    negHi: 'भावुक आवेग, शीघ्र क्रोध, माता से मतभेद व रक्त/उष्णता विकार।',
    incEn: 'Property purchases/disputes, sudden cashflow surges, or minor blood/cut accidents when rushed.',
    incHi: 'संपत्ति क्रय-विक्रय की बड़ी घटना, अचानक धन लाभ या उतावलेपन में चोट-चपेट।',
  },
  'Moon-Mercury': {
    yogaEn: 'Budha-Chandra Yoga',
    yogaHi: 'चंद्र-बुध (सरस्वती-सदृश युति)',
    tone: 'auspicious',
    posEn: 'Eloquent storytelling, poetry, sharp trading instinct, bilingual fluency & empathy.',
    posHi: 'मधुर वाक्पटुता, लेखन, व्यापारिक चातुर्य, शिक्षण व तीव्र स्मरण शक्ति।',
    negEn: 'Over-active anxious mind, restlessness, or nervous insomnia if afflicted.',
    negHi: 'अति-विचार, मानसिक चंचलता व अनिद्रा की प्रवृत्ति।',
    incEn: 'Publishing contracts, profitable trade launches, educational awards & short journeys.',
    incHi: 'प्रकाशन, व्यापारिक समझौता, शिक्षा सफलता व लाभदायक छोटी यात्राएँ।',
  },
  'Moon-Jupiter': {
    yogaEn: 'Gajakesari Yoga (Conjunction)',
    yogaHi: 'गजकेसरी योग (युति)',
    tone: 'auspicious',
    posEn: 'Lion-like charisma, benevolent wisdom, lasting public respect, prosperity & loving mother.',
    posHi: 'गज-समान प्रभाव, विशाल बुद्धि, धन-ऐश्वर्य, जनप्रिय सम्मान व माता का शुभ आशीर्वाद।',
    negEn: 'Complacent optimism or weight/sugar tendency if unrestrained.',
    negHi: 'अति-विश्वास या कफ/मधुमेह जैसी प्रवृत्ति।',
    incEn: 'Home/vehicle acquisition, scholarly honors, fortunate child milestones & rescue in crises.',
    incHi: 'गृह-वाहन सुख, संतान प्राप्ति, बड़े संकट से चमत्कारी बचाव व यश प्राप्ति।',
  },
  'Moon-Venus': {
    yogaEn: 'Chandra-Shukra (Lakshmi-Kala Yuti)',
    yogaHi: 'चंद्र-शुक्र युति',
    tone: 'auspicious',
    posEn: 'Magnetic grace, luxury fashion/culinary/music mastery, warm romance & public charm.',
    posHi: 'अतुलनीय सौंदर्य-बोध, कला-संगीत, समृद्ध वाहन सुख व मधुर प्रेम संबंध।',
    negEn: 'Indulgence, romantic longing or temptation toward multiple emotional attachments.',
    negHi: 'विलासिता, भावुक आकर्षण व एक से अधिक भावनात्मक संबंधों का प्रलोभन।',
    incEn: 'Romantic milestones, luxury lifestyle upgrades, or creative fame events.',
    incHi: 'प्रेम विवाह/रोमांस के बड़े अवसर, विलासिता वृद्धि व कला क्षेत्र में सम्मान।',
  },
  'Moon-Saturn': {
    yogaEn: 'Vish Yoga (Chandra-Shani)',
    yogaHi: 'विष योग (चंद्र-शनि युति)',
    tone: 'challenging',
    posEn: 'Sober realism, deep meditation, engineering/scientific patience & administrative stamina.',
    posHi: 'गंभीर यथार्थवाद, ध्यान-योग, गहन शोध व कठिन परिस्थितियों में अटल धैर्य।',
    negEn: 'Melancholy, isolation fears, cold/sinus vulnerability or mother health sorrow.',
    negHi: 'अवसाद, अकेलापन, कफ-जुकाम व माता के स्वास्थ्य या सुख में कमी।',
    incEn: 'Periods of emotional loneliness, heavy eldercare duties or overseas separation tests.',
    incHi: 'मानसिक बोझ, माता की सेवा या घर से दूर प्रवास जैसी घटनाएँ।',
  },
  'Moon-Rahu': {
    yogaEn: 'Chandra-Rahu Grahan Yoga',
    yogaHi: 'चंद्र-राहु ग्रहण योग',
    tone: 'challenging',
    posEn: 'Uncanny psychological radar, foreign fame, digital/cinema imagination & intuition.',
    posHi: 'तीव्र अंतर्ज्ञान, विदेशी सफलता, मीडिया/सिनेमा व मनोविज्ञान में असाधारण कल्पना।',
    negEn: 'Phantom anxiety, phobias, trust issues or sudden mood storms.',
    negHi: 'अकारण भय, भ्रम, मानसिक उथल-पुथल व अति-संवेदनशीलता।',
    incEn: 'Sudden foreign relocation, water/travel scares or dramatic psychological shifts.',
    incHi: 'अचानक विदेश यात्रा, जल-यात्रा सावधानी या मानसिक/पारिवारिक उलटफेर।',
  },
  'Moon-Ketu': {
    yogaEn: 'Chandra-Ketu (Mystic Mind)',
    yogaHi: 'चंद्र-केतु युति',
    tone: 'mixed',
    posEn: 'Prophetic dreams, spiritual healing, detachment from petty drama & research gift.',
    posHi: 'पूर्वाभास, आध्यात्मिक शांति, वैराग्य व गूढ़ विद्या में प्रवीणता।',
    negEn: 'Feeling misunderstood emotionally, silent grief or maternal distance.',
    negHi: 'मन की बात छिपाना, अकेलेपन का भाव व माता से संवेदनशील दूरी।',
    incEn: 'Sudden pilgrimage, meditation retreat, or leaving crowded social scenes unexpectedly.',
    incHi: 'अचानक आध्यात्मिक यात्रा, साधना में झुकाव या पारिवारिक मोहभंग की घटनाएँ।',
  },
  'Mars-Mercury': {
    yogaEn: 'Mangala-Budha (Tarka-Shakti)',
    yogaHi: 'मंगल-बुध (तर्क-शक्ति युति)',
    tone: 'mixed',
    posEn: 'Surgical debate skill, coding, stock trading speed, engineering & investigative reporting.',
    posHi: 'तीक्ष्ण तर्क, कोडिंग, गणित, शेयर व्यापार, वकालत व तकनीकी निपुणता।',
    negEn: 'Sarcastic sharp tongue, arguments with siblings/colleagues or anxious impatience.',
    negHi: 'तीखी व चुभने वाली वाणी, भाई-बहनों से बहस व नसों में तनाव।',
    incEn: 'Legal notices/debates won by logic, commercial tech deals, or sibling property talks.',
    incHi: 'कोर्ट-कचहरी/वाद-विवाद घटना, तकनीकी व्यापार अनुबंध व भाई-बहन संबंधी विषय।',
  },
  'Mars-Jupiter': {
    yogaEn: 'Guru-Mangala Yoga',
    yogaHi: 'गुरु-मंगल योग',
    tone: 'auspicious',
    posEn: 'Righteous warrior leadership, disciplined wealth, surgery/law mastery & courage backed by wisdom.',
    posHi: 'धर्म-संमत पराक्रम, न्याय-प्रशासन, भूमि लाभ व बुद्धिपूर्ण साहस से विजय।',
    negEn: 'Self-righteous anger when provoked; digestive heat if overworked.',
    negHi: 'सिद्धांतों को लेकर उग्रता व पित्त/उदर उष्णता।',
    incEn: 'Real-estate triumphs, legal victories, military/executive promotion & noble leadership.',
    incHi: 'भूमि-भवन विजय, न्यायिक सफलता, उच्च पद प्राप्ति व शुभ पारिवारिक उत्सव।',
  },
  'Mars-Venus': {
    yogaEn: 'Mangala-Shukra (Kama / Charisma)',
    yogaHi: 'मंगल-शुक्र (आकर्षण व कला युति)',
    tone: 'mixed',
    posEn: 'Electric romantic chemistry, performing arts talent, fashion entrepreneurship & creative passion.',
    posHi: 'प्रबल आकर्षण, कला-फैशन व्यवसाय, वाहन सुख व तीव्र दांपत्य ऊर्जा।',
    negEn: 'Restless romantic desires, partner quarrels, or extra-marital temptation if afflicted.',
    negHi: 'कामेच्छा की अधिकता, दांपत्य में आवेश व अनैतिक आकर्षण की परीक्षा (अशुभ होने पर)।',
    incEn: 'Passionate love affairs, whirlwind marriage decisions, or intense relationship crises.',
    incHi: 'तीव्र प्रेम-प्रसंग, आवेगपूर्ण विवाह निर्णय या दांपत्य में नाटकीय घटनाक्रम।',
  },
  'Mars-Saturn': {
    yogaEn: 'Dwandwa / Agni-Vayu Conflict',
    yogaHi: 'मंगल-शनि (द्वंद्व एवं दुर्घटना-कारक युति)',
    tone: 'challenging',
    posEn: 'Mechanical engineering, precision metalwork, mining/heavy industry & crisis endurance.',
    posHi: 'मशीनरी, निर्माण, शल्य/तकनीकी उद्योग व भीषण दबाव में कार्य करने की अद्भुत क्षमता।',
    negEn: 'Suppressed rage vs frustration, bone/joint injuries and sudden delays breaking plans.',
    negHi: 'अत्यधिक संघर्ष, दमित क्रोध, हड्डी/चोट का भय व कार्यों में आकस्मिक अवरोध।',
    incEn: 'Elevated risk of vehicle accidents, fractures, machine injury or surgery — drive & act carefully!',
    incHi: 'वाहन दुर्घटना, हड्डी/चोट, मशीन/सर्जरी या कानूनी विवाद का प्रमुख घटना-योग — विशेष सावधानी रखें।',
  },
  'Mars-Rahu': {
    yogaEn: 'Angarak Dosha (Mars + Rahu)',
    yogaHi: 'अंगारक दोष (मंगल + राहु)',
    tone: 'challenging',
    posEn: 'Explosive innovation, daring risk appetite, tech startups, athletics & unorthodox boldness.',
    posHi: 'असीमित ऊर्जा, जोखिम लेने की क्षमता, तकनीक/रक्षा/खेल में साहसिक सफलता।',
    negEn: 'Sudden temper bursts, reckless impetuosity, blood pressure spikes and enmities.',
    negHi: 'क्रोध का विस्फोट, जल्दबाज़ी में गलत निर्णय, शत्रुता व रक्त विकार।',
    incEn: 'Sudden injuries, fire/electric mishaps, abrupt job clashes or surgical incidents during Mars/Rahu Dasha.',
    incHi: 'मंगल/राहु दशा में अचानक चोट, बिजली/अग्नि घटना, या तीव्र पारिवारिक/करियर टकराव।',
  },
  'Mars-Ketu': {
    yogaEn: 'Vijaya / Agni-Ketu (Angarak)',
    yogaHi: 'मंगल-केतु (कुज-केतु अंगारक)',
    tone: 'challenging',
    posEn: 'Laser-focused surgery, martial precision, investigative forensics & fearless spiritual tapasya.',
    posHi: 'शल्य चिकित्सा, शोध, मार्शल/सुरक्षा कौशल व निर्भीक साधना।',
    negEn: 'Hidden frustration, sudden cuts/piercing risk or abrupt breaks with younger siblings.',
    negHi: 'दमित आवेग, अचानक कट/चोट का योग व भाई से मतभेद।',
    incEn: 'Surgeries, sharp-object accidents, blood tests or abrupt property/residence changes.',
    incHi: 'अचानक सर्जरी, नुकीली वस्तु से चोट या निवास/भूमि से जुड़े आकस्मिक घटनाक्रम।',
  },
  'Mercury-Jupiter': {
    yogaEn: 'Budha-Guru Vidya Yoga',
    yogaHi: 'बुध-गुरु (विद्या व विवेक योग)',
    tone: 'auspicious',
    posEn: 'Mastery of academia, teaching, publishing, corporate law, financial wisdom & witty poise.',
    posHi: 'उच्च विद्या, शिक्षण, लेखन, बैंकिंग-कानून व व्यवहारिक विवेक में श्रेष्ठ सफलता।',
    negEn: 'Occasional over-explaining or juggling too many theoretical projects.',
    negHi: 'अति-विश्लेषण या एक साथ कई बौद्धिक कार्यों में उलझन।',
    incEn: 'Degrees, authored books, prestigious advisory contracts & judicial/educational honors.',
    incHi: 'उच्च उपाधि, पुस्तक प्रकाशन, शिक्षण पदोन्नति व न्यायिक/बौद्धिक सम्मान।',
  },
  'Mercury-Venus': {
    yogaEn: 'Lakshmi-Narayana Yoga',
    yogaHi: 'लक्ष्मी-नारायण योग (बुध + शुक्र)',
    tone: 'auspicious',
    posEn: 'Prosperous trade, sweet refined speech, design, music/media wealth & marital diplomacy.',
    posHi: 'व्यापारिक समृद्धि, मधुर वाणी, कला-डिजाइन से धन लाभ व सुखी दांपत्य।',
    negEn: 'Flirtatious wit or prioritizing aesthetics over tough confrontation.',
    negHi: 'अति-विनोदप्रियता या कठोर निर्णयों को टालने की प्रवृत्ति।',
    incEn: 'Profitable brand launches, artistic contracts, joyful family weddings & wealth jumps.',
    incHi: 'लाभकारी व्यापारिक अनुबंध, कला से आय, विवाह उत्सव व आर्थिक उन्नति।',
  },
  'Mercury-Saturn': {
    yogaEn: 'Budha-Shani (Shilpa & Audit)',
    yogaHi: 'बुध-शनि युति',
    tone: 'mixed',
    posEn: 'Deep structural coding, architecture, tax law, statistics & meticulous enduring planning.',
    posHi: 'कोडिंग, आर्किटेक्चर, लेखा, कानून व दीर्घकालीन सूक्ष्म योजना में दक्षता।',
    negEn: 'Pessimistic overthinking, slow early speech/confidence or nerve tension.',
    negHi: 'चिंता, संकोच, धीमी पर गहरी सोच व स्नायु/त्वचा संवेदनशीलता।',
    incEn: 'Long legal/research projects paying off after delays; durable asset contracts.',
    incHi: 'विलंब के बाद कानूनी/तकनीकी प्रोजेक्ट की सफलता व स्थायी अनुबंध।',
  },
  'Mercury-Rahu': {
    yogaEn: 'Jada-Buddhi / Tech-Genius Yuti',
    yogaHi: 'बुध-राहु (तीव्र तकनीकी व कूटनीति युति)',
    tone: 'mixed',
    posEn: 'Multilingual coding, digital marketing, foreign commerce, cunning negotiation & stock intuition.',
    posHi: 'डिजिटल मार्केटिंग, कोडिंग, शेयर बाजार, विदेशी व्यापार व चतुर संवाद कला।',
    negEn: 'White lies, contract loopholes, scattered promises or nervous anxiety.',
    negHi: 'चालाकी, अनुबंधों में भ्रम, वाणी में दोहरापन व तंत्रिका थकान।',
    incEn: 'Unexpected tech/foreign deals, media virality, or paper-work disputes needing strict review.',
    incHi: 'विदेशी/टेक सौदों से अचानक लाभ, पर कागजी/बैंकिंग दस्तावेज़ों में विवाद का जोखिम।',
  },
  'Mercury-Ketu': {
    yogaEn: 'Budha-Ketu (Research Intuition)',
    yogaHi: 'बुध-केतु युति',
    tone: 'mixed',
    posEn: 'Coding algorithms, linguistics, astrology, cryptology & incisive root-cause debugging.',
    posHi: 'गहन शोध, ज्योतिष, डेटा/एल्गोरिदम व जड़ तक पहुँचने वाली बुद्धि।',
    negEn: 'Stammering under stress, eccentric humor or sudden abandonment of half-done studies.',
    negHi: 'बोलने में हिचक या पढ़ाई/व्यापार में अचानक अरुचि।',
    incEn: 'Breakthrough research discoveries, stream switches in education, or sudden contract exits.',
    incHi: 'शोध सफलता, शिक्षा की दिशा में अचानक बदलाव या व्यापारिक साझेदारी विच्छेद।',
  },
  'Jupiter-Venus': {
    yogaEn: 'Devaguru-Daityaguru Samagama',
    yogaHi: 'गुरु-शुक्र (द्विज-आचार्य युति)',
    tone: 'auspicious',
    posEn: 'Immense counsel, wealth with grace, educational prosperity, luxury & respected diplomacy.',
    posHi: 'सलाहकारी, शिक्षण, धन-वैभव, उच्च जीवन-शैली व सर्वप्रिय सम्मान।',
    negEn: 'Weight gain, lavish spending, or value clash between idealism and sensual luxury.',
    negHi: 'आदर्श व भोग के बीच द्वंद्व, खर्चीला स्वभाव व शुगर/वजन वृद्धि।',
    incEn: 'Wealth accumulation, luxurious home purchase, happy family celebrations & marriage.',
    incHi: 'संपत्ति व वाहन प्राप्ति, विवाह/मांगलिक कार्य व प्रतिष्ठित सामाजिक सम्मान।',
  },
  'Jupiter-Saturn': {
    yogaEn: 'Brahma-Karma Yoga (Dharma + Shrama)',
    yogaHi: 'गुरु-शनि (ब्रह्म-कर्म योग)',
    tone: 'auspicious',
    posEn: 'Lawmaker, judge, institutional founder, philosophical realism & enduring wealth built systematically.',
    posHi: 'न्याय, प्रशासन, संस्थान निर्माण, आध्यात्मिक-व्यावहारिक संतुलन व स्थायी समृद्धि।',
    negEn: 'Heavy duty burden feeling slow; ideological friction between expansion and caution.',
    negHi: 'जिम्मेदारियों का भारी दबाव और अवसर-विलंब के बीच संघर्ष।',
    incEn: 'Landmark career institution role, judicial appointment, or property foundation in 30s–40s.',
    incHi: '30–40 के दशक में बड़ा संस्थान/न्यायिक पद, दीर्घकालीन प्रतिष्ठा व भूमि निर्माण।',
  },
  'Jupiter-Rahu': {
    yogaEn: 'Guru-Chandal Yoga',
    yogaHi: 'गुरु चांडाल योग',
    tone: 'challenging',
    posEn: 'Iconoclastic pioneer, foreign teaching, unconventional wealth & questioning outdated dogma.',
    posHi: 'विदेशी शिक्षा/धन, लीक से हटकर शोध व रूढ़िवादिता तोड़कर बड़ी उन्नति।',
    negEn: 'Controversies with mentors, greed tempting ethics, or sudden liver/luck instability.',
    negHi: 'गुरु/बड़ों से मतभेद, अनैतिक लोभ का प्रलोभन व भाग्य में उतार-चढ़ाव।',
    incEn: 'Sudden foreign fellowships, advisor betrayal or financial tax-compliance wake-up calls.',
    incHi: 'विदेश गमन, गुरु/सलाहकार से धोखा, या आर्थिक जांच/निवेश संकट की घटनाएँ।',
  },
  'Jupiter-Ketu': {
    yogaEn: 'Ganesha / Tapaswi Yoga',
    yogaHi: 'गुरु-केतु (गणेश / तपस्वी योग)',
    tone: 'auspicious',
    posEn: 'Deep spiritual initiation, Sanskrit/scriptural insight, charitable wisdom & detached success.',
    posHi: 'गहरी आध्यात्मिक दीक्षा, धर्म-ज्ञान, परोपकार व निस्वार्थ प्रतिष्ठा।',
    negEn: 'Disillusionment with worldly bosses/progeny pressure; periodic ascetic withdrawal.',
    negHi: 'भौतिक महत्वाकांक्षा से वैराग्य, संतान/गुरु विषय में चिंता।',
    incEn: 'Spiritual initiation, temple pilgrimage, or major charity/mentorship turning points.',
    incHi: 'मंत्र-दीक्षा, तीर्थयात्रा, या आध्यात्मिक संस्थान से जुड़ाव की बड़ी घटनाएँ।',
  },
  'Venus-Saturn': {
    yogaEn: 'Shukra-Shani (Shilpa & Karma-Prema)',
    yogaHi: 'शुक्र-शनि युति',
    tone: 'mixed',
    posEn: 'Fine luxury craftsmanship, enduring loyal wealth, architecture, sculpture & mature marriage.',
    posHi: 'स्थायी धन, शिल्प/वास्तुकला, गहन निष्ठावान संबंध व उम्र के साथ बढ़ता वैभव।',
    negEn: 'Delayed romance, age-gap or practical marriage compromises; kidney/reproductive fatigue.',
    negHi: 'विवाह में विलंब, जीवनसाथी से उम्र/विचार अंतर व भावनात्मक शुष्कता।',
    incEn: 'Steady wealth/real-estate rise after age 30; testing love lessons rewarding maturity.',
    incHi: '30 वर्ष के बाद स्थायी वाहन-संपत्ति लाभ व विवाह में परिपक्वता के बाद सुख।',
  },
  'Venus-Rahu': {
    yogaEn: 'Maya-Kama / Shukra-Rahu',
    yogaHi: 'शुक्र-राहु युति',
    tone: 'challenging',
    posEn: 'Magnetic film/media fame, luxury imports, foreign romance & intoxicating creativity.',
    posHi: 'ग्लैमर, फिल्म/मीडिया प्रसिद्धि, विदेशी व्यापार व अपार भौतिक आकर्षण।',
    negEn: 'Obsessive love, illusion in partners, lavish overspending & extra-marital allure.',
    negHi: 'रिश्तों में भ्रम, विवाहेतर आकर्षण, अति-व्यय व प्रेम में धोखा संभव।',
    incEn: 'Inter-cultural or unconventional marriage, dramatic breakups, scandals or luxury windfalls.',
    incHi: 'अंतर-जातीय/विदेशी प्रेम, रिश्तों में अचानक टूटन या ग्लैमर-धन में आकस्मिक उछाल।',
  },
  'Venus-Ketu': {
    yogaEn: 'Virakta-Shukra',
    yogaHi: 'शुक्र-केतु युति',
    tone: 'mixed',
    posEn: 'Devotional music/poetry, spiritual aesthetics, healing arts & selfless partnership love.',
    posHi: 'भक्ति संगीत, कला, आध्यात्मिक सौंदर्य व निस्वार्थ प्रेम।',
    negEn: 'Sudden emotional numbness in marriage, partner health care or unconventional courtship.',
    negHi: 'दांपत्य में उदासीनता, संवेदनशील अलगाव या जीवनसाथी का स्वास्थ्य ध्यान।',
    incEn: 'Testing marital detachment periods or artistic transformation away from materialism.',
    incHi: 'विवाह या प्रेम संबंध में अचानक वैराग्य-सी परीक्षा या जीवनशैली परिवर्तन।',
  },
  'Saturn-Rahu': {
    yogaEn: 'Shrapit / Vayu-Shram Dosha',
    yogaHi: 'शनि-राहु (श्रापित दोष युति)',
    tone: 'challenging',
    posEn: 'Unstoppable heavy-machinery, aviation, cyber-security, mass-industrial & research power.',
    posHi: 'तकनीक, विमानन, भारी उद्योग, साइबर सुरक्षा व असाधारण कठिन कार्य करने की क्षमता।',
    negEn: 'Deep chronic stress, joint/nerve fatigue, betrayal by subordinates or ancestral karmic debts.',
    negHi: 'दीर्घकालीन मानसिक दबाव, जोड़ों/नसों का दर्द व कर्मिक बाधाएँ।',
    incEn: 'Sudden career layoffs/restructures, joint/accident scares or persistent legal delays.',
    incHi: 'नौकरी/व्यापार में अचानक झटका, दुर्घटना/पैर चोट या लंबे कानूनी संघर्ष।',
  },
  'Saturn-Ketu': {
    yogaEn: 'Shani-Ketu (Tapasya & Structural Shift)',
    yogaHi: 'शनि-केतु युति',
    tone: 'challenging',
    posEn: 'Monastic discipline, osteopathy/archeology, coding mastery & silent humanitarian karma.',
    posHi: 'कठोर तपस्या, पुरातत्व, गूढ़ विज्ञान, निस्वार्थ सेवा व सूक्ष्म कार्य-कौशल।',
    negEn: 'Sudden loss of job motivation, spine/knee aches or isolation feelings.',
    negHi: 'कार्य से अचानक विरक्ति, घुटना/रीढ़ दर्द व अकेलापन।',
    incEn: 'Sudden career reinventions, spinal/dental surgeries or forced humility lessons.',
    incHi: 'कार्यक्षेत्र में अचानक बदलाव, हड्डी/दांत शल्य-चिकित्सा या आध्यात्मिक मोड़।',
  },
};

function getStelliumClassLabel(count: number): { en: string; hi: string } {
  switch (count) {
    case 2: return { en: '2-Planet Conjunction (Dwiyuti)', hi: 'द्विग्रही युति (2 ग्रह)' };
    case 3: return { en: '3-Planet Conjunction (Triyuti)', hi: 'त्रिग्रही योग (3 ग्रह)' };
    case 4: return { en: '4-Planet Stellium (Chaturgrahi / Pravrajya)', hi: 'चतुर्ग्रही महायोग (4 ग्रह)' };
    case 5: return { en: '5-Planet Stellium (Panchagrahi Yoga)', hi: 'पंचग्रही महायोग (5 ग्रह)' };
    case 6: return { en: '6-Planet Stellium (Shadgrahi Maha-Yoga)', hi: 'षड्ग्रही दुर्लभ योग (6 ग्रह)' };
    default: return { en: '7-Planet Stellium (Saptagrahi Cosmic Focus)', hi: 'सप्तग्रही अति-दुर्लभ योग (7 ग्रह)' };
  }
}

const HOUSE_TRIGGER_EN = [
  'identity, physical health, head & life trajectory',
  'family wealth, speech, eyes/teeth & dietary stability',
  'courage, younger siblings, short trips, shoulders & contracts',
  'mother, home, vehicles, heart & emotional peace',
  'children, higher intelligence, love affairs & speculation',
  'debts, chronic ailments, enemies, courts & daily job stress',
  'spouse, marriage harmony, business partnerships & public life',
  'accidents, surgeries, hidden research, inheritance & sudden shocks',
  'father, luck, higher law, pilgrimages & distant travel',
  'career peak, authority, promotions, status & karmic duty',
  'income surges, elder siblings, networks & realized ambitions',
  'hospitalization, expenses, foreign relocation, sleep & moksha',
];

const HOUSE_TRIGGER_HI = [
  'व्यक्तित्व, स्वास्थ्य, सिर व जीवन दिशा',
  'संचित धन, वाणी, कुटुंब व नेत्र/मुख',
  'पराक्रम, छोटे भाई-बहन, यात्रा व अनुबंध',
  'माता, गृह-संपत्ति, वाहन व हृदय शांति',
  'संतान, शिक्षा, प्रेम व शेयर/बौद्धिक सृजन',
  'रोग, ऋण, शत्रु, मुकदमे व नौकरी संघर्ष',
  'विवाह, जीवनसाथी, व्यापार साझेदारी व जनसंपर्क',
  'दुर्घटना, सर्जरी, आयु, पैतृक धन व आकस्मिक घटनाएँ',
  'पिता, भाग्य, धर्म, उच्च शिक्षा व लंबी यात्रा',
  'करियर, पद-प्रतिष्ठा, प्रशासन व कर्म फल',
  'नियमित आय, बड़े भाई-बहन, मित्र व लाभ',
  'विदेश वास, अस्पताल/खर्च, शयन सुख व मोक्ष',
];

const NAT_BENEFICS = new Set<NineGrahaId>(['Jupiter', 'Venus', 'Mercury', 'Moon']);

function buildMultiPlanetAnalysis(
  planets: NineGrahaId[],
  houseNumber: number,
  signIndex: number,
  degreeSpanDeg: number,
  warPairs: string[],
  pairInsights: PairYutiInsight[]
): Omit<ChartYutiGroup, 'labelEn' | 'labelHi' | 'signIndex' | 'signNameEn' | 'signNameHi' | 'houseNumber' | 'planets' | 'degreeSpanDeg' | 'warPairs' | 'pairInsights' | 'source'> {
  const count = planets.length;
  const benefics = planets.filter((p) => NAT_BENEFICS.has(p));
  const malefics = planets.filter((p) => !NAT_BENEFICS.has(p));
  const tightOrb = degreeSpanDeg <= 8;
  const hIdx = Math.max(0, Math.min(11, houseNumber - 1));
  const houseEn = HOUSE_TRIGGER_EN[hIdx];
  const houseHi = HOUSE_TRIGGER_HI[hIdx];
  const signEn = SIGNS[signIndex].name;
  const signHi = SIGN_HI[signIndex];

  if (count === 2 && pairInsights[0]) {
    const pi = pairInsights[0];
    return {
      count,
      headlineEn: `${pi.yogaNameEn} in H${houseNumber} (${signEn})`,
      headlineHi: `${houseNumber}वें भाव (${signHi}) में ${pi.yogaNameHi}`,
      positiveEn: `${pi.positiveEn} Focuses blessing/energy onto ${houseEn}.`,
      positiveHi: `${pi.positiveHi} इसका मुख्य प्रभाव ${houseHi} पर पड़ता है।`,
      negativeEn: `${pi.negativeEn}${warPairs.length ? ` [Graha Yuddha alert: ${warPairs.join(', ')}]` : ''}`,
      negativeHi: `${pi.negativeHi}${warPairs.length ? ` [ग्रह युद्ध प्रभाव: ${warPairs.join(', ')}]` : ''}`,
      incidentRiskEn: pi.incidentEn,
      incidentRiskHi: pi.incidentHi,
      remedyEn: `Keep conduct ethical for both lords; strengthen the weaker planet via its weekday charity and peaceful mantra.`,
      remedyHi: `दोनों ग्रहों के वार के अनुसार दान-मंत्र करें और कमजोर ग्रह को संतुलित रखें।`,
    };
  }

  const isPravrajya = count >= 4;
  const beneficHeavy = benefics.length > malefics.length;
  const mixedTone = benefics.length > 0 && malefics.length > 0;

  const pNamesEn = planets.join(' + ');
  const pNamesHi = planets.map((p) => PLANET_HI[p]).join(' + ');

  const headlineEn =
    count >= 5
      ? `Extraordinary ${count}-Planet Stellium (${pNamesEn}) — Massive Karmic Gravity in H${houseNumber}`
      : isPravrajya
        ? `Chaturgrahi Pravrajya / Power Cluster (${pNamesEn}) in H${houseNumber}`
        : `Triyuti Three-Force Fusion (${pNamesEn}) in H${houseNumber}`;

  const headlineHi =
    count >= 5
      ? `अति-विशिष्ट ${count}-ग्रही महायुति (${pNamesHi}) — ${houseNumber}वें भाव में कर्मिक केंद्र`
      : isPravrajya
        ? `चतुर्ग्रही प्रव्रज्या / महायोग (${pNamesHi}) — ${houseNumber}वें भाव में`
        : `त्रिग्रही त्रिकोण-सदृश युति (${pNamesHi}) — ${houseNumber}वें भाव में`;

  const positiveEn = `${count} planetary energies fuse in ${signEn} (${houseNumber}th House), making ${houseEn} the central destiny engine of life. ${beneficHeavy ? 'Benefic dominance confers rare wisdom, wealth accumulation, charisma and rescue during hard times.' : 'High energy intensity produces extraordinary ambition, self-made resilience and mastery when channeled cleanly.'}${count >= 4 ? ' Classically evokes Pravrajya/Sannyasa brilliance — intense single-minded mission or institutional leadership.' : ''}`;

  const positiveHi = `${count} ग्रहों का ${signHi} (${houseNumber}वें भाव) में मिलन ${houseHi} को पूरे जीवन की सबसे प्रमुख धुरी बना देता है। ${beneficHeavy ? 'शुभ ग्रहों के बहुमत से असाधारण ज्ञान, धन, यश व कठिन समय में दैवीय सुरक्षा मिलती है।' : 'अत्यधिक ऊर्जा से जातक स्व-निर्मित पराक्रम, दृढ़ संकल्प व विशिष्ट क्षेत्र में महारत हासिल करता है।'}${count >= 4 ? ' 4+ ग्रहों की युति व्यक्ति को किसी बड़े मिशन, शोध या आध्यात्मिक/प्रशासनिक नेतृत्व की ओर ले जाती है।' : ''}`;

  const negativeEn = `${tightOrb ? 'Tight degree orb creates intense internal friction and mutual combustion/eclipse pressure.' : 'Wide sign blend creates competing desires around the same house.'} ${mixedTone ? `Clash between benefics (${benefics.join(', ')}) and malefics (${malefics.join(', ')}) can swing results between high peaks and sudden drops.` : 'Heavy malefic weight can trigger impatience, burnout, or strained close ties around this house.'}${warPairs.length ? ` Planetary War (${warPairs.join(', ')}) weakens the loser planet sharply.` : ''}`;

  const negativeHi = `${tightOrb ? 'ग्रहों की अंश दूरी कम होने से अस्त व आपसी दबाव से मानसिक/शारीरिक तनाव संभव है।' : 'एक ही भाव पर कई ग्रहों के दबाव से निर्णयों में अंतर्द्वंद्व रहता है।'} ${mixedTone ? `शुभ (${benefics.map((p) => PLANET_HI[p]).join(', ')}) व क्रूर (${malefics.map((p) => PLANET_HI[p]).join(', ')}) ग्रहों के मिश्रण से जीवन में अचानक बड़े उतार-चढ़ाव आते हैं।` : 'कठोर ग्रहों के कारण अति-परिश्रम, विवाद या पारिवारिक तनाव पर संयम आवश्यक है।'}`;

  const hasAccidentPlanets =
    malefics.includes('Mars') || malefics.includes('Saturn') || malefics.includes('Rahu') || malefics.includes('Ketu');
  const incidentRiskEn =
    hasAccidentPlanets && [1, 4, 6, 7, 8, 12].includes(houseNumber)
      ? `Concrete Event Alert: In Dasha/Antardasha of planets in this ${count}-planet group, watch for sudden ${houseNumber === 8 ? 'accidents, surgery, tax/inheritance shocks' : houseNumber === 4 ? 'vehicle mishaps or home disruption' : houseNumber === 6 ? 'litigation, acute health inflammation or debt conflict' : houseNumber === 7 ? 'partnership/marriage crisis or legal split' : 'health emergencies, relocation or sudden turning points'}. Positive Dasha brings equally sudden status breakthroughs!`
      : `Synchronized Dasha Trigger: Whenever any planet in this ${count}-planet Yuti runs its Mahadasha/Antardasha, the whole cluster fires simultaneously — triggering landmark career shifts, relocation, awards, or family reorganization around ${houseEn}.`;

  const incidentRiskHi =
    hasAccidentPlanets && [1, 4, 6, 7, 8, 12].includes(houseNumber)
      ? `प्रमुख घटना व सावधानी चेतावनी: इस ${count}-ग्रही समूह की दशा-अंतर्दशा में ${houseNumber === 8 ? 'वाहन/दुर्घटना, सर्जरी या पैतृक/आकस्मिक संकट' : houseNumber === 4 ? 'वाहन सावधानी, माता का स्वास्थ्य या गृह परिवर्तन' : houseNumber === 6 ? 'मुकदमा, कर्ज तनाव या तीव्र स्वास्थ्य समस्या' : houseNumber === 7 ? 'दांपत्य/साझेदारी संकट या अलगाव की परीक्षा' : 'स्वास्थ्य आकस्मिकता, विदेश/निवास परिवर्तन'} के स्पष्ट घटनाक्रम बनते हैं — वहीं शुभ अंतर में बड़ी छलांग भी लगती है।`
      : `दशा-सक्रियण घटनाएँ: इस ${count}-ग्रही युति के किसी भी ग्रह की महादशा/अंतर्दशा आने पर एक साथ ${houseHi} से जुड़ी कई बड़ी घटनाएँ (पदोन्नति, स्थान परिवर्तन, परिवार या धन विस्तार) घटित होती हैं।`;

  return {
    count,
    headlineEn,
    headlineHi,
    positiveEn,
    positiveHi,
    negativeEn,
    negativeHi,
    incidentRiskEn,
    incidentRiskHi,
    remedyEn: `Offer regular prayer to the strongest benefic/Lord of ${signEn}; donate weekly on the ruling day of any afflicted malefic to harmonize the cluster.`,
    remedyHi: `${signHi} राशि के स्वामी व इस युति के सबसे शुभ ग्रह की उपासना करें तथा पीड़ित क्रूर ग्रह के वार को दान कर समूह को शांत रखें।`,
  };
}

function buildPairList(planets: NineGrahaId[]): PairYutiInsight[] {
  const out: PairYutiInsight[] = [];
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const a = planets[i];
      const b = planets[j];
      const key = pairKey(a, b);
      const kb = PAIR_KB[key];
      if (!kb) continue;
      out.push({
        pair: [a, b],
        yogaNameEn: kb.yogaEn,
        yogaNameHi: kb.yogaHi,
        tone: kb.tone,
        positiveEn: kb.posEn,
        positiveHi: kb.posHi,
        negativeEn: kb.negEn,
        negativeHi: kb.negHi,
        incidentEn: kb.incEn,
        incidentHi: kb.incHi,
      });
    }
  }
  return out;
}

export function computeChartYutiReport(chart: ChartData): YutiReport {
  const bySign = new Map<number, BodyPosition[]>();
  const grahas = chart.planets.filter((p) => NINE_GRAHAS.includes(p.id as NineGrahaId));
  for (const p of grahas) {
    if (!bySign.has(p.signIndex)) bySign.set(p.signIndex, []);
    bySign.get(p.signIndex)!.push(p);
  }

  const groups: ChartYutiGroup[] = [];
  const soloPlanets: NineGrahaId[] = [];

  for (const [signIndex, list] of bySign.entries()) {
    if (list.length === 1) {
      soloPlanets.push(list[0].id as NineGrahaId);
      continue;
    }
    const sorted = [...list].sort((a, b) => a.degreeInSign - b.degreeInSign);
    const planets = sorted.map((p) => p.id as NineGrahaId);
    const count = Math.min(7, planets.length);
    const degreeSpanDeg =
      Math.round((sorted[sorted.length - 1].degreeInSign - sorted[0].degreeInSign) * 100) / 100;

    // Planetary war check (< 1° between non-luminary true planets)
    const warPairs: string[] = [];
    const warEligible = ['Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
    for (let i = 0; i < sorted.length; i++) {
      for (let j = i + 1; j < sorted.length; j++) {
        if (
          warEligible.includes(sorted[i].id) &&
          warEligible.includes(sorted[j].id) &&
          angularDiffDeg(sorted[i].longitude, sorted[j].longitude) <= 1.0
        ) {
          warPairs.push(`${sorted[i].id} vs ${sorted[j].id}`);
        }
      }
    }

    const houseNumber = sorted[0].rasiHouseNumber;
    const pairInsights = buildPairList(planets);
    const lbl = getStelliumClassLabel(count);
    const core = buildMultiPlanetAnalysis(
      planets,
      houseNumber,
      signIndex,
      degreeSpanDeg,
      warPairs,
      pairInsights
    );

    groups.push({
      ...core,
      labelEn: lbl.en,
      labelHi: lbl.hi,
      signIndex,
      signNameEn: SIGNS[signIndex].name,
      signNameHi: SIGN_HI[signIndex],
      houseNumber,
      planets,
      degreeSpanDeg,
      warPairs,
      pairInsights,
      source: 'Brihat Jataka · Saravali · Phaladeepika (Nabhasa/Yuti)',
    });
  }

  groups.sort((a, b) => b.count - a.count || a.houseNumber - b.houseNumber);
  const maxConjunctionCount = groups.length ? Math.max(...groups.map((g) => g.count)) : 1;

  const summaryEn = groups.length
    ? `Chart forms ${groups.length} Yuti group${groups.length > 1 ? 's' : ''} (largest: ${maxConjunctionCount}-planet Yuti in House ${groups[0].houseNumber} ${groups[0].signNameEn}); ${soloPlanets.length} planets sit alone in separate signs.`
    : `All 9 Grahas occupy separate signs (independent expression with no crowded conjunction stress).`;

  const summaryHi = groups.length
    ? `कुंडली में कुल ${groups.length} ग्रह युतियाँ बनी हैं (सबसे बड़ी: ${groups[0].houseNumber}वें भाव ${groups[0].signNameHi} में ${maxConjunctionCount}-ग्रही युति); ${soloPlanets.length} ग्रह स्वतंत्र राशियों में हैं।`
    : `सभी 9 ग्रह अलग-अलग राशियों में स्वतंत्र हैं — किसी भाव में भीड़-भाड़ जनित युति तनाव नहीं है।`;

  return { groups, maxConjunctionCount, soloPlanets, summaryEn, summaryHi };
}

export function inspectCustomYuti(
  rawPlanets: NineGrahaId[],
  houseNumber = 1,
  signIndex = 0
): ChartYutiGroup | null {
  const unique = Array.from(new Set(rawPlanets)).filter(
    (p) => NINE_GRAHAS.includes(p)
  );
  // Filter simultaneous Rahu+Ketu if user picks 7+ and both selected? Well users might test 7 out of 8/9: just keep exact chosen up to 7 (note Rahu & Ketu are always 180° apart in nature, so warn if both included)
  const planets = unique.slice(0, 7);
  if (planets.length < 2) return null;

  const pairInsights = buildPairList(planets);
  const lbl = getStelliumClassLabel(planets.length);
  const core = buildMultiPlanetAnalysis(planets, houseNumber, signIndex, 6.0, [], pairInsights);
  const hasImpossibleNodes = planets.includes('Rahu') && planets.includes('Ketu');

  return {
    ...core,
    negativeEn: hasImpossibleNodes
      ? `${core.negativeEn} (Astronomical note: Rahu and Ketu are always 180° opposite in a real chart, never physically in the same sign.)`
      : core.negativeEn,
    negativeHi: hasImpossibleNodes
      ? `${core.negativeHi} (खगोलीय नियम: वास्तविक कुंडली में राहु और केतु सदा 180° आमने-सामने होते हैं, एक साथ नहीं।)`
      : core.negativeHi,
    labelEn: lbl.en,
    labelHi: lbl.hi,
    signIndex,
    signNameEn: SIGNS[signIndex].name,
    signNameHi: SIGN_HI[signIndex],
    houseNumber,
    planets,
    degreeSpanDeg: 6.0,
    warPairs: [],
    pairInsights,
    source: 'Saravali · Brihat Jataka · Nabhasa Stellium Sutras',
  };
}
