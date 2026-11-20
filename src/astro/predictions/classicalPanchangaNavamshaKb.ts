/**
 * Classical Panchanga, Seasonality, Diurnal Chronology & Prithu Yasas Navamsha Knowledge Base
 * Authentic classical Shastric dictums for Vedic birth foundations.
 * Brand: AV Astro Vibe
 * Formatting Rules: Zero emojis, dates in DD-MM-YYYY format.
 */

export interface VaraProfile {
  id: string;
  nameEn: string;
  nameHi: string;
  rulingPlanet: string;
  rulingPlanetHi: string;
  psychologicalTraitsEn: string;
  psychologicalTraitsHi: string;
  workAndAmbitionEn: string;
  workAndAmbitionHi: string;
  relationshipNatureEn: string;
  relationshipNatureHi: string;
  synthesisEn: string;
  synthesisHi: string;
}

export interface TithiProfile {
  number: number;
  nameEn: string;
  nameHi: string;
  category: 'Nanda' | 'Bhadra' | 'Jaya' | 'Rikta' | 'Poorna';
  categoryHi: 'नंदा' | 'भद्रा' | 'जया' | 'रिक्ता' | 'पूर्णा';
  categorySignificanceEn: string;
  categorySignificanceHi: string;
  presidingDeityEn: string;
  presidingDeityHi: string;
  governingNityaDeviEn: string;
  governingNityaDeviHi: string;
  nityaDeviMantra: string;
  classicalResultEn: string;
  classicalResultHi: string;
  propitiousWorkEn: string;
  propitiousWorkHi: string;
  avoidWorkEn: string;
  avoidWorkHi: string;
}

export interface NavamshaLagnaProfile {
  signIndex: number;
  signNameEn: string;
  signNameHi: string;
  prithuYasasDictumEn: string;
  prithuYasasDictumHi: string;
  temperamentAndAppearanceEn: string;
  temperamentAndAppearanceHi: string;
  wealthAndCareerEn: string;
  wealthAndCareerHi: string;
  criticalVulnerabilityAges: number[];
  sageWarningEn: string;
  sageWarningHi: string;
}

export interface MaasProfile {
  index: number;
  nameEn: string;
  nameHi: string;
  sunSignEn: string;
  sunSignHi: string;
  shastricResultEn: string;
  shastricResultHi: string;
}

export interface RituProfile {
  index: number;
  nameEn: string;
  nameHi: string;
  lunarMonthsEn: string;
  lunarMonthsHi: string;
  sunSignsEn: string;
  sunSignsHi: string;
  temperamentEn: string;
  temperamentHi: string;
}

export interface KaalProfile {
  id: string;
  nameEn: string;
  nameHi: string;
  timeWindow: string;
  sunHousePosition: string;
  natureEn: string;
  natureHi: string;
}

export interface NityaYogaProfile {
  number: number;
  nameEn: string;
  nameHi: string;
  natureEn: string;
  natureHi: string;
  classicalResultEn: string;
  classicalResultHi: string;
}

export interface KaranaProfile {
  number: number;
  nameEn: string;
  nameHi: string;
  natureEn: string;
  natureHi: string;
  classicalResultEn: string;
  classicalResultHi: string;
}

export interface NakshatraBirthProfile {
  number: number;
  nameEn: string;
  nameHi: string;
  physicalFeaturesEn: string;
  physicalFeaturesHi: string;
  psychologicalTraitsEn: string;
  psychologicalTraitsHi: string;
  lifeTrajectoryEn?: string;
  lifeTrajectoryHi?: string;
}

export interface GregorianMonthProfile {
  monthIndex: number; // 1-12
  monthNameEn: string;
  monthNameHi: string;
  archetypeEn: string;
  archetypeHi: string;
}

/* =========================================================================
   1. VARA PROFILES (रविवार से शनिवार)
   ========================================================================= */
export const CLASSICAL_VARA_PROFILES: Record<string, VaraProfile> = {
  Sun: {
    id: 'Sun',
    nameEn: 'Sunday (Ravivar)',
    nameHi: 'रविवार (सूर्यवार)',
    rulingPlanet: 'Sun',
    rulingPlanetHi: 'सूर्य',
    psychologicalTraitsEn: 'Vibrant, bold, highly creative, enthusiastic and natural leaders. Strongly independent with a high sense of self-respect; they need to be at the center of attention and possess an unyielding will.',
    psychologicalTraitsHi: 'तेजस्वी, साहसी, अत्यंत रचनात्मक, उत्साही एवं स्वाभाविक नेतृत्वकर्ता। उच्च आत्मसम्मान एवं स्वावलंबी स्वभाव; कार्यों के केंद्र में रहना पसंद करते हैं तथा संकल्प पूरा होने तक विश्राम नहीं करते।',
    workAndAmbitionEn: 'Executes responsibilities with authority, self-reliance, and single-minded determination. Natural administrators and decision makers who do not settle until targets are fulfilled.',
    workAndAmbitionHi: 'अधिकार, स्वावलंबन और एकाग्र निष्ठा के साथ कार्य करते हैं। जन्मजात प्रशासक जो अपने लक्ष्य की पूर्ण सिद्धि से पूर्व कभी संतुष्ट नहीं होते।',
    relationshipNatureEn: 'Highly faithful, loyal, and noble in relationships, though emotionally demanding in friendships and expecting deep mutual respect and undivided attention.',
    relationshipNatureHi: 'संबंधों में परम निष्ठावान और आदरणीय, किंतु मित्रता व प्रेम में उच्च अपेक्षाएं रखने वाले तथा पूर्ण ध्यान व सम्मान की कामना करते हैं।',
    synthesisEn: 'Sunday birth connects the native to solar royalty, authoritative vision, and moral steadfastness, refined by the Sun’s house dignity and strength.',
    synthesisHi: 'रविवार का जन्म जातक को सूर्य के समान तेज, राजसी नेतृत्व, स्वाभिमान और अटल संकल्प शक्ति प्रदान करता है।'
  },
  Moon: {
    id: 'Moon',
    nameEn: 'Monday (Somvar)',
    nameHi: 'सोमवार (चंद्रवार)',
    rulingPlanet: 'Moon',
    rulingPlanetHi: 'चंद्रमा',
    psychologicalTraitsEn: 'Deeply sensitive, imaginative, empathetic, and charming. While emotionally receptive, they develop sound emotional management, high intuition, and meticulous planning.',
    psychologicalTraitsHi: 'अत्यंत संवेदनशील, कल्पनाशक्ति संपन्न, सहानुभूतिपूर्ण एवं आकर्षक। भावुक होते हुए भी भावनाओं को संतुलित कर व्यवस्थित योजनाबद्ध ढंग से कार्य करने में कुशल।',
    workAndAmbitionEn: 'Excels in roles involving public welfare, creative architecture, psychology, hospitality, advisory services, and strategic long-term planning.',
    workAndAmbitionHi: 'जनकल्याण, कलात्मक सृजन, परामर्श, जनसंपर्क एवं दूरगामी योजना-निर्माण से जुड़े कार्यों में विशेष सफलता प्राप्त करते हैं।',
    relationshipNatureEn: 'Extremely family-oriented, tender, caring, treating everyone with equal grace, and creating nurturing, magnetic bonds with loved ones.',
    relationshipNatureHi: 'पूर्णतः परिवार-उन्मुख, स्नेहिल, सौम्य और समदृष्टि रखने वाले। जीवनसाथी व आत्मीय जनों के प्रति अत्यधिक समर्पित एवं रक्षक।',
    synthesisEn: 'Monday birth bestows lunar grace, adaptability, magnetic public appeal, and intuitive intellect, governed by lunar dignity and paksha-bala.',
    synthesisHi: 'सोमवार का जन्म चंद्र-तत्व से युक्त सौम्यता, जनप्रियता, समृद्ध कल्पनाशक्ति और भावनात्मक परिपक्वता प्रदान करता है।'
  },
  Mars: {
    id: 'Mars',
    nameEn: 'Tuesday (Mangalvar)',
    nameHi: 'मंगलवार (भौमवार)',
    rulingPlanet: 'Mars',
    rulingPlanetHi: 'मंगल',
    psychologicalTraitsEn: 'Highly energetic, courageous, full of dynamic grace, ambitious, and sensitive to criticism. Straightforward and fiercely honest in duty, though occasionally impatient.',
    psychologicalTraitsHi: 'ऊर्जावान, निर्भीक, तेजस्वी, पराक्रमी एवं महत्वाकांक्षी। आलोचना के प्रति संवेदनशील; कर्तव्य में पूर्ण ईमानदार किंतु कभी-कभी अधीर व तीव्र स्वभाव।',
    workAndAmbitionEn: 'Thrives in engineering, defence, executive management, competitive sports, surgery, entrepreneurship, and high-stakes ventures requiring instant courage.',
    workAndAmbitionHi: 'तकनीकी, रक्षा, प्रशासनिक प्रबंधन, खेलकूद, शल्य-चिकित्सा एवं त्वरित साहसिक निर्णय वाले क्षेत्रों में अद्वितीय पराक्रम दिखाते हैं।',
    relationshipNatureEn: 'Protective and dedicated, but not overtly diplomatic or outwardly romantic. Direct in expression, valuing action over sentimental rhetoric.',
    relationshipNatureHi: 'सुरक्षात्मक और निष्ठावान, किंतु दिखावटी रोमांस से दूर। शब्दों की अपेक्षा ठोस आचरण व कर्म द्वारा अपने दायित्व निभाते हैं।',
    synthesisEn: 'Tuesday birth infuses the martial power of valor, pioneering spirit, and executive fortitude, modulated by Mars’s dignity and aspectual harmony.',
    synthesisHi: 'मंगलवार का जन्म भौमिक पराक्रम, निर्भयता, कार्य-तत्परता और प्रशासनिक इच्छाशक्ति का संचार करता है।'
  },
  Mercury: {
    id: 'Mercury',
    nameEn: 'Wednesday (Budhvar)',
    nameHi: 'बुधवार (सौम्यवार)',
    rulingPlanet: 'Mercury',
    rulingPlanetHi: 'बुध',
    psychologicalTraitsEn: 'Articulate, inquisitive, remarkably quick learner, adaptable, analytical, and deeply intellectual. Possesses an innate ability to think deeply and formulate lucid solutions.',
    psychologicalTraitsHi: 'वाक्पटु, जिज्ञासु, तीव्र ग्राही, परिस्थिति-अनुकूल, विश्लेषक एवं गहन बौद्धिक क्षमता से संपन्न। जटिल चुनौतियों का सहज और सटीक समाधान खोजने वाले।',
    workAndAmbitionEn: 'Outstanding in trade, finance, data analytics, writing, media, mathematics, legal advocacy, consulting, and negotiation.',
    workAndAmbitionHi: 'वाणिज्य, वित्तीय प्रबंधन, डेटा विश्लेषण, लेखन, संचार, गणित, विधिक परामर्श एवं कूटनीतिक वार्ताओं में शीर्ष सफलता पाते हैं।',
    relationshipNatureEn: 'Balanced, pragmatic, communicative, and accommodating. They do not burden relationships with unrealistic demands, ensuring peaceful domestic rhythm.',
    relationshipNatureHi: 'संतुलित, व्यावहारिक, संवाद-कुशल एवं समन्वयवादी। अवास्तविक अपेक्षाएं न रखकर संबंधों में सहज शांति और सौहार्द बनाए रखते हैं।',
    synthesisEn: 'Wednesday birth activates mercurial discrimination, linguistic mastery, financial dexterity, and astute commercial diplomacy.',
    synthesisHi: 'बुधवार का जन्म जातक को बुद्धिमत्ता, वाक्-माधुर्य, व्यापारिक कौशल और तीव्र तार्किक विवेक से अलंकृत करता है।'
  },
  Jupiter: {
    id: 'Jupiter',
    nameEn: 'Thursday (Guruvar)',
    nameHi: 'गुरुवार (बृहस्पतिवार)',
    rulingPlanet: 'Jupiter',
    rulingPlanetHi: 'गुरु / बृहस्पति',
    psychologicalTraitsEn: 'Jovial, magnanimous, optimistic, ethical, and profound advisors. Diligent workers who pursue noble goals, though prone to occasional introspective melancholy when ideals falter.',
    psychologicalTraitsHi: 'हंसमुख, उदार, आशावादी, नीतिवान एवं श्रेष्ठ मार्गदर्शक। उच्च आदर्शों के प्रति समर्पित, परिश्रमी किंतु कभी-कभी आदर्शों के खंडित होने पर अंतर्मुखी उदासी संभव।',
    workAndAmbitionEn: 'Excels in judicial leadership, education, corporate mentorship, institutional governance, philosophy, public ethics, and strategic policy-making.',
    workAndAmbitionHi: 'न्यायपालिका, उच्च शिक्षा, संस्थागत प्रबंधन, दर्शनशास्त्र, धार्मिक प्रतिष्ठान एवं रणनीतिक नीति-निर्धारण में सर्वोच्च सम्मान प्राप्त करते हैं।',
    relationshipNatureEn: 'Warm, generous, and devoted to pleasing their beloved. Must consciously attune to emotional subtleties to maintain domestic harmony.',
    relationshipNatureHi: 'उदारमना, आदरणीय एवं स्नेही। साथी के सूक्ष्म मनोभावों का आदर कर दांपत्य जीवन में मर्यादा और दीर्घकालिक सुख स्थापित करते हैं।',
    synthesisEn: 'Thursday birth brings divine grace, philosophical depth, institutional stature, and righteous prosperity.',
    synthesisHi: 'गुरुवार का जन्म दैवीय कृपा, ज्ञान-गरिमा, संस्थागत प्रतिष्ठा, परोपकार और धार्मिक समृद्धि का वरदान देता है।'
  },
  Venus: {
    id: 'Venus',
    nameEn: 'Friday (Shukravar)',
    nameHi: 'शुक्रवार (भृगुवार)',
    rulingPlanet: 'Venus',
    rulingPlanetHi: 'शुक्र',
    psychologicalTraitsEn: 'Generous, aesthetically refined, artistic, competitive, and culturally sophisticated. Highly emotional and sensitive, they thrive in beauty yet must safeguard against heartbreak.',
    psychologicalTraitsHi: 'उदार, सुरुचिपूर्ण, कलात्मक, सुरुचि-संपन्न एवं जीवन के आनंदों के प्रेमी। भावुक एवं संवेदनशील; सौंदर्य-प्रेमी होते हुए भी अत्यधिक विश्वास से बचाव आवश्यक है।',
    workAndAmbitionEn: 'Gains wealth easily through creative enterprises, design, entertainment, luxury merchandise, diplomacy, hospitality, and brand architecture.',
    workAndAmbitionHi: 'कलात्मक उपक्रम, डिजाइन, मनोरंजन, विलासिता सामग्री, कूटनीति, पर्यटन एवं सौंदर्य प्रसाधनों के व्यापार में प्रचुर लाभ कमाते हैं।',
    relationshipNatureEn: 'Deeply romantic, affectionate, and loyal, but occasionally over-reliant on external approval. Needs mature appraisal before committing.',
    relationshipNatureHi: 'अत्यंत रोमांटिक, स्नेही और समर्पित, किंतु दूसरों के विचारों पर अत्यधिक निर्भरता से बचकर विवेकपूर्वक संबंध चुनना चाहिए।',
    synthesisEn: 'Friday birth brings aesthetic brilliance, social magnetism, wealth creation abilities, and creative harmony.',
    synthesisHi: 'शुक्रवार का जन्म सौन्दर्य-बोध, सामाजिक आकर्षण, आर्थिक वैभव और कलात्मक प्रतिभा से संपन्न बनाता है।'
  },
  Saturn: {
    id: 'Saturn',
    nameEn: 'Saturday (Shanivar)',
    nameHi: 'शनिवार (मन्दवार)',
    rulingPlanet: 'Saturn',
    rulingPlanetHi: 'शनि',
    psychologicalTraitsEn: 'Serious, perfectionist, studious, responsible, practical, and disciplined. Upright, straightforward, and strict, with profound endurance and self-reliance.',
    psychologicalTraitsHi: 'गंभीर, पूर्णतावादी, अध्ययनशील, कर्तव्यनिष्ठ, व्यावहारिक और अनुशासित। सत्यनिष्ठ, स्पष्टवादी और दृढ़ संकल्पवान; असीम धैर्य और सहनशीलता के धनी।',
    workAndAmbitionEn: 'Supreme tenacity in heavy engineering, judiciary, land, mining, long-cycle enterprises, governance, research, and institutional foundations.',
    workAndAmbitionHi: 'भारी उद्योग, न्यायशास्त्र, भूमि, खनन, दीर्घकालिक उद्यम, शोध एवं संस्थागत निर्माण में अटूट निष्ठा से शीर्ष पद पाते हैं।',
    relationshipNatureEn: 'Reserved, cautious, and shy in emotional expression. Once committed, they are rock-solid, unwavering, and lifelong protectors.',
    relationshipNatureHi: 'भावनात्मक अभिव्यक्ति में संकोची और मितभाषी। किंतु एक बार संबंध बन जाने पर आजीवन अविचल, ईमानदार और संकटमोचक साथी सिद्ध होते हैं।',
    synthesisEn: 'Saturday birth anchors the native in karmic discipline, endurance, institutional authority, and late-blooming, unshakable success.',
    synthesisHi: 'शनिवार का जन्म जातक को धैर्य, अनुशासन, दीर्घजीवी सफलता और अडिग कर्तव्यनिष्ठा की नींव प्रदान करता है।'
  }
};

/* =========================================================================
   2. TITHI PROFILES (प्रतिपदा से पूर्णिमा / अमावस्या)
   ========================================================================= */
