import React, { useState, useMemo } from 'react';
import type { ChartData, CalcSettings, ChartStyle, BirthInput, NineGrahaId } from '../../astro/types';
import { calculateChart } from '../../astro/calculator';
import { SIGNS } from '../../astro/constants';
import { formatDateDmy } from '../../astro/time';
import { VedicChartSvg, type ChartBadgeItem } from '../VedicChartSvg';
import { useLanguage } from '../../i18n/LanguageContext';
import { trPlanet, trPlanetShort, trSign } from '../../i18n/translations';
import { LayoutGrid, Printer, Clock, Compass, Eye, Play, Pause, RotateCcw } from 'lucide-react';

interface SplitStudioWorkstationViewProps {
  chart: ChartData;
  settings: CalcSettings;
  onChangeChartStyle?: (style: ChartStyle) => void;
  onNavigate?: (view: string) => void;
  onOpenBooklet?: () => void;
}

export const SplitStudioWorkstationView: React.FC<SplitStudioWorkstationViewProps> = ({
  chart,
  settings,
  onChangeChartStyle,
  onNavigate,
  onOpenBooklet,
}) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';

  const [chartStyle, setChartStyle] = useState<ChartStyle>(settings.chartStyle || 'north');
  const pad = (n: number) => String(n).padStart(2, '0');
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

  const [transitDate, setTransitDate] = useState<string>(todayStr);
  const [isPlayingTransit, setIsPlayingTransit] = useState<boolean>(false);

  // Live Transit Chart
  const transitChart = useMemo(() => {
    const transitInput: BirthInput = {
      id: 'split-transit',
      name: 'Current Gochar',
      gender: 'other',
      date: transitDate,
      time: '12:00',
      city: chart.input.city || 'New Delhi',
      country: chart.input.country || 'India',
      latitude: chart.input.latitude || 28.6139,
      longitude: chart.input.longitude || 77.209,
      timezone: chart.input.timezone || 'Asia/Kolkata',
    };
    return calculateChart(transitInput, settings);
  }, [transitDate, chart.input, settings]);

  // D-1 Badges
  const d1Badges: ChartBadgeItem[] = useMemo(() => {
    return chart.planets.map((pl) => ({
      id: pl.id,
      label: trPlanetShort(pl.id, lang),
      signIndex: pl.signIndex,
      isLagna: pl.id === 'Asc',
      isRetrograde: pl.isRetrograde,
      isCombust: pl.isCombust,
      dignity: pl.dignity,
      tooltip: `${trPlanet(pl.id, lang)}: ${trSign(pl.signIndex, lang)} (${pl.dignity})`,
    }));
  }, [chart, lang]);

  // D-9 Navamsha Badges
  const d9Chart = chart.divisionalCharts.D9;
  const d9Badges: ChartBadgeItem[] = useMemo(() => {
    if (!d9Chart) return [];
    return d9Chart.placements.map((pl) => {
      const natalPl = chart.planets.find((p) => p.id === pl.id);
      const isVargottama = natalPl && natalPl.signIndex === pl.signIndex;
      return {
        id: pl.id,
        label: trPlanetShort(pl.id, lang),
        signIndex: pl.signIndex,
        isLagna: pl.id === 'Asc',
        isRetrograde: pl.isRetrograde,
        isVargottama: Boolean(isVargottama),
        dignity: pl.dignity,
        tooltip: `D9 ${trPlanet(pl.id, lang)}: ${trSign(pl.signIndex, lang)} ${isVargottama ? '★ वर्गोत्तम' : ''}`,
      };
    });
  }, [d9Chart, chart.planets, lang]);

  // Dasha Tree
  const currentDasha = chart.vimshottari;

  // Step Date
  const stepDate = (days: number) => {
    const d = new Date(transitDate);
    d.setDate(d.getDate() + days);
    setTransitDate(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`);
  };

  return (
    <div className="oj-page-container">
      {/* Breadcrumb */}
      <nav className="oj-breadcrumbs" aria-label="Breadcrumb">
        <a href="#home" onClick={(e) => { e.preventDefault(); onNavigate?.('home'); }}>
          {isHi ? 'होम' : 'Home'}
        </a>
        <span className="oj-bc-sep">/</span>
        <span>{isHi ? 'विशिष्ट ज्योतिष' : 'Advanced Astrology'}</span>
        <span className="oj-bc-sep">/</span>
        <span className="oj-bc-current">{isHi ? '4-स्क्रीन ज्योतिषी वर्कस्टेशन' : '4-Screen Split Workstation'}</span>
      </nav>

      {/* Header Banner */}
      <div className="oj-page-header-card">
        <div className="oj-header-badge">
          {isHi ? 'व्यावसायिक ज्योतिषी कंसल्टेशन स्टूडियो' : 'Professional Astrologer Consultation Split Screen'}
        </div>
        <h1 className="oj-page-title">
          {isHi ? '4-स्क्रीन समन्वित वैदिक वर्कस्टेशन (D1 + D9 + दशा + गोचर)' : '4-Screen Unified Vedic Workstation'}
        </h1>
        <p className="oj-page-subtitle">
          {isHi
            ? 'एक ही पटल पर बिना स्क्रॉल किए जन्म लग्न (D1), नवमांश (D9), सक्रिय विंशोत्तरी दशा एवं लाइव गोचर चक्र का एक साथ अवलोकन।'
            : 'Simultaneous 4-quadrant inspection of D1 Natal, D9 Navamsha, active Vimshottari Mahadasha tree, and live transits on a single screen.'}
        </p>

        {/* Action Bar */}
        <div className="oj-page-actions-bar">
          <div className="oj-chart-style-pill">
            <span className="oj-pill-label">{isHi ? 'शैली:' : 'Style:'}</span>
            <select
              value={chartStyle}
              onChange={(e) => {
                const s = e.target.value as ChartStyle;
                setChartStyle(s);
                onChangeChartStyle?.(s);
              }}
              className="oj-chart-select"
            >
              <option value="north">{isHi ? 'उत्तर भारतीय (डायमंड)' : 'North Indian (Diamond)'}</option>
              <option value="south">{isHi ? 'दक्षिण भारतीय (बॉक्स)' : 'South Indian (Box)'}</option>
              <option value="east">{isHi ? 'पूर्वी भारतीय (बंगला)' : 'East Indian (Surya)'}</option>
            </select>
          </div>

          <button type="button" className="oj-action-btn secondary" onClick={() => window.print()}>
            <Printer size={13} />
            <span>{isHi ? 'प्रिंट करें' : 'Print'}</span>
          </button>

          <button type="button" className="oj-action-btn primary" onClick={onOpenBooklet}>
            <span>{isHi ? 'संपूर्ण जन्म पत्रिका (Birth Report)' : 'Birth Report (जन्म पत्रिका)'}</span>
          </button>
        </div>
      </div>

      {/* 4-QUADRANT SPLIT GRID */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))',
          gap: '20px',
          marginTop: '10px',
        }}
      >
        {/* Quadrant 1: D-1 Natal Lagna Chart */}
        <div className="oj-card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h3 style={{ margin: 0, fontSize: '15px', color: '#b45309', fontFamily: 'Cinzel, Playfair Display, serif' }}>
              1. {isHi ? 'लग्न कुण्डली (D-1 Natal Chart)' : 'Lagna Kundli (D-1 Natal)'}
            </h3>
            <span className="oj-badge-accent" style={{ fontSize: '10.5px' }}>
              {isHi ? 'लग्न:' : 'Asc:'} {trSign(chart.ascendant.signIndex, lang)} ({chart.ascendant.dms})
            </span>
          </div>

          <div style={{ minHeight: '360px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <VedicChartSvg
              title={chart.input.name}
              style={chartStyle}
              lagnaSignIndex={chart.ascendant.signIndex}
              items={d1Badges}
              centerLabel="D-1 LAGNA"
              compact
            />
          </div>
        </div>

        {/* Quadrant 2: D-9 Navamsha Chart */}
        <div className="oj-card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h3 style={{ margin: 0, fontSize: '15px', color: '#b45309', fontFamily: 'Cinzel, Playfair Display, serif' }}>
              2. {isHi ? 'नवमांश कुण्डली (D-9 Navamsha)' : 'Navamsha Chart (D-9 Dharma)'}
            </h3>
            <span className="oj-badge-accent" style={{ fontSize: '10.5px' }}>
              {isHi ? 'भाग्य व दांपत्य' : 'Spouse & Fortune'}
            </span>
          </div>

          <div style={{ minHeight: '360px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <VedicChartSvg
              title={`${chart.input.name} D-9`}
              style={chartStyle}
              lagnaSignIndex={d9Chart ? d9Chart.lagnaSignIndex : chart.ascendant.signIndex}
              items={d9Badges}
              centerLabel="D-9 NAVAMSHA"
              compact
            />
          </div>
        </div>

        {/* Quadrant 3: Active Vimshottari Dasha Tree */}
        <div className="oj-card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ margin: 0, fontSize: '15px', color: '#b45309', fontFamily: 'Cinzel, Playfair Display, serif' }}>
              3. {isHi ? 'सक्रिय विंशोत्तरी दशा पदानुक्रम' : 'Vimshottari Dasha Hierarchy'}
            </h3>
            <span style={{ fontSize: '11px', background: 'rgba(217, 119, 6, 0.12)', color: '#b45309', padding: '2px 8px', borderRadius: '9999px', fontWeight: 'bold' }}>
              {chart.settings.dashaYearType || '365.25 Solar'}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '380px', overflowY: 'auto' }}>
            {currentDasha.slice(0, 7).map((d, idx) => {
              const nowMs = new Date().getTime();
              const isCurrentMaha = nowMs >= d.startMs && nowMs <= d.endMs;
              const startFormatted = formatDateDmy(d.startMs);
              const endFormatted = formatDateDmy(d.endMs);
              const durationYrs = (d.durationDays / 365.25).toFixed(1);

              return (
                <div
                  key={idx}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: isCurrentMaha ? '1.5px solid #d97706' : '1px solid var(--border)',
                    background: isCurrentMaha ? 'rgba(254, 243, 199, 0.5)' : 'var(--bg-elevated)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold', color: isCurrentMaha ? '#92400e' : 'var(--text)', fontSize: '13px' }}>
                      महादशा: {trPlanet(d.lord as NineGrahaId, lang)}
                      {isCurrentMaha && (
                        <span style={{ marginLeft: '8px', fontSize: '10px', background: '#b45309', color: '#fff', padding: '1px 6px', borderRadius: '9999px' }}>
                          {isHi ? 'वर्तमान सक्रिय' : 'Current Active'}
                        </span>
                      )}
                    </span>
                    <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                      {durationYrs} {isHi ? 'वर्ष' : 'Yrs'}
                    </span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {startFormatted} से {endFormatted}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quadrant 4: Live Transit Snapshot */}
        <div className="oj-card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
            <h3 style={{ margin: 0, fontSize: '15px', color: '#b45309', fontFamily: 'Cinzel, Playfair Display, serif' }}>
              4. {isHi ? 'लाइव गोचर स्थिति' : 'Live Transit Snapshot'} ({transitDate})
            </h3>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                type="button"
                className="oj-action-btn secondary"
                onClick={() => stepDate(-1)}
                style={{ padding: '2px 8px', fontSize: '10.5px' }}
              >
                -1 {isHi ? 'दिन' : 'Day'}
              </button>
              <button
                type="button"
                className="oj-action-btn secondary"
                onClick={() => setTransitDate(todayStr)}
                style={{ padding: '2px 8px', fontSize: '10.5px' }}
              >
                {isHi ? 'आज' : 'Today'}
              </button>
              <button
                type="button"
                className="oj-action-btn secondary"
                onClick={() => stepDate(1)}
                style={{ padding: '2px 8px', fontSize: '10.5px' }}
              >
                +1 {isHi ? 'दिन' : 'Day'}
              </button>
            </div>
          </div>

          <table className="oj-table" style={{ fontSize: '11.5px' }}>
            <thead>
              <tr>
                <th>{isHi ? 'ग्रह' : 'Planet'}</th>
                <th>{isHi ? 'गोचर राशि' : 'Transit Sign'}</th>
                <th>{isHi ? 'लग्न से भाव' : 'From Lagna'}</th>
                <th>{isHi ? 'स्थिति' : 'Motion'}</th>
              </tr>
            </thead>
            <tbody>
              {transitChart.planets
                .filter((p) => ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'].includes(p.id))
                .map((tp) => {
                  const houseFromLagna = ((tp.signIndex - chart.ascendant.signIndex + 12) % 12) + 1;
                  return (
                    <tr key={tp.id}>
                      <td><strong>{trPlanet(tp.id, lang)}</strong></td>
                      <td>{trSign(tp.signIndex, lang)} ({tp.dms})</td>
                      <td>
                        <span className="oj-badge-accent">
                          {houseFromLagna}वां भाव
                        </span>
                      </td>
                      <td>
                        <span style={{ color: tp.isRetrograde ? '#dc2626' : '#16a34a', fontWeight: 600 }}>
                          {tp.isRetrograde ? (isHi ? 'वक्री (R)' : 'Retrograde') : (isHi ? 'मार्गी' : 'Direct')}
                        </span>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SplitStudioWorkstationView;
