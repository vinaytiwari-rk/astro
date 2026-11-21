/* =========================================================================
   CLICKASTRO HOROSCOPE FEEDS INGESTION & TRANSLATION MODULE
   (Daily & Weekly Sign Horoscopes from Official FeedBurner RSS Streams)

   Feeds:
   - Daily:  https://feeds.feedburner.com/clickastro/daily-horoscope
   - Weekly: https://feeds.feedburner.com/clickastro/weekly-horoscope

   AV Astro Vibe High-Precision Astronomical & Vedic Engine
   Strictly Zero Emojis. Dates DD-MM-YYYY. Bilingual (English & Hindi).
   ========================================================================= */

import { SIGNS } from './constants';

export interface FeedSignHoroscope {
  signIndex: number; // 0..11
  signNameEn: string;
  signNameHi: string;
  period: 'daily' | 'weekly';
  title: string;
  link: string;
  pubDate: string;
  pubDateFormatted: string; // DD-MM-YYYY
  description: string;
  descriptionHi: string;
  keyThemesEn: string[];
  keyThemesHi: string[];
}

export interface ClickAstroFeedSnapshot {
  dailyItems: FeedSignHoroscope[];
  weeklyItems: FeedSignHoroscope[];
  lastFetched: string; // DD-MM-YYYY
  status: 'online' | 'cached';
}

const SIGN_NAMES_EN = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

const SIGN_NAMES_HI = [
  'मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या',
  'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुंभ', 'मीन',
];

