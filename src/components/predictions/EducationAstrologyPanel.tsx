import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  Award,
  BookOpen,
  Brain,
  CheckCircle2,
  Compass,
  FileText,
  GraduationCap,
  Layers,
  Lightbulb,
  Moon,
  Search,
  Sparkles,
  Target,
  Zap,
} from 'lucide-react';
import type { ChartData } from '../../astro/types';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  computeEducationAstrologyEngine,
  type EducationAstrologyEngineReport,
  type EducationHouseInsight,
  type EducationBreakFactor,
  type EducationYogaItem,
  type AcademicTalentProfile,
  type PlanetaryStreamFit,
} from '../../astro/predictions/educationAstrologyEngine';

interface EducationAstrologyPanelProps {
  chart: ChartData;
}

type EduSectionTab =
  | 'overview'
  | 'break_rules'
  | 'yogas'
  | 'talents'
  | 'academic_streams'
  | 'moon_timeline'
  | 'remedies';

export const EducationAstrologyPanel: React.FC<EducationAstrologyPanelProps> = ({ chart }) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';

  const [activeSection, setActiveSection] = useState<EduSectionTab>('overview');
  const [selectedHouse, setSelectedHouse] = useState<number>(5);
  const [streamFilter, setStreamFilter] = useState<'all' | 'recommended'>('all');

  const report: EducationAstrologyEngineReport = useMemo(() => {
    return computeEducationAstrologyEngine(chart);
  }, [chart]);

  const scoreToneClass =
    report.overallEducationScore >= 80
      ? 'tone-high'
      : report.overallEducationScore >= 65
      ? 'tone-mid'
      : report.overallEducationScore >= 50
      ? 'tone-neutral'
      : 'tone-low';

  const riskBadgeStyle =
    report.breakRiskLevel === 'Low'
      ? { background: 'rgba(16, 185, 129, 0.15)', color: '#059669', border: '1px solid #10b981' }
      : report.breakRiskLevel === 'Moderate'
      ? { background: 'rgba(245, 158, 11, 0.15)', color: '#d97706', border: '1px solid #f59e0b' }
      : report.breakRiskLevel === 'Elevated'
      ? { background: 'rgba(239, 68, 68, 0.15)', color: '#dc2626', border: '1px solid #ef4444' }
      : { background: 'rgba(185, 28, 28, 0.25)', color: '#991b1b', border: '1px solid #991b1b' };

  const activeHouseData: EducationHouseInsight | undefined = useMemo(() => {
    return report.coreHouses.find((h) => h.houseNumber === selectedHouse) || report.coreHouses[0];
  }, [report.coreHouses, selectedHouse]);

  const displayedStreams = useMemo(() => {
    if (streamFilter === 'recommended') {
      return report.planetaryStreams.filter((s) => s.isRecommended);
    }
    return report.planetaryStreams;
  }, [report.planetaryStreams, streamFilter]);

  return (
    <div className="view-stack" style={{ gap: '20px' }}>
      {/* 1. Master Scholastic Overview Header */}
      <div
        className="card"
        style={{
          padding: '20px 24px',
          background: 'var(--bg-elevated, #ffffff)',
          border: '1px solid var(--border-color, rgba(0, 0, 0, 0.1))',
          borderRadius: '14px',
          boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            borderBottom: '1px solid var(--border-color, rgba(0,0,0,0.08))',
            paddingBottom: '16px',
            marginBottom: '16px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <GraduationCap size={22} style={{ color: '#d97706' }} />
              <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: 'var(--text)' }}>
                {isHi
                  ? 'वैदिक शिक्षा, मेधा एवं उच्च विद्या विश्लेषण (AV Astro Vibe)'
                  : 'Vedic Education, Intellect & Higher Studies Engine (AV Astro Vibe)'}
              </h2>
            </div>
            <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              {isHi
                ? 'वृहत्पाराशर, सारावली, जातक पारिजात एवं सर्वार्थ चिंतामणि आधारित प्रामाणिक शैक्षणिक मूल्यांकन'
                : 'Classical assessment synthesized from Brihat Parashara, Saravali, Jatak Parijata & Sarvaarth Chintamani'}
            </p>
          </div>

          {/* Quick Metrics */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            {/* Overall Score */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 16px',
                borderRadius: '10px',
                background: 'var(--bg-subtle, #f8fafc)',
                border: '1px solid var(--border-color, rgba(0,0,0,0.08))',
              }}
            >
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', display: 'block' }}>
                  {isHi ? 'विद्या सामर्थ्य सूचकांक' : 'Scholastic Index'}
                </span>
                <strong style={{ fontSize: '1.25rem', fontWeight: 800 }} className={scoreToneClass}>
                  {report.overallEducationScore}
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>/100</span>
                </strong>
              </div>
            </div>

            {/* Break Risk Badge */}
            <div
              style={{
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '0.85rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                ...riskBadgeStyle,
              }}
            >
              <AlertTriangle size={16} />
              <span>
                {isHi
                  ? `व्यवधान जोखिम: ${report.breakRiskLevelHi} (${report.triggeredBreakCount}/10 नियम सक्रिय)`
                  : `Hurdle Risk: ${report.breakRiskLevel} (${report.triggeredBreakCount}/10 Rules Triggered)`}
              </span>
            </div>
          </div>
        </div>

        {/* Verdict Box */}
        <div
          style={{
            padding: '12px 18px',
            borderRadius: '10px',
            background: 'rgba(217, 119, 6, 0.08)',
            borderLeft: '4px solid #d97706',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Award size={16} style={{ color: '#d97706' }} />
            <strong style={{ fontSize: '0.92rem', color: '#92400e' }}>
              {isHi ? 'शास्त्रीय फलादेश सारांश' : 'Classical Scholastic Verdict'}
            </strong>
          </div>
          <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.5, color: 'var(--text)' }}>
            {isHi ? report.overallVerdictHi : report.overallVerdictEn}
          </p>
          <p style={{ margin: '6px 0 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            {isHi ? report.breakRiskSummaryHi : report.breakRiskSummaryEn}
          </p>
        </div>
      </div>

      {/* 2. Horizontal Navigation Tabs */}
      <div
        className="card"
        style={{
          padding: '8px 12px',
          background: 'var(--bg-elevated, #ffffff)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          overflowX: 'auto',
          borderRadius: '10px',
          border: '1px solid var(--border-color, rgba(0,0,0,0.08))',
        }}
        role="tablist"
      >
        {[
          { id: 'overview', labelEn: '8 Learning Houses', labelHi: '८ विद्या भाव', icon: Layers },
          { id: 'break_rules', labelEn: '10 Break Rules', labelHi: '१० विद्या भंग नियम', icon: AlertCircle },
          { id: 'yogas', labelEn: 'Education Yogas', labelHi: 'सरस्वती व सर्वभौम योग', icon: Sparkles },
          { id: 'talents', labelEn: 'Cognitive Aptitudes', labelHi: 'मेधा व बौद्धिक क्षमता', icon: Brain },
          { id: 'academic_streams', labelEn: 'Planetary Streams & Degrees', labelHi: 'ग्रहवार संकाय व डिग्रियां', icon: Compass },
          { id: 'moon_timeline', labelEn: 'Moon Psychology & Timeline', labelHi: 'चंद्र चित्त व शिक्षा कालखंड', icon: Moon },
          { id: 'remedies', labelEn: 'Vedic Remedial Upayas', labelHi: 'शास्त्रसम्मत उपाय', icon: Lightbulb },
        ].map((tab) => {
          const isActive = activeSection === tab.id;
          const IconComp = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveSection(tab.id as EduSectionTab)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: isActive ? 700 : 500,
                fontSize: '12.5px',
                padding: '6px 12px',
                borderRadius: '6px',
                whiteSpace: 'nowrap',
              }}
            >
              <IconComp size={14} />
              <span>{isHi ? tab.labelHi : tab.labelEn}</span>
              {tab.id === 'break_rules' && report.triggeredBreakCount > 0 && (
                <span
                  style={{
                    background: '#dc2626',
                    color: '#ffffff',
                    borderRadius: '9999px',
                    padding: '1px 6px',
                    fontSize: '10px',
                    fontWeight: 800,
                    marginLeft: '2px',
                  }}
                >
                  {report.triggeredBreakCount}
                </span>
              )}
              {tab.id === 'yogas' && report.activeYogas.length > 0 && (
                <span
                  style={{
                    background: '#059669',
                    color: '#ffffff',
                    borderRadius: '9999px',
                    padding: '1px 6px',
                    fontSize: '10px',
                    fontWeight: 800,
                    marginLeft: '2px',
                  }}
                >
                  {report.activeYogas.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 3. Section Content Display */}

      {/* SECTION 1: 8 LEARNING HOUSES */}
      {activeSection === 'overview' && (
        <div className="view-stack" style={{ gap: '16px' }}>
          {/* House Selector Badges */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              overflowX: 'auto',
              paddingBottom: '4px',
            }}
          >
            {report.coreHouses.map((h) => {
              const isSelected = h.houseNumber === selectedHouse;
              return (
                <button
                  key={h.houseNumber}
                  type="button"
                  onClick={() => setSelectedHouse(h.houseNumber)}
                  className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                  style={{
                    fontWeight: isSelected ? 800 : 600,
                    padding: '8px 14px',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2px',
                    minWidth: '105px',
                  }}
                >
                  <span style={{ fontSize: '0.88rem' }}>
                    {isHi ? `${h.houseNumber}वां भाव` : `House ${h.houseNumber}`}
                  </span>
                  <span style={{ fontSize: '0.72rem', opacity: 0.85, fontWeight: 500 }}>
                    {isHi ? h.sanskritRoleHi.split(' ')[0] : h.sanskritRoleEn.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active House Detailed Inspection Card */}
          {activeHouseData && (
            <div
              className="card"
              style={{
                padding: '20px',
                background: 'var(--bg-elevated, #ffffff)',
                border: '1px solid var(--border-color, rgba(0,0,0,0.1))',
                borderRadius: '12px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px',
                  borderBottom: '1px solid var(--border-color, rgba(0,0,0,0.08))',
                  paddingBottom: '12px',
                  marginBottom: '16px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <BookOpen size={20} style={{ color: '#b45309' }} />
                    <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text)' }}>
                      {isHi ? activeHouseData.houseTitleHi : activeHouseData.houseTitleEn}
                    </h3>
                  </div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {isHi ? activeHouseData.sanskritRoleHi : activeHouseData.sanskritRoleEn}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      background: 'rgba(59, 130, 246, 0.12)',
                      color: '#2563eb',
                    }}
                  >
                    {isHi
                      ? `सर्वाष्टकवर्ग: ${activeHouseData.savBindus} रेखाएं`
                      : `SAV: ${activeHouseData.savBindus} Bindus`}
                  </span>
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      background:
                        activeHouseData.statusRating.includes('Exalted') ||
                        activeHouseData.statusRating.includes('Strong')
                          ? 'rgba(16, 185, 129, 0.15)'
                          : 'rgba(239, 68, 68, 0.15)',
                      color:
                        activeHouseData.statusRating.includes('Exalted') ||
                        activeHouseData.statusRating.includes('Strong')
                          ? '#059669'
                          : '#dc2626',
                    }}
                  >
                    {isHi ? activeHouseData.statusRatingHi : activeHouseData.statusRating}
                  </span>
                </div>
              </div>

              {/* Grid of House Properties */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '12px',
                  marginBottom: '18px',
                }}
              >
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: 'var(--bg-subtle, #f8fafc)',
                    border: '1px solid var(--border-color, rgba(0,0,0,0.06))',
                  }}
                >
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                    {isHi ? 'राशि एवं भावेश (Lord)' : 'Rasi & Bhavesha (Lord)'}
                  </span>
                  <strong style={{ fontSize: '0.92rem' }}>
                    {isHi ? activeHouseData.signNameHi : activeHouseData.signNameEn} ({activeHouseData.lord})
                  </strong>
                </div>

                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: 'var(--bg-subtle, #f8fafc)',
                    border: '1px solid var(--border-color, rgba(0,0,0,0.06))',
                  }}
                >
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                    {isHi ? 'भावेश स्थिति व गरिमा' : 'Lord Placement & Dignity'}
                  </span>
                  <strong style={{ fontSize: '0.92rem' }}>
                    {isHi ? `${activeHouseData.lordHouse}वां भाव` : `House ${activeHouseData.lordHouse}`} ·{' '}
                    {activeHouseData.lordDignity}
                  </strong>
                </div>

                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: 'var(--bg-subtle, #f8fafc)',
                    border: '1px solid var(--border-color, rgba(0,0,0,0.06))',
                  }}
                >
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                    {isHi ? 'भाव में स्थित ग्रह (Occupants)' : 'Occupants'}
                  </span>
                  <strong style={{ fontSize: '0.92rem' }}>
                    {activeHouseData.occupants.length > 0
                      ? activeHouseData.occupants.join(', ')
                      : isHi
                      ? 'कोई ग्रह स्थित नहीं (रिक्त)'
                      : 'None (Empty)'}
                  </strong>
                </div>

                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: 'var(--bg-subtle, #f8fafc)',
                    border: '1px solid var(--border-color, rgba(0,0,0,0.06))',
                  }}
                >
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                    {isHi ? 'दृष्टियां (Aspecting Planets)' : 'Aspecting Planets'}
                  </span>
                  <strong style={{ fontSize: '0.92rem' }}>
                    {activeHouseData.aspects.length > 0
                      ? activeHouseData.aspects.join(', ')
                      : isHi
                      ? 'कोई विशेष दृष्टि नहीं'
                      : 'None'}
                  </strong>
                </div>
              </div>

              {/* Manifestation Text */}
              <div
                style={{
                  padding: '14px 18px',
                  borderRadius: '10px',
                  background: 'var(--bg-subtle, #f8fafc)',
                  border: '1px solid var(--border-color, rgba(0,0,0,0.08))',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <Target size={16} style={{ color: '#059669' }} />
                  <strong style={{ fontSize: '0.9rem', color: 'var(--text)' }}>
                    {isHi ? 'शैक्षणिक फल एवं प्रभाव' : 'Scholastic Manifestation & Impact'}
                  </strong>
                </div>
                <p style={{ margin: 0, fontSize: '0.88rem', lineHeight: 1.6, color: 'var(--text)' }}>
                  {isHi
                    ? activeHouseData.educationalManifestationHi
                    : activeHouseData.educationalManifestationEn}
                </p>
              </div>
            </div>
          )}

          {/* Quick 8 Houses Overview Summary Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '12px',
            }}
          >
            {report.coreHouses.map((h) => (
              <div
                key={h.houseNumber}
                onClick={() => setSelectedHouse(h.houseNumber)}
                style={{
                  cursor: 'pointer',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  background: 'var(--bg-elevated, #ffffff)',
                  border:
                    h.houseNumber === selectedHouse
                      ? '2px solid #b45309'
                      : '1px solid var(--border-color, rgba(0,0,0,0.08))',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <strong style={{ fontSize: '0.92rem', color: 'var(--text)' }}>
                    {isHi ? h.houseTitleHi : h.houseTitleEn}
                  </strong>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#b45309' }}>
                    SAV {h.savBindus}
                  </span>
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: '0.82rem',
                    color: 'var(--text-muted)',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {isHi ? h.educationalManifestationHi : h.educationalManifestationEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: 10 CLASSICAL BREAK RULES */}
      {activeSection === 'break_rules' && (
        <div className="view-stack" style={{ gap: '16px' }}>
          <div
            className="card"
            style={{
              padding: '16px 20px',
              background: 'var(--bg-elevated, #ffffff)',
              borderRadius: '12px',
              border: '1px solid var(--border-color, rgba(0,0,0,0.08))',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <AlertCircle size={20} style={{ color: '#dc2626' }} />
              <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text)' }}>
                {isHi
                  ? 'शास्त्रीय विद्या भंग व व्यवधान के १० प्रामाणिक नियम'
                  : '10 Classical Break & Obstacle Dicta in Vedic Astrology'}
              </h3>
            </div>
            <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              {isHi
                ? 'वृहत्पाराशर, सारावली एवं जातक पारिजात अनुसार विद्या में अंतराल, विस्मृति अथवा परीक्षा में असफलता उत्पन्न करने वाले १० मुख्य योग। प्रत्येक नियम की स्थिति, तीव्रता एवं वैदिक परिहार नीचे प्रस्तुत है:'
                : 'Deterministic evaluation of the 10 classical break factors from Brihat Parashara, Saravali and Jatak Parijata. Each factor details chart status, severity and specific remedial upayas:'}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {report.breakFactors.map((bf) => {
              const isTriggered = bf.isTriggered;
              const cardBorder = isTriggered
                ? bf.severity === 'Severe'
                  ? '1px solid #dc2626'
                  : '1px solid #f59e0b'
                : '1px solid var(--border-color, rgba(0,0,0,0.08))';

              return (
                <div
                  key={bf.ruleNumber}
                  className="card"
                  style={{
                    padding: '16px 20px',
                    background: 'var(--bg-elevated, #ffffff)',
                    border: cardBorder,
                    borderRadius: '12px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '10px',
                      marginBottom: '10px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '9999px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.82rem',
                          fontWeight: 800,
                          background: isTriggered ? '#fee2e2' : '#dcfce7',
                          color: isTriggered ? '#b91c1c' : '#15803d',
                        }}
                      >
                        {bf.ruleNumber}
                      </span>
                      <strong style={{ fontSize: '0.98rem', color: 'var(--text)' }}>
                        {isHi ? bf.ruleNameHi : bf.ruleNameEn}
                      </strong>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {isTriggered ? (
                        <span
                          style={{
                            padding: '3px 10px',
                            borderRadius: '9999px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            background: bf.severity === 'Severe' ? '#fee2e2' : '#fef3c7',
                            color: bf.severity === 'Severe' ? '#dc2626' : '#d97706',
                            border: `1px solid ${bf.severity === 'Severe' ? '#ef4444' : '#f59e0b'}`,
                          }}
                        >
                          {isHi ? `सक्रिय (${bf.severity})` : `Active (${bf.severity})`}
                        </span>
                      ) : (
                        <span
                          style={{
                            padding: '3px 10px',
                            borderRadius: '9999px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            background: '#dcfce7',
                            color: '#15803d',
                            border: '1px solid #86efac',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <CheckCircle2 size={13} />
                          {isHi ? 'दोष मुक्त (सुरक्षित)' : 'Passed (Unafflicted)'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Classical Dicta Quote */}
                  <div
                    style={{
                      padding: '8px 12px',
                      borderRadius: '6px',
                      background: 'var(--bg-subtle, #f8fafc)',
                      fontSize: '0.82rem',
                      color: 'var(--text-muted)',
                      fontStyle: 'italic',
                      marginBottom: '10px',
                    }}
                  >
                    {isHi ? bf.classicalDictaHi : bf.classicalDictaEn}
                  </div>

                  {/* Manifestation */}
                  <p style={{ margin: '0 0 10px', fontSize: '0.88rem', lineHeight: 1.5, color: 'var(--text)' }}>
                    {isHi ? bf.manifestationHi : bf.manifestationEn}
                  </p>

                  {/* Remedial Upaya */}
                  <div
                    style={{
                      padding: '8px 12px',
                      borderRadius: '6px',
                      background: 'rgba(16, 185, 129, 0.08)',
                      borderLeft: '3px solid #10b981',
                      fontSize: '0.84rem',
                      color: '#065f46',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <Lightbulb size={15} style={{ flexShrink: 0 }} />
                    <span>
                      <strong>{isHi ? 'वैदिक परिहार: ' : 'Vedic Upaya: '}</strong>
                      {isHi ? bf.remedyHi : bf.remedyEn}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 3: EDUCATION YOGAS */}
      {activeSection === 'yogas' && (
        <div className="view-stack" style={{ gap: '16px' }}>
          <div
            className="card"
            style={{
              padding: '16px 20px',
              background: 'var(--bg-elevated, #ffffff)',
              borderRadius: '12px',
              border: '1px solid var(--border-color, rgba(0,0,0,0.08))',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Sparkles size={20} style={{ color: '#d97706' }} />
              <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text)' }}>
                {isHi
                  ? 'सर्वभौम, सरस्वती एवं उच्च मेधा योग'
                  : 'Sarvabhouma, Saraswati & Higher Learning Yogas'}
              </h3>
            </div>
            <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              {isHi
                ? 'पंचम-नवम संबंध (सर्वभौम योग), कलानिधि योग, ब्रह्म योग, सरस्वती योग एवं भद्र महापुरुष योग जैसे शास्त्रीय योग जातक को अप्रतिम मेधा, पदक, स्वर्ण पदक एवं उच्च शैक्षणिक प्रतिष्ठा प्रदान करते हैं:'
                : 'Classical auspicious learning yogas from Parashara, Jatak Parijata and Saravali. Sarvabhouma (5th & 9th lords connection), Kalanithi, Saraswati, Brahma and Bhadra Yogas confer extraordinary scholastic recognition:'}
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '14px',
            }}
          >
            {report.allYogas.map((yoga) => {
              const isPresent = yoga.isPresent;
              return (
                <div
                  key={yoga.id}
                  className="card"
                  style={{
                    padding: '16px 18px',
                    background: 'var(--bg-elevated, #ffffff)',
                    border: isPresent ? '1.5px solid #059669' : '1px solid var(--border-color, rgba(0,0,0,0.08))',
                    borderRadius: '12px',
                    opacity: isPresent ? 1 : 0.72,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '8px',
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: '0.98rem', color: 'var(--text)', display: 'block' }}>
                        {isHi ? yoga.nameHi : yoga.nameEn}
                      </strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {yoga.classicalSource}
                      </span>
                    </div>

                    <span
                      style={{
                        padding: '3px 10px',
                        borderRadius: '9999px',
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        background: isPresent ? '#dcfce7' : 'var(--bg-subtle, #f1f5f9)',
                        color: isPresent ? '#15803d' : 'var(--text-muted)',
                        border: isPresent ? '1px solid #86efac' : '1px solid var(--border-color, rgba(0,0,0,0.08))',
                      }}
                    >
                      {isPresent ? (isHi ? 'कुंडली में उपस्थित' : 'Formed in Chart') : (isHi ? 'अनुपस्थित' : 'Not Formed')}
                    </span>
                  </div>

                  {/* Conditions Met */}
                  <div
                    style={{
                      padding: '8px 12px',
                      borderRadius: '6px',
                      background: 'var(--bg-subtle, #f8fafc)',
                      fontSize: '0.82rem',
                      color: 'var(--text-muted)',
                      marginBottom: '10px',
                    }}
                  >
                    <strong>{isHi ? 'शास्त्रीय शर्त: ' : 'Condition: '}</strong>
                    {isHi ? yoga.conditionMetHi : yoga.conditionMetEn}
                  </div>

                  {/* Result */}
                  <p style={{ margin: 0, fontSize: '0.86rem', lineHeight: 1.5, color: 'var(--text)' }}>
                    {isHi ? yoga.resultHi : yoga.resultEn}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 4: COGNITIVE APTITUDES */}
      {activeSection === 'talents' && (
        <div className="view-stack" style={{ gap: '16px' }}>
          <div
            className="card"
            style={{
              padding: '16px 20px',
              background: 'var(--bg-elevated, #ffffff)',
              borderRadius: '12px',
              border: '1px solid var(--border-color, rgba(0,0,0,0.08))',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Brain size={20} style={{ color: '#7c3aed' }} />
              <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text)' }}>
                {isHi
                  ? 'विशेष बौद्धिक क्षमताएं एवं शास्त्रीय मेधा प्रोफाइल'
                  : 'Specialized Cognitive Aptitudes & Classical Intellectual Faculties'}
              </h3>
            </div>
            <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              {isHi
                ? 'कुशाग्र बुद्धि, स्मृति शक्ति (धारणा), गणित प्रावीण्य, व्याकरण व भाषाधिकार, गूढ़ विद्या (ज्योतिष/शोध) एवं वाक सिद्धि का शास्त्रीय मूल्यांकन:'
                : 'Measurement of acute intelligence (Kushagra Buddhi), photographic retention (Smriti Shakti), mathematical fluency (Ganita), grammar mastery, occult/research, and eloquent discourse (Vak Siddhi):'}
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '14px',
            }}
          >
            {report.talents.map((t) => {
              const barTone =
                t.score >= 80 ? '#10b981' : t.score >= 65 ? '#3b82f6' : t.score >= 50 ? '#f59e0b' : '#94a3b8';
              return (
                <div
                  key={t.domainId}
                  className="card"
                  style={{
                    padding: '16px 18px',
                    background: 'var(--bg-elevated, #ffffff)',
                    borderRadius: '12px',
                    border: '1px solid var(--border-color, rgba(0,0,0,0.08))',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px',
                    }}
                  >
                    <strong style={{ fontSize: '0.98rem', color: 'var(--text)' }}>
                      {isHi ? t.domainNameHi : t.domainNameEn}
                    </strong>
                    <div style={{ textAlign: 'right' }}>
                      <strong style={{ fontSize: '1.1rem', color: barTone }}>{t.score}%</strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                        {isHi ? t.levelHi : t.levelEn}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div
                    style={{
                      height: '6px',
                      background: 'rgba(0,0,0,0.06)',
                      borderRadius: '9999px',
                      overflow: 'hidden',
                      marginBottom: '12px',
                    }}
                  >
                    <div
                      style={{
                        width: `${t.score}%`,
                        height: '100%',
                        background: barTone,
                        borderRadius: '9999px',
                        transition: 'width 0.4s ease',
                      }}
                    />
                  </div>

                  {/* Classical Sutra */}
                  <div
                    style={{
                      padding: '6px 10px',
                      borderRadius: '6px',
                      background: 'var(--bg-subtle, #f8fafc)',
                      fontSize: '0.8rem',
                      color: 'var(--text-muted)',
                      fontStyle: 'italic',
                      marginBottom: '8px',
                    }}
                  >
                    {isHi ? t.classicalSutraHi : t.classicalSutraEn}
                  </div>

                  {/* Detailed Insight */}
                  <p style={{ margin: 0, fontSize: '0.86rem', lineHeight: 1.5, color: 'var(--text)' }}>
                    {isHi ? t.detailedInsightHi : t.detailedInsightEn}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 5: PLANETARY STREAMS & COLLEGE DEGREES */}
      {activeSection === 'academic_streams' && (
        <div className="view-stack" style={{ gap: '16px' }}>
          <div
            className="card"
            style={{
              padding: '16px 20px',
              background: 'var(--bg-elevated, #ffffff)',
              borderRadius: '12px',
              border: '1px solid var(--border-color, rgba(0,0,0,0.08))',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <Compass size={20} style={{ color: '#0284c7' }} />
                <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text)' }}>
                  {isHi
                    ? '९ ग्रहों के कारकत्व अनुसार उच्च शिक्षा संकाय व कॉलेज डिग्रियां'
                    : '9 Planetary Scholastic Streams & Recommended College Degrees'}
                </h3>
              </div>
              <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--text-muted)' }}>
                {isHi
                  ? 'जन्म कुंडली के बलिष्ठ ग्रहों के कारकत्व आधार पर स्नातक (UG), स्नातकोत्तर (PG) व शोध (Ph.D.) की अनुकूल डिग्रियां'
                  : 'Classical planetary karakatwas mapped directly to contemporary degrees (UG, PG, Ph.D.) based on planetary strength'}
              </p>
            </div>

            {/* Filter Toggle */}
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                type="button"
                className={`btn btn-sm ${streamFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setStreamFilter('all')}
                style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '6px' }}
              >
                {isHi ? 'सभी ९ ग्रह संकाय' : 'All 9 Streams'}
              </button>
              <button
                type="button"
                className={`btn btn-sm ${streamFilter === 'recommended' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setStreamFilter('recommended')}
                style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '6px' }}
              >
                {isHi ? 'केवल सर्वोच्च अनुकूल संकाय' : 'Recommended Only'}
              </button>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '14px',
            }}
          >
            {displayedStreams.map((stream) => {
              const isRec = stream.isRecommended;
              return (
                <div
                  key={stream.planetId}
                  className="card"
                  style={{
                    padding: '16px 18px',
                    background: 'var(--bg-elevated, #ffffff)',
                    border: isRec ? '2px solid #0284c7' : '1px solid var(--border-color, rgba(0,0,0,0.08))',
                    borderRadius: '12px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '8px',
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: '1rem', color: 'var(--text)' }}>
                        {isHi ? stream.karakatwaNameHi : stream.karakatwaNameEn}
                      </strong>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>
                        {isHi ? stream.facultyHi : stream.facultyEn}
                      </span>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <strong
                        style={{
                          fontSize: '1.05rem',
                          color: isRec ? '#0284c7' : 'var(--text-muted)',
                        }}
                      >
                        {stream.affinityScore}%
                      </strong>
                      {isRec && (
                        <span
                          style={{
                            display: 'block',
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            color: '#0284c7',
                            textTransform: 'uppercase',
                          }}
                        >
                          {isHi ? 'प्रशस्त संकाय' : 'Recommended'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Recommended Degrees Chips */}
                  <div style={{ marginBottom: '10px' }}>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                      {isHi ? 'अनुशंसित कॉलेज डिग्रियां व उपाधियां:' : 'Recommended Degrees & Disciplines:'}
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {(isHi ? stream.recommendedDegreesHi : stream.recommendedDegreesEn).map((deg, i) => (
                        <span
                          key={i}
                          style={{
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '0.76rem',
                            fontWeight: 600,
                            background: isRec ? 'rgba(2, 132, 199, 0.1)' : 'var(--bg-subtle, #f1f5f9)',
                            color: isRec ? '#0369a1' : 'var(--text)',
                            border: isRec ? '1px solid rgba(2, 132, 199, 0.25)' : '1px solid var(--border-color, rgba(0,0,0,0.06))',
                          }}
                        >
                          {deg}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Explanation */}
                  <p style={{ margin: 0, fontSize: '0.84rem', lineHeight: 1.5, color: 'var(--text-muted)' }}>
                    {isHi ? stream.explanationHi : stream.explanationEn}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 6: MOON PSYCHOLOGY & TIMELINE */}
      {activeSection === 'moon_timeline' && (
        <div className="view-stack" style={{ gap: '16px' }}>
          {/* Moon Cognitive Psychology Card */}
          <div
            className="card"
            style={{
              padding: '20px',
              background: 'var(--bg-elevated, #ffffff)',
              borderRadius: '12px',
              border: '1px solid var(--border-color, rgba(0,0,0,0.1))',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
                borderBottom: '1px solid var(--border-color, rgba(0,0,0,0.08))',
                paddingBottom: '12px',
                marginBottom: '14px',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Moon size={20} style={{ color: '#4f46e5' }} />
                  <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text)' }}>
                    {isHi
                      ? 'चंद्रमा चित्त, एकाग्रता एवं परीक्षा मनोविज्ञान'
                      : 'Natal Moon Psychology, Exam Composure & Retention'}
                  </h3>
                </div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {isHi
                    ? `चंद्र राशि: ${report.moonPsychology.moonSignHi} (${report.moonPsychology.moonHouse}वां भाव) · ${report.moonPsychology.pakshaBalaHi}`
                    : `Moon Sign: ${report.moonPsychology.moonSignEn} (House ${report.moonPsychology.moonHouse}) · ${report.moonPsychology.pakshaBalaEn}`}
                </span>
              </div>

              <div
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  background: 'rgba(79, 70, 229, 0.1)',
                  color: '#4338ca',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                }}
              >
                {isHi ? 'मानसिक एकाग्रता सूचकांक: ' : 'Mental Focus Score: '}
                {report.moonPsychology.mentalFocusScore}/100
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '14px',
              }}
            >
              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: '10px',
                  background: 'var(--bg-subtle, #f8fafc)',
                  border: '1px solid var(--border-color, rgba(0,0,0,0.06))',
                }}
              >
                <strong style={{ fontSize: '0.88rem', color: 'var(--text)', display: 'block', marginBottom: '4px' }}>
                  {isHi ? 'संज्ञानात्मक स्वभाव व मन की गति' : 'Cognitive Temperament'}
                </strong>
                <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: 1.5, color: 'var(--text)' }}>
                  {isHi
                    ? report.moonPsychology.cognitiveProfileHi
                    : report.moonPsychology.cognitiveProfileEn}
                </p>
              </div>

              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: '10px',
                  background: 'var(--bg-subtle, #f8fafc)',
                  border: '1px solid var(--border-color, rgba(0,0,0,0.06))',
                }}
              >
                <strong style={{ fontSize: '0.88rem', color: 'var(--text)', display: 'block', marginBottom: '4px' }}>
                  {isHi ? 'परीक्षा कक्ष संयम व अध्ययन शैली' : 'Exam Composure & Study Style'}
                </strong>
                <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: 1.5, color: 'var(--text)' }}>
                  {isHi
                    ? report.moonPsychology.learningDispositionHi
                    : report.moonPsychology.learningDispositionEn}
                </p>
              </div>

              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: '10px',
                  background: 'var(--bg-subtle, #f8fafc)',
                  border: '1px solid var(--border-color, rgba(0,0,0,0.06))',
                }}
              >
                <strong style={{ fontSize: '0.88rem', color: 'var(--text)', display: 'block', marginBottom: '4px' }}>
                  {isHi ? 'दृष्टि व इंद्रीय सतर्कता (नेत्र सुरक्षा)' : 'Sensory & Eyesight Care'}
                </strong>
                <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: 1.5, color: 'var(--text)' }}>
                  {isHi
                    ? report.moonPsychology.visualAndSensoryFocusHi
                    : report.moonPsychology.visualAndSensoryFocusEn}
                </p>
              </div>
            </div>
          </div>

          {/* Educational Timeline Windows */}
          <div
            className="card"
            style={{
              padding: '20px',
              background: 'var(--bg-elevated, #ffffff)',
              borderRadius: '12px',
              border: '1px solid var(--border-color, rgba(0,0,0,0.1))',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <GraduationCap size={20} style={{ color: '#d97706' }} />
              <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text)' }}>
                {isHi
                  ? 'शिक्षा कालखंड एवं दशा फलक्रम (प्राथमिक से शोध व विदेश अध्ययन)'
                  : 'Educational Timeline Windows (Primary to Ph.D. & Foreign Studies)'}
              </h3>
            </div>
            <p style={{ margin: '0 0 16px', fontSize: '0.86rem', color: 'var(--text-muted)' }}>
              {isHi
                ? '२रे, ४थे, ५वें, ८वें, ९वें एवं १२वें भावों की दशाओं का जीवन के शैक्षणिक पड़ावों पर प्रभाव:'
                : 'Planetary operational periods governing specific academic stages and milestones:'}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {report.timelineWindows.map((tw, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '14px 18px',
                    borderRadius: '10px',
                    background: 'var(--bg-subtle, #f8fafc)',
                    border: '1px solid var(--border-color, rgba(0,0,0,0.08))',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '8px',
                      marginBottom: '6px',
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: '0.96rem', color: 'var(--text)' }}>
                        {isHi ? tw.stageHi : tw.stage}
                      </strong>
                      <span
                        style={{
                          fontSize: '0.78rem',
                          color: '#b45309',
                          fontWeight: 600,
                          marginLeft: '8px',
                        }}
                      >
                        ({isHi ? `आयु ${tw.ageRange}` : `Age ${tw.ageRange}`})
                      </span>
                    </div>

                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        background: 'rgba(59, 130, 246, 0.1)',
                        color: '#2563eb',
                      }}
                    >
                      {isHi
                        ? `शासक भाव: ${tw.governingHouses.map((h) => `${h}वां`).join(', ')}`
                        : `Governing Houses: ${tw.governingHouses.join(', ')}`}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.82rem', color: '#4f46e5', fontWeight: 600, marginBottom: '6px' }}>
                    {isHi ? tw.timingDashaHi : tw.timingDashaEn}
                  </div>

                  <p style={{ margin: '0 0 6px', fontSize: '0.86rem', lineHeight: 1.5, color: 'var(--text)' }}>
                    {isHi ? tw.scholasticOutcomeHi : tw.scholasticOutcomeEn}
                  </p>

                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    <strong>{isHi ? 'सावधानी व परामर्श: ' : 'Advisory Note: '}</strong>
                    {isHi ? tw.advisoryPrecautionHi : tw.advisoryPrecautionEn}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 7: CLASSICAL VEDIC REMEDIAL UPAYAS */}
      {activeSection === 'remedies' && (
        <div className="view-stack" style={{ gap: '16px' }}>
          <div
            className="card"
            style={{
              padding: '20px',
              background: 'var(--bg-elevated, #ffffff)',
              borderRadius: '12px',
              border: '1px solid var(--border-color, rgba(0,0,0,0.1))',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Lightbulb size={22} style={{ color: '#d97706' }} />
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text)' }}>
                {isHi ? report.classicalUpayas.titleHi : report.classicalUpayas.titleEn}
              </h3>
            </div>
            <p style={{ margin: '0 0 16px', fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              {isHi
                ? 'शास्त्रीय ग्रंथों (वृहत्पाराशर, सर्वार्थ चिंतामणि एवं ज्योतिश रत्नाकर) में वर्णित विद्या, धारणा शक्ति, परीक्षा संशय व विस्मृति निवारण हेतु अनुभूत वैदिक उपाय:'
                : 'Classical Vedic remedial measures documented in classical treatises to clear mental fog, enhance retention, dispel examination anxiety, and align cosmic planetary energies:'}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(isHi ? report.classicalUpayas.detailsHi : report.classicalUpayas.detailsEn).map(
                (item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      background: 'var(--bg-subtle, #f8fafc)',
                      border: '1px solid var(--border-color, rgba(0,0,0,0.06))',
                    }}
                  >
                    <span
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '9999px',
                        background: '#fef3c7',
                        color: '#d97706',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        flexShrink: 0,
                      }}
                    >
                      {idx + 1}
                    </span>
                    <p style={{ margin: 0, fontSize: '0.88rem', lineHeight: 1.6, color: 'var(--text)' }}>
                      {item}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
