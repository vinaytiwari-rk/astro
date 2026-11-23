import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Compass,
  Flame,
  Heart,
  Info,
  Printer,
  Shield,
  Sparkles,
  Star,
  User,
  Users,
  Zap,
} from 'lucide-react';
import {
  computeAuthenticCalculatorsSuite,
  computeBirthDateMatch,
  computeCoupleAuspiciousDates,
  computeFriendshipAndLoyaltyQuotient,
  computeKarmicSoulBond,
  computeLifePartnerInitials,
  computeLongevityProtectionAndUpayas,
  computeLoveVsArrangedMarriage,
  computeMarakaAndVulnerabilityCycles,
  computeMaritalHarmonyAndRisk,
  computeMarriageTimingAndTransit,
  computeNameVibrationMatch,
  computeParasharaJaiminiAyurdaya,
  computeRelationshipPujaRecommendations,
  computeStreeJatakaAnalysis,
  computeZodiacElementMatch,
  type AuthenticCalculatorsSuiteReport,
} from '../../astro/relationshipCalculatorsEngine';
import {
  computeFutureLifeReading,
  computePastLifeReading,
  type FutureLifeReport,
  type PastLifeReport,
} from '../../astro/fortuneCalculators';
import type { ChartData } from '../../astro/types';
import { useLanguage } from '../../i18n/LanguageContext';

export type MainCalculatorCategory =
  | 'overview'
  | 'vedic_relationship'
  | 'numerology'
  | 'ayurdaya_protection'
  | 'past_future_life';

export type SpecificCalculatorId =
  | 'overview'
  // Category 1
  | 'love_vs_arranged'
  | 'marriage_timing'
  | 'partner_initials'
  | 'marital_harmony'
  | 'karmic_soul_bond'
  | 'stree_jataka'
  | 'zodiac_element'
  | 'relationship_puja'
  // Category 2
  | 'birth_date_match'
  | 'name_vibration'
  | 'auspicious_dates'
  | 'friendship_loyalty'
  // Category 3
  | 'ayurdaya_class'
  | 'maraka_vulnerability'
  | 'longevity_protection'
  // Category 4
  | 'past_life'
  | 'future_life';

interface FortuneCalculatorsViewProps {
  chart: ChartData;
  onNavigate?: (view: string) => void;
  initialTab?: SpecificCalculatorId;
}