export const CLASSICAL_TITHI_PROFILES: Record<number, TithiProfile> = {
  1: {
    number: 1,
    nameEn: 'Pratipada (Padyami)',
    nameHi: 'प्रतिपदा (पड़वा)',
    category: 'Nanda',
    categoryHi: 'नंदा',
    categorySignificanceEn: 'Joy, happiness, and auspicious beginnings. Natives are blessed with vitality, gentle magnetism, and executive drive.',
    categorySignificanceHi: 'आनंद, सुख और मांगलिक कार्यों की शुभता। जातक सौम्य आकर्षण, जीवनशक्ति और नेतृत्व से संपन्न होते हैं।',
    presidingDeityEn: 'Agni Deva & Lord Brahma',
    presidingDeityHi: 'अग्नि देव एवं ब्रह्मा जी',
    governingNityaDeviEn: 'Kameshwari Nitya Devi',
    governingNityaDeviHi: 'कामेश्वरी नित्या देवी',
    nityaDeviMantra: 'Aim Hreem Shreem Am Aim Sa Ka La Hreem Nityaklinne Madadrave Sauh Am Kameshvari Nitya Shri Padukam Pujayami Tarpayami Namah',
    classicalResultEn: 'Educated, wise, blessed with a large and supportive family, dignified demeanor, fond of ornaments, royal favor, and prominent facial charisma.',
    classicalResultHi: 'सुशिक्षित, ज्ञानी, विशाल परिवार से युक्त, स्वर्ण-आभूषणों के प्रेमी, सौम्य व्यवहार, शासन व उच्चाधिकारियों के कृपापात्र एवं आकर्षक व्यक्तित्व।',
    propitiousWorkEn: 'Religious rituals, house construction, real estate transactions, journeys, promotions, and starting new foundations.',
    propitiousWorkHi: 'धार्मिक अनुष्ठान, गृह-निर्माण, भूमि क्रय-विक्रय, यात्रा, पदभार ग्रहण एवं मांगलिक नींव रखना।',
    avoidWorkEn: 'Avoid vital marriage ceremonies during Shukla Pratipada due to nascent lunar digit.',
    avoidWorkHi: 'शुक्ल प्रतिपदा में क्षीण चंद्र होने के कारण विवाह व गृहप्रवेश जैसे बड़े मांगलिक कार्यों में मुहूर्त शुद्धि आवश्यक है।'
  },
  2: {
    number: 2,
    nameEn: 'Dvitiya (Dwithiya)',
    nameHi: 'द्वितीया (दूज)',
    category: 'Bhadra',
    categoryHi: 'भद्रा',
    categorySignificanceEn: 'Enthusiasm, administrative intellect, firm decisions, and fruitful beginnings for commercial and civic enterprises.',
    categorySignificanceHi: 'उत्साह, प्रशासनिक बुद्धि, दृढ़ निर्णय क्षमता और नवीन उपक्रमों के लिए कल्याणकारी ऊर्जा।',
    presidingDeityEn: 'Lord Brahma & Ashwini Kumaras (Vidhata)',
    presidingDeityHi: 'विधाता (ब्रह्मा) एवं अश्विनी कुमार',
    governingNityaDeviEn: 'Bhagamalini Nitya Devi',
    governingNityaDeviHi: 'भगमालिनी नित्या देवी',
    nityaDeviMantra: 'Sarvabhagavashankari Bhagarupe Nityaklinne Bhagasvaroope Bhagamalini Nitya Shri Padukam Pujayami Tarpayami Namah',
    classicalResultEn: 'Benevolent donors, gentlemanly, highly wise and astute, possessing keen business instincts, strong communicative dominance, and steady wealth.',
    classicalResultHi: 'दानवीर, परोपकारी, भद्र स्वभाव, अत्यंत बुद्धिमान, व्यापारिक मामलों में दक्ष, प्रभावकारी वाणी और निरंतर संचित धन के स्वामी।',
    propitiousWorkEn: 'Music education, foundation laying for commercial/residential projects, joining new profession, Vastu karma, and sacred investments.',
    propitiousWorkHi: 'संगीत व विद्या आरंभ, व्यावसायिक व आवासीय नींव, नवीन कार्यभार ग्रहण, वास्तु कर्म एवं मांगलिक प्रतिष्ठा।',
    avoidWorkEn: 'Oil massage and harsh physical abuse of body on this tithi.',
    avoidWorkHi: 'तैल मर्दन एवं शरीर के प्रति अहितकर कठोर उपक्रम वर्जित हैं।'
  },
  3: {
    number: 3,
    nameEn: 'Tritiya (Trithiya)',
    nameHi: 'तृतीया (तीज)',
    category: 'Jaya',
    categoryHi: 'जया',
    categorySignificanceEn: 'Victory, resolute courage, competitive conquest, and triumphant breakthrough in all challenging endeavors.',
    categorySignificanceHi: 'विजय, अदम्य साहस, प्रतिस्पर्धा में सफलता और कठिन बाधाओं को परास्त करने का शौर्य।',
    presidingDeityEn: 'Lord Vishnu & Mata Gauri (Parshurama Janma Tithi)',
    presidingDeityHi: 'भगवान विष्णु एवं माता गौरी (परशुराम जन्म तिथि)',
    governingNityaDeviEn: 'Nityaklinna Nitya Devi',
    governingNityaDeviHi: 'नित्यक्लिन्ना नित्या देवी',
    nityaDeviMantra: 'Aim Hreem Shreem Nityaklinne Madadrave Svaha Im Nityaklinna Nitya Shri Padukam Pujayami Tarpayami Namah',
    classicalResultEn: 'Brave, dynamic, victorious, active, undeterred by adversity, possessing artistic talents, firm leadership, and expansive renown.',
    classicalResultHi: 'शूरवीर, सक्रिय, सर्वत्र विजयी, विपत्तियों से निर्भय, शिल्पकला व संगीत प्रेमी, दृढ़ नेतृत्व और कीर्तिवान।',
    propitiousWorkEn: 'Commercial launch, marriage ceremonies, sculpture, shifting homes, journeys, and personal grooming rituals.',
    propitiousWorkHi: 'व्यापार शुभारंभ, विवाह, शिल्प-कला, नूतन गृह प्रवेश, यात्रा एवं शारीरिक संस्कार।',
    avoidWorkEn: 'Passive surrender or uncalculated lethargy during active conflicts.',
    avoidWorkHi: 'आलस्य और अनिर्णय की स्थिति से बचें; यह कर्मठता की तिथि है।'
  },
  4: {
    number: 4,
    nameEn: 'Chaturthi (Chauth)',
    nameHi: 'चतुर्थी (चौथ)',
    category: 'Rikta',
    categoryHi: 'रिक्ता',
    categorySignificanceEn: 'Elimination of obstacles, strategic warfare, clearing debts, fire rituals, and destruction of negative encumbrances.',
    categorySignificanceHi: 'बाधा-निवारण, कड़े कदम, ऋण-मुक्ति, अग्नि कर्म और नकारात्मक शक्तियों का उन्मूलन।',
    presidingDeityEn: 'Lord Ganesha & Dharmaraja Yama',
    presidingDeityHi: 'भगवान श्री गणेश एवं यमराज',
    governingNityaDeviEn: 'Bherunda Nitya Devi',
    governingNityaDeviHi: 'भेरुण्डा नित्या देवी',
    nityaDeviMantra: 'Cchraum Jraum Svaha Eem Bherunda Nitya Shri Padukam Pujayami Tarpayami Namah',
    classicalResultEn: 'Extraordinary mental sharp-sightedness, ability to triumph over formidable opposition, secretive strategy, yet vulnerable to inner unrest if unfocused.',
    classicalResultHi: 'असाधारण मानसिक तीक्ष्णता, गुप्त रणनीति, विरोधियों पर विजय पाने में कुशल, किंतु अनियंत्रित होने पर मानसिक उद्वेग संभव।',
    propitiousWorkEn: 'Removal of obstacles, Ganesha worship, fire rituals, demolition of old ruins, competitive litigation, and technical research.',
    propitiousWorkHi: 'विघ्न-विनाशक गणेश साधना, अग्नि कर्म, पुराने ढांचों का परिशोधन, विधिक विजय और तकनीकी अनुसंधान।',
    avoidWorkEn: 'New gentle beginnings, marriage, and long travels without Ganesh invocation.',
    avoidWorkHi: 'सौम्य मांगलिक कार्य, विवाह एवं बिना विघ्नहर्ता पूजन के लंबी यात्राएं वर्जित हैं।'
  },
  5: {
    number: 5,
    nameEn: 'Panchami',
    nameHi: 'पंचमी',
    category: 'Poorna',
    categoryHi: 'पूर्णा',
    categorySignificanceEn: 'Wholeness, flourishing prosperity, artistic refinement, healing, and expansive auspiciousness in all undertakings.',
    categorySignificanceHi: 'पूर्णता, समृद्धि, कलात्मक सुरुचि, आरोग्य लाभ और सर्वतोमुखी मांगलिक संपन्नता।',
    presidingDeityEn: 'Goddess Saraswati, Lord Moon & The Sacred Nagas',
    presidingDeityHi: 'माँ सरस्वती, चंद्र देव एवं नाग देवगण',
    governingNityaDeviEn: 'Vahnivasini Nitya Devi',
    governingNityaDeviHi: 'वह्निवासिनी नित्या देवी',
    nityaDeviMantra: 'Aim Hreem Shreem Om Vahnivasini Nitya Shri Padukam Pujayami Tarpayami Namah',
    classicalResultEn: 'Pleasure-loving, aesthetic connoisseur, gifted in fine arts, compassionate, blessed with medical or healing talent, and accumulating sustained wealth.',
    classicalResultHi: 'कला व सौंदर्य प्रेमी, उत्तम रसज्ञ, परोपकारी, औषधीय व आरोग्य विज्ञान के जानकार और दीर्घकालिक धन-धान्य से संपन्न।',
    propitiousWorkEn: 'Administering medicine, healing surgeries, educational initiation, marriages, business partnerships, and spiritual initiations.',
    propitiousWorkHi: 'औषध सेवन, शल्य-चिकित्सा, विद्यारंभ, विवाह, व्यापारिक अनुबंध एवं आध्यात्मिक दीक्षा।',
    avoidWorkEn: 'Lending money on credit without security as financial returns may get delayed.',
    avoidWorkHi: 'बिना प्रतिभूति के ऋण देना वर्जित है, क्योंकि धन की वापसी में विलंब हो सकता है।'
  },
  6: {
    number: 6,
    nameEn: 'Shashti (Chhath)',
    nameHi: 'षष्ठी (छठ)',
    category: 'Nanda',
    categoryHi: 'नंदा',
    categorySignificanceEn: 'Abundant happiness, regal valor, youthfulness, and auspicious civic celebrations.',
    categorySignificanceHi: 'प्रचुर आनंद, शौर्य, युवावस्था की ऊर्जा और मांगलिक सामाजिक उत्सव।',
    presidingDeityEn: 'Lord Kartikeya (Skanda) & Agni Deva',
    presidingDeityHi: 'भगवान कार्तिकेय (स्कंद) एवं अग्नि देव',
    governingNityaDeviEn: 'Mahavajreshwari Nitya Devi',
    governingNityaDeviHi: 'महावज्रेश्वरी नित्या देवी',
    nityaDeviMantra: 'Aim Hreem Shreem Um Mahavajreshvari Nitya Shree Padukam Poojayami Tharpayami Namah',
    classicalResultEn: 'Polite, sweet-spoken, diplomatic, fond of travel, brave, holding an honorable public standing, though sensitive to abdominal or digestive health.',
    classicalResultHi: 'मधुरभाषी, शिष्टाचारी, यात्रा-प्रेमी, साहसी, लोक-सम्मानित, यद्यपि उदर व पाचन स्वास्थ्य के प्रति जागरूक रहना आवश्यक है।',
    propitiousWorkEn: 'Investiture ceremonies, construction, real estate development, Vastu karma, moving to new residence, and wearing new jewels.',
    propitiousWorkHi: 'अधिकार-ग्रहण, भवन निर्माण, रियल एस्टेट, वास्तु पूजन, नूतन गृह वास एवं रत्नाभूषण धारण।',
    avoidWorkEn: 'Marriages, deep body oil massage therapies, and intricate woodwork.',
    avoidWorkHi: 'विवाह संस्कार, तैल मालिश एवं काष्ठ कर्म (लकड़ी का मुख्य कार्य) से बचना चाहिए।'
  },
  7: {
    number: 7,
    nameEn: 'Saptami',
    nameHi: 'सप्तमी',
    category: 'Bhadra',
    categoryHi: 'भद्रा',
    categorySignificanceEn: 'Majesty, solar radiance, administrative dignity, and clear spiritual intellect.',
    categorySignificanceHi: 'प्रताप, सूर्य का तेज, प्रशासनिक गरिमा और निर्मल आत्मिक विवेक।',
    presidingDeityEn: 'Lord Surya Deva & Lord Indra',
    presidingDeityHi: 'भगवान सूर्य देव एवं इंद्र देव',
    governingNityaDeviEn: 'Shivadoothi Nitya Devi',
    governingNityaDeviHi: 'शिवदूती नित्या देवी',
    nityaDeviMantra: 'Aim Hreem Shreem Arum Shivadoothi Nitya Shri Padukam Pujayami Tarpayami Namah',
    classicalResultEn: 'Proficient in learning, serious philosopher, religious, dignified orator, blessed with health, authoritative stature, and respected by kings and states.',
    classicalResultHi: 'विद्या-विशारद, गंभीर चिंतक, धर्मपरायण, ओजस्वी वक्ता, उत्तम स्वास्थ्य और शासन-सत्ता में प्रतिष्ठित।',
    propitiousWorkEn: 'Weddings, purchasing transport vehicles, Grihapravesha, Upanayana, Vastu, public debates, and fitness milestones.',
    propitiousWorkHi: 'विवाह, वाहन क्रय, गृहप्रवेश, उपनयन, वास्तु कर्म, बौद्धिक विमर्श एवं शारीरिक व्यायाम का प्रारंभ।',
    avoidWorkEn: 'Consuming blue-colored food or insulting mentors and solar figures.',
    avoidWorkHi: 'नील वर्ण के तामसिक आहार एवं पितृ-गुरुजनों की अवमानना से बचें।'
  },
  8: {
    number: 8,
    nameEn: 'Ashtami',
    nameHi: 'अष्टमी',
    category: 'Jaya',
    categoryHi: 'जया',
    categorySignificanceEn: 'Divine protection, victory over dark forces, perseverance, and profound esoteric wisdom.',
    categorySignificanceHi: 'दैवीय रक्षा, आसुरी शक्तियों पर विजय, अडिग धैर्य और गूढ़ आध्यात्मिक ज्ञान।',
    presidingDeityEn: 'Mata Durga & The Ashta Vasus (Sri Krishna Janma Tithi)',
    presidingDeityHi: 'माँ दुर्गा एवं अष्ट वसु (श्री कृष्ण जन्म तिथि)',
    governingNityaDeviEn: 'Twaritha Nitya Devi',
    governingNityaDeviHi: 'त्वरिता नित्या देवी',
    nityaDeviMantra: 'Aim Hreem Shreem Twaritha Nitya Shri Padukam Pujayami Tarpayami Namah',
    classicalResultEn: 'Drawn to occult, mantra, and deep research; exceptionally clever, strategic, mentally unshakeable in adversity, and achieving renown in crisis management.',
    classicalResultHi: 'गूढ़ विधाओं, मंत्र-शास्त्र और गहन शोध में रुचि; असाधारण चतुर, रणनीतिकार, संकट में अविचल और आपदा प्रबंधन में कुशल।',
    propitiousWorkEn: 'Fortification, defense, architecture, dance, sports, arts study, starting enterprises, and craftsmanship in gems.',
    propitiousWorkHi: 'सुरक्षा व्यवस्था, रक्षा कर्म, स्थापत्य कला, नृत्य-संगीत, उद्यम आरंभ एवं रत्न-आभूषण निर्माण।',
    avoidWorkEn: 'Undertaking non-essential long journeys without protective kavacha.',
    avoidWorkHi: 'अनावश्यक लंबी यात्राएं बिना रक्षा-कवच के आरंभ करने से बचना चाहिए।'
  },
  9: {
    number: 9,
    nameEn: 'Navami',
    nameHi: 'नवमी',
    category: 'Rikta',
    categoryHi: 'रिक्ता',
    categorySignificanceEn: 'Decisive warfare, vanquishing evil, valorous protection of dharma, and rigorous discipline.',
    categorySignificanceHi: 'धर्म-रक्षा, अधर्म का संहार, शूरवीरता और कठोर अनुशासन का संपादन।',
    presidingDeityEn: 'Mata Dandini (Chamunda), Lord Rama & Sacred Serpents',
    presidingDeityHi: 'माँ दंडिनी (चामुंडा), भगवान श्री राम एवं नाग देव',
    governingNityaDeviEn: 'Kulasundari Nitya Devi',
    governingNityaDeviHi: 'कुलसुन्दरी नित्या देवी',
    nityaDeviMantra: 'Aim Hreem Shreem Alum Kulasundari Nitya Shri Padukam Pujayami Tarpayami Namah',
    classicalResultEn: 'Self-sacrificing, strongly religious, charitable, righteous, courageous in fighting injustice, though occasionally rigid in opinions.',
    classicalResultHi: 'त्यागी, परम धार्मिक, दानवीर, अन्याय के विरुद्ध निर्भीक योद्धा, यद्यपि विचारों में कभी-कभी हठधर्मिता संभव।',
    propitiousWorkEn: 'Competitions, debates, physical athletic feats, eradication of malice, construction of protective instruments, and rigorous training.',
    propitiousWorkHi: 'प्रतिस्पर्धा, वाद-विवाद, शारीरिक साधना, दुर्जनों का दमन, सुरक्षा उपकरणों का निर्माण एवं कठोर अभ्यास।',
    avoidWorkEn: 'Peace treaties, soft domestic purchases, and gentle commercial launches.',
    avoidWorkHi: 'कोमल मांगलिक कार्य, व्यापारिक साझेदारी एवं शांति-समझौते इस तिथि में टालने चाहिए।'
  },
  10: {
    number: 10,
    nameEn: 'Dashami',
    nameHi: 'दशमी',
    category: 'Poorna',
    categoryHi: 'पूर्णा',
    categorySignificanceEn: 'Universal fulfilment, institutional balance, righteousness, and mastery over all ten directions.',
    categorySignificanceHi: 'सर्वतोमुखी पूर्णता, संस्थागत संतुलन, धर्म-पालन और दसों दिशाओं पर विजय।',
    presidingDeityEn: 'Dharmaraja (Yama) & The Ashta Dikpalakas',
    presidingDeityHi: 'धर्मराज (यम) एवं अष्ट दिक्पाल',
    governingNityaDeviEn: 'Nitya Nitya Devi',
    governingNityaDeviHi: 'नित्या नित्या देवी',
    nityaDeviMantra: 'Aim Hreem Shreem Nitya Nitya Shri Padukam Pujayami Tarpayami Namah',
    classicalResultEn: 'Fair, just, interested in sacred rituals, respected arbiter in family and civic society, accumulating wealth, and revered for balance.',
    classicalResultHi: 'न्यायप्रिय, निष्पक्ष, यज्ञ-अनुष्ठान प्रेमी, परिवार व समाज में मध्यस्थ की भूमिका निभाने वाले तथा स्थिर वैभव के स्वामी।',
    propitiousWorkEn: 'Completion of major work, government affairs, marriage, music, purchasing garments, vehicles, jewellery, Grihapravesha, and charity.',
    propitiousWorkHi: 'महत्वपूर्ण कार्यों की पूर्णता, राजकीय कार्य, विवाह, संगीत, वस्त्र-वाहन-रत्न क्रय, गृहप्रवेश एवं महादान।',
    avoidWorkEn: 'Unethical shortcuts or violating civic contracts.',
    avoidWorkHi: 'अनैतिक समझौते व नियमों का उल्लंघन करने से इस तिथि में पूर्ण परहेज़ रखें।'
  },
  11: {
    number: 11,
    nameEn: 'Ekadashi',
    nameHi: 'एकादशी',
    category: 'Nanda',
    categoryHi: 'नंदा',
    categorySignificanceEn: 'Supreme spiritual merit, mental purification, divine ecstasy, and freedom from karmic bondage.',
    categorySignificanceHi: 'सर्वश्रेष्ठ आध्यात्मिक पुण्य, मन का शोधन, भगवद्-भक्ति और कर्म-बंधनों से मुक्ति।',
    presidingDeityEn: 'Lord Vishnu, Rudra & Lord Kubera (God of Wealth)',
    presidingDeityHi: 'भगवान श्री हरि विष्णु, रुद्र एवं कुबेर देव',
    governingNityaDeviEn: 'Neelapathaka Nitya Devi',
    governingNityaDeviHi: 'नीलपताका नित्या देवी',
    nityaDeviMantra: 'Krom Aam Klim Aim Bloom Nityamadadravey Hum Phrem Hreem Em Neelapathaka Nitya Shri Padukam Pujayami Tarpayami Namah',
    classicalResultEn: 'Inclined toward sacred vows, fasting, and spiritual liberation; disciplined, generous, pure-hearted, respected by scholars, and blessed with divine abundance.',
    classicalResultHi: 'व्रत-नियम एवं मोक्ष-मार्गी; संयमी, उदार, निर्मल अंतःकरण, विद्वानों में आदरणीय और कुबेर-समान समृद्धि के पात्र।',
    propitiousWorkEn: 'Fasting, worship, weddings, pilgrimages, festivities, journeys, sacred debates, Vastu rituals, and charitable foundations.',
    propitiousWorkHi: 'उपासना, व्रत, विवाह, तीर्थयात्रा, उत्सव, यात्रा, शास्त्र-चर्चा, वास्तु एवं लोकोपकारी कार्य।',
    avoidWorkEn: 'Consuming grains/rice during sacred vows, dishonesty, and anger.',
    avoidWorkHi: 'अन्न (विशेषकर चावल) का त्याग, असत्य भाषण और क्रोध से पूर्णतः बचना चाहिए।'
  },
  12: {
    number: 12,
    nameEn: 'Dvadashi',
    nameHi: 'द्वादशी',
    category: 'Bhadra',
    categoryHi: 'भद्रा',
    categorySignificanceEn: 'Generous sustenance, practical accomplishment, civic nourishment, and divine preservation.',
    categorySignificanceHi: 'पोषण, व्यावहारिक सफलता, जन-कल्याण और श्रीहरि का संरक्षण।',
    presidingDeityEn: 'Lord Vishnu (Vamana Avatar) & Aditya (Surya Deva)',
    presidingDeityHi: 'भगवान वामन (श्री विष्णु) एवं आदित्य (सूर्य देव)',
    governingNityaDeviEn: 'Vijaya Nitya Devi',
    governingNityaDeviHi: 'विजया नित्या देवी',
    nityaDeviMantra: 'Aim Hreem Shreem Vijaya Nitya Shree Paadukaam Poojayami Tharpayami Namah',
    classicalResultEn: 'Frequent traveler, astute commercial intellect, pragmatic, successful in enterprise, though subject to occasional physical fatigue needing steady rest.',
    classicalResultHi: 'देश-विदेश भ्रमणकारी, प्रखर व्यापारिक मेधा, व्यावहारिक, कार्यों में सफल, यद्यपि शारीरिक थकान से बचने हेतु संतुलित विश्राम आवश्यक।',
    propitiousWorkEn: 'Commencing new activities, religious functions, fulfilling vows, lighting sacred fires, buying vehicles, infrastructure and new homes.',
    propitiousWorkHi: 'नवीन कार्य आरंभ, धार्मिक उत्सव, व्रत-उद्यापन, यज्ञ-हवन, वाहन व गृह-निर्माण का आरंभ।',
    avoidWorkEn: 'Oil baths and neglect of dietary discipline on this day.',
    avoidWorkHi: 'तैल स्नान एवं भोजन में अनियमिता से बचना चाहिए।'
  },
  13: {
    number: 13,
    nameEn: 'Trayodashi',
    nameHi: 'त्रयोदशी',
    category: 'Jaya',
    categoryHi: 'जया',
    categorySignificanceEn: 'Pradosha grace, victory of love over darkness, fulfillment of sacred vows, and victory over health challenges.',
    categorySignificanceHi: 'प्रदोष काल की शिव-कृपा, प्रेम व सौंदर्य की विजय, संकटनाशन और दीर्घायु का वरदान।',
    presidingDeityEn: 'Lord Kamadeva & Pradosha Shiva (Dharma)',
    presidingDeityHi: 'कामदेव एवं प्रदोष शिव (धर्म)',
    governingNityaDeviEn: 'Sarvamangala Nitya Devi',
    governingNityaDeviHi: 'सर्वमंगला नित्या देवी',
    nityaDeviMantra: 'Aim Hreem Shreem Sarvamangala Nitya Shree Paadukaam Poojayami Tharpayaami Namaha',
    classicalResultEn: 'Iron resolve, deeply charitable, skilled in ceremonies and aesthetic arts, steadfastly committed to long-term goals, and enjoying enduring marital happiness.',
    classicalResultHi: 'दृढ़ संकल्पी, अत्यंत दानी, धार्मिक व कलात्मक कार्यों में निष्णात, दीर्घकालिक लक्ष्यों के प्रति समर्पित और दांपत्य सुख से युक्त।',
    propitiousWorkEn: 'Pradosha Shiva worship, business launch, architecture, music education, wearing new apparel, and fulfilling noble promises.',
    propitiousWorkHi: 'प्रदोष शिव-पूजा, नूतन व्यापार, स्थापत्य, संगीत शिक्षा, नूतन वस्त्राभूषण धारण एवं संकल्प पूर्ति।',
    avoidWorkEn: 'Long travels and Yagyopaveeta during Shukla Trayodashi without proper planetary checking.',
    avoidWorkHi: 'शुक्ल त्रयोदशी में बिना आवश्यक ग्रह-शुद्धि के दूर-देश यात्रा व यज्ञोपवीत टालना चाहिए।'
  },
  14: {
    number: 14,
    nameEn: 'Chaturdashi',
    nameHi: 'चतुर्दशी',
    category: 'Rikta',
    categoryHi: 'रिक्ता',
    categorySignificanceEn: 'Transcendent power, dissolution of ego, deep spiritual sadhana, and destruction of mortality fear.',
    categorySignificanceHi: 'अहंकार का शमन, गहन आध्यात्मिक साधना, संहारक संकटों का नाश और काल-भय से मुक्ति।',
    presidingDeityEn: 'Lord Shiva, Lord Narasimha & Mata Kali',
    presidingDeityHi: 'भगवान शिव, भगवान नृसिंह एवं माँ काली',
    governingNityaDeviEn: 'Jwalamalini Nitya Devi',
    governingNityaDeviHi: 'ज्वालामालिनी नित्या देवी',
    nityaDeviMantra: 'Aim Hreem Shreem Om Namo Bhagavatyai Jvalamalini Duti Devi Jvalamalini Nithya Sreepaadukaam Poojayami Tharpayami Namaha',
    classicalResultEn: 'Extraordinary courage, fearlessness in battle, commanding intellect, yet prone to profound mental churning and spiritual crisis that ultimately elevates them.',
    classicalResultHi: 'असाधारण शौर्य, युद्ध व संकट में निर्भयता, ओजस्वी बुद्धि, यद्यपि जीवन में गहरे मानसिक मंथन से गुजरकर ही परम उत्कर्ष प्राप्त करते हैं।',
    propitiousWorkEn: 'Shiva worship, Kali sadhana, reading scriptures, routine maintenance, research into difficult sciences, and removing deep karmic blocks.',
    propitiousWorkHi: 'शिवोपासना, काली साधना, शास्त्र अध्ययन, दैनिक नियमित कार्य, गूढ़ विज्ञान शोध एवं कर्म-दोष निवारण।',
    avoidWorkEn: 'Haircutting, manicure, gentle commercial ribbon-cuttings, and peaceful ceremonies.',
    avoidWorkHi: 'क्षौरकर्म (बाल-नाखून काटना), मांगलिक उत्सव एवं सौम्य व्यापारिक शुभारंभ वर्जित हैं।'
  },
  15: {
    number: 15,
    nameEn: 'Purnima / Amavasya',
    nameHi: 'पूर्णिमा / अमावस्या',
    category: 'Poorna',
    categoryHi: 'पूर्णा',
    categorySignificanceEn: 'Supreme culmination. Purnima represents full illumination, wealth, and creativity; Amavasya represents inward reflection, ancestral grace, and profound spiritual grounding.',
    categorySignificanceHi: 'परम पूर्णता। पूर्णिमा प्रकाश, वैभव व कला का प्रतीक है; अमावस्या अंतर्मुखी आत्मचिंतन, पितृ-कृपा और गूढ़ साधना का आधार है।',
    presidingDeityEn: 'Vishwadevas, Chandra Deva (Purnima) / Pitrus & Lord Shani (Amavasya)',
    presidingDeityHi: 'विश्वेदेव, चंद्र देव (पूर्णिमा) / पितृगण एवं शनि देव (अमावस्या)',
    governingNityaDeviEn: 'Shodashi / Maha Nitya (Purnima) | Chitra Nitya Devi (Amavasya)',
    governingNityaDeviHi: 'षोडशी / महानित्या (पूर्णिमा) | चित्रा नित्या देवी (अमावस्या)',
    nityaDeviMantra: 'Aim Hreem Shreem Aham Ka E I La Hreem Ha Sa Ka Ha La Hreem Sa Ka La Hreem Aham Shodasee Mahaa Nithya Sreepaadukaam Poojayami Tharpayami Namaha',
    classicalResultEn: 'Purnima natives are emotional, wealthy, artistic, intelligent, and socially celebrated. Amavasya natives are profound, contemplative, serious, dedicated to ancestral duty, and capable of heroic inner ascent.',
    classicalResultHi: 'पूर्णिमा जातक भावुक, धनवान, कलाप्रिय, मेधावी एवं जनप्रिय होते हैं। अमावस्या जातक गंभीर, रहस्यदर्शी, पितृ-भक्त, अंतर्मुखी और साधना द्वारा असाधारण आत्म-बल पाने वाले होते हैं।',
    propitiousWorkEn: 'Purnima: Completing key commercial projects, construction, spiritual rituals, fine arts. Amavasya: Pitru tarpana, charity, silent meditation, and soul purification.',
    propitiousWorkHi: 'पूर्णिमा: कार्य की पूर्णता, वास्तु, प्रतिष्ठा, आभूषण निर्माण व साधना। अमावस्या: पितृ-तर्पण, दान, मौन साधना एवं आत्म-शोधन।',
    avoidWorkEn: 'Amavasya is inauspicious for worldly material expansions; Purnima requires balance against emotional over-excitement.',
    avoidWorkHi: 'अमावस्या में भौतिक भोग-विलास के नए उपक्रम वर्जित हैं; पूर्णिमा में अत्यधिक भावुक निर्णयों से बचना चाहिए।'
  }
};

