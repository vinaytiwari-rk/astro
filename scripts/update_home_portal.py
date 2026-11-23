# scripts/update_home_portal.py
import re

with open('src/components/OnlineJyotishHomePortal.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update imports
content = content.replace(
    "import { trPlanet, trSign } from '../i18n/translations';",
    "import { trPlanet, trSign, trPortal, trTerm, trNav } from '../i18n/translations';"
)

# 2. Add trP helper
old_decl = """  const { lang, setLang } = useLanguage();
  const isHi = lang === 'hi';"""

new_decl = """  const { lang, setLang } = useLanguage();
  const isHi = lang === 'hi';

  const trP = (key: string, hiText: string, enText: string): string => {
    if (lang === 'en') return enText;
    if (lang === 'hi') return hiText;
    const mapped = trPortal(key, lang);
    if (mapped && mapped !== key) return mapped;
    return enText;
  };"""

content = content.replace(old_decl, new_decl)

# 3. Update Hero heading and subtitle
content = content.replace(
    "{isHi ? 'दैनिक जीवन के प्रश्नों हेतु प्रामाणिक वैदिक ज्योतिष' : 'Vedic astrology for your everyday questions'}",
    "{trP('heroHeading', 'दैनिक जीवन के प्रश्नों हेतु प्रामाणिक वैदिक ज्योतिष', 'Vedic astrology for your everyday questions')}"
)

# 4. Update Hero action buttons
content = content.replace(
    "<span>{isHi ? 'निःशुल्क कुंडली बनाएं' : 'Create free Kundli'}</span>",
    "<span>{trP('createKundli', 'निःशुल्क कुंडली बनाएं', 'Create free Kundli')}</span>"
)
content = content.replace(
    "<span>{isHi ? 'पंचांग देखें' : 'View Panchang'}</span>",
    "<span>{trP('viewPanchang', 'पंचांग देखें', 'View Panchang')}</span>"
)
content = content.replace(
    "<span>{isHi ? 'कुंडली मिलान' : 'Check matching'}</span>",
    "<span>{trP('checkMatching', 'कुंडली मिलान', 'Check matching')}</span>"
)
content = content.replace(
    "<span>{isHi ? 'सामान्य फलादेश' : 'General Prediction'}</span>",
    "<span>{trP('generalPrediction', 'सामान्य फलादेश', 'General Prediction')}</span>"
)

# 5. Quick Form Labels
content = content.replace(
    "{isHi ? 'त्वरित जन्म विवरण प्रविष्टि (Quick Birth Entry)' : 'Quick Birth Details & Instant Horoscope'}",
    "{trP('quickEntryTitle', 'त्वरित जन्म विवरण प्रविष्टि (Quick Birth Entry)', 'Quick Birth Details & Instant Horoscope')}"
)
content = content.replace(
    "{isHi\n                    ? 'जातक का नाम, जन्म दिनांक, समय व स्थान दर्ज करें। तुरंत संपूर्ण कुंडली गणना व फलादेश प्राप्त करें।'\n                    : 'Enter birth date, exact time, and location to generate comprehensive Vedic calculations.'}",
    "{trP('quickEntrySub', 'जातक का नाम, जन्म दिनांक, समय व स्थान दर्ज करें। तुरंत संपूर्ण कुंडली गणना व फलादेश प्राप्त करें।', 'Enter birth date, exact time, and location to generate comprehensive Vedic calculations.')}"
)
content = content.replace(
    "<label className=\"oj-label\">{isHi ? 'जातक का नाम:' : 'Full Name:'}</label>",
    "<label className=\"oj-label\">{trP('name', 'जातक का नाम:', 'Full Name:')}</label>"
)
content = content.replace(
    "<label className=\"oj-label\">{isHi ? 'लिंग (Gender):' : 'Gender:'}</label>",
    "<label className=\"oj-label\">{trP('gender', 'लिंग (Gender):', 'Gender:')}</label>"
)
content = content.replace(
    "<option value=\"male\">{isHi ? 'पुरुष (Male)' : 'Male'}</option>",
    "<option value=\"male\">{trP('male', 'पुरुष (Male)', 'Male')}</option>"
)
content = content.replace(
    "<option value=\"female\">{isHi ? 'महिला (Female)' : 'Female'}</option>",
    "<option value=\"female\">{trP('female', 'महिला (Female)', 'Female')}</option>"
)
content = content.replace(
    "<label className=\"oj-label\">{isHi ? 'जन्म दिनांक (DD-MM-YYYY):' : 'Date of Birth (DD-MM-YYYY):'}</label>",
    "<label className=\"oj-label\">{trP('dob', 'जन्म दिनांक (DD-MM-YYYY):', 'Date of Birth (DD-MM-YYYY):')}</label>"
)
content = content.replace(
    "<label className=\"oj-label\">{isHi ? 'जन्म समय (HH:MM:SS):' : 'Time of Birth (HH:MM:SS):'}</label>",
    "<label className=\"oj-label\">{trP('tob', 'जन्म समय (HH:MM:SS):', 'Time of Birth (HH:MM:SS):')}</label>"
)
content = content.replace(
    "<label className=\"oj-label\">{isHi ? 'जन्म स्थान / शहर:' : 'Birth Place / City:'}</label>",
    "<label className=\"oj-label\">{trP('city', 'जन्म स्थान / शहर:', 'Birth Place / City:')}</label>"
)
content = content.replace(
    "<span>{isHi ? 'जन्म कुंडली बनाएं (Open Kundli) →' : 'Generate Janam Kundli →'}</span>",
    "<span>{trP('generateKundli', 'जन्म कुंडली बनाएं (Open Kundli) →', 'Generate Janam Kundli →')}</span>"
)

# 6. Live Panchang Strip
content = content.replace(
    "<strong>{isHi ? 'आज का स्थानीय पंचांग एवं ग्रह गोचर' : \"Today's Live Panchang & Planetary Transits\"}</strong>",
    "<strong>{trP('todayPanchang', 'आज का स्थानीय पंचांग एवं ग्रह गोचर', \"Today's Live Panchang & Planetary Transits\")}</strong>"
)
content = content.replace(
    "<span className=\"oj-label\">{isHi ? 'तिथि:' : 'Tithi:'}</span>\n                <span className=\"oj-val\">\n                  {livePanchangChart.panchang.tithi.name} ({livePanchangChart.panchang.tithi.paksha})\n                </span>",
    "<span className=\"oj-label\">{trP('tithi', 'तिथि:', 'Tithi:')}</span>\n                <span className=\"oj-val\">\n                  {trTerm(livePanchangChart.panchang.tithi.name, lang)} ({trTerm(livePanchangChart.panchang.tithi.paksha, lang)})\n                </span>"
)
content = content.replace(
    "<span className=\"oj-label\">{isHi ? 'नक्षत्र:' : 'Nakshatra:'}</span>\n                <span className=\"oj-val\">\n                  {livePanchangChart.panchang.nakshatra.name} (P{livePanchangChart.panchang.nakshatra.pada})\n                </span>",
    "<span className=\"oj-label\">{trP('nakshatra', 'नक्षत्र:', 'Nakshatra:')}</span>\n                <span className=\"oj-val\">\n                  {trTerm(livePanchangChart.panchang.nakshatra.name, lang)} (P{livePanchangChart.panchang.nakshatra.pada})\n                </span>"
)
content = content.replace(
    "<span className=\"oj-label\">{isHi ? 'योग / करण:' : 'Yoga / Karana:'}</span>\n                <span className=\"oj-val\">\n                  {livePanchangChart.panchang.yoga.name} · {livePanchangChart.panchang.karana.name}\n                </span>",
    "<span className=\"oj-label\">{trP('yoga', 'योग / करण:', 'Yoga / Karana:')}</span>\n                <span className=\"oj-val\">\n                  {trTerm(livePanchangChart.panchang.yoga.name, lang)} · {trTerm(livePanchangChart.panchang.karana.name, lang)}\n                </span>"
)
content = content.replace(
    "<span className=\"oj-label\">{isHi ? 'राहु काल:' : 'Rahu Kalam:'}</span>",
    "<span className=\"oj-label\">{trP('rahuKalam', 'राहु काल:', 'Rahu Kalam:')}</span>"
)

# 7. Service Cards 1 to 7
content = content.replace(
    "<span className=\"oj-card-tag\">{isHi ? 'सर्वाधिक लोकप्रिय' : 'Most Popular'}</span>",
    "<span className=\"oj-card-tag\">{trP('mostPopular', 'सर्वाधिक लोकप्रिय', 'Most Popular')}</span>"
)
content = content.replace(
    "<h3 className=\"oj-card-title\">{isHi ? 'निःशुल्क जन्म कुंडली (Free Janam Kundli)' : 'Free Janam Kundli'}</h3>",
    "<h3 className=\"oj-card-title\">{trP('freeKundliTitle', 'निःशुल्क जन्म कुंडली (Free Janam Kundli)', 'Free Janam Kundli')}</h3>"
)
content = content.replace(
    "<span>{isHi ? 'कुंडली बनाएं →' : 'Create your Kundli →'}</span>",
    "<span>{trP('freeKundliBtn', 'कुंडली बनाएं →', 'Create your Kundli →')}</span>"
)

content = content.replace(
    "<span className=\"oj-card-tag\">{isHi ? 'दैनिक पंचांग' : 'Daily Panchang'}</span>",
    "<span className=\"oj-card-tag\">{trP('dailyPanchangTag', 'दैनिक पंचांग', 'Daily Panchang')}</span>"
)
content = content.replace(
    "<h3 className=\"oj-card-title\">{isHi ? 'दैनिक एवं मासिक पंचांग (Daily Panchang)' : 'Daily Panchang'}</h3>",
    "<h3 className=\"oj-card-title\">{trP('dailyPanchangTitle', 'दैनिक एवं मासिक पंचांग (Daily Panchang)', 'Daily Panchang')}</h3>"
)
content = content.replace(
    "<span>{isHi ? 'पंचांग देखें →' : \"View today's Panchang →\"}</span>",
    "<span>{trP('dailyPanchangBtn', 'पंचांग देखें →', \"View today's Panchang →\")}</span>"
)

content = content.replace(
    "<span className=\"oj-card-tag\">{isHi ? 'विवाह मिलान व मुहूर्त' : 'Marriage Matching & Muhurta'}</span>",
    "<span className=\"oj-card-tag\">{trP('matchingTag', 'विवाह मिलान व मुहूर्त', 'Marriage Matching & Muhurta')}</span>"
)
content = content.replace(
    "<h3 className=\"oj-card-title\">{isHi ? 'उन्नत कुण्डली मिलान व विवाह मुहूर्त' : 'Advance Kundali Milan & Vivaha Muhurta'}</h3>",
    "<h3 className=\"oj-card-title\">{trP('matchingTitle', 'उन्नत कुण्डली मिलान व विवाह मुहूर्त', 'Advance Kundali Milan & Vivaha Muhurta')}</h3>"
)
content = content.replace(
    "<span>{isHi ? 'कुण्डली मिलान व मुहूर्त देखें →' : 'Advance Marriage Matching & Muhurta →'}</span>",
    "<span>{trP('matchingBtn', 'कुण्डली मिलान व मुहूर्त देखें →', 'Advance Marriage Matching & Muhurta →')}</span>"
)

content = content.replace(
    "<span className=\"oj-card-tag\">{isHi ? '12 राशियां' : 'All 12 Signs'}</span>",
    "<span className=\"oj-card-tag\">{trP('rashifalTag', '12 राशियां', 'All 12 Signs')}</span>"
)
content = content.replace(
    "<h3 className=\"oj-card-title\">{isHi ? 'दैनिक, मासिक व वार्षिक राशिफल' : 'Daily, Monthly & Yearly Rashifal'}</h3>",
    "<h3 className=\"oj-card-title\">{trP('rashifalTitle', 'दैनिक, मासिक व वार्षिक राशिफल', 'Daily, Monthly & Yearly Rashifal')}</h3>"
)
content = content.replace(
    "<span>{isHi ? 'राशिफल पढ़ें →' : 'Read Rashifal →'}</span>",
    "<span>{trP('rashifalBtn', 'राशिफल पढ़ें →', 'Read Rashifal →')}</span>"
)

content = content.replace(
    "<span className=\"oj-card-tag\">{isHi ? 'केपी ज्योतिष' : 'KP System'}</span>",
    "<span className=\"oj-card-tag\">{trP('kpTag', 'केपी ज्योतिष', 'KP System')}</span>"
)
content = content.replace(
    "<h3 className=\"oj-card-title\">{isHi ? 'केपी कुंडली (KP Horoscope)' : 'KP Horoscope'}</h3>",
    "<h3 className=\"oj-card-title\">{trP('kpTitle', 'केपी कुंडली (KP Horoscope)', 'KP Horoscope')}</h3>"
)
content = content.replace(
    "<span>{isHi ? 'KP चार्ट बनाएं →' : 'Generate a KP chart →'}</span>",
    "<span>{trP('kpBtn', 'KP चार्ट बनाएं →', 'Generate a KP chart →')}</span>"
)

content = content.replace(
    "<span className=\"oj-card-tag\">{isHi ? 'शिशु नामकरण' : 'Newborn Baby'}</span>",
    "<span className=\"oj-card-tag\">{trP('babyTag', 'शिशु नामकरण', 'Newborn Baby')}</span>"
)
content = content.replace(
    "<h3 className=\"oj-card-title\">{isHi ? 'नवजात शिशु कुंडली (Newborn Horoscope)' : 'Newborn Horoscope'}</h3>",
    "<h3 className=\"oj-card-title\">{trP('babyTitle', 'नवजात शिशु कुंडली (Newborn Horoscope)', 'Newborn Horoscope')}</h3>"
)
content = content.replace(
    "<span>{isHi ? 'शिशु विवरण देखें →' : 'Check newborn details →'}</span>",
    "<span>{trP('babyBtn', 'शिशु विवरण देखें →', 'Check newborn details →')}</span>"
)

content = content.replace(
    "<span className=\"oj-card-tag\">{isHi ? '15 कैलकुलेटर' : '15 Calculators'}</span>",
    "<span className=\"oj-card-tag\">{trP('calculatorsTag', '15 कैलकुलेटर', '15 Calculators')}</span>"
)
content = content.replace(
    "<h3 className=\"oj-card-title\">{isHi ? 'दांपत्य, अंकज्योतिष व आयुर्दाय कैलकुलेटर (15 Tools)' : 'Astrology Calculators'}</h3>",
    "<h3 className=\"oj-card-title\">{trP('calculatorsTitle', 'दांपत्य, अंकज्योतिष व आयुर्दाय कैलकुलेटर (15 Tools)', 'Vedic Fortune & Relationship Calculators')}</h3>"
)
content = content.replace(
    "<span>{isHi ? '15 कैलकुलेटर खोलें →' : 'Open 15 Calculators →'}</span>",
    "<span>{trP('calculatorsBtn', '15 कैलकुलेटर खोलें →', 'Open 15 Calculators →')}</span>"
)

with open('src/components/OnlineJyotishHomePortal.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated OnlineJyotishHomePortal.tsx")
