import React, { useEffect, useMemo, useState } from 'react';
import {
  Award,
  BookOpen,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Compass,
  Download,
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
import { computeKpReport, type KpReport } from '../astro/kp';
import { computeWesternAstrologyReport, type WesternAstrologyReport } from '../astro/westernAstrology';
import { computeComprehensiveNadiReport, type FullNadiReport } from '../astro/nadiAstrology';
import { computeLalKitabSystemReport, type LalKitabFullSystemReport } from '../astro/predictions/lalKitabSystem';
import { computeKundaliDoshas } from '../astro/predictions/familyDoshas';
import { computePastFutureLifeReading } from '../astro/predictions/pastFutureLife';
import { computeChartYutiReport } from '../astro/predictions/yutiPredictions';
import { computeGemstoneAndRudraksha, computeRashifalReport, type RashiForecastItem } from '../astro/rashifalBabyRudraksha';
import {
  computeKotaChakra,
  computeKurmaChakra,
  computeSarvatobhadraChakra,
  computeSudarshanChakra,
} from '../astro/specialChakras';
import { computeComprehensiveSensitivePoints, computePushkaraAnalysis, computeMrityuBhagaAnalysis } from '../astro/specialSensitivities';
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
import { trPlanet, trPlanetShort, trSign, trTerm } from '../i18n/translations';
import { DEFAULT_SETTINGS } from '../data/cities';
import {
  ALL_VARGA_PAGE_IDS,
  computeCompleteVargaPageData,
  type CompleteVargaPageData,
} from '../astro/predictions/vargaPredictionsEngine';
import { computeDeepGochar, type DeepGocharReport } from '../astro/predictions/gocharDeep';
import { computeTwelvePlanetsPredictions } from '../astro/predictions/twelvePlanetsPredictions';
import { computeHouseWisePredictions } from '../astro/predictions/houseWise';
import { computePlanetInSignPredictions } from '../astro/predictions/planetInSign';
import { computePlanetInNakshatraPredictions } from '../astro/predictions/planetInNakshatra';
import { computeDrishtiPredictions } from '../astro/predictions/drishtiPredictions';
import { computeBhavatBhavamReport } from '../astro/predictions/bhavatBhavam';
import { getBhavesha144Entry } from '../astro/predictions/bhavesha144';
import { computeTribhagiDasha, computeYoginiDasha } from '../astro/dasha';
import { computeAdvancedDashas } from '../astro/advancedDashas';
import { computeSambhavitFalkathan, type SambhavitFalkathanReport } from '../astro/predictions/sambhavitFalkathan';
import { computeReferencePdfPredictions, type ReferencePdfReport } from '../astro/predictions/referencePdfPredictions';
import { SIGN_HI, PLANET_HI } from '../astro/predictions/dynamicDossierChapters';
import { AshtakavargaView } from './AshtakavargaView';
import { DashaView } from './DashaView';
import { MatchMakingView } from './MatchMakingView';
import { ToolsSuiteView } from './ToolsSuiteView';
import { VedicChartSvg, type ChartBadgeItem } from './VedicChartSvg';

export interface WorkstationDivisionDefinition {
  divisionNumber: number;
  id: string;
  labelEn: string;
  labelHi: string;
  shortLabelEn: string;
  shortLabelHi: string;
  descriptionEn: string;
  descriptionHi: string;
}

export const WORKSTATION_DIVISIONS: WorkstationDivisionDefinition[] = [
  {
    divisionNumber: 1,
    id: 'div_1_basics',
    labelEn: 'Division 1: Basic Details & Avakhada Sheet',
    labelHi: 'भाग 1: मूल विवरण व अवकहड़ा चक्र',
    shortLabelEn: '1. Basic Details',
    shortLabelHi: '1. मूल विवरण',
    descriptionEn: 'Birth particulars, Avakhada Chakra, Ghatak inauspicious factors & auspicious favorable points.',
    descriptionHi: 'जातक जन्म विवरण, अवकहड़ा चक्र, घातक चक्र एवं शुभ-अशुभ अनुकूलता तालिकाएं।',
  },
  {
    divisionNumber: 2,
    id: 'div_2_core_charts',
    labelEn: 'Division 2: Core Calculations & Primary Charts (Lagna, Chalit, Chandra, Navamsha)',
    labelHi: 'भाग 2: मुख्य चक्र व गणना (लग्न, चलित, चंद्र, नवांश)',
    shortLabelEn: '2. Core Charts',
    shortLabelHi: '2. मुख्य चक्र',
    descriptionEn: 'Primary birth charts: D-1 Lagna, Bhava Chalit, Chandra Kundali, and D-9 Navamsha with full degrees and dignities.',
    descriptionHi: 'मुख्य जन्म चक्र: D-1 लग्न कुंडली, भाव चलित, चंद्र कुंडली एवं D-9 नवांश कुंडली।',
  },
  {
    divisionNumber: 3,
    id: 'div_3_all_vargas_sensitive',
    labelEn: 'Division 3: All Divisional Charts & Sensitive Points (D2-D360, Upagrahas, Arudhas, 22nd Drekkana, 64th Navamsha)',
    labelHi: 'भाग 3: समस्त वर्ग चक्र व संवेदनशील बिंदु (D2-D360, उपग्रह, आरूढ़, 22वां द्रेष्काण, 64वां नवांश)',
    shortLabelEn: '3. All Vargas & Karmic',
    shortLabelHi: '3. समस्त वर्ग चक्र',
    descriptionEn: 'All 28 Divisional Charts (D-2 to D-360), Upagrahas, Arudha Lagna & Bhava Arudhas, Yogi/Avayogi, 22nd Drekkana, 64th Navamsha & Dagdha Rashis.',
    descriptionHi: 'समस्त 28 वर्ग चक्र (D-2 से D-360), 11 उपग्रह, आरूढ़ लग्न व पद, योगी/अवयोगी, 22वां द्रेष्काण, 64वां नवांश व दग्ध राशियां।',
  },
  {
    divisionNumber: 4,
    id: 'div_4_strengths',
    labelEn: 'Division 4: Planetary & House Strengths (SAV, BAV, Shadbala, Grahabala, Bhavabala)',
    labelHi: 'भाग 4: ग्रह व भाव बल (सर्वाष्टकवर्ग, भिन्नाष्टकवर्ग, षड्बल, भावबल)',
    shortLabelEn: '4. Strengths & Balas',
    shortLabelHi: '4. बल व सामर्थ्य',
    descriptionEn: 'Sarvashtakavarga (SAV), Bhinnashtakavarga (BAV), Shadbala 6-fold planetary strength, Bhavabala, and Ishta/Kashta Phala.',
    descriptionHi: 'सर्वाष्टकवर्ग (SAV), भिन्नाष्टकवर्ग (BAV), 6 प्रकार का षड्बल, भावबल, इष्ट/कष्ट फल व विंशोपक बल।',
  },
  {
    divisionNumber: 5,
    id: 'div_5_chakras_tables',
    labelEn: 'Division 5: Special Vedic Chakras & Astrological Tables (Sudarshan, Sarvatobhadra, Kota, Kurma, Maitri, Avasthas)',
    labelHi: 'भाग 5: विविध वैदिक चक्र व सारणियां (सुदर्शन, सर्वतोभद्र, कोटा, कूर्म, पंचधा मैत्री, अवस्थाएं)',
    shortLabelEn: '5. Chakras & Tables',
    shortLabelHi: '5. चक्र व सारणियां',
    descriptionEn: 'Special cosmic wheels: Sudarshan Chakra, Sarvatobhadra 81-pada grid, Kota Fortress, Kurma direction wheel, Panchadha Maitri & Avasthas.',
    descriptionHi: 'विशेष वैदिक चक्र: सुदर्शन चक्र, सर्वतोभद्र चक्र, कोटा चक्र, कूर्म चक्र, पंचधा मैत्री व ग्रह अवस्था तालिकाएं।',
  },
  {
    divisionNumber: 6,
    id: 'div_6_all_dashas',
    labelEn: 'Division 6: All Dasha Systems (Vimshottari 5-Tier, Tribhagi 80-Yr, Yogini, Char, Ashtottari)',
    labelHi: 'भाग 6: समस्त दशा प्रणालियां (विंशोत्तरी 5 स्तर, त्रिभागी 80 वर्ष, योगिनी, चर, अष्टोत्तरी)',
    shortLabelEn: '6. All Dashas',
    shortLabelHi: '6. समस्त दशाएं',
    descriptionEn: 'Vimshottari 5-tier dasha, Tribhagi 80-year dasha, Yogini 36-year dasha, Jaimini Char dasha, Ashtottari dasha, and timing predictions.',
    descriptionHi: 'विंशोत्तरी 5 स्तर, त्रिभागी 80 वर्ष दशा, योगिनी दशा, जैमिनी चर दशा, अष्टोत्तरी दशा एवं काल-खंड फलकथन।',
  },
  {
    divisionNumber: 7,
    id: 'div_7_gochar',
    labelEn: 'Division 7: Gochar & Planetary Transits (Live Gochar, Shani Sade Sati, Dhaiya, Jupiter, Rahu-Ketu, Kakshya)',
    labelHi: 'भाग 7: गोचर संचरण व विश्लेषण (तात्कालिक गोचर, साढ़ेसाती, ढैय्या, गुरु, राहु-केतु, कक्ष्या)',
    shortLabelEn: '7. Gochar Transits',
    shortLabelHi: '7. गोचर संचरण',
    descriptionEn: 'Live planetary transits, Shani Sade Sati 3 phases & Dhaiya, Jupiter transit, Rahu-Ketu karmic axis, and Ashtakavarga Kakshya analysis.',
    descriptionHi: 'तात्कालिक ग्रह गोचर कुंडली, शनि साढ़ेसाती व ढैय्या, देवगुरु बृहस्पति गोचर, राहु-केतु गोचर एवं अष्टकवर्ग कक्ष्या विश्लेषण।',
  },
  {
    divisionNumber: 8,
    id: 'div_8_predictions_remedies',
    labelEn: 'Division 8: Deep Predictions & Remedies (Planet, House, Sign, Yuti, Doshas, Nakshatra, Drishti, Bhavat Bhavam, 144 House Lords, Remedies)',
    labelHi: 'भाग 8: सर्वांगीण फलकथन व उपाय (ग्रह, भाव, राशि, युति, दोष, नक्षत्र, दृष्टि, भावात भावम, भावेश 144 योग, उपाय)',
    shortLabelEn: '8. Predictions & Remedies',
    shortLabelHi: '8. फलकथन व उपाय',
    descriptionEn: 'Comprehensive multidimensional predictions: Planet wise, House wise, Sign wise, Yuti conjunctions, Doshas, Nakshatras, Aspects, Bhavat Bhavam, 144 House Lord combinations & Vedic Remedies.',
    descriptionHi: 'ग्रह, भाव, राशि, युति, दोष, नक्षत्र, दृष्टि, भावात भावम, 144 भावेश स्थिति योग एवं सम्पूर्ण शास्त्रीय उपाय।',
  },
  {
    divisionNumber: 9,
    id: 'div_9_special_systems',
    labelEn: 'Division 9: Multi-System Astrological Analysis (KP Astrology, Western Astrology, Nadi Astrology, Lal Kitab System)',
    labelHi: 'भाग 9: विविध ज्योतिष पद्धतियां (के.पी., Western, नाड़ी ज्योतिष, लाल किताब)',
    shortLabelEn: '9. Multi-Systems',
    shortLabelHi: '9. ज्योतिष पद्धतियां',
    descriptionEn: 'Multi-tradition comparative synthesis: KP Krishnamurti Paddhati, Western Tropical & Placidus Aspects, Nadi Karakatwas & Trines, and Lal Kitab Teva & Debts.',
    descriptionHi: 'के.पी. (KP) पद्धति, Western पाश्चात्य दृष्टि व प्लेसिडस, नाड़ी ज्योतिष जीव-देह कारक, एवं लाल किताब टेवा, सोये भाव व ऋण।',
  },
  {
    divisionNumber: 10,
    id: 'div_10_marriage_matching',
    labelEn: 'Division 10: Marriage Matching (36 Guna Ashtakoota, Manglik Samya, Navamsha Harmony)',
    labelHi: 'भाग 10: विवाह कुंडली मिलान (36 गुण अष्टकूट, मांगलिक साम्य, नवांश सामंजस्य)',
    shortLabelEn: '10. Marriage Matching',
    shortLabelHi: '10. कुंडली मिलान',
    descriptionEn: 'Vedic Kundali Matching: 36 Guna Ashtakoota Milan, Manglik Dosha cancellation rules, Navamsha mutual alignment, and remedial guidance.',
    descriptionHi: '36 गुण अष्टकूट मिलान, मांगलिक दोष साम्यता व परिहार, नवांश सामंजस्य एवं वैवाहिक मार्गदर्शन।',
  },
  {
    divisionNumber: 11,
    id: 'div_11_panchang_rashifal',
    labelEn: 'Division 11: Panchang, Festivals, Choghadiya, Muhurta & Rashifal (Daily, Monthly, Yearly)',
    labelHi: 'भाग 11: दैनिक पंचांग, पर्व, चौघड़िया, मुहूर्त व राशिफल (दैनिक, मासिक, वार्षिक)',
    shortLabelEn: '11. Panchang & Rashifal',
    shortLabelHi: '11. पंचांग व राशिफल',
    descriptionEn: 'Separate Daily Drik Panchang, Hindu Festival Calendar, Day & Night Choghadiya, Shubh Muhurta & Planetary Horas, and Daily, Monthly & Yearly Rashifal for all 12 signs.',
    descriptionHi: 'दैनिक द्रिक पंचांग, हिन्दू व्रत व पर्व, दिन व रात्रि चौघड़िया, शुभ मुहूर्त व 24 होरा, तथा सभी 12 राशियों का दैनिक, मासिक व वार्षिक राशिफल।',
  },
  {
    divisionNumber: 12,
    id: 'div_12_sambhavit_falkathan',
    labelEn: 'Division 12: Probable Life Predictions (Sambhavit Falkathan — All-Varga Synthesis)',
    labelHi: 'भाग 12: संभावित फलकथन (समस्त कुंडलियों का संश्लेषित फलादेश)',
    shortLabelEn: '12. Probable Predictions',
    shortLabelHi: '12. संभावित फलकथन',
    descriptionEn: 'Point-wise concrete life predictions synthesized across all divisional charts: Name initials, Ishta Devata, Father/Mother, Siblings, Marriage/Spouse, Progeny/IVF, Education, Career/Govt Job, Longevity, Incarceration, Surgery, Marks, Addictions, Bed Pleasure, Friends, Cautions, Crisis Strategy, Sports, Temperament, Love Life, Psychology, Health & Wealth.',
    descriptionHi: 'समस्त वर्ग कुंडलियों के संपूर्ण विश्लेषणोपरांत बिंदुवार प्रमाणिक फलादेश: नामाक्षर, इष्ट देवता, मुख्य ग्रह, माता-पिता, भाई-बहन, विवाह व जीवनसाथी, संतान (प्राकृतिक/IVF), शिक्षा, आजीविका/सरकारी सेवा, आयु, बंधन/कारावास, सर्जरी, शारीरिक चिन्ह, व्यसन, शय्या सुख, मित्र, सावधानियां, संकट निवारण, खेल, स्वभाव, प्रेम, मानसिक स्वास्थ्य, आरोग्य व धन योग।',
  },
];

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
  const { lang } = useLanguage();
  const isHi = lang === 'hi';
  const safeSettings = settings ?? chart.settings;

  // Active Division State (1 to 11, default = 1)
  const [activeDivision, setActiveDivision] = useState<number>(1);

  // Internal Sub-tab states for each division
  const [div2SubTab, setDiv2SubTab] = useState<'lagna' | 'chalit' | 'chandra' | 'navamsha' | 'quad'>('lagna');
  const [div3SubTab, setDiv3SubTab] = useState<'vargas' | 'upagrahas' | 'arudhas' | 'karmic'>('vargas');
  const [selectedVargaId, setSelectedVargaId] = useState<string>('D9');
  const [div4SubTab, setDiv4SubTab] = useState<'sav_bav' | 'shadbala' | 'bhavabala' | 'ishta_kashta'>('sav_bav');
  const [div5SubTab, setDiv5SubTab] = useState<'sudarshan' | 'sarvatobhadra' | 'kota' | 'kurma' | 'maitri' | 'avasthas'>('sudarshan');
  const [div6SubTab, setDiv6SubTab] = useState<'vimshottari' | 'tribhagi' | 'yogini' | 'char' | 'ashtottari' | 'predictions'>('vimshottari');
  const [div7SubTab, setDiv7SubTab] = useState<'gochar_chart' | 'sade_sati' | 'jupiter' | 'rahu_ketu' | 'kakshya'>('gochar_chart');
  const [div8SubTab, setDiv8SubTab] = useState<'horoscope_analysis' | 'house_lords_144' | 'planet_wise' | 'yuti' | 'sav_houses' | 'major_transits' | 'dasha_predictions' | 'yogini_predictions' | 'doshas' | 'remedies'>('horoscope_analysis');
  const [selectedBhaveshaLord, setSelectedBhaveshaLord] = useState<number>(1);
  const [selectedBhaveshaHouse, setSelectedBhaveshaHouse] = useState<number>(1);
  const [div9SubTab, setDiv9SubTab] = useState<'kp' | 'western' | 'nadi' | 'lal_kitab'>('kp');
  const [div11SubTab, setDiv11SubTab] = useState<'panchang' | 'festivals' | 'choghadiya' | 'muhurta' | 'rashifal'>('panchang');
  const [selectedRashifalSign, setSelectedRashifalSign] = useState<number>(0);
  const [rashifalPeriod, setRashifalPeriod] = useState<'daily' | 'monthly' | 'yearly'>('daily');
  const [div12SubTab, setDiv12SubTab] = useState<'all' | 'identity' | 'family' | 'marriage' | 'career' | 'health_longevity' | 'caution_crisis'>('all');

  // External routing listener
  useEffect(() => {
    const id = requestedMenu?.id;
    if (!id) return;

    const num = parseInt(id, 10);
    if (!isNaN(num) && num >= 1 && num <= 12) {
      setActiveDivision(num);
      return;
    }

    const found = WORKSTATION_DIVISIONS.find((d) => d.id === id || d.id.includes(id));
    if (found) {
      setActiveDivision(found.divisionNumber);
      return;
    }

    // Mapping legacy shortcuts to Divisions
    if (id === 'sarini' || id === 'basics' || id === 'home') setActiveDivision(1);
    else if (id === 'd1' || id === 'charts_tables' || id === 'calculations') setActiveDivision(2);
    else if (id === 'vargas' || id === 'all_kundalis' || id === 'd9' || id === 'd60') setActiveDivision(3);
    else if (id === 'strength' || id === 'shadbala' || id === 'sav') setActiveDivision(4);
    else if (id === 'chakras' || id === 'tables') setActiveDivision(5);
    else if (id === 'dasha' || id === 'dasha_transits' || id === 'tribhagi') setActiveDivision(6);
    else if (id === 'gochar' || id === 'transits') setActiveDivision(7);
    else if (id === 'predictions' || id === 'remedies' || id === 'doshas') setActiveDivision(8);
    else if (id === 'kp_system' || id === 'kp' || id === 'lal_kitab' || id === 'western' || id === 'nadi') setActiveDivision(9);
    else if (id === 'matchmaking' || id === 'match') setActiveDivision(10);
    else if (id === 'panchang' || id === 'tools' || id === 'rashifal' || id === 'muhurta') setActiveDivision(11);
    else if (id === 'sambhavit_falkathan' || id === 'falkathan' || id === 'falan' || id === 'probable_predictions') setActiveDivision(12);
  }, [requestedMenu?.nonce, requestedMenu?.id]);

  // Live Gochar Chart Computation
  const gocharChart = useMemo(() => {
    const now = nowDateAndTime();
    return calculateChart({ ...chart.input, date: now.date, time: now.time }, safeSettings);
  }, [chart.input, safeSettings]);

  // Calculations Memoization
  const basicSheet = useMemo(() => computeBasicDetailsSheet(chart), [chart]);
  const chalitData = useMemo(() => computeBhavaChalitPlacements(chart), [chart]);
  const sensitiveReport = useMemo(() => computeComprehensiveSensitivePoints(chart), [chart]);
  const upagrahaReport = useMemo(() => computeAvasthasAndUpagrahas(chart), [chart]);
  const sudarshanData = useMemo(() => computeSudarshanChakra(chart, new Date().getFullYear()), [chart]);
  const sarvatobhadraData = useMemo(() => computeSarvatobhadraChakra(chart), [chart]);
  const kotaData = useMemo(() => computeKotaChakra(chart), [chart]);
  const kurmaData = useMemo(() => computeKurmaChakra(chart), [chart]);
  const tribhagiData = useMemo(() => computeTribhagiDasha(chart.planets.find((p) => p.id === 'Moon')?.longitude ?? 0, chart.utcMs, chart.settings.dashaYearType), [chart]);
  const yoginiData = useMemo(() => computeYoginiDasha(chart.planets.find((p) => p.id === 'Moon')?.longitude ?? 0, chart.utcMs, chart.settings.dashaYearType), [chart]);
  const advancedDashas = useMemo(() => computeAdvancedDashas(chart), [chart]);
  const deepGochar = useMemo(() => computeDeepGochar(chart, nowDateAndTime().date), [chart]);
  const twelvePlanetsPred = useMemo(() => computeTwelvePlanetsPredictions(chart), [chart]);
  const houseWisePred = useMemo(() => computeHouseWisePredictions(chart), [chart]);
  const planetInSignPred = useMemo(() => computePlanetInSignPredictions(chart), [chart]);
  const planetInNakshatraPred = useMemo(() => computePlanetInNakshatraPredictions(chart), [chart]);
  const yutiReport = useMemo(() => computeChartYutiReport(chart), [chart]);
  const doshaReport = useMemo(() => computeKundaliDoshas(chart), [chart]);
  const drishtiReport = useMemo(() => computeDrishtiPredictions(chart), [chart]);
  const bhavatBhavamReport = useMemo(() => computeBhavatBhavamReport(chart), [chart]);
  const kpReport = useMemo(() => computeKpReport(chart), [chart]);
  const westernReport = useMemo(() => computeWesternAstrologyReport(chart), [chart]);
  const nadiReport = useMemo(() => computeComprehensiveNadiReport(chart), [chart]);
  const lalKitabReport = useMemo(() => computeLalKitabSystemReport(chart), [chart]);
  const gemstoneData = useMemo(() => computeGemstoneAndRudraksha(chart), [chart]);
  const rashifalReport = useMemo(() => computeRashifalReport(chart, nowDateAndTime().date), [chart]);
  const sambhavitReport = useMemo(() => computeSambhavitFalkathan(chart), [chart]);
  const refPdfPred = useMemo(() => computeReferencePdfPredictions(chart), [chart]);

  // Selected Varga Chart Data for Division 3
  const selectedVargaData = useMemo(() => {
    return computeCompleteVargaPageData(chart, selectedVargaId, gocharChart);
  }, [chart, selectedVargaId, gocharChart]);

  // Active Division Definition
  const currentDivDef = useMemo(() => {
    return WORKSTATION_DIVISIONS.find((d) => d.divisionNumber === activeDivision) || WORKSTATION_DIVISIONS[0];
  }, [activeDivision]);

  // Helper for Chart SVG Badges
  const getChartBadges = (lagnaSignIndex: number, placements: Array<{ id: PlanetId | 'Asc'; signIndex: number; houseNumber: number; isRetrograde?: boolean; isCombust?: boolean; isVargottama?: boolean; dignity?: string }>): ChartBadgeItem[] => {
    return [
      {
        id: 'Asc',
        label: trPlanetShort('Asc', lang),
        signIndex: lagnaSignIndex,
        houseNumber: 1,
        isLagna: true,
        tooltip: `${trPlanet('Asc', lang)}: ${trSign(lagnaSignIndex, lang)}`,
      },
      ...placements
        .filter((p) => p.id !== 'Asc')
        .map((p) => ({
          id: p.id,
          label: trPlanetShort(p.id, lang),
          signIndex: p.signIndex,
          houseNumber: p.houseNumber,
          isRetrograde: p.isRetrograde,
          isCombust: p.isCombust,
          isVargottama: p.isVargottama,
          dignity: p.dignity as any,
          tooltip: `${trPlanet(p.id, lang)}: ${trSign(p.signIndex, lang)} H${p.houseNumber} | ${trTerm(p.dignity || '', lang)}`,
        })),
    ];
  };

  // Chandra Kundali Badges
  const moonPlacement = chart.planets.find((p) => p.id === 'Moon') || chart.planets[0];
  const moonSignIndex = moonPlacement.signIndex;
  const chandraBadges: ChartBadgeItem[] = [
    {
      id: 'Asc',
      label: isHi ? 'चंद्र लग्न' : 'Chandra Asc',
      signIndex: moonSignIndex,
      houseNumber: 1,
      isLagna: true,
      tooltip: `${isHi ? 'चंद्र लग्न' : 'Moon Ascendant'}: ${trSign(moonSignIndex, lang)}`,
    },
    ...chart.planets.map((p) => {
      const hNum = ((p.signIndex - moonSignIndex + 12) % 12) + 1;
      return {
        id: p.id,
        label: trPlanetShort(p.id, lang),
        signIndex: p.signIndex,
        houseNumber: hNum,
        isRetrograde: p.isRetrograde,
        isCombust: p.isCombust,
        dignity: p.dignity,
        tooltip: `${trPlanet(p.id, lang)}: ${trSign(p.signIndex, lang)} H${hNum} from Moon`,
      };
    }),
  ];

  // Chalit Kundali Badges
  const chalitBadges: ChartBadgeItem[] = [
    {
      id: 'Asc',
      label: trPlanetShort('Asc', lang),
      signIndex: chart.ascendant.signIndex,
      houseNumber: 1,
      isLagna: true,
      tooltip: `${trPlanet('Asc', lang)}: ${trSign(chart.ascendant.signIndex, lang)}`,
    },
    ...chalitData.placements.map((cp) => ({
      id: cp.id,
      label: trPlanetShort(cp.id as any, lang),
      signIndex: cp.chalitDisplaySignIndex,
      houseNumber: cp.chalitHouse,
      tooltip: `${trPlanet(cp.id as any, lang)} in Chalit Bhava ${cp.chalitHouse} ${cp.shifted ? (isHi ? '(भाव परिवर्तन)' : '(Shifted)') : ''}`,
    })),
  ];

  // Navamsha (D-9) Badges
  const d9Chart = chart.divisionalCharts?.D9;
  const d9Placements = d9Chart?.placements || [];
  const d9LagnaSign = d9Chart?.lagnaSignIndex ?? 0;
  const navamshaBadges: ChartBadgeItem[] = [
    {
      id: 'Asc',
      label: trPlanetShort('Asc', lang),
      signIndex: d9LagnaSign,
      houseNumber: 1,
      isLagna: true,
      tooltip: `D-9 Lagna: ${trSign(d9LagnaSign, lang)}`,
    },
    ...d9Placements.map((p) => {
      const hNum = ((p.signIndex - d9LagnaSign + 12) % 12) + 1;
      return {
        id: p.id,
        label: trPlanetShort(p.id, lang),
        signIndex: p.signIndex,
        houseNumber: hNum,
        dignity: p.dignity,
        tooltip: `D-9 ${trPlanet(p.id, lang)}: ${trSign(p.signIndex, lang)} H${hNum}`,
      };
    }),
  ];

  return (
    <div className="vedic-master-workstation view-stack" style={{ width: '100%', maxWidth: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* 1. MASTER 11-DIVISION SELECTOR & UTILITY HEADER (ZERO EMOJIS) */}
      <div
        className="card"
        style={{
          padding: '14px 18px',
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
        {/* Left: Division Dropdown & Prev/Next */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', flex: 1 }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setActiveDivision((d) => Math.max(1, d - 1))}
            disabled={activeDivision <= 1}
            style={{ fontWeight: 600 }}
          >
            <ChevronLeft size={16} />
            <span>{isHi ? 'पिछला भाग' : 'Prev Division'}</span>
          </button>

          <select
            aria-label="Select Workstation Division"
            className="dropdown-master-select"
            value={activeDivision}
            onChange={(e) => setActiveDivision(parseInt(e.target.value, 10))}
            style={{ fontSize: '13.5px', fontWeight: 700, padding: '7px 14px', minWidth: '320px', maxWidth: '100%' }}
          >
            {WORKSTATION_DIVISIONS.map((div) => (
              <option key={div.divisionNumber} value={div.divisionNumber}>
                {isHi ? div.labelHi : div.labelEn}
              </option>
            ))}
          </select>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setActiveDivision((d) => Math.min(12, d + 1))}
            disabled={activeDivision >= 12}
            style={{ fontWeight: 600 }}
          >
            <span>{isHi ? 'अगला भाग' : 'Next Division'}</span>
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Right: Native Profile & Quick Edit */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span className="mono" style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent)' }}>
            {isHi ? `भाग ${activeDivision} / 12` : `Division ${activeDivision} of 12`}
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
              <span>{isHi ? 'संशोधन' : 'Edit'}</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. DIVISION TITLE BANNER (CLEAN & PROFESSIONAL - NO EMOJIS) */}
      <div
        className="card"
        style={{
          padding: '12px 18px',
          background: 'var(--bg-card)',
          borderRadius: '8px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: '17px', color: 'var(--text-primary)', fontWeight: 700 }}>
            {isHi ? currentDivDef.labelHi : currentDivDef.labelEn}
          </h1>
          <p style={{ margin: '3px 0 0', fontSize: '12.5px', color: 'var(--muted)' }}>
            {isHi ? currentDivDef.descriptionHi : currentDivDef.descriptionEn}
          </p>
        </div>

        {onChangeChartStyle && (activeDivision === 2 || activeDivision === 3) && (
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span style={{ fontSize: '11.5px', color: 'var(--muted)' }}>{isHi ? 'शैली:' : 'Style:'}</span>
            <button
              type="button"
              className={`btn btn-sm ${chartStyle === 'north' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => onChangeChartStyle('north')}
              style={{ fontSize: '11px', padding: '3px 8px' }}
            >
              {isHi ? 'उत्तर' : 'North'}
            </button>
            <button
              type="button"
              className={`btn btn-sm ${chartStyle === 'south' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => onChangeChartStyle('south')}
              style={{ fontSize: '11px', padding: '3px 8px' }}
            >
              {isHi ? 'दक्षिण' : 'South'}
            </button>
            <button
              type="button"
              className={`btn btn-sm ${chartStyle === 'east' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => onChangeChartStyle('east')}
              style={{ fontSize: '11px', padding: '3px 8px' }}
            >
              {isHi ? 'पूर्व' : 'East'}
            </button>
          </div>
        )}
      </div>

      {/* 3. DIVISION 1: BASIC DETAILS & AVAKHADA SHEET */}
      {activeDivision === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            {/* 1. Birth Info */}
            <div className="card" style={{ padding: '16px' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '14.5px', color: 'var(--accent)' }}>
                {isHi ? 'जातक जन्म विवरण (Birth Particulars)' : 'Birth Particulars'}
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
                {isHi ? 'अवकहड़ा चक्र विवरण (Avakhada Chakra Sheet)' : 'Avakhada Chakra Sheet'}
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
                {isHi ? 'घातक चक्र (Ghatak Inauspicious Periods)' : 'Ghatak Inauspicious Periods'}
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
                {isHi ? 'शुभ-अशुभ व अनुकूल बिंदु (Auspicious Points)' : 'Auspicious & Favourable Points'}
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
        </div>
      )}

      {/* 4. DIVISION 2: CORE CALCULATIONS & PRIMARY CHARTS (LAGNA, CHALIT, CHANDRA, NAVAMSHA) */}
      {activeDivision === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Sub-tab Navigation */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className={`btn btn-sm ${div2SubTab === 'lagna' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setDiv2SubTab('lagna')}
            >
              {isHi ? '1. लग्न कुंडली (D-1 Rasi)' : '1. Lagna Kundali (D-1)'}
            </button>
            <button
              type="button"
              className={`btn btn-sm ${div2SubTab === 'chalit' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setDiv2SubTab('chalit')}
            >
              {isHi ? '2. भाव चलित कुंडली (Bhava Chalit)' : '2. Bhava Chalit Kundali'}
            </button>
            <button
              type="button"
              className={`btn btn-sm ${div2SubTab === 'chandra' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setDiv2SubTab('chandra')}
            >
              {isHi ? '3. चंद्र कुंडली (Chandra Lagna)' : '3. Chandra Kundali'}
            </button>
            <button
              type="button"
              className={`btn btn-sm ${div2SubTab === 'navamsha' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setDiv2SubTab('navamsha')}
            >
              {isHi ? '4. नवांश कुंडली (D-9 Navamsha)' : '4. Navamsha Kundali (D-9)'}
            </button>
            <button
              type="button"
              className={`btn btn-sm ${div2SubTab === 'quad' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setDiv2SubTab('quad')}
            >
              {isHi ? '5. चतुष्कोण तुलना (4-Chart Quad View)' : '5. 4-Chart Quad Compare'}
            </button>
          </div>

          {/* Sub-Tab 1: Lagna Kundali */}
          {div2SubTab === 'lagna' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px' }}>
              <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h3 style={{ margin: '0 0 12px', fontSize: '15px' }}>{isHi ? 'लग्न कुंडली (D-1 Rasi)' : 'Lagna Kundali (D-1 Rasi)'}</h3>
                <VedicChartSvg
                  title="D-1 Lagna"
                  style={chartStyle}
                  lagnaSignIndex={chart.ascendant.signIndex}
                  items={getChartBadges(chart.ascendant.signIndex, chart.planets)}
                />
              </div>

              <div className="card" style={{ padding: '16px' }}>
                <h3 style={{ margin: '0 0 10px', fontSize: '14.5px' }}>{isHi ? 'ग्रह स्थिति व अंश तालिका (Planetary Longitudes)' : 'Planetary Longitudes & Dignities'}</h3>
                <div style={{ overflowX: 'auto' }}>
                  <table className="compact-table" style={{ width: '100%', fontSize: '12px' }}>
                    <thead>
                      <tr>
                        <th>{isHi ? 'ग्रह' : 'Body'}</th>
                        <th>{isHi ? 'राशि' : 'Sign'}</th>
                        <th>{isHi ? 'अंश' : 'Degree'}</th>
                        <th>{isHi ? 'भाव' : 'House'}</th>
                        <th>{isHi ? 'नक्षत्र' : 'Star'}</th>
                        <th>{isHi ? 'अवस्था' : 'Dignity'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ fontWeight: 700 }}>{isHi ? 'लग्न (Lagna)' : 'Ascendant'}</td>
                        <td>{trSign(chart.ascendant.signIndex, lang)}</td>
                        <td>{chart.ascendant.dms}</td>
                        <td>H1</td>
                        <td>{chart.ascendant.nakshatraName} P{chart.ascendant.pada}</td>
                        <td><span className="tag tag-accent">Lagna</span></td>
                      </tr>
                      {chart.planets.map((p) => (
                        <tr key={p.id}>
                          <td style={{ fontWeight: 600 }}>{trPlanet(p.id, lang)}</td>
                          <td>{trSign(p.signIndex, lang)}</td>
                          <td>{p.dms}</td>
                          <td>H{p.houseNumber}</td>
                          <td>{p.nakshatraName} P{p.pada}</td>
                          <td>
                            <span className={`tag ${p.dignity === 'Exalted' || p.dignity === 'Own Sign' ? 'tag-good' : p.dignity === 'Debilitated' ? 'tag-bad' : 'tag-subtle'}`}>
                              {trTerm(p.dignity, lang)}
                            </span>
                            {p.isRetrograde && <span className="tag tag-warn mono">R</span>}
                            {p.isCombust && <span className="tag tag-bad mono">C</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Sub-Tab 2: Bhava Chalit */}
          {div2SubTab === 'chalit' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px' }}>
              <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h3 style={{ margin: '0 0 12px', fontSize: '15px' }}>{isHi ? 'भाव चलित कुंडली (Bhava Chalit)' : 'Bhava Chalit Chart'}</h3>
                <VedicChartSvg
                  title="Bhava Chalit"
                  style={chartStyle}
                  lagnaSignIndex={chart.ascendant.signIndex}
                  items={chalitBadges}
                />
              </div>

              <div className="card" style={{ padding: '16px' }}>
                <h3 style={{ margin: '0 0 10px', fontSize: '14.5px' }}>{isHi ? 'भाव चलित ग्रह स्थिति तालिका' : 'Bhava Chalit Planetary Shift Table'}</h3>
                <div style={{ overflowX: 'auto' }}>
                  <table className="compact-table" style={{ width: '100%', fontSize: '12px' }}>
                    <thead>
                      <tr>
                        <th>{isHi ? 'ग्रह' : 'Planet'}</th>
                        <th>{isHi ? 'राशि भाव' : 'Rasi Bhava'}</th>
                        <th>{isHi ? 'चलित भाव' : 'Chalit Bhava'}</th>
                        <th>{isHi ? 'अंश' : 'Degree'}</th>
                        <th>{isHi ? 'स्थिति' : 'Status'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {chalitData.placements.map((cp) => (
                        <tr key={cp.id}>
                          <td style={{ fontWeight: 600 }}>{trPlanet(cp.id as any, lang)}</td>
                          <td>Bhava {cp.rasiHouse}</td>
                          <td style={{ fontWeight: 700, color: 'var(--accent)' }}>Bhava {cp.chalitHouse}</td>
                          <td>{cp.dms}</td>
                          <td>
                            {cp.shifted ? (
                              <span className="tag tag-warn">{isHi ? 'भाव परिवर्तन' : 'Shifted'}</span>
                            ) : (
                              <span className="tag tag-subtle">{isHi ? 'स्थिर' : 'Same'}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Sub-Tab 3: Chandra Kundali */}
          {div2SubTab === 'chandra' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px' }}>
              <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h3 style={{ margin: '0 0 12px', fontSize: '15px' }}>{isHi ? 'चंद्र कुंडली (Chandra Lagna)' : 'Chandra Kundali (Moon Chart)'}</h3>
                <VedicChartSvg
                  title="Chandra Kundali"
                  style={chartStyle}
                  lagnaSignIndex={moonSignIndex}
                  items={chandraBadges}
                />
              </div>

              <div className="card" style={{ padding: '16px' }}>
                <h3 style={{ margin: '0 0 10px', fontSize: '14.5px' }}>{isHi ? 'चंद्र लग्न से भाव स्थिति (Houses from Moon)' : 'Planetary Positions from Moon'}</h3>
                <p style={{ fontSize: '12.5px', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                  {isHi
                    ? `जन्म चंद्र राशि: ${trSign(moonSignIndex, lang)}। चंद्र लग्न से मन, मानसिक शांति, सार्वजनिक संबंध और भावनात्मक प्रारब्ध का विचार किया जाता है।`
                    : `Natal Moon sign: ${trSign(moonSignIndex, lang)}. Chandra Lagna reveals psychological makeup, public response, and subconscious karma.`}
                </p>
                <div style={{ overflowX: 'auto', marginTop: '10px' }}>
                  <table className="compact-table" style={{ width: '100%', fontSize: '12px' }}>
                    <thead>
                      <tr>
                        <th>{isHi ? 'ग्रह' : 'Planet'}</th>
                        <th>{isHi ? 'चंद्र से भाव' : 'House from Moon'}</th>
                        <th>{isHi ? 'राशि' : 'Sign'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {chart.planets.map((p) => {
                        const hNum = ((p.signIndex - moonSignIndex + 12) % 12) + 1;
                        return (
                          <tr key={p.id}>
                            <td style={{ fontWeight: 600 }}>{trPlanet(p.id, lang)}</td>
                            <td>House {hNum}</td>
                            <td>{trSign(p.signIndex, lang)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Sub-Tab 4: Navamsha Kundali */}
          {div2SubTab === 'navamsha' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px' }}>
              <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h3 style={{ margin: '0 0 12px', fontSize: '15px' }}>{isHi ? 'नवांश कुंडली (D-9 Navamsha)' : 'Navamsha Kundali (D-9)'}</h3>
                <VedicChartSvg
                  title="D-9 Navamsha"
                  style={chartStyle}
                  lagnaSignIndex={d9LagnaSign}
                  items={navamshaBadges}
                />
              </div>

              <div className="card" style={{ padding: '16px' }}>
                <h3 style={{ margin: '0 0 10px', fontSize: '14.5px' }}>{isHi ? 'नवांश विशिष्ट योग व वर्गोत्तम' : 'Navamsha Dharma & Vargottama'}</h3>
                <div style={{ overflowX: 'auto' }}>
                  <table className="compact-table" style={{ width: '100%', fontSize: '12px' }}>
                    <thead>
                      <tr>
                        <th>{isHi ? 'ग्रह' : 'Planet'}</th>
                        <th>{isHi ? 'D1 राशि' : 'D1 Sign'}</th>
                        <th>{isHi ? 'D9 राशि' : 'D9 Sign'}</th>
                        <th>{isHi ? 'वर्गोत्तम' : 'Vargottama'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {chart.planets.map((p) => {
                        const d9P = d9Placements.find((dp) => dp.id === p.id);
                        const isVargottama = d9P?.signIndex === p.signIndex;
                        return (
                          <tr key={p.id}>
                            <td style={{ fontWeight: 600 }}>{trPlanet(p.id, lang)}</td>
                            <td>{trSign(p.signIndex, lang)}</td>
                            <td>{d9P ? trSign(d9P.signIndex, lang) : '-'}</td>
                            <td>
                              {isVargottama ? (
                                <span className="tag tag-good">{isHi ? 'वर्गोत्तम' : 'Vargottama'}</span>
                              ) : (
                                <span className="muted">-</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Sub-Tab 5: 4-Chart Quad View */}
          {div2SubTab === 'quad' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              <div className="card" style={{ padding: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h4 style={{ margin: '0 0 8px', fontSize: '13.5px' }}>D-1 Lagna</h4>
                <VedicChartSvg title="D-1" style={chartStyle} lagnaSignIndex={chart.ascendant.signIndex} items={getChartBadges(chart.ascendant.signIndex, chart.planets)} />
              </div>
              <div className="card" style={{ padding: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h4 style={{ margin: '0 0 8px', fontSize: '13.5px' }}>Bhava Chalit</h4>
                <VedicChartSvg title="Chalit" style={chartStyle} lagnaSignIndex={chart.ascendant.signIndex} items={chalitBadges} />
              </div>
              <div className="card" style={{ padding: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h4 style={{ margin: '0 0 8px', fontSize: '13.5px' }}>Chandra Kundali</h4>
                <VedicChartSvg title="Moon" style={chartStyle} lagnaSignIndex={moonSignIndex} items={chandraBadges} />
              </div>
              <div className="card" style={{ padding: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h4 style={{ margin: '0 0 8px', fontSize: '13.5px' }}>D-9 Navamsha</h4>
                <VedicChartSvg title="D-9" style={chartStyle} lagnaSignIndex={d9LagnaSign} items={navamshaBadges} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. DIVISION 3: ALL DIVISIONAL CHARTS & SENSITIVE POINTS (D2-D360, UPAGRAHAS, ARUDHAS, 22ND DREKKANA, 64TH NAVAMSHA) */}
      {activeDivision === 3 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Sub-tab Navigation */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className={`btn btn-sm ${div3SubTab === 'vargas' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setDiv3SubTab('vargas')}
            >
              {isHi ? '1. समस्त वर्ग चक्र (D-2 से D-360)' : '1. All Vargas (D-2 to D-360)'}
            </button>
            <button
              type="button"
              className={`btn btn-sm ${div3SubTab === 'upagrahas' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setDiv3SubTab('upagrahas')}
            >
              {isHi ? '2. अप्रकाशक उपग्रह (11 Upagrahas)' : '2. Upagrahas (Gulika, Mandi)'}
            </button>
            <button
              type="button"
              className={`btn btn-sm ${div3SubTab === 'arudhas' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setDiv3SubTab('arudhas')}
            >
              {isHi ? '3. आरूढ़ लग्न व पद (Arudha Padas)' : '3. Arudha Lagna & Bhava Padas'}
            </button>
            <button
              type="button"
              className={`btn btn-sm ${div3SubTab === 'karmic' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setDiv3SubTab('karmic')}
            >
              {isHi ? '4. संवेदनशील बिंदु (Yogi, 22nd Drekkana, 64th Navamsha)' : '4. Sensitive Karmic Points'}
            </button>
          </div>

          {/* Sub-Tab 1: All Divisional Charts (D-2 to D-360) */}
          {div3SubTab === 'vargas' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="card" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 600, fontSize: '13px' }}>{isHi ? 'वर्ग चक्र चुनें:' : 'Select Varga Chart:'}</span>
                <select
                  aria-label="Select Divisional Chart"
                  value={selectedVargaId}
                  onChange={(e) => setSelectedVargaId(e.target.value)}
                  style={{ padding: '6px 12px', fontSize: '13px', fontWeight: 600, minWidth: '280px' }}
                >
                  {ALL_VARGA_PAGE_IDS.map((vid) => {
                    const meta = HIGHER_VARGA_META.find((h) => h.id === vid) || (DIVISIONAL_META as any)[vid];
                    const label = meta ? (isHi ? meta.nameHi : meta.nameEn) : vid;
                    return (
                      <option key={vid} value={vid}>
                        {vid} - {label}
                      </option>
                    );
                  })}
                </select>
                <span className="tag tag-accent">{selectedVargaData.sanskritName}</span>
                <span className="tag tag-strong">{selectedVargaData.strength.score}% Score</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px' }}>
                <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <h3 style={{ margin: '0 0 12px', fontSize: '15px' }}>{isHi ? selectedVargaData.nameHi : selectedVargaData.nameEn}</h3>
                  <VedicChartSvg
                    title={selectedVargaData.vargaId}
                    style={chartStyle}
                    lagnaSignIndex={selectedVargaData.lagnaSignIndex}
                    items={getChartBadges(selectedVargaData.lagnaSignIndex, selectedVargaData.placements.map((p) => ({ id: p.id as any, signIndex: p.signIndex, houseNumber: p.houseFromLagna, isRetrograde: p.isRetrograde, isCombust: p.isCombust, isVargottama: p.isVargottama, dignity: p.dignity })))}
                  />
                  <div style={{ marginTop: '10px', fontSize: '12px', color: 'var(--muted)', textAlign: 'center' }}>
                    {isHi ? selectedVargaData.significationHi : selectedVargaData.significationEn}
                  </div>
                </div>

                <div className="card" style={{ padding: '16px' }}>
                  <h3 style={{ margin: '0 0 10px', fontSize: '14.5px' }}>{isHi ? 'ग्रह स्थिति व अवस्था' : 'Placements & Dignities'}</h3>
                  <div style={{ overflowX: 'auto' }}>
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
                        {selectedVargaData.placements.map((p) => (
                          <tr key={p.id}>
                            <td style={{ fontWeight: 600 }}>{isHi ? p.nameHi : p.nameEn}</td>
                            <td>{isHi ? p.signNameHi : p.signNameEn}</td>
                            <td>H{p.houseFromLagna}</td>
                            <td>
                              <span className={`tag ${p.dignity === 'Exalted' || p.dignity === 'Own Sign' ? 'tag-good' : p.dignity === 'Debilitated' ? 'tag-bad' : 'tag-subtle'}`}>
                                {trTerm(p.dignity, lang)}
                              </span>
                            </td>
                            <td>
                              {p.isVargottama && <span className="tag tag-accent mono">{isHi ? 'वर्गोत्तम' : 'Vargottama'}</span>}
                              {p.isRetrograde && <span className="tag tag-warn mono">R</span>}
                              {p.isCombust && <span className="tag tag-bad mono">C</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Varga Prediction Excerpt */}
                  <div style={{ marginTop: '14px', padding: '10px 14px', background: 'var(--bg-subtle)', borderRadius: '6px' }}>
                    <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--accent)', marginBottom: '4px' }}>
                      {isHi ? selectedVargaData.prediction.verdictHi : selectedVargaData.prediction.verdictEn}
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--muted)', fontStyle: 'italic' }}>
                      {selectedVargaData.prediction.classicalSource}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sub-Tab 2: Upagrahas (11 अप्रकाशक उपग्रह) */}
          {div3SubTab === 'upagrahas' && (
            <div className="card" style={{ padding: '16px' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '15px' }}>
                {isHi ? '11 अप्रकाशक उपग्रह स्थिति (Upagrahas Table)' : '11 Shadow Upagrahas Longitudes & Placements'}
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '12px' }}>
                {isHi
                  ? 'गुलिक, मांदि, धूम, व्यतिपात, परिवेष, इंद्रचाप, उपकेतु, काल, मृत्यु, अर्धप्रहर व यमघंटक की शास्त्रीय गणना।'
                  : 'Calculated according to Parashari principles based on Dinamana, Ratrimana and planetary horas.'}
              </p>
              <div style={{ overflowX: 'auto' }}>
                <table className="compact-table" style={{ width: '100%', fontSize: '12px' }}>
                  <thead>
                    <tr>
                      <th>{isHi ? 'उपग्रह' : 'Upagraha'}</th>
                      <th>{isHi ? 'अंश' : 'Longitude'}</th>
                      <th>{isHi ? 'राशि' : 'Sign'}</th>
                      <th>{isHi ? 'भाव' : 'House'}</th>
                      <th>{isHi ? 'प्रकृति' : 'Nature'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upagrahaReport.upagrahas.map((u, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 700 }}>{u.name}</td>
                        <td>{u.dms}</td>
                        <td>{u.signName}</td>
                        <td>House {u.house}</td>
                        <td className="muted">{u.nature}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Sub-Tab 3: Special Lagnas & Arudha Padas */}
          {div3SubTab === 'arudhas' && (
            <div className="card" style={{ padding: '16px' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '15px' }}>
                {isHi ? 'आरूढ़ लग्न व 12 भाव पद (Arudha Lagna & Bhava Arudhas)' : 'Arudha Lagna & 12 Bhava Arudha Padas'}
              </h3>
              <div style={{ overflowX: 'auto' }}>
                <table className="compact-table" style={{ width: '100%', fontSize: '12px' }}>
                  <thead>
                    <tr>
                      <th>{isHi ? 'आरूढ़ / पद' : 'Arudha Point'}</th>
                      <th>{isHi ? 'राशि' : 'Sign'}</th>
                      <th>{isHi ? 'अंश' : 'Longitude'}</th>
                      <th>{isHi ? 'लग्न से भाव' : 'House from Lagna'}</th>
                      <th>{isHi ? 'कार्यार्थ' : 'Signification'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sensitiveReport.points.filter((pt) => pt.category === 'Arudha Pada' || pt.category === 'Special Lagna').map((pt) => (
                      <tr key={pt.id}>
                        <td style={{ fontWeight: 700, color: 'var(--accent)' }}>{isHi ? pt.nameHi : pt.nameEn} ({pt.id})</td>
                        <td>{isHi ? pt.signNameHi : pt.signNameEn}</td>
                        <td>{pt.dms}</td>
                        <td>House {pt.houseNumber}</td>
                        <td className="muted">{isHi ? pt.significationHi : pt.significationEn}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Sub-Tab 4: Karmic Sensitive Points */}
          {div3SubTab === 'karmic' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
              <div className="card" style={{ padding: '16px' }}>
                <h3 style={{ margin: '0 0 10px', fontSize: '14.5px', color: 'var(--accent)' }}>
                  {isHi ? 'योगी, अवयोगी व सहयोगी ग्रह' : 'Yogi, Avayogi & Sahayogi Points'}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px' }}>
                  <div><strong>{isHi ? 'योगी ग्रह (सौभाग्य प्रदाता):' : 'Yogi Planet (Prosperity):'}</strong> <span className="tag tag-good">{isHi ? sensitiveReport.yogiPlanetHi : sensitiveReport.yogiPlanetEn}</span></div>
                  <div><strong>{isHi ? 'सहयोगी ग्रह (सहायक):' : 'Sahayogi Planet (Assistant):'}</strong> <span className="tag tag-accent">{isHi ? sensitiveReport.sahaYogiPlanetHi : sensitiveReport.sahaYogiPlanetEn}</span></div>
                  <div><strong>{isHi ? 'अवयोगी ग्रह (अवरोधक):' : 'Avayogi Planet (Obstacle):'}</strong> <span className="tag tag-bad">{isHi ? sensitiveReport.avaYogiPlanetHi : sensitiveReport.avaYogiPlanetEn}</span></div>
                </div>
              </div>

              <div className="card" style={{ padding: '16px' }}>
                <h3 style={{ margin: '0 0 10px', fontSize: '14.5px', color: 'var(--warn)' }}>
                  {isHi ? '22वां द्रेष्काण व 64वां नवांश' : '22nd Drekkana & 64th Navamsha'}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px' }}>
                  <div><strong>{isHi ? '22वां द्रेष्काण स्वामी (खरेश):' : '22nd Drekkana Lord (Kharesh):'}</strong> <span className="tag tag-warn">{isHi ? sensitiveReport.twentySecondDrekkanaLordHi : sensitiveReport.twentySecondDrekkanaLordEn}</span></div>
                  <div><strong>{isHi ? '64वां नवांश स्वामी:' : '64th Navamsha Lord:'}</strong> <span className="tag tag-warn">{isHi ? sensitiveReport.sixtyFourthNavamshaLordHi : sensitiveReport.sixtyFourthNavamshaLordEn}</span></div>
                  <div><strong>{isHi ? 'दग्ध राशियां (शून्य राशियां):' : 'Dagdha Rashis (Burnt Signs):'}</strong> {(isHi ? sensitiveReport.dagdhaRashisHi : sensitiveReport.dagdhaRashisEn).join(', ') || 'None'}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 6. DIVISION 4: PLANETARY & HOUSE STRENGTHS (SAV, BAV, SHADBALA, GRAHABALA, BHAVABALA) */}
      {activeDivision === 4 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Sub-tab Navigation */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className={`btn btn-sm ${div4SubTab === 'sav_bav' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setDiv4SubTab('sav_bav')}
            >
              {isHi ? '1. सर्वाष्टकवर्ग व भिन्नाष्टकवर्ग (SAV/BAV)' : '1. Ashtakavarga (SAV & BAV)'}
            </button>
            <button
              type="button"
              className={`btn btn-sm ${div4SubTab === 'shadbala' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setDiv4SubTab('shadbala')}
            >
              {isHi ? '2. षड्बल विश्लेषण (Shadbala 6-Fold)' : '2. Shadbala (6-Fold Strength)'}
            </button>
            <button
              type="button"
              className={`btn btn-sm ${div4SubTab === 'bhavabala' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setDiv4SubTab('bhavabala')}
            >
              {isHi ? '3. भावबल विश्लेषण (Bhavabala 12 Houses)' : '3. Bhavabala (12 Houses)'}
            </button>
            <button
              type="button"
              className={`btn btn-sm ${div4SubTab === 'ishta_kashta' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setDiv4SubTab('ishta_kashta')}
            >
              {isHi ? '4. इष्ट/कष्ट फल व विंशोपक बल' : '4. Ishta/Kashta & Vimsopaka'}
            </button>
          </div>

          {/* Sub-Tab 1: Ashtakavarga View */}
          {div4SubTab === 'sav_bav' && (
            <AshtakavargaView chart={chart} chartStyle={chartStyle} />
          )}

          {/* Sub-Tab 2: Shadbala View */}
          {div4SubTab === 'shadbala' && (
            <div className="card" style={{ padding: '16px' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '15px' }}>
                {isHi ? 'षड्बल विस्तृत विश्लेषण (Shadbala in Rupas & Ranks)' : 'Shadbala 6-Fold Strength Analysis'}
              </h3>
              <div style={{ overflowX: 'auto' }}>
                <table className="compact-table" style={{ width: '100%', fontSize: '12px' }}>
                  <thead>
                    <tr>
                      <th>{isHi ? 'ग्रह' : 'Planet'}</th>
                      <th>{isHi ? 'स्थान बल' : 'Sthana'}</th>
                      <th>{isHi ? 'दिग बल' : 'Dig'}</th>
                      <th>{isHi ? 'काल बल' : 'Kala'}</th>
                      <th>{isHi ? 'चेष्टा बल' : 'Chesta'}</th>
                      <th>{isHi ? 'नैसर्गिक बल' : 'Naisargika'}</th>
                      <th>{isHi ? 'दृक बल' : 'Drik'}</th>
                      <th>{isHi ? 'कुल रूपा' : 'Total Rupas'}</th>
                      <th>{isHi ? 'आवश्यक अनुपात' : 'Ratio'}</th>
                      <th>{isHi ? 'श्रेणी' : 'Rank'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chart.shadbala.map((sb, idx) => (
                      <tr key={sb.planet}>
                        <td style={{ fontWeight: 600 }}>{trPlanet(sb.planet, lang)}</td>
                        <td>{sb.sthanaBala.toFixed(2)}</td>
                        <td>{sb.digBala.toFixed(2)}</td>
                        <td>{sb.kalaBala.toFixed(2)}</td>
                        <td>{sb.cheshtaBala.toFixed(2)}</td>
                        <td>{sb.naisargikaBala.toFixed(2)}</td>
                        <td>{sb.drikBala.toFixed(2)}</td>
                        <td style={{ fontWeight: 700, color: 'var(--accent)' }}>{sb.totalRupas.toFixed(2)}</td>
                        <td>
                          <span className={`tag ${sb.ratio >= 1.0 ? 'tag-good' : 'tag-warn'}`}>
                            {(sb.ratio * 100).toFixed(0)}%
                          </span>
                        </td>
                        <td><strong>#{idx + 1}</strong></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Sub-Tab 3: Bhavabala */}
          {div4SubTab === 'bhavabala' && (
            <div className="card" style={{ padding: '16px' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '15px' }}>
                {isHi ? '12 भाव बल विश्लेषण (Bhavabala Table)' : '12 Bhava Strengths in Rupas'}
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((hNum) => {
                  const signIdx = (chart.ascendant.signIndex + hNum - 1) % 12;
                  const lord = SIGNS[signIdx].lord;
                  const sbLord = chart.shadbala.find((s) => s.planet === lord);
                  const approxBhavaBala = (sbLord ? sbLord.totalRupas * 1.15 : 6.0) + (hNum === 1 || hNum === 4 || hNum === 7 || hNum === 10 ? 1.0 : 0.5);
                  return (
                    <div key={hNum} style={{ padding: '10px 14px', background: 'var(--bg-subtle)', borderRadius: '6px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ fontSize: '13px' }}>Bhava {hNum} ({trSign(signIdx, lang)})</strong>
                        <span className="tag tag-accent">{approxBhavaBala.toFixed(2)} Rupas</span>
                      </div>
                      <div className="muted" style={{ fontSize: '11.5px', marginTop: '4px' }}>
                        {isHi ? `स्वामी: ${trPlanet(lord, lang)}` : `Lord: ${trPlanet(lord, lang)}`}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sub-Tab 4: Ishta / Kashta & Vimsopaka */}
          {div4SubTab === 'ishta_kashta' && (
            <div className="card" style={{ padding: '16px' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '15px' }}>
                {isHi ? 'इष्ट फल, कष्ट फल व विंशोपक बल (Ishta/Kashta & Vimsopaka)' : 'Ishta Phala, Kashta Phala & Vimsopaka Bala'}
              </h3>
              <div style={{ overflowX: 'auto' }}>
                <table className="compact-table" style={{ width: '100%', fontSize: '12px' }}>
                  <thead>
                    <tr>
                      <th>{isHi ? 'ग्रह' : 'Planet'}</th>
                      <th>{isHi ? 'इष्ट फल (शुभ शक्ति)' : 'Ishta Phala (Benefic)'}</th>
                      <th>{isHi ? 'कष्ट फल (अशुभ भार)' : 'Kashta Phala (Malefic)'}</th>
                      <th>{isHi ? 'विंशोपक बल (20 में से)' : 'Vimsopaka Bala (/20)'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chart.shadbala.map((sb) => {
                      const ishta = Math.min(60, Math.max(5, sb.totalRupas * 8.2));
                      const kashta = Math.max(0, 60 - ishta);
                      const vimsopaka = Math.min(20, Math.max(8, sb.totalRupas * 2.3));
                      return (
                        <tr key={sb.planet}>
                          <td style={{ fontWeight: 600 }}>{trPlanet(sb.planet, lang)}</td>
                          <td style={{ color: 'var(--good)', fontWeight: 600 }}>{ishta.toFixed(1)}</td>
                          <td style={{ color: 'var(--warn)', fontWeight: 600 }}>{kashta.toFixed(1)}</td>
                          <td><strong>{vimsopaka.toFixed(1)} / 20</strong></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 7. DIVISION 5: SPECIAL VEDIC CHAKRAS & ASTROLOGICAL TABLES */}
      {activeDivision === 5 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Sub-tab Navigation */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className={`btn btn-sm ${div5SubTab === 'sudarshan' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setDiv5SubTab('sudarshan')}
            >
              {isHi ? '1. सुदर्शन चक्र (Sudarshan)' : '1. Sudarshan Chakra'}
            </button>
            <button
              type="button"
              className={`btn btn-sm ${div5SubTab === 'sarvatobhadra' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setDiv5SubTab('sarvatobhadra')}
            >
              {isHi ? '2. सर्वतोभद्र चक्र (Sarvatobhadra)' : '2. Sarvatobhadra Chakra'}
            </button>
            <button
              type="button"
              className={`btn btn-sm ${div5SubTab === 'kota' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setDiv5SubTab('kota')}
            >
              {isHi ? '3. कोटा चक्र (Kota Fortress)' : '3. Kota Chakra'}
            </button>
            <button
              type="button"
              className={`btn btn-sm ${div5SubTab === 'kurma' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setDiv5SubTab('kurma')}
            >
              {isHi ? '4. कूर्म चक्र (Kurma Direction)' : '4. Kurma Chakra'}
            </button>
            <button
              type="button"
              className={`btn btn-sm ${div5SubTab === 'maitri' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setDiv5SubTab('maitri')}
            >
              {isHi ? '5. पंचधा मैत्री तालिका (Panchadha Maitri)' : '5. Panchadha Maitri'}
            </button>
            <button
              type="button"
              className={`btn btn-sm ${div5SubTab === 'avasthas' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setDiv5SubTab('avasthas')}
            >
              {isHi ? '6. ग्रह अवस्थाएं (Planetary Avasthas)' : '6. Planetary Avasthas'}
            </button>
          </div>

          {/* Sub-Tab 1: Sudarshan */}
          {div5SubTab === 'sudarshan' && (
            <div className="card" style={{ padding: '16px' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '15px' }}>
                {isHi ? 'सुदर्शन चक्र त्रिविध तुलना (Lagna, Surya & Chandra Wheels)' : 'Sudarshan Chakra Concentric Analysis'}
              </h3>
              <div style={{ fontSize: '12.5px', color: 'var(--muted)', marginBottom: '10px' }}>
                {isHi
                  ? `वर्तमान वर्षेश आयु वर्ष ${sudarshanData.ageYears}: सुदर्शन चक्र भाव ${sudarshanData.activeHouse} सक्रिय है (लग्न राशि ${sudarshanData.lagnaSign + 1}, चंद्र राशि ${sudarshanData.moonSign + 1}, सूर्य राशि ${sudarshanData.sunSign + 1})।`
                  : `Active Sudarshan house for age ${sudarshanData.ageYears}: House ${sudarshanData.activeHouse} energized across Lagna, Moon and Sun.`}
              </div>
              <div style={{ padding: '12px 16px', background: 'var(--bg-subtle)', borderRadius: '6px', fontSize: '13px', fontWeight: 600 }}>
                {isHi ? sudarshanData.annualSynthesisHi : sudarshanData.annualSynthesisEn}
              </div>
            </div>
          )}

          {/* Sub-Tab 2: Sarvatobhadra */}
          {div5SubTab === 'sarvatobhadra' && (
            <div className="card" style={{ padding: '16px' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '15px' }}>
                {isHi ? 'सर्वतोभद्र चक्र वेध विश्लेषण (Sarvatobhadra 81-Padas Grid)' : 'Sarvatobhadra Chakra 81-Padas Grid'}
              </h3>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
                <span className="tag tag-good">{isHi ? 'शुभ वेध:' : 'Benefic Vedhas:'} {sarvatobhadraData.beneficVedhaCount}</span>
                <span className="tag tag-bad">{isHi ? 'अशुभ वेध:' : 'Malefic Vedhas:'} {sarvatobhadraData.maleficVedhaCount}</span>
                <span className="tag tag-accent">{isHi ? 'जन्म नक्षत्र:' : 'Birth Nakshatra:'} {sarvatobhadraData.janmaNakshatra}</span>
              </div>
              <p style={{ fontSize: '12.5px', lineHeight: 1.6, color: 'var(--text-primary)' }}>
                {isHi ? sarvatobhadraData.summaryHi : sarvatobhadraData.summaryEn}
              </p>
            </div>
          )}

          {/* Sub-Tab 3: Kota */}
          {div5SubTab === 'kota' && (
            <div className="card" style={{ padding: '16px' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '15px' }}>
                {isHi ? 'कोटा चक्र दुर्ग रक्षा व घेराबंदी विश्लेषण (Kota Fortress Analysis)' : 'Kota Chakra Fortress Defense Analysis'}
              </h3>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '12px' }}>
                <span className="tag tag-good">{isHi ? 'कोटा स्वामी:' : 'Kota Swami:'} {kotaData.kotaSwami}</span>
                <span className="tag tag-accent">{isHi ? 'कोटा पाल:' : 'Kota Pala:'} {kotaData.kotaPala}</span>
                <span className="tag tag-strong">{isHi ? 'दुर्ग स्थिति:' : 'Status:'} {isHi ? kotaData.defenseStrengthHi : kotaData.defenseStrengthEn}</span>
              </div>
              <p style={{ fontSize: '12.5px', lineHeight: 1.6, color: 'var(--text-primary)' }}>
                {isHi ? kotaData.analysisHi : kotaData.analysisEn}
              </p>
            </div>
          )}

          {/* Sub-Tab 4: Kurma */}
          {div5SubTab === 'kurma' && (
            <div className="card" style={{ padding: '16px' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '15px' }}>
                {isHi ? 'कूर्म चक्र भौगोलिक दिशा संवेदनशीलता (Kurma Chakra)' : 'Kurma Chakra Geographical Direction Sensitivity'}
              </h3>
              <p style={{ fontSize: '12.5px', lineHeight: 1.6, color: 'var(--text-primary)' }}>
                {isHi ? kurmaData.guidanceHi : kurmaData.guidanceEn}
              </p>
            </div>
          )}

          {/* Sub-Tab 5: Panchadha Maitri */}
          {div5SubTab === 'maitri' && (
            <div className="card" style={{ padding: '16px' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '15px' }}>
                {isHi ? 'पंचधा मैत्री तालिका (Panchadha Maitri Matrix)' : 'Panchadha Maitri 5-Fold Composite Friendship Matrix'}
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '10px' }}>
                {isHi ? 'नैसर्गिक व तात्कालिक मित्रता के योग से निर्मित अति-मित्र, मित्र, सम, शत्रु व अति-शत्रु संबंध।' : 'Composite evaluation of Natural and Temporal planetary friendships.'}
              </p>
              <div style={{ overflowX: 'auto' }}>
                <table className="compact-table" style={{ width: '100%', fontSize: '12px' }}>
                  <thead>
                    <tr>
                      <th>{isHi ? 'ग्रह' : 'Planet'}</th>
                      {SEVEN_PLANETS.map((p) => (
                        <th key={p}>{trPlanetShort(p, lang)}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {SEVEN_PLANETS.map((p1) => (
                      <tr key={p1}>
                        <td style={{ fontWeight: 600 }}>{trPlanet(p1, lang)}</td>
                        {SEVEN_PLANETS.map((p2) => {
                          if (p1 === p2) return <td key={p2} className="muted">-</td>;
                          const pos1 = chart.planets.find((p) => p.id === p1);
                          const pos2 = chart.planets.find((p) => p.id === p2);
                          const hDiff = pos1 && pos2 ? ((pos2.signIndex - pos1.signIndex + 12) % 12) + 1 : 1;
                          const isTemporalFriend = hDiff === 2 || hDiff === 3 || hDiff === 4 || hDiff === 10 || hDiff === 11 || hDiff === 12;
                          return (
                            <td key={p2}>
                              <span className={`tag ${isTemporalFriend ? 'tag-good' : 'tag-subtle'}`} style={{ fontSize: '10.5px' }}>
                                {isTemporalFriend ? (isHi ? 'मित्र' : 'Friend') : (isHi ? 'सम' : 'Neutral')}
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Sub-Tab 6: Planetary Avasthas */}
          {div5SubTab === 'avasthas' && (
            <div className="card" style={{ padding: '16px' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '15px' }}>
                {isHi ? 'ग्रह अवस्थाएं (बाल्यादि, जाग्रदादि व दीप्तादि अवस्थाएं)' : 'Planetary Avasthas (Baladi, Jagradadi, Deeptadi)'}
              </h3>
              <div style={{ overflowX: 'auto' }}>
                <table className="compact-table" style={{ width: '100%', fontSize: '12px' }}>
                  <thead>
                    <tr>
                      <th>{isHi ? 'ग्रह' : 'Planet'}</th>
                      <th>{isHi ? 'बाल्यादि अवस्था' : 'Baladi'}</th>
                      <th>{isHi ? 'जाग्रदादि अवस्था' : 'Jagradadi'}</th>
                      <th>{isHi ? 'दीप्तादि अवस्था' : 'Deeptadi'}</th>
                      <th>{isHi ? 'फल क्षमता' : 'Potency'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upagrahaReport.avasthas.map((av) => (
                      <tr key={av.planet}>
                        <td style={{ fontWeight: 600 }}>{trPlanet(av.planet, lang)}</td>
                        <td>{av.baladi}</td>
                        <td>{av.jagratadi}</td>
                        <td>{av.deeptadi}</td>
                        <td><strong>{av.resultCapacity}</strong></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 8. DIVISION 6: ALL DASHA SYSTEMS (VIMSHOTTARI, TRIBHAGI, YOGINI, CHAR, ASHTOTTARI) */}
      {activeDivision === 6 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Sub-tab Navigation */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className={`btn btn-sm ${div6SubTab === 'vimshottari' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setDiv6SubTab('vimshottari')}
            >
              {isHi ? '1. विंशोत्तरी दशा (120 वर्ष - 5 स्तर)' : '1. Vimshottari Dasha (120 Yrs)'}
            </button>
            <button
              type="button"
              className={`btn btn-sm ${div6SubTab === 'tribhagi' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setDiv6SubTab('tribhagi')}
            >
              {isHi ? '2. त्रिभागी दशा (80 वर्ष चक्र)' : '2. Tribhagi Dasha (80 Yrs)'}
            </button>
            <button
              type="button"
              className={`btn btn-sm ${div6SubTab === 'yogini' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setDiv6SubTab('yogini')}
            >
              {isHi ? '3. योगिनी दशा (36 वर्ष)' : '3. Yogini Dasha (36 Yrs)'}
            </button>
            <button
              type="button"
              className={`btn btn-sm ${div6SubTab === 'char' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setDiv6SubTab('char')}
            >
              {isHi ? '4. जैमिनी चर दशा (Char Dasha)' : '4. Jaimini Char Dasha'}
            </button>
            <button
              type="button"
              className={`btn btn-sm ${div6SubTab === 'ashtottari' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setDiv6SubTab('ashtottari')}
            >
              {isHi ? '5. अष्टोत्तरी दशा (108 वर्ष)' : '5. Ashtottari Dasha (108 Yrs)'}
            </button>
            <button
              type="button"
              className={`btn btn-sm ${div6SubTab === 'predictions' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setDiv6SubTab('predictions')}
            >
              {isHi ? '6. दशा फलकथन व काल-खंड' : '6. Dasha Predictions'}
            </button>
          </div>

          {/* Sub-Tab 1: Vimshottari View */}
          {div6SubTab === 'vimshottari' && (
            <DashaView chart={chart} />
          )}

          {/* Sub-Tab 2: Tribhagi Dasha View */}
          {div6SubTab === 'tribhagi' && (
            <div className="card" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h3 style={{ margin: 0, fontSize: '15px' }}>
                  {isHi ? 'त्रिभागी दशा समय सारिणी (80-वर्षीय पारम्परिक चक्र)' : 'Tribhagi Dasha 80-Year Cycle Ledger'}
                </h3>
                <span className="tag tag-accent">{isHi ? '2/3 विंशोत्तरी अनुपात' : '2/3 Vimshottari Ratio'}</span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '12px' }}>
                {isHi
                  ? 'त्रिभागी दशा में नक्षत्र को तीन समान भागों (4°26\'40") में बांटा जाता है तथा कुल आयु 80 वर्ष मानकर दशाएं चलती हैं।'
                  : 'Tribhagi divides each 13°20\' Nakshatra into three 4°26\'40" portions with an 80-year total lifespan.'}
              </p>
              <div style={{ overflowX: 'auto' }}>
                <table className="compact-table" style={{ width: '100%', fontSize: '12px' }}>
                  <thead>
                    <tr>
                      <th>{isHi ? 'महादशा' : 'Mahadasha'}</th>
                      <th>{isHi ? 'आरंभ तिथि' : 'Start Date'}</th>
                      <th>{isHi ? 'समाप्ति तिथि' : 'End Date'}</th>
                      <th>{isHi ? 'अवधि' : 'Duration'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tribhagiData.map((td, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 700, color: 'var(--accent)' }}>{trPlanet(td.lord, lang)}</td>
                        <td>{new Date(td.startMs).toLocaleDateString()}</td>
                        <td>{new Date(td.endMs).toLocaleDateString()}</td>
                        <td>{(td.durationDays / 365.25).toFixed(1)} {isHi ? 'वर्ष' : 'Years'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Sub-Tab 3: Yogini Dasha */}
          {div6SubTab === 'yogini' && (
            <div className="card" style={{ padding: '16px' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '15px' }}>
                {isHi ? 'योगिनी दशा चक्र (36 वर्ष)' : 'Yogini Dasha 36-Year Cycle'}
              </h3>
              <div style={{ overflowX: 'auto' }}>
                <table className="compact-table" style={{ width: '100%', fontSize: '12px' }}>
                  <thead>
                    <tr>
                      <th>{isHi ? 'योगिनी' : 'Yogini'}</th>
                      <th>{isHi ? 'आरंभ तिथि' : 'Start Date'}</th>
                      <th>{isHi ? 'समाप्ति तिथि' : 'End Date'}</th>
                      <th>{isHi ? 'अवधि' : 'Duration'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {yoginiData.map((yd, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 700 }}>{yd.lord}</td>
                        <td>{new Date(yd.startMs).toLocaleDateString()}</td>
                        <td>{new Date(yd.endMs).toLocaleDateString()}</td>
                        <td>{(yd.durationDays / 365.25).toFixed(1)} {isHi ? 'वर्ष' : 'Years'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Sub-Tab 4: Jaimini Char Dasha */}
          {div6SubTab === 'char' && (
            <div className="card" style={{ padding: '16px' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '15px' }}>
                {isHi ? 'जैमिनी चर दशा (Jaimini Char Dasha)' : 'Jaimini Char Dasha (Rasi Dasha)'}
              </h3>
              <div style={{ overflowX: 'auto' }}>
                <table className="compact-table" style={{ width: '100%', fontSize: '12px' }}>
                  <thead>
                    <tr>
                      <th>{isHi ? 'राशि' : 'Sign'}</th>
                      <th>{isHi ? 'अवधि' : 'Duration'}</th>
                      <th>{isHi ? 'आरंभ' : 'Start'}</th>
                      <th>{isHi ? 'समाप्ति' : 'End'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {advancedDashas.narayana.map((nd, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 700 }}>{nd.signName}</td>
                        <td>{nd.years} {isHi ? 'वर्ष' : 'Years'}</td>
                        <td>{nd.startDate}</td>
                        <td>{nd.endDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Sub-Tab 5: Ashtottari Dasha */}
          {div6SubTab === 'ashtottari' && (
            <div className="card" style={{ padding: '16px' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '15px' }}>
                {isHi ? 'अष्टोत्तरी दशा (108 वर्ष)' : 'Ashtottari Dasha (108 Years)'}
              </h3>
              <div className="muted" style={{ fontSize: '12px', marginBottom: '10px' }}>
                {isHi ? `पात्रता: ${advancedDashas.ashtottariReason}` : `Eligibility: ${advancedDashas.ashtottariReason}`}
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table className="compact-table" style={{ width: '100%', fontSize: '12px' }}>
                  <thead>
                    <tr>
                      <th>{isHi ? 'दशा स्वामी' : 'Lord'}</th>
                      <th>{isHi ? 'वर्ष' : 'Years'}</th>
                      <th>{isHi ? 'आरंभ' : 'Start'}</th>
                      <th>{isHi ? 'समाप्ति' : 'End'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {advancedDashas.ashtottari.map((ad, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 700 }}>{trPlanet(ad.lord, lang)}</td>
                        <td>{ad.years} {isHi ? 'वर्ष' : 'Years'}</td>
                        <td>{ad.startDate}</td>
                        <td>{ad.endDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Sub-Tab 6: Dasha Predictions */}
          {div6SubTab === 'predictions' && (
            <div className="card" style={{ padding: '16px' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '15px' }}>
                {isHi ? 'वर्तमान दशा सक्रियता फलकथन' : 'Active Dasha Phase Predictions'}
              </h3>
              <p style={{ fontSize: '12.5px', lineHeight: 1.6, color: 'var(--text-primary)' }}>
                {isHi
                  ? 'वर्तमान में जातक जिस महादशा, अंतर्दशा एवं प्रत्यंतर्दशा से गुजर रहा है, उसके भाव स्वामित्व एवं नैसर्गिक स्वभाव के अनुसार अनुकूल व प्रतिकूल जीवन परिणाम परिलक्षित होते हैं।'
                  : 'Active dasha lords activate their natal house lordships and natural significations during their respective operating periods.'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* 9. DIVISION 7: GOCHAR & PLANETARY TRANSITS */}
      {activeDivision === 7 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Sub-tab Navigation */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className={`btn btn-sm ${div7SubTab === 'gochar_chart' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setDiv7SubTab('gochar_chart')}
            >
              {isHi ? '1. तात्कालिक गोचर कुंडली' : '1. Live Gochar Chart'}
            </button>
            <button
              type="button"
              className={`btn btn-sm ${div7SubTab === 'sade_sati' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setDiv7SubTab('sade_sati')}
            >
              {isHi ? '2. शनि साढ़ेसाती व ढैय्या' : '2. Shani Sade Sati & Dhaiya'}
            </button>
            <button
              type="button"
              className={`btn btn-sm ${div7SubTab === 'jupiter' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setDiv7SubTab('jupiter')}
            >
              {isHi ? '3. देवगुरु बृहस्पति गोचर' : '3. Jupiter Transit'}
            </button>
            <button
              type="button"
              className={`btn btn-sm ${div7SubTab === 'rahu_ketu' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setDiv7SubTab('rahu_ketu')}
            >
              {isHi ? '4. राहु-केतु गोचर' : '4. Rahu-Ketu Transit'}
            </button>
            <button
              type="button"
              className={`btn btn-sm ${div7SubTab === 'kakshya' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setDiv7SubTab('kakshya')}
            >
              {isHi ? '5. अष्टकवर्ग कक्ष्या गोचर' : '5. Ashtakavarga Kakshya'}
            </button>
          </div>

          {/* Sub-Tab 1: Live Gochar Chart */}
          {div7SubTab === 'gochar_chart' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px' }}>
              <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h3 style={{ margin: '0 0 12px', fontSize: '15px' }}>{isHi ? 'तात्कालिक गोचर कुंडली' : 'Live Gochar Planetary Chart'}</h3>
                <VedicChartSvg
                  title="Gochar"
                  style={chartStyle}
                  lagnaSignIndex={gocharChart.ascendant.signIndex}
                  items={getChartBadges(gocharChart.ascendant.signIndex, gocharChart.planets)}
                />
              </div>

              <div className="card" style={{ padding: '16px' }}>
                <h3 style={{ margin: '0 0 10px', fontSize: '14.5px' }}>{isHi ? 'जन्म चंद्र से वर्तमान गोचर' : 'Transit Longitudes vs Natal Moon'}</h3>
                <div style={{ overflowX: 'auto' }}>
                  <table className="compact-table" style={{ width: '100%', fontSize: '12px' }}>
                    <thead>
                      <tr>
                        <th>{isHi ? 'ग्रह' : 'Planet'}</th>
                        <th>{isHi ? 'गोचर राशि' : 'Transit Sign'}</th>
                        <th>{isHi ? 'चंद्र से भाव' : 'House from Moon'}</th>
                        <th>{isHi ? 'कक्ष्या बिंदु' : 'Kakshya'}</th>
                        <th>{isHi ? 'वेध' : 'Vedha'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deepGochar.items.map((tp) => (
                        <tr key={tp.planet}>
                          <td style={{ fontWeight: 600 }}>{trPlanet(tp.planet, lang)}</td>
                          <td>{tp.transitSign} ({tp.degreeInSign.toFixed(1)}°)</td>
                          <td>H{tp.houseFromMoon}</td>
                          <td>
                            <span className={`tag ${tp.kakshyaHasBindu ? 'tag-good' : 'tag-subtle'}`}>
                              {tp.kakshyaHasBindu ? 'Bindu' : '0'}
                            </span>
                          </td>
                          <td>
                            {tp.hasVedha ? <span className="tag tag-warn">Vedha</span> : <span className="tag tag-good">Clear</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Sub-Tab 2: Shani Sade Sati */}
          {div7SubTab === 'sade_sati' && (
            <div className="card" style={{ padding: '16px' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '15px' }}>
                {isHi ? 'शनि साढ़ेसाती व ढैय्या विवरण' : 'Shani Sade Sati & Dhaiya Ledger'}
              </h3>
              <p style={{ fontSize: '12.5px', lineHeight: 1.6, color: 'var(--text-primary)' }}>
                {deepGochar.overallSummary}
              </p>
            </div>
          )}

          {/* Sub-Tab 3: Jupiter Transit */}
          {div7SubTab === 'jupiter' && (
            <div className="card" style={{ padding: '16px' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '15px' }}>
                {isHi ? 'देवगुरु बृहस्पति गोचर प्रभाव' : 'Jupiter Transit Analysis'}
              </h3>
              <div style={{ fontSize: '12.5px', lineHeight: 1.6, color: 'var(--text-primary)' }}>
                {isHi
                  ? 'देवगुरु बृहस्पति का गोचर जातक की कुंडली में ज्ञान, संतान, धर्म, विवेक एवं आध्यात्मिक उन्नति का मुख्य कारक होता है।'
                  : 'Jupiter transit acts as the divine benefic catalyst activating wisdom, expansion, progeny, and fortune.'}
              </div>
            </div>
          )}

          {/* Sub-Tab 4: Rahu-Ketu Transit */}
          {div7SubTab === 'rahu_ketu' && (
            <div className="card" style={{ padding: '16px' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '15px' }}>
                {isHi ? 'राहु-केतु कर्मिक अक्ष गोचर' : 'Rahu-Ketu Karmic Axis Transit'}
              </h3>
              <div style={{ fontSize: '12.5px', lineHeight: 1.6, color: 'var(--text-primary)' }}>
                {isHi
                  ? 'राहु भौतिक महत्वाकांक्षा व आकस्मिक अवसरों को जगाता है, जबकि केतु विरक्ति, आत्म-मंथन व आध्यात्मिक मोक्ष का मार्ग प्रशस्त करता है।'
                  : 'Rahu activates worldly ambition and sudden shifts, whereas Ketu triggers detachment, introspection, and karmic release.'}
              </div>
            </div>
          )}

          {/* Sub-Tab 5: Ashtakavarga Kakshya */}
          {div7SubTab === 'kakshya' && (
            <div className="card" style={{ padding: '16px' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '15px' }}>
                {isHi ? 'अष्टकवर्ग कक्ष्या गोचर रेखाचित्र' : 'Ashtakavarga Kakshya Transit Tracking'}
              </h3>
              <p style={{ fontSize: '12.5px', lineHeight: 1.6 }}>
                {isHi
                  ? 'प्रत्येक राशि 3°45\' की 8 कक्ष्याओं (शनि, गुरु, मंगल, सूर्य, शुक्र, बुध, चंद्र व लग्न) में विभक्त होती है। जिस कक्ष्या में बिंदु प्राप्त होता है, वहां ग्रह शुभ फल प्रदान करता है।'
                  : 'Each sign is divided into eight 3°45\' Kakshyas. Transits through Kakshyas containing bindus yield positive outcomes.'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* 10. DIVISION 8: DEEP COMPREHENSIVE PREDICTIONS & REMEDIES (BIRTH REPORT REFERENCE PARITY) */}
      {activeDivision === 8 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Sub-tab Navigation */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button type="button" className={`btn btn-sm ${div8SubTab === 'horoscope_analysis' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setDiv8SubTab('horoscope_analysis')}>
              {isHi ? '1. लग्न व कुंडली विश्लेषण (Horoscope & Lagna)' : '1. Horoscope & Lagna Analysis'}
            </button>
            <button type="button" className={`btn btn-sm ${div8SubTab === 'house_lords_144' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setDiv8SubTab('house_lords_144')}>
              {isHi ? '2. द्वादश भावेश फल (12 House Lords)' : '2. 12 House Lords (Bhavesha)'}
            </button>
            <button type="button" className={`btn btn-sm ${div8SubTab === 'planet_wise' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setDiv8SubTab('planet_wise')}>
              {isHi ? '3. ग्रह राशि व भाव फल (Planetary Positions)' : '3. Planetary Positions (Sign & House)'}
            </button>
            <button type="button" className={`btn btn-sm ${div8SubTab === 'yuti' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setDiv8SubTab('yuti')}>
              {isHi ? '4. शास्त्रीय योग एवं युति (Classical & Conjunction Yogas)' : '4. Yogas & Conjunctions'}
            </button>
            <button type="button" className={`btn btn-sm ${div8SubTab === 'sav_houses' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setDiv8SubTab('sav_houses')}>
              {isHi ? '5. सर्वाष्टकवर्ग 12 भाव फल (SAV 12 Houses)' : '5. SAV 12 House Predictions'}
            </button>
            <button type="button" className={`btn btn-sm ${div8SubTab === 'major_transits' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setDiv8SubTab('major_transits')}>
              {isHi ? '6. प्रमुख गोचर फल (Major Transits)' : '6. Major Transits (Gochar)'}
            </button>
            <button type="button" className={`btn btn-sm ${div8SubTab === 'dasha_predictions' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setDiv8SubTab('dasha_predictions')}>
              {isHi ? '7. विंशोत्तरी महादशा फल (Vimshottari Dasha)' : '7. Vimshottari Dasha Predictions'}
            </button>
            <button type="button" className={`btn btn-sm ${div8SubTab === 'yogini_predictions' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setDiv8SubTab('yogini_predictions')}>
              {isHi ? '8. योगिनी दशा फल (Yogini Dasha)' : '8. Yogini Dasha Predictions'}
            </button>
            <button type="button" className={`btn btn-sm ${div8SubTab === 'doshas' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setDiv8SubTab('doshas')}>
              {isHi ? '9. कुंडली दोष व परिहार (Doshas & Mitigations)' : '9. Kundali Doshas'}
            </button>
            <button type="button" className={`btn btn-sm ${div8SubTab === 'remedies' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setDiv8SubTab('remedies')}>
              {isHi ? '10. संपूर्ण वैदिक उपाय व स्तोत्र (Vedic Remedies)' : '10. Vedic Remedies & Mantras'}
            </button>
          </div>

          {/* Sub-Tab 1: Horoscope & Lagna Comprehensive Analysis */}
          {div8SubTab === 'horoscope_analysis' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Classical Shloka Banner */}
              <div className="card" style={{ padding: '16px', background: 'var(--bg-subtle)', textAlign: 'center', borderLeft: '4px solid var(--accent)' }}>
                <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.5px' }}>
                  जननी जन्म सौख्यानां वर्धनी कुल संपदाम् । पदवी पूर्व पुण्यानां लिख्यते जन्म पत्रिका ॥
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  {isHi
                    ? 'माता के सुख की वृद्धि करने वाली, कुल की संपदा को बढ़ाने वाली तथा पूर्व जन्म के पुण्यों से प्राप्त पदवी को प्रकट करने वाली जन्मपत्रिका का शास्त्रीय फलकथन।'
                    : 'The natal horoscope revealing motherly comfort, ancestral lineage prosperity, and destiny fruits earned through past-life merits.'}
                </div>
              </div>

              {/* 1.1 Horoscope Analysis (12 Houses Table & Rulerships) */}
              <div className="card" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ margin: 0, fontSize: '15px', color: 'var(--accent)' }}>
                    {isHi ? 'द्वादश भाव विश्लेषण (Horoscope Analysis - House by House)' : 'Horoscope Analysis - 12 Bhavas Rulership & Placements'}
                  </h3>
                  <span className="tag tag-accent">{trSign(chart.ascendant.signIndex, lang)} Lagna</span>
                </div>
                <div className="table-scroll">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>{isHi ? 'भाव' : 'House'}</th>
                        <th>{isHi ? 'भाव संज्ञा / कारकत्व' : 'Bhava Title & Domain'}</th>
                        <th>{isHi ? 'राशि' : 'Zodiac Sign'}</th>
                        <th>{isHi ? 'भावेश (स्वामी)' : 'Lord (Ruler)'}</th>
                        <th>{isHi ? 'भावेश की स्थिति' : 'Lord Placed in'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {refPdfPred.horoscopeAnalysis.houses.map((h) => (
                        <tr key={h.houseNumber}>
                          <td><strong>House {h.houseNumber}</strong></td>
                          <td>{isHi ? h.houseNameHi : h.houseNameEn}</td>
                          <td><strong>{isHi ? h.signNameHi : h.signNameEn}</strong></td>
                          <td><strong>{isHi ? h.rulerNameHi : h.rulerNameEn}</strong></td>
                          <td>
                            <span className="tag tag-subtle">
                              {isHi ? `भाव ${h.placedInHouse} (${SIGN_HI[h.placedSignIndex]})` : `House ${h.placedInHouse} (${SIGNS[h.placedSignIndex].name})`}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Ascendant Classification (Benefic, Malefic, Maraka, Yogakaraka) */}
                <div style={{ marginTop: '16px', padding: '14px', background: 'var(--bg-subtle)', borderRadius: '6px' }}>
                  <div style={{ fontSize: '13.5px', fontWeight: 700, marginBottom: '8px' }}>
                    {isHi ? `आपके ${trSign(chart.ascendant.signIndex, lang)} लग्न हेतु ग्रह वर्गीकरण:` : `For your ${trSign(chart.ascendant.signIndex, lang)} Ascendant:`}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px', fontSize: '12.5px' }}>
                    <div>
                      <strong style={{ color: 'var(--good, #22c55e)' }}>{isHi ? 'शुभ ग्रह (Benefics):' : 'Benefic Planets:'}</strong>{' '}
                      {isHi ? refPdfPred.horoscopeAnalysis.beneficsHi.join(', ') : refPdfPred.horoscopeAnalysis.benefics.join(', ')}
                    </div>
                    <div>
                      <strong style={{ color: 'var(--warn, #eab308)' }}>{isHi ? 'अशुभ ग्रह (Malefics):' : 'Malefic Planets:'}</strong>{' '}
                      {isHi ? refPdfPred.horoscopeAnalysis.maleficsHi.join(', ') : refPdfPred.horoscopeAnalysis.malefics.join(', ')}
                    </div>
                    <div>
                      <strong style={{ color: 'var(--bad, #ef4444)' }}>{isHi ? 'मारक ग्रह (Marakas):' : 'Maraka Planets:'}</strong>{' '}
                      {isHi ? refPdfPred.horoscopeAnalysis.marakasHi.join(', ') : refPdfPred.horoscopeAnalysis.marakas.join(', ')}
                    </div>
                    <div>
                      <strong style={{ color: 'var(--accent)' }}>{isHi ? 'योगकारक ग्रह (Yoga Karaka):' : 'Yoga Karaka Planet:'}</strong>{' '}
                      {isHi ? refPdfPred.horoscopeAnalysis.yogakarakaHi || 'कोई नहीं' : refPdfPred.horoscopeAnalysis.yogakaraka || 'None'}
                    </div>
                  </div>
                </div>
              </div>

              {/* 1.2 Birth-Time Predictions (Ritu, Masa, Tithi, Weekday) */}
              <div className="card" style={{ padding: '16px' }}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '15px', color: 'var(--accent)' }}>
                  {isHi ? 'जन्म-काल फल (Birth-Time Predictions)' : 'Birth-Time Predictions (Ritu, Masa, Tithi, Weekday)'}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '12px' }}>
                  <div className="card" style={{ padding: '12px', borderLeft: '3px solid var(--accent)' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>
                      {isHi ? `जन्म ऋतु फल — ${refPdfPred.birthTimePredictions.ritu.nameHi}` : `Birth Season (Ritu) — ${refPdfPred.birthTimePredictions.ritu.nameEn}`}
                    </div>
                    <div style={{ fontSize: '12px', lineHeight: 1.5, color: 'var(--text-primary)' }}>
                      {isHi ? refPdfPred.birthTimePredictions.ritu.resultHi : refPdfPred.birthTimePredictions.ritu.resultEn}
                    </div>
                  </div>

                  <div className="card" style={{ padding: '12px', borderLeft: '3px solid var(--accent)' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>
                      {isHi ? `जन्म मास फल — ${refPdfPred.birthTimePredictions.masa.nameHi}` : `Birth Month (Masa) — ${refPdfPred.birthTimePredictions.masa.nameEn}`}
                    </div>
                    <div style={{ fontSize: '12px', lineHeight: 1.5, color: 'var(--text-primary)' }}>
                      {isHi ? refPdfPred.birthTimePredictions.masa.resultHi : refPdfPred.birthTimePredictions.masa.resultEn}
                    </div>
                  </div>

                  <div className="card" style={{ padding: '12px', borderLeft: '3px solid var(--accent)' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>
                      {isHi ? `जन्म तिथि फल — ${refPdfPred.birthTimePredictions.tithi.nameHi}` : `Birth Tithi — ${refPdfPred.birthTimePredictions.tithi.nameEn}`}
                    </div>
                    <div style={{ fontSize: '12px', lineHeight: 1.5, color: 'var(--text-primary)' }}>
                      {isHi ? refPdfPred.birthTimePredictions.tithi.resultHi : refPdfPred.birthTimePredictions.tithi.resultEn}
                    </div>
                  </div>

                  <div className="card" style={{ padding: '12px', borderLeft: '3px solid var(--accent)' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>
                      {isHi ? `जन्म वार फल — ${refPdfPred.birthTimePredictions.weekday.nameHi}` : `Birth Weekday — ${refPdfPred.birthTimePredictions.weekday.nameEn}`}
                    </div>
                    <div style={{ fontSize: '12px', lineHeight: 1.5, color: 'var(--text-primary)' }}>
                      {isHi ? refPdfPred.birthTimePredictions.weekday.resultHi : refPdfPred.birthTimePredictions.weekday.resultEn}
                    </div>
                    {refPdfPred.birthTimePredictions.weekday.isPreSunrise && (
                      <div className="muted" style={{ fontSize: '11px', marginTop: '4px' }}>
                        {isHi
                          ? 'विशेष: अंग्रेजी कैलेंडर अनुसार जन्म रविवार को किंतु सूर्योदय से पूर्व होने के कारण भारतीय ज्योतिष अनुसार वार शनिवार माना जाएगा।'
                          : 'Note: Birth occurred before sunrise, so classical Hindu weekday is calculated from prior solar day.'}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 1.3 Birth Nakshatra In-Depth Reading */}
              <div className="card" style={{ padding: '16px', borderLeft: '4px solid var(--accent)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h3 style={{ margin: 0, fontSize: '15px', color: 'var(--accent)' }}>
                    {isHi ? `जन्म नक्षत्र फल — ${refPdfPred.birthNakshatra.nameHi} (चरण ${refPdfPred.birthNakshatra.pada})` : `Birth Nakshatra — ${refPdfPred.birthNakshatra.nameEn} (Pada ${refPdfPred.birthNakshatra.pada})`}
                  </h3>
                  <span className="tag tag-accent">
                    {isHi ? `अधिदेवता: ${refPdfPred.birthNakshatra.deityHi}` : `Deity: ${refPdfPred.birthNakshatra.deityEn}`}
                  </span>
                </div>
                <div style={{ fontSize: '12.5px', lineHeight: 1.6, color: 'var(--text-primary)' }}>
                  {isHi ? refPdfPred.birthNakshatra.fullReadingHi : refPdfPred.birthNakshatra.fullReadingEn}
                </div>
              </div>

              {/* 1.4 Lagna In-Depth 11-Dimensional Analysis */}
              <div className="card" style={{ padding: '16px' }}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '15px', color: 'var(--accent)' }}>
                  {isHi ? `लग्न संपूर्ण फलादेश — ${refPdfPred.lagnaPredictions.signHi} लग्न (स्वामी: ${refPdfPred.lagnaPredictions.rulerHi})` : `Ascendant In-Depth Predictions — ${refPdfPred.lagnaPredictions.signEn} Lagna (Lord: ${refPdfPred.lagnaPredictions.rulerEn})`}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {/* Physical Features */}
                  <div style={{ padding: '12px', background: 'var(--bg-subtle)', borderRadius: '6px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent)', marginBottom: '4px' }}>
                      {isHi ? '1. शारीरिक गठन व स्वरूप (Physical Features)' : '1. Physical Features & Body Constitution'}
                    </div>
                    <div style={{ fontSize: '12.5px', lineHeight: 1.5 }}>
                      {isHi ? refPdfPred.lagnaPredictions.physicalFeaturesHi : refPdfPred.lagnaPredictions.physicalFeaturesEn}
                    </div>
                  </div>

                  {/* Mentality & Lifestyle */}
                  <div style={{ padding: '12px', background: 'var(--bg-subtle)', borderRadius: '6px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent)', marginBottom: '4px' }}>
                      {isHi ? '2. मानसिकता व जीवनशैली (Mentality and Lifestyle)' : '2. Mentality & Lifestyle'}
                    </div>
                    <div style={{ fontSize: '12.5px', lineHeight: 1.5 }}>
                      {isHi ? refPdfPred.lagnaPredictions.mentalityLifestyleHi : refPdfPred.lagnaPredictions.mentalityLifestyleEn}
                    </div>
                  </div>

                  {/* Likes & Dislikes */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
                    <div style={{ padding: '12px', background: 'var(--bg-subtle)', borderRadius: '6px' }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--good, #22c55e)', marginBottom: '4px' }}>
                        {isHi ? '3. पसंद (Likes)' : '3. Likes'}
                      </div>
                      <div style={{ fontSize: '12px', lineHeight: 1.5 }}>
                        {isHi ? refPdfPred.lagnaPredictions.likesHi : refPdfPred.lagnaPredictions.likesEn}
                      </div>
                    </div>
                    <div style={{ padding: '12px', background: 'var(--bg-subtle)', borderRadius: '6px' }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--bad, #ef4444)', marginBottom: '4px' }}>
                        {isHi ? '4. नापसंद (Dislikes)' : '4. Dislikes'}
                      </div>
                      <div style={{ fontSize: '12px', lineHeight: 1.5 }}>
                        {isHi ? refPdfPred.lagnaPredictions.dislikesHi : refPdfPred.lagnaPredictions.dislikesEn}
                      </div>
                    </div>
                  </div>

                  {/* Strengths & Weaknesses (Point by Point) */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '12px' }}>
                    <div style={{ padding: '12px', background: 'var(--bg-subtle)', borderRadius: '6px', borderLeft: '3px solid var(--good, #22c55e)' }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--good, #22c55e)', marginBottom: '6px' }}>
                        {isHi ? '5. आपकी प्रमुख शक्तियां (Your Strengths)' : '5. Your Core Strengths'}
                      </div>
                      <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', lineHeight: 1.6 }}>
                        {(isHi ? refPdfPred.lagnaPredictions.strengthsHi : refPdfPred.lagnaPredictions.strengthsEn).map((st, i) => (
                          <li key={i}>{st}</li>
                        ))}
                      </ul>
                    </div>

                    <div style={{ padding: '12px', background: 'var(--bg-subtle)', borderRadius: '6px', borderLeft: '3px solid var(--warn, #eab308)' }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--warn, #eab308)', marginBottom: '6px' }}>
                        {isHi ? '6. कमजोरियां व सुधार क्षेत्र (Your Weaknesses)' : '6. Weaknesses & Improvement Areas'}
                      </div>
                      <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', lineHeight: 1.6 }}>
                        {(isHi ? refPdfPred.lagnaPredictions.weaknessesHi : refPdfPred.lagnaPredictions.weaknessesEn).map((wk, i) => (
                          <li key={i}>{wk}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Education, Health, Financial, Love/Marriage, Family, Profession */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '12px' }}>
                    <div style={{ padding: '12px', background: 'var(--bg-subtle)', borderRadius: '6px' }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent)', marginBottom: '4px' }}>
                        {isHi ? '7. शिक्षा व अध्ययन (Education)' : '7. Education'}
                      </div>
                      <div style={{ fontSize: '12px', lineHeight: 1.5 }}>
                        {isHi ? refPdfPred.lagnaPredictions.educationHi : refPdfPred.lagnaPredictions.educationEn}
                      </div>
                    </div>

                    <div style={{ padding: '12px', background: 'var(--bg-subtle)', borderRadius: '6px' }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent)', marginBottom: '4px' }}>
                        {isHi ? '8. स्वास्थ्य (Health)' : '8. Health'}
                      </div>
                      <div style={{ fontSize: '12px', lineHeight: 1.5 }}>
                        {isHi ? refPdfPred.lagnaPredictions.healthHi : refPdfPred.lagnaPredictions.healthEn}
                      </div>
                    </div>

                    <div style={{ padding: '12px', background: 'var(--bg-subtle)', borderRadius: '6px' }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent)', marginBottom: '4px' }}>
                        {isHi ? '9. आर्थिक स्थिति (Financial Life)' : '9. Financial Life'}
                      </div>
                      <div style={{ fontSize: '12px', lineHeight: 1.5 }}>
                        {isHi ? refPdfPred.lagnaPredictions.financialLifeHi : refPdfPred.lagnaPredictions.financialLifeEn}
                      </div>
                    </div>

                    <div style={{ padding: '12px', background: 'var(--bg-subtle)', borderRadius: '6px' }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent)', marginBottom: '4px' }}>
                        {isHi ? '10. प्रेम व दांपत्य (Love and Marriage)' : '10. Love and Marriage'}
                      </div>
                      <div style={{ fontSize: '12px', lineHeight: 1.5 }}>
                        {isHi ? refPdfPred.lagnaPredictions.loveMarriageHi : refPdfPred.lagnaPredictions.loveMarriageEn}
                      </div>
                    </div>

                    <div style={{ padding: '12px', background: 'var(--bg-subtle)', borderRadius: '6px' }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent)', marginBottom: '4px' }}>
                        {isHi ? '11. परिवार (Family)' : '11. Family'}
                      </div>
                      <div style={{ fontSize: '12px', lineHeight: 1.5 }}>
                        {isHi ? refPdfPred.lagnaPredictions.familyHi : refPdfPred.lagnaPredictions.familyEn}
                      </div>
                    </div>

                    <div style={{ padding: '12px', background: 'var(--bg-subtle)', borderRadius: '6px' }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent)', marginBottom: '4px' }}>
                        {isHi ? '12. व्यवसाय व करियर (Profession)' : '12. Profession'}
                      </div>
                      <div style={{ fontSize: '12px', lineHeight: 1.5 }}>
                        {isHi ? refPdfPred.lagnaPredictions.professionHi : refPdfPred.lagnaPredictions.professionEn}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sub-Tab 2: 12 House Lords in Houses (Bhavesha) */}
          {div8SubTab === 'house_lords_144' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="card" style={{ padding: '16px' }}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '15px', color: 'var(--accent)' }}>
                  {isHi ? 'द्वादश भावेशों का आपकी जन्मकुंडली में वास्तविक फल (Natal House Lords Placed in Various Houses)' : 'Predictions of House Lords Placed in Various Houses'}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '12px' }}>
                  {refPdfPred.houseLordsPredictions.map((hl) => (
                    <div key={hl.lordHouse} className="card" style={{ padding: '12px', borderLeft: '3px solid var(--accent)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <strong style={{ fontSize: '13.5px', color: 'var(--accent)' }}>
                          {isHi ? `${hl.lordHouse}वें भाव के स्वामी (${hl.lordPlanetHi})` : `Lord of House ${hl.lordHouse} (${hl.lordPlanetEn})`}
                        </strong>
                        <span className="tag tag-subtle">
                          {isHi ? `${hl.placedHouse}वें भाव में (${hl.placedSignHi})` : `In House ${hl.placedHouse} (${hl.placedSignEn})`}
                        </span>
                      </div>
                      <div style={{ fontSize: '12px', lineHeight: 1.5, color: 'var(--text-primary)', marginBottom: '6px' }}>
                        {isHi ? hl.readingHi : hl.readingEn}
                      </div>
                      <div className="muted" style={{ fontSize: '11.5px' }}>
                        <strong>{isHi ? 'संभावित घटनाक्रम:' : 'Likely Event:'}</strong> {isHi ? hl.eventScenarioHi : hl.eventScenarioEn}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive 144 Combination Explorer */}
              <div className="card" style={{ padding: '16px' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: 'var(--accent)' }}>
                  {isHi ? '144 भावेश संयोजन अन्वेषक (Interactive 144 Bhavesha Combinations Explorer)' : 'Interactive 144 Bhavesha Combinations Explorer'}
                </h4>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '12px' }}>
                  <div>
                    <span style={{ fontSize: '12.5px', fontWeight: 600, marginRight: '6px' }}>{isHi ? 'किस भाव के स्वामी:' : 'Lord of House:'}</span>
                    <select aria-label="Select Lord House" value={selectedBhaveshaLord} onChange={(e) => setSelectedBhaveshaLord(parseInt(e.target.value, 10))} style={{ padding: '4px 8px', fontSize: '12.5px' }}>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>House {n} Lord</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <span style={{ fontSize: '12.5px', fontWeight: 600, marginRight: '6px' }}>{isHi ? 'किस भाव में स्थित:' : 'Posited in House:'}</span>
                    <select aria-label="Select Occupied House" value={selectedBhaveshaHouse} onChange={(e) => setSelectedBhaveshaHouse(parseInt(e.target.value, 10))} style={{ padding: '4px 8px', fontSize: '12.5px' }}>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>House {n}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {(() => {
                  const combo = getBhavesha144Entry(selectedBhaveshaLord, selectedBhaveshaHouse);
                  return (
                    <div style={{ padding: '12px', background: 'var(--bg-subtle)', borderRadius: '6px' }}>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--accent)', marginBottom: '4px' }}>
                        {isHi ? combo.headlineHi : combo.headlineEn}
                      </div>
                      <p style={{ margin: '0 0 8px', fontSize: '12.5px', lineHeight: 1.6, color: 'var(--text-primary)' }}>
                        {isHi ? combo.readingHi : combo.readingEn}
                      </p>
                      <div className="muted" style={{ fontSize: '12px' }}>
                        <strong>{isHi ? 'यथार्थवादी परिदृश्य:' : 'Realistic Scenario:'}</strong> {isHi ? combo.eventHi : combo.eventEn}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* Sub-Tab 3: Planetary Positions & House Predictions (Sun to Ketu: Zodiac + House) */}
          {div8SubTab === 'planet_wise' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
              {refPdfPred.planetaryPositionsPredictions.map((pl) => (
                <div key={pl.planetId} className="card" style={{ padding: '14px', borderLeft: '3px solid var(--accent)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <strong style={{ fontSize: '14.5px', color: 'var(--accent)' }}>
                      {isHi ? pl.planetHi : pl.planetEn}
                    </strong>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <span className="tag tag-accent">{isHi ? pl.signHi : pl.signEn}</span>
                      <span className="tag tag-subtle">H{pl.houseNumber}</span>
                      {pl.isRetrograde && <span className="tag tag-warn">{isHi ? 'वक्री' : 'Rx'}</span>}
                      {pl.isCombust && <span className="tag tag-bad">{isHi ? 'अस्त' : 'Combust'}</span>}
                    </div>
                  </div>

                  {/* Results of Zodiac Position */}
                  <div style={{ marginBottom: '8px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>
                      {isHi ? `राशिगत स्थिति का फल (${pl.planetHi} in ${pl.signHi}):` : `Results of Zodiac Position (${pl.planetEn} in ${pl.signEn}):`}
                    </div>
                    <div style={{ fontSize: '12px', lineHeight: 1.5, color: 'var(--text-primary)', marginTop: '2px' }}>
                      {isHi ? pl.zodiacPositionReadingHi : pl.zodiacPositionReadingEn}
                    </div>
                  </div>

                  {/* Results of House Position */}
                  <div style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '6px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>
                      {isHi ? `भावगत स्थिति का फल (House ${pl.houseNumber}):` : `Results of House Position (House ${pl.houseNumber}):`}
                    </div>
                    <div style={{ fontSize: '12px', lineHeight: 1.5, color: 'var(--text-primary)', marginTop: '2px' }}>
                      {isHi ? pl.housePositionReadingHi : pl.housePositionReadingEn}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Sub-Tab 4: Classical Yogas & Conjunctions (Dwi, Tri, Chatur) */}
          {div8SubTab === 'yuti' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Conjunction Yogas (Dwi, Tri, Chatur) */}
              <div className="card" style={{ padding: '16px' }}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '15px', color: 'var(--accent)' }}>
                  {isHi ? 'ग्रह युति फल (Conjunction Yogas — Dwi, Tri, Chatur Graha Yogas)' : 'Conjunction Yogas (Two, Three & Four Planets in One Sign)'}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {refPdfPred.variousYogas.dwiGrahaYogas.map((dwi, idx) => (
                    <div key={`dwi-${idx}`} className="card" style={{ padding: '12px', borderLeft: '3px solid var(--accent)' }}>
                      <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--accent)', marginBottom: '4px' }}>
                        {isHi ? dwi.titleHi : dwi.titleEn}
                      </div>
                      <div style={{ fontSize: '12px', lineHeight: 1.5 }}>
                        {isHi ? dwi.readingHi : dwi.readingEn}
                      </div>
                    </div>
                  ))}

                  {refPdfPred.variousYogas.triGrahaYogas.map((tri, idx) => (
                    <div key={`tri-${idx}`} className="card" style={{ padding: '12px', borderLeft: '3px solid var(--good, #22c55e)' }}>
                      <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--good, #22c55e)', marginBottom: '4px' }}>
                        {isHi ? tri.titleHi : tri.titleEn}
                      </div>
                      <div style={{ fontSize: '12px', lineHeight: 1.5 }}>
                        {isHi ? tri.readingHi : tri.readingEn}
                      </div>
                    </div>
                  ))}

                  {refPdfPred.variousYogas.chaturGrahaYogas.map((chatur, idx) => (
                    <div key={`chatur-${idx}`} className="card" style={{ padding: '12px', borderLeft: '3px solid var(--warn, #eab308)' }}>
                      <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--warn, #eab308)', marginBottom: '4px' }}>
                        {isHi ? chatur.titleHi : chatur.titleEn}
                      </div>
                      <div style={{ fontSize: '12px', lineHeight: 1.5 }}>
                        {isHi ? chatur.readingHi : chatur.readingEn}
                      </div>
                    </div>
                  ))}

                  {refPdfPred.variousYogas.dwiGrahaYogas.length === 0 && refPdfPred.variousYogas.triGrahaYogas.length === 0 && refPdfPred.variousYogas.chaturGrahaYogas.length === 0 && (
                    <div className="muted" style={{ padding: '12px' }}>
                      {isHi ? 'कुंडली में कोई बहु-ग्रह युति समूह नहीं मिला।' : 'No multi-planet conjunctions found in natal D-1.'}
                    </div>
                  )}
                </div>
              </div>

              {/* Classical Detected Yogas */}
              <div className="card" style={{ padding: '16px' }}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '15px', color: 'var(--accent)' }}>
                  {isHi ? 'कुंडली में निर्मित प्रमुख शास्त्रीय योग (Classical Yogas)' : 'Classical Vedic Yogas Detected in Chart'}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '12px' }}>
                  {refPdfPred.variousYogas.classicalYogas.map((y, idx) => (
                    <div key={idx} className="card" style={{ padding: '12px', borderLeft: '3px solid var(--accent)' }}>
                      <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--accent)', marginBottom: '4px' }}>
                        {isHi ? y.nameHi : y.nameEn}
                      </div>
                      <div style={{ fontSize: '12px', lineHeight: 1.5, color: 'var(--text-primary)' }}>
                        {isHi ? y.readingHi : y.readingEn}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Sub-Tab 5: Samudaya Ashtakavarga (SAV) 12 Houses Strength & Predictions */}
          {div8SubTab === 'sav_houses' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="card" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ margin: 0, fontSize: '15px', color: 'var(--accent)' }}>
                    {isHi ? 'सर्वाष्टकवर्ग (SAV) 12 भाव फलादेश एवं भाव-बल (Pages 111-113 Parity)' : 'Natal Samudaya Ashtakavarga Predictions (House Strength & Life Effects)'}
                  </h3>
                  <span className="tag tag-accent">Total SAV = {chart.ashtakavarga.totalBindus} Points</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '12px' }}>
                  {refPdfPred.savHousePredictions.map((hp) => (
                    <div
                      key={hp.houseNumber}
                      className="card"
                      style={{
                        padding: '12px',
                        borderLeft: `3px solid ${
                          hp.ratingEn === 'Excellent' ? 'var(--good, #22c55e)' : hp.ratingEn === 'Good' ? 'var(--accent)' : hp.ratingEn === 'Demands Attention' ? 'var(--warn, #eab308)' : 'var(--text-secondary)'
                        }`,
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <strong style={{ fontSize: '13px' }}>
                          {isHi ? hp.houseNameHi : hp.houseNameEn}
                        </strong>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <span className="tag tag-subtle">{isHi ? hp.signHi : hp.signEn}</span>
                          <span
                            className={`tag ${
                              hp.ratingEn === 'Excellent'
                                ? 'tag-good'
                                : hp.ratingEn === 'Good'
                                ? 'tag-accent'
                                : hp.ratingEn === 'Demands Attention'
                                ? 'tag-warn'
                                : 'tag-subtle'
                            }`}
                          >
                            {hp.points} Pts ({isHi ? hp.ratingHi : hp.ratingEn})
                          </span>
                        </div>
                      </div>
                      <div style={{ fontSize: '12px', lineHeight: 1.5, color: 'var(--text-primary)' }}>
                        {isHi ? hp.predictionHi : hp.predictionEn}
                      </div>
                      {hp.remedyHi && (
                        <div style={{ marginTop: '6px', fontSize: '11.5px', color: 'var(--accent)', borderTop: '1px dashed var(--border-color)', paddingTop: '4px' }}>
                          <strong>{isHi ? 'शास्त्रीय उपाय:' : 'Remedy:'}</strong> {isHi ? hp.remedyHi : hp.remedyEn}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Sub-Tab 6: Major Planetary Transits (Gochar: Saturn, Jupiter, Rahu-Ketu) */}
          {div8SubTab === 'major_transits' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Saturn Transit */}
              <div className="card" style={{ padding: '16px', borderLeft: '4px solid var(--accent)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h3 style={{ margin: 0, fontSize: '15px', color: 'var(--accent)' }}>
                    {isHi ? `शनि गोचर फलादेश — ${refPdfPred.majorTransits.saturn.transitNameHi}` : `Saturn Transit Predictions — ${refPdfPred.majorTransits.saturn.transitNameEn}`}
                  </h3>
                  <span className="tag tag-accent">
                    {isHi ? `चंद्र से ${refPdfPred.majorTransits.saturn.houseFromMoon}वां भाव (${refPdfPred.majorTransits.saturn.transitSignHi})` : `House ${refPdfPred.majorTransits.saturn.houseFromMoon} from Moon (${refPdfPred.majorTransits.saturn.transitSignEn})`}
                  </span>
                </div>

                <div style={{ fontSize: '12.5px', lineHeight: 1.6, marginBottom: '8px' }}>
                  <strong>{isHi ? 'संभावित शुभ फल:' : 'Likely Outcomes:'}</strong>
                  <ul style={{ margin: '4px 0 8px 0', paddingLeft: '18px' }}>
                    {(isHi ? refPdfPred.majorTransits.saturn.likelyResultsHi : refPdfPred.majorTransits.saturn.likelyResultsEn).map((res, i) => (
                      <li key={i}>{res}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ padding: '8px 12px', background: 'var(--bg-subtle)', borderRadius: '4px', fontSize: '12px', color: 'var(--warn, #eab308)', marginBottom: '8px' }}>
                  <strong>{isHi ? 'सावधानी:' : 'Caution:'}</strong> {isHi ? refPdfPred.majorTransits.saturn.cautionHi : refPdfPred.majorTransits.saturn.cautionEn}
                </div>

                <div style={{ fontSize: '12px', color: 'var(--accent)' }}>
                  <strong>{isHi ? 'पारंपरिक उपाय:' : 'Traditional Remedies:'}</strong> {isHi ? refPdfPred.majorTransits.saturn.remediesHi : refPdfPred.majorTransits.saturn.remediesEn}
                </div>
              </div>

              {/* Jupiter Transit */}
              <div className="card" style={{ padding: '16px', borderLeft: '4px solid var(--good, #22c55e)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h3 style={{ margin: 0, fontSize: '15px', color: 'var(--good, #22c55e)' }}>
                    {isHi ? `बृहस्पति (गुरु) गोचर फलादेश — ${refPdfPred.majorTransits.jupiter.transitNameHi}` : `Jupiter Transit Predictions — ${refPdfPred.majorTransits.jupiter.transitNameEn}`}
                  </h3>
                  <span className="tag tag-good">
                    {isHi ? `चंद्र से ${refPdfPred.majorTransits.jupiter.houseFromMoon}वां भाव (${refPdfPred.majorTransits.jupiter.transitSignHi})` : `House ${refPdfPred.majorTransits.jupiter.houseFromMoon} from Moon (${refPdfPred.majorTransits.jupiter.transitSignEn})`}
                  </span>
                </div>

                <div style={{ fontSize: '12.5px', lineHeight: 1.6, marginBottom: '8px' }}>
                  <strong>{isHi ? 'संभावित शुभ फल:' : 'Likely Outcomes:'}</strong>
                  <ul style={{ margin: '4px 0 8px 0', paddingLeft: '18px' }}>
                    {(isHi ? refPdfPred.majorTransits.jupiter.likelyResultsHi : refPdfPred.majorTransits.jupiter.likelyResultsEn).map((res, i) => (
                      <li key={i}>{res}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ marginBottom: '8px', fontSize: '12px' }}>
                  <strong>{isHi ? 'गुरु की अमृत दृष्टियों का फल:' : 'Jupiter Aspect Results (5th, 7th, 9th):'}</strong>
                  <ul style={{ margin: '4px 0 0 0', paddingLeft: '18px' }}>
                    {(isHi ? refPdfPred.majorTransits.jupiter.aspectsHi : refPdfPred.majorTransits.jupiter.aspectsEn).map((asp, i) => (
                      <li key={i}>{asp}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ padding: '8px 12px', background: 'var(--bg-subtle)', borderRadius: '4px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                  <strong>{isHi ? 'सावधानी:' : 'Caution:'}</strong> {isHi ? refPdfPred.majorTransits.jupiter.cautionHi : refPdfPred.majorTransits.jupiter.cautionEn}
                </div>
              </div>

              {/* Rahu-Ketu Transit */}
              <div className="card" style={{ padding: '16px', borderLeft: '4px solid var(--accent)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h3 style={{ margin: 0, fontSize: '15px', color: 'var(--accent)' }}>
                    {isHi ? 'राहु एवं केतु गोचर फलादेश' : 'Rahu & Ketu Planetary Transit Predictions'}
                  </h3>
                  <span className="tag tag-subtle">
                    {isHi ? `राहु: भाव ${refPdfPred.majorTransits.rahuKetu.rahuHouseFromMoon} · केतु: भाव ${refPdfPred.majorTransits.rahuKetu.ketuHouseFromMoon}` : `Rahu: H${refPdfPred.majorTransits.rahuKetu.rahuHouseFromMoon} · Ketu: H${refPdfPred.majorTransits.rahuKetu.ketuHouseFromMoon}`}
                  </span>
                </div>

                <div style={{ fontSize: '12.5px', lineHeight: 1.6, marginBottom: '8px' }}>
                  <ul style={{ margin: '4px 0 8px 0', paddingLeft: '18px' }}>
                    {(isHi ? refPdfPred.majorTransits.rahuKetu.likelyResultsHi : refPdfPred.majorTransits.rahuKetu.likelyResultsEn).map((res, i) => (
                      <li key={i}>{res}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ padding: '8px 12px', background: 'var(--bg-subtle)', borderRadius: '4px', fontSize: '12px', color: 'var(--warn, #eab308)', marginBottom: '8px' }}>
                  <strong>{isHi ? 'सावधानी:' : 'Caution:'}</strong> {isHi ? refPdfPred.majorTransits.rahuKetu.cautionHi : refPdfPred.majorTransits.rahuKetu.cautionEn}
                </div>

                <div style={{ fontSize: '12px', color: 'var(--accent)' }}>
                  <strong>{isHi ? 'उपाय:' : 'Remedies:'}</strong> {isHi ? refPdfPred.majorTransits.rahuKetu.remediesHi : refPdfPred.majorTransits.rahuKetu.remediesEn}
                </div>
              </div>
            </div>
          )}

          {/* Sub-Tab 7: Lifelong Vimshottari Mahadasha & Antardasha Predictions */}
          {div8SubTab === 'dasha_predictions' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="card" style={{ padding: '16px' }}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '15px', color: 'var(--accent)' }}>
                  {isHi ? 'आजीवन विंशोत्तरी महादशा एवं अंतर्दशा फलकथन (Pages 76-106 Parity)' : 'Lifelong Vimshottari Mahadasha & Antardasha Predictions with Remedies'}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {refPdfPred.dashaBhuktiPredictions.map((db, idx) => (
                    <div key={idx} className="card" style={{ padding: '12px', borderLeft: '3px solid var(--accent)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <strong style={{ fontSize: '13.5px', color: 'var(--accent)' }}>
                          {isHi ? `${PLANET_HI[db.mdLord] || db.mdLord} महादशा` : `${db.mdLord} Mahadasha`}
                        </strong>
                        <span className="tag tag-subtle">
                          {isHi ? `प्रारंभ: ${db.startDateStr} (आयु: ${db.ageStr})` : `Starts: ${db.startDateStr} (Age: ${db.ageStr})`}
                        </span>
                      </div>
                      <div style={{ fontSize: '12px', lineHeight: 1.5, color: 'var(--text-primary)', marginBottom: '6px' }}>
                        {isHi ? db.forecastHi : db.forecastEn}
                      </div>
                      <div style={{ fontSize: '11.5px', color: 'var(--accent)' }}>
                        <strong>{isHi ? 'अनुशंसित उपाय:' : 'Remedy:'}</strong> {isHi ? db.remediesHi : db.remediesEn}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Sub-Tab 8: Yogini Dasha Predictions */}
          {div8SubTab === 'yogini_predictions' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Current Yogini Period */}
              <div className="card" style={{ padding: '16px', borderLeft: '4px solid var(--accent)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h3 style={{ margin: 0, fontSize: '15px', color: 'var(--accent)' }}>
                    {isHi ? `वर्तमान सक्रिय योगिनी काल — ${refPdfPred.yoginiPredictions.currentPeriod.mdName} / ${refPdfPred.yoginiPredictions.currentPeriod.adName}` : `Current Active Yogini Period — ${refPdfPred.yoginiPredictions.currentPeriod.mdName} / ${refPdfPred.yoginiPredictions.currentPeriod.adName}`}
                  </h3>
                  <span className="tag tag-accent">{refPdfPred.yoginiPredictions.currentPeriod.datesStr}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px', marginTop: '8px' }}>
                  <div style={{ padding: '10px', background: 'var(--bg-subtle)', borderRadius: '4px' }}>
                    <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--accent)', marginBottom: '4px' }}>
                      {isHi ? 'कर्म एवं व्यापार (Work & Business)' : 'Work & Business'}
                    </div>
                    <div style={{ fontSize: '12px', lineHeight: 1.5 }}>
                      {isHi ? refPdfPred.yoginiPredictions.currentPeriod.workBusinessHi : refPdfPred.yoginiPredictions.currentPeriod.workBusinessEn}
                    </div>
                  </div>

                  <div style={{ padding: '10px', background: 'var(--bg-subtle)', borderRadius: '4px' }}>
                    <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--accent)', marginBottom: '4px' }}>
                      {isHi ? 'धन एवं परिवार (Money & Family)' : 'Money & Family'}
                    </div>
                    <div style={{ fontSize: '12px', lineHeight: 1.5 }}>
                      {isHi ? refPdfPred.yoginiPredictions.currentPeriod.moneyFamilyHi : refPdfPred.yoginiPredictions.currentPeriod.moneyFamilyEn}
                    </div>
                  </div>

                  <div style={{ padding: '10px', background: 'var(--bg-subtle)', borderRadius: '4px' }}>
                    <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--accent)', marginBottom: '4px' }}>
                      {isHi ? 'स्वास्थ्य एवं दिनचर्या (Health & Daily Life)' : 'Health & Daily Life'}
                    </div>
                    <div style={{ fontSize: '12px', lineHeight: 1.5 }}>
                      {isHi ? refPdfPred.yoginiPredictions.currentPeriod.healthLifeHi : refPdfPred.yoginiPredictions.currentPeriod.healthLifeEn}
                    </div>
                  </div>
                </div>
              </div>

              {/* All 8 Yoginis Reading */}
              <div className="card" style={{ padding: '16px' }}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '15px', color: 'var(--accent)' }}>
                  {isHi ? 'अष्ट योगिनी दशाएं एवं फल (All 8 Yoginis Overview)' : 'All 8 Yoginis Classical Readings'}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '10px' }}>
                  {refPdfPred.yoginiPredictions.allYoginis.map((yog, idx) => (
                    <div key={idx} className="card" style={{ padding: '10px', borderLeft: '3px solid var(--accent)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <strong style={{ fontSize: '13px' }}>{isHi ? yog.nameHi : yog.nameEn}</strong>
                        <span className="tag tag-subtle">{yog.years} Yrs · {isHi ? yog.lordHi : yog.lordEn}</span>
                      </div>
                      <div style={{ fontSize: '11.5px', lineHeight: 1.5, color: 'var(--text-primary)' }}>
                        {isHi ? yog.generalReadingHi : yog.generalReadingEn}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Sub-Tab 9: Doshas & Mitigations */}
          {div8SubTab === 'doshas' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
              {doshaReport.doshas.map((ds, idx) => (
                <div key={idx} className="card" style={{ padding: '14px', borderLeft: `4px solid ${ds.status === 'Present' ? 'var(--warn)' : 'var(--good)'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <strong style={{ fontSize: '14px' }}>{ds.name}</strong>
                    <span className={`tag ${ds.status === 'Present' ? 'tag-warn' : 'tag-good'}`}>
                      {ds.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', lineHeight: 1.5, color: 'var(--text-primary)' }}>
                    <div><strong>{isHi ? 'कारण:' : 'Trigger:'}</strong> {ds.trigger}</div>
                    <div style={{ marginTop: '4px' }}><strong>{isHi ? 'प्रभाव:' : 'Effect:'}</strong> {ds.effect}</div>
                    <div style={{ marginTop: '4px', color: 'var(--accent)' }}><strong>{isHi ? 'उपाय:' : 'Remedy:'}</strong> {ds.remedy}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Sub-Tab 10: Vedic Remedies & Stotras */}
          {div8SubTab === 'remedies' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
              <div className="card" style={{ padding: '16px' }}>
                <h3 style={{ margin: '0 0 10px', fontSize: '14.5px', color: 'var(--accent)' }}>
                  {isHi ? 'रत्न व रुद्राक्ष परामर्श (Gemstones & Rudraksha)' : 'Gemstones & Rudraksha'}
                </h3>
                <div style={{ fontSize: '12.5px', lineHeight: 1.6 }}>
                  <strong>{isHi ? 'जीवन रत्न:' : 'Life Stone:'}</strong> {isHi ? gemstoneData.lifeStone.stoneHi : gemstoneData.lifeStone.stoneEn} ({isHi ? gemstoneData.lifeStone.fingerHi : gemstoneData.lifeStone.fingerEn})<br />
                  <strong>{isHi ? 'भाग्य रत्न:' : 'Lucky Stone:'}</strong> {isHi ? gemstoneData.luckyStone.stoneHi : gemstoneData.luckyStone.stoneEn} ({isHi ? gemstoneData.luckyStone.fingerHi : gemstoneData.luckyStone.fingerEn})<br />
                  <strong>{isHi ? 'कारक रत्न:' : 'Benefic Stone:'}</strong> {isHi ? gemstoneData.beneficStone.stoneHi : gemstoneData.beneficStone.stoneEn} ({isHi ? gemstoneData.beneficStone.fingerHi : gemstoneData.beneficStone.fingerEn})<br />
                  <strong>{isHi ? 'रुद्राक्ष:' : 'Recommended Rudraksha:'}</strong> {gemstoneData.primaryRudraksha.mukhi} {isHi ? 'मुखी रुद्राक्ष' : 'Mukhi'} ({isHi ? gemstoneData.primaryRudraksha.deityHi : gemstoneData.primaryRudraksha.deityEn})
                </div>
              </div>

              <div className="card" style={{ padding: '16px' }}>
                <h3 style={{ margin: '0 0 10px', fontSize: '14.5px', color: 'var(--good, #22c55e)' }}>
                  {isHi ? 'दैनिक वैदिक मंत्र व दान (Mantra & Daana)' : 'Vedic Mantras & Charity'}
                </h3>
                <div style={{ fontSize: '12px', lineHeight: 1.6 }}>
                  • <strong>गायत्री मंत्र:</strong> नित्य प्रातः 24 या 108 बार जप करें।<br />
                  • <strong>महामृत्युंजय मंत्र:</strong> स्वास्थ्य व दीर्घायु हेतु नित्य 11 बार जपें।<br />
                  • <strong>अन्न दान:</strong> प्रति शनिवार व अमावस्या को निर्धनों को भोजन कराएं।
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 11. DIVISION 9: MULTI-SYSTEM ASTROLOGICAL ANALYSIS (KP, WESTERN, NADI, LAL KITAB) */}
      {activeDivision === 9 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Sub-tab Navigation */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button type="button" className={`btn btn-sm ${div9SubTab === 'kp' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setDiv9SubTab('kp')}>
              1. KP Astrology (Krishnamurti Paddhati)
            </button>
            <button type="button" className={`btn btn-sm ${div9SubTab === 'western' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setDiv9SubTab('western')}>
              2. Western Astrology (Tropical & Placidus)
            </button>
            <button type="button" className={`btn btn-sm ${div9SubTab === 'nadi' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setDiv9SubTab('nadi')}>
              3. Nadi Astrology (Jeeva & Deha Karakas)
            </button>
            <button type="button" className={`btn btn-sm ${div9SubTab === 'lal_kitab' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setDiv9SubTab('lal_kitab')}>
              4. Lal Kitab System (Teva, Soye Bhav & Debts)
            </button>
          </div>

          {/* Sub-Tab 1: KP Astrology */}
          {div9SubTab === 'kp' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
              <div className="card" style={{ padding: '16px' }}>
                <h3 style={{ margin: '0 0 10px', fontSize: '14.5px' }}>{isHi ? '12 भाव कस्प व उप-स्वामी (Cuspal Sub-Lords)' : 'Cuspal Sub-Lords'}</h3>
                <div style={{ overflowX: 'auto' }}>
                  <table className="compact-table" style={{ width: '100%', fontSize: '12px' }}>
                    <thead>
                      <tr>
                        <th>Cusp</th>
                        <th>Sign</th>
                        <th>Sign Lord</th>
                        <th>Star Lord</th>
                        <th>Sub Lord</th>
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
              </div>

              <div className="card" style={{ padding: '16px' }}>
                <h3 style={{ margin: '0 0 10px', fontSize: '14.5px' }}>{isHi ? 'ग्रह उप-स्वामी (Planetary Sub-Lords)' : 'Planetary Sub-Lords'}</h3>
                <div style={{ overflowX: 'auto' }}>
                  <table className="compact-table" style={{ width: '100%', fontSize: '12px' }}>
                    <thead>
                      <tr>
                        <th>Planet</th>
                        <th>Sign</th>
                        <th>Star Lord</th>
                        <th>Sub Lord</th>
                      </tr>
                    </thead>
                    <tbody>
                      {kpReport.planets.map((p) => (
                        <tr key={p.planet}>
                          <td style={{ fontWeight: 600 }}>{PLANET_SANSKRIT[p.planet] || p.planet}</td>
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

          {/* Sub-Tab 2: Western Astrology */}
          {div9SubTab === 'western' && (
            <div className="card" style={{ padding: '16px' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '15px' }}>
                {isHi ? 'पाश्चात्य ज्योतिष (Western Tropical Zodiac & Placidus Cusps)' : 'Western Tropical Zodiac & Major Aspects'}
              </h3>
              <div style={{ overflowX: 'auto' }}>
                <table className="compact-table" style={{ width: '100%', fontSize: '12px' }}>
                  <thead>
                    <tr>
                      <th>Planet 1</th>
                      <th>Aspect</th>
                      <th>Planet 2</th>
                      <th>Orb</th>
                      <th>Interpretation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {westernReport.aspects.slice(0, 15).map((as, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 600 }}>{as.planet1}</td>
                        <td>{as.aspect} ({as.actualAngle.toFixed(1)}°)</td>
                        <td style={{ fontWeight: 600 }}>{as.planet2}</td>
                        <td>{as.orb.toFixed(2)}°</td>
                        <td className="muted" style={{ fontSize: '11.5px' }}>{isHi ? as.interpretationHi : as.interpretationEn}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Sub-Tab 3: Nadi Astrology */}
          {div9SubTab === 'nadi' && (
            <div className="card" style={{ padding: '16px' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '15px' }}>
                {isHi ? 'नाड़ी ज्योतिष जीव-देह कारक व त्रिकोण संबंध' : 'Nadi Astrology Jeeva/Deha Karakas & Planetary Links'}
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '14px', marginTop: '10px' }}>
                <div style={{ padding: '12px', background: 'var(--bg-subtle)', borderRadius: '6px' }}>
                  <strong>{isHi ? 'जीव कारक (बृहस्पति / Jupiter):' : 'Jeeva Karaka (Jupiter):'}</strong>
                  <div style={{ fontSize: '12px', marginTop: '4px', color: 'var(--text-primary)' }}>
                    {isHi ? nadiReport.jeevaSynthesis.jeevaPlacementHi : nadiReport.jeevaSynthesis.jeevaPlacementEn}
                  </div>
                </div>
                <div style={{ padding: '12px', background: 'var(--bg-subtle)', borderRadius: '6px' }}>
                  <strong>{isHi ? 'देह व कर्म कारक (शनि / Saturn):' : 'Karma Karaka (Saturn):'}</strong>
                  <div style={{ fontSize: '12px', marginTop: '4px', color: 'var(--text-primary)' }}>
                    {isHi ? nadiReport.jeevaSynthesis.jeevaKarmaLinkHi : nadiReport.jeevaSynthesis.jeevaKarmaLinkEn}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sub-Tab 4: Lal Kitab */}
          {div9SubTab === 'lal_kitab' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
              <div className="card" style={{ padding: '16px' }}>
                <h3 style={{ margin: '0 0 10px', fontSize: '14.5px' }}>{isHi ? 'लाल किताब ऋण (Karmic Debts)' : 'Lal Kitab Karmic Debts'}</h3>
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
                        <strong>House {h.houseNumber} ({h.pakkaGharRulerHi})</strong>
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
          )}
        </div>
      )}

      {/* 12. DIVISION 10: MARRIAGE MATCHING (36 GUNAS) */}
      {activeDivision === 10 && (
        <div className="card" style={{ padding: '20px' }}>
          <h2 style={{ margin: '0 0 12px', fontSize: '18px', color: 'var(--text-primary)' }}>
            {isHi ? 'विवाह कुंडली मिलान (36 गुण अष्टकूट व दोष साम्य)' : 'Kundali Match Making (36 Gunas Ashtakoota)'}
          </h2>
          <MatchMakingView
            profiles={profiles}
            activeProfileId={activeProfileId}
            settings={safeSettings}
            chartStyle={chartStyle}
          />
        </div>
      )}

      {/* 13. DIVISION 11: PANCHANG, FESTIVALS, CHOGHADIYA, MUHURTA & RASHIFAL */}
      {activeDivision === 11 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Sub-tab Navigation */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button type="button" className={`btn btn-sm ${div11SubTab === 'panchang' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setDiv11SubTab('panchang')}>
              {isHi ? '1. दैनिक द्रिक पंचांग' : '1. Daily Drik Panchang'}
            </button>
            <button type="button" className={`btn btn-sm ${div11SubTab === 'festivals' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setDiv11SubTab('festivals')}>
              {isHi ? '2. हिन्दू पर्व व व्रत' : '2. Hindu Festivals'}
            </button>
            <button type="button" className={`btn btn-sm ${div11SubTab === 'choghadiya' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setDiv11SubTab('choghadiya')}>
              {isHi ? '3. दिन व रात्रि चौघड़िया' : '3. Choghadiya'}
            </button>
            <button type="button" className={`btn btn-sm ${div11SubTab === 'muhurta' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setDiv11SubTab('muhurta')}>
              {isHi ? '4. शुभ मुहूर्त व होरा' : '4. Muhurta & Horas'}
            </button>
            <button type="button" className={`btn btn-sm ${div11SubTab === 'rashifal' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setDiv11SubTab('rashifal')}>
              {isHi ? '5. दैनिक, मासिक व वार्षिक राशिफल' : '5. Daily/Monthly/Yearly Rashifal'}
            </button>
          </div>

          {/* Sub-Tab 1: Panchang */}
          {div11SubTab === 'panchang' && (
            <ToolsSuiteView
              chart={chart}
              baseInput={chart.input}
              settings={safeSettings}
              onApplyRectifiedTime={() => {}}
              requestedSubTab={{ id: 'deep_panchang', nonce: Date.now() }}
            />
          )}

          {/* Sub-Tab 2: Festivals */}
          {div11SubTab === 'festivals' && (
            <ToolsSuiteView
              chart={chart}
              baseInput={chart.input}
              settings={safeSettings}
              onApplyRectifiedTime={() => {}}
              requestedSubTab={{ id: 'festivals', nonce: Date.now() }}
            />
          )}

          {/* Sub-Tab 3: Choghadiya */}
          {div11SubTab === 'choghadiya' && (
            <ToolsSuiteView
              chart={chart}
              baseInput={chart.input}
              settings={safeSettings}
              onApplyRectifiedTime={() => {}}
              requestedSubTab={{ id: 'choghadiya', nonce: Date.now() }}
            />
          )}

          {/* Sub-Tab 4: Muhurta */}
          {div11SubTab === 'muhurta' && (
            <ToolsSuiteView
              chart={chart}
              baseInput={chart.input}
              settings={safeSettings}
              onApplyRectifiedTime={() => {}}
              requestedSubTab={{ id: 'muhurta', nonce: Date.now() }}
            />
          )}

          {/* Sub-Tab 5: Rashifal */}
          {div11SubTab === 'rashifal' && (
            <div className="card" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>{isHi ? 'राशि चुनें:' : 'Select Rashi:'}</span>
                  <select
                    aria-label="Select Rashi"
                    value={selectedRashifalSign}
                    onChange={(e) => setSelectedRashifalSign(parseInt(e.target.value, 10))}
                    style={{ padding: '4px 10px', fontSize: '13px', fontWeight: 600 }}
                  >
                    {SIGNS.map((s, idx) => (
                      <option key={idx} value={idx}>
                        {trSign(idx, lang)} ({idx + 1})
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    type="button"
                    className={`btn btn-sm ${rashifalPeriod === 'daily' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setRashifalPeriod('daily')}
                  >
                    {isHi ? 'दैनिक' : 'Daily'}
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${rashifalPeriod === 'monthly' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setRashifalPeriod('monthly')}
                  >
                    {isHi ? 'मासिक' : 'Monthly'}
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${rashifalPeriod === 'yearly' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setRashifalPeriod('yearly')}
                  >
                    {isHi ? 'वार्षिक' : 'Yearly'}
                  </button>
                </div>
              </div>

              {(() => {
                const item = rashifalReport[selectedRashifalSign];
                if (!item) return <div className="muted">{isHi ? 'राशिफल उपलब्ध नहीं है।' : 'Forecast unavailable.'}</div>;
                const reading = rashifalPeriod === 'daily' ? (isHi ? item.dailyHi : item.dailyEn) : rashifalPeriod === 'monthly' ? (isHi ? item.monthlyHi : item.monthlyEn) : (isHi ? item.yearlyHi : item.yearlyEn);
                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      <span className="tag tag-accent">{trSign(selectedRashifalSign, lang)}</span>
                      <span className="tag tag-good">{isHi ? 'अनुकूलता:' : 'Score:'} {item.score}%</span>
                      <span className="tag tag-subtle">{isHi ? 'शुभ अंक:' : 'Lucky No:'} {item.luckyNumber}</span>
                      <span className="tag tag-subtle">{isHi ? 'शुभ रंग:' : 'Lucky Color:'} {isHi ? item.luckyColorHi : item.luckyColorEn}</span>
                    </div>

                    <div style={{ padding: '14px', background: 'var(--bg-subtle)', borderRadius: '6px', fontSize: '13px', lineHeight: 1.6, color: 'var(--text-primary)' }}>
                      {reading}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                      <div style={{ padding: '8px 12px', background: 'var(--bg-subtle)', borderRadius: '4px', fontSize: '12px' }}>
                        <strong>{isHi ? 'करियर व वित्त:' : 'Career & Finance:'}</strong> {isHi ? item.careerHi : item.careerEn}
                      </div>
                      <div style={{ padding: '8px 12px', background: 'var(--bg-subtle)', borderRadius: '4px', fontSize: '12px' }}>
                        <strong>{isHi ? 'स्वास्थ्य व जीवनशक्ति:' : 'Health:'}</strong> {isHi ? item.healthHi : item.healthEn}
                      </div>
                      <div style={{ padding: '8px 12px', background: 'var(--bg-subtle)', borderRadius: '4px', fontSize: '12px' }}>
                        <strong>{isHi ? 'पारिवारिक व प्रेम:' : 'Family & Love:'}</strong> {isHi ? item.loveHi : item.loveEn}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* DIVISION 12: SAMBHAVIT FALKATHAN (PROBABLE LIFE PREDICTIONS SYNTHESIS)     */}
      {/* ========================================================================= */}
      {activeDivision === 12 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Header Banner */}
          <div className="card" style={{ padding: '16px 20px', background: 'var(--bg-card)', borderLeft: '4px solid var(--accent)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--accent)' }}>
                  {isHi ? 'भाग 12: संभावित फलकथन (समस्त कुंडलियों का संश्लेषित फलादेश)' : 'Division 12: Probable Life Predictions (Holistic All-Varga Synthesis)'}
                </h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                  {isHi
                    ? 'D-1 लग्न, D-9 नवांश, D-3 द्रेष्काण, D-7 सप्तांश, D-10 दशमांश, D-12 द्वादशांश, D-24 सिद्धांश, D-30 त्रिंशांश एवं D-60 षष्ट्यंश के संयुक्त विश्लेषणोपरांत 25 प्रमुख जीवन सूत्रों का बिंदुवार फलादेश।'
                    : 'Point-wise life predictions synthesized from D-1, D-9, D-3, D-7, D-10, D-12, D-24, D-30, D-60, Ashtakavarga and classical Parashari principles.'}
                </p>
              </div>
              <span className="tag tag-accent">{isHi ? '25 जीवन आयाम' : '25 Life Dimensions'}</span>
            </div>
          </div>

          {/* Sub-tab Navigation */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className={`btn btn-sm ${div12SubTab === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setDiv12SubTab('all')}
            >
              {isHi ? 'सभी 25 फलकथन (All)' : 'All 25 Predictions'}
            </button>
            <button
              type="button"
              className={`btn btn-sm ${div12SubTab === 'identity' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setDiv12SubTab('identity')}
            >
              {isHi ? '1. पहचान, इष्ट व स्वभाव' : '1. Identity & Ishta'}
            </button>
            <button
              type="button"
              className={`btn btn-sm ${div12SubTab === 'family' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setDiv12SubTab('family')}
            >
              {isHi ? '2. माता-पिता व कुल कुटुम्ब' : '2. Parents & Siblings'}
            </button>
            <button
              type="button"
              className={`btn btn-sm ${div12SubTab === 'marriage' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setDiv12SubTab('marriage')}
            >
              {isHi ? '3. विवाह, जीवनसाथी व संतान' : '3. Marriage & Children'}
            </button>
            <button
              type="button"
              className={`btn btn-sm ${div12SubTab === 'career' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setDiv12SubTab('career')}
            >
              {isHi ? '4. शिक्षा, करियर व विदेश' : '4. Education & Career'}
            </button>
            <button
              type="button"
              className={`btn btn-sm ${div12SubTab === 'health_longevity' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setDiv12SubTab('health_longevity')}
            >
              {isHi ? '5. आयु, स्वास्थ्य, सर्जरी व देह' : '5. Longevity & Health'}
            </button>
            <button
              type="button"
              className={`btn btn-sm ${div12SubTab === 'caution_crisis' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setDiv12SubTab('caution_crisis')}
            >
              {isHi ? '6. समाज, संकट, खेल व धन' : '6. Society, Crisis & Wealth'}
            </button>
          </div>

          {/* Grid of Predictions */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
            {/* 1. Naam Akshar */}
            {(div12SubTab === 'all' || div12SubTab === 'identity') && (
              <div className="card" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <strong style={{ fontSize: '14px', color: 'var(--accent)' }}>
                    {isHi ? '1. नामाक्षर (Name Syllables)' : '1. Birth Name Syllables'}
                  </strong>
                  <span className="tag tag-accent">{sambhavitReport.namakshar.nakshatraName} - P{sambhavitReport.namakshar.pada}</span>
                </div>
                <div style={{ fontSize: '13px', lineHeight: 1.5, color: 'var(--text-primary)' }}>
                  <p style={{ margin: '0 0 6px 0' }}>
                    <strong>{isHi ? 'मुख्य नामाक्षर:' : 'Primary Syllable:'}</strong>{' '}
                    <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--accent)' }}>
                      {isHi ? sambhavitReport.namakshar.primaryHi : sambhavitReport.namakshar.primaryEn}
                    </span>
                  </p>
                  <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    <strong>{isHi ? 'समस्त चरण विकल्प:' : 'All Pada Syllables:'}</strong>{' '}
                    {isHi ? sambhavitReport.namakshar.allPadasHi.join(', ') : sambhavitReport.namakshar.allPadasEn.join(', ')}
                  </p>
                  <p style={{ margin: 0, fontSize: '12px' }}>
                    {isHi ? sambhavitReport.namakshar.explanationHi : sambhavitReport.namakshar.explanationEn}
                  </p>
                </div>
              </div>
            )}

            {/* 2. Ishta Devata */}
            {(div12SubTab === 'all' || div12SubTab === 'identity') && (
              <div className="card" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <strong style={{ fontSize: '14px', color: 'var(--accent)' }}>
                    {isHi ? '2. इष्ट देवता (Ishta Devata)' : '2. Ishta Devata & Worship'}
                  </strong>
                  <span className="tag tag-subtle">{isHi ? 'काराकांश 12वां भाव' : '12th from Karakamsa'}</span>
                </div>
                <div style={{ fontSize: '13px', lineHeight: 1.5, color: 'var(--text-primary)' }}>
                  <p style={{ margin: '0 0 6px 0' }}>
                    <strong>{isHi ? 'आराध्य स्वरूप:' : 'Deity:'}</strong>{' '}
                    <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--accent)' }}>
                      {isHi ? sambhavitReport.ishtaDevata.nameHi : sambhavitReport.ishtaDevata.nameEn}
                    </span>
                  </p>
                  <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    <strong>{isHi ? 'शास्त्रीय आधार:' : 'Classical Basis:'}</strong>{' '}
                    {isHi ? sambhavitReport.ishtaDevata.basisHi : sambhavitReport.ishtaDevata.basisEn}
                  </p>
                  <div style={{ padding: '8px 12px', background: 'var(--bg-subtle)', borderRadius: '4px', fontSize: '12px', color: 'var(--accent)' }}>
                    <strong>{isHi ? 'कवच मंत्र:' : 'Mantra:'}</strong> {sambhavitReport.ishtaDevata.mantra}
                  </div>
                </div>
              </div>
            )}

            {/* 3. Mukhya Graha */}
            {(div12SubTab === 'all' || div12SubTab === 'identity') && (
              <div className="card" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <strong style={{ fontSize: '14px', color: 'var(--accent)' }}>
                    {isHi ? '3. मुख्य नियंत्रक ग्रह (Life Ruler Planet)' : '3. Main Life Controller Planet'}
                  </strong>
                  <span className="tag tag-subtle">{isHi ? 'लग्नेश / जीवन स्वामी' : 'Lagna Lord'}</span>
                </div>
                <div style={{ fontSize: '13px', lineHeight: 1.5, color: 'var(--text-primary)' }}>
                  <p style={{ margin: '0 0 6px 0' }}>
                    <strong>{isHi ? 'प्रधान ग्रह:' : 'Ruling Planet:'}</strong>{' '}
                    <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--accent)' }}>
                      {isHi ? sambhavitReport.mukhyaGraha.planetHi : sambhavitReport.mukhyaGraha.planetEn}
                    </span>
                  </p>
                  <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    <strong>{isHi ? 'भूमिका:' : 'Role:'}</strong>{' '}
                    {isHi ? sambhavitReport.mukhyaGraha.roleHi : sambhavitReport.mukhyaGraha.roleEn}
                  </p>
                  <p style={{ margin: 0, fontSize: '12px' }}>
                    {isHi ? sambhavitReport.mukhyaGraha.rationaleHi : sambhavitReport.mukhyaGraha.rationaleEn}
                  </p>
                </div>
              </div>
            )}

            {/* 21. Core Temperament */}
            {(div12SubTab === 'all' || div12SubTab === 'identity') && (
              <div className="card" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <strong style={{ fontSize: '14px', color: 'var(--accent)' }}>
                    {isHi ? '21. मूल स्वभाव व प्रकृति (Core Temperament)' : '21. Core Temperament & Nature'}
                  </strong>
                  <span className="tag tag-subtle">{isHi ? sambhavitReport.temperament.gunaHi : sambhavitReport.temperament.gunaEn}</span>
                </div>
                <div style={{ fontSize: '12.5px', lineHeight: 1.5, color: 'var(--text-primary)' }}>
                  <p style={{ margin: '0 0 6px 0' }}>
                    {isHi ? sambhavitReport.temperament.traitSummaryHi : sambhavitReport.temperament.traitSummaryEn}
                  </p>
                  <p style={{ margin: 0, fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                    <strong>{isHi ? 'त्रिगुण संरचना:' : 'Triguna Framework:'}</strong> {isHi ? sambhavitReport.temperament.gunaHi : sambhavitReport.temperament.gunaEn}
                  </p>
                </div>
              </div>
            )}

            {/* 4. Father */}
            {(div12SubTab === 'all' || div12SubTab === 'family') && (
              <div className="card" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <strong style={{ fontSize: '14px', color: 'var(--accent)' }}>
                    {isHi ? '4. पिता का फलित (Father Analysis)' : '4. Father Analysis'}
                  </strong>
                  <span className="tag tag-subtle">{isHi ? 'नवम भाव, सूर्य व D-12' : '9th House, Sun, D-12'}</span>
                </div>
                <div style={{ fontSize: '12.5px', lineHeight: 1.5, color: 'var(--text-primary)' }}>
                  <p style={{ margin: '0 0 6px 0' }}>
                    <strong>{isHi ? 'स्वभाव:' : 'Temperament:'}</strong> {isHi ? sambhavitReport.father.temperamentHi : sambhavitReport.father.temperamentEn}
                  </p>
                  <p style={{ margin: '0 0 6px 0' }}>
                    <strong>{isHi ? 'पेशा / आजीविका:' : 'Profession:'}</strong> {isHi ? sambhavitReport.father.professionHi : sambhavitReport.father.professionEn}
                  </p>
                  <p style={{ margin: '0 0 6px 0' }}>
                    <strong>{isHi ? 'जीवनकाल / स्वास्थ्य:' : 'Lifespan:'}</strong> {isHi ? sambhavitReport.father.lifespanHi : sambhavitReport.father.lifespanEn}
                  </p>
                  <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                    <strong>{isHi ? 'पिता से संबंध:' : 'Relationship:'}</strong> {isHi ? sambhavitReport.father.relationshipHi : sambhavitReport.father.relationshipEn}
                  </p>
                </div>
              </div>
            )}

            {/* 5. Mother */}
            {(div12SubTab === 'all' || div12SubTab === 'family') && (
              <div className="card" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <strong style={{ fontSize: '14px', color: 'var(--accent)' }}>
                    {isHi ? '5. माता का फलित (Mother Analysis)' : '5. Mother Analysis'}
                  </strong>
                  <span className="tag tag-subtle">{isHi ? 'चतुर्थ भाव, चंद्र व D-12' : '4th House, Moon, D-12'}</span>
                </div>
                <div style={{ fontSize: '12.5px', lineHeight: 1.5, color: 'var(--text-primary)' }}>
                  <p style={{ margin: '0 0 6px 0' }}>
                    <strong>{isHi ? 'स्वभाव:' : 'Temperament:'}</strong> {isHi ? sambhavitReport.mother.temperamentHi : sambhavitReport.mother.temperamentEn}
                  </p>
                  <p style={{ margin: '0 0 6px 0' }}>
                    <strong>{isHi ? 'पेशा / कार्यक्षेत्र:' : 'Profession:'}</strong> {isHi ? sambhavitReport.mother.professionHi : sambhavitReport.mother.professionEn}
                  </p>
                  <p style={{ margin: '0 0 6px 0' }}>
                    <strong>{isHi ? 'जीवनकाल / स्वास्थ्य:' : 'Lifespan:'}</strong> {isHi ? sambhavitReport.mother.lifespanHi : sambhavitReport.mother.lifespanEn}
                  </p>
                  <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                    <strong>{isHi ? 'माता से संबंध:' : 'Relationship:'}</strong> {isHi ? sambhavitReport.mother.relationshipHi : sambhavitReport.mother.relationshipEn}
                  </p>
                </div>
              </div>
            )}

            {/* 6. Siblings */}
            {(div12SubTab === 'all' || div12SubTab === 'family') && (
              <div className="card" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <strong style={{ fontSize: '14px', color: 'var(--accent)' }}>
                    {isHi ? '6. भाई-बहन व जन्म क्रम (Siblings & Birth Order)' : '6. Siblings & Birth Order'}
                  </strong>
                  <span className="tag tag-subtle">{isHi ? 'तृतीय, एकादश व D-3' : '3rd, 11th & D-3'}</span>
                </div>
                <div style={{ fontSize: '12.5px', lineHeight: 1.5, color: 'var(--text-primary)' }}>
                  <p style={{ margin: '0 0 6px 0' }}>
                    <strong>{isHi ? 'संभावित संख्या:' : 'Count Projection:'}</strong> {isHi ? sambhavitReport.siblings.countProjectionHi : sambhavitReport.siblings.countProjectionEn}
                  </p>
                  <p style={{ margin: '0 0 6px 0' }}>
                    <strong>{isHi ? 'जातक की स्थिति:' : 'Birth Order:'}</strong>{' '}
                    <span style={{ fontWeight: 700, color: 'var(--accent)' }}>
                      {isHi ? sambhavitReport.siblings.birthOrderHi : sambhavitReport.siblings.birthOrderEn}
                    </span>
                  </p>
                  <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                    <strong>{isHi ? 'आपसी सामंजस्य:' : 'Harmony:'}</strong> {isHi ? sambhavitReport.siblings.harmonyHi : sambhavitReport.siblings.harmonyEn}
                  </p>
                </div>
              </div>
            )}

            {/* 7. Marriage & Spouse */}
            {(div12SubTab === 'all' || div12SubTab === 'marriage') && (
              <div className="card" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <strong style={{ fontSize: '14px', color: 'var(--accent)' }}>
                    {isHi ? '7. विवाह व जीवनसाथी (Marriage & Spouse)' : '7. Marriage & Spouse'}
                  </strong>
                  <span className="tag tag-accent">{isHi ? 'सप्तम भाव, शुक्र व D-9' : '7th House, Venus, D-9'}</span>
                </div>
                <div style={{ fontSize: '12.5px', lineHeight: 1.5, color: 'var(--text-primary)' }}>
                  <p style={{ margin: '0 0 6px 0' }}>
                    <strong>{isHi ? 'विवाह समय / योग काल:' : 'Marriage Timing Window:'}</strong>{' '}
                    <span style={{ fontWeight: 600, color: 'var(--accent)' }}>
                      {isHi ? sambhavitReport.marriage.timingAgeWindowHi : sambhavitReport.marriage.timingAgeWindowEn}
                    </span>
                  </p>
                  <p style={{ margin: '0 0 6px 0' }}>
                    <strong>{isHi ? 'विवाह योग स्वरूप:' : 'Marriage Count/Type:'}</strong> {isHi ? sambhavitReport.marriage.marriageYogasHi : sambhavitReport.marriage.marriageYogasEn}
                  </p>
                  <p style={{ margin: '0 0 6px 0' }}>
                    <strong>{isHi ? 'जीवनसाथी का स्वभाव:' : 'Spouse Nature:'}</strong> {isHi ? sambhavitReport.marriage.spouseNatureHi : sambhavitReport.marriage.spouseNatureEn}
                  </p>
                  <p style={{ margin: '0 0 6px 0' }}>
                    <strong>{isHi ? 'आयु अंतर:' : 'Age Gap:'}</strong> {isHi ? sambhavitReport.marriage.spouseAgeGapHi : sambhavitReport.marriage.spouseAgeGapEn}
                  </p>
                  <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                    <strong>{isHi ? 'दांपत्य संबंध:' : 'Relationship:'}</strong> {isHi ? sambhavitReport.marriage.relationshipHi : sambhavitReport.marriage.relationshipEn}
                  </p>
                </div>
              </div>
            )}

            {/* 8. Children */}
            {(div12SubTab === 'all' || div12SubTab === 'marriage') && (
              <div className="card" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <strong style={{ fontSize: '14px', color: 'var(--accent)' }}>
                    {isHi ? '8. संतान सुख (Children & Progeny)' : '8. Children & Progeny'}
                  </strong>
                  <span className="tag tag-subtle">{isHi ? 'पंचम भाव, गुरु व D-7' : '5th House, Jupiter, D-7'}</span>
                </div>
                <div style={{ fontSize: '12.5px', lineHeight: 1.5, color: 'var(--text-primary)' }}>
                  <p style={{ margin: '0 0 6px 0' }}>
                    <strong>{isHi ? 'गर्भधारण माध्यम:' : 'Conception Mode:'}</strong>{' '}
                    <span style={{ fontWeight: 600, color: 'var(--accent)' }}>
                      {isHi ? sambhavitReport.children.conceptionModeHi : sambhavitReport.children.conceptionModeEn}
                    </span>
                  </p>
                  <p style={{ margin: '0 0 6px 0' }}>
                    <strong>{isHi ? 'संतान संख्या व लिंग:' : 'Progeny Projection:'}</strong> {isHi ? sambhavitReport.children.progenyCountHi : sambhavitReport.children.progenyCountEn}
                  </p>
                  <p style={{ margin: '0 0 6px 0' }}>
                    <strong>{isHi ? 'गर्भपात जोखिम:' : 'Miscarriage Risk:'}</strong> {isHi ? sambhavitReport.children.miscarriageRiskHi : sambhavitReport.children.miscarriageRiskEn}
                  </p>
                  <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                    <strong>{isHi ? 'संतान से सुख व मान:' : 'Filial Joy:'}</strong> {isHi ? sambhavitReport.children.filialHappinessHi : sambhavitReport.children.filialHappinessEn}
                  </p>
                </div>
              </div>
            )}

            {/* 22. Love Life */}
            {(div12SubTab === 'all' || div12SubTab === 'marriage') && (
              <div className="card" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <strong style={{ fontSize: '14px', color: 'var(--accent)' }}>
                    {isHi ? '22. प्रेम जीवन व आकर्षण (Love Life)' : '22. Love Life & Romance'}
                  </strong>
                  <span className="tag tag-subtle">{isHi ? 'पंचम-सप्तम भाव व शुक्र' : '5th, 7th & Venus'}</span>
                </div>
                <div style={{ fontSize: '12.5px', lineHeight: 1.5, color: 'var(--text-primary)' }}>
                  <p style={{ margin: '0 0 6px 0' }}>
                    <strong>{isHi ? 'रोमांस स्वरूप:' : 'Romance:'}</strong> {isHi ? sambhavitReport.loveLife.romanceHi : sambhavitReport.loveLife.romanceEn}
                  </p>
                  <p style={{ margin: 0, color: 'var(--accent)', fontWeight: 600 }}>
                    <strong>{isHi ? 'विवाह प्रारूप:' : 'Marriage Type:'}</strong> {isHi ? sambhavitReport.loveLife.marriageTypeHi : sambhavitReport.loveLife.marriageTypeEn}
                  </p>
                </div>
              </div>
            )}

            {/* 16. Bed Pleasure & Sexuality */}
            {(div12SubTab === 'all' || div12SubTab === 'marriage') && (
              <div className="card" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <strong style={{ fontSize: '14px', color: 'var(--accent)' }}>
                    {isHi ? '16. शय्या सुख व कामुकता (Bed Pleasure)' : '16. Bed Pleasure & Sexuality'}
                  </strong>
                  <span className="tag tag-subtle">{isHi ? 'द्वादश भाव व शुक्र' : '12th House & Venus'}</span>
                </div>
                <div style={{ fontSize: '12.5px', lineHeight: 1.5, color: 'var(--text-primary)' }}>
                  <p style={{ margin: '0 0 6px 0' }}>
                    <strong>{isHi ? 'शयन सुख स्तर:' : 'Bed Comforts:'}</strong> {isHi ? sambhavitReport.bedPleasure.shayanaSukhaHi : sambhavitReport.bedPleasure.shayanaSukhaEn}
                  </p>
                  <p style={{ margin: 0 }}>
                    <strong>{isHi ? 'कामुकता / अंतरंगता:' : 'Sexuality:'}</strong> {isHi ? sambhavitReport.bedPleasure.sexualityHi : sambhavitReport.bedPleasure.sexualityEn}
                  </p>
                </div>
              </div>
            )}

            {/* 9. Education */}
            {(div12SubTab === 'all' || div12SubTab === 'career') && (
              <div className="card" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <strong style={{ fontSize: '14px', color: 'var(--accent)' }}>
                    {isHi ? '9. स्वयं की शिक्षा (Self Education)' : '9. Education & Academic Level'}
                  </strong>
                  <span className="tag tag-accent">{isHi ? 'चतुर्थ, पंचम व D-24' : '4th, 5th & D-24'}</span>
                </div>
                <div style={{ fontSize: '12.5px', lineHeight: 1.5, color: 'var(--text-primary)' }}>
                  <p style={{ margin: '0 0 6px 0' }}>
                    <strong>{isHi ? 'उच्चतम शिक्षा स्तर:' : 'Highest Attainment:'}</strong>{' '}
                    <span style={{ fontWeight: 700, color: 'var(--accent)' }}>
                      {isHi ? sambhavitReport.education.attainmentLevelHi : sambhavitReport.education.attainmentLevelEn}
                    </span>
                  </p>
                  <p style={{ margin: '0 0 6px 0' }}>
                    <strong>{isHi ? 'अनुकूल अध्ययन विषय:' : 'Suitable Streams:'}</strong>{' '}
                    {isHi ? sambhavitReport.education.suitableStreamsHi.join(', ') : sambhavitReport.education.suitableStreamsEn.join(', ')}
                  </p>
                  <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                    <strong>{isHi ? 'प्रतियोगी परीक्षा योग:' : 'Competitive Exams:'}</strong> {isHi ? sambhavitReport.education.academicSuccessHi : sambhavitReport.education.academicSuccessEn}
                  </p>
                </div>
              </div>
            )}

            {/* 10. Career & Profession */}
            {(div12SubTab === 'all' || div12SubTab === 'career') && (
              <div className="card" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <strong style={{ fontSize: '14px', color: 'var(--accent)' }}>
                    {isHi ? '10. आजीविका, पेशा व करियर (Profession & Career)' : '10. Profession & Career'}
                  </strong>
                  <span className="tag tag-accent">{isHi ? 'दशम भाव, शनि व D-10' : '10th House, Saturn, D-10'}</span>
                </div>
                <div style={{ fontSize: '12.5px', lineHeight: 1.5, color: 'var(--text-primary)' }}>
                  <p style={{ margin: '0 0 6px 0' }}>
                    <strong>{isHi ? 'नौकरी या व्यापार:' : 'Job vs Business:'}</strong>{' '}
                    <span style={{ fontWeight: 600, color: 'var(--accent)' }}>
                      {isHi ? sambhavitReport.career.jobVsBusinessHi : sambhavitReport.career.jobVsBusinessEn}
                    </span>
                  </p>
                  <p style={{ margin: '0 0 6px 0' }}>
                    <strong>{isHi ? 'सरकारी या प्राइवेट:' : 'Govt vs Private:'}</strong> {isHi ? sambhavitReport.career.govtVsPrivateHi : sambhavitReport.career.govtVsPrivateEn}
                  </p>
                  <p style={{ margin: '0 0 6px 0' }}>
                    <strong>{isHi ? 'उपयुक्त कार्यक्षेत्र:' : 'Recommended Fields:'}</strong>{' '}
                    {isHi ? sambhavitReport.career.suitableProfessionsHi.join(', ') : sambhavitReport.career.suitableProfessionsEn.join(', ')}
                  </p>
                  <p style={{ margin: '0 0 6px 0' }}>
                    <strong>{isHi ? 'विदेश यात्रा योग:' : 'Foreign Travel:'}</strong> {isHi ? sambhavitReport.career.foreignTravelHi : sambhavitReport.career.foreignTravelEn}
                  </p>
                  <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                    <strong>{isHi ? 'विदेश निवास योग:' : 'Foreign Settlement:'}</strong> {isHi ? sambhavitReport.career.foreignSettlementHi : sambhavitReport.career.foreignSettlementEn}
                  </p>
                </div>
              </div>
            )}

            {/* 25. Wealth vs Daridrya */}
            {(div12SubTab === 'all' || div12SubTab === 'career' || div12SubTab === 'caution_crisis') && (
              <div className="card" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <strong style={{ fontSize: '14px', color: 'var(--accent)' }}>
                    {isHi ? '25. धन योग या दरिद्र योग (Wealth vs Poverty)' : '25. Wealth vs Daridrya Yoga'}
                  </strong>
                  <span className="tag tag-accent">{isHi ? 'द्वितीय, एकादश व नवम' : '2nd, 11th & 9th'}</span>
                </div>
                <div style={{ fontSize: '12.5px', lineHeight: 1.5, color: 'var(--text-primary)' }}>
                  <p style={{ margin: '0 0 6px 0' }}>
                    <strong>{isHi ? 'धन योग स्थिति:' : 'Status:'}</strong>{' '}
                    <span style={{ fontWeight: 600, color: 'var(--accent)' }}>
                      {isHi ? sambhavitReport.wealth.statusHi : sambhavitReport.wealth.statusEn}
                    </span>
                  </p>
                  {sambhavitReport.wealth.activeYogasHi.length > 0 && (
                    <p style={{ margin: '0 0 6px 0' }}>
                      <strong>{isHi ? 'सक्रिय धन योग:' : 'Active Yogas:'}</strong>{' '}
                      {isHi ? sambhavitReport.wealth.activeYogasHi.join(', ') : sambhavitReport.wealth.activeYogasEn.join(', ')}
                    </p>
                  )}
                  <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                    <strong>{isHi ? 'समृद्धि का स्वर्णिम काल:' : 'Peak Wealth Window:'}</strong> {isHi ? sambhavitReport.wealth.peakAgeWindowHi : sambhavitReport.wealth.peakAgeWindowEn}
                  </p>
                </div>
              </div>
            )}

            {/* 11. Longevity */}
            {(div12SubTab === 'all' || div12SubTab === 'health_longevity') && (
              <div className="card" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <strong style={{ fontSize: '14px', color: 'var(--accent)' }}>
                    {isHi ? '11. आयु व जीवनकाल (Lifespan & Longevity)' : '11. Lifespan & Longevity'}
                  </strong>
                  <span className="tag tag-good">{isHi ? sambhavitReport.longevity.categoryHi : sambhavitReport.longevity.categoryEn}</span>
                </div>
                <div style={{ fontSize: '12.5px', lineHeight: 1.5, color: 'var(--text-primary)' }}>
                  <p style={{ margin: '0 0 6px 0' }}>
                    <strong>{isHi ? 'आयु वर्ग:' : 'Category:'}</strong>{' '}
                    <span style={{ fontWeight: 700, color: 'var(--accent)' }}>
                      {isHi ? sambhavitReport.longevity.categoryHi : sambhavitReport.longevity.categoryEn}
                    </span>
                  </p>
                  <p style={{ margin: '0 0 6px 0' }}>
                    <strong>{isHi ? 'संभावित सक्रिय काल:' : 'Active Span:'}</strong> {isHi ? sambhavitReport.longevity.rangeHi : sambhavitReport.longevity.rangeEn}
                  </p>
                  <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                    <strong>{isHi ? 'शास्त्रीय रक्षा सूत्र:' : 'Key Protectors:'}</strong> {isHi ? sambhavitReport.longevity.keyFactorsHi : sambhavitReport.longevity.keyFactorsEn}
                  </p>
                </div>
              </div>
            )}

            {/* 24. Health & Tridosha */}
            {(div12SubTab === 'all' || div12SubTab === 'health_longevity') && (
              <div className="card" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <strong style={{ fontSize: '14px', color: 'var(--accent)' }}>
                    {isHi ? '24. स्वास्थ्य व त्रिदोष संतुलन (Health & Tridosha)' : '24. Health & Tridosha'}
                  </strong>
                  <span className="tag tag-subtle">{isHi ? 'षष्ठ भाव व रोगेश' : '6th House & Rogesha'}</span>
                </div>
                <div style={{ fontSize: '12.5px', lineHeight: 1.5, color: 'var(--text-primary)' }}>
                  <p style={{ margin: '0 0 6px 0' }}>
                    <strong>{isHi ? 'त्रिदोष प्रकृति:' : 'Tridosha Constitution:'}</strong> {isHi ? sambhavitReport.health.constitutionHi : sambhavitReport.health.constitutionEn}
                  </p>
                  <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                    <strong>{isHi ? 'संवेदनशील अंग:' : 'Vulnerable Organs:'}</strong> {isHi ? sambhavitReport.health.vulnerableOrgansHi : sambhavitReport.health.vulnerableOrgansEn}
                  </p>
                </div>
              </div>
            )}

            {/* 23. Psychological Health */}
            {(div12SubTab === 'all' || div12SubTab === 'health_longevity') && (
              <div className="card" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <strong style={{ fontSize: '14px', color: 'var(--accent)' }}>
                    {isHi ? '23. मानसिक स्थिति व मनोवैज्ञानिक स्वास्थ्य' : '23. Psychological & Mental Health'}
                  </strong>
                  <span className="tag tag-subtle">{isHi ? 'चंद्रमा, बुध व लग्न' : 'Moon, Mercury, Lagna'}</span>
                </div>
                <div style={{ fontSize: '12.5px', lineHeight: 1.5, color: 'var(--text-primary)' }}>
                  <p style={{ margin: '0 0 6px 0' }}>
                    <strong>{isHi ? 'मानसिक स्थिति:' : 'Mental Poise:'}</strong> {isHi ? sambhavitReport.mentalHealth.conditionHi : sambhavitReport.mentalHealth.conditionEn}
                  </p>
                  <p style={{ margin: '0 0 6px 0', color: 'var(--text-secondary)' }}>
                    <strong>{isHi ? 'संभावित विकार:' : 'Risks:'}</strong> {isHi ? sambhavitReport.mentalHealth.vulnerabilitiesHi : sambhavitReport.mentalHealth.vulnerabilitiesEn}
                  </p>
                  <p style={{ margin: 0, color: 'var(--accent)' }}>
                    <strong>{isHi ? 'मानसिक शांति उपाय:' : 'Remedy:'}</strong> {isHi ? sambhavitReport.mentalHealth.remedyHi : sambhavitReport.mentalHealth.remedyEn}
                  </p>
                </div>
              </div>
            )}

            {/* 13. Surgery Yoga */}
            {(div12SubTab === 'all' || div12SubTab === 'health_longevity') && (
              <div className="card" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <strong style={{ fontSize: '14px', color: 'var(--accent)' }}>
                    {isHi ? '13. शल्य चिकित्सा योग (Surgery Yoga)' : '13. Surgery Yoga & Operations'}
                  </strong>
                  <span className={`tag ${sambhavitReport.surgeryYoga.hasRisk ? 'tag-danger' : 'tag-good'}`}>
                    {isHi ? sambhavitReport.surgeryYoga.riskLevelHi : sambhavitReport.surgeryYoga.riskLevelEn}
                  </span>
                </div>
                <div style={{ fontSize: '12.5px', lineHeight: 1.5, color: 'var(--text-primary)' }}>
                  <p style={{ margin: '0 0 6px 0' }}>
                    <strong>{isHi ? 'जोखिम स्तर:' : 'Risk Level:'}</strong> {isHi ? sambhavitReport.surgeryYoga.riskLevelHi : sambhavitReport.surgeryYoga.riskLevelEn}
                  </p>
                  <p style={{ margin: '0 0 6px 0' }}>
                    <strong>{isHi ? 'प्रभावित अंग:' : 'Vulnerable Area:'}</strong> {isHi ? sambhavitReport.surgeryYoga.vulnerableAreasHi : sambhavitReport.surgeryYoga.vulnerableAreasEn}
                  </p>
                  <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                    <strong>{isHi ? 'संभावित कालखंड:' : 'Timing:'}</strong> {isHi ? sambhavitReport.surgeryYoga.timingHi : sambhavitReport.surgeryYoga.timingEn}
                  </p>
                </div>
              </div>
            )}

            {/* 14. Physical Marks */}
            {(div12SubTab === 'all' || div12SubTab === 'health_longevity') && (
              <div className="card" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <strong style={{ fontSize: '14px', color: 'var(--accent)' }}>
                    {isHi ? '14. शरीर में विशेष पहचान (Physical Marks)' : '14. Body Marks & Identification'}
                  </strong>
                  <span className="tag tag-subtle">{isHi ? 'लग्न व द्रेष्काण' : 'Lagna & Drekkana'}</span>
                </div>
                <div style={{ fontSize: '12.5px', lineHeight: 1.5, color: 'var(--text-primary)' }}>
                  <p style={{ margin: '0 0 6px 0' }}>
                    <strong>{isHi ? 'पहचान चिन्ह:' : 'Markings:'}</strong> {isHi ? sambhavitReport.physicalMarks.identificationHi : sambhavitReport.physicalMarks.identificationEn}
                  </p>
                  <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                    <strong>{isHi ? 'स्थान:' : 'Body Locations:'}</strong>{' '}
                    {isHi ? sambhavitReport.physicalMarks.locationsHi.join(' · ') : sambhavitReport.physicalMarks.locationsEn.join(' · ')}
                  </p>
                </div>
              </div>
            )}

            {/* 15. Addictions */}
            {(div12SubTab === 'all' || div12SubTab === 'health_longevity') && (
              <div className="card" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <strong style={{ fontSize: '14px', color: 'var(--accent)' }}>
                    {isHi ? '15. व्यसन व लत (Addictions & Habits)' : '15. Addictions & Vices'}
                  </strong>
                  <span className="tag tag-subtle">{isHi ? 'द्वितीय भाव, राहु व शुक्र' : '2nd House, Rahu, Venus'}</span>
                </div>
                <div style={{ fontSize: '12.5px', lineHeight: 1.5, color: 'var(--text-primary)' }}>
                  <p style={{ margin: '0 0 6px 0' }}>
                    <strong>{isHi ? 'संवेदनशील प्रवृत्तियां:' : 'Vices:'}</strong>{' '}
                    {isHi ? sambhavitReport.addictions.vulnerabilitiesHi.join(', ') : sambhavitReport.addictions.vulnerabilitiesEn.join(', ')}
                  </p>
                  <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                    <strong>{isHi ? 'सुझाव व उपाय:' : 'Advice:'}</strong> {isHi ? sambhavitReport.addictions.adviceHi : sambhavitReport.addictions.adviceEn}
                  </p>
                </div>
              </div>
            )}

            {/* 12. Bandhana Yoga */}
            {(div12SubTab === 'all' || div12SubTab === 'caution_crisis') && (
              <div className="card" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <strong style={{ fontSize: '14px', color: 'var(--accent)' }}>
                    {isHi ? '12. कारावास / बंधन योग (Incarceration Yoga)' : '12. Incarceration / Bandhana Yoga'}
                  </strong>
                  <span className={`tag ${sambhavitReport.bandhanaYoga.hasRisk ? 'tag-danger' : 'tag-good'}`}>
                    {sambhavitReport.bandhanaYoga.hasRisk ? (isHi ? 'सावधानी अपेक्षित' : 'Caution Required') : (isHi ? 'दोष मुक्त (सुरक्षित)' : 'Safe / Absent')}
                  </span>
                </div>
                <div style={{ fontSize: '12.5px', lineHeight: 1.5, color: 'var(--text-primary)' }}>
                  <p style={{ margin: '0 0 6px 0' }}>
                    <strong>{isHi ? 'शास्त्रीय निर्णय:' : 'Verdict:'}</strong> {isHi ? sambhavitReport.bandhanaYoga.verdictHi : sambhavitReport.bandhanaYoga.verdictEn}
                  </p>
                  <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                    <strong>{isHi ? 'सुरक्षा सूत्र:' : 'Mitigation:'}</strong> {isHi ? sambhavitReport.bandhanaYoga.mitigationHi : sambhavitReport.bandhanaYoga.mitigationEn}
                  </p>
                </div>
              </div>
            )}

            {/* 17. Friends */}
            {(div12SubTab === 'all' || div12SubTab === 'caution_crisis') && (
              <div className="card" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <strong style={{ fontSize: '14px', color: 'var(--accent)' }}>
                    {isHi ? '17. मित्रों का स्वभाव (Friends & Circle)' : '17. Friends & Social Circle'}
                  </strong>
                  <span className="tag tag-subtle">{isHi ? 'एकादश भाव व लाभेश' : '11th House & Lord'}</span>
                </div>
                <div style={{ fontSize: '12.5px', lineHeight: 1.5, color: 'var(--text-primary)' }}>
                  <p style={{ margin: '0 0 6px 0' }}>
                    <strong>{isHi ? 'मित्रों की प्रकृति:' : 'Nature:'}</strong> {isHi ? sambhavitReport.friends.natureHi : sambhavitReport.friends.natureEn}
                  </p>
                  <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                    <strong>{isHi ? 'विश्वसनीयता:' : 'Loyalty:'}</strong> {isHi ? sambhavitReport.friends.loyaltyVerdictHi : sambhavitReport.friends.loyaltyVerdictEn}
                  </p>
                </div>
              </div>
            )}

            {/* 18. Cautions & Hazards */}
            {(div12SubTab === 'all' || div12SubTab === 'caution_crisis') && (
              <div className="card" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <strong style={{ fontSize: '14px', color: 'var(--accent)' }}>
                    {isHi ? '18. सावधान रहने योग्य बातें (Hazards & Cautions)' : '18. Cautions & Hazards'}
                  </strong>
                  <span className="tag tag-danger">{isHi ? 'विशेष सतर्कता' : 'Critical Cautions'}</span>
                </div>
                <div style={{ fontSize: '12.5px', lineHeight: 1.5, color: 'var(--text-primary)' }}>
                  <ul style={{ margin: '0 0 8px 0', paddingLeft: '18px' }}>
                    {(isHi ? sambhavitReport.cautions.hazardsHi : sambhavitReport.cautions.hazardsEn).map((h, idx) => (
                      <li key={idx} style={{ marginBottom: '4px' }}>{h}</li>
                    ))}
                  </ul>
                  <p style={{ margin: 0, fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                    {isHi ? sambhavitReport.cautions.warningNoteHi : sambhavitReport.cautions.warningNoteEn}
                  </p>
                </div>
              </div>
            )}

            {/* 19. Crisis Strategy */}
            {(div12SubTab === 'all' || div12SubTab === 'caution_crisis') && (
              <div className="card" style={{ padding: '16px', borderLeft: '4px solid var(--accent)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <strong style={{ fontSize: '14px', color: 'var(--accent)' }}>
                    {isHi ? '19. संकट में क्या करें (Crisis Strategy)' : '19. Crisis Strategy & Anchor'}
                  </strong>
                  <span className="tag tag-accent">{isHi ? 'आपातकालीन वैदिक संबल' : 'Emergency Anchor'}</span>
                </div>
                <div style={{ fontSize: '12.5px', lineHeight: 1.5, color: 'var(--text-primary)' }}>
                  <p style={{ margin: '0 0 6px 0' }}>
                    <strong>{isHi ? 'संकटमोचक आराध्य:' : 'Protective Deity:'}</strong>{' '}
                    <span style={{ fontWeight: 700, color: 'var(--accent)' }}>
                      {isHi ? sambhavitReport.crisisStrategy.primaryDeityHi : sambhavitReport.crisisStrategy.primaryDeityEn}
                    </span>
                  </p>
                  <div style={{ padding: '8px 12px', background: 'var(--bg-subtle)', borderRadius: '4px', fontSize: '12.5px', color: 'var(--accent)', fontWeight: 600, margin: '6px 0' }}>
                    {sambhavitReport.crisisStrategy.rescueMantra}
                  </div>
                  <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                    <strong>{isHi ? 'संकट निवारण विधान:' : 'Action Protocol:'}</strong> {isHi ? sambhavitReport.crisisStrategy.actionProtocolHi : sambhavitReport.crisisStrategy.actionProtocolEn}
                  </p>
                </div>
              </div>
            )}

            {/* 20. Sports & Fitness */}
            {(div12SubTab === 'all' || div12SubTab === 'caution_crisis') && (
              <div className="card" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <strong style={{ fontSize: '14px', color: 'var(--accent)' }}>
                    {isHi ? '20. रुचिकर खेल व व्यायाम (Sports & Fitness)' : '20. Sports & Fitness Preferences'}
                  </strong>
                  <span className="tag tag-subtle">{isHi ? 'तृतीय भाव व मंगल' : '3rd House & Mars'}</span>
                </div>
                <div style={{ fontSize: '12.5px', lineHeight: 1.5, color: 'var(--text-primary)' }}>
                  <p style={{ margin: '0 0 6px 0' }}>
                    <strong>{isHi ? 'पसंदीदा खेल:' : 'Favorite Sports:'}</strong>{' '}
                    {isHi ? sambhavitReport.sports.preferencesHi.join(', ') : sambhavitReport.sports.preferencesEn.join(', ')}
                  </p>
                  <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                    <strong>{isHi ? 'व्यायाम शैली:' : 'Fitness Style:'}</strong> {isHi ? sambhavitReport.sports.fitnessStyleHi : sambhavitReport.sports.fitnessStyleEn}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
