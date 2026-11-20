import { NAKSHATRAS, NINE_GRAHAS } from '../constants';
import type { BodyPosition, ChartData } from '../types';
import type { PredictionBodyId } from './planetInSign';

export interface PlanetInNakshatraPrediction {
  planet: PredictionBodyId;
  nakshatraIndex: number;
  nakshatraNameEn: string;
  nakshatraNameHi: string;
  pada: number;
  nakshatraLord: string;
  deityEn: string;
  deityHi: string;
  symbolEn: string;
  symbolHi: string;
  gana: string;
  nadi: string;
  yoni: string;
  taraFromMoonEn: string;
  taraFromMoonHi: string;
  taraAuspicious: boolean;
  activationAges: number[];
  taraTimingEn: string;
  taraTimingHi: string;
  padaNuanceEn: string;
  padaNuanceHi: string;
  readingEn: string;
  readingHi: string;
  vocationEn: string;
  vocationHi: string;
  classicalSutraEn: string;
  classicalSutraHi: string;
  source: string;
}

const NAK_HI = [
  'अश्विनी', 'भरणी', 'कृत्तिका', 'रोहिणी', 'मृगशिरा', 'आर्द्रा', 'पुनर्वसु', 'पुष्य', 'अश्लेषा',
  'मघा', 'पूर्वा फाल्गुनी', 'उत्तरा फाल्गुनी', 'हस्त', 'चित्रा', 'स्वाति', 'विशाखा', 'अनुराधा', 'ज्येष्ठा',
  'मूल', 'पूर्वाषाढ़ा', 'उत्तराषाढ़ा', 'श्रवण', 'धनिष्ठा', 'शतभिषा', 'पूर्वा भाद्रपद', 'उत्तरा भाद्रपद', 'रेवती',
];

export const NAK_ACTIVATION_AGES: number[][] = [
  [16, 28, 44], // Ashwini
  [24, 33, 50], // Bharani
  [30, 42, 54], // Krittika
  [24, 36, 48], // Rohini
  [28, 38, 52], // Mrigashira
  [25, 34, 45], // Ardra
  [32, 40, 56], // Punarvasu
  [28, 35, 49], // Pushya
  [30, 41, 55], // Ashlesha
  [22, 38, 53], // Magha
  [28, 38, 50], // Purva Phalguni
  [26, 36, 52], // Uttara Phalguni
  [25, 33, 49], // Hasta
  [32, 40, 55], // Chitra
  [30, 37, 52], // Swati
  [28, 34, 48], // Vishakha
  [26, 35, 51], // Anuradha
  [21, 35, 47], // Jyeshtha
  [27, 48, 60], // Moola
  [28, 38, 54], // Purvashadha
  [31, 39, 55], // Uttarashadha
  [25, 35, 45], // Shravana
  [28, 36, 52], // Dhanishta
  [30, 42, 58], // Shatabhisha
  [29, 39, 51], // Purva Bhadrapada
  [27, 37, 53], // Uttara Bhadrapada
  [22, 32, 46], // Revati
];

