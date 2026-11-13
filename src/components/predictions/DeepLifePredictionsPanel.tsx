import React, { useMemo, useState } from 'react';
import {
  Activity,
  Award,
  BookOpen,
  Briefcase,
  CheckCircle,
  Coins,
  Compass,
  GraduationCap,
  Heart,
  HelpCircle,
  Info,
  Shield,
  Sparkles,
  TrendingUp,
  User,
  Zap,
} from 'lucide-react';
import {
  computeDeepLifePredictions,
  type DeepDomainPrediction,
} from '../../astro/predictions/deepLifePredictions';
import type { ChartData } from '../../astro/types';
import { useLanguage } from '../../i18n/LanguageContext';

interface DeepLifePredictionsPanelProps {
  chart: ChartData;
  personaMode?: 'professional' | 'learner' | 'simple';
}

export const DeepLifePredictionsPanel: React.FC<DeepLifePredictionsPanelProps> = ({
  chart,
  personaMode = 'simple',
}) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';
  const [selectedDomainId, setSelectedDomainId] = useState<string>('all');
  const [activePersona, setActivePersona] = useState<'professional' | 'learner' | 'simple'>(personaMode);

  const report = useMemo(() => computeDeepLifePredictions(chart), [chart]);

  const domainIcons: Record<string, React.ReactNode> = {
    personality: <User size={16} />,
    wealth: <Coins size={16} />,
    career: <Briefcase size={16} />,
    marriage: <Heart size={16} />,
    health: <Shield size={16} />,
    spirituality: <Sparkles size={16} />,
  };

  const filteredDomains =
    selectedDomainId === 'all'
      ? report.domains
      : report.domains.filter((d) => d.id === selectedDomainId);

  return (
    <div className="view-stack">
      {/* Top Banner with Life Score & Persona Switcher */}
      <div className="card" style={{ borderLeft: '4px solid var(--accent)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={20} style={{ color: 'var(--accent)' }} />
              <span>{isHi ? 'विस्तृत जीवन फलादेश (Comprehensive Life Predictions)' : 'In-Depth Life Predictions'}</span>
            </h2>
            <p className="muted" style={{ margin: '4px 0 0', fontSize: '13px' }}>
              {isHi
                ? 'व्यक्तित्व, धन-संपत्ति, करियर, विवाह, स्वास्थ्य व आध्यात्मिकता का समग्र फल'
                : 'Deep analysis across Personality, Wealth, Career, Marriage, Health & Spirituality'}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Persona Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <GraduationCap size={15} className="muted" />
              <select
                aria-label="Audience Persona"
                className="select-compact"
                value={activePersona}
                onChange={(e) => setActivePersona(e.target.value as any)}
                style={{ fontWeight: 600, borderColor: 'var(--accent)' }}
              >
                <option value="simple">{isHi ? '👤 सामान्य जातक (Simple)' : '👤 Non-Astrologer (Simple)'}</option>
                <option value="learner">{isHi ? '📖 विद्यार्थी / शिक्षार्थी (Learner)' : '📖 Student / Learner'}</option>
                <option value="professional">{isHi ? '🎓 ज्योतिषी / शोधकर्ता (Professional)' : '🎓 Professional Astrologer'}</option>
              </select>
            </div>

            {/* Overall Score Badge */}
            <div
              className="badge badge-accent mono"
              style={{ fontSize: '14px', padding: '6px 12px', fontWeight: 700 }}
              title="Overall Life Auspiciousness Index"
            >
              ★ {report.overallLifeScore} / 100
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <div style={{ marginTop: '12px', padding: '10px 14px', background: 'var(--bg-subtle)', borderRadius: '8px', fontSize: '13.5px', lineHeight: 1.5 }}>
          <strong>{isHi ? 'समग्र जीवन निष्कर्ष: ' : 'Executive Summary: '}</strong>
          {isHi ? report.executiveSummaryHi : report.executiveSummaryEn}
        </div>
      </div>

      {/* Domain Quick Dropdown Selector */}
      <div className="card" style={{ padding: '10px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 600, fontSize: '13px' }}>
              {isHi ? 'जीवन क्षेत्र चुनें (Select Domain):' : 'Select Life Domain:'}
            </span>
            <select
              aria-label="Select Domain"
              className="select-compact"
              value={selectedDomainId}
              onChange={(e) => setSelectedDomainId(e.target.value)}
              style={{ minWidth: '220px', fontWeight: 600 }}
            >
              <option value="all">{isHi ? '🌟 सभी 6 जीवन क्षेत्र (View All)' : '🌟 All 6 Life Spheres'}</option>
              {report.domains.map((d) => (
                <option key={d.id} value={d.id}>
                  {isHi ? d.titleHi : d.titleEn} ({d.score}%)
                </option>
              ))}
            </select>
          </div>

          <div className="muted small-text">
            {activePersona === 'simple' && (
              <span>{isHi ? '💡 सरल भाषा में प्रत्यक्ष जीवन उत्तर' : '💡 Direct practical answers in plain language'}</span>
            )}
            {activePersona === 'learner' && (
              <span>{isHi ? '📖 शास्त्रीय कारण एवं योग निर्माण का अध्ययन' : '📖 Astrological mechanics & why rules form'}</span>
            )}
            {activePersona === 'professional' && (
              <span>{isHi ? '🎓 ग्रह कारक, भावेश एवं सूक्ष्म संबंध' : '🎓 Planet significators, house lords & micro factors'}</span>
            )}
          </div>
        </div>
      </div>

      {/* Render Domains */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filteredDomains.map((domain) => (
          <div key={domain.id} className="card" style={{ padding: '16px' }}>
            {/* Domain Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: 'var(--accent)', display: 'flex' }}>
                  {domainIcons[domain.id] || <Sparkles size={16} />}
                </span>
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>
                  {isHi ? domain.titleHi : domain.titleEn}
                </h3>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className={`badge ${domain.score >= 80 ? 'badge-good' : domain.score >= 70 ? 'badge-accent' : 'badge-warn'}`}>
                  {isHi ? domain.ratingHi : domain.ratingEn}
                </span>
                <span className="mono" style={{ fontWeight: 700, fontSize: '13px' }}>
                  {domain.score}%
                </span>
              </div>
            </div>

            {/* In-depth Detailed Narrative */}
            <p style={{ margin: '0 0 14px', fontSize: '13.5px', lineHeight: 1.55 }}>
              {isHi ? domain.summaryHi : domain.summaryEn}
            </p>

            {/* Strengths & Watchouts Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px', marginBottom: '14px' }}>
              {/* Key Strengths */}
              <div style={{ padding: '10px 12px', background: 'var(--good-soft)', borderRadius: '8px', border: '1px solid rgba(21, 128, 61, 0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--good)', fontWeight: 700, fontSize: '12.5px', marginBottom: '6px' }}>
                  <CheckCircle size={14} />
                  <span>{isHi ? 'सकारात्मक पक्ष व अनुकूल प्रभाव' : 'Key Auspicious Strengths'}</span>
                </div>
                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12.5px', lineHeight: 1.5 }}>
                  {(isHi ? domain.keyStrengthsHi : domain.keyStrengthsEn).map((st, sIdx) => (
                    <li key={sIdx}>{st}</li>
                  ))}
                </ul>
              </div>

              {/* Watchouts & Caution */}
              <div style={{ padding: '10px 12px', background: 'var(--warn-soft)', borderRadius: '8px', border: '1px solid rgba(180, 83, 9, 0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--warn)', fontWeight: 700, fontSize: '12.5px', marginBottom: '6px' }}>
                  <Shield size={14} />
                  <span>{isHi ? 'सावधानियां एवं चुनौतियां' : 'Areas Requiring Caution'}</span>
                </div>
                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12.5px', lineHeight: 1.5 }}>
                  {(isHi ? domain.watchoutsHi : domain.watchoutsEn).map((wo, wIdx) => (
                    <li key={wIdx}>{wo}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Professional Astrologer & Learner Technical Details */}
            {(activePersona === 'professional' || activePersona === 'learner') && (
              <div style={{ padding: '8px 12px', background: 'var(--bg-subtle)', borderRadius: '6px', fontSize: '12px', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--indigo)', fontWeight: 600, marginBottom: '2px' }}>
                  <Compass size={13} />
                  <span>{isHi ? 'शास्त्रीय ग्रह योग एवं कारक आधार (Astrological Factors):' : 'Astrological Mechanics & Significators:'}</span>
                </div>
                <div className="mono muted">
                  {isHi ? domain.astrologicalFactorsHi : domain.astrologicalFactorsEn}
                </div>
              </div>
            )}

            {/* Classical Vedic Remedy / Advice */}
            <div style={{ padding: '8px 12px', background: 'var(--accent-soft)', borderRadius: '6px', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={14} style={{ color: 'var(--accent)', flexShrink: 0 }} />
              <div>
                <strong>{isHi ? 'शास्त्रीय परामर्श व उपाय: ' : 'Classical Guidance & Remedy: '}</strong>
                <span>{isHi ? domain.classicalAdviceHi : domain.classicalAdviceEn}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