// Offline verified snapshot for Daily Horoscope (21-11-2026)
export const CLICKASTRO_DAILY_FEED_SNAPSHOT: FeedSignHoroscope[] = [
  {
    signIndex: 0,
    signNameEn: 'Aries',
    signNameHi: 'मेष',
    period: 'daily',
    title: 'Aries Horoscope Nov 21 2026',
    link: 'https://www.clickastro.com/aries-horoscope-daily',
    pubDate: 'Sat, 21 Nov 2026 12:15:53 IST',
    pubDateFormatted: '21-11-2026',
    description:
      'Your habit of speaking without thinking, of shooting off your mouth may prove very negative to you today. It might repel someone you are attracted to. Today some of your financial problems may get resolved. Things might become a lot easier. It would still be some time before you can expect results or complete ease.',
    descriptionHi:
      'बिना सोचे-समझे बोलने या वाणी पर संयम न रखने की आदत आज प्रतिकूल सिद्ध हो सकती है; यह किसी प्रियजन को आपसे दूर कर सकती है। आज कुछ पुरानी वित्तीय समस्याएं सुलझने के शुभ संकेत हैं। परिस्थितियां पहले से काफी सुगम होंगी, किंतु अंतिम परिणाम आने में थोड़ा समय लग सकता है।',
    keyThemesEn: ['Speech restraint in relationships', 'Financial problems getting resolved', 'Patience for final results'],
    keyThemesHi: ['वाणी पर संयम व कोमलता', 'आर्थिक उलझनों का समाधान', 'परिणामों हेतु धैर्य'],
  },
  {
    signIndex: 1,
    signNameEn: 'Taurus',
    signNameHi: 'वृषभ',
    period: 'daily',
    title: 'Taurus Horoscope Nov 21 2026',
    link: 'https://www.clickastro.com/taurus-horoscope-daily',
    pubDate: 'Sat, 21 Nov 2026 12:15:53 IST',
    pubDateFormatted: '21-11-2026',
    description:
      'You will be an inspiration to people whom you meet today. Your vibrant energy and the love and beauty around you motivates them. You have had a tough time emotionally and it may take some time before the wounds on your heart heal completely. But you will receive compassion and empathy from people around you.',
    descriptionHi:
      'आज आप जिनसे भी मिलेंगे उनके लिए प्रेरणास्रोत बनेंगे। आपकी जीवंत ऊर्जा और सौंदर्य बोध दूसरों को प्रेरित करेगा। पूर्व में आपने जो भावनात्मक कष्ट झेला है, उसके पूर्ण उपचार में समय लग सकता है, किंतु आज आपको आसपास के लोगों से भरपूर सहानुभूति व अपनत्व प्राप्त होगा।',
    keyThemesEn: ['Inspiring others with vibrancy', 'Emotional recovery and healing', 'Compassion from peers'],
    keyThemesHi: ['दूसरों को प्रेरणा देना', 'भावनात्मक घावों का उपचार', 'सहकर्मियों व परिजनों से सहानुभूति'],
  },
  {
    signIndex: 2,
    signNameEn: 'Gemini',
    signNameHi: 'मिथुन',
    period: 'daily',
    title: 'Gemini Horoscope Nov 21 2026',
    link: 'https://www.clickastro.com/gemini-horoscope-daily',
    pubDate: 'Sat, 21 Nov 2026 12:15:53 IST',
    pubDateFormatted: '21-11-2026',
    description:
      'Express your feelings and emotions clearly and openly to the person you are attracted to. Do not fear rejection. Implementing a new idea will gain you the approval of your superiors. Your colleagues will also appreciate you and support you in your endeavor to work further on the idea.',
    descriptionHi:
      'अपनी भावनाएं व विचार उस व्यक्ति के समक्ष स्पष्टता से रखें जिसके प्रति आप आकर्षित हैं; संकोच या अस्वीकृति का भय न रखें। कार्यक्षेत्र में नया विचार लागू करने से उच्चाधिकारियों की स्वीकृति व प्रशंसा मिलेगी। सहकर्मी भी आपके रचनात्मक प्रयास में पूर्ण सहयोग देंगे।',
    keyThemesEn: ['Open emotional expression', 'Superiors approval for new concepts', 'Colleague teamwork'],
    keyThemesHi: ['खुलकर भाव व्यक्त करना', 'वरिष्ठों से नए विचार की स्वीकृति', 'सहकर्मियों का सहयोग'],
  },
  {
    signIndex: 3,
    signNameEn: 'Cancer',
    signNameHi: 'कर्क',
    period: 'daily',
    title: 'Cancer Horoscope Nov 21 2026',
    link: 'https://www.clickastro.com/cancer-horoscope-daily',
    pubDate: 'Sat, 21 Nov 2026 12:15:53 IST',
    pubDateFormatted: '21-11-2026',
    description:
      'You are going through a rough mental state right now. You will repel even things that are beautiful and peaceful. Meditation can help you get out of this mental state. You appreciate people who are open to and welcome constructive ideas. This will help you get a new project through such people.',
    descriptionHi:
      'वर्तमान में आप कुछ अशांत मानसिक स्थिति से गुजर सकते हैं; मन शांत वातावरण से भी विचलित हो सकता है। ध्यान (Meditation) व प्राणायाम से मानसिक संतुलन पुनः प्राप्त होगा। रचनात्मक विचारों का स्वागत करने वाले लोगों से संपर्क आपको नया प्रोजेक्ट दिलाने में सहायक सिद्ध होगा।',
    keyThemesEn: ['Meditation for mental calm', 'Welcoming constructive ideas', 'Securing new projects'],
    keyThemesHi: ['ध्यान द्वारा मानसिक शांति', 'रचनात्मक सुझावों का स्वागत', 'नवीन परियोजना की प्राप्ति'],
  },
  {
    signIndex: 4,
    signNameEn: 'Leo',
    signNameHi: 'सिंह',
    period: 'daily',
    title: 'Leo Horoscope Nov 21 2026',
    link: 'https://www.clickastro.com/leo-horoscope-daily',
    pubDate: 'Sat, 21 Nov 2026 12:15:53 IST',
    pubDateFormatted: '21-11-2026',
    description:
      'You have reached a position of authority. You will use your authority to mentor others working with you. You will guide them for their benefit. Busy work schedules may keep fathers away from their family and responsibilities towards them. Express your love for your beloved openly and confidently.',
    descriptionHi:
      'आप अधिकार व प्रतिष्ठा की स्थिति में हैं। अपने पद व प्रभाव का उपयोग सहयोगियों के मार्गदर्शन व मेंटरशिप के लिए करें। व्यस्त दिनचर्या के कारण परिवार से दूरी न बनने दें; पिता व अभिभावक के कर्तव्यों को प्राथमिकता दें। जीवनसाथी या प्रियजन के प्रति अपने स्नेह को आत्मविश्वास से व्यक्त करें।',
    keyThemesEn: ['Mentoring from position of authority', 'Balancing family duties with busy work', 'Confident expression of affection'],
    keyThemesHi: ['अधिकार द्वारा दूसरों का मार्गदर्शन', 'व्यस्तता के मध्य पारिवारिक संतुलन', 'स्नेह की स्पष्ट अभिव्यक्ति'],
  },
  {
    signIndex: 5,
    signNameEn: 'Virgo',
    signNameHi: 'कन्या',
    period: 'daily',
    title: 'Virgo Horoscope Nov 21 2026',
    link: 'https://www.clickastro.com/virgo-horoscope-daily',
    pubDate: 'Sat, 21 Nov 2026 12:15:53 IST',
    pubDateFormatted: '21-11-2026',
    description:
      'You are attracted to beauty and peace. Today you will find yourself relaxing in a peaceful environment. Refrain from giving unsolicited advice or compliments to anyone. Also do not indulge in interfering into other people\'s personal matters.',
    descriptionHi:
      'आज आपका मन सौंदर्य, स्वच्छता व शांति की ओर आकर्षित होगा और आप शांत वातावरण में विश्राम का आनंद लेंगे। किसी को भी बिन मांगी सलाह देने या अत्यधिक प्रशंसा करने से बचें। दूसरों के व्यक्तिगत मामलों में अनावश्यक हस्तक्षेप न करना आपके लिए हितकर रहेगा।',
    keyThemesEn: ['Relaxation in peaceful settings', 'Avoiding unsolicited advice', 'Respecting personal boundaries'],
    keyThemesHi: ['शांत वातावरण में विश्राम', 'बिन मांगी सलाह से बचाव', 'दूसरों के निजी मामलों से दूरी'],
  },
  {
    signIndex: 6,
    signNameEn: 'Libra',
    signNameHi: 'तुला',
    period: 'daily',
    title: 'Libra Horoscope Nov 21 2026',
    link: 'https://www.clickastro.com/libra-horoscope-daily',
    pubDate: 'Sat, 21 Nov 2026 12:15:53 IST',
    pubDateFormatted: '21-11-2026',
    description:
      'You are going through a sensitive mental frame right now. Meditation can help restore your inner equilibrium. You have the ability to win the co-operation and trust of others. This will help you in implementing your long-drawn ideas successfully.',
    descriptionHi:
      'वर्तमान में मन कुछ संवेदनशील रह सकता है; ध्यान व एकांत चिंतन से आंतरिक शांति पुनः लौटेगी। आपके भीतर दूसरों का विश्वास और सहयोग प्राप्त करने का विशेष गुण है, जो आपकी पुरानी दीर्घकालिक योजनाओं को क्रियान्वित करने में अत्यंत सहायक रहेगा।',
    keyThemesEn: ['Restoring inner equilibrium', 'Winning trust and co-operation', 'Executing long-drawn ideas'],
    keyThemesHi: ['आंतरिक संतुलन की पुनर्स्थापना', 'दूसरों का विश्वास व सहयोग अर्जन', 'दीर्घकालिक योजनाओं का क्रियान्वयन'],
  },
  {
    signIndex: 7,
    signNameEn: 'Scorpio',
    signNameHi: 'वृश्चिक',
    period: 'daily',
    title: 'Scorpio Horoscope Nov 21 2026',
    link: 'https://www.clickastro.com/scorpio-horoscope-daily',
    pubDate: 'Sat, 21 Nov 2026 12:15:53 IST',
    pubDateFormatted: '21-11-2026',
    description:
      'You will prefer to spend an evening with your family. You might enjoy a home cooked dinner with your spouse, assuring them of your deep commitment. You are now focused on securing your life financially and bettering career prospects steadily.',
    descriptionHi:
      'आज की संध्या परिवार के साथ बिताना आपके लिए सुखद रहेगा। जीवनसाथी के साथ घर पर बना भोजन और आत्मीय संवाद आपके दांपत्य समर्पण को सुदृढ़ करेगा। आप अपने जीवन को आर्थिक रूप से सुरक्षित करने और आजीविका की संभावनाओं को बेहतर बनाने के प्रति गंभीर हैं।',
    keyThemesEn: ['Quality family and spouse evening', 'Reassuring marital commitment', 'Steadfast financial security'],
    keyThemesHi: ['परिवार व दांपत्य संग मधुर संध्या', 'दांपत्य निष्ठा की पुष्टि', 'वित्तीय व करियर सुरक्षा'],
  },
  {
    signIndex: 8,
    signNameEn: 'Sagittarius',
    signNameHi: 'धनु',
    period: 'daily',
    title: 'Sagittarius Horoscope Nov 21 2026',
    link: 'https://www.clickastro.com/sagittarius-horoscope-daily',
    pubDate: 'Sat, 21 Nov 2026 12:15:53 IST',
    pubDateFormatted: '21-11-2026',
    description:
      'Do not let dullness or inertia hold you back. Music or elevating art will rekindle your spirit. You have a highly creative and inventive mind. It will help you take an important decision that ensures a secure future for you.',
    descriptionHi:
      'उदासी या सुस्ती को अपने ऊपर हावी न होने दें; संगीत व कलात्मक वातावरण मन में नई ऊर्जा भरेगा। आपके पास अत्यधिक रचनात्मक व मौलिक प्रज्ञा है, जिसकी सहायता से आप आज भविष्य को सुरक्षित करने वाला कोई अत्यंत महत्वपूर्ण निर्णय ले सकेंगे।',
    keyThemesEn: ['Overcoming melancholy through music', 'Creative inventive mindset', 'Decisive long-term planning'],
    keyThemesHi: ['संगीत व कला द्वारा उत्साह संचार', 'मौलिक रचनात्मक प्रज्ञा', 'सुरक्षित भविष्य हेतु ठोस निर्णय'],
  },
  {
    signIndex: 9,
    signNameEn: 'Capricorn',
    signNameHi: 'मकर',
    period: 'daily',
    title: 'Capricorn Horoscope Nov 21 2026',
    link: 'https://www.clickastro.com/capricorn-horoscope-daily',
    pubDate: 'Sat, 21 Nov 2026 12:15:53 IST',
    pubDateFormatted: '21-11-2026',
    description:
      'You have to be very firm while communicating that matters relating to your spouse, children and private life are off limits to outsiders. Ensure there is no unnecessary interference into your private life. Gather accurate information before worrying.',
    descriptionHi:
      'जीवनसाथी, बच्चों और निजी जीवन से जुड़े मामलों में दृढ़ता से स्पष्ट करें कि बाहरी हस्तक्षेप स्वीकार्य नहीं है। अपने पारिवारिक जीवन की मर्यादा व गोपनीयता बनाए रखें। किसी भी चिंता से पूर्व तथ्यों व जानकारी की भलीभांति पुष्टि कर लें।',
    keyThemesEn: ['Guarding family privacy firmly', 'Zero tolerance for interference', 'Fact-based decisions without worry'],
    keyThemesHi: ['पारिवारिक गोपनीयता की सुरक्षा', 'अनावश्यक हस्तक्षेप पर रोक', 'तथ्यों पर आधारित निर्णय'],
  },
  {
    signIndex: 10,
    signNameEn: 'Aquarius',
    signNameHi: 'कुंभ',
    period: 'daily',
    title: 'Aquarius Horoscope Nov 21 2026',
    link: 'https://www.clickastro.com/aquarius-horoscope-daily',
    pubDate: 'Sat, 21 Nov 2026 12:15:53 IST',
    pubDateFormatted: '21-11-2026',
    description:
      'You will be an inspiration to people whom you meet today. Your vibrant energy and positive aura motivates them. You might have favorable stars, but steady hard work is required to get even the smallest details completed flawlessly.',
    descriptionHi:
      'आज आप जिनसे भी मिलेंगे उनके लिए प्रेरणास्रोत बनेंगे। आपका सकारात्मक आभामंडल और ऊर्जा दूसरों को प्रोत्साहित करेगी। भाग्य का सहयोग मिलेगा, किंतु छोटे-छोटे कार्यों को भी त्रुटिहीन रूप से पूरा करने के लिए सतत परिश्रम अनिवार्य रहेगा।',
    keyThemesEn: ['Inspiring others with vibrancy', 'Favorable stars backed by hard work', 'Flawless execution of details'],
    keyThemesHi: ['सकारात्मक आभामंडल से प्रेरणा', 'भाग्य के साथ कठोर परिश्रम', 'कार्यों का त्रुटिहीन निष्पादन'],
  },
  {
    signIndex: 11,
    signNameEn: 'Pisces',
    signNameHi: 'मीन',
    period: 'daily',
    title: 'Pisces Horoscope Nov 21 2026',
    link: 'https://www.clickastro.com/pisces-horoscope-daily',
    pubDate: 'Sat, 21 Nov 2026 12:15:53 IST',
    pubDateFormatted: '21-11-2026',
    description:
      'You will be in a positive energy frame today. It makes you optimistic and gives you strong faith in your resources. You will also have the confidence to express yourself clearly in family and professional affairs.',
    descriptionHi:
      'आज आप अत्यंत सकारात्मक ऊर्जा के घेरे में रहेंगे। यह आपको आशावादी बनाएगा और अपने संसाधनों व क्षमताओं पर दृढ़ विश्वास देगा। पारिवारिक और व्यावसायिक विषयों में अपनी बात को स्पष्ट और आत्मविश्वास के साथ रखने का उत्तम समय है।',
    keyThemesEn: ['Positive energetic mindset', 'Deep faith in resources', 'Clear confident self-expression'],
    keyThemesHi: ['सकारात्मक आशावादी ऊर्जा', 'अपने संसाधनों पर दृढ़ विश्वास', 'स्पष्ट व आत्मविश्वासी अभिव्यक्ति'],
  },
];

