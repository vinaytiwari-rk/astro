/* =========================================================================
   DR. K.S. CHARAK & FAR FAR AWAY CLASSICAL VEDIC ASTROLOGY KNOWLEDGE BASE
   Sources:
   1. "Elements of Vedic Astrology" (Vol 1 & 2, 518 Pages)
      by Dr. K.S. Charak, M.S. (Surgery), F.R.C.S. (Glasgow)
      Head of the Department of Astrology, Bharatiya Vidya Bhavan (BVB), New Delhi.
      Uma Publications.
   2. "Basics of Vedic Astrology: Houses, Planets and Signs"
      by Far Far Away (farfaraway.co/blog/basics-of-vedic-astrology)
   ========================================================================= */

export interface ClassicalTreatiseMetadata {
  title: string;
  author: string;
  affiliation: string;
  url: string;
  pagesOrLength: string;
  scope: string;
  fundamentalAxiomEn: string;
  fundamentalAxiomHi: string;
}

export const DR_CHARAK_BOOK_METADATA: ClassicalTreatiseMetadata = {
  title: 'Elements of Vedic Astrology (Volumes 1 & 2)',
  author: 'Dr. K.S. Charak, M.S. (Surgery), F.R.C.S. (Glasgow)',
  affiliation: 'Head of Department of Astrology, Bharatiya Vidya Bhavan (BVB), New Delhi',
  url: 'https://astrofoxx.wordpress.com/wp-content/uploads/2018/11/jyotish_elements-of-vedic-astrology_k-s-charak-1.pdf',
  pagesOrLength: '518 Pages Comprehensive Parashari Treatise',
  scope: 'Standard textbook of Vedic astrology at Bharatiya Vidya Bhavan. Covers Parashari fundamentals, 144 Bhavesha combinations, 9 planets in 12 houses & 12 signs, planetary aspects, Nabhasa & Raja Yogas, medical astrology, transits with Vedha, and Sudarshana Chakra.',
  fundamentalAxiomEn: 'A birth chart is an interplay of three cosmic energies: planets, signs, and houses. The static promise embedded in the natal chart is unlocked and brought to fruition by planetary operational periods (Dashas) and validated by transits (Gochara).',
  fundamentalAxiomHi: 'जन्म कुंडली तीन मौलिक ऊर्जाओं का समन्वय है: ग्रह, राशियां और भाव। कुंडली में निहित स्थायी वचन (Static Promise) दशाओं के संचालन काल में जागृत होता है और गोचर द्वारा घटना के रूप में घटित होता है।'
};

export const FARFARAWAY_SYNTHESIS_METADATA: ClassicalTreatiseMetadata = {
  title: 'Basics of Vedic Astrology: Houses, Planets and Signs',
  author: 'Far Far Away',
  affiliation: 'Modern Classical Synthesis & Applied Astrological Analytics',
  url: 'https://www.farfaraway.co/blog/basics-of-vedic-astrology',
  pagesOrLength: 'Comprehensive Analytical Guide',
  scope: '33 Elemental energies of the birth chart (9 Planets + 12 Houses + 12 Signs). Provides deep psychological orientation, modern career mappings, anatomical organ correlations, house happiness matrix, and planetary conjunction relationships.',
  fundamentalAxiomEn: 'Planets are the actors, signs are the roles they assume, and houses are the real-world arenas where the drama of life unfolds.',
  fundamentalAxiomHi: 'ग्रह जीवन रंगमंच के अभिनेता हैं, राशियां उनकी वेशभूषा व स्वभाव हैं, और १२ भाव वे वास्तविक जीवन क्षेत्र हैं जहां कर्म का फल साकार होता है।'
};

export interface CharakBhavaProfile {
  house: number;
  sanskritName: string;
  englishName: string;
  classification: 'Kendra' | 'Trikona' | 'Upachaya' | 'Dusthana' | 'Maraka' | 'Kendra & Trikona' | 'Kendra & Maraka';
  primaryKarakas: string[];
  primaryKarakasHi: string[];
  bodyPartsEn: string;
  bodyPartsHi: string;
  coreThemesEn: string;
  coreThemesHi: string;
  modernCareersEn: string[];
  modernCareersHi: string[];
  happinessMatrix: {
    superHappy: string[];
    happy: string[];
    neutral: string[];
    unhappy: string[];
  };
  eventManifestationEn: string;
  eventManifestationHi: string;
}

