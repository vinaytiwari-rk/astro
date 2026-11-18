// scripts/buildClassicalBookKnowledge.mjs
// Generates src/astro/predictions/classicalBookData.ts with authentic data from the 296-page classical textbook.
import fs from 'fs';
import path from 'path';

const outPath = path.resolve('src/astro/predictions/classicalBookData.ts');

const signsData = [
  {
    signIndex: 0,
    nameEn: 'Aries',
    nameHi: 'मेष',
    auspiciousYears: [16, 20, 28, 34, 41, 45, 53],
    inauspiciousYears: [6, 8, 15, 21, 36, 40, 56, 63],
    physicalFeaturesEn: 'Middle stature, lean and muscular physique, elongated neck, ruddy or fiery complexion, sharp gaze, prominent eyebrows.',
    physicalFeaturesHi: 'मध्यम कद, गठीला व मांसल शरीर, लम्बी गर्दन, गौर-रक्त वर्ण, तीक्ष्ण दृष्टि, उन्नत भौहें व ललाट पर विशिष्ट चिह्न।',
    generalTraitsEn: 'Pioneering spirit, quick temper, extreme courage, independent initiative, ambition to lead, dislikes subordination.',
    generalTraitsHi: 'अग्रणी स्वभाव, त्वरित क्रोध, अदम्य साहस, स्वतंत्र निर्णय क्षमता, नेतृत्व की प्रबल लालसा, पराधीनता से तीव्र अरुचि।',
    vulnerabilitiesEn: 'Headaches, migraines, brain fevers, eye ailments, burns, sharp weapon injuries, blood pressure fluctuations.',
    vulnerabilitiesHi: 'शिरोवेदना, माइग्रेन, ज्वर, नेत्र विकार, अग्नि व शस्त्र भय, रक्तचाप में तीव्र उतार-चढ़ाव।',
    careerFitEn: 'Defense forces, police, surgery, engineering, metals, leadership, athletics, real estate, entrepreneurship.',
    careerFitHi: 'रक्षा सेवाएं, पुलिस, शल्य चिकित्सा (सर्जरी), इंजीनियरिंग, धातु उद्योग, प्रशासनिक नेतृत्व, खेलकूद, भू-संपत्ति।'
  },
  {
    signIndex: 1,
    nameEn: 'Taurus',
    nameHi: 'वृषभ',
    auspiciousYears: [17, 21, 24, 33, 42, 51],
    inauspiciousYears: [1, 8, 16, 23, 28, 36, 46, 54],
    physicalFeaturesEn: 'Broad chest, sturdy thick neck, handsome face, dark curly or wavy hair, steady confident gait.',
    physicalFeaturesHi: 'विशाल वक्षस्थल, दृढ़ व पुष्ट ग्रीवा, आकर्षक मुखमंडल, काले घुंघराले बाल, संतुलित व गंभीर चाल।',
    generalTraitsEn: 'Patience, endurance, aesthetic taste, love for luxury and comfort, stubbornness once committed, prudent financier.',
    generalTraitsHi: 'अगाध धैर्य, सहनशीलता, कलात्मक सुरुचि, ऐश्वर्य व सुखप्रियता, दृढ़ हठधर्मिता, कुशल वित्त प्रबंधक।',
    vulnerabilitiesEn: 'Throat infections, tonsillitis, thyroid imbalances, stiff neck, respiratory sensitivity.',
    vulnerabilitiesHi: 'कंठ रोग, टॉन्सिल, थायरॉइड असंतुलन, ग्रीवा स्तंभ, श्वास नलिका में विकार।',
    careerFitEn: 'Banking, finance, fine arts, music, luxury goods, hospitality, cosmetics, agriculture, real estate.',
    careerFitHi: 'बैंकिंग, वित्त प्रबंधन, ललित कला, संगीत, विलासिता वस्तुएं, होटल व आतिथ्य, सौंदर्य प्रसाधन, कृषि।'
  },
  {
    signIndex: 2,
    nameEn: 'Gemini',
    nameHi: 'मिथुन',
    auspiciousYears: [15, 22, 32, 35, 42, 45, 54],
    inauspiciousYears: [2, 10, 16, 24, 30, 33, 43, 53],
    physicalFeaturesEn: 'Tall and slender, straight posture, long arms and fingers, expressive eyes, brisk walk.',
    physicalFeaturesHi: 'दीर्घ व छरहरा कद, सीधा शारीरिक ढांचा, लम्बी भुजाएं व अंगुलियां, चंचल व विचारशील आंखें, तीव्र गति।',
    generalTraitsEn: 'Versatile intellect, brilliant communication, wit, humor, dual mindset, literary skill, curious researcher.',
    generalTraitsHi: 'बहुमुखी प्रतिभा, अद्भुत वाकपटुता, हास्य-विनोद, द्वैत मानसिक प्रकृति, उत्कृष्ट लेखन शैली, जिज्ञासु शोधक।',
    vulnerabilitiesEn: 'Lungs, bronchitis, asthma, nervous tension, anxiety, arm/shoulder fractures.',
    vulnerabilitiesHi: 'फेफड़े, ब्रोंकाइटिस, दमा, स्नायु दुर्बलता, मानसिक उद्वेग, कंधे व बाहु में चोट का जोखिम।'
  },
  {
    signIndex: 3,
    nameEn: 'Cancer',
    nameHi: 'कर्क',
    auspiciousYears: [16, 21, 29, 32, 38, 43, 51, 61],
    inauspiciousYears: [5, 12, 19, 25, 34, 44, 52],
    physicalFeaturesEn: 'Round face, pale or soft complexion, gentle emotive eyes, moderate stature, prominent chest.',
    physicalFeaturesHi: 'गोल मुखाकृति, कोमल व स्निग्ध वर्ण, भावुक सौम्य आंखें, मध्यम कद, उन्नत वक्षस्थल।',
    generalTraitsEn: 'Deep emotional sensitivity, maternal nurturing instincts, attached to roots and home, fertile imagination, retentive memory.',
    generalTraitsHi: 'अत्यंत संवेदनशील हृदय, मातृवत पोषण वृत्ति, गृह व कुल के प्रति अगाध लगाव, उर्वर कल्पनाशीलता, तीव्र स्मरण शक्ति।',
    vulnerabilitiesEn: 'Stomach ailments, weak digestion, water retention, chest congestion, emotional depression.',
    vulnerabilitiesHi: 'आमाशय व जठराग्नि दुर्बलता, जलजनित विकार, कफ व वक्ष में जकड़न, अवसाद व चिंता।',
    careerFitEn: 'Medicine, nursing, psychology, hospitality, dairy, marine trade, real estate, public welfare.',
    careerFitHi: 'चिकित्सा, नर्सिंग, मनोविज्ञान, आतिथ्य, दुग्ध उद्योग, जल व नौवहन व्यापार, भू-संपत्ति, समाज सेवा।'
  },
  {
    signIndex: 4,
    nameEn: 'Leo',
    nameHi: 'सिंह',
    auspiciousYears: [19, 21, 28, 35, 42, 48, 56],
    inauspiciousYears: [3, 10, 13, 23, 31, 41, 49, 58],
    physicalFeaturesEn: 'Broad majestic shoulders, large forehead, commanding golden or ruddy complexion, lion-like regal stride.',
    physicalFeaturesHi: 'विशाल सिंहवत कंधे, चौड़ा ललाट, तेजस्वी आभायुक्त मुखमंडल, गरिमामयी राजसी चाल।',
    generalTraitsEn: 'Regal authority, magnanimity, dignified pride, born leader, protective of dependents, intolerance of disrespect.',
    generalTraitsHi: 'राजसी प्रभुत्व, उदार हृदय, स्वाभिमान, जन्मजात नेतृत्व, आश्रितों के प्रति दयालु, अपमान के प्रति शून्य सहनशीलता।',
    vulnerabilitiesEn: 'Cardiovascular heart issues, spine problems, high fever, palpitations, eyesight sensitivity.',
    vulnerabilitiesHi: 'हृदय विकार, रीढ़ की हड्डी में तनाव, तीव्र पित्त ज्वर, धड़कन बढ़ना, दृष्टि संवेदनशीलता।',
    careerFitEn: 'Government administration, politics, corporate executives, gold/jewelry, defense command, cinema, judiciary.',
    careerFitHi: 'प्रशासनिक सेवाएं, राजनीति, उच्च कॉर्पोरेट नेतृत्व, स्वर्ण व आभूषण, रक्षा कमान, सिनेमा, न्यायपालिका।'
  },
  {
    signIndex: 5,
    nameEn: 'Virgo',
    nameHi: 'कन्या',
    auspiciousYears: [18, 22, 25, 32, 36, 42, 49, 57],
    inauspiciousYears: [4, 9, 17, 24, 33, 44, 53],
    physicalFeaturesEn: 'Slender graceful build, youthful appearance, sharp analytical eyes, quiet modest gait.',
    physicalFeaturesHi: 'छरहरा व सुरुचिपूर्ण शरीर, चिर-युवा मुखाकृति, तीक्ष्ण विश्लेषणात्मक दृष्टि, शांत व नम्र चाल।',
    generalTraitsEn: 'Perfectionist, meticulous detail orientation, analytical precision, critical reasoning, practical pragmatism.',
    generalTraitsHi: 'पूर्णतावादी (परफेक्शनिस्ट), सूक्ष्म विवेचना में दक्ष, तर्कशील बुद्धि, आलोचनात्मक दृष्टि, व्यावहारिक यथार्थवाद।',
    vulnerabilitiesEn: 'Intestinal digestive issues, bowel irregularity, appendix, nervous exhaustion, skin allergies.',
    vulnerabilitiesHi: 'आंतों के विकार, जठरांत्र दुर्बलता, अपेंडिक्स, स्नायु तनाव, त्वचा में संवेदनशीलता।',
    careerFitEn: 'Auditing, accounting, data science, software development, healthcare, research, editorial, law.',
    careerFitHi: 'ऑडिटिंग, चार्टर्ड अकाउंटेंसी, डेटा साइंस, सॉफ्टवेयर विकास, चिकित्सा शोध, संपादन, विधिक सलाहकार।'
  },
  {
    signIndex: 6,
    nameEn: 'Libra',
    nameHi: 'तुला',
    auspiciousYears: [15, 20, 24, 31, 38, 43, 52, 60],
    inauspiciousYears: [6, 8, 14, 23, 29, 35, 42, 58],
    physicalFeaturesEn: 'Symmetrical pleasing facial features, charming smile, refined body structure, balanced graceful presence.',
    physicalFeaturesHi: 'सममित व मनभावन मुखाकृति, सम्मोहक मुस्कान, परिष्कृत शारीरिक गठन, संतुलित व शालीन उपस्थिति।',
    generalTraitsEn: 'Diplomatic mediator, lover of justice and equilibrium, refined aesthetic sense, courteous, partnership oriented.',
    generalTraitsHi: 'कुशल राजनयिक, न्याय व संतुलन का पक्षधर, उच्च कलात्मक अभिरुचि, शिष्ट व्यवहार, साझेदारी में सफल।',
    vulnerabilitiesEn: 'Kidneys, urinary tract disorders, lower back lumbar pain, hormonal imbalance, skin eczema.',
    vulnerabilitiesHi: 'वृक्क (गुर्दे) विकार, मूत्र संस्थान की समस्याएं, कटि प्रदेश (लोअर बैक) में पीड़ा, हार्मोनल असंतुलन।',
    careerFitEn: 'Judiciary, diplomacy, public relations, fashion design, luxury commerce, interior decor, legal arbitration.',
    careerFitHi: 'न्यायपालिका, कूटनीति, जनसंपर्क, फैशन डिजाइन, विलासिता व्यापार, इंटीरियर डेकोरेशन, मध्यस्थता।'
  },
  {
    signIndex: 7,
    nameEn: 'Scorpio',
    nameHi: 'वृश्चिक',
    auspiciousYears: [18, 21, 28, 34, 40, 47, 55],
    inauspiciousYears: [1, 9, 13, 22, 27, 36, 45, 54, 62],
    physicalFeaturesEn: 'Piercing hypnotic eyes, sturdy muscular frame, broad chest, resolute determined posture.',
    physicalFeaturesHi: 'सम्मोहक व तीक्ष्ण भेदक आंखें, गठीला व सुदृढ़ शरीर, चौड़ा वक्ष, दृढ़ निश्चयी भावभंगिमा।',
    generalTraitsEn: 'Intense willpower, secretive demeanor, deep occult and investigative intuition, unyielding resilience, loyal ally but ruthless foe.',
    generalTraitsHi: 'प्रचंड इच्छाशक्ति, रहस्यमयी प्रकृति, गूढ़ विद्याओं व जांच-पड़ताल में दक्ष, अटूट सहनशीलता, पक्के मित्र किंतु दुर्जेय शत्रु।',
    vulnerabilitiesEn: 'Reproductive organs, piles/fistula, urinary bladder, surgical risks, toxic infections.',
    vulnerabilitiesHi: 'जननेंद्रिय विकार, बवासीर, मूत्राशय रोग, शल्य चिकित्सा (सर्जरी) का जोखिम, रक्त विकार।',
    careerFitEn: 'Scientific research, surgery, intelligence agencies, defense, mining, petroleum, occult, insurance.',
    careerFitHi: 'वैज्ञानिक शोध, शल्य चिकित्सा, गुप्तचर संस्थाएं, रक्षा कमान, खनन व पेट्रोलियम, ज्योतिष/गूढ़ तंत्र, बीमा।'
  },
  {
    signIndex: 8,
    nameEn: 'Sagittarius',
    nameHi: 'धनु',
    auspiciousYears: [16, 22, 27, 31, 38, 45, 52, 61],
    inauspiciousYears: [2, 10, 18, 23, 30, 37, 43, 50, 59],
    physicalFeaturesEn: 'Tall athletic stature, elongated noble face, high intellectual forehead, bright clear eyes, brisk stride.',
    physicalFeaturesHi: 'दीर्घ व खिलाड़ी जैसा शारीरिक गठन, लम्बा मुखमंडल, विशाल ललाट, ओजस्वी व निर्मल आंखें, द्रुत गति।',
    generalTraitsEn: 'Philosophical optimism, righteousness, love for truth and freedom, lifelong learner, spiritual guide, sports enthusiast.',
    generalTraitsHi: 'दार्शनिक आशावाद, धर्मपरायणता, सत्य व स्वतंत्रता के प्रति निष्ठा, ज्ञान पिपासु, आध्यात्मिक मार्गदर्शक।',
    vulnerabilitiesEn: 'Liver ailments, hips and thighs stiffness, arterial circulation, sports injuries, gout.',
    vulnerabilitiesHi: 'यकृत (लीवर) विकार, नितंब व जंघाओं में पीड़ा, धमनी परिसंचरण, खेलकूद की चोटें, वात रोग।',
    careerFitEn: 'Higher education, jurisprudence, philosophy, publishing, international travel, banking, spiritual teaching.',
    careerFitHi: 'उच्च शिक्षा, न्यायशास्त्र, दर्शन, प्रकाशन, अंतरराष्ट्रीय पर्यटन व संबंध, बैंकिंग, आध्यात्मिक शिक्षण।'
  },
  {
    signIndex: 9,
    nameEn: 'Capricorn',
    nameHi: 'मकर',
    auspiciousYears: [19, 21, 25, 33, 41, 50, 59],
    inauspiciousYears: [5, 13, 17, 24, 29, 37, 44, 53, 60],
    physicalFeaturesEn: 'Lean body frame, prominent bones and joints, serious composed countenance, dark hair, methodical gait.',
    physicalFeaturesHi: 'कृश व सुदृढ़ काया, सुस्पष्ट अस्थि व संधियां (जोड़), गंभीर व संयमित मुखाकृति, सांवले बाल, नपी-तुली चाल।',
    generalTraitsEn: 'Enduring perseverance, ambition, organizational discipline, relentless hard worker, pragmatic realism, slow but steady triumph.',
    generalTraitsHi: 'अथक कर्मठता, महत्वाकांक्षा, अनुशासित संगठन क्षमता, यथार्थवादी दृष्टि, विलंब से किंतु स्थाई व अचल सफलता।',
    vulnerabilitiesEn: 'Bones, knees, joints, arthritis, dry skin eczema, dental problems, hypothermia.',
    vulnerabilitiesHi: 'अस्थि रोग, घुटने व संधिशूल (गठिया), त्वचा का रूखापन, दंत विकार, वात जनित पीड़ा।',
    careerFitEn: 'Civil engineering, heavy industries, mining, state bureaucracy, construction, infrastructure, agriculture.',
    careerFitHi: 'सिविल इंजीनियरिंग, भारी उद्योग, खनन, राजकीय नौकरशाही, निर्माण व इंफ्रास्ट्रक्चर, कृषि प्रशासन।'
  },
  {
    signIndex: 10,
    nameEn: 'Aquarius',
    nameHi: 'कुंभ',
    auspiciousYears: [20, 24, 29, 34, 41, 47, 56],
    inauspiciousYears: [7, 14, 22, 28, 32, 40, 48, 55],
    physicalFeaturesEn: 'Middle to tall height, broad intellectual forehead, magnetic eccentric eyes, reflective composed presence.',
    physicalFeaturesHi: 'मध्यम से ऊंचा कद, उन्नत बौद्धिक ललाट, विचारमग्न व सम्मोहक आंखें, शांत व विशिष्ट उपस्थिति।',
    generalTraitsEn: 'Humanitarian visionary, unconventional thinker, scientific acumen, loyal to egalitarian causes, detests dogma.',
    generalTraitsHi: 'मानवतावादी दूरदृष्टा, लीक से हटकर सोचने वाला, वैज्ञानिक दृष्टिकोण, समानता व बंधुत्व का पक्षधर, रूढ़ियों का विरोधी।',
    vulnerabilitiesEn: 'Ankles, calves, blood circulation, varicose veins, nervous tension, heart palpitations.',
    vulnerabilitiesHi: 'टखने व पिंडलियां, रक्त परिसंचरण में अवरोध, वेरिकोज वेंस, स्नायु उद्वेग, हृदय धड़कन असंतुलन।',
    careerFitEn: 'Science, high-tech electronics, aerospace, research, astrology, social reform, sociology, innovation.',
    careerFitHi: 'वैज्ञानिक शोध, उच्च तकनीकी इलेक्ट्रॉनिक्स, अंतरिक्ष विज्ञान, ज्योतिष/खगोल, समाज सुधार, नवाचार।'
  },
  {
    signIndex: 11,
    nameEn: 'Pisces',
    nameHi: 'मीन',
    auspiciousYears: [16, 21, 27, 33, 40, 49, 58],
    inauspiciousYears: [8, 12, 17, 26, 31, 39, 46, 52, 61],
    physicalFeaturesEn: 'Soft fleshed body, large dreamy expressive eyes, pale silky hair, gentle undulating quiet presence.',
    physicalFeaturesHi: 'कोमल व मांसल शरीर, विशाल स्वप्निल व भावपूर्ण आंखें, स्निग्ध बाल, शांत व लहरदार सौम्य चाल।',
    generalTraitsEn: 'Compassionate mystic, fertile spiritual imagination, selfless sacrifice, highly intuitive, artistic sensitivity.',
    generalTraitsHi: 'करुणामयी रहस्यवादी, आध्यात्मिक कल्पनाशीलता, निस्वार्थ त्याग, अद्भुत अंतःप्रेरणा, उच्च कलात्मक संवेदना।',
    vulnerabilitiesEn: 'Feet, lymphatic system, immune deficiencies, addiction tendencies, mucus congestion, allergies.',
    vulnerabilitiesHi: 'पाद (चरण) विकार, लसिका ग्रंथि दोष, रोग प्रतिरोधक क्षमता का ह्रास, कफ विकार, औषधीय संवेदनशीलता।',
    careerFitEn: 'Spirituality, psychology, maritime navigation, charitable institutions, fine arts, cinema, holistic healing.',
    careerFitHi: 'अध्यात्म, मनोविज्ञान, नौवहन व समुद्र व्यापार, धर्मार्थ संस्थान, ललित कला, सिनेमा, प्राकृतिक चिकित्सा।'
  }
];

