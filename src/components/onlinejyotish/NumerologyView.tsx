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
      <div className="oj-card no-print mt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-amber-300 mb-1">
              {isHi ? 'नाम (अक्षर जांच हेतु)' : 'Name (Spelling Test)'}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-700 text-amber-100 text-xs rounded-lg p-2.5 focus:border-amber-400"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-amber-300 mb-1">
              {isHi ? 'जन्म तिथि (DD-MM-YYYY)' : 'Date of Birth (DD-MM-YYYY)'}
            </label>
            <DateDmyInput
              value={dob}
              ariaLabel={isHi ? 'जन्म तिथि' : 'Date of Birth'}
              onChange={setDob}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-amber-300 mb-1">
              {isHi ? 'लिंग (कुआ अंक हेतु)' : 'Gender (Kua Number)'}
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as 'male' | 'female' | 'other')}
              className="w-full bg-neutral-900 border border-neutral-700 text-amber-100 text-xs rounded-lg p-2.5 focus:border-amber-400"
            >
              <option value="male">{isHi ? 'पुरुष' : 'Male'}</option>
              <option value="female">{isHi ? 'महिला' : 'Female'}</option>
              <option value="other">{isHi ? 'अन्य' : 'Other'}</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-amber-300 mb-1">
              {isHi ? 'पर्सनल ईयर वर्ष' : 'Target Year'}
            </label>
            <input
              type="number"
              value={targetYear}
              onChange={(e) => setTargetYear(parseInt(e.target.value, 10) || 2026)}
              className="w-full bg-neutral-900 border border-neutral-700 text-amber-100 text-xs rounded-lg p-2.5 focus:border-amber-400 font-mono"
            />
          </div>
        </div>
      </div>

      {/* Main Numerology Key Numbers Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {/* Mulank */}
        <div className="oj-card border-amber-500/40 text-center">
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
            {isHi ? 'मूलांक (Root / Driver)' : 'Mulank (Driver)'}
          </span>
          <div className="text-4xl font-black text-amber-300 font-mono my-2">{report.mulank}</div>
          <div className="text-xs text-neutral-300 font-medium">
            {isHi ? report.mulankRulerHi : report.mulankRulerEn}
          </div>
        </div>

        {/* Bhagyank */}
        <div className="oj-card border-amber-500/40 text-center">
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
            {isHi ? 'भाग्यांक (Destiny / Conductor)' : 'Bhagyank (Conductor)'}
          </span>
          <div className="text-4xl font-black text-amber-300 font-mono my-2">{report.bhagyank}</div>
          <div className="text-xs text-neutral-300 font-medium">
            {isHi ? 'जीवन लक्ष्य व संचालक' : 'Destiny Path Conductor'}
          </div>
        </div>

        {/* Chaldean Namank */}
        <div className="oj-card border-amber-500/40 text-center">
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
            {isHi ? 'कीरो (Chaldean) नामांक' : 'Chaldean Name No.'}
          </span>
          <div className="text-4xl font-black text-amber-300 font-mono my-2">
            {report.chaldeanReduced} <span className="text-sm font-normal text-amber-400/80">({report.chaldeanTotal})</span>
          </div>
          <div className="text-xs text-neutral-300 font-medium">
            {isHi ? 'पाइथागोरस नामांक:' : 'Pythagorean:'} {report.pythagoreanReduced}
          </div>
        </div>

        {/* Kua Number */}
        <div className="oj-card border-amber-500/40 text-center">
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
            {isHi ? 'कुआ अंक व पर्सनल ईयर' : 'Kua & Personal Year'}
          </span>
          <div className="text-4xl font-black text-amber-300 font-mono my-2">{report.kuaNumber}</div>
          <div className="text-xs text-neutral-300 font-medium">
            {isHi ? `पर्सनल ईयर ${report.personalYear}` : `Personal Year ${report.personalYear}`}
          </div>
        </div>
      </div>

      {/* Lo Shu Grid & Detailed Predictions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Left: 3x3 Lo Shu Grid (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="oj-card">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-amber-900/30">
              <Grid3x3 className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-amber-200">
                {isHi ? '३x३ लो-शू अंक ग्रिड (Lo Shu Magic Square)' : '3x3 Lo Shu Grid'}
              </h3>
            </div>
            <p className="text-xs text-neutral-400 mb-4">
              {isHi
                ? 'जन्म तिथि के अंकों की आवृत्ति आपके बौद्धिक, भावनात्मक एवं व्यावहारिक तलों को प्रकट करती है:'
                : 'Presence and repetition of natal digits reveal conscious strengths and blind spots:'}
            </p>

            <div className="grid grid-cols-3 gap-2.5 max-w-xs mx-auto p-3 bg-neutral-950 border border-amber-900/40 rounded-xl">
              {LO_SHU_ORDER.map((digit) => {
                const count = report.loShuCounts[digit] || 0;
                return (
                  <div
                    key={digit}
                    className={`aspect-square rounded-lg flex flex-col items-center justify-center p-1 border text-center transition-all ${
                      count > 0
                        ? 'bg-amber-500/20 border-amber-500/60 text-amber-200 font-bold shadow'
                        : 'bg-neutral-900/60 border-neutral-800 text-neutral-600'
                    }`}
                  >
                    <span className="text-lg font-black font-mono">{digit}</span>
                    <span className="text-[10px] opacity-80">
                      {count > 0 ? (isHi ? `${count} बार` : `x${count}`) : '-'}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-800 text-xs text-neutral-300 space-y-1">
              <div><strong>{isHi ? 'मानसिक तल (4, 9, 2):' : 'Mental Plane (4, 9, 2):'}</strong> {isHi ? 'मेधा व तार्किक स्मृति' : 'Analytical intellect'}</div>
              <div><strong>{isHi ? 'भावनात्मक तल (3, 5, 7):' : 'Emotional Plane (3, 5, 7):'}</strong> {isHi ? 'संवेदना व आत्मिक बल' : 'Emotional intuition'}</div>
              <div><strong>{isHi ? 'व्यावहारिक तल (8, 1, 6):' : 'Practical Plane (8, 1, 6):'}</strong> {isHi ? 'कर्मठता व धन संचय' : 'Material execution'}</div>
            </div>
          </div>

          {/* Lucky Attributes */}
          <div className="oj-card">
            <h4 className="text-sm font-bold text-amber-200 mb-3 pb-2 border-b border-amber-900/30">
              {isHi ? 'शुभ अंक, रंग, दिन एवं दिशाएं' : 'Favorable Vibrations'}
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-neutral-800/60">
                <span className="text-neutral-400">{isHi ? 'अनुकूल अंक:' : 'Compatible Numbers:'}</span>
                <strong className="text-amber-300 font-mono">{report.compatibleNumbers.join(', ')}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-800/60">
                <span className="text-neutral-400">{isHi ? 'शुभ दिन:' : 'Lucky Days:'}</span>
                <span className="text-amber-200">{isHi ? report.luckyDaysHi : report.luckyDaysEn}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-800/60">
                <span className="text-neutral-400">{isHi ? 'शुभ रंग:' : 'Lucky Colors:'}</span>
                <span className="text-amber-200">{isHi ? report.luckyColorsHi : report.luckyColorsEn}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-neutral-400">{isHi ? 'कुआ शुभ दिशाएं:' : 'Kua Auspicious Vectors:'}</span>
                <span className="text-amber-200">{isHi ? report.kuaDirectionsHi : report.kuaDirectionsEn}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Detailed Predictions (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Mulank & Bhagyank Synthesis */}
          <div className="oj-card">
            <h4 className="text-sm font-bold text-amber-200 mb-2 pb-2 border-b border-amber-900/30">
              {isHi ? 'मूलांक व्यक्तित्व एवं स्वभाव' : 'Mulank Personality Profile'}
            </h4>
            <p className="text-xs text-neutral-300 leading-relaxed mb-4">
              {isHi ? report.mulankProfileHi : report.mulankProfileEn}
            </p>
            <h4 className="text-sm font-bold text-amber-200 mb-2 pb-2 border-b border-amber-900/30">
              {isHi ? 'भाग्यांक जीवन लक्ष्य एवं कर्म' : 'Bhagyank Destiny Path'}
            </h4>
            <p className="text-xs text-neutral-300 leading-relaxed">
              {isHi ? report.bhagyankProfileHi : report.bhagyankProfileEn}
            </p>
          </div>

          {/* Name Compatibility */}
          <div className="oj-card">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-amber-900/30">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h4 className="text-sm font-bold text-amber-200">
                {isHi ? 'नाम अनुकूलता एवं स्पंदन (Name Vibration Compatibility)' : 'Name Vibration Compatibility'}
              </h4>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed mb-3">
              {isHi ? report.nameCompatibilityHi : report.nameCompatibilityEn}
            </p>
            <div className="p-3 bg-neutral-900/80 rounded-lg text-xs text-amber-300/90 border border-neutral-800">
              <strong>{isHi ? 'शास्त्रीय परामर्श:' : 'Guidance:'}</strong>{' '}
              {isHi
                ? `आपका कीरो नामांक ${report.chaldeanReduced} है। यदि नामांक और भाग्यांक (${report.bhagyank}) में नैसर्गिक सामंजस्य है, तो जीवन में अवरोध स्वतः दूर होते हैं।`
                : `Your Chaldean Name Number is ${report.chaldeanReduced}. Harmony between Name Number and Destiny Number (${report.bhagyank}) creates smooth career momentum.`}
            </div>
          </div>

          {/* Missing Numbers Remedies */}
          {report.missingNumbers.length > 0 && (
            <div className="oj-card">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-amber-900/30">
                <Shield className="w-4 h-4 text-amber-400" />
                <h4 className="text-sm font-bold text-amber-200">
                  {isHi ? 'लो-शू ग्रिड में अनुपस्थित अंक एवं संतुलन उपाय' : 'Missing Numbers & Remedial Balances'}
                </h4>
              </div>
              <div className="space-y-3">
                {report.missingNumbers.map((m) => (
                  <div key={m.digit} className="p-2.5 bg-neutral-900/70 border border-neutral-800 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-amber-300 font-mono">
                        {isHi ? `अंक ${m.digit} अनुपस्थित` : `Missing #${m.digit}`} ({isHi ? m.planetHi : m.planetEn})
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 mb-1">{isHi ? m.impactHi : m.impactEn}</p>
                    <p className="text-xs text-amber-200/90"><strong>{isHi ? 'उपाय:' : 'Remedy:'}</strong> {isHi ? m.remedyHi : m.remedyEn}</p>
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
