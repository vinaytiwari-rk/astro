import React, { useMemo } from 'react';
import {
  Award,
  BookOpen,
  CheckCircle2,
  Compass,
  Flame,
  Printer,
  Shield,
  Sparkles,
  User,
} from 'lucide-react';
import {
  computeSamudrikaShastra,
  type SamudrikaShastraReport,
} from '../../astro/samudrikaShastra';
import type { ChartData } from '../../astro/types';
import { useLanguage } from '../../i18n/LanguageContext';

interface SamudrikaShastraViewProps {
  chart: ChartData;
  onNavigate?: (view: string) => void;
}

export const SamudrikaShastraView: React.FC<SamudrikaShastraViewProps> = ({ chart, onNavigate }) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';

  const report: SamudrikaShastraReport = useMemo(() => {
    return computeSamudrikaShastra(chart);
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
          {isHi ? 'सामुद्रिक शास्त्र एवं हस्तरेखा' : 'Samudrika Shastra & Palmistry'}
        </span>
      </nav>

      {/* Header Card */}
      <div className="oj-page-header-card">
        <div className="oj-header-badge">
          {isHi
            ? 'महर्षि भृगु व वराहमिहिर सामुद्रिक रहस्य आधारित हस्तरेखा व कुंडली समन्वय'
            : 'Samudrika Shastra Corroboration: Palm Lines, Planetary Mounts & Sacred Marks'}
        </div>
        <h1 className="oj-page-title">
          {isHi
            ? 'सामुद्रिक शास्त्र — हस्तरेखा, पर्वत एवं शुभ चिन्ह समन्वय'
            : 'Samudrika Shastra — Palmistry & Body Marks Corroborator'}
        </h1>
        <p className="oj-page-subtitle">
          {isHi
            ? `${chart.input.name} की जन्म कुंडली के लग्न, सूर्य, गुरु व शनि की स्थिति के आधार पर हथेली की 5 प्रमुख रेखाओं, 6 ग्रहीय पर्वतों एवं मत्स्य-त्रिशूल-पद्म जैसे पवित्र चिन्हों का प्रामाणिक मिलान।`
            : `Astrological corroboration of ${chart.input.name}'s natal planetary strengths against the 5 primary palm lines, 6 planetary mounts, and sacred marks (Matsya, Trishula, Padma).`}
        </p>

        <div className="oj-page-actions-bar no-print">
          <button type="button" className="oj-action-btn secondary" onClick={() => window.print()}>
            <Printer size={14} />
            <span>{isHi ? 'हस्तरेखा विवरण प्रिंट करें' : 'Print Palmistry Dossier'}</span>
          </button>
        </div>
      </div>

      {/* Hand Geometry Card */}
      <div className="oj-card" style={{ padding: '20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--text)' }}>
              {isHi ? 'हस्त संरचना एवं तत्त्व विश्लेषण' : 'Hand Geometry & Element Profile'}
            </h2>
            <p style={{ margin: '3px 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
              {isHi ? `लग्न राशि: ${report.lagnaSignHi}` : `Ascendant Sign: ${report.lagnaSign}`}
            </p>
          </div>
          <div
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              fontWeight: 700,
              fontSize: '13px',
              background: 'rgba(37, 99, 235, 0.1)',
              color: '#2563eb',
              border: '1px solid rgba(37, 99, 235, 0.25)',
            }}
          >
            {isHi ? report.handTypeHi : report.handType}
          </div>
        </div>
        <p style={{ margin: '12px 0 0', fontSize: '13.5px', lineHeight: 1.6, color: 'var(--text)' }}>
          {isHi ? report.overallCompatibilitySummaryHi : report.overallCompatibilitySummaryEn}
        </p>
      </div>

      {/* 5 Core Palm Lines */}
      <div className="oj-card" style={{ padding: '20px', marginBottom: '20px' }}>
        <h2 style={{ margin: '0 0 16px', fontSize: '18px', fontWeight: 700, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={18} color="var(--accent)" />
          <span>{isHi ? 'पंच मुख्य हस्त रेखाएं एवं ज्योतिषीय संबंध' : '5 Primary Palm Lines & Planetary Correspondences'}</span>
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          {report.palmLines.map((line) => (
            <div
              key={line.lineId}
              style={{
                background: 'var(--bg-subtle)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '14px', color: 'var(--text)' }}>
                  {isHi ? line.nameHi : line.nameEn}
                </strong>
                <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#059669' }}>
                  {line.strengthPercentage}%
                </span>
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--accent)', fontWeight: 600 }}>
                {isHi ? line.astrologicalLinkHi : line.astrologicalLinkEn}
              </div>
              <p style={{ margin: 0, fontSize: '12.5px', lineHeight: 1.5, color: 'var(--text)' }}>
                {isHi ? line.statusInNativeChartHi : line.statusInNativeChartEn}
              </p>
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)', paddingTop: '6px', marginTop: '2px' }}>
                {isHi ? line.significanceHi : line.significanceEn}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6 Planetary Mounts */}
      <div className="oj-card" style={{ padding: '20px', marginBottom: '20px' }}>
        <h2 style={{ margin: '0 0 16px', fontSize: '18px', fontWeight: 700, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Compass size={18} color="#2563eb" />
          <span>{isHi ? 'षड् ग्रहीय पर्वत एवं शारीरिक उभार' : 'Planetary Mounts Elevation Profile'}</span>
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
          {report.palmMounts.map((m) => (
            <div
              key={m.mountId}
              style={{
                background: 'var(--bg-subtle)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '14px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <strong style={{ fontSize: '13.5px', color: 'var(--text)' }}>
                  {isHi ? m.mountNameHi : m.mountNameEn}
                </strong>
                <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', background: 'rgba(5, 150, 105, 0.1)', color: '#059669' }}>
                  {isHi ? m.elevationExpectedHi : m.elevationExpected}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '12.5px', lineHeight: 1.5, color: 'var(--text)' }}>
                {isHi ? m.physicalManifestationHi : m.physicalManifestationEn}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Sacred Marks (Matsya, Trishula, Padma) */}
      <div className="oj-card" style={{ padding: '20px' }}>
        <h2 style={{ margin: '0 0 14px', fontSize: '18px', fontWeight: 700, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Award size={18} color="#b45309" />
          <span>{isHi ? 'पवित्र सामुद्रिक चिन्ह (मत्स्य, त्रिशूल, पद्म)' : 'Sacred Auspicious Marks (Matsya, Trishula, Lotus)'}</span>
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          {report.sacredMarks.map((s) => (
            <div
              key={s.symbolName}
              style={{
                background: 'rgba(180, 83, 9, 0.06)',
                border: '1.5px solid rgba(180, 83, 9, 0.3)',
                borderRadius: '8px',
                padding: '14px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <strong style={{ fontSize: '14px', color: '#b45309' }}>
                  {isHi ? s.symbolNameHi : s.symbolName}
                </strong>
                <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', background: '#b45309', color: '#fff' }}>
                  {isHi ? s.presenceProbabilityHi : s.presenceProbability}
                </span>
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                {isHi ? `स्थान: ${s.locationOnPalmHi}` : `Location: ${s.locationOnPalm}`}
              </div>
              <p style={{ margin: 0, fontSize: '12.5px', lineHeight: 1.5, color: 'var(--text)' }}>
                {isHi ? s.destinyFruitHi : s.destinyFruitEn}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
