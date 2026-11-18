// scripts/data/planetsMoonMarsMercury.mjs
// Moon, Mars, and Mercury: 12 Houses each (36 records)

export const MOON_HOUSES = [
  {
    planet: 'Moon',
    planetHi: 'चन्द्रमा',
    house: 1,
    titleEn: 'Moon in 1st House (Lagna)',
    titleHi: 'चन्द्रमा प्रथम भाव (लग्न) में',
    baseEn: 'Charming appearance, magnetic eyes, highly emotional and imaginative disposition. If Shukla Paksha (waxing), native enjoys radiant health and popularity. If Krishna Paksha (waning) and afflicted, childhood health fluctuations (Balarishta).',
    baseHi: 'मनोहर मुखाकृति, आकर्षक आंखें, अत्यंत भावुक तथा उर्वर कल्पनाशील स्वभाव। शुक्ल पक्षीय चन्द्रमा होने पर उत्तम आरोग्य, लोकप्रियता तथा कांतिवान देह। कृष्ण पक्ष व पाप प्रभाव में बाल्यावस्था में स्वास्थ्य दुर्बलता (बालारिष्ट योग)।',
    ageMilestones: [
      { age: 15, nature: 'favorable', eventEn: 'Dawn of artistic talents and widespread social charm.', eventHi: 'कलात्मक प्रतिभा तथा समाज में आकर्षण का प्रस्फुटन।' },
      { age: 24, nature: 'favorable', eventEn: 'Major popularity surge, marital or emotional fulfillment.', eventHi: 'लोकप्रियता में अभूतपूर्व वृद्धि, दांपत्य व भावनात्मक सुख।' }
    ],
    signModifiers: {
      Taurus: { en: 'Exalted: Radiant beauty, immense wealth, peaceful mind, longevity.', hi: 'उच्च राशि (वृषभ): अनुपम सौंदर्य, विपुल धन, शांत मन, सुदीर्घ जीवन।' },
      Scorpio: { en: 'Debilitated: Emotional anxiety, depressive mood swings, respiratory weakness.', hi: 'नीच राशि (वृश्चिक): मानसिक उद्वेग, अवसाद, श्वास व कफ विकार।' },
      Cancer: { en: 'Own Sign: Nurturing personality, beloved of mother, fertile imagination.', hi: 'स्वराशि (कर्क): अत्यंत स्नेही, मातृभक्त, कल्पनाशील तथा समृद्ध।' }
    },
    aspectModifiers: [
      { graha: 'Jupiter', conditionEn: 'With or aspected by Jupiter', conditionHi: 'गुरु की युति या दृष्टि', effectEn: 'Gajakesari yoga: Undisputed fame, scholarly dignity, royal honors.', effectHi: 'गजकेसरी योग: सर्वमान्य कीर्ति, विद्वता, राजसम्मान तथा अखंड ऐश्वर्य।' },
      { graha: 'Saturn', conditionEn: 'With Saturn', conditionHi: 'शनि से युति (विष योग)', effectEn: 'Visha yoga: Melancholic thoughts, maternal suffering, emotional isolation.', effectHi: 'विष योग: मानसिक विषाद, माता को कष्ट, एकाकीपन की भावना।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, extraordinarily graceful, fertile, deeply intuitive, beloved wife and nurturing mother, charming persona.',
      hi: 'स्त्री जातक में अनुपम लावण्य, उर्वरता, गहन अंतर्ज्ञान, आदर्श गृहिणी व ममतामयी माता।'
    }
  },
  {
    planet: 'Moon',
    planetHi: 'चन्द्रमा',
    house: 2,
    titleEn: 'Moon in 2nd House (Dhana Bhava)',
    titleHi: 'चन्द्रमा द्वितीय भाव (धन भाव) में',
    baseEn: 'Sweet-spoken, melodious voice, fond of fine dining, wealthy, attractive face, close to maternal family. Flourishes in finance, arts, dairy, or food industry.',
    baseHi: 'मधुरभाषी, सुरीला कंठ, मिष्ठान्न व सुरुचिपूर्ण भोजनप्रिय, धनवान, सुंदर मुख, ननिहाल पक्ष से स्नेह। वित्त, ललित कला, दुग्ध व्यवसाय में सफलता।',
    ageMilestones: [
      { age: 18, nature: 'career', eventEn: 'Financial emergence through family or commercial speech.', eventHi: 'पारिवारिक व्यवसाय या वाणी से धनार्जन का प्रारंभ।' },
      { age: 27, nature: 'favorable', eventEn: 'Substantial wealth accumulation and family prosperity.', eventHi: 'विपुल धन संचय तथा कुटुंब में मांगलिक उत्सव।' }
    ],
    signModifiers: {
      Taurus: { en: 'Exalted: Vast treasures of gold, silver, jewels, and liquid assets.', hi: 'उच्च राशि: स्वर्ण, रजत, रत्नों तथा विपुल चल संपत्ति का स्वामी।' },
      Scorpio: { en: 'Debilitated: Harsh slips of tongue under stress, financial volatility.', hi: 'नीच राशि: भावावेश में कटु वाणी, आर्थिक स्थिति में उतार-चढ़ाव।' }
    },
    aspectModifiers: [
      { graha: 'Mercury', conditionEn: 'Aspected by Mercury', conditionHi: 'बुध की दृष्टि', effectEn: 'Supreme literary oratory, poetic genius, commercial mastery.', effectHi: 'अद्भुत वक्तृत्व कला, काव्य प्रतिभा, वाणिज्य में निपुण।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, sweet melodic voice, generous hostess, lover of jewelry, peaceful domestic financial stability.',
      hi: 'स्त्री जातक में मधुर कंठ, कुशल आतिथ्य, आभूषण प्रेमी, कुटुंब में शांति व आर्थिक संपन्नता।'
    }
  },
  {
    planet: 'Moon',
    planetHi: 'चन्द्रमा',
    house: 3,
    titleEn: 'Moon in 3rd House (Sahaja Bhava)',
    titleHi: 'चन्द्रमा तृतीय भाव (सहज भाव) में',
    baseEn: 'Fond of artistic writing, music, travel, supportive sisters. Gentle valor, excels in communication, journalism, and creative handicrafts.',
    baseHi: 'कलात्मक लेखन, संगीत, यात्राप्रिय, बहनों से विशेष स्नेह। सौम्य पराक्रम, जनसंचार, पत्रकारिता तथा हस्तशिल्प में सिद्धहस्त।',
    ageMilestones: [
      { age: 20, nature: 'career', eventEn: 'Literary or artistic breakthrough, successful short journeys.', eventHi: 'साहित्यिक या कलात्मक क्षेत्र में पहचान, लाभदायक लघु यात्राएं।' },
      { age: 24, nature: 'favorable', eventEn: 'Rise in fame through media, publishing, or commerce.', eventHi: 'मीडिया, प्रकाशन या व्यापार द्वारा प्रतिष्ठा का विस्तार।' }
    ],
    signModifiers: {
      Taurus: { en: 'Exalted: Eminent author, brilliant orator, devoted younger siblings.', hi: 'उच्च राशि: ख्यातिलब्ध लेखक, अद्भुत वक्ता, सहोदरों का पूर्ण सुख।' },
      Scorpio: { en: 'Debilitated: Sibling friction, anxiety during travels, nervous arms/shoulders.', hi: 'नीच राशि: सहोदरों से मनमुटाव, यात्रा में भय, कंधों में दुर्बलता।' }
    },
    aspectModifiers: [
      { graha: 'Mars', conditionEn: 'Aspected by Mars', conditionHi: 'मंगल की दृष्टि', effectEn: 'Dynamic courage, adventurous ventures, athletic success.', effectHi: 'अदम्य साहस, साहसिक यात्राएं, खेलकूद में सफलता।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, talented in fine arts, affectionate towards sisters, graceful communication style.',
      hi: 'स्त्री जातक में ललित कलाओं में दक्ष, बहनों से अगाध स्नेह, मनभावन संवाद शैली।'
    }
  },
  {
    planet: 'Moon',
    planetHi: 'चन्द्रमा',
    house: 4,
    titleEn: 'Moon in 4th House (Sukha Bhava)',
    titleHi: 'चन्द्रमा चतुर्थ भाव (सुख भाव) में',
    baseEn: 'Exceptional maternal affection, palace-like homes, comfortable vehicles, profound peace of mind. Highly sensitive to domestic atmosphere and water elements.',
    baseHi: 'अगाध मातृसुख, सुंदर व भव्य भवन, उत्तम वाहन, मानसिक शांति। गृह के वातावरण व जलीय तत्वों के प्रति विशेष संवेदनशील।',
    ageMilestones: [
      { age: 24, nature: 'favorable', eventEn: 'Acquisition of splendid home or luxury vehicle.', eventHi: 'भव्य गृह अथवा नवीन वाहन का सुखद योग।' },
      { age: 36, nature: 'favorable', eventEn: 'Maternal blessings, domestic expansion, emotional contentment.', eventHi: 'मातृ कृपा, पारिवारिक समृद्धि तथा मानसिक शांति का चरमोत्कर्ष।' }
    ],
    signModifiers: {
      Cancer: { en: 'Own Sign: Unconditional maternal bliss, waterside home, pristine peace.', hi: 'स्वराशि: अनुपम मातृ सुख, जलाशय के निकट सुंदर वास, अगाध मानसिक शांति।' },
      Scorpio: { en: 'Debilitated: Disturbed domestic peace, maternal health sorrow, emotional distress.', hi: 'नीच राशि: गृह सुख में न्यूनता, माता को कष्ट, मानसिक उद्वेग।' }
    },
    aspectModifiers: [
      { graha: 'Jupiter', conditionEn: 'Aspected by Jupiter', conditionHi: 'गुरु की दृष्टि', effectEn: 'Blessed with saintly mother, palatial estate, absolute peace.', effectHi: 'सदाचारी माता, विशाल प्रासाद तुल्य गृह, परम संतोष।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, quintessential ideal homemaker, revered by family, generous mother, peaceful household atmosphere.',
      hi: 'स्त्री जातक में आदर्श कुलवधू, गृहलक्ष्मी, स्नेहमयी माता, घर में सुख-शांति की संरक्षिका।'
    }
  },
  {
    planet: 'Moon',
    planetHi: 'चन्द्रमा',
    house: 5,
    titleEn: 'Moon in 5th House (Suta Bhava)',
    titleHi: 'चन्द्रमा पंचम भाव (संतान व बुद्धि भाव) में',
    baseEn: 'Brilliant poetic imagination, tender heart, devotion to divine Mother, more female progeny, intuitive advisor, virtuous children.',
    baseHi: 'उर्वर काव्य प्रतिभा, कोमल हृदय, भगवती की कृपा, कन्या संतति की अधिकता, अंतर्ज्ञानी सलाहकार, सदाचारी संतान।',
    ageMilestones: [
      { age: 20, nature: 'favorable', eventEn: 'Scholarly distinction, blossoming of creative talents.', eventHi: 'अकादमिक व कलात्मक प्रतिभा का प्रस्फुटन।' },
      { age: 28, nature: 'favorable', eventEn: 'Birth of a fortunate child, speculative or advisory gains.', eventHi: 'सुलक्षण संतान का जन्म, परामर्श या बौद्धिक कार्यों से लाभ।' }
    ],
    signModifiers: {
      Taurus: { en: 'Exalted: Supreme creative genius, illustrious children, divine mantra siddhi.', hi: 'उच्च राशि: अद्भुत सृजनात्मक प्रतिभा, प्रतापी संतान, मंत्र सिद्धि।' },
      Scorpio: { en: 'Debilitated: Emotional anguish regarding children, digestive sensitivity.', hi: 'नीच राशि: संतान पक्ष से चिंता, उदर व पाचन दुर्बलता।' }
    },
    aspectModifiers: [
      { graha: 'Jupiter', conditionEn: 'Aspected by Jupiter', conditionHi: 'गुरु की दृष्टि', effectEn: 'Scholarly children, profound spiritual intuition, minister or advisor.', effectHi: 'विद्वान व दीर्घायु संतान, आध्यात्मिक ज्ञान, उच्च सलाहकार।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, blessed with cultured children, deeply intuitive mother, tender-hearted, artistic sensibilities.',
      hi: 'स्त्री जातक में सुसंस्कृत संतान का सुख, संवेदनशील व ममतालु हृदय, कलात्मक अभिरुचि।'
    }
  },
  {
    planet: 'Moon',
    planetHi: 'चन्द्रमा',
    house: 6,
    titleEn: 'Moon in 6th House (Ripu Bhava)',
    titleHi: 'चन्द्रमा षष्ठ भाव (रोग व शत्रु भाव) में',
    baseEn: 'Fragile digestion, prone to colds, respiratory congestion, and water-borne ailments. Subdued rivals through gentle diplomacy; maternal uncle requires care.',
    baseHi: 'जठराग्नि मंद, कफ, शीत तथा जलजनित रोगों की संवेदनशीलता। सौम्य व्यवहार से विरोधियों का शमन; ननिहाल पक्ष के प्रति सतर्कता।',
    ageMilestones: [
      { age: 18, nature: 'health', eventEn: 'Cold, pulmonary sensitivity, or water-related vulnerability.', eventHi: 'शीत विकार, कफ या जल जनित रोगों से सतर्कता।' },
      { age: 36, nature: 'favorable', eventEn: 'Triumph over competition through patient perseverance.', eventHi: 'धैर्य व विनम्रता से शत्रुओं व बाधाओं पर विजय।' }
    ],
    signModifiers: {
      Taurus: { en: 'Exalted: Robust recovery power, easily overcomes debts and disputes.', hi: 'उच्च राशि: शीघ्र रोगमुक्ति, ऋण व विवादों पर सहज नियंत्रण।' },
      Scorpio: { en: 'Debilitated: Chronic anxiety, digestive or urinary vulnerability.', hi: 'नीच राशि: निरंतर मानसिक चिंता, आंतों या मूत्राशय में शिथिलता।' }
    },
    aspectModifiers: [
      { graha: 'Saturn', conditionEn: 'With Saturn', conditionHi: 'शनि से युति', effectEn: 'Protracted phlegmatic ailments, workplace friction, melancholia.', effectHi: 'दीर्घकालीन कफ विकार, कार्यक्षेत्र में असहयोग, मानसिक अवसाद।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, needs care regarding hormonal and digestive cycles; excels in healthcare, nursing, and empathetic service.',
      hi: 'स्त्री जातक में मासिक व पाचन संतुलन पर ध्यान आवश्यक; चिकित्सा, परिचर्या व सेवा कार्यों में अत्यंत सफल।'
    }
  },
  {
    planet: 'Moon',
    planetHi: 'चन्द्रमा',
    house: 7,
    titleEn: 'Moon in 7th House (Kalatra Bhava)',
    titleHi: 'चन्द्रमा सप्तम भाव (कलत्र व जाया भाव) में',
    baseEn: 'Charming, romantic, beautiful spouse, passionate love life, early marriage if well-placed. Fluctuations in marital moods; successful in public dealings, trade, and partnerships.',
    baseHi: 'सुंदर, आकर्षक व भावुक जीवनसाथी, सुखी दांपत्य, समय पर विवाह का योग। दांपत्य में कभी-कभी भावुकता की अधिकता; जनसंपर्क, व्यापार व साझेदारी में लाभ।',
    ageMilestones: [
      { age: 21, nature: 'favorable', eventEn: 'Romantic engagement or initiation of fortunate business partnership.', eventHi: 'प्रेम संबंध, विवाह वार्ता अथवा शुभ व्यापारिक साझेदारी।' },
      { age: 25, nature: 'favorable', eventEn: 'Marital bliss and substantial expansion in public trade.', eventHi: 'दांपत्य सुख तथा जनव्यापार में विशेष प्रगति।' }
    ],
    signModifiers: {
      Taurus: { en: 'Exalted: Exceptionally handsome/beautiful and wealthy spouse, lifelong marital joy.', hi: 'उच्च राशि: अत्यंत रूपवान व धनी जीवनसाथी, अखंड दांपत्य सुख।' },
      Scorpio: { en: 'Debilitated: Marital insecurities, emotional turbulence with spouse.', hi: 'नीच राशि: दांपत्य में अविश्वास, जीवनसाथी के स्वास्थ्य की चिंता।' }
    },
    aspectModifiers: [
      { graha: 'Jupiter', conditionEn: 'Aspected by Jupiter', conditionHi: 'गुरु की दृष्टि', effectEn: 'Highly virtuous, devoted partner, social honor, noble alliance.', effectHi: 'सदाचारी व निष्ठावान जीवनसाथी, समाज में उच्च प्रतिष्ठा।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, devoted and handsome husband, emotional bonding, prosperous matrimonial home.',
      hi: 'स्त्री जातक में सुंदर व स्नेही पति, प्रगाढ़ भावनात्मक संबंध, समृद्ध ससुराल।'
    }
  },
  {
    planet: 'Moon',
    planetHi: 'चन्द्रमा',
    house: 8,
    titleEn: 'Moon in 8th House (Ayu Bhava)',
    titleHi: 'चन्द्रमा अष्टम भाव (आयु व रंध्र भाव) में',
    baseEn: 'Psychic intuition, interest in occult sciences, water hazards, fluctuating vitality in youth (Balarishta if afflicted). Sudden financial windfalls through legacy or spouse.',
    baseHi: 'गहन अंतर्ज्ञान, गुप्त विद्याओं व तंत्र में रुचि, जल से सतर्कता, बाल्यावस्था में स्वास्थ्य दुर्बलता। जीवनसाथी या वसीयत से आकस्मिक धन लाभ।',
    ageMilestones: [
      { age: 8, nature: 'health', eventEn: 'Childhood health vulnerability (respiratory or water-related).', eventHi: 'बाल्यावस्था में स्वास्थ्य कष्ट (जल या कफ जनित)।' },
      { age: 32, nature: 'favorable', eventEn: 'Inheritance, sudden legacy, or profound occult awakening.', eventHi: 'अचानक वसीयत से लाभ अथवा आध्यात्मिक अंतर्दृष्टि का उदय।' }
    ],
    signModifiers: {
      Taurus: { en: 'Exalted: Long life, massive unexpected inheritance, peaceful mind.', hi: 'उच्च राशि: दीर्घायु, अप्रत्याशित पैतृक संपत्ति, मानसिक स्थिरता।' },
      Scorpio: { en: 'Debilitated: Deep anxiety, hysteria, phobias, digestive-water imbalances.', hi: 'नीच राशि: गहन मानसिक भय, फोबिया, जल व कफ असंतुलन।' }
    },
    aspectModifiers: [
      { graha: 'Jupiter', conditionEn: 'Aspected by Jupiter', conditionHi: 'गुरु की दृष्टि', effectEn: 'Neutralizes Balarishta, bestows longevity and occult wisdom.', effectHi: 'बालारिष्ट दोष का शमन, दीर्घायु तथा आध्यात्मिक ज्ञान।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, emotional sensitivity, requires emotional support during hormonal transitions, inheritance from in-laws.',
      hi: 'स्त्री जातक में अत्यधिक भावुकता, ससुराल पक्ष से धन लाभ, मानसिक संबल की आवश्यकता।'
    }
  },
  {
    planet: 'Moon',
    planetHi: 'चन्द्रमा',
    house: 9,
    titleEn: 'Moon in 9th House (Dharma Bhava)',
    titleHi: 'चन्द्रमा नवम भाव (धर्म व भाग्य भाव) में',
    baseEn: 'Highly fortunate (Bhagyashali), dharmic, charitable, fond of pilgrimages and overseas ocean voyages. Loving relationship with father, devoted to divine Mother.',
    baseHi: 'परम भाग्यशाली, धार्मिक, दानवीर, तीर्थाटन व समुद्री यात्राओं का प्रेमी। पिता से प्रगाढ़ स्नेह, कुलदेवी की विशेष कृपा।',
    ageMilestones: [
      { age: 16, nature: 'favorable', eventEn: 'Spiritual initiation and blessings from preceptors.', eventHi: 'धार्मिक संस्कार तथा गुरुजनों का वरदान।' },
      { age: 24, nature: 'favorable', eventEn: 'Major fortune breakthrough, foreign pilgrimage or water voyage.', eventHi: 'विशाल भाग्योदय, तीर्थ यात्रा अथवा विदेशी जल यात्रा।' },
      { age: 32, nature: 'career', eventEn: 'High public esteem, temple endowments, social leadership.', eventHi: 'सामाजिक मान-सम्मान, धार्मिक कार्यों में अग्रणी भूमिका।' }
    ],
    signModifiers: {
      Taurus: { en: 'Exalted: Sovereign fortune, divine grace, illustrious father, vast charitable works.', hi: 'उच्च राशि: अखंड सौभाग्य, ईश्वरीय कृपा, प्रतापी पिता, विशाल धर्मार्थ कार्य।' },
      Scorpio: { en: 'Debilitated: Strained paternal relationship, doubts in faith, travel hindrances.', hi: 'नीच राशि: पिता से वैचारिक मतभेद, आस्था में विचलन, यात्राओं में विघ्न।' }
    },
    aspectModifiers: [
      { graha: 'Jupiter', conditionEn: 'With or aspected by Jupiter', conditionHi: 'गुरु से युति या दृष्टि', effectEn: 'Supreme Dharmadhikari yoga, philanthropic leader, saintly fame.', effectHi: 'परम धर्माधिकारी योग, धर्मपरायण नेतृत्व, संत तुल्य आदर।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, extraordinarily blessed, brings prosperity to husband and children, saintly conduct, loves pilgrimage.',
      hi: 'स्त्री जातक में परम सौभाग्यवती, पति व संतान हेतु कल्याणकारी, सात्विक आचरण, तीर्थ प्रिय।'
    }
  },
  {
    planet: 'Moon',
    planetHi: 'चन्द्रमा',
    house: 10,
    titleEn: 'Moon in 10th House (Karma Bhava)',
    titleHi: 'चन्द्रमा दशम भाव (कर्म व राज्य भाव) में',
    baseEn: 'Public renown, benevolent administrator, career connected to masses, liquids, trade, healthcare, or hospitality. Emotional dedication to profession, fluctuating yet prestigious status.',
    baseHi: 'लोकप्रियता, जनप्रिय प्रशासक, जनता, जल, व्यापार, चिकित्सा या आतिथ्य से जुड़ी आजीविका। कार्य के प्रति भावनात्मक समर्पण, प्रतिष्ठित पद।',
    ageMilestones: [
      { age: 24, nature: 'career', eventEn: 'Public recognition, professional elevation, governmental favor.', eventHi: 'कार्यक्षेत्र में सार्वजनिक पहचान, पदोन्नति, शासन से सहयोग।' },
      { age: 36, nature: 'favorable', eventEn: 'Apex of professional acclaim and mass following.', eventHi: 'जनप्रियता व सामाजिक प्रतिष्ठा का चरमोत्कर्ष।' }
    ],
    signModifiers: {
      Taurus: { en: 'Exalted: Renowned statesman, beloved corporate leader, vast wealth.', hi: 'उच्च राशि: ख्यातिलब्ध राजनेता, लोकप्रिय अधिकारी, अटूट धन-संपदा।' },
      Scorpio: { en: 'Debilitated: Professional defamation under scandal, public misunderstandings.', hi: 'नीच राशि: कार्यक्षेत्र में अपयश का भय, भावनात्मक अशांति।' }
    },
    aspectModifiers: [
      { graha: 'Sun', conditionEn: 'With Sun', conditionHi: 'सूर्य से युति', effectEn: 'High state authority, royal favor, charismatic public leader.', effectHi: 'राजकीय सत्ता, उच्चाधिकारियों का स्नेह, ओजस्वी व्यक्तित्व।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, distinguished career, respected businesswoman or teacher, brings honor to family.',
      hi: 'स्त्री जातक में कार्यक्षेत्र में विशिष्ट प्रतिष्ठा, सफल अध्यापिका या व्यवसायी, कुल का गौरव।'
    }
  },
  {
    planet: 'Moon',
    planetHi: 'चन्द्रमा',
    house: 11,
    titleEn: 'Moon in 11th House (Labha Bhava)',
    titleHi: 'चन्द्रमा एकादश भाव (लाभ व आय भाव) में',
    baseEn: 'Multifold gains, vast friendly circle, prosperous daughters and elder sisters, generous patronage, fulfilment of desires through artistic and public endeavors.',
    baseHi: 'बहुमुखी लाभ, विशाल मित्र मंडली, सुखी कन्या संतति व अग्रजा, मनोकामनाओं की पूर्ति, कला व जनसेवा से धनोपार्जन।',
    ageMilestones: [
      { age: 27, nature: 'favorable', eventEn: 'Substantial monetary accumulation, expansion of noble friendships.', eventHi: 'विपुल धन लाभ, उच्च मित्रों का सहयोग, व्यापार विस्तार।' },
      { age: 36, nature: 'favorable', eventEn: 'Acquisition of assets, financial summit, community honor.', eventHi: 'स्थाई संपत्ति का लाभ, आर्थिक शिखर, समाज में प्रतिष्ठा।' }
    ],
    signModifiers: {
      Taurus: { en: 'Exalted: Multi-stream immense wealth, opulent lifestyle, noble friends.', hi: 'उच्च राशि: अनेक स्रोतों से विपुल धन, वैभवशाली जीवन, कुलीन मित्र।' },
      Scorpio: { en: 'Debilitated: Deceit from false friends, fluctuating profits, anxiety over elder sister.', hi: 'नीच राशि: मित्रों से विश्वासघात, आय में अस्थिरता, अग्रजा की चिंता।' }
    },
    aspectModifiers: [
      { graha: 'Venus', conditionEn: 'With Venus', conditionHi: 'शुक्र से युति', effectEn: 'Artistic wealth, luxury vehicles, high social circles.', effectHi: 'कला से धन, विलासिता के साधन, उच्च अभिजात्य वर्ग में उठक-बैठक।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, wealthy, loved by friends, fulfilled life desires, prosperous children.',
      hi: 'स्त्री जातक में अत्यधिक संपन्न, सखियों में प्रिय, मनोवांछित फल की प्राप्ति, सुखी संतान।'
    }
  },
  {
    planet: 'Moon',
    planetHi: 'चन्द्रमा',
    house: 12,
    titleEn: 'Moon in 12th House (Vyaya Bhava)',
    titleHi: 'चन्द्रमा द्वादश भाव (व्यय व मोक्ष भाव) में',
    baseEn: 'Secluded spiritual seeker, expenditure on philanthropic and pilgrimage causes. Sensitive left eye, vivid dreams, foreign travel and settlement. Peaceful solitude.',
    baseHi: 'एकांतप्रिय आध्यात्मिक साधक, धर्मार्थ व तीर्थ यात्राओं पर व्यय। बाएं नेत्र में संवेदनशीलता, स्वप्नशीलता, विदेश वास का प्रबल योग। एकांत में मानसिक शांति।',
    ageMilestones: [
      { age: 25, nature: 'career', eventEn: 'Overseas journey or foreign educational/vocational venture.', eventHi: 'विदेश गमन अथवा सुदूर स्थानों में विद्या व आजीविका।' },
      { age: 45, nature: 'favorable', eventEn: 'Spiritual detachment, higher meditation, philanthropic legacy.', eventHi: 'आध्यात्मिक विरक्ति, गहन ध्यान, परोपकार में जीवन का समर्पण।' }
    ],
    signModifiers: {
      Taurus: { en: 'Exalted: Foreign prosperity, peaceful meditation, charitable endowments.', hi: 'उच्च राशि: विदेश में अपार समृद्धि, शांत ध्यान, विशाल धर्मार्थ कार्य।' },
      Scorpio: { en: 'Debilitated: Sleep disorders, emotional isolation, ocular and hospital expenses.', hi: 'नीच राशि: अनिद्रा, मानसिक अवसाद, नेत्र पीड़ा व चिकित्सा व्यय।' }
    },
    aspectModifiers: [
      { graha: 'Jupiter', conditionEn: 'Aspected by Jupiter', conditionHi: 'गुरु की दृष्टि', effectEn: 'Moksha seeker, divine dreams, peaceful foreign abode.', effectHi: 'मोक्ष मार्ग की ओर अग्रसर, पवित्र स्वप्न, विदेश में सुखी वास।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, charitable, fond of solitude, sensitive emotions, abroad travel, needs sound sleep hygiene.',
      hi: 'स्त्री जातक में दानशीला, एकांतप्रिय, अत्यधिक भावुक, विदेश यात्रा, निद्रा पर ध्यान आवश्यक।'
    }
  }
];

export const MARS_HOUSES = [
  {
    planet: 'Mars',
    planetHi: 'मंगल',
    house: 1,
    titleEn: 'Mars in 1st House (Lagna)',
    titleHi: 'मंगल प्रथम भाव (लग्न) में',
    baseEn: 'Bold, daring, energetic, impulsive nature, scars on head or face, muscular build, short-tempered. Ruchaka Mahapurusha yoga if in own or exalted sign. Prone to burns, wounds, and blood pressure spikes.',
    baseHi: 'साहसी, निर्भीक, ऊर्जावान, उग्र स्वभाव, मस्तक या मुख पर चोट का चिह्न, मांसल शरीर, क्रोधी। स्वराशि या उच्च राशि में होने पर रुचक महापुरुष योग। अग्नि, शस्त्र, रक्त विकार व रक्तचाप की संवेदनशीलता।',
    ageMilestones: [
      { age: 9, nature: 'health', eventEn: 'Vulnerability to head wound, cuts, or burning incident.', eventHi: 'शिर में चोट, कटने या अग्नि से आंशिक आघात का सतर्कता वर्ष।' },
      { age: 19, nature: 'career', eventEn: 'Dawn of independent employment, military/police or technical victory.', eventHi: 'स्वतंत्र आजीविका का प्रारंभ, तकनीकी या रक्षा क्षेत्र में विजय।' },
      { age: 28, nature: 'favorable', eventEn: 'Peak of courageous ambition and administrative or land acquisition.', eventHi: 'पराक्रम का चरमोत्कर्ष, प्रशासनिक पद अथवा भूमि-भवन की प्राप्ति।' }
    ],
    signModifiers: {
      Capricorn: { en: 'Exalted: Ruchaka Mahapurusha yoga: Supreme commander, invincible courage, vast properties.', hi: 'उच्च राशि (मकर): रुचक महापुरुष योग: सर्वोच्च सेनानायक, अजेय पराक्रम, विपुल अचल संपत्ति।' },
      Cancer: { en: 'Debilitated: Impatience, reckless anger, blood disorders, conflicts with superiors.', hi: 'नीच राशि (कर्क): अधीरता, अकारण क्रोध, रक्त दोष, उच्चाधिकारियों से कलह।' },
      Aries: { en: 'Own Sign: Dauntless courage, pioneer leadership, sports or defense renown.', hi: 'स्वराशि (मेष): अदम्य पराक्रम, अग्रणी नेतृत्व, खेल या रक्षा क्षेत्र में ख्याति।' }
    },
    aspectModifiers: [
      { graha: 'Jupiter', conditionEn: 'Aspected by Jupiter', conditionHi: 'गुरु की दृष्टि', effectEn: 'Courage guided by righteous wisdom, high military or civil post, protector of the weak.', effectHi: 'विवेकपूर्ण पराक्रम, उच्च प्रशासनिक पद, दुर्बलों का रक्षक।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, dynamic personality, fearless, independent spirit, high physical vitality; requires patience in marital adjustments to avoid friction.',
      hi: 'स्त्री जातक में अत्यंत साहसी, निर्भीक, स्वतंत्र विचार, प्रचुर शारीरिक ऊर्जा; दांपत्य में धैर्य व सामंजस्य आवश्यक।'
    }
  },
  {
    planet: 'Mars',
    planetHi: 'मंगल',
    house: 2,
    titleEn: 'Mars in 2nd House (Dhana Bhava)',
    titleHi: 'मंगल द्वितीय भाव (धन भाव) में',
    baseEn: 'Harsh, aggressive speech, financial fluctuations through impulsive investments, dental or throat ailments. Gains through metals, lands, or engineering; domestic disputes over family heritage.',
    baseHi: 'कटु व तीव्र वाणी, उतावली में धन व्यय, दंत या कंठ रोग की संवेदनशीलता। धातु, भूमि, इंजीनियरिंग से लाभ; पैतृक संपत्ति को लेकर कुटुंब में विवाद।',
    ageMilestones: [
      { age: 19, nature: 'career', eventEn: 'First major financial earning through independent technical or field work.', eventHi: 'तकनीकी या क्षेत्र कार्य द्वारा प्रथम स्वतंत्र धनार्जन।' },
      { age: 28, nature: 'challenging', eventEn: 'Speech or property-induced conflict in domestic circle.', eventHi: 'कटु वाणी या संपत्ति विवाद के कारण कुटुंब में तनाव।' }
    ],
    signModifiers: {
      Capricorn: { en: 'Exalted: Enormous wealth through real estate, metallurgy, and executive authority.', hi: 'उच्च राशि: भू-संपत्ति, धातु उद्योग व प्रशासनिक अधिकारों से विपुल धनोपार्जन।' },
      Cancer: { en: 'Debilitated: Heavy financial losses through litigation or speculative gambles, harsh speech.', hi: 'नीच राशि: मुकदमों या सट्टेबाजी में धनहानि, कटु वाणी से संबंध विच्छेद।' }
    },
    aspectModifiers: [
      { graha: 'Jupiter', conditionEn: 'Aspected by Jupiter', conditionHi: 'गुरु की दृष्टि', effectEn: 'Controls aggressive speech, bestows lawful financial prosperity.', effectHi: 'वाणी में सौम्यता, धर्म सम्मत धन संचय तथा कुटुंब सुख।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, sharp tongue when provoked, strong financial grit, guardian of material assets, tact needed with in-laws.',
      hi: 'स्त्री जातक में स्पष्टवादी, आर्थिक रूप से सुदृढ़, धन संपदा की संरक्षिका, ससुराल पक्ष के साथ संयमित वाणी आवश्यक।'
    }
  },
  {
    planet: 'Mars',
    planetHi: 'मंगल',
    house: 3,
    titleEn: 'Mars in 3rd House (Sahaja Bhava)',
    titleHi: 'मंगल तृतीय भाव (पराक्रम भाव) में',
    baseEn: 'Supreme valor, unshakeable courage, athletic champion, military or engineering prowess. Strained relations with younger brothers or fewer siblings. Triumphs over all rivals.',
    baseHi: 'अद्वितीय शौर्य, अदम्य साहस, कुशल खिलाड़ी, सेना या तकनीकी विद्या में अग्रणी। छोटे भाइयों से मतभेद अथवा उनकी संख्या अल्प। शत्रुओं का पूर्ण दमन।',
    ageMilestones: [
      { age: 17, nature: 'career', eventEn: 'Breakthrough in sports, technical competitions, or defense entrance.', eventHi: 'खेलकूद, तकनीकी प्रतियोगिता या रक्षा परीक्षा में सफलता।' },
      { age: 28, nature: 'favorable', eventEn: 'Grand milestone in business, engineering venture, or heroic enterprise.', eventHi: 'व्यापार, इंजीनियरिंग उपक्रम या साहसिक कार्य में कीर्ति।' }
    ],
    signModifiers: {
      Capricorn: { en: 'Exalted: Invincible bravery, national sports or defense honors.', hi: 'उच्च राशि: अजेय पराक्रम, राष्ट्रीय स्तर पर खेल या सैन्य सम्मान।' },
      Cancer: { en: 'Debilitated: Frustrated courage, arm fractures, friction with siblings.', hi: 'नीच राशि: सहोदरों से तनाव, भुजाओं में चोट, असमय आवेश।' }
    },
    aspectModifiers: [
      { graha: 'Sun', conditionEn: 'With Sun', conditionHi: 'सूर्य से युति', effectEn: 'Blazing valor, state defense leadership, formidable hero.', effectHi: 'प्रचंड पराक्रम, राजकीय रक्षा कमान, दुर्जेय सेनानी।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, exceptionally courageous, protects siblings and family, skilled in technical arts and sports.',
      hi: 'स्त्री जातक में अत्यंत साहसी, परिवार की संरक्षिका, तकनीकी कलाओं व खेलकूद में कुशल।'
    }
  },
  {
    planet: 'Mars',
    planetHi: 'मंगल',
    house: 4,
    titleEn: 'Mars in 4th House (Sukha Bhava)',
    titleHi: 'मंगल चतुर्थ भाव (सुख भाव) में (मांगलिक दोष)',
    baseEn: 'Mangalik dosha: Domestic unrest, friction with mother, property litigations, accident prone near home or vehicles. Massive landed assets if well placed in Capricorn or Aries.',
    baseHi: 'मांगलिक दोष: गृह सुख में अशांति, माता के स्वास्थ्य की चिंता, भूमि व वाहन को लेकर विवाद या दुर्घटना का भय। मकर या मेष में होने पर विपुल भू-संपत्ति का स्वामी।',
    ageMilestones: [
      { age: 8, nature: 'health', eventEn: 'Domestic disturbance or physical fall/injury near home.', eventHi: 'गृह में अशांति अथवा गिरने से शारीरिक चोट का भय।' },
      { age: 28, nature: 'challenging', eventEn: 'Relocation, domestic overhaul, or major property transaction.', eventHi: 'गृह परिवर्तन, मकान का निर्माण अथवा भूमि संबंधी बड़ा सौदा।' }
    ],
    signModifiers: {
      Capricorn: { en: 'Exalted: Palatial mansions, expansive agricultural lands, high vehicles.', hi: 'उच्च राशि: विशाल प्रासाद, कृषि भूमि का स्वामित्व, उत्तम वाहन।' },
      Cancer: { en: 'Debilitated: Maternal suffering, broken home atmosphere, vehicle damage.', hi: 'नीच राशि: माता को गंभीर कष्ट, गृह क्लेश, वाहन से दुर्घटना।' }
    },
    aspectModifiers: [
      { graha: 'Jupiter', conditionEn: 'Aspected by Jupiter', conditionHi: 'गुरु की दृष्टि', effectEn: 'Mitigates Mangalik dosha, protects maternal longevity and peace.', effectHi: 'मांगलिक दोष का शमन, माता की दीर्घायु तथा घर में शांति।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, strong-willed domestic management, property rights, requires tact to preserve domestic harmony and peace with partner.',
      hi: 'स्त्री जातक में गृह प्रबंधन में कठोरता, संपत्ति अधिकार, दांपत्य शांति हेतु सामंजस्य आवश्यक।'
    }
  },
  {
    planet: 'Mars',
    planetHi: 'मंगल',
    house: 5,
    titleEn: 'Mars in 5th House (Suta Bhava)',
    titleHi: 'मंगल पंचम भाव (संतान व बुद्धि भाव) में',
    baseEn: 'Fierce intellect, speculative boldness, short temper, delay or complications in progeny, prone to stomach heat and digestive acidity. Sharp technical student.',
    baseHi: 'उग्र प्रज्ञा, सट्टेबाजी या जोखिम भरे निवेश में साहस, त्वरित क्रोध, संतान प्राप्ति में विलंब या कष्ट, उदर में पित्त व गर्मी। तकनीकी विद्या में मेधावी।',
    ageMilestones: [
      { age: 21, nature: 'career', eventEn: 'Intense academic competition, engineering or technical triumph.', eventHi: 'तीव्र बौद्धिक प्रतिस्पर्धा, इंजीनियरिंग या तकनीकी परीक्षा में विजय।' },
      { age: 28, nature: 'favorable', eventEn: 'Birth of a bold child, success in calculated speculative venture.', eventHi: 'तेजस्वी संतान का जन्म, साहसिक वित्तीय उपक्रम में लाभ।' }
    ],
    signModifiers: {
      Capricorn: { en: 'Exalted: Genius engineering mind, illustrious progeny, high speculative gains.', hi: 'उच्च राशि: तकनीकी प्रतिभा, प्रतापी संतान, वित्तीय उपक्रमों में भारी लाभ।' },
      Cancer: { en: 'Debilitated: Complications in pregnancy, abdominal surgery, academic setbacks.', hi: 'नीच राशि: गर्भस्त्राव का भय, उदर में शल्य चिकित्सा (सर्जरी), विद्या में बाधा।' }
    },
    aspectModifiers: [
      { graha: 'Jupiter', conditionEn: 'Aspected by Jupiter', conditionHi: 'गुरु की दृष्टि', effectEn: 'Shields progeny, bestows righteous high intellect and speculative wisdom.', effectHi: 'संतान की रक्षा, सद्बुद्धि तथा बौद्धिक कार्यों में यश।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, gynecological care required during pregnancy, caesarean section indication, fierce mother, brilliant sharp mind.',
      hi: 'स्त्री जातक में गर्भावस्था में विशेष सावधानी, शल्य प्रसव (सिजेरियन) का योग, साहसी माता, कुशाग्र बुद्धि।'
    }
  },
  {
    planet: 'Mars',
    planetHi: 'मंगल',
    house: 6,
    titleEn: 'Mars in 6th House (Ripu Bhava)',
    titleHi: 'मंगल षष्ठ भाव (शत्रु व रोग भाव) में',
    baseEn: 'Supreme Shatruhanta, completely crushes enemies and competitors, robust immunity, triumph in litigation, defense, surgery, and sports. Strong digestion.',
    baseHi: 'परम शत्रुहंता, विरोधियों व षड्यंत्रकारियों का समूल नाश, अदम्य रोग प्रतिरोधक क्षमता, मुकदमे, रक्षा, शल्य चिकित्सा व खेल में विजय। तीव्र जठराग्नि।',
    ageMilestones: [
      { age: 21, nature: 'career', eventEn: 'Historic victory in competitive examination, sports, or legal fight.', eventHi: 'प्रतियोगी परीक्षा, खेल या विधिक संघर्ष में ऐतिहासिक विजय।' },
      { age: 27, nature: 'favorable', eventEn: 'Total annihilation of competitors and clearance of long-standing debts.', eventHi: 'शत्रुओं पर पूर्ण विजय तथा पुराने ऋणों से मुक्ति।' }
    ],
    signModifiers: {
      Capricorn: { en: 'Exalted: Unconquerable warrior, top rank in defense or judiciary, fearless.', hi: 'उच्च राशि: अजेय योद्धा, रक्षा या न्याय प्रशासन में सर्वोच्च स्थान, निर्भीक।' },
      Cancer: { en: 'Debilitated: Blood impurities, surgical operations, troublesome disputes.', hi: 'नीच राशि: रक्त विकार, शल्य क्रिया, विवादों में उलझने का भय।' }
    },
    aspectModifiers: [
      { graha: 'Saturn', conditionEn: 'With Saturn', conditionHi: 'शनि से युति', effectEn: 'Fierce endurance, overcomes monumental conspiracies after hard struggle.', effectHi: 'कठोर संघर्ष के उपरांत भारी षड्यंत्रों को परास्त करने वाला।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, iron resilience, overcomes workplace hurdles easily, dominant over competitors, prone to acidity.',
      hi: 'स्त्री जातक में अपार कार्यक्षमता, कार्यक्षेत्र की बाधाओं को परास्त करने वाली, प्रतिस्पर्धियों पर हावी, पित्त संवेदनशीलता।'
    }
  },
  {
    planet: 'Mars',
    planetHi: 'मंगल',
    house: 7,
    titleEn: 'Mars in 7th House (Kalatra Bhava)',
    titleHi: 'मंगल सप्तम भाव (कलत्र भाव) में (मांगलिक दोष)',
    baseEn: 'Severe Mangalik dosha: Intense marital friction, passionate but short-tempered spouse, early marriage disputes, friction in commercial partnerships.',
    baseHi: 'तीव्र मांगलिक दोष: दांपत्य में मतभेद, जीवनसाथी उग्र व क्रोधी स्वभाव का, विवाह में विलंब या कलह, व्यापारिक साझेदारी में तनाव।',
    ageMilestones: [
      { age: 27, nature: 'challenging', eventEn: 'Crucial marital crossroad or partnership trial requiring high patience.', eventHi: 'दांपत्य जीवन या व्यापारिक साझेदारी में गंभीर परीक्षा का वर्ष।' },
      { age: 32, nature: 'favorable', eventEn: 'Resolution of marital adjustments or profitable independent trade.', eventHi: 'दांपत्य में सामंजस्य तथा स्वतंत्र व्यापार में प्रगति।' }
    ],
    signModifiers: {
      Capricorn: { en: 'Exalted: Highly dynamic, affluent, and high-status spouse; cancels Mangalik severity.', hi: 'उच्च राशि: अत्यंत कर्मठ, प्रतिष्ठित व समृद्ध जीवनसाथी; मांगलिक दोष का परिहार।' },
      Cancer: { en: 'Debilitated: Severe marital discord, separation risk, spouse fragile health.', hi: 'नीच राशि: तीव्र दांपत्य कलह, अलगाव का जोखिम, जीवनसाथी का दुर्बल स्वास्थ्य।' }
    },
    aspectModifiers: [
      { graha: 'Jupiter', conditionEn: 'Aspected by Jupiter', conditionHi: 'गुरु की दृष्टि', effectEn: 'Cancels malefic Mangalik effects, secures marital longevity and mutual respect.', effectHi: 'मांगलिक दोष का पूर्ण परिहार, दांपत्य की रक्षा व सम्मान।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, dominant husband, marital adjustments require high tact, early marriage tensions settled in mature years.',
      hi: 'स्त्री जातक में पति प्रभावशाली व तेज स्वभाव का, दांपत्य में धैर्य आवश्यक, उत्तरार्ध में शांति।'
    }
  },
  {
    planet: 'Mars',
    planetHi: 'मंगल',
    house: 8,
    titleEn: 'Mars in 8th House (Ayu Bhava)',
    titleHi: 'मंगल अष्टम भाव (आयु व रंध्र भाव) में (मांगलिक दोष)',
    baseEn: 'Intense Mangalik dosha: Surgical interventions, piles/fistula, blood disorders, accident risk from fire, vehicles, or weapons. Sudden financial windfalls or legacy disputes.',
    baseHi: 'तीव्र मांगलिक दोष: शल्य चिकित्सा (ऑपरेशन), बवासीर, रक्त विकार, अग्नि, वाहन या शस्त्र से चोट का भय। आकस्मिक धन लाभ अथवा वसीयत को लेकर विवाद।',
    ageMilestones: [
      { age: 14, nature: 'health', eventEn: 'Vulnerability to cuts, burns, or physical injury.', eventHi: 'अग्नि, शस्त्र या गिरने से चोट का सतर्कता वर्ष।' },
      { age: 28, nature: 'health', eventEn: 'Surgical operation, blood purification, or transformative crisis.', eventHi: 'शल्य क्रिया, रक्त विकार या जीवन में बड़ा रूपांतरण।' },
      { age: 35, nature: 'favorable', eventEn: 'Sudden financial windfall through insurance, legacy, or research.', eventHi: 'बीमा, वसीयत या गुप्त शोध से अचानक बड़ा धन लाभ।' }
    ],
    signModifiers: {
      Capricorn: { en: 'Exalted: Robust longevity, massive unexpected inheritance, successful surgery.', hi: 'उच्च राशि: दीर्घायु, अप्रत्याशित पैतृक संपत्ति, शल्य क्रिया में पूर्ण सफलता।' },
      Cancer: { en: 'Debilitated: Critical health vulnerabilities, chronic blood disorders, accidents.', hi: 'नीच राशि: स्वास्थ्य के प्रति अत्यधिक सतर्कता, रक्त विकार, दुर्घटना का भय।' }
    },
    aspectModifiers: [
      { graha: 'Jupiter', conditionEn: 'Aspected by Jupiter', conditionHi: 'गुरु की दृष्टि', effectEn: 'Shields vitality, saves life during critical hazards, deep metaphysical research.', effectHi: 'प्राणों की रक्षा, गंभीर संकटों से बचाव, गूढ़ वैज्ञानिक शोध।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, gynecological health care needed, marital caution regarding spouse health, sudden inheritance.',
      hi: 'स्त्री जातक में जननेंद्रिय व मासिक धर्म का विशेष ध्यान, पति के स्वास्थ्य के प्रति सजगता, आकस्मिक धन लाभ।'
    }
  },
  {
    planet: 'Mars',
    planetHi: 'मंगल',
    house: 9,
    titleEn: 'Mars in 9th House (Dharma Bhava)',
    titleHi: 'मंगल नवम भाव (धर्म व भाग्य भाव) में',
    baseEn: 'Independent religious beliefs, conflict with orthodox dogmas or father, courageous explorer, fortunes through machinery, real estate, and foreign enterprise.',
    baseHi: 'स्वतंत्र धार्मिक विचार, पिता या पारंपरिक मान्यताओं से वैचारिक मतभेद, साहसी अन्वेषक, तकनीकी मशीनरी, भूमि व विदेश व्यापार से भाग्योदय।',
    ageMilestones: [
      { age: 28, nature: 'career', eventEn: 'Major breakthrough in fortunes through independent enterprise or relocation.', eventHi: 'स्वतंत्र उपक्रम अथवा स्थान परिवर्तन से महत्वपूर्ण भाग्योदय।' },
      { age: 38, nature: 'favorable', eventEn: 'Establishment of prestigious estate, leadership in legal or industrial field.', eventHi: 'प्रतिष्ठित उद्योग या संपत्ति की स्थापना, सामाजिक प्रतिष्ठा।' }
    ],
    signModifiers: {
      Capricorn: { en: 'Exalted: Supreme fortune through land, defense, and high administrative posts.', hi: 'उच्च राशि: भू-संपत्ति, रक्षा व उच्च प्रशासनिक पदों से असाधारण भाग्योदय।' },
      Cancer: { en: 'Debilitated: Strained paternal relationship, obstacles in higher education, travel hazards.', hi: 'नीच राशि: पिता से मतभेद, उच्च शिक्षा में विघ्न, यात्रा में कष्ट।' }
    },
    aspectModifiers: [
      { graha: 'Jupiter', conditionEn: 'Aspected by Jupiter', conditionHi: 'गुरु की दृष्टि', effectEn: 'Righteous warrior, dharmic leadership, deep spiritual conviction.', effectHi: 'धर्म योद्धा, सात्विक नेतृत्व, शास्त्रों के प्रति निष्ठा।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, strong independent convictions, ambitious, travels for work, supports righteous causes.',
      hi: 'स्त्री जातक में स्वतंत्र विचार, उच्च महत्वाकांक्षा, कार्य हेतु यात्राएं, न्याय व धर्म की पक्षधर।'
    }
  },
  {
    planet: 'Mars',
    planetHi: 'मंगल',
    house: 10,
    titleEn: 'Mars in 10th House (Karma Bhava)',
    titleHi: 'मंगल दशम भाव (कर्म व राज्य भाव) में',
    baseEn: 'Supreme Kuladipaka yoga, highest directional strength (Digbala). Dominant government rank, military commander, top surgeon, engineering tycoon, unstoppable authority.',
    baseHi: 'सर्वोच्च कुलादीपक योग, दशम भाव में मंगल को पूर्ण दिग्बल प्राप्त होता है। सेनानायक, उच्च प्रशासनिक पद, प्रसिद्ध सर्जन, इंजीनियरिंग उद्योगपति, सर्वमान्य प्रतिष्ठा।',
    ageMilestones: [
      { age: 21, nature: 'career', eventEn: 'First major breakthrough into professional ranks or prestigious academy.', eventHi: 'प्रतिष्ठित संस्थान या राजकीय सेवा में प्रथम प्रवेश।' },
      { age: 28, nature: 'favorable', eventEn: 'Landmark promotion, national honors, supreme executive triumph.', eventHi: 'ऐतिहासिक पदोन्नति, राष्ट्रीय सम्मान, सर्वोच्च प्रशासनिक विजय।' }
    ],
    signModifiers: {
      Capricorn: { en: 'Exalted: Ruchaka Mahapurusha yoga: Supreme commander of armed forces, minister.', hi: 'उच्च राशि (मकर): रुचक महापुरुष योग: सेना या पुलिस का शीर्ष कमांडर, मंत्री तुल्य अधिकार।' },
      Cancer: { en: 'Debilitated: Professional friction, fall from authority under impulse, reckless actions.', hi: 'नीच राशि: कार्यक्षेत्र में विवाद, आवेश में पदहानि, अधिकारियों से अनबन।' }
    },
    aspectModifiers: [
      { graha: 'Sun', conditionEn: 'With Sun', conditionHi: 'सूर्य से युति', effectEn: 'Royal commander, high government authority, fearlessness in public duty.', effectHi: 'राजकीय सत्ता, सर्वोच्च प्रशासनिक अधिकार, कर्तव्य में निडर।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, outstanding corporate or civil administrative career, commanding authority, high executive distinction.',
      hi: 'स्त्री जातक में कॉर्पोरेट या सिविल सेवा में सर्वोच्च पद, नेतृत्वकारी व्यक्तित्व, कार्यक्षेत्र में दबदबा।'
    }
  },
  {
    planet: 'Mars',
    planetHi: 'मंगल',
    house: 11,
    titleEn: 'Mars in 11th House (Labha Bhava)',
    titleHi: 'मंगल एकादश भाव (लाभ भाव) में',
    baseEn: 'Immense accumulation of wealth, multi-stream profits from real estate, metallurgy, defense, and trade. Brave elder siblings, ambitious goals fulfilled.',
    baseHi: 'अपार धन संचय, भू-संपत्ति, धातु उद्योग, ठेकेदारी व व्यापार से बहुमुखी लाभ। साहसी अग्रज, सभी महत्वाकांक्षी योजनाओं की पूर्ण सफलता।',
    ageMilestones: [
      { age: 28, nature: 'favorable', eventEn: 'Major financial windfall through real estate, engineering, or contracting.', eventHi: 'भूमि, भवन या तकनीकी ठेकेदारी से विपुल धन लाभ।' },
      { age: 36, nature: 'favorable', eventEn: 'Consolidation of vast assets, influential industrial networks.', eventHi: 'विशाल संपत्तियों का स्थायित्व, उद्योगपतियों में प्रतिष्ठा।' }
    ],
    signModifiers: {
      Capricorn: { en: 'Exalted: Multi-millionaire status, massive real estate holdings, political clout.', hi: 'उच्च राशि: अरबपति योग, विपुल भू-संपत्ति, राजनीतिक व प्रशासनिक प्रभाव।' },
      Cancer: { en: 'Debilitated: Strained relations with elder brother, fluctuating profits, debt recovery friction.', hi: 'नीच राशि: अग्रज से मतभेद, लाभ में उतार-चढ़ाव, धन वसूली में विवाद।' }
    },
    aspectModifiers: [
      { graha: 'Jupiter', conditionEn: 'Aspected by Jupiter', conditionHi: 'गुरु की दृष्टि', effectEn: 'Righteous and eternal wealth, high public philanthropy.', effectHi: 'धर्म सम्मत अक्षय धन, विशाल लोक कल्याणकारी कार्य।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, highly affluent, fearless decision maker, prosperous investments, commanding social standing.',
      hi: 'स्त्री जातक में अत्यधिक संपन्न, साहसी वित्तीय निर्णय, सफल निवेश, समाज में ऊंचा मान-सम्मान।'
    }
  },
  {
    planet: 'Mars',
    planetHi: 'मंगल',
    house: 12,
    titleEn: 'Mars in 12th House (Vyaya Bhava)',
    titleHi: 'मंगल द्वादश भाव (व्यय व मोक्ष भाव) में (मांगलिक दोष)',
    baseEn: 'Kuja dosha: Heavy expenditure on litigation, hospitalisation, or property disputes. Left eye sensitivity, insomnia, danger from secret foes, foreign residence.',
    baseHi: 'मांगलिक दोष: मुकदमों, चिकित्सा अथवा भूमि विवादों में भारी व्यय। बाएं नेत्र में विकार, अनिद्रा, गुप्त शत्रुओं का भय, विदेश वास का योग।',
    ageMilestones: [
      { age: 27, nature: 'challenging', eventEn: 'Unexpected financial expenditure or overseas travel friction.', eventHi: 'अकस्मात भारी व्यय अथवा विदेश प्रवास में कठिनाई।' },
      { age: 45, nature: 'favorable', eventEn: 'Settlement in foreign land, spiritual detachment, victory over hidden obstacles.', eventHi: 'विदेश में स्थायित्व, आध्यात्मिक विरक्ति, गुप्त बाधाओं का शमन।' }
    ],
    signModifiers: {
      Capricorn: { en: 'Exalted: High success and prosperity in overseas operations or defense exports.', hi: 'उच्च राशि: विदेशी उपक्रमों या तकनीकी निर्यात में भारी सफलता।' },
      Cancer: { en: 'Debilitated: Severe hospital bills, legal penalties, sleep disorders.', hi: 'नीच राशि: चिकित्सालय का भारी व्यय, विधिक दंड, गंभीर अनिद्रा।' }
    },
    aspectModifiers: [
      { graha: 'Jupiter', conditionEn: 'Aspected by Jupiter', conditionHi: 'गुरु की दृष्टि', effectEn: 'Controls expenditures, protects from hospitalisation, noble spiritual charities.', effectHi: 'अनावश्यक व्यय पर रोक, रोगों से रक्षा, धर्मार्थ कार्यों में दान।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, marital adjustments needed, emotional secrecy, eye strain, requires calm sleep hygiene.',
      hi: 'स्त्री जातक में दांपत्य में संयम आवश्यक, भावुकता, नेत्र पीड़ा, शांतिपूर्ण निद्रा का ध्यान रखें।'
    }
  }
];

export const MERCURY_HOUSES = [
  {
    planet: 'Mercury',
    planetHi: 'बुध',
    house: 1,
    titleEn: 'Mercury in 1st House (Lagna)',
    titleHi: 'बुध प्रथम भाव (लग्न) में',
    baseEn: 'Youthful appearance, witty, highly intellectual, mathematical acumen, charming communicator, humorous nature, longevity. Bhadra Mahapurusha yoga if in Gemini or Virgo.',
    baseHi: 'सदा युवा दिखने वाला स्वरूप, तीक्ष्ण बुद्धि, गणितीय मेधा, आकर्षक वक्ता, हास्य-विनोद प्रिय, दीर्घायु। मिथुन या कन्या में होने पर भद्र महापुरुष योग।',
    ageMilestones: [
      { age: 16, nature: 'career', eventEn: 'Exceptional academic brilliance, competitive distinction.', eventHi: 'अकादमिक व बौद्धिक प्रतियोगिताओं में असाधारण सफलता।' },
      { age: 20, nature: 'career', eventEn: 'Dawn of commercial, software, or media career.', eventHi: 'वाणिज्य, सॉफ्टवेयर, मीडिया या लेखन में स्वतंत्र आजीविका का प्रारंभ।' },
      { age: 32, nature: 'favorable', eventEn: 'High literary acclaim, commercial success, and wide influence.', eventHi: 'साहित्यिक प्रतिष्ठा, व्यापारिक विस्तार तथा विद्वत समाज में सम्मान।' }
    ],
    signModifiers: {
      Virgo: { en: 'Exalted: Bhadra Mahapurusha yoga: Supreme intellectual, master mathematician, diplomat.', hi: 'उच्च राशि (कन्या): भद्र महापुरुष योग: अद्वितीय विद्वान, गणितज्ञ, कुशल राजनयिक।' },
      Pisces: { en: 'Debilitated: Nervous anxiety, lack of concentration, speech hesitation under stress.', hi: 'नीच राशि (मीन): स्नायु दुर्बलता, एकाग्रता की कमी, तनाव में वाणी में संकोच।' }
    },
    aspectModifiers: [
      { graha: 'Jupiter', conditionEn: 'With or aspected by Jupiter', conditionHi: 'गुरु से युति या दृष्टि', effectEn: 'Saraswati yoga: Master of all shastras, revered teacher, supreme wisdom.', effectHi: 'सरस्वती योग: सर्वशास्त्र पारंगत, आदरणीय गुरु, परम प्रज्ञा।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, brilliant intellect, articulate, charming, proficient in arts, accounts, and domestic management.',
      hi: 'स्त्री जातक में कुशाग्र बुद्धि, वाक्पटु, आकर्षक, कला, संगीत व गृह प्रबंधन में सिद्धहस्त।'
    }
  },
  {
    planet: 'Mercury',
    planetHi: 'बुध',
    house: 2,
    titleEn: 'Mercury in 2nd House (Dhana Bhava)',
    titleHi: 'बुध द्वितीय भाव (धन भाव) में',
    baseEn: 'Eloquent orator, earns wealth through intellect, commerce, accounting, and advisory. Sweet-spoken, fond of learning, family prosperity.',
    baseHi: 'अद्भुत वक्ता, बुद्धि, वाणिज्य, लेखाकर्म तथा परामर्श द्वारा प्रचुर धनोपार्जन। मधुरभाषी, विद्या व्यसनी, कुटुंब में सुख-समृद्धि।',
    ageMilestones: [
      { age: 15, nature: 'favorable', eventEn: 'Early literary, speech, or mathematical awards.', eventHi: 'साहित्य, भाषण या गणितीय प्रतियोगिताओं में प्रारंभिक पुरस्कार।' },
      { age: 25, nature: 'favorable', eventEn: 'Substantial commercial wealth accumulation through advisory or trading.', eventHi: 'परामर्श या व्यापारिक कार्यों से विपुल धन संचय।' }
    ],
    signModifiers: {
      Virgo: { en: 'Exalted: Immense wealth through banking, corporate advisory, and trade.', hi: 'उच्च राशि: बैंकिंग, कॉर्पोरेट सलाहकार व व्यापार से विपुल धनोपार्जन।' },
      Pisces: { en: 'Debilitated: Financial losses through miscalculations, speech slips.', hi: 'नीच राशि: गलत गणना से व्यापार में हानि, वाणी में कटुता।' }
    },
    aspectModifiers: [
      { graha: 'Venus', conditionEn: 'With Venus', conditionHi: 'शुक्र से युति', effectEn: 'Poetic genius, artistic commerce, charming voice.', effectHi: 'काव्य प्रतिभा, कलात्मक व्यापार, मधुर व सम्मोहक वाणी।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, sweet melodious speech, proficient accountant for the home, charming conversation.',
      hi: 'स्त्री जातक में मधुर व मनभावन वाणी, पारिवारिक बजट व वित्त प्रबंधन में कुशल।'
    }
  },
  {
    planet: 'Mercury',
    planetHi: 'बुध',
    house: 3,
    titleEn: 'Mercury in 3rd House (Sahaja Bhava)',
    titleHi: 'बुध तृतीय भाव (सहज भाव) में',
    baseEn: 'Skilled writer, journalist, fond of siblings, curious, communicative, agile hands, successful in IT, media, and publishing.',
    baseHi: 'कुशल लेखक, पत्रकार, सहोदरों से स्नेह, जिज्ञासु, संवादप्रिय, दक्ष हस्तकला, आईटी, मीडिया व प्रकाशन में विशेष सफल।',
    ageMilestones: [
      { age: 15, nature: 'favorable', eventEn: 'Early publication, writing distinction, agile communication.', eventHi: 'प्रारंभिक लेखन, प्रकाशन अथवा बौद्धिक प्रतियोगिताओं में ख्याति।' },
      { age: 22, nature: 'career', eventEn: 'Professional breakthrough in media, publishing, software, or marketing.', eventHi: 'मीडिया, प्रकाशन, सॉफ्टवेयर या मार्केटिंग में करियर का उदय।' }
    ],
    signModifiers: {
      Virgo: { en: 'Exalted: Celebrated author, brilliant coder, devoted younger siblings.', hi: 'उच्च राशि: ख्यातिलब्ध लेखक, अद्वितीय सॉफ्टवेयर प्रोग्रामर, सहोदरों का सुख।' },
      Pisces: { en: 'Debilitated: Nervous arm/hand tremors, communication misunderstandings.', hi: 'नीच राशि: हाथों में कंपन, संवाद में गलतफहमियां, सहोदरों से मतभेद।' }
    },
    aspectModifiers: [
      { graha: 'Jupiter', conditionEn: 'Aspected by Jupiter', conditionHi: 'गुरु की दृष्टि', effectEn: 'High philosophical authorship, respected publisher, noble courageous mind.', effectHi: 'दार्शनिक लेखन, सम्मानित प्रकाशक, सात्विक पराक्रम।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, literary aptitude, close sisterly ties, creative talents, witty personality.',
      hi: 'स्त्री जातक में साहित्यिक अभिरुचि, बहनों से प्रगाढ़ स्नेह, कलात्मक व विनोदप्रिय स्वभाव।'
    }
  },
  {
    planet: 'Mercury',
    planetHi: 'बुध',
    house: 4,
    titleEn: 'Mercury in 4th House (Sukha Bhava)',
    titleHi: 'बुध चतुर्थ भाव (सुख भाव) में',
    baseEn: 'High formal education, intellectual mother, fine conveyances, beautiful home library, peace of mind through knowledge.',
    baseHi: 'उच्च औपचारिक शिक्षा, विदुषी माता, सुंदर वाहन, गृह में अध्ययन कक्ष/पुस्तकालय, ज्ञान द्वारा मानसिक शांति।',
    ageMilestones: [
      { age: 16, nature: 'career', eventEn: 'Exceptional academic degree progress, scholastic honors.', eventHi: 'अकादमिक परीक्षाओं में सर्वोच्च अंक व सम्मान।' },
      { age: 32, nature: 'favorable', eventEn: 'Acquisition of splendid home, vehicle, intellectual haven.', eventHi: 'सुंदर मकान, वाहन तथा समृद्ध गृह सुख की प्राप्ति।' }
    ],
    signModifiers: {
      Virgo: { en: 'Exalted: Vast landed estates, scholarly environment, prestigious degrees.', hi: 'उच्च राशि: विशाल भवन, विद्वतापूर्ण पारिवारिक वातावरण, उच्च उपाधियां।' },
      Pisces: { en: 'Debilitated: Interrupted education, domestic misunderstandings, vehicle breakdowns.', hi: 'नीच राशि: शिक्षा में व्यवधान, गृह क्लेश, वाहन में खराबी।' }
    },
    aspectModifiers: [
      { graha: 'Jupiter', conditionEn: 'Aspected by Jupiter', conditionHi: 'गुरु की दृष्टि', effectEn: 'Supreme educational excellence, saintly mother, serene home.', effectHi: 'सर्वोच्च शिक्षा, सुसंस्कृत माता, सुख-शांति से परिपूर्ण गृह।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, highly educated, cultured home environment, respected by relatives, loving mother.',
      hi: 'स्त्री जातक में उच्च शिक्षिता, सुसंस्कृत गृहस्थी, परिजनों में आदरणीय, आदर्श माता।'
    }
  },
  {
    planet: 'Mercury',
    planetHi: 'बुध',
    house: 5,
    titleEn: 'Mercury in 5th House (Suta Bhava)',
    titleHi: 'बुध पंचम भाव (संतान व बुद्धि भाव) में',
    baseEn: 'Brilliant memory, fertile intellect, mantra siddhi, advisor to rulers, cultured children, excels in mathematics, astrology, and stock analytics.',
    baseHi: 'अद्भुत स्मरण शक्ति, कुशाग्र मेधा, मंत्र सिद्धि, शासन का सलाहकार, सुसंस्कृत संतान, गणित, ज्योतिष व शेयर विश्लेषण में सिद्धहस्त।',
    ageMilestones: [
      { age: 16, nature: 'favorable', eventEn: 'Intellectual distinction in competitive mathematics or analytics.', eventHi: 'गणित या विश्लेषणात्मक प्रतियोगिताओं में विशिष्ट स्थान।' },
      { age: 26, nature: 'favorable', eventEn: 'Publication of scholarly work, birth of intelligent child.', eventHi: 'विद्वत्तापूर्ण ग्रंथ का प्रकाशन, मेधावी संतान का जन्म।' }
    ],
    signModifiers: {
      Virgo: { en: 'Exalted: Genius intellect, national advisory rank, brilliant progeny.', hi: 'उच्च राशि: विलक्षण प्रतिभा, राष्ट्रीय स्तर पर सलाहकार, अत्यंत मेधावी संतान।' },
      Pisces: { en: 'Debilitated: Mental restlessness, memory lapses under pressure, anxiety over children.', hi: 'नीच राशि: मानसिक चंचलता, परीक्षा में घबराहट, संतान की चिंता।' }
    },
    aspectModifiers: [
      { graha: 'Sun', conditionEn: 'With Sun (Budhaditya Yoga)', conditionHi: 'सूर्य से युति (बुधादित्य योग)', effectEn: 'Budhaditya yoga: Regal intellect, administrative brilliance, societal fame.', effectHi: 'बुधादित्य योग: राजसी प्रज्ञा, प्रशासनिक दक्षता, समाज में उच्च ख्याति।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, highly intelligent children, graceful demeanor, wise counsellor in family and community.',
      hi: 'स्त्री जातक में कुशाग्र मेधावी संतान, गरिमामयी व्यक्तित्व, परिवार में सुयोग्य परामर्शदात्री।'
    }
  },
  {
    planet: 'Mercury',
    planetHi: 'बुध',
    house: 6,
    titleEn: 'Mercury in 6th House (Ripu Bhava)',
    titleHi: 'बुध षष्ठ भाव (रोग व शत्रु भाव) में',
    baseEn: 'Sharp debate skills, analytical problem solver, skin or nervous system sensitivity, overcomes rivals through intellect and legal arbitration.',
    baseHi: 'तर्क-वितर्क में निपुण, विश्लेषणात्मक समाधानकर्ता, त्वचा या स्नायु तंत्र की संवेदनशीलता, प्रज्ञा व विधिक मध्यस्थता से शत्रुओं पर विजय।',
    ageMilestones: [
      { age: 21, nature: 'career', eventEn: 'Triumph in competitive interviews, analytical examinations.', eventHi: 'प्रतियोगी साक्षात्कार व विश्लेषणात्मक परीक्षाओं में विजय।' },
      { age: 35, nature: 'favorable', eventEn: 'Decisive settlement of legal disputes, workplace promotion.', eventHi: 'विधिक विवादों का शांतिपूर्ण समाधान, कार्यक्षेत्र में पदोन्नति।' }
    ],
    signModifiers: {
      Virgo: { en: 'Exalted: Complete triumph over enemies through legal intellect, robust health.', hi: 'उच्च राशि: कानूनी प्रज्ञा से शत्रुओं का दमन, उत्तम स्वास्थ्य।' },
      Pisces: { en: 'Debilitated: Nervous exhaustion, skin allergies, workplace misunderstandings.', hi: 'नीच राशि: स्नायु दुर्बलता, त्वचा रोग, कार्यक्षेत्र में गलतफहमियां।' }
    },
    aspectModifiers: [
      { graha: 'Saturn', conditionEn: 'With Saturn', conditionHi: 'शनि से युति', effectEn: 'Painstaking analytical labor, overcomes long litigations through documentation.', effectHi: 'कठोर दस्तावेजी परिश्रम, मुकदमों में साक्ष्यों द्वारा विजय।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, meticulous detail orientation, overcomes workplace rivals easily, nervous care required.',
      hi: 'स्त्री जातक में सूक्ष्म कार्यों में निपुण, कार्यक्षेत्र की प्रतिद्वंद्विता में सफल, स्नायु स्वास्थ्य पर ध्यान दें।'
    }
  },
  {
    planet: 'Mercury',
    planetHi: 'बुध',
    house: 7,
    titleEn: 'Mercury in 7th House (Kalatra Bhava)',
    titleHi: 'बुध सप्तम भाव (कलत्र भाव) में',
    baseEn: 'Intelligent, charming, humorous spouse, successful in commerce, trade, and diplomatic contracts. Early fortunate marriage if unafflicted.',
    baseHi: 'विद्वान, सुंदर, विनोदप्रिय जीवनसाथी, व्यापार, वाणिज्य तथा कूटनीतिक समझौतों में भारी सफलता। शुभ प्रभाव में समय पर सुखी विवाह।',
    ageMilestones: [
      { age: 21, nature: 'favorable', eventEn: 'Early engagement, marriage, or commercial partnership alliance.', eventHi: 'शुभ विवाह वार्ता, दांपत्य अथवा व्यावसायिक साझेदारी का प्रारंभ।' },
      { age: 28, nature: 'favorable', eventEn: 'Expansion of joint business, domestic happiness and mutual growth.', eventHi: 'संयुक्त व्यापार में विस्तार, दांपत्य सुख तथा प्रतिष्ठा में वृद्धि।' }
    ],
    signModifiers: {
      Virgo: { en: 'Exalted: Exceptionally wealthy, intellectual spouse; flourishing commercial empire.', hi: 'उच्च राशि: अत्यंत संपन्न व विदुषी जीवनसाथी; व्यापारिक साम्राज्य का विस्तार।' },
      Pisces: { en: 'Debilitated: Misunderstandings with spouse, deceit in trade partnerships.', hi: 'नीच राशि: दांपत्य में संवादहीनता, व्यापारिक साझेदारी में धोखे का भय।' }
    },
    aspectModifiers: [
      { graha: 'Jupiter', conditionEn: 'Aspected by Jupiter', conditionHi: 'गुरु की दृष्टि', effectEn: 'Highly cultured and righteous spouse, prosperous and peaceful marriage.', effectHi: 'अत्यंत संस्कारी व धर्मात्मा जीवनसाथी, सुखी व समृद्ध दांपत्य।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, intelligent handsome husband, harmonious marriage, commercial acumen, shared intellectual interests.',
      hi: 'स्त्री जातक में रूपवान व बुद्धिमान पति, मधुर दांपत्य, व्यापारिक सूझबूझ, परस्पर बौद्धिक सामंजस्य।'
    }
  },
  {
    planet: 'Mercury',
    planetHi: 'बुध',
    house: 8,
    titleEn: 'Mercury in 8th House (Ayu Bhava)',
    titleHi: 'बुध अष्टम भाव (आयु व रंध्र भाव) में',
    baseEn: 'Long life, famous, inheritance through intellectual works or maternal legacy, nervous sensitivity, profound research capability.',
    baseHi: 'दीर्घायु, प्रसिद्ध, बौद्धिक कार्यों या ननिहाल से संपत्ति, स्नायु संवेदनशीलता, गूढ़ अनुसंधान व शोध में असाधारण दक्षता।',
    ageMilestones: [
      { age: 17, nature: 'health', eventEn: 'Nervous tension, speech hesitation, or childhood health check.', eventHi: 'स्नायु तनाव या बाल्यावस्था में स्वास्थ्य सतर्कता।' },
      { age: 35, nature: 'favorable', eventEn: 'Sudden financial inheritance, major research breakthrough.', eventHi: 'अचानक वसीयत से लाभ अथवा शोध में अंतरराष्ट्रीय ख्याति।' }
    ],
    signModifiers: {
      Virgo: { en: 'Exalted: Very long life, vast legacies, supreme research discoveries.', hi: 'उच्च राशि: सुदीर्घ जीवन, विपुल पैतृक लाभ, सर्वोच्च वैज्ञानिक खोजें।' },
      Pisces: { en: 'Debilitated: Nervous disorders, legal disputes over inheritance, anxiety.', hi: 'नीच राशि: स्नायु विकार, वसीयत को लेकर विवाद, निरंतर चिंता।' }
    },
    aspectModifiers: [
      { graha: 'Jupiter', conditionEn: 'Aspected by Jupiter', conditionHi: 'गुरु की दृष्टि', effectEn: 'Shields vitality, bestows deep occult wisdom and peaceful longevity.', effectHi: 'प्राण रक्षा, गूढ़ आध्यात्मिक ज्ञान तथा शांत व सुदीर्घ जीवन।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, long-lived, scholarly, calm temperament, sudden financial windfalls through in-laws.',
      hi: 'स्त्री जातक में दीर्घायु, विदुषी, शांत स्वभाव, ससुराल पक्ष से धन लाभ।'
    }
  },
  {
    planet: 'Mercury',
    planetHi: 'बुध',
    house: 9,
    titleEn: 'Mercury in 9th House (Dharma Bhava)',
    titleHi: 'बुध नवम भाव (धर्म व भाग्य भाव) में',
    baseEn: 'Scholarly, religious writer, fortunate father, publisher, philanthropist, pilgrim, higher academic achievements.',
    baseHi: 'विद्वान, धार्मिक लेखक, सुखी पिता, प्रकाशक, दानवीर, तीर्थयात्री, उच्च अकादमिक उपाधियों की प्राप्ति।',
    ageMilestones: [
      { age: 16, nature: 'favorable', eventEn: 'Higher educational scholarship, spiritual initiation.', eventHi: 'उच्च शिक्षा हेतु छात्रवृत्ति, धार्मिक संस्कार।' },
      { age: 24, nature: 'favorable', eventEn: 'Major fortune breakthrough through publication, trade, or travel.', eventHi: 'प्रकाशन, व्यापार या विदेश यात्रा से विशाल भाग्योदय।' },
      { age: 32, nature: 'career', eventEn: 'Prestigious professorship, legal mastery, societal honors.', eventHi: 'विश्वविद्यालय में आचार्य पद, विधिक मान्यता, समाज में आदर।' }
    ],
    signModifiers: {
      Virgo: { en: 'Exalted: Supreme philosopher, internationally renowned author, pious father.', hi: 'उच्च राशि: परम दार्शनिक, अंतरराष्ट्रीय ख्याति प्राप्त लेखक, धर्मात्मा पिता।' },
      Pisces: { en: 'Debilitated: Doubts in faith, interrupted higher studies, travel fatigue.', hi: 'नीच राशि: आस्था में संशय, उच्च शिक्षा में बाधा, यात्रा में कष्ट।' }
    },
    aspectModifiers: [
      { graha: 'Jupiter', conditionEn: 'With or aspected by Jupiter', conditionHi: 'गुरु से युति या दृष्टि', effectEn: 'Supreme scholar, author of religious texts, universally respected.', effectHi: 'महापंडित, धर्मग्रंथों के प्रणेता, सर्वमान्य आदरणीय।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, pious, cultured, travels abroad for study or pilgrimage, charitable, brings luck to family.',
      hi: 'स्त्री जातक में धर्मपरायण, सुसंस्कृत, उच्च शिक्षा या तीर्थ हेतु यात्राएं, कुल हेतु सौभाग्यवर्धक।'
    }
  },
  {
    planet: 'Mercury',
    planetHi: 'बुध',
    house: 10,
    titleEn: 'Mercury in 10th House (Karma Bhava)',
    titleHi: 'बुध दशम भाव (कर्म व राज्य भाव) में',
    baseEn: 'High administrative post, versatile profession, accountant, diplomat, famous author, merchant, state recognition.',
    baseHi: 'उच्च प्रशासनिक पद, बहुमुखी आजीविका, चार्टर्ड अकाउंटेंट, कुशल राजनयिक, ख्यातिलब्ध लेखक, सफल व्यापारी, राजकीय सम्मान।',
    ageMilestones: [
      { age: 16, nature: 'favorable', eventEn: 'Academic awards, early career orientation in commerce or IT.', eventHi: 'अकादमिक पुरस्कार, वाणिज्य या आईटी में आजीविका की दिशा।' },
      { age: 25, nature: 'career', eventEn: 'High professional appointment, prestigious corporate role.', eventHi: 'उच्च पद पर नियुक्ति, प्रतिष्ठित कॉर्पोरेट जिम्मेदारी।' },
      { age: 32, nature: 'career', eventEn: 'Zenith of professional acclaim, state advisory or business summit.', eventHi: 'कार्यक्षेत्र में शिखर सम्मान, राजकीय सलाहकार पद।' }
    ],
    signModifiers: {
      Virgo: { en: 'Exalted: Bhadra Mahapurusha yoga: Supreme statesman, corporate tycoon, celebrated diplomat.', hi: 'उच्च राशि (कन्या): भद्र महापुरुष योग: शीर्ष प्रशासक, व्यापारिक महाप्रबंधक, प्रसिद्ध राजनयिक।' },
      Pisces: { en: 'Debilitated: Instability in profession, miscalculated business decisions.', hi: 'नीच राशि: आजीविका में बार-बार परिवर्तन, गलत गणना से व्यापार में हानि।' }
    },
    aspectModifiers: [
      { graha: 'Jupiter', conditionEn: 'Aspected by Jupiter', conditionHi: 'गुरु की दृष्टि', effectEn: 'Undisputed repute, ethical executive authority, judicial honor.', effectHi: 'निष्कलंक प्रतिष्ठा, नैतिक प्रशासनिक शक्ति, न्यायिक सम्मान।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, highly accomplished career, respected writer, financial auditor, self-sufficient professional.',
      hi: 'स्त्री जातक में कार्यक्षेत्र में उच्च पद, प्रतिष्ठित लेखिका, वित्तीय प्रबंधक, आत्मनिर्भर व्यक्तित्व।'
    }
  },
  {
    planet: 'Mercury',
    planetHi: 'बुध',
    house: 11,
    titleEn: 'Mercury in 11th House (Labha Bhava)',
    titleHi: 'बुध एकादश भाव (लाभ भाव) में',
    baseEn: 'Multi-stream income, intellectual friends, prosperous elder brother, commercial success, fulfilment of cherished aspirations.',
    baseHi: 'अनेक स्रोतों से नियमित आय, विद्वान व प्रभावशाली मित्र, सुखी अग्रज, व्यापार में निरंतर वृद्धि, सभी अभीष्टों की सिद्धि।',
    ageMilestones: [
      { age: 16, nature: 'favorable', eventEn: 'Early earnings through intellectual or creative skills.', eventHi: 'बौद्धिक या कलात्मक कौशल से प्रारंभिक धन लाभ।' },
      { age: 27, nature: 'favorable', eventEn: 'Major financial milestone, expansion of profitable commercial networks.', eventHi: 'बड़ा आर्थिक मील का पत्थर, लाभदायक व्यापारिक नेटवर्क का विस्तार।' }
    ],
    signModifiers: {
      Virgo: { en: 'Exalted: Immense multi-stream wealth, opulent investments, noble friends.', hi: 'उच्च राशि: अथाह बहुमुखी संपत्ति, सफल निवेश, कुलीन व विद्वान मित्र।' },
      Pisces: { en: 'Debilitated: Fluctuating profits, betrayal from false business associates.', hi: 'नीच राशि: आय में अस्थिरता, साझेदारी में सहयोगियों से विश्वासघात।' }
    },
    aspectModifiers: [
      { graha: 'Venus', conditionEn: 'With Venus', conditionHi: 'शुक्र से युति', effectEn: 'Artistic and luxury business profits, glamorous lifestyle.', effectHi: 'कला व विलासिता व्यापार से प्रचुर लाभ, वैभवशाली जीवन।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, wealthy, intelligent friends, social popularity, fulfilled desires, flourishing finances.',
      hi: 'स्त्री जातक में अत्यधिक संपन्न, विदुषी सखियां, समाज में लोकप्रियता, मनोकामनाओं की पूर्ति।'
    }
  },
  {
    planet: 'Mercury',
    planetHi: 'बुध',
    house: 12,
    titleEn: 'Mercury in 12th House (Vyaya Bhava)',
    titleHi: 'बुध द्वादश भाव (व्यय व मोक्ष भाव) में',
    baseEn: 'Eloquent in foreign lands, expenditure on education and spiritual literature, fond of seclusion, nervous sensitivity.',
    baseHi: 'विदेश में वाक्पटुता, शिक्षा व आध्यात्मिक साहित्य पर व्यय, एकांतप्रियता, स्नायु संवेदनशीलता, शोध हेतु विदेश वास।',
    ageMilestones: [
      { age: 25, nature: 'career', eventEn: 'Overseas education, foreign IT or commercial assignment.', eventHi: 'विदेश में उच्च शिक्षा, विदेशी आईटी या व्यापारिक कार्य।' },
      { age: 36, nature: 'favorable', eventEn: 'Spiritual writing, philosophical breakthrough in seclusion.', eventHi: 'एकांत में आध्यात्मिक लेखन, दार्शनिक अनुसंधान में सफलता।' }
    ],
    signModifiers: {
      Virgo: { en: 'Exalted: Immense wealth earned abroad, philosophical publications, peaceful mind.', hi: 'उच्च राशि: विदेश में विपुल धनोपार्जन, आध्यात्मिक प्रकाशन, शांत मन।' },
      Pisces: { en: 'Debilitated: Nervous strain, heavy educational expenses, communication errors abroad.', hi: 'नीच राशि: स्नायु तनाव, शिक्षा पर भारी व्यय, विदेश में गलतफहमियां।' }
    },
    aspectModifiers: [
      { graha: 'Jupiter', conditionEn: 'Aspected by Jupiter', conditionHi: 'गुरु की दृष्टि', effectEn: 'High spiritual wisdom, philanthropic expenditures, peaceful foreign abode.', effectHi: 'उच्च आध्यात्मिक ज्ञान, धर्मार्थ व्यय, विदेश में सुखी वास।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, charitable, fond of quiet contemplation, sensitive nervous system, travel abroad.',
      hi: 'स्त्री जातक में दानशीला, एकांत में चिंतनप्रिय, संवेदनशील स्नायु तंत्र, विदेश गमन।'
    }
  }
];

console.log('Moon and Mars and Mercury structures loaded.');
