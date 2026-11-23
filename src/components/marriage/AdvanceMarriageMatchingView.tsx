import React, { useMemo, useState } from 'react';
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  FileText,
  Flame,
  Heart,
  HelpCircle,
  Layers,
  MapPin,
  Printer,
  RotateCcw,
  Shield,
  ShieldAlert,
  Sparkles,
  Sun,
  User,
  Users,
} from 'lucide-react';
import { calculateChart } from '../../astro/calculator';
import { NAKSHATRAS, SIGNS } from '../../astro/constants';
import {
  computeAdvanceMarriageMatching,
  type AdvanceMarriageMatchReport,
} from '../../astro/marriageMatchingEngine';
import {
  computeMasterMarriageMuhurtaReport,
  type MasterMarriageMuhurtaReport,
} from '../../astro/marriageMuhurtaEngine';
import { computeComprehensiveMarriageReport } from '../../astro/predictions/marriageAstrologyEngine';
import { formatDateDmy } from '../../astro/time';
import type { BirthInput, CalcSettings, ChartStyle } from '../../astro/types';
import { useLanguage } from '../../i18n/LanguageContext';
import { trPlanetShort, trSign } from '../../i18n/translations';
import { DateDmyInput } from '../DateDmyInput';
import { InlineCityAutocomplete } from '../InlineCityAutocomplete';
import { VedicChartSvg, type ChartBadgeItem } from '../VedicChartSvg';

export type MarriageSubTab =
  | 'ashtakoota'
  | 'dashakoota'
  | 'dosha-parihara'
  | 'tribala-pooja'
  | 'muhurta'
  | 'synastry-d9';

interface AdvanceMarriageMatchingViewProps {
  settings: CalcSettings;
  profiles?: BirthInput[];
  activeProfileId?: string;
  initialSubTab?: MarriageSubTab;
  onChangeChartStyle?: (style: ChartStyle) => void;
  onNavigate?: (view: string, sub?: string) => void;
}

