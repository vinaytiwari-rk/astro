/* =========================================================================
   AIFAS CLASSICAL YOGINI & VIMSHOTTARI DASHA PREDICTIONS KNOWLEDGE BASE
   Source: 'Prediction through Dasha: Yogini & Vimshottari' by AIFAS
   All India Federation of Astrologers' Societies (AIFAS Standard Textbook)
   ========================================================================= */

export interface AifasBookReference {
  title: string;
  author: string;
  url: string;
  scope: string;
  fundamentalAxiomEn: string;
  fundamentalAxiomHi: string;
}

export const AIFAS_YOGINI_BOOK_METADATA: AifasBookReference = {
  title: 'Prediction through Dasha: Yogini & Vimshottari',
  author: 'All India Federation of Astrologers\' Societies (AIFAS)',
  url: 'https://astrofoxx.wordpress.com/wp-content/uploads/2018/11/jyotish_aifas_prediction-through-dasha-yogini.pdf',
  scope: 'Authoritative classical treatise on 36-Year Yogini Dasha, 64 Antardashas, 26 Golden Rules of Dasha Prediction, and Vimshottari synthesis.',
  fundamentalAxiomEn: 'Period prediction should be made according to the natural result of the planets in Yogini and Ashtottari period-sub-period. Prediction should not be made according to the result of Bhavadhipati.',
  fundamentalAxiomHi: 'योगिनी एवं अष्टोत्तरी दशा में फलादेश ग्रहों के स्वाभाविक/नैसर्गिक गुणों के आधार पर किया जाना चाहिए, न कि भावाधिपति (भाव-स्वामित्व) के आधार पर।'
};

export interface AifasYoginiMahaProfile {
  id: string;
  nameEn: string;
  nameHi: string;
  lordEn: string;
  lordHi: string;
  years: number;
  nakshatrasEn: string;
  nature: 'Auspicious' | 'Inauspicious' | 'Mixed';
  predictionEn: string;
  predictionHi: string;
  remediesEn: string[];
  remediesHi: string[];
}

export const AIFAS_YOGINI_MAHADASHAS: Record<string, AifasYoginiMahaProfile> = {
  Mangala: {
    id: 'mangala',
    nameEn: 'Mangala',
    nameHi: 'मंगला',
    lordEn: 'Moon',
    lordHi: 'चंद्रमा',
    years: 1,
    nakshatrasEn: 'Ashwini, Ardra, Chitra, Shravana',
    nature: 'Auspicious',
    predictionEn: 'A sense of devotion develops in religion, Brahmins and deities in a person in Major  period of Mangala. He leads a luxurious life enjoying name and fame and bliss of  wealth. He gets means of conveyance as horse or elephant from the ruler or the  government. Religious rites are performed in his family during this Period. He enjoys  the bliss of nice clothes and ornaments. He enjoys bliss of wife also and obtains higher  education. Sphere of his knowledge enhances further.',
    predictionHi: 'मंगला महादशा (१ वर्ष - स्वामी: चंद्रमा): धर्म, सात्विकता और ईश्वरीय भक्ति में वृद्धि। जातक को वाहन, सुंदर वस्त्र, आभूषण, दांपत्य सुख और विद्या-प्रतिष्ठा की प्राप्ति होती है। परिवार में मांगलिक उत्सव संपन्न होते हैं।',
    remediesEn: ["Chant Chandra Mantras and offer milk or white flowers on Mondays.", "Perform genuine charitable acts for mother or maternal figures."],
    remediesHi: ["सोमवार को चंद्र मंत्र जप एवं श्वेत पुष्प या दूध का अर्घ्य दें।", "माता व मातृवत स्त्रियों का सम्मान व सेवा करें।"]
  },
  Pingala: {
    id: 'pingala',
    nameEn: 'Pingala',
    nameHi: 'पिंगला',
    lordEn: 'Sun',
    lordHi: 'सूर्य',
    years: 2,
    nakshatrasEn: 'Bharani, Punarvasu, Swati, Dhanishta',
    nature: 'Mixed',
    predictionEn: 'In this Period of Pingala a person becomes free from heart-disease, grief, physical  and mental ailments caused due to bad company, disorder in blood, fever, disorder  caused by the excess of wind in the system, company of women of easy virtue etc. His  sons and servants recover from ailment. But he himself loses respect, wealth and  remains deprived of bliss of love.',
    predictionHi: 'पिंगला महादशा (२ वर्ष - स्वामी: सूर्य): जातक को पुराने हृदय रोगों और वात-पित्त की व्याधियों से राहत मिलती है, किंतु मान-सम्मान में उतार-चढ़ाव, मानसिक बेचैनी और धन हानि की संभावना रहती है।',
    remediesEn: ["Chant Surya Gayatri and offer water (Arghya) to the rising Sun daily.", "Maintain transparency and avoid ego disputes."],
    remediesHi: ["नित्य प्रातः सूर्य गायत्री मंत्र जप व तांबे के पात्र से सूर्य अर्घ्य दें।", "अहंकार से बचें और पिता का आशीर्वाद लें।"]
  },
  Dhanya: {
    id: 'dhanya',
    nameEn: 'Dhanya',
    nameHi: 'धान्या',
    lordEn: 'Jupiter',
    lordHi: 'बृहस्पति',
    years: 3,
    nakshatrasEn: 'Krittika, Pushya, Vishakha, Shatabhisha',
    nature: 'Auspicious',
    predictionEn: 'A native enjoys bliss of wealth, happiness, education, conjugal life, respect from the  rulers and many more joys during this Period. His business prospers, sphere of his  honour enhances further and his enemies get ruined. He goes on pilgrimages and a  sense of devotion in deities develops in him. This is a nice Period and only a lucky  fellow can have the pleasure of it.',
    predictionHi: 'धान्या महादशा (३ वर्ष - स्वामी: गुरु): अत्यंत शुभ काल। धन, सुख, विद्या, दांपत्य सौहार्द, राजकीय सम्मान, व्यापार विस्तार और शत्रुओं पर विजय। तीर्थ यात्राएं और धार्मिक अनुष्ठानों का सुअवसर।',
    remediesEn: ["Donate yellow items or grains (chana dal, turmeric) on Thursdays.", "Recite Vishnu Sahasranama or Guru Mantras."],
    remediesHi: ["गुरुवार को पीली वस्तुएं, चने की दाल व हल्दी का दान करें।", "विष्णु सहस्रनाम अथवा गुरु स्तोत्र का पाठ करें।"]
  },
  Bhramari: {
    id: 'bhramari',
    nameEn: 'Bhramari',
    nameHi: 'भ्रामरी',
    lordEn: 'Mars',
    lordHi: 'मंगल',
    years: 4,
    nakshatrasEn: 'Rohini, Ashlesha, Anuradha, Purva Bhadrapada',
    nature: 'Inauspicious',
    predictionEn: 'This Period is very much inauspicious for a person. He has to go to inaccessible  places such as forest, hills and to distant places from home in harsh sun like a wandering  deer. Even a person on who belongs to a royal family becomes deprived of all the joys  and happiness and keeps wandering like a vagabond.',
    predictionHi: 'भ्रामरी महादशा (४ वर्ष - स्वामी: मंगल): अत्यधिक कष्टप्रद और भ्रमणकारी काल। जातक को मृग की भांति घर से दूर वन, पर्वत और दुर्गम स्थानों पर भटकना पड़ता है; सुख-शांति में बाधा और व्यर्थ के कष्ट।',
    remediesEn: ["Chant Hanuman Chalisa or Mangala Stotram on Tuesdays.", "Avoid rash travels and aggressive confrontations."],
    remediesHi: ["मंगलवार को हनुमान चालीसा अथवा सुंदरकांड का पाठ करें।", "अनावश्यक जोखिम भरी यात्राओं व वाद-विवाद से बचें।"]
  },
  Bhadrika: {
    id: 'bhadrika',
    nameEn: 'Bhadrika',
    nameHi: 'भद्रिका',
    lordEn: 'Mercury',
    lordHi: 'बुध',
    years: 5,
    nakshatrasEn: 'Mrigashira, Magha, Jyeshtha, Uttara Bhadrapada',
    nature: 'Auspicious',
    predictionEn: 'In this Period a person enjoys friendship with his relatives, Brahmin and the king or  ruler. He gets honour from his friends. Religious rites and other functions are performed  in his family. He becomes interested in his business and trade. He enjoys company of  beautiful women and benefit offered by the state.',
    predictionHi: 'भद्रिका महादशा (५ वर्ष - स्वामी: बुध): मित्रों, विद्वानों और शासकों से घनिष्ठता। सामाजिक प्रतिष्ठा में वृद्धि, व्यापार में प्रचुर लाभ, सुंदर स्त्री/साथी का सान्निध्य और मांगलिक उत्सव।',
    remediesEn: ["Offer green grass or moong to cows on Wednesdays.", "Recite Budha Kavacham or worship Lord Ganesha."],
    remediesHi: ["बुधवार को गौ माता को हरा चारा या भीगी मूंग खिलाएं।", "भगवान श्री गणेश की आराधना व अथर्वशीर्ष का पाठ करें।"]
  },
  Ulka: {
    id: 'ulka',
    nameEn: 'Ulka',
    nameHi: 'उल्का',
    lordEn: 'Saturn',
    lordHi: 'शनि',
    years: 6,
    nakshatrasEn: 'Ardra, Purva Phalguni, Moola, Revati',
    nature: 'Inauspicious',
    predictionEn: 'A person is deprived of respect, wealth, cow, vehicle and apparels. He suffers in  business and trade and is punished by the king or ruler. His servants, children and wife  turn hostile to him. He suffers from diseases in heart, stomach, ears, teeth and feet.  Dasha Prediction 87   === PAGE 91 ===',
    predictionHi: 'उल्का महादशा (६ वर्ष - स्वामी: शनि): मान-प्रतिष्ठा, धन, वाहन व वस्त्रों की हानि। व्यापार में रुकावटें, शासक से दंड भय, परिजनों व भृत्यों से विरोध, तथा हृदय, उदर, दांत व पैरों में पीड़ा।',
    remediesEn: ["Light a mustard oil lamp under the Peepal tree on Saturday evenings.", "Recite Shani Chalisa or Maha Mrityunjaya Mantra."],
    remediesHi: ["शनिवार सायं पीपल वृक्ष के नीचे सरसों तेल का दीपक प्रज्वलित करें।", "शनि स्तोत्र अथवा महामृत्युंजय मंत्र का नित्य जप करें।"]
  },
  Siddha: {
    id: 'siddha',
    nameEn: 'Siddha',
    nameHi: 'सिद्धा',
    lordEn: 'Venus',
    lordHi: 'शुक्र',
    years: 7,
    nakshatrasEn: 'Punarvasu, Uttara Phalguni, Purva Ashadha',
    nature: 'Auspicious',
    predictionEn: 'During this Period a person accomplishes what all he undertakes. He enjoys the bliss  of honour, education, power from the king or ruler, wealth, clothes, ornaments, company  of noble people etc. He becomes inclined towards religious activities and interested  in trade. Auspicious functions like marriage of children are performed in his family.',
    predictionHi: 'सिद्धा महादशा (७ वर्ष - स्वामी: शुक्र): सर्व-कार्य सिद्धि काल। जो भी कार्य हाथ में लिया जाए उसमें सफलता, राजकीय सम्मान, विद्या, धन, आभूषण, श्रेष्ठजनों की संगति और संतानों के विवाहोत्सव।',
    remediesEn: ["Worship Goddess Lakshmi or recite Sri Suktam on Fridays.", "Maintain refined speech and respect women."],
    remediesHi: ["शुक्रवार को देवी लक्ष्मी की पूजा व श्री सूक्त का पाठ करें।", "नारी शक्ति का आदर करें और सात्विक सुगंध का उपयोग करें।"]
  },
  Sankata: {
    id: 'sankata',
    nameEn: 'Sankata',
    nameHi: 'संकटा',
    lordEn: 'Rahu',
    lordHi: 'राहु',
    years: 8,
    nakshatrasEn: 'Pushya, Hasta, Uttara Ashadha',
    nature: 'Inauspicious',
    predictionEn: 'In this Period the state gets ruined. Houses, villages, cities etc. may catch fire. A  person may suffer from diseases and loss of virility. Separation from wife and sons is  possible. The death of a person takes place only in the Period or Sub period of Sankata.',
    predictionHi: 'संकटा महादशा (८ वर्ष - स्वामी: राहु): राज्य में उथल-पुथल, अग्नि भय, व्याधियां, पौरुष हानि, परिजनों से वियोग और गंभीर संकट। योगिनी पद्धति में इस काल में विशिष्ट शांति परिहार अत्यंत आवश्यक है।',
    remediesEn: ["Recite Durga Saptashati or Rahu Stotram; perform Rahu Shanti.", "Donate black sesame, iron, or blankets to the needy."],
    remediesHi: ["दुर्गा सप्तशती अथवा राहु स्तोत्र का पाठ करें।", "काले तिल, कंबल या उड़द का दान करें और भैरव उपासना करें।"]
  },
};

