import type { BodyPosition, ChartData, DashaPeriod, NineGrahaId, SevenPlanetId } from '../types';
import { SIGNS, NAKSHATRAS } from '../constants';
import { findActiveDashaPath } from '../dasha';
import { formatDateDmy } from '../time';
import type { ChapterSection } from './lifeDossierEngine';

export const SIGN_HI = [
  'मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या',
  'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुंभ', 'मीन',
];

export const PLANET_HI: Record<string, string> = {
  Asc: 'लग्न',
  Sun: 'सूर्य',
  Moon: 'चंद्र',
  Mars: 'मंगल',
  Mercury: 'बुध',
  Jupiter: 'गुरु',
  Venus: 'शुक्र',
  Saturn: 'शनि',
  Rahu: 'राहु',
  Ketu: 'केतु',
};

// ============================================================================
// NAKSHATRA PSYCHOLOGY REPERTORY (All 27 Constellations)
// Authentic classical psychodynamics from Saravali Ch. 23 & Mansagari
// ============================================================================
interface NakshatraPsychoProfile {
  name: string;
  ruler: string;
  archetypeEn: string;
  archetypeHi: string;
  midnightMindEn: string;
  midnightMindHi: string;
  rageTriggerEn: string;
  rageTriggerHi: string;
  chronicInsecurityEn: string;
  chronicInsecurityHi: string;
  selfSabotageEn: string;
  selfSabotageHi: string;
}

