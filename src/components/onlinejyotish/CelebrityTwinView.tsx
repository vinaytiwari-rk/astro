import React, { useMemo, useState } from 'react';
import {
  Award,
  BookOpen,
  Briefcase,
  CheckCircle2,
  Compass,
  DollarSign,
  Flame,
  Globe,
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
  findCelebrityTwins,
  type CelebrityProfile,
  type CelebrityTwinMatch,
} from '../../astro/celebrityTwins';
import type { ChartData } from '../../astro/types';
import { useLanguage } from '../../i18n/LanguageContext';

interface CelebrityTwinViewProps {
  chart: ChartData;
  onNavigate?: (view: string) => void;
}

export const CelebrityTwinView: React.FC<CelebrityTwinViewProps> = ({ chart, onNavigate }) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';

  const [selectedCategory, setSelectedCategory] = useState<
    'all' | 'spiritual' | 'science_tech' | 'leadership' | 'business_wealth' | 'art_culture'
  >('all');

  const matches: CelebrityTwinMatch[] = useMemo(() => {
    return findCelebrityTwins(chart);
  }, [chart]);

  const filteredMatches = useMemo(() => {
    if (selectedCategory === 'all') return matches;
    return matches.filter((m) => m.celebrity.category === selectedCategory);
  }, [matches, selectedCategory]);

  const topMatch = matches[0];

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
          {isHi ? 'सेलिब्रिटी कुंडली ट्विन (वैश्विक महापुरुषों से सादृश्य)' : 'Celebrity Kundli Twin Matcher'}
        </span>
      </nav>

      {/* Header Card */}
      <div className="oj-page-header-card">
        <div className="oj-header-badge">
          {isHi
            ? 'रॉडेन एए-रेटेड प्रामाणिक जन्म समय एवं शास्त्रीय योग सादृश्य विश्लेषण'
            : 'Rodden AA-Rated Historical Charts & Classical Planetary Yoga Synastry'}
        </div>
        <h1 className="oj-page-title">
          {isHi
            ? 'सेलिब्रिटी कुंडली ट्विन: ऐतिहासिक व्यक्तित्वों से आपकी कुंडली का मिलान'
            : 'Celebrity Kundli Twin: Benchmark Horoscope Synergy'}
        </h1>
        <p className="oj-page-subtitle">
          {isHi
            ? 'आपकी लग्न, चंद्र राशि, दशम भाव (कर्म) एवं सक्रिय राजयोगों की तुलना विश्व के शीर्ष युगद्रष्टाओं, वैज्ञानिकों, उद्योगपतियों एवं विचारकों की प्रामाणिक कुंडलियों से कर जानिए कि किस महापुरुष की ग्रहीय संरचना आपकी चेतना से मेल खाती है।'
            : 'Analyze which historical icons, scientists, philosophers, and industry leaders share your planetary matrix, Ascendant, Moon sign, and classical Yogas.'}
        </p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
          <button
            onClick={() => window.print()}
            className="oj-action-btn no-print"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Printer size={15} />
            <span>{isHi ? 'ट्विन रिपोर्ट प्रिंट करें' : 'Print Twin Report'}</span>
          </button>
        </div>
      </div>

      {/* Top Twin Highlight */}
      {topMatch && (
        <div
          className="oj-card"
          style={{
            background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
            border: '2px solid #f59e0b',
            marginBottom: '20px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  background: '#d97706',
                  color: '#ffffff',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontWeight: 'bold',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Star size={14} fill="#ffffff" />
                <span>{isHi ? 'सर्वोच्च कुंडली सादृश्य' : 'Prime Kundli Twin'}</span>
              </div>
              <span style={{ fontSize: '12px', color: '#92400e', fontWeight: 600 }}>
                {isHi ? topMatch.celebrity.categoryTitleHi : topMatch.celebrity.categoryTitleEn}
              </span>
            </div>
            <div
              style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#b45309',
                background: '#ffffff',
                padding: '4px 14px',
                borderRadius: '8px',
                border: '1px solid #fde68a',
              }}
            >
              {topMatch.similarityScore}% {isHi ? 'सादृश्य' : 'Match'}
            </div>
          </div>

          <div style={{ marginTop: '14px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#78350f', margin: '0 0 6px 0' }}>
              {isHi ? topMatch.celebrity.nameHi : topMatch.celebrity.nameEn}
            </h2>
            <div style={{ fontSize: '13px', color: '#92400e', fontStyle: 'italic', marginBottom: '12px' }}>
              &ldquo;{isHi ? topMatch.celebrity.quoteHi : topMatch.celebrity.quoteEn}&rdquo;
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
              <div style={{ background: '#ffffff', padding: '10px', borderRadius: '8px', border: '1px solid #fef08a' }}>
                <div style={{ fontWeight: 600, fontSize: '12px', color: '#854d0e', marginBottom: '4px' }}>
                  {isHi ? 'ग्रहीय एकात्मता व शास्त्रीय योग' : 'Astrological Synergy & Shared Yogas'}
                </div>
                <div style={{ fontSize: '12px', color: '#451a03' }}>
                  {isHi ? topMatch.astrologicalSynergyHi : topMatch.astrologicalSynergyEn}
                </div>
              </div>

              <div style={{ background: '#ffffff', padding: '10px', borderRadius: '8px', border: '1px solid #fef08a' }}>
                <div style={{ fontWeight: 600, fontSize: '12px', color: '#854d0e', marginBottom: '4px' }}>
                  {isHi ? 'जातक हेतु प्रेरणा व जीवन मार्गदर्शन' : 'Practical Life Guidance for Native'}
                </div>
                <div style={{ fontSize: '12px', color: '#451a03' }}>
                  {isHi ? topMatch.nativeGuidanceHi : topMatch.nativeGuidanceEn}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
        <button
          onClick={() => setSelectedCategory('all')}
          className={`oj-tab-pill ${selectedCategory === 'all' ? 'is-active' : ''}`}
        >
          {isHi ? 'समस्त व्यक्तित्व' : 'All Luminaries'} ({matches.length})
        </button>
        <button
          onClick={() => setSelectedCategory('spiritual')}
          className={`oj-tab-pill ${selectedCategory === 'spiritual' ? 'is-active' : ''}`}
        >
          {isHi ? 'आध्यात्म व दर्शन' : 'Spiritual Masters'}
        </button>
        <button
          onClick={() => setSelectedCategory('science_tech')}
          className={`oj-tab-pill ${selectedCategory === 'science_tech' ? 'is-active' : ''}`}
        >
          {isHi ? 'विज्ञान व नवाचार' : 'Science & Tech'}
        </button>
        <button
          onClick={() => setSelectedCategory('leadership')}
          className={`oj-tab-pill ${selectedCategory === 'leadership' ? 'is-active' : ''}`}
        >
          {isHi ? 'राष्ट्र नेतृत्व' : 'World Leaders'}
        </button>
        <button
          onClick={() => setSelectedCategory('business_wealth')}
          className={`oj-tab-pill ${selectedCategory === 'business_wealth' ? 'is-active' : ''}`}
        >
          {isHi ? 'व्यापार व समृद्धि' : 'Enterprise & Wealth'}
        </button>
        <button
          onClick={() => setSelectedCategory('art_culture')}
          className={`oj-tab-pill ${selectedCategory === 'art_culture' ? 'is-active' : ''}`}
        >
          {isHi ? 'कला व साहित्य' : 'Art & Literature'}
        </button>
      </div>

      {/* Grid of Matches */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
        {filteredMatches.map((m) => (
          <div
            key={m.celebrity.id}
            className="oj-card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              border: '1px solid #e2e8f0',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#1e293b' }}>
                    {isHi ? m.celebrity.nameHi : m.celebrity.nameEn}
                  </h3>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                    {isHi ? m.celebrity.categoryTitleHi : m.celebrity.categoryTitleEn}
                  </div>
                </div>
                <div
                  style={{
                    background: m.similarityScore >= 70 ? '#dcfce7' : m.similarityScore >= 50 ? '#fef9c3' : '#f1f5f9',
                    color: m.similarityScore >= 70 ? '#15803d' : m.similarityScore >= 50 ? '#854d0e' : '#475569',
                    padding: '3px 8px',
                    borderRadius: '12px',
                    fontWeight: 700,
                    fontSize: '12px',
                  }}
                >
                  {m.similarityScore}%
                </div>
              </div>

              <div style={{ fontSize: '11px', color: '#475569', fontStyle: 'italic', marginBottom: '10px' }}>
                &ldquo;{isHi ? m.celebrity.quoteHi : m.celebrity.quoteEn}&rdquo;
              </div>

              {/* Shared Yogas */}
              {m.sharedYogas.length > 0 && (
                <div style={{ marginBottom: '10px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: '#0f172a', marginBottom: '4px' }}>
                    {isHi ? 'साझा राजयोग व विशिष्ट योग:' : 'Shared Classical Yogas:'}
                  </div>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {(isHi ? m.sharedYogasHi : m.sharedYogas).map((y, idx) => (
                      <span
                        key={idx}
                        style={{
                          background: '#f8fafc',
                          border: '1px solid #cbd5e1',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '10px',
                          color: '#334155',
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
                <div style={{ marginBottom: '10px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: '#0f172a', marginBottom: '4px' }}>
                    {isHi ? 'साझा ग्रह स्थिति:' : 'Shared Planetary Houses:'}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    {m.sharedPlacements.map((p, idx) => (
                      <div key={idx} style={{ fontSize: '11px', color: '#475569' }}>
                        • {isHi ? p.descriptionHi : p.descriptionEn}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Astrological Synergy */}
              <div style={{ background: '#f8fafc', padding: '8px', borderRadius: '6px', fontSize: '11px', color: '#334155', marginBottom: '10px' }}>
                <strong>{isHi ? 'ज्योतिषीय सादृश्य:' : 'Synergy:'}</strong> {isHi ? m.astrologicalSynergyHi : m.astrologicalSynergyEn}
              </div>
            </div>

            {/* Native Guidance */}
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '8px', fontSize: '11px', color: '#0369a1' }}>
              <strong>{isHi ? 'जातक हेतु सीख:' : 'Key Takeaway:'}</strong> {isHi ? m.nativeGuidanceHi : m.nativeGuidanceEn}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CelebrityTwinView;