export const NAK_CLASSICAL_SUTRAS: Array<{ en: string; hi: string }> = [
  { en: 'Phaladeepika: Fond of ornaments, lovely appearance, clever in work, respected by rulers, swift in medicine and pioneering ventures.', hi: 'फलदीपिका: आभूषण-प्रिय, मनोहर स्वरूप, कार्य-कुशल, बुद्धिमान व राजा से सम्मानित। आयुर्वेद व त्वरित कार्यों में विशेष यश।' },
  { en: 'Phaladeepika: Resolute, truthful, free from diseases, skilled in execution, steadfast mind, attains prosperity after initial struggle.', hi: 'फलदीपिका: दृढ़ निश्चयी, सत्यवादी, रोग-मुक्त, कार्यों में दक्ष, स्थिर मति और प्रारंभिक संघर्ष के बाद स्थायी धन लाभ।' },
  { en: 'Phaladeepika: Voracious appetite, illustrious demeanor, famous, valorous, sharp intelligence, authoritative executive capacity.', hi: 'फलदीपिका: तेजस्वी, प्रसिद्ध, पराक्रमी, तीक्ष्ण बुद्धि और प्रशासनिक दायित्वों का निर्वहन करने में निपुण।' },
  { en: 'Phaladeepika: Truthful, pure heart, sweet-tongued, stable intellect, handsome, highly prosperous in agriculture, trade, or fine arts.', hi: 'फलदीपिका: सत्यवादी, पवित्र, मधुरभाषी, स्थिर बुद्धि, सुंदर, व्यापार, कला व जनसंपर्क में अत्यंत धनवान।' },
  { en: 'Phaladeepika: Enthusiastic, fickle-minded, sharp investigator, fond of music and travels, respected by elite patrons.', hi: 'फलदीपिका: उत्साही, खोजी बुद्धि, संगीत व यात्रा-प्रेमी, समाज के प्रतिष्ठित लोगों द्वारा समादृत।' },
  { en: 'Phaladeepika: Proud, unyielding, deep researcher, razor-sharp intellect, undergoes mental turbulence before great technological rise.', hi: 'फलदीपिका: स्वाभिमानी, प्रचंड बुद्धि, गूढ़ शोधकर्ता, प्रारंभिक मंथन के बाद तकनीकी व वैज्ञानिक क्षेत्र में शीर्ष पद।' },
  { en: 'Phaladeepika: Virtuous, self-controlled, wealthy, poet, living with family harmony, repeatedly regains lost fortunes.', hi: 'फलदीपिका: धार्मिक, संयमी, कवि, सुखी, दानी और खोए हुए धन व मान-सम्मान को पुनः प्राप्त करने वाला।' },
  { en: 'Phaladeepika: Composed mind, learned, wealthy, devoted to dharma, favored by rulers, beloved of righteous mentors.', hi: 'फलदीपिका: शांत चित्त, विद्वान, धनवान, धर्मपरायण, राज्य से सम्मानित और गुरुजनों का प्रिय पात्र।' },
  { en: 'Phaladeepika: Deft in diplomacy, independent thinker, researcher of occult substances, strategic foresight in difficult times.', hi: 'फलदीपिका: कूटनीति में चतुर, स्वतंत्र विचारक, गोपनीय विद्याओं का ज्ञाता और संकट के समय अचूक रणनीति बनाने वाला।' },
  { en: 'Phaladeepika: Great wealth, servants, respect for ancestors, majestic personality, fond of ceremonial honors and leadership.', hi: 'फलदीपिका: विपुल धन, सेवक-सुख, पितृ-भक्त, राजसी ठाठ-बाट, सम्मान-प्रिय और नेतृत्व में अग्रणी।' },
  { en: 'Phaladeepika: Sweet-spoken, generous, handsome, fond of roaming, artistic inclinations, royal patronage and marital joys.', hi: 'फलदीपिका: मधुरभाषी, दानी, आकर्षक, कला-प्रेमी, शासन से लाभ और उत्तम दांपत्य व वाहन सुख।' },
  { en: 'Phaladeepika: Liked by all, earns wealth through self-effort, honorable, enjoys life, principled in public administration.', hi: 'फलदीपिका: सर्वप्रिय, स्व-अर्जित धन से संपन्न, स्वाभिमानी, सुखी जीवन और सार्वजनिक कार्यों में निष्ठावान।' },
  { en: 'Phaladeepika: Resourceful, energetic, eloquent speaker, skilled in manual arts and mathematics, fond of learning and trading.', hi: 'फलदीपिका: उद्योगी, उत्साही, वाकपटु, शिल्प व गणना में दक्ष, विद्या-अनुरागी और सफल व्यापारी।' },
  { en: 'Phaladeepika: Wearing colorful attire, beautiful eyes, creative craftsmanship, versatile mastery in structural designs.', hi: 'फलदीपिका: सुंदर वस्त्र व नेत्रों वाला, रचनात्मक शिल्पी, आभूषण व वास्तु-डिजाइन में कुशल।' },
  { en: 'Phaladeepika: Righteous, compassionate, sweet words, modest, disciplined in commerce, adaptable in international transactions.', hi: 'फलदीपिका: धार्मिक, दयालु, मधुर वाणी, विनीत, व्यापार में कुशल और विदेश व स्वतंत्र कार्यों में सफल।' },
  { en: 'Phaladeepika: Jealous of none, speaks cautiously, ambitious, skilled in earning money, influential speaker in gatherings.', hi: 'फलदीपिका: ईर्ष्या-रहित, विचारपूर्वक बोलने वाला, धन कमाने में दक्ष और सभाओं में प्रभावशाली वक्ता।' },
  { en: 'Phaladeepika: Wealthy, residing abroad or traveling widely, energetic, resilient under stress, loyal friend and organizer.', hi: 'फलदीपिका: धनवान, विदेश-यात्रा या प्रवास में लाभ, कार्य-कुशल, संकट में धैर्यवान और विश्वसनीय मित्र।' },
  { en: 'Phaladeepika: Few friends, contented, devoted to duty, highly respected, capable of leading institutions and security.', hi: 'फलदीपिका: कर्तव्यनिष्ठ, आत्म-संतुष्ट, वरिष्ठ पद पाने वाला और संस्थान/सुरक्षा के नेतृत्व में सक्षम।' },
  { en: 'Phaladeepika: Resolute, peaceful, skilled in investigating hidden causes, philosophical, experiences sudden financial leaps.', hi: 'फलदीपिका: दृढ़ संकल्पी, शांतिप्रिय, गूढ़ कारणों का अन्वेषक, दार्शनिक और अचानक धन लाभ प्राप्त करने वाला।' },
  { en: 'Phaladeepika: Proud, firm friendships, devoted spouse, eloquent debater, enjoys aquatic travels and widespread acclaim.', hi: 'फलदीपिका: स्वाभिमानी, दृढ़ मित्र, अनुकूल जीवनसाथी, उत्कृष्ट वक्ता और जनमानस में ख्याति प्राप्त।' },
  { en: 'Phaladeepika: Obedient to elders, learned, heroic, highly principled, victorious in contested situations, long-term legacy.', hi: 'फलदीपिका: गुरुजनों का आज्ञाकारी, विद्वान, पराक्रमी, सत्यनिष्ठ, कठिन परिस्थितियों में विजयी और स्थायी यश।' },
  { en: 'Phaladeepika: Versed in scriptures, dedicated spouse, wealthy, charitable, attentive listener, scholarly achievements.', hi: 'फलदीपिका: शास्त्र-वेत्ता, उत्तम जीवनसाथी, धनी, दानी, श्रेष्ठ श्रोता और शैक्षणिक/सांस्कृतिक प्रतिष्ठा।' },
  { en: 'Phaladeepika: Generous, heroic, fond of music and wealth, courageous, administrative authority with material prosperity.', hi: 'फलदीपिका: उदार, पराक्रमी, संगीत व धन-प्रिय, साहसी, प्रशासनिक अधिकार और भौतिक ऐश्वर्य संपन्न।' },
  { en: 'Phaladeepika: Plain speaker, victorious over adversaries, skilled in medical and scientific formulations, solitary philosopher.', hi: 'फलदीपिका: स्पष्टवक्ता, शत्रुओं पर विजयी, औषधि व विज्ञान में निपुण और गंभीर विचारक।' },
  { en: 'Phaladeepika: Sorrowful, wealthy, skillful speaker, charitable, transformative vision, dedicated to higher ideals.', hi: 'फलदीपिका: गंभीर, धनवान, कुशल वक्ता, दानी, परिवर्तनकारी दृष्टि और उच्च आदर्शों के प्रति समर्पित।' },
  { en: 'Phaladeepika: Eloquent speaker, virtuous, blessed with noble children, overcomes obstacles through calm patience.', hi: 'फलदीपिका: मधुर वक्ता, धर्मात्मा, उत्तम संतान-सुख, धैर्य से बाधाओं को जीतने वाला और प्रतिष्ठित।' },
  { en: 'Phaladeepika: Well-proportioned limbs, beloved of all, brave, truthful, wealthy, accomplishes journeys safely and gracefully.', hi: 'फलदीपिका: सुंदर शरीर, सबका प्रिय, शूरवीर, निष्कपट, धनवान और यात्राओं व उद्यमों को कुशलता से पूर्ण करने वाला।' },
];