const NAKSHATRA_PROFILES: Record<number, NakshatraPsychoProfile> = {
  0: {
    name: 'Ashwini', ruler: 'Ketu',
    archetypeEn: 'The Primal Pioneer & Swift Healer', archetypeHi: 'आद्य अश्वारोही एवं द्रुत चिकित्सक',
    midnightMindEn: 'Your mind operates at hyper-speed, craving immediate momentum and panicking when stalled in bureaucratic limbo. In solitude, you obsess over unfinished race lines and fear irrelevance.',
    midnightMindHi: 'आपका मन प्रचंड वेग से दौड़ता है; किसी भी कार्य में तनिक सा ठहराव या लालफीताशाही आपको विचलित कर देती है। एकांत में आप अधूरी दौड़ों और समय बीतने के अज्ञात भय से जूझते हैं।',
    rageTriggerEn: 'Sluggishness, unnecessary red tape, and being held back by indecisive authorities.',
    rageTriggerHi: 'धीमापन, व्यर्थ की औपचारिकताएं और ढुलमुल रवैये वाले अधिकारियों द्वारा रोका जाना।',
    chronicInsecurityEn: 'Dread of being physically or professionally crippled before achieving your zenith.',
    chronicInsecurityHi: 'अपने चरम पर पहुंचने से पूर्व ही शारीरिक अथवा व्यावसायिक रूप से अक्षम हो जाने का भय।',
    selfSabotageEn: 'Abandoning projects at 85% completion because the initial adrenaline rush has evaporated.',
    selfSabotageHi: 'प्रारंभिक रोमांच समाप्त होते ही 85% पूर्ण हो चुके कार्यों को बीच में छोड़कर नई दिशा में कूद पड़ना।',
  },
  1: {
    name: 'Bharani', ruler: 'Venus',
    archetypeEn: 'The Bearer of Sacred Burdens & Extremes', archetypeHi: 'प्रचंड संवेगात्मक भार एवं पुनर्जन्म का साधक',
    midnightMindEn: 'You carry volcanic emotional extremes. You bear heavy psychological burdens for loved ones until you reach a breaking point of fierce renunciation.',
    midnightMindHi: 'आप गहरे संवेगात्मक अंतर्द्वंद्व और अतिवाद को जीते हैं। आप अपनों का भारी मानसिक बोझ तब तक ढोते हैं जब तक कि अचानक सब कुछ त्यागने का आक्रोश न भड़क जाए।',
    rageTriggerEn: 'Hypocrisy, emotional manipulation, and having your non-negotiable boundaries breached.',
    rageTriggerHi: 'पाखंड, भावनात्मक ब्लैकमेल और अपनी मर्यादा सीमाओं का जबरन उल्लंघन किया जाना।',
    chronicInsecurityEn: 'Deep-seated terror of betrayal after investing unconditional loyalty.',
    chronicInsecurityHi: 'सर्वस्व निष्ठा समर्पित करने के उपरांत पीठ में छुरा घोंपे जाने का अवचेतन भय।',
    selfSabotageEn: 'Holding extreme grudges in suffocating silence until an atomic bridge-burning explosion occurs.',
    selfSabotageHi: 'मन ही मन कड़वाहट को दबाए रखना और फिर अचानक संबंध की सारी पुलिया एक क्षण में जला देना।',
  },
  2: {
    name: 'Krittika', ruler: 'Sun',
    archetypeEn: 'The Razor Flame & Incisive Critic', archetypeHi: 'अग्नि की तीक्ष्ण ज्वाला एवं निर्मम सत्यवादी',
    midnightMindEn: 'You possess a searing intellect that cuts through deception like a laser. In midnight solitude, your own critical blade turns inward, torturing you over past imperfections.',
    midnightMindHi: 'आपकी बुद्धि लेजर किरण की भांति असत्य को चीर देती है। आधी रात के सन्नाटे में आपकी यही आलोचनात्मक छुरी अपने ही भीतर मुड़कर आत्म-ग्लानि उत्पन्न करती है।',
    rageTriggerEn: 'Falsity, incompetent sycophancy, and being commanded by individuals you do not respect.',
    rageTriggerHi: 'झूठ, अयोग्य लोगों की चापलूसी और ऐसे व्यक्तियों द्वारा शासित होना जिनका आप सम्मान नहीं करते।',
    chronicInsecurityEn: 'Fear of losing intellectual supremacy or appearing foolish in public forums.',
    chronicInsecurityHi: 'बौद्धिक वर्चस्व खोने अथवा सार्वजनिक मंच पर मूर्ख सिद्ध हो जाने का गहरा संकोच।',
    selfSabotageEn: 'Unleashing caustic, unfiltered verbal truths that permanently alienate crucial allies.',
    selfSabotageHi: 'कड़वे और तीखे सच को बिना किसी कूटनीति के बोलकर अपने ही विश्वस्त सहयोगियों को दूर कर देना।',
  },
  3: {
    name: 'Rohini', ruler: 'Moon',
    archetypeEn: 'The Luminous Creator & Magnetic Sensualist', archetypeHi: 'सृजन का कांतिमान केंद्र एवं सौंदर्य-उपासक',
    midnightMindEn: 'Hungry for visual elegance, artistic perfection, and tender devotion. At night, you battle possessiveness, comparing your material/aesthetic standing with others.',
    midnightMindHi: 'सौंदर्य, कलात्मक पूर्णता और अनन्य आत्मीयता की गहरी भूख। एकांत में मन ईर्ष्या, असुरक्षा और दूसरों से अपनी तुलना के भंवर में फंस जाता है।',
    rageTriggerEn: 'Crude vulgarity, aesthetic deprivation, and feeling unappreciated or emotionally starved.',
    rageTriggerHi: 'फूहड़पन, सौंदर्यहीनता और अपने समर्पण की उपेक्षा या भावनात्मक उपेक्षा किया जाना।',
    chronicInsecurityEn: 'Dread of physical decay, fading youth, and being replaced by someone more charming.',
    chronicInsecurityHi: 'शारीरिक आकर्षण क्षीण होने, बुढ़ापे और अपनी जगह किसी अन्य को प्राथमिकता मिलने का भय।',
    selfSabotageEn: 'Over-indulging in luxurious escapism or emotional manipulation to retain control.',
    selfSabotageHi: 'नियंत्रण बनाए रखने के लिए भावनात्मक रूठना-मनाना अथवा विलासिता में पलायन करना।',
  },
  4: {
    name: 'Mrigashira', ruler: 'Mars',
    archetypeEn: 'The Questing Deer & Eternal Seeker', archetypeHi: 'सत्य का खोजी मृग एवं बेचैन अन्वेषक',
    midnightMindEn: 'Your mind is a tireless detective, sniffing out clues, researching anomalies, and wandering restlessly. In solitude, you suffer from the curse of insatiable curiosity.',
    midnightMindHi: 'आपका मन एक चतुर जासूस की तरह लगातार खोज करता रहता है। एकांत में आप कभी एक विचार पर टिक नहीं पाते; अतृप्त जिज्ञासा आपको बेचैन रखती है।',
    rageTriggerEn: 'Being kept in the dark, dogmatic censorship, and people who refuse to answer direct questions.',
    rageTriggerHi: 'सच्चाई छिपाया जाना, अंधविश्वास थोपना और सीधे प्रश्नों का गोलमोल उत्तर दिया जाना।',
    chronicInsecurityEn: 'Terror of intellectual stagnancy or making an irreversible commitment to the wrong choice.',
    chronicInsecurityHi: 'गलत विकल्प चुनकर स्थायी रूप से फंस जाने अथवा मानसिक जड़ता का गहरा भय।',
    selfSabotageEn: 'Second-guessing decisions at the eleventh hour, abandoning solid reality for greener pastures.',
    selfSabotageHi: 'अंतिम क्षण में अपने ही निर्णयों पर संदेह करना और हाथ आए अवसर को छोड़कर नई मृगतृष्णा के पीछे भागना।',
  },
  5: {
    name: 'Ardra', ruler: 'Rahu',
    archetypeEn: 'The Storm Bringer & Diamond of Truth', archetypeHi: 'रुद्र का झंझावात एवं अश्रुओं से तराशा हीरा',
    midnightMindEn: 'You dwell amidst lightning and thunder. Your midnight mind experiences profound existential sorrow, dissecting collective trauma and human duplicity with chilling lucidity.',
    midnightMindHi: 'आप तूफानों के बीच जीते हैं। आधी रात को आपका मन गहरे अस्तित्वगत शोक, सांसारिक छल-प्रपंच और एकाकीपन को बड़ी निर्ममता से महसूस करता है।',
    rageTriggerEn: 'Arbitrary authority, sanctimonious moralizing, and systemic injustice.',
    rageTriggerHi: 'अहंकारी सत्ता, पाखंडी उपदेश और व्यवस्थागत अन्याय को देखकर भीतर ज्वालामुखी धधकता है।',
    chronicInsecurityEn: 'Dread of psychic disintegration, chaos, and being misunderstood as permanently toxic.',
    chronicInsecurityHi: 'मानसिक संतुलन बिखरने और समाज द्वारा सदैव गलत समझे जाने की गहरी कचोट।',
    selfSabotageEn: 'Blowing up stable situations preemptively because peace feels unnaturally suspicious.',
    selfSabotageHi: 'स्थिर और शांत परिस्थितियों को पहले ही तहस-नहस कर देना क्योंकि शांति आपको संदिग्ध लगती है।',
  },
  6: {
    name: 'Punarvasu', ruler: 'Jupiter',
    archetypeEn: 'The Returning Arrow of Renewal', archetypeHi: 'पुनरुत्थान का अक्षय बाण एवं दयालु आश्रयदाता',
    midnightMindEn: 'Blessed with resilience, yet haunted by past losses. At night, you replay how often you gave your last grain of wheat only to be discarded when the recipient prospered.',
    midnightMindHi: 'बार-बार शून्य से उठ खड़े होने की शक्ति, किंतु पुरानी वंचनाओं की टीस। एकांत में आप सोचते हैं कि कैसे आपने दूसरों को सहारा दिया और वे समर्थ होते ही आपको भूल गए।',
    rageTriggerEn: 'Ungrateful entitlement, desecration of sacred principles, and betrayal of hospitality.',
    rageTriggerHi: 'अहसानफरामोशी, मर्यादाओं का हनन और आपके द्वारा दिए गए आश्रय का दुरुपयोग।',
    chronicInsecurityEn: 'Fear of having to rebuild from scratch yet again in advanced years.',
    chronicInsecurityHi: 'उम्र के किसी भी पड़ाव पर पुनः शून्य से शुरुआत करने की विवशता का अवचेतन भय।',
    selfSabotageEn: 'Excessive leniency toward repeat offenders, letting parasites drain your resources twice.',
    selfSabotageHi: 'धोखेबाजों को बार-बार क्षमादान देना और परजीवियों को अपनी संचित ऊर्जा दोबारा चूसने देना।',
  },
  7: {
    name: 'Pushya', ruler: 'Saturn',
    archetypeEn: 'The Nurturing High Priest & Guardian', archetypeHi: 'दैवीय पोषणकर्ता एवं कर्तव्यनिष्ठ संरक्षक',
    midnightMindEn: 'You act as everyone’s foster parent, keeping sorrows hidden behind a stoic smile. In midnight stillness, a cold loneliness whispers that no one will ever care for you the way you care for them.',
    midnightMindHi: 'आप सबका पोषण करते हैं किंतु स्वयं के आंसू पी जाते हैं। रात के सन्नाटे में यह टीस सालती है कि जितना आपने संसार को दिया, उसका दसवां हिस्सा भी आपको कभी नहीं मिलेगा।',
    rageTriggerEn: 'Neglect of dependents, mockery of duty, and irreverence toward foundational traditions.',
    rageTriggerHi: 'कर्तव्य से मुंह मोड़ना, कमजोरों की उपेक्षा और मर्यादाओं का उपहास उड़ाना।',
    chronicInsecurityEn: 'Terror of becoming an emotional or physical burden on others in old age.',
    chronicInsecurityHi: 'वृद्धावस्था में किसी पर बोझ बन जाने अथवा अपनी स्वायत्तता खोने का भय।',
    selfSabotageEn: 'Suffocating over-protectiveness, martyring yourself to cultivate indebtedness in others.',
    selfSabotageHi: 'अत्यधिक त्याग का नाटक कर अनजाने में दूसरों को अपराधी जैसा महसूस कराना।',
  },
  8: {
    name: 'Ashlesha', ruler: 'Mercury',
    archetypeEn: 'The Coiled Kundalini & Hypnotic Psychologist', archetypeHi: 'कुण्डलिनी का गूढ़ सर्प एवं सम्मोहनकारी मनोवैज्ञानिक',
    midnightMindEn: 'Your intuition reads micro-expressions and unvoiced jealousies with terrifying precision. At night, paranoia coils around your spine, calculating defenses against invisible daggers.',
    midnightMindHi: 'आपकी दृष्टि दूसरों के छिपे इरादों को भांप लेती है। आधी रात को अविश्वास का सर्प आपको घेर लेता है और आप अदृश्य शत्रुओं से बचने की रणनीतियां बुनते रहते हैं।',
    rageTriggerEn: 'Disrespect to your intelligence, overt surveillance, and cornering your autonomy.',
    rageTriggerHi: 'आपकी बुद्धि को कम आंकना, जासूसी करना और आपकी स्वाधीनता को घेरने की चेष्टा।',
    chronicInsecurityEn: 'Dread of emotional vulnerability; fear that surrendering control will destroy you.',
    chronicInsecurityHi: 'भावनात्मक समर्पण का भय; यह डर कि यदि नियंत्रण छोड़ा तो दूसरा आपको नष्ट कर देगा।',
    selfSabotageEn: 'Injecting subtle poison or passive-aggressive tests into relations until they actually fracture.',
    selfSabotageHi: 'संबंधों में सूक्ष्म संदेह का विष घोलना और ऐसी परीक्षाएं लेना जो अंततः संबंध को तोड़ दें।',
  },
  9: {
    name: 'Magha', ruler: 'Ketu',
    archetypeEn: 'The Ancestral Monarch & Throne Bearer', archetypeHi: 'पितरों का कुलीन सम्राट एवं वंश-गौरव',
    midnightMindEn: 'You carry the heavy weight of lineage expectations and royal pride. In darkness, you agonize over whether your worldly achievements match the majestic standards of your ancestors.',
    midnightMindHi: 'आपके भीतर कुल-गौरव और राजसी स्वाभिमान का भारी भार है। एकांत में आप इस चिंता में घुलते हैं कि क्या आपकी उपलब्धियां आपके पूर्वजों के मान के अनुरूप हैं।',
    rageTriggerEn: 'Being treated as ordinary, disrespect to ancestry, and casual public dismissal.',
    rageTriggerHi: 'साधारण व्यक्ति जैसा बर्ताव किया जाना, कुल का अपमान और सार्वजनिक उपेक्षा।',
    chronicInsecurityEn: 'Horror of public disgrace, fallen status, or lineage extinction.',
    chronicInsecurityHi: 'सार्वजनिक रूप से अपमानित होने, पद से गिरने अथवा कुल की प्रतिष्ठा धूमिल होने का भय।',
    selfSabotageEn: 'Rigid aristocratic arrogance that prevents asking for timely help when drowning.',
    selfSabotageHi: 'अहंकार में डूबकर संकट के समय भी किसी से हाथ फैलाने या सहायता मांगने से इनकार कर देना।',
  },
  10: {
    name: 'Purva Phalguni', ruler: 'Venus',
    archetypeEn: 'The Royal Reveler & Romantic Benefactor', archetypeHi: 'आनंद का राजसी उत्सव एवं सुरुचिपूर्ण प्रेमी',
    midnightMindEn: 'You hunger for life to be an exquisite feast of affection, luxury, and art. At night, you feel desolate when the applause fades, dreading the monotony of dry obligations.',
    midnightMindHi: 'आप जीवन को प्रेम, विलास और उत्सव का मंच बनाना चाहते हैं। रात को जब तालियों की गूंज शांत होती है, तो एकाकीपन और नीरस जिम्मेदारियों का भय आपको घेर लेता है।',
    rageTriggerEn: 'Emotional coldness, joyless austerity, and stinginess in romance or generosity.',
    rageTriggerHi: 'रूखापन, नीरस कंजूसी और प्रेम अथवा उपहारों में संकीर्णता का प्रदर्शन।',
    chronicInsecurityEn: 'Fear of unrequited adoration or ending up unloved in a sterile domestic cage.',
    chronicInsecurityHi: 'प्रेमविहीन नीरस दांपत्य में कैद हो जाने अथवा अपनी चमक खोने का डर।',
    selfSabotageEn: 'Procrastinating on arduous technical labor, seeking comfort over disciplined execution.',
    selfSabotageHi: 'कठिन परिश्रम को टालकर तात्कालिक सुख-सुविधाओं और विलासिता में समय नष्ट करना।',
  },
  11: {
    name: 'Uttara Phalguni', ruler: 'Sun',
    archetypeEn: 'The Noble Patron & Pillar of Covenants', archetypeHi: 'धर्म का संरक्षक स्तंभ एवं मैत्री का दूत',
    midnightMindEn: 'The natural patron who holds treaties and friendships together. At night, the loneliness of leadership bites deep; you wonder who will stand with you when you run out of favors.',
    midnightMindHi: 'मित्रता और वचनों के पक्के संरक्षक। एकांत में यह प्रश्न सालता है कि जब आप दूसरों को लाभ देने की स्थिति में नहीं रहेंगे, तब कौन आपका साथ निभाएगा।',
    rageTriggerEn: 'Broken contracts, ingratitude after patronage, and public breaches of decorum.',
    rageTriggerHi: 'वचनों से मुकरना, उपकार के बदले दगाबाजी और मर्यादाहीन सार्वजनिक आचरण।',
    chronicInsecurityEn: 'Terror of failing those who rely on your guardianship or going bankrupt privately.',
    chronicInsecurityHi: 'आश्रितों की रक्षा करने में असमर्थ होने अथवा गोपनीय रूप से दिवालिया दिखने का संकोच।',
    selfSabotageEn: 'Sacrificing personal wealth to preserve a dignified public façade long past sustainability.',
    selfSabotageHi: 'झूठी सामाजिक प्रतिष्ठा और दिखावे को बनाए रखने के लिए अपनी निजी संपत्ति लुटा देना।',
  },
  12: {
    name: 'Hasta', ruler: 'Moon',
    archetypeEn: 'The Dexterous Alchemist & Anxious Craftsperson', archetypeHi: 'हस्तशिल्प का सिद्ध जादूगर एवं संवेदनशील शिल्पी',
    midnightMindEn: 'Your hands and mind are constantly working, calculating, scheming, or creating. In the dark, a nervous vibration hums through your limbs—fearing loss of precision and micro-control.',
    midnightMindHi: 'हाथ और मन निरंतर किसी उधेड़बुन, योजना या शिल्प में लगे रहते हैं। रात को स्नायुओं में एक अज्ञात तनाव रहता है—हर छोटी बात पर नियंत्रण खोने का भय सताता है।',
    rageTriggerEn: 'Clumsiness, sloppy execution, and having your carefully organized systems disordered.',
    rageTriggerHi: 'फूहड़ काम, लापरवाही और आपकी सुव्यवस्थित व्यवस्था को अस्त-व्यस्त कर देना।',
    chronicInsecurityEn: 'Dread of mental decline, trembling hands, and being rendered useless.',
    chronicInsecurityHi: 'मानसिक तीक्ष्णता क्षीण होने और किसी काम का न रह जाने का अवचेतन भय।',
    selfSabotageEn: 'Micro-managing details until collaborators revolt, paralyzed by endless edits.',
    selfSabotageHi: 'हर छोटी बात में मीन-मेख निकालना और परफेक्शन के चक्कर में काम को कभी पूरा न होने देना।',
  },
  13: {
    name: 'Chitra', ruler: 'Mars',
    archetypeEn: 'The Celestial Architect & Lone Sculptor', archetypeHi: 'विश्वकर्मा का दिव्य शिल्पी एवं अनूठा सर्जक',
    midnightMindEn: 'You see the geometric flaws in everything and everyone. In midnight isolation, your brutal internal critic dismantles your own creations, demanding superhuman perfection.',
    midnightMindHi: 'आप हर वस्तु और व्यक्ति में कमियां तुरंत देख लेते हैं। एकांत में आपकी अपनी ही आलोचनात्मक बुद्धि आपकी बनाई कृतियों को तोड़कर पुनः गढ़ने के उन्माद में लग जाती है।',
    rageTriggerEn: 'Ugliness, mediocre compromise, and someone claiming credit for your design.',
    rageTriggerHi: 'कुरुपता, घटिया समझौता और आपकी मौलिक रचना का श्रेय किसी और द्वारा ले जाना।',
    chronicInsecurityEn: 'Fear of creating something flawed, derivative, or aesthetically forgotten.',
    chronicInsecurityHi: 'साधारण दिखने, विस्मृत हो जाने अथवा किसी अधूरी रचना के साथ जीने का भय।',
    selfSabotageEn: 'Destroying brilliant half-finished work in fits of dissatisfaction, starting from scratch repeatedly.',
    selfSabotageHi: 'असंतोष के उन्माद में अपने ही श्रेष्ठ कार्यों को नष्ट कर पुनः नए सिरे से शुरुआत करना।',
  },
  14: {
    name: 'Swati', ruler: 'Rahu',
    archetypeEn: 'The Independent Pearl in the Gale', archetypeHi: 'झंझावात में तैरता स्वाधीन मोती एवं वायु-पुत्र',
    midnightMindEn: 'You value freedom above life itself. In the quiet of night, you fear emotional cages; the moment someone builds a fence around you, your instinct is to fly into the storm.',
    midnightMindHi: 'आप स्वाधीनता को प्राणों से अधिक प्रिय मानते हैं। आधी रात को यह डर सताता है कि कोई आपको किसी सामाजिक या पारिवारिक पिंजरे में न बांध दे।',
    rageTriggerEn: 'Possessive jealousy, micromanagement, and arbitrary restrictions on your mobility.',
    rageTriggerHi: 'शक, आधिपत्य जमाने की चेष्टा और आपकी गति पर पाबंदियां लगाना।',
    chronicInsecurityEn: 'Horror of being trapped in suffocating conformity or domestic stagnation.',
    chronicInsecurityHi: 'दकियानूसी बंधनों में घुटकर अपनी पहचान और गतिशीलता खो देने का भय।',
    selfSabotageEn: 'Scattering energy in ten directions at once, refusing to anchor roots in fertile soil.',
    selfSabotageHi: 'एक साथ दस दिशाओं में भटकना और किसी एक मजबूत आधार पर जड़ें जमाने से कतराना।',
  },
  15: {
    name: 'Vishakha', ruler: 'Jupiter',
    archetypeEn: 'The Triumphant Conqueror & Fixated Archer', archetypeHi: 'लक्ष्यवेधी इंद्र-अग्नि एवं अदम्य विजेता',
    midnightMindEn: 'Driven by intense ambition and relentless focus on the trophy. In midnight solitude, burning envy or obsession over competitors keeps you awake, measuring the distance to the goal.',
    midnightMindHi: 'प्रचंड महत्वाकांक्षा और लक्ष्य पर अर्जुन जैसी दृष्टि। एकांत में प्रतिस्पर्धियों से आगे निकलने की धुन और ईर्ष्या की आग नींद उड़ा देती है।',
    rageTriggerEn: 'Being denied your earned prize, obstruction by gatekeepers, and rivals gloating.',
    rageTriggerHi: 'मेहनत के फल से वंचित किया जाना, बाधाएं खड़ी करना और विरोधियों का उपहास।',
    chronicInsecurityEn: 'Terror of coming in second place or seeing lesser minds inherit the victory.',
    chronicInsecurityHi: 'द्वितीय स्थान पर रह जाने अथवा कम योग्य व्यक्तियों को बाजी मारते देखने की कचोट।',
    selfSabotageEn: 'Obsessing over a single narrow victory while your broader life and relationships burn.',
    selfSabotageHi: 'एक संकीर्ण जीत की धुन में अपने स्वास्थ्य, परिवार और शांति की बलि चढ़ा देना।',
  },
  16: {
    name: 'Anuradha', ruler: 'Saturn',
    archetypeEn: 'The Devoted Lotus of Exile & Cosmic Harmony', archetypeHi: 'विरह में खिला पावन कमल एवं निष्ठावान मित्र',
    midnightMindEn: 'Capable of profound loyalty through adversity, yet familiar with deep inner exile. At night, you feel homesick for an unearthly sanctuary, yearning for pure brotherhood.',
    midnightMindHi: 'कठिनाइयों में अडिग निष्ठा, किंतु भीतर एक गहरा विरह। आधी रात को मन इस संसार में परायापन महसूस करता है और किसी आत्मिक सत्य की खोज में तड़पता है।',
    rageTriggerEn: 'Betrayal of fraternity, malicious gossip behind friends’ backs, and cruelty to loyal souls.',
    rageTriggerHi: 'मित्रता में दगा, पीठ पीछे चुगली और सच्चे वफादारों के साथ किया गया दुर्व्यवहार।',
    chronicInsecurityEn: 'Dread of dying alone in spiritual or physical exile without true companions.',
    chronicInsecurityHi: 'जीवन के अंत में सर्वथा एकाकी रह जाने और अपनों द्वारा विस्मृत कर दिए जाने का भय।',
    selfSabotageEn: 'Staying loyal to toxic organizations or abusive partners decades past all reason.',
    selfSabotageHi: 'कष्टकारी संबंधों या संस्थाओं से अंध निष्ठा के कारण वर्षों तक चिपके रहना।',
  },
  17: {
    name: 'Jyeshtha', ruler: 'Mercury',
    archetypeEn: 'The Sovereign Eldest & Hidden Talisman', archetypeHi: 'ज्येष्ठ पद का उत्तराधिकारी एवं रहस्यमयी रक्षक',
    midnightMindEn: 'You hold supreme protective authority, yet battle a fragile inner child. In darkness, you fear humiliation, constantly guarding against junior upstarts challenging your throne.',
    midnightMindHi: 'आप वरिष्ठता का अधिकार रखते हैं किंतु भीतर एक असुरक्षित बालक छिपा है। रात के सन्नाटे में अपमान और नए लोगों द्वारा आपका स्थान छीन लिए जाने का भय सताता है।',
    rageTriggerEn: 'Insolence from juniors, disrespect to your rank, and condescending lectures.',
    rageTriggerHi: 'कनिष्ठों की धृष्टता, पद की अवहेलना और किसी का आपको सिखाने का प्रयास करना।',
    chronicInsecurityEn: 'Horror of public dethronement, senility, or having your secrets weaponized.',
    chronicInsecurityHi: 'सार्वजनिक रूप से पदच्युत होने अथवा अपने गुप्त रहस्यों के उजागर होने का डर।',
    selfSabotageEn: 'Becoming isolated in paranoid defensiveness, driving away natural successors.',
    selfSabotageHi: 'अति-संदेह में घिरकर एकाकी हो जाना और योग्य उत्तराधिकारियों को शत्रु मानकर दूर भगाना।',
  },
  18: {
    name: 'Mula', ruler: 'Ketu',
    archetypeEn: 'The Root Destroyer & Alchemical Destroyer of Illusions', archetypeHi: 'मूल-उच्छेदन की शक्ति एवं संचित बंधनों का संहारक',
    midnightMindEn: 'You possess the power to uproot rotten trees and demolish fake facades. In midnight hours, you face the abyss—existential void, ancestral curses, and radical impermanence.',
    midnightMindHi: 'सड़े-गले ढांचों को जड़ से उखाड़ फेंकने की शक्ति। रात को मन महा-शून्य के सामने खड़ा होता है—अस्तित्व का भयंकर सत्य और सब कुछ मिट जाने का अहसास।',
    rageTriggerEn: 'Superficial band-aids on rotting problems, ancestral guilt, and moral cowardice.',
    rageTriggerHi: 'गंभीर समस्याओं पर लीपापोती करना, कायरता और झूठी परंपराओं का ढोंग।',
    chronicInsecurityEn: 'Terror of sudden catastrophic total loss—home, wealth, or sanity—overnight.',
    chronicInsecurityHi: 'रातों-रात सब कुछ लुट जाने, घर-द्वार अथवा मानसिक संतुलन छिन जाने का अवचेतन भय।',
    selfSabotageEn: 'Pulling the emergency cord and demolishing flourishing setups when things get too comfortable.',
    selfSabotageHi: 'जब जीवन में सब कुछ शांत और सुगम होने लगे, तो स्वयं ही विस्फोट कर सब नष्ट कर देना।',
  },
  19: {
    name: 'Purva Ashadha', ruler: 'Venus',
    archetypeEn: 'The Invincible Wave & Proud Purifier', archetypeHi: 'अपराजित जल-तरंग एवं गर्वोन्मत्त विजेता',
    midnightMindEn: 'You believe firmly in your moral rightness and destiny of triumph. At night, you struggle to admit error, convincing yourself that the world simply lacks the vision to comprehend you.',
    midnightMindHi: 'अपने सत्य और विजय पर अटूट विश्वास। एकांत में अपनी गलती स्वीकार करने में भारी कठिनाई होती है; आप मानते हैं कि दुनिया आपको समझने में असमर्थ है।',
    rageTriggerEn: 'Being proven wrong publicly, condescension, and being told you cannot accomplish something.',
    rageTriggerHi: 'सार्वजनिक रूप से गलत साबित होना, उपेक्षा और यह कहा जाना कि यह तुम्हारे बस का नहीं है।',
    chronicInsecurityEn: 'Dread of being seen as ordinary, defeated, or morally compromised.',
    chronicInsecurityHi: 'पराजित, साधारण अथवा नैतिक रूप से कलंकित दिखने का असहनीय भय।',
    selfSabotageEn: 'Doubling down on flawed strategies out of sheer obstinate pride rather than pivoting.',
    selfSabotageHi: 'हठधर्मिता और झूठी शान में आकर गलत रणनीति पर अड़े रहना और समय पर मार्ग न बदलना।',
  },
  20: {
    name: 'Uttara Ashadha', ruler: 'Sun',
    archetypeEn: 'The Universal Sovereign of Lasting Victory', archetypeHi: 'विश्वेदेवों का शाश्वत धर्म-स्तंभ एवं धीर विजेता',
    midnightMindEn: 'Endowed with quiet endurance and stately patience. In midnight silence, the heavy burden of solitary responsibility presses on your chest; you bear duties with solemn stoicism.',
    midnightMindHi: 'धैर्य और मर्यादा की प्रतिमूर्ति। आधी रात को अकेलेपन और जिम्मेदारियों का भारी पत्थर छाती पर महसूस होता है; आप चुपचाप सब कुछ सहते हैं।',
    rageTriggerEn: 'Anarchy, unprincipled opportunism, and lack of seriousness in solemn matters.',
    rageTriggerHi: 'अराजकता, अवसरवादिता और गंभीर कार्यों में छिछोरापन व ढिलाई।',
    chronicInsecurityEn: 'Fear of exhausting all patience and breaking down in front of those who lean on you.',
    chronicInsecurityHi: 'धैर्य की सीमा टूट जाने और आश्रितों के सामने कमजोर पड़ जाने का भय।',
    selfSabotageEn: 'Excessive solemnity and emotional austerity that starves relationships of warmth.',
    selfSabotageHi: 'इतने अधिक गंभीर और कठोर बन जाना कि संबंधों में प्रेम की गरमाहट ही सूख जाए।',
  },
  21: {
    name: 'Shravana', ruler: 'Moon',
    archetypeEn: 'The Cosmic Listener & Keeper of Wisdom', archetypeHi: 'ब्रह्मांडीय श्रोता एवं शास्त्रों का पावन भंडार',
    midnightMindEn: 'Your ears catch whispers, tones, and hidden malice before words are completed. In solitude, your mind replays audio recordings of past conflicts, deciphering double meanings.',
    midnightMindHi: 'आप दूसरों के कहे बिना उनके मन की ध्वनि सुन लेते हैं। एकांत में पुरानी बातचीत, कटाक्ष और दोहरे अर्थों को बार-बार याद कर मन को व्यथित करते हैं।',
    rageTriggerEn: 'Being talked over, intentional distortion of your words, and vulgar noise.',
    rageTriggerHi: 'बात काट देना, आपके शब्दों का गलत अर्थ निकालना और कर्कश कोलाहल।',
    chronicInsecurityEn: 'Dread of deafness, mental confusion, or being discredited by false rumors.',
    chronicInsecurityHi: 'झूठे अपवादों द्वारा छवि धूमिल किए जाने अथवा अपनी अंतर्दृष्टि खोने का डर।',
    selfSabotageEn: 'Over-interpreting casual remarks as deliberate insults, retreating into cold silence.',
    selfSabotageHi: 'अनजाने में कही गई बातों में भी षड्यंत्र ढूंढना और रूठकर मौन साध लेना।',
  },
  22: {
    name: 'Dhanishta', ruler: 'Mars',
    archetypeEn: 'The Rhythmic Flute of Abundance & Solitary Lion', archetypeHi: 'अष्टवसुओं की ऐश्वर्य-बांसुरी एवं एकाकी सिंह',
    midnightMindEn: 'Attuned to rhythm, high wealth, and fame, yet deeply lonely inside. At night, an empty echo reminds you that external applause cannot warm the cold chambers of your inner temple.',
    midnightMindHi: 'यश, वैभव और संगीत की साधना, किंतु भीतर एक गहरा शून्य। तालियों की गूंज के बाद भी एकांत में मन एक अजीब खोखलेपन का अनुभव करता है।',
    rageTriggerEn: 'Rhythm disruption, betrayal of confidence, and partners seeking to dim your spotlight.',
    rageTriggerHi: 'व्यवस्था भंग करना, विश्वासघात और आपके प्रभाव को कमतर आंकने का प्रयास।',
    chronicInsecurityEn: 'Fear that beneath the glamorous accomplishments, you are fundamentally unlovable.',
    chronicInsecurityHi: 'यह अवचेतन डर कि सारी उपलब्धियों के बाद भी कोई आपको सच्चा प्रेम नहीं करता।',
    selfSabotageEn: 'Prioritizing status symbols and public reputation over raw human vulnerability.',
    selfSabotageHi: 'सच्चे रिश्तों के स्थान पर प्रतिष्ठा और दिखावे को प्राथमिकता देकर अपनों को खो देना।',
  },
  23: {
    name: 'Shatabhisha', ruler: 'Rahu',
    archetypeEn: 'The Hundred Healers & Veiled Enigma', archetypeHi: 'शत-भिषजों का रहस्यमयी पर्दा एवं एकांत वैद्य',
    midnightMindEn: 'You live behind a hundred concentric veils. In the midnight laboratory of your mind, you dissect human frailty, astronomy, or medicine, terrified of exposing your soft underbelly.',
    midnightMindHi: 'आप सौ पर्दों के पीछे जीते हैं। रात की प्रयोगशाला में आप संसार के रहस्यों और मानव की कमजोरियों का विश्लेषण करते हैं, अपनी कमजोरी कभी बाहर नहीं आने देते।',
    rageTriggerEn: 'Breach of medical/personal privacy, intrusive interrogations, and forced vulnerability.',
    rageTriggerHi: 'गोपनीयता का हनन, अवांछित पूछताछ और जबरन दिल की बात उगलवाने की चेष्टा।',
    chronicInsecurityEn: 'Horror of total exposure, public scandal, or incurable chronic malady.',
    chronicInsecurityHi: 'सार्वजनिक कलंक, रहस्यों का खुलना अथवा किसी असाध्य रोग की चपेट में आने का डर।',
    selfSabotageEn: 'Hermetic total withdrawal, shutting out genuine healers and lovers in chronic cynicism.',
    selfSabotageHi: 'इतना अधिक एकांतवासी और संशयी बन जाना कि सच्चे शुभचिंतक भी निराश होकर लौट जाएं।',
  },
  24: {
    name: 'Purva Bhadrapada', ruler: 'Jupiter',
    archetypeEn: 'The Two-Faced Fire of Tapasya & Thunder', archetypeHi: 'तपस्या की दोमुखी ज्वाला एवं अज-एकपाद का रुद्र',
    midnightMindEn: 'You carry a fierce dual nature—saintly scholar by day, dark ascetic warrior at night. Your midnight mind grapples with apocalyptic visions, radical sacrifices, and intense passions.',
    midnightMindHi: 'दोहरा व्यक्तित्व—दिन में सौम्य विद्वान, रात में कठोर संन्यासी या तांत्रिक साधक। आधी रात को मन में प्रलयंकारी विचार, त्याग और तीव्र वैराग्य का ज्वार उठता है।',
    rageTriggerEn: 'Hypocritical piety, shallow materialism, and trivial gossip about sacred truths.',
    rageTriggerHi: 'ढोंगी साधुता, ओछा भौतिकवाद और गंभीर विषयों पर ओछी टिप्पणियां।',
    chronicInsecurityEn: 'Fear of succumbing to hidden dark obsessions or madness of the solitary soul.',
    chronicInsecurityHi: 'अपनी ही दमित वासनाओं के वेग में बह जाने अथवा पागलपन की हद तक अकेले पड़ जाने का डर।',
    selfSabotageEn: 'Extreme self-mortification or suddenly burning your worldly life down to become an ascetic.',
    selfSabotageHi: 'अतिवादी वैराग्य में आकर अपनी जमी-जमाई गृहस्थी या करियर को अचानक ठोकर मार देना।',
  },
  25: {
    name: 'Uttara Bhadrapada', ruler: 'Saturn',
    archetypeEn: 'The Serpent of the Cosmic Deep & Master of Stillness', archetypeHi: 'अहिर्बुध्न्य का पाताल-सर्प एवं ध्यानस्थ महायोगी',
    midnightMindEn: 'Endowed with deep oceanic stillness. At night, you descend into profound contemplation; you can absorb immense pain without a ripple on the surface, yet risk emotional numbness.',
    midnightMindHi: 'गंभीर समुद्र जैसी अगाध शांति। आप भारी से भारी आघात को बिना हिले पी जाते हैं, किंतु एकांत में इस बात का खतरा रहता है कि भावनाएं पूरी तरह सुन्न न हो जाएं।',
    rageTriggerEn: 'Cruelty to animals or innocent beings, desecration of water/sanctuaries, and cheap emotional tantrums.',
    rageTriggerHi: 'निर्दोषों पर अत्याचार, पावन स्थलों का अपमान और दूसरों के ओछे नखरे।',
    chronicInsecurityEn: 'Dread of being swept away by chaotic emotional floods or losing mental equilibrium.',
    chronicInsecurityHi: 'भावुकता के तूफान में अपनी बौद्धिक स्थिरता और संयम खो देने का भय।',
    selfSabotageEn: 'Becoming so emotionally unmovable that loved ones feel they are speaking to a stone wall.',
    selfSabotageHi: 'इतना भावहीन और तटस्थ हो जाना कि परिजन आपके सामने पत्थर की दीवार जैसा महसूस करें।',
  },
  26: {
    name: 'Revati', ruler: 'Mercury',
    archetypeEn: 'The Compassionate Ferryman of Lost Souls', archetypeHi: 'पूषा का दयालु नाविक एवं भवसागर का तारणहार',
    midnightMindEn: 'You feel the suffering of the entire universe. At night, you absorb others’ psychic burdens, weeping over stray animals, forgotten children, and the painful passage of time.',
    midnightMindHi: 'आप पूरे ब्रह्मांड की पीड़ा अपने हृदय में महसूस करते हैं। रात को दूसरों के दुख, बेसहारा जीवों की व्यथा और समय के बीतने का दर्द आपकी आंखों में आंसू ला देता है।',
    rageTriggerEn: 'Cruelty to the defenseless, petty greed, and hard-hearted mockery of kindness.',
    rageTriggerHi: 'असमर्थों पर जुल्म, संकीर्ण लालच और किसी की दयालुता का उपहास उड़ाना।',
    chronicInsecurityEn: 'Terror of being left behind on the shore after safely ferrying everyone else across.',
    chronicInsecurityHi: 'सबको भवसागर पार कराकर स्वयं अकेले किनारे पर छूट जाने का गहरा दर्द।',
    selfSabotageEn: 'Total boundarylessness—bankrupting yourself emotionally and financially for ungrateful strays.',
    selfSabotageHi: 'मर्यादा का अभाव—अयोग्य और धूर्त लोगों की सहायता में अपना सर्वस्व लुटाकर कंगाल हो जाना।',
  },
};

