import React, { useState, useMemo, useEffect } from 'react';
import type { ChartData, CalcSettings, BirthInput, NineGrahaId } from '../../astro/types';
import { calculateChart } from '../../astro/calculator';
import { SIGNS } from '../../astro/constants';

interface DualTransitWheelViewProps {
  chart: ChartData;
  settings: CalcSettings;
  onNavigate?: (view: string) => void;
}

interface AspectHit {
  transitPlanet: string;
  natalPlanet: string;
  transitDegree: number;
  natalDegree: number;
  aspectType: 'Conjunction' | 'Opposition' | 'Trine' | 'Square' | 'Sextile';
  aspectColor: string;
  angleDiff: number;
  orb: number;
  vedicImpactEn: string;
  vedicImpactHi: string;
}

const HINDI_PLANETS: Record<string, string> = {
  Sun: 'सूर्य',
  Moon: 'चंद्र',
  Mars: 'मंगल',
  Mercury: 'बुध',
  Jupiter: 'गुरु',
  Venus: 'शुक्र',
  Saturn: 'शनि',
  Rahu: 'राहु',
  Ketu: 'केतु',
};

export const DualTransitWheelView: React.FC<DualTransitWheelViewProps> = ({
  chart,
  settings,
  onNavigate,
}) => {
  const pad = (n: number) => String(n).padStart(2, '0');
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

  const [transitDate, setTransitDate] = useState<string>(todayStr);
  const [transitTime, setTransitTime] = useState<string>('12:00');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [filterAspect, setFilterAspect] = useState<string>('all');

  // Compute live transit chart
  const transitChart = useMemo(() => {
    const transitInput: BirthInput = {
      id: 'transit-live',
      name: 'Gochar Transit',
      gender: 'other',
      date: transitDate,
      time: transitTime,
      city: chart.input.city || 'New Delhi',
      country: chart.input.country || 'India',
      latitude: chart.input.latitude || 28.6139,
      longitude: chart.input.longitude || 77.209,
      timezone: chart.input.timezone || 'Asia/Kolkata',
    };
    return calculateChart(transitInput, settings);
  }, [transitDate, transitTime, chart.input, settings]);

  // Step dates
  const stepDate = (days: number) => {
    const d = new Date(`${transitDate}T${transitTime}`);
    d.setDate(d.getDate() + days);
    setTransitDate(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`);
  };

  const stepMonth = (months: number) => {
    const d = new Date(`${transitDate}T${transitTime}`);
    d.setMonth(d.getMonth() + months);
    setTransitDate(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`);
  };

  const resetToToday = () => {
    const now = new Date();
    setTransitDate(`${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`);
    setTransitTime(`${pad(now.getHours())}:${pad(now.getMinutes())}`);
  };

  // Animation autoplay loop
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      stepDate(1);
    }, 700);
    return () => clearInterval(interval);
  }, [isPlaying, transitDate, transitTime]);

  // Compute exact aspects between transit planets and natal planets
  const aspectHits = useMemo<AspectHit[]>(() => {
    const hits: AspectHit[] = [];
    const validPlanets: NineGrahaId[] = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

    transitChart.planets
      .filter((tp) => validPlanets.includes(tp.id as NineGrahaId))
      .forEach((tp) => {
        chart.planets
          .filter((np) => validPlanets.includes(np.id as NineGrahaId))
          .forEach((np) => {
            let diff = Math.abs(tp.longitude - np.longitude);
            if (diff > 180) diff = 360 - diff;

            // Check Conjunction (0° ± 6°)
            if (diff <= 6) {
              hits.push({
                transitPlanet: tp.id,
                natalPlanet: np.id,
                transitDegree: tp.longitude,
                natalDegree: np.longitude,
                aspectType: 'Conjunction',
                aspectColor: '#dc2626', // Red
                angleDiff: diff,
                orb: diff,
                vedicImpactEn: `Transit ${tp.id} is conjunct natal ${np.id} (orb: ${diff.toFixed(1)}°). Direct energetic fusion.`,
                vedicImpactHi: `गोचर ${HINDI_PLANETS[tp.id] || tp.id} जन्मकालिक ${HINDI_PLANETS[np.id] || np.id} पर से भ्रमण कर रहा है (अंतर: ${diff.toFixed(1)}°)। प्रत्यक्ष ऊर्जा का प्रभाव।`,
              });
            }
            // Check Opposition (180° ± 6°)
            else if (Math.abs(diff - 180) <= 6) {
              const orb = Math.abs(diff - 180);
              hits.push({
                transitPlanet: tp.id,
                natalPlanet: np.id,
                transitDegree: tp.longitude,
                natalDegree: np.longitude,
                aspectType: 'Opposition',
                aspectColor: '#ea580c', // Orange
                angleDiff: diff,
                orb,
                vedicImpactEn: `Transit ${tp.id} opposes natal ${np.id} (orb: ${orb.toFixed(1)}°). Direct 7th house drishti / mutual polarity.`,
                vedicImpactHi: `गोचर ${HINDI_PLANETS[tp.id] || tp.id} का जन्मकालिक ${HINDI_PLANETS[np.id] || np.id} पर पूर्ण सप्तम दृष्टि संबंध (अंतर: ${orb.toFixed(1)}°)।`,
              });
            }
            // Check Trine (120° ± 6°)
            else if (Math.abs(diff - 120) <= 6) {
              const orb = Math.abs(diff - 120);
              hits.push({
                transitPlanet: tp.id,
                natalPlanet: np.id,
                transitDegree: tp.longitude,
                natalDegree: np.longitude,
                aspectType: 'Trine',
                aspectColor: '#16a34a', // Emerald Green
                angleDiff: diff,
                orb,
                vedicImpactEn: `Transit ${tp.id} trines natal ${np.id} (orb: ${orb.toFixed(1)}°). Harmonious 5th/9th trine flow (Trikona blessing).`,
                vedicImpactHi: `गोचर ${HINDI_PLANETS[tp.id] || tp.id} व जन्मकालिक ${HINDI_PLANETS[np.id] || np.id} के मध्य शुभ त्रिकोण (120°) संबंध। कार्य सिद्धि में अनुकूलता।`,
              });
            }
            // Check Square (90° ± 5°)
            else if (Math.abs(diff - 90) <= 5) {
              const orb = Math.abs(diff - 90);
              hits.push({
                transitPlanet: tp.id,
                natalPlanet: np.id,
                transitDegree: tp.longitude,
                natalDegree: np.longitude,
                aspectType: 'Square',
                aspectColor: '#9333ea', // Purple
                angleDiff: diff,
                orb,
                vedicImpactEn: `Transit ${tp.id} squares natal ${np.id} (orb: ${orb.toFixed(1)}°). Dynamic Kendra friction / challenge requiring action.`,
                vedicImpactHi: `गोचर ${HINDI_PLANETS[tp.id] || tp.id} व जन्मकालिक ${HINDI_PLANETS[np.id] || np.id} के मध्य केंद्र तनाव (90°)। सतर्कता व प्रयास अपेक्षित।`,
              });
            }
            // Check Sextile (60° ± 4°)
            else if (Math.abs(diff - 60) <= 4) {
              const orb = Math.abs(diff - 60);
              hits.push({
                transitPlanet: tp.id,
                natalPlanet: np.id,
                transitDegree: tp.longitude,
                natalDegree: np.longitude,
                aspectType: 'Sextile',
                aspectColor: '#0284c7', // Sky Blue
                angleDiff: diff,
                orb,
                vedicImpactEn: `Transit ${tp.id} sextiles natal ${np.id} (orb: ${orb.toFixed(1)}°). Cooperative 3rd/11th friendship ray.`,
                vedicImpactHi: `गोचर ${HINDI_PLANETS[tp.id] || tp.id} व जन्मकालिक ${HINDI_PLANETS[np.id] || np.id} के मध्य 60° शुभ दृष्टि। सहयोग व मित्रता का संकेत।`,
              });
            }
          });
      });

    return hits.sort((a, b) => a.orb - b.orb);
  }, [transitChart, chart]);

  const filteredHits = useMemo(() => {
    if (filterAspect === 'all') return aspectHits;
    return aspectHits.filter((h) => h.aspectType === filterAspect);
  }, [aspectHits, filterAspect]);

  // SVG Dual Wheel Geometry
  const size = 560;
  const center = size / 2;
  const outerR = 260;
  const middleR = 195;
  const innerR = 135;

  const getCoordinates = (deg: number, radius: number) => {
    const rad = ((360 - deg) * Math.PI) / 180;
    return {
      x: center + radius * Math.cos(rad),
      y: center + radius * Math.sin(rad),
    };
  };

  return (
    <div className="oj-page-container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '16px' }}>
      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #78350f 0%, #1c1917 50%, #0c0a09 100%)',
          color: '#ffffff',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
          border: '1px solid rgba(217, 119, 6, 0.3)',
          marginBottom: '20px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '4px 10px',
                borderRadius: '9999px',
                background: 'rgba(245, 158, 11, 0.15)',
                color: '#fde68a',
                fontSize: '11px',
                fontWeight: '700',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                marginBottom: '8px',
              }}
            >
              Interactive Live Dual Transit Simulator
            </div>
            <h1 style={{ margin: '0 0 6px', fontSize: '26px', fontFamily: 'Cinzel, Playfair Display, serif', color: '#fef3c7' }}>
              द्वि-चक्र गोचर सिम्युलेटर (Double Transit Wheel)
            </h1>
            <p style={{ margin: 0, fontSize: '13px', color: 'rgba(254, 243, 199, 0.85)', maxWidth: '680px', lineHeight: '1.5' }}>
              जन्म कुंडली (आंतरिक चक्र) पर वर्तमान गोचर ग्रहों (बाह्य चक्र) की तात्कालिक स्थिति, दृष्टि संबंध (Aspect Rays) एवं सटीक डिग्री अंतर का जीवंत विश्लेषण।
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('kundli')}
                className="oj-action-btn primary"
              >
                लग्न चक्र
              </button>
            )}
          </div>
        </div>

        {/* Time Travel Controls Bar */}
        <div
          style={{
            marginTop: '20px',
            paddingTop: '16px',
            borderTop: '1px solid rgba(245, 158, 11, 0.2)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            fontSize: '12.5px',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#fde68a', fontWeight: 'bold' }}>गोचर दिनांक:</span>
            <input
              type="date"
              value={transitDate}
              onChange={(e) => setTransitDate(e.target.value)}
              className="oj-select-pill"
              style={{ background: 'rgba(0, 0, 0, 0.4)', color: '#ffffff', borderColor: 'rgba(245, 158, 11, 0.3)' }}
            />
            <input
              type="time"
              value={transitTime}
              onChange={(e) => setTransitTime(e.target.value)}
              className="oj-select-pill"
              style={{ background: 'rgba(0, 0, 0, 0.4)', color: '#ffffff', borderColor: 'rgba(245, 158, 11, 0.3)' }}
            />
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px' }}>
            <button
              type="button"
              onClick={() => stepDate(-1)}
              className="oj-tab-pill"
              style={{ padding: '6px 12px', fontSize: '11.5px' }}
            >
              -1 दिन
            </button>
            <button
              type="button"
              onClick={() => stepDate(1)}
              className="oj-tab-pill"
              style={{ padding: '6px 12px', fontSize: '11.5px' }}
            >
              +1 दिन
            </button>
            <button
              type="button"
              onClick={() => stepMonth(-1)}
              className="oj-tab-pill"
              style={{ padding: '6px 12px', fontSize: '11.5px' }}
            >
              -1 माह
            </button>
            <button
              type="button"
              onClick={() => stepMonth(1)}
              className="oj-tab-pill"
              style={{ padding: '6px 12px', fontSize: '11.5px' }}
            >
              +1 माह
            </button>
            <button
              type="button"
              onClick={resetToToday}
              className="btn btn-primary"
              style={{ padding: '6px 14px', fontSize: '11.5px' }}
            >
              वर्तमान (Now)
            </button>
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              style={{
                padding: '6px 14px',
                borderRadius: '9999px',
                fontSize: '11.5px',
                fontWeight: 'bold',
                background: isPlaying ? '#dc2626' : '#16a34a',
                color: '#ffffff',
                boxShadow: isPlaying ? '0 2px 8px rgba(220, 38, 38, 0.4)' : '0 2px 8px rgba(22, 163, 74, 0.4)',
              }}
            >
              {isPlaying ? 'रोकें (Pause)' : 'ऑटो-प्ले (Play)'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Wheel & Aspects Content */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', alignItems: 'start' }}>
        {/* Left: Dual Wheel SVG */}
        <div className="oj-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '12px', fontSize: '12px' }}>
            <span style={{ fontWeight: 'bold', color: 'var(--text)' }}>
              बाहरी रिंग: गोचर ग्रह ({transitDate}) | आंतरिक रिंग: जन्म कुंडली
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#dc2626', fontWeight: 'bold' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#dc2626' }}></span> युति (0°)
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#16a34a', fontWeight: 'bold' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#16a34a' }}></span> त्रिकोण (120°)
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#ea580c', fontWeight: 'bold' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ea580c' }}></span> दृष्टि (180°)
              </span>
            </div>
          </div>

          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', overflowX: 'auto' }}>
            <svg
              width={size}
              height={size}
              viewBox={`0 0 ${size} ${size}`}
              style={{ maxWidth: '100%', height: 'auto', userSelect: 'none' }}
            >
              {/* Outer boundary circle */}
              <circle
                cx={center}
                cy={center}
                r={outerR}
                fill="none"
                stroke="#d97706"
                strokeWidth="2"
                strokeDasharray="4 2"
              />

              {/* Middle boundary circle */}
              <circle
                cx={center}
                cy={center}
                r={middleR}
                fill="#fef3c7"
                fillOpacity="0.12"
                stroke="#b45309"
                strokeWidth="1.5"
              />

              {/* Inner core circle */}
              <circle
                cx={center}
                cy={center}
                r={innerR}
                fill="#fafaf9"
                fillOpacity="0.8"
                stroke="#78716c"
                strokeWidth="1.5"
              />

              {/* 12 Zodiac Rashi Segments */}
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = i * 30;
                const { x: x1, y: y1 } = getCoordinates(angle, innerR);
                const { x: x2, y: y2 } = getCoordinates(angle, outerR);
                const labelCoord = getCoordinates(angle + 15, (middleR + outerR) / 2);
                return (
                  <g key={i}>
                    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#d6d3d1" strokeWidth="1" />
                    <text
                      x={labelCoord.x}
                      y={labelCoord.y}
                      fill="#78716c"
                      fontSize="10"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      {SIGNS[i].name.slice(0, 3)}
                    </text>
                  </g>
                );
              })}

              {/* Aspect Lines / Chords */}
              {aspectHits.slice(0, 15).map((hit, idx) => {
                const p1 = getCoordinates(hit.transitDegree, middleR);
                const p2 = getCoordinates(hit.natalDegree, innerR);
                return (
                  <line
                    key={idx}
                    x1={p1.x}
                    y1={p1.y}
                    x2={p2.x}
                    y2={p2.y}
                    stroke={hit.aspectColor}
                    strokeWidth={hit.orb <= 2 ? '2' : '1'}
                    strokeDasharray={hit.aspectType === 'Trine' ? 'none' : '3 2'}
                    opacity={hit.orb <= 2 ? 0.9 : 0.6}
                  />
                );
              })}

              {/* Natal Planets (Inner Wheel) */}
              {chart.planets
                .filter((p) => ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'].includes(p.id))
                .map((np) => {
                  const coord = getCoordinates(np.longitude, innerR - 28);
                  return (
                    <g key={np.id}>
                      <circle cx={coord.x} cy={coord.y} r="13" fill="#ffffff" stroke="#b45309" strokeWidth="1.5" />
                      <text
                        x={coord.x}
                        y={coord.y}
                        fill="#b45309"
                        fontSize="9.5"
                        fontWeight="bold"
                        textAnchor="middle"
                        dominantBaseline="central"
                      >
                        {np.id.slice(0, 2)}
                      </text>
                    </g>
                  );
                })}

              {/* Natal Lagna Marker */}
              {(() => {
                const ascCoord = getCoordinates(chart.ascendant.longitude, innerR - 28);
                return (
                  <g>
                    <circle cx={ascCoord.x} cy={ascCoord.y} r="13" fill="#b45309" stroke="#ffffff" strokeWidth="1.5" />
                    <text
                      x={ascCoord.x}
                      y={ascCoord.y}
                      fill="#ffffff"
                      fontSize="9.5"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      Lag
                    </text>
                  </g>
                );
              })()}

              {/* Transit Planets (Outer Wheel) */}
              {transitChart.planets
                .filter((p) => ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'].includes(p.id))
                .map((tp) => {
                  const coord = getCoordinates(tp.longitude, middleR + 32);
                  return (
                    <g key={tp.id}>
                      <circle cx={coord.x} cy={coord.y} r="14" fill="#d97706" stroke="#ffffff" strokeWidth="2" />
                      <text
                        x={coord.x}
                        y={coord.y}
                        fill="#ffffff"
                        fontSize="9.5"
                        fontWeight="bold"
                        textAnchor="middle"
                        dominantBaseline="central"
                      >
                        {tp.id.slice(0, 2)}
                      </text>
                    </g>
                  );
                })}

              {/* Center Core Info */}
              <circle cx={center} cy={center} r="45" fill="#fef3c7" stroke="#b45309" strokeWidth="1" />
              <text
                x={center}
                y={center - 10}
                fill="#78350f"
                fontSize="11"
                fontWeight="bold"
                textAnchor="middle"
              >
                D-1 Natal
              </text>
              <text
                x={center}
                y={center + 8}
                fill="#92400e"
                fontSize="9"
                fontWeight="medium"
                textAnchor="middle"
              >
                {chart.input.name || 'Kundali'}
              </text>
              <text
                x={center}
                y={center + 22}
                fill="#b45309"
                fontSize="8"
                fontWeight="bold"
                textAnchor="middle"
              >
                Gochar Live
              </text>
            </svg>
          </div>
        </div>

        {/* Right: Live Transit Hits & Aspects Inspector */}
        <div className="oj-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h2 style={{ margin: 0, fontFamily: 'Cinzel, Playfair Display, serif', fontWeight: 'bold', fontSize: '17px', color: '#b45309' }}>
              सक्रिय गोचर दृष्टि व युति (Live Aspect Hits)
            </h2>
            <span style={{ fontSize: '11px', background: 'rgba(217, 119, 6, 0.12)', color: '#b45309', padding: '3px 8px', borderRadius: '9999px', fontWeight: 'bold' }}>
              {aspectHits.length} सक्रिय संबंध
            </span>
          </div>

          {/* Filter Pills */}
          <div className="oj-tab-pills-row" style={{ marginBottom: '12px' }}>
            {['all', 'Conjunction', 'Trine', 'Opposition', 'Square', 'Sextile'].map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilterAspect(f)}
                className={`oj-tab-pill ${filterAspect === f ? 'is-active' : ''}`}
                style={{ padding: '4px 10px', fontSize: '11.5px' }}
              >
                {f === 'all' ? 'समस्त' : f}
              </button>
            ))}
          </div>

          {/* Aspect Hits List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '460px', overflowY: 'auto', paddingRight: '4px' }}>
            {filteredHits.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)', fontSize: '12px', fontStyle: 'italic' }}>
                इस समय इस श्रेणी का कोई निकट दृष्टि संबंध नहीं है।
              </div>
            ) : (
              filteredHits.map((hit, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1px solid var(--border)',
                    background: 'var(--bg-elevated)',
                    fontSize: '12px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 'bold', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span
                        style={{
                          width: '9px',
                          height: '9px',
                          borderRadius: '50%',
                          backgroundColor: hit.aspectColor,
                        }}
                      />
                      गोचर {HINDI_PLANETS[hit.transitPlanet] || hit.transitPlanet} → जन्म {HINDI_PLANETS[hit.natalPlanet] || hit.natalPlanet}
                    </span>
                    <span style={{ fontSize: '10px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '9999px', background: 'var(--bg-subtle)', color: 'var(--text-muted)' }}>
                      {hit.aspectType} ({hit.orb.toFixed(1)}°)
                    </span>
                  </div>
                  <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '11.5px', lineHeight: '1.4' }}>
                    {hit.vedicImpactHi}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DualTransitWheelView;