export const CHARAK_BHAVA_12_CORPUS: Record<number, CharakBhavaProfile> = {
  1: {
    house: 1,
    sanskritName: 'Tanu Bhava (तनु भाव / लग्न)',
    englishName: 'First House (Ascendant / Lagna)',
    classification: 'Kendra & Trikona',
    primaryKarakas: ['Sun'],
    primaryKarakasHi: ['सूर्य'],
    bodyPartsEn: 'Head, brain, skull, facial contour, overall physical constitution, and vitality.',
    bodyPartsHi: 'मस्तिष्क, सिर, कपाल, शारीरिक गठन, आभा मंडल एवं देह की संपूर्ण जीवनशक्ति।',
    coreThemesEn: 'Innate nature, personality, psychological orientation, individuality, self-confidence, charisma, temperament, general health, life path, and first impressions.',
    coreThemesHi: 'मूल स्वभाव, व्यक्तित्व, आत्म-सम्मान, आत्मविश्वास, आभा, शारीरिक स्वास्थ्य, जीवन का सर्वोच्च उद्देश्य और समाज पर पहला प्रभाव।',
    modernCareersEn: ['Executive Leadership', 'Public Figures', 'Athletics & Sports', 'Entrepreneurs', 'Personal Brand Builders'],
    modernCareersHi: ['शीर्ष प्रशासनिक नेतृत्व', 'सार्वजनिक व्यक्तित्व', 'खेलकूद व सैन्य पराक्रम', 'उद्यमिता', 'स्वतंत्र पहचान निर्माण'],
    happinessMatrix: {
      superHappy: ['Sun', 'Mars'],
      happy: ['Jupiter', 'Mercury', 'Venus'],
      neutral: ['Moon'],
      unhappy: ['Saturn']
    },
    eventManifestationEn: 'When House 1 is activated by favorable lords and Dashas, native commands respect, overcomes health setbacks, and attains independent breakthrough around ages 24-28.',
    eventManifestationHi: 'लग्न भाव की शुभ दशा में जातक तेजस्वी व्यक्तित्व, दीर्घायु, उत्तम आरोग्य और समाज में स्वाभाविक नेतृत्व प्राप्त करता है; आयु २४-२८ वर्ष में स्वतंत्र भाग्योदय होता है।'
  },
  2: {
    house: 2,
    sanskritName: 'Dhana Bhava (धन भाव / कुटुंब)',
    englishName: 'Second House (Wealth, Lineage & Speech)',
    classification: 'Maraka',
    primaryKarakas: ['Jupiter'],
    primaryKarakasHi: ['बृहस्पति'],
    bodyPartsEn: 'Face, mouth, throat, vocal cords, right eye, teeth, tongue, and neck.',
    bodyPartsHi: 'मुख, गला, स्वर-तंत्र, दाहिनी आंख, दांत, जिह्वा, और कंठ।',
    coreThemesEn: 'Accumulated wealth, liquid savings, bank deposits, bullion, jewels, family lineage, childhood upbringing, voice texture, dietary habits, and truthfulness.',
    coreThemesHi: 'संचित कोष, बैंक जमा, स्वर्ण-आभूषण, पैतृक संस्कार, प्रारंभिक विद्या, वाणी का ओज, खान-पान की आदतें और सत्यवादिता।',
    modernCareersEn: ['Banking & Wealth Management', 'Culinary Arts & Food Industry', 'Dentistry & ENT', 'Voice Acting & Singing', 'Classical Linguistics & Astrology'],
    modernCareersHi: ['बैंकिंग व वित्तीय प्रबंधन', 'पाक कला व खाद्य उद्योग', 'दंत व कंठ चिकित्सा', 'गायन व उद्घोषणा', 'भाषा विज्ञान व ज्योतिष'],
    happinessMatrix: {
      superHappy: ['Venus'],
      happy: ['Jupiter', 'Moon'],
      neutral: ['Sun', 'Mercury', 'Mars'],
      unhappy: []
    },
    eventManifestationEn: 'Strong 2nd house secures substantial family inheritance, financial multiplication at age 28-32, and an authoritative or melodic speech.',
    eventManifestationHi: 'द्वितीय भाव की शुभता स्थायी धन संचय, कुटुंब का सहयोग एवं आयु २८-३२ वर्ष में पैतृक व स्व-अर्जित कोष में उल्लेखनीय वृद्धि कराती है।'
  },
  3: {
    house: 3,
    sanskritName: 'Sahaja Bhava (सहज भाव / पराक्रम)',
    englishName: 'Third House (Courage, Enterprise & Siblings)',
    classification: 'Upachaya',
    primaryKarakas: ['Mars'],
    primaryKarakasHi: ['मंगल'],
    bodyPartsEn: 'Arms, hands, shoulders, collarbone, lungs, upper chest, and right ear.',
    bodyPartsHi: 'भुजाएं, हाथ, कंधे, हंसली, फेफड़े, ऊपरी वक्ष, और दायां कान।',
    coreThemesEn: 'Valour, willpower, risk-taking, self-made enterprise, communication skills, writing, media, journalism, short travels, younger siblings, and neighbors.',
    coreThemesHi: 'साहस, पुरुषार्थ, जोखिम क्षमता, स्व-प्रयास से सफलता, लेखन, पत्रकारिता, जनसंचार, लघु यात्राएं, छोटे भाई-बहन और पड़ोस।',
    modernCareersEn: ['Journalism & Digital Media', 'Content Creation & Advertising', 'Software Engineering & Analytics', 'Mechanical Crafts & Surgery', 'Professional Athletics'],
    modernCareersHi: ['पत्रकारिता व डिजिटल मीडिया', 'विज्ञापन व कंटेंट क्रिएशन', 'सॉफ्टवेयर इंजीनियरिंग', 'शल्य चिकित्सा व यांत्रिक शिल्प', 'व्यावसायिक खेल'],
    happinessMatrix: {
      superHappy: ['Mercury'],
      happy: ['Mars', 'Saturn'],
      neutral: ['Sun', 'Moon', 'Jupiter', 'Venus'],
      unhappy: []
    },
    eventManifestationEn: 'Malefics like Mars or Saturn here grant self-made triumphs, courage against obstacles, and rewarding entrepreneurial ventures around age 28.',
    eventManifestationHi: 'तृतीय भाव में मंगल या शनि जातक को स्वावलंबी, साहसी, निर्भीक और स्व-प्रयास से सफल उद्यमी बनाते हैं; आयु २८ वर्ष में पराक्रम से भाग्योदय होता है।'
  },
  4: {
    house: 4,
    sanskritName: 'Sukha Bhava (सुख भाव / मातृ भाव)',
    englishName: 'Fourth House (Home, Mother & Inner Peace)',
    classification: 'Kendra',
    primaryKarakas: ['Moon'],
    primaryKarakasHi: ['चंद्रमा'],
    bodyPartsEn: 'Chest, breast, heart, ribs, diaphragm, and lungs.',
    bodyPartsHi: 'वक्षस्थल, हृदय, पसलियां, फेफड़े और छाती।',
    coreThemesEn: 'Mother, domestic tranquility, peace of mind, ancestral real estate, vehicles, land development, formal school education, and deep subconscious emotional roots.',
    coreThemesHi: 'माता का स्नेह, गृह सुख, मानसिक शांति, भूमि-भवन, वाहन सुख, अचल संपत्ति, प्रारंभिक औपचारिक शिक्षा और अंतःकरण की स्थिरता।',
    modernCareersEn: ['Real Estate & Construction', 'Architecture & Interior Design', 'Automobile Engineering', 'Agriculture & Dairy Farming', 'Psychology & Caregiving'],
    modernCareersHi: ['रियल एस्टेट व निर्माण उद्योग', 'वास्तुकला व इंटीरियर डिजाइन', 'ऑटोमोबाइल इंजीनियरिंग', 'कृषि व दुग्ध उद्योग', 'मनोविज्ञान व सेवा क्षेत्र'],
    happinessMatrix: {
      superHappy: ['Moon', 'Jupiter'],
      happy: ['Venus'],
      neutral: ['Sun', 'Mercury'],
      unhappy: ['Mars']
    },
    eventManifestationEn: 'Favorable 4th house grants luxurious homes, vehicle acquisition at age 27-31, maternal blessing, and profound emotional contentment.',
    eventManifestationHi: 'चतुर्थ भाव की शुभता से माता का पूर्ण आशीर्वाद, आयु २७-३१ वर्ष में वाहन सुख एवं ३३-३७ वर्ष में स्वयं के भव्य गृह निर्माण का योग बनता है।'
  },
  5: {
    house: 5,
    sanskritName: 'Putra Bhava (पुत्र भाव / पूर्वपुण्य)',
    englishName: 'Fifth House (Progeny, Higher Intellect & Purva Punya)',
    classification: 'Trikona',
    primaryKarakas: ['Jupiter'],
    primaryKarakasHi: ['बृहस्पति'],
    bodyPartsEn: 'Upper abdomen, stomach, liver, pancreas, spleen, and spine.',
    bodyPartsHi: 'ऊपरी पेट, आमाशय, यकृत (लिवर), अग्न्याशय, तिल्ली और रीढ़ की हड्डी।',
    coreThemesEn: 'Intellectual brilliance, creative arts, progeny, romance, mantra sadhana, past-life merits (Purva Punya), speculative gains, discretion, and advisory wisdom.',
    coreThemesHi: 'तीक्ष्ण मेधा, सृजनात्मक कलाएं, संतान सुख, प्रणय संबंध, मंत्र साधना, पूर्व जन्म के संचित पुण्य, सट्टा/शेयर लाभ और परामर्श कौशल।',
    modernCareersEn: ['Creative Direction & Filmmaking', 'Equity Trading & Portfolio Management', 'Education & Professorship', 'Diplomacy & Political Advisory', 'Data Science & Algorithm Design'],
    modernCareersHi: ['फिल्म निर्माण व रचनात्मक लेखन', 'शेयर बाजार व वित्तीय निवेश', 'उच्च शिक्षा व प्राध्यापक', 'राजनीतिक व कूटनीतिक सलाहकार', 'डेटा साइंस व शोध'],
    happinessMatrix: {
      superHappy: ['Sun', 'Venus'],
      happy: ['Jupiter', 'Mercury', 'Mars'],
      neutral: ['Moon'],
      unhappy: []
    },
    eventManifestationEn: 'Trinal grace of 5th house unlocks academic honors, birth of worthy progeny (age 26-30), high speculative returns, and spiritual discernment.',
    eventManifestationHi: 'पंचम भाव की कृपा से उच्च शिक्षा में स्वर्ण पदक, सुयोग्य संतान योग (आयु २६-३० वर्ष), शोध व निवेश से अप्रत्याशित लाभ और मंत्र सिद्धि प्राप्त होती है।'
  },
  6: {
    house: 6,
    sanskritName: 'Ripu/Roga Bhava (रिपु भाव / ऋण व व्याधि)',
    englishName: 'Sixth House (Debts, Disease, Enemies & Service)',
    classification: 'Dusthana',
    primaryKarakas: ['Mars', 'Saturn'],
    primaryKarakasHi: ['मंगल', 'शनि'],
    bodyPartsEn: 'Kidneys, lower abdomen, large intestine, navel area, and hips.',
    bodyPartsHi: 'गुर्दे (किडनी), निचला पेट, बड़ी आंत, नाभि क्षेत्र और कमर।',
    coreThemesEn: 'Day-to-day employment, service attitude, debts, acute diseases, litigations, rivals, competitive examinations, maternal uncles, and problem-solving resilience.',
    coreThemesHi: 'दैनिक कार्यप्रणाली, सेवा भाव, ऋण, रोग, शत्रु, कानूनी विवाद, प्रतियोगी परीक्षाएं, ननिहाल पक्ष और विपत्तियों पर विजय की क्षमता।',
    modernCareersEn: ['Medicine & Surgery', 'Law & Litigation', 'Civil Services & Policing', 'Banking Risk & Credit Recovery', 'Animal Care & Veterinary'],
    modernCareersHi: ['शल्य व सामान्य चिकित्सा', 'वकालत व न्यायपालिका', 'प्रशासनिक व पुलिस सेवा', 'बैंकिंग ऋण व जोखिम प्रबंधन', 'पशु कल्याण व सेवा'],
    happinessMatrix: {
      superHappy: ['Mercury'],
      happy: ['Mars', 'Saturn'],
      neutral: ['Sun'],
      unhappy: ['Venus']
    },
    eventManifestationEn: 'Strong benefics or well-placed malefics in 6th house ensure total triumph over adversaries, clearance of liabilities, and competitive exam success.',
    eventManifestationHi: 'षष्ठ भाव में बली क्रूर ग्रह शत्रुओं का दमन करते हैं, प्रतियोगी परीक्षाओं में शीर्ष सफलता दिलाते हैं और ऋणों से पूर्ण मुक्ति कराते हैं।'
  },
  7: {
    house: 7,
    sanskritName: 'Kalatra Bhava (कलत्र भाव / जाया भाव)',
    englishName: 'Seventh House (Marriage, Partnerships & Public Deals)',
    classification: 'Kendra & Maraka',
    primaryKarakas: ['Venus'],
    primaryKarakasHi: ['शुक्र'],
    bodyPartsEn: 'Lower pelvic region, urinary tract, internal reproductive organs, and prostate.',
    bodyPartsHi: 'श्रोणि प्रदेश (पेल्विक), मूत्र तंत्र, आंतरिक जननांग और प्रोस्टेट।',
    coreThemesEn: 'Spouse, quality of marital union, business partnerships, contractual agreements, commercial trade, public image, and foreign residences.',
    coreThemesHi: 'जीवनसाथी का स्वरूप, दांपत्य जीवन की गुणवत्ता, व्यापारिक साझीदारी, अनुबंध, वाणिज्य, लोक संपर्क और सुदूर यात्राएं।',
    modernCareersEn: ['Corporate Law & Contracts', 'International Trade & Commerce', 'Public Relations & Brand Alliances', 'Marriage & Family Counseling', 'Hospitality & Luxury Retail'],
    modernCareersHi: ['व्यापारिक कानून व अनुबंध', 'अंतरराष्ट्रीय व्यापार व वाणिज्य', 'जनसंपर्क व ब्रांड पार्टनरशिप', 'पारिवारिक व दांपत्य परामर्श', 'आतिथ्य व विलासिता व्यापार'],
    happinessMatrix: {
      superHappy: ['Venus', 'Saturn'],
      happy: ['Moon', 'Mercury'],
      neutral: ['Jupiter'],
      unhappy: ['Sun', 'Mars']
    },
    eventManifestationEn: 'Well-aspected 7th house confers cultured, wealthy spouse around age 25-29, lucrative business pacts, and solid public stature.',
    eventManifestationHi: 'सप्तम भाव की शुभता से आयु २५-२९ वर्ष में सुसंस्कृत व साधन-संपन्न जीवनसाथी से विवाह, सफल व्यापारिक साझेदारी और उच्च सामाजिक साख मिलती है।'
  },
  8: {
    house: 8,
    sanskritName: 'Ayur/Randhra Bhava (आयु भाव / रंध्र भाव)',
    englishName: 'Eighth House (Longevity, Transformation & Occult Secrets)',
    classification: 'Dusthana',
    primaryKarakas: ['Saturn'],
    primaryKarakasHi: ['शनि'],
    bodyPartsEn: 'External genital organs, excretory system, perineum, and pelvic floor.',
    bodyPartsHi: 'वाह्य जननांग, गुदा व उत्सर्जन तंत्र, मलाशय और अस्थि मज्जा।',
    coreThemesEn: 'Longevity (Ayurdaya), chronic ailments, unexpected crises, sudden windfalls, inheritances, occult research, deep secrets, marital legacy, and resurrection after trials.',
    coreThemesHi: 'दीर्घायु, असाध्य रोग, अप्रत्याशित संकट, अचानक धन लाभ, वसीयत, गुप्त विद्याएं (ज्योतिष/तंत्र), जीवन का कायाकल्प और रहस्यों का उद्घाटन।',
    modernCareersEn: ['Cybersecurity & Intelligence', 'Petroleum & Mineral Mining', 'Actuarial Science & Insurance', 'Epidemiology & Virology Research', 'Forensic Accounting & Auditing'],
    modernCareersHi: ['साइबर सुरक्षा व गुप्तचर सेवा', 'पेट्रोलियम व खनन उद्योग', 'बीमा व सांख्यिकी विज्ञान', 'महामारी विज्ञान व विषाणु शोध', 'फोरेंसिक ऑडिटिंग व कर जांच'],
    happinessMatrix: {
      superHappy: [],
      happy: ['Mars'],
      neutral: ['Saturn'],
      unhappy: ['Moon']
    },
    eventManifestationEn: 'When protected by benefics, grants longevity past 75+ years, profound esoteric discoveries, and sudden financial inheritances.',
    eventManifestationHi: 'अष्टम भाव शुभ दृष्ट होने पर दीर्घायु योग (७५+ वर्ष), गूढ़ अनुसंधान में वैश्विक ख्याति तथा अप्रत्याशित वसीयत या आकस्मिक धन लाभ कराता है।'
  },
  9: {
    house: 9,
    sanskritName: 'Dharma/Bhagya Bhava (धर्म भाव / भाग्य भाव)',
    englishName: 'Ninth House (Fortune, Dharma, Preceptors & Long Travel)',
    classification: 'Trikona',
    primaryKarakas: ['Jupiter'],
    primaryKarakasHi: ['बृहस्पति'],
    bodyPartsEn: 'Hips, thighs, femoral arteries, and sacral region.',
    bodyPartsHi: 'नितंब, जंघाएं (थाइज), ऊरु धमनियां और त्रिक अस्थि।',
    coreThemesEn: 'Good fortune, moral virtues, father, spiritual preceptors (Gurus), pilgrimages, international long-distance travel, jurisprudence, and higher philosophical knowledge.',
    coreThemesHi: 'परम भाग्य, धर्म, सदाचार, पिता, गुरु कृपा, तीर्थाटन, सुदूर विदेश यात्राएं, न्यायशास्त्र और उच्चतर दार्शनिक ज्ञान।',
    modernCareersEn: ['Judiciary & Constitutional Law', 'University Professors & Deans', 'Spiritual Leaders & Authors', 'Global Tourism & Diplomacy', 'Academic Publishing & Research'],
    modernCareersHi: ['न्यायपालिका व संवैधानिक विधि', 'विश्वविद्यालय कुलपति व आचार्य', 'आध्यात्मिक पथप्रदर्शक व ग्रंथकार', 'वैश्विक पर्यटन व कूटनीति', 'शोध व अकादमिक प्रकाशन'],
    happinessMatrix: {
      superHappy: ['Sun'],
      happy: ['Jupiter', 'Moon', 'Venus'],
      neutral: ['Mercury'],
      unhappy: []
    },
    eventManifestationEn: 'Operating as the supreme Lakshmi Sthana, House 9 triggers spontaneous luck, divine intervention during crisis, and international acclaim.',
    eventManifestationHi: 'सर्वोच्च लक्ष्मी स्थान होने के कारण नवम भाव संकटों में ईश्वरीय रक्षा, पिता का वरदान, तीर्थाटन और भाग्य के निरंतर सहयोग से शिखर सम्मान दिलाता है।'
  },
  10: {
    house: 10,
    sanskritName: 'Karma Bhava (कर्म भाव / राज्य भाव)',
    englishName: 'Tenth House (Profession, Authority & Governance)',
    classification: 'Kendra',
    primaryKarakas: ['Sun', 'Mercury', 'Jupiter', 'Saturn'],
    primaryKarakasHi: ['सूर्य', 'बुध', 'गुरु', 'शनि'],
    bodyPartsEn: 'Knees, patella, joint ligaments, and skeletal architecture.',
    bodyPartsHi: 'घुटने, जानुफलक (पटेला), जोड़ व अस्थि पंजर।',
    coreThemesEn: 'Vocation, professional apex, administrative power, status, royal/government recognition, public honors, and execution of worldly duties.',
    coreThemesHi: 'आजीविका, पद-प्रतिष्ठा, प्रशासनिक अधिकार, राजकृपा, सार्वजनिक यश, पिता की सामाजिक प्रतिष्ठा और कर्म की पूर्णता।',
    modernCareersEn: ['Corporate C-Suite Leadership', 'Government Civil Services', 'Politics & Parliamentary Office', 'Judicial Magistrates', 'Industrial Magnates'],
    modernCareersHi: ['कॉर्पोरेट सी-सूट नेतृत्व', 'आईएएस/आईपीएस प्रशासनिक सेवा', 'राजनीति व मंत्रिस्तरीय पद', 'न्यायिक मजिस्ट्रेट', 'औद्योगिक साम्राज्य निर्माण'],
    happinessMatrix: {
      superHappy: ['Sun', 'Mars', 'Saturn'],
      happy: ['Mercury', 'Jupiter'],
      neutral: ['Venus'],
      unhappy: []
    },
    eventManifestationEn: 'Digbala Sun or Mars here creates undisputed career sovereignty, major promotions around age 28-36, and long-lasting societal influence.',
    eventManifestationHi: 'दशम भाव में दिगबली सूर्य अथवा मंगल अजेय पदोन्नति, शासन सत्ता से सर्वोच्च सम्मान, और आयु २८-३६ वर्ष में जीवन की सबसे बड़ी व्यावसायिक सफलता दिलाते हैं।'
  },
  11: {
    house: 11,
    sanskritName: 'Labha Bhava (लाभ भाव / आय भाव)',
    englishName: 'Eleventh House (Gains, Inflows & Social Networks)',
    classification: 'Upachaya',
    primaryKarakas: ['Jupiter'],
    primaryKarakasHi: ['बृहस्पति'],
    bodyPartsEn: 'Left ear, shins, calves, ankles, and peripheral vascular networks.',
    bodyPartsHi: 'बायां कान, पिंडलियां, टखने (एंंकल) और रक्त वाहिकाएं।',
    coreThemesEn: 'Recurring income, profits, fulfillment of worldly aspirations, elder siblings, influential friends, professional associations, and philanthropic syndicates.',
    coreThemesHi: 'नियमित आय, बहुआयामी लाभ, समस्त मनोकामनाओं की पूर्ति, बड़े भाई-बहन, प्रभावशाली मित्र मंडल, समाज में साख और आर्थिक समृद्धि।',
    modernCareersEn: ['Venture Capital & Private Equity', 'Tech Consortiums & Networks', 'Global NGO Leadership', 'Commodity Trading Exchanges', 'Large-Scale Media Syndication'],
    modernCareersHi: ['वेंचर कैपिटल व निवेश कोष', 'ग्लोबल टेक नेटवर्क व समुदाय', 'अंतरराष्ट्रीय गैर-सरकारी संगठन', 'कमोडिटी व शेयर ट्रेडिंग', 'विशाल सिंडिकेट व संघ'],
    happinessMatrix: {
      superHappy: ['Jupiter', 'Saturn', 'Venus'],
      happy: ['Sun', 'Mercury', 'Mars'],
      neutral: ['Moon'],
      unhappy: []
    },
    eventManifestationEn: 'All planets in 11th house bestow financial prosperity. Malefics yield massive material empires; benefics ensure ethical, perpetual liquid inflows.',
    eventManifestationHi: 'एकादश भाव में सभी ग्रह लाभप्रद होते हैं। क्रूर ग्रह अपार धन साम्राज्य और शुभ ग्रह निरंतर, नीतिपूर्ण आय व मनोकामना पूर्ति सुनिश्चित करते हैं।'
  },
  12: {
    house: 12,
    sanskritName: 'Vyaya Bhava (व्यय भाव / मोक्ष भाव)',
    englishName: 'Twelfth House (Expenditures, Foreign Lands & Moksha)',
    classification: 'Dusthana',
    primaryKarakas: ['Saturn'],
    primaryKarakasHi: ['शनि'],
    bodyPartsEn: 'Feet, soles, toes, left eye, and lymphatic circulation.',
    bodyPartsHi: 'पैर, तलवे, पैर की उंगलियां, बाईं आंख और लसीका तंत्र।',
    coreThemesEn: 'Outflows of wealth, foreign settlements, seclusion, spiritual liberation (Moksha), sleep comfort (Shayana Sukha), hospitals, and detachment from worldly illusions.',
    coreThemesHi: 'धन का व्यय, विदेश प्रवास व निवास, एकांतवास, मोक्ष साधना, शयन सुख, चिकित्सालय/कारागार और भौतिक मोह से विरक्ति।',
    modernCareersEn: ['Multinational Corporations (MNC)', 'Foreign Foreign Service & Diplomacy', 'Hospital Administration & Nursing', 'Spiritual Retreat Centers', 'Import-Export & Shipping'],
    modernCareersHi: ['बहुराष्ट्रीय कंपनियां (MNC)', 'विदेश सेवा व राजनयिक मिशन', 'चिकित्सालय प्रबंधन व नर्सिंग', 'आध्यात्मिक आश्रम व ध्यान केंद्र', 'आयात-निर्यात व शिपिंग'],
    happinessMatrix: {
      superHappy: ['Venus', 'Jupiter'],
      happy: ['Moon'],
      neutral: ['Saturn'],
      unhappy: ['Mercury']
    },
    eventManifestationEn: 'Well-placed 12th house (Venus or Jupiter) secures prosperous foreign settlement, philanthropic legacy, and sublime spiritual tranquility.',
    eventManifestationHi: 'द्वादश भाव में शुभ ग्रह (शुक्र/गुरु) विदेश में स्थायी व समृद्ध वास, उत्तम शयन सुख, परोपकारी व्यय और आध्यात्मिक मुक्ति का मार्ग प्रशस्त करते हैं।'
  }
};