// ============================================================================
// DYNAMIC CHAPTER 2: PSYCHOLOGY & HIDDEN TURMOIL
// ============================================================================
export function computeDynamicPsychologySections(chart: ChartData): ChapterSection[] {
  const asc = chart.ascendant;
  const ascElem = SIGNS[asc.signIndex].element;
  const ascLord = asc.signLord;
  const ascLordPlanet = chart.planets.find((p) => p.id === ascLord);
  const moon = chart.planets.find((p) => p.id === 'Moon') ?? chart.planets[1];
  const saturn = chart.planets.find((p) => p.id === 'Saturn')!;
  const mars = chart.planets.find((p) => p.id === 'Mars')!;
  const rahu = chart.planets.find((p) => p.id === 'Rahu')!;
  const ketu = chart.planets.find((p) => p.id === 'Ketu')!;
  const jupiter = chart.planets.find((p) => p.id === 'Jupiter')!;
  const mercury = chart.planets.find((p) => p.id === 'Mercury')!;

  const nakIdx = moon.nakshatraIndex ?? 0;
  const profile = NAKSHATRA_PROFILES[nakIdx] ?? NAKSHATRA_PROFILES[0];

  // Mental Yogas
  const satToMoonDist = ((moon.rasiHouseNumber - saturn.rasiHouseNumber + 12) % 12) + 1;
  const hasVisha = [saturn.rasiHouseNumber].includes(moon.rasiHouseNumber) ||
    [3, 7, 10].includes(satToMoonDist);
  const hasGrahan = [rahu.rasiHouseNumber, ketu.rasiHouseNumber].includes(moon.rasiHouseNumber);
  const hasAngarak = mars.rasiHouseNumber === moon.rasiHouseNumber;
  const hasGajakesari = [1, 4, 7, 10].includes(((jupiter.rasiHouseNumber - moon.rasiHouseNumber + 12) % 12) + 1);

  // Outer Persona vs Inner Mind
  let maskEn = '';
  let maskHi = '';
  if (ascElem === 'Fire') {
    maskEn = `Born in ${asc.signName} Ascendant, you present the posture of an intrepid commander: dynamic, bold, and unfazed by chaos. Acquaintances perceive you as an unstoppable force who demands respect and gets things done without hand-wringing.`;
    maskHi = `'${SIGN_HI[asc.signIndex]}' लग्न में जन्म होने से आप समाज में एक निर्भीक सेनापति की भांति दिखाई देते हैं: तेजस्वी, साहसी और संकट में तुरंत निर्णय लेने वाले। लोग आपको एक ऐसा व्यक्ति मानते हैं जो किसी भी चुनौती से भयभीत नहीं होता।`;
  } else if (ascElem === 'Earth') {
    maskEn = `Born in ${asc.signName} Ascendant, you present the demeanor of an unflinching bedrock: prudent, disciplined, and unshakable. People bring their chaotic problems to your door because you radiate pragmatic sanity and dependable silence.`;
    maskHi = `'${SIGN_HI[asc.signIndex]}' लग्न में जन्म होने से आप समाज में एक शांत चट्टान की तरह दिखाई देते हैं: गंभीर, व्यावहारिक और विश्वसनीय। लोग अपनी उलझनें लेकर आपके पास आते हैं क्योंकि आपके पास हर समस्या का संतुलित समाधान होता है।`;
  } else if (ascElem === 'Air') {
    maskEn = `Born in ${asc.signName} Ascendant, you present the persona of an articulate, engaging intellectual: socially graceful, observant, and effortlessly diplomatic. People assume your mind is always breezy, cheerful, and unburdened.`;
    maskHi = `'${SIGN_HI[asc.signIndex]}' लग्न में जन्म होने से आपका सामाजिक व्यक्तित्व अत्यंत वाक्पटु, मिलनसार और कूटनीतिक दिखाई देता है। लोग सोचते हैं कि आप सदैव प्रफुल्लित, तनावमुक्त और हर परिस्थिति में सामंजस्य बैठाने वाले हैं।`;
  } else {
    maskEn = `Born in ${asc.signName} Ascendant, you project the aura of a protective sanctuary: empathetic, receptive, and quietly dignified. People instinctively lean on you for emotional shelter, never guessing the profound turbulence beneath your surface.`;
    maskHi = `'${SIGN_HI[asc.signIndex]}' लग्न में जन्म होने से आपका बाहरी रूप एक शांत आश्रयदाता जैसा है: संवेदनशील, मर्यादित और दूसरों के दुख को समझने वाला। लोग आप पर सहज विश्वास करते हैं, बिना यह जाने कि आपके भीतर कितना गहरा ज्वार-भाटा चल रहा है।`;
  }

  // Inner Mind derived from Moon Nakshatra & Yogas
  let innerMindEn = `Yet in midnight solitude, under your birth constellation ${profile.name} (governed by ${profile.ruler}), a vastly different psychological current takes over. ${profile.midnightMindEn}`;
  let innerMindHi = `किंतु अर्धरात्रि के सन्नाटे में, आपके जन्म नक्षत्र '${profile.name}' (स्वामी: ${PLANET_HI[profile.ruler] || profile.ruler}) के प्रभाववश मन के भीतर का सत्य बिल्कुल अलग होता है। ${profile.midnightMindHi}`;

  if (hasVisha) {
    innerMindEn += ` Concurrently, the heavy classical Visha Yoga (Saturn-Moon friction) casts a cold, melancholic shadow: you struggle to internalize praise, battle unexpressed grief, and feel that you must earn love through relentless self-sacrifice.`;
    innerMindHi += ` इसके साथ ही कुंडली में 'विष योग' (चंद्र-शनि का संबंध) अवचेतन में एक गहरी उदासी और अकेलेपन की छाया बनाए रखता है: आपको प्रशंसा पर सहज विश्वास नहीं होता और लगता है कि प्रेम पाने के लिए स्वयं को खपाना ही होगा।`;
  } else if (hasGrahan) {
    innerMindEn += ` Concurrently, Grahan Yoga (Moon-Node axis) injects sudden waves of hyper-vigilance, unexplainable premonitions, and intense existential anxiety that defies conventional logic.`;
    innerMindHi += ` इसके साथ ही 'ग्रहण योग' (चंद्र पर राहु/केतु का प्रभाव) मन में अचानक अज्ञात भय, विचित्र पूर्वाभास और तीव्र बेचैनी की तरंगें उत्पन्न करता है जो सामान्य तर्क से परे होती हैं।`;
  } else if (hasAngarak) {
    innerMindEn += ` Concurrently, Chandra-Mangala / Angarak dynamics generate a boiling inner urgency: you alternate between saintly patience and volcanic, righteous fury that burns your own nervous system.`;
    innerMindHi += ` इसके साथ ही 'अंगारक प्रभाव' (चंद्र-मंगल युति/दृष्टि) मन में एक उबलती हुई अधीरता देता है: आप लंबे समय तक सहते हैं और फिर अचानक ज्वालामुखी बनकर फट पड़ते हैं।`;
  } else if (hasGajakesari) {
    innerMindEn += ` Fortunately, the noble Gajakesari Yoga provides an indestructible inner compass: no matter how dark the midnight despair, your inherent spiritual dignity and moral conscience pull you back from the brink.`;
    innerMindHi += ` सौभाग्य से कुंडली में 'गजकेसरी योग' एक अटूट आत्मिक संबल प्रदान करता है: निराशा कितनी भी गहरी हो, आपका स्वाभिमान और अंतरात्मा की आवाज आपको पुनः खड़ा कर देती है।`;
  }

  const sec1: ChapterSection = {
    titleEn: 'The Public Mask vs. The Midnight Reality',
    titleHi: 'सामाजिक मुखौटा बनाम आधी रात का एकांत',
    leadEn: `The psychological tension between your ${asc.signName} Ascendant persona and ${profile.name} Moon reality.`,
    leadHi: `आपके '${SIGN_HI[asc.signIndex]}' लग्न के बाहरी आवरण और '${profile.name}' नक्षत्र के आंतरिक मानसिक सत्य का द्वंद्व।`,
    paragraphsEn: [maskEn, innerMindEn],
    paragraphsHi: [maskHi, innerMindHi],
    astrologicalCauseEn: `Brihat Jataka (Ch. 21, Shloka 1–4) & Saravali (Ch. 23): Lagna in ${asc.signName} (${ascElem} element, lord: ${ascLord} in house ${ascLordPlanet?.rasiHouseNumber || 1}) creates the outer armor, while Moon in ${moon.signName} at ${moon.dms} in ${profile.name} Nakshatra (Pada ${moon.pada}) governs the subterranean psyche. ${hasVisha ? 'Affliction of Saturn induces classical Visha Yoga melancholy.' : hasGrahan ? 'Rahu/Ketu connection generates Grahan Yoga psychic agitation.' : 'Planetary dignities establish emotional equilibrium.'}`,
    astrologicalCauseHi: `शास्त्रीय कारण: बृहज्जातक (अध्याय २१) एवं सारावली (अध्याय २३ - चन्द्रनक्षत्रफलाध्याय): लग्न '${SIGN_HI[asc.signIndex]}' (तत्व: ${ascElem}, लग्नेश: ${PLANET_HI[ascLord] || ascLord}) बाहरी व्यक्तित्व का निर्माण करता है, जबकि चंद्रमा '${SIGN_HI[moon.signIndex]}' में ${profile.name} नक्षत्र में मन के अवचेतन को संचालित करते हैं। ${hasVisha ? 'शनि-चंद्र संबंध से विष योग जनित उदासी फलित होती है।' : hasGrahan ? 'राहु/केतु अक्ष से ग्रहण योग जनित मानसिक बेचैनी उत्पन्न होती है।' : 'शुभ ग्रहों का प्रभाव मानसिक दृढ़ता प्रदान करता है।'}`,
    keyPointsEn: [
      `Outer Persona: ${asc.signName} (${ascElem} element) — Authoritative, disciplined boundary.`,
      `Midnight Psyche: ${profile.name} (${profile.archetypeEn}) — ${profile.ruler} governed.`,
      `Mental Core: ${hasVisha ? 'Visha Yoga (Stoic melancholy & unvoiced burden)' : hasGrahan ? 'Grahan Yoga (Visionary anxiety & psychic sensitivity)' : hasAngarak ? 'Angarak Fire (Boiling urgency & righteous anger)' : 'Gajakesari / Noble Dignity'}.`,
    ],
    keyPointsHi: [
      `बाहरी व्यक्तित्व: '${SIGN_HI[asc.signIndex]}' लग्न — संतुलित एवं सुदृढ़ सामाजिक आवरण।`,
      `आंतरिक चेतना: '${profile.name}' नक्षत्र (${profile.archetypeHi}) — स्वामी: ${PLANET_HI[profile.ruler] || profile.ruler}।`,
      `मूल मनोदशा: ${hasVisha ? 'विष योग (गहन उदासी व एकाकीपन का बोझ)' : hasGrahan ? 'ग्रहण योग (अति-संवेदनशीलता व अज्ञात चिंता)' : hasAngarak ? 'अंगारक योग (आक्रोश व अधीरता की ज्वाला)' : 'गजकेसरी योग (अखंड स्वाभिमान व विवेक)'}।`,
    ],
  };

  const sec2: ChapterSection = {
    titleEn: 'Secret Triggers, Resentments & The Self-Sabotage Trap',
    titleHi: 'आंतरिक ट्रिगर्स, गुप्त असंतोष एवं आत्म-विनाशकारी प्रवृत्तियां',
    leadEn: `The subconscious vulnerabilities that trip your destiny: Rage Triggers, Chronic Fears, and Self-Sabotage.`,
    leadHi: `वे अवचेतन कमजोरियां जो आपके बने-बनाए कार्यों में बाधा बनती हैं: क्रोध के ट्रिगर्स, गहरे भय और आत्म-घातक प्रवृत्तियां।`,
    paragraphsEn: [
      `Your Primary Rage Trigger: ${profile.rageTriggerEn} Mars placed in ${mars.signName} (House ${mars.rasiHouseNumber}) indicates that when you feel your boundaries breached or your competence patronized, anger does not simmer—it flashes with acute destructive potency. You withdraw into cold silence or issue an unsparing verbal execution that the other party never forgets.`,
      `Your Chronic Psychological Insecurity: ${profile.chronicInsecurityEn} Under Saturn’s placement in ${saturn.signName} (House ${saturn.rasiHouseNumber}), you nurse a silent terror of falling behind or being discarded when your utility expires.`,
      `The Self-Sabotage Trap: ${profile.selfSabotageEn} You must consciously recognize this loop: whenever life approaches sweet stability, your mind mistakes calm for complacency and manufactures an artificial crisis. Mastering this pattern is your master key to enduring triumph.`,
    ],
    paragraphsHi: [
      `क्रोध का मुख्य ट्रिगर: ${profile.rageTriggerHi} मंगल देव की '${SIGN_HI[mars.signIndex]}' में स्थिति (भाव ${mars.rasiHouseNumber}) यह दर्शाती है कि जब आपकी मर्यादा का उल्लंघन होता है, तो आपका क्रोध धीरे-धीरे नहीं सुलगता, बल्कि बिजली की तरह कौंधता है। आप या तो एकदम मौन होकर सामने वाले को जीवन से काट देते हैं, या ऐसा कटु सत्य कह देते हैं जिसे दूसरा जीवन भर नहीं भूल पाता।`,
      `अवचेतन का गहरा भय: ${profile.chronicInsecurityHi} शनि देव की '${SIGN_HI[saturn.signIndex]}' में स्थिति (भाव ${saturn.rasiHouseNumber}) के कारण मन में यह अज्ञात भय बना रहता है कि उपयोगिता समाप्त होते ही संसार आपको विस्मृत न कर दे।`,
      `आत्म-विनाशकारी चक्र (Self-Sabotage): ${profile.selfSabotageHi} इस मनोवैज्ञानिक दुर्बलता को पहचानना अनिवार्य है: जब भी जीवन में सब कुछ शांत और व्यवस्थित होने लगता है, आपका मन उस शांति को 'सन्नाटा' मानकर कोई न कोई नया बखेड़ा या तनाव खड़ा कर लेता है। इस आदत पर विजय पाना ही आपकी परम सिद्धि होगी।`,
    ],
    astrologicalCauseEn: `Saravali (Ch. 31–33) & Brihat Jataka (Ch. 2): Mars in House ${mars.rasiHouseNumber} governs impulsive fight-or-flight triggers; Saturn in House ${saturn.rasiHouseNumber} anchors the deep existential dread; Rahu in House ${rahu.rasiHouseNumber} drives obsessive over-reaching.`,
    astrologicalCauseHi: `शास्त्रीय कारण: सारावली (अध्याय ३१-३३) एवं बृहज्जातक: मंगल (भाव ${mars.rasiHouseNumber}) क्रोध व प्रतिक्रिया के ट्रिगर हैं; शनि (भाव ${saturn.rasiHouseNumber}) जीवन के मूल भय के नियामक हैं; तथा राहु (भाव ${rahu.rasiHouseNumber}) भ्रम व अति-महत्वाकांक्षा के कारक हैं।`,
    keyPointsEn: [
      `Rage Trigger: ${profile.rageTriggerEn}`,
      `Existential Insecurity: ${profile.chronicInsecurityEn}`,
      `Self-Sabotage Loop: ${profile.selfSabotageEn}`,
    ],
    keyPointsHi: [
      `क्रोध का ट्रिगर: ${profile.rageTriggerHi}`,
      `गहरा अवचेतन भय: ${profile.chronicInsecurityHi}`,
      `आत्म-घातक चक्र: ${profile.selfSabotageHi}`,
    ],
  };

  return [sec1, sec2];
}