// Offline verified snapshot for Weekly Horoscope (15-11-2026 to 21-11-2026)
export const CLICKASTRO_WEEKLY_FEED_SNAPSHOT: FeedSignHoroscope[] = [
  {
    signIndex: 0,
    signNameEn: 'Aries',
    signNameHi: 'मेष',
    period: 'weekly',
    title: 'Aries Horoscope Nov 15 2026 to Nov 21 2026',
    link: 'https://www.clickastro.com/aries-horoscope-weekly',
    pubDate: 'Sat, 21 Nov 2026 11:40:51 IST',
    pubDateFormatted: '21-11-2026',
    description:
      'You will meet someone this week to whom you will feel attracted. Do not feel depressed by initial hesitation; persist patiently. Your attraction towards beauty and harmony will bring you close to new opportunities, making you feel relaxed and efficient. Avoid offering unasked advice or left-handed compliments.',
    descriptionHi:
      'इस सप्ताह आपका परिचय किसी ऐसे व्यक्ति से हो सकता है जिसके प्रति आप आकर्षण अनुभव करेंगे; प्रारंभिक संकोच से निराश न हों और धैर्य बनाए रखें। सौंदर्य और सौहार्द के प्रति आपकी रुचि नए अवसरों के द्वार खोलेगी जिससे आप तनावमुक्त महसूस करेंगे। बिन मांगी सलाह देने से बचें।',
    keyThemesEn: ['New romantic attraction', 'Harmony enhancing efficiency', 'Tactful communication'],
    keyThemesHi: ['नवीन आकर्षण व संबंध', 'सौहार्द से कार्यक्षमता में वृद्धि', 'मांगी न जाने पर सलाह से बचाव'],
  },
  {
    signIndex: 1,
    signNameEn: 'Taurus',
    signNameHi: 'वृषभ',
    period: 'weekly',
    title: 'Taurus Horoscope Nov 15 2026 to Nov 21 2026',
    link: 'https://www.clickastro.com/taurus-horoscope-weekly',
    pubDate: 'Sat, 21 Nov 2026 11:40:51 IST',
    pubDateFormatted: '21-11-2026',
    description:
      'A critical situation is developing around the workplace or partnership. Though it tests your patience, you may be the only one who can remain calm and unbiased. You will find yourself tough, energetic and determined this week, attaining favorable outcomes through persistence.',
    descriptionHi:
      'कार्यस्थल या साझेदारी में कोई संवेदनशील स्थिति उत्पन्न हो सकती है; यद्यपि यह आपके धैर्य की परीक्षा लेगी, किंतु आप ही एकमात्र ऐसे व्यक्ति होंगे जो शांत व निष्पक्ष रहकर समाधान निकाल सकेंगे। सप्ताह के अंत तक आपका दृढ़ संकल्प और ऊर्जा शुभ परिणाम दिलाएगी।',
    keyThemesEn: ['Calm mediation in workplace crunch', 'Unbiased leadership', 'Persistence yielding victory'],
    keyThemesHi: ['कार्यक्षेत्र में शांत मध्यस्थता', 'निष्पक्ष निर्णय क्षमता', 'दृढ़ता से सफलता की प्राप्ति'],
  },
  {
    signIndex: 2,
    signNameEn: 'Gemini',
    signNameHi: 'मिथुन',
    period: 'weekly',
    title: 'Gemini Horoscope Nov 15 2026 to Nov 21 2026',
    link: 'https://www.clickastro.com/gemini-horoscope-weekly',
    pubDate: 'Sat, 21 Nov 2026 11:40:51 IST',
    pubDateFormatted: '21-11-2026',
    description:
      'You will be feeling deeply about someone close with whom you may start or deepen a relationship. Your personality entices positive responses. Backing from friends and assistants will help you make a dream come true. Exercise patience to accept constructive advice.',
    descriptionHi:
      'किसी निकट व्यक्ति के प्रति आपकी भावनाएं प्रगाढ़ होंगी, जिससे नए संबंध या वर्तमान संबंधों में मधुरता आएगी। मित्रों और सहयोगियों का समर्थन आपके किसी पुराने स्वप्न को साकार करने में सहायक होगा। वरिष्ठों की उपयोगी सलाह को धैर्यपूर्वक स्वीकार करें।',
    keyThemesEn: ['Deepening bonds', 'Dreams realized through teamwork', 'Valuing constructive counsel'],
    keyThemesHi: ['संबंधों में प्रगाढ़ता', 'सामूहिक सहयोग से स्वप्न साकार', 'सार्थक परामर्श का सम्मान'],
  },
  {
    signIndex: 3,
    signNameEn: 'Cancer',
    signNameHi: 'कर्क',
    period: 'weekly',
    title: 'Cancer Horoscope Nov 15 2026 to Nov 21 2026',
    link: 'https://www.clickastro.com/cancer-horoscope-weekly',
    pubDate: 'Sat, 21 Nov 2026 11:40:51 IST',
    pubDateFormatted: '21-11-2026',
    description:
      'If matters appear disordered at the start of the week, sit back calmly and analyze the root causes; things are not as dire as they seem. Supersensitive reactions hamper your progress. Novel ideas will flow; gather the co-operation of colleagues to execute them steadily.',
    descriptionHi:
      'यदि सप्ताह के प्रारंभ में कुछ अव्यवस्था प्रतीत हो तो घबराएं नहीं, शांत बैठकर कारणों का विश्लेषण करें; स्थिति उतनी प्रतिकूल नहीं है जितनी दिखती है। अतिसंवेदनशीलता से बचें। नवीन विचारों का प्रवाह होगा; सहकर्मियों के सहयोग से योजनाओं को गति दें।',
    keyThemesEn: ['Objectivity over panic', 'Overcoming supersensitivity', 'Gathering team support for ideas'],
    keyThemesHi: ['घबराहट के स्थान पर शांत विश्लेषण', 'अतिसंवेदनशीलता पर नियंत्रण', 'सहकर्मियों के साथ नवीन पहल'],
  },
  {
    signIndex: 4,
    signNameEn: 'Leo',
    signNameHi: 'सिंह',
    period: 'weekly',
    title: 'Leo Horoscope Nov 15 2026 to Nov 21 2026',
    link: 'https://www.clickastro.com/leo-horoscope-weekly',
    pubDate: 'Sat, 21 Nov 2026 11:40:51 IST',
    pubDateFormatted: '21-11-2026',
    description:
      'The dedicated efforts you put into your ventures will begin bearing ripe fruits. Your sheer endurance and tenacity give you an invincible edge. Take care not to stay aloof from family members; initiate warm conversations and invest quality time at home.',
    descriptionHi:
      'अपने उद्यमों में आपने जो अनथक परिश्रम किया है, उसके मधुर फल मिलने का समय आ गया है। आपकी सहनशक्ति और लगन आपको प्रतिस्पर्धा में अप्रतिम बढ़त देती है। परिवार से अलगाव न होने दें; घर पर आत्मीयता से समय बिताना अत्यंत आवश्यक है।',
    keyThemesEn: ['Harvesting fruits of hard work', 'Unbeatable stamina and drive', 'Nurturing family warmth'],
    keyThemesHi: ['कठोर परिश्रम के शुभ फल', 'अदम्य सहनशक्ति व नेतृत्व', 'पारिवारिक सौहार्द का पोषण'],
  },
  {
    signIndex: 5,
    signNameEn: 'Virgo',
    signNameHi: 'कन्या',
    period: 'weekly',
    title: 'Virgo Horoscope Nov 15 2026 to Nov 21 2026',
    link: 'https://www.clickastro.com/virgo-horoscope-weekly',
    pubDate: 'Sat, 21 Nov 2026 11:40:51 IST',
    pubDateFormatted: '21-11-2026',
    description:
      'Your keen sense of humor and appreciation for beauty make you naturally attractive. If dealing with financial pressure or self-esteem concerns, recognize that anxiety exaggerates the problem. Keep financial planning practical and balanced.',
    descriptionHi:
      'आपका विनोदी स्वभाव और सौंदर्य बोध आपको सामाजिक रूप से लोकप्रिय बनाएगा। यदि वित्तीय दबाव या आत्मसम्मान से जुड़ी कोई चिंता हो, तो यह समझें कि अधिक सोचने से समस्या बड़ी लगती है। वित्तीय योजनाओं को व्यावहारिक व संतुलित रखें।',
    keyThemesEn: ['Humor and social charm', 'Rational handling of financial stress', 'Realistic perspective'],
    keyThemesHi: ['विनोदी व आकर्षक व्यक्तित्व', 'वित्तीय तनाव का व्यावहारिक समाधान', 'अति-चिंता से मुक्ति'],
  },
  {
    signIndex: 6,
    signNameEn: 'Libra',
    signNameHi: 'तुला',
    period: 'weekly',
    title: 'Libra Horoscope Nov 15 2026 to Nov 21 2026',
    link: 'https://www.clickastro.com/libra-horoscope-weekly',
    pubDate: 'Sat, 21 Nov 2026 11:40:51 IST',
    pubDateFormatted: '21-11-2026',
    description:
      'Warm dealings with siblings and kin create joyful moments. In career matters, maintain strict punctuality and commit fully to avoid unneeded scrutiny. Allocate dedicated time to listen and resolve household family matters proactively.',
    descriptionHi:
      'भाई-बहनों और परिजनों के साथ स्नेहपूर्ण व्यवहार जीवन में आनंददायक क्षण लाएगा। कार्यक्षेत्र में लापरवाही या टालमटोल से बचें और जिम्मेदारियों को समय पर पूरा करें। आजीविका के साथ-साथ परिवार की समस्याओं के समाधान हेतु सक्रिय समय निकालें।',
    keyThemesEn: ['Joyful sibling connections', 'Professional reliability and focus', 'Family problem solving'],
    keyThemesHi: ['भाई-बहनों के साथ मधुर संबंध', 'कार्यक्षेत्र में समयबद्धता व निष्ठा', 'पारिवारिक समस्याओं का निवारण'],
  },
  {
    signIndex: 7,
    signNameEn: 'Scorpio',
    signNameHi: 'वृश्चिक',
    period: 'weekly',
    title: 'Scorpio Horoscope Nov 15 2026 to Nov 21 2026',
    link: 'https://www.clickastro.com/scorpio-horoscope-weekly',
    pubDate: 'Sat, 21 Nov 2026 11:40:51 IST',
    pubDateFormatted: '21-11-2026',
    description:
      'Misunderstandings between siblings will be happily resolved, bringing back cherished old times. When implementing ambitious ideas, avoid hasty greed so that assistants stay aligned. Your protective and nurturing nature makes loved ones feel secure.',
    descriptionHi:
      'भाई-बहनों के बीच पुरानी गलतफहमियां दूर होंगी और पुनः मधुर संबंध स्थापित होंगे। महत्वाकांक्षी योजनाओं में अत्यधिक उतावलेपन से बचें ताकि सहयोगी आपका साथ दें। आपका संरक्षक व स्नेही स्वभाव परिजनों में सुरक्षा की भावना भरेगा।',
    keyThemesEn: ['Reconciliation with siblings', 'Patience with assistants on projects', 'Protective family pillar'],
    keyThemesHi: ['भाई-बहनों से सुलह व पुनर्मिलन', 'सहयोगियों के प्रति धैर्यवान दृष्टिकोण', 'परिवार के रक्षक की भूमिका'],
  },
  {
    signIndex: 8,
    signNameEn: 'Sagittarius',
    signNameHi: 'धनु',
    period: 'weekly',
    title: 'Sagittarius Horoscope Nov 15 2026 to Nov 21 2026',
    link: 'https://www.clickastro.com/sagittarius-horoscope-weekly',
    pubDate: 'Sat, 21 Nov 2026 11:40:51 IST',
    pubDateFormatted: '21-11-2026',
    description:
      'Maintain stability in relationships even when initial novelty fades; avoid abrupt exits that cause regret. Your witty, generous and vibrant personality keeps you in high demand. Face unexpected challenges with your innate cool confidence.',
    descriptionHi:
      'संबंधों में प्रारंभिक रोमांच कम होने पर भी स्थायित्व व निष्ठा बनाए रखें; जल्दबाजी में संबंध तोड़ने से बचें। आपका हाजिरजवाब, उदार व जीवंत व्यक्तित्व आपको सर्वप्रिय बनाएगा। अप्रत्याशित चुनौतियों का सामना शांत आत्मविश्वास से करें।',
    keyThemesEn: ['Emotional commitment stability', 'Witty and magnetic demeanor', 'Cool confidence in challenges'],
    keyThemesHi: ['संबंधों में स्थायित्व व निष्ठा', 'हाजिरजवाब व चुंबकीय व्यक्तित्व', 'शांत रहकर संकट का सामना'],
  },
  {
    signIndex: 9,
    signNameEn: 'Capricorn',
    signNameHi: 'मकर',
    period: 'weekly',
    title: 'Capricorn Horoscope Nov 15 2026 to Nov 21 2026',
    link: 'https://www.clickastro.com/capricorn-horoscope-weekly',
    pubDate: 'Sat, 21 Nov 2026 11:40:51 IST',
    pubDateFormatted: '21-11-2026',
    description:
      'Do not dismiss ideas presented by others immediately; open evaluation enriches your analytical talent. Your humorous side and childlike enthusiasm make you popular this week. Clear communication prevents misunderstandings with those close to you.',
    descriptionHi:
      'दूसरों द्वारा प्रस्तुत विचारों को तुरंत न नकारें; व्यापक मूल्यांकन आपकी विश्लेषणात्मक क्षमता को और निखारेगा। आपका सहज हास्य और बालसुलभ उत्साह इस सप्ताह आपको लोकप्रिय बनाएगा। परिजनों के साथ खुलकर बात करें ताकि भ्रम न रहे।',
    keyThemesEn: ['Receptivity to diverse ideas', 'Childlike humor and charm', 'Transparent communication'],
    keyThemesHi: ['दूसरों के विचारों का स्वागत', 'सहज हास्य व उत्साह', 'पारदर्शी व स्पष्ट संवाद'],
  },
  {
    signIndex: 10,
    signNameEn: 'Aquarius',
    signNameHi: 'कुंभ',
    period: 'weekly',
    title: 'Aquarius Horoscope Nov 15 2026 to Nov 21 2026',
    link: 'https://www.clickastro.com/aquarius-horoscope-weekly',
    pubDate: 'Sat, 21 Nov 2026 11:40:51 IST',
    pubDateFormatted: '21-11-2026',
    description:
      'You are drawn to beauty, art and harmony, willing to invest energy to manifest it. Avoid placing unrealistic expectations on siblings or peers. In the workplace, step back cautiously when critical tensions emerge and let your calm reason prevail.',
    descriptionHi:
      'सौंदर्य, कला और संतुलन के प्रति आपका रुझान बढ़ेगा और आप इसके लिए ऊर्जा लगाने को तत्पर रहेंगे। भाई-बहनों या सहकर्मियों से अवास्तविक अपेक्षाएं न रखें। कार्यक्षेत्र में तनावपूर्ण स्थिति उत्पन्न होने पर संयम से काम लें।',
    keyThemesEn: ['Artistic and harmonious pursuits', 'Tempered expectations from kin', 'Composed response to workplace tension'],
    keyThemesHi: ['कला व संतुलन के प्रति समर्पण', 'सहयोगियों से संतुलित अपेक्षाएं', 'तनावपूर्ण परिस्थितियों में संयम'],
  },
  {
    signIndex: 11,
    signNameEn: 'Pisces',
    signNameHi: 'मीन',
    period: 'weekly',
    title: 'Pisces Horoscope Nov 15 2026 to Nov 21 2026',
    link: 'https://www.clickastro.com/pisces-horoscope-weekly',
    pubDate: 'Sat, 21 Nov 2026 11:40:51 IST',
    pubDateFormatted: '21-11-2026',
    description:
      'Harmony is your primary keyword this week. At work, home and socially, you perceive beauty in everyone. If feeling momentary irritability or sensitive fatigue, take quiet rest and avoid reacting in haste. Good news from close ones lifts spirits.',
    descriptionHi:
      'इस सप्ताह आपका मूल मंत्र "सौहार्द व समरसता" रहेगा। कार्यक्षेत्र, घर और मित्रों के मध्य आप सकारात्मकता का संचार करेंगे। यदि मन में क्षणिक चिड़चिड़ापन या संवेदनशीलता आए, तो मौन विश्राम करें और उतावली प्रतिक्रिया से बचें।',
    keyThemesEn: ['Harmony as guiding keyword', 'Gentle patience with irritability', 'Savoring positive connections'],
    keyThemesHi: ['समरसता व सौहार्द का मंत्र', 'संवेदनशीलता में मौन व विश्राम', 'सकारात्मक संबंधों का आनंद'],
  },
];

