import React from 'react';
import {
  Activity,
  Award,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Compass,
  FileSpreadsheet,
  FileText,
  Flame,
  Grid,
  Heart,
  HelpCircle,
  Layers,
  MapPin,
  Moon,
  Orbit,
  RotateCcw,
  Scale,
  Scroll,
  ShieldAlert,
  Sparkles,
  Star,
  Sun,
  UserCheck,
  Zap,
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import type { MainTab } from '../../nav';

export interface SubNavOption {
  id: string;
  labelEn: string;
  labelHi: string;
  icon?: React.ReactNode;
  badge?: string;
}

interface SecondarySubNavProps {
  primaryTab: MainTab;
  activeSubTab: string;
  onSelectSubTab: (subTabId: string) => void;
}

export const SecondarySubNav: React.FC<SecondarySubNavProps> = ({
  primaryTab,
  activeSubTab,
  onSelectSubTab,
}) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';

  const subNavMap: Record<string, SubNavOption[]> = {
    kundli: [
      {
        id: 'overview',
        labelEn: 'Basic Details & Avakhada',
        labelHi: 'मूल विवरण व अवकहड़ा',
        icon: <UserCheck size={14} />,
      },
      {
        id: 'charts',
        labelEn: 'Charts (D1, D9, Chalit)',
        labelHi: 'कुंडली चक्र (D1, D9, चलित)',
        icon: <Scroll size={14} />,
      },
      {
        id: 'planets',
        labelEn: 'Planetary Table & Degrees',
        labelHi: 'ग्रह स्थिति व अंश तालिका',
        icon: <FileSpreadsheet size={14} />,
      },
      {
        id: 'vargas',
        labelEn: 'Shodashvarga & D108',
        labelHi: 'षोडशवर्ग व सूक्ष्म वर्ग (D108)',
        icon: <Grid size={14} />,
        badge: 'D1–D360',
      },
      {
        id: 'strength',
        labelEn: 'Shadbala & Strengths',
        labelHi: 'षड्बल व भाव बल',
        icon: <Scale size={14} />,
      },
      {
        id: 'ashtakavarga',
        labelEn: 'Ashtakavarga & SAV',
        labelHi: 'अष्टकवर्ग व सर्वाष्टक',
        icon: <Layers size={14} />,
      },
    ],
    predictions: [
      {
        id: 'classical_yogas',
        labelEn: '300+ Classical Yogas',
        labelHi: '300+ वैदिक योग',
        icon: <Award size={14} />,
        badge: 'Parashara',
      },
      {
        id: 'timeline_120yr',
        labelEn: '120-Yr Timeline & Events',
        labelHi: '120-वर्षीय जीवन घटनाक्रम',
        icon: <Clock size={14} />,
        badge: '0–120 Yrs',
      },
      {
        id: 'bhavas_12',
        labelEn: '12 Bhavas Deep Analysis',
        labelHi: 'द्वादश भाव विस्तृत फलादेश',
        icon: <BookOpen size={14} />,
      },
      {
        id: 'bnn_bsp',
        labelEn: 'Bhrigu Nandi Nadi & BSP',
        labelHi: 'भृगु नंदी नाड़ी व BSP (29 नियम)',
        icon: <Sparkles size={14} />,
        badge: 'BNN/BSP',
      },
      {
        id: 'yuti_aspects',
        labelEn: 'Conjunctions (2-7) & Drishti',
        labelHi: 'ग्रह युति (2–7) व दृष्टि फल',
        icon: <Zap size={14} />,
      },
      {
        id: 'past_future',
        labelEn: 'Past Life & Future Gati',
        labelHi: 'पूर्व जन्म व आगामी गति',
        icon: <RotateCcw size={14} />,
      },
    ],
    dasha_transits: [
      {
        id: 'vimshottari',
        labelEn: 'Vimshottari Dasha (5 Levels)',
        labelHi: 'विंशोत्तरी दशा (5 स्तर)',
        icon: <Clock size={14} />,
        badge: '5 Levels',
      },
      {
        id: 'special_dashas',
        labelEn: 'Yogini, Char & Narayana',
        labelHi: 'योगिनी, चर व नारायण दशा',
        icon: <RotateCcw size={14} />,
      },
      {
        id: 'live_transits',
        labelEn: 'Live Gochar (Transits)',
        labelHi: 'वर्तमान गोचर स्थिति',
        icon: <Orbit size={14} />,
      },
      {
        id: 'sade_sati',
        labelEn: 'Saturn Sade Sati & Dhaiya',
        labelHi: 'शनि साढ़े साती व ढैय्या',
        icon: <ShieldAlert size={14} />,
      },
      {
        id: 'varshaphala',
        labelEn: 'Annual Varshaphala Chart',
        labelHi: 'वर्षफल (ताजिक वर्ष कुंडली)',
        icon: <Sun size={14} />,
      },
    ],
    branches: [
      {
        id: 'kp_4step',
        labelEn: 'KP System & 4-Step Theory',
        labelHi: 'KP पद्धति व 4-स्टेप थ्योरी',
        icon: <Star size={14} />,
        badge: 'KP 4-Step',
      },
      {
        id: 'lal_kitab',
        labelEn: 'Lal Kitab 1952 Classic',
        labelHi: 'लाल किताब 1952 (ऋण व सोये घर)',
        icon: <Flame size={14} />,
        badge: '1952',
      },
      {
        id: 'bhavartha_ratnakara',
        labelEn: 'Bhavartha Ratnakara',
        labelHi: 'भावार्थ रत्नाकर (12 लग्न सूत्र)',
        icon: <Scroll size={14} />,
      },
      {
        id: 'numerology',
        labelEn: 'Numerology & Lo Shu Grid',
        labelHi: 'अंक ज्योतिष व लो शु ग्रिड',
        icon: <Grid size={14} />,
      },
      {
        id: 'doshas_remedies',
        labelEn: 'Manglik, Kaalsarp & Gems',
        labelHi: 'मांगलिक, कालसर्प व रत्न परामर्श',
        icon: <ShieldAlert size={14} />,
      },
      {
        id: 'life_specialized',
        labelEn: 'Career, Wealth & Medical',
        labelHi: 'करियर, धन व चिकित्सा ज्योतिष',
        icon: <Activity size={14} />,
      },
    ],
    matchmaking: [
      {
        id: 'ashtakoota',
        labelEn: '36 Guna Ashtakoota Milan',
        labelHi: 'अष्टकूट 36 गुण मिलान',
        icon: <Heart size={14} />,
        badge: '36 Guna',
      },
      {
        id: 'manglik_match',
        labelEn: 'Manglik Dosha & 10 Cancellations',
        labelHi: 'मांगलिक विचार व 10 परिहार',
        icon: <ShieldAlert size={14} />,
      },
      {
        id: 'poruthams',
        labelEn: 'South Indian Poruthams',
        labelHi: 'दक्षिण भारतीय पोरुथम (10/20)',
        icon: <CheckCircle size={14} />,
      },
      {
        id: 'verdict',
        labelEn: 'Marriage Verdict & Muhurta',
        labelHi: 'विवाह निर्णय व शुभ मुहूर्त',
        icon: <Sparkles size={14} />,
      },
    ],
    panchang_muhurta: [
      {
        id: 'daily_panchang',
        labelEn: 'Daily Drik Panchang',
        labelHi: 'दैनिक दृक पंचांग',
        icon: <Calendar size={14} />,
      },
      {
        id: 'calendar_festivals',
        labelEn: '2026–2027 Hindu Calendar',
        labelHi: '2026–2027 हिन्दू पर्व व पंचांग',
        icon: <Calendar size={14} />,
        badge: '2026-27',
      },
      {
        id: 'muhurta_finder',
        labelEn: 'Shubh Muhurta Finder',
        labelHi: 'शुभ मुहूर्त चयन (विवाह/गृह/वाहन)',
        icon: <Sparkles size={14} />,
      },
      {
        id: 'choghadiya_hora',
        labelEn: 'Choghadiya & 24h Hora',
        labelHi: 'चौघड़िया व 24-घंटे होरा',
        icon: <Clock size={14} />,
      },
      {
        id: 'btr_pakshi_tools',
        labelEn: 'BTR & Pancha Pakshi Tools',
        labelHi: 'BTR समय शुद्धि व पंच पक्षी',
        icon: <Compass size={14} />,
      },
    ],
    patrika_booklet: [
      {
        id: 'full_edition',
        labelEn: '34-Chapter Deluxe Patrika',
        labelHi: '34-अध्यायी बृहत् जन्मपत्रिका',
        icon: <FileText size={14} />,
        badge: '34 Ch',
      },
      {
        id: 'branding_options',
        labelEn: 'Custom Astrologer Branding',
        labelHi: 'ज्योतिषी नाम व केंद्र ब्रांडिंग',
        icon: <Award size={14} />,
      },
    ],
  };

  const options = subNavMap[primaryTab];
  if (!options || options.length === 0) return null;

  return (
    <div className="pro-sub-nav no-print" aria-label="Secondary Sub Navigation">
      <div className="pro-sub-scroll-container">
        {options.map((opt) => {
          const isActive = activeSubTab === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              className={`pro-sub-tab-btn ${isActive ? 'is-active' : ''}`}
              onClick={() => onSelectSubTab(opt.id)}
            >
              {opt.icon && <span className="pro-sub-icon">{opt.icon}</span>}
              <span className="pro-sub-label">
                {isHi ? opt.labelHi : opt.labelEn}
              </span>
              {opt.badge && <span className="pro-sub-badge">{opt.badge}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
};