export interface AifasYoginiSubProfile {
  key: string;
  mdName: string;
  adName: string;
  mdLordEn: string;
  adLordEn: string;
  years: number;
  months: number;
  days: number;
  durationStrEn: string;
  durationStrHi: string;
  isSpecialCrisisAlert: boolean;
  predictionEn: string;
  predictionHi: string;
}

export const AIFAS_YOGINI_64_ANTARDASHAS: Record<string, AifasYoginiSubProfile> = {
  'Mangala-Mangala': {
    key: 'Mangala-Mangala',
    mdName: 'Mangala',
    adName: 'Mangala',
    mdLordEn: 'Moon',
    adLordEn: 'Moon',
    years: 0,
    months: 0,
    days: 10,
    durationStrEn: '0Y 0M 10D',
    durationStrHi: '0 वर्ष 0 माह 10 दिन',
    isSpecialCrisisAlert: false,
    predictionEn: 'In the Sub period of Mangala in its Period a person enjoys all round prosperity. He enjoys bliss of friends, sons and wife. Auspicious functions are performed in the family.',
    predictionHi: 'मंगला में मंगला अंतरदशा: धन लाभ, ऐश्वर्य, पद-प्रतिष्ठा में वृद्धि, पारिवारिक सुख और कार्यों की निर्विघ्न सिद्धि। शास्त्रीय संकेत: In the Sub period of Mangala in its Period a person enjoys all round prosperity. He enjoys bliss of friends, sons and wife. Auspicious functions are performed in the family.'
  },
  'Mangala-Pingala': {
    key: 'Mangala-Pingala',
    mdName: 'Mangala',
    adName: 'Pingala',
    mdLordEn: 'Moon',
    adLordEn: 'Sun',
    years: 0,
    months: 0,
    days: 20,
    durationStrEn: '0Y 0M 20D',
    durationStrHi: '0 वर्ष 0 माह 20 दिन',
    isSpecialCrisisAlert: false,
    predictionEn: 'The',
    predictionHi: 'मंगला में पिंगला अंतरदशा: मिश्रित फल, कर्मठता से अनुकूल परिणाम और परिस्थितियों में धीमा सुधार। शास्त्रीय संकेत: The'
  },
  'Mangala-Dhanya': {
    key: 'Mangala-Dhanya',
    mdName: 'Mangala',
    adName: 'Dhanya',
    mdLordEn: 'Moon',
    adLordEn: 'Jupiter',
    years: 0,
    months: 1,
    days: 0,
    durationStrEn: '0Y 1M 0D',
    durationStrHi: '0 वर्ष 1 माह 0 दिन',
    isSpecialCrisisAlert: false,
    predictionEn: 'In the',
    predictionHi: 'मंगला में धान्या अंतरदशा: मिश्रित फल, कर्मठता से अनुकूल परिणाम और परिस्थितियों में धीमा सुधार। शास्त्रीय संकेत: In the'
  },
  'Mangala-Bhramari': {
    key: 'Mangala-Bhramari',
    mdName: 'Mangala',
    adName: 'Bhramari',
    mdLordEn: 'Moon',
    adLordEn: 'Mars',
    years: 0,
    months: 1,
    days: 10,
    durationStrEn: '0Y 1M 10D',
    durationStrHi: '0 वर्ष 1 माह 10 दिन',
    isSpecialCrisisAlert: false,
    predictionEn: '',
    predictionHi: 'मंगला में भ्रामरी अंतरदशा: मिश्रित फल, कर्मठता से अनुकूल परिणाम और परिस्थितियों में धीमा सुधार। शास्त्रीय संकेत: '
  },
  'Mangala-Bhadrika': {
    key: 'Mangala-Bhadrika',
    mdName: 'Mangala',
    adName: 'Bhadrika',
    mdLordEn: 'Moon',
    adLordEn: 'Mercury',
    years: 0,
    months: 1,
    days: 20,
    durationStrEn: '0Y 1M 20D',
    durationStrHi: '0 वर्ष 1 माह 20 दिन',
    isSpecialCrisisAlert: false,
    predictionEn: 'In the',
    predictionHi: 'मंगला में भद्रिका अंतरदशा: मिश्रित फल, कर्मठता से अनुकूल परिणाम और परिस्थितियों में धीमा सुधार। शास्त्रीय संकेत: In the'
  },
  'Mangala-Ulka': {
    key: 'Mangala-Ulka',
    mdName: 'Mangala',
    adName: 'Ulka',
    mdLordEn: 'Moon',
    adLordEn: 'Saturn',
    years: 0,
    months: 2,
    days: 0,
    durationStrEn: '0Y 2M 0D',
    durationStrHi: '0 वर्ष 2 माह 0 दिन',
    isSpecialCrisisAlert: false,
    predictionEn: '',
    predictionHi: 'मंगला में उल्का अंतरदशा: मिश्रित फल, कर्मठता से अनुकूल परिणाम और परिस्थितियों में धीमा सुधार। शास्त्रीय संकेत: '
  },
  'Mangala-Siddha': {
    key: 'Mangala-Siddha',
    mdName: 'Mangala',
    adName: 'Siddha',
    mdLordEn: 'Moon',
    adLordEn: 'Venus',
    years: 0,
    months: 2,
    days: 10,
    durationStrEn: '0Y 2M 10D',
    durationStrHi: '0 वर्ष 2 माह 10 दिन',
    isSpecialCrisisAlert: false,
    predictionEn: '',
    predictionHi: 'मंगला में सिद्धा अंतरदशा: मिश्रित फल, कर्मठता से अनुकूल परिणाम और परिस्थितियों में धीमा सुधार। शास्त्रीय संकेत: '
  },
  'Mangala-Sankata': {
    key: 'Mangala-Sankata',
    mdName: 'Mangala',
    adName: 'Sankata',
    mdLordEn: 'Moon',
    adLordEn: 'Rahu',
    years: 0,
    months: 2,
    days: 20,
    durationStrEn: '0Y 2M 20D',
    durationStrHi: '0 वर्ष 2 माह 20 दिन',
    isSpecialCrisisAlert: false,
    predictionEn: 'In the',
    predictionHi: 'मंगला में संकटा अंतरदशा: मिश्रित फल, कर्मठता से अनुकूल परिणाम और परिस्थितियों में धीमा सुधार। शास्त्रीय संकेत: In the'
  },
  'Pingala-Mangala': {
    key: 'Pingala-Mangala',
    mdName: 'Pingala',
    adName: 'Mangala',
    mdLordEn: 'Sun',
    adLordEn: 'Moon',
    years: 0,
    months: 0,
    days: 20,
    durationStrEn: '0Y 0M 20D',
    durationStrHi: '0 वर्ष 0 माह 20 दिन',
    isSpecialCrisisAlert: false,
    predictionEn: 'Mangala (i.e. Sub period of Mangala) in pingala causes many diseases, distress, fear etc. It also lessens the life span of the native.',
    predictionHi: 'पिंगला में मंगला अंतरदशा: संकट, मानसिक व्यथा, परिजनों से मतभेद और स्वास्थ्य के प्रति विशेष सतर्कता का समय। शास्त्रीय संकेत: Mangala (i.e. Sub period of Mangala) in pingala causes many diseases, distress, fear etc. It also lessens the life span of the native.'
  },
  'Pingala-Pingala': {
    key: 'Pingala-Pingala',
    mdName: 'Pingala',
    adName: 'Pingala',
    mdLordEn: 'Sun',
    adLordEn: 'Sun',
    years: 0,
    months: 1,
    days: 10,
    durationStrEn: '0Y 1M 10D',
    durationStrHi: '0 वर्ष 1 माह 10 दिन',
    isSpecialCrisisAlert: false,
    predictionEn: 'in Pingala causes diseases, distress, and agony due to addiction, strong longing for something and sufferings.',
    predictionHi: 'पिंगला में पिंगला अंतरदशा: संकट, मानसिक व्यथा, परिजनों से मतभेद और स्वास्थ्य के प्रति विशेष सतर्कता का समय। शास्त्रीय संकेत: in Pingala causes diseases, distress, and agony due to addiction, strong longing for something and sufferings.'
  },
  'Pingala-Dhanya': {
    key: 'Pingala-Dhanya',
    mdName: 'Pingala',
    adName: 'Dhanya',
    mdLordEn: 'Sun',
    adLordEn: 'Jupiter',
    years: 0,
    months: 2,
    days: 0,
    durationStrEn: '0Y 2M 0D',
    durationStrHi: '0 वर्ष 2 माह 0 दिन',
    isSpecialCrisisAlert: false,
    predictionEn: 'In',
    predictionHi: 'पिंगला में धान्या अंतरदशा: मिश्रित फल, कर्मठता से अनुकूल परिणाम और परिस्थितियों में धीमा सुधार। शास्त्रीय संकेत: In'
  },
  'Pingala-Bhramari': {
    key: 'Pingala-Bhramari',
    mdName: 'Pingala',
    adName: 'Bhramari',
    mdLordEn: 'Sun',
    adLordEn: 'Mars',
    years: 0,
    months: 2,
    days: 20,
    durationStrEn: '0Y 2M 20D',
    durationStrHi: '0 वर्ष 2 माह 20 दिन',
    isSpecialCrisisAlert: false,
    predictionEn: '',
    predictionHi: 'पिंगला में भ्रामरी अंतरदशा: मिश्रित फल, कर्मठता से अनुकूल परिणाम और परिस्थितियों में धीमा सुधार। शास्त्रीय संकेत: '
  },
  'Pingala-Bhadrika': {
    key: 'Pingala-Bhadrika',
    mdName: 'Pingala',
    adName: 'Bhadrika',
    mdLordEn: 'Sun',
    adLordEn: 'Mercury',
    years: 0,
    months: 3,
    days: 10,
    durationStrEn: '0Y 3M 10D',
    durationStrHi: '0 वर्ष 3 माह 10 दिन',
    isSpecialCrisisAlert: false,
    predictionEn: 'In the',
    predictionHi: 'पिंगला में भद्रिका अंतरदशा: मिश्रित फल, कर्मठता से अनुकूल परिणाम और परिस्थितियों में धीमा सुधार। शास्त्रीय संकेत: In the'
  },
  'Pingala-Ulka': {
    key: 'Pingala-Ulka',
    mdName: 'Pingala',
    adName: 'Ulka',
    mdLordEn: 'Sun',
    adLordEn: 'Saturn',
    years: 0,
    months: 4,
    days: 0,
    durationStrEn: '0Y 4M 0D',
    durationStrHi: '0 वर्ष 4 माह 0 दिन',
    isSpecialCrisisAlert: false,
    predictionEn: 'Ulka causes a person dispute with t1is relatives if it falls in Pingala.',
    predictionHi: 'पिंगला में उल्का अंतरदशा: मिश्रित फल, कर्मठता से अनुकूल परिणाम और परिस्थितियों में धीमा सुधार। शास्त्रीय संकेत: Ulka causes a person dispute with t1is relatives if it falls in Pingala.'
  },
  'Pingala-Siddha': {
    key: 'Pingala-Siddha',
    mdName: 'Pingala',
    adName: 'Siddha',
    mdLordEn: 'Sun',
    adLordEn: 'Venus',
    years: 0,
    months: 4,
    days: 20,
    durationStrEn: '0Y 4M 20D',
    durationStrHi: '0 वर्ष 4 माह 20 दिन',
    isSpecialCrisisAlert: false,
    predictionEn: 'In the',
    predictionHi: 'पिंगला में सिद्धा अंतरदशा: मिश्रित फल, कर्मठता से अनुकूल परिणाम और परिस्थितियों में धीमा सुधार। शास्त्रीय संकेत: In the'
  },
  'Pingala-Sankata': {
    key: 'Pingala-Sankata',
    mdName: 'Pingala',
    adName: 'Sankata',
    mdLordEn: 'Sun',
    adLordEn: 'Rahu',
    years: 0,
    months: 5,
    days: 10,
    durationStrEn: '0Y 5M 10D',
    durationStrHi: '0 वर्ष 5 माह 10 दिन',
    isSpecialCrisisAlert: false,
    predictionEn: '',
    predictionHi: 'पिंगला में संकटा अंतरदशा: मिश्रित फल, कर्मठता से अनुकूल परिणाम और परिस्थितियों में धीमा सुधार। शास्त्रीय संकेत: '
  },
  'Dhanya-Mangala': {
    key: 'Dhanya-Mangala',
    mdName: 'Dhanya',
    adName: 'Mangala',
    mdLordEn: 'Jupiter',
    adLordEn: 'Moon',
    years: 0,
    months: 1,
    days: 0,
    durationStrEn: '0Y 1M 0D',
    durationStrHi: '0 वर्ष 1 माह 0 दिन',
    isSpecialCrisisAlert: false,
    predictionEn: 'A person gets plenty of wealth, gold and silver. And he enjoys pleasure of sons and wife in the Sub period of Mangala in the Period of Dhanya. He enjoys a very prosperous life.',
    predictionHi: 'धान्या में मंगला अंतरदशा: धन लाभ, ऐश्वर्य, पद-प्रतिष्ठा में वृद्धि, पारिवारिक सुख और कार्यों की निर्विघ्न सिद्धि। शास्त्रीय संकेत: A person gets plenty of wealth, gold and silver. And he enjoys pleasure of sons and wife in the Sub period of Mangala in the Period of Dhanya. He enjoys a very prosperous life.'
  },
  'Dhanya-Pingala': {
    key: 'Dhanya-Pingala',
    mdName: 'Dhanya',
    adName: 'Pingala',
    mdLordEn: 'Jupiter',
    adLordEn: 'Sun',
    years: 0,
    months: 2,
    days: 0,
    durationStrEn: '0Y 2M 0D',
    durationStrHi: '0 वर्ष 2 माह 0 दिन',
    isSpecialCrisisAlert: false,
    predictionEn: '',
    predictionHi: 'धान्या में पिंगला अंतरदशा: मिश्रित फल, कर्मठता से अनुकूल परिणाम और परिस्थितियों में धीमा सुधार। शास्त्रीय संकेत: '
  },
  'Dhanya-Dhanya': {
    key: 'Dhanya-Dhanya',
    mdName: 'Dhanya',
    adName: 'Dhanya',
    mdLordEn: 'Jupiter',
    adLordEn: 'Jupiter',
    years: 0,
    months: 3,
    days: 0,
    durationStrEn: '0Y 3M 0D',
    durationStrHi: '0 वर्ष 3 माह 0 दिन',
    isSpecialCrisisAlert: false,
    predictionEn: 'In the Sub period of Dhanya in its Period, person enjoys bliss of land, wealth and prosperity. He gets wealth from the king or ruler and pleasure of sons and wife.',
    predictionHi: 'धान्या में धान्या अंतरदशा: धन लाभ, ऐश्वर्य, पद-प्रतिष्ठा में वृद्धि, पारिवारिक सुख और कार्यों की निर्विघ्न सिद्धि। शास्त्रीय संकेत: In the Sub period of Dhanya in its Period, person enjoys bliss of land, wealth and prosperity. He gets wealth from the king or ruler and pleasure of sons and wife.'
  },
  'Dhanya-Bhramari': {
    key: 'Dhanya-Bhramari',
    mdName: 'Dhanya',
    adName: 'Bhramari',
    mdLordEn: 'Jupiter',
    adLordEn: 'Mars',
    years: 0,
    months: 4,
    days: 0,
    durationStrEn: '0Y 4M 0D',
    durationStrHi: '0 वर्ष 4 माह 0 दिन',
    isSpecialCrisisAlert: false,
    predictionEn: 'The',
    predictionHi: 'धान्या में भ्रामरी अंतरदशा: मिश्रित फल, कर्मठता से अनुकूल परिणाम और परिस्थितियों में धीमा सुधार। शास्त्रीय संकेत: The'
  },
  'Dhanya-Bhadrika': {
    key: 'Dhanya-Bhadrika',
    mdName: 'Dhanya',
    adName: 'Bhadrika',
    mdLordEn: 'Jupiter',
    adLordEn: 'Mercury',
    years: 0,
    months: 5,
    days: 0,
    durationStrEn: '0Y 5M 0D',
    durationStrHi: '0 वर्ष 5 माह 0 दिन',
    isSpecialCrisisAlert: false,
    predictionEn: 'A person enjoys bliss of house and friends in the',
    predictionHi: 'धान्या में भद्रिका अंतरदशा: धन लाभ, ऐश्वर्य, पद-प्रतिष्ठा में वृद्धि, पारिवारिक सुख और कार्यों की निर्विघ्न सिद्धि। शास्त्रीय संकेत: A person enjoys bliss of house and friends in the'
  },
  'Dhanya-Ulka': {
    key: 'Dhanya-Ulka',
    mdName: 'Dhanya',
    adName: 'Ulka',
    mdLordEn: 'Jupiter',
    adLordEn: 'Saturn',
    years: 0,
    months: 6,
    days: 0,
    durationStrEn: '0Y 6M 0D',
    durationStrHi: '0 वर्ष 6 माह 0 दिन',
    isSpecialCrisisAlert: false,
    predictionEn: 'Sub period in',
    predictionHi: 'धान्या में उल्का अंतरदशा: मिश्रित फल, कर्मठता से अनुकूल परिणाम और परिस्थितियों में धीमा सुधार। शास्त्रीय संकेत: Sub period in'
  },
  'Dhanya-Siddha': {
    key: 'Dhanya-Siddha',
    mdName: 'Dhanya',
    adName: 'Siddha',
    mdLordEn: 'Jupiter',
    adLordEn: 'Venus',
    years: 0,
    months: 7,
    days: 0,
    durationStrEn: '0Y 7M 0D',
    durationStrHi: '0 वर्ष 7 माह 0 दिन',
    isSpecialCrisisAlert: false,
    predictionEn: 'A person enjoys bliss of sons and association offriends. He leads a life full of luxuries and comforts.',
    predictionHi: 'धान्या में सिद्धा अंतरदशा: धन लाभ, ऐश्वर्य, पद-प्रतिष्ठा में वृद्धि, पारिवारिक सुख और कार्यों की निर्विघ्न सिद्धि। शास्त्रीय संकेत: A person enjoys bliss of sons and association offriends. He leads a life full of luxuries and comforts.'
  },
  'Dhanya-Sankata': {
    key: 'Dhanya-Sankata',
    mdName: 'Dhanya',
    adName: 'Sankata',
    mdLordEn: 'Jupiter',
    adLordEn: 'Rahu',
    years: 0,
    months: 8,
    days: 0,
    durationStrEn: '0Y 8M 0D',
    durationStrHi: '0 वर्ष 8 माह 0 दिन',
    isSpecialCrisisAlert: false,
    predictionEn: 'In the',
    predictionHi: 'धान्या में संकटा अंतरदशा: मिश्रित फल, कर्मठता से अनुकूल परिणाम और परिस्थितियों में धीमा सुधार। शास्त्रीय संकेत: In the'
  },
  'Bhramari-Mangala': {
    key: 'Bhramari-Mangala',
    mdName: 'Bhramari',
    adName: 'Mangala',
    mdLordEn: 'Mars',
    adLordEn: 'Moon',
    years: 0,
    months: 1,
    days: 10,
    durationStrEn: '0Y 1M 10D',
    durationStrHi: '0 वर्ष 1 माह 10 दिन',
    isSpecialCrisisAlert: false,
    predictionEn: 'A person leads a life full of luxury and comfort in the',
    predictionHi: 'भ्रामरी में मंगला अंतरदशा: धन लाभ, ऐश्वर्य, पद-प्रतिष्ठा में वृद्धि, पारिवारिक सुख और कार्यों की निर्विघ्न सिद्धि। शास्त्रीय संकेत: A person leads a life full of luxury and comfort in the'
  },
  'Bhramari-Pingala': {
    key: 'Bhramari-Pingala',
    mdName: 'Bhramari',
    adName: 'Pingala',
    mdLordEn: 'Mars',
    adLordEn: 'Sun',
    years: 0,
    months: 2,
    days: 20,
    durationStrEn: '0Y 2M 20D',
    durationStrHi: '0 वर्ष 2 माह 20 दिन',
    isSpecialCrisisAlert: false,
    predictionEn: '. He suffers from fear of the king or ruler, a horse, a buffalo, a tiger and wounds.',
    predictionHi: 'भ्रामरी में पिंगला अंतरदशा: मिश्रित फल, कर्मठता से अनुकूल परिणाम और परिस्थितियों में धीमा सुधार। शास्त्रीय संकेत: . He suffers from fear of the king or ruler, a horse, a buffalo, a tiger and wounds.'
  },
  'Bhramari-Dhanya': {
    key: 'Bhramari-Dhanya',
    mdName: 'Bhramari',
    adName: 'Dhanya',
    mdLordEn: 'Mars',
    adLordEn: 'Jupiter',
    years: 0,
    months: 4,
    days: 0,
    durationStrEn: '0Y 4M 0D',
    durationStrHi: '0 वर्ष 4 माह 0 दिन',
    isSpecialCrisisAlert: false,
    predictionEn: 'In the',
    predictionHi: 'भ्रामरी में धान्या अंतरदशा: मिश्रित फल, कर्मठता से अनुकूल परिणाम और परिस्थितियों में धीमा सुधार। शास्त्रीय संकेत: In the'
  },
  'Bhramari-Bhramari': {
    key: 'Bhramari-Bhramari',
    mdName: 'Bhramari',
    adName: 'Bhramari',
    mdLordEn: 'Mars',
    adLordEn: 'Mars',
    years: 0,
    months: 5,
    days: 10,
    durationStrEn: '0Y 5M 10D',
    durationStrHi: '0 वर्ष 5 माह 10 दिन',
    isSpecialCrisisAlert: false,
    predictionEn: 'A person suffers from distress caused by poison, the people in the society he lives in, his own dear and near ones, his enemies and the people of evil character.',
    predictionHi: 'भ्रामरी में भ्रामरी अंतरदशा: संकट, मानसिक व्यथा, परिजनों से मतभेद और स्वास्थ्य के प्रति विशेष सतर्कता का समय। शास्त्रीय संकेत: A person suffers from distress caused by poison, the people in the society he lives in, his own dear and near ones, his enemies and the people of evil character.'
  },
  'Bhramari-Bhadrika': {
    key: 'Bhramari-Bhadrika',
    mdName: 'Bhramari',
    adName: 'Bhadrika',
    mdLordEn: 'Mars',
    adLordEn: 'Mercury',
    years: 0,
    months: 6,
    days: 20,
    durationStrEn: '0Y 6M 20D',
    durationStrHi: '0 वर्ष 6 माह 20 दिन',
    isSpecialCrisisAlert: false,
    predictionEn: '',
    predictionHi: 'भ्रामरी में भद्रिका अंतरदशा: मिश्रित फल, कर्मठता से अनुकूल परिणाम और परिस्थितियों में धीमा सुधार। शास्त्रीय संकेत: '
  },
  'Bhramari-Ulka': {
    key: 'Bhramari-Ulka',
    mdName: 'Bhramari',
    adName: 'Ulka',
    mdLordEn: 'Mars',
    adLordEn: 'Saturn',
    years: 0,
    months: 8,
    days: 0,
    durationStrEn: '0Y 8M 0D',
    durationStrHi: '0 वर्ष 8 माह 0 दिन',
    isSpecialCrisisAlert: false,
    predictionEn: '',
    predictionHi: 'भ्रामरी में उल्का अंतरदशा: मिश्रित फल, कर्मठता से अनुकूल परिणाम और परिस्थितियों में धीमा सुधार। शास्त्रीय संकेत: '
  },
  'Bhramari-Siddha': {
    key: 'Bhramari-Siddha',
    mdName: 'Bhramari',
    adName: 'Siddha',
    mdLordEn: 'Mars',
    adLordEn: 'Venus',
    years: 0,
    months: 9,
    days: 10,
    durationStrEn: '0Y 9M 10D',
    durationStrHi: '0 वर्ष 9 माह 10 दिन',
    isSpecialCrisisAlert: false,
    predictionEn: 'In the',
    predictionHi: 'भ्रामरी में सिद्धा अंतरदशा: मिश्रित फल, कर्मठता से अनुकूल परिणाम और परिस्थितियों में धीमा सुधार। शास्त्रीय संकेत: In the'
  },
  'Bhramari-Sankata': {
    key: 'Bhramari-Sankata',
    mdName: 'Bhramari',
    adName: 'Sankata',
    mdLordEn: 'Mars',
    adLordEn: 'Rahu',
    years: 0,
    months: 10,
    days: 20,
    durationStrEn: '0Y 10M 20D',
    durationStrHi: '0 वर्ष 10 माह 20 दिन',
    isSpecialCrisisAlert: true,
    predictionEn: '',
    predictionHi: 'भ्रामरी में संकटा अंतरदशा: मिश्रित फल, कर्मठता से अनुकूल परिणाम और परिस्थितियों में धीमा सुधार। शास्त्रीय संकेत: '
  },
  'Bhadrika-Mangala': {
    key: 'Bhadrika-Mangala',
    mdName: 'Bhadrika',
    adName: 'Mangala',
    mdLordEn: 'Mercury',
    adLordEn: 'Moon',
    years: 0,
    months: 1,
    days: 20,
    durationStrEn: '0Y 1M 20D',
    durationStrHi: '0 वर्ष 1 माह 20 दिन',
    isSpecialCrisisAlert: false,
    predictionEn: '',
    predictionHi: 'भद्रिका में मंगला अंतरदशा: मिश्रित फल, कर्मठता से अनुकूल परिणाम और परिस्थितियों में धीमा सुधार। शास्त्रीय संकेत: '
  },
  'Bhadrika-Pingala': {
    key: 'Bhadrika-Pingala',
    mdName: 'Bhadrika',
    adName: 'Pingala',
    mdLordEn: 'Mercury',
    adLordEn: 'Sun',
    years: 0,
    months: 3,
    days: 10,
    durationStrEn: '0Y 3M 10D',
    durationStrHi: '0 वर्ष 3 माह 10 दिन',
    isSpecialCrisisAlert: false,
    predictionEn: '',
    predictionHi: 'भद्रिका में पिंगला अंतरदशा: मिश्रित फल, कर्मठता से अनुकूल परिणाम और परिस्थितियों में धीमा सुधार। शास्त्रीय संकेत: '
  },
  'Bhadrika-Dhanya': {
    key: 'Bhadrika-Dhanya',
    mdName: 'Bhadrika',
    adName: 'Dhanya',
    mdLordEn: 'Mercury',
    adLordEn: 'Jupiter',
    years: 0,
    months: 5,
    days: 0,
    durationStrEn: '0Y 5M 0D',
    durationStrHi: '0 वर्ष 5 माह 0 दिन',
    isSpecialCrisisAlert: false,
    predictionEn: 'A man gets pleasure from his sons, wife and friends during the',
    predictionHi: 'भद्रिका में धान्या अंतरदशा: मिश्रित फल, कर्मठता से अनुकूल परिणाम और परिस्थितियों में धीमा सुधार। शास्त्रीय संकेत: A man gets pleasure from his sons, wife and friends during the'
  },
  'Bhadrika-Bhramari': {
    key: 'Bhadrika-Bhramari',
    mdName: 'Bhadrika',
    adName: 'Bhramari',
    mdLordEn: 'Mercury',
    adLordEn: 'Mars',
    years: 0,
    months: 6,
    days: 20,
    durationStrEn: '0Y 6M 20D',
    durationStrHi: '0 वर्ष 6 माह 20 दिन',
    isSpecialCrisisAlert: false,
    predictionEn: 'Sub period of Bhramari causes disorder in blood if it falls in Bhadrika. The person remains afraid of fire and death. He may have loss in cultivation. He is deprived of house. His enemies get ruined and he gets pleasure from his relatives.',
    predictionHi: 'भद्रिका में भ्रामरी अंतरदशा: संकट, मानसिक व्यथा, परिजनों से मतभेद और स्वास्थ्य के प्रति विशेष सतर्कता का समय। शास्त्रीय संकेत: Sub period of Bhramari causes disorder in blood if it falls in Bhadrika. The person remains afraid of fire and death. He may have loss in cultivation. He is deprived of house. His enemies get ruined and he gets pleasure from his relatives.'
  },
  'Bhadrika-Bhadrika': {
    key: 'Bhadrika-Bhadrika',
    mdName: 'Bhadrika',
    adName: 'Bhadrika',
    mdLordEn: 'Mercury',
    adLordEn: 'Mercury',
    years: 0,
    months: 8,
    days: 10,
    durationStrEn: '0Y 8M 10D',
    durationStrHi: '0 वर्ष 8 माह 10 दिन',
    isSpecialCrisisAlert: false,
    predictionEn: 'A person gets name and fame in the',
    predictionHi: 'भद्रिका में भद्रिका अंतरदशा: मिश्रित फल, कर्मठता से अनुकूल परिणाम और परिस्थितियों में धीमा सुधार। शास्त्रीय संकेत: A person gets name and fame in the'
  },
  'Bhadrika-Ulka': {
    key: 'Bhadrika-Ulka',
    mdName: 'Bhadrika',
    adName: 'Ulka',
    mdLordEn: 'Mercury',
    adLordEn: 'Saturn',
    years: 0,
    months: 10,
    days: 0,
    durationStrEn: '0Y 10M 0D',
    durationStrHi: '0 वर्ष 10 माह 0 दिन',
    isSpecialCrisisAlert: false,
    predictionEn: '',
    predictionHi: 'भद्रिका में उल्का अंतरदशा: मिश्रित फल, कर्मठता से अनुकूल परिणाम और परिस्थितियों में धीमा सुधार। शास्त्रीय संकेत: '
  },
  'Bhadrika-Siddha': {
    key: 'Bhadrika-Siddha',
    mdName: 'Bhadrika',
    adName: 'Siddha',
    mdLordEn: 'Mercury',
    adLordEn: 'Venus',
    years: 0,
    months: 11,
    days: 20,
    durationStrEn: '0Y 11M 20D',
    durationStrHi: '0 वर्ष 11 माह 20 दिन',
    isSpecialCrisisAlert: false,
    predictionEn: 'A native becomes devoted to the Brahmins and deities. He enjoys bliss of sons, wife, friends and good health. Ceremonious activities are performed frequently in his family.',
    predictionHi: 'भद्रिका में सिद्धा अंतरदशा: धन लाभ, ऐश्वर्य, पद-प्रतिष्ठा में वृद्धि, पारिवारिक सुख और कार्यों की निर्विघ्न सिद्धि। शास्त्रीय संकेत: A native becomes devoted to the Brahmins and deities. He enjoys bliss of sons, wife, friends and good health. Ceremonious activities are performed frequently in his family.'
  },
  'Bhadrika-Sankata': {
    key: 'Bhadrika-Sankata',
    mdName: 'Bhadrika',
    adName: 'Sankata',
    mdLordEn: 'Mercury',
    adLordEn: 'Rahu',
    years: 1,
    months: 1,
    days: 10,
    durationStrEn: '1Y 1M 10D',
    durationStrHi: '1 वर्ष 1 माह 10 दिन',
    isSpecialCrisisAlert: false,
    predictionEn: '',
    predictionHi: 'भद्रिका में संकटा अंतरदशा: मिश्रित फल, कर्मठता से अनुकूल परिणाम और परिस्थितियों में धीमा सुधार। शास्त्रीय संकेत: '
  },
  'Ulka-Mangala': {
    key: 'Ulka-Mangala',
    mdName: 'Ulka',
    adName: 'Mangala',
    mdLordEn: 'Saturn',
    adLordEn: 'Moon',
    years: 0,
    months: 2,
    days: 0,
    durationStrEn: '0Y 2M 0D',
    durationStrHi: '0 वर्ष 2 माह 0 दिन',
    isSpecialCrisisAlert: false,
    predictionEn: 'In the',
    predictionHi: 'उल्का में मंगला अंतरदशा: मिश्रित फल, कर्मठता से अनुकूल परिणाम और परिस्थितियों में धीमा सुधार। शास्त्रीय संकेत: In the'
  },
  'Ulka-Pingala': {
    key: 'Ulka-Pingala',
    mdName: 'Ulka',
    adName: 'Pingala',
    mdLordEn: 'Saturn',
    adLordEn: 'Sun',
    years: 0,
    months: 4,
    days: 0,
    durationStrEn: '0Y 4M 0D',
    durationStrHi: '0 वर्ष 4 माह 0 दिन',
    isSpecialCrisisAlert: false,
    predictionEn: 'In this',
    predictionHi: 'उल्का में पिंगला अंतरदशा: मिश्रित फल, कर्मठता से अनुकूल परिणाम और परिस्थितियों में धीमा सुधार। शास्त्रीय संकेत: In this'
  },
  'Ulka-Dhanya': {
    key: 'Ulka-Dhanya',
    mdName: 'Ulka',
    adName: 'Dhanya',
    mdLordEn: 'Saturn',
    adLordEn: 'Jupiter',
    years: 0,
    months: 6,
    days: 0,
    durationStrEn: '0Y 6M 0D',
    durationStrHi: '0 वर्ष 6 माह 0 दिन',
    isSpecialCrisisAlert: false,
    predictionEn: '',
    predictionHi: 'उल्का में धान्या अंतरदशा: मिश्रित फल, कर्मठता से अनुकूल परिणाम और परिस्थितियों में धीमा सुधार। शास्त्रीय संकेत: '
  },
  'Ulka-Bhramari': {
    key: 'Ulka-Bhramari',
    mdName: 'Ulka',
    adName: 'Bhramari',
    mdLordEn: 'Saturn',
    adLordEn: 'Mars',
    years: 0,
    months: 8,
    days: 0,
    durationStrEn: '0Y 8M 0D',
    durationStrHi: '0 वर्ष 8 माह 0 दिन',
    isSpecialCrisisAlert: false,
    predictionEn: '',
    predictionHi: 'उल्का में भ्रामरी अंतरदशा: मिश्रित फल, कर्मठता से अनुकूल परिणाम और परिस्थितियों में धीमा सुधार। शास्त्रीय संकेत: '
  },
  'Ulka-Bhadrika': {
    key: 'Ulka-Bhadrika',
    mdName: 'Ulka',
    adName: 'Bhadrika',
    mdLordEn: 'Saturn',
    adLordEn: 'Mercury',
    years: 0,
    months: 10,
    days: 0,
    durationStrEn: '0Y 10M 0D',
    durationStrHi: '0 वर्ष 10 माह 0 दिन',
    isSpecialCrisisAlert: false,
    predictionEn: '',
    predictionHi: 'उल्का में भद्रिका अंतरदशा: मिश्रित फल, कर्मठता से अनुकूल परिणाम और परिस्थितियों में धीमा सुधार। शास्त्रीय संकेत: '
  },
  'Ulka-Ulka': {
    key: 'Ulka-Ulka',
    mdName: 'Ulka',
    adName: 'Ulka',
    mdLordEn: 'Saturn',
    adLordEn: 'Saturn',
    years: 1,
    months: 0,
    days: 0,
    durationStrEn: '1Y 0M 0D',
    durationStrHi: '1 वर्ष 0 माह 0 दिन',
    isSpecialCrisisAlert: false,
    predictionEn: 'Sub period of Siddha does not give its own auspicious result if it is in the Period of Ulka. It rather gives the inauspicious result of Ulka and makes the native go on overseas trips.',
    predictionHi: 'उल्का में उल्का अंतरदशा: स्थान परिवर्तन, दूरस्थ या विदेश यात्रा, कार्यक्षेत्र में भागदौड़ और नए संपर्कों का विस्तार। शास्त्रीय संकेत: Sub period of Siddha does not give its own auspicious result if it is in the Period of Ulka. It rather gives the inauspicious result of Ulka and makes the native go on overseas trips.'
  },
  'Ulka-Siddha': {
    key: 'Ulka-Siddha',
    mdName: 'Ulka',
    adName: 'Siddha',
    mdLordEn: 'Saturn',
    adLordEn: 'Venus',
    years: 1,
    months: 2,
    days: 0,
    durationStrEn: '1Y 2M 0D',
    durationStrHi: '1 वर्ष 2 माह 0 दिन',
    isSpecialCrisisAlert: false,
    predictionEn: 'Sub period of Siddha does not give its own auspicious result if it is in the Period of Ulka. It rather gives the inauspicious result of Ulka and makes the native go on overseas trips.',
    predictionHi: 'उल्का में सिद्धा अंतरदशा: स्थान परिवर्तन, दूरस्थ या विदेश यात्रा, कार्यक्षेत्र में भागदौड़ और नए संपर्कों का विस्तार। शास्त्रीय संकेत: Sub period of Siddha does not give its own auspicious result if it is in the Period of Ulka. It rather gives the inauspicious result of Ulka and makes the native go on overseas trips.'
  },
  'Ulka-Sankata': {
    key: 'Ulka-Sankata',
    mdName: 'Ulka',
    adName: 'Sankata',
    mdLordEn: 'Saturn',
    adLordEn: 'Rahu',
    years: 1,
    months: 4,
    days: 0,
    durationStrEn: '1Y 4M 0D',
    durationStrHi: '1 वर्ष 4 माह 0 दिन',
    isSpecialCrisisAlert: true,
    predictionEn: 'Fear of death prevails in the mind of a person in the Sub period of sankata in Ulka Period. He is deprived of bliss of wife, son, friends and servants.',
    predictionHi: 'उल्का में संकटा अंतरदशा: संकट, मानसिक व्यथा, परिजनों से मतभेद और स्वास्थ्य के प्रति विशेष सतर्कता का समय। शास्त्रीय संकेत: Fear of death prevails in the mind of a person in the Sub period of sankata in Ulka Period. He is deprived of bliss of wife, son, friends and servants.'
  },
  'Siddha-Mangala': {
    key: 'Siddha-Mangala',
    mdName: 'Siddha',
    adName: 'Mangala',
    mdLordEn: 'Venus',
    adLordEn: 'Moon',
    years: 0,
    months: 2,
    days: 10,
    durationStrEn: '0Y 2M 10D',
    durationStrHi: '0 वर्ष 2 माह 10 दिन',
    isSpecialCrisisAlert: false,
    predictionEn: 'A man leads a life full of luxury and comfort. He gets pleasure from his dear and near ones and wealth from the king or ruler. He achieves his desired goal and all his jobs are accomplished.',
    predictionHi: 'सिद्धा में मंगला अंतरदशा: धन लाभ, ऐश्वर्य, पद-प्रतिष्ठा में वृद्धि, पारिवारिक सुख और कार्यों की निर्विघ्न सिद्धि। शास्त्रीय संकेत: A man leads a life full of luxury and comfort. He gets pleasure from his dear and near ones and wealth from the king or ruler. He achieves his desired goal and all his jobs are accomplished.'
  },
  'Siddha-Pingala': {
    key: 'Siddha-Pingala',
    mdName: 'Siddha',
    adName: 'Pingala',
    mdLordEn: 'Venus',
    adLordEn: 'Sun',
    years: 0,
    months: 4,
    days: 20,
    durationStrEn: '0Y 4M 20D',
    durationStrHi: '0 वर्ष 4 माह 20 दिन',
    isSpecialCrisisAlert: false,
    predictionEn: '',
    predictionHi: 'सिद्धा में पिंगला अंतरदशा: मिश्रित फल, कर्मठता से अनुकूल परिणाम और परिस्थितियों में धीमा सुधार। शास्त्रीय संकेत: '
  },
  'Siddha-Dhanya': {
    key: 'Siddha-Dhanya',
    mdName: 'Siddha',
    adName: 'Dhanya',
    mdLordEn: 'Venus',
    adLordEn: 'Jupiter',
    years: 0,
    months: 7,
    days: 0,
    durationStrEn: '0Y 7M 0D',
    durationStrHi: '0 वर्ष 7 माह 0 दिन',
    isSpecialCrisisAlert: false,
    predictionEn: 'A person gets the result of his Poorvakarm in the',
    predictionHi: 'सिद्धा में धान्या अंतरदशा: मिश्रित फल, कर्मठता से अनुकूल परिणाम और परिस्थितियों में धीमा सुधार। शास्त्रीय संकेत: A person gets the result of his Poorvakarm in the'
  },
  'Siddha-Bhramari': {
    key: 'Siddha-Bhramari',
    mdName: 'Siddha',
    adName: 'Bhramari',
    mdLordEn: 'Venus',
    adLordEn: 'Mars',
    years: 0,
    months: 9,
    days: 10,
    durationStrEn: '0Y 9M 10D',
    durationStrHi: '0 वर्ष 9 माह 10 दिन',
    isSpecialCrisisAlert: false,
    predictionEn: 'In the',
    predictionHi: 'सिद्धा में भ्रामरी अंतरदशा: मिश्रित फल, कर्मठता से अनुकूल परिणाम और परिस्थितियों में धीमा सुधार। शास्त्रीय संकेत: In the'
  },
  'Siddha-Bhadrika': {
    key: 'Siddha-Bhadrika',
    mdName: 'Siddha',
    adName: 'Bhadrika',
    mdLordEn: 'Venus',
    adLordEn: 'Mercury',
    years: 0,
    months: 11,
    days: 20,
    durationStrEn: '0Y 11M 20D',
    durationStrHi: '0 वर्ष 11 माह 20 दिन',
    isSpecialCrisisAlert: false,
    predictionEn: 'A native leads a life full of luxuries in the',
    predictionHi: 'सिद्धा में भद्रिका अंतरदशा: मिश्रित फल, कर्मठता से अनुकूल परिणाम और परिस्थितियों में धीमा सुधार। शास्त्रीय संकेत: A native leads a life full of luxuries in the'
  },
  'Siddha-Ulka': {
    key: 'Siddha-Ulka',
    mdName: 'Siddha',
    adName: 'Ulka',
    mdLordEn: 'Venus',
    adLordEn: 'Saturn',
    years: 1,
    months: 2,
    days: 0,
    durationStrEn: '1Y 2M 0D',
    durationStrHi: '1 वर्ष 2 माह 0 दिन',
    isSpecialCrisisAlert: false,
    predictionEn: '',
    predictionHi: 'सिद्धा में उल्का अंतरदशा: मिश्रित फल, कर्मठता से अनुकूल परिणाम और परिस्थितियों में धीमा सुधार। शास्त्रीय संकेत: '
  },
  'Siddha-Siddha': {
    key: 'Siddha-Siddha',
    mdName: 'Siddha',
    adName: 'Siddha',
    mdLordEn: 'Venus',
    adLordEn: 'Venus',
    years: 1,
    months: 4,
    days: 10,
    durationStrEn: '1Y 4M 10D',
    durationStrHi: '1 वर्ष 4 माह 10 दिन',
    isSpecialCrisisAlert: false,
    predictionEn: 'A native achieves his desired goal in the Sub period of Siddha in its own Dahsa. All his jobs are accomplished in it. He has pleasure from his relatives, sons etc. His wealth gets increase.',
    predictionHi: 'सिद्धा में सिद्धा अंतरदशा: धन लाभ, ऐश्वर्य, पद-प्रतिष्ठा में वृद्धि, पारिवारिक सुख और कार्यों की निर्विघ्न सिद्धि। शास्त्रीय संकेत: A native achieves his desired goal in the Sub period of Siddha in its own Dahsa. All his jobs are accomplished in it. He has pleasure from his relatives, sons etc. His wealth gets increase.'
  },
  'Siddha-Sankata': {
    key: 'Siddha-Sankata',
    mdName: 'Siddha',
    adName: 'Sankata',
    mdLordEn: 'Venus',
    adLordEn: 'Rahu',
    years: 1,
    months: 6,
    days: 20,
    durationStrEn: '1Y 6M 20D',
    durationStrHi: '1 वर्ष 6 माह 20 दिन',
    isSpecialCrisisAlert: false,
    predictionEn: 'In the',
    predictionHi: 'सिद्धा में संकटा अंतरदशा: मिश्रित फल, कर्मठता से अनुकूल परिणाम और परिस्थितियों में धीमा सुधार। शास्त्रीय संकेत: In the'
  },
  'Sankata-Mangala': {
    key: 'Sankata-Mangala',
    mdName: 'Sankata',
    adName: 'Mangala',
    mdLordEn: 'Rahu',
    adLordEn: 'Moon',
    years: 0,
    months: 2,
    days: 20,
    durationStrEn: '0Y 2M 20D',
    durationStrHi: '0 वर्ष 2 माह 20 दिन',
    isSpecialCrisisAlert: false,
    predictionEn: 'A native suffers from problem in head and from other diseases. His wife suffers due to addiction.',
    predictionHi: 'संकटा में मंगला अंतरदशा: शारीरिक व्याधि, ज्वर, उदर अथवा रक्त संबंधी संवेदनशीलता और स्वास्थ्य पर ध्यान देने की आवश्यकता। शास्त्रीय संकेत: A native suffers from problem in head and from other diseases. His wife suffers due to addiction.'
  },
  'Sankata-Pingala': {
    key: 'Sankata-Pingala',
    mdName: 'Sankata',
    adName: 'Pingala',
    mdLordEn: 'Rahu',
    adLordEn: 'Sun',
    years: 0,
    months: 5,
    days: 10,
    durationStrEn: '0Y 5M 10D',
    durationStrHi: '0 वर्ष 5 माह 10 दिन',
    isSpecialCrisisAlert: false,
    predictionEn: 'Sub period of Pingala causes a person sudden loss of wealth and he becomes bereaved of his son. He remains fearful of his enemies.',
    predictionHi: 'संकटा में पिंगला अंतरदशा: धन लाभ, ऐश्वर्य, पद-प्रतिष्ठा में वृद्धि, पारिवारिक सुख और कार्यों की निर्विघ्न सिद्धि। शास्त्रीय संकेत: Sub period of Pingala causes a person sudden loss of wealth and he becomes bereaved of his son. He remains fearful of his enemies.'
  },
  'Sankata-Dhanya': {
    key: 'Sankata-Dhanya',
    mdName: 'Sankata',
    adName: 'Dhanya',
    mdLordEn: 'Rahu',
    adLordEn: 'Jupiter',
    years: 0,
    months: 8,
    days: 0,
    durationStrEn: '0Y 8M 0D',
    durationStrHi: '0 वर्ष 8 माह 0 दिन',
    isSpecialCrisisAlert: false,
    predictionEn: 'A person suffers from disorder in stomach during the',
    predictionHi: 'संकटा में धान्या अंतरदशा: मिश्रित फल, कर्मठता से अनुकूल परिणाम और परिस्थितियों में धीमा सुधार। शास्त्रीय संकेत: A person suffers from disorder in stomach during the'
  },
  'Sankata-Bhramari': {
    key: 'Sankata-Bhramari',
    mdName: 'Sankata',
    adName: 'Bhramari',
    mdLordEn: 'Rahu',
    adLordEn: 'Mars',
    years: 0,
    months: 10,
    days: 20,
    durationStrEn: '0Y 10M 20D',
    durationStrHi: '0 वर्ष 10 माह 20 दिन',
    isSpecialCrisisAlert: false,
    predictionEn: 'A person may have to leave his village, city, state and even his country in the Sub period of',
    predictionHi: 'संकटा में भ्रामरी अंतरदशा: मिश्रित फल, कर्मठता से अनुकूल परिणाम और परिस्थितियों में धीमा सुधार। शास्त्रीय संकेत: A person may have to leave his village, city, state and even his country in the Sub period of'
  },
  'Sankata-Bhadrika': {
    key: 'Sankata-Bhadrika',
    mdName: 'Sankata',
    adName: 'Bhadrika',
    mdLordEn: 'Rahu',
    adLordEn: 'Mercury',
    years: 1,
    months: 1,
    days: 10,
    durationStrEn: '1Y 1M 10D',
    durationStrHi: '1 वर्ष 1 माह 10 दिन',
    isSpecialCrisisAlert: false,
    predictionEn: 'A native enjoys bliss of education, ornaments, clothes etc. in the',
    predictionHi: 'संकटा में भद्रिका अंतरदशा: धन लाभ, ऐश्वर्य, पद-प्रतिष्ठा में वृद्धि, पारिवारिक सुख और कार्यों की निर्विघ्न सिद्धि। शास्त्रीय संकेत: A native enjoys bliss of education, ornaments, clothes etc. in the'
  },
  'Sankata-Ulka': {
    key: 'Sankata-Ulka',
    mdName: 'Sankata',
    adName: 'Ulka',
    mdLordEn: 'Rahu',
    adLordEn: 'Saturn',
    years: 1,
    months: 4,
    days: 0,
    durationStrEn: '1Y 4M 0D',
    durationStrHi: '1 वर्ष 4 माह 0 दिन',
    isSpecialCrisisAlert: false,
    predictionEn: '',
    predictionHi: 'संकटा में उल्का अंतरदशा: मिश्रित फल, कर्मठता से अनुकूल परिणाम और परिस्थितियों में धीमा सुधार। शास्त्रीय संकेत: '
  },
  'Sankata-Siddha': {
    key: 'Sankata-Siddha',
    mdName: 'Sankata',
    adName: 'Siddha',
    mdLordEn: 'Rahu',
    adLordEn: 'Venus',
    years: 1,
    months: 6,
    days: 20,
    durationStrEn: '1Y 6M 20D',
    durationStrHi: '1 वर्ष 6 माह 20 दिन',
    isSpecialCrisisAlert: false,
    predictionEn: 'Sub period of Siddha in the Period of Sankata makes a person enthusiast. He gets pleasure from his sons and remains happy.',
    predictionHi: 'संकटा में सिद्धा अंतरदशा: मिश्रित फल, कर्मठता से अनुकूल परिणाम और परिस्थितियों में धीमा सुधार। शास्त्रीय संकेत: Sub period of Siddha in the Period of Sankata makes a person enthusiast. He gets pleasure from his sons and remains happy.'
  },
  'Sankata-Sankata': {
    key: 'Sankata-Sankata',
    mdName: 'Sankata',
    adName: 'Sankata',
    mdLordEn: 'Rahu',
    adLordEn: 'Rahu',
    years: 1,
    months: 9,
    days: 10,
    durationStrEn: '1Y 9M 10D',
    durationStrHi: '1 वर्ष 9 माह 10 दिन',
    isSpecialCrisisAlert: true,
    predictionEn: 'Death and punishment from the government or ruler are possible in the',
    predictionHi: 'संकटा में संकटा अंतरदशा: संकट, मानसिक व्यथा, परिजनों से मतभेद और स्वास्थ्य के प्रति विशेष सतर्कता का समय। शास्त्रीय संकेत: Death and punishment from the government or ruler are possible in the'
  },
};

