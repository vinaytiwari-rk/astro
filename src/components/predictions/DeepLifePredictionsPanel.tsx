import React, { useMemo, useState } from 'react';
import {
  Activity,
  Award,
  BookOpen,
  Briefcase,
  CheckCircle,
  Clock,
  Coins,
  Compass,
  Crown,
  Flame,
  Gem,
  Heart,
  Home,
  Shield,
  Sparkles,
  User,
  Users,
} from 'lucide-react';
import {
  computeDeepLifePredictions,
} from '../../astro/predictions/deepLifePredictions';
import type { ChartData } from '../../astro/types';
import { useLanguage } from '../../i18n/LanguageContext';

interface DeepLifePredictionsPanelProps {
  chart: ChartData;
}

export const DeepLifePredictionsPanel: React.FC<DeepLifePredictionsPanelProps> = ({
  chart,
}) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';
  const [selectedDomainId, setSelectedDomainId] = useState<string>('all');

  const report = useMemo(() => computeDeepLifePredictions(chart), [chart]);

  const domainIcons: Record<string, React.ReactNode> = {
    personality: <User size={16} />,
    education: <BookOpen size={16} />,
    career: <Briefcase size={16} />,
    wealth: <Coins size={16} />,
    marriage: <Heart size={16} />,
    children: <Users size={16} />,
    property: <Home size={16} />,
    health: <Shield size={16} />,
    travels: <Compass size={16} />,
    spirituality: <Sparkles size={16} />,
    milestones: <Award size={16} />,
    remedies: <Gem size={16} />,
  };

  const filteredDomains =
    selectedDomainId === 'all'
      ? report.domains
      : report.domains.filter((d) => d.id === selectedDomainId);
  const seasonal = report.birthProfile.seasonalDetails;

  return (
    <div className="view-stack">
      {/* Top Banner: Authentic Indication-Based Reading */}
      <div className="card" style={{ borderLeft: '4px solid var(--accent)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={20} style={{ color: 'var(--accent)' }} />
              <span>{isHi ? 'विस्तृत सामान्य फलादेश (General & Foundational Predictions)' : 'General & Foundational Life Predictions'}</span>
            </h2>
            <p className="muted" style={{ margin: '4px 0 0', fontSize: '13px' }}>
              {isHi
                ? 'जन्म पंचांग, नित्या देवी, पृथु यशस् नवांश लग्न, ऋतुचक्र एवं ६ प्रमुख जीवन-क्षेत्रों का प्रामाणिक फलादेश'
                : 'Authentic Shastric predictions based on Panchanga, Nitya Devis, Prithu Yasas Navamsha, and 6 core life spheres'}
            </p>
          </div>

          <span className="badge badge-subtle">
            {isHi ? 'AV Astro Vibe प्रामाणिक फलादेश' : 'AV Astro Vibe Classical Synthesis'}
          </span>
        </div>
      </div>

      {/* 4 Master Prediction Pillars: Stature, Prime Golden Era, Testing Periods, and Karmic Mission */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
        {/* Pillar 1: Life Stature */}
        <div className="card" style={{ padding: '14px', borderTop: '3px solid #d97706', background: 'var(--bg-elevated)' }}>
          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {isHi ? 'जीवन प्रतिष्ठा व वर्ग' : 'Life Stature & Social Class'}
          </div>
          <div style={{ fontSize: '15px', fontWeight: 700, margin: '4px 0 6px', color: '#b45309' }}>
            {isHi ? (report.lifeStatureClassHi || 'समृद्ध व कुलीन वर्ग') : (report.lifeStatureClassEn || 'Affluent & Dignified Class')}
          </div>
          <div style={{ fontSize: '12.5px', lineHeight: 1.45, color: 'var(--text)' }}>
            {isHi ? report.lifeStatureMeaningHi : report.lifeStatureMeaningEn}
          </div>
        </div>

        {/* Pillar 2: Prime Golden Rise Era */}
        <div className="card" style={{ padding: '14px', borderTop: '3px solid #16a34a', background: 'var(--bg-elevated)' }}>
          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {isHi ? 'महा-भाग्योदय स्वर्ण काल' : 'Peak Rise Golden Era'}
          </div>
          <div style={{ fontSize: '15px', fontWeight: 700, margin: '4px 0 6px', color: '#16a34a' }}>
            {isHi ? report.peakRiseAgeWindowHi : report.peakRiseAgeWindowEn}
          </div>
          <div style={{ fontSize: '12.5px', lineHeight: 1.45, color: 'var(--text)' }}>
            {isHi
              ? 'इस कालखंड में करियर, संपत्ति व सामाजिक प्रतिष्ठा का सर्वोच्च उत्कर्ष होगा।'
              : 'Maximum accumulation of wealth, professional elevation and authority manifests here.'}
          </div>
        </div>

        {/* Pillar 3: Testing Eras / Crisis Warning */}
        <div className="card" style={{ padding: '14px', borderTop: '3px solid #dc2626', background: 'var(--bg-elevated)' }}>
          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {isHi ? 'जीवन परीक्षा व सतर्कता काल' : 'Testing / Caution Periods'}
          </div>
          <ul style={{ margin: '6px 0 0', paddingLeft: '16px', fontSize: '12px', lineHeight: 1.45, color: 'var(--text)' }}>
            {(isHi ? (report.crisisErasHi || []) : (report.crisisErasEn || [])).slice(0, 2).map((era, eIdx) => (
              <li key={eIdx} style={{ marginBottom: '3px' }}>{era}</li>
            ))}
          </ul>
        </div>

        {/* Pillar 4: Karmic Mission */}
        <div className="card" style={{ padding: '14px', borderTop: '3px solid #2563eb', background: 'var(--bg-elevated)' }}>
          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {isHi ? 'मूल आत्मिक कर्म पथ' : 'Soul Karmic Mission'}
          </div>
          <div style={{ fontSize: '14px', fontWeight: 700, margin: '4px 0 6px', color: '#2563eb' }}>
            {isHi ? report.karmicMissionHi : report.karmicMissionEn}
          </div>
          <div style={{ fontSize: '12.5px', lineHeight: 1.45, color: 'var(--text)' }}>
            {isHi
              ? 'सांसारिक उपलब्धियों के साथ-साथ संस्थागत न्याय व धर्म का निर्वहन जीवन का सर्वोच्च उद्देश्य है।'
              : 'Balancing executive success with institutional righteousness defines the ultimate destiny.'}
          </div>
        </div>
      </div>

      {/* Four Purushartha Trines Balance (Dharma, Artha, Kama, Moksha) */}
      {report.purusharthas && (
        <div className="card" style={{ padding: '16px', background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Flame size={16} color="var(--accent)" />
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>
                {isHi
                  ? 'चार पुरुषार्थ त्रिकोण संतुलन (Dharma, Artha, Kama, Moksha Balance)'
                  : 'Four Purushartha Trines Balance (Dharma · Artha · Kama · Moksha)'}
              </h3>
            </div>
            <span
              className="tag tag-varg"
              style={{ fontSize: '11.5px', fontWeight: 700, padding: '3px 10px', borderRadius: '12px' }}
            >
              {isHi ? report.purusharthas.dominantTitleHi : report.purusharthas.dominantTitleEn}
            </span>
          </div>

          <p style={{ margin: '0 0 14px', fontSize: '13px', lineHeight: 1.55, color: 'var(--text)' }}>
            {isHi ? report.purusharthas.balanceSynthesisHi : report.purusharthas.balanceSynthesisEn}
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '12px',
              marginBottom: '10px',
            }}
          >
            {report.purusharthas.trines.map((t) => {
              const colorMap: Record<string, string> = {
                Dharma: '#d97706',
                Artha: '#059669',
                Kama: '#2563eb',
                Moksha: '#7c3aed',
              };
              const trineColor = colorMap[t.type] || 'var(--accent)';
              const isDominant = t.type === report.purusharthas.dominant;

              return (
                <div
                  key={t.type}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    background: 'var(--bg-subtle)',
                    border: `1.5px solid ${isDominant ? trineColor : 'var(--border)'}`,
                    position: 'relative',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 700, fontSize: '13px', color: trineColor }}>
                      {isHi ? t.nameHi.split(' (')[0] : t.type + ' Trikona'} ({t.houses.join(', ')})
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: trineColor }}>
                      {t.percentage}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div
                    style={{
                      height: '6px',
                      borderRadius: '3px',
                      background: 'var(--border)',
                      overflow: 'hidden',
                      marginBottom: '8px',
                    }}
                  >
                    <div
                      style={{
                        width: `${t.percentage}%`,
                        height: '100%',
                        background: trineColor,
                        borderRadius: '3px',
                        transition: 'width 0.4s ease',
                      }}
                    />
                  </div>

                  <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginBottom: '6px', lineHeight: 1.4 }}>
                    <strong>{isHi ? 'सर्वाष्टकवर्ग: ' : 'SAV: '}</strong>{t.savBindus} {isHi ? 'बिंदु' : 'bindus'}
                    {t.occupantPlanets.length > 0 && (
                      <span> · <strong>{isHi ? 'स्थित ग्रह: ' : 'Occupants: '}</strong>{t.occupantPlanets.join(', ')}</span>
                    )}
                  </div>

                  <div style={{ fontSize: '12px', lineHeight: 1.45, color: 'var(--text)' }}>
                    {isHi ? t.guidanceHi : t.guidanceEn}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'right' }}>
            {isHi ? 'शास्त्रीय ग्रंथ आधार: ' : 'Classical Source Reference: '}
            {report.purusharthas.classicalReference}
          </div>
        </div>
      )}

      {/* 12 Life Chapters Quick Dropdown & Jump Pills */}
      <div className="card" style={{ padding: '12px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 700, fontSize: '13px' }}>
              {isHi ? 'जीवन अध्याय चुनें (Select Chapter):' : 'Select Life Chapter:'}
            </span>
            <select
              aria-label="Select Domain"
              className="select-compact"
              value={selectedDomainId}
              onChange={(e) => setSelectedDomainId(e.target.value)}
              style={{ minWidth: '260px', fontWeight: 700 }}
            >
              <option value="all">{isHi ? 'संपूर्ण जीवन फलादेश — सभी १२ अध्याय (View All 12 Chapters)' : 'Complete Life Horoscope — All 12 Chapters'}</option>
              {report.domains.map((d, dIdx) => (
                <option key={d.id} value={d.id}>
                  {dIdx + 1}. {isHi ? d.titleHi : d.titleEn}
                </option>
              ))}
            </select>
          </div>

          <div className="muted small-text">
            {isHi
              ? 'व्यावसायिक सॉफ़्टवेयर फलादेश: प्रत्येक अध्याय में त्वरित निष्कर्ष, ठोस भविष्यवाणियां, समय-सीमा व अचूक उपाय।'
              : 'Software-grade report: Executive verdict, concrete predicted events, timing windows and Vedic remedies.'}
          </div>
        </div>

        {/* Horizontal Quick-Jump Pills for all 12 chapters */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '10px', paddingTop: '8px', borderTop: '1px solid var(--border)' }}>
          <button
            type="button"
            className={`btn btn-xs ${selectedDomainId === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSelectedDomainId('all')}
            style={{ fontSize: '11.5px', padding: '4px 8px', borderRadius: '4px', fontWeight: 600 }}
          >
            {isHi ? 'सभी १२ अध्याय' : 'All 12 Chapters'}
          </button>
          {report.domains.map((d, dIdx) => {
            const isActive = selectedDomainId === d.id;
            return (
              <button
                key={d.id}
                type="button"
                className={`btn btn-xs ${isActive ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setSelectedDomainId(d.id)}
                style={{
                  fontSize: '11.5px',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontWeight: isActive ? 700 : 500,
                }}
              >
                <span>{domainIcons[d.id]}</span>
                <span>{dIdx + 1}. {isHi ? d.titleHi.split(' ')[0] : d.titleEn.split(' ')[0]}</span>
              </button>
            );
          })}
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
                <span
                  className={`badge ${
                    domain.ratingEn === 'Excellent'
                      ? 'badge-good'
                      : domain.ratingEn === 'Very Good'
                        ? 'badge-accent'
                        : domain.ratingEn === 'Moderate'
                          ? 'badge-subtle'
                          : 'badge-warn'
                  }`}
                  style={{ fontWeight: 700 }}
                >
                  {isHi ? domain.ratingHi : domain.ratingEn}
                </span>
                <span className="badge badge-subtle">
                  {isHi ? 'वैदिक संहिता फलादेश' : 'Classical Standard'}
                </span>
              </div>
            </div>

            <div style={{ padding: '14px 16px', background: 'var(--accent-soft)', borderRadius: '8px', borderLeft: '4px solid var(--accent)', marginBottom: '14px', fontSize: '13.5px', lineHeight: 1.65, whiteSpace: 'pre-line' }}>
              <div style={{ fontWeight: 700, color: 'var(--accent)', marginBottom: '8px', fontSize: '14px' }}>
                {isHi ? 'प्रामाणिक शास्त्रीय फलादेश (Core Classical Prophecy):' : 'Authoritative Classical Prediction:'}
              </div>
              {isHi ? domain.predictionHi : domain.predictionEn}
            </div>

            {/* Active Timing Window & Concrete Event Milestones */}
            {(domain.timingWindowHi || domain.timingWindowEn) && (
              <div
                style={{
                  padding: '10px 14px',
                  background: 'rgba(217, 119, 6, 0.08)',
                  borderLeft: '4px solid #d97706',
                  borderRadius: '6px',
                  marginBottom: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#b45309', fontWeight: 700, fontSize: '13px', marginBottom: '6px', flexWrap: 'wrap' }}>
                  <Clock size={14} />
                  <span>{isHi ? 'सक्रिय फलन समय-सीमा (Timing Window):' : 'Active Manifestation Window:'}</span>
                  <span style={{ color: 'var(--text)', fontWeight: 600 }}>{isHi ? domain.timingWindowHi : domain.timingWindowEn}</span>
                </div>
                {((isHi ? domain.concreteEventsHi : domain.concreteEventsEn) || []).length > 0 && (
                  <div>
                    <div style={{ fontWeight: 650, fontSize: '12.5px', marginBottom: '4px' }}>
                      {isHi ? 'ठोस संभावित जीवन घटनाएं (Concrete Predicted Events):' : 'Concrete Manifesting Events:'}
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12.5px', lineHeight: 1.5 }}>
                      {((isHi ? domain.concreteEventsHi : domain.concreteEventsEn) || []).map((ev, evIdx) => (
                        <li key={evIdx} style={{ marginBottom: '3px' }}>{ev}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

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

            {/* Practical Guidance */}
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