export interface CharakGrahaProfile {
  id: string;
  nameEn: string;
  nameHi: string;
  nature: 'Natural Benefic' | 'Natural Malefic';
  natureHi: string;
  psychologicalArchetypeEn: string;
  psychologicalArchetypeHi: string;
  bodyPartsEn: string;
  bodyPartsHi: string;
  tridosha: 'Pitta' | 'Vata' | 'Kapha' | 'Vata/Kapha' | 'Tridosha';
  maturationAge: number;
  combustionDegrees: number;
  modernProfessionsEn: string[];
  modernProfessionsHi: string[];
  friendsEn: string[];
  neutralsEn: string[];
  enemiesEn: string[];
}

export const CHARAK_GRAHA_9_CORPUS: Record<string, CharakGrahaProfile> = {
  Sun: {
    id: 'Sun',
    nameEn: 'Sun (Surya)',
    nameHi: 'सूर्य',
    nature: 'Natural Malefic',
    natureHi: 'क्रूर/पापी (स्वाभाविक तेजस्विता)',
    psychologicalArchetypeEn: 'The Soul (Atma), divine sovereignty, core ego, integrity, nobility, father, and commanding executive authority.',
    psychologicalArchetypeHi: 'आत्मा, ईश्वरीय संप्रभुता, आत्म-सम्मान, सत्यनिष्ठा, पिता, और आज्ञाकारी प्रशासनिक शक्ति।',
    bodyPartsEn: 'Bones, heart, right eye (in males), eyesight, vitality, brain stem, and head.',
    bodyPartsHi: 'अस्थियां (हड्डियां), हृदय, दाहिनी आंख (पुरुष), दृष्टि, प्राणशक्ति, और सिर।',
    tridosha: 'Pitta',
    maturationAge: 22,
    combustionDegrees: 0,
    modernProfessionsEn: ['Heads of State & Politicians', 'C-Level Executives', 'Civil Service Magistrates', 'Surgeons & Cardiologists', 'Gold & Bullion Dealers'],
    modernProfessionsHi: ['राष्ट्राध्यक्ष व राजनेता', 'मुख्य कार्यकारी अधिकारी (CEO)', 'प्रशासनिक अधिकारी (IAS)', 'हृदय व शल्य चिकित्सक', 'स्वर्ण व बहुमूल्य धातु व्यापारी'],
    friendsEn: ['Moon', 'Mars', 'Jupiter'],
    neutralsEn: ['Mercury'],
    enemiesEn: ['Venus', 'Saturn', 'Rahu', 'Ketu']
  },
  Moon: {
    id: 'Moon',
    nameEn: 'Moon (Chandra)',
    nameHi: 'चंद्रमा',
    nature: 'Natural Benefic',
    natureHi: 'सौम्य/शुभ (मनःकारक)',
    psychologicalArchetypeEn: 'The Mind (Manas), emotional subconscious, nurturing love, maternal instincts, public mood, and receptive intuition.',
    psychologicalArchetypeHi: 'मन, संवेगात्मक अंतर्मन, वात्सल्य, मातृ शक्ति, जनमानस की भावनाएं, और अंतःप्रेरणा।',
    bodyPartsEn: 'Bodily fluids, blood circulation, breasts, stomach, lymphatic system, left eye (in males).',
    bodyPartsHi: 'शारीरिक तरल पदार्थ, रक्त परिसंचरण, वक्ष, आमाशय, लसीका तंत्र, और बाईं आंख (पुरुष)।',
    tridosha: 'Vata/Kapha',
    maturationAge: 24,
    combustionDegrees: 12,
    modernProfessionsEn: ['Psychologists & Counselors', 'Pediatricians & Nurses', 'Hospitality & Culinary Entrepreneurs', 'Public Relations & Marketing', 'Marine & Dairy Industry'],
    modernProfessionsHi: ['मनोवैज्ञानिक व परामर्शदाता', 'शिशु रोग व नर्सिंग विशेषज्ञ', 'आतिथ्य व रेस्तरां उद्योग', 'जनसंपर्क व विज्ञापन', 'समुद्री व्यापार व डेयरी उद्योग'],
    friendsEn: ['Sun', 'Mercury'],
    neutralsEn: ['Mars', 'Jupiter', 'Venus', 'Saturn'],
    enemiesEn: ['Rahu', 'Ketu']
  },
  Mars: {
    id: 'Mars',
    nameEn: 'Mars (Mangala)',
    nameHi: 'मंगल',
    nature: 'Natural Malefic',
    natureHi: 'क्रूर/पापी (सेनापति/अग्निकारक)',
    psychologicalArchetypeEn: 'Courage, technical execution, physical drive, competitive aggression, land ownership, brothers, and decisive tactical will.',
    psychologicalArchetypeHi: 'साहस, तकनीकी क्रियान्वयन, शारीरिक ऊर्जा, प्रतिस्पर्धा, भूमि-भवन, भ्रातृ सुख, और निर्णयात्मक इच्छाशक्ति।',
    bodyPartsEn: 'Bone marrow, red blood cells, muscular tissue, bile, genitals, and surgical sites.',
    bodyPartsHi: 'अस्थि मज्जा, लाल रक्त कणिकाएं, मांसपेशियां, पित्त, जननेंद्रिय और चीर-फाड़ स्थल।',
    tridosha: 'Pitta',
    maturationAge: 28,
    combustionDegrees: 17,
    modernProfessionsEn: ['Surgeons & Dentists', 'Military Commanders & Police', 'Civil & Mechanical Engineers', 'Real Estate Developers', 'Professional Athletes'],
    modernProfessionsHi: ['शल्य व दंत चिकित्सक', 'सैन्य कमांडर व पुलिस अधिकारी', 'सिविल व मैकेनिकल इंजीनियर', 'भूमि विकासकर्ता (बिल्डर्स)', 'व्यावसायिक खिलाड़ी'],
    friendsEn: ['Sun', 'Moon', 'Jupiter'],
    neutralsEn: ['Venus', 'Saturn'],
    enemiesEn: ['Mercury', 'Rahu']
  },
  Mercury: {
    id: 'Mercury',
    nameEn: 'Mercury (Budha)',
    nameHi: 'बुध',
    nature: 'Natural Benefic',
    natureHi: 'सौम्य/शुभ (बुद्धिकारक)',
    psychologicalArchetypeEn: 'Analytical intellect, commercial acumen, articulation, wit, writing, mathematical discrimination, and adaptable logic.',
    psychologicalArchetypeHi: 'तार्किक बुद्धि, व्यापारिक चातुर्य, वक्तृत्व कला, हास्य, लेखन, गणितीय विवेक, और बहुमुखी प्रतिभा।',
    bodyPartsEn: 'Skin, central nervous system, vocal apparatus, tongue, lungs, and hands.',
    bodyPartsHi: 'त्वचा, केंद्रीय तंत्रिका तंत्र (नर्वस सिस्टम), वाणी यंत्र, जिह्वा, और फेफड़े।',
    tridosha: 'Tridosha',
    maturationAge: 32,
    combustionDegrees: 14,
    modernProfessionsEn: ['Software Developers & Data Analysts', 'Chartered Accountants & Economists', 'Journalists & Authors', 'Commercial Traders & Marketers', 'Linguists & Translators'],
    modernProfessionsHi: ['सॉफ्टवेयर व डेटा वैज्ञानिक', 'चार्टर्ड एकाउंटेंट व अर्थशास्त्री', 'पत्रकार व साहित्यकार', 'वाणिज्यिक व्यापारी व विपणनकर्ता', 'भाषाविद व अनुवादक'],
    friendsEn: ['Sun', 'Venus'],
    neutralsEn: ['Mars', 'Jupiter', 'Saturn'],
    enemiesEn: ['Moon']
  },
  Jupiter: {
    id: 'Jupiter',
    nameEn: 'Jupiter (Brihaspati / Guru)',
    nameHi: 'बृहस्पति (गुरु)',
    nature: 'Natural Benefic',
    natureHi: 'परम शुभ (ज्ञान व भाग्यकारक)',
    psychologicalArchetypeEn: 'Divine wisdom, philosophical faith, mentors, expansion, legal justice, children, wealth accumulation, and spiritual dharma.',
    psychologicalArchetypeHi: 'दैवीय प्रज्ञा, दार्शनिक निष्ठा, गुरु कृपा, विस्तार, न्याय, संतान, विपुल धन, और आध्यात्मिक धर्म।',
    bodyPartsEn: 'Liver, adipose (fat) tissue, gallbladder, ears, arterial circulation, and hips.',
    bodyPartsHi: 'यकृत (लिवर), वसा (फैट), पित्ताशय, कान, धमनियां और जंघाएं।',
    tridosha: 'Kapha',
    maturationAge: 16,
    combustionDegrees: 11,
    modernProfessionsEn: ['Judges & Legal Jurists', 'University Professors & Chancellors', 'Financial Advisers & Bankers', 'Spiritual Teachers & Philosophers', 'Public Policy Formulators'],
    modernProfessionsHi: ['न्यायाधीश व न्यायविद्', 'विश्वविद्यालय कुलपति व आचार्य', 'वित्तीय सलाहकार व बैंकर', 'आध्यात्मिक पथप्रदर्शक व धर्माचार्य', 'नीति निर्धारक'],
    friendsEn: ['Sun', 'Moon', 'Mars'],
    neutralsEn: ['Saturn'],
    enemiesEn: ['Mercury', 'Venus']
  },
  Venus: {
    id: 'Venus',
    nameEn: 'Venus (Shukra)',
    nameHi: 'शुक्र',
    nature: 'Natural Benefic',
    natureHi: 'सौम्य/शुभ (सौंदर्य व कामकारक)',
    psychologicalArchetypeEn: 'Refined aesthetic grace, romantic intimacy, vehicles, fine arts, diplomacy, marital bliss, and reproductive virility.',
    psychologicalArchetypeHi: 'सौंदर्य बोध, प्रणय संबंध, वाहन सुख, ललित कलाएं, कूटनीति, दांपत्य सामंजस्य, और प्रजनन वीर्य।',
    bodyPartsEn: 'Reproductive fluids (semen/ovum), kidneys, pelvic organs, complexion, and hormonal balance.',
    bodyPartsHi: 'प्रजनन धातु (शुक्र/वीर्य), गुर्दे, गर्भाशय, शारीरिक कांति, और अंतःस्रावी ग्रंथियां।',
    tridosha: 'Vata/Kapha',
    maturationAge: 25,
    combustionDegrees: 10,
    modernProfessionsEn: ['Fashion & Interior Designers', 'Actors, Musicians & Artists', 'Luxury Goods Retailers', 'Diplomats & Mediators', 'Cosmetic Surgeons & Dermatologists'],
    modernProfessionsHi: ['फैशन व इंटीरियर डिजाइनर', 'अभिनेता, संगीतकार व कलाकार', 'विलासिता उत्पाद व्यापारी', 'राजनयिक व मध्यस्थ', 'सौंदर्य व त्वचा विशेषज्ञ'],
    friendsEn: ['Mercury', 'Saturn'],
    neutralsEn: ['Mars', 'Jupiter'],
    enemiesEn: ['Sun', 'Moon']
  },
  Saturn: {
    id: 'Saturn',
    nameEn: 'Saturn (Shani)',
    nameHi: 'शनि',
    nature: 'Natural Malefic',
    natureHi: 'क्रूर/पापी (न्यायाधिकारी/कर्मकारक)',
    psychologicalArchetypeEn: 'Karmic retribution, discipline, endurance, delays, democratic masses, detachment, organization, and enduring legacy.',
    psychologicalArchetypeHi: 'कर्म फल प्रदाता, कठोर अनुशासन, धैर्य, विलंब, श्रमजीवी वर्ग, विरक्ति, संगठनात्मक ढांचा, और चिरस्थायी कीर्ति।',
    bodyPartsEn: 'Bones, teeth, joints, knees, lymphatic nodes, nervous system, and spleen.',
    bodyPartsHi: 'अस्थि संरचना, दांत, जोड़, घुटने, स्नायु तंत्र, और तिल्ली।',
    tridosha: 'Vata',
    maturationAge: 36,
    combustionDegrees: 15,
    modernProfessionsEn: ['Mining & Petroleum Engineers', 'Labor Union Leaders & Social Reformers', 'Heavy Industry Manufacturers', 'Geriatric & Chronic Care Doctors', 'Judicial Arbitrators'],
    modernProfessionsHi: ['खनन व पेट्रोलियम इंजीनियर', 'श्रम संगठन व सामाजिक कार्यकर्ता', 'भारी उद्योग व विनिर्माण', 'दीर्घकालिक व्याधि विशेषज्ञ', 'न्यायिक पंच व मध्यस्थ'],
    friendsEn: ['Mercury', 'Venus'],
    neutralsEn: ['Jupiter'],
    enemiesEn: ['Sun', 'Moon', 'Mars']
  },
  Rahu: {
    id: 'Rahu',
    nameEn: 'Rahu (North Lunar Node)',
    nameHi: 'राहु',
    nature: 'Natural Malefic',
    natureHi: 'छाया ग्रह/तामसिक (अति-महत्वाकांक्षा)',
    psychologicalArchetypeEn: 'Unconventional breakthrough, foreign avenues, explosive ambition, future karma to be mastered, technology, and illusion (Maya).',
    psychologicalArchetypeHi: 'अपरंपरागत उत्थान, विदेशी संपर्क, अदम्य महत्वाकांक्षा, आगामी जीवन कर्म, नवीन तकनीक, और माया का विस्तार।',
    bodyPartsEn: 'Skin, lungs, nervous oscillations, psychic faculties, and lower legs.',
    bodyPartsHi: 'त्वचा, श्वास नली, तंत्रिका तंत्र, आभास ज्ञान, और पिंडलियां।',
    tridosha: 'Vata',
    maturationAge: 42,
    combustionDegrees: 0,
    modernProfessionsEn: ['Artificial Intelligence & Tech Disruptors', 'Aviation & Space Explorers', 'Foreign Diplomats & Expats', 'Filmmakers & Illusionists', 'Chemical & Pharmaceutical Scientists'],
    modernProfessionsHi: ['आर्टिफिशियल इंटेलिजेंस (AI) व टेक नवप्रवर्तक', 'विमानन व अंतरिक्ष विज्ञान', 'विदेशी राजनयिक व प्रवासी', 'सिनेमा व एनिमेशन निर्माता', 'रासायनिक व औषधि शोधकर्ता'],
    friendsEn: ['Venus', 'Saturn'],
    neutralsEn: ['Mercury', 'Jupiter'],
    enemiesEn: ['Sun', 'Moon', 'Mars']
  },
  Ketu: {
    id: 'Ketu',
    nameEn: 'Ketu (South Lunar Node)',
    nameHi: 'केतु',
    nature: 'Natural Malefic',
    natureHi: 'छाया ग्रह/आध्यात्मिक (मोक्षकारक)',
    psychologicalArchetypeEn: 'Spiritual detachment (Moksha), past-life mastery, acute intuition, research depth, occult discernment, and renunciation of clutter.',
    psychologicalArchetypeHi: 'आध्यात्मिक विरक्ति (मोक्ष), पूर्व जन्म की संचित सिद्धियां, तीव्र अंतर्ज्ञान, गहन शोध, और सांसारिक आडंबरों से मुक्ति।',
    bodyPartsEn: 'Spine, nervous terminations, wounds, bruises, and psychic aura.',
    bodyPartsHi: 'रीढ़ का निचला भाग, तंत्रिका छोर, घाव, और सूक्ष्म आभा मंडल।',
    tridosha: 'Pitta',
    maturationAge: 48,
    combustionDegrees: 0,
    modernProfessionsEn: ['Cryptographers & Security Researchers', 'Monks, Ascetics & Spiritual Healers', 'Microbiologists & Pathologists', 'Mathematicians & Astrologers', 'Surgeons & Precision Technicians'],
    modernProfessionsHi: ['क्रिप्टोग्राफी व सुरक्षा शोधकर्ता', 'संन्यासी, साधक व रेकी हीलर', 'सूक्ष्म जीव विज्ञान व पैथोलॉजी', 'गणितज्ञ व दैवज्ञ (ज्योतिषी)', 'सटीक शल्य चिकित्सक'],
    friendsEn: ['Venus', 'Mars'],
    neutralsEn: ['Mercury', 'Jupiter'],
    enemiesEn: ['Sun', 'Moon', 'Saturn']
  }
};