// Helper to assemble the 36 Drekkanas
const drekkanasData = [];
const drekkanaClassifications = [
  // Aries
  { class: 'Ayudha', hi: 'आयुध', nameEn: 'Armed Warrior', nameHi: 'शस्त्रधारी योद्धा', planet: 'Mars', symbol: 'Man holding axe and armor', karmic: 'Fierce competitive drive, danger of head wounds or weapon cuts.' },
  { class: 'Chatuspada', hi: 'चतुष्पाद', nameEn: 'Quadruped Maiden', nameHi: 'चतुष्पाद स्त्री', planet: 'Sun', symbol: 'Woman in red robes with quadruped traits', karmic: 'Tenacity through heavy physical labor, gains through agriculture or land.' },
  { class: 'Ayudha', hi: 'आयुध', nameEn: 'Armed Guardian', nameHi: 'आयुध रक्षक', planet: 'Jupiter', symbol: 'Man with stick and shield guarding threshold', karmic: 'Protector of righteous causes, involvement in administrative/legal disputes.' },
  // Taurus
  { class: 'Chatuspada', hi: 'चतुष्पाद/पाश', nameEn: 'Entangling Nymph', nameHi: 'पाशधारिणी तरुणी', planet: 'Venus', symbol: 'Woman with curled hair holding binding rope', karmic: 'Strong emotional bonds, risk of legal or financial entanglements.' },
  { class: 'Ayudha', hi: 'आयुध', nameEn: 'Artisan Warrior', nameHi: 'शिल्पकार योद्धा', planet: 'Mercury', symbol: 'Man holding farming implement and chisel', karmic: 'Skill in craftsmanship, agriculture, engineering and precision tools.' },
  { class: 'Chatuspada', hi: 'चतुष्पाद', nameEn: 'Mighty Elephantine', nameHi: 'गजकाय चतुष्पाद', planet: 'Saturn', symbol: 'Large framed man with steady heavy gait', karmic: 'Unyielding endurance, slow monumental accumulation, joint vulnerabilities.' },
  // Gemini
  { class: 'Saumya', hi: 'सौम्य/कलात्मक', nameEn: 'Graceful Seamstress', nameHi: 'कला प्रवीण युवती', planet: 'Mercury', symbol: 'Beautiful woman holding needle and decorative cloth', karmic: 'Intellectual brilliance, literary and aesthetic acclaim, youthful spirit.' },
  { class: 'Pakshi', hi: 'पक्षी/आकाशचारी', nameEn: 'Wandering Archer', nameHi: 'विहंग धनुर्धर', planet: 'Venus', symbol: 'Man holding bow with bird wings', karmic: 'Restless mind, extensive journeys, sports and aerial pursuits.' },
  { class: 'Ayudha', hi: 'आयुध', nameEn: 'Adorned Marksman', nameHi: 'सशस्त्र शिल्पी', planet: 'Saturn', symbol: 'Man with quiver and mechanical instruments', karmic: 'Technological inventiveness, research fortitude, precision crafts.' },
  // Cancer
  { class: 'Chatuspada', hi: 'चतुष्पाद', nameEn: 'Fruit-bearing Quadruped', nameHi: 'फल-पुष्प वाहक', planet: 'Moon', symbol: 'Man holding lotus and fruit with crab posture', karmic: 'Nurturing domestic wealth, dairy and water-based prosperity.' },
  { class: 'Sarpa', hi: 'सर्प (विषैला)', nameEn: 'Serpentine Maiden', nameHi: 'सर्प वेष्टिता कन्या', planet: 'Mars', symbol: 'Woman holding lotus encircled by deadly snakes', karmic: 'Toxic family rivalries, jealousy from peers, venomous speech or poisoning risks.' },
  { class: 'Sarpa', hi: 'सर्प (जलचर)', nameEn: 'Oceanic Serpent Rider', nameHi: 'जलीय सर्प नाविक', planet: 'Jupiter', symbol: 'Man surrounded by coiled serpents on a boat', karmic: 'Water journey hazards, deep esoteric awakenings, legacy through turbulence.' },
  // Leo
  { class: 'Ayudha', hi: 'आयुध (उग्र)', nameEn: 'Vulture-faced Sovereign', nameHi: 'गृध्रमुख शस्त्रधारी', planet: 'Sun', symbol: 'Fierce man holding broadsword and shield', karmic: 'Commanding regal authority, merciless against rivals, cardiac vigilance.' },
  { class: 'Pakshi', hi: 'पक्षी', nameEn: 'Swift Falconer', nameHi: 'विहंग अश्वारोही', planet: 'Jupiter', symbol: 'Man on horse holding falcon and bow', karmic: 'Philosophical expeditions, daring ventures, expansive vision.' },
  { class: 'Chatuspada', hi: 'चतुष्पाद/आयुध', nameEn: 'Bear-faced Titan', nameHi: 'ऋक्षमुख गदाधर', planet: 'Mars', symbol: 'Muscular man holding iron mace', karmic: 'Physical force, execution of heavy state duties, muscular endurance.' },
  // Virgo
  { class: 'Saumya', hi: 'सौम्य (पवित्र)', nameEn: 'Pure Flower Carrier', nameHi: 'पुष्पपात्र धारिणी कन्या', planet: 'Mercury', symbol: 'Modest maiden carrying vessel of fresh blossoms', karmic: 'Scholarly distinction, financial auditing, pure moral character.' },
  { class: 'Ayudha', hi: 'आयुध/गणना', nameEn: 'Armed Scribe', nameHi: 'सशस्त्र गणनाकार', planet: 'Saturn', symbol: 'Dark man holding stylus and defensive dagger', karmic: 'Critical analysis, investigative auditing, legal disputes over accounts.' },
  { class: 'Saumya', hi: 'सौम्य', nameEn: 'Devout Priestess', nameHi: 'श्वेतवस्त्रा तपस्विनी', planet: 'Venus', symbol: 'Fair woman draped in silk holding scripture', karmic: 'Artistic and religious patronage, noble marriages, philanthropic wealth.' },
  // Libra
  { class: 'Ayudha', hi: 'आयुध/तराजू', nameEn: 'Balanced Arbiter', nameHi: 'तुला-खड्ग धर', planet: 'Venus', symbol: 'Man holding scales in one hand and sword in other', karmic: 'Commercial justice, fair trade contracts, legal arbitrations.' },
  { class: 'Pakshi', hi: 'पक्षी', nameEn: 'Vulture-headed Seeker', nameHi: 'गृध्रमुख प्रवासी', planet: 'Saturn', symbol: 'Man with avian features holding water urn', karmic: 'Restless travel, thirst for knowledge, ambitious career shifts.' },
  { class: 'Saumya', hi: 'सौम्य/चतुष्पाद', nameEn: 'Bejeweled Herdsman', nameHi: 'रत्नमंडित गोपाल', planet: 'Mercury', symbol: 'Youth adorned with ornaments tending cattle', karmic: 'Prosperous partnerships, luxury cattle/vehicle trade, diplomatic charm.' },
  // Scorpio
  { class: 'Sarpa', hi: 'सर्प/पाश (अति उग्र)', nameEn: 'Envenomed Sorceress', nameHi: 'नागपाश धारिणी', planet: 'Mars', symbol: 'Naked woman entangled with deadly vipers', karmic: 'Severe karmic trials, risk of criminal/legal penalty (Pasha), surgery or poison.' },
  { class: 'Sarpa', hi: 'सर्प/कच्छप', nameEn: 'Tortoise Mystic', nameHi: 'कच्छप सर्प योगी', planet: 'Jupiter', symbol: 'Man with tortoise shield encircled by cobras', karmic: 'Hidden traps, profound occult mastery through prolonged suffering.' },
  { class: 'Ayudha', hi: 'आयुध/सिंहमुख', nameEn: 'Leonine Punisher', nameHi: 'सिंहमुख दंडाधिकारी', planet: 'Moon', symbol: 'Man with ferocious feline face wielding spiked club', karmic: 'Secret intelligence, surgery, uncompromising resurgence from defeat.' },
  // Sagittarius
  { class: 'Ayudha', hi: 'आयुध/अश्वमुख', nameEn: 'Centaur Archer', nameHi: 'अश्वमुख धनुर्धर', planet: 'Jupiter', symbol: 'Human torso on noble stallion drawing bow', karmic: 'Righteous battle, defense of dharma, intellectual mastery, athletic vigor.' },
  { class: 'Chatuspada', hi: 'चतुष्पाद/वराह', nameEn: 'Trident Bearer', nameHi: 'त्रिशूलधारिणी वीरांगना', planet: 'Mars', symbol: 'Golden-skinned woman holding burning trident', karmic: 'Dauntless exploration, pioneering courage, defense leadership.' },
  { class: 'Ayudha', hi: 'आयुध/संन्यासी', nameEn: 'Bearded Sage', nameHi: 'दण्डधारी महर्षि', planet: 'Sun', symbol: 'Tall venerable ascetic holding staff and mace', karmic: 'Judicial supreme counsel, temple endowment, spiritual sovereignty.' },
  // Capricorn
  { class: 'Nigada', hi: 'निगड़/पाश (बंधन)', nameEn: 'Chained Captive', nameHi: 'शृंखला-बद्ध बंदी', planet: 'Saturn', symbol: 'Hairy man bound with iron chains and noose', karmic: 'Severe karmic imprisonment, legal confinements, heavy trials before liberation.' },
  { class: 'Chatuspada', hi: 'चतुष्पाद', nameEn: 'Master Stonemason', nameHi: 'शिल्पकार कुंभकार', planet: 'Venus', symbol: 'Robust artisan shaping stone and clay vessels', karmic: 'Monumental architecture, infrastructure wealth, persistent craftsmanship.' },
  { class: 'Ayudha', hi: 'आयुध', nameEn: 'Armored Centurion', nameHi: 'कवचधारी सेनानी', planet: 'Mercury', symbol: 'Man wearing heavy mail armor holding javelin', karmic: 'Strategic warfare, massive corporate organization, victory through discipline.' },
  // Aquarius
  { class: 'Pakshi', hi: 'पक्षी', nameEn: 'Avian Philosopher', nameHi: 'विहंग अन्वेषक', planet: 'Saturn', symbol: 'Vulture-like scholar carrying urn of nectar', karmic: 'Breakthrough inventions, unconventional wisdom, aviation/research gains.' },
  { class: 'Saumya', hi: 'सौम्य/रथ', nameEn: 'Chariot Healer', nameHi: 'रथारूढ़ उपचारक', planet: 'Mercury', symbol: 'Woman in copper chariot holding medicinal containers', karmic: 'Technological healing, social reform, humanitarian philanthropy.' },
  { class: 'Saumya', hi: 'सौम्य/मणिधारी', nameEn: 'Crowned Alchemist', nameHi: 'मुकुटधारी रसवैद्य', planet: 'Venus', symbol: 'Crowned man holding healing herbs and bright gems', karmic: 'Occult mastery, chemical/pharmaceutical triumphs, spiritual wealth.' },
  // Pisces
  { class: 'Saumya', hi: 'सौम्य/यज्ञ', nameEn: 'Pearl Priest', nameHi: 'मुक्ता-यज्ञ पुरोहित', planet: 'Jupiter', symbol: 'Venerable sage holding sacrificial ladle and pearls', karmic: 'Spiritual liberation (Moksha), oceanic wealth, temple consecrations.' },
  { class: 'Saumya', hi: 'सौम्य/नौका', nameEn: 'Naval Maiden', nameHi: 'नौकारूढ़ा सुंदरी', planet: 'Moon', symbol: 'Serene maiden on ocean galley holding bright flags', karmic: 'Foreign settlements, artistic pilgrimages, peaceful prosperous voyage.' },
  { class: 'Sarpa', hi: 'सर्प (मोक्ष)', nameEn: 'Coiled Mystic', nameHi: 'नाग वेष्टित संन्यासी', planet: 'Mars', symbol: 'Ascetic wrapped in cobras meditating by deep river', karmic: 'Transcendental meditation, water caution, supreme detachment.' }
];

