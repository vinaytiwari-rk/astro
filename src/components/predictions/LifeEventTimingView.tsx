import React, { useMemo, useState } from 'react';
import {
  Award,
  BookOpen,
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  DollarSign,
  Flame,
  Globe,
  Heart,
  Home,
  Info,
  MapPin,
  Printer,
  Shield,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react';
import {
  computeLifeEventTiming,
  type EventTimingWindow,
  type LifeEventCategory,
  type LifeEventTimingReport,
} from '../../astro/predictions/lifeEventTimingEngine';
import type { ChartData } from '../../astro/types';
import { useLanguage } from '../../i18n/LanguageContext';

interface LifeEventTimingViewProps {
  chart: ChartData;
  onNavigate?: (view: string) => void;
}

export const LifeEventTimingView: React.FC<LifeEventTimingViewProps> = ({ chart, onNavigate }) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';

  const [selectedCategory, setSelectedCategory] = useState<LifeEventCategory | 'all'>('all');
  const [timelineMode, setTimelineMode] = useState<'upcoming' | 'all'>('upcoming');

  const report: LifeEventTimingReport = useMemo(() => {
    return computeLifeEventTiming(chart);
  }, [chart]);

  const displayedEvents = useMemo(() => {
    const list = timelineMode === 'upcoming' ? report.upcomingEvents : report.eventChronology;
    if (selectedCategory === 'all') return list;
    return list.filter((e) => e.category === selectedCategory);
  }, [report, timelineMode, selectedCategory]);

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
          {isHi ? 'जीवन घटना-काल निर्धारण (सटीक टाइमिंग इंजन)' : 'Life Event Timing Engine'}
        </span>
      </nav>

      {/* Header Card */}
      <div className="oj-page-header-card">
        <div className="oj-header-badge">
          {isHi
            ? 'विंशोत्तरी दशा, भावेश, नवमांश-दशमांश एवं गोचर त्रिकोणीय मिलान'
            : 'Triangulation of Vimshottari Dasha, Divisional Charts (D9/D10) & Transit Triggers'}
        </div>
        <h1 className="oj-page-title">
          {isHi
            ? 'सटीक घटना-काल निर्धारण: जीवन में कब क्या घटित होगा?'
            : 'Exact Life Event Timing: The Master Chronology'}
        </h1>
        <p className="oj-page-subtitle">
          {isHi
            ? 'विवाह, संतान प्राप्ति, कॅरियर में पदोन्नति, विदेश यात्रा, संपत्ति क्रय एवं स्वास्थ्य संकट के सटीक कालखंडों का बिना किसी लाग-लपेट के प्रामाणिक शास्त्रीय विश्लेषण।'
            : 'Unvarnished, precise astrological timing windows for marriage, progeny, professional elevation, international relocation, property purchase, and health milestones.'}
        </p>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', marginTop: '14px' }}>
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: 600,
              color: '#0f172a',
            }}
          >
            {isHi ? `वर्तमान आयु: ${report.currentAge} वर्ष` : `Current Native Age: ${report.currentAge} Years`}
          </div>

          <button
            onClick={() => window.print()}
            className="oj-action-btn no-print"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Printer size={15} />
            <span>{isHi ? 'समय-सारणी प्रिंट करें' : 'Print Timeline'}</span>
          </button>
        </div>
      </div>

      {/* Mode & Category Filter Bar */}
      <div className="oj-card" style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          {/* Upcoming vs Full Life Timeline */}
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => setTimelineMode('upcoming')}
              className={`oj-tab-pill ${timelineMode === 'upcoming' ? 'is-active' : ''}`}
            >
              {isHi ? 'आगामी व वर्तमान घटनाएं' : 'Current & Upcoming'} ({report.upcomingEvents.length})
            </button>
            <button
              onClick={() => setTimelineMode('all')}
              className={`oj-tab-pill ${timelineMode === 'all' ? 'is-active' : ''}`}
            >
              {isHi ? 'संपूर्ण जीवन काल-क्रम' : 'Full Life Chronology'} ({report.eventChronology.length})
            </button>
          </div>

          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`oj-tab-pill ${selectedCategory === 'all' ? 'is-active' : ''}`}
              style={{ fontSize: '11px', padding: '4px 8px' }}
            >
              {isHi ? 'सभी' : 'All'}
            </button>
            <button
              onClick={() => setSelectedCategory('marriage')}
              className={`oj-tab-pill ${selectedCategory === 'marriage' ? 'is-active' : ''}`}
              style={{ fontSize: '11px', padding: '4px 8px' }}
            >
              {isHi ? 'विवाह' : 'Marriage'}
            </button>
            <button
              onClick={() => setSelectedCategory('career_promotion')}
              className={`oj-tab-pill ${selectedCategory === 'career_promotion' ? 'is-active' : ''}`}
              style={{ fontSize: '11px', padding: '4px 8px' }}
            >
              {isHi ? 'कॅरियर' : 'Career'}
            </button>
            <button
              onClick={() => setSelectedCategory('childbirth')}
              className={`oj-tab-pill ${selectedCategory === 'childbirth' ? 'is-active' : ''}`}
              style={{ fontSize: '11px', padding: '4px 8px' }}
            >
              {isHi ? 'संतान' : 'Childbirth'}
            </button>
            <button
              onClick={() => setSelectedCategory('foreign_settlement')}
              className={`oj-tab-pill ${selectedCategory === 'foreign_settlement' ? 'is-active' : ''}`}
              style={{ fontSize: '11px', padding: '4px 8px' }}
            >
              {isHi ? 'विदेश' : 'Foreign'}
            </button>
            <button
              onClick={() => setSelectedCategory('property_vehicle')}
              className={`oj-tab-pill ${selectedCategory === 'property_vehicle' ? 'is-active' : ''}`}
              style={{ fontSize: '11px', padding: '4px 8px' }}
            >
              {isHi ? 'संपत्ति' : 'Property'}
            </button>
            <button
              onClick={() => setSelectedCategory('wealth_windfall')}
              className={`oj-tab-pill ${selectedCategory === 'wealth_windfall' ? 'is-active' : ''}`}
              style={{ fontSize: '11px', padding: '4px 8px' }}
            >
              {isHi ? 'धन लाभ' : 'Wealth'}
            </button>
            <button
              onClick={() => setSelectedCategory('health_crisis')}
              className={`oj-tab-pill ${selectedCategory === 'health_crisis' ? 'is-active' : ''}`}
              style={{ fontSize: '11px', padding: '4px 8px' }}
            >
              {isHi ? 'स्वास्थ्य सतर्कता' : 'Health Alert'}
            </button>
          </div>
        </div>
      </div>

      {/* Events Timeline List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {displayedEvents.map((evt) => {
          const isCurrentActive = report.currentAge >= evt.startAge && report.currentAge <= evt.endAge;

          const categoryColor =
            evt.category === 'marriage'
              ? '#ec4899'
              : evt.category === 'career_promotion'
              ? '#3b82f6'
              : evt.category === 'childbirth'
              ? '#10b981'
              : evt.category === 'foreign_settlement'
              ? '#8b5cf6'
              : evt.category === 'property_vehicle'
              ? '#d97706'
              : evt.category === 'wealth_windfall'
              ? '#059669'
              : '#dc2626';

          return (
            <div
              key={evt.id}
              className="oj-card"
              style={{
                borderLeft: `5px solid ${categoryColor}`,
                background: isCurrentActive ? '#fefce8' : '#ffffff',
                boxShadow: isCurrentActive ? '0 4px 12px rgba(234, 179, 8, 0.2)' : '0 1px 3px rgba(0,0,0,0.05)',
              }}
            >
              {/* Card Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        background: categoryColor,
                        color: '#ffffff',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                      }}
                    >
                      {isHi ? evt.categoryTitleHi : evt.categoryTitleEn}
                    </span>
                    {isCurrentActive && (
                      <span
                        style={{
                          background: '#fef08a',
                          color: '#854d0e',
                          border: '1px solid #facc15',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '10px',
                          fontWeight: 'bold',
                        }}
                      >
                        {isHi ? 'वर्तमान में सक्रिय' : 'Currently Active'}
                      </span>
                    )}
                  </div>
                  <h3 style={{ margin: '6px 0 0 0', fontSize: '16px', color: '#0f172a' }}>
                    {isHi ? evt.manifestationHi : evt.manifestationEn}
                  </h3>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#1e293b' }}>
                    {isHi ? `आयु ${evt.startAge} से ${evt.endAge} वर्ष` : `Age ${evt.startAge} to ${evt.endAge}`}
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                    {evt.startDate} से {evt.endDate}
                  </div>
                  <div
                    style={{
                      display: 'inline-block',
                      background: evt.probabilityScore >= 88 ? '#dcfce7' : '#f1f5f9',
                      color: evt.probabilityScore >= 88 ? '#15803d' : '#475569',
                      padding: '2px 6px',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontWeight: 700,
                      marginTop: '4px',
                    }}
                  >
                    {evt.probabilityScore}% {isHi ? 'प्रबलता' : 'Probability'} ({isHi ? evt.intensityHi : evt.intensity})
                  </div>
                </div>
              </div>

              {/* Dasha & Astrological Basis */}
              <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '6px', fontSize: '12px', marginTop: '8px' }}>
                <div style={{ fontWeight: 600, color: '#334155', marginBottom: '2px' }}>
                  {isHi ? 'सक्रिय दशा वेध:' : 'Active Dasha Significators:'} {evt.dashaSignificators}
                </div>
                <div style={{ color: '#475569', marginTop: '2px' }}>
                  <strong>{isHi ? 'शास्त्रीय आधार:' : 'Astrological Basis:'}</strong> {isHi ? evt.astrologicalBasisHi : evt.astrologicalBasisEn}
                </div>
              </div>

              {/* Unvarnished Caution */}
              <div
                style={{
                  borderTop: '1px dashed #e2e8f0',
                  paddingTop: '8px',
                  marginTop: '8px',
                  fontSize: '11px',
                  color: '#b91c1c',
                }}
              >
                <strong>{isHi ? 'यथार्थवादी चेतावनी व सावधानी:' : 'Unvarnished Caution:'}</strong> {isHi ? evt.unvarnishedCautionHi : evt.unvarnishedCautionEn}
              </div>
            </div>
          );
        })}

        {displayedEvents.length === 0 && (
          <div style={{ textAlign: 'center', padding: '30px', color: '#94a3b8', fontSize: '13px' }}>
            {isHi ? 'इस श्रेणी में कोई विशिष्ट घटना कालखंड नहीं मिला।' : 'No event timing windows match your current filter.'}
          </div>
        )}
      </div>
    </div>
  );
};

export default LifeEventTimingView;