export interface CharakTransitRule {
  planet: string;
  favorableHousesFromMoon: number[];
  vedhaHouses: Record<number, number>;
  vedhaExceptionsEn?: string;
  vedhaExceptionsHi?: string;
}

export const CHARAK_GOCHARA_VEDHA_RULES: Record<string, CharakTransitRule> = {
  Sun: {
    planet: 'Sun',
    favorableHousesFromMoon: [3, 6, 10, 11],
    vedhaHouses: { 3: 9, 6: 12, 10: 4, 11: 5 },
    vedhaExceptionsEn: 'No Vedha exists between Sun and Saturn.',
    vedhaExceptionsHi: 'सूर्य और शनि के मध्य वेध संबंध मान्य नहीं है।'
  },
  Moon: {
    planet: 'Moon',
    favorableHousesFromMoon: [1, 3, 6, 7, 10, 11],
    vedhaHouses: { 1: 5, 3: 9, 6: 12, 7: 2, 10: 4, 11: 8 },
    vedhaExceptionsEn: 'No Vedha exists between Moon and Mercury.',
    vedhaExceptionsHi: 'चंद्रमा और बुध के मध्य वेध संबंध मान्य नहीं है।'
  },
  Mars: {
    planet: 'Mars',
    favorableHousesFromMoon: [3, 6, 11],
    vedhaHouses: { 3: 12, 6: 9, 11: 5 }
  },
  Mercury: {
    planet: 'Mercury',
    favorableHousesFromMoon: [2, 4, 6, 8, 10, 11],
    vedhaHouses: { 2: 5, 4: 3, 6: 9, 8: 1, 10: 8, 11: 12 }
  },
  Jupiter: {
    planet: 'Jupiter',
    favorableHousesFromMoon: [2, 5, 7, 9, 11],
    vedhaHouses: { 2: 12, 5: 4, 7: 3, 9: 10, 11: 8 }
  },
  Venus: {
    planet: 'Venus',
    favorableHousesFromMoon: [1, 2, 3, 4, 5, 8, 9, 11, 12],
    vedhaHouses: { 1: 8, 2: 7, 3: 1, 4: 10, 5: 9, 8: 5, 9: 11, 11: 6, 12: 3 }
  },
  Saturn: {
    planet: 'Saturn',
    favorableHousesFromMoon: [3, 6, 11],
    vedhaHouses: { 3: 12, 6: 9, 11: 5 }
  }
};

