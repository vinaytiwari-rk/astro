import React, { useMemo, useState } from 'react';
import {
  Award,
  BookOpen,
  Briefcase,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Compass,
  DollarSign,
  ExternalLink,
  Flame,
  Globe,
  Heart,
  Info,
  Maximize2,
  Minimize2,
  Printer,
  Search,
  Shield,
  Sparkles,
  Star,
  User,
  Users,
  X,
  Zap,
} from 'lucide-react';
import {
  CELEBRITY_DATABASE,
  findCelebrityTwins,
  type CelebrityCategory,
  type CelebrityProfile,
  type CelebrityTwinMatch,
} from '../../astro/celebrityTwins';
import { SIGNS } from '../../astro/constants';
import type { ChartData, NineGrahaId } from '../../astro/types';
import { useLanguage } from '../../i18n/LanguageContext';

interface CelebrityTwinViewProps {
  chart: ChartData;
  onNavigate?: (view: string) => void;
}

const SIGNS_HI = [
  'मेष',
  'वृषभ',
  'मिथुन',
  'कर्क',
  'सिंह',
  'कन्या',
  'तुला',
  'वृश्चिक',
  'धनु',
  'मकर',
  'कुंभ',
  'मीन',
];

const PLANET_NAMES_HI: Record<NineGrahaId, string> = {
  Sun: 'सूर्य',
  Moon: 'चंद्र',
  Mars: 'मंगल',
  Mercury: 'बुध',
  Jupiter: 'गुरु',
  Venus: 'शुक्र',
  Saturn: 'शनि',
  Rahu: 'राहु',
  Ketu: 'केतु',
};

