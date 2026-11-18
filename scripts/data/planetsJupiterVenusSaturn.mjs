// scripts/data/planetsJupiterVenusSaturn.mjs
// Jupiter, Venus, and Saturn: 12 Houses each (36 records)

export const JUPITER_HOUSES = [
  {
    planet: 'Jupiter',
    planetHi: 'बृहस्पति (गुरु)',
    house: 1,
    titleEn: 'Jupiter in 1st House (Lagna)',
    titleHi: 'बृहस्पति प्रथम भाव (लग्न) में',
    baseEn: 'Noble character, majestic personality, golden complexion, wise, fortunate, Hamsa Mahapurusha yoga if in own or exalted sign. Divine protection across life, judicial authority.',
    baseHi: 'सदाचारी, तेजस्वी व भव्य व्यक्तित्व, गौर-स्वर्ण वर्ण, परम ज्ञानी, भाग्यवान, स्वराशि या उच्च में होने पर हंस महापुरुष योग। जीवनपर्यंत ईश्वरीय कृपा व रक्षा, न्यायप्रियता।',
    ageMilestones: [
      { age: 16, nature: 'favorable', eventEn: 'Early spiritual initiation, scholastic excellence, preceptor blessings.', eventHi: 'धार्मिक संस्कार, विद्या में सर्वोच्च स्थान, गुरुजनों का आशीर्वाद।' },
      { age: 26, nature: 'favorable', eventEn: 'Major fortune dawn, prestigious marriage, or executive authority.', eventHi: 'विशाल भाग्योदय, कुलीन विवाह अथवा उच्च प्रशासनिक पद की प्राप्ति।' },
      { age: 36, nature: 'career', eventEn: 'Apex of societal wisdom, ministerial rank, spiritual preceptor.', eventHi: 'समाज में सर्वोच्च गुरुतुल्य सम्मान, मंत्री पद या धर्मगुरु का स्थान।' }
    ],
    signModifiers: {
      Cancer: { en: 'Exalted: Hamsa Mahapurusha yoga: Supreme divine protection, world teacher, sovereign honor.', hi: 'उच्च राशि (कर्क): हंस महापुरुष योग: सर्वोच्च ईश्वरीय रक्षा, जगद्गुरु, राजसम्मान।' },
      Capricorn: { en: 'Debilitated: Loss of moral dignity, liver ailments, skepticism, social alienation.', hi: 'नीच राशि (मकर): नैतिक संशय, यकृत (लीवर) विकार, परंपराओं से विमुखता।' },
      Sagittarius: { en: 'Own Sign: Dharmic sovereign, spotless reputation, profound judicial wisdom.', hi: 'स्वराशि (धनु): धर्म ध्वजवाहक, निष्कलंक कीर्ति, अद्वितीय न्याय प्रज्ञा।' }
    },
    aspectModifiers: [
      { graha: 'Sun', conditionEn: 'With or aspected by Sun', conditionHi: 'सूर्य से युति या दृष्टि', effectEn: 'Royal preceptor, high government advisory rank, noble soul.', effectHi: 'राजपुरोहित, शासन में सर्वोच्च सलाहकार, परम सात्विक आत्मा।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, extraordinarily virtuous, devoted wife, noble mother, revered by family and society, brings all-round prosperity.',
      hi: 'स्त्री जातक में परम विदुषी, पतिव्रता, आदर्श माता, परिवार व समाज में पूजनीया, सौभाग्यदायिनी।'
    }
  },
  {
    planet: 'Jupiter',
    planetHi: 'बृहस्पति (गुरु)',
    house: 2,
    titleEn: 'Jupiter in 2nd House (Dhana Bhava)',
    titleHi: 'बृहस्पति द्वितीय भाव (धन भाव) में',
    baseEn: 'Impeccable speech, immense wealth, truthful, banker, astrologer, family prosperity, rich in gold and lands. Eloquent and scholarly voice.',
    baseHi: 'सत्य व मधुर वाणी, विपुल धन-धान्य, सत्यवादी, बैंकर, ज्योतिषी, कुटुंब में सुख-समृद्धि, स्वर्ण व भूमि का स्वामी। विद्वत्तापूर्ण वाणी।',
    ageMilestones: [
      { age: 16, nature: 'favorable', eventEn: 'Dawn of scholarship, family prosperity, academic honors.', eventHi: 'विद्या में प्रगति, कुटुंब में समृद्धि, अकादमिक सम्मान।' },
      { age: 32, nature: 'favorable', eventEn: 'Financial summit, massive accumulation of gold and real estate.', eventHi: 'आर्थिक समृद्धि का शिखर, स्वर्ण व स्थाई संपत्तियों का विपुल संचय।' }
    ],
    signModifiers: {
      Cancer: { en: 'Exalted: Multi-millionaire, treasurer of immense wealth, saintly family.', hi: 'उच्च राशि: कुबेर तुल्य धन, अक्षय खजाने का स्वामी, सात्विक कुटुंब।' },
      Capricorn: { en: 'Debilitated: Financial volatility, speech harshness under frustration.', hi: 'नीच राशि: धन संचय में बाधा, निराशा में वाणी में कटुता।' }
    },
    aspectModifiers: [
      { graha: 'Sun', conditionEn: 'Aspected by Sun', conditionHi: 'सूर्य की दृष्टि', effectEn: 'Wealth from government treasuries, royal honors, high financial office.', effectHi: 'राजकोष से धन लाभ, राजकीय सम्मान, वित्त मंत्रालय में उच्च पद।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, eloquent, rich in gold and jewels, truthful, peaceful household, gracious hostess.',
      hi: 'स्त्री जातक में मधुर व सत्य वाणी, स्वर्ण व आभूषणों से संपन्न, कुल में शांति व समृद्धि।'
    }
  },
  {
    planet: 'Jupiter',
    planetHi: 'बृहस्पति (गुरु)',
    house: 3,
    titleEn: 'Jupiter in 3rd House (Sahaja Bhava)',
    titleHi: 'बृहस्पति तृतीय भाव (सहज भाव) में',
    baseEn: 'Philosophical writings, modest siblings, spiritual travels, optimistic courage, excels in publishing, teaching, and spiritual treatises.',
    baseHi: 'दार्शनिक लेखन, सुसंस्कृत सहोदर, तीर्थ व ज्ञान यात्राएं, सात्विक पराक्रम, प्रकाशन, शिक्षण व आध्यात्मिक ग्रंथों में सफलता।',
    ageMilestones: [
      { age: 22, nature: 'career', eventEn: 'Publication of scholarly paper or initiation of spiritual teaching.', eventHi: 'शोध पत्र का प्रकाशन अथवा आध्यात्मिक शिक्षण का प्रारंभ।' },
      { age: 35, nature: 'favorable', eventEn: 'High renown through literary authorship or successful spiritual travels.', eventHi: 'साहित्यिक लेखन या तीर्थ यात्राओं द्वारा प्रतिष्ठा का विस्तार।' }
    ],
    signModifiers: {
      Cancer: { en: 'Exalted: Celebrated spiritual author, devoted siblings, heroic righteous valor.', hi: 'उच्च राशि: ख्यातिलब्ध आध्यात्मिक लेखक, सहोदरों का पूर्ण सुख, धर्म पराक्रम।' },
      Capricorn: { en: 'Debilitated: Strained relations with siblings, frustrated literary efforts.', hi: 'नीच राशि: सहोदरों से मतभेद, लेखन में निराशा, संकोची स्वभाव।' }
    },
    aspectModifiers: [
      { graha: 'Mars', conditionEn: 'With Mars', conditionHi: 'मंगल से युति', effectEn: 'Righteous warrior, defense leadership, energetic intellectual champion.', effectHi: 'धर्म योद्धा, सेनानायक, ऊर्जावान बौद्धिक नेतृत्वकर्ता।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, modest, virtuous sisters, devoted to religious readings, graceful communication.',
      hi: 'स्त्री जातक में विदुषी, सुसंस्कृत बहनें, धार्मिक ग्रंथों के पठन में रुचि, सौम्य व्यवहार।'
    }
  },
  {
    planet: 'Jupiter',
    planetHi: 'बृहस्पति (गुरु)',
    house: 4,
    titleEn: 'Jupiter in 4th House (Sukha Bhava)',
    titleHi: 'बृहस्पति चतुर्थ भाव (सुख भाव) में',
    baseEn: 'Vast lands, palace-like home, blessed saintly mother, scholarly degrees, divine peace of mind, luxurious conveyances.',
    baseHi: 'विशाल भू-संपत्ति, भव्य प्रासाद तुल्य गृह, परम सात्विक माता, उच्च अकादमिक उपाधियां, अगाध आत्मिक शांति, उत्तम वाहन।',
    ageMilestones: [
      { age: 16, nature: 'favorable', eventEn: 'Scholastic distinction, maternal blessings, home harmony.', eventHi: 'अकादमिक सर्वोच्चता, माता का अगाध स्नेह, पारिवारिक शांति।' },
      { age: 22, nature: 'favorable', eventEn: 'Acquisition of splendid home or ancestral estate enhancement.', eventHi: 'सुंदर मकान, वाहन व पैतृक संपत्ति में सुखद वृद्धि।' },
      { age: 38, nature: 'favorable', eventEn: 'Establishment of philanthropic foundation or spiritual retreat.', eventHi: 'धर्मार्थ संस्थान या आध्यात्मिक आश्रम की स्थापना।' }
    ],
    signModifiers: {
      Cancer: { en: 'Exalted: Palatial divine residence, saintly mother, unbroken happiness.', hi: 'उच्च राशि: देवतुल्य भव्य भवन, साध्वी माता, अखंड सुख-शांति।' },
      Capricorn: { en: 'Debilitated: Discontent in domestic life, maternal liver ailments, property issues.', hi: 'नीच राशि: गृह सुख में असंतोष, माता को स्वास्थ्य कष्ट, भूमि विवाद।' }
    },
    aspectModifiers: [
      { graha: 'Moon', conditionEn: 'With Moon (Gajakesari Yoga)', conditionHi: 'चन्द्रमा से युति (गजकेसरी योग)', effectEn: 'Supreme Gajakesari yoga: Immense comforts, royal status, universal love.', effectHi: 'सर्वोच्च गजकेसरी योग: अखंड सुख, राजसी ठाट-बाट, सर्वप्रियता।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, pure heart, prosperous home, blessed maternal happiness, revered family matriarch.',
      hi: 'स्त्री जातक में पवित्र हृदय, समृद्ध गृहस्थी, उत्तम मातृ सुख, कुल की आदरणीय संरक्षिका।'
    }
  },
  {
    planet: 'Jupiter',
    planetHi: 'बृहस्पति (गुरु)',
    house: 5,
    titleEn: 'Jupiter in 5th House (Suta Bhava)',
    titleHi: 'बृहस्पति पंचम भाव (संतान व बुद्धि भाव) में',
    baseEn: 'Supreme intellect, Mantrajna, highly virtuous progeny, government minister, divine intuition. Karako Bhava Nashaya rule applies if single in 5th without aspects (delay in children).',
    baseHi: 'सर्वोच्च प्रज्ञा, मंत्रज्ञानी, परम सदाचारी संतान, राजकीय मंत्री, अंतर्ज्ञान। अकेले होने पर कारको भाव नाशाय नियम से संतान में विलंब संभव, किंतु संतति अत्यंत भाग्यवान होती है।',
    ageMilestones: [
      { age: 16, nature: 'favorable', eventEn: 'Spiritual mantra initiation, academic genius, state scholarship.', eventHi: 'मंत्र दीक्षा, अकादमिक मेधा, राजकीय छात्रवृत्ति।' },
      { age: 28, nature: 'favorable', eventEn: 'Birth of illustrious child or major spiritual treatise creation.', eventHi: 'प्रतापी संतान का जन्म अथवा महान बौद्धिक ग्रंथ का निर्माण।' }
    ],
    signModifiers: {
      Cancer: { en: 'Exalted: Sovereign advisor, supreme spiritual intellect, noble children.', hi: 'उच्च राशि: शासन का शीर्ष नीति सलाहकार, दिव्य बुद्धि, प्रतापी संतान।' },
      Capricorn: { en: 'Debilitated: Delay and anxiety regarding children, digestive weakness.', hi: 'नीच राशि: संतान प्राप्ति में विलंब व चिंता, पाचन दुर्बलता।' }
    },
    aspectModifiers: [
      { graha: 'Sun', conditionEn: 'With Sun', conditionHi: 'सूर्य से युति', effectEn: 'Supreme minister, profound knowledge of political shastras.', effectHi: 'शीर्ष मंत्री पद, राजनीति व नीतिशास्त्रों का मर्मज्ञ।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, blessed with noble children, deep faith, virtuous intellect, respected counsellor.',
      hi: 'स्त्री जातक में सुलक्षण संतान, गहरी धार्मिक आस्था, प्रबुद्ध बुद्धि, परिवार में आदरणीय।'
    }
  },
  {
    planet: 'Jupiter',
    planetHi: 'बृहस्पति (गुरु)',
    house: 6,
    titleEn: 'Jupiter in 6th House (Ripu Bhava)',
    titleHi: 'बृहस्पति षष्ठ भाव (रोग व शत्रु भाव) में',
    baseEn: 'Defeats enemies through wisdom, free from major adversaries, service-oriented. Liver, obesity, or diabetes vulnerability if afflicted. Gains through healthcare or judiciary.',
    baseHi: 'विवेक व शांति से शत्रुओं का शमन, विरोधियों से मुक्ति, सेवाभावी। पीड़ित होने पर यकृत (लीवर), मोटापा या मधुमेह की संवेदनशीलता। न्याय या चिकित्सा से लाभ।',
    ageMilestones: [
      { age: 24, nature: 'career', eventEn: 'Success in competitive examinations, entry into judicial or public service.', eventHi: 'प्रतियोगी परीक्षा में सफलता, न्यायिक या लोक सेवा में चयन।' },
      { age: 40, nature: 'favorable', eventEn: 'Complete triumph over legal obstacles, peace with competitors.', eventHi: 'मुकदमों व विधिक विवादों का पूर्ण समाधान, शत्रुओं से शांति।' }
    ],
    signModifiers: {
      Cancer: { en: 'Exalted: Complete conquest of diseases and enemies through righteousness.', hi: 'उच्च राशि: धर्म व सत्य से सभी रोगों व शत्रुओं पर विजय।' },
      Capricorn: { en: 'Debilitated: Chronic digestive or liver complications, workplace friction.', hi: 'नीच राशि: यकृत या पाचन विकार, कार्यक्षेत्र में विरोध।' }
    },
    aspectModifiers: [
      { graha: 'Saturn', conditionEn: 'Aspected by Saturn', conditionHi: 'शनि की दृष्टि', effectEn: 'Long-standing legal settlement achieved through patience and truth.', effectHi: 'धैर्य व सत्य के मार्ग पर चलकर पुराने मुकदमों में विजय।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, health-conscious, dietary vigilance required, respected by coworkers, compassionate nurse/healer.',
      hi: 'स्त्री जातक में आहार व स्वास्थ्य के प्रति सजगता आवश्यक, कार्यक्षेत्र में आदर, सेवाभावी व्यक्तित्व।'
    }
  },
  {
    planet: 'Jupiter',
    planetHi: 'बृहस्पति (गुरु)',
    house: 7,
    titleEn: 'Jupiter in 7th House (Kalatra Bhava)',
    titleHi: 'बृहस्पति सप्तम भाव (कलत्र भाव) में',
    baseEn: 'Beautiful, wise, virtuous spouse, harmonious marriage, fortunate after wedding, successful diplomacy, prestigious commercial alliances.',
    baseHi: 'विद्वान, सुंदर, सदाचारी जीवनसाथी, अखंड दांपत्य सुख, विवाह के उपरांत तीव्र भाग्योदय, सफल कूटनीति, प्रतिष्ठित व्यापारिक संबंध।',
    ageMilestones: [
      { age: 21, nature: 'favorable', eventEn: 'Auspicious marital engagement or fortunate trade partnership.', eventHi: 'मांगलिक विवाह वार्ता अथवा शुभ व्यापारिक साझेदारी।' },
      { age: 28, nature: 'favorable', eventEn: 'Consolidation of matrimonial bliss, social prestige, and joint wealth.', eventHi: 'दांपत्य सुख, सामाजिक प्रतिष्ठा तथा संयुक्त धन का विस्तार।' }
    ],
    signModifiers: {
      Cancer: { en: 'Exalted: Exceptionally noble, saintly spouse, sovereign matrimonial fortune.', hi: 'उच्च राशि: अत्यंत संस्कारी व देवतुल्य जीवनसाथी, अखंड दांपत्य सौभाग्य।' },
      Capricorn: { en: 'Debilitated: Differences of philosophy with spouse, delay in wedding.', hi: 'नीच राशि: वैचारिक मतभेद, विवाह में विलंब, जीवनसाथी के स्वास्थ्य की चिंता।' }
    },
    aspectModifiers: [
      { graha: 'Moon', conditionEn: 'With Moon', conditionHi: 'चन्द्रमा से युति', effectEn: 'Gajakesari in 7th: Universal public acclaim, romantic and marital pinnacle.', effectHi: 'सप्तम में गजकेसरी: जनप्रियता, आदर्श प्रेम व दांपत्य का शिखर।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, supreme Pativrata yoga, highly fortunate husband, lifelong marital bliss, revered status in in-laws.',
      hi: 'स्त्री जातक में परम सौभाग्यवती, उच्च पदस्थ व धर्मात्मा पति, अखंड सौभाग्य, ससुराल में पूज्य।'
    }
  },
  {
    planet: 'Jupiter',
    planetHi: 'बृहस्पति (गुरु)',
    house: 8,
    titleEn: 'Jupiter in 8th House (Ayu Bhava)',
    titleHi: 'बृहस्पति अष्टम भाव (आयु व रंध्र भाव) में',
    baseEn: 'Long life, peaceful passing, deep occult wisdom, inheritance through guru or father, spiritual seclusion, mastery of esoteric shastras.',
    baseHi: 'दीर्घायु, शांत व सुदीर्घ जीवन, अगाध गूढ़ ज्ञान, गुरु या पिता से वसीयत, एकांत साधना, तंत्र व उपनिषदों का मर्मज्ञ।',
    ageMilestones: [
      { age: 16, nature: 'favorable', eventEn: 'Spiritual initiation, protection from childhood hazards.', eventHi: 'आध्यात्मिक दीक्षा, बाल्यावस्था के संकटों से ईश्वरीय रक्षा।' },
      { age: 36, nature: 'favorable', eventEn: 'Sudden financial inheritance, esoteric revelation or authorship.', eventHi: 'अचानक वसीयत से लाभ अथवा महान आध्यात्मिक ज्ञान का प्रकटीकरण।' }
    ],
    signModifiers: {
      Cancer: { en: 'Exalted: Exceptionally long life, peaceful passing into higher worlds, vast legacy.', hi: 'उच्च राशि: सुदीर्घ जीवन, सद्गति, विपुल पैतृक व आध्यात्मिक विरासत।' },
      Capricorn: { en: 'Debilitated: Liver ailments, disputes over inheritance, digestive sluggishness.', hi: 'नीच राशि: यकृत रोग, वसीयत को लेकर विवाद, जठराग्नि मंद।' }
    },
    aspectModifiers: [
      { graha: 'Sun', conditionEn: 'Aspected by Sun', conditionHi: 'सूर्य की दृष्टि', effectEn: 'Divine spiritual grace, longevity confirmed, royal legacy.', effectHi: 'ईश्वरीय कृपा, सुदीर्घ जीवन निश्चित, राजकीय सम्मान व पैतृक धन।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, long lived, respected in-laws, deep esoteric inclinations, peaceful temperament.',
      hi: 'स्त्री जातक में दीर्घायु, ससुराल में सम्मानित, आध्यात्मिक व गंभीर स्वभाव, शांत जीवन।'
    }
  },
  {
    planet: 'Jupiter',
    planetHi: 'बृहस्पति (गुरु)',
    house: 9,
    titleEn: 'Jupiter in 9th House (Dharma Bhava)',
    titleHi: 'बृहस्पति नवम भाव (धर्म व भाग्य भाव) में',
    baseEn: 'Supreme fortune (Bhagyavan), dharmic leader, temple builder, world traveller, righteous father, blessings of preceptors, universal renown.',
    baseHi: 'परम भाग्यवान, धर्म ध्वजवाहक, मंदिर निर्माता, विश्व भ्रमणकारी, सदाचारी पिता, गुरुजनों की विशेष कृपा, सर्वमान्य प्रतिष्ठा।',
    ageMilestones: [
      { age: 16, nature: 'favorable', eventEn: 'Sacred thread / spiritual initiation, scholarly excellence.', eventHi: 'धार्मिक संस्कार, विद्या में सर्वोच्च सफलता, गुरु कृपा।' },
      { age: 24, nature: 'favorable', eventEn: 'Major fortune breakthrough, foreign pilgrimage, noble honors.', eventHi: 'विशाल भाग्योदय, तीर्थ यात्राएं, विद्वानों द्वारा सम्मान।' },
      { age: 32, nature: 'career', eventEn: 'Dharmic institution head, supreme philanthropic authority.', eventHi: 'धार्मिक या शैक्षणिक संस्थान का प्रमुख, दानवीर प्रतिष्ठा।' }
    ],
    signModifiers: {
      Cancer: { en: 'Exalted: World teacher (Jagadguru), sovereign spiritual guide, unbroken fortune.', hi: 'उच्च राशि: जगद्गुरु, धर्म चक्रवर्ती, अखंड ईश्वरीय कृपा व सौभाग्य।' },
      Capricorn: { en: 'Debilitated: Conflict with father, skepticism towards rituals, travel obstacles.', hi: 'नीच राशि: पिता से मतभेद, अनुष्ठानों में संशय, तीर्थ में विघ्न।' }
    },
    aspectModifiers: [
      { graha: 'Sun', conditionEn: 'With Sun', conditionHi: 'सूर्य से युति', effectEn: 'Supreme Dharmadhikari yoga, beloved of monarchs, spotless saintly fame.', effectHi: 'सर्वोच्च धर्माधिकारी योग, राजमान्य, निष्कलंक संत तुल्य कीर्ति।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, exceptionally fortunate, saintly conduct, respected by scholars and society, brings auspiciousness to entire clan.',
      hi: 'स्त्री जातक में परम सौभाग्यवती, सात्विक आचरण, विद्वानों में पूज्य, कुल का उद्धार करने वाली।'
    }
  },
  {
    planet: 'Jupiter',
    planetHi: 'बृहस्पति (गुरु)',
    house: 10,
    titleEn: 'Jupiter in 10th House (Karma Bhava)',
    titleHi: 'बृहस्पति दशम भाव (कर्म व राज्य भाव) में',
    baseEn: 'High judicial or ministerial post, impeccable reputation, religious preceptor, ethical career, state honors, counselor to rulers.',
    baseHi: 'उच्च न्यायिक या मंत्री पद, निष्कलंक प्रतिष्ठा, धर्माचार्य, नीतिपूर्ण आजीविका, राजकीय सम्मान, शासन का मुख्य मार्गदर्शक।',
    ageMilestones: [
      { age: 16, nature: 'favorable', eventEn: 'Academic awards, direction towards judiciary, civil service, or teaching.', eventHi: 'अकादमिक पुरस्कार, न्यायिक या सिविल सेवा की दिशा में उन्मुख।' },
      { age: 26, nature: 'career', eventEn: 'Prestigious public appointment, entry into high administrative ranks.', eventHi: 'उच्च प्रशासनिक पद पर नियुक्ति, शासन में अधिकार।' },
      { age: 36, nature: 'career', eventEn: 'Zenith of judicial or advisory authority, national recognition.', eventHi: 'न्यायिक या नीति सलाहकार पद का शिखर, राष्ट्रीय सम्मान।' }
    ],
    signModifiers: {
      Cancer: { en: 'Exalted: Supreme justice, chief justice, cabinet minister, undisputed authority.', hi: 'उच्च राशि: मुख्य न्यायाधीश, कैबिनेट मंत्री, अविवादित प्रशासनिक सम्मान।' },
      Capricorn: { en: 'Debilitated: Instability in profession, ethical compromises under pressure.', hi: 'नीच राशि: आजीविका में बाधा, सिद्धांतों को लेकर संघर्ष।' }
    },
    aspectModifiers: [
      { graha: 'Sun', conditionEn: 'Aspected by Sun', conditionHi: 'सूर्य की दृष्टि', effectEn: 'Royal ministerial authority, supreme public honor.', effectHi: 'राजकीय मंत्री पद, समाज में सर्वोच्च सम्मान।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, distinguished career in law, teaching, or governance, venerated status, moral leadership.',
      hi: 'स्त्री जातक में न्याय, शिक्षा या प्रशासन में विशिष्ट पद, समाज में अत्यंत आदरणीय, नैतिक नेतृत्व।'
    }
  },
  {
    planet: 'Jupiter',
    planetHi: 'बृहस्पति (गुरु)',
    house: 11,
    titleEn: 'Jupiter in 11th House (Labha Bhava)',
    titleHi: 'बृहस्पति एकादश भाव (लाभ भाव) में',
    baseEn: 'Multifold wealth, virtuous children, elder brother gains, spiritual associations, fulfillment of all cherished life desires.',
    baseHi: 'अथाह धन संपदा, सदाचारी संतान, अग्रज से लाभ, संतों का संग, जीवन की सभी अभिलाषाओं की सहज सिद्धि।',
    ageMilestones: [
      { age: 16, nature: 'favorable', eventEn: 'Early financial earnings through knowledge and merit.', eventHi: 'ज्ञान व योग्यता द्वारा प्रारंभिक धन लाभ।' },
      { age: 32, nature: 'favorable', eventEn: 'Massive wealth accumulation, noble alliances, asset expansion.', eventHi: 'विपुल धन संचय, प्रतिष्ठित सहयोगियों का संग, संपत्तियों का विस्तार।' }
    ],
    signModifiers: {
      Cancer: { en: 'Exalted: Multi-billionaire potential, treasurer of sacred wealth, noble charities.', hi: 'उच्च राशि: कुबेर सम धन, धर्मार्थ न्यासों का स्वामी, विशाल परोपकार।' },
      Capricorn: { en: 'Debilitated: Strained relations with elder brother, fluctuating profits.', hi: 'नीच राशि: अग्रज से मतभेद, लाभ में उतार-चढ़ाव।' }
    },
    aspectModifiers: [
      { graha: 'Moon', conditionEn: 'With Moon', conditionHi: 'चन्द्रमा से युति', effectEn: 'Multifold prosperity, immense liquid cash, universal friends.', effectHi: 'अखंड लक्ष्मी योग, विपुल चल संपत्ति, सर्वप्रियता।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, prosperous, happy family life, abundance of gold and assets, fulfilled desires.',
      hi: 'स्त्री जातक में अत्यंत संपन्न, सुखी गृहस्थी, स्वर्ण व संपत्तियों की प्रचुरता, सभी मनोकामनाओं की पूर्ति।'
    }
  },
  {
    planet: 'Jupiter',
    planetHi: 'बृहस्पति (गुरु)',
    house: 12,
    titleEn: 'Jupiter in 12th House (Vyaya Bhava)',
    titleHi: 'बृहस्पति द्वादश भाव (व्यय व मोक्ष भाव) में',
    baseEn: 'Charitable expenditures, ashram builder, moksha seeker, quiet seclusion, religious expenses, foreign pilgrimage.',
    baseHi: 'धर्मार्थ कार्यों में विपुल व्यय, आश्रम व मंदिर निर्माण, मोक्षकामी, शांत एकांतप्रियता, तीर्थ यात्राओं पर व्यय, विदेश वास।',
    ageMilestones: [
      { age: 26, nature: 'career', eventEn: 'Overseas pilgrimage, foreign educational or spiritual mission.', eventHi: 'विदेश में तीर्थ यात्रा, शैक्षणिक या आध्यात्मिक अभियान।' },
      { age: 48, nature: 'favorable', eventEn: 'Supreme spiritual meditation, detachment from worldly illusions, moksha path.', eventHi: 'गहन समाधि, सांसारिक मोह से मुक्ति, मोक्ष मार्ग में अग्रसर।' }
    ],
    signModifiers: {
      Cancer: { en: 'Exalted: Supreme spiritual ascension, heaven-bound soul, divine charity.', hi: 'उच्च राशि: परम मोक्ष मार्ग, देवलोक की प्राप्ति, विशाल धर्मार्थ कार्य।' },
      Capricorn: { en: 'Debilitated: Heavy unwanted expenditures, false spiritual preceptors.', hi: 'नीच राशि: अनावश्यक व्यय, पाखंडी व्यक्तियों से धनहानि।' }
    },
    aspectModifiers: [
      { graha: 'Saturn', conditionEn: 'With Saturn', conditionHi: 'शनि से युति', effectEn: 'Profound ascetic renunciation, hermit life, deep philosophical seclusion.', effectHi: 'गहन संन्यास योग, विरक्ति, एकांत में दार्शनिक साधना।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, charitable, ascetic nature, serene spiritual disposition, foreign pilgrimage.',
      hi: 'स्त्री जातक में दानशीला, सात्विक विरक्ति, शांत आध्यात्मिक चित्त, तीर्थ यात्राएं।'
    }
  }
];

export const VENUS_HOUSES = [
  {
    planet: 'Venus',
    planetHi: 'शुक्र',
    house: 1,
    titleEn: 'Venus in 1st House (Lagna)',
    titleHi: 'शुक्र प्रथम भाव (लग्न) में',
    baseEn: 'Enchanting beauty, romantic, artistic genius, luxurious life, Malavya Mahapurusha yoga if in Taurus, Libra, or Pisces. Magnetic charisma, youthful vigor.',
    baseHi: 'सम्मोहक लावण्य, रोमांटिक स्वभाव, कलात्मक प्रतिभा, ऐश्वर्यशाली जीवन, वृषभ, तुला या मीन में होने पर मालव्य महापुरुष योग। चुंबकीय आकर्षण, चिर-युवा कांति।',
    ageMilestones: [
      { age: 15, nature: 'favorable', eventEn: 'Dawn of artistic renown, music/acting bloom, social charm.', eventHi: 'कला, संगीत या अभिनय में ख्याति, समाज में आकर्षण का प्रस्फुटन।' },
      { age: 20, nature: 'favorable', eventEn: 'Romantic engagement, luxury vehicle or ornament acquisition.', eventHi: 'प्रेम संबंध, आभूषण व उत्तम वाहन का सुखद योग।' },
      { age: 25, nature: 'favorable', eventEn: 'Prosperous marriage, aesthetic business summit.', eventHi: 'सुलक्षण विवाह, कला व विलासिता व्यापार में सफलता।' }
    ],
    signModifiers: {
      Pisces: { en: 'Exalted: Malavya Mahapurusha yoga: Celestial charm, supreme artistic fame, opulent wealth.', hi: 'उच्च राशि (मीन): मालव्य महापुरुष योग: अनुपम सौंदर्य, कला शिरोमणि, अपार ऐश्वर्य।' },
      Virgo: { en: 'Debilitated: Sensory excess, reproductive or kidney sensitivity, marital disillusionment.', hi: 'नीच राशि (कन्या): विलासिता में भटकाव, गुर्दे या प्रजनन संवेदनशीलता, दांपत्य में निराशा।' }
    },
    aspectModifiers: [
      { graha: 'Jupiter', conditionEn: 'Aspected by Jupiter', conditionHi: 'गुरु की दृष्टि', effectEn: 'Righteous aesthetic genius, noble married life, revered in society.', effectHi: 'सात्विक कला प्रतिभा, आदर्श दांपत्य, समाज में उच्च आदर।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, mesmerizing beauty, graceful manners, passionate, jewel lover, adored by husband.',
      hi: 'स्त्री जातक में अप्रतिम सौंदर्य, शालीन शिष्टाचार, आभूषण प्रिय, पति की अत्यंत प्रियतमा।'
    }
  },
  {
    planet: 'Venus',
    planetHi: 'शुक्र',
    house: 2,
    titleEn: 'Venus in 2nd House (Dhana Bhava)',
    titleHi: 'शुक्र द्वितीय भाव (धन भाव) में',
    baseEn: 'Melodious singer, poet, vast wealth through arts, luxury, perfumes, and jewelry, gourmet food lover, attractive eyes.',
    baseHi: 'मधुर कंठ गायक, कवि, कला, विलासिता, इत्र व आभूषणों से विपुल धन, मिष्ठान्न व स्वादिष्ट भोजनप्रिय, नयनाभिराम आंखें।',
    ageMilestones: [
      { age: 20, nature: 'career', eventEn: 'Financial emergence through artistic voice, cosmetics, or luxury commerce.', eventHi: 'गायन, कला, सौंदर्य प्रसाधन या विलासिता व्यापार से धनार्जन।' },
      { age: 28, nature: 'favorable', eventEn: 'Massive accumulation of gold, silver, diamonds, and family prosperity.', eventHi: 'स्वर्ण, रजत, हीरों का विपुल संचय तथा कुटुंब में वैभव।' }
    ],
    signModifiers: {
      Pisces: { en: 'Exalted: Treasures of gems and gold, poetic renown, melodious speech.', hi: 'उच्च राशि: रत्नों व स्वर्ण का अपार भंडार, काव्य ख्याति, अमृतमयी वाणी।' },
      Virgo: { en: 'Debilitated: Losses through reckless luxury spending, eye sensitivity.', hi: 'नीच राशि: विलासिता में अपव्यय, नेत्र संवेदनशीलता, वाणी दोष।' }
    },
    aspectModifiers: [
      { graha: 'Mercury', conditionEn: 'With Mercury', conditionHi: 'बुध से युति', effectEn: 'Laxmi-Saraswati yoga: Eloquent poetry, immense commercial fortune.', effectHi: 'लक्ष्मी-सरस्वती योग: अद्भुत काव्य प्रतिभा, व्यापार में विपुल धन।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, musical voice, immense jewelry, gracious hostess, rich domestic harmony.',
      hi: 'स्त्री जातक में सुरीला कंठ, विपुल आभूषण, उत्तम आतिथ्य सत्कार, समृद्ध व शांत गृहस्थी।'
    }
  },
  {
    planet: 'Venus',
    planetHi: 'शुक्र',
    house: 3,
    titleEn: 'Venus in 3rd House (Sahaja Bhava)',
    titleHi: 'शुक्र तृतीय भाव (सहज भाव) में',
    baseEn: 'Passionate artist, love for siblings, creative writer, musical talent, skilled in handicrafts, affectionate courage.',
    baseHi: 'कलाकार, सहोदरों से स्नेह, सृजनात्मक लेखन, संगीत प्रतिभा, हस्तशिल्प में निपुण, सौम्य व स्नेहमयी पराक्रम।',
    ageMilestones: [
      { age: 20, nature: 'favorable', eventEn: 'Early artistic exhibitions, musical debut, supportive sisters.', eventHi: 'कला प्रदर्शनी, संगीत पदार्पण, बहनों से विशेष सहयोग।' },
      { age: 27, nature: 'favorable', eventEn: 'Literary or design triumph, successful artistic journeys.', eventHi: 'डिजाइन या साहित्य में ख्याति, लाभदायक यात्राएं।' }
    ],
    signModifiers: {
      Pisces: { en: 'Exalted: Celebrated musician, painter, designer, affectionate younger sisters.', hi: 'उच्च राशि: ख्यातिलब्ध संगीतकार, चित्रकार, डिजाइनर, बहनों का पूर्ण सुख।' },
      Virgo: { en: 'Debilitated: Strained relations with sisters, unrewarded artistic efforts.', hi: 'नीच राशि: बहनों से अनबन, कलात्मक प्रयासों में यथोचित फल की कमी।' }
    },
    aspectModifiers: [
      { graha: 'Jupiter', conditionEn: 'Aspected by Jupiter', conditionHi: 'गुरु की दृष्टि', effectEn: 'Noble artistic expressions, cultural leadership.', effectHi: 'सात्विक कला साधना, सांस्कृतिक नेतृत्व।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, skilled in embroidery, dancing, music, loving sister, charming conversationalist.',
      hi: 'स्त्री जातक में कसीदाकारी, नृत्य, संगीत में प्रवीण, स्नेहमयी बहन, मनभावन संवाद।'
    }
  },
  {
    planet: 'Venus',
    planetHi: 'शुक्र',
    house: 4,
    titleEn: 'Venus in 4th House (Sukha Bhava)',
    titleHi: 'शुक्र चतुर्थ भाव (सुख भाव) में',
    baseEn: 'Luxurious mansions, premium vehicles, devoted cultured mother, artistic home interior, peaceful domestic contentment.',
    baseHi: 'वैभवशाली भवन, सर्वोत्तम वाहन, विदुषी व संस्कारी माता, कलात्मक गृह सज्जा, गृहस्थी में सुख-शांति।',
    ageMilestones: [
      { age: 22, nature: 'favorable', eventEn: 'Acquisition of luxury car or beautiful home decoration.', eventHi: 'उत्तम वाहन का क्रय अथवा गृह का कलात्मक नवीनीकरण।' },
      { age: 28, nature: 'favorable', eventEn: 'Purchase of grand residential property or maternal gifts.', eventHi: 'भव्य भवन का क्रय अथवा माता से विपुल आभूषण लाभ।' },
      { age: 42, nature: 'favorable', eventEn: 'Palatial estate consolidation, supreme domestic bliss.', eventHi: 'भव्य प्रासाद तुल्य गृह का स्थायित्व, अखंड गृह सुख।' }
    ],
    signModifiers: {
      Pisces: { en: 'Exalted: Palatial mansions, fleet of luxury cars, unconditional maternal bliss.', hi: 'उच्च राशि: प्रासाद तुल्य आवास, उत्तम वाहनों की प्रचुरता, अखंड मातृ सुख।' },
      Virgo: { en: 'Debilitated: Discontent in home life, vehicle breakdowns, maternal health strain.', hi: 'नीच राशि: गृह सुख में असंतोष, वाहन में खराबी, माता के स्वास्थ्य की चिंता।' }
    },
    aspectModifiers: [
      { graha: 'Moon', conditionEn: 'With Moon', conditionHi: 'चन्द्रमा से युति', effectEn: 'Opulent domestic bliss, artistic home, boundless comforts.', effectHi: 'अखंड गृह सुख, कलामय वातावरण, सुख-सुविधाओं की प्रचुरता।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, grand domestic comfort, lavish home, loving mother, aesthetic interior styling.',
      hi: 'स्त्री जातक में भव्य गृह सुख, सुरुचिपूर्ण जीवन, स्नेहमयी माता, उत्तम गृह सज्जा।'
    }
  },
  {
    planet: 'Venus',
    planetHi: 'शुक्र',
    house: 5,
    titleEn: 'Venus in 5th House (Suta Bhava)',
    titleHi: 'शुक्र पंचम भाव (संतान व बुद्धि भाव) में',
    baseEn: 'Artistic talents, poetic flair, romance, more daughters, virtuous and attractive children, fortunate speculative instincts.',
    baseHi: 'कलात्मक प्रतिभा, काव्य अभिरुचि, प्रेम प्रसंग, कन्या संतति की अधिकता, रूपवान व सुसंस्कृत संतान, सफल रचनात्मक निवेश।',
    ageMilestones: [
      { age: 20, nature: 'favorable', eventEn: 'Blossoming of romance, poetic publication, creative acclaim.', eventHi: 'प्रेम संबंध का प्रस्फुटन, काव्य रचना, कलात्मक ख्याति।' },
      { age: 25, nature: 'favorable', eventEn: 'Birth of beautiful daughter, speculative or artistic windfall.', eventHi: 'सुंदर कन्या का जन्म, कला या निवेश से विशेष धन लाभ।' }
    ],
    signModifiers: {
      Pisces: { en: 'Exalted: Supreme creative genius, illustrious charming children, divine romance.', hi: 'उच्च राशि: अद्भुत सृजनात्मक प्रतिभा, प्रतापी व सुंदर संतान, पवित्र प्रेम।' },
      Virgo: { en: 'Debilitated: Heartbreak in romance, anxiety over children, reproductive care needed.', hi: 'नीच राशि: प्रेम में निराशा, संतान को लेकर चिंता, जननेंद्रिय स्वास्थ्य पर ध्यान दें।' }
    },
    aspectModifiers: [
      { graha: 'Jupiter', conditionEn: 'Aspected by Jupiter', conditionHi: 'गुरु की दृष्टि', effectEn: 'Highly cultured and noble children, virtuous intellect.', effectHi: 'अत्यंत संस्कारी व गुणी संतान, सात्विक प्रज्ञा।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, highly creative, loving mother, graceful temperament, talented in performing arts.',
      hi: 'स्त्री जातक में सृजनात्मक प्रतिभा, ममतामयी माता, शालीन स्वभाव, नृत्य-संगीत में निपुण।'
    }
  },
  {
    planet: 'Venus',
    planetHi: 'शुक्र',
    house: 6,
    titleEn: 'Venus in 6th House (Ripu Bhava)',
    titleHi: 'शुक्र षष्ठ भाव (रोग व शत्रु भाव) में',
    baseEn: 'Sensory conflicts, female rivalries, kidney or urinary sensitivity, diabetes checks required. Triumphs over rivals through sweet diplomacy.',
    baseHi: 'संबंधों में तनाव, स्त्रियों से विरोध, गुर्दे व मूत्र विकार, शर्करा (डायबिटीज) की संवेदनशीलता। सौम्य कूटनीति से शत्रुओं पर विजय।',
    ageMilestones: [
      { age: 21, nature: 'health', eventEn: 'Kidney, urinary, or skin sensitivity check.', eventHi: 'गुर्दे, मूत्र संस्थान या त्वचा संबंधी स्वास्थ्य सतर्कता।' },
      { age: 36, nature: 'favorable', eventEn: 'Diplomatic victory over workplace rivals, debt clearance.', eventHi: 'कूटनीति से विरोधियों का शमन, ऋणों से मुक्ति।' }
    ],
    signModifiers: {
      Pisces: { en: 'Exalted: Overcomes all rivals with graciousness, quick healing from ailments.', hi: 'उच्च राशि: सौम्य व्यवहार से शत्रुओं का हृदय परिवर्तन, शीघ्र रोगमुक्ति।' },
      Virgo: { en: 'Debilitated: Chronic urinary complaints, dispute with female associates, debt strain.', hi: 'नीच राशि: मूत्र विकार, स्त्री पक्ष से विवाद, कर्ज का तनाव।' }
    },
    aspectModifiers: [
      { graha: 'Jupiter', conditionEn: 'Aspected by Jupiter', conditionHi: 'गुरु की दृष्टि', effectEn: 'Shields health, protects from scandalous disputes, noble recovery.', effectHi: 'स्वास्थ्य की रक्षा, बदनामी से बचाव, सम्मानजनक रोगमुक्ति।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, kidney and urinary tract sensitivity, relationship diplomacy needed, excels in service and hospitality.',
      hi: 'स्त्री जातक में गुर्दे व मूत्राशय का ध्यान रखें, संबंधों में कूटनीति आवश्यक, आतिथ्य सेवा में सफल।'
    }
  },
  {
    planet: 'Venus',
    planetHi: 'शुक्र',
    house: 7,
    titleEn: 'Venus in 7th House (Kalatra Bhava)',
    titleHi: 'शुक्र सप्तम भाव (कलत्र भाव) में',
    baseEn: 'Extremely charming spouse, passionate love marriage, luxurious partnership, sensual desires fulfilled. Karako Bhava Nashaya caution if afflicted by malefics.',
    baseHi: 'अत्यंत रूपवान व आकर्षक जीवनसाथी, प्रेम विवाह का प्रबल योग, वैभवशाली दांपत्य, कामसुख की पूर्णता। पाप प्रभाव में वासना या दांपत्य में असंतोष की संभावना।',
    ageMilestones: [
      { age: 21, nature: 'favorable', eventEn: 'Romantic engagement or early fortunate matrimonial alliance.', eventHi: 'प्रेम संबंध, सगाई अथवा मांगलिक विवाह वार्ता।' },
      { age: 25, nature: 'favorable', eventEn: 'Consolidation of marital bliss, opulent lifestyle with spouse.', eventHi: 'दांपत्य सुख का स्थायित्व, जीवनसाथी के साथ वैभवशाली जीवन।' }
    ],
    signModifiers: {
      Pisces: { en: 'Exalted: Celestial beauty of spouse, eternal love, immense marital wealth.', hi: 'उच्च राशि: अनुपम सुंदरी/सुंदर जीवनसाथी, अमर प्रेम, दांपत्य में विपुल ऐश्वर्य।' },
      Virgo: { en: 'Debilitated: Marital friction, mutual dissatisfaction, health fragility of spouse.', hi: 'नीच राशि: दांपत्य में असंतोष, कलह, जीवनसाथी का दुर्बल स्वास्थ्य।' }
    },
    aspectModifiers: [
      { graha: 'Jupiter', conditionEn: 'Aspected by Jupiter', conditionHi: 'गुरु की दृष्टि', effectEn: 'Pure and devoted lifelong love, noble partner, high public esteem.', effectHi: 'पवित्र व समर्पित दांपत्य, सदाचारी जीवनसाथी, समाज में प्रतिष्ठा।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, devoted romantic partner, affluent handsome husband, lavish married life.',
      hi: 'स्त्री जातक में रूपवान व समृद्ध पति, प्रगाढ़ प्रेम, विलासितापूर्ण दांपत्य जीवन।'
    }
  },
  {
    planet: 'Venus',
    planetHi: 'शुक्र',
    house: 8,
    titleEn: 'Venus in 8th House (Ayu Bhava)',
    titleHi: 'शुक्र अष्टम भाव (आयु व रंध्र भाव) में',
    baseEn: 'Long life, peaceful demise, vast inheritance through spouse, luxurious secret pleasures, gains from in-laws, hormonal care.',
    baseHi: 'दीर्घायु, शांत व सुदीर्घ जीवन, जीवनसाथी से विपुल वसीयत, गुप्त सुख-सुविधाएं, ससुराल पक्ष से धन लाभ, हार्मोनल संतुलन आवश्यक।',
    ageMilestones: [
      { age: 22, nature: 'favorable', eventEn: 'Unexpected financial gift, legacy, or luxury inheritance.', eventHi: 'अचानक उपहार, वसीयत अथवा विलासिता संपत्तियों का लाभ।' },
      { age: 36, nature: 'favorable', eventEn: 'Major wealth windfall through matrimonial estate or occult arts.', eventHi: 'ससुराल पक्ष या गुप्त स्रोतों से भारी धन लाभ।' }
    ],
    signModifiers: {
      Pisces: { en: 'Exalted: Very long life, massive unexpected wealth through spouse, peaceful passing.', hi: 'उच्च राशि: सुदीर्घ जीवन, ससुराल से विपुल धन, शांत व सुगम जीवन।' },
      Virgo: { en: 'Debilitated: Reproductive or urinary complications, inheritance litigation.', hi: 'नीच राशि: जननेंद्रिय विकार, वसीयत को लेकर विवाद, व्यर्थ व्यय।' }
    },
    aspectModifiers: [
      { graha: 'Jupiter', conditionEn: 'Aspected by Jupiter', conditionHi: 'गुरु की दृष्टि', effectEn: 'Shields longevity, peaceful and honorable passing, spiritual legacy.', effectHi: 'आयु की रक्षा, सुखद जीवन, आध्यात्मिक व भौतिक विरासत।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, wealthy in-laws, long-lived, legacy gains, hormonal care required in mature years.',
      hi: 'स्त्री जातक में समृद्ध ससुराल, दीर्घायु, वसीयत से लाभ, उत्तरार्ध में स्वास्थ्य का ध्यान रखें।'
    }
  },
  {
    planet: 'Venus',
    planetHi: 'शुक्र',
    house: 9,
    titleEn: 'Venus in 9th House (Dharma Bhava)',
    titleHi: 'शुक्र नवम भाव (धर्म व भाग्य भाव) में',
    baseEn: 'Fortunate through marriage, artistic pilgrimages, liberal philosophy, blessings of Lakshmi, international tours, generous donor.',
    baseHi: 'विवाह के उपरांत भाग्योदय, कलात्मक व धार्मिक तीर्थ यात्राएं, उदार दर्शन, महालक्ष्मी की असीम कृपा, विदेश भ्रमण, दानवीर।',
    ageMilestones: [
      { age: 21, nature: 'favorable', eventEn: 'Dawn of fortune through matrimony, artistic achievements.', eventHi: 'विवाह या कला द्वारा भाग्योदय का शुभ प्रारंभ।' },
      { age: 28, nature: 'favorable', eventEn: 'International luxury travel, philanthropic contributions.', eventHi: 'विदेश यात्रा, धार्मिक कार्यों में दान, प्रतिष्ठा का विस्तार।' }
    ],
    signModifiers: {
      Pisces: { en: 'Exalted: Supreme Lakshmi yoga, sovereign fortune, temple and cultural patronage.', hi: 'उच्च राशि: परम लक्ष्मी योग, अखंड सौभाग्य, मंदिरों व सांस्कृतिक संस्थाओं को दान।' },
      Virgo: { en: 'Debilitated: Skepticism in religious matters, obstacles during long journeys.', hi: 'नीच राशि: धार्मिक कार्यों में अरुचि, लंबी यात्राओं में विघ्न।' }
    },
    aspectModifiers: [
      { graha: 'Jupiter', conditionEn: 'With or aspected by Jupiter', conditionHi: 'गुरु से युति या दृष्टि', effectEn: 'Saintly aesthetic wisdom, universal philanthropy, spotless fame.', effectHi: 'सात्विक कला साधना, विशाल लोक कल्याण, निष्कलंक कीर्ति।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, highly fortunate, beloved by family, charitable, gracious lifestyle, brings prosperity to home.',
      hi: 'स्त्री जातक में परम सौभाग्यशालिनी, कुल में प्रिय, दानशीला, सुरुचिपूर्ण जीवन, घर में लक्ष्मी का वास।'
    }
  },
  {
    planet: 'Venus',
    planetHi: 'शुक्र',
    house: 10,
    titleEn: 'Venus in 10th House (Karma Bhava)',
    titleHi: 'शुक्र दशम भाव (कर्म व राज्य भाव) में',
    baseEn: 'Celebrated artist, fashion designer, cinema/hospitality tycoon, diplomatic honors, wealth through entertainment, jewelry, and luxury goods.',
    baseHi: 'प्रसिद्ध कलाकार, फैशन डिजाइनर, सिनेमा या होटल उद्योगपति, कूटनीतिक सम्मान, मनोरंजन, आभूषण व विलासिता व्यापार से अकूत धन।',
    ageMilestones: [
      { age: 22, nature: 'career', eventEn: 'First major breakthrough into cinema, arts, fashion, or luxury enterprise.', eventHi: 'कला, सिनेमा, फैशन या विलासिता उद्योग में प्रथम बड़ी सफलता।' },
      { age: 30, nature: 'career', eventEn: 'National fame, corporate leadership in aesthetic industries.', eventHi: 'राष्ट्रीय स्तर पर ख्याति, कला उद्योग में शीर्ष नेतृत्व।' },
      { age: 38, nature: 'favorable', eventEn: 'Apex of aesthetic fame, state honors, vast wealth accumulation.', eventHi: 'कला व आजीविका का शिखर, राजकीय सम्मान, विपुल धन संचय।' }
    ],
    signModifiers: {
      Pisces: { en: 'Exalted: Internationally celebrated artist, billionaire lifestyle, royal patronage.', hi: 'उच्च राशि: अंतरराष्ट्रीय ख्याति प्राप्त कलाकार, अपार ऐश्वर्य, राजसम्मान।' },
      Virgo: { en: 'Debilitated: Professional defamation under scandal, instability in luxury trade.', hi: 'नीच राशि: कार्यक्षेत्र में अपयश का भय, व्यापार में अस्थिरता।' }
    },
    aspectModifiers: [
      { graha: 'Jupiter', conditionEn: 'Aspected by Jupiter', conditionHi: 'गुरु की दृष्टि', effectEn: 'Spotless prestige, ethical luxury enterprises, universally respected.', effectHi: 'निष्कलंक प्रतिष्ठा, नीतिपूर्ण व्यापार, समाज में सर्वमान्य आदर।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, high prestige in creative or corporate spheres, aesthetic elegance, admired leader.',
      hi: 'स्त्री जातक में कलात्मक या कॉर्पोरेट क्षेत्र में उच्च पद, सुरुचिपूर्ण व्यक्तित्व, सम्मानित नेत्री।'
    }
  },
  {
    planet: 'Venus',
    planetHi: 'शुक्र',
    house: 11,
    titleEn: 'Venus in 11th House (Labha Bhava)',
    titleHi: 'शुक्र एकादश भाव (लाभ भाव) में',
    baseEn: 'Immense cash flow, luxury vehicles, influential female friends, fulfilled romantic dreams, flourishing artistic and financial enterprises.',
    baseHi: 'अखंड धन वर्षा, उत्तम वाहन, प्रभावशाली सखियों का सहयोग, सभी महत्वाकांक्षाओं की पूर्ति, कला व वित्तीय उपक्रमों में भारी लाभ।',
    ageMilestones: [
      { age: 20, nature: 'favorable', eventEn: 'Early financial abundance through creative or commercial skills.', eventHi: 'रचनात्मक या व्यापारिक कौशल से प्रारंभिक धन लाभ।' },
      { age: 25, nature: 'favorable', eventEn: 'Substantial wealth multiplication, purchase of luxury assets.', eventHi: 'धन-संपत्ति में भारी वृद्धि, विलासिता की वस्तुओं का क्रय।' },
      { age: 36, nature: 'favorable', eventEn: 'Summit of financial prosperity, influential social network.', eventHi: 'आर्थिक संपन्नता का चरमोत्कर्ष, प्रतिष्ठित समाज में आदर।' }
    ],
    signModifiers: {
      Pisces: { en: 'Exalted: Multi-stream vast treasures, fleet of vehicles, diamonds and jewels.', hi: 'उच्च राशि: अनेक स्रोतों से विपुल धन, वाहनों की प्रचुरता, हीरों व रत्नों का संचय।' },
      Virgo: { en: 'Debilitated: Losses through deceitful female associates, fluctuating gains.', hi: 'नीच राशि: गलत संगति से धनहानि, लाभ में उतार-चढ़ाव।' }
    },
    aspectModifiers: [
      { graha: 'Mercury', conditionEn: 'With Mercury', conditionHi: 'बुध से युति', effectEn: 'Commercial genius, artistic riches, vast noble networks.', effectHi: 'व्यापारिक चातुर्य, कला से धन, प्रतिष्ठित मित्रों का घेरा।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, immensely wealthy, social influencer, surrounded by luxuries, fulfilled wishes.',
      hi: 'स्त्री जातक में अत्यधिक संपन्न, समाज में लोकप्रिय, विलासिता के साधनों से घिरी, सुखी जीवन।'
    }
  },
  {
    planet: 'Venus',
    planetHi: 'शुक्र',
    house: 12,
    titleEn: 'Venus in 12th House (Vyaya Bhava)',
    titleHi: 'शुक्र द्वादश भाव (व्यय व मोक्ष भाव) में',
    baseEn: 'Highest luxury in sleep and bed comforts (Shayana Sukha), immense wealth spent on sensory pleasures, artistic foreign travel, opulent lifestyle abroad.',
    baseHi: 'शयन सुख का चरमोत्कर्ष, विलासिता व सुख-सुविधाओं पर विपुल व्यय, विदेश में कलात्मक जीवन, परदेस में अपार ऐश्वर्य का उपभोग।',
    ageMilestones: [
      { age: 25, nature: 'career', eventEn: 'Overseas relocation, luxury lifestyle, foreign artistic ventures.', eventHi: 'विदेश गमन, विलासितापूर्ण जीवन, परदेस में आजीविका।' },
      { age: 40, nature: 'favorable', eventEn: 'Opulent foreign settlement, philanthropic and spiritual charity.', eventHi: 'विदेश में स्थाई संपन्नता, कला व धर्मार्थ कार्यों में दान।' }
    ],
    signModifiers: {
      Pisces: { en: 'Exalted: Celestial bed comforts, vast overseas wealth, saintly renunciation in late age.', hi: 'उच्च राशि: अद्वितीय शयन सुख, विदेश में अपार संपत्ति, उत्तरार्ध में सात्विक विरक्ति।' },
      Virgo: { en: 'Debilitated: Heavy expenditure on sensory indulgences, marital disillusionment.', hi: 'नीच राशि: व्यर्थ विलासिता में अपव्यय, दांपत्य में निराशा, नेत्र दुर्बलता।' }
    },
    aspectModifiers: [
      { graha: 'Jupiter', conditionEn: 'Aspected by Jupiter', conditionHi: 'गुरु की दृष्टि', effectEn: 'Chaste and refined pleasures, spiritual philanthropy, peaceful foreign abode.', effectHi: 'सात्विक सुखोपभोग, धार्मिक दान, विदेश में शांत व सुखी वास।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, lavish lifestyle, fond of comforts, generous, sensual fulfillment, overseas travel.',
      hi: 'स्त्री जातक में वैभवशाली जीवन, सुखप्रिय, दानशीला, दांपत्य सुख, विदेश यात्रा।'
    }
  }
];

export const SATURN_HOUSES = [
  {
    planet: 'Saturn',
    planetHi: 'शनि',
    house: 1,
    titleEn: 'Saturn in 1st House (Lagna)',
    titleHi: 'शनि प्रथम भाव (लग्न) में',
    baseEn: 'Serious, disciplined, lean frame, melancholic, late bloomer, Shasha Mahapurusha yoga if in own or exalted signs (Libra, Capricorn, Aquarius). Unshakeable perseverance.',
    baseHi: 'गंभीर, अनुशासित, कृश काया, विचारशील, विलंब से भाग्योदय, तुला, मकर या कुंभ में होने पर शश महापुरुष योग। अथक परिश्रम, विपरीत परिस्थितियों में अडिग।',
    ageMilestones: [
      { age: 12, nature: 'health', eventEn: 'Childhood dental, bone, or respiratory endurance trial.', eventHi: 'बाल्यावस्था में दंत, अस्थि या वात रोग की संवेदनशीलता।' },
      { age: 28, nature: 'career', eventEn: 'Turning point of maturity, heavy responsibilities, beginning of steady rise.', eventHi: 'परिपक्वता का मोड़, भारी उत्तरदायित्व, आजीविका में स्थाई प्रगति।' },
      { age: 36, nature: 'favorable', eventEn: 'Apex of monumental career consolidation, mass following, undisputed authority.', eventHi: 'आजीविका में महान स्थायित्व, जनसमर्थन तथा सर्वोच्च प्रशासनिक अधिकार।' }
    ],
    signModifiers: {
      Libra: { en: 'Exalted: Shasha Mahapurusha yoga: Supreme mass leader, judge, invincible endurance.', hi: 'उच्च राशि (तुला): शश महापुरुष योग: शीर्ष जननेता, न्यायाधीश, अदम्य सहनशक्ति।' },
      Aries: { en: 'Debilitated: Melancholia, chronic ailments, arduous labor without due credit.', hi: 'नीच राशि (मेष): मानसिक विषाद, दीर्घकालीन वात रोग, कठोर श्रम का अल्प फल।' },
      Capricorn: { en: 'Own Sign: Hardworking titan, builder of durable institutions, high administrative rank.', hi: 'स्वराशि (मकर): कर्मठ व्यक्तित्व, स्थाई संस्थाओं का निर्माता, उच्च पद।' }
    },
    aspectModifiers: [
      { graha: 'Jupiter', conditionEn: 'Aspected by Jupiter', conditionHi: 'गुरु की दृष्टि', effectEn: 'Righteous philosopher, judicial greatness, noble patience rewarded.', effectHi: 'धर्मात्मा दार्शनिक, महान न्यायाधीश, धैर्य का अमृत फल।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, serious nature, hardworking, early struggles leading to durable stability, duty-bound matriarch.',
      hi: 'स्त्री जातक में गंभीर स्वभाव, कर्मठ, प्रारंभिक संघर्ष के उपरांत अटूट स्थिरता, कर्तव्यनिष्ठ कुलवधू।'
    }
  },
  {
    planet: 'Saturn',
    planetHi: 'शनि',
    house: 2,
    titleEn: 'Saturn in 2nd House (Dhana Bhava)',
    titleHi: 'शनि द्वितीय भाव (धन भाव) में',
    baseEn: 'Strained family ties in youth, harsh blunt speech, wealth accumulated late through hard labor, dental troubles, disciplined thrift.',
    baseHi: 'युवावस्था में कुटुंब में संघर्ष, खरी व दो-टूक वाणी, कठोर परिश्रम से उत्तरार्ध में भारी धन संचय, दंत विकार, मितव्ययी।',
    ageMilestones: [
      { age: 28, nature: 'career', eventEn: 'First solid breakthrough in independent savings and disciplined finance.', eventHi: 'स्वतंत्र बचत व अनुशासित वित्त प्रबंधन का प्रारंभ।' },
      { age: 36, nature: 'favorable', eventEn: 'Immense accumulation of immovable property, land, and gold.', eventHi: 'अचल संपत्ति, भूमि व स्वर्ण का विपुल स्थाई संचय।' }
    ],
    signModifiers: {
      Libra: { en: 'Exalted: Vast treasures of gold, land, and metals, truthful speech.', hi: 'उच्च राशि: स्वर्ण, भूमि व धातुओं का विपुल भंडार, सत्य व गंभीर वाणी।' },
      Aries: { en: 'Debilitated: Financial crises, dental losses, family estrangements.', hi: 'नीच राशि: आर्थिक तंगी, दंत रोग, कुटुंब से अलगाव।' }
    },
    aspectModifiers: [
      { graha: 'Jupiter', conditionEn: 'Aspected by Jupiter', conditionHi: 'गुरु की दृष्टि', effectEn: 'Truthful speech, family harmony restored, honest financial rise.', effectHi: 'सत्य वाणी, कुटुंब में सामंजस्य, नीतिपूर्ण धन संचय।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, plain spoken, disciplined thrift, early adjustments with in-laws leading to financial authority.',
      hi: 'स्त्री जातक में स्पष्टवादी, मितव्ययी, ससुराल में प्रारंभिक सामंजस्य के बाद वित्तीय अधिकार।'
    }
  },
  {
    planet: 'Saturn',
    planetHi: 'शनि',
    house: 3,
    titleEn: 'Saturn in 3rd House (Sahaja Bhava)',
    titleHi: 'शनि तृतीय भाव (सहज भाव) में',
    baseEn: 'Exceptional valor, perseverance, strained relations with younger siblings, military or engineering fortitude, crushes adversaries.',
    baseHi: 'अद्भुत पराक्रम, असीम धैर्य, छोटे भाइयों से दूरी या मतभेद, सेना या तकनीकी कार्यों में सफलता, शत्रुओं का दमन।',
    ageMilestones: [
      { age: 28, nature: 'career', eventEn: 'Monumental triumph through solo perseverance, defeat of competitors.', eventHi: 'अकेले दम पर ऐतिहासिक विजय, विरोधियों का पूर्ण दमन।' },
      { age: 36, nature: 'favorable', eventEn: 'Consolidation of vast personal enterprise, industrial leadership.', eventHi: 'व्यक्तिगत उपक्रमों का भारी विस्तार, उद्योग में नेतृत्व।' }
    ],
    signModifiers: {
      Libra: { en: 'Exalted: Unshakeable heroism, supreme industrial achievements, devoted aides.', hi: 'उच्च राशि: अजेय पराक्रम, औद्योगिक उपलब्धियां, विश्वस्त सहयोगियों का साथ।' },
      Aries: { en: 'Debilitated: Fractures in arms, friction with brothers, frustrated efforts.', hi: 'नीच राशि: भुजाओं में चोट, सहोदरों से कटुता, प्रयासों में व्यवधान।' }
    },
    aspectModifiers: [
      { graha: 'Mars', conditionEn: 'With Mars', conditionHi: 'मंगल से युति', effectEn: 'Fierce engineering, mining, or defense commander, ruthless against foes.', effectHi: 'इंजीनियरिंग, खनन या रक्षा क्षेत्र में शीर्ष कमांडर, विरोधियों के प्रति कठोर।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, brave, resolute, overcomes all sibling or family friction, stands like a rock.',
      hi: 'स्त्री जातक में साहसी, दृढ़ निश्चयी, सभी पारिवारिक कठिनाइयों का डटकर मुकाबला करने वाली।'
    }
  },
  {
    planet: 'Saturn',
    planetHi: 'शनि',
    house: 4,
    titleEn: 'Saturn in 4th House (Sukha Bhava)',
    titleHi: 'शनि चतुर्थ भाव (सुख भाव) में (कंटक शनि)',
    baseEn: 'Kantaka Shani: Distant from mother, rustic home, melancholy, chest stiffness, delay in property. Massive landed estates in mature life if well placed.',
    baseHi: 'कंटक शनि: माता से दूरी या माता को स्वास्थ्य कष्ट, गृह में उदासी, वक्षस्थल में जकड़न, संपत्ति प्राप्ति में विलंब। परिपक्व आयु में विशाल अचल संपत्ति।',
    ageMilestones: [
      { age: 28, nature: 'challenging', eventEn: 'Relocation away from home, heavy domestic responsibilities.', eventHi: 'गृहत्याग, सुदूर प्रवास, परिवार का भारी उत्तरदायित्व।' },
      { age: 36, nature: 'favorable', eventEn: 'Purchase of solid immovable property, stone/concrete estate.', eventHi: 'मजबूत स्थाई मकान, भूमि अथवा भारी संपत्ति का क्रय।' },
      { age: 42, nature: 'favorable', eventEn: 'Consolidation of landed wealth and ancestral restoration.', eventHi: 'पैतृक भूमि का जीर्णोद्धार, अचल संपत्ति का स्थायित्व।' }
    ],
    signModifiers: {
      Libra: { en: 'Exalted: Vast ancestral estates, massive stone mansions, high civic rank.', hi: 'उच्च राशि: विशाल पैतृक भूमि, मजबूत भव्य भवन, उच्च नागरिक सम्मान।' },
      Aries: { en: 'Debilitated: Maternal grief, broken home, vehicle accidents, chest disorders.', hi: 'नीच राशि: माता को गंभीर कष्ट, गृह क्लेश, वाहन से चोट, वक्ष विकार।' }
    },
    aspectModifiers: [
      { graha: 'Jupiter', conditionEn: 'Aspected by Jupiter', conditionHi: 'गुरु की दृष्टि', effectEn: 'Maternal longevity restored, peaceful domestic haven in late age.', effectHi: 'माता की दीर्घायु, उत्तरार्ध में शांतिपूर्ण व समृद्ध गृह सुख।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, domestic emotional burdens, stern demeanor, late home comfort, devoted daughter-in-law.',
      hi: 'स्त्री जातक में पारिवारिक जिम्मेदारियों का बोझ, गंभीर स्वभाव, विलंब से गृह सुख, कर्तव्यनिष्ठ।'
    }
  },
  {
    planet: 'Saturn',
    planetHi: 'शनि',
    house: 5,
    titleEn: 'Saturn in 5th House (Suta Bhava)',
    titleHi: 'शनि पंचम भाव (संतान व बुद्धि भाव) में',
    baseEn: 'Delay in progeny, critical intellect, philosophical study, emotional detachment, stomach sensitivity, deep interest in history and ancient ruins.',
    baseHi: 'संतान प्राप्ति में विलंब, सूक्ष्म आलोचनात्मक बुद्धि, दार्शनिक अध्ययन, विरक्ति, उदर व पाचन दुर्बलता, प्राचीन इतिहास व पुरातत्व में रुचि।',
    ageMilestones: [
      { age: 28, nature: 'career', eventEn: 'Deep scholarly specialization in law, history, or engineering.', eventHi: 'विधि, इतिहास या तकनीकी अनुसंधान में गहन विशेषज्ञता।' },
      { age: 36, nature: 'favorable', eventEn: 'Birth of serious, mature child, establishment of philosophical school.', eventHi: 'गंभीर व सुसंस्कृत संतान का जन्म, बौद्धिक क्षेत्र में प्रतिष्ठा।' }
    ],
    signModifiers: {
      Libra: { en: 'Exalted: Genius intellectual perseverance, illustrious mature children.', hi: 'उच्च राशि: विलक्षण बौद्धिक धैर्य, प्रतापी व मेधावी संतान।' },
      Aries: { en: 'Debilitated: Severe obstacles in progeny, mental depression, abdominal surgery.', hi: 'नीच राशि: संतान उत्पत्ति में भारी बाधा, मानसिक अवसाद, उदर शल्य क्रिया।' }
    },
    aspectModifiers: [
      { graha: 'Jupiter', conditionEn: 'Aspected by Jupiter', conditionHi: 'गुरु की दृष्टि', effectEn: 'Shields progeny, bestows profound ancient wisdom and scholarly dignity.', effectHi: 'संतान की रक्षा, प्राचीन ज्ञान की प्राप्ति, समाज में विद्वत सम्मान।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, delayed conception, serious disciplined children, profound spiritual wisdom, patient mother.',
      hi: 'स्त्री जातक में संतान में विलंब, अनुशासित संतान, गहन आध्यात्मिक बुद्धि, धैर्यमयी माता।'
    }
  },
  {
    planet: 'Saturn',
    planetHi: 'शनि',
    house: 6,
    titleEn: 'Saturn in 6th House (Ripu Bhava)',
    titleHi: 'शनि षष्ठ भाव (शत्रु व रोग भाव) में',
    baseEn: 'Supreme Shatruhanta, completely crushes rivals, immune to enemies, robust against chronic diseases in later years, legal dominance.',
    baseHi: 'परम शत्रुहंता, विरोधियों को धूल चटाने वाला, षड्यंत्रों से अभेद्य, उत्तरार्ध में रोगों पर पूर्ण विजय, न्यायालयीन मुकदमों में सर्वोपरि।',
    ageMilestones: [
      { age: 28, nature: 'career', eventEn: 'Grand victory over workplace conspiracy, promotion under adversity.', eventHi: 'कार्यक्षेत्र के षड्यंत्रों पर भारी विजय, संघर्ष के बीच पदोन्नति।' },
      { age: 36, nature: 'favorable', eventEn: 'Complete liquidation of old debts, annihilation of legal disputes.', eventHi: 'पुराने ऋणों का समूल नाश, मुकदमों में निर्णायक विजय।' }
    ],
    signModifiers: {
      Libra: { en: 'Exalted: Supreme justice, crushing defeat of adversaries, ironclad immunity.', hi: 'उच्च राशि: अद्वितीय न्याय, शत्रुओं का पूर्ण विनाश, अभेद्य रोग प्रतिरोधकता।' },
      Aries: { en: 'Debilitated: Chronic rheumatic or bone ailments, subordinate insubordination.', hi: 'नीच राशि: दीर्घकालीन वात या संधि रोग, अधीनस्थों से असहयोग।' }
    },
    aspectModifiers: [
      { graha: 'Mars', conditionEn: 'With Mars', conditionHi: 'मंगल से युति', effectEn: 'Fierce endurance, supreme military victory after prolonged trench warfare.', effectHi: 'अदम्य सहनशक्ति, लंबे संघर्ष के उपरांत निर्णायक सैन्य विजय।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, iron resilience, overcomes every adversity, disciplined health, dominant over competitors.',
      hi: 'स्त्री जातक में फौलादी सहनशक्ति, हर बाधा पर विजय, अनुशासित स्वास्थ्य, विरोधियों पर पूर्ण दबदबा।'
    }
  },
  {
    planet: 'Saturn',
    planetHi: 'शनि',
    house: 7,
    titleEn: 'Saturn in 7th House (Kalatra Bhava)',
    titleHi: 'शनि सप्तम भाव (कलत्र भाव) में',
    baseEn: 'Mature or older spouse, delayed marriage, durable marital bond if unafflicted, business stability through persistence, slow partnerships.',
    baseHi: 'गंभीर या आयु में बड़ा जीवनसाथी, विवाह में विलंब, शुभ प्रभाव में अटूट दांपत्य, अथक परिश्रम से व्यापारिक स्थायित्व, स्थिर साझेदारी।',
    ageMilestones: [
      { age: 28, nature: 'challenging', eventEn: 'Delayed wedding settlement or serious marital duty adjustments.', eventHi: 'विवाह में विलंब या दांपत्य कर्तव्यों की कठिन परीक्षा।' },
      { age: 36, nature: 'favorable', eventEn: 'Consolidation of permanent trade partnerships, stable married life.', eventHi: 'स्थाई व्यापारिक साझेदारी तथा दांपत्य जीवन में पूर्ण स्थिरता।' }
    ],
    signModifiers: {
      Libra: { en: 'Exalted: Highly noble, mature, and influential spouse; prosperous long-term trade.', hi: 'उच्च राशि: अत्यंत संस्कारी, गंभीर व प्रतिष्ठित जीवनसाथी; व्यापार में भारी लाभ।' },
      Aries: { en: 'Debilitated: Bitter marital separation, chronic illness of spouse, litigation.', hi: 'नीच राशि: दांपत्य में कटुता, अलगाव का भय, जीवनसाथी का दीर्घकालीन रोग।' }
    },
    aspectModifiers: [
      { graha: 'Jupiter', conditionEn: 'Aspected by Jupiter', conditionHi: 'गुरु की दृष्टि', effectEn: 'Removes marital thorns, grants loyal and righteous spouse, peaceful home.', effectHi: 'दांपत्य बाधाओं का निवारण, निष्ठावान व धर्मात्मा जीवनसाथी।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, late marriage, serious dedicated husband, durable marital duties, stability after struggle.',
      hi: 'स्त्री जातक में विलंब से विवाह, कर्तव्यनिष्ठ व गंभीर पति, अटूट दांपत्य, संघर्ष के बाद सुख।'
    }
  },
  {
    planet: 'Saturn',
    planetHi: 'शनि',
    house: 8,
    titleEn: 'Saturn in 8th House (Ayu Bhava)',
    titleHi: 'शनि अष्टम भाव (आयु व रंध्र भाव) में',
    baseEn: 'Very long life (Ayushkaraka in 8th), chronic ailments in old age, interest in occult and geology, delayed inheritance, peaceful endurance.',
    baseHi: 'सुदीर्घ जीवन (अष्टम भाव में शनि आयु कारक), वृद्धावस्था में वात रोग, भूगर्भ व गुप्त विद्याओं में रुचि, विलंब से पैतृक धन, अगाध सहनशीलता।',
    ageMilestones: [
      { age: 36, nature: 'health', eventEn: 'Turning point of physical endurance, bone/joint care.', eventHi: 'शारीरिक सहनशक्ति का मोड़, संधियों व अस्थियों पर ध्यान।' },
      { age: 44, nature: 'favorable', eventEn: 'Release of delayed legacy, occult awakening, profound longevity.', eventHi: 'रुकी हुई वसीयत की प्राप्ति, आध्यात्मिक जागृति, दीर्घायु की पुष्टि।' }
    ],
    signModifiers: {
      Libra: { en: 'Exalted: Centenarian longevity, vast hidden treasures, peaceful longevity.', hi: 'उच्च राशि: शतायु योग, गुप्त संपत्तियों की प्राप्ति, शांत व दीर्घ जीवन।' },
      Aries: { en: 'Debilitated: Chronic rheumatics, fractures, disputes over inheritance.', hi: 'नीच राशि: दीर्घकालीन गठिया रोग, अस्थि भंग, पैतृक संपत्ति में विवाद।' }
    },
    aspectModifiers: [
      { graha: 'Jupiter', conditionEn: 'Aspected by Jupiter', conditionHi: 'गुरु की दृष्टि', effectEn: 'Protects from painful ailments, guarantees peaceful spiritual demise in old age.', effectHi: 'कष्टकारी रोगों से मुक्ति, वृद्धावस्था में शांत व सात्विक सद्गति।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, long lived, chronic rheumatics or joint pains in mature years, serious outlook, deep endurance.',
      hi: 'स्त्री जातक में दीर्घायु, उत्तरार्ध में वात व जोड़ों का ध्यान रखें, गंभीर व सहनशील स्वभाव।'
    }
  },
  {
    planet: 'Saturn',
    planetHi: 'शनि',
    house: 9,
    titleEn: 'Saturn in 9th House (Dharma Bhava)',
    titleHi: 'शनि नवम भाव (धर्म व भाग्य भाव) में',
    baseEn: 'Detached philosophy, slow fortune rise, conflict with orthodox dogmas, hermit inclinations in old age, justice and social duty.',
    baseHi: 'विरक्त दार्शनिक दृष्टि, विलंब से किंतु स्थाई भाग्योदय, धार्मिक रूढ़ियों का विरोध, उत्तरार्ध में वैराग्य, न्याय व सामाजिक कर्तव्य पर बल।',
    ageMilestones: [
      { age: 36, nature: 'career', eventEn: 'Solid fortune consolidation through solo labor, justice, or heavy industry.', eventHi: 'कठोर परिश्रम व न्याय के मार्ग से अचल भाग्योदय।' },
      { age: 42, nature: 'favorable', eventEn: 'Spiritual pilgrimage to ancient hermitages, societal respect.', eventHi: 'प्राचीन तीर्थों की यात्रा, समाज में ज्ञानी के रूप में प्रतिष्ठा।' }
    ],
    signModifiers: {
      Libra: { en: 'Exalted: Supreme philosopher of the masses, illustrious righteous father, massive fortune.', hi: 'उच्च राशि: जनता का महान दार्शनिक, धर्मात्मा पिता, अखंड व स्थाई भाग्य।' },
      Aries: { en: 'Debilitated: Strained paternal relations, cynicism towards faith, arduous travels.', hi: 'नीच राशि: पिता से वैचारिक मतभेद, आस्था में निराशा, कष्टप्रद यात्राएं।' }
    },
    aspectModifiers: [
      { graha: 'Jupiter', conditionEn: 'With or aspected by Jupiter', conditionHi: 'गुरु से युति या दृष्टि', effectEn: 'High ascetic wisdom, bridge between tradition and reform, saintly repute.', effectHi: 'उच्च संन्यास ज्ञान, परंपरा व सुधार का समन्वय, संत तुल्य आदर।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, austere, duty-bound, patient, unconventional spiritual path, brings stability to family.',
      hi: 'स्त्री जातक में सादगीपसंद, कर्तव्यनिष्ठ, अगाध धैर्य, कुल में मर्यादा व स्थिरता की संरक्षिका।'
    }
  },
  {
    planet: 'Saturn',
    planetHi: 'शनि',
    house: 10,
    titleEn: 'Saturn in 10th House (Karma Bhava)',
    titleHi: 'शनि दशम भाव (कर्म व राज्य भाव) में',
    baseEn: 'Supreme rise from humble origins to high administrative status, mass leadership, political authority, unyielding endurance. Fall from height if afflicted.',
    baseHi: 'साधारण स्थिति से उठकर सर्वोच्च प्रशासनिक शिखर पर पहुंचना, जनसमर्थन, राजनीतिक सत्ता, अटूट कर्मठता। पाप प्रभाव में पदच्युति का भय।',
    ageMilestones: [
      { age: 28, nature: 'career', eventEn: 'Major initiation into public service, trade union, or heavy industrial management.', eventHi: 'लोक सेवा, औद्योगिक प्रबंधन या जनसंगठन में महत्वपूर्ण शुरुआत।' },
      { age: 36, nature: 'favorable', eventEn: 'Elevation to supreme executive rank, mass following, governmental honors.', eventHi: 'सर्वोच्च प्रशासनिक पद पर पदोन्नति, जनप्रियता, राजकीय सम्मान।' },
      { age: 42, nature: 'career', eventEn: 'Apex of political or corporate sovereignty, indestructible authority.', eventHi: 'राजनीतिक या कॉर्पोरेट सत्ता का चरमोत्कर्ष, अविचल प्रभुत्व।' }
    ],
    signModifiers: {
      Libra: { en: 'Exalted: Prime minister, mass sovereign, supreme judge, monumental legacy.', hi: 'उच्च राशि: शीर्ष जननेता, प्रधानमंत्री तुल्य प्रभाव, सर्वोच्च न्यायाधीश।' },
      Aries: { en: 'Debilitated: Arduous manual labor, professional defamation, sudden fall from post.', hi: 'नीच राशि: अत्यधिक कठोर श्रम का अल्प लाभ, पदच्युति का भय।' }
    },
    aspectModifiers: [
      { graha: 'Sun', conditionEn: 'With Sun', conditionHi: 'सूर्य से युति', effectEn: 'Fierce conflict with superiors followed by eventual independent sovereign rule.', effectHi: 'अधिकारियों से तीव्र संघर्ष के बाद स्वतंत्र सत्ता की स्थापना।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, remarkable professional endurance, respected manager, high executive rank, unshakeable work ethic.',
      hi: 'स्त्री जातक में अद्भुत कार्यक्षमता, सम्मानित प्रबंधक, उच्च प्रशासनिक पद, कर्तव्यपरायणता।'
    }
  },
  {
    planet: 'Saturn',
    planetHi: 'शनि',
    house: 11,
    titleEn: 'Saturn in 11th House (Labha Bhava)',
    titleHi: 'शनि एकादश भाव (लाभ भाव) में',
    baseEn: 'Durable long-term wealth, older influential friends, political networks, long-term aspirations realized through perseverance and industry.',
    baseHi: 'अचल व स्थाई विपुल धन, वयोवृद्ध व प्रभावशाली मित्रों का संग, राजनीतिक नेटवर्क, अथक परिश्रम से सभी दीर्घकालिक लक्ष्यों की प्राप्ति।',
    ageMilestones: [
      { age: 36, nature: 'favorable', eventEn: 'Massive wealth consolidation through real estate, metallurgy, or manufacturing.', eventHi: 'भूमि, धातु उद्योग या विनिर्माण से भारी स्थाई धन संचय।' },
      { age: 44, nature: 'favorable', eventEn: 'Apex of multi-millionaire status, political victory, elder sibling alliance.', eventHi: 'विशाल आर्थिक साम्राज्य का स्थायित्व, राजनीतिक विजय।' }
    ],
    signModifiers: {
      Libra: { en: 'Exalted: Multi-billionaire potential, vast industrial empire, steadfast allies.', hi: 'उच्च राशि: उद्योगपति योग, विशाल औद्योगिक साम्राज्य, निष्ठावान मित्र।' },
      Aries: { en: 'Debilitated: Strained relations with elder brother, fluctuating profits, debt recovery.', hi: 'नीच राशि: अग्रज से मतभेद, लाभ में रुकावटें, ऋण वसूली में तनाव।' }
    },
    aspectModifiers: [
      { graha: 'Jupiter', conditionEn: 'Aspected by Jupiter', conditionHi: 'गुरु की दृष्टि', effectEn: 'Eternal righteous wealth, noble public infrastructure endowments.', effectHi: 'अक्षय धर्म सम्मत धन, सार्वजनिक निर्माण व जन कल्याण में दान।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, wealthy, durable friendships, steady income from industry or land, fulfilled life ambitions.',
      hi: 'स्त्री जातक में विपुल धन, स्थाई मित्रता, उद्योग या भूमि से निरंतर आय, मनोकामनाओं की पूर्ति।'
    }
  },
  {
    planet: 'Saturn',
    planetHi: 'शनि',
    house: 12,
    titleEn: 'Saturn in 12th House (Vyaya Bhava)',
    titleHi: 'शनि द्वादश भाव (व्यय व मोक्ष भाव) में',
    baseEn: 'Heavy expenses on duty and hospitality, solitude, asceticism, left eye weakness, foreign labor, quiet endurance of hardships.',
    baseHi: 'कर्तव्य व परिजनों पर भारी व्यय, एकांतप्रियता, वैराग्य, बाएं नेत्र में दुर्बलता, विदेश में कठोर परिश्रम, कष्टों को मौन सहन करने की शक्ति।',
    ageMilestones: [
      { age: 36, nature: 'career', eventEn: 'Relocation to foreign country or secluded spiritual retreat.', eventHi: 'विदेश प्रवास अथवा एकांत आध्यात्मिक साधना केंद्र में वास।' },
      { age: 45, nature: 'favorable', eventEn: 'Spiritual detachment, profound meditation, liberation from worldly entanglements.', eventHi: 'आध्यात्मिक विरक्ति, गहन ध्यान, सांसारिक बंधनों से मुक्ति।' }
    ],
    signModifiers: {
      Libra: { en: 'Exalted: Immense overseas wealth, peaceful ascetic meditation, foreign honor.', hi: 'उच्च राशि: विदेश में विपुल धनोपार्जन, शांत संन्यास साधना, परदेस में आदर।' },
      Aries: { en: 'Debilitated: Heavy hospital bills, confinement risks, eye ailments.', hi: 'नीच राशि: चिकित्सालय का भारी व्यय, बंधन भय, नेत्र पीड़ा।' }
    },
    aspectModifiers: [
      { graha: 'Jupiter', conditionEn: 'Aspected by Jupiter', conditionHi: 'गुरु की दृष्टि', effectEn: 'Moksha seeker, divine protection abroad, charitable expenditures.', effectHi: 'मोक्ष मार्ग की ओर अग्रसर, विदेश में ईश्वरीय रक्षा, धर्मार्थ व्यय।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, detached, ascetic leanings, silent suffering without complaint, spiritual retreat.',
      hi: 'स्त्री जातक में विरक्त स्वभाव, कष्टों को मौन सहने वाली, सात्विक साधना, विदेश वास।'
    }
  }
];

console.log('Jupiter, Venus, and Saturn structures loaded.');