// Parser helper for RSS XML text
export function parseClickAstroRssXml(xmlText: string, period: 'daily' | 'weekly'): FeedSignHoroscope[] {
  const items: FeedSignHoroscope[] = [];
  const itemMatches = xmlText.match(/<item>([\s\S]*?)<\/item>/gi) || [];

  for (const block of itemMatches) {
    const titleMatch = block.match(/<title>([\s\S]*?)<\/title>/i);
    const linkMatch = block.match(/<link>([\s\S]*?)<\/link>/i);
    const descMatch = block.match(/<description>([\s\S]*?)<\/description>/i);
    const pubDateMatch = block.match(/<pubDate>([\s\S]*?)<\/pubDate>/i);

    const title = titleMatch ? titleMatch[1].trim() : '';
    const link = linkMatch ? linkMatch[1].trim() : '';
    const description = descMatch ? descMatch[1].trim() : '';
    const pubDate = pubDateMatch ? pubDateMatch[1].trim() : '';

    // Match sign from title (e.g. "Aries Horoscope Nov 21 2026")
    const signIdx = SIGN_NAMES_EN.findIndex((s) => title.toLowerCase().includes(s.toLowerCase()));
    if (signIdx === -1) continue;

    // Format pubDate (e.g. "Sat, 21 Nov 2026 12:15:53 IST" -> "21-11-2026")
    let pubDateFormatted = '21-11-2026';
    const dateMatch = pubDate.match(/(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/);
    if (dateMatch) {
      const day = dateMatch[1].padStart(2, '0');
      const monthMap: Record<string, string> = {
        Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
        Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12',
      };
      const month = monthMap[dateMatch[2].slice(0, 3)] || '11';
      pubDateFormatted = `${day}-${month}-${dateMatch[3]}`;
    }

    const fallback =
      period === 'daily'
        ? CLICKASTRO_DAILY_FEED_SNAPSHOT[signIdx]
        : CLICKASTRO_WEEKLY_FEED_SNAPSHOT[signIdx];

    items.push({
      signIndex: signIdx,
      signNameEn: SIGN_NAMES_EN[signIdx],
      signNameHi: SIGN_NAMES_HI[signIdx],
      period,
      title,
      link: link || fallback.link,
      pubDate,
      pubDateFormatted,
      description: description || fallback.description,
      descriptionHi: fallback ? fallback.descriptionHi : description,
      keyThemesEn: fallback ? fallback.keyThemesEn : ['Astrological guidance'],
      keyThemesHi: fallback ? fallback.keyThemesHi : ['ज्योतिषीय मार्गदर्शन'],
    });
  }

  // Sort by signIndex (Aries 0 to Pisces 11)
  items.sort((a, b) => a.signIndex - b.signIndex);

  return items.length === 12
    ? items
    : period === 'daily'
    ? CLICKASTRO_DAILY_FEED_SNAPSHOT
    : CLICKASTRO_WEEKLY_FEED_SNAPSHOT;
}

// Live fetcher with automated fallback
export async function fetchClickAstroFeed(
  period: 'daily' | 'weekly',
  allowNetwork = true
): Promise<{ items: FeedSignHoroscope[]; status: 'online' | 'cached' }> {
  if (!allowNetwork || typeof fetch === 'undefined') {
    return {
      items: period === 'daily' ? CLICKASTRO_DAILY_FEED_SNAPSHOT : CLICKASTRO_WEEKLY_FEED_SNAPSHOT,
      status: 'cached',
    };
  }

  const feedUrl =
    period === 'daily'
      ? 'https://feeds.feedburner.com/clickastro/daily-horoscope'
      : 'https://feeds.feedburner.com/clickastro/weekly-horoscope';

  // In browser environments, directly fetching cross-origin RSS can be blocked by CORS.
  // We try direct fetch, then public CORS proxy, and fall back cleanly to cached snapshot.
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const directRes = await fetch(feedUrl, { signal: controller.signal }).catch(() => null);
    clearTimeout(timeout);

    if (directRes && directRes.ok) {
      const xml = await directRes.text();
      const parsed = parseClickAstroRssXml(xml, period);
      if (parsed.length === 12) {
        return { items: parsed, status: 'online' };
      }
    }

    // Try CORS proxy
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(feedUrl)}`;
    const proxyController = new AbortController();
    const proxyTimeout = setTimeout(() => proxyController.abort(), 4000);

    const proxyRes = await fetch(proxyUrl, { signal: proxyController.signal }).catch(() => null);
    clearTimeout(proxyTimeout);

    if (proxyRes && proxyRes.ok) {
      const xml = await proxyRes.text();
      const parsed = parseClickAstroRssXml(xml, period);
      if (parsed.length === 12) {
        return { items: parsed, status: 'online' };
      }
    }
  } catch {
    // Network or parse exception -> fallback cleanly
  }

  return {
    items: period === 'daily' ? CLICKASTRO_DAILY_FEED_SNAPSHOT : CLICKASTRO_WEEKLY_FEED_SNAPSHOT,
    status: 'cached',
  };
}