const NAK_EXT: Array<{
  deityHi: string;
  symEn: string;
  symHi: string;
  natureEn: string;
  natureHi: string;
  vocEn: string;
  vocHi: string;
}> = [
  { deityHi: 'अश्विनी कुमार (देव वैद्य)', symEn: 'Horse Head', symHi: 'अश्व मुख', natureEn: 'swift healing, pioneering vitality, spontaneous breakthroughs', natureHi: 'तीव्र गति, चिकित्सा प्रतिभा, नव-आरंभ व चमत्कारी उपचार', vocEn: 'medicine, emergency care, athletics, transport, tech launches', vocHi: 'चिकित्सा, आयुर्वेद, परिवहन, खेल एवं नवाचार' },
  { deityHi: 'यम देव (धर्मराज)', symEn: 'Yoni (Womb)', symHi: 'योनि / सृजन द्वार', natureEn: 'intense creative gestation, endurance, transformative restraint', natureHi: 'सृजन क्षमता, गहन सहनशक्ति, न्यायप्रियता व रूपांतरण', vocEn: 'obstetrics, finance/custody, entertainment, law, crisis work', vocHi: 'वित्त प्रबंधन, कला-सिनेमा, न्याय एवं संरक्षण कार्य' },
  { deityHi: 'अग्नि देव', symEn: 'Razor / Flame', symHi: 'अग्नि शिखा / छुरा', natureEn: 'purifying precision, sharp candor, protective nourishment', natureHi: 'तेजस्विता, स्पष्टवादिता, शुद्धिकरण व तीक्ष्ण मेधा', vocEn: 'culinary arts, defense, surgery, auditing, leadership', vocHi: 'प्रशासन, रक्षा, पाक कला, शल्य-चिकित्सा व लेखा परीक्षण' },
  { deityHi: 'प्रजापति ब्रह्मा', symEn: 'Ox Cart / Chariot', symHi: 'रथ / शकट', natureEn: 'fertile creativity, magnetic beauty, bountiful cultivation', natureHi: 'समृद्धि, सौंदर्य, कलात्मक आकर्षण व उर्वर कल्पना', vocEn: 'design, luxury goods, agriculture, media, hospitality', vocHi: 'डिजाइन, कृषि, मीडिया, आतिथ्य व कला-व्यवसाय' },
  { deityHi: 'सोम (चंद्र देव)', symEn: 'Deer Head', symHi: 'मृग शिर', natureEn: 'curious seeking, gentle intelligence, sensory artistry', natureHi: 'खोजी प्रवृत्ति, कोमल बुद्धि, यात्रा व संगीत-सौंदर्य', vocEn: 'research, travel, journalism, textiles, counseling', vocHi: 'शोध, पत्रकारिता, यात्रा, वस्त्र एवं परामर्श' },
  { deityHi: 'रुद्र (शिव)', symEn: 'Teardrop / Diamond', symHi: 'अश्रु बिंदु / हीरा', natureEn: 'storm-like clarity after emotional depth, razor intellect', natureHi: 'प्रचंड बुद्धि, भावनात्मक मंथन के बाद सत्य-दर्शन व तकनीकी कुशलता', vocEn: 'data science, neurology, electrical/software systems, psychology', vocHi: 'सॉफ्टवेयर, डेटा विज्ञान, मनोविज्ञान व शोध कार्य' },
  { deityHi: 'अदिति (देवमाता)', symEn: 'Bow & Quiver', symHi: 'धनुष एवं तरकश', natureEn: 'resilient renewal, welcoming wisdom, safe return & abundance', natureHi: 'पुनर्निर्माण, उदारता, आध्यात्मिक सुरक्षा व सौभाग्य वापसी', vocEn: 'teaching, publishing, architecture, mentoring, exports', vocHi: 'शिक्षण, लेखन, वास्तुकला, निर्यात व मार्गदर्शन' },
  { deityHi: 'बृहस्पति (देवगुरु)', symEn: 'Lotus / Udder', symHi: 'कमल / अमृत कलश', natureEn: 'supreme nourishment, selfless dharma, calm patient prosperity', natureHi: 'परम पोषण, धार्मिकता, धैर्य व स्थायी लोककल्याणकारी समृद्धि', vocEn: 'advisory, education, dairy/nutrition, governance, priesthood', vocHi: 'शिक्षा, राजनीति, सलाहकार, धर्म व जनसेवा' },
  { deityHi: 'सर्प देवता', symEn: 'Coiled Serpent', symHi: 'कुंडलित सर्प', natureEn: 'hypnotic insight, strategic intuition, protective cunning', natureHi: 'कूटनीतिक सूझबूझ, तीक्ष्ण अंतर्ज्ञान व गोपनीय रणनीति', vocEn: 'pharmacology, occult research, corporate strategy, auditing', vocHi: 'रसायन-चिकित्सा, कॉर्पोरेट रणनीति व गूढ़ शोध' },
  { deityHi: 'पितृगण (पूर्वज)', symEn: 'Royal Throne', symHi: 'राजसिंहासन', natureEn: 'ancestral dignity, regal authority, tradition preservation', natureHi: 'पैतृक गौरव, राजसी अधिकार, परंपरा-निष्ठा व उच्च पद', vocEn: 'executive leadership, heritage management, history, government', vocHi: 'प्रशासन, राजकार्य, प्रबंधन व पारंपरिक व्यवसाय' },
  { deityHi: 'भग (ऐश्वर्य देव)', symEn: 'Swinging Hammock', symHi: 'शय्या / झूला', natureEn: 'creative romance, relaxation charm, charismatic generosity', natureHi: 'सृजन, आनंद, मधुर आकर्षण व कलात्मक ऐश्वर्य', vocEn: 'performing arts, wedding/luxury curation, PR, design', vocHi: 'मनोरंजन, विवाह-इवेंट, पीआर एवं रचनात्मक कला' },
  { deityHi: 'अर्यमन (मैत्री देव)', symEn: 'Four Poster Bed / Contract', symHi: 'मैत्री एवं अनुबंध', natureEn: 'honorable patronage, reliable friendships, constructive philanthropy', natureHi: 'मित्रता निभाना, संगठन निर्माण, विश्वसनीयता व परोपकार', vocEn: 'HR/unions, corporate law, philanthropy, partnerships', vocHi: 'साझेदारी व्यवसाय, मानव संसाधन, कानून व समाजसेवा' },
  { deityHi: 'सवितृ (सूर्य देव)', symEn: 'Open Hand', symHi: 'हथेली / पांच अंगुलियाँ', natureEn: 'dexterous handcraft, sparkling humor, resourceful skill', natureHi: 'हस्तकौशल, हास्य-व्यंग्य, व्यावसायिक निपुणता व त्वरित समाधान', vocEn: 'crafts, surgery, coding, accountancy, media arts', vocHi: 'शिल्प, शल्य चिकित्सा, कोडिंग, लेखा व मीडिया' },
  { deityHi: 'त्वष्टा (विश्वकर्मा)', symEn: 'Shining Jewel', symHi: 'चमकती मणि', natureEn: 'architectural beauty, luminous craftsmanship, bold individuality', natureHi: 'वास्तु एवं सृजन सौंदर्य, आकर्षक व्यक्तित्व व स्वतंत्र प्रतिभा', vocEn: 'architecture, fashion, jewelcraft, UI design, cinematography', vocHi: 'आर्किटेक्चर, फैशन, आभूषण, यूआई डिज़ाइन व कला' },
  { deityHi: 'वायु देव', symEn: 'Coral Shoot in Wind', symHi: 'हवा में लहराता अंकुर', natureEn: 'flexible diplomacy, independent commerce, graceful adaptability', natureHi: 'स्वतंत्र व्यापार कौशल, लचीलापन, मधुर कूटनीति व संतुलन', vocEn: 'diplomacy, commerce, aviation, marketing, software', vocHi: 'व्यापार, कूटनीति, विमानन, मार्केटिंग व तकनीक' },
  { deityHi: 'इंद्राग्नि', symEn: 'Triumphal Arch', symHi: 'विजय तोरण', natureEn: 'single-pointed ambition, goal conquest, persuasive speech', natureHi: 'एकाग्र महत्वाकांक्षा, लक्ष्य-सिद्धि व प्रभावशाली वाक्शक्ति', vocEn: 'law, politics, entrepreneurship, motivational leadership', vocHi: 'वकालत, राजनीति, उद्यमिता व नेतृत्व' },
  { deityHi: 'मित्र देव', symEn: 'Lotus in Mud', symHi: 'पुष्प एवं विजय माल', natureEn: 'devoted friendship, quiet persistence, organizational unity', natureHi: 'निष्ठावान मित्रता, धैर्यशील संगठन व भक्ति-भावना', vocEn: 'music, analytics, international alliances, teamwork', vocHi: 'संगीत, डेटा विश्लेषण, अंतर्राष्ट्रीय समन्वय व संगठन' },
  { deityHi: 'देवराज इंद्र', symEn: 'Protective Amulet', symHi: 'कुंडल / रक्षा कवच', natureEn: 'senior authority, protective responsibility, strategic depth', natureHi: 'वरिष्ठ अधिकार, परिवार/संस्थान संरक्षण व तीक्ष्ण रक्षा-बुद्धि', vocEn: 'executive defense, investigative policy, telecom, surgery', vocHi: 'प्रबंधन, रक्षा, नीति-निर्माण एवं अन्वेषण' },
  { deityHi: 'निरृति', symEn: 'Tied Roots', symHi: 'जड़ों का गुच्छा', natureEn: 'root-level investigation, fearless truth-seeking, transformation', natureHi: 'मूल से सत्य की खोज, निर्भीक अनुसंधान व रूपांतरण', vocEn: 'botany/medicine, root-cause engineering, philosophy, law', vocHi: 'चिकित्सा, शोध, दर्शन, न्याय एवं गहन विज्ञान' },
  { deityHi: 'आपः (जल देव)', symEn: 'Elephant Tusk / Winnowing Fan', symHi: 'हाथी दांत / सूप', natureEn: 'invincible optimism, persuasive articulation, purifying flow', natureHi: 'अजेय आशावाद, प्रवाहपूर्ण वाणी व लोकप्रिय प्रभाव', vocEn: 'public speaking, shipping/water, debate, media', vocHi: 'वक्तृत्व, जनसंपर्क, मीडिया एवं जल/नौवहन उद्योग' },
  { deityHi: 'विश्वेदेवाः', symEn: 'Elephant Tusk / Planks', symHi: 'विजय आसन', natureEn: 'unstoppable enduring victory through ethics and steady duty', natureHi: 'धर्मयुक्त स्थायी विजय, कर्तव्यनिष्ठा व उच्च आदर्श', vocEn: 'civil service, military/justice ethics, pioneer leadership', vocHi: 'प्रशासन, न्याय, सिविल सेवा एवं नेतृत्व' },
  { deityHi: 'भगवान विष्णु', symEn: 'Ear / Three Footprints', symHi: 'कान / तीन पग', natureEn: 'attentive listening, scholarly absorption, quiet wisdom & travel', natureHi: 'गहन श्रवण शक्ति, विद्या-प्रेम, विनम्र ज्ञान व यात्रा', vocEn: 'teaching, audio/music, counseling, languages, travel', vocHi: 'शिक्षण, संगीत, परामर्श, भाषाएँ एवं जन-संपर्क' },
  { deityHi: 'अष्ट वसु', symEn: 'Musical Drum (Damru)', symHi: 'मृदंग / डमरू', natureEn: 'rhythmic harmony, wealth stewardship, timing & charitable stature', natureHi: 'संगीत-लय, धन-संपत्ति प्रबंधन, समयबद्ध कार्य व यश', vocEn: 'finance, music/dance, real estate, rhythmic sports', vocHi: 'वित्त, संगीत, भूमि-भवन व प्रशासनिक समन्वय' },
  { deityHi: 'वरुण देव', symEn: 'Empty Circle (100 Stars)', symHi: 'सौ तारे / वृत्त', natureEn: 'secretive healing, cosmic systems thinking, solitary mastery', natureHi: 'गूढ़ चिकित्सा, ब्रह्मांडीय/तकनीकी दृष्टि व स्वतंत्र शोध', vocEn: 'biotech, astronomy, coding, pharmaceuticals, healing', vocHi: 'जैव-प्रौद्योगिकी, खगोल, औषधि, कोडिंग व चिकित्सा' },
  { deityHi: 'अज एकपाद', symEn: 'Front Legs of Cot / Sword', symHi: 'खटिया के अगले दो पाए', natureEn: 'fiery idealism, prophetic intensity, transformative vision', natureHi: 'उच्च आदर्श, तीव्र आध्यात्मिक अंतर्दृष्टि व परिवर्तन-संकल्प', vocEn: 'philosophy, psychiatry, activism, spiritual research', vocHi: 'दर्शन, मनोविज्ञान, लेखन व आध्यात्मिक शोध' },
  { deityHi: 'अहिर्बुध्न्य', symEn: 'Back Legs / Deep Serpent', symHi: 'गहरे जल में सर्प', natureEn: 'serene cosmic wisdom, charitable grace, enduring mental depth', natureHi: 'गंभीर प्रज्ञा, परोपकार, धैर्यशील भक्ति व मानसिक गहराई', vocEn: 'charitable foundations, architecture, academia, therapy', vocHi: 'परोपकार, उच्च शिक्षा, परामर्श व वास्तुकला' },
  { deityHi: 'पूषा देव (सूर्य)', symEn: 'Pair of Fish / Drum', symHi: 'मछली जोड़ा / मृदंग', natureEn: 'gentle nourishment, creative empathy, safe journeys & completion', natureHi: 'कोमल पोषण, कलात्मक करुणा, सुरक्षित यात्रा व पूर्णता', vocEn: 'mentorship, arts, hospitality, foster/care, digital creation', vocHi: 'शिक्षण-पालन, कला, आतिथ्य व सृजनात्मक कार्य' },
];