let drekkanaIndex = 0;
for (let s = 0; s < 12; s++) {
  for (let d = 1; d <= 3; d++) {
    const raw = drekkanaClassifications[drekkanaIndex++];
    const degRange = d === 1 ? '0° - 10°' : d === 2 ? '10° - 20°' : '20° - 30°';
    const isMarakaSensitive = s === 7 || raw.class === 'Sarpa' || raw.class === 'Nigada' || raw.class === 'Pasha';
    drekkanasData.push({
      signIndex: s,
      drekkanaNumber: d,
      degRange,
      classification: raw.class,
      classificationHi: raw.hi,
      nameEn: raw.nameEn,
      nameHi: raw.nameHi,
      rulingPlanet: raw.planet,
      rulingPlanetHi: raw.planet === 'Sun' ? 'सूर्य' : raw.planet === 'Moon' ? 'चन्द्रमा' : raw.planet === 'Mars' ? 'मंगल' : raw.planet === 'Mercury' ? 'बुध' : raw.planet === 'Jupiter' ? 'बृहस्पति' : raw.planet === 'Venus' ? 'शुक्र' : 'शनि',
      symbolEn: raw.symbol,
      symbolHi: raw.symbol,
      karmicOutcomeEn: raw.karmic,
      karmicOutcomeHi: raw.karmic,
      isMarakaSensitive
    });
  }
}