export interface AifasDashaGoldenRule {
  ruleNumber: number;
  titleEn: string;
  titleHi: string;
  ruleEn: string;
  ruleHi: string;
  category: 'Dignity' | 'Aspect & Position' | 'Friendship & Order' | 'Jeeva vs Dhatva' | 'Special Principles';
}

export const AIFAS_DASHA_26_RULES: AifasDashaGoldenRule[] = [
  {
    ruleNumber: 1,
    titleEn: 'Exaltation, Own House & Digbala',
    titleHi: 'उच्च, स्वक्षेत्र एवं दिग्बल फल',
    ruleEn: 'A planet gives good results in its period-sub-period if situated in its own house, own Navamsha, friendly sign, exalted sign, or own Dreshkana, or when posited in Angle/Trine with strong Shadbala.',
    ruleHi: 'ग्रह यदि स्वराशि, स्व-नवांश, मित्र क्षेत्र, उच्च राशि अथवा स्व-द्रेष्काण में हो तथा केंद्र-त्रिकोण में स्थित होकर षड्बली हो, तो अपनी महादशा-अंतरदशा में अत्यंत शुभ व प्रभावशाली फल देता है।',
    category: 'Dignity'
  },
  {
    ruleNumber: 2,
    titleEn: 'Inimical Placement & Dusthana Houses',
    titleHi: 'शत्रु क्षेत्र व त्रिक भाव (६, ८, १२) स्थिति',
    ruleEn: 'A planet situated in an inimical house, inimical Navamsha, inimical Dreshkana, or posited in 6th, 8th, or 12th house gives unfavorable results in its period.',
    ruleHi: 'शत्रु राशि, शत्रु नवांश, शत्रु द्रेष्काण अथवा ६ठे, ८वें या १२वें भाव में स्थित ग्रह अपनी दशा-अंतरदशा में प्रतिकूल, संघर्षमय व कष्टप्रद फल प्रदान करता है।',
    category: 'Dignity'
  },
  {
    ruleNumber: 3,
    titleEn: 'Sub-period of Friendly Planets',
    titleHi: 'मित्र ग्रहों की अंतरदशा फल',
    ruleEn: 'The Dasha lord gives favorable results in the sub-period of its friendly planets if it is benefic and strong.',
    ruleHi: 'दशा स्वामी यदि शुभ और बली हो, तो अपने नैसर्गिक व तात्कालिक मित्र ग्रहों की अंतरदशा में श्रेष्ठ व अनुकूल फल प्रदान करता है।',
    category: 'Friendship & Order'
  },
  {
    ruleNumber: 4,
    titleEn: 'Debilitated and Weak Planets',
    titleHi: 'नीच व निर्बल ग्रह की दशा',
    ruleEn: 'Unfavorable results are bestowed in the Major period or Sub-period of a debilitated or weak planet.',
    ruleHi: 'नीच अथवा निर्बल ग्रह की महादशा या अंतरदशा में जातक को अपेक्षित सफलता नहीं मिलती तथा अवरोधों का सामना करना पड़ता है।',
    category: 'Dignity'
  },
  {
    ruleNumber: 5,
    titleEn: 'Natural Malefic in Inimical Sign',
    titleHi: 'क्रूर ग्रह की शत्रु राशि में स्थिति',
    ruleEn: 'A natural malefic planet gives inauspicious results if it is posited in an inimical sign.',
    ruleHi: 'नैसर्गिक क्रूर या पापी ग्रह यदि शत्रु राशि में स्थित हो, तो अपनी दशा में अत्यधिक अशुभ, कलहकारी व पीड़ादायक परिणाम देता है।',
    category: 'Dignity'
  },
  {
    ruleNumber: 6,
    titleEn: 'Natural Benefic in Inimical Sign',
    titleHi: 'शुभ ग्रह की शत्रु राशि में स्थिति',
    ruleEn: 'A natural benefic planet gives diminished or less auspicious results if it is posited in an inimical sign.',
    ruleHi: 'नैसर्गिक शुभ ग्रह यदि शत्रु राशि में हो, तो उसकी शुभता क्षीण हो जाती है और वह अल्प फल ही दे पाता है।',
    category: 'Dignity'
  },
  {
    ruleNumber: 7,
    titleEn: 'Ashtakavarga Bindu Influence',
    titleHi: 'अष्टकवर्ग बिंदु प्रभाव',
    ruleEn: 'The result of a house gets ruined if the planet situated in that house has bindus less than the benefic threshold in its Ashtakavarga.',
    ruleHi: 'जिस भाव में ग्रह स्थित हो, यदि अष्टकवर्ग में वहां शुभ बिंदुओं की संख्या औसत (२८) से कम हो, तो उस भाव के फल क्षीण हो जाते हैं।',
    category: 'Special Principles'
  },
  {
    ruleNumber: 8,
    titleEn: 'Mutual Angle (1/4/7/10), Trine (5/9) vs Shadashtaka (6/8)',
    titleHi: 'परस्पर केंद्र-त्रिकोण बनाम षडाष्टक व द्विर्द्वादश',
    ruleEn: 'Sub-dasha lord renders unfavorable results if posited in 6th, 8th, or 12th house from Major Dasha lord. It gives favorable results if situated in Angle (1, 4, 10), Trine (5, 9), 2nd, or 11th from Major lord; 7th from Major lord brings marital/dispute friction.',
    ruleHi: 'अंतरदशा स्वामी यदि महादशा स्वामी से ६ठे, ८वें या १२वें भाव (षडाष्टक व द्विर्द्वादश) में हो तो अनिष्ट फल देता है। केंद्र, त्रिकोण, द्वितीय या एकादश में हो तो अत्यंत शुभ फल देता है; सप्तम में होने पर कलह या मारक प्रभाव बनता है।',
    category: 'Aspect & Position'
  },
  {
    ruleNumber: 9,
    titleEn: 'Natural Enmity between MD and AD Lords',
    titleHi: 'महादशा व अंतरदशा नाथ का परस्पर नैसर्गिक वैर',
    ruleEn: 'The natural friendship/enmity between Dasha lord and Sub-period lord governs outcomes. For example, Saturn in Sun MD or Sun in Saturn MD gives unfavorable results because both are bitter enemies.',
    ruleHi: 'दशा स्वामी और अंतरदशा स्वामी की नैसर्गिक मित्रता व शत्रुता का गहरा प्रभाव पड़ता है; जैसे सूर्य में शनि अथवा शनि में सूर्य की दशा में दोनों का नैसर्गिक वैर होने से प्रतिकूल फल मिलते हैं।',
    category: 'Friendship & Order'
  },
  {
    ruleNumber: 10,
    titleEn: 'Order of Sub-dasha Lord (3rd, 5th, 7th Order Rules)',
    titleHi: 'अंतरदशा क्रम का नियम (तृतीय, पंचम व सप्तम क्रम)',
    ruleEn: 'The serial order of sub-dasha lord from major dasha lord matters: an order of 3rd, 5th, or 7th gives unfavorable results. For example, Venus in Jupiter MD is 5th and Saturn in Rahu MD is 3rd, producing Viruddhadharmi adversity.',
    ruleHi: 'महादशा स्वामी से अंतरदशा स्वामी का क्रम ३, ५ या ७वां होने पर प्रतिकूल फल मिलता है (जैसे गुरु में शुक्र ५वां होने से तथा राहु में शनि ३रा होने से \'विरुद्धधर्मी\' फल देते हैं)।',
    category: 'Friendship & Order'
  },
  {
    ruleNumber: 11,
    titleEn: 'Separative Influence of Sun, Saturn, Rahu & 12th Lord',
    titleHi: 'अलगाववादी प्रभाव (सूर्य, शनि, राहु व १२वें भाव के स्वामी)',
    ruleEn: 'Sun, Saturn, Rahu, and the lord of the 12th house possess strong separative influence (Karakatva-Viyoga). They separate the native from the relations and things of whichever house they influence.',
    ruleHi: 'सूर्य, शनि, राहु तथा द्वादशेश में अलगाव कराने की स्वाभाविक शक्ति होती है। वे जिस भाव या ग्रह पर प्रभाव डालते हैं, जातक को उसके कारकों से विलग कर देते हैं।',
    category: 'Special Principles'
  },
  {
    ruleNumber: 12,
    titleEn: '10th House Dominance Influence',
    titleHi: 'दशम भाव स्थित ग्रह का सर्वोच्च प्रभाव',
    ruleEn: 'A sign, house, or planet always receives the dominating and decisive influence of whichever planet is posited in the 10th house from it.',
    ruleHi: 'किसी भी राशि, भाव अथवा ग्रह पर उससे १०वें भाव में स्थित ग्रह का सबसे गहरा व निर्णायक प्रभाव पड़ता है।',
    category: 'Aspect & Position'
  },
  {
    ruleNumber: 13,
    titleEn: 'Tatwa (Element) Modifiers of Houses',
    titleHi: 'भावों के पंचमहाभूत तत्त्व का प्रभाव',
    ruleEn: 'Houses 1, 5, 9 represent Fire (Agni); 2, 7, 11 represent Air (Vayu); 3, 6, 10 represent Earth (Prithvi); 4, 8, 12 represent Water (Jala). A planet modifies its output according to the element of the house it occupies.',
    ruleHi: '१, ५, ९ भाव अग्नि तत्त्व; २, ७, ११ वायु तत्त्व; ३, ६, १० पृथ्वी तत्त्व; और ४, ८, १२ जल तत्त्व का प्रतिनिधित्व करते हैं। ग्रह जिस तत्त्व के भाव में बैठता है, तदनुसार फल देता है।',
    category: 'Special Principles'
  },
  {
    ruleNumber: 14,
    titleEn: 'Dispositor Conduit Rule',
    titleHi: 'भावाधिपति का ग्रह-संवाहक नियम',
    ruleEn: 'The lord of a sign imparts results related to the planet situated in that sign.',
    ruleHi: 'किसी राशि का स्वामी उस राशि में बैठे ग्रह के गुणों व परिणामों को अपनी दशा में प्रकट करता है।',
    category: 'Special Principles'
  },
  {
    ruleNumber: 15,
    titleEn: 'Affliction of Benefic House Lords',
    titleHi: 'शुभ भावेश का पाप-प्रभाव',
    ruleEn: 'A planet, even when lord of a benefic house, cannot bestow good results cleanly if it is conjoined with or aspected by malefic planets.',
    ruleHi: 'शुभ भावों का स्वामी भी यदि पापी या क्रूर ग्रहों से युत अथवा दृष्ट हो जाए, तो वह अपनी दशा में पूर्ण शुभ फल नहीं दे पाता।',
    category: 'Aspect & Position'
  },
  {
    ruleNumber: 16,
    titleEn: 'Jeeva (Native) vs Dhatva/Dravya (Material) Duality',
    titleHi: 'जीव (जातक) बनाम द्रव्य/धातु (भौतिक संपदा) का द्वंद्व',
    ruleEn: 'Every house has two sides: Native (Jeeva) and Material/Metal (Dravya). A strong malefic yields abundant materials (wealth, vehicle, property, lands) but afflicts the native with bodily disease, travel, and mental anxiety. Conversely, a weak malefic harms wealth/materials, but keeps the native psychologically peaceful.',
    ruleHi: 'प्रत्येक भाव के दो पक्ष होते हैं - १. जीव (जातक) और २. द्रव्य/धातु। बली पापी ग्रह भौतिक संपदा (धन, वाहन, भूमि, वस्त्र) तो प्रचुर देता है किंतु जातक को शारीरिक रोग, मानसिक संताप व कष्ट देता है। निर्बल पापी भौतिक हानि करता है किंतु जातक मानसिक रूप से सुखी रहता है।',
    category: 'Jeeva vs Dhatva'
  },
  {
    ruleNumber: 17,
    titleEn: 'Inimical Dusthana Sub-period setbacks',
    titleHi: 'शत्रु क्षेत्री व त्रिक स्थित अंतरदशा',
    ruleEn: 'A Sub-period lord gives unfavorable results if it is an enemy of the Major lord or Lagnesha, situated in a Dusthana (6, 8, 12), and afflicted by malefics (e.g. Mercury in Mars MD or Saturn in Sun MD).',
    ruleHi: 'अंतरदशा स्वामी यदि महादशा स्वामी या लग्नेश का शत्रु होकर त्रिक भाव में स्थित हो तथा क्रूर ग्रहों से पीड़ित हो, तो भारी पराजय, अपमान व संघर्ष देता है।',
    category: 'Aspect & Position'
  },
  {
    ruleNumber: 18,
    titleEn: 'Common Significations Rule',
    titleHi: 'समान कारकत्व फलीभूत नियम',
    ruleEn: 'The Major Period lord and Sub-period lord manifest that specific result which is common between the two.',
    ruleHi: 'महादशा स्वामी और अंतरदशा स्वामी मिलकर वही परिणाम सबसे प्रबलता से घटित करते हैं, जो दोनों में परस्पर समान (Common) हो।',
    category: 'Special Principles'
  },
  {
    ruleNumber: 19,
    titleEn: 'Immunity of Strong Lagnesha',
    titleHi: 'बली लग्नेश का सुरक्षा कवच',
    ruleEn: 'If Lagnesha is strong and Saturn or the lords of 6th, 8th, and 12th houses are debilitated or combust, no unfavorable results occur during the Major period of Lagnesha.',
    ruleHi: 'यदि लग्नेश अत्यंत बली हो और शनि अथवा ६, ८, १२ भावों के स्वामी नीच या अस्त हों, तो लग्नेश की महादशा में कोई भी गंभीर संकट या अनिष्ट नहीं होता।',
    category: 'Dignity'
  },
  {
    ruleNumber: 20,
    titleEn: 'Natural Benefic as Fatal Maraka',
    titleHi: 'नैसर्गिक शुभ ग्रह का मारक स्वरूप',
    ruleEn: 'If the Major Dasha lord is a natural benefic (Jupiter, Venus) and also the lord of a fatal (Maraka) house, severe health crisis or death is possible in the Sub-period of the 8th house lord.',
    ruleHi: 'यदि महादशा स्वामी नैसर्गिक शुभ ग्रह (गुरु, शुक्र) होकर मारक भाव का स्वामी भी हो, तो अष्टमेश की अंतरदशा में प्राणघातक या गंभीर संकट संभव होता है।',
    category: 'Special Principles'
  },
  {
    ruleNumber: 21,
    titleEn: '8th Lord Non-Lethal Immunity',
    titleHi: 'अष्टमेश का अमार्कत्व नियम',
    ruleEn: 'The lord of the 8th house does not cause death directly, even if it is technically a fatal planet.',
    ruleHi: 'अष्टम भाव का स्वामी स्वयं प्रत्यक्ष रूप से मृत्यु का कारण नहीं बनता, चाहे वह कितना भी क्रूर क्यों न हो।',
    category: 'Special Principles'
  },
  {
    ruleNumber: 22,
    titleEn: 'Chameleon Nature of Rahu and Ketu',
    titleHi: 'राहु-केतु का छाया-प्रतिबिंब स्वरूप',
    ruleEn: 'Rahu and Ketu do not possess their own physical signs; they give results according to the planet they are conjoined with, aspected by, their sign dispositor (Rasheesha), and their Navamsha lord.',
    ruleHi: 'राहु और केतु की अपनी कोई भौतिक राशि नहीं होती; वे जिस ग्रह के साथ बैठते हैं, जिससे दृष्ट होते हैं, तथा जिसके राशि-स्वामी व नवांश-स्वामी के प्रभाव में होते हैं, वैसा ही परिणाम देते हैं।',
    category: 'Special Principles'
  },
  {
    ruleNumber: 23,
    titleEn: 'Strength-Proportionate Beneficence',
    titleHi: 'षड्बल अनुसार शुभता का प्रकटीकरण',
    ruleEn: 'A benefic planet bestows results strictly according to its Shadbala strength. A natural malefic, if weak, cannot cause severe harm to the native (though it will also not grant material wealth).',
    ruleHi: 'शुभ ग्रह अपने षड्बल के अनुपात में ही फल देता है। निर्बल पापी ग्रह जातक का कोई बड़ा अनिष्ट नहीं कर पाता (यद्यपि वह धन भी नहीं दे पाता)।',
    category: 'Dignity'
  },
  {
    ruleNumber: 24,
    titleEn: 'Debilitated and Combust Vulnerability',
    titleHi: 'नीच व अस्त ग्रह की दशा में क्षति',
    ruleEn: 'A planet bestows its most unfavorable results when it is simultaneously debilitated, combust, or heavily afflicted in divisional charts.',
    ruleHi: 'ग्रह यदि नीच, सूर्य से अस्त अथवा वर्ग कुंडलियों में पीड़ित हो, तो अपनी दशा-अंतरदशा में जातक को गहरी क्षति व विफलता देता है।',
    category: 'Dignity'
  },
  {
    ruleNumber: 25,
    titleEn: 'Bhava Sandhi (Cusp Junction) Nullification',
    titleHi: 'भाव संधि पर स्थित ग्रह का फल-शून्य होना',
    ruleEn: 'A planet situated on the junction of two houses (Bhava Sandhi) becomes unstable and cannot deliver its promised house fruit effectively.',
    ruleHi: 'जो ग्रह दो भावों की संधि (जंक्शन) पर स्थित होता है, वह शक्तिहीन हो जाता है और उस भाव का ठोस परिणाम देने में असमर्थ रहता है।',
    category: 'Aspect & Position'
  },
  {
    ruleNumber: 26,
    titleEn: 'Malefic MD with 3rd, 5th, 7th, 8th or Lagna Lord AD',
    titleHi: 'क्रूर महादशा में संवेदनशील अंतरदशा',
    ruleEn: 'The native suffers from fear of government, theft, fire, accidents, or enemies if the Sub-period of the lord of the 3rd, 5th, 7th, 8th, or Lagna operates within the Major period of a malefic planet.',
    ruleHi: 'क्रूर ग्रह की महादशा में यदि ३रे, ५वें, ७वें, ८वें अथवा लग्न के स्वामी की अंतरदशा चले, तो जातक को राज-भय, अग्नि, शत्रु, दुर्घटना अथवा विवाद का भय रहता है।',
    category: 'Special Principles'
  },
];

export function getAifasYoginiMaha(name: string): AifasYoginiMahaProfile | undefined {
  const clean = name.trim().split(' ')[0];
  return AIFAS_YOGINI_MAHADASHAS[clean];
}

export function getAifasYoginiSub(mdName: string, adName: string): AifasYoginiSubProfile | undefined {
  const cMd = mdName.trim().split(' ')[0];
  const cAd = adName.trim().split(' ')[0];
  return AIFAS_YOGINI_64_ANTARDASHAS[`${cMd}-${cAd}`];
}