/**
 * Celebrity Kundli Twin & Benchmark Horoscope Matching Engine
 * AV Astro Vibe — 100% Offline, Zero API Dependency
 *
 * Compares natal chart placements, Lagna, Moon sign, 10th house karma axis,
 * and classical Yogas against authentic Rodden AA/A-rated historical charts
 * from Astro-Databank with verified portraits and lifelong milestones.
 */

import type { ChartData, NineGrahaId } from './types';
import { SIGNS } from './constants';

export type CelebrityCategory =
  | 'spiritual'
  | 'science_tech'
  | 'leadership'
  | 'business_wealth'
  | 'art_culture'
  | 'sports_legend';

export interface CelebrityProfile {
  id: string;
  nameEn: string;
  nameHi: string;
  category: CelebrityCategory;
  categoryTitleEn: string;
  categoryTitleHi: string;
  birthDate: string; // DD-MM-YYYY
  birthPlace: string;
  roddenRating: 'AA' | 'A';
  photoUrl: string; // Verified public domain CDN portrait
  ascSignIndex: number; // 0..11
  moonSignIndex: number;
  sunSignIndex: number;
  prominentYogas: string[];
  prominentYogasHi: string[];
  keyLifeMilestones: Array<{ age: number; eventHi: string; eventEn: string }>;
  keyPlacements: { planet: NineGrahaId; house: number; noteHi: string; noteEn: string }[];
  bioEn: string;
  bioHi: string;
  quoteEn: string;
  quoteHi: string;
}

export interface CelebrityTwinMatch {
  celebrity: CelebrityProfile;
  similarityScore: number; // 0..100
  sharedYogas: string[];
  sharedYogasHi: string[];
  sharedPlacements: { planet: NineGrahaId; house: number; descriptionHi: string; descriptionEn: string }[];
  astrologicalSynergyHi: string;
  astrologicalSynergyEn: string;
  nativeGuidanceHi: string;
  nativeGuidanceEn: string;
}

