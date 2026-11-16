import React, { useEffect, useMemo, useState } from 'react';
import {
  Award,
  BookOpen,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Compass,
  Edit3,
  ExternalLink,
  Eye,
  FileText,
  Flame,
  Grid,
  Heart,
  HelpCircle,
  Layers,
  MapPin,
  Maximize2,
  Minimize2,
  Moon,
  RefreshCw,
  RotateCcw,
  Scroll,
  Search,
  Share2,
  Shield,
  ShieldAlert,
  Sparkles,
  Star,
  Sun,
  TrendingUp,
  User,
  UserCheck,
  Users,
  Zap,
} from 'lucide-react';

import { computeAvakahadaChakra, computeBhavaChalitPlacements, computeGhatakChakra } from '../astro/avakahadaChalit';
import { computeAvasthasAndUpagrahas } from '../astro/avasthasUpagrahas';
import { calculateChart } from '../astro/calculator';
import { DIVISIONAL_META, NAKSHATRAS, NINE_GRAHAS, PLANET_SANSKRIT, SEVEN_PLANETS, SIGNS } from '../astro/constants';
import { computeBasicDetailsSheet, HIGHER_VARGA_META, type BasicDetailRow } from '../astro/higherVargas';
import { computeKpReport, computeLiveKpRulingPlanets, type KpRulingPlanets } from '../astro/kp';
import { computeLalKitabSystemReport } from '../astro/predictions/lalKitabSystem';
import { computeKundaliDoshas } from '../astro/predictions/familyDoshas';
import { computePastFutureLifeReading } from '../astro/predictions/pastFutureLife';
import { computeChartYutiReport } from '../astro/predictions/yutiPredictions';
import { computeGemstoneAndRudraksha } from '../astro/rashifalBabyRudraksha';
import {
  computeKotaChakra,
  computeKurmaChakra,
  computeSarvatobhadraChakra,
  computeSudarshanChakra,
} from '../astro/specialChakras';
import { computePushkaraAnalysis } from '../astro/specialSensitivities';
import { formatDateDmy, formatDms } from '../astro/time';
import type {
  BirthInput,
  CalcSettings,
  ChartData,
  ChartStyle,
  DivisionalChartId,
  NineGrahaId,
  PlanetId,
  SevenPlanetId,
} from '../astro/types';
import { computeVarshaphala } from '../astro/varshaphala';
import { useLanguage } from '../i18n/LanguageContext';
import { trPlanet, trPlanetShort, trSign, trTerm, type AppLanguage } from '../i18n/translations';
import { DEFAULT_SETTINGS } from '../data/cities';
import {
  ALL_VARGA_PAGE_IDS,
  computeCompleteVargaPageData,
  type CompleteVargaPageData,
} from '../astro/predictions/vargaPredictionsEngine';
import { computeDeepGochar, type DeepGocharReport } from '../astro/predictions/gocharDeep';
import { predictDashaDetail } from '../astro/predictions/dashaPrashna';
import { AshtakavargaView } from './AshtakavargaView';
import { DashaView } from './DashaView';
import { MatchMakingView } from './MatchMakingView';
import { ToolsSuiteView } from './ToolsSuiteView';
import { VedicChartSvg, type ChartBadgeItem } from './VedicChartSvg';

export interface VedicMasterWorkstationProps {
  chart: ChartData;
  chartStyle: ChartStyle;
  onChangeChartStyle?: (style: ChartStyle) => void;
  settings?: CalcSettings;
  profiles: BirthInput[];
  activeProfileId: string;
  onSelectProfile: (id: string) => void;
  onOpenEditor?: () => void;
  onOpenBooklet?: () => void;
  onOpenMatchMaking?: () => void;
  requestedMenu?: { id?: string; nonce: number };
}

function nowDateAndTime(): { date: string; time: string } {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return {
    date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
    time: `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`,
  };
}

export interface WorkstationPageDefinition {
  pageNumber: number;
  id: string;
  vargaId?: string;
  labelEn: string;
  labelHi: string;
  icon: string;
  badge?: string;
  category: 'basics' | 'vargas' | 'gochar' | 'dasha' | 'chakras' | 'annual' | 'systems' | 'matchmaking' | 'remedies' | 'panchang';
}