// ============================================================================
// DYNAMIC CHAPTER 3: REAL-TIME ACTIVE LIFE PHASE X-RAY
// ============================================================================
export function computeDynamicActivePhaseSections(chart: ChartData): ChapterSection[] {
  const asc = chart.ascendant;
  const moon = chart.planets.find((p) => p.id === 'Moon') ?? chart.planets[1];
  const now = Date.now();
  const dashaPath = findActiveDashaPath(chart.vimshottari ?? [], now);

  const mdPeriod = dashaPath[0];
  const adPeriod = dashaPath[1];
  const pdPeriod = dashaPath[2];

  const mdLord = (mdPeriod?.lord as NineGrahaId) || 'Saturn';
  const adLord = (adPeriod?.lord as NineGrahaId) || 'Mercury';
  const pdLord = (pdPeriod?.lord as NineGrahaId) || adLord;

  const mdPlanet = chart.planets.find((p) => p.id === mdLord);
  const adPlanet = chart.planets.find((p) => p.id === adLord);

  const mdHouse = mdPlanet?.rasiHouseNumber || 1;
  const adHouse = adPlanet?.rasiHouseNumber || 1;

  // Mutual relationship between MD and AD
  const mutualDistance = ((adHouse - mdHouse + 12) % 12) + 1;
  const isShadashtaka = mutualDistance === 6 || mutualDistance === 8;
  const isDvidwadasa = mutualDistance === 2 || mutualDistance === 12;
  const isKendra = [1, 4, 7, 10].includes(mutualDistance);
  const isTrikona = [5, 9].includes(mutualDistance);

  // Saturn Transit relative to Moon (Pisces sidereal 2023-2025/2026)
  // Pisces sign index = 11
  const saturnTransitSignIdx = 11; // Pisces / Meena
  const saturnHouseFromMoon = ((saturnTransitSignIdx - moon.signIndex + 12) % 12) + 1;

  let sadeSatiStatusEn = '';
  let sadeSatiStatusHi = '';
  if (moon.signIndex === 11) {
    sadeSatiStatusEn = 'Peak Janma Shani (Sade Sati Phase 2 — Core Mental Pressure & Total Restructuring)';
    sadeSatiStatusHi = 'शिखर जन्म शनि (साढ़ेसाती का द्वितीय चरण — चरम मानसिक मंथन व जीवन का आमूलचूल पुनर्गठन)';
  } else if (moon.signIndex === 10) {
    sadeSatiStatusEn = 'Setting Sade Sati (Phase 3 — Settling Debts, Moving toward Stability)';
    sadeSatiStatusHi = 'उतरती साढ़ेसाती (तृतीय चरण — पुराने कर्जों व विवादों का निस्तारण, स्थायित्व की ओर प्रयाण)';
  } else if (moon.signIndex === 0) {
    sadeSatiStatusEn = 'Rising Sade Sati (Phase 1 — Domestic Churn, Elderly Health & New Responsibilities)';
    sadeSatiStatusHi = 'चढ़ती साढ़ेसाती (प्रथम चरण — पारिवारिक व्यय, बड़ों का स्वास्थ्य व नए दायित्वों का भार)';
  } else if (saturnHouseFromMoon === 8) {
    sadeSatiStatusEn = 'Ashtama Shani (Saturn in 8th from Moon — Critical Vigilance on Health, Litigation & Sudden Shocks)';
    sadeSatiStatusHi = 'कंटक/अष्टम शनि (चंद्र से अष्टम शनि — स्वास्थ्य, मुकदमों व आकस्मिक झटकों के प्रति सचेत रहने का काल)';
  } else if (saturnHouseFromMoon === 4) {
    sadeSatiStatusEn = 'Kantaka Shani (Saturn in 4th from Moon — Domestic Disruption & Property Delays)';
    sadeSatiStatusHi = 'कंटक शनि (चंद्र से चतुर्थ शनि — गृह-क्लेश, माता का स्वास्थ्य व संपत्ति में विलंब)';
  } else if (saturnHouseFromMoon === 10) {
    sadeSatiStatusEn = 'Kantaka Shani (Saturn in 10th from Moon — Workplace Restructuring & Heavy Executive Strain)';
    sadeSatiStatusHi = 'कंटक शनि (चंद्र से दशम शनि — कार्यक्षेत्र में भारी फेरबदल व कठोर परिश्रम की परीक्षा)';
  } else {
    sadeSatiStatusEn = `Saturn Transiting House ${saturnHouseFromMoon} from Moon (${[3, 6, 11].includes(saturnHouseFromMoon) ? 'Highly Auspicious Victory & Gain Window' : 'Measured Growth with Discipline'})`;
    sadeSatiStatusHi = `गोचर शनि चंद्र से भाव ${saturnHouseFromMoon} में (${[3, 6, 11].includes(saturnHouseFromMoon) ? 'शत्रु-हंता व प्रचंड धन लाभ का शुभ काल' : 'अनुशासन व धैर्य की मांग'})`;
  }

  // Dasha relationships are symbolic themes, not proof of what the native
  // actually experienced. Never narrate unverified past events as facts.
  const houseThemesHi: Record<number, string> = {
    1: 'स्वास्थ्य-जागरूकता, आत्मविश्वास और व्यक्तिगत दिशा',
    2: 'बचत, परिवार, वाणी और वित्तीय निर्णय',
    3: 'कौशल, संचार, छोटे प्रयास और भाई-बहन',
    4: 'घर, माता, संपत्ति और मानसिक सुकून',
    5: 'शिक्षा, रचनात्मकता, संतान और विवेकपूर्ण जोखिम',
    6: 'नौकरी, दिनचर्या, प्रतिस्पर्धा और देनदारियां',
    7: 'साझेदारी, विवाह और सार्वजनिक व्यवहार',
    8: 'बदलाव, साझा संसाधन और अनिश्चितता से निपटना',
    9: 'उच्च शिक्षा, मार्गदर्शन, विश्वास और लंबी यात्राएं',
    10: 'काम, जिम्मेदारी, पद और सार्वजनिक प्रतिष्ठा',
    11: 'आय, लक्ष्य, नेटवर्क और उपलब्धियां',
    12: 'खर्च, विश्राम, विदेश-संपर्क और एकांत',
  };
  const houseThemesEn: Record<number, string> = {
    1: 'wellbeing, confidence and personal direction',
    2: 'savings, family, speech and financial decisions',
    3: 'skills, communication, initiative and siblings',
    4: 'home, mother, property and emotional rest',
    5: 'education, creativity, children and considered risk',
    6: 'employment, routine, competition and liabilities',
    7: 'partnerships, marriage and public dealings',
    8: 'change, shared resources and uncertainty management',
    9: 'higher learning, mentors, beliefs and long journeys',
    10: 'work, responsibility, position and public standing',
    11: 'income, goals, networks and gains',
    12: 'expenses, rest, overseas links and solitude',
  };
  const pastDiagnosticHi = `महादशा स्वामी ${PLANET_HI[mdLord] || mdLord} जन्मकुंडली के भाव ${mdHouse} से और अंतर्दशा स्वामी ${PLANET_HI[adLord] || adLord} भाव ${adHouse} से जुड़े हैं। इन भावों के पारंपरिक विषय क्रमशः ${houseThemesHi[mdHouse] || 'जीवन की प्राथमिकताएं'} और ${houseThemesHi[adHouse] || 'व्यावहारिक परिस्थितियां'} हैं। उनका ${isShadashtaka ? '6/8' : isDvidwadasa ? '2/12' : isKendra ? 'केंद्र' : isTrikona ? 'त्रिकोण' : 'अन्य'} संबंध दबाव, समन्वय या बदलाव की थीम दे सकता है। यह पिछले 6–12 महीनों की घटनाओं का दावा नहीं है; अपने वास्तविक अनुभव से ही इसका मिलान करें।`;
  const pastDiagnosticEn = `The Mahadasha lord ${mdLord} is connected with natal House ${mdHouse}, and the Antardasha lord ${adLord} with House ${adHouse}. Their traditional topics are ${houseThemesEn[mdHouse] || 'personal priorities'} and ${houseThemesEn[adHouse] || 'practical circumstances'}. Their ${isShadashtaka ? '6/8' : isDvidwadasa ? '2/12' : isKendra ? 'Kendra' : isTrikona ? 'Trikona' : 'other'} relationship may describe themes of pressure, coordination or change. This is not a claim about events in the past 6–12 months; compare it with your actual experience.`;

  const pdPlanet = chart.planets.find((p) => p.id === pdLord);
  const pdHouse = pdPlanet?.rasiHouseNumber || pdPlanet?.houseNumber || 1;
  const pdEnd = pdPeriod?.endMs ? formatDateDmy(pdPeriod.endMs) : '';
  const next6MonthsHi = `आगामी अवधि में प्रत्यन्तर्दशा स्वामी ${PLANET_HI[pdLord] || pdLord} जन्मकुंडली के भाव ${pdHouse} से जुड़ा है। इस भाव के पारंपरिक विषय हैं: ${houseThemesHi[pdHouse] || 'व्यक्तिगत प्राथमिकताएं'}। उपलब्ध दशा-गणना के अनुसार यह उप-अवधि ${pdEnd || 'दर्ज समाप्ति तिथि तक'} सक्रिय है। यह व्यापक विषय-संकेत है; इससे नौकरी, विवाह, धन, मुकदमे या स्वास्थ्य की कोई निश्चित घटना/तारीख घोषित नहीं की जा सकती।`;
  const next6MonthsEn = `The current Pratyantardasha lord ${pdLord} is connected with natal House ${pdHouse}, whose traditional topics include ${houseThemesEn[pdHouse] || 'personal priorities'}. The available dasha calculation lists this sub-period through ${pdEnd || 'its recorded end date'}. This is a broad thematic indication, not a definite prediction or date for a job, marriage, money, litigation or health event.`;

  const sec1: ChapterSection = {
    titleEn: 'Current Dasha Themes: Review Against Your Actual Experience',
    titleHi: 'वर्तमान दशा के विषय: अपने वास्तविक अनुभव से मिलान करें',
    leadEn: `A chart-based reading of the running Vimshottari Mahadasha of ${mdLord} and Antardasha of ${adLord}; no unverified past events are assumed.`,
    leadHi: `सक्रिय महादशा '${PLANET_HI[mdLord] || mdLord}' और अंतर्दशा '${PLANET_HI[adLord] || adLord}' के भाव-आधारित विषय; इसमें पिछले अनुभवों को पहले से सच नहीं माना गया है।`,
    paragraphsEn: [
      pastDiagnosticEn,
      `Saturn transit is not included in this particular section; only the birth-chart dasha periods and natal house placements are used.`,
    ],
    paragraphsHi: [
      pastDiagnosticHi,
      `इस अनुभाग में गोचर शनि की गणना शामिल नहीं है; निष्कर्ष केवल जन्मकुंडली की दशा और भाव-स्थितियों पर आधारित है।`,
    ],
    astrologicalCauseEn: `Vimshottari dasha relationship: Mahadasha lord ${mdLord} (natal House ${mdHouse}) and Antardasha lord ${adLord} (natal House ${adHouse}); their relative house distance is ${mutualDistance}. Saturn transit is not assessed in this section.`,
    astrologicalCauseHi: `शास्त्रीय कारण: वर्तमान विंशोत्तरी दशा में महादशा स्वामी ${PLANET_HI[mdLord] || mdLord} जन्मकुंडली के भाव ${mdHouse} से और अंतर्दशा स्वामी ${PLANET_HI[adLord] || adLord} भाव ${adHouse} से जुड़े हैं; दोनों के बीच भाव-दूरी ${mutualDistance} है। इस अनुभाग में गोचर शनि का आकलन शामिल नहीं है।`,
    keyPointsEn: [
      `Running Mahadasha: ${mdLord} (until ${mdPeriod?.endMs ? formatDateDmy(mdPeriod.endMs) : 'Active'})`,
      `Running Antardasha: ${adLord} (until ${adPeriod?.endMs ? formatDateDmy(adPeriod.endMs) : 'Active'})`,
      `MD-AD house relationship: ${mutualDistance}th from the Mahadasha lord; interpret as a traditional theme, not a factual event report.`,
    ],
    keyPointsHi: [
      `सक्रिय महादशा: '${PLANET_HI[mdLord] || mdLord}' (समाप्ति: ${mdPeriod?.endMs ? formatDateDmy(mdPeriod.endMs) : 'सक्रिय'})`,
      `सक्रिय अंतर्दशा: '${PLANET_HI[adLord] || adLord}' (समाप्ति: ${adPeriod?.endMs ? formatDateDmy(adPeriod.endMs) : 'सक्रिय'})`,
      `महादशा-अंतर्दशा भाव-संबंध: महादशा स्वामी से ${mutualDistance}वां भाव; इसे पारंपरिक संकेत मानें, घटना का तथ्यात्मक विवरण नहीं।`,
    ],
  };

  const sec2: ChapterSection = {
    titleEn: 'Next Period: Dasha-Linked Life Themes',
    titleHi: 'आगामी अवधि: दशा से जुड़े जीवन-विषय',
    leadEn: `A limited thematic reading of the active Pratyantardasha of ${pdLord}; this is not a guaranteed event forecast.`,
    leadHi: `प्रत्यन्तर्दशेश '${PLANET_HI[pdLord] || pdLord}' और उसकी जन्मकुंडली में स्थिति पर आधारित सीमित विषय-संकेत; निश्चित घटना का दावा नहीं।`,
    paragraphsEn: [
      next6MonthsEn,
      `The Pratyantardasha lord ${pdLord} is placed in natal House ${pdHouse}, linking this period to ${houseThemesEn[pdHouse] || 'personal priorities'}. Use this as a planning prompt, not as a claim that a particular event will occur.`,
    ],
    paragraphsHi: [
      next6MonthsHi,
      `प्रत्यन्तर्दशा स्वामी '${PLANET_HI[pdLord] || pdLord}' जन्मकुंडली के भाव ${pdHouse} में स्थित हैं। इसलिए इस अवधि का पारंपरिक विषय ${houseThemesHi[pdHouse] || 'व्यक्तिगत प्राथमिकताएं'} है। इसे योजना बनाने का संकेत समझें, किसी निश्चित घटना का दावा नहीं।`,
    ],
    astrologicalCauseEn: `Vimshottari Pratyantardasha lord ${pdLord} is placed in natal House ${pdHouse}. Transit-based claims are not made in this section.`,
    astrologicalCauseHi: `शास्त्रीय आधार: विंशोत्तरी प्रत्यन्तर्दशा स्वामी '${PLANET_HI[pdLord] || pdLord}' जन्मकुंडली के भाव ${pdHouse} में स्थित हैं। इस अनुभाग में गोचर-आधारित दावा नहीं किया गया है।`,
    keyPointsEn: [
      `Pratyantardasha lord: ${pdLord}`,
      `Natal placement: House ${pdHouse}`,
      `Traditional theme: ${houseThemesEn[pdHouse] || 'personal priorities'}`,
      `Recorded sub-period end: ${pdEnd || 'not available'}`,
      'No event date or guaranteed outcome is inferred from this period alone.',
    ],
    keyPointsHi: [
      `प्रत्यन्तर्दशा स्वामी: ${PLANET_HI[pdLord] || pdLord}`,
      `जन्मकुंडली में स्थिति: भाव ${pdHouse}`,
      `पारंपरिक विषय: ${houseThemesHi[pdHouse] || 'व्यक्तिगत प्राथमिकताएं'}`,
      `दर्ज समाप्ति तिथि: ${pdEnd || 'उपलब्ध नहीं'}`,
      'केवल इस दशा से किसी घटना की तारीख या निश्चित परिणाम नहीं निकाला गया है।',
    ],
  };

  return [sec1, sec2];
}

// ============================================================================
// DYNAMIC CHAPTER 4: CAREER, JOB VS BUSINESS & DYNAMIC ZENITH AGE
// ============================================================================
export function computeDynamicCareerZenithSections(chart: ChartData): ChapterSection[] {
  const asc = chart.ascendant;
  const h10Sign = (asc.signIndex + 9) % 12;
  const h10Lord = SIGNS[h10Sign].lord;
  const h10LordPlanet = chart.planets.find((p) => p.id === h10Lord);

  const h6Sign = (asc.signIndex + 5) % 12;
  const h6Lord = SIGNS[h6Sign].lord;
  const h6LordPlanet = chart.planets.find((p) => p.id === h6Lord);

  const h7Sign = (asc.signIndex + 6) % 12;
  const h7Lord = SIGNS[h7Sign].lord;
  const h7LordPlanet = chart.planets.find((p) => p.id === h7Lord);

  const amk = chart.planets.find((p) => p.charaKaraka === 'AmK') ?? chart.planets[1];
  const in10th = chart.planets.filter((p) => p.rasiHouseNumber === 10);
  const in6th = chart.planets.filter((p) => p.rasiHouseNumber === 6);
  const in7th = chart.planets.filter((p) => p.rasiHouseNumber === 7);

  // Job vs Business Scoring
  let jobScore = 50;
  let bizScore = 50;

  if (in6th.length > 0 || ['Saturn', 'Mercury'].includes(h6Lord)) jobScore += 20;
  if (in7th.length > 0 || ['Mars', 'Sun', 'Rahu', 'Venus'].includes(h7Lord)) bizScore += 20;
  if (h10LordPlanet && [1, 10, 11].includes(h10LordPlanet.rasiHouseNumber)) bizScore += 15;
  if (h6LordPlanet && [10, 1].includes(h6LordPlanet.rasiHouseNumber)) jobScore += 15;

  const isIndependentEnterprise = bizScore >= jobScore;

  // Natural Planetary Maturity Ages (Naisargika Ayu - BPHS Ch. 45 & Saravali)
  const maturityAges: Record<string, number> = {
    Jupiter: 16,
    Sun: 22,
    Moon: 24,
    Venus: 25,
    Mars: 28,
    Mercury: 32,
    Saturn: 36,
    Rahu: 42,
    Ketu: 48,
  };

  const primaryCareerPlanet = in10th.length > 0 ? in10th[0].id : h10Lord;
  const primaryMaturityAge = maturityAges[primaryCareerPlanet] ?? 36;
  const amkMaturityAge = maturityAges[amk.id] ?? 32;

  // Derive 3 Individual Career Epochs
  const startEpoch1 = 19;
  const endEpoch1 = Math.min(26, Math.max(23, primaryMaturityAge - 6));
  const startEpoch2 = endEpoch1 + 1;
  const endEpoch2 = Math.min(36, Math.max(30, primaryMaturityAge + 2));
  const startEpoch3 = endEpoch2 + 1;
  const endEpoch3 = Math.min(52, Math.max(44, amkMaturityAge + 12));

  const secVerdict: ChapterSection = {
    titleEn: 'Job vs. Independent Enterprise: The Definitive Shastric Verdict',
    titleHi: 'नौकरी बनाम स्वतंत्र व्यवसाय: प्रामाणिक शास्त्रीय फैसला',
    leadEn: `Comparative evaluation of 6th house (Service/Competition) vs 7th house (Trade/Partnership) vs 10th house (Executive Command).`,
    leadHi: `षष्ठ भाव (नौकरी/सेवा), सप्तम भाव (व्यापार/साझेदारी) तथा दशम भाव (राज्य/अधिकार) का संयुक्त शास्त्रीय निर्णय।`,
    paragraphsEn: [
      `Your 10th house falls in ${SIGNS[h10Sign].name} governed by ${h10Lord}, with Amatyakaraka ${amk.id}. ${isIndependentEnterprise ? 'The celestial geometry decisively favors Independent Enterprise, Sovereign Agency, and Strategic Ownership. While early salaried employment provides technical discipline, remaining perpetually subordinated under rigid micro-management drains your spirit and triggers workplace resentment. You perform at peak potency when you control your calendar, client strategy, and commercial outcomes.' : 'The celestial geometry favors Structured Institutional Leadership, Corporate Hierarchy, and High-Stakes Advisory Roles. You thrive within established frameworks where clear protocols, organizational backing, and specialized merit govern advancement. Unstructured wild-cat entrepreneurship exposes you to unnecessary legal and financial vulnerabilities.'}`,
      `Key operational mode: ${isIndependentEnterprise ? 'Focus on building intellectual property, advisory practices, specialized agencies, or direct commercial ventures where your authority cannot be countermanded.' : 'Seek roles in elite corporations, public sector governance, research institutions, or regulated industries where your strategic discipline commands high institutional authority.'}`,
    ],
    paragraphsHi: [
      `आपकी कुंडली में दशम भाव '${SIGN_HI[h10Sign]}' राशि में है जिसके स्वामी '${PLANET_HI[h10Lord] || h10Lord}' हैं, और आपके अमात्यकारक '${PLANET_HI[amk.id] || amk.id}' हैं। ${isIndependentEnterprise ? 'ग्रहों की स्थिति स्पष्ट रूप से स्वतंत्र व्यवसाय, स्वायत्त सत्ता और व्यापारिक स्वामित्व का समर्थन करती है। यद्यपि जीवन के प्रारंभिक काल में अनुभव प्राप्ति हेतु नौकरी उपयोगी हो सकती है, किंतु जीवन भर किसी संकीर्ण अधिकारी के अधीन काम करना आपके आत्मसम्मान को कचोटता है। आप तब सर्वोच्च फल देते हैं जब कार्य की दिशा और निर्णय आपके अपने हाथ में हों।' : 'ग्रहों की स्थिति संरचित संस्थागत नेतृत्व, प्रतिष्ठित कॉर्पोरेट पदों अथवा सरकारी/नीति-निर्धारक सेवा का प्रबल समर्थन करती है। आप उन सुव्यवस्थित संस्थाओं में सर्वाधिक चमकते हैं जहां योग्यता, नियम और स्पष्ट पदानुक्रम का सम्मान होता है। बिना तैयारी के किया गया अनियोजित व्यापार आपको अनावश्यक जोखिम में डाल सकता है।'}`,
      `कार्यशैली का मूल मंत्र: ${isIndependentEnterprise ? 'ऐसी स्वतंत्र एजेंसी, परामर्श कार्य, अथवा व्यापार का निर्माण करें जहां आपका बौद्धिक अधिकार सर्वोपरि रहे और कोई आपको व्यर्थ बाधित न कर सके।' : 'बड़ी कॉर्पोरेट संस्थाओं, प्रशासनिक पदों, अथवा नीति-निर्धारक विभागों में नेतृत्व संभालें जहां आपका अनुशासन और समर्पण आपको सर्वोच्च पदों तक ले जाए।'}`,
    ],
    astrologicalCauseEn: `Brihat Jataka (Ch. 10 - Karma Jeeva Adhyaya) & Saravali (Ch. 33): 10th lord ${h10Lord} in House ${h10LordPlanet?.rasiHouseNumber || 1}, 6th lord ${h6Lord} (House ${h6LordPlanet?.rasiHouseNumber || 6}), and 7th lord ${h7Lord} (House ${h7LordPlanet?.rasiHouseNumber || 7}) determine the Job (${jobScore}%) vs Business (${bizScore}%) equilibrium.`,
    astrologicalCauseHi: `शास्त्रीय कारण: बृहज्जातक (अध्याय १० - कर्मजीवाध्यायः) एवं सारावली (अध्याय ३३): दशमेश '${PLANET_HI[h10Lord] || h10Lord}' (भाव ${h10LordPlanet?.rasiHouseNumber || 1}), षष्ठेश '${PLANET_HI[h6Lord] || h6Lord}' (भाव ${h6LordPlanet?.rasiHouseNumber || 6}) तथा सप्तमेश '${PLANET_HI[h7Lord] || h7Lord}' (भाव ${h7LordPlanet?.rasiHouseNumber || 7}) के बलाबल से नौकरी (${jobScore}%) बनाम व्यापार (${bizScore}%) का अनुपात तय होता है।`,
    keyPointsEn: [
      `Dominant Vocation: ${isIndependentEnterprise ? 'Independent Enterprise & Free Strategic Agency' : 'Structured Institutional & Corporate Leadership'}`,
      `Job vs Business Score: Job ${jobScore}% · Business ${bizScore}%`,
      `10th House Ruler: ${h10Lord} in House ${h10LordPlanet?.rasiHouseNumber || 1}`,
      `Amatyakaraka: ${amk.id} governing career direction`,
    ],
    keyPointsHi: [
      `प्रमुख आजीविका मार्ग: ${isIndependentEnterprise ? 'स्वतंत्र व्यवसाय, स्वायत्त सत्ता व व्यापारिक स्वामित्व' : 'प्रतिष्ठित संस्थागत सेवा व कॉर्पोरेट नेतृत्व'}`,
      `नौकरी बनाम व्यापार अनुपात: नौकरी ${jobScore}% · व्यापार ${bizScore}%`,
      `दशमेश: '${PLANET_HI[h10Lord] || h10Lord}' (भाव ${h10LordPlanet?.rasiHouseNumber || 1})`,
      `अमात्यकारक: '${PLANET_HI[amk.id] || amk.id}' (करियर के निर्देशक)`,
    ],
  };

  const secEpochs: ChapterSection = {
    titleEn: 'The Three Individual Career Epochs & The True Zenith Age',
    titleHi: 'करियर के तीन विशिष्ट जीवन पड़ाव एवं सर्वोच्च उत्कर्ष वर्ष (Zenith Age)',
    leadEn: `The chronological arc of professional emergence, stabilization, and peak authority derived from planetary maturity ages.`,
    leadHi: `दशमेश व अमात्यकारक के नैसर्गिक परिपक्वता काल पर आधारित करियर के तीन पड़ाव व चरम उत्थान की आयु।`,
    paragraphsEn: [
      `Ages ${startEpoch1} to ${endEpoch1} (The Identity Crucible & Trial Period): Governed by nascent planetary impulses. You experience mismatched compensation, experimentation, navigating petty workplace politics, and learning to assert your worth without apologizing.`,
      `Ages ${startEpoch2} to ${endEpoch2} (The Breakthrough & Stabilization Window): Activated by the planetary maturity of ${primaryCareerPlanet} (Maturity Age ${primaryMaturityAge}). A decisive project, promotion, or shift to independent practice establishes your reputation. Financial compensation scales substantially.`,
      `Ages ${startEpoch3} to ${endEpoch3} (The True Career Zenith Window): Triggered by the mature activation of Amatyakaraka ${amk.id} (Maturity Age ${amkMaturityAge}) and 10th house Raja Yogas. This is the master epoch where you wield uncompromised executive command, direct high-value assets, and build an enduring professional legacy that outlives temporary market fluctuations.`,
    ],
    paragraphsHi: [
      `${startEpoch1} से ${endEpoch1} वर्ष (प्रारंभिक संघर्ष व दिशा की खोज): इस काल में जातक को अपनी क्षमता से कम पारिश्रमिक, दिशाहीनता और कार्यक्षेत्र की राजनीति का सामना करना पड़ता है। आप ठोकरें खाकर अपने वास्तविक हुनर को पहचानते हैं।`,
      `${startEpoch2} से ${endEpoch2} वर्ष (स्थायित्व व पहला बड़ा उत्थान): मुख्य आजीविका ग्रह '${PLANET_HI[primaryCareerPlanet] || primaryCareerPlanet}' के नैसर्गिक परिपक्वता काल (आयु ${primaryMaturityAge} वर्ष) में सक्रिय होने से करियर में ठोस स्थायित्व आता है। पद, आय और सामाजिक सम्मान में उल्लेखनीय वृद्धि होती है।`,
      `${startEpoch3} से ${endEpoch3} वर्ष (सर्वोच्च उत्कर्ष काल / True Zenith Window): अमात्यकारक '${PLANET_HI[amk.id] || amk.id}' तथा दशम भाव के राजयोगों के पूर्ण फलीभूत होने का यह स्वर्णिम काल है। इस आयु वर्ग में आपका प्रभाव, निर्णय क्षमता और सामाजिक ख्याति चरम पर पहुंचेगी। आप नीति-निर्धारक या बड़े व्यापार के स्वामी के रूप में स्थापित होंगे।`,
    ],
    astrologicalCauseEn: `Brihat Parashara Hora Shastra (Ch. 45 - Naisargika Ayu & Maturity of Grahas): Primary career significator ${primaryCareerPlanet} matures at age ${primaryMaturityAge}, while Amatyakaraka ${amk.id} matures at age ${amkMaturityAge}, defining your Zenith between ages ${startEpoch3} and ${endEpoch3}.`,
    astrologicalCauseHi: `शास्त्रीय कारण: बृहत्पाराशर होराशास्त्र (अध्याय ४५ - ग्रहाणां नैसर्गिकावस्था): मुख्य आजीविका ग्रह '${PLANET_HI[primaryCareerPlanet] || primaryCareerPlanet}' का परिपक्वता वर्ष ${primaryMaturityAge} है, तथा अमात्यकारक '${PLANET_HI[amk.id] || amk.id}' का प्रभाव ${amkMaturityAge} वर्ष में जागृत होता है, जिससे आपका वास्तविक उत्कर्ष काल ${startEpoch3} से ${endEpoch3} वर्ष के मध्य फलित होता है।`,
    keyPointsEn: [
      `Crucible Epoch: Ages ${startEpoch1}–${endEpoch1} (Apprenticeship & Foundation)`,
      `Stabilization Epoch: Ages ${startEpoch2}–${endEpoch2} (First Major Breakthrough)`,
      `Supreme Zenith Window: Ages ${startEpoch3}–${endEpoch3} (Peak Executive Stature & Asset Command)`,
    ],
    keyPointsHi: [
      `प्रारंभिक पड़ाव: ${startEpoch1} से ${endEpoch1} वर्ष (परिश्रम व अनुभव संचय)`,
      `स्थायित्व पड़ाव: ${startEpoch2} से ${endEpoch2} वर्ष (पहला बड़ा उत्थान)`,
      `सर्वोच्च उत्कर्ष काल: ${startEpoch3} से ${endEpoch3} वर्ष (चरम अधिकार, ख्याति व संपत्ति योग)`,
    ],
  };

  return [secVerdict, secEpochs];
}