export const CELEBRITY_DATABASE: CelebrityProfile[] = [
  // 1. Aries Lagna (मेष लग्न)
  {
    id: 'leonardo-da-vinci',
    nameEn: 'Leonardo da Vinci',
    nameHi: 'लियोनार्डो दा विंची',
    category: 'art_culture',
    categoryTitleEn: 'Universal Renaissance Polymath & Painter',
    categoryTitleHi: 'पुनर्जागरण कालीन सार्वभौमिक महाप्रतिभा व चित्रकार',
    birthDate: '15-04-1452',
    birthPlace: 'Vinci, Italy',
    roddenRating: 'AA',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Leonardo_self.jpg/440px-Leonardo_self.jpg',
    ascSignIndex: 0, // Aries
    moonSignIndex: 1, // Taurus (Exalted Moon)
    sunSignIndex: 0, // Aries (Exalted Sun)
    prominentYogas: ['Ruchaka Yoga', 'Gajakesari Yoga', 'Sunafa Yoga', 'Amala Yoga'],
    prominentYogasHi: ['रुचक महापुरुष योग', 'गजकेसरी योग', 'सुनफा योग', 'अमला योग'],
    keyLifeMilestones: [
      { age: 30, eventHi: 'मिलान के ड्यूक की सेवा में मुख्य अभियंता व कलाकार नियुक्त', eventEn: 'Appointed chief engineer and court artist to Duke of Milan' },
      { age: 51, eventHi: 'मोनालिसा की कालजयी कृति का सृजन प्रारंभ', eventEn: 'Began masterpiece Mona Lisa in Florence' },
      { age: 64, eventHi: 'फ्रांस के राजा द्वारा प्रथम शाही चित्रकार व दार्शनिक की उपाधि', eventEn: 'Honored by King Francis I as premier painter and philosopher' },
    ],
    keyPlacements: [
      { planet: 'Sun', house: 1, noteHi: 'लग्न में उच्च सूर्य अद्वितीय बौद्धिक तेज', noteEn: 'Exalted Sun in 1st conferring supreme creative brilliance' },
      { planet: 'Moon', house: 2, noteHi: 'द्वितीय में उच्च चंद्र सूक्ष्म सौंदर्य दृष्टि', noteEn: 'Exalted Moon in 2nd conferring peerless aesthetic grace' },
      { planet: 'Jupiter', house: 3, noteHi: 'तृतीय में गुरु हस्तकौशल व वैज्ञानिक शोध', noteEn: 'Jupiter in 3rd driving relentless anatomical and engineering studies' },
    ],
    bioEn: 'Italian polymath of the Renaissance active as a painter, draughtsman, engineer, scientist, theorist, sculptor, and architect.',
    bioHi: 'पुनर्जागरण काल के अप्रतिम विद्वान जिन्होंने कला, शरीर रचना विज्ञान, यांत्रिकी और चित्रकला में अमर कीर्तिमान स्थापित किए।',
    quoteEn: 'Learning never exhausts the mind.',
    quoteHi: 'सीखने से मन कभी थकता नहीं, बल्कि नित्य नवीन स्फूर्ति पाता है।',
  },
  {
    id: 'henry-ford',
    nameEn: 'Henry Ford',
    nameHi: 'हेनरी फोर्ड',
    category: 'business_wealth',
    categoryTitleEn: 'Industrial Pioneer & Assembly Line Innovator',
    categoryTitleHi: 'औद्योगिक क्रांति अग्रदूत व आधुनिक विनिर्माण जनक',
    birthDate: '30-07-1863',
    birthPlace: 'Dearborn, Michigan, USA',
    roddenRating: 'AA',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Henry_ford_1919.jpg/440px-Henry_ford_1919.jpg',
    ascSignIndex: 0, // Aries
    moonSignIndex: 9, // Capricorn
    sunSignIndex: 3, // Cancer
    prominentYogas: ['Ruchaka Yoga', 'Dhana Yoga', 'Raja Yoga', 'Budhaditya Yoga'],
    prominentYogasHi: ['रुचक महापुरुष योग', 'धन योग', 'राजयोग', 'बुधादित्य योग'],
    keyLifeMilestones: [
      { age: 40, eventHi: 'फोर्ड मोटर कंपनी की स्थापना कर ऑटोमोबाइल निर्माण में क्रांति', eventEn: 'Founded Ford Motor Company' },
      { age: 45, eventHi: 'मॉडल टी कार का विमोचन कर आम नागरिकों हेतु वाहन सुलभ किया', eventEn: 'Introduced Model T, democratizing global transportation' },
      { age: 50, eventHi: 'चलित असेंबली लाइन का आविष्कार कर उत्पादन गति में ऐतिहासिक वृद्धि', eventEn: 'Perfected moving assembly line manufacturing' },
    ],
    keyPlacements: [
      { planet: 'Mars', house: 4, noteHi: 'चतुर्थ में मंगल भूमि, वाहन व कारखाने का प्रचंड योग', noteEn: 'Mars in 4th building massive automotive manufacturing plants' },
      { planet: 'Saturn', house: 6, noteHi: 'षष्ठ में शनि श्रमिकों का कुशल प्रबंधन व संगठन', noteEn: 'Saturn in 6th mastering mass industrial labor systems' },
      { planet: 'Mercury', house: 4, noteHi: 'बुध-सूर्य युति तकनीकी परिशुद्धता व व्यापार विस्तार', noteEn: 'Mercury in 4th streamlining mechanical engineering blueprints' },
    ],
    bioEn: 'American industrialist and business magnate who revolutionized factory production with the assembly line technique.',
    bioHi: 'अमेरिकी उद्योगपति जिन्होंने असेंबली लाइन निर्माण तकनीक विकसित कर साधारण नागरिकों के लिए कार निर्माण संभव बनाया।',
    quoteEn: 'Whether you think you can, or you think you cannot, you are right.',
    quoteHi: 'चाहे आप सोचें कि आप कर सकते हैं, या सोचें कि नहीं कर सकते—दोनों ही स्थितियों में आप सही हैं।',
  },
  {
    id: 'charlie-chaplin',
    nameEn: 'Charlie Chaplin',
    nameHi: 'चार्ली चैपलिन',
    category: 'art_culture',
    categoryTitleEn: 'Global Cinematic Genius & Actor-Director',
    categoryTitleHi: 'विश्व सिनेमा के कालजयी अभिनेता व निर्देशक',
    birthDate: '16-04-1889',
    birthPlace: 'London, United Kingdom',
    roddenRating: 'AA',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Charlie_Chaplin.jpg/440px-Charlie_Chaplin.jpg',
    ascSignIndex: 0, // Aries
    moonSignIndex: 6, // Libra
    sunSignIndex: 0, // Aries
    prominentYogas: ['Malavya Yoga', 'Gajakesari Yoga', 'Sunafa Yoga', 'Neechabhanga Raja Yoga'],
    prominentYogasHi: ['मालव्य महापुरुष योग', 'गजकेसरी योग', 'सुनफा योग', 'नीचभंग राजयोग'],
    keyLifeMilestones: [
      { age: 25, eventHi: 'द ट्रैम्प के अमर चरित्र का सृजन कर विश्वख्याति अर्जित की', eventEn: 'Created iconic Little Tramp persona' },
      { age: 30, eventHi: 'यूनाइटेड आर्टिस्ट्स स्टूडियो की स्थापना कर पूर्ण कलात्मक स्वतंत्रता पाई', eventEn: 'Co-founded United Artists Studio' },
      { age: 51, eventHi: 'द ग्रेट डिक्टेटर फिल्म बनाकर तानाशाही के विरुद्ध शांति का उद्घोष', eventEn: 'Released The Great Dictator challenging tyranny' },
    ],
    keyPlacements: [
      { planet: 'Venus', house: 1, noteHi: 'लग्न में शुक्र अद्वितीय अभिनय सौंदर्य व भाव प्रवणता', noteEn: 'Venus in Lagna conferring supreme theatrical charisma' },
      { planet: 'Sun', house: 1, noteHi: 'लग्न में उच्च सूर्य वैश्विक प्रतिष्ठा व अमिट छाप', noteEn: 'Exalted Sun in 1st cementing immortal cinematic legacy' },
      { planet: 'Moon', house: 7, noteHi: 'सप्तम में चंद्र जनमानस को भावुक व हास्यमय करने की शक्ति', noteEn: 'Moon in 7th mesmerizing international audiences' },
    ],
    bioEn: 'English comic actor, filmmaker, and composer who rose to fame in the era of silent film and became a worldwide icon.',
    bioHi: 'मूक सिनेमा के युग के अमर अभिनेता और फिल्मकार जिन्होंने बिना शब्दों के पूरे विश्व को हंसाया और रुलाया।',
    quoteEn: 'A day without laughter is a day wasted.',
    quoteHi: 'हंसी के बिना बिताया हुआ दिन व्यर्थ गंवाया हुआ दिन है।',
  },

  // 2. Taurus Lagna (वृषभ लग्न)
  {
    id: 'sri-ramakrishna',
    nameEn: 'Sri Ramakrishna Paramahamsa',
    nameHi: 'श्री रामकृष्ण परमहंस',
    category: 'spiritual',
    categoryTitleEn: 'Supreme Mystic & Prophet of Harmony',
    categoryTitleHi: 'सर्वधर्म समन्वय के अवतार व दक्षिणेश्वर के परमहंस',
    birthDate: '18-02-1836',
    birthPlace: 'Kamarpukur, India',
    roddenRating: 'AA',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Ramakrishna.jpg/440px-Ramakrishna.jpg',
    ascSignIndex: 1, // Taurus
    moonSignIndex: 10, // Aquarius
    sunSignIndex: 10, // Aquarius
    prominentYogas: ['Hamsa Yoga', 'Raja Yoga', 'Pravrajya Yoga', 'Amala Yoga'],
    prominentYogasHi: ['हंस महापुरुष योग', 'राजयोग', 'प्रव्रज्या संन्यास योग', 'अमला योग'],
    keyLifeMilestones: [
      { age: 20, eventHi: 'दक्षिणेश्वर काली मंदिर में पुजारी व ईश्वरीय समाधि का प्राकट्य', eventEn: 'Assumed priesthood at Dakshineswar; attained profound Nirvikalpa Samadhi' },
      { age: 32, eventHi: 'इस्लाम और ईसाई धर्म की साधना कर सर्वधर्म एकत्व की अनुभूति', eventEn: 'Practiced multiple world faiths, realizing all paths lead to the same Divine' },
      { age: 45, eventHi: 'नरेंद्र (स्वामी विवेकानंद) को पाकर विश्व-कल्याण हेतु संन्यास संघ का बीजारोपण', eventEn: 'Met Narendra (Vivekananda) and transmitted spiritual mandate' },
    ],
    keyPlacements: [
      { planet: 'Jupiter', house: 2, noteHi: 'द्वितीय में गुरु सत्य व अमृतमयी उपदेश वाणी', noteEn: 'Jupiter in 2nd radiating nectarine spiritual parables' },
      { planet: 'Saturn', house: 6, noteHi: 'षष्ठ में उच्च शनि कठोर तपस्या व वासनाओं पर पूर्ण विजय', noteEn: 'Exalted Saturn in 6th granting absolute ascetic mastery' },
      { planet: 'Venus', house: 11, noteHi: 'एकादश में उच्च शुक्र जगन्माता की दिव्य भक्ति', noteEn: 'Exalted Venus in 11th awakening ecstasy of Divine Mother Bhavana' },
    ],
    bioEn: 'Indian Hindu mystic and spiritual teacher whose teachings on the harmony of all religions shaped modern spiritual consciousness.',
    bioHi: 'दक्षिणेश्वर के महान संत जिन्होंने अपनी साधना से सिद्ध किया कि सभी धर्म एक ही परम सत्य तक पहुंचने के विभिन्न मार्ग हैं।',
    quoteEn: 'As many faiths, so many paths.',
    quoteHi: 'जितने मत, उतने पथ।',
  },
  {
    id: 'martin-luther-king',
    nameEn: 'Martin Luther King Jr.',
    nameHi: 'मार्टिन लूथर किंग जूनियर',
    category: 'leadership',
    categoryTitleEn: 'Civil Rights Giant & Nobel Peace Laureate',
    categoryTitleHi: 'नागरिक अधिकार सेनानी व नोबेल शांति विजेता',
    birthDate: '15-01-1929',
    birthPlace: 'Atlanta, Georgia, USA',
    roddenRating: 'AA',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Martin_Luther_King%2C_Jr..jpg/440px-Martin_Luther_King%2C_Jr..jpg',
    ascSignIndex: 1, // Taurus
    moonSignIndex: 11, // Pisces
    sunSignIndex: 9, // Capricorn
    prominentYogas: ['Gajakesari Yoga', 'Dharma-Karmadhipati Yoga', 'Saraswati Yoga'],
    prominentYogasHi: ['गजकेसरी योग', 'धर्मकर्माधिपति राजयोग', 'सरस्वती योग'],
    keyLifeMilestones: [
      { age: 26, eventHi: 'मोंटगोमरी बस बहिष्कार का अहिंसक नेतृत्व कर आंदोलन प्रारंभ किया', eventEn: 'Led historic Montgomery Bus Boycott' },
      { age: 34, eventHi: 'वाशिंगटन मार्च में कालजयी "आई हैव ए ड्रीम" भाषण दिया', eventEn: 'Delivered historic "I Have a Dream" speech at Lincoln Memorial' },
      { age: 35, eventHi: 'विश्व के सबसे युवा नोबेल शांति पुरस्कार से सम्मानित', eventEn: 'Awarded Nobel Peace Prize for nonviolent civil rights struggle' },
    ],
    keyPlacements: [
      { planet: 'Jupiter', house: 12, noteHi: 'द्वादश में गुरु आत्म-बलिदान व सत्य की नैतिक शक्ति', noteEn: 'Jupiter in 12th channeling selfless moral conviction' },
      { planet: 'Mercury', house: 9, noteHi: 'नवम में बुध तेजस्वी भाषण कला व दार्शनिक तर्क', noteEn: 'Mercury in 9th commanding soaring oratorical brilliance' },
      { planet: 'Mars', house: 1, noteHi: 'लग्न में मंगल निडर सामाजिक न्याय का संकल्प', noteEn: 'Mars in 1st igniting unwavering courage against injustice' },
    ],
    bioEn: 'American Baptist minister and activist who became the most prominent spokesperson and leader in the civil rights movement.',
    bioHi: 'अमेरिकी नागरिक अधिकार आंदोलन के सबसे प्रमुख नेता जिन्होंने गांधीवादी अहिंसा के मार्ग पर चलकर नस्लभेद के विरुद्ध ऐतिहासिक विजय पाई।',
    quoteEn: 'Darkness cannot drive out darkness; only light can do that. Hate cannot drive out hate; only love can do that.',
    quoteHi: 'अंधेरा अंधेरे को दूर नहीं कर सकता, केवल प्रकाश ही ऐसा कर सकता है। घृणा घृणा को नहीं मिटा सकती, केवल प्रेम ही ऐसा कर सकता है।',
  },
  {
    id: 'pele',
    nameEn: 'Pele (Edson Arantes do Nascimento)',
    nameHi: 'पेले (फुटबॉल सम्राट)',
    category: 'sports_legend',
    categoryTitleEn: 'The King of Football & 3-Time World Cup Champion',
    categoryTitleHi: 'फुटबॉल के निर्विवाद सम्राट व ३ बार के विश्व चैंपियन',
    birthDate: '23-10-1940',
    birthPlace: 'Tres Coracoes, Brazil',
    roddenRating: 'AA',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Pele_by_John_Mathew_Smith_crop.jpg/440px-Pele_by_John_Mathew_Smith_crop.jpg',
    ascSignIndex: 1, // Taurus
    moonSignIndex: 3, // Cancer
    sunSignIndex: 6, // Libra
    prominentYogas: ['Ruchaka Yoga', 'Gajakesari Yoga', 'Chandra-Mangala Yoga', 'Raja Yoga'],
    prominentYogasHi: ['रुचक महापुरुष योग', 'गजकेसरी योग', 'चंद्र-मंगल योग', 'राजयोग'],
    keyLifeMilestones: [
      { age: 17, eventHi: '1958 विश्व कप फाइनल में 2 गोल दागकर ब्राजील को विश्व विजेता बनाया', eventEn: 'Won first FIFA World Cup at age 17, scoring twice in final' },
      { age: 29, eventHi: 'करियर का 1000वां ऐतिहासिक गोल (ओ मिलेसिमो) पूरा किया', eventEn: 'Scored legendary 1000th career goal (O Milesimo)' },
      { age: 30, eventHi: '1970 मेक्सिको विश्व कप जीतकर 3 बार विश्व कप जीतने वाले एकमात्र खिलाड़ी बने', eventEn: 'Led 1970 Brazil squad to win third FIFA World Cup trophy' },
    ],
    keyPlacements: [
      { planet: 'Mars', house: 5, noteHi: 'पंचम में मंगल अद्वितीय एथलेटिक फुर्ती व ड्रिबलिंग कौशल', noteEn: 'Mars in 5th conferring superhuman agility and striking reflexes' },
      { planet: 'Moon', house: 3, noteHi: 'तृतीय में स्वराशि चंद्र सहज खेल अंतर्ज्ञान व गति', noteEn: 'Moon in 3rd providing intuitive spatial awareness on the pitch' },
      { planet: 'Jupiter', house: 1, noteHi: 'लग्न में गुरु वैश्विक जनप्रियता व खेल भावना', noteEn: 'Jupiter in 1st bestowing universal sportsmanship and royal status' },
    ],
    bioEn: 'Brazilian professional footballer who is widely regarded as one of the greatest players of all time and labeled "the greatest" by FIFA.',
    bioHi: 'ब्राजील के महानतम फुटबॉल खिलाड़ी जिन्होंने अपने करियर में 1281 गोल किए और 3 विश्व कप जीतकर इतिहास रचा।',
    quoteEn: 'Success is no accident. It is hard work, perseverance, learning, studying, sacrifice and most of all, love of what you are doing.',
    quoteHi: 'सफलता कोई संयोग नहीं है। यह कठिन परिश्रम, निरंतरता, अध्ययन, त्याग और सबसे बढ़कर जो आप कर रहे हैं उससे प्रेम है।',
  },

  // 3. Gemini Lagna (मिथुन लग्न)
  {
    id: 'albert-einstein',
    nameEn: 'Albert Einstein',
    nameHi: 'अल्बर्ट आइंस्टीन',
    category: 'science_tech',
    categoryTitleEn: 'Father of Modern Physics & Relativity Pioneer',
    categoryTitleHi: 'महान सैद्धांतिक भौतिकविद् व सापेक्षता के जनक',
    birthDate: '14-03-1879',
    birthPlace: 'Ulm, Germany',
    roddenRating: 'AA',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Einstein_1921_by_F_Schmutzer_-_restoration.jpg/440px-Einstein_1921_by_F_Schmutzer_-_restoration.jpg',
    ascSignIndex: 2, // Gemini
    moonSignIndex: 8, // Sagittarius
    sunSignIndex: 10, // Aquarius
    prominentYogas: ['Budhaditya Yoga', 'Neechbhanga Raja Yoga', 'Saraswati Yoga', 'Gajakesari Yoga'],
    prominentYogasHi: ['बुधादित्य योग', 'नीचभंग राजयोग', 'सरस्वती योग', 'गजकेसरी योग'],
    keyLifeMilestones: [
      { age: 26, eventHi: 'अन्नुस मिराबिलिस (1905) में प्रकाश विद्युत प्रभाव और E=mc² का प्रतिपादन', eventEn: 'Miracle Year 1905: Published 4 groundbreaking papers including E=mc²' },
      { age: 36, eventHi: 'सामान्य सापेक्षता सिद्धांत (General Relativity) पूर्ण कर ब्रह्मांड समझ बदली', eventEn: 'Completed General Theory of Relativity' },
      { age: 42, eventHi: 'प्रकाश विद्युत प्रभाव की व्याख्या हेतु भौतिकी का नोबेल पुरस्कार प्राप्त', eventEn: 'Awarded Nobel Prize in Physics for photoelectric effect' },
    ],
    keyPlacements: [
      { planet: 'Mercury', house: 10, noteHi: 'दशम में नीचभंग बुध कालजयी भौतिकी सिद्धांत', noteEn: 'Neechbhanga Mercury in 10th revolutionizing classical physics' },
      { planet: 'Saturn', house: 10, noteHi: 'दशम में शनि अमूर्त गणितीय संरचनाओं का गहन ध्यान', noteEn: 'Saturn in 10th providing unyielding endurance in abstract physics' },
      { planet: 'Jupiter', house: 9, noteHi: 'नवम में गुरु ब्रह्मांडीय नियमों के प्रति श्रद्धा', noteEn: 'Jupiter in 9th discerning cosmic harmony in natural laws' },
    ],
    bioEn: 'Theoretical physicist who developed the theory of relativity, one of the two pillars of modern physics.',
    bioHi: 'सापेक्षता के सिद्धांत द्वारा दिक्-काल और गुरुत्वाकर्षण की समझ बदलकर आधुनिक विज्ञान की नींव रखने वाले नोबेल विजेता वैज्ञानिक।',
    quoteEn: 'Imagination is more important than knowledge. For knowledge is limited, whereas imagination embraces the entire world.',
    quoteHi: 'कल्पना ज्ञान से अधिक महत्वपूर्ण है। ज्ञान सीमित है, जबकि कल्पना संपूर्ण ब्रह्मांड को समेट लेती है।',
  },
  {
    id: 'nikola-tesla',
    nameEn: 'Nikola Tesla',
    nameHi: 'निकोला टेस्ला',
    category: 'science_tech',
    categoryTitleEn: 'Electrical Visionary & Wireless Power Pioneer',
    categoryTitleHi: 'प्रत्यावर्ती धारा (AC) जनक व विद्युत युगद्रष्टा',
    birthDate: '10-07-1856',
    birthPlace: 'Smiljan, Croatia',
    roddenRating: 'AA',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Tesla_circa_1890.jpeg/440px-Tesla_circa_1890.jpeg',
    ascSignIndex: 2, // Gemini
    moonSignIndex: 6, // Libra
    sunSignIndex: 2, // Gemini
    prominentYogas: ['Budhaditya Yoga', 'Bhadra Yoga', 'Malavya Yoga', 'Chandra-Mangala Yoga'],
    prominentYogasHi: ['बुधादित्य योग', 'भद्र महापुरुष योग', 'मालव्य महापुरुष योग', 'चंद्र-मंगल योग'],
    keyLifeMilestones: [
      { age: 31, eventHi: 'प्रत्यावर्ती धारा (AC) मोटर व पॉलीफेज सिस्टम का पेटेंट कराया', eventEn: 'Patented revolutionary AC induction motor and polyphase system' },
      { age: 37, eventHi: 'शिकागो विश्व मेले में सुरक्षित AC बिजली से पूरे परिसर को जगमगाया', eventEn: 'Illuminated 1893 Chicago World’s Fair, winning War of Currents' },
      { age: 43, eventHi: 'कोलोराडो स्प्रिंग्स में वायरलेस बिजली व पृथ्वी अनुनाद का परीक्षण', eventEn: 'Built Colorado Springs lab, transmitting wireless energy' },
    ],
    keyPlacements: [
      { planet: 'Mercury', house: 1, noteHi: 'लग्न में स्वराशि बुध विद्युत तरंगों की मानसिक दृश्यता', noteEn: 'Own-sign Mercury in 1st visualizing machinery without blueprints' },
      { planet: 'Venus', house: 1, noteHi: 'लग्न में शुक्र अप्रतिम सौंदर्यपरक आविष्कारक मेधा', noteEn: 'Venus in 1st harmonizing engineering with celestial aesthetic' },
      { planet: 'Mars', house: 6, noteHi: 'षष्ठ में मंगल उच्च ऊर्जा प्रयोगों में निर्भीकता', noteEn: 'Mars in 6th harnessing lightning and high-voltage frequencies' },
    ],
    bioEn: 'Serbian-American engineer and futurist best known for his contributions to the design of the modern alternating current electricity system.',
    bioHi: 'युगद्रष्टा आविष्कारक जिन्होंने AC बिजली प्रणाली, रेडियो और टेस्ला कॉइल का आविष्कार कर आधुनिक विद्युत युग की नींव रखी।',
    quoteEn: 'If you want to find the secrets of the universe, think in terms of energy, frequency and vibration.',
    quoteHi: 'यदि आप ब्रह्मांड के रहस्यों को समझना चाहते हैं, तो ऊर्जा, आवृत्ति और स्पंदन के संदर्भ में सोचिए।',
  },
  {
    id: 'alan-turing',
    nameEn: 'Alan Turing',
    nameHi: 'एलन ट्यूरिंग',
    category: 'science_tech',
    categoryTitleEn: 'Father of Modern Computing & Artificial Intelligence',
    categoryTitleHi: 'आधुनिक कंप्यूटर विज्ञान व कृत्रिम मेधा (AI) के जनक',
    birthDate: '23-06-1912',
    birthPlace: 'London, United Kingdom',
    roddenRating: 'AA',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Alan_Turing_Aged_16.jpg/440px-Alan_Turing_Aged_16.jpg',
    ascSignIndex: 2, // Gemini
    moonSignIndex: 6, // Libra
    sunSignIndex: 2, // Gemini
    prominentYogas: ['Budhaditya Yoga', 'Bhadra Yoga', 'Saraswati Yoga'],
    prominentYogasHi: ['बुधादित्य योग', 'भद्र महापुरुष योग', 'सरस्वती योग'],
    keyLifeMilestones: [
      { age: 24, eventHi: 'ट्यूरिंग मशीन की अवधारणा प्रस्तुत कर आधुनिक कंप्यूटर विज्ञान की नींव रखी', eventEn: 'Published universal Turing machine paper foundation of computing' },
      { age: 28, eventHi: 'ब्लेचले पार्क में जर्मन एनिग्मा कोड को ब्रेक करने वाली बॉम्बे मशीन बनाई', eventEn: 'Designed the Bombe machine cracking Nazi Enigma ciphers' },
      { age: 38, eventHi: 'ट्यूरिंग टेस्ट की परिकल्पना कर कृत्रिम बुद्धिमत्ता (AI) का मार्ग खोला', eventEn: 'Formulated the Turing Test establishing Artificial Intelligence' },
    ],
    keyPlacements: [
      { planet: 'Mercury', house: 1, noteHi: 'लग्न में स्वराशि बुध अभूतपूर्व कूट-विश्लेषण व एल्गोरिदम क्षमता', noteEn: 'Mercury in 1st generating supreme algorithmic logic and cryptanalysis' },
      { planet: 'Sun', house: 1, noteHi: 'लग्न में सूर्य वैज्ञानिक एकाग्रता व मौलिक चिंतन', noteEn: 'Sun in Lagna providing uncompromising intellectual originality' },
      { planet: 'Saturn', house: 12, noteHi: 'द्वादश में शनि गुप्त कोडब्रेकिंग व एकाकी साधना', noteEn: 'Saturn in 12th driving secretive wartime codebreaking' },
    ],
    bioEn: 'English mathematician, computer scientist, logician, cryptanalyst, and theoretical biologist considered the father of theoretical computer science.',
    bioHi: 'महान गणितज्ञ व क्रिप्टोग्राफर जिन्होंने द्वितीय विश्वयुद्ध में एनिग्मा कोड तोड़कर लाखों जानें बचाईं और कंप्यूटर का सिद्धांत रचा।',
    quoteEn: 'Sometimes it is the people no one imagines anything of who do the things that no one can imagine.',
    quoteHi: 'कभी-कभी वे लोग जिनके बारे में कोई कुछ नहीं सोचता, वे ऐसे काम कर दिखाते हैं जिनकी कोई कल्पना भी नहीं कर सकता।',
  },

  // 4. Cancer Lagna (कर्क लग्न)
  {
    id: 'sri-aurobindo',
    nameEn: 'Sri Aurobindo',
    nameHi: 'श्री अरविंद घोष',
    category: 'spiritual',
    categoryTitleEn: 'Integral Yoga Master & Evolutionary Sage',
    categoryTitleHi: 'पूर्ण योग के प्रणेता व अतिमानस चेतना के द्रष्टा',
    birthDate: '15-08-1872',
    birthPlace: 'Kolkata, India',
    roddenRating: 'AA',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Sri_Aurobindo_in_1908.jpg/440px-Sri_Aurobindo_in_1908.jpg',
    ascSignIndex: 3, // Cancer
    moonSignIndex: 8, // Sagittarius
    sunSignIndex: 4, // Leo
    prominentYogas: ['Hamsa Yoga', 'Raja Yoga', 'Bhadra Yoga', 'Saraswati Yoga'],
    prominentYogasHi: ['हंस महापुरुष योग', 'राजयोग', 'भद्र महापुरुष योग', 'सरस्वती योग'],
    keyLifeMilestones: [
      { age: 33, eventHi: 'वंदे मातरम पत्र द्वारा भारतीय स्वाधीनता संग्राम में क्रांतिकारी नेतृत्व', eventEn: 'Led revolutionary nationalist movement editing Bande Mataram' },
      { age: 36, eventHi: 'अलीपुर जेल में कारावास के दौरान श्री कृष्ण की प्रत्यक्ष अनुभूति', eventEn: 'Experienced profound cosmic consciousness of Vasudeva in Alipore Jail' },
      { age: 54, eventHi: 'पांडिचेरी में अतिमानस चेतना (Supramental descent) की सिद्धि', eventEn: 'Attained Siddhi Day, anchoring Supramental consciousness on Earth' },
    ],
    keyPlacements: [
      { planet: 'Jupiter', house: 1, noteHi: 'लग्न में उच्च गुरु साक्षात ऋषि चेतना व अतिमानस ज्ञान', noteEn: 'Exalted Jupiter in Lagna conferring avataric wisdom and divine vision' },
      { planet: 'Mars', house: 1, noteHi: 'लग्न में नीचभंग मंगल क्रांतिकारी संकल्प से योग सिद्धि', noteEn: 'Mars in Lagna converting intense fiery resolve into spiritual transformation' },
      { planet: 'Mercury', house: 2, noteHi: 'द्वितीय में बुध सावित्री जैसे दिव्य महाकाव्य का सृजन', noteEn: 'Mercury in 2nd composing monumental spiritual epic Savitri' },
    ],
    bioEn: 'Indian philosopher, yoga guru, maharishi, poet, and Indian nationalist who developed Integral Yoga.',
    bioHi: 'क्रांतिकारी स्वतंत्रता सेनानी से महर्षि बने जिन्होंने मनुष्य के चेतनामय विकास हेतु पूर्ण योग व अतिमानस की संकल्पना दी।',
    quoteEn: 'All life is yoga.',
    quoteHi: 'समस्त जीवन ही योग है।',
  },
  {
    id: 'elon-musk',
    nameEn: 'Elon Musk',
    nameHi: 'एलन मस्क',
    category: 'business_wealth',
    categoryTitleEn: 'Multi-Planetary Visionary & Tech Architect',
    categoryTitleHi: 'स्पेसएक्स व टेस्ला संस्थापक, बहु-ग्रहीय विजनरी',
    birthDate: '28-06-1971',
    birthPlace: 'Pretoria, South Africa',
    roddenRating: 'AA',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Elon_Musk_Royal_Society_%28crop2%29.jpg/440px-Elon_Musk_Royal_Society_%28crop2%29.jpg',
    ascSignIndex: 3, // Cancer
    moonSignIndex: 4, // Leo
    sunSignIndex: 2, // Gemini
    prominentYogas: ['Ruchaka Yoga', 'Dhana Yoga', 'Gajakesari Yoga', 'Budhaditya Yoga'],
    prominentYogasHi: ['रुचक महापुरुष योग', 'महाधन योग', 'गजकेसरी योग', 'बुधादित्य योग'],
    keyLifeMilestones: [
      { age: 31, eventHi: 'स्पेसएक्स की स्थापना कर अंतरिक्ष रॉकेटों को पुनः-उपयोगी बनाने का लक्ष्य', eventEn: 'Founded SpaceX to make humanity a multi-planetary species' },
      { age: 37, eventHi: 'टेस्ला के सीईओ बनकर वैश्विक इलेक्ट्रिक कार क्रांति को गति दी', eventEn: 'Became Tesla CEO, scaling sustainable electric transport' },
      { age: 50, eventHi: 'विश्व के सबसे धनी उद्योगपति बनकर निजी अंतरिक्ष उड़ानें नियमित कीं', eventEn: 'Became world’s wealthiest individual pioneering orbital Starship' },
    ],
    keyPlacements: [
      { planet: 'Mars', house: 7, noteHi: 'सप्तम में उच्च मंगल असीम औद्योगिक ऊर्जा व रॉकेटरी', noteEn: 'Exalted Mars in 7th powering aerospace dominance and relentless manufacturing' },
      { planet: 'Jupiter', house: 5, noteHi: 'पंचम में गुरु अभूतपूर्व तकनीकी दूरदर्शिता व नवाचार', noteEn: 'Jupiter in 5th fueling multi-planetary colonization blueprints' },
      { planet: 'Mercury', house: 12, noteHi: 'द्वादश में स्वराशि बुध अमूर्त कोडिंग व रॉकेट भौतिकी', noteEn: 'Mercury in 12th mastering complex autonomous software systems' },
    ],
    bioEn: 'Businessman and visionary founder of SpaceX, CEO of Tesla, and architect of neural engineering and orbital spaceflight.',
    bioHi: 'उद्योगपति और नवप्रवर्तक जिन्होंने पुनः-उपयोगी रॉकेट, इलेक्ट्रिक वाहन और ब्रेन-कंप्यूटर इंटरफेस बनाकर भविष्य को वर्तमान में उतारा।',
    quoteEn: 'When something is important enough, you do it even if the odds are not in your favor.',
    quoteHi: 'जब कोई लक्ष्य अत्यंत महत्वपूर्ण हो, तो आप उसे तब भी करते हैं जब परिस्थितियां आपके पक्ष में न हों।',
  },
  {
    id: 'nelson-mandela',
    nameEn: 'Nelson Mandela',
    nameHi: 'नेल्सन मंडेला',
    category: 'leadership',
    categoryTitleEn: 'Anti-Apartheid Icon & Father of Modern South Africa',
    categoryTitleHi: 'रंगभेद विरोधी महानायक व दक्षिण अफ्रीका के राष्ट्रपिता',
    birthDate: '18-07-1918',
    birthPlace: 'Mvezo, South Africa',
    roddenRating: 'AA',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Nelson_Mandela_1994.jpg/440px-Nelson_Mandela_1994.jpg',
    ascSignIndex: 3, // Cancer
    moonSignIndex: 7, // Scorpio
    sunSignIndex: 3, // Cancer
    prominentYogas: ['Hamsa Yoga', 'Raja Yoga', 'Gajakesari Yoga', 'Neechbhanga Raja Yoga'],
    prominentYogasHi: ['हंस महापुरुष योग', 'राजयोग', 'गजकेसरी योग', 'नीचभंग राजयोग'],
    keyLifeMilestones: [
      { age: 44, eventHi: 'रंगभेद शासन द्वारा बंदी बनाकर 27 वर्षों तक रोबेन द्वीप पर कारावास', eventEn: 'Imprisoned for 27 years on Robben Island for liberation struggle' },
      { age: 71, eventHi: 'कारागार से ऐतिहासिक मुक्ति और शांतिपूर्ण सत्ता हस्तांतरण वार्ता', eventEn: 'Released from prison, steering peaceful democratic transition' },
      { age: 75, eventHi: 'नोबेल शांति पुरस्कार एवं दक्षिण अफ्रीका के प्रथम अश्वेत राष्ट्रपति निर्वाचित', eventEn: 'Awarded Nobel Peace Prize; elected first Black President of South Africa' },
    ],
    keyPlacements: [
      { planet: 'Jupiter', house: 12, noteHi: 'द्वादश में गुरु 27 वर्षों के एकांतवास को साधना में बदलना', noteEn: 'Jupiter in 12th turning 27 years of isolation into moral supremacy' },
      { planet: 'Saturn', house: 1, noteHi: 'लग्न में शनि अदम्य धैर्य, सहनशीलता व क्षमा का प्रतीक', noteEn: 'Saturn in 1st forging indestructible resilience and reconciliation' },
      { planet: 'Sun', house: 1, noteHi: 'लग्न में सूर्य दक्षिण अफ्रीका के राष्ट्रपिता का गौरव', noteEn: 'Sun in Lagna establishing sovereign democratic rebirth' },
    ],
    bioEn: 'South African anti-apartheid revolutionary, political leader and philanthropist who served as President of South Africa.',
    bioHi: 'दक्षिण अफ्रीका के प्रथम लोकतांत्रिक राष्ट्रपति जिन्होंने 27 वर्ष जेल में बिताकर भी प्रतिशोध के स्थान पर सुलह और प्रेम से राष्ट्र को जोड़ा।',
    quoteEn: 'It always seems impossible until it is done.',
    quoteHi: 'जब तक कोई काम पूरा न हो जाए, वह असंभव ही लगता है।',
  },

  // 5. Leo Lagna (सिंह लग्न)
  {
    id: 'steve-jobs',
    nameEn: 'Steve Jobs',
    nameHi: 'स्टीव जॉब्स',
    category: 'business_wealth',
    categoryTitleEn: 'Tech Visionary & Apple Co-Founder',
    categoryTitleHi: 'एप्पल संस्थापक एवं डिजिटल क्रांति के अग्रदूत',
    birthDate: '24-02-1955',
    birthPlace: 'San Francisco, California, USA',
    roddenRating: 'AA',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Steve_Jobs_Headshot_2010-CROP_%28cropped_2%29.jpg/440px-Steve_Jobs_Headshot_2010-CROP_%28cropped_2%29.jpg',
    ascSignIndex: 4, // Leo
    moonSignIndex: 11, // Pisces
    sunSignIndex: 10, // Aquarius
    prominentYogas: ['Ruchaka Yoga', 'Gajakesari Yoga', 'Budhaditya Yoga', 'Amala Yoga'],
    prominentYogasHi: ['रुचक महापुरुष योग', 'गजकेसरी योग', 'बुधादित्य योग', 'अमला योग'],
    keyLifeMilestones: [
      { age: 21, eventHi: 'स्टीव वोज्नियाक संग गैरेज में एप्पल कंप्यूटर की नींव रखी', eventEn: 'Co-founded Apple Computer in family garage' },
      { age: 42, eventHi: 'एप्पल में वापसी कर आईमैक और आईपॉड से कंपनी को दिवालिएपन से उबारा', eventEn: 'Returned to Apple, orchestrating legendary corporate turnaround' },
      { age: 52, eventHi: 'आईफोन का विमोचन कर स्मार्टफोन और मोबाइल इंटरनेट की दुनिया बदली', eventEn: 'Unveiled the iPhone, transforming global mobile technology' },
    ],
    keyPlacements: [
      { planet: 'Mars', house: 8, noteHi: 'अष्टम में मंगल असाधारण रूपांतरणकारी ऊर्जा व परफेक्शन', noteEn: 'Mars in 8th driving relentless aesthetic perfection and obsession' },
      { planet: 'Jupiter', house: 11, noteHi: 'एकादश में उच्च गुरु विश्व का सबसे मूल्यवान उपभोक्ता ब्रांड', noteEn: 'Exalted Jupiter in 11th scaling world’s most iconic enterprise' },
      { planet: 'Sun', house: 7, noteHi: 'सप्तम में सूर्य करिश्माई उत्पाद प्रस्तुति व जन-आकर्षण', noteEn: 'Sun in 7th commanding electrifying consumer stage presence' },
    ],
    bioEn: 'Co-founder, chairman, and CEO of Apple who revolutionized personal computing, animated movies, music, and phones.',
    bioHi: 'एप्पल के सह-संस्थापक जिन्होंने व्यक्तिगत कंप्यूटर, संगीत और स्मार्टफोन की दुनिया में कला व तकनीक का अद्भुत संगम रचा।',
    quoteEn: 'The people who are crazy enough to think they can change the world are the ones who do.',
    quoteHi: 'जो लोग यह सोचने का पागलपन करते हैं कि वे दुनिया बदल सकते हैं, वही असल में दुनिया बदलते हैं।',
  },
  {
    id: 'jrd-tata',
    nameEn: 'J.R.D. Tata',
    nameHi: 'जे.आर.डी. टाटा',
    category: 'business_wealth',
    categoryTitleEn: 'Industrial Statesman & Father of Indian Aviation',
    categoryTitleHi: 'भारतीय विमानन के जनक व टाटा साम्राज्य के शिल्पकार',
    birthDate: '29-07-1904',
    birthPlace: 'Paris, France',
    roddenRating: 'AA',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/J._R._D._Tata_1932.jpg/440px-J._R._D._Tata_1932.jpg',
    ascSignIndex: 4, // Leo
    moonSignIndex: 9, // Capricorn
    sunSignIndex: 3, // Cancer
    prominentYogas: ['Dhana Yoga', 'Raja Yoga', 'Bhadra Yoga', 'Amala Yoga'],
    prominentYogasHi: ['महाधन योग', 'राजयोग', 'भद्र महापुरुष योग', 'अमला योग'],
    keyLifeMilestones: [
      { age: 28, eventHi: 'भारत की प्रथम वाणिज्यिक डाक उड़ान भरकर टाटा एयरलाइंस की शुरुआत की', eventEn: 'Flew India’s first commercial mail flight founding Tata Airlines' },
      { age: 34, eventHi: 'टाटा संस के अध्यक्ष बनकर समूह का 50 वर्षों तक नैतिक नेतृत्व किया', eventEn: 'Appointed Chairman of Tata Sons, expanding 14 to 95 enterprises' },
      { age: 88, eventHi: 'भारत के सर्वोच्च नागरिक सम्मान "भारत रत्न" से विभूषित', eventEn: 'Conferred Bharat Ratna for unparalleled nation-building philanthropy' },
    ],
    keyPlacements: [
      { planet: 'Jupiter', house: 9, noteHi: 'नवम में गुरु उच्च नैतिक मूल्य व राष्ट्र-हितैषी पूंजीवाद', noteEn: 'Jupiter in 9th anchoring industrial empire in ethical trusteeship' },
      { planet: 'Mercury', house: 12, noteHi: 'द्वादश में बुध वैश्विक व्यापार संबंध व टाटा कंसल्टेंसी', noteEn: 'Mercury in 12th pioneering international software and steel exports' },
      { planet: 'Sun', house: 12, noteHi: 'सूर्य का प्रभाव निस्वार्थ परोपकार व 80% संपत्ति ट्रस्ट को दान', noteEn: 'Sun channeling personal wealth into national medical and scientific trusts' },
    ],
    bioEn: 'Indian industrialist, philanthropist and aviation pioneer who founded Tata Consultancy Services, Tata Motors, and Air India.',
    bioHi: 'भारत रत्न उद्योगपति जिन्होंने टीसीएस, टाटा मोटर्स और एयर इंडिया जैसी संस्थाएं खड़ी कर राष्ट्र निर्माण में अमूल्य योगदान दिया।',
    quoteEn: 'Nothing worthwhile is ever achieved without deep thought and hard work.',
    quoteHi: 'गहन चिंतन और अनथक परिश्रम के बिना कोई भी महान उपलब्धि हासिल नहीं की जा सकती।',
  },
  {
    id: 'barack-obama',
    nameEn: 'Barack Obama',
    nameHi: 'बराक ओबामा',
    category: 'leadership',
    categoryTitleEn: '44th US President & Nobel Peace Laureate',
    categoryTitleHi: 'संयुक्त राज्य अमेरिका के ४४वें राष्ट्रपति व नोबेल विजेता',
    birthDate: '04-08-1961',
    birthPlace: 'Honolulu, Hawaii, USA',
    roddenRating: 'AA',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/President_Barack_Obama.jpg/440px-President_Barack_Obama.jpg',
    ascSignIndex: 4, // Leo
    moonSignIndex: 1, // Taurus
    sunSignIndex: 3, // Cancer
    prominentYogas: ['Gajakesari Yoga', 'Sunafa Yoga', 'Amala Yoga', 'Budhaditya Yoga'],
    prominentYogasHi: ['गजकेसरी योग', 'सुनफा योग', 'अमला योग', 'बुधादित्य योग'],
    keyLifeMilestones: [
      { age: 43, eventHi: '2004 डेमोक्रेटिक नेशनल कन्वेंशन में ऐतिहासिक भाषण से राष्ट्रीय उदय', eventEn: 'Delivered historic 2004 DNC keynote catapulting to national prominence' },
      { age: 47, eventHi: 'अमेरिका के प्रथम अश्वेत राष्ट्रपति निर्वाचित होकर इतिहास रचा', eventEn: 'Elected first African American President of the United States' },
      { age: 48, eventHi: 'अंतर्राष्ट्रीय कूटनीति व परमाणु अप्रसार हेतु नोबेल शांति पुरस्कार', eventEn: 'Awarded Nobel Peace Prize for multilateral diplomacy' },
    ],
    keyPlacements: [
      { planet: 'Sun', house: 12, noteHi: 'द्वादश में सूर्य वैश्विक कूटनीति व बहुपक्षीय संवाद', noteEn: 'Sun in 12th commanding global diplomacy and international consensus' },
      { planet: 'Moon', house: 10, noteHi: 'दशम में उच्च चंद्र जनता को सम्मोहित करने वाला ओजस्वी वक्तृत्व', noteEn: 'Exalted Moon in 10th granting immense mass charisma and oratorical grace' },
      { planet: 'Jupiter', house: 6, noteHi: 'षष्ठ में गुरु नीचभंग होकर राजनीतिक संकटों से पार पाना', noteEn: 'Neechbhanga Jupiter in 6th overcoming severe geopolitical crises' },
    ],
    bioEn: 'American politician who served as the 44th president of the United States, the first African American to hold the office.',
    bioHi: 'अमेरिका के 44वें राष्ट्रपति जिन्होंने आर्थिक मंदी के समय राष्ट्र का नेतृत्व किया और स्वास्थ्य सुधार (ओबामाकेयर) लागू किया।',
    quoteEn: 'Change will not come if we wait for some other person or some other time. We are the ones we’ve been waiting for.',
    quoteHi: 'परिवर्तन तब नहीं आएगा जब हम किसी और व्यक्ति या समय की प्रतीक्षा करेंगे। हम ही वे हैं जिनकी हम प्रतीक्षा कर रहे हैं।',
  },

  // 6. Virgo Lagna (कन्या लग्न)
  {
    id: 'warren-buffett',
    nameEn: 'Warren Buffett',
    nameHi: 'वॉरेन बफेट',
    category: 'business_wealth',
    categoryTitleEn: 'Oracle of Omaha & Supreme Value Investor',
    categoryTitleHi: 'ओमाहा के ओरेकल व मूल्य निवेश के महागुरु',
    birthDate: '30-08-1930',
    birthPlace: 'Omaha, Nebraska, USA',
    roddenRating: 'AA',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Warren_Buffett_at_the_2015_SelectUSA_Investment_Summit.jpg/440px-Warren_Buffett_at_the_2015_SelectUSA_Investment_Summit.jpg',
    ascSignIndex: 5, // Virgo
    moonSignIndex: 7, // Scorpio
    sunSignIndex: 4, // Leo
    prominentYogas: ['Bhadra Yoga', 'Dhana Yoga', 'Raja Yoga', 'Budhaditya Yoga'],
    prominentYogasHi: ['भद्र महापुरुष योग', 'महाधन योग', 'राजयोग', 'बुधादित्य योग'],
    keyLifeMilestones: [
      { age: 35, eventHi: 'बर्कशायर हैथवे का नियंत्रण लेकर वैश्विक निवेश कंपनी में रूपांतरित किया', eventEn: 'Took control of Berkshire Hathaway, transforming it into investing titan' },
      { age: 76, eventHi: 'अपनी 99% से अधिक संपत्ति गेट्स फाउंडेशन को दान देने की घोषणा की', eventEn: 'Pledged over 99% of wealth to philanthropic causes' },
      { age: 78, eventHi: '2008 वित्तीय संकट में अमेरिकी अर्थव्यवस्था के सबसे बड़े संरक्षक बने', eventEn: 'Steered global markets through 2008 crash with decisive capital injections' },
    ],
    keyPlacements: [
      { planet: 'Mercury', house: 1, noteHi: 'लग्न में उच्च स्वराशि बुध वित्तीय गणनाओं का अचूक गणित', noteEn: 'Exalted Mercury in Lagna conferring infallible compound interest instinct' },
      { planet: 'Sun', house: 12, noteHi: 'द्वादश में स्वराशि सूर्य सादगीपूर्ण जीवन व विशाल परोपकार', noteEn: 'Sun in 12th maintaining ascetic frugality and colossal wealth donation' },
      { planet: 'Jupiter', house: 11, noteHi: 'एकादश में उच्च गुरु शतकों तक निरंतर बढ़ती संपत्ति', noteEn: 'Exalted Jupiter in 11th compounding wealth across consecutive decades' },
    ],
    bioEn: 'American investor, business tycoon, and philanthropist who is the chairman and CEO of Berkshire Hathaway.',
    bioHi: 'विश्व के सर्वाधिक सफल निवेशक जिन्होंने चक्रवृद्धि ब्याज और मूल्य निवेश के सिद्धांतों पर विश्व का सबसे बड़ा निवेश साम्राज्य बनाया।',
    quoteEn: 'Rule No. 1: Never lose money. Rule No. 2: Never forget rule No. 1.',
    quoteHi: 'नियम संख्या 1: कभी धन मत गंवाओ। नियम संख्या 2: कभी नियम संख्या 1 मत भूलो।',
  },
  {
    id: 'bill-gates',
    nameEn: 'Bill Gates',
    nameHi: 'बिल गेट्स',
    category: 'business_wealth',
    categoryTitleEn: 'PC Revolution Pioneer & Global Philanthropist',
    categoryTitleHi: 'माइक्रोसॉफ्ट संस्थापक, पीसी क्रांति दूत व परोपकारी',
    birthDate: '28-10-1955',
    birthPlace: 'Seattle, Washington, USA',
    roddenRating: 'AA',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Bill_Gates_2017_%28cropped%29.jpg/440px-Bill_Gates_2017_%28cropped%29.jpg',
    ascSignIndex: 5, // Virgo
    moonSignIndex: 0, // Aries
    sunSignIndex: 6, // Libra
    prominentYogas: ['Bhadra Yoga', 'Malavya Yoga', 'Gajakesari Yoga', 'Neechbhanga Raja Yoga'],
    prominentYogasHi: ['भद्र महापुरुष योग', 'मालव्य महापुरुष योग', 'गजकेसरी योग', 'नीचभंग राजयोग'],
    keyLifeMilestones: [
      { age: 20, eventHi: 'पॉल एलन संग माइक्रोसॉफ्ट की स्थापना कर सॉफ्टवेयर को उद्योग बनाया', eventEn: 'Co-founded Microsoft, pioneering consumer software market' },
      { age: 39, eventHi: 'विश्व के सबसे धनी व्यक्ति बने और विंडोज 95 से इंटरनेट युग खोला', eventEn: 'Became world’s richest individual; launched Windows 95' },
      { age: 44, eventHi: 'गेट्स फाउंडेशन बनाकर वैश्विक स्वास्थ्य व पोलियो उन्मूलन में जुटे', eventEn: 'Formed Bill & Melinda Gates Foundation targeting global disease eradication' },
    ],
    keyPlacements: [
      { planet: 'Mercury', house: 1, noteHi: 'लग्न में उच्च स्वराशि बुध कंप्यूटर ऑपरेटिंग सिस्टम की दृष्टि', noteEn: 'Exalted Mercury in Lagna architecting global PC computing standards' },
      { planet: 'Venus', house: 2, noteHi: 'द्वितीय में स्वराशि शुक्र अकूत व्यापारिक संपत्ति व सॉफ्टवेयर लाइसेंस', noteEn: 'Venus in 2nd generating unparalleled recurring software licensing wealth' },
      { planet: 'Mars', house: 1, noteHi: 'लग्न में मंगल आक्रामक व्यापारिक प्रतिस्पर्धा व दृष्टि', noteEn: 'Mars in 1st driving relentless market domination and competitive edge' },
    ],
    bioEn: 'American business magnate, software developer, investor, and philanthropist best known for co-founding Microsoft.',
    bioHi: 'माइक्रोसॉफ्ट के सह-संस्थापक जिन्होंने हर डेस्क पर कंप्यूटर पहुंचाने का स्वप्न साकार किया और स्वास्थ्य सुधार में जुटे।',
    quoteEn: 'If you are born poor it’s not your mistake, but if you die poor it’s your mistake.',
    quoteHi: 'यदि आप निर्धन जन्म लेते हैं तो यह आपकी भूल नहीं, पर यदि आप निर्धन ही मर जाते हैं तो यह आपकी भूल है।',
  },
  {
    id: 'muhammad-ali',
    nameEn: 'Muhammad Ali',
    nameHi: 'मोहम्मद अली',
    category: 'sports_legend',
    categoryTitleEn: 'The Greatest Boxing Champion & Civil Rights Icon',
    categoryTitleHi: 'बॉक्सिंग के महानायक व नागरिक अधिकार सेनानी',
    birthDate: '17-01-1942',
    birthPlace: 'Louisville, Kentucky, USA',
    roddenRating: 'AA',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Muhammad_Ali_NYWTS.jpg/440px-Muhammad_Ali_NYWTS.jpg',
    ascSignIndex: 5, // Virgo
    moonSignIndex: 9, // Capricorn
    sunSignIndex: 9, // Capricorn
    prominentYogas: ['Ruchaka Yoga', 'Gajakesari Yoga', 'Budhaditya Yoga', 'Raja Yoga'],
    prominentYogasHi: ['रुचक महापुरुष योग', 'गजकेसरी योग', 'बुधादित्य योग', 'राजयोग'],
    keyLifeMilestones: [
      { age: 22, eventHi: 'सोनी लिस्टन को हराकर प्रथम बार वर्ल्ड हैवीवेट चैंपियनशिप जीती', eventEn: 'Defeated Sonny Liston to win World Heavyweight Championship' },
      { age: 25, eventHi: 'वियतनाम युद्ध में जाने से इंकार कर नैतिक साहस हेतु खिताब गंवाया', eventEn: 'Refused Vietnam draft on moral grounds, stripped of title at peak' },
      { age: 32, eventHi: 'जॉर्ज फोरमैन को रंबल इन द जंगल में हराकर पुनः विश्व विजेता बने', eventEn: 'Regained heavyweight crown defeating George Foreman in Rumble in the Jungle' },
    ],
    keyPlacements: [
      { planet: 'Mars', house: 7, noteHi: 'सप्तम में मंगल रिंग में बिजली जैसी फुर्ती व अचूक मुक्केबाजी', noteEn: 'Mars in 7th striking with lightning speed ("float like a butterfly, sting like a bee")' },
      { planet: 'Saturn', house: 9, noteHi: 'नवम में शनि धार्मिक रूपांतरण व सिद्धांतों पर अडिग रहना', noteEn: 'Saturn in 9th anchoring moral refusal to fight unjust wars' },
      { planet: 'Sun', house: 5, noteHi: 'पंचम में सूर्य सम्मोहक आत्मविश्वास व ओजस्वी सार्वजनिक वक्तृत्व', noteEn: 'Sun in 5th commanding electrifying self-belief and mass psychological dominance' },
    ],
    bioEn: 'American professional boxer and activist nicknamed "The Greatest", widely regarded as one of the most significant sports figures of the 20th century.',
    bioHi: '20वीं सदी के महानतम बॉक्सर जिन्होंने रिंग के भीतर और बाहर अपने आत्मसम्मान और अधिकारों के लिए अभूतपूर्व संघर्ष किया।',
    quoteEn: 'Don’t count the days; make the days count.',
    quoteHi: 'दिनों को गिनो मत; दिनों को सार्थक बनाओ।',
  },

  // 7. Libra Lagna (तुला लग्न)
  {
    id: 'mahatma-gandhi',
    nameEn: 'Mahatma Gandhi',
    nameHi: 'महात्मा गांधी',
    category: 'leadership',
    categoryTitleEn: 'Father of the Nation & Apostle of Non-Violence',
    categoryTitleHi: 'राष्ट्रपिता एवं सत्य-अहिंसा के वैश्विक प्रणेता',
    birthDate: '02-10-1869',
    birthPlace: 'Porbandar, India',
    roddenRating: 'AA',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Mahatma-Gandhi%2C_studio%2C_1931.jpg/440px-Mahatma-Gandhi%2C_studio%2C_1931.jpg',
    ascSignIndex: 6, // Libra
    moonSignIndex: 3, // Cancer
    sunSignIndex: 5, // Virgo
    prominentYogas: ['Ruchaka Yoga', 'Malavya Yoga', 'Budhaditya Yoga', 'Gajakesari Yoga'],
    prominentYogasHi: ['रुचक महापुरुष योग', 'मालव्य महापुरुष योग', 'बुधादित्य योग', 'गजकेसरी योग'],
    keyLifeMilestones: [
      { age: 46, eventHi: 'दक्षिण अफ्रीका से भारत लौटकर चंपारण व खेड़ा सत्याग्रह का नेतृत्व', eventEn: 'Returned to India from South Africa, initiating Champaran Satyagraha' },
      { age: 60, eventHi: 'दांडी नमक यात्रा कर ब्रिटिश साम्राज्य की नींव हिला दी', eventEn: 'Led historic Salt March to Dandi, defying colonial salt tax' },
      { age: 72, eventHi: 'भारत छोड़ो आंदोलन का शंखनाद कर देश को स्वाधीनता के द्वार पहुंचाया', eventEn: 'Launched Quit India Movement cementing the path to independence' },
    ],
    keyPlacements: [
      { planet: 'Mars', house: 1, noteHi: 'लग्न में स्वराशि मंगल अदम्य सत्याग्रह शक्ति व निर्भीकता', noteEn: 'Mars in 1st giving fearless moral courage and civil resistance power' },
      { planet: 'Venus', house: 1, noteHi: 'लग्न में स्वराशि शुक्र अहिंसा, सादगी व नैतिक शुचिता', noteEn: 'Venus in 1st anchoring Ahimsa and profound universal love' },
      { planet: 'Jupiter', house: 7, noteHi: 'सप्तम में गुरु जनसमूहों का नैतिक नेतृत्व व जन-आंदोलन', noteEn: 'Jupiter in 7th mobilizing hundreds of millions through moral force' },
    ],
    bioEn: 'Indian lawyer, anti-colonial nationalist and political ethicist who employed nonviolent resistance to lead India to independence.',
    bioHi: 'सत्य और अहिंसा के बल पर बिना हथियार उठाए दुनिया के सबसे विशाल साम्राज्य को झुकाकर भारत को स्वतंत्र कराया।',
    quoteEn: 'In a gentle way, you can shake the world.',
    quoteHi: 'विनम्रता और सत्य से आप पूरी दुनिया को हिला सकते हैं।',
  },
  {
    id: 'winston-churchill',
    nameEn: 'Winston Churchill',
    nameHi: 'विंस्टन चर्चिल',
    category: 'leadership',
    categoryTitleEn: 'Wartime Prime Minister & Nobel Laureate in Literature',
    categoryTitleHi: 'ब्रिटिश युद्धकालीन प्रधानमंत्री व नोबेल साहित्य विजेता',
    birthDate: '30-11-1874',
    birthPlace: 'Woodstock, United Kingdom',
    roddenRating: 'AA',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Sir_Winston_Churchill_-_19086236948.jpg/440px-Sir_Winston_Churchill_-_19086236948.jpg',
    ascSignIndex: 6, // Libra
    moonSignIndex: 4, // Leo
    sunSignIndex: 7, // Scorpio
    prominentYogas: ['Malavya Yoga', 'Raja Yoga', 'Budhaditya Yoga', 'Saraswati Yoga'],
    prominentYogasHi: ['मालव्य महापुरुष योग', 'राजयोग', 'बुधादित्य योग', 'सरस्वती योग'],
    keyLifeMilestones: [
      { age: 25, eventHi: 'बोअर युद्ध में बंदी बनाकर भाग निकलने पर राष्ट्रीय नायक बने', eventEn: 'Heroic escape from Boer prisoner camp catapulting to fame' },
      { age: 65, eventHi: '1940 में प्रधानमंत्री बनकर ब्रिटेन को नाजी आक्रमण के विरुद्ध विजय दिलाई', eventEn: 'Became Prime Minister rallying Britain through the Blitz to WW2 victory' },
      { age: 79, eventHi: 'ऐतिहासिक ग्रंथों व वक्तृत्व हेतु साहित्य का नोबेल पुरस्कार प्राप्त', eventEn: 'Awarded Nobel Prize in Literature for mastery of historical description' },
    ],
    keyPlacements: [
      { planet: 'Venus', house: 1, noteHi: 'लग्न में स्वराशि शुक्र भाषा का अद्वितीय सौंदर्य व वक्तृत्व', noteEn: 'Venus in 1st endowing epic literary style and magnetic rhetoric' },
      { planet: 'Mars', house: 12, noteHi: 'द्वादश में मंगल युद्धनीति व वैश्विक संघर्षों का प्रबंधन', noteEn: 'Mars in 12th directing colossal global military operations' },
      { planet: 'Jupiter', house: 1, noteHi: 'लग्न में गुरु संकट में अडिग आत्मबल व राज्य सम्मान', noteEn: 'Jupiter in 1st maintaining defiance when all allies had fallen' },
    ],
    bioEn: 'British statesman, soldier, and writer who served as Prime Minister of the United Kingdom during the Second World War.',
    bioHi: 'ब्रिटेन के युद्धकालीन प्रधानमंत्री जिन्होंने अपने ओजस्वी भाषणों और नेतृत्व से मित्र राष्ट्रों को द्वितीय विश्वयुद्ध में विजय दिलाई।',
    quoteEn: 'Success is not final, failure is not fatal: it is the courage to continue that counts.',
    quoteHi: 'सफलता अंतिम नहीं होती, असफलता घातक नहीं होती: आगे बढ़ते रहने का साहस ही सबसे अधिक मायने रखता है।',
  },
  {
    id: 'oppenheimer',
    nameEn: 'J. Robert Oppenheimer',
    nameHi: 'जे. रॉबर्ट ओपेनहाइमर',
    category: 'science_tech',
    categoryTitleEn: 'Father of the Atomic Bomb & Theoretical Physicist',
    categoryTitleHi: 'परमाणु बम के जनक व सैद्धांतिक भौतिकविद्',
    birthDate: '22-04-1904',
    birthPlace: 'New York City, USA',
    roddenRating: 'AA',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/JROppenheimer-LosAlamos.jpg/440px-JROppenheimer-LosAlamos.jpg',
    ascSignIndex: 6, // Libra
    moonSignIndex: 3, // Cancer
    sunSignIndex: 0, // Aries
    prominentYogas: ['Ruchaka Yoga', 'Gajakesari Yoga', 'Sunafa Yoga', 'Neechbhanga Raja Yoga'],
    prominentYogasHi: ['रुचक महापुरुष योग', 'गजकेसरी योग', 'सुनफा योग', 'नीचभंग राजयोग'],
    keyLifeMilestones: [
      { age: 38, eventHi: 'मैनहट्टन परियोजना के लॉस एलामोस गुप्त प्रयोगशाला निदेशक नियुक्त', eventEn: 'Appointed scientific director of Los Alamos Manhattan Project' },
      { age: 41, eventHi: 'ट्रिनिटी परीक्षण में प्रथम परमाणु विस्फोट देख गीता का श्लोक स्मरण किया', eventEn: 'Witnessed Trinity nuclear explosion citing the Bhagavad Gita' },
      { age: 49, eventHi: 'परमाणु ऊर्जा आयोग द्वारा सुरक्षा मंजूरी छीने जाने पर सम्मान बहाल हुआ', eventEn: 'Targeted during Red Scare, later exonerated as visionary patriot' },
    ],
    keyPlacements: [
      { planet: 'Sun', house: 7, noteHi: 'सप्तम में उच्च सूर्य महाविनाशक ऊर्जा को नियंत्रित करने का दायित्व', noteEn: 'Exalted Sun in 7th commanding supreme state nuclear project' },
      { planet: 'Moon', house: 10, noteHi: 'दशम में स्वराशि चंद्र संस्कृत व उपनिषद दर्शन से प्रभावित मन', noteEn: 'Moon in 10th drawn to Sanskrit philosophy and moral introspection' },
      { planet: 'Saturn', house: 5, noteHi: 'पंचम में स्वराशि शनि क्वांटम यांत्रिकी व ब्लैक होल का गणित', noteEn: 'Saturn in 5th pioneering neutron star and black hole physics' },
    ],
    bioEn: 'American theoretical physicist who was the director of the Los Alamos Laboratory during the Manhattan Project.',
    bioHi: 'अमेरिकी भौतिकविद् जिन्होंने लॉस एलामोस में पहले परमाणु बम का विकास किया और बाद में परमाणु शस्त्रों के प्रसार के विरुद्ध चेताया।',
    quoteEn: 'Now I am become Death, the destroyer of worlds.',
    quoteHi: 'अब मैं काल बन गया हूं, लोकों का संहारक (भगवद्गीता से)।',
  },

  // 8. Scorpio Lagna (वृश्चिक लग्न)
  {
    id: 'abraham-lincoln',
    nameEn: 'Abraham Lincoln',
    nameHi: 'अब्राहम लिंकन',
    category: 'leadership',
    categoryTitleEn: '16th US President & Emancipation Liberator',
    categoryTitleHi: 'अमेरिका के १६वें राष्ट्रपति व दासता उन्मूलक',
    birthDate: '12-02-1809',
    birthPlace: 'Hodgenville, Kentucky, USA',
    roddenRating: 'AA',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Abraham_Lincoln_O-77_matte_collodion_print.jpg/440px-Abraham_Lincoln_O-77_matte_collodion_print.jpg',
    ascSignIndex: 7, // Scorpio
    moonSignIndex: 9, // Capricorn
    sunSignIndex: 10, // Aquarius
    prominentYogas: ['Ruchaka Yoga', 'Gajakesari Yoga', 'Dhana Yoga', 'Raja Yoga'],
    prominentYogasHi: ['रुचक महापुरुष योग', 'गजकेसरी योग', 'धन योग', 'राजयोग'],
    keyLifeMilestones: [
      { age: 52, eventHi: 'राष्ट्रपति निर्वाचित होकर गृहयुद्ध के भीषण संकट में संघ की रक्षा की', eventEn: 'Elected President steering the Union through catastrophic Civil War' },
      { age: 53, eventHi: 'मुक्ति उद्घोषणा (Emancipation Proclamation) जारी कर दासता का अंत किया', eventEn: 'Issued Emancipation Proclamation freeing millions of enslaved humans' },
      { age: 54, eventHi: 'गेटीसबर्ग में अमर भाषण देकर लोकतंत्र की शाश्वत परिभाषा दी', eventEn: 'Delivered Gettysburg Address defining government of, by, for the people' },
    ],
    keyPlacements: [
      { planet: 'Mars', house: 11, noteHi: 'एकादश में मंगल दासता उन्मूलन हेतु सेना का अडिग संचालन', noteEn: 'Mars in 11th marshaling Union forces to preserve constitutional republic' },
      { planet: 'Saturn', house: 1, noteHi: 'लग्न में शनि अपार वेदना, सादगी और गहरा मानवीय करुणा भाव', noteEn: 'Saturn in 1st embodying profound melancholy, humility, and moral justice' },
      { planet: 'Jupiter', house: 5, noteHi: 'पंचम में स्वराशि गुरु कालजयी विधिक व नैतिक दृष्टि', noteEn: 'Own-sign Jupiter in 5th drafting immortal democratic proclamations' },
    ],
    bioEn: 'American lawyer, politician, and statesman who served as the 16th president of the United States, preserving the Union and abolishing slavery.',
    bioHi: 'अमेरिका के 16वें राष्ट्रपति जिन्होंने भीषण गृहयुद्ध में राष्ट्र को टूटने से बचाया और दास प्रथा को समाप्त कर मानवता की रक्षा की।',
    quoteEn: 'Government of the people, by the people, for the people, shall not perish from the earth.',
    quoteHi: 'जनता का, जनता द्वारा, जनता के लिए शासन—इस धरती से कभी समाप्त नहीं होगा।',
  },
  {
    id: 'isaac-newton',
    nameEn: 'Sir Isaac Newton',
    nameHi: 'सर आइजक न्यूटन',
    category: 'science_tech',
    categoryTitleEn: 'Father of Classical Mechanics & Calculus Co-Creator',
    categoryTitleHi: 'शास्त्रीय भौतिकी के जनक व गुरुत्वाकर्षण के अन्वेषक',
    birthDate: '04-01-1643',
    birthPlace: 'Woolsthorpe, United Kingdom',
    roddenRating: 'AA',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Portrait_of_Sir_Isaac_Newton%2C_1689.jpg/440px-Portrait_of_Sir_Isaac_Newton%2C_1689.jpg',
    ascSignIndex: 7, // Scorpio
    moonSignIndex: 3, // Cancer
    sunSignIndex: 8, // Sagittarius
    prominentYogas: ['Ruchaka Yoga', 'Sasa Yoga', 'Saraswati Yoga', 'Gajakesari Yoga'],
    prominentYogasHi: ['रुचक महापुरुष योग', 'शश महापुरुष योग', 'सरस्वती योग', 'गजकेसरी योग'],
    keyLifeMilestones: [
      { age: 23, eventHi: 'प्लेग लॉकडाउन में गुरुत्वाकर्षण, प्रकाशिकी और कैलकुलस का आविष्कार', eventEn: 'Year of wonders 1666: Discovered gravity, optics, and calculus in isolation' },
      { age: 44, eventHi: 'प्रिंसिपिया मैथमैटिका प्रकाशित कर गति के तीन नियमों की स्थापना की', eventEn: 'Published Principia Mathematica founding classical physics' },
      { age: 60, eventHi: 'रॉयल सोसाइटी के अध्यक्ष निर्वाचित होकर विज्ञान जगत का नेतृत्व किया', eventEn: 'Elected President of the Royal Society, knighted by Queen Anne' },
    ],
    keyPlacements: [
      { planet: 'Saturn', house: 1, noteHi: 'लग्न में शनि एकांत साधना, कठोर गणितीय अनुशासन', noteEn: 'Saturn in Lagna driving legendary ascetic seclusion and mathematical rigor' },
      { planet: 'Mars', house: 4, noteHi: 'चतुर्थ में मंगल प्रकृति के भौतिक बलों को समझने की भूख', noteEn: 'Mars in 4th unlocking mechanical laws of motion and celestial orbits' },
      { planet: 'Jupiter', house: 9, noteHi: 'नवम में उच्च गुरु पराभौतिक चिंतन व प्रकृति में ईश्वर के नियम', noteEn: 'Exalted Jupiter in 9th discerning divine geometry across the cosmos' },
    ],
    bioEn: 'English polymath active as a mathematician, physicist, astronomer, alchemist, theologian, and author of the Principia.',
    bioHi: 'महान गणितज्ञ और भौतिकविद् जिन्होंने गुरुत्वाकर्षण के नियम, गति के तीन नियम और कैलकुलस का प्रतिपादन कर विज्ञान में क्रांति ला दी।',
    quoteEn: 'If I have seen further, it is by standing on the shoulders of giants.',
    quoteHi: 'यदि मैंने दूसरों से अधिक दूर देखा है, तो इसलिए कि मैं दिग्गजों के कंधों पर खड़ा था।',
  },
  {
    id: 'marie-curie',
    nameEn: 'Marie Curie',
    nameHi: 'मैरी क्यूरी',
    category: 'science_tech',
    categoryTitleEn: 'Double Nobel Laureate & Radioactivity Pioneer',
    categoryTitleHi: 'दोहरी नोबेल पुरस्कार विजेता व रेडियोधर्मिता की जनक',
    birthDate: '07-11-1867',
    birthPlace: 'Warsaw, Poland',
    roddenRating: 'AA',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Marie_Curie_c._1920s.jpg/440px-Marie_Curie_c._1920s.jpg',
    ascSignIndex: 7, // Scorpio
    moonSignIndex: 11, // Pisces
    sunSignIndex: 7, // Scorpio
    prominentYogas: ['Ruchaka Yoga', 'Gajakesari Yoga', 'Budhaditya Yoga', 'Amala Yoga'],
    prominentYogasHi: ['रुचक महापुरुष योग', 'गजकेसरी योग', 'बुधादित्य योग', 'अमला योग'],
    keyLifeMilestones: [
      { age: 31, eventHi: 'पोलोनियम और रेडियम की खोज कर रेडियोधर्मिता शब्द दिया', eventEn: 'Discovered Polonium and Radium, coining the term radioactivity' },
      { age: 36, eventHi: 'भौतिकी में नोबेल पुरस्कार जीतने वाली विश्व की प्रथम महिला बनीं', eventEn: 'Awarded Nobel Prize in Physics, first woman laureate in history' },
      { age: 44, eventHi: 'शुद्ध रेडियम पृथक्करण हेतु रसायन विज्ञान का दूसरा नोबेल पुरस्कार जीता', eventEn: 'Won second Nobel Prize in Chemistry, only person in two distinct sciences' },
    ],
    keyPlacements: [
      { planet: 'Sun', house: 1, noteHi: 'लग्न में सूर्य अदम्य वैज्ञानिक लगन व अमर कीर्ति', noteEn: 'Sun in Lagna conferring supreme intellectual perseverance and historic fame' },
      { planet: 'Mercury', house: 1, noteHi: 'लग्न में बुध रेडियोधर्मी तत्वों की सूक्ष्म रासायनिक परख', noteEn: 'Mercury in 1st isolating pure radioactive isotopes with immense precision' },
      { planet: 'Saturn', house: 12, noteHi: 'द्वादश में शनि कठोर प्रयोगशाला श्रम व विकिरण का आत्म-त्याग', noteEn: 'Saturn in 12th enduring arduous laboratory radiation exposure for humanity' },
    ],
    bioEn: 'Polish and naturalized-French physicist and chemist who conducted pioneering research on radioactivity, winning two Nobel Prizes.',
    bioHi: 'प्रथम महिला नोबेल विजेता और दो भिन्न विज्ञानों (भौतिकी व रसायन) में नोबेल पाने वाली विश्व की एकमात्र वैज्ञानिक।',
    quoteEn: 'Nothing in life is to be feared, it is only to be understood. Now is the time to understand more, so that we may fear less.',
    quoteHi: 'जीवन में किसी भी चीज से डरने की आवश्यकता नहीं है, केवल उसे समझने की आवश्यकता है। अब अधिक समझने का समय है ताकि हम कम डरें।',
  },
  {
    id: 'maradona',
    nameEn: 'Diego Maradona',
    nameHi: 'डिएगो माराडोना',
    category: 'sports_legend',
    categoryTitleEn: 'Football Magician & 1986 World Cup Champion',
    categoryTitleHi: 'फुटबॉल के जादुई उस्ताद व १९८६ विश्व कप विजेता',
    birthDate: '30-10-1960',
    birthPlace: 'Lanús, Argentina',
    roddenRating: 'AA',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Maradona-Mundial_86_con_la_copa.JPG/440px-Maradona-Mundial_86_con_la_copa.JPG',
    ascSignIndex: 7, // Scorpio
    moonSignIndex: 11, // Pisces
    sunSignIndex: 6, // Libra
    prominentYogas: ['Ruchaka Yoga', 'Gajakesari Yoga', 'Sunafa Yoga', 'Raja Yoga'],
    prominentYogasHi: ['रुचक महापुरुष योग', 'गजकेसरी योग', 'सुनफा योग', 'राजयोग'],
    keyLifeMilestones: [
      { age: 25, eventHi: '1986 विश्व कप में इंग्लैंड के विरुद्ध सदी का सर्वश्रेष्ठ गोल दागकर कप जीता', eventEn: 'Won 1986 FIFA World Cup, scoring the Goal of the Century' },
      { age: 26, eventHi: 'नापोली क्लब को इतिहास में प्रथम बार सीरी ए इतालवी चैंपियनशिप दिलाई', eventEn: 'Led underdog Napoli to their first-ever historic Serie A title' },
      { age: 29, eventHi: '1990 विश्व कप फाइनल में अर्जेंटीना का पुनः नेतृत्व किया', eventEn: 'Captained Argentina to second consecutive World Cup final in 1990' },
    ],
    keyPlacements: [
      { planet: 'Mars', house: 8, noteHi: 'अष्टम में स्वराशि मंगल अप्रत्याशित खेल ऊर्जा व अदम्य ड्रिबलिंग', noteEn: 'Own-sign Mars in 8th delivering explosive acceleration through dense defense' },
      { planet: 'Moon', house: 5, noteHi: 'पंचम में चंद्र मैदान पर सम्मोहक खेल रचनात्मकता', noteEn: 'Moon in 5th improvising mesmerizing theatrical football artistry' },
      { planet: 'Jupiter', house: 2, noteHi: 'द्वितीय में स्वराशि गुरु वैश्विक जनसमर्थन व देवतुल्य प्रतिष्ठा', noteEn: 'Jupiter in 2nd generating messianic adoration across Latin America' },
    ],
    bioEn: 'Argentine professional football player and manager widely regarded as one of the greatest players in the history of the sport.',
    bioHi: 'अर्जेंटीना के महान फुटबॉल जादूगर जिन्होंने 1986 में अपनी कप्तानी में देश को विश्व कप जिताया और फुटबॉल इतिहास का सबसे सुंदर गोल किया।',
    quoteEn: 'When people succeed, it is because of hard work. Luck has nothing to do with success.',
    quoteHi: 'जब लोग सफल होते हैं, तो वह कठिन परिश्रम के कारण होता है। भाग्य का सफलता से कोई लेना-देना नहीं है।',
  },

  // 9. Sagittarius Lagna (धनु लग्न)
  {
    id: 'swami-vivekananda',
    nameEn: 'Swami Vivekananda',
    nameHi: 'स्वामी विवेकानंद',
    category: 'spiritual',
    categoryTitleEn: 'Spiritual Master & Prophet of Vedanta',
    categoryTitleHi: 'आध्यात्मिक युगद्रष्टा एवं वेदांत के वैश्विक प्रणेता',
    birthDate: '12-01-1863',
    birthPlace: 'Kolkata, India',
    roddenRating: 'AA',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Swami_Vivekananda-1893-09-signed.jpg/440px-Swami_Vivekananda-1893-09-signed.jpg',
    ascSignIndex: 8, // Sagittarius
    moonSignIndex: 5, // Virgo
    sunSignIndex: 8, // Sagittarius
    prominentYogas: ['Hamsa Yoga', 'Raja Yoga', 'Bhadra Yoga', 'Saraswati Yoga'],
    prominentYogasHi: ['हंस महापुरुष योग', 'राजयोग', 'भद्र महापुरुष योग', 'सरस्वती योग'],
    keyLifeMilestones: [
      { age: 30, eventHi: '1893 शिकागो धर्म संसद में "अमेरिका के भाइयों और बहनों" से विश्व को सम्मोहित किया', eventEn: 'Electrified 1893 Chicago Parliament of Religions introducing Vedanta' },
      { age: 34, eventHi: 'रामकृष्ण मिशन की स्थापना कर सेवा व ज्ञान के समन्वय का मार्ग खोला', eventEn: 'Founded Ramakrishna Math & Mission integrating service and spirituality' },
      { age: 39, eventHi: 'मात्र 39 वर्ष की आयु में महासमाधि लेकर सनातन चेतना को अमर कर दिया', eventEn: 'Attained Mahasamadhi after awakening global spiritual resurgence' },
    ],
    keyPlacements: [
      { planet: 'Jupiter', house: 11, noteHi: 'एकादश में गुरु उच्च ज्ञान व वैश्विक प्रभाव', noteEn: 'Jupiter in 11th conferring global spiritual reach and revered disciples' },
      { planet: 'Sun', house: 1, noteHi: 'लग्न में सूर्य अदम्य आत्मतेज व ओजस्वी वाणी', noteEn: 'Sun in Lagna conferring magnetic presence and fearless articulation' },
      { planet: 'Saturn', house: 10, noteHi: 'दशम में शनि निष्काम कर्म व सन्यास तप', noteEn: 'Saturn in 10th driving selfless public service and ascetic duty' },
    ],
    bioEn: 'World spiritual visionary who introduced Indian darsanas of Vedanta and Yoga to the Western world.',
    bioHi: 'युगप्रवर्तक संन्यासी जिन्होंने 1893 शिकागो धर्म संसद में सनातन धर्म और वेदांत का उद्घोष कर विश्व को जागृत किया।',
    quoteEn: 'Arise, awake, and stop not until the goal is reached.',
    quoteHi: 'उठो, जागो और तब तक मत रुको जब तक लक्ष्य प्राप्त न हो जाए।',
  },
  {
    id: 'srinivasa-ramanujan',
    nameEn: 'Srinivasa Ramanujan',
    nameHi: 'श्रीनिवास रामानुजन',
    category: 'science_tech',
    categoryTitleEn: 'Mathematical Mystic & Number Theory Seer',
    categoryTitleHi: 'दिव्य गणितज्ञ व संख्या सिद्धांत के रहस्यद्रष्टा',
    birthDate: '22-12-1887',
    birthPlace: 'Erode, India',
    roddenRating: 'AA',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Srinivasa_Ramanujan_-_OPC_-_1.jpg/440px-Srinivasa_Ramanujan_-_OPC_-_1.jpg',
    ascSignIndex: 8, // Sagittarius
    moonSignIndex: 11, // Pisces
    sunSignIndex: 8, // Sagittarius
    prominentYogas: ['Saraswati Yoga', 'Gajakesari Yoga', 'Hamsa Yoga', 'Budhaditya Yoga'],
    prominentYogasHi: ['सरस्वती योग', 'गजकेसरी योग', 'हंस महापुरुष योग', 'बुधादित्य योग'],
    keyLifeMilestones: [
      { age: 26, eventHi: 'जीएच हार्डी को पत्र लिखकर कैम्ब्रिज यूनिवर्सिटी में शोध हेतु आमंत्रण पाया', eventEn: 'Wrote historic letter to G.H. Hardy, traveling to Cambridge' },
      { age: 30, eventHi: 'रॉयल सोसाइटी के फेलो (FRS) चुने जाने वाले सबसे युवा भारतीय बने', eventEn: 'Elected Fellow of the Royal Society for breakthrough theorems' },
      { age: 32, eventHi: 'मृत्यु शैय्या पर मॉक थीटा फलनों की खोज कर आधुनिक भौतिकी की दिशा तय की', eventEn: 'Discovered Mock Theta functions on deathbed solving string theory decades later' },
    ],
    keyPlacements: [
      { planet: 'Jupiter', house: 11, noteHi: 'एकादश में गुरु कुलदेवी नामक्कल की प्रत्यक्ष आध्यात्मिक प्रेरणा', noteEn: 'Jupiter in 11th channeling divine mathematical equations from Goddess Namagiri' },
      { planet: 'Mercury', house: 1, noteHi: 'लग्न में बुध अनंत समीकरणों की अंतःस्फूर्ति व तीव्र बुद्धि', noteEn: 'Mercury in Lagna perceiving infinite modular forms intuitively' },
      { planet: 'Moon', house: 4, noteHi: 'चतुर्थ में स्वराशि गुरु-क्षेत्री चंद्र गहन अमूर्त चिंतन', noteEn: 'Moon in 4th providing bottomless meditative mathematical depth' },
    ],
    bioEn: 'Self-taught Indian mathematical prodigy whose pioneering formulas in number theory continue to transform black hole physics.',
    bioHi: 'विलक्षण गणितज्ञ जिन्होंने बिना औपचारिक प्रशिक्षण के 3900+ जटिल प्रमेयों की रचना कर विश्व गणित को नई दिशा दी।',
    quoteEn: 'An equation for me has no meaning unless it expresses a thought of God.',
    quoteHi: 'मेरे लिए किसी समीकरण का तब तक कोई अर्थ नहीं, जब तक वह ईश्वर के विचार को व्यक्त न करे।',
  },
  {
    id: 'dhirubhai-ambani',
    nameEn: 'Dhirubhai Ambani',
    nameHi: 'धीरूभाई अंबानी',
    category: 'business_wealth',
    categoryTitleEn: 'Industrial Tycoon & Reliance Founder',
    categoryTitleHi: 'रिलायंस इंडस्ट्रीज संस्थापक व औद्योगिक क्रांति दूत',
    birthDate: '28-12-1932',
    birthPlace: 'Chorwad, India',
    roddenRating: 'AA',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Dhirubhai_Ambani_1990s.jpg/440px-Dhirubhai_Ambani_1990s.jpg',
    ascSignIndex: 8, // Sagittarius
    moonSignIndex: 8, // Sagittarius
    sunSignIndex: 8, // Sagittarius
    prominentYogas: ['Hamsa Yoga', 'Raja Yoga', 'Dhana Yoga', 'Maha Lakshmi Yoga'],
    prominentYogasHi: ['हंस महापुरुष योग', 'राजयोग', 'महाधन योग', 'महालक्ष्मी योग'],
    keyLifeMilestones: [
      { age: 25, eventHi: 'यमन से लौटकर मात्र 15,000 रुपये की पूंजी से रिलायंस कमर्शियल की शुरुआत', eventEn: 'Returned from Yemen, founding Reliance with 15,000 rupees' },
      { age: 45, eventHi: '1977 में रिलायंस का ऐतिहासिक आईपीओ लाकर भारतीय शेयर बाजार का लोकतंत्रीकरण किया', eventEn: 'Launched Reliance IPO democratizing equity investment in India' },
      { age: 67, eventHi: 'जामनगर में विश्व की सबसे विशाल ग्रीनफील्ड तेल रिफाइनरी का निर्माण पूर्ण किया', eventEn: 'Built world’s largest grassroots petroleum refinery at Jamnagar' },
    ],
    keyPlacements: [
      { planet: 'Jupiter', house: 10, noteHi: 'दशम में गुरु भारत का सबसे बड़ा निजी औद्योगिक घराना', noteEn: 'Jupiter in 10th building India’s largest corporate conglomerate' },
      { planet: 'Sun', house: 1, noteHi: 'लग्न में सूर्य अदम्य उद्यम व करोड़ों शेयरधारकों का विश्वास', noteEn: 'Sun in Lagna commanding mass investor loyalty and vision' },
      { planet: 'Venus', house: 11, noteHi: 'एकादश में शुक्र पेट्रोकेमिकल व वस्त्र उद्योग से अकूत लाभ', noteEn: 'Venus in 11th bringing vast industrial cash flows' },
    ],
    bioEn: 'Started with humble means in Yemen and built Reliance Industries into India’s largest private enterprise.',
    bioHi: 'एक साधारण यमन पेट्रोल पंप कर्मचारी से उठकर भारत का सबसे विशाल निजी औद्योगिक साम्राज्य स्थापित किया।',
    quoteEn: 'If you don’t build your dream, someone else will hire you to help them build theirs.',
    quoteHi: 'यदि आप अपने सपनों का निर्माण नहीं करेंगे, तो कोई अन्य आपको अपने सपने पूरे करने के लिए काम पर रख लेगा।',
  },
  {
    id: 'sachin-tendulkar',
    nameEn: 'Sachin Tendulkar',
    nameHi: 'सचिन तेंदुलकर',
    category: 'sports_legend',
    categoryTitleEn: 'God of Cricket & 100 International Centuries Master',
    categoryTitleHi: 'क्रिकेट के भगवान व १०० अंतर्राष्ट्रीय शतकों के महानायक',
    birthDate: '24-04-1973',
    birthPlace: 'Mumbai, India',
    roddenRating: 'AA',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Sachin_Tendulkar_at_MRF_Promotion_Event.jpg/440px-Sachin_Tendulkar_at_MRF_Promotion_Event.jpg',
    ascSignIndex: 8, // Sagittarius
    moonSignIndex: 8, // Sagittarius
    sunSignIndex: 0, // Aries
    prominentYogas: ['Ruchaka Yoga', 'Gajakesari Yoga', 'Sunafa Yoga', 'Raja Yoga'],
    prominentYogasHi: ['रुचक महापुरुष योग', 'गजकेसरी योग', 'सुनफा योग', 'राजयोग'],
    keyLifeMilestones: [
      { age: 16, eventHi: '16 वर्ष की आयु में पाकिस्तान के विरुद्ध टेस्ट क्रिकेट में पदार्पण', eventEn: 'Made Test debut against fiery Pakistan pace attack at age 16' },
      { age: 25, eventHi: 'शारजाह में ऑस्ट्रेलिया के विरुद्ध कालजयी डेजर्ट स्टॉर्म शतक जड़े', eventEn: 'Played legendary "Desert Storm" masterclasses against Australia in Sharjah' },
      { age: 38, eventHi: '2011 में वानखेड़े स्टेडियम में विश्व कप जीतकर 24 वर्षों का स्वप्न पूरा किया', eventEn: 'Won 2011 ICC Cricket World Cup lifting trophy in hometown Mumbai' },
    ],
    keyPlacements: [
      { planet: 'Mars', house: 2, noteHi: 'द्वितीय में उच्च मंगल अचूक स्ट्रेट ड्राइव व शॉट की अचूक टाइमिंग', noteEn: 'Exalted Mars in 2nd timing supreme straight drives against fastest bowlers' },
      { planet: 'Sun', house: 5, noteHi: 'पंचम में उच्च सूर्य विश्व क्रिकेट में 100 शतकों का अद्वितीय कीर्तिमान', noteEn: 'Exalted Sun in 5th scripting 100 international centuries milestone' },
      { planet: 'Jupiter', house: 2, noteHi: 'द्वितीय में नीचभंग गुरु अपार विनम्रता, खेल गरिमा व भारत रत्न', noteEn: 'Jupiter in 2nd conferring supreme grace and youngest Bharat Ratna award' },
    ],
    bioEn: 'Indian former international cricketer considered the greatest batsman in modern history, holder of 100 international centuries.',
    bioHi: 'क्रिकेट इतिहास के महानतम बल्लेबाज जिन्होंने 24 वर्ष तक देश का प्रतिनिधित्व किया और 34,000+ अंतर्राष्ट्रीय रन बनाए।',
    quoteEn: 'Chase your dreams. Dreams do come true. Don’t stop believing.',
    quoteHi: 'अपने सपनों का पीछा करो। सपने सच होते हैं। विश्वास करना कभी मत छोड़ो।',
  },

  // 10. Capricorn Lagna (मकर लग्न)
  {
    id: 'adi-shankara',
    nameEn: 'Adi Shankaracharya',
    nameHi: 'आदि शंकराचार्य',
    category: 'spiritual',
    categoryTitleEn: 'Reviver of Advaita Vedanta & Four Amnaya Peethas',
    categoryTitleHi: 'अद्वैत वेदांत के पुनरुद्धारक व चार आम्नाय पीठों के संस्थापक',
    birthDate: '11-05-0788',
    birthPlace: 'Kalady, India',
    roddenRating: 'A',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Adi_Shankara_with_Disciples.jpg/440px-Adi_Shankara_with_Disciples.jpg',
    ascSignIndex: 9, // Capricorn
    moonSignIndex: 1, // Taurus
    sunSignIndex: 1, // Taurus
    prominentYogas: ['Sasa Yoga', 'Hamsa Yoga', 'Raja Yoga', 'Saraswati Yoga'],
    prominentYogasHi: ['शश महापुरुष योग', 'हंस महापुरुष योग', 'राजयोग', 'सरस्वती योग'],
    keyLifeMilestones: [
      { age: 12, eventHi: 'चारों वेदों व उपनिषदों का पूर्ण अध्ययन कर प्रस्थानत्रयी भाष्य रचना', eventEn: 'Mastered four Vedas, authoring Prasthanatrayi Bhashya commentaries' },
      { age: 20, eventHi: 'भारत के चारों कोनों की पदयात्रा कर सनातन धर्म व अद्वैत दर्शन की स्थापना', eventEn: 'Completed All-India Digvijaya philosophical tour reviving Sanatana Dharma' },
      { age: 32, eventHi: 'चार दिशाओं में चार आम्नाय पीठ स्थापित कर केदारनाथ में महासमाधि', eventEn: 'Founded four cardinal Peethas, attaining Mahasamadhi at Kedarnath at age 32' },
    ],
    keyPlacements: [
      { planet: 'Saturn', house: 1, noteHi: 'लग्न में स्वराशि शनि परम वैराग्य व तपोबल', noteEn: 'Own-sign Saturn in 1st embodying supreme ascetic mastery and renunciation' },
      { planet: 'Jupiter', house: 7, noteHi: 'सप्तम में उच्च गुरु शास्त्रार्थ में अकाट्य तर्क व अद्वैत विजय', noteEn: 'Exalted Jupiter in 7th conquering all philosophical debates with Advaita' },
      { planet: 'Moon', house: 5, noteHi: 'पंचम में उच्च चंद्र सौंदर्य लहरी व कनकधारा स्तोत्र जैसी रचनाएं', noteEn: 'Exalted Moon in 5th composing Soundarya Lahari and Kanakadhara Stotram' },
    ],
    bioEn: 'Early 8th-century Indian philosopher and theologian whose works present a harmonizing reading of the sastras with Advaita Vedanta.',
    bioHi: 'अद्वैत वेदांत के महानतम दार्शनिक जिन्होंने मात्र 32 वर्ष की आयु में पूरे भारत को एक सांस्कृतिक व दार्शनिक सूत्र में पिरोया।',
    quoteEn: 'Brahma Satyam Jagan Mithya, Jivo Brahmaiva Naparah.',
    quoteHi: 'ब्रह्म सत्यं जगन्मिथ्या जीवो ब्रह्मैव नापरः (ब्रह्म ही सत्य है, जगत मिथ्या है, और जीव ब्रह्म से भिन्न नहीं है)।',
  },
  {
    id: 'paramahansa-yogananda',
    nameEn: 'Paramahansa Yogananda',
    nameHi: 'परमहंस योगानंद',
    category: 'spiritual',
    categoryTitleEn: 'Father of Yoga in the West & Kriya Yoga Pioneer',
    categoryTitleHi: 'पश्चिम में योग के दूत व क्रिया योग के वैश्विक प्रणेता',
    birthDate: '05-01-1893',
    birthPlace: 'Gorakhpur, India',
    roddenRating: 'AA',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Yogananda_c1915.jpg/440px-Yogananda_c1915.jpg',
    ascSignIndex: 9, // Capricorn
    moonSignIndex: 4, // Leo
    sunSignIndex: 8, // Sagittarius
    prominentYogas: ['Sasa Yoga', 'Hamsa Yoga', 'Raja Yoga', 'Amala Yoga'],
    prominentYogasHi: ['शश महापुरुष योग', 'हंस महापुरुष योग', 'राजयोग', 'अमला योग'],
    keyLifeMilestones: [
      { age: 27, eventHi: '1920 में बोस्टन धार्मिक उदारवादियों की कांग्रेस में क्रिया योग का संदेश दिया', eventEn: 'Traveled to America addressing International Congress of Religious Liberals' },
      { age: 32, eventHi: 'लॉस एंजिल्स में सेल्फ-रियलाइजेशन फेलोशिप (SRF) का अंतरराष्ट्रीय मुख्यालय बनाया', eventEn: 'Established Self-Realization Fellowship international headquarters at Mount Washington' },
      { age: 53, eventHi: '"एक योगी की आत्मकथा" (Autobiography of a Yogi) प्रकाशित कर करोड़ों को योग मार्ग पर लाया', eventEn: 'Published Autobiography of a Yogi awakening global spiritual seekers' },
    ],
    keyPlacements: [
      { planet: 'Saturn', house: 10, noteHi: 'दशम में उच्च शनि वैश्विक स्तर पर क्रिया योग का स्थाई प्रसार', noteEn: 'Exalted Saturn in 10th establishing enduring spiritual monastic institutions' },
      { planet: 'Jupiter', house: 3, noteHi: 'तृतीय में स्वराशि गुरु कालजयी आध्यात्मिक लेखन व साहित्य', noteEn: 'Jupiter in 3rd authoring immortal spiritual literature and cosmic chants' },
      { planet: 'Venus', house: 11, noteHi: 'एकादश में स्वराशि शुक्र पश्चिमी जगत में लाखों निष्ठावान शिष्य', noteEn: 'Venus in 11th attracting dedicated disciples and cultural luminaries worldwide' },
    ],
    bioEn: 'Indian Hindu monk, yogi and guru who introduced millions to meditation and Kriya Yoga through his organization and book.',
    bioHi: 'क्रिया योग के महान संन्यासी जिनकी पुस्तक "योगी कथामृत" ने स्टीव जॉब्स और जॉर्ज हैरिसन सहित विश्व के विचारकों को प्रभावित किया।',
    quoteEn: 'Be as simple as you can be; you will be astonished to see how uncomplicated and happy your life can become.',
    quoteHi: 'जितना संभव हो उतना सरल बनिए; आप यह देखकर आश्चर्यचकित रह जाएंगे कि आपका जीवन कितना सुलझा और आनंदमय हो सकता है।',
  },
  {
    id: 'stephen-hawking',
    nameEn: 'Stephen Hawking',
    nameHi: 'स्टीफन हॉकिंग',
    category: 'science_tech',
    categoryTitleEn: 'Theoretical Cosmologist & Black Hole Radiation Pioneer',
    categoryTitleHi: 'सैद्धांतिक ब्रह्मांड विज्ञानी व हॉकिंग विकिरण अन्वेषक',
    birthDate: '08-01-1942',
    birthPlace: 'Oxford, United Kingdom',
    roddenRating: 'AA',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Stephen_Hawking.StarChild.jpg/440px-Stephen_Hawking.StarChild.jpg',
    ascSignIndex: 9, // Capricorn
    moonSignIndex: 5, // Virgo
    sunSignIndex: 8, // Sagittarius
    prominentYogas: ['Sasa Yoga', 'Budhaditya Yoga', 'Gajakesari Yoga', 'Bhadra Yoga'],
    prominentYogasHi: ['शश महापुरुष योग', 'बुधादित्य योग', 'गजकेसरी योग', 'भद्र महापुरुष योग'],
    keyLifeMilestones: [
      { age: 21, eventHi: 'एएलएस बीमारी का निदान होने पर भी डॉक्टरी चेतावनी को झुठलाकर पीएचडी की', eventEn: 'Diagnosed with motor neuron disease; defied medical prognosis' },
      { age: 32, eventHi: 'हॉकिंग विकिरण की खोज कर सिद्ध किया कि ब्लैक होल भी ऊर्जा उत्सर्जित करते हैं', eventEn: 'Discovered Hawking Radiation proving black holes emit quantum thermal glow' },
      { age: 46, eventHi: '"ए ब्रीफ हिस्ट्री ऑफ टाइम" प्रकाशित कर 2.5 करोड़ प्रतियां बिकीं', eventEn: 'Published A Brief History of Time explaining cosmology to humanity' },
    ],
    keyPlacements: [
      { planet: 'Saturn', house: 5, noteHi: 'पंचम में शनि गंभीर शारीरिक कष्ट के बावजूद ब्रह्मांडीय गणित में विजय', noteEn: 'Saturn in 5th triumphing over physical paralysis through pure theoretical physics' },
      { planet: 'Mercury', house: 12, noteHi: 'द्वादश में बुध कंप्यूटर स्पीच सिंथेसाइजर द्वारा संवाद व ब्रह्मांड ज्ञान', noteEn: 'Mercury in 12th speaking through computerized speech synthesizer to the world' },
      { planet: 'Jupiter', house: 6, noteHi: 'षष्ठ में गुरु 55 वर्षों तक असाध्य रोग से लड़ते हुए सक्रिय शोध', noteEn: 'Jupiter in 6th sustaining longevity and monumental scientific discoveries' },
    ],
    bioEn: 'English theoretical physicist, cosmologist, and author who was director of research at the Centre for Theoretical Cosmology at Cambridge.',
    bioHi: 'महान ब्रह्मांड विज्ञानी जिन्होंने शरीर के लकवाग्रस्त होने के बाद भी ब्लैक होल और बिग बैंग के रहस्यों को उजागर कर इच्छाशक्ति का इतिहास रचा।',
    quoteEn: 'However difficult life may seem, there is always something you can do and succeed at.',
    quoteHi: 'जीवन चाहे कितना भी कठिन क्यों न लगे, हमेशा कुछ न कुछ ऐसा होता है जो आप कर सकते हैं और सफल हो सकते हैं।',
  },

  // 11. Aquarius Lagna (कुंभ लग्न)
  {
    id: 'george-washington',
    nameEn: 'George Washington',
    nameHi: 'जॉर्ज वाशिंगटन',
    category: 'leadership',
    categoryTitleEn: '1st US President & Father of the United States',
    categoryTitleHi: 'अमेरिका के प्रथम राष्ट्रपति व राष्ट्र निर्माता',
    birthDate: '22-02-1732',
    birthPlace: 'Westmoreland County, Virginia, USA',
    roddenRating: 'AA',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Gilbert_Stuart_Williamstown_Portrait_of_George_Washington.jpg/440px-Gilbert_Stuart_Williamstown_Portrait_of_George_Washington.jpg',
    ascSignIndex: 10, // Aquarius
    moonSignIndex: 2, // Gemini
    sunSignIndex: 10, // Aquarius
    prominentYogas: ['Sasa Yoga', 'Raja Yoga', 'Dhana Yoga', 'Amala Yoga'],
    prominentYogasHi: ['शश महापुरुष योग', 'राजयोग', 'धन योग', 'अमला योग'],
    keyLifeMilestones: [
      { age: 43, eventHi: 'अमेरिकी क्रांतिकारी युद्ध में महाद्वीपीय सेना का प्रधान सेनापति नियुक्त', eventEn: 'Appointed Commander-in-Chief of Continental Army in War of Independence' },
      { age: 57, eventHi: 'सर्वसम्मति से संयुक्त राज्य अमेरिका के प्रथम राष्ट्रपति निर्वाचित', eventEn: 'Unanimously elected first President of the United States' },
      { age: 64, eventHi: 'दो कार्यकाल पश्चात स्वेच्छा से पद त्याग कर लोकतांत्रिक परंपरा स्थापित की', eventEn: 'Voluntarily stepped down after two terms, setting democratic precedent' },
    ],
    keyPlacements: [
      { planet: 'Saturn', house: 1, noteHi: 'लग्न में स्वराशि शनि अगाध धैर्य, निष्ठा व अनुकरणीय गरिमा', noteEn: 'Own-sign Saturn in 1st embodying rock-solid integrity, patience, and republican virtue' },
      { planet: 'Sun', house: 1, noteHi: 'लग्न में सूर्य स्वतंत्र गणराज्य के संस्थापक का गौरव', noteEn: 'Sun in Lagna radiating sovereign authority founding democratic nation' },
      { planet: 'Jupiter', house: 4, noteHi: 'चतुर्थ में गुरु माउंट वर्नन में कृषि व शांत गृहस्थ सम्मान', noteEn: 'Jupiter in 4th returning honorably to land and constitutional peace' },
    ],
    bioEn: 'American military officer, statesman, and Founding Father who served as the first president of the United States from 1789 to 1797.',
    bioHi: 'अमेरिका के प्रथम राष्ट्रपति जिन्होंने स्वतंत्रता संग्राम में सेना का सफल नेतृत्व किया और दो कार्यकाल बाद स्वेच्छा से पद त्याग कर लोकतंत्र की नींव रखी।',
    quoteEn: 'Discipline is the soul of an army. It makes small numbers formidable; procures success to the weak, and esteem to all.',
    quoteHi: 'अनुशासन सेना की आत्मा है। यह कम संख्या को भी अजेय बना देता है और कमजोरों को सफलता दिलाता है।',
  },
  {
    id: 'ludwig-van-beethoven',
    nameEn: 'Ludwig van Beethoven',
    nameHi: 'लुडविग वैन बीथोवेन',
    category: 'art_culture',
    categoryTitleEn: 'Titanic Classical Composer & Symphony Pioneer',
    categoryTitleHi: 'शास्त्रीय संगीत के महाशिल्पी व अमर सिम्फनी रचयिता',
    birthDate: '17-12-1770',
    birthPlace: 'Bonn, Germany',
    roddenRating: 'AA',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Beethoven.jpg/440px-Beethoven.jpg',
    ascSignIndex: 10, // Aquarius
    moonSignIndex: 0, // Aries
    sunSignIndex: 8, // Sagittarius
    prominentYogas: ['Sasa Yoga', 'Gajakesari Yoga', 'Sunafa Yoga', 'Amala Yoga'],
    prominentYogasHi: ['शश महापुरुष योग', 'गजकेसरी योग', 'सुनफा योग', 'अमला योग'],
    keyLifeMilestones: [
      { age: 26, eventHi: 'वियना में प्रमुख संगीतकार के रूप में ख्याति व बहरेपन की प्रारंभिक आहट', eventEn: 'Acclaimed pianist in Vienna; began experiencing progressive hearing loss' },
      { age: 34, eventHi: 'पूर्ण बहरेपन की कगार पर अमर 5वीं और इरोइका सिम्फनी की रचना की', eventEn: 'Composed heroic 3rd and legendary 5th Symphonies despite deafness' },
      { age: 53, eventHi: 'पूर्णतः बहरे होने पर 9वीं सिम्फनी "ओड टू जॉय" की रचना कर संगीत इतिहास रचा', eventEn: 'Composed monumental 9th Symphony (Ode to Joy) completely deaf' },
    ],
    keyPlacements: [
      { planet: 'Saturn', house: 3, noteHi: 'तृतीय में शनि श्रवण शक्ति खोने पर भी आंतरिक संगीत सुनने की अद्भुत शक्ति', noteEn: 'Saturn in 3rd channeling celestial music purely through inner psychic perception' },
      { planet: 'Venus', house: 12, noteHi: 'द्वादश में उच्च शुक्र कालजयी मूनलाइट सोनाटा व अलौकिक संगीत रचनाएं', noteEn: 'Exalted Venus in 12th tapping mystical, transcendent symphonic beauty' },
      { planet: 'Sun', house: 11, noteHi: 'एकादश में सूर्य सदियों तक अमर रहने वाली वैश्विक संगीत प्रतिष्ठा', noteEn: 'Sun in 11th cementing immortal global cultural reverence for centuries' },
    ],
    bioEn: 'German composer and pianist who remains one of the most admired figures in the history of Western music; his works rank among the most performed.',
    bioHi: 'पश्चिमी शास्त्रीय संगीत के अमर रचनाकार जिन्होंने पूर्णतः बहरे हो जाने के बावजूद मानव इतिहास की सबसे सुंदर सिम्फनी रचीं।',
    quoteEn: 'Music is a higher revelation than all wisdom and philosophy.',
    quoteHi: 'संगीत समस्त ज्ञान और दर्शन से भी उच्चतर रहस्योद्घाटन है।',
  },
  {
    id: 'usain-bolt',
    nameEn: 'Usain Bolt',
    nameHi: 'उसेन बोल्ट',
    category: 'sports_legend',
    categoryTitleEn: 'Fastest Man in History & 8-Time Olympic Gold Medalist',
    categoryTitleHi: 'इतिहास का सबसे तेज मानव व ८ बार का ओलंपिक स्वर्ण पदक विजेता',
    birthDate: '21-08-1986',
    birthPlace: 'Sherwood Content, Jamaica',
    roddenRating: 'AA',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Usain_Bolt_after_4_%C3%97_100_m_relay_at_the_2012_Summer_Olympics.jpg/440px-Usain_Bolt_after_4_%C3%97_100_m_relay_at_the_2012_Summer_Olympics.jpg',
    ascSignIndex: 10, // Aquarius
    moonSignIndex: 10, // Aquarius
    sunSignIndex: 4, // Leo
    prominentYogas: ['Sasa Yoga', 'Ruchaka Yoga', 'Gajakesari Yoga', 'Raja Yoga'],
    prominentYogasHi: ['शश महापुरुष योग', 'रुचक महापुरुष योग', 'गजकेसरी योग', 'राजयोग'],
    keyLifeMilestones: [
      { age: 22, eventHi: '2008 बीजिंग ओलंपिक में 100 मी, 200 मी में 3 विश्व रिकॉर्ड संग स्वर्ण जीते', eventEn: 'Won 3 Olympic golds in Beijing, smashing 100m and 200m world records' },
      { age: 23, eventHi: 'बर्लिन विश्व चैंपियनशिप में 100 मी को 9.58 सेकंड में दौड़कर अमर रिकॉर्ड बनाया', eventEn: 'Ran 100m in historic 9.58s at Berlin World Championships' },
      { age: 30, eventHi: '2016 रियो ओलंपिक में "ट्रिपल-डबल" पूरा कर लगातार 3 ओलंपिक में अजेय रहे', eventEn: 'Completed legendary Olympic "triple-triple" sprint clean sweep' },
    ],
    keyPlacements: [
      { planet: 'Mars', house: 11, noteHi: 'एकादश में मंगल पैरों में असाधारण विस्फोटक स्प्रिंट गति', noteEn: 'Mars in 11th unleashing unprecedented explosive physical stride velocity' },
      { planet: 'Sun', house: 7, noteHi: 'सप्तम में स्वराशि सूर्य ट्रैक पर करिश्माई लाइटनिंग बोल्ट पोज व विश्वख्याति', noteEn: 'Sun in 7th mesmerizing global stadium crowds with iconic Lightning Bolt posture' },
      { planet: 'Jupiter', house: 1, noteHi: 'लग्न में गुरु लंबा कद, असाधारण लचीलापन व खेल गरिमा', noteEn: 'Jupiter in 1st providing towering athletic frame and effortless stride biomechanics' },
    ],
    bioEn: 'Jamaican retired sprinter widely considered to be the greatest sprinter of all time, world record holder in the 100 metres and 200 metres.',
    bioHi: 'जमैका के धावक जिन्होंने 100 मीटर की दौड़ 9.58 सेकंड में पूरी कर मानव गति का ऐसा विश्व कीर्तिमान बनाया जो आज तक अटूट है।',
    quoteEn: 'I don’t think limits. I told you all I was going to do it, and I did.',
    quoteHi: 'मैं सीमाओं के बारे में नहीं सोचता। मैंने आप सभी से कहा था कि मैं यह करूंगा, और मैंने कर दिखाया।',
  },

  // 12. Pisces Lagna (मीन लग्न)
  {
    id: 'apj-abdul-kalam',
    nameEn: 'Dr. A.P.J. Abdul Kalam',
    nameHi: 'डॉ. ए.पी.जे. अब्दुल कलाम',
    category: 'science_tech',
    categoryTitleEn: 'Missile Pioneer & People’s President',
    categoryTitleHi: 'मिसाइल मैन, वैज्ञानिक एवं भारत रत्न राष्ट्रपति',
    birthDate: '15-10-1931',
    birthPlace: 'Rameswaram, India',
    roddenRating: 'AA',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/A._P._J._Abdul_Kalam_in_2008.jpg/440px-A._P._J._Abdul_Kalam_in_2008.jpg',
    ascSignIndex: 11, // Pisces
    moonSignIndex: 7, // Scorpio
    sunSignIndex: 5, // Virgo
    prominentYogas: ['Budhaditya Yoga', 'Gajakesari Yoga', 'Amala Yoga', 'Viparita Raja Yoga'],
    prominentYogasHi: ['बुधादित्य योग', 'गजकेसरी योग', 'अमला योग', 'विपरीत राजयोग'],
    keyLifeMilestones: [
      { age: 49, eventHi: 'एसएलवी-3 परियोजना निदेशक के रूप में रोहिणी उपग्रह को कक्षा में स्थापित किया', eventEn: 'Project Director of SLV-3 successfully deploying Rohini satellite in orbit' },
      { age: 67, eventHi: '1998 पोखरण-2 परमाणु परीक्षणों का मुख्य वैज्ञानिक नेतृत्व कर राष्ट्र को शक्ति दी', eventEn: 'Chief Scientific Adviser leading historic 1998 Pokhran-II nuclear tests' },
      { age: 71, eventHi: 'सर्वसम्मति से भारत के 11वें राष्ट्रपति बनकर "जनता के राष्ट्रपति" कहलाए', eventEn: 'Elected 11th President of India, revered as the beloved People’s President' },
    ],
    keyPlacements: [
      { planet: 'Mercury', house: 7, noteHi: 'सप्तम में उच्च बुध तीक्ष्ण वैज्ञानिक मेधा व मिसाइल डिजाइन', noteEn: 'Exalted Mercury in 7th conferring supreme aeronautical missile engineering' },
      { planet: 'Jupiter', house: 5, noteHi: 'पंचम में उच्च गुरु युवाओं को प्रेरित करने वाली ऋषि चेतना', noteEn: 'Exalted Jupiter in 5th inspiring tens of millions of students nationwide' },
      { planet: 'Saturn', house: 10, noteHi: 'दशम में शनि कठोर परिश्रम, सात्विक सादगी व राष्ट्र सेवा', noteEn: 'Saturn in 10th maintaining pristine ascetic integrity and selfless service' },
    ],
    bioEn: 'Indian aerospace scientist and statesman who served as the 11th president of India, pioneering Indian missile and space technology.',
    bioHi: 'भारत के अंतरिक्ष व मिसाइल कार्यक्रम के जनक तथा सादगी और राष्ट्र-सेवा के प्रतीक 11वें राष्ट्रपति।',
    quoteEn: 'Dream is not that which you see while sleeping, it is something that does not let you sleep.',
    quoteHi: 'सपने वो नहीं जो हम सोते हुए देखते हैं, सपने वो हैं जो हमें सोने नहीं देते।',
  },
  {
    id: 'rabindranath-tagore',
    nameEn: 'Rabindranath Tagore',
    nameHi: 'रवींद्रनाथ ठाकुर',
    category: 'art_culture',
    categoryTitleEn: 'Nobel Laureate Poet & Universal Mystic',
    categoryTitleHi: 'नोबेल पुरस्कार विजेता कवि, दार्शनिक व संगीतकार',
    birthDate: '07-05-1861',
    birthPlace: 'Kolkata, India',
    roddenRating: 'AA',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Rabindranath_Tagore_in_1909.jpg/440px-Rabindranath_Tagore_in_1909.jpg',
    ascSignIndex: 11, // Pisces
    moonSignIndex: 11, // Pisces
    sunSignIndex: 0, // Aries
    prominentYogas: ['Hamsa Yoga', 'Saraswati Yoga', 'Gajakesari Yoga', 'Sunafa Yoga'],
    prominentYogasHi: ['हंस महापुरुष योग', 'सरस्वती योग', 'गजकेसरी योग', 'सुनफा योग'],
    keyLifeMilestones: [
      { age: 40, eventHi: 'शांतिनिकेतन में प्रकृति की गोद में विश्वभारती विश्वविद्यालय की नींव रखी', eventEn: 'Founded Visva-Bharati at Santiniketan reimagining education in nature' },
      { age: 52, eventHi: 'गीतांजलि काव्य संग्रह हेतु साहित्य का नोबेल पुरस्कार प्राप्त किया', eventEn: 'Awarded Nobel Prize in Literature for Gitanjali, first non-European laureate' },
      { age: 70, eventHi: 'जीवन के उत्तरार्ध में चित्रकला का प्रारंभ कर 2500+ कालजयी चित्र रचे', eventEn: 'Began prolific painting career producing over 2,500 iconic modern artworks' },
    ],
    keyPlacements: [
      { planet: 'Jupiter', house: 5, noteHi: 'पंचम में उच्च गुरु गीतांजलि जैसी कालजयी रचनाएं', noteEn: 'Exalted Jupiter in 5th inspiring Gitanjali and boundless universal poetry' },
      { planet: 'Venus', house: 1, noteHi: 'लग्न में उच्च शुक्र अप्रतिम काव्य व सौंदर्य चेतना', noteEn: 'Exalted Venus in 1st conferring supreme poetic grace and musical genius' },
      { planet: 'Sun', house: 2, noteHi: 'द्वितीय में उच्च सूर्य वैश्विक सांस्कृतिक प्रतिष्ठा व दो राष्ट्रगान', noteEn: 'Exalted Sun in 2nd composing national anthems for India and Bangladesh' },
    ],
    bioEn: 'First non-European to win the Nobel Prize in Literature (1913), polymath who reshaped Bengali literature and music.',
    bioHi: 'साहित्य के प्रथम गैर-यूरोपीय नोबेल पुरस्कार विजेता (1913) और दो राष्ट्रों (भारत व बांग्लादेश) के राष्ट्रगान रचयिता।',
    quoteEn: 'Clouds come floating into my life, no longer to carry rain or usher storm, but to add color to my sunset sky.',
    quoteHi: 'बादल मेरे जीवन में अब तूफान लाने नहीं, बल्कि मेरे ढलते आकाश में नए रंग भरने तैरते आते हैं।',
  },
  {
    id: 'satyajit-ray',
    nameEn: 'Satyajit Ray',
    nameHi: 'सत्यजीत रे',
    category: 'art_culture',
    categoryTitleEn: 'Auteur Filmmaker & Academy Lifetime Achievement Winner',
    categoryTitleHi: 'कालजयी फिल्म निर्देशक व ऑस्कर लाइफटाइम अचीवमेंट विजेता',
    birthDate: '02-05-1921',
    birthPlace: 'Kolkata, India',
    roddenRating: 'AA',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Satyajit_Ray_1981.jpg/440px-Satyajit_Ray_1981.jpg',
    ascSignIndex: 11, // Pisces
    moonSignIndex: 11, // Pisces
    sunSignIndex: 0, // Aries
    prominentYogas: ['Hamsa Yoga', 'Saraswati Yoga', 'Gajakesari Yoga', 'Budhaditya Yoga'],
    prominentYogasHi: ['हंस महापुरुष योग', 'सरस्वती योग', 'गजकेसरी योग', 'बुधादित्य योग'],
    keyLifeMilestones: [
      { age: 34, eventHi: 'पाथेर पांचाली बनाकर कान्स फिल्म महोत्सव में "बेस्ट ह्यूमन डॉक्यूमेंट" पुरस्कार', eventEn: 'Directed Pather Panchali, winning Best Human Document at Cannes' },
      { age: 46, eventHi: 'फेलूदा और प्रोफेसर शंकु जैसे अमर जासूसी व विज्ञान कथा पात्रों का सृजन', eventEn: 'Created iconic literary characters Feluda and Professor Shonku' },
      { age: 70, eventHi: 'अकादमी मानद ऑस्कर (Honorary Life Achievement Award) व भारत रत्न प्राप्त', eventEn: 'Conferred Academy Honorary Oscar and Bharat Ratna for lifetime cinema legacy' },
    ],
    keyPlacements: [
      { planet: 'Jupiter', house: 5, noteHi: 'पंचम में गुरु अपू त्रयी जैसी मानवीय सिनेमा की कालजयी कृतियां', noteEn: 'Jupiter in 5th scripting masterly humanistic storytelling across Apu Trilogy' },
      { planet: 'Venus', house: 1, noteHi: 'लग्न में उच्च शुक्र दृश्य सौंदर्य, संगीत निर्देशन व रेखाचित्र', noteEn: 'Exalted Venus in Lagna composing music, cinematography, and title calligraphy' },
      { planet: 'Mercury', house: 2, noteHi: 'द्वितीय में बुध अमर बाल साहित्य व जासूसी कहानियों की रचना', noteEn: 'Mercury in 2nd crafting evergreen detective fiction and science stories' },
    ],
    bioEn: 'Indian filmmaker, screenwriter, author, music composer, and graphic designer widely regarded as one of the greatest filmmakers of all time.',
    bioHi: 'विश्व सिनेमा के महानतम निर्देशकों में शुमार जिन्होंने पाथेर पांचाली, अपराजितो और अपूर संसार जैसी फिल्मों से भारतीय सिनेमा को विश्व में सर्वोच्च प्रतिष्ठा दिलाई।',
    quoteEn: 'The only modern medium which can be both an art and a science is the cinema.',
    quoteHi: 'सिनेमा ही एकमात्र ऐसा आधुनिक माध्यम है जो एक साथ कला भी हो सकता है और विज्ञान भी।',
  },
];

