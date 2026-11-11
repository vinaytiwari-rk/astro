import React from 'react';
import {
  Activity,
  Baby,
  BookOpen,
  Briefcase,
  Calendar,
  ChevronRight,
  Clock,
  Compass,
  Edit3,
  FileText,
  Flame,
  Gem,
  Grid3x3,
  Heart,
  HelpCircle,
  Layers,
  Moon,
  ShieldAlert,
  Sliders,
  Sparkles,
  Star,
  Sun,
  Trash2,
} from 'lucide-react';
import { formatDateDmy } from '../astro/time';
import type { ChartData } from '../astro/types';
import { evaluateParamayusStatus } from '../astro/predictions/paramayus';
import type { MainTab } from '../nav';
import { useLanguage } from '../i18n/LanguageContext';
import { trSign, trTerm } from '../i18n/translations';
import { ParamayusLockBanner } from './ParamayusLockBanner';

interface HomeDashboardViewProps {
  chart: ChartData;
  onNavigate: (tab: MainTab, subTab?: string, nested?: string) => void;
  onOpenEditor: () => void;
  onOpenBooklet: () => void;
  canDeleteProfile?: boolean;
  onDeleteProfile?: () => void;
}

interface HubCard {
  id: string;
  titleEn: string;
  titleHi: string;
  descEn: string;
  descHi: string;
  tone?: 'accent' | 'indigo' | 'good';
  icon: React.ReactNode;
  onClick: () => void;
}

interface DirLink {
  labelEn: string;
  labelHi: string;
  onClick: () => void;
}