// ============================================================================
// DYNAMIC CHAPTER 5: WEALTH, INDU LAGNA & EXACT 12TH LORD LEAKAGE TRAP
// ============================================================================
export function computeDynamicWealthInduLagnaSections(chart: ChartData): ChapterSection[] {
  const asc = chart.ascendant;
  const moon = chart.planets.find((p) => p.id === 'Moon') ?? chart.planets[1];
  const h2Sign = (asc.signIndex + 1) % 12;
  const h2Lord = SIGNS[h2Sign].lord;
  const h11Sign = (asc.signIndex + 10) % 12;
  const h11Lord = SIGNS[h11Sign].lord;
  const h12Sign = (asc.signIndex + 11) % 12;
  const h12Lord = SIGNS[h12Sign].lord;
  const h12LordPlanet = chart.planets.find((p) => p.id === h12Lord);
  const h12House = h12LordPlanet?.rasiHouseNumber || 12;

  // Indu Lagna Calculation (Parashari Kalas: Sun 30, Moon 16, Mars 6, Mer 8, Jup 10, Ven 12, Sat 1)
  const kalas: Record<string, number> = {
    Sun: 30,
    Moon: 16,
    Mars: 6,
    Mercury: 8,
    Jupiter: 10,
    Venus: 12,
    Saturn: 1,
  };

  const h9FromLagnaSign = (asc.signIndex + 8) % 12;
  const h9LagnaLord = SIGNS[h9FromLagnaSign].lord;
  const h9FromMoonSign = (moon.signIndex + 8) % 12;
  const h9MoonLord = SIGNS[h9FromMoonSign].lord;

  const kala1 = kalas[h9LagnaLord] ?? 10;
  const kala2 = kalas[h9MoonLord] ?? 10;
  const totalKalas = kala1 + kala2;
  const remainder = totalKalas % 12 || 12;
  const induLagnaSignIdx = (moon.signIndex + remainder - 1) % 12;
  const induLagnaSignEn = SIGNS[induLagnaSignIdx].name;
  const induLagnaSignHi = SIGN_HI[induLagnaSignIdx];

  const inIndu = chart.planets.filter((p) => p.signIndex === induLagnaSignIdx && p.id !== 'Asc');
  const hasBeneficInIndu = inIndu.some((p) => ['Jupiter', 'Venus', 'Mercury', 'Moon'].includes(p.id));
  const hasMaleficInIndu = inIndu.some((p) => ['Mars', 'Saturn', 'Sun', 'Rahu'].includes(p.id));

  let induVerdictEn = '';
  let induVerdictHi = '';
  if (hasBeneficInIndu) {
    induVerdictEn = `Supreme Koti-Dhana Yoga! Benefic planets (${inIndu.map((p) => p.id).join(', ')}) occupy your Indu Lagna (${induLagnaSignEn}). Classical Parashari treatises declare that the native will amass vast, sovereign wealth through principled wisdom, commerce, and compounding assets. Destitution is astro-mathematically impossible.`;
    induVerdictHi = `प्रचंड कोटि-धनेश योग! आपके इन्दु लग्न ('${induLagnaSignHi}') में शुभ ग्रह (${inIndu.map((p) => PLANET_HI[p.id] || p.id).join(', ')}) विराजमान हैं। महर्षि पाराशर के अनुसार ऐसा जातक अपनी बुद्धि, व्यापार और नीति के बल पर विपुल धन-संपत्ति अर्जित करता है। जीवन में कभी दरिद्रता नहीं आ सकती।`;
  } else if (hasMaleficInIndu) {
    induVerdictEn = `Courageous Wealth & High-Risk Acquisition Yoga! Malefic planets (${inIndu.map((p) => p.id).join(', ')}) occupy your Indu Lagna (${induLagnaSignEn}). You acquire substantial wealth through bold, disruptive maneuvers, competitive warfare, engineering, or real estate, though wealth arrives through friction and demands strict defense.`;
    induVerdictHi = `साहसिक धन योग! इन्दु लग्न ('${induLagnaSignHi}') में क्रूर ग्रह (${inIndu.map((p) => PLANET_HI[p.id] || p.id).join(', ')}) स्थित हैं। जातक कठिन संघर्ष, तकनीकी कौशल, भूमि अथवा जोखिम भरे व्यापार से प्रचुर धन कमाता है, किंतु धन संचय में समय-समय पर बड़े झटके भी लगते हैं।`;
  } else {
    induVerdictEn = `Steadily Compounding Indu Lagna in ${induLagnaSignEn} (ruled by ${SIGNS[induLagnaSignIdx].lord}). Wealth accumulates through disciplined, unglamorous persistence. Windfalls are rare; your financial fortress is constructed brick by unshakeable brick.`;
    induVerdictHi = `इन्दु लग्न '${induLagnaSignHi}' में स्थित है (स्वामी: ${PLANET_HI[SIGNS[induLagnaSignIdx].lord] || SIGNS[induLagnaSignIdx].lord})। जातक का धन किसी आकस्मिक सट्टे से नहीं, बल्कि निरंतर परिश्रम, बचत और सुरक्षित निवेश से धीरे-धीरे विशाल वटवृक्ष बनता है।`;
  }

  // Exact 12th Lord Placement — The Specific Astrological Leakage Channel
  const LEAK_CHANNELS: Record<number, { en: string; hi: string }> = {
    1: {
      en: 'Self-image, impulsive personal purchases, cosmetic/wardrobe expenses, and physical healthcare experiments.',
      hi: 'स्वयं के शौक, कपड़ों व दिखावे पर अनावश्यक खर्च, तथा स्वास्थ्य संबंधी परीक्षणों में पूंजी का रिसाव।',
    },
    2: {
      en: 'Emotional loans to family members that turn bad, excessive hospitality, and verbal financial commitments.',
      hi: 'कुटुंब के लोगों को भावुक होकर दिया गया ऐसा धन जो कभी वापस नहीं आता, तथा खान-पान व दिखावे में व्यय।',
    },
    3: {
      en: 'Subsidizing siblings/cousins, legal contracts, vehicle travel expenses, and failed marketing/communication ventures.',
      hi: 'छोटे भाई-बहनों या मित्रों की आर्थिक सहायता, व्यर्थ की यात्राएं और कानूनी दस्तावेजों में धन की बर्बादी।',
    },
    4: {
      en: 'Continuous real estate renovations, structural home repairs, automotive breakdowns, and maternal medical bills.',
      hi: 'मकान की निरंतर मरम्मत/सजावट, वाहनों की खराबी, और माता के स्वास्थ्य पर आकस्मिक धन का व्यय।',
    },
    5: {
      en: 'Speculative stock market / crypto gambles entered on FOMO, over-spending on children, and creative misfires.',
      hi: 'शेयर बाजार या सट्टे में लालचवश पूंजी फंसाना, संतान की अनियंत्रित मांगों और जोखिम भरे प्रोजेक्ट्स में रिसाव।',
    },
    6: {
      en: 'Viparita Raja Yoga dynamic: Unplanned legal fees, settling employee/partner disputes, and chronic medical maintenance.',
      hi: 'विपरीत राजयोग प्रभाव: कोर्ट-कचहरी के खर्चे, कर्मचारियों के विवाद निपटाने और जीर्ण रोगों की दवाओं में व्यय।',
    },
    7: {
      en: 'Spouse’s high-maintenance lifestyle demands, failed joint ventures, contract breakages, and litigation with partners.',
      hi: 'जीवनसाथी के महंगे शौक, व्यापारिक साझेदारों द्वारा की गई धोखाधड़ी और अनुबंध टूटने से होने वाली हानि।',
    },
    8: {
      en: 'Sarala Yoga dynamic: Sudden unbudgeted emergencies, tax penalties, unreturned secret cash, and insurance disputes.',
      hi: 'सरल योग प्रभाव: अचानक आए सरकारी दंड/टैक्स, किसी को दिया गया गुप्त नकद जो डूब गया, और आकस्मिक संकट।',
    },
    9: {
      en: 'Expensive religious ceremonies, foreign travel costs, funding spiritual mentors, and father’s legacy liabilities.',
      hi: 'महंगे धार्मिक अनुष्ठान, विदेश यात्राओं का भारी खर्च, गुरुओं पर अंधाधुंध व्यय और पिता के पुराने दायित्व।',
    },
    10: {
      en: 'Maintaining high corporate / social appearances, business overheads that exceed revenues, and political donations.',
      hi: 'कार्यक्षेत्र में बड़ा दिखने का दिखावा, व्यापार के भारी मेंटेनेंस खर्चे और प्रतिष्ठा बचाने के लिए किया गया व्यय।',
    },
    11: {
      en: 'Treacherous social circles, lending to prestigious "friends" who default, and ill-fated club/network investments.',
      hi: 'धूर्त मित्रों द्वारा निवेश के नाम पर ठगी, प्रतिष्ठित संपर्कों को दिया गया पैसा डूबना और सामाजिक दिखावा।',
    },
    12: {
      en: 'Vimala Yoga dynamic: Foreign relocation expenses, hospital stays, and voluntary charitable donations to spiritual ashrams.',
      hi: 'विमल योग प्रभाव: विदेश प्रवास पर खर्च, आश्रमों व धर्मार्थ संस्थाओं में दान, तथा एकांत साधना में धन का सदुपयोग।',
    },
  };

  const leakProfile = LEAK_CHANNELS[h12House] ?? LEAK_CHANNELS[12];

  // Property & Vehicle Timing
  const h4Sign = (asc.signIndex + 3) % 12;
  const h4Lord = SIGNS[h4Sign].lord;
  const mars = chart.planets.find((p) => p.id === 'Mars')!;

  const secWealth: ChapterSection = {
    titleEn: 'The Inflow Potential: Indu Lagna & The Dhana Yoga Architecture',
    titleHi: 'धन आगमन की सामर्थ्य: इन्दु लग्न एवं धन योग की दिव्य संरचना',
    leadEn: `Parashari Kalas assessment for wealth magnitude and financial floor.`,
    leadHi: `महर्षि पाराशर की कला-पद्धति द्वारा इन्दु लग्न एवं स्थायी धन योग का गणितीय परीक्षण।`,
    paragraphsEn: [
      `Your 2nd house of accumulated reserves is ruled by ${h2Lord}, while your 11th house of recurrent income is ruled by ${h11Lord}. This planetary backbone ensures that despite temporary cash crunches, your financial resilience is supreme. Money arrives from unexpected quarters whenever you face existential crises.`,
      `Indu Lagna Revelation: Calculated by summing the 9th lord Kalas from Lagna (${kala1}) and Moon (${kala2}), totalling ${totalKalas} Kalas (Remainder: ${remainder}), your Indu Lagna falls in ${induLagnaSignEn}. ${induVerdictEn}`,
    ],
    paragraphsHi: [
      `आपकी कुंडली में द्वितीय भाव (संचित कोष) के स्वामी '${PLANET_HI[h2Lord] || h2Lord}' और एकादश भाव (नियमित लाभ) के स्वामी '${PLANET_HI[h11Lord] || h11Lord}' हैं। यह योग सुनिश्चित करता है कि संकट के समय भी कहीं न कहीं से संसाधन प्रकट हो जाएंगे और आपकी सामाजिक साख सुरक्षित रहेगी।`,
      `इन्दु लग्न का रहस्य: लग्न से नवमेश की कलाएं (${kala1}) तथा चंद्र से नवमेश की कलाएं (${kala2}) जोड़कर (कुल ${totalKalas} कलाएं, शेष: ${remainder}) आपका इन्दु लग्न '${induLagnaSignHi}' राशि में बनता है। ${induVerdictHi}`,
    ],
    astrologicalCauseEn: `Brihat Parashara Hora Shastra (Ch. 41 - Dhana Yoga & Indu Lagna): Indu Lagna in ${induLagnaSignEn} with planets: ${inIndu.map((p) => p.id).join(', ') || 'None (Ruled by ' + SIGNS[induLagnaSignIdx].lord + ')'}. Dhana lords ${h2Lord} and ${h11Lord} establish financial trajectory.`,
    astrologicalCauseHi: `शास्त्रीय कारण: बृहत्पाराशर होराशास्त्र (अध्याय ४१ - धनयोगाध्यायः): इन्दु लग्न '${induLagnaSignHi}' राशि में स्थित है, जिसमें स्थित ग्रह: ${inIndu.map((p) => PLANET_HI[p.id] || p.id).join(', ') || 'कोई नहीं (स्वामी: ' + (PLANET_HI[SIGNS[induLagnaSignIdx].lord] || SIGNS[induLagnaSignIdx].lord) + ')'}। धनेश '${PLANET_HI[h2Lord] || h2Lord}' व लाभेश '${PLANET_HI[h11Lord] || h11Lord}' धन की सीमा तय करते हैं।`,
    keyPointsEn: [
      `Indu Lagna Sign: ${induLagnaSignEn} (${totalKalas} Kalas)`,
      `Indu Lagna Status: ${hasBeneficInIndu ? 'Supreme Koti-Dhana Yoga (Benefics Present)' : hasMaleficInIndu ? 'High-Risk Bold Wealth (Malefics Present)' : 'Steady Compounding Foundation'}`,
      `Wealth Guardians: 2nd Lord ${h2Lord} · 11th Lord ${h11Lord}`,
    ],
    keyPointsHi: [
      `इन्दु लग्न राशि: '${induLagnaSignHi}' (${totalKalas} कलाएं)`,
      `इन्दु लग्न फल: ${hasBeneficInIndu ? 'कोटि-धनेश योग (शुभ ग्रह स्थित)' : hasMaleficInIndu ? 'साहसिक धन योग (क्रूर ग्रह स्थित)' : 'सुरक्षित व क्रमिक संचय'}`,
      `धन के मुख्य अधिपति: धनेश '${PLANET_HI[h2Lord] || h2Lord}' · लाभेश '${PLANET_HI[h11Lord] || h11Lord}'`,
    ],
  };

  const secLeaks: ChapterSection = {
    titleEn: 'The Exact Financial Leakage Trap: 12th Lord in House ' + h12House,
    titleHi: 'वित्तीय रिसाव का गुप्त छिद्र: द्वादशेश का भाव ' + h12House + ' में फल',
    leadEn: `The exact astrological channel through which your hard-earned wealth drains away unseen.`,
    leadHi: `व्ययेश '${PLANET_HI[h12Lord] || h12Lord}' के भाव ${h12House} में बैठने से धन कहां और कैसे गायब होता है।`,
    paragraphsEn: [
      `Your 12th house of expenditure and loss is governed by ${h12Lord}, placed in House ${h12House}. Classical treatises (Bhavartha Ratnakara & BPHS) reveal your primary financial leakage channel: ${leakProfile.en}`,
      `Whenever a substantial liquidity cushion accumulates in your bank accounts, this 12th-lord trigger fires, generating urgent, inescapable obligations that siphon off your surplus. To plug this leak: Immediately convert liquid cash into illiquid, hard-to-sell assets (real estate or sovereign gold) registered in joint custody. Do not keep excess liquidity in easily spendable accounts.`,
    ],
    paragraphsHi: [
      `आपकी कुंडली में व्यय भाव (द्वादश) के स्वामी '${PLANET_HI[h12Lord] || h12Lord}' भाव संख्या ${h12House} में स्थित हैं। भावार्थ रत्नाकर एवं बृहत्पाराशर होराशास्त्र के अनुसार आपके धन के गुप्त रिसाव का मुख्य मार्ग यह है: ${leakProfile.hi}`,
      `जैसे ही आपके बैंक खाते में एक निश्चित धनराशि जमा होती है, द्वादशेश का प्रभाव सक्रिय हो जाता है और कोई न कोई आकस्मिक खर्च आकर उस पूंजी को बहा ले जाता है। इस रिसाव को रोकने का अचूक उपाय: नकद धन को बैंक में रखने के स्थान पर तुरंत अचल संपत्ति (भूमि/मकान) अथवा स्वर्ण में बदल दें। अतिरिक्त तरलता आपके हाथ में टिकना कठिन है।`,
    ],
    astrologicalCauseEn: `Bhavartha Ratnakara (Dwadasa Bhava Phala) & BPHS (Ch. 24): 12th lord ${h12Lord} in House ${h12House} determines the exact point of wealth dissipation.`,
    astrologicalCauseHi: `शास्त्रीय कारण: भावार्थ रत्नाकर (द्वादश भाव फल) एवं बृहत्पाराशर होराशास्त्र: व्ययेश '${PLANET_HI[h12Lord] || h12Lord}' की भाव ${h12House} में स्थिति जातक के धन व्यय की दिशा सुनिश्चित करती है।`,
    keyPointsEn: [
      `12th House Ruler: ${h12Lord} placed in House ${h12House}`,
      `Primary Leak Channel: ${leakProfile.en}`,
      `Wealth Defense Rule: Convert liquid reserves into physical land or gold. Avoid emotional loans.`,
    ],
    keyPointsHi: [
      `व्ययेश: '${PLANET_HI[h12Lord] || h12Lord}' (भाव संख्या ${h12House} में स्थित)`,
      `मुख्य रिसाव मार्ग: ${leakProfile.hi}`,
      `धन रक्षा नियम: नकद पूंजी को अचल संपत्ति या स्वर्ण में रूपांतरित करें; भावुक होकर कर्ज न दें।`,
    ],
  };

  return [secWealth, secLeaks];
}

