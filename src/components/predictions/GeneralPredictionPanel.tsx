import React, { useMemo, useState } from 'react';
import {
  Activity,
  Award,
  BookOpen,
  Briefcase,
  Calendar,
  Clock,
  Coins,
  Compass,
  Crown,
  Flame,
  Gem,
  Heart,
  Home,
  Layers,
  Shield,
  Sparkles,
  User,
  Users,
} from 'lucide-react';
import { computeGeneralPrediction } from '../../astro/predictions/generalPrediction';
import { computeDeepLifePredictions } from '../../astro/predictions/deepLifePredictions';
import type { ChartData } from '../../astro/types';
import { useLanguage } from '../../i18n/LanguageContext';

interface GeneralPredictionPanelProps {
  chart: ChartData;
}

export const GeneralPredictionPanel: React.FC<GeneralPredictionPanelProps> = ({ chart }) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';
  const [selectedDomainId, setSelectedDomainId] = useState<string>('all');

  const report = useMemo(() => computeGeneralPrediction(chart), [chart]);
  const deepReport = useMemo(() => computeDeepLifePredictions(chart), [chart]);

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
    family: <Users size={16} />,
    parents: <Crown size={16} />,
    siblings: <Flame size={16} />,
    romance: <Heart size={16} />,
    business: <Briefcase size={16} />,
    debt_disputes: <Activity size={16} />,
    income_networks: <Coins size={16} />,
    foreign_residence: <Compass size={16} />,
  };

  const filteredDomains =
    selectedDomainId === 'all'
      ? report.domains
      : report.domains.filter((d) => d.id === selectedDomainId);

  const seasonal = deepReport.birthProfile.seasonalDetails;
  const tithiInfo = deepReport.birthProfile.tithiDetails;
  const navLagna = deepReport.birthProfile.navamshaLagna;

  return (
    <div className="view-stack">
      {/* Dossier Executive Header */}
      <section className="card" style={{ borderLeft: '4px solid var(--accent)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={22} style={{ color: 'var(--accent)' }} />
              <span>
                {isHi ? 'संपूर्ण जीवन फलादेश (Executive Life Dossier)' : 'Comprehensive Life Dossier & Foundational Predictions'}
              </span>
            </h2>
            <p className="muted" style={{ margin: '6px 0 0', lineHeight: 1.6, fontSize: '13px' }}>
              {isHi
                ? 'जन्म पंचांग, लग्न स्वरूप, नित्या देवी, ४ जीवन-स्तंभ एवं प्रमुख जीवन-क्षेत्रों का प्रामाणिक फलित ज्योतिषीय विवेचन।'
                : 'Authoritative life prophecy synthesising natal ascendant, Panchanga elements, 4 master life pillars and core life spheres.'}
            </p>
          </div>
          <span className="badge badge-accent mono" style={{ fontSize: '12px', padding: '6px 12px', fontWeight: 700 }}>
            {isHi ? `${report.domains.length} जीवन क्षेत्र सक्रिय` : `${report.domains.length} Life Dimensions`}
          </span>
        </div>
      </section>

      {/* 4 Master Prediction Pillars: Stature, Prime Golden Era, Testing Periods, and Karmic Mission */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
        {/* Pillar 1: Life Stature */}
        <div className="card" style={{ padding: '14px', borderTop: '3px solid #d97706', background: 'var(--bg-elevated)' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {isHi ? 'जीवन प्रतिष्ठा व सामाजिक वर्ग' : 'Life Stature & Social Class'}
          </div>
          <div style={{ fontSize: '15px', fontWeight: 700, margin: '4px 0 6px', color: '#b45309' }}>
            {isHi ? (deepReport.lifeStatureClassHi || 'समृद्ध व कुलीन वर्ग') : (deepReport.lifeStatureClassEn || 'Affluent & Dignified Class')}
          </div>
          <div style={{ fontSize: '12.5px', lineHeight: 1.5, color: 'var(--text)' }}>
            {isHi ? deepReport.lifeStatureMeaningHi : deepReport.lifeStatureMeaningEn}
          </div>
        </div>

        {/* Pillar 2: Prime Golden Rise Era */}
        <div className="card" style={{ padding: '14px', borderTop: '3px solid #16a34a', background: 'var(--bg-elevated)' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {isHi ? 'स्वर्णकाल व मुख्य भाग्योदय दशक' : 'Prime Golden Rise Era'}
          </div>
          <div style={{ fontSize: '15px', fontWeight: 700, margin: '4px 0 6px', color: '#15803d' }}>
            {isHi ? deepReport.peakRiseAgeWindowHi : deepReport.peakRiseAgeWindowEn}
          </div>
          <div style={{ fontSize: '12.5px', lineHeight: 1.5, color: 'var(--text)' }}>
            {isHi
              ? 'इस कालखंड में करियर, संपत्ति व सामाजिक प्रतिष्ठा का सर्वोच्च उत्कर्ष होगा।'
              : 'Maximum accumulation of wealth, professional elevation and authority manifests here.'}
          </div>
        </div>

        {/* Pillar 3: Testing Periods & Hardships */}
        <div className="card" style={{ padding: '14px', borderTop: '3px solid #dc2626', background: 'var(--bg-elevated)' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {isHi ? 'कठिन परीक्षा काल व संभलने का समय' : 'Testing Periods & Hardships'}
          </div>
          <ul style={{ margin: '6px 0 0', paddingLeft: '16px', fontSize: '12px', lineHeight: 1.45, color: 'var(--text)' }}>
            {(isHi ? (deepReport.crisisErasHi || []) : (deepReport.crisisErasEn || [])).slice(0, 2).map((era, eIdx) => (
              <li key={eIdx} style={{ marginBottom: '3px' }}>{era}</li>
            ))}
          </ul>
        </div>

        {/* Pillar 4: Karmic Mission & Purpose */}
        <div className="card" style={{ padding: '14px', borderTop: '3px solid #7c3aed', background: 'var(--bg-elevated)' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {isHi ? 'आत्मा का ध्येय व प्रारब्ध' : 'Karmic Mission & Soul Purpose'}
          </div>
          <div style={{ fontSize: '14px', fontWeight: 700, margin: '4px 0 6px', color: '#6d28d9' }}>
            {isHi ? deepReport.karmicMissionHi : deepReport.karmicMissionEn}
          </div>
          <div style={{ fontSize: '12.5px', lineHeight: 1.5, color: 'var(--text)' }}>
            {isHi
              ? 'सांसारिक उपलब्धियों के साथ-साथ संस्थागत न्याय व धर्म का निर्वहन जीवन का सर्वोच्च उद्देश्य है।'
              : 'Balancing executive success with institutional righteousness defines the ultimate destiny.'}
          </div>
        </div>
      </div>

      {/* Authentic Panchanga & Astrological Birth Profile */}
      <section className="card" style={{ padding: '14px', background: 'var(--bg-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <Calendar size={15} style={{ color: 'var(--accent)' }} />
          <strong style={{ fontSize: '13px' }}>
            {isHi ? 'जन्म पंचांग एवं देव-संरक्षक रूपरेखा:' : 'Birth Panchanga & Guardian Devata Profile:'}
          </strong>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', fontSize: '12.5px' }}>
          <div>
            <span className="muted">{isHi ? 'तिथि व योग:' : 'Tithi:'}</span>{' '}
            <strong>{tithiInfo ? (isHi ? tithiInfo.tithiNameHi : tithiInfo.tithiNameEn) : '-'}</strong>
          </div>
          <div>
            <span className="muted">{isHi ? 'ऋतु प्रभाव:' : 'Seasonal Cycle:'}</span>{' '}
            <strong>{seasonal ? (isHi ? seasonal.rituHi : seasonal.rituEn) : '-'}</strong> ({seasonal ? (isHi ? seasonal.ayanaHi : seasonal.ayanaEn) : '-'})
          </div>
          <div>
            <span className="muted">{isHi ? 'नित्या देवी:' : 'Nitya Devi:'}</span>{' '}
            <strong>{tithiInfo ? (isHi ? tithiInfo.governingNityaDeviHi : tithiInfo.governingNityaDeviEn) : '-'}</strong>
          </div>
          <div>
            <span className="muted">{isHi ? 'नवांश लग्न:' : 'Navamsha Lagna:'}</span>{' '}
            <strong>{navLagna ? (isHi ? navLagna.signNameHi : navLagna.signNameEn) : '-'}</strong>
          </div>
        </div>
      </section>

      {/* Domain Navigation Filter Pills */}
      <div
        className="card"
        style={{
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          flexWrap: 'wrap',
          background: 'var(--bg-elevated)',
        }}
        role="tablist"
        aria-label={isHi ? 'जीवन क्षेत्र चयन' : 'Life Domain Filter'}
      >
        <button
          type="button"
          role="tab"
          aria-selected={selectedDomainId === 'all'}
          className={`btn btn-sm ${selectedDomainId === 'all' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setSelectedDomainId('all')}
          style={{ fontSize: '12px', padding: '4px 10px', fontWeight: selectedDomainId === 'all' ? 700 : 500 }}
        >
          {isHi ? 'सभी क्षेत्र (All)' : 'All Dimensions'}
        </button>
        {report.domains.map((d) => {
          const isActive = selectedDomainId === d.id;
          return (
            <button
              key={d.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSelectedDomainId(d.id)}
              style={{
                fontSize: '12px',
                padding: '4px 10px',
                fontWeight: isActive ? 700 : 500,
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              {domainIcons[d.id]}
              <span>{isHi ? d.titleHi.split(' ')[0] : d.titleEn.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Deep Life Prophecy Chapters */}
      <div className="view-stack" style={{ gap: '14px' }}>
        {filteredDomains.map((domain, index) => {
          const matchingDeep = deepReport.domains.find((d) => d.id === domain.id);
          const icon = domainIcons[domain.id] || <Sparkles size={16} />;

          return (
            <article className="card" key={domain.id} style={{ padding: '18px', borderLeft: '4px solid var(--accent)' }}>
              {/* Card Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: 'var(--accent)' }}>{icon}</span>
                  <div className="muted" style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    {isHi ? `जीवन अध्याय ${index + 1} / ${report.domains.length}` : `LIFE CHAPTER ${index + 1} / ${report.domains.length}`}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {matchingDeep?.timingWindowEn && (
                    <span className="badge badge-accent mono" style={{ fontSize: '11px', padding: '3px 8px' }}>
                      {isHi ? matchingDeep.timingWindowHi : matchingDeep.timingWindowEn}
                    </span>
                  )}
                  <span className="tag tag-varg" style={{ fontSize: '11px' }}>
                    {isHi ? `${domain.varga} वर्ग पुष्टिकरण` : `${domain.varga} Cross-Check`}
                  </span>
                </div>
              </div>

              {/* Title & Summary */}
              <h3 style={{ margin: '0 0 6px', fontSize: '18px', fontWeight: 700 }}>
                {isHi ? domain.titleHi : domain.titleEn}
              </h3>
              {matchingDeep?.summaryEn && (
                <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--accent)', marginBottom: '10px' }}>
                  {isHi ? matchingDeep.summaryHi : matchingDeep.summaryEn}
                </div>
              )}

              {/* Core Prophetic Narrative */}
              <div style={{ fontSize: '14px', lineHeight: 1.8, color: 'var(--text)', whiteSpace: 'pre-line' }}>
                {isHi ? domain.predictionHi : domain.predictionEn}
              </div>

              {/* Strengths & Cautions Dual Grid */}
              {matchingDeep && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px', marginTop: '14px' }}>
                  <div style={{ padding: '10px 12px', background: 'rgba(22, 163, 74, 0.07)', borderRadius: '8px', borderLeft: '3px solid #16a34a' }}>
                    <strong style={{ fontSize: '12.5px', color: '#15803d', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Award size={14} />
                      {isHi ? 'मुख्य नैसर्गिक सामर्थ्य व लाभ:' : 'Key Natural Strengths:'}
                    </strong>
                    <p style={{ margin: '4px 0 0', fontSize: '12.5px', lineHeight: 1.5, color: 'var(--text)' }}>
                      {isHi ? matchingDeep.keyStrengthsHi.join(' · ') : matchingDeep.keyStrengthsEn.join(' · ')}
                    </p>
                  </div>

                  <div style={{ padding: '10px 12px', background: 'rgba(220, 38, 38, 0.07)', borderRadius: '8px', borderLeft: '3px solid #dc2626' }}>
                    <strong style={{ fontSize: '12.5px', color: '#b91c1c', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Shield size={14} />
                      {isHi ? 'संभावित बाधाएं व सावधानियां:' : 'Cautions & Pitfalls to Avoid:'}
                    </strong>
                    <p style={{ margin: '4px 0 0', fontSize: '12.5px', lineHeight: 1.5, color: 'var(--text)' }}>
                      {isHi ? matchingDeep.watchoutsHi.join(' · ') : matchingDeep.watchoutsEn.join(' · ')}
                    </p>
                  </div>
                </div>
              )}

              {/* Collapsible Shastric Worksheet for Astrologers */}
              <details style={{ marginTop: '14px', borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
                <summary style={{ cursor: 'pointer', fontWeight: 650, fontSize: '12.5px', color: 'var(--text-muted)' }}>
                  {isHi ? 'ज्योतिषीय व तकनीकी प्रमाण देखें (Shastric Evidence & Factors)' : 'Inspect Classical Reasoning & Technical Chart Factors'}
                </summary>
                <div style={{ display: 'grid', gap: '8px', marginTop: '10px', fontSize: '12px' }}>
                  <div>
                    <strong>{isHi ? 'व्याख्या का आधार:' : 'Interpretation Framework:'}</strong>{' '}
                    <span className="muted">{isHi ? domain.interpretationBasisHi : domain.interpretationBasisEn}</span>
                  </div>
                  <div>
                    <strong>{isHi ? 'मुख्य ग्रह-स्थिति:' : 'Primary Chart Factor:'}</strong>{' '}
                    <span className="muted">{isHi ? domain.primaryAnchorHi : domain.primaryAnchorEn}</span>
                  </div>
                  <div>
                    <strong>{isHi ? 'समग्र समन्वय:' : 'Combined Synthesis:'}</strong>{' '}
                    <span className="muted">{isHi ? domain.synthesisHi : domain.synthesisEn}</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                    {domain.karakas.map((karaka) => (
                      <span className="tag tag-varg" key={karaka}>{karaka}</span>
                    ))}
                    <span className="tag tag-varg">Houses: {domain.houses.join(', ')}</span>
                    <span className="tag tag-varg">{domain.varga}</span>
                  </div>
                  <ul style={{ margin: '6px 0 0', paddingLeft: '18px', display: 'grid', gap: '6px' }}>
                    {domain.evidence.map((item, evidenceIndex) => (
                      <li key={`${item.source}-${evidenceIndex}`} style={{ lineHeight: 1.5 }}>
                        <strong>{item.source}</strong>: {isHi ? item.detailHi : item.detailEn}
                      </li>
                    ))}
                  </ul>
                </div>
              </details>
            </article>
          );
        })}
      </div>

      {/* Classical Attribution Banner */}
      <section className="card" style={{ padding: '14px', background: 'var(--bg-elevated)', borderLeft: '4px solid var(--accent)' }}>
        <strong style={{ fontSize: '13px' }}>
          {isHi ? 'शास्त्रीय ग्रंथ प्रमाण व परंपरा' : 'Classical Rishi Traditions & Shastric Attribution'}
        </strong>
        <p className="muted" style={{ margin: '6px 0 0', fontSize: '12px', lineHeight: 1.65 }}>
          {isHi
            ? 'यह विस्तृत जीवन फलादेश महर्षि पाराशर कृत बृहत्पाराशर होराशास्त्र, कल्याण वर्मा कृत सारावली, वराहमिहिर कृत बृहज्जातक एवं मंत्रेश्वर कृत फलदीपिका के शाश्वत सूत्रों पर पूर्णतः आधारित है। सभी गणनाएँ 100% प्रामाणिक वैदिक गणित द्वारा निष्पादित हैं।'
            : 'This comprehensive life dossier is synthesized under the classical authority of Maharishi Parashara (Brihat Parashara Hora Shastra), Kalyana Varma (Saravali), Varahamihira (Brihat Jataka), and Mantreswara (Phaladeepika). 100% computed via authentic offline Vedic astronomical mathematics.'}
        </p>
      </section>
    </div>
  );
};