/* =========================================================================
   3. TITHI-VARA COMBINATION YOGAS (शुभाशुभ योग)
   ========================================================================= */
export function getTithiVaraYoga(tithiNumber: number, weekdayId: string): {
  isAuspicious: boolean;
  combinationTitleEn: string;
  combinationTitleHi: string;
  detailsEn: string;
  detailsHi: string;
  alertType?: 'Daghda' | 'Visha' | 'Hutashan';
} {
  // Normalize tithi to 1-15 scale
  const tNum = ((tithiNumber - 1) % 15) + 1;
  const isNanda = tNum === 1 || tNum === 6 || tNum === 11;
  const isBhadra = tNum === 2 || tNum === 7 || tNum === 12;
  const isJaya = tNum === 3 || tNum === 8 || tNum === 13;
  const isRikta = tNum === 4 || tNum === 9 || tNum === 14;
  const isPoorna = tNum === 5 || tNum === 10 || tNum === 15;

  // Auspicious combinations
  if (isNanda && weekdayId === 'Venus') {
    return {
      isAuspicious: true,
      combinationTitleEn: 'Nanda on Friday (Siddhi Yoga)',
      combinationTitleHi: 'शुक्रवार को नंदा तिथि (सिद्धि योग)',
      detailsEn: 'Highly auspicious combination conferring supreme success and flourishing fruits for all auspicious undertakings.',
      detailsHi: 'अत्यंत शुभ संयोग जो सभी मांगलिक और नवीन कार्यों में निर्बाध सफलता व समृद्धि प्रदान करता है।'
    };
  }
  if (isBhadra && weekdayId === 'Mercury') {
    return {
      isAuspicious: true,
      combinationTitleEn: 'Bhadra on Wednesday (Siddhi Yoga)',
      combinationTitleHi: 'बुधवार को भद्रा तिथि (सिद्धि योग)',
      detailsEn: 'Promotes sharp intellect, smooth commercial negotiations, and auspicious foundations.',
      detailsHi: 'बुद्धि, व्यापारिक समझौते और नवीन दायित्वों के शुभारंभ के लिए अत्यंत कल्याणकारी योग।'
    };
  }
  if (isJaya && weekdayId === 'Mars') {
    return {
      isAuspicious: true,
      combinationTitleEn: 'Jaya on Tuesday (Jaya-Siddhi Yoga)',
      combinationTitleHi: 'मंगलवार को जया तिथि (जय-सिद्धि योग)',
      detailsEn: 'Bestows invincible courage, competitive triumph, and conquest over difficult obstacles.',
      detailsHi: 'अजेय साहस, प्रतिस्पर्धा में अभूतपूर्व विजय और कठिन बाधाओं के नाश का वरदान।'
    };
  }
  if (isRikta && weekdayId === 'Saturn') {
    return {
      isAuspicious: true,
      combinationTitleEn: 'Rikta on Saturday (Rikta-Siddhi Yoga)',
      combinationTitleHi: 'शनिवार को रिक्ता तिथि (रिक्ता-सिद्धि योग)',
      detailsEn: 'Neutralizes typical Rikta negativity, empowering technical conquest, defensive works, and debt elimination.',
      detailsHi: 'रिक्ता के सामान्य दोषों को दूर कर तकनीकी कर्म, रक्षा कार्य और ऋण-मुक्ति में सिद्धि प्रदान करता है।'
    };
  }
  if (isPoorna && weekdayId === 'Jupiter') {
    return {
      isAuspicious: true,
      combinationTitleEn: 'Poorna on Thursday (Amrita Siddhi Yoga)',
      combinationTitleHi: 'गुरुवार को पूर्णा तिथि (अमृत सिद्धि योग)',
      detailsEn: 'Supreme classical blessing conferring divine protection, material prosperity, and spiritual fulfillment.',
      detailsHi: 'परम शुभ संयोग जो जातक को ईश्वरीय कृपा, अखंड समृद्धि और सर्वतोमुखी कार्यसिद्धि देता है।'
    };
  }

  // Inauspicious checks: Daghda, Visha, Hutashan
  const daghdaMap: Record<string, number> = { Sun: 12, Moon: 11, Mars: 5, Mercury: 3, Jupiter: 6, Venus: 8, Saturn: 9 };
  const vishaMap: Record<string, number> = { Sun: 4, Moon: 6, Mars: 7, Mercury: 2, Jupiter: 8, Venus: 9, Saturn: 7 };
  const hutashanMap: Record<string, number> = { Sun: 12, Moon: 6, Mars: 7, Mercury: 8, Jupiter: 9, Venus: 10, Saturn: 11 };

  if (daghdaMap[weekdayId] === tNum) {
    return {
      isAuspicious: false,
      alertType: 'Daghda',
      combinationTitleEn: 'Daghda Tithi Combination',
      combinationTitleHi: 'दग्ध तिथि योग (सावधानी संकेत)',
      detailsEn: 'Classical caution: Daghda tithi combination indicates possible friction or delays in hasty new projects; requires thorough planning and prayer.',
      detailsHi: 'शास्त्रीय चेतावनी: दग्ध तिथि योग उतावलेपन में किए गए कार्यों में व्यवधान या विलंब का संकेत देता है; धैर्य व आराधना से संतुलन बनाएं।'
    };
  }
  if (vishaMap[weekdayId] === tNum) {
    return {
      isAuspicious: false,
      alertType: 'Visha',
      combinationTitleEn: 'Visha Tithi Combination',
      combinationTitleHi: 'विष तिथि योग (सावधानी संकेत)',
      detailsEn: 'Classical caution: Visha tithi combination warns against toxic contracts or impulsive trust; advises vigilant circumspection.',
      detailsHi: 'शास्त्रीय चेतावनी: विष तिथि योग अंधविश्वास और बिना जांचे अनुबंधों से बचने तथा सतर्क रहने का परामर्श देता है।'
    };
  }
  if (hutashanMap[weekdayId] === tNum) {
    return {
      isAuspicious: false,
      alertType: 'Hutashan',
      combinationTitleEn: 'Hutashan Tithi Combination',
      combinationTitleHi: 'हुताशन तिथि योग (सावधानी संकेत)',
      detailsEn: 'Classical caution: Hutashan tithi combination signifies fiery turbulence; avoid anger and haste in pivotal life decisions.',
      detailsHi: 'शास्त्रीय चेतावनी: हुताशन तिथि योग उग्रता का संकेत है; महत्वपूर्ण निर्णयों में क्रोध व जल्दबाजी से बचें।'
    };
  }

  return {
    isAuspicious: true,
    combinationTitleEn: 'Standard Harmonious Conjunction',
    combinationTitleHi: 'सामान्य समरस योग',
    detailsEn: 'Tithi and weekday operate in natural mutual harmony without severe shastric friction.',
    detailsHi: 'तिथि और वार स्वाभाविक समरसता में स्थित हैं तथा किसी गंभीर दोष से रहित हैं।'
  };
}