export const CelebrityTwinView: React.FC<CelebrityTwinViewProps> = ({ chart, onNavigate }) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';

  const [selectedCategory, setSelectedCategory] = useState<'all' | CelebrityCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sameLagnaOnly, setSameLagnaOnly] = useState<boolean>(false);
  const [sameMoonOnly, setSameMoonOnly] = useState<boolean>(false);
  const [highMatchOnly, setHighMatchOnly] = useState<boolean>(false);
  const [comparingMatch, setComparingMatch] = useState<CelebrityTwinMatch | null>(null);
  const [expandedMilestones, setExpandedMilestones] = useState<Record<string, boolean>>({});

  const matches: CelebrityTwinMatch[] = useMemo(() => {
    return findCelebrityTwins(chart);
  }, [chart]);

  const nativeAscSign = chart.ascendant.signIndex;
  const nativeMoon = chart.planets.find((p) => p.id === 'Moon');
  const nativeSun = chart.planets.find((p) => p.id === 'Sun');
  const nativeMoonSign = nativeMoon?.signIndex ?? 0;
  const nativeSunSign = nativeSun?.signIndex ?? 0;

  const filteredMatches = useMemo(() => {
    return matches.filter((m) => {
      // Category filter
      if (selectedCategory !== 'all' && m.celebrity.category !== selectedCategory) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName =
          m.celebrity.nameEn.toLowerCase().includes(q) ||
          m.celebrity.nameHi.includes(q) ||
          m.celebrity.birthPlace.toLowerCase().includes(q) ||
          m.celebrity.categoryTitleEn.toLowerCase().includes(q) ||
          m.celebrity.categoryTitleHi.includes(q);
        if (!matchesName) return false;
      }
      // Same Lagna filter
      if (sameLagnaOnly && m.celebrity.ascSignIndex !== nativeAscSign) {
        return false;
      }
      // Same Moon filter
      if (sameMoonOnly && m.celebrity.moonSignIndex !== nativeMoonSign) {
        return false;
      }
      // High Match filter
      if (highMatchOnly && m.similarityScore < 70) {
        return false;
      }
      return true;
    });
  }, [matches, selectedCategory, searchQuery, sameLagnaOnly, sameMoonOnly, highMatchOnly, nativeAscSign, nativeMoonSign]);

  const topMatch = matches[0];

  const toggleMilestones = (id: string) => {
    setExpandedMilestones((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

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
          {isHi
            ? 'वैश्विक सेलिब्रिटी कुंडली ट्विन (फोटो व प्रामाणिक चार्ट सादृश्य)'
            : 'Global Celebrity Kundli Twin Matcher'}
        </span>
      </nav>

      {/* Header Card */}
      <div className="oj-page-header-card">
        <div className="oj-header-badge">
          {isHi
            ? 'रॉडेन एए-रेटेड प्रामाणिक जन्म समय, उच्च-रिजॉल्यूशन फोटो व बहु-आयामी कुंडली सादृश्य'
            : 'Rodden AA-Rated Astro-Databank Synchrony, Verified Portraits & Dual Kundli Synastry'}
        </div>
        <h1 className="oj-page-title">
          {isHi
            ? 'वैश्विक सेलिब्रिटी कुंडली ट्विन: ऐतिहासिक व्यक्तित्वों से आपकी कुंडली का मिलान'
            : 'Global Celebrity Kundli Twin: Benchmark Horoscope Synergy'}
        </h1>
        <p className="oj-page-subtitle">
          {isHi
            ? 'आपकी लग्न, चंद्र राशि, सूर्य, दशम भाव (कर्म) एवं सक्रिय राजयोगों की तुलना विश्व के ४०+ शीर्ष युगद्रष्टाओं, वैज्ञानिकों, उद्योगपतियों, आध्यात्मिक गुरुओं व खेल दिग्गजों की प्रामाणिक कुंडलियों से कर जानिए कि किस महापुरुष की ग्रहीय संरचना आपकी चेतना से मेल खाती है।'
            : 'Explore which historic innovators, Nobel laureates, spiritual masters, industry titans, and athletic icons share your exact planetary matrix, Ascendant, Moon sign, and classical Yogas.'}
        </p>

        {/* Native Baseline Quick Bar */}
        <div
          style={{
            marginTop: '12px',
            background: 'rgba(255, 255, 255, 0.7)',
            padding: '10px 14px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '14px',
            fontSize: '12px',
          }}
        >
          <div>
            <span style={{ color: '#64748b' }}>{isHi ? 'आपकी लग्न:' : 'Your Ascendant:'} </span>
            <strong style={{ color: '#0f172a' }}>
              {isHi ? SIGNS_HI[nativeAscSign] : SIGNS[nativeAscSign].name} ({SIGNS[nativeAscSign].sanskrit})
            </strong>
          </div>
          <div>
            <span style={{ color: '#64748b' }}>{isHi ? 'आपकी चंद्र राशि:' : 'Your Moon Sign:'} </span>
            <strong style={{ color: '#0f172a' }}>
              {isHi ? SIGNS_HI[nativeMoonSign] : SIGNS[nativeMoonSign].name} ({SIGNS[nativeMoonSign].sanskrit})
            </strong>
          </div>
          <div>
            <span style={{ color: '#64748b' }}>{isHi ? 'आपकी सूर्य राशि:' : 'Your Sun Sign:'} </span>
            <strong style={{ color: '#0f172a' }}>
              {isHi ? SIGNS_HI[nativeSunSign] : SIGNS[nativeSunSign].name} ({SIGNS[nativeSunSign].sanskrit})
            </strong>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <button
              onClick={() => window.print()}
              className="oj-action-btn no-print"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', fontSize: '11px' }}
            >
              <Printer size={13} />
              <span>{isHi ? 'ट्विन रिपोर्ट प्रिंट करें' : 'Print Twin Report'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Prime Kundli Twin Highlight */}
      {topMatch && (
        <div
          className="oj-card"
          style={{
            background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
            border: '2px solid #f59e0b',
            marginBottom: '20px',
            borderRadius: '12px',
            padding: '18px',
            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.12)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <div
                    style={{
                      background: '#d97706',
                      color: '#ffffff',
                      padding: '4px 10px',
                      borderRadius: '16px',
                      fontWeight: 700,
                      fontSize: '11px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Star size={13} fill="#ffffff" />
                    <span>{isHi ? 'सर्वोच्च कुंडली सादृश्य' : 'Prime Kundli Twin'}</span>
                  </div>
                  <span
                    style={{
                      background: '#15803d',
                      color: '#ffffff',
                      padding: '2px 8px',
                      borderRadius: '10px',
                      fontWeight: 600,
                      fontSize: '10px',
                    }}
                  >
                    Rodden {topMatch.celebrity.roddenRating}
                  </span>
                  <span style={{ fontSize: '12px', color: '#92400e', fontWeight: 600 }}>
                    {isHi ? topMatch.celebrity.categoryTitleHi : topMatch.celebrity.categoryTitleEn}
                  </span>
                </div>

                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#78350f', margin: '6px 0 2px 0' }}>
                  {isHi ? topMatch.celebrity.nameHi : topMatch.celebrity.nameEn}
                </h2>
                <div style={{ fontSize: '12px', color: '#854d0e' }}>
                  {topMatch.celebrity.birthDate} | {topMatch.celebrity.birthPlace} | {isHi ? 'लग्न:' : 'Lagna:'}{' '}
                  <strong>{isHi ? SIGNS_HI[topMatch.celebrity.ascSignIndex] : SIGNS[topMatch.celebrity.ascSignIndex].name}</strong>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
              <div
                style={{
                  fontSize: '22px',
                  fontWeight: 'bold',
                  color: '#b45309',
                  background: '#ffffff',
                  padding: '6px 16px',
                  borderRadius: '10px',
                  border: '2px solid #fde68a',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                }}
              >
                {topMatch.similarityScore}% {isHi ? 'सादृश्य' : 'Match'}
              </div>
              <button
                onClick={() => setComparingMatch(topMatch)}
                className="oj-action-btn no-print"
                style={{
                  padding: '5px 12px',
                  fontSize: '11px',
                  background: '#92400e',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Maximize2 size={12} />
                <span>{isHi ? 'कुंडली तुलना देखें' : 'Compare Dual Kundli'}</span>
              </button>
            </div>
          </div>

          <div style={{ marginTop: '14px', borderTop: '1px dashed #fcd34d', paddingTop: '12px' }}>
            <div style={{ fontSize: '13px', color: '#92400e', fontStyle: 'italic', marginBottom: '12px' }}>
              &ldquo;{isHi ? topMatch.celebrity.quoteHi : topMatch.celebrity.quoteEn}&rdquo;
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
              <div style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #fef08a' }}>
                <div style={{ fontWeight: 700, fontSize: '12px', color: '#854d0e', marginBottom: '6px' }}>
                  {isHi ? 'ग्रहीय एकात्मता व शास्त्रीय सादृश्य' : 'Astrological Synergy & Resonance'}
                </div>
                <div style={{ fontSize: '12px', color: '#451a03', lineHeight: 1.5 }}>
                  {isHi ? topMatch.astrologicalSynergyHi : topMatch.astrologicalSynergyEn}
                </div>
              </div>

              <div style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #fef08a' }}>
                <div style={{ fontWeight: 700, fontSize: '12px', color: '#854d0e', marginBottom: '6px' }}>
                  {isHi ? 'जातक हेतु प्रेरणा व जीवन मार्गदर्शन' : 'Practical Life Guidance for Native'}
                </div>
                <div style={{ fontSize: '12px', color: '#451a03', lineHeight: 1.5 }}>
                  {isHi ? topMatch.nativeGuidanceHi : topMatch.nativeGuidanceEn}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters Toolbar */}
      <div
        className="oj-card"
        style={{
          marginBottom: '16px',
          padding: '14px',
          background: '#ffffff',
          border: '1px solid #e2e8f0',
        }}
      >
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '12px' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', flex: '1 1 240px' }}>
            <Search
              size={15}
              style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isHi ? 'महापुरुष का नाम या स्थान खोजें...' : 'Search luminary name or place...'}
              style={{
                width: '100%',
                padding: '8px 10px 8px 32px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                outline: 'none',
              }}
            />
          </div>

          {/* Quick Checkbox Filters */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={sameLagnaOnly}
                onChange={(e) => setSameLagnaOnly(e.target.checked)}
              />
              <span>{isHi ? 'केवल समान लग्न' : 'Same Lagna Only'}</span>
            </label>

            <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={sameMoonOnly}
                onChange={(e) => setSameMoonOnly(e.target.checked)}
              />
              <span>{isHi ? 'केवल समान चंद्र राशि' : 'Same Moon Sign'}</span>
            </label>

            <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={highMatchOnly}
                onChange={(e) => setHighMatchOnly(e.target.checked)}
              />
              <span>{isHi ? 'उच्च सादृश्य (>70%)' : 'High Match (>70%)'}</span>
            </label>
          </div>
        </div>

        {/* Category Tabs */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setSelectedCategory('all')}
            className={`oj-tab-pill ${selectedCategory === 'all' ? 'is-active' : ''}`}
            style={{ fontSize: '12px', padding: '5px 12px' }}
          >
            {isHi ? 'समस्त व्यक्तित्व' : 'All Luminaries'} ({matches.length})
          </button>
          <button
            onClick={() => setSelectedCategory('spiritual')}
            className={`oj-tab-pill ${selectedCategory === 'spiritual' ? 'is-active' : ''}`}
            style={{ fontSize: '12px', padding: '5px 12px' }}
          >
            {isHi ? 'आध्यात्म व दर्शन' : 'Spiritual Masters'}
          </button>
          <button
            onClick={() => setSelectedCategory('science_tech')}
            className={`oj-tab-pill ${selectedCategory === 'science_tech' ? 'is-active' : ''}`}
            style={{ fontSize: '12px', padding: '5px 12px' }}
          >
            {isHi ? 'विज्ञान व नवाचार' : 'Science & Tech'}
          </button>
          <button
            onClick={() => setSelectedCategory('leadership')}
            className={`oj-tab-pill ${selectedCategory === 'leadership' ? 'is-active' : ''}`}
            style={{ fontSize: '12px', padding: '5px 12px' }}
          >
            {isHi ? 'विश्व नेतृत्व' : 'World Leaders'}
          </button>
          <button
            onClick={() => setSelectedCategory('business_wealth')}
            className={`oj-tab-pill ${selectedCategory === 'business_wealth' ? 'is-active' : ''}`}
            style={{ fontSize: '12px', padding: '5px 12px' }}
          >
            {isHi ? 'उद्योग व समृद्धि' : 'Enterprise & Wealth'}
          </button>
          <button
            onClick={() => setSelectedCategory('art_culture')}
            className={`oj-tab-pill ${selectedCategory === 'art_culture' ? 'is-active' : ''}`}
            style={{ fontSize: '12px', padding: '5px 12px' }}
          >
            {isHi ? 'कला व सिनेमा' : 'Art & Literature'}
          </button>
          <button
            onClick={() => setSelectedCategory('sports_legend')}
            className={`oj-tab-pill ${selectedCategory === 'sports_legend' ? 'is-active' : ''}`}
            style={{ fontSize: '12px', padding: '5px 12px' }}
          >
            {isHi ? 'खेल दिग्गज' : 'Sports Legends'}
          </button>
        </div>
      </div>

      {/* Results Count Banner */}
      <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '14px', fontWeight: 500 }}>
        {isHi
          ? `कुल ${filteredMatches.length} प्रामाणिक व्यक्तित्व आपकी खोज से मेल खाते हैं`
          : `Showing ${filteredMatches.length} verified benchmark charts`}
      </div>

      {/* Grid of Matches */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
        {filteredMatches.map((m) => {
          const isLagnaMatch = m.celebrity.ascSignIndex === nativeAscSign;
          const isMoonMatch = m.celebrity.moonSignIndex === nativeMoonSign;
          const isMilestonesOpen = !!expandedMilestones[m.celebrity.id];

          return (
            <div
              key={m.celebrity.id}
              className="oj-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 2px 5px rgba(0,0,0,0.04)',
                border: isLagnaMatch ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                borderRadius: '10px',
                background: '#ffffff',
                padding: '16px',
              }}
            >
              <div>
                {/* Header with Details */}
                <div style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h3
                          style={{
                            margin: 0,
                            fontSize: '16px',
                            fontWeight: 'bold',
                            color: '#1e293b',
                            lineHeight: 1.2,
                          }}
                        >
                          {isHi ? m.celebrity.nameHi : m.celebrity.nameEn}
                        </h3>
                        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                          {isHi ? m.celebrity.categoryTitleHi : m.celebrity.categoryTitleEn}
                        </div>
                      </div>

                      <div
                        style={{
                          background: m.similarityScore >= 75 ? '#dcfce7' : m.similarityScore >= 55 ? '#fef9c3' : '#f1f5f9',
                          color: m.similarityScore >= 75 ? '#15803d' : m.similarityScore >= 55 ? '#854d0e' : '#475569',
                          padding: '3px 8px',
                          borderRadius: '12px',
                          fontWeight: 700,
                          fontSize: '12px',
                          flexShrink: 0,
                          marginLeft: '6px',
                        }}
                      >
                        {m.similarityScore}%
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                      <span
                        style={{
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          fontSize: '10px',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          color: '#475569',
                        }}
                      >
                        Rodden {m.celebrity.roddenRating}
                      </span>
                      <span
                        style={{
                          background: isLagnaMatch ? '#eff6ff' : '#f8fafc',
                          border: isLagnaMatch ? '1px solid #bfdbfe' : '1px solid #e2e8f0',
                          color: isLagnaMatch ? '#1d4ed8' : '#475569',
                          fontSize: '10px',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontWeight: isLagnaMatch ? 600 : 400,
                        }}
                      >
                        {isHi ? 'लग्न:' : 'Lagna:'} {isHi ? SIGNS_HI[m.celebrity.ascSignIndex] : SIGNS[m.celebrity.ascSignIndex].name}
                      </span>
                      <span
                        style={{
                          background: isMoonMatch ? '#eff6ff' : '#f8fafc',
                          border: isMoonMatch ? '1px solid #bfdbfe' : '1px solid #e2e8f0',
                          color: isMoonMatch ? '#1d4ed8' : '#475569',
                          fontSize: '10px',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontWeight: isMoonMatch ? 600 : 400,
                        }}
                      >
                        {isHi ? 'चंद्र:' : 'Moon:'} {isHi ? SIGNS_HI[m.celebrity.moonSignIndex] : SIGNS[m.celebrity.moonSignIndex].name}
                      </span>
                    </div>
                  </div>

                {/* Quote */}
                <div style={{ fontSize: '11px', color: '#475569', fontStyle: 'italic', marginBottom: '10px' }}>
                  &ldquo;{isHi ? m.celebrity.quoteHi : m.celebrity.quoteEn}&rdquo;
                </div>

                {/* Shared Yogas */}
                {m.sharedYogas.length > 0 && (
                  <div style={{ marginBottom: '8px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: '#0f172a', marginBottom: '3px' }}>
                      {isHi ? 'साझा राजयोग व विशिष्ट योग:' : 'Shared Classical Yogas:'}
                    </div>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {(isHi ? m.sharedYogasHi : m.sharedYogas).map((y, idx) => (
                        <span
                          key={idx}
                          style={{
                            background: '#fef3c7',
                            border: '1px solid #fde68a',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '10px',
                            color: '#92400e',
                            fontWeight: 500,
                          }}
                        >
                          {y}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Shared Placements */}
                {m.sharedPlacements.length > 0 && (
                  <div style={{ marginBottom: '8px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: '#0f172a', marginBottom: '3px' }}>
                      {isHi ? 'साझा ग्रह स्थिति:' : 'Shared Planetary Houses:'}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      {m.sharedPlacements.slice(0, 2).map((p, idx) => (
                        <div key={idx} style={{ fontSize: '11px', color: '#475569' }}>
                          • {isHi ? p.descriptionHi : p.descriptionEn}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Astrological Synergy snippet */}
                <div
                  style={{
                    background: '#f8fafc',
                    padding: '8px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    color: '#334155',
                    marginBottom: '8px',
                    lineHeight: 1.4,
                  }}
                >
                  <strong>{isHi ? 'ज्योतिषीय सादृश्य:' : 'Synergy:'}</strong>{' '}
                  {isHi ? m.astrologicalSynergyHi : m.astrologicalSynergyEn}
                </div>

                {/* Milestone Toggle */}
                {m.celebrity.keyLifeMilestones && m.celebrity.keyLifeMilestones.length > 0 && (
                  <div style={{ marginBottom: '8px' }}>
                    <button
                      onClick={() => toggleMilestones(m.celebrity.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#0284c7',
                        fontSize: '11px',
                        cursor: 'pointer',
                        padding: 0,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontWeight: 600,
                      }}
                    >
                      <span>
                        {isHi
                          ? isMilestonesOpen
                            ? 'जीवन की प्रमुख उपलब्धियां छिपाएं'
                            : 'जीवन की प्रमुख उपलब्धियां देखें'
                          : isMilestonesOpen
                            ? 'Hide Key Life Milestones'
                            : 'View Key Life Milestones'}
                      </span>
                      {isMilestonesOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    </button>

                    {isMilestonesOpen && (
                      <div
                        style={{
                          marginTop: '6px',
                          padding: '8px',
                          background: '#f0f9ff',
                          borderRadius: '6px',
                          border: '1px solid #bae6fd',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '4px',
                        }}
                      >
                        {m.celebrity.keyLifeMilestones.map((km, kIdx) => (
                          <div key={kIdx} style={{ fontSize: '10.5px', color: '#0369a1' }}>
                            <strong>{isHi ? `आयु ${km.age} वर्ष:` : `Age ${km.age}:`}</strong>{' '}
                            {isHi ? km.eventHi : km.eventEn}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons & Guidance */}
              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '8px', marginTop: '4px' }}>
                <div style={{ fontSize: '11px', color: '#0369a1', marginBottom: '8px' }}>
                  <strong>{isHi ? 'जातक हेतु सीख:' : 'Key Takeaway:'}</strong>{' '}
                  {isHi ? m.nativeGuidanceHi : m.nativeGuidanceEn}
                </div>

                <button
                  onClick={() => setComparingMatch(m)}
                  className="oj-action-btn no-print"
                  style={{
                    width: '100%',
                    padding: '6px 10px',
                    fontSize: '11px',
                    background: '#f8fafc',
                    color: '#0f172a',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    fontWeight: 600,
                  }}
                >
                  <Maximize2 size={12} />
                  <span>{isHi ? 'दोनों कुंडलियों की आमने-सामने तुलना' : 'Compare Side-by-Side Dual Charts'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dual Kundli Comparison Modal */}
      {comparingMatch && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            backdropFilter: 'blur(3px)',
          }}
          onClick={() => setComparingMatch(null)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              maxWidth: '840px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '22px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #e2e8f0',
                paddingBottom: '12px',
                marginBottom: '16px',
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#0f172a' }}>
                  {isHi ? 'द्वैत कुंडली सादृश्य तुलना (Dual Kundli Synastry)' : 'Dual Kundli Synastry Comparison'}
                </h3>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                  {isHi ? 'आपकी जन्म कुंडली बनाम ' : 'Your Natal Chart vs '}
                  <strong>{isHi ? comparingMatch.celebrity.nameHi : comparingMatch.celebrity.nameEn}</strong> (
                  {comparingMatch.similarityScore}% {isHi ? 'सादृश्य' : 'Match'})
                </div>
              </div>
              <button
                onClick={() => setComparingMatch(null)}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px',
                  cursor: 'pointer',
                  color: '#64748b',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Side by Side Comparison Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '16px',
                marginBottom: '18px',
              }}
            >
              {/* Native's Chart Card */}
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  padding: '14px',
                }}
              >
                <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#1e293b', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>
                  {isHi ? 'आपकी जन्म कुंडली (Native)' : 'Your Horoscope (Native)'}
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>{isHi ? 'लग्न राशि:' : 'Ascendant (Lagna):'}</span>
                    <strong>{isHi ? SIGNS_HI[nativeAscSign] : SIGNS[nativeAscSign].name} ({SIGNS[nativeAscSign].sanskrit})</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>{isHi ? 'चंद्र राशि:' : 'Moon Sign (Rashi):'}</span>
                    <strong>{isHi ? SIGNS_HI[nativeMoonSign] : SIGNS[nativeMoonSign].name} ({SIGNS[nativeMoonSign].sanskrit})</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>{isHi ? 'सूर्य राशि:' : 'Sun Sign:'}</span>
                    <strong>{isHi ? SIGNS_HI[nativeSunSign] : SIGNS[nativeSunSign].name} ({SIGNS[nativeSunSign].sanskrit})</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>{isHi ? 'दशम भाव (कर्म):' : '10th House (Karma):'}</span>
                    <strong>{isHi ? SIGNS_HI[(nativeAscSign + 9) % 12] : SIGNS[(nativeAscSign + 9) % 12].name}</strong>
                  </div>
                </div>

                <div style={{ marginTop: '12px', borderTop: '1px dashed #cbd5e1', paddingTop: '8px', fontSize: '11px', color: '#475569' }}>
                  <strong>{isHi ? 'सक्रिय राजयोग:' : 'Active Classical Yogas:'}</strong>
                  <div style={{ marginTop: '4px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {(isHi ? comparingMatch.sharedYogasHi : comparingMatch.sharedYogas).map((y, idx) => (
                      <span key={idx} style={{ background: '#fef3c7', padding: '2px 6px', borderRadius: '4px', color: '#92400e', fontWeight: 600 }}>
                        {y}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Celebrity's Chart Card */}
              <div
                style={{
                  background: '#fffbeb',
                  border: '1px solid #fde68a',
                  borderRadius: '8px',
                  padding: '14px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', borderBottom: '1px solid #fef08a', paddingBottom: '6px' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '14px', color: '#78350f' }}>
                      {isHi ? comparingMatch.celebrity.nameHi : comparingMatch.celebrity.nameEn}
                    </h4>
                    <span style={{ fontSize: '10px', color: '#92400e' }}>
                      Rodden {comparingMatch.celebrity.roddenRating} Verified
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#78350f' }}>{isHi ? 'लग्न राशि:' : 'Ascendant (Lagna):'}</span>
                    <strong style={{ color: comparingMatch.celebrity.ascSignIndex === nativeAscSign ? '#15803d' : '#78350f' }}>
                      {isHi ? SIGNS_HI[comparingMatch.celebrity.ascSignIndex] : SIGNS[comparingMatch.celebrity.ascSignIndex].name}
                      {comparingMatch.celebrity.ascSignIndex === nativeAscSign && (isHi ? ' (समान)' : ' (Match)')}
                    </strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#78350f' }}>{isHi ? 'चंद्र राशि:' : 'Moon Sign (Rashi):'}</span>
                    <strong style={{ color: comparingMatch.celebrity.moonSignIndex === nativeMoonSign ? '#15803d' : '#78350f' }}>
                      {isHi ? SIGNS_HI[comparingMatch.celebrity.moonSignIndex] : SIGNS[comparingMatch.celebrity.moonSignIndex].name}
                      {comparingMatch.celebrity.moonSignIndex === nativeMoonSign && (isHi ? ' (समान)' : ' (Match)')}
                    </strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#78350f' }}>{isHi ? 'सूर्य राशि:' : 'Sun Sign:'}</span>
                    <strong style={{ color: comparingMatch.celebrity.sunSignIndex === nativeSunSign ? '#15803d' : '#78350f' }}>
                      {isHi ? SIGNS_HI[comparingMatch.celebrity.sunSignIndex] : SIGNS[comparingMatch.celebrity.sunSignIndex].name}
                    </strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#78350f' }}>{isHi ? 'दशम भाव (कर्म):' : '10th House (Karma):'}</span>
                    <strong>{isHi ? SIGNS_HI[(comparingMatch.celebrity.ascSignIndex + 9) % 12] : SIGNS[(comparingMatch.celebrity.ascSignIndex + 9) % 12].name}</strong>
                  </div>
                </div>

                <div style={{ marginTop: '12px', borderTop: '1px dashed #fde68a', paddingTop: '8px', fontSize: '11px', color: '#78350f' }}>
                  <strong>{isHi ? 'प्रमुख शास्त्रीय योग:' : 'Prominent Yogas:'}</strong>
                  <div style={{ marginTop: '4px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {(isHi ? comparingMatch.celebrity.prominentYogasHi : comparingMatch.celebrity.prominentYogas).map((y, idx) => (
                      <span key={idx} style={{ background: '#ffffff', border: '1px solid #fef08a', padding: '2px 6px', borderRadius: '4px', color: '#854d0e' }}>
                        {y}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Shared Planetary Houses in Detail */}
            {comparingMatch.sharedPlacements.length > 0 && (
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', marginBottom: '14px', border: '1px solid #e2e8f0' }}>
                <h5 style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#0f172a' }}>
                  {isHi ? 'सटीक साझा ग्रह स्थिति एवं भाव सामंजस्य:' : 'Exact Shared Planetary House Placements:'}
                </h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {comparingMatch.sharedPlacements.map((p, idx) => (
                    <div key={idx} style={{ fontSize: '11px', color: '#334155' }}>
                      • <strong>भाव {p.house} ({p.planet}):</strong> {isHi ? p.descriptionHi : p.descriptionEn}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Life Milestones Timeline */}
            <div style={{ background: '#f0fdf4', padding: '12px', borderRadius: '8px', border: '1px solid #bbf7d0', marginBottom: '14px' }}>
              <h5 style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#166534' }}>
                {isHi ? 'जीवन की प्रमुख उपलब्धियां एवं कालखंड (Life Milestone Timeline):' : 'Key Milestone Timeline & Manifestation:'}
              </h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {comparingMatch.celebrity.keyLifeMilestones.map((km, idx) => (
                  <div key={idx} style={{ fontSize: '11px', color: '#14532d' }}>
                    <strong>{isHi ? `आयु ${km.age} वर्ष:` : `Age ${km.age}:`}</strong> {isHi ? km.eventHi : km.eventEn}
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Close Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setComparingMatch(null)}
                style={{
                  background: '#0f172a',
                  color: '#ffffff',
                  padding: '7px 18px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '12px',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                {isHi ? 'बंद करें' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CelebrityTwinView;
