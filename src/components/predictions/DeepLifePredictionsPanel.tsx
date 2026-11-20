import React, { useMemo, useState } from 'react';
import {
  Briefcase,
  CheckCircle,
  Clock,
  Coins,
  Heart,
  Shield,
  Sparkles,
  User,
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
      {/* Top Banner: no fabricated aggregate probability */}
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
 
          <span className="badge badge-subtle">
            {isHi ? 'पारंपरिक संकेत-आधारित व्याख्या' : 'Traditional indication-based reading'}
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

      {/* Birth Panchang and Avakhada foundations used by General Prediction */}
      <div className="card" style={{ padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <Sparkles size={18} style={{ color: 'var(--accent)' }} />
          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>
            {isHi ? 'जन्म पंचांग एवं अवकहड़ा चक्र' : 'Birth Panchang & Avakhada Chakra'}
          </h3>
        </div>
        <p className="muted small-text" style={{ margin: '0 0 12px', lineHeight: 1.5 }}>
          {isHi
            ? 'सामान्य फलादेश का प्रारंभ इन जन्म-आधारों से होगा। इन्हें लग्न, भावेश, ग्रह-स्थिति, योग और बल के साथ मिलाकर पढ़ा जाता है।'
            : 'General Prediction starts with these birth foundations, then reads them together with the ascendant, houses, lords, planetary placements, yogas and strengths.'}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '8px' }}>
          {report.birthProfile.factors.map((factor) => (
            <div key={factor.id} style={{ padding: '9px 11px', borderRadius: '7px', background: 'var(--bg-subtle)', minWidth: 0 }}>
              <div className="muted" style={{ fontSize: '11px', marginBottom: '3px' }}>
                {isHi ? factor.labelHi : factor.labelEn}
              </div>
              <div style={{ fontSize: '13px', fontWeight: 650, lineHeight: 1.4, overflowWrap: 'anywhere' }}>
                {isHi ? factor.valueHi : factor.valueEn}
              </div>
              <div style={{ fontSize: '12px', lineHeight: 1.5, marginTop: '6px' }}>
                {isHi ? factor.interpretationHi : factor.interpretationEn}
              </div>
            </div>
          ))}
        </div>
        <p className="muted small-text" style={{ margin: '12px 0 0', lineHeight: 1.5 }}>
          {isHi
            ? 'नोट: मास अमान्त पूर्णिमा-आधारित गणना से निकाला गया है; पाया लग्न से चंद्रमा की भाव-स्थिति के प्रचलित उत्तर भारतीय नियम पर है। इष्ट देव जैमिनी कारकांश (D9) के 12वें स्थान से निकाला गया संकेत है; परंपराओं में देवता-निर्धारण भिन्न हो सकता है।'
            : 'Method note: Maas is estimated by the Amanta full-moon convention; Paya uses the commonly printed North Indian Moon-from-Lagna house rule. Ishta Dev is a Jaimini Karakamsha (D9), 12th-sign indication; deity mappings vary by tradition.'}
        </p>
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
              style={{ minWidth: '240px', fontWeight: 600 }}
            >
              <option value="all">{isHi ? 'सभी 6 जीवन क्षेत्र (View All)' : 'All 6 Life Spheres'}</option>
              {report.domains.map((d) => (
                <option key={d.id} value={d.id}>
                  {isHi ? d.titleHi : d.titleEn}
                </option>
              ))}
            </select>
          </div>

          <div className="muted small-text">
            {isHi
              ? 'प्रत्येक क्षेत्र में स्पष्ट फलादेश, अनुकूल संकेत, चुनौतियां एवं शास्त्रीय परामर्श दिए गए हैं। दशा और गोचर का समय-फल उनके अलग अनुभागों में है।'
              : 'Each sphere shows a clear reading, supporting factors, cautions and practical guidance. Dasha and transit timing are shown in their own sections.'}
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

              <span className="badge badge-subtle">
                {isHi ? 'संकेतात्मक विश्लेषण' : 'Indicative analysis'}
              </span>
            </div>

            <div style={{ padding: '10px 12px', background: 'var(--accent-soft)', borderRadius: '8px', marginBottom: '12px', fontSize: '13.5px', lineHeight: 1.55 }}>
              <strong>{isHi ? 'फलादेश: ' : 'Prediction: '}</strong>
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
