// scripts/appendRemainingGochara.mjs
import fs from 'fs';
import path from 'path';

const filePath = path.resolve('scripts/data/gocharaData.mjs');

const remainingGochara = [
  // MERCURY (बुध)
  {
    planet: 'Mercury', planetHi: 'बुध', houseFromMoon: 1, isFavorable: false,
    summaryEn: 'Loss through false speech, nervous strain, slander, communication errors.',
    summaryHi: 'वाणी के कारण विवाद, स्नायु तनाव, मिथ्या आरोप, संवाद में गलतफहमियां।',
    detailedEn: 'Mercury transiting natal Moon causes mental restlessness, nervousness, defamation by peers, and verbal disputes.',
    detailedHi: 'प्रथम भाव में बुध का गोचर मानसिक चंचलता, स्नायु उद्वेग, कटु वचनों से बदनामी तथा संवाद में अवरोध लाता है।'
  },
  {
    planet: 'Mercury', planetHi: 'बुध', houseFromMoon: 2, isFavorable: true, vedhaHouse: 5,
    summaryEn: 'Wealth accumulation, sweet speech, commercial success, culinary delights.',
    summaryHi: 'विपुल धन संचय, मधुर व सम्मोहक वाणी, व्यापार में भारी लाभ, उत्तम भोजन।',
    detailedEn: 'Mercury in 2nd brings monetary profits from commerce and writing, respect in family, and intellectual oratory.',
    detailedHi: 'द्वितीय भाव में बुध का गोचर व्यापार में भारी मुनाफा, कुटुंब में मान-सम्मान, मधुर वाणी तथा वित्तीय समृद्धि देता है।'
  },
  {
    planet: 'Mercury', planetHi: 'बुध', houseFromMoon: 3, isFavorable: false,
    summaryEn: 'Friction with colleagues, brotherly disputes, travel fatigue, communication mishaps.',
    summaryHi: 'सहकर्मियों से मनमुटाव, भाइयों से विवाद, यात्रा में थकान, दस्तावेजी त्रुटियां।',
    detailedEn: 'Mercury in 3rd causes anxiety in contracts, disagreements with younger brothers, and wasted efforts in correspondence.',
    detailedHi: 'तृतीय भाव में बुध का गोचर सहोदरों से मतभेद, अनुबंधों में त्रुटि तथा व्यर्थ की भागदौड़ उत्पन्न करता है।'
  },
  {
    planet: 'Mercury', planetHi: 'बुध', houseFromMoon: 4, isFavorable: true, vedhaHouse: 2,
    summaryEn: 'Intellectual gains, maternal happiness, education advancement, home peace.',
    summaryHi: 'बौद्धिक प्रगति, माता का पूर्ण सुख, शिक्षा में सफलता, पारिवारिक शांति।',
    detailedEn: 'Mercury in 4th brings success in academic pursuits, acquisition of vehicles or property, and mental contentment.',
    detailedHi: 'चतुर्थ भाव में बुध का गोचर विद्या में सर्वोच्च अंक, माता का स्नेह, सुंदर वाहन सुख तथा मानसिक शांति देता है।'
  },
  {
    planet: 'Mercury', planetHi: 'बुध', houseFromMoon: 5, isFavorable: false,
    summaryEn: 'Mental confusion, educational hurdles, anxiety over children, speculative loss.',
    summaryHi: 'बुद्धि में भ्रम, अध्ययन में व्यवधान, संतान को लेकर चिंता, वित्तीय जोखिम में हानि।',
    detailedEn: 'Mercury in 5th creates memory lapses, misunderstandings with loved ones, and hurdles in creative initiatives.',
    detailedHi: 'पंचम भाव में बुध का गोचर मानसिक एकाग्रता में कमी, संतान की चिंता तथा प्रेम संबंधों में असमंजस लाता है।'
  },
  {
    planet: 'Mercury', planetHi: 'बुध', houseFromMoon: 6, isFavorable: true, vedhaHouse: 1,
    summaryEn: 'Triumph in debate, popularity, academic victory, subjugation of competitors.',
    summaryHi: 'वाद-विवाद में विजय, लोकप्रियता, प्रतियोगी परीक्षाओं में सफलता, विरोधियों की पराजय।',
    detailedEn: 'Mercury in 6th is highly favorable: Destroys rivals with sharp intellect, wins legal negotiations, and brings workplace praise.',
    detailedHi: 'षष्ठ भाव में बुध का गोचर परम शुभ है: तीक्ष्ण बुद्धि से विरोधियों की पराजय, मुकदमों में जीत तथा कार्यक्षेत्र में यश।'
  },
  {
    planet: 'Mercury', planetHi: 'बुध', houseFromMoon: 7, isFavorable: false,
    summaryEn: 'Marital estrangement, disputes in trade partnerships, travel fatigue, misunderstandings.',
    summaryHi: 'दांपत्य में वैचारिक मतभेद, व्यापारिक साझेदारी में तनाव, यात्रा कष्ट, अविश्वास।',
    detailedEn: 'Mercury in 7th causes disagreements with spouse over small issues, friction with trade associates, and contract delays.',
    detailedHi: 'सप्तम भाव में बुध का गोचर जीवनसाथी से अनबन, व्यापारिक अनुबंधों में रुकावट तथा साझेदारी में मतभेद देता है।'
  },
  {
    planet: 'Mercury', planetHi: 'बुध', houseFromMoon: 8, isFavorable: true, vedhaHouse: 4,
    summaryEn: 'Acquisition of wealth, scholarly acclaim, legacy gains, mental joy.',
    summaryHi: 'अकस्मात धन लाभ, विद्वता की प्रशंसा, वसीयत से लाभ, मन में उल्लास।',
    detailedEn: 'Mercury in 8th brings sudden monetary windfalls, success in esoteric or scientific research, and longevity assurance.',
    detailedHi: 'अष्टम भाव में बुध का गोचर अचानक धन प्राप्ति, गूढ़ वैज्ञानिक शोध में ख्याति तथा मानसिक शांति प्रदान करता है।'
  },
  {
    planet: 'Mercury', planetHi: 'बुध', houseFromMoon: 9, isFavorable: false,
    summaryEn: 'Obstacles in virtue, travel fatigue, friction with preceptors, delayed fortunes.',
    summaryHi: 'धार्मिक कार्यों में रुकावट, यात्रा में थकान, गुरुजनों से मतभेद, भाग्योदय में विलंब।',
    detailedEn: 'Mercury in 9th causes doubts, interruptions in higher education, and fatigue during long journeys.',
    detailedHi: 'नवम भाव में बुध का गोचर उच्च शिक्षा में विघ्न, यात्रा में व्यर्थ श्रम तथा भाग्य में शिथिलता लाता है।'
  },
  {
    planet: 'Mercury', planetHi: 'बुध', houseFromMoon: 10, isFavorable: true, vedhaHouse: 8,
    summaryEn: 'Victory in profession, status elevation, peace of mind, lucrative business contracts.',
    summaryHi: 'कार्यक्षेत्र में ऐतिहासिक विजय, पदोन्नति, मानसिक शांति, लाभदायक व्यापारिक अनुबंध।',
    detailedEn: 'Mercury in 10th brings honors from superiors, successful financial audits, public acclaim, and commercial zenith.',
    detailedHi: 'दशम भाव में बुध का गोचर अधिकारियों से प्रशंसा, पदोन्नति, व्यापारिक शिखर तथा समाज में आदर देता है।'
  },
  {
    planet: 'Mercury', planetHi: 'बुध', houseFromMoon: 11, isFavorable: true, vedhaHouse: 9,
    summaryEn: 'Financial profits, cordial friendships, new contracts, joy from children and elder brothers.',
    summaryHi: 'चौतरफा धन लाभ, प्रगाढ़ मित्रता, नवीन अनुबंध, संतान व अग्रज से सुख।',
    detailedEn: 'Mercury in 11th multiplies cash flow, brings intellectual friendships, fulfilling long-awaited commercial dreams.',
    detailedHi: 'एकादश भाव में बुध का गोचर विपुल धनोपार्जन, विद्वान मित्रों का सहयोग तथा सभी व्यापारिक योजनाओं की सिद्धि कराता है।'
  },
  {
    planet: 'Mercury', planetHi: 'बुध', houseFromMoon: 12, isFavorable: false,
    summaryEn: 'Loss through deceit, heavy educational expenses, nervous fatigue, sleep disturbances.',
    summaryHi: 'धोखे से धनहानि, शिक्षा पर भारी व्यय, स्नायु दुर्बलता, अनिद्रा की समस्या।',
    detailedEn: 'Mercury in 12th causes expenditure on unexpected travel or legal papers, mental strain, and overseas hassles.',
    detailedHi: 'द्वादश भाव में बुध का गोचर अनावश्यक व्यय, मानसिक तनाव तथा विदेश प्रवास में दस्तावेजी अड़चनें लाता है।'
  },

  // JUPITER (बृहस्पति / गुरु)
  {
    planet: 'Jupiter', planetHi: 'बृहस्पति (गुरु)', houseFromMoon: 1, isFavorable: false,
    summaryEn: 'Displacement, heavy responsibilities, fatigue, loss of position, health vulnerability.',
    summaryHi: 'स्थान परिवर्तन, अत्यधिक कार्यभार, शारीरिक थकान, पद में अस्थिरता, यकृत संवेदनशीलता।',
    detailedEn: 'Jupiter transiting natal Moon brings sudden relocation, separation from comfort, heavy ethical responsibilities, and digestive sluggishness.',
    detailedHi: 'जन्म राशि पर गुरु का गोचर स्थान परिवर्तन, कार्य का भारी बोझ, मान-सम्मान की परीक्षा तथा स्वास्थ्य में शिथिलता लाता है।'
  },
  {
    planet: 'Jupiter', planetHi: 'बृहस्पति (गुरु)', houseFromMoon: 2, isFavorable: true, vedhaHouse: 12,
    summaryEn: 'Financial abundance, birth of child, family joy, accumulation of gold and jewels.',
    summaryHi: 'विपुल धन संपदा, संतान सुख, कुटुंब में उत्सव, स्वर्ण व आभूषणों का भारी संचय।',
    detailedEn: 'Jupiter in 2nd is supreme Dhana yoga transit: Multiplies wealth, bestows sweet speech, family harmony, and celebration.',
    detailedHi: 'द्वितीय भाव में गुरु का गोचर परम धनदायक है: अखंड लक्ष्मी की प्राप्ति, संतान का जन्म, कुटुंब में मांगलिक कार्य तथा सत्य वाणी।'
  },
  {
    planet: 'Jupiter', planetHi: 'बृहस्पति (गुरु)', houseFromMoon: 3, isFavorable: false,
    summaryEn: 'Obstacles through relatives, frustration in projects, loss of position, travel fatigue.',
    summaryHi: 'संबंधियों से मतभेद, कार्यों में रुकावट, पद में अस्थिरता, व्यर्थ यात्राओं में थकान।',
    detailedEn: 'Jupiter in 3rd causes friction with siblings, disappointment in plans, loss of money through bad advice, and mental worry.',
    detailedHi: 'तृतीय भाव में गुरु का गोचर सहोदरों से तनाव, योजनाओं में विफलता तथा गलत सलाह से धनहानि कराता है।'
  },
  {
    planet: 'Jupiter', planetHi: 'बृहस्पति (गुरु)', houseFromMoon: 4, isFavorable: false,
    summaryEn: 'Property disputes, domestic discord, mother illness, vehicle breakdown, mental restlessness.',
    summaryHi: 'भूमि-भवन में विवाद, गृह क्लेश, माता के स्वास्थ्य की चिंता, वाहन में खराबी, मानसिक अशांति।',
    detailedEn: 'Jupiter in 4th brings sorrow in family matters, disputes over ancestral land, separation from mother, and heart heaviness.',
    detailedHi: 'चतुर्थ भाव में गुरु का गोचर पारिवारिक कलह, पैतृक संपत्ति में विवाद तथा माता को शारीरिक कष्ट उत्पन्न करता है।'
  },
  {
    planet: 'Jupiter', planetHi: 'बृहस्पति (गुरु)', houseFromMoon: 5, isFavorable: true, vedhaHouse: 4,
    summaryEn: 'Scholarly honors, progeny bliss, spiritual growth, divine grace, royal patronage.',
    summaryHi: 'विद्वत सम्मान, संतान सुख, आध्यात्मिक उन्नति, ईश्वरीय कृपा, शासन से विशेष सहयोग।',
    detailedEn: 'Jupiter in 5th is one of the grandest classical transits: Bestows illustrious progeny, scholarly triumphs, speculative wealth, and divine mantra siddhi.',
    detailedHi: 'पंचम भाव में गुरु का गोचर अत्यंत मंगलकारी है: सुलक्षण संतान का जन्म, विद्या में सर्वोच्च सम्मान, मंत्र सिद्धि तथा अखंड सौभाग्य।'
  },
  {
    planet: 'Jupiter', planetHi: 'बृहस्पति (गुरु)', houseFromMoon: 6, isFavorable: false,
    summaryEn: 'Troubles from enemies, liver ailments, debt anxiety, litigation hurdles.',
    summaryHi: 'विरोधियों से तनाव, यकृत व पाचन विकार, ऋण की चिंता, न्यायालयीन मुकदमों में विलंब।',
    detailedEn: 'Jupiter in 6th brings disputes with subordinates, digestive or metabolic disorders, and expenditure on litigations.',
    detailedHi: 'षष्ठ भाव में गुरु का गोचर विरोधियों की सक्रियता, यकृत रोग, कर्ज की चिंता तथा मुकदमों में धन व्यय कराता है।'
  },
  {
    planet: 'Jupiter', planetHi: 'बृहस्पति (गुरु)', houseFromMoon: 7, isFavorable: true, vedhaHouse: 3,
    summaryEn: 'Fortunate marriage, royal honor, partnership gains, conjugal joy, diplomatic triumph.',
    summaryHi: 'शुभ विवाह, राजसम्मान, व्यापारिक साझेदारी में लाभ, अखंड दांपत्य सुख, कूटनीतिक विजय।',
    detailedEn: 'Jupiter in 7th brings matrimonial alliance with noble family, immense partnership profits, foreign diplomatic acclaim, and public love.',
    detailedHi: 'सप्तम भाव में गुरु का गोचर मांगलिक विवाह योग, दांपत्य में अपार सुख, व्यापारिक साझेदारी में भारी मुनाफा तथा लोक सम्मान देता है।'
  },
  {
    planet: 'Jupiter', planetHi: 'बृहस्पति (गुरु)', houseFromMoon: 8, isFavorable: false,
    summaryEn: 'Fatigue, loss of position, health vulnerability, delays, travel hardships.',
    summaryHi: 'शारीरिक थकान, पदच्युति का भय, स्वास्थ्य में शिथिलता, कार्यों में विलंब, कष्टप्रद यात्रा।',
    detailedEn: 'Jupiter in 8th requires caution: Fatigue, loss of money through carelessness, legal delays, and digestive vulnerability.',
    detailedHi: 'अष्टम भाव में गुरु का गोचर मानहानि का भय, स्वास्थ्य शिथिलता, मुकदमों में विलंब तथा धनहानि का संकेत देता है।'
  },
  {
    planet: 'Jupiter', planetHi: 'बृहस्पति (गुरु)', houseFromMoon: 9, isFavorable: true, vedhaHouse: 10,
    summaryEn: 'All-round prosperity, pilgrimage, paternal bliss, fortune dawn, universal reverence.',
    summaryHi: 'सर्वतोमुखी समृद्धि, तीर्थ यात्रा, पिता का सुख, महान भाग्योदय, समाज में पूज्य सम्मान।',
    detailedEn: 'Jupiter in 9th is the supreme Bhagyodaya transit: Everything turns auspicious, long-cherished dreams materialize, temple visits succeed.',
    detailedHi: 'नवम भाव में गुरु का गोचर अखंड भाग्योदय का समय है: सभी कार्य सिद्ध, तीर्थाटन, पिता व गुरुजनों का आशीर्वाद तथा सर्वत्र विजय।'
  },
  {
    planet: 'Jupiter', planetHi: 'बृहस्पति (गुरु)', houseFromMoon: 10, isFavorable: false,
    summaryEn: 'Loss of position, workplace friction, arduous duties, loss of authority.',
    summaryHi: 'पद में अस्थिरता, कार्यक्षेत्र में असहयोग, अत्यधिक श्रम, अधिकारों में कमी।',
    detailedEn: 'Jupiter in 10th brings displacement in job, lack of appreciation from superiors, and ethical dilemmas at work.',
    detailedHi: 'दशम भाव में गुरु का गोचर आजीविका में बाधा, अधिकारियों से अनबन तथा अत्यधिक परिश्रम के बावजूद अल्प सम्मान देता है।'
  },
  {
    planet: 'Jupiter', planetHi: 'बृहस्पति (गुरु)', houseFromMoon: 11, isFavorable: true, vedhaHouse: 8,
    summaryEn: 'Fulfilment of all desires, massive gains, high status, honors, prosperous children.',
    summaryHi: 'सभी मनोकामनाओं की पूर्ण सिद्धि, विपुल धन लाभ, उच्च पद, राजकीय सम्मान, संतान की उन्नति।',
    detailedEn: 'Jupiter in 11th showers multi-fold wealth, fulfills every pending ambition, grants noble associations, and brings celebration.',
    detailedHi: 'एकादश भाव में गुरु का गोचर सर्वोत्तम लाभ देता है: अकूत धन संचय, सभी योजनाओं की पूर्णता, अग्रज का सहयोग तथा महालक्ष्मी कृपा।'
  },
  {
    planet: 'Jupiter', planetHi: 'बृहस्पति (गुरु)', houseFromMoon: 12, isFavorable: false,
    summaryEn: 'Heavy expenditure on ceremonies, foreign separation, grief over property, spiritual detachment.',
    summaryHi: 'मांगलिक कार्यों या चिकित्सा पर भारी व्यय, विदेश प्रवास, संपत्ति की चिंता, वैराग्य।',
    detailedEn: 'Jupiter in 12th causes expenditure on religious rites, separation from kin, overseas hurdles, and spiritual contemplation.',
    detailedHi: 'द्वादश भाव में गुरु का गोचर धर्मार्थ या चिकित्सा में भारी धन व्यय, स्वजनों से दूरी तथा एकांत में चिंतन कराता है।'
  },

  // VENUS (शुक्र)
  {
    planet: 'Venus', planetHi: 'शुक्र', houseFromMoon: 1, isFavorable: true, vedhaHouse: 8,
    summaryEn: 'Sensory pleasures, fine garments, romance, radiant appearance, delicious food.',
    summaryHi: 'इंद्रिय सुख, सुंदर वस्त्राभूषण, प्रेम प्रसंग, कांतिवान स्वरूप, स्वादिष्ट भोजन।',
    detailedEn: 'Venus over natal Moon brings romantic joys, attractive appearance, luxury acquisitions, and happy domestic moments.',
    detailedHi: 'प्रथम भाव में शुक्र का गोचर उत्तम सौंदर्य, प्रेम संबंधों में प्रगाढ़ता, विलासिता के साधनों की प्राप्ति तथा मानसिक प्रसन्नता देता है।'
  },
  {
    planet: 'Venus', planetHi: 'शुक्र', houseFromMoon: 2, isFavorable: true, vedhaHouse: 7,
    summaryEn: 'Monetary accumulation, sweet words, family joy, purchase of jewelry and gold.',
    summaryHi: 'विपुल धन संचय, मधुर वाणी, कुटुंब में सुख-शांति, स्वर्ण व आभूषणों का क्रय।',
    detailedEn: 'Venus in 2nd multiplies wealth through arts and luxury, resolves domestic disputes, and bestows sweet melodious speech.',
    detailedHi: 'द्वितीय भाव में शुक्र का गोचर धन की प्रचुरता, आभूषणों की प्राप्ति, कुटुंब में मांगलिक उत्सव तथा वाणी में माधुर्य देता है।'
  },
  {
    planet: 'Venus', planetHi: 'शुक्र', houseFromMoon: 3, isFavorable: true, vedhaHouse: 1,
    summaryEn: 'Wealth, siblings happiness, influence, artistic triumph, joyful short trips.',
    summaryHi: 'धन लाभ, सहोदरों से स्नेह, प्रभाव में वृद्धि, कलात्मक सफलता, सुखद यात्राएं।',
    detailedEn: 'Venus in 3rd brings creative renown, support from sisters, profitable commercial travels, and attractive influence.',
    detailedHi: 'तृतीय भाव में शुक्र का गोचर कला व संगीत में ख्याति, बहनों का सहयोग, व्यापारिक यात्राओं में लाभ तथा समाज में सम्मान देता है।'
  },
  {
    planet: 'Venus', planetHi: 'शुक्र', houseFromMoon: 4, isFavorable: true, vedhaHouse: 10,
    summaryEn: 'Luxurious vehicle, home comfort, maternal joy, artistic interior decorations.',
    summaryHi: 'उत्तम वाहन सुख, गृह में सुख-शांति, माता का स्नेह, सुंदर व सुरुचिपूर्ण गृह सज्जा।',
    detailedEn: 'Venus in 4th brings purchase of luxury car, renovation of residence, peaceful domestic life, and affectionate mother.',
    detailedHi: 'चतुर्थ भाव में शुक्र का गोचर नवीन वाहन की प्राप्ति, भव्य गृह सुख, माता का आशीर्वाद तथा पारिवारिक आनंद देता है।'
  },
  {
    planet: 'Venus', planetHi: 'शुक्र', houseFromMoon: 5, isFavorable: true, vedhaHouse: 9,
    summaryEn: 'Children joy, romantic bliss, speculative gains, artistic and poetic acclaim.',
    summaryHi: 'संतान सुख, प्रेम में सफलता, वित्तीय निवेश में लाभ, कला व काव्य में प्रशंसा।',
    detailedEn: 'Venus in 5th fulfills romantic desires, brings birth or honors to children, and yields profits through creative ventures.',
    detailedHi: 'पंचम भाव में शुक्र का गोचर प्रेम संबंधों का चरमोत्कर्ष, संतान से सुख, कलात्मक रचनाओं में पुरस्कार तथा धन लाभ कराता है।'
  },
  {
    planet: 'Venus', planetHi: 'शुक्र', houseFromMoon: 6, isFavorable: false,
    summaryEn: 'Quarrels with women, urinary troubles, digestive weakness, relationship friction.',
    summaryHi: 'स्त्री वर्ग से विवाद, मूत्र या गुर्दे विकार, पाचन दुर्बलता, संबंधों में खटास।',
    detailedEn: 'Venus in 6th is unfavorable: Causes scandalous disputes with female associates, kidney sensitivity, and debt strain.',
    detailedHi: 'षष्ठ भाव में शुक्र का गोचर स्त्रियों से अनबन, गुर्दे या मूत्राशय में शिथिलता तथा विलासिता के कारण कर्ज का तनाव देता है।'
  },
  {
    planet: 'Venus', planetHi: 'शुक्र', houseFromMoon: 7, isFavorable: false,
    summaryEn: 'Disputes with spouse, marital strain, financial loss through luxury or scandals.',
    summaryHi: 'दांपत्य में मतभेद, जीवनसाथी से कलह, विलासिता या बदनामी से धनहानि।',
    detailedEn: 'Venus in 7th causes marital discord, mutual accusations, weariness in travel, and loss in commercial partnerships.',
    detailedHi: 'सप्तम भाव में शुक्र का गोचर दांपत्य में अविश्वास, जीवनसाथी के स्वास्थ्य की चिंता तथा साझेदारी में तनाव लाता है।'
  },
  {
    planet: 'Venus', planetHi: 'शुक्र', houseFromMoon: 8, isFavorable: true, vedhaHouse: 5,
    summaryEn: 'Unexpected gains, luxury, sensual satisfaction, gifts from in-laws, longevity.',
    summaryHi: 'आकस्मिक धन लाभ, विलासिता की वस्तुएं, कामसुख, ससुराल से उपहार, उत्तम स्वास्थ्य।',
    detailedEn: 'Venus in 8th brings sudden inheritance, expensive jewelry gifts, peaceful marital harmony, and secret financial profits.',
    detailedHi: 'अष्टम भाव में शुक्र का गोचर अचानक विपुल धन, ससुराल पक्ष से आभूषण लाभ, गुप्त सुख तथा दीर्घायु प्रदान करता है।'
  },
  {
    planet: 'Venus', planetHi: 'शुक्र', houseFromMoon: 9, isFavorable: true, vedhaHouse: 11,
    summaryEn: 'Dharma, prosperity, gifts, fortunate travels, blessings of Lakshmi, charity.',
    summaryHi: 'धर्म लाभ, समृद्धि, बहुमूल्य उपहार, सुखद विदेश यात्राएं, महालक्ष्मी कृपा, दान-पुण्य।',
    detailedEn: 'Venus in 9th brings blessings of preceptors, international luxury tours, fortune through spouse, and charitable renown.',
    detailedHi: 'नवम भाव में शुक्र का गोचर अखंड भाग्योदय, तीर्थ यात्राएं, जीवनसाथी द्वारा सौभाग्य तथा धार्मिक उत्सवों में अग्रणी बनाता है।'
  },
  {
    planet: 'Venus', planetHi: 'शुक्र', houseFromMoon: 10, isFavorable: false,
    summaryEn: 'Disgrace, professional scandals, humiliation, conflicts in luxury enterprise.',
    summaryHi: 'अपयश का भय, कार्यक्षेत्र में बदनामी, अपमान, विलासिता व्यापार में हानि।',
    detailedEn: 'Venus in 10th causes scandals regarding opposite gender, friction with employers, and defamation in public life.',
    detailedHi: 'दशम भाव में शुक्र का गोचर कार्यक्षेत्र में अपवाद, अधिकारियों से अनबन तथा सामाजिक प्रतिष्ठा पर आंच का भय कराता है।'
  },
  {
    planet: 'Venus', planetHi: 'शुक्र', houseFromMoon: 11, isFavorable: true, vedhaHouse: 3,
    summaryEn: 'Immense wealth, social fame, friendship, luxury vehicles, romantic fulfillment.',
    summaryHi: 'अथाह धन संपदा, सामाजिक ख्याति, प्रभावशाली मित्र, उत्तम वाहन, प्रेम की पूर्णता।',
    detailedEn: 'Venus in 11th is supreme Labha transit: Showering multi-stream cash, fulfilled aspirations, and affluent alliances.',
    detailedHi: 'एकादश भाव में शुक्र का गोचर विपुल धनवर्षा, सभी मनोरथों की सिद्धि, उत्तम वाहन तथा समाज में वैभवशाली स्थान देता है।'
  },
  {
    planet: 'Venus', planetHi: 'शुक्र', houseFromMoon: 12, isFavorable: true, vedhaHouse: 6,
    summaryEn: 'Sensory enjoyment, bed pleasures, foreign luxury, lavish living, happy expenditures.',
    summaryHi: 'शयन सुख, उत्तम विलासिता, विदेश में ऐश्वर्यशाली वास, मांगलिक कार्यों में व्यय।',
    detailedEn: 'Venus in 12th is classically unique as favorable: Brings peaceful sleep, luxury travels, generous charity, and foreign prosperity.',
    detailedHi: 'द्वादश भाव में शुक्र का गोचर शुभ फलप्रद है: अद्वितीय शयन सुख, विदेश में वैभवशाली जीवन, परोपकार तथा मानसिक शांति।'
  },

  // RAHU (राहु) & KETU (केतु)
  {
    planet: 'Rahu', planetHi: 'राहु', houseFromMoon: 3, isFavorable: true, vedhaHouse: 12,
    summaryEn: 'Sudden daring courage, crushing of enemies, high-tech and media gains, financial leaps.',
    summaryHi: 'अचानक अदम्य साहस, शत्रुओं का समूल नाश, उच्च तकनीक व मीडिया से धन लाभ, विजय।',
    detailedEn: 'Rahu in 3rd destroys all adversaries, brings explosive popularity in media/tech, foreign contracts, and fearless enterprise.',
    detailedHi: 'तृतीय भाव में राहु का गोचर अत्यंत शुभ है: विरोधियों का विनाश, डिजिटल मीडिया व तकनीक में ख्याति तथा विपुल धन लाभ।'
  },
  {
    planet: 'Rahu', planetHi: 'राहु', houseFromMoon: 6, isFavorable: true, vedhaHouse: 9,
    summaryEn: 'Total destruction of adversaries, legal triumph, robust health, debt liquidation.',
    summaryHi: 'विरोधियों का पूर्ण संहार, मुकदमों में ऐतिहासिक विजय, उत्तम आरोग्य, ऋणों से मुक्ति।',
    detailedEn: 'Rahu in 6th is supreme Shatruhanta: Vanquishes court cases, crushes workplace conspiracies, and cures complex diseases.',
    detailedHi: 'षष्ठ भाव में राहु का गोचर समस्त षड्यंत्रों को नष्ट करता है: असाध्य रोगों से मुक्ति, मुकदमों में जीत तथा निर्बाध प्रगति।'
  },
  {
    planet: 'Rahu', planetHi: 'राहु', houseFromMoon: 11, isFavorable: true, vedhaHouse: 5,
    summaryEn: 'Windfall foreign wealth, massive profits, fulfilled ambitions beyond expectation.',
    summaryHi: 'विदेशी स्रोतों से अकूत धन, व्यापार में भारी मुनाफा, सभी महत्वाकांक्षाओं की पूर्ण सिद्धि।',
    detailedEn: 'Rahu in 11th brings multi-millionaire windfalls, international network support, unexpected technological breakthroughs, and fame.',
    detailedHi: 'एकादश भाव में राहु का गोचर अप्रत्याशित भारी धनवर्षा, अंतरराष्ट्रीय संपर्कों से लाभ तथा सभी लक्ष्यों की सिद्धि कराता है।'
  },
  {
    planet: 'Ketu', planetHi: 'केतु', houseFromMoon: 3, isFavorable: true, vedhaHouse: 12,
    summaryEn: 'Spiritual valor, occult breakthroughs, defeat of foes, technical coding mastery.',
    summaryHi: 'आध्यात्मिक पराक्रम, गूढ़ विद्याओं में सफलता, शत्रुओं की पराजय, तकनीकी दक्षता।',
    detailedEn: 'Ketu in 3rd bestows quiet determination, courage in difficult trials, research publication, and victory over opposition.',
    detailedHi: 'तृतीय भाव में केतु का गोचर आध्यात्मिक शक्ति, विरोधियों पर विजय, शोध व कोडिंग में सफलता तथा मनोबल देता है।'
  },
  {
    planet: 'Ketu', planetHi: 'केतु', houseFromMoon: 6, isFavorable: true, vedhaHouse: 9,
    summaryEn: 'Destruction of rivals, healing power, debt relief, immunity from secret plots.',
    summaryHi: 'शत्रुओं का दमन, प्राकृतिक उपचार शक्ति, ऋणों से मुक्ति, गुप्त षड्यंत्रों से पूर्ण सुरक्षा।',
    detailedEn: 'Ketu in 6th cures diseases, vanquishes hidden foes through spiritual resilience, and clears long-standing liabilities.',
    detailedHi: 'षष्ठ भाव में केतु का गोचर असाध्य रोगों का शमन, गुप्त विरोधियों की पराजय तथा पुराने ऋणों से मुक्ति प्रदान करता है।'
  },
  {
    planet: 'Ketu', planetHi: 'केतु', houseFromMoon: 11, isFavorable: true, vedhaHouse: 5,
    summaryEn: 'Unexpected spiritual and financial windfalls, quiet contentment, fulfilled needs.',
    summaryHi: 'आकस्मिक धन लाभ, मानसिक संतोष, आवश्यक इच्छाओं की सहज पूर्ति, सात्विक लाभ।',
    detailedEn: 'Ketu in 11th brings sudden unearned wealth, blessings of holy saints, spiritual associations, and quiet prosperity.',
    detailedHi: 'एकादश भाव में केतु का गोचर गुप्त धन लाभ, संतों का आशीर्वाद, आध्यात्मिक उन्नति तथा शांत व सुखी जीवन देता है।'
  }
];

// Append remaining Gochara entries
const content = fs.readFileSync(filePath, 'utf-8');
const updatedContent = content.replace(
  '];\n\nconsole.log(\'Gochara corpus partially built:\', GOCHARA_CORPUS.length);',
  ',\n' + JSON.stringify(remainingGochara, null, 2).slice(2, -2) + '\n];\n\nconsole.log(\'Gochara corpus fully built:\', GOCHARA_CORPUS.length);'
);

fs.writeFileSync(filePath, updatedContent, 'utf-8');
console.log('Appended remaining Gochara successfully.');
