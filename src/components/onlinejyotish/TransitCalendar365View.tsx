import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Award,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Compass,
  Download,
  Flame,
  Printer,
  Shield,
  Sparkles,
  Star,
  Sun,
  User,
} from 'lucide-react';
import {
  computeTransitCalendar365,
  type DailyTransitScore,
  type TransitCalendar365Report,
} from '../../astro/transitCalendar365';
import type { ChartData } from '../../astro/types';
import { useLanguage } from '../../i18n/LanguageContext';

interface TransitCalendar365ViewProps {
  chart: ChartData;
  onNavigate?: (view: string) => void;
}

export const TransitCalendar365View: React.FC<TransitCalendar365ViewProps> = ({ chart, onNavigate }) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';

  const [targetYear, setTargetYear] = useState<number>(new Date().getFullYear());
  const [selectedMonthIdx, setSelectedMonthIdx] = useState<number>(new Date().getMonth());
  const [filterMode, setFilterMode] = useState<'all' | 'best' | 'caution'>('all');

  const report: TransitCalendar365Report = useMemo(() => {
    return computeTransitCalendar365(chart, targetYear);
  }, [chart, targetYear]);

  const currentMonth = report.months[selectedMonthIdx] || report.months[0];

  const displayedDays = useMemo(() => {
    if (filterMode === 'best') {
      return currentMonth.days.filter((d) => d.tier === 'Top Auspicious' || d.tier === 'Favorable');
    }
    if (filterMode === 'caution') {
      return currentMonth.days.filter((d) => d.tier === 'Caution Needed' || d.isChandrashtama);
    }
    return currentMonth.days;
  }, [currentMonth, filterMode]);

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
          {isHi ? 'व्यक्तिगत 365-दिवसीय गोचर कैलेंडर' : 'Personalized 365-Day Transit Calendar'}
        </span>
      </nav>

      {/* Header Banner */}
      <div className="oj-page-header-card">
        <div className="oj-header-badge">
          {isHi
            ? 'सर्वाष्टकवर्ग (SAV 337), तारा बल एवं चंद्राष्टम शोधन आधारित दैनिक गोचर'
            : 'Personalized Daily Transit Calendar based on Natal SAV, Tara Bala & Chandrashtama'}
        </div>
        <h1 className="oj-page-title">
          {isHi
            ? `व्यक्तिगत 365-दिवसीय गोचर हीटमैप कैलेंडर (${targetYear})`
            : `Personalized 365-Day Transit Heatmap Calendar (${targetYear})`}
        </h1>
        <p className="oj-page-subtitle">
          {isHi
            ? `${chart.input.name} की जन्म राशि (${report.natalMoonSignHi}) व जन्म नक्षत्र (${report.natalNakshatra}) के आधार पर वर्ष के प्रत्येक दिन का सटीक शुभता स्कोर (0-100 अंक)।`
            : `Customized day-by-day auspiciousness scoring (0-100) calibrated against ${chart.input.name}'s natal Moon in ${report.natalMoonSign} and ${report.natalNakshatra} Nakshatra.`}
        </p>

        {/* Action Controls */}
        <div className="oj-page-actions-bar no-print">
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              type="button"
              className="oj-action-btn secondary"
              onClick={() => setTargetYear(targetYear - 1)}
            >
              <ChevronLeft size={14} />
              <span>{targetYear - 1}</span>
            </button>
            <span style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text)' }}>{targetYear}</span>
            <button
              type="button"
              className="oj-action-btn secondary"
              onClick={() => setTargetYear(targetYear + 1)}
            >
              <span>{targetYear + 1}</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <button type="button" className="oj-action-btn secondary" onClick={() => window.print()}>
            <Printer size={14} />
            <span>{isHi ? 'कैलेंडर प्रिंट करें' : 'Print Calendar'}</span>
          </button>
        </div>
      </div>

      {/* Top Annual Summary Cards */}
      <div className="oj-scorecard-strip">
        <div className="oj-score-card favorable">
          <span className="oj-score-num">{report.annualAverageScore}/100</span>
          <span className="oj-score-lbl">{isHi ? 'वार्षिक औसत शुभता' : 'Annual Avg Score'}</span>
        </div>
        <div className="oj-score-card highly-favorable">
          <span className="oj-score-num">{report.top10AuspiciousDays.length}</span>
          <span className="oj-score-lbl">{isHi ? 'सर्वश्रेष्ठ महा-शुभ दिन' : 'Top Auspicious Days'}</span>
        </div>
        <div className="oj-score-card caution">
          <span className="oj-score-num">{report.cautionDays.length}</span>
          <span className="oj-score-lbl">{isHi ? 'चंद्राष्टम / सतर्कता दिन' : 'Caution Transit Days'}</span>
        </div>
      </div>

      {/* Top 10 Best Days of the Year Highlight Strip */}
      <div className="oj-card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
        <h3 style={{ margin: '0 0 12px', fontSize: '16px', fontWeight: 700, color: '#047857', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles size={16} />
          <span>{isHi ? `वर्ष ${targetYear} के शीर्ष 10 सर्वश्रेष्ठ दिन (Golden Days)` : `Top 10 Golden Days of ${targetYear}`}</span>
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
          {report.top10AuspiciousDays.map((d) => (
            <div
              key={d.dateStr}
              style={{
                background: 'rgba(5, 150, 105, 0.08)',
                border: '1px solid rgba(5, 150, 105, 0.3)',
                borderRadius: '8px',
                padding: '10px 14px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <strong style={{ fontSize: '13px', color: 'var(--text)' }}>{d.dateStr}</strong>
                <span style={{ fontSize: '11px', fontWeight: 700, background: '#059669', color: '#fff', padding: '2px 6px', borderRadius: '4px' }}>
                  {d.dailyScore} / 100
                </span>
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                {isHi ? d.dayOfWeekHi : d.dayOfWeek} · {isHi ? d.transitMoonSignHi : d.transitMoonSignName} ({isHi ? d.taraBalaCategoryHi : d.taraBalaCategory})
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 12-Month Selector Strip */}
      <div className="oj-filter-controls-card no-print">
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '6px' }}>
          {report.months.map((m, idx) => {
            const isSelected = selectedMonthIdx === idx;
            return (
              <button
                key={m.monthName}
                type="button"
                className={`oj-cat-pill ${isSelected ? 'active' : ''}`}
                onClick={() => setSelectedMonthIdx(idx)}
                style={{ flexShrink: 0, padding: '6px 14px', fontSize: '12px' }}
              >
                <span>{isHi ? m.monthNameHi : m.monthName}</span>
                <span style={{ fontSize: '10px', opacity: 0.8, marginLeft: '4px' }}>
                  ({m.averageScore} अंक)
                </span>
              </button>
            );
          })}
        </div>

        {/* Sub-Filter: All vs Best vs Caution */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>
            {isHi ? 'मासिक फ़िल्टर:' : 'Filter Month:'}
          </span>
          <button
            type="button"
            className={`oj-cat-pill ${filterMode === 'all' ? 'active' : ''}`}
            onClick={() => setFilterMode('all')}
            style={{ fontSize: '11.5px', padding: '3px 10px' }}
          >
            <span>{isHi ? `समस्त ${currentMonth.days.length} दिन` : `All ${currentMonth.days.length} Days`}</span>
          </button>
          <button
            type="button"
            className={`oj-cat-pill ${filterMode === 'best' ? 'active' : ''}`}
            onClick={() => setFilterMode('best')}
            style={{ fontSize: '11.5px', padding: '3px 10px' }}
          >
            <CheckCircle2 size={12} />
            <span>{isHi ? `शुभ दिन (${currentMonth.auspiciousDaysCount})` : `Auspicious (${currentMonth.auspiciousDaysCount})`}</span>
          </button>
          <button
            type="button"
            className={`oj-cat-pill ${filterMode === 'caution' ? 'active' : ''}`}
            onClick={() => setFilterMode('caution')}
            style={{ fontSize: '11.5px', padding: '3px 10px' }}
          >
            <AlertTriangle size={12} />
            <span>{isHi ? `सतर्कता दिन (${currentMonth.cautionDaysCount})` : `Caution (${currentMonth.cautionDaysCount})`}</span>
          </button>
        </div>
      </div>

      {/* Days Grid for Selected Month */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
        {displayedDays.map((d) => {
          const isHigh = d.dailyScore >= 75;
          const isCaution = d.tier === 'Caution Needed' || d.isChandrashtama;
          return (
            <article
              key={d.dateStr}
              style={{
                background: 'var(--bg-elevated)',
                border: isCaution
                  ? '1.5px solid #dc2626'
                  : isHigh
                  ? '1.5px solid #059669'
                  : '1px solid var(--border)',
                borderRadius: '8px',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ fontSize: '14px', color: 'var(--text)' }}>
                    {d.dayNum} {isHi ? currentMonth.monthNameHi : currentMonth.monthName} ({isHi ? d.dayOfWeekHi : d.dayOfWeek})
                  </strong>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{d.dateStr}</div>
                </div>

                <div
                  style={{
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 700,
                    background: isCaution
                      ? 'rgba(220, 38, 38, 0.12)'
                      : isHigh
                      ? 'rgba(5, 150, 105, 0.12)'
                      : 'rgba(37, 99, 235, 0.1)',
                    color: isCaution ? '#dc2626' : isHigh ? '#059669' : '#2563eb',
                  }}
                >
                  {d.dailyScore} / 100
                </div>
              </div>

              {/* Transit Moon Position & Tara Bala Badges */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                <span
                  style={{
                    fontSize: '11px',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: 'var(--bg-subtle)',
                    border: '1px solid var(--border)',
                    color: 'var(--text)',
                  }}
                >
                  {isHi ? `चंद्र: ${d.transitMoonSignHi}` : `Moon in ${d.transitMoonSignName}`}
                </span>
                <span
                  style={{
                    fontSize: '11px',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: d.isTaraAuspicious ? 'rgba(5, 150, 105, 0.1)' : 'rgba(220, 38, 38, 0.1)',
                    color: d.isTaraAuspicious ? '#059669' : '#dc2626',
                    fontWeight: 600,
                  }}
                >
                  {isHi ? d.taraBalaCategoryHi : d.taraBalaCategory}
                </span>
                {d.isChandrashtama && (
                  <span
                    style={{
                      fontSize: '11px',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: '#dc2626',
                      color: '#fff',
                      fontWeight: 700,
                    }}
                  >
                    {isHi ? 'चंद्राष्टम' : 'Chandrashtama'}
                  </span>
                )}
              </div>

              {/* Summary Guidance Note */}
              <p style={{ margin: 0, fontSize: '12px', lineHeight: 1.5, color: 'var(--text)' }}>
                {isHi ? d.summaryNoteHi : d.summaryNoteEn}
              </p>
            </article>
          );
        })}
      </div>
    </div>
  );
};