export const TARA_NAMES = [
  {
    en: 'Janma Tara (Birth — Sensitive/Active)',
    hi: 'जन्म तारा (स्वभाव-प्रधान)',
    ok: true,
    timingEn: 'Deeply activates during natal Dasha/Antardasha: heightened self-awareness, physical vitality tests, and personal reinvention.',
    timingHi: 'इस ग्रह की दशा-अंतर्दशा में आत्म-पहचान, शारीरिक स्वास्थ्य संवेदनशीलता तथा जीवन में व्यक्तिगत नए अध्याय की शुरुआत होती है।',
  },
  {
    en: 'Sampat Tara (Wealth & Prosperity)',
    hi: 'संपत तारा (धन व समृद्धि)',
    ok: true,
    timingEn: 'Direct wealth generator: triggers major financial inflows, property gains, profitable contracts and material expansion during its period.',
    timingHi: 'प्रत्यक्ष धन-दायक तारा: इसकी दशा या गोचर में धन आगमन, व्यापारिक अनुबंध, संपत्ति लाभ व भौतिक सुखों में भारी विस्तार होता है।',
  },
  {
    en: 'Vipat Tara (Cautious / Tests)',
    hi: 'विपत तारा (सतर्कता आवश्यक)',
    ok: false,
    timingEn: 'Sudden tests & hurdles: requires caution against risky financial gambles, travel hazards, or abrupt structural roadblocks.',
    timingHi: 'आकस्मिक बाधा व परीक्षण: इसकी दशा में बिना सोचे-समझे वित्तीय जोखिम, वाहन गति व जल्दबाजी से बचें; धैर्य से कार्य करें।',
  },
  {
    en: 'Kshema Tara (Safety & Wellbeing)',
    hi: 'क्षेम तारा (कल्याण व सुरक्षा)',
    ok: true,
    timingEn: 'Well-being & safety shield: provides smooth progress, reliable recovery from setbacks, family peace and career security.',
    timingHi: 'कल्याण व सुरक्षा कवच: प्रतिकूलताओं से उबरने, पारिवारिक शांति, रोग मुक्ति व आजीविका में स्थिरता प्रदान करता है।',
  },
  {
    en: 'Pratyari Tara (Friction / Adaptation)',
    hi: 'प्रत्यरि तारा (धैर्य अपेक्षित)',
    ok: false,
    timingEn: 'Friction & opposition: brings competition, legal or bureaucratic friction, demanding adaptability and disciplined persistence.',
    timingHi: 'प्रत्यरि / शत्रु प्रतिरोध: कार्यक्षेत्र में प्रतिस्पर्धा, कागजी अड़चनें व मतभेद संभव; कूटनीति व संयम से विजय मिलती है।',
  },
  {
    en: 'Sadhaka Tara (Accomplishment)',
    hi: 'साधक तारा (कार्य सिद्धि)',
    ok: true,
    timingEn: 'Accomplishment & mastery: goals materialize rapidly, exams/promotions succeed, and long-term ambitions achieve breakthrough.',
    timingHi: 'साधक / कार्य-सिद्धि: पूर्व-प्रयासों का पूर्ण फल, पदोन्नति, परीक्षा/इंटरव्यू में सफलता व महत्वपूर्ण लक्ष्यों की प्राप्ति।',
  },
  {
    en: 'Naidhana Tara (Transformative Caution)',
    hi: 'नैधन तारा (सावधानी व परिवर्तन)',
    ok: false,
    timingEn: 'Major karmic transformation: high health vigilance, profound spiritual awakening, end of unproductive cycles and deep reset.',
    timingHi: 'नैधन / गहरा रूपांतरण: स्वास्थ्य में विशेष सावधानी रखें; व्यर्थ के बंधनों का अंत व गहरा आध्यात्मिक/मानसिक नवजागरण।',
  },
  {
    en: 'Mitra Tara (Friendly Grace)',
    hi: 'मित्र तारा (सहायक व शुभ)',
    ok: true,
    timingEn: 'Harmonious alliances: genuine friendship, smooth patron support, enjoyable partnerships and pleasant family events.',
    timingHi: 'मित्र कृपा: विश्वसनीय मित्रों व वरिष्ठों का सहयोग, सुखद साझेदारी, पारिवारिक मांगलिक कार्य व अनुकूल वातावरण।',
  },
  {
    en: 'Parama Mitra Tara (Supreme Blessing)',
    hi: 'परम मित्र तारा (अत्यंत शुभ)',
    ok: true,
    timingEn: 'Supreme auspicious patronage: rarest luck, prestigious elevation, honors from authorities and lasting legacy achievements.',
    timingHi: 'परम मित्र सर्वोच्च कृपा: अप्रत्याशित सौभाग्य, उच्चाधिकारियों से सम्मान, सामाजिक प्रतिष्ठा व बड़े कार्यों का शुभारंभ।',
  },
];

