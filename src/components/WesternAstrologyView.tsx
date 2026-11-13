import React, { useMemo, useState } from 'react';
import {
  Compass,
  FileSpreadsheet,
  Globe,
  Info,
  Layers,
  Orbit,
  PieChart,
  Sparkles,
  Zap,
} from 'lucide-react';
import {
  computeWesternAstrologyReport,
  WESTERN_PLANET_SYMBOLS,
  WESTERN_SIGNS,
  type DetectedWesternAspect,
  type WesternPlanetPlacement,
} from '../astro/westernAstrology';
import type { ChartData } from '../astro/types';
import { useLanguage } from '../i18n/LanguageContext';

interface WesternAstrologyViewProps {
  chart: ChartData;
}

export const WesternAstrologyView: React.FC<WesternAstrologyViewProps> = ({ chart }) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';
  const [selectedBody, setSelectedBody] = useState<string | null>(null);

  const report = useMemo(() => computeWesternAstrologyReport(chart), [chart]);

  // SVG dimensions for the circular wheel
  const size = 520;
  const center = size / 2;
  const outerRadius = 230;
  const innerRadius = 180;
  const aspectRadius = 140;

  const degToRad = (deg: number) => ((deg - 90) * Math.PI) / 180;

  return (
    <div className="view-stack">
      {/* Header Banner */}
      <div className="card" style={{ borderLeft: '4px solid #2563eb' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Globe size={20} style={{ color: '#2563eb' }} />
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>
                {isHi ? 'पाश्चात्य ज्योतिष एवं सायन चक्र (Western Tropical Wheel)' : 'Western Astrology & Tropical Wheel'}
              </h2>
            </div>
            <p className="muted" style={{ margin: '4px 0 0', fontSize: '13px' }}>
              {isHi
                ? 'सायन (Tropical) राशि चक्र, पाश्चात्य ग्रह दृष्टि (Aspects), तत्व एवं स्वभाव संतुलन'
                : 'Tropical Zodiac (Sayana), Western Planetary Aspects, Elements & Modalities Balance'}
            </p>
          </div>
          <div className="badge badge-accent mono">
            {chart.settings.ayanamsa}: {chart.ayanamsaDeg.toFixed(2)}°
          </div>
        </div>
      </div>

      {/* Big Three Summary */}
      <div className="card" style={{ background: 'var(--bg-subtle)' }}>
        <h3 style={{ margin: '0 0 10px', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles size={16} style={{ color: 'var(--accent)' }} />
          <span>{isHi ? 'पाश्चात्य "बिग थ्री" (Big Three: Sun, Moon & Rising)' : 'The Big Three (Sun, Moon & Ascendant)'}</span>
        </h3>
        <p style={{ margin: '0 0 14px', lineHeight: 1.5, fontSize: '13.5px' }}>
          {isHi ? report.bigThreeSummaryHi : report.bigThreeSummaryEn}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
          <div className="card" style={{ padding: '12px', background: 'var(--bg-elevated)' }}>
            <div className="muted small-text">{isHi ? 'सूर्य राशि (Core Ego)' : 'Sun Sign (Identity)'}</div>
            <div style={{ fontSize: '18px', fontWeight: 700, margin: '4px 0' }}>
              ☉ {isHi ? report.sunPlacement.signNameHi : report.sunPlacement.signNameEn}
            </div>
            <div className="mono small-text">{report.sunPlacement.dms} · House {report.sunPlacement.house}</div>
          </div>

          <div className="card" style={{ padding: '12px', background: 'var(--bg-elevated)' }}>
            <div className="muted small-text">{isHi ? 'चंद्र राशि (Emotional Nature)' : 'Moon Sign (Emotions)'}</div>
            <div style={{ fontSize: '18px', fontWeight: 700, margin: '4px 0' }}>
              ☽ {isHi ? report.moonPlacement.signNameHi : report.moonPlacement.signNameEn}
            </div>
            <div className="mono small-text">{report.moonPlacement.dms} · House {report.moonPlacement.house}</div>
          </div>

          <div className="card" style={{ padding: '12px', background: 'var(--bg-elevated)' }}>
            <div className="muted small-text">{isHi ? 'लग्न / राइजिंग (Outer Mask)' : 'Rising / Ascendant (Persona)'}</div>
            <div style={{ fontSize: '18px', fontWeight: 700, margin: '4px 0' }}>
              AC {isHi ? report.ascendant.signNameHi : report.ascendant.signNameEn}
            </div>
            <div className="mono small-text">{report.ascendant.dms}</div>
          </div>
        </div>
      </div>

      {/* Main Wheel Chart & Elements Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '16px', alignItems: 'start' }}>
        {/* Western Circular Wheel SVG */}
        <div className="card" style={{ textAlign: 'center', padding: '14px' }}>
          <h3 style={{ margin: '0 0 12px', fontSize: '15px' }}>
            {isHi ? 'सायन चक्र (Western 360° Circular Chart)' : 'Tropical Zodiac Wheel (360°)'}
          </h3>

          <div style={{ maxWidth: '100%', overflowX: 'auto', display: 'flex', justifyContent: 'center' }}>
            <svg
              viewBox={`0 0 ${size} ${size}`}
              style={{ width: '100%', maxWidth: '440px', height: 'auto', background: 'var(--bg-elevated)', borderRadius: '50%' }}
            >
              {/* Outer Signs Ring */}
              <circle cx={center} cy={center} r={outerRadius} fill="none" stroke="var(--border)" strokeWidth="2" />
              <circle cx={center} cy={center} r={innerRadius} fill="none" stroke="var(--border)" strokeWidth="1.5" />
              <circle cx={center} cy={center} r={aspectRadius} fill="none" stroke="var(--border)" strokeDasharray="3,3" />

              {/* 12 Signs Sectors & Glyphs */}
              {WESTERN_SIGNS.map((s) => {
                const startAngle = s.index * 30;
                const midAngle = startAngle + 15;
                const rText = (outerRadius + innerRadius) / 2;
                const xText = center + rText * Math.cos(degToRad(midAngle));
                const yText = center + rText * Math.sin(degToRad(midAngle));

                const xLine = center + outerRadius * Math.cos(degToRad(startAngle));
                const yLine = center + outerRadius * Math.sin(degToRad(startAngle));
                const xIn = center + aspectRadius * Math.cos(degToRad(startAngle));
                const yIn = center + aspectRadius * Math.sin(degToRad(startAngle));

                let elementColor = '#ea580c'; // Fire
                if (s.element === 'Earth') elementColor = '#65a30d';
                else if (s.element === 'Air') elementColor = '#0284c7';
                else if (s.element === 'Water') elementColor = '#3b82f6';

                return (
                  <g key={s.index}>
                    <line x1={xIn} y1={yIn} x2={xLine} y2={yLine} stroke="var(--border)" strokeWidth="1" />
                    <text
                      x={xText}
                      y={yText}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize="14"
                      fontWeight="bold"
                      fill={elementColor}
                    >
                      {s.symbol}
                    </text>
                  </g>
                );
              })}

              {/* Aspect Lines across center */}
              {report.aspects.slice(0, 24).map((asp, idx) => {
                const b1 = report.planets.find((p) => p.id === asp.planet1) || report.ascendant;
                const b2 = report.planets.find((p) => p.id === asp.planet2) || report.ascendant;
                const x1 = center + (aspectRadius - 8) * Math.cos(degToRad(b1.tropicalLon));
                const y1 = center + (aspectRadius - 8) * Math.sin(degToRad(b1.tropicalLon));
                const x2 = center + (aspectRadius - 8) * Math.cos(degToRad(b2.tropicalLon));
                const y2 = center + (aspectRadius - 8) * Math.sin(degToRad(b2.tropicalLon));

                return (
                  <line
                    key={idx}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={asp.definition.color}
                    strokeWidth="1.2"
                    opacity="0.65"
                  />
                );
              })}

              {/* Planets Plotted around wheel */}
              {report.planets.map((p) => {
                const rPlanet = aspectRadius + 18;
                const xP = center + rPlanet * Math.cos(degToRad(p.tropicalLon));
                const yP = center + rPlanet * Math.sin(degToRad(p.tropicalLon));
                const isSelected = selectedBody === p.id;

                return (
                  <g
                    key={p.id}
                    onClick={() => setSelectedBody(isSelected ? null : p.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <circle
                      cx={xP}
                      cy={yP}
                      r="12"
                      fill={isSelected ? 'var(--accent)' : 'var(--bg-elevated)'}
                      stroke={isSelected ? 'var(--accent)' : 'var(--border-strong)'}
                      strokeWidth="1.5"
                    />
                    <text
                      x={xP}
                      y={yP}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize="11"
                      fontWeight="bold"
                      fill={isSelected ? '#ffffff' : 'var(--text)'}
                    >
                      {p.symbol}
                    </text>
                  </g>
                );
              })}

              {/* Center Wheel Core */}
              <circle cx={center} cy={center} r="32" fill="var(--bg-subtle)" stroke="var(--border)" strokeWidth="1" />
              <text
                x={center}
                y={center - 4}
                textAnchor="middle"
                fontSize="11"
                fontWeight="bold"
                fill="var(--accent)"
              >
                TROPICAL
              </text>
              <text
                x={center}
                y={center + 10}
                textAnchor="middle"
                fontSize="9"
                className="mono muted"
                fill="var(--text-muted)"
              >
                0° ARIES
              </text>
            </svg>
          </div>

          <div className="muted small-text" style={{ marginTop: '10px' }}>
            {isHi
              ? 'चक्र में ग्रह प्रतीक पर क्लिक करके विवरण देखें। नीली रेखाएं त्रिकोण/षष्ठक (शुभ), लाल रेखाएं केंद्र/प्रतियोग (चुनौतीपूर्ण) दर्शाती हैं।'
              : 'Click any planet symbol on the wheel. Blue lines = Trine/Sextile (Harmonious), Red/Amber = Square/Opposition (Dynamic/Challenging).'}
          </div>
        </div>

        {/* Elements, Modalities & Planetary Tables */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Elements & Modalities Balance */}
          <div className="card">
            <h4 style={{ margin: '0 0 10px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <PieChart size={15} />
              <span>{isHi ? 'तत्व एवं स्वभाव संतुलन (Elements & Modalities)' : 'Elements & Modalities Balance'}</span>
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '12px' }}>
              <div style={{ padding: '8px', background: 'rgba(234, 88, 12, 0.12)', borderRadius: '6px', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: '#ea580c', fontWeight: 600 }}>{isHi ? 'अग्नि (Fire)' : 'Fire'}</div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#ea580c' }}>{report.elementBalance.Fire}</div>
              </div>
              <div style={{ padding: '8px', background: 'rgba(101, 163, 13, 0.12)', borderRadius: '6px', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: '#65a30d', fontWeight: 600 }}>{isHi ? 'पृथ्वी (Earth)' : 'Earth'}</div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#65a30d' }}>{report.elementBalance.Earth}</div>
              </div>
              <div style={{ padding: '8px', background: 'rgba(2, 132, 199, 0.12)', borderRadius: '6px', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: '#0284c7', fontWeight: 600 }}>{isHi ? 'वायु (Air)' : 'Air'}</div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#0284c7' }}>{report.elementBalance.Air}</div>
              </div>
              <div style={{ padding: '8px', background: 'rgba(59, 130, 246, 0.12)', borderRadius: '6px', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: '#3b82f6', fontWeight: 600 }}>{isHi ? 'जल (Water)' : 'Water'}</div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#3b82f6' }}>{report.elementBalance.Water}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              <div style={{ padding: '6px 8px', background: 'var(--bg-subtle)', borderRadius: '6px', textAlign: 'center' }}>
                <span className="muted small-text">{isHi ? 'चर (Cardinal)' : 'Cardinal'}: </span>
                <strong>{report.modalityBalance.Cardinal}</strong>
              </div>
              <div style={{ padding: '6px 8px', background: 'var(--bg-subtle)', borderRadius: '6px', textAlign: 'center' }}>
                <span className="muted small-text">{isHi ? 'स्थिर (Fixed)' : 'Fixed'}: </span>
                <strong>{report.modalityBalance.Fixed}</strong>
              </div>
              <div style={{ padding: '6px 8px', background: 'var(--bg-subtle)', borderRadius: '6px', textAlign: 'center' }}>
                <span className="muted small-text">{isHi ? 'द्विस्वभाव (Mutable)' : 'Mutable'}: </span>
                <strong>{report.modalityBalance.Mutable}</strong>
              </div>
            </div>
          </div>

          {/* Western Placements Table */}
          <div className="card">
            <h4 style={{ margin: '0 0 10px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FileSpreadsheet size={15} />
              <span>{isHi ? 'पाश्चात्य सायन ग्रह स्थिति (Tropical Positions)' : 'Tropical Planetary Positions'}</span>
            </h4>

            <div style={{ overflowX: 'auto' }}>
              <table className="data-table" style={{ width: '100%', fontSize: '12px' }}>
                <thead>
                  <tr>
                    <th>{isHi ? 'ग्रह' : 'Body'}</th>
                    <th>{isHi ? 'सायन राशि' : 'Tropical Sign'}</th>
                    <th>{isHi ? 'अंश' : 'Degrees'}</th>
                    <th>{isHi ? 'भाव' : 'House'}</th>
                    <th>{isHi ? 'गति' : 'Motion'}</th>
                  </tr>
                </thead>
                <tbody>
                  {[report.ascendant, report.midheaven, ...report.planets].map((p) => (
                    <tr
                      key={p.id}
                      style={{
                        background: selectedBody === p.id ? 'var(--accent-soft)' : undefined,
                        cursor: 'pointer',
                      }}
                      onClick={() => setSelectedBody(p.id)}
                    >
                      <td>
                        <strong>{p.symbol} {p.id}</strong>
                      </td>
                      <td>{isHi ? p.signNameHi : p.signNameEn}</td>
                      <td className="mono">{p.dms}</td>
                      <td>H{p.house}</td>
                      <td>
                        {p.isRetrograde ? (
                          <span className="badge badge-bad">R</span>
                        ) : (
                          <span className="badge badge-good">D</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Western Aspects Section */}
      <div className="card">
        <h3 style={{ margin: '0 0 12px', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Zap size={16} style={{ color: 'var(--accent)' }} />
          <span>{isHi ? 'पाश्चात्य ग्रह दृष्टियां एवं योग (Western Aspects)' : 'Planetary Aspects & Orbs'}</span>
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
          {report.aspects.map((asp, idx) => (
            <div
              key={idx}
              className="card"
              style={{
                padding: '10px 12px',
                borderLeft: `4px solid ${asp.definition.color}`,
                background: 'var(--bg-elevated)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontWeight: 700, fontSize: '13.5px' }}>
                  {asp.symbol1} {asp.planet1} {asp.definition.symbol} {asp.symbol2} {asp.planet2}
                </span>
                <span className="badge mono small-text" style={{ borderColor: asp.definition.color }}>
                  {asp.aspect} (orb {asp.orb}°)
                </span>
              </div>
              <p style={{ margin: '4px 0 0', fontSize: '12px', lineHeight: 1.4 }} className="muted">
                {isHi ? asp.interpretationHi : asp.interpretationEn}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Sidereal vs Tropical Comparative Table */}
      <div className="card">
        <h3 style={{ margin: '0 0 8px', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Layers size={16} />
          <span>{isHi ? 'वैदिक (निरयन) बनाम पाश्चात्य (सायन) तुलना' : 'Vedic (Sidereal) vs Western (Tropical) Comparison'}</span>
        </h3>
        <p className="muted small-text" style={{ margin: '0 0 12px' }}>
          {isHi
            ? `वैदिक ज्योतिष अयनांश (${chart.settings.ayanamsa} = ${chart.ayanamsaDeg.toFixed(2)}°) घटाकर स्थिर नक्षत्रों पर आधारित निरयन गणना करता है, जबकि पाश्चात्य ज्योतिष विषुव बिंदु (0° मेष) से सायन गणना करता है।`
            : `Vedic Jyotish uses the Sidereal Zodiac (subtracting Ayanamsa ${chart.settings.ayanamsa} = ${chart.ayanamsaDeg.toFixed(2)}° to anchor to fixed stars), while Western Astrology uses the Tropical Zodiac anchored to the Spring Equinox.`}
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ width: '100%', fontSize: '12px' }}>
            <thead>
              <tr>
                <th>{isHi ? 'ग्रह' : 'Body'}</th>
                <th>{isHi ? 'वैदिक राशि (Sidereal)' : 'Vedic (Sidereal)'}</th>
                <th>{isHi ? 'वैदिक अंश' : 'Vedic Degrees'}</th>
                <th>{isHi ? 'पाश्चात्य राशि (Tropical)' : 'Western (Tropical)'}</th>
                <th>{isHi ? 'पाश्चात्य अंश' : 'Tropical Degrees'}</th>
                <th>{isHi ? 'अंतर (Ayanamsa)' : 'Ayanamsa Shift'}</th>
              </tr>
            </thead>
            <tbody>
              {report.siderealVsTropicalComparison.map((row) => (
                <tr key={row.body}>
                  <td><strong>{row.body}</strong></td>
                  <td>{row.siderealSign}</td>
                  <td className="mono">{row.siderealDeg}</td>
                  <td style={{ color: '#2563eb', fontWeight: 600 }}>{row.tropicalSign}</td>
                  <td className="mono" style={{ color: '#2563eb' }}>{row.tropicalDeg}</td>
                  <td className="mono muted">{row.differenceAyanamsa}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
