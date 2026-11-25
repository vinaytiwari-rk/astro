import type { PlanetId } from '../types';

export interface PropheticPlanetInput {
  planetId: PlanetId;
  houseNumber: number; // 1..12
  signNameEn: string;
  signNameHi: string;
  dignity: string;
  isRetrograde: boolean;
  isCombust: boolean;
  isOuterPlanet: boolean;
}

export interface PropheticPlanetReading {
  propheticReadingEn: string;
  propheticReadingHi: string;
  lifeImpactHeadlineEn: string;
  lifeImpactHeadlineHi: string;
}

function getOrdinalSuffix(n: number): string {
  if (n === 1) return '1st';
  if (n === 2) return '2nd';
  if (n === 3) return '3rd';
  return `${n}th`;
}

const VEDIC_PROPHETIC_MATRIX: Record<string, Record<number, { en: string; hi: string; headlineEn: string; headlineHi: string }>> = {
  "Sun": {
    "1": {
      "headlineEn": "Commanding Willpower, Magnetic Aura & Natural Leadership",
      "headlineHi": "तेजस्वी व्यक्तित्व, उच्च आत्मबल व स्वाभाविक नेतृत्व",
      "en": "With the Sun placed in your 1st House, you are endowed with a dignified, magnetic personality and an unbending sense of self-respect. You naturally command authority in group settings and dislike being micromanaged. Your health vitality is robust, though you must stay mindful of heat-related sensitivity and prevent pride from overshadowing cooperation.",
      "hi": "सूर्य के प्रथम भाव में होने से आपका व्यक्तित्व अत्यंत प्रभावशाली, तेजस्वी और स्वाभिमानी है। आप स्वभाव से ही नेतृत्व करने की क्षमता रखते हैं और किसी के अनुचित दबाव में नहीं झुकते। आपका आत्मबल सुदृढ़ है, यद्यपि स्वभाव में अत्यधिक कठोरता या क्रोध से बचना आपके लिए हितकर रहेगा।"
    },
    "2": {
      "headlineEn": "Authoritative Speech, Treasury Ambition & Government Connections",
      "headlineHi": "गंभीर वाणी, शासन-सत्ता से लाभ व कोष संचय का संकल्प",
      "en": "The Sun in your 2nd House directs your ambitions toward wealth accumulation, family prestige, and authoritative expression. Your speech carries natural weight and conviction, making you effective in financial negotiations and executive decisions. Financial gains flow through administrative positions, state patronage, or independent commerce.",
      "hi": "द्वितीय भाव में सूर्य की उपस्थिति आपकी वाणी को गंभीर और प्रभावशाली बनाती है। आप परिवार की प्रतिष्ठा और संचित धन के विस्तार के प्रति अत्यंत जागरूक रहते हैं। शासन-सत्ता, उच्चाधिकारियों अथवा पैतृक प्रतिष्ठा से धन लाभ के उत्तम अवसर प्राप्त होते हैं।"
    },
    "3": {
      "headlineEn": "Fearless Valour, Entrepreneurial Drive & Decisive Enterprise",
      "headlineHi": "अदम्य पराक्रम, स्वतंत्र उद्यमशीलता व निर्भीक संचार",
      "en": "Sun in your 3rd House infuses peerless courage, energetic initiative, and an adventurous entrepreneurial spirit. You excel when pioneering new ventures through your own grit without waiting for assistance. Communication carries an inspiring, assertive tone that rallies collaborators behind your vision.",
      "hi": "तृतीय भाव का सूर्य आपको अदम्य पराक्रमी, साहसी और स्वतंत्र उद्यमशील बनाता है। आप अपने पुरुषार्थ से जीवन में नए आयाम स्थापित करते हैं। आपकी संवाद शैली ओजस्वी और दूसरों में उत्साह भरने वाली होती है।"
    },
    "4": {
      "headlineEn": "Domestic Stature, Heritage Pride & Real Estate Ambitions",
      "headlineHi": "पारिवारिक प्रतिष्ठा, भूमि-भवन की महत्वाकांक्षा व आत्म-गौरव",
      "en": "With the Sun occupying your 4th House, domestic life and landed heritage form central themes in your journey. You take immense pride in establishing a stately, dignified home environment. While you work tirelessly to provide generational security and vehicles, cultivating emotional warmth at home preserves domestic peace.",
      "hi": "चतुर्थ भाव में सूर्य होने से आप अपने कुल-परिवार, पैतृक भूमि और गृहस्थ प्रतिष्ठा को सर्वोच्च प्राथमिकता देते हैं। आप भव्य व सुरक्षित घर-परिवार के निर्माण हेतु निरंतर प्रयासरत रहते हैं। पारिवारिक सुख को अक्षुण्ण रखने के लिए घर के भीतर अहं के टकराव से बचना आवश्यक है।"
    },
    "5": {
      "headlineEn": "Sharp Creative Intellect, Advisory Prominence & High Ambition",
      "headlineHi": "प्रखर बौद्धिक मेधा, मंत्रणा कौशल, संतान सुख व दूरदर्शिता",
      "en": "Sun placed in your 5th House endows you with a razor-sharp intellect, creative brilliance, and natural advisory wisdom. You excel in strategic planning, educational pursuits, and roles where your counsel guides major outcomes. Your children inherit your strong-willed, honorable character.",
      "hi": "पंचम भाव में सूर्य का प्रभाव आपकी बुद्धि को अत्यंत प्रखर, रचनात्मक और दूरदर्शी बनाता है। आप योजना निर्माण, शिक्षा और परामर्श के क्षेत्र में विशिष्ट सम्मान प्राप्त करते हैं। आपकी संतान आत्मविश्वासी और कुल का मान बढ़ाने वाली होती है।"
    },
    "6": {
      "headlineEn": "Triumphant Over Adversaries, Immune Stamina & Service Command",
      "headlineHi": "शत्रु-विजय, रोग-प्रतिरोधक शक्ति व कार्यक्षेत्र में निर्विवाद विजय",
      "en": "Positioned in the 6th House, the Sun operates as a formidable shield against competitors, legal entanglements, and adversaries. You possess ironclad immune stamina and an indomitable work ethic that outlasts rivals. Challenges merely refine your administrative competence.",
      "hi": "षष्ठ भाव में सूर्य की स्थिति शत्रुओं, मुकदमों और प्रतियोगियों पर निर्विवाद विजय दिलाती है। आपमें अद्भुत रोग-प्रतिरोधक क्षमता और कार्यक्षेत्र की कठिनाइयों से पार पाने का स्वाभाविक सामर्थ्य है। कठिन से कठिन चुनौतियां भी आपका मार्ग नहीं रोक पातीं।"
    },
    "7": {
      "headlineEn": "Dynamic Spousal Alliances, Public Stature & High Principles",
      "headlineHi": "स्वाभिमानी जीवनसाथी, सामाजिक प्रतिष्ठा व साझेदारी में संतुलन",
      "en": "The Sun in your 7th House indicates a life partner of distinguished character, high self-esteem, and notable social status. While this placement stimulates mutual public elevation and prestigious alliances, preserving marital bliss requires setting aside ego and fostering democratic partnership.",
      "hi": "सप्तम भाव का सूर्य एक स्वाभिमानी, तेजस्वी और प्रतिष्ठित जीवनसाथी का संकेत देता है। वैवाहिक व व्यावसायिक साझेदारी से समाज में आपका मान-सम्मान बढ़ता है। दांपत्य जीवन की मधुरता बनाए रखने के लिए परस्पर आदर और अहंकार का त्याग आवश्यक है।"
    },
    "8": {
      "headlineEn": "Deep Transformative Vision, Investigative Depth & Legacy Secrets",
      "headlineHi": "गूढ़ अंतर्दृष्टि, संकटों से पुनरुत्थान व पैतृक रहस्यों का अन्वेषण",
      "en": "Sun in your 8th House turns your consciousness toward deep psychological research, ancestral legacies, and transformative life crises. You possess the rare gift of emerging stronger from unexpected disruptions, turning vulnerability into profound inner resilience.",
      "hi": "अष्टम भाव में सूर्य का प्रभाव आपको गूढ़ विद्याओं, वित्तीय अन्वेषण और संकटों से सीखकर पुनः सशक्त बनने की आंतरिक शक्ति देता है। जीवन के अप्रत्याशित मोड़ आपके आत्मबल को और अधिक परिपक्व बनाते हैं।"
    },
    "9": {
      "headlineEn": "Radiant Fortune (Bhagya), Ethical Rectitude & Divine Favor",
      "headlineHi": "प्रबल भाग्योदय, उच्च धर्म-निष्ठा, पिता का आशीष व वैश्विक ज्ञान",
      "en": "Occupying your 9th House, the Sun showers radiant fortune, ethical prestige, and blessings from mentors and paternal figures. You are guided by an unbending moral compass and thrive through higher philosophy, international journeys, and institutional leadership.",
      "hi": "नवम भाव में सूर्य का होना प्रबल भाग्योदय, पिता व गुरुजनों की कृपा और समाज में उच्च नैतिक सम्मान का प्रतीक है। धार्मिक, दार्शनिक और उच्च विद्या के क्षेत्र में आपकी प्रतिष्ठा दूर-दूर तक फैलती है।"
    },
    "10": {
      "headlineEn": "Supreme Career Zenith (Digbala), Institutional Command & Public Renown",
      "headlineHi": "करियर का सर्वोच्च शिखर (दिग्बल), प्रशासनिक अधिकार व कीर्ति",
      "en": "In your 10th House, the Sun reaches supreme directional strength (Digbala). You are destined for authoritative public leadership, executive command, and institutional recognition. You thrive in positions where you steer strategic outcomes and set the benchmark for industry excellence.",
      "hi": "दशम भाव में सूर्य का दिग्बली होना प्रशासनिक सफलता, राजकीय सम्मान और कार्यक्षेत्र में सर्वोच्च पद-प्रतिष्ठा का अचूक योग है। आप बड़े संगठनों या स्वतंत्र प्रोजेक्ट्स का कुशल नेतृत्व करने में अद्वितीय सफलता प्राप्त करते हैं।"
    },
    "11": {
      "headlineEn": "Compounding Financial Inflows, Elite Network Circles & High Aspirations",
      "headlineHi": "प्रचुर नियमित आय, उच्च पदस्थ मित्रों का सहयोग व अभीष्ट सिद्धि",
      "en": "Sun in your 11th House acts as a golden magnet for recurring financial gains, influential patronage, and the fulfillment of cherished long-term aspirations. You naturally attract high-stature allies who champion your endeavors and open doors to expansive success.",
      "hi": "एकादश भाव में सूर्य की उपस्थिति निरंतर आर्थिक लाभ, उच्च पदस्थ व प्रभावशाली व्यक्तियों से घनिष्ठ संबंध और समस्त मनोकामनाओं की पूर्ति का संकेत देती है। आपकी योजनाएं दीर्घकाल में भारी मुनाफा प्रदान करती हैं।"
    },
    "12": {
      "headlineEn": "Foreign Horizons, Philanthropic Sovereignty & Transcendent Solitude",
      "headlineHi": "विदेश गमन/वास, परोपकार, गुप्त साधना व आत्मिक शांति",
      "en": "With the Sun in your 12th House, your soul flourishes through international engagements, charitable leadership, and moments of reflective retreat. You achieve deep peace and material success when connecting with distant lands, hospitals, or research institutions away from mundane spotlight.",
      "hi": "द्वादश भाव का सूर्य दूरस्थ देशों या विदेश में सफलता, परोपकारी कार्यों में अग्रणी भूमिका और एकांत में आत्मिक शांति का योग बनाता है। आपका वास्तविक प्रभाव सुदूर स्थानों या बड़े संस्थानों के माध्यम से प्रकाशित होता है।"
    }
  },
  "Moon": {
    "1": {
      "headlineEn": "Magnetic Emotional Charisma, Intuitive Wisdom & Public Popularity",
      "headlineHi": "अद्भुत आकर्षण, गहरी संवेदनशीलता, जनप्रियता व अंतर्ज्ञान",
      "en": "The Moon in your 1st House graces you with gentle emotional warmth, intuitive perceptiveness, and immense public popularity. You read room dynamics effortlessly and possess a natural aesthetic charm that endears you to people across all walks of life.",
      "hi": "प्रथम भाव में चंद्रमा की स्थिति आपको अत्यंत आकर्षक, संवेदनशील और जनप्रिय बनाती है। आप दूसरों की भावनाओं को सहज ही समझ लेते हैं और आपका सौम्य स्वभाव लोगों को स्वाभाविक रूप से आपकी ओर आकर्षित करता है।"
    },
    "2": {
      "headlineEn": "Sweet Persuasive Eloquence, Family Affection & Liquid Assets",
      "headlineHi": "मधुर सम्मोहक वाणी, कुल-प्रेम व नियमित धन प्रवाह",
      "en": "Moon in your 2nd House brings sweetness and emotional empathy to your voice, making your communication soothing and persuasive. Financial wealth fluctuates with natural cycles but expands steadily through hospitality, public trade, and strong family ties.",
      "hi": "द्वितीय भाव का चंद्रमा आपकी वाणी में मिठास और आकर्षण भरता है। आपकी बातचीत दूसरों को प्रभावित करती है। तरल धन और पारिवारिक सुख में निरंतर वृद्धि होती है, यद्यपि आर्थिक मामलों में नियमित बचत की आदत बनाए रखना उपयोगी है।"
    },
    "3": {
      "headlineEn": "Artistic Literary Flair, Versatile Intellect & Sibling Affection",
      "headlineHi": "कलात्मक लेखन प्रतिभा, बहुमुखी प्रतिभा व बंधु स्नेह",
      "en": "With the Moon in your 3rd House, your mind is brimming with creative imagination, literary curiosity, and communicative talent. You enjoy short journeys, artistic expression, and maintain warm, protective bonds with siblings and collaborators.",
      "hi": "तृतीय भाव में चंद्रमा होने से आपमें कला, लेखन, संगीत अथवा संचार के क्षेत्र में विशेष रुचि व प्रतिभा होती है। आप नई-नई यात्राओं के शौकीन हैं और भाई-बहनों के साथ आपके संबंध आत्मीय रहते हैं।"
    },
    "4": {
      "headlineEn": "Supreme Emotional Fulfillment (Digbala), Maternal Grace & Domestic Haven",
      "headlineHi": "मानसिक परमानंद (दिग्बल), मातृ-आशीर्वाद व सुखद गृहस्थ जीवन",
      "en": "Reaching directional strength (Digbala) in your 4th House, the Moon blesses you with deep emotional peace, a nurturing mother, and a sanctuary of domestic harmony. You possess an innate talent for creating beautiful, comforting residential environments and acquiring dependable vehicles.",
      "hi": "चतुर्थ भाव में चंद्रमा दिग्बली होकर आपको असीम मानसिक शांति, माता का वात्सल्य और सुखद गृह-वाहन का वरदान देता है। आपका घर आनंद और आतिथ्य का केंद्र बनता है और आपका मन सदैव संतुष्ट व प्रसन्न रहता है।"
    },
    "5": {
      "headlineEn": "Creative Poetic Vision, Empathetic Mentorship & Loving Progeny",
      "headlineHi": "रचनात्मक कल्पनाशीलता, मेधा, संतान का सुख व सहृदय स्वभाव",
      "en": "Moon in your 5th House activates rich imaginative faculties, emotional intelligence, and natural speculative intuition. You connect deeply with children, excel in creative artistic pursuits, and make choices guided by heartfelt wisdom.",
      "hi": "पंचम भाव का चंद्रमा आपकी बुद्धि को भावुक, कलात्मक और संवेदनशील बनाता है। आपको योग्य व आज्ञाकारी संतान का सुख मिलता है और रचनात्मक या शैक्षणिक कार्यों में आपकी प्रतिभा चमकती है।"
    },
    "6": {
      "headlineEn": "Compassionate Service Mindset, Health Vigilance & Empathic Victory",
      "headlineHi": "सेवा-परायणता, स्वास्थ्य जागरूकता व सहानुभूतिपूर्ण संघर्ष-विजय",
      "en": "Moon in the 6th House infuses a deeply compassionate, service-oriented attitude toward helping those in distress. While you resolve workplace friction through emotional tact, you must consciously protect your nervous system from overthinking and dietary irregularities.",
      "hi": "षष्ठ भाव में चंद्रमा सेवा और दूसरों की सहायता की भावना जाग्रत करता है। आप कार्यस्थल पर शांति बनाए रखने का प्रयास करते हैं। मानसिक तनाव या अत्यधिक सोचने से बचकर नियमित दिनचर्या रखना आपके स्वास्थ्य के लिए उत्तम रहेगा।"
    },
    "7": {
      "headlineEn": "Graceful Spousal Devotion, Public Rapport & Harmonious Alliances",
      "headlineHi": "रूपवान व स्नेही जीवनसाथी, उत्तम दांपत्य व सफल जन-संपर्क",
      "en": "The Moon in your 7th House indicates a spouse who is attractive, emotionally responsive, and deeply devoted to domestic harmony. In public and business partnerships, your ability to empathize with partners creates long-lasting commercial goodwill.",
      "hi": "सप्तम भाव का चंद्रमा एक रूपवान, स्नेही, संवेदनशील और सहयोगी जीवनसाथी प्रदान करता है। सार्वजनिक संबंधों और व्यापारिक साझेदारी में आपका सौम्य व्यवहार भारी सफलता और लोकप्रियता दिलाता है।"
    },
    "8": {
      "headlineEn": "Deep Psychic Perception, Occult Transformation & Intuitive Rebirth",
      "headlineHi": "गहन अंतःप्रज्ञा, गूढ़ विद्याओं में रुचि व संकटों से आत्मिक पुनरुद्धार",
      "en": "With the Moon in your 8th House, your mind possesses penetrative psychic sensitivity and natural depth for psychological or esoteric research. You navigate life transitions with quiet emotional endurance, emerging transformed after internal contemplation.",
      "hi": "अष्टम भाव में चंद्रमा आपकी अंतर्दृष्टि को अत्यंत सूक्ष्म और रहस्यमयी बनाता है। आप गुप्त विद्याओं, ध्यान और मनोविज्ञान की गहराई को सहज समझ लेते हैं। एकांत साधना आपको आंतरिक बल प्रदान करती है।"
    },
    "9": {
      "headlineEn": "Devotional Bhagya, Sacred Pilgrimages & Expansive Faith",
      "headlineHi": "धार्मिक निष्ठा, पवित्र तीर्थाटन, भाग्य-वृद्धि व ईश्वरीय अनुग्रह",
      "en": "Moon occupying your 9th House anchors your life in pure devotional faith, love for sacred pilgrimages, and reverence for spiritual traditions. Fortune rises in proportion to your charitable acts and emotional generosity toward those in need.",
      "hi": "नवम भाव में चंद्रमा धर्म, भक्ति, तीर्थ यात्राओं और परोपकार में गहरी आस्था उत्पन्न करता है। आपका भाग्योदय आपकी उदारता और सदाचार के सीधे अनुपात में निरंतर बढ़ता रहता है।"
    },
    "10": {
      "headlineEn": "High Public Appeal, Influential Career & Adaptive Social Leadership",
      "headlineHi": "व्यापक जन-समर्थन, प्रतिष्ठित कार्यक्षेत्र व सामाजिक लोकप्रियता",
      "en": "In your 10th House, the Moon endows your career with high public visibility, societal appeal, and adaptive leadership. You excel in vocations touching the public pulse—governance, healthcare, commerce, or media—where your reputation flourishes.",
      "hi": "दशम भाव का चंद्रमा कार्यक्षेत्र में भारी लोकप्रियता, जन-आकर्षण और सामाजिक प्रतिष्ठा प्रदान करता है। आप जनसेवा, प्रशासन, चिकित्सा, मीडिया अथवा व्यापार में अपनी गहरी छाप छोड़ते हैं।"
    },
    "11": {
      "headlineEn": "Abundant Inflow Channels, Loyal Peer Circles & Fulfilled Desires",
      "headlineHi": "आय के विविध साधन, निष्ठावान मित्र-मंडली व समस्त इच्छा-पूर्ति",
      "en": "Moon in your 11th House ensures steady, diversified income channels and a loyal circle of refined associates. Your aspirations manifest smoothly through cooperative networks and the supportive patronage of women and elders.",
      "hi": "एकादश भाव में चंद्रमा होने से आय के नए-नए स्रोत बनते रहते हैं। आपकी मित्र-मंडली संभ्रांत व सहयोगी होती है और आपकी हार्दिक मनोकामनाएं समय के साथ पूर्ण होती हैं।"
    },
    "12": {
      "headlineEn": "Imaginative Subconscious Wisdom, Foreign Ties & Tranquil Seclusion",
      "headlineHi": "विदेश संपर्कों से लाभ, गहन ध्यान-साधना व अंतर्मुखी शांति",
      "en": "With the Moon in your 12th House, your inner life is rich with vivid intuition, spiritual dreams, and a need for quiet retreats. You find peace and material prosperity through foreign travel, remote work, or charitable institutions.",
      "hi": "द्वादश भाव का चंद्रमा विदेश यात्राओं, दूरस्थ कार्यों और एकांत साधना के लिए अत्यंत शुभ है। आपका मन एकांत में ध्यान और चिंतन द्वारा नवजीवन प्राप्त करता है।"
    }
  },
  "Mars": {
    "1": {
      "headlineEn": "Fierce Dynamic Initiative, Athletic Stamina & Fearless Courage",
      "headlineHi": "अदम्य ऊर्जा, असीम पराक्रम, त्वरित निर्णय व निर्भीक स्वभाव",
      "en": "Mars in your 1st House charges your constitution with electric vitality, fierce courage, and an unstoppable urge to lead from the front. You tackle obstacles head-on with decisive action; channel this fire productively and avoid hasty physical rashness.",
      "hi": "प्रथम भाव का मंगल आपको अत्यंत ऊर्जावान, साहसी और निडर बनाता है। आप किसी भी कार्य को तुरंत शुरू करने और आगे बढ़कर नेतृत्व करने में विश्वास रखते हैं। अपनी तीव्र ऊर्जा को सही दिशा में लगाना आपके लिए सफलता की कुंजी है।"
    },
    "2": {
      "headlineEn": "Assertive Financial Enterprise, Candid Speech & Resource Accumulation",
      "headlineHi": "साहसिक वित्तीय निर्णय, बेबाक वाणी व संपत्ति अर्जन की तीव्र लगन",
      "en": "Mars in your 2nd House channels fiery determination into wealth building, property acquisition, and independent capital defense. Your speech is blunt, decisive, and persuasive in competitive negotiations. Guard against impulsive expenditures and sharp spoken words within family discussions.",
      "hi": "द्वितीय भाव में मंगल आपको धन अर्जन और अचल संपत्ति संचय के लिए अत्यधिक महत्वाकांक्षी बनाता है। आपकी वाणी स्पष्ट, निर्भीक और प्रभावशाली होती है। पारिवारिक चर्चाओं में धैर्य रखना और जल्दबाजी में खर्च करने से बचना आर्थिक समृद्धि को सुरक्षित रखेगा।"
    },
    "3": {
      "headlineEn": "Supreme Heroic Valour, Pioneering Entrepreneurship & Technical Acumen",
      "headlineHi": "अद्वितीय पराक्रम, साहसिक उद्यमशीलता व तकनीकी कौशल",
      "en": "Mars in the 3rd House is classically hailed as an extraordinary harbinger of courage, self-made fortune, and competitive victory. You conquer challenges through sheer willpower, athletic discipline, and daring commercial ventures. Your brothers and peers admire your resolute grit.",
      "hi": "तृतीय भाव का मंगल शास्त्रों में अत्यंत शुभ माना गया है, जो जातक को अपार पराक्रम, पुरुषार्थ और स्व-निर्मित सफलता प्रदान करता है। आप किसी भी संकट से घबराते नहीं और अपने बाहुबल व उद्यम से विजय पताका फहराते हैं।"
    },
    "4": {
      "headlineEn": "Landed Real Estate Acumen, Mechanical Aptitude & Domestic Drive",
      "headlineHi": "भूमि-भवन का प्रबल सुख, यांत्रिक रुचि व पारिवारिक सुरक्षा का संकल्प",
      "en": "With Mars in your 4th House, landed property, real estate ownership, and vehicular assets form central spheres of focus. You invest energetic passion into fortifying your living space. Preserving peaceful domestic diplomacy and avoiding heated arguments at home nurtures deep inner calm.",
      "hi": "चतुर्थ भाव में मंगल आपको भूमि, भवन, निर्माण और वाहनों के क्रय-विक्रय में विशेष लाभ दिलाता है। आप अपनी पैतृक व स्व-अर्जित संपत्ति को दृढ़ता से सुरक्षित रखते हैं। घर में शांति और सामंजस्य बनाए रखने के लिए क्रोध और विवादों से दूर रहना श्रेयस्कर है।"
    },
    "5": {
      "headlineEn": "Sharp Tactical Intellect, Speculative Daring & Dynamic Progeny",
      "headlineHi": "कुशाग्र रणनीतिक बुद्धि, साहसिक निवेश क्षमता व ओजस्वी संतान",
      "en": "Mars in your 5th House creates a sharp, incisive intellect tailored for rapid problem-solving, engineering, and strategic execution. You enjoy intellectual challenges and calculated commercial risks. Your children possess spirited independence and athletic vigor.",
      "hi": "पंचम भाव का मंगल तीव्र विश्लेषणात्मक मेधा, त्वरित निर्णय क्षमता और साहसिक उद्यम का संकेत देता है। आप तकनीकी, वित्तीय या रणनीतिक क्षेत्रों में अपनी कुशाग्र बुद्धि से विशिष्ट सफलता अर्जित करते हैं।"
    },
    "6": {
      "headlineEn": "Invincible Shatru-Hanta Yoga, Supreme Immunity & Competitive Dominance",
      "headlineHi": "अचूक शत्रुहंता योग, उत्तम रोग-प्रतिरोधक क्षमता व निर्विवाद विजय",
      "en": "Positioned in the 6th House, Mars generates an invincible Shatru-Hanta alignment. Competitors, litigations, and debts crumble before your tireless discipline and strategic tenacity. You excel in high-stakes environments, litigation, defense, and competitive medicine.",
      "hi": "षष्ठ भाव में मंगल शत्रुहंता योग बनाता है, जिससे विरोधी, मुकदमे और ऋण आपके सामने टिक नहीं पाते। आपकी कार्य-ऊर्जा और जुझारू प्रवृत्ति आपको कार्यक्षेत्र की हर प्रतिस्पर्धा में शीर्ष पर स्थापित करती है।"
    },
    "7": {
      "headlineEn": "Passionate High-Spirited Spousal Bond, Dynamic Commercial Enterprise",
      "headlineHi": "ऊर्जावान व स्वतंत्र जीवनसाथी, साहसिक साझेदारी व स्पष्ट अनुबंध",
      "en": "Mars in the 7th House indicates a spouse of strong individuality, dynamic courage, and professional ambition. You thrive when channeling shared energy into collaborative entrepreneurship. Transparent mutual respect and patient listening neutralize marital tension and solidify lasting devotion.",
      "hi": "सप्तम भाव का मंगल एक आत्मविश्वासी, ओजस्वी और कर्मठ जीवनसाथी का संकेत देता है। व्यापारिक और वैवाहिक साझेदारी में स्पष्टता, परस्पर आदर और धैर्य रखने से यह योग अत्यंत फलदायी और लाभकारी सिद्ध होता है।"
    },
    "8": {
      "headlineEn": "Unyielding Crisis Resilience, Occult Penetration & Hidden Asset Mastery",
      "headlineHi": "संकटों से अजेय पुनरुत्थान, गूढ़ शोध व संयुक्त वित्तीय प्रबंधन",
      "en": "Mars in your 8th House bestows fierce psychological survival stamina, allowing you to rise like a phoenix from sudden disruptions. You possess a natural instinct for forensic analysis, taxation, legacy assets, and occult sciences. Cultivating emotional calmness transforms tension into profound spiritual power.",
      "hi": "अष्टम भाव में मंगल आपको भारी संकटों और अप्रत्याशित परिवर्तनों से पुनः उठ खड़े होने की अद्वितीय आंतरिक शक्ति देता है। आप वित्तीय रहस्यों, पैतृक संपत्ति और जीवन की गूढ़ गहराइयों को समझने में कुशल होते हैं।"
    },
    "9": {
      "headlineEn": "Crusading Moral Zeal, Auspicious Enterprise & High Philosophical Tenacity",
      "headlineHi": "धार्मिक सिद्धांतों के प्रति निष्ठा, साहसिक तीर्थाटन व भाग्य-निर्माण",
      "en": "Occupying your 9th House, Mars infuses an energetic passion for righteous principles, adventurous foreign travels, and higher philosophy. You forge your own fortune through bold enterprise rather than passive reliance. Mentorship under rigorous teachers refines your executive judgment.",
      "hi": "नवम भाव में मंगल आपको अपने सिद्धांतों और धर्म के प्रति समर्पित बनाता है। आप अपने पुरुषार्थ और निर्भीक निर्णयों से अपना भाग्योदय स्वयं करते हैं। लंबी यात्राओं और साहसिक योजनाओं से आपको विशेष ख्याति मिलती है।"
    },
    "10": {
      "headlineEn": "Supreme Directional Command (Digbala), Executive Authority & Industrial Victory",
      "headlineHi": "सर्वोच्च प्रशासनिक अधिकार (दिग्बल), कार्यक्षेत्र में विजय व कीर्ति",
      "en": "Reaching supreme directional strength (Digbala) in your 10th House, Mars elevates you into commanding executive, engineering, or defense leadership. You possess relentless operational tenacity that crushes obstacles and builds an enduring industry reputation.",
      "hi": "दशम भाव में मंगल का दिग्बली होना प्रशासनिक, तकनीकी, पुलिस अथवा प्रबंधकीय क्षेत्र में सर्वोच्च सफलता का सूचक है। आप कठिन से कठिन लक्ष्यों को अपने दृढ़ संकल्प से प्राप्त करते हैं।"
    },
    "11": {
      "headlineEn": "Aggressive Wealth Compounding, Influential Patrons & Triumphant Ambitions",
      "headlineHi": "प्रचुर आर्थिक लाभ, प्रभावशाली मित्रों का साथ व महत्वाकांक्षाओं की पूर्ति",
      "en": "Mars in your 11th House is celebrated across classical treatises for propelling rapid, multi-fold financial expansion and influential friendships. Your commercial undertakings yield lucrative returns, and your network is populated by energetic achievers who accelerate your ascent.",
      "hi": "एकादश भाव में मंगल का होना अकूत धन लाभ, व्यापारिक सफलता और उच्च महत्वाकांक्षाओं की सहज पूर्ति का शास्त्रीय योग है। आपकी वित्तीय योजनाएं अत्यंत सफल रहती हैं और मित्रों से पूर्ण सहयोग मिलता है।"
    },
    "12": {
      "headlineEn": "Foreign Commercial Victories, Strategic Seclusion & Inner Discipline",
      "headlineHi": "विदेश व्यापार में सफलता, गुप्त योजनाओं की सिद्धि व आध्यात्मिक तप",
      "en": "With Mars in your 12th House, your physical and entrepreneurial energy shines brightest in overseas markets, remote enterprises, and institutional seclusion. You channel fiery drive into selfless causes or international commerce while cultivating inner tranquility through disciplined meditation.",
      "hi": "द्वादश भाव में मंगल दूरस्थ देशों, विदेशी कंपनियों अथवा एकांत अनुसंधानों में विशेष सफलता दिलाता है। आप अपनी गुप्त योजनाओं को सफलतापूर्वक क्रियान्वित करते हैं। सात्विक दिनचर्या और ध्यान से आपकी ऊर्जा संतुलित रहती है।"
    }
  },
  "Mercury": {
    "1": {
      "headlineEn": "Razor-Sharp Analytical Intellect (Digbala), Wit & Commercial Brilliance",
      "headlineHi": "अद्भुत बौद्धिक मेधा (दिग्बल), वाक-पटुता, व्यापारिक दक्षता व आकर्षण",
      "en": "Reaching supreme directional strength (Digbala) in your 1st House, Mercury endows you with exceptional analytical intelligence, linguistic mastery, and youthful charm. You grasp complex subjects effortlessly and excel in commerce, publishing, and strategic diplomacy.",
      "hi": "प्रथम भाव में बुध दिग्बली होकर आपको विलक्षण बुद्धि, आकर्षक वाणी और कुशाग्र व्यापारिक सूझबूझ प्रदान करता है। आप जटिल से जटिल समस्याओं का त्वरित समाधान निकालने में निपुण होते हैं।"
    },
    "2": {
      "headlineEn": "Captivating Persuasive Eloquence, Financial Accounting & Wealth Growth",
      "headlineHi": "प्रभावशाली सम्मोहक वाणी, वित्तीय कौशल व बुद्धिबल से धन संचय",
      "en": "Mercury in your 2nd House blesses you with Saraswati Yoga attributes—sweet, scholarly, and persuasive speech that enchants listeners. Financial accumulation prospers through analytical trade, advisory consultancy, mathematical acumen, and multi-stream commerce.",
      "hi": "द्वितीय भाव में बुध आपकी वाणी को अत्यंत मधुर, विद्वत्तापूर्ण और तार्किक बनाता है। आप अपने वाक-कौशल, वित्तीय प्रबंधन और व्यापारिक बुद्धि से निरंतर धन संचय करने में सफल रहते हैं।"
    },
    "3": {
      "headlineEn": "Master Communicator, Media/Authorial Acumen & Sibling Camaraderie",
      "headlineHi": "कुशल संचारक, लेखन व प्रकाशन प्रतिभा, भाई-बहनों से सहयोग",
      "en": "With Mercury in your 3rd House, your mind excels in writing, digital communication, technical craft, and creative publishing. You possess nimble fingers, agile mental speed, and enjoy short, profitable commercial journeys alongside close collaborators.",
      "hi": "तृतीय भाव का बुध आपको उत्कृष्ट लेखक, पत्रकार, संचारक अथवा डिजिटल विशेषज्ञ बनाता है। आपकी तार्किक क्षमता और नई चीजें सीखने की उत्सुकता आपको निरंतर आगे रखती है।"
    },
    "4": {
      "headlineEn": "Scholarly Erudition, Academic Credentials & Harmonious Living",
      "headlineHi": "उच्च शैक्षणिक उपलब्धियां, विद्या लाभ, वाहन सुख व प्रसन्न चित्त",
      "en": "Mercury in your 4th House ensures distinguished academic honors, deep intellectual grounding, and a home filled with literature, technology, and refined guests. You derive emotional happiness from continuous study, teaching, and elegant conveyances.",
      "hi": "चतुर्थ भाव में बुध उच्च विद्या, प्रतिष्ठित डिग्री, और सुखद पारिवारिक वातावरण प्रदान करता है। आपका घर विद्या और ज्ञान का केंद्र बनता है और आपको आधुनिक सुख-साधनों व वाहनों का उत्तम लाभ मिलता है।"
    },
    "5": {
      "headlineEn": "Prodigious Advisory Acumen, Mantric Insight & Scholarly Children",
      "headlineHi": "विलक्षण मंत्रणा शक्ति, गहन चिंतन, शेयर/वित्तीय दूरदर्शिता व योग्य संतान",
      "en": "Mercury in the 5th House activates brilliant speculative foresight, algorithmic intellect, and deep affinity for sacred mantras and classical literature. Your counsel is sought after by leaders, and your children display exceptional scholastic talent.",
      "hi": "पंचम भाव का बुध आपको अद्भुत रणनीतिकार, सफल निवेशक और दूरदर्शी सलाहकार बनाता है। आपकी संतान अत्यंत बुद्धिमान, संस्कारी और शैक्षणिक क्षेत्र में नाम कमाने वाली होती है।"
    },
    "6": {
      "headlineEn": "Formidable Logical Defense, Flawless Audit & Problem-Solving Mastery",
      "headlineHi": "तर्क-वितर्क में अपराजेय, सूक्ष्म विश्लेषण क्षमता व संकट निवारण",
      "en": "Positioned in the 6th House, Mercury turns analytical scrutiny into an unbeatable weapon against workplace inefficiencies, audits, and legal debaters. You dismantle disputes through forensic logic and meticulous documentation.",
      "hi": "षष्ठ भाव में बुध आपको अद्वितीय तार्किक शक्ति और सूक्ष्म विश्लेषणात्मक दृष्टि देता है। आप कार्यक्षेत्र के जटिल विवादों, ऑडिट और कानूनी मामलों को अपने अकाट्य तर्कों से सुलझा लेते हैं।"
    },
    "7": {
      "headlineEn": "Intellectually Gifted Spouse, Trade Alliances & Diplomatic Success",
      "headlineHi": "बुद्धिमान व वाक-पटु जीवनसाथी, सफल व्यापारिक साझेदारी व सौम्य संबंध",
      "en": "Mercury in your 7th House indicates a life partner who is educated, witty, commercially astute, and an engaging conversationalist. Mutual intellectual respect forms the rock of your marriage, while commercial partnerships yield steady profits.",
      "hi": "सप्तम भाव का बुध एक चतुर, शिक्षित, सुरुचिपूर्ण और सहयोगी जीवनसाथी प्रदान करता है। व्यापारिक अनुबंधों और साझेदारी में आपकी कूटनीतिक समझ आपको निरंतर लाभ दिलाती है।"
    },
    "8": {
      "headlineEn": "Esoteric Research Intellect, Financial Investigation & Long Life",
      "headlineHi": "गूढ़ अनुसंधानात्मक मेधा, वित्तीय ऑडिट व दीर्घायु का वरदान",
      "en": "With Mercury in your 8th House, your mind penetrates occult mysteries, actuarial science, forensic audits, and hidden commercial structures. Classical texts praise this placement for granting long life, unexpected legacy assets, and deep meditative insight.",
      "hi": "अष्टम भाव में बुध गूढ़ विज्ञान, बीमा, ऑडिट और गुप्त वित्तीय ज्ञान के लिए अत्यंत श्रेष्ठ है। शास्त्रों के अनुसार यह स्थिति जातक को दीर्घायु और आकस्मिक धन लाभ प्रदान करती है।"
    },
    "9": {
      "headlineEn": "Philosophical Synthesis, Sacred Publishing & International Acclaim",
      "headlineHi": "उच्च दार्शनिक ज्ञान, धार्मिक ग्रंथों का अध्ययन, भाग्योदय व विदेश सम्मान",
      "en": "Mercury occupying your 9th House synthesizes sacred spiritual wisdom with pragmatic modern enterprise. You thrive in higher education, law, publishing, and international diplomacy, earning the admiration of scholars and virtuous mentors.",
      "hi": "नवम भाव का बुध धर्म, न्याय, उच्च शिक्षा और अंतरराष्ट्रीय प्रकाशन में भारी सफलता दिलाता है। आपकी तार्किक धार्मिकता और उच्च विचार आपको समाज में विशेष आदर दिलाते हैं।"
    },
    "10": {
      "headlineEn": "Executive Strategy, Commercial Leadership & Distinguished Stature",
      "headlineHi": "व्यापारिक व प्रशासनिक नेतृत्व, यश-कीर्ति व प्रतिष्ठित पद",
      "en": "In your 10th House, Mercury bestows commanding career prestige through advisory authority, business management, IT, media, or governance. You are recognized as an articulate decision-maker whose strategic foresight steers large organizations toward prosperity.",
      "hi": "दशम भाव में बुध कार्यक्षेत्र में शीर्ष पद, व्यापारिक साम्राज्य अथवा उच्च प्रशासनिक सम्मान का कारक है। आपकी कार्य-कुशलता और स्पष्ट नीति आपको उद्योग जगत में प्रतिष्ठित करती है।"
    },
    "11": {
      "headlineEn": "Multi-Stream Revenue Expansion, Brilliant Networks & Wealth Multiplication",
      "headlineHi": "आय के बहुविध साधन, प्रबुद्ध मित्र-मंडली व तीव्र आर्थिक वृद्धि",
      "en": "Mercury in your 11th House acts as a dynamic multiplier of commercial revenue, intellectual royalties, and prestigious network syndicates. Your investments yield steady compounding returns through diversified, technology-driven ventures.",
      "hi": "एकादश भाव में बुध निरंतर आर्थिक लाभ, व्यापारिक मुनाफे और विद्वान मित्रों के सहयोग का सुंदर योग है। आपकी हर योजना आय के नए-नए मार्ग प्रशस्त करती है।"
    },
    "12": {
      "headlineEn": "International Commerce, Meditative Introspection & Scholarly Solitude",
      "headlineHi": "विदेशी व्यापार में लाभ, आध्यात्मिक अध्ययन व एकांत में ज्ञान-साधना",
      "en": "With Mercury in your 12th House, your intellectual gifts flourish in multinational corporations, foreign exchange, research retreats, and spiritual literature. You achieve mental serenity by dedicating quiet hours to deep study and philanthropic service.",
      "hi": "द्वादश भाव का बुध विदेशी कंपनियों, निर्यात-आयात और एकांत शोध कार्यों के लिए अति उत्तम है। एकांत में आपका अध्ययन और रचनात्मक लेखन उच्चतम स्तर पर पहुंचता है।"
    }
  },
  "Jupiter": {
    "1": {
      "headlineEn": "Supreme Divine Protection (Digbala), Noble Stature & Expansive Wisdom",
      "headlineHi": "ईश्वरीय रक्षा कवच (दिग्बल), श्रेष्ठ संस्कार, उच्च विवेक व मान-सम्मान",
      "en": "Reaching supreme directional strength (Digbala) in your 1st House, Jupiter blesses you with a noble, dignified aura, sharp philosophical wisdom, and lifelong divine protection. You are respected as a pillar of ethical counsel and natural benevolence.",
      "hi": "प्रथम भाव में देवगुरु बृहस्पति का दिग्बली होना जीवन का सबसे बड़ा रक्षा कवच है। यह आपको उच्च संस्कार, गंभीर विवेक, उत्तम स्वास्थ्य और समाज में गुरुतुल्य आदर प्रदान करता है।"
    },
    "2": {
      "headlineEn": "Abundant Treasury Expansion, Eloquent Truthful Speech & Family Honor",
      "headlineHi": "अथाह धन संपदा, सत्यनिष्ठ प्रभावशाली वाणी व कुल की प्रतिष्ठा",
      "en": "Jupiter in your 2nd House creates a classical Dhana Yoga of the highest order. Your speech is truthful, cultured, and comforting. Substantial financial assets, precious metals, and family prosperity accumulate effortlessly through ethical enterprise.",
      "hi": "द्वितीय भाव में देवगुरु बृहस्पति का होना महान धन योग का निर्माण करता है। आपकी वाणी में ज्ञान और गंभीरता होती है, और आप परिवार के लिए निरंतर संचित धन व प्रतिष्ठा का विस्तार करते हैं।"
    },
    "3": {
      "headlineEn": "Righteous Courage, Scholarly Authorship & Blessed Sibling Ties",
      "headlineHi": "धार्मिक पराक्रम, श्रेष्ठ साहित्य सृजन व भाई-बहनों से स्नेह",
      "en": "With Jupiter in your 3rd House, your communicative efforts are guided by virtue, wisdom, and educational upliftment. You excel in philosophical writing, publishing, and mentoring others, maintaining warm, auspicious bonds with siblings.",
      "hi": "तृतीय भाव का गुरु आपके पुरुषार्थ को धर्म और ज्ञान से जोड़ता है। आप अपनी लेखन, शिक्षण और परामर्श प्रतिभा से समाज को दिशा देते हैं और भाई-बहनों के प्रिय होते हैं।"
    },
    "4": {
      "headlineEn": "Supreme Domestic Serenity, Palatial Homes & Vehicular Luxury",
      "headlineHi": "अखंड गृह सुख, विशाल भवन, श्रेष्ठ वाहन व माता का आशीर्वाद",
      "en": "Jupiter in your 4th House infuses palatial domestic comforts, spacious residences, and maternal blessings. Your home is a welcoming sanctuary of virtue, peace, and spiritual study, and you acquire prime immovable properties and comfortable conveyances.",
      "hi": "चतुर्थ भाव में बृहस्पति जातक को भव्य आवास, उत्तम वाहन, अचल संपत्ति और माता का पूर्ण स्नेह प्रदान करता है। आपका गृहस्थ जीवन सुख, शांति और समृद्धि से परिपूर्ण रहता है।"
    },
    "5": {
      "headlineEn": "Peerless Wisdom, Royal Advisory Prominence & Highly Auspicious Progeny",
      "headlineHi": "परम मेधा, मंत्रणा शक्ति, भाग्योदयकारक संतान व ईश्वरीय कृपा",
      "en": "Occupying its joy house (5th House), Jupiter bestows supreme purva-punya (past-life merit), razor-sharp advisory brilliance, and children who attain extraordinary moral and societal honors. Speculative foresight and spiritual learning flourish together.",
      "hi": "पंचम भाव का गुरु पूर्व जन्म के संचित पुण्यों को जाग्रत करता है। आपकी बुद्धि दिव्य विवेक से युक्त होती है। आपको आज्ञाकारी, यशस्वी और कुलदीपक संतान का सुख प्राप्त होता है।"
    },
    "6": {
      "headlineEn": "Effortless Conflict Resolution, Healing Compassion & Benign Victory",
      "headlineHi": "विवादों का शांतिपूर्ण समाधान, आरोग्य रक्षा व सेवा भाव से विजय",
      "en": "Jupiter in the 6th House turns adversaries into admirers through unyielding moral integrity and diplomatic benevolence. You excel in healthcare, legal reconciliation, and charitable service, maintaining sound health through disciplined, balanced living.",
      "hi": "षष्ठ भाव में गुरु अपनी सौम्यता और विवेक से शत्रुओं व विरोधियों को भी शांत कर देता है। आप चिकित्सा, न्याय अथवा परामर्श के माध्यम से दूसरों के कष्ट दूर करने में सफल रहते हैं।"
    },
    "7": {
      "headlineEn": "Virtuous Cultured Spouse, Auspicious Matrimony & Prosperous Alliances",
      "headlineHi": "विद्वान व संस्कारी जीवनसाथी, अखंड दांपत्य सुख व श्रेष्ठ साझेदारी",
      "en": "Jupiter in your 7th House is celebrated for bestowing an educated, noble-minded, and morally upright life partner. Your marriage is anchored in mutual respect, shared spiritual values, and expanding societal stature, ensuring commercial partnerships thrive.",
      "hi": "सप्तम भाव का देवगुरु एक अत्यंत संस्कारी, रूपवान, गुणी और कुलीन जीवनसाथी प्रदान करता है। वैवाहिक जीवन में सुख, शांति और समृद्धि का निरंतर विस्तार होता है।"
    },
    "8": {
      "headlineEn": "Deep Spiritual Enlightenment, Legacy Inheritances & Peaceful Longevity",
      "headlineHi": "गूढ़ आत्म-साधना, पैतृक संपत्ति का लाभ व दीर्घायु का वरदान",
      "en": "With Jupiter in your 8th House, you are shielded from catastrophic accidents and blessed with graceful, peaceful longevity. You possess natural aptitude for occult sciences, astrology, and deep meditation, receiving generous legacy inheritances.",
      "hi": "अष्टम भाव में बृहस्पति संकटों से रक्षा करता है और दीर्घायु प्रदान करता है। आप गूढ़ विद्याओं, योग और साधना में गहरी रुचि रखते हैं और पैतृक संपत्ति का पूर्ण लाभ प्राप्त करते हैं।"
    },
    "9": {
      "headlineEn": "Radiant Supreme Bhagya, Paternal Grace & Global Philosophical Honors",
      "headlineHi": "प्रबलतम भाग्योदय, गुरु-कृपा, पितृ-आशीर्वाद व अंतरराष्ट्रीय प्रतिष्ठा",
      "en": "Jupiter in your 9th House creates the pinnacle of spiritual and material fortune. Divine grace dissolves crises before they harm you, rewarding your ethical living with global honors, profound mentorship, and lasting prosperity.",
      "hi": "नवम भाव में गुरु की स्थिति साक्षात ईश्वरीय कृपा का प्रमाण है। आपके जीवन में भाग्य सदैव ढाल बनकर साथ चलता है और आप धर्म, ज्ञान व समाज में सर्वोच्च प्रतिष्ठा प्राप्त करते हैं।"
    },
    "10": {
      "headlineEn": "Authoritative Judicial/Ministerial Status, Noble Career & Revered Rank",
      "headlineHi": "उच्च प्रशासनिक/न्यायिक पद, नीतिवान नेतृत्व व समाज में विशिष्ट सम्मान",
      "en": "With Jupiter in your 10th House, your career is marked by ethical governance, judicial wisdom, and high institutional respect. You thrive in leadership roles where your integrity and strategic intellect guide collective growth.",
      "hi": "दशम भाव में बृहस्पति का प्रभाव आपको कार्यक्षेत्र में एक नीतिवान, आदरणीय और शीर्ष मार्गदर्शक के रूप में प्रतिष्ठित करता है। शिक्षा, प्रशासन या परामर्श में आप विशिष्ट ख्याति प्राप्त करते हैं।"
    },
    "11": {
      "headlineEn": "Immense Compounded Wealth, Noble Aristocratic Friends & Fulfilled Goals",
      "headlineHi": "अपार धन लाभ, संभ्रांत मित्रों का सहयोग व समस्त अभिलाषाओं की पूर्ति",
      "en": "Jupiter in your 11th House acts as a cornucopia of financial abundance, high-yielding investments, and loyal, saintly companions. Whatever worthy goals you set out to achieve manifest steadily through divine grace and communal goodwill.",
      "hi": "एकादश भाव में बृहस्पति अटूट धन लाभ, व्यापारिक विस्तार और सभी महत्वाकांक्षाओं की पूर्ति का योग बनाता है। आपके मित्र और सहयोगी उच्च चरित्र वाले होते हैं।"
    },
    "12": {
      "headlineEn": "Moksha Alignment, Sacred Philanthropy & Transcendent Peace in Seclusion",
      "headlineHi": "मोक्ष मार्ग की अग्रसरता, सात्विक दान-पुण्य व एकांत में आत्मिक शांति",
      "en": "With Jupiter in your 12th House, your soul is destined for spiritual liberation (Moksha) and profound inner serenity. You find joyous fulfillment in funding sacred temples, humanitarian relief, and pursuing solitary meditation away from worldly noise.",
      "hi": "द्वादश भाव का गुरु मोक्षकारक माना गया है। यह आपको सात्विक खर्चों, तीर्थ यात्राओं और परोपकारी कार्यों में प्रवृत्त करता है। एकांत साधना से आपको परम शांति की अनुभूति होती है।"
    }
  },
  "Venus": {
    "1": {
      "headlineEn": "Irresistible Magnetic Elegance, Artistic Charisma & Luxuriant Aura",
      "headlineHi": "सम्मोहक सौंदर्य, कलात्मक आकर्षण, ऐश्वर्य व सम्मानीय व्यक्तित्व",
      "en": "Venus in your 1st House endows you with refined physical beauty, poetic grace, and natural aesthetic magnetism. People are naturally drawn to your pleasant disposition, and you cultivate a sophisticated, joyful lifestyle surrounded by arts and fine comforts.",
      "hi": "प्रथम भाव में शुक्र आपको अत्यंत रूपवान, सुरुचिपूर्ण, आकर्षक और कलाप्रिय बनाता है। आपका व्यक्तित्व लोगों को सहज ही सम्मोहित कर लेता है और आप सुख-सुविधाओं से परिपूर्ण जीवन जीते हैं।"
    },
    "2": {
      "headlineEn": "Sweet Melodious Voice, High-Value Jewellery Assets & Family Harmony",
      "headlineHi": "मधुर वाणी, रत्न-आभूषण व बहुमूल्य संपदा का संचय, सुखी कुल",
      "en": "Venus in your 2nd House blesses you with a melodic, captivating speaking voice and exquisite taste in culinary and decorative arts. Substantial wealth accumulates through gemstones, luxury trade, hospitality, and harmonious family enterprises.",
      "hi": "द्वितीय भाव का शुक्र वाणी में आकर्षण और मिठास भरता है। आप बहुमूल्य रत्नों, आभूषणों और भौतिक संपत्तियों का संचय करते हैं। आपका परिवार समृद्ध और आपस में प्रेम रखने वाला होता है।"
    },
    "3": {
      "headlineEn": "Artistic Virtuosity, Fine Arts / Musical Talent & Sibling Warmth",
      "headlineHi": "कला, संगीत व साहित्य में निपुणता, साहसिक रचनात्मकता व बंधु सुख",
      "en": "With Venus in your 3rd House, your hands and voice are touched with creative genius in music, painting, design, or dramatic arts. You express yourself with persuasive warmth and enjoy joyful short pleasure travels.",
      "hi": "तृतीय भाव में शुक्र होने से जातक में संगीत, अभिनय, गायन, चित्रकला अथवा डिजाइनिंग में स्वाभाविक प्रतिभा होती है। आप अपने कलात्मक प्रयासों से समाज में ख्याति और स्नेह पाते हैं।"
    },
    "4": {
      "headlineEn": "Supreme Directional Bliss (Digbala), Palatial Domestic Luxury & Vehicles",
      "headlineHi": "परम सुख (दिग्बल), भव्य सुंदर आवास, विलासी वाहन व अखंड गृह-शांति",
      "en": "Reaching supreme directional strength (Digbala) in your 4th House, Venus creates an earthly paradise in your domestic sphere. You dwell in aesthetically decorated, luxurious residences, drive prestigious vehicles, and enjoy deep emotional maternal affection.",
      "hi": "चतुर्थ भाव में शुक्र दिग्बली होकर जातक को राजसी सुख प्रदान करता है। आपके पास सुंदर आवास, श्रेष्ठ वाहन और समस्त भौतिक सुख-साधन उपलब्ध रहते हैं। घर में सदैव उत्सव जैसा वातावरण रहता है।"
    },
    "5": {
      "headlineEn": "Creative Romantic Genius, Refined Pleasures & Gifted Artistic Progeny",
      "headlineHi": "रोमांटिक रचनात्मक प्रतिभा, शेयर/कला से लाभ व रूपवान-गुणी संतान",
      "en": "Venus in your 5th House activates dazzling creative imagination, romantic tenderness, and refined entertainment taste. You excel in theatrical arts, design, and speculative ventures. Your children are exceptionally charming, artistic, and cultured.",
      "hi": "पंचम भाव का शुक्र आपको प्रेम, रोमांस और कला के क्षेत्र में अत्यंत संवेदनशील और रचनात्मक बनाता है। आपको सुंदर, गुणवान और कलाप्रिय संतान का सुख मिलता है।"
    },
    "6": {
      "headlineEn": "Harmonious Workplace Diplomacy, Service Refinement & Health Balance",
      "headlineHi": "कार्यक्षेत्र में सौम्य कूटनीति, सेवा भाव व संतुलित जीवनशैली",
      "en": "Venus in the 6th House resolves routine friction and workplace disputes through tactful charm and gentle diplomacy. While you enjoy helping others, you must consciously maintain disciplined dietary habits and avoid overindulgence in rich foods.",
      "hi": "षष्ठ भाव में शुक्र कार्यस्थल पर विवादों को अपनी मधुरता से शांत करने की क्षमता देता है। स्वास्थ्य के प्रति सचेत रहकर और खानपान में संयम बरतकर आप पूर्ण आरोग्यता प्राप्त करते हैं।"
    },
    "7": {
      "headlineEn": "Malavya Mahapurusha / Exquisite Spouse, Matrimonial Bliss & Public Fame",
      "headlineHi": "अत्यंत रूपवान व समर्पित जीवनसाथी, उत्तम दांपत्य व व्यापारिक ख्याति",
      "en": "In its own house (7th House), Venus promises an exquisitely attractive, loving, and supportive spouse. Your marriage is a source of joy, social elevation, and financial compounding, while commercial partnerships flourish seamlessly.",
      "hi": "सप्तम भाव का शुक्र एक अत्यंत सुंदर, वफादार, सुशिक्षित और स्नेही जीवनसाथी का वरदान देता है। आपका दांपत्य जीवन प्रेम और सौहार्द से भरा रहता है तथा व्यापार में भारी लाभ होता है।"
    },
    "8": {
      "headlineEn": "Sensual Magnetic Depth, Secret Wealth Gains & Auspicious Dowry/Legacy",
      "headlineHi": "गूढ़ आकर्षण, आकस्मिक धन लाभ, गुप्त संपदा व दीर्घायु",
      "en": "Venus in your 8th House grants captivating mystical magnetism, unexpected windfalls through partnerships or inheritances, and a comfortable, graceful lifespan. You understand human emotions on the deepest psychological levels.",
      "hi": "अष्टम भाव में शुक्र आकस्मिक धन लाभ, वसीयत से संपत्ति और रहस्यमयी आकर्षण प्रदान करता है। यह स्थिति जातक को वैवाहिक जीवन में आर्थिक स्थिरता और दीर्घायु का आशीर्वाद देती है।"
    },
    "9": {
      "headlineEn": "Auspicious Fortune Through Arts/Spouse, Sacred Travels & Global Cultural Rise",
      "headlineHi": "कला व जीवनसाथी के माध्यम से भाग्योदय, पवित्र यात्राएं व अंतरराष्ट्रीय यश",
      "en": "Venus occupying your 9th House anchors your fortune in artistic grace, virtuous partnerships, and auspicious international journeys. You appreciate diverse world cultures and earn widespread acclaim for your generous philanthropy.",
      "hi": "नवम भाव का शुक्र विवाह उपरांत तीव्र भाग्योदय कराता है। आपकी रुचि धार्मिक अनुष्ठानों, तीर्थ यात्राओं और उच्च कला में होती है। समाज में आप एक उदार और सम्मानित व्यक्ति के रूप में जाने जाते हैं।"
    },
    "10": {
      "headlineEn": "Celebrity Stature, Artistic/Commercial Authority & High Public Acclaim",
      "headlineHi": "कार्यक्षेत्र में ग्लैमर, कला/सिनेमा/फैशन से सफलता व उच्च प्रतिष्ठा",
      "en": "Venus in your 10th House propels your career into fields of high public visibility, aesthetics, entertainment, fashion, luxury commerce, or hospitality. Your diplomatic demeanor wins the allegiance of superiors and clients alike.",
      "hi": "दशम भाव में शुक्र होने से जातक कला, मीडिया, फैशन, फिल्म, आतिथ्य अथवा सौंदर्य प्रसाधनों के व्यापार में अपार ख्याति और धन अर्जित करता है। कार्यक्षेत्र में आपका मान-सम्मान सर्वोच्च रहता है।"
    },
    "11": {
      "headlineEn": "Luxuriant Compounding Revenue, Refined Elite Circles & Joyous Desires",
      "headlineHi": "प्रचुर धन लाभ, संभ्रांत मित्र-मंडली व समस्त भौतिक इच्छाओं की सहज पूर्ति",
      "en": "Venus in your 11th House is a celestial blessing for wealth and social joy. Profits stream in continuously through creative commerce, and your network is filled with influential, cultured allies who celebrate your milestones.",
      "hi": "एकादश भाव में शुक्र का होना ऐश्वर्य, प्रचुर आर्थिक लाभ और उच्च पदस्थ मित्रों के सहयोग का सुंदर योग है। आपकी समस्त भौतिक व सांसारिक इच्छाएं सुगमता से पूर्ण होती हैं।"
    },
    "12": {
      "headlineEn": "Exalted Bed Comforts, Lavish Foreign Splendor & Spiritualized Romance",
      "headlineHi": "उत्तम शयन सुख, विदेश में विलासी जीवन, परोपकार व आत्मिक शांति",
      "en": "Classically celebrated as an exceptionally auspicious placement, Venus in the 12th House grants sumptuous comforts, exotic international travels, and romantic fulfillment. You spend joyously on beauty, charity, and spiritual rejuvenation.",
      "hi": "द्वादश भाव में शुक्र शास्त्रों में अत्यंत शुभ माना गया है। यह उत्तम शयन सुख, विदेश में वैभवशाली जीवन और परोपकारी कार्यों में धन व्यय का सुंदर योग बनाता है।"
    }
  },
  "Saturn": {
    "1": {
      "headlineEn": "Disciplined Realism, Mature Endurance & Enduring Foundations",
      "headlineHi": "कठोर अनुशासन, धैर्य, कर्तव्यनिष्ठा व स्थायी स्वावलंबन",
      "en": "Saturn in your 1st House instills serious discipline, mature patience, and an unbending work ethic. While early confidence requires patient cultivation, your adulthood builds an unshakeable, respected personal foundation that outlasts transient trends.",
      "hi": "प्रथम भाव का शनि आपको गंभीर, अनुशासित और कर्तव्यनिष्ठ बनाता है। आप जीवन में शॉर्टकट के बजाय निरंतर श्रम से आगे बढ़ते हैं। आपकी परिपक्वता और धैर्य समय के साथ आपको समाज में अत्यंत सम्मानित बनाते हैं।"
    },
    "2": {
      "headlineEn": "Frugal Treasury Fortification, Measured Cautious Speech & Rock-Solid Capital",
      "headlineHi": "मितव्ययी धन संचय, नपी-तुली गंभीर वाणी व स्थायी वित्तीय आधार",
      "en": "Saturn in your 2nd House instills disciplined thrift, prudent financial planning, and measured, cautious speech. While early finances require patient conservation, your systematic approach builds an unassailable financial fortress in mature years.",
      "hi": "द्वितीय भाव में शनि आपको धन संचय के मामले में सतर्क, मितव्ययी और अनुशासित बनाता है। आपकी वाणी गंभीर और तथ्यपरक होती है। धैर्यपूर्वक किया गया निवेश प्रौढ़ावस्था में विशाल संपत्ति का रूप ले लेता है।"
    },
    "3": {
      "headlineEn": "Tenacious Enterprise, Relentless Handcraft Mastery & Tested Courage",
      "headlineHi": "कठोर पुरुषार्थ, तकनीकी लगन, अदम्य धैर्य व स्वावलंबन",
      "en": "Saturn in the 3rd House is classically hailed as an outstanding placement for victory through grit and technical mastery. You succeed through relentless personal effort without relying on favors, earning profound respect from peers.",
      "hi": "तृतीय भाव का शनि शास्त्रों में अत्यंत शुभ माना गया है। यह जातक को धैर्यवान, साहसी और घोर परिश्रमी बनाता है। आप अपने पुरुषार्थ से जीवन में सभी बाधाओं को पार कर स्थायी सफलता अर्जित करते हैं।"
    },
    "4": {
      "headlineEn": "Enduring Landed Real Estate, Classical Architecture & Deep Responsibility",
      "headlineHi": "अचल संपत्ति का स्थायी लाभ, पुरानी परंपराओं का मान व पारिवारिक उत्तरदायित्व",
      "en": "With Saturn in your 4th House, real estate, solid structural masonry, and ancestral traditions take precedence. You take domestic responsibilities seriously. Cultivating emotional warmth balances duty with joyful family bonding.",
      "hi": "चतुर्थ भाव में शनि भूमि, भवन, निर्माण और प्राचीन संपत्तियों के स्वामित्व में विशेष सफलता देता है। आप पारिवारिक दायित्वों को पूरी निष्ठा से निभाते हैं। घर में सात्विक और शांत माहौल बनाए रखना लाभकारी है।"
    },
    "5": {
      "headlineEn": "Deep Scholarly Research, Serious Intellectual Discipline & Mature Progeny",
      "headlineHi": "गहन शोधपरक बुद्धि, अनुशासित अध्ययन व गंभीर विचारवान संतान",
      "en": "Saturn in your 5th House channels mental focus into rigorous academic disciplines, philosophy, history, or engineering. You avoid reckless speculation in favor of methodical investments. Your children are mature, disciplined, and hardworking.",
      "hi": "पंचम भाव का शनि बुद्धि को गंभीर, खोजी और दार्शनिक बनाता है। आप अध्ययन और शोध में गहरी रुचि लेते हैं। आपकी संतान कर्तव्यनिष्ठ, शांत और अपने परिश्रम से समाज में मान-सम्मान पाने वाली होती है।"
    },
    "6": {
      "headlineEn": "Crushing Victory Over Debts/Enemies, Ironclad Work Ethic & Supreme Immunity",
      "headlineHi": "शत्रुओं पर पूर्ण विजय, अटूट कर्मठता, रोग निवारण व कानूनी विजय",
      "en": "Saturn in the 6th House is a powerhouse alignment that obliterates adversaries, debts, and competitive obstacles. Your tireless endurance outlasts any opposition, securing permanent professional authority in high-stakes fields.",
      "hi": "षष्ठ भाव में शनि अत्यंत शक्तिशाली होता है। यह शत्रुओं, मुकदमों और रोगों पर अचूक विजय दिलाता है। आपकी कार्यक्षमता और सहनशीलता के आगे विरोधी स्वतः नतमस्तक हो जाते हैं।"
    },
    "7": {
      "headlineEn": "Sasa Mahapurusha (Digbala) / Mature Loyal Spouse, Unbreakable Contracts",
      "headlineHi": "दिग्बली शनि (शश योग), परिपक्व व निष्ठावान जीवनसाथी, स्थायी अनुबंध",
      "en": "Reaching supreme directional strength (Digbala) in your 7th House, Saturn grants an exceptionally loyal, mature, and dutiful life partner. Partnerships are treated with contractual sanctity, ensuring steady public prestige.",
      "hi": "सप्तम भाव में शनि दिग्बली होकर एक निष्ठावान, गंभीर, व्यावहारिक और कर्तव्यपरायण जीवनसाथी प्रदान करता है। वैवाहिक और व्यापारिक संबंध समय के साथ और अधिक प्रगाढ़ व स्थायी होते जाते हैं।"
    },
    "8": {
      "headlineEn": "Exceptional Dirghayu (Long Life), Deep Karmic Transformation & Legacies",
      "headlineHi": "पूर्ण दीर्घायु (दीर्घायु योग), पैतृक दायित्वों का निर्वहन व संकटों से मुक्ति",
      "en": "As the Ayushkaraka (significator of longevity), Saturn in the 8th House is classical assurance of a long, protected lifespan. You navigate life's deeper karmic trials with stoic patience, uncovering profound inner peace.",
      "hi": "अष्टम भाव में आयुकारक शनि का होना पूर्ण दीर्घायु का अचूक प्रमाण है। यह आपको गंभीर संकटों और दुर्घटनाओं से सुरक्षित रखता है तथा जीवन के रहस्यों को समझने की आंतरिक दृष्टि देता है।"
    },
    "9": {
      "headlineEn": "Orthodox Spiritual Discipline, Traditional Wisdom & Enduring Fortune",
      "headlineHi": "शास्त्रीय परंपराओं का पालन, धैर्यपूर्ण भाग्योदय व नैतिक मर्यादा",
      "en": "Occupying your 9th House, Saturn roots your spiritual convictions in ancient traditions, austere discipline, and ethical rectitude. Fortune matures steadily with age, rewarding your patience with unshakeable moral stature.",
      "hi": "नवम भाव में शनि जातक को प्राचीन परंपराओं, धर्मशास्त्रों और नीति का दृढ़ पालक बनाता है। आपका भाग्योदय आयु के 36वें वर्ष के पश्चात अत्यंत तीव्र और स्थायी होता है।"
    },
    "10": {
      "headlineEn": "Unstoppable Professional Rise, Tenacious Endurance & Permanent Zenith",
      "headlineHi": "कड़े श्रम से शीर्ष पद, अटूट कर्तव्यनिष्ठा व स्थायी कीर्ति",
      "en": "Saturn in your 10th House guarantees a steady, unstoppable ascent in professional authority through disciplined labor and structural mastery. Success built past age 30 remains permanent and impervious to competitive storms.",
      "hi": "दशम भाव में शनि का प्रभाव कड़े परिश्रम के उपरांत कार्यक्षेत्र में सर्वोच्च व स्थायी अधिकार दिलाता है। आपकी साख आपकी ईमानदारी और कार्य-कुशलता पर टिकी होती है, जो कभी नहीं डगमगाती।"
    },
    "11": {
      "headlineEn": "Immense Compounded Long-Term Wealth, Loyal Elder Circles & Enduring Gains",
      "headlineHi": "प्रचुर स्थायी धन लाभ, वरिष्ठ मित्रों का सहयोग व सभी लक्ष्यों की प्राप्ति",
      "en": "Saturn in your 11th House is heralded as an infallible source of massive accumulated wealth and influential senior allies. Financial returns from patient investments compound majestically, fulfilling your lifelong ambitions.",
      "hi": "एकादश भाव में शनि का होना अकूत धन, नियमित आय और दीर्घकालीन निवेशों से भारी मुनाफे का सूचक है। वरिष्ठ और अनुभवी लोगों के सहयोग से आपकी हर इच्छा पूर्ण होती है।"
    },
    "12": {
      "headlineEn": "Ascetic Inner Stillness, Foreign Structural Enterprise & Detachment",
      "headlineHi": "गहन एकांत साधना, विदेश में स्थायी कार्य व सांसारिक मोह से मुक्ति",
      "en": "With Saturn in your 12th House, you channel stamina into foreign institutions, remote infrastructure, or secluded spiritual retreats. You master the art of emotional detachment, achieving profound inner freedom.",
      "hi": "द्वादश भाव का शनि दूरस्थ स्थानों, विदेशी संस्थानों अथवा एकांत शोध में सफलता देता है। यह जातक के भीतर वैराग्य और आत्म-चिंतन की भावना जाग्रत कर मोक्ष की ओर अग्रसर करता है।"
    }
  },
  "Rahu": {
    "1": {
      "headlineEn": "Unconventional Magnetic Ambition, Trailblazing Persona & Global Vision",
      "headlineHi": "अपरंपरागत तेजस्वी व्यक्तित्व, लीक से हटकर सोचने की क्षमता व तीव्र महत्वाकांक्षा",
      "en": "Rahu in your 1st House instills an extraordinary drive to stand apart from the crowd, shatter conventional molds, and build a distinctive personal identity. You navigate complex social terrain with shrewd acumen and foreign adaptability.",
      "hi": "प्रथम भाव का राहु आपको अत्यंत महत्वाकांक्षी, दूरदर्शी और अद्वितीय व्यक्तित्व प्रदान करता है। आप समाज की पुरानी सीमाओं को तोड़कर नई राह बनाने में विश्वास रखते हैं।"
    },
    "2": {
      "headlineEn": "Unconventional Wealth Streams, Foreign Currency Gains & Sharp Persuasion",
      "headlineHi": "विदेशी स्रोतों से धन लाभ, तकनीकी/नवीन व्यापार व वाक-चातुर्य",
      "en": "Rahu in your 2nd House creates innovative, unorthodox avenues for wealth generation—digital assets, foreign currencies, import/export, and media. Your communication is persuasive and commercially shrewd.",
      "hi": "द्वितीय भाव में राहु विदेशी मुद्रा, आधुनिक तकनीक और नए व्यापारिक माध्यमों से अकूत धन कमाने की प्रेरणा देता है। आपकी बातचीत में दूसरों को प्रभावित करने का अनूठा कौशल होता है।"
    },
    "3": {
      "headlineEn": "Fearless Digital/Media Enterprise, Audacious Courage & High Momentum",
      "headlineHi": "अद्भुत पराक्रम, डिजिटल/मीडिया में अपार सफलता व अदम्य साहस",
      "en": "Classically celebrated as an exceptional placement, Rahu in the 3rd House endows you with fearless courage, media savvy, and pioneering communication power. You crush hesitation and build triumphant ventures through daring initiative.",
      "hi": "तृतीय भाव में राहु को शास्त्र अत्यंत शुभ मानते हैं। यह जातक को निर्भीक, साहसी और मीडिया, तकनीक या संचार के क्षेत्र में अप्रत्याशित सफलता दिलाने वाला बनाता है।"
    },
    "4": {
      "headlineEn": "Exotic Modern Architecture, Geographic Mobility & Tech-Driven Homes",
      "headlineHi": "आधुनिक सुख-सुविधाओं से युक्त आवास, विदेशी भूमि पर निवास व वाहन सुख",
      "en": "Rahu in your 4th House draws your domestic ambitions toward cosmopolitan cities, foreign residences, and futuristic living technologies. Creating a calm, grounding sanctuary anchors your restless imagination.",
      "hi": "चतुर्थ भाव का राहु जातक को बड़े नगरों या विदेश में सुंदर घर, अत्याधुनिक वाहन और भौतिक सुख-साधन उपलब्ध कराता है। मानसिक शांति के लिए योग व ध्यान अत्यंत उपयोगी हैं।"
    },
    "5": {
      "headlineEn": "Innovative Speculative Intellect, Tech Acumen & Unconventional Creations",
      "headlineHi": "अपरंपरागत कुशाग्र बुद्धि, शेयर/तकनीकी में भारी लाभ व रचनात्मक प्रतिभा",
      "en": "Rahu in your 5th House sparks a brilliant, out-of-the-box intellect suited for algorithmic trading, software innovation, cinema, and modern design. You challenge traditional paradigms and make bold, profitable speculative leaps.",
      "hi": "पंचम भाव में राहु आधुनिक शोध, कंप्यूटर, शेयर बाजार और सिनेमा/कला में विलक्षण प्रतिभा प्रदान करता है। आपकी सोच समय से आगे की होती है।"
    },
    "6": {
      "headlineEn": "Total Domination Over Rivals, Shatru-Hanta Glory & Legal Invincibility",
      "headlineHi": "शत्रुओं पर पूर्ण विजय (शत्रुहंता), प्रतियोगी परीक्षाओं में सफलता व अजेयता",
      "en": "In the 6th House, Rahu achieves supreme glory as an invincible destroyer of adversaries, competitive rivals, and health ailments. You thrive in contentious environments, outmaneuvering obstacles with tactical brilliance.",
      "hi": "षष्ठ भाव में राहु अत्यंत बलवान होकर समस्त विरोधियों, मुकदमों और रोगों का समूल नाश करता है। प्रतियोगिता और कार्यक्षेत्र में आपकी विजय निश्चित होती है।"
    },
    "7": {
      "headlineEn": "Charismatic Non-Traditional Spouse, Foreign Alliances & Public Expansion",
      "headlineHi": "आकर्षक व अपरंपरागत जीवनसाथी, विदेशी व्यापार व व्यापक जन-संपर्क",
      "en": "Rahu in your 7th House often indicates a life partner from a different cultural, geographic, or innovative background. Collaborative partnerships in global commerce or digital media expand your public influence dramatically.",
      "hi": "सप्तम भाव का राहु भिन्न पृष्ठभूमि या दूरस्थ स्थान के आकर्षक जीवनसाथी का संकेत देता है। अंतरराष्ट्रीय व्यापार और जन-संपर्क में आपको भारी सफलता मिलती है।"
    },
    "8": {
      "headlineEn": "Occult Research Mastery, Sudden Windfalls & Deep Mystical Transformation",
      "headlineHi": "आकस्मिक धन लाभ, गूढ़ विद्याओं का ज्ञान व रहस्यों का भेदन",
      "en": "With Rahu in your 8th House, your mind penetrates occult mysteries, investigative analysis, and transformative financial windfalls. You navigate sudden shifts with surprising adaptability, uncovering hidden reserves of power.",
      "hi": "अष्टम भाव में राहु अचानक धन लाभ, वसीयत, शोध और गुप्त विद्याओं में गहरी रुचि उत्पन्न करता है। आप संकट के समय अप्रत्याशित रूप से उभरकर सामने आते हैं।"
    },
    "9": {
      "headlineEn": "Cross-Cultural Philosophical Horizons, Global Travels & Maverick Fortune",
      "headlineHi": "वैश्विक दृष्टिकोण, विदेशी तीर्थाटन, अपरंपरागत भाग्योदय व दूरगामी विचार",
      "en": "Rahu occupying your 9th House drives you toward foreign philosophies, global pilgrimages, and unconventional wisdom. Your fortune expands exponentially when you break free from local confines and embrace cosmopolitan horizons.",
      "hi": "नवम भाव का राहु जातक को संकीर्ण सीमाओं से निकालकर वैश्विक ज्ञान और विदेशी संपर्कों से जोड़ता है। विदेश यात्राओं और नए विचारों से आपका भाग्योदय होता है।"
    },
    "10": {
      "headlineEn": "Meteoric Professional Ascent, High Tech/Media Leadership & Global Fame",
      "headlineHi": "कार्यक्षेत्र में अप्रत्याशित तीव्र प्रगति, तकनीक व मीडिया में शीर्ष पद व यश",
      "en": "In your 10th House, Rahu creates a powerful engine for meteoric career advancement, institutional influence, and widespread public acclaim in high-tech, politics, media, or international commerce.",
      "hi": "दशम भाव में राहु का होना करियर में रातों-रात ऊंची छलांग लगाने और समाज में विशिष्ट पहचान बनाने का अचूक योग है। आप बड़े जनसमूह या संस्थाओं का नेतृत्व करते हैं।"
    },
    "11": {
      "headlineEn": "Spectacular Compounding Inflows, Elite Global Networks & Manifested Ambitions",
      "headlineHi": "अथाह आर्थिक लाभ, विदेशी व प्रभावशाली मित्रों का साथ व पूर्ण मनोकामना",
      "en": "Classically hailed as a premier wealth generator, Rahu in the 11th House showers continuous, diversified financial windfalls through modern ventures and influential international alliances.",
      "hi": "एकादश भाव में राहु अपार धन लाभ, कई स्रोतों से आय और प्रभावशाली मित्रों के सहयोग का वरदान देता है। आपकी बड़ी से बड़ी महत्वाकांक्षाएं साकार होती हैं।"
    },
    "12": {
      "headlineEn": "Seamless Foreign Settlement, Global Enterprise & Mystical Subconscious Peace",
      "headlineHi": "विदेश में स्थायी निवास, अंतरराष्ट्रीय व्यापार व ध्यान-साधना में सफलता",
      "en": "With Rahu in your 12th House, long-term foreign settlement, international contracts, and spiritual voyages become prime catalysts for success. You thrive when operating across borders or in serene retreats.",
      "hi": "द्वादश भाव का राहु विदेश गमन, विदेशी कंपनियों में रोजगार और एकांत में नई ऊर्जा प्राप्त करने के लिए अत्यंत फलदायी माना गया है।"
    }
  },
  "Ketu": {
    "1": {
      "headlineEn": "Profound Intuitive Perception, Spiritual Detachment & Deep Inner Truth",
      "headlineHi": "गहन आत्म-बोध, आध्यात्मिक अंतर्दृष्टि, अनासक्ति व सूक्ष्म निरीक्षण",
      "en": "Ketu in your 1st House bestows an enigmatic, contemplative personality with an innate disinterest in superficial vanity. You possess razor-sharp psychic intuition, spiritual depth, and the ability to look right through pretense.",
      "hi": "प्रथम भाव का केतु आपको अंतर्मुखी, गंभीर और अत्यंत सूक्ष्म अंतर्दृष्टि वाला बनाता है। आप सांसारिक दिखावे से दूर रहकर आत्म-साक्षात्कार और सत्य की खोज में रुचि रखते हैं।"
    },
    "2": {
      "headlineEn": "Spiritualized Voice, Detached Financial Mastery & Ancestral Wisdom",
      "headlineHi": "गूढ़ आध्यात्मिक वाणी, धन के प्रति अनासक्ति किंतु पर्याप्त संचय",
      "en": "Ketu in your 2nd House turns speech toward philosophical truths, ancient mantras, and insightful brevity. While you maintain inner detachment from material greed, financial resources flow adequately through focused expertise.",
      "hi": "द्वितीय भाव में केतु वाणी में सत्य और गहराई लाता है। आप धन के प्रति अनावश्यक लोभ नहीं रखते, फिर भी आपकी आवश्यकताएं सहज ही पूर्ण होती रहती हैं।"
    },
    "3": {
      "headlineEn": "Silent Heroic Valour, Intuitive Strategy & Unflinching Independence",
      "headlineHi": "मौन पराक्रम, अंतर्ज्ञानी रणनीतिक कौशल व स्वतंत्र निर्णय क्षमता",
      "en": "Classically praised in the 3rd House, Ketu bestows unflinching courage, profound technical intuition, and triumph over challenges through quiet, self-reliant determination.",
      "hi": "तृतीय भाव का केतु जातक को निडर, साहसी और स्वतंत्र विचार वाला बनाता है। आप बिना किसी प्रचार के अपने कठिन लक्ष्यों को सिद्ध कर लेते हैं।"
    },
    "4": {
      "headlineEn": "Spiritual Sanctuary at Home, Maternal Detachment & Meditative Peace",
      "headlineHi": "आध्यात्मिक गृह-वातावरण, अंतर्मुखी शांति व ध्यान-साधना का सुख",
      "en": "Ketu in your 4th House encourages a meditative, tranquil domestic environment. You seek spiritual peace within your living space rather than superficial luxury, finding true serenity through inner reflection.",
      "hi": "चतुर्थ भाव में केतु घर के भीतर शांति और साधना का वातावरण निर्मित करता है। आप भौतिक सुखों से अधिक मानसिक व आत्मिक शांति को प्राथमिकता देते हैं।"
    },
    "5": {
      "headlineEn": "Intuitive Genius, Deep Mantric Insight & Spiritually Gifted Progeny",
      "headlineHi": "विलक्षण अंतःप्रज्ञा, पूर्व जन्म के पुण्य, मंत्र सिद्धि व संस्कारवान संतान",
      "en": "Ketu in your 5th House connects you with deep past-life spiritual merit (purva-punya), occult mathematics, and sacred wisdom. Your children are philosophically inclined and carry high spiritual awareness.",
      "hi": "पंचम भाव का केतु पूर्व जन्म की साधना को जाग्रत करता है। आपकी बुद्धि में स्वाभाविक रूप से गूढ़ ज्ञान और मंत्र शक्ति का प्रभाव होता है।"
    },
    "6": {
      "headlineEn": "Effortless Elimination of Obstacles, Natural Healing & Invincible Protection",
      "headlineHi": "बाधाओं का स्वतः निवारण, प्राकृतिक रोग-मुक्ति व गुप्त शत्रुओं पर विजय",
      "en": "In the 6th House, Ketu operates as a potent shield, quietly neutralizing adversaries, debts, and ailments before they manifest. You possess natural healing instincts and resilience.",
      "hi": "षष्ठ भाव में केतु शत्रुओं और रोगों पर सहज विजय दिलाता है। आपके विरोधी आपका अहित नहीं कर पाते और आपका स्वास्थ्य सुरक्षित रहता है।"
    },
    "7": {
      "headlineEn": "Spiritually Oriented Spouse, Karmic Matrimony & Non-Material Bond",
      "headlineHi": "आध्यात्मिक जीवनसाथी, पूर्व जन्म का कार्मिक संबंध व गहरा आत्मिक लगाव",
      "en": "Ketu in the 7th House indicates a spouse with quiet spiritual wisdom, simplicity, and philosophical depth. Your marital relationship thrives on subtle soul connection rather than worldly show.",
      "hi": "सप्तम भाव का केतु एक गंभीर, धार्मिक और सात्विक स्वभाव के जीवनसाथी का संकेत देता है। आपका वैवाहिक संबंध आत्मिक स्तर पर अधिक प्रगाढ़ होता है।"
    },
    "8": {
      "headlineEn": "Supreme Occult Mastery, Kundalini Awakening & Research Excellence",
      "headlineHi": "गूढ़ साधना में सिद्धि, कुंडलिनी जागरण की क्षमता व रहस्यों का भेदन",
      "en": "Ketu in your 8th House is an extraordinary placement for occult sciences, astrology, forensic research, and spiritual transformation. You possess the rare ability to tap into hidden dimensions of reality.",
      "hi": "अष्टम भाव में केतु ज्योतिष, तंत्र, योग और गुप्त विद्याओं में उच्च सिद्धि प्रदान करता है। आपकी अंतर्दृष्टि अदृश्य सत्यों को देख सकती है।"
    },
    "9": {
      "headlineEn": "Sacred Pilgrimages, Devotion to Liberation (Moksha) & Ancient Lineage",
      "headlineHi": "पवित्र तीर्थ यात्राएं, मोक्ष की अभिलाषा, गुरु-भक्ति व सात्विक जीवन",
      "en": "Ketu in your 9th House leads you to revered spiritual shrines, sacred rivers, and enlightened masters. You value direct mystical experience over dry dogma, ascending toward higher consciousness.",
      "hi": "नवम भाव का केतु जातक को तीर्थ यात्राओं, वेदों के अध्ययन और संतों की संगति में आनंद देता है। आपका भाग्योदय सात्विक आचरण से होता है।"
    },
    "10": {
      "headlineEn": "Ego-Free Executive Mastery, Non-Profit Leadership & Unshakable Stature",
      "headlineHi": "निस्वार्थ कर्मयोग, कार्यक्षेत्र में निष्ठावान नेतृत्व व उच्च नैतिक साख",
      "en": "With Ketu in your 10th House, you discharge high professional responsibilities with dedicated excellence while remaining internally free from ego. Your quiet competence earns deep institutional trust.",
      "hi": "दशम भाव में केतु जातक को निष्काम कर्मयोगी बनाता है। आप बिना किसी अहंकार के अपने कार्य में शीर्ष कुशलता दिखाते हैं, जिससे समाज में आपकी प्रतिष्ठा बढ़ती है।"
    },
    "11": {
      "headlineEn": "Unexpected Compounding Inflows, Ascetic Friends & Detached Prosperity",
      "headlineHi": "आकस्मिक धन लाभ, सात्विक मित्रों का सहयोग व संतोषजनक आर्थिक स्थिति",
      "en": "Classically praised in the 11th House, Ketu generates unexpected financial gains and brings association with virtuous, intellectually refined companions while maintaining peace of mind.",
      "hi": "एकादश भाव में केतु अप्रत्याशित रूप से धन लाभ कराता है। आपकी मित्र-मंडली संस्कारी होती है और आप अपनी उपलब्धियों से संतुष्ट रहते हैं।"
    },
    "12": {
      "headlineEn": "Supreme Moksha Karaka, Spiritual Liberation & Transcendent Seclusion",
      "headlineHi": "मोक्ष का अचूक योग (मोक्षकारक), परम आत्मिक शांति व ध्यान समाधि",
      "en": "Occupying its pinnacle placement (12th House), Ketu operates as the supreme harbinger of spiritual emancipation (Moksha). You experience profound states of meditative stillness, dream lucidity, and divine liberation.",
      "hi": "द्वादश भाव में केतु साक्षात मोक्ष का द्वार खोलता है। यह स्थिति जातक को ध्यान, समाधि और ईश्वरीय प्रेम में लीन कर परम शांति प्रदान करती है।"
    }
  }
};