export const CHARAK_DOUBLE_TRANSIT_DOCTRINE = {
  titleEn: 'Double Transit of Saturn and Jupiter (Dr. K.S. Charak)',
  titleHi: 'गुरु-शनि संयुक्त गोचर सिद्धांत (डॉ. के.एस. चरक)',
  summaryEn: 'No major life event (marriage, child-birth, executive career appointment, home construction) can materialize unless both Saturn and Jupiter simultaneously aspect or transit that specific house or its lord.',
  summaryHi: 'जीवन की कोई भी युगांतरकारी घटना (विवाह, संतानोत्पत्ति, उच्च पद प्राप्ति, भवन निर्माण) तब तक घटित नहीं हो सकती, जब तक शनि और गुरु दोनों संयुक्त रूप से उस भाव अथवा भावेश पर गोचर से दृष्टि या युति स्थापित न करें।',
  citation: 'Elements of Vedic Astrology (Vol 2), Chapter XXIX: Gochara.'
};

export const CHARAK_SUDARSHANA_CHAKRA_DOCTRINE = {
  titleEn: 'Sudarshana Chakra Tri-Lagna Assessment',
  titleHi: 'सुदर्शन चक्र त्रि-लग्न समाकलन सिद्धांत',
  summaryEn: 'Synthesizes horoscopic destiny from three cardinal anchors: Natal Lagna (Physical body & environment), Chandra Lagna (Emotional psyche & maternal lineage), and Surya Lagna (Soul, father & societal stature).',
  summaryHi: 'कुंडली के फल का तीन प्रमुख बिंदुओं से एक साथ परीक्षण: जन्म लग्न (स्थूल देह व भौतिक जीवन), चंद्र लग्न (मन, संवेदनाएं व मातृकुल), तथा सूर्य लग्न (आत्मा, आत्म-बल व पितृकुल)।',
  citation: 'Elements of Vedic Astrology (Vol 2), Chapter XXXI: Sudarshana Chakra.'
};

export function getCharakBhava(houseNum: number): CharakBhavaProfile | undefined {
  return CHARAK_BHAVA_12_CORPUS[houseNum];
}

export function getCharakGraha(planetId: string): CharakGrahaProfile | undefined {
  return CHARAK_GRAHA_9_CORPUS[planetId];
}
