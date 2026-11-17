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
  const [viewMode, setViewMode] = useState<'wheel' | 'side_by_side'>('wheel');
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
    // 0 deg Aries at 3 o'clock, counter-clockwise
    const rad = ((360 - deg) * Math.PI) / 180;
    return {
      x: center + radius * Math.cos(rad),
      y: center + radius * Math.sin(rad),
    };
  };

  return (
    <div className="dual-transit-wheel-view space-y-6 max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-900 via-stone-900 to-amber-950 text-white rounded-2xl p-6 shadow-xl border border-amber-600/30">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-200 text-xs font-semibold uppercase tracking-wider mb-2 border border-amber-500/30">
              Interactive Live Dual Transit Simulator
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-100">
              द्वि-चक्र गोचर सिम्युलेटर (Double Transit Wheel)
            </h1>
            <p className="text-amber-200/90 text-xs sm:text-sm mt-1 max-w-2xl font-sans">
              जन्म कुंडली (आंतरिक चक्र) पर वर्तमान गोचर ग्रहों (बाह्य चक्र) की तात्कालिक स्थिति, दृष्टि संबंध (Aspect Rays) एवं सटीक डिग्री अंतर का जीवंत विश्लेषण।
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setViewMode(viewMode === 'wheel' ? 'side_by_side' : 'wheel')}
              className="btn btn-secondary"
            >
              {viewMode === 'wheel' ? 'साइड-बाय-साइड चक्र' : 'डबल व्हील चक्र'}
            </button>
            {onNavigate && (
              <button
                onClick={() => onNavigate('kundli')}
                className="btn btn-primary"
              >
                लग्न चक्र
              </button>
            )}
          </div>
        </div>

        {/* Time Travel Controls */}
        <div className="mt-6 pt-4 border-t border-amber-700/40 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-amber-300 font-semibold">गोचर दिनांक:</span>
            <input
              type="date"
              value={transitDate}
              onChange={(e) => setTransitDate(e.target.value)}
              className="bg-black/40 border border-amber-500/30 rounded-lg px-2.5 py-1 text-white font-mono"
            />
            <input
              type="time"
              value={transitTime}
              onChange={(e) => setTransitTime(e.target.value)}
              className="bg-black/40 border border-amber-500/30 rounded-lg px-2 py-1 text-white font-mono"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => stepDate(-1)}
              className="px-2.5 py-1 rounded-full bg-stone-800 hover:bg-stone-700 text-amber-200 font-semibold border border-stone-700"
            >
              -1 दिन
            </button>
            <button
              onClick={() => stepDate(1)}
              className="px-2.5 py-1 rounded-full bg-stone-800 hover:bg-stone-700 text-amber-200 font-semibold border border-stone-700"
            >
              +1 दिन
            </button>
            <button
              onClick={() => stepMonth(-1)}
              className="px-2.5 py-1 rounded-full bg-stone-800 hover:bg-stone-700 text-amber-200 font-semibold border border-stone-700"
            >
              -1 माह
            </button>
            <button
              onClick={() => stepMonth(1)}
              className="px-2.5 py-1 rounded-full bg-stone-800 hover:bg-stone-700 text-amber-200 font-semibold border border-stone-700"
            >
              +1 माह
            </button>
            <button
              onClick={resetToToday}
              className="px-3 py-1 rounded-full bg-amber-600 hover:bg-amber-500 text-white font-bold"
            >
              वर्तमान (Now)
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-3 py-1 rounded-full font-bold ${
                isPlaying ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
              }`}
            >
              {isPlaying ? 'रोकें (Pause)' : 'ऑटो-प्ले (Play)'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Dual Wheel Interactive SVG */}
        <div className="lg:col-span-7 bg-white dark:bg-stone-900 rounded-2xl p-4 sm:p-6 shadow-md border border-stone-200 dark:border-stone-800 flex flex-col items-center">
          <div className="flex justify-between items-center w-full mb-3 text-xs">
            <span className="font-bold text-stone-700 dark:text-stone-300">
              बाहरी रिंग: गोचर ग्रह ({transitDate}) | आंतरिक रिंग: जन्म कुंडली
            </span>
            <div className="flex gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] text-red-600 font-medium">
                <span className="w-2 h-2 rounded-full bg-red-600"></span> युति (0°)
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span> त्रिकोण (120°)
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-orange-600 font-medium">
                <span className="w-2 h-2 rounded-full bg-orange-600"></span> दृष्टि (180°)
              </span>
            </div>
          </div>

          <div className="w-full flex justify-center overflow-x-auto">
            <svg
              width={size}
              height={size}
              viewBox={`0 0 ${size} ${size}`}
              className="max-w-full h-auto select-none"
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
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-stone-900 rounded-2xl p-5 shadow-md border border-stone-200 dark:border-stone-800">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-serif font-bold text-lg text-amber-900 dark:text-amber-400">
                सक्रिय गोचर दृष्टि व युति (Live Aspect Hits)
              </h2>
              <span className="text-xs bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full font-bold">
                {aspectHits.length} सक्रिय संबंध
              </span>
            </div>

            {/* Filter */}
            <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1 text-xs">
              {['all', 'Conjunction', 'Trine', 'Opposition', 'Square', 'Sextile'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilterAspect(f)}
                  className={`px-2 py-0.5 rounded-full font-semibold transition-all ${
                    filterAspect === f
                      ? 'bg-amber-600 text-white'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                  }`}
                >
                  {f === 'all' ? 'समस्त' : f}
                </button>
              ))}
            </div>

            {/* Aspect Hits List */}
            <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
              {filteredHits.length === 0 ? (
                <div className="text-center py-8 text-stone-500 text-xs italic">
                  इस समय इस श्रेणी का कोई निकट दृष्टि संबंध नहीं है।
                </div>
              ) : (
                filteredHits.map((hit, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40 text-xs"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: hit.aspectColor }}
                        ></span>
                        गोचर {HINDI_PLANETS[hit.transitPlanet] || hit.transitPlanet} → जन्म {HINDI_PLANETS[hit.natalPlanet] || hit.natalPlanet}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200">
                        {hit.aspectType} (अंतर: {hit.orb.toFixed(1)}°)
                      </span>
                    </div>
                    <p className="text-stone-600 dark:text-stone-400 text-[11.5px] mt-1 leading-snug">
                      {hit.vedicImpactHi}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DualTransitWheelView;
