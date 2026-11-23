# scripts/update_fortune_calcs.py

with open('src/components/onlinejyotish/FortuneCalculatorsView.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update imports
content = content.replace(
    "import { useLanguage } from '../../i18n/LanguageContext';",
    "import { useLanguage } from '../../i18n/LanguageContext';\nimport { trCalc, trTerm } from '../../i18n/translations';"
)

# 2. Add trC helper
old_decl = """  const { lang } = useLanguage();
  const isHi = lang === 'hi';"""

new_decl = """  const { lang } = useLanguage();
  const isHi = lang === 'hi';

  const trC = (key: string, hiText: string, enText: string): string => {
    if (lang === 'en') return enText;
    if (lang === 'hi') return hiText;
    const mapped = trCalc(key, lang);
    if (mapped && mapped !== key) return mapped;
    return enText;
  };"""

content = content.replace(old_decl, new_decl)

# 3. Header replacements
content = content.replace(
    "{isHi\n            ? 'प्रामाणिक दांपत्य, अंकज्योतिष एवं आयुर्दाय कैलकुलेटर हब'\n            : 'Authentic Relationship, Numerology & Longevity Calculators'}",
    "{trC('heading', 'प्रामाणिक दांपत्य, अंकज्योतिष एवं आयुर्दाय कैलकुलेटर हब', 'Authentic Relationship, Numerology & Longevity Calculators')}"
)

content = content.replace(
    "{isHi\n            ? '१००% वैज्ञानिक व शास्त्रीय ज्योतिष: प्रेम बनाम पारंपरिक विवाह, सटीक विवाह समय (द्वि-गोचर), जीवनसाथी का नामाक्षर, दांपत्य सामंजस्य, अंक अनुकूलता, तथा शास्त्रीय आयुर्दाय व महामृत्युंजय रक्षा विधान। शून्य फोन नंबर, शून्य भय-व्यापार।'\n            : '100% Classical Vedic Astrology: Love vs Arranged Marriage, Marriage Timing & Double Transit, Partner Name Initials, Numerology Vibrations, and Authentic Ayurdaya Longevity Protection.'}",
    "{trC('subheading', '१००% वैज्ञानिक व शास्त्रीय ज्योतिष: प्रेम बनाम पारंपरिक विवाह, सटीक विवाह समय (द्वि-गोचर), जीवनसाथी का नामाक्षर, दांपत्य सामंजस्य, अंक अनुकूलता, तथा शास्त्रीय आयुर्दाय व महामृत्युंजय रक्षा विधान। शून्य फोन नंबर, शून्य भय-व्यापार।', '100% Classical Vedic Astrology: Love vs Arranged Marriage, Marriage Timing & Double Transit, Partner Name Initials, Numerology Vibrations, and Authentic Ayurdaya Longevity Protection.')}"
)

content = content.replace(
    "<span>{isHi ? 'साथी को सहेजें' : 'Save Partner as Profile'}</span>",
    "<span>{trC('savePartner', 'साथी को सहेजें', 'Save Partner as Profile')}</span>"
)

content = content.replace(
    "<span>{isHi ? 'लव कैलकुलेटर (Love %)' : 'Love Calculator (%)'}</span>",
    "<span>{trC('calc_love', 'लव कैलकुलेटर (Love %)', 'Love Calculator (%)')}</span>"
)

with open('src/components/onlinejyotish/FortuneCalculatorsView.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated FortuneCalculatorsView.tsx")