export const WORKSTATION_PAGES: WorkstationPageDefinition[] = [
  { pageNumber: 1, id: 'sarini', labelEn: '1. Basic Details & Avakhada Sheet', labelHi: '1. ज्योतिष सारिणी व मूल विवरण', icon: '📋', category: 'basics' },
  { pageNumber: 2, id: 'd1', vargaId: 'D1', labelEn: '2. D-1 Lagna (Lagna + Strength + Yuti + Yoga + Dasha + Gochar + Predictions)', labelHi: '2. D-1 लग्न कुंडली (लग्न + बल + युति + योग + दशा + गोचर + फलकथन)', icon: '🏛️', category: 'vargas', badge: 'D1' },
  { pageNumber: 3, id: 'd2', vargaId: 'D2', labelEn: '3. D-2 Hora (Wealth & Sustenance)', labelHi: '3. D-2 होरा (धन, संचित कोष व भरण-पोषण)', icon: '💰', category: 'vargas', badge: 'D2' },
  { pageNumber: 4, id: 'd3', vargaId: 'D3', labelEn: '4. D-3 Drekkana (Siblings, Courage & Only Child)', labelHi: '4. D-3 द्रेष्काण (भाई-बहन, पराक्रम व एकल संतान परीक्षा)', icon: '🛡️', category: 'vargas', badge: 'D3' },
  { pageNumber: 5, id: 'd4', vargaId: 'D4', labelEn: '5. D-4 Chaturthamsha (Property, Home & Fortune)', labelHi: '5. D-4 चतुर्मांश (भूमि, भवन, अचल संपत्ति व भाग्य)', icon: '🏡', category: 'vargas', badge: 'D4' },
  { pageNumber: 6, id: 'd5', vargaId: 'D5', labelEn: '6. D-5 Panchamsha (Fame, Authority & Merit)', labelHi: '6. D-5 पंचमांश (ख्याति, अधिकार, सत्ता व पूर्व-पुण्य)', icon: '👑', category: 'vargas', badge: 'D5' },
  { pageNumber: 7, id: 'd6', vargaId: 'D6', labelEn: '7. D-6 Shashthamsha (Health, Enemies & Litigation)', labelHi: '7. D-6 षष्ठांश (स्वास्थ्य, रोग, शत्रु-विनाश व मुकदमेबाजी)', icon: '⚔️', category: 'vargas', badge: 'D6' },
  { pageNumber: 8, id: 'd7', vargaId: 'D7', labelEn: '8. D-7 Saptamsha (Children, Progeny vs Childless)', labelHi: '8. D-7 सप्तमांश (संतान, कुल वृद्धि व निःसंतानता विश्लेषण)', icon: '👶', category: 'vargas', badge: 'D7' },
  { pageNumber: 9, id: 'd8', vargaId: 'D8', labelEn: '9. D-8 Ashtamsha (Longevity, Transformations & Crises)', labelHi: '9. D-8 अष्टमांश (आयु, आकस्मिक परिवर्तन व गूढ़ संकट)', icon: '⏳', category: 'vargas', badge: 'D8' },
  { pageNumber: 10, id: 'd9', vargaId: 'D9', labelEn: '10. D-9 Navamsha (Spouse, Marriage, Dharma & Bhagya)', labelHi: '10. D-9 नवांश (जीवनसाथी, विवाह बनाम ब्रह्मचर्य, धर्म व भाग्य)', icon: '💍', category: 'vargas', badge: 'D9' },
  { pageNumber: 11, id: 'd10', vargaId: 'D10', labelEn: '11. D-10 Dashamsha (Career, Govt Job vs Business & Status)', labelHi: '11. D-10 दशमांश (करियर, सरकारी नौकरी बनाम व्यापार व प्रतिष्ठा)', icon: '💼', category: 'vargas', badge: 'D10' },
  { pageNumber: 12, id: 'd11', vargaId: 'D11', labelEn: '12. D-11 Rudramsha (Wealth Influx & Overcoming Rivals)', labelHi: '12. D-11 एकादशांश (धन लाभ, सम्मान व प्रतिद्वंद्वियों पर विजय)', icon: '💎', category: 'vargas', badge: 'D11' },
  { pageNumber: 13, id: 'd12', vargaId: 'D12', labelEn: '13. D-12 Dwadashamsha (Parents, Paternal Lineage & Roots)', labelHi: '13. D-12 द्वादशांश (माता-पिता, पैतृक संस्कार व कुल ऋण)', icon: '👨‍👩‍👧', category: 'vargas', badge: 'D12' },
  { pageNumber: 14, id: 'd16', vargaId: 'D16', labelEn: '14. D-16 Shodashamsha (Vehicles, Luxuries & Happiness)', labelHi: '14. D-16 षोडशांश (वाहन, सुख-साधन, सड़क सुरक्षा व शांति)', icon: '🚗', category: 'vargas', badge: 'D16' },
  { pageNumber: 15, id: 'd20', vargaId: 'D20', labelEn: '15. D-20 Vimshamsha (Spiritual Sadhana, Devotion & Moksha)', labelHi: '15. D-20 विंशांश (उपासना, इष्ट देव, मंत्र साधना व मोक्ष)', icon: '🧘', category: 'vargas', badge: 'D20' },
  { pageNumber: 16, id: 'd24', vargaId: 'D24', labelEn: '16. D-24 Siddhamsa (Higher Learning, Education & Intellect)', labelHi: '16. D-24 चतुर्विंशांश (उच्च शिक्षा, विद्या, बौद्धिक दक्षता व शोध)', icon: '📚', category: 'vargas', badge: 'D24' },
  { pageNumber: 17, id: 'd27', vargaId: 'D27', labelEn: '17. D-27 Bhamsa (Physical Stamina & Vital Endurance)', labelHi: '17. D-27 सप्तविंशांश (शारीरिक बल, सहनशक्ति व गुप्त दुर्बलताएं)', icon: '⚡', category: 'vargas', badge: 'D27' },
  { pageNumber: 18, id: 'd30', vargaId: 'D30', labelEn: '18. D-30 Trimshamsha (Arishta, Misfortunes & Evils)', labelHi: '18. D-30 त्रिंशांश (अरिष्ट, पाप कर्म, व्यसन व संकट निवारण)', icon: '⚠️', category: 'vargas', badge: 'D30' },
  { pageNumber: 19, id: 'd40', vargaId: 'D40', labelEn: '19. D-40 Khavedamsha (Maternal Heritage & Auspicious Karma)', labelHi: '19. D-40 खवेदांश (मातृ कुल, सुसंस्कार व अंतर्मन शुद्धि)', icon: '🌸', category: 'vargas', badge: 'D40' },
  { pageNumber: 20, id: 'd45', vargaId: 'D45', labelEn: '20. D-45 Akshavedamsha (Paternal Lineage & Moral Ethics)', labelHi: '20. D-45 अक्षवेदांश (पितृ कुल, आचरण व नैतिक चरित्र)', icon: '⚖️', category: 'vargas', badge: 'D45' },
  { pageNumber: 21, id: 'd60', vargaId: 'D60', labelEn: '21. D-60 Shashtiamsha (Past-Life Karma & Root Destiny)', labelHi: '21. D-60 षष्ट्यंश (संचित पूर्व जन्म कर्म व प्रारब्ध)', icon: '🌌', category: 'vargas', badge: 'D60' },
  { pageNumber: 22, id: 'd64', vargaId: 'D64', labelEn: '22. D-64 Chatushshashtiamsha (64th Khara Navamsha & Crises)', labelHi: '22. D-64 चतुःषष्ट्यंश (64वां खर नवांश व आयुष्य संकट)', icon: '🛡️', category: 'vargas', badge: 'D64' },
  { pageNumber: 23, id: 'd72', vargaId: 'D72', labelEn: '23. D-72 Ashta-Navamsha (Crisis Endurance & Transformation)', labelHi: '23. D-72 अष्ट-नवांश (आकस्मिक परिवर्तन व सहनशक्ति)', icon: '🔄', category: 'vargas', badge: 'D72' },
  { pageNumber: 24, id: 'd81', vargaId: 'D81', labelEn: '24. D-81 Nava-Navamsha (Subtlest Dharma & Marital Soul-Bond)', labelHi: '24. D-81 नव-नवांश (सूक्ष्म धर्म व आत्मिक दांपत्य)', icon: '🌟', category: 'vargas', badge: 'D81' },
  { pageNumber: 25, id: 'd108', vargaId: 'D108', labelEn: '25. D-108 Ashtottaramsha (108 Padas Total Soul Blueprint)', labelHi: '25. D-108 अष्टोत्तरांश (108 पाद संपूर्ण आत्मिक प्रारब्ध)', icon: '📜', category: 'vargas', badge: 'D108' },
  { pageNumber: 26, id: 'd144', vargaId: 'D144', labelEn: '26. D-144 Dwadasa-Dwadasamsha (Deepest Pitra Lineage)', labelHi: '26. D-144 द्वादश-द्वादशांश (अति-गहन पितृ-वंश कुल कर्म)', icon: '🌿', category: 'vargas', badge: 'D144' },
  { pageNumber: 27, id: 'd150', vargaId: 'D150', labelEn: '27. D-150 Chandra-Kala Nadiamsha (Twin Destiny Blueprint)', labelHi: '27. D-150 चंद्रकला नाड़ीअंश (सूक्ष्मतम नाड़ीअंश प्रारब्ध)', icon: '🧬', category: 'vargas', badge: 'D150' },
  { pageNumber: 28, id: 'd300', vargaId: 'D300', labelEn: '28. D-300 Ardha-Nadiamsha (Hyper-fine BTR & Split ~24s)', labelHi: '28. D-300 अर्ध-नाड़ीअंश (अति-सूक्ष्म जन्म समय संशोधन)', icon: '⏱️', category: 'vargas', badge: 'D300' },
  { pageNumber: 29, id: 'd360', vargaId: 'D360', labelEn: '29. D-360 Bhagamsha-Kala (4,320 Micro Segments ~20s)', labelHi: '29. D-360 भागांश-कला (4,320 सूक्ष्म चक्र भाग परम प्रारब्ध)', icon: '☸️', category: 'vargas', badge: 'D360' },
  { pageNumber: 30, id: 'gochar', labelEn: '30. Live Gochar Calculation & Predictions', labelHi: '30. गोचर गणना व संपूर्ण फलकथन (साढ़ेसाती व ग्रह गोचर)', icon: '🪐', category: 'gochar' },
  { pageNumber: 31, id: 'dasha', labelEn: '31. Multi-Level Dasha Calculation & Predictions', labelHi: '31. दशा 4-स्तरीय गणना व फलकथन (विंशोत्तरी 4 स्तर व योगिनी)', icon: '⏳', category: 'dasha' },
  { pageNumber: 32, id: 'chakras', labelEn: '32. Vedic Chakras Calculation & Predictions', labelHi: '32. विविध वैदिक चक्र व फलकथन (सुदर्शन, कोटा, कूर्म, सर्वतोभद्र)', icon: '☸️', category: 'chakras' },
  { pageNumber: 33, id: 'varshphal', labelEn: '33. Annual Varshphal & Tajika Sahams', labelHi: '33. वर्षफल / ताजिक वार्षिक (मुन्था, वर्षेश, सहम व फलकथन)', icon: '☀️', category: 'annual' },
  { pageNumber: 34, id: 'kp_system', labelEn: '34. KP Krishnamurti Paddhati (Sub-Lords)', labelHi: '34. के.पी. (KP) ज्योतिष प्रणाली (कस्प व 4-चरण कारक)', icon: '🎯', category: 'systems', badge: 'KP' },
  { pageNumber: 35, id: 'lal_kitab', labelEn: '35. Lal Kitab System (Debts & Upay)', labelHi: '35. लाल किताब प्रणाली (टेवा, सोये भाव व ऋण उपाय)', icon: '📕', category: 'systems', badge: 'LK' },
  { pageNumber: 36, id: 'matchmaking', labelEn: '36. Kundali Match Making (36 Gunas)', labelHi: '36. कुंडली मिलान (36 गुण अष्टकूट व दोष साम्य निर्णय)', icon: '💍', category: 'matchmaking' },
  { pageNumber: 37, id: 'remedies', labelEn: '37. Comprehensive Shastric Remedies', labelHi: '37. सम्पूर्ण शास्त्रीय उपाय (मंत्र, दान, स्नान व रत्न)', icon: '🕉️', category: 'remedies' },
  { pageNumber: 38, id: 'panchang', labelEn: '38. Daily Drik Panchang & Muhurta', labelHi: '38. दैनिक पंचांग व मुहूर्त (चोघड़िया, होरा, संवत्सर व पर्व)', icon: '📅', category: 'panchang' },
];