/* =========================================================================
   4. NAVAMSHA LAGNA (पृथु यशस् - होरासार फल एवं संवेदनशील आयु वर्ष)
   ========================================================================= */
export const CLASSICAL_PRITHU_YASAS_NAVAMSHA: Record<number, NavamshaLagnaProfile> = {
  0: { // Aries
    signIndex: 0,
    signNameEn: 'Aries (Mesh)',
    signNameHi: 'मेष नवांश लग्न',
    prithuYasasDictumEn: 'The native whose Lagna falls in Mesh Navamsha will be mischievous, sharp, weak-sighted, passionate, bilious in temperament, and sensuously disposed.',
    prithuYasasDictumHi: 'जिस जातक का जन्म मेष नवांश लग्न में हो, वह चंचल, तीक्ष्ण बुद्धि, पित्त प्रकृति, कामुक, कभी-कभी उग्र और तेजस्वी दृष्टि वाला होता है।',
    temperamentAndAppearanceEn: 'Pioneering drive, courageous demeanor, energetic posture, and restless pursuit of action.',
    temperamentAndAppearanceHi: 'पहल करने का अदम्य साहस, ऊर्जावान मुद्रा और निरंतर सक्रिय रहने की तीव्र अभिलाषा।',
    wealthAndCareerEn: 'Gains wealth through independent initiative, competitive fields, executive authority, and pioneering risks.',
    wealthAndCareerHi: 'स्वतंत्र पहल, प्रतिस्पर्धा, प्रशासनिक सत्ता और साहसिक उपक्रमों द्वारा धनोपार्जन करते हैं।',
    criticalVulnerabilityAges: [12, 25, 50, 65],
    sageWarningEn: 'Prithu Yasas warns of notable health challenges, feverish conditions, or trials in the 12th, 25th, 50th, and 65th years of life.',
    sageWarningHi: 'पृथु यशस् के अनुसार १२वें, २५वें, ५०वें और ६५वें वर्ष में विशेष शारीरिक कष्ट, पित्त विकार अथवा जीवन में कठिन परीक्षा संभव है।'
  },
  1: { // Taurus
    signIndex: 1,
    signNameEn: 'Taurus (Vrishabh)',
    signNameHi: 'वृषभ नवांश लग्न',
    prithuYasasDictumEn: 'Wise, fond of pleasures, broad torso and stomach, strong, long-faced, distinct walk, moving eyes, and possessing many daughters.',
    prithuYasasDictumHi: 'बुद्धिमान, विलासिता व सुख प्रेमी, सुपुष्ट पेट व वक्षस्थल, बलिष्ठ, दीर्घ मुख, विशिष्ट चाल और कन्या संतति से युक्त।',
    temperamentAndAppearanceEn: 'Sturdy physical endurance, patient resolve, aesthetic appreciation, and deliberate speech.',
    temperamentAndAppearanceHi: 'अडिग शारीरिक सहनशीलता, धैर्यवान स्वभाव, सौन्दर्य के कद्रदान और विचारपूर्वक वाणी।',
    wealthAndCareerEn: 'Accumulates wealth steadily in banking, land, hospitality, agriculture, art, and long-standing commerce.',
    wealthAndCareerHi: 'बैंकिंग, भूमि, कला, कृषि और स्थापित वाणिज्यिक उद्यमों के माध्यम से संचित धन में निरंतर वृद्धि।',
    criticalVulnerabilityAges: [10, 22, 23, 72],
    sageWarningEn: 'Prithu Yasas indicates notable physical difficulties or structural transitions in the 10th, 22nd, 23rd, and 72nd years.',
    sageWarningHi: 'पृथु यशस् के अनुसार १०वें, २२वें, २३वें और ७२वें वर्ष में शारीरिक कष्ट अथवा जीवन में महत्वपूर्ण मोड़ आते हैं।'
  },
  2: { // Gemini
    signIndex: 2,
    signNameEn: 'Gemini (Mithun)',
    signNameHi: 'मिथुन नवांश लग्न',
    prithuYasasDictumEn: 'Brilliant in appearance, eloquent orator, versatile, proficient in Shastras and sciences, modest, highly intelligent, and enjoying intellectual pleasures.',
    prithuYasasDictumHi: 'तेजस्वी स्वरूप, वाक्पटु, बहुमुखी प्रतिभा, शास्त्रों व विज्ञान में प्रवीण, विनम्र, असाधारण मेधावी और ज्ञान-चर्चा प्रेमी।',
    temperamentAndAppearanceEn: 'Lithe physique, expressive communicative eyes, youthful countenance, and rapid cognitive agility.',
    temperamentAndAppearanceHi: 'स्फूर्तिवान शरीर, संवादी आँखें, चिर-युवा मुखाकृति और तीव्र बौद्धिक ग्रहणशीलता।',
    wealthAndCareerEn: 'Excels in journalism, media, literature, mathematics, trade, diplomacy, and analytical consulting.',
    wealthAndCareerHi: 'पत्रकारिता, संचार, साहित्य, गणित, व्यापार, कूटनीति और परामर्श क्षेत्र में सर्वोच्च प्रतिष्ठा।',
    criticalVulnerabilityAges: [16, 24, 34, 40, 63],
    sageWarningEn: 'Prithu Yasas notes vulnerability to nervous strain, respiratory issues, or trials in the 16th, 24th, 34th, 40th, and 63rd years.',
    sageWarningHi: 'पृथु यशस् के अनुसार १६वें, २४वें, ३४वें, ४०वें और ६३वें वर्ष में स्नायु विकार, मानसिक दबाव अथवा जीवन में कड़ा संघर्ष संभव है।'
  },
  3: { // Cancer
    signIndex: 3,
    signNameEn: 'Cancer (Kark)',
    signNameHi: 'कर्क नवांश लग्न',
    prithuYasasDictumEn: 'Emotionally intense, distinct body, wealthy, sideways or keen sight, intent on living in foreign lands, deeply helpful to relatives, and bound by ties of affection.',
    prithuYasasDictumHi: 'भावनात्मक रूप से गंभीर, सुडौल शरीर, धनवान, पैनी दृष्टि, विदेश वास में रुचि, आत्मीय जनों के उपकारक और परिजनों के प्रति समर्पित।',
    temperamentAndAppearanceEn: 'Sympathetic expression, magnetic intuitive demeanor, protective instincts, and fluctuating moods.',
    temperamentAndAppearanceHi: 'सहानुभूतिपूर्ण मुखाकृति, सम्मोहक अंतर्दृष्टि, रक्षात्मक स्वभाव और जल-समान परिवर्तनशील मनोदशा।',
    wealthAndCareerEn: 'Prosperity through overseas connections, shipping, liquids, real estate, advisory, and institutional hospitality.',
    wealthAndCareerHi: 'विदेशी संपर्क, जलीय उत्पाद, भूमि-भवन, जनसेवा और संस्थागत प्रबंधन से विपुल धनोपार्जन।',
    criticalVulnerabilityAges: [8, 18, 21, 22, 72, 80],
    sageWarningEn: 'Prithu Yasas identifies critical health sensitivities or domestic crises in the 8th, 18th, 21st, 22nd, 72nd, and 80th years.',
    sageWarningHi: 'पृथु यशस् के अनुसार ८वें, १८वें, २१वें, २२वें, ७२वें और ८०वें वर्ष में स्वास्थ्य संकट अथवा पारिवारिक उलझनों की संभावना रहती है।'
  },
  4: { // Leo
    signIndex: 4,
    signNameEn: 'Leo (Simh)',
    signNameHi: 'सिंह नवांश लग्न',
    prithuYasasDictumEn: 'Fiercely self-respecting, proud, majestic, thin belly, wide knowledge of worldly affairs, strong physical frame, and aggrieved by pettiness.',
    prithuYasasDictumHi: 'परम स्वाभिमानी, तेजस्वी, राजसी ठाठ, सुडौल उदर, सांसारिक मामलों का व्यापक ज्ञान, बलिष्ठ और क्षुद्र बातों से क्षुब्ध होने वाले।',
    temperamentAndAppearanceEn: 'Regal posture, commanding gaze, dignified stride, and innate authority.',
    temperamentAndAppearanceHi: 'राजसी ठाठ, रौबदार दृष्टि, गरिमामय चाल और जन्मजात प्रशासनिक आभा।',
    wealthAndCareerEn: 'High-ranking governance, political authority, executive management, military leadership, and gold/prestige enterprises.',
    wealthAndCareerHi: 'उच्च प्रशासनिक पद, राजनीति, कॉरपोरेट नेतृत्व, सैन्य सेवा और प्रतिष्ठापूर्ण उद्यमों से राजसम्मान व धन।',
    criticalVulnerabilityAges: [10, 20, 30, 60],
    sageWarningEn: 'Prithu Yasas indicates mentionable evils, cardiothoracic stress, or major trials in the 10th, 20th, 30th, and 60th years.',
    sageWarningHi: 'पृथु यशस् के अनुसार १०वें, २०वें, ३०वें और ६०वें वर्ष में हृदय-उष्णता विकार, राजकोप अथवा गंभीर जीवन परीक्षा का योग बनता है।'
  },
  5: { // Virgo
    signIndex: 5,
    signNameEn: 'Virgo (Kanya)',
    signNameHi: 'कन्या नवांश लग्न',
    prithuYasasDictumEn: 'Happy in youth, accomplished in fine arts, generous, fortunate, dedicated to helping others, liberal, intent on foreign residence, progressing in wealth up to 108 years.',
    prithuYasasDictumHi: 'युवावस्था में सुखी, विविध कलाओं के ज्ञाता, उदार, भाग्यशाली, परोपकारी, विदेश वास प्रेमी और १०८ वर्ष तक निरंतर बढ़ते वैभव के स्वामी।',
    temperamentAndAppearanceEn: 'Youthful grace, precise meticulous movement, sharp analytical eyes, and refined craftsmanship.',
    temperamentAndAppearanceHi: 'सौम्य आकृति, सटीक कार्यशैली, पैनी विश्लेषक आँखें और कलात्मक शिल्प में दक्षता।',
    wealthAndCareerEn: 'Consistent riches in accounting, technology, editing, fine handicrafts, medicine, and international logistics.',
    wealthAndCareerHi: 'लेखांकन, तकनीकी, संपादन, औषध-विज्ञान और अंतरराष्ट्रीय व्यापार में अनवरत धन-वृद्धि।',
    criticalVulnerabilityAges: [5, 20, 60],
    sageWarningEn: 'Prithu Yasas mentions doubt or vulnerability at the 5th, 20th, and 60th years, though overcoming them confers unbroken longevity.',
    sageWarningHi: 'पृथु यशस् के अनुसार ५वें, २०वें और ६०वें वर्ष में स्वास्थ्य संशय संभव है, जिसे पार कर लेने पर दीर्घायु और अखंड समृद्धि मिलती है।'
  },
  6: { // Libra
    signIndex: 6,
    signNameEn: 'Libra (Tula)',
    signNameHi: 'तुला नवांश लग्न',
    prithuYasasDictumEn: 'Fond of movement and travel, slender body, prudent and cautious with wealth, sensitive to relatives, and prone to phlegmatic or cold conditions.',
    prithuYasasDictumHi: 'भ्रमण व यात्रा प्रेमी, छरहरा शरीर, धन के प्रति अत्यंत सतर्क, संबंधियों के प्रति संकोची और कफ प्रवृत्तिमूलक।',
    temperamentAndAppearanceEn: 'Harmonious physical symmetry, charming smile, courteous diplomatic tact, and refined aesthetic taste.',
    temperamentAndAppearanceHi: 'सुडौल शारीरिक समरूपता, मनमोहक मुस्कान, शिष्ट कूटनीतिक व्यवहार और उच्च कलात्मक रुचि।',
    wealthAndCareerEn: 'Successful in arbitration, trade, luxury partnerships, legal counsel, design, and travel industries.',
    wealthAndCareerHi: 'न्याय-पंचायती, व्यापार, साझेदारी, विधिक परामर्श, फैशन और यात्रा उद्योग में प्रचुर लाभ।',
    criticalVulnerabilityAges: [3, 23, 27, 38, 46, 76],
    sageWarningEn: 'Prithu Yasas indicates periods of trial, kidney/phlegm issues, or financial pivots in the 3rd, 23rd, 27th, 38th, 46th, and 76th years.',
    sageWarningHi: 'पृथु यशस् के अनुसार ३रे, २३वें, २७वें, ३८वें, ४६वें और ७६वें वर्ष में स्वास्थ्य अथवा आर्थिक मोर्चे पर परीक्षा का काल रहता है।'
  },
  7: { // Scorpio
    signIndex: 7,
    signNameEn: 'Scorpio (Vrischik)',
    signNameHi: 'वृश्चिक नवांश लग्न',
    prithuYasasDictumEn: 'Deeply independent, clever, sharp-sighted, long-bodied, round bellied, secretive researcher, fearless in battle, and keeping intimate counsels hidden.',
    prithuYasasDictumHi: 'पूर्ण स्वावलंबी, बुद्धिमान, तीक्ष्ण दृष्टि, दीर्घ शरीर, गोल उदर, गूढ़ रहस्यों के अन्वेषक, युद्ध में निर्भीक और गुप्त नीतियों के धनी।',
    temperamentAndAppearanceEn: 'Penetrating magnetic eyes, guarded posture, resolute willpower, and silent transformative power.',
    temperamentAndAppearanceHi: 'गंभीर सम्मोहक आँखें, संयमित मुद्रा, अटूट इच्छाशक्ति और शांत रहकर बड़े परिवर्तन लाने की क्षमता।',
    wealthAndCareerEn: 'Riches through surgery, investigation, mineral extraction, defense technology, research, and hidden wealth.',
    wealthAndCareerHi: 'शल्य-चिकित्सा, अनुसंधान, खनन, गुप्तचर व्यवस्था, रक्षा तकनीक और गुप्त संपत्ति से विपुल लाभ।',
    criticalVulnerabilityAges: [13, 18, 23, 55, 70],
    sageWarningEn: 'Prithu Yasas warns of danger from poison, wounds, or acute disease in the 13th, 18th, 23rd, 55th, and 70th years.',
    sageWarningHi: 'पृथु यशस् के अनुसार १३वें, १८वें, २३वें, ५५वें और ७०वें वर्ष में विष, चोट अथवा तीव्र रोग से विशेष सावधानी बरतनी चाहिए।'
  },
  8: { // Sagittarius
    signIndex: 8,
    signNameEn: 'Sagittarius (Dhanu)',
    signNameHi: 'धनु नवांश लग्न',
    prithuYasasDictumEn: 'Endowed with self-earned wealth, virtuous, long-necked, dignified, satisfied with noble simplicity, prominent nose, eloquent speaker, and master of riches.',
    prithuYasasDictumHi: 'स्व-अर्जित धन के स्वामी, धर्मपरायण, दीर्घ ग्रीवा, गरिमामय, संतोषी स्वभाव, उन्नत नासिका, प्रखर वक्ता और समृद्ध ऐश्वर्यवान।',
    temperamentAndAppearanceEn: 'Athletic tall build, frank gaze, noble demeanor, and philosophical generosity.',
    temperamentAndAppearanceHi: 'लंबा बलिष्ठ शरीर, निष्कपट दृष्टि, कुलीन आचरण और दार्शनिक उदारता।',
    wealthAndCareerEn: 'Elevated fortunes in law, academia, spiritual institutions, banking, publishing, and international diplomacy.',
    wealthAndCareerHi: 'विधिक सेवा, उच्च शिक्षा, धार्मिक ट्रस्ट, बैंकिंग, प्रकाशन और अंतरराष्ट्रीय कूटनीति में उच्च पद व धन।',
    criticalVulnerabilityAges: [4, 9, 16, 36, 72],
    sageWarningEn: 'Prithu Yasas indicates danger to health or pivotal crisis in the 4th, 9th, 16th, 36th, and 72nd years.',
    sageWarningHi: 'पृथु यशस् के अनुसार ४थे, ९वें, १६वें, ३६वें और ७२वें वर्ष में स्वास्थ्य संकट अथवा जीवन के महत्वपूर्ण उतार-चढ़ाव आते हैं।'
  },
  9: { // Capricorn
    signIndex: 9,
    signNameEn: 'Capricorn (Makar)',
    signNameHi: 'मकर नवांश लग्न',
    prithuYasasDictumEn: 'Pragmatic, compact physique, cautious, deeply appreciative of domestic comforts, persistent worker, and slowly building an enduring dynasty.',
    prithuYasasDictumHi: 'व्यावहारिक, सुगठित शरीर, सतर्क, पारिवारिक सुख-सुविधाओं के प्रेमी, अनवरत परिश्रमी और धीरे-धीरे स्थायी साम्राज्य बनाने वाले।',
    temperamentAndAppearanceEn: 'Sober expression, prudent gaze, structured discipline, and unwavering patience.',
    temperamentAndAppearanceHi: 'गंभीर भाव, दूरदर्शी दृष्टि, अनुशासित जीवनशैली और अडिग धैर्य।',
    wealthAndCareerEn: 'Enduring success in structural engineering, civic governance, real estate, manufacturing, and executive hierarchy.',
    wealthAndCareerHi: 'इंजीनियरिंग, प्रशासनिक तंत्र, रियल एस्टेट, भारी उद्योग और कॉरपोरेट पदानुक्रम में स्थायी सफलता।',
    criticalVulnerabilityAges: [19, 27, 34, 49, 68],
    sageWarningEn: 'Prithu Yasas indicates diseases, bone/joint stress, or heavy burdens in the 19th, 27th, 34th, 49th, and 68th years.',
    sageWarningHi: 'पृथु यशस् के अनुसार १९वें, २७वें, ३४वें, ४९वें और ६८वें वर्ष में अस्थि-वात रोग, शारीरिक थकान अथवा अत्यधिक दायित्व का भार संभव है।'
  },
  10: { // Aquarius
    signIndex: 10,
    signNameEn: 'Aquarius (Kumbh)',
    signNameHi: 'कुंभ नवांश लग्न',
    prithuYasasDictumEn: 'Philosophical wanderer, tall body, independent spirit, troubled at times by unforeseen expenses, deeply thoughtful, and pursuing humanitarian or esoteric ideals.',
    prithuYasasDictumHi: 'दार्शनिक, भ्रमणशील, दीर्घ शरीर, स्वतंत्रचेता, अनपेक्षित व्ययों से कभी-कभी चिंतित, गहन चिंतक और मानवतावादी आदर्शों के अग्रदूत।',
    temperamentAndAppearanceEn: 'Reflective far-seeing eyes, unconventional carriage, detached kindness, and intellectual idealism.',
    temperamentAndAppearanceHi: 'दूरदर्शी आँखें, मौलिक स्वभाव, अनासक्त सौम्यता और बौद्धिक आदर्शवाद।',
    wealthAndCareerEn: 'Progresses through scientific innovation, non-profit organizations, space/telecom technology, and collective public movements.',
    wealthAndCareerHi: 'वैज्ञानिक अनुसंधान, जनकल्याणकारी संस्थाएं, संचार तकनीक और सामूहिक जन-आंदोलनों से प्रतिष्ठा व लाभ।',
    criticalVulnerabilityAges: [7, 14, 20, 28, 32, 61],
    sageWarningEn: 'Prithu Yasas indicates periods of trial, melancholy, or health vulnerabilities in the 7th, 14th, 20th, 28th, 32nd, and 61st years.',
    sageWarningHi: 'पृथु यशस् के अनुसार ७वें, १४वें, २०वें, २८वें, ३२वें और ६१वें वर्ष में मानसिक अवसाद, स्वास्थ्य कष्ट अथवा आर्थिक उतार-चढ़ाव संभव हैं।'
  },
  11: { // Pisces
    signIndex: 11,
    signNameEn: 'Pisces (Meen)',
    signNameHi: 'मीन नवांश लग्न',
    prithuYasasDictumEn: 'Scholarly, connection to oceanic/water or distant lands, fish-bellied, dignified, generous, living in noble dwellings, and blessed with honorable status.',
    prithuYasasDictumHi: 'विद्वान, जल अथवा सुदूर विदेशी संपर्कों से लाभान्वित, सुपुष्ट पेट, गरिमामय, उदार, विशाल भवनों के स्वामी और सम्मानीय स्थिति।',
    temperamentAndAppearanceEn: 'Soft compassionate eyes, dreamy spiritual aura, tranquil demeanor, and boundless empathy.',
    temperamentAndAppearanceHi: 'करुणापूर्ण आँखें, शांत आध्यात्मिक आभा, सौम्य मुद्रा और असीम संवेदना।',
    wealthAndCareerEn: 'Riches in international shipping, higher philosophy, spiritual counseling, pharmaceuticals, and creative arts.',
    wealthAndCareerHi: 'अंतरराष्ट्रीय जहाजरानी, दर्शनशास्त्र, आध्यात्मिक मार्गदर्शन, औषधि उद्योग और ललित कलाओं में विपुल धन।',
    criticalVulnerabilityAges: [10, 12, 21, 26, 52, 61],
    sageWarningEn: 'Prithu Yasas indicates sensitive health checkpoints or respiratory/fluid vulnerabilities in the 10th, 12th, 21st, 26th, 52nd, and 61st years.',
    sageWarningHi: 'पृथु यशस् के अनुसार १०वें, १२वें, २१वें, २६वें, ५२वें और ६१वें वर्ष में कफ-जलीय विकार अथवा जीवन में महत्वपूर्ण रूपांतरण के पड़ाव आते हैं।'
  }
};

