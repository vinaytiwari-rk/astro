/**
 * NumerologyView.tsx
 * Complete Vedic, Chaldean, Pythagorean Numerology & 3x3 Lo Shu Grid Engine.
 * Automatically analyzes the active native's birth chart with zero manual entry required.
 */

import React, { useMemo, useState } from 'react';
import {
  Activity,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Compass,
  Edit3,
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
import { formatDateDmy, formatDateTimeDmyAmPm } from '../../astro/time';
import type { ChartData } from '../../astro/types';
import { useLanguage } from '../../i18n/LanguageContext';
import { DateDmyInput } from '../DateDmyInput';

interface NumerologyViewProps {
  chart: ChartData;
  onNavigate?: (view: string) => void;
}

// 3x3 Lo Shu Matrix Order:
// Row 1: 4, 9, 2 (Southeast, South, Southwest)
// Row 2: 3, 5, 7 (East, Center, West)
// Row 3: 8, 1, 6 (Northeast, North, Northwest)
const LO_SHU_ORDER = [4, 9, 2, 3, 5, 7, 8, 1, 6];

export const NumerologyView: React.FC<NumerologyViewProps> = ({ chart, onNavigate }) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';

  // Toggle for What-If Testing (Closed by default to prioritize Kundali data)
  const [showWhatIf, setShowWhatIf] = useState<boolean>(false);

  // Default values locked directly to the active native's kundali
  const [testName, setTestName] = useState<string>(chart.input.name || 'जातक');
  const [testDob, setTestDob] = useState<string>(chart.input.date || '2000-01-01');
  const [testGender, setTestGender] = useState<'male' | 'female' | 'other'>(chart.input.gender || 'other');
  const [testYear, setTestYear] = useState<number>(() => new Date().getFullYear());

  // Use test values only if What-If toggle is active, otherwise strictly use active chart
  const activeName = showWhatIf ? testName : (chart.input.name || 'जातक');
  const activeDob = showWhatIf ? testDob : (chart.input.date || '2000-01-01');
  const activeGender = showWhatIf ? testGender : (chart.input.gender || 'other');
  const activeTargetYear = showWhatIf ? testYear : new Date().getFullYear();

  const report: NumerologyReport = useMemo(
    () => computeNumerologyReport(activeName, activeDob, activeGender, activeTargetYear),
    [activeName, activeDob, activeGender, activeTargetYear]
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="sw-chassis" style={{ maxWidth: '1240px', margin: '0 auto 24px auto' }}>
      {/* ── 1. Software Titlebar ── */}
      <div className="sw-titlebar">
        <div className="sw-title-left">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="sw-badge sw-badge-warning">
              {isHi ? 'वैदिक अंकशास्त्र एवं लो-शू चक्र' : 'Vedic & Lo Shu Numerology Engine'}
            </span>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
              Vedic Mulank · Bhagyank · Chaldean Namank · 3×3 Lo Shu Grid · 8 Planes &amp; Rajayogas
            </span>
          </div>
          <h2>
            {isHi
              ? 'वैदिक, चालडियन एवं ३x३ लो-शू अंक ज्योतिष कार्यशाला'
              : 'Vedic, Chaldean & 3×3 Lo Shu Numerology Workstation'}
          </h2>
          <p>
            {isHi
              ? 'जन्म कुंडली के आधार पर मूलांक, भाग्यांक, कीरो नामांक, ३x३ लो-शू चक्र, ८ राजयोग बाण एवं वर्ष फल का पूर्ण फलादेश।'
              : 'Automated numerological synthesis: Root (Mulank), Destiny (Bhagyank), Chaldean name vibration, 3x3 Lo Shu magic square & personal year.'}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div className="sw-native-pill">
            {chart.input.name} ({formatDateTimeDmyAmPm(chart.input.date, chart.input.time)})
          </div>
          <button
            type="button"
            onClick={handlePrint}
            className="no-print"
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: '#f8fafc',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Printer className="w-3.5 h-3.5" />
            {isHi ? 'प्रिंट रिपोर्ट' : 'Print Report'}
          </button>
        </div>
      </div>

      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* ── 2. Direct Kundali Numerological Core Banner ── */}
        <div className="sw-purpose-box">
          <h4>
            <Compass className="h-4 w-4" />
            {isHi
              ? `जातक ${chart.input.name} का संपूर्ण अंकशास्त्रीय परिचय (जन्म तिथि: ${formatDateDmy(chart.input.date)})`
              : `Native Numerological Synthesis for ${chart.input.name} (DOB: ${formatDateDmy(chart.input.date)})`}
          </h4>
          <p>
            {isHi
              ? `आपकी जन्म तिथि के अनुसार आपका मूलांक ${report.mulank} (${report.mulankRulerHi}) है जो आपकी आत्मा की मौलिक प्रेरणा और अंतर्मन का प्रतीक है। आपका भाग्यांक ${report.bhagyank} है जो आपके जीवन की मुख्य दिशा और कर्मक्षेत्र को निर्धारित करता है। आपके नाम की चालडियन (कीरो) संख्या ${report.chaldeanReduced} है।`
              : `According to your natal horoscope, your Root Number (Mulank) is ${report.mulank} ruled by ${report.mulankRulerEn}, governing your innate temperament, core drive, and identity. Your Destiny Number (Bhagyank) is ${report.bhagyank}, steering your outer career karma. Your Chaldean name vibration is ${report.chaldeanReduced}.`}
          </p>
          <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px dashed rgba(217, 119, 6, 0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <span>
              <strong>{isHi ? 'नाम एवं भाग्यांक सामंजस्य: ' : 'Name & Destiny Harmony: '}</strong>
              {isHi ? report.nameCompatibilityHi : report.nameCompatibilityEn}
            </span>
            <span className="sw-badge sw-badge-warning">
              {isHi ? `पर्सनल ईयर ${report.personalYear} चालू` : `Personal Year ${report.personalYear} Active`}
            </span>
          </div>
        </div>

        {/* ── 3. Six Master Numerology Cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
          {/* Mulank */}
          <div className="sw-card" style={{ textAlign: 'center', borderTop: '4px solid #f59e0b', background: 'var(--bg-card, #ffffff)' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b' }}>
              {isHi ? 'मूलांक (Driver / जन्मांक)' : 'Mulank (Driver / Root)'}
            </span>
            <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#d97706', fontFamily: 'monospace', margin: '4px 0' }}>
              {report.mulank}
            </div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary, #0f172a)' }}>
              {isHi ? report.mulankRulerHi : report.mulankRulerEn}
            </div>
            <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>
              {isHi ? 'आत्मिक प्रेरणा व व्यक्तित्व' : 'Innate Soul Archetype'}
            </div>
          </div>

          {/* Bhagyank */}
          <div className="sw-card" style={{ textAlign: 'center', borderTop: '4px solid #3b82f6', background: 'var(--bg-card, #ffffff)' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b' }}>
              {isHi ? 'भाग्यांक (Conductor / जीवन पथ)' : 'Bhagyank (Conductor / Path)'}
            </span>
            <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#2563eb', fontFamily: 'monospace', margin: '4px 0' }}>
              {report.bhagyank}
            </div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary, #0f172a)' }}>
              {isHi ? 'भाग्य व कर्म पथ' : 'Destiny & Karma'}
            </div>
            <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>
              {isHi ? 'जीवन लक्ष्य व कर्म पथ' : 'Destiny Path & Karma'}
            </div>
          </div>

          {/* Chaldean Namank */}
          <div className="sw-card" style={{ textAlign: 'center', borderTop: '4px solid #8b5cf6', background: 'var(--bg-card, #ffffff)' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b' }}>
              {isHi ? 'कीरो (Chaldean) नामांक' : 'Chaldean Name No.'}
            </span>
            <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#7c3aed', fontFamily: 'monospace', margin: '4px 0' }}>
              {report.chaldeanReduced}{' '}
              <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#94a3b8' }}>({report.chaldeanTotal})</span>
            </div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary, #0f172a)' }}>
              {isHi ? 'प्राचीन कीरो पद्धति' : 'Ancient Cheiro Vibrations'}
            </div>
            <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>
              {isHi ? 'नाम का सामाजिक प्रभाव' : 'Social & Professional Impact'}
            </div>
          </div>

          {/* Pythagorean Namank */}
          <div className="sw-card" style={{ textAlign: 'center', borderTop: '4px solid #ec4899', background: 'var(--bg-card, #ffffff)' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b' }}>
              {isHi ? 'पाइथागोरस नामांक' : 'Pythagorean Name'}
            </span>
            <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#db2777', fontFamily: 'monospace', margin: '4px 0' }}>
              {report.pythagoreanReduced}
            </div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary, #0f172a)' }}>
              {isHi ? 'पाश्चात्य अंक पद्धति' : 'Western Harmonic Order'}
            </div>
            <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>
              {isHi ? 'सार्वजनिक संवाद व विचार' : 'Public Expression & Thought'}
            </div>
          </div>

          {/* Kua Number */}
          <div className="sw-card" style={{ textAlign: 'center', borderTop: '4px solid #10b981', background: 'var(--bg-card, #ffffff)' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b' }}>
              {isHi ? 'कुआ अंक (Kua Number)' : 'Kua Direction No.'}
            </span>
            <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#059669', fontFamily: 'monospace', margin: '4px 0' }}>
              {report.kuaNumber}
            </div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary, #0f172a)' }}>
              {isHi ? 'फेंगशुई ऊर्जा दिशांक' : 'Cosmic Spatial Geometry'}
            </div>
            <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>
              {isHi ? 'शुभ दिशाओं का निर्धारण' : 'Optimal Cardinal Alignment'}
            </div>
          </div>

          {/* Personal Year */}
          <div className="sw-card" style={{ textAlign: 'center', borderTop: '4px solid #6366f1', background: 'var(--bg-card, #ffffff)' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b' }}>
              {isHi ? `पर्सनल ईयर (${activeTargetYear})` : `Personal Year (${activeTargetYear})`}
            </span>
            <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#4f46e5', fontFamily: 'monospace', margin: '4px 0' }}>
              {report.personalYear}
            </div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary, #0f172a)' }}>
              {isHi ? `वर्ष ${activeTargetYear} का चक्र` : `Annual Epoch Cycle`}
            </div>
            <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>
              {isHi ? 'वर्तमान वर्ष की मुख्य थीम' : 'Yearly Focus & Opportunities'}
            </div>
          </div>
        </div>

        {/* ── 4. Authentic 3x3 Lo Shu Graphic Square & 8 Planes ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
          {/* Left Column: True 3x3 Graphic Grid */}
          <div className="sw-card" style={{ background: 'var(--bg-card, #ffffff)' }}>
            <div className="sw-card-header">
              <span className="sw-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Grid3x3 className="w-5 h-5 text-amber-500" />
                {isHi ? '३x३ लो-शू महाचक्र (Authentic Lo Shu Magic Square)' : '3×3 Lo Shu Magic Square Grid'}
              </span>
              <span className="sw-badge sw-badge-warning">
                {isHi ? 'योग = १५' : 'Sum = 15'}
              </span>
            </div>

            <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0 0 16px 0', lineHeight: 1.5 }}>
              {isHi
                ? `जातक ${chart.input.name} की जन्म तिथि (${formatDateDmy(chart.input.date)}) के अंकों का ३x३ चक्र। उपस्थित अंक आपकी जन्मजात शक्तियों को तथा अनुपस्थित अंक जीवन के कर्म पाठ को दर्शाते हैं:`
                : `Authentic 3x3 Magic Square for DOB ${formatDateDmy(chart.input.date)}. Present digits manifest natural gifts; missing digits pinpoint karmic lessons:`}
            </p>

            {/* Embedded Guaranteed 3x3 Visual Graphic Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '10px',
                maxWidth: '360px',
                margin: '0 auto 16px auto',
                padding: '12px',
                borderRadius: '12px',
                background: '#0f172a',
                border: '2px solid #b45309',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.25)',
              }}
            >
              {LO_SHU_ORDER.map((digit) => {
                const count = report.loShuCounts[digit] || 0;
                const isPresent = count > 0;
                return (
                  <div
                    key={digit}
                    style={{
                      aspectRatio: '1 / 1',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '8px',
                      background: isPresent
                        ? 'linear-gradient(135deg, rgba(217, 119, 6, 0.45) 0%, rgba(180, 83, 9, 0.2) 100%)'
                        : '#1e293b',
                      border: isPresent ? '2px solid #f59e0b' : '1px solid #334155',
                      boxShadow: isPresent ? '0 0 10px rgba(245, 158, 11, 0.3)' : 'none',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '1.8rem',
                        fontWeight: 900,
                        fontFamily: 'monospace',
                        color: isPresent ? '#fef08a' : '#475569',
                        textShadow: isPresent ? '0 0 8px rgba(245, 158, 11, 0.5)' : 'none',
                        lineHeight: 1,
                      }}
                    >
                      {digit}
                    </span>
                    <span
                      style={{
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        marginTop: '4px',
                        color: isPresent ? '#fbbf24' : '#64748b',
                      }}
                    >
                      {isPresent ? (isHi ? `${count} बार` : `x${count}`) : '—'}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Grid Coordinates Reference */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', textAlign: 'center', fontSize: '0.72rem', color: '#64748b', maxWidth: '360px', margin: '0 auto' }}>
              <div>4-SE (धन/लकड़ी)</div>
              <div>9-S (ख्याति/अग्नि)</div>
              <div>2-SW (संबंध/पृथ्वी)</div>
              <div>3-E (स्वास्थ्य/लकड़ी)</div>
              <div>5-Center (स्थिरता/पृथ्वी)</div>
              <div>7-W (संतान/धातु)</div>
              <div>8-NE (ज्ञान/पृथ्वी)</div>
              <div>1-N (करियर/जल)</div>
              <div>6-NW (मित्र/धातु)</div>
            </div>
          </div>

          {/* Right Column: 8 Planes & Rajayoga Arrows */}
          <div className="sw-card" style={{ background: 'var(--bg-card, #ffffff)' }}>
            <div className="sw-card-header">
              <span className="sw-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award className="w-5 h-5 text-amber-500" />
                {isHi ? 'लो-शू चक्र के ८ तल एवं राजयोग बाण' : '8 Lo Shu Planes & Rajayoga Arrows'}
              </span>
              <span className="sw-badge sw-badge-warning">
                {isHi ? 'सामर्थ्य विश्लेषण' : 'Strength Matrix'}
              </span>
            </div>

            <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0 0 12px 0', lineHeight: 1.4 }}>
              {isHi
                ? '३ क्षैतिज, ३ ऊर्ध्वाधर एवं २ विकर्ण रेखाएं जीवन के आठ प्रमुख आयामों की क्षमता निर्धारित करती हैं:'
                : '3 Horizontal planes, 3 Vertical planes & 2 Diagonal Rajayoga arrows map life potentials:'}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {report.loShuPlanes.map((plane) => (
                <div
                  key={plane.id}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: plane.complete ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-subtle, #f8fafc)',
                    border: plane.complete ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-color, #e2e8f0)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.84rem', color: 'var(--text-primary, #0f172a)' }}>
                      {isHi ? plane.nameHi : plane.nameEn}
                    </span>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        background: plane.complete ? '#dcfce7' : '#f1f5f9',
                        color: plane.complete ? '#166534' : '#64748b',
                      }}
                    >
                      {plane.strengthPercent}% ({plane.presentDigits.join(', ') || 'None'})
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#475569', lineHeight: 1.35 }}>
                    {isHi ? plane.meaningHi : plane.meaningEn}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── 5. Missing Numbers & Specific Classical Remedies ── */}
        <div className="sw-card" style={{ background: 'var(--bg-card, #ffffff)' }}>
          <div className="sw-card-header">
            <span className="sw-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield className="w-5 h-5 text-emerald-500" />
              {isHi
                ? 'अनुपस्थित अंक एवं शास्त्रीय निवारण उपाय (Missing Number Remedies)'
                : 'Missing Numbers & Classical Harmonization Remedies'}
            </span>
            <span className="sw-badge sw-badge-neutral">
              {report.missingNumbers.length} {isHi ? 'अंक अनुपस्थित' : 'Missing Digits'}
            </span>
          </div>

          <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0 0 14px 0', lineHeight: 1.5 }}>
            {isHi
              ? 'लो-शू चक्र में जो अंक नहीं होते, वे जीवन में किसी विशेष तत्व या ऊर्जा की कमी दर्शाते हैं। शास्त्रीय रत्नों, रंगों एवं अनुष्ठानों से इन्हें संतुलित किया जा सकता है:'
              : 'Missing digits represent elemental gaps in the natal energy matrix. They can be harmonized through gemstones, color therapy, and sacred disciplines:'}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
            {report.missingNumbers.map((rem) => (
              <div
                key={rem.digit}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  background: 'var(--bg-subtle, #f8fafc)',
                  border: '1px solid var(--border-color, #e2e8f0)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
              >
                <span style={{ fontWeight: 700, fontSize: '0.84rem', color: '#b91c1c' }}>
                  {isHi ? `अंक ${rem.digit} (${rem.planetHi})` : `Digit #${rem.digit} (${rem.planetEn})`}
                </span>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  {isHi ? rem.impactHi : rem.impactEn}
                </div>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.78rem', color: '#334155', lineHeight: 1.4 }}>
                  <strong>{isHi ? 'उपाय: ' : 'Remedy: '}</strong>
                  {isHi ? rem.remedyHi : rem.remedyEn}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 6. Favorable Vibrations & Directions ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          {/* Compatible Numbers */}
          <div className="sw-card" style={{ background: 'var(--bg-card, #ffffff)' }}>
            <div className="sw-card-header">
              <span className="sw-card-title">{isHi ? 'अनुकूल अंक एवं सामंजस्य' : 'Compatible Numbers & Harmony'}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-color, #e2e8f0)' }}>
                <span style={{ color: '#64748b' }}>{isHi ? 'अनुकूल अंक (Compatible):' : 'Compatible:'}</span>
                <strong style={{ color: '#059669', fontFamily: 'monospace' }}>{report.compatibleNumbers.join(', ')}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-color, #e2e8f0)' }}>
                <span style={{ color: '#64748b' }}>{isHi ? 'मूलांक स्वामी:' : 'Mulank Lord:'}</span>
                <strong style={{ color: '#d97706' }}>{isHi ? report.mulankRulerHi : report.mulankRulerEn}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                <span style={{ color: '#64748b' }}>{isHi ? 'नामांक सामंजस्य:' : 'Name Harmony:'}</span>
                <strong style={{ color: '#2563eb' }}>{isHi ? report.nameCompatibilityHi : report.nameCompatibilityEn}</strong>
              </div>
            </div>
          </div>

          {/* Lucky Colors & Days */}
          <div className="sw-card" style={{ background: 'var(--bg-card, #ffffff)' }}>
            <div className="sw-card-header">
              <span className="sw-card-title">{isHi ? 'शुभ वार, रंग एवं दिशाएं' : 'Auspicious Days, Colors & Directions'}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-color, #e2e8f0)' }}>
                <span style={{ color: '#64748b' }}>{isHi ? 'शुभ वार:' : 'Lucky Days:'}</span>
                <strong>{isHi ? report.luckyDaysHi : report.luckyDaysEn}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-color, #e2e8f0)' }}>
                <span style={{ color: '#64748b' }}>{isHi ? 'शुभ रंग:' : 'Lucky Colors:'}</span>
                <strong style={{ color: '#d97706' }}>{isHi ? report.luckyColorsHi : report.luckyColorsEn}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                <span style={{ color: '#64748b' }}>{isHi ? 'कुआ दिशाएं:' : 'Kua Directions:'}</span>
                <span style={{ fontSize: '0.76rem', color: '#334155', fontWeight: 600 }}>
                  {isHi ? report.kuaDirectionsHi : report.kuaDirectionsEn}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── 7. Detailed Predictions Matrix ── */}
        <div className="sw-card" style={{ background: 'var(--bg-card, #ffffff)' }}>
          <div className="sw-card-header">
            <span className="sw-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap className="w-5 h-5 text-amber-500" />
              {isHi ? 'जीवन के चार प्रमुख आयामों का फलादेश' : 'Four Core Life Dimensions Forecast'}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', marginTop: '10px' }}>
            {/* Soul / Temperament */}
            <div style={{ padding: '14px', borderRadius: '8px', background: 'var(--bg-subtle, #f8fafc)', border: '1px solid var(--border-color, #e2e8f0)' }}>
              <h5 style={{ margin: '0 0 6px 0', fontSize: '0.88rem', fontWeight: 700, color: '#d97706' }}>
                {isHi ? '१. मूलांक व्यक्तित्व एवं आत्मिक प्रेरणा' : '1. Root Soul Archetype & Drive'}
              </h5>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#334155', lineHeight: 1.45 }}>
                {isHi ? report.mulankProfileHi : report.mulankProfileEn}
              </p>
            </div>

            {/* Destiny / Career */}
            <div style={{ padding: '14px', borderRadius: '8px', background: 'var(--bg-subtle, #f8fafc)', border: '1px solid var(--border-color, #e2e8f0)' }}>
              <h5 style={{ margin: '0 0 6px 0', fontSize: '0.88rem', fontWeight: 700, color: '#2563eb' }}>
                {isHi ? '२. भाग्यांक एवं जीवन लक्ष्य' : '2. Destiny Path & Karma Vocation'}
              </h5>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#334155', lineHeight: 1.45 }}>
                {isHi ? report.bhagyankProfileHi : report.bhagyankProfileEn}
              </p>
            </div>

            {/* Name Harmony */}
            <div style={{ padding: '14px', borderRadius: '8px', background: 'var(--bg-subtle, #f8fafc)', border: '1px solid var(--border-color, #e2e8f0)' }}>
              <h5 style={{ margin: '0 0 6px 0', fontSize: '0.88rem', fontWeight: 700, color: '#8b5cf6' }}>
                {isHi ? '३. नामांक स्पंदन एवं सामाजिक ख्याति' : '3. Name Vibration & Social Resonance'}
              </h5>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#334155', lineHeight: 1.45 }}>
                {isHi ? report.nameCompatibilityHi : report.nameCompatibilityEn}
              </p>
            </div>

            {/* Kua Cosmic Energy */}
            <div style={{ padding: '14px', borderRadius: '8px', background: 'var(--bg-subtle, #f8fafc)', border: '1px solid var(--border-color, #e2e8f0)' }}>
              <h5 style={{ margin: '0 0 6px 0', fontSize: '0.88rem', fontWeight: 700, color: '#059669' }}>
                {isHi ? '४. कुआ दिशांक ऊर्जा एवं स्वास्थ्य' : '4. Kua Spatial Harmony & Vitality'}
              </h5>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#334155', lineHeight: 1.45 }}>
                {isHi ? report.kuaDirectionsHi : report.kuaDirectionsEn}
              </p>
            </div>
          </div>
        </div>

        {/* ── 8. Collapsible Alternate Name / What-If Testing (Closed by Default) ── */}
        <div className="sw-card no-print" style={{ background: 'var(--bg-card, #ffffff)' }}>
          <button
            type="button"
            onClick={() => setShowWhatIf(!showWhatIf)}
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'transparent',
              border: 'none',
              padding: '6px 0',
              cursor: 'pointer',
              color: 'var(--text-primary, #0f172a)',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.9rem' }}>
              <Edit3 className="w-4 h-4 text-blue-500" />
              {isHi
                ? 'वैकल्पिक नाम / वर्तनी परिवर्तन परीक्षण (What-If Name Spelling Analyzer)'
                : 'Optional: What-If Name Spelling & Alternate Date Testing'}
            </span>
            {showWhatIf ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showWhatIf && (
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-color, #e2e8f0)' }}>
              <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '12px' }}>
                {isHi
                  ? 'यदि आप अपने नाम की स्पेलिंग बदलकर उसकी अंकशास्त्रीय ऊर्जा जांचना चाहते हैं, तो नीचे दर्ज करें:'
                  : 'To test an alternate spelling, business name, or different target year, edit below:'}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#64748b', marginBottom: '4px' }}>
                    {isHi ? 'नाम (अंग्रेज़ी अक्षर)' : 'Name for Spelling Test'}
                  </label>
                  <input
                    type="text"
                    value={testName}
                    onChange={(e) => setTestName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color, #cbd5e1)',
                      fontSize: '0.85rem',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#64748b', marginBottom: '4px' }}>
                    {isHi ? 'जन्म तिथि (DD-MM-YYYY)' : 'Date of Birth (DD-MM-YYYY)'}
                  </label>
                  <DateDmyInput
                    value={testDob}
                    ariaLabel={isHi ? 'जन्म तिथि' : 'Date of Birth'}
                    onChange={setTestDob}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#64748b', marginBottom: '4px' }}>
                    {isHi ? 'लिंग' : 'Gender (Kua)'}
                  </label>
                  <select
                    value={testGender}
                    onChange={(e) => setTestGender(e.target.value as any)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color, #cbd5e1)',
                      fontSize: '0.85rem',
                    }}
                  >
                    <option value="male">{isHi ? 'पुरुष' : 'Male'}</option>
                    <option value="female">{isHi ? 'महिला' : 'Female'}</option>
                    <option value="other">{isHi ? 'अन्य' : 'Other'}</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#64748b', marginBottom: '4px' }}>
                    {isHi ? 'वर्ष फल लक्ष्य वर्ष' : 'Target Year'}
                  </label>
                  <input
                    type="number"
                    value={testYear}
                    onChange={(e) => setTestYear(parseInt(e.target.value, 10) || new Date().getFullYear())}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color, #cbd5e1)',
                      fontSize: '0.85rem',
                      fontFamily: 'monospace',
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