export function getPropheticPlanetReading(input: PropheticPlanetInput): PropheticPlanetReading {
  const { planetId, houseNumber: h, signNameEn, signNameHi, dignity, isRetrograde, isCombust, isOuterPlanet } = input;
  const ord = getOrdinalSuffix(h);

  if (isOuterPlanet) {
    const outerDescEn: Record<string, string> = {
      Uranus: `Uranus in your ${ord} House (${signNameEn}) introduces sudden paradigm shifts, revolutionary breakthroughs, and unconventional originality to this life sector. You refuse to conform to outdated dogmas and achieve breakthroughs through forward-looking innovation.`,
      Neptune: `Neptune occupying your ${ord} House (${signNameEn}) casts a veil of high artistic imagination, spiritual idealism, and intuitive depth over this area. Guard against ambiguous illusions while channeling your refined visionary empathy.`,
      Pluto: `Pluto placed in your ${ord} House (${signNameEn}) catalyzes profound psychological transformation, deep power dynamics, and the capacity for total rebirth after crisis in this sphere.`,
    };
    const outerDescHi: Record<string, string> = {
      Uranus: `हर्षल (Uranus) का आपकी कुंडली के ${h}वें भाव (${signNameHi}) में होना जीवन के इस क्षेत्र में क्रांतिकारी परिवर्तन, अप्रत्याशित सफलता और लीक से हटकर नए विचारों का संचार करता है।`,
      Neptune: `नेपच्यून का ${h}वें भाव (${signNameHi}) में प्रभाव आपकी कल्पनाशीलता, सूक्ष्म कलात्मक बोध और आध्यात्मिक संवेदना को अत्यधिक प्रखर बनाता है।`,
      Pluto: `प्लूटो का ${h}वें भाव (${signNameHi}) में बैठना इस क्षेत्र में गहन आत्म-रूपांतरण, सत्ता व प्रभाव के विस्तार और संकटों के उपरांत नए जीवन के उदय का संकेत देता है।`,
    };

    return {
      lifeImpactHeadlineEn: `${planetId} Transformative Influence in ${ord} House`,
      lifeImpactHeadlineHi: `${planetId} का ${h}वें भाव में रूपांतरणकारी प्रभाव`,
      propheticReadingEn: outerDescEn[planetId] || `${planetId} exercises subtle generational influences over your ${ord} house.`,
      propheticReadingHi: outerDescHi[planetId] || `${planetId} आपके ${h}वें भाव पर सूक्ष्म दूरगामी प्रभाव डालता है।`,
    };
  }

  const pData = VEDIC_PROPHETIC_MATRIX[planetId]?.[h];
  let headlineEn = pData?.headlineEn || `${planetId} Influences in ${ord} House`;
  let headlineHi = pData?.headlineHi || `${planetId} का ${h}वें भाव में फल`;
  let readingEn = pData?.en;
  let readingHi = pData?.hi;

  if (!readingEn) {
    readingEn = `${planetId} placed in your ${ord} House (${signNameEn}) shapes this domain through its innate planetary nature. Operating with ${dignity} dignity, it rewards conscious cultivation and patient alignment with its natural virtues.`;
    readingHi = `${planetId} का आपकी कुंडली के ${h}वें भाव (${signNameHi}) में स्थित होना इस क्षेत्र को विशिष्ट ऊर्जा प्रदान करता है। ग्रह की ${dignity} स्थिति के अनुसार आपके प्रयास अनुकूल फल प्रदान करेंगे।`;
  }

  // Modifiers for retrograde or combust
  if (isRetrograde) {
    readingEn += ` Being in retrograde motion, its internal psychological drive is heightened, urging you to review and master these themes through self-reflection.`;
    readingHi += ` ग्रह के वक्री होने से इसका आंतरिक प्रभाव गहरा होता है, जिससे आपको इस क्षेत्र में आत्म-मंथन से विशेष लाभ होगा।`;
  }
  if (isCombust) {
    readingEn += ` Proximity to the Sun calls for patient maturity, refining your motives through hard-earned experience before material rewards mature.`;
    readingHi += ` सूर्य के सान्निध्य में होने से इस ग्रह के फलों में प्रारंभिक परिश्रम के बाद ही पूर्ण लाभ प्राप्त होगा।`;
  }

  return {
    lifeImpactHeadlineEn: headlineEn,
    lifeImpactHeadlineHi: headlineHi,
    propheticReadingEn: readingEn,
    propheticReadingHi: readingHi,
  };
}