/* =========================================================================
   5. LUNAR MONTH (मास फल एवं अधिक मास विज्ञान)
   ========================================================================= */
export const CLASSICAL_LUNAR_MAAS_PROFILES: Record<string, MaasProfile> = {
  Chaitra: {
    index: 0,
    nameEn: 'Chaitra Maas',
    nameHi: 'चैत्र मास',
    sunSignEn: 'Pisces (Meen)',
    sunSignHi: 'मीन राशि',
    shastricResultEn: 'Proficient in all fine arts including singing, poetry, literature, and dance; interested in Vedic science; enjoys celebration and social joy.',
    shastricResultHi: 'गायन, काव्य, साहित्य व नृत्य आदि समस्त ललित कलाओं में निपुण; वैदिक विज्ञान व दर्शन के अध्येता; जीवन में उत्सव व प्रसन्नता के प्रेमी।'
  },
  Vaishakha: {
    index: 1,
    nameEn: 'Vaishakha Maas',
    nameHi: 'वैशाख मास',
    sunSignEn: 'Aries (Mesh)',
    sunSignHi: 'मेष राशि',
    shastricResultEn: 'Master of Shastras, self-reliant, commanding, lord of substantial real estate and properties, possessing leadership authority.',
    shastricResultHi: 'सर्व शास्त्रों के ज्ञाता, स्वावलंबी, प्रभावशाली, विशाल भूमि व संपत्तियों के स्वामी और प्रशासनिक नेतृत्व के धनी।'
  },
  Jyeshtha: {
    index: 2,
    nameEn: 'Jyeshtha Maas',
    nameHi: 'ज्येष्ठ मास',
    sunSignEn: 'Taurus (Vrishabh)',
    sunSignHi: 'वृषभ राशि',
    shastricResultEn: 'Endowed with long-lived progeny, lasting generational wealth, expertise in sacred mantras, rituals, poetry, and enduring legacy.',
    shastricResultHi: 'दीर्घजीवी संतति से युक्त, चिरस्थायी कुल-वैभव, मंत्र-अनुष्ठान व काव्य में निष्णात और पीढ़ियों तक चलने वाली कीर्ति के स्वामी।'
  },
  Ashadha: {
    index: 3,
    nameEn: 'Ashadha Maas',
    nameHi: 'आषाढ़ मास',
    sunSignEn: 'Gemini (Mithun)',
    sunSignHi: 'मिथुन राशि',
    shastricResultEn: 'Highly wealthy, kind, liberal benefactor, productive in quiet nocturnal hours, possessing sharp critical discernment.',
    shastricResultHi: 'अत्यंत धनवान, दयालु, उदार परोपकारी, एकांत व रात्रि काल में सृजनशील और दूसरों के गुण-दोषों की सूक्ष्म परख रखने वाले।'
  },
  Shravana: {
    index: 4,
    nameEn: 'Shravana Maas',
    nameHi: 'श्रावण मास',
    sunSignEn: 'Cancer (Kark)',
    sunSignHi: 'कर्क राशि',
    shastricResultEn: 'Devoted to divine worship, spiritual mentors, earth, and cows; righteous, pure in conduct, and blessed with spiritual wisdom.',
    shastricResultHi: 'ईश्वर-भक्ति, गुरुजनों की सेवा, गो-भूमि पूजन में निष्ठावान; सदाचारी, पवित्र आचरण और आत्मिक ज्ञान से संपन्न।'
  },
  Bhadrapada: {
    index: 5,
    nameEn: 'Bhadrapada Maas',
    nameHi: 'भाद्रपद मास',
    sunSignEn: 'Leo (Simh)',
    sunSignHi: 'सिंह राशि',
    shastricResultEn: 'Travels to diverse countries, interested in mechanical sciences, instruments, and esoteric theories; honored by rulers and civic authorities.',
    shastricResultHi: 'अनेक देशों का भ्रमण करने वाले, यंत्र-विज्ञान, तकनीकी और गूढ़ सिद्धांतों के जानकार; शासन व समाज से सम्मानित।'
  },
  Ashwin: {
    index: 6,
    nameEn: 'Ashwin Maas',
    nameHi: 'आश्विन मास',
    sunSignEn: 'Virgo (Kanya)',
    sunSignHi: 'कन्या राशि',
    shastricResultEn: 'Overcomes early domestic friction with relatives, develops formidable resilience, self-made fortune, and deep psychological depth.',
    shastricResultHi: 'आरंभिक पारिवारिक संघर्षों को पार कर स्वावलंबी भाग्य का निर्माण करने वाले, अद्वितीय सहनशील और मनोवैज्ञानिक समझ के धनी।'
  },
  Kartika: {
    index: 7,
    nameEn: 'Kartika Maas',
    nameHi: 'कार्तिक मास',
    sunSignEn: 'Libra (Tula)',
    sunSignHi: 'तुला राशि',
    shastricResultEn: 'Robust physical constitution, fond of agricultural and land enterprises, broad magnetic eyes, and accumulating vast wealth.',
    shastricResultHi: 'बलिष्ठ शरीर, कृषि व भूमि-उद्यमों के प्रेमी, विशाल सम्मोहक नेत्र और विपुल स्थायी संपत्ति के स्वामी।'
  },
  Margashirsha: {
    index: 8,
    nameEn: 'Margashirsha Maas',
    nameHi: 'मार्गशीर्ष मास',
    sunSignEn: 'Scorpio (Vrischik)',
    sunSignHi: 'वृश्चिक राशि',
    shastricResultEn: 'Devoted to God, scholars, elders, and parents; deeply ethical, faithful in duty, and respected for unblemished morality.',
    shastricResultHi: 'ईश्वर, विद्वान, अग्रज और माता-पिता के परम भक्त; अत्यंत धार्मिक, कर्तव्यनिष्ठ और निष्कलंक चरित्र के लिए समादृत।'
  },
  Pausha: {
    index: 9,
    nameEn: 'Pausha Maas',
    nameHi: 'पौष मास',
    sunSignEn: 'Sagittarius (Dhanu)',
    sunSignHi: 'धनु राशि',
    shastricResultEn: 'Endowed with enduring wealth, strength, elevated features, resolute willpower, and high administrative stature.',
    shastricResultHi: 'अक्षय धन, शारीरिक बल, उन्नत नासिका-लक्षण, अटूट इच्छाशक्ति और उच्च प्रशासनिक प्रतिष्ठा से युक्त।'
  },
  Magha: {
    index: 10,
    nameEn: 'Magha Maas',
    nameHi: 'माघ मास',
    sunSignEn: 'Capricorn (Makar)',
    sunSignHi: 'मकर राशि',
    shastricResultEn: 'Sharp, critical, strategic intellect; active participant in sacred public ceremonies and righteous community foundations.',
    shastricResultHi: 'तीक्ष्ण, रणनीतिक बुद्धि; धार्मिक यज्ञों, समाज-कल्याण और धर्म-कर्म के सार्वजनिक आयोजनों में अग्रणी।'
  },
  Phalguna: {
    index: 11,
    nameEn: 'Phalguna Maas',
    nameHi: 'फाल्गुन मास',
    sunSignEn: 'Aquarius (Kumbh)',
    sunSignHi: 'कुंभ राशि',
    shastricResultEn: 'Engaged in daily acts of benevolent philanthropy, fond of music, harmonious living, and bringing joy to the destitute.',
    shastricResultHi: 'नित्य परोपकार व जनसेवा में लीन, संगीत व सौहार्द के प्रेमी तथा पीड़ितों को संबल प्रदान करने वाले।'
  }
};

/* =========================================================================
   6. RITU PROFILES (षड् ऋतु फल)
   ========================================================================= */
export const CLASSICAL_RITU_PROFILES: Record<string, RituProfile> = {
  Vasanta: {
    index: 0,
    nameEn: 'Vasanta (Spring)',
    nameHi: 'वसन्त ऋतु',
    lunarMonthsEn: 'Chaitra & Vaishakha',
    lunarMonthsHi: 'चैत्र एवं वैशाख मास',
    sunSignsEn: 'Pisces & Aries',
    sunSignsHi: 'मीन एवं मेष राशि',
    temperamentEn: 'Long-lived, wealthy, aesthetic, lovers of perfumes and vibrant harmony, possessing natural poetic charm.',
    temperamentHi: 'दीर्घायु, धनवान, सौन्दर्य-प्रेमी, सुगंध व सुव्यवस्थित जीवन के शौकीन और स्वाभाविक काव्य-प्रतिभा से संपन्न।'
  },
  Grishma: {
    index: 1,
    nameEn: 'Grishma (Summer)',
    nameHi: 'ग्रीष्म ऋतु',
    lunarMonthsEn: 'Jyeshtha & Ashadha',
    lunarMonthsHi: 'ज्येष्ठ एवं आषाढ़ मास',
    sunSignsEn: 'Taurus & Gemini',
    sunSignsHi: 'वृषभ एवं मिथुन राशि',
    temperamentEn: 'Prudent in the expenditure of wealth and resources, lean muscular frame, sharp intellect, focused on tangible material fruits.',
    temperamentHi: 'धन व ऊर्जा के व्यय में अत्यंत चतुर, छरहरा गठीला शरीर, तीव्र बुद्धि और व्यावहारिक भौतिक सफलताओं के प्रति समर्पित।'
  },
  Varsha: {
    index: 2,
    nameEn: 'Varsha (Monsoon)',
    nameHi: 'वर्षा ऋतु',
    lunarMonthsEn: 'Shravana & Bhadrapada',
    lunarMonthsHi: 'श्रावण एवं भाद्रपद मास',
    sunSignsEn: 'Cancer & Leo',
    sunSignsHi: 'कर्क एवं सिंह राशि',
    temperamentEn: 'Sweet-spoken, clear and tranquil intellect, fond of nourishing dairy and balanced foods, compassionate and emotionally receptive.',
    temperamentHi: 'मधुरभाषी, निर्मल व शांत बुद्धि, पौष्टिक आहार-प्रेमी, परोपकारी और दूसरों के दुख में तुरंत द्रवित होने वाले।'
  },
  Sharad: {
    index: 3,
    nameEn: 'Sharad (Autumn)',
    nameHi: 'शरद् ऋतु',
    lunarMonthsEn: 'Ashwin & Kartika',
    lunarMonthsHi: 'आश्विन एवं कार्तिक मास',
    sunSignsEn: 'Virgo & Libra',
    sunSignsHi: 'कन्या एवं तुला राशि',
    temperamentEn: 'Noble soul (Punyatma), handsome, contented, aesthetic, possessing romantic refinement, and living with grace.',
    temperamentHi: 'पुण्यात्मा, रूपवान, संतोषी, सुरुचिपूर्ण, सौन्दर्य व प्रेम के मर्मज्ञ और गरिमामय जीवन जीने वाले।'
  },
  Hemanta: {
    index: 4,
    nameEn: 'Hemanta (Pre-Winter)',
    nameHi: 'हेमन्त ऋतु',
    lunarMonthsEn: 'Margashirsha & Pausha',
    lunarMonthsHi: 'मार्गशीर्ष एवं पौष मास',
    sunSignsEn: 'Scorpio & Sagittarius',
    sunSignsHi: 'वृश्चिक एवं धनु राशि',
    temperamentEn: 'Yogic fortitude, lean endurance, hardworking farmer or architect of systems, capable of weathering immense hardships.',
    temperamentHi: 'योगियों जैसा आत्मसंयम, सहनशील काया, अथक परिश्रमी और बड़े से बड़े संकट को सहकर विजयी होने वाले।'
  },
  Shishira: {
    index: 5,
    nameEn: 'Shishira (Late Winter)',
    nameHi: 'शिशिर ऋतु',
    lunarMonthsEn: 'Magha & Phalguna',
    lunarMonthsHi: 'माघ एवं फाल्गुन मास',
    sunSignsEn: 'Capricorn & Aquarius',
    sunSignsHi: 'मकर एवं कुंभ राशि',
    temperamentEn: 'Charitable, lovers of righteousness and ablutions, widely honored, famous, and championing civic morality.',
    temperamentHi: 'महादानी, पवित्र आचरण व तीर्थ-स्नान के प्रेमी, लोक-प्रसिद्ध और समाज में मर्यादा व सत्य के संरक्षक।'
  }
};

/* =========================================================================
   7. AYANA PROFILES (उत्तरायण व दक्षिणायन)
   ========================================================================= */
export const CLASSICAL_AYANA_PROFILES = {
  Uttarayana: {
    nameEn: 'Uttarayana (Northern Solar Transit)',
    nameHi: 'उत्तरायण (सूर्य का उत्तर गोलार्ध)',
    sunSignsEn: 'Capricorn, Aquarius, Pisces, Aries, Taurus, Gemini',
    sunSignsHi: 'मकर, कुंभ, मीन, मेष, वृषभ, मिथुन राशि',
    natureEn: 'Incline toward higher knowledge, Vidya, Yoga, spiritual elevation, and living life anchored in unshakeable morality and truth.',
    natureHi: 'उच्च विद्या, ज्ञान, योग, आत्मिक उत्थान और सत्य व मर्यादा पर आधारित जीवन जीने की स्वाभाविक प्रवृत्ति।'
  },
  Dakshinayana: {
    nameEn: 'Dakshinayana (Southern Solar Transit)',
    nameHi: 'दक्षिणायन (सूर्य का दक्षिण गोलार्ध)',
    sunSignsEn: 'Cancer, Leo, Virgo, Libra, Scorpio, Sagittarius',
    sunSignsHi: 'कर्क, सिंह, कन्या, तुला, वृश्चिक, धनु राशि',
    natureEn: 'Mastery over communication, profound understanding of Bhed-Niti (strategic diplomacy), energetic action, and worldly triumphs.',
    natureHi: 'संवाद में निष्णात, भेद-नीति (रणनीतिक कूटनीति) के मर्मज्ञ, कर्मठ, साहसी और व्यावहारिक संसार में विजय पाने वाले।'
  }
};

