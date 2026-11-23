import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  BookOpen,
  Calendar,
  Compass,
  Flame,
  Heart,
  Search,
  Shield,
  Sparkles,
  Star,
  Users,
  X,
  Zap,
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export interface CommandPaletteItem {
  id: string;
  titleHi: string;
  titleEn: string;
  descriptionHi: string;
  descriptionEn: string;
  categoryHi: string;
  categoryEn: string;
  keywords: string[];
  targetView: string;
  subTab?: string;
  iconType: 'chart' | 'heart' | 'star' | 'shield' | 'calendar' | 'users' | 'zap' | 'book' | 'compass';
}

export const COMMAND_REGISTRY: CommandPaletteItem[] = [
  // 1. Core Calculators
  {
    id: 'love-calculator',
    titleHi: 'लव कैलकुलेटर (Love %)',
    titleEn: 'Love Calculator (Percentage & Compatibility)',
    descriptionHi: 'दो व्यक्तियों के मध्य प्रेम प्रतिशत, रोमांटिक केमिस्ट्री एवं भावनात्मक जुड़ाव',
    descriptionEn: 'Love percentage, romantic chemistry & emotional compatibility between two partners',
    categoryHi: 'दांपत्य एवं संबंध',
    categoryEn: 'Relationship & Marriage',
    keywords: ['love', 'prem', 'calculator', 'percentage', 'crush', 'partner', 'instaastro', 'pyar', 'लव', 'प्रेम'],
    targetView: 'fortune-calculators',
    subTab: 'love_calculator',
    iconType: 'heart',
  },
  {
    id: 'love-vs-arranged',
    titleHi: 'प्रेम बनाम पारंपरिक विवाह कैलकुलेटर',
    titleEn: 'Love vs Arranged Marriage Calculator',
    descriptionHi: 'पंचम, सप्तम व नवम भाव के आधार पर विवाह स्वरूप का शास्त्रीय निर्णय',
    descriptionEn: 'Classical verdict on love vs arranged marriage via 5th, 7th & 9th houses',
    categoryHi: 'दांपत्य एवं संबंध',
    categoryEn: 'Relationship & Marriage',
    keywords: ['arranged', 'love vs arranged', 'shadi', 'vivaha', 'विवाह', 'पारंपरिक'],
    targetView: 'fortune-calculators',
    subTab: 'love_vs_arranged',
    iconType: 'heart',
  },
  {
    id: 'marriage-timing',
    titleHi: 'सटीक विवाह समय (द्वि-गोचर कैलकुलेटर)',
    titleEn: 'Marriage Timing & Double Transit Calculator',
    descriptionHi: 'गुरु व शनि के द्वि-गोचर एवं उपपद लग्न द्वारा विवाह का शुभ वर्ष व आयु',
    descriptionEn: 'Jupiter & Saturn double transit window for marriage timing',
    categoryHi: 'दांपत्य एवं संबंध',
    categoryEn: 'Relationship & Marriage',
    keywords: ['when will i get married', 'timing', 'vivaha timing', 'double transit', 'विवाह समय'],
    targetView: 'fortune-calculators',
    subTab: 'marriage_timing',
    iconType: 'calendar',
  },
  {
    id: 'partner-initials',
    titleHi: 'जीवनसाथी का संभावित नामाक्षर खोजक',
    titleEn: 'Life Partner Name Initial Finder',
    descriptionHi: 'सप्तमेश के १०८ नक्षत्र चरणों द्वारा संभावित जीवनसाथी का पहला अक्षर',
    descriptionEn: 'Predicts partner name initial using 7th lord 108 nakshatra padas',
    categoryHi: 'दांपत्य एवं संबंध',
    categoryEn: 'Relationship & Marriage',
    keywords: ['partner initials', 'name letter', 'spouse initial', 'namakshar', 'नामाक्षर'],
    targetView: 'fortune-calculators',
    subTab: 'partner_initials',
    iconType: 'star',
  },
  {
    id: 'karmic-soul-bond',
    titleHi: 'ऋणानुबंध एवं आत्मिक संबंध (Soul Bond)',
    titleEn: 'Karmic Soul Bond (Vedic Twin Flame)',
    descriptionHi: 'पूर्व जन्म के कर्म ऋण, पंचम भाव व राहु-केतु अक्ष द्वारा आत्मिक जुड़ाव',
    descriptionEn: 'Past-life karmic bond and soul connection via 5th house & Rahu-Ketu',
    categoryHi: 'दांपत्य एवं संबंध',
    categoryEn: 'Relationship & Marriage',
    keywords: ['twin flame', 'soulmate', 'karmic bond', 'rinanubandha', 'ऋणानुबंध', 'सोलमेट'],
    targetView: 'fortune-calculators',
    subTab: 'karmic_soul_bond',
    iconType: 'star',
  },
  {
    id: 'zodiac-element-match',
    titleHi: 'द्वादश राशि एवं तत्व प्रेम अनुकूलता',
    titleEn: 'Zodiac Element & Planetary Resonance',
    descriptionHi: 'अग्नि, पृथ्वी, वायु, जल तत्वों और राशि स्वामियों की मैत्री का मिलान',
    descriptionEn: 'Elemental synergy (Fire, Earth, Air, Water) & planetary friendship match',
    categoryHi: 'दांपत्य एवं संबंध',
    categoryEn: 'Relationship & Marriage',
    keywords: ['zodiac compatibility', 'rashi milan', 'element match', 'tattwa', 'राशि अनुकूलता'],
    targetView: 'fortune-calculators',
    subTab: 'zodiac_element',
    iconType: 'zap',
  },
  {
    id: 'marriage-matching-36',
    titleHi: 'अष्टकूट ३६ गुण मिलान एवं १६ मंगलीक परिहार',
    titleEn: 'Ashtakoota 36 Guna Milan & Manglik Pariharas',
    descriptionHi: 'वर्ण, वश्य, तारा, योनि, मैत्री, गण, भकूट, नाड़ी व १६ मंगलीक भंग नियम',
    descriptionEn: '36 Gunas matchmaking with 16 authentic Manglik cancellation rules',
    categoryHi: 'दांपत्य एवं संबंध',
    categoryEn: 'Relationship & Marriage',
    keywords: ['kundli matching', 'milan', '36 guna', 'ashtakoota', 'manglik', 'गुण मिलान', 'मांगलिक'],
    targetView: 'marriage-matching',
    iconType: 'users',
  },

  // 2. Core Horoscopes & Charts
  {
    id: 'vedic-horoscope-d1',
    titleHi: 'वैदिक लग्न कुंडली (D1 Rasi Chart)',
    titleEn: 'Vedic Natal Horoscope (D1 Rasi)',
    descriptionHi: 'द्वादश भाव, ग्रह स्थिति, अंश, नक्षत्र चरण एवं दृष्टि संबंध',
    descriptionEn: 'Ascendant chart with planetary degrees, houses and classical aspects',
    categoryHi: 'मुख्य कुंडलियाँ',
    categoryEn: 'Core Horoscopes',
    keywords: ['kundli', 'lagna', 'd1', 'rasi', 'horoscope', 'chart', 'कुंडली', 'लग्न'],
    targetView: 'vedic-horoscope',
    iconType: 'chart',
  },
  {
    id: 'navamsha-d9',
    titleHi: 'नवमांश कुंडली (D9 Navamsha Chart)',
    titleEn: 'Navamsha Chart (D9)',
    descriptionHi: 'दांपत्य जीवन, धर्म, भाग्य एवं ग्रहीय आंतरिक बल का सूक्ष्म चक्र',
    descriptionEn: 'Micro-divisional chart for marriage, dharma, and planetary fruit',
    categoryHi: 'षोडशवर्ग चक्र',
    categoryEn: 'Divisional Charts',
    keywords: ['navamsha', 'd9', 'marriage chart', 'dharma', 'नवमांश'],
    targetView: 'vedic-horoscope',
    subTab: 'navamsha',
    iconType: 'chart',
  },
  {
    id: 'dasamsha-d10',
    titleHi: 'दशमांश कुंडली (D10 Dasamsha Chart)',
    titleEn: 'Dasamsha Chart (D10 Career)',
    descriptionHi: 'आजीविका, पद-प्रतिष्ठा, करियर सफलता एवं कार्यक्षेत्र का चक्र',
    descriptionEn: 'Career, profession, governance and status analysis chart',
    categoryHi: 'षोडशवर्ग चक्र',
    categoryEn: 'Divisional Charts',
    keywords: ['dasamsha', 'd10', 'career', 'job', 'profession', 'दशमांश', 'करियर'],
    targetView: 'vedic-horoscope',
    subTab: 'dasamsha',
    iconType: 'chart',
  },
  {
    id: 'shashtiamsa-d60',
    titleHi: 'षष्ट्यंश कुंडली (D60 Shashtiamsa Chart)',
    titleEn: 'Shashtiamsa Chart (D60 Past Karma)',
    descriptionHi: 'पराशर मत में सर्वोच्च फलदायक चक्र — पूर्व जन्म के संचित कर्म संस्कार',
    descriptionEn: 'Highest weighted varga in BPHS for past-life karma & subtle destiny',
    categoryHi: 'षोडशवर्ग चक्र',
    categoryEn: 'Divisional Charts',
    keywords: ['d60', 'shashtiamsa', 'past life', 'karma', 'षष्ट्यंश'],
    targetView: 'vedic-horoscope',
    subTab: 'd60',
    iconType: 'chart',
  },
  {
    id: 'shodashvarga-all',
    titleHi: 'संपूर्ण षोडशवर्ग एवं उच्च वर्ग (D1 to D360)',
    titleEn: 'Complete Shodashvarga & Higher Vargas',
    descriptionHi: 'D1 से D60 षोडशवर्ग तथा D81, D108, D144, D150 नाड़ी अंश व D360 चक्र',
    descriptionEn: 'All 16 classical vargas plus D81, D108, D144, D150 Nadi & D360',
    categoryHi: 'षोडशवर्ग चक्र',
    categoryEn: 'Divisional Charts',
    keywords: ['varga', 'divisional', 'd2', 'd3', 'd4', 'd7', 'd12', 'd16', 'd20', 'd24', 'd27', 'd30', 'd150', 'd360'],
    targetView: 'calculations',
    iconType: 'chart',
  },

  // 3. Dasha Systems
  {
    id: 'vimshottari-dasha',
    titleHi: 'विंशोत्तरी महादशा (५ स्तरीय सूक्ष्म क्रम)',
    titleEn: 'Vimshottari Dasha (5-Level Hierarchy)',
    descriptionHi: '१२० वर्षीय क्रम: महादशा, अंतर्दशा, प्रत्यंतर, सूक्ष्म एवं प्राण दशा',
    descriptionEn: '120-year cycle from Mahadasha down to Pran Dasha',
    categoryHi: 'दशा प्रणालियां',
    categoryEn: 'Dasha Systems',
    keywords: ['dasha', 'vimshottari', 'antardasha', 'mahadasha', 'pratyantar', 'दशा', 'विंशोत्तरी'],
    targetView: 'predictions',
    subTab: 'dasha',
    iconType: 'calendar',
  },
  {
    id: 'yogini-dasha',
    titleHi: 'योगिनी महादशा (३६ वर्षीय चक्र)',
    titleEn: 'Yogini Dasha (36-Year Cycle)',
    descriptionHi: 'मंगला, पिंगला, धन्या, भ्रामरी, भद्रिका, उल्का, सिद्धा, संकटा',
    descriptionEn: '36-year Yogini system with nested sub-periods',
    categoryHi: 'दशा प्रणालियां',
    categoryEn: 'Dasha Systems',
    keywords: ['yogini', 'dasha', 'mangala', 'pingala', 'sankata', 'योगिनी'],
    targetView: 'multi-dasha',
    iconType: 'calendar',
  },
  {
    id: 'chara-dasha',
    titleHi: 'जैमिनी चर दशा एवं कारक विश्लेषण',
    titleEn: 'Jaimini Chara Dasha & Karakas',
    descriptionHi: 'राशि आधारित दशा, आत्मकारक, अमात्यकारक एवं अरूढ़ पद',
    descriptionEn: 'Rasi-based Jaimini dasha, Chara Karakas, and Arudha Padas',
    categoryHi: 'दशा प्रणालियां',
    categoryEn: 'Dasha Systems',
    keywords: ['jaimini', 'chara dasha', 'atmakaraka', 'arudha', 'चर दशा', 'जैमिनी'],
    targetView: 'jaimini',
    iconType: 'calendar',
  },
  {
    id: 'sudarshana-chakra',
    titleHi: 'सुदर्शन चक्र एवं वार्षिक दशा',
    titleEn: 'Sudarshana Chakra Dasha',
    descriptionHi: 'लग्न, चंद्र एवं सूर्य से त्रि-आयामी युगपत चक्र विश्लेषण',
    descriptionEn: 'Tri-fold simultaneous progression from Lagna, Moon & Sun',
    categoryHi: 'दशा प्रणालियां',
    categoryEn: 'Dasha Systems',
    keywords: ['sudarshana', 'wheel', 'chakra', 'सुदर्शन'],
    targetView: 'sudarshana',
    iconType: 'star',
  },

  // 4. Strengths & Transits
  {
    id: 'shadbala-bhavabala',
    titleHi: 'षड्बल एवं भाव बल विस्तृत विश्लेषण',
    titleEn: 'Shadbala & Bhava Bala (Virupas)',
    descriptionHi: 'स्थानबल, दिग्बल, कालबल, चेष्टाबल, नैसर्गिकबल एवं दृग्बल',
    descriptionEn: 'Six-fold planetary strength & 12 house virupas with Ishta/Kashta phala',
    categoryHi: 'ग्रहीय बल व गणनाएं',
    categoryEn: 'Planetary Strengths',
    keywords: ['shadbala', 'bhavabala', 'virupa', 'ishta', 'kashta', 'षड्बल', 'भावबल'],
    targetView: 'calculations',
    iconType: 'zap',
  },
  {
    id: 'ashtakavarga-shodhana',
    titleHi: 'अष्टकवर्ग, त्रिकोण-एकाधिपत्य शोधन व पिंड',
    titleEn: 'Ashtakavarga, Shodhanas & Shodhya Pinda',
    descriptionHi: 'भिन्नाष्टकवर्ग, सर्वाष्टकवर्ग (३३७ बिंदु), शोधन एवं कक्ष्य गोचर',
    descriptionEn: 'BAV, SAV (337 bindus), reductions, and kakshya transits',
    categoryHi: 'ग्रहीय बल व गणनाएं',
    categoryEn: 'Planetary Strengths',
    keywords: ['ashtakavarga', 'bav', 'sav', 'shodhana', 'kakshya', 'अष्टकवर्ग'],
    targetView: 'calculations',
    iconType: 'chart',
  },
  {
    id: 'dual-transit-wheel',
    titleHi: 'द्वि-चक्र गोचर (Dual Transit Wheel)',
    titleEn: 'Dual Transit Wheel (Natal + Gochar)',
    descriptionHi: 'जन्म कुंडली और वर्तमान गोचर का परस्पर ग्रहीय संचरण चक्र',
    descriptionEn: 'Interactive dual wheel synchronizing natal chart with live transits',
    categoryHi: 'गोचर एवं संचरण',
    categoryEn: 'Transits & Gochar',
    keywords: ['gochar', 'transit', 'wheel', 'dual transit', 'गोचर'],
    targetView: 'dual-transit',
    iconType: 'compass',
  },
  {
    id: 'sade-sati',
    titleHi: 'शनि साढ़े साती एवं ढैया संपूर्ण विश्लेषण',
    titleEn: 'Shani Sade Sati & Dhaiya Engine',
    descriptionHi: 'साढ़े साती के तीनों चरण, चांदी/सोना/तांबा/लोहा पाया एवं शास्त्रीय उपाय',
    descriptionEn: 'Saturn 7.5 year cycle across 3 phases with Paya and classical upayas',
    categoryHi: 'गोचर एवं संचरण',
    categoryEn: 'Transits & Gochar',
    keywords: ['sade sati', 'shani', 'saturn', 'dhaiya', 'साढ़े साती', 'शनि'],
    targetView: 'sade-sati',
    iconType: 'shield',
  },

  // 5. Specialized Systems
  {
    id: 'kp-enterprise',
    titleHi: 'केपी नक्षत्र ज्योतिष (KP Enterprise & CIL)',
    titleEn: 'KP Enterprise & Cuspal Interlinks (CIL)',
    descriptionHi: 'प्लेसिडस भाव, २४९ उप-स्वामी, २१९३ CIL कस्पल इंटरलिंक्स एवं रूलिंग प्लैनेट्स',
    descriptionEn: 'Placidus cusps, 249 sub-lords, 2193 CIL interlinks & ruling planets',
    categoryHi: 'विशिष्ट शाखाएं',
    categoryEn: 'Specialized Systems',
    keywords: ['kp', 'krishnamurti', 'sub lord', 'cil', 'cuspal interlinks', 'केपी'],
    targetView: 'kp-enterprise',
    iconType: 'zap',
  },
  {
    id: 'lal-kitab',
    titleHi: 'लाल किताब संपूर्ण (ऋणानुबंध, सोया घर व उपाय)',
    titleEn: 'Lal Kitab Full System & Varshphal',
    descriptionHi: 'मेष लग्न की स्थिर कुंडलियां, पितृ ऋण, अंधे/धर्मी तेवे एवं अचूक उपाय',
    descriptionEn: 'Aries-fixed houses, debts (rinas), blind teva, and classical upayas',
    categoryHi: 'विशिष्ट शाखाएं',
    categoryEn: 'Specialized Systems',
    keywords: ['lal kitab', 'varshphal', 'remedies', 'debts', 'लाल किताब'],
    targetView: 'lal-kitab',
    iconType: 'book',
  },
  {
    id: 'tajaka-varshaphala',
    titleHi: 'ताजिक वर्षफल एवं ५० शास्त्रीय सहम',
    titleEn: 'Tajaka Varshaphala & 50 Sahams',
    descriptionHi: 'सूर्य का वर्ष प्रवेश, मुंथा, वर्षेण, १६ ताजिक योग एवं ५० सहम',
    descriptionEn: 'Solar return chart, Muntha, Varsheshwara, 16 yogas & 50 Sahams',
    categoryHi: 'विशिष्ट शाखाएं',
    categoryEn: 'Specialized Systems',
    keywords: ['varshaphala', 'tajaka', 'solar return', 'muntha', 'sahams', 'वर्षफल'],
    targetView: 'varshaphala',
    iconType: 'calendar',
  },
  {
    id: 'medical-astrology',
    titleHi: 'रोग व चिकित्सा ज्योतिष (Medical Astrology & Tridosha)',
    titleEn: 'Medical Astrology & Ayurvedic Tridosha',
    descriptionHi: 'वात-पित्त-कफ त्रिदोष संतुलन, ६/८/१२ भाव, २२वां द्रेष्काण व ६४वां नवमांश',
    descriptionEn: 'Ayurvedic Tridosha balance, Trika houses, 22nd Drekkana & 64th Navamsha',
    categoryHi: 'विशिष्ट शाखाएं',
    categoryEn: 'Specialized Systems',
    keywords: ['medical', 'health', 'disease', 'tridosha', 'ayurveda', 'रोग', 'स्वास्थ्य'],
    targetView: 'medical-astrology',
    iconType: 'shield',
  },
  {
    id: 'interactive-palmistry',
    titleHi: 'हस्तरेखा एवं सामुद्रिक शास्त्र (Interactive Palmistry)',
    titleEn: 'Interactive Palmistry & Samudrika Shastra',
    descriptionHi: 'जीवन, मस्तिष्क, हृदय व भाग्य रेखा का सचित्र विश्लेषण एवं पर्वत परीक्षण',
    descriptionEn: 'Interactive SVG hand scanner, major lines, and planetary mounts',
    categoryHi: 'विशिष्ट शाखाएं',
    categoryEn: 'Specialized Systems',
    keywords: ['palmistry', 'hand reading', 'hastre纳入', 'lines', 'mounts', 'हस्तरेखा'],
    targetView: 'interactive-palmistry',
    iconType: 'compass',
  },
  {
    id: 'numerology',
    titleHi: 'प्रामाणिक अंकज्योतिष (मूलांक, भाग्यांक व नामांक)',
    titleEn: 'Numerology (Mulank, Bhagyank & Chaldean)',
    descriptionHi: 'चालडियन व पाइथागोरियन नामांक, मूलांक, भाग्यांक एवं शुभ तिथियां',
    descriptionEn: 'Chaldean & Pythagorean name vibration, driver, and destiny numbers',
    categoryHi: 'विशिष्ट शाखाएं',
    categoryEn: 'Specialized Systems',
    keywords: ['numerology', 'mulank', 'bhagyank', 'chaldean', 'name number', 'अंकज्योतिष'],
    targetView: 'numerology',
    iconType: 'zap',
  },
  {
    id: 'daily-panchanga',
    titleHi: 'दैनिक वैदिक पंचांग एवं शुभ-अशुभ मुहूर्त',
    titleEn: 'Daily Drik Panchang & Muhurta',
    descriptionHi: 'तिथि, वार, नक्षत्र, योग, करण, चौघड़िया, होरा, राहुकाल एवं अभिजीत मुहूर्त',
    descriptionEn: 'Tithi, Vara, Nakshatra, Yoga, Karana, Choghadiya & Rahu Kalam',
    categoryHi: 'पंचांग व मुहूर्त',
    categoryEn: 'Panchang & Muhurta',
    keywords: ['panchang', 'tithi', 'choghadiya', 'rahu kalam', 'muhurta', 'पंचांग', 'चौघड़िया'],
    targetView: 'daily-panchanga',
    iconType: 'calendar',
  },
  {
    id: 'prasna-marga',
    titleHi: 'प्रश्न मार्ग एवं दैवज्ञ वल्लभ (Horary Astrology)',
    titleEn: 'Prasna Marga & Horary Workstation',
    descriptionHi: 'तात्कालिक प्रश्न कुंडली, आरूढ़, उदयारूढ़ एवं कार्य सिद्धि योग',
    descriptionEn: 'Instant horary chart, Arudha, and classical query fulfillment yogas',
    categoryHi: 'पंचांग व मुहूर्त',
    categoryEn: 'Panchang & Muhurta',
    keywords: ['prashna', 'horary', 'prasna marga', 'query', 'प्रश्न'],
    targetView: 'prasna-marga',
    iconType: 'compass',
  },
  {
    id: 'life-dossier',
    titleHi: 'संपूर्ण जीवन वृतांत एवं १०१ आयाम (Life Dossier)',
    titleEn: 'Comprehensive Life Dossier & 101 Dimensions',
    descriptionHi: 'शिक्षा, वित्त, करियर, स्वास्थ्य, विवाह एवं आध्यात्मिक यात्रा का महा-दस्तावेज़',
    descriptionEn: 'Complete life dossier covering education, wealth, career & relationships',
    categoryHi: 'भविष्यफल एवं रिपोर्ट',
    categoryEn: 'Predictions & Reports',
    keywords: ['dossier', 'predictions', 'life report', '101 dimensions', 'भविष्यफल'],
    targetView: 'life-dossier',
    iconType: 'book',
  },
  {
    id: 'holistic-remedies',
    titleHi: 'शास्त्रीय वैदिक उपाय, रुद्राक्ष एवं रत्न परामर्श',
    titleEn: 'Holistic Vedic Remedies, Gemstones & Rudraksha',
    descriptionHi: 'ग्रह शांति मंत्र, स्तोत्र, दान, अनुकूल रत्न एवं रुद्राक्ष चयन',
    descriptionEn: 'Classical planetary mantras, stotras, auspicious gemstones & rudraksha',
    categoryHi: 'भविष्यफल एवं रिपोर्ट',
    categoryEn: 'Predictions & Reports',
    keywords: ['remedies', 'gemstones', 'rudraksha', 'mantra', 'upaya', 'उपाय', 'रत्न'],
    targetView: 'holistic-remedies',
    iconType: 'shield',
  },
  {
    id: 'ayurdaya-longevity',
    titleHi: 'शास्त्रीय आयुर्दाय वर्ग निर्णय (जैमिनी त्रिक सूत्र)',
    titleEn: 'Classical Ayurdaya Span (Jaimini 3-Pair Rule)',
    descriptionHi: 'अल्पायु, मध्यायु, दीर्घायु वर्ग निर्णय एवं महामृत्युंजय रक्षा कवच',
    descriptionEn: 'Longevity span class determination & Maha Mrityunjaya protection',
    categoryHi: 'भविष्यफल एवं रिपोर्ट',
    categoryEn: 'Predictions & Reports',
    keywords: ['ayurdaya', 'longevity', 'maraka', 'protection', 'mrityunjaya', 'आयुर्दाय'],
    targetView: 'fortune-calculators',
    subTab: 'ayurdaya_class',
    iconType: 'shield',
  },
];