export const HomeDashboardView: React.FC<HomeDashboardViewProps> = ({
  chart,
  onNavigate,
  onOpenEditor,
  onOpenBooklet,
  canDeleteProfile = false,
  onDeleteProfile,
}) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';
  const moonSignIndex = chart.planets.find((p) => p.id === 'Moon')?.signIndex ?? 0;
  const paramayus = evaluateParamayusStatus(chart);

  const cards: HubCard[] = [
    {
      id: 'birth_chart',
      titleEn: 'Birth Chart / Kundli',
      titleHi: 'जन्म कुंडली एवं चार्ट',
      descEn: 'Lagna, Navamsha, Chalit & degrees',
      descHi: 'लग्न, नवांश, चलित एवं ग्रह अंश',
      tone: 'accent',
      icon: <Sparkles size={24} />,
      onClick: () => onNavigate('basics', 'planets'),
    },
    {
      id: 'match_horoscope',
      titleEn: 'Match Horoscope',
      titleHi: 'कुंडली मिलान (36 गुण)',
      descEn: 'Ashtakoota 36 Guna & Manglik match',
      descHi: 'अष्टकूट मिलान, मांगलिक व नाड़ी जाँच',
      tone: 'indigo',
      icon: <Heart size={24} />,
      onClick: () => onNavigate('match'),
    },
    {
      id: 'events_qa',
      titleEn: '120-Yr Life Events & Full Q&A',
      titleHi: '120-वर्ष घटनाएँ व संपूर्ण प्रश्नोत्तर',
      descEn: 'Ages 0–120 milestones, accidents, marriage & career',
      descHi: 'आयु 0–120 जीवन घटनाक्रम, विवाह, संतान व दुर्घटना',
      tone: 'accent',
      icon: <ShieldAlert size={24} />,
      onClick: () => onNavigate('predictions', 'eventsLedger'),
    },
    {
      id: 'past_future_life',
      titleEn: 'Past Life & Future Becoming',
      titleHi: 'पूर्व जन्म व भविष्य जीवन गति',
      descEn: 'D60, D12, D20, Ketu/Rahu & Next-Birth Gati',
      descHi: 'D60 षष्ट्यंश, D12 व राहु-केतु से भूत-भविष्य फल',
      tone: 'indigo',
      icon: <Sparkles size={24} />,
      onClick: () => onNavigate('predictions', 'pastFuture'),
    },
    {
      id: 'life_predictions',
      titleEn: 'Your Life Predictions',
      titleHi: 'संपूर्ण फलादेश स्टूडियो',
      descEn: 'Signs, Nakshatras, Houses & Yogas',
      descHi: 'राशि, नक्षत्र, भाव और राजयोग फलादेश',
      tone: 'indigo',
      icon: <BookOpen size={24} />,
      onClick: () => onNavigate('predictions', 'planetInHouse'),
    },
    {
      id: 'gochar_transits',
      titleEn: 'Gochar Phal (Transits)',
      titleHi: 'गोचर फल व वेध विश्लेषण',
      descEn: 'Live planetary transits vs natal chart',
      descHi: 'वर्तमान ग्रह गोचर, वेध व सार्धसाती',
      tone: 'good',
      icon: <Moon size={24} />,
      onClick: () => onNavigate('transits'),
    },
    {
      id: 'bhrigu_nadi',
      titleEn: 'Bhrigu Nandi Nadi',
      titleHi: 'भृगु नंदी नाड़ी फलादेश',
      descEn: 'Nadi linkages, Karma & Spouse coding',
      descHi: 'नाड़ी युति, त्रिकोण व कर्म-विवाह सूत्र',
      tone: 'accent',
      icon: <Compass size={24} />,
      onClick: () => onNavigate('predictions', 'bhriguNadi'),
    },
    {
      id: 'lal_kitab',
      titleEn: 'Lal Kitab Horoscope',
      titleHi: 'लाल किताब कुंडली व उपाय',
      descEn: 'Varshaphal, Karmic Debt (Rin) & Upay',
      descHi: 'वर्षफल, पितृ/मातृ ऋण व सरल लाल किताब उपाय',
      tone: 'accent',
      icon: <Flame size={24} />,
      onClick: () => onNavigate('predictions', 'branchesNumerology', 'lal_kitab'),
    },
    {
      id: 'yogas_mangal',
      titleEn: 'Shadbala & Yogas',
      titleHi: 'षड्बल, मांगलिक व राजयोग',
      descEn: 'Planetary strengths, Doshas & Yogas',
      descHi: 'षड्बल तालिका, पंचमहापुरुष व मंगल दोष',
      tone: 'good',
      icon: <Sun size={24} />,
      onClick: () => onNavigate('strength'),
    },
    {
      id: 'ask_question',
      titleEn: 'Prashna / Ask a Question',
      titleHi: 'प्रश्न कुंडली (ताजिक व KP 1–249)',
      descEn: 'Horary chart for urgent life queries',
      descHi: 'तत्काल प्रश्न हेतु हाँ-नहीं व ताजिक विचार',
      tone: 'indigo',
      icon: <HelpCircle size={24} />,
      onClick: () => onNavigate('prashna'),
    },
    {
      id: 'bhavesha_144',
      titleEn: '144 Bhavesha Matrix',
      titleHi: '144 भावेश स्थिति (स्वामी फलादेश)',
      descEn: 'Every house lord in each of 12 houses',
      descHi: '12 भावों के स्वामी 12 भावों में संपूर्ण फल',
      tone: 'indigo',
      icon: <Layers size={24} />,
      onClick: () => onNavigate('predictions', 'bhavesha144'),
    },
    {
      id: 'gemstones',
      titleEn: 'Gemstones & Rudraksha',
      titleHi: 'रत्न व रुद्राक्ष परामर्श',
      descEn: 'Life, Lucky & Bhagya Ratna selector',
      descHi: 'जीवन रत्न, भाग्य रत्न व धारण विधि',
      tone: 'good',
      icon: <Gem size={24} />,
      onClick: () => onNavigate('astro_tools', 'gems_rudraksha'),
    },
    {
      id: 'brihat_kundli',
      titleEn: 'Brihat Kundli PDF',
      titleHi: 'बृहत् कुंडली प्रिंट / PDF',
      descEn: 'Printable multi-page full Vedic booklet',
      descHi: 'प्रिंट करने योग्य संपूर्ण जन्मपत्रिका पुस्तिका',
      tone: 'accent',
      icon: <FileText size={24} />,
      onClick: onOpenBooklet,
    },
    {
      id: 'varshaphal',
      titleEn: 'Year Analysis (Varshaphal)',
      titleHi: 'वार्षिक वर्षफल व ताजिक',
      descEn: 'Tajika annual chart & Mudda Dasha',
      descHi: 'सौर वर्ष कुंडली, मुंथा व मुद्द दशा',
      tone: 'indigo',
      icon: <Calendar size={24} />,
      onClick: () => onNavigate('predictions', 'branchesNumerology', 'varshaphala_jaimini'),
    },
    {
      id: 'daily_rashifal',
      titleEn: 'My Day Today (Rashifal)',
      titleHi: 'दैनिक राशिफल व ताराबल',
      descEn: 'Daily Moon transit & Chandrabala forecast',
      descHi: 'चंद्रबल, ताराबल व दैनिक फल',
      tone: 'good',
      icon: <Star size={24} />,
      onClick: () => onNavigate('astro_tools', 'rashifal'),
    },
    {
      id: 'dasha_phal',
      titleEn: 'Dasha Phal Analysis',
      titleHi: 'दशा फल (विंशोत्तरी व योगिनी)',
      descEn: '5-level Vimshottari, Yogini & Char Dasha',
      descHi: 'सूक्ष्म व प्राण स्तर तक संपूर्ण दशा फल',
      tone: 'accent',
      icon: <Clock size={24} />,
      onClick: () => onNavigate('dasha', 'vimshottari'),
    },
    {
      id: 'yuti_conjunctions',
      titleEn: 'Yuti Conjunctions (2–7)',
      titleHi: 'ग्रह युति फलादेश (2 से 7 ग्रह)',
      descEn: 'Multi-planet conjunctions & event alerts',
      descHi: 'द्विग्रही से सप्तग्रही युति एवं घटना संकेत',
      tone: 'indigo',
      icon: <Sliders size={24} />,
      onClick: () => onNavigate('predictions', 'yuti'),
    },
    {
      id: 'career_love',
      titleEn: 'Career, Wealth & Marriage',
      titleHi: 'करियर, धन, विवाह व चिकित्सा',
      descEn: 'Specialized Vedic branch reports',
      descHi: 'वित्त, नौकरी/व्यापार, विवाह व रोग शाखाएँ',
      tone: 'good',
      icon: <Briefcase size={24} />,
      onClick: () => onNavigate('branches', 'career'),
    },
    {
      id: 'kp_system',
      titleEn: 'KP System & Sub-Lords',
      titleHi: 'कृष्णमूर्ति पद्धति (KP) व RP',
      descEn: 'Cuspal Sub-Lords, Significators & RP',
      descHi: 'उप-स्वामी, भाव कारक व तात्कालिक RP',
      tone: 'accent',
      icon: <Activity size={24} />,
      onClick: () => onNavigate('predictions', 'branchesNumerology', 'kp'),
    },
    {
      id: 'bhavat_drishti',
      titleEn: 'Bhavat Bhavam & Drishti',
      titleHi: 'भावात् भावम् व दृष्टि फलादेश',
      descEn: 'Derivative house strength & aspect rays',
      descHi: 'भाव से भाव बल व पूर्ण/पाद दृष्टि फल',
      tone: 'indigo',
      icon: <Compass size={24} />,
      onClick: () => onNavigate('predictions', 'bhavatBhavam'),
    },
    {
      id: 'numerology',
      titleEn: 'Numerology (Lo Shu Grid)',
      titleHi: 'अंक ज्योतिष व लो शु ग्रिड',
      descEn: 'Mulank, Bhagyank, Kua & Name vibration',
      descHi: 'मूलांक, भाग्यांक, कुआ व नाम अंक विश्लेषण',
      tone: 'good',
      icon: <Grid3x3 size={24} />,
      onClick: () => onNavigate('astro_tools', 'numerology'),
    },
    {
      id: 'baby_names',
      titleEn: 'Baby Names & Nakshatra',
      titleHi: 'नामकरण अक्षर व शिशु नाम',
      descEn: 'Avakahada letters, Rashi & Pada names',
      descHi: 'जन्म नक्षत्र चरण अनुसार शुभ नाम व अक्षर',
      tone: 'accent',
      icon: <Baby size={24} />,
      onClick: () => onNavigate('astro_tools', 'baby_names'),
    },
  ];

  const calcDirectory: DirLink[] = [
    { labelEn: 'Basic Details & Panchang', labelHi: 'जन्म विवरण व पंचांग', onClick: () => onNavigate('basics', 'planets') },
    { labelEn: 'Planetary Degrees & Positions', labelHi: 'ग्रह स्थिति एवं अंश तालिका', onClick: () => onNavigate('basics', 'planets') },
    { labelEn: 'Lagna & Navamsha (D9) Charts', labelHi: 'लग्न व नवांश कुंडली', onClick: () => onNavigate('vargas', 'D9') },
    { labelEn: 'Bhava Chalit Table & Chart', labelHi: 'भाव चलित चक्र व तालिका', onClick: () => onNavigate('basics', 'chalit') },
    { labelEn: 'Avakahada & Ghatak Chakra', labelHi: 'अवकहड़ा व घातक चक्र', onClick: () => onNavigate('basics', 'avakahada') },
    { labelEn: 'Prastarashtakavarga Table (8×12)', labelHi: 'प्रस्ताराष्टकवर्ग तालिका (8×12)', onClick: () => onNavigate('ashtakavarga', 'prastara') },
    { labelEn: 'Sarva & Bhinna Ashtakavarga', labelHi: 'सर्वाष्टकवर्ग व भिन्नाष्टक', onClick: () => onNavigate('ashtakavarga', 'raw') },
    { labelEn: 'Shodashvarga Charts (D1–D60)', labelHi: 'षोडशवर्ग कुंडलियाँ (D1–D60)', onClick: () => onNavigate('vargas', 'D10') },
    { labelEn: 'Shadbala & Panchadha Maitri', labelHi: 'षड्बल व पंचधा मैत्री', onClick: () => onNavigate('strength') },
    { labelEn: 'Planets in Signs Analysis', labelHi: 'ग्रह-राशि फलादेश', onClick: () => onNavigate('predictions', 'planetInSign') },
    { labelEn: 'Planets in Nakshatras & Pada', labelHi: 'ग्रह-नक्षत्र व चरण फल', onClick: () => onNavigate('predictions', 'planetInNakshatra') },
    { labelEn: 'Degree-Wise Ansha & Avasthas', labelHi: 'अंश बल व बाल/मृत अवस्था', onClick: () => onNavigate('predictions', 'degreeWise') },
    { labelEn: 'House-Wise H1–H12 Predictions', labelHi: 'द्वादश भाव (1–12) फल', onClick: () => onNavigate('predictions', 'houseWise') },
    { labelEn: 'Planetary Aspects (Drishti Wise)', labelHi: 'ग्रह दृष्टि एवं भाव प्रभाव', onClick: () => onNavigate('predictions', 'drishtiWise') },
    { labelEn: 'Birth Time Rectification (BTR)', labelHi: 'जन्म समय संशोधन (BTR)', onClick: () => onNavigate('tools', 'btr') },
    { labelEn: 'Auspicious Muhurta & 10-Yr Calendar', labelHi: 'शुभ मुहूर्त व 10-वर्ष पंचांग', onClick: () => onNavigate('tools', 'muhurta') },
  ];

  const dashaLinks: DirLink[] = [
    { labelEn: 'Vimshottari Dasha (5 Levels)', labelHi: 'विंशोत्तरी दशा (5 स्तर)', onClick: () => onNavigate('dasha', 'vimshottari') },
    { labelEn: 'Yogini Dasha Timeline', labelHi: 'योगिनी दशा फल व अवधि', onClick: () => onNavigate('dasha', 'yogini') },
    { labelEn: 'Ashtottari Dasha System', labelHi: 'अष्टोत्तरी दशा', onClick: () => onNavigate('dasha', 'ashtottari') },
    { labelEn: 'Narayana / Rashi Dasha', labelHi: 'नारायण व चर दशा', onClick: () => onNavigate('dasha', 'narayana') },
    { labelEn: 'Sudarshana Chakra Progression', labelHi: 'सुदर्शन चक्र वार्षिक गोचर', onClick: () => onNavigate('dasha', 'sudarshana') },
    { labelEn: 'Current Dasha Impact Forecast', labelHi: 'सक्रिय दशा फलादेश', onClick: () => onNavigate('predictions', 'dashaWise') },
    { labelEn: 'Live Transit Gochar & Sade Sati', labelHi: 'आज का गोचर व साढ़ेसाती', onClick: () => onNavigate('predictions', 'gocharWise') },
  ];

  const lalKitabBranchLinks: DirLink[] = [
    { labelEn: 'Lal Kitab Tewa & House Debt (Rin)', labelHi: 'लाल किताब टेवा व ऋण विचार', onClick: () => onNavigate('predictions', 'branchesNumerology', 'lal_kitab') },
    { labelEn: 'Lal Kitab Varshaphal & Remedies', labelHi: 'लाल किताब वर्षफल व उपाय', onClick: () => onNavigate('predictions', 'branchesNumerology', 'lal_kitab') },
    { labelEn: 'Sade Sati, Kaalsarp & Dosha Remedies', labelHi: 'साढ़ेसाती, कालसर्प व दोष शांति', onClick: () => onNavigate('predictions', 'branchesNumerology', 'doshas_remedies') },
    { labelEn: 'Finance, Wealth & Dhan Yogas', labelHi: 'धन, व्यापार व संपत्ति शाखा', onClick: () => onNavigate('branches', 'financial') },
    { labelEn: 'Career, Govt vs Private Job Analysis', labelHi: 'करियर, सरकारी व निजी नौकरी', onClick: () => onNavigate('branches', 'career') },
    { labelEn: 'Marriage, Spouse & Child Yoga', labelHi: 'विवाह, जीवनसाथी व संतान शाखा', onClick: () => onNavigate('branches', 'marriage') },
    { labelEn: 'Medical Astrology & Health Longevity', labelHi: 'स्वास्थ्य, आयु व रोग निदान', onClick: () => onNavigate('branches', 'medical') },
  ];

  const kpNadiLinks: DirLink[] = [
    { labelEn: 'KP System Cusps & Significators', labelHi: 'KP भाव व उप-स्वामी कारक', onClick: () => onNavigate('predictions', 'branchesNumerology', 'kp') },
    { labelEn: 'Live KP Ruling Planets', labelHi: 'तात्कालिक KP रूलिंग प्लैनेट्स', onClick: () => onNavigate('predictions', 'branchesNumerology', 'kp') },
    { labelEn: 'KP Horary 1–249 Prashna', labelHi: 'KP प्रश्न संख्या (1–249)', onClick: () => onNavigate('prashna') },
    { labelEn: 'Bhrigu Nandi Nadi Combinations', labelHi: 'भृगु नंदी नाड़ी विशेष फल', onClick: () => onNavigate('predictions', 'bhriguNadi') },
    { labelEn: '1000+ Empirical Rules & SA MEP Orbs', labelHi: '1000+ उन्नत सूत्र व सिस्टम MEP', onClick: () => onNavigate('predictions', 'advancedTechniques') },
    { labelEn: '144 House-Lord-in-House Matrix', labelHi: '144 भावेश स्थिति तालिका', onClick: () => onNavigate('predictions', 'bhavesha144') },
    { labelEn: 'Avasthas & Upagrahas (Gulika/Mandi)', labelHi: 'ग्रह अवस्था व उपग्रह चक्र', onClick: () => onNavigate('tools', 'avasthas') },
    { labelEn: 'Pancha Pakshi Shastra (5-Bird Biorhythm)', labelHi: 'पंच पक्षी शास्त्र (दैनिक याम)', onClick: () => onNavigate('tools', 'panchapakshi') },
    { labelEn: 'Samvatsara, Amanta/Purnimanta & Shoola', labelHi: 'संवत्सर, अमांत/पूर्णिमांत व दिशाशूल', onClick: () => onNavigate('tools', 'deep_panchang') },
    { labelEn: 'Gochara Kakshas (3°45\' Precision Transit)', labelHi: 'गोचर कक्ष्या व अष्टकवर्ग योग', onClick: () => onNavigate('transits') },
    { labelEn: '10-Year Eclipse & Transit Calendar', labelHi: '10-वर्षीय ग्रहण व पंचांग तालिका', onClick: () => onNavigate('tools', 'calendar') },
  ];

  return (
    <div className="view-stack">
      {/* Compact Chart Highlight Ribbon */}
      <div className="ws-hero-strip">
        <div className="ws-hero-meta">
          <strong>{chart.input.name}</strong>
          <span className="muted">
            · {trSign(chart.ascendant.signIndex, lang)} {isHi ? 'लग्न' : 'Lagna'} ({chart.ascendant.shortDms})
            {' · '}
            {trSign(moonSignIndex, lang)} {isHi ? 'राशि' : 'Rashi'}
            {' · '}
            {trTerm(chart.panchang.nakshatra.name, lang)} {isHi ? 'चरण ' : 'P'}
            {chart.panchang.nakshatra.pada}
            {' · '}
            <span className="mono">{formatDateDmy(chart.input.date)} {chart.input.time}</span> · {chart.input.city}
          </span>
        </div>
        <div className="ws-hero-actions">
          <button type="button" className="btn btn-secondary btn-sm" onClick={onOpenEditor}>
            <Edit3 size={13} />
            <span>{isHi ? 'विवरण बदलें' : 'Edit Birth Data'}</span>
          </button>
          {canDeleteProfile && onDeleteProfile && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ color: 'var(--bad)' }}
              onClick={onDeleteProfile}
              title={isHi ? 'वर्तमान प्रोफ़ाइल हटाएँ' : 'Delete Active Profile'}
            >
              <Trash2 size={13} />
              <span>{isHi ? 'हटाएँ' : 'Delete'}</span>
            </button>
          )}
          <button type="button" className="btn btn-primary btn-sm" onClick={() => onNavigate('basics', 'planets')}>
            <Sparkles size={13} />
            <span>{isHi ? 'कुंडली खोलें' : 'Open Chart'}</span>
          </button>
        </div>
      </div>

      {paramayus.exceeded && <ParamayusLockBanner status={paramayus} />}

      {/* Clean 3-Column Visual Feature Grid */}
      <section className="ws-card-grid" aria-label={isHi ? 'मुख्य ज्योतिष अनुभाग' : 'Astrology Modules Hub'}>
        {cards.map((card) => (
          <button
            key={card.id}
            type="button"
            className="ws-card"
            onClick={card.onClick}
          >
            <h4 className="ws-card-title">{isHi ? card.titleHi : card.titleEn}</h4>
            <div className={`ws-card-icon tone-${card.tone ?? 'accent'}`}>{card.icon}</div>
            <p className="ws-card-desc">{isHi ? card.descHi : card.descEn}</p>
          </button>
        ))}
      </section>

      {/* 2-Column Calculations Directory */}
      <section className="ws-dir-panel">
        <div className="ws-dir-header">
          <span>
            {isHi
              ? 'गणना व चार्ट निर्देशिका — किसी भी तालिका पर सीधे जाएँ'
              : 'Calculations & Tables Directory — Direct Access'}
          </span>
        </div>
        <div className="ws-dir-grid-2">
          {calcDirectory.map((item, idx) => (
            <button key={idx} type="button" className="ws-dir-link" onClick={item.onClick}>
              <span className="ws-dir-bullet" aria-hidden="true">
                <ChevronRight size={12} />
              </span>
              <span>{isHi ? item.labelHi : item.labelEn}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 3-Column Bottom Specialist Directories */}
      <section className="ws-triple-dirs">
        <div className="ws-dir-panel">
          <div className="ws-dir-header">
            <span>{isHi ? 'दशा एवं गोचर' : 'Dasha & Gochar'}</span>
          </div>
          <div className="ws-dir-stack">
            {dashaLinks.map((item, idx) => (
              <button key={idx} type="button" className="ws-dir-link" onClick={item.onClick}>
                <span className="ws-dir-bullet" aria-hidden="true">
                  <ChevronRight size={12} />
                </span>
                <span>{isHi ? item.labelHi : item.labelEn}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="ws-dir-panel">
          <div className="ws-dir-header">
            <span>{isHi ? 'लाल किताब व शाखाएँ' : 'Lal Kitab & Branches'}</span>
          </div>
          <div className="ws-dir-stack">
            {lalKitabBranchLinks.map((item, idx) => (
              <button key={idx} type="button" className="ws-dir-link" onClick={item.onClick}>
                <span className="ws-dir-bullet" aria-hidden="true">
                  <ChevronRight size={12} />
                </span>
                <span>{isHi ? item.labelHi : item.labelEn}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="ws-dir-panel">
          <div className="ws-dir-header">
            <span>{isHi ? 'KP पध्दति, नाड़ी व उपकरण' : 'KP System, Nadi & Tools'}</span>
          </div>
          <div className="ws-dir-stack">
            {kpNadiLinks.map((item, idx) => (
              <button key={idx} type="button" className="ws-dir-link" onClick={item.onClick}>
                <span className="ws-dir-bullet" aria-hidden="true">
                  <ChevronRight size={12} />
                </span>
                <span>{isHi ? item.labelHi : item.labelEn}</span>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