const PADA_NUANCE = [
  { en: 'Pada 1 (Dharma / Aries-Navamsha impulse): bold initiation & pioneering spark.', hi: 'चरण 1 (धर्म व मेष नवांश): तीव्र पहल, उत्साह व नेतृत्व।' },
  { en: 'Pada 2 (Artha / Taurus-Navamsha impulse): practical grounding, resource & craft.', hi: 'चरण 2 (अर्थ व वृषभ नवांश): व्यावहारिक स्थिरता, धन व सृजन।' },
  { en: 'Pada 3 (Kama / Gemini-Navamsha impulse): intellect, networking, skill & wit.', hi: 'चरण 3 (काम व मिथुन नवांश): संवाद, बहुमुखी बुद्धि व संपर्क।' },
  { en: 'Pada 4 (Moksha / Cancer-Navamsha impulse): empathy, intuition & emotional wisdom.', hi: 'चरण 4 (मोक्ष व कर्क नवांश): संवेदनशीलता, अंतर्ज्ञान व सेवा।' },
];

const BODY_ROLE: Record<PredictionBodyId, { en: string; hi: string }> = {
  Asc: { en: 'Lagna rising behavior & bodily vitality', hi: 'लग्न व्यक्तित्व व जीवन-दिशा' },
  Sun: { en: 'Soul conviction, confidence & career authority', hi: 'आत्मबल, पिता व नेतृत्व' },
  Moon: { en: 'Emotional core, mind, mother & social resonance', hi: 'मन, भावना, माता व जन-संबंध' },
  Mars: { en: 'Courage, ambition, technical action & assertiveness', hi: 'साहस, ऊर्जा, भूमि व निर्णय' },
  Mercury: { en: 'Speech, memory, analytical reasoning & trade', hi: 'बुद्धि, वाणी, लेखन व व्यापार' },
  Jupiter: { en: 'Wisdom, fortune, teachers, dharma & growth', hi: 'ज्ञान, भाग्य, धर्म व समृद्धि' },
  Venus: { en: 'Relationships, beauty, luxury & artistic joy', hi: 'प्रेम, दांपत्य, कला व सुख' },
  Saturn: { en: 'Work ethic, karma, endurance & structural mastery', hi: 'कर्म, अनुशासन, धैर्य व न्याय' },
  Rahu: { en: 'Breakthrough cravings, technology & global reach', hi: 'नवाचार, महत्वाकांक्षा व तकनीक' },
  Ketu: { en: 'Innate past-life expertise, research & detachment', hi: 'पूर्व-संस्कार, शोध व अध्यात्म' },
};