// ============================================================================
// DYNAMIC CHAPTER 6: SPOUSE PROFILE, CELIBACY & TRITIYA PRAKRITI (SEXUALITY)
// ============================================================================
export function computeDynamicMarriageAndIntimacySections(chart: ChartData, isMarriageDenial: boolean): ChapterSection[] {
  const asc = chart.ascendant;
  const h7Sign = (asc.signIndex + 6) % 12;
  const h7Lord = SIGNS[h7Sign].lord;
  const h7LordPlanet = chart.planets.find((p) => p.id === h7Lord);
  const dk = chart.planets.find((p) => p.charaKaraka === 'DK') ?? chart.planets[6];
  const in7th = chart.planets.filter((p) => p.rasiHouseNumber === 7);
  const venus = chart.planets.find((p) => p.id === 'Venus')!;
  const saturn = chart.planets.find((p) => p.id === 'Saturn')!;
  const mars = chart.planets.find((p) => p.id === 'Mars')!;
  const mercury = chart.planets.find((p) => p.id === 'Mercury')!;
  const ketu = chart.planets.find((p) => p.id === 'Ketu')!;

  // Classical Tritiya Prakriti / Non-Binary / Fluid Sexuality Indicators
  // Brihat Jataka Ch. 2, Ch. 24 & BPHS Ch. 80
  const mercSatDist = ((saturn.rasiHouseNumber - mercury.rasiHouseNumber + 12) % 12) + 1;
  const mercurySaturnConnection = [mercury.rasiHouseNumber, saturn.rasiHouseNumber].includes(7) ||
    [mercury.rasiHouseNumber, saturn.rasiHouseNumber].includes(1) ||
    (mercury.rasiHouseNumber === saturn.rasiHouseNumber) ||
    mercSatDist === 7 || mercSatDist === 4 || mercSatDist === 11;
  const venusKetuConnection = [venus.rasiHouseNumber, ketu.rasiHouseNumber].includes(7) ||
    (venus.rasiHouseNumber === ketu.rasiHouseNumber) ||
    [venus.rasiHouseNumber, ketu.rasiHouseNumber].includes(12);

  // Dynamic Spouse Description from 7th Sign & Lord
  let spouseNatureEn = '';
  let spouseNatureHi = '';
  let frictionEn = '';
  let frictionHi = '';

  if (['Aries', 'Scorpio'].includes(SIGNS[h7Sign].name) || in7th.some((p) => p.id === 'Mars')) {
    spouseNatureEn = 'Athletic, high-spirited, courageous, and fiercely independent spouse with a fiery temper and deep protective instincts.';
    spouseNatureHi = 'ऊर्जावान, साहसी, स्वाभिमानी और स्वतंत्र विचारों वाला जीवनसाथी; शीघ्र क्रोध में आने वाला किंतु भीतर से अत्यंत सुरक्षात्मक।';
    frictionEn = 'Clashes erupt from battles of dominance and stubborn pride; neither party easily concedes error during arguments.';
    frictionHi = 'अहंकार के टकराव और एक-दूसरे पर आधिपत्य जमाने की होड़ से विवाद भड़कते हैं; दोनों में से कोई भी झुकना पसंद नहीं करता।';
  } else if (['Taurus', 'Libra'].includes(SIGNS[h7Sign].name) || in7th.some((p) => p.id === 'Venus')) {
    spouseNatureEn = 'Cultured, artistically inclined, charming, and fond of luxury, fine living, and aesthetic refinement.';
    spouseNatureHi = 'सौंदर्यप्रिय, कलात्मक रुचि रखने वाला, सुरुचिपूर्ण और भौतिक सुख-सुविधाओं व सुरुचिपूर्ण जीवन का प्रेमी जीवनसाथी।';
    frictionEn = 'Disagreements stem from differing standards of financial expenditure, vanity, and expectations of constant romantic validation.';
    frictionHi = 'खर्चों की प्राथमिकताओं, दिखावे, और एक-दूसरे से निरंतर रोमांटिक ध्यान पाने की अपेक्षाओं से तनाव उत्पन्न होता है।';
  } else if (['Gemini', 'Virgo'].includes(SIGNS[h7Sign].name) || in7th.some((p) => p.id === 'Mercury')) {
    spouseNatureEn = 'Youthful, highly analytical, talkative, commercially savvy, and intellectually demanding life partner.';
    spouseNatureHi = 'तार्किक, वाक्पटु, व्यापारिक बुद्धि वाला, चतुर और बौद्धिक चर्चाओं में निपुण जीवनसाथी।';
    frictionEn = 'Friction arises from hyper-critical remarks, sarcastic wit, and analyzing emotional feelings with cold intellectual logic.';
    frictionHi = 'छोटी-छोटी बातों में मीन-मेख निकालने, व्यंग्यात्मक टिप्पणियों और भावनाओं को केवल तर्क की कसौटी पर तौलने से मनमुटाव होता है।';
  } else if (['Cancer'].includes(SIGNS[h7Sign].name) || in7th.some((p) => p.id === 'Moon')) {
    spouseNatureEn = 'Deeply emotional, nurturing, intuitive, home-centric spouse who absorbs household vibrations intensely.';
    spouseNatureHi = 'अत्यंत भावुक, ममतामयी/पोषणकर्ता, संवेदनशील और पारिवारिक मान-मर्यादा के प्रति समर्पित जीवनसाथी।';
    frictionEn = 'Friction stems from fluctuating emotional moods, taking casual remarks to heart, and silent brooding retreats.';
    frictionHi = 'बार-बार मनोदशा बदलने (Mood Swings), छोटी बात को दिल से लगा लेने और रूठकर मौन साध लेने से दांपत्य में दूरियां आती हैं।';
  } else if (['Leo'].includes(SIGNS[h7Sign].name) || in7th.some((p) => p.id === 'Sun')) {
    spouseNatureEn = 'Stately, proud, commanding, and ethically principled partner who demands unwavering respect and loyalty.';
    spouseNatureHi = 'राजसी ठाठ-बाट, स्वाभिमानी, नेतृत्वप्रिय और समाज में उच्च प्रतिष्ठा चाहने वाला जीवनसाथी।';
    frictionEn = 'Ego clashes are sharp; public contradiction or feeling disrespected in front of others triggers explosive boundaries.';
    frictionHi = 'स्वाभिमान को ठेस लगना और दूसरों के सामने बात काटे जाने पर गंभीर विवाद होना मुख्य समस्या बनती है।';
  } else if (['Sagittarius', 'Pisces'].includes(SIGNS[h7Sign].name) || in7th.some((p) => p.id === 'Jupiter')) {
    spouseNatureEn = 'Wise, philosophical, morally upright, and spiritual partner who acts as an intellectual mentor or moral guide.';
    spouseNatureHi = 'विद्वान, धार्मिक, नैतिक सिद्धांतों पर चलने वाला और एक मार्गदर्शक की भूमिका निभाने वाला जीवनसाथी।';
    frictionEn = 'Friction arises when high moral preachiness or uncompromising righteousness stifles spontaneous playfulness.';
    frictionHi = 'अत्यधिक उपदेशात्मक शैली, धर्म-कर्म की कठोरता और जीवन के सहज आनंद में कमी आने से नीरसता उत्पन्न होती है।';
  } else {
    // Capricorn, Aquarius or Saturn in 7th
    spouseNatureEn = 'Mature, sober, practical, and hardworking partner who carries heavy life experience, often entering life after delay.';
    spouseNatureHi = 'परिपक्व, गंभीर, व्यावहारिक और कर्तव्यनिष्ठ जीवनसाथी; अक्सर जीवन में विलंब या कठिन परिस्थितियों के बाद प्रवेश।';
    frictionEn = 'Friction stems from emotional reservedness, communication delays, and treating the marriage like a business contract.';
    frictionHi = 'भावनात्मक अभिव्यक्ति में संकोच, शीत-युद्ध और दांपत्य को एक नीरस कर्तव्य जैसा समझने से दूरियां बढ़ती हैं।';
  }

  const secSpouse: ChapterSection = {
    titleEn: isMarriageDenial
      ? 'Lifelong Bachelorhood / Celibacy Yogas & Root Causes of Delay'
      : 'Spouse Persona, Temperament & Roots of Marital Friction',
    titleHi: isMarriageDenial
      ? 'विवाह हीनता / नैष्ठिक ब्रह्मचर्य योग एवं विलंब के मूल कारण'
      : 'जीवनसाथी का वास्तविक स्वरूप, स्वभाव एवं वैवाहिक कलह की जड़ें',
    leadEn: isMarriageDenial
      ? 'Authentic classical diagnostic of voluntary singlehood, ascetic autonomy, and late renunciation.'
      : 'The real psychological and social profile of your life partner and where clashes arise.',
    leadHi: isMarriageDenial
      ? 'महर्षि पाराशर व वराहमिहिर सम्मत विवाह-हीनता, नैष्ठिक ब्रह्मचर्य अथवा अत्यधिक विलंब का विश्लेषण।'
      : 'आपके जीवनसाथी का यथार्थ व्यक्तित्व, पारिवारिक पृष्ठभूमि और आपसी मतभेद के मुख्य बिंदु।',
    paragraphsEn: isMarriageDenial
      ? [
          `Classical Jyotish Formulations for Singlehood / Celibacy (नैष्ठिक ब्रह्मचर्य / विवाह हीन योग): Your 7th Lord (${h7Lord}) combined with ascetic influences on Venus and 7th house in D1 and D9 confirms strong signatures of voluntary bachelorhood, lifelong singlehood, or late renunciation of domestic expectations. You are wired for intellectual, creative, or spiritual autonomy rather than submissive domestic compromise.`,
          `If forced into matrimony by societal expectations: Serious marital friction, emotional detachment, or formal dissolution will occur unless your partner completely respects your non-negotiable personal space. If you choose marriage in mature years, expect a partner who is similarly detached, unconventional, and intellectually self-sufficient.`,
        ]
      : [
          `Your 7th house falls in ${SIGNS[h7Sign].name} (governed by ${h7Lord}), with your Darakaraka being ${dk.id}. ${spouseNatureEn}`,
          `Roots of Marital Friction: ${frictionEn} Marital harmony is maintained not by suppressing differences, but by giving each other sovereign intellectual space and avoiding authoritarian ultimatums.`,
        ],
    paragraphsHi: isMarriageDenial
      ? [
          `शास्त्रीय विवाह हीनता एवं नैष्ठिक ब्रह्मचर्य योग: महर्षि पाराशर व जैमिनि के अनुसार सप्तमेश '${PLANET_HI[h7Lord] || h7Lord}' की स्थिति तथा शुक्र व उपपद लग्न पर विरक्ति कारक ग्रहों के प्रभाव से जातक के आजीवन अविवाहित/एकल (Bachelor / Single) रहने, नैष्ठिक ब्रह्मचर्य, अथवा पारंपरिक दांपत्य से पूर्ण विरक्ति का योग बनता है। जातक की आत्मा किसी के अधीन होकर समझौता करने के स्थान पर अपनी बौद्धिक, आध्यात्मिक व स्वतंत्र सत्ता में रमना चाहती है।`,
          `पारिवारिक दबाव में विवाह की स्थिति: यदि सामाजिक दबाव में विवाह कर भी लिया जाए, तो दांपत्य में अत्यधिक शीत-युद्ध, भावनात्मक विच्छेद, अथवा अंततः अलगाव का जोखिम रहता है, जब तक कि जीवनसाथी पूर्णतः परिपक्व और आपकी निजता का सम्मान करने वाला न हो।`,
        ]
      : [
          `आपकी कुंडली में सप्तम भाव '${SIGN_HI[h7Sign]}' राशि में है जिसके स्वामी '${PLANET_HI[h7Lord] || h7Lord}' हैं, और दाराकारक '${PLANET_HI[dk.id] || dk.id}' हैं। ${spouseNatureHi}`,
          `वैवाहिक कलह की जड़ें: ${frictionHi} दांपत्य में सामंजस्य बनाए रखने के लिए एक-दूसरे पर अधिकार जमाने के स्थान पर व्यक्तिगत स्वाधीनता का सम्मान करना अनिवार्य है।`,
        ],
    astrologicalCauseEn: isMarriageDenial
      ? `Brihat Jataka (Ch. 15 - Pravrajya Yoga) & BPHS (Ch. 18): Afflicted 7th lord ${h7Lord} and ascetic Saturn/Ketu influence over Venus and 7th house create detachment from marital bonds.`
      : `Brihat Jataka (Ch. 24 - Stri Jataka) & Phaladeepika (Ch. 10): 7th house in ${SIGNS[h7Sign].name} ruled by ${h7Lord} (House ${h7LordPlanet?.rasiHouseNumber || 1}) and Darakaraka ${dk.id} define spouse nature.`,
    astrologicalCauseHi: isMarriageDenial
      ? `शास्त्रीय कारण: बृहज्जातक (अध्याय १५ - प्रव्रज्यायोगाध्यायः) एवं बृहत्पाराशर होराशास्त्र: सप्तमेश '${PLANET_HI[h7Lord] || h7Lord}' तथा शुक्र पर शनि-केतु का वैराग्यकारी प्रभाव दांपत्य से विरक्ति उत्पन्न करता है।`
      : `शास्त्रीय कारण: बृहज्जातक (अध्याय २४ - स्त्रीजातकाध्यायः) एवं फलदीपिका (अध्याय १०): सप्तम भाव '${SIGN_HI[h7Sign]}' (स्वामी: ${PLANET_HI[h7Lord] || h7Lord}) तथा दाराकारक '${PLANET_HI[dk.id] || dk.id}' जीवनसाथी का स्वरूप निर्धारित करते हैं।`,
    keyPointsEn: [
      isMarriageDenial ? `Marital Status: Lifelong Singlehood / Ascetic Autonomy (Pravrajya Signature)` : `Spouse Sign: ${SIGNS[h7Sign].name} (Lord: ${h7Lord})`,
      `Spouse Archetype: ${spouseNatureEn.slice(0, 80)}...`,
      `Core Friction Trigger: ${frictionEn.slice(0, 80)}...`,
    ],
    keyPointsHi: [
      isMarriageDenial ? `वैवाहिक स्थिति: नैष्ठिक ब्रह्मचर्य / एकल जीवन योग (प्रव्रज्या प्रभाव)` : `सप्तम भाव राशि: '${SIGN_HI[h7Sign]}' (स्वामी: ${PLANET_HI[h7Lord] || h7Lord})`,
      `जीवनसाथी की प्रकृति: ${spouseNatureHi.slice(0, 60)}...`,
      `कलह का मुख्य कारण: ${frictionHi.slice(0, 60)}...`,
    ],
  };

  const secSexuality: ChapterSection = {
    titleEn: 'Bed Pleasures, Intimacy Dynamics & The Sexuality Spectrum',
    titleHi: 'शय्या सुख, काम-ऊर्जा एवं काम-प्रकृति (Sexuality Spectrum) का यथार्थ',
    leadEn: `Classical shastric analysis of 12th house (Bed Pleasures), Venus, and the natural human spectrum (Tritiya Prakriti).`,
    leadHi: `द्वादश भाव (शय्या सुख), काम-कारक शुक्र एवं महर्षि पाराशर व वराहमिहिर सम्मत काम-प्रकृति (तृतीय प्रकृति) का विश्लेषण।`,
    paragraphsEn: [
      `Classical Jyotish texts (Brihat Jataka Ch. 2, BPHS Ch. 80, Jaimini Sutras) explicitly analyze physical passion, bed comforts (12th house), and the natural spectrum of human sexuality, including Tritiya Prakriti (non-binary, fluid, or unconventional attractions). Your 12th house and Venus (${venus.signName} in House ${venus.rasiHouseNumber}) reveal an intense sensual nature that demands emotional resonance and psychological safety. Mechanical, dutiful intimacy leaves you completely detached.`,
      mercurySaturnConnection || venusKetuConnection
        ? `Your chart reveals strong classical signatures of non-traditional, fluid, or unconventional intimate orientations (Tritiya Prakriti influence through Mercury/Saturn or Venus-Ketu alignment). You possess an internal psychological duality that transcends rigid orthodox molds. If you have suppressed this part of your psyche out of societal pressure, it creates silent neuroses and deep dissatisfaction in conventional arrangements.`
        : `Your chart reflects a predominantly classical romantic temperament with deep desires for exclusivity and aesthetic refinement. However, when emotional communication breaks down, you tend to withhold intimacy as a subconscious weapon, which deeply damages the relationship.`,
    ],
    paragraphsHi: [
      `प्राचीन ज्योतिष ग्रंथों (बृहज्जातक, बृहत्पाराशर होराशास्त्र, जैमिनि सूत्र) में 12वें भाव (शय्या सुख), काम-कारक शुक्र एवं काम-प्रकृति का अत्यंत वैज्ञानिक व निष्पक्ष विश्लेषण मिलता है। आपकी कुंडली में शुक्र देव '${SIGN_HI[venus.signIndex]}' राशि में हैं और 12वां भाव अत्यंत संवेदनशील है। आपका शारीरिक व भावनात्मक सुख केवल यांत्रिक संबंधों से तृप्त नहीं हो सकता; आपको अंतरंगता के लिए बौद्धिक तालमेल, मानसिक सुरक्षा और गहरे आत्मीय सम्मान की आवश्यकता होती है।`,
      mercurySaturnConnection || venusKetuConnection
        ? `आपकी कुंडली में बुध, शनि अथवा शुक्र-केतु के विशिष्ट योगों के प्रभाव से पारंपरिक रूढ़ियों से परे 'तृतीय प्रकृति' (Tritiya Prakriti), अपरंपरागत आकर्षण अथवा काम-प्रकृति में तरलता (Fluid/Queer/Unconventional Sexuality) के शास्त्रीय संकेत उपस्थित हैं। आप बाह्य सामाजिक दबाव में पारंपरिक रूप धारण कर सकते हैं, किंतु अंतर्मन में आपकी काम-चेतना और आकर्षण की परिभाषा समाज के बंधे-बंधाए ढांचों से बिल्कुल भिन्न है। इस सत्य को स्वीकार न करना ही आंतरिक कुंठा का कारण बनता है।`
        : `आपकी काम-प्रकृति में पारंपरिक मर्यादा, एकाग्र प्रेम और सौंदर्य-बोध का प्राधान्य है। किंतु जब जीवनसाथी से भावनात्मक तालमेल बिगड़ता है, तो आप अवचेतन रूप से अंतरंगता से दूरी बना लेते हैं, जिससे दांपत्य में दूरियां और बढ़ जाती हैं।`,
    ],
    astrologicalCauseEn: `Brihat Jataka (Ch. 2 - Graha Bheda) & BPHS (Ch. 80): Venus in ${venus.signName} (House ${venus.rasiHouseNumber}), 12th house condition, and ${mercurySaturnConnection || venusKetuConnection ? 'Mercury-Saturn / Venus-Ketu connections indicating Tritiya Prakriti inclinations.' : 'Harmonious Venusian romantic alignment.'}`,
    astrologicalCauseHi: `शास्त्रीय कारण: बृहज्जातक (अध्याय २) एवं बृहत्पाराशर होराशास्त्र (अध्याय ८०): शुक्र देव की '${SIGN_HI[venus.signIndex]}' में स्थिति (भाव ${venus.rasiHouseNumber}) तथा ${mercurySaturnConnection || venusKetuConnection ? 'बुध-शनि अथवा शुक्र-केतु संबंध द्वारा तृतीय प्रकृति के शास्त्रीय संकेत।' : 'शुक्र का पारंपरिक सौंदर्य व मर्यादा पूर्ण प्रभाव।'}`,
    keyPointsEn: [
      `Venus Placement: ${venus.signName} (House ${venus.rasiHouseNumber})`,
      `Intimacy Orientation: ${mercurySaturnConnection || venusKetuConnection ? 'Fluid / Unconventional / Tritiya Prakriti Classical Signatures' : 'Traditional Romantic & Aesthetic Exclusivity'}`,
      `Bed Pleasures Key: Intellectual and emotional safety required before physical surrender.`,
    ],
    keyPointsHi: [
      `शुक्र की स्थिति: '${SIGN_HI[venus.signIndex]}' (भाव संख्या ${venus.rasiHouseNumber})`,
      `काम-प्रकृति का स्वरूप: ${mercurySaturnConnection || venusKetuConnection ? 'तृतीय प्रकृति / अपरंपरागत आकर्षण के शास्त्रीय योग' : 'पारंपरिक मर्यादा व सौंदर्यप्रिय समर्पण'}`,
      `शय्या सुख का नियम: शारीरिक निकटता से पूर्व मानसिक सुरक्षा व संवाद अनिवार्य।`,
    ],
  };

  return [secSpouse, secSexuality];
}