export const AdvanceMarriageMatchingView: React.FC<AdvanceMarriageMatchingViewProps> = ({
  settings,
  profiles = [],
  activeProfileId,
  initialSubTab = 'ashtakoota',
  onChangeChartStyle,
  onNavigate,
}) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';

  const [activeTab, setActiveTab] = useState<MarriageSubTab>(initialSubTab);
  const [muhurtaCeremonyFilter, setMuhurtaCeremonyFilter] = useState<'all' | 'Vivaha' | 'Sagai' | 'Tilak'>('all');

  // Default Groom Input
  const [groomInput, setGroomInput] = useState<BirthInput>(() => {
    if (activeProfileId && profiles.length > 0) {
      const match = profiles.find((p) => p.id === activeProfileId);
      if (match && match.gender === 'male') return { ...match };
    }
    const defaultBoy = profiles.find((p) => p.gender === 'male');
    if (defaultBoy) return { ...defaultBoy };
    return {
      id: 'groom-default',
      name: isHi ? 'वर (Groom)' : 'Groom',
      gender: 'male',
      date: '1995-05-15',
      time: '10:30',
      city: 'New Delhi',
      country: 'India',
      latitude: 28.6139,
      longitude: 77.209,
      timezone: 'Asia/Kolkata',
    };
  });

  // Default Bride Input
  const [brideInput, setBrideInput] = useState<BirthInput>(() => {
    const defaultGirl = profiles.find((p) => p.gender === 'female');
    if (defaultGirl) return { ...defaultGirl };
    return {
      id: 'bride-default',
      name: isHi ? 'कन्या (Bride)' : 'Bride',
      gender: 'female',
      date: '1998-08-22',
      time: '14:15',
      city: 'Varanasi',
      country: 'India',
      latitude: 25.3176,
      longitude: 82.9739,
      timezone: 'Asia/Kolkata',
    };
  });

  // Calculate Natal Charts
  const groomChart = useMemo(() => calculateChart(groomInput, settings), [groomInput, settings]);
  const brideChart = useMemo(() => calculateChart(brideInput, settings), [brideInput, settings]);

  // Execute Advanced Matching Engine
  const matchReport: AdvanceMarriageMatchReport = useMemo(() => {
    return computeAdvanceMarriageMatching(groomChart, brideChart);
  }, [groomChart, brideChart]);

  // Execute Authentic Muhurta Engine
  const muhurtaReport: MasterMarriageMuhurtaReport = useMemo(() => {
    return computeMasterMarriageMuhurtaReport(groomChart, brideChart);
  }, [groomChart, brideChart]);

  // Execute Classical Nadi, Stree Jataka & Double Transit Marriage Engine
  const groomMarriage = useMemo(() => computeComprehensiveMarriageReport(groomChart), [groomChart]);
  const brideMarriage = useMemo(() => computeComprehensiveMarriageReport(brideChart), [brideChart]);

  // Chart Badges for Visual Displays
  const groomD1Badges: ChartBadgeItem[] = useMemo(() => [
    {
      id: 'Asc',
      label: trPlanetShort('Asc', lang),
      signIndex: groomChart.ascendant.signIndex,
      houseNumber: 1,
      isLagna: true,
    },
    ...groomChart.planets.map((p) => ({
      id: p.id,
      label: trPlanetShort(p.id, lang),
      signIndex: p.signIndex,
      houseNumber: p.houseNumber,
      isRetrograde: p.isRetrograde,
      isCombust: p.isCombust,
      dignity: p.dignity,
    })),
  ], [groomChart, lang]);

  const brideD1Badges: ChartBadgeItem[] = useMemo(() => [
    {
      id: 'Asc',
      label: trPlanetShort('Asc', lang),
      signIndex: brideChart.ascendant.signIndex,
      houseNumber: 1,
      isLagna: true,
    },
    ...brideChart.planets.map((p) => ({
      id: p.id,
      label: trPlanetShort(p.id, lang),
      signIndex: p.signIndex,
      houseNumber: p.houseNumber,
      isRetrograde: p.isRetrograde,
      isCombust: p.isCombust,
      dignity: p.dignity,
    })),
  ], [brideChart, lang]);

  const groomD9Badges: ChartBadgeItem[] = useMemo(() => {
    return groomChart.divisionalCharts.D9.placements.map((p) => ({
      id: p.id,
      label: trPlanetShort(p.id, lang),
      signIndex: p.signIndex,
      isLagna: p.id === 'Asc',
      isRetrograde: p.isRetrograde,
      isCombust: p.isCombust,
      dignity: p.dignity,
    }));
  }, [groomChart, lang]);

  const brideD9Badges: ChartBadgeItem[] = useMemo(() => {
    return brideChart.divisionalCharts.D9.placements.map((p) => ({
      id: p.id,
      label: trPlanetShort(p.id, lang),
      signIndex: p.signIndex,
      isLagna: p.id === 'Asc',
      isRetrograde: p.isRetrograde,
      isCombust: p.isCombust,
      dignity: p.dignity,
    }));
  }, [brideChart, lang]);

  const groomMoon = useMemo(() => groomChart.planets.find((p) => p.id === 'Moon') || groomChart.ascendant, [groomChart]);
  const brideMoon = useMemo(() => brideChart.planets.find((p) => p.id === 'Moon') || brideChart.ascendant, [brideChart]);

  const handleSwapProfiles = () => {
    const temp = { ...groomInput };
    setGroomInput({ ...brideInput, gender: 'male' });
    setBrideInput({ ...temp, gender: 'female' });
  };

  // Filtered Muhurtas
  const displayedMuhurtas = useMemo(() => {
    const vivaha = muhurtaReport.vivahaMuhurtas;
    const sagai = muhurtaReport.sagaiMuhurtas;
    const tilak = muhurtaReport.tilakMuhurtas;

    if (muhurtaCeremonyFilter === 'Vivaha') return vivaha;
    if (muhurtaCeremonyFilter === 'Sagai') return sagai;
    if (muhurtaCeremonyFilter === 'Tilak') return tilak;

    // Interleave all sorted by date
    const combined = [...vivaha, ...sagai, ...tilak];
    combined.sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
    return combined;
  }, [muhurtaReport, muhurtaCeremonyFilter]);

  return (
    <div className="oj-page-container amm-container">
      {/* Breadcrumb Navigation */}
      <nav className="oj-breadcrumbs no-print" aria-label="Breadcrumb">
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            onNavigate?.('home');
          }}
        >
          {isHi ? 'होम' : 'Home'}
        </a>
        <span className="oj-bc-sep">/</span>
        <span className="oj-bc-current">
          {isHi ? 'उन्नत कुण्डली मिलान व विवाह मुहूर्त' : 'Advance Kundali Matching & Marriage Muhurta'}
        </span>
      </nav>

      {/* Main Header Card */}
      <div className="oj-page-header-card">
        <div className="oj-header-badge">
          <Heart size={14} />
          <span>{isHi ? 'शास्त्रसम्मत कुण्डली मिलान महा-इंजन' : 'Classical Vedic Matching Suite'}</span>
        </div>
        <h1 className="oj-page-title">
          {isHi ? 'उन्नत कुण्डली मिलान, त्रिबल शुद्धि व शुभ मुहूर्त' : 'Advance Kundali Milan & Authentic Muhurta Engine'}
        </h1>
        <p className="oj-page-subtitle">
          {isHi
            ? 'अष्टकूट ३६ गुण, दक्षिण भारतीय दशकूट (१० कूट), १६ मांगलिक परिहार नियम, भकूट व नाड़ी परिहार, बीज-क्षेत्र स्फुट, त्रिबल शुद्धि (सूर्य/गुरु/चंद्र बल), संपूर्ण लाल/पीली पूजा विधान एवं शुद्ध विवाह, सगाई व तिलक मुहूर्त।'
            : 'Ashtakoota 36 Gunas, 10 South Indian Poruthams, 16 Classical Manglik Bhanga rules, Bhakoot & Nadi Pariharas, Beeja-Kshetra fertility, Tribala Shuddhi, complete remedial Puja protocols, and authentic ceremony Muhurtas.'}
        </p>

        <div className="oj-page-actions-bar no-print">
          <div className="oj-chart-style-pill">
            <span className="oj-pill-label">{isHi ? 'चार्ट शैली:' : 'Chart Style:'}</span>
            <select
              className="oj-chart-select"
              value={settings.chartStyle}
              onChange={(e) => onChangeChartStyle?.(e.target.value as ChartStyle)}
            >
              <option value="north">{isHi ? 'उत्तर भारतीय (North)' : 'North Indian'}</option>
              <option value="south">{isHi ? 'दक्षिण भारतीय (South)' : 'South Indian'}</option>
              <option value="east">{isHi ? 'पूर्व भारतीय (East)' : 'East Indian'}</option>
            </select>
          </div>

          <button
            type="button"
            className="oj-action-btn secondary"
            onClick={handleSwapProfiles}
            title={isHi ? 'वर और कन्या के विवरण आपस में बदलें' : 'Swap Groom and Bride profiles'}
          >
            <RotateCcw size={15} />
            <span>{isHi ? 'वर-कन्या परस्पर बदलें' : 'Swap Groom & Bride'}</span>
          </button>

          <button
            type="button"
            className="oj-action-btn secondary"
            onClick={() => window.print()}
            title={isHi ? 'विवाह मिलान रिपोर्ट प्रिंट / PDF' : 'Print / Export PDF'}
          >
            <Printer size={15} />
            <span>{isHi ? 'प्रिंट / PDF रिपोर्ट' : 'Print / PDF Report'}</span>
          </button>
        </div>
      </div>

      {/* Dual Birth Input Section: Groom and Bride */}
      <div className="oj-two-col-grid no-print">
        {/* Groom Profile Card */}
        <div className="oj-card oj-form-card">
          <div className="oj-card-header" style={{ borderBottom: '2px solid rgba(217, 119, 6, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={18} color="#b45309" />
              <h3 style={{ margin: 0, color: '#b45309' }}>
                {isHi ? 'वर (लड़के) का जन्म विवरण' : 'Groom (Boy) Birth Details'}
              </h3>
            </div>
            {profiles.length > 0 && (
              <select
                className="select-compact"
                value={groomInput.id}
                onChange={(e) => {
                  const found = profiles.find((p) => p.id === e.target.value);
                  if (found) setGroomInput({ ...found, gender: 'male' });
                }}
              >
                <option value="">{isHi ? '-- सहेजी प्रोफ़ाइल चुनें --' : '-- Select Profile --'}</option>
                {profiles.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({formatDateDmy(p.date)})
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="oj-form-grid" style={{ marginTop: '12px' }}>
            <div className="oj-field oj-field-full">
              <label>{isHi ? 'वर का पूरा नाम' : 'Groom Full Name'}</label>
              <input
                type="text"
                value={groomInput.name}
                onChange={(e) => setGroomInput({ ...groomInput, name: e.target.value })}
              />
            </div>
            <div className="oj-field">
              <label>{isHi ? 'जन्म तिथि' : 'Birth Date'}</label>
              <DateDmyInput
                value={groomInput.date}
                onChange={(d) => setGroomInput({ ...groomInput, date: d })}
              />
            </div>
            <div className="oj-field">
              <label>{isHi ? 'जन्म समय' : 'Birth Time'}</label>
              <input
                type="time"
                step="1"
                value={groomInput.time}
                onChange={(e) => setGroomInput({ ...groomInput, time: e.target.value })}
              />
            </div>
            <div className="oj-field oj-field-full">
              <label>{isHi ? 'जन्म स्थान (जिला / नगर)' : 'Birth City / District'}</label>
              <InlineCityAutocomplete
                value={groomInput.city}
                onChangeText={(c) => setGroomInput({ ...groomInput, city: c })}
                onSelectCity={(entry) =>
                  setGroomInput({
                    ...groomInput,
                    city: entry.city,
                    country: entry.country,
                    latitude: entry.lat,
                    longitude: entry.lng,
                    timezone: entry.timezone,
                  })
                }
                lang={lang}
              />
            </div>
          </div>
          <div style={{ marginTop: '10px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {isHi ? 'चंद्र राशि:' : 'Moon Sign:'}{' '}
            <strong>{trSign(groomMoon.signIndex, lang)}</strong> ·{' '}
            {isHi ? 'नक्षत्र:' : 'Nakshatra:'}{' '}
            <strong>{groomMoon.nakshatraName}</strong> ({isHi ? 'पाद' : 'Pada'} {groomMoon.pada})
          </div>
        </div>

        {/* Bride Profile Card */}
        <div className="oj-card oj-form-card">
          <div className="oj-card-header" style={{ borderBottom: '2px solid rgba(236, 72, 153, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={18} color="#db2777" />
              <h3 style={{ margin: 0, color: '#db2777' }}>
                {isHi ? 'कन्या (लड़की) का जन्म विवरण' : 'Bride (Girl) Birth Details'}
              </h3>
            </div>
            {profiles.length > 0 && (
              <select
                className="select-compact"
                value={brideInput.id}
                onChange={(e) => {
                  const found = profiles.find((p) => p.id === e.target.value);
                  if (found) setBrideInput({ ...found, gender: 'female' });
                }}
              >
                <option value="">{isHi ? '-- सहेजी प्रोफ़ाइल चुनें --' : '-- Select Profile --'}</option>
                {profiles.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({formatDateDmy(p.date)})
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="oj-form-grid" style={{ marginTop: '12px' }}>
            <div className="oj-field oj-field-full">
              <label>{isHi ? 'कन्या का पूरा नाम' : 'Bride Full Name'}</label>
              <input
                type="text"
                value={brideInput.name}
                onChange={(e) => setBrideInput({ ...brideInput, name: e.target.value })}
              />
            </div>
            <div className="oj-field">
              <label>{isHi ? 'जन्म तिथि' : 'Birth Date'}</label>
              <DateDmyInput
                value={brideInput.date}
                onChange={(d) => setBrideInput({ ...brideInput, date: d })}
              />
            </div>
            <div className="oj-field">
              <label>{isHi ? 'जन्म समय' : 'Birth Time'}</label>
              <input
                type="time"
                step="1"
                value={brideInput.time}
                onChange={(e) => setBrideInput({ ...brideInput, time: e.target.value })}
              />
            </div>
            <div className="oj-field oj-field-full">
              <label>{isHi ? 'जन्म स्थान (जिला / नगर)' : 'Birth City / District'}</label>
              <InlineCityAutocomplete
                value={brideInput.city}
                onChangeText={(c) => setBrideInput({ ...brideInput, city: c })}
                onSelectCity={(entry) =>
                  setBrideInput({
                    ...brideInput,
                    city: entry.city,
                    country: entry.country,
                    latitude: entry.lat,
                    longitude: entry.lng,
                    timezone: entry.timezone,
                  })
                }
                lang={lang}
              />
            </div>
          </div>
          <div style={{ marginTop: '10px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {isHi ? 'चंद्र राशि:' : 'Moon Sign:'}{' '}
            <strong>{trSign(brideMoon.signIndex, lang)}</strong> ·{' '}
            {isHi ? 'नक्षत्र:' : 'Nakshatra:'}{' '}
            <strong>{brideMoon.nakshatraName}</strong> ({isHi ? 'पाद' : 'Pada'} {brideMoon.pada})
          </div>
        </div>
      </div>

      {/* Hero Score & Suitability Summary Banner */}
      <div className="amm-hero-card">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className={`amm-grade-pill grade-${matchReport.suitabilityGrade.replace('+', '-plus')}`}>
              {isHi ? `श्रेणी: ${matchReport.suitabilityGrade}` : `Grade: ${matchReport.suitabilityGrade}`}
            </span>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              {isHi
                ? `अष्टकूट मूल गुण: ${matchReport.ashtakoota.totalObtained}/36 | प्रभावी गुण: ${matchReport.totalEffectiveGunas}/36`
                : `Base Gunas: ${matchReport.ashtakoota.totalObtained}/36 | Effective: ${matchReport.totalEffectiveGunas}/36`}
            </span>
          </div>
          <h2 style={{ margin: 0, fontSize: '1.35rem', color: 'var(--text)' }}>
            {isHi ? matchReport.overallVerdictHi : matchReport.overallVerdictEn}
          </h2>
          <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <span>
              <strong>{isHi ? 'मांगलिक स्थिति:' : 'Manglik Status:'}</strong>{' '}
              {matchReport.manglikAnalysis.severity === 'Clean' || matchReport.manglikAnalysis.severity === 'Cancelled'
                ? (isHi ? 'निर्दोष / परिहार मान्य' : 'Clean / Balanced')
                : (isHi ? `प्रभाव: ${matchReport.manglikAnalysis.severity}` : `Severity: ${matchReport.manglikAnalysis.severity}`)}
            </span>
            <span>
              <strong>{isHi ? 'रज्जु दोष सुरक्षा:' : 'Rajju Safety:'}</strong>{' '}
              {matchReport.dashakoota.criticalRajjuPass
                ? (isHi ? 'सुरक्षित (दीर्घायु वरदान)' : 'Safe (Longevity Assured)')
                : (isHi ? 'समान रज्जु (सावधानी अपेक्षित)' : 'Same Rajju (Care Needed)')}
            </span>
            <span>
              <strong>{isHi ? 'संतान स्फुट सामर्थ्य:' : 'Progeny Score:'}</strong> {matchReport.beejaKshetra.score}/100
            </span>
          </div>
        </div>

        <div className="amm-score-badge">
          <span className="amm-score-number">{matchReport.totalEffectiveGunas}</span>
          <span className="amm-score-max">/ 36</span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <nav className="amm-tabs-nav no-print" aria-label="Marriage Matching Tabs">
        <button
          type="button"
          className={`amm-tab-btn ${activeTab === 'ashtakoota' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('ashtakoota')}
        >
          <Award size={16} />
          <span>{isHi ? '१. अष्टकूट ३६ गुण मिलान' : '1. Ashtakoota 36 Gunas'}</span>
        </button>

        <button
          type="button"
          className={`amm-tab-btn ${activeTab === 'dashakoota' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('dashakoota')}
        >
          <Layers size={16} />
          <span>{isHi ? '२. दशकूट (१० कूट) मिलान' : '2. Dashakoota (10 Poruthams)'}</span>
        </button>

        <button
          type="button"
          className={`amm-tab-btn ${activeTab === 'dosha-parihara' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('dosha-parihara')}
        >
          <ShieldAlert size={16} />
          <span>{isHi ? '३. दोष एवं शास्त्रीय परिहार' : '3. Dosha & Classical Pariharas'}</span>
        </button>

        <button
          type="button"
          className={`amm-tab-btn ${activeTab === 'tribala-pooja' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('tribala-pooja')}
        >
          <Flame size={16} />
          <span>{isHi ? '४. त्रिबल शुद्धि व पूजा विधान' : '4. Tribala & Puja Protocols'}</span>
        </button>

        <button
          type="button"
          className={`amm-tab-btn ${activeTab === 'muhurta' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('muhurta')}
        >
          <Calendar size={16} />
          <span>{isHi ? '५. सटीक मुहूर्त (विवाह, सगाई, तिलक)' : '5. Authentic Muhurta Calendar'}</span>
        </button>

        <button
          type="button"
          className={`amm-tab-btn ${activeTab === 'synastry-d9' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('synastry-d9')}
        >
          <Compass size={16} />
          <span>{isHi ? '६. द्वादश भाव सादृश्य, दशा संधि, स्त्री जातक व D9' : '6. 12 Houses, Dasha Sandhi, Stri Jataka & D9'}</span>
        </button>
      </nav>

      {/* =========================================================================
          TAB 1: ASHTAKOOTA 36 GUNAS
         ========================================================================= */}
      {activeTab === 'ashtakoota' && (
        <div className="amm-card">
          <div className="oj-card-header">
            <div>
              <h2 style={{ margin: 0 }}>
                {isHi ? 'अष्टकूट ३६ गुण विस्तृत शास्त्रीय सारणी' : 'Ashtakoota 36-Point Classical Compatibility'}
              </h2>
              <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {isHi
                  ? 'वर्ण, वश्य, तारा, योनि, ग्रहमैत्री, गण, भकूट और नाड़ी — ८ प्रमुख कूटों का विश्लेषण।'
                  : 'Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot and Nadi — 8 cardinal kootas.'}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#b45309' }}>
                {matchReport.ashtakoota.totalObtained} / 36
              </span>
            </div>
          </div>

          <div className="oj-table-wrapper" style={{ marginTop: '14px' }}>
            <table className="oj-table">
              <thead>
                <tr>
                  <th>{isHi ? 'कूट (Koota)' : 'Koota Name'}</th>
                  <th>{isHi ? 'शास्त्रीय क्षेत्र' : 'Domain'}</th>
                  <th>{isHi ? 'अधिकतम' : 'Max'}</th>
                  <th>{isHi ? 'प्राप्त अंक' : 'Obtained'}</th>
                  <th>{isHi ? 'वर का मान' : 'Groom Value'}</th>
                  <th>{isHi ? 'कन्या का मान' : 'Bride Value'}</th>
                  <th>{isHi ? 'फलकथन व विवेचना' : 'Classical Significance'}</th>
                </tr>
              </thead>
              <tbody>
                {matchReport.ashtakoota.kootas.map((k, i) => (
                  <tr key={i}>
                    <td>
                      <strong>{k.name}</strong>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{k.sanskrit}</td>
                    <td>{k.maxPoints}</td>
                    <td>
                      <strong
                        style={{
                          fontSize: '1rem',
                          color:
                            k.obtainedPoints === k.maxPoints
                              ? '#059669'
                              : k.obtainedPoints === 0
                              ? '#dc2626'
                              : '#d97706',
                        }}
                      >
                        {k.obtainedPoints}
                      </strong>
                    </td>
                    <td>{k.groomValue}</td>
                    <td>{k.brideValue}</td>
                    <td style={{ fontSize: '0.85rem' }}>{k.note}</td>
                  </tr>
                ))}
                <tr className="oj-row-highlight">
                  <th colSpan={2}>{isHi ? 'कुल प्राप्त गुण' : 'Total Obtained Gunas'}</th>
                  <th>36</th>
                  <th>
                    <strong style={{ fontSize: '1.15rem', color: '#b45309' }}>
                      {matchReport.ashtakoota.totalObtained}
                    </strong>
                  </th>
                  <th colSpan={3}>
                    {matchReport.ashtakoota.totalObtained >= 18
                      ? (isHi ? 'विवाह हेतु उत्तम व शुभ (१८ से अधिक गुण)' : 'Auspicious alliance (18+ Gunas)')
                      : (isHi ? '१८ से कम गुण (शास्त्रीय परिहार व परामर्श अपेक्षित)' : 'Below 18 (Pariharas required)')}
                  </th>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Parashara & Classical Guidance Note */}
          <div style={{ marginTop: '16px', padding: '14px', borderRadius: '10px', background: 'var(--bg-subtle, #f8fafc)', borderLeft: '4px solid #b45309' }}>
            <h4 style={{ margin: '0 0 6px', color: '#b45309', fontSize: '0.95rem' }}>
              {isHi ? 'महर्षि पराशर एवं जातक पारिजात निर्णय:' : 'Maharshi Parashara & Classical Wisdom:'}
            </h4>
            <p style={{ margin: 0, fontSize: '0.88rem', lineHeight: 1.5, color: 'var(--text)' }}>
              {isHi
                ? 'यदि नाड़ी अथवा भकूट में शून्य अंक आएं, किंतु नक्षत्र स्वामी एक हों, राशि स्वामी मित्र हों या चरण भिन्न हों, तो दोष का परिहार हो जाता है। अगले "दोष एवं परिहार" टैब में सभी शास्त्रीय परिहार स्वतः जांचे गए हैं।'
                : 'Even if Nadi or Bhakoot yields 0 points, identical Rasi lords, mutual friendship of lords, or different padas grant shastric cancellation. Review Tab 3 for full rule-by-rule mitigation.'}
            </p>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: DASHAKOOTA (10 SOUTH INDIAN PORUTHAMS)
         ========================================================================= */}
      {activeTab === 'dashakoota' && (
        <div className="amm-card">
          <div className="oj-card-header">
            <div>
              <h2 style={{ margin: 0 }}>
                {isHi ? 'दक्षिण भारतीय दशकूट (१० पोरुथम) निर्णय' : 'Dashakoota (10 South Indian Poruthams)'}
              </h2>
              <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {isHi
                  ? 'दीना, गणा, माहेन्द्रा, स्त्री दीर्घ, योनि, राशि, राश्यधिपति, वश्य, रज्जु एवं वेध कूटों की सटीक गणना।'
                  : 'Dina, Gana, Mahendra, Stree Deergha, Yoni, Rashi, Rashi Adhipathi, Vashya, Rajju, and Vedha.'}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#059669' }}>
                {matchReport.dashakoota.totalScore} / {matchReport.dashakoota.maxScore}
              </span>
            </div>
          </div>

          {/* Rajju & Vedha Crucial Badges */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', margin: '14px 0' }}>
            <div
              style={{
                padding: '14px',
                borderRadius: '10px',
                background: matchReport.dashakoota.criticalRajjuPass ? 'rgba(5, 150, 105, 0.08)' : 'rgba(220, 38, 38, 0.08)',
                border: `1px solid ${matchReport.dashakoota.criticalRajjuPass ? 'rgba(5, 150, 105, 0.3)' : 'rgba(220, 38, 38, 0.3)'}`,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ color: matchReport.dashakoota.criticalRajjuPass ? '#065f46' : '#991b1b', fontSize: '1rem' }}>
                  {isHi ? 'रज्जु पोरुथम (Rajju Porutham)' : 'Rajju Porutham (Longevity)'}
                </strong>
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    background: matchReport.dashakoota.criticalRajjuPass ? '#059669' : '#dc2626',
                    color: '#fff',
                  }}
                >
                  {matchReport.dashakoota.criticalRajjuPass ? (isHi ? 'उत्तम / सुरक्षित' : 'Safe / Matched') : (isHi ? 'समान रज्जु' : 'Dosha Present')}
                </span>
              </div>
              <p style={{ margin: '6px 0 0', fontSize: '0.86rem', color: 'var(--text)' }}>
                {isHi
                  ? `वर नक्षत्र: ${groomMoon.nakshatraName} | कन्या नक्षत्र: ${brideMoon.nakshatraName}। ${matchReport.dashakoota.criticalRajjuPass ? 'दोनों के रज्जु भिन्न हैं, जिससे अखंड सौभाग्य व दांपत्य दीर्घायु का वरदान प्राप्त होता है।' : 'समान रज्जु होने पर परिहार नियमों अथवा शांतिक कर्म की आवश्यकता होती है।'}`
                  : `Groom Star: ${groomMoon.nakshatraName} | Bride Star: ${brideMoon.nakshatraName}. Different rajju preserves marital longevity.`}
              </p>
            </div>

            <div
              style={{
                padding: '14px',
                borderRadius: '10px',
                background: 'rgba(14, 165, 233, 0.08)',
                border: '1px solid rgba(14, 165, 233, 0.3)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ color: '#0369a1', fontSize: '1rem' }}>
                  {isHi ? 'वेध पोरुथम (Vedha Porutham)' : 'Vedha Porutham (Repulsion Guard)'}
                </strong>
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    background: '#0284c7',
                    color: '#fff',
                  }}
                >
                  {isHi ? 'वेध रहित / निर्दोष' : 'Free from Vedha'}
                </span>
              </div>
              <p style={{ margin: '6px 0 0', fontSize: '0.86rem', color: 'var(--text)' }}>
                {isHi
                  ? 'वर एवं कन्या के जन्म नक्षत्रों के मध्य कोई पारस्परिक वेध (शत्रुता) नहीं है। यह संबंध मानसिक व दैहिक शांति प्रदान करेगा।'
                  : 'No mutual repellent Vedha axis between the birth stars of bride and groom.'}
              </p>
            </div>
          </div>

          <div className="oj-table-wrapper">
            <table className="oj-table">
              <thead>
                <tr>
                  <th>{isHi ? 'पोरुथम (Porutham)' : 'Porutham'}</th>
                  <th>{isHi ? 'शास्त्रीय फल (Significance)' : 'Significance'}</th>
                  <th>{isHi ? 'अंक (Score)' : 'Score'}</th>
                  <th>{isHi ? 'स्थिति' : 'Status'}</th>
                  <th>{isHi ? 'विस्तृत व्याख्या' : 'Detailed Interpretation'}</th>
                </tr>
              </thead>
              <tbody>
                {matchReport.dashakoota.items.map((item, i) => (
                  <tr key={i}>
                    <td><strong>{isHi ? item.nameHi : item.nameEn}</strong></td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      {isHi ? `वर: ${item.groomVal} | कन्या: ${item.brideVal}` : `Groom: ${item.groomVal} | Bride: ${item.brideVal}`}
                    </td>
                    <td>
                      <strong>{item.score} / 1</strong>
                    </td>
                    <td>
                      <span
                        style={{
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          background: item.passed ? '#d1fae5' : item.score > 0 ? '#fef3c7' : '#fee2e2',
                          color: item.passed ? '#065f46' : item.score > 0 ? '#92400e' : '#991b1b',
                        }}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>
                      {isHi ? item.noteHi : item.noteEn}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: DOSHAS & 16 MANGLIK BHANGA + PARIHARAS
         ========================================================================= */}
      {activeTab === 'dosha-parihara' && (
        <div className="amm-card">
          <div className="oj-card-header">
            <div>
              <h2 style={{ margin: 0 }}>
                {isHi ? 'दोष विश्लेषण एवं १६ शास्त्रीय मांगलिक परिहार नियम' : 'Doshas & 16 Classical Manglik Bhanga Rules'}
              </h2>
              <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {isHi
                  ? 'बृहत्पाराशर होराशास्त्र एवं मानसागरी अनुसार मंगल, भकूट एवं नाड़ी दोष के प्रामाणिक परिहार।'
                  : 'Authentic exceptions and cancellations from Brihat Parashara Hora Shastra and Manasagari.'}
              </p>
            </div>
          </div>

          {/* Manglik Comparison Banners */}
          <div className="oj-two-col-grid" style={{ margin: '14px 0' }}>
            <div
              style={{
                padding: '14px',
                borderRadius: '10px',
                background: matchReport.manglikAnalysis.groomIsManglik ? 'rgba(239, 68, 68, 0.06)' : 'rgba(5, 150, 105, 0.06)',
                border: `1px solid ${matchReport.manglikAnalysis.groomIsManglik ? 'rgba(239, 68, 68, 0.3)' : 'rgba(5, 150, 105, 0.3)'}`,
              }}
            >
              <strong style={{ fontSize: '0.95rem', color: matchReport.manglikAnalysis.groomIsManglik ? '#991b1b' : '#065f46' }}>
                {isHi ? 'वर की मांगलिक स्थिति:' : 'Groom Manglik Status:'}
              </strong>
              <div style={{ marginTop: '6px', fontSize: '0.9rem', color: 'var(--text)' }}>
                {matchReport.manglikAnalysis.groomIsManglik
                  ? (isHi
                      ? `मांगलिक (लग्न से भाव ${matchReport.manglikAnalysis.groomHouses.join(', ')} में मंगल)`
                      : `Manglik (Mars in House ${matchReport.manglikAnalysis.groomHouses.join(', ')})`)
                  : (isHi ? 'पूर्णतः अमांगलिक (लग्न से कोई मंगल दोष नहीं)' : 'Non-Manglik from Lagna')}
              </div>
            </div>

            <div
              style={{
                padding: '14px',
                borderRadius: '10px',
                background: matchReport.manglikAnalysis.brideIsManglik ? 'rgba(239, 68, 68, 0.06)' : 'rgba(5, 150, 105, 0.06)',
                border: `1px solid ${matchReport.manglikAnalysis.brideIsManglik ? 'rgba(239, 68, 68, 0.3)' : 'rgba(5, 150, 105, 0.3)'}`,
              }}
            >
              <strong style={{ fontSize: '0.95rem', color: matchReport.manglikAnalysis.brideIsManglik ? '#991b1b' : '#065f46' }}>
                {isHi ? 'कन्या की मांगलिक स्थिति:' : 'Bride Manglik Status:'}
              </strong>
              <div style={{ marginTop: '6px', fontSize: '0.9rem', color: 'var(--text)' }}>
                {matchReport.manglikAnalysis.brideIsManglik
                  ? (isHi
                      ? `मांगलिक (लग्न से भाव ${matchReport.manglikAnalysis.brideHouses.join(', ')} में मंगल)`
                      : `Manglik (Mars in House ${matchReport.manglikAnalysis.brideHouses.join(', ')})`)
                  : (isHi ? 'पूर्णतः अमांगलिक (लग्न से कोई मंगल दोष नहीं)' : 'Non-Manglik from Lagna')}
              </div>
            </div>
          </div>

          {/* Mutual Balance / Verdict */}
          <div
            style={{
              padding: '14px 18px',
              borderRadius: '10px',
              marginBottom: '18px',
              background: matchReport.manglikAnalysis.mutualBalanceCancelled ? 'rgba(5, 150, 105, 0.08)' : 'rgba(217, 119, 6, 0.08)',
              borderLeft: `5px solid ${matchReport.manglikAnalysis.mutualBalanceCancelled ? '#059669' : '#d97706'}`,
            }}
          >
            <h4 style={{ margin: '0 0 4px', color: matchReport.manglikAnalysis.mutualBalanceCancelled ? '#065f46' : '#b45309' }}>
              {isHi ? 'मंगल दोष निर्णय एवं निष्कर्ष:' : 'Manglik Judgment & Final Verdict:'}
            </h4>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text)' }}>
              {isHi ? matchReport.manglikAnalysis.finalVerdictHi : matchReport.manglikAnalysis.finalVerdictEn}
            </p>
          </div>

          {/* 16 Classical Manglik Bhanga Rules Grid */}
          <h3 style={{ margin: '18px 0 10px', fontSize: '1.05rem', color: 'var(--text)' }}>
            {isHi ? '१६ शास्त्रीय मांगलिक भंग नियम तालिका:' : '16 Classical Manglik Bhanga Rules Applied:'}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '22px' }}>
            {matchReport.manglikAnalysis.activeBhangaRules.map((rule) => {
              const applied = rule.appliedGroom || rule.appliedBride;
              return (
                <div
                  key={rule.ruleId}
                  className={`amm-parihara-rule-box ${applied ? '' : 'inactive'}`}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '0.92rem', color: applied ? '#065f46' : 'var(--text-muted)' }}>
                      {rule.ruleId}. {isHi ? rule.titleHi : rule.titleEn}
                    </strong>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        background: applied ? '#059669' : '#cbd5e1',
                        color: applied ? '#ffffff' : '#475569',
                      }}
                    >
                      {applied ? (isHi ? 'लागू / दोष भंग' : 'Applied / Cancelled') : (isHi ? 'लागू नहीं' : 'Not Triggered')}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    <strong>{isHi ? 'शास्त्रीय शर्त:' : 'Condition:'}</strong> {isHi ? rule.conditionHi : rule.conditionEn}
                  </div>
                  {applied && (
                    <div style={{ fontSize: '0.84rem', color: '#047857' }}>
                      <strong>{isHi ? 'प्रभाव:' : 'Result:'}</strong> {isHi ? rule.bhangaDescriptionHi : rule.bhangaDescriptionEn}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bhakoot & Nadi Parihara Cards */}
          <div className="oj-two-col-grid">
            {/* Bhakoot Parihara */}
            <div
              style={{
                padding: '16px',
                borderRadius: '10px',
                background: matchReport.bhakootParihara.isPariharaApplicable ? 'rgba(5, 150, 105, 0.06)' : 'rgba(217, 119, 6, 0.06)',
                border: '1px solid rgba(0, 0, 0, 0.08)',
              }}
            >
              <h4 style={{ margin: '0 0 6px', color: '#b45309', fontSize: '1rem' }}>
                {isHi ? 'भकूट दोष एवं ७ शास्त्रीय परिहार' : 'Bhakoot Dosha & 7 Classical Pariharas'}
              </h4>
              <p style={{ margin: '0 0 10px', fontSize: '0.86rem', color: 'var(--text)' }}>
                {isHi ? matchReport.bhakootParihara.verdictHi : matchReport.bhakootParihara.verdictEn}
              </p>
              {matchReport.bhakootParihara.activePariharas.map((p) => (
                <div key={p.id} style={{ fontSize: '0.82rem', padding: '6px 10px', borderRadius: '6px', background: '#ffffff', marginBottom: '6px', border: '1px solid rgba(0,0,0,0.06)' }}>
                  <strong>{isHi ? p.titleHi : p.titleEn}:</strong> {isHi ? p.descriptionHi : p.descriptionEn}
                </div>
              ))}
            </div>

            {/* Nadi Parihara */}
            <div
              style={{
                padding: '16px',
                borderRadius: '10px',
                background: matchReport.nadiParihara.isPariharaApplicable ? 'rgba(5, 150, 105, 0.06)' : 'rgba(217, 119, 6, 0.06)',
                border: '1px solid rgba(0, 0, 0, 0.08)',
              }}
            >
              <h4 style={{ margin: '0 0 6px', color: '#b45309', fontSize: '1rem' }}>
                {isHi ? 'नाड़ी दोष एवं ८ शास्त्रीय परिहार' : 'Nadi Dosha & 8 Classical Pariharas'}
              </h4>
              <p style={{ margin: '0 0 10px', fontSize: '0.86rem', color: 'var(--text)' }}>
                {isHi ? matchReport.nadiParihara.verdictHi : matchReport.nadiParihara.verdictEn}
              </p>
              {matchReport.nadiParihara.activePariharas.map((p) => (
                <div key={p.id} style={{ fontSize: '0.82rem', padding: '6px 10px', borderRadius: '6px', background: '#ffffff', marginBottom: '6px', border: '1px solid rgba(0,0,0,0.06)' }}>
                  <strong>{isHi ? p.titleHi : p.titleEn}:</strong> {isHi ? p.descriptionHi : p.descriptionEn}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: TRIBALA SHUDDHI & COMPLETE PUJA PROTOCOLS (लाल, पीली व सफेद पूजा)
         ========================================================================= */}
      {activeTab === 'tribala-pooja' && (
        <div className="amm-card">
          <div className="oj-card-header">
            <div>
              <h2 style={{ margin: 0 }}>
                {isHi ? 'त्रिबल शुद्धि एवं शास्त्रीय पूजा निर्णय' : 'Tribala Shuddhi & Complete Puja Protocols'}
              </h2>
              <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {isHi
                  ? 'वर का सूर्य बल, कन्या का गुरु बल, दोनों का चंद्र बल एवं लाल पूजा, पीली पूजा व सफेद पूजा का पूर्ण विधि-विधान।'
                  : 'Groom Surya Balam, Bride Guru Balam, Chandra Balam, and complete Lal, Peeli and Safed Puja protocols.'}
              </p>
            </div>
          </div>

          {/* Classical Clarification Banner: Do all dates require Puja? */}
          <div className="amm-callout-box">
            <h3 style={{ margin: '0 0 6px', color: '#b45309', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={18} />
              <span>{isHi ? 'शास्त्रीय त्रिबल शुद्धि नियम एवं पूजा का औचित्य' : 'Classical Tribala Shuddhi Rules & Puja Applicability'}</span>
            </h3>
            <p style={{ margin: '0 0 10px', fontSize: '0.9rem', color: 'var(--text)', lineHeight: 1.5 }}>
              {isHi
                ? 'महत्वपूर्ण नियम: क्या सभी विवाह तिथियों में लाल, पीली या सफेद पूजा अनिवार्य है? बिल्कुल नहीं! जब वर का सूर्य (३, ६, १०, ११वें भाव), कन्या का गुरु (२, ५, ७, ९, ११वें भाव) और दोनों का चंद्र (१, ३, ६, ७, १०, ११वें भाव) में होता है, तो वह विवाह तिथि "पूर्ण त्रिबल शुद्ध" होती है (शून्य पूजा अपेक्षित)। ऐसी तिथियों में किसी भी पूजा की आवश्यकता नहीं होती। केवल मध्यम स्थिति में ही लाल या पीली पूजा विवाह पूर्व कराई जाती है।'
                : 'Crucial Rule: Do all wedding dates require Lal, Peeli or Safed Puja? Absolutely not! When the Groom\'s Sun is in houses 3, 6, 10, 11; Bride\'s Jupiter in 2, 5, 7, 9, 11; and Moon in 1, 3, 6, 7, 10, 11, the date is "Full Tribala Pure" requiring ZERO day-of-wedding pujas.'}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px', marginTop: '10px' }}>
              <div style={{ background: '#ffffff', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.08)' }}>
                <strong style={{ fontSize: '0.86rem', color: '#047857' }}>
                  {isHi ? '१. जन्मकालीन दोष शांति पूजा (Natal Dosha Shanti):' : '1. Natal Kundali Remedial Pujas:'}
                </strong>
                <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  {isHi
                    ? 'जन्म कुंडली के स्थाई दोषों (मांगलिक, नाड़ी, भकूट) के निवारण हेतु विवाह पूर्व केवल एक बार संपन्न की जाने वाली शांति पूजाएं (जैसे कुंभ विवाह, महामृत्युंजय जप, रुद्राभिषेक)।'
                    : 'One-time pre-marital rituals for permanent natal afflictions (Kumbha Vivaha for Mars, Maha Mrityunjaya Japa for Nadi, Rudrabhisheka for Bhakoot).'}
                </p>
              </div>

              <div style={{ background: '#ffffff', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.08)' }}>
                <strong style={{ fontSize: '0.86rem', color: '#b45309' }}>
                  {isHi ? '२. गोचर त्रिबल पूजा (Transit Tribala on Wedding Day):' : '2. Transit Tribala on Wedding Day:'}
                </strong>
                <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  {isHi
                    ? 'यह केवल तब कराई जाती है जब परिवार किसी मध्यम त्रिबल गोचर वाली विवाह तिथि का चयन करता है। यदि पूर्ण त्रिबल शुद्ध तिथि चुनी गई है तो विवाह के दिन कोई पूजा नहीं लगती।'
                    : 'Conducted only on the wedding day IF a couple selects a date with moderate planetary transit strength. Fully pure dates require no day-of puja.'}
                </p>
              </div>
            </div>
          </div>

          {/* Tribala Current Status Cards */}
          <h3 style={{ margin: '18px 0 10px', fontSize: '1.05rem', color: 'var(--text)' }}>
            {isHi ? 'आज का तत्कालीन गोचर त्रिबल (Current Day Transit Tribala for Reference):' : 'Current Day Transit Tribala for Reference:'}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', margin: '14px 0 20px' }}>
            {/* Surya Balam */}
            <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.25)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#dc2626', textTransform: 'uppercase' }}>
                  {isHi ? 'वर का सूर्य बल' : "Groom's Surya Balam"}
                </span>
                <span className={muhurtaReport.currentTribala.groomSuryaStatus === 'Shubha' ? 'amm-badge-shuddha' : 'amm-badge-lal'}>
                  {muhurtaReport.currentTribala.groomSuryaStatus}
                </span>
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, margin: '8px 0 4px', color: '#991b1b' }}>
                {isHi ? `${muhurtaReport.currentTribala.groomSuryaHouse}वां भाव` : `House ${muhurtaReport.currentTribala.groomSuryaHouse}`}
              </div>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text)' }}>
                {isHi ? muhurtaReport.currentTribala.groomSuryaDescriptionHi : muhurtaReport.currentTribala.groomSuryaDescriptionEn}
              </p>
            </div>

            {/* Guru Balam */}
            <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.28)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#d97706', textTransform: 'uppercase' }}>
                  {isHi ? 'कन्या का गुरु बल' : "Bride's Guru Balam"}
                </span>
                <span className={muhurtaReport.currentTribala.brideGuruStatus === 'Shubha' ? 'amm-badge-shuddha' : 'amm-badge-peeli'}>
                  {muhurtaReport.currentTribala.brideGuruStatus}
                </span>
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, margin: '8px 0 4px', color: '#92400e' }}>
                {isHi ? `${muhurtaReport.currentTribala.brideGuruHouse}वां भाव` : `House ${muhurtaReport.currentTribala.brideGuruHouse}`}
              </div>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text)' }}>
                {isHi ? muhurtaReport.currentTribala.brideGuruDescriptionHi : muhurtaReport.currentTribala.brideGuruDescriptionEn}
              </p>
            </div>

            {/* Chandra Balam */}
            <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(14, 165, 233, 0.05)', border: '1px solid rgba(14, 165, 233, 0.25)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase' }}>
                  {isHi ? 'दोनों का चंद्र बल' : "Both's Chandra Balam"}
                </span>
                <span className={muhurtaReport.currentTribala.tribalaPassed ? 'amm-badge-shuddha' : 'amm-badge-peeli'}>
                  {muhurtaReport.currentTribala.tribalaPassed ? 'Shubha' : 'Madhyama'}
                </span>
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, margin: '8px 0 4px', color: '#0369a1' }}>
                {isHi ? `वर: ${muhurtaReport.currentTribala.groomChandraHouse}वां | कन्या: ${muhurtaReport.currentTribala.brideChandraHouse}वां` : `Groom: H${muhurtaReport.currentTribala.groomChandraHouse} | Bride: H${muhurtaReport.currentTribala.brideChandraHouse}`}
              </div>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text)' }}>
                {isHi ? muhurtaReport.currentTribala.verdictHi : muhurtaReport.currentTribala.verdictEn}
              </p>
            </div>
          </div>

          {/* Section A: Natal Kundali Remedial Pujas */}
          <h3 style={{ margin: '24px 0 12px', fontSize: '1.15rem', color: 'var(--text)' }}>
            {isHi ? 'जन्मकालीन कुंडली दोष निवारण अनुष्ठान (Natal Remedial Pujas):' : 'Natal Chart Dosha Pacification Rituals:'}
          </h3>
          <div className="amm-classical-grid" style={{ marginBottom: '22px' }}>
            {/* Manglik Shanti */}
            <div className="amm-classical-card" style={{ borderLeft: '4px solid #ef4444' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '0.95rem', color: '#991b1b' }}>
                  {isHi ? 'मांगलिक शांति अनुष्ठान' : 'Manglik Shanti Ritual'}
                </strong>
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    background: matchReport.manglikAnalysis.severity === 'Clean' || matchReport.manglikAnalysis.severity === 'Cancelled' ? '#d1fae5' : '#fee2e2',
                    color: matchReport.manglikAnalysis.severity === 'Clean' || matchReport.manglikAnalysis.severity === 'Cancelled' ? '#065f46' : '#991b1b',
                  }}
                >
                  {matchReport.manglikAnalysis.severity === 'Clean' || matchReport.manglikAnalysis.severity === 'Cancelled'
                    ? (isHi ? 'आवश्यकता नहीं' : 'Not Required')
                    : (isHi ? 'विवाह पूर्व अनुशंसित' : 'Recommended')}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text)' }}>
                {matchReport.manglikAnalysis.severity === 'Clean' || matchReport.manglikAnalysis.severity === 'Cancelled'
                  ? (isHi ? 'दोनों की कुंडलियों में मंगल दोष शून्य या पूर्णतः परिहार हो चुका है। किसी कुंभ विवाह की आवश्यकता नहीं।' : 'Kuja dosha is absent or cancelled. No pre-marital Kumbha ritual needed.')
                  : (isHi ? 'विवाह से पूर्व जातक हेतु पारंपरिक कुंभ विवाह / अर्क विवाह अथवा मंगल चंडिका स्तोत्र अनुष्ठान कराएं।' : 'Perform traditional Kumbha Vivaha or Ark Vivaha prior to the wedding.')}
              </p>
            </div>

            {/* Nadi Shanti */}
            <div className="amm-classical-card" style={{ borderLeft: '4px solid #3b82f6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '0.95rem', color: '#1e40af' }}>
                  {isHi ? 'नाड़ी दोष महामृत्युंजय अनुष्ठान' : 'Nadi Dosha Shanti Japa'}
                </strong>
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    background: !matchReport.nadiParihara.hasNadiDosha ? '#d1fae5' : '#fee2e2',
                    color: !matchReport.nadiParihara.hasNadiDosha ? '#065f46' : '#991b1b',
                  }}
                >
                  {!matchReport.nadiParihara.hasNadiDosha ? (isHi ? 'दोष मुक्त' : 'Clean') : (isHi ? 'शांति आवश्यक' : 'Japa Needed')}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text)' }}>
                {!matchReport.nadiParihara.hasNadiDosha
                  ? (isHi ? 'नाड़ी दोष नहीं है अथवा शास्त्रीय परिहार लागू है (८/८ अंक)। किसी नाड़ी शांति की आवश्यकता नहीं।' : 'Nadi is pure or parihara applied. No Nadi shanti required.')
                  : (isHi ? 'विवाह पूर्व ११,००० महामृत्युंजय मंत्र जप, स्वर्ण-नाड़ी दान एवं ब्राह्मण भोजन का शास्त्रीय विधान संपन्न कराएं।' : '11,000 Maha Mrityunjaya Japa and Swarna Nadi charity recommended before marriage.')}
              </p>
            </div>

            {/* Bhakoot Shanti */}
            <div className="amm-classical-card" style={{ borderLeft: '4px solid #8b5cf6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '0.95rem', color: '#6d28d9' }}>
                  {isHi ? 'भकूट दोष शिव रुद्राभिषेक' : 'Bhakoot Shiva Rudrabhisheka'}
                </strong>
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    background: !matchReport.bhakootParihara.hasBhakootDosha ? '#d1fae5' : '#fee2e2',
                    color: !matchReport.bhakootParihara.hasBhakootDosha ? '#065f46' : '#991b1b',
                  }}
                >
                  {!matchReport.bhakootParihara.hasBhakootDosha ? (isHi ? 'दोष मुक्त' : 'Clean') : (isHi ? 'अभिषेक अनुशंसित' : 'Rudrabhisheka Advised')}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text)' }}>
                {!matchReport.bhakootParihara.hasBhakootDosha
                  ? (isHi ? 'भकूट दोष नहीं है अथवा मैत्री परिहार द्वारा निष्प्रभावी है (७/७ अंक)।' : 'Bhakoot is pure or neutralized through planetary friendship.')
                  : (isHi ? 'शिव मंदिर में रुद्राभिषेक कराएं तथा दंपत्ति नियमित रूप से शिव-गौरी का संयुक्त पूजन करें।' : 'Perform Lord Shiva Rudrabhisheka and worship Shiva-Gauri together.')}
              </p>
            </div>
          </div>

          {/* Section B: Transit Tribala Day-Of Pujas Reference */}
          <h3 style={{ margin: '24px 0 12px', fontSize: '1.15rem', color: 'var(--text)' }}>
            {isHi ? 'विवाह तिथि गोचर त्रिबल पूजा विधान एवं संदर्भ संहिता (Day-of-Wedding Reference Protocols):' : 'Day-of-Wedding Transit Tribala Protocols & Samagri:'}
          </h3>

          <div className="amm-puja-grid">
            {muhurtaReport.activePujasNeeded.map((puja, idx) => {
              const cardClass =
                puja.type === 'Lal'
                  ? 'puja-lal'
                  : puja.type === 'Peeli'
                  ? 'puja-peeli'
                  : 'puja-safed';

              return (
                <div key={idx} className={`amm-puja-card ${cardClass}`}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>
                      {isHi ? puja.titleHi : puja.titleEn}
                    </h3>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: '#ffffff',
                        border: '1px solid rgba(0,0,0,0.1)',
                      }}
                    >
                      {puja.type} Puja
                    </span>
                  </div>

                  <div style={{ fontSize: '0.86rem', color: 'var(--text)' }}>
                    <strong>{isHi ? 'शास्त्रीय कारण:' : 'Classical Reason:'}</strong>{' '}
                    {isHi ? puja.causeHi : puja.causeEn}
                  </div>

                  <div style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.06)' }}>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--text)' }}>
                      {isHi ? 'अनिवार्य पूजन व दान सामग्री:' : 'Required Samagri & Offerings:'}
                    </strong>
                    <ul style={{ margin: '6px 0 0', paddingLeft: '18px', fontSize: '0.84rem', color: 'var(--text)' }}>
                      {(isHi ? puja.samagriHi : puja.samagriEn).map((item, sIdx) => (
                        <li key={sIdx}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.06)' }}>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--text)' }}>
                      {isHi ? 'वैदिक संकल्प मंत्र:' : 'Vedic Sankalpa Mantra:'}
                    </strong>
                    <div
                      style={{
                        margin: '6px 0 0',
                        fontSize: '0.84rem',
                        fontFamily: 'serif',
                        lineHeight: 1.5,
                        color: '#991b1b',
                      }}
                    >
                      {puja.sankalpaMantra}
                    </div>
                  </div>

                  <div style={{ fontSize: '0.84rem', color: 'var(--text)' }}>
                    <strong>{isHi ? 'अनुष्ठान विधि:' : 'Ritual Vidhi:'}</strong>{' '}
                    {isHi ? puja.ritualVidhiHi : puja.ritualVidhiEn}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 5: AUTHENTIC MUHURTA CALENDAR (विवाह, सगाई, तिलक)
         ========================================================================= */}
      {activeTab === 'muhurta' && (
        <div className="amm-card">
          <div className="oj-card-header">
            <div>
              <h2 style={{ margin: 0 }}>
                {isHi ? 'सटीक एवं शुद्ध मुहूर्त कैलेंडर (विवाह, सगाई, तिलक)' : 'Authentic Ceremony Muhurta Calendar'}
              </h2>
              <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {isHi
                  ? 'खरमास, चातुर्मास, शुक्र/गुरु अस्त (तारा डूबा), होलाष्टक व रिक्ता तिथि का पूर्ण त्याग कर शुद्ध खगोलीय गणना।'
                  : 'Strict astronomical filtering of Kharmas, Chaturmas, planetary combustions, Holashtak, and Rikta tithis.'}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }} className="no-print">
              <button
                type="button"
                className={`btn btn-sm ${muhurtaCeremonyFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setMuhurtaCeremonyFilter('all')}
              >
                {isHi ? 'सभी मुहूर्त' : 'All Dates'}
              </button>
              <button
                type="button"
                className={`btn btn-sm ${muhurtaCeremonyFilter === 'Vivaha' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setMuhurtaCeremonyFilter('Vivaha')}
              >
                {isHi ? 'विवाह संस्कार' : 'Vivaha'}
              </button>
              <button
                type="button"
                className={`btn btn-sm ${muhurtaCeremonyFilter === 'Sagai' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setMuhurtaCeremonyFilter('Sagai')}
              >
                {isHi ? 'सगाई / वाग्दान' : 'Sagai'}
              </button>
              <button
                type="button"
                className={`btn btn-sm ${muhurtaCeremonyFilter === 'Tilak' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setMuhurtaCeremonyFilter('Tilak')}
              >
                {isHi ? 'तिलक / रोका' : 'Tilak / Roka'}
              </button>
            </div>
          </div>

          {/* Dasha & Gochar Alignment Summary */}
          <div style={{ margin: '14px 0 20px', padding: '14px', borderRadius: '10px', background: 'rgba(5, 150, 105, 0.06)', borderLeft: '4px solid #059669' }}>
            <h4 style={{ margin: '0 0 6px', color: '#065f46', fontSize: '0.95rem' }}>
              {isHi ? 'दशा एवं गोचर शुद्धि समन्वय (Double Transit of Jupiter & Saturn):' : 'Dasha & Double Transit Activation:'}
            </h4>
            <p style={{ margin: '0 0 4px', fontSize: '0.86rem', color: 'var(--text)' }}>
              {isHi ? muhurtaReport.dashaSupportSummaryHi : muhurtaReport.dashaSupportSummaryEn}
            </p>
            <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--text)' }}>
              {isHi ? muhurtaReport.gocharSupportSummaryHi : muhurtaReport.gocharSupportSummaryEn}
            </p>
          </div>

          {/* Muhurtas Grid */}
          <div className="amm-muhurta-grid">
            {displayedMuhurtas.map((m, idx) => (
              <div key={idx} className="amm-muhurta-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      background: m.ceremonyType === 'Vivaha' ? '#fee2e2' : m.ceremonyType === 'Sagai' ? '#fef3c7' : '#e0f2fe',
                      color: m.ceremonyType === 'Vivaha' ? '#991b1b' : m.ceremonyType === 'Sagai' ? '#92400e' : '#0369a1',
                    }}
                  >
                    {isHi ? m.ceremonyTypeHi : m.ceremonyType}
                  </span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#059669' }}>
                    {isHi ? `शुभता: ${m.score}/100` : `Score: ${m.score}/100`}
                  </span>
                </div>

                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#b45309', margin: '4px 0' }}>
                  {m.dateDmy}
                </div>

                <div style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
                  <strong>{isHi ? m.weekdayHi : m.weekdayEn}</strong> · {isHi ? m.tithiNameHi : m.tithiNameEn}
                </div>

                <div style={{ fontSize: '0.86rem', color: 'var(--text)' }}>
                  <strong>{isHi ? 'नक्षत्र:' : 'Nakshatra:'}</strong> {m.nakshatraName}
                </div>

                <div style={{ fontSize: '0.86rem', color: 'var(--text)' }}>
                  <strong>{isHi ? 'प्रशस्त लग्न:' : 'Suitable Lagna:'}</strong> {isHi ? m.suitableLagnaHi : m.suitableLagnaEn}
                </div>

                <div style={{ fontSize: '0.84rem', color: '#047857' }}>
                  <strong>{isHi ? 'अनुशंसित समय:' : 'Time Window:'}</strong> {m.recommendedTimeWindow}
                </div>

                <div style={{ marginTop: '4px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {m.requiredPujas.length === 0 ? (
                    <span className="amm-badge-shuddha">{isHi ? 'पूर्ण त्रिबल शुद्ध' : 'Full Tribala Pure'}</span>
                  ) : (
                    m.requiredPujas.map((p, pIdx) => (
                      <span key={pIdx} className={p.type === 'Lal' ? 'amm-badge-lal' : 'amm-badge-peeli'}>
                        {isHi ? p.titleHi : p.titleEn}
                      </span>
                    ))
                  )}
                </div>

                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '6px' }}>
                  {isHi ? m.planetaryNotesHi : m.planetaryNotesEn}
                </div>
              </div>
            ))}
          </div>

          {displayedMuhurtas.length === 0 && (
            <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
              {isHi ? 'चयनित श्रेणी हेतु कोई मुहूर्त उपलब्ध नहीं है।' : 'No dates found for the selected ceremony.'}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 6: SYNASTRY, D9 NAVAMSHA & BEEJA-KSHETRA PROGENY VITALITY
         ========================================================================= */}
      {activeTab === 'synastry-d9' && (
        <div className="amm-card">
          <div className="oj-card-header">
            <div>
              <h2 style={{ margin: 0 }}>
                {isHi ? 'द्वादश भाव सादृश्य, D9 नवांश एवं बीज-क्षेत्र स्फुट' : 'Synastry, D9 Navamsha & Progeny Vitality'}
              </h2>
              <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {isHi
                  ? 'संतान उत्पत्ति सामर्थ्य (बीज व क्षेत्र स्फुट), नवांश कुंडलियां एवं द्वादश भावों का पारस्परिक संबंध।'
                  : 'Progeny vitality via Beeja & Kshetra Sphuta, D9 Navamsha charts, and 12-house mutual synastry.'}
              </p>
            </div>
          </div>

          {/* 4 Cardinal Classical Checks (Dasha Sandhi, Stri Jataka, Upapada, Longevity) */}
          <div className="amm-classical-grid" style={{ margin: '18px 0 24px' }}>
            {/* 1. Dasha Sandhi */}
            <div className="amm-classical-card" style={{ borderLeft: `5px solid ${matchReport.dashaSandhi.status === 'Safe' ? '#059669' : '#d97706'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '0.98rem', color: matchReport.dashaSandhi.status === 'Safe' ? '#065f46' : '#b45309' }}>
                  {isHi ? 'दशा संधि परीक्षण (Dasha Sandhi)' : 'Dasha Sandhi Assessment'}
                </strong>
                <span className={`amm-synastry-badge ${matchReport.dashaSandhi.status === 'Safe' ? 'badge-strong' : 'badge-caution'}`}>
                  {matchReport.dashaSandhi.status === 'Safe' ? (isHi ? 'सुरक्षित (निर्दोष)' : 'Safe') : (isHi ? 'सावधानी अपेक्षित' : 'Caution')}
                </span>
              </div>
              <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                <div><strong>{isHi ? 'वर महादशा परिवर्तन:' : 'Groom Transition:'}</strong> {formatDateDmy(matchReport.dashaSandhi.groomDashaTransition)}</div>
                <div><strong>{isHi ? 'कन्या महादशा परिवर्तन:' : 'Bride Transition:'}</strong> {formatDateDmy(matchReport.dashaSandhi.brideDashaTransition)}</div>
                <div><strong>{isHi ? 'परिवर्तन में अंतर:' : 'Time Gap:'}</strong> {matchReport.dashaSandhi.monthsDifference} {isHi ? 'माह' : 'months'}</div>
              </div>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text)', lineHeight: 1.45 }}>
                {isHi ? matchReport.dashaSandhi.verdictHi : matchReport.dashaSandhi.verdictEn}
              </p>
            </div>

            {/* 2. Stri Jataka Special Yogas & Mangalya Bhava */}
            <div className="amm-classical-card" style={{ borderLeft: '5px solid #ec4899' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '0.98rem', color: '#be185d' }}>
                  {isHi ? 'स्त्री जातक एवं मांगल्य भाव' : 'Stri Jataka & Mangalya'}
                </strong>
                <span className="amm-synastry-badge badge-strong">
                  {isHi ? `मांगल्य: ${matchReport.striJataka.mangalyaBhavaScore}/100` : `Mangalya: ${matchReport.striJataka.mangalyaBhavaScore}/100`}
                </span>
              </div>
              <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                <div>
                  <strong>{isHi ? 'विषकन्या योग:' : 'Visha Kanya:'}</strong>{' '}
                  <span style={{ color: !matchReport.striJataka.hasVishaKanyaYoga || matchReport.striJataka.vishaKanyaCancelled ? '#059669' : '#dc2626', fontWeight: 600 }}>
                    {!matchReport.striJataka.hasVishaKanyaYoga ? (isHi ? 'दोष मुक्त' : 'Clean') : matchReport.striJataka.vishaKanyaCancelled ? (isHi ? 'परिहार मान्य' : 'Cancelled') : (isHi ? 'सक्रिय' : 'Active')}
                  </span>
                </div>
                <div>
                  <strong>{isHi ? 'वैधव्य योग:' : 'Vaidhavya:'}</strong>{' '}
                  <span style={{ color: !matchReport.striJataka.hasVaidhavyaYoga || matchReport.striJataka.vaidhavyaCancelled ? '#059669' : '#dc2626', fontWeight: 600 }}>
                    {!matchReport.striJataka.hasVaidhavyaYoga ? (isHi ? 'दोष मुक्त' : 'Clean') : matchReport.striJataka.vaidhavyaCancelled ? (isHi ? 'परिहार मान्य' : 'Cancelled') : (isHi ? 'सक्रिय' : 'Active')}
                  </span>
                </div>
              </div>
              <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text)', lineHeight: 1.4 }}>
                {isHi ? matchReport.striJataka.mangalyaStatusHi : matchReport.striJataka.mangalyaStatusEn}
              </p>
              {matchReport.striJataka.saubhagyaYogas.length > 0 && (
                <div style={{ fontSize: '0.8rem', color: '#047857', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '6px' }}>
                  <strong>{isHi ? 'सौभाग्य योग:' : 'Saubhagya Yogas:'}</strong> {matchReport.striJataka.saubhagyaYogas.join(' | ')}
                </div>
              )}
            </div>

            {/* 3. Jaimini Upapada Lagna (UL) Synastry */}
            <div className="amm-classical-card" style={{ borderLeft: '5px solid #8b5cf6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '0.98rem', color: '#6d28d9' }}>
                  {isHi ? 'जैमिनी उपपद लग्न (UL) सादृश्य' : 'Jaimini Upapada Lagna (UL)'}
                </strong>
                <span className={`amm-synastry-badge ${matchReport.upapadaSynastry.score >= 70 ? 'badge-strong' : 'badge-caution'}`}>
                  {matchReport.upapadaSynastry.score}/100
                </span>
              </div>
              <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                <div><strong>{isHi ? 'वर उपपद लग्न (UL):' : 'Groom UL:'}</strong> {matchReport.upapadaSynastry.groomULSignName}</div>
                <div><strong>{isHi ? 'कन्या उपपद लग्न (UL):' : 'Bride UL:'}</strong> {matchReport.upapadaSynastry.brideULSignName}</div>
                <div><strong>{isHi ? 'पारस्परिक अक्ष:' : 'Mutual Axis:'}</strong> {matchReport.upapadaSynastry.mutualAxis}</div>
              </div>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text)', lineHeight: 1.45 }}>
                {isHi ? matchReport.upapadaSynastry.verdictHi : matchReport.upapadaSynastry.verdictEn}
              </p>
            </div>

            {/* 4. Longevity & Ayushya Safety */}
            <div className="amm-classical-card" style={{ borderLeft: '5px solid #10b981' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '0.98rem', color: '#047857' }}>
                  {isHi ? 'आयुर्दाय एवं अल्पायु सुरक्षा' : 'Longevity & Ayushya Safety'}
                </strong>
                <span className={`amm-synastry-badge ${matchReport.ayushyaSafety.safetyPassed ? 'badge-strong' : 'badge-caution'}`}>
                  {matchReport.ayushyaSafety.safetyPassed ? (isHi ? 'सुरक्षित' : 'Safe') : (isHi ? 'सावधानी' : 'Caution')}
                </span>
              </div>
              <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                <div><strong>{isHi ? 'वर आयु वर्ग:' : 'Groom Longevity:'}</strong> {matchReport.ayushyaSafety.groomLongevityGrade}</div>
                <div><strong>{isHi ? 'कन्या आयु वर्ग:' : 'Bride Longevity:'}</strong> {matchReport.ayushyaSafety.brideLongevityGrade}</div>
              </div>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text)', lineHeight: 1.45 }}>
                {isHi ? matchReport.ayushyaSafety.verdictHi : matchReport.ayushyaSafety.verdictEn}
              </p>
            </div>
          </div>

          {/* Classical Nadi 2-7-11, Stri Jataka Trimsamsha & Double Transit Diagnostic */}
          <div style={{ margin: '14px 0 24px', padding: '16px', borderRadius: '12px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderLeft: '5px solid #ec4899' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#be185d', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Heart size={16} />
                <span>{isHi ? 'नाड़ी विवाह भाव समीकरण (२, ७, ११), स्त्री जातक त्रिंशांश एवं पराशर द्वि-गोचर' : 'Nadi Marriage Significations (2, 7, 11), Stri Jataka & Double Transit'}</span>
              </h3>
              <span className="amm-synastry-badge badge-strong" style={{ fontSize: '0.8rem' }}>
                {isHi ? 'वराहमिहिर · पराशर संहिता · चंद्रकला नाड़ी' : 'Varahamihira · Parashara · Nadi'}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px', marginBottom: '12px' }}>
              {/* Groom Diagnostic */}
              <div style={{ padding: '12px', borderRadius: '8px', background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <strong style={{ fontSize: '0.9rem', color: '#2563eb' }}>
                    {groomInput.name} ({isHi ? 'वर' : 'Groom'})
                  </strong>
                  <span className="tag tag-accent" style={{ fontSize: '10.5px' }}>
                    {isHi ? groomMarriage.marriageNatureHi : groomMarriage.marriageNature}
                  </span>
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text)', lineHeight: 1.5, marginBottom: '6px' }}>
                  <div><strong>{isHi ? 'नाड़ी विवाह बल (२, ७, ११): ' : 'Nadi Marriage: '}</strong>{groomMarriage.nadiSignifications.marriageScore} | <strong>{isHi ? 'प्रेम बल (५, ८, १२): ' : 'Love: '}</strong>{groomMarriage.nadiSignifications.loveScore}</div>
                  <div><strong>{isHi ? 'उपपद लग्न (UL): ' : 'Upapada Lagna: '}</strong>{groomMarriage.timingAndDoubleTransit.upapadaLagnaSign} ({isHi ? 'स्वामी:' : 'Lord:'} {groomMarriage.timingAndDoubleTransit.upapadaLord})</div>
                  <div><strong>{isHi ? 'स्वर्णिम विवाह काल: ' : 'Prime Marriage Window: '}</strong>{isHi ? groomMarriage.timingAndDoubleTransit.primeMarriageAgeWindowHi : groomMarriage.timingAndDoubleTransit.primeMarriageAgeWindowEn}</div>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: '4px' }}>
                  <strong>{isHi ? 'वर उपाय: ' : 'Remedy: '}</strong>{isHi ? groomMarriage.authenticVedicRemediesHi[0] : groomMarriage.authenticVedicRemediesEn[0]}
                </div>
              </div>

              {/* Bride Diagnostic */}
              <div style={{ padding: '12px', borderRadius: '8px', background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <strong style={{ fontSize: '0.9rem', color: '#ec4899' }}>
                    {brideInput.name} ({isHi ? 'कन्या' : 'Bride'})
                  </strong>
                  <span className="tag tag-accent" style={{ fontSize: '10.5px' }}>
                    {isHi ? brideMarriage.marriageNatureHi : brideMarriage.marriageNature}
                  </span>
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text)', lineHeight: 1.5, marginBottom: '6px' }}>
                  <div><strong>{isHi ? 'त्रिंशांश स्वभाव (वराहमिहिर): ' : 'Trimsamsha: '}</strong>{isHi ? brideMarriage.streeJataka.trimsamshaNatureHi : brideMarriage.streeJataka.trimsamshaNatureEn}</div>
                  <div><strong>{isHi ? 'मांगल्य स्थिति (८म भाव): ' : 'Mangalya Sthana: '}</strong>{isHi ? brideMarriage.streeJataka.mangalyaHouse8StatusHi : brideMarriage.streeJataka.mangalyaHouse8Status}</div>
                  <div><strong>{isHi ? 'स्वर्णिम विवाह काल: ' : 'Prime Marriage Window: '}</strong>{isHi ? brideMarriage.timingAndDoubleTransit.primeMarriageAgeWindowHi : brideMarriage.timingAndDoubleTransit.primeMarriageAgeWindowEn}</div>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: '4px' }}>
                  <strong>{isHi ? 'कन्या उपाय (कात्यायनी): ' : 'Katyayani Upaya: '}</strong>{isHi ? brideMarriage.authenticVedicRemediesHi[0] : brideMarriage.authenticVedicRemediesEn[0]}
                </div>
              </div>
            </div>

            <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text)', lineHeight: 1.45 }}>
              {isHi
                ? 'पराशर संहिता द्वि-गोचर सिद्धांत: जब गोचर में देवगुरु बृहस्पति एवं कर्मफलदाता शनि देव दोनों जन्म लग्न, सप्तम भाव अथवा उपपद लग्न को एक साथ सक्रिय करते हैं, तभी पाणिग्रहण संस्कार का निर्विघ्न योग बनता है।'
                : 'Brihat Parashara Double Transit Principle: When transit Jupiter and Saturn simultaneously activate natal Lagna, 7th house, or Upapada Lagna, the matrimonial alliance is peacefully solemnized.'}
            </p>
          </div>

          {/* House-to-House 12-Bhava Synastry Matrix Table */}
          <h3 style={{ margin: '22px 0 10px', fontSize: '1.15rem', color: 'var(--text)' }}>
            {isHi ? 'द्वादश भाव सादृश्य विस्तृत सारणी (House-to-House 12-Bhava Compatibility Matrix):' : '12-Bhava House-to-House Compatibility Matrix:'}
          </h3>
          <p style={{ margin: '0 0 12px', fontSize: '0.86rem', color: 'var(--text-muted)' }}>
            {isHi
              ? 'वर एवं कन्या दोनों की कुंडलियों के प्रथम (तनु) से द्वादश (व्यय) भावों की राशि, भावेश संबंध, ग्रह स्थिति एवं पारस्परिक सामंजस्य का समग्र विश्लेषण।'
              : 'Detailed synastry across all 12 bhavas analyzing sign, lord relationships, planetary occupants, and mutual harmony.'}
          </p>

          <div className="amm-synastry-table-wrapper">
            <table className="amm-synastry-table">
              <thead>
                <tr>
                  <th style={{ width: '14%' }}>{isHi ? 'भाव एवं विषय' : 'House & Theme'}</th>
                  <th style={{ width: '18%' }}>{isHi ? 'वर स्थिति (राशि/भावेश)' : 'Groom Position'}</th>
                  <th style={{ width: '18%' }}>{isHi ? 'कन्या स्थिति (राशि/भावेश)' : 'Bride Position'}</th>
                  <th style={{ width: '12%', textAlign: 'center' }}>{isHi ? 'स्कोर व स्तर' : 'Score / Status'}</th>
                  <th style={{ width: '38%' }}>{isHi ? 'शास्त्रीय सादृश्य फलादेश' : 'Synastry Reading'}</th>
                </tr>
              </thead>
              <tbody>
                {matchReport.synastryHouses.map((row) => {
                  const badgeClass =
                    row.status === 'Strong'
                      ? 'badge-strong'
                      : row.status === 'Balanced'
                      ? 'badge-balanced'
                      : 'badge-caution';

                  return (
                    <tr key={row.house}>
                      <td>
                        <strong>{isHi ? `${row.house}वां भाव` : `House ${row.house}`}</strong>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {isHi ? row.themeHi : row.themeEn}
                        </div>
                      </td>
                      <td>
                        <div>
                          <strong>{trSign(row.signAIndex, lang)}</strong> ({trPlanetShort(row.lordA, lang)})
                        </div>
                        {row.occupantsA.length > 0 && (
                          <div style={{ fontSize: '0.78rem', color: '#0369a1', marginTop: '2px' }}>
                            {isHi ? 'ग्रह:' : 'Planets:'} {row.occupantsA.map((p) => trPlanetShort(p, lang)).join(', ')}
                          </div>
                        )}
                      </td>
                      <td>
                        <div>
                          <strong>{trSign(row.signBIndex, lang)}</strong> ({trPlanetShort(row.lordB, lang)})
                        </div>
                        {row.occupantsB.length > 0 && (
                          <div style={{ fontSize: '0.78rem', color: '#be185d', marginTop: '2px' }}>
                            {isHi ? 'ग्रह:' : 'Planets:'} {row.occupantsB.map((p) => trPlanetShort(p, lang)).join(', ')}
                          </div>
                        )}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span className={`amm-synastry-badge ${badgeClass}`}>
                          {row.score}/100 · {row.status}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.84rem', lineHeight: 1.45 }}>
                        {isHi ? row.readingHi : row.readingEn}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Beeja-Kshetra Sphuta Progeny Analysis */}
          <div style={{ margin: '14px 0 20px', padding: '16px', borderRadius: '12px', background: 'rgba(217, 119, 6, 0.06)', border: '1px solid rgba(217, 119, 6, 0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h3 style={{ margin: 0, color: '#b45309', fontSize: '1.1rem' }}>
                {isHi ? 'बीज एवं क्षेत्र स्फुट (संतान उत्पत्ति सामर्थ्य)' : 'Beeja & Kshetra Sphuta (Progeny Vitality)'}
              </h3>
              <span
                style={{
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  background: matchReport.beejaKshetra.score >= 70 ? '#059669' : '#d97706',
                  color: '#ffffff',
                }}
              >
                {matchReport.beejaKshetra.score}/100 · {matchReport.beejaKshetra.status}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', marginBottom: '10px' }}>
              <div style={{ padding: '12px', borderRadius: '8px', background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#b45309', textTransform: 'uppercase' }}>
                  {isHi ? 'वर बीज स्फुट (Sun + Venus + Jupiter)' : 'Groom Beeja Sphuta'}
                </span>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, margin: '4px 0', color: 'var(--text)' }}>
                  {trSign(matchReport.beejaKshetra.partnerABeeja.signIndex, lang)} ({matchReport.beejaKshetra.partnerABeeja.dms})
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  {isHi ? 'नवांश राशि:' : 'Navamsha:'}{' '}
                  <strong>{trSign(matchReport.beejaKshetra.partnerABeeja.d9SignIndex, lang)}</strong> ·{' '}
                  {isHi ? matchReport.beejaKshetra.partnerABeeja.labelHi : matchReport.beejaKshetra.partnerABeeja.labelEn}
                </div>
              </div>

              <div style={{ padding: '12px', borderRadius: '8px', background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase' }}>
                  {isHi ? 'कन्या क्षेत्र स्फुट (Moon + Mars + Jupiter)' : 'Bride Kshetra Sphuta'}
                </span>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, margin: '4px 0', color: 'var(--text)' }}>
                  {trSign(matchReport.beejaKshetra.partnerBKshetra.signIndex, lang)} ({matchReport.beejaKshetra.partnerBKshetra.dms})
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  {isHi ? 'नवांश राशि:' : 'Navamsha:'}{' '}
                  <strong>{trSign(matchReport.beejaKshetra.partnerBKshetra.d9SignIndex, lang)}</strong> ·{' '}
                  {isHi ? matchReport.beejaKshetra.partnerBKshetra.labelHi : matchReport.beejaKshetra.partnerBKshetra.labelEn}
                </div>
              </div>
            </div>

            <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text)' }}>
              {isHi ? matchReport.beejaKshetra.summaryHi : matchReport.beejaKshetra.summaryEn}
            </p>
          </div>

          {/* D1 & D9 Charts Comparison */}
          <div className="oj-charts-row" style={{ margin: '20px 0' }}>
            <div className="oj-chart-box">
              <h4 className="oj-chart-title">
                {groomInput.name} — {isHi ? 'वर लग्न कुंडली (D1)' : 'Groom Lagna (D1)'}
              </h4>
              <div className="oj-svg-wrapper">
                <VedicChartSvg
                  title={groomInput.name}
                  style={settings.chartStyle}
                  lagnaSignIndex={groomChart.ascendant.signIndex}
                  items={groomD1Badges}
                  centerLabel={isHi ? 'वर D1' : 'Groom D1'}
                />
              </div>
            </div>

            <div className="oj-chart-box">
              <h4 className="oj-chart-title">
                {brideInput.name} — {isHi ? 'कन्या लग्न कुंडली (D1)' : 'Bride Lagna (D1)'}
              </h4>
              <div className="oj-svg-wrapper">
                <VedicChartSvg
                  title={brideInput.name}
                  style={settings.chartStyle}
                  lagnaSignIndex={brideChart.ascendant.signIndex}
                  items={brideD1Badges}
                  centerLabel={isHi ? 'कन्या D1' : 'Bride D1'}
                />
              </div>
            </div>
          </div>

          <div className="oj-charts-row" style={{ margin: '20px 0' }}>
            <div className="oj-chart-box">
              <h4 className="oj-chart-title">
                {groomInput.name} — {isHi ? 'वर नवांश कुंडली (D9)' : 'Groom Navamsha (D9)'}
              </h4>
              <div className="oj-svg-wrapper">
                <VedicChartSvg
                  title={`${groomInput.name} D9`}
                  style={settings.chartStyle}
                  lagnaSignIndex={groomChart.divisionalCharts.D9.lagnaSignIndex}
                  items={groomD9Badges}
                  centerLabel={isHi ? 'वर D9' : 'Groom D9'}
                />
              </div>
            </div>

            <div className="oj-chart-box">
              <h4 className="oj-chart-title">
                {brideInput.name} — {isHi ? 'कन्या नवांश कुंडली (D9)' : 'Bride Navamsha (D9)'}
              </h4>
              <div className="oj-svg-wrapper">
                <VedicChartSvg
                  title={`${brideInput.name} D9`}
                  style={settings.chartStyle}
                  lagnaSignIndex={brideChart.divisionalCharts.D9.lagnaSignIndex}
                  items={brideD9Badges}
                  centerLabel={isHi ? 'कन्या D9' : 'Bride D9'}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
