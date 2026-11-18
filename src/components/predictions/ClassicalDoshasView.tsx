import React, { useMemo, useState } from 'react';
import {
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  Compass,
  Flame,
  Info,
  Layers,
  Printer,
  Shield,
  ShieldAlert,
  Sparkles,
  Zap,
} from 'lucide-react';
import {
  computeClassicalDoshas,
  type ClassicalDoshaItem,
  type ClassicalDoshasReport,
} from '../../astro/predictions/classicalDoshasEngine';
import type { ChartData } from '../../astro/types';
import { useLanguage } from '../../i18n/LanguageContext';

interface ClassicalDoshasViewProps {
  chart: ChartData;
  onNavigate?: (view: string) => void;
}

export const ClassicalDoshasView: React.FC<ClassicalDoshasViewProps> = ({ chart, onNavigate }) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';

  const [filterMode, setFilterMode] = useState<'all' | 'active' | 'cancelled'>('all');

  const report: ClassicalDoshasReport = useMemo(() => {
    return computeClassicalDoshas(chart);
  }, [chart]);

  const displayedDoshas = useMemo(() => {
    if (filterMode === 'active') {
      return report.doshas.filter((d) => d.present && d.severity !== 'Cancelled / Nullified');
    }
    if (filterMode === 'cancelled') {
      return report.doshas.filter((d) => d.present && d.severity === 'Cancelled / Nullified');
    }
    return report.doshas;
  }, [report, filterMode]);

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
          {isHi ? '१८ शास्त्रीय दोष, सक्रियता आयु व भंग निर्णय' : '18 Classical Doshas & Cancellation Engine'}
        </span>
      </nav>

      {/* Header Card */}
      <div className="oj-page-header-card">
        <div className="oj-header-badge">
          {isHi
            ? 'कालसर्प, मांगलिक भंग (16 नियम), पितृ, चांडाल, अंगारक एवं केमद्रुम निर्णय'
            : 'Authentic Shastric Auditing of 18 Classical Doshas & 16 Kuja Dosha Cancellations'}
        </div>
        <h1 className="oj-page-title">
          {isHi
            ? '१८ शास्त्रीय दोष एवं उनकी सक्रियता आयु का यथार्थ विश्लेषण'
            : '18 Classical Doshas, Exact Active Milestones & Nullifications'}
        </h1>
        <p className="oj-page-subtitle">
          {isHi
            ? 'केवल दोष का नाम बताकर भयभीत करना नहीं, बल्कि बृहत् पराशर और बृहत् जातक के शास्त्रीय नियमों के अनुसार यह जांचना कि दोष वास्तव में सक्रिय है या किसी योग द्वारा पूर्णतः भंग हो चुका है।'
            : 'No unscientific scaremongering. Evaluates whether classical doshas are genuinely active or have been nullified by authentic Parashari cancellation yogas, detailing exact active age windows.'}
        </p>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', marginTop: '14px' }}>
          <button
            onClick={() => window.print()}
            className="oj-action-btn no-print"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Printer size={15} />
            <span>{isHi ? 'दोष रिपोर्ट प्रिंट करें' : 'Print Dosha Audit'}</span>
          </button>
        </div>
      </div>

      {/* Summary Score Banner */}
      <div
        className="oj-card"
        style={{
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          border: '1px solid #cbd5e1',
          marginBottom: '16px',
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
          <div>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
              {isHi ? 'कुल परखे गए दोष' : 'Audited Doshas'}
            </div>
            <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#1e293b', marginTop: '2px' }}>
              {report.doshas.length}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '11px', color: '#b91c1c', fontWeight: 600, textTransform: 'uppercase' }}>
              {isHi ? 'सक्रिय एवं प्रभावी दोष' : 'Active & Effective'}
            </div>
            <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#b91c1c', marginTop: '2px' }}>
              {report.activeDoshasCount}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '11px', color: '#15803d', fontWeight: 600, textTransform: 'uppercase' }}>
              {isHi ? 'शास्त्रीय रूप से भंग / निष्प्रभावी' : 'Cancelled / Nullified'}
            </div>
            <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#15803d', marginTop: '2px' }}>
              {report.cancelledDoshasCount}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '11px', color: '#b45309', fontWeight: 600, textTransform: 'uppercase' }}>
              {isHi ? 'दोष तीव्रता सूचकांक' : 'Dosha Pressure Index'}
            </div>
            <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#b45309', marginTop: '2px' }}>
              {report.overallDoshaScore} / 100
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button
          onClick={() => setFilterMode('all')}
          className={`oj-tab-pill ${filterMode === 'all' ? 'is-active' : ''}`}
        >
          {isHi ? 'समस्त दोष' : 'All Doshas'} ({report.doshas.length})
        </button>
        <button
          onClick={() => setFilterMode('active')}
          className={`oj-tab-pill ${filterMode === 'active' ? 'is-active' : ''}`}
        >
          {isHi ? 'सक्रिय दोष' : 'Active Doshas'} ({report.activeDoshasCount})
        </button>
        <button
          onClick={() => setFilterMode('cancelled')}
          className={`oj-tab-pill ${filterMode === 'cancelled' ? 'is-active' : ''}`}
        >
          {isHi ? 'भंग / निष्प्रभावी' : 'Cancelled / Nullified'} ({report.cancelledDoshasCount})
        </button>
      </div>

      {/* Doshas Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        {displayedDoshas.map((d) => {
          const isCancelled = d.severity === 'Cancelled / Nullified';
          const isSevere = d.severity === 'Severe';

          return (
            <div
              key={d.id}
              className="oj-card"
              style={{
                borderLeft: `5px solid ${isCancelled ? '#22c55e' : isSevere ? '#ef4444' : '#f59e0b'}`,
                background: isCancelled ? '#fafdf7' : '#ffffff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a' }}>
                    {isHi ? d.nameHi : d.nameEn}
                  </h3>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                    {isHi ? 'सक्रियता काल:' : 'Active Period:'} {isHi ? d.activeAgeYearsHi : d.activeAgeYears}
                  </div>
                </div>

                <span
                  style={{
                    background: isCancelled ? '#dcfce7' : isSevere ? '#fee2e2' : '#fef3c7',
                    color: isCancelled ? '#15803d' : isSevere ? '#b91c1c' : '#b45309',
                    padding: '3px 8px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: 'bold',
                  }}
                >
                  {isHi ? d.severityHi : d.severity}
                </span>
              </div>

              {/* Astrological Basis */}
              <div style={{ background: '#f8fafc', padding: '8px', borderRadius: '6px', fontSize: '11px', color: '#334155', marginBottom: '8px' }}>
                <strong>{isHi ? 'शास्त्रीय ग्रहीय स्थिति:' : 'Astrological Basis:'}</strong> {isHi ? d.astrologicalBasisHi : d.astrologicalBasisEn}
              </div>

              {/* Cancellation Note */}
              <div
                style={{
                  background: isCancelled ? '#f0fdf4' : '#fffbeb',
                  border: `1px solid ${isCancelled ? '#bbf7d0' : '#fef08a'}`,
                  padding: '8px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  color: isCancelled ? '#166534' : '#854d0e',
                  marginBottom: '8px',
                }}
              >
                <strong>{isHi ? 'भंग व निष्प्रभाव निर्णय:' : 'Cancellation Verdict:'}</strong> {isHi ? d.cancellationNoteHi : d.cancellationNoteEn}
              </div>

              {/* Manifestation */}
              <div style={{ fontSize: '11px', color: '#475569', marginBottom: '8px' }}>
                <strong>{isHi ? 'प्रकट होने वाला प्रभाव:' : 'Manifestation:'}</strong> {isHi ? d.manifestationHi : d.manifestationEn}
              </div>

              {/* Shastric Remedy */}
              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '8px', fontSize: '11px', color: '#0369a1' }}>
                <strong>{isHi ? 'शास्त्रीय परिहार व उपाय:' : 'Shastric Remedy:'}</strong> {isHi ? d.shastricRemedyHi : d.shastricRemedyEn}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ClassicalDoshasView;