function buildOne(
  body: BodyPosition,
  moonNakIdx: number
): PlanetInNakshatraPrediction {
  const nIdx = ((body.nakshatraIndex % 27) + 27) % 27;
  const pada = Math.max(1, Math.min(4, body.pada));
  const nakInfo = NAKSHATRAS[nIdx];
  const ext = NAK_EXT[nIdx];
  const sutra = NAK_CLASSICAL_SUTRAS[nIdx];
  const taraIdx = ((nIdx - moonNakIdx + 27) % 9);
  const tara = TARA_NAMES[taraIdx];
  const pNu = PADA_NUANCE[pada - 1];
  const role = BODY_ROLE[body.id as PredictionBodyId] ?? BODY_ROLE.Sun;
  const actAges = NAK_ACTIVATION_AGES[nIdx] || [28, 36, 48];

  return {
    planet: body.id as PredictionBodyId,
    nakshatraIndex: nIdx,
    nakshatraNameEn: nakInfo.name,
    nakshatraNameHi: NAK_HI[nIdx],
    pada,
    nakshatraLord: nakInfo.lord,
    deityEn: nakInfo.deity,
    deityHi: ext.deityHi,
    symbolEn: ext.symEn,
    symbolHi: ext.symHi,
    gana: nakInfo.gana,
    nadi: nakInfo.nadi,
    yoni: nakInfo.yoni,
    taraFromMoonEn: tara.en,
    taraFromMoonHi: tara.hi,
    taraAuspicious: tara.ok,
    activationAges: actAges,
    taraTimingEn: tara.timingEn,
    taraTimingHi: tara.timingHi,
    padaNuanceEn: pNu.en,
    padaNuanceHi: pNu.hi,
    readingEn: `${body.id === 'Asc' ? 'Ascendant' : body.id} in ${nakInfo.name} Pada ${pada} (ruled by ${nakInfo.lord}, Deity: ${nakInfo.deity}) infuses your ${role.en.toLowerCase()} with ${ext.natureEn}. Key activation ages: ${actAges.join(', ')} years. Relation to Moon Nakshatra: ${tara.en}.`,
    readingHi: `${NAK_HI[nIdx]} नक्षत्र के चरण ${pada} (स्वामी: ${nakInfo.lord === 'Sun' ? 'सूर्य' : nakInfo.lord === 'Moon' ? 'चंद्र' : nakInfo.lord === 'Mars' ? 'मंगल' : nakInfo.lord === 'Mercury' ? 'बुध' : nakInfo.lord === 'Jupiter' ? 'गुरु' : nakInfo.lord === 'Venus' ? 'शुक्र' : nakInfo.lord === 'Saturn' ? 'शनि' : nakInfo.lord === 'Rahu' ? 'राहु' : 'केतु'}, देवता: ${ext.deityHi}) में स्थित होकर यह ग्रह ${role.hi} को ${ext.natureHi} से जोड़ता है। सक्रियता आयु: ${actAges.join(', ')} वर्ष। जन्म चंद्र से तारा: ${tara.hi}।`,
    vocationEn: ext.vocEn,
    vocationHi: ext.vocHi,
    classicalSutraEn: sutra.en,
    classicalSutraHi: sutra.hi,
    source: 'Phaladeepika Ch. 11 · Brihat Samhita · Taittiriya Brahmana · KP Nakshatra Nadi',
  };
}

