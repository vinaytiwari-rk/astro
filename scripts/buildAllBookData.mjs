// scripts/buildAllBookData.mjs
import fs from 'fs';
import path from 'path';

const outPath = path.resolve('src/astro/predictions/classicalBookData.ts');

const PLANETS = [
  { id: 'Sun', hi: 'सूर्य' },
  { id: 'Moon', hi: 'चन्द्रमा' },
  { id: 'Mars', hi: 'मंगल' },
  { id: 'Mercury', hi: 'बुध' },
  { id: 'Jupiter', hi: 'बृहस्पति (गुरु)' },
  { id: 'Venus', hi: 'शुक्र' },
  { id: 'Saturn', hi: 'शनि' },
  { id: 'Rahu', hi: 'राहु' },
  { id: 'Ketu', hi: 'केतु' }
];

const HOUSE_NAMES = [
  { h: 1, en: '1st House (Tanu Bhava)', hi: 'प्रथम भाव (तनु भाव - लग्न)' },
  { h: 2, en: '2nd House (Dhana Bhava)', hi: 'द्वितीय भाव (धन भाव)' },
  { h: 3, en: '3rd House (Sahaja Bhava)', hi: 'तृतीय भाव (सहज व पराक्रम भाव)' },
  { h: 4, en: '4th House (Sukha Bhava)', hi: 'चतुर्थ भाव (सुख व मातृ भाव)' },
  { h: 5, en: '5th House (Suta Bhava)', hi: 'पंचम भाव (सुत व बुद्धि भाव)' },
  { h: 6, en: '6th House (Ripu Bhava)', hi: 'षष्ठ भाव (रिपु व रोग भाव)' },
  { h: 7, en: '7th House (Kalatra Bhava)', hi: 'सप्तम भाव (कलत्र व जाया भाव)' },
  { h: 8, en: '8th House (Ayu Bhava)', hi: 'अष्टम भाव (आयु व रंध्र भाव)' },
  { h: 9, en: '9th House (Dharma Bhava)', hi: 'नवम भाव (धर्म व भाग्य भाव)' },
  { h: 10, en: '10th House (Karma Bhava)', hi: 'दशम भाव (कर्म व राज्य भाव)' },
  { h: 11, en: '11th House (Labha Bhava)', hi: 'एकादश भाव (लाभ व आय भाव)' },
  { h: 12, en: '12th House (Vyaya Bhava)', hi: 'द्वादश भाव (व्यय व मोक्ष भाव)' }
];