/* =========================================================================
   8. KAAL / PRAHAR PROFILES (उषाकाल से रात्रिकाल)
   ========================================================================= */
export const CLASSICAL_KAAL_PROFILES: Record<string, KaalProfile> = {
  Ushakaal: {
    id: 'Ushakaal',
    nameEn: 'Ushakaal (Brahma Muhurta to Morning)',
    nameHi: 'उषाकाल (प्रातः ४ से ८ बजे)',
    timeWindow: '04:00 - 08:00',
    sunHousePosition: 'Houses 12, 1, 2',
    natureEn: 'Endowed with manifold avenues of happiness, peaceful mind, divine blessings, and radiant morning vitality.',
    natureHi: 'अनेक प्रकार के सुखों के स्वामी, शांत मन, ईश्वरीय कृपा और प्रातःकालीन सूर्य-समान ओजस्वी जीवनशक्ति।'
  },
  Pratushakaal: {
    id: 'Pratushakaal',
    nameEn: 'Pratushakaal (Mid-Morning)',
    nameHi: 'प्रत्यूषकाल (प्रातः ८ से दोपहर १२ बजे)',
    timeWindow: '08:00 - 12:00',
    sunHousePosition: 'Houses 11, 10',
    natureEn: 'Dedicated to righteous vocations, performing honorable deeds, respected by mentors, and experiencing sustained career joy.',
    natureHi: 'सत्कार्यों में रत, कर्तव्यनिष्ठ, गुरुजनों व अधिकारियों के प्रिय और कार्यक्षेत्र में अनवरत सफलता पाने वाले।'
  },
  Madhyahna: {
    id: 'Madhyahna',
    nameEn: 'Madhyahna (Afternoon Zenith)',
    nameHi: 'मध्याह्न काल (दोपहर १२ से अपराह्न ४ बजे)',
    timeWindow: '12:00 - 16:00',
    sunHousePosition: 'Houses 10, 9',
    natureEn: 'Royal executive qualities, high institutional authority, prosperous manager of public and communal assets.',
    natureHi: 'राजसी गुण, उच्च प्रशासनिक सत्ता, सार्वजनिक संसाधनों के कुशल प्रबंधक और समाज में सम्मानित।'
  },
  Sayamkaal: {
    id: 'Sayamkaal',
    nameEn: 'Sayamkaal (Twilight / Dusk)',
    nameHi: 'सायंकाल (अपराह्न ४ से रात्रि ८ बजे)',
    timeWindow: '16:00 - 20:00',
    sunHousePosition: 'Houses 8, 7',
    natureEn: 'Charming, fond of perfumes, evening romance, socially dynamic, wandering spirit, and exploring unconventional experiences.',
    natureHi: 'आकर्षक, सौन्दर्य व इत्र प्रेमी, सामाजिक उत्सवों के शौकीन, यात्रा-प्रिय और नए अनुभवों की खोज करने वाले।'
  },
  RatriKaal: {
    id: 'RatriKaal',
    nameEn: 'Ratri Kaal (Night Hours)',
    nameHi: 'रात्रिकाल (रात्रि ८ से प्रातः ४ बजे)',
    timeWindow: '20:00 - 04:00',
    sunHousePosition: 'Houses 6, 5, 4, 3',
    natureEn: 'Deep introspective or nocturnal productivity, intense emotional passions, unconventional thinking, and self-reliance.',
    natureHi: 'गहन अंतर्मुखी चिंतन, रात्रि में कार्यकुशलता, तीव्र भावनात्मक अनुभूतियां और लीक से हटकर सोचने की क्षमता।'
  }
};

/* =========================================================================
   9. HORA PROFILES (सूर्य व चंद्र होरा फल)
   ========================================================================= */
export function getHoraReading(ascSignIndex: number, ascDegInSign: number): {
  horaLord: 'Sun' | 'Moon';
  horaLordHi: string;
  isOddSign: boolean;
  readingEn: string;
  readingHi: string;
} {
  const isOdd = ascSignIndex % 2 === 0; // 0=Aries (Odd), 1=Taurus (Even), etc.
  const isFirstHalf = ascDegInSign < 15;
  const horaLord: 'Sun' | 'Moon' = isOdd
    ? (isFirstHalf ? 'Sun' : 'Moon')
    : (isFirstHalf ? 'Moon' : 'Sun');

  if (isOdd) {
    if (isFirstHalf) {
      return {
        horaLord: 'Sun',
        horaLordHi: 'सूर्य',
        isOddSign: true,
        readingEn: 'Odd Sign 1st Hora (Ruled by Sun): Authoritative, energetic, ambitious, wealthy, and honored by kings and state authorities.',
        readingHi: 'विषम राशि प्रथम होरा (सूर्य अधिपति): तेजस्वी, ओजस्वी, साहसी, प्रचुर धनवान और शासन-सत्ता से सम्मानित।'
      };
    } else {
      return {
        horaLord: 'Moon',
        horaLordHi: 'चंद्रमा',
        isOddSign: true,
        readingEn: 'Odd Sign 2nd Hora (Ruled by Moon): Eloquent speaker, charitable, handsome, polite, though requiring diplomatic balance in marriage.',
        readingHi: 'विषम राशि द्वितीय होरा (चंद्र अधिपति): मधुर वक्ता, दानवीर, रूपवान, सौम्य, यद्यपि दांपत्य में तालमेल आवश्यक है।'
      };
    }
  } else {
    if (isFirstHalf) {
      return {
        horaLord: 'Moon',
        horaLordHi: 'चंद्रमा',
        isOddSign: false,
        readingEn: 'Even Sign 1st Hora (Ruled by Moon): Fearless in speech, righteous conduct, devoted to virtuous deeds, and loyal partner.',
        readingHi: 'सम राशि प्रथम होरा (चंद्र अधिपति): निर्भीक वक्ता, धर्मपरायण, सदाचारी और जीवनसाथी के प्रति समर्पित।'
      };
    } else {
      return {
        horaLord: 'Sun',
        horaLordHi: 'सूर्य',
        isOddSign: false,
        readingEn: 'Even Sign 2nd Hora (Ruled by Sun): Ministerial intellect, prudent advisor, grateful nature remembering assistance, though cautious.',
        readingHi: 'सम राशि द्वितीय होरा (सूर्य अधिपति): मंत्री-समान तीक्ष्ण बुद्धि, श्रेष्ठ परामर्शदाता, कृतज्ञ स्वभाव और सतर्क कार्यशैली।'
      };
    }
  }
}

/* =========================================================================
   10. 27 NITYA YOGA PROFILES (विष्कम्भ से वैधृति)
   ========================================================================= */
export const CLASSICAL_NITYA_YOGAS: Record<number, NityaYogaProfile> = {
  1: { number: 1, nameEn: 'Vishkambha', nameHi: 'विष्कम्भ', natureEn: 'Conquering, victorious over enemies, endowed with cattle/property and honor.', natureHi: 'शत्रुहंता', classicalResultEn: 'Triumphs over opposition, commands land and wealth, receives public honor.', classicalResultHi: 'शत्रुओं पर विजय, भूमि-संपत्ति का लाभ और समाज में विशेष सम्मान।' },
  2: { number: 2, nameEn: 'Preeti', nameHi: 'प्रीति', natureEn: 'Affectionate, beloved of many, charming, diplomatic in relations.', natureHi: 'प्रेम-सिक्त', classicalResultEn: 'Fond of aesthetic delights, romantic, loving, and diplomatic companion.', classicalResultHi: 'प्रेम व सौन्दर्य के प्रेमी, सर्वप्रिय और मधुर संबंधों के स्वामी।' },
  3: { number: 3, nameEn: 'Ayushman', nameHi: 'आयुष्मान्', natureEn: 'Long-lived, robust, healthy, preserving vitality through life.', natureHi: 'दीर्घजीवी', classicalResultEn: 'Blessed with health, longevity, contentment, and sustained prosperity.', classicalResultHi: 'दीर्घायु, उत्तम आरोग्य, संतोष और निरंतर सुख-समृद्धि का वरदान।' },
  4: { number: 4, nameEn: 'Saubhagya', nameHi: 'सौभाग्य', natureEn: 'Highly fortunate, blessed with auspicious events and happy domestic life.', natureHi: 'भाग्यवान्', classicalResultEn: 'Fortunate in career and marriage, widely favored by fortune.', classicalResultHi: 'भाग्योदय, गृहस्थ सुख और निरंतर मांगलिक अवसरों की प्राप्ति।' },
  5: { number: 5, nameEn: 'Shobhana', nameHi: 'शोभन', natureEn: 'Charming, splendid, enjoying fine material and spiritual comforts.', natureHi: 'शोभायुक्त', classicalResultEn: 'Graceful countenance, enjoys pleasures, cultured and elegant lifestyle.', classicalResultHi: 'सुंदर रूप-रंग, विलासिता व शिष्टाचार से परिपूर्ण जीवन।' },
  6: { number: 6, nameEn: 'Atiganda', nameHi: 'अतिगण्ड', natureEn: 'Formidable, fierce warrior spirit, requiring vigilance against rashness.', natureHi: 'कठिन-शौर्य', classicalResultEn: 'Fierce willpower, bold in crisis, must temper anger with wisdom.', classicalResultHi: 'कठोर इच्छाशक्ति, साहसी किंतु क्रोध व उतावलेपन पर नियंत्रण आवश्यक।' },
  7: { number: 7, nameEn: 'Sukarma', nameHi: 'सुकर्मा', natureEn: 'Virtuous deeds, righteous karma, generous, and accumulating clean wealth.', natureHi: 'सत्कर्मी', classicalResultEn: 'Engaged in noble undertakings, wealthy, ethical, and respected by society.', classicalResultHi: 'श्रेष्ठ धार्मिक कार्य, पवित्र धन और समाज में उच्च प्रतिष्ठा।' },
  8: { number: 8, nameEn: 'Dhriti', nameHi: 'धृति', natureEn: 'Patience, endurance, courageous resolve, and accumulated possessions.', natureHi: 'धैर्यवान्', classicalResultEn: 'Persevering spirit, wealthy, enduring hardships without breaking.', classicalResultHi: 'अथक धैर्य, धन-धान्य की संपन्नता और संकटों में अडिग रहना।' },
  9: { number: 9, nameEn: 'Shoola', nameHi: 'शूल', natureEn: 'Sharp, argumentative, combative, needs soothing spiritual grounding.', natureHi: 'तीक्ष्ण-शूल', classicalResultEn: 'Fiery temper, argumentative, victorious in debates, prone to spats.', classicalResultHi: 'तीव्र स्वभाव, वाद-विवाद में कुशल किंतु कलह से बचाव आवश्यक।' },
  10: { number: 10, nameEn: 'Ganda', nameHi: 'गण्ड', natureEn: 'Complex trials early in life, requiring moral vigilance and penance.', natureHi: 'गण्ड-दोष शमन', classicalResultEn: 'Undergoes tests of character; develops formidable inner strength through challenge.', classicalResultHi: 'जीवन में परीक्षा की घड़ियां, जिसे पार कर अत्यंत परिपक्व बनते हैं।' },
  11: { number: 11, nameEn: 'Vriddhi', nameHi: 'वृद्धि', natureEn: 'Growth, expanding fortunes, eloquent oratory, and commercial rise.', natureHi: 'अभिवृद्धि', classicalResultEn: 'Master orator, growing wealth, expanding business and family prestige.', classicalResultHi: 'प्रखर वक्ता, निरंतर बढ़ता हुआ व्यापार और पारिवारिक संपन्नता।' },
  12: { number: 12, nameEn: 'Dhruva', nameHi: 'ध्रुव', natureEn: 'Steady, steadfast, unshakable foundation, and very wealthy.', natureHi: 'अविचल-ध्रुव', classicalResultEn: 'Unwavering focus, permanent assets, rock-solid character and fortune.', classicalResultHi: 'अटल संकल्प, स्थायी संपत्ति और समाज में ध्रुवतारे जैसा दृढ़ स्थान।' },
  13: { number: 13, nameEn: 'Vyaghata', nameHi: 'व्याघात', natureEn: 'Fierce, striking, intrepid, formidable opponent in competition.', natureHi: 'प्रहारक-वीर', classicalResultEn: 'Courageous in battle, fierce adversary, must guard against harsh speech.', classicalResultHi: 'प्रतिस्पर्धा में भयंकर प्रहारक, पराक्रमी किंतु कटु वाणी से बचें।' },
  14: { number: 14, nameEn: 'Harshana', nameHi: 'हर्षण', natureEn: 'Joyous, intelligent, famous far and wide, spreading delight.', natureHi: 'आनंददाता', classicalResultEn: 'Profoundly wise, renowned across regions, jovial and universally loved.', classicalResultHi: 'अत्यंत ज्ञानी, दूर-देश तक विख्यात, प्रसन्नचित्त और सर्वप्रिय।' },
  15: { number: 15, nameEn: 'Vajra', nameHi: 'वज्र', natureEn: 'Diamond strength, impenetrable willpower, wealthy and passionate.', natureHi: 'वज्र-कवच', classicalResultEn: 'Resilient against attacks, prosperous, enjoys pleasures, decisive.', classicalResultHi: 'वज्र-समान दृढ़ काया, ऐश्वर्यवान, सुख-भोगी और निर्णयवान।' },
  16: { number: 16, nameEn: 'Siddhi', nameHi: 'सिद्धि', natureEn: 'Accomplished master, lord of undertakings, many people depend on them.', natureHi: 'सर्वसिद्ध', classicalResultEn: 'Natural protector, master of skills, broad entourage and authority.', classicalResultHi: 'कार्यों में पूर्ण सिद्धि, कई लोगों के आश्रयदाता और सत्तावान।' },
  17: { number: 17, nameEn: 'Vyatipata', nameHi: 'व्यतीपात', natureEn: 'Unpredictable, transformative, sharp strategist requiring ethical anchors.', natureHi: 'महा-रूपांतरणकारी', classicalResultEn: 'Strategic mind, sees through deceptions, needs ethical self-discipline.', classicalResultHi: 'रणनीतिकार, गुप्त रहस्यों के भेदी, नैतिक अनुशासन से ही महान उत्कर्ष।' },
  18: { number: 18, nameEn: 'Variyan', nameHi: 'वरीयान्', natureEn: 'Luxurious desires, ambitious, seeking supremacy, sensual comforts.', natureHi: 'वरीयता-प्राप्त', classicalResultEn: 'Passionate ambition, comfortable life, needs moderation in desires.', classicalResultHi: 'उच्च महत्वाकांक्षा, सुख-साधनों की प्राप्ति और महत्वाकांक्षी जीवन।' },
  19: { number: 19, nameEn: 'Parigha', nameHi: 'परिघ', natureEn: 'Defensive bastion, obstacle-breaker, wealthy, combative when provoked.', natureHi: 'दुर्ग-रक्षक', classicalResultEn: 'Protects clan like an iron wall, wealthy, relentless against adversaries.', classicalResultHi: 'परिवार का सुरक्षा-कवच, धनवान और विरोधियों के लिए अभेद्य।' },
  20: { number: 20, nameEn: 'Shiva', nameHi: 'शिव', natureEn: 'Scholarly, master of sacred Shastras, peaceful, beloved of royalty.', natureHi: 'कल्याणकारी शिव', classicalResultEn: 'Profound knowledge of all Shastras, peaceful disposition, honored by state.', classicalResultHi: 'समस्त शास्त्रों के मर्मज्ञ, शांत प्रकृति और शासन द्वारा सम्मानित।' },
  21: { number: 21, nameEn: 'Siddha', nameHi: 'सिद्ध', natureEn: 'Righteous, spiritual seeker, steadfast in dharmic rituals.', natureHi: 'तपस्वी सिद्ध', classicalResultEn: 'Devoted to spiritual upliftment, respected for integrity and purity.', classicalResultHi: 'धार्मिक अनुष्ठानों में निष्ठावान, पवित्र चरित्र और आदरणीय।' },
  22: { number: 22, nameEn: 'Sadhya', nameHi: 'साध्य', natureEn: 'Exemplary conduct, polite, disciplined, accomplishing all duties.', natureHi: 'सदाचारी', classicalResultEn: 'Flawless etiquette, methodical planner, reliable executor of tasks.', classicalResultHi: 'उत्तम शिष्टाचार, कर्तव्यपरायण और सभी कार्यों को साधने वाले।' },
  23: { number: 23, nameEn: 'Shubha', nameHi: 'शुभ', natureEn: 'Auspicious, charming, wealthy, refined, aesthetic connoisseur.', natureHi: 'शुभ-फलप्रद', classicalResultEn: 'Handsome appearance, abundant riches, cultured tastes, polite speech.', classicalResultHi: 'मनमोहक रूप, विपुल धन, सुरुचिपूर्ण स्वभाव और मधुर वाणी।' },
  24: { number: 24, nameEn: 'Shukla', nameHi: 'शुक्ल', natureEn: 'Pure, articulate, religious, truthful, occasional fiery indignation.', natureHi: 'निर्मल शुक्ल', classicalResultEn: 'Champion of truth, skilled communicator, righteous and knowledgeable.', classicalResultHi: 'सत्यवादी, प्रखर संवादकर्ता, ज्ञानी और अन्याय पर तुरंत कुपित होने वाले।' },
  25: { number: 25, nameEn: 'Brahma', nameHi: 'ब्रह्म', natureEn: 'Honorable, possesses secret resources, liberal, supreme judicial clarity.', natureHi: 'ब्रह्म-ज्ञानी', classicalResultEn: 'Revered in society, secret endowments, sound judicial discrimination.', classicalResultHi: 'समाज में पूज्य, गुप्त धन-स्रोतों के स्वामी और निष्पक्ष न्यायकर्ता।' },
  26: { number: 26, nameEn: 'Indra', nameHi: 'इन्द्र', natureEn: 'Universal benefactor, sovereign intellect, wealthy and influential.', natureHi: 'इन्द्र-तुल्य', classicalResultEn: 'Works for the greater collective good, brilliant intellect, royal wealth.', classicalResultHi: 'जनकल्याणकारी कार्य, असाधारण सर्वव्यापी मेधा और राजसी वैभव।' },
  27: { number: 27, nameEn: 'Vaidhriti', nameHi: 'वैधृति', natureEn: 'Powerful, charismatic, liberal, master of illusion and deep strategy.', natureHi: 'शक्तिशाली', classicalResultEn: 'Commanding persona, strategic critic, generous, accumulates vast wealth.', classicalResultHi: 'प्रभावशाली व्यक्तित्व, दूरदर्शी आलोचक, उदार और विशाल धन के स्वामी।' }
};