export function computePlanetInNakshatraPredictions(
  chart: ChartData
): PlanetInNakshatraPrediction[] {
  const moonNakIdx = chart.panchang.nakshatra.index;
  const planetMap = new Map(chart.planets.map((p) => [p.id, p]));
  const items = [chart.ascendant, ...NINE_GRAHAS.map((g) => planetMap.get(g)!)];
  return items.map((b) => buildOne(b, moonNakIdx));
}

export function inspectHypotheticalNakshatra(
  planet: PredictionBodyId,
  nakIndex: number,
  pada: number
): {
  nakNameEn: string;
  nakNameHi: string;
  lord: string;
  deityEn: string;
  deityHi: string;
  readingEn: string;
  readingHi: string;
  vocationEn: string;
  vocationHi: string;
  padaEn: string;
  padaHi: string;
  activationAges: number[];
  classicalSutraEn: string;
  classicalSutraHi: string;
} {
  const idx = ((nakIndex % 27) + 27) % 27;
  const p = Math.max(1, Math.min(4, pada));
  const nakInfo = NAKSHATRAS[idx];
  const ext = NAK_EXT[idx];
  const sutra = NAK_CLASSICAL_SUTRAS[idx];
  const role = BODY_ROLE[planet] ?? BODY_ROLE.Sun;
  const pNu = PADA_NUANCE[p - 1];
  const actAges = NAK_ACTIVATION_AGES[idx] || [28, 36, 48];

  return {
    nakNameEn: nakInfo.name,
    nakNameHi: NAK_HI[idx],
    lord: nakInfo.lord,
    deityEn: nakInfo.deity,
    deityHi: ext.deityHi,
    readingEn: `${planet === 'Asc' ? 'Ascendant' : planet} in ${nakInfo.name} Pada ${p} (${nakInfo.deity}, Lord ${nakInfo.lord}) empowers ${role.en.toLowerCase()} through ${ext.natureEn}. Natural fruition milestones at ages ${actAges.join(', ')}.`,
    readingHi: `${NAK_HI[idx]} नक्षत्र के चरण ${p} (${ext.deityHi}) में स्थित होने पर ${role.hi} में ${ext.natureHi} के गुण विकसित होते हैं। स्वाभाविक फलोदय आयु: ${actAges.join(', ')} वर्ष।`,
    vocationEn: ext.vocEn,
    vocationHi: ext.vocHi,
    padaEn: pNu.en,
    padaHi: pNu.hi,
    activationAges: actAges,
    classicalSutraEn: sutra.en,
    classicalSutraHi: sutra.hi,
  };
}
