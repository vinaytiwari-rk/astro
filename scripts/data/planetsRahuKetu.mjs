// scripts/data/planetsRahuKetu.mjs
// Rahu and Ketu: 12 Houses each (24 records)

export const RAHU_HOUSES = [
  {
    planet: 'Rahu',
    planetHi: 'राहु',
    house: 1,
    titleEn: 'Rahu in 1st House (Lagna)',
    titleHi: 'राहु प्रथम भाव (लग्न) में',
    baseEn: 'Magnetic personality, ambitious, unconventional, eccentric, foreign connections, head or nerve sensitivity, desire for public limelight.',
    baseHi: 'सम्मोहक व्यक्तित्व, अत्यंत महत्वाकांक्षी, लीक से हटकर चलने वाला, विदेशी संपर्क, शिर या स्नायु संवेदनशीलता, जनसामान्य में छा जाने की तीव्र लालसा।',
    ageMilestones: [
      { age: 19, nature: 'career', eventEn: 'Sudden emergence into public notice, unconventional career start.', eventHi: 'सार्वजनिक पटल पर अप्रत्याशित उदय, विशिष्ट आजीविका का प्रारंभ।' },
      { age: 28, nature: 'favorable', eventEn: 'Major foreign travel, international connections, unconventional breakthrough.', eventHi: 'विदेश गमन, अंतरराष्ट्रीय संपर्क, अप्रत्याशित बड़ी सफलता।' },
      { age: 42, nature: 'career', eventEn: 'Apex of political influence, media empire, or technological revolution.', eventHi: 'राजनीतिक प्रभाव, मीडिया या तकनीकी साम्राज्य का चरमोत्कर्ष।' }
    ],
    signModifiers: {
      Taurus: { en: 'Exalted: Enormous wealth, magnetic charisma, commanding media influence.', hi: 'उच्च राशि (वृषभ): अकूत धन संपदा, सम्मोहक व्यक्तित्व, मीडिया में व्यापक प्रभाव।' },
      Scorpio: { en: 'Debilitated: Nervous anxiety, eccentric mood swings, mysterious ailments.', hi: 'नीच राशि (वृश्चिक): मानसिक उद्वेग, रहस्यमयी विकार, अनिद्रा।' }
    },
    aspectModifiers: [
      { graha: 'Jupiter', conditionEn: 'With or aspected by Jupiter', conditionHi: 'गुरु की युति या दृष्टि (गुरु-चांडाल परिहार)', effectEn: 'Converts ambition into profound research, technological genius, philosophical reformer.', effectHi: 'चांडाल दोष का परिहार, गहन वैज्ञानिक शोध, तकनीकी प्रतिभा, समाज सुधारक।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, bold, modern outlook, unconventional personality, independent decision maker, nervous care needed.',
      hi: 'स्त्री जातक में साहसी, आधुनिक दृष्टिकोण, स्वतंत्र निर्णय क्षमता, स्नायु व मानसिक शांति का ध्यान रखें।'
    }
  },
  {
    planet: 'Rahu',
    planetHi: 'राहु',
    house: 2,
    titleEn: 'Rahu in 2nd House (Dhana Bhava)',
    titleHi: 'राहु द्वितीय भाव (धन भाव) में',
    baseEn: 'Unorthodox speech, sudden financial windfalls and sudden dips, dental or throat vulnerability, foreign languages, unconventional culinary tastes.',
    baseHi: 'विशिष्ट व कूटनीतिक वाणी, अचानक धन लाभ व अप्रत्याशित व्यय, दंत या कंठ संवेदनशीलता, विदेशी भाषाओं में निपुण, विविध खानपान प्रिय।',
    ageMilestones: [
      { age: 28, nature: 'favorable', eventEn: 'Sudden financial windfall through foreign trade, stocks, or media.', eventHi: 'विदेशी व्यापार, शेयर बाजार या मीडिया से अचानक भारी धन लाभ।' },
      { age: 42, nature: 'challenging', eventEn: 'Financial restructuring, speech caution required in family disputes.', eventHi: 'आर्थिक पुनर्गठन, कुटुंब में वाणी के संयम की आवश्यकता।' }
    ],
    signModifiers: {
      Taurus: { en: 'Exalted: Multifold wealth through currency exchange, international commerce, and tech.', hi: 'उच्च राशि: विदेशी मुद्रा, अंतरराष्ट्रीय व्यापार व तकनीक से विपुल धनोपार्जन।' },
      Scorpio: { en: 'Debilitated: Losses through fraud, harsh speech causing estrangement.', hi: 'नीच राशि: धोखे से धनहानि, कटु वाणी से संबंधों में दरार।' }
    },
    aspectModifiers: [
      { graha: 'Jupiter', conditionEn: 'Aspected by Jupiter', conditionHi: 'गुरु की दृष्टि', effectEn: 'Controls speech, bestows legitimate international financial prosperity.', effectHi: 'वाणी में संतुलन, अंतरराष्ट्रीय स्तर पर न्यायपूर्ण धन संचय।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, bold speech, fond of foreign cuisines and ornaments, sudden monetary shifts, guardian of assets.',
      hi: 'स्त्री जातक में निर्भीक वाणी, नवीन व्यंजनों व आभूषणों की शौकीन, आर्थिक उतार-चढ़ाव में धैर्य आवश्यक।'
    }
  },
  {
    planet: 'Rahu',
    planetHi: 'राहु',
    house: 3,
    titleEn: 'Rahu in 3rd House (Sahaja Bhava)',
    titleHi: 'राहु तृतीय भाव (पराक्रम भाव) में',
    baseEn: 'Extreme daring, media and IT tech brilliance, friction with younger siblings, international travel, invincible competitive drive.',
    baseHi: 'अद्वितीय दुस्साहस, मीडिया व आईटी तकनीकी प्रतिभा, छोटे भाइयों से मतभेद, अंतरराष्ट्रीय यात्राएं, प्रतिस्पर्धा में अजेय।',
    ageMilestones: [
      { age: 21, nature: 'career', eventEn: 'Bold breakthrough into media, software, internet, or communications.', eventHi: 'मीडिया, सॉफ्टवेयर, इंटरनेट या संचार क्षेत्र में साहसिक पदार्पण।' },
      { age: 28, nature: 'favorable', eventEn: 'Triumph over competition, major overseas contract or publishing success.', eventHi: 'प्रतिस्पर्धा पर पूर्ण विजय, विदेशी अनुबंध अथवा प्रकाशन में ख्याति।' }
    ],
    signModifiers: {
      Taurus: { en: 'Exalted: Supreme media mogul, invincible digital pioneer, vast influence.', hi: 'उच्च राशि: डिजिटल मीडिया में सर्वोच्च धाक, अजेय पराक्रम, व्यापक प्रभाव।' },
      Scorpio: { en: 'Debilitated: Strained relations with brothers, reckless communication risks.', hi: 'नीच राशि: सहोदरों से कटुता, संवाद में जल्दबाजी से विवाद।' }
    },
    aspectModifiers: [
      { graha: 'Mercury', conditionEn: 'With Mercury', conditionHi: 'बुध से युति', effectEn: 'Digital tech genius, software architect, mass internet influencer.', effectHi: 'सॉफ्टवेयर व इंटरनेट में विलक्षण प्रतिभा, जनसंचार में विशिष्ट स्थान।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, courageous, tech-savvy, dynamic, independent, stands firm against social pressures.',
      hi: 'स्त्री जातक में अत्यंत साहसी, तकनीकी कार्यों में दक्ष, स्वतंत्र विचारों वाली, समाज में अलग पहचान।'
    }
  },
  {
    planet: 'Rahu',
    planetHi: 'राहु',
    house: 4,
    titleEn: 'Rahu in 4th House (Sukha Bhava)',
    titleHi: 'राहु चतुर्थ भाव (सुख भाव) में',
    baseEn: 'Restless home life, foreign residence, distance from maternal roots, modern luxury apartments, automotive passions, heart/chest sensitivity.',
    baseHi: 'गृह में मानसिक अशांति, विदेश वास का प्रबल योग, मातृभूमि से दूरी, आधुनिक सुख-सुविधाओं से युक्त आवास, वाहन प्रेमी, वक्षस्थल संवेदनशीलता।',
    ageMilestones: [
      { age: 28, nature: 'career', eventEn: 'Relocation to foreign country or distant metropolis, home purchase.', eventHi: 'विदेश या दूरस्थ महानगर में आवास, आधुनिक मकान का क्रय।' },
      { age: 42, nature: 'favorable', eventEn: 'Acquisition of high-tech luxury vehicle or premium real estate.', eventHi: 'अत्याधुनिक वाहन अथवा बहुमूल्य अचल संपत्ति की प्राप्ति।' }
    ],
    signModifiers: {
      Taurus: { en: 'Exalted: Modern mansions, fleet of luxury imported vehicles, high comfort abroad.', hi: 'उच्च राशि: भव्य आधुनिक प्रासाद, विदेशी उत्तम वाहन, विदेश में सुख-सुविधाएं।' },
      Scorpio: { en: 'Debilitated: Maternal health sorrow, domestic estrangement, vehicle breakdowns.', hi: 'नीच राशि: माता के स्वास्थ्य की चिंता, गृह क्लेश, वाहन में बाधाएं।' }
    },
    aspectModifiers: [
      { graha: 'Jupiter', conditionEn: 'Aspected by Jupiter', conditionHi: 'गुरु की दृष्टि', effectEn: 'Restores domestic peace, protects maternal health, noble residence abroad.', effectHi: 'गृह शांति की पुनर्स्थापना, माता की रक्षा, विदेश में सुखद वास।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, domestic restlessness, modern lifestyle, lives away from birthplace, stylish home decor.',
      hi: 'स्त्री जातक में जन्मभूमि से दूर वास, आधुनिक जीवनशैली, सुंदर व सुरुचिपूर्ण गृह सज्जा।'
    }
  },
  {
    planet: 'Rahu',
    planetHi: 'राहु',
    house: 5,
    titleEn: 'Rahu in 5th House (Suta Bhava)',
    titleHi: 'राहु पंचम भाव (संतान व बुद्धि भाव) में',
    baseEn: 'Brilliant speculative intellect, unconventional studies, electronics/AI genius, delay in children, stomach heat, sharp analytical instincts.',
    baseHi: 'जोखिम भरे निवेश में विलक्षण बुद्धि, लीक से हटकर शिक्षा, इलेक्ट्रॉनिक्स व आर्टिफिशियल इंटेलिजेंस में मेधा, संतान में विलंब, उदर में गैस व पित्त।',
    ageMilestones: [
      { age: 28, nature: 'career', eventEn: 'Breakthrough in high-tech research, speculative financial windfall.', eventHi: 'उच्च तकनीकी शोध में बड़ी सफलता, शेयर बाजार या सट्टे में अप्रत्याशित लाभ।' },
      { age: 42, nature: 'favorable', eventEn: 'Birth of unique, tech-savvy child, creative intellectual summit.', eventHi: 'विलक्षण व मेधावी संतान का जन्म, बौद्धिक क्षेत्र में शिखर सम्मान।' }
    ],
    signModifiers: {
      Taurus: { en: 'Exalted: Financial tech genius, multi-millionaire through algorithmic trading.', hi: 'उच्च राशि: वित्तीय तकनीकी का महारथी, एल्गोरिद्मिक ट्रेडिंग से विपुल धन।' },
      Scorpio: { en: 'Debilitated: Abdominal complaints, speculative losses, pregnancy vigilance needed.', hi: 'नीच राशि: उदर विकार, सट्टेबाजी में हानि, गर्भावस्था में विशेष सावधानी।' }
    },
    aspectModifiers: [
      { graha: 'Jupiter', conditionEn: 'Aspected by Jupiter', conditionHi: 'गुरु की दृष्टि', effectEn: 'Shields progeny, channels intellect into profound scientific discoveries.', effectHi: 'संतान की रक्षा, बुद्धि का उच्च वैज्ञानिक व दार्शनिक शोध में उपयोग।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, pregnancy vigilance required, sharp intuitive intellect, modern parenting, innovative learner.',
      hi: 'स्त्री जातक में गर्भावस्था के समय विशेष सतर्कता, कुशाग्र अंतर्ज्ञान, आधुनिक मातृत्व, मेधावी।'
    }
  },
  {
    planet: 'Rahu',
    planetHi: 'राहु',
    house: 6,
    titleEn: 'Rahu in 6th House (Ripu Bhava)',
    titleHi: 'राहु षष्ठ भाव (शत्रु व रोग भाव) में',
    baseEn: 'Shatruhanta par excellence, completely obliterates all adversaries, succeeds in cut-throat corporate/political competition, foreign medicine, robust vitality.',
    baseHi: 'परम शत्रुहंता, विरोधियों व षड्यंत्रकारियों को नेस्तनाबूद करने वाला, कॉर्पोरेट व राजनीतिक गलाकाट प्रतिस्पर्धा में विजयी, विदेशी चिकित्सा, अद्भुत रोग प्रतिरोधकता।',
    ageMilestones: [
      { age: 21, nature: 'career', eventEn: 'Stunning triumph in fierce competitive trial or legal dispute.', eventHi: 'कठिन प्रतियोगी परीक्षा या विधिक विवाद में चौंकाने वाली विजय।' },
      { age: 28, nature: 'favorable', eventEn: 'Total destruction of rivals, overseas business dominance.', eventHi: 'विरोधियों का समूल नाश, विदेशी व्यापार व कार्यक्षेत्र में धाक।' },
      { age: 42, nature: 'favorable', eventEn: 'Unchallenged supremacy over litigation, debt liquidation.', eventHi: 'मुकदमों पर पूर्ण नियंत्रण, पुराने ऋणों की पूर्ण अदायगी।' }
    ],
    signModifiers: {
      Taurus: { en: 'Exalted: Supreme conqueror of all litigation and diseases, international power.', hi: 'उच्च राशि: सभी मुकदमों व रोगों पर अजेय विजय, अंतरराष्ट्रीय स्तर पर प्रभाव।' },
      Scorpio: { en: 'Debilitated: Undiagnosed ailments, sudden workplace conspiracies.', hi: 'नीच राशि: कठिन रोग, कार्यक्षेत्र में गुप्त षड्यंत्रों का सामना।' }
    },
    aspectModifiers: [
      { graha: 'Jupiter', conditionEn: 'Aspected by Jupiter', conditionHi: 'गुरु की दृष्टि', effectEn: 'Righteous victory, immune to negative energies, respected peacemaker.', effectHi: 'धर्म सम्मत विजय, नकारात्मक ऊर्जाओं से पूर्ण सुरक्षा, सम्मानित व्यक्तित्व।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, fearless against rivals, handles workplace pressure brilliantly, robust endurance.',
      hi: 'स्त्री जातक में विरोधियों के सामने निर्भीक, कार्यक्षेत्र के दबाव को कुशलता से संभालने वाली, साहसी।'
    }
  },
  {
    planet: 'Rahu',
    planetHi: 'राहु',
    house: 7,
    titleEn: 'Rahu in 7th House (Kalatra Bhava)',
    titleHi: 'राहु सप्तम भाव (कलत्र भाव) में',
    baseEn: 'Inter-caste, inter-cultural, or foreign marriage, unconventional spouse, marital friction, complex commercial partnerships, sudden unions.',
    baseHi: 'अंतरजातीय या विदेशी विवाह का प्रबल योग, जीवनसाथी का विशिष्ट व आधुनिक स्वभाव, दांपत्य में उतार-चढ़ाव, व्यापारिक साझेदारी में सावधानी, अचानक विवाह।',
    ageMilestones: [
      { age: 28, nature: 'challenging', eventEn: 'Sudden marriage proposal or partnership shift requiring vigilance.', eventHi: 'अचानक विवाह प्रस्ताव अथवा व्यापारिक अनुबंध में महत्वपूर्ण मोड़।' },
      { age: 36, nature: 'favorable', eventEn: 'International business partnership success, matrimonial stabilization.', eventHi: 'अंतरराष्ट्रीय व्यापार में भारी सफलता, दांपत्य जीवन में स्थिरता।' }
    ],
    signModifiers: {
      Taurus: { en: 'Exalted: Wealthy, unconventional, foreign-connected spouse; flourishing trade.', hi: 'उच्च राशि: अत्यंत धनी व विदेशी पृष्ठभूमि का जीवनसाथी; व्यापार में भारी लाभ।' },
      Scorpio: { en: 'Debilitated: Marital deceit, sudden separation risk, legal disputes with partner.', hi: 'नीच राशि: दांपत्य में अविश्वास, अलगाव का भय, साझेदारी में विधिक विवाद।' }
    },
    aspectModifiers: [
      { graha: 'Jupiter', conditionEn: 'Aspected by Jupiter', conditionHi: 'गुरु की दृष्टि', effectEn: 'Saves marital bond, converts differences into mutual international expansion.', effectHi: 'दांपत्य की रक्षा, वैचारिक भिन्नता को व्यापारिक लाभ में बदलने वाला।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, unconventional husband, independent married life, vigilance in contracts, foreign travel with spouse.',
      hi: 'स्त्री जातक में आधुनिक विचारों वाला पति, स्वतंत्र वैवाहिक जीवन, अनुबंधों में सावधानी, पति के साथ विदेश गमन।'
    }
  },
  {
    planet: 'Rahu',
    planetHi: 'राहु',
    house: 8,
    titleEn: 'Rahu in 8th House (Ayu Bhava)',
    titleHi: 'राहु अष्टम भाव (आयु व रंध्र भाव) में',
    baseEn: 'Sudden financial windfalls, occult mastery, chronic undiagnosed ailments, accident risks, inheritance through insurance or unearned wealth.',
    baseHi: 'अचानक भारी धन लाभ, गुप्त विद्याओं व तंत्र में सिद्धि, अज्ञात व अनिदान रोग, दुर्घटना से सावधानी, बीमा या वसीयत से अप्रत्याशित संपत्ति।',
    ageMilestones: [
      { age: 28, nature: 'health', eventEn: 'Sudden physical or emotional upheaval, health vigilance year.', eventHi: 'अचानक शारीरिक या मानसिक संकट का सतर्कता वर्ष।' },
      { age: 42, nature: 'favorable', eventEn: 'Massive unexpected financial legacy, profound occult breakthrough.', eventHi: 'अप्रत्याशित विशाल धन लाभ, वसीयत अथवा गुप्त अनुसंधान में सफलता।' }
    ],
    signModifiers: {
      Taurus: { en: 'Exalted: Immense sudden treasures, longevity protected through advanced medicine.', hi: 'उच्च राशि: अचानक विपुल धन संपदा, आधुनिक चिकित्सा से आयु रक्षा।' },
      Scorpio: { en: 'Debilitated: Risk of toxicity, undiagnosed nervous ailments, sudden legal traps.', hi: 'नीच राशि: विष या औषध संवेदनशीलता, स्नायु रोग, विधिक उलझनें।' }
    },
    aspectModifiers: [
      { graha: 'Jupiter', conditionEn: 'Aspected by Jupiter', conditionHi: 'गुरु की दृष्टि', effectEn: 'Shields vitality, neutralizes accidents, bestows profound metaphysical research.', effectHi: 'प्राणों की पूर्ण रक्षा, संकटों से बचाव, उच्च आध्यात्मिक शोध।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, mystical intuition, sudden inheritance from in-laws, reproductive caution, calm mind needed.',
      hi: 'स्त्री जातक में रहस्यमयी अंतर्ज्ञान, ससुराल से आकस्मिक धन, जननेंद्रिय स्वास्थ्य पर ध्यान दें।'
    }
  },
  {
    planet: 'Rahu',
    planetHi: 'राहु',
    house: 9,
    titleEn: 'Rahu in 9th House (Dharma Bhava)',
    titleHi: 'राहु नवम भाव (धर्म व भाग्य भाव) में',
    baseEn: 'Unorthodox philosophy, foreign travels, clash with traditional orthodoxy, sudden fortune abroad, patron of futuristic causes.',
    baseHi: 'रूढ़िमुक्त दार्शनिक विचार, बहुविध विदेश यात्राएं, परंपराओं से असहमति, विदेश में अप्रत्याशित भाग्योदय, भविष्योन्मुखी योजनाओं का प्रवर्तक।',
    ageMilestones: [
      { age: 28, nature: 'favorable', eventEn: 'Foreign pilgrimage, international migration, dramatic fortune shift.', eventHi: 'विदेश गमन, सुदूर स्थानों में प्रवास, भाग्य में क्रांतिकारी परिवर्तन।' },
      { age: 42, nature: 'career', eventEn: 'International recognition as unconventional thinker or cross-border leader.', eventHi: 'अंतरराष्ट्रीय स्तर पर ख्याति, वैश्विक स्तर पर नेतृत्व।' }
    ],
    signModifiers: {
      Taurus: { en: 'Exalted: Immense fortune abroad, global business empire, high foreign honors.', hi: 'उच्च राशि: विदेश में अखंड सौभाग्य, वैश्विक व्यापारिक साम्राज्य, अंतरराष्ट्रीय सम्मान।' },
      Scorpio: { en: 'Debilitated: Friction with father, travel hardships, loss of faith under crisis.', hi: 'नीच राशि: पिता से मतभेद, यात्रा में कष्ट, संकट के समय आस्था में विचलन।' }
    },
    aspectModifiers: [
      { graha: 'Jupiter', conditionEn: 'Aspected by Jupiter', conditionHi: 'गुरु की दृष्टि', effectEn: 'Blends ancient wisdom with modern tech, broad-minded spiritual reformer.', effectHi: 'प्राचीन ज्ञान व आधुनिक विज्ञान का समन्वय, उदार आध्यात्मिक सुधारक।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, broad worldview, travels extensively, unconventional beliefs, independent fortune builder.',
      hi: 'स्त्री जातक में उदार दृष्टिकोण, व्यापक यात्राएं, स्वतंत्र धार्मिक विचार, स्वप्रयासों से भाग्योदय।'
    }
  },
  {
    planet: 'Rahu',
    planetHi: 'राहु',
    house: 10,
    titleEn: 'Rahu in 10th House (Karma Bhava)',
    titleHi: 'राहु दशम भाव (कर्म व राज्य भाव) में',
    baseEn: 'Explosive career rise, political power, media and technology mogul, famous through unconventional means, influential masses connection.',
    baseHi: 'कार्यक्षेत्र में उल्कावत तीव्र उत्थान, राजनीतिक सत्ता, मीडिया व उच्च तकनीकी साम्राज्य, विशिष्ट साधनों से ख्याति, जनसामान्य में अभूतपूर्व प्रभाव।',
    ageMilestones: [
      { age: 28, nature: 'career', eventEn: 'Daring career leap, unexpected elevation into corporate or political ranks.', eventHi: 'आजीविका में साहसिक छलांग, कॉर्पोरेट या राजनीति में अप्रत्याशित पद।' },
      { age: 36, nature: 'favorable', eventEn: 'Massive professional breakthrough, state or international recognition.', eventHi: 'ऐतिहासिक व्यावसायिक सफलता, राष्ट्रीय या अंतरराष्ट्रीय पहचान।' },
      { age: 42, nature: 'career', eventEn: 'Apex of sovereign executive or industrial mastery, legendary renown.', eventHi: 'सत्ता व आजीविका का सर्वोच्च शिखर, व्यापक ख्याति।' }
    ],
    signModifiers: {
      Taurus: { en: 'Exalted: Multi-billionaire corporate titan, influential statesman, tech pioneer.', hi: 'उच्च राशि: शीर्ष उद्योगपति, अत्यंत प्रभावशाली राजनेता, तकनीकी अग्रणी।' },
      Scorpio: { en: 'Debilitated: Sudden fall from status through scandal, professional defamation.', hi: 'नीच राशि: षड्यंत्र से पदच्युति का भय, कार्यक्षेत्र में बदनामी की आशंका।' }
    },
    aspectModifiers: [
      { graha: 'Jupiter', conditionEn: 'Aspected by Jupiter', conditionHi: 'गुरु की दृष्टि', effectEn: 'High ethical authority, protects from scandals, durable state power.', effectHi: 'उच्च नैतिक प्रतिष्ठा, बदनामी से सुरक्षा, स्थाई राजकीय सत्ता।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, dynamic corporate or public career, charismatic leader, high ambition realized.',
      hi: 'स्त्री जातक में कॉर्पोरेट या जनसेवा में सर्वोच्च पद, सम्मोहक नेत्री, उच्च महत्वाकांक्षाओं की पूर्ति।'
    }
  },
  {
    planet: 'Rahu',
    planetHi: 'राहु',
    house: 11,
    titleEn: 'Rahu in 11th House (Labha Bhava)',
    titleHi: 'राहु एकादश भाव (लाभ भाव) में',
    baseEn: 'Massive foreign wealth, influential international networks, sudden financial windfalls, ambitious aspirations fulfilled beyond expectation.',
    baseHi: 'विदेशी स्रोतों से अपार धन, अंतरराष्ट्रीय संपर्कों का लाभ, अचानक विपुल धन लाभ, कल्पना से परे सभी महत्वाकांक्षाओं की पूर्ण सिद्धि।',
    ageMilestones: [
      { age: 28, nature: 'favorable', eventEn: 'Sudden financial windfall through tech, digital media, or foreign contracts.', eventHi: 'तकनीक, डिजिटल मीडिया या विदेशी अनुबंधों से अचानक विपुल धन।' },
      { age: 42, nature: 'favorable', eventEn: 'Apex of multi-millionaire status, vast multinational network.', eventHi: 'अथाह आर्थिक समृद्धि, बहुराष्ट्रीय व्यापारिक नेटवर्क का विस्तार।' }
    ],
    signModifiers: {
      Taurus: { en: 'Exalted: Unlimited multi-stream wealth, gold, luxury real estate, global fame.', hi: 'उच्च राशि: असीमित बहुमुखी धन, स्वर्ण, विलासिता संपत्तियां, वैश्विक ख्याति।' },
      Scorpio: { en: 'Debilitated: Fluctuating profits, legal penalties, deceitful business allies.', hi: 'नीच राशि: आय में उतार-चढ़ाव, विधिक दंड, साझेदारों से विश्वासघात।' }
    },
    aspectModifiers: [
      { graha: 'Jupiter', conditionEn: 'Aspected by Jupiter', conditionHi: 'गुरु की दृष्टि', effectEn: 'Immense legitimate wealth, charitable endowments, honest international influence.', effectHi: 'विपुल धर्म सम्मत धन, विशाल दान-पुण्य, अंतरराष्ट्रीय मान-सम्मान।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, highly affluent, vast international network, foreign associations, fulfilled wishes.',
      hi: 'स्त्री जातक में अत्यधिक संपन्न, अंतरराष्ट्रीय मित्र मंडली, विदेशी संबंध, सभी इच्छाओं की पूर्ति।'
    }
  },
  {
    planet: 'Rahu',
    planetHi: 'राहु',
    house: 12,
    titleEn: 'Rahu in 12th House (Vyaya Bhava)',
    titleHi: 'राहु द्वादश भाव (व्यय व मोक्ष भाव) में',
    baseEn: 'Foreign permanent settlement, heavy expenditure on technology and luxury, sleep disturbances, spiritual wanderer in mature life.',
    baseHi: 'विदेश में स्थाई वास, तकनीकी व विलासिता पर भारी व्यय, अनिद्रा की समस्या, जीवन के उत्तरार्ध में आध्यात्मिक अन्वेषक।',
    ageMilestones: [
      { age: 28, nature: 'career', eventEn: 'Permanent foreign emigration, overseas employment initiation.', eventHi: 'विदेश में स्थाई प्रवास, सुदूर परदेस में आजीविका का प्रारंभ।' },
      { age: 42, nature: 'favorable', eventEn: 'Foreign property acquisition, metaphysical seclusion, victory over secret foes.', eventHi: 'विदेश में अचल संपत्ति, एकांत में आध्यात्मिक साधना, गुप्त शत्रुओं का शमन।' }
    ],
    signModifiers: {
      Taurus: { en: 'Exalted: Immense wealth earned abroad, luxury lifestyle in foreign lands.', hi: 'उच्च राशि: विदेश में विपुल धनोपार्जन, परदेस में वैभवशाली जीवन।' },
      Scorpio: { en: 'Debilitated: Heavy hospital or legal expenses abroad, severe insomnia.', hi: 'नीच राशि: परदेस में चिकित्सालय का भारी व्यय, गंभीर अनिद्रा, कारागार भय।' }
    },
    aspectModifiers: [
      { graha: 'Jupiter', conditionEn: 'Aspected by Jupiter', conditionHi: 'गुरु की दृष्टि', effectEn: 'Spiritual detachment, divine protection in foreign lands, charitable expenses.', effectHi: 'आध्यात्मिक विरक्ति, विदेश में ईश्वरीय रक्षा, परोपकार में व्यय।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, lives away from birthplace, secret philanthropy, spiritual seeker, sleep hygiene required.',
      hi: 'स्त्री जातक में जन्मभूमि से दूर वास, गुप्त दानशीलता, आध्यात्मिक प्रवृत्ति, निद्रा पर ध्यान आवश्यक।'
    }
  }
];

export const KETU_HOUSES = [
  {
    planet: 'Ketu',
    planetHi: 'केतु',
    house: 1,
    titleEn: 'Ketu in 1st House (Lagna)',
    titleHi: 'केतु प्रथम भाव (लग्न) में',
    baseEn: 'Spiritual, introspective, psychic intuition, scar or birthmark on body, detached ego, philosophical, indifferent to material vanity.',
    baseHi: 'आध्यात्मिक, आत्मनिरीक्षक, गहन अंतर्ज्ञान, देह पर कोई विशिष्ट चिह्न या तिल, निरहंकारी, दार्शनिक, भौतिक आडंबरों से विरक्त।',
    ageMilestones: [
      { age: 24, nature: 'career', eventEn: 'Spiritual awakening, interest in astrology, coding, or healing.', eventHi: 'आध्यात्मिक जागृति, ज्योतिष, कोडिंग अथवा प्राकृतिक चिकित्सा में रुचि।' },
      { age: 35, nature: 'favorable', eventEn: 'Mastery over esoteric shastras, profound research breakthrough.', eventHi: 'गूढ़ शास्त्रों में पारंगत, अनुसंधान में असाधारण उपलब्धि।' },
      { age: 48, nature: 'favorable', eventEn: 'Apex of spiritual realization, detachment from worldly illusions.', eventHi: 'आध्यात्मिक आत्म-साक्षात्कार का शिखर, सांसारिक मोह से मुक्ति।' }
    ],
    signModifiers: {
      Scorpio: { en: 'Exalted: Supreme psychic seer, master of occult, profound spiritual enlightenment.', hi: 'उच्च राशि (वृश्चिक): दिव्य दृष्टा, तंत्र व गुप्त विद्याओं का मर्मज्ञ, परम आत्मज्ञान।' },
      Taurus: { en: 'Debilitated: Restlessness of mind, bodily scars, digestive sensitivity.', hi: 'नीच राशि (वृषभ): मानसिक चंचलता, शरीर पर चोट का निशान, पाचन दुर्बलता।' }
    },
    aspectModifiers: [
      { graha: 'Jupiter', conditionEn: 'Aspected by Jupiter', conditionHi: 'गुरु की दृष्टि', effectEn: 'True saintly sage, revered spiritual preceptor, spotless reputation.', effectHi: 'सच्चा संन्यासी, आदरणीय आध्यात्मिक गुरु, निष्कलंक प्रतिष्ठा।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, intuitive, detached, spiritual demeanor, sensitive health, indifferent to jewelry.',
      hi: 'स्त्री जातक में अंतर्ज्ञानी, विरक्त स्वभाव, आध्यात्मिक चेतना, आभूषणों के प्रति उदासीन।'
    }
  },
  {
    planet: 'Ketu',
    planetHi: 'केतु',
    house: 2,
    titleEn: 'Ketu in 2nd House (Dhana Bhava)',
    titleHi: 'केतु द्वितीय भाव (धन भाव) में',
    baseEn: 'Laconic or blunt speech, financial detachment, eye issues, unexpected monetary gains and losses, spiritual family values.',
    baseHi: 'मितभाषी या दो-टूक वाणी, धन के प्रति विरक्ति, नेत्र विकार, आकस्मिक धन लाभ व हानि, सात्विक पारिवारिक संस्कार।',
    ageMilestones: [
      { age: 24, nature: 'career', eventEn: 'Financial emergence through research, coding, astrology, or healing.', eventHi: 'शोध, सॉफ्टवेयर, ज्योतिष या चिकित्सा द्वारा धनार्जन का प्रारंभ।' },
      { age: 48, nature: 'favorable', eventEn: 'Consolidation of spiritual wealth and debt-free peaceful sustenance.', eventHi: 'आध्यात्मिक संपदा की पूर्णता, ऋणमुक्त व शांत जीवन।' }
    ],
    signModifiers: {
      Scorpio: { en: 'Exalted: Treasures from occult sources, unexpected legacies, profound truthful speech.', hi: 'उच्च राशि: गुप्त विद्याओं से धन लाभ, अप्रत्याशित वसीयत, सत्य वाणी।' },
      Taurus: { en: 'Debilitated: Financial losses through carelessness, harsh speech in family.', hi: 'नीच राशि: असावधानी से धनहानि, कुटुंब में कटु वाणी से तनाव।' }
    },
    aspectModifiers: [
      { graha: 'Jupiter', conditionEn: 'Aspected by Jupiter', conditionHi: 'गुरु की दृष्टि', effectEn: 'Truthful speech, righteous wealth, peaceful domestic life.', effectHi: 'सत्य वचन, धर्म सम्मत धन, सुखी व शांत पारिवारिक जीवन।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, blunt words, indifference to vanity, spiritual family values, detached finance.',
      hi: 'स्त्री जातक में स्पष्टवादी, सादगीप्रिय, धार्मिक संस्कार, धन संचय में अनासक्ति।'
    }
  },
  {
    planet: 'Ketu',
    planetHi: 'केतु',
    house: 3,
    titleEn: 'Ketu in 3rd House (Sahaja Bhava)',
    titleHi: 'केतु तृतीय भाव (सहज भाव) में',
    baseEn: 'Exceptional bravery, spiritual courage, software coding or occult writing, friction with younger siblings, triumphs over adversaries.',
    baseHi: 'अद्वितीय शौर्य, आध्यात्मिक पराक्रम, सॉफ्टवेयर कोडिंग या गूढ़ लेखन, सहोदरों से मतभेद, शत्रुओं पर सहज विजय।',
    ageMilestones: [
      { age: 24, nature: 'career', eventEn: 'Daring research initiative, coding or technical publication.', eventHi: 'साहसिक शोध कार्य, तकनीकी या आध्यात्मिक लेखन का प्रकाशन।' },
      { age: 35, nature: 'favorable', eventEn: 'Triumph over competitors, spiritual courage recognized by peers.', eventHi: 'प्रतिस्पर्धियों पर विजय, आध्यात्मिक पराक्रम की समाज में प्रतिष्ठा।' }
    ],
    signModifiers: {
      Scorpio: { en: 'Exalted: Unshakeable spiritual warrior, invincible occult courage.', hi: 'उच्च राशि: अजेय आध्यात्मिक सेनानी, तंत्र व शोध में सर्वोच्च पराक्रम।' },
      Taurus: { en: 'Debilitated: Strained relations with brothers, arm injuries, restless travels.', hi: 'नीच राशि: सहोदरों से अनबन, भुजाओं में संवेदनशीलता, व्यर्थ यात्राएं।' }
    },
    aspectModifiers: [
      { graha: 'Mars', conditionEn: 'With Mars', conditionHi: 'मंगल से युति', effectEn: 'Fierce technical mastery, surgery, defense, fearless champion.', effectHi: 'तकनीकी दक्षता, शल्य क्रिया (सर्जरी), रक्षा क्षेत्र में निडर।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, daring, spiritual author, solitary pursuits, courageous protector of truth.',
      hi: 'स्त्री जातक में साहसी, आध्यात्मिक लेखिका, एकांत साधना, सत्य की निर्भीक संरक्षिका।'
    }
  },
  {
    planet: 'Ketu',
    planetHi: 'केतु',
    house: 4,
    titleEn: 'Ketu in 4th House (Sukha Bhava)',
    titleHi: 'केतु चतुर्थ भाव (सुख भाव) में',
    baseEn: 'Spiritual detachment from maternal home, ascetic peace of mind, foreign or spiritual residence, heart/chest sensitivity, quiet dwelling.',
    baseHi: 'मातृगृह से विरक्ति, संन्यासी जैसी आत्मिक शांति, तीर्थ या विदेश में वास, वक्षस्थल संवेदनशीलता, शांत व सात्विक आवास।',
    ageMilestones: [
      { age: 24, nature: 'career', eventEn: 'Relocation to quiet spiritual haven, distance from home.', eventHi: 'शांत स्थान पर वास, गृहत्याग, एकांत में विद्या अध्ययन।' },
      { age: 48, nature: 'favorable', eventEn: 'Attainment of profound inner tranquility, hermitage establishment.', eventHi: 'परम आंतरिक शांति की प्राप्ति, आध्यात्मिक आश्रम या कुटिया का निर्माण।' }
    ],
    signModifiers: {
      Scorpio: { en: 'Exalted: Sanctified peaceful hermitage, saintly maternal blessings, profound peace.', hi: 'उच्च राशि: पवित्र आश्रम तुल्य गृह, सात्विक माता का आशीर्वाद, अगाध शांति।' },
      Taurus: { en: 'Debilitated: Domestic discontent, maternal suffering, chest/heart heaviness.', hi: 'नीच राशि: गृह सुख में अशांति, माता को कष्ट, वक्ष में भारीपन।' }
    },
    aspectModifiers: [
      { graha: 'Jupiter', conditionEn: 'Aspected by Jupiter', conditionHi: 'गुरु की दृष्टि', effectEn: 'Blessed with saintly residence, maternal longevity, absolute peace.', effectHi: 'पवित्र वास, माता की दीर्घायु, अंतःकरण में परम शांति।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, detached domestic life, spiritual seeker, fond of holy places, quiet mother.',
      hi: 'स्त्री जातक में सात्विक गृहस्थी, तीर्थ स्थलों की प्रेमी, आध्यात्मिक माता, शांत स्वभाव।'
    }
  },
  {
    planet: 'Ketu',
    planetHi: 'केतु',
    house: 5,
    titleEn: 'Ketu in 5th House (Suta Bhava)',
    titleHi: 'केतु पंचम भाव (संतान व बुद्धि भाव) में',
    baseEn: 'Deep intuition, Vedic and astrological wisdom, delay or detachment from children, stomach gas/heat, profound spiritual mantra siddhi.',
    baseHi: 'गहन अंतर्ज्ञान, वैदिक व ज्योतिषीय प्रज्ञा, संतान में विलंब या संतान से अनासक्ति, उदर में वात/पित्त, उच्च कोटि की मंत्र सिद्धि।',
    ageMilestones: [
      { age: 24, nature: 'favorable', eventEn: 'Spiritual mantra initiation, mastery of Vedic/astrological principles.', eventHi: 'मंत्र दीक्षा, वैदिक व ज्योतिषीय सिद्धांतों में प्रवीणता।' },
      { age: 35, nature: 'favorable', eventEn: 'Birth of spiritual child, publication of esoteric research.', eventHi: 'सात्विक संतान का जन्म, गूढ़ शोध ग्रंथ का प्रकाशन।' }
    ],
    signModifiers: {
      Scorpio: { en: 'Exalted: Supreme Mantrajna, profound astrological intuition, saintly progeny.', hi: 'उच्च राशि: मंत्र शास्त्र का मर्मज्ञ, दिव्य ज्योतिषीय अंतर्ज्ञान, सात्विक संतान।' },
      Taurus: { en: 'Debilitated: Delay in progeny, abdominal pain, loss of concentration.', hi: 'नीच राशि: संतान में विलंब, उदर पीड़ा, एकाग्रता में व्यवधान।' }
    },
    aspectModifiers: [
      { graha: 'Jupiter', conditionEn: 'Aspected by Jupiter', conditionHi: 'गुरु की दृष्टि', effectEn: 'Shields progeny, bestows divine spiritual illumination and ancient wisdom.', effectHi: 'संतान की रक्षा, दिव्य आध्यात्मिक प्रकाश तथा प्राचीन ज्ञान की प्राप्ति।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, deep esoteric interest, meditative mindset, progeny care, spiritual teacher.',
      hi: 'स्त्री जातक में गूढ़ विद्याओं में रुचि, ध्यानमयी चित्तवृत्ति, संतान का ध्यान रखें, अध्यापिका।'
    }
  },
  {
    planet: 'Ketu',
    planetHi: 'केतु',
    house: 6,
    titleEn: 'Ketu in 6th House (Ripu Bhava)',
    titleHi: 'केतु षष्ठ भाव (रोग व शत्रु भाव) में',
    baseEn: 'Crushes rivals, immune to hidden enemies, occult healing ability, animal bites/skin sensitivity, triumphs in litigation through truth.',
    baseHi: 'शत्रुओं का दमन, गुप्त षड्यंत्रों से अप्रभावित, प्राकृतिक व आध्यात्मिक चिकित्सा क्षमता, त्वचा संवेदनशीलता, मुकदमों में सत्य से विजय।',
    ageMilestones: [
      { age: 24, nature: 'career', eventEn: 'Triumph over workplace competitors, development of healing powers.', eventHi: 'कार्यक्षेत्र के विरोधियों पर विजय, चिकित्सा व उपचार कौशल का विकास।' },
      { age: 35, nature: 'favorable', eventEn: 'Complete clearance of long-standing debts, victory over litigations.', eventHi: 'पुराने ऋणों से पूर्ण मुक्ति, विधिक विवादों का समूल शमन।' }
    ],
    signModifiers: {
      Scorpio: { en: 'Exalted: Invincible healer, complete annihilation of adversaries, robust vitality.', hi: 'उच्च राशि: महान प्राकृतिक चिकित्सक, विरोधियों का समूल नाश, उत्तम स्वास्थ्य।' },
      Taurus: { en: 'Debilitated: Chronic undiagnosed ailments, skin allergies, friction with coworkers.', hi: 'नीच राशि: अज्ञात रोग, त्वचा एलर्जी, सहकर्मियों से असहयोग।' }
    },
    aspectModifiers: [
      { graha: 'Jupiter', conditionEn: 'Aspected by Jupiter', conditionHi: 'गुरु की दृष्टि', effectEn: 'Spiritual healing mastery, universal goodwill, complete immunity.', effectHi: 'आध्यात्मिक उपचारक, सर्वहितैषी, पूर्ण रोग प्रतिरोधक क्षमता।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, strong inner resistance, overcomes opposition, spiritual healer, dedicated service.',
      hi: 'स्त्री जातक में अद्भुत आंतरिक शक्ति, विरोध पर विजय, आध्यात्मिक उपचारक, सेवाभावी।'
    }
  },
  {
    planet: 'Ketu',
    planetHi: 'केतु',
    house: 7,
    titleEn: 'Ketu in 7th House (Kalatra Bhava)',
    titleHi: 'केतु सप्तम भाव (कलत्र भाव) में',
    baseEn: 'Spiritual or detached spouse, marital misunderstandings, ascetic partner, contract disputes, marriage delays, union based on dharma.',
    baseHi: 'सात्विक या विरक्त स्वभाव का जीवनसाथी, दांपत्य में संवादहीनता, वैरागी साथी, व्यापारिक समझौतों में सतर्कता, धर्म आधारित विवाह।',
    ageMilestones: [
      { age: 28, nature: 'challenging', eventEn: 'Marital adjustments or matrimonial negotiations requiring patience.', eventHi: 'विवाह में विलंब या दांपत्य सामंजस्य की परीक्षा का वर्ष।' },
      { age: 35, nature: 'favorable', eventEn: 'Spiritual harmony with spouse, successful detached trade partnerships.', eventHi: 'दांपत्य में आध्यात्मिक एकता, व्यापार में स्थिरता।' }
    ],
    signModifiers: {
      Scorpio: { en: 'Exalted: Highly spiritual, intuitive, and dedicated spouse; harmonious dharmic bond.', hi: 'उच्च राशि: अत्यंत आध्यात्मिक, अंतर्ज्ञानी व समर्पित जीवनसाथी; पवित्र दांपत्य।' },
      Taurus: { en: 'Debilitated: Marital estrangement, partner health fragility, partnership disputes.', hi: 'नीच राशि: दांपत्य में दूरी, जीवनसाथी का दुर्बल स्वास्थ्य, साझेदारी में विवाद।' }
    },
    aspectModifiers: [
      { graha: 'Jupiter', conditionEn: 'Aspected by Jupiter', conditionHi: 'गुरु की दृष्टि', effectEn: 'Spiritualizes marriage, dissolves discord, grants noble preceptor-like partner.', effectHi: 'दांपत्य में आध्यात्मिकता, कलह का शमन, संस्कारी जीवनसाथी।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, spiritual husband, detached conjugal ties, high spiritual yearning, patient home builder.',
      hi: 'स्त्री जातक में आध्यात्मिक पति, दांपत्य में सात्विकता, ईश्वर भक्ति में रुचि, शांत गृहिणी।'
    }
  },
  {
    planet: 'Ketu',
    planetHi: 'केतु',
    house: 8,
    titleEn: 'Ketu in 8th House (Ayu Bhava)',
    titleHi: 'केतु अष्टम भाव (आयु व रंध्र भाव) में',
    baseEn: 'Moksha seeker, deep psychic ability, sudden longevity shifts, interest in tantra, astrology, and ancient scripts, sudden windfalls.',
    baseHi: 'मोक्षकामी, गहन पराशारीरिक अंतर्ज्ञान, तंत्र, ज्योतिष व प्राचीन लिपियों में प्रवीण, वसीयत या गुप्त स्रोतों से आकस्मिक धन।',
    ageMilestones: [
      { age: 24, nature: 'favorable', eventEn: 'Awakening of occult perception, psychic breakthrough.', eventHi: 'गुप्त विद्याओं की जागृति, आध्यात्मिक अंतर्दृष्टि का उदय।' },
      { age: 36, nature: 'favorable', eventEn: 'Sudden financial inheritance, esoteric treatise authorship.', eventHi: 'अचानक वसीयत से लाभ अथवा गूढ़ शोध ग्रंथ की रचना।' }
    ],
    signModifiers: {
      Scorpio: { en: 'Exalted: Supreme tantric mystic, long life, peaceful transition to higher realms.', hi: 'उच्च राशि: तंत्र व अध्यात्म का शिखर, सुदीर्घ जीवन, परम सद्गति।' },
      Taurus: { en: 'Debilitated: Sudden ailments, disputes over legacy, insect/reptile bites caution.', hi: 'नीच राशि: आकस्मिक रोग, वसीयत में विवाद, कीट-दंश से सावधानी।' }
    },
    aspectModifiers: [
      { graha: 'Jupiter', conditionEn: 'Aspected by Jupiter', conditionHi: 'गुरु की दृष्टि', effectEn: 'Shields vitality, bestows divine metaphysical illumination and peaceful longevity.', effectHi: 'प्राण रक्षा, दिव्य आध्यात्मिक ज्ञान तथा शांत व सुदीर्घ जीवन।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, high psychic intuition, secret research, calm under crises, sudden legacy from in-laws.',
      hi: 'स्त्री जातक में तीव्र अंतर्ज्ञान, गुप्त शोध, संकट में शांत बुद्धि, ससुराल से वसीयत लाभ।'
    }
  },
  {
    planet: 'Ketu',
    planetHi: 'केतु',
    house: 9,
    titleEn: 'Ketu in 9th House (Dharma Bhava)',
    titleHi: 'केतु नवम भाव (धर्म व भाग्य भाव) में',
    baseEn: 'Spiritual master, pilgrimage to remote shrines, dharmic detachment, guru blessings, higher mystical wisdom, foreign travels.',
    baseHi: 'आध्यात्मिक गुरु, दुर्गम तीर्थों की यात्राएं, धर्म में अनासक्ति, गुरुजनों की विशेष कृपा, उच्च रहस्यवादी ज्ञान, विदेश यात्रा।',
    ageMilestones: [
      { age: 24, nature: 'favorable', eventEn: 'Spiritual pilgrimage to remote mountain shrines, initiation by saint.', eventHi: 'दुर्गम पर्वतीय तीर्थों की यात्रा, सिद्ध संत से दीक्षा।' },
      { age: 32, nature: 'favorable', eventEn: 'Fortune dawn through spiritual authorship, teaching, or philosophy.', eventHi: 'आध्यात्मिक लेखन, शिक्षण या दर्शन द्वारा विशाल भाग्योदय।' }
    ],
    signModifiers: {
      Scorpio: { en: 'Exalted: Saint of highest order, divine revelations, illustrious spiritual lineage.', hi: 'उच्च राशि: उच्च कोटि का संत, दिव्य ईश्वरीय अनुभूतियां, आध्यात्मिक प्रतिष्ठा।' },
      Taurus: { en: 'Debilitated: Conflict with orthodox father, travel fatigue, skepticism.', hi: 'नीच राशि: पिता से मतभेद, यात्रा में अत्यधिक कष्ट, आस्था में संशय।' }
    },
    aspectModifiers: [
      { graha: 'Jupiter', conditionEn: 'With or aspected by Jupiter', conditionHi: 'गुरु से युति या दृष्टि', effectEn: 'World spiritual teacher, spotless renunciation, universally revered.', effectHi: 'विश्व प्रसिद्ध आध्यात्मिक गुरु, निष्कलंक संन्यास, सर्वपूज्य।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, saintly disposition, temple devotee, pure philosophical insight, blessed offspring.',
      hi: 'स्त्री जातक में साध्वी जैसा स्वभाव, मंदिर व तीर्थ प्रिय, सात्विक दार्शनिक प्रज्ञा, उत्तम संतान।'
    }
  },
  {
    planet: 'Ketu',
    planetHi: 'केतु',
    house: 10,
    titleEn: 'Ketu in 10th House (Karma Bhava)',
    titleHi: 'केतु दशम भाव (कर्म व राज्य भाव) में',
    baseEn: 'Detached from worldly status, famous in spiritual, medical, or astrological fields, flag-bearer of truth, ethical profession, unconventional vocation.',
    baseHi: 'सांसारिक पद-प्रतिष्ठा से अनासक्त, आध्यात्मिक, चिकित्सा या ज्योतिषीय क्षेत्र में प्रसिद्ध, सत्य का ध्वजवाहक, नीतिपूर्ण व विशिष्ट आजीविका।',
    ageMilestones: [
      { age: 28, nature: 'career', eventEn: 'Breakthrough in research, software coding, astrology, or healing.', eventHi: 'शोध, सॉफ्टवेयर, ज्योतिष या प्राकृतिक चिकित्सा में विशिष्ट पहचान।' },
      { age: 36, nature: 'favorable', eventEn: 'Spiritual professional renown, advisory position in prestigious institution.', eventHi: 'आध्यात्मिक व बौद्धिक क्षेत्र में सर्वोच्च ख्याति, संस्थान में मुख्य सलाहकार।' }
    ],
    signModifiers: {
      Scorpio: { en: 'Exalted: Renowned spiritual leader, top surgeon, master software architect.', hi: 'उच्च राशि: ख्यातिलब्ध आध्यात्मिक नेता, शीर्ष सर्जन, अद्वितीय सॉफ्टवेयर वास्तुकार।' },
      Taurus: { en: 'Debilitated: Instability in career, lack of professional recognition.', hi: 'नीच राशि: आजीविका में बार-बार परिवर्तन, परिश्रम का यथोचित फल न मिलना।' }
    },
    aspectModifiers: [
      { graha: 'Jupiter', conditionEn: 'Aspected by Jupiter', conditionHi: 'गुरु की दृष्टि', effectEn: 'Spotless professional dignity, judicial or religious authority, honored by rulers.', effectHi: 'निष्कलंक व्यावसायिक सम्मान, न्यायिक या धार्मिक अधिकार, राजसम्मान।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, ethical career, respected in research or healing, indifferent to vanity, respected leader.',
      hi: 'स्त्री जातक में नीतिपूर्ण आजीविका, शोध या चिकित्सा में सम्मानित, आडंबरों से दूर, आदरणीय।'
    }
  },
  {
    planet: 'Ketu',
    planetHi: 'केतु',
    house: 11,
    titleEn: 'Ketu in 11th House (Labha Bhava)',
    titleHi: 'केतु एकादश भाव (लाभ भाव) में',
    baseEn: 'Unexpected spiritual and financial windfalls, few friends, philosophical gains, fulfillment of essential desires without greed.',
    baseHi: 'अचानक आध्यात्मिक व भौतिक धन लाभ, गिने-चुने विश्वस्त मित्र, दार्शनिक उपलब्धियां, लोभ रहित होकर भी सभी आवश्यक इच्छाओं की पूर्ति।',
    ageMilestones: [
      { age: 24, nature: 'favorable', eventEn: 'Unexpected financial windfall through intellectual or spiritual pursuit.', eventHi: 'बौद्धिक या आध्यात्मिक उपक्रम से अचानक धन लाभ।' },
      { age: 35, nature: 'favorable', eventEn: 'Consolidation of quiet wealth, detachment from materialistic peers.', eventHi: 'स्थाई शांत धन संचय, भौतिकवादी संगति से मुक्ति।' }
    ],
    signModifiers: {
      Scorpio: { en: 'Exalted: Immense unexpected wealth, saintly allies, fulfilled life mission.', hi: 'उच्च राशि: आकस्मिक विपुल धन, संतों की संगति, जीवन के उद्देश्य की पूर्णता।' },
      Taurus: { en: 'Debilitated: Fluctuating income, isolation from elder brother, unrewarded efforts.', hi: 'नीच राशि: आय में अस्थिरता, अग्रज से दूरी, प्रयासों में विलंब।' }
    },
    aspectModifiers: [
      { graha: 'Jupiter', conditionEn: 'Aspected by Jupiter', conditionHi: 'गुरु की दृष्टि', effectEn: 'Righteous and eternal wealth, noble philanthropic endowments.', effectHi: 'धर्म सम्मत अक्षय धन, विशाल लोक कल्याणकारी कार्य।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, prosperous through unusual channels, solitary satisfaction, fulfilled desires.',
      hi: 'स्त्री जातक में विशिष्ट साधनों से संपन्न, एकांत में संतोष, मनोकामनाओं की सिद्धि।'
    }
  },
  {
    planet: 'Ketu',
    planetHi: 'केतु',
    house: 12,
    titleEn: 'Ketu in 12th House (Vyaya Bhava)',
    titleHi: 'केतु द्वादश भाव (व्यय व मोक्ष भाव) में',
    baseEn: 'Mokshakaraka in Mokshasthana: Highest spiritual liberation, supreme detachment, peaceful sleep, divine contemplation, foreign seclusion.',
    baseHi: 'मोक्षकारक केतु मोक्ष भाव में: परम मोक्ष प्राप्ति, सांसारिक मोह-माया का समूल नाश, शांत निद्रा, ईश्वर का निरंतर स्मरण, विदेश में एकांत साधना।',
    ageMilestones: [
      { age: 24, nature: 'favorable', eventEn: 'Spiritual initiation, beginning of higher metaphysical meditation.', eventHi: 'आध्यात्मिक दीक्षा, उच्च समाधि व ध्यान का प्रारंभ।' },
      { age: 48, nature: 'favorable', eventEn: 'Supreme spiritual ascension, liberation from rebirth cycle (Moksha path).', eventHi: 'परम आध्यात्मिक उत्थान, जन्म-मरण के चक्र से मुक्ति का मोक्ष मार्ग।' }
    ],
    signModifiers: {
      Scorpio: { en: 'Exalted: Supreme Moksha yoga, merging of individual soul with Divine, supreme peace.', hi: 'उच्च राशि: सर्वोच्च मोक्ष योग, जीवात्मा का परमात्मा में विलीन होना, अखंड शांति।' },
      Taurus: { en: 'Debilitated: Sleep restlessness, expenditure on health, eye strain.', hi: 'नीच राशि: अनिद्रा, चिकित्सा पर व्यय, नेत्र संवेदनशीलता।' }
    },
    aspectModifiers: [
      { graha: 'Jupiter', conditionEn: 'Aspected by Jupiter', conditionHi: 'गुरु की दृष्टि', effectEn: 'Guaranteed spiritual liberation, divine light, absolute bliss in seclusion.', effectHi: 'निश्चित मोक्ष मार्ग, दिव्य प्रकाश का दर्शन, एकांत में परमानंद।' }
    ],
    femaleHoroscope: {
      en: 'In female horoscope, saintly, detachment from material world, supreme spiritual peace, foreign hermitage.',
      hi: 'स्त्री जातक में साध्वी स्वरूप, सांसारिक प्रपंचों से विरक्ति, परम आध्यात्मिक शांति।'
    }
  }
];

console.log('Rahu and Ketu structures loaded.');
