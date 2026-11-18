import React, { useMemo, useState } from 'react';
import {
  Award,
  BookOpen,
  CheckCircle2,
  Compass,
  Flame,
  Info,
  Layers,
  Printer,
  Shield,
  Sparkles,
  Zap,
} from 'lucide-react';
import {
  computeHumanDesign,
  type ActivatedGate,
  type EnergyCenter,
  type HumanDesignReport,
} from '../../astro/humanDesign';
import type { ChartData } from '../../astro/types';
import { useLanguage } from '../../i18n/LanguageContext';

interface HumanDesignViewProps {
  chart: ChartData;
  onNavigate?: (view: string) => void;
}

export const HumanDesignView: React.FC<HumanDesignViewProps> = ({ chart, onNavigate }) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';

  const [selectedCenter, setSelectedCenter] = useState<EnergyCenter | null>(null);

  const report: HumanDesignReport = useMemo(() => {
    return computeHumanDesign(chart);
  }, [chart]);

  // Center coordinates for SVG BodyGraph
  const centerPositions: Record<string, { x: number; y: number; shape: 'triangle' | 'inv-triangle' | 'square' | 'diamond'; color: string }> = {
    head: { x: 150, y: 35, shape: 'triangle', color: '#eab308' },
    ajna: { x: 150, y: 95, shape: 'inv-triangle', color: '#10b981' },
    throat: { x: 150, y: 165, shape: 'square', color: '#8b5cf6' },
    'g-center': { x: 150, y: 245, shape: 'diamond', color: '#eab308' },
    heart: { x: 215, y: 260, shape: 'triangle', color: '#ef4444' },
    spleen: { x: 75, y: 330, shape: 'triangle', color: '#9333ea' },
    sacral: { x: 150, y: 340, shape: 'square', color: '#f97316' },
    'solar-plexus': { x: 225, y: 330, shape: 'triangle', color: '#06b6d4' },
    root: { x: 150, y: 430, shape: 'square', color: '#64748b' },
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
          {isHi ? 'ह्यूमन डिज़ाइन व ९ चक्र बॉडीग्राफ़' : 'Human Design & 9 Energy Centers BodyGraph'}
        </span>
      </nav>

      {/* Header Card */}
      <div className="oj-page-header-card">
        <div className="oj-header-badge">
          {isHi
            ? '६४ आई-चिंग द्वार, ९ चक्र एवं ५ ऊर्जा प्रकारों का प्रामाणिक समन्वय'
            : 'Synthesis of 64 I-Ching Hexagrams, 9 Energy Centers & Vedic Chakras'}
        </div>
        <h1 className="oj-page-title">
          {isHi
            ? 'ह्यूमन डिज़ाइन: आपकी आनुवंशिक ऊर्जा व निर्णय क्षमता का खाका'
            : 'Human Design System: The Genetic Blueprint & BodyGraph'}
        </h1>
        <p className="oj-page-subtitle">
          {isHi
            ? 'ह्यूमन डिज़ाइन आपकी जन्मकुंडली के ग्रहों को ६४ आई-चिंग द्वारों एवं ९ शक्ति केंद्रों (चक्रों) में विभाजित कर आपके प्रामाणिक निर्णय लेने की आंतरिक सत्ता (Authority), रणनीति (Strategy) एवं जीवन उद्देश्य का उद्घाटन करता है।'
            : 'Human Design maps natal planetary positions across 64 I-Ching Gates and 9 Energy Centers, determining your personal Energy Type, Decision-making Authority, Strategy, and Incarnation Cross.'}
        </p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
          <button
            onClick={() => window.print()}
            className="oj-action-btn no-print"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Printer size={15} />
            <span>{isHi ? 'बॉडीग्राफ़ रिपोर्ट प्रिंट करें' : 'Print BodyGraph Report'}</span>
          </button>
        </div>
      </div>

      {/* Core Archetype Summary Banner */}
      <div
        className="oj-card"
        style={{
          background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
          border: '2px solid #22c55e',
          marginBottom: '20px',
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
          <div>
            <div style={{ fontSize: '11px', color: '#166534', fontWeight: 600, textTransform: 'uppercase' }}>
              {isHi ? 'ऊर्जा प्रकार (Energy Type)' : 'Energy Type'}
            </div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#14532d', marginTop: '2px' }}>
              {isHi ? report.energyTypeHi : report.energyType}
            </div>
            <div style={{ fontSize: '12px', color: '#166534', marginTop: '4px' }}>
              <strong>{isHi ? 'रणनीति:' : 'Strategy:'}</strong> {isHi ? report.strategyHi : report.strategyEn}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '11px', color: '#166534', fontWeight: 600, textTransform: 'uppercase' }}>
              {isHi ? 'आंतरिक सत्ता (Inner Authority)' : 'Inner Authority'}
            </div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#14532d', marginTop: '2px' }}>
              {isHi ? report.authorityHi : report.authority}
            </div>
            <div style={{ fontSize: '12px', color: '#166534', marginTop: '4px' }}>
              <strong>{isHi ? 'परिभाषा:' : 'Definition:'}</strong> {isHi ? report.definitionTypeHi : report.definitionTypeEn}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '11px', color: '#166534', fontWeight: 600, textTransform: 'uppercase' }}>
              {isHi ? 'प्रोफ़ाइल (Profile)' : 'Profile'}
            </div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#14532d', marginTop: '2px' }}>
              {isHi ? report.profileHi : report.profileEn}
            </div>
            <div style={{ fontSize: '12px', color: '#166534', marginTop: '4px' }}>
              {isHi ? report.energyTypeHi : report.energyType}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '11px', color: '#166534', fontWeight: 600, textTransform: 'uppercase' }}>
              {isHi ? 'हस्ताक्षर व अशांत भाव' : 'Signature & Not-Self'}
            </div>
            <div style={{ fontSize: '12px', color: '#15803d', marginTop: '2px' }}>
              <strong>{isHi ? 'संतुष्टि/शांति:' : 'Signature:'}</strong> {isHi ? report.signatureHi : report.signatureEn}
            </div>
            <div style={{ fontSize: '12px', color: '#b91c1c', marginTop: '4px' }}>
              <strong>{isHi ? 'व्यग्रता (Not-Self):' : 'Not-Self:'}</strong> {isHi ? report.notSelfThemeHi : report.notSelfThemeEn}
            </div>
          </div>
        </div>

        <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #bbf7d0', fontSize: '12px', color: '#14532d' }}>
          <strong>{isHi ? 'अवतार क्रॉस (Incarnation Cross):' : 'Incarnation Cross:'}</strong> {isHi ? report.incarnationCrossHi : report.incarnationCrossEn}
        </div>
      </div>

      {/* Main Grid: BodyGraph SVG on Left, Centers breakdown on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '20px' }}>
        {/* SVG BodyGraph */}
        <div className="oj-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2 className="oj-card-title" style={{ alignSelf: 'flex-start' }}>
            <Layers size={18} color="#d97706" />
            {isHi ? '९ चक्र बॉडीग्राफ़ (Interactive BodyGraph)' : 'Interactive 9 Centers BodyGraph'}
          </h2>
          <div style={{ width: '100%', maxWidth: '340px', background: '#fafaf9', borderRadius: '12px', border: '1px solid #e7e5e4', padding: '10px' }}>
            <svg viewBox="0 0 300 480" style={{ width: '100%', height: 'auto', display: 'block' }}>
              {/* Channel Lines Connecting Centers */}
              <line x1="150" y1="50" x2="150" y2="85" stroke="#cbd5e1" strokeWidth="6" />
              <line x1="150" y1="110" x2="150" y2="150" stroke="#cbd5e1" strokeWidth="6" />
              <line x1="150" y1="180" x2="150" y2="230" stroke="#cbd5e1" strokeWidth="6" />
              <line x1="150" y1="260" x2="200" y2="260" stroke="#cbd5e1" strokeWidth="6" />
              <line x1="150" y1="260" x2="85" y2="320" stroke="#cbd5e1" strokeWidth="6" />
              <line x1="150" y1="260" x2="150" y2="325" stroke="#cbd5e1" strokeWidth="6" />
              <line x1="150" y1="260" x2="215" y2="320" stroke="#cbd5e1" strokeWidth="6" />
              <line x1="85" y1="345" x2="150" y2="415" stroke="#cbd5e1" strokeWidth="6" />
              <line x1="150" y1="355" x2="150" y2="415" stroke="#cbd5e1" strokeWidth="6" />
              <line x1="215" y1="345" x2="150" y2="415" stroke="#cbd5e1" strokeWidth="6" />

              {/* Render 9 Centers */}
              {report.centers.map((center) => {
                const pos = centerPositions[center.id];
                if (!pos) return null;
                const isSelected = selectedCenter?.id === center.id;
                const fillColor = center.defined ? pos.color : '#ffffff';
                const strokeColor = center.defined ? '#0f172a' : '#94a3b8';

                return (
                  <g
                    key={center.id}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setSelectedCenter(center)}
                  >
                    {pos.shape === 'triangle' && (
                      <polygon
                        points={`${pos.x},${pos.y - 18} ${pos.x - 22},${pos.y + 18} ${pos.x + 22},${pos.y + 18}`}
                        fill={fillColor}
                        stroke={isSelected ? '#0284c7' : strokeColor}
                        strokeWidth={isSelected ? '3' : '2'}
                      />
                    )}
                    {pos.shape === 'inv-triangle' && (
                      <polygon
                        points={`${pos.x - 22},${pos.y - 18} ${pos.x + 22},${pos.y - 18} ${pos.x},${pos.y + 18}`}
                        fill={fillColor}
                        stroke={isSelected ? '#0284c7' : strokeColor}
                        strokeWidth={isSelected ? '3' : '2'}
                      />
                    )}
                    {pos.shape === 'square' && (
                      <rect
                        x={pos.x - 20}
                        y={pos.y - 20}
                        width="40"
                        height="40"
                        rx="4"
                        fill={fillColor}
                        stroke={isSelected ? '#0284c7' : strokeColor}
                        strokeWidth={isSelected ? '3' : '2'}
                      />
                    )}
                    {pos.shape === 'diamond' && (
                      <polygon
                        points={`${pos.x},${pos.y - 22} ${pos.x + 22},${pos.y} ${pos.x},${pos.y + 22} ${pos.x - 22},${pos.y}`}
                        fill={fillColor}
                        stroke={isSelected ? '#0284c7' : strokeColor}
                        strokeWidth={isSelected ? '3' : '2'}
                      />
                    )}

                    {/* Center Label */}
                    <text
                      x={pos.x}
                      y={pos.y + 4}
                      textAnchor="middle"
                      fontSize="9"
                      fontWeight="bold"
                      fill={center.defined ? (pos.color === '#eab308' ? '#78350f' : '#ffffff') : '#64748b'}
                    >
                      {center.defined ? `${center.activeGates.length} G` : 'OPEN'}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '8px', textAlign: 'center' }}>
            {isHi
              ? 'रंगीन केंद्र = परिभाषित (स्थायी ऊर्जा) | श्वेत केंद्र = खुला (संवेदनशीलता व अनुकूलन)'
              : 'Colored Center = Defined (Consistent Energy) | White Center = Undefined (Open & Sensitive)'}
          </div>
        </div>

        {/* 9 Energy Centers Details */}
        <div className="oj-card">
          <h2 className="oj-card-title">
            <Sparkles size={18} color="#d97706" />
            {isHi ? '९ ऊर्जा केंद्रों की स्थिति एवं सक्रिय द्वार' : '9 Energy Centers Status & Active Gates'}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '430px', overflowY: 'auto' }}>
            {report.centers.map((center) => (
              <div
                key={center.id}
                onClick={() => setSelectedCenter(center)}
                style={{
                  border: selectedCenter?.id === center.id ? '2px solid #0284c7' : '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '10px',
                  background: center.defined ? '#f8fafc' : '#ffffff',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '13px', color: '#1e293b' }}>
                    {isHi ? center.nameHi : center.nameEn}
                  </div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: '12px',
                      background: center.defined ? '#dcfce7' : '#f1f5f9',
                      color: center.defined ? '#15803d' : '#64748b',
                    }}
                  >
                    {center.defined
                      ? isHi
                        ? 'परिभाषित (Defined)'
                        : 'Defined'
                      : isHi
                      ? 'अपरिभाषित (Open)'
                      : 'Undefined'}
                  </span>
                </div>
                <div style={{ fontSize: '11px', color: '#475569', marginTop: '3px' }}>
                  {isHi ? center.themeHi : center.themeEn}
                </div>
                {center.activeGates.length > 0 && (
                  <div style={{ fontSize: '11px', color: '#0369a1', marginTop: '4px' }}>
                    <strong>{isHi ? 'सक्रिय द्वार:' : 'Active Gates:'}</strong> {center.activeGates.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activated Gates Table */}
      <div className="oj-card">
        <h2 className="oj-card-title">
          <Award size={18} color="#d97706" />
          {isHi ? 'ग्रह-सक्रिय ६४ आई-चिंग द्वार (Planetary Gate Activations)' : 'Planetary Gate Activations (64 I-Ching Hexagrams)'}
        </h2>
        <div style={{ overflowX: 'auto' }}>
          <table className="oj-table" style={{ width: '100%', fontSize: '12px' }}>
            <thead>
              <tr>
                <th>{isHi ? 'ग्रह' : 'Planet'}</th>
                <th>{isHi ? 'आई-चिंग द्वार' : 'Gate Number'}</th>
                <th>{isHi ? 'पंक्ति (Line)' : 'Line'}</th>
                <th>{isHi ? 'द्वार का नाम व शास्त्रीय अर्थ' : 'Gate Name & Meaning'}</th>
                <th>{isHi ? 'संबंधित ऊर्जा केंद्र' : 'Energy Center'}</th>
              </tr>
            </thead>
            <tbody>
              {report.activeGates.map((gate) => (
                <tr key={`${gate.planetId}-${gate.gateNumber}`}>
                  <td style={{ fontWeight: 600 }}>{gate.planetNameHi} ({gate.planetId})</td>
                  <td style={{ fontWeight: 'bold', color: '#b45309' }}>Gate {gate.gateNumber}</td>
                  <td>Line {gate.line}</td>
                  <td>{isHi ? gate.gateNameHi : gate.gateNameEn}</td>
                  <td>{gate.centerNameHi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HumanDesignView;