export const VedicMasterWorkstation: React.FC<VedicMasterWorkstationProps> = ({
  chart,
  chartStyle,
  onChangeChartStyle,
  settings,
  profiles,
  activeProfileId,
  onSelectProfile,
  onOpenEditor,
  onOpenBooklet,
  onOpenMatchMaking,
  requestedMenu,
}) => {
  const { lang, t } = useLanguage();
  const isHi = lang === 'hi';
  const safeSettings = settings ?? chart.settings;

  // Active Page State (Default to Page 1: Basic Details)
  const [activePage, setActivePage] = useState<number>(1);

  // Sub-tab States for internal special pages
  const [chakrasSubTab, setChakrasSubTab] = useState<'sudarshan' | 'sarvatobhadra' | 'kota' | 'kurma'>('sudarshan');
  const [varshYear, setVarshYear] = useState<number>(() => {
    const birthYear = parseInt(chart.input.date.split('-')[0], 10);
    const curYear = new Date().getFullYear();
    return Math.max(birthYear, curYear);
  });
  const [liveRp, setLiveRp] = useState<KpRulingPlanets | null>(null);

  // External routing listener
  useEffect(() => {
    const id = requestedMenu?.id;
    if (!id) return;

    // Check if id is a page number or page alias
    const pageNum = parseInt(id, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= 38) {
      setActivePage(pageNum);
      return;
    }

    const found = WORKSTATION_PAGES.find((p) => p.id === id || p.vargaId?.toLowerCase() === id.toLowerCase());
    if (found) {
      setActivePage(found.pageNumber);
      return;
    }

    // Map legacy names
    if (id === 'sarini' || id === 'basics' || id === 'home') setActivePage(1);
    else if (id === 'd1' || id === 'charts_tables') setActivePage(2);
    else if (id === 'd2') setActivePage(3);
    else if (id === 'd3') setActivePage(4);
    else if (id === 'd4') setActivePage(5);
    else if (id === 'd7') setActivePage(8);
    else if (id === 'd9' || id === 'navamsha') setActivePage(10);
    else if (id === 'd10') setActivePage(11);
    else if (id === 'd12') setActivePage(13);
    else if (id === 'd60' || id === 'past_future') setActivePage(21);
    else if (id === 'gochar' || id === 'transits') setActivePage(30);
    else if (id === 'dasha' || id === 'dasha_transits') setActivePage(31);
    else if (id === 'chakras') setActivePage(32);
    else if (id === 'varshphal') setActivePage(33);
    else if (id === 'kp_system' || id === 'kp') setActivePage(34);
    else if (id === 'lal_kitab') setActivePage(35);
    else if (id === 'matchmaking' || id === 'match') setActivePage(36);
    else if (id === 'remedies') setActivePage(37);
    else if (id === 'panchang' || id === 'tools') setActivePage(38);
    else if (id === 'predictions') setActivePage(2); // D1 predictions
  }, [requestedMenu?.nonce, requestedMenu?.id]);

  // Live Gochar Chart Computation
  const gocharChart = useMemo(() => {
    const now = nowDateAndTime();
    return calculateChart({ ...chart.input, date: now.date, time: now.time }, safeSettings);
  }, [chart.input, safeSettings]);

  // Deep Gochar Report
  const deepGochar = useMemo(() => {
    const now = nowDateAndTime();
    return computeDeepGochar(chart, now.date);
  }, [chart]);

  // Basic Sheet, Avakhada & Ghatak computations
  const basicSheet = useMemo(() => computeBasicDetailsSheet(chart), [chart]);
  const chalitData = useMemo(() => computeBhavaChalitPlacements(chart), [chart]);

  // Active Vimshottari Dasha Hierarchy
  const activeDashaSummary = useMemo(() => {
    const nowMs = Date.now();
    const maha = chart.vimshottari.find((m) => nowMs >= m.startMs && nowMs <= m.endMs);
    const antar = maha?.children?.find((a) => nowMs >= a.startMs && nowMs <= a.endMs);
    const pratyantar = antar?.children?.find((p) => nowMs >= p.startMs && nowMs <= p.endMs);
    const sookshma = pratyantar?.children?.find((s) => nowMs >= s.startMs && nowMs <= s.endMs);
    return { maha, antar, pratyantar, sookshma };
  }, [chart.vimshottari]);

  // Special Chakras
  const sudarshanData = useMemo(() => computeSudarshanChakra(chart, varshYear), [chart, varshYear]);
  const sarvatobhadraData = useMemo(() => computeSarvatobhadraChakra(chart), [chart]);
  const kotaData = useMemo(() => computeKotaChakra(chart), [chart]);
  const kurmaData = useMemo(() => computeKurmaChakra(chart), [chart]);

  // KP & Lal Kitab
  const kpReport = useMemo(() => computeKpReport(chart), [chart]);
  const lalKitabReport = useMemo(() => computeLalKitabSystemReport(chart), [chart]);

  // Remedies & Gems
  const gemstoneData = useMemo(() => computeGemstoneAndRudraksha(chart), [chart]);

  // Active page definition
  const currentPageDef = useMemo(() => {
    return WORKSTATION_PAGES.find((p) => p.pageNumber === activePage) || WORKSTATION_PAGES[0];
  }, [activePage]);

  // Active Varga Data (if on pages 2..29)
  const currentVargaData = useMemo(() => {
    if (activePage >= 2 && activePage <= 29 && currentPageDef.vargaId) {
      return computeCompleteVargaPageData(chart, currentPageDef.vargaId, gocharChart);
    }
    return null;
  }, [activePage, currentPageDef.vargaId, chart, gocharChart]);

  const handlePrevPage = () => {
    if (activePage > 1) setActivePage(activePage - 1);
  };

  const handleNextPage = () => {
    if (activePage < 38) setActivePage(activePage + 1);
  };

  // Render Varga Page View (Pages 2 through 29)
  const renderVargaView = (data: CompleteVargaPageData) => {
    const chartBadges: ChartBadgeItem[] = [
      {
        id: 'Asc',
        label: trPlanetShort('Asc', lang),
        signIndex: data.lagnaSignIndex,
        houseNumber: 1,
        isLagna: true,
        tooltip: `${trPlanet('Asc', lang)}: ${trSign(data.lagnaSignIndex, lang)}`,
      },
      ...data.placements
        .filter((p) => p.id !== 'Asc')
        .map((p) => ({
          id: p.id,
          label: trPlanetShort(p.id, lang),
          signIndex: p.signIndex,
          houseNumber: p.houseFromLagna,
          isRetrograde: p.isRetrograde,
          isCombust: p.isCombust,
          isVargottama: p.isVargottama,
          dignity: p.dignity,
          tooltip: `${trPlanet(p.id, lang)}: ${trSign(p.signIndex, lang)} H${p.houseFromLagna} | ${trTerm(p.dignity, lang)}`,
        })),
    ];

    return (
      <div className="varga-page-container view-stack" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Banner with Varga Title & Shastric Significance */}
        <div
          className="card"
          style={{
            padding: '14px 18px',
            background: 'var(--bg-elevated)',
            borderLeft: '4px solid var(--accent)',
            borderRadius: '8px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '18px', color: 'var(--text-primary)' }}>
                {currentPageDef.icon} {isHi ? data.nameHi : data.nameEn}
              </h2>
              <p style={{ margin: '4px 0 0', fontSize: '12.5px', color: 'var(--muted)' }}>
                🎯 {isHi ? data.significationHi : data.significationEn}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="tag tag-strong mono">{data.strength.score}% {isHi ? 'सामर्थ्य' : 'Score'}</span>
              <span className="tag tag-accent">{data.sanskritName}</span>
            </div>
          </div>
        </div>

        {/* Two-Column Grid: Left Column = Chart Placement & Table; Right Column = Strength, Yuti, Yoga, Dasha, Gochar */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '20px',
            alignItems: 'start',
          }}
        >
          {/* Column A: Kundali Placement Chart SVG + Placements Table */}
          <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '15px' }}>
                🏛️ {isHi ? 'कुंडली चक्र स्थिति (Placement)' : 'Kundali Chart Placement'}
              </h3>
              {onChangeChartStyle && (
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    type="button"
                    className={`btn btn-sm ${chartStyle === 'north' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => onChangeChartStyle('north')}
                    style={{ fontSize: '11px', padding: '2px 8px' }}
                  >
                    {isHi ? 'उत्तर' : 'North'}
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${chartStyle === 'south' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => onChangeChartStyle('south')}
                    style={{ fontSize: '11px', padding: '2px 8px' }}
                  >
                    {isHi ? 'दक्षिण' : 'South'}
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${chartStyle === 'east' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => onChangeChartStyle('east')}
                    style={{ fontSize: '11px', padding: '2px 8px' }}
                  >
                    {isHi ? 'पूर्व' : 'East'}
                  </button>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <VedicChartSvg
                title={`${isHi ? data.nameHi : data.nameEn}`}
                style={chartStyle}
                lagnaSignIndex={data.lagnaSignIndex}
                items={chartBadges}
              />
            </div>

            {/* Placements Table */}
            <div style={{ overflowX: 'auto', marginTop: '6px' }}>
              <table className="compact-table" style={{ width: '100%', fontSize: '12px' }}>
                <thead>
                  <tr>
                    <th>{isHi ? 'ग्रह' : 'Body'}</th>
                    <th>{isHi ? 'राशि' : 'Sign'}</th>
                    <th>{isHi ? 'भाव' : 'House'}</th>
                    <th>{isHi ? 'अवस्था' : 'Dignity'}</th>
                    <th>{isHi ? 'विशेष' : 'Special'}</th>
                  </tr>
                </thead>
                <tbody>
                  {data.placements.map((p) => (
                    <tr key={p.id}>
                      <td style={{ fontWeight: 600 }}>{isHi ? p.nameHi : p.nameEn}</td>
                      <td>{isHi ? p.signNameHi : p.signNameEn}</td>
                      <td>H{p.houseFromLagna}</td>
                      <td>
                        <span
                          className={`tag ${
                            p.dignity === 'Exalted' || p.dignity === 'Own Sign'
                              ? 'tag-good'
                              : p.dignity === 'Debilitated'
                              ? 'tag-bad'
                              : 'tag-subtle'
                          }`}
                        >
                          {trTerm(p.dignity, lang)}
                        </span>
                      </td>
                      <td>
                        {p.isVargottama && <span className="tag tag-accent mono">वर्गोत्तम</span>}
                        {p.isRetrograde && <span className="tag tag-warn mono">व</span>}
                        {p.isCombust && <span className="tag tag-bad mono">अस्त</span>}
                        {p.specialBadge && <span className="tag tag-subtle mono">{p.specialBadge}</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Column B: Strength, Yuti, Yoga, Dasha & Gochar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* 1. Strength & Varga-Bala */}
            <div className="card" style={{ padding: '16px' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '14.5px', color: 'var(--accent)' }}>
                ⚡ {isHi ? 'वर्ग सामर्थ्य व बल विश्लेषण (Strength)' : 'Varga Strength & Bala Analysis'}
              </h3>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                <span className="tag tag-good">केंद्र में ग्रह: {data.strength.kendraCount}</span>
                <span className="tag tag-accent">त्रिकोण में ग्रह: {data.strength.trikonaCount}</span>
                {data.strength.vargottamaCount > 0 && (
                  <span className="tag tag-strong">वर्गोत्तम: {data.strength.vargottamaCount}</span>
                )}
                {data.strength.exaltedCount > 0 && (
                  <span className="tag tag-good">उच्च ग्रह: {data.strength.exaltedCount}</span>
                )}
                {data.strength.dusthanaCount > 0 && (
                  <span className="tag tag-subtle">त्रिक (6/8/12): {data.strength.dusthanaCount}</span>
                )}
              </div>
              <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
                {isHi ? data.strength.verdictHi : data.strength.verdictEn}
              </div>
            </div>

            {/* 2. Conjunctions (Yuti) */}
            <div className="card" style={{ padding: '16px' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '14.5px', color: 'var(--accent)' }}>
                🔗 {isHi ? 'इस वर्ग में बनने वाली युति (Conjunctions)' : 'Conjunctions in this Varga (Yuti)'}
              </h3>
              {data.yutis.length === 0 ? (
                <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
                  {isHi ? 'इस वर्ग में कोई बहु-ग्रह युति नहीं है।' : 'No major multi-planet conjunctions in this varga.'}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {data.yutis.map((y, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '8px 12px',
                        background: 'var(--bg-subtle)',
                        borderRadius: '6px',
                        borderLeft: `3px solid ${y.isBenefic ? 'var(--good)' : 'var(--warn)'}`,
                        fontSize: '12px',
                      }}
                    >
                      <strong style={{ color: 'var(--text-primary)' }}>{isHi ? y.nameHi : y.nameEn}</strong> (भाव {y.house})
                      <div style={{ marginTop: '2px', color: 'var(--muted)' }}>{isHi ? y.impactHi : y.impactEn}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Divisional Yogas */}
            <div className="card" style={{ padding: '16px' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '14.5px', color: 'var(--accent)' }}>
                👑 {isHi ? 'इस वर्ग के शास्त्रीय राजयोग (Varga Yogas)' : 'Classical Yogas in this Varga'}
              </h3>
              {data.yogas.length === 0 ? (
                <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
                  {isHi ? 'इस वर्ग में सामान्य योग सक्रिय हैं।' : 'Standard planetary dispositions active.'}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {data.yogas.map((yo) => (
                    <div
                      key={yo.id}
                      style={{
                        padding: '8px 12px',
                        background: 'var(--bg-subtle)',
                        borderRadius: '6px',
                        borderLeft: '3px solid var(--accent)',
                        fontSize: '12px',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ color: 'var(--accent)' }}>{isHi ? yo.nameHi : yo.nameEn}</strong>
                        <span className="tag tag-good" style={{ fontSize: '10.5px' }}>{isHi ? yo.natureHi : yo.nature}</span>
                      </div>
                      <div style={{ marginTop: '3px', color: 'var(--text-primary)' }}>{isHi ? yo.impactHi : yo.impactEn}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 4. Active Dasha Alignment */}
            <div className="card" style={{ padding: '16px' }}>
              <h3 style={{ margin: '0 0 8px', fontSize: '14.5px', color: 'var(--accent)' }}>
                ⏳ {isHi ? 'वर्तमान दशा सक्रियता (Current Dasha Alignment)' : 'Current Dasha Alignment in this Varga'}
              </h3>
              <div style={{ fontSize: '12.5px', lineHeight: 1.5, color: 'var(--text-primary)' }}>
                {isHi ? data.dashaAlignment.alignmentEffectHi : data.dashaAlignment.alignmentEffectEn}
              </div>
            </div>

            {/* 5. Live Gochar Alignment */}
            <div className="card" style={{ padding: '16px' }}>
              <h3 style={{ margin: '0 0 8px', fontSize: '14.5px', color: 'var(--accent)' }}>
                🪐 {isHi ? 'वर्तमान गोचर संचरण (Live Gochar Alignment)' : 'Live Gochar Alignment in this Varga'}
              </h3>
              <div style={{ fontSize: '12.5px', lineHeight: 1.5, color: 'var(--text-primary)' }}>
                {isHi ? data.gocharAlignment.gocharVerdictHi : data.gocharAlignment.gocharVerdictEn}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Full-Width Section: Complete Shastric Predictions for this Varga */}
        <div className="card" style={{ padding: '20px', borderLeft: '4px solid var(--good)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--good)' }}>
              🔮 {isHi ? `${data.nameHi} का संपूर्ण फलकथन (Shastric Predictions)` : `Complete Predictive Reading for ${data.nameEn}`}
            </h3>
            <span className="tag tag-accent">{data.prediction.classicalSource}</span>
          </div>

          {data.prediction.shlokaRef && (
            <div className="mono small-text" style={{ marginTop: '8px', color: 'var(--accent)', fontStyle: 'italic' }}>
              📜 {data.prediction.shlokaRef}
            </div>
          )}

          {/* Verdict */}
          <div
            style={{
              marginTop: '12px',
              padding: '10px 14px',
              background: 'var(--bg-subtle)',
              borderRadius: '6px',
              fontSize: '13.5px',
              fontWeight: 600,
              color: 'var(--text-primary)',
            }}
          >
            🎯 {isHi ? data.prediction.verdictHi : data.prediction.verdictEn}
          </div>

          {/* Detailed Shastric Analysis */}
          <div style={{ marginTop: '14px' }}>
            <strong style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
              {isHi ? 'विस्तृत शास्त्रीय विवेचन:' : 'Detailed Shastric Analysis:'}
            </strong>
            <ul style={{ margin: '8px 0 0 20px', padding: 0, fontSize: '12.5px', lineHeight: 1.6 }}>
              {(isHi ? data.prediction.detailedAnalysisHi : data.prediction.detailedAnalysisEn).map((pt, i) => (
                <li key={i} style={{ marginBottom: '4px' }}>{pt}</li>
              ))}
            </ul>
          </div>

          {/* Realistic Conditional Scenarios */}
          {data.prediction.conditionalBranchesHi.length > 0 && (
            <div
              style={{
                marginTop: '14px',
                padding: '10px 14px',
                background: 'rgba(234, 179, 8, 0.08)',
                border: '1px solid rgba(234, 179, 8, 0.25)',
                borderRadius: '6px',
              }}
            >
              <strong style={{ fontSize: '12.5px', color: 'var(--warn)' }}>
                ⚖️ {isHi ? 'यथार्थवादी परिस्थितियां व जीवन शाखाएं:' : 'Realistic Conditional Scenarios:'}
              </strong>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
                {(isHi ? data.prediction.conditionalBranchesHi : data.prediction.conditionalBranchesEn).map((br, i) => (
                  <div key={i} style={{ fontSize: '12px', lineHeight: 1.5 }}>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>• {br.condition}:</span>{' '}
                    <span className="muted">{br.outcome}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tailored Vedic Remedies */}
          {data.prediction.remediesHi.length > 0 && (
            <div style={{ marginTop: '14px' }}>
              <strong style={{ fontSize: '12.5px', color: 'var(--accent)' }}>
                🕉️ {isHi ? 'सटीक शास्त्रीय उपाय:' : 'Tailored Vedic Remedies:'}
              </strong>
              <ul style={{ margin: '6px 0 0 20px', padding: 0, fontSize: '12px', color: 'var(--muted)' }}>
                {(isHi ? data.prediction.remediesHi : data.prediction.remediesEn).map((rem, i) => (
                  <li key={i} style={{ marginBottom: '3px' }}>{rem}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="vedic-master-workstation view-stack" style={{ width: '100%', maxWidth: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* 1. MASTER WORKSTATION PAGE NAVIGATOR BAR */}
      <div
        className="card"
        style={{
          padding: '12px 18px',
          background: 'var(--bg-elevated)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          borderLeft: '4px solid var(--accent)',
          borderRadius: '10px',
        }}
      >
        {/* Left: Previous / Next & Page Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handlePrevPage}
            disabled={activePage <= 1}
            title={isHi ? 'पिछला पेज' : 'Previous Page'}
            style={{ fontWeight: 600 }}
          >
            <ChevronLeft size={16} />
            <span>{isHi ? 'पिछला पेज' : 'Prev'}</span>
          </button>

          {/* Master Page Dropdown Selector */}
          <select
            aria-label="Select Workstation Page"
            className="dropdown-master-select"
            value={activePage}
            onChange={(e) => setActivePage(parseInt(e.target.value, 10))}
            style={{ fontSize: '13px', fontWeight: 600, padding: '6px 12px', minWidth: '260px' }}
          >
            {WORKSTATION_PAGES.map((pg) => (
              <option key={pg.pageNumber} value={pg.pageNumber}>
                {pg.icon} {isHi ? pg.labelHi : pg.labelEn}
              </option>
            ))}
          </select>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleNextPage}
            disabled={activePage >= 38}
            title={isHi ? 'अगला पेज' : 'Next Page'}
            style={{ fontWeight: 600 }}
          >
            <span>{isHi ? 'अगला पेज' : 'Next'}</span>
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Right: Native Identity & Utility Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span className="mono" style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent)' }}>
            {isHi ? `पेज ${activePage} / 38` : `Page ${activePage} of 38`}
          </span>

          <span className="tag tag-accent mono">
            {chart.input.name} ({chart.input.date})
          </span>

          {onOpenEditor && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={onOpenEditor}
              style={{ fontSize: '11px', padding: '4px 8px' }}
            >
              <Edit3 size={13} />
              <span>{isHi ? 'जन्म विवरण बदलें' : 'Edit Data'}</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. DYNAMIC PAGE RENDERER ACCORDING TO USER FLOW */}

      {/* PAGE 1: EXCLUSIVELY BASIC DETAILS (मूल विवरण व ज्योतिष सारिणी) */}
      {activePage === 1 && (
        <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
            <h2 style={{ margin: 0, fontSize: '18px', color: 'var(--text-primary)' }}>
              📋 {isHi ? 'पेज 1: मूल विवरण व ज्योतिष सारिणी (Basic & Avakhada Sheet)' : 'Page 1: Basic Details & Avakhada Sheet'}
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: '12.5px', color: 'var(--muted)' }}>
              {isHi
                ? 'जातक जन्म विवरण, अवकहड़ा चक्र, घटक चक्र एवं शुभ-अशुभ अनुकूलता तालिकाएं (शुद्ध मूल विवरण)'
                : 'Native birth specifics, Avakhada Chakra, Ghatak inauspicious factors & auspicious favorable points.'}
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '20px',
            }}
          >
            {/* 1. Birth Info */}
            <div className="card" style={{ padding: '16px' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '14.5px', color: 'var(--accent)' }}>
                👤 {isHi ? 'जातक जन्म विवरण' : 'Birth Particulars'}
              </h3>
              <table className="compact-table" style={{ width: '100%', fontSize: '12px' }}>
                <tbody>
                  {basicSheet.personDetails.map((row: BasicDetailRow, idx: number) => (
                    <tr key={idx}>
                      <td className="muted" style={{ width: '45%' }}>{isHi ? row.labelHi : row.labelEn}</td>
                      <td style={{ fontWeight: 600 }}>{isHi ? row.valueHi : row.valueEn}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 2. Avakhada Chakra */}
            <div className="card" style={{ padding: '16px' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '14.5px', color: 'var(--accent)' }}>
                ☸️ {isHi ? 'अवकहड़ा चक्र विवरण' : 'Avakhada Chakra Sheet'}
              </h3>
              <table className="compact-table" style={{ width: '100%', fontSize: '12px' }}>
                <tbody>
                  {basicSheet.avakhadaDetails.map((row: BasicDetailRow, idx: number) => (
                    <tr key={idx}>
                      <td className="muted" style={{ width: '45%' }}>{isHi ? row.labelHi : row.labelEn}</td>
                      <td style={{ fontWeight: 600 }}>{isHi ? row.valueHi : row.valueEn}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 3. Ghatak Chakra */}
            <div className="card" style={{ padding: '16px' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '14.5px', color: 'var(--warn)' }}>
                ⚠️ {isHi ? 'घातक चक्र (अशुभ प्रभाव व सावधानियां)' : 'Ghatak Inauspicious Periods'}
              </h3>
              <table className="compact-table" style={{ width: '100%', fontSize: '12px' }}>
                <tbody>
                  {basicSheet.ghatakMalefics.map((row: BasicDetailRow, idx: number) => (
                    <tr key={idx}>
                      <td className="muted" style={{ width: '45%' }}>{isHi ? row.labelHi : row.labelEn}</td>
                      <td style={{ fontWeight: 600, color: 'var(--warn)' }}>{isHi ? row.valueHi : row.valueEn}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 4. Favourable Points */}
            <div className="card" style={{ padding: '16px' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '14.5px', color: 'var(--good)' }}>
                🌟 {isHi ? 'शुभ-अशुभ व अनुकूल बिंदु' : 'Auspicious & Favourable Points'}
              </h3>
              <table className="compact-table" style={{ width: '100%', fontSize: '12px' }}>
                <tbody>
                  {basicSheet.favourablePoints.map((row: BasicDetailRow, idx: number) => (
                    <tr key={idx}>
                      <td className="muted" style={{ width: '45%' }}>{isHi ? row.labelHi : row.labelEn}</td>
                      <td style={{ fontWeight: 600, color: 'var(--good)' }}>{isHi ? row.valueHi : row.valueEn}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Jump to Page 2 CTA */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setActivePage(2)}
              style={{ fontWeight: 600 }}
            >
              <span>{isHi ? 'पेज 2: D-1 लग्न कुंडली व फलकथन पर जाएं' : 'Proceed to Page 2: D-1 Lagna & Predictions'}</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* PAGES 2 THROUGH 29: VARGA CHARTS D-1 TO D-360 WITH PLACEMENT, STRENGTH, YUTI, YOGA, DASHA, GOCHAR & PREDICTIONS */}
      {activePage >= 2 && activePage <= 29 && currentVargaData && (
        renderVargaView(currentVargaData)
      )}

      {/* PAGE 30: LIVE GOCHAR CALCULATION + PREDICTIONS */}
      {activePage === 30 && (
        <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
            <h2 style={{ margin: 0, fontSize: '18px', color: 'var(--text-primary)' }}>
              🪐 {isHi ? 'पेज 30: गोचर गणना व संपूर्ण फलकथन (Live Planetary Transits & Predictions)' : 'Page 30: Live Gochar Transits & Complete Predictions'}
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: '12.5px', color: 'var(--muted)' }}>
              {isHi
                ? 'वर्तमान आकाशीय ग्रह स्थिति, जन्म चंद्र व लग्न से गोचर, कक्षी स्वामी, अष्टकवर्ग बिंदु, साढ़ेसाती, ढैय्या एवं ग्रह-वार विस्तृत फलकथन।'
                : 'Live planetary transit positions, transit houses from Moon and Lagna, Kakshya lords, SAV bindus, Sade Sati phases, and comprehensive transit readings.'}
            </p>
          </div>

          {/* Gochar Chart SVG & Transit Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
            <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h3 style={{ margin: '0 0 12px', fontSize: '14.5px' }}>
                🌌 {isHi ? 'वर्तमान गोचर चक्र (Live Transit Chart)' : 'Live Transit Chart'}
              </h3>
              <VedicChartSvg
                title={isHi ? 'गोचर चक्र (Live)' : 'Gochar (Live)'}
                style={chartStyle}
                lagnaSignIndex={gocharChart.ascendant.signIndex}
                items={[
                  { id: 'Asc', label: trPlanetShort('Asc', lang), signIndex: gocharChart.ascendant.signIndex, houseNumber: 1, isLagna: true },
                  ...gocharChart.planets.map((p) => ({
                    id: p.id,
                    label: trPlanetShort(p.id, lang),
                    signIndex: p.signIndex,
                    houseNumber: p.houseNumber,
                    isRetrograde: p.isRetrograde,
                    isCombust: p.isCombust,
                    dignity: p.dignity,
                  })),
                ]}
              />
            </div>

            {/* Double Transit Activation */}
            <div className="card" style={{ padding: '16px' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '14.5px', color: 'var(--accent)' }}>
                ⚡ {isHi ? 'द्वि-गोचर सक्रियता (Double Transit: गुरु + शनि)' : 'Double Transit (Jupiter + Saturn Resonance)'}
              </h3>
              {deepGochar.doubleTransitHouses.length === 0 ? (
                <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
                  {isHi ? 'वर्तमान में कोई प्रत्यक्ष द्वि-गोचर दृष्टि सक्रिय नहीं है।' : 'No direct double transit activation currently active.'}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {deepGochar.doubleTransitHouses.map((dt) => (
                    <div key={dt.house} style={{ padding: '8px 12px', background: 'var(--bg-subtle)', borderRadius: '6px', fontSize: '12px' }}>
                      <strong style={{ color: 'var(--accent)' }}>भाव {dt.house} ({dt.signName}):</strong> {dt.meaning}
                      <div className="muted" style={{ fontSize: '11px', marginTop: '2px' }}>
                        गुरु: {dt.jupiterLink} | शनि: {dt.saturnLink} | SAV: {dt.savBindus} बिंदु
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Planet-by-Planet Transit Predictions Table */}
          <div className="card" style={{ padding: '16px' }}>
            <h3 style={{ margin: '0 0 12px', fontSize: '15px', color: 'var(--good)' }}>
              📜 {isHi ? 'ग्रह-वार गोचर फलकथन (Planet-by-Planet Transit Readings)' : 'Planet-by-Planet Transit Predictions'}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {deepGochar.items.map((it) => (
                <div
                  key={it.planet}
                  style={{
                    padding: '10px 14px',
                    background: 'var(--bg-subtle)',
                    borderRadius: '6px',
                    borderLeft: `4px solid ${
                      it.verdict === 'Strong & Auspicious' || it.verdict === 'Auspicious'
                        ? 'var(--good)'
                        : it.verdict === 'Obstructed (Vedha)'
                        ? 'var(--warn)'
                        : 'var(--accent)'
                    }`,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <strong style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
                      {it.planet}: {it.transitSign} (चंद्र से H{it.houseFromMoon}, लग्न से H{it.houseFromLagna})
                    </strong>
                    <span className={`tag ${it.verdict.includes('Auspicious') ? 'tag-good' : 'tag-subtle'}`}>
                      {it.verdict}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', marginTop: '4px', color: 'var(--muted)' }}>
                    {it.reading}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PAGE 31: MULTI-LEVEL DASHA CALCULATION + PREDICTIONS */}
      {activePage === 31 && (
        <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
            <h2 style={{ margin: 0, fontSize: '18px', color: 'var(--text-primary)' }}>
              ⏳ {isHi ? 'पेज 31: दशा 4-स्तरीय गणना व फलकथन (Dasha Systems & Predictions)' : 'Page 31: Dasha 4-Level Calculation & Predictions'}
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: '12.5px', color: 'var(--muted)' }}>
              {isHi
                ? 'विंशोत्तरी महादशा, अंतर्दशा, प्रत्यंतर्दशा, सूक्ष्म दशा गणना एवं संयुक्त दशा फलकथन व योगिनी दशा।'
                : 'Vimshottari 4-tier Mahadasha, Antardasha, Pratyantardasha, Sookshma dasha timelines & comprehensive multi-tier predictive reading.'}
            </p>
          </div>

          {/* Active Dasha Card */}
          <div
            className="card"
            style={{
              padding: '16px',
              background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.08), rgba(99, 102, 241, 0.08))',
              border: '1px solid rgba(217, 119, 6, 0.25)',
              borderRadius: '8px',
            }}
          >
            <h3 style={{ margin: '0 0 10px', fontSize: '15px', color: 'var(--accent)' }}>
              🎯 {isHi ? 'वर्तमान सक्रिय दशा काल (Active Dasha Timeline)' : 'Current Active Dasha Hierarchy'}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
              <div style={{ padding: '8px 12px', background: 'var(--bg-elevated)', borderRadius: '6px' }}>
                <div className="muted" style={{ fontSize: '11px' }}>{isHi ? 'महादशा (MD)' : 'Mahadasha'}</div>
                <strong style={{ fontSize: '14px', color: 'var(--good)' }}>{activeDashaSummary.maha?.lord}</strong>
              </div>
              <div style={{ padding: '8px 12px', background: 'var(--bg-elevated)', borderRadius: '6px' }}>
                <div className="muted" style={{ fontSize: '11px' }}>{isHi ? 'अंतर्दशा (AD)' : 'Antardasha'}</div>
                <strong style={{ fontSize: '14px', color: 'var(--accent)' }}>{activeDashaSummary.antar?.lord}</strong>
              </div>
              <div style={{ padding: '8px 12px', background: 'var(--bg-elevated)', borderRadius: '6px' }}>
                <div className="muted" style={{ fontSize: '11px' }}>{isHi ? 'प्रत्यंतर्दशा (PD)' : 'Pratyantardasha'}</div>
                <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{activeDashaSummary.pratyantar?.lord}</strong>
              </div>
              <div style={{ padding: '8px 12px', background: 'var(--bg-elevated)', borderRadius: '6px' }}>
                <div className="muted" style={{ fontSize: '11px' }}>{isHi ? 'सूक्ष्म दशा (SD)' : 'Sookshma Dasha'}</div>
                <strong style={{ fontSize: '14px', color: 'var(--muted)' }}>{activeDashaSummary.sookshma?.lord}</strong>
              </div>
            </div>
          </div>

          {/* Dasha Suite View */}
          <DashaView chart={chart} />
        </div>
      )}

      {/* PAGE 32: VEDIC CHAKRAS CALCULATION + PREDICTIONS */}
      {activePage === 32 && (
        <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
            <h2 style={{ margin: 0, fontSize: '18px', color: 'var(--text-primary)' }}>
              ☸️ {isHi ? 'पेज 32: विविध वैदिक चक्र व फलकथन (Special Vedic Chakras & Predictions)' : 'Page 32: Special Vedic Chakras & Predictions'}
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: '12.5px', color: 'var(--muted)' }}>
              {isHi
                ? 'सुदर्शन चक्र (लग्न-सूर्य-चंद्र त्रिविध चक्र), सर्वतोभद्र चक्र (वेध विश्लेषण), कोटा चक्र (दुर्ग रक्षा) एवं कूर्म चक्र।'
                : 'Sudarshan Triple Wheel, Sarvatobhadra 81-pada Vedha grid, Kota Fortress Chakra, and Kurma geographical direction chakra.'}
            </p>
          </div>

          {/* Chakra Subtabs */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className={`btn btn-sm ${chakrasSubTab === 'sudarshan' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setChakrasSubTab('sudarshan')}
            >
              ☸️ {isHi ? 'सुदर्शन चक्र (Sudarshan)' : 'Sudarshan Chakra'}
            </button>
            <button
              type="button"
              className={`btn btn-sm ${chakrasSubTab === 'sarvatobhadra' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setChakrasSubTab('sarvatobhadra')}
            >
              ✨ {isHi ? 'सर्वतोभद्र चक्र (Sarvatobhadra)' : 'Sarvatobhadra Chakra'}
            </button>
            <button
              type="button"
              className={`btn btn-sm ${chakrasSubTab === 'kota' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setChakrasSubTab('kota')}
            >
              🏰 {isHi ? 'कोटा चक्र (Kota Chakra)' : 'Kota Chakra'}
            </button>
            <button
              type="button"
              className={`btn btn-sm ${chakrasSubTab === 'kurma' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setChakrasSubTab('kurma')}
            >
              🐢 {isHi ? 'कूर्म चक्र (Kurma Chakra)' : 'Kurma Chakra'}
            </button>
          </div>

          {/* Sudarshan Chakra Content */}
          {chakrasSubTab === 'sudarshan' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="card" style={{ padding: '16px' }}>
                <h3 style={{ margin: '0 0 10px', fontSize: '15px' }}>
                  ☸️ {isHi ? 'सुदर्शन चक्र त्रिविध तुलना (Lagna, Surya & Chandra Wheels)' : 'Sudarshan Chakra Analysis'}
                </h3>
                <div style={{ fontSize: '12.5px', color: 'var(--muted)', marginBottom: '10px' }}>
                  {isHi
                    ? `वर्तमान वर्षेश आयु वर्ष ${sudarshanData.ageYears}: सुदर्शन चक्र भाव ${sudarshanData.activeHouse} सक्रिय है (लग्न राशि ${sudarshanData.lagnaSign + 1}, चंद्र राशि ${sudarshanData.moonSign + 1}, सूर्य राशि ${sudarshanData.sunSign + 1})।`
                    : `Active Sudarshan house for age ${sudarshanData.ageYears}: House ${sudarshanData.activeHouse} is energized across Lagna, Moon and Sun.`}
                </div>
                <div style={{ padding: '10px 14px', background: 'var(--bg-subtle)', borderRadius: '6px', fontSize: '13px', fontWeight: 600 }}>
                  🎯 {isHi ? sudarshanData.annualSynthesisHi : sudarshanData.annualSynthesisEn}
                </div>
              </div>
            </div>
          )}

          {/* Kota Chakra Content */}
          {chakrasSubTab === 'kota' && (
            <div className="card" style={{ padding: '16px' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '15px' }}>
                🏰 {isHi ? 'कोटा चक्र दुर्ग रक्षा व घेराबंदी विश्लेषण (Kota Fortress Analysis)' : 'Kota Chakra Fortress Defense Analysis'}
              </h3>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '12px' }}>
                <span className="tag tag-good">कोटा स्वामी: {kotaData.kotaSwami}</span>
                <span className="tag tag-accent">कोटा पाल: {kotaData.kotaPala}</span>
                <span className="tag tag-strong">दुर्ग स्थिति: {isHi ? kotaData.defenseStrengthHi : kotaData.defenseStrengthEn}</span>
              </div>
              <p style={{ fontSize: '12.5px', lineHeight: 1.6, color: 'var(--text-primary)' }}>
                {isHi ? kotaData.analysisHi : kotaData.analysisEn}
              </p>
            </div>
          )}

          {/* Sarvatobhadra Chakra Content */}
          {chakrasSubTab === 'sarvatobhadra' && (
            <div className="card" style={{ padding: '16px' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '15px' }}>
                ✨ {isHi ? 'सर्वतोभद्र चक्र वेध विश्लेषण (Sarvatobhadra 81-Padas Grid)' : 'Sarvatobhadra Chakra 81-Padas Grid'}
              </h3>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
                <span className="tag tag-good">शुभ वेध: {sarvatobhadraData.beneficVedhaCount}</span>
                <span className="tag tag-bad">अशुभ वेध: {sarvatobhadraData.maleficVedhaCount}</span>
                <span className="tag tag-accent">जन्म नक्षत्र: {sarvatobhadraData.janmaNakshatra}</span>
              </div>
              <p style={{ fontSize: '12.5px', lineHeight: 1.6, color: 'var(--text-primary)' }}>
                {isHi ? sarvatobhadraData.summaryHi : sarvatobhadraData.summaryEn}
              </p>
            </div>
          )}

          {/* Kurma Chakra Content */}
          {chakrasSubTab === 'kurma' && (
            <div className="card" style={{ padding: '16px' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '15px' }}>
                🐢 {isHi ? 'कूर्म चक्र भौगोलिक दिशा संवेदनशीलता (Kurma Chakra)' : 'Kurma Chakra Geographical Direction Sensitivity'}
              </h3>
              <p style={{ fontSize: '12.5px', lineHeight: 1.6, color: 'var(--text-primary)' }}>
                {isHi ? kurmaData.guidanceHi : kurmaData.guidanceEn}
              </p>
            </div>
          )}
        </div>
      )}

      {/* PAGE 33: ANNUAL VARSHPHAL / TAJIKA SOLAR */}
      {activePage === 33 && (
        <div className="card" style={{ padding: '20px' }}>
          <h2 style={{ margin: '0 0 12px', fontSize: '18px', color: 'var(--text-primary)' }}>
            ☀️ {isHi ? 'पेज 33: वर्षफल / ताजिक वार्षिक (Annual Varshphal & Tajika Sahams)' : 'Page 33: Annual Varshphal & Tajika Solar Return'}
          </h2>
          <ToolsSuiteView
            chart={chart}
            baseInput={chart.input}
            settings={safeSettings}
            onApplyRectifiedTime={() => {}}
            requestedSubTab={{ id: 'varshaphala', nonce: Date.now() }}
          />
        </div>
      )}

      {/* PAGE 34: KP KRISHNAMURTI PADDHATI */}
      {activePage === 34 && (
        <div className="card" style={{ padding: '20px' }}>
          <h2 style={{ margin: '0 0 12px', fontSize: '18px', color: 'var(--text-primary)' }}>
            🎯 {isHi ? 'पेज 34: के.पी. (KP) ज्योतिष प्रणाली (KP Krishnamurti Paddhati)' : 'Page 34: KP Krishnamurti Paddhati (Sub-Lords)'}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            <div className="card" style={{ padding: '16px' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '14.5px' }}>{isHi ? '12 भाव कस्प व उप-स्वामी (Cuspal Sub-Lords)' : 'Cuspal Sub-Lords'}</h3>
              <table className="compact-table" style={{ width: '100%', fontSize: '12px' }}>
                <thead>
                  <tr>
                    <th>{isHi ? 'भाव' : 'Cusp'}</th>
                    <th>{isHi ? 'राशि' : 'Sign'}</th>
                    <th>{isHi ? 'स्वामी' : 'Lord'}</th>
                    <th>{isHi ? 'नक्षत्र' : 'Star'}</th>
                    <th>{isHi ? 'उप-स्वामी' : 'Sub'}</th>
                  </tr>
                </thead>
                <tbody>
                  {kpReport.cusps.map((c) => (
                    <tr key={c.house}>
                      <td style={{ fontWeight: 600 }}>Cusp {c.house}</td>
                      <td>{c.signName}</td>
                      <td>{c.signLord}</td>
                      <td>{c.starLord}</td>
                      <td style={{ fontWeight: 700, color: 'var(--accent)' }}>{c.subLord}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="card" style={{ padding: '16px' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '14.5px' }}>{isHi ? 'ग्रह स्थिति व उप-स्वामी (Planetary Sub-Lords)' : 'Planetary Sub-Lords'}</h3>
              <table className="compact-table" style={{ width: '100%', fontSize: '12px' }}>
                <thead>
                  <tr>
                    <th>{isHi ? 'ग्रह' : 'Planet'}</th>
                    <th>{isHi ? 'राशि' : 'Sign'}</th>
                    <th>{isHi ? 'नक्षत्र' : 'Star'}</th>
                    <th>{isHi ? 'उप-स्वामी' : 'Sub'}</th>
                  </tr>
                </thead>
                <tbody>
                  {kpReport.planets.map((p) => (
                    <tr key={p.planet}>
                      <td style={{ fontWeight: 600 }}>{isHi ? PLANET_SANSKRIT[p.planet] || p.planet : p.planet}</td>
                      <td>{p.signName}</td>
                      <td>{p.starLord}</td>
                      <td style={{ fontWeight: 700, color: 'var(--accent)' }}>{p.subLord}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* PAGE 35: LAL KITAB SYSTEM & UPAY */}
      {activePage === 35 && (
        <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ margin: 0, fontSize: '18px', color: 'var(--text-primary)' }}>
            📕 {isHi ? 'पेज 35: लाल किताब प्रणाली (Lal Kitab System & Debts)' : 'Page 35: Lal Kitab System & Debts'}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            <div className="card" style={{ padding: '16px' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '14.5px' }}>{isHi ? 'लाल किताब ऋण (Rina / Debts)' : 'Lal Kitab Karmic Debts'}</h3>
              {lalKitabReport.karmicDebts.map((d, i) => (
                <div key={i} style={{ padding: '8px 12px', background: 'var(--bg-subtle)', borderRadius: '6px', marginBottom: '8px', fontSize: '12px' }}>
                  <strong style={{ color: d.isTriggered ? 'var(--warn)' : 'var(--good)' }}>{isHi ? d.debtTypeHi : d.debtType}</strong>
                  <div className="muted">{isHi ? d.classicalCauseHi : d.classicalCauseEn}</div>
                  <div style={{ marginTop: '4px', color: 'var(--accent)' }}>{isHi ? `उपाय: ${d.remedialProtocolHi}` : `Remedy: ${d.remedialProtocolEn}`}</div>
                </div>
              ))}
            </div>

            <div className="card" style={{ padding: '16px' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '14.5px' }}>{isHi ? 'सोये भाव (Sleeping Houses)' : 'Sleeping Houses'}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {lalKitabReport.sleepingHouses.map((h) => (
                  <div key={h.houseNumber} style={{ padding: '6px 10px', background: 'var(--bg-subtle)', borderRadius: '4px', fontSize: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <strong>भाव {h.houseNumber} ({h.pakkaGharRulerHi})</strong>
                      <span className={`tag ${h.isSleeping ? 'tag-warn' : 'tag-good'}`}>
                        {h.isSleeping ? (isHi ? 'सोया हुआ' : 'Sleeping') : (isHi ? 'जाग्रत' : 'Awake')}
                      </span>
                    </div>
                    {h.isSleeping && (
                      <div className="muted" style={{ marginTop: '4px' }}>
                        {isHi ? `जगाने का उपाय: ${h.awakeningMethodHi}` : `Awakening: ${h.awakeningMethodEn}`}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PAGE 36: KUNDALI MATCH MAKING (36 GUNAS) */}
      {activePage === 36 && (
        <div className="card" style={{ padding: '20px' }}>
          <h2 style={{ margin: '0 0 12px', fontSize: '18px', color: 'var(--text-primary)' }}>
            💍 {isHi ? 'पेज 36: कुंडली मिलान (Kundali Match Making 36 Gunas)' : 'Page 36: Kundali Match Making (36 Gunas)'}
          </h2>
          <MatchMakingView
            profiles={profiles}
            activeProfileId={activeProfileId}
            settings={safeSettings}
            chartStyle={chartStyle}
          />
        </div>
      )}

      {/* PAGE 37: COMPREHENSIVE VEDIC REMEDIES */}
      {activePage === 37 && (
        <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ margin: 0, fontSize: '18px', color: 'var(--text-primary)' }}>
            🕉️ {isHi ? 'पेज 37: सम्पूर्ण शास्त्रीय उपाय (Comprehensive Vedic Remedies)' : 'Page 37: Comprehensive Shastric Remedies'}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            <div className="card" style={{ padding: '16px' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '14.5px', color: 'var(--accent)' }}>
                💎 {isHi ? 'रत्न व रुद्राक्ष परामर्श (Gemstones & Rudraksha)' : 'Gemstones & Rudraksha'}
              </h3>
              <div style={{ fontSize: '12.5px', lineHeight: 1.6 }}>
                <strong>{isHi ? 'जीवन रत्न (Life Stone):' : 'Life Stone:'}</strong> {isHi ? gemstoneData.lifeStone.stoneHi : gemstoneData.lifeStone.stoneEn} ({isHi ? gemstoneData.lifeStone.fingerHi : gemstoneData.lifeStone.fingerEn})<br />
                <strong>{isHi ? 'भाग्य रत्न (Lucky Stone):' : 'Lucky Stone:'}</strong> {isHi ? gemstoneData.luckyStone.stoneHi : gemstoneData.luckyStone.stoneEn} ({isHi ? gemstoneData.luckyStone.fingerHi : gemstoneData.luckyStone.fingerEn})<br />
                <strong>{isHi ? 'कारक रत्न (Benefic Stone):' : 'Benefic Stone:'}</strong> {isHi ? gemstoneData.beneficStone.stoneHi : gemstoneData.beneficStone.stoneEn} ({isHi ? gemstoneData.beneficStone.fingerHi : gemstoneData.beneficStone.fingerEn})<br />
                <strong>{isHi ? 'रुद्राक्ष (Rudraksha Mukhi):' : 'Recommended Rudraksha:'}</strong> {gemstoneData.primaryRudraksha.mukhi} मुखी रुद्राक्ष ({isHi ? gemstoneData.primaryRudraksha.deityHi : gemstoneData.primaryRudraksha.deityEn})
              </div>
            </div>

            <div className="card" style={{ padding: '16px' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '14.5px', color: 'var(--good)' }}>
                🪔 {isHi ? 'दैनिक वैदिक मंत्र व दान (Mantra & Daana)' : 'Vedic Mantras & Charity'}
              </h3>
              <div style={{ fontSize: '12px', lineHeight: 1.6 }}>
                • <strong>गायत्री मंत्र:</strong> नित्य प्रातः 24 या 108 बार जप करें।<br />
                • <strong>महामृत्युंजय मंत्र:</strong> स्वास्थ्य व दीर्घायु हेतु नित्य 11 बार जपें।<br />
                • <strong>अन्न दान:</strong> प्रति शनिवार व अमावस्या को निर्धनों को भोजन कराएं।
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PAGE 38: DAILY DRIK PANCHANG & MUHURTA (AT THE VERY END!) */}
      {activePage === 38 && (
        <div className="card" style={{ padding: '20px' }}>
          <h2 style={{ margin: '0 0 12px', fontSize: '18px', color: 'var(--text-primary)' }}>
            📅 {isHi ? 'पेज 38: दैनिक पंचांग व मुहूर्त (Daily Drik Panchang & Muhurta)' : 'Page 38: Daily Drik Panchang & Muhurta'}
          </h2>
          <ToolsSuiteView
            chart={chart}
            baseInput={chart.input}
            settings={safeSettings}
            onApplyRectifiedTime={() => {}}
            requestedSubTab={{ id: 'deep_panchang', nonce: Date.now() }}
          />
        </div>
      )}
    </div>
  );
};
