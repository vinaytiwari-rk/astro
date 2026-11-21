import React, { useEffect, useMemo, useState } from 'react';
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Compass,
  Flame,
  Grid3x3,
  Heart,
  Info,
  Printer,
  Shield,
  Sparkles,
  Star,
  User,
  Zap,
} from 'lucide-react';
import { computeNumerologyReport, type NumerologyReport } from '../../astro/numerology';
import type { ChartData } from '../../astro/types';
import { useLanguage } from '../../i18n/LanguageContext';
import { DateDmyInput } from '../DateDmyInput';

interface NumerologyViewProps {
  chart: ChartData;
  onNavigate?: (view: string) => void;
}

const LO_SHU_ORDER = [4, 9, 2, 3, 5, 7, 8, 1, 6];

export const NumerologyView: React.FC<NumerologyViewProps> = ({ chart, onNavigate }) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';

  const [name, setName] = useState(chart.input.name || 'जातक');
  const [dob, setDob] = useState(chart.input.date || '1995-06-15');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>(chart.input.gender || 'other');
  const [targetYear, setTargetYear] = useState<number>(() => new Date().getFullYear());

  useEffect(() => {
    setName(chart.input.name || 'जातक');
    setDob(chart.input.date || '1995-06-15');
    setGender(chart.input.gender || 'other');
  }, [chart.input.id, chart.input.name, chart.input.date, chart.input.gender]);

  const report: NumerologyReport = useMemo(
    () => computeNumerologyReport(name, dob, gender, targetYear),
    [name, dob, gender, targetYear]
  );

  const handlePrint = () => {
    window.print();
  };

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
          {isHi ? 'अंकज्योतिष (Numerology)' : 'Vedic & Chaldean Numerology'}
        </span>
      </nav>

      {/* Header Card */}
      <div className="oj-page-header-card">
        <div className="oj-header-badge">
          <Grid3x3 className="w-4 h-4 text-amber-400" />
          <span>{isHi ? 'विशिष्ट ज्योतिष प्रणाली' : 'Advance Astrology Suite'}</span>
        </div>
        <h1 className="oj-page-title">
          {isHi ? 'वैदिक, चालडियन एवं पाइथागोरियन अंकज्योतिष' : 'Vedic, Chaldean & Pythagorean Numerology'}
        </h1>
        <p className="oj-page-subtitle">
          {isHi
            ? `जातक: ${name} | मूलांक, भाग्यांक, नामांक, ३x३ लो-शू ग्रिड, कुआ अंक, पर्सनल ईयर एवं लकी नंबर फलादेश`
            : `Native: ${name} | Complete Root Number (Mulank), Destiny Number (Bhagyank), 3x3 Lo Shu Grid, Kua Number, and Personal Year.`}
        </p>
        <div className="oj-header-actions no-print">
          <button onClick={handlePrint} className="oj-btn-outline">
            <Printer className="w-4 h-4 mr-2" />
            {isHi ? 'प्रिंट रिपोर्ट' : 'Print Report'}
          </button>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('fortune-calculators')}
            className="oj-btn-outline"
          >
            <Heart className="w-4 h-4 mr-2 text-rose-400" />
            {isHi ? 'प्रेम व कर्म कैलकुलेटर →' : 'Love & Karma Calculators →'}
          </button>
        </div>
      </div>

      {/* Interactive Form Card */}
      <div className="sw-card no-print" style={{ marginTop: '16px', marginBottom: '16px' }}>
        <div className="sw-grid-4">
          <div>
            <label className="sw-stat-label" style={{ marginBottom: '6px' }}>
              {isHi ? 'नाम (अक्षर जांच हेतु)' : 'Name (Spelling Test)'}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border-color, #cbd5e1)',
                background: 'var(--bg-subtle, #f8fafc)',
                color: 'var(--text-primary, #0f172a)',
                fontSize: '0.85rem',
              }}
            />
          </div>
          <div>
            <label className="sw-stat-label" style={{ marginBottom: '6px' }}>
              {isHi ? 'जन्म तिथि (DD-MM-YYYY)' : 'Date of Birth (DD-MM-YYYY)'}
            </label>
            <DateDmyInput
              value={dob}
              ariaLabel={isHi ? 'जन्म तिथि' : 'Date of Birth'}
              onChange={setDob}
            />
          </div>
          <div>
            <label className="sw-stat-label" style={{ marginBottom: '6px' }}>
              {isHi ? 'लिंग (कुआ अंक हेतु)' : 'Gender (Kua Number)'}
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as 'male' | 'female' | 'other')}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border-color, #cbd5e1)',
                background: 'var(--bg-subtle, #f8fafc)',
                color: 'var(--text-primary, #0f172a)',
                fontSize: '0.85rem',
              }}
            >
              <option value="male">{isHi ? 'पुरुष' : 'Male'}</option>
              <option value="female">{isHi ? 'महिला' : 'Female'}</option>
              <option value="other">{isHi ? 'अन्य' : 'Other'}</option>
            </select>
          </div>
          <div>
            <label className="sw-stat-label" style={{ marginBottom: '6px' }}>
              {isHi ? 'पर्सनल ईयर वर्ष' : 'Target Year'}
            </label>
            <input
              type="number"
              value={targetYear}
              onChange={(e) => setTargetYear(parseInt(e.target.value, 10) || 2026)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border-color, #cbd5e1)',
                background: 'var(--bg-subtle, #f8fafc)',
                color: 'var(--text-primary, #0f172a)',
                fontSize: '0.85rem',
                fontFamily: 'monospace',
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Numerology Key Numbers Grid */}
      <div className="sw-grid-4" style={{ marginBottom: '20px' }}>
        {/* Mulank */}
        <div className="sw-card" style={{ textAlign: 'center', borderTop: '4px solid #f59e0b' }}>
          <span className="sw-stat-label" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {isHi ? 'मूलांक (Root / Driver)' : 'Mulank (Driver)'}
          </span>
          <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#d97706', fontFamily: 'monospace', margin: '8px 0' }}>
            {report.mulank}
          </div>
          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary, #334155)' }}>
            {isHi ? report.mulankRulerHi : report.mulankRulerEn}
          </div>
        </div>

        {/* Bhagyank */}
        <div className="sw-card" style={{ textAlign: 'center', borderTop: '4px solid #3b82f6' }}>
          <span className="sw-stat-label" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {isHi ? 'भाग्यांक (Destiny / Conductor)' : 'Bhagyank (Conductor)'}
          </span>
          <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#2563eb', fontFamily: 'monospace', margin: '8px 0' }}>
            {report.bhagyank}
          </div>
          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary, #334155)' }}>
            {isHi ? 'जीवन लक्ष्य व संचालक' : 'Destiny Path Conductor'}
          </div>
        </div>

        {/* Chaldean Namank */}
        <div className="sw-card" style={{ textAlign: 'center', borderTop: '4px solid #8b5cf6' }}>
          <span className="sw-stat-label" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {isHi ? 'कीरो (Chaldean) नामांक' : 'Chaldean Name No.'}
          </span>
          <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#7c3aed', fontFamily: 'monospace', margin: '8px 0' }}>
            {report.chaldeanReduced} <span style={{ fontSize: '0.9rem', fontWeight: 400, color: '#94a3b8' }}>({report.chaldeanTotal})</span>
          </div>
          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary, #334155)' }}>
            {isHi ? 'पाइथागोरस नामांक:' : 'Pythagorean:'} {report.pythagoreanReduced}
          </div>
        </div>

        {/* Kua Number */}
        <div className="sw-card" style={{ textAlign: 'center', borderTop: '4px solid #10b981' }}>
          <span className="sw-stat-label" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {isHi ? 'कुआ अंक व पर्सनल ईयर' : 'Kua & Personal Year'}
          </span>
          <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#059669', fontFamily: 'monospace', margin: '8px 0' }}>
            {report.kuaNumber}
          </div>
          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary, #334155)' }}>
            {isHi ? `पर्सनल ईयर ${report.personalYear}` : `Personal Year ${report.personalYear}`}
          </div>
        </div>
      </div>

      {/* Lo Shu Grid & Detailed Predictions */}
      <div className="sw-grid-2" style={{ gap: '20px' }}>
        {/* Left: 3x3 Lo Shu Grid & Planes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="sw-card">
            <div className="sw-card-header">
              <span className="sw-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Grid3x3 className="w-5 h-5 text-amber-500" />
                {isHi ? '३x३ लो-शू अंक ग्रिड (Lo Shu Magic Square)' : '3x3 Lo Shu Magic Square Grid'}
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0 0 14px 0', lineHeight: 1.5 }}>
              {isHi
                ? 'जन्म तिथि के अंकों की आवृत्ति आपके बौद्धिक, भावनात्मक एवं व्यावहारिक तलों को प्रकट करती है:'
                : 'Presence and repetition of natal digits reveal conscious strengths and blind spots:'}
            </p>

            {/* Authentic 3x3 Magic Square Matrix */}
            <div className="loshu-container">
              <div className="loshu-grid-3x3">
                {LO_SHU_ORDER.map((digit) => {
                  const count = report.loShuCounts[digit] || 0;
                  return (
                    <div
                      key={digit}
                      className={`loshu-cell ${count > 0 ? 'is-present' : ''}`}
                    >
                      <span className="loshu-cell-digit">{digit}</span>
                      <span className="loshu-cell-freq">
                        {count > 0 ? (isHi ? `${count} बार` : `x${count}`) : '—'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div className="loshu-plane-row">
                <span><strong>{isHi ? 'मानसिक तल (4, 9, 2):' : 'Mental Plane (4, 9, 2):'}</strong></span>
                <span>{isHi ? 'मेधा व तार्किक स्मृति' : 'Analytical intellect'}</span>
              </div>
              <div className="loshu-plane-row">
                <span><strong>{isHi ? 'भावनात्मक तल (3, 5, 7):' : 'Emotional Plane (3, 5, 7):'}</strong></span>
                <span>{isHi ? 'संवेदना व आत्मिक बल' : 'Emotional intuition'}</span>
              </div>
              <div className="loshu-plane-row">
                <span><strong>{isHi ? 'व्यावहारिक तल (8, 1, 6):' : 'Practical Plane (8, 1, 6):'}</strong></span>
                <span>{isHi ? 'कर्मठता व धन संचय' : 'Material execution'}</span>
              </div>
            </div>
          </div>

          {/* Lucky Attributes */}
          <div className="sw-card">
            <div className="sw-card-header">
              <span className="sw-card-title">
                {isHi ? 'शुभ अंक, रंग, दिन एवं दिशाएं' : 'Favorable Vibrations'}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-color, #e2e8f0)' }}>
                <span style={{ color: '#64748b' }}>{isHi ? 'अनुकूल अंक:' : 'Compatible Numbers:'}</span>
                <strong style={{ color: '#b45309', fontFamily: 'monospace' }}>{report.compatibleNumbers.join(', ')}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-color, #e2e8f0)' }}>
                <span style={{ color: '#64748b' }}>{isHi ? 'शुभ दिन:' : 'Lucky Days:'}</span>
                <span style={{ fontWeight: 600 }}>{isHi ? report.luckyDaysHi : report.luckyDaysEn}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-color, #e2e8f0)' }}>
                <span style={{ color: '#64748b' }}>{isHi ? 'शुभ रंग:' : 'Lucky Colors:'}</span>
                <span style={{ fontWeight: 600 }}>{isHi ? report.luckyColorsHi : report.luckyColorsEn}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                <span style={{ color: '#64748b' }}>{isHi ? 'कुआ शुभ दिशाएं:' : 'Kua Auspicious Vectors:'}</span>
                <span style={{ fontWeight: 600 }}>{isHi ? report.kuaDirectionsHi : report.kuaDirectionsEn}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Detailed Predictions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Mulank & Bhagyank Synthesis */}
          <div className="sw-card">
            <div className="sw-card-header">
              <span className="sw-card-title">
                {isHi ? 'मूलांक व्यक्तित्व एवं स्वभाव' : 'Mulank Personality Profile'}
              </span>
            </div>
            <p style={{ fontSize: '0.88rem', lineHeight: 1.6, color: 'var(--text-primary, #334155)', margin: '0 0 16px 0' }}>
              {isHi ? report.mulankProfileHi : report.mulankProfileEn}
            </p>
            <div className="sw-card-header">
              <span className="sw-card-title">
                {isHi ? 'भाग्यांक जीवन लक्ष्य एवं कर्म' : 'Bhagyank Destiny Path'}
              </span>
            </div>
            <p style={{ fontSize: '0.88rem', lineHeight: 1.6, color: 'var(--text-primary, #334155)', margin: 0 }}>
              {isHi ? report.bhagyankProfileHi : report.bhagyankProfileEn}
            </p>
          </div>

          {/* Name Compatibility */}
          <div className="sw-card">
            <div className="sw-card-header">
              <span className="sw-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles className="w-4 h-4 text-amber-500" />
                {isHi ? 'नाम अनुकूलता एवं स्पंदन (Name Vibration Compatibility)' : 'Name Vibration Compatibility'}
              </span>
            </div>
            <p style={{ fontSize: '0.88rem', lineHeight: 1.6, color: 'var(--text-primary, #334155)', margin: '0 0 12px 0' }}>
              {isHi ? report.nameCompatibilityHi : report.nameCompatibilityEn}
            </p>
            <div style={{
              padding: '12px',
              borderRadius: '8px',
              background: 'rgba(245, 158, 11, 0.08)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              fontSize: '0.84rem',
              lineHeight: 1.5,
              color: 'var(--text-primary, #78350f)',
            }}>
              <strong>{isHi ? 'शास्त्रीय परामर्श:' : 'Guidance:'}</strong>{' '}
              {isHi
                ? `आपका कीरो नामांक ${report.chaldeanReduced} है। यदि नामांक और भाग्यांक (${report.bhagyank}) में नैसर्गिक सामंजस्य है, तो जीवन में अवरोध स्वतः दूर होते हैं।`
                : `Your Chaldean Name Number is ${report.chaldeanReduced}. Harmony between Name Number and Destiny Number (${report.bhagyank}) creates smooth career momentum.`}
            </div>
          </div>

          {/* Missing Numbers Remedies */}
          {report.missingNumbers.length > 0 && (
            <div className="sw-card">
              <div className="sw-card-header">
                <span className="sw-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Shield className="w-4 h-4 text-emerald-500" />
                  {isHi ? 'लो-शू ग्रिड में अनुपस्थित अंक एवं संतुलन उपाय' : 'Missing Numbers & Remedial Balances'}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {report.missingNumbers.map((m) => (
                  <div key={m.digit} style={{
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: 'var(--bg-subtle, #f8fafc)',
                    border: '1px solid var(--border-color, #e2e8f0)',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#b45309', fontFamily: 'monospace' }}>
                        {isHi ? `अंक ${m.digit} अनुपस्थित` : `Missing #${m.digit}`} ({isHi ? m.planetHi : m.planetEn})
                      </span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 4px 0', lineHeight: 1.4 }}>
                      {isHi ? m.impactHi : m.impactEn}
                    </p>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-primary, #0f172a)', margin: 0, lineHeight: 1.4 }}>
                      <strong>{isHi ? 'उपाय:' : 'Remedy:'}</strong> {isHi ? m.remedyHi : m.remedyEn}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
