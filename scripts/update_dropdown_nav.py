# scripts/update_dropdown_nav.py
import re

with open('src/components/layout/DropdownNavHeader.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update imports
content = content.replace(
    "import { LANGUAGE_LABELS, type AppLanguage } from '../../i18n/translations';",
    "import { LANGUAGE_LABELS, type AppLanguage, trNav, NAV_ITEMS_I18N } from '../../i18n/translations';"
)

# 2. Update isHi definition and add trD helper
old_decl = """  const { lang, setLang } = useLanguage();
  const isHi = lang !== 'en';"""

new_decl = """  const { lang, setLang } = useLanguage();
  const isHi = lang === 'hi';

  const trD = (key: string, hiText: string, enText: string): string => {
    if (lang === 'en') return enText;
    if (lang === 'hi') return hiText;
    const mapped = trNav(key, lang);
    if (mapped && mapped !== key) return mapped;
    return enText;
  };"""

content = content.replace(old_decl, new_decl)

# 3. Update Row 1 brand & buttons
content = content.replace(
    "title={isHi ? 'मुख्य पृष्ठ पर जाएं' : 'Go to Home'}",
    "title={trNav('home', lang)}"
)
content = content.replace(
    "{isHi ? 'वैदिक ज्योतिष, पंचांग एवं संपूर्ण फलादेश' : 'Vedic Astrology, Panchang & Free Predictions'}",
    "{trNav('brandTag', lang)}"
)
content = content.replace(
    "title={isHi ? 'जन्म विवरण संशोधित करें' : 'Edit Native Details'}",
    "title={trNav('edit', lang)}"
)
content = content.replace(
    "<span className=\"hide-on-mobile\">{isHi ? 'संशोधन' : 'Edit'}</span>",
    "<span className=\"hide-on-mobile\">{trNav('edit', lang)}</span>"
)
content = content.replace(
    "title={isHi ? 'नई कुंडली' : 'New Horoscope'}",
    "title={trNav('new', lang)}"
)
content = content.replace(
    "<span className=\"hide-on-mobile\">{isHi ? 'नई' : 'New'}</span>",
    "<span className=\"hide-on-mobile\">{trNav('new', lang)}</span>"
)
content = content.replace(
    "title={isHi ? 'जन्म पत्रिका PDF (100% निःशुल्क)' : 'Birth Report PDF (100% Free)'}",
    "title={trNav('birthReport', lang)}"
)
content = content.replace(
    "<span className=\"hide-on-mobile\">{isHi ? 'जन्म पत्रिका' : 'Birth Report'}</span>",
    "<span className=\"hide-on-mobile\">{trNav('birthReport', lang)}</span>"
)
content = content.replace(
    "title={isHi ? 'त्वरित सर्च / खोजें (Ctrl + K)' : 'Quick Search Palette (Ctrl + K)'}",
    "title={trNav('search', lang)}"
)
content = content.replace(
    "<span className=\"hide-on-mobile\">{isHi ? 'सर्च' : 'Search'}</span>",
    "<span className=\"hide-on-mobile\">{trNav('search', lang)}</span>"
)
content = content.replace(
    "title={isHi ? 'गणना सेटिंग्स' : 'Settings'}",
    "title={trNav('settings', lang)}"
)

# 4. Update Navbar Row main buttons
content = content.replace("<span>{isHi ? 'होम' : 'Home'}</span>", "<span>{trNav('home', lang)}</span>")
content = content.replace("<span>{isHi ? 'जन्म कुंडली' : 'Janam Kundli'}</span>", "<span>{trNav('janamKundli', lang)}</span>")
content = content.replace("<span>{isHi ? 'ज्योतिषीय गणना' : 'Calculations'}</span>", "<span>{trNav('calculations', lang)}</span>")
content = content.replace("<span>{isHi ? 'फलादेश' : 'Prediction'}</span>", "<span>{trNav('predictions', lang)}</span>")
content = content.replace("<span>{isHi ? 'कुण्डली मिलान व विवाह' : 'Kundali Milan & Marriage'}</span>", "<span>{trNav('matching', lang)}</span>")
content = content.replace("<span>{isHi ? 'गोचर व साढ़े साती' : 'Gochar & Sade Sati'}</span>", "<span>{trNav('transits', lang)}</span>")
content = content.replace("<span>{isHi ? 'विशिष्ट ज्योतिष' : 'Advanced Astrology'}</span>", "<span>{trNav('advanced', lang)}</span>")
content = content.replace("<span>{isHi ? 'टूल्स व मुहूर्त' : 'Tools & Muhurta'}</span>", "<span>{trNav('tools', lang)}</span>")
content = content.replace("<span>{isHi ? 'उपचार व रत्न' : 'Remedies & Gems'}</span>", "<span>{trNav('remedies', lang)}</span>")
content = content.replace("<span>{isHi ? 'पर्व एवं व्रत' : 'Puja & Festivals'}</span>", "<span>{trNav('festivals', lang)}</span>")
content = content.replace("<span>{isHi ? 'जन्म पत्रिका (निःशुल्क)' : 'Birth Report (Free)'}</span>", "<span>{trNav('birthReport', lang)}</span>")

# 5. Update dropdown items
pred_replacements = [
    ("<strong>{isHi ? 'सामान्य फलादेश' : 'General Prediction'}</strong>", "<strong>{trD('pred_general', 'सामान्य फलादेश', 'General Prediction')}</strong>"),
    ("<span className=\"oj-dd-sub\">{isHi ? 'जीवन स्तर, स्वर्ण कालखंड, संकट काल व 6 जीवन क्षेत्र' : 'Life Stature, Peak Era & 6 Life Domains'}</span>", "<span className=\"oj-dd-sub\">{trD('pred_general_sub', 'जीवन स्तर, स्वर्ण कालखंड, संकट काल व 6 जीवन क्षेत्र', 'Life Stature, Peak Era & 6 Life Domains')}</span>"),
    ("<strong>{isHi ? 'भाववार फलादेश' : 'House-wise Prediction'}</strong>", "<strong>{trD('pred_house', 'भाववार फलादेश', 'House-wise Prediction')}</strong>"),
    ("<span className=\"oj-dd-sub\">{isHi ? '1 से 12 भावों के प्रश्न-उत्तर, घटना समय व भावेष फल' : '1st to 12th House Specific Events & Timing'}</span>", "<span className=\"oj-dd-sub\">{trD('pred_house_sub', '1 से 12 भावों के प्रश्न-उत्तर, घटना समय व भावेष फल', '1st to 12th House Specific Events & Timing')}</span>"),
    ("<strong>{isHi ? 'दशा फलादेश' : 'Dasha Prediction'}</strong>", "<strong>{trD('pred_dasha', 'दशा फलादेश', 'Dasha Prediction')}</strong>"),
    ("<span className=\"oj-dd-sub\">{isHi ? 'सक्रिय विंशोत्तरी महादशा-अंतर्दशा व 3 ठोस जीवन घटनाएं' : 'Running Mahadasha/Antardasha Manifestation'}</span>", "<span className=\"oj-dd-sub\">{trD('pred_dasha_sub', 'सक्रिय विंशोत्तरी महादशा-अंतर्दशा व 3 ठोस जीवन घटनाएं', 'Running Mahadasha/Antardasha Manifestation')}</span>"),
    ("<strong>{isHi ? 'गोचर फलादेश' : 'Transit Prediction'}</strong>", "<strong>{trD('pred_transit', 'गोचर फलादेश', 'Transit Prediction')}</strong>"),
    ("<span className=\"oj-dd-sub\">{isHi ? '12-24 माह का गोचर रोडमैप, गुरु-शनि दोहरा गोचर फल' : '12-24 Month Transit Roadmap & Double Transit'}</span>", "<span className=\"oj-dd-sub\">{trD('pred_transit_sub', '12-24 माह का गोचर रोडमैप, गुरु-शनि दोहरा गोचर फल', '12-24 Month Transit Roadmap & Double Transit')}</span>"),
    ("<strong>{isHi ? 'शिक्षा व उच्च विद्या फलादेश' : 'Education & Higher Studies'}</strong>", "<strong>{trD('pred_edu', 'शिक्षा व उच्च विद्या फलादेश', 'Education & Higher Studies')}</strong>"),
    ("<span className=\"oj-dd-sub\">{isHi ? '१० भंग नियम, सर्वभौम व सरस्वती योग, शोध Ph.D. व संकाय' : '10 Break Rules, Sarvabhouma, Ph.D. Research & College Streams'}</span>", "<span className=\"oj-dd-sub\">{trD('pred_edu_sub', '१० भंग नियम, सर्वभौम व सरस्वती योग, शोध Ph.D. व संकाय', '10 Break Rules, Sarvabhouma, Ph.D. Research & College Streams')}</span>"),
    ("<strong>{isHi ? 'लग्नवार फलादेश' : 'Ascendant-wise Prediction'}</strong>", "<strong>{trD('pred_asc', 'लग्नवार फलादेश', 'Ascendant-wise Prediction')}</strong>"),
    ("<span className=\"oj-dd-sub\">{isHi ? '१२ लग्न: स्वरूप, कारक-मारक, धन, दांपत्य, करियर व भाग्योदय वर्ष' : '12 Ascendants: Temperament, Benefics, Marakas, Marriage & Milestones'}</span>", "<span className=\"oj-dd-sub\">{trD('pred_asc_sub', '१२ लग्न: स्वरूप, कारक-मारक, धन, दांपत्य, करियर व भाग्योदय वर्ष', '12 Ascendants: Temperament, Benefics, Marakas, Marriage & Milestones')}</span>"),
    ("<strong>{isHi ? 'नक्षत्रवार फलादेश' : 'Nakshatra-wise Prediction'}</strong>", "<strong>{trD('pred_nakshatra', 'नक्षत्रवार फलादेश', 'Nakshatra-wise Prediction')}</strong>"),
    ("<span className=\"oj-dd-sub\">{isHi ? '27 नक्षत्र, 4 चरण, तारा चक्र व अनुकूल कार्यक्षेत्र' : '27 Nakshatras, 4 Padas, Tara & Career Nuance'}</span>", "<span className=\"oj-dd-sub\">{trD('pred_nakshatra_sub', '27 नक्षत्र, 4 चरण, तारा चक्र व अनुकूल कार्यक्षेत्र', '27 Nakshatras, 4 Padas, Tara & Career Nuance')}</span>"),
    ("<strong>{isHi ? 'राशिवार फलादेश' : 'Sign-wise Prediction'}</strong>", "<strong>{trD('pred_sign', 'राशिवार फलादेश', 'Sign-wise Prediction')}</strong>"),
    ("<span className=\"oj-dd-sub\">{isHi ? '12 राशियों में ग्रहों की शास्त्रीय स्थिति व स्वभाव' : 'Planets in 12 Signs Classical Findings'}</span>", "<span className=\"oj-dd-sub\">{trD('pred_sign_sub', '12 राशियों में ग्रहों की शास्त्रीय स्थिति व स्वभाव', 'Planets in 12 Signs Classical Findings')}</span>"),
    ("<strong>{isHi ? 'युति फलादेश' : 'Yuti (Conjunction) Prediction'}</strong>", "<strong>{trD('pred_yuti', 'युति फलादेश', 'Yuti (Conjunction) Prediction')}</strong>"),
    ("<span className=\"oj-dd-sub\">{isHi ? 'कुंडली के ग्रह युति योग, युति अंश व अनुकूल-प्रतिकूल फल' : 'Planetary Conjunctions, Degrees & Exact Effects'}</span>", "<span className=\"oj-dd-sub\">{trD('pred_yuti_sub', 'कुंडली के ग्रह युति योग, युति अंश व अनुकूल-प्रतिकूल फल', 'Planetary Conjunctions, Degrees & Exact Effects')}</span>"),
    ("<strong>{isHi ? 'दृष्टि फलादेश' : 'Drishti (Aspect) Prediction'}</strong>", "<strong>{trD('pred_drishti', 'दृष्टि फलादेश', 'Drishti (Aspect) Prediction')}</strong>"),
    ("<span className=\"oj-dd-sub\">{isHi ? 'समसप्तक व विशेष दृष्टियां, दृष्टि वीरुपा व घटना प्रभाव' : 'Full & Special Aspects, Virupas & Event Impacts'}</span>", "<span className=\"oj-dd-sub\">{trD('pred_drishti_sub', 'समसप्तक व विशेष दृष्टियां, दृष्टि वीरुपा व घटना प्रभाव', 'Full & Special Aspects, Virupas & Event Impacts')}</span>"),
    ("<strong>{isHi ? 'योगवार फलादेश' : 'Yoga-wise Prediction'}</strong>", "<strong>{trD('pred_yoga', 'योगवार फलादेश', 'Yoga-wise Prediction')}</strong>"),
    ("<span className=\"oj-dd-sub\">{isHi ? 'पंचमहापुरुष, राजयोग, धनयोग, विपरीत व अरिष्ट योग' : 'Raja, Dhana, Mahapurusha & Classical Yogas'}</span>", "<span className=\"oj-dd-sub\">{trD('pred_yoga_sub', 'पंचमहापुरुष, राजयोग, धनयोग, विपरीत व अरिष्ट योग', 'Raja, Dhana, Mahapurusha & Classical Yogas')}</span>"),
    ("<strong>{isHi ? 'दैनिक व साप्ताहिक राशिफल (वैदिक गोचर व लाइव फीड्स)' : 'Daily & Weekly Rashifal (Vedic Gochar & Live Feeds)'}</strong>", "<strong>{trD('pred_rashifal', 'दैनिक व साप्ताहिक राशिफल (वैदिक गोचर व लाइव फीड्स)', 'Daily & Weekly Rashifal (Vedic Gochar & Live Feeds)')}</strong>"),
    ("<span className=\"oj-dd-sub\">{isHi ? '५ प्रमुख जीवन क्षेत्र, १२ राशियां व लाइव गोचर वेब फीड्स' : '5 Life Domains, 12 Signs & Live Gochar Feeds'}</span>", "<span className=\"oj-dd-sub\">{trD('pred_rashifal_sub', '५ प्रमुख जीवन क्षेत्र, १२ राशियां व लाइव गोचर वेब फीड्स', '5 Life Domains, 12 Signs & Live Gochar Feeds')}</span>"),
]

for old, new in pred_replacements:
    content = content.replace(old, new)

match_replacements = [
    ("<strong>{isHi ? 'अष्टकूट ३६ गुण मिलान' : 'Ashtakoota 36 Gunas'}</strong>", "<strong>{trD('match_ashtakoota', 'अष्टकूट ३६ गुण मिलान', 'Ashtakoota 36 Gunas')}</strong>"),
    ("<span className=\"oj-dd-sub\">{isHi ? 'वर्ण, वश्य, तारा, योनि, ग्रहमैत्री, गण, भकूट, नाड़ी' : 'Complete 36-Point Vedic Guna Milan'}</span>", "<span className=\"oj-dd-sub\">{trD('match_ashtakoota_sub', 'वर्ण, वश्य, तारा, योनि, ग्रहमैत्री, गण, भकूट, नाड़ी', 'Complete 36-Point Vedic Guna Milan')}</span>"),
    ("<strong>{isHi ? 'दक्षिण भारतीय दशकूट (१० कूट)' : 'Dashakoota (10 Poruthams)'}</strong>", "<strong>{trD('match_dashakoota', 'दक्षिण भारतीय दशकूट (१० कूट)', 'Dashakoota (10 Poruthams)')}</strong>"),
    ("<span className=\"oj-dd-sub\">{isHi ? 'दीना, गणा, माहेन्द्रा, रज्जु व वेध सुरक्षा कूट' : 'Dina, Gana, Mahendra, Rajju & Vedha Shield'}</span>", "<span className=\"oj-dd-sub\">{trD('match_dashakoota_sub', 'दीना, गणा, माहेन्द्रा, रज्जु व वेध सुरक्षा कूट', 'Dina, Gana, Mahendra, Rajju & Vedha Shield')}</span>"),
    ("<strong>{isHi ? 'दोष विश्लेषण एवं १६ मांगलिक परिहार' : '16 Manglik Bhanga & Pariharas'}</strong>", "<strong>{trD('match_dosha', 'दोष विश्लेषण एवं १६ मांगलिक परिहार', '16 Manglik Bhanga & Pariharas')}</strong>"),
    ("<span className=\"oj-dd-sub\">{isHi ? '१६ मांगलिक नियम, भकूट परिहार व नाड़ी दोष निवारण' : 'Classical Exceptions, Bhakoot & Nadi Pariharas'}</span>", "<span className=\"oj-dd-sub\">{trD('match_dosha_sub', '१६ मांगलिक नियम, भकूट परिहार व नाड़ी दोष निवारण', 'Classical Exceptions, Bhakoot & Nadi Pariharas')}</span>"),
    ("<strong>{isHi ? 'त्रिबल शुद्धि, लाल पूजा व पीली पूजा' : 'Tribala Shuddhi & Puja Protocols'}</strong>", "<strong>{trD('match_tribala', 'त्रिबल शुद्धि, लाल पूजा व पीली पूजा', 'Tribala Shuddhi & Puja Protocols')}</strong>"),
    ("<span className=\"oj-dd-sub\">{isHi ? 'वर सूर्य बल, कन्या गुरु बल, चंद्र बल व संपूर्ण पूजा विधान' : 'Groom Sun, Bride Jupiter, Moon & Remedial Pujas'}</span>", "<span className=\"oj-dd-sub\">{trD('match_tribala_sub', 'वर सूर्य बल, कन्या गुरु बल, चंद्र बल व संपूर्ण पूजा विधान', 'Groom Sun, Bride Jupiter, Moon & Remedial Pujas')}</span>"),
    ("<strong>{isHi ? 'शास्त्रसम्मत विवाह, सगाई व तिलक मुहूर्त' : 'Authentic Vivah, Sagai & Tilak Muhurta'}</strong>", "<strong>{trD('match_muhurta', 'शास्त्रसम्मत विवाह, सगाई व तिलक मुहूर्त', 'Authentic Vivah, Sagai & Tilak Muhurta')}</strong>"),
    ("<span className=\"oj-dd-sub\">{isHi ? 'खरमास-चातुर्मास मुक्त, गोचर व दशा समर्थित शुद्ध मुहूर्त' : 'Pure ephemeris calendar free from prohibited windows'}</span>", "<span className=\"oj-dd-sub\">{trD('match_muhurta_sub', 'खरमास-चातुर्मास मुक्त, गोचर व दशा समर्थित शुद्ध मुहूर्त', 'Pure ephemeris calendar free from prohibited windows')}</span>"),
    ("<strong>{isHi ? 'द्वादश भाव, D9 नवांश व संतान स्फुट' : 'Synastry, D9 Navamsha & Progeny'}</strong>", "<strong>{trD('match_synastry', 'द्वादश भाव, D9 नवांश व संतान स्फुट', 'Synastry, D9 Navamsha & Progeny')}</strong>"),
    ("<span className=\"oj-dd-sub\">{isHi ? 'बीज स्फुट, क्षेत्र स्फुट व पारस्परिक भाव सादृश्य' : 'Beeja & Kshetra Sphuta, Navamsha Overlay'}</span>", "<span className=\"oj-dd-sub\">{trD('match_synastry_sub', 'बीज स्फुट, क्षेत्र स्फुट व पारस्परिक भाव सादृश्य', 'Beeja & Kshetra Sphuta, Navamsha Overlay')}</span>"),
    ("<strong>{isHi ? 'दांपत्य, अंकज्योतिष व आयुर्दाय कैलकुलेटर (15 Tools)' : 'Relationship, Numerology & Longevity Calculators (15 Tools)'}</strong>", "<strong>{trD('match_calculators', 'दांपत्य, अंकज्योतिष व आयुर्दाय कैलकुलेटर (15 Tools)', 'Relationship, Numerology & Longevity Calculators (15 Tools)')}</strong>"),
    ("<span className=\"oj-dd-sub\">{isHi ? 'प्रेम vs पारंपरिक, समय, नामाक्षर, अंक अनुकूलता, आयुर्दाय वर्ग' : 'Love vs Arranged, Timing, Partner Initial, Numerology & Ayurdaya'}</span>", "<span className=\"oj-dd-sub\">{trD('match_calculators_sub', 'प्रेम vs पारंपरिक, समय, नामाक्षर, अंक अनुकूलता, आयुर्दाय वर्ग', 'Love vs Arranged, Timing, Partner Initial, Numerology & Ayurdaya')}</span>"),
]

for old, new in match_replacements:
    content = content.replace(old, new)

trans_replacements = [
    ("<strong>{isHi ? 'द्वि-चक्र गोचर सिम्युलेटर (Double Wheel)' : 'Live Double Transit Wheel'}</strong>", "<strong>{trD('trans_dual', 'द्वि-चक्र गोचर सिम्युलेटर (Double Wheel)', 'Live Double Transit Wheel')}</strong>"),
    ("<span className=\"oj-dd-sub\">{isHi ? 'जन्म कुंडली + लाइव गोचर दृष्टि किरणें' : 'Natal + Transit Aspect Rays'}</span>", "<span className=\"oj-dd-sub\">{trD('trans_dual_sub', 'जन्म कुंडली + लाइव गोचर दृष्टि किरणें', 'Natal + Transit Aspect Rays')}</span>"),
    ("<strong>{isHi ? 'शनि साढ़े साती एवं ढैया टाइमलाइन' : 'Sade Sati & Dhaiya Timeline'}</strong>", "<strong>{trD('trans_sade', 'शनि साढ़े साती एवं ढैया टाइमलाइन', 'Sade Sati & Dhaiya Timeline')}</strong>"),
    ("<span className=\"oj-dd-sub\">{isHi ? '3 चरण, कंटक, अष्टम शनि व मूर्ति निर्णय' : '3 Charans & Moorti Nirnaya'}</span>", "<span className=\"oj-dd-sub\">{trD('trans_sade_sub', '3 चरण, कंटक, अष्टम शनि व मूर्ति निर्णय', '3 Charans & Moorti Nirnaya')}</span>"),
    ("<strong>{isHi ? '365-दिवसीय व्यक्तिगत गोचर कैलेंडर' : 'Personal 365-Day Transit Calendar'}</strong>", "<strong>{trD('trans_cal', '365-दिवसीय व्यक्तिगत गोचर कैलेंडर', 'Personal 365-Day Transit Calendar')}</strong>"),
    ("<span className=\"oj-dd-sub\">{isHi ? 'दैनिक शुभता स्कोर (0-100), तारा बल व हीटमैप' : 'Daily 0-100 Score & Monthly Heatmap'}</span>", "<span className=\"oj-dd-sub\">{trD('trans_cal_sub', 'दैनिक शुभता स्कोर (0-100), तारा बल व हीटमैप', 'Daily 0-100 Score & Monthly Heatmap')}</span>"),
]

for old, new in trans_replacements:
    content = content.replace(old, new)

with open('src/components/layout/DropdownNavHeader.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated DropdownNavHeader.tsx")