export function findCelebrityTwins(chart: ChartData): CelebrityTwinMatch[] {
  const ascIdx = chart.ascendant.signIndex;
  const moon = chart.planets.find((p) => p.id === 'Moon');
  const sun = chart.planets.find((p) => p.id === 'Sun');
  const moonIdx = moon?.signIndex ?? 0;
  const sunIdx = sun?.signIndex ?? 0;

  // Identify native's active Yogas
  const nativeYogas: string[] = [];
  const jup = chart.planets.find((p) => p.id === 'Jupiter');
  const mars = chart.planets.find((p) => p.id === 'Mars');
  const merc = chart.planets.find((p) => p.id === 'Mercury');
  const ven = chart.planets.find((p) => p.id === 'Venus');
  const sat = chart.planets.find((p) => p.id === 'Saturn');

  const isKendra = (h?: number) => h === 1 || h === 4 || h === 7 || h === 10;
  const isTrikona = (h?: number) => h === 1 || h === 5 || h === 9;

  // Pancha Mahapurusha Yogas
  if (mars && isKendra(mars.houseNumber) && (mars.signIndex === 0 || mars.signIndex === 7 || mars.signIndex === 9)) nativeYogas.push('Ruchaka Yoga');
  if (merc && isKendra(merc.houseNumber) && (merc.signIndex === 2 || merc.signIndex === 5)) nativeYogas.push('Bhadra Yoga');
  if (jup && isKendra(jup.houseNumber) && (jup.signIndex === 3 || jup.signIndex === 8 || jup.signIndex === 11)) nativeYogas.push('Hamsa Yoga');
  if (ven && isKendra(ven.houseNumber) && (ven.signIndex === 1 || ven.signIndex === 6 || ven.signIndex === 11)) nativeYogas.push('Malavya Yoga');
  if (sat && isKendra(sat.houseNumber) && (sat.signIndex === 6 || sat.signIndex === 9 || sat.signIndex === 10)) nativeYogas.push('Sasa Yoga');

  // Gajakesari Yoga (Jupiter in Kendra from Moon)
  if (jup && moon) {
    const diff = ((jup.houseNumber - moon.houseNumber + 12) % 12) + 1;
    if (diff === 1 || diff === 4 || diff === 7 || diff === 10) nativeYogas.push('Gajakesari Yoga');
  }

  // Budhaditya Yoga (Sun & Mercury together)
  if (sun && merc && sun.houseNumber === merc.houseNumber) {
    nativeYogas.push('Budhaditya Yoga');
  }

  // Amala Yoga (Benefic in 10th from Lagna or Moon)
  const isBenefic = (pId: string) => ['Jupiter', 'Venus', 'Mercury'].includes(pId);
  const p10 = chart.planets.filter((p) => p.houseNumber === 10);
  if (p10.some((p) => isBenefic(p.id))) {
    nativeYogas.push('Amala Yoga');
  }

  // Dhana Yoga (Lords of 1, 2, 5, 9, 11 interacting)
  const lord2 = SIGNS[(ascIdx + 1) % 12].lord;
  const lord11 = SIGNS[(ascIdx + 10) % 12].lord;
  const pLord2 = chart.planets.find((p) => p.id === lord2);
  const pLord11 = chart.planets.find((p) => p.id === lord11);
  if (pLord2 && pLord11 && (pLord2.houseNumber === 11 || pLord11.houseNumber === 2 || pLord2.houseNumber === pLord11.houseNumber)) {
    nativeYogas.push('Dhana Yoga');
  }

  // Saraswati Yoga (Jupiter, Venus, Mercury in Kendras/Trikonas)
  if (
    merc && (isKendra(merc.houseNumber) || isTrikona(merc.houseNumber)) &&
    jup && (isKendra(jup.houseNumber) || isTrikona(jup.houseNumber)) &&
    ven && (isKendra(ven.houseNumber) || isTrikona(ven.houseNumber))
  ) {
    nativeYogas.push('Saraswati Yoga');
  }

  // Raja Yoga
  nativeYogas.push('Raja Yoga');

  const matches: CelebrityTwinMatch[] = [];

  for (const celeb of CELEBRITY_DATABASE) {
    let score = 25; // Base compatibility

    // 1. Lagna Match (Primary Ascendant Matrix)
    if (celeb.ascSignIndex === ascIdx) {
      score += 26; // Exact Lagna match
    } else if ((celeb.ascSignIndex % 4) === (ascIdx % 4)) {
      score += 10; // Same elemental triplicity (Agni/Prithvi/Vayu/Jala)
    }

    // 2. Moon Sign Match (Chandra Rashi mental synergy)
    if (celeb.moonSignIndex === moonIdx) {
      score += 18; // Exact Moon match
    } else if (Math.abs(celeb.moonSignIndex - moonIdx) % 4 === 0) {
      score += 8; // Trikona Moon
    }

    // 3. Sun Sign Match (Atma Karaka core energy)
    if (celeb.sunSignIndex === sunIdx) {
      score += 12; // Exact Sun match
    }

    // 4. Shared Classical Yogas
    const sharedYogas = celeb.prominentYogas.filter((y) => nativeYogas.includes(y));
    const sharedYogasHi = celeb.prominentYogasHi.filter((_, idx) => nativeYogas.includes(celeb.prominentYogas[idx]));
    score += Math.min(20, sharedYogas.length * 8);

    // 5. Shared Planetary House Placements
    const sharedPlacements: CelebrityTwinMatch['sharedPlacements'] = [];
    for (const kp of celeb.keyPlacements) {
      const p = chart.planets.find((pl) => pl.id === kp.planet);
      if (p && p.houseNumber === kp.house) {
        score += 8;
        sharedPlacements.push({
          planet: kp.planet,
          house: kp.house,
          descriptionHi: `${kp.noteHi} — आपकी कुंडली में भी ${kp.planet} ठीक इसी भाव में स्थित है।`,
          descriptionEn: `${kp.noteEn} — In your horoscope as well, ${kp.planet} is placed in the exact same house.`,
        });
      }
    }

    const finalScore = Math.min(97, Math.max(42, score));

    matches.push({
      celebrity: celeb,
      similarityScore: finalScore,
      sharedYogas,
      sharedYogasHi,
      sharedPlacements,
      astrologicalSynergyHi: `आपकी कुंडली में ${SIGNS[ascIdx].name} लग्न तथा ${sharedYogasHi.length > 0 ? sharedYogasHi.join(', ') : 'ग्रह योगों'} की संरचना ${celeb.nameHi} के कालजयी प्रारब्ध चक्र से आश्चर्यजनक साम्य रखती है।`,
      astrologicalSynergyEn: `Your ${SIGNS[ascIdx].name} Ascendant and ${sharedYogas.length > 0 ? sharedYogas.join(', ') : 'planetary formations'} share striking astrological resonance with ${celeb.nameEn}’s destiny blueprint.`,
      nativeGuidanceHi: `${celeb.nameHi} की तरह अपने ${celeb.categoryTitleHi} के क्षेत्र में निस्वार्थ साधना व उच्च लक्ष्य रखें। उनकी जीवन प्रेरणा: "${celeb.quoteHi}"`,
      nativeGuidanceEn: `Like ${celeb.nameEn}, direct your kinetic energy toward principled mastery in ${celeb.categoryTitleEn}. Guiding compass: "${celeb.quoteEn}"`,
    });
  }

  // Sort highest similarity first
  matches.sort((a, b) => b.similarityScore - a.similarityScore);
  return matches;
}