/* =========================================================================
   11. 11 KARANA PROFILES (बव से किंस्तुघ्न)
   ========================================================================= */
export const CLASSICAL_KARANAS: Record<string, KaranaProfile> = {
  Bava: { number: 1, nameEn: 'Bava', nameHi: 'बव', natureEn: 'Youthful enthusiasm, valiant (Pratapi), courageous, independent.', natureHi: 'प्रतापी व उत्साही', classicalResultEn: 'Acts with youthful vigor, valiant, bold in adversity, and respected.', classicalResultHi: 'बालक-समान निष्कपट उत्साह, प्रतापी, संकटों में निर्भीक और यशस्वी।' },
  Balava: { number: 2, nameEn: 'Balava', nameHi: 'बालव', natureEn: 'Polite, cultured, gentlemanly, honored by kings and state authorities.', natureHi: 'शिष्ट व राजमान्य', classicalResultEn: 'Exemplary manners, dignified, favored by authorities and institutions.', classicalResultHi: 'विनम्र आचरण, सुसंस्कृत और शासन व उच्चाधिकारियों द्वारा समादृत।' },
  Kaulava: { number: 3, nameEn: 'Kaulava', nameHi: 'कौलव', natureEn: 'Endowed with quadrupeds, transport, properties, aesthetic and attractive.', natureHi: 'ऐश्वर्यवान्', classicalResultEn: 'Commands vehicles, lands, cattle, performs charming and noble acts.', classicalResultHi: 'वाहन, भूमि व पशुधन के स्वामी, आकर्षक व्यक्तित्व और सुंदर कार्यों में रत।' },
  Taitila: { number: 4, nameEn: 'Taitila', nameHi: 'तैतिल', natureEn: 'Soft-spoken, persuasive, religious, righteous soul (Punyatma).', natureHi: 'पुण्यात्मा व सौम्य', classicalResultEn: 'Gentle and impressive communicator, deeply ethical, loved by all.', classicalResultHi: 'मृदुभाषी, अत्यंत प्रभावशाली वक्ता, धर्मपरायण और पुण्यात्मा।' },
  Garija: { number: 5, nameEn: 'Garija (Gara)', nameHi: 'गरिज (गर)', natureEn: 'Free of enemies, victorious in conflict, valiant, and resolute.', natureHi: 'अजातशत्रु व विजयी', classicalResultEn: 'Overcomes all adversaries, commands fearlessness, and achieves goals.', classicalResultHi: 'शत्रु-रहित अथवा विरोधियों पर पूर्ण विजयी, प्रतापी और लक्ष्य-साधक।' },
  Vanija: { number: 6, nameEn: 'Vanija', nameHi: 'वणिज', natureEn: 'Astute merchant, master orator, persuasive in commerce and romance.', natureHi: 'कुशल व्यापारी', classicalResultEn: 'Skillful orator, prospers in trade, highly charming in society.', classicalResultHi: 'वाक्पटु, व्यापार व वाणिज्य में प्रचुर लाभ और सामाजिक आकर्षण के धनी।' },
  Vishti: { number: 7, nameEn: 'Vishti (Bhadra)', nameHi: 'विष्टि (भद्रा)', natureEn: 'Independent, fierce, relentless fighter, honored by own clan.', natureHi: 'कठोर व स्वतंत्रचेता', classicalResultEn: 'Unyielding independence, courageous in dangerous missions, loyal to kin.', classicalResultHi: 'पूर्ण स्वतंत्र स्वभाव, साहसिक व कठिन कार्यों के निष्पादक, परिजनों के रक्षक।' },
  Shakuni: { number: 8, nameEn: 'Shakuni', nameHi: 'शकुनि', natureEn: 'Sees time and future, intuitive, clever, knowledgeable in human nature.', natureHi: 'कालदर्शी व चतुर', classicalResultEn: 'High intuitive foresight, understands human psychology, steady fortunes.', classicalResultHi: 'समय व भविष्य की गहरी समझ, मानव-मन के पारखी और स्थिर सुख।' },
  Chatushpada: { number: 9, nameEn: 'Chatushpada', nameHi: 'चतुष्पाद', natureEn: 'Polite, scholarly, famous, wealthy, caring for living beings.', natureHi: 'विद्वान व विख्यात', classicalResultEn: 'Profoundly educated, wealthy, renowned, and benevolent toward nature.', classicalResultHi: 'अत्यंत सुशिक्षित, धनवान, दूर-दूर तक विख्यात और दयालु परोपकारी।' },
  Naga: { number: 10, nameEn: 'Naga', nameHi: 'नाग', natureEn: 'Radiant (Tejasvi), highly affluent, honorable, talkative, formidable.', natureHi: 'तेजस्वी व संपन्न', classicalResultEn: 'Magnetic physical presence, powerful speech, rich and respected.', classicalResultHi: 'तेजस्वी आभा, शक्ति-संपन्न, प्रचुर धनवान और प्रभावशाली वक्ता।' },
  Kimstughna: { number: 11, nameEn: 'Kimstughna', nameHi: 'किंस्तुघ्न', natureEn: 'Altruistic, devoted to serving others, fond of joy and celebrations.', natureHi: 'परोपकारी व हर्षमुख', classicalResultEn: 'Selfless contributor to collective causes, generous and mirth-loving.', classicalResultHi: 'दूसरों के हित में कार्य करने वाले, परोपकारी, उदार और आनंद-प्रिय।' }
};

/* =========================================================================
   12. 12 GREGORIAN MONTH PROFILES (जनवरी से दिसंबर)
   ========================================================================= */
export const CLASSICAL_GREGORIAN_MONTHS: Record<number, GregorianMonthProfile> = {
  1: {
    monthIndex: 1,
    monthNameEn: 'January',
    monthNameHi: 'जनवरी',
    archetypeEn: 'Headstrong, strict professional code of conduct, unyielding willpower, natural leaders, and exceptional mentors.',
    archetypeHi: 'दृढ़ संकल्पी, कार्यस्थल पर कठोर अनुशासन, किसी के दबाव में न आने वाले, स्वाभाविक नेतृत्वकर्ता और श्रेष्ठ शिक्षक।'
  },
  2: {
    monthIndex: 2,
    monthNameEn: 'February',
    monthNameHi: 'फ़रवरी',
    archetypeEn: 'Endowed with abundant creativity, lover of intellectual depth, bohemian free spirit, adventurous traveler, and loyal partner.',
    archetypeHi: 'असीम रचनात्मकता, बौद्धिक विमर्श प्रेमी, स्वतंत्रचेता, प्रकृति व यात्रा प्रेमी और अत्यंत वफादार मित्र व साथी।'
  },
  3: {
    monthIndex: 3,
    monthNameEn: 'March',
    monthNameHi: 'मार्च',
    archetypeEn: 'Introspective, highly imaginative, artistic, gentle, seeking quietude, compassionate, and deeply protective of emotions.',
    archetypeHi: 'अंतर्मुखी, कल्पनाशक्ति संपन्न, कला-प्रेमी, सौम्य, शांत वातावरण की खोज करने वाले और संवेदनशील हृदय के धनी।'
  },
  4: {
    monthIndex: 4,
    monthNameEn: 'April',
    monthNameHi: 'अप्रैल',
    archetypeEn: 'Magnetic charisma, dominant, straightforward, impulsive courage, dislikes being bossed around, center of attraction.',
    archetypeHi: 'सम्मोहक व्यक्तित्व, मुखर, स्पष्टवादी, किसी के अधीन न रहने वाले, साहसी और महफिल के केंद्रबिंदु।'
  },
  5: {
    monthIndex: 5,
    monthNameEn: 'May',
    monthNameHi: 'मई',
    archetypeEn: 'Artistic talent in music and performance, socially dynamic, quick-witted, versatile, needing continuous stimulation.',
    archetypeHi: 'कला व संगीत में पारंगत, सामाजिक रूप से सक्रिय, चतुर, तीव्र बुद्धि और निरंतर नवीनता की चाह रखने वाले।'
  },
  6: {
    monthIndex: 6,
    monthNameEn: 'June',
    monthNameHi: 'जून',
    archetypeEn: 'Sensitive, lovable, foresighted, perceptive to feelings of others, deeply romantic, and creating creative opportunities.',
    archetypeHi: 'संवेदनशील, अत्यंत स्नेही, दूरदर्शी, दूसरों की भावनाओं के पारखी, रोमांटिक और रचनात्मक अवसरों के निर्माता।'
  },
  7: {
    monthIndex: 7,
    monthNameEn: 'July',
    monthNameHi: 'जुलाई',
    archetypeEn: 'Adventurous, sympathetic, cheerful countenance, fiercely loyal, deeply empathetic, with occasional profound introspection.',
    archetypeHi: 'साहसी, सहानुभूतिपूर्ण, प्रसन्नचित्त, वफादार साथी, गहरी संवेदना और कभी-कभी एकांतप्रिय चिंतक।'
  },
  8: {
    monthIndex: 8,
    monthNameEn: 'August',
    monthNameHi: 'अगस्त',
    archetypeEn: 'Community service, family values above all, philanthropic, hardworking, prosperous, and inspiring leaders.',
    archetypeHi: 'समाज-सेवा, पारिवारिक मूल्यों के रक्षक, परोपकारी, अथक परिश्रमी, धनवान और प्रेरणादायी मार्गदर्शक।'
  },
  9: {
    monthIndex: 9,
    monthNameEn: 'September',
    monthNameHi: 'सितंबर',
    archetypeEn: 'Organized genius, highly analytical, spiritual, deep thinker, sensitive to criticism, meticulously structuring life.',
    archetypeHi: 'सुव्यवस्थित, प्रखर विश्लेषक, आध्यात्मिक, गहन चिंतक, आलोचना के प्रति संवेदनशील और अपने क्षेत्र के जीनियस।'
  },
  10: {
    monthIndex: 10,
    monthNameEn: 'October',
    monthNameHi: 'अक्टूबर',
    archetypeEn: 'Charming, diplomatic, fair-minded, seeking aesthetic balance, peaceful resolution of disputes, and romantic grace.',
    archetypeHi: 'आकर्षक, कूटनीतिक, न्यायप्रिय, सौन्दर्य व संतुलन के आग्रही, विवादों के शांत समाधानकर्ता और सुरुचिपूर्ण।'
  },
  11: {
    monthIndex: 11,
    monthNameEn: 'November',
    monthNameHi: 'नवंबर',
    archetypeEn: 'Intense willpower, secretive researcher, magnetic aura, passionate, unyielding loyalty, and conquering challenges.',
    archetypeHi: 'अटूट इच्छाशक्ति, गूढ़ रहस्यों के खोजी, सम्मोहक आभा, अत्यंत समर्पित साथी और संकटों पर विजय पाने वाले।'
  },
  12: {
    monthIndex: 12,
    monthNameEn: 'December',
    monthNameHi: 'दिसंबर',
    archetypeEn: 'Generous, philosophical, adventurous, lover of truth and freedom, optimistic seeker of higher wisdom, and jovial.',
    archetypeHi: 'उदार, दार्शनिक, साहसी, सत्य व स्वतंत्रता के प्रेमी, आशावादी और उच्च जीवन-मूल्यों की खोज में रत।'
  }
};

/* =========================================================================
   13. 27 NAKSHATRA BIRTH PROFILES (अश्विनी से रेवती)
   ========================================================================= */
