import React, { useMemo } from 'react';
import {
  Award,
  BookOpen,
  Briefcase,
  CheckCircle2,
  Compass,
  DollarSign,
  Flame,
  Printer,
  Shield,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import {
  computeFinancialAstrology,
  type FinancialAstrologyReport,
} from '../../astro/financialAstrology';
import type { ChartData } from '../../astro/types';
import { useLanguage } from '../../i18n/LanguageContext';

interface FinancialAstrologyViewProps {
  chart: ChartData;
  onNavigate?: (view: string) => void;
}

export const FinancialAstrologyView: React.FC<FinancialAstrologyViewProps> = ({ chart, onNavigate }) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';

  const report: FinancialAstrologyReport = useMemo(() => {
    return computeFinancialAstrology(chart);
  }, [chart]);

  return (
    <div className="oj-page-container">
      {/* Breadcrumbs */}
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
          {isHi ? 'वित्तीय व शेयर बाजार ज्योतिष' : 'Financial & Business Astrology'}
        </span>
      </nav>

      {/* Header Card */}
      <div className="oj-page-header-card">
        <div className="oj-header-badge">
          {isHi
            ? 'इंदु लग्न (कुबेर संपदा), पराशरीय धन योग एवं उद्योग क्षेत्र अनुकूलता'
            : 'Indu Lagna Wealth Barometer, Classical Dhana Yogas & Industry Sector Affinities'}
        </div>
        <h1 className="oj-page-title">
          {isHi
            ? 'वित्तीय ज्योतिष, व्यापार क्षेत्र एवं शेयर मार्केट योग'
            : 'Financial Astrology, Wealth Yogas & Market Investments'}
        </h1>
        <p className="oj-page-subtitle">
          {isHi
            ? `${chart.input.name} की कुंडली में इंदु लग्न, द्वितीय-एकादश भाव संबंध, धन योग, सट्टेबाजी/ट्रेडिंग जोखिम स्तर एवं सर्वाधिक लाभप्रद व्यापारिक क्षेत्रों का संपूर्ण शास्त्रीय विश्लेषण।`
            : `Comprehensive classical evaluation of ${chart.input.name}'s Indu Lagna, Dhana Yogas, speculative market suitability, and top wealth-generating business sectors.`}
        </p>

        <div className="oj-page-actions-bar no-print">
          <button type="button" className="oj-action-btn secondary" onClick={() => window.print()}>
            <Printer size={14} />
            <span>{isHi ? 'रिपोर्ट प्रिंट करें' : 'Print Financial Dossier'}</span>
          </button>
        </div>
      </div>

      {/* Scorecards */}
      <div className="oj-scorecard-strip">
        <div className="oj-score-card highly-favorable">
          <span className="oj-score-num">{report.wealthIndex} / 100</span>
          <span className="oj-score-lbl">{isHi ? 'समग्र धन सामर्थ्य सूचकांक' : 'Overall Wealth Index'}</span>
        </div>
        <div className="oj-score-card favorable">
          <span className="oj-score-num">{isHi ? report.primaryWealthControllerHi : report.primaryWealthController}</span>
          <span className="oj-score-lbl">{isHi ? 'मुख्य धन नियंत्रक ग्रह' : 'Wealth Controller Planet'}</span>
        </div>
        <div className="oj-score-card mixed">
          <span className="oj-score-num">{report.speculativeRiskScore} / 100</span>
          <span className="oj-score-lbl">{isHi ? 'सट्टा / ट्रेडिंग आकर्षण' : 'Speculative Appetite'}</span>
        </div>
      </div>

      {/* Section 1: Indu Lagna (Wealth Ascendant) */}
      <div className="oj-card" style={{ padding: '20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--text)' }}>
              {isHi ? 'इंदु लग्न — कुबेर संपदा विश्लेषण' : 'Indu Lagna — Celestial Wealth Barometer'}
            </h2>
            <p style={{ margin: '3px 0 0', fontSize: '12.5px', color: 'var(--text-muted)' }}>
              {isHi
                ? `लग्न व चंद्र से नवमेशों की कला रश्मियों (Kalas) के योग से निर्धारित इंदु लग्न: ${report.induLagna.induLagnaSignHi}`
                : `Planetary ray calculus (BPHS Ch. 41) yields Indu Lagna in ${report.induLagna.induLagnaSignName}`}
            </p>
          </div>

          <div
            style={{
              padding: '4px 12px',
              borderRadius: '20px',
              fontWeight: 700,
              fontSize: '12.5px',
              background: 'rgba(5, 150, 105, 0.12)',
              color: '#059669',
              border: '1px solid rgba(5, 150, 105, 0.3)',
            }}
          >
            {isHi ? report.induLagna.wealthPotentialHi : report.induLagna.wealthPotential}
          </div>
        </div>

        <p style={{ margin: 0, fontSize: '13.5px', lineHeight: 1.6, color: 'var(--text)' }}>
          {isHi ? report.induLagna.explanationHi : report.induLagna.explanationEn}
        </p>
      </div>

      {/* Section 2: Classical Dhana Yogas */}
      <div className="oj-card" style={{ padding: '20px', marginBottom: '20px' }}>
        <h2 style={{ margin: '0 0 14px', fontSize: '18px', fontWeight: 700, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={18} color="var(--accent)" />
          <span>{isHi ? 'कुंडली में सक्रिय शास्त्रीय धन योग' : 'Active Classical Dhana Yogas'}</span>
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          {report.dhanaYogas.map((y) => (
            <div
              key={y.yogaName}
              style={{
                background: 'var(--bg-subtle)',
                border: y.isTriggered ? '1.5px solid var(--accent)' : '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '14px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <strong style={{ fontSize: '13.5px', color: 'var(--text)' }}>
                  {isHi ? y.yogaNameHi : y.yogaName}
                </strong>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: y.isTriggered ? 'rgba(5, 150, 105, 0.15)' : 'rgba(100, 116, 139, 0.15)',
                    color: y.isTriggered ? '#059669' : 'var(--text-muted)',
                  }}
                >
                  {y.isTriggered ? (isHi ? 'सक्रिय' : 'Active') : (isHi ? 'निष्क्रिय' : 'Inactive')}
                </span>
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--accent)', fontWeight: 600, marginBottom: '6px' }}>
                {y.participatingLords}
              </div>
              <p style={{ margin: 0, fontSize: '12.5px', lineHeight: 1.5, color: 'var(--text)' }}>
                {isHi ? y.explanationHi : y.explanationEn}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Speculative Risk Assessment (Day Trading vs SIP) */}
      <div className="oj-card" style={{ padding: '20px', marginBottom: '20px' }}>
        <h2 style={{ margin: '0 0 10px', fontSize: '18px', fontWeight: 700, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingUp size={18} color="#2563eb" />
          <span>{isHi ? 'शेयर बाजार, ट्रेडिंग व सट्टेबाजी जोखिम मूल्यांकन' : 'Stock Market, Trading & Speculation Assessment'}</span>
        </h2>
        <div
          style={{
            background: 'rgba(37, 99, 235, 0.08)',
            border: '1px solid rgba(37, 99, 235, 0.25)',
            borderRadius: '8px',
            padding: '14px 18px',
            marginBottom: '10px',
          }}
        >
          <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#2563eb', marginBottom: '4px' }}>
            {isHi ? `ट्रेडिंग जोखिम अंक: ${report.speculativeRiskScore} / 100` : `Trading Risk Index: ${report.speculativeRiskScore} / 100`}
          </div>
          <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.6, color: 'var(--text)' }}>
            {isHi ? report.speculationAdviceHi : report.speculationAdviceEn}
          </p>
        </div>
      </div>

      {/* Section 4: Industry & Business Sector Affinities */}
      <div className="oj-card" style={{ padding: '20px', marginBottom: '20px' }}>
        <h2 style={{ margin: '0 0 14px', fontSize: '18px', fontWeight: 700, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Briefcase size={18} color="#b45309" />
          <span>{isHi ? 'सर्वाधिक लाभप्रद व्यावसायिक क्षेत्र (Sector Affinities)' : 'Top Wealth-Generating Business Sectors'}</span>
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
          {report.topSectors.map((s) => (
            <div
              key={s.sectorNameEn}
              style={{
                background: 'var(--bg-subtle)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '14px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <strong style={{ fontSize: '13.5px', color: 'var(--text)' }}>
                  {isHi ? s.sectorNameHi : s.sectorNameEn}
                </strong>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#059669' }}>
                  {s.suitabilityScore}%
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '12.5px', lineHeight: 1.5, color: 'var(--text)' }}>
                {isHi ? s.verdictHi : s.verdictEn}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Section 5: Financial Remedies */}
      <div className="oj-card" style={{ padding: '20px' }}>
        <h2 style={{ margin: '0 0 10px', fontSize: '18px', fontWeight: 700, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Award size={18} color="#059669" />
          <span>{isHi ? 'शास्त्रीय धन आकर्षण एवं समृद्धि उपाय' : 'Classical Wealth & Prosperity Protocols'}</span>
        </h2>
        <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: 1.8, fontSize: '13.5px', color: 'var(--text)' }}>
          {(isHi ? report.financialRemediesHi : report.financialRemediesEn).map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