// ============================================================================
// DYNAMIC CHAPTER 7: HEALTH, TRIDOSHA & EXACT HIGH-RISK ORGANS
// ============================================================================
export function computeDynamicHealthSections(chart: ChartData): ChapterSection[] {
  const asc = chart.ascendant;
  const ascElem = SIGNS[asc.signIndex].element;
  const h6Sign = (asc.signIndex + 5) % 12;
  const h6Lord = SIGNS[h6Sign].lord;
  const h6LordPlanet = chart.planets.find((p) => p.id === h6Lord);
  const h8Sign = (asc.signIndex + 7) % 12;
  const h8Lord = SIGNS[h8Sign].lord;
  const h8LordPlanet = chart.planets.find((p) => p.id === h8Lord);
  const saturn = chart.planets.find((p) => p.id === 'Saturn')!;
  const mars = chart.planets.find((p) => p.id === 'Mars')!;

  // Ayurvedic Tridosha by Ascendant Element & Sign
  let tridoshaEn = '';
  let tridoshaHi = '';
  if (ascElem === 'Fire') {
    tridoshaEn = 'Pitta Dominant (High Metabolic Heat, Acidity, Inflammation, Blood Pressure Fluctuations)';
    tridoshaHi = 'पित्त प्रधान प्रकृति (तीव्र जठराग्नि, अम्लता/एसिडिटी, रक्त विकार व दाह की संवेदनशीलता)';
  } else if (ascElem === 'Earth') {
    tridoshaEn = 'Vata-Kapha Dominant (Sluggish Digestion, Joint Stiffness, Dry Skin, Metabolic Inertia)';
    tridoshaHi = 'वात-कफ प्रधान प्रकृति (पाचन का धीमा होना, जोड़ों में जकड़न, त्वचा का सूखापन व आलस्य)';
  } else if (ascElem === 'Air') {
    tridoshaEn = 'Vata Dominant (Nervous Exhaustion, Insomnia, Dry Cough, Anxiety Somatization)';
    tridoshaHi = 'प्रचंड वात प्रधान प्रकृति (स्नायु दुर्बलता, अनिद्रा, अत्यधिक चिंता व मांसपेशियों में खिंचाव)';
  } else {
    tridoshaEn = 'Kapha-Pitta Dominant (Fluid Retention, Respiratory Allergies, Liver Congestion)';
    tridoshaHi = 'कफ-पित्त प्रधान प्रकृति (जल संतुलन, कफ-एलर्जी, लिवर व हार्मोनल संवेदनशीलता)';
  }

  // Exact High-Risk Organs derived from 6th House Sign (Aries to Pisces)
  const ORGAN_SYSTEMS: Record<number, { en: string; hi: string }> = {
    0: { en: 'Cranial circulation, migraines, head injuries, fevers, and blood pressure.', hi: 'सिर, मस्तिष्क की नसें, माइग्रेन, सिर में चोट, बुखार और रक्तचाप।' },
    1: { en: 'Throat, thyroid gland, vocal cords, tonsils, and cervical spine.', hi: 'गला, थायरॉयड ग्रंथि, स्वर तंत्रिकाएं, टॉन्सिल्स और गर्दन की नसें।' },
    2: { en: 'Lungs, respiratory tract, nervous exhaustion, shoulders, and asthma.', hi: 'फेफड़े, श्वसन तंत्र, स्नायु दुर्बलता, कंधे और सांस की एलर्जी।' },
    3: { en: 'Stomach, digestive juices, gastric lining, chest, and psychosomatic ulcers.', hi: 'पेट, पाचन रस, जठराग्नि, छाती और तनाव जनित अल्सर/एसिडिटी।' },
    4: { en: 'Heart, cardiovascular rhythm, spine, eyesight, and metabolic vitality.', hi: 'हृदय, रक्त संचार, रीढ़ की हड्डी, आंखों की रोशनी और जीवन शक्ति।' },
    5: { en: 'Intestines, gut microbiome, IBS, nervous digestion, and food intolerances.', hi: 'आंतें, गट माइक्रोबायोम, कोलाइटिस/IBS, पेट की गैस और भोजन से एलर्जी।' },
    6: { en: 'Kidneys, lumbar vertebrae, urinary tract, and sugar metabolism (diabetes).', hi: 'गुर्दे (किडनी), कमर की रीढ़, मूत्र प्रणाली और शुगर/मधुमेह का संतुलन।' },
    7: { en: 'Excretory organs, colon, pelvic circulation, piles/fistula, and prostate/secret ailments.', hi: 'मलाशय, गुप्त जननांग, बवासीर/फिस्टुला और पेल्विक क्षेत्र की संवेदनशीलता।' },
    8: { en: 'Liver efficiency, arterial circulation, hips, thighs, and high cholesterol.', hi: 'यकृत (लिवर), धमनियों का रक्त प्रवाह, कूल्हे, जांघें और कोलेस्ट्रॉल।' },
    9: { en: 'Knees, bones, joint stiffness, chronic rheumatism, teeth, and skin dryness.', hi: 'घुटने, हड्डियां, जोड़ों में दर्द, गठिया (आर्थराइटिस), दांत और त्वचा का रूखापन।' },
    10: { en: 'Calves, shins, peripheral circulation, varicose veins, and nervous tremors.', hi: 'पिंडलियां, एड़ियां, रक्त वाहिकाएं (वेरिकोज वेन्स) और नसों में कंपन।' },
    11: { en: 'Feet, lymphatic drainage, immune sluggishness, sleep apnea, and psychosomatic fatigue.', hi: 'पैर के पंजे, लसिका तंत्र (लिम्फैटिक), रोग प्रतिरोधक क्षमता और अनिद्रा।' },
  };

  const organProfile = ORGAN_SYSTEMS[h6Sign] ?? ORGAN_SYSTEMS[5];

  // Dynamic Critical Health Years from 6th & 8th Lord Activation Ages
  const lordAges: Record<string, number[]> = {
    Sun: [22, 34, 46, 58],
    Moon: [24, 36, 48, 60],
    Mars: [28, 40, 52, 64],
    Mercury: [17, 32, 45, 57],
    Jupiter: [16, 32, 48, 62],
    Venus: [25, 37, 49, 61],
    Saturn: [19, 36, 54, 72],
    Rahu: [18, 42, 60],
    Ketu: [18, 48, 66],
  };

  const criticalYears = Array.from(
    new Set([...(lordAges[h6Lord] || [28, 46]), ...(lordAges[h8Lord] || [36, 54])])
  ).sort((a, b) => a - b).slice(0, 6);

  // Anga-Bhanga (Physical Disability / Injury Risk) - Saravali Ch. 21
  const hasAngaBhangaRisk = [6, 8, 12].includes(saturn.rasiHouseNumber) ||
    [6, 8].includes(mars.rasiHouseNumber) ||
    h6Lord === asc.signLord;

  const sec1: ChapterSection = {
    titleEn: 'Ayurvedic Constitution (Tridosha) & High-Risk Organ Systems',
    titleHi: 'आयुर्वेदिक त्रिदोष संतुलन एवं संवेदनशील अंग प्रणालियां',
    leadEn: `The elemental biological vulnerabilities of your ${asc.signName} Ascendant and 6th house in ${SIGNS[h6Sign].name}.`,
    leadHi: `आपके '${SIGN_HI[asc.signIndex]}' लग्न के त्रिदोष एवं षष्ठ भाव ('${SIGN_HI[h6Sign]}') के आधार पर शारीरिक संवेदनशीलता।`,
    paragraphsEn: [
      `Your Constitutional Baseline: ${tridoshaEn}. When you undergo sustained emotional stress, your body converts mental anxiety directly into somatic illness.`,
      `Your 6th house of ailments falls in ${SIGNS[h6Sign].name} governed by ${h6Lord}. The most sensitive organ networks in your biology are: ${organProfile.en} Preventative dietary habits and daily yogic alignment of these systems will save you from major medical interventions.`,
    ],
    paragraphsHi: [
      `आपकी मूल त्रिदोष प्रकृति: ${tridoshaHi}। जब भी आप लंबे समय तक मानसिक तनाव में रहते हैं, आपका शरीर उस तनाव को तुरंत शारीरिक व्याधियों में बदल देता है।`,
      `रोग भाव (षष्ठ) '${SIGN_HI[h6Sign]}' राशि में है जिसके स्वामी '${PLANET_HI[h6Lord] || h6Lord}' हैं। आपके शरीर के सर्वाधिक संवेदनशील अंग: ${organProfile.hi} खान-पान में संयम और नियमित योग द्वारा इन अंगों को स्वस्थ रखना दीर्घायु की कुंजी है।`,
    ],
    astrologicalCauseEn: `Saravali (Ch. 21 - Anga Lakshana) & Phaladeepika (Ch. 14 - Roga Nirupanam): 6th house in ${SIGNS[h6Sign].name} ruled by ${h6Lord} (House ${h6LordPlanet?.rasiHouseNumber || 6}) determines bodily vulnerability.`,
    astrologicalCauseHi: `शास्त्रीय कारण: सारावली (अध्याय २१) एवं फलदीपिका (अध्याय १४ - रोगनिर्णयाध्यायः): षष्ठ भाव '${SIGN_HI[h6Sign]}' (स्वामी: ${PLANET_HI[h6Lord] || h6Lord}) शारीरिक व्याधियों के संवेदनशील अंगों का निर्धारण करता है।`,
    keyPointsEn: [
      `Ayurvedic Tridosha: ${tridoshaEn}`,
      `High-Risk Organs: ${organProfile.en}`,
      `6th House Lord: ${h6Lord} in House ${h6LordPlanet?.rasiHouseNumber || 6}`,
    ],
    keyPointsHi: [
      `आयुर्वेदिक त्रिदोष: ${tridoshaHi}`,
      `संवेदनशील अंग: ${organProfile.hi}`,
      `षष्ठेश: '${PLANET_HI[h6Lord] || h6Lord}' (भाव ${h6LordPlanet?.rasiHouseNumber || 6})`,
    ],
  };

  const sec2: ChapterSection = {
    titleEn: 'Physical Impairment (Anga-Bhanga) Diagnostic & Critical Health Years',
    titleHi: 'अंग-दोष, शारीरिक अक्षमता परीक्षण एवं संकट के संवेदनशील वर्ष',
    leadEn: `Classical Saravali assessment of vulnerability to permanent injury, surgeries, and milestone years.`,
    leadHi: `सारावली सम्मत दुर्घटना, शल्यक्रिया व अंग-दोष का परीक्षण तथा जीवन के संवेदनशील स्वास्थ्य वर्ष।`,
    paragraphsEn: [
      `Classical Anga-Bhanga Diagnostic: ${hasAngaBhangaRisk ? 'Your chart indicates moderate vulnerability to physical injuries, particularly to the lower limbs, spine, or head during high-velocity activities, sports, or falls. You must exercise strict caution while driving and avoid extreme, uncalculated physical risks during Mars and Saturn dasha cycles.' : 'Your chart is largely protected from congenital physical disability or permanent limb impairment. Normal health hygiene and active mobility preserve structural integrity.'}`,
      `Critical Astrological Health Milestones: Ages ${criticalYears.join(', ')} represent sensitive planetary junctions when 6th lord (${h6Lord}), 8th lord (${h8Lord}), or nodal cycles activate health tests. During these specific age milestones, prioritize preventative medical checkups, clean satvik diet, and avoid reckless driving.`,
    ],
    paragraphsHi: [
      `अंग-दोष एवं शारीरिक अक्षमता परीक्षण: ${hasAngaBhangaRisk ? 'आपकी कुंडली में कमर से नीचे के अंगों, पैरों, अथवा रीढ़ की हड्डी के प्रति संवेदनशीलता और आकस्मिक चोट/सर्जरी का मध्यम जोखिम दिखाई देता है। वाहन चलाते समय, ऊंचाई पर कार्य करते समय अथवा खेलकूद में अतिरिक्त सावधानी बरतनी अनिवार्य है।' : 'आपकी कुंडली किसी जन्मजात शारीरिक अक्षमता से सुरक्षित है; नियमित व्यायाम और सात्विक दिनचर्या द्वारा आपका शरीर दीर्घकाल तक सुदृढ़ रहेगा।'}`,
      `स्वास्थ्य व संकट के संवेदनशील वर्ष: ${criticalYears.join(', ')}वां वर्ष जीवन में स्वास्थ्य व दुर्घटना की दृष्टि से संवेदनशील कालखंड हैं। इन वर्षों में अपने स्वास्थ्य के प्रति रत्ती भर भी लापरवाही न बरतें और नियमित रूप से महामृत्युंजय मंत्र का स्मरण करें।`,
    ],
    astrologicalCauseEn: `Saravali (Ch. 21 - Anga Bhanga Adhyaya) & BPHS (Ch. 16): 6th lord ${h6Lord} and 8th lord ${h8Lord} define critical age markers: ${criticalYears.join(', ')}.`,
    astrologicalCauseHi: `शास्त्रीय कारण: सारावली (अध्याय २१ - अङ्गभङ्गाध्यायः) एवं बृहत्पाराशर होराशास्त्र: षष्ठेश '${PLANET_HI[h6Lord] || h6Lord}' व अष्टमेश '${PLANET_HI[h8Lord] || h8Lord}' संकट वर्षों (${criticalYears.join(', ')} वर्ष) को चिन्हित करते हैं।`,
    keyPointsEn: [
      `Anga-Bhanga Status: ${hasAngaBhangaRisk ? 'Moderate Vulnerability (Caution in driving & high-velocity activity)' : 'Protected from congenital impairment'}`,
      `Critical Health Years: Ages ${criticalYears.join(', ')}`,
      `Protective Shield: Mahamrityunjaya Japa during active transit crossroads.`,
    ],
    keyPointsHi: [
      `अंग-दोष स्थिति: ${hasAngaBhangaRisk ? 'मध्यम संवेदनशीलता (वाहन व ऊंचाई पर सतर्कता आवश्यक)' : 'जन्मजात दोषों से पूर्णतः सुरक्षित'}`,
      `संवेदनशील स्वास्थ्य वर्ष: ${criticalYears.join(', ')}वां वर्ष`,
      `रक्षा कवच: महामृत्युंजय मंत्र का नित्य स्मरण।`,
    ],
  };

  return [sec1, sec2];
}