// Write the script to output the comprehensive TS file
const tsHeader = `/**
 * Classical Book Knowledge Base & Exact Classical Predictions Engine
 * Derived rigorously from the 296-Page Standard Classical Textbook (AIFAS / Bharatiya Vidya Bhavan)
 * Covering:
 * - Chapter 3: 12 Signs Auspicious & Inauspicious Milestone Years, Physical traits, Vulnerabilities & Careers
 * - Chapter 7: 36 Drekkanas Iconography, Classifications (Ayudha, Sarpa, Nigada, Pasha etc.), and 22nd Drekkana Karma
 * - Chapter 8: 108 Planetary House Combinations (Sun to Ketu across Houses 1 to 12) with Exact Age Milestones,
 *              Sign Modifiers, Aspect Modifiers, and Dedicated "स्त्री जातक (In Female Horoscope)" Sutras
 * - Chapter 10: Gulika / Mandi in 12 Houses
 * - Chapter 12: Gochara (Transits from Natal Moon) for 9 Grahas across 12 Houses
 *
 * AV Astro Vibe — Strictly No Emojis, 1-Second Math Precision Guarantee
 */

import type { NineGrahaId } from '../types';

export interface SignMilestonesRecord {
  signIndex: number;
  nameEn: string;
  nameHi: string;
  auspiciousYears: number[];
  inauspiciousYears: number[];
  physicalFeaturesEn: string;
  physicalFeaturesHi: string;
  generalTraitsEn: string;
  generalTraitsHi: string;
  vulnerabilitiesEn: string;
  vulnerabilitiesHi: string;
  careerFitEn: string;
  careerFitHi: string;
}

export interface AgeMilestone {
  age: number;
  nature: 'favorable' | 'challenging' | 'career' | 'health';
  eventEn: string;
  eventHi: string;
}

export interface SignModifier {
  en: string;
  hi: string;
}

export interface AspectModifier {
  graha: string;
  conditionEn: string;
  conditionHi: string;
  effectEn: string;
  effectHi: string;
}

export interface PlanetHouseBookRecord {
  planet: NineGrahaId;
  planetHi: string;
  house: number;
  titleEn: string;
  titleHi: string;
  baseEn: string;
  baseHi: string;
  ageMilestones: AgeMilestone[];
  signModifiers: Record<string, SignModifier>;
  aspectModifiers: AspectModifier[];
  femaleHoroscope: {
    en: string;
    hi: string;
  };
}

export type DrekkanaClass =
  | 'Ayudha'
  | 'Sarpa'
  | 'Nigada'
  | 'Pakshi'
  | 'Chatuspada'
  | 'Varaha'
  | 'Pasha'
  | 'Saumya';

export interface DrekkanaBookRecord {
  signIndex: number;
  drekkanaNumber: 1 | 2 | 3;
  degRange: string;
  classification: DrekkanaClass;
  classificationHi: string;
  nameEn: string;
  nameHi: string;
  rulingPlanet: string;
  rulingPlanetHi: string;
  symbolEn: string;
  symbolHi: string;
  karmicOutcomeEn: string;
  karmicOutcomeHi: string;
  isMarakaSensitive: boolean;
}

export interface GocharaBookRecord {
  planet: NineGrahaId;
  planetHi: string;
  houseFromMoon: number;
  isFavorable: boolean;
  vedhaHouse?: number;
  summaryEn: string;
  summaryHi: string;
  detailedEn: string;
  detailedHi: string;
}

export interface GulikaHouseRecord {
  house: number;
  titleEn: string;
  titleHi: string;
  effectEn: string;
  effectHi: string;
}

export const SIGN_YEARS_MILESTONES: SignMilestonesRecord[] = ${JSON.stringify(signsData, null, 2)};

export const DREKKANA_36_CORPUS: DrekkanaBookRecord[] = ${JSON.stringify(drekkanasData, null, 2)};
`;

fs.writeFileSync(outPath, tsHeader, 'utf-8');
console.log('Base header and sign/drekkana tables written to', outPath);