interface GlobalCommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (viewId: string, subTab?: string) => void;
}

export const GlobalCommandPaletteModal: React.FC<GlobalCommandPaletteModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Global keydown listeners for Escape and Arrows
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Filter items matching query
  const filteredItems = useMemo(() => {
    if (!query.trim()) {
      return COMMAND_REGISTRY.slice(0, 14); // Popular initial suggestions
    }

    const cleanQuery = query.toLowerCase().trim();
    return COMMAND_REGISTRY.filter((item) => {
      const matchTitle =
        item.titleHi.toLowerCase().includes(cleanQuery) ||
        item.titleEn.toLowerCase().includes(cleanQuery);
      const matchDesc =
        item.descriptionHi.toLowerCase().includes(cleanQuery) ||
        item.descriptionEn.toLowerCase().includes(cleanQuery);
      const matchCat =
        item.categoryHi.toLowerCase().includes(cleanQuery) ||
        item.categoryEn.toLowerCase().includes(cleanQuery);
      const matchKeywords = item.keywords.some((k) => k.toLowerCase().includes(cleanQuery));

      return matchTitle || matchDesc || matchCat || matchKeywords;
    });
  }, [query]);

  // Reset selected index when filtered list changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredItems.length]);

  const handleSelect = (item: CommandPaletteItem) => {
    onNavigate(item.targetView, item.subTab);
    onClose();
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredItems.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex]);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '60px',
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '92%',
          maxWidth: '680px',
          background: '#ffffff',
          borderRadius: '14px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
          border: '1px solid #cbd5e1',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '80vh',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '14px 18px',
            borderBottom: '1px solid #e2e8f0',
            background: '#f8fafc',
            gap: '10px',
          }}
        >
          <Search size={20} color="#64748b" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder={
              isHi
                ? 'किसी भी विषय, कुंडली, गणना या टूल को खोजें (उदा: लव कैलकुलेटर, D9, नवमांश, केपी, गोचर)...'
                : 'Search any chart, technique, or tool (e.g., Love Calculator, D9, KP, Transits)...'
            }
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              fontSize: '15px',
              outline: 'none',
              color: '#0f172a',
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
            >
              <X size={16} />
            </button>
          )}
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '6px',
              background: '#e2e8f0',
              color: '#475569',
            }}
          >
            ESC
          </span>
        </div>

        {/* Results List */}
        <div
          ref={listRef}
          style={{
            overflowY: 'auto',
            padding: '8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}
        >
          {filteredItems.length === 0 ? (
            <div style={{ padding: '32px 16px', textAlign: 'center', color: '#64748b' }}>
              <Compass size={32} color="#94a3b8" style={{ margin: '0 auto 10px auto' }} />
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#334155' }}>
                {isHi ? 'कोई मेल नहीं मिला' : 'No matching tools found'}
              </div>
              <div style={{ fontSize: '12px', marginTop: '4px' }}>
                {isHi
                  ? 'कृपया दूसरा शब्द खोजें (उदा: कुंडली, लव, विवाह, गोचर, केपी, दशा, लाल किताब)'
                  : 'Try searching for kundali, love, marriage, transits, kp, dasha, or remedies.'}
              </div>
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    background: isSelected ? '#eff6ff' : 'transparent',
                    border: isSelected ? '1px solid #bfdbfe' : '1px solid transparent',
                    transition: 'all 0.1s ease',
                  }}
                >
                  <div
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: isSelected ? '#3b82f6' : '#f1f5f9',
                      color: isSelected ? '#ffffff' : '#475569',
                      flexShrink: 0,
                    }}
                  >
                    {item.iconType === 'heart' && <Heart size={16} />}
                    {item.iconType === 'calendar' && <Calendar size={16} />}
                    {item.iconType === 'star' && <Star size={16} />}
                    {item.iconType === 'users' && <Users size={16} />}
                    {item.iconType === 'zap' && <Zap size={16} />}
                    {item.iconType === 'shield' && <Shield size={16} />}
                    {item.iconType === 'book' && <BookOpen size={16} />}
                    {item.iconType === 'compass' && <Compass size={16} />}
                    {item.iconType === 'chart' && <Sparkles size={16} />}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          fontWeight: 700,
                          fontSize: '14px',
                          color: isSelected ? '#1e40af' : '#0f172a',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {isHi ? item.titleHi : item.titleEn}
                      </span>
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          padding: '1px 6px',
                          borderRadius: '4px',
                          background: isSelected ? '#dbeafe' : '#f1f5f9',
                          color: isSelected ? '#1d4ed8' : '#64748b',
                        }}
                      >
                        {isHi ? item.categoryHi : item.categoryEn}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: isSelected ? '#3b82f6' : '#64748b',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        marginTop: '2px',
                      }}
                    >
                      {isHi ? item.descriptionHi : item.descriptionEn}
                    </div>
                  </div>

                  <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>
                    {isSelected ? (isHi ? 'खोलें ↵' : 'Open ↵') : ''}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div
          style={{
            padding: '10px 16px',
            background: '#f8fafc',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '11px',
            color: '#64748b',
          }}
        >
          <div style={{ display: 'flex', gap: '12px' }}>
            <span>
              <kbd style={{ background: '#e2e8f0', padding: '1px 4px', borderRadius: '3px' }}>↑</kbd>{' '}
              <kbd style={{ background: '#e2e8f0', padding: '1px 4px', borderRadius: '3px' }}>↓</kbd>{' '}
              {isHi ? 'नेविगेट' : 'Navigate'}
            </span>
            <span>
              <kbd style={{ background: '#e2e8f0', padding: '1px 4px', borderRadius: '3px' }}>↵</kbd>{' '}
              {isHi ? 'चुनें' : 'Select'}
            </span>
            <span>
              <kbd style={{ background: '#e2e8f0', padding: '1px 4px', borderRadius: '3px' }}>ESC</kbd>{' '}
              {isHi ? 'बंद करें' : 'Close'}
            </span>
          </div>
          <div>
            {isHi ? 'त्वरित सर्च बार' : 'Quick Jump Palette'}
          </div>
        </div>
      </div>
    </div>
  );
};