// ============================================================================
// DYNAMIC CHAPTER 8: 15 TO 75 YEARS CHRONOLOGY (12 INDIVIDUAL 5-YEAR EPOCHS)
// ============================================================================
export function computeDynamic12Epochs(chart: ChartData, isMarriageDenial: boolean): ChapterSection[] {
  const birthDate = new Date(chart.input.date);
  const birthYear = isNaN(birthDate.getFullYear()) ? 1990 : birthDate.getFullYear();
  const birthMs = birthDate.getTime();
  const periods = chart.vimshottari ?? [];

  const epochsConfig = [
    { num: 1, startAge: 15, endAge: 20, themeEn: 'Adolescence, Academic Foundations & Early Identity', themeHi: 'किशोरावस्था, विद्या का द्वंद्व एवं पहचान की खोज' },
    { num: 2, startAge: 21, endAge: 25, themeEn: 'First Independence, Career Launch & Practical Reality', themeHi: 'स्वावलंबन की तलाश, करियर की नींव एवं यथार्थ का आघात' },
    { num: 3, startAge: 26, endAge: 30, themeEn: 'Crucible Milestone, Elevation & Major Alliances', themeHi: 'जीवन का निर्णायक मोड़, पदोन्नति व पहला बड़ा उत्थान' },
    { num: 4, startAge: 31, endAge: 35, themeEn: 'Heavy Responsibilities, Asset Expansion & Relentless Grind', themeHi: 'भारी आर्थिक दायित्व, संपत्ति निर्माण एवं निरंतर भागदौड़' },
    { num: 5, startAge: 36, endAge: 40, themeEn: 'The Zenith Acceleration, Leadership & Mid-Life Crucible', themeHi: 'उत्कर्ष का शिखर काल, नेतृत्व एवं जीवन का पुनर्गठन' },
    { num: 6, startAge: 41, endAge: 45, themeEn: 'Material Consolidation, Societal Stature & Generational Legacy', themeHi: 'भौतिक संपदा का स्थायित्व, सामाजिक प्रतिष्ठा व कुल-गौरव' },
    { num: 7, startAge: 46, endAge: 50, themeEn: 'Physical Recalibration, Introspection & Lifestyle Shifts', themeHi: 'शारीरिक संवेदनशीलता, अंतरावलोकन व स्वास्थ्य का घंटा' },
    { num: 8, startAge: 51, endAge: 55, themeEn: 'Ascension of Lineage, Duty Fulfillment & Spiritual Maturation', themeHi: 'संतान का भाग्योदय, सामाजिक दायित्वों की पूर्णता व आत्मिक शांति' },
    { num: 9, startAge: 56, endAge: 60, themeEn: 'Transition to Elder Statesmanship & Advisory Authority', themeHi: 'सक्रिय श्रम से निवृत्ति, वरिष्ठ मार्गदर्शक की भूमिका व सम्मान' },
    { num: 10, startAge: 61, endAge: 65, themeEn: 'Pilgrimages, Domestic Peace & Detached Contemplation', themeHi: 'तीर्थाटन, पारिवारिक सुख-शांति एवं शांत चित्त' },
    { num: 11, startAge: 66, endAge: 70, themeEn: 'Deep Sadhana, Shedding Worldly Ties & Transmission of Wisdom', themeHi: 'वैराग्य, गहन साधना एवं ज्ञान का संप्रेषण' },
    { num: 12, startAge: 71, endAge: 75, themeEn: 'Reconciliation of Accounts, Sublime Surrender & Moksha Readiness', themeHi: 'सांसारिक लेखा-जोखा पूर्ण, शांत समर्पण व मोक्ष की तैयारी' },
  ];

  const sections: ChapterSection[] = [];

  for (const ep of epochsConfig) {
    const startCalendarYear = birthYear + ep.startAge;
    const endCalendarYear = birthYear + ep.endAge;
    const midAge = (ep.startAge + ep.endAge) / 2;
    const midMs = birthMs + midAge * 365.25 * 86400000;

    const path = findActiveDashaPath(periods, midMs);
    const md = (path[0]?.lord as NineGrahaId) || 'Saturn';
    const ad = (path[1]?.lord as NineGrahaId) || 'Mercury';

    const mdPlanet = chart.planets.find((p) => p.id === md);
    const adPlanet = chart.planets.find((p) => p.id === ad);
    const mdHouse = mdPlanet?.rasiHouseNumber || 1;
    const adHouse = adPlanet?.rasiHouseNumber || 1;

    // Narrative generation based on actual running dasha and age bracket
    let p1En = '';
    let p1Hi = '';
    let p2En = '';
    let p2Hi = '';

    if (ep.num === 1) {
      // 15-20
      p1En = `Between ages 15 and 20 (${startCalendarYear}–${endCalendarYear} CE), your intellectual faculties expanded under the running Mahadasha of ${md} (House ${mdHouse}) and Antardasha of ${ad} (House ${adHouse}). You experienced a silent rebellion against rigid authoritarian instruction, seeking your own intellectual identity while feeling the heavy burden of parental expectations.`;
      p1Hi = `15 से 20 वर्ष की आयु में (${startCalendarYear}–${endCalendarYear} ईस्वी), '${PLANET_HI[md] || md}' (भाव ${mdHouse}) की महादशा तथा '${PLANET_HI[ad] || ad}' (भाव ${adHouse}) की अंतर्दशा के प्रभाव से आपकी बौद्धिक क्षमता का तीव्र विकास हुआ। आपने पारंपरिक नियमों के प्रति मौन विद्रोह किया और पारिवारिक अपेक्षाओं के दबाव के बीच स्वयं की पहचान तलाशने का संघर्ष किया।`;
      p2En = `A critical academic or vocational crossroads around age 17–18 laid the foundational stones of your career path. You battled youthful self-doubt, emotional crushes, and peer comparisons, yet your intrinsic mental resilience carried you across the threshold into young adulthood.`;
      p2Hi = `17 से 18 वर्ष की आयु के आसपास विद्या अथवा विषय के चयन में एक बड़ा मोड़ आया जिसने आपके भविष्य की नींव रखी। युवावस्था के असमंजस, आकर्षण और साथियों से तुलना के द्वंद्व के बाद भी आपकी स्वाभाविक प्रतिभा ने आपको आगे बढ़ाया।`;
    } else if (ep.num === 2) {
      // 21-25
      p1En = `Between ages 21 and 25 (${startCalendarYear}–${endCalendarYear} CE), the harsh realities of the competitive world arrived under ${md}-${ad}. College idealism dissolved as you confronted the necessity of earning independent livelihood. You acquired professional discipline, learned to navigate complex workplace hierarchies, and faced the reality that merit alone requires political savvy to survive.`;
      p1Hi = `21 से 25 वर्ष की आयु में (${startCalendarYear}–${endCalendarYear} ईस्वी), '${PLANET_HI[md] || md}-${PLANET_HI[ad] || ad}' के प्रभाव से संसार के कठोर यथार्थ का सामना हुआ। कॉलेज के आदर्शवादी स्वप्नों की जगह स्वावलंबन और आजीविका की चिंता ने ली। आपने पहली स्वतंत्र कमाई अर्जित की और समझा कि दुनिया में केवल योग्यता नहीं, बल्कि धैर्य और कूटनीति भी अनिवार्य है।`;
      p2En = `An intense personal or romantic trial during this epoch tested your emotional maturity. Sacrifices were demanded, shedding youthful naivety and teaching you irreplaceable lessons regarding whom to trust and where to draw boundaries.`;
      p2Hi = `इस कालखंड में प्रेम अथवा मित्रता की एक गहरी परीक्षा हुई जिसमें या तो भारी त्याग करना पड़ा या गहरा विश्वासघात सहना पड़ा, जिसने आपको इंसानी फितरत को पहचानने की अचूक दृष्टि प्रदान की।`;
    } else if (ep.num === 3) {
      // 26-30
      p1En = `Ages 26 to 30 (${startCalendarYear}–${endCalendarYear} CE) constituted a master turning point under ${md} (House ${mdHouse}) and ${ad} (House ${adHouse}). ${isMarriageDenial ? 'Instead of conventional domestic entanglements, this window brought profound intellectual consolidation, solitary creative breakthroughs, and setting up an independent enterprise or specialized mastery.' : 'For natives of your configuration, this epoch consolidated long-term personal partnerships or marriage, alongside a decisive breakthrough in career stature.'}`;
      p1Hi = `26 से 30 वर्ष का कालखंड (${startCalendarYear}–${endCalendarYear} ईस्वी) जीवन का 'केंद्रीय मोड़' साबित हुआ जब '${PLANET_HI[md] || md}' व '${PLANET_HI[ad] || ad}' सक्रिय रहे। ${isMarriageDenial ? 'पारंपरिक दांपत्य के स्थान पर इस काल में जातक की बौद्धिक स्वाधीनता, स्वतंत्र शोध या व्यापारिक उद्यम की सुदृढ़ स्थापना हुई।' : 'इस पड़ाव पर गंभीर दीर्घकालिक साझेदारी अथवा विवाह संस्कार संपन्न हुआ, और करियर में सामान्य कर्मचारी से ऊपर उठकर ठोस अधिकार प्राप्त हुआ।'} `;
      p2En = `Between ages 28 and 30, a major transition—relocation, promotion, or high-stakes project execution—elevated your public standing. You ceased asking for permission and began commanding operational responsibility.`;
      p2Hi = `28 से 30 वर्ष के मध्य कार्यक्षेत्र में एक बड़ा उछाल आया—स्थान परिवर्तन अथवा नई पदोन्नति ने समाज में आपका एक स्वतंत्र कद स्थापित करना प्रारंभ कर दिया।`;
    } else if (ep.num === 4) {
      // 31-35
      p1En = `Ages 31 to 35 (${startCalendarYear}–${endCalendarYear} CE) represented the most demanding operational phase under ${md}-${ad}. ${isMarriageDenial ? 'High professional demands, building long-term assets, and navigating competitive adversaries tested your endurance.' : 'Family expansion, children’s early upbringing, and acquiring or upgrading real estate created intense financial obligations.'} Every resource earned was directed toward building lasting security.`;
      p1Hi = `31 से 35 वर्ष का कालखंड (${startCalendarYear}–${endCalendarYear} ईस्वी) जिम्मेदारियों से लदा अत्यंत व्यस्त दौर रहा। ${isMarriageDenial ? 'करियर में बड़े प्रोजेक्ट्स, अचल संपत्ति का निर्माण और प्रतिस्पर्धियों से निपटना आपकी सहनशक्ति की परीक्षा लेता रहा।' : 'संतान का सुख, घर-मकान बनाने की भागदौड़ और पारिवारिक खर्चों ने आर्थिक प्रबंधन की निरंतर परीक्षा ली।'} कमाया हुआ अधिकांश धन स्थायी संपत्ति और उत्तरदायित्वों में लगा।`;
      p2En = `Physical fatigue and corporate pressures mounted, yet your inner fortitude solidified into steel. You served as an unshakeable shield for those depending on you.`;
      p2Hi = `शारीरिक थकावट और भागदौड़ के बाद भी आपका संकल्प चट्टान की भांति दृढ़ बना रहा और आप अपनों के लिए एक अटूट रक्षा-कवच बने रहे।`;
    } else if (ep.num === 5) {
      // 36-40
      p1En = `Ages 36 to 40 (${startCalendarYear}–${endCalendarYear} CE) unlocked the mature zenith acceleration previewed in Chapter 4 under ${md} and ${ad}. You stepped into executive leadership or independent business ownership, commanding authority across your ecosystem. You were no longer executing others’ visions; you were shaping policy.`;
      p1Hi = `36 से 40 वर्ष की आयु (${startCalendarYear}–${endCalendarYear} ईस्वी) में आपके जीवन का स्वर्णिम उत्कर्ष काल प्रारंभ हुआ। '${PLANET_HI[md] || md}' और '${PLANET_HI[ad] || ad}' के पूर्ण परिपक्व होने से आप कार्यक्षेत्र में नीति-निर्धारक या बड़े व्यापार के स्थापित स्वामी बने। आपकी सलाह का वजन बढ़ा।`;
      p2En = `Simultaneously, a mid-life psychological pruning took place: you ruthlessly excised transactional acquaintances and superficial socializing, fiercely guarding your peace of mind and health.`;
      p2Hi = `साथ ही एक गंभीर मध्य-आयु मंथन हुआ: आपने चापलूसों और व्यर्थ के संपर्कों से दूरी बना ली और केवल चुनिंदा आत्मीय लोगों, स्वास्थ्य और मानसिक शांति को सर्वोच्च प्राथमिकता दी।`;
    } else if (ep.num === 6) {
      // 41-45
      p1En = `Between ages 41 and 45 (${startCalendarYear}–${endCalendarYear} CE), frantic youth yielded to dignified assurance under ${md}-${ad}. You consolidated material reserves, retired legacy debts, and invested in generational assets. Extended family and junior peers sought your guidance as a living patriarch/matriarch.`;
      p1Hi = `41 से 45 वर्ष की आयु (${startCalendarYear}–${endCalendarYear} ईस्वी) में युवावस्था की अधीरता शांत होकर गरिमामयी गंभीरता में बदल गई। आपने पुराने कर्जों का निस्तारण किया, संचित पूंजी को सुरक्षित संपत्तियों में बदला, और कुल में एक सम्मानित स्तंभ बने।`;
      p2En = `A profound philanthropic instinct awakened: you began considering what moral, educational, and spiritual legacy you would leave behind beyond financial ledger balances.`;
      p2Hi = `मन में 'विरासत' का विचार गहराया: केवल धन संचय के बजाय भावी पीढ़ी को श्रेष्ठ संस्कार, विद्या और धर्म का संबल देने की ओर स्वाभाविक रुझान बढ़ा।`;
    } else if (ep.num === 7) {
      // 46-50
      p1En = `The 46 to 50 cycle (${startCalendarYear}–${endCalendarYear} CE) sounded an unambiguous health recalibration alarm under ${md} (House ${mdHouse}) and ${ad} (House ${adHouse}). Metabolic invulnerability passed; blood pressure, sugar, spine, or joints demanded strict daily yogic discipline.`;
      p1Hi = `46 से 50 वर्ष का कालखंड (${startCalendarYear}–${endCalendarYear} ईस्वी) स्वास्थ्य की दृष्टि से शरीर का अलार्म बजाने वाला रहा। अत्यधिक तनाव और अनियमितता का प्रभाव रक्तचाप, पाचन अथवा रीढ़-जोड़ों पर पड़ा, जिसने दिनचर्या में तत्काल सुधार की मांग की।`;
      p2En = `Spiritually, this was an illuminating awakening. You realized the ultimate emptiness of worldly rat-races, embracing morning meditation, sacred study, and detached witnessing over stressful expansions.`;
      p2Hi = `आध्यात्मिक रूप से यह चित्त शुद्धि का काल रहा। संसार की अंधी दौड़ की व्यर्थता समझ में आई और आपका मन ध्यान, ईश्वर-भक्ति और एकांत साधना में शांति पाने लगा।`;
    } else if (ep.num === 8) {
      // 51-55
      p1En = `Between ages 51 and 55 (${startCalendarYear}–${endCalendarYear} CE), under ${md}-${ad}, ${isMarriageDenial ? 'intellectual and philosophical mentoring reached full bloom; you guided disciples, younger associates, and institutions with detached wisdom.' : 'your primary focus shifted toward children’s higher education, career establishment, and marital alliances. Fulfilling these heavy parental milestones brought profound relief and satisfaction.'}`;
      p1Hi = `51 से 55 वर्ष की अवस्था (${startCalendarYear}–${endCalendarYear} ईस्वी) में, ${isMarriageDenial ? 'आपकी बौद्धिक व दार्शनिक प्रतिष्ठा चरम पर पहुंची; आपने युवा पीढ़ी, शोधकर्ताओं अथवा शिष्यों को निष्काम भाव से मार्गदर्शन दिया।' : 'जीवन का केंद्र संतान बनी; उनकी उच्च शिक्षा, आजीविका और विवाह के पवित्र बंधनों को संपन्न कराने से मन पर से एक बहुत बड़ा भार उतरा और आत्म-संतोष मिला।'} `;
      p2En = `Your Ishta Devata mantra became a constant subconscious accompaniment. Worldly storms were navigated with philosophical equilibrium, resting in divine cosmic order.`;
      p2Hi = `इष्ट देव का नाम-जप श्वास-श्वास में समा गया। सांसारिक उतार-चढ़ावों को आपने एक साक्षी भाव से देखना प्रारंभ कर दिया।`;
    } else if (ep.num === 9) {
      // 56-60
      p1En = `Ages 56 to 60 (${startCalendarYear}–${endCalendarYear} CE) marked the formal transition from daily operational exhaustion to elder statesmanship under ${md}-${ad}. You stepped back from frontline trenches, delegating executive duties to trusted successors.`;
      p1Hi = `56 से 60 वर्ष की आयु (${startCalendarYear}–${endCalendarYear} ईस्वी) दैनिक कठोर भागदौड़ से विश्राम की ओर बढ़ने का समय रहा। सक्रिय कार्यभार युवा पीढ़ी या सहयोगियों को सौंपकर आप एक वरिष्ठ मार्गदर्शक (Advisor) की भूमिका में आ गए।`;
      p2En = `Your authority elevated from raw power into moral reverence. You enjoyed the fruits of lifelong labor in domestic harmony, free from urgent workplace anxiety.`;
      p2Hi = `आपका प्रभाव पद से बदलकर 'आदर और सम्मान' में रूपांतरित हो गया। आपने जीवन भर के संचित अनुभवों का लाभ समाज को दिया और मानसिक शांति का आनंद लिया।`;
    } else if (ep.num === 10) {
      // 61-65
      p1En = `Between 61 and 65 (${startCalendarYear}–${endCalendarYear} CE), deep domestic peace and sacred wanderlust arrived under ${md}-${ad}. Extended pilgrimages to holy rivers and mountain shrines washed away accumulated karmic residue.`;
      p1Hi = `61 से 65 वर्ष का पड़ाव (${startCalendarYear}–${endCalendarYear} ईस्वी) असीम शांति और तीर्थाटन का आनंद लेकर आया। पवित्र तीर्थों की यात्राओं ने मन को निर्मल और कृतार्थ किया।`;
      p2En = `Financial security remained completely self-sufficient. You lived simply, enjoyed wholesome satvik food, and guarded your mental sanctity against domestic squabbles.`;
      p2Hi = `आर्थिक स्थिति पूरी तरह आत्मनिर्भर रही। आपने सात्विक, संयमित दिनचर्या अपनाई और व्यर्थ के सांसारिक विवादों से चित्त को सर्वथा दूर रखा।`;
    } else if (ep.num === 11) {
      // 66-70
      p1En = `Between ages 66 and 70 (${startCalendarYear}–${endCalendarYear} CE), natural Vairagya (healthy detachment) flowered under ${md}-${ad}. Material wealth and social applause ceased to hold allure; consciousness rested in pure spiritual presence.`;
      p1Hi = `66 से 70 वर्ष की आयु (${startCalendarYear}–${endCalendarYear} ईस्वी) में स्वाभाविक वैराग्य का उदय हुआ। सांसारिक मान-प्रतिष्ठा की लालसा समाप्त हो गई और मन अंतरात्मा की अगाध शांति में स्थित हो गया।`;
      p2En = `Family and community revered you as a living sage whose silent blessings held protective power. Daily hours flowed in contemplation, sacred chanting, and goodwill to all beings.`;
      p2Hi = `समाज और परिवार में आपको एक ऋषि-तुल्य वंदनीय स्थान प्राप्त हुआ। आपका अधिकांश समय ध्यान, जप, और लोक-कल्याण की मंगल कामनाओं में व्यतीत होने लगा।`;
    } else {
      // 71-75
      p1En = `Ages 71 to 75 (${startCalendarYear}–${endCalendarYear} CE) represent the sublime culmination of earthly obligations under ${md}-${ad}. Looking back upon seven decades, every trial is recognized as a crucible of soul growth, and every triumph as divine grace. All significant karmic accounts are reconciled.`;
      p1Hi = `71 से 75 वर्ष का कालखंड (${startCalendarYear}–${endCalendarYear} ईस्वी) इस जन्म के महा-अध्याय की गौरवमयी पूर्णता का काल है। बीते हुए जीवन पर दृष्टि डालने पर कोई पछतावा शेष नहीं रहता; प्रत्येक कष्ट ने चेतना को मांजा और प्रत्येक सुख ने कृतज्ञता सिखाई। प्रारब्ध के सभी ऋण सम्यक रूप से चुक गए।`;
      p2En = `Carrying no enmities and fearing neither disease nor death, the soul rests in calm surrender at the feet of the Ishta Devata, fully prepared for a luminous transition when the final cosmic call arrives.`;
      p2Hi = `मन में किसी के प्रति कोई द्वेष नहीं, और मृत्यु का कोई भय नहीं। अपने इष्ट देव के चरणों में पूर्ण समर्पण के साथ, आत्मा एक पवित्र, शांत और मुक्त अवस्था में स्थित रहती है—दिव्य लोकों की ओर प्रयाण हेतु पूर्णतः तत्पर।`;
    }

    const sec: ChapterSection = {
      titleEn: `Epoch ${ep.num} (Ages ${ep.startAge}–${ep.endAge} · ${startCalendarYear}–${endCalendarYear} CE): ${ep.themeEn}`,
      titleHi: `${ep.themeHi} (आयु ${ep.startAge} से ${ep.endAge} वर्ष · ${startCalendarYear}–${endCalendarYear} ईस्वी)`,
      leadEn: `Dasha Axis: Mahadasha Lord ${md} (House ${mdHouse}) & Antardasha Lord ${ad} (House ${adHouse}).`,
      leadHi: `सक्रिय काल चक्र: महादशेश '${PLANET_HI[md] || md}' (भाव ${mdHouse}) एवं अंतर्दशेश '${PLANET_HI[ad] || ad}' (भाव ${adHouse})।`,
      paragraphsEn: [p1En, p2En],
      paragraphsHi: [p1Hi, p2Hi],
      astrologicalCauseEn: `Brihat Parashara Hora Shastra (Ch. 52–60) & Hora Sara: Running Mahadasha of ${md} and Antardasha of ${ad} activating houses ${mdHouse} and ${adHouse} in natal chart.`,
      astrologicalCauseHi: `शास्त्रीय कारण: बृहत्पाराशर होराशास्त्र (अध्याय ५२-६० - दशाफलाध्यायः) एवं होरासार: '${PLANET_HI[md] || md}' व '${PLANET_HI[ad] || ad}' की दशा द्वारा भाव ${mdHouse} व ${adHouse} का फलीभूत होना।`,
      keyPointsEn: [
        `Epoch Span: Ages ${ep.startAge}–${ep.endAge} (${startCalendarYear}–${endCalendarYear} CE)`,
        `Active Mahadasha: ${md} (House ${mdHouse})`,
        `Active Antardasha: ${ad} (House ${adHouse})`,
        `Core Milestone: ${ep.themeEn}`,
      ],
      keyPointsHi: [
        `आयु कालखंड: ${ep.startAge} से ${ep.endAge} वर्ष (${startCalendarYear}–${endCalendarYear} ईस्वी)`,
        `सक्रिय महादशा: '${PLANET_HI[md] || md}' (भाव संख्या ${mdHouse})`,
        `सक्रिय अंतर्दशा: '${PLANET_HI[ad] || ad}' (भाव संख्या ${adHouse})`,
        `मुख्य जीवन पड़ाव: ${ep.themeHi}`,
      ],
    };

    sections.push(sec);
  }

  return sections;
}