// Complete 108 planet house definitions extracted from Chapter 8
const planetHouseDefinitions = {
  Sun: [
    {
      house: 1,
      baseEn: 'Native possesses strong vitality, commanding presence, dignified ego, and courageous demeanor. Prone to bilious heat, thinning hair, and sensitivity of the eyes. Proud, values self-respect, dislikes subordination.',
      baseHi: 'जातक तेजस्वी, स्वाभिमानी, साहसी तथा प्रभावशाली व्यक्तित्व का स्वामी होता है। पित्त प्रकृति, ललाट पर तेज, नेत्रों में संवेदनशीलता तथा केश अल्प हो सकते हैं। पराधीनता से घृणा तथा सम्मान के प्रति अत्यंत सजग।',
      milestones: [
        { age: 3, nature: 'health', eventEn: 'Vulnerability to childhood fevers or eye irritation.', eventHi: 'बाल्यावस्था में पित्त ज्वर या नेत्र विकार की संवेदनशीलता।' },
        { age: 16, nature: 'career', eventEn: 'Dawn of independent thinking, academic prominence and leadership among peers.', eventHi: 'स्वतंत्र विचार, विद्या में विशिष्ट पहचान व साथियों में नेतृत्व का उदय।' },
        { age: 22, nature: 'favorable', eventEn: 'Major milestone in career initiation, governmental recognition or patronage.', eventHi: 'आजीविका में महत्वपूर्ण उन्नति, राजकीय पक्ष या उच्चाधिकारियों से सहयोग।' }
      ],
      signMod: {
        Aries: { en: 'Exalted: Supreme administrative success, robust health, commanding status.', hi: 'उच्च राशि: उच्च प्रशासनिक पद, दीर्घायु, अत्यंत तेजस्वी तथा प्रतिष्ठित।' },
        Libra: { en: 'Debilitated: Low self-esteem, eye ailments, heart palpitations, struggles with authorities.', hi: 'नीच राशि: आत्मबल की कमी, नेत्र दोष, हृदय की धड़कन, उच्चाधिकारियों से कलह।' },
        Leo: { en: 'Own Sign: Regal confidence, magnetic leadership, respected by rulers and public.', hi: 'स्वराशि: राजसी दृढ़ता, चुंबकीय नेतृत्व, शासन व समाज में पूज्य।' }
      },
      aspectMod: [
        { graha: 'Saturn', conditionEn: 'Aspected by Saturn', conditionHi: 'शनि की दृष्टि', effectEn: 'Bodily strain, eye trouble, conflicts with superiors, melancholic temperament.', effectHi: 'शारीरिक कष्ट, नेत्र पीड़ा, उच्चाधिकारियों से मतभेद, गंभीर व उदास प्रकृति।' },
        { graha: 'Jupiter', conditionEn: 'Aspected by Jupiter', conditionHi: 'गुरु की दृष्टि', effectEn: 'High righteousness, divine protection, judicial authority, moral nobility.', effectHi: 'परम धार्मिकता, दैवीय रक्षा, न्यायप्रियता तथा समाज में गुरुतुल्य सम्मान।' }
      ],
      femaleEn: 'In female horoscope, native possesses commanding personality, high self-esteem, leadership in domestic and social spheres; requires care regarding bile and digestive warmth.',
      femaleHi: 'स्त्री जातक में अत्यंत स्वाभिमानी, परिवार व समाज में प्रमुखता, दृढ़ संकल्प शक्ति; पित्त तथा पाचन संवेदनशीलता पर ध्यान आवश्यक।'
    },
    {
      house: 2,
      baseEn: 'Native earns wealth through state, royal favor, or authoritative speech. Speech is frank, forceful, and occasionally harsh. Vulnerability to dental, facial, or right eye ailments. Fluctuations in ancestral assets.',
      baseHi: 'जातक को शासन, प्रशासन या अधिकारपूर्ण वाणी द्वारा धन लाभ होता है। वाणी स्पष्ट, तीव्र तथा कभी-कभी कठोर हो सकती है। मुख, दंत अथवा दाहिने नेत्र में संवेदनशीलता। पैतृक संपत्ति में विवाद या उतार-चढ़ाव।',
      milestones: [
        { age: 20, nature: 'career', eventEn: 'Beginning of financial independence and authority.', eventHi: 'आर्थिक आत्मनिर्भरता व आजीविका का प्रारंभ।' },
        { age: 25, nature: 'challenging', eventEn: 'Financial dispute or speech-induced domestic friction.', eventHi: 'वाणी या धन के लेन-देन को लेकर पारिवारिक विवाद।' }
      ],
      signMod: {
        Aries: { en: 'Exalted: Enormous wealth accumulation through administrative and corporate authority.', hi: 'उच्च राशि: प्रशासनिक व राजकीय सत्ता से विपुल धनोपार्जन।' },
        Libra: { en: 'Debilitated: Losses through penalties, eye defects, harsh words causing separation.', hi: 'नीच राशि: दंड अथवा मुकदमों में धनहानि, नेत्र विकार, कटु वाणी से कुटुंब कलह।' }
      },
      aspectMod: [
        { graha: 'Venus', conditionEn: 'Aspected by Venus', conditionHi: 'शुक्र की दृष्टि', effectEn: 'Eloquent and refined speech, wealth through luxury and arts.', effectHi: 'वाणी में आकर्षण, कला व आभूषणों से धन संचय।' }
      ],
      femaleEn: 'In female horoscope, straightforward speech, high dignity in speech, guardian of family traditions, pride in ancestral lineage.',
      femaleHi: 'स्त्री जातक में खरी व निर्भीक वाणी, कुल मर्यादा की संरक्षिका, स्वाभिमान से पूर्ण, पारिवारिक वित्त पर नियंत्रण।'
    },
    {
      house: 3,
      baseEn: 'Extremely courageous, valorous, heroic initiative, determined willpower. Friction with or fewer younger brothers. High renown in sports, military, engineering, or entrepreneurial drive.',
      baseHi: 'अत्यंत पराक्रमी, साहसी, दृढ़ संकल्पी तथा पुरुषार्थी। छोटे भाइयों से मतभेद अथवा उनकी संख्या अल्प। खेलकूद, सेना, इंजीनियरिंग या स्वतंत्र व्यवसाय में ख्याति।',
      milestones: [
        { age: 20, nature: 'favorable', eventEn: 'Tremendous rise in bravery, courage, and successful independent enterprises.', eventHi: 'अदम्य पराक्रम, साहस तथा स्वतंत्र उपक्रमों में विजय।' },
        { age: 28, nature: 'career', eventEn: 'Triumph over competition, major expansion of influence.', eventHi: 'प्रतिस्पर्धा पर पूर्ण विजय, प्रभाव क्षेत्र का व्यापक विस्तार।' }
      ],
      signMod: {
        Aries: { en: 'Exalted: Supreme heroism, military victory, undisputed leadership.', hi: 'उच्च राशि: परम पराक्रम, सैन्य/प्रशासनिक विजय, अविवादित नेतृत्व।' },
        Libra: { en: 'Debilitated: Strained courage, sibling disputes, respiratory or arm vulnerabilities.', hi: 'नीच राशि: असमय आवेश, सहोदरों से तनाव, भुजाओं में संवेदनशीलता।' }
      },
      aspectMod: [
        { graha: 'Mars', conditionEn: 'With or aspected by Mars', conditionHi: 'मंगल की युति या दृष्टि', effectEn: 'Fierce military bravery, high technical skill, unyielding fighter.', effectHi: 'अद्वितीय युद्ध कौशल, तकनीकी दक्षता, किसी से न दबने वाला स्वभाव।' }
      ],
      femaleEn: 'In female horoscope, fearless demeanor, protects family like an armor, skilled in manual arts and administrative organizing.',
      femaleHi: 'स्त्री जातक में अत्यंत निर्भीक, परिवार की ढाल बनकर खड़ी रहने वाली, प्रशासनिक व संगठनात्मक कार्यों में निपुण।'
    },
    {
      house: 4,
      baseEn: 'Deep concern for paternal property, mental restlessness, distance from birthplace. Mother’s health requires attention. Paternal heritage may undergo scrutiny. Noble vehicles and dwellings in later life.',
      baseHi: 'पैतृक संपत्ति को लेकर सजगता, मानसिक चंचलता, जन्मभूमि से दूर निवास का योग। माता के स्वास्थ्य के प्रति सतर्कता आवश्यक। जीवन के उत्तरार्ध में उच्च वाहन व भवन सुख।',
      milestones: [
        { age: 22, nature: 'career', eventEn: 'Relocation away from home for education or professional settlement.', eventHi: 'शिक्षा या आजीविका हेतु गृहत्याग व नवीन स्थान पर वास।' },
        { age: 30, nature: 'challenging', eventEn: 'Paternal or property transition, emotional turning point.', eventHi: 'पैतृक संपत्ति या पिता के जीवन में महत्वपूर्ण मोड़ व भावुकता।' }
      ],
      signMod: {
        Leo: { en: 'Own Sign: Grand mansion, royal comforts, dignified mother, peace of mind.', hi: 'स्वराशि: विशाल प्रासाद, राजसी सुख, प्रतिष्ठित माता, आत्मिक शांति।' },
        Libra: { en: 'Debilitated: Domestic discord, vehicle hazards, heart/chest heaviness.', hi: 'नीच राशि: गृह क्लेश, वाहन से कष्ट, वक्षस्थल या हृदय में भारीपन।' }
      },
      aspectMod: [
        { graha: 'Jupiter', conditionEn: 'Aspected by Jupiter', conditionHi: 'गुरु की दृष्टि', effectEn: 'Sanctified residence, maternal longevity, broad philanthropic heart.', effectHi: 'पवित्र व समृद्ध गृह, माता की दीर्घायु, उदार व धार्मिक हृदय।' }
      ],
      femaleEn: 'In female horoscope, highly dignified domestic head, strong will in managing property, maternal duties executed with strict discipline.',
      femaleHi: 'स्त्री जातक में घर की मुख्य स्तंभ, संपत्ति प्रबंधन में दक्ष, अनुशासनप्रिय माता, मर्यादाओं का कड़ाई से पालन।'
    },
    {
      house: 5,
      baseEn: 'Sharp intellect, interest in political philosophy, mantra shastra, or administration. Delay or fewer male progeny. Prone to digestive heat. Authoritative teacher or counsellor.',
      baseHi: 'तीक्ष्ण प्रज्ञा, राजनीति, मंत्र शास्त्र तथा प्रशासन में गहरी रुचि। संतानोत्पत्ति में विलंब या अल्प संतान योग। जठराग्नि तीव्र, उदर में गर्मी। विद्वान मार्गदर्शक।',
      milestones: [
        { age: 16, nature: 'favorable', eventEn: 'Exceptional academic distinction and intellectual brilliance.', eventHi: 'विद्या व बौद्धिक प्रतियोगिताओं में असाधारण सफलता।' },
        { age: 28, nature: 'favorable', eventEn: 'Birth of worthy child or major publication/intellectual creation.', eventHi: 'सुलक्षण संतान का जन्म अथवा बौद्धिक कृति का प्रकाशन।' }
      ],
      signMod: {
        Aries: { en: 'Exalted: Genius intelligence, royal advisor, high merit in competitive examinations.', hi: 'उच्च राशि: कुशाग्र बुद्धि, राजकीय सलाहकार, प्रशासनिक परीक्षाओं में सर्वोच्च स्थान।' },
        Libra: { en: 'Debilitated: Disturbed studies, abdominal ailments, anxiety regarding children.', hi: 'नीच राशि: विद्या में बाधा, उदर विकार, संतान पक्ष से चिंता।' }
      },
      aspectMod: [
        { graha: 'Jupiter', conditionEn: 'Aspected by Jupiter', conditionHi: 'गुरु की दृष्टि', effectEn: 'Supreme wisdom, noble children, mastery of sacred scriptures.', effectHi: 'परम मेधा, सदाचारी संतान, शास्त्रों व नीतियों में पारंगत।' }
      ],
      femaleEn: 'In female horoscope, highly intellectual and spiritual, strict yet devoted mother, requires care regarding digestion and pregnancy.',
      femaleHi: 'स्त्री जातक में कुशाग्र मेधा, धार्मिक वृत्ति, संतान के प्रति कर्तव्यनिष्ठ; गर्भावस्था व उदर स्वास्थ्य के प्रति सजगता आवश्यक।'
    },
    {
      house: 6,
      baseEn: 'Supreme Shatruhanta (crusher of adversaries), unyielding physical resistance, triumphs in litigation, state examinations, and debts. Gains from maternal uncles. Strong digestive fire.',
      baseHi: 'परम शत्रुहंता, रोगों से लड़ने की अद्भुत क्षमता, मुकदमों व प्रतियोगी परीक्षाओं में विजय। ननिहाल पक्ष से लाभ। तीव्र जठराग्नि, विरोधियों पर पूर्ण दबदबा।',
      milestones: [
        { age: 21, nature: 'career', eventEn: 'Grand victory in competitive trials or selection for public duty.', eventHi: 'प्रतियोगी परीक्षा या चयन में अभूतपूर्व सफलता।' },
        { age: 28, nature: 'favorable', eventEn: 'Complete liquidation of debts and triumph over opponents.', eventHi: 'ऋण मुक्ति तथा न्यायालयीन विवादों में निर्णायक विजय।' }
      ],
      signMod: {
        Aries: { en: 'Exalted: Complete annihilation of rivals, supreme administrative power in judiciary or defense.', hi: 'उच्च राशि: शत्रुओं का समूल नाश, सेना या न्याय प्रशासन में सर्वोच्च धाक।' },
        Libra: { en: 'Debilitated: Chronic fever, friction with subordinates, eye or kidney vulnerability.', hi: 'नीच राशि: पित्त ज्वर, अधीनस्थों से विवाद, नेत्र या गुर्दे की संवेदनशीलता।' }
      },
      aspectMod: [
        { graha: 'Saturn', conditionEn: 'With Saturn', conditionHi: 'शनि से युति', effectEn: 'Persistent chronic challenges followed by hard-earned ultimate triumph.', effectHi: 'दीर्घकालिक संघर्ष के उपरांत कठोर परिश्रम से स्थाई विजय।' }
      ],
      femaleEn: 'In female horoscope, robust resilience, overcomes workplace hurdles easily, dominant over competitors, prone to acidity.',
      femaleHi: 'स्त्री जातक में अपार कार्यक्षमता, कार्यक्षेत्र की बाधाओं को परास्त करने वाली, प्रतिस्पर्धियों पर हावी, पित्त संवेदनशीलता।'
    },
    {
      house: 7,
      baseEn: 'Spouse is proud, dignified, belongs to a respectable family. High ego in partnerships, frequent travel for spouse. Marital adjustments required due to mutual authoritative temperaments.',
      baseHi: 'जीवनसाथी स्वाभिमानी, तेजस्वी तथा कुलीन परिवार से। साझेदारी में स्वाभिमान का टकराव, जीवनसाथी के निरंतर प्रवास का योग। परस्पर सम्मान से ही दांपत्य सामंजस्य संभव।',
      milestones: [
        { age: 24, nature: 'challenging', eventEn: 'Marital negotiations or partnership adjustments requiring tact.', eventHi: 'विवाह वार्ता या साझेदारी में अहं का टकराव व समन्वय की परीक्षा।' },
        { age: 31, nature: 'favorable', eventEn: 'Consolidation of public reputation and marital stability.', eventHi: 'सामाजिक प्रतिष्ठा में वृद्धि तथा दांपत्य जीवन में स्थिरता।' }
      ],
      signMod: {
        Aries: { en: 'Exalted: Spouse from aristocratic or ruling background, high public stature.', hi: 'उच्च राशि: जीवनसाथी उच्च पदस्थ या कुलीन, समाज में ऊंचा मान-सम्मान।' },
        Libra: { en: 'Debilitated: Marital bitterness, separation risks, spouse fragile health.', hi: 'नीच राशि: दांपत्य कलह, अलगाव का भय, जीवनसाथी का दुर्बल स्वास्थ्य।' }
      },
      aspectMod: [
        { graha: 'Jupiter', conditionEn: 'Aspected by Jupiter', conditionHi: 'गुरु की दृष्टि', effectEn: 'Marital longevity secured, noble and devoted spouse, harmonious partnership.', effectHi: 'दांपत्य की पूर्ण सुरक्षा, सदाचारी व विद्वान जीवनसाथी, सुखी गृहस्थी।' }
      ],
      femaleEn: 'In female horoscope, husband is authoritative, government employee or businessman; patience needed to avoid domestic ego friction.',
      femaleHi: 'स्त्री जातक में पति तेजस्वी, अधिकार संपन्न या शासनाधीन; गृहस्थी में शांति हेतु परस्पर अहं के त्याग की आवश्यकता।'
    },
    {
      house: 8,
      baseEn: 'Few children, eye weaknesses, sudden hazards from fire, heat, or government scrutiny. Deep occult interests, research orientation, unexpected inheritance or tax litigation.',
      baseHi: 'अल्प संतति, नेत्रों में दुर्बलता, अग्नि, पित्त अथवा राजकीय जांच का आकस्मिक जोखिम। गूढ़ विद्याओं व शोध में रुचि, अचानक पैतृक धन या कर विवाद।',
      milestones: [
        { age: 22, nature: 'health', eventEn: 'Vulnerability to high fever, accident, or ocular strain.', eventHi: 'तीव्र ज्वर, दुर्घटना अथवा नेत्र कष्ट का सतर्कता वर्ष।' },
        { age: 33, nature: 'favorable', eventEn: 'Sudden financial inheritance, secret research breakthrough.', eventHi: 'आकस्मिक वसीयत या गुप्त शोध में बड़ी सफलता।' }
      ],
      signMod: {
        Aries: { en: 'Exalted: Strong longevity, sudden legacies through government or royal grants.', hi: 'उच्च राशि: दीर्घायु, राजकीय पक्ष से अचानक विपुल संपत्ति प्राप्ति।' },
        Libra: { en: 'Debilitated: Weakened longevity, chronic ailments, conflicts with state revenue.', hi: 'नीच राशि: स्वास्थ्य के प्रति विशेष सावधानी, दीर्घकालीन रोग, कर संबंधी उलझनें।' }
      },
      aspectMod: [
        { graha: 'Jupiter', conditionEn: 'Aspected by Jupiter', conditionHi: 'गुरु की दृष्टि', effectEn: 'Shields vitality, bestows profound metaphysical wisdom and peaceful longevity.', effectHi: 'प्राण रक्षा, अगाध आध्यात्मिक ज्ञान तथा शांत व सुदीर्घ जीवन।' }
      ],
      femaleEn: 'In female horoscope, vulnerability in middle age regarding reproductive or ocular health, spiritual inclinations, in-laws require tact.',
      femaleHi: 'स्त्री जातक में मध्य आयु में स्वास्थ्य सतर्कता, आध्यात्मिक प्रवृत्तियां, ससुराल पक्ष के साथ संयमित व्यवहार आवश्यक।'
    },
    {
      house: 9,
      baseEn: 'Righteous, devoted to dharma, respectful towards preceptors and father. High philosophical wisdom, foreign pilgrimages, charitable mindset, state honors.',
      baseHi: 'धर्मात्मा, पिता व गुरुजनों का आज्ञाकारी, उच्च दार्शनिक प्रज्ञा, तीर्थ यात्राएं, दानवीर प्रकृति तथा शासन से सम्मानित।',
      milestones: [
        { age: 16, nature: 'favorable', eventEn: 'Spiritual initiation, higher academic excellence, paternal blessings.', eventHi: 'धार्मिक संस्कार, उच्च शिक्षा में प्रगति, पिता का विशेष स्नेह।' },
        { age: 22, nature: 'favorable', eventEn: 'Dawn of fortune (Bhagyodaya), pilgrimage, and intellectual recognition.', eventHi: 'भाग्योदय का शुभ प्रारंभ, तीर्थाटन तथा विद्वानों में ख्याति।' },
        { age: 32, nature: 'career', eventEn: 'Apex of ethical leadership and societal renown.', eventHi: 'धार्मिक व सामाजिक नेतृत्व का चरमोत्कर्ष।' }
      ],
      signMod: {
        Aries: { en: 'Exalted: Supreme spiritual ruler, illustrious father, vast temple and public endowments.', hi: 'उच्च राशि: धर्म ध्वजवाहक, प्रतापी पिता, धार्मिक व सामाजिक प्रतिष्ठा का शिखर।' },
        Libra: { en: 'Debilitated: Clashes with father, skepticism towards traditions, travel obstacles.', hi: 'नीच राशि: पिता से वैचारिक मतभेद, परंपराओं के प्रति संदेह, यात्रा में कष्ट।' }
      },
      aspectMod: [
        { graha: 'Jupiter', conditionEn: 'With or aspected by Jupiter', conditionHi: 'गुरु से युति या दृष्टि', effectEn: 'Dharmadhikari yoga, supreme saintly wisdom, universally revered.', effectHi: 'धर्माधिकारी योग, सर्वोच्च संत तुल्य सम्मान, सर्वमान्य प्रतिष्ठा।' }
      ],
      femaleEn: 'In female horoscope, exceptionally virtuous, brings good fortune to paternal and matrimonial houses, loves pilgrimages and charitable deeds.',
      femaleHi: 'स्त्री जातक में परम सौभाग्यशालिनी, दोनों कुलों का नाम रोशन करने वाली, तीर्थ व धर्म कार्यों में अग्रणी।'
    },
    {
      house: 10,
      baseEn: 'Supreme Kuladipaka yoga, highest directional strength (Digbala). Dominant administrative post, executive power, public fame, unshakeable work ethic. Dignified relationship with state and society.',
      baseHi: 'सर्वोच्च कुलादीपक योग, दशम भाव में सूर्य को पूर्ण दिग्बल प्राप्त होता है। उच्च प्रशासनिक पद, राजकीय सत्ता, कीर्ति, अटूट कर्मठता तथा समाज में अमिट प्रभाव।',
      milestones: [
        { age: 18, nature: 'favorable', eventEn: 'Outstanding academic honors and youth leadership recognition.', eventHi: 'अकादमिक प्रतिष्ठा तथा युवावस्था में नेतृत्व की स्वीकृति।' },
        { age: 28, nature: 'career', eventEn: 'Paternal transition or massive elevation in executive authority.', eventHi: 'पिता के पद की प्राप्ति अथवा कार्यक्षेत्र में अप्रत्याशित पदोन्नति।' },
        { age: 30, nature: 'career', eventEn: 'Consolidation of supreme status, state recognition, undisputed mastery.', eventHi: 'राजकीय सम्मान, उच्चाधिकारों की प्राप्ति तथा प्रतिष्ठा का स्थायित्व।' }
      ],
      signMod: {
        Aries: { en: 'Exalted: Royal commander, minister, civil servant of highest tier.', hi: 'उच्च राशि: सर्वोच्च प्रशासनिक अधिकारी, मंत्री या शासन का शीर्ष नीति-निर्माता।' },
        Libra: { en: 'Debilitated: Professional instability, defamation risk from superiors, ethical trials.', hi: 'नीच राशि: आजीविका में अस्थिरता, अधिकारियों से अनबन, प्रतिष्ठा पर आंच।' }
      },
      aspectMod: [
        { graha: 'Mars', conditionEn: 'Aspected by Mars', conditionHi: 'मंगल की दृष्टि', effectEn: 'Kuladipaka yoga in defense, engineering, or police command.', effectHi: 'सेना, पुलिस या तकनीकी प्रशासन में सर्वोच्च कमान।' }
      ],
      femaleEn: 'In female horoscope, high-ranking professional career, independent authority, respected executive or civil administrator.',
      femaleHi: 'स्त्री जातक में उच्च प्रशासनिक या व्यावसायिक पद, स्वतंत्र निर्णय क्षमता, समाज व कार्यक्षेत्र में विशिष्ट सम्मान।'
    },
    {
      house: 11,
      baseEn: 'Immense wealth accumulation, fulfilment of cherished aspirations, influential network among rulers and aristocrats. Respect from elder siblings. Victorious in speculative investments.',
      baseHi: 'अथाह धन संचय, सभी अभीष्ट कामनाओं की पूर्ति, उच्चाधिकारियों व सत्ताधीशों से घनिष्ठ संबंध। बड़े भाई-बहनों से सहयोग। आर्थिक उपक्रमों में निरंतर विजय।',
      milestones: [
        { age: 25, nature: 'favorable', eventEn: 'Grand financial windfall, expansion of powerful business networks.', eventHi: 'विपुल धन लाभ, शक्तिशाली मित्रों व व्यावसायिक संपर्कों का विस्तार।' },
        { age: 33, nature: 'favorable', eventEn: 'Acquisition of landed assets, major financial summit.', eventHi: 'स्थाई संपत्ति का निर्माण तथा आर्थिक समृद्धि का चरमोत्कर्ष।' }
      ],
      signMod: {
        Aries: { en: 'Exalted: Multi-millionaire status, patronage from monarchs or central governments.', hi: 'उच्च राशि: अपार संपत्ति, केंद्र सरकार या शीर्ष सत्ता से अकूत लाभ।' },
        Libra: { en: 'Debilitated: Strained relations with elder brother, fluctuating profits, tax audits.', hi: 'नीच राशि: अग्रज से मतभेद, आय में उतार-चढ़ाव, कर संबंधी विसंगतियां।' }
      },
      aspectMod: [
        { graha: 'Jupiter', conditionEn: 'Aspected by Jupiter', conditionHi: 'गुरु की दृष्टि', effectEn: 'Righteous and eternal wealth, noble philanthropic endowments.', effectHi: 'धर्म सम्मत अक्षय धन, विशाल दान-पुण्य व समाज कल्याण।' }
      ],
      femaleEn: 'In female horoscope, wealthy, influential friends circle, fulfills family ambitions, holds personal financial independence.',
      femaleHi: 'स्त्री जातक में अत्यधिक संपन्न, प्रभावशाली सखियों का वृत्त, परिवार की महत्वाकांक्षाओं की पूर्ति, आर्थिक रूप से स्वावलंबी।'
    },
    {
      house: 12,
      baseEn: 'Heavy expenditure on government taxes, medical or charitable causes. Foreign residence, distance from paternal land, left eye vulnerability. Solitary spiritual seeker in mature years.',
      baseHi: 'राजकीय करों, चिकित्सा अथवा धार्मिक कार्यों में भारी व्यय। विदेश वास, जन्मभूमि व पितृगृह से दूरी, बाएं नेत्र में विकार। उत्तरार्ध में एकांतप्रिय व मोक्षकामी।',
      milestones: [
        { age: 15, nature: 'health', eventEn: 'Left eye strain or childhood hospitalization.', eventHi: 'बाएं नेत्र में पीड़ा अथवा बाल्यावस्था में अस्वस्थता।' },
        { age: 30, nature: 'career', eventEn: 'Foreign relocation, major expenditure on overseas ventures.', eventHi: 'विदेश यात्रा, सुदूर स्थानों में आजीविका अथवा भारी व्यय।' }
      ],
      signMod: {
        Aries: { en: 'Exalted: High honor in foreign lands, spiritual renunciation of highest order.', hi: 'उच्च राशि: विदेश में राजकीय सम्मान, उच्च कोटि का आध्यात्मिक संन्यास।' },
        Libra: { en: 'Debilitated: Penalties, eye afflictions, financial losses abroad.', hi: 'नीच राशि: दंड, नेत्र कष्ट, परदेस में आर्थिक हानि व अपमान का भय।' }
      },
      aspectMod: [
        { graha: 'Venus', conditionEn: 'With Venus', conditionHi: 'शुक्र से युति', effectEn: 'Expenditure on luxury, foreign arts, sensory comforts.', effectHi: 'विलासिता, कला तथा विदेशी सुख-सुविधाओं पर विपुल खर्च।' }
      ],
      femaleEn: 'In female horoscope, spiritual detachment, charitable disposition, foreign travel, requires care regarding sleep and ocular health.',
      femaleHi: 'स्त्री जातक में आध्यात्मिक विरक्ति, दानशीलता, विदेश वास, निद्रा व नेत्र स्वास्थ्य के प्रति सजगता आवश्यक।'
    }
  ],

  Moon: [
    {
      house: 1,
      baseEn: 'Charming appearance, magnetic eyes, highly emotional and imaginative disposition. If Shukla Paksha (waxing), native enjoys radiant health and popularity. If Krishna Paksha (waning) and afflicted, childhood health fluctuations (Balarishta).',
      baseHi: 'मनोहर मुखाकृति, आकर्षक आंखें, अत्यंत भावुक तथा उर्वर कल्पनाशील स्वभाव। शुक्ल पक्षीय चन्द्रमा होने पर उत्तम आरोग्य, लोकप्रिया तथा कांतिवान देह। कृष्ण पक्ष व पाप प्रभाव में बाल्यावस्था में स्वास्थ्य दुर्बलता (बालारिष्ट योग)।',
      milestones: [
        { age: 15, nature: 'favorable', eventEn: 'Dawn of artistic talents and widespread social charm.', eventHi: 'कलात्मक प्रतिभा तथा समाज में आकर्षण का प्रस्फुटन।' },
        { age: 24, nature: 'favorable', eventEn: 'Major popularity surge, marital or emotional fulfillment.', eventHi: 'लोकप्रियता में अभूतपूर्व वृद्धि, दांपत्य व भावनात्मक सुख।' }
      ],
      signMod: {
        Taurus: { en: 'Exalted: Radiant beauty, immense wealth, peaceful mind, longevity.', hi: 'उच्च राशि: अनुपम सौंदर्य, विपुल धन, शांत मन, सुदीर्घ जीवन।' },
        Scorpio: { en: 'Debilitated: Emotional anxiety, depressive mood swings, respiratory weakness.', hi: 'नीच राशि: मानसिक उद्वेग, अवसाद, श्वास व कफ विकार।' },
        Cancer: { en: 'Own Sign: Nurturing personality, beloved of mother, fertile imagination.', hi: 'स्वराशि: अत्यंत स्नेही, मातृभक्त, कल्पनाशील तथा समृद्ध।' }
      },
      aspectMod: [
        { graha: 'Jupiter', conditionEn: 'With or aspected by Jupiter', conditionHi: 'गुरु की युति या दृष्टि', effectEn: 'Gajakesari yoga: Undisputed fame, scholarly dignity, royal honors.', effectHi: 'गजकेसरी योग: सर्वमान्य कीर्ति, विद्वता, राजसम्मान तथा अखंड ऐश्वर्य।' },
        { graha: 'Saturn', conditionEn: 'With Saturn', conditionHi: 'शनि से युति (विष योग)', effectEn: 'Visha yoga: Melancholic thoughts, maternal suffering, emotional isolation.', effectHi: 'विष योग: मानसिक विषाद, माता को कष्ट, एकाकीपन की भावना।' }
      ],
      femaleEn: 'In female horoscope, extraordinarily graceful, fertile, deeply intuitive, beloved wife and nurturing mother, charming persona.',
      femaleHi: 'स्त्री जातक में अनुपम लावण्य, उर्वरता, गहन अंतर्ज्ञान, आदर्श गृहिणी व ममतामयी माता।'
    },
    {
      house: 2,
      baseEn: 'Sweet-spoken, melodious voice, fond of fine dining, wealthy, attractive face, close to maternal family. Flourishes in finance, arts, dairy, or food industry.',
      baseHi: 'मधुरभाषी, सुरीला कंठ, मिष्ठान्न व सुरुचिपूर्ण भोजनप्रिय, धनवान, सुंदर मुख, ननिहाल पक्ष से स्नेह। वित्त, ललित कला, दुग्ध व्यवसाय में सफलता।',
      milestones: [
        { age: 18, nature: 'career', eventEn: 'Financial emergence through family or commercial speech.', eventHi: 'पारिवारिक व्यवसाय या वाणी से धनार्जन का प्रारंभ।' },
        { age: 27, nature: 'favorable', eventEn: 'Substantial wealth accumulation and family prosperity.', eventHi: 'विपुल धन संचय तथा कुटुंब में मांगलिक उत्सव।' }
      ],
      signMod: {
        Taurus: { en: 'Exalted: Vast treasures of gold, silver, jewels, and liquid assets.', hi: 'उच्च राशि: स्वर्ण, रजत, रत्नों तथा विपुल चल संपत्ति का स्वामी।' },
        Scorpio: { en: 'Debilitated: Harsh slips of tongue under stress, financial volatility.', hi: 'नीच राशि: भावावेश में कटु वाणी, आर्थिक स्थिति में उतार-चढ़ाव।' }
      },
      aspectMod: [
        { graha: 'Mercury', conditionEn: 'Aspected by Mercury', conditionHi: 'बुध की दृष्टि', effectEn: 'Supreme literary oratory, poetic genius, commercial mastery.', effectHi: 'अद्भुत वक्तृत्व कला, काव्य प्रतिभा, वाणिज्य में निपुण।' }
      ],
      femaleEn: 'In female horoscope, sweet melodic voice, generous hostess, lover of jewelry, peaceful domestic financial stability.',
      femaleHi: 'स्त्री जातक में मधुर कंठ, कुशल आतिथ्य, आभूषण प्रेमी, कुटुंब में शांति व आर्थिक संपन्नता।'
    },
    {
      house: 3,
      baseEn: 'Fond of artistic writing, music, travel, supportive sisters. Gentle valor, excels in communication, journalism, and creative handicrafts.',
      baseHi: 'कलात्मक लेखन, संगीत, यात्राप्रिय, बहनों से विशेष स्नेह। सौम्य पराक्रम, जनसंचार, पत्रकारिता तथा हस्तशिल्प में सिद्धहस्त।',
      milestones: [
        { age: 20, nature: 'career', eventEn: 'Literary or artistic breakthrough, successful short journeys.', eventHi: 'साहित्यिक या कलात्मक क्षेत्र में पहचान, लाभदायक लघु यात्राएं।' },
        { age: 24, nature: 'favorable', eventEn: 'Rise in fame through media, publishing, or commerce.', eventHi: 'मीडिया, प्रकाशन या व्यापार द्वारा प्रतिष्ठा का विस्तार।' }
      ],
      signMod: {
        Taurus: { en: 'Exalted: Eminent author, brilliant orator, devoted younger siblings.', hi: 'उच्च राशि: ख्यातिलब्ध लेखक, अद्भुत वक्ता, सहोदरों का पूर्ण सुख।' },
        Scorpio: { en: 'Debilitated: Sibling friction, anxiety during travels, nervous arms/shoulders.', hi: 'नीच राशि: सहोदरों से मनमुटाव, यात्रा में भय, कंधों में दुर्बलता।' }
      },
      aspectMod: [
        { graha: 'Mars', conditionEn: 'Aspected by Mars', conditionHi: 'मंगल की दृष्टि', effectEn: 'Dynamic courage, adventurous ventures, athletic success.', effectHi: 'अदम्य साहस, साहसिक यात्राएं, खेलकूद में सफलता।' }
      ],
      femaleEn: 'In female horoscope, talented in fine arts, affectionate towards sisters, graceful communication style.',
      femaleHi: 'स्त्री जातक में ललित कलाओं में दक्ष, बहनों से अगाध स्नेह, मनभावन संवाद शैली।'
    },
    {
      house: 4,
      baseEn: 'Exceptional maternal affection, palace-like homes, comfortable vehicles, profound peace of mind. Highly sensitive to domestic atmosphere and water elements.',
      baseHi: 'अगाध मातृसुख, सुंदर व भव्य भवन, उत्तम वाहन, मानसिक शांति। गृह के वातावरण व जलीय तत्वों के प्रति विशेष संवेदनशील।',
      milestones: [
        { age: 24, nature: 'favorable', eventEn: 'Acquisition of splendid home or luxury vehicle.', eventHi: 'भव्य गृह अथवा नवीन वाहन का सुखद योग।' },
        { age: 36, nature: 'favorable', eventEn: 'Maternal blessings, domestic expansion, emotional contentment.', eventHi: 'मातृ कृपा, पारिवारिक समृद्धि तथा मानसिक शांति का चरमोत्कर्ष।' }
      ],
      signMod: {
        Cancer: { en: 'Own Sign: Unconditional maternal bliss, waterside home, pristine peace.', hi: 'स्वराशि: अनुपम मातृ सुख, जलाशय के निकट सुंदर वास, अगाध मानसिक शांति।' },
        Scorpio: { en: 'Debilitated: Disturbed domestic peace, maternal health sorrow, emotional distress.', hi: 'नीच राशि: गृह सुख में न्यूनता, माता को कष्ट, मानसिक उद्वेग।' }
      },
      aspectMod: [
        { graha: 'Jupiter', conditionEn: 'Aspected by Jupiter', conditionHi: 'गुरु की दृष्टि', effectEn: 'Blessed with saintly mother, palatial estate, absolute peace.', effectHi: 'सदाचारी माता, विशाल प्रासाद तुल्य गृह, परम संतोष।' }
      ],
      femaleEn: 'In female horoscope, quintessential ideal homemaker, revered by family, generous mother, peaceful household atmosphere.',
      femaleHi: 'स्त्री जातक में आदर्श कुलवधू, गृहलक्ष्मी, स्नेहमयी माता, घर में सुख-शांति की संरक्षिका।'
    },
    {
      house: 5,
      baseEn: 'Brilliant poetic imagination, tender heart, devotion to divine Mother, more female progeny, intuitive advisor, virtuous children.',
      baseHi: 'उर्वर काव्य प्रतिभा, कोमल हृदय, भगवती की कृपा, कन्या संतति की अधिकता, अंतर्ज्ञानी सलाहकार, सदाचारी संतान।',
      milestones: [
        { age: 20, nature: 'favorable', eventEn: 'Scholarly distinction, blossoming of creative talents.', eventHi: 'अकादमिक व कलात्मक प्रतिभा का प्रस्फुटन।' },
        { age: 28, nature: 'favorable', eventEn: 'Birth of a fortunate child, speculative or advisory gains.', eventHi: 'सुलक्षण संतान का जन्म, परामर्श या बौद्धिक कार्यों से लाभ।' }
      ],
      signMod: {
        Taurus: { en: 'Exalted: Supreme creative genius, illustrious children, divine mantra siddhi.', hi: 'उच्च राशि: अद्भुत सृजनात्मक प्रतिभा, प्रतापी संतान, मंत्र सिद्धि।' },
        Scorpio: { en: 'Debilitated: Emotional anguish regarding children, digestive sensitivity.', hi: 'नीच राशि: संतान पक्ष से चिंता, उदर व पाचन दुर्बलता।' }
      },
      aspectMod: [
        { graha: 'Jupiter', conditionEn: 'Aspected by Jupiter', conditionHi: 'गुरु की दृष्टि', effectEn: 'Scholarly children, profound spiritual intuition, minister or advisor.', effectHi: 'विद्वान व दीर्घायु संतान, आध्यात्मिक ज्ञान, उच्च सलाहकार।' }
      ],
      femaleEn: 'In female horoscope, blessed with cultured children, deeply intuitive mother, tender-hearted, artistic sensibilities.',
      femaleHi: 'स्त्री जातक में सुसंस्कृत संतान का सुख, संवेदनशील व ममतालु हृदय, कलात्मक अभिरुचि।'
    },
    {
      house: 6,
      baseEn: 'Fragile digestion, prone to colds, respiratory congestion, and water-borne ailments. Subdued rivals through gentle diplomacy; maternal uncle requires care.',
      baseHi: 'जठराग्नि मंद, कफ, शीत तथा जलजनित रोगों की संवेदनशीलता। सौम्य व्यवहार से विरोधियों का शमन; ननिहाल पक्ष के प्रति सतर्कता।',
      milestones: [
        { age: 18, nature: 'health', eventEn: 'Cold, pulmonary sensitivity, or water-related vulnerability.', eventHi: 'शीत विकार, कफ या जल जनित रोगों से सतर्कता।' },
        { age: 36, nature: 'favorable', eventEn: 'Triumph over competition through patient perseverance.', eventHi: 'धैर्य व विनम्रता से शत्रुओं व बाधाओं पर विजय।' }
      ],
      signMod: {
        Taurus: { en: 'Exalted: Robust recovery power, easily overcomes debts and disputes.', hi: 'उच्च राशि: शीघ्र रोगमुक्ति, ऋण व विवादों पर सहज नियंत्रण।' },
        Scorpio: { en: 'Debilitated: Chronic anxiety, digestive or urinary vulnerability.', hi: 'नीच राशि: निरंतर मानसिक चिंता, आंतों या मूत्राशय में शिथिलता।' }
      },
      aspectMod: [
        { graha: 'Saturn', conditionEn: 'With Saturn', conditionHi: 'शनि से युति', effectEn: 'Protracted phlegmatic ailments, workplace friction, melancholia.', effectHi: 'दीर्घकालीन कफ विकार, कार्यक्षेत्र में असहयोग, मानसिक अवसाद।' }
      ],
      femaleEn: 'In female horoscope, needs care regarding hormonal and digestive cycles; excels in healthcare, nursing, and empathetic service.',
      femaleHi: 'स्त्री जातक में मासिक व पाचन संतुलन पर ध्यान आवश्यक; चिकित्सा, परिचर्या व सेवा कार्यों में अत्यंत सफल।'
    },
    {
      house: 7,
      baseEn: 'Charming, romantic, beautiful spouse, passionate love life, early marriage if well-placed. Fluctuations in marital moods; successful in public dealings, trade, and partnerships.',
      baseHi: 'सुंदर, आकर्षक व भावुक जीवनसाथी, सुखी दांपत्य, समय पर विवाह का योग। दांपत्य में कभी-कभी भावुकता की अधिकता; जनसंपर्क, व्यापार व साझेदारी में लाभ।',
      milestones: [
        { age: 21, nature: 'favorable', eventEn: 'Romantic engagement or initiation of fortunate business partnership.', eventHi: 'प्रेम संबंध, विवाह वार्ता अथवा शुभ व्यापारिक साझेदारी।' },
        { age: 25, nature: 'favorable', eventEn: 'Marital bliss and substantial expansion in public trade.', eventHi: 'दांपत्य सुख तथा जनव्यापार में विशेष प्रगति।' }
      ],
      signMod: {
        Taurus: { en: 'Exalted: Exceptionally handsome/beautiful and wealthy spouse, lifelong marital joy.', hi: 'उच्च राशि: अत्यंत रूपवान व धनी जीवनसाथी, अखंड दांपत्य सुख।' },
        Scorpio: { en: 'Debilitated: Marital insecurities, emotional turbulence with spouse.', hi: 'नीच राशि: दांपत्य में अविश्वास, जीवनसाथी के स्वास्थ्य की चिंता।' }
      },
      aspectMod: [
        { graha: 'Jupiter', conditionEn: 'Aspected by Jupiter', conditionHi: 'गुरु की दृष्टि', effectEn: 'Highly virtuous, devoted partner, social honor, noble alliance.', effectHi: 'सदाचारी व निष्ठावान जीवनसाथी, समाज में उच्च प्रतिष्ठा।' }
      ],
      femaleEn: 'In female horoscope, devoted and handsome husband, emotional bonding, prosperous matrimonial home.',
      femaleHi: 'स्त्री जातक में सुंदर व स्नेही पति, प्रगाढ़ भावनात्मक संबंध, समृद्ध ससुराल।'
    },
    {
      house: 8,
      baseEn: 'Psychic intuition, interest in occult sciences, water hazards, fluctuating vitality in youth (Balarishta if afflicted). Sudden financial windfalls through legacy or spouse.',
      baseHi: 'गहन अंतर्ज्ञान, गुप्त विद्याओं व तंत्र में रुचि, जल से सतर्कता, बाल्यावस्था में स्वास्थ्य दुर्बलता। जीवनसाथी या वसीयत से आकस्मिक धन लाभ।',
      milestones: [
        { age: 8, nature: 'health', eventEn: 'Childhood health vulnerability (respiratory or water-related).', eventHi: 'बाल्यावस्था में स्वास्थ्य कष्ट (जल या कफ जनित)।' },
        { age: 32, nature: 'favorable', eventEn: 'Inheritance, sudden legacy, or profound occult awakening.', eventHi: 'अचानक वसीयत से लाभ अथवा आध्यात्मिक अंतर्दृष्टि का उदय।' }
      ],
      signMod: {
        Taurus: { en: 'Exalted: Long life, massive unexpected inheritance, peaceful mind.', hi: 'उच्च राशि: दीर्घायु, अप्रत्याशित पैतृक संपत्ति, मानसिक स्थिरता।' },
        Scorpio: { en: 'Debilitated: Deep anxiety, hysteria, phobias, digestive-water imbalances.', hi: 'नीच राशि: गहन मानसिक भय, फोबिया, जल व कफ असंतुलन।' }
      },
      aspectMod: [
        { graha: 'Jupiter', conditionEn: 'Aspected by Jupiter', conditionHi: 'गुरु की दृष्टि', effectEn: 'Neutralizes Balarishta, bestows longevity and occult wisdom.', effectHi: 'बालारिष्ट दोष का शमन, दीर्घायु तथा आध्यात्मिक ज्ञान।' }
      ],
      femaleEn: 'In female horoscope, emotional sensitivity, requires emotional support during hormonal transitions, inheritance from in-laws.',
      femaleHi: 'स्त्री जातक में अत्यधिक भावुकता, ससुराल पक्ष से धन लाभ, मानसिक संबल की आवश्यकता।'
    },
    {
      house: 9,
      baseEn: 'Highly fortunate (Bhagyashali), dharmic, charitable, fond of pilgrimages and overseas ocean voyages. Loving relationship with father, devoted to divine Mother.',
      baseHi: 'परम भाग्यशाली, धार्मिक, दानवीर, तीर्थाटन व समुद्री यात्राओं का प्रेमी। पिता से प्रगाढ़ स्नेह, कुलदेवी की विशेष कृपा।',
      milestones: [
        { age: 16, nature: 'favorable', eventEn: 'Spiritual initiation and blessings from preceptors.', eventHi: 'धार्मिक संस्कार तथा गुरुजनों का वरदान।' },
        { age: 24, nature: 'favorable', eventEn: 'Major fortune breakthrough, foreign pilgrimage or water voyage.', eventHi: 'विशाल भाग्योदय, तीर्थ यात्रा अथवा विदेशी जल यात्रा।' },
        { age: 32, nature: 'career', eventEn: 'High public esteem, temple endowments, social leadership.', eventHi: 'सामाजिक मान-सम्मान, धार्मिक कार्यों में अग्रणी भूमिका।' }
      ],
      signMod: {
        Taurus: { en: 'Exalted: Sovereign fortune, divine grace, illustrious father, vast charitable works.', hi: 'उच्च राशि: अखंड सौभाग्य, ईश्वरीय कृपा, प्रतापी पिता, विशाल धर्मार्थ कार्य।' },
        Scorpio: { en: 'Debilitated: Strained paternal relationship, doubts in faith, travel hindrances.', hi: 'नीच राशि: पिता से वैचारिक मतभेद, आस्था में विचलन, यात्राओं में विघ्न।' }
      },
      aspectMod: [
        { graha: 'Jupiter', conditionEn: 'With or aspected by Jupiter', conditionHi: 'गुरु से युति या दृष्टि', effectEn: 'Supreme Dharmadhikari yoga, philanthropic leader, saintly fame.', effectHi: 'परम धर्माधिकारी योग, धर्मपरायण नेतृत्व, संत तुल्य आदर।' }
      ],
      femaleEn: 'In female horoscope, extraordinarily blessed, brings prosperity to husband and children, saintly conduct, loves pilgrimage.',
      femaleHi: 'स्त्री जातक में परम सौभाग्यवती, पति व संतान हेतु कल्याणकारी, सात्विक आचरण, तीर्थ प्रिय।'
    },
    {
      house: 10,
      baseEn: 'Public renown, benevolent administrator, career connected to masses, liquids, trade, healthcare, or hospitality. Emotional dedication to profession, fluctuating yet prestigious status.',
      baseHi: 'लोकप्रियता, जनप्रिय प्रशासक, जनता, जल, व्यापार, चिकित्सा या आतिथ्य से जुड़ी आजीविका। कार्य के प्रति भावनात्मक समर्पण, प्रतिष्ठित पद।',
      milestones: [
        { age: 24, nature: 'career', eventEn: 'Public recognition, professional elevation, governmental favor.', eventHi: 'कार्यक्षेत्र में सार्वजनिक पहचान, पदोन्नति, शासन से सहयोग।' },
        { age: 36, nature: 'favorable', eventEn: 'Apex of professional acclaim and mass following.', eventHi: 'जनप्रियता व सामाजिक प्रतिष्ठा का चरमोत्कर्ष।' }
      ],
      signMod: {
        Taurus: { en: 'Exalted: Renowned statesman, beloved corporate leader, vast wealth.', hi: 'उच्च राशि: ख्यातिलब्ध राजनेता, लोकप्रिय अधिकारी, अटूट धन-संपदा।' },
        Scorpio: { en: 'Debilitated: Professional defamation under scandal, public misunderstandings.', hi: 'नीच राशि: कार्यक्षेत्र में अपयश का भय, भावनात्मक अशांति।' }
      },
      aspectMod: [
        { graha: 'Sun', conditionEn: 'With Sun', conditionHi: 'सूर्य से युति', effectEn: 'High state authority, royal favor, charismatic public leader.', effectHi: 'राजकीय सत्ता, उच्चाधिकारियों का स्नेह, ओजस्वी व्यक्तित्व।' }
      ],
      femaleEn: 'In female horoscope, distinguished career, respected businesswoman or teacher, brings honor to family.',
      femaleHi: 'स्त्री जातक में कार्यक्षेत्र में विशिष्ट प्रतिष्ठा, सफल अध्यापिका या व्यवसायी, कुल का गौरव।'
    },
    {
      house: 11,
      baseEn: 'Multifold gains, vast friendly circle, prosperous daughters and elder sisters, generous patronage, fulfilment of desires through artistic and public endeavors.',
      baseHi: 'बहुमुखी लाभ, विशाल मित्र मंडली, सुखी कन्या संतति व अग्रजा, मनोकामनाओं की पूर्ति, कला व जनसेवा से धनोपार्जन।',
      milestones: [
        { age: 27, nature: 'favorable', eventEn: 'Substantial monetary accumulation, expansion of noble friendships.', eventHi: 'विपुल धन लाभ, उच्च मित्रों का सहयोग, व्यापार विस्तार।' },
        { age: 36, nature: 'favorable', eventEn: 'Acquisition of assets, financial summit, community honor.', eventHi: 'स्थाई संपत्ति का लाभ, आर्थिक शिखर, समाज में प्रतिष्ठा।' }
      ],
      signMod: {
        Taurus: { en: 'Exalted: Multi-stream immense wealth, opulent lifestyle, noble friends.', hi: 'उच्च राशि: अनेक स्रोतों से विपुल धन, वैभवशाली जीवन, कुलीन मित्र।' },
        Scorpio: { en: 'Debilitated: Deceit from false friends, fluctuating profits, anxiety over elder sister.', hi: 'नीच राशि: मित्रों से विश्वासघात, आय में अस्थिरता, अग्रजा की चिंता।' }
      },
      aspectMod: [
        { graha: 'Venus', conditionEn: 'With Venus', conditionHi: 'शुक्र से युति', effectEn: 'Artistic wealth, luxury vehicles, high social circles.', effectHi: 'कला से धन, विलासिता के साधन, उच्च अभिजात्य वर्ग में उठक-बैठक।' }
      ],
      femaleEn: 'In female horoscope, wealthy, loved by friends, fulfilled life desires, prosperous children.',
      femaleHi: 'स्त्री जातक में अत्यधिक संपन्न, सखियों में प्रिय, मनोवांछित फल की प्राप्ति, सुखी संतान।'
    },
    {
      house: 12,
      baseEn: 'Secluded spiritual seeker, expenditure on philanthropic and pilgrimage causes. Sensitive left eye, vivid dreams, foreign travel and settlement. Peaceful solitude.',
      baseHi: 'एकांतप्रिय आध्यात्मिक साधक, धर्मार्थ व तीर्थ यात्राओं पर व्यय। बाएं नेत्र में संवेदनशीलता, स्वप्नशीलता, विदेश वास का प्रबल योग। एकांत में मानसिक शांति।',
      milestones: [
        { age: 25, nature: 'career', eventEn: 'Overseas journey or foreign educational/vocational venture.', eventHi: 'विदेश गमन अथवा सुदूर स्थानों में विद्या व आजीविका।' },
        { age: 45, nature: 'favorable', eventEn: 'Spiritual detachment, higher meditation, philanthropic legacy.', eventHi: 'आध्यात्मिक विरक्ति, गहन ध्यान, परोपकार में जीवन का समर्पण।' }
      ],
      signMod: {
        Taurus: { en: 'Exalted: Foreign prosperity, peaceful meditation, charitable endowments.', hi: 'उच्च राशि: विदेश में अपार समृद्धि, शांत ध्यान, विशाल धर्मार्थ कार्य।' },
        Scorpio: { en: 'Debilitated: Sleep disorders, emotional isolation, ocular and hospital expenses.', hi: 'नीच राशि: अनिद्रा, मानसिक अवसाद, नेत्र पीड़ा व चिकित्सा व्यय।' }
      },
      aspectMod: [
        { graha: 'Jupiter', conditionEn: 'Aspected by Jupiter', conditionHi: 'गुरु की दृष्टि', effectEn: 'Moksha seeker, divine dreams, peaceful foreign abode.', effectHi: 'मोक्ष मार्ग की ओर अग्रसर, पवित्र स्वप्न, विदेश में सुखी वास।' }
      ],
      femaleEn: 'In female horoscope, charitable, fond of solitude, sensitive emotions, abroad travel, needs sound sleep hygiene.',
      femaleHi: 'स्त्री जातक में दानशीला, एकांतप्रिय, अत्यधिक भावुक, विदेश यात्रा, निद्रा पर ध्यान आवश्यक।'
    }
  ]
};

console.log('Script initialized. Generating base schema...');
