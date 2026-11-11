import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { MainTab } from '../nav';
import { useLanguage } from '../i18n/LanguageContext';

interface SubMenuItem {
  labelEn: string;
  labelHi: string;
  action: () => void;
}

interface TopMenuCategory {
  id: string;
  labelEn: string;
  labelHi: string;
  defaultAction: () => void;
  items: SubMenuItem[];
}

interface PortalMegaNavProps {
  activeTab: MainTab;
  onNavigate: (tab: MainTab, subTab?: string, nested?: string) => void;
  onOpenMatchSubTab: (sub: 'overview' | 'porutham' | 'sphuta' | 'vivaha' | 'pooja' | 'house_sign') => void;
  onOpenEditor: () => void;
  onOpenBooklet: () => void;
}

/**
 * Clean 2-tier horizontal Vedic portal navigation matching all 14 top categories
 * (Home, Horoscope, Astrology, 2027, Occult, Free Reports, Healing, Panchang,
 *  Lal Kitab, KP, Compatibility, Calculators, Festivals, Misc) with zero ads.
 */
export const PortalMegaNav: React.FC<PortalMegaNavProps> = ({
  activeTab,
  onNavigate,
  onOpenMatchSubTab,
  onOpenEditor,
  onOpenBooklet,
}) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';

  const categories: TopMenuCategory[] = [
    {
      id: 'home',
      labelEn: 'Home',
      labelHi: 'होम',
      defaultAction: () => onNavigate('home'),
      items: [
        { labelEn: 'Dashboard Home', labelHi: 'मुख्य होम पोर्टल', action: () => onNavigate('home') },
        { labelEn: 'Basic Details (Person/Avakhada)', labelHi: 'मूल विवरण (अवकहड़ा व घातक)', action: () => onNavigate('basics', 'basic_details') },
        { labelEn: 'Birth Charts (D1 / D9 / Chalit)', labelHi: 'जन्म कुंडली चार्ट (D1 / D9)', action: () => onNavigate('basics', 'planets') },
        { labelEn: 'Higher Vargas (D64–D360 / D108)', labelHi: 'सूक्ष्म वर्ग (D64–D360 / D108)', action: () => onNavigate('vargas', 'D108') },
        { labelEn: '1000+ Empirical Rules & MEP', labelHi: '1000+ उन्नत नियम व MEP', action: () => onNavigate('predictions', 'advancedTechniques') },
        { labelEn: 'Print Brihat Kundli PDF', labelHi: 'बृहत् कुंडली PDF प्रिंट', action: onOpenBooklet },
      ],
    },
    {
      id: 'horoscope',
      labelEn: 'Horoscope',
      labelHi: 'राशिफल',
      defaultAction: () => onNavigate('astro_tools', 'rashifal'),
      items: [
        { labelEn: 'Today Horoscope', labelHi: 'आज का राशिफल', action: () => onNavigate('astro_tools', 'rashifal') },
        { labelEn: "Tomorrow's Horoscope", labelHi: 'कल का राशिफल', action: () => onNavigate('astro_tools', 'rashifal_tomorrow') },
        { labelEn: 'Weekly Horoscope', labelHi: 'साप्ताहिक राशिफल', action: () => onNavigate('astro_tools', 'rashifal_weekly') },
        { labelEn: 'Weekly Love', labelHi: 'साप्ताहिक प्रेम', action: () => onNavigate('astro_tools', 'rashifal_weekly_love') },
        { labelEn: 'Monthly Horoscope', labelHi: 'मासिक राशिफल', action: () => onNavigate('astro_tools', 'rashifal_monthly') },
        { labelEn: 'Zodiac Signs', labelHi: '12 राशियाँ', action: () => onNavigate('hub', 'reference', 'signs') },
        { labelEn: 'Love & Marriage Synastry', labelHi: 'दांपत्य एवं काम सुख', action: () => onNavigate('branches', 'intimacy') },
        { labelEn: 'Chinese Horoscope', labelHi: 'चाइनीज राशिफल', action: () => onNavigate('hub', 'chinese') },
      ],
    },
    {
      id: 'astrology',
      labelEn: 'Astrology',
      labelHi: 'ज्योतिष',
      defaultAction: () => onNavigate('basics', 'basic_details'),
      items: [
        { labelEn: 'Basic Details', labelHi: 'मूल विवरण', action: () => onNavigate('basics', 'basic_details') },
        { labelEn: 'Free Astrology Chart', labelHi: 'जन्म कुंडली चार्ट', action: () => onNavigate('basics', 'planets') },
        { labelEn: 'D108 · D150 · D64–D360 Charts', labelHi: 'D64–D360 सूक्ष्म वर्ग', action: () => onNavigate('vargas', 'D108') },
        { labelEn: 'Muhurat', labelHi: 'शुभ मुहूर्त', action: () => onNavigate('tools', 'muhurta') },
        { labelEn: 'Learn Astrology', labelHi: 'ज्योतिष सीखें', action: () => onNavigate('hub', 'reference', 'learn') },
        { labelEn: 'Planets (Navagraha)', labelHi: 'नवग्रह विवरण', action: () => onNavigate('hub', 'reference', 'planets') },
        { labelEn: 'Kundli Database / Edit', labelHi: 'कुंडली डेटाबेस व सुधार', action: onOpenEditor },
        { labelEn: 'Baby Names', labelHi: 'शिशु नाम (108)', action: () => onNavigate('astro_tools', 'baby_names') },
        { labelEn: 'City Atlas Search', labelHi: 'विश्व शहर एटलस', action: onOpenEditor },
      ],
    },
    {
      id: 'y2027',
      labelEn: '2027',
      labelHi: '2027',
      defaultAction: () => onNavigate('astro_tools', 'rashifal_2027'),
      items: [
        { labelEn: 'Horoscope 2027', labelHi: 'वार्षिक राशिफल 2027', action: () => onNavigate('astro_tools', 'rashifal_2027') },
        { labelEn: 'राशिफल 2027 (Hindi)', labelHi: 'राशिफल 2027', action: () => onNavigate('astro_tools', 'rashifal_2027') },
        { labelEn: 'Holidays 2027', labelHi: 'पर्व एवं अवकाश 2027', action: () => onNavigate('tools', 'calendar_2027') },
        { labelEn: 'Calendar 2027', labelHi: 'पंचांग कैलेंडर 2027', action: () => onNavigate('tools', 'calendar_2027') },
        { labelEn: 'Chinese Horoscope 2026', labelHi: 'चाइनीज राशिफल 2026', action: () => onNavigate('hub', 'chinese', '2026') },
        { labelEn: 'Chinese Horoscope 2027', labelHi: 'चाइनीज राशिफल 2027', action: () => onNavigate('hub', 'chinese', '2027') },
        { labelEn: 'Shubh Muhurat 2027', labelHi: 'शुभ मुहूर्त 2027', action: () => onNavigate('tools', 'muhurta_2027') },
        { labelEn: 'Saturn & Rahu Transits 2027', labelHi: 'शनि-राहु गोचर 2027', action: () => onNavigate('transits') },
      ],
    },
    {
      id: 'occult',
      labelEn: 'Occult',
      labelHi: 'गूढ़ विद्या',
      defaultAction: () => onNavigate('hub', 'swarodaya'),
      items: [
        { labelEn: 'Palmistry (Mounts)', labelHi: 'सामुद्रिक हस्तरेखा', action: () => onNavigate('hub', 'palmistry') },
        { labelEn: 'Vastu', labelHi: 'ज्योतिष वास्तु', action: () => onNavigate('branches', 'vastu') },
        { labelEn: 'Chinese Astrology', labelHi: 'चाइनीज ज्योतिष', action: () => onNavigate('hub', 'chinese') },
        { labelEn: 'Numerology', labelHi: 'अंक ज्योतिष', action: () => onNavigate('astro_tools', 'numerology') },
        { labelEn: 'Mantra', labelHi: 'नवग्रह मंत्र', action: () => onNavigate('hub', 'prayers', 'mantra') },
        { labelEn: 'Chalisa', labelHi: 'चालीसा पाठ', action: () => onNavigate('hub', 'prayers', 'chalisa') },
        { labelEn: 'Aarti', labelHi: 'आरती संग्रह', action: () => onNavigate('hub', 'prayers', 'aarti') },
        { labelEn: 'Dharma Karma', labelHi: 'धर्म-कर्म नियम', action: () => onNavigate('hub', 'prayers', 'dharma') },
        { labelEn: 'Nadi Astrology', labelHi: 'भृगु नंदी नाड़ी', action: () => onNavigate('predictions', 'bhriguNadi') },
        { labelEn: 'D150 Nadiamsa & D108 Charts', labelHi: 'D150 नाड़ीअंश व D108 वर्ग', action: () => onNavigate('vargas', 'D150') },
        { labelEn: 'Swarodaya', labelHi: 'शिव स्वरोदय', action: () => onNavigate('hub', 'swarodaya') },
        { labelEn: 'Nakshatra', labelHi: '27 नक्षत्र ज्ञान', action: () => onNavigate('hub', 'reference', 'nakshatras') },
      ],
    },
    {
      id: 'reports',
      labelEn: 'Free Reports',
      labelHi: 'विशेष रिपोर्ट',
      defaultAction: () => onNavigate('predictions', 'advancedTechniques'),
      items: [
        { labelEn: 'Kaalsarp Yoga/ Dosha', labelHi: 'कालसर्प योग जांच', action: () => onNavigate('predictions', 'branchesNumerology', 'doshas_remedies') },
        { labelEn: 'Gemstones Report', labelHi: 'रत्न व रुद्राक्ष', action: () => onNavigate('astro_tools', 'gems_rudraksha') },
        { labelEn: 'Sade Sati Report', labelHi: 'साढ़ेसाती रिपोर्ट', action: () => onNavigate('transits') },
        { labelEn: 'Mangal Dosha Report', labelHi: 'मांगलिक दोष जांच', action: () => onNavigate('strength') },
        { labelEn: 'Varshaphal', labelHi: 'ताजिक वर्षफल', action: () => onNavigate('predictions', 'branchesNumerology', 'varshaphal') },
        { labelEn: 'Transit Today', labelHi: 'आज का गोचर फल', action: () => onNavigate('predictions', 'gocharWise') },
        { labelEn: 'Lal Kitab Report', labelHi: 'लाल किताब रिपोर्ट', action: () => onNavigate('predictions', 'branchesNumerology', 'lal_kitab') },
        { labelEn: 'Vimshottari Dasha', labelHi: 'विंशोत्तरी दशा', action: () => onNavigate('dasha', 'vimshottari') },
        { labelEn: 'Baby Names Suggestion', labelHi: 'शिशु नाम सुझाव', action: () => onNavigate('astro_tools', 'baby_names') },
      ],
    },
    {
      id: 'healing',
      labelEn: 'Healing',
      labelHi: 'आरोग्य',
      defaultAction: () => onNavigate('hub', 'healing'),
      items: [
        { labelEn: 'Feng Shui', labelHi: 'फेंगशुई (कुआ)', action: () => onNavigate('hub', 'healing') },
        { labelEn: 'Reiki Healing', labelHi: 'रेकी चिकित्सा', action: () => onNavigate('hub', 'healing') },
        { labelEn: 'Meditation', labelHi: 'ध्यान साधना', action: () => onNavigate('hub', 'healing') },
        { labelEn: 'Yoga & Pranayama', labelHi: 'योग व प्राणायाम', action: () => onNavigate('hub', 'healing') },
        { labelEn: 'Crystal Therapy', labelHi: 'क्रिस्टल चिकित्सा', action: () => onNavigate('hub', 'healing') },
        { labelEn: 'Color Therapy', labelHi: 'रंग चिकित्सा', action: () => onNavigate('hub', 'healing') },
        { labelEn: 'Acupressure Points', labelHi: 'एक्यूप्रेशर व मर्म', action: () => onNavigate('hub', 'healing') },
        { labelEn: 'Aromatherapy', labelHi: 'सुगंध चिकित्सा', action: () => onNavigate('hub', 'healing') },
        { labelEn: 'Ayurveda', labelHi: 'आयुर्वेद व त्रिदोष', action: () => onNavigate('hub', 'healing') },
        { labelEn: 'Medical Astrology', labelHi: 'मेडिकल ज्योतिष (D6)', action: () => onNavigate('branches', 'medical') },
      ],
    },
    {
      id: 'panchang',
      labelEn: 'Panchang',
      labelHi: 'पंचांग',
      defaultAction: () => onNavigate('tools', 'deep_panchang'),
      items: [
        { labelEn: 'Today Panchang', labelHi: 'आज का पंचांग', action: () => onNavigate('tools', 'deep_panchang') },
        { labelEn: 'Panchangam (Gowri)', labelHi: 'गौरी पंचांगम', action: () => onNavigate('transits') },
        { labelEn: 'Monthly Panchang', labelHi: 'मासिक पंचांग', action: () => onNavigate('tools', 'monthly_panchang') },
        { labelEn: 'Indian Calendar', labelHi: 'हिंदू व्रत कैलेंडर', action: () => onNavigate('tools', 'calendar') },
        { labelEn: 'Abhijit & Do Ghati Muhurat', labelHi: 'अभिजित व दो-घटी मुहूर्त', action: () => onNavigate('tools', 'do_ghati') },
        { labelEn: 'Hora Calculator', labelHi: '24 घंटे होरा कैलकुलेटर', action: () => onNavigate('tools', 'hora_24') },
        { labelEn: 'Rahu Kaal Today', labelHi: 'आज का राहुकाल', action: () => onNavigate('home') },
        { labelEn: 'Choghadiya', labelHi: 'चौघड़िया मुहूर्त', action: () => onNavigate('transits') },
        { labelEn: 'Sunrise & Sunset', labelHi: 'सूर्योदय व सूर्यास्त', action: () => onNavigate('basics', 'panchang') },
      ],
    },
    {
      id: 'lalkitab',
      labelEn: 'Lal Kitab',
      labelHi: 'लाल किताब',
      defaultAction: () => onNavigate('predictions', 'branchesNumerology', 'lal_kitab'),
      items: [
        { labelEn: 'Lal Kitab Chart & Tewa', labelHi: 'लाल किताब टेवा व कुंडली', action: () => onNavigate('predictions', 'branchesNumerology', 'lal_kitab') },
        { labelEn: 'Lal Kitab Worksheet (35-Yr)', labelHi: '35-वर्ष लाल किताब चक्र', action: () => onNavigate('predictions', 'branchesNumerology', 'lal_kitab') },
        { labelEn: 'Karmic Debt (Rin) & Upay', labelHi: 'पितृ/मातृ ऋण व उपाय', action: () => onNavigate('predictions', 'branchesNumerology', 'lal_kitab') },
        { labelEn: 'Lal Kitab Varshaphal', labelHi: 'लाल किताब वर्षफल', action: () => onNavigate('predictions', 'branchesNumerology', 'lal_kitab') },
      ],
    },
    {
      id: 'kp',
      labelEn: 'KP',
      labelHi: 'KP पध्दति',
      defaultAction: () => onNavigate('predictions', 'branchesNumerology', 'kp'),
      items: [
        { labelEn: 'Make KP Chart & Cusps', labelHi: 'KP भाव व उप-स्वामी', action: () => onNavigate('predictions', 'branchesNumerology', 'kp') },
        { labelEn: 'Ruling Planets Now', labelHi: 'तात्कालिक KP रूलिंग ग्रह', action: () => onNavigate('predictions', 'branchesNumerology', 'kp') },
        { labelEn: 'KP Horary Chart (1–249)', labelHi: 'KP प्रश्न कुंडली (1–249)', action: () => onNavigate('prashna') },
        { labelEn: 'KP Significators', labelHi: 'KP भाव कारक तालिका', action: () => onNavigate('predictions', 'branchesNumerology', 'kp') },
      ],
    },
    {
      id: 'compatibility',
      labelEn: 'Compatibility',
      labelHi: 'मिलान',
      defaultAction: () => onNavigate('match'),
      items: [
        { labelEn: 'Horoscope Matching (36 Guna)', labelHi: 'अष्टकूट 36 गुण मिलान', action: () => onOpenMatchSubTab('overview') },
        { labelEn: 'Porutham (10-Fold South)', labelHi: 'दश पोरुथम् मिलान', action: () => onOpenMatchSubTab('porutham') },
        { labelEn: 'Beeja & Kshetra Sphuta', labelHi: 'बीज व क्षेत्र स्फुट', action: () => onOpenMatchSubTab('sphuta') },
        { labelEn: 'Vivaha Dates & Dasha', labelHi: 'शुभ विवाह मुहूर्त', action: () => onOpenMatchSubTab('vivaha') },
        { labelEn: 'Dosha Pooja & Synastry', labelHi: 'दोष पूजा व भाव-राशि मिलान', action: () => onOpenMatchSubTab('pooja') },
        { labelEn: 'Numerology Name Match', labelHi: 'नाम व जन्मतिथि मिलान', action: () => onNavigate('hub', 'calculators', 'name_compat') },
      ],
    },
    {
      id: 'calculators',
      labelEn: 'Calculators',
      labelHi: 'कैलकुलेटर',
      defaultAction: () => onNavigate('hub', 'calculators', 'signs'),
      items: [
        { labelEn: 'Numerology Calculator', labelHi: 'अंक ज्योतिष कैलकुलेटर', action: () => onNavigate('astro_tools', 'numerology') },
        { labelEn: 'Moon Sign Calculator', labelHi: 'चंद्र राशि कैलकुलेटर', action: () => onNavigate('hub', 'calculators', 'signs') },
        { labelEn: 'Sun Sign Calculator', labelHi: 'सूर्य राशि कैलकुलेटर', action: () => onNavigate('hub', 'calculators', 'signs') },
        { labelEn: 'Rasi & Ascendant Calculator', labelHi: 'लग्न व राशि कैलकुलेटर', action: () => onNavigate('hub', 'calculators', 'signs') },
        { labelEn: 'Ayanamsa Calculator', labelHi: 'अयनांश कैलकुलेटर', action: () => onNavigate('hub', 'calculators', 'ayanamsa') },
        { labelEn: 'Nakshatra Calculator', labelHi: 'नक्षत्र व पाया कैलकुलेटर', action: () => onNavigate('hub', 'calculators', 'signs') },
        { labelEn: 'Friendship Calculator', labelHi: 'ग्रह मैत्री जाँच', action: () => onNavigate('hub', 'calculators', 'friendship') },
      ],
    },
    {
      id: 'festivals',
      labelEn: 'Festivals',
      labelHi: 'पर्व व व्रत',
      defaultAction: () => onNavigate('tools', 'calendar'),
      items: [
        { labelEn: 'Annual Hindu Festivals', labelHi: 'वार्षिक हिंदू पर्व', action: () => onNavigate('tools', 'calendar') },
        { labelEn: '2027 Holidays & Calendar', labelHi: '2027 पर्व एवं कैलेंडर', action: () => onNavigate('tools', 'calendar_2027') },
        { labelEn: 'Ekadashi, Purnima & Sankranti', labelHi: 'एकादशी, पूर्णिमा व संक्रांति', action: () => onNavigate('tools', 'calendar') },
      ],
    },
    {
      id: 'misc',
      labelEn: 'Misc',
      labelHi: 'प्रश्नावली व विविध',
      defaultAction: () => onNavigate('hub', 'prashnavali', 'ramshalaka'),
      items: [
        { labelEn: 'Ramshalaka (15×15)', labelHi: 'श्री रामशलाका प्रश्नावली', action: () => onNavigate('hub', 'prashnavali', 'ramshalaka') },
        { labelEn: 'Hanuman Prashna Yantra', labelHi: 'हनुमान प्रश्नावली (49)', action: () => onNavigate('hub', 'prashnavali', 'hanuman') },
        { labelEn: 'Ask Ganesha Chakra', labelHi: 'गणेश प्रश्न चक्र', action: () => onNavigate('hub', 'prashnavali', 'ganesh') },
        { labelEn: '120-Yr Events & Past/Future', labelHi: '120 वर्ष जीवन घटना व पूर्व-भविष्य', action: () => onNavigate('predictions', 'eventsLedger') },
        { labelEn: 'Transit Now', labelHi: 'वर्तमान गोचर', action: () => onNavigate('transits') },
        { labelEn: 'Mahadasha', labelHi: 'विंशोत्तरी महादशा', action: () => onNavigate('dasha', 'vimshottari') },
      ],
    },
  ];

  const [openCatId, setOpenCatId] = useState<string>('home');
  const activeCat = categories.find((c) => c.id === openCatId) ?? categories[0];

  return (
    <div
      className="mega-nav-wrapper no-print"
      onMouseLeave={() => {
        if (activeTab === 'home') setOpenCatId('home');
      }}
    >
      {/* Tier 1: Warm Cream Horizontal Main Categories */}
      <nav className="mega-tier-1" aria-label={isHi ? 'मुख्य ज्योतिष मेनू' : 'Main Astrology Menu'}>
        <div className="mega-tier-inner">
          {categories.map((cat) => {
            const isOpen = openCatId === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                className={`mega-t1-btn ${isOpen ? 'is-active' : ''}`}
                onMouseEnter={() => setOpenCatId(cat.id)}
                onFocus={() => setOpenCatId(cat.id)}
                onClick={() => {
                  setOpenCatId(cat.id);
                  cat.defaultAction();
                }}
              >
                <span>{isHi ? cat.labelHi : cat.labelEn}</span>
                <ChevronDown size={11} className="mega-caret" />
              </button>
            );
          })}
        </div>
      </nav>

      {/* Tier 2: Crisp White Horizontal Sub-Ribbon */}
      <div className="mega-tier-2">
        <div className="mega-tier-inner">
          {activeCat.items.map((sub, i) => (
            <button
              key={`${activeCat.id}-${i}`}
              type="button"
              className="mega-t2-btn"
              onClick={sub.action}
            >
              {isHi ? sub.labelHi : sub.labelEn}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