export const FortuneCalculatorsView: React.FC<FortuneCalculatorsViewProps> = ({
  chart,
  onNavigate,
  initialTab = 'overview',
}) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';

  const [activeTab, setActiveTab] = useState<SpecificCalculatorId>(initialTab);
  const [activeCategory, setActiveCategory] = useState<MainCalculatorCategory>('overview');

  // Input states for Person 1 (Native) and Person 2 (Partner/Friend)
  const nativeName = chart.input.name || (isHi ? 'जातक' : 'Native');
  const nativeDob = chart.input.date || '1995-06-15';

  const [p1Name, setP1Name] = useState<string>(nativeName);
  const [p1Dob, setP1Dob] = useState<string>(nativeDob);
  const [p2Name, setP2Name] = useState<string>(isHi ? 'प्रिया' : 'Priya');
  const [p2Dob, setP2Dob] = useState<string>('1997-09-22');

  // Compute master suite
  const suite: AuthenticCalculatorsSuiteReport = useMemo(() => {
    return computeAuthenticCalculatorsSuite(
      chart,
      undefined,
      { name: p1Name, dob: p1Dob },
      { name: p2Name, dob: p2Dob }
    );
  }, [chart, p1Name, p1Dob, p2Name, p2Dob]);

  // Compute Past Life & Future Life
  const pastLifeReport: PastLifeReport = useMemo(() => {
    return computePastLifeReading(chart);
  }, [chart]);

  const futureLifeReport: FutureLifeReport = useMemo(() => {
    return computeFutureLifeReading(chart);
  }, [chart]);

  const setCategoryAndTab = (cat: MainCalculatorCategory, tab: SpecificCalculatorId) => {
    setActiveCategory(cat);
    setActiveTab(tab);
  };

  return (
    <div className="oj-page-container">
      {/* Breadcrumb Navigation */}
      <nav className="oj-breadcrumbs no-print" aria-label="Breadcrumb">
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            if (onNavigate) onNavigate('home');
          }}
        >
          {isHi ? 'होम' : 'Home'}
        </a>
        <span className="oj-bc-sep">/</span>
        <span className="oj-bc-current">
          {isHi
            ? 'प्रामाणिक दांपत्य, अंकज्योतिष एवं आयुर्दाय कैलकुलेटर हब'
            : 'Authentic Relationship, Numerology & Longevity Suite'}
        </span>
      </nav>

      {/* Hero Header Card */}
      <div className="oj-page-header-card">
        <div className="oj-header-badge">
          {isHi
            ? 'महर्षि पराशर, वराहमिहिर, जैमिनी एवं चालडियन अंक प्रणाली पर आधारित'
            : 'Classical Parashari, Varahamihira, Jaimini & Chaldean Shastras'}
        </div>
        <h1 className="oj-page-title">
          {isHi
            ? 'प्रामाणिक दांपत्य, अंकज्योतिष एवं आयुर्दाय कैलकुलेटर हब'
            : 'Authentic Relationship, Numerology & Longevity Calculators'}
        </h1>
        <p className="oj-page-subtitle">
          {isHi
            ? '१००% वैज्ञानिक व शास्त्रीय ज्योतिष: प्रेम बनाम पारंपरिक विवाह, सटीक विवाह समय (द्वि-गोचर), जीवनसाथी का नामाक्षर, दांपत्य सामंजस्य, अंक अनुकूलता, तथा शास्त्रीय आयुर्दाय व महामृत्युंजय रक्षा विधान। शून्य फोन नंबर, शून्य भय-व्यापार।'
            : '100% Classical Vedic Astrology: Love vs Arranged Marriage, Marriage Timing & Double Transit, Partner Name Initials, Numerology Vibrations, and Authentic Ayurdaya Longevity Protection.'}
        </p>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
          <button
            onClick={() => window.print()}
            className="oj-action-btn no-print"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Printer size={15} />
            <span>{isHi ? 'गणना रिपोर्ट प्रिंट करें' : 'Print Calculation Dossier'}</span>
          </button>
        </div>
      </div>

      {/* Global Interactive Profiles Form Card */}
      <div
        className="oj-card"
        style={{
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          border: '1px solid #cbd5e1',
          marginBottom: '20px',
          padding: '16px 20px',
          borderRadius: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <User size={16} color="#0284c7" />
          <span style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>
            {isHi ? 'युगल / सहभागी विवरण (Interactive Profiles)' : 'Couple / Partner Profiles'}
          </span>
          <span style={{ fontSize: '11px', color: '#64748b', marginLeft: 'auto' }}>
            {isHi ? 'बदलाव करने पर सभी गणनाएं तुरंत अपडेट होंगी' : 'Real-time offline calculation'}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {/* Person 1 */}
          <div style={{ background: '#eff6ff', padding: '12px 16px', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
            <div style={{ fontWeight: 700, fontSize: '13px', color: '#1e40af', marginBottom: '8px' }}>
              {isHi ? 'प्रथम व्यक्ति (जातक / मुख्य कुंडली)' : 'Person 1 (Native)'}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#475569', marginBottom: '3px' }}>
                  {isHi ? 'नाम:' : 'Name:'}
                </label>
                <input
                  type="text"
                  value={p1Name}
                  onChange={(e) => setP1Name(e.target.value)}
                  style={{ width: '100%', padding: '6px 10px', borderRadius: '5px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#475569', marginBottom: '3px' }}>
                  {isHi ? 'जन्म तिथि:' : 'Date of Birth:'}
                </label>
                <input
                  type="date"
                  value={p1Dob}
                  onChange={(e) => setP1Dob(e.target.value)}
                  style={{ width: '100%', padding: '6px 10px', borderRadius: '5px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>
            </div>
          </div>

          {/* Person 2 */}
          <div style={{ background: '#fdf2f8', padding: '12px 16px', borderRadius: '8px', border: '1px solid #fbcfe8' }}>
            <div style={{ fontWeight: 700, fontSize: '13px', color: '#9d174d', marginBottom: '8px' }}>
              {isHi ? 'द्वितीय व्यक्ति (जीवनसाथी / मित्र / प्रेमी)' : 'Person 2 (Partner / Friend)'}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#475569', marginBottom: '3px' }}>
                  {isHi ? 'नाम:' : 'Name:'}
                </label>
                <input
                  type="text"
                  value={p2Name}
                  onChange={(e) => setP2Name(e.target.value)}
                  style={{ width: '100%', padding: '6px 10px', borderRadius: '5px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#475569', marginBottom: '3px' }}>
                  {isHi ? 'जन्म तिथि:' : 'Date of Birth:'}
                </label>
                <input
                  type="date"
                  value={p2Dob}
                  onChange={(e) => setP2Dob(e.target.value)}
                  style={{ width: '100%', padding: '6px 10px', borderRadius: '5px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Category Selector Tabs */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
        <button
          onClick={() => setCategoryAndTab('overview', 'overview')}
          className={`oj-tab-pill ${activeTab === 'overview' ? 'is-active' : ''}`}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Sparkles size={14} />
          <span>{isHi ? 'समग्र सार संक्षेप (Dashboard)' : 'All Calculators Overview'}</span>
        </button>

        <button
          onClick={() => setCategoryAndTab('vedic_relationship', 'love_vs_arranged')}
          className={`oj-tab-pill ${activeCategory === 'vedic_relationship' ? 'is-active' : ''}`}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Heart size={14} />
          <span>{isHi ? '१. वैदिक दांपत्य कैलकुलेटर (८)' : '1. Vedic Marriage Tools (8)'}</span>
        </button>

        <button
          onClick={() => setCategoryAndTab('numerology', 'birth_date_match')}
          className={`oj-tab-pill ${activeCategory === 'numerology' ? 'is-active' : ''}`}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Users size={14} />
          <span>{isHi ? '२. प्रामाणिक अंकज्योतिष (४)' : '2. Numerology Match (4)'}</span>
        </button>

        <button
          onClick={() => setCategoryAndTab('ayurdaya_protection', 'ayurdaya_class')}
          className={`oj-tab-pill ${activeCategory === 'ayurdaya_protection' ? 'is-active' : ''}`}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Shield size={14} />
          <span>{isHi ? '३. प्रामाणिक आयुर्दाय व रक्षा (३)' : '3. Ayurdaya & Longevity (3)'}</span>
        </button>

        <button
          onClick={() => setCategoryAndTab('past_future_life', 'past_life')}
          className={`oj-tab-pill ${activeCategory === 'past_future_life' ? 'is-active' : ''}`}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <BookOpen size={14} />
          <span>{isHi ? '४. पूर्व व आगामी जन्म रहस्य (२)' : '4. Past & Future Life (2)'}</span>
        </button>
      </div>

      {/* Sub-Tab Navigation for Categories */}
      {activeCategory === 'vedic_relationship' && (
        <div
          style={{
            display: 'flex',
            gap: '6px',
            flexWrap: 'wrap',
            padding: '8px 12px',
            background: '#fff1f2',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #fecdd3',
          }}
        >
          {[
            { id: 'love_vs_arranged', labelHi: 'प्रेम vs पारंपरिक', labelEn: 'Love vs Arranged' },
            { id: 'marriage_timing', labelHi: 'सटीक विवाह समय (द्वि-गोचर)', labelEn: 'Marriage Timing' },
            { id: 'partner_initials', labelHi: 'जीवनसाथी का नामाक्षर', labelEn: 'Partner Initials' },
            { id: 'marital_harmony', labelHi: 'दांपत्य सामंजस्य व अलगाव', labelEn: 'Marital Harmony' },
            { id: 'karmic_soul_bond', labelHi: 'ऋणानुबंध (Soul Bond)', labelEn: 'Karmic Soul Bond' },
            { id: 'stree_jataka', labelHi: 'स्त्री जातक व सौभाग्य', labelEn: 'Stree Jataka' },
            { id: 'zodiac_element', labelHi: 'तत्व एवं राशि मिलान', labelEn: 'Element Match' },
            { id: 'relationship_puja', labelHi: 'संबंध शांति पूजा विधान', labelEn: 'Puja Upayas' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as SpecificCalculatorId)}
              style={{
                padding: '5px 12px',
                borderRadius: '6px',
                border: 'none',
                background: activeTab === item.id ? '#e11d48' : '#ffffff',
                color: activeTab === item.id ? '#ffffff' : '#881337',
                fontSize: '12px',
                fontWeight: activeTab === item.id ? 700 : 500,
                cursor: 'pointer',
              }}
            >
              {isHi ? item.labelHi : item.labelEn}
            </button>
          ))}
        </div>
      )}

      {activeCategory === 'numerology' && (
        <div
          style={{
            display: 'flex',
            gap: '6px',
            flexWrap: 'wrap',
            padding: '8px 12px',
            background: '#f0fdf4',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #bbf7d0',
          }}
        >
          {[
            { id: 'birth_date_match', labelHi: 'जन्म तिथि (मूलांक-भाग्यांक)', labelEn: 'Mulank & Bhagyank' },
            { id: 'name_vibration', labelHi: 'नामांक कंपन (Chaldean)', labelEn: 'Name Vibration' },
            { id: 'auspicious_dates', labelHi: 'युगल शुभ तिथियां व दिन', labelEn: 'Auspicious Dates' },
            { id: 'friendship_loyalty', labelHi: 'सच्ची मित्रता व निष्ठा', labelEn: 'Friendship & Loyalty' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as SpecificCalculatorId)}
              style={{
                padding: '5px 12px',
                borderRadius: '6px',
                border: 'none',
                background: activeTab === item.id ? '#15803d' : '#ffffff',
                color: activeTab === item.id ? '#ffffff' : '#14532d',
                fontSize: '12px',
                fontWeight: activeTab === item.id ? 700 : 500,
                cursor: 'pointer',
              }}
            >
              {isHi ? item.labelHi : item.labelEn}
            </button>
          ))}
        </div>
      )}

      {activeCategory === 'ayurdaya_protection' && (
        <div
          style={{
            display: 'flex',
            gap: '6px',
            flexWrap: 'wrap',
            padding: '8px 12px',
            background: '#fefce8',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #fef08a',
          }}
        >
          {[
            { id: 'ayurdaya_class', labelHi: 'शास्त्रीय आयुर्दाय वर्ग निर्णय', labelEn: 'Longevity Span Class' },
            { id: 'maraka_vulnerability', labelHi: 'मारक व २२वां द्रेष्काण परीक्षण', labelEn: 'Maraka Vulnerability' },
            { id: 'longevity_protection', labelHi: 'आयुष्य रक्षा व महामृत्युंजय विधान', labelEn: 'Maha Mrityunjaya Upayas' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as SpecificCalculatorId)}
              style={{
                padding: '5px 12px',
                borderRadius: '6px',
                border: 'none',
                background: activeTab === item.id ? '#a16207' : '#ffffff',
                color: activeTab === item.id ? '#ffffff' : '#713f12',
                fontSize: '12px',
                fontWeight: activeTab === item.id ? 700 : 500,
                cursor: 'pointer',
              }}
            >
              {isHi ? item.labelHi : item.labelEn}
            </button>
          ))}
        </div>
      )}

      {activeCategory === 'past_future_life' && (
        <div
          style={{
            display: 'flex',
            gap: '6px',
            flexWrap: 'wrap',
            padding: '8px 12px',
            background: '#faf5ff',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #e9d5ff',
          }}
        >
          {[
            { id: 'past_life', labelHi: 'पूर्व जन्म संस्कार व प्रारब्ध', labelEn: 'Past Life Karma' },
            { id: 'future_life', labelHi: 'आगामी जन्म व सद्गति प्रक्षेप', labelEn: 'Future Rebirth Trajectory' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as SpecificCalculatorId)}
              style={{
                padding: '5px 12px',
                borderRadius: '6px',
                border: 'none',
                background: activeTab === item.id ? '#7e22ce' : '#ffffff',
                color: activeTab === item.id ? '#ffffff' : '#581c87',
                fontSize: '12px',
                fontWeight: activeTab === item.id ? 700 : 500,
                cursor: 'pointer',
              }}
            >
              {isHi ? item.labelHi : item.labelEn}
            </button>
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 0. EXECUTIVE DASHBOARD OVERVIEW */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div>
          <div
            className="oj-card"
            style={{
              background: 'linear-gradient(135deg, #fdf4ff 0%, #f5f3ff 100%)',
              border: '2px solid #a855f7',
              marginBottom: '20px',
              padding: '20px',
              borderRadius: '12px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
              <div>
                <span
                  style={{
                    background: '#9333ea',
                    color: '#ffffff',
                    padding: '3px 10px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: 700,
                  }}
                >
                  {isHi ? 'समग्र युगल एवं जीवन संक्षेप' : 'Executive Relationship & Life Dashboard'}
                </span>
                <h2 style={{ margin: '8px 0 4px 0', fontSize: '22px', color: '#581c87', fontWeight: 800 }}>
                  {p1Name} &amp; {p2Name}
                </h2>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '6px 0 8px 0' }}>
                  <span style={{ background: '#e0e7ff', color: '#3730a3', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700 }}>
                    {p1Name}: {suite.zodiacElementMatch.moonSign1Hi} ({suite.zodiacElementMatch.element1Hi})
                  </span>
                  <span style={{ background: '#fce7f3', color: '#9d174d', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700 }}>
                    {p2Name}: {suite.zodiacElementMatch.moonSign2Hi} ({suite.zodiacElementMatch.element2Hi})
                  </span>
                  {suite.lifePartnerInitials.partnerNameMatch && (
                    <span
                      style={{
                        background: suite.lifePartnerInitials.partnerNameMatch.isMatched ? '#dcfce7' : '#fef3c7',
                        color: suite.lifePartnerInitials.partnerNameMatch.isMatched ? '#166534' : '#92400e',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 700,
                      }}
                    >
                      {isHi ? 'नामाक्षर सत्यापन:' : 'Name Match:'} {suite.lifePartnerInitials.partnerNameMatch.matchScore}%
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '13px', color: '#6b21a8' }}>
                  {isHi
                    ? `विवाह स्वरूप: ${suite.loveVsArranged.verdictType} | विवाह काल: ${suite.marriageTiming.primeAgeWindowHi} | आयुर्दाय: ${suite.ayurdayaClass.longevityClassHi}`
                    : `Marriage Mode: ${suite.loveVsArranged.verdictType} | Window: ${suite.marriageTiming.primeAgeWindowEn} | Span: ${suite.ayurdayaClass.longevityClassEn}`}
                </div>
              </div>

              <div
                style={{
                  background: '#ffffff',
                  border: '2px solid #c084fc',
                  padding: '10px 22px',
                  borderRadius: '12px',
                  textAlign: 'center',
                  boxShadow: '0 2px 8px rgba(168,85,247,0.15)',
                }}
              >
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#6b21a8', textTransform: 'uppercase' }}>
                  {isHi ? 'दांपत्य स्थिरता स्कोर' : 'Harmony Score'}
                </div>
                <div style={{ fontSize: '32px', fontWeight: 900, color: '#7e22ce' }}>
                  {suite.maritalHarmonyAndRisk.harmonyScore}%
                </div>
                <div style={{ fontSize: '11px', color: '#15803d', fontWeight: 600 }}>
                  {isHi ? suite.maritalHarmonyAndRisk.statusGradeHi : suite.maritalHarmonyAndRisk.statusGradeEn}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Snapshot Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            {/* Card 1: Love vs Arranged */}
            <div
              className="oj-card"
              style={{ borderLeft: '4px solid #e11d48', cursor: 'pointer' }}
              onClick={() => setCategoryAndTab('vedic_relationship', 'love_vs_arranged')}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#e11d48' }}>
                  {isHi ? 'विवाह स्वरूप निर्णय' : 'Marriage Mode'}
                </span>
                <Heart size={14} color="#e11d48" />
              </div>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', color: '#0f172a' }}>
                {suite.loveVsArranged.verdictType}
              </h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#475569' }}>
                {isHi
                  ? `प्रेम विवाह: ${suite.loveVsArranged.loveScore}% | पारंपरिक: ${suite.loveVsArranged.arrangedScore}%`
                  : `Love: ${suite.loveVsArranged.loveScore}% | Arranged: ${suite.loveVsArranged.arrangedScore}%`}
              </p>
            </div>

            {/* Card 2: Marriage Timing */}
            <div
              className="oj-card"
              style={{ borderLeft: '4px solid #f59e0b', cursor: 'pointer' }}
              onClick={() => setCategoryAndTab('vedic_relationship', 'marriage_timing')}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#b45309' }}>
                  {isHi ? 'सटीक विवाह समय' : 'Timing Window'}
                </span>
                <Clock size={14} color="#b45309" />
              </div>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', color: '#0f172a' }}>
                {isHi ? suite.marriageTiming.primeAgeWindowHi : suite.marriageTiming.primeAgeWindowEn}
              </h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#475569' }}>
                {isHi ? suite.marriageTiming.transitStatusHi : suite.marriageTiming.transitStatusEn}
              </p>
            </div>

            {/* Card 3: Partner Name Initial */}
            <div
              className="oj-card"
              style={{ borderLeft: '4px solid #0284c7', cursor: 'pointer' }}
              onClick={() => setCategoryAndTab('vedic_relationship', 'partner_initials')}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#0284c7' }}>
                  {isHi ? 'जीवनसाथी नामाक्षर' : 'Partner Initials'}
                </span>
                <Star size={14} color="#0284c7" />
              </div>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', color: '#0f172a' }}>
                {suite.lifePartnerInitials.primaryInitials.slice(0, 3).map((p) => p.devanagari).join(', ')} ({suite.lifePartnerInitials.primaryInitials.slice(0, 3).map((p) => p.roman).join(', ')})
              </h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#475569' }}>
                {suite.lifePartnerInitials.partnerNameMatch
                  ? `${p2Name}: ${suite.lifePartnerInitials.partnerNameMatch.matchScore}% (${suite.lifePartnerInitials.partnerNameMatch.matchGradeHi.split('(')[0].trim()})`
                  : isHi
                  ? `सप्तमेश: ${suite.lifePartnerInitials.seventhLordHi} (${suite.lifePartnerInitials.seventhSignHi})`
                  : `7th Lord: ${suite.lifePartnerInitials.seventhLordHi}`}
              </p>
            </div>

            {/* Card 4: Soul Bond (Twin Flame) */}
            <div
              className="oj-card"
              style={{ borderLeft: '4px solid #8b5cf6', cursor: 'pointer' }}
              onClick={() => setCategoryAndTab('vedic_relationship', 'karmic_soul_bond')}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#7c3aed' }}>
                  {isHi ? 'ऋणानुबंध (Vedic Soul Bond)' : 'Karmic Soul Bond'}
                </span>
                <Sparkles size={14} color="#7c3aed" />
              </div>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', color: '#0f172a' }}>
                {suite.karmicSoulBond.soulBondScore}% - {isHi ? suite.karmicSoulBond.bondTypeHi.split('(')[0] : suite.karmicSoulBond.bondTypeEn}
              </h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#475569' }}>
                {isHi ? 'पंचम भाव व राहु-केतु अक्ष द्वारा सत्यापित' : 'Verified via 5th house & Rahu-Ketu axis'}
              </p>
            </div>

            {/* Card 5: Mulank & Bhagyank */}
            <div
              className="oj-card"
              style={{ borderLeft: '4px solid #10b981', cursor: 'pointer' }}
              onClick={() => setCategoryAndTab('numerology', 'birth_date_match')}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#059669' }}>
                  {isHi ? 'अंकज्योतिष अनुकूलता' : 'Numerology Match'}
                </span>
                <Users size={14} color="#059669" />
              </div>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', color: '#0f172a' }}>
                {suite.birthDateMatch.overallScore}% ({isHi ? suite.birthDateMatch.matchGradeHi.split('(')[0] : suite.birthDateMatch.matchGradeEn})
              </h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#475569' }}>
                {p1Name} ({suite.birthDateMatch.mulank1}) + {p2Name} ({suite.birthDateMatch.mulank2})
              </p>
            </div>

            {/* Card 6: Ayurdaya Class */}
            <div
              className="oj-card"
              style={{ borderLeft: '4px solid #059669', cursor: 'pointer' }}
              onClick={() => setCategoryAndTab('ayurdaya_protection', 'ayurdaya_class')}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#047857' }}>
                  {isHi ? 'शास्त्रीय आयुर्दाय वर्ग' : 'Ayurdaya Class'}
                </span>
                <Shield size={14} color="#047857" />
              </div>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', color: '#0f172a' }}>
                {isHi ? suite.ayurdayaClass.longevityClassHi : suite.ayurdayaClass.longevityClassEn}
              </h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#475569' }}>
                {isHi ? 'महर्षि जैमिनी त्रिक सूत्र द्वारा प्रमाणित' : 'Certified via Maharishi Jaimini 3-Pair Rule'}
              </p>
            </div>

            {/* Card 7: Name Vibration Match */}
            <div
              className="oj-card"
              style={{ borderLeft: '4px solid #06b6d4', cursor: 'pointer' }}
              onClick={() => setCategoryAndTab('numerology', 'name_vibration')}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#0891b2' }}>
                  {isHi ? 'नामांक कंपन मिलान' : 'Name Vibration'}
                </span>
                <Zap size={14} color="#0891b2" />
              </div>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', color: '#0f172a' }}>
                {suite.nameVibrationMatch.vibrationalScore}% ({isHi ? suite.nameVibrationMatch.statusGradeHi.split('(')[0] : suite.nameVibrationMatch.statusGradeEn})
              </h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#475569' }}>
                {p1Name} ({suite.nameVibrationMatch.p1Chaldean}) + {p2Name} ({suite.nameVibrationMatch.p2Chaldean})
              </p>
            </div>

            {/* Card 8: Zodiac Element Resonance */}
            <div
              className="oj-card"
              style={{ borderLeft: '4px solid #f97316', cursor: 'pointer' }}
              onClick={() => setCategoryAndTab('vedic_relationship', 'zodiac_element')}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#ea580c' }}>
                  {isHi ? 'तत्व व राशि मिलान' : 'Element Match'}
                </span>
                <Flame size={14} color="#ea580c" />
              </div>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', color: '#0f172a' }}>
                {suite.zodiacElementMatch.overallResonanceScore}% ({suite.zodiacElementMatch.element1Hi} + {suite.zodiacElementMatch.element2Hi})
              </h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#475569' }}>
                {suite.zodiacElementMatch.elementalSynergyVerdictHi.slice(0, 42)}...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. LOVE VS ARRANGED MARRIAGE */}
      {/* ========================================================================= */}
      {activeTab === 'love_vs_arranged' && (
        <div className="oj-card" style={{ padding: '24px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Heart size={20} color="#e11d48" />
            <h2 style={{ margin: 0, fontSize: '20px', color: '#0f172a', fontWeight: 800 }}>
              {isHi ? 'प्रेम बनाम पारंपरिक विवाह कैलकुलेटर' : 'Love vs Arranged Marriage Calculator'}
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '16px',
              marginBottom: '20px',
            }}
          >
            <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', padding: '16px', borderRadius: '10px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#9f1239', textTransform: 'uppercase' }}>
                {isHi ? 'प्रेम विवाह संभावना' : 'Love Marriage Probability'}
              </div>
              <div style={{ fontSize: '36px', fontWeight: 900, color: '#e11d48', marginTop: '4px' }}>
                {suite.loveVsArranged.loveScore}%
              </div>
              <div style={{ fontSize: '12px', color: '#881337', marginTop: '6px' }}>
                {isHi ? 'पंचम भाव, शुक्र एवं मंगल का संबंध' : '5th house, Venus & Mars romantic influence'}
              </div>
            </div>

            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '16px', borderRadius: '10px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#166534', textTransform: 'uppercase' }}>
                {isHi ? 'पारंपरिक / पारिवारिक विवाह संभावना' : 'Arranged Marriage Probability'}
              </div>
              <div style={{ fontSize: '36px', fontWeight: 900, color: '#15803d', marginTop: '4px' }}>
                {suite.loveVsArranged.arrangedScore}%
              </div>
              <div style={{ fontSize: '12px', color: '#14532d', marginTop: '6px' }}>
                {isHi ? 'नवम भाव, धर्म एवं देवगुरु बृहस्पति का बल' : '9th house, Dharma & Jupiter family sanction'}
              </div>
            </div>
          </div>

          <div
            style={{
              padding: '16px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              marginBottom: '20px',
            }}
          >
            <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '14px', marginBottom: '6px' }}>
              {isHi ? 'शास्त्रीय निर्णय (Verdict):' : 'Classical Astrological Verdict:'}
            </div>
            <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6, color: '#334155' }}>
              {isHi ? suite.loveVsArranged.verdictHi : suite.loveVsArranged.verdictEn}
            </p>
          </div>

          <h3 style={{ fontSize: '15px', color: '#0f172a', fontWeight: 700, marginBottom: '10px' }}>
            {isHi ? 'कुंडली में उपस्थित प्रमुख शास्त्रीय योग:' : 'Key Supporting Classical Combinations:'}
          </h3>
          <ul style={{ paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {suite.loveVsArranged.astrologicalFactors.map((f, idx) => (
              <li key={idx} style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5 }}>
                {isHi ? f.factorHi : f.factorEn}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. MARRIAGE TIMING & DOUBLE TRANSIT */}
      {/* ========================================================================= */}
      {activeTab === 'marriage_timing' && (
        <div className="oj-card" style={{ padding: '24px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Clock size={20} color="#b45309" />
            <h2 style={{ margin: 0, fontSize: '20px', color: '#0f172a', fontWeight: 800 }}>
              {isHi ? 'सटीक विवाह समय एवं द्वि-गोचर कैलकुलेटर' : 'Marriage Timing & Double Transit Calculator'}
            </h2>
          </div>

          <div style={{ background: '#fefce8', border: '1px solid #fef08a', padding: '16px', borderRadius: '10px', marginBottom: '20px' }}>
            <div style={{ fontSize: '13px', color: '#854d0e', fontWeight: 700, marginBottom: '4px' }}>
              {isHi ? 'सर्वोत्तम विवाह आयु वर्ग (Prime Marriage Age Window):' : 'Prime Marriage Window:'}
            </div>
            <div style={{ fontSize: '24px', fontWeight: 900, color: '#713f12' }}>
              {isHi ? suite.marriageTiming.primeAgeWindowHi : suite.marriageTiming.primeAgeWindowEn}
            </div>
            <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: '#a16207' }}>
              {isHi ? suite.marriageTiming.transitStatusHi : suite.marriageTiming.transitStatusEn}
            </p>
          </div>

          <h3 style={{ fontSize: '15px', color: '#0f172a', fontWeight: 700, marginBottom: '12px' }}>
            {isHi ? 'आगामी वर्षों में गोचर सक्रियता (3-Year Transit Projection):' : 'Upcoming 3-Year Transit Timeline:'}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '20px' }}>
            {suite.marriageTiming.upcomingFavorableYears.map((w, idx) => (
              <div
                key={idx}
                style={{
                  padding: '14px',
                  background: w.score >= 80 ? '#ecfdf5' : '#f8fafc',
                  border: `1px solid ${w.score >= 80 ? '#a7f3d0' : '#e2e8f0'}`,
                  borderRadius: '8px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 800, fontSize: '16px', color: '#0f172a' }}>{w.year}</span>
                  <span
                    style={{
                      background: w.score >= 80 ? '#059669' : '#64748b',
                      color: '#fff',
                      padding: '2px 8px',
                      borderRadius: '10px',
                      fontSize: '11px',
                      fontWeight: 700,
                    }}
                  >
                    {w.score}%
                  </span>
                </div>
                <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#334155', lineHeight: 1.4 }}>
                  {isHi ? w.descriptionHi : w.descriptionEn}
                </p>
              </div>
            ))}
          </div>

          <div style={{ padding: '14px', background: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
            <div style={{ fontWeight: 700, fontSize: '13px', color: '#1e40af', marginBottom: '4px' }}>
              {isHi ? 'समय अनुकूलन हेतु शास्त्रीय उपाय:' : 'Auspicious Timing Remedial Action:'}
            </div>
            <p style={{ margin: 0, fontSize: '13px', color: '#1e3a8a' }}>
              {suite.marriageTiming.timingRemedyHi}
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. LIFE PARTNER NAME INITIAL FINDER */}
      {/* ========================================================================= */}
      {activeTab === 'partner_initials' && (
        <div className="oj-card" style={{ padding: '24px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Star size={20} color="#0284c7" />
            <h2 style={{ margin: 0, fontSize: '20px', color: '#0f172a', fontWeight: 800 }}>
              {isHi ? 'जीवनसाथी का संभावित नामाक्षर कैलकुलेटर' : 'Life Partner Name Initial Finder'}
            </h2>
          </div>

          <p style={{ fontSize: '13px', color: '#475569', marginBottom: '20px', lineHeight: 1.5 }}>
            {suite.lifePartnerInitials.classicalExplanationHi}
          </p>

          {/* Real-time Entered Partner Verification */}
          {suite.lifePartnerInitials.partnerNameMatch && (
            <div
              style={{
                marginBottom: '20px',
                padding: '16px',
                borderRadius: '10px',
                background: suite.lifePartnerInitials.partnerNameMatch.isMatched ? '#f0fdf4' : '#f8fafc',
                border: `2px solid ${suite.lifePartnerInitials.partnerNameMatch.isMatched ? '#22c55e' : '#cbd5e1'}`,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={18} color={suite.lifePartnerInitials.partnerNameMatch.isMatched ? '#16a34a' : '#0284c7'} />
                  <span style={{ fontWeight: 800, fontSize: '15px', color: '#0f172a' }}>
                    {isHi ? 'प्रविष्ट जीवनसाथी नाम सत्यापन:' : 'Entered Partner Name Verification:'}{' '}
                    <span style={{ color: '#0284c7', textDecoration: 'underline' }}>{suite.lifePartnerInitials.partnerNameMatch.partnerName}</span>
                  </span>
                </div>
                <span
                  style={{
                    background: suite.lifePartnerInitials.partnerNameMatch.isMatched ? '#16a34a' : '#0284c7',
                    color: '#ffffff',
                    fontSize: '12px',
                    fontWeight: 700,
                    padding: '4px 12px',
                    borderRadius: '12px',
                  }}
                >
                  {isHi ? suite.lifePartnerInitials.partnerNameMatch.matchGradeHi : suite.lifePartnerInitials.partnerNameMatch.matchGradeEn}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '13px', color: '#334155', lineHeight: 1.6 }}>
                {isHi ? suite.lifePartnerInitials.partnerNameMatch.explanationHi : suite.lifePartnerInitials.partnerNameMatch.explanationEn}
              </p>
            </div>
          )}

          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#0369a1', marginBottom: '10px' }}>
              {isHi ? 'सर्वाधिक संभावित प्राथमिक नामाक्षर (Primary Syllables):' : 'Highest Probability Initial Syllables:'}
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {suite.lifePartnerInitials.primaryInitials.map((init, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#e0f2fe',
                    border: '2px solid #38bdf8',
                    padding: '12px 18px',
                    borderRadius: '10px',
                    textAlign: 'center',
                    minWidth: '110px',
                  }}
                >
                  <div style={{ fontSize: '28px', fontWeight: 900, color: '#0369a1' }}>
                    {init.devanagari}
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0284c7' }}>
                    {init.roman}
                  </div>
                  <div style={{ fontSize: '10px', color: '#0c4a6e', marginTop: '4px' }}>
                    {init.nakshatraName} (चरण {init.pada})
                  </div>
                </div>
              ))}
            </div>
          </div>

          {suite.lifePartnerInitials.secondaryInitials.length > 0 && (
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>
                {isHi ? 'द्वितीयक वैकल्पिक नामाक्षर (Secondary Syllables):' : 'Secondary Alternative Syllables:'}
              </div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {suite.lifePartnerInitials.secondaryInitials.map((init, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: '#f1f5f9',
                      border: '1px solid #cbd5e1',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      textAlign: 'center',
                    }}
                  >
                    <span style={{ fontSize: '18px', fontWeight: 800, color: '#334155' }}>
                      {init.devanagari} ({init.roman})
                    </span>
                    <span style={{ fontSize: '11px', color: '#64748b', marginLeft: '6px' }}>
                      - {init.nakshatraName}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MARITAL HARMONY & RISK ANALYZER */}
      {/* ========================================================================= */}
      {activeTab === 'marital_harmony' && (
        <div className="oj-card" style={{ padding: '24px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Shield size={20} color="#059669" />
            <h2 style={{ margin: 0, fontSize: '20px', color: '#0f172a', fontWeight: 800 }}>
              {isHi ? 'दांपत्य सामंजस्य व अलगाव संवेदनशीलता सूचकांक' : 'Marital Harmony & Divorce/Separation Risk'}
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '16px',
              marginBottom: '20px',
            }}
          >
            <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '16px', borderRadius: '10px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#065f46', textTransform: 'uppercase' }}>
                {isHi ? 'दांपत्य सामंजस्य स्कोर' : 'Harmony Score'}
              </div>
              <div style={{ fontSize: '36px', fontWeight: 900, color: '#059669', marginTop: '4px' }}>
                {suite.maritalHarmonyAndRisk.harmonyScore}%
              </div>
              <div style={{ fontSize: '12px', color: '#047857', marginTop: '6px' }}>
                {isHi ? suite.maritalHarmonyAndRisk.statusGradeHi : suite.maritalHarmonyAndRisk.statusGradeEn}
              </div>
            </div>

            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', padding: '16px', borderRadius: '10px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#92400e', textTransform: 'uppercase' }}>
                {isHi ? 'अलगाव / मतभेद संवेदनशीलता' : 'Separation / Dispute Sensitivity'}
              </div>
              <div style={{ fontSize: '36px', fontWeight: 900, color: '#d97706', marginTop: '4px' }}>
                {suite.maritalHarmonyAndRisk.separationRiskScore}%
              </div>
              <div style={{ fontSize: '12px', color: '#b45309', marginTop: '6px' }}>
                {suite.maritalHarmonyAndRisk.separationRiskScore < 35
                  ? isHi ? 'अति सुरक्षित (Low Risk)' : 'Low Risk'
                  : isHi ? 'शास्त्रीय शांति अपेक्षित' : 'Requires Peaceful Upayas'}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '20px' }}>
            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 700, fontSize: '13px', color: '#166534', marginBottom: '6px' }}>
                {isHi ? 'सुरक्षात्मक शास्त्रीय कारक:' : 'Protective Classical Factors:'}
              </div>
              <ul style={{ paddingLeft: '18px', margin: 0, fontSize: '12px', color: '#334155', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {suite.maritalHarmonyAndRisk.protectiveFactorsHi.map((p, idx) => (
                  <li key={idx}>{p}</li>
                ))}
              </ul>
            </div>

            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 700, fontSize: '13px', color: '#991b1b', marginBottom: '6px' }}>
                {isHi ? 'सतर्कता के बिंदु:' : 'Points of Vigilance:'}
              </div>
              <ul style={{ paddingLeft: '18px', margin: 0, fontSize: '12px', color: '#334155', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {suite.maritalHarmonyAndRisk.vulnerabilityFactorsHi.map((v, idx) => (
                  <li key={idx}>{v}</li>
                ))}
              </ul>
            </div>
          </div>

          <div style={{ padding: '14px', background: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
            <div style={{ fontWeight: 700, fontSize: '13px', color: '#1e40af', marginBottom: '4px' }}>
              {isHi ? 'सामंजस्य वृद्धि हेतु शास्त्रीय शांति:' : 'Remedial Pacification:'}
            </div>
            <ul style={{ paddingLeft: '18px', margin: 0, fontSize: '12px', color: '#1e3a8a' }}>
              {suite.maritalHarmonyAndRisk.remedialMitigationHi.map((r, idx) => (
                <li key={idx}>{r}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. KARMIC SOUL BOND (TWIN FLAME ALTERNATIVE) */}
      {/* ========================================================================= */}
      {activeTab === 'karmic_soul_bond' && (
        <div className="oj-card" style={{ padding: '24px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Sparkles size={20} color="#7c3aed" />
            <h2 style={{ margin: 0, fontSize: '20px', color: '#0f172a', fontWeight: 800 }}>
              {isHi ? 'ऋणानुबंध एवं आत्मिक संबंध कैलकुलेटर (Karmic Soul Bond)' : 'Vedic Karmic Soul Bond'}
            </h2>
          </div>

          <div style={{ background: '#faf5ff', border: '1px solid #e9d5ff', padding: '18px', borderRadius: '10px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#6b21a8', textTransform: 'uppercase' }}>
                  {isHi ? 'आत्मिक संबंध श्रेणी' : 'Soul Bond Classification'}
                </span>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#581c87', marginTop: '2px' }}>
                  {isHi ? suite.karmicSoulBond.bondTypeHi : suite.karmicSoulBond.bondTypeEn}
                </div>
              </div>
              <div style={{ fontSize: '32px', fontWeight: 900, color: '#7c3aed' }}>
                {suite.karmicSoulBond.soulBondScore}%
              </div>
            </div>
            <p style={{ margin: '12px 0 0 0', fontSize: '13px', color: '#4c1d95', lineHeight: 1.6 }}>
              {suite.karmicSoulBond.soulDepthDescriptionHi}
            </p>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
              {isHi ? 'पूर्व जन्म के शास्त्रीय संकेत (Past Life Signatures):' : 'Past-Life Astrological Signatures:'}
            </div>
            <ul style={{ paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {suite.karmicSoulBond.pastLifeSignaturesHi.map((s, idx) => (
                <li key={idx} style={{ fontSize: '13px', color: '#475569' }}>
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div style={{ padding: '14px', background: '#fdf4ff', borderRadius: '8px', border: '1px solid #f5d0fe' }}>
            <div style={{ fontWeight: 700, fontSize: '13px', color: '#86198f', marginBottom: '4px' }}>
              {isHi ? 'इस संबंध का कार्मिक संदेश एवं उपाय:' : 'Karmic Lesson & Spiritual Liberation:'}
            </div>
            <p style={{ margin: '0 0 6px 0', fontSize: '13px', color: '#701a75' }}>
              {suite.karmicSoulBond.karmicLessonHi}
            </p>
            <p style={{ margin: 0, fontSize: '12px', color: '#a21caf', fontWeight: 600 }}>
              {suite.karmicSoulBond.spiritualLiberationUpayaHi}
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. VARAHAMIHIRA STREE JATAKA */}
      {/* ========================================================================= */}
      {activeTab === 'stree_jataka' && (
        <div className="oj-card" style={{ padding: '24px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <BookOpen size={20} color="#d97706" />
            <h2 style={{ margin: 0, fontSize: '20px', color: '#0f172a', fontWeight: 800 }}>
              {isHi ? 'वराहमिहिर स्त्री जातक त्रिंशांश एवं सौभाग्य निर्णय' : 'Varahamihira Stree Jataka & Saubhagya'}
            </h2>
          </div>

          <div style={{ background: '#fef3c7', border: '1px solid #fde68a', padding: '16px', borderRadius: '10px', marginBottom: '20px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#92400e' }}>
              {isHi ? 'अष्टम भाव (मांगल्य स्थान) निर्णय:' : '8th House Mangalya Assessment:'}
            </div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#78350f', marginTop: '4px' }}>
              {suite.streeJataka.saubhagyaStatusHi}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '20px' }}>
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 700, fontSize: '13px', color: '#0369a1', marginBottom: '6px' }}>
                {isHi ? 'त्रिंशांश (D-30) स्वभाव व शील:' : 'Trimsamsha Temperament & Virtues:'}
              </div>
              <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.6, color: '#334155' }}>
                {suite.streeJataka.characterAndVirtuesHi}
              </p>
            </div>

            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 700, fontSize: '13px', color: '#7e22ce', marginBottom: '6px' }}>
                {isHi ? 'जीवनसाथी का स्वरूप व स्थिति:' : 'Spouse Persona & Status:'}
              </div>
              <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.6, color: '#334155' }}>
                {suite.streeJataka.spousePersonaAndStatusHi}
              </p>
            </div>
          </div>

          <div style={{ fontSize: '11px', color: '#64748b' }}>
            {isHi ? 'शास्त्रीय प्रमाण: ' : 'Classical Source: '}
            {suite.streeJataka.classicalReference}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. ZODIAC ELEMENT MATCH */}
      {/* ========================================================================= */}
      {activeTab === 'zodiac_element' && (
        <div className="oj-card" style={{ padding: '24px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Flame size={20} color="#ea580c" />
            <h2 style={{ margin: 0, fontSize: '20px', color: '#0f172a', fontWeight: 800 }}>
              {isHi ? 'द्वादश राशि एवं तत्व प्रेम अनुकूलता' : 'Zodiac Element & Planetary Resonance'}
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '20px' }}>
            <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', padding: '16px', borderRadius: '10px' }}>
              <div style={{ fontSize: '12px', color: '#9a3412', fontWeight: 700 }}>
                {p1Name} (चंद्र राशि व तत्व):
              </div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#c2410c', marginTop: '4px' }}>
                {suite.zodiacElementMatch.moonSign1Hi}
              </div>
              <div style={{ fontSize: '13px', color: '#ea580c', fontWeight: 600 }}>
                {suite.zodiacElementMatch.element1Hi}
              </div>
            </div>

            <div style={{ background: '#ecfeff', border: '1px solid #a5f3fc', padding: '16px', borderRadius: '10px' }}>
              <div style={{ fontSize: '12px', color: '#155e75', fontWeight: 700 }}>
                {p2Name} (चंद्र राशि व तत्व):
              </div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#0891b2', marginTop: '4px' }}>
                {suite.zodiacElementMatch.moonSign2Hi}
              </div>
              <div style={{ fontSize: '13px', color: '#06b6d4', fontWeight: 600 }}>
                {suite.zodiacElementMatch.element2Hi}
              </div>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '16px', borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#475569', fontWeight: 700, textTransform: 'uppercase' }}>
                {isHi ? 'समग्र तत्व सामंजस्य' : 'Elemental Synergy'}
              </div>
              <div style={{ fontSize: '32px', fontWeight: 900, color: '#0f172a', marginTop: '4px' }}>
                {suite.zodiacElementMatch.overallResonanceScore}%
              </div>
            </div>
          </div>

          <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
            <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '14px', marginBottom: '6px' }}>
              {isHi ? 'तत्वीय विश्लेषण:' : 'Elemental Synergy Analysis:'}
            </div>
            <p style={{ margin: 0, fontSize: '13px', color: '#334155', lineHeight: 1.6 }}>
              {suite.zodiacElementMatch.elementalSynergyVerdictHi}
            </p>
          </div>

          <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
            {suite.zodiacElementMatch.practicalCounselHi}
          </p>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. RELATIONSHIP PUJA & UPAYAS */}
      {/* ========================================================================= */}
      {activeTab === 'relationship_puja' && (
        <div className="oj-card" style={{ padding: '24px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Award size={20} color="#b91c1c" />
            <h2 style={{ margin: 0, fontSize: '20px', color: '#0f172a', fontWeight: 800 }}>
              {isHi ? 'संबंध शांति व वैदिक विवाह पूजा परामर्श' : 'Relationship Puja & Vedic Upayas Consultation'}
            </h2>
          </div>

          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '14px', borderRadius: '8px', marginBottom: '20px' }}>
            <div style={{ fontWeight: 700, fontSize: '13px', color: '#991b1b', marginBottom: '4px' }}>
              {isHi ? 'कुंडली विश्लेषण:' : 'Chart Assessment:'}
            </div>
            <p style={{ margin: 0, fontSize: '13px', color: '#7f1d1d' }}>
              {suite.relationshipPuja.primaryDoshaAssessmentHi}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {suite.relationshipPuja.recommendedPujas.map((puja, idx) => (
              <div
                key={idx}
                style={{
                  padding: '16px',
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '6px' }}>
                  <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a', fontWeight: 700 }}>
                    {puja.pujaTitleHi}
                  </h3>
                  <span style={{ fontSize: '11px', background: '#fee2e2', color: '#991b1b', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>
                    {puja.japaCount}
                  </span>
                </div>

                <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#475569' }}>
                  {puja.objectiveHi}
                </p>

                <div
                  style={{
                    background: '#f8fafc',
                    padding: '10px 14px',
                    borderRadius: '6px',
                    borderLeft: '3px solid #b91c1c',
                    marginBottom: '10px',
                    fontFamily: 'serif',
                    fontSize: '14px',
                    color: '#7f1d1d',
                    fontWeight: 700,
                  }}
                >
                  {puja.prescribedMantra}
                </div>

                <div style={{ fontSize: '12px', color: '#334155', lineHeight: 1.5 }}>
                  <strong>{isHi ? 'विधि:' : 'Procedure:'}</strong> {puja.procedureHi}
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                  <strong>{isHi ? 'शुभ मुहूर्त/दिन:' : 'Auspicious Muhurta:'}</strong> {puja.bestDayOrMuhurtaHi}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 9. BIRTH DATE MULANK & BHAGYANK COMPATIBILITY */}
      {/* ========================================================================= */}
      {activeTab === 'birth_date_match' && (
        <div className="oj-card" style={{ padding: '24px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Calendar size={20} color="#15803d" />
            <h2 style={{ margin: 0, fontSize: '20px', color: '#0f172a', fontWeight: 800 }}>
              {isHi ? 'जन्म तिथि अनुकूलता कैलकुलेटर (मूलांक व भाग्यांक)' : 'Birth Date Mulank & Bhagyank Match'}
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '20px' }}>
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '16px', borderRadius: '10px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#166534' }}>
                {p1Name} (Person 1)
              </div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#15803d', marginTop: '4px' }}>
                मूलांक {suite.birthDateMatch.mulank1} | भाग्यांक {suite.birthDateMatch.bhagyank1}
              </div>
              <div style={{ fontSize: '12px', color: '#14532d', marginTop: '4px' }}>
                स्वामी ग्रह: {suite.birthDateMatch.planet1Hi}
              </div>
            </div>

            <div style={{ background: '#fdf2f8', border: '1px solid #fbcfe8', padding: '16px', borderRadius: '10px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#9d174d' }}>
                {p2Name} (Person 2)
              </div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#be185d', marginTop: '4px' }}>
                मूलांक {suite.birthDateMatch.mulank2} | भाग्यांक {suite.birthDateMatch.bhagyank2}
              </div>
              <div style={{ fontSize: '12px', color: '#831843', marginTop: '4px' }}>
                स्वामी ग्रह: {suite.birthDateMatch.planet2Hi}
              </div>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '16px', borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#475569', fontWeight: 700, textTransform: 'uppercase' }}>
                {isHi ? 'समग्र अंक अनुकूलता' : 'Overall Match'}
              </div>
              <div style={{ fontSize: '36px', fontWeight: 900, color: '#0f172a', marginTop: '4px' }}>
                {suite.birthDateMatch.overallScore}%
              </div>
            </div>
          </div>

          <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
            <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '14px', marginBottom: '6px' }}>
              {isHi ? 'अंक ज्योतिष विश्लेषण:' : 'Numerology Dynamics:'}
            </div>
            <p style={{ margin: 0, fontSize: '13px', color: '#334155', lineHeight: 1.6 }}>
              {suite.birthDateMatch.dynamicAnalysisHi}
            </p>
          </div>

          <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
            {suite.birthDateMatch.harmonizingAdviceHi}
          </p>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 10. CHALDEAN & PYTHAGOREAN NAME VIBRATION */}
      {/* ========================================================================= */}
      {activeTab === 'name_vibration' && (
        <div className="oj-card" style={{ padding: '24px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Zap size={20} color="#0284c7" />
            <h2 style={{ margin: 0, fontSize: '20px', color: '#0f172a', fontWeight: 800 }}>
              {isHi ? 'चालडियन एवं पाइथागोरियन नामांक अनुकूलता' : 'Name Numerology Vibration Match'}
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '20px' }}>
            <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', padding: '16px', borderRadius: '10px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#0369a1' }}>{p1Name}</div>
              <div style={{ fontSize: '14px', color: '#0284c7', marginTop: '6px' }}>
                चालडियन नामांक: <strong>{suite.nameVibrationMatch.p1Chaldean}</strong>
              </div>
              <div style={{ fontSize: '14px', color: '#0284c7', marginTop: '2px' }}>
                पाइथागोरियन नामांक: <strong>{suite.nameVibrationMatch.p1Pythagorean}</strong>
              </div>
            </div>

            <div style={{ background: '#fdf2f8', border: '1px solid #fbcfe8', padding: '16px', borderRadius: '10px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#9d174d' }}>{p2Name}</div>
              <div style={{ fontSize: '14px', color: '#be185d', marginTop: '6px' }}>
                चालडियन नामांक: <strong>{suite.nameVibrationMatch.p2Chaldean}</strong>
              </div>
              <div style={{ fontSize: '14px', color: '#be185d', marginTop: '2px' }}>
                पाइथागोरियन नामांक: <strong>{suite.nameVibrationMatch.p2Pythagorean}</strong>
              </div>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '16px', borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#475569', fontWeight: 700, textTransform: 'uppercase' }}>
                {isHi ? 'ध्वनि कंपन स्कोर' : 'Vibrational Harmony'}
              </div>
              <div style={{ fontSize: '36px', fontWeight: 900, color: '#0f172a', marginTop: '4px' }}>
                {suite.nameVibrationMatch.vibrationalScore}%
              </div>
            </div>
          </div>

          <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
            <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '14px', marginBottom: '6px' }}>
              {isHi ? 'ध्वनि कंपन फलादेश:' : 'Vibrational Reading:'}
            </div>
            <p style={{ margin: 0, fontSize: '13px', color: '#334155', lineHeight: 1.6 }}>
              {suite.nameVibrationMatch.vibrationVerdictHi}
            </p>
          </div>

          <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
            {suite.nameVibrationMatch.soundHarmonizationAdviceHi}
          </p>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 11. COUPLE AUSPICIOUS DATES */}
      {/* ========================================================================= */}
      {activeTab === 'auspicious_dates' && (
        <div className="oj-card" style={{ padding: '24px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Calendar size={20} color="#059669" />
            <h2 style={{ margin: 0, fontSize: '20px', color: '#0f172a', fontWeight: 800 }}>
              {isHi ? 'युगल शुभ तिथि एवं दिन कैलकुलेटर' : 'Couple Auspicious Dates Finder'}
            </h2>
          </div>

          <p style={{ fontSize: '13px', color: '#475569', marginBottom: '20px' }}>
            {suite.coupleAuspiciousDates.practicalGuidelineHi}
          </p>

          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#166534', marginBottom: '10px' }}>
              {isHi ? 'माह की सर्वाधिक शुभ तारीखें (Auspicious Monthly Dates):' : 'Harmonious Monthly Dates:'}
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {suite.coupleAuspiciousDates.auspiciousMonthlyDates.map((d) => (
                <div
                  key={d}
                  style={{
                    background: '#dcfce7',
                    border: '2px solid #86efac',
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    fontWeight: 900,
                    color: '#15803d',
                  }}
                >
                  {d}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 700, fontSize: '13px', color: '#0f172a', marginBottom: '6px' }}>
                {isHi ? 'सर्वोत्तम शुभ दिन (Weekdays):' : 'Auspicious Weekdays:'}
              </div>
              <ul style={{ paddingLeft: '18px', margin: 0, fontSize: '13px', color: '#334155', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {suite.coupleAuspiciousDates.auspiciousWeekdaysHi.map((w, idx) => (
                  <li key={idx}>{w}</li>
                ))}
              </ul>
            </div>

            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 700, fontSize: '13px', color: '#0f172a', marginBottom: '6px' }}>
                {isHi ? 'इन तारीखों में अनुशंसित कार्य:' : 'Recommended Joint Activities:'}
              </div>
              <ul style={{ paddingLeft: '18px', margin: 0, fontSize: '13px', color: '#334155', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {suite.coupleAuspiciousDates.recommendedActivitiesHi.map((a, idx) => (
                  <li key={idx}>{a}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 12. FRIENDSHIP & LOYALTY QUOTIENT */}
      {/* ========================================================================= */}
      {activeTab === 'friendship_loyalty' && (
        <div className="oj-card" style={{ padding: '24px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Users size={20} color="#0d9488" />
            <h2 style={{ margin: 0, fontSize: '20px', color: '#0f172a', fontWeight: 800 }}>
              {isHi ? 'मित्रता एवं निष्ठा सूचकांक (Friendship & Loyalty)' : 'Friendship & Loyalty Quotient'}
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '20px' }}>
            <div style={{ background: '#f0fdfa', border: '1px solid #99f6e4', padding: '14px', borderRadius: '8px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#115e59', textTransform: 'uppercase' }}>
                {isHi ? 'निष्ठा सूचकांक (Loyalty)' : 'Loyalty Index'}
              </div>
              <div style={{ fontSize: '28px', fontWeight: 900, color: '#0f766e', marginTop: '2px' }}>
                {suite.friendshipAndLoyalty.loyaltyIndex}%
              </div>
            </div>

            <div style={{ background: '#f0fdfa', border: '1px solid #99f6e4', padding: '14px', borderRadius: '8px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#115e59', textTransform: 'uppercase' }}>
                {isHi ? 'संवाद सहजता' : 'Communication Ease'}
              </div>
              <div style={{ fontSize: '28px', fontWeight: 900, color: '#0f766e', marginTop: '2px' }}>
                {suite.friendshipAndLoyalty.communicationIndex}%
              </div>
            </div>

            <div style={{ background: '#f0fdfa', border: '1px solid #99f6e4', padding: '14px', borderRadius: '8px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#115e59', textTransform: 'uppercase' }}>
                {isHi ? 'दीर्घकालिक स्थायित्व' : 'Durability'}
              </div>
              <div style={{ fontSize: '28px', fontWeight: 900, color: '#0f766e', marginTop: '2px' }}>
                {suite.friendshipAndLoyalty.longevityIndex}%
              </div>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '14px', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                {isHi ? 'समग्र मित्रता स्कोर' : 'Overall Score'}
              </div>
              <div style={{ fontSize: '28px', fontWeight: 900, color: '#0f172a', marginTop: '2px' }}>
                {suite.friendshipAndLoyalty.overallFriendshipScore}%
              </div>
            </div>
          </div>

          <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '14px' }}>
            <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '14px', marginBottom: '4px' }}>
              {isHi ? suite.friendshipAndLoyalty.friendshipTypeHi : suite.friendshipAndLoyalty.friendshipTypeEn}
            </div>
            <p style={{ margin: 0, fontSize: '13px', color: '#334155' }}>
              {suite.friendshipAndLoyalty.loyaltyVerdictHi}
            </p>
          </div>

          <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
            {suite.friendshipAndLoyalty.strengtheningRemedyHi}
          </p>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 13. PARASHARA & JAIMINI AYURDAYA CLASS */}
      {/* ========================================================================= */}
      {activeTab === 'ayurdaya_class' && (
        <div className="oj-card" style={{ padding: '24px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Shield size={20} color="#059669" />
            <h2 style={{ margin: 0, fontSize: '20px', color: '#0f172a', fontWeight: 800 }}>
              {isHi ? 'शास्त्रीय आयुर्दाय वर्ग निर्णय (Parashara & Jaimini Ayurdaya)' : 'Classical Ayurdaya Longevity Class'}
            </h2>
          </div>

          <div
            style={{
              padding: '14px 18px',
              background: '#fef2f2',
              borderRadius: '8px',
              border: '1px solid #fecaca',
              marginBottom: '20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#991b1b', fontWeight: 700, fontSize: '12px', marginBottom: '4px' }}>
              <AlertTriangle size={15} />
              <span>{isHi ? 'ऋषि आचार संहिता एवं नैतिक अस्वीकरण (Ethical Notice):' : 'Classical Shastric Ethics:'}</span>
            </div>
            <p style={{ margin: 0, fontSize: '12px', color: '#7f1d1d', lineHeight: 1.5 }}>
              {suite.ayurdayaClass.ethicalShastricDisclaimerHi}
            </p>
          </div>

          <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '18px', borderRadius: '10px', marginBottom: '20px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#065f46', textTransform: 'uppercase' }}>
              {isHi ? 'निर्धारित आयुर्दाय वर्ग:' : 'Determined Longevity Class:'}
            </div>
            <div style={{ fontSize: '28px', fontWeight: 900, color: '#047857', marginTop: '4px' }}>
              {isHi ? suite.ayurdayaClass.longevityClassHi : suite.ayurdayaClass.longevityClassEn}
            </div>
            <div style={{ fontSize: '13px', color: '#065f46', marginTop: '4px' }}>
              अनुमानित शास्त्रीय विस्तार: <strong>{suite.ayurdayaClass.estimatedSpanYears}</strong>
            </div>
          </div>

          <h3 style={{ fontSize: '15px', color: '#0f172a', fontWeight: 700, marginBottom: '10px' }}>
            {isHi ? 'महर्षि जैमिनी त्रिक सूत्र परीक्षण:' : 'Jaimini 3-Pair Shastric Calculations:'}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
            {suite.ayurdayaClass.jaiminiPairDetails.map((pair, idx) => (
              <div
                key={idx}
                style={{
                  padding: '12px 16px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '8px',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '13px', color: '#0f172a' }}>{pair.pairNameHi}</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>
                    राशि प्रकार: {pair.sign1Type} + {pair.sign2Type}
                  </div>
                </div>
                <span
                  style={{
                    background: pair.resultSpan === 'Deerghayu' ? '#dcfce7' : '#fef9c3',
                    color: pair.resultSpan === 'Deerghayu' ? '#166534' : '#854d0e',
                    padding: '3px 10px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 700,
                  }}
                >
                  {pair.resultSpanHi}
                </span>
              </div>
            ))}
          </div>

          <div style={{ fontSize: '11px', color: '#64748b' }}>
            {isHi ? 'शास्त्रीय आधार: ' : 'Classical Authority: '}
            {suite.ayurdayaClass.classicalSource}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 14. MARAKA STHANA & VULNERABILITY CYCLES */}
      {/* ========================================================================= */}
      {activeTab === 'maraka_vulnerability' && (
        <div className="oj-card" style={{ padding: '24px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <AlertTriangle size={20} color="#dc2626" />
            <h2 style={{ margin: 0, fontSize: '20px', color: '#0f172a', fontWeight: 800 }}>
              {isHi ? 'मारक भाव, मारकेश एवं २२वां द्रेष्काण परीक्षण' : 'Maraka Sthana & Vulnerability Cycles'}
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '20px' }}>
            {suite.marakaAndVulnerability.marakaLords.map((m, idx) => (
              <div key={idx} style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '16px', borderRadius: '10px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#991b1b' }}>{m.roleHi}</div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#7f1d1d', marginTop: '4px' }}>
                  {m.planetHi} ({m.planetEn})
                </div>
              </div>
            ))}

            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', padding: '16px', borderRadius: '10px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#92400e' }}>
                बाधकेश ({suite.marakaAndVulnerability.badhakaLord.house}वां भाव)
              </div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#78350f', marginTop: '4px' }}>
                {suite.marakaAndVulnerability.badhakaLord.planetHi}
              </div>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '16px', borderRadius: '10px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>
                २२वें द्रेष्काण का स्वामी (खरेश)
              </div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
                {suite.marakaAndVulnerability.twentySecondDrekkanaLordHi}
              </div>
            </div>
          </div>

          <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
            <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '14px', marginBottom: '6px' }}>
              {isHi ? 'स्वास्थ्य संवेदनशीलता के कालखंड (आयु वर्ष):' : 'Vulnerable Age Milestones:'}
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {suite.marakaAndVulnerability.vulnerableAgeMilestones.map((age) => (
                <span
                  key={age}
                  style={{
                    background: '#fee2e2',
                    color: '#991b1b',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 700,
                  }}
                >
                  आयु {age} वर्ष
                </span>
              ))}
            </div>
            <p style={{ margin: '12px 0 0 0', fontSize: '13px', color: '#475569', lineHeight: 1.5 }}>
              {suite.marakaAndVulnerability.vulnerabilityPrecautionsHi}
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 15. LONGEVITY PROTECTION & MAHA MRITYUNJAYA */}
      {/* ========================================================================= */}
      {activeTab === 'longevity_protection' && (
        <div className="oj-card" style={{ padding: '24px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Shield size={20} color="#059669" />
            <h2 style={{ margin: 0, fontSize: '20px', color: '#0f172a', fontWeight: 800 }}>
              {isHi ? 'आयुष्य रक्षा एवं महामृत्युंजय विधान' : 'Longevity Protection & Maha Mrityunjaya Upayas'}
            </h2>
          </div>

          <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '16px', borderRadius: '10px', marginBottom: '20px' }}>
            <div style={{ fontWeight: 700, fontSize: '13px', color: '#065f46', marginBottom: '6px' }}>
              {isHi ? 'कुंडली में सक्रिय बालारिष्ट भंग व आयुष्य रक्षक योग:' : 'Active Balarishta Bhanga Yogas:'}
            </div>
            <ul style={{ paddingLeft: '18px', margin: 0, fontSize: '13px', color: '#047857', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {suite.longevityProtection.activeBhangaYogasHi.map((y, idx) => (
                <li key={idx}>{y}</li>
              ))}
            </ul>
          </div>

          <div
            style={{
              padding: '20px',
              background: '#ffffff',
              border: '2px solid #059669',
              borderRadius: '12px',
              marginBottom: '20px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#047857', textTransform: 'uppercase', marginBottom: '8px' }}>
              {isHi ? 'ऋग्वेदोक्त महामृत्युंजय महामंत्र' : 'Rigvedic Maha Mrityunjaya Mantra'}
            </div>
            <div
              style={{
                fontFamily: 'serif',
                fontSize: '18px',
                fontWeight: 800,
                color: '#064e3b',
                lineHeight: 1.7,
                marginBottom: '10px',
              }}
            >
              {suite.longevityProtection.mahaMrityunjayaMantra}
            </div>
            <p style={{ margin: 0, fontSize: '12px', color: '#047857' }}>
              {suite.longevityProtection.japaGuidelinesHi}
            </p>
          </div>

          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontWeight: 700, fontSize: '13px', color: '#0f172a', marginBottom: '6px' }}>
              {isHi ? 'दीर्घायु व आरोग्यता हेतु शास्त्रोक्त दान एवं सेवा:' : 'Protective Charities & Service:'}
            </div>
            <ul style={{ paddingLeft: '18px', margin: 0, fontSize: '13px', color: '#334155', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {suite.longevityProtection.protectiveCharitiesHi.map((c, idx) => (
                <li key={idx}>{c}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 16. PAST LIFE KARMA */}
      {/* ========================================================================= */}
      {activeTab === 'past_life' && (
        <div className="oj-card" style={{ padding: '24px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <BookOpen size={20} color="#7e22ce" />
            <h2 style={{ margin: 0, fontSize: '20px', color: '#0f172a', fontWeight: 800 }}>
              {isHi ? 'पूर्व जन्म संस्कार व प्रारब्ध ऋणानुबंध' : 'Past Life Karma & Samskaras'}
            </h2>
          </div>

          <div style={{ background: '#faf5ff', border: '1px solid #e9d5ff', padding: '16px', borderRadius: '10px', marginBottom: '16px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#6b21a8' }}>
              {isHi ? 'पूर्व जन्म का देश व परिवेश:' : 'Past Life Origin Realm:'}
            </div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#581c87', marginTop: '2px' }}>
              {isHi ? pastLifeReport.soulOriginRealmHi : pastLifeReport.soulOriginRealmEn}
            </div>
            <div style={{ fontSize: '13px', color: '#6b21a8', marginTop: '4px' }}>
              {isHi ? `पूर्व जन्म भूमिका: ${pastLifeReport.pastLifeRoleHi}` : `Role: ${pastLifeReport.pastLifeRoleEn}`} | {isHi ? `भौगोलिक क्षेत्र: ${pastLifeReport.geographicSoulCradleHi}` : `Cradle: ${pastLifeReport.geographicSoulCradleEn}`}
            </div>
            <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: '#4c1d95', lineHeight: 1.6 }}>
              {isHi ? `संचित कर्म विशेषता: ${pastLifeReport.pastLifeDominantVirtueHi}` : `Dominant Virtue: ${pastLifeReport.pastLifeDominantVirtueEn}`}
            </p>
          </div>

          <div style={{ padding: '14px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontWeight: 700, fontSize: '13px', color: '#0f172a', marginBottom: '4px' }}>
              {isHi ? 'इस जन्म का प्रमुख संचित कार्मिक ऋण:' : 'Key Sanchita Karmic Debt In Current Life:'}
            </div>
            <p style={{ margin: 0, fontSize: '13px', color: '#334155' }}>
              {isHi ? pastLifeReport.sanchitaKarmaDebtHi : pastLifeReport.sanchitaKarmaDebtEn}
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 17. FUTURE LIFE REBIRTH */}
      {/* ========================================================================= */}
      {activeTab === 'future_life' && (
        <div className="oj-card" style={{ padding: '24px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Compass size={20} color="#0284c7" />
            <h2 style={{ margin: 0, fontSize: '20px', color: '#0f172a', fontWeight: 800 }}>
              {isHi ? 'आगामी जन्म व सद्गति प्रक्षेप' : 'Future Life & Rebirth Trajectory'}
            </h2>
          </div>

          <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', padding: '16px', borderRadius: '10px', marginBottom: '16px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#0369a1' }}>
              {isHi ? 'आत्मा की भावी गति (Future Rebirth Realm):' : 'Rebirth Realm:'}
            </div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#0c4a6e', marginTop: '2px' }}>
              {isHi ? futureLifeReport.soulGatiHi : futureLifeReport.soulGatiEn}
            </div>
            <div style={{ fontSize: '13px', color: '#0369a1', marginTop: '4px' }}>
              {isHi ? `मोक्ष समीपता: ${futureLifeReport.mokshaProximityPercent}%` : `Moksha Proximity: ${futureLifeReport.mokshaProximityPercent}%`} | {isHi ? `पुनर्जन्म संभावना: ${futureLifeReport.rebirthLikelihoodHi}` : `Rebirth: ${futureLifeReport.rebirthLikelihoodEn}`}
            </div>
            <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: '#0369a1', lineHeight: 1.6 }}>
              {isHi ? `भावी कर्म क्षेत्र: ${futureLifeReport.anticipatedNextLifeDomainHi}` : `Anticipated Domain: ${futureLifeReport.anticipatedNextLifeDomainEn}`}
            </p>
          </div>

          <div style={{ padding: '14px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontWeight: 700, fontSize: '13px', color: '#0f172a', marginBottom: '4px' }}>
              {isHi ? 'मोक्ष समीपता व सद्गति साधना मार्गदर्शन:' : 'Moksha Alignment & Sadgati Guidance:'}
            </div>
            <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#334155' }}>
              {isHi ? futureLifeReport.spiritualEvolutionStageHi : futureLifeReport.spiritualEvolutionStageEn}
            </p>
            <p style={{ margin: 0, fontSize: '12px', color: '#047857', fontWeight: 600 }}>
              {isHi ? futureLifeReport.sadgatiPrescriptionHi : futureLifeReport.sadgatiPrescriptionEn}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