export const CLASSICAL_NAKSHATRAS: Record<number, NakshatraBirthProfile> = {
  0: { // Ashwini
    number: 1,
    nameEn: 'Ashwini',
    nameHi: 'अश्विनी',
    physicalFeaturesEn: 'Graceful and prominent eyes, broad forehead, well-proportioned nose, and dynamic agile carriage.',
    physicalFeaturesHi: 'सुंदर व विशाल नेत्र, चौड़ा ललाट, सुव्यवस्थित नासिका और स्फूर्तिवान मुद्रा।',
    psychologicalTraitsEn: 'Pleasing, dynamic, intelligent with youthful enthusiasm, rapid reflex response, swift thinking and execution, resolute in decisions, and courageous.',
    psychologicalTraitsHi: 'उत्साही, बुद्धिमान, तीव्र प्रतिक्रियावादी, सोचने के साथ ही क्रियान्वयन करने वाले, साहसी, दृढ़ निश्चयी और शोध-प्रवृत्ति के धनी।',
    lifeTrajectoryEn: 'Excels in research, emergency medicine, competitive sports, aviation, equine/automotive engineering, and pioneering ventures.',
    lifeTrajectoryHi: 'चिकित्सा, अनुसंधान, तकनीकी नवाचार, खेलकूद, साहसिक अभियान और स्वतंत्र उद्यमों में शीघ्र सफलता पाते हैं।'
  },
  1: { // Bharani
    number: 2,
    nameEn: 'Bharani',
    nameHi: 'भरणी',
    physicalFeaturesEn: 'Large expressive eyes, attractive charismatic smile, broad countenance, and sturdy neck.',
    physicalFeaturesHi: 'विशाल भावपूर्ण नेत्र, मोहक मुस्कान, चौड़ा मुख और बलिष्ठ ग्रीवा।',
    psychologicalTraitsEn: 'Aesthetic, affectionate, fond of luxury, keen judicial sense of right and wrong, experimental, undergoing profound life transformations.',
    psychologicalTraitsHi: 'विलासिता व सौन्दर्य-प्रेमी, न्यायप्रिय, प्रयोगधर्मी, तीव्र परिवर्तनशील जीवनधारा और स्पष्टवादी आलोचक।',
    lifeTrajectoryEn: 'Progresses through arts, judiciary, luxury goods, publishing, creative transformation, and unconventional enterprises.',
    lifeTrajectoryHi: 'कला, न्याय, मनोरंजन, विलासिता व्यापार और बड़े सामाजिक परिवर्तनों के माध्यम से मान-प्रतिष्ठा अर्जित करते हैं।'
  },
  2: { // Krittika
    number: 3,
    nameEn: 'Krittika',
    nameHi: 'कृत्तिका',
    physicalFeaturesEn: 'Sharp piercing gaze, prominent glowing forehead, energetic posture, and fiery presence.',
    physicalFeaturesHi: 'तीक्ष्ण भेदक दृष्टि, दीप्तिमान ललाट, ऊर्जावान मुद्रा और सूर्य-समान ओजस्वी व्यक्तित्व।',
    psychologicalTraitsEn: 'Sharp-minded, fiercely outspoken, courageous, energetic, moody with high temper, logical debater, pure-hearted, and intolerant of falsehood.',
    psychologicalTraitsHi: 'प्रखर बुद्धि, स्पष्टवादी, निडर, क्रोधी किंतु निर्मल हृदय, उत्कृष्ट तार्किक क्षमता और असत्य के प्रखर आलोचक।',
    lifeTrajectoryEn: 'Success in military, surgery, metallurgy, investigative journalism, culinary mastery, and leadership hierarchies.',
    lifeTrajectoryHi: 'सैन्य सेवा, शल्य-चिकित्सा, धातु उद्योग, खोजी पत्रकारिता और प्रशासनिक पदों पर नेतृत्वकारी भूमिका।'
  },
  3: { // Rohini
    number: 4,
    nameEn: 'Rohini',
    nameHi: 'रोहिणी',
    physicalFeaturesEn: 'Magnetic physical charm, hypnotic alluring eyes, shapely limbs, and center-of-attraction aura.',
    physicalFeaturesHi: 'आकर्षक सौन्दर्य, सम्मोहक नेत्र, सुडौल गठीला शरीर और महफिल को आकर्षित करने वाला आभा-मंडल।',
    psychologicalTraitsEn: 'Sweet-spoken, gentle, emotional, artistic imagination, material connoisseur, deeply creative, turning visions into reality.',
    psychologicalTraitsHi: 'मधुरभाषी, सौम्य, भावुक, समृद्ध कल्पनाशक्ति, ललित कलाओं के पारखी और कल्पना को ठोस धरातल पर साकार करने वाले।',
    lifeTrajectoryEn: 'Attains heights in agriculture, dairy, fashion, cinema, music, luxury architecture, and high commerce.',
    lifeTrajectoryHi: 'कृषि, कला, वस्त्र-व्यवसाय, अभिनय, संगीत, इंटीरियर डिजाइन और विलासिता उत्पादों के व्यापार में शीर्ष प्रतिष्ठा।'
  },
  4: { // Mrigashira
    number: 5,
    nameEn: 'Mrigashira',
    nameHi: 'मृगशिरा',
    physicalFeaturesEn: 'Handsome, tall, athletic physique, alert observant gaze, and gentle delicate movements.',
    physicalFeaturesHi: 'रूपवान, लंबा बलिष्ठ शरीर, चौकन्नी सतर्क दृष्टि और सौम्य सुरुचिपूर्ण चाल।',
    psychologicalTraitsEn: 'Alert, anticipates danger, supreme observer, seeker of new knowledge, romantic, gentle speech, restless mind, and brilliant investigator.',
    psychologicalTraitsHi: 'सतर्क, संकटों को पहले ही भांपने वाले, अद्वितीय पर्यवेक्षक, ज्ञान-पिपासु, शोधार्थी, संवेदनशील और निरंतर गतिशील मेधा।'
  },
  5: { // Ardra
    number: 6,
    nameEn: 'Ardra',
    nameHi: 'आर्द्रा',
    physicalFeaturesEn: 'Intense piercing eyes, robust tall frame, striking demeanor, and formidable presence.',
    physicalFeaturesHi: 'गंभीर भेदक आँखें, लंबा गठीला शरीर, प्रभावशाली व्यक्तित्व और प्रचंड आभा।',
    psychologicalTraitsEn: 'Emotionally deep, fierce tenacity, communicative prowess, capable of weathering destructive storms and emerging regenerated, spiritual seeker.',
    psychologicalTraitsHi: 'गहरी भावनाएं, अथक परिश्रमी, तूफानों से टकराने का साहस, संकटों के बाद नवनिर्माण करने वाले और गहन आध्यात्मिक साधक।'
  },
  6: { // Punarvasu
    number: 7,
    nameEn: 'Punarvasu',
    nameHi: 'पुनर्वसु',
    physicalFeaturesEn: 'Noble venerable countenance, dignified eyes, medium well-balanced physique, and serene bearing.',
    physicalFeaturesHi: 'कुलीन शांत मुखाकृति, गरिमामय नेत्र, संतुलित कद-काठी और सौम्य आचरण।',
    psychologicalTraitsEn: 'Truthful, deeply religious, benevolent mentor, persevering after setbacks, renews life after difficulties, and non-materialistic wisdom.',
    psychologicalTraitsHi: 'सत्यवादी, धर्मपरायण, परोपकारी, असफलताओं के बाद पुनः उठ खड़े होने वाले और शांति व सद्भाव के संरक्षक।'
  },
  7: { // Pushya
    number: 8,
    nameEn: 'Pushya',
    nameHi: 'पुष्य',
    physicalFeaturesEn: 'Full face, broad chest, tranquil peaceful eyes, and majestic dignified posture.',
    physicalFeaturesHi: 'तेजस्वी भरा-पूरा मुख, चौड़ा वक्षस्थल, शांत स्निग्ध नेत्र और गुरु-समान गरिमामय आभा।',
    psychologicalTraitsEn: 'Nourishing, religious, philanthropic, respected counselor, patient listener, disciplined, and steadfast friend.',
    psychologicalTraitsHi: 'पोषणकर्ता, अत्यंत धार्मिक, परोपकारी, श्रेष्ठ परामर्शदाता, धैर्यवान, अनुशासित और संकट में सदा सहायक।'
  },
  8: { // Ashlesha
    number: 9,
    nameEn: 'Ashlesha',
    nameHi: 'आश्लेषा',
    physicalFeaturesEn: 'Penetrating hypnotic eyes, supple flexible movements, and reserved secretive countenance.',
    physicalFeaturesHi: 'सम्मोहक तीक्ष्ण आँखें, लचीली शारीरिक भाव-भंगिमा और गूढ़ गंभीर मुखमुद्रा।',
    psychologicalTraitsEn: 'Deep psychological insight, intuitive strategist, protective of inner circle, shrewd diplomat, and penetrating intellect.',
    psychologicalTraitsHi: 'मनोवैज्ञानिक सूक्ष्मदर्शी, कूटनीतिक रणनीतिकार, अपनों के प्रति अति-सुरक्षात्मक, चतुर और गूढ़ विद्याओं के मर्मज्ञ।'
  },
  9: { // Magha
    number: 10,
    nameEn: 'Magha',
    nameHi: 'मघा',
    physicalFeaturesEn: 'Lion-like aristocratic carriage, prominent chin, royal posture, and commanding presence.',
    physicalFeaturesHi: 'सिंह-समान कुलीन चाल, सुपुष्ट चिबुक, राजसी ठाठ और स्वाभाविक नेतृत्वकारी व्यक्तित्व।',
    psychologicalTraitsEn: 'Ancestral pride, devoted to family lineage and pitrus, regal self-respect, generous patron, and unbending dignity.',
    psychologicalTraitsHi: 'कुल-गौरव, पितृ-भक्त, स्वाभिमानी, बड़े लक्ष्यों के प्रति समर्पित, उदार संरक्षक और सिद्धांतों के प्रति दृढ़।'
  },
  10: { // Purva Phalguni
    number: 11,
    nameEn: 'Purva Phalguni',
    nameHi: 'पूर्वाफाल्गुनी',
    physicalFeaturesEn: 'Round pleasing face, attractive radiant complexion, captivating smile, and graceful limbs.',
    physicalFeaturesHi: 'गोल सौम्य मुख, आकर्षक कांति, मनमोहक मुस्कान और सुरुचिपूर्ण शारीरिक गठन।',
    psychologicalTraitsEn: 'Sociable, connoisseur of music and arts, sweet conversationalist, generous host, and cultivating loving domestic peace.',
    psychologicalTraitsHi: 'सामाजिक, संगीत व कला प्रेमी, मधुर वक्ता, आतिथ्य-सत्कार में अग्रणी और दांपत्य सुख के आग्रही।'
  },
  11: { // Uttara Phalguni
    number: 12,
    nameEn: 'Uttara Phalguni',
    nameHi: 'उत्तराफाल्गुनी',
    physicalFeaturesEn: 'Tall sturdy frame, radiant forehead, steady confident gaze, and noble bearing.',
    physicalFeaturesHi: 'लंबा सुदृढ़ शरीर, दीप्तिमान ललाट, स्थिर आत्मविश्वासी दृष्टि और श्रेष्ठ व्यक्तित्व।',
    psychologicalTraitsEn: 'Patron of truth, noble humanitarian, enduring stamina, reliable executive, principled, and accumulating lasting institutional wealth.',
    psychologicalTraitsHi: 'सत्यनिष्ठ, मानवतावादी, अथक सहनशील, भरोसेमंद प्रशासक, नीतिवान और स्थायी प्रतिष्ठा व धन के स्वामी।'
  },
  12: { // Hasta
    number: 13,
    nameEn: 'Hasta',
    nameHi: 'हस्त',
    physicalFeaturesEn: 'Skillful dexterous hands, engaging pleasant face, sparkling eyes, and active agile movement.',
    physicalFeaturesHi: 'शिल्प-दक्ष हाथ, आकर्षक प्रसन्न मुख, चमकती आँखें और स्फूर्तिवान कार्यशैली।',
    psychologicalTraitsEn: 'Remarkable manual dexterity, witty, clever humor, quick calculator, practical healer, and resourceful problem solver.',
    psychologicalTraitsHi: 'हस्तशिल्प व तकनीकों में प्रवीण, हाजिरजवाब, चतुर, व्यावहारिक गणितज्ञ, उपचारक और संकट-मोचक मेधा।'
  },
  13: { // Chitra
    number: 14,
    nameEn: 'Chitra',
    nameHi: 'चित्रा',
    physicalFeaturesEn: 'Striking glamorous appearance, well-proportioned aesthetic limbs, and fashionable captivating aura.',
    physicalFeaturesHi: 'ग्लैमरस रूप-रंग, सुव्यवस्थित आकर्षक अंग-प्रत्यंग और सुरुचिपूर्ण सम्मोहक आभा।',
    psychologicalTraitsEn: 'Architectural genius, designer eye, aesthetic perfectionist, brave, eloquent debater, and creator of exquisite forms.',
    psychologicalTraitsHi: 'वास्तु व डिजाइन के जीनियस, सौन्दर्य-पूर्णतावादी, साहसी, प्रखर वक्ता और नवीन सुंदर रचनाओं के शिल्पी।'
  },
  14: { // Swati
    number: 15,
    nameEn: 'Swati',
    nameHi: 'स्वाती',
    physicalFeaturesEn: 'Slender elegant body, gentle expressive eyes, light step, and refined polished presence.',
    physicalFeaturesHi: 'छरहरा सुरुचिपूर्ण शरीर, सौम्य भावपूर्ण आँखें, हल्की सधी चाल और शिष्ट आभा।',
    psychologicalTraitsEn: 'Independent, pure-hearted, diplomatic, lover of freedom, intuitive trader, flexible yet morally anchored.',
    psychologicalTraitsHi: 'स्वाधीन, निर्मल हृदय, कूटनीतिक, स्वतंत्रता-प्रेमी, व्यापारिक दूरदृष्टा और लचीले किंतु नीति-निष्ठ।'
  },
  15: { // Vishakha
    number: 16,
    nameEn: 'Vishakha',
    nameHi: 'विशाखा',
    physicalFeaturesEn: 'Vibrant energetic countenance, sharp focused eyes, determined mouth, and purposeful carriage.',
    physicalFeaturesHi: 'तेजस्वी ऊर्जावान चेहरा, एकाग्र तीक्ष्ण आँखें, दृढ़ ओंठ और लक्ष्य-उन्मुख चाल।',
    psychologicalTraitsEn: 'Single-minded ambition, triumphing through relentless focus, competitive zeal, eloquent leadership, and enduring triumph.',
    psychologicalTraitsHi: 'एकाग्र महत्वाकांक्षा, निरंतर तप व श्रम से विजय पाने वाले, प्रतिस्पर्धी, ओजस्वी वक्ता और लक्ष्य-विजेता।'
  },
  16: { // Anuradha
    number: 17,
    nameEn: 'Anuradha',
    nameHi: 'अनुराधा',
    physicalFeaturesEn: 'Gentle attractive face, deep thoughtful eyes, medium balanced frame, and inviting demeanor.',
    physicalFeaturesHi: 'सौम्य आकर्षक मुख, गहरे विचारमग्न नेत्र, संतुलित शरीर और आत्मीय भाव।',
    psychologicalTraitsEn: 'Devoted friend, builds global bridges, deeply spiritual, organizational genius, resilient traveler, and overcoming obstacles abroad.',
    psychologicalTraitsHi: 'मित्रता के प्रति समर्पित, वैश्विक संपर्क निर्माता, आध्यात्मिक, संस्थागत संगठनकर्ता और विदेश यात्राओं से भाग्योदय।'
  },
  17: { // Jyeshtha
    number: 18,
    nameEn: 'Jyeshtha',
    nameHi: 'ज्येष्ठा',
    physicalFeaturesEn: 'Commanding authoritative posture, piercing mature eyes, prominent forehead, and aristocratic aura.',
    physicalFeaturesHi: 'प्रशासनिक रौबदार मुद्रा, तीक्ष्ण गंभीर आँखें, उन्नत ललाट और वरिष्ठता की आभा।',
    psychologicalTraitsEn: 'Eldership stature, protective warrior of clan, strategic defense, high intellect, pride, and rising to prominent leadership.',
    psychologicalTraitsHi: 'वरिष्ठ नेतृत्व, कुल के रक्षक, रणनीतिक सुरक्षा के विशेषज्ञ, तीक्ष्ण मेधा, स्वाभिमानी और शीर्ष पदों पर आसीन।'
  },
  18: { // Mula
    number: 19,
    nameEn: 'Mula',
    nameHi: 'मूल',
    physicalFeaturesEn: 'Lean resilient physique, penetrating introspective eyes, prominent nose, and purposeful gait.',
    physicalFeaturesHi: 'गठीला सहनशील शरीर, अंतर्मुखी भेदक दृष्टि, उन्नत नासिका और दृढ़ कदम।',
    psychologicalTraitsEn: 'Root investigator, breaks through illusions to fundamental truth, philosophical courage, transformative pioneer, and resilient conqueror.',
    psychologicalTraitsHi: 'जड़ों तक अनुसंधान करने वाले, भ्रमों का नाश कर सत्य खोजने वाले, दार्शनिक साहसी और आमूलचूल परिवर्तनकारी।'
  },
  19: { // Purva Ashadha
    number: 20,
    nameEn: 'Purva Ashadha',
    nameHi: 'पूर्वाषाढ़ा',
    physicalFeaturesEn: 'Proud magnetic stance, handsome radiant face, expressive joyful eyes, and sturdy build.',
    physicalFeaturesHi: 'गर्वोन्नत सम्मोहक मुद्रा, रूपवान तेजस्वी मुख, प्रसन्न भावपूर्ण नेत्र और सुदृढ़ गठन।',
    psychologicalTraitsEn: 'Invincible confidence, persuasive speaker, loyal ally, deeply philosophic, patient, and achieving undefeated victory.',
    psychologicalTraitsHi: 'अडिग आत्मविश्वास, सम्मोहक वक्ता, निष्ठावान मित्र, दार्शनिक, धैर्यवान और अंततः अपराजित सफलता पाने वाले।'
  },
  20: { // Uttara Ashadha
    number: 21,
    nameEn: 'Uttara Ashadha',
    nameHi: 'उत्तराषाढ़ा',
    physicalFeaturesEn: 'Tall dignified frame, serene broad forehead, calm penetrating eyes, and sovereign demeanor.',
    physicalFeaturesHi: 'लंबा गरिमामय शरीर, शांत चौड़ा ललाट, धीर-गंभीर आँखें और शासक-समान उपस्थिति।',
    psychologicalTraitsEn: 'Steadfast integrity, universal respect, disciplined, patient humanitarian, conquering slowly but permanently.',
    psychologicalTraitsHi: 'अखंड सत्यनिष्ठा, सर्वमान्य आदरणीय, अनुशासित, मानवतावादी और स्थायी व अटूट कीर्ति स्थापित करने वाले।'
  },
  21: { // Shravana
    number: 22,
    nameEn: 'Shravana',
    nameHi: 'श्रवण',
    physicalFeaturesEn: 'Refined noble visage, attentive listening eyes, well-formed ears, and peaceful serene presence.',
    physicalFeaturesHi: 'शिष्ट कुलीन चेहरा, ध्यानमग्न श्रवणशील नेत्र, सुंदर कर्ण और शांत सौम्य आभा।',
    psychologicalTraitsEn: 'Supreme listener, profound scholar of oral and written knowledge, philanthropic, counseling mentor, and devoted to truth.',
    psychologicalTraitsHi: 'उत्कृष्ट श्रोता, श्रुति व शास्त्रों के मर्मज्ञ विद्वान, परोपकारी, मार्गदर्शक परामर्शदाता और धर्म-रक्षक।'
  },
  22: { // Dhanishta
    number: 23,
    nameEn: 'Dhanishta',
    nameHi: 'धनिष्ठा',
    physicalFeaturesEn: 'Rhythmic agile movements, radiant attractive eyes, athletic carriage, and prosperous magnetic aura.',
    physicalFeaturesHi: 'लयबद्ध स्फूर्तिवान चाल, चमकदार आकर्षक नेत्र, गठीला शरीर और समृद्ध चुंबकीय आभा।',
    psychologicalTraitsEn: 'Gifted in music and rhythm, wealthy, generous benefactor, courageous coordinator, and acquiring extensive properties.',
    psychologicalTraitsHi: 'संगीत व ताल में निष्णात, धनवान, उदार दाता, साहसी संयोजक और विशाल संपत्तियों के स्वामी।'
  },
  23: { // Shatabhisha
    number: 24,
    nameEn: 'Shatabhisha',
    nameHi: 'शतभिषा',
    physicalFeaturesEn: 'Enigmatic deep gaze, reserved dignified carriage, sharp observant eyes, and solitary fortitude.',
    physicalFeaturesHi: 'रहस्यमयी गंभीर दृष्टि, संयमित गरिमामय मुद्रा, सूक्ष्मदर्शी आँखें और एकांतप्रिय धैर्य।',
    psychologicalTraitsEn: 'Master healer, scientific analyst, visionary seeing hidden patterns, private researcher, and overcoming chronic obstacles.',
    psychologicalTraitsHi: 'महा-आरोग्यदाता, वैज्ञानिक विश्लेषक, छिपे सत्यों के द्रष्टा, गहन शोधकर्ता और असाध्य संकटों के निवारक।'
  },
  24: { // Purva Bhadrapada
    number: 25,
    nameEn: 'Purva Bhadrapada',
    nameHi: 'पूर्वाभाद्रपद',
    physicalFeaturesEn: 'Tall imposing build, intense visionary eyes, passionate expression, and transformative posture.',
    physicalFeaturesHi: 'लंबा प्रभावशाली शरीर, गहन दूरदर्शी आँखें, ओजस्वी भाव और रूपांतरणकारी मुद्रा।',
    psychologicalTraitsEn: 'Dual-natured depth, fiery dedication to high ideals, profound ascetic potential, fearless philosopher, and protective mentor.',
    psychologicalTraitsHi: 'द्वैत-प्रकृति की गहराई, उच्च आदर्शों के प्रति प्रखर समर्पण, तपस्वी क्षमता, निर्भीक दार्शनिक और रक्षक गुरु।'
  },
  25: { // Uttara Bhadrapada
    number: 26,
    nameEn: 'Uttara Bhadrapada',
    nameHi: 'उत्तराभाद्रपद',
    physicalFeaturesEn: 'Calm ocean-like tranquil eyes, sturdy balanced limbs, serene smiling countenance, and deep stillness.',
    physicalFeaturesHi: 'समुद्र-समान शांत अगाध नेत्र, संतुलित सुदृढ़ शरीर, सौम्य शांत मुख और गंभीर स्थिरता।',
    psychologicalTraitsEn: 'Boundless wisdom, profound emotional control, compassionate counselor, patient executor of lasting institutions, and spiritual adept.',
    psychologicalTraitsHi: 'अगाध ज्ञान, भावनात्मक संतुलन, करुणामय परामर्शदाता, दीर्घकालिक संस्थाओं के निर्माता और आध्यात्मिक सिद्ध।'
  },
  26: { // Revati
    number: 27,
    nameEn: 'Revati',
    nameHi: 'रेवती',
    physicalFeaturesEn: 'Graceful symmetrical beauty, soft luminous eyes, gentle welcoming smile, and enchanting harmony.',
    physicalFeaturesHi: 'सुडौल सौन्दर्य, कोमल ज्योतिर्मय नेत्र, स्नेहिल मुस्कान और मनमोहक समरसता।',
    psychologicalTraitsEn: 'Pure-hearted, supreme counselor, deeply intuitive, lover of living beings, artistic imagination, and ushering souls into peace.',
    psychologicalTraitsHi: 'निर्मल हृदय, श्रेष्ठ परामर्शदाता, अतींद्रिय अंतर्दृष्टि, जीव-दयालु, समृद्ध कलात्मक कल्पना और लोक-कल्याणकारी।'
  }
};
