import React, { useMemo, useState } from 'react';
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
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
  computeFriendshipCompatibility,
  computeFutureLifeReading,
  computeLoveCompatibility,
  computePastLifeReading,
  type FriendshipCompatibilityReport,
  type FutureLifeReport,
  type LoveCompatibilityReport,
  type PastLifeReport,
} from '../../astro/fortuneCalculators';
import type { ChartData } from '../../astro/types';
import { useLanguage } from '../../i18n/LanguageContext';

interface FortuneCalculatorsViewProps {
  chart: ChartData;
  onNavigate?: (view: string) => void;
  initialTab?: 'love' | 'friendship' | 'past_life' | 'future_life';
}

export const FortuneCalculatorsView: React.FC<FortuneCalculatorsViewProps> = ({
  chart,
  onNavigate,
  initialTab = 'love',
}) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';

  const [activeTab, setActiveTab] = useState<'love' | 'friendship' | 'past_life' | 'future_life'>(initialTab);

  // Native's pre-filled information
  const nativeName = chart.input.name || 'जातक';
  const nativeDob = chart.input.date || '1995-06-15';

  // Love Calculator Form State
  const [partnerName, setPartnerName] = useState<string>('प्रिया');
  const [partnerDob, setPartnerDob] = useState<string>('1997-09-22');
  const [p1Name, setP1Name] = useState<string>(nativeName);
  const [p1Dob, setP1Dob] = useState<string>(nativeDob);

  // Friendship Calculator Form State
  const [friend1Name, setFriend1Name] = useState<string>(nativeName);
  const [friend2Name, setFriend2Name] = useState<string>('अमित');

  // Computed Reports
  const loveReport: LoveCompatibilityReport = useMemo(() => {
    return computeLoveCompatibility({ name: p1Name, dob: p1Dob }, { name: partnerName, dob: partnerDob });
  }, [p1Name, p1Dob, partnerName, partnerDob]);

  const friendshipReport: FriendshipCompatibilityReport = useMemo(() => {
    return computeFriendshipCompatibility(friend1Name, friend2Name, p1Dob, partnerDob);
  }, [friend1Name, friend2Name, p1Dob, partnerDob]);

  const pastLifeReport: PastLifeReport = useMemo(() => {
    return computePastLifeReading(chart);
  }, [chart]);

  const futureLifeReport: FutureLifeReport = useMemo(() => {
    return computeFutureLifeReading(chart);
  }, [chart]);

  return (
    <div className="oj-page-container">
      {/* Breadcrumb */}
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
          {isHi ? 'अंकज्योतिष व कार्मिक कैलकुलेटर हब' : 'Fortune & Karmic Calculators'}
        </span>
      </nav>

      {/* Header Card */}
      <div className="oj-page-header-card">
        <div className="oj-header-badge">
          {isHi
            ? 'शास्त्रीय अंक ज्योतिष, नाड़ी एवं गरुड़ पुराण आधारित फलकथन'
            : 'Chaldean Numerology, Nadi Karma & Puranic Soul Trajectory'}
        </div>
        <h1 className="oj-page-title">
          {isHi
            ? 'अंकज्योतिष व कार्मिक कैलकुलेटर: प्रेम, मित्रता, पूर्व जन्म एवं आगामी गति'
            : 'Fortune & Karmic Calculators Suite'}
        </h1>
        <p className="oj-page-subtitle">
          {isHi
            ? 'कीरो व कैल्डियन अंक प्रणाली से प्रेम व मित्रता की सामंजस्यता मापें, तथा गरुड़ पुराण व पराशर नाड़ी सूत्रों से पूर्व जन्म का प्रारब्ध व आगामी जीवन की दिशा जानें।'
            : 'Evaluate authentic Love & Friendship numerological harmony, unmask past-life karmic debts, and foresee future soul reincarnation realms.'}
        </p>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
          <button
            onClick={() => window.print()}
            className="oj-action-btn no-print"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Printer size={15} />
            <span>{isHi ? 'गणना रिपोर्ट प्रिंट करें' : 'Print Calculation Report'}</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
        <button
          onClick={() => setActiveTab('love')}
          className={`oj-tab-pill ${activeTab === 'love' ? 'is-active' : ''}`}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Heart size={14} />
          <span>{isHi ? 'प्रेम एवं दांपत्य कैलकुलेटर' : 'Love Compatibility'}</span>
        </button>

        <button
          onClick={() => setActiveTab('friendship')}
          className={`oj-tab-pill ${activeTab === 'friendship' ? 'is-active' : ''}`}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Users size={14} />
          <span>{isHi ? 'सच्ची मित्रता कैलकुलेटर' : 'Friendship Calculator'}</span>
        </button>

        <button
          onClick={() => setActiveTab('past_life')}
          className={`oj-tab-pill ${activeTab === 'past_life' ? 'is-active' : ''}`}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <BookOpen size={14} />
          <span>{isHi ? 'पूर्व जन्म रहस्य कैलकुलेटर' : 'Past Life Karma'}</span>
        </button>

        <button
          onClick={() => setActiveTab('future_life')}
          className={`oj-tab-pill ${activeTab === 'future_life' ? 'is-active' : ''}`}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Sparkles size={14} />
          <span>{isHi ? 'आगामी जन्म व आत्म-गति' : 'Future Life & Rebirth'}</span>
        </button>
      </div>

      {/* TAB 1: LOVE COMPATIBILITY CALCULATOR */}
      {activeTab === 'love' && (
        <div>
          {/* Input Form Card */}
          <div className="oj-card" style={{ marginBottom: '20px', background: '#ffffff', border: '1px solid #fbcfe8' }}>
            <h3 style={{ margin: '0 0 14px 0', fontSize: '16px', color: '#9d174d', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Heart size={18} />
              <span>{isHi ? 'दोनों व्यक्तियों का विवरण दर्ज करें' : 'Enter Partner Details'}</span>
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              {/* Person 1 */}
              <div style={{ background: '#fdf2f8', padding: '14px', borderRadius: '8px', border: '1px solid #fbcfe8' }}>
                <div style={{ fontWeight: 700, fontSize: '13px', color: '#831843', marginBottom: '10px' }}>
                  {isHi ? 'प्रथम व्यक्ति (जातक)' : 'Person 1 (Native)'}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: '#64748b', marginBottom: '3px' }}>
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
                    <label style={{ display: 'block', fontSize: '11px', color: '#64748b', marginBottom: '3px' }}>
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
              <div style={{ background: '#fdf2f8', padding: '14px', borderRadius: '8px', border: '1px solid #fbcfe8' }}>
                <div style={{ fontWeight: 700, fontSize: '13px', color: '#831843', marginBottom: '10px' }}>
                  {isHi ? 'द्वितीय व्यक्ति (जीवनसाथी / प्रेमी)' : 'Person 2 (Partner)'}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: '#64748b', marginBottom: '3px' }}>
                      {isHi ? 'नाम:' : 'Name:'}
                    </label>
                    <input
                      type="text"
                      value={partnerName}
                      onChange={(e) => setPartnerName(e.target.value)}
                      style={{ width: '100%', padding: '6px 10px', borderRadius: '5px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: '#64748b', marginBottom: '3px' }}>
                      {isHi ? 'जन्म तिथि:' : 'Date of Birth:'}
                    </label>
                    <input
                      type="date"
                      value={partnerDob}
                      onChange={(e) => setPartnerDob(e.target.value)}
                      style={{ width: '100%', padding: '6px 10px', borderRadius: '5px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Love Score Highlight Card */}
          <div
            className="oj-card"
            style={{
              background: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)',
              border: '2px solid #f43f5e',
              marginBottom: '20px',
              padding: '20px',
              borderRadius: '12px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
              <div>
                <span
                  style={{
                    background: '#e11d48',
                    color: '#ffffff',
                    padding: '3px 10px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: 700,
                  }}
                >
                  {isHi ? loveReport.intensityCategoryHi : loveReport.intensityCategoryEn}
                </span>
                <h2 style={{ margin: '8px 0 4px 0', fontSize: '22px', color: '#881337', fontWeight: 800 }}>
                  {loveReport.person1.name} &amp; {loveReport.person2.name}
                </h2>
                <div style={{ fontSize: '12px', color: '#9f1239' }}>
                  {loveReport.person1.name} (मूलांक {loveReport.person1.mulank}, स्वामी: {loveReport.person1.rulingPlanetHi}) |{' '}
                  {loveReport.person2.name} (मूलांक {loveReport.person2.mulank}, स्वामी: {loveReport.person2.rulingPlanetHi})
                </div>
              </div>

              <div
                style={{
                  background: '#ffffff',
                  border: '2px solid #fb7185',
                  padding: '10px 22px',
                  borderRadius: '12px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '32px', fontWeight: 900, color: '#e11d48', lineHeight: 1 }}>
                  {loveReport.overallLoveScore}%
                </div>
                <div style={{ fontSize: '11px', color: '#9f1239', fontWeight: 700, marginTop: '4px' }}>
                  {isHi ? 'प्रेम अनुकूलता सूचकांक' : 'Love Harmony Index'}
                </div>
              </div>
            </div>

            {/* 4 Pillars Progress Bars */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginTop: '18px' }}>
              <div style={{ background: '#ffffff', padding: '10px', borderRadius: '8px', border: '1px solid #fecdd3' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px', color: '#881337' }}>
                  <span>{isHi ? 'रोमांस व आकर्षण' : 'Attraction & Passion'}</span>
                  <strong>{loveReport.attractionScore}%</strong>
                </div>
                <div style={{ height: '6px', background: '#ffe4e6', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${loveReport.attractionScore}%`, height: '100%', background: '#e11d48' }} />
                </div>
              </div>

              <div style={{ background: '#ffffff', padding: '10px', borderRadius: '8px', border: '1px solid #fecdd3' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px', color: '#881337' }}>
                  <span>{isHi ? 'भावनात्मक एकात्मता' : 'Emotional Bond'}</span>
                  <strong>{loveReport.emotionalResonanceScore}%</strong>
                </div>
                <div style={{ height: '6px', background: '#ffe4e6', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${loveReport.emotionalResonanceScore}%`, height: '100%', background: '#e11d48' }} />
                </div>
              </div>

              <div style={{ background: '#ffffff', padding: '10px', borderRadius: '8px', border: '1px solid #fecdd3' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px', color: '#881337' }}>
                  <span>{isHi ? 'संवाद व बौद्धिक तालमेल' : 'Communication'}</span>
                  <strong>{loveReport.communicationScore}%</strong>
                </div>
                <div style={{ height: '6px', background: '#ffe4e6', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${loveReport.communicationScore}%`, height: '100%', background: '#e11d48' }} />
                </div>
              </div>

              <div style={{ background: '#ffffff', padding: '10px', borderRadius: '8px', border: '1px solid #fecdd3' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px', color: '#881337' }}>
                  <span>{isHi ? 'दांपत्य स्थिरता व दीर्घायु' : 'Marital Stability'}</span>
                  <strong>{loveReport.maritalStabilityScore}%</strong>
                </div>
                <div style={{ height: '6px', background: '#ffe4e6', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${loveReport.maritalStabilityScore}%`, height: '100%', background: '#e11d48' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Predictions */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            <div className="oj-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#1e293b' }}>
                {isHi ? 'संबंधों का स्वाभाविक स्वरूप व गतिशीलता' : 'Relational Dynamic & Chemistry'}
              </h4>
              <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                {isHi ? loveReport.relationshipDynamicsHi : loveReport.relationshipDynamicsEn}
              </p>
            </div>

            <div className="oj-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#b91c1c' }}>
                {isHi ? 'संभावित टकराव व सावधानी बिंदु' : 'Potential Friction Points & Hazards'}
              </h4>
              <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                {isHi ? loveReport.potentialFrictionHi : loveReport.potentialFrictionEn}
              </p>
            </div>

            <div className="oj-card" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', gridColumn: '1 / -1' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#166534' }}>
                {isHi ? 'शास्त्रीय सामंजस्य उपाय एवं युगल हेतु शुभ तारीखें' : 'Classical Harmonizing Remedies & Auspicious Dates'}
              </h4>
              <p style={{ fontSize: '12px', color: '#14532d', lineHeight: 1.6, margin: '0 0 8px 0' }}>
                {isHi ? loveReport.harmonizingRemediesHi : loveReport.harmonizingRemediesEn}
              </p>
              <div style={{ fontSize: '11.5px', color: '#15803d' }}>
                <strong>{isHi ? 'दंपति हेतु शुभ मासिक तारीखें:' : 'Auspicious Monthly Dates for Couple:'}</strong>{' '}
                {loveReport.auspiciousCoupleDates.join(', ')}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FRIENDSHIP CALCULATOR */}
      {activeTab === 'friendship' && (
        <div>
          {/* Input Form */}
          <div className="oj-card" style={{ marginBottom: '20px', background: '#ffffff', border: '1px solid #bfdbfe' }}>
            <h3 style={{ margin: '0 0 14px 0', fontSize: '16px', color: '#1d4ed8', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={18} />
              <span>{isHi ? 'दोनों मित्रों के नाम दर्ज करें' : 'Enter Friends Names'}</span>
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#64748b', marginBottom: '3px' }}>
                  {isHi ? 'आपका नाम:' : 'Your Name:'}
                </label>
                <input
                  type="text"
                  value={friend1Name}
                  onChange={(e) => setFriend1Name(e.target.value)}
                  style={{ width: '100%', padding: '6px 10px', borderRadius: '5px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#64748b', marginBottom: '3px' }}>
                  {isHi ? 'मित्र का नाम:' : 'Friend Name:'}
                </label>
                <input
                  type="text"
                  value={friend2Name}
                  onChange={(e) => setFriend2Name(e.target.value)}
                  style={{ width: '100%', padding: '6px 10px', borderRadius: '5px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>
            </div>
          </div>

          {/* Friendship Result Card */}
          <div
            className="oj-card"
            style={{
              background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
              border: '2px solid #3b82f6',
              marginBottom: '20px',
              padding: '20px',
              borderRadius: '12px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
              <div>
                <span style={{ background: '#2563eb', color: '#ffffff', padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 700 }}>
                  {isHi ? 'मित्रता सामंजस्य' : 'Friendship Synergy'}
                </span>
                <h2 style={{ margin: '8px 0 4px 0', fontSize: '22px', color: '#1e3a8a', fontWeight: 800 }}>
                  {friendshipReport.person1Name} &amp; {friendshipReport.person2Name}
                </h2>
                <div style={{ fontSize: '13px', color: '#1d4ed8', fontWeight: 600 }}>
                  {isHi ? friendshipReport.friendshipVerdictHi : friendshipReport.friendshipVerdictEn}
                </div>
              </div>

              <div style={{ background: '#ffffff', border: '2px solid #60a5fa', padding: '10px 22px', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '32px', fontWeight: 900, color: '#2563eb', lineHeight: 1 }}>
                  {friendshipReport.friendshipScore}%
                </div>
                <div style={{ fontSize: '11px', color: '#1e40af', fontWeight: 700, marginTop: '4px' }}>
                  {isHi ? 'मित्रता प्रगाढ़ता' : 'Friendship Score'}
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginTop: '18px' }}>
              <div style={{ background: '#ffffff', padding: '10px', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px', color: '#1e3a8a' }}>
                  <span>{isHi ? 'विश्वास व निष्ठा' : 'Trust & Loyalty'}</span>
                  <strong>{friendshipReport.trustIndex}%</strong>
                </div>
                <div style={{ height: '6px', background: '#dbeafe', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${friendshipReport.trustIndex}%`, height: '100%', background: '#2563eb' }} />
                </div>
              </div>

              <div style={{ background: '#ffffff', padding: '10px', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px', color: '#1e3a8a' }}>
                  <span>{isHi ? 'संवाद व सामंजस्य' : 'Communication Flow'}</span>
                  <strong>{friendshipReport.communicationSynergy}%</strong>
                </div>
                <div style={{ height: '6px', background: '#dbeafe', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${friendshipReport.communicationSynergy}%`, height: '100%', background: '#2563eb' }} />
                </div>
              </div>

              <div style={{ background: '#ffffff', padding: '10px', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px', color: '#1e3a8a' }}>
                  <span>{isHi ? 'हास्य, आनंद व ऊर्जा' : 'Humor & Fun Synergy'}</span>
                  <strong>{friendshipReport.funAndHumorScore}%</strong>
                </div>
                <div style={{ height: '6px', background: '#dbeafe', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${friendshipReport.funAndHumorScore}%`, height: '100%', background: '#2563eb' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            <div className="oj-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#1e293b' }}>
                {isHi ? 'मित्रता की वास्तविक शक्ति व खूबियां' : 'Core Friendship Strengths'}
              </h4>
              <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                {isHi ? friendshipReport.sharedStrengthsHi : friendshipReport.sharedStrengthsEn}
              </p>
            </div>

            <div className="oj-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#b91c1c' }}>
                {isHi ? 'संभावित मतभेद के बिंदु व सतर्कता' : 'Friction Triggers to Avoid'}
              </h4>
              <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                {isHi ? friendshipReport.frictionTriggersHi : friendshipReport.frictionTriggersEn}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PAST LIFE CALCULATOR */}
      {activeTab === 'past_life' && (
        <div>
          <div
            className="oj-card"
            style={{
              background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
              border: '2px solid #a855f7',
              marginBottom: '20px',
              padding: '22px',
              borderRadius: '12px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <span style={{ background: '#9333ea', color: '#ffffff', padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 700 }}>
                  {isHi ? 'नाड़ी एवं गरुड़ पुराण प्रारब्ध रहस्य' : 'Nadi & Garuda Purana Revelation'}
                </span>
                <h2 style={{ margin: '8px 0 2px 0', fontSize: '24px', color: '#581c87', fontWeight: 800 }}>
                  {isHi ? pastLifeReport.pastLifeRoleHi : pastLifeReport.pastLifeRoleEn}
                </h2>
                <div style={{ fontSize: '13px', color: '#7e22ce', fontWeight: 600 }}>
                  {isHi ? pastLifeReport.geographicSoulCradleHi : pastLifeReport.geographicSoulCradleEn} |{' '}
                  {isHi ? pastLifeReport.historicalEraHi : pastLifeReport.historicalEraEn}
                </div>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid #d8b4fe', padding: '8px 16px', borderRadius: '10px' }}>
                <span style={{ fontSize: '11px', color: '#6b21a8', fontWeight: 700 }}>
                  {isHi ? 'आत्मा का मूल लोक:' : 'Soul Origin:'}
                </span>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#3b0764' }}>
                  {isHi ? pastLifeReport.soulOriginRealmHi : pastLifeReport.soulOriginRealmEn}
                </div>
              </div>
            </div>

            <div style={{ marginTop: '16px', borderTop: '1px dashed #d8b4fe', paddingTop: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                <div style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #e9d5ff' }}>
                  <div style={{ fontWeight: 700, fontSize: '12px', color: '#6b21a8', marginBottom: '4px' }}>
                    {isHi ? 'पूर्व जन्म का मुख्य गुण (Mastered Virtue)' : 'Past Life Dominant Virtue'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#4c1d95', lineHeight: 1.5 }}>
                    {isHi ? pastLifeReport.pastLifeDominantVirtueHi : pastLifeReport.pastLifeDominantVirtueEn}
                  </div>
                </div>

                <div style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #e9d5ff' }}>
                  <div style={{ fontWeight: 700, fontSize: '12px', color: '#b91c1c', marginBottom: '4px' }}>
                    {isHi ? 'पूर्व जन्म की कार्मिक भूल (Karmic Flaw)' : 'Past Life Karmic Flaw'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#4c1d95', lineHeight: 1.5 }}>
                    {isHi ? pastLifeReport.pastLifeKarmicFlawHi : pastLifeReport.pastLifeKarmicFlawEn}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sanchita Karma & Unfinished Mission */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            <div className="oj-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#c2410c' }}>
                {isHi ? 'संचित कर्म एवं इस जन्म में चुकाने योग्य ऋण (Sanchita Debt)' : 'Sanchita Karma & Active Debts'}
              </h4>
              <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                {isHi ? pastLifeReport.sanchitaKarmaDebtHi : pastLifeReport.sanchitaKarmaDebtEn}
              </p>
            </div>

            <div className="oj-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#0369a1' }}>
                {isHi ? 'आत्मा का अधूरा संकल्प एवं जीवन उद्देश्य' : 'Unfinished Soul Mission'}
              </h4>
              <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                {isHi ? pastLifeReport.unfinishedSoulMissionHi : pastLifeReport.unfinishedSoulMissionEn}
              </p>
            </div>

            <div className="oj-card" style={{ background: '#fdf4ff', border: '1px solid #f0abfc', gridColumn: '1 / -1' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#86198f' }}>
                {isHi ? 'गरुड़ पुराण एवं पराशर कर्म-मुक्ति उपाय (Karmic Remedy)' : 'Garuda Purana Karmic Absolution'}
              </h4>
              <p style={{ fontSize: '12px', color: '#701a75', lineHeight: 1.6, margin: 0 }}>
                {isHi ? pastLifeReport.garudaPuranaRemedyHi : pastLifeReport.garudaPuranaRemedyEn}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: FUTURE LIFE CALCULATOR */}
      {activeTab === 'future_life' && (
        <div>
          <div
            className="oj-card"
            style={{
              background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
              border: '2px solid #10b981',
              marginBottom: '20px',
              padding: '22px',
              borderRadius: '12px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
              <div>
                <span style={{ background: '#059669', color: '#ffffff', padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 700 }}>
                  {isHi ? 'आत्मा की भावी गति (Future Soul Trajectory)' : 'Future Soul Trajectory'}
                </span>
                <h2 style={{ margin: '8px 0 2px 0', fontSize: '24px', color: '#064e3b', fontWeight: 800 }}>
                  {isHi ? futureLifeReport.soulGatiHi : futureLifeReport.soulGatiEn}
                </h2>
                <div style={{ fontSize: '13px', color: '#047857' }}>
                  {isHi ? 'पुनर्जन्म की संभावना:' : 'Rebirth Likelihood:'}{' '}
                  <strong>{isHi ? futureLifeReport.rebirthLikelihoodHi : futureLifeReport.rebirthLikelihoodEn}</strong>
                </div>
              </div>

              <div style={{ background: '#ffffff', border: '2px solid #34d399', padding: '10px 22px', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '32px', fontWeight: 900, color: '#059669', lineHeight: 1 }}>
                  {futureLifeReport.mokshaProximityPercent}%
                </div>
                <div style={{ fontSize: '11px', color: '#065f46', fontWeight: 700, marginTop: '4px' }}>
                  {isHi ? 'मोक्ष / आत्म-मुक्ति सन्निकटता' : 'Moksha Proximity'}
                </div>
              </div>
            </div>

            <div style={{ marginTop: '16px', borderTop: '1px dashed #6ee7b7', paddingTop: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                <div style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #a7f3d0' }}>
                  <div style={{ fontWeight: 700, fontSize: '12px', color: '#065f46', marginBottom: '4px' }}>
                    {isHi ? 'आगामी जन्म का संभावित परिवेश व क्षेत्र' : 'Anticipated Future Incarnation Domain'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#064e3b', lineHeight: 1.5 }}>
                    {isHi ? futureLifeReport.anticipatedNextLifeDomainHi : futureLifeReport.anticipatedNextLifeDomainEn}
                  </div>
                </div>

                <div style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #a7f3d0' }}>
                  <div style={{ fontWeight: 700, fontSize: '12px', color: '#065f46', marginBottom: '4px' }}>
                    {isHi ? 'आध्यात्मिक विकास का वर्तमान सोपान' : 'Spiritual Evolution Stage'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#064e3b', lineHeight: 1.5 }}>
                    {isHi ? futureLifeReport.spiritualEvolutionStageHi : futureLifeReport.spiritualEvolutionStageEn}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Remaining Lessons and Sadgati */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            <div className="oj-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#b45309' }}>
                {isHi ? 'इस जन्म में सीखने योग्य शेष कार्मिक पाठ' : 'Remaining Karmic Lessons in this Lifetime'}
              </h4>
              <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                {isHi ? futureLifeReport.remainingKarmicLessonsHi : futureLifeReport.remainingKarmicLessonsEn}
              </p>
            </div>

            <div className="oj-card" style={{ background: '#f0fdf4', border: '1px solid #86efac' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#15803d' }}>
                {isHi ? 'सद्गति व परम पद प्राप्ति हेतु नित्य साधना' : 'Prescription for Sadgati & High Rebirth'}
              </h4>
              <p style={{ fontSize: '12px', color: '#166534', lineHeight: 1.6, margin: 0 }}>
                {isHi ? futureLifeReport.sadgatiPrescriptionHi : futureLifeReport.sadgatiPrescriptionEn}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FortuneCalculatorsView;
